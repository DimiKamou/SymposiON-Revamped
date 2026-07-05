/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — game.js
   Game state · loop · input · physics · collision · quiz · HUD.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { PAL, G, ACT, lerp, clamp, damp, rand } from './config.js';
import { initRenderer, makeLights, makeGround } from './scene.js';
import { makePost } from './post.js';
import { Atmosphere } from './atmosphere.js';
import { World } from './world.js';
import { buildRunner, buildTalos, puLabel, puColor, PU_META } from './builders-actors.js';
import { buildQueue } from './questions.js';
import { Particles, Sfx, REDUCED_MOTION } from './juice.js';

const ROLL_DUR = 0.42;    // seconds of the slide tuck-roll
const LUNGE_DUR = 0.95;   // Talos lunge-into-frame beat

const $ = (id) => document.getElementById(id);
const hex6 = (n) => '#' + (n >>> 0).toString(16).padStart(6, '0').slice(-6);

export class Game {
  constructor(stage) {
    this.stage = stage;
    const r = initRenderer(stage);
    this.renderer = r.renderer; this.scene = r.scene; this.camera = r.camera;
    this._resize = r.resize;
    this.lights = makeLights(this.scene);
    this.atmo = new Atmosphere(this.scene);
    this.ground = makeGround(this.scene);
    this.world = new World(this.scene);

    // cinematic post stack (bloom + grade). Re-fit on resize.
    this.post = makePost(this.renderer, this.scene, this.camera);
    this._pulse = 0;
    window.addEventListener('resize', () => {
      this.post.setSize(stage.clientWidth, stage.clientHeight);
    });

    // actors
    this.sex = localStorage.getItem('as_sex') === 'male' ? 'male' : 'female';
    const pr = buildRunner(this.sex); this.player = pr.root; this.prig = pr.rig;
    this.player.scale.setScalar(1.15);
    this.scene.add(this.player);
    const tl = buildTalos(); this.talos = tl.root; this.trig = tl.rig;
    this.scene.add(this.talos);

    // juice: particle pools + procedural synth
    this.sparks = new Particles(this.scene, { max: 240, additive: true, gravity: -6, drag: 2.2 });
    this.dust = new Particles(this.scene, { max: 180, additive: false, gravity: -2.6, drag: 2.6, grow: true, alpha: 0.55 });
    this.sfx = new Sfx();

    // persistent
    this.best = +localStorage.getItem('as_best') || 0;
    this.totalCoins = +localStorage.getItem('as_coins') || 0;
    this.runs = +localStorage.getItem('as_runs') || 0;

    this._bindUI();
    this._bindInput();
    this._resetState();
    this.refreshMenu();

    // prime the world so the menu has a living agora behind the blur
    this.world.contentFrontier = 28;
    this.world.update(0, 0, 0);
    this.player.position.set(0, 0, 0);

    this._animActors(0.016);
    this._camera(1);
    this._render(0.016);
    const ld = document.getElementById('loading');
    if (ld) ld.classList.add('hidden');

    this.clock = new THREE.Clock();
    this._raf = this._raf.bind(this);
    requestAnimationFrame(this._raf);
  }

  _resetState() {
    this.phase = 'menu';
    this.distance = 0;
    this.speed = G.BASE_SPEED;
    this.score = 0; this.coins = 0;
    this.lane = 1; this.targetLane = 1;
    this.px = 0; this.py = 0; this.vy = 0;
    this.onGround = true; this.sliding = false; this.slideT = 0;
    this.runPhase = 0; this.jumpStretch = 1;
    this.stumbleT = 0; this.cheerT = 0;
    this.streak = 0; this.maxStreak = 0; this.mult = 1;
    this.correct = 0; this.asked = 0;
    this.chaseGap = G.CHASE_START;
    this.puMax = { magnet: 1, shield: 1, dash: 1, mult: 1, chariot: 1 };
    this.shake = 0;
    this.pu = { magnet: 0, shield: 0, dash: 0, mult: 0, chariot: 0 };
    this.quizActive = false; this.qTimer = 0; this.qData = null; this.qSel = -1; this.qResolved = false;
    this.queue = buildQueue(); this.qIndex = 0;
    this._rt = 0;
    this.nextQuizAt = rand(7, 10);
    this.player.position.set(0, 0, 0);
    this.talos.position.set(0, 0, 5);
    // feel-layer state
    this.rollT = 0; this._wasRolling = false;
    this.lungeT = 0; this._lungeW = 0;
    this.caughtT = 0;
    this.coinChain = 0; this.coinChainT = 0;
    this.fovKick = 0; this._camRoll = 0;
    this._prevSin = 0; this._tSin = 0; this._stepN = 0;
    this._nextMile = 500;
    this.laneVel = 0;
  }

  /* ── UI binding ─────────────────────────────────────────────── */
  _bindUI() {
    $('btn-start').onclick = () => this.start();
    $('btn-retry').onclick = () => this.start();
    $('btn-menu').onclick = () => this.toMenu();
    $('btn-resume').onclick = () => this.togglePause(false);
    $('btn-pause-menu').onclick = () => this.toMenu();
    $('btn-pause').onclick = () => this.togglePause();
    const sb = $('btn-sound');
    if (sb) {
      const sync = () => { sb.textContent = this.sfx.enabled ? '🔊' : '🔇'; };
      sync();
      sb.onclick = () => { this.sfx.toggle(); sync(); };
    }
    const press = (id, fn) => { const e = $(id); if (!e) return; e.addEventListener('touchstart', (ev) => { ev.preventDefault(); fn(); }, { passive: false }); e.addEventListener('mousedown', (ev) => { ev.preventDefault(); fn(); }); };
    press('mc-left', () => this.move(-1));
    press('mc-right', () => this.move(1));
    press('mc-jump', () => this.jump());
    press('mc-slide', () => this.slide());
    $('q-opts').addEventListener('click', (e) => {
      const opt = e.target.closest('.q-opt');
      if (opt) this.answer(+opt.dataset.i);
    });
    document.querySelectorAll('.hero-opt').forEach((el) => {
      el.addEventListener('click', () => this.setSex(el.dataset.sex));
    });
    this._syncHeroPicker();
  }

  _syncHeroPicker() {
    document.querySelectorAll('.hero-opt').forEach((el) => {
      el.classList.toggle('sel', el.dataset.sex === this.sex);
    });
  }

  setSex(sex) {
    if (sex !== 'male' && sex !== 'female') return;
    if (sex === this.sex && this._builtSex === sex) { this._syncHeroPicker(); return; }
    this.sex = sex; this._builtSex = sex;
    localStorage.setItem('as_sex', sex);
    const oldX = this.player ? this.player.position.x : 0;
    if (this.player) this.scene.remove(this.player);
    const pr = buildRunner(sex);
    this.player = pr.root; this.prig = pr.rig;
    this.player.scale.setScalar(1.15);
    this.player.position.set(oldX, this.py || 0, 0);
    this.scene.add(this.player);
    this._syncHeroPicker();
    this._animActors(0.016);
    if (this.phase !== 'playing') this._render(0.016);
  }

  refreshMenu() {
    $('meta-best').textContent = this.best.toLocaleString();
    $('meta-coins').textContent = this.totalCoins.toLocaleString();
    $('meta-runs').textContent = this.runs;
  }

  /* ── input ──────────────────────────────────────────────────── */
  _bindInput() {
    window.addEventListener('keydown', (e) => {
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      if (this.quizActive && ['1', '2', '3', '4'].includes(k)) { this.answer(+k - 1); return; }
      switch (k) {
        case 'arrowleft': case 'a': this.move(-1); break;
        case 'arrowright': case 'd': this.move(1); break;
        case 'arrowup': case 'w': case ' ': this.jump(); e.preventDefault(); break;
        case 'arrowdown': case 's': this.slide(); break;
        case 'p': case 'escape': this.togglePause(); break;
        case 'enter': if (this.phase === 'menu') this.start(); else if (this.phase === 'over') this.start(); break;
      }
    });
    let sx = 0, sy = 0, st = 0;
    const stage = this.stage;
    stage.addEventListener('touchstart', (e) => { const t = e.changedTouches[0]; sx = t.clientX; sy = t.clientY; st = Date.now(); }, { passive: true });
    stage.addEventListener('touchend', (e) => {
      const t = e.changedTouches[0]; const dx = t.clientX - sx, dy = t.clientY - sy;
      if (Date.now() - st > 600) return;
      if (Math.abs(dx) < 24 && Math.abs(dy) < 24) return;
      if (Math.abs(dx) > Math.abs(dy)) this.move(dx > 0 ? 1 : -1);
      else if (dy < 0) this.jump(); else this.slide();
    }, { passive: true });
  }

  /* ── actions ────────────────────────────────────────────────── */
  move(dir) {
    if (this.phase !== 'playing') return;
    const next = clamp(this.targetLane + dir, 0, 2);
    if (next !== this.targetLane) {
      this.targetLane = next;
      this.sfx.swish();
    }
  }
  jump() {
    if (this.phase !== 'playing') return;
    if (this.onGround && !this.sliding) {
      this.vy = G.JUMP_VEL; this.onGround = false; this.jumpStretch = 1.22;
      this.sfx.jump();
      this.dust.burst(this.px, 0.08, 0.2, { count: 6, color: 0xD8C9A8, speed: 1.6, up: 1.4, size: 0.4, life: 0.55 });
    }
  }
  slide() {
    if (this.phase !== 'playing') return;
    if (this.onGround) {
      if (!this.sliding) {
        this.sliding = true; this.slideT = G.SLIDE_DUR; this.jumpStretch = 0.8;
        this.rollT = ROLL_DUR;                    // tuck-roll into the slide
        this.sfx.roll();
        this.dust.burst(this.px, 0.1, 0.4, { count: 8, color: 0xD8C9A8, speed: 2.0, up: 1.0, size: 0.42, life: 0.5 });
      }
    } else { this.vy = -G.JUMP_VEL * 1.6; this._fastFall = true; }
  }

  /* ── phase control ──────────────────────────────────────────── */
  start() {
    this.world.reset();
    this._resetState();
    // every run begins in bright daylight; the day-night journey then
    // unfolds with the run (day → sunset → night → dawn …)
    if (this.atmo) this.atmo.t = 34;
    this.phase = 'playing';
    $('start').classList.add('hidden');
    $('gameover').classList.add('hidden');
    $('pause').classList.add('hidden');
    $('qwrap').classList.remove('visible');   // no stale quiz card from a prior run
    this.clock.getDelta();
  }
  toMenu() {
    this.phase = 'menu';
    $('gameover').classList.add('hidden');
    $('pause').classList.add('hidden');
    $('start').classList.remove('hidden');
    this.refreshMenu();
  }
  togglePause(force) {
    if (this.phase !== 'playing' && this.phase !== 'paused') return;
    const want = force === undefined ? this.phase !== 'paused' : force;
    if (want) { this.phase = 'paused'; $('pause').classList.remove('hidden'); }
    else { this.phase = 'playing'; $('pause').classList.add('hidden'); this.clock.getDelta(); }
  }

  gameOver(reason) {
    if (this.phase === 'over' || this.phase === 'caught') return;
    // "the automaton grabs you" beat — hold on the lunge, THEN the overlay
    this.phase = 'caught';
    this.caughtT = 1.0;
    this._goReason = reason;
    this.shake = 1.2;
    this.sfx.crash();
    this.sfx.lunge();
    $('qwrap').classList.remove('visible');
    this.quizActive = false;
    this.dust.burst(this.px, 0.4, 0.4, { count: 14, color: 0xC9B896, speed: 3, up: 2.4, size: 0.5, life: 0.7 });
    clearTimeout(this._goTimer);
    this._goTimer = setTimeout(() => this._showGameOver(), 1050);
  }

  _showGameOver() {
    if (this.phase !== 'caught') return;
    const reason = this._goReason || 'Σε έπιασαν';
    this.phase = 'over';
    this.shake = 0;
    this.runs++; this.totalCoins += this.coins;
    if (this.score > this.best) this.best = this.score;
    localStorage.setItem('as_best', this.best);
    localStorage.setItem('as_coins', this.totalCoins);
    localStorage.setItem('as_runs', this.runs);
    $('go-score').textContent = Math.floor(this.score).toLocaleString();
    $('go-dist').textContent = Math.floor(this.distance) + ' m';
    $('go-coins').textContent = this.coins;
    $('go-correct').textContent = this.correct + '/' + this.asked;
    $('go-combo').textContent = '×' + this.maxStreak;
    $('go-reason').textContent = reason;
    $('gameover').classList.remove('hidden');
  }

  /* the grab beat: world holds, Talos surges onto you, camera punches in */
  _caughtCine(dt) {
    this.caughtT = Math.max(0, this.caughtT - dt);
    this.talos.position.z = damp(this.talos.position.z, 0.95, 9, dt);
    this.talos.position.x = damp(this.talos.position.x, this.px, 9, dt);
    const tr = this.trig;
    tr.body.rotation.x = damp(tr.body.rotation.x, 0.55, 8, dt);    // looms over you
    if (tr.eyeGlow) tr.eyeGlow.material.opacity = 1;
    this._pulse = Math.max(this._pulse, 0.4);                      // hold the red grade
    if (Math.random() < dt * 26) {
      this.dust.burst(this.px + rand(-0.6, 0.6), 0.15, rand(0, 1.1),
        { count: 2, color: 0xC9B896, speed: 2.4, up: 1.8, size: 0.42, life: 0.5 });
    }
  }

  /* ── main loop ──────────────────────────────────────────────── */
  _raf() {
    requestAnimationFrame(this._raf);
    let dt = this.clock.getDelta();
    dt = Math.min(dt, 0.05);
    if (this.phase === 'playing') this._sim(dt);
    if (this.phase === 'caught') this._caughtCine(dt);
    // particle systems ride the scrolling world (fixed-camera design):
    // pass the frame's scroll delta so puffs recede with the road.
    const dz = this.phase === 'playing' ? this.speed * dt : 0;
    this.sparks.update(dt, dz);
    this.dust.update(dt, dz);
    this._animActors(dt);
    this._camera(dt);
    this._render(dt);
    if (!this._shown) { this._shown = true; const l = document.getElementById('loading'); if (l) l.classList.add('hidden'); }
  }

  _render(dt) {
    this.atmo.update(dt, this.lights, this.renderer);
    this._pulse = Math.max(0, this._pulse - dt * 2.2);
    this.post.setPulse(this._pulse);
    this.post.render(dt);
  }

  _sim(dt) {
    this._rt += dt;
    let target = Math.min(G.MAX_SPEED, G.BASE_SPEED + this.runTime() * G.SPEED_RAMP);
    if (this.pu.dash > 0) target = G.DASH_SPEED;
    if (this.pu.chariot > 0) target = Math.min(G.MAX_SPEED, target * 1.1);
    if (this.quizActive) target *= G.Q_SLOWDOWN;
    this.speed = damp(this.speed, target, 5, dt);
    this.distance += this.speed * dt;
    this.score += this.speed * dt * G.DIST_VAL * this.mult;

    const tx = G.LANE_X[this.targetLane];
    const prevX = this.px;
    this.px = damp(this.px, tx, 16, dt);
    this.player.position.x = this.px;
    this.laneVel = (this.px - prevX) / Math.max(dt, 1e-4);

    if (!this.onGround) {
      this.vy -= G.GRAVITY * dt;
      this.py += this.vy * dt;
      if (this.py <= 0) { this.py = 0; this.vy = 0; this.onGround = true; this.jumpStretch = 0.78; this._landRing(); }
    }
    const lift = this.pu.chariot > 0 ? 1.6 : 0;
    this.player.position.y = this.py + lift;

    if (this.sliding) { this.slideT -= dt; if (this.slideT <= 0) this.sliding = false; }

    for (const k in this.pu) if (this.pu[k] > 0) { this.pu[k] -= dt; if (this.pu[k] < 0) this.pu[k] = 0; }
    this.mult = this.pu.mult > 0 ? 2 : 1;

    this.world.update(this.distance, this.speed, dt);

    this._collide(dt);
    this._magnet(dt);
    this._chaser(dt);
    this.ground.update(this.distance);

    // (phase guard: _chaser above may have flipped us into 'caught' this
    // very frame — never raise the quiz card over the grab cine)
    if (this.phase === 'playing' && !this.quizActive && this.queue.length && this.runTime() > this.nextQuizAt) this._openQuiz();
    if (this.quizActive) this._tickQuiz(dt);

    // coin-chain melody window
    if (this.coinChainT > 0) { this.coinChainT -= dt; if (this.coinChainT <= 0) this.coinChain = 0; }

    // speed trails while dashing / flying
    if ((this.pu.dash > 0 || this.pu.chariot > 0) && Math.random() < dt * 40) {
      const col = this.pu.chariot > 0 ? 0xF4C64A : 0xE8553C;
      this.sparks.burst(this.px + rand(-0.4, 0.4), this.py + rand(0.4, 1.6), 0.7,
        { count: 1, color: col, speed: 0.8, up: 0.3, size: 0.26, life: 0.4, vz: 4 });
    }

    // grit trail while tucked low in a slide
    if (this.sliding && Math.random() < dt * 26) {
      this.dust.burst(this.px + rand(-0.35, 0.35), 0.1, 0.55,
        { count: 1, color: 0xD8C9A8, speed: 1.4, up: 0.9, size: 0.36, life: 0.45 });
    }

    // distance milestones — kinetic callout every 500 m
    if (this.distance >= this._nextMile) {
      this._floater(this._nextMile + 'μ ✦', '#1E73C4');
      this.sfx.ui();
      this._nextMile += 500;
    }

    this._hud();
  }

  runTime() { return this._rt || 0; }

  /* ── collisions ─────────────────────────────────────────────── */
  _invuln() { return this.pu.chariot > 0 || this.pu.dash > 0; }

  _collide() {
    const flying = this.pu.chariot > 0;
    for (let i = this.world.obstacles.length - 1; i >= 0; i--) {
      const o = this.world.obstacles[i];
      const z = o.position.z;
      if (!o.userData.hit && z > -0.9 && z < 1.0) {
        const inLane = o.userData.lane === this.targetLane || Math.abs(this.px - G.LANE_X[o.userData.lane]) < 1.4;
        if (inLane) {
          let safe = false;
          const airborne = this.py > 0.85 || flying;
          if (flying || this._invuln()) safe = true;
          else if (o.userData.action === ACT.JUMP) safe = airborne;
          else if (o.userData.action === ACT.SLIDE) safe = this.sliding && !airborne;
          else safe = false;
          o.userData.hit = true;
          if (safe) {
            this._cleanDodge();
            // vertical near-miss: barely cleared it → whoosh
            if (!this._invuln()) {
              if (o.userData.action === ACT.SLIDE) this._nearMiss(o, false);
              else if (o.userData.action === ACT.JUMP && this.py - (o.userData.clearH || 1) < 0.7) this._nearMiss(o, false);
            }
          } else this._crash(o);
        }
      }
      // lateral near-miss: it streaks past your shoulder mid-strafe
      if (!o.userData.passFx && z > 0.6) {
        o.userData.passFx = true;
        const dxa = Math.abs(this.px - G.LANE_X[o.userData.lane]);
        if (!o.userData.didCrash && !o.userData.hit && dxa >= 1.4 && dxa < 2.4) this._nearMiss(o, true);
      }
      if (z > 3) o.userData.hit = false;
    }
  }

  /* near-miss whoosh: side streaks + sound + small bonus + FOV pinch */
  _nearMiss(o, lateral) {
    this.sfx.whoosh(lateral);
    this.fovKick = Math.min(this.fovKick + (lateral ? 3 : 1.6), 7);
    const w = $('whoosh');
    if (w) {
      const side = lateral ? (G.LANE_X[o.userData.lane] > this.px ? 'go-r' : 'go-l') : 'go-c';
      w.className = ''; void w.offsetWidth; w.className = side;
    }
    const bonus = (lateral ? 25 : 15) * this.mult;
    this.score += bonus;
    if (lateral) this._floater('ΠΑΡΑ ΤΡΙΧΑ +' + bonus, '#1E73C4');
  }

  _crash(o) {
    if (o) o.userData.didCrash = true;
    const hx = o ? o.position.x : this.px, hz = o ? Math.max(0.3, o.position.z) : 0.4;
    if (this.pu.shield > 0) {
      this.pu.shield = 0; this._puToast('shield', 'ΣΕ ΕΣΩΣΕ');
      this._flash(false, 'ΑΣΠΙΔΑ');
      this.shake = 0.6;
      this.sfx.shieldClang();
      this.sparks.burst(this.px, this.py + 1.1, 0.4, { count: 22, color: 0xEAD27A, speed: 4.5, up: 3, size: 0.24, life: 0.55 });
      return;
    }
    this.chaseGap -= G.CHASE_HIT + G.CHASE_LUNGE;
    this.speed *= 0.5;
    this.shake = 1;
    this.stumbleT = 0.5;
    this.streak = 0;
    this.coinChain = 0;
    this._danger();
    this.sfx.crash();
    // debris + dust at the impact point
    this.dust.burst(hx, 0.5, hz, { count: 12, color: 0xC9B896, speed: 3.2, up: 2.6, size: 0.5, life: 0.7 });
    this.sparks.burst(hx, 0.9, hz, { count: 8, color: 0xD9573D, speed: 4, up: 3, size: 0.2, life: 0.4 });
    if (this.chaseGap <= G.CHASE_CAUGHT) { this.gameOver('Ο Τάλως σε άρπαξε'); return; }
    // the inspector-grab beat: Talos LUNGES into frame…
    this.lungeT = LUNGE_DUR;
    this.sfx.lunge();
    // …and the quiz gate follows fast — answer to push him back
    if (this.queue.length) this.nextQuizAt = Math.min(this.nextQuizAt, this.runTime() + 1.4);
  }

  _cleanDodge() {
    this.chaseGap = Math.min(G.CHASE_MAX, this.chaseGap + G.CHASE_DODGE);
  }

  /* ── coin magnet + collection ───────────────────────────────── */
  _magnet(dt) {
    const magnet = this.pu.magnet > 0, flying = this.pu.chariot > 0;
    const ppos = this.player.position;
    for (let i = this.world.coins.length - 1; i >= 0; i--) {
      const c = this.world.coins[i];
      c.rotation.y += dt * 5;
      const z = c.position.z;
      const dx = c.position.x - ppos.x, dy = c.position.y - ppos.y, dz = z;
      const d2 = dx * dx + dy * dy + dz * dz;
      const pull = (magnet || flying) && z > -2 && z < 26 && d2 < G.MAGNET_RADIUS * G.MAGNET_RADIUS;
      if (pull) {
        c.position.x = damp(c.position.x, ppos.x, 12, dt);
        c.position.y = damp(c.position.y, ppos.y + 0.6, 12, dt);
        // sparkle trail while a drachma is being reeled in
        if (Math.random() < dt * 18) {
          this.sparks.burst(c.position.x, c.position.y, z, { count: 1, color: 0xFFE9A8, speed: 0.5, up: 0.4, size: 0.18, life: 0.35 });
        }
      }
      if (z > -0.7 && z < 0.9) {
        const near = Math.abs(c.position.x - ppos.x) < 0.9 && Math.abs(c.position.y - ppos.y) < 1.3;
        if (near || (pull && d2 < 1.2)) { this._getCoin(c); this.world.collectCoin(c); }
      }
    }
    for (let i = this.world.powerups.length - 1; i >= 0; i--) {
      const p = this.world.powerups[i];
      p.rotation.y += dt * 1.5;
      if (p.userData.icon) p.userData.icon.position.y = Math.sin(performance.now() / 350 + i) * 0.12;
      const z = p.position.z;
      if (z > -0.8 && z < 1.0) {
        const near = Math.abs(p.position.x - ppos.x) < 1.1 && Math.abs(p.position.y - ppos.y) < 1.6;
        if (near || flying) { this._getPowerup(p.userData.puType, p.position); this.world.collectPowerup(p); }
      }
    }
  }

  _getCoin(c) {
    this.coins++; this.score += G.COIN_VAL * this.mult;
    this.chaseGap = Math.min(G.CHASE_MAX, this.chaseGap + G.CHASE_COIN);
    const el = $('hud-coins'); el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop');
    this.coinChain++; this.coinChainT = 0.9;
    this.sfx.coin(this.coinChain - 1);
    const px = c ? c.position.x : this.px, py = c ? c.position.y : this.py + 1, pz = c ? c.position.z : 0;
    this.sparks.burst(px, py, pz, { count: 6, color: 0xF4C64A, speed: 2.2, up: 1.6, size: 0.2, life: 0.45 });
    if (this.coinChain > 0 && this.coinChain % 15 === 0) this._floater('+' + this.coinChain + ' ΔΡΑΧΜΕΣ!', '#B5811C');
  }
  _getPowerup(type, pos) {
    const dur = { magnet: G.PU_MAGNET, shield: G.PU_SHIELD, dash: G.PU_DASH, mult: G.PU_MULT, chariot: G.PU_CHARIOT }[type];
    this.pu[type] = dur;
    this.puMax[type] = dur;
    if (type === 'dash') this.chaseGap = Math.min(G.CHASE_MAX, this.chaseGap + 3);
    this._puToast(type);
    this.sfx.power();
    this.fovKick = Math.min(this.fovKick + 3, 8);
    const col = puColor(type);
    const bx = pos ? pos.x : this.px, by = pos ? pos.y : 1.2, bz = pos ? pos.z : 0;
    this.sparks.burst(bx, by, bz, { count: 26, color: col, speed: 4, up: 3.2, size: 0.26, life: 0.65, spread: 1.4 });
  }

  /* ── chaser (Talos) ─────────────────────────────────────────── */
  _chaser(dt) {
    const t = clamp(this.runTime() / 150, 0, 1);
    let drain = (G.CHASE_DRAIN + G.CHASE_DRAIN_RAMP * t) * dt;
    if (this.pu.dash > 0 || this.pu.chariot > 0) drain *= 0.15;
    if (this.quizActive) drain *= 0.5;
    this.chaseGap -= drain;
    this.chaseGap = clamp(this.chaseGap, 0, G.CHASE_MAX);

    const prox = clamp(1 - (this.chaseGap - G.CHASE_CAUGHT) / (G.CHASE_MAX - G.CHASE_CAUGHT), 0, 1);
    this._prox = prox;
    // presence escalation: safe → he sinks below the frame edge; mid →
    // full body looming behind; danger → right on your heels.
    let tz = 7.4 - prox * 5.2;
    // he closes in on your inside shoulder, not dead-centre — the offset
    // grows when he's near the camera so he never eclipses the runner
    const side = (this.px >= 0 ? -1 : 1) * (0.55 + (1 - prox) * 1.25);
    let lam = 5, tx = this.px * 0.5 + side;

    // quiz gate: he creeps up over your inside shoulder while the question
    // hangs — close enough to menace, offset enough to keep you in frame
    if (this.quizActive) { tz = Math.min(tz, 3.1); tx = this.px * 0.8 + (this.px >= 0 ? -1 : 1) * 1.5; }

    // lunge beat: he surges into frame, arms out — then falls back
    let lw = 0;
    if (this.lungeT > 0) {
      this.lungeT = Math.max(0, this.lungeT - dt);
      const u = 1 - this.lungeT / LUNGE_DUR;
      lw = Math.sin(Math.PI * Math.pow(u, 0.62));       // fast in, slow out
      tz = lerp(tz, 1.55, lw);
      tx = lerp(tx, this.px, lw);
      lam = 9;
    }
    this._lungeW = lw;

    this.talos.position.z = damp(this.talos.position.z, tz, lam, dt);
    this.talos.position.x = damp(this.talos.position.x, tx, lam * 0.6, dt);
    this.trig.body.rotation.x = damp(this.trig.body.rotation.x, prox * 0.22 + lw * 0.3 + (this.quizActive ? 0.18 : 0), 4, dt);
    if (this.trig.eyeGlow) this.trig.eyeGlow.material.opacity = 0.35 + prox * 0.4 + Math.max(lw, this.quizActive ? 0.5 : 0) * 0.25;
    if (this.chaseGap <= G.CHASE_CAUGHT && this.phase === 'playing') this.gameOver('Ο Τάλως σε άρπαξε');
  }

  /* ── quiz ───────────────────────────────────────────────────── */
  _openQuiz() {
    if (this.qIndex >= this.queue.length) { this.queue = buildQueue(); this.qIndex = 0; }
    if (!this.queue.length) { this.quizActive = false; return; }
    this.qData = this.queue[this.qIndex++];
    this.qSel = -1; this.qResolved = false; this.qTimer = G.Q_TIME;
    this.quizActive = true; this.asked++;
    $('q-text').textContent = this.qData.q;
    const opts = $('q-opts'); opts.innerHTML = '';
    opts.style.gridTemplateColumns = this.qData.a.length === 4 ? 'repeat(2,1fr)' : `repeat(${this.qData.a.length},1fr)`;
    this.qData.a.forEach((txt, i) => {
      const d = document.createElement('div');
      d.className = 'q-opt'; d.dataset.i = i;
      d.innerHTML = `<span class="lbl">${i + 1}</span><span class="txt">${txt}</span>`;
      opts.appendChild(d);
    });
    const hint = $('q-hint-keys');
    if (hint) hint.innerHTML = this.qData.a.map((_, i) => `<kbd>${i + 1}</kbd>`).join('');
    $('qwrap').classList.add('visible');
    this.sfx.quiz();
  }
  _tickQuiz(dt) {
    if (this.qResolved) return;
    this.qTimer -= dt;
    $('q-timer').style.width = clamp(this.qTimer / G.Q_TIME, 0, 1) * 100 + '%';
    if (this.qTimer <= 0) this._resolveQuiz(-1);
  }
  answer(i) {
    if (!this.quizActive || this.qResolved) return;
    this._resolveQuiz(i);
  }
  _resolveQuiz(i) {
    this.qResolved = true;
    const correct = this.qData.correct;
    const opts = [...$('q-opts').children];
    opts.forEach((el, idx) => {
      if (idx === correct) el.classList.add('correct');
      else if (idx === i) el.classList.add('wrong');
    });
    if (i === correct) {
      this.correct++; this.streak++; this.maxStreak = Math.max(this.maxStreak, this.streak);
      const pts = G.Q_CORRECT + this.streak * G.Q_STREAK;
      this.score += pts;
      this.chaseGap = Math.min(G.CHASE_MAX, this.chaseGap + G.CHASE_CORRECT + this.streak * G.CHASE_STREAK);
      this._flash(true, this.streak >= 3 ? 'ΣΩΣΤΟ ×' + this.streak : 'ΣΩΣΤΟ');
      this.cheerT = 0.75;
      this.sfx.correct(this.streak);
      this._floater('+' + pts, '#5BB85C');
      const sc = $('hud-score'); sc.classList.remove('bump'); void sc.offsetWidth; sc.classList.add('bump');
      // Talos is repelled — golden burst behind you
      this.sparks.burst(this.px, 1.4, 1.4, { count: 20, color: 0xF4C64A, speed: 4, up: 3, size: 0.24, life: 0.6, spread: 1.6 });
    } else {
      this.streak = 0;
      this.chaseGap -= G.CHASE_WRONG + G.CHASE_LUNGE;
      this._flash(false, 'ΛΑΘΟΣ');
      this.stumbleT = 0.5;
      this._danger();
      this.sfx.wrong();
      if (this.chaseGap <= G.CHASE_CAUGHT) { this.gameOver('Λάθος απάντηση — ο Τάλως σε πρόλαβε'); }
      else { this.lungeT = LUNGE_DUR; this.sfx.lunge(); }
    }
    setTimeout(() => {
      $('qwrap').classList.remove('visible');
      this.quizActive = false;
      this.nextQuizAt = this.runTime() + rand(G.Q_GAP_MIN, G.Q_GAP_MAX);
    }, 850);
  }

  /* ── feedback ───────────────────────────────────────────────── */
  _flash(good, txt) {
    const f = $('flash'); f.textContent = txt;
    f.className = ''; void f.offsetWidth;
    f.className = good ? 'go-correct' : 'go-wrong';
  }
  _toast(txt, colorHex) {
    const t = $('toast'); t.innerHTML = `<span class="toast-txt">${txt}</span>`;
    t.style.setProperty('--tc', hex6(colorHex));
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  }
  _puToast(type, overrideName) {
    const meta = PU_META[type]; const col = hex6(puColor(type));
    const info = Game.PU_INFO[type] || {};
    const t = $('toast');
    t.style.setProperty('--tc', col);
    t.innerHTML =
      `<span class="toast-icon">${Game.PU_ICON[type] || ''}</span>` +
      `<span class="toast-body"><span class="toast-txt">${overrideName || meta.label}</span>` +
      `<span class="toast-sub">${info.sub || ''}</span></span>`;
    t.classList.remove('show'); void t.offsetWidth; t.classList.add('show');
  }
  _danger() {
    this._pulse = 1;
    const d = $('danger'); d.classList.add('d1');
    clearTimeout(this._dz); this._dz = setTimeout(() => d.classList.remove('d1'), 600);
  }
  _landRing() {
    this.sfx.land();
    this.dust.burst(this.px, 0.08, 0.25, { count: 10, color: 0xD8C9A8, speed: 2.6, up: 1.2, size: 0.44, life: 0.55, spread: 1.3 });
    if (this._fastFall) { this.shake = Math.max(this.shake, 0.35); this._fastFall = false; }
  }

  /* kinetic score floaters ("+250", "ΠΑΡΑ ΤΡΙΧΑ") */
  _floater(txt, color) {
    const host = $('floaters');
    if (!host) return;
    while (host.children.length > 5) host.firstChild.remove();
    const d = document.createElement('div');
    d.className = 'fl';
    d.textContent = txt;
    if (color) d.style.color = color;
    d.style.left = (50 + (Math.random() * 18 - 9)) + '%';
    host.appendChild(d);
    setTimeout(() => d.remove(), 1150);
  }

  /* ── HUD ────────────────────────────────────────────────────── */
  _hud() {
    $('hud-score').textContent = Math.floor(this.score).toLocaleString();
    $('hud-coins').textContent = this.coins;
    $('hud-dist').textContent = Math.floor(this.distance) + 'm';
    $('hud-mult').textContent = '×' + this.mult;
    $('hud-streak').textContent = this.streak > 0 ? '🔥' + this.streak : '—';
    const prox = this._prox ?? 0;
    $('chase-fill').style.width = (prox * 100).toFixed(0) + '%';
    const cf = $('chase-fill');
    cf.style.background = prox > 0.7 ? '#d84b3a' : prox > 0.45 ? '#e8b23c' : '#5bb85c';
    $('chase').classList.toggle('peril', prox > 0.7);
    this._puHud();
    const dg = $('danger');
    if (prox > 0.78 && this.phase === 'playing') dg.classList.add('d2'); else dg.classList.remove('d2');

    const sfx = $('speedfx');
    if (sfx) {
      let v = clamp((this.speed - 26) / 14, 0, 1) * 0.42;
      if (this.pu.dash > 0) v = Math.max(v, 0.6);
      if (this.phase !== 'playing') v = 0;
      sfx.style.opacity = v.toFixed(2);
      sfx.classList.toggle('on', v > 0.05);
    }
  }
  _puHud() {
    const hud = $('pu-hud');
    let html = '';
    for (const k of ['chariot', 'dash', 'shield', 'magnet', 'mult']) {
      if (this.pu[k] > 0) {
        const frac = clamp(this.pu[k] / (this.puMax[k] || 1), 0, 1) * 100;
        html += `<span class="pu pu-${k}" style="--pc:${hex6(puColor(k))}">` +
                `<span class="pu-ic">${Game.PU_ICON[k] || ''}</span>` +
                `<span class="pu-meta"><span class="pu-name">${Game.PU_SHORT[k]}</span>` +
                `<span class="pu-bar"><span style="width:${frac}%"></span></span></span>` +
                `<b>${Math.ceil(this.pu[k])}</b></span>`;
      }
    }
    hud.innerHTML = html;
  }

  /* ── actor animation ────────────────────────────────────────── */
  _animActors(dt) {
    const rig = this.prig;
    const moving = this.phase === 'playing';
    const sp = moving ? this.speed : 8;
    this.runPhase += dt * sp * 0.6;
    const p = this.runPhase;

    if (this.sliding) {
      rig.body.rotation.x = damp(rig.body.rotation.x, 0.5, 16, dt);
      rig.body.position.y = damp(rig.body.position.y, -0.1, 16, dt);
    } else {
      rig.body.rotation.x = damp(rig.body.rotation.x, 0.2, 14, dt);
      const bob = this.onGround ? Math.abs(Math.sin(p)) * 0.12 : 0;
      rig.body.position.y = damp(rig.body.position.y, bob, 12, dt);
    }

    this.jumpStretch = damp(this.jumpStretch, 1, 9, dt);
    rig.body.scale.set(2 - this.jumpStretch, this.jumpStretch, 2 - this.jumpStretch);

    const lean = clamp(-(G.LANE_X[this.targetLane] - this.px) * 0.5, -0.5, 0.5);
    rig.body.rotation.z = damp(rig.body.rotation.z, this.sliding ? 0 : lean, 10, dt);
    rig.body.rotation.y = damp(rig.body.rotation.y, this.sliding ? 0 : lean * 0.5, 10, dt);

    if (this.onGround && !this.sliding) {
      const sw = 1.4;
      rig.legL.rotation.x = Math.sin(p) * sw;
      rig.legR.rotation.x = Math.sin(p + Math.PI) * sw;
      rig.legL.userData.shin.rotation.x = Math.max(0, -Math.sin(p)) * 1.5;
      rig.legR.userData.shin.rotation.x = Math.max(0, -Math.sin(p + Math.PI)) * 1.5;
      rig.armL.rotation.x = Math.sin(p + Math.PI) * 1.3;
      rig.armR.rotation.x = Math.sin(p) * 1.3;
      rig.armL.userData.fore.rotation.x = -0.75;
      rig.armR.userData.fore.rotation.x = -0.75;
      if (rig.headG) rig.headG.rotation.x = Math.sin(p * 2) * 0.05 + 0.05;
      // footfall dust — a puff each time a foot strikes the marble
      const s = Math.sin(p);
      if (moving && ((this._prevSin <= 0 && s > 0) || (this._prevSin >= 0 && s < 0))) {
        const side = s > 0 ? -1 : 1;
        this.dust.burst(this.px + side * 0.18, 0.05, 0.2,
          { count: 2, color: 0xD8C9A8, speed: 1.2, up: 1.0, size: 0.3, life: 0.42 });
        if ((this._stepN = (this._stepN || 0) + 1) % 2 === 0) this.sfx.step();
      }
      this._prevSin = s;
    } else if (!this.sliding) {
      rig.legL.rotation.x = damp(rig.legL.rotation.x, -0.7, 12, dt);
      rig.legR.rotation.x = damp(rig.legR.rotation.x, -1.0, 12, dt);
      rig.armL.rotation.x = damp(rig.armL.rotation.x, -2.2, 12, dt);
      rig.armR.rotation.x = damp(rig.armR.rotation.x, -2.2, 12, dt);
    } else {
      rig.legL.rotation.x = damp(rig.legL.rotation.x, 0.5, 16, dt);
      rig.legR.rotation.x = damp(rig.legR.rotation.x, 0.5, 16, dt);
      rig.legL.userData.shin.rotation.x = damp(rig.legL.userData.shin.rotation.x, 1.5, 16, dt);
      rig.legR.userData.shin.rotation.x = damp(rig.legR.userData.shin.rotation.x, 1.5, 16, dt);
      rig.armL.rotation.x = damp(rig.armL.rotation.x, -0.35, 16, dt);
      rig.armR.rotation.x = damp(rig.armR.rotation.x, -0.35, 16, dt);
      rig.armL.userData.fore.rotation.x = damp(rig.armL.userData.fore.rotation.x, -0.7, 16, dt);
      rig.armR.userData.fore.rotation.x = damp(rig.armR.userData.fore.rotation.x, -0.7, 16, dt);
      if (rig.headG) rig.headG.rotation.x = damp(rig.headG.rotation.x, 0.2, 16, dt);
    }

    rig.armL.rotation.z = damp(rig.armL.rotation.z, 0, 12, dt);
    rig.armR.rotation.z = damp(rig.armR.rotation.z, 0, 12, dt);

    // tuck-roll: a full forward somersault folded into the slide start.
    // Rotation is pivot-compensated around the waist (p0) so the flip spins
    // in place instead of cartwheeling around the feet.
    if (this.rollT > 0) {
      this.rollT = Math.max(0, this.rollT - dt);
      const u = 1 - this.rollT / ROLL_DUR;
      const e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2;  // easeInOutQuad
      const phi = Math.PI * 2 * (1 - e);          // unwinds 2π → 0 = forward flip
      const p0 = 0.9;                              // waist pivot height
      rig.body.rotation.x = 0.5 + phi;
      rig.body.position.y = p0 * (1 - Math.cos(phi)) + Math.sin(u * Math.PI) * 0.18;
      rig.body.position.z = -p0 * Math.sin(phi);
      const tuck = Math.sin(Math.min(1, u * 1.2) * Math.PI);
      rig.legL.rotation.x = lerp(rig.legL.rotation.x, 1.6, tuck);
      rig.legR.rotation.x = lerp(rig.legR.rotation.x, 1.6, tuck);
      rig.legL.userData.shin.rotation.x = lerp(rig.legL.userData.shin.rotation.x, 2.1, tuck);
      rig.legR.userData.shin.rotation.x = lerp(rig.legR.userData.shin.rotation.x, 2.1, tuck);
      rig.armL.rotation.x = lerp(rig.armL.rotation.x, -0.9, tuck);
      rig.armR.rotation.x = lerp(rig.armR.rotation.x, -0.9, tuck);
      if (rig.headG) rig.headG.rotation.x = lerp(rig.headG.rotation.x, 0.7, tuck);
    } else if (Math.abs(rig.body.position.z) > 0.001) {
      rig.body.position.z = damp(rig.body.position.z, 0, 14, dt);
    }

    // cloth lives at speed: tunic flare + flutter, hair streams back
    const spF = clamp((sp - G.BASE_SPEED) / (G.MAX_SPEED - G.BASE_SPEED), 0, 1);
    if (rig.skirt) {
      const fl = 1 + Math.abs(Math.sin(p * 2 + 0.6)) * 0.09 + spF * 0.12;
      rig.skirt.scale.set(fl, 1 - spF * 0.05, fl);
      rig.skirt.rotation.x = 0.1 * spF + Math.sin(p * 2) * 0.05;
    }
    if (rig.mane) {
      rig.mane.rotation.x = -0.1 - 0.3 * spF + Math.sin(p * 2 + 1.2) * 0.07;
    }

    if (this.stumbleT > 0) {
      this.stumbleT = Math.max(0, this.stumbleT - dt);
      const w = Math.sin((this.stumbleT / 0.5) * Math.PI);
      rig.body.rotation.x = lerp(rig.body.rotation.x, -0.55, w);
      rig.body.rotation.z = lerp(rig.body.rotation.z, Math.sin(this.runPhase * 38) * 0.18 * w, 1);
      rig.armL.rotation.x = lerp(rig.armL.rotation.x, -2.5, w);
      rig.armR.rotation.x = lerp(rig.armR.rotation.x, -2.1, w);
      rig.legL.rotation.x = lerp(rig.legL.rotation.x, 0.8, w);
      rig.legR.rotation.x = lerp(rig.legR.rotation.x, -0.3, w);
      if (rig.headG) rig.headG.rotation.x = lerp(rig.headG.rotation.x, -0.5, w);
    }
    if (this.cheerT > 0) {
      this.cheerT = Math.max(0, this.cheerT - dt);
      const prog = 1 - this.cheerT / 0.75;
      const w = Math.sin(prog * Math.PI);
      rig.body.position.y += Math.sin(prog * Math.PI) * 0.55;
      rig.body.rotation.x = lerp(rig.body.rotation.x, -0.12, w);
      rig.armL.rotation.x = lerp(rig.armL.rotation.x, -2.7, w);
      rig.armR.rotation.x = lerp(rig.armR.rotation.x, -2.7, w);
      rig.armL.rotation.z = lerp(0, 0.4, w);
      rig.armR.rotation.z = lerp(0, -0.4, w);
      if (rig.headG) rig.headG.rotation.x = lerp(rig.headG.rotation.x, -0.18, w);
    }

    // caught: flailing in the automaton's grip
    if (this.phase === 'caught') {
      const now = performance.now();
      rig.body.rotation.x = damp(rig.body.rotation.x, -0.45, 10, dt);
      rig.armL.rotation.x = -2.4 + Math.sin(now / 55) * 0.5;
      rig.armR.rotation.x = -2.0 - Math.sin(now / 55) * 0.5;
      rig.legL.rotation.x = 0.7 + Math.sin(now / 70) * 0.35;
      rig.legR.rotation.x = -0.4 - Math.sin(now / 70) * 0.35;
      if (rig.headG) rig.headG.rotation.x = damp(rig.headG.rotation.x, -0.45, 10, dt);
    }

    rig.blob.scale.setScalar(clamp(1 - this.py * 0.12, 0.4, 1));
    rig.blob.material.opacity = clamp(0.32 - this.py * 0.03, 0.08, 0.32);

    this._chariotFx(dt);

    const tp = this.runPhase * 0.62;
    const tr = this.trig;
    if (this.phase === 'caught') {
      // arms clamp around the runner; the rest is driven by _caughtCine
      tr.armL.rotation.x = damp(tr.armL.rotation.x, -1.9, 10, dt);
      tr.armR.rotation.x = damp(tr.armR.rotation.x, -1.9, 10, dt);
      tr.legL.rotation.x = damp(tr.legL.rotation.x, 0.3, 8, dt);
      tr.legR.rotation.x = damp(tr.legR.rotation.x, 0.3, 8, dt);
      tr.body.position.y = damp(tr.body.position.y, 0.05, 8, dt);
      tr.headG.rotation.y = Math.sin(performance.now() / 90) * 0.06;
    } else {
      tr.legL.rotation.x = Math.sin(tp) * 0.7;
      tr.legR.rotation.x = Math.sin(tp + Math.PI) * 0.7;
      tr.armL.rotation.x = Math.sin(tp + Math.PI) * 0.5;
      tr.armR.rotation.x = Math.sin(tp) * 0.5;
      tr.body.position.y = Math.abs(Math.sin(tp)) * 0.18;
      tr.headG.rotation.y = Math.sin(this.runPhase * 0.3) * 0.15;
      // his bronze footfalls thud the ground when he's close behind
      const ts = Math.sin(tp);
      if (this.phase === 'playing' && (this._prox || 0) > 0.5 &&
          ((this._tSin <= 0 && ts > 0) || (this._tSin >= 0 && ts < 0))) {
        this.shake = Math.max(this.shake, 0.05 + this._prox * 0.16);
        this.sfx.thud(this._prox);
      }
      this._tSin = ts;
    }
    this.talos.visible = this.phase !== 'menu';

    this._shieldFx(dt);
  }

  _chariotFx() {
    if (this.pu.chariot > 0) {
      if (!this._chariot) {
        this._chariot = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.4, 1.1),
          new THREE.MeshLambertMaterial({ color: PAL.chariot, flatShading: true, emissive: 0x442200 }));
        this.scene.add(this._chariot);
      }
      this._chariot.visible = true;
      this._chariot.position.set(this.player.position.x, this.player.position.y - 0.5, 0);
    } else if (this._chariot) this._chariot.visible = false;
  }
  _shieldFx() {
    if (this.pu.shield > 0) {
      if (!this._shield) {
        this._shield = new THREE.Mesh(
          new THREE.SphereGeometry(1.3, 16, 12),
          new THREE.MeshBasicMaterial({ color: PAL.aegis, transparent: true, opacity: 0.16, depthWrite: false }));
        this.scene.add(this._shield);
      }
      this._shield.visible = true;
      this._shield.position.copy(this.player.position).y += 1.0;
      this._shield.rotation.y += 0.02;
    } else if (this._shield) this._shield.visible = false;
  }

  /* ── camera ─────────────────────────────────────────────────── */
  _camera(dt) {
    // shake decays every frame (crashes / landings / the grab kick it up)
    this.shake = Math.max(0, this.shake - dt * 2.6);
    const shaking = (this.phase === 'playing' || this.phase === 'caught') ? this.shake : 0;
    const sx = (Math.random() - 0.5) * shaking * 0.5;
    const sy = (Math.random() - 0.5) * shaking * 0.4;
    const camX = this.px * 0.18 + sx;
    this.camera.position.x = damp(this.camera.position.x, camX, 8, dt);

    // subtle run-bob that grows with speed + chariot rise
    const spF = clamp((this.speed - G.BASE_SPEED) / (G.MAX_SPEED - G.BASE_SPEED), 0, 1);
    const bob = (this.phase === 'playing' && this.onGround && !this.sliding && !REDUCED_MOTION)
      ? Math.sin(this.runPhase * 2) * 0.05 * spF : 0;
    this.camera.position.y = G.CAM_Y + sy + bob + (this.pu.chariot > 0 ? 0.6 : 0);

    // the grab: dolly in toward the struggle, pull back out otherwise
    const wantZ = this.phase === 'caught' ? G.CAM_Z - 2.6 : G.CAM_Z;
    this.camera.position.z = damp(this.camera.position.z, wantZ, this.phase === 'caught' ? 3.4 : 5, dt);

    // FOV: wide-angle rush as speed ramps + near-miss / power-up kicks
    this.fovKick = Math.max(0, this.fovKick - dt * 6);
    let fovT = 58 + spF * 11 + (this.pu.dash > 0 ? 6 : 0) + this.fovKick;
    if (this.phase === 'caught') fovT = 47;               // punch-in close-up
    this.camera.fov = damp(this.camera.fov, fovT, 6, dt);
    this.camera.updateProjectionMatrix();

    if (this.phase === 'caught') {
      this.camera.lookAt(this.px * 0.6, 1.6, 0.8);
    } else {
      this.camera.lookAt(this.px * 0.12, G.CAM_LOOK_Y, G.CAM_LOOK_Z);
    }

    // slight dutch roll while strafing — sells the body lean
    const rollTarget = (this.phase === 'playing' && !REDUCED_MOTION)
      ? clamp(-this.laneVel * 0.0075, -0.085, 0.085) : 0;
    this._camRoll = damp(this._camRoll, rollTarget, 7, dt);
    this.camera.rotateZ(this._camRoll);
  }
}

/* short HUD names */
Game.PU_SHORT = {
  magnet: 'ΣΑΝΔΑΛΙΑ', shield: 'ΑΙΓΙΔΑ', dash: 'ΟΡΜΗ', mult: '×2 ΒΑΘΜΟΙ', chariot: 'ΑΡΜΑ',
};
Game.PU_INFO = {
  magnet:  { sub: 'Έλκει τις δραχμές' },
  shield:  { sub: 'Απορροφά ένα χτύπημα' },
  dash:    { sub: 'Όρμη — ο Τάλως μένει πίσω' },
  mult:    { sub: 'Διπλασιάζει τους βαθμούς' },
  chariot: { sub: "Πετάς πάνω απ' τα εμπόδια" },
};
Game.PU_ICON = {
  magnet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h11l2-3"/><path d="M5 17l-1-3h9l1 3"/><path d="M13 12c2-3 5-4 7-3-1 2-3 3-5 3"/><path d="M11 12c1-2.5 3.5-3.5 5.5-3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l7 3v5c0 4.4-3 8-7 10-4-2-7-5.6-7-10V6z"/><circle cx="12" cy="11" r="2.4" fill="currentColor" stroke="none"/></svg>',
  dash:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7l6 5-6 5"/><path d="M11 7l6 5-6 5"/></svg>',
  mult:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4c-3 4-3 12 0 16M18 4c3 4 3 12 0 16"/><path d="M9.5 9.5l5 5M14.5 9.5l-5 5" stroke-width="2.2"/></svg>',
  chariot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="17" r="3"/><path d="M12 15h5l2-4h-7z"/><path d="M3 9c3-1 6 0 8 2M3 12c2.5-.5 4.5 0 6 1"/></svg>',
};
