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
//   .volley(from,to)                   arrow flourish for a ranged strike
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

  // Low-power heuristic (mid/low-end phones): cap the render buffer at 1.5×
  // instead of 2× so this full-screen 60 fps battle scene stays smooth.
  // Presentation only — battle logic and question flow are untouched.
  const LITE = (function () {
    try {
      return (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) ||
             window.innerWidth < 720 || (navigator.deviceMemory || 8) <= 4;
    } catch (_) { return false; }
  })();
  const DPR_CAP = LITE ? 1.5 : 2;

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
      this.volleys = [];     // {a,b,t,dur} — an arrow arcing to its mark
      this.ripples = [];     // {idx, t, rgb, amp} — formation ripple waves
      this.fades = [];       // {idx, unit, t, dur} — fallen units sinking as shades
      this.cracks = [];      // {idx, t, dur, seed} — a wrong answer splits the shield
      this.scars = [];       // {idx, owner, t, delay, seed} — wreckage left where a unit fell
      this.puffs = [];       // {x, y, t, dur} — landing dust rings when a march ends
      this.spot = null;      // {idx, t, dur} — cinematic iris darkening around a clash
      this.glowP = 0; this.glowA = 0;  // eased turn-tide edge light (player / enemy)
      this.debris = [];      // fallen spears / stones half-buried on the plain
      this._boardLayer = null; // cached plinth + marble slab rendering (repainted on resize)
      this.motes = [];
      this.clouds = [];
      this.ridges = [];
      this.stars = [];       // pre-dawn stars, fading toward the horizon
      this.birds = [];       // carrion birds wheeling above the ridges
      this.fires = [];       // enemy watch-fires dotting the plain at dawn
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
    reset() { this.parts = []; this.flares = []; this.glides = []; this.volleys = []; this.ripples = []; this.fades = []; this.cracks = []; this.scars = []; this.puffs = []; this.spot = null; this.vict = 0; this.shakeAmt = 0; this.flash = 0; this.hoverIdx = -1; }

    shake(mag) { this.shakeAmt = 1; this.shakeMag = mag || 5; }

    glide(from, to, unit, o, cb) {
      o = o || {};
      this.glides.push({ from, to, unit, gallop: !!o.gallop, t: 0,
        dur: o.gallop ? 26 : 20, cb, suppress: [to, from] });
      if (window.PhalanxAudio) { o.gallop ? window.PhalanxAudio.charge() : window.PhalanxAudio.move(); }
    }
    // an archer's shaft arcs from its rank to the mark — pure flourish, fired
    // just before the clash flare so the strike reads as CAUSE then EFFECT
    volley(from, to) {
      const a = this._cellCenter(from), b = this._cellCenter(to);
      this.volleys.push({ a, b, t: 0, dur: RM.matches ? 9 : 16 });
    }
    clashAt(idx, cb) {
      this.flares.push({ idx, t: 0, dur: 38 });
      this.spot = { idx, t: 0, dur: 46 };   // iris of dusk pulls the eye to the duel
      this.shake(6);
      if (!RM.matches) this.flash = 1;
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
      // a slain unit lingers as a sinking shade instead of blinking away,
      // then leaves WRECKAGE on the slab — the gap in the line stays visible
      if (unit && (kind === 'win' || kind === 'lose')) {
        const fd = RM.matches ? 6 : 40;
        this.fades.push({ idx, unit: { owner: unit.owner, type: unit.type, revealed: true }, t: 0, dur: fd });
        this.scars.push({ idx, owner: unit.owner, t: 0, delay: fd, seed: idx * 57 + 3 });
        if (this.scars.length > 12) this.scars.shift();
      }
      if (kind === 'win') {
        this._ripple(idx, [240, 200, 120], 0.22);   // the line strengthens
        // the beaten shield SPLITS too — cracks + shards in the fallen side's colors
        this.cracks.push({ idx, t: 0, dur: RM.matches ? 14 : 32, seed: idx * 97 + 5 });
        if (unit) {
          const wc = unit.owner === 'player' ? [PAL.A, PAL.Adk, PAL.Alt] : [PAL.B, PAL.Bdk, PAL.Blt];
          const nW = RM.matches ? 2 : 6;
          for (let i = 0; i < nW; i++) this.parts.push(new Particle(c.x, c.y, {
            color: wc[i % 3], shape: 'shard', spd: 1.4 + Math.random() * 2.6,
            lift: 1.6, ay: 0.20, decay: 0.018 + Math.random() * 0.012,
            size: this.tile * (0.04 + Math.random() * 0.045) }));
        }
        for (let i = 0; i < 30; i++) this.parts.push(new Particle(c.x, c.y, { color: i % 3 ? PAL.gold : PAL.goldHi, spd: 2 + Math.random() * 5, lift: 1.5 }));
        for (let i = 0; i < 5; i++) this.parts.push(new Particle(c.x, c.y, { color: '#fff6d8', shape: 'star', spd: 0.6 + Math.random(), lift: 1.2, grav: false, decay: 0.03, size: this.tile * (0.05 + Math.random() * 0.05) }));
        if (window.PhalanxAudio) window.PhalanxAudio.correct();
      } else if (kind === 'lose') {
        this._ripple(idx, [217, 105, 74], 0.20);    // the line breaks
        // the shield FRACTURES first — cracks race outward, shards spin away
        this.cracks.push({ idx, t: 0, dur: RM.matches ? 14 : 36, seed: idx * 131 + 17 });
        const shc = (unit && unit.owner === 'player') ? [PAL.A, PAL.Adk, PAL.Alt] : [PAL.B, PAL.Bdk, PAL.Blt];
        const nSh = RM.matches ? 3 : 8;
        for (let i = 0; i < nSh; i++) this.parts.push(new Particle(c.x, c.y, {
          color: shc[i % 3], shape: 'shard', spd: 1.2 + Math.random() * 2.8,
          lift: 1.7, ay: 0.20, decay: 0.016 + Math.random() * 0.012,
          size: this.tile * (0.045 + Math.random() * 0.05) }));
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
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
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

      // enemy watch-fires still burning on the far plain (right gutter,
      // opposite the risen sun) — each flickers on its own rhythm
      this.fires = [];
      const fgut = this.ox - this.frameW;
      if (fgut > 72) {
        const fr = mulberry(88991);
        for (let i = 0; i < 4; i++) {
          const depth = fr();                              // 0 = far, 1 = near
          this.fires.push({
            x: W - fgut + 14 + fr() * (fgut - 40),
            y: this.horizonY + 10 + depth * Math.max(26, (H - this.horizonY) * 0.42),
            s: 0.5 + depth * 0.9, ph: fr() * 6.283, sp: 0.8 + fr() * 1.3,
          });
        }
      }

      // cinematic vignette, cached per layout
      const vg = this.ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.42, W / 2, H / 2, Math.max(W, H) * 0.72);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.40)');
      this._vig = vg;

      // battle debris half-buried in the plain flanking the plinth
      const db = mulberry(553311);
      this.debris = [];
      const gut = this.ox - this.frameW;
      if (gut > 64) {
        for (let k = 0; k < 10; k++) {
          const gx = 12 + db() * (gut - 42);
          const gy = this.horizonY + 22 + db() * Math.max(30, H - this.horizonY - 44);
          this.debris.push({
            x: (k % 2 === 0) ? gx : W - gx - 14, y: gy,
            kind: k % 3, a: 0.2 + db() * 0.2, s: 0.55 + db() * 0.8, rot: (db() - 0.5) * 1.1,
          });
        }
      }

      // repaint the cached plinth + marble board layer at the new size
      this._paintBoardLayer();
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
      for (let i = this.volleys.length - 1; i >= 0; i--) {
        const v = this.volleys[i]; v.t += dt;
        if (v.t >= v.dur) {   // the shaft strikes home — a spit of sparks
          const nS = RM.matches ? 2 : 5;
          for (let k = 0; k < nS; k++) this.parts.push(new Particle(v.b.x, v.b.y, {
            color: k % 2 ? PAL.goldHi : '#ffd98a', spd: 1 + Math.random() * 2.4, lift: 0.8,
            decay: 0.04 + Math.random() * 0.03, size: 1 + Math.random() * 1.6 }));
          this.volleys.splice(i, 1);
        }
      }
      for (let i = this.ripples.length - 1; i >= 0; i--) { this.ripples[i].t += dt; if (this.ripples[i].t > 56) this.ripples.splice(i, 1); }
      for (let i = this.fades.length - 1; i >= 0; i--) { this.fades[i].t += dt; if (this.fades[i].t >= this.fades[i].dur) this.fades.splice(i, 1); }
      for (let i = this.cracks.length - 1; i >= 0; i--) { this.cracks[i].t += dt; if (this.cracks[i].t >= this.cracks[i].dur) this.cracks.splice(i, 1); }
      for (const sc of this.scars) sc.t += dt;
      for (let i = this.puffs.length - 1; i >= 0; i--) { this.puffs[i].t += dt; if (this.puffs[i].t >= this.puffs[i].dur) this.puffs.splice(i, 1); }
      if (this.spot) { this.spot.t += dt; if (this.spot.t >= this.spot.dur) this.spot = null; }
      // turn-tide edge light eases toward whichever side holds the initiative
      const act = this.state.placement ? (this.state.placeSide || 'player') : this.state.turn;
      const k = Math.min(1, 0.09 * dt);
      this.glowP += ((act === 'player' ? 1 : 0) - this.glowP) * k;
      this.glowA += ((act === 'ai' ? 1 : 0) - this.glowA) * k;
      if (!RM.matches) for (const b of this.birds) b.ph += b.sp * dt;
      for (let i = this.glides.length - 1; i >= 0; i--) {
        const g = this.glides[i]; g.t += dt;
        if (g.t >= g.dur) {
          const cb = g.cb;
          // sandals / hooves bite the slab — a ring of dust marks the halt
          const dc = this._cellCenter(g.to);
          this.puffs.push({ x: dc.x, y: dc.y + this.tile * 0.26, t: 0, dur: 22 });
          const nD = RM.matches ? 2 : (g.gallop ? 8 : 5);
          for (let d = 0; d < nD; d++) this.parts.push(new Particle(dc.x + (Math.random() - .5) * this.tile * 0.3, dc.y + this.tile * 0.28, {
            color: '#8a6a4a', spd: 0.5 + Math.random() * 1.2, ang: Math.PI * (1 + (Math.random() - .5) * 0.9),
            grav: false, decay: 0.045 + Math.random() * 0.03, size: 1.5 + Math.random() * 2.2, lift: 0 }));
          this.glides.splice(i, 1); if (cb) cb();
        }
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
      this._active = this.state.placement ? (this.state.placeSide || 'player') : this.state.turn;
      this._drawBackdrop();
      for (const m of this.motes) { ctx.globalAlpha = m.a; ctx.fillStyle = m.c; ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1;

      let sx = 0, sy = 0;
      if (this.shakeAmt > 0) { const m = this.shakeMag * this.shakeAmt; sx = (Math.random() - .5) * 2 * m; sy = (Math.random() - .5) * 2 * m; }
      ctx.save(); ctx.translate(sx, sy);

      this._drawBoard();
      this._drawTerrain();
      this._drawScars();
      this._drawHighlights();
      this._drawRipples();
      this._drawUnits();
      this._drawVolleys();
      this._drawCracks();
      this._drawFlares();
      this._drawPuffs();
      this._drawParticles();
      this._drawSpot();
      ctx.restore();

      // cinematic vignette pulls the eye to the battlefield
      if (this._vig) { ctx.fillStyle = this._vig; ctx.fillRect(0, 0, W, H); }
      // warm bronze flash on impact
      if (this.flash > 0) {
        ctx.fillStyle = `rgba(255,205,140,${(this.flash * 0.11).toFixed(3)})`;
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
      // dawn strata raking the plain — low light catches each rise of ground,
      // shadow pools behind it, so the field reads as earth instead of void
      for (let sb = 0; sb < 3; sb++) {
        const sy = hor + (H - hor) * (0.20 + sb * 0.26);
        const sg = ctx.createLinearGradient(0, sy - 12, 0, sy + 12);
        sg.addColorStop(0, 'rgba(255,170,90,0)');
        sg.addColorStop(0.42, `rgba(255,170,90,${(0.035 - sb * 0.008).toFixed(3)})`);
        sg.addColorStop(0.58, `rgba(6,3,1,${(0.20 - sb * 0.04).toFixed(3)})`);
        sg.addColorStop(1, 'rgba(6,3,1,0)');
        ctx.fillStyle = sg; ctx.fillRect(0, sy - 12, W, 24);
      }
      // enemy watch-fires — sparks of the opposing camp, each breathing on
      // its own rhythm, throwing a warm pool onto the dust and a smoke wisp
      for (const f of this.fires) {
        const fl = RM.matches ? 0.7
          : 0.55 + 0.45 * Math.sin(this.phase * 5.1 * f.sp + f.ph) * (0.6 + 0.4 * Math.sin(this.phase * 13.7 * f.sp + f.ph * 2.3));
        const R = (6 + f.s * 10) * (0.85 + fl * 0.3);
        const g0 = ctx.createRadialGradient(f.x, f.y, 0.5, f.x, f.y, R);
        g0.addColorStop(0, `rgba(255,190,110,${(0.30 + fl * 0.25).toFixed(3)})`);
        g0.addColorStop(0.4, `rgba(230,120,50,${(0.10 + fl * 0.08).toFixed(3)})`);
        g0.addColorStop(1, 'rgba(230,120,50,0)');
        ctx.fillStyle = g0; ctx.beginPath(); ctx.arc(f.x, f.y, R, 0, 6.283); ctx.fill();
        // ground bounce — firelight pooling on the earth beneath
        ctx.fillStyle = `rgba(255,160,80,${(0.05 + fl * 0.04).toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(f.x, f.y + 2.5, R * 0.9, R * 0.30, 0, 0, 6.283); ctx.fill();
        // the flame itself
        ctx.fillStyle = `rgba(255,214,140,${(0.55 + fl * 0.4).toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(f.x, f.y - 1, 1.1 * f.s + 0.4, (2.1 + fl * 1.4) * f.s, 0, 0, 6.283); ctx.fill();
        // smoke wisp leaning with the dawn wind
        const sw = RM.matches ? 2 : Math.sin(this.phase * 0.7 + f.ph) * 6;
        ctx.strokeStyle = `rgba(150,120,100,${(0.05 + fl * 0.035).toFixed(3)})`;
        ctx.lineWidth = 1.6 * f.s; ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(f.x, f.y - 3);
        ctx.quadraticCurveTo(f.x + 4 + sw, f.y - 14 * f.s - 6, f.x + 10 + sw * 1.6, f.y - 26 * f.s - 8);
        ctx.stroke();
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
      // battle debris half-buried where the armies passed — fallen spears,
      // a shield boss breaking the dust, scattered stones catching the dawn
      for (const d of this.debris) {
        ctx.save(); ctx.translate(d.x, d.y); ctx.rotate(d.rot); ctx.globalAlpha = d.a;
        if (d.kind === 0) {          // fallen spear
          ctx.strokeStyle = '#6d5426'; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(-16 * d.s, 0); ctx.lineTo(13 * d.s, 0); ctx.stroke();
          ctx.fillStyle = '#8a713a';
          ctx.beginPath(); ctx.moveTo(13 * d.s, 0); ctx.lineTo(18 * d.s, -2.4 * d.s); ctx.lineTo(18.5 * d.s, 1.6 * d.s); ctx.closePath(); ctx.fill();
        } else if (d.kind === 1) {   // half-buried shield boss
          ctx.strokeStyle = '#6a5530'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(0, 0, 7 * d.s, Math.PI, 6.283); ctx.stroke();
          ctx.strokeStyle = 'rgba(255,214,150,0.55)'; ctx.lineWidth = 1.2;
          ctx.beginPath(); ctx.arc(0, 0, 7 * d.s, Math.PI * 1.12, Math.PI * 1.5); ctx.stroke();
        } else {                     // stones
          ctx.fillStyle = '#241a10';
          ctx.beginPath(); ctx.ellipse(-3 * d.s, 0, 3.4 * d.s, 2.2 * d.s, 0.3, 0, 6.283); ctx.fill();
          ctx.beginPath(); ctx.ellipse(4 * d.s, 1.5 * d.s, 2.3 * d.s, 1.6 * d.s, -0.2, 0, 6.283); ctx.fill();
          ctx.fillStyle = 'rgba(255,214,150,0.12)';
          ctx.beginPath(); ctx.ellipse(-3.6 * d.s, -0.9 * d.s, 1.7 * d.s, 0.8 * d.s, 0.3, 0, 6.283); ctx.fill();
        }
        ctx.restore();
      }
      ctx.globalAlpha = 1;
    }

    // one repeat-unit Greek-key strip, drawn horizontally from (0,0)
    _meanderStrip(ctx, len, u, alpha) {
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

    // per-frame board pass: blit the cached static layer, then the live
    // war-drum pulse — on impact the bronze frame itself rings with light
    _drawBoard() {
      const ctx = this.ctx, F = this.frameW;
      if (this._boardLayer) ctx.drawImage(this._boardLayer, 0, 0, this.W, this.H);
      // turn-tide light — the active side's home rampart smoulders in its
      // colour, cross-fading as command changes hands (eased in _update)
      const breathe = RM.matches ? 1 : 0.82 + 0.18 * Math.sin(this.phase * 2.3);
      const bandH = this.tile * 1.35;
      if (this.glowP > 0.02) {
        const a = this.glowP * breathe;
        const g = ctx.createLinearGradient(0, this.oy + this.board - bandH, 0, this.oy + this.board);
        g.addColorStop(0, 'rgba(94,168,216,0)');
        g.addColorStop(1, `rgba(94,168,216,${(a * 0.11).toFixed(3)})`);
        ctx.fillStyle = g; ctx.fillRect(this.ox, this.oy + this.board - bandH, this.board, bandH);
        ctx.save();
        ctx.strokeStyle = `rgba(122,190,232,${(a * 0.55).toFixed(3)})`; ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(94,168,216,0.8)'; ctx.shadowBlur = 12 * a;
        ctx.beginPath(); ctx.moveTo(this.ox + 2, this.oy + this.board - 1); ctx.lineTo(this.ox + this.board - 2, this.oy + this.board - 1); ctx.stroke();
        ctx.restore();
      }
      if (this.glowA > 0.02) {
        const a = this.glowA * breathe;
        const g = ctx.createLinearGradient(0, this.oy + bandH, 0, this.oy);
        g.addColorStop(0, 'rgba(217,105,74,0)');
        g.addColorStop(1, `rgba(217,105,74,${(a * 0.11).toFixed(3)})`);
        ctx.fillStyle = g; ctx.fillRect(this.ox, this.oy, this.board, bandH);
        ctx.save();
        ctx.strokeStyle = `rgba(240,150,116,${(a * 0.55).toFixed(3)})`; ctx.lineWidth = 2;
        ctx.shadowColor = 'rgba(217,105,74,0.8)'; ctx.shadowBlur = 12 * a;
        ctx.beginPath(); ctx.moveTo(this.ox + 2, this.oy + 1); ctx.lineTo(this.ox + this.board - 2, this.oy + 1); ctx.stroke();
        ctx.restore();
      }
      if (this.flash > 0.02) {
        ctx.save();
        ctx.strokeStyle = `rgba(240,200,120,${(this.flash * 0.5).toFixed(3)})`;
        ctx.lineWidth = 1.5 + this.flash * 2.5;
        ctx.shadowColor = 'rgba(240,180,90,0.9)'; ctx.shadowBlur = 20 * this.flash;
        ctx.strokeRect(this.ox - F, this.oy - F, this.board + F * 2, this.board + F * 2);
        ctx.restore();
      }
    }

    // everything about the plinth and the marble slabs is static per layout,
    // so it is painted ONCE into an offscreen layer (cheaper per frame and it
    // lets us afford real marbling: veins, per-slab dawn lighting, relief
    // bevels and a grounding shadow thrown onto the plain)
    _paintBoardLayer() {
      const W = this.W, H = this.H;
      if (!W || !H) return;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      const cv = document.createElement('canvas');
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
      const ctx = cv.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const t = this.tile, F = this.frameW;

      // grounding: the plinth throws a soft dawn shadow onto the plain
      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.62)'; ctx.shadowBlur = 28; ctx.shadowOffsetY = 14;
      ctx.fillStyle = '#15100a';
      ctx.fillRect(this.ox - F, this.oy - F, this.board + F * 2, this.board + F * 2);
      ctx.restore();

      // bronze plinth frame — brushed metal with a sun-warmed western edge
      const fg = ctx.createLinearGradient(0, this.oy - F, 0, this.oy + this.board + F);
      fg.addColorStop(0, '#2b1e10'); fg.addColorStop(.3, '#15100a'); fg.addColorStop(.62, '#191208'); fg.addColorStop(1, '#241811');
      ctx.fillStyle = fg;
      ctx.fillRect(this.ox - F, this.oy - F, this.board + F * 2, this.board + F * 2);
      const fk = ctx.createLinearGradient(this.ox - F, 0, this.ox + this.board * 0.5, 0);
      fk.addColorStop(0, 'rgba(255,178,92,0.10)'); fk.addColorStop(1, 'rgba(255,178,92,0)');
      ctx.fillStyle = fk;
      ctx.fillRect(this.ox - F, this.oy - F, this.board * 0.5 + F, this.board + F * 2);
      // gold hairlines
      ctx.strokeStyle = 'rgba(201,164,74,0.5)'; ctx.lineWidth = 1.5;
      ctx.strokeRect(this.ox - 2.5, this.oy - 2.5, this.board + 5, this.board + 5);
      ctx.strokeStyle = 'rgba(201,164,74,0.22)'; ctx.lineWidth = 1;
      ctx.strokeRect(this.ox - F + 1.5, this.oy - F + 1.5, this.board + F * 2 - 3, this.board + F * 2 - 3);
      // Greek-key meander on all four sides
      const u = Math.max(5, F * 0.62), m = F / 2 + 0.5;
      ctx.save(); ctx.translate(this.ox, this.oy - m); this._meanderStrip(ctx, this.board, u, 0.28); ctx.restore();
      ctx.save(); ctx.translate(this.ox + this.board, this.oy + this.board + m); ctx.rotate(Math.PI); this._meanderStrip(ctx, this.board, u, 0.28); ctx.restore();
      ctx.save(); ctx.translate(this.ox - m, this.oy + this.board); ctx.rotate(-Math.PI / 2); this._meanderStrip(ctx, this.board, u, 0.28); ctx.restore();
      ctx.save(); ctx.translate(this.ox + this.board + m, this.oy); ctx.rotate(Math.PI / 2); this._meanderStrip(ctx, this.board, u, 0.28); ctx.restore();
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
        ctx.fillStyle = `rgba(232,210,170,${(0.02 + seed.tone * 0.08).toFixed(3)})`;
        ctx.fillRect(x, y, t, t);
        // dawn strikes every slab from the west — warm lip, cool foot
        const lg = ctx.createLinearGradient(x, y, x + t, y + t * 0.7);
        lg.addColorStop(0, 'rgba(255,196,124,0.07)');
        lg.addColorStop(0.55, 'rgba(255,196,124,0)');
        lg.addColorStop(1, 'rgba(12,16,30,0.10)');
        ctx.fillStyle = lg; ctx.fillRect(x, y, t, t);
        // zone tint
        ctx.fillStyle = r < 3 ? 'rgba(217,105,74,0.075)' : 'rgba(94,168,216,0.075)';
        ctx.fillRect(x, y, t, t);
        // marble veining — a light stratum and a shadow stratum per slab
        ctx.lineWidth = 1;
        ctx.strokeStyle = `rgba(238,222,190,${(0.07 + seed.a2 * 0.06).toFixed(3)})`;
        const vy = y + t * (0.18 + seed.a1 * 0.6);
        ctx.beginPath();
        ctx.moveTo(x + 1, vy);
        ctx.bezierCurveTo(x + t * 0.3, vy + (seed.a3 - 0.5) * t * 0.3,
                          x + t * 0.62, vy + (seed.a4 - 0.5) * t * 0.34,
                          x + t - 1, vy + (seed.a2 - 0.5) * t * 0.24);
        ctx.stroke();
        ctx.strokeStyle = `rgba(14,10,6,${(0.09 + seed.a4 * 0.08).toFixed(3)})`;
        const vy2 = y + t * (0.34 + seed.a4 * 0.5);
        ctx.beginPath();
        ctx.moveTo(x + 1, vy2);
        ctx.quadraticCurveTo(x + t * (0.3 + seed.a1 * 0.4), vy2 + (seed.a2 - 0.5) * t * 0.4,
                             x + t - 1, vy2 + (seed.a3 - 0.5) * t * 0.3);
        ctx.stroke();
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
        // relief bevel — lit top edge, shade pooling at the foot
        ctx.strokeStyle = 'rgba(255,236,200,0.06)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(x + 1, y + 1); ctx.lineTo(x + t - 1, y + 1); ctx.stroke();
        ctx.strokeStyle = 'rgba(0,0,0,0.28)';
        ctx.beginPath(); ctx.moveTo(x + 1, y + t - .5); ctx.lineTo(x + t - 1, y + t - .5); ctx.stroke();
        ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 1; ctx.strokeRect(x + .5, y + .5, t - 1, t - 1);
        // inner bevel
        ctx.strokeStyle = 'rgba(201,164,74,0.05)'; ctx.strokeRect(x + 2.5, y + 2.5, t - 5, t - 5);
      }
      // one broad shaft of dawn falls across the whole formation
      const shaft = ctx.createLinearGradient(this.ox, this.oy, this.ox + this.board, this.oy + this.board * 0.8);
      shaft.addColorStop(0, 'rgba(255,190,116,0.055)');
      shaft.addColorStop(0.5, 'rgba(255,190,116,0)');
      shaft.addColorStop(1, 'rgba(16,22,40,0.07)');
      ctx.fillStyle = shaft; ctx.fillRect(this.ox, this.oy, this.board, this.board);
      // centre no-man's-land line
      ctx.strokeStyle = 'rgba(201,164,74,0.3)'; ctx.lineWidth = 1.5; ctx.setLineDash([5, 6]);
      const my = this.oy + 3 * t; ctx.beginPath(); ctx.moveTo(this.ox, my); ctx.lineTo(this.ox + this.board, my); ctx.stroke();
      ctx.setLineDash([]);
      this._boardLayer = cv;
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
          // the rise catches the dawn: lit crown, shade sliding off its east foot
          const hg = ctx.createRadialGradient(cx - s * 0.12, cy - s * 0.12, 1, cx, cy, s * 0.62);
          hg.addColorStop(0, 'rgba(255,196,110,0.13)');
          hg.addColorStop(0.55, 'rgba(255,196,110,0.03)');
          hg.addColorStop(1, 'rgba(8,5,2,0.16)');
          ctx.fillStyle = hg; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          // the λόφος itself — stacked terraces in 3/4 dawn light: every shelf
          // is a full ellipse whose west brow burns while its east foot sinks
          // into its own shade, so the mound reads as MASS instead of contour
          const sd = this.tileSeeds[i];
          for (let k = 2; k >= 0; k--) {
            const rr = s * (0.150 + k * 0.105) * (0.96 + sd.a2 * 0.08);
            const ty = cy + s * 0.075 + (k - 1) * s * 0.075;
            const tg = ctx.createLinearGradient(cx - rr, 0, cx + rr, 0);
            tg.addColorStop(0, `rgba(172,130,58,${(0.34 - k * 0.05).toFixed(3)})`);
            tg.addColorStop(0.55, `rgba(104,78,34,${(0.30 - k * 0.04).toFixed(3)})`);
            tg.addColorStop(1, `rgba(30,21,9,${(0.40 - k * 0.03).toFixed(3)})`);
            ctx.fillStyle = tg;
            ctx.beginPath(); ctx.ellipse(cx, ty, rr, rr * 0.52, 0, 0, 6.283); ctx.fill();
            // dawn brow along the west rim…
            ctx.strokeStyle = `rgba(255,206,128,${(0.34 - k * 0.08).toFixed(3)})`; ctx.lineWidth = 1.4;
            ctx.beginPath(); ctx.ellipse(cx, ty, rr, rr * 0.52, 0, Math.PI * 0.92, Math.PI * 1.72); ctx.stroke();
            // …shade pooling under the east lip
            ctx.strokeStyle = `rgba(8,5,2,${(0.36 - k * 0.06).toFixed(3)})`; ctx.lineWidth = 1.2;
            ctx.beginPath(); ctx.ellipse(cx, ty + 0.6, rr, rr * 0.52, 0, Math.PI * 0.06, Math.PI * 0.86); ctx.stroke();
          }
          // sun-struck crown stone, anchored by the shadow it throws east
          ctx.fillStyle = 'rgba(8,5,2,0.30)';
          ctx.beginPath(); ctx.ellipse(cx + s * 0.022, cy - s * 0.028, s * 0.075, s * 0.030, 0, 0, 6.283); ctx.fill();
          ctx.fillStyle = 'rgba(255,214,140,0.50)';
          ctx.beginPath(); ctx.ellipse(cx - s * 0.012, cy - s * 0.048, s * 0.065, s * 0.030, -0.18, 0, 6.283); ctx.fill();
        } else if (kind === 'pass') {
          // the στενό — a true mountain defile: twin jagged cliff walls crowd
          // the slab and a thread of dawn runs the gauntlet between them
          const sd = this.tileSeeds[i];
          ctx.fillStyle = 'rgba(52,40,24,0.45)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          // low light spilling down the corridor — soft-shouldered, brightest
          // where the path runs
          const cg = ctx.createLinearGradient(x, 0, x + s, 0);
          cg.addColorStop(0, 'rgba(255,196,110,0)');
          cg.addColorStop(0.32, 'rgba(255,196,110,0.03)');
          cg.addColorStop(0.5, 'rgba(255,196,110,0.13)');
          cg.addColorStop(0.68, 'rgba(255,196,110,0.03)');
          cg.addColorStop(1, 'rgba(255,196,110,0)');
          ctx.fillStyle = cg; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          // the worn footpath countless sandals have ground into the defile
          ctx.strokeStyle = 'rgba(220,190,140,0.10)'; ctx.lineWidth = Math.max(2, s * 0.05); ctx.lineCap = 'round';
          ctx.beginPath();
          ctx.moveTo(cx + (sd.a1 - 0.5) * s * 0.10, y + 3);
          ctx.quadraticCurveTo(cx + (sd.a2 - 0.5) * s * 0.22, cy, cx + (sd.a3 - 0.5) * s * 0.10, y + s - 3);
          ctx.stroke();
          // twin cliffs: the west wall shades its own inner face while the
          // east wall's lip catches the risen sun full on
          [{ bx: x + 1, dir: 1, js: sd.a1, lit: false }, { bx: x + s - 1, dir: -1, js: sd.a3, lit: true }].forEach(w => {
            const wallW = s * (0.26 + w.js * 0.05);
            const jag = k => w.bx + w.dir * wallW * (0.66 + 0.34 * Math.abs(Math.sin(w.js * 9.3 + k * 2.17)));
            // the west wall throws its shade eastward across the floor
            if (!w.lit) {
              const shW = s * 0.14;
              const sg2 = ctx.createLinearGradient(w.bx + wallW, 0, w.bx + wallW + shW, 0);
              sg2.addColorStop(0, 'rgba(0,0,0,0.30)'); sg2.addColorStop(1, 'rgba(0,0,0,0)');
              ctx.fillStyle = sg2; ctx.fillRect(w.bx + wallW - 1, y + 1, shW + 1, s - 2);
            }
            const rg = ctx.createLinearGradient(w.bx, 0, w.bx + w.dir * wallW, 0);
            rg.addColorStop(0, '#2a1f10'); rg.addColorStop(1, '#140d06');
            ctx.fillStyle = rg;
            ctx.beginPath(); ctx.moveTo(w.bx, y + 1);
            for (let k = 0; k <= 4; k++) ctx.lineTo(jag(k), y + 1 + (s - 2) * (k / 4));
            ctx.lineTo(w.bx, y + s - 1); ctx.closePath(); ctx.fill();
            // inner lip — dawn-gilded on the east wall, cool drop on the west
            ctx.strokeStyle = w.lit ? 'rgba(255,206,128,0.34)' : 'rgba(0,0,0,0.45)';
            ctx.lineWidth = w.lit ? 1.5 : 2; ctx.lineCap = 'round';
            ctx.beginPath();
            for (let k = 0; k <= 4; k++) { const jx = jag(k), jy = y + 1 + (s - 2) * (k / 4); k ? ctx.lineTo(jx, jy) : ctx.moveTo(jx, jy); }
            ctx.stroke();
            if (!w.lit) {   // the shaded crest still catches a whisper of sky
              ctx.strokeStyle = 'rgba(255,196,124,0.12)'; ctx.lineWidth = 1;
              ctx.beginPath();
              for (let k = 0; k <= 4; k++) { const jx = jag(k) - 1.4, jy = y + 1 + (s - 2) * (k / 4); k ? ctx.lineTo(jx, jy) : ctx.moveTo(jx, jy); }
              ctx.stroke();
            }
            // scree crumbled at the wall's foot, spilling into the corridor
            ctx.fillStyle = 'rgba(16,11,6,0.75)';
            for (let k = 0; k < 3; k++) {
              const ry2 = y + s * (0.18 + ((w.js * 7 + k * 2.6) % 1) * 0.64);
              const rx2 = jag(k + 0.5) + w.dir * 2.2;
              ctx.beginPath(); ctx.ellipse(rx2, ry2, 1.6 + k * 0.5, 1.1 + k * 0.3, w.js * 3, 0, 6.283); ctx.fill();
            }
          });
        } else if (kind === 'ford') {
          ctx.fillStyle = 'rgba(46,111,148,0.32)'; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          // mid-stream runs deep — a cool trench across the crossing
          const dg2 = ctx.createLinearGradient(0, y, 0, y + s);
          dg2.addColorStop(0, 'rgba(10,24,38,0)');
          dg2.addColorStop(0.5, 'rgba(10,24,38,0.30)');
          dg2.addColorStop(1, 'rgba(10,24,38,0)');
          ctx.fillStyle = dg2; ctx.fillRect(x + 1, y + 1, s - 2, s - 2);
          // sandy banks lip the entry and exit of the wade
          ctx.strokeStyle = 'rgba(196,164,110,0.22)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(x + 3, y + 2.6); ctx.lineTo(x + s - 3, y + 2.6); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(x + 3, y + s - 2.6); ctx.lineTo(x + s - 3, y + s - 2.6); ctx.stroke();
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
          // contact shadow grounds the monolith; the crag is a MASS, not a hole
          ctx.fillStyle = 'rgba(0,0,0,0.55)';
          ctx.beginPath(); ctx.ellipse(cx + s * 0.06, cy + s * 0.30, s * 0.36, s * 0.09, 0, 0, 6.283); ctx.fill();
          ctx.fillStyle = '#2c2013';
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.3, cy + s * 0.28); ctx.lineTo(cx - s * 0.18, cy - s * 0.12);
          ctx.lineTo(cx + s * 0.04, cy - s * 0.3); ctx.lineTo(cx + s * 0.26, cy - s * 0.06);
          ctx.lineTo(cx + s * 0.32, cy + s * 0.28); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = 'rgba(201,164,74,0.20)'; ctx.lineWidth = 1; ctx.stroke();
          // dawn strikes the west face full on…
          ctx.fillStyle = 'rgba(255,178,92,0.11)';
          ctx.beginPath();
          ctx.moveTo(cx - s * 0.3, cy + s * 0.28); ctx.lineTo(cx - s * 0.18, cy - s * 0.12);
          ctx.lineTo(cx + s * 0.04, cy - s * 0.3); ctx.lineTo(cx - s * 0.02, cy + s * 0.1);
          ctx.closePath(); ctx.fill();
          // …while the east face falls into its own shade
          ctx.fillStyle = 'rgba(4,2,1,0.4)';
          ctx.beginPath();
          ctx.moveTo(cx + s * 0.26, cy - s * 0.06); ctx.lineTo(cx + s * 0.32, cy + s * 0.28);
          ctx.lineTo(cx + s * 0.06, cy + s * 0.28); ctx.lineTo(cx + s * 0.1, cy - s * 0.02);
          ctx.closePath(); ctx.fill();
          // sun-lit ridgeline
          ctx.strokeStyle = 'rgba(255,214,150,0.28)'; ctx.lineWidth = 1.2; ctx.beginPath();
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
          // gilt leading edge on the wavefront — the rank visibly dresses
          if (local < 5) {
            ctx.strokeStyle = `rgba(${r.rgb[0]},${r.rgb[1]},${r.rgb[2]},${Math.min(0.5, a * 1.8).toFixed(3)})`;
            ctx.lineWidth = 1.2;
            ctx.strokeRect(x + 2, y + 2, s - 4, s - 4);
          }
        }
      }
    }

    // wreckage where a warrior fell — a toppled shield half-sunk in dust, a
    // snapped spear, a scorch of churned earth. The gap in the line STAYS.
    _drawScars() {
      if (!this.scars.length) return;
      const ctx = this.ctx, t = this.tile;
      for (const sc of this.scars) {
        const life = sc.t - sc.delay;
        if (life <= 0) continue;
        const a = Math.min(1, life / 18);          // eases in as the shade departs
        const c = this._cellCenter(sc.idx);
        const rnd = mulberry(sc.seed);
        const rgb = sc.owner === 'player' ? '46,111,148' : '154,68,40';
        const rot = (rnd() - 0.5) * 1.3, ox = (rnd() - 0.5) * t * 0.2, oy = (rnd() - 0.3) * t * 0.16;
        ctx.save(); ctx.translate(c.x + ox, c.y + t * 0.14 + oy); ctx.rotate(rot);
        // churned earth
        ctx.fillStyle = `rgba(6,4,2,${(a * 0.32).toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(0, 0, t * 0.30, t * 0.13, 0, 0, 6.283); ctx.fill();
        // the fallen shield, face-down, its rim catching a little dawn
        ctx.fillStyle = `rgba(${rgb},${(a * 0.38).toFixed(3)})`;
        ctx.beginPath(); ctx.ellipse(-t * 0.06, -t * 0.02, t * 0.17, t * 0.085, 0.25, 0, 6.283); ctx.fill();
        ctx.strokeStyle = `rgba(201,164,74,${(a * 0.30).toFixed(3)})`; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.ellipse(-t * 0.06, -t * 0.02, t * 0.17, t * 0.085, 0.25, Math.PI * 0.9, Math.PI * 1.9); ctx.stroke();
        // snapped spear — two splinters out of true
        ctx.strokeStyle = `rgba(109,84,38,${(a * 0.55).toFixed(3)})`; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(t * 0.02, t * 0.05); ctx.lineTo(t * 0.16, t * 0.015); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(t * 0.19, 0); ctx.lineTo(t * 0.28, -t * 0.03); ctx.stroke();
        ctx.fillStyle = `rgba(138,113,58,${(a * 0.5).toFixed(3)})`;
        ctx.beginPath(); ctx.moveTo(t * 0.28, -t * 0.03); ctx.lineTo(t * 0.335, -t * 0.055); ctx.lineTo(t * 0.335, -t * 0.02); ctx.closePath(); ctx.fill();
        ctx.restore();
      }
    }

    // dust ring where a march halts — the rank plants its feet
    _drawPuffs() {
      if (!this.puffs.length) return;
      const ctx = this.ctx;
      for (const pf of this.puffs) {
        const p = Math.min(1, pf.t / pf.dur);
        const e = 1 - Math.pow(1 - p, 3);          // ease-out bloom
        const r = this.tile * (0.12 + e * 0.30);
        const a = (1 - p) * 0.28;
        ctx.strokeStyle = `rgba(190,158,116,${a.toFixed(3)})`;
        ctx.lineWidth = 1.6 * (1 - p) + 0.4;
        ctx.beginPath(); ctx.ellipse(pf.x, pf.y, r, r * 0.38, 0, 0, 6.283); ctx.stroke();
      }
    }

    // cinematic iris: while spears cross, dusk closes around the duel
    _drawSpot() {
      if (!this.spot) return;
      const ctx = this.ctx;
      const p = Math.min(1, this.spot.t / this.spot.dur);
      const a = Math.sin(Math.PI * p) * (RM.matches ? 0.15 : 0.28);
      if (a <= 0.01) return;
      const c = this._cellCenter(this.spot.idx);
      const g = ctx.createRadialGradient(c.x, c.y, this.tile * 1.05, c.x, c.y, this.tile * 3.1);
      g.addColorStop(0, 'rgba(4,2,1,0)');
      g.addColorStop(1, `rgba(4,2,1,${a.toFixed(3)})`);
      ctx.fillStyle = g;
      ctx.fillRect(-24, -24, this.W + 48, this.H + 48);
    }

    // a wrong answer SPLITS the shield: dark fissures with dawn-lit lips race
    // out from the point of impact, lingering over the sinking shade
    _drawCracks() {
      if (!this.cracks.length) return;
      const ctx = this.ctx;
      for (const cr of this.cracks) {
        const c = this._cellCenter(cr.idx);
        const p = Math.min(1, cr.t / cr.dur);
        const grow = Math.min(1, p * 2.6);
        const a = p < 0.7 ? 1 : 1 - (p - 0.7) / 0.3;
        const R = this.tile * 0.36 * grow;
        const rnd = mulberry(cr.seed);
        ctx.save(); ctx.translate(c.x, c.y); ctx.lineCap = 'round';
        for (let k = 0; k < 5; k++) {
          const a0 = rnd() * 6.283;
          const l1 = R * (0.45 + rnd() * 0.25), l2 = R * (0.75 + rnd() * 0.25);
          const j1 = (rnd() - 0.5) * 0.9, j2 = (rnd() - 0.5) * 1.6;
          const x1 = Math.cos(a0) * l1, y1 = Math.sin(a0) * l1;
          const x2 = Math.cos(a0 + j1 * 0.4) * l2, y2 = Math.sin(a0 + j1 * 0.4) * l2;
          ctx.strokeStyle = `rgba(8,5,3,${(a * 0.85).toFixed(3)})`; ctx.lineWidth = 2.4;
          ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          ctx.strokeStyle = `rgba(255,240,205,${(a * 0.7).toFixed(3)})`; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(x1 * 0.25, y1 * 0.25); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
          if (k % 2 === 0) {   // side branch
            const bx = Math.cos(a0 + j2) * l2 * 0.5, by = Math.sin(a0 + j2) * l2 * 0.5;
            ctx.strokeStyle = `rgba(8,5,3,${(a * 0.6).toFixed(3)})`; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x1 + bx * 0.5, y1 + by * 0.5); ctx.stroke();
          }
        }
        // hot glow at the break point
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, R * 0.9 + 1);
        g.addColorStop(0, `rgba(255,220,160,${(a * 0.22).toFixed(3)})`);
        g.addColorStop(1, 'rgba(255,220,160,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R * 0.9 + 1, 0, 6.283); ctx.fill();
        ctx.restore();
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
        this._drawUnit(c.x, c.y + sink, this.tile * (1 - e * 0.14), f.unit, 0, f.idx, true);
        ctx.restore();
        ctx.globalAlpha = 1;
      });
      // resting units — subtle idle breathing keeps the ranks alive
      this.state.cells.forEach((cell, i) => {
        if (!cell || sup.has(i)) return;
        const c = this._cellCenter(i);
        const sway = RM.matches ? 0 : Math.sin(this.phase * 1.7 + i * 1.13) * this.tile * 0.018;
        this._drawUnit(c.x, c.y + sway, this.tile, cell, 0, i);
      });
      // gliding units (on top) — they LEAN into the march and, at a gallop,
      // tear past with fading after-images
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
        if (g.gallop && !RM.matches) {
          for (let k = 2; k >= 1; k--) {
            const gt = g.t - k * 3.2;
            if (gt <= 0) continue;
            const gp = ease(Math.min(1, gt / g.dur));
            const gx = lerp(a.x, b.x, gp), gy = lerp(a.y, b.y, gp);
            const gh = Math.sin(gp * Math.PI * 2) * this.tile * 0.10;
            ctx.globalAlpha = k === 1 ? 0.16 : 0.08;
            this._drawUnit(gx, gy - gh, this.tile, g.unit, 1, g.to, true);
            ctx.globalAlpha = 1;
          }
        }
        const dx = b.x - a.x, dy = b.y - a.y, dist = Math.hypot(dx, dy) || 1;
        const lean = Math.sin(p * Math.PI) * ((dx / dist) * 0.11 + (dy / dist) * 0.035);
        ctx.save();
        ctx.translate(x, y - hop); ctx.rotate(lean); ctx.translate(-x, -(y - hop));
        this._drawUnit(x, y - hop, this.tile, g.unit, g.gallop ? 1 : 0.5, g.to);
        ctx.restore();
      });
    }

    // draw one unit figure centred at (cx,cy); seedIdx keys deterministic wear;
    // `dying` suppresses the living under-glow (fades + gallop after-images)
    _drawUnit(cx, cy, t, cell, motion, seedIdx, dying) {
      const ctx = this.ctx;
      const isP = cell.owner === 'player';
      const col = isP ? PAL.A : PAL.B, dk = isP ? PAL.Adk : PAL.Bdk, lt = isP ? PAL.Alt : PAL.Blt;
      const rgb = isP ? '94,168,216' : '217,105,74';
      const s = t * 0.78;
      const x = cx - s / 2, y = cy - s / 2;
      const seed = (seedIdx == null ? 0 : seedIdx);

      // team light pooling under the living — colored bounce off the marble
      if (cell.revealed && !dying) {
        const active = this._active === cell.owner;
        const pulse = (active && !RM.matches) ? 0.05 * (0.5 + 0.5 * Math.sin(this.phase * 3 + seed * 1.7)) : 0;
        const ga = (active ? 0.15 : 0.09) + pulse;
        const ug = ctx.createRadialGradient(cx, cy + s * 0.34, 1, cx, cy + s * 0.34, s * 0.72);
        ug.addColorStop(0, `rgba(${rgb},${ga.toFixed(3)})`);
        ug.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = ug;
        ctx.beginPath(); ctx.ellipse(cx, cy + s * 0.34, s * 0.72, s * 0.30, 0, 0, 6.283); ctx.fill();
      }
      // shadow — the low sun in the western gutter throws every shadow EAST:
      // a long soft cast plus a tight contact pool grounding the figure
      ctx.fillStyle = 'rgba(0,0,0,0.24)'; ctx.beginPath();
      ctx.ellipse(cx + s * 0.30, cy + s * 0.40, s * 0.52, s * 0.105, 0.05, 0, 6.283); ctx.fill();
      ctx.fillStyle = 'rgba(0,0,0,0.44)'; ctx.beginPath();
      ctx.ellipse(cx + s * 0.06, cy + s * 0.40, s * 0.34, s * 0.12, 0, 0, 6.283); ctx.fill();

      // plinth (rounded-square bronze medallion) — dawn-kissed, team-washed
      this._roundRect(x, y, s, s, s * 0.16);
      const pg = ctx.createLinearGradient(x, y, x + s * 0.35, y + s);
      pg.addColorStop(0, '#2b2113'); pg.addColorStop(.5, '#140e08'); pg.addColorStop(1, '#0b0804');
      ctx.fillStyle = pg; ctx.fill();
      if (cell.revealed) {   // a breath of the banner's colour inside the bronze
        const tw = ctx.createRadialGradient(x + s * 0.32, y + s * 0.26, 1, x + s * 0.32, y + s * 0.26, s * 0.95);
        tw.addColorStop(0, `rgba(${rgb},0.16)`); tw.addColorStop(1, `rgba(${rgb},0)`);
        ctx.fillStyle = tw;
        this._roundRect(x, y, s, s, s * 0.16); ctx.fill();
      }
      if (cell.revealed && !dying) {
        ctx.save();
        ctx.shadowColor = `rgba(${rgb},0.55)`; ctx.shadowBlur = s * 0.16;
        ctx.lineWidth = 2; ctx.strokeStyle = col;
        this._roundRect(x, y, s, s, s * 0.16); ctx.stroke();
        ctx.restore();
      } else {
        ctx.lineWidth = 2; ctx.strokeStyle = cell.revealed ? col : 'rgba(201,164,74,0.4)';
        this._roundRect(x, y, s, s, s * 0.16); ctx.stroke();
      }
      // relief bevel — dawn strikes the crown, shade pools at the foot
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = 'rgba(255,236,190,0.14)';
      ctx.beginPath(); ctx.moveTo(x + s * 0.2, y + 2); ctx.lineTo(x + s * 0.8, y + 2); ctx.stroke();
      // sun-side rim — a warm kiss of dawn on the western face
      ctx.strokeStyle = 'rgba(255,196,124,0.18)';
      ctx.beginPath(); ctx.moveTo(x + 1.6, y + s * 0.22); ctx.lineTo(x + 1.6, y + s * 0.8); ctx.stroke();
      ctx.strokeStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath(); ctx.moveTo(x + s * 0.2, y + s - 2); ctx.lineTo(x + s * 0.8, y + s - 2); ctx.stroke();
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
      const R = s * 0.345;
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

    // the arrow in flight: a gold streak on a shallow ballistic arc, trailing
    // light, its head glinting as it tips over toward the mark
    _drawVolleys() {
      if (!this.volleys.length) return;
      const ctx = this.ctx;
      for (const v of this.volleys) {
        const p = ease(Math.min(1, v.t / v.dur));
        const arcH = Math.hypot(v.b.x - v.a.x, v.b.y - v.a.y) * 0.16 + this.tile * 0.1;
        const x = lerp(v.a.x, v.b.x, p);
        const y = lerp(v.a.y, v.b.y, p) - Math.sin(Math.PI * p) * arcH;
        const p2 = ease(Math.min(1, (v.t + 1.2) / v.dur));
        const x2 = lerp(v.a.x, v.b.x, p2);
        const y2 = lerp(v.a.y, v.b.y, p2) - Math.sin(Math.PI * p2) * arcH;
        const ang = Math.atan2(y2 - y, x2 - x || 0.0001);
        ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
        const L = this.tile * 0.36;
        const tg = ctx.createLinearGradient(-L * 1.8, 0, 0, 0);
        tg.addColorStop(0, 'rgba(240,200,120,0)');
        tg.addColorStop(1, 'rgba(255,238,190,0.8)');
        ctx.strokeStyle = tg; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-L * 1.8, 0); ctx.lineTo(-L * 0.1, 0); ctx.stroke();
        ctx.strokeStyle = PAL.gold; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(-L * 0.6, 0); ctx.lineTo(0, 0); ctx.stroke();
        ctx.fillStyle = PAL.goldHi;
        ctx.beginPath(); ctx.moveTo(L * 0.18, 0); ctx.lineTo(-L * 0.07, -L * 0.10); ctx.lineTo(-L * 0.07, L * 0.10); ctx.closePath(); ctx.fill();
        // fletching
        ctx.strokeStyle = 'rgba(255,238,190,0.6)'; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-L * 0.52, -L * 0.08); ctx.lineTo(-L * 0.62, 0); ctx.lineTo(-L * 0.52, L * 0.08); ctx.stroke();
        ctx.restore();
      }
    }

    _drawFlares() {
      if (!this.flares.length) return;
      const ctx = this.ctx;
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      this.flares.forEach(f => {
        const c = this._cellCenter(f.idx); const p = f.t / f.dur;
        const r = this.tile * (0.3 + p * 0.9); const a = (1 - p) * 0.8;
        // war-drum shockwave rolling out across the ranks
        const R2 = this.tile * (0.5 + p * 3.6), a2 = (1 - p) * 0.16;
        ctx.strokeStyle = `rgba(255,214,150,${a2.toFixed(3)})`;
        ctx.lineWidth = 10 * (1 - p) + 1;
        ctx.beginPath(); ctx.arc(c.x, c.y, R2, 0, 6.283); ctx.stroke();
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
        else if (p.shape === 'shard') {   // spinning splinter of a broken shield
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
          const s = p.size;
          ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.8, s * 0.55); ctx.lineTo(-s * 0.66, s * 0.5); ctx.closePath(); ctx.fill();
          ctx.strokeStyle = `rgba(255,240,205,${Math.max(0, p.life * 0.5).toFixed(3)})`;
          ctx.lineWidth = 1; ctx.stroke();
          ctx.restore();
        }
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
