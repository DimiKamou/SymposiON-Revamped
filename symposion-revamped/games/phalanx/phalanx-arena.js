// ============================================================
//  PHALANX · Reimagined — Cinematic canvas board (window.PhalanxArena)
//
//  The whole 6×6 battlefield is painted on canvas, not a DOM grid:
//   · stone agora tiles, team-tinted halves, gold meander border
//   · terrain features — high ground (λόφος), mountain pass (στενό),
//     river ford (πόρος), impassable crag (βράχος)
//   · units drawn as figures: hoplite (shield+spear), archer (bow),
//     cavalry (horse), general (crested plume); fog-of-war for hidden foes
//   · units MARCH between tiles, cavalry GALLOPS, clashes FLARE with a
//     bronze ring + sparks + screen-shake, victory rains laurel
//
//  The arena owns rendering + click hit-testing and reports tile taps
//  back through opts.onTileClick(idx). It knows nothing of the rules.
//
//  API:
//   new PhalanxArena(canvasId, { onTileClick })
//   .start() .stop() .reset()
//   .setState({cells,terrain,selected,validMoves,rangedTargets,placement,turn,lastMove})
//   .glide(from,to,unit,{gallop},cb)   move a token along the board
//   .clashAt(idx,cb)                   flare + shake at a contact tile
//   .burst(idx,kind)                   'win' | 'lose' | 'standoff'
//   .shake(mag)
//   .victory(win,cb)
// ============================================================
(function () {
  const PAL = {
    ink:'#0E0B07', ink2:'#171009',
    gold:'#C9A44A', goldHi:'#F0C878', goldDk:'#7d6526',
    A:'#5EA8D8', Adk:'#2E6F94', Alt:'#A8D4F0',   // player — aegean
    B:'#D9694A', Bdk:'#9A4428', Blt:'#F0A98C',   // enemy  — terracotta
    stone:'#1d160d', stoneHi:'#2b2113',
    water:'#2E6F94', hill:'#3a3016', crag:'#0a0805',
  };

  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }

  class Particle {
    constructor(x, y, opts) {
      const a = opts.ang != null ? opts.ang : Math.random() * 6.283;
      const sp = opts.spd != null ? opts.spd : (1 + Math.random() * 4);
      this.x = x; this.y = y;
      this.vx = Math.cos(a) * sp; this.vy = Math.sin(a) * sp - (opts.lift || 0);
      this.ay = opts.ay != null ? opts.ay : 0.14;
      this.size = opts.size || (1 + Math.random() * 2.5);
      this.color = opts.color || PAL.gold;
      this.life = 1; this.decay = opts.decay || (0.02 + Math.random() * 0.025);
      this.grav = opts.grav !== false;
      this.shape = opts.shape || 'dot';
      this.rot = Math.random() * 6.283; this.vr = (Math.random() - 0.5) * 0.3;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.grav) this.vy += this.ay;
      this.vx *= 0.97; this.rot += this.vr; this.life -= this.decay;
    }
    dead() { return this.life <= 0; }
  }

  class PhalanxArena {
    constructor(canvasId, opts) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;
      this.ctx = this.canvas.getContext('2d');
      this.opts = opts || {};
      this.state = { cells: Array(36).fill(null), terrain: Array(36).fill('plain'),
        selected: -1, validMoves: [], rangedTargets: [], placement: false, turn: 'player', lastMove: null };
      this.parts = [];
      this.flares = [];      // {idx, t, dur}
      this.glides = [];      // {from,to,unit,gallop,t,dur,cb,hop}
      this.motes = [];
      this.shakeAmt = 0; this.shakeMag = 0;
      this.vict = 0; this.victWin = false;
      this.phase = 0;
      this._alive = false; this._raf = null; this._last = 0;

      this._onClick = (e) => this._handleClick(e);
      this._attached = false;
      this._attach();
      this._resize();
    }

    // ── public ───────────────────────────────────────────
    setState(s) { Object.assign(this.state, s); }
    // Idempotently (re)attach input + resize observers. Called from the
    // constructor AND start() so a reused instance (NEW BATTLE replay) keeps
    // working after stop() detached everything.
    _attach() {
      if (!this._attached) {
        this.canvas.addEventListener('pointerdown', this._onClick);
        this._attached = true;
      }
      if (!this._ro) {
        this._ro = new ResizeObserver(() => this._resize());
        this._ro.observe(this.canvas.parentElement);
      }
    }
    start() {
      if (this._alive) return;
      this._attach();
      this._alive = true; this._last = performance.now();
      this._raf = requestAnimationFrame(t => this._tick(t));
      if (window.PhalanxAudio) window.PhalanxAudio.startDrone();
    }
    stop() {
      this._alive = false;
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      this.canvas.removeEventListener('pointerdown', this._onClick);
      this._attached = false;
      if (window.PhalanxAudio) window.PhalanxAudio.stopDrone();
    }
    reset() { this.parts = []; this.flares = []; this.glides = []; this.vict = 0; this.shakeAmt = 0; }

    shake(mag) { this.shakeAmt = 1; this.shakeMag = mag || 5; }

    glide(from, to, unit, o, cb) {
      o = o || {};
      this.glides.push({ from, to, unit, gallop: !!o.gallop, t: 0,
        dur: o.gallop ? 26 : 20, cb, suppress: [to, from] });
      if (window.PhalanxAudio) { o.gallop ? window.PhalanxAudio.charge() : window.PhalanxAudio.move(); }
    }
    clashAt(idx, cb) {
      this.flares.push({ idx, t: 0, dur: 38 });
      this.shake(6);
      const c = this._cellCenter(idx);
      for (let i = 0; i < 26; i++) this.parts.push(new Particle(c.x, c.y, { color: i % 2 ? PAL.goldHi : '#ffd98a', spd: 2 + Math.random() * 5, lift: 1, size: 1 + Math.random() * 2 }));
      if (window.PhalanxAudio) window.PhalanxAudio.clash();
      if (cb) setTimeout(cb, 620);
    }
    burst(idx, kind) {
      const c = this._cellCenter(idx);
      if (kind === 'win') {
        for (let i = 0; i < 30; i++) this.parts.push(new Particle(c.x, c.y, { color: i % 3 ? PAL.gold : PAL.goldHi, spd: 2 + Math.random() * 5, lift: 1.5 }));
        if (window.PhalanxAudio) window.PhalanxAudio.correct();
      } else if (kind === 'lose') {
        for (let i = 0; i < 34; i++) this.parts.push(new Particle(c.x, c.y, { color: i % 2 ? PAL.B : '#7a2a16', spd: 1 + Math.random() * 4, lift: 0.5, ay: 0.22 }));
        this.shake(5);
        if (window.PhalanxAudio) window.PhalanxAudio.wrong();
      } else { // standoff
        for (let i = 0; i < 18; i++) this.parts.push(new Particle(c.x, c.y, { color: '#8a7a60', spd: 1 + Math.random() * 2.5, lift: 0.4, grav: false, decay: 0.03 }));
        if (window.PhalanxAudio) window.PhalanxAudio.standoff();
      }
    }
    victory(win, cb) {
      this.vict = 1; this.victWin = win;
      if (window.PhalanxAudio) { window.PhalanxAudio.stopDrone(); window.PhalanxAudio.victory(win); }
      if (cb) setTimeout(cb, 1600);
    }

    // ── layout / hit test ────────────────────────────────
    _resize() {
      const p = this.canvas.parentElement;
      const W = p.clientWidth || 600, H = p.clientHeight || 600;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = W * dpr; this.canvas.height = H * dpr;
      this.canvas.style.width = W + 'px'; this.canvas.style.height = H + 'px';
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.W = W; this.H = H;
      const pad = Math.max(14, Math.min(W, H) * 0.05);
      const size = Math.min(W, H) - pad * 2;
      this.board = size; this.tile = size / 6;
      this.ox = (W - size) / 2; this.oy = (H - size) / 2;
      const n = Math.round(W / 30);
      this.motes = []; for (let i = 0; i < n; i++) this.motes.push({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .15, vy: -(.05 + Math.random() * .18), r: .6 + Math.random() * 1.5, a: .04 + Math.random() * .12 });
    }
    _cellRect(idx) { const r = (idx / 6) | 0, c = idx % 6; return { x: this.ox + c * this.tile, y: this.oy + r * this.tile, s: this.tile }; }
    _cellCenter(idx) { const r = this._cellRect(idx); return { x: r.x + r.s / 2, y: r.y + r.s / 2 }; }
    _handleClick(e) {
      if (!this.opts.onTileClick) return;
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const c = Math.floor((x - this.ox) / this.tile), r = Math.floor((y - this.oy) / this.tile);
      if (c < 0 || c > 5 || r < 0 || r > 5) return;
      if (window.PhalanxAudio) window.PhalanxAudio._init();
      this.opts.onTileClick(r * 6 + c);
    }

    // ── loop ─────────────────────────────────────────────
    _tick(now) {
      if (!this._alive) return;
      const dt = Math.min((now - this._last) / 16.667, 3); this._last = now;
      this._update(dt); this._draw();
      this._raf = requestAnimationFrame(t => this._tick(t));
    }
    _update(dt) {
      this.phase += 0.025 * dt;
      if (this.shakeAmt > 0) this.shakeAmt = Math.max(0, this.shakeAmt - 0.06 * dt);
      for (let i = this.parts.length - 1; i >= 0; i--) { this.parts[i].update(); if (this.parts[i].dead()) this.parts.splice(i, 1); }
      for (let i = this.flares.length - 1; i >= 0; i--) { this.flares[i].t += dt; if (this.flares[i].t >= this.flares[i].dur) this.flares.splice(i, 1); }
      for (let i = this.glides.length - 1; i >= 0; i--) {
        const g = this.glides[i]; g.t += dt;
        if (g.t >= g.dur) { const cb = g.cb; this.glides.splice(i, 1); if (cb) cb(); }
      }
      for (const m of this.motes) { m.x += m.vx; m.y += m.vy; if (m.y < -6) { m.y = this.H + 6; m.x = Math.random() * this.W; } }
      if (this.vict > 0 && this.vict < 1.0001) {
        if (this.victWin) for (let i = 0; i < dt * 2; i++) this.parts.push(new Particle(Math.random() * this.W, -8, { color: Math.random() < .5 ? PAL.gold : PAL.goldHi, shape: 'leaf', spd: .4, ang: 1.57, ay: .03, decay: .006, grav: true, size: 3 + Math.random() * 3 }));
      }
      const strain = this.flares.length ? 1 : (this.glides.length ? 0.4 : 0.12);
      if (window.PhalanxAudio) window.PhalanxAudio.setStrain(strain);
    }

    // ── draw ─────────────────────────────────────────────
    _draw() {
      const { ctx, W, H } = this;
      this._drawBackdrop();
      for (const m of this.motes) { ctx.globalAlpha = m.a; ctx.fillStyle = PAL.gold; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1;

      let sx = 0, sy = 0;
      if (this.shakeAmt > 0) { const m = this.shakeMag * this.shakeAmt; sx = (Math.random() - .5) * 2 * m; sy = (Math.random() - .5) * 2 * m; }
      ctx.save(); ctx.translate(sx, sy);

      this._drawBoard();
      this._drawTerrain();
      this._drawHighlights();
      this._drawUnits();
      this._drawFlares();
      this._drawParticles();
      ctx.restore();

      if (this.vict > 0) this._drawVictory();
    }

    _drawBackdrop() {
      const { ctx, W, H } = this;
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0B0805'); g.addColorStop(.55, '#130D07'); g.addColorStop(1, '#0a0705');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      const rg = ctx.createRadialGradient(W / 2, H * .42, 20, W / 2, H * .42, Math.max(W, H) * .6);
      rg.addColorStop(0, 'rgba(201,164,74,0.08)'); rg.addColorStop(1, 'rgba(201,164,74,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
    }

    _drawBoard() {
      const ctx = this.ctx, t = this.tile;
      // outer meander frame
      ctx.fillStyle = PAL.ink2;
      ctx.fillRect(this.ox - 8, this.oy - 8, this.board + 16, this.board + 16);
      ctx.strokeStyle = 'rgba(201,164,74,0.45)'; ctx.lineWidth = 2;
      ctx.strokeRect(this.ox - 5, this.oy - 5, this.board + 10, this.board + 10);
      ctx.strokeStyle = 'rgba(201,164,74,0.15)'; ctx.lineWidth = 1;
      ctx.strokeRect(this.ox - 8.5, this.oy - 8.5, this.board + 17, this.board + 17);

      for (let i = 0; i < 36; i++) {
        const r = (i / 6) | 0, c = i % 6;
        const x = this.ox + c * t, y = this.oy + r * t;
        const dark = (r + c) % 2 === 0;
        let base = dark ? PAL.stone : PAL.stoneHi;
        ctx.fillStyle = base; ctx.fillRect(x, y, t, t);
        // zone tint
        let tint = null;
        if (r < 3) tint = 'rgba(217,105,74,0.06)';
        else tint = 'rgba(94,168,216,0.06)';
        ctx.fillStyle = tint; ctx.fillRect(x, y, t, t);
        ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, t - 1, t - 1);
        // inner bevel
        ctx.strokeStyle = 'rgba(201,164,74,0.05)'; ctx.strokeRect(x + 2.5, y + 2.5, t - 5, t - 5);
      }
      // centre no-man's-land line
      ctx.strokeStyle = 'rgba(201,164,74,0.3)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 6]);
      const my = this.oy + 3 * t; ctx.beginPath(); ctx.moveTo(this.ox, my); ctx.lineTo(this.ox + this.board, my); ctx.stroke();
      ctx.setLineDash([]);
    }

    _drawTerrain() {
      const ctx = this.ctx, t = this.tile;
      this.state.terrain.forEach((kind, i) => {
        if (!kind || kind === 'plain') return;
        const { x, y, s } = this._cellRect(i);
        const cx = x + s / 2, cy = y + s / 2;
        if (kind === 'hill') {
          ctx.fillStyle = 'rgba(122,96,40,0.30)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          ctx.strokeStyle = 'rgba(201,164,74,0.45)'; ctx.lineWidth = 1.4;
          for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(cx, cy + 2, s * (0.12 + k * 0.11), Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
          ctx.fillStyle = 'rgba(240,200,120,0.5)';
          ctx.beginPath(); ctx.moveTo(cx, cy - s * 0.18); ctx.lineTo(cx + s * 0.1, cy - s * 0.02); ctx.lineTo(cx - s * 0.1, cy - s * 0.02); ctx.closePath(); ctx.fill();
        } else if (kind === 'pass') {
          ctx.fillStyle = 'rgba(60,46,28,0.4)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          ctx.fillStyle = 'rgba(20,14,8,0.8)';
          ctx.fillRect(x + 2, y + 2, s * 0.24, s - 4);
          ctx.fillRect(x + s - 2 - s * 0.24, y + 2, s * 0.24, s - 4);
          ctx.strokeStyle = 'rgba(201,164,74,0.4)'; ctx.lineWidth = 1;
          ctx.strokeRect(x + 2, y + 2, s * 0.24, s - 4);
          ctx.strokeRect(x + s - 2 - s * 0.24, y + 2, s * 0.24, s - 4);
        } else if (kind === 'ford') {
          ctx.fillStyle = 'rgba(46,111,148,0.32)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          ctx.strokeStyle = 'rgba(168,212,240,0.5)'; ctx.lineWidth = 1.3; ctx.lineCap = 'round';
          for (let w = 0; w < 3; w++) {
            const wy = y + s * (0.3 + w * 0.22);
            ctx.beginPath();
            for (let px = x + 3; px <= x + s - 3; px += 4) ctx.lineTo(px, wy + Math.sin((px + this.phase * 18 + w * 7) * 0.5) * 2.2);
            ctx.stroke();
          }
        } else if (kind === 'rock') {
          ctx.fillStyle = '#0a0805'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          ctx.fillStyle = '#241a10';
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.3, cy + s * 0.28); ctx.lineTo(cx - s * 0.18, cy - s * 0.12);
          ctx.lineTo(cx + s * 0.04, cy - s * 0.3); ctx.lineTo(cx + s * 0.26, cy - s * 0.06);
          ctx.lineTo(cx + s * 0.32, cy + s * 0.28); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = 'rgba(201,164,74,0.18)'; ctx.lineWidth = 1; ctx.stroke();
        }
      });
    }

    _drawHighlights() {
      const ctx = this.ctx, t = this.tile;
      // placement zone
      if (this.state.placement) {
        for (let i = 18; i < 36; i++) {
          if (this.state.terrain[i] === 'rock' || this.state.cells[i]) continue;
          const { x, y, s } = this._cellRect(i);
          ctx.fillStyle = 'rgba(94,168,216,0.10)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          ctx.strokeStyle = 'rgba(94,168,216,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.strokeRect(x + 3, y + 3, s - 6, s - 6); ctx.setLineDash([]);
        }
      }
      // valid moves
      const pulse = 0.5 + 0.5 * Math.sin(this.phase * 4);
      this.state.validMoves.forEach(i => {
        const { x, y, s } = this._cellRect(i);
        ctx.fillStyle = `rgba(201,164,74,${0.10 + pulse * 0.07})`; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
        ctx.strokeStyle = 'rgba(201,164,74,0.55)'; ctx.lineWidth = 1.4; ctx.setLineDash([5, 5]); ctx.strokeRect(x + 4, y + 4, s - 8, s - 8); ctx.setLineDash([]);
        if (!this.state.cells[i]) { ctx.fillStyle = `rgba(201,164,74,${0.4 + pulse * 0.3})`; ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, 3.5, 0, 6.283); ctx.fill(); }
      });
      // ranged targets (archer)
      this.state.rangedTargets.forEach(i => {
        const { x, y, s } = this._cellRect(i); const cx = x + s / 2, cy = y + s / 2, r = s * 0.34;
        ctx.strokeStyle = `rgba(217,105,74,${0.6 + pulse * 0.3})`; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r - 3, cy); ctx.lineTo(cx - r + 5, cy); ctx.moveTo(cx + r - 5, cy); ctx.lineTo(cx + r + 3, cy);
        ctx.moveTo(cx, cy - r - 3); ctx.lineTo(cx, cy - r + 5); ctx.moveTo(cx, cy + r - 5); ctx.lineTo(cx, cy + r + 3); ctx.stroke();
      });
      // selection
      if (this.state.selected >= 0) {
        const { x, y, s } = this._cellRect(this.state.selected);
        ctx.strokeStyle = PAL.goldHi; ctx.lineWidth = 2.4; ctx.strokeRect(x + 2, y + 2, s - 4, s - 4);
        ctx.shadowColor = PAL.gold; ctx.shadowBlur = 14; ctx.strokeRect(x + 2, y + 2, s - 4, s - 4); ctx.shadowBlur = 0;
      }
      // last-move trail
      const lm = this.state.lastMove;
      if (lm && lm.from != null && lm.to != null && lm.from !== lm.to) {
        const a = this._cellCenter(lm.from), b = this._cellCenter(lm.to);
        ctx.strokeStyle = 'rgba(201,164,74,0.16)'; ctx.lineWidth = 2; ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.setLineDash([]);
      }
    }

    _drawUnits() {
      // suppress tiles currently in flight
      const sup = new Set();
      this.glides.forEach(g => g.suppress.forEach(s => sup.add(s)));
      // resting units
      this.state.cells.forEach((cell, i) => {
        if (!cell || sup.has(i)) return;
        const c = this._cellCenter(i);
        this._drawUnit(c.x, c.y, this.tile, cell, 0);
      });
      // gliding units (on top)
      this.glides.forEach(g => {
        const a = this._cellCenter(g.from), b = this._cellCenter(g.to);
        const p = ease(Math.min(1, g.t / g.dur));
        const x = lerp(a.x, b.x, p), y = lerp(a.y, b.y, p);
        const hop = g.gallop ? Math.sin(p * Math.PI * 2) * this.tile * 0.10 : Math.sin(p * Math.PI) * this.tile * 0.06;
        this._drawUnit(x, y - hop, this.tile, g.unit, g.gallop ? 1 : 0.5);
      });
    }

    // draw one unit figure centred at (cx,cy)
    _drawUnit(cx, cy, t, cell, motion) {
      const ctx = this.ctx;
      const isP = cell.owner === 'player';
      const col = isP ? PAL.A : PAL.B, dk = isP ? PAL.Adk : PAL.Bdk, lt = isP ? PAL.Alt : PAL.Blt;
      const s = t * 0.78;
      const x = cx - s / 2, y = cy - s / 2;

      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath();
      ctx.ellipse(cx, cy + s * 0.4, s * 0.34, s * 0.12, 0, 0, 6.283); ctx.fill();

      // plinth (rounded-square medallion)
      this._roundRect(x, y, s, s, s * 0.16);
      const pg = ctx.createLinearGradient(x, y, x, y + s);
      pg.addColorStop(0, PAL.ink2); pg.addColorStop(1, '#0c0905');
      ctx.fillStyle = pg; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = cell.revealed ? col : 'rgba(201,164,74,0.4)'; ctx.stroke();
      // inner glow ring
      ctx.lineWidth = 1; ctx.strokeStyle = cell.revealed ? `rgba(255,255,255,0.12)` : 'rgba(201,164,74,0.12)';
      this._roundRect(x + 3, y + 3, s - 6, s - 6, s * 0.12); ctx.stroke();

      if (!cell.revealed) {
        // fog-of-war: bronze lozenge sigil
        ctx.fillStyle = 'rgba(201,164,74,0.5)';
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4);
        ctx.fillRect(-s * 0.16, -s * 0.16, s * 0.32, s * 0.32); ctx.restore();
        ctx.fillStyle = PAL.ink2; ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4);
        ctx.fillRect(-s * 0.09, -s * 0.09, s * 0.18, s * 0.18); ctx.restore();
        return;
      }

      // figure by type
      ctx.save(); ctx.translate(cx, cy);
      const R = s * 0.30;
      if (cell.type === 'hoplite') this._figHoplite(R, col, dk, lt);
      else if (cell.type === 'archer') this._figArcher(R, col, dk, lt);
      else if (cell.type === 'cavalry') this._figCavalry(R, col, dk, lt, motion);
      else if (cell.type === 'general') this._figGeneral(R, col, dk, lt);
      ctx.restore();
    }

    _figHoplite(R, col, dk, lt) {
      const ctx = this.ctx;
      // round shield
      const g = ctx.createRadialGradient(-R * 0.3, -R * 0.3, 1, 0, 0, R);
      g.addColorStop(0, lt); g.addColorStop(0.6, col); g.addColorStop(1, dk);
      ctx.beginPath(); ctx.arc(0, R * 0.06, R, 0, 6.283); ctx.fillStyle = g; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#0a0805'; ctx.stroke();
      // lambda blazon
      ctx.strokeStyle = '#0a0805'; ctx.lineWidth = R * 0.18; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-R * 0.32, R * 0.4); ctx.lineTo(0, -R * 0.42); ctx.lineTo(R * 0.32, R * 0.4); ctx.stroke();
      // spear
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R * 0.92, -R * 1.0); ctx.lineTo(R * 0.5, R * 0.9); ctx.stroke();
      ctx.fillStyle = PAL.goldHi; ctx.beginPath(); ctx.moveTo(R * 0.92, -R * 1.05); ctx.lineTo(R * 1.04, -R * 0.78); ctx.lineTo(R * 0.78, -R * 0.82); ctx.closePath(); ctx.fill();
    }
    _figArcher(R, col, dk, lt) {
      const ctx = this.ctx;
      // bow arc
      ctx.strokeStyle = col; ctx.lineWidth = R * 0.26; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.arc(-R * 0.1, 0, R * 0.92, -Math.PI * 0.62, Math.PI * 0.62); ctx.stroke();
      // string
      ctx.strokeStyle = lt; ctx.lineWidth = 1.4;
      const sy = Math.sin(Math.PI * 0.62) * R * 0.92;
      ctx.beginPath(); ctx.moveTo(-R * 0.1 + Math.cos(-Math.PI * 0.62) * R * 0.92, -sy); ctx.lineTo(-R * 0.1 + Math.cos(Math.PI * 0.62) * R * 0.92, sy); ctx.stroke();
      // arrow nocked
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-R * 0.6, 0); ctx.lineTo(R * 0.7, 0); ctx.stroke();
      ctx.fillStyle = PAL.goldHi; ctx.beginPath(); ctx.moveTo(R * 0.82, 0); ctx.lineTo(R * 0.62, -R * 0.16); ctx.lineTo(R * 0.62, R * 0.16); ctx.closePath(); ctx.fill();
    }
    _figCavalry(R, col, dk, lt, motion) {
      const ctx = this.ctx;
      const leg = motion ? Math.sin(this.phase * 8) * R * 0.12 : 0;
      ctx.fillStyle = col; ctx.strokeStyle = '#0a0805'; ctx.lineWidth = 2;
      // horse body
      ctx.beginPath();
      ctx.moveTo(-R * 0.85, R * 0.2);
      ctx.quadraticCurveTo(-R * 0.5, -R * 0.45, R * 0.45, -R * 0.35);   // back
      ctx.quadraticCurveTo(R * 0.75, -R * 0.3, R * 0.7, -R * 0.7);      // neck up
      ctx.quadraticCurveTo(R * 1.0, -R * 0.55, R * 0.95, -R * 0.2);     // head/muzzle
      ctx.quadraticCurveTo(R * 0.7, -R * 0.05, R * 0.6, R * 0.25);      // chest
      ctx.quadraticCurveTo(R * 0.1, R * 0.1, -R * 0.4, R * 0.3);        // belly
      ctx.closePath(); ctx.fill(); ctx.stroke();
      // mane
      ctx.strokeStyle = dk; ctx.lineWidth = R * 0.16; ctx.beginPath(); ctx.moveTo(R * 0.5, -R * 0.45); ctx.lineTo(R * 0.78, -R * 0.62); ctx.stroke();
      // legs
      ctx.strokeStyle = '#0a0805'; ctx.lineWidth = R * 0.16; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-R * 0.5, R * 0.3); ctx.lineTo(-R * 0.5 + leg, R * 0.95);
      ctx.moveTo(R * 0.45, R * 0.25); ctx.lineTo(R * 0.45 - leg, R * 0.95); ctx.stroke();
    }
    _figGeneral(R, col, dk, lt) {
      const ctx = this.ctx;
      // crested corinthian helm
      const g = ctx.createLinearGradient(0, -R, 0, R);
      g.addColorStop(0, lt); g.addColorStop(1, dk);
      ctx.fillStyle = g; ctx.strokeStyle = '#0a0805'; ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -R * 0.05, R * 0.66, Math.PI * 0.95, Math.PI * 2.05, false);
      ctx.lineTo(R * 0.34, R * 0.5); ctx.lineTo(-R * 0.34, R * 0.5); ctx.closePath();
      ctx.fill(); ctx.stroke();
      // eye slot + nasal
      ctx.fillStyle = '#0a0805'; ctx.fillRect(-R * 0.5, -R * 0.18, R * 0.4, R * 0.16);
      ctx.fillRect(-R * 0.12, -R * 0.18, R * 0.1, R * 0.5);
      // plume crest
      ctx.fillStyle = PAL.gold;
      ctx.beginPath();
      ctx.moveTo(-R * 0.1, -R * 0.7); ctx.quadraticCurveTo(R * 0.2, -R * 1.25, R * 0.7, -R * 1.0);
      ctx.quadraticCurveTo(R * 0.3, -R * 0.95, R * 0.18, -R * 0.55); ctx.closePath(); ctx.fill();
      ctx.fillStyle = PAL.goldHi; ctx.beginPath(); ctx.arc(0, -R * 0.72, R * 0.12, 0, 6.283); ctx.fill();
    }

    _drawFlares() {
      const ctx = this.ctx;
      this.flares.forEach(f => {
        const c = this._cellCenter(f.idx); const p = f.t / f.dur;
        const r = this.tile * (0.3 + p * 0.9); const a = (1 - p) * 0.8;
        ctx.strokeStyle = `rgba(240,200,120,${a})`; ctx.lineWidth = 3 * (1 - p) + 0.5;
        ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.283); ctx.stroke();
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
        g.addColorStop(0, `rgba(255,220,150,${a * 0.5})`); g.addColorStop(1, 'rgba(255,220,150,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.283); ctx.fill();
      });
    }
    _drawParticles() {
      const ctx = this.ctx;
      for (const p of this.parts) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        if (p.shape === 'leaf') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, 6.283); ctx.fill(); ctx.restore(); }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.283); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    }
    _drawVictory() {
      const ctx = this.ctx, { W, H } = this;
      ctx.fillStyle = this.victWin ? 'rgba(20,15,7,0.45)' : 'rgba(40,10,6,0.5)';
      ctx.fillRect(0, 0, W, H);
    }

    _roundRect(x, y, w, h, r) {
      const ctx = this.ctx;
      ctx.beginPath();
      ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
    }
  }

  window.PhalanxArena = PhalanxArena;
})();
