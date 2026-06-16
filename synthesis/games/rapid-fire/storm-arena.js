// ============================================================
//  ΚΑΤΑΙΓΙΣΜΟΣ · Reimagined — cinematic canvas (window.StormArena)
//
//  A thunderstorm over a crashing sea, behind the quiz:
//   · sky: drifting storm clouds (darken with charge), slanting rain,
//     procedural forked lightning, charge glow, overdrive vignette
//   · sea: layered rolling swell + a periodic FOREGROUND BREAKING WAVE
//     that curls, caps with foam and throws spray; lightning reflects
//     and shimmers on the water; a distant coastal colonnade on the horizon
//
//  API (unchanged):
//    const a = new StormArena('storm-canvas', {});
//    a.start(); a.stop();
//    a.strike(intensity 0..1)  · a.setCharge(0..1) · a.setOverdrive(bool)
//    a.flashWrong() · a.setIntensity(0..1) · a.calm()
// ============================================================
(function () {
  const PAL = {
    skyTop: [12, 10, 7], skyHorizon: [40, 33, 22],
    gold: [201, 164, 74], goldHi: [240, 200, 120],
    aegean: [94, 168, 216], rain: [150, 180, 210],
    crimson: [200, 70, 55], column: [8, 7, 4],
    seaDeep: [8, 20, 28], seaMid: [16, 46, 60], seaHi: [70, 130, 158],
    foam: [224, 240, 246],
  };
  const rgb = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
  const rand = (a, b) => a + Math.random() * (b - a);

  class StormArena {
    constructor(canvasId, opts) {
      this.cv = document.getElementById(canvasId);
      this.ctx = this.cv.getContext('2d');
      this.opts = opts || {};
      this.W = 0; this.H = 0; this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.t = 0; this.raf = null; this.last = 0;

      this.charge = 0; this.intensity = 0.45; this.overdrive = false;
      this.flash = 0; this.flashColor = PAL.goldHi; this.flashX = 0.5; this.wrongFlash = 0;
      this.shake = 0;

      this.bolts = []; this.clouds = []; this.rain = []; this.columns = []; this.foam = [];
      this._odTimer = 0;
      this.breakT = rand(0, 1); this.breakX = 0.5; this.breakPeriod = rand(4.5, 7);
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
      this._seedColumns();
      if (this.rain.length) this._seedRain();
    }

    // ── seeds ──────────────────────────────────────────────
    _seedClouds() {
      this.clouds = [];
      for (let i = 0; i < 7; i++) this.clouds.push({
        x: rand(-0.1, 1.1), y: rand(0.02, 0.34), r: rand(0.18, 0.42),
        spd: rand(0.004, 0.018) * (Math.random() < 0.5 ? -1 : 1), a: rand(0.5, 1),
      });
    }
    _seedRain() {
      this.rain = [];
      const n = Math.floor((this.W * this.H) / 6000);
      for (let i = 0; i < n; i++) this.rain.push({
        x: Math.random() * this.W, y: Math.random() * this.H,
        len: rand(8, 20), spd: rand(620, 1050), z: rand(0.4, 1),
      });
    }
    _seedColumns() {
      // a small distant coastal colonnade on the headland behind the sea
      this.columns = [];
      const baseY = (this.seaTop || this.H * 0.6) + 2;
      const colW = Math.max(7, this.W / 54);
      const gap = colW * 1.65;
      const cx = this.W * rand(0.6, 0.74);
      const count = 6;
      let x = cx;
      for (let i = 0; i < count; i++) { this.columns.push({ x, w: colW, h: rand(this.H * 0.07, this.H * 0.10), y: baseY }); x += gap; }
      this.headlandX = cx - gap;
      this.headlandW = gap * (count + 1.5);
    }

    // ── triggers ───────────────────────────────────────────
    setCharge(c) { this.charge = Math.max(0, Math.min(1, c)); }
    setIntensity(v) { this.intensity = Math.max(0, Math.min(1, v)); }
    setOverdrive(on) { this.overdrive = !!on; this._odTimer = 0; if (on) this.flash = 1; }
    flashWrong() { this.wrongFlash = 1; this.shake = Math.max(this.shake, 5); }
    calm() { this.overdrive = false; this.intensity = 0.12; this.charge = 0; }

    strike(intensity) {
      intensity = Math.max(0.2, Math.min(1, intensity || 0.6));
      const sx = rand(this.W * 0.16, this.W * 0.84);
      const sy = rand(this.H * 0.03, this.H * 0.16);
      const ey = (this.seaTop || this.H * 0.6) * rand(0.92, 1.02);
      this.bolts.push(this._makeBolt(sx, sy, ey, intensity));
      this.flash = Math.max(this.flash, 0.55 + intensity * 0.45);
      this.flashColor = intensity > 0.7 ? PAL.goldHi : PAL.gold;
      this.flashX = sx / this.W;
      this.shake = Math.max(this.shake, intensity * 4);
      if (this.bolts.length > 6) this.bolts.shift();
    }

    _makeBolt(sx, sy, ey, intensity) {
      const segs = Math.floor(rand(9, 14));
      const pts = [{ x: sx, y: sy }]; const totalY = ey - sy; let cx = sx;
      for (let i = 1; i <= segs; i++) {
        const fy = sy + (totalY * i) / segs;
        cx += rand(-1, 1) * (this.W * 0.05); cx = Math.max(8, Math.min(this.W - 8, cx));
        pts.push({ x: cx, y: fy + rand(-6, 6) });
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
      return { pts, branches, life: 1, max: rand(0.22, 0.34), intensity, flick: 1, x: sx };
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
      const wind = (0.5 + this.intensity) * (this.overdrive ? 1.7 : 1);
      this.clouds.forEach(c => { c.x += c.spd * dt * wind; if (c.x > 1.25) c.x = -0.25; if (c.x < -0.25) c.x = 1.25; });

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

      this.flash = Math.max(0, this.flash - dt * 3.2);
      this.wrongFlash = Math.max(0, this.wrongFlash - dt * 2.2);
      this.shake = Math.max(0, this.shake - dt * 18);

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
      // foam physics
      this.foam.forEach(f => { f.life -= dt / f.max; f.vy += 240 * dt; f.x += f.vx * dt; f.y += f.vy * dt; });
      this.foam = this.foam.filter(f => f.life > 0 && f.y < this.H + 8);

      if (this.overdrive) { this._odTimer -= dt; if (this._odTimer <= 0) { this.strike(rand(0.5, 0.9)); this._odTimer = rand(0.28, 0.7); } }
    }

    // breaking-wave height envelope (0..1, peaks mid-cycle)
    _breakEnv() { return Math.max(0, Math.sin(this.breakT * Math.PI)); }

    // ── draw ───────────────────────────────────────────────
    _draw() {
      const ctx = this.ctx, W = this.W, H = this.H, seaTop = this.seaTop;
      ctx.clearRect(0, 0, W, H);
      ctx.save();
      if (this.shake > 0.3) ctx.translate(rand(-1, 1) * this.shake, rand(-1, 1) * this.shake);

      // ── SKY ──
      const dark = this.charge * 0.5 + (this.overdrive ? 0.3 : 0);
      const top = PAL.skyTop, hor = PAL.skyHorizon;
      const g = ctx.createLinearGradient(0, 0, 0, seaTop);
      g.addColorStop(0, rgb(top, 1));
      g.addColorStop(0.6, rgb([top[0] + 6, top[1] + 6, top[2] + 6], 1));
      g.addColorStop(1, rgb([hor[0] * (1 - dark) + 30 * this.charge, hor[1] * (1 - dark), hor[2] * (1 - dark)], 1));
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, seaTop + 2);

      // horizon charge glow
      if (this.charge > 0.02 || this.overdrive) {
        const cg = ctx.createRadialGradient(W / 2, seaTop, 0, W / 2, seaTop, W * 0.7);
        const col = this.overdrive ? PAL.goldHi : PAL.gold;
        cg.addColorStop(0, rgb(col, 0.10 + this.charge * 0.2 + (this.overdrive ? 0.14 : 0)));
        cg.addColorStop(1, rgb(col, 0));
        ctx.fillStyle = cg; ctx.fillRect(0, seaTop - H * 0.3, W, H * 0.3);
      }

      // clouds
      this.clouds.forEach(c => {
        const x = c.x * W, y = c.y * H, r = c.r * W;
        const cl = ctx.createRadialGradient(x, y, 0, x, y, r);
        const v = 18 + this.charge * 8;
        cl.addColorStop(0, `rgba(${v},${v - 4},${v - 8},${(0.5 + this.charge * 0.4) * c.a})`);
        cl.addColorStop(0.6, `rgba(${v - 6},${v - 8},${v - 10},${0.28 * c.a})`);
        cl.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = cl; ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.62, 0, 0, 6.283); ctx.fill();
      });

      // distant colonnade on the headland
      this._drawColonnade(ctx, W, H, seaTop);

      // rain over the sky
      ctx.lineWidth = 1;
      const slant = (0.18 + this.intensity * 0.28) * (this.overdrive ? 1.5 : 1);
      this.rain.forEach(p => {
        if (!p._draw || p.y > seaTop + 10) return;
        ctx.strokeStyle = rgb(PAL.rain, 0.06 + p.z * 0.10 * (this.overdrive ? 1.4 : 1));
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.len * slant, p.y - p.len); ctx.stroke();
      });

      // ── SEA ──
      this._drawSea(ctx, W, H, seaTop);

      // lightning bolts (over sky + reflected on sea)
      this.bolts.forEach(b => this._drawBolt(ctx, b));
      this.bolts.forEach(b => this._drawReflection(ctx, b, seaTop, H));

      // foam spray
      this.foam.forEach(f => {
        ctx.fillStyle = rgb(PAL.foam, Math.min(0.9, f.life) * 0.8);
        ctx.beginPath(); ctx.arc(f.x, f.y, f.r * (0.6 + f.life * 0.6), 0, 6.283); ctx.fill();
      });

      // sky flash
      if (this.flash > 0.01) { ctx.fillStyle = rgb(this.flashColor, this.flash * 0.30); ctx.fillRect(0, 0, W, H); }
      if (this.wrongFlash > 0.01) { ctx.fillStyle = rgb(PAL.crimson, this.wrongFlash * 0.30); ctx.fillRect(0, 0, W, H); }

      // overdrive vignette
      if (this.overdrive) {
        const pulse = 0.5 + 0.5 * Math.sin(this.t * 9);
        const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, W * 0.62);
        vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, rgb(PAL.goldHi, 0.12 + pulse * 0.14));
        ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
      }
      ctx.restore();
    }

    // sea surface y at x for a given swell layer
    _surfaceY(x, base, amp, k, phase, speed) {
      return base
        + Math.sin(x * k + this.t * speed + phase) * amp
        + Math.sin(x * k * 2.3 + this.t * speed * 1.6) * amp * 0.4;
    }

    _drawSea(ctx, W, H, seaTop) {
      const lift = this.intensity * 8 + (this.overdrive ? 6 : 0);
      // base water fill
      const wg = ctx.createLinearGradient(0, seaTop, 0, H);
      wg.addColorStop(0, rgb(PAL.seaMid, 1));
      wg.addColorStop(0.5, rgb([PAL.seaMid[0] - 2, PAL.seaMid[1] - 6, PAL.seaMid[2] - 6], 1));
      wg.addColorStop(1, rgb(PAL.seaDeep, 1));
      ctx.fillStyle = wg; ctx.fillRect(0, seaTop - 2, W, H - seaTop + 4);

      // reflected charge/flash tint on the water
      if (this.flash > 0.02 || this.charge > 0.05) {
        const rt = ctx.createLinearGradient(0, seaTop, 0, H);
        const col = this.overdrive ? PAL.goldHi : PAL.gold;
        rt.addColorStop(0, rgb(col, 0.05 + this.flash * 0.12 + this.charge * 0.05));
        rt.addColorStop(1, rgb(col, 0));
        ctx.fillStyle = rt; ctx.fillRect(0, seaTop, W, H - seaTop);
      }

      // back swell highlight line
      const drawSwell = (base, amp, k, phase, speed, color, alpha, lw) => {
        ctx.strokeStyle = rgb(color, alpha); ctx.lineWidth = lw; ctx.beginPath();
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

      // ── foreground breaking wave ──
      this._drawBreaker(ctx, W, H, seaTop, lift);
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

    _drawColonnade(ctx, W, H, seaTop) {
      const lit = Math.min(1, this.flash * 1.2);
      const base = PAL.column;
      // headland mass
      ctx.fillStyle = rgb([base[0] + 4, base[1] + 3, base[2] + 2], 1);
      ctx.beginPath();
      ctx.moveTo(this.headlandX - 10, seaTop + 2);
      ctx.lineTo(this.headlandX + this.headlandW, seaTop + 2);
      ctx.lineTo(this.headlandX + this.headlandW - 18, seaTop - H * 0.05);
      ctx.lineTo(this.headlandX + 14, seaTop - H * 0.045);
      ctx.closePath(); ctx.fill();
      this.columns.forEach(c => {
        ctx.fillStyle = rgb(base, 1);
        ctx.fillRect(c.x, c.y - c.h, c.w, c.h);
        ctx.fillRect(c.x - c.w * 0.14, c.y - c.h, c.w * 1.28, c.h * 0.08);
        if (lit > 0.04) {
          ctx.fillStyle = rgb(PAL.gold, lit * 0.5);
          ctx.fillRect(c.x + c.w - 1.2, c.y - c.h, 1.2, c.h);
          ctx.fillStyle = rgb(PAL.goldHi, lit * 0.3);
          ctx.fillRect(c.x, c.y - c.h, c.w, 1.2);
        }
      });
    }

    _drawBolt(ctx, b) {
      const a = Math.min(1, b.life * 1.4) * b.flick;
      const core = b.intensity > 0.7 ? PAL.goldHi : [255, 240, 200];
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const stroke = (pts, glowW, coreW, ga) => {
        ctx.strokeStyle = rgb(PAL.gold, ga * 0.4); ctx.lineWidth = glowW;
        ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
        ctx.strokeStyle = rgb(core, Math.min(1, ga + 0.2)); ctx.lineWidth = coreW;
        ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
      };
      stroke(b.pts, 9 + b.intensity * 8, 2.2, a);
      b.branches.forEach(bp => stroke(bp, 5, 1.2, a * 0.7));
      const o = b.pts[0];
      const sp = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, 16);
      sp.addColorStop(0, rgb(PAL.goldHi, a * 0.7)); sp.addColorStop(1, rgb(PAL.goldHi, 0));
      ctx.fillStyle = sp; ctx.beginPath(); ctx.arc(o.x, o.y, 16, 0, 6.283); ctx.fill();
    }

    // shimmering vertical reflection of a bolt on the water
    _drawReflection(ctx, b, seaTop, H) {
      const a = Math.min(1, b.life * 1.4) * b.flick;
      if (a < 0.05) return;
      const x = b.x;
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
