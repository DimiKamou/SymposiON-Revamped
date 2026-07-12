// ============================================================
//  ΚΑΤΑΙΓΙΣΜΟΣ · Reimagined — cinematic canvas (window.StormArena)
//
//  A thunderstorm over a crashing Aegean sea, behind the quiz.
//  v3 "living storm" pass — presentation only. The original API is
//  unchanged; the new methods are ADDITIVE and the engine
//  feature-detects them before calling:
//   · sky: a star field the storm swallows, layered parallax clouds
//     (slow back nimbus + fast dark scud), ambient in-cloud sheet
//     lightning, flash-lit cloud undersides, pale haloed moon
//   · sea: graded swell, moonglade shimmer, horizon glint, foam
//     spray, a lone trireme riding the swell (stern lantern lit),
//     and a Doric temple silhouette on the headland
//   · fx: forked bolts with impact rings + splash debris, targeted
//     strikes (strikeTo) that land where the answer was struck,
//     a wind-blown ember layer that thickens with the streak,
//     crimson danger light as the clock runs dry, base vignette
//
//  API:
//    const a = new StormArena('storm-canvas', {});
//    a.start(); a.stop();
//    a.strike(i 0..1)  · a.strikeTo(xn, yn, i) · a.sheetBurst()
//    a.setCharge(0..1) · a.setStreak(n)        · a.setDanger(0..1)
//    a.setOverdrive(bool) · a.flashWrong() · a.setIntensity(0..1)
//    a.calm()
// ============================================================
(function () {
  const PAL = {
    skyTop: [10, 9, 12], skyHorizon: [44, 35, 22],
    gold: [201, 164, 74], goldHi: [240, 200, 120],
    aegean: [94, 168, 216], rain: [150, 180, 210],
    crimson: [200, 70, 55], column: [10, 8, 5],
    seaDeep: [7, 18, 26], seaMid: [15, 44, 58], seaHi: [70, 130, 158],
    foam: [224, 240, 246], star: [208, 218, 238], moon: [226, 218, 196],
    emberHot: [255, 214, 150], emberMid: [242, 152, 70], emberCool: [186, 88, 38],
  };
  const rgb = (c, a) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
  const rand = (a, b) => a + Math.random() * (b - a);
  const clamp01 = v => Math.max(0, Math.min(1, v));
  const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

  class StormArena {
    constructor(canvasId, opts) {
      this.cv = document.getElementById(canvasId);
      this.ctx = this.cv.getContext('2d');
      this.opts = opts || {};
      this.W = 0; this.H = 0; this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.t = 0; this.raf = null; this.last = 0;

      this.charge = 0; this.intensity = 0.45; this.overdrive = false;
      this.streak = 0; this.danger = 0; this._danger = 0;
      this.flash = 0; this.flashColor = PAL.goldHi; this.flashX = 0.5; this.wrongFlash = 0;
      this.shake = 0;
      // respect prefers-reduced-motion: thinner rain, no screen shake, fewer sparks
      this.rm = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

      this.bolts = []; this.clouds = []; this.clouds2 = []; this.rain = [];
      this.columns = []; this.foam = []; this.sparks = [];
      this.stars = []; this.embers = []; this.impacts = []; this.zaps = []; this.sheets = [];
      this.nebula = []; this.pulses = []; this.crackles = [];
      this._heat = 0;                        // eased streak-heat (visual only)
      this._beacon = { ph: rand(0, 6.28) };  // fire-beacon flicker phase
      this._odTimer = 0; this._sheetTimer = rand(1.2, 3);
      this.breakT = rand(0, 1); this.breakX = 0.5; this.breakPeriod = rand(4.5, 7);
      this.ship = { x: rand(0.28, 0.55), dir: Math.random() < 0.5 ? -1 : 1, spd: rand(0.0035, 0.007) };
      this._onResize = () => this._resize();
    }

    start() {
      this._resize();
      window.addEventListener('resize', this._onResize);
      this._seedClouds(); this._seedRain();
      this.last = performance.now();
      const loop = (now) => {
        const dt = Math.min(0.05, (now - this.last) / 1000); this.last = now;
        this._update(dt); this._draw();
        this.raf = requestAnimationFrame(loop);
      };
      this.raf = requestAnimationFrame(loop);
    }
    stop() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.raf = null;
      window.removeEventListener('resize', this._onResize);
    }

    _resize() {
      const r = this.cv.getBoundingClientRect();
      this.W = Math.max(320, r.width);
      this.H = Math.max(170, r.height || 220);
      this.cv.width = this.W * this.dpr; this.cv.height = this.H * this.dpr;
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.seaTop = this.H * 0.60;
      this._seedColumns(); this._seedStars(); this._seedNebula();
      if (this.rain.length) this._seedRain();
    }

    // ── seeds ──────────────────────────────────────────────
    _seedClouds() {
      this.clouds = []; this.clouds2 = [];
      // 8 back nimbus (wider spread) — fewer flat-black voids in the upper sky
      for (let i = 0; i < 8; i++) this.clouds.push({
        x: rand(-0.1, 1.1), y: rand(0.02, 0.36), r: rand(0.2, 0.44),
        spd: rand(0.004, 0.014) * (Math.random() < 0.5 ? -1 : 1), a: rand(0.5, 1),
      });
      // fast dark scud in front — parallax depth
      for (let i = 0; i < 4; i++) this.clouds2.push({
        x: rand(-0.15, 1.15), y: rand(0.04, 0.26), r: rand(0.12, 0.26),
        spd: rand(0.02, 0.04) * (Math.random() < 0.5 ? -1 : 1), a: rand(0.5, 0.9),
      });
    }
    _seedRain() {
      this.rain = [];
      const n = Math.floor((this.W * this.H) / (this.rm ? 16000 : 4600));
      for (let i = 0; i < n; i++) this.rain.push({
        x: Math.random() * this.W, y: Math.random() * this.H,
        len: rand(9, 22), spd: rand(620, 1050), z: rand(0.35, 1),
      });
    }
    _seedStars() {
      this.stars = [];
      const n = Math.floor((this.W * (this.seaTop || this.H * 0.6)) / (this.rm ? 22000 : 11000));
      for (let i = 0; i < n; i++) this.stars.push({
        x: Math.random() * this.W, y: Math.random() * (this.seaTop || this.H * 0.6) * 0.86,
        r: rand(0.6, 1.7), a: rand(0.3, 0.85), ph: rand(0, 6.28), spd: rand(0.6, 2.2),
      });
    }
    _seedNebula() {
      // huge, slow-drifting luminance blobs — the upper sky never reads as a flat void
      this.nebula = [];
      for (let i = 0; i < 5; i++) this.nebula.push({
        x: rand(-0.05, 1.05), y: rand(0.04, 0.42), r: rand(0.24, 0.5),
        spd: rand(0.002, 0.007) * (Math.random() < 0.5 ? -1 : 1),
        ph: rand(0, 6.28), warm: Math.random(),
      });
    }
    _seedColumns() {
      // Doric temple silhouette on the headland behind the sea
      this.columns = [];
      const baseY = (this.seaTop || this.H * 0.6) + 2;
      const colW = Math.max(6, this.W / 64);
      const gap = colW * 1.72;
      const cx = this.W * 0.64;
      const count = 6;
      let x = cx;
      const h = Math.max(16, this.H * 0.078);
      for (let i = 0; i < count; i++) { this.columns.push({ x, w: colW, h, y: baseY }); x += gap; }
      this.templeX = cx; this.templeW = gap * (count - 1) + colW; this.templeH = h;
      this.headlandX = cx - gap * 1.6;
      this.headlandW = this.templeW + gap * 3.2;
    }

    // ── triggers ───────────────────────────────────────────
    setCharge(c) { this.charge = clamp01(c); }
    setIntensity(v) { this.intensity = clamp01(v); }
    setStreak(n) { this.streak = Math.max(0, n | 0); }
    setDanger(d) { this.danger = clamp01(d); }
    setOverdrive(on) { this.overdrive = !!on; this._odTimer = 0; if (on) this.flash = 1; }
    flashWrong() { this.wrongFlash = 1; this.shake = Math.max(this.shake, 5); }
    calm() { this.overdrive = false; this.intensity = 0.12; this.charge = 0; this.streak = 0; this.danger = 0; this._danger = 0; }

    strike(intensity) {
      intensity = Math.max(0.2, Math.min(1, intensity || 0.6));
      const sx = rand(this.W * 0.16, this.W * 0.84);
      const sy = rand(this.H * 0.03, this.H * 0.14);
      const ex = sx + rand(-this.W * 0.05, this.W * 0.05);
      const ey = (this.seaTop || this.H * 0.6) * rand(0.94, 1.04);
      this._launchBolt(sx, sy, ex, ey, intensity);
    }
    // targeted bolt — lands on a normalized canvas point (e.g. the struck answer)
    strikeTo(xn, yn, intensity) {
      intensity = Math.max(0.2, Math.min(1, intensity || 0.6));
      const ex = clamp01(xn) * this.W, ey = clamp01(yn) * this.H;
      const sx = clamp01(xn + rand(-0.1, 0.1)) * this.W;
      const sy = rand(this.H * 0.02, this.H * 0.1);
      this._launchBolt(sx, sy, ex, ey, intensity);
    }
    _launchBolt(sx, sy, ex, ey, intensity) {
      this.bolts.push(this._makeBolt(sx, sy, ex, ey, intensity));
      this.flash = Math.max(this.flash, 0.55 + intensity * 0.45);
      this.flashColor = intensity > 0.7 ? PAL.goldHi : PAL.gold;
      this.flashX = sx / this.W;
      this.shake = Math.max(this.shake, intensity * 4);
      this._impact(ex, ey, intensity);
      if (this.bolts.length > 6) this.bolts.shift();
    }
    // a short burst of in-cloud sheet lightning (streak milestones)
    sheetBurst() {
      const pool = this.clouds.length ? this.clouds : [{ x: 0.5, y: 0.15, r: 0.3, a: 1 }];
      const n = 2 + (Math.random() * 2 | 0);
      for (let i = 0; i < n; i++) {
        const c = pool[(Math.random() * pool.length) | 0];
        this.sheets.push({ c, life: 1, max: rand(0.28, 0.5), a: rand(0.6, 1) });
      }
      this.flash = Math.max(this.flash, 0.35);
    }
    // streak-milestone celebration — thunderhead applause + a ring of light
    // rolling out along the horizon (ADDITIVE api; engine feature-detects it)
    milestone(tier) {
      const t = Math.max(2, Math.min(4, tier | 0));
      const pool = this.clouds.length ? this.clouds : [{ x: 0.5, y: 0.15, r: 0.3, a: 1 }];
      for (let i = 0; i < 1 + t; i++) {
        const c = pool[(Math.random() * pool.length) | 0];
        this.sheets.push({ c, life: 1, max: rand(0.3, 0.55), a: rand(0.7, 1) });
      }
      this.pulses.push({ life: 1, max: 0.8 + t * 0.12, t });
      this.flash = Math.max(this.flash, 0.3 + t * 0.07);
      if (this.pulses.length > 4) this.pulses.shift();
    }

    _makeBolt(sx, sy, ex, ey, intensity) {
      const segs = Math.floor(rand(9, 14));
      const pts = [{ x: sx, y: sy }];
      for (let i = 1; i <= segs; i++) {
        const f = i / segs;
        const jag = (1 - f * 0.5) * this.W * 0.045;
        const bx = sx + (ex - sx) * f + (i === segs ? 0 : rand(-1, 1) * jag);
        const by = sy + (ey - sy) * f + (i === segs ? 0 : rand(-6, 6));
        pts.push({ x: Math.max(4, Math.min(this.W - 4, bx)), y: by });
      }
      const branches = [];
      const nb = Math.floor(rand(1, 3 + intensity * 2));
      for (let b = 0; b < nb; b++) {
        const start = Math.floor(rand(2, segs - 2));
        const bp = [{ ...pts[start] }]; let bx = pts[start].x, by = pts[start].y;
        const bsegs = Math.floor(rand(3, 6)); const dir = Math.random() < 0.5 ? -1 : 1;
        for (let i = 0; i < bsegs; i++) { bx += dir * rand(6, this.W * 0.05) + rand(-6, 6); by += rand(this.H * 0.03, this.H * 0.07); bp.push({ x: bx, y: by }); }
        branches.push(bp);
      }
      return { pts, branches, life: 1, max: rand(0.22, 0.34), intensity, flick: 1, x: sx, ex, ey };
    }

    // impact ring + hot splash debris where a bolt lands
    _impact(x, y, inten) {
      this.impacts.push({ x, y, life: 1, max: rand(0.4, 0.55), r: 9 + inten * 18 });
      const n = this.rm ? 4 : Math.floor(6 + inten * 9);
      for (let i = 0; i < n; i++) this.zaps.push({
        x, y, vx: rand(-1, 1) * 170 * inten, vy: -rand(40, 230) * inten,
        r: rand(0.8, 2), life: 1, max: rand(0.3, 0.6),
      });
      // electric surface crackle — short arcs skittering sideways from the hit
      const nc = this.rm ? 1 : 2 + (inten * 3 | 0);
      for (let c = 0; c < nc; c++) {
        const dir = Math.random() < 0.5 ? -1 : 1;
        const pts = [{ x, y }];
        let cx = x, cy = y;
        const segs = 3 + (Math.random() * 3 | 0);
        for (let s = 0; s < segs; s++) {
          cx += dir * rand(7, 17) * (0.7 + inten * 0.6);
          cy += rand(-6, 6);
          pts.push({ x: cx, y: cy });
        }
        this.crackles.push({ pts, life: 1, max: rand(0.16, 0.3) });
      }
      if (this.crackles.length > 24) this.crackles.splice(0, this.crackles.length - 24);
      if (this.zaps.length > 90) this.zaps.splice(0, this.zaps.length - 90);
      if (this.impacts.length > 8) this.impacts.shift();
    }

    _spawnFoam(x, y, n, power) {
      for (let i = 0; i < n; i++) this.foam.push({
        x, y, vx: rand(-1, 1) * 80 * power, vy: -rand(40, 150) * power,
        r: rand(1, 3.2), life: 1, max: rand(0.5, 1.1),
      });
      if (this.foam.length > 160) this.foam.splice(0, this.foam.length - 160);
    }

    // ── update ─────────────────────────────────────────────
    _update(dt) {
      this.t += dt;
      this._danger += (this.danger - this._danger) * Math.min(1, dt * 3);   // eased danger light
      this._heat += (Math.min(1, this.streak / 9) - this._heat) * Math.min(1, dt * 2.4); // eased streak heat
      const wind = (0.5 + this.intensity) * (this.overdrive ? 1.7 : 1);
      this.clouds.forEach(c => { c.x += c.spd * dt * wind; if (c.x > 1.25) c.x = -0.25; if (c.x < -0.25) c.x = 1.25; });
      this.clouds2.forEach(c => { c.x += c.spd * dt * wind; if (c.x > 1.3) c.x = -0.3; if (c.x < -0.3) c.x = 1.3; });
      this.nebula.forEach(nb => { nb.x += nb.spd * dt * wind; if (nb.x > 1.3) nb.x = -0.3; if (nb.x < -0.3) nb.x = 1.3; });

      const slant = (0.18 + this.intensity * 0.28) * (this.overdrive ? 1.5 : 1);
      const dens = this.overdrive ? 1 : 0.35 + this.intensity * 0.65;
      this.rain.forEach(p => {
        p.y += p.spd * p.z * dt * (this.overdrive ? 1.35 : 1);
        p.x += p.spd * p.z * slant * dt;
        if (p.y > this.H || p.x > this.W) { p.y = rand(-30, 0); p.x = rand(-this.W * 0.2, this.W); }
        p._draw = Math.random() < dens;
      });

      this.bolts.forEach(b => { b.life -= dt / b.max; b.flick = 0.5 + Math.random() * 0.5; });
      this.bolts = this.bolts.filter(b => b.life > 0);

      this.impacts.forEach(im => { im.life -= dt / im.max; });
      this.impacts = this.impacts.filter(im => im.life > 0);
      this.zaps.forEach(z => { z.life -= dt / z.max; z.vy += 520 * dt; z.x += z.vx * dt; z.y += z.vy * dt; });
      this.zaps = this.zaps.filter(z => z.life > 0);

      this.flash = Math.max(0, this.flash - dt * 3.2);
      this.wrongFlash = Math.max(0, this.wrongFlash - dt * 2.2);
      this.shake = Math.max(0, this.shake - dt * 18);

      // ambient sheet lightning breathes with the intensity
      this._sheetTimer -= dt * (0.35 + this.intensity * 1.4) * (this.rm ? 0.5 : 1);
      if (this._sheetTimer <= 0 && this.intensity > 0.22 && this.clouds.length) {
        const c = this.clouds[(Math.random() * this.clouds.length) | 0];
        this.sheets.push({ c, life: 1, max: rand(0.3, 0.6), a: rand(0.4, 0.9) });
        this._sheetTimer = rand(1.4, 4.4 - this.intensity * 2.4);
      }
      this.sheets.forEach(s => { s.life -= dt / s.max; });
      this.sheets = this.sheets.filter(s => s.life > 0);
      this.pulses.forEach(p => { p.life -= dt / p.max; });
      this.pulses = this.pulses.filter(p => p.life > 0);
      this.crackles.forEach(cr => { cr.life -= dt / cr.max; });
      this.crackles = this.crackles.filter(cr => cr.life > 0);

      // breaking-wave cycle
      const wspeed = 1 + this.intensity * 0.8 + (this.overdrive ? 0.6 : 0);
      this.breakT += dt / this.breakPeriod * wspeed;
      if (this.breakT >= 1) {
        this.breakT -= 1; this.breakX = rand(0.3, 0.7); this.breakPeriod = rand(4, 6.5);
      }
      // spray near the peak of the break
      const env = this._breakEnv();
      if (env > 0.82 && Math.random() < 0.6) {
        const bx = this.breakX * this.W;
        const by = this.seaTop + this.H * 0.06 - env * this.H * 0.12;
        this._spawnFoam(bx + rand(-40, 40), by, 2, 0.6 + this.intensity * 0.7);
      }
      // foam physics — spray that climbs above the waterline dies fast so it
      // never drifts up into the question band as stray white specks
      this.foam.forEach(f => {
        f.life -= dt / f.max; f.vy += 240 * dt; f.x += f.vx * dt; f.y += f.vy * dt;
        if (f.y < this.seaTop - 4) f.life -= dt * 5;
      });
      this.foam = this.foam.filter(f => f.life > 0 && f.y < this.H + 8);

      // the trireme drifts along the mid swell
      const sh = this.ship;
      sh.x += sh.dir * sh.spd * dt * (0.6 + this.intensity * 0.8);
      if (sh.x > 0.86) { sh.x = 0.86; sh.dir = -1; }
      if (sh.x < 0.14) { sh.x = 0.14; sh.dir = 1; }

      // wind-blown embers — the storm's heat rises with the streak
      const streakN = Math.min(10, this.streak);
      let rate = 0.05 + streakN * 0.06 + this.charge * 0.4 + (this.overdrive ? 0.8 : 0) + this.intensity * 0.06;
      if (this.rm) rate *= 0.3;
      let spawn = rate > 1 && Math.random() < rate - 1 ? 2 : (Math.random() < rate ? 1 : 0);
      while (spawn-- > 0) {
        this.embers.push({
          x: rand(-0.04, 1.04) * this.W, y: this.H + 6,
          vx: -rand(6, 30) * (0.5 + this.intensity), vy: -rand(34, 96) * (1 + streakN * 0.05),
          r: rand(0.8, 2.3), life: 1, max: rand(1.2, 2.6), ph: rand(0, 6.28), hot: Math.random(),
        });
      }
      this.embers.forEach(e => {
        e.life -= dt / e.max;
        e.x += (e.vx + Math.sin(this.t * 2.2 + e.ph) * 18) * dt;
        e.y += e.vy * dt;
      });
      this.embers = this.embers.filter(e => e.life > 0 && e.y > -8);
      if (this.embers.length > 130) this.embers.splice(0, this.embers.length - 130);

      // gold charge motes drift upward as the overdrive charge builds
      const sparkRate = this.charge * (this.rm ? 0.15 : 0.5) + (this.overdrive ? 0.3 : 0);
      if (sparkRate > 0.02 && Math.random() < sparkRate) {
        this.sparks.push({
          x: rand(0, this.W), y: this.H * rand(0.55, 0.98),
          vy: -rand(16, 46) * (0.6 + this.charge), r: rand(0.8, 2.1),
          life: 1, max: rand(0.9, 1.8), ph: rand(0, 6.28),
        });
      }
      this.sparks.forEach(s => { s.life -= dt / s.max; s.y += s.vy * dt; s.x += Math.sin(this.t * 2.4 + s.ph) * 14 * dt; });
      this.sparks = this.sparks.filter(s => s.life > 0 && s.y > -6);
      if (this.sparks.length > 80) this.sparks.splice(0, this.sparks.length - 80);

      if (this.overdrive) { this._odTimer -= dt; if (this._odTimer <= 0) { this.strike(rand(0.5, 0.9)); this._odTimer = rand(0.28, 0.7); } }
    }

    // breaking-wave height envelope (0..1, peaks mid-cycle)
    _breakEnv() { return Math.max(0, Math.sin(this.breakT * Math.PI)); }

    // ── draw ───────────────────────────────────────────────
    _draw() {
      const ctx = this.ctx, W = this.W, H = this.H, seaTop = this.seaTop;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (this.shake > 0.3 && !this.rm) ctx.translate(rand(-1, 1) * this.shake, rand(-1, 1) * this.shake);

      // ── SKY ──
      const dark = this.charge * 0.5 + (this.overdrive ? 0.3 : 0);
      const top = PAL.skyTop;
      let hor = mix(PAL.skyHorizon, [30 * (1 + this.charge), PAL.skyHorizon[1] * (1 - dark), PAL.skyHorizon[2] * (1 - dark)], dark);
      if (this.overdrive) hor = mix(hor, [88, 58, 20], 0.55);     // molten-amber horizon in overdrive (top stays storm-dark)
      hor = mix(hor, [64, 18, 16], this._danger * 0.55);          // crimson horizon when time runs dry
      const g = ctx.createLinearGradient(0, 0, 0, seaTop);
      g.addColorStop(0, rgb(top, 1));
      g.addColorStop(0.55, rgb(mix(top, hor, 0.28), 1));
      g.addColorStop(1, rgb(hor, 1));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, seaTop + 2);

      // stars — the storm swallows them as it builds
      const hf = Math.max(0.1, 1 - this.intensity * 0.62 - this.charge * 0.3 - this.flash * 0.8);
      if (hf > 0.12) {
        for (let i = 0; i < this.stars.length; i++) {
          const s = this.stars[i];
          const tw = this.rm ? 0.75 : 0.55 + 0.45 * Math.sin(this.t * s.spd + s.ph);
          ctx.fillStyle = rgb(PAL.star, s.a * tw * hf);
          ctx.fillRect(s.x, s.y, s.r, s.r);
        }
      }

      // storm ceiling + drifting nebula luminance — soft grey-blue turbulence
      // (warming with the streak) so the upper sky never sits as a flat void
      const ceil = ctx.createLinearGradient(0, 0, 0, seaTop * 0.5);
      ceil.addColorStop(0, rgb(mix([30, 32, 44], [70, 46, 26], this._heat), 0.16 + this.charge * 0.05));
      ceil.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = ceil; ctx.fillRect(0, 0, W, seaTop * 0.5);
      for (let i = 0; i < this.nebula.length; i++) {
        const nb = this.nebula[i];
        const x = nb.x * W, y = nb.y * H, r = nb.r * W;
        const br = this.rm ? 0.85 : 0.72 + 0.28 * Math.sin(this.t * 0.14 + nb.ph);
        const base = nb.warm > 0.55 ? [56, 46, 36] : [40, 44, 56];
        const col = mix(base, [96, 62, 30], this._heat * 0.6);
        const a = (0.075 + this.charge * 0.03) * br;
        const ng = ctx.createRadialGradient(x, y, 0, x, y, r);
        ng.addColorStop(0, rgb(col, a)); ng.addColorStop(0.65, rgb(col, a * 0.4)); ng.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ng; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.55, 0, 0, 6.283); ctx.fill();
      }

      // horizon charge glow — radius pushed past the frame so its circular
      // edge never reads as a hard "dome" arc in the mid sky
      if (this.charge > 0.02 || this.overdrive) {
        const cg = ctx.createRadialGradient(W / 2, seaTop, 0, W / 2, seaTop, W * 1.05);
        const col = this.overdrive ? PAL.goldHi : PAL.gold;
        cg.addColorStop(0, rgb(col, 0.08 + this.charge * 0.16 + (this.overdrive ? 0.12 : 0)));
        cg.addColorStop(0.55, rgb(col, (0.08 + this.charge * 0.16) * 0.35));
        cg.addColorStop(1, rgb(col, 0));
        ctx.fillStyle = cg; ctx.fillRect(0, seaTop - H * 0.3, W, H * 0.3);
      }

      // pale storm moon — small, shaded, and progressively swallowed by the
      // storm (the flat grey "sticker" look came from a huge low-contrast disc)
      const mx = W * 0.79, my = H * 0.15, mr = Math.max(12, W * 0.02);
      const veil = Math.max(0.3, 1 - this.intensity * 0.42 - this._danger * 0.3 - (this.overdrive ? 0.18 : 0));
      const ml = (0.16 + this.flash * 0.08) * veil;
      const mGlow = ctx.createRadialGradient(mx, my, 0, mx, my, mr * 3.4);
      mGlow.addColorStop(0, rgb(PAL.moon, ml));
      mGlow.addColorStop(0.35, rgb(PAL.moon, ml * 0.4));
      mGlow.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = mGlow; ctx.beginPath(); ctx.arc(mx, my, mr * 3.4, 0, 6.283); ctx.fill();
      const mBody = ctx.createRadialGradient(mx - mr * 0.42, my - mr * 0.42, mr * 0.12, mx, my, mr * 1.02);
      mBody.addColorStop(0, rgb([246, 240, 222], (0.95 + this.flash * 0.05) * veil));
      mBody.addColorStop(0.55, rgb(PAL.moon, 0.72 * veil));
      mBody.addColorStop(0.86, rgb([172, 162, 142], 0.34 * veil));
      mBody.addColorStop(1, rgb([118, 112, 100], 0.16 * veil));
      ctx.fillStyle = mBody; ctx.beginPath(); ctx.arc(mx, my, mr, 0, 6.283); ctx.fill();
      // waning terminator — a dark offset disc carves the lit crescent
      ctx.fillStyle = rgb([12, 11, 14], 0.30 * veil);
      ctx.beginPath(); ctx.arc(mx + mr * 0.52, my + mr * 0.2, mr * 0.9, 0, 6.283); ctx.fill();
      ctx.fillStyle = rgb([168, 160, 142], 0.10 * veil);   // one faint mare for texture
      ctx.beginPath(); ctx.arc(mx - mr * 0.3, my + mr * 0.18, mr * 0.42, 0, 6.283); ctx.fill();
      // thin lit rim on the sunward edge
      ctx.strokeStyle = rgb([248, 242, 224], 0.34 * veil); ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(mx, my, mr - 0.6, Math.PI * 0.82, Math.PI * 1.62); ctx.stroke();

      // back cloud bank
      this.clouds.forEach(c => this._drawCloud(ctx, c, W, H, 0));

      // sheet lightning inside the clouds
      this.sheets.forEach(s => {
        const c = s.c, x = c.x * W, y = c.y * H, r = c.r * W;
        const fl = s.life * s.a * (0.55 + Math.random() * 0.45);
        const sg = ctx.createRadialGradient(x, y + r * 0.15, 0, x, y + r * 0.15, r * 0.95);
        sg.addColorStop(0, rgb(PAL.goldHi, fl * 0.5));
        sg.addColorStop(0.55, rgb(PAL.gold, fl * 0.18));
        sg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = sg; ctx.beginPath(); ctx.ellipse(x, y + r * 0.1, r, r * 0.6, 0, 0, 6.283); ctx.fill();
      });

      // fast dark scud in front
      this.clouds2.forEach(c => this._drawCloud(ctx, c, W, H, 1));

      // milestone pulse — a ring of storm-light rolling out along the horizon
      if (this.pulses.length) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        this.pulses.forEach(p => {
          const k = 1 - p.life;
          const r = W * (0.12 + k * 0.85);
          const a = p.life * p.life * (0.1 + p.t * 0.035);
          const pg = ctx.createRadialGradient(W / 2, seaTop, r * 0.72, W / 2, seaTop, r);
          pg.addColorStop(0, 'rgba(0,0,0,0)');
          pg.addColorStop(0.75, rgb(PAL.goldHi, a));
          pg.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = pg; ctx.fillRect(0, seaTop - H * 0.42, W, H * 0.42 + 10);
        });
        ctx.restore();
      }

      // Doric temple on the headland + the western fire-beacon
      this._drawTemple(ctx, W, H, seaTop);
      if (W > 520) this._drawBeacon(ctx, W, H, seaTop);

      // far rain (over the sky) — blushes crimson as the clock runs dry,
      // gilds faintly as the streak heats the storm
      const slant = (0.18 + this.intensity * 0.28) * (this.overdrive ? 1.5 : 1);
      let rainFar = this._danger > 0.03 ? mix(PAL.rain, PAL.crimson, this._danger * 0.45) : PAL.rain;
      if (this._danger <= 0.03 && this._heat > 0.04) rainFar = mix(rainFar, PAL.emberHot, this._heat * 0.22);
      ctx.lineWidth = 1;
      this.rain.forEach(p => {
        if (!p._draw || p.z >= 0.72 || p.y > seaTop + 10) return;
        ctx.strokeStyle = rgb(rainFar, 0.06 + p.z * 0.095 * (this.overdrive ? 1.4 : 1));
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.len * slant, p.y - p.len); ctx.stroke();
      });

      // ── SEA ──
      this._drawSea(ctx, W, H, seaTop, mx);

      // the lone trireme riding the swell
      if (W > 420) this._drawShip(ctx, W, H, seaTop);

      // foreground breaking wave
      this._drawBreaker(ctx, W, H, seaTop, this.intensity * 8 + (this.overdrive ? 6 : 0));

      // lightning bolts (reflection under, bolt over)
      this.bolts.forEach(b => this._drawReflection(ctx, b, seaTop, H));
      this.bolts.forEach(b => this._drawBolt(ctx, b));

      // impact rings + splash debris (additive)
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      this.impacts.forEach(im => {
        const k = 1 - im.life;
        ctx.strokeStyle = rgb(PAL.goldHi, im.life * 0.75);
        ctx.lineWidth = 1 + im.life * 2.4;
        ctx.beginPath(); ctx.arc(im.x, im.y, im.r * (0.35 + k * 2.1), 0, 6.283); ctx.stroke();
        const ig = ctx.createRadialGradient(im.x, im.y, 0, im.x, im.y, im.r);
        ig.addColorStop(0, rgb(PAL.goldHi, im.life * 0.5)); ig.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = ig; ctx.beginPath(); ctx.arc(im.x, im.y, im.r, 0, 6.283); ctx.fill();
      });
      this.zaps.forEach(z => {
        ctx.fillStyle = rgb(PAL.goldHi, z.life * 0.85);
        ctx.beginPath(); ctx.arc(z.x, z.y, z.r * (0.5 + z.life * 0.7), 0, 6.283); ctx.fill();
      });
      // electric crackle arcs skittering out of the impact point
      ctx.lineCap = 'round';
      this.crackles.forEach(cr => {
        ctx.strokeStyle = rgb(PAL.goldHi, cr.life * 0.8);
        ctx.lineWidth = 0.9 + cr.life * 0.9;
        ctx.beginPath();
        cr.pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y));
        ctx.stroke();
      });
      ctx.restore();

      // near rain — brighter, thicker, in front of the sea; gilded in
      // overdrive, streak-warmed, blood-lit in the dying seconds
      ctx.lineWidth = 1.5;
      let rainNear = this.overdrive ? mix(PAL.rain, PAL.goldHi, 0.35)
        : (this._danger > 0.03 ? mix(PAL.rain, PAL.crimson, this._danger * 0.5) : PAL.rain);
      if (!this.overdrive && this._danger <= 0.03 && this._heat > 0.04) rainNear = mix(rainNear, PAL.emberHot, this._heat * 0.3);
      this.rain.forEach(p => {
        if (!p._draw || p.z < 0.72) return;
        ctx.strokeStyle = rgb(rainNear, 0.11 + p.z * 0.135 * (this.overdrive ? 1.3 : 1));
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.len * 1.25 * slant, p.y - p.len * 1.25); ctx.stroke();
      });

      // foam spray
      this.foam.forEach(f => {
        ctx.fillStyle = rgb(PAL.foam, Math.min(0.9, f.life) * 0.8);
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (0.6 + f.life * 0.6), 0, 6.283); ctx.fill();
      });

      // rising gold charge motes + wind-blown embers (additive heat)
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      this.sparks.forEach(s => {
        ctx.fillStyle = rgb(PAL.goldHi, s.life * 0.5);
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill();
      });
      const emberStreaks = !this.rm && this.streak >= 3;
      this.embers.forEach(e => {
        const flick = 0.7 + 0.3 * Math.sin(this.t * 9 + e.ph);
        const core = mix(PAL.emberCool, e.hot > 0.6 ? PAL.emberHot : PAL.emberMid, e.life);
        const rr = e.r * (1 + this._heat * 0.5);   // streak heat makes them swell
        // at streak heat, hot embers trail a wind-blown streak instead of
        // reading as static dots
        if (emberStreaks && e.hot > 0.55) {
          ctx.strokeStyle = rgb(core, (0.4 + this._heat * 0.2) * e.life * flick);
          ctx.lineWidth = Math.max(0.8, rr * 0.9); ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(e.x, e.y);
          ctx.lineTo(e.x - e.vx * 0.07, e.y - e.vy * 0.07); ctx.stroke();
        }
        ctx.fillStyle = rgb(core, (0.15 + this._heat * 0.05) * e.life * flick);
        ctx.beginPath(); ctx.arc(e.x, e.y, rr * (3 + this._heat * 1.4), 0, 6.283); ctx.fill();
        ctx.fillStyle = rgb(core, 0.9 * e.life * flick);
        ctx.beginPath(); ctx.arc(e.x, e.y, rr, 0, 6.283); ctx.fill();
      });
      ctx.restore();

      // sky flash — weighted to the heavens so repeated strikes read as sky
      // light instead of a flat tan film over the whole frame
      if (this.flash > 0.01) {
        const fg = ctx.createLinearGradient(0, 0, 0, H);
        fg.addColorStop(0, rgb(this.flashColor, this.flash * 0.34));
        fg.addColorStop(0.55, rgb(this.flashColor, this.flash * 0.15));
        fg.addColorStop(1, rgb(this.flashColor, this.flash * 0.05));
        ctx.fillStyle = fg; ctx.fillRect(0, 0, W, H);
      }
      if (this.wrongFlash > 0.01) { ctx.fillStyle = rgb(PAL.crimson, this.wrongFlash * 0.30); ctx.fillRect(0, 0, W, H); }

      // crimson danger light pulsing up from the waterline
      if (this._danger > 0.03) {
        const pulse = 0.75 + 0.25 * Math.sin(this.t * 3.4);
        const dg = ctx.createLinearGradient(0, H, 0, H * 0.45);
        dg.addColorStop(0, rgb(PAL.crimson, this._danger * 0.2 * pulse));
        dg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = dg; ctx.fillRect(0, H * 0.45, W, H * 0.55);
      }

      // overdrive vignette
      if (this.overdrive) {
        const pulse = 0.5 + 0.5 * Math.sin(this.t * 9);
        const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, W * 0.62);
        vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, rgb(PAL.goldHi, 0.12 + pulse * 0.14));
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      }

      // base vignette — quiet depth at the corners
      const bv = ctx.createRadialGradient(W / 2, H * 0.42, Math.min(W, H) * 0.45, W / 2, H * 0.42, Math.max(W, H) * 0.78);
      bv.addColorStop(0, 'rgba(0,0,0,0)'); bv.addColorStop(1, 'rgba(2,2,4,.36)');
      ctx.fillStyle = bv; ctx.fillRect(0, 0, W, H);

      ctx.restore();
    }

    _drawCloud(ctx, c, W, H, front) {
      const x = c.x * W, y = c.y * H, r = c.r * W;
      // front scud stays a dark silhouette even at full charge — keeps depth
      // contrast instead of everything brightening into the same tan
      const v = front ? 14 : 23 + this.charge * 8 + this._heat * 5;
      const cl = ctx.createRadialGradient(x, y - r * 0.1, 0, x, y, r);
      cl.addColorStop(0, `rgba(${v | 0},${(v - 3) | 0},${(v - 6) | 0},${(front ? 0.66 : 0.55 + this.charge * 0.35) * c.a})`);
      cl.addColorStop(0.6, `rgba(${(v - 5) | 0},${(v - 7) | 0},${(v - 9) | 0},${(front ? 0.42 : 0.3) * c.a})`);
      cl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = cl; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.6, 0, 0, 6.283); ctx.fill();
      // streak heat warms the cloud bellies from below (back bank only)
      if (!front && this._heat > 0.04) {
        const hcol = mix(PAL.emberMid, PAL.goldHi, Math.max(0, this._heat - 0.5) * 2);
        const hg = ctx.createRadialGradient(x, y + r * 0.3, 0, x, y + r * 0.3, r * 0.8);
        hg.addColorStop(0, rgb(hcol, (0.04 + this._heat * 0.09) * c.a));
        hg.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = hg; ctx.beginPath(); ctx.ellipse(x, y + r * 0.22, r * 0.85, r * 0.38, 0, 0, 6.283); ctx.fill();
      }
      // lightning-lit underside near the flash
      if (this.flash > 0.03) {
        const prox = Math.max(0, 1 - Math.abs(c.x - this.flashX) / 0.4);
        if (prox > 0.05) {
          const ug = ctx.createRadialGradient(x, y + r * 0.34, 0, x, y + r * 0.34, r * 0.85);
          ug.addColorStop(0, rgb(this.flashColor, this.flash * prox * 0.3));
          ug.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = ug; ctx.beginPath(); ctx.ellipse(x, y + r * 0.25, r * 0.9, r * 0.4, 0, 0, 6.283); ctx.fill();
        }
      }
    }

    // sea surface y at x for a given swell layer
    _surfaceY(x, base, amp, k, phase, speed) {
      return base
        + Math.sin(x * k + this.t * speed + phase) * amp
        + Math.sin(x * k * 2.3 + this.t * speed * 1.6) * amp * 0.4;
    }

    _drawSea(ctx, W, H, seaTop, moonX) {
      const lift = this.intensity * 8 + (this.overdrive ? 6 : 0);
      // base water fill
      const wg = ctx.createLinearGradient(0, seaTop, 0, H);
      wg.addColorStop(0, rgb(mix(PAL.seaMid, [28, 62, 76], 0.35), 1));
      wg.addColorStop(0.42, rgb(PAL.seaMid, 1));
      wg.addColorStop(1, rgb(PAL.seaDeep, 1));
      ctx.fillStyle = wg; ctx.fillRect(0, seaTop - 2, W, H - seaTop + 4);

      // horizon glint — the line where sky meets water catches the light
      ctx.fillStyle = rgb(PAL.seaHi, 0.22 + this.flash * 0.4 + this.charge * 0.1);
      ctx.fillRect(0, seaTop - 1, W, 1.4);

      // moonglade — shimmering silver path under the moon
      const gl = 0.8 - this.intensity * 0.55 - this.charge * 0.2;
      if (gl > 0.08) {
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const rows = 8, gw = W * 0.052;
        for (let i = 0; i < rows; i++) {
          const yy = seaTop + 4 + (H - seaTop) * 0.42 * (i / rows);
          const sw = gw * (0.4 + i * 0.16) * (0.8 + 0.2 * Math.sin(this.t * 2.1 + i * 1.7));
          const jit = Math.sin(this.t * 1.6 + i * 2.3) * (2 + i * 1.4);
          ctx.fillStyle = rgb([196, 206, 218], gl * 0.085 * (1 - i / rows) * (0.75 + 0.25 * Math.sin(this.t * 5 + i)));
          ctx.fillRect(moonX - sw / 2 + jit, yy, sw, (H - seaTop) * 0.42 / rows + 1);
        }
        ctx.restore();
      }

      // reflected charge/flash tint on the water
      if (this.flash > 0.02 || this.charge > 0.05) {
        const rt = ctx.createLinearGradient(0, seaTop, 0, H);
        const col = this.overdrive ? PAL.goldHi : PAL.gold;
        rt.addColorStop(0, rgb(col, 0.05 + this.flash * 0.12 + this.charge * 0.05));
        rt.addColorStop(1, rgb(col, 0));
        ctx.fillStyle = rt; ctx.fillRect(0, seaTop, W, H - seaTop);
      }

      // swell highlight lines — crests catch the lightning
      const glow = 1 + this.flash * 1.6;
      const drawSwell = (base, amp, k, phase, speed, color, alpha, lw) => {
        ctx.strokeStyle = rgb(color, Math.min(0.55, alpha * glow)); ctx.lineWidth = lw; ctx.beginPath();
        for (let x = 0; x <= W; x += 7) {
          const y = this._surfaceY(x, base, amp, k, phase, speed);
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      };
      const A = 4 + lift;
      drawSwell(seaTop + 10, A * 0.7, 0.018, 0, 0.7, PAL.seaHi, 0.18, 1.4);
      drawSwell(seaTop + 28 + lift, A, 0.014, 1.3, 0.95, PAL.seaHi, 0.22, 1.6);
      drawSwell(seaTop + 52 + lift * 1.5, A * 1.3, 0.011, 2.1, 1.2, PAL.seaHi, 0.16, 1.8);
    }

    _drawShip(ctx, W, H, seaTop) {
      const lift = this.intensity * 8 + (this.overdrive ? 6 : 0);
      const A = 4 + lift;
      const yAt = (x) => this._surfaceY(x, seaTop + 28 + lift, A, 0.014, 1.3, 0.95);
      const x = this.ship.x * W;
      const y = yAt(x) + 1;
      const ang = Math.atan2(yAt(x + 12) - yAt(x - 12), 24) * 0.8;
      const L = Math.max(48, Math.min(88, W * 0.068));
      const hull = [7, 6, 8];
      ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
      // hull — shallow crescent with a raised stern (aphlaston) and bow ram
      ctx.fillStyle = rgb(hull, 0.97);
      ctx.beginPath();
      ctx.moveTo(-L * 0.5, -3.5);
      ctx.quadraticCurveTo(0, 4.5, L * 0.5, -4);
      ctx.quadraticCurveTo(L * 0.46, -12, L * 0.38, -13);
      ctx.quadraticCurveTo(L * 0.42, -7.5, L * 0.3, -6.8);
      ctx.lineTo(-L * 0.4, -6.5);
      ctx.quadraticCurveTo(-L * 0.52, -7.5, -L * 0.5, -3.5);
      ctx.closePath(); ctx.fill();
      // mast + yard with a furled sail hint
      ctx.strokeStyle = rgb(hull, 0.95); ctx.lineWidth = 1.7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-L * 0.05, -6.5); ctx.lineTo(-L * 0.05, -6.5 - L * 0.42); ctx.stroke();
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(-L * 0.24, -6.5 - L * 0.33); ctx.lineTo(L * 0.15, -6.5 - L * 0.36); ctx.stroke();
      ctx.strokeStyle = rgb([22, 19, 16], 0.9); ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(-L * 0.2, -6.5 - L * 0.325); ctx.lineTo(L * 0.11, -6.5 - L * 0.35); ctx.stroke();
      // stern lantern — a live little fire in the dark
      const fl = 0.55 + 0.45 * Math.sin(this.t * 7.3 + Math.sin(this.t * 3.1) * 2);
      const lx = L * 0.37, ly = -15;
      const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 11);
      lg.addColorStop(0, rgb([255, 190, 110], 0.4 + fl * 0.3));
      lg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lg; ctx.beginPath(); ctx.arc(lx, ly, 11, 0, 6.283); ctx.fill();
      ctx.fillStyle = rgb([255, 214, 150], 0.75 + fl * 0.25);
      ctx.beginPath(); ctx.arc(lx, ly, 1.7, 0, 6.283); ctx.fill();
      ctx.restore();
      // lantern glow bouncing on the water below
      const rx = x + Math.cos(ang) * L * 0.37;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 4; i++) {
        const yy = y + 4 + i * 5;
        const sw = 3 + i * 2.4 + Math.sin(this.t * 5.2 + i) * 1.6;
        ctx.fillStyle = rgb([255, 180, 100], (0.1 - i * 0.02) * (0.6 + fl * 0.4));
        ctx.fillRect(rx - sw / 2 + Math.sin(this.t * 4 + i * 1.4) * 2, yy, sw, 4);
      }
      ctx.restore();
    }

    _drawBreaker(ctx, W, H, seaTop, lift) {
      const env = this._breakEnv();
      if (env < 0.04) return;
      const baseY = H - (H - seaTop) * 0.20;          // foreground waterline
      const peak = (this.H * 0.16 + lift * 2) * env;  // how high the wave rises
      const bx = this.breakX * W;
      const span = W * (0.42 + 0.2 * env);

      // wave body (filled)
      ctx.beginPath();
      ctx.moveTo(bx - span, H);
      ctx.lineTo(bx - span, baseY);
      const steps = 26;
      for (let i = 0; i <= steps; i++) {
        const x = bx - span + (span * 2) * (i / steps);
        const d = (x - bx) / span;                    // -1..1
        const hump = Math.exp(-d * d * 4);            // bell around breakX
        const ripple = Math.sin(x * 0.02 + this.t * 1.6) * 3;
        const y = baseY - peak * hump + ripple;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(bx + span, H);
      ctx.closePath();
      const bg = ctx.createLinearGradient(0, baseY - peak, 0, H);
      bg.addColorStop(0, rgb(PAL.seaHi, 0.9));
      bg.addColorStop(0.18, rgb(PAL.seaMid, 1));
      bg.addColorStop(1, rgb(PAL.seaDeep, 1));
      ctx.fillStyle = bg; ctx.fill();

      // foam crest cap — bright line that thickens as it breaks
      ctx.strokeStyle = rgb(PAL.foam, 0.35 + env * 0.5);
      ctx.lineWidth = 2 + env * 4; ctx.lineCap = 'round';
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const x = bx - span + (span * 2) * (i / steps);
        const d = (x - bx) / span; const hump = Math.exp(-d * d * 4);
        const y = baseY - peak * hump + Math.sin(x * 0.02 + this.t * 1.6) * 3;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();

      // curling lip when breaking hard
      if (env > 0.6) {
        const lipY = baseY - peak;
        ctx.fillStyle = rgb(PAL.foam, (env - 0.6) * 1.6 * 0.7);
        ctx.beginPath(); ctx.ellipse(bx, lipY + 4, span * 0.16, 7 + env * 6, 0, 0, 6.283); ctx.fill();
      }
    }

    _drawTemple(ctx, W, H, seaTop) {
      const lit = Math.min(1, this.flash * 1.2);
      const base = PAL.column;
      if (!this.columns.length) return;
      // headland mass — a gentle dark hill under the temple
      ctx.fillStyle = rgb([base[0] + 3, base[1] + 2, base[2] + 1], 1);
      ctx.beginPath();
      ctx.moveTo(this.headlandX - 14, seaTop + 2);
      ctx.quadraticCurveTo(this.headlandX + this.headlandW * 0.2, seaTop - H * 0.055, this.headlandX + this.headlandW * 0.55, seaTop - H * 0.05);
      ctx.quadraticCurveTo(this.headlandX + this.headlandW * 0.85, seaTop - H * 0.045, this.headlandX + this.headlandW + 10, seaTop + 2);
      ctx.closePath(); ctx.fill();

      const h = this.templeH, tx = this.templeX, tw = this.templeW;
      const topY = this.columns[0].y - h;
      const stepH = Math.max(1.6, H * 0.005);
      // stylobate — three stacked steps
      for (let s = 0; s < 3; s++) {
        const inset = (3 - s) * 3;
        ctx.fillStyle = rgb([base[0] + 2 + s, base[1] + 2 + s, base[2] + 1 + s], 1);
        ctx.fillRect(tx - inset - 4, this.columns[0].y - stepH * (s + 1), tw + inset * 2 + 8, stepH + 0.5);
      }
      // columns — slightly tapered, capital block on top
      this.columns.forEach(c => {
        const capH = Math.max(1.6, c.h * 0.09), taper = c.w * 0.13;
        ctx.fillStyle = rgb(base, 1);
        ctx.beginPath();
        ctx.moveTo(c.x + taper * 0.5, c.y - c.h);
        ctx.lineTo(c.x + c.w - taper * 0.5, c.y - c.h);
        ctx.lineTo(c.x + c.w, c.y - stepH * 3);
        ctx.lineTo(c.x, c.y - stepH * 3);
        ctx.closePath(); ctx.fill();
        ctx.fillRect(c.x - c.w * 0.12, c.y - c.h - capH, c.w * 1.24, capH);
        if (lit > 0.04) {   // lightning rims the marble
          ctx.fillStyle = rgb(PAL.gold, lit * 0.45);
          ctx.fillRect(c.x + c.w - 1.1, c.y - c.h, 1.1, c.h - stepH * 3);
        }
      });
      // architrave + pediment
      const archH = Math.max(2.4, h * 0.16);
      ctx.fillStyle = rgb([base[0] + 2, base[1] + 2, base[2] + 1], 1);
      ctx.fillRect(tx - 5, topY - archH, tw + 10, archH + 1);
      const pedH = Math.max(6, H * 0.026);
      ctx.beginPath();
      ctx.moveTo(tx - 7, topY - archH);
      ctx.lineTo(tx + tw / 2, topY - archH - pedH);
      ctx.lineTo(tx + tw + 7, topY - archH);
      ctx.closePath(); ctx.fill();
      // moonlit / lightning-lit edges
      ctx.strokeStyle = rgb(lit > 0.04 ? PAL.goldHi : [126, 122, 112], lit > 0.04 ? lit * 0.5 : 0.13);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(tx - 7, topY - archH);
      ctx.lineTo(tx + tw / 2, topY - archH - pedH);
      ctx.lineTo(tx + tw + 7, topY - archH);
      ctx.stroke();
    }

    // φρυκτωρία — a fire-beacon on the western islet; a second live light
    // source that flickers and bounces off the swell (visual only)
    _drawBeacon(ctx, W, H, seaTop) {
      const bx = W * 0.115, top = seaTop + 1;
      const ih = Math.max(7, H * 0.03), iw = Math.max(30, W * 0.075);
      // islet mass
      ctx.fillStyle = rgb([9, 7, 5], 1);
      ctx.beginPath();
      ctx.moveTo(bx - iw, top + 2);
      ctx.quadraticCurveTo(bx - iw * 0.3, top - ih, bx + iw * 0.12, top - ih * 0.82);
      ctx.quadraticCurveTo(bx + iw * 0.55, top - ih * 0.5, bx + iw, top + 2);
      ctx.closePath(); ctx.fill();
      // watchtower
      const tw = Math.max(5, W * 0.008), th = Math.max(14, H * 0.055);
      const ty = top - ih * 0.8;
      ctx.fillStyle = rgb([12, 9, 6], 1);
      ctx.beginPath();
      ctx.moveTo(bx - tw * 0.72, ty);
      ctx.lineTo(bx + tw * 0.72, ty);
      ctx.lineTo(bx + tw * 0.5, ty - th);
      ctx.lineTo(bx - tw * 0.5, ty - th);
      ctx.closePath(); ctx.fill();
      ctx.fillRect(bx - tw * 0.95, ty - th - 1.6, tw * 1.9, 2.2);   // fire bowl
      // the flame — alive, wind-torn
      const fl = 0.55 + 0.45 * Math.sin(this.t * 6.1 + this._beacon.ph + Math.sin(this.t * 2.7) * 1.8);
      const fx = bx, fy = ty - th - 3.5;
      const fh = 4.5 + fl * 3.2;
      const halo = ctx.createRadialGradient(fx, fy, 0, fx, fy, 20 + fl * 8);
      halo.addColorStop(0, rgb([255, 186, 100], 0.32 + fl * 0.18));
      halo.addColorStop(0.5, rgb([232, 138, 46], 0.11 + fl * 0.06));
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(fx, fy, 20 + fl * 8, 0, 6.283); ctx.fill();
      const fg = ctx.createRadialGradient(fx, fy + fh * 0.3, 0, fx, fy, fh);
      fg.addColorStop(0, rgb([255, 244, 214], 0.95));
      fg.addColorStop(0.55, rgb([255, 196, 110], 0.85));
      fg.addColorStop(1, 'rgba(232,110,40,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.ellipse(fx, fy - fh * 0.2, 2.5 + fl, fh, 0, 0, 6.283); ctx.fill();
      // firelight bouncing on the water below
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 5; i++) {
        const yy = top + 5 + i * 6;
        const sw = 4 + i * 3 + Math.sin(this.t * 4.6 + i * 1.3) * 2;
        ctx.fillStyle = rgb([255, 176, 96], (0.11 - i * 0.018) * (0.55 + fl * 0.45));
        ctx.fillRect(fx - sw / 2 + Math.sin(this.t * 3.7 + i * 1.1) * 2.4, yy, sw, 4.4);
      }
      ctx.restore();
    }

    _drawBolt(ctx, b) {
      const a = Math.min(1, b.life * 1.4) * b.flick;
      const core = b.intensity > 0.7 ? PAL.goldHi : [255, 240, 200];
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const stroke = (pts, glowW, coreW, ga) => {
        ctx.strokeStyle = rgb(PAL.gold, ga * 0.4); ctx.lineWidth = glowW;
        ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
        ctx.save();   // hot core with a soft bloom (bolts are few + short-lived)
        ctx.shadowColor = rgb(PAL.goldHi, Math.min(1, ga));
        ctx.shadowBlur = 16;
        ctx.strokeStyle = rgb(core, Math.min(1, ga + 0.2)); ctx.lineWidth = coreW;
        ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
        ctx.restore();
      };
      stroke(b.pts, 10 + b.intensity * 9, 2.4 + b.intensity * 1.2, a);
      b.branches.forEach(bp => stroke(bp, 5, 1.3, a * 0.7));
      const o = b.pts[0];
      const sp = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, 16);
      sp.addColorStop(0, rgb(PAL.goldHi, a * 0.7)); sp.addColorStop(1, rgb(PAL.goldHi, 0));
      ctx.fillStyle = sp; ctx.beginPath(); ctx.arc(o.x, o.y, 16, 0, 6.283); ctx.fill();
    }

    // shimmering vertical reflection of a bolt on the water
    _drawReflection(ctx, b, seaTop, H) {
      const a = Math.min(1, b.life * 1.4) * b.flick;
      if (a < 0.05) return;
      const x = (b.ex !== undefined ? b.ex : b.x);
      const grad = ctx.createLinearGradient(0, seaTop, 0, H);
      grad.addColorStop(0, rgb(PAL.goldHi, a * 0.5)); grad.addColorStop(1, rgb(PAL.goldHi, 0));
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const rows = 9;
      for (let i = 0; i < rows; i++) {
        const yy = seaTop + (H - seaTop) * (i / rows);
        const w = 3 + i * 1.6 + Math.sin(this.t * 6 + i) * 2.5;
        const jit = Math.sin(this.t * 5 + i * 1.3) * (2 + i);
        ctx.fillStyle = grad;
        ctx.fillRect(x - w / 2 + jit, yy, w, (H - seaTop) / rows + 1);
      }
      ctx.restore();
    }
  }

  window.StormArena = StormArena;
})();
