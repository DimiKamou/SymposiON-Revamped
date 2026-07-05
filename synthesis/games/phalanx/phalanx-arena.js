// ============================================================
//  PHALANX · Reimagined — Cinematic canvas board (window.PhalanxArena)
//
//  The whole 6×6 battlefield is painted on canvas, not a DOM grid:
//   · dramatic DAWN SKY — ember horizon, mountain silhouettes, drifting
//     war-haze and battle dust rising over the plain
//   · a bronze plinth frame with a true Greek-key meander + rosettes
//   · marble tiles with per-tile wear, cracks and team-tinted halves
//   · terrain features — high ground (λόφος), mountain pass (στενό),
//     river ford (πόρος), impassable crag (βράχος)
//   · units drawn as figures: hoplite (worn lambda shield + spear glint),
//     archer (bow), cavalry (horse + hoof dust), general (crested plume);
//     fog-of-war sigils shimmer with a passing sheen
//   · units MARCH between tiles, cavalry GALLOPS, clashes FLARE with a
//     bronze ring + crossed spear glints + sparks + screen-shake,
//     a FORMATION RIPPLE rolls across the ranks when a line
//     strengthens or breaks, victory rains laurel under god-rays
//
//  The arena owns rendering + click hit-testing and reports tile taps
//  back through opts.onTileClick(idx). It knows nothing of the rules.
//  Ambient motion respects prefers-reduced-motion.
//
//  API (unchanged):
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

  const RM = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')) || { matches: false };

  function lerp(a, b, t) { return a + (b - a) * t; }
  function ease(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  // deterministic per-tile randomness (wear, cracks, glint offsets)
  function mulberry(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

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
      this.ripples = [];     // {idx, t, rgb, amp} — formation ripple waves
      this.fades = [];       // {idx, unit, t, dur} — fallen units sinking as shades
      this.motes = [];
      this.clouds = [];
      this.ridges = [];
      this.stars = [];       // pre-dawn stars, fading toward the horizon
      this.birds = [];       // carrion birds wheeling above the ridges
      this.shakeAmt = 0; this.shakeMag = 0;
      this.flash = 0;        // warm full-screen impact flash
      this.hoverIdx = -1;    // tile under the cursor (mouse affordance)
      this.vict = 0; this.victWin = false;
      this.phase = 0;
      this._alive = false; this._raf = null; this._last = 0;

      // fixed per-tile character: marble tone, crack layout, glint offsets
      const tr = mulberry(20260702);
      this.tileSeeds = Array.from({ length: 36 }, () => ({
        tone: tr(), crack: tr(), a1: tr(), a2: tr(), a3: tr(), a4: tr(),
      }));

      this._onClick = (e) => this._handleClick(e);
      this._onMove = (e) => this._handleMove(e);
      this._onLeave = () => { this.hoverIdx = -1; this.canvas.style.cursor = ''; };
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
        this.canvas.addEventListener('pointermove', this._onMove);
        this.canvas.addEventListener('pointerleave', this._onLeave);
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
      this.canvas.removeEventListener('pointermove', this._onMove);
      this.canvas.removeEventListener('pointerleave', this._onLeave);
      this.canvas.style.cursor = '';
      this._attached = false;
      if (window.PhalanxAudio) window.PhalanxAudio.stopDrone();
    }
    reset() { this.parts = []; this.flares = []; this.glides = []; this.ripples = []; this.fades = []; this.vict = 0; this.shakeAmt = 0; this.flash = 0; this.hoverIdx = -1; }

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
      if (!RM.matches) this.flash = 0.85;
      this._ripple(idx, [255, 220, 150], 0.10);
      const c = this._cellCenter(idx);
      for (let i = 0; i < 26; i++) this.parts.push(new Particle(c.x, c.y, { color: i % 2 ? PAL.goldHi : '#ffd98a', spd: 2 + Math.random() * 5, lift: 1, size: 1 + Math.random() * 2 }));
      if (window.PhalanxAudio) window.PhalanxAudio.clash();
      if (cb) setTimeout(cb, 620);
    }
    // the ranks dress their line — a gold wave rolls out from the centre
    rally() {
      this._ripple(14, [240, 200, 120], 0.13);
      this._ripple(21, [240, 200, 120], 0.13);
    }
    burst(idx, kind, unit) {
      const c = this._cellCenter(idx);
      // a slain unit lingers as a sinking shade instead of blinking away
      if (unit && (kind === 'win' || kind === 'lose')) {
        this.fades.push({ idx, unit: { owner: unit.owner, type: unit.type, revealed: true }, t: 0, dur: RM.matches ? 6 : 40 });
      }
      if (kind === 'win') {
        this._ripple(idx, [240, 200, 120], 0.22);   // the line strengthens
        for (let i = 0; i < 30; i++) this.parts.push(new Particle(c.x, c.y, { color: i % 3 ? PAL.gold : PAL.goldHi, spd: 2 + Math.random() * 5, lift: 1.5 }));
        for (let i = 0; i < 5; i++) this.parts.push(new Particle(c.x, c.y, { color: '#fff6d8', shape: 'star', spd: 0.6 + Math.random(), lift: 1.2, grav: false, decay: 0.03, size: this.tile * (0.05 + Math.random() * 0.05) }));
        if (window.PhalanxAudio) window.PhalanxAudio.correct();
      } else if (kind === 'lose') {
        this._ripple(idx, [217, 105, 74], 0.20);    // the line breaks
        for (let i = 0; i < 34; i++) this.parts.push(new Particle(c.x, c.y, { color: i % 2 ? PAL.B : '#7a2a16', spd: 1 + Math.random() * 4, lift: 0.5, ay: 0.22 }));
        for (let i = 0; i < 10; i++) this.parts.push(new Particle(c.x, c.y + this.tile * 0.2, { color: '#8a6a4a', spd: 0.6 + Math.random() * 1.4, lift: 0.8, grav: false, decay: 0.02, size: 2 + Math.random() * 3 }));
        this.shake(5);
        if (window.PhalanxAudio) window.PhalanxAudio.wrong();
      } else { // standoff
        this._ripple(idx, [170, 150, 118], 0.12);
        for (let i = 0; i < 18; i++) this.parts.push(new Particle(c.x, c.y, { color: '#8a7a60', spd: 1 + Math.random() * 2.5, lift: 0.4, grav: false, decay: 0.03 }));
        if (window.PhalanxAudio) window.PhalanxAudio.standoff();
      }
    }
    victory(win, cb) {
      this.vict = 1; this.victWin = win;
      if (window.PhalanxAudio) { window.PhalanxAudio.stopDrone(); window.PhalanxAudio.victory(win); }
      if (cb) setTimeout(cb, 1600);
    }
    _ripple(idx, rgb, amp) { this.ripples.push({ idx, t: 0, rgb, amp: amp || 0.18 }); }

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
      this.pad = pad;
      this.frameW = Math.min(22, Math.max(11, pad - 3));
      this.horizonY = this.oy + this.board * 0.38;

      // battle dust motes — gold sparks + warm embers rising off the plain
      const n = Math.round(W / 26);
      this.motes = [];
      for (let i = 0; i < n; i++) this.motes.push({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .15, vy: -(.05 + Math.random() * .18),
        r: .6 + Math.random() * 1.5, a: .04 + Math.random() * .12,
        c: Math.random() < 0.35 ? '#D98A4A' : PAL.gold,
      });

      // dawn haze clouds banked above the horizon
      this.clouds = [];
      const nc = Math.max(3, Math.round(W / 340));
      for (let i = 0; i < nc; i++) this.clouds.push({
        x: Math.random() * W, y: this.horizonY - 24 - Math.random() * Math.max(40, this.oy + 60),
        w: 80 + Math.random() * 170, h: 9 + Math.random() * 15,
        a: .05 + Math.random() * .07, v: .04 + Math.random() * .1,
      });

      // distant mountain silhouettes (two parallax ridges)
      this.ridges = [];
      for (let L = 0; L < 2; L++) {
        const rnd = mulberry(97 + L * 131);
        const pts = []; const seg = 22;
        const hgt = L ? 22 + Math.min(38, H * 0.05) : 40 + Math.min(64, H * 0.09);
        for (let k = 0; k <= seg; k++) {
          pts.push({ x: (W / seg) * k, y: this.horizonY - hgt * (0.25 + rnd() * 0.75) });
        }
        this.ridges.push({ pts, base: this.horizonY, col: L ? 'rgba(44,26,26,0.9)' : 'rgba(30,18,24,0.92)' });
      }

      // last stars of the night, dissolving toward the ember horizon
      const sr = mulberry(4210);
      this.stars = [];
      const ns = Math.round(W / 30);
      for (let i = 0; i < ns; i++) this.stars.push({
        x: sr() * W, y: sr() * this.horizonY * 0.7,
        r: 0.5 + sr() * 1.1, tw: sr() * 6.283, sp: 0.5 + sr() * 1.8,
      });

      // carrion birds wheeling over the field
      this.birds = [];
      if (W > 380) for (let i = 0; i < 3; i++) this.birds.push({
        cx: W * (0.22 + i * 0.27), cy: Math.max(18, this.horizonY - 46 - i * 18),
        r: 24 + i * 15, ph: i * 2.4, sp: (0.011 + i * 0.004) * (i % 2 ? -1 : 1),
        fl: i * 1.7,
      });

      // cinematic vignette, cached per layout
      const vg = this.ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.72);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.40)');
      this._vig = vg;
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
    // rows a side may deploy on (mirrors the engine's zones, presentation only)
    _inPlaceZone(idx) {
      const r = (idx / 6) | 0;
      return this.state.placeSide === 'ai' ? r < 3 : r >= 3;
    }
    _handleMove(e) {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      const c = Math.floor((x - this.ox) / this.tile), r = Math.floor((y - this.oy) / this.tile);
      const idx = (c < 0 || c > 5 || r < 0 || r > 5) ? -1 : r * 6 + c;
      this.hoverIdx = idx;
      let act = false;
      if (idx >= 0) {
        const st = this.state;
        if (st.placement) act = this._inPlaceZone(idx) && !st.cells[idx] && st.terrain[idx] !== 'rock';
        else {
          const cell = st.cells[idx];
          act = st.validMoves.indexOf(idx) !== -1 || st.rangedTargets.indexOf(idx) !== -1 ||
                idx === st.selected || !!(cell && cell.owner === st.turn);
        }
      }
      this.canvas.style.cursor = act ? 'pointer' : 'default';
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
      if (this.flash > 0) this.flash = Math.max(0, this.flash - 0.055 * dt);
      for (let i = this.parts.length - 1; i >= 0; i--) { this.parts[i].update(); if (this.parts[i].dead()) this.parts.splice(i, 1); }
      for (let i = this.flares.length - 1; i >= 0; i--) { this.flares[i].t += dt; if (this.flares[i].t >= this.flares[i].dur) this.flares.splice(i, 1); }
      for (let i = this.ripples.length - 1; i >= 0; i--) { this.ripples[i].t += dt; if (this.ripples[i].t > 56) this.ripples.splice(i, 1); }
      for (let i = this.fades.length - 1; i >= 0; i--) { this.fades[i].t += dt; if (this.fades[i].t >= this.fades[i].dur) this.fades.splice(i, 1); }
      if (!RM.matches) for (const b of this.birds) b.ph += b.sp * dt;
      for (let i = this.glides.length - 1; i >= 0; i--) {
        const g = this.glides[i]; g.t += dt;
        if (g.t >= g.dur) { const cb = g.cb; this.glides.splice(i, 1); if (cb) cb(); }
      }
      if (!RM.matches) {
        for (const m of this.motes) { m.x += m.vx; m.y += m.vy; if (m.y < -6) { m.y = this.H + 6; m.x = Math.random() * this.W; } }
        for (const cl of this.clouds) { cl.x += cl.v * dt; if (cl.x - cl.w > this.W) cl.x = -cl.w; }
        // ambient spear glints on revealed units — a stray ray of dawn
        if (Math.random() < 0.010 * dt) {
          const idxs = [];
          this.state.cells.forEach((c, i) => { if (c && c.revealed) idxs.push(i); });
          if (idxs.length) {
            const i = idxs[(Math.random() * idxs.length) | 0]; const c = this._cellCenter(i);
            this.parts.push(new Particle(c.x + (Math.random() - .5) * this.tile * .4, c.y - this.tile * .26, {
              color: '#fff6d8', shape: 'star', spd: 0, grav: false, decay: 0.05, size: this.tile * 0.09, lift: 0 }));
          }
        }
      }
      if (this.vict > 0) {
        if (this.victWin) { if (!RM.matches || Math.random() < 0.25) for (let i = 0; i < dt * 2; i++) this.parts.push(new Particle(Math.random() * this.W, -8, { color: Math.random() < .5 ? PAL.gold : PAL.goldHi, shape: 'leaf', spd: .4, ang: 1.57, ay: .03, decay: .006, grav: true, size: 3 + Math.random() * 3 })); }
        else if (!RM.matches && Math.random() < 0.4 * dt) this.parts.push(new Particle(Math.random() * this.W, -8, { color: '#4a4038', spd: .3, ang: 1.57, ay: .01, decay: .005, grav: true, size: 1 + Math.random() * 2 }));
      }
      const strain = this.flares.length ? 1 : (this.glides.length ? 0.4 : 0.12);
      if (window.PhalanxAudio) window.PhalanxAudio.setStrain(strain);
    }

    // ── draw ─────────────────────────────────────────────
    _draw() {
      const { ctx, W, H } = this;
      this._drawBackdrop();
      for (const m of this.motes) { ctx.globalAlpha = m.a; ctx.fillStyle = m.c; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1;

      let sx = 0, sy = 0;
      if (this.shakeAmt > 0) { const m = this.shakeMag * this.shakeAmt; sx = (Math.random() - .5) * 2 * m; sy = (Math.random() - .5) * 2 * m; }
      ctx.save(); ctx.translate(sx, sy);

      this._drawBoard();
      this._drawTerrain();
      this._drawHighlights();
      this._drawRipples();
      this._drawUnits();
      this._drawFlares();
      this._drawParticles();
      ctx.restore();

      // cinematic vignette pulls the eye to the battlefield
      if (this._vig) { ctx.fillStyle = this._vig; ctx.fillRect(0, 0, W, H); }
      // warm bronze flash on impact
      if (this.flash > 0) {
        ctx.fillStyle = `rgba(255,205,140,${(this.flash * 0.07).toFixed(3)})`;
        ctx.fillRect(0, 0, W, H);
      }

      if (this.vict > 0) this._drawVictory();
    }

    _drawBackdrop() {
      const { ctx, W, H } = this;
      const hor = this.horizonY;
      const hn = Math.min(0.7, Math.max(0.18, hor / H));
      // pre-dawn indigo → smoked violet → ember horizon → dark plain
      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#0a0912');
      g.addColorStop(Math.max(0.04, hn - 0.24), '#211324');
      g.addColorStop(Math.max(0.06, hn - 0.06), '#40221a');
      g.addColorStop(hn, '#57301c');
      g.addColorStop(Math.min(1, hn + 0.09), '#180f0a');
      g.addColorStop(1, '#0a0705');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      // rising sun bloom on the horizon
      const rg = ctx.createRadialGradient(W / 2, hor, 4, W / 2, hor, Math.max(W, H) * 0.55);
      rg.addColorStop(0, 'rgba(255,178,92,0.18)');
      rg.addColorStop(0.35, 'rgba(214,124,54,0.07)');
      rg.addColorStop(1, 'rgba(214,124,54,0)');
      ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
      // last stars, dissolving as dawn climbs
      ctx.fillStyle = '#ffeed8';
      for (const st of this.stars) {
        const tw = RM.matches ? 0.55 : 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(this.phase * st.sp + st.tw));
        const fade = 1 - st.y / Math.max(1, hor * 0.85);
        ctx.globalAlpha = Math.max(0, tw * fade * 0.5);
        ctx.fillRect(st.x, st.y, st.r, st.r);
      }
      ctx.globalAlpha = 1;
      // banked dawn haze
      for (const cl of this.clouds) {
        ctx.fillStyle = `rgba(140,84,60,${(cl.a * 0.55).toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(cl.x, cl.y, cl.w, cl.h, 0, 0, 6.283); ctx.fill();
        ctx.fillStyle = `rgba(170,104,70,${(cl.a * 0.4).toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(cl.x, cl.y - cl.h * 0.2, cl.w * 0.55, cl.h * 0.55, 0, 0, 6.283); ctx.fill();
      }
      // the sun itself, breaching the ridgeline in the open western sky
      // (drawn in the left gutter so the board plinth never hides it)
      const sunR = Math.max(12, Math.min(W, H) * 0.045);
      if (this.ox - this.frameW > sunR * 3) {
        const sunP = RM.matches ? 0 : Math.sin(this.phase * 0.8) * 0.04;
        const sx0 = (this.ox - this.frameW) * 0.5, sy0 = hor - sunR * 0.2;
        const sg = ctx.createRadialGradient(sx0, sy0, 1, sx0, sy0, sunR * (1.9 + sunP));
        sg.addColorStop(0, 'rgba(255,233,189,0.9)');
        sg.addColorStop(0.32, 'rgba(255,192,110,0.55)');
        sg.addColorStop(1, 'rgba(255,140,60,0)');
        ctx.fillStyle = sg;
        ctx.beginPath(); ctx.arc(sx0, sy0, sunR * (1.9 + sunP), 0, 6.283); ctx.fill();
        ctx.fillStyle = '#ffd9a0';
        ctx.beginPath(); ctx.arc(sx0, sy0, sunR * 0.55, 0, 6.283); ctx.fill();
        // smoke slits banding the disc
        ctx.fillStyle = 'rgba(64,34,26,0.5)';
        ctx.fillRect(sx0 - sunR * 1.1, sy0 - sunR * 0.26, sunR * 2.2, Math.max(1.5, sunR * 0.09));
        ctx.fillRect(sx0 - sunR * 0.85, sy0 + sunR * 0.06, sunR * 1.7, Math.max(1.2, sunR * 0.07));
      }
      // mountain silhouettes
      for (const R of this.ridges) {
        ctx.fillStyle = R.col;
        ctx.beginPath();
        ctx.moveTo(-4, R.base + 3);
        R.pts.forEach(p => ctx.lineTo(p.x, p.y));
        ctx.lineTo(W + 4, R.base + 3);
        ctx.closePath(); ctx.fill();
      }
      // carrion birds wheeling over the field
      if (this.birds.length) {
        ctx.strokeStyle = 'rgba(24,13,11,0.75)'; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        for (const b of this.birds) {
          const bx = b.cx + Math.cos(b.ph) * b.r;
          const by = b.cy + Math.sin(b.ph) * b.r * 0.22;
          const flap = RM.matches ? 1.2 : Math.sin(this.phase * 6.5 + b.fl) * 2.6;
          const w = 5.5;
          ctx.beginPath();
          ctx.moveTo(bx - w, by + flap);
          ctx.quadraticCurveTo(bx - w * 0.35, by - 1.6, bx, by);
          ctx.quadraticCurveTo(bx + w * 0.35, by - 1.6, bx + w, by + flap);
          ctx.stroke();
        }
      }
      // low battle-dust bands drifting over the plain
      const drift = RM.matches ? 0 : this.phase;
      for (let b = 0; b < 2; b++) {
        const yy = H * (0.72 + b * 0.14) + (RM.matches ? 0 : Math.sin(drift * 0.6 + b * 2.1) * 5);
        const dg = ctx.createLinearGradient(0, yy - 30, 0, yy + 30);
        dg.addColorStop(0, 'rgba(150,105,66,0)');
        dg.addColorStop(0.5, `rgba(150,105,66,${(0.045 + b * 0.02).toFixed(3)})`);
        dg.addColorStop(1, 'rgba(150,105,66,0)');
        ctx.fillStyle = dg; ctx.fillRect(0, yy - 30, W, 60);
      }
    }

    // one repeat-unit Greek-key strip, drawn horizontally from (0,0)
    _meanderStrip(len, u, alpha) {
      const ctx = this.ctx;
      const n = Math.floor(len / u);
      if (n < 2) return;
      const off = (len - n * u) / 2, h = u * 0.42;
      ctx.strokeStyle = `rgba(201,164,74,${alpha})`;
      ctx.lineWidth = Math.max(1, u * 0.13);
      ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
      ctx.beginPath();
      for (let k = 0; k < n; k++) {
        const x = off + k * u;
        ctx.moveTo(x, h);
        ctx.lineTo(x, -h);
        ctx.lineTo(x + u * 0.70, -h);
        ctx.lineTo(x + u * 0.70, 0);
        ctx.lineTo(x + u * 0.32, 0);
        ctx.lineTo(x + u * 0.32, h);
        ctx.lineTo(x + u, h);
      }
      ctx.stroke();
    }

    _drawBoard() {
      const ctx = this.ctx, t = this.tile, F = this.frameW;
      // bronze plinth frame
      const fg = ctx.createLinearGradient(0, this.oy - F, 0, this.oy + this.board + F);
      fg.addColorStop(0, '#261b0e'); fg.addColorStop(.5, '#15100a'); fg.addColorStop(1, '#211610');
      ctx.fillStyle = fg;
      ctx.fillRect(this.ox - F, this.oy - F, this.board + F * 2, this.board + F * 2);
      // gold hairlines
      ctx.strokeStyle = 'rgba(201,164,74,0.5)'; ctx.lineWidth = 1.5;
      ctx.strokeRect(this.ox - 2.5, this.oy - 2.5, this.board + 5, this.board + 5);
      ctx.strokeStyle = 'rgba(201,164,74,0.22)'; ctx.lineWidth = 1;
      ctx.strokeRect(this.ox - F + 1.5, this.oy - F + 1.5, this.board + F * 2 - 3, this.board + F * 2 - 3);
      // Greek-key meander on all four sides
      const u = Math.max(5, F * 0.62), m = F / 2 + 0.5;
      ctx.save(); ctx.translate(this.ox, this.oy - m); this._meanderStrip(this.board, u, 0.28); ctx.restore();
      ctx.save(); ctx.translate(this.ox + this.board, this.oy + this.board + m); ctx.rotate(Math.PI); this._meanderStrip(this.board, u, 0.28); ctx.restore();
      ctx.save(); ctx.translate(this.ox - m, this.oy + this.board); ctx.rotate(-Math.PI / 2); this._meanderStrip(this.board, u, 0.28); ctx.restore();
      ctx.save(); ctx.translate(this.ox + this.board + m, this.oy); ctx.rotate(Math.PI / 2); this._meanderStrip(this.board, u, 0.28); ctx.restore();
      // corner rosettes
      [[this.ox - m, this.oy - m], [this.ox + this.board + m, this.oy - m],
       [this.ox - m, this.oy + this.board + m], [this.ox + this.board + m, this.oy + this.board + m]].forEach(([rx, ry]) => {
        ctx.fillStyle = '#0d0906'; ctx.beginPath(); ctx.arc(rx, ry, F * 0.46, 0, 6.283); ctx.fill();
        ctx.strokeStyle = 'rgba(201,164,74,0.55)'; ctx.lineWidth = 1.2; ctx.stroke();
        ctx.fillStyle = 'rgba(201,164,74,0.75)'; ctx.beginPath(); ctx.arc(rx, ry, F * 0.14, 0, 6.283); ctx.fill();
      });

      for (let i = 0; i < 36; i++) {
        const r = (i / 6) | 0, c = i % 6;
        const x = this.ox + c * t, y = this.oy + r * t;
        const dark = (r + c) % 2 === 0;
        const seed = this.tileSeeds[i];
        ctx.fillStyle = dark ? PAL.stone : PAL.stoneHi; ctx.fillRect(x, y, t, t);
        // per-tile marble tone variation
        ctx.fillStyle = `rgba(232,210,170,${(seed.tone * 0.05).toFixed(3)})`;
        ctx.fillRect(x, y, t, t);
        // zone tint
        ctx.fillStyle = r < 3 ? 'rgba(217,105,74,0.06)' : 'rgba(94,168,216,0.06)';
        ctx.fillRect(x, y, t, t);
        // hairline crack on worn tiles
        if (seed.crack < 0.32) {
          ctx.strokeStyle = 'rgba(0,0,0,0.26)'; ctx.lineWidth = 1;
          const x0 = x + t * (0.18 + seed.a1 * 0.55);
          ctx.beginPath();
          ctx.moveTo(x0, y + 1);
          ctx.lineTo(x0 + (seed.a2 - 0.5) * t * 0.4, y + t * (0.3 + seed.a3 * 0.3));
          ctx.lineTo(x0 + (seed.a4 - 0.5) * t * 0.6, y + t - 1);
          ctx.stroke();
        }
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
      const ph = RM.matches ? 0 : this.phase;
      this.state.terrain.forEach((kind, i) => {
        if (!kind || kind === 'plain') return;
        const { x, y, s } = this._cellRect(i);
        const cx = x + s / 2, cy = y + s / 2;
        if (kind === 'hill') {
          ctx.fillStyle = 'rgba(122,96,40,0.30)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          ctx.strokeStyle = 'rgba(201,164,74,0.45)'; ctx.lineWidth = 1.4;
          for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(cx, cy + 2, s * (0.12 + k * 0.11), Math.PI * 1.05, Math.PI * 1.95); ctx.stroke(); }
          // sun-caught summit
          ctx.fillStyle = 'rgba(255,214,140,0.55)';
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
            for (let px = x + 3; px <= x + s - 3; px += 4) ctx.lineTo(px, wy + Math.sin((px + ph * 18 + w * 7) * 0.5) * 2.2);
            ctx.stroke();
          }
          // dawn shimmer on the water
          const sh = 0.5 + 0.5 * Math.sin(ph * 2.2 + i);
          ctx.fillStyle = `rgba(255,200,130,${(0.05 + sh * 0.05).toFixed(3)})`;
          ctx.fillRect(x + s * 0.2, y + s * 0.42, s * 0.6, 1.6);
        } else if (kind === 'rock') {
          ctx.fillStyle = '#0a0805'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          ctx.fillStyle = '#241a10';
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.3, cy + s * 0.28); ctx.lineTo(cx - s * 0.18, cy - s * 0.12);
          ctx.lineTo(cx + s * 0.04, cy - s * 0.3); ctx.lineTo(cx + s * 0.26, cy - s * 0.06);
          ctx.lineTo(cx + s * 0.32, cy + s * 0.28); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = 'rgba(201,164,74,0.18)'; ctx.lineWidth = 1; ctx.stroke();
          // moon-lit edge
          ctx.strokeStyle = 'rgba(255,214,150,0.14)'; ctx.beginPath();
          ctx.moveTo(cx - s * 0.18, cy - s * 0.12); ctx.lineTo(cx + s * 0.04, cy - s * 0.3); ctx.lineTo(cx + s * 0.26, cy - s * 0.06); ctx.stroke();
        }
      });
    }

    _drawHighlights() {
      const ctx = this.ctx, t = this.tile;
      const pulse = RM.matches ? 0.5 : 0.5 + 0.5 * Math.sin(this.phase * 4);
      // placement zone — tinted for whichever side is deploying (hot-seat
      // Team B musters on the TOP half, in terracotta)
      if (this.state.placement) {
        const top = this.state.placeSide === 'ai';
        const lo = top ? 0 : 18, hi = top ? 18 : 36;
        const zc = top ? '217,105,74' : '94,168,216';
        for (let i = lo; i < hi; i++) {
          if (this.state.terrain[i] === 'rock' || this.state.cells[i]) continue;
          const { x, y, s } = this._cellRect(i);
          ctx.fillStyle = `rgba(${zc},0.10)`; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          ctx.strokeStyle = `rgba(${zc},0.4)`; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); ctx.strokeRect(x + 3, y + 3, s - 6, s - 6); ctx.setLineDash([]);
        }
      }
      // valid moves
      this.state.validMoves.forEach(i => {
        const { x, y, s } = this._cellRect(i);
        ctx.fillStyle = `rgba(201,164,74,${0.10 + pulse * 0.07})`; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
        ctx.strokeStyle = 'rgba(201,164,74,0.55)'; ctx.lineWidth = 1.4; ctx.setLineDash([5, 5]); ctx.strokeRect(x + 4, y + 4, s - 8, s - 8); ctx.setLineDash([]);
        if (!this.state.cells[i]) { ctx.fillStyle = `rgba(201,164,74,${0.4 + pulse * 0.3})`; ctx.beginPath(); ctx.arc(x + s / 2, y + s / 2, 3.5, 0, 6.283); ctx.fill(); }
      });
      // hover affordance — a gilt pre-highlight where the cursor rests
      const hv = this.hoverIdx;
      if (hv >= 0 && hv !== this.state.selected && !this.glides.length) {
        const { x, y, s } = this._cellRect(hv);
        const isTarget = this.state.validMoves.indexOf(hv) !== -1 || this.state.rangedTargets.indexOf(hv) !== -1;
        const canPlace = this.state.placement && this._inPlaceZone(hv) && !this.state.cells[hv] && this.state.terrain[hv] !== 'rock';
        if (isTarget || canPlace) {
          ctx.fillStyle = 'rgba(240,200,120,0.13)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          ctx.strokeStyle = 'rgba(240,200,120,0.8)'; ctx.lineWidth = 1.6;
          ctx.strokeRect(x + 3, y + 3, s - 6, s - 6);
        } else if (!this.state.placement) {
          const cell = this.state.cells[hv];
          if (cell && cell.owner === this.state.turn) {
            ctx.strokeStyle = 'rgba(240,200,120,0.35)'; ctx.lineWidth = 1.2;
            ctx.strokeRect(x + 2.5, y + 2.5, s - 5, s - 5);
          }
        }
      }
      // ranged targets (archer)
      this.state.rangedTargets.forEach(i => {
        const { x, y, s } = this._cellRect(i); const cx = x + s / 2, cy = y + s / 2, r = s * 0.34;
        ctx.strokeStyle = `rgba(217,105,74,${0.6 + pulse * 0.3})`; ctx.lineWidth = 1.8;
        ctx.beginPath(); ctx.arc(cx, cy, r, 0, 6.283); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(cx - r - 3, cy); ctx.lineTo(cx - r + 5, cy); ctx.moveTo(cx + r - 5, cy); ctx.lineTo(cx + r + 3, cy);
        ctx.moveTo(cx, cy - r - 3); ctx.lineTo(cx, cy - r + 5); ctx.moveTo(cx, cy + r - 5); ctx.lineTo(cx, cy + r + 3); ctx.stroke();
      });
      // selection — gilded frame + breathing corner brackets
      if (this.state.selected >= 0) {
        const { x, y, s } = this._cellRect(this.state.selected);
        ctx.strokeStyle = PAL.goldHi; ctx.lineWidth = 2.4; ctx.strokeRect(x + 2, y + 2, s - 4, s - 4);
        ctx.shadowColor = PAL.gold; ctx.shadowBlur = 14; ctx.strokeRect(x + 2, y + 2, s - 4, s - 4); ctx.shadowBlur = 0;
        const b = 4 + pulse * 2.4, L = s * 0.2;
        ctx.strokeStyle = `rgba(240,200,120,${0.5 + pulse * 0.4})`; ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(x - b + L, y - b); ctx.lineTo(x - b, y - b); ctx.lineTo(x - b, y - b + L);
        ctx.moveTo(x + s + b - L, y - b); ctx.lineTo(x + s + b, y - b); ctx.lineTo(x + s + b, y - b + L);
        ctx.moveTo(x - b + L, y + s + b); ctx.lineTo(x - b, y + s + b); ctx.lineTo(x - b, y + s + b - L);
        ctx.moveTo(x + s + b - L, y + s + b); ctx.lineTo(x + s + b, y + s + b); ctx.lineTo(x + s + b, y + s + b - L);
        ctx.stroke();
      }
      // last-move trail
      const lm = this.state.lastMove;
      if (lm && lm.from != null && lm.to != null && lm.from !== lm.to) {
        const a = this._cellCenter(lm.from), b = this._cellCenter(lm.to);
        ctx.strokeStyle = 'rgba(201,164,74,0.16)'; ctx.lineWidth = 2; ctx.setLineDash([3, 5]);
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); ctx.setLineDash([]);
      }
    }

    // formation ripple — a wave of light rolling outward tile by tile
    _drawRipples() {
      if (!this.ripples.length) return;
      const ctx = this.ctx;
      for (const r of this.ripples) {
        const er = (r.idx / 6) | 0, ec = r.idx % 6;
        for (let i = 0; i < 36; i++) {
          const d = Math.abs(((i / 6) | 0) - er) + Math.abs((i % 6) - ec);
          const local = r.t - d * 3.4;
          if (local <= 0 || local >= 20) continue;
          const a = Math.sin(Math.PI * local / 20) * r.amp;
          const { x, y, s } = this._cellRect(i);
          ctx.fillStyle = `rgba(${r.rgb[0]},${r.rgb[1]},${r.rgb[2]},${a.toFixed(3)})`;
          ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
        }
      }
    }

    _drawUnits() {
      // suppress tiles currently in flight
      const sup = new Set();
      this.glides.forEach(g => g.suppress.forEach(s => sup.add(s)));
      // fallen units sink into the dust as fading shades (drawn under the living)
      const ctx = this.ctx;
      this.fades.forEach(f => {
        const c = this._cellCenter(f.idx);
        const p = Math.min(1, f.t / f.dur);
        const e = p * p;                     // ease-in: lingers, then goes
        const sink = e * this.tile * 0.20;
        ctx.save();
        ctx.globalAlpha = (1 - e) * 0.9;
        ctx.translate(c.x, c.y + sink);
        ctx.rotate((f.unit.owner === 'player' ? -1 : 1) * e * 0.20);
        ctx.translate(-c.x, -(c.y + sink));
        this._drawUnit(c.x, c.y + sink, this.tile * (1 - e * 0.14), f.unit, 0, f.idx);
        ctx.restore();
        ctx.globalAlpha = 1;
      });
      // resting units — subtle idle breathing keeps the ranks alive
      this.state.cells.forEach((cell, i) => {
        if (!cell || sup.has(i)) return;
        const c = this._cellCenter(i);
        const sway = RM.matches ? 0 : Math.sin(this.phase * 1.7 + i * 1.13) * this.tile * 0.012;
        this._drawUnit(c.x, c.y + sway, this.tile, cell, 0, i);
      });
      // gliding units (on top)
      this.glides.forEach(g => {
        const a = this._cellCenter(g.from), b = this._cellCenter(g.to);
        const p = ease(Math.min(1, g.t / g.dur));
        const x = lerp(a.x, b.x, p), y = lerp(a.y, b.y, p);
        const hop = g.gallop ? Math.sin(p * Math.PI * 2) * this.tile * 0.10 : Math.sin(p * Math.PI) * this.tile * 0.06;
        // hooves & sandals kick up dust
        if (!RM.matches && Math.random() < (g.gallop ? 0.6 : 0.25)) {
          this.parts.push(new Particle(x + (Math.random() - .5) * this.tile * 0.3, y + this.tile * 0.3, {
            color: '#8a6a4a', spd: 0.3 + Math.random() * 0.8, ang: Math.PI * (0.75 + Math.random() * 0.5),
            grav: false, decay: 0.04 + Math.random() * 0.03, size: 1.5 + Math.random() * 2.5, lift: 0 }));
        }
        this._drawUnit(x, y - hop, this.tile, g.unit, g.gallop ? 1 : 0.5, g.to);
      });
    }

    // draw one unit figure centred at (cx,cy); seedIdx keys deterministic wear
    _drawUnit(cx, cy, t, cell, motion, seedIdx) {
      const ctx = this.ctx;
      const isP = cell.owner === 'player';
      const col = isP ? PAL.A : PAL.B, dk = isP ? PAL.Adk : PAL.Bdk, lt = isP ? PAL.Alt : PAL.Blt;
      const s = t * 0.78;
      const x = cx - s / 2, y = cy - s / 2;
      const seed = (seedIdx == null ? 0 : seedIdx);

      // shadow
      ctx.fillStyle = 'rgba(0,0,0,0.45)'; ctx.beginPath();
      ctx.ellipse(cx, cy + s * 0.4, s * 0.34, s * 0.12, 0, 0, 6.283); ctx.fill();

      // plinth (rounded-square bronze medallion)
      this._roundRect(x, y, s, s, s * 0.16);
      const pg = ctx.createLinearGradient(x, y, x, y + s);
      pg.addColorStop(0, '#221a0e'); pg.addColorStop(.55, '#120d07'); pg.addColorStop(1, '#0c0905');
      ctx.fillStyle = pg; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = cell.revealed ? col : 'rgba(201,164,74,0.4)'; ctx.stroke();
      // inner glow ring
      ctx.lineWidth = 1; ctx.strokeStyle = cell.revealed ? `rgba(255,255,255,0.12)` : 'rgba(201,164,74,0.12)';
      this._roundRect(x + 3, y + 3, s - 6, s - 6, s * 0.12); ctx.stroke();

      if (!cell.revealed) {
        // fog-of-war: bronze lozenge sigil with a passing sheen
        ctx.fillStyle = 'rgba(201,164,74,0.5)';
        ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4);
        ctx.fillRect(-s * 0.16, -s * 0.16, s * 0.32, s * 0.32); ctx.restore();
        ctx.fillStyle = PAL.ink2; ctx.save(); ctx.translate(cx, cy); ctx.rotate(Math.PI / 4);
        ctx.fillRect(-s * 0.09, -s * 0.09, s * 0.18, s * 0.18); ctx.restore();
        const sp = ((RM.matches ? 0.12 : this.phase * 0.12) + seed * 0.373) % 1;
        if (sp < 0.3) {
          const gx = x + s * (sp / 0.3);
          ctx.save();
          this._roundRect(x, y, s, s, s * 0.16); ctx.clip();
          const sg = ctx.createLinearGradient(gx - s * 0.22, y, gx + s * 0.22, y + s);
          sg.addColorStop(0, 'rgba(255,235,190,0)'); sg.addColorStop(.5, 'rgba(255,235,190,0.07)'); sg.addColorStop(1, 'rgba(255,235,190,0)');
          ctx.fillStyle = sg; ctx.fillRect(x, y, s, s);
          ctx.restore();
        }
        return;
      }

      // figure by type
      ctx.save(); ctx.translate(cx, cy);
      const R = s * 0.30;
      if (cell.type === 'hoplite') this._figHoplite(R, col, dk, lt, seed);
      else if (cell.type === 'archer') this._figArcher(R, col, dk, lt, seed);
      else if (cell.type === 'cavalry') this._figCavalry(R, col, dk, lt, motion);
      else if (cell.type === 'general') this._figGeneral(R, col, dk, lt, seed);
      ctx.restore();
    }

    _figHoplite(R, col, dk, lt, seed) {
      const ctx = this.ctx;
      // round shield
      const g = ctx.createRadialGradient(-R * 0.3, -R * 0.3, 1, 0, 0, R);
      g.addColorStop(0, lt); g.addColorStop(0.6, col); g.addColorStop(1, dk);
      ctx.beginPath(); ctx.arc(0, R * 0.06, R, 0, 6.283); ctx.fillStyle = g; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#0a0805'; ctx.stroke();
      // hammered bronze rim
      ctx.strokeStyle = 'rgba(201,164,74,0.5)'; ctx.lineWidth = R * 0.08;
      ctx.beginPath(); ctx.arc(0, R * 0.06, R * 0.9, 0, 6.283); ctx.stroke();
      // battle wear — deterministic scratches
      const rnd = mulberry(seed * 131 + 7);
      ctx.strokeStyle = 'rgba(14,10,6,0.4)'; ctx.lineWidth = Math.max(1, R * 0.05); ctx.lineCap = 'round';
      for (let k = 0; k < 3; k++) {
        const a0 = rnd() * 6.283, rr = R * (0.3 + rnd() * 0.5), sw = 0.5 + rnd() * 0.9;
        ctx.beginPath(); ctx.arc(0, R * 0.06, rr, a0, a0 + sw / Math.max(0.4, rr / R)); ctx.stroke();
      }
      // dawn rim-light crescent
      ctx.strokeStyle = 'rgba(255,236,196,0.30)'; ctx.lineWidth = R * 0.11;
      ctx.beginPath(); ctx.arc(0, R * 0.06, R * 0.78, -2.5, -1.25); ctx.stroke();
      // lambda blazon
      ctx.strokeStyle = '#0a0805'; ctx.lineWidth = R * 0.18; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-R * 0.32, R * 0.4); ctx.lineTo(0, -R * 0.42); ctx.lineTo(R * 0.32, R * 0.4); ctx.stroke();
      // spear
      ctx.strokeStyle = PAL.gold; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(R * 0.92, -R * 1.0); ctx.lineTo(R * 0.5, R * 0.9); ctx.stroke();
      ctx.fillStyle = PAL.goldHi; ctx.beginPath(); ctx.moveTo(R * 0.92, -R * 1.05); ctx.lineTo(R * 1.04, -R * 0.78); ctx.lineTo(R * 0.78, -R * 0.82); ctx.closePath(); ctx.fill();
      this._spearGlint(R * 0.92, -R * 1.0, R, seed);
    }
    _figArcher(R, col, dk, lt, seed) {
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
      this._spearGlint(R * 0.82, 0, R, seed);
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
      // mane — streams back when in motion
      const flow = motion ? R * 0.14 : 0;
      ctx.strokeStyle = dk; ctx.lineWidth = R * 0.16;
      ctx.beginPath(); ctx.moveTo(R * 0.5, -R * 0.45); ctx.lineTo(R * 0.78 - flow, -R * 0.62 - flow * 0.3); ctx.stroke();
      // eye
      ctx.fillStyle = '#0a0805'; ctx.beginPath(); ctx.arc(R * 0.78, -R * 0.5, Math.max(1, R * 0.05), 0, 6.283); ctx.fill();
      // legs
      ctx.strokeStyle = '#0a0805'; ctx.lineWidth = R * 0.16; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-R * 0.5, R * 0.3); ctx.lineTo(-R * 0.5 + leg, R * 0.95);
      ctx.moveTo(R * 0.45, R * 0.25); ctx.lineTo(R * 0.45 - leg, R * 0.95); ctx.stroke();
    }
    _figGeneral(R, col, dk, lt, seed) {
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
      // plume crest — sways gently in the dawn wind
      const swy = RM.matches ? 0 : Math.sin(this.phase * 2 + seed) * 0.06;
      ctx.save(); ctx.translate(-R * 0.1, -R * 0.7); ctx.rotate(swy); ctx.translate(R * 0.1, R * 0.7);
      ctx.fillStyle = PAL.gold;
      ctx.beginPath();
      ctx.moveTo(-R * 0.1, -R * 0.7); ctx.quadraticCurveTo(R * 0.2, -R * 1.25, R * 0.7, -R * 1.0);
      ctx.quadraticCurveTo(R * 0.3, -R * 0.95, R * 0.18, -R * 0.55); ctx.closePath(); ctx.fill();
      ctx.restore();
      ctx.fillStyle = PAL.goldHi; ctx.beginPath(); ctx.arc(0, -R * 0.72, R * 0.12, 0, 6.283); ctx.fill();
      this._spearGlint(R * 0.55, -R * 1.0, R, seed + 17);
    }
    // periodic spec highlight on a weapon tip — dawn glancing off bronze
    _spearGlint(gx, gy, R, seed) {
      if (RM.matches) return;
      const p = (this.phase * 0.21 + seed * 0.719) % 1;
      if (p >= 0.14) return;
      const ctx = this.ctx;
      const a = Math.sin(Math.PI * p / 0.14);
      const s = R * 0.34 * (0.6 + a * 0.5);
      ctx.save(); ctx.translate(gx, gy); ctx.rotate(0.6);
      ctx.strokeStyle = `rgba(255,248,220,${(a * 0.9).toFixed(3)})`; ctx.lineWidth = 1.3;
      ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke();
      ctx.fillStyle = `rgba(255,248,220,${(a * 0.8).toFixed(3)})`;
      ctx.beginPath(); ctx.arc(0, 0, s * 0.2, 0, 6.283); ctx.fill();
      ctx.restore();
    }

    _drawFlares() {
      if (!this.flares.length) return;
      const ctx = this.ctx;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      this.flares.forEach(f => {
        const c = this._cellCenter(f.idx); const p = f.t / f.dur;
        const r = this.tile * (0.3 + p * 0.9); const a = (1 - p) * 0.8;
        ctx.strokeStyle = `rgba(240,200,120,${a})`; ctx.lineWidth = 3 * (1 - p) + 0.5;
        ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.283); ctx.stroke();
        const g = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, r);
        g.addColorStop(0, `rgba(255,220,150,${a * 0.5})`); g.addColorStop(1, 'rgba(255,220,150,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(c.x, c.y, r, 0, 6.283); ctx.fill();
        // crossed spear glints
        const L = this.tile * (0.72 + p * 0.55);
        [-0.62, 0.78].forEach(ang => {
          ctx.save(); ctx.translate(c.x, c.y); ctx.rotate(ang);
          const lg = ctx.createLinearGradient(-L, 0, L, 0);
          lg.addColorStop(0, 'rgba(255,235,190,0)');
          lg.addColorStop(.5, `rgba(255,245,215,${(a * 0.85).toFixed(3)})`);
          lg.addColorStop(1, 'rgba(255,235,190,0)');
          ctx.fillStyle = lg; ctx.fillRect(-L, -1.6, L * 2, 3.2);
          ctx.restore();
        });
      });
      ctx.restore();
    }
    _drawParticles() {
      const ctx = this.ctx;
      for (const p of this.parts) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        if (p.shape === 'leaf') { ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, 6.283); ctx.fill(); ctx.restore(); }
        else if (p.shape === 'star') {
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          const s = p.size * (0.5 + p.life * 0.7);
          ctx.strokeStyle = p.color; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(s, 0); ctx.moveTo(0, -s); ctx.lineTo(0, s); ctx.stroke();
          ctx.beginPath(); ctx.arc(0, 0, s * 0.22, 0, 6.283); ctx.fill();
          ctx.restore();
        }
        else { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, 6.283); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
    }
    _drawVictory() {
      const ctx = this.ctx, { W, H } = this;
      if (this.victWin) {
        ctx.fillStyle = 'rgba(20,15,7,0.45)'; ctx.fillRect(0, 0, W, H);
        // god-rays fanning from the risen sun
        ctx.save(); ctx.globalCompositeOperation = 'lighter';
        const cx = W / 2, cy = -H * 0.12;
        const rot = RM.matches ? 0 : this.phase * 0.18;
        for (let k = 0; k < 7; k++) {
          const swing = Math.sin(rot + k * 1.7) * 0.42 + (k - 3) * 0.22;
          ctx.save(); ctx.translate(cx, cy); ctx.rotate(swing);
          const g = ctx.createLinearGradient(0, 0, 0, H * 1.5);
          g.addColorStop(0, 'rgba(240,200,120,0.10)'); g.addColorStop(1, 'rgba(240,200,120,0)');
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-W * 0.045, H * 1.5); ctx.lineTo(W * 0.045, H * 1.5); ctx.closePath(); ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      } else {
        ctx.fillStyle = 'rgba(40,10,6,0.5)'; ctx.fillRect(0, 0, W, H);
        const g = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.2, W / 2, H / 2, Math.max(W, H) * 0.72);
        g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(8,2,2,0.6)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      }
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
