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
import { buildRunner, buildTalos, buildMinotaur, puLabel, puColor, PU_META } from './builders-actors.js';
import { buildQueue } from './questions.js';
import { Particles, Rings, Sfx, REDUCED_MOTION } from './juice.js';
import { vmetal, gradTint, glow } from './gfx.js';

const ROLL_DUR = 0.42;    // seconds of the slide tuck-roll
const LUNGE_DUR = 0.95;   // chaser lunge-into-frame beat

/* ── the two hunters. One is rolled per run (Math.random at run start,
   re-rolled on every replay). Debug override: ?chaser=talos|minotaur
   in the URL, or window.__chaser = 'talos'|'minotaur' before a run. */
const CHASERS = {
  talos: {
    name: 'ΤΑΛΩΣ', hud: '#F4C75A',                      // bronze
    grab: 'Ο Τάλως σε άρπαξε',
    quizLose: 'Λάθος απάντηση — ο Τάλως σε πρόλαβε',
    ember: [0xFF7A2E, 0xFFB03C],
    stompRing: 0xD9975A, stompDust: 0xC9AE86,
  },
  minotaur: {
    name: 'ΜΙΝΩΤΑΥΡΟΣ', hud: '#FF6B52',                 // blood-red
    grab: 'Ο Μινώταυρος σε άρπαξε',
    quizLose: 'Λάθος απάντηση — ο Μινώταυρος σε πρόλαβε',
    ember: [0xFF3A20, 0x9A4B2E],
    stompRing: 0x8B6B4A, stompDust: 0x7A6248,
  },
};

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
    // the hunter — ΤΑΛΩΣ or ΜΙΝΩΤΑΥΡΟΣ, rolled per run (built lazily,
    // cached, re-picked in start()). this.talos/this.trig always point
    // at the ACTIVE chaser so the shared choreography drives either.
    this._hunters = {};
    this._pickChaser();

    // juice: particle pools + expanding impact rings + procedural synth
    this.sparks = new Particles(this.scene, { max: 240, additive: true, gravity: -6, drag: 2.2 });
    this.dust = new Particles(this.scene, { max: 180, additive: false, gravity: -2.6, drag: 2.6, grow: true, alpha: 0.55 });
    this.rings = new Rings(this.scene, { max: 10 });
    this.sfx = new Sfx();

    // cached day/night cloud tints (no per-frame allocations)
    this._cloudDay = new THREE.Color(0xffffff);
    this._cloudNight = new THREE.Color(0x76839F);
    this._envNight = -1;     // forces the first env-intensity sync

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
    this._grinT = 0; this._mood = null;              // force a face resync
    this._mShakeT = 0; this._snortT = undefined;
    this._menuT = 0; this._lookT = undefined;
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
    this._mood = null; this._blinkA = 0;   // fresh face — resync blink/mood
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

  /* ── hunter selection (ΤΑΛΩΣ / ΜΙΝΩΤΑΥΡΟΣ) ──────────────────── */
  _pickChaser() {
    let want = '';
    try {
      want = (window.__chaser || new URLSearchParams(location.search).get('chaser') || '')
        .toString().toLowerCase();
    } catch (e) { /* URL API unavailable — fall through to the roll */ }
    const kind = (want === 'talos' || want === 'minotaur')
      ? want
      : (Math.random() < 0.5 ? 'talos' : 'minotaur');
    if (!this._hunters[kind]) {
      const h = kind === 'minotaur' ? buildMinotaur() : buildTalos();
      this._hunters[kind] = h;
      this.scene.add(h.root);
    }
    for (const k in this._hunters) this._hunters[k].root.visible = false;
    const h = this._hunters[kind];
    this.chaserKind = kind;
    this._ck = CHASERS[kind];
    this.talos = h.root; this.trig = h.rig;
    this.talos.visible = this.phase === 'playing' || this.phase === 'caught';
    // the HUD chase gauge wears the hunter's name + colour
    const nm = $('chase-name');
    if (nm) { nm.textContent = this._ck.name; nm.style.color = this._ck.hud; }
  }

  /* chaser SFX — Talos keeps his bronze synth; the Minotaur gets deeper
     hoof thuds and a snort/roar rumble through the SAME audio path (and
     therefore the same mute toggle). */
  _chaserThud(strength = 0.5) {
    if (this.trig.kind === 'minotaur') {
      const v = 0.05 + strength * 0.11;
      this.sfx.tone(52, 24, 0.22, { type: 'sine', vol: v });
      this.sfx.noise(0.11, { f: 110, filter: 'lowpass', vol: v * 0.55 });
    } else this.sfx.thud(strength);
  }
  _chaserLunge() {
    if (this.trig.kind === 'minotaur') {
      // bull roar — layered low saws + a falling growl of noise
      this.sfx.tone(82, 38, 0.72, { type: 'sawtooth', vol: 0.2 });
      this.sfx.tone(124, 56, 0.7, { type: 'sawtooth', vol: 0.12 });
      this.sfx.tone(165, 72, 0.5, { type: 'square', vol: 0.05, delay: 0.06 });
      this.sfx.noise(0.6, { f: 240, slideTo: 85, q: 0.8, vol: 0.16 });
    } else this.sfx.lunge();
  }
  _chaserSnort() {
    // double nostril blast + a chesty rumble
    this.sfx.noise(0.16, { f: 420, slideTo: 150, q: 1.4, vol: 0.12 });
    this.sfx.noise(0.12, { f: 380, slideTo: 140, q: 1.4, vol: 0.09, delay: 0.14 });
    this.sfx.tone(90, 58, 0.2, { type: 'sine', vol: 0.05 });
  }
  /* twin steam-puffs from the Minotaur's nostrils. He faces -z (the flip),
     so the muzzle sits on his far side and the blast drives up the chase —
     toward the runner, away from the camera. */
  _nostrilPuff(k = 1) {
    const tx = this.talos.position.x, tz = this.talos.position.z;
    for (const s of [-1, 1]) {
      this.dust.burst(tx + s * 0.14, 2.0, tz - 0.42,
        { count: Math.ceil(2 * k), color: 0xE8E0D4, speed: 0.5 * k, up: 0.35, size: 0.28 * k, life: 0.5, vz: -2.4 });
    }
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
      // heel-plant grit as the strafe launches (presentation only)
      if (this.onGround && !this.sliding) {
        this.dust.burst(this.px - dir * 0.25, 0.06, 0.22,
          { count: 3, color: 0xD8C9A8, speed: 1.5, up: 0.9, size: 0.32, life: 0.4 });
      }
    }
  }
  jump() {
    if (this.phase !== 'playing') return;
    if (this.onGround && !this.sliding) {
      this.vy = G.JUMP_VEL; this.onGround = false; this.jumpStretch = 1.22;
      this._anticT = 0.085;         // visual-only spring crouch (physics untouched)
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
    this._pickChaser();          // roll the hunter for THIS run (also on replay)
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
    this._chaserLunge();
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
    if (tr.moltenMat) tr.moltenMat.emissiveIntensity = 3.2 + Math.sin(performance.now() / 90) * 0.5;
    if (tr.heat) tr.heat.material.opacity = 0.3 + Math.sin(performance.now() / 120) * 0.08;
    this._pulse = Math.max(this._pulse, 0.4);                      // hold the red grade
    if (Math.random() < dt * 18) {                                 // rage — embers fly
      this.sparks.burst(this.talos.position.x + rand(-0.5, 0.5), rand(0.8, 2.4), this.talos.position.z,
        { count: 1, color: this._ck.ember[0], speed: 1.2, up: 2.2, size: 0.22, life: 0.5 });
    }
    if (this.trig.kind === 'minotaur' && Math.random() < dt * 7) this._nostrilPuff(0.9);
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
    this.rings.update(dt, dz);
    this._animActors(dt);
    this._camera(dt);
    this._render(dt);
    if (!this._shown) { this._shown = true; const l = document.getElementById('loading'); if (l) l.classList.add('hidden'); }
  }

  _render(dt) {
    this.atmo.update(dt, this.lights, this.renderer);
    // clouds pick up the mood of the hour (moonlit slate at night)
    const nf = this.atmo.nightF || 0;
    for (const c of this.world.clouds) {
      const m = c.userData.mat;
      if (m) m.color.copy(this._cloudDay).lerp(this._cloudNight, nf);
    }
    // the baked room-env IBL is a CONSTANT ambient — unless it fades with
    // the night factor the ground stays noon-bright under a starry sky.
    // Only re-traverse when the blend actually moves (dawn/dusk), so the
    // steady phases pay nothing.
    if (Math.abs(nf - this._envNight) > 0.012) {
      this._envNight = nf;
      const k = 1 - 0.9 * nf;
      this.scene.traverse((o) => {
        const m = o.material;
        if (m && m.isMeshStandardMaterial) {
          if (m.userData._envBase === undefined) m.userData._envBase = m.envMapIntensity;
          m.envMapIntensity = m.userData._envBase * k;
        }
      });
    }
    this._pulse = Math.max(0, this._pulse - dt * 2.2);
    this.post.setPulse(this._pulse);
    // chromatic fringe widens with velocity — wind in the lens (high tier)
    const spF = this.phase === 'playing'
      ? clamp((this.speed - G.BASE_SPEED) / (G.MAX_SPEED - G.BASE_SPEED), 0, 1) : 0;
    this.post.setSpeed(spF + (this.pu.dash > 0 ? 0.35 : 0));
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
      if (this.py <= 0) {
        const impact = -this.vy;    // fall speed at touch-down (drives ring/shake size)
        this.py = 0; this.vy = 0; this.onGround = true; this.jumpStretch = 0.78;
        this._landRing(impact);
      }
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
    if (this.chaseGap <= G.CHASE_CAUGHT) { this.gameOver(this._ck.grab); return; }
    // the inspector-grab beat: the hunter LUNGES into frame…
    this.lungeT = LUNGE_DUR;
    this._chaserLunge();
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
    // stray sun-glints on drachmas ahead — struck gold catches the light
    const cs = this.world.coins;
    if (cs.length && Math.random() < dt * 7) {
      const c = cs[(Math.random() * cs.length) | 0];
      const z = c.position.z;
      if (z > -46 && z < 2) {
        this.sparks.burst(c.position.x + rand(-0.18, 0.18), c.position.y + rand(-0.05, 0.28), z,
          { count: 1, color: 0xFFF3C0, speed: 0.3, up: 0.5, size: 0.24, life: 0.32 });
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
    if (this.coinChain >= 5) this._grinT = 0.9;      // streak high — she beams
    this.sfx.coin(this.coinChain - 1);
    const px = c ? c.position.x : this.px, py = c ? c.position.y : this.py + 1, pz = c ? c.position.z : 0;
    this.sparks.burst(px, py, pz, { count: 6, color: 0xF4C64A, speed: 2.2, up: 1.6, size: 0.2, life: 0.45 });
    if (this.coinChain > 0 && this.coinChain % 15 === 0) this._floater('+' + this.coinChain + ' ΔΡΑΧΜΕΣ!', '#B5811C');
  }
  _getPowerup(type, pos) {
    const dur = { magnet: G.PU_MAGNET, shield: G.PU_SHIELD, dash: G.PU_DASH, mult: G.PU_MULT, chariot: G.PU_CHARIOT }[type];
    this.pu[type] = dur;
    this.puMax[type] = dur;
    this._grinT = 1.5;                               // power-up joy
    if (type === 'dash') this.chaseGap = Math.min(G.CHASE_MAX, this.chaseGap + 3);
    this._puToast(type);
    this.sfx.power();
    this.fovKick = Math.min(this.fovKick + 3, 8);
    const col = puColor(type);
    const bx = pos ? pos.x : this.px, by = pos ? pos.y : 1.2, bz = pos ? pos.z : 0;
    this.sparks.burst(bx, by, bz, { count: 26, color: col, speed: 4, up: 3.2, size: 0.26, life: 0.65, spread: 1.4 });
    this.rings.spawn(bx, 0.04, bz, { color: col, r0: 0.4, r1: 2.3, life: 0.5, alpha: 0.55 });
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
    // furnace seams burn hotter the closer he gets (and flare on a lunge)
    if (this.trig.moltenMat) {
      this.trig.moltenMat.emissiveIntensity =
        0.7 + prox * 2.6 + lw * 1.4 + Math.sin(this.runTime() * 11) * 0.18 * (0.3 + prox);
    }
    // hot rim bleeding around his silhouette — pure menace radiance
    if (this.trig.heat) {
      this.trig.heat.material.opacity =
        Math.max(0, prox - 0.25) * 0.26 + lw * 0.14 + (this.quizActive ? 0.05 : 0);
    }
    // menace particles — Talos sheds furnace embers; the Minotaur breathes
    // steam from his nostrils and paws up dust (density scales with menace)
    if (this.trig.kind === 'minotaur') {
      if (prox > 0.18 && Math.random() < dt * (0.8 + prox * 3.2)) this._nostrilPuff(0.55 + prox * 0.6);
      // snort + head-shake beat — the bull tosses his horns
      this._snortT = (this._snortT === undefined ? rand(2.5, 5) : this._snortT) - dt;
      if (this._snortT <= 0) {
        this._snortT = rand(3, 6.5);
        if (prox > 0.1) {
          this._mShakeT = 0.55;
          this._chaserSnort();
          this._nostrilPuff(1.6);
        }
      }
    } else if (prox > 0.12 && Math.random() < dt * (2 + prox * 12)) {
      // embers shed off the furnace back — the camera side now — and
      // stream toward the lens with the world scroll
      this.sparks.burst(
        this.talos.position.x + rand(-0.5, 0.5), rand(0.5, 2.2), this.talos.position.z + rand(-0.2, 0.3),
        { count: 1, color: this._ck.ember[Math.random() < 0.5 ? 0 : 1], speed: 0.7, up: 1.7, size: 0.2, life: 0.5, vz: 1.4 });
    }
    if (this.chaseGap <= G.CHASE_CAUGHT && this.phase === 'playing') this.gameOver(this._ck.grab);
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
      this._grinT = 1.3;
      this.sfx.correct(this.streak);
      this._floater('+' + pts, '#5BB85C');
      const sc = $('hud-score'); sc.classList.remove('bump'); void sc.offsetWidth; sc.classList.add('bump');
      // Talos is repelled — golden burst + shockwave ring behind you
      this.sparks.burst(this.px, 1.4, 1.4, { count: 20, color: 0xF4C64A, speed: 4, up: 3, size: 0.24, life: 0.6, spread: 1.6 });
      this.rings.spawn(this.px, 0.04, 1.6, { color: 0xF4C64A, r0: 0.5, r1: 3.0, life: 0.55, alpha: 0.5 });
    } else {
      this.streak = 0;
      this.chaseGap -= G.CHASE_WRONG + G.CHASE_LUNGE;
      this._flash(false, 'ΛΑΘΟΣ');
      this.stumbleT = 0.5;
      this._danger();
      this.sfx.wrong();
      if (this.chaseGap <= G.CHASE_CAUGHT) { this.gameOver(this._ck.quizLose); }
      else { this.lungeT = LUNGE_DUR; this._chaserLunge(); }
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
  _landRing(impact = 14) {
    this.sfx.land();
    this.dust.burst(this.px, 0.08, 0.25, { count: 10, color: 0xD8C9A8, speed: 2.6, up: 1.2, size: 0.44, life: 0.55, spread: 1.3 });
    // expanding dust ring + micro-shake proportional to the fall
    this.rings.spawn(this.px, 0.035, 0.25, {
      color: 0xE9DBB6, r0: 0.28, r1: 1.35 + impact * 0.028, life: 0.4, alpha: 0.5,
    });
    if (!REDUCED_MOTION) this.shake = Math.max(this.shake, Math.min(0.3, 0.08 + impact * 0.007));
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
      // kept subtle — at 0.42 the screen-blended streaks used to lay a
      // milky veil over the whole scene at top speed
      let v = clamp((this.speed - 26) / 14, 0, 1) * 0.24;
      if (this.pu.dash > 0) v = Math.max(v, 0.4);
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

  /* ── living face: blink cycle + mouth-mood swaps (all phases) ── */
  _faceTick(dt) {
    const face = this.prig && this.prig.face;
    if (!face) return;
    const fd = face.userData;
    // blink — randomized 2–5 s cycle with the odd quick double-blink
    if (fd.eyes && fd.eyes.length) {
      if (this._blinkT === undefined) this._blinkT = rand(1.2, 3);
      this._blinkT -= dt;
      if (this._blinkT <= 0 && !this._blinkA) {
        this._blinkA = 0.24;
        this._blinkT = Math.random() < 0.16 ? rand(0.3, 0.5) : rand(2, 5);
      }
      if (this._blinkA) {
        this._blinkA = Math.max(0, this._blinkA - dt);
        const k = Math.sin((1 - this._blinkA / 0.24) * Math.PI);
        const sy = Math.max(0.07, 1 - k * 0.93);
        for (const e of fd.eyes) e.scale.y = sy;
        for (const b of fd.brows) b.m.position.y = b.y0 - k * 0.018;
        if (!this._blinkA) for (const e of fd.eyes) e.scale.y = 1;
      }
    }
    // mouth mood — worry under threat / at the quiz gate, grin on streak
    // highs & power-ups, smile at rest. Visibility swaps only.
    if (this._grinT > 0) this._grinT -= dt;
    let mood = 'smile';
    if (this.phase === 'caught') mood = 'worry';
    else if (this.phase === 'playing') {
      if ((this._prox || 0) > 0.6 || this.quizActive || this.stumbleT > 0) mood = 'worry';
      else if (this._grinT > 0) mood = 'grin';
    }
    if (mood !== this._mood && fd.mouths && fd.mouths[mood]) {
      this._mood = mood;
      for (const k in fd.mouths) fd.mouths[k].visible = (k === mood);
      for (const b of fd.brows) {
        b.m.rotation.z = b.z0 + (mood === 'worry' ? -b.s * 0.16 : mood === 'grin' ? b.s * 0.05 : 0);
      }
    }
  }

  /* ── start-card idle: breath, weight shift, look-around ───────── */
  _idleActors(dt) {
    const rig = this.prig;
    this._menuT = (this._menuT || 0) + dt;
    const t = this._menuT;
    const br = Math.sin(t * 1.7);                    // slow breathing wave
    const sway = Math.sin(t * 0.5);                  // slower weight shift
    this.jumpStretch = 1;
    rig.body.scale.set(1, 1, 1);
    rig.body.rotation.x = damp(rig.body.rotation.x, 0.05, 6, dt);
    rig.body.rotation.z = damp(rig.body.rotation.z, sway * 0.05, 4, dt);
    rig.body.rotation.y = damp(rig.body.rotation.y, sway * 0.07, 4, dt);
    rig.body.position.y = damp(rig.body.position.y, 0.015 * br, 6, dt);
    rig.body.position.z = damp(rig.body.position.z, 0, 6, dt);
    // ribcage rises with the breath
    rig.torso.scale.y = 1 + br * 0.016;
    rig.torso.scale.x = rig.torso.scale.z = 1 - br * 0.007;
    rig.torso.rotation.y = damp(rig.torso.rotation.y, 0, 5, dt);
    rig.torso.rotation.z = damp(rig.torso.rotation.z, 0, 5, dt);
    // weight rolls hip to hip
    rig.legL.rotation.x = damp(rig.legL.rotation.x, 0.02 + Math.max(0, sway) * 0.06, 5, dt);
    rig.legR.rotation.x = damp(rig.legR.rotation.x, 0.02 + Math.max(0, -sway) * 0.06, 5, dt);
    rig.legL.userData.shin.rotation.x = damp(rig.legL.userData.shin.rotation.x, 0, 5, dt);
    rig.legR.userData.shin.rotation.x = damp(rig.legR.userData.shin.rotation.x, 0, 5, dt);
    // arms hang loose, drifting with the breath
    rig.armL.rotation.x = damp(rig.armL.rotation.x, 0.05 + br * 0.035, 5, dt);
    rig.armR.rotation.x = damp(rig.armR.rotation.x, 0.05 - br * 0.03, 5, dt);
    rig.armL.rotation.z = damp(rig.armL.rotation.z, 0.07, 5, dt);
    rig.armR.rotation.z = damp(rig.armR.rotation.z, -0.07, 5, dt);
    rig.armL.userData.fore.rotation.x = damp(rig.armL.userData.fore.rotation.x, 0.3, 5, dt);
    rig.armR.userData.fore.rotation.x = damp(rig.armR.userData.fore.rotation.x, 0.32, 5, dt);
    // occasional look-around — retarget a glance every few seconds
    this._lookT = (this._lookT === undefined ? 1.2 : this._lookT) - dt;
    if (this._lookT <= 0) {
      this._lookT = rand(2.2, 4.5);
      this._lookY = rand(-0.55, 0.55);
      this._lookX = rand(-0.06, 0.12);
    }
    rig.headG.rotation.y = damp(rig.headG.rotation.y, this._lookY || 0, 2.5, dt);
    rig.headG.rotation.x = damp(rig.headG.rotation.x, this._lookX || 0, 2.5, dt);
    // cloth settles into a gentle breathing sway
    if (rig.skirt) {
      const f = 1 + Math.abs(br) * 0.015;
      rig.skirt.scale.set(f, 1, f * 0.92);
      rig.skirt.rotation.x = br * 0.015;
      const l2 = rig.skirt.userData.layer2;
      if (l2) l2.rotation.x = Math.sin(t * 1.1) * 0.03;
    }
    if (rig.mane) {
      rig.mane.rotation.x = -0.08 + br * 0.02;
      rig.mane.rotation.z = sway * 0.03;
    }
    rig.blob.scale.setScalar(1);
    rig.blob.material.opacity = 0.32;
  }

  /* ── actor animation ────────────────────────────────────────── */
  _animActors(dt) {
    const rig = this.prig;
    this._faceTick(dt);
    if (this.phase === 'menu') {
      // start-card scene: the hero lives — breathes, shifts, glances
      this._idleActors(dt);
      this.talos.visible = false;
      return;
    }
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

    // take-off anticipation: a lightning spring-crouch folded into the
    // first frames of the ascent (pure presentation — physics untouched)
    if (this._anticT > 0) {
      this._anticT = Math.max(0, this._anticT - dt);
      const w = Math.sin((1 - this._anticT / 0.085) * Math.PI);
      rig.body.scale.y *= 1 - w * 0.13;
      rig.body.scale.x *= 1 + w * 0.08;
      rig.body.scale.z *= 1 + w * 0.08;
    }

    const lean = clamp(-(G.LANE_X[this.targetLane] - this.px) * 0.5, -0.5, 0.5);
    rig.body.rotation.z = damp(rig.body.rotation.z, this.sliding ? 0 : lean, 10, dt);
    rig.body.rotation.y = damp(rig.body.rotation.y, this.sliding ? 0 : lean * 0.5, 10, dt);

    if (this.onGround && !this.sliding) {
      const sw = 1.4;
      // asymmetric stride: fast forward kick, slower recovery — the sine is
      // phase-warped so limbs snap through and ease back (no metronome look)
      const sL = Math.sin(p + Math.sin(2 * p) * 0.16);
      const sR = Math.sin(p + Math.PI + Math.sin(2 * (p + Math.PI)) * 0.16);
      rig.legL.rotation.x = sL * sw;
      rig.legR.rotation.x = sR * sw;
      // knee folds: the trailing heel flicks up toward the camera (+z)
      rig.legL.userData.shin.rotation.x = -Math.max(0, -sL) * 1.6;
      rig.legR.userData.shin.rotation.x = -Math.max(0, -sR) * 1.6;
      rig.armL.rotation.x = sR * 1.3;
      rig.armR.rotation.x = sL * 1.3;
      // forearms pump — elbows bent, hands driving forward (-z)
      rig.armL.userData.fore.rotation.x = 0.5 + Math.max(0, sR) * 0.45;
      rig.armR.userData.fore.rotation.x = 0.5 + Math.max(0, sL) * 0.45;
      // shoulders counter-rotate against the hips + a whisper of roll
      rig.torso.rotation.y = Math.sin(p) * 0.16;
      rig.torso.rotation.z = Math.sin(p) * 0.05;
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
      // hurdle leap: lead knee punches forward, trail leg sweeps back
      rig.legL.rotation.x = damp(rig.legL.rotation.x, 0.9, 12, dt);
      rig.legR.rotation.x = damp(rig.legR.rotation.x, -0.85, 12, dt);
      rig.legL.userData.shin.rotation.x = damp(rig.legL.userData.shin.rotation.x, -1.3, 12, dt);
      rig.legR.userData.shin.rotation.x = damp(rig.legR.userData.shin.rotation.x, -0.5, 12, dt);
      rig.armL.rotation.x = damp(rig.armL.rotation.x, 1.7, 12, dt);
      rig.armR.rotation.x = damp(rig.armR.rotation.x, -1.1, 12, dt);
      rig.armL.userData.fore.rotation.x = damp(rig.armL.userData.fore.rotation.x, 0.8, 12, dt);
      rig.armR.userData.fore.rotation.x = damp(rig.armR.userData.fore.rotation.x, 0.9, 12, dt);
      rig.torso.rotation.y = damp(rig.torso.rotation.y, 0, 10, dt);
      rig.torso.rotation.z = damp(rig.torso.rotation.z, 0, 10, dt);
    } else {
      // tucked surf-slide: feet lead, knees soft, forearms out for balance
      rig.legL.rotation.x = damp(rig.legL.rotation.x, 0.6, 16, dt);
      rig.legR.rotation.x = damp(rig.legR.rotation.x, 0.5, 16, dt);
      rig.legL.userData.shin.rotation.x = damp(rig.legL.userData.shin.rotation.x, -0.55, 16, dt);
      rig.legR.userData.shin.rotation.x = damp(rig.legR.userData.shin.rotation.x, -0.4, 16, dt);
      rig.armL.rotation.x = damp(rig.armL.rotation.x, -0.35, 16, dt);
      rig.armR.rotation.x = damp(rig.armR.rotation.x, -0.35, 16, dt);
      rig.armL.userData.fore.rotation.x = damp(rig.armL.userData.fore.rotation.x, 0.6, 16, dt);
      rig.armR.userData.fore.rotation.x = damp(rig.armR.userData.fore.rotation.x, 0.6, 16, dt);
      rig.torso.rotation.y = damp(rig.torso.rotation.y, 0, 12, dt);
      rig.torso.rotation.z = damp(rig.torso.rotation.z, 0, 12, dt);
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
      const phi = -Math.PI * 2 * (1 - e);         // unwinds -2π → 0 = forward flip
      const p0 = 0.9;                              // waist pivot height
      rig.body.rotation.x = 0.5 + phi;
      rig.body.position.y = p0 * (1 - Math.cos(phi)) + Math.sin(u * Math.PI) * 0.18;
      rig.body.position.z = -p0 * Math.sin(phi);
      const tuck = Math.sin(Math.min(1, u * 1.2) * Math.PI);
      rig.legL.rotation.x = lerp(rig.legL.rotation.x, 1.6, tuck);
      rig.legR.rotation.x = lerp(rig.legR.rotation.x, 1.6, tuck);
      // heels fold to the seat — a real tucked ball
      rig.legL.userData.shin.rotation.x = lerp(rig.legL.userData.shin.rotation.x, -2.1, tuck);
      rig.legR.userData.shin.rotation.x = lerp(rig.legR.userData.shin.rotation.x, -2.1, tuck);
      rig.armL.rotation.x = lerp(rig.armL.rotation.x, 0.9, tuck);
      rig.armR.rotation.x = lerp(rig.armR.rotation.x, 0.9, tuck);
      rig.armL.userData.fore.rotation.x = lerp(rig.armL.userData.fore.rotation.x, 1.5, tuck);
      rig.armR.userData.fore.rotation.x = lerp(rig.armR.userData.fore.rotation.x, 1.5, tuck);
      if (rig.headG) rig.headG.rotation.x = lerp(rig.headG.rotation.x, 0.7, tuck);
    } else if (Math.abs(rig.body.position.z) > 0.001) {
      rig.body.position.z = damp(rig.body.position.z, 0, 14, dt);
    }

    // cloth lives at speed: tunic flare + flutter, hair streams back
    const spF = clamp((sp - G.BASE_SPEED) / (G.MAX_SPEED - G.BASE_SPEED), 0, 1);
    if (rig.skirt) {
      const fl = 1 + Math.abs(Math.sin(p * 2 + 0.6)) * 0.09 + spF * 0.12;
      rig.skirt.scale.set(fl, 1 - spF * 0.05, fl * 0.92);
      // the wind presses the hem back toward the camera (+z)
      rig.skirt.rotation.x = -0.13 * spF + Math.sin(p * 2) * 0.05;
      // over-fold ripples on its own phase — the peplos reads as FOLDED
      // fabric instead of one stiff cone (skipped on low tier at build)
      const l2 = rig.skirt.userData.layer2;
      if (l2) {
        l2.rotation.x = Math.sin(p * 2 + 1.9) * 0.07 - spF * 0.05;
        const rp = 1 + Math.abs(Math.sin(p * 2 + 2.4)) * 0.05 + spF * 0.04;
        l2.scale.set(rp, 1 - spF * 0.03, rp);
      }
    }
    if (rig.mane) {
      rig.mane.rotation.x = -0.1 - 0.3 * spF + Math.sin(p * 2 + 1.2) * 0.07;
      rig.mane.rotation.z = Math.sin(p + 0.5) * 0.07;      // side-sway with the stride
    }
    // nervous glance back over the shoulder when Talos closes in
    if (rig.headG) {
      const peril = this.phase === 'playing' && this.onGround && !this.sliding && this.rollT <= 0
        && ((this._prox || 0) > 0.55 || this.quizActive);
      const side = (this.talos.position.x - this.px) >= 0 ? 1 : -1;
      rig.headG.rotation.y = damp(rig.headG.rotation.y, peril ? -side * 0.6 : 0, 5, dt);
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
      // his bronze footfalls thud the ground when he's close behind —
      // each strike stamps a shockwave ring + kicked dust under his foot
      const ts = Math.sin(tp);
      if (this.phase === 'playing' && (this._prox || 0) > 0.5 &&
          ((this._tSin <= 0 && ts > 0) || (this._tSin >= 0 && ts < 0))) {
        this.shake = Math.max(this.shake, 0.05 + this._prox * 0.16);
        this._chaserThud(this._prox);
        const fx = this.talos.position.x + (ts > 0 ? -0.3 : 0.3);
        const fz = this.talos.position.z - 0.15;   // toe side (he faces -z)
        this.rings.spawn(fx, 0.032, fz, {
          color: this._ck.stompRing, r0: 0.22, r1: 1.15 + this._prox * 0.9, life: 0.34, alpha: 0.45,
        });
        this.dust.burst(fx, 0.07, fz, { count: 3, color: this._ck.stompDust, speed: 1.8, up: 1.2, size: 0.36, life: 0.4 });
      }
      this._tSin = ts;
    }
    // Minotaur head language: horns LOWER into the lunge/grab (a bull about
    // to gore) and the snort beat tosses the head side to side
    if (tr.kind === 'minotaur') {
      const hx = this.phase === 'caught'
        ? 0.28                                     // body already looms 0.55
        : 0.1 + (this._lungeW || 0) * 0.55 + (this._prox || 0) * 0.1;
      tr.headG.rotation.x = damp(tr.headG.rotation.x, hx, 8, dt);
      if (this._mShakeT > 0) {
        this._mShakeT = Math.max(0, this._mShakeT - dt);
        tr.headG.rotation.z = Math.sin(this._mShakeT * 34) * 0.16 * (this._mShakeT / 0.55);
      } else if (tr.headG.rotation.z) tr.headG.rotation.z = damp(tr.headG.rotation.z, 0, 12, dt);
    }
    this.talos.visible = this.phase !== 'menu';

    this._shieldFx(dt);
  }

  /* winged skiff — gold hull, feather fins, hot underglow. Banks with the
     strafe and bobs on the air current while the runner surfs it. */
  _buildChariot() {
    const g = new THREE.Group();
    const gold = vmetal(PAL.chariot, { roughness: 0.3 });
    const goldDk = vmetal(PAL.drachmaDk, { roughness: 0.4 });
    const hull = new THREE.Mesh(gradTint(new THREE.BoxGeometry(1.25, 0.18, 1.55), 0.72, 1.18), gold);
    const prow = new THREE.Mesh(gradTint(new THREE.CylinderGeometry(0.09, 0.16, 0.5, 8), 0.9, 1.2), goldDk);
    prow.position.set(0, 0.22, -0.72); prow.rotation.x = 0.5;
    g.add(hull, prow);
    for (const side of [-1, 1]) {                       // swept feather fins
      for (let i = 0; i < 3; i++) {
        const f = new THREE.Mesh(gradTint(new THREE.BoxGeometry(0.52 - i * 0.13, 0.035, 0.2), 0.85, 1.15), gold);
        f.position.set(side * (0.72 + i * 0.16), 0.05 + i * 0.075, 0.15 + i * 0.14);
        f.rotation.z = side * (0.42 + i * 0.16);
        g.add(f);
      }
    }
    const under = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 2.0), glow(0xFFDF8A, 0.32));
    under.rotation.x = -Math.PI / 2; under.position.y = -0.16;
    g.add(under);
    g.userData.under = under;
    g.traverse((o) => { if (o.isMesh && o !== under) o.castShadow = true; });
    this.scene.add(g);
    return g;
  }
  _chariotFx() {
    if (this.pu.chariot > 0) {
      if (!this._chariot) this._chariot = this._buildChariot();
      const ch = this._chariot;
      ch.visible = true;
      const t = performance.now() / 1000;
      ch.position.set(
        this.player.position.x,
        this.player.position.y - 0.52 + (REDUCED_MOTION ? 0 : Math.sin(t * 3.1) * 0.05),
        0);
      ch.rotation.z = clamp(-this.laneVel * 0.03, -0.38, 0.38);   // banks into the strafe
      ch.rotation.x = REDUCED_MOTION ? 0 : Math.sin(t * 2.3) * 0.04;
      ch.userData.under.material.opacity = 0.26 + Math.sin(t * 9) * 0.1;
    } else if (this._chariot) this._chariot.visible = false;
  }
  /* aegis bubble — inner veil + additive fresnel-ish rim that breathes */
  _shieldFx() {
    if (this.pu.shield > 0) {
      if (!this._shield) {
        const g = new THREE.Group();
        const veil = new THREE.Mesh(
          new THREE.SphereGeometry(1.3, 16, 12),
          new THREE.MeshBasicMaterial({ color: PAL.aegis, transparent: true, opacity: 0.14, depthWrite: false }));
        const rim = new THREE.Mesh(
          new THREE.SphereGeometry(1.42, 16, 12),
          new THREE.MeshBasicMaterial({
            color: 0xEAD27A, transparent: true, opacity: 0.12, side: THREE.BackSide,
            blending: THREE.AdditiveBlending, depthWrite: false,
          }));
        g.add(veil, rim);
        g.userData.rim = rim;
        this.scene.add(g);
        this._shield = g;
      }
      this._shield.visible = true;
      this._shield.position.copy(this.player.position).y += 1.0;
      this._shield.rotation.y += 0.02;
      const tl = this.pu.shield;                    // urgency shimmer as it runs out
      this._shield.userData.rim.material.opacity =
        0.10 + Math.abs(Math.sin(performance.now() / 240)) * 0.07 + (tl < 2 ? (2 - tl) * 0.06 : 0);
    } else if (this._shield) this._shield.visible = false;
  }

  /* ── camera ─────────────────────────────────────────────────── */
  _camera(dt) {
    // shake decays every frame (crashes / landings / the grab kick it up)
    this.shake = Math.max(0, this.shake - dt * 2.6);
    const shaking = (this.phase === 'playing' || this.phase === 'caught') ? this.shake : 0;
    const sx = (Math.random() - 0.5) * shaking * 0.5;
    const sy = (Math.random() - 0.5) * shaking * 0.4;
    // gentle drift-lead: the camera eases a beat AHEAD of a lane change,
    // pulling the eye into the strafe the way modern runners frame it
    const lead = REDUCED_MOTION ? 0
      : clamp((G.LANE_X[this.targetLane] - this.px) * 0.11, -0.42, 0.42);
    const camX = this.px * 0.18 + lead + sx;
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
