// ============================================================
//  TOW · Reimagined — Cinematic canvas arena  (window.TowArena)
//
//  A full-stage tug-of-war pit, not a thin strip:
//   · two ranks of leaning hoplite silhouettes gripping the rope
//   · a sagging braided rope with a gold-ribboned knot medallion
//   · marble threshold + meander, drifting dust, distant columns
//   · ground-cracks spread under the LOSING side
//   · ember-heat fray on the rope under tension
//   · buzz flare-rings, pull lurch + screen-shake, victory confetti
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
  };

  // prefers-reduced-motion: calm the ambient theatrics, keep state changes readable
  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  function lerpC(c1, c2, t) {
    const p = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const [r1, g1, b1] = p(c1), [r2, g2, b2] = p(c2);
    return `rgb(${Math.round(r1 + (r2 - r1) * t)},${Math.round(g1 + (g2 - g1) * t)},${Math.round(b1 + (b2 - b1) * t)})`;
  }

  // ── particles ────────────────────────────────────────────
  class Dust {
    constructor(x, y, dir) {
      this.x = x + (Math.random() - 0.5) * 16;
      this.y = y;
      this.vx = dir * (0.4 + Math.random() * 2.2);
      this.vy = -(0.5 + Math.random() * 2.4);
      this.ay = 0.09;
      const pal = ['#6b3a2a', '#3a3530', '#8a6a50', '#7a5040', '#5a4a3a', '#4a3828'];
      this.color = pal[(Math.random() * pal.length) | 0];
      this.size = 1.5 + Math.random() * 3;
      this.life = 1; this.decay = 0.018 + Math.random() * 0.02;
    }
    update() { this.x += this.vx; this.y += this.vy; this.vy += this.ay; this.life -= this.decay; }
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
      this.emit = 0; this.emitDir = 0; this.emitX = 0;
      this.lurch = 0; this.lurchSide = null;
      this.buzzFlash = { A: 0, B: 0 };
      this.dust = []; this.confetti = []; this.motes = []; this.crowd = [];
      this.vEmit = 0; this.vSide = null;
      this.excite = 0;         // crowd energy 0..~1.6, decays
      this.flash = 0;          // gold full-frame flash on the winning heave
      this.winSide = null;     // set on victory → poses (winner digs in, loser stumbles)

      this._raf = null; this._lastT = 0; this._alive = false;
      this._resize();
      this._ro = new ResizeObserver(() => this._resize());
      this._ro.observe(this.canvas.parentElement);
    }

    // ── public ───────────────────────────────────────────
    setRopePosition(pct) { this.target = Math.max(0, Math.min(1, pct / 100)); }
    triggerPull(side, intensity) {
      intensity = intensity == null ? 0.5 : intensity;
      this.shake = 16; this.shakeMag = RM ? 0 : 3 + intensity * 6;
      this.emit = 26; this.emitDir = side === 'A' ? -1 : 1;
      this.emitX = this.pos; this._snap = 0.4;
      this.lurch = 14; this.lurchSide = side;
      this.excite = Math.min(1.3, 0.8 + intensity * 0.5);
      if (window.TowAudio) window.TowAudio.snap(intensity);
    }
    triggerBuzz(side) { this.buzzFlash[side] = 1; this.excite = Math.max(this.excite, 0.55); }
    triggerDanger(side) {
      this.vignette = Math.max(this.vignette, 0.66);
      this.vignetteSide = side || null;
      this.excite = Math.max(this.excite, 1);
      if (window.TowAudio) window.TowAudio.danger();
    }
    triggerVictory(side, cb) {
      this.vSide = side; this.vEmit = 90;
      // decisive winning heave: fast snap, gold flash, dust storm, crowd eruption
      this.winSide = side;
      this.excite = 1.6;
      this.flash = 1;
      this._snap = 0.5;
      this.shake = 22; this.shakeMag = RM ? 0 : 7;
      this.emit = 46; this.emitDir = side === 'A' ? -1 : 1;
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
      this.excite = this.flash = 0; this.winSide = null;
      this.dust = []; this.confetti = [];
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
      const H = Math.max(240, Math.min(440, p.clientHeight || 340));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = W * dpr; this.canvas.height = H * dpr;
      this.canvas.style.width = W + 'px'; this.canvas.style.height = H + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.W = W; this.H = H;
      this.motes = []; const n = Math.round(W / (RM ? 70 : 24));
      for (let i = 0; i < n; i++) this.motes.push(new Mote(W, H));
      this._buildCrowd(W, H);
    }

    // amphitheatre crowd: two tiers of tiny spectators behind the pit
    _buildCrowd(W, H) {
      this.crowd = [];
      const tiers = [
        { y: H * 0.315, r: 2.6, n: Math.max(10, Math.round(W / 26)), a: 0.30 },
        { y: H * 0.405, r: 3.3, n: Math.max(9, Math.round(W / 21)), a: 0.44 },
      ];
      tiers.forEach((t, ti) => {
        for (let i = 0; i < t.n; i++) {
          const x = (i + 0.5 + (ti ? 0.45 : 0)) * (W / t.n) + (Math.random() - 0.5) * 6;
          const gold = Math.random() < 0.14;
          const col = gold ? PAL.gold : (x < W / 2 ? PAL.Adk : PAL.Bdk);
          this.crowd.push({
            x, y: t.y, r: t.r * (0.85 + Math.random() * 0.3),
            off: Math.random() * 6.28, sp: 0.6 + Math.random() * 0.9,
            col, a: t.a * (0.8 + Math.random() * 0.4),
            arms: ((Math.random() * 3) | 0) === 0,   // some spectators throw arms up when hyped
          });
        }
      });
    }

    _groundY() { return this.H * 0.78; }
    _ropeBaseY() { return this.H * 0.50; }

    _update(dt) {
      const lerp = this._snap > 0 ? this._snap : 0.09;
      this.pos += (this.target - this.pos) * lerp * dt;
      if (this._snap > 0) this._snap = Math.max(0, this._snap - 0.025 * dt);

      const tension = Math.abs(this.pos - 0.5) * 2;
      this.phase += (0.03 + tension * 0.09) * dt;

      if (this.shake > 0) this.shake = Math.max(0, this.shake - dt);
      if (this.lurch > 0) this.lurch = Math.max(0, this.lurch - dt);
      if (this.vignette > 0) this.vignette = Math.max(0, this.vignette - 0.014 * dt);
      if (this.excite > 0 && !this.winSide) this.excite = Math.max(0, this.excite - 0.012 * dt);
      if (this.flash > 0) this.flash = Math.max(0, this.flash - 0.045 * dt);
      for (const s of ['A', 'B']) if (this.buzzFlash[s] > 0) this.buzzFlash[s] = Math.max(0, this.buzzFlash[s] - 0.045 * dt);

      // pull dust burst from the knot
      if (this.emit > 0) {
        this.emit = Math.max(0, this.emit - dt);
        const kx = this._knotX(), gy = this._groundY();
        for (let i = 0, n = Math.ceil(dt * 3); i < n; i++) this.dust.push(new Dust(kx, gy, this.emitDir));
      }
      for (let i = this.dust.length - 1; i >= 0; i--) { this.dust[i].update(); if (this.dust[i].dead()) this.dust.splice(i, 1); }

      if (this.vEmit > 0) {
        this.vEmit = Math.max(0, this.vEmit - dt);
        const cx = this.vSide === 'A' ? this.W * 0.25 : this.W * 0.75;
        for (let i = 0, n = Math.ceil(dt * 6); i < n; i++) this.confetti.push(new Confetti(cx, this.W, this.vSide));
      }
      for (let i = this.confetti.length - 1; i >= 0; i--) { this.confetti[i].update(); if (this.confetti[i].dead()) this.confetti.splice(i, 1); }

      for (const m of this.motes) { m.x += m.vx; m.y += m.vy; if (m.y < -6) m.reset(this.W, this.H, false); }

      if (window.TowAudio) window.TowAudio.setTension(tension);
    }

    // ── geometry helpers ─────────────────────────────────
    _leftAnchorX() { return this.W * 0.10; }
    _rightAnchorX() { return this.W * 0.90; }
    _knotX() { return this._leftAnchorX() + (this._rightAnchorX() - this._leftAnchorX()) * this.pos; }

    // rope y at given x: two sagging segments meeting at the knot
    _ropeY(x) {
      const lx = this._leftAnchorX(), rx = this._rightAnchorX(), kx = this._knotX();
      const tension = Math.abs(this.pos - 0.5) * 2;
      const anchorY = this._ropeBaseY();
      const sag = (1 - tension) * 26 + 6;              // taut => less sag
      const ky = anchorY + 8 + Math.sin(this.phase) * (1 + tension * 4);
      let t, y;
      if (x <= kx) { t = (x - lx) / Math.max(1, kx - lx); y = anchorY + (ky - anchorY) * t; }
      else { t = (x - kx) / Math.max(1, rx - kx); y = ky + (anchorY - ky) * t; }
      // parabolic sag on each span
      const span = x <= kx ? (kx - lx) : (rx - kx);
      const local = x <= kx ? (x - lx) : (x - kx);
      const u = span > 1 ? local / span : 0;
      y += Math.sin(u * Math.PI) * sag * (x <= kx ? 1 : 1);
      return y;
    }

    // ── draw ─────────────────────────────────────────────
    _draw() {
      const { ctx, W, H } = this;
      const tension = Math.abs(this.pos - 0.5) * 2;

      this._drawSky(W, H);
      this._drawCrowd(W, H);
      this._drawColumns(W, H);
      this._drawTorches(W, H);
      this._drawMotes();

      let sx = 0, sy = 0;
      if (this.shake > 0) {
        const m = this.shakeMag * (this.shake / 16);
        sx = (Math.random() - 0.5) * 2 * m; sy = (Math.random() - 0.5) * m * 0.4;
      }
      ctx.save(); ctx.translate(sx, sy);

      const gy = this._groundY();
      this._drawStandards(gy, tension);
      this._drawGround(gy, W, tension);
      this._drawGrass(gy, W);
      this._drawThreshold(W * 0.5, gy);

      // figures behind rope on far side, in front on near — draw both ranks then rope then near hands
      this._drawTeam('B', gy, tension);
      this._drawTeam('A', gy, tension);
      this._drawRope(tension);
      this._drawKnot(tension);
      this._drawDust();
      this._drawConfetti();

      ctx.restore();

      this._drawEdgeHeat();
      this._drawBuzzFlares();
      if (this.vignette > 0.004) this._drawVignette(W, H);
      if (this.flash > 0.01) {
        ctx.fillStyle = `rgba(240,200,120,${(this.flash * 0.30).toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }
    }

    _drawSky(W, H) {
      const ctx = this.ctx;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0B0805');
      g.addColorStop(0.62, '#140D07');
      g.addColorStop(0.78, '#1d1209');
      g.addColorStop(1, '#0E0A06');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // warm horizon glow behind the threshold
      const gy = this._groundY();
      const rg = ctx.createRadialGradient(W * 0.5, gy, 10, W * 0.5, gy, W * 0.55);
      rg.addColorStop(0, 'rgba(201,164,74,0.14)');
      rg.addColorStop(1, 'rgba(201,164,74,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    }

    _drawColumns(W, H) {
      const ctx = this.ctx; const gy = this._groundY();
      ctx.save(); ctx.globalAlpha = 0.5;
      const cols = [0.04, 0.2, 0.8, 0.96];
      for (const cx0 of cols) {
        const x = cx0 * W, top = H * 0.16, w = Math.max(10, W * 0.022);
        ctx.fillStyle = 'rgba(40,30,20,0.55)';
        ctx.fillRect(x - w / 2, top, w, gy - top);
        ctx.fillStyle = 'rgba(60,46,28,0.5)';
        ctx.fillRect(x - w * 0.7, top - 6, w * 1.4, 7);     // capital
        ctx.fillRect(x - w * 0.7, gy - 5, w * 1.4, 6);      // base
        // flutes
        ctx.strokeStyle = 'rgba(0,0,0,0.3)'; ctx.lineWidth = 1;
        for (let i = -1; i <= 1; i++) { ctx.beginPath(); ctx.moveTo(x + i * w * 0.28, top); ctx.lineTo(x + i * w * 0.28, gy - 5); ctx.stroke(); }
      }
      ctx.restore();
    }

    // ── amphitheatre crowd (bobbing spectators, arms up when hyped) ──
    _drawCrowd(W, H) {
      const ctx = this.ctx;
      // stone bleacher bands
      ctx.fillStyle = 'rgba(34,25,16,0.72)';
      ctx.fillRect(0, H * 0.322, W, H * 0.052);
      ctx.fillRect(0, H * 0.412, W, H * 0.062);
      ctx.strokeStyle = 'rgba(201,164,74,0.10)'; ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, H * 0.322); ctx.lineTo(W, H * 0.322);
      ctx.moveTo(0, H * 0.412); ctx.lineTo(W, H * 0.412);
      ctx.stroke();
      const ex = this.excite;
      const amp = RM ? 0.5 : (0.9 + ex * 4.5);
      for (const c of this.crowd) {
        const hop = Math.abs(Math.sin(this.phase * 2 * c.sp + c.off)) * amp;
        const y = c.y - hop;
        ctx.globalAlpha = c.a;
        ctx.fillStyle = c.col;
        ctx.fillRect(c.x - c.r * 0.9, y - c.r * 0.8, c.r * 1.8, c.r * 1.9);          // body
        ctx.beginPath(); ctx.arc(c.x, y - c.r * 1.5, c.r * 0.72, 0, 6.283); ctx.fill(); // head
        if (ex > 0.85 && c.arms) {                                                    // cheering arms
          ctx.strokeStyle = c.col; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(c.x - c.r * 0.9, y - c.r * 0.6); ctx.lineTo(c.x - c.r * 1.8, y - c.r * 2.6);
          ctx.moveTo(c.x + c.r * 0.9, y - c.r * 0.6); ctx.lineTo(c.x + c.r * 1.8, y - c.r * 2.6);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    }

    // ── torch flames on the inner columns ────────────────
    _drawTorches(W, H) {
      const ctx = this.ctx;
      const ph = this.phase;
      for (const fx of [0.2, 0.8]) {
        const x = fx * W, y = H * 0.16 - 9;
        const fl = RM ? 0.4 : (0.6 + Math.sin(ph * 7 + x) * 0.25 + Math.sin(ph * 13.7 + x * 2) * 0.15);
        // warm glow
        const g = ctx.createRadialGradient(x, y, 2, x, y, 26 + fl * 10);
        g.addColorStop(0, `rgba(240,180,80,${(0.16 + fl * 0.12).toFixed(2)})`);
        g.addColorStop(1, 'rgba(240,180,80,0)');
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, 26 + fl * 10, 0, 6.283); ctx.fill();
        // bowl
        ctx.fillStyle = 'rgba(70,54,32,0.9)';
        ctx.fillRect(x - 6, y + 2, 12, 3.5);
        // flame (teardrop, swaying)
        const fh = 9 + fl * 6, sway = RM ? 0 : Math.sin(ph * 5 + x) * 2;
        const fg = ctx.createLinearGradient(x, y + 2, x, y - fh);
        fg.addColorStop(0, '#e8641e'); fg.addColorStop(0.55, '#f0a030'); fg.addColorStop(1, '#f8d878');
        ctx.fillStyle = fg;
        ctx.beginPath();
        ctx.moveTo(x - 4, y + 2);
        ctx.quadraticCurveTo(x - 4, y - fh * 0.4, x + sway, y - fh);
        ctx.quadraticCurveTo(x + 4, y - fh * 0.4, x + 4, y + 2);
        ctx.closePath(); ctx.fill();
      }
    }

    // ── grass tufts along the pit edge ───────────────────
    _drawGrass(gy, W) {
      const ctx = this.ctx;
      ctx.save(); ctx.lineWidth = 1.3; ctx.lineCap = 'round';
      const n = Math.round(W / 34);
      const cols = ['#46512b', '#5a6a31', '#3a4525'];
      for (let i = 0; i < n; i++) {
        const s = Math.abs(Math.sin(i * 127.1 + 13.7)) % 1;     // deterministic per-tuft
        const x = (i + 0.5) * (W / n) + (s - 0.5) * 18;
        if (Math.abs(x - W * 0.5) < 34) continue;               // keep the threshold clear
        const h0 = 4 + s * 6;
        const sway = RM ? 0 : Math.sin(this.phase * 1.3 + i) * (1.1 + s);
        ctx.globalAlpha = 0.75;
        for (let b = -1; b <= 1; b++) {
          ctx.strokeStyle = cols[b + 1];
          ctx.beginPath();
          ctx.moveTo(x + b * 2, gy + 1);
          ctx.quadraticCurveTo(x + b * 2 + sway * 0.5, gy - h0 * 0.6, x + b * 3 + sway, gy - h0 - (b === 0 ? 2 : 0));
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1; ctx.restore();
    }

    // ── pulsing team-colour heat at the edge a team is about to win ──
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

    _drawMotes() {
      const ctx = this.ctx;
      for (const m of this.motes) {
        ctx.globalAlpha = m.a; ctx.fillStyle = '#c9a44a';
        ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    _drawStandards(gy, tension) {
      const ctx = this.ctx;
      const draw = (x, color, dir) => {
        const sway = Math.sin(this.phase * 0.7) * (2 + tension * 4) * dir;
        const top = gy - this.H * 0.46;
        ctx.save();
        ctx.strokeStyle = 'rgba(120,96,48,0.5)'; ctx.lineWidth = 3; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(x, gy - 4); ctx.lineTo(x + sway, top); ctx.stroke();
        // pennant
        ctx.fillStyle = color; ctx.globalAlpha = 0.5;
        ctx.beginPath();
        ctx.moveTo(x + sway, top);
        ctx.lineTo(x + sway + dir * 34, top + 9);
        ctx.lineTo(x + sway, top + 20);
        ctx.closePath(); ctx.fill();
        ctx.globalAlpha = 1;
        ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(x + sway, top - 1, 3, 0, 6.283); ctx.fill();
        ctx.restore();
      };
      draw(this.W * 0.045, PAL.Adk, 1);
      draw(this.W * 0.955, PAL.Bdk, -1);
    }

    _drawGround(gy, W, tension) {
      const ctx = this.ctx;
      // pit floor
      const g = ctx.createLinearGradient(0, gy, 0, this.H);
      g.addColorStop(0, '#2a1a0e'); g.addColorStop(1, '#160d06');
      ctx.fillStyle = g; ctx.fillRect(0, gy, W, this.H - gy);
      // side tints (which team is winning bleeds onto the floor)
      const bias = this.pos - 0.5; // <0 A leads, >0 B leads
      if (Math.abs(bias) > 0.02) {
        const lead = bias < 0 ? PAL.A : PAL.B;
        const lg = ctx.createLinearGradient(0, gy, W, gy);
        const aA = Math.max(0, -bias) * 0.5, aB = Math.max(0, bias) * 0.5;
        lg.addColorStop(0, `rgba(94,168,216,${aA.toFixed(2)})`);
        lg.addColorStop(0.5, 'rgba(0,0,0,0)');
        lg.addColorStop(1, `rgba(217,105,74,${aB.toFixed(2)})`);
        ctx.fillStyle = lg; ctx.fillRect(0, gy, W, (this.H - gy) * 0.5);
      }
      // top edge highlight
      ctx.strokeStyle = 'rgba(201,164,74,0.25)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      // cracks under the LOSING side, growing with tension
      if (tension > 0.3) this._drawCracks(gy, W, tension, bias);
    }

    _drawCracks(gy, W, tension, bias) {
      const ctx = this.ctx;
      const losingRight = bias < 0; // A leads => B (right) is being dragged; cracks under the team losing ground = the leader's footing dig
      const cx = bias < 0 ? W * 0.22 : W * 0.78; // dig-in cracks under the pulling (leading) team
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

    _drawThreshold(cx, gy) {
      const ctx = this.ctx;
      // marble slab
      ctx.fillStyle = 'rgba(220,210,190,0.10)';
      ctx.fillRect(cx - 26, gy + 1, 52, 6);
      // gold meander pillar
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 3;
      ctx.beginPath(); ctx.moveTo(cx, gy + 5); ctx.lineTo(cx, gy - this.H * 0.30); ctx.stroke();
      // banner top
      ctx.beginPath();
      ctx.moveTo(cx - 7, gy - this.H * 0.30);
      ctx.lineTo(cx + 7, gy - this.H * 0.30);
      ctx.lineTo(cx, gy - this.H * 0.30 - 9);
      ctx.closePath(); ctx.fillStyle = PAL.gold; ctx.fill();
    }

    // ── hoplite ranks ────────────────────────────────────
    _drawTeam(side, gy, tension) {
      const ctx = this.ctx;
      const isA = side === 'A';
      const color = isA ? PAL.A : PAL.B;
      const dark = isA ? PAL.Adk : PAL.Bdk;
      const dir = isA ? -1 : 1; // facing/pull direction

      // formation drag: whole rank shifts with rope pos
      const drag = (this.pos - 0.5) * this.W * 0.14;
      const N = 3;
      // base x of the front (rope-side) member, behind them the rank recedes outward
      const front = (isA ? this._leftAnchorX() : this._rightAnchorX()) + (isA ? -2 : 2);
      const lurchAmt = (this.lurch > 0 && this.lurchSide === side) ? Math.sin((1 - this.lurch / 14) * Math.PI) * 7 : 0;

      // victory poses: winner digs in deep, loser stumbles forward, dragged
      let leanMul = 1;
      if (this.winSide) leanMul = (side === this.winSide) ? 1.4 : -0.55;

      for (let i = N - 1; i >= 0; i--) {            // back-to-front so front overlaps
        const spread = (isA ? -1 : 1) * i * (this.W * 0.052);
        const x = front + spread + drag - dir * lurchAmt;
        const depth = i;                            // 0 = front
        this._drawHoplite(x, gy, dir, color, dark, tension, depth, i, leanMul);
      }
    }

    _drawHoplite(footX, gy, dir, color, dark, tension, depth, idx, leanMul) {
      const ctx = this.ctx;
      const scale = 1 - depth * 0.1;
      const h = this.H * 0.30 * scale;
      const lean = (0.32 + tension * 0.34) * dir * (leanMul == null ? 1 : leanMul);   // radians; negative = stumbling toward centre
      const bob = Math.sin(this.phase * 2 + idx * 1.3) * tension * 2;

      // hip/anchor point
      const hipX = footX, hipY = gy - h * 0.52 + bob;
      const cos = Math.cos(lean), sin = Math.sin(lean);
      // torso vector (from hip up-and-back)
      const tx = sin * h * 0.5, ty = -cos * h * 0.5;
      const shX = hipX + tx, shY = hipY + ty;          // shoulders
      const headX = shX + sin * h * 0.16, headY = shY - cos * h * 0.16 - h * 0.12;

      ctx.save();
      ctx.globalAlpha = depth === 0 ? 1 : 0.82 - depth * 0.12;

      // back leg braced toward centre, front leg planted
      ctx.strokeStyle = '#0b0805'; ctx.lineCap = 'round';
      ctx.lineWidth = Math.max(3, 6 * scale);
      ctx.beginPath();
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(footX - dir * h * 0.34, gy);          // rear (braced) leg
      ctx.moveTo(hipX, hipY);
      ctx.lineTo(footX + dir * h * 0.12, gy);          // front leg
      ctx.stroke();

      // torso (capsule)
      ctx.strokeStyle = '#100a06'; ctx.lineWidth = Math.max(7, 13 * scale);
      ctx.beginPath(); ctx.moveTo(hipX, hipY); ctx.lineTo(shX, shY); ctx.stroke();
      // team-colour rim light on the back of the torso
      ctx.strokeStyle = color; ctx.globalAlpha *= 0.55; ctx.lineWidth = Math.max(1.5, 2.4 * scale);
      ctx.beginPath();
      ctx.moveTo(hipX - dir * 4, hipY); ctx.lineTo(shX - dir * 4, shY); ctx.stroke();
      ctx.globalAlpha = depth === 0 ? 1 : 0.82 - depth * 0.12;

      // arms reaching to the rope (toward centre)
      const ropeGrabX = footX + dir * h * 0.55;
      const ropeGrabY = this._ropeY(ropeGrabX);
      ctx.strokeStyle = '#0b0805'; ctx.lineWidth = Math.max(3, 5 * scale);
      ctx.beginPath(); ctx.moveTo(shX, shY); ctx.lineTo(ropeGrabX, ropeGrabY); ctx.stroke();

      // head + corinthian helmet crest
      ctx.fillStyle = '#0b0805';
      ctx.beginPath(); ctx.arc(headX, headY, h * 0.11, 0, 6.283); ctx.fill();
      // crest plume arcs back, team colour
      ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, 3.4 * scale); ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(headX - dir * h * 0.02, headY - h * 0.11);
      ctx.quadraticCurveTo(headX - dir * h * 0.16, headY - h * 0.26, headX - dir * h * 0.30, headY - h * 0.16);
      ctx.stroke();

      // round shield on the rope-side arm (front rank only, reads clearly)
      if (depth === 0) {
        const shieldX = (shX + ropeGrabX) / 2, shieldY = (shY + ropeGrabY) / 2;
        const r = h * 0.17;
        ctx.beginPath(); ctx.arc(shieldX, shieldY, r, 0, 6.283);
        const sg = ctx.createRadialGradient(shieldX - r * 0.3, shieldY - r * 0.3, 1, shieldX, shieldY, r);
        sg.addColorStop(0, dark); sg.addColorStop(1, '#0b0805');
        ctx.fillStyle = sg; ctx.fill();
        ctx.strokeStyle = color; ctx.lineWidth = Math.max(1.5, 2.2 * scale); ctx.stroke();
        ctx.fillStyle = color; ctx.beginPath(); ctx.arc(shieldX, shieldY, r * 0.22, 0, 6.283); ctx.fill();
      }
      ctx.restore();
    }

    // ── rope + knot ──────────────────────────────────────
    _drawRope(tension) {
      const ctx = this.ctx;
      const lx = this._leftAnchorX(), rx = this._rightAnchorX();
      const pts = [];
      for (let x = lx; x <= rx; x += 3) pts.push({ x, y: this._ropeY(x) });

      const heat = tension * tension;
      const mid = lerpC('#6b4a30', '#e85010', heat);
      const grad = ctx.createLinearGradient(lx, 0, rx, 0);
      grad.addColorStop(0, PAL.Adk);
      grad.addColorStop(0.30, mid);
      grad.addColorStop(0.70, mid);
      grad.addColorStop(1, PAL.Bdk);

      if (tension > 0.5) { ctx.save(); ctx.shadowColor = `rgba(232,80,16,${((tension - 0.5) * 0.8).toFixed(2)})`; ctx.shadowBlur = 5 + tension * 12; }
      this._stroke(pts, grad, 6.5);
      if (tension > 0.5) ctx.restore();
      // braided highlight
      this._stroke(pts.map(p => ({ x: p.x, y: p.y - 1.6 })), 'rgba(255,210,140,0.16)', 1.6);

      // fray fibres near knot
      if (tension > 0.42) {
        const kx = this._knotX(), ky = this._ropeY(kx);
        ctx.save(); ctx.globalAlpha = (tension - 0.42) * 0.6;
        ctx.strokeStyle = PAL.gold; ctx.lineWidth = 0.7;
        for (let i = 0, n = Math.floor(tension * 8); i < n; i++) {
          const fx = kx + Math.sin(this.phase * 3 + i * 2.7) * 26;
          const fy = ky + Math.cos(this.phase * 2 + i * 1.9) * 5;
          ctx.beginPath(); ctx.moveTo(fx, fy);
          ctx.lineTo(fx + Math.sin(this.phase * 5 + i * 4.1) * 14, fy - (4 + Math.abs(Math.sin(this.phase + i)) * 9));
          ctx.stroke();
        }
        ctx.restore();
      }
    }

    _stroke(pts, style, lw) {
      const ctx = this.ctx;
      ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = style; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.stroke();
    }

    _drawKnot(tension) {
      const ctx = this.ctx;
      const kx = this._knotX(), ky = this._ropeY(kx);
      const glowR = 16 + tension * 8;
      const glow = ctx.createRadialGradient(kx, ky, 0, kx, ky, glowR);
      glow.addColorStop(0, 'rgba(201,164,74,0.6)'); glow.addColorStop(1, 'rgba(201,164,74,0)');
      ctx.beginPath(); ctx.arc(kx, ky, glowR, 0, 6.283); ctx.fillStyle = glow; ctx.fill();

      ctx.save(); ctx.translate(kx, ky);
      // ribboned medallion
      ctx.beginPath();
      ctx.moveTo(0, -12); ctx.lineTo(9, 0); ctx.lineTo(0, 12); ctx.lineTo(-9, 0); ctx.closePath();
      const rg = ctx.createLinearGradient(-9, -12, 9, 12);
      rg.addColorStop(0, PAL.goldHi); rg.addColorStop(0.5, '#c97444'); rg.addColorStop(1, '#9a4428');
      ctx.fillStyle = rg; ctx.fill();
      ctx.strokeStyle = PAL.goldHi; ctx.lineWidth = 1.6; ctx.stroke();
      // the CENTRE FLAG — a crimson pennant fluttering below the knot
      const seg = 8, len = 2.5, wamp = RM ? 0.6 : 2.6;
      ctx.beginPath();
      for (let i = 0; i <= seg; i++) {
        const yy = 10 + i * len;
        const wx = Math.sin(this.phase * 3.4 + i * 0.7) * wamp * (i / seg);
        if (i === 0) ctx.moveTo(-4 + wx, yy); else ctx.lineTo(-4 + wx, yy);
      }
      for (let i = seg; i >= 0; i--) {
        const yy = 10 + i * len;
        const wx = Math.sin(this.phase * 3.4 + i * 0.7) * wamp * (i / seg);
        ctx.lineTo(4 + wx, yy);
      }
      ctx.closePath();
      const flagG = ctx.createLinearGradient(0, 10, 0, 10 + seg * len);
      flagG.addColorStop(0, '#d64535'); flagG.addColorStop(1, '#8e2418');
      ctx.fillStyle = flagG; ctx.fill();
      ctx.strokeStyle = 'rgba(240,200,120,0.55)'; ctx.lineWidth = 0.9; ctx.stroke();
      ctx.restore();
    }

    _drawDust() {
      const ctx = this.ctx;
      for (const p of this.dust) {
        ctx.globalAlpha = Math.max(0, p.life * 0.85);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.283); ctx.fillStyle = p.color; ctx.fill();
      }
      ctx.globalAlpha = 1;
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
