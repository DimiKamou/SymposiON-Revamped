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

  // prefers-reduced-motion → skip ambient particles, soften shake
  const RMQ = (typeof window.matchMedia === 'function') ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reduced = () => !!(RMQ && RMQ.matches);

  // deterministic 2-int hash → [0,1)  (stable mosaic / masonry jitter)
  function hash2(a, b) {
    let h = (a * 374761393 + b * 668265263) | 0;
    h = ((h ^ (h >>> 13)) * 1274126177) | 0;
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }

  // ── particles (pure presentation) ──────────────────────
  const parts = [];
  function spawn(p) { if (parts.length < 260) { p.t = 0; parts.push(p); } }
  function burst(x, y, col, n, speed) {
    n = reduced() ? Math.min(8, n) : n;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * TAU, v = speed * (0.35 + Math.random() * 0.85);
      spawn({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
        life: 0.5 + Math.random() * 0.55, size: 1.4 + Math.random() * 2.2,
        col, add: true, drag: 3.2, shrink: true, alpha: 0.9 });
    }
  }
  function updateParts(dt) {
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      p.t += dt;
      if (p.t >= p.life) { parts.splice(i, 1); continue; }
      const dg = (p.drag || 0) * dt;
      p.vx -= p.vx * dg; p.vy -= p.vy * dg;
      if (p.grav) p.vy += p.grav * dt;
      if (p.wig) p.x += Math.sin(p.t * 9 + (p.seed || 0)) * p.wig * dt;
      p.x += p.vx * dt; p.y += p.vy * dt;
    }
  }
  function drawParts() {
    for (const p of parts) {
      const k = 1 - p.t / p.life;
      ctx.globalAlpha = k * (p.alpha == null ? 0.85 : p.alpha);
      ctx.globalCompositeOperation = p.add ? 'lighter' : 'source-over';
      if (p.ring) {
        // expanding stroked ring (footstep ripples)
        ctx.strokeStyle = p.col;
        ctx.lineWidth = p.lw || 1.2;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 + (1 - k) * (p.grow || 2.4)), 0, TAU); ctx.stroke();
      } else if (p.txt) {
        // floating score text (kinetic feedback)
        ctx.fillStyle = p.col;
        ctx.font = '700 15px "JetBrains Mono", ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(p.txt, p.x, p.y);
        ctx.textAlign = 'left';
      } else {
        ctx.fillStyle = p.col;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (p.shrink ? (0.35 + 0.65 * k) : 1), 0, TAU); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }
  // floating score text at a world point — pure presentation
  function floatText(x, y, str, col) {
    spawn({ x, y, vx: 0, vy: -26, life: 1.15, size: 0, txt: str, col, add: true, drag: 1.2, alpha: 0.95 });
  }

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
    // presentation state
    S.thread = [{ x: S.player.x, y: S.player.y }];   // Ariadne's thread trail
    S.emberT = 0; S.dustT = 0; S.breathT = 0;
    S.stepPh = 0; S.lowWarned = false;               // footstep ripple phase + torch-gutter cue
    S.lightPulse = 0; S.flashGold = 0;
    S.shock = 0; S.shockX = 0; S.shockY = 0;         // correct-answer light shockwave
    // ambient dust motes suspended in the torchlight (screen-space, gentle drift)
    S.motes = [];
    if (!reduced()) for (let i = 0; i < 22; i++) {
      S.motes.push({ x: Math.random(), y: Math.random(), sp: 0.2 + Math.random() * 0.5,
        ph: Math.random() * TAU, sz: 0.6 + Math.random() * 1.4 });
    }
    parts.length = 0;
    S.tex = bakeMazeTexture();
    centerCam(true);
  }

  // ── baked level art (mosaic floor + bronze masonry walls) ──
  //  Rendered once per level to an offscreen canvas, blitted each
  //  frame — richer than per-frame gradients AND cheaper.
  const TEXPAD = 24;
  function bakeMazeTexture() {
    const t = S.tile, cols = S.cols, rows = S.rows;
    const tex = document.createElement('canvas');
    tex.width = S.mazeW + TEXPAD * 2; tex.height = S.mazeH + TEXPAD * 2;
    const g = tex.getContext('2d');
    g.fillStyle = COL.bg;
    g.fillRect(0, 0, tex.width, tex.height);
    g.translate(TEXPAD, TEXPAD);

    // mosaic floor: 3×3 tesserae per cell, deterministic warm jitter,
    // rare gold flecks + slate-blue chips like worn pebble mosaic
    const sub = 3, gsz = t / sub;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = c * t, y = r * t;
      g.fillStyle = '#0d0805';                       // grout
      g.fillRect(x, y, t, t);
      for (let i = 0; i < sub; i++) for (let j = 0; j < sub; j++) {
        const warm = 15 + hash2(c * sub + i, r * sub + j) * 14;
        const pick = hash2(r * sub + j + 57, c * sub + i + 91);
        if (pick > 0.968)      g.fillStyle = 'rgba(122,86,38,0.85)';
        else if (pick < 0.018) g.fillStyle = 'rgba(50,58,70,0.8)';
        else g.fillStyle = 'rgb(' + ((warm + 9) | 0) + ',' + ((warm * 0.7 + 6) | 0) + ',' + ((warm * 0.42 + 3) | 0) + ')';
        g.fillRect(x + i * gsz + 0.7, y + j * gsz + 0.7, gsz - 1.4, gsz - 1.4);
      }
    }
    // floor medallions: a labyrinth spiral at the start, aegean rosette at the gate
    labyrinthSigil(g, t * 0.5, t * 0.5, t * 0.34);
    medallion(g, S.exit.x, S.exit.y, t * 0.34, 'rgba(127,182,204,');

    // soft cast shadow beneath every wall — gives the masonry real depth
    g.save();
    g.fillStyle = 'rgba(0,0,0,0.5)';
    for (const rc of S.rects) g.fillRect(rc.x + 2.5, rc.y + 3, rc.w, rc.h);
    g.restore();

    // walls: bronze gradient + baked glow
    g.save();
    g.shadowColor = 'rgba(196,144,40,0.5)'; g.shadowBlur = 10;
    for (const rc of S.rects) {
      const grd = g.createLinearGradient(rc.x, rc.y, rc.x + rc.w * 0.25, rc.y + rc.h);
      grd.addColorStop(0, '#7a5514');
      grd.addColorStop(0.5, COL.wall);
      grd.addColorStop(1, '#5d3d0e');
      g.fillStyle = grd;
      g.fillRect(rc.x, rc.y, rc.w, rc.h);
    }
    g.shadowBlur = 0;
    // masonry block seams (jittered so runs don't tile mechanically)
    g.strokeStyle = 'rgba(24,14,4,0.7)'; g.lineWidth = 1;
    for (const rc of S.rects) {
      const step = t / 3;
      if (rc.w > rc.h) {
        for (let x = rc.x + step; x < rc.x + rc.w - 3; x += step) {
          const off = (hash2(x | 0, rc.y | 0) - 0.5) * 5;
          g.beginPath(); g.moveTo(x + off, rc.y + 1); g.lineTo(x + off, rc.y + rc.h - 1); g.stroke();
        }
      } else {
        for (let y = rc.y + step; y < rc.y + rc.h - 3; y += step) {
          const off = (hash2(rc.x | 0, y | 0) - 0.5) * 5;
          g.beginPath(); g.moveTo(rc.x + 1, y + off); g.lineTo(rc.x + rc.w - 1, y + off); g.stroke();
        }
      }
    }
    // carved black-figure meander frieze inset along the long axis of each wall
    for (const rc of S.rects) bakeMeanderBand(g, rc, t);
    // bright bronze vein down the middle (the labyrinth's signature)
    g.fillStyle = 'rgba(240,198,116,0.5)';
    for (const rc of S.rects) {
      if (rc.w > rc.h) g.fillRect(rc.x + 1, rc.y + rc.h / 2 - 0.6, rc.w - 2, 1.2);
      else fillVein(g, rc);
    }
    // top-lit edge highlight + bottom shade → the blocks read as beveled
    g.fillStyle = 'rgba(245,210,130,0.22)';
    for (const rc of S.rects) g.fillRect(rc.x, rc.y, rc.w, 1);
    g.fillStyle = 'rgba(0,0,0,0.35)';
    for (const rc of S.rects) g.fillRect(rc.x, rc.y + rc.h - 1.2, rc.w, 1.2);
    g.restore();
    return tex;
  }
  function fillVein(g, rc) { g.fillRect(rc.x + rc.w / 2 - 0.6, rc.y + 1, 1.2, rc.h - 2); }

  // chiselled Greek-key (meander) run inset into a wall block, oriented
  // along its long axis. Deterministic phase so it never shimmers.
  function bakeMeanderBand(g, rc, t) {
    const horiz = rc.w >= rc.h;
    const len = horiz ? rc.w : rc.h;
    if (len < t * 0.9) return;                 // too short to carve
    const u = Math.max(3.2, Math.min(5, t * 0.085));   // unit of the key
    const seg = u * 4;
    const n = Math.floor((len - u) / seg);
    if (n < 1) return;
    g.save();
    if (!horiz) { g.translate(rc.x + rc.w / 2, rc.y); g.rotate(Math.PI / 2); g.translate(0, -rc.w / 2); }
    else g.translate(rc.x, rc.y + rc.h / 2);
    const start = (len - n * seg) / 2;
    // engraved shadow then a bronze highlight one px up-left → looks chiselled
    for (let pass = 0; pass < 2; pass++) {
      g.strokeStyle = pass === 0 ? 'rgba(18,10,3,0.8)' : 'rgba(245,212,130,0.42)';
      g.lineWidth = pass === 0 ? 1.6 : 1;
      const oy = pass === 0 ? 0 : -0.9;
      g.beginPath();
      for (let k = 0; k < n; k++) {
        const x = start + k * seg;
        // one meander tooth (a small hooked square wave)
        g.moveTo(x,          oy - u);
        g.lineTo(x + u * 2,  oy - u);
        g.lineTo(x + u * 2,  oy + u);
        g.lineTo(x + u,      oy + u);
        g.lineTo(x + u,      oy);
        g.lineTo(x + u * 3,  oy);
      }
      g.stroke();
    }
    g.restore();
  }

  function medallion(g, cx, cy, R, colPrefix) {
    for (let ring = 0; ring < 3; ring++) {
      const rr = R * (0.38 + ring * 0.31), n = 6 + ring * 6;
      for (let k = 0; k < n; k++) {
        const a = (k / n) * TAU + ring * 0.4;
        g.fillStyle = colPrefix + (0.14 + 0.1 * ((k + ring) % 2)) + ')';
        g.fillRect(cx + Math.cos(a) * rr - 1.6, cy + Math.sin(a) * rr - 1.6, 3.2, 3.2);
      }
    }
  }

  // The classic labyrinth spiral (Cretan sigil) baked into the start tile —
  // an unmistakable mark of the myth under the hero's feet.
  function labyrinthSigil(g, cx, cy, R) {
    g.save();
    g.translate(cx, cy);
    g.strokeStyle = 'rgba(196,144,40,0.34)';
    g.lineWidth = 1.5; g.lineCap = 'round';
    // concentric broken rings with alternating gaps → a maze-like spiral read
    for (let i = 0; i < 4; i++) {
      const rr = R * (0.28 + i * 0.24);
      const gap = 0.5 + (i % 2) * Math.PI;      // rotate the gap each ring
      g.beginPath();
      g.arc(0, 0, rr, gap, gap + TAU - 0.7);
      g.stroke();
    }
    // a small cross at the heart
    g.strokeStyle = 'rgba(240,198,116,0.4)';
    g.beginPath();
    g.moveTo(-R * 0.14, 0); g.lineTo(R * 0.14, 0);
    g.moveTo(0, -R * 0.14); g.lineTo(0, R * 0.14);
    g.stroke();
    g.restore();
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
    else if (S && S.phase !== 'paused') { fxTick(dt); }   // keep embers/flashes alive behind panes
    if (S) render();
    raf = requestAnimationFrame(frame);
  }

  // presentation-only tick (quiz / descend / result — world logic frozen)
  function fxTick(dt) {
    S.vignettePulse += dt;
    updateParts(dt);
    S.shake = Math.max(0, S.shake - dt * 3);
    S.flash = Math.max(0, S.flash - dt * 2.2);
    S.flashGold = Math.max(0, (S.flashGold || 0) - dt * 1.1);
    S.lightPulse = Math.max(0, (S.lightPulse || 0) - dt * 1.3);
    S.shock = Math.max(0, (S.shock || 0) - dt * 0.9);
  }

  function update(dt) {
    S.runTime += dt;
    S.vignettePulse += dt;

    // ── torch burn ──
    const burnMul = S.mino.enrage > 0 ? 1.35 : 1;
    S.fuel -= (dt / S.fuelSeconds) * burnMul;
    if (S.fuel <= 0) { S.fuel = 0; }
    // one-shot sputter as the torch starts to gutter (presentation cue only)
    if (S.fuel < 0.22 && !S.lowWarned) { S.lowWarned = true; window.LabAudio && LabAudio.sting('lowTorch'); }
    else if (S.fuel > 0.5 && S.lowWarned) S.lowWarned = false;

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
    // footstep feel: a soft ripple ring each stride while moving
    const stepNow = Math.floor(p.bob / Math.PI);
    if (stepNow !== S.stepPh) {
      S.stepPh = stepNow;
      if (spd > 80 && !reduced()) {
        spawn({ x: p.x, y: p.y + S.tile * 0.18, vx: 0, vy: 0, life: 0.42, size: 3.2,
          ring: true, grow: 2.8, col: 'rgba(232,196,120,1)', alpha: 0.2, lw: 1.2 });
      }
    }

    // Ariadne's thread — a golden trace of where you've walked
    const lastTh = S.thread[S.thread.length - 1];
    if (Math.hypot(p.x - lastTh.x, p.y - lastTh.y) > 7) {
      S.thread.push({ x: p.x, y: p.y });
      if (S.thread.length > 1500) S.thread.shift();
    }

    // torch embers + footstep dust (ambient, skipped under reduced motion)
    if (!reduced()) {
      S.emberT -= dt;
      if (S.emberT <= 0) {
        S.emberT = 0.08 + Math.random() * 0.09;
        const tfx = Math.cos(p.face) * S.tile * 0.2, tfy = Math.sin(p.face) * S.tile * 0.2;
        spawn({ x: p.x + tfx + (Math.random() - 0.5) * 3, y: p.y + tfy,
          vx: (Math.random() - 0.5) * 16, vy: -22 - Math.random() * 30 * (0.3 + S.fuel),
          life: 0.45 + Math.random() * 0.5, size: 0.7 + Math.random() * 1.4,
          col: 'rgba(255,190,90,1)', add: true, drag: 1.5, wig: 9, seed: Math.random() * 9,
          shrink: true, alpha: 0.35 + S.fuel * 0.45 });
      }
      if (spd > 70) {
        S.dustT -= dt;
        if (S.dustT <= 0) {
          S.dustT = 0.24;
          spawn({ x: p.x - Math.cos(p.face) * 6 + (Math.random() - 0.5) * 6, y: p.y + S.tile * 0.14,
            vx: -Math.cos(p.face) * 12, vy: -6 - Math.random() * 8, life: 0.5, size: 2.4,
            col: 'rgba(140,110,70,1)', drag: 2.5, alpha: 0.16 });
        }
      }
    }

    centerCam(false);

    // ── doors ──
    for (const d of S.doors) if (d.cd > 0) d.cd -= dt;
    S.nearDoor = nearestDoor();

    // ── braziers ──
    for (const b of S.braz) {
      b.glow = lerp(b.glow, b.lit ? 1 : 0, 0.08);
      if (b.cd > 0) b.cd -= dt;
      if (b.lit && !reduced() && b.glow > 0.5 && Math.random() < dt * 7 && inView(b.x, b.y, 60)) {
        spawn({ x: b.x + (Math.random() - 0.5) * 6, y: b.y - S.tile * 0.08,
          vx: (Math.random() - 0.5) * 10, vy: -18 - Math.random() * 22,
          life: 0.5 + Math.random() * 0.4, size: 0.7 + Math.random() * 1.2,
          col: 'rgba(255,200,110,1)', add: true, drag: 1.2, wig: 7, seed: b.x, shrink: true, alpha: 0.6 });
      }
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
    S.flashGold = Math.max(0, S.flashGold - dt * 1.1);
    S.lightPulse = Math.max(0, S.lightPulse - dt * 1.3);
    S.shock = Math.max(0, (S.shock || 0) - dt * 0.9);
    updateParts(dt);

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
        if (!reduced()) for (let di = 0; di < 2; di++) {
          spawn({ x: m.x + (Math.random() - 0.5) * 8, y: m.y + t * 0.2,
            vx: (Math.random() - 0.5) * 26, vy: -10 - Math.random() * 12,
            life: 0.55, size: 2.6, col: 'rgba(150,100,60,1)', drag: 2.2, alpha: 0.2 });
        }
      }
    }

    // hot breath while it hunts (visible dread when it enters the light)
    if (m.state === 'hunt' && m.freeze <= 0 && !reduced()) {
      S.breathT -= dt;
      if (S.breathT <= 0) {
        S.breathT = 0.85;
        const bx = m.x + (m.vx || 0) * t * 0.22, by = m.y + t * 0.12;
        spawn({ x: bx, y: by, vx: (m.vx || 0) * 30, vy: -14, life: 0.6, size: 2.2,
          col: 'rgba(220,220,230,1)', drag: 1.6, alpha: 0.14, wig: 5, seed: 1 });
        spawn({ x: bx, y: by, vx: (m.vx || 0) * 22, vy: -10, life: 0.7, size: 1.8,
          col: 'rgba(255,120,80,1)', add: true, drag: 1.6, alpha: 0.12, wig: 6, seed: 4 });
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
    S.shake = reduced() ? 0.4 : 1; S.flash = 1;
    burst(S.player.x, S.player.y, 'rgba(230,80,40,1)', 30, 190);
    burst(S.player.x, S.player.y, 'rgba(255,190,90,1)', 12, 110);
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
      S.flashGold = 1; S.lightPulse = 1;                       // light surges back
      S.shock = 1; S.shockX = b.x; S.shockY = b.y - S.tile * 0.06;  // expanding light ring
      burst(b.x, b.y - S.tile * 0.06, 'rgba(255,214,120,1)', 26, 150);
      burst(b.x, b.y - S.tile * 0.06, 'rgba(212,146,42,1)', 14, 80);
      floatText(b.x, b.y - S.tile * 0.55, '+150', 'rgba(255,222,140,1)');
      window.LabAudio && LabAudio.sting('correct');
      setTimeout(() => { window.LabAudio && LabAudio.sting('pickup'); }, 220);
    } else {
      b.cd = 6;                          // can retry later
      S.fuel = Math.max(0.06, S.fuel - 0.28);
      S.mino.enrage = 5;                 // it surges
      S.shake = Math.max(S.shake, reduced() ? 0.2 : 0.45);
      S.flash = Math.max(S.flash, 0.55);
      burst(b.x, b.y, 'rgba(180,60,30,1)', 10, 60);
      window.LabAudio && LabAudio.sting('wrong');
    }
    return correct;
  }
  function resumeFromQuiz() { if (S) { S.phase = 'play'; lastT = performance.now(); } }

  // ── descend / win ──────────────────────────────────────
  function reachExit() {
    const gained = Math.round(200 + S.fuel * 200);
    S.score += gained;
    burst(S.exit.x, S.exit.y, 'rgba(160,220,240,1)', 24, 130);
    burst(S.exit.x, S.exit.y, 'rgba(127,182,204,1)', 12, 70);
    floatText(S.exit.x, S.exit.y - S.tile * 0.5, '+' + gained, 'rgba(191,227,240,1)');
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

    if (S.tex) ctx.drawImage(S.tex, -TEXPAD, -TEXPAD);
    drawThread();
    drawShock();
    drawDoors();
    drawExit();
    drawBraziers();
    drawMino();
    drawPlayer();
    drawParts();
    drawMotes();

    ctx.restore();

    drawDarkness();
    drawFog();
    drawDreadEyes();
    drawFlash();
    drawGrain();
  }

  // expanding ring of light when a brazier is lit — a wave of knowledge
  function drawShock() {
    if (!S.shock) return;
    const k = 1 - S.shock;                 // 0→1 as it expands
    const R = S.tile * (0.4 + k * 4.5);
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.strokeStyle = 'rgba(255,214,120,' + (S.shock * 0.6) + ')';
    ctx.lineWidth = 3 + S.shock * 5;
    ctx.beginPath(); ctx.arc(S.shockX, S.shockY, R, 0, TAU); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,246,220,' + (S.shock * 0.35) + ')';
    ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.arc(S.shockX, S.shockY, R * 0.82, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  // dust motes suspended in the torchlight — drift gently, brightest near the
  // hero, invisible in the dark. Drawn in world space so the camera translate
  // (still active here) keeps them anchored to the room, not the screen.
  function drawMotes() {
    if (!S.motes || reduced()) return;
    const w = S.viewW, h = S.viewH, tm = S.runTime;
    const px = S.player.x, py = S.player.y;
    const R = torchRadius();
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    for (const m of S.motes) {
      // world position: tiled across the current view, drifting slowly
      const sx = S.cam.x + ((m.x + Math.sin(tm * m.sp + m.ph) * 0.04) % 1 + 1) % 1 * w;
      const sy = S.cam.y + ((m.y + tm * m.sp * 0.012) % 1 + 1) % 1 * h;
      const d = Math.hypot(sx - px, sy - py);
      if (d > R * 0.9) continue;
      const glow = (1 - d / (R * 0.9)) * (0.5 + 0.5 * Math.sin(tm * 2 + m.ph)) * S.fuel;
      if (glow <= 0.02) continue;
      ctx.fillStyle = 'rgba(255,214,140,' + (glow * 0.5) + ')';
      ctx.beginPath(); ctx.arc(sx, sy, m.sz, 0, TAU); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.restore();
  }

  function inView(x, y, pad) {
    return x > S.cam.x - pad && x < S.cam.x + S.viewW + pad && y > S.cam.y - pad && y < S.cam.y + S.viewH + pad;
  }

  // Ariadne's thread — faint golden trace of your route (torch-lit only,
  // since the darkness overlay swallows it beyond the light radius)
  function drawThread() {
    const th = S.thread, n = th.length;
    if (n < 2) return;
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = 'rgba(232,196,120,1)';
    for (let i = 1; i < n; i++) {
      const a = th[i - 1], b = th[i];
      if (!inView(b.x, b.y, 30)) continue;
      const k = i / n;
      ctx.globalAlpha = 0.05 + k * 0.30;
      ctx.lineWidth = 1 + k * 0.7;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
    }
    ctx.globalAlpha = 1;
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
    // orbiting aegean sparks — the gate feels alive
    if (!reduced()) {
      const spin = S.vignettePulse * 1.4;
      ctx.shadowBlur = 8;
      ctx.fillStyle = COL.exitHi;
      for (let i = 0; i < 7; i++) {
        const a = spin + i * TAU / 7;
        const rr = t * 0.36 + Math.sin(spin * 2 + i * 1.7) * 3;
        ctx.globalAlpha = 0.35 + 0.3 * Math.sin(spin * 3 + i);
        ctx.beginPath(); ctx.arc(Math.cos(a) * rr, Math.sin(a) * rr, 1.6, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function drawBraziers() {
    const t = S.tile;
    for (const b of S.braz) {
      if (!inView(b.x, b.y, 40)) continue;
      ctx.save(); ctx.translate(b.x, b.y);
      const lit = b.glow;
      // stone plinth under the tripod
      ctx.fillStyle = 'rgba(60,44,26,0.55)';
      ctx.beginPath(); ctx.ellipse(0, t * 0.17, t * 0.15, t * 0.055, 0, 0, TAU); ctx.fill();
      // tripod legs
      ctx.strokeStyle = lit > 0.4 ? COL.brazier : 'rgba(150,110,50,0.55)';
      ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-t * 0.1, t * 0.02); ctx.lineTo(-t * 0.13, t * 0.16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(t * 0.1, t * 0.02); ctx.lineTo(t * 0.13, t * 0.16); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, t * 0.05); ctx.lineTo(0, t * 0.17); ctx.stroke();
      // bowl
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(-t * 0.16, t * 0.0); ctx.lineTo(t * 0.16, t * 0.0);
      ctx.lineTo(t * 0.1, t * 0.07); ctx.lineTo(-t * 0.1, t * 0.07); ctx.closePath(); ctx.stroke();
      if (lit > 0.05) {
        const fl = 0.7 + 0.3 * Math.sin(S.vignettePulse * 9 + b.x);
        ctx.shadowColor = COL.brazier; ctx.shadowBlur = 24 * lit;
        const g = ctx.createRadialGradient(0, -t * 0.1, 0, 0, -t * 0.1, t * 0.22 * fl);
        g.addColorStop(0, 'rgba(255,235,180,' + lit + ')');
        g.addColorStop(0.4, 'rgba(255,190,90,' + (lit * 0.85) + ')');
        g.addColorStop(0.75, 'rgba(212,146,42,' + (lit * 0.6) + ')');
        g.addColorStop(1, 'rgba(180,70,20,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.ellipse(0, -t * 0.1, t * 0.12 * fl, t * 0.22 * fl, 0, 0, TAU); ctx.fill();
        // licking flame tongues — three curling blades that dance out of sync
        ctx.globalCompositeOperation = 'lighter';
        for (let f = 0; f < 3; f++) {
          const ph = S.vignettePulse * (7 + f * 1.7) + b.x * 0.5 + f * 2.1;
          const sway = Math.sin(ph) * t * 0.05;
          const tipY = -t * (0.18 + 0.10 * (0.6 + 0.4 * Math.sin(ph * 1.3))) * lit;
          const baseX = (f - 1) * t * 0.05;
          ctx.fillStyle = f === 1 ? 'rgba(255,236,180,' + (lit * 0.9) + ')' : 'rgba(255,168,60,' + (lit * 0.75) + ')';
          ctx.beginPath();
          ctx.moveTo(baseX - t * 0.045, -t * 0.06);
          ctx.quadraticCurveTo(baseX + sway - t * 0.02, tipY * 0.5, baseX + sway, tipY);
          ctx.quadraticCurveTo(baseX + sway + t * 0.02, tipY * 0.5, baseX + t * 0.045, -t * 0.06);
          ctx.closePath(); ctx.fill();
        }
        ctx.globalCompositeOperation = 'source-over';
        // white-hot core
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'rgba(255,246,220,' + (lit * 0.85) + ')';
        ctx.beginPath(); ctx.ellipse(0, -t * 0.05, t * 0.04 * fl, t * 0.08 * fl, 0, 0, TAU); ctx.fill();
      } else {
        // unlit rune plate: dim gold when ready, ash-red while on cooldown
        ctx.shadowBlur = 0;
        const cool = b.cd > 0;
        const gl = cool ? 0.35 : (0.55 + 0.25 * Math.sin(S.vignettePulse * 2.4 + b.y));
        ctx.globalAlpha = gl;
        ctx.strokeStyle = cool ? 'rgba(190,80,50,0.8)' : 'rgba(232,196,120,0.9)';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(-5.5, -t * 0.14 - 5.5, 11, 11);
        ctx.fillStyle = cool ? 'rgba(190,80,50,0.9)' : 'rgba(240,198,116,0.95)';
        ctx.font = '600 10px JetBrains Mono, monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(cool ? '×' : '?', 0, -t * 0.14);
        ctx.textBaseline = 'alphabetic';
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
    const hunting = m.state === 'hunt' && m.freeze <= 0;
    // pulsing threat ring on the floor while it hunts you
    if (hunting) {
      const rp = 0.5 + 0.5 * Math.sin(S.vignettePulse * 6);
      ctx.strokeStyle = 'rgba(255,90,42,' + (0.14 + rp * 0.2) + ')';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(0, t * 0.1, t * 0.34 + rp * 3, 0, TAU); ctx.stroke();
    } else if (m.freeze > 0) {
      // frost ring while frozen
      ctx.strokeStyle = 'rgba(127,182,204,0.35)';
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.arc(0, t * 0.1, t * 0.3, 0, TAU); ctx.stroke();
    }
    // ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.beginPath(); ctx.ellipse(0, t * 0.24, t * 0.2, t * 0.075, 0, 0, TAU); ctx.fill();
    const breathe = 1 + (hunting ? 0.06 : 0.04) * Math.sin(S.vignettePulse * (hunting ? 6 : 4));
    ctx.scale(breathe, breathe);
    const body = m.freeze > 0 ? '#5a6a8a' : (hot ? COL.minoHot : COL.mino);
    ctx.shadowColor = m.freeze > 0 ? '#7FB6CC' : (hot ? '#ff5a2a' : '#c2502a');
    ctx.shadowBlur = hot ? 30 : 16;
    ctx.fillStyle = body;
    // shoulder bulk behind the head — the beast has mass
    ctx.globalAlpha = 0.85;
    ctx.beginPath(); ctx.ellipse(0, t * 0.12, t * 0.23, t * 0.15, 0, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
    // bull-head silhouette: head + muzzle + horns
    ctx.beginPath();
    ctx.ellipse(0, t * 0.04, t * 0.17, t * 0.21, 0, 0, TAU); ctx.fill();   // head
    ctx.beginPath(); ctx.ellipse(0, t * 0.18, t * 0.1, t * 0.08, 0, 0, TAU); ctx.fill(); // muzzle
    // nostril glints
    ctx.fillStyle = 'rgba(20,8,4,0.8)';
    ctx.beginPath(); ctx.arc(-t * 0.035, t * 0.18, t * 0.015, 0, TAU); ctx.arc(t * 0.035, t * 0.18, t * 0.015, 0, TAU); ctx.fill();
    // horns — bone gradient, thicker at base
    ctx.strokeStyle = m.freeze > 0 ? '#c8d8e4' : '#e7d2a0';
    ctx.lineWidth = t * 0.055; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-t * 0.12, -t * 0.08); ctx.quadraticCurveTo(-t * 0.26, -t * 0.18, -t * 0.22, -t * 0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(t * 0.12, -t * 0.08); ctx.quadraticCurveTo(t * 0.26, -t * 0.18, t * 0.22, -t * 0.32); ctx.stroke();
    ctx.lineWidth = t * 0.03;
    ctx.strokeStyle = 'rgba(255,255,240,0.5)';
    ctx.beginPath(); ctx.moveTo(-t * 0.19, -t * 0.24); ctx.lineTo(-t * 0.22, -t * 0.32); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(t * 0.19, -t * 0.24); ctx.lineTo(t * 0.22, -t * 0.32); ctx.stroke();
    // eyes — burn hotter while hunting
    ctx.shadowBlur = hunting ? 16 : 10; ctx.shadowColor = '#ff3a10';
    ctx.fillStyle = m.freeze > 0 ? '#bfe3f0' : (hunting ? '#ff8438' : '#ffd24a');
    ctx.beginPath(); ctx.arc(-t * 0.06, 0, t * 0.03, 0, TAU); ctx.arc(t * 0.06, 0, t * 0.03, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function drawPlayer() {
    const p = S.player, t = S.tile;
    ctx.save(); ctx.translate(p.x, p.y);
    const bob = Math.sin(p.bob) * 1.5;
    // ground shadow
    ctx.fillStyle = 'rgba(0,0,0,0.45)';
    ctx.beginPath(); ctx.ellipse(0, t * 0.2, t * 0.14, t * 0.05, 0, 0, TAU); ctx.fill();
    // cloak (sways slightly with the walk cycle)
    ctx.shadowColor = '#000'; ctx.shadowBlur = 8;
    ctx.fillStyle = '#2a1c0e';
    ctx.beginPath(); ctx.ellipse(Math.sin(p.bob * 0.5) * 0.8, bob, t * 0.16, t * 0.2, 0, 0, TAU); ctx.fill();
    // lit body + head glint
    ctx.shadowColor = COL.theseus; ctx.shadowBlur = 18;
    ctx.fillStyle = COL.theseus;
    ctx.beginPath(); ctx.arc(0, bob - t * 0.03, t * 0.1, 0, TAU); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,250,235,0.85)';
    ctx.beginPath(); ctx.arc(-t * 0.03, bob - t * 0.06, t * 0.028, 0, TAU); ctx.fill();
    // torch flame in facing hand — layered, with a white-hot core
    const fx = Math.cos(p.face) * t * 0.2, fy = Math.sin(p.face) * t * 0.2;
    const fl = 0.8 + 0.2 * Math.sin(S.vignettePulse * 12);
    ctx.shadowColor = '#ffb347'; ctx.shadowBlur = 26 * fl * (0.4 + S.fuel * 0.6);
    const fg = ctx.createRadialGradient(fx, fy + bob, 0, fx, fy + bob, t * 0.14 * fl);
    fg.addColorStop(0, 'rgba(255,235,180,' + (0.5 + S.fuel * 0.5) + ')');
    fg.addColorStop(0.5, 'rgba(255,150,40,' + (0.4 + S.fuel * 0.4) + ')');
    fg.addColorStop(1, 'rgba(200,60,10,0)');
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.arc(fx, fy + bob, t * 0.14 * fl, 0, TAU); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(255,248,225,' + (0.35 + S.fuel * 0.5) + ')';
    ctx.beginPath(); ctx.arc(fx, fy + bob, t * 0.035 * fl, 0, TAU); ctx.fill();
    ctx.restore();
  }

  function torchRadius() {
    const base = Math.min(S.viewW, S.viewH);
    // light shrinks hard as fuel drains; never fully zero (a faint ember remains)
    const f = S.fuel;
    const minR = S.tile * 0.78;
    const maxR = base * 0.34;   // smaller torch to start — the dark presses closer
    const flick = 1 + 0.03 * Math.sin(S.vignettePulse * 18) + 0.02 * Math.sin(S.vignettePulse * 7.3);
    // a correct answer makes the light SURGE before settling
    const surge = 1 + 0.22 * (S.lightPulse || 0);
    return (minR + (maxR - minR) * Math.pow(f, 0.7)) * flick * surge;
  }

  function drawDarkness() {
    const w = S.viewW, h = S.viewH;
    const px = S.player.x - S.cam.x, py = S.player.y - S.cam.y;
    const R = torchRadius();
    // torchlight throws slightly ahead of the hero → the light "looks" where you walk
    const face = S.player.face || 0;
    const lx = px + Math.cos(face) * R * 0.14;
    const ly = py + Math.sin(face) * R * 0.14;
    // vignette darkness with a clear torch hole (soft, warm-tinted falloff)
    const g = ctx.createRadialGradient(lx, ly, R * 0.30, lx, ly, R);
    g.addColorStop(0, 'rgba(10,6,4,0)');
    g.addColorStop(0.52, 'rgba(9,5,3,0.14)');
    g.addColorStop(0.80, 'rgba(6,4,2,0.70)');
    g.addColorStop(1, 'rgba(3,2,1,0.994)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    // warm torch tint (additive) — a hot golden core fading to ember-red
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    const warm = ctx.createRadialGradient(lx, ly, 0, lx, ly, R * 0.85);
    const wi = (0.07 + S.fuel * 0.11) * (1 + 0.4 * (S.lightPulse || 0));
    warm.addColorStop(0, 'rgba(255,214,130,' + (wi * 0.9) + ')');
    warm.addColorStop(0.35, 'rgba(212,146,42,' + wi + ')');
    warm.addColorStop(0.7, 'rgba(150,66,18,' + (wi * 0.45) + ')');
    warm.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, w, h);
    // lit braziers glow softly through the dark — embers you left behind
    for (const b of S.braz) {
      if (b.glow < 0.1) continue;
      const bx = b.x - S.cam.x, by = b.y - S.cam.y;
      if (bx < -80 || by < -80 || bx > w + 80 || by > h + 80) continue;
      const bfl = 0.75 + 0.25 * Math.sin(S.vignettePulse * 7 + b.x * 0.13);
      const rr = S.tile * 1.5 * bfl * b.glow;
      const hg = ctx.createRadialGradient(bx, by, 0, bx, by, rr);
      hg.addColorStop(0, 'rgba(212,150,60,' + (0.2 * b.glow) + ')');
      hg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = hg;
      ctx.fillRect(bx - rr, by - rr, rr * 2, rr * 2);
    }
    // the aegean gate breathes a faint cold glow through the dark
    {
      const exx = S.exit.x - S.cam.x, exy = S.exit.y - S.cam.y;
      if (!(exx < -90 || exy < -90 || exx > w + 90 || exy > h + 90)) {
        const ep = 0.6 + 0.4 * Math.sin(S.vignettePulse * 1.8);
        const er = S.tile * 1.35 * ep;
        const eg = ctx.createRadialGradient(exx, exy, 0, exx, exy, er);
        eg.addColorStop(0, 'rgba(127,182,204,0.12)');
        eg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = eg;
        ctx.fillRect(exx - er, exy - er, er * 2, er * 2);
      }
    }
    ctx.restore();
    // red dread when hunted & close
    if (S.tension > 0.55) {
      const dread = (S.tension - 0.55) / 0.45;
      const rg = ctx.createRadialGradient(px, py, R * 0.5, px, py, Math.max(w, h));
      rg.addColorStop(0, 'rgba(0,0,0,0)');
      rg.addColorStop(1, 'rgba(150,20,10,' + (0.22 * dread) + ')');
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, w, h);
    }
    // cinematic corner vignette (always on, very subtle)
    const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.5, w / 2, h / 2, Math.max(w, h) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)');
    vg.addColorStop(1, 'rgba(0,0,0,0.42)');
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }

  function drawFlash() {
    if (S.flashGold > 0) {
      ctx.fillStyle = 'rgba(240,198,116,' + (S.flashGold * 0.16) + ')';
      ctx.fillRect(0, 0, S.viewW, S.viewH);
    }
    if (S.flash > 0) {
      ctx.fillStyle = 'rgba(190,40,20,' + (S.flash * 0.42) + ')';
      ctx.fillRect(0, 0, S.viewW, S.viewH);
    }
  }

  // ── fog beyond sight ───────────────────────────────────
  //  Drifting wisps that live only in the darkness at the rim of your
  //  torchlight. Two world-anchored layers (parallax) composed on a
  //  low-res offscreen canvas, with the lit core punched out — cheap.
  let fogTile = null, fogCnv = null, fogCtx = null;
  function makeFogTile() {
    const s = 192, c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    for (let i = 0; i < 26; i++) {
      const x = hash2(i, 11) * s, y = hash2(i, 23) * s;
      const r = 20 + hash2(i, 37) * 44, a = 0.05 + hash2(i, 51) * 0.09;
      for (let dx = -s; dx <= s; dx += s) for (let dy = -s; dy <= s; dy += s) {
        const gr = g.createRadialGradient(x + dx, y + dy, 0, x + dx, y + dy, r);
        gr.addColorStop(0, 'rgba(188,178,170,' + a + ')');
        gr.addColorStop(1, 'rgba(188,178,170,0)');
        g.fillStyle = gr;
        g.fillRect(x + dx - r, y + dy - r, r * 2, r * 2);
      }
    }
    return c;
  }
  function drawFog() {
    if (reduced()) return;
    if (!fogTile) fogTile = makeFogTile();
    const w = S.viewW, h = S.viewH, sc = 0.25;
    const fw = Math.max(4, (w * sc) | 0), fh = Math.max(4, (h * sc) | 0);
    if (!fogCnv) { fogCnv = document.createElement('canvas'); fogCtx = fogCnv.getContext('2d'); }
    if (fogCnv.width !== fw || fogCnv.height !== fh) { fogCnv.width = fw; fogCnv.height = fh; }
    const f = fogCtx, ts = fogTile.width, tm = S.runTime;
    f.setTransform(1, 0, 0, 1, 0, 0);
    f.globalCompositeOperation = 'source-over';
    f.clearRect(0, 0, fw, fh);
    for (let L = 0; L < 2; L++) {
      const scale = L ? 0.85 : 1.55;
      const spdX = L ? 6.5 : -4, spdY = L ? -2.5 : 3;
      f.save();
      f.scale(scale, scale);
      f.globalAlpha = L ? 0.55 : 0.45;
      const ox = ((((S.cam.x * sc) / scale + tm * spdX) % ts) + ts) % ts;
      const oy = ((((S.cam.y * sc) / scale + tm * spdY) % ts) + ts) % ts;
      for (let x = -ox; x < fw / scale; x += ts)
        for (let y = -oy; y < fh / scale; y += ts)
          f.drawImage(fogTile, x, y);
      f.restore();
    }
    // punch out the torch-lit core so the fog lives only in the dark
    const px = (S.player.x - S.cam.x) * sc, py = (S.player.y - S.cam.y) * sc;
    const R = Math.max(8, torchRadius() * sc);
    const hole = f.createRadialGradient(px, py, 0, px, py, R * 1.08);
    hole.addColorStop(0, 'rgba(0,0,0,1)');
    hole.addColorStop(0.72, 'rgba(0,0,0,0.88)');
    hole.addColorStop(1, 'rgba(0,0,0,0)');
    f.globalCompositeOperation = 'destination-out';
    f.globalAlpha = 1;
    f.fillStyle = hole;
    f.fillRect(0, 0, fw, fh);
    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.drawImage(fogCnv, 0, 0, w, h);
    ctx.restore();
  }

  // ── the beast's eyes smoulder in the dark just beyond your light ──
  function drawDreadEyes() {
    const m = S.mino;
    if (!m || m.freeze > 0 || m.state !== 'hunt') return;
    const d = Math.hypot(m.x - S.player.x, m.y - S.player.y);
    const R = torchRadius();
    if (d < R * 0.92 || d > R * 1.9) return;
    const k = clamp(1 - (d - R * 0.92) / (R * 0.98), 0, 1);
    const fl = 0.7 + 0.3 * Math.sin(S.vignettePulse * 12.7);
    const ex = m.x - S.cam.x, ey = m.y - S.cam.y - S.tile * 0.02;
    if (ex < -40 || ey < -40 || ex > S.viewW + 40 || ey > S.viewH + 40) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = k * 0.85 * fl;
    ctx.shadowColor = '#ff2f1a'; ctx.shadowBlur = 14;
    ctx.fillStyle = '#ff5030';
    const g = Math.max(2, S.tile * 0.05);
    ctx.beginPath();
    ctx.arc(ex - S.tile * 0.06, ey, g, 0, TAU);
    ctx.arc(ex + S.tile * 0.06, ey, g, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  // ── film grain (very subtle; static under reduced motion) ──
  let grainTile = null;
  function makeGrainTile() {
    const s = 144, c = document.createElement('canvas');
    c.width = c.height = s;
    const g = c.getContext('2d');
    const im = g.createImageData(s, s);
    for (let i = 0; i < im.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      im.data[i] = im.data[i + 1] = im.data[i + 2] = v;
      im.data[i + 3] = (Math.random() * 44) | 0;
    }
    g.putImageData(im, 0, 0);
    return c;
  }
  function drawGrain() {
    if (!grainTile) grainTile = makeGrainTile();
    const w = S.viewW, h = S.viewH, s = 144;
    const ox = reduced() ? 0 : (Math.random() * s) | 0;
    const oy = reduced() ? 0 : (Math.random() * s) | 0;
    ctx.save();
    ctx.globalAlpha = 0.05;
    ctx.globalCompositeOperation = 'overlay';
    for (let x = -ox; x < w; x += s) for (let y = -oy; y < h; y += s) ctx.drawImage(grainTile, x, y);
    ctx.restore();
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
    parts.length = 0;
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
