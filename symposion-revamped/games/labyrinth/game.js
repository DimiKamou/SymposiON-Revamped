// ============================================================
//  LABYRINTH · REIMAGINED — engine.js
//  Real-time, top-down, fog-of-war maze crawl.
//   • smooth glide movement (WASD / arrows)
//   • torch fuel burns down continuously; light shrinks with it
//   • Minotaur hunts via BFS; you HEAR it (panned steps + heartbeat)
//   • braziers gate quizzes → refuel torch + freeze the beast
//   • descend through the circles; reach the last → ESCAPE
//  Calls window.LabUI hooks for chrome; exposes window.LabEngine
//  + global openLabyrinth/closeLabyrinth.
// ============================================================
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const lerp = (a, b, t) => a + (b - a) * t;

  // palette
  const COL = {
    bg:    '#0C0806',
    wall:  '#C49028',
    wallHi:'#F0C674',
    floor: '#15100A',
    floorLit:'#241a0d',
    theseus:'#F2C879',
    mino:  '#C2502A',
    minoHot:'#FF6A3C',
    exit:  '#7FB6CC',
    exitHi:'#BFE3F0',
    brazier:'#D4922A',
  };

  // difficulty presets
  const DIFF = {
    calm:      { label:'ΉΡΕΜΟ',     en:'Calm',      tile:60, baseCols:9,  baseRows:7,  fuel:46, burn:1, lives:1, minoBase:96,  sense:5, maxDepth:5, braid:0.22 },
    normal:    { label:'ΚΑΝΟΝΙΚΟ',  en:'Normal',    tile:54, baseCols:11, baseRows:9,  fuel:34, burn:1, lives:1, minoBase:118, sense:6, maxDepth:7, braid:0.16 },
    nightmare: { label:'ΕΦΙΑΛΤΗΣ',  en:'Nightmare', tile:48, baseCols:13, baseRows:11, fuel:26, burn:1, lives:1, minoBase:145, sense:8, maxDepth:9, braid:0.10 },
  };

  let cnv, ctx, wrap;
  let S = null;                 // run state
  let raf = null, lastT = 0;
  const keys = {};
  let lang = () => (typeof siteLang !== 'undefined' ? siteLang : 'gr');

  // ── lifecycle ──────────────────────────────────────────
  function mount() {
    wrap = document.getElementById('labyrinth-wrap');
    cnv  = document.getElementById('lb-canvas');
    if (!cnv) return;
    ctx = cnv.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('keydown', onKey);
    document.addEventListener('keyup', onKeyUp);
  }
  function resize() {
    if (!cnv || !wrap) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = wrap.clientWidth, h = wrap.clientHeight;
    cnv.width = w * dpr; cnv.height = h * dpr;
    cnv.style.width = w + 'px'; cnv.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    S && (S.viewW = w, S.viewH = h);
  }

  function onKey(e) {
    if (!S) return;
    const k = e.key.toLowerCase();
    if (['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k)) e.preventDefault();
    keys[k] = true;
    if (k === 'm') { window.LabAudio && LabAudio.setMuted(!LabAudio.isMuted()); LabUI && LabUI.syncMute && LabUI.syncMute(); }
    if (k === 'escape' || k === 'p') togglePause();
    if (k === 'e' || k === 'f') doAction();
  }
  function onKeyUp(e) { keys[e.key.toLowerCase()] = false; }

  // ── start a run ────────────────────────────────────────
  function startRun(diffKey) {
    const d = DIFF[diffKey] || DIFF.normal;
    S = {
      diffKey, d,
      depth: 1,
      lives: d.lives,
      score: 0,
      braziersLit: 0,
      runTime: 0,
      phase: 'play',
      viewW: wrap.clientWidth, viewH: wrap.clientHeight,
      shake: 0, flash: 0, vignettePulse: 0,
    };
    window.LabAudio && LabAudio.start();
    LabUI && LabUI.enterGame && LabUI.enterGame();
    buildLevel();
    LabUI && LabUI.onDepth && LabUI.onDepth(S.depth, d, false);
    lastT = performance.now();
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  function buildLevel() {
    const d = S.d;
    const grow = S.depth - 1;
    const cols = d.baseCols + grow * 2;
    const rows = d.baseRows + grow * 2;
    const tile = d.tile;
    const maze = LabMaze.generate(cols, rows);
    const rects = LabMaze.wallRects(maze, tile, 9);

    // exit = farthest reachable cell from start (0,0)
    const dist = LabMaze.distanceFrom(maze, 0, 0);
    let exC = cols - 1, exR = rows - 1, best = -1;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const dd = dist[r * cols + c];
      if (dd > best) { best = dd; exC = c; exR = r; }
    }

    // braziers: dead-ends / sparse, away from start & exit
    const braz = [];
    const want = Math.max(5, Math.round(cols * rows / 9));
    const cand = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (c < 1 && r < 1) continue;
      if (c === exC && r === exR) continue;
      const cell = maze.cells[r][c];
      const walls = (cell.n?1:0)+(cell.e?1:0)+(cell.s?1:0)+(cell.w?1:0);
      cand.push({ c, r, dead: walls === 3 });
    }
    cand.sort((a, b) => (b.dead - a.dead) || (Math.random() - 0.5));
    for (let i = 0; i < cand.length && braz.length < want; i++) {
      const { c, r } = cand[i];
      if (braz.some(b => Math.abs(b.c - c) + Math.abs(b.r - r) < 2)) continue;
      braz.push({ c, r, x: (c + 0.5) * tile, y: (r + 0.5) * tile, lit: false, cd: 0, glow: 0 });
    }

    // minotaur spawns near the exit, hunting back toward you
    const mC = exC, mR = exR;

    S.maze = maze; S.cols = cols; S.rows = rows; S.tile = tile; S.rects = rects;
    S.mazeW = cols * tile; S.mazeH = rows * tile;
    S.exit = { c: exC, r: exR, x: (exC + 0.5) * tile, y: (exR + 0.5) * tile };
    S.braz = braz;
    buildDoors(exC, exR);
    rebuildColliders();
    S.player = { x: tile * 0.5, y: tile * 0.5, vx: 0, vy: 0, h: tile * 0.22, face: 0, bob: 0 };
    S.mino = {
      x: (mC + 0.5) * tile, y: (mR + 0.5) * tile, c: mC, r: mR,
      vx: 0, vy: 0, h: tile * 0.30, path: null, pathI: 0,
      repathT: 0, stepT: 0, state: 'wander', enrage: 0, freeze: 0, hot: 0, invul: 0,
    };
    S.fuel = 1;                       // 0..1
    S.fuelSeconds = (S.d.fuel + (S.depth - 1) * 1.5) * 1.32; // burns a bit slower now
    S.nearDoor = null;
    S.cam = { x: 0, y: 0 };
    S.tension = 0;
    centerCam(true);
  }

  function centerCam(snap) {
    const p = S.player;
    let tx = p.x - S.viewW / 2;
    let ty = p.y - S.viewH / 2;
    if (S.mazeW > S.viewW) tx = clamp(tx, -20, S.mazeW - S.viewW + 20); else tx = (S.mazeW - S.viewW) / 2;
    if (S.mazeH > S.viewH) ty = clamp(ty, -20, S.mazeH - S.viewH + 20); else ty = (S.mazeH - S.viewH) / 2;
    if (snap) { S.cam.x = tx; S.cam.y = ty; }
    else { S.cam.x = lerp(S.cam.x, tx, 0.12); S.cam.y = lerp(S.cam.y, ty, 0.12); }
  }

  // ── doors (lockable gates) ─────────────────────────────
  function buildDoors(exC, exR) {
    S.doors = [];
    S.doorMap = new Map();
    const m = S.maze, t = S.tile, cols = S.cols, rows = S.rows;
    const want = Math.min(3 + Math.floor(S.depth / 1.2), 8);
    const cand = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      // skip edges touching start or exit cells
      const nearKey = (c < 1 && r < 1);
      if (nearKey) continue;
      const cell = m.cells[r][c];
      if (!cell.e && c < cols - 1 && !(c + 1 === exC && r === exR) && !(c === exC && r === exR))
        cand.push({ c, r, dir: 'e' });
      if (!cell.s && r < rows - 1 && !(c === exC && r + 1 === exR) && !(c === exC && r === exR))
        cand.push({ c, r, dir: 's' });
    }
    // shuffle + space them out
    for (let i = cand.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [cand[i], cand[j]] = [cand[j], cand[i]]; }
    for (const e of cand) {
      if (S.doors.length >= want) break;
      if (S.doors.some(d => Math.abs(d.c - e.c) + Math.abs(d.r - e.r) < 3)) continue;
      const door = makeDoor(e.c, e.r, e.dir);
      S.doors.push(door);
      S.doorMap.set(e.c + ',' + e.r + ',' + e.dir, door);
    }
  }
  function makeDoor(c, r, dir) {
    const t = S.tile;
    const x0 = c * t, y0 = r * t;
    const d = { c, r, dir, open: true, cd: 0, anim: 1 };  // anim 1=open,0=closed
    if (dir === 'e') { d.x = x0 + t; d.y = y0 + t / 2; d.rect = { x: x0 + t - 5, y: y0 + 2, w: 10, h: t - 4 }; d.horiz = false; }
    else { d.x = x0 + t / 2; d.y = y0 + t; d.rect = { x: x0 + 2, y: y0 + t - 5, w: t - 4, h: 10 }; d.horiz = true; }
    return d;
  }
  // canonical (cell,dir) for the edge between two adjacent cells
  function edgeOf(c, r, nc, nr) {
    if (nc === c + 1) return c + ',' + r + ',e';
    if (nc === c - 1) return nc + ',' + nr + ',e';
    if (nr === r + 1) return c + ',' + r + ',s';
    if (nr === r - 1) return nc + ',' + nr + ',s';
    return null;
  }
  function doorBlocked(c, r, nc, nr) {
    const k = edgeOf(c, r, nc, nr);
    if (!k) return false;
    const d = S.doorMap.get(k);
    return d ? !d.open : false;
  }
  function rebuildColliders() {
    S.colliders = S.rects.slice();
    for (const d of S.doors) if (!d.open) S.colliders.push(d.rect);
  }
  function playerOverlaps(rect) {
    const p = S.player, h = p.h;
    return p.x + h > rect.x && p.x - h < rect.x + rect.w && p.y + h > rect.y && p.y - h < rect.y + rect.h;
  }
  function toggleDoor(d) {
    if (!d || d.cd > 0) return;
    // don't close a door on top of yourself
    if (d.open && playerOverlaps(d.rect)) return;
    d.open = !d.open;
    d.cd = 0.4;
    rebuildColliders();
    window.LabAudio && LabAudio.sting('door');
  }
  function nearestDoor() {
    const p = S.player, t = S.tile; let best = null, bd = t * 1.0;
    for (const d of S.doors) { const dist = Math.hypot(p.x - d.x, p.y - d.y); if (dist < bd) { bd = dist; best = d; } }
    return best;
  }
  function doAction() { if (S && S.phase === 'play') toggleDoor(S.nearDoor); }

  // ── main loop ──────────────────────────────────────────
  function frame(now) {
    const dt = Math.min(0.04, (now - lastT) / 1000);
    lastT = now;
    if (S && S.phase === 'play') { update(dt); }
    if (S) render();
    raf = requestAnimationFrame(frame);
  }

  function update(dt) {
    S.runTime += dt;
    S.vignettePulse += dt;

    // ── torch burn ──
    const burnMul = S.mino.enrage > 0 ? 1.35 : 1;
    S.fuel -= (dt / S.fuelSeconds) * burnMul;
    if (S.fuel <= 0) { S.fuel = 0; }

    // ── input → player accel ──
    const p = S.player;
    let ax = 0, ay = 0;
    if (keys['a'] || keys['arrowleft'])  ax -= 1;
    if (keys['d'] || keys['arrowright']) ax += 1;
    if (keys['w'] || keys['arrowup'])    ay -= 1;
    if (keys['s'] || keys['arrowdown'])  ay += 1;
    const len = Math.hypot(ax, ay) || 1;
    ax /= len; ay /= len;
    if (S.touchVec) { ax += S.touchVec.x; ay += S.touchVec.y; const l2 = Math.hypot(ax, ay); if (l2 > 1) { ax /= l2; ay /= l2; } }
    const maxSpd = 198 * (S.fuel <= 0 ? 0.74 : 1);   // sluggish in the dark
    const accel = 1500, fric = 9;
    p.vx += ax * accel * dt; p.vy += ay * accel * dt;
    p.vx -= p.vx * fric * dt; p.vy -= p.vy * fric * dt;
    const spd = Math.hypot(p.vx, p.vy);
    if (spd > maxSpd) { p.vx = p.vx / spd * maxSpd; p.vy = p.vy / spd * maxSpd; }
    // collision sweep (walls + closed doors)
    const _ox = p.x;
    p.x = sweepX(_ox, p.y, p.h, p.vx * dt, S.colliders);
    p.y = sweepY(_ox, p.y, p.h, p.vy * dt, S.colliders);
    if (Math.abs(p.vx) > 4 || Math.abs(p.vy) > 4) p.face = Math.atan2(p.vy, p.vx);
    p.bob += spd * dt * 0.03;

    centerCam(false);

    // ── doors ──
    for (const d of S.doors) if (d.cd > 0) d.cd -= dt;
    S.nearDoor = nearestDoor();

    // ── braziers ──
    for (const b of S.braz) {
      b.glow = lerp(b.glow, b.lit ? 1 : 0, 0.08);
      if (b.cd > 0) b.cd -= dt;
      if (!b.lit && b.cd <= 0) {
        if (Math.hypot(p.x - b.x, p.y - b.y) < S.tile * 0.42) triggerQuiz(b);
      }
    }

    // ── exit ──
    if (Math.hypot(p.x - S.exit.x, p.y - S.exit.y) < S.tile * 0.42) { reachExit(); return; }

    // ── minotaur ──
    updateMino(dt);

    // ── decay fx ──
    S.shake = Math.max(0, S.shake - dt * 3);
    S.flash = Math.max(0, S.flash - dt * 2.2);

    // ── tension → audio ──
    const cellDist = pathCellDist();
    const proxim = clamp(1 - cellDist / (S.d.sense + 2), 0, 1);
    const darkFear = (1 - S.fuel) * 0.35;
    S.tension = clamp(Math.max(proxim, S.mino.state === 'hunt' ? 0.45 : 0) + darkFear, 0, 1);
    window.LabAudio && LabAudio.setTension(S.tension);

    pushHud();
  }

  function updateMino(dt) {
    const m = S.mino, p = S.player, t = S.tile;
    if (m.invul > 0) m.invul -= dt;
    if (m.hot > 0) m.hot -= dt;
    if (m.enrage > 0) m.enrage -= dt;
    if (m.freeze > 0) { m.freeze -= dt; return; }   // frozen by a correct answer

    m.c = clamp(Math.floor(m.x / t), 0, S.cols - 1);
    m.r = clamp(Math.floor(m.y / t), 0, S.rows - 1);
    const pc = clamp(Math.floor(p.x / t), 0, S.cols - 1);
    const pr = clamp(Math.floor(p.y / t), 0, S.rows - 1);

    // sense radius grows when your torch is low (it hears you in the dark)
    const sense = S.d.sense + (S.fuel < 0.34 ? 2 : 0) + (S.depth - 1 >= 4 ? 1 : 0);

    m.repathT -= dt;
    if (m.repathT <= 0) {
      const path = LabMaze.bfsPath(S.maze, m.c, m.r, pc, pr, doorBlocked);
      const cellDist = path ? path.length - 1 : 99;
      m.state = cellDist <= sense ? 'hunt' : 'wander';
      if (m.state === 'hunt') {
        m.repathT = 0.22;   // repath quickly while hunting
        if (path && path.length > 1) { m.path = path; m.pathI = 1; }
      } else {
        m.repathT = 0.9;    // linger in each direction → traverses whole rooms
        // Wander: pick a 2-cell path (current→neighbour→next) so the beast
        // strides through corridors rather than hovering at one junction.
        const opts = LabMaze.open(S.maze, m.c, m.r, doorBlocked);
        if (opts.length) {
          const [nc, nr] = opts[(Math.random() * opts.length) | 0];
          const nextOpts = LabMaze.open(S.maze, nc, nr, doorBlocked);
          const further  = nextOpts.filter(([c, r]) => !(c === m.c && r === m.r));
          if (further.length && Math.random() > 0.25) {
            const [fc, fr] = further[(Math.random() * further.length) | 0];
            m.path = [[m.c, m.r], [nc, nr], [fc, fr]];
          } else {
            m.path = [[m.c, m.r], [nc, nr]];
          }
          m.pathI = 1;
        }
      }
    }

    // follow path node toward its center
    const baseSpd = S.d.minoBase + (S.depth - 1) * 7;
    const spd = (m.state === 'hunt' ? baseSpd : baseSpd * 0.78) * (m.enrage > 0 ? 1.3 : 1);
    if (m.path && m.pathI < m.path.length) {
      const [tc, tr] = m.path[m.pathI];
      const tx = (tc + 0.5) * t, ty = (tr + 0.5) * t;
      const dx = tx - m.x, dy = ty - m.y, dl = Math.hypot(dx, dy) || 1;
      m.x += dx / dl * spd * dt; m.y += dy / dl * spd * dt;
      m.vx = dx / dl; m.vy = dy / dl;
      if (dl < spd * dt + 1.5) {
        m.pathI++;
        // footstep when it lands on a new tile — panned + heartbeat already scales
        const pan = clamp(((m.x - S.cam.x) - S.viewW / 2) / (S.viewW / 2), -1, 1);
        const inten = clamp(1 - pathCellDist() / (sense + 2), 0.15, 1);
        window.LabAudio && LabAudio.footstep(pan, inten * (m.state === 'hunt' ? 1 : 0.5));
      }
    }

    // catch the player
    const reach = (p.h + m.h) * 0.9;
    if (m.invul <= 0 && Math.hypot(p.x - m.x, p.y - m.y) < reach) hitPlayer();
  }

  function pathCellDist() {
    const m = S.mino, p = S.player, t = S.tile;
    const mc = clamp(Math.floor(m.x / t), 0, S.cols - 1), mr = clamp(Math.floor(m.y / t), 0, S.rows - 1);
    const pc = clamp(Math.floor(p.x / t), 0, S.cols - 1), pr = clamp(Math.floor(p.y / t), 0, S.rows - 1);
    const path = LabMaze.bfsPath(S.maze, mc, mr, pc, pr, doorBlocked);
    return path ? path.length - 1 : 99;
  }

  function hitPlayer() {
    // Getting caught = instant game over (no second chances)
    S.shake = 1; S.flash = 1;
    window.LabAudio && LabAudio.sting('hurt');
    S.lives = 0;
    endGame(false);
  }

  // ── quiz (brazier) ─────────────────────────────────────
  function triggerQuiz(b) {
    S.phase = 'quiz';
    S._quizBraz = b;
    if (!S.qPool || S.qIdx >= S.qPool.length) { S.qPool = LabQ.shuffled(); S.qIdx = 0; }
    const idx = S.qPool[S.qIdx++];
    S._quizObj = LabQ.get(idx);
    window.LabAudio && LabAudio.sting('door');
    LabUI && LabUI.onQuiz && LabUI.onQuiz(S._quizObj, lang());
  }

  function answerQuiz(choice) {
    const obj = S._quizObj, b = S._quizBraz;
    const correct = choice === obj.c;
    if (correct) {
      b.lit = true; S.braziersLit++;
      S.fuel = 1;                       // full refuel
      S.mino.freeze = 2.6;              // beast freezes
      S.score += 150;
      window.LabAudio && LabAudio.sting('correct');
      setTimeout(() => { window.LabAudio && LabAudio.sting('pickup'); }, 220);
    } else {
      b.cd = 6;                          // can retry later
      S.fuel = Math.max(0.06, S.fuel - 0.28);
      S.mino.enrage = 5;                 // it surges
      window.LabAudio && LabAudio.sting('wrong');
    }
    return correct;
  }
  function resumeFromQuiz() { if (S) { S.phase = 'play'; lastT = performance.now(); } }

  // ── descend / win ──────────────────────────────────────
  function reachExit() {
    S.score += Math.round(200 + S.fuel * 200);
    if (S.depth >= S.d.maxDepth) { endGame(true); return; }
    S.depth++;
    S.phase = 'descend';
    window.LabAudio && LabAudio.sting('descend');
    LabUI && LabUI.onDepth && LabUI.onDepth(S.depth, S.d, true);
    setTimeout(() => { if (!S) return; buildLevel(); S.phase = 'play'; lastT = performance.now(); LabUI && LabUI.hideDepth && LabUI.hideDepth(); }, 1500);
  }

  function endGame(win) {
    S.phase = win ? 'win' : 'lose';
    window.LabAudio && LabAudio.sting(win ? 'win' : 'lose');
    window.LabAudio && LabAudio.setTension(0);
    const best = saveScore(win);
    if(typeof awardGameRewards==='function' && S.score > 0){ awardGameRewards('labyrinth', { score: S.score, perfect: win && S.lives === S.d.lives }); }
    LabUI && LabUI.onResult && LabUI.onResult({
      win, depth: S.depth, maxDepth: S.d.maxDepth, score: S.score,
      time: S.runTime, braz: S.braziersLit, diffKey: S.diffKey, best,
    }, lang());
  }

  function togglePause() {
    if (!S) return;
    if (S.phase === 'play') { S.phase = 'paused'; LabUI && LabUI.onPause && LabUI.onPause(true); }
    else if (S.phase === 'paused') { S.phase = 'play'; lastT = performance.now(); LabUI && LabUI.onPause && LabUI.onPause(false); }
  }

  // ── leaderboard (localStorage) ─────────────────────────
  function lbKey() { return 'lab_reimagined_v1'; }
  function loadScores() {
    try { return JSON.parse(localStorage.getItem(lbKey())) || {}; } catch (e) { return {}; }
  }
  function saveScore(win) {
    const all = loadScores();
    const k = S.diffKey;
    const cur = all[k] || { score: 0, depth: 0, time: 0, escaped: false };
    const better = {
      score: Math.max(cur.score, S.score),
      depth: Math.max(cur.depth, S.depth),
      time: win ? (cur.time ? Math.min(cur.time, S.runTime) : S.runTime) : cur.time,
      escaped: cur.escaped || win,
    };
    all[k] = better;
    try { localStorage.setItem(lbKey(), JSON.stringify(all)); } catch (e) {}
    return better;
  }

  // ── HUD push ───────────────────────────────────────────
  function pushHud() {
    LabUI && LabUI.onHud && LabUI.onHud({
      lives: S.lives, fuel: S.fuel, depth: S.depth, maxDepth: S.d.maxDepth,
      score: S.score, time: S.runTime, tension: S.tension,
      hunting: S.mino.state === 'hunt' && S.mino.freeze <= 0,
    });
  }

  // ── collision sweeps (axis separated AABB) ─────────────
  function sweepX(x, y, h, dx, rects) {
    let nx = x + dx;
    for (const r of rects) {
      if (nx + h > r.x && nx - h < r.x + r.w && y + h > r.y && y - h < r.y + r.h) {
        if (dx > 0) nx = r.x - h - 0.01; else if (dx < 0) nx = r.x + r.w + h + 0.01;
      }
    }
    return nx;
  }
  function sweepY(x, y, h, dy, rects) {
    let ny = y + dy;
    for (const r of rects) {
      if (x + h > r.x && x - h < r.x + r.w && ny + h > r.y && ny - h < r.y + r.h) {
        if (dy > 0) ny = r.y - h - 0.01; else if (dy < 0) ny = r.y + r.h + h + 0.01;
      }
    }
    return ny;
  }

  // ── RENDER ─────────────────────────────────────────────
  function render() {
    const w = S.viewW, h = S.viewH;
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    let shx = 0, shy = 0;
    if (S.shake > 0) { shx = (Math.random() - 0.5) * 16 * S.shake; shy = (Math.random() - 0.5) * 16 * S.shake; }
    ctx.translate(-S.cam.x + shx, -S.cam.y + shy);

    drawFloor();
    drawWalls();
    drawDoors();
    drawExit();
    drawBraziers();
    drawMino();
    drawPlayer();

    ctx.restore();

    drawDarkness();
    drawFlash();
  }

  function inView(x, y, pad) {
    return x > S.cam.x - pad && x < S.cam.x + S.viewW + pad && y > S.cam.y - pad && y < S.cam.y + S.viewH + pad;
  }

  function drawFloor() {
    // subtle warm floor only near the player (most is hidden by darkness anyway)
    const t = S.tile;
    const c0 = Math.max(0, Math.floor(S.cam.x / t)), c1 = Math.min(S.cols - 1, Math.ceil((S.cam.x + S.viewW) / t));
    const r0 = Math.max(0, Math.floor(S.cam.y / t)), r1 = Math.min(S.rows - 1, Math.ceil((S.cam.y + S.viewH) / t));
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
      ctx.fillStyle = ((c + r) & 1) ? '#100b07' : '#130d08';
      ctx.fillRect(c * t, r * t, t, t);
    }
  }

  function drawWalls() {
    ctx.save();
    ctx.shadowColor = 'rgba(196,144,40,0.55)';
    ctx.shadowBlur = 8;
    for (const r of S.rects) {
      if (!inView(r.x, r.y, 60)) continue;
      const grd = ctx.createLinearGradient(r.x, r.y, r.x + r.w, r.y + r.h);
      grd.addColorStop(0, '#7a5414');
      grd.addColorStop(0.5, COL.wall);
      grd.addColorStop(1, '#8a5f18');
      ctx.fillStyle = grd;
      ctx.fillRect(r.x, r.y, r.w, r.h);
    }
    ctx.shadowBlur = 0;
    // bright center seam
    ctx.fillStyle = 'rgba(240,198,116,0.5)';
    for (const r of S.rects) {
      if (!inView(r.x, r.y, 60)) continue;
      if (r.w > r.h) ctx.fillRect(r.x, r.y + r.h / 2 - 0.6, r.w, 1.2);
      else ctx.fillRect(r.x + r.w / 2 - 0.6, r.y, 1.2, r.h);
    }
    ctx.restore();
  }

  function drawDoors() {
    const t = S.tile;
    for (const d of S.doors) {
      d.anim = lerp(d.anim, d.open ? 1 : 0, 0.25);
      if (!inView(d.x, d.y, 50)) continue;
      const closed = 1 - d.anim;
      const near = S.nearDoor === d;
      ctx.save();
      // jamb posts (always faint)
      ctx.fillStyle = 'rgba(150,110,50,0.55)';
      if (!d.horiz) {
        ctx.fillRect(d.x - 4, d.y - t / 2, 8, t * 0.16);
        ctx.fillRect(d.x - 4, d.y + t / 2 - t * 0.16, 8, t * 0.16);
      } else {
        ctx.fillRect(d.x - t / 2, d.y - 4, t * 0.16, 8);
        ctx.fillRect(d.x + t / 2 - t * 0.16, d.y - 4, t * 0.16, 8);
      }
      // the gate bars (visible when closing)
      if (closed > 0.02) {
        ctx.globalAlpha = closed;
        ctx.shadowColor = near ? '#F0C674' : '#B07A2A';
        ctx.shadowBlur = (near ? 16 : 8) * closed;
        const col = near ? '#E0A24C' : '#B07A2A';
        ctx.fillStyle = col;
        const span = t - 6, half = span / 2 * closed;
        if (!d.horiz) {
          ctx.fillRect(d.x - 4, d.y - half, 8, half * 2);
          ctx.strokeStyle = 'rgba(30,18,6,0.7)'; ctx.lineWidth = 2;
          for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(d.x - 4, d.y + i * span * 0.22 * closed); ctx.lineTo(d.x + 4, d.y + i * span * 0.22 * closed); ctx.stroke(); }
        } else {
          ctx.fillRect(d.x - half, d.y - 4, half * 2, 8);
          ctx.strokeStyle = 'rgba(30,18,6,0.7)'; ctx.lineWidth = 2;
          for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(d.x + i * span * 0.22 * closed, d.y - 4); ctx.lineTo(d.x + i * span * 0.22 * closed, d.y + 4); ctx.stroke(); }
        }
        // lock bead
        ctx.globalAlpha = closed; ctx.shadowBlur = 0;
        ctx.fillStyle = '#2a1a08';
        ctx.beginPath(); ctx.arc(d.x, d.y, 4, 0, TAU); ctx.fill();
        ctx.fillStyle = near ? '#F0C674' : '#C49028';
        ctx.beginPath(); ctx.arc(d.x, d.y, 2.2, 0, TAU); ctx.fill();
      }
      // toggle prompt when adjacent
      if (near) {
        ctx.globalAlpha = 1; ctx.shadowBlur = 0;
        const py = d.y - t * 0.46;
        ctx.fillStyle = 'rgba(12,8,4,0.85)';
        ctx.strokeStyle = '#C49028'; ctx.lineWidth = 1;
        roundRect(d.x - 15, py - 11, 30, 20, 5); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#F0C674'; ctx.font = '700 11px JetBrains Mono, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText('E', d.x, py);
      }
      ctx.restore();
    }
    ctx.textBaseline = 'alphabetic';
  }

  function roundRect(x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  function drawExit() {
    const e = S.exit, t = S.tile, pulse = 0.5 + 0.5 * Math.sin(S.vignettePulse * 2.2);
    ctx.save();
    ctx.translate(e.x, e.y);
    // aegean portal glow
    ctx.shadowColor = COL.exit; ctx.shadowBlur = 26 + pulse * 18;
    ctx.strokeStyle = COL.exit; ctx.lineWidth = 2.4;
    for (let i = 0; i < 3; i++) {
      ctx.globalAlpha = 0.7 - i * 0.18;
      ctx.beginPath();
      ctx.arc(0, 0, t * (0.16 + i * 0.1) + pulse * 3, 0, TAU);
      ctx.stroke();
    }
    ctx.globalAlpha = 1; ctx.shadowBlur = 14;
    // descending chevrons (deeper) or open arch (final)
    const final = S.depth >= S.d.maxDepth;
    ctx.strokeStyle = COL.exitHi; ctx.lineWidth = 2.6;
    if (final) {
      ctx.beginPath(); ctx.arc(0, 4, t * 0.22, Math.PI, TAU); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-t * 0.22, 4); ctx.lineTo(-t * 0.22, t * 0.2); ctx.moveTo(t * 0.22, 4); ctx.lineTo(t * 0.22, t * 0.2); ctx.stroke();
    } else {
      for (let i = -1; i <= 1; i++) {
        ctx.beginPath();
        ctx.moveTo(-t * 0.16, i * 7 - 6 + pulse * 2);
        ctx.lineTo(0, i * 7 - 1 + pulse * 2);
        ctx.lineTo(t * 0.16, i * 7 - 6 + pulse * 2);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawBraziers() {
    const t = S.tile;
    for (const b of S.braz) {
      if (!inView(b.x, b.y, 40)) continue;
      ctx.save(); ctx.translate(b.x, b.y);
      const lit = b.glow;
      // bowl
      ctx.strokeStyle = lit > 0.4 ? COL.brazier : 'rgba(150,110,50,0.5)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-t * 0.16, t * 0.04); ctx.lineTo(t * 0.16, t * 0.04);
      ctx.lineTo(t * 0.1, t * 0.16); ctx.lineTo(-t * 0.1, t * 0.16); ctx.closePath(); ctx.stroke();
      if (lit > 0.05) {
        const fl = 0.7 + 0.3 * Math.sin(S.vignettePulse * 9 + b.x);
        ctx.shadowColor = COL.brazier; ctx.shadowBlur = 24 * lit;
        const g = ctx.createRadialGradient(0, -t * 0.08, 0, 0, -t * 0.08, t * 0.2 * fl);
        g.addColorStop(0, 'rgba(255,220,150,' + lit + ')');
        g.addColorStop(0.5, 'rgba(212,146,42,' + (lit * 0.8) + ')');
        g.addColorStop(1, 'rgba(180,70,20,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(0, -t * 0.08, t * 0.12 * fl, t * 0.2 * fl, 0, 0, TAU); ctx.fill();
      } else {
        // unlit hint glyph
        ctx.shadowBlur = 0; ctx.globalAlpha = 0.5;
        ctx.fillStyle = 'rgba(212,146,42,0.7)'; ctx.font = '600 11px JetBrains Mono, monospace';
        ctx.textAlign = 'center'; ctx.fillText('?', 0, -t * 0.04);
      }
      ctx.restore();
    }
  }

  function drawMino() {
    const m = S.mino, t = S.tile;
    // visible only inside torchlight or when very close
    const dPlayer = Math.hypot(m.x - S.player.x, m.y - S.player.y);
    const torchR = torchRadius();
    const vis = dPlayer < torchR * 1.05 || dPlayer < t * 1.6;
    if (!vis && m.hot <= 0) return;
    ctx.save(); ctx.translate(m.x, m.y);
    const hot = m.hot > 0 || m.enrage > 0;
    const breathe = 1 + 0.04 * Math.sin(S.vignettePulse * 4);
    ctx.scale(breathe, breathe);
    const body = m.freeze > 0 ? '#5a6a8a' : (hot ? COL.minoHot : COL.mino);
    ctx.shadowColor = m.freeze > 0 ? '#7FB6CC' : (hot ? '#ff5a2a' : '#c2502a');
    ctx.shadowBlur = hot ? 30 : 16;
    // bull-head silhouette: muzzle + horns
    ctx.fillStyle = body;
    ctx.beginPath();
    ctx.ellipse(0, t * 0.04, t * 0.17, t * 0.21, 0, 0, TAU); ctx.fill();   // head
    ctx.beginPath(); ctx.ellipse(0, t * 0.18, t * 0.1, t * 0.08, 0, 0, TAU); ctx.fill(); // muzzle
    // horns
    ctx.strokeStyle = '#e7d2a0'; ctx.lineWidth = t * 0.05; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-t * 0.12, -t * 0.08); ctx.quadraticCurveTo(-t * 0.26, -t * 0.18, -t * 0.22, -t * 0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(t * 0.12, -t * 0.08); ctx.quadraticCurveTo(t * 0.26, -t * 0.18, t * 0.22, -t * 0.32); ctx.stroke();
    // eyes
    ctx.shadowBlur = 10; ctx.shadowColor = '#ff3a10';
    ctx.fillStyle = m.freeze > 0 ? '#bfe3f0' : '#ffd24a';
    ctx.beginPath(); ctx.arc(-t * 0.06, 0, t * 0.03, 0, TAU); ctx.arc(t * 0.06, 0, t * 0.03, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawPlayer() {
    const p = S.player, t = S.tile;
    ctx.save(); ctx.translate(p.x, p.y);
    const bob = Math.sin(p.bob) * 1.5;
    // cloak
    ctx.shadowColor = '#000'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#2a1c0e';
    ctx.beginPath(); ctx.ellipse(0, bob, t * 0.16, t * 0.2, 0, 0, TAU); ctx.fill();
    // lit body
    ctx.shadowColor = COL.theseus; ctx.shadowBlur = 18;
    ctx.fillStyle = COL.theseus;
    ctx.beginPath(); ctx.arc(0, bob - t * 0.03, t * 0.1, 0, TAU); ctx.fill();
    // torch flame in facing hand
    const fx = Math.cos(p.face) * t * 0.2, fy = Math.sin(p.face) * t * 0.2;
    const fl = 0.8 + 0.2 * Math.sin(S.vignettePulse * 12);
    ctx.shadowColor = '#ffb347'; ctx.shadowBlur = 26 * fl * (0.4 + S.fuel * 0.6);
    const fg = ctx.createRadialGradient(fx, fy + bob, 0, fx, fy + bob, t * 0.14 * fl);
    fg.addColorStop(0, 'rgba(255,235,180,' + (0.5 + S.fuel * 0.5) + ')');
    fg.addColorStop(0.5, 'rgba(255,150,40,' + (0.4 + S.fuel * 0.4) + ')');
    fg.addColorStop(1, 'rgba(200,60,10,0)');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.arc(fx, fy + bob, t * 0.14 * fl, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function torchRadius() {
    const base = Math.min(S.viewW, S.viewH);
    // light shrinks hard as fuel drains; never fully zero (a faint ember remains)
    const f = S.fuel;
    const minR = S.tile * 0.78;
    const maxR = base * 0.34;   // smaller torch to start — the dark presses closer
    const flick = 1 + 0.03 * Math.sin(S.vignettePulse * 18) + 0.02 * Math.sin(S.vignettePulse * 7.3);
    return (minR + (maxR - minR) * Math.pow(f, 0.7)) * flick;
  }

  function drawDarkness() {
    const w = S.viewW, h = S.viewH;
    const px = S.player.x - S.cam.x, py = S.player.y - S.cam.y;
    const R = torchRadius();
    // vignette darkness with a clear torch hole
    const g = ctx.createRadialGradient(px, py, R * 0.28, px, py, R);
    g.addColorStop(0, 'rgba(10,6,4,0)');
    g.addColorStop(0.55, 'rgba(8,5,3,0.18)');
    g.addColorStop(0.82, 'rgba(6,4,2,0.72)');
    g.addColorStop(1, 'rgba(4,2,1,0.992)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // warm torch tint (additive)
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const warm = ctx.createRadialGradient(px, py, 0, px, py, R * 0.8);
    const wi = 0.06 + S.fuel * 0.10;
    warm.addColorStop(0, 'rgba(212,146,42,' + wi + ')');
    warm.addColorStop(0.6, 'rgba(160,80,20,' + (wi * 0.5) + ')');
    warm.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, w, h);
    // red dread when hunted & close
    if (S.tension > 0.55) {
      const dread = (S.tension - 0.55) / 0.45;
      const rg = ctx.createRadialGradient(px, py, R * 0.5, px, py, Math.max(w, h));
      rg.addColorStop(0, 'rgba(0,0,0,0)');
      rg.addColorStop(1, 'rgba(150,20,10,' + (0.22 * dread) + ')');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
    }
    ctx.restore();
  }

  function drawFlash() {
    if (S.flash > 0) {
      ctx.fillStyle = 'rgba(190,40,20,' + (S.flash * 0.42) + ')';
      ctx.fillRect(0, 0, S.viewW, S.viewH);
    }
  }

  // ── public API ─────────────────────────────────────────
  function openLabyrinth(cfg) {
    // Subject loading: honour an explicit question set (the site also pre-mutates window.LB_Q).
    if (cfg && Array.isArray(cfg.questions) && cfg.questions.length) {
      LabQ.load(cfg.questions);
    }
    window._lbSubjectLabel = (cfg && (cfg.datasetLabel || cfg.title)) || window._lbSubjectLabel || null;
    const ov = document.getElementById('labyrinth-overlay');
    if (ov) ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof window._injectIllus === 'function') window._injectIllus(ov);
    if (!document.getElementById('lb-canvas')) { LabUI && LabUI.build && LabUI.build(); }
    mount();
    window.LabAudio && LabAudio.init();
    LabUI && LabUI.showMenu && LabUI.showMenu(loadScores());
  }
  function closeLabyrinth() {
    if (raf) { cancelAnimationFrame(raf); raf = null; }
    window.LabAudio && LabAudio.stop();
    S = null;
    window.removeEventListener('resize', resize);
    document.removeEventListener('keydown', onKey);
    document.removeEventListener('keyup', onKeyUp);
    const ov = document.getElementById('labyrinth-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
  }

  window.LabEngine = {
    startRun, answerQuiz, resumeFromQuiz, togglePause,
    loadScores, mount, get state() { return S; },
    _step(dt) { dt = dt || 0.016; if (S && S.phase === 'play') update(dt); if (S) render(); }, // verification/headless hook
    _setKey(k, v) { keys[k] = v; },
    setMoveVector(x, y) { if (S) S.touchVec = (x === 0 && y === 0) ? null : { x, y }; },
    doAction,
    hasNearDoor() { return !!(S && S.nearDoor); },
    quitToMenu() { if (raf) cancelAnimationFrame(raf); raf = null; S = null; window.LabAudio && LabAudio.stop(); LabUI && LabUI.showMenu && LabUI.showMenu(loadScores()); },
    DIFF,
  };
  window.openLabyrinth = openLabyrinth;
  window.closeLabyrinth = closeLabyrinth;
})();
