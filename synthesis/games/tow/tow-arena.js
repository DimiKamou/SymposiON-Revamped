// ============================================================
//  TOW · Reimagined — Cinematic canvas arena  (window.TowArena)
//
//  A torch-lit night arena, drawn fully procedurally:
//   · bronze-skinned hoplites in team-coloured exomis tunics,
//     corinthian helms, greaves and back-slung emblem shields;
//     heel-dig stances that deepen with tension AND advantage,
//     the losing rank dragged upright, slipping in the sand
//   · a braided hemp rope threaded through every puller's fists,
//     wrapped round each anchor-man's waist, free ends on the
//     sand, twang vibration + gold spark burst on every pull
//   · starfield + moon, stone tiers of bobbing spectators with
//     pennants, ember-shedding braziers and column sconces
//   · sand pit with speckle grain, wind ripples, worn tug-track,
//     skid furrows, heel mounds, torch light pools, marble
//     threshold + gold centre pole, near barrier-post parallax
//   · ground-cracks under the leading team's dig-in
//   · buzz spotlight shafts + flare, pull lurch + screen-shake,
//     danger pulse, decisive victory: losers tumble forward,
//     winners rear back, gold flash, dust storm, confetti
//
//  Rope state `pos`: 0 = Team A (left) total win · 0.5 centre · 1 = Team B.
//  API: new TowArena(canvasId,{nameA,nameB})
//       .start() .stop() .reset()
//       .setRopePosition(pct 0..100)
//       .triggerPull(side,intensity)   side 'A'|'B', intensity 0..1
//       .triggerBuzz(side)             flare a team's edge
//       .triggerDanger()               red vignette + thumps
//       .triggerVictory(side, cb)
// ============================================================
(function () {
  const PAL = {
    ink: '#0E0B07', ink2: '#171009',
    gold: '#C9A44A', goldHi: '#F0C878',
    earth: '#3a2412', earthHi: '#5a4226',
    A: '#5EA8D8', Adk: '#2E6F94', Alt: '#9FD0EE',
    B: '#D9694A', Bdk: '#9A4428', Blt: '#F0A98C',
    body: '#1B120A', body2: '#241810',
    hemp: '#7A5A36', hempHi: '#C9A878', hempDk: '#3A2A18',
  };
  const TAU = Math.PI * 2;

  // prefers-reduced-motion: calm the ambient theatrics, keep state changes readable
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function easeS(t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); }
  // deterministic pseudo-random (stable per index → textures don't boil)
  function rnd(i, k) { const x = Math.sin(i * 127.1 + (k || 0) * 311.7) * 43758.5453; return x - Math.floor(x); }

  function lerpC(c1, c2, t) {
    const p = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const [r1, g1, b1] = p(c1), [r2, g2, b2] = p(c2);
    return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
  }

  // ── particles ────────────────────────────────────────────
  class Dust {
    constructor(x, y, dir, boost) {
      const b = boost || 1;
      this.x = x + (Math.random() - 0.5) * 14;
      this.y = y - Math.random() * 4;
      this.vx = dir * (0.4 + Math.random() * 2.2) * b;
      this.vy = -(0.5 + Math.random() * 2.4) * b;
      this.ay = 0.09;
      const pal = ['#6b4a30', '#4a3a28', '#8a6a48', '#7a5840', '#5a4632', '#9a7a52'];
      this.color = pal[(Math.random() * pal.length) | 0];
      this.size = 1.4 + Math.random() * 3;
      this.life = 1; this.decay = 0.018 + Math.random() * 0.022;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += this.ay; this.vx *= 0.985; this.life -= this.decay; }
    dead() { return this.life <= 0; }
  }
  class Confetti {
    constructor(x, W, side) {
      const gold = ['#f0c060', '#e8a030', '#ffd700', '#daa520', '#c9a44a'];
      const aP = ['#6ab4e8', '#4090c8', '#80c8f0', '#a0d8ff'];
      const bP = ['#e88080', '#c04040', '#f0a0a0', '#ff8080'];
      const pal = Math.random() < 0.45 ? gold : (side === 'A' ? aP : bP);
      this.x = x + (Math.random() - 0.5) * W * 0.7;
      this.y = -8 - Math.random() * 40;
      this.vx = (Math.random() - 0.5) * 2.2; this.vy = 0.9 + Math.random() * 2.8; this.ay = 0.04;
      this.color = pal[(Math.random() * pal.length) | 0];
      this.w = 4 + Math.random() * 6; this.h = 2 + Math.random() * 4;
      this.rot = Math.random() * 6.28; this.vr = (Math.random() - 0.5) * 0.2;
      this.life = 1; this.decay = 0.005 + Math.random() * 0.004;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += this.ay; this.rot += this.vr; this.life -= this.decay; }
    dead() { return this.life <= 0; }
  }
  class Mote { // ambient floating dust haze
    constructor(W, H) { this.reset(W, H, true); }
    reset(W, H, init) {
      this.x = Math.random() * W;
      this.y = init ? Math.random() * H : H + 6;
      this.vx = (Math.random() - 0.5) * 0.18;
      this.vy = -(0.08 + Math.random() * 0.22);
      this.r = 0.6 + Math.random() * 1.6;
      this.a = 0.05 + Math.random() * 0.14;
    }
  }
  class Ember { // sparks drifting up from braziers / sconces
    constructor(x, y) {
      this.x = x + (Math.random() - 0.5) * 6;
      this.y = y;
      this.vy = -(0.25 + Math.random() * 0.6);
      this.sw = Math.random() * TAU; this.sws = 0.05 + Math.random() * 0.08;
      this.r = 0.7 + Math.random() * 1.2;
      this.life = 1; this.decay = 0.008 + Math.random() * 0.010;
      this.hot = Math.random();
    }
    update(ph) { this.y += this.vy; this.x += Math.sin(ph * 2 + this.sw) * 0.3; this.sw += this.sws; this.life -= this.decay; }
    dead() { return this.life <= 0; }
  }
  class Spark { // hot metal glints thrown off the knot on a heave
    constructor(x, y, big) {
      const a = Math.random() * TAU, sp = (big ? 2.4 : 1.5) + Math.random() * (big ? 3.2 : 2.1);
      this.x = x; this.y = y;
      this.vx = Math.cos(a) * sp; this.vy = Math.sin(a) * sp * 0.7 - 1.4;
      this.ay = 0.11;
      this.life = 1; this.decay = 0.020 + Math.random() * 0.024;
      this.hot = Math.random() < 0.35;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += this.ay; this.vx *= 0.97; this.life -= this.decay; }
    dead() { return this.life <= 0; }
  }
  class Ring { // expanding shockwave halo at the knot (pulls, victory, armed ripple)
    constructor(x, y, big) {
      this.x = x; this.y = y;
      this.r = big ? 10 : 6;
      this.vr = big ? 3.4 : 2.5;
      this.lw = big ? 3.2 : 2.2;
      this.life = 1; this.decay = big ? 0.026 : 0.038;
      this.soft = false;                                  // soft = calm armed-state ripple
    }
    update(dt) { this.r += this.vr * dt; this.life -= this.decay * dt; }
    dead() { return this.life <= 0; }
  }

  class TowArena {
    constructor(canvasId, opts) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.opts = Object.assign({ nameA: 'Α', nameB: 'Β' }, opts || {});

      this.pos = 0.5; this.target = 0.5; this._snap = 0;
      this.phase = 0;
      this.shake = 0; this.shakeMag = 0;
      this.vignette = 0; this.vignetteSide = null;
      this.emit = 0; this.emitDir = 0; this.emitX = 0; this.emitSide = null;
      this.lurch = 0; this.lurchSide = null;
      this.buzzFlash = { A: 0, B: 0 };
      this.dust = []; this.confetti = []; this.motes = []; this.crowd = [];
      this.embers = []; this.stars = []; this.speck = []; this.tufts = [];
      this.sparks = []; this._prevPos = 0.5;
      this.rings = []; this.stones = [];
      this.armed = false; this._ripT = 0;  // buzz-armed state → gold ripples off the knot
      this.vEmit = 0; this.vSide = null;
      this.excite = 0;         // crowd energy 0..~1.6, decays
      this.flash = 0;          // gold full-frame flash on the winning heave
      this.winSide = null;     // set on victory → poses (winner rears back, loser tumbles)
      this.winT = 0;           // victory sequence progress 0..1
      this.twang = 0;          // rope vibration after a pull
      this._fig = null;        // last computed team poses (reused by emitters)

      this._raf = null; this._lastT = 0; this._alive = false;
      this._resize();
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this.canvas.parentElement);
    }

    // ── public ───────────────────────────────────────────
    setRopePosition(pct) { this.target = Math.max(0, Math.min(1, pct / 100)); }
    // armed = the buzz race is open → knot medallion pulses + soft gold ripples
    setArmed(on) { this.armed = !!on; if (on) this._ripT = 6; }
    triggerPull(side, intensity) {
      intensity = intensity == null ? 0.5 : intensity;
      this.shake = 16; this.shakeMag = RM ? 0 : 3 + intensity * 6;
      this.emit = 26; this.emitDir = side === 'A' ? -1 : 1;
      this.emitX = this.pos; this.emitSide = side; this._snap = 0.4;
      this.lurch = 14; this.lurchSide = side;
      this.twang = 1;
      this.excite = Math.min(1.3, 0.8 + intensity * 0.5);
      this._emitSparks(Math.round((RM ? 5 : 12) + intensity * 10), false);
      this._spawnRing(intensity > 0.62);
      if (window.TowAudio) window.TowAudio.snap(intensity);
    }
    triggerBuzz(side) { this.buzzFlash[side] = 1; this.excite = Math.max(this.excite, 0.55); }
    // shockwave ring at the current knot position
    _spawnRing(big) {
      const kx = this._knotX();
      const ky = this._ropePts ? this._ropeYNear(this._ropePts, kx) : this._ropeBaseY();
      this.rings.push(new Ring(kx, ky, big));
    }
    // spark fountain at the knot (weight of the event → count/size)
    _emitSparks(n, big) {
      const kx = this._knotX();
      const ky = this._ropePts ? this._ropeYNear(this._ropePts, kx) : this._ropeBaseY();
      for (let i = 0; i < n; i++) this.sparks.push(new Spark(kx, ky, big));
    }
    triggerDanger(side) {
      this.vignette = Math.max(this.vignette, 0.66);
      this.vignetteSide = side || null;
      this.excite = Math.max(this.excite, 1);
      if (window.TowAudio) window.TowAudio.danger();
    }
    triggerVictory(side, cb) {
      this.vSide = side; this.vEmit = 90;
      // decisive winning heave: fast snap, gold flash, dust storm, crowd eruption
      this.winSide = side; this.winT = 0;
      this.excite = 1.6;
      this.flash = 1;
      this._snap = 0.5;
      this.twang = 1;
      this.shake = 22; this.shakeMag = RM ? 0 : 7;
      this.emit = 46; this.emitDir = side === 'A' ? -1 : 1; this.emitSide = side;
      this._emitSparks(RM ? 12 : 30, true);
      this._spawnRing(true); this._spawnRing(false);
      this.armed = false;
      if (window.TowAudio) { window.TowAudio.stopHum(); window.TowAudio.victory(side); }
      if (cb) setTimeout(cb, 1500);
    }

    start() {
      if (this._alive) return;
      this._alive = true; this._lastT = performance.now();
      this._raf = requestAnimationFrame(t => this._tick(t));
      if (window.TowAudio) window.TowAudio.startHum();
    }
    stop() {
      this._alive = false;
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = null; }
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      if (window.TowAudio) window.TowAudio.stopHum();
    }
    reset() {
      this.pos = this.target = 0.5; this._snap = 0; this.phase = 0;
      this.shake = this.vignette = this.emit = this.lurch = this.vEmit = 0;
      this.excite = this.flash = this.twang = this.winT = 0; this.winSide = null;
      this.dust = []; this.confetti = []; this.embers = []; this.sparks = [];
      this.rings = []; this.armed = false;
      this._prevPos = 0.5;
    }

    // ── loop ─────────────────────────────────────────────
    _tick(now) {
      if (!this._alive) return;
      const dt = Math.min((now - this._lastT) / 16.667, 3);
      this._lastT = now;
      this._update(dt); this._draw();
      this._raf = requestAnimationFrame(t => this._tick(t));
    }

    _resize() {
      const p = this.canvas.parentElement;
      const W = p.clientWidth || 760;
      const H = Math.max(200, Math.min(440, p.clientHeight || 340));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = W * dpr; this.canvas.height = H * dpr;
      this.canvas.style.width = W + 'px'; this.canvas.style.height = H + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.W = W; this.H = H;
      this.motes = []; const n = Math.round(W / (RM ? 70 : 24));
      for (let i = 0; i < n; i++) this.motes.push(new Mote(W, H));
      this._buildStatic(W, H);
      this._buildCrowd(W, H);
    }

    // deterministic scenery: stars, sand speckles, grass tufts
    _buildStatic(W, H) {
      this.stars = [];
      const ns = Math.round(W / 22);
      for (let i = 0; i < ns; i++) {
        this.stars.push({
          x: rnd(i, 1) * W, y: rnd(i, 2) * H * 0.17 + 2,
          r: 0.4 + rnd(i, 3) * 0.9, tw: rnd(i, 4) * TAU, sp: 0.4 + rnd(i, 5) * 1.1,
        });
      }
      const gy = H * 0.78;
      this.speck = [];
      const np = Math.round(W / 6);
      for (let i = 0; i < np; i++) {
        this.speck.push({
          x: rnd(i, 6) * W, y: gy + 3 + rnd(i, 7) * (H * 0.955 - gy - 4),
          r: 0.5 + rnd(i, 8) * 1.3, lit: rnd(i, 9) < 0.42,
        });
      }
      this.tufts = [];
      const nt = Math.round(W / 40);
      for (let i = 0; i < nt; i++) {
        const x = (i + 0.5) * (W / nt) + (rnd(i, 10) - 0.5) * 20;
        if (Math.abs(x - W * 0.5) < 40) continue;      // keep the threshold clear
        this.tufts.push({ x, s: rnd(i, 11), h: 4 + rnd(i, 12) * 6 });
      }
      // scattered pebbles catching the torch light (deterministic)
      this.stones = [];
      const nst = Math.round(W / 62);
      for (let i = 0; i < nst; i++) {
        const x = rnd(i, 13) * W;
        if (Math.abs(x - W * 0.5) < 30) continue;      // threshold stays swept
        this.stones.push({
          x, y: gy + 8 + rnd(i, 14) * (H * 0.93 - gy - 10),
          r: 1.6 + rnd(i, 15) * 2.6, sq: 0.55 + rnd(i, 16) * 0.25,
        });
      }
    }

    // amphitheatre crowd: three stone tiers of spectators, some with pennants
    _buildCrowd(W, H) {
      this.crowd = [];
      const tiers = [
        { y: H * 0.272, r: 2.3, n: Math.max(12, Math.round(W / 26)), a: 0.34 },
        { y: H * 0.356, r: 3.0, n: Math.max(10, Math.round(W / 21)), a: 0.46 },
        { y: H * 0.452, r: 3.7, n: Math.max(8, Math.round(W / 17)), a: 0.60 },
      ];
      tiers.forEach((t, ti) => {
        for (let i = 0; i < t.n; i++) {
          const x = (i + 0.5 + ti * 0.33) * (W / t.n) + (Math.random() - 0.5) * 7;
          const gold = Math.random() < 0.12;
          const neut = !gold && Math.random() < 0.16;
          const col = gold ? PAL.gold : neut ? '#6a5a44' : (x < W / 2 ? PAL.Adk : PAL.Bdk);
          this.crowd.push({
            x, y: t.y + (Math.random() - 0.5) * 2.6,   // uneven seating — breaks the bead-row look
            r: t.r * (0.78 + Math.random() * 0.44),
            off: Math.random() * TAU, sp: 0.6 + Math.random() * 0.9,
            col, a: t.a * (0.8 + Math.random() * 0.4),
            arms: ((Math.random() * 3) | 0) === 0,     // some spectators throw arms up when hyped
            flag: Math.random() < 0.15 ? (x < W / 2 ? PAL.A : PAL.B) : null,
          });
        }
      });
    }

    _groundY() { return this.H * 0.78; }
    _ropeBaseY() { return this.H * 0.50; }

    _update(dt) {
      const lerpK = this._snap > 0 ? this._snap : 0.09;
      this.pos += (this.target - this.pos) * lerpK * dt;
      if (this._snap > 0) this._snap = Math.max(0, this._snap - 0.025 * dt);

      const tension = Math.abs(this.pos - 0.5) * 2;
      this.phase += (0.03 + tension * 0.09) * dt;

      if (this.shake > 0) this.shake = Math.max(0, this.shake - dt);
      if (this.lurch > 0) this.lurch = Math.max(0, this.lurch - dt);
      if (this.vignette > 0) this.vignette = Math.max(0, this.vignette - 0.014 * dt);
      if (this.excite > 0 && !this.winSide) this.excite = Math.max(0, this.excite - 0.012 * dt);
      if (this.flash > 0) this.flash = Math.max(0, this.flash - 0.045 * dt);
      if (this.twang > 0) this.twang = Math.max(0, this.twang - 0.05 * dt);
      if (this.winSide && this.winT < 1) this.winT = Math.min(1, this.winT + 0.022 * dt);
      for (const s of ['A', 'B']) if (this.buzzFlash[s] > 0) this.buzzFlash[s] = Math.max(0, this.buzzFlash[s] - 0.03 * dt);

      // pull dust burst: sand storm at the pulling team's heels + a puff at the knot
      if (this.emit > 0) {
        this.emit = Math.max(0, this.emit - dt);
        const kx = this._knotX(), gy = this._groundY();
        for (let i = 0, n = Math.ceil(dt * 2); i < n; i++) this.dust.push(new Dust(kx, gy, this.emitDir, 0.8));
        const team = this._fig && this.emitSide ? this._fig[this.emitSide] : null;
        if (team && team[0]) {
          const f0 = team[0];
          for (let i = 0, n = Math.ceil(dt * 3); i < n; i++)
            this.dust.push(new Dust(f0.heelR.x, gy, f0.dir, 1.15));
        }
      }
      // constant heel-slip scuff under real strain
      if (!RM && tension > 0.34 && this._fig && Math.random() < 0.16 * tension * dt) {
        const side = Math.random() < 0.5 ? 'A' : 'B';
        const f0 = this._fig[side] && this._fig[side][0];
        if (f0) this.dust.push(new Dust(f0.footF.x, this._groundY(), f0.dir, 0.5));
      }
      // while the rope is actually travelling, the losing rank ploughs sand
      const dpos = this.pos - this._prevPos; this._prevPos = this.pos;
      if (!RM && this._fig && Math.abs(dpos) * this.W > 0.45 && !this.winSide) {
        const loser = dpos < 0 ? 'B' : 'A';
        const f0 = this._fig[loser] && this._fig[loser][0];
        if (f0 && Math.random() < 0.85) this.dust.push(new Dust(f0.footF.x, this._groundY(), -f0.dir, 0.9));
      }
      for (let i = this.dust.length - 1; i >= 0; i--) { this.dust[i].update(); if (this.dust[i].dead()) this.dust.splice(i, 1); }
      for (let i = this.sparks.length - 1; i >= 0; i--) { this.sparks[i].update(); if (this.sparks[i].dead()) this.sparks.splice(i, 1); }
      for (let i = this.rings.length - 1; i >= 0; i--) { this.rings[i].update(dt); if (this.rings[i].dead()) this.rings.splice(i, 1); }

      // while the buzz race is open, calm gold ripples radiate off the knot
      // (skipped under reduced motion — the medallion's static glow boost carries the state)
      if (this.armed && !this.winSide && !RM) {
        this._ripT -= dt;
        if (this._ripT <= 0) {
          const kx = this._knotX();
          const ky = this._ropePts ? this._ropeYNear(this._ropePts, kx) : this._ropeBaseY();
          const r = new Ring(kx, ky, false);
          r.soft = true; r.vr = 1.35; r.decay = 0.017; r.lw = 1.8;
          this.rings.push(r);
          this._ripT = 50;
        }
      }

      if (this.vEmit > 0) {
        this.vEmit = Math.max(0, this.vEmit - dt);
        const cx = this.vSide === 'A' ? this.W * 0.25 : this.W * 0.75;
        for (let i = 0, n = Math.ceil(dt * 6); i < n; i++) this.confetti.push(new Confetti(cx, this.W, this.vSide));
      }
      for (let i = this.confetti.length - 1; i >= 0; i--) { this.confetti[i].update(); if (this.confetti[i].dead()) this.confetti.splice(i, 1); }

      for (const m of this.motes) { m.x += m.vx; m.y += m.vy; if (m.y < -6) m.reset(this.W, this.H, false); }

      // embers rising from the fire points
      if (!RM && this.embers.length < 46) {
        for (const fp of this._firePoints()) {
          if (Math.random() < 0.09 * dt) this.embers.push(new Ember(fp.x, fp.y));
        }
      }
      for (let i = this.embers.length - 1; i >= 0; i--) { this.embers[i].update(this.phase); if (this.embers[i].dead()) this.embers.splice(i, 1); }

      if (window.TowAudio) window.TowAudio.setTension(tension);
    }

    // ── geometry helpers ─────────────────────────────────
    // (framed so all three ranks of each team stay on-canvas at any rope pos)
    _leftAnchorX() { return this.W * 0.175 + (this.pos - 0.5) * this.W * 0.13; }
    _rightAnchorX() { return this.W * 0.825 + (this.pos - 0.5) * this.W * 0.13; }
    _knotX() { return this._leftAnchorX() + (this._rightAnchorX() - this._leftAnchorX()) * this.pos; }
    _firePoints() {
      const { W, H } = this;
      const psh = (0.5 - this.pos) * W * 0.018;         // podium parallax shift
      return [
        { x: W * 0.24, y: H * 0.155 },   // braziers behind the back wall
        { x: W * 0.76, y: H * 0.155 },
        { x: W * 0.055, y: H * 0.335 },  // column sconces
        { x: W * 0.945, y: H * 0.335 },
        { x: W * 0.315 + psh, y: H * 0.565 },  // podium wall torches
        { x: W * 0.685 + psh, y: H * 0.565 },
      ];
    }

    // ── team poses (computed once per frame, drives figures + rope + dust) ──
    _poseTeams(tension) {
      const { W, H } = this;
      const gy = this._groundY();
      const f = this.winSide ? easeS(this.winT) : 0;
      const advA = clamp((0.5 - this.pos) * 2, -1, 1); // >0 when A leads
      const out = { A: [], B: [] };
      for (const side of ['A', 'B']) {
        const isA = side === 'A';
        const dir = isA ? -1 : 1;                     // pull direction (away from centre)
        const adv = isA ? advA : -advA;               // this side's advantage −1..1
        const lead = Math.max(0, adv), trail = Math.max(0, -adv);
        const frontX = isA ? this._leftAnchorX() : this._rightAnchorX();
        const spacing = Math.max(26, W * 0.042);
        const isWin = this.winSide === side, isLose = this.winSide && !isWin;
        const lurchAmt = (this.lurch > 0 && this.lurchSide === side) ? Math.sin((1 - this.lurch / 14) * Math.PI) * 7 : 0;
        for (let i = 0; i < 3; i++) {
          const scale = 1 - i * 0.09;
          const h = H * 0.275 * scale;
          const heave = RM ? 0 : Math.sin(this.phase * 2.3 + i * 0.95 + (isA ? 0 : 1.7)) * (0.045 + tension * 0.055);
          const trem = RM ? 0 : Math.sin(this.phase * 29 + i * 13) * tension * 1.3;
          // lean-back deepens with tension AND advantage; the trailing side
          // is hauled upright and dragged toward the centre, feet slipping
          let th = 0.38 + tension * 0.26 + heave + lead * 0.13 - trail * 0.10;
          let gx = frontX + dir * i * spacing - dir * lurchAmt - dir * trail * h * 0.055;
          if (!RM && trail > 0.25) gx += Math.sin(this.phase * 16 + i * 2.1) * trail * 1.5; // slip jitter
          gx = isA ? Math.max(gx, h * 0.72 + 4) : Math.min(gx, W - h * 0.72 - 4);
          let gripY = gy - h * 0.40 + (RM ? 0 : Math.sin(this.phase * 2.3 + i * 0.95) * (0.6 + tension * 1.6));
          let armsUp = false;
          if (isWin) { th = Math.min(th * 1.10 + f * 0.12, 0.88); if (i === 2 && f > 0.5) armsUp = true; }
          if (isLose) {                                // tumble forward, dragged to centre
            th = lerp(th, -1.05, f);
            gx = gx - dir * f * h * 0.5;
            gripY = lerp(gripY, gy - h * 0.06, f);
          }
          const sinT = Math.sin(th) * dir, cosT = Math.max(0.22, Math.cos(th));
          const hipX = gx + dir * h * (0.30 + Math.max(0, th) * 0.13) + trem;
          const hipY = gy - h * (isLose ? lerp(0.46, 0.17, f) : 0.46 - tension * 0.025 - lead * 0.02);
          const shX = hipX + sinT * h * 0.45, shY = hipY - cosT * h * 0.45;
          const hs = Math.sin(th * 0.85) * dir, hc = Math.max(0.3, Math.cos(th * 0.85));
          const headX = shX + hs * h * 0.155, headY = shY - hc * h * 0.155;
          let hand1, hand2;
          if (armsUp) {
            hand1 = { x: shX - dir * h * 0.12, y: headY - h * 0.30 };
            hand2 = { x: shX + dir * h * 0.18, y: headY - h * 0.34 };
          } else {
            hand1 = { x: gx, y: gripY };
            hand2 = { x: gx - dir * 4 * scale, y: gripY + 2.2 * scale };
          }
          const footF = { x: gx - dir * h * 0.10, y: gy };
          const heelR = { x: hipX + dir * h * 0.36, y: gy };
          out[side].push({
            side, dir, i, scale, h, th,
            hip: { x: hipX, y: hipY }, sh: { x: shX, y: shY },
            head: { x: headX, y: headY, r: h * 0.088 },
            hand1, hand2, armsUp,
            footF, heelR,
            kneeF: { x: (hipX + footF.x) / 2 - dir * h * 0.055, y: (hipY + gy) / 2 - h * 0.02 },
            kneeR: { x: (hipX + heelR.x) / 2 + dir * h * 0.02, y: (hipY + gy) / 2 - h * (0.15 + tension * 0.045) },
            alpha: i === 0 ? 1 : (i === 1 ? 0.85 : 0.7),
            fall: isLose ? f : 0, win: isWin ? f : 0,
          });
        }
      }
      this._fig = out;
      return out;
    }

    // ── draw ─────────────────────────────────────────────
    _draw() {
      const { ctx, W, H } = this;
      const tension = Math.abs(this.pos - 0.5) * 2;
      const fig = this._poseTeams(tension);

      this._drawSky(W, H);
      this._drawWall(W, H);
      this._drawCrowd(W, H);
      this._drawPodium(W, H);
      this._drawBraziers(W, H);
      this._drawColumns(W, H);
      this._drawEmbers();
      this._drawMotes();

      let sx = 0, sy = 0;
      if (this.shake > 0) {
        const m = this.shakeMag * (this.shake / 16);
        sx = (Math.random() - 0.5) * 2 * m; sy = (Math.random() - 0.5) * m * 0.4;
      }
      if (!RM && this.vignette > 0.25) sx += Math.sin(this.phase * 40) * this.vignette * 0.8; // danger heartbeat
      ctx.save(); ctx.translate(sx, sy);

      const gy = this._groundY();
      this._drawGround(gy, W, tension, fig);
      this._drawGrass(gy, W);
      this._drawThreshold(W * 0.5, gy);

      this._drawTeam(fig.B);
      this._drawTeam(fig.A);
      this._drawRope(fig, tension, gy);
      this._drawFists(fig);
      this._drawKnot(tension);
      this._drawSpotlights(fig);
      this._drawStreaks();
      this._drawDust();
      this._drawSparks();
      this._drawRings();
      this._drawConfetti();

      ctx.restore();

      this._drawForeground(W, H);
      this._drawEdgeHeat();
      this._drawBuzzFlares();
      if (this.vignette > 0.004) this._drawVignette(W, H);
      if (this.flash > 0.01) {
        ctx.fillStyle = `rgba(240,200,120,${(this.flash * 0.30).toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }
    }

    // ── sky: night gradient, stars, moon ─────────────────
    _drawSky(W, H) {
      const ctx = this.ctx;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#080710');
      g.addColorStop(0.45, '#100C11');
      g.addColorStop(0.70, '#1B1109');
      g.addColorStop(0.85, '#241509');
      g.addColorStop(1, '#0E0A06');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      // stars (twinkle unless reduced motion)
      for (let i = 0; i < this.stars.length; i++) {
        const s = this.stars[i];
        const a = RM ? 0.5 : 0.28 + Math.abs(Math.sin(this.phase * s.sp + s.tw)) * 0.45;
        ctx.globalAlpha = a;
        ctx.fillStyle = i % 5 === 0 ? '#F0E0C0' : '#D8D8E8';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // moon with soft halo
      const mx = W * 0.60, my = H * 0.085, mr = Math.max(8, H * 0.032);
      const halo = ctx.createRadialGradient(mx, my, mr * 0.4, mx, my, mr * 4.2);
      halo.addColorStop(0, 'rgba(232,224,200,0.16)'); halo.addColorStop(1, 'rgba(232,224,200,0)');
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(mx, my, mr * 4.2, 0, TAU); ctx.fill();
      const mg = ctx.createRadialGradient(mx - mr * 0.3, my - mr * 0.3, mr * 0.2, mx, my, mr);
      mg.addColorStop(0, '#F2ECDA'); mg.addColorStop(1, '#C9C0A4');
      ctx.fillStyle = mg; ctx.beginPath(); ctx.arc(mx, my, mr, 0, TAU); ctx.fill();
      ctx.fillStyle = 'rgba(150,140,116,0.35)';
      ctx.beginPath(); ctx.arc(mx + mr * 0.28, my + mr * 0.12, mr * 0.16, 0, TAU); ctx.fill();
      ctx.beginPath(); ctx.arc(mx - mr * 0.2, my + mr * 0.34, mr * 0.11, 0, TAU); ctx.fill();

      // warm horizon glow behind the threshold
      const gy = this._groundY();
      const rg = ctx.createRadialGradient(W * 0.5, gy, 10, W * 0.5, gy, W * 0.55);
      rg.addColorStop(0, 'rgba(201,164,74,0.15)');
      rg.addColorStop(1, 'rgba(201,164,74,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    }

    // back wall of the arena bowl (pylons + gold rim)
    _drawWall(W, H) {
      const ctx = this.ctx;
      const top = H * 0.185, bot = H * 0.225;
      const g = ctx.createLinearGradient(0, top, 0, bot);
      g.addColorStop(0, '#221809'); g.addColorStop(1, '#170F07');
      ctx.fillStyle = g; ctx.fillRect(0, top, W, bot - top);
      ctx.strokeStyle = 'rgba(201,164,74,0.16)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, top); ctx.lineTo(W, top); ctx.stroke();
      ctx.fillStyle = 'rgba(0,0,0,0.28)';
      const np = 9;
      for (let i = 1; i < np; i++) ctx.fillRect((i / np) * W - 1, top + 2, 2, bot - top - 2);
    }

    // ── amphitheatre crowd: stone tiers + bobbing spectators ──
    _drawCrowd(W, H) {
      const ctx = this.ctx;
      const tiers = [
        { y0: 0.225, y1: 0.285 }, { y0: 0.285, y1: 0.37 }, { y0: 0.37, y1: 0.465 },
      ];
      for (const t of tiers) {
        const y0 = H * t.y0, y1 = H * t.y1;
        const g = ctx.createLinearGradient(0, y0, 0, y1);
        g.addColorStop(0, '#2A1E10'); g.addColorStop(1, '#1B1208');
        ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0);
        ctx.strokeStyle = 'rgba(201,164,74,0.11)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(0, y0); ctx.lineTo(W, y0); ctx.stroke();
        ctx.fillStyle = 'rgba(0,0,0,0.22)';
        ctx.fillRect(0, y1 - 2, W, 2);
        // stone block joints along the tier face
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        const bn = Math.max(8, Math.round(W / 52));
        for (let b = 0; b <= bn; b++) {
          const bxx = ((b + ((t.y0 * 37) % 1)) / bn) * W;
          ctx.fillRect(bxx, y0 + 3, 1, y1 - y0 - 6);
        }
      }
      // brazier light spills warm pools across the stands (silhouettes pop against it)
      const crFl = RM ? 0.5 : (0.6 + Math.sin(this.phase * 6.3) * 0.2 + Math.sin(this.phase * 11.1) * 0.12);
      for (const bx of [0.24, 0.76]) {
        const gx = bx * W, gy0 = H * 0.34;
        const gg = ctx.createRadialGradient(gx, gy0, 8, gx, gy0, W * 0.17);
        gg.addColorStop(0, `rgba(240,168,72,${(0.055 + crFl * 0.035).toFixed(3)})`);
        gg.addColorStop(1, 'rgba(240,168,72,0)');
        ctx.fillStyle = gg;
        ctx.fillRect(gx - W * 0.17, H * 0.215, W * 0.34, H * 0.255);
      }
      const ex = this.excite;
      const amp = RM ? 0.5 : (0.9 + ex * 4.5);
      for (const c of this.crowd) {
        const hop = Math.abs(Math.sin(this.phase * 2 * c.sp + c.off)) * amp;
        const y = c.y - hop;
        ctx.globalAlpha = c.a;
        ctx.fillStyle = c.col;
        // shoulders + head silhouette
        ctx.beginPath();
        ctx.moveTo(c.x - c.r * 1.25, y);
        ctx.quadraticCurveTo(c.x - c.r * 1.1, y - c.r * 1.5, c.x, y - c.r * 1.55);
        ctx.quadraticCurveTo(c.x + c.r * 1.1, y - c.r * 1.5, c.x + c.r * 1.25, y);
        ctx.closePath(); ctx.fill();
        ctx.beginPath(); ctx.arc(c.x, y - c.r * 2.05, c.r * 0.74, 0, TAU); ctx.fill();
        if (ex > 0.85 && c.arms) {                    // cheering arms
          ctx.strokeStyle = c.col; ctx.lineWidth = Math.max(1, c.r * 0.36); ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(c.x - c.r * 1.0, y - c.r * 0.9); ctx.lineTo(c.x - c.r * 1.9, y - c.r * 3.0);
          ctx.moveTo(c.x + c.r * 1.0, y - c.r * 0.9); ctx.lineTo(c.x + c.r * 1.9, y - c.r * 3.0);
          ctx.stroke();
        }
        if (c.flag) {                                 // little waving pennants
          const fx = c.x + c.r * 1.3, fy = y - c.r * 2.4;
          const wv = RM ? 0 : Math.sin(this.phase * (3 + ex * 3) + c.off) * c.r * 0.5;
          ctx.strokeStyle = 'rgba(120,96,48,0.8)'; ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(fx, y - c.r * 0.6); ctx.lineTo(fx, fy); ctx.stroke();
          ctx.fillStyle = c.flag; ctx.globalAlpha = c.a * 0.9;
          ctx.beginPath();
          ctx.moveTo(fx, fy);
          ctx.lineTo(fx + c.r * 1.7, fy + c.r * 0.42 + wv * 0.3);
          ctx.lineTo(fx, fy + c.r * 0.9);
          ctx.closePath(); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
    }

    // ── podium wall: torch-lit arcade between the stands and the pit ──
    // (fills the mid-band with depth: parallax arches, wall torches, meander frieze)
    _drawPodium(W, H) {
      const ctx = this.ctx;
      const gy = this._groundY();
      const y0 = H * 0.465, y1 = gy + 6;                // overdraw under the sand seam
      const shift = (0.5 - this.pos) * W * 0.018;       // drifts opposite the rope — depth
      // stone face
      const g = ctx.createLinearGradient(0, y0, 0, y1);
      g.addColorStop(0, '#2A1D0E'); g.addColorStop(0.5, '#20150A'); g.addColorStop(1, '#150D05');
      ctx.fillStyle = g; ctx.fillRect(0, y0, W, y1 - y0);
      // cornice where the stands sit on the wall
      ctx.fillStyle = 'rgba(201,164,74,0.15)'; ctx.fillRect(0, y0, W, 1.5);
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(0, y0 + 1.5, W, 2.5);

      // arched recesses marching along the wall
      const nA = Math.max(6, Math.round(W / 128));
      const aw = W / nA;
      const at = y0 + (gy - y0) * 0.42;                 // spring line
      const ab = gy - 1;
      for (let i = -1; i <= nA; i++) {
        const cx = (i + 0.5) * aw + shift;
        const hw = aw * 0.26;
        if (cx + hw < -4 || cx - hw > W + 4) continue;
        const rg = ctx.createLinearGradient(0, at - hw, 0, ab);
        rg.addColorStop(0, '#0C0803'); rg.addColorStop(1, '#040201');
        ctx.fillStyle = rg;
        ctx.beginPath();
        ctx.moveTo(cx - hw, ab);
        ctx.lineTo(cx - hw, at);
        ctx.arc(cx, at, hw, Math.PI, 0);
        ctx.lineTo(cx + hw, ab);
        ctx.closePath(); ctx.fill();
        // torch-bounce rim along the arch head
        ctx.strokeStyle = 'rgba(216,158,80,0.12)'; ctx.lineWidth = 1.4;
        ctx.beginPath(); ctx.arc(cx, at, hw + 1.2, Math.PI * 1.06, -Math.PI * 0.06); ctx.stroke();
        // keystone glint
        ctx.fillStyle = 'rgba(201,164,74,0.14)';
        ctx.fillRect(cx - 2, at - hw - 3.5, 4, 4.5);
      }
      // stone block joints between the arches
      ctx.fillStyle = 'rgba(0,0,0,0.20)';
      for (let i = 0; i <= nA; i++) {
        const jx = i * aw + shift;
        if (jx < 0 || jx > W) continue;
        ctx.fillRect(jx - 0.5, y0 + 4, 1, at - y0 - 6);
      }
      ctx.fillStyle = 'rgba(0,0,0,0.14)';
      const jr = y0 + (at - y0) * 0.55;
      ctx.fillRect(0, jr, W, 1);

      // wall torches lighting the arcade (parallax with the arches)
      const fl = RM ? 0.4 : (0.6 + Math.sin(this.phase * 7.7) * 0.25);
      for (const px of [0.315, 0.685]) {
        const tx = px * W + shift, ty = H * 0.565;
        // warm splash on the wall behind the flame
        const wg = ctx.createRadialGradient(tx, ty, 4, tx, ty, W * 0.105);
        wg.addColorStop(0, `rgba(240,170,80,${(0.11 + fl * 0.05).toFixed(3)})`);
        wg.addColorStop(1, 'rgba(240,170,80,0)');
        ctx.fillStyle = wg;
        ctx.fillRect(tx - W * 0.105, y0, W * 0.21, gy - y0);
        // iron bracket + cup
        ctx.strokeStyle = '#3a2a16'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(tx, ty + 10); ctx.lineTo(tx, ty + 4); ctx.stroke();
        ctx.fillStyle = '#241708';
        ctx.beginPath();
        ctx.moveTo(tx - 4.5, ty + 2); ctx.lineTo(tx + 4.5, ty + 2); ctx.lineTo(tx + 2.8, ty + 6); ctx.lineTo(tx - 2.8, ty + 6);
        ctx.closePath(); ctx.fill();
        this._drawFlame(tx, ty + 2, 0.85, tx);
      }

      // meander frieze band along the base of the wall
      const fy = gy - 9;
      ctx.save();
      ctx.strokeStyle = 'rgba(201,164,74,0.26)'; ctx.lineWidth = 1;
      const step = 13;
      ctx.beginPath();
      for (let x = (shift % step) - step; x < W + step; x += step) {
        ctx.moveTo(x, fy + 4.5);
        ctx.lineTo(x, fy);
        ctx.lineTo(x + step * 0.62, fy);
        ctx.lineTo(x + step * 0.62, fy + 2.6);
        ctx.lineTo(x + step * 0.3, fy + 2.6);
      }
      ctx.stroke();
      ctx.strokeStyle = 'rgba(201,164,74,0.14)';
      ctx.beginPath();
      ctx.moveTo(0, fy - 3); ctx.lineTo(W, fy - 3);
      ctx.moveTo(0, fy + 7); ctx.lineTo(W, fy + 7);
      ctx.stroke();
      ctx.restore();
    }

    // fire bowls glowing above the back wall
    _drawBraziers(W, H) {
      const ctx = this.ctx;
      for (const fx of [0.24, 0.76]) {
        const x = fx * W, y = H * 0.165;
        // thin smoke ribbon climbing into the night
        if (!RM) {
          ctx.save();
          for (let k = 0; k < 6; k++) {
            const t = (this.phase * 0.09 + k / 6) % 1;
            const sy = y - 10 - t * H * 0.105;
            const sx = x + Math.sin(this.phase * 1.6 + k * 1.9 + fx * 7) * (2.5 + t * 10);
            ctx.globalAlpha = 0.055 * (1 - t) * (t > 0.06 ? 1 : t / 0.06);
            ctx.fillStyle = '#C8B090';
            ctx.beginPath(); ctx.arc(sx, sy, 2.2 + t * 5.5, 0, TAU); ctx.fill();
          }
          ctx.restore(); ctx.globalAlpha = 1;
        }
        this._drawFlame(x, y, 1.15, x);
        ctx.fillStyle = '#241708';
        ctx.beginPath();
        ctx.moveTo(x - 9, y); ctx.lineTo(x + 9, y); ctx.lineTo(x + 6, y + 5); ctx.lineTo(x - 6, y + 5);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(201,164,74,0.35)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x - 9, y); ctx.lineTo(x + 9, y); ctx.stroke();
      }
    }

    // layered swaying flame + warm glow (shared by braziers and sconces)
    _drawFlame(x, y, s, seed) {
      const ctx = this.ctx;
      const fl = RM ? 0.4 : (0.6 + Math.sin(this.phase * 7 + seed) * 0.25 + Math.sin(this.phase * 13.7 + seed * 2) * 0.15);
      const g = ctx.createRadialGradient(x, y - 4, 2, x, y - 4, (26 + fl * 12) * s);
      g.addColorStop(0, `rgba(240,180,80,${(0.18 + fl * 0.13).toFixed(2)})`);
      g.addColorStop(1, 'rgba(240,180,80,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(x, y - 4, (26 + fl * 12) * s, 0, TAU); ctx.fill();
      const fh = (10 + fl * 7) * s, sway = RM ? 0 : Math.sin(this.phase * 5 + seed) * 2.4;
      const fg = ctx.createLinearGradient(x, y, x, y - fh);
      fg.addColorStop(0, '#e8641e'); fg.addColorStop(0.55, '#f0a030'); fg.addColorStop(1, '#f8d878');
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.moveTo(x - 4.4 * s, y);
      ctx.quadraticCurveTo(x - 4.4 * s, y - fh * 0.4, x + sway, y - fh);
      ctx.quadraticCurveTo(x + 4.4 * s, y - fh * 0.4, x + 4.4 * s, y);
      ctx.closePath(); ctx.fill();
      // hot core
      ctx.fillStyle = 'rgba(255,240,190,0.85)';
      ctx.beginPath();
      ctx.moveTo(x - 1.6 * s, y);
      ctx.quadraticCurveTo(x - 1.6 * s, y - fh * 0.3, x + sway * 0.5, y - fh * 0.55);
      ctx.quadraticCurveTo(x + 1.6 * s, y - fh * 0.3, x + 1.6 * s, y);
      ctx.closePath(); ctx.fill();
    }

    // big framing columns with team banners + sconce torches
    _drawColumns(W, H) {
      const ctx = this.ctx;
      const gy = this._groundY();
      const defs = [
        { cx: 0.030, lit: 1, team: PAL.A, teamDk: PAL.Adk, scX: 0.055 },
        { cx: 0.970, lit: -1, team: PAL.B, teamDk: PAL.Bdk, scX: 0.945 },
      ];
      for (const d of defs) {
        const x = d.cx * W, w = Math.max(26, W * 0.052), top = H * 0.045;
        // shaft, lit on the arena-facing side
        const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
        if (d.lit === 1) { g.addColorStop(0, '#150E08'); g.addColorStop(0.62, '#2E2113'); g.addColorStop(1, '#4A3620'); }
        else { g.addColorStop(0, '#4A3620'); g.addColorStop(0.38, '#2E2113'); g.addColorStop(1, '#150E08'); }
        ctx.fillStyle = g;
        ctx.fillRect(x - w / 2, top, w, gy - top);
        // flutes
        ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1;
        for (let i = -1; i <= 1; i++) {
          ctx.beginPath(); ctx.moveTo(x + i * w * 0.26, top + 8); ctx.lineTo(x + i * w * 0.26, gy - 8); ctx.stroke();
        }
        ctx.strokeStyle = 'rgba(240,200,140,0.10)';
        ctx.beginPath(); ctx.moveTo(x + d.lit * w * 0.38, top + 8); ctx.lineTo(x + d.lit * w * 0.38, gy - 8); ctx.stroke();
        // capital + base
        ctx.fillStyle = '#332411';
        ctx.fillRect(x - w * 0.72, top - 4, w * 1.44, 7);
        ctx.fillRect(x - w * 0.62, top + 3, w * 1.24, 4);
        ctx.fillRect(x - w * 0.72, gy - 6, w * 1.44, 7);
        ctx.strokeStyle = 'rgba(201,164,74,0.22)'; ctx.lineWidth = 1;
        ctx.strokeRect(x - w * 0.72, top - 4, w * 1.44, 7);
        // hanging team banner on the arena side
        const bx = x + d.lit * (w * 0.62 + 3), bw = Math.max(10, w * 0.42), byTop = H * 0.075, byBot = H * 0.30;
        const wv = RM ? 0 : Math.sin(this.phase * 1.6 + d.lit) * 3;
        const bg = ctx.createLinearGradient(0, byTop, 0, byBot);
        bg.addColorStop(0, d.team); bg.addColorStop(1, d.teamDk);
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.moveTo(bx, byTop); ctx.lineTo(bx + d.lit * bw, byTop);
        ctx.lineTo(bx + d.lit * bw + wv * 0.4, byBot - 8);
        ctx.lineTo(bx + d.lit * bw * 0.5 + wv, byBot + 4);
        ctx.lineTo(bx + wv * 0.4, byBot - 8);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.strokeStyle = 'rgba(240,200,140,0.4)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(bx, byTop); ctx.lineTo(bx + d.lit * bw, byTop); ctx.stroke();
        // gold disc emblem on the banner
        ctx.fillStyle = 'rgba(240,200,120,0.5)';
        ctx.beginPath(); ctx.arc(bx + d.lit * bw * 0.5, H * 0.13, Math.max(2.5, bw * 0.16), 0, TAU); ctx.fill();
        // sconce torch on the arena face
        const sx = d.scX * W, sy = H * 0.335;
        ctx.strokeStyle = '#3a2a16'; ctx.lineWidth = 2.5; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x + d.lit * w * 0.5, sy + 9); ctx.lineTo(sx, sy + 3); ctx.stroke();
        ctx.fillStyle = '#241708';
        ctx.beginPath();
        ctx.moveTo(sx - 5, sy + 2); ctx.lineTo(sx + 5, sy + 2); ctx.lineTo(sx + 3, sy + 6); ctx.lineTo(sx - 3, sy + 6);
        ctx.closePath(); ctx.fill();
        this._drawFlame(sx, sy + 2, 0.8, sx);
      }
    }

    _drawEmbers() {
      const ctx = this.ctx;
      for (const e of this.embers) {
        ctx.globalAlpha = Math.max(0, e.life * 0.8);
        ctx.fillStyle = e.hot > 0.5 ? '#F8C060' : '#E87030';
        ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (0.5 + e.life * 0.5), 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    _drawMotes() {
      const ctx = this.ctx;
      for (const m of this.motes) {
        ctx.globalAlpha = m.a; ctx.fillStyle = '#c9a44a';
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // ── sand pit: grain, light pools, furrows, cracks, lead tint ──
    _drawGround(gy, W, tension, fig) {
      const ctx = this.ctx;
      const H = this.H;
      const g = ctx.createLinearGradient(0, gy, 0, H);
      g.addColorStop(0, '#443019'); g.addColorStop(0.4, '#2C1D0C'); g.addColorStop(1, '#160D05');
      ctx.fillStyle = g; ctx.fillRect(0, gy, W, H - gy);

      // torch light pools (flicker with the flames; wall torches drift with parallax)
      const fl = RM ? 0.4 : (0.6 + Math.sin(this.phase * 7) * 0.25);
      const psh = (0.5 - this.pos) * W * 0.018;
      const pools = [
        { x: W * 0.055, r: W * 0.13, a: 0.055 + fl * 0.035 },
        { x: W * 0.5, r: W * 0.21, a: 0.085 },
        { x: W * 0.945, r: W * 0.13, a: 0.055 + fl * 0.035 },
        { x: W * 0.315 + psh, r: W * 0.15, a: 0.06 + fl * 0.04 },
        { x: W * 0.685 + psh, r: W * 0.15, a: 0.06 + fl * 0.04 },
      ];
      for (const p of pools) {
        const pg = ctx.createRadialGradient(p.x, gy + 6, 4, p.x, gy + 6, p.r);
        pg.addColorStop(0, `rgba(240,190,110,${p.a.toFixed(3)})`);
        pg.addColorStop(1, 'rgba(240,190,110,0)');
        ctx.fillStyle = pg;
        ctx.fillRect(p.x - p.r, gy, p.r * 2, H - gy);
      }

      // sand grain speckles
      for (const s of this.speck) {
        ctx.globalAlpha = s.lit ? 0.10 : 0.20;
        ctx.fillStyle = s.lit ? '#E8C890' : '#000000';
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, TAU); ctx.fill();
      }
      ctx.globalAlpha = 1;

      // pebbles: shadowed base + torch-lit crown, light always facing the centre
      for (const st of this.stones) {
        const litSide = st.x < W * 0.5 ? 1 : -1;
        ctx.fillStyle = 'rgba(0,0,0,0.40)';
        ctx.beginPath(); ctx.ellipse(st.x + 1, st.y + st.r * st.sq * 0.5, st.r * 1.1, st.r * st.sq * 0.6, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#3E2C17';
        ctx.beginPath(); ctx.ellipse(st.x, st.y, st.r, st.r * st.sq, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = 'rgba(226,186,124,0.30)';
        ctx.beginPath(); ctx.ellipse(st.x + litSide * st.r * 0.3, st.y - st.r * st.sq * 0.35, st.r * 0.55, st.r * st.sq * 0.4, 0, 0, TAU); ctx.fill();
      }

      // wind-rippled sand ridges (deterministic — no boil)
      ctx.strokeStyle = 'rgba(0,0,0,0.16)'; ctx.lineWidth = 1;
      for (let r = 0; r < 4; r++) {
        const ry = gy + (H - gy) * (0.24 + r * 0.185);
        ctx.beginPath();
        for (let x = 0; x <= W; x += 24) {
          const yy = ry + Math.sin(x * 0.043 + r * 2.4) * 1.7;
          if (x === 0) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      // worn tug-track: pale band scoured along the rope's path
      const tb = ctx.createLinearGradient(0, gy + 3, 0, gy + 26);
      tb.addColorStop(0, 'rgba(226,186,124,0.115)'); tb.addColorStop(1, 'rgba(226,186,124,0)');
      ctx.fillStyle = tb; ctx.fillRect(W * 0.07, gy + 3, W * 0.86, 24);

      // side tint: the leading team's colour bleeds onto the floor
      const bias = this.pos - 0.5;
      if (Math.abs(bias) > 0.02) {
        const lg = ctx.createLinearGradient(0, gy, W, gy);
        const aA = Math.max(0, -bias) * 0.5, aB = Math.max(0, bias) * 0.5;
        lg.addColorStop(0, `rgba(94,168,216,${aA.toFixed(2)})`);
        lg.addColorStop(0.5, 'rgba(0,0,0,0)');
        lg.addColorStop(1, `rgba(217,105,74,${aB.toFixed(2)})`);
        ctx.fillStyle = lg; ctx.fillRect(0, gy, W, (H - gy) * 0.5);
      }

      // pit edge highlight
      ctx.strokeStyle = 'rgba(201,164,74,0.28)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();

      // skid furrows trailing behind each team's dig
      const dragPx = Math.abs(this.pos - 0.5) * W * 0.14;
      for (const side of ['A', 'B']) {
        const f0 = fig[side][0];
        if (!f0) continue;
        const len = 12 + dragPx * 0.6 + tension * 22;
        ctx.save();
        ctx.globalAlpha = 0.30 + tension * 0.35;
        for (let k = 0; k < 3; k++) {
          const fy = gy + 4 + k * 4.5;
          const fx = (k === 1 ? f0.heelR.x : f0.footF.x) + (k - 1) * 5;
          ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 2.2;
          ctx.beginPath(); ctx.moveTo(fx, fy);
          ctx.quadraticCurveTo(fx + f0.dir * len * 0.5, fy + 1.5, fx + f0.dir * len, fy + 3);
          ctx.stroke();
          ctx.strokeStyle = 'rgba(232,200,144,0.15)'; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(fx, fy - 1.4);
          ctx.quadraticCurveTo(fx + f0.dir * len * 0.5, fy + 0.1, fx + f0.dir * len, fy + 1.6);
          ctx.stroke();
        }
        ctx.restore();
      }

      // cracks under the leading (digging) team
      if (tension > 0.3) this._drawCracks(gy, W, tension, bias);
    }

    _drawCracks(gy, W, tension, bias) {
      const ctx = this.ctx;
      const lead = bias < 0 ? 'A' : 'B';
      const lf = this._fig && this._fig[lead] && this._fig[lead][0];
      const cx = lf ? lf.heelR.x : (bias < 0 ? W * 0.20 : W * 0.80);
      ctx.save();
      ctx.globalAlpha = (tension - 0.3) * 0.7;
      ctx.strokeStyle = '#0a0603'; ctx.lineWidth = 1.4;
      const seed = (i) => Math.sin(i * 12.9898) * 43758.5453 % 1;
      for (let i = 0; i < Math.floor(tension * 6); i++) {
        const a = (i / 6) * 1.6 - 0.8;
        const len = 14 + (Math.abs(seed(i)) % 1) * (20 + tension * 26);
        ctx.beginPath();
        ctx.moveTo(cx, gy + 3);
        ctx.lineTo(cx + Math.cos(a + 1.5) * len, gy + 3 + Math.abs(Math.sin(a)) * 10 + 3);
        ctx.stroke();
      }
      ctx.restore();
    }

    // grass tufts along the pit edge
    _drawGrass(gy, W) {
      const ctx = this.ctx;
      ctx.save(); ctx.lineWidth = 1.3; ctx.lineCap = 'round';
      const cols = ['#46512b', '#5a6a31', '#3a4525'];
      for (let i = 0; i < this.tufts.length; i++) {
        const t = this.tufts[i];
        const sway = RM ? 0 : Math.sin(this.phase * 1.3 + i) * (1.1 + t.s);
        ctx.globalAlpha = 0.7;
        for (let b = -1; b <= 1; b++) {
          ctx.strokeStyle = cols[b + 1];
          ctx.beginPath();
          ctx.moveTo(t.x + b * 2, gy + 1);
          ctx.quadraticCurveTo(t.x + b * 2 + sway * 0.5, gy - t.h * 0.6, t.x + b * 3 + sway, gy - t.h - (b === 0 ? 2 : 0));
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1; ctx.restore();
    }

    // marble threshold + gold centre pole (the win line)
    _drawThreshold(cx, gy) {
      const ctx = this.ctx;
      // soft light well around the win line — the pole owns its own light
      const wellR = this.H * 0.16;
      const well = ctx.createRadialGradient(cx, gy, 3, cx, gy, wellR);
      well.addColorStop(0, 'rgba(240,200,120,0.10)'); well.addColorStop(1, 'rgba(240,200,120,0)');
      ctx.fillStyle = well;
      ctx.beginPath(); ctx.arc(cx, gy, wellR, 0, TAU); ctx.fill();
      // marble slab with meander hint
      ctx.fillStyle = 'rgba(226,216,196,0.15)';
      ctx.fillRect(cx - 30, gy + 1, 60, 7);
      ctx.strokeStyle = 'rgba(226,216,196,0.22)'; ctx.lineWidth = 1;
      ctx.strokeRect(cx - 30, gy + 1, 60, 7);
      ctx.strokeStyle = 'rgba(201,164,74,0.55)';
      for (let k = -2; k <= 2; k++) {
        const mx = cx + k * 11;
        ctx.beginPath();
        ctx.moveTo(mx - 3, gy + 6); ctx.lineTo(mx - 3, gy + 3); ctx.lineTo(mx + 3, gy + 3); ctx.lineTo(mx + 3, gy + 6);
        ctx.stroke();
      }
      // stepped plinth under the pole
      ctx.fillStyle = 'rgba(226,216,196,0.10)';
      ctx.fillRect(cx - 9, gy - 2, 18, 3.5);
      ctx.fillStyle = 'rgba(226,216,196,0.16)';
      ctx.fillRect(cx - 6, gy - 4.5, 12, 3);
      // gold pole
      const topY = gy - this.H * 0.30;
      const pg = ctx.createLinearGradient(cx - 2, 0, cx + 2, 0);
      pg.addColorStop(0, '#8a6c28'); pg.addColorStop(0.5, PAL.goldHi); pg.addColorStop(1, '#8a6c28');
      ctx.strokeStyle = pg; ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(cx, gy + 4); ctx.lineTo(cx, topY); ctx.stroke();
      // collar rings up the shaft
      ctx.strokeStyle = 'rgba(240,200,120,0.5)'; ctx.lineWidth = 1.2;
      for (const t of [0.28, 0.62]) {
        const ry = gy + (topY - gy) * t;
        ctx.beginPath(); ctx.moveTo(cx - 3.4, ry); ctx.lineTo(cx + 3.4, ry); ctx.stroke();
      }
      // finial with a breathing halo — a real light source, not a sticker
      const hb = RM ? 0.5 : 0.5 + Math.sin(this.phase * 2.1) * 0.5;
      const fg = ctx.createRadialGradient(cx, topY - 10, 1, cx, topY - 10, 15 + hb * 6);
      fg.addColorStop(0, `rgba(240,200,120,${(0.22 + hb * 0.14).toFixed(3)})`);
      fg.addColorStop(1, 'rgba(240,200,120,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.arc(cx, topY - 10, 15 + hb * 6, 0, TAU); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx - 7, topY); ctx.lineTo(cx + 7, topY); ctx.lineTo(cx, topY - 10);
      ctx.closePath(); ctx.fillStyle = PAL.gold; ctx.fill();
      ctx.beginPath(); ctx.arc(cx, topY - 12, 2.4, 0, TAU); ctx.fillStyle = PAL.goldHi; ctx.fill();
    }

    // ── hoplite ranks ────────────────────────────────────
    _drawTeam(team) {
      for (let i = team.length - 1; i >= 0; i--) this._drawFigure(team[i]);
    }

    // per-rank colour kit: bronze skin, team cloth, armour — with
    // atmospheric fade pushing the rear ranks into the night
    _figKit(side, rank) {
      const isA = side === 'A';
      const fade = rank === 0 ? 0 : rank === 1 ? 0.30 : 0.52;
      const dk = (c, extra) => lerpC(c, '#120C07', clamp(fade + (extra || 0), 0, 1));
      return {
        skin: dk('#BC8248'), skinHi: dk('#E8B478'), skinSh: dk('#764C24'),
        tunic: dk(isA ? '#3F7EA6' : '#C05E3E'),
        tunicHi: dk(isA ? '#6FB3DE' : '#E68E68'),
        tunicDk: dk(isA ? '#24506E' : '#7E3520'),
        bronze: dk('#B08036'), bronzeHi: dk('#F0C878'), bronzeDk: dk('#684818'),
        crest: isA ? PAL.A : PAL.B,
        crestDk: isA ? PAL.Adk : PAL.Bdk,
        leather: dk('#4E3018'),
      };
    }

    _drawFigure(p) {
      const ctx = this.ctx;
      const isA = p.side === 'A';
      const K = this._figKit(p.side, p.i);
      const h = p.h, dir = p.dir, sc = p.scale;
      const face = -dir;                              // pullers face the centre
      const gy = this._groundY();

      ctx.save();
      ctx.globalAlpha = p.alpha;

      // contact shadow, thrown slightly back — away from the centre light
      const shMidX = (p.footF.x + p.heelR.x) / 2 + dir * h * 0.05;
      ctx.fillStyle = 'rgba(0,0,0,0.42)';
      ctx.beginPath(); ctx.ellipse(shMidX, gy + 3, h * 0.40, h * 0.05, 0, 0, TAU); ctx.fill();

      // sand mound ploughed up by the digging rear heel
      if (p.fall < 0.3) {
        ctx.fillStyle = '#4A3319';
        ctx.beginPath();
        ctx.moveTo(p.heelR.x - dir * h * 0.16, gy + 1);
        ctx.quadraticCurveTo(p.heelR.x - dir * h * 0.05, gy - 4.5 * sc, p.heelR.x + dir * h * 0.06, gy + 1);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(232,200,144,0.12)'; ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.heelR.x - dir * h * 0.13, gy - 0.5);
        ctx.quadraticCurveTo(p.heelR.x - dir * h * 0.05, gy - 4 * sc, p.heelR.x + dir * h * 0.03, gy - 0.5);
        ctx.stroke();
      }

      // torso frame (n ⊥ torso axis; +bs·n points backwards, away from the rope)
      const vx = p.sh.x - p.hip.x, vy = p.sh.y - p.hip.y;
      const vl = Math.max(1, Math.hypot(vx, vy));
      const nx = -vy / vl, ny = vx / vl;
      const bs = (nx * dir > 0) ? 1 : -1;
      const wH = h * 0.115, wS = h * 0.155;
      const ax = (t, s) => lerp(p.hip.x, p.sh.x, t) + nx * s;
      const ay = (t, s) => lerp(p.hip.y, p.sh.y, t) + ny * s;

      // cape streaming behind the front-rank puller
      if (p.i === 0 && p.fall < 0.5) {
        const flut = RM ? 0 : Math.sin(this.phase * 3.3 + (isA ? 0 : 2)) * h * 0.05;
        ctx.fillStyle = K.crestDk; ctx.globalAlpha = p.alpha * 0.45;
        ctx.beginPath();
        ctx.moveTo(p.sh.x, p.sh.y - h * 0.04);
        ctx.quadraticCurveTo(
          p.sh.x + dir * h * 0.30, p.sh.y + h * 0.10 + flut,
          p.sh.x + dir * h * 0.46 + flut, p.sh.y + h * 0.30);
        ctx.quadraticCurveTo(
          p.sh.x + dir * h * 0.22, p.sh.y + h * 0.26,
          p.hip.x + dir * h * 0.06, p.hip.y);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = p.alpha;
      }

      // hoplite shield slung across the back — big readable silhouette
      const shr = h * 0.185;
      const shcx = ax(0.60, bs * wS * 1.12) + dir * h * 0.02;
      const shcy = ay(0.60, bs * wS * 1.12);
      const sg = ctx.createRadialGradient(shcx + face * shr * 0.3, shcy - shr * 0.4, shr * 0.15, shcx, shcy, shr * 1.12);
      sg.addColorStop(0, K.tunic); sg.addColorStop(0.7, K.tunicDk); sg.addColorStop(1, K.crestDk);
      ctx.beginPath(); ctx.ellipse(shcx, shcy, shr * 0.88, shr, p.th * 0.2 * dir, 0, TAU);
      ctx.fillStyle = sg; ctx.fill();
      ctx.lineWidth = Math.max(1.8, shr * 0.17); ctx.strokeStyle = K.bronze; ctx.stroke();
      ctx.lineWidth = 1; ctx.strokeStyle = K.bronzeHi;
      ctx.beginPath(); ctx.ellipse(shcx, shcy, shr * 0.98, shr * 1.10, p.th * 0.2 * dir, 0, TAU); ctx.stroke();
      // team letter boss
      ctx.fillStyle = K.bronzeHi;
      ctx.font = '700 ' + Math.max(8, Math.round(shr * 1.05)) + 'px Georgia, "Times New Roman", serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText(isA ? 'Α' : 'Β', shcx, shcy + 1);

      // limbs: shade outline + skin core (reads as muscle mass, not sticks)
      const lwL = Math.max(4.2, h * 0.075);
      const limb = (x0, y0, x1, y1, x2, y2, w) => {
        ctx.lineCap = 'round'; ctx.lineJoin = 'round';
        ctx.strokeStyle = K.skinSh; ctx.lineWidth = w * 1.3;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
        ctx.strokeStyle = K.skin; ctx.lineWidth = w * 0.86;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      };
      const greave = (x1, y1, x2, y2, w) => {         // bronze shin guard
        ctx.strokeStyle = K.bronze; ctx.lineWidth = w * 0.6;
        ctx.beginPath(); ctx.moveTo(lerp(x1, x2, 0.15), lerp(y1, y2, 0.15)); ctx.lineTo(lerp(x1, x2, 0.85), lerp(y1, y2, 0.85)); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,224,160,0.30)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(lerp(x1, x2, 0.2) + face, lerp(y1, y2, 0.2)); ctx.lineTo(lerp(x1, x2, 0.75) + face, lerp(y1, y2, 0.75)); ctx.stroke();
      };
      const foot = (xx, tipUp) => {                   // leather sandal wedge
        ctx.fillStyle = K.leather;
        ctx.beginPath();
        ctx.moveTo(xx + dir * h * 0.03, gy);
        ctx.lineTo(xx - dir * h * 0.11, gy - (tipUp ? h * 0.055 : 0));
        ctx.lineTo(xx - dir * h * 0.09, gy - (tipUp ? 0 : h * 0.035));
        ctx.lineTo(xx - dir * h * (tipUp ? 0.09 : 0.11), gy);
        ctx.closePath(); ctx.fill();
        ctx.strokeStyle = 'rgba(240,200,140,0.22)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(xx + dir * h * 0.02, gy - 1.2); ctx.lineTo(xx - dir * h * 0.08, gy - (tipUp ? h * 0.045 : h * 0.02)); ctx.stroke();
      };

      // rear leg + rear arm sit behind the torso
      limb(p.hip.x, p.hip.y, p.kneeR.x, p.kneeR.y, p.heelR.x, p.heelR.y - 1, lwL);
      greave(p.kneeR.x, p.kneeR.y, p.heelR.x, p.heelR.y - 1, lwL);
      foot(p.heelR.x, true);
      const armW = Math.max(3.2, h * 0.06);
      const drawArm = (shx, shy, hx, hy, sag) => {
        const exm = (shx + hx) / 2 - dir * h * 0.02, eym = (shy + hy) / 2 + sag;
        ctx.strokeStyle = K.skinSh; ctx.lineWidth = armW * 1.3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(shx, shy); ctx.quadraticCurveTo(exm, eym, hx, hy); ctx.stroke();
        ctx.strokeStyle = K.skin; ctx.lineWidth = armW * 0.86;
        ctx.beginPath(); ctx.moveTo(shx, shy); ctx.quadraticCurveTo(exm, eym, hx, hy); ctx.stroke();
      };
      if (!p.armsUp) drawArm(p.sh.x - dir * 2, p.sh.y + 1.5, p.hand2.x, p.hand2.y, h * 0.10);

      // torso: sunlit-bronze chest fading to shaded back
      const tg = ctx.createLinearGradient(ax(0.5, -bs * wS), ay(0.5, -bs * wS), ax(0.5, bs * wS), ay(0.5, bs * wS));
      tg.addColorStop(0, K.skinHi); tg.addColorStop(0.45, K.skin); tg.addColorStop(1, K.skinSh);
      ctx.fillStyle = tg;
      ctx.beginPath();
      ctx.moveTo(ax(0, wH), ay(0, wH));
      ctx.lineTo(ax(1, wS), ay(1, wS));
      ctx.lineTo(ax(1, -wS), ay(1, -wS));
      ctx.lineTo(ax(0, -wH), ay(0, -wH));
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = K.skinSh; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();

      // exomis: team cloth over one shoulder, wrapping the lower torso
      const cg = ctx.createLinearGradient(ax(0.3, -bs * wS), ay(0.3, -bs * wS), ax(0.3, bs * wS), ay(0.3, bs * wS));
      cg.addColorStop(0, K.tunicHi); cg.addColorStop(0.5, K.tunic); cg.addColorStop(1, K.tunicDk);
      ctx.fillStyle = cg;
      ctx.beginPath();
      ctx.moveTo(ax(0.58, -bs * wS * 0.72), ay(0.58, -bs * wS * 0.72));   // chest edge
      ctx.lineTo(ax(0.96, bs * wS * 0.55), ay(0.96, bs * wS * 0.55));     // over the back shoulder
      ctx.lineTo(ax(0.70, bs * wS * 1.04), ay(0.70, bs * wS * 1.04));
      ctx.lineTo(ax(0.02, bs * wH * 1.06), ay(0.02, bs * wH * 1.06));
      ctx.lineTo(ax(0.02, -bs * wH * 1.06), ay(0.02, -bs * wH * 1.06));
      ctx.closePath(); ctx.fill();
      // cloth folds
      ctx.strokeStyle = K.tunicDk; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(ax(0.52, -bs * wS * 0.4), ay(0.52, -bs * wS * 0.4)); ctx.lineTo(ax(0.06, -bs * wH * 0.3), ay(0.06, -bs * wH * 0.3)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(ax(0.60, bs * wS * 0.3), ay(0.60, bs * wS * 0.3)); ctx.lineTo(ax(0.08, bs * wH * 0.45), ay(0.08, bs * wH * 0.45)); ctx.stroke();

      // skirt swaying below the belt
      const tf = RM ? 0 : Math.sin(this.phase * 3.1 + p.i * 1.7) * h * 0.03;
      ctx.fillStyle = K.tunic;
      ctx.beginPath();
      ctx.moveTo(ax(0.02, wH * 1.05), ay(0.02, wH * 1.05));
      ctx.lineTo(ax(0.02, -wH * 1.05), ay(0.02, -wH * 1.05));
      ctx.lineTo(p.hip.x - nx * wH * 0.7 + dir * h * 0.09 + tf, p.hip.y + h * 0.165);
      ctx.lineTo(p.hip.x + nx * wH * 0.7 + dir * h * 0.14 + tf, p.hip.y + h * 0.145);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = K.tunicDk; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(p.hip.x, p.hip.y + 2); ctx.lineTo(p.hip.x + dir * h * 0.11 + tf, p.hip.y + h * 0.15); ctx.stroke();

      // belt cord
      ctx.strokeStyle = 'rgba(240,200,120,0.6)'; ctx.lineWidth = Math.max(1.4, h * 0.02);
      ctx.beginPath(); ctx.moveTo(ax(0.06, wH), ay(0.06, wH)); ctx.lineTo(ax(0.06, -wH), ay(0.06, -wH)); ctx.stroke();

      // rim lights: team colour along the back, warm torch-light on the chest
      ctx.strokeStyle = K.crest; ctx.globalAlpha = p.alpha * 0.55; ctx.lineWidth = Math.max(1.6, 2.4 * sc);
      ctx.beginPath(); ctx.moveTo(ax(0, wH * bs), ay(0, wH * bs)); ctx.lineTo(ax(1, wS * bs), ay(1, wS * bs)); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,214,150,0.38)'; ctx.lineWidth = Math.max(1, 1.6 * sc);
      ctx.beginPath(); ctx.moveTo(ax(0, -wH * bs), ay(0, -wH * bs)); ctx.lineTo(ax(1, -wS * bs), ay(1, -wS * bs)); ctx.stroke();
      ctx.globalAlpha = p.alpha;

      // front leg over the skirt
      limb(p.hip.x, p.hip.y, p.kneeF.x, p.kneeF.y, p.footF.x, p.footF.y - 1, lwL);
      greave(p.kneeF.x, p.kneeF.y, p.footF.x, p.footF.y - 1, lwL);
      foot(p.footF.x, false);

      // neck + corinthian helm
      const hr = p.head.r;
      ctx.strokeStyle = K.skin; ctx.lineWidth = Math.max(3, h * 0.05); ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(p.sh.x, p.sh.y); ctx.lineTo(p.head.x, p.head.y + hr * 0.3); ctx.stroke();
      ctx.fillStyle = K.skin;
      ctx.beginPath(); ctx.arc(p.head.x, p.head.y, hr, 0, TAU); ctx.fill();
      // beard below the cheek line (front-rank veteran)
      if (p.i === 0) {
        ctx.fillStyle = '#2A1A0E';
        ctx.beginPath();
        ctx.moveTo(p.head.x + face * hr * 0.15, p.head.y + hr * 0.55);
        ctx.quadraticCurveTo(p.head.x + face * hr * 0.9, p.head.y + hr * 0.75, p.head.x + face * hr * 0.5, p.head.y + hr * 1.25);
        ctx.quadraticCurveTo(p.head.x + face * hr * 0.1, p.head.y + hr * 1.05, p.head.x + face * hr * 0.15, p.head.y + hr * 0.55);
        ctx.fill();
      }
      // bronze helm: dome + cheek guards, lit from the arena side
      const hg = ctx.createRadialGradient(p.head.x + face * hr * 0.45, p.head.y - hr * 0.5, hr * 0.2, p.head.x, p.head.y - hr * 0.05, hr * 1.4);
      hg.addColorStop(0, K.bronzeHi); hg.addColorStop(0.55, K.bronze); hg.addColorStop(1, K.bronzeDk);
      ctx.fillStyle = hg;
      ctx.beginPath();
      ctx.moveTo(p.head.x - hr * 1.06, p.head.y + hr * 0.18);
      ctx.arc(p.head.x, p.head.y - hr * 0.08, hr * 1.06, Math.PI, 0);
      ctx.lineTo(p.head.x + hr * 1.06, p.head.y + hr * 0.18);
      ctx.lineTo(p.head.x + hr * 0.88, p.head.y + hr * 0.72);
      ctx.lineTo(p.head.x - hr * 0.88, p.head.y + hr * 0.72);
      ctx.closePath(); ctx.fill();
      // eye slit + nose guard on the facing side
      ctx.fillStyle = 'rgba(12,7,3,0.92)';
      ctx.beginPath(); ctx.ellipse(p.head.x + face * hr * 0.48, p.head.y - hr * 0.02, hr * 0.30, hr * 0.13, 0, 0, TAU); ctx.fill();
      ctx.strokeStyle = K.bronzeDk; ctx.lineWidth = Math.max(1, hr * 0.16);
      ctx.beginPath(); ctx.moveTo(p.head.x + face * hr * 0.48, p.head.y + hr * 0.1); ctx.lineTo(p.head.x + face * hr * 0.44, p.head.y + hr * 0.6); ctx.stroke();
      // crown glint
      ctx.strokeStyle = 'rgba(255,228,168,0.5)'; ctx.lineWidth = 1.3;
      ctx.beginPath();
      ctx.arc(p.head.x, p.head.y - hr * 0.08, hr * 0.9,
        face > 0 ? -Math.PI * 0.62 : -Math.PI * 0.85,
        face > 0 ? -Math.PI * 0.15 : -Math.PI * 0.38);
      ctx.stroke();
      // crest plume sweeping back
      ctx.strokeStyle = K.crest; ctx.lineWidth = Math.max(2.4, hr * 0.72); ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.head.x - dir * hr * 0.5, p.head.y - hr * 1.05);
      ctx.quadraticCurveTo(
        p.head.x + dir * hr * 0.4, p.head.y - hr * 2.2,
        p.head.x + dir * hr * 2.1, p.head.y - hr * 0.9);
      ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(p.head.x - dir * hr * 0.4, p.head.y - hr * 1.25);
      ctx.quadraticCurveTo(
        p.head.x + dir * hr * 0.4, p.head.y - hr * 2.05,
        p.head.x + dir * hr * 1.9, p.head.y - hr * 1.0);
      ctx.stroke();

      // front arm last — hauling over everything
      if (p.armsUp) {
        drawArm(p.sh.x, p.sh.y, p.hand1.x, p.hand1.y, -h * 0.02);
        drawArm(p.sh.x, p.sh.y, p.hand2.x, p.hand2.y, -h * 0.02);
      } else {
        drawArm(p.sh.x, p.sh.y, p.hand1.x, p.hand1.y, h * 0.075);
      }

      ctx.restore();
    }

    // ── braided rope threaded through every fist ─────────
    _ropeSpanPoints(fig, tension) {
      const gA = fig.A[0], gB = fig.B[0];
      const a = { x: gA.hand1.x, y: gA.hand1.y };
      const b = { x: gB.hand1.x, y: gB.hand1.y };
      // during the victory tumble the losing side's rope end drops to the sand
      if (this.winSide) {
        const f = easeS(this.winT);
        const lose = this.winSide === 'A' ? b : a;
        lose.y = lerp(lose.y, this._groundY() - 3, f);
      }
      const kx = clamp(this._knotX(), Math.min(a.x, b.x) + 8, Math.max(a.x, b.x) - 8);
      const sag = (1 - tension) * this.H * 0.055 + this.H * 0.012;
      const t0 = (kx - a.x) / Math.max(1, b.x - a.x);
      const ky = lerp(a.y, b.y, t0) + sag + (RM ? 0 : Math.sin(this.phase) * (1 + tension * 3));
      const pts = [];
      const N = 30;
      const tw = this.twang * (RM ? 0.35 : 1);
      for (let i = 0; i <= N; i++) {
        const u = i / N;
        const x = lerp(a.x, b.x, u);
        let y;
        if (x <= kx) {
          const v = (x - a.x) / Math.max(1, kx - a.x);
          y = lerp(a.y, ky, v) + Math.sin(v * Math.PI) * sag * 0.32;
        } else {
          const v = (x - kx) / Math.max(1, b.x - kx);
          y = lerp(ky, b.y, v) + Math.sin(v * Math.PI) * sag * 0.32;
        }
        if (tw > 0.01) y += Math.sin(u * 9.42 + this.phase * 26) * tw * 5 * Math.sin(u * Math.PI);
        pts.push({ x, y });
      }
      return pts;
    }

    _drawRope(fig, tension, gy) {
      const ctx = this.ctx;
      // tail behind each team: through every fist, then a slack end on the sand
      const tail = (team) => {
        const pts = [];
        const hands = team.filter(p => !p.armsUp);
        const last = hands[hands.length - 1];
        if (last) {
          const dir = last.dir;
          // free end on the sand, then a wrap round the anchor-man's waist
          pts.push({ x: last.hand1.x + dir * last.h * 0.58, y: gy + 1 });
          pts.push({ x: last.hip.x + dir * last.h * 0.10, y: last.hip.y + 2 });
        }
        for (let i = hands.length - 1; i >= 0; i--) pts.push({ x: hands[i].hand1.x, y: hands[i].hand1.y });
        return pts;
      };
      const span = this._ropeSpanPoints(fig, tension);
      const ptsA = tail(fig.A);
      const ptsB = tail(fig.B).reverse();
      const all = ptsA.concat(span, ptsB);
      if (all.length < 2) return;

      // shadow of the slack under the knot
      const kx = this._knotX();
      ctx.fillStyle = 'rgba(0,0,0,0.30)';
      ctx.beginPath(); ctx.ellipse(kx, gy + 5, 26, 3, 0, 0, TAU); ctx.fill();

      // heat: the strand glows toward the middle as tension rises
      // (cools off through the victory sequence — the fight is over)
      const heatT = this.winSide ? tension * (1 - easeS(this.winT)) : tension;
      const heat = heatT * heatT;
      const mid = lerpC(PAL.hemp, '#E85010', heat * 0.9);
      const lx = all[0].x, rx = all[all.length - 1].x;
      const grad = ctx.createLinearGradient(lx, 0, rx, 0);
      grad.addColorStop(0, '#4A3A24');
      grad.addColorStop(0.18, PAL.hemp);
      grad.addColorStop(0.42, mid);
      grad.addColorStop(0.58, mid);
      grad.addColorStop(0.82, PAL.hemp);
      grad.addColorStop(1, '#4A3A24');

      // dark outline pass → body pass → braid ticks → top highlight
      this._stroke(all, 'rgba(8,5,2,0.55)', 8.6);
      if (heatT > 0.5) { ctx.save(); ctx.shadowColor = `rgba(232,80,16,${((heatT - 0.5) * 0.8).toFixed(2)})`; ctx.shadowBlur = 5 + heatT * 12; }
      this._stroke(all, grad, 6.4);
      if (heatT > 0.5) ctx.restore();

      ctx.lineWidth = 1.2; ctx.lineCap = 'round';
      for (let i = 2; i < all.length - 2; i += 2) {
        const p0 = all[i], p1 = all[i + 1];
        const dx = p1.x - p0.x, dy = p1.y - p0.y;
        const dl = Math.max(0.001, Math.hypot(dx, dy));
        const px = -dy / dl, py = dx / dl;
        const s = (i % 4 === 0) ? 1 : -1;
        ctx.strokeStyle = s > 0 ? 'rgba(0,0,0,0.30)' : 'rgba(240,208,150,0.14)';
        ctx.beginPath();
        ctx.moveTo(p0.x - px * 2.6 - dx * 0.3, p0.y - py * 2.6 - dy * 0.3);
        ctx.lineTo(p0.x + px * 2.6 + dx * 0.3, p0.y + py * 2.6 + dy * 0.3);
        ctx.stroke();
      }
      this._stroke(all.map(p => ({ x: p.x, y: p.y - 1.7 })), 'rgba(255,214,150,0.20)', 1.5);

      // rope coil round each anchor-man's waist
      for (const side of ['A', 'B']) {
        const hands = fig[side].filter(p => !p.armsUp);
        const last = hands[hands.length - 1];
        if (!last || last.fall > 0.4) continue;
        ctx.save();
        ctx.globalAlpha = last.alpha;
        ctx.translate(last.hip.x, last.hip.y + 1);
        ctx.rotate(Math.atan2(last.sh.y - last.hip.y, last.sh.x - last.hip.x) + Math.PI / 2);
        ctx.strokeStyle = PAL.hemp; ctx.lineWidth = 3.2;
        ctx.beginPath(); ctx.ellipse(0, 0, last.h * 0.135, last.h * 0.05, 0, 0, TAU); ctx.stroke();
        ctx.strokeStyle = 'rgba(255,214,150,0.28)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.ellipse(0, -1.2, last.h * 0.135, last.h * 0.05, 0, Math.PI * 1.05, Math.PI * 1.95); ctx.stroke();
        ctx.restore();
      }

      // fray fibres near the knot under high tension
      if (heatT > 0.42) {
        const ky = this._ropeYNear(all, kx);
        ctx.save(); ctx.globalAlpha = (heatT - 0.42) * 0.6;
        ctx.strokeStyle = PAL.gold; ctx.lineWidth = 0.7;
        for (let i = 0, n = Math.floor(heatT * 8); i < n; i++) {
          const fx = kx + Math.sin(this.phase * 3 + i * 2.7) * 26;
          const fy = ky + Math.cos(this.phase * 2 + i * 1.9) * 5;
          ctx.beginPath(); ctx.moveTo(fx, fy);
          ctx.lineTo(fx + Math.sin(this.phase * 5 + i * 4.1) * 14, fy - (4 + Math.abs(Math.sin(this.phase + i)) * 9));
          ctx.stroke();
        }
        ctx.restore();
      }
      this._ropePts = all;
    }

    _ropeYNear(pts, x) {
      let best = pts[0];
      for (const p of pts) if (Math.abs(p.x - x) < Math.abs(best.x - x)) best = p;
      return best.y;
    }

    _stroke(pts, style, lw) {
      const ctx = this.ctx;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = style; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    }

    // fists gripping over the rope
    _drawFists(fig) {
      const ctx = this.ctx;
      for (const side of ['A', 'B']) {
        for (const p of fig[side]) {
          if (p.armsUp) continue;
          const K = this._figKit(p.side, p.i);
          ctx.globalAlpha = p.alpha;
          const r = Math.max(2.6, p.h * 0.052);
          for (const hd of [p.hand2, p.hand1]) {
            ctx.fillStyle = K.skinSh;
            ctx.beginPath(); ctx.arc(hd.x, hd.y + 0.6, r, 0, TAU); ctx.fill();
            ctx.fillStyle = K.skin;
            ctx.beginPath(); ctx.arc(hd.x, hd.y, r * 0.92, 0, TAU); ctx.fill();
            ctx.strokeStyle = 'rgba(255,224,168,0.4)'; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(hd.x, hd.y, r * 0.8, -Math.PI * 0.85, -Math.PI * 0.2); ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;
    }

    _drawKnot(tension) {
      const ctx = this.ctx;
      const kx = this._knotX();
      const ky = this._ropePts ? this._ropeYNear(this._ropePts, kx) : this._ropeBaseY();
      // while the buzz race is open the medallion breathes urgently
      const armPulse = this.armed ? (RM ? 0.35 : 0.5 + Math.sin(this.phase * 7.5) * 0.5) : 0;
      const glowR = 18 + tension * 9 + armPulse * 9;
      const glow = ctx.createRadialGradient(kx, ky, 0, kx, ky, glowR);
      glow.addColorStop(0, `rgba(201,164,74,${(0.6 + armPulse * 0.25).toFixed(3)})`); glow.addColorStop(1, 'rgba(201,164,74,0)');
      ctx.beginPath(); ctx.arc(kx, ky, glowR, 0, TAU); ctx.fillStyle = glow; ctx.fill();

      ctx.save(); ctx.translate(kx, ky);
      // ribboned medallion
      ctx.beginPath();
      ctx.moveTo(0, -13); ctx.lineTo(10, 0); ctx.lineTo(0, 13); ctx.lineTo(-10, 0); ctx.closePath();
      const rg = ctx.createLinearGradient(-10, -13, 10, 13);
      rg.addColorStop(0, PAL.goldHi); rg.addColorStop(0.5, '#c97444'); rg.addColorStop(1, '#9a4428');
      ctx.fillStyle = rg; ctx.fill();
      ctx.strokeStyle = PAL.goldHi; ctx.lineWidth = 1.6; ctx.stroke();
      ctx.fillStyle = 'rgba(255,240,210,0.8)';
      ctx.beginPath(); ctx.arc(-2.5, -4.5, 1.6, 0, TAU); ctx.fill();
      // the CENTRE FLAG — a crimson pennant fluttering below the knot
      const seg = 9, len = 2.9, wamp = RM ? 0.6 : 2.8;
      ctx.beginPath();
      for (let i = 0; i <= seg; i++) {
        const yy = 11 + i * len;
        const wx = Math.sin(this.phase * 3.4 + i * 0.7) * wamp * (i / seg);
        if (i === 0) ctx.moveTo(-4.5 + wx, yy); else ctx.lineTo(-4.5 + wx, yy);
      }
      for (let i = seg; i >= 0; i--) {
        const yy = 11 + i * len;
        const wx = Math.sin(this.phase * 3.4 + i * 0.7) * wamp * (i / seg);
        ctx.lineTo(4.5 + wx, yy);
      }
      ctx.closePath();
      const flagG = ctx.createLinearGradient(0, 11, 0, 11 + seg * len);
      flagG.addColorStop(0, '#d64535'); flagG.addColorStop(1, '#8e2418');
      ctx.fillStyle = flagG; ctx.fill();
      ctx.strokeStyle = 'rgba(240,200,120,0.55)'; ctx.lineWidth = 0.9; ctx.stroke();
      ctx.restore();
    }

    _drawDust() {
      const ctx = this.ctx;
      for (const p of this.dust) {
        ctx.globalAlpha = Math.max(0, p.life * 0.85);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, TAU); ctx.fillStyle = p.color; ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    // gold sparks bursting off the knot on every heave
    _drawSparks() {
      if (!this.sparks.length) return;
      const ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (const s of this.sparks) {
        const a = Math.max(0, s.life);
        ctx.strokeStyle = s.hot ? `rgba(255,244,214,${(a * 0.95).toFixed(2)})` : `rgba(255,196,96,${(a * 0.85).toFixed(2)})`;
        ctx.lineWidth = s.hot ? 2.1 : 1.5;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x - s.vx * 2.2, s.y - s.vy * 2.2);
        ctx.stroke();
      }
      ctx.restore();
    }

    // expanding shockwave halos (pull impact, victory, armed ripple)
    _drawRings() {
      if (!this.rings.length) return;
      const ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const r of this.rings) {
        const a = Math.max(0, r.life);
        ctx.strokeStyle = `rgba(240,200,120,${(a * (r.soft ? 0.30 : 0.55)).toFixed(3)})`;
        ctx.lineWidth = r.lw * (0.45 + a * 0.55);
        ctx.beginPath(); ctx.ellipse(r.x, r.y, r.r, r.r * 0.44, 0, 0, TAU); ctx.stroke();
      }
      ctx.restore();
    }

    // brief team-colour motion streaks trailing a winning heave
    _drawStreaks() {
      if (RM || this.lurch <= 0 || !this.lurchSide || !this._fig) return;
      const team = this._fig[this.lurchSide];
      if (!team || !team[0]) return;
      const ctx = this.ctx;
      const k = this.lurch / 14;
      const dir = team[0].dir;
      const col = this.lurchSide === 'A' ? '94,168,216' : '217,105,74';
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      for (let i = 0; i < 6; i++) {
        const f = team[i % team.length];
        const y = f.hip.y - f.h * (0.06 + rnd(i, 21) * 0.52);
        const x0 = f.hip.x - dir * (14 + rnd(i, 22) * 56);
        const len = (24 + rnd(i, 23) * 44) * k;
        ctx.strokeStyle = `rgba(${col},${(k * 0.30 * (0.4 + rnd(i, 24) * 0.6)).toFixed(3)})`;
        ctx.lineWidth = 1 + rnd(i, 25) * 1.5;
        ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x0 - dir * len, y); ctx.stroke();
      }
      ctx.restore();
    }

    // soft light shaft over the team that just claimed the buzz
    _drawSpotlights(fig) {
      const ctx = this.ctx;
      const gy = this._groundY();
      for (const side of ['A', 'B']) {
        const f = this.buzzFlash[side];
        if (f <= 0.02) continue;
        const team = fig[side];
        if (!team || !team[0]) continue;
        const fx = team[0].hip.x, w0 = team[0].h * 0.95;
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        const g = ctx.createLinearGradient(0, -12, 0, gy);
        g.addColorStop(0, `rgba(255,228,170,${(f * 0.30).toFixed(3)})`);
        g.addColorStop(1, `rgba(255,228,170,${(f * 0.08).toFixed(3)})`);
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.moveTo(fx - w0 * 0.22, -12);
        ctx.lineTo(fx + w0 * 0.22, -12);
        ctx.lineTo(fx + w0, gy + 4);
        ctx.lineTo(fx - w0, gy + 4);
        ctx.closePath(); ctx.fill();
        // hot core column right at the flash of the claim
        if (f > 0.72) {
          const cf = (f - 0.72) / 0.28;
          const cg = ctx.createLinearGradient(0, -12, 0, gy);
          cg.addColorStop(0, `rgba(255,244,214,${(cf * 0.30).toFixed(3)})`);
          cg.addColorStop(1, `rgba(255,244,214,${(cf * 0.06).toFixed(3)})`);
          ctx.fillStyle = cg;
          ctx.fillRect(fx - w0 * 0.16, -12, w0 * 0.32, gy + 14);
        }
        const pg = ctx.createRadialGradient(fx, gy + 2, 2, fx, gy + 2, w0);
        pg.addColorStop(0, `rgba(255,228,170,${(f * 0.42).toFixed(3)})`);
        pg.addColorStop(1, 'rgba(255,228,170,0)');
        ctx.fillStyle = pg;
        ctx.beginPath(); ctx.ellipse(fx, gy + 2, w0, w0 * 0.16, 0, 0, TAU); ctx.fill();
        ctx.restore();
      }
    }
    _drawConfetti() {
      const ctx = this.ctx;
      for (const c of this.confetti) {
        ctx.save(); ctx.globalAlpha = Math.max(0, c.life * 0.9);
        ctx.translate(c.x, c.y); ctx.rotate(c.rot);
        ctx.fillStyle = c.color; ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    // near pit wall + cinematic bottom shade
    _drawForeground(W, H) {
      const ctx = this.ctx;
      const y0 = H * 0.945;
      const g = ctx.createLinearGradient(0, y0, 0, H);
      g.addColorStop(0, 'rgba(6,3,1,0)'); g.addColorStop(0.5, 'rgba(6,3,1,0.55)'); g.addColorStop(1, 'rgba(6,3,1,0.9)');
      ctx.fillStyle = g; ctx.fillRect(0, y0 - 2, W, H - y0 + 2);
      ctx.strokeStyle = 'rgba(201,164,74,0.10)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(0, y0 + 3); ctx.lineTo(W, y0 + 3); ctx.stroke();
      // near barrier posts + sagging cord, drifting opposite the rope (parallax depth)
      const shift = (0.5 - this.pos) * W * 0.045;
      const bxs = [W * 0.16 + shift, W * 0.5 + shift, W * 0.84 + shift];
      ctx.strokeStyle = 'rgba(201,164,74,0.14)'; ctx.lineWidth = 2;
      for (let i = 0; i < bxs.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(bxs[i], y0 - 12);
        ctx.quadraticCurveTo((bxs[i] + bxs[i + 1]) / 2, y0 - 4, bxs[i + 1], y0 - 12);
        ctx.stroke();
      }
      for (const bx of bxs) {
        const pg = ctx.createLinearGradient(bx - 4, 0, bx + 4, 0);
        pg.addColorStop(0, '#060302'); pg.addColorStop(0.5, '#201409'); pg.addColorStop(1, '#060302');
        ctx.fillStyle = pg; ctx.fillRect(bx - 4, y0 - 15, 8, H - y0 + 15);
        ctx.fillStyle = 'rgba(240,200,120,0.25)';
        ctx.beginPath(); ctx.arc(bx, y0 - 16, 2.8, 0, TAU); ctx.fill();
      }
      // gentle full-frame vignette
      const v = ctx.createRadialGradient(W * 0.5, H * 0.44, Math.min(W, H) * 0.42, W * 0.5, H * 0.5, Math.hypot(W, H) * 0.62);
      v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.30)');
      ctx.fillStyle = v; ctx.fillRect(0, 0, W, H);
    }

    // pulsing team-colour heat at the edge a team is about to win
    _drawEdgeHeat() {
      const { ctx, W, H } = this;
      const zone = 0.16;
      const puls = 0.6 + (RM ? 0 : Math.sin(this.phase * 2.4) * 0.25);
      if (this.pos < zone) {
        const a = (1 - this.pos / zone) * 0.38 * puls;
        const g = ctx.createLinearGradient(0, 0, W * 0.16, 0);
        g.addColorStop(0, `rgba(94,168,216,${a.toFixed(3)})`); g.addColorStop(1, 'rgba(94,168,216,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W * 0.16, H);
      }
      if (1 - this.pos < zone) {
        const a = (1 - (1 - this.pos) / zone) * 0.38 * puls;
        const g = ctx.createLinearGradient(W, 0, W * 0.84, 0);
        g.addColorStop(0, `rgba(217,105,74,${a.toFixed(3)})`); g.addColorStop(1, 'rgba(217,105,74,0)');
        ctx.fillStyle = g; ctx.fillRect(W * 0.84, 0, W * 0.16, H);
      }
    }

    _drawBuzzFlares() {
      const ctx = this.ctx; const { W, H } = this;
      for (const side of ['A', 'B']) {
        const f = this.buzzFlash[side]; if (f <= 0.01) continue;
        const isA = side === 'A';
        const x = isA ? 0 : W;
        const col = isA ? '94,168,216' : '217,105,74';
        const g = ctx.createLinearGradient(x, 0, isA ? W * 0.4 : W * 0.6, 0);
        g.addColorStop(0, `rgba(${col},${(f * 0.5).toFixed(2)})`);
        g.addColorStop(1, `rgba(${col},0)`);
        ctx.fillStyle = g; ctx.fillRect(isA ? 0 : W * 0.6, 0, W * 0.4, H);
      }
    }

    _drawVignette(W, H) {
      const ctx = this.ctx;
      const cx = this.vignetteSide === 'A' ? W * 0.28 : this.vignetteSide === 'B' ? W * 0.72 : W * 0.5;
      const inn = Math.min(W, H) * 0.24, out = Math.hypot(W, H) * 0.62;
      const g = ctx.createRadialGradient(cx, H * 0.5, inn, cx, H * 0.5, out);
      g.addColorStop(0, 'rgba(165,10,10,0)');
      g.addColorStop(1, `rgba(165,10,10,${this.vignette.toFixed(3)})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    }
  }

  window.TowArena = TowArena;
})();
