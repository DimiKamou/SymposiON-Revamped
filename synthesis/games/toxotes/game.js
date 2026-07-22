/* ══════════════════ ΤΟΞΟΤΗΣ — engine ══════════════════
   A Duck-Hunt-style archery game: loose arrows at flying amphorae.
   Two modes:
     • ΕΥΣΤΟΧΗ ΒΟΛΗ (True Shot) — four amphorae drift, each carrying an
       answer; shoot the correct one.
     • ΟΜΟΒΡΟΝΤΙΑ (Volley) — answer correctly, then a 10-second window to
       shatter as many amphorae as you can for bonus points.
   Targets react to clicks AND touches. API: Toxotes.open() / .close()

   Presentation layer (TXP, below): procedural moonlit-grove backdrop +
   canvas FX (bow draw, arrow flight/trails, pithos shards, arrow rain)
   + tiny WebAudio flourishes. Pure presentation — gameplay, scoring and
   timers are untouched.
═══════════════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────────────
   TXP — Toxotes presentation layer (canvas backdrop + FX + sfx).
   Owns two pointer-events:none canvases inside #tx-range:
     #tx-bg-canvas (z0)  — moonlit grove: sky, moon, stars, clouds,
                           parallax tree bands, temple, ground.
     #tx-fx-canvas (z5)  — bow (draw/bend/string), arrows + trails,
                           impacts, shards, spills, arrow rain.
   All rAF/observers are torn down in sleep() (called from close()).
──────────────────────────────────────────────────────────────────── */
const TXP = (() => {
  const RM = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } };
  let reduce = RM();
  /* mid/low-end phone heuristic: smaller backing store + thinner particle budget */
  const LITE = matchMedia("(pointer:coarse)").matches || innerWidth < 720 || (navigator.deviceMemory || 8) <= 4;

  /* dom / raf state */
  let range = null, bgC = null, fxC = null, bg = null, fx = null;
  let W = 0, H = 0, DPR = 1, PAD = 28;
  let raf = 0, awake = false, onGame = false, mounted = false;
  let last = 0, T = 0, ro = null, retTimer = 0;

  /* aim + bow */
  let ax = 0, ay = 0, haveAim = false, smx = 0, smy = 0, smInit = false;
  const bow = { ang: -Math.PI / 2, draw: 0.6, oscT: 99, recoil: 0 };

  /* entities */
  let arrows = [], shards = [], drops = [], glints = [], coins = [], puffs = [],
      impacts = [], sparks = [], rains = [], stuck = [], pend = [], rainQueue = [];
  let streaks = [], chunks = [], embers = [], flashes = [];
  let emberAcc = 0;
  let stars = [], flies = [], clouds = [];
  let layers = null, skyGrad = null;
  let volleyOn = false, volleyMix = 0;
  let lastEta = 0, lastEtaAt = -1e9, lastShake = 0;

  /* palette */
  const SIL = (a) => `rgba(201,220,232,${a})`;          // moon silver
  const CREAM = '#EDE2CC', BRONZE = '#C89B4A', TERRA = '#D97B5C';

  /* seeded rand so the grove is stable across resizes */
  function mulberry(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

  const clamp = (v, a, b) => v < a ? a : (v > b ? b : v);
  const lerp = (a, b, k) => a + (b - a) * k;
  function lerpAng(a, b, k) { let d = b - a; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; return a + d * k; }

  /* ── tiny WebAudio synth (lazy, gesture-gated, always guarded) ── */
  const SFX = (() => {
    let ctx = null, master = null;
    const AC = window.AudioContext || window.webkitAudioContext;
    function ac() {
      if (!AC) return null;
      try {
        if (!ctx) { ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.20; master.connect(ctx.destination); }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
      } catch (_) { return null; }
    }
    function env(g, t, a, p, d) { g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(p, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + d); }
    function osc(type, f0, f1, dt, d, p) {
      const c = ac(); if (!c) return; try {
        const t = c.currentTime + (dt || 0), o = c.createOscillator(), g = c.createGain();
        o.type = type; o.frequency.setValueAtTime(f0, t);
        if (f1) o.frequency.exponentialRampToValueAtTime(Math.max(28, f1), t + d);
        env(g, t, 0.005, p, d); o.connect(g); g.connect(master); o.start(t); o.stop(t + d + 0.03);
      } catch (_) {}
    }
    function noise(dt, d, p, fType, f0, f1, q) {
      const c = ac(); if (!c) return; try {
        const t = c.currentTime + (dt || 0), n = Math.max(64, Math.ceil(c.sampleRate * d));
        const buf = c.createBuffer(1, n, c.sampleRate), ch = buf.getChannelData(0);
        for (let i = 0; i < n; i++) ch[i] = Math.random() * 2 - 1;
        const src = c.createBufferSource(); src.buffer = buf;
        const f = c.createBiquadFilter(); f.type = fType || 'bandpass';
        f.frequency.setValueAtTime(f0 || 1200, t);
        if (f1) f.frequency.exponentialRampToValueAtTime(f1, t + d);
        f.Q.value = q || 0.9;
        const g = c.createGain(); env(g, t, 0.004, p, d);
        src.connect(f); f.connect(g); g.connect(master); src.start(t); src.stop(t + d + 0.03);
      } catch (_) {}
    }
    return {
      pluck() { if (!ac()) return; noise(0, 0.05, 0.26, 'highpass', 1900); osc('triangle', 220, 132, 0, 0.15, 0.26); osc('sine', 88, 58, 0, 0.09, 0.22); },
      thunk() { if (!ac()) return; osc('sine', 115, 52, 0, 0.16, 0.5); noise(0, 0.05, 0.32, 'lowpass', 680); },
      crash(kind) {
        if (!ac()) return;
        noise(0, 0.28, 0.42, 'bandpass', 2200, 850, 1.3);
        noise(0.035, 0.12, 0.26, 'bandpass', 3300, 1500, 2.0);
        if (kind === 'gold') { osc('sine', 1318, 0, 0.02, 0.5, 0.14); osc('sine', 1975, 0, 0.10, 0.55, 0.10); }
        else if (kind === 'bad') { osc('sawtooth', 98, 66, 0, 0.28, 0.16); osc('sawtooth', 104, 72, 0, 0.28, 0.13); }
      },
      whoosh() { if (!ac()) return; noise(0, 0.5, 0.26, 'bandpass', 380, 2600, 1.0); osc('sine', 54, 36, 0, 0.42, 0.4); },
      suspend() { try { ctx && ctx.suspend && ctx.suspend(); } catch (_) {} },
    };
  })();

  /* ═════════════ mount / lifecycle ═════════════ */
  function mount() {
    range = document.getElementById('tx-range');
    if (!range || mounted) { if (range) requestSize(); return; }
    mounted = true;
    bgC = document.createElement('canvas'); bgC.id = 'tx-bg-canvas';
    fxC = document.createElement('canvas'); fxC.id = 'tx-fx-canvas';
    range.appendChild(bgC); range.appendChild(fxC);
    bg = bgC.getContext('2d'); fx = fxC.getContext('2d');
    range.addEventListener('pointermove', onAim, { passive: true });
    range.addEventListener('pointerdown', onAim, { passive: true });
    range.addEventListener('pointerleave', () => { haveAim = false; }, { passive: true });
    try { ro = new ResizeObserver(requestSize); ro.observe(range); } catch (_) { window.addEventListener('resize', requestSize); }
    requestSize();
    kick();
  }
  function onAim(e) {
    if (!range) return;
    const r = range.getBoundingClientRect();
    ax = e.clientX - r.left; ay = e.clientY - r.top; haveAim = true;
    if (!smInit) { smx = ax; smy = ay; smInit = true; }
  }
  function requestSize() {
    if (!range || !bgC) return;
    const w = range.clientWidth, h = range.clientHeight;
    if (!w || !h) return;
    if (w === W && h === H && layers) return;
    W = w; H = h; DPR = clamp(window.devicePixelRatio || 1, 1, LITE ? 1.5 : 1.75);
    [bgC, fxC].forEach(c => { c.width = Math.round(W * DPR); c.height = Math.round(H * DPR); });
    bg.setTransform(DPR, 0, 0, DPR, 0, 0); fx.setTransform(DPR, 0, 0, DPR, 0, 0);
    buildScene();
  }
  function wake()  { reduce = RM(); awake = true; kick(); }
  function sleep() {
    awake = false;
    if (raf) { cancelAnimationFrame(raf); raf = 0; }
    if (retTimer) { clearTimeout(retTimer); retTimer = 0; }
    clearAll();
    if (bg) bg.clearRect(0, 0, W, H);
    if (fx) fx.clearRect(0, 0, W, H);
    SFX.suspend();
  }
  function screen(id) {
    onGame = (id === 'tx-screen-game');
    if (!onGame) { clearAll(); if (fx) fx.clearRect(0, 0, W, H); }
    else { requestSize(); }
    kick();
  }
  function calm() {
    /* round/game teardown: drop transient set-pieces, keep ambience */
    pend = []; rains = []; rainQueue = []; stuck = [];
    volleyOn = false;
  }
  function clearAll() {
    arrows = []; shards = []; drops = []; glints = []; coins = []; puffs = [];
    impacts = []; sparks = []; rains = []; stuck = []; pend = []; rainQueue = [];
    streaks = []; chunks = []; embers = []; flashes = []; emberAcc = 0;
    volleyOn = false; volleyMix = 0;
  }
  function kick() {
    if (awake && onGame && mounted && !raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  /* ═════════════ scene pre-render (parallax bands) ═════════════ */
  function off(w, h) { const c = document.createElement('canvas'); c.width = Math.round(w * DPR); c.height = Math.round(h * DPR); const x = c.getContext('2d'); x.setTransform(DPR, 0, 0, DPR, 0, 0); return [c, x]; }

  function buildScene() {
    const rnd = mulberry(20260706);
    const BW = W + PAD * 2;
    skyGrad = bg.createLinearGradient(0, 0, 0, H);
    skyGrad.addColorStop(0, '#060B15');
    skyGrad.addColorStop(0.42, '#0B1620');
    skyGrad.addColorStop(0.72, '#122129');
    skyGrad.addColorStop(1, '#0E1712');

    /* stars */
    stars = [];
    const nS = Math.round(clamp(W * H / 9000, 60, 150));
    for (let i = 0; i < nS; i++) stars.push({
      x: rnd() * W, y: rnd() * H * 0.62, r: 0.4 + rnd() * 1.1,
      b: 0.20 + rnd() * 0.6, sp: 0.6 + rnd() * 2.4, ph: rnd() * 7, big: i < 3,
    });
    /* clouds */
    clouds = [];
    for (let i = 0; i < 3; i++) clouds.push({
      x: rnd() * W, y: H * (0.10 + rnd() * 0.26), w: W * (0.24 + rnd() * 0.2),
      h: 14 + rnd() * 16, sp: 3 + rnd() * 4, a: 0.05 + rnd() * 0.04,
    });
    /* fireflies */
    flies = [];
    for (let i = 0; i < 7; i++) flies.push({
      bx: W * (0.08 + rnd() * 0.84), by: H * (0.58 + rnd() * 0.26),
      axr: 14 + rnd() * 30, ayr: 8 + rnd() * 18,
      sx: 0.25 + rnd() * 0.5, sy: 0.3 + rnd() * 0.5, fs: 0.7 + rnd() * 1.6,
      p1: rnd() * 7, p2: rnd() * 7, p3: rnd() * 7,
    });

    /* soft cloud blob sprite */
    const [blobC, blobX] = off(80, 40);
    const bgr = blobX.createRadialGradient(40, 20, 2, 40, 20, 38);
    bgr.addColorStop(0, 'rgba(175,198,212,0.75)'); bgr.addColorStop(1, 'rgba(175,198,212,0)');
    blobX.fillStyle = bgr; blobX.fillRect(0, 0, 80, 40);

    /* ── far band: hills + temple ── */
    const [farC, fc] = off(BW, H);
    const hillY = H * 0.585;
    fc.fillStyle = '#0B141C';
    fc.beginPath(); fc.moveTo(0, H);
    fc.lineTo(0, hillY + 12);
    for (let x = 0; x <= BW; x += 18) {
      const y = hillY - Math.sin(x / BW * Math.PI * 2.1 + 0.6) * H * 0.045 - Math.sin(x / 61) * 4;
      fc.lineTo(x, y);
    }
    fc.lineTo(BW, H); fc.closePath(); fc.fill();
    /* moonlit hill rim */
    fc.strokeStyle = SIL(0.10); fc.lineWidth = 1.4;
    fc.beginPath();
    for (let x = 0; x <= BW; x += 18) {
      const y = hillY - Math.sin(x / BW * Math.PI * 2.1 + 0.6) * H * 0.045 - Math.sin(x / 61) * 4;
      x === 0 ? fc.moveTo(x, y) : fc.lineTo(x, y);
    }
    fc.stroke();
    /* temple silhouette on the right hill */
    (function temple() {
      const tx = BW * 0.76, tw = clamp(W * 0.06, 44, 64);
      const ty = hillY - Math.sin(tx / BW * Math.PI * 2.1 + 0.6) * H * 0.045 - Math.sin(tx / 61) * 4 - 2;
      const colH = tw * 0.30, colW = Math.max(2.5, tw * 0.055);
      fc.fillStyle = '#0B141C';
      fc.fillRect(tx - tw / 2 - 3, ty - 4, tw + 6, 4);                      /* stylobate */
      fc.fillRect(tx - tw / 2 - 5, ty, tw + 10, 3);
      for (let i = 0; i < 6; i++) {                                          /* columns */
        const cx = tx - tw / 2 + (tw / 5) * i;
        fc.fillRect(cx - colW / 2, ty - 4 - colH, colW, colH);
      }
      fc.fillRect(tx - tw / 2 - 3, ty - 4 - colH - 4, tw + 6, 4);            /* architrave */
      fc.beginPath(); fc.moveTo(tx - tw / 2 - 5, ty - 4 - colH - 4);         /* pediment */
      fc.lineTo(tx, ty - 4 - colH - 4 - tw * 0.17); fc.lineTo(tx + tw / 2 + 5, ty - 4 - colH - 4);
      fc.closePath(); fc.fill();
      fc.strokeStyle = SIL(0.20); fc.lineWidth = 1;
      fc.beginPath(); fc.moveTo(tx - tw / 2 - 5, ty - 4 - colH - 4);
      fc.lineTo(tx, ty - 4 - colH - 4 - tw * 0.17); fc.lineTo(tx + tw / 2 + 5, ty - 4 - colH - 4);
      fc.stroke();
    })();

    /* ── mid band: cypress + olive grove on a rolling bushline ── */
    const [midC, mc] = off(BW, H);
    const midY = H * 0.70;
    const mg = mc.createLinearGradient(0, midY - 6, 0, H);
    mg.addColorStop(0, '#0C1520'); mg.addColorStop(0.5, '#0A1219'); mg.addColorStop(1, '#070D12');
    mc.fillStyle = mg;
    mc.beginPath(); mc.moveTo(0, H);
    mc.lineTo(0, midY + 10);
    for (let x = 0; x <= BW; x += 14) {
      const y = midY + 6 - Math.abs(Math.sin(x / 53 + 1.7)) * 7 - Math.sin(x / 190) * 5;
      mc.lineTo(x, y);
    }
    mc.lineTo(BW, H); mc.closePath(); mc.fill();
    const nT = Math.max(7, Math.round(BW / 130));
    for (let i = 0; i < nT; i++) {
      const x = (i + 0.5) * (BW / nT) + (rnd() - 0.5) * 40;
      const s = 0.7 + rnd() * 0.9;
      if (i % 2 === 0) cypress(mc, x, midY + 8, 46 * s, 13 * s, '#0A1219', 0.11);
      else olive(mc, x, midY + 8, 30 * s, '#0A1219', 0.09, rnd);
    }

    /* ── near band: dark flank clusters + broken column (no full strip —
          the painted ground below must stay visible) ── */
    const [nearC, nc] = off(BW, H);
    const nearY = H * 0.86;
    cypress(nc, BW * 0.055, nearY + 12, 88, 24, '#05090F', 0.14);
    olive(nc, BW * 0.13, nearY + 12, 46, '#05090F', 0.12, rnd);
    cypress(nc, BW * 0.94, nearY + 12, 96, 26, '#05090F', 0.14);
    olive(nc, BW * 0.87, nearY + 12, 40, '#05090F', 0.10, rnd);
    (function columnStump() {                                   /* fallen marble column, left */
      const cx = BW * 0.185, cy = nearY + 12, w = 15, h = 36;
      nc.fillStyle = '#070D13';
      nc.fillRect(cx - w / 2, cy - h, w, h);
      nc.beginPath(); nc.ellipse(cx, cy - h, w / 2, 3.4, 0, 0, Math.PI * 2); nc.fill();
      nc.beginPath(); nc.ellipse(cx + w * 1.6, cy - 4, 9, 5, 0.5, 0, Math.PI * 2); nc.fill(); /* fallen drum */
      nc.strokeStyle = SIL(0.16); nc.lineWidth = 1;
      nc.beginPath(); nc.moveTo(cx - w / 2, cy - h + 1); nc.quadraticCurveTo(cx, cy - h - 3, cx + w / 2, cy - h + 1); nc.stroke();
      nc.beginPath(); nc.moveTo(cx - w / 2, cy - h); nc.lineTo(cx - w / 2, cy - 6); nc.stroke();
    })();

    /* ── ground band ── */
    const [gndC, gc] = off(BW, H);
    const gy = H * 0.845;
    const gg = gc.createLinearGradient(0, gy - 8, 0, H);
    gg.addColorStop(0, '#0B130D'); gg.addColorStop(0.5, '#0A0F0A'); gg.addColorStop(1, '#070B07');
    gc.fillStyle = gg; gc.fillRect(0, gy - 8, BW, H - gy + 8);
    /* moonlight pool */
    const mp = gc.createRadialGradient(BW * 0.24, H * 0.93, 6, BW * 0.24, H * 0.93, W * 0.30);
    mp.addColorStop(0, SIL(0.055)); mp.addColorStop(1, SIL(0));
    gc.fillStyle = mp; gc.fillRect(0, gy - 8, BW, H - gy + 8);
    /* grass tufts on the ridge */
    for (let i = 0; i < 90; i++) {
      const x = rnd() * BW, y = gy - 6 + rnd() * 10, h2 = 3 + rnd() * 5;
      gc.strokeStyle = rnd() < 0.22 ? 'rgba(96,120,108,0.5)' : 'rgba(14,24,16,0.9)';
      gc.lineWidth = 1;
      gc.beginPath(); gc.moveTo(x, y); gc.quadraticCurveTo(x + (rnd() - 0.5) * 3, y - h2 * 0.6, x + (rnd() - 0.5) * 6, y - h2); gc.stroke();
    }
    /* half-buried shards + a toppled pithos far right */
    gc.fillStyle = '#100B07';
    for (let i = 0; i < 3; i++) {
      const x = BW * (0.3 + rnd() * 0.35), y = gy + 8 + rnd() * (H - gy - 14);
      gc.beginPath(); gc.moveTo(x, y); gc.lineTo(x + 7 + rnd() * 5, y - 6 - rnd() * 4); gc.lineTo(x + 12 + rnd() * 6, y); gc.closePath(); gc.fill();
    }
    (function toppled() {
      const x = BW * 0.90, y = gy + (H - gy) * 0.55;
      gc.save(); gc.translate(x, y); gc.rotate(-0.28);
      gc.fillStyle = '#120C08';
      gc.beginPath(); gc.ellipse(0, 0, 16, 9.5, 0, 0, Math.PI * 2); gc.fill();
      gc.fillRect(12, -4.6, 9, 9.2);
      gc.beginPath(); gc.ellipse(21, 0, 2.6, 4.6, 0, 0, Math.PI * 2); gc.fill();
      gc.strokeStyle = SIL(0.14); gc.lineWidth = 1;
      gc.beginPath(); gc.ellipse(0, 0, 16, 9.5, 0, -2.6, -0.6); gc.stroke();
      gc.restore();
    })();

    layers = { far: farC, mid: midC, near: nearC, gnd: gndC, blob: blobC };
  }
  function cypress(x2, x, baseY, h, w, fill, rim) {
    x2.fillStyle = fill;
    x2.beginPath();
    x2.moveTo(x, baseY);
    x2.quadraticCurveTo(x - w, baseY - h * 0.42, x, baseY - h);
    x2.quadraticCurveTo(x + w, baseY - h * 0.42, x, baseY);
    x2.closePath(); x2.fill();
    x2.strokeStyle = SIL(rim); x2.lineWidth = 1;
    x2.beginPath(); x2.moveTo(x - 1, baseY - h * 0.96); x2.quadraticCurveTo(x - w * 0.86, baseY - h * 0.44, x - w * 0.55, baseY - h * 0.12); x2.stroke();
  }
  function olive(x2, x, baseY, s, fill, rim, rnd) {
    x2.fillStyle = fill;
    x2.fillRect(x - s * 0.06, baseY - s * 0.62, s * 0.12, s * 0.62);
    for (let i = 0; i < 4; i++) {
      const bx2 = x + (rnd() - 0.5) * s * 0.9, by2 = baseY - s * (0.55 + rnd() * 0.42), r = s * (0.24 + rnd() * 0.2);
      x2.beginPath(); x2.arc(bx2, by2, r, 0, Math.PI * 2); x2.fill();
      if (i === 0) { x2.strokeStyle = SIL(rim); x2.lineWidth = 1; x2.beginPath(); x2.arc(bx2, by2, r, Math.PI * 0.95, Math.PI * 1.75); x2.stroke(); }
    }
  }

  /* ═════════════ frame loop ═════════════ */
  function frame(now) {
    raf = 0;
    if (!(awake && onGame && mounted)) return;
    const dt = clamp((now - last) / 1000, 0.001, 0.05);
    last = now; T = now / 1000;
    step(dt, now);
    if (W && H && layers) { paintBG(); paintFX(dt); }
    raf = requestAnimationFrame(frame);
  }

  function step(dt, now) {
    /* smoothed aim + bow spring */
    const k = 1 - Math.pow(0.0018, dt);
    if (haveAim || smInit) { smx = lerp(smx, ax, k); smy = lerp(smy, ay, k); }
    else { smx = lerp(smx, W / 2, k * 0.4); smy = lerp(smy, H * 0.35, k * 0.4); }
    const bx = W / 2, by = H - 6;
    let tAng = haveAim ? Math.atan2(smy - by, smx - bx) : -Math.PI / 2;
    tAng = clamp(tAng, -Math.PI + 0.32, -0.32);
    bow.ang = lerpAng(bow.ang, tAng, 1 - Math.pow(0.004, dt));
    const dTarget = haveAim ? 1 : 0.62;
    bow.draw = lerp(bow.draw, dTarget, 1 - Math.pow(0.010, dt));
    bow.oscT += dt; bow.recoil *= Math.pow(0.0007, dt);

    /* volley ambience mix */
    volleyMix = lerp(volleyMix, volleyOn ? 1 : 0, 1 - Math.pow(0.05, dt));

    /* pending shatters (synced to arrow arrival) */
    for (let i = pend.length - 1; i >= 0; i--) if (now >= pend[i].at) { burst(pend[i]); pend.splice(i, 1); }
    /* scheduled rain spawns */
    for (let i = rainQueue.length - 1; i >= 0; i--) if (now >= rainQueue[i].at) { rains.push(mkRain(rainQueue[i])); rainQueue.splice(i, 1); }

    /* arrows */
    for (let i = arrows.length - 1; i >= 0; i--) {
      const a = arrows[i]; a.t += (dt * 1000) / a.dur;
      if (a.t >= 1) { impactAt(a.tx, a.ty, a.good); arrows.splice(i, 1); continue; }
      const p = bez(a, Math.min(1, a.t));
      a.trail.push(p); if (a.trail.length > 12) a.trail.shift();
    }
    /* physics pools */
    stepPool(shards, dt, 980, 0.995, true);
    stepPool(chunks, dt, 900, 0.995, true);
    stepPool(drops, dt, 1150, 0.998, false);
    stepPool(sparks, dt, 420, 0.985, false);
    stepPool(coins, dt, 900, 0.996, true);
    for (let i = streaks.length - 1; i >= 0; i--) { streaks[i].life -= dt; if (streaks[i].life <= 0) streaks.splice(i, 1); }
    for (let i = flashes.length - 1; i >= 0; i--) { flashes[i].t += dt; if (flashes[i].t >= flashes[i].dur) flashes.splice(i, 1); }
    /* embers rise from the warm ground while the volley burns */
    if (!reduce && volleyMix > 0.5 && embers.length < (LITE ? 16 : 34)) {
      emberAcc += dt * 9;
      while (emberAcc >= 1) {
        emberAcc -= 1;
        embers.push({
          x: Math.random() * W, y: H * (0.84 + Math.random() * 0.12),
          vx: (Math.random() - 0.5) * 14, vy: -26 - Math.random() * 44,
          r: 0.8 + Math.random() * 1.5, life: 1.3 + Math.random() * 1.2, max: 2.5, ph: Math.random() * 7,
        });
      }
    } else emberAcc = 0;
    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i]; e.life -= dt;
      e.x += (e.vx + Math.sin(T * 2.2 + e.ph) * 9) * dt; e.y += e.vy * dt;
      if (e.life <= 0) embers.splice(i, 1);
    }
    for (let i = glints.length - 1; i >= 0; i--) { const g = glints[i]; g.life -= dt; g.x += g.vx * dt; g.y += g.vy * dt; g.vy += 260 * dt; if (g.life <= 0) glints.splice(i, 1); }
    for (let i = puffs.length - 1; i >= 0; i--) { const p = puffs[i]; p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt; p.r += p.gr * dt; if (p.life <= 0) puffs.splice(i, 1); }
    for (let i = impacts.length - 1; i >= 0; i--) { impacts[i].t += dt; if (impacts[i].t > impacts[i].dur) impacts.splice(i, 1); }
    for (let i = rains.length - 1; i >= 0; i--) {
      const r = rains[i]; r.x += r.vx * dt; r.y += r.vy * dt;
      if (r.y >= r.gy) {
        stuck.push({ x: r.x, y: r.gy, ang: Math.atan2(r.vy, r.vx), life: 2.6 });
        puffs.push({ x: r.x, y: r.gy, vx: 0, vy: -14, r: 3, gr: 26, life: 0.5, max: 0.5, col: '168,150,120', a: 0.16 });
        rains.splice(i, 1);
      }
    }
    for (let i = stuck.length - 1; i >= 0; i--) { stuck[i].life -= dt; if (stuck[i].life <= 0) stuck.splice(i, 1); }
  }
  function stepPool(pool, dt, g, drag, spin) {
    for (let i = pool.length - 1; i >= 0; i--) {
      const s = pool[i]; s.life -= dt;
      if (s.life <= 0) { pool.splice(i, 1); continue; }
      s.vy += g * dt; s.vx *= drag; s.vy *= drag;
      s.px = s.x; s.py = s.y; s.x += s.vx * dt; s.y += s.vy * dt;
      if (spin) s.rot += s.av * dt;
    }
  }
  function bez(a, t) {
    const u = 1 - t;
    return {
      x: u * u * a.x0 + 2 * u * t * a.cx + t * t * a.tx,
      y: u * u * a.y0 + 2 * u * t * a.cy + t * t * a.ty,
    };
  }

  /* ═════════════ backdrop paint ═════════════ */
  function paintBG() {
    bg.clearRect(0, 0, W, H);
    bg.fillStyle = skyGrad; bg.fillRect(0, 0, W, H);

    const px = smInit ? (smx / W - 0.5) * 2 : 0;
    const py = smInit ? (smy / H - 0.5) * 2 : 0;
    const sway = reduce ? 0 : Math.sin(T * 0.5) * 1.6;

    /* stars */
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];
      const a = reduce ? s.b : s.b * (0.55 + 0.45 * Math.sin(T * s.sp + s.ph));
      if (a <= 0.02) continue;
      bg.globalAlpha = a; bg.fillStyle = '#DCE9F2';
      bg.beginPath(); bg.arc(s.x, s.y, s.r, 0, Math.PI * 2); bg.fill();
      if (s.big) {
        bg.globalAlpha = a * 0.5; bg.lineWidth = 1; bg.strokeStyle = '#DCE9F2';
        bg.beginPath(); bg.moveTo(s.x - s.r * 4, s.y); bg.lineTo(s.x + s.r * 4, s.y);
        bg.moveTo(s.x, s.y - s.r * 4); bg.lineTo(s.x, s.y + s.r * 4); bg.stroke();
      }
    }
    bg.globalAlpha = 1;

    /* moon + halo (warms slightly during volley) */
    const mx = W * 0.20, my = H * 0.15, mr = clamp(Math.min(W, H) * 0.055, 18, 40);
    const pulse = reduce ? 0 : Math.sin(T * 0.7) * 0.03;
    let h1 = bg.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 4.6);
    h1.addColorStop(0, SIL(0.20 + pulse)); h1.addColorStop(1, SIL(0));
    bg.fillStyle = h1; bg.beginPath(); bg.arc(mx, my, mr * 4.6, 0, Math.PI * 2); bg.fill();
    if (volleyMix > 0.02) {
      const h2 = bg.createRadialGradient(mx, my, mr, mx, my, mr * 6);
      h2.addColorStop(0, `rgba(255,170,90,${0.07 * volleyMix})`); h2.addColorStop(1, 'rgba(255,170,90,0)');
      bg.fillStyle = h2; bg.beginPath(); bg.arc(mx, my, mr * 6, 0, Math.PI * 2); bg.fill();
    }
    const md = bg.createRadialGradient(mx - mr * 0.38, my - mr * 0.38, mr * 0.12, mx, my, mr);
    md.addColorStop(0, '#F5F9FC'); md.addColorStop(0.62, '#DEE9F0'); md.addColorStop(1, '#B4C6D3');
    bg.fillStyle = md; bg.beginPath(); bg.arc(mx, my, mr, 0, Math.PI * 2); bg.fill();
    bg.fillStyle = 'rgba(140,162,178,0.20)';
    bg.beginPath(); bg.arc(mx + mr * 0.28, my + mr * 0.10, mr * 0.16, 0, Math.PI * 2); bg.fill();
    bg.beginPath(); bg.arc(mx - mr * 0.12, my + mr * 0.34, mr * 0.11, 0, Math.PI * 2); bg.fill();
    bg.beginPath(); bg.arc(mx + mr * 0.05, my - mr * 0.30, mr * 0.09, 0, Math.PI * 2); bg.fill();

    /* clouds */
    if (layers.blob) for (let i = 0; i < clouds.length; i++) {
      const c = clouds[i];
      if (!reduce) { c.x += c.sp * 0.016; if (c.x > W + c.w) c.x = -c.w; }
      bg.globalAlpha = c.a;
      bg.drawImage(layers.blob, c.x - c.w / 2, c.y - c.h, c.w, c.h * 2);
      bg.globalAlpha = 1;
    }

    /* parallax bands (shift opposite the aim = camera feel) */
    bg.drawImage(layers.far, -PAD - px * 5 - sway * 0.5, 0, W + PAD * 2, H);
    bg.drawImage(layers.mid, -PAD - px * 10 - sway, 0, W + PAD * 2, H);
    bg.drawImage(layers.gnd, -PAD - px * 13 - sway, 0, W + PAD * 2, H);
    bg.drawImage(layers.near, -PAD - px * 17 - sway * 1.4, -py * 3, W + PAD * 2, H);

    /* fireflies */
    if (!reduce) for (let i = 0; i < flies.length; i++) {
      const f = flies[i];
      const ex = 1 + volleyMix * 0.6;
      const x = f.bx + Math.sin(T * f.sx * ex + f.p1) * f.axr;
      const y = f.by + Math.cos(T * f.sy * ex + f.p2) * f.ayr;
      const a = Math.max(0, Math.sin(T * f.fs + f.p3)) * 0.7;
      if (a < 0.04) continue;
      const fg = bg.createRadialGradient(x, y, 0.2, x, y, 6);
      fg.addColorStop(0, `rgba(255,217,138,${a})`); fg.addColorStop(1, 'rgba(255,217,138,0)');
      bg.fillStyle = fg; bg.beginPath(); bg.arc(x, y, 6, 0, Math.PI * 2); bg.fill();
    }

    /* volley heat: warm breath from the ground */
    if (volleyMix > 0.02) {
      const fl = reduce ? 1 : (0.82 + 0.14 * Math.sin(T * 6.3) + 0.04 * Math.sin(T * 17));
      const wg = bg.createLinearGradient(0, H * 0.55, 0, H);
      wg.addColorStop(0, 'rgba(255,140,60,0)');
      wg.addColorStop(1, `rgba(255,140,60,${0.12 * volleyMix * fl})`);
      bg.fillStyle = wg; bg.fillRect(0, H * 0.55, W, H * 0.45);
    }

    /* vignette */
    const vg = bg.createRadialGradient(W / 2, H * 0.46, Math.min(W, H) * 0.42, W / 2, H * 0.52, Math.max(W, H) * 0.78);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.34)');
    bg.fillStyle = vg; bg.fillRect(0, 0, W, H);
    const tg = bg.createLinearGradient(0, 0, 0, H * 0.16);
    tg.addColorStop(0, 'rgba(0,0,0,0.22)'); tg.addColorStop(1, 'rgba(0,0,0,0)');
    bg.fillStyle = tg; bg.fillRect(0, 0, W, H * 0.16);
  }

  /* ═════════════ FX paint ═════════════ */
  function paintFX(dt) {
    fx.clearRect(0, 0, W, H);

    /* decorative arrow rain (with falling streaks) + stuck arrows */
    for (let i = 0; i < rains.length; i++) {
      const rn = rains[i];
      if (!reduce) {
        const tl = 0.06;
        const sx2 = rn.x - rn.vx * tl, sy2 = rn.y - rn.vy * tl;
        const rg = fx.createLinearGradient(sx2, sy2, rn.x, rn.y);
        rg.addColorStop(0, 'rgba(255,220,160,0)'); rg.addColorStop(1, 'rgba(255,220,160,0.30)');
        fx.strokeStyle = rg; fx.lineWidth = 2; fx.lineCap = 'round';
        fx.beginPath(); fx.moveTo(sx2, sy2); fx.lineTo(rn.x, rn.y); fx.stroke();
      }
      drawFlyArrow(fx, rn.x, rn.y, Math.atan2(rn.vy, rn.vx), 0.72, 0.55);
    }
    for (let i = 0; i < stuck.length; i++) {
      const s = stuck[i], a = clamp(s.life / 0.8, 0, 1);
      fx.save(); fx.translate(s.x, s.y); fx.rotate(s.ang); fx.globalAlpha = 0.85 * a;
      fx.strokeStyle = CREAM; fx.lineWidth = 1.6;
      fx.beginPath(); fx.moveTo(-16, 0); fx.lineTo(-3, 0); fx.stroke();
      fx.strokeStyle = TERRA; fx.lineWidth = 1.4;
      fx.beginPath(); fx.moveTo(-15, 0); fx.lineTo(-19, -3.4); fx.moveTo(-12.4, 0); fx.lineTo(-16.4, -3.4); fx.stroke();
      fx.restore();
    }
    fx.globalAlpha = 1;

    /* impacts: flash + expanding ring (plus a slower thin echo ring) */
    for (let i = 0; i < impacts.length; i++) {
      const im = impacts[i], k = im.t / im.dur, inv = 1 - k;
      if (im.thin) {
        fx.strokeStyle = `rgba(${im.rgb},${0.30 * inv})`; fx.lineWidth = 1.2;
        fx.beginPath(); fx.arc(im.x, im.y, lerp(6, 56, easeOut(k)), 0, Math.PI * 2); fx.stroke();
        continue;
      }
      fx.save(); fx.globalCompositeOperation = 'lighter';
      const fr = lerp(10, 34, k);
      const ig = fx.createRadialGradient(im.x, im.y, 1, im.x, im.y, fr);
      ig.addColorStop(0, `rgba(${im.rgb},${0.6 * inv})`); ig.addColorStop(1, `rgba(${im.rgb},0)`);
      fx.fillStyle = ig; fx.beginPath(); fx.arc(im.x, im.y, fr, 0, Math.PI * 2); fx.fill();
      fx.restore();
      fx.strokeStyle = `rgba(${im.rgb},${0.55 * inv})`; fx.lineWidth = 2.2 * inv + 0.4;
      fx.beginPath(); fx.arc(im.x, im.y, lerp(3, 40, easeOut(k)), 0, Math.PI * 2); fx.stroke();
    }
    /* radial impact streaks (additive) */
    if (streaks.length) {
      fx.save(); fx.globalCompositeOperation = 'lighter'; fx.lineCap = 'round';
      for (let i = 0; i < streaks.length; i++) {
        const s = streaks[i], a = clamp(s.life / s.max, 0, 1);
        const l = s.len * (0.45 + 0.55 * a);
        fx.strokeStyle = `rgba(${s.col},${0.5 * a})`; fx.lineWidth = s.w;
        fx.beginPath();
        fx.moveTo(s.x + Math.cos(s.ang) * 5, s.y + Math.sin(s.ang) * 5);
        fx.lineTo(s.x + Math.cos(s.ang) * (5 + l), s.y + Math.sin(s.ang) * (5 + l));
        fx.stroke();
      }
      fx.restore();
    }
    /* sparks */
    for (let i = 0; i < sparks.length; i++) {
      const s = sparks[i], a = clamp(s.life / s.max, 0, 1);
      fx.strokeStyle = `rgba(${s.col},${0.8 * a})`; fx.lineWidth = 1.4;
      fx.beginPath(); fx.moveTo(s.px, s.py); fx.lineTo(s.x, s.y); fx.stroke();
    }
    /* shards (two-tone spinning polygons, moonlit top facet) */
    for (let i = 0; i < shards.length; i++) {
      const s = shards[i], a = clamp(s.life / (s.max * 0.32), 0, 1);
      fx.save(); fx.translate(s.x, s.y); fx.rotate(s.rot); fx.globalAlpha = a;
      fx.fillStyle = s.fill;
      fx.beginPath(); fx.moveTo(s.v[0], s.v[1]);
      for (let j = 2; j < s.v.length; j += 2) fx.lineTo(s.v[j], s.v[j + 1]);
      fx.closePath(); fx.fill();
      fx.strokeStyle = s.edge; fx.lineWidth = 1; fx.stroke();
      fx.strokeStyle = SIL(0.30); fx.lineWidth = 0.9;
      fx.beginPath(); fx.moveTo(s.v[0], s.v[1]); fx.lineTo(s.v[2], s.v[3]); fx.stroke();
      fx.restore();
    }
    /* big pottery rim chunks — spinning broken arcs */
    for (let i = 0; i < chunks.length; i++) {
      const c = chunks[i], a = clamp(c.life / (c.max * 0.35), 0, 1);
      fx.save(); fx.translate(c.x, c.y); fx.rotate(c.rot); fx.globalAlpha = a;
      fx.lineCap = 'round';
      fx.strokeStyle = c.edge; fx.lineWidth = c.sw + 3.6;
      fx.beginPath(); fx.arc(0, 0, c.r, c.a0, c.a0 + c.arc); fx.stroke();
      fx.strokeStyle = c.fill; fx.lineWidth = c.sw + 1.6;
      fx.beginPath(); fx.arc(0, 0, c.r, c.a0, c.a0 + c.arc); fx.stroke();
      fx.strokeStyle = SIL(0.28); fx.lineWidth = 1;
      fx.beginPath(); fx.arc(0, 0, c.r - c.sw * 0.5 - 1, c.a0 + 0.12, c.a0 + c.arc * 0.55); fx.stroke();
      fx.restore();
    }
    /* spilled contents: droplets w/ streaks */
    for (let i = 0; i < drops.length; i++) {
      const d = drops[i], a = clamp(d.life / (d.max * 0.4), 0, 1);
      fx.strokeStyle = `rgba(${d.col},${0.5 * a})`; fx.lineWidth = d.r * 1.1;
      fx.beginPath(); fx.moveTo(d.px, d.py); fx.lineTo(d.x, d.y); fx.stroke();
      fx.fillStyle = `rgba(${d.col},${0.85 * a})`;
      fx.beginPath(); fx.arc(d.x, d.y, d.r, 0, Math.PI * 2); fx.fill();
    }
    /* coins */
    for (let i = 0; i < coins.length; i++) {
      const c = coins[i], a = clamp(c.life / (c.max * 0.35), 0, 1);
      const sq = Math.abs(Math.sin(c.rot));
      fx.save(); fx.translate(c.x, c.y); fx.scale(1, 0.35 + 0.65 * sq); fx.globalAlpha = a;
      fx.fillStyle = '#E3C766'; fx.beginPath(); fx.arc(0, 0, c.r, 0, Math.PI * 2); fx.fill();
      fx.strokeStyle = '#8F6E20'; fx.lineWidth = 1; fx.stroke();
      fx.restore();
    }
    /* gold glints (additive) */
    if (glints.length) {
      fx.save(); fx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < glints.length; i++) {
        const g = glints[i], a = clamp(g.life / g.max, 0, 1) * (0.5 + 0.5 * Math.sin(T * 22 + g.ph));
        fx.strokeStyle = `rgba(255,228,138,${a})`; fx.lineWidth = 1;
        const r = g.r * (0.6 + 0.4 * a);
        fx.beginPath(); fx.moveTo(g.x - r, g.y); fx.lineTo(g.x + r, g.y);
        fx.moveTo(g.x, g.y - r); fx.lineTo(g.x, g.y + r); fx.stroke();
      }
      fx.restore();
    }
    /* smoke / dust puffs */
    for (let i = 0; i < puffs.length; i++) {
      const p = puffs[i], a = clamp(p.life / p.max, 0, 1) * p.a;
      const pg = fx.createRadialGradient(p.x, p.y, 0.5, p.x, p.y, p.r);
      pg.addColorStop(0, `rgba(${p.col},${a})`); pg.addColorStop(1, `rgba(${p.col},0)`);
      fx.fillStyle = pg; fx.beginPath(); fx.arc(p.x, p.y, p.r, 0, Math.PI * 2); fx.fill();
    }
    /* rising embers (volley heat) */
    if (embers.length) {
      fx.save(); fx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        const a = clamp(e.life / e.max, 0, 1) * (0.5 + 0.5 * Math.sin(T * 7 + e.ph)) * 0.55;
        if (a <= 0.02) continue;
        const eg = fx.createRadialGradient(e.x, e.y, 0.2, e.x, e.y, e.r * 3.4);
        eg.addColorStop(0, `rgba(255,190,110,${a})`); eg.addColorStop(1, 'rgba(255,190,110,0)');
        fx.fillStyle = eg; fx.beginPath(); fx.arc(e.x, e.y, e.r * 3.4, 0, Math.PI * 2); fx.fill();
      }
      fx.restore();
    }
    /* one-shot light flashes: release points, gold rays, volley veil */
    for (let i = 0; i < flashes.length; i++) {
      const f = flashes[i], k = clamp(f.t / f.dur, 0, 1), inv = 1 - k;
      fx.save(); fx.globalCompositeOperation = 'lighter';
      if (f.kind === 'point') {
        const fr = f.r * (0.5 + 0.8 * k);
        const g2 = fx.createRadialGradient(f.x, f.y, 1, f.x, f.y, fr);
        g2.addColorStop(0, `rgba(${f.rgb},${0.5 * inv})`); g2.addColorStop(1, `rgba(${f.rgb},0)`);
        fx.fillStyle = g2; fx.beginPath(); fx.arc(f.x, f.y, fr, 0, Math.PI * 2); fx.fill();
      } else if (f.kind === 'ray') {
        const w0 = 6 + 16 * k;
        const g2 = fx.createLinearGradient(f.x, f.y, f.x, f.y - f.r);
        g2.addColorStop(0, `rgba(${f.rgb},${0.42 * inv})`); g2.addColorStop(1, `rgba(${f.rgb},0)`);
        fx.fillStyle = g2;
        fx.beginPath(); fx.moveTo(f.x - w0 * 0.35, f.y); fx.lineTo(f.x + w0 * 0.35, f.y);
        fx.lineTo(f.x + w0, f.y - f.r); fx.lineTo(f.x - w0, f.y - f.r);
        fx.closePath(); fx.fill();
      } else if (f.kind === 'veil') {
        const a = 0.15 * Math.sin(k * Math.PI);
        const g2 = fx.createLinearGradient(0, 0, 0, H);
        g2.addColorStop(0, `rgba(255,214,120,${a * 0.65})`);
        g2.addColorStop(0.55, `rgba(255,190,90,${a * 0.3})`);
        g2.addColorStop(1, `rgba(255,170,80,${a})`);
        fx.fillStyle = g2; fx.fillRect(0, 0, W, H);
      }
      fx.restore();
    }

    /* aim guide: faint dotted arc from the bow toward the aim point */
    if (haveAim && smInit && !reduce && !arrows.length) {
      const bx2 = W / 2, by2 = H - 12;
      const angA = clamp(Math.atan2(smy - by2, smx - bx2), -Math.PI + 0.32, -0.32);
      const L2 = clamp(H * 0.215, 64, 108);
      const sx0 = bx2 + Math.cos(angA) * L2 * 0.4, sy0 = by2 + Math.sin(angA) * L2 * 0.4;
      const dst = Math.hypot(smx - sx0, smy - sy0);
      if (dst > 60) {
        let pxn = -(smy - sy0) / dst, pyn = (smx - sx0) / dst;
        if (pyn > 0) { pxn = -pxn; pyn = -pyn; }
        const cxA = (sx0 + smx) / 2 + pxn * dst * 0.05, cyA = (sy0 + smy) / 2 + pyn * dst * 0.05;
        const drA = clamp(bow.draw, 0, 1);
        fx.save(); fx.globalCompositeOperation = 'lighter';
        for (let j = 1; j <= 6; j++) {
          const t2 = j / 7, u = 1 - t2;
          const dxp = u * u * sx0 + 2 * u * t2 * cxA + t2 * t2 * smx;
          const dyp = u * u * sy0 + 2 * u * t2 * cyA + t2 * t2 * smy;
          fx.fillStyle = `rgba(255,224,168,${0.20 * (1 - t2 * 0.6) * drA})`;
          fx.beginPath(); fx.arc(dxp, dyp, 2.0 - t2 * 0.7, 0, Math.PI * 2); fx.fill();
        }
        fx.restore();
      }
    }

    /* player arrows: comet trail + leading glow + shaft */
    for (let i = 0; i < arrows.length; i++) {
      const a = arrows[i];
      const p = bez(a, Math.min(1, a.t));
      if (a.trail.length > 1) {
        const n2 = a.trail.length;
        fx.save(); fx.globalCompositeOperation = 'lighter';
        fx.lineCap = 'round';
        for (let j = 1; j < n2; j++) {
          const q = j / n2;
          fx.strokeStyle = `rgba(255,214,150,${(reduce ? 0.18 : 0.4) * q * q})`;
          fx.lineWidth = 1 + 6.5 * q;
          fx.beginPath(); fx.moveTo(a.trail[j - 1].x, a.trail[j - 1].y); fx.lineTo(a.trail[j].x, a.trail[j].y); fx.stroke();
        }
        if (!reduce) {
          const lg = fx.createRadialGradient(p.x, p.y, 0.5, p.x, p.y, 11);
          lg.addColorStop(0, 'rgba(255,232,180,0.45)'); lg.addColorStop(1, 'rgba(255,232,180,0)');
          fx.fillStyle = lg; fx.beginPath(); fx.arc(p.x, p.y, 11, 0, Math.PI * 2); fx.fill();
        }
        fx.restore();
        fx.lineCap = 'round';
        fx.strokeStyle = 'rgba(240,230,205,0.55)'; fx.lineWidth = 1.6;
        fx.beginPath(); fx.moveTo(a.trail[0].x, a.trail[0].y);
        for (let j = 1; j < a.trail.length; j++) fx.lineTo(a.trail[j].x, a.trail[j].y);
        fx.stroke();
      }
      const pp = bez(a, Math.max(0, Math.min(1, a.t) - 0.06));
      drawFlyArrow(fx, p.x, p.y, Math.atan2(p.y - pp.y, p.x - pp.x), 1, 1);
    }

    /* the bow, last — foreground */
    drawBow();
  }
  function easeOut(k) { return 1 - Math.pow(1 - k, 3); }

  function drawFlyArrow(c, x, y, ang, scale, alpha) {
    c.save(); c.translate(x, y); c.rotate(ang); c.scale(scale, scale); c.globalAlpha = alpha;
    c.lineCap = 'round';
    c.strokeStyle = CREAM; c.lineWidth = 2;
    c.beginPath(); c.moveTo(-22, 0); c.lineTo(4, 0); c.stroke();
    c.fillStyle = BRONZE;
    c.beginPath(); c.moveTo(9, 0); c.lineTo(1.5, -3); c.lineTo(1.5, 3); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,240,200,0.7)'; c.lineWidth = 0.8;
    c.beginPath(); c.moveTo(9, 0); c.lineTo(1.5, -3); c.stroke();
    c.strokeStyle = TERRA; c.lineWidth = 1.6;
    c.beginPath();
    c.moveTo(-21, 0); c.lineTo(-25.5, -4); c.moveTo(-18, 0); c.lineTo(-22.5, -4);
    c.moveTo(-21, 0); c.lineTo(-25.5, 4); c.moveTo(-18, 0); c.lineTo(-22.5, 4);
    c.stroke();
    c.restore();
  }

  function drawBow() {
    const L = clamp(H * 0.215, 64, 108);
    const ang = bow.ang + (reduce ? 0 : Math.sin(T * 0.9) * 0.012 + Math.sin(T * 2.3) * 0.004);
    const dx = Math.cos(ang), dy = Math.sin(ang);
    const px2 = -dy, py2 = dx;
    const bx = W / 2 - dx * bow.recoil * 7, by = H - 12 - dy * bow.recoil * 7;
    const draw = clamp(bow.draw, 0, 1) * (haveAim && !reduce ? (0.94 + 0.06 * Math.sin(T * 1.7)) : 1);

    const tipBack = L * (0.02 + 0.17 * draw);
    const ax1 = bx + px2 * L - dx * tipBack, ay1 = by + py2 * L - dy * tipBack;
    const ax2 = bx - px2 * L - dx * tipBack, ay2 = by - py2 * L - dy * tipBack;
    const bow1x = bx + px2 * L * 0.50 + dx * L * (0.40 - 0.13 * draw), bow1y = by + py2 * L * 0.50 + dy * L * (0.40 - 0.13 * draw);
    const bow2x = bx - px2 * L * 0.50 + dx * L * (0.40 - 0.13 * draw), bow2y = by - py2 * L * 0.50 + dy * L * (0.40 - 0.13 * draw);

    /* string + nock */
    const osc = reduce ? 0 : 6 * Math.exp(-bow.oscT * 9) * Math.sin(bow.oscT * 74);
    const nx = bx - dx * (draw * L * 0.30) + px2 * osc;
    const ny = by - dy * (draw * L * 0.30) + py2 * osc;
    fx.strokeStyle = `rgba(240,232,214,${0.55 + 0.35 * draw})`; fx.lineWidth = 1.3;
    fx.beginPath(); fx.moveTo(ax1, ay1); fx.lineTo(nx, ny); fx.lineTo(ax2, ay2); fx.stroke();
    /* string-release flash: bright snap along the string right after loosing */
    if (!reduce && bow.oscT < 0.14) {
      const fA = (1 - bow.oscT / 0.14) * 0.55;
      fx.save(); fx.globalCompositeOperation = 'lighter';
      fx.strokeStyle = `rgba(255,236,190,${fA})`; fx.lineWidth = 2.6;
      fx.beginPath(); fx.moveTo(ax1, ay1); fx.lineTo(nx, ny); fx.lineTo(ax2, ay2); fx.stroke();
      fx.restore();
    }

    /* nocked arrow */
    if (draw > 0.25 && bow.oscT > 0.12) {
      const alen = L * 1.02;
      fx.save(); fx.translate(nx, ny); fx.rotate(ang);
      fx.lineCap = 'round';
      fx.strokeStyle = CREAM; fx.lineWidth = 2.2;
      fx.beginPath(); fx.moveTo(0, 0); fx.lineTo(alen - 8, 0); fx.stroke();
      fx.fillStyle = BRONZE;
      fx.beginPath(); fx.moveTo(alen + 2, 0); fx.lineTo(alen - 9, -3.6); fx.lineTo(alen - 9, 3.6); fx.closePath(); fx.fill();
      fx.strokeStyle = 'rgba(255,240,200,0.8)'; fx.lineWidth = 0.9;
      fx.beginPath(); fx.moveTo(alen + 2, 0); fx.lineTo(alen - 9, -3.6); fx.stroke();
      fx.strokeStyle = TERRA; fx.lineWidth = 1.8;
      fx.beginPath();
      fx.moveTo(2, 0); fx.lineTo(-3.5, -4.6); fx.moveTo(6, 0); fx.lineTo(0.5, -4.6);
      fx.moveTo(2, 0); fx.lineTo(-3.5, 4.6); fx.moveTo(6, 0); fx.lineTo(0.5, 4.6);
      fx.stroke();
      fx.restore();
      /* drawing hand pinching the string (archer presence) */
      fx.save(); fx.translate(nx, ny); fx.rotate(ang);
      fx.fillStyle = '#1A1109';
      fx.beginPath();
      (fx.roundRect ? fx.roundRect(-10.5, -4.4, 10, 8.8, 3.8) : fx.rect(-10.5, -4.4, 10, 8.8));
      fx.fill();
      fx.beginPath();
      fx.arc(-1.4, -3.2, 2.2, 0, Math.PI * 2);
      fx.arc(-0.7, 0.2, 2.3, 0, Math.PI * 2);
      fx.arc(-1.4, 3.4, 2.1, 0, Math.PI * 2);
      fx.fill();
      fx.strokeStyle = SIL(0.18); fx.lineWidth = 1;
      fx.beginPath(); fx.moveTo(-9.6, -3.9); fx.quadraticCurveTo(-4, -5.4, 0.2, -3.7); fx.stroke();
      fx.restore();
    }

    /* limbs: dark outline + wood gradient + bronze tips */
    const grad = fx.createLinearGradient(bx + px2 * L, by + py2 * L, bx - px2 * L, by - py2 * L);
    grad.addColorStop(0, '#A8722F'); grad.addColorStop(0.5, '#6B4423'); grad.addColorStop(1, '#A8722F');
    fx.lineCap = 'round';
    fx.strokeStyle = '#20120A'; fx.lineWidth = 7.5;
    limbPath(bx, by, bow1x, bow1y, ax1, ay1, px2, py2); fx.stroke();
    limbPath(bx, by, bow2x, bow2y, ax2, ay2, -px2, -py2); fx.stroke();
    fx.strokeStyle = grad; fx.lineWidth = 4.6;
    limbPath(bx, by, bow1x, bow1y, ax1, ay1, px2, py2); fx.stroke();
    limbPath(bx, by, bow2x, bow2y, ax2, ay2, -px2, -py2); fx.stroke();
    /* moonlit edge on the limbs */
    fx.strokeStyle = SIL(0.22); fx.lineWidth = 1.1;
    limbPath(bx, by, bow1x, bow1y, ax1, ay1, px2, py2); fx.stroke();
    /* bronze tip caps + rings */
    fx.fillStyle = BRONZE;
    fx.beginPath(); fx.arc(ax1, ay1, 3, 0, Math.PI * 2); fx.fill();
    fx.beginPath(); fx.arc(ax2, ay2, 3, 0, Math.PI * 2); fx.fill();
    fx.strokeStyle = BRONZE; fx.lineWidth = 2.2;
    ringAt(bx + px2 * L * 0.72 + dx * L * 0.20, by + py2 * L * 0.72 + dy * L * 0.20);
    ringAt(bx - px2 * L * 0.72 + dx * L * 0.20, by - py2 * L * 0.72 + dy * L * 0.20);
    /* leather grip */
    fx.save(); fx.translate(bx, by); fx.rotate(ang + Math.PI / 2);
    fx.fillStyle = '#3A2312';
    fx.beginPath();
    (fx.roundRect ? fx.roundRect(-4.4, -11, 8.8, 22, 3.6) : fx.rect(-4.4, -11, 8.8, 22));
    fx.fill();
    fx.strokeStyle = 'rgba(200,155,74,0.55)'; fx.lineWidth = 1;
    for (let j = -7; j <= 7; j += 3.5) { fx.beginPath(); fx.moveTo(-4.2, j); fx.lineTo(4.2, j); fx.stroke(); }
    /* bow hand: dark fist wrapping the grip, moonlit knuckle edge */
    fx.fillStyle = '#1A1109';
    fx.beginPath();
    (fx.roundRect ? fx.roundRect(-5.6, -6.8, 11.2, 14.6, 4.8) : fx.rect(-5.6, -6.8, 11.2, 14.6));
    fx.fill();
    fx.beginPath();
    fx.arc(-5.4, -3.4, 2.6, 0, Math.PI * 2);
    fx.arc(-5.8, 0.6, 2.7, 0, Math.PI * 2);
    fx.arc(-5.4, 4.4, 2.5, 0, Math.PI * 2);
    fx.fill();
    fx.strokeStyle = SIL(0.20); fx.lineWidth = 1;
    fx.beginPath(); fx.moveTo(-5.6, -6.4); fx.quadraticCurveTo(0, -8.8, 5.4, -6.2); fx.stroke();
    fx.restore();
  }
  function limbPath(bx, by, cx, cy, tx, ty, px2, py2) {
    fx.beginPath();
    fx.moveTo(bx + px2 * 5, by + py2 * 5);
    fx.quadraticCurveTo(cx, cy, tx, ty);
  }
  function ringAt(x, y) { fx.beginPath(); fx.arc(x, y, 3.4, 0, Math.PI * 2); fx.stroke(); }

  /* ═════════════ game-facing API ═════════════ */
  function fire(tx, ty) {
    if (!mounted || !W) { lastEta = 0; lastEtaAt = performance.now(); return 0; }
    /* snap aim to the shot */
    ax = tx; ay = ty; haveAim = true;
    if (!smInit) { smx = tx; smy = ty; smInit = true; }
    smx = tx; smy = ty;
    const bx = W / 2, by = H - 12;
    const ang = clamp(Math.atan2(ty - by, tx - bx), -Math.PI + 0.32, -0.32);
    bow.ang = ang;
    const L = clamp(H * 0.215, 64, 108);
    const x0 = bx - Math.cos(ang) * (bow.draw * L * 0.3) + Math.cos(ang) * L * 0.4;
    const y0 = by - Math.sin(ang) * (bow.draw * L * 0.3) + Math.sin(ang) * L * 0.4;
    const dist = Math.hypot(tx - x0, ty - y0);
    const dur = reduce ? 1 : clamp(dist / 1.6, 125, 245);
    /* gentle arc perpendicular to flight */
    let pxn = -(ty - y0) / (dist || 1), pyn = (tx - x0) / (dist || 1);
    if (pyn > 0) { pxn = -pxn; pyn = -pyn; }
    arrows.push({
      x0, y0, tx, ty, t: 0, dur, trail: [],
      cx: (x0 + tx) / 2 + pxn * dist * 0.05, cy: (y0 + ty) / 2 + pyn * dist * 0.05,
      good: true,
    });
    bow.draw = 0; bow.oscT = 0; bow.recoil = 1;
    /* loose: point-flash at the string + a few feather wisps kicked backward */
    if (!reduce) {
      flashes.push({ kind: 'point', x: x0, y: y0, t: 0, dur: 0.16, r: 26, rgb: '255,232,180' });
      for (let i = 0; i < 3; i++) {
        const fa = ang + Math.PI + (Math.random() - 0.5) * 1.1, fs = 40 + Math.random() * 90;
        sparks.push({
          x: x0, y: y0, px: x0, py: y0,
          vx: Math.cos(fa) * fs, vy: Math.sin(fa) * fs,
          life: 0.15 + Math.random() * 0.12, max: 0.27, col: '240,225,190',
        });
      }
    }
    SFX.pluck();
    /* reticle kick */
    try {
      const ret = document.getElementById('tx-reticle');
      if (ret && !reduce) {
        ret.classList.remove('tx-ret-fire'); void ret.offsetWidth; ret.classList.add('tx-ret-fire');
        if (retTimer) clearTimeout(retTimer);
        retTimer = setTimeout(() => { ret.classList.remove('tx-ret-fire'); retTimer = 0; }, 240);
      }
    } catch (_) {}
    lastEta = dur; lastEtaAt = performance.now();
    return dur;
  }

  function impactAt(x, y, good) {
    const rgb = good ? '255,224,160' : '224,133,119';
    impacts.push({ x, y, t: 0, dur: 0.26, rgb });
    if (!reduce) impacts.push({ x, y, t: 0, dur: 0.5, rgb, thin: true });
    const n = reduce ? 3 : 9;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2, sp = 90 + Math.random() * 240;
      sparks.push({ x, y, px: x, py: y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60, life: 0.22 + Math.random() * 0.2, max: 0.4, col: '255,220,160' });
    }
    if (!reduce) for (let i = 0; i < 6; i++) {
      const a = Math.random() * Math.PI * 2;
      streaks.push({ x, y, ang: a, len: 15 + Math.random() * 24, life: 0.2 + Math.random() * 0.12, max: 0.32, col: rgb, w: 1.6 });
    }
    SFX.thunk();
    shakeRange(3.0, 140);
  }

  function shakeRange(amp, ms) {
    if (reduce || !range) return;
    const now = performance.now();
    if (now - lastShake < 70) return;
    lastShake = now;
    try {
      range.animate([
        { transform: 'translate(0,0)' },
        { transform: `translate(${amp}px,${-amp * 0.6}px)` },
        { transform: `translate(${-amp * 0.8}px,${amp * 0.5}px)` },
        { transform: `translate(${amp * 0.4}px,${amp * 0.2}px)` },
        { transform: 'translate(0,0)' },
      ], { duration: ms, easing: 'ease-out' });
    } catch (_) {}
  }

  /* shatter — element-based; syncs to the latest arrow's arrival */
  function shatterAt(el, cls) {
    if (!mounted || !range || !el) return;
    let cx = W / 2, cy = H / 2;
    try {
      const er = el.getBoundingClientRect(), rr = range.getBoundingClientRect();
      cx = er.left - rr.left + er.width / 2; cy = er.top - rr.top + er.height / 2;
    } catch (_) {}
    const type = (el.dataset && el.dataset.type) || (cls === 'gold' ? 'gold' : 'normal');
    const now = performance.now();
    const d = (now - lastEtaAt < 420) ? Math.max(0, lastEta - (now - lastEtaAt)) : 0;
    pend.push({ at: now + d, cx, cy, type, cls });
  }

  const SHARD_COLS = {
    normal:  { fills: ['#B5683E', '#8A4526', '#C87F52', '#6E3A1E'], edge: '#2A150B' },
    gold:    { fills: ['#E3C766', '#C0A040', '#8F6E20', '#F0D67E'], edge: '#4A3A10' },
    snake:   { fills: ['#7E9E5C', '#556F38', '#93B061', '#3E5230'], edge: '#1C2812' },
    curse:   { fills: ['#4A3550', '#33272C', '#5A4460', '#241A28'], edge: '#120A14' },
    cracked: { fills: ['#6B4A38', '#4C3223', '#7A5A44', '#3A2618'], edge: '#1B0E07' },
  };
  function burst(p) {
    const { cx, cy, type, cls } = p;
    const pal = SHARD_COLS[type] || SHARD_COLS.normal;
    const flashRGB = cls === 'gold' ? '255,228,138' : cls === 'bad' ? '224,114,92' : '255,225,160';
    impacts.push({ x: cx, y: cy, t: 0, dur: type === 'gold' ? 0.34 : 0.24, rgb: flashRGB });

    const nS = reduce ? 6 : (type === 'cracked' ? 12 : 16);
    for (let i = 0; i < nS; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.9;
      const sp = 80 + Math.random() * 270;
      const r = 3.2 + Math.random() * 5.4, m = 3 + ((Math.random() * 2) | 0);
      const v = [];
      for (let j = 0; j < m + 1; j++) {
        const va = (j / (m + 1)) * Math.PI * 2, vr = r * (0.6 + Math.random() * 0.6);
        v.push(Math.cos(va) * vr, Math.sin(va) * vr);
      }
      shards.push({
        x: cx, y: cy, px: cx, py: cy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 40,
        rot: Math.random() * Math.PI * 2, av: (Math.random() - 0.5) * 16,
        life: 0.9 + Math.random() * 0.55, max: 1.45, v,
        fill: pal.fills[(Math.random() * pal.fills.length) | 0], edge: pal.edge,
      });
    }
    /* big spinning rim chunks — unmistakably pottery */
    const nC = reduce ? 1 : 3;
    for (let i = 0; i < nC; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.5;
      const sp = 60 + Math.random() * 180;
      chunks.push({
        x: cx, y: cy, px: cx, py: cy,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 90,
        rot: Math.random() * Math.PI * 2, av: (Math.random() - 0.5) * 11,
        life: 1.0 + Math.random() * 0.5, max: 1.5,
        r: 7 + Math.random() * 7, a0: Math.random() * Math.PI * 2,
        arc: 1.4 + Math.random() * 1.1, sw: 1.8 + Math.random() * 1.6,
        fill: pal.fills[(Math.random() * pal.fills.length) | 0], edge: pal.edge,
      });
    }
    /* terracotta dust bloom at the break point */
    const nDust = reduce ? 1 : 3;
    for (let i = 0; i < nDust; i++) puffs.push({
      x: cx + (Math.random() - 0.5) * 10, y: cy + (Math.random() - 0.5) * 8,
      vx: (Math.random() - 0.5) * 40, vy: -8 - Math.random() * 26,
      r: 6 + Math.random() * 7, gr: 34 + Math.random() * 22,
      life: 0.55 + Math.random() * 0.35, max: 0.9, col: '196,150,110', a: 0.15,
    });
    if (type === 'gold' && !reduce) flashes.push({ kind: 'ray', x: cx, y: cy, t: 0, dur: 0.55, r: 110, rgb: '255,228,138' });
    /* contents spill per type */
    if (type === 'gold') {
      const nG = reduce ? 6 : 14;
      for (let i = 0; i < nG; i++) glints.push({
        x: cx, y: cy, vx: (Math.random() - 0.5) * 220, vy: -60 - Math.random() * 200,
        r: 2.5 + Math.random() * 3.5, life: 0.5 + Math.random() * 0.5, max: 0.9, ph: Math.random() * 7,
      });
      for (let i = 0; i < (reduce ? 2 : 6); i++) coins.push({
        x: cx, y: cy, px: cx, py: cy, vx: (Math.random() - 0.5) * 190, vy: -120 - Math.random() * 160,
        r: 3.4 + Math.random() * 1.6, rot: Math.random() * 3, av: 6 + Math.random() * 8, life: 0.9, max: 0.9,
      });
    } else if (type === 'curse') {
      for (let i = 0; i < (reduce ? 3 : 6); i++) puffs.push({
        x: cx + (Math.random() - 0.5) * 12, y: cy + (Math.random() - 0.5) * 10,
        vx: (Math.random() - 0.5) * 30, vy: -26 - Math.random() * 34,
        r: 5 + Math.random() * 6, gr: 26 + Math.random() * 18,
        life: 0.7 + Math.random() * 0.4, max: 1.0, col: '104,80,120', a: 0.26,
      });
    } else if (type === 'cracked') {
      for (let i = 0; i < (reduce ? 2 : 5); i++) puffs.push({
        x: cx, y: cy, vx: (Math.random() - 0.5) * 50, vy: -10 - Math.random() * 30,
        r: 4 + Math.random() * 5, gr: 30, life: 0.5 + Math.random() * 0.3, max: 0.8, col: '168,138,100', a: 0.20,
      });
    } else {
      /* wine (normal) or venom (snake) spills out */
      const col = type === 'snake' ? '127,162,58' : '126,36,48';
      const nD = reduce ? 4 : 13;
      for (let i = 0; i < nD; i++) drops.push({
        x: cx, y: cy + 4, px: cx, py: cy + 4,
        vx: (Math.random() - 0.5) * 170, vy: -20 - Math.random() * 150,
        r: 1.6 + Math.random() * 1.8, life: 0.55 + Math.random() * 0.4, max: 0.95, col,
      });
    }
    SFX.crash(cls === 'gold' ? 'gold' : (cls === 'bad' ? 'bad' : ''));
    shakeRange(cls === 'gold' ? 3.4 : 2.2, 150);
  }

  /* volley mode: ambience + opening arrow rain */
  function volley(on) {
    volleyOn = !!on;
    if (on && mounted && W) {
      if (!reduce) {
        const now = performance.now();
        const n = 16;
        for (let i = 0; i < n; i++) rainQueue.push({ at: now + Math.random() * 1150, x: Math.random() * W });
        flashes.push({ kind: 'veil', t: 0, dur: 0.8 });
        SFX.whoosh();
      } else { SFX.whoosh(); }
    }
  }
  function mkRain(q) {
    const vy = 760 + Math.random() * 260;
    return { x: q.x, y: -24, vx: (Math.random() - 0.5) * 90, vy, gy: H * (0.84 + Math.random() * 0.10) };
  }

  return { mount, wake, sleep, screen, calm, fire, shatterAt, volley };
})();

const Toxotes = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');

  // Pick the language string from a question's `q`, tolerating {gr,en},
  // bare strings, {q:{gr,en}} wrappers and object-valued langs — so the
  // card never renders the literal "[object Object]" (host/picker banks may
  // deliver q as a bilingual object rather than a plain string).
  const QT = (q) => {
    if (q == null) return '';
    if (typeof q === 'string') return q;
    if (typeof q === 'object') {
      const v = q[L()] != null ? q[L()] : (q.gr != null ? q.gr : q.en);
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object') return QT(v);
      if (q.q !== undefined) return QT(q.q);
    }
    return String(q);
  };

  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.TX_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const ROUNDS_TRUE   = 10;
  const ROUNDS_VOLLEY = 6;
  const VOLLEY_MS     = 10000;
  const RIVALS = ['ΑΡΤΕΜΙΣ','ΦΙΛΟΚΤΗΤΗΣ','ΟΔΥΣΣΕΥΣ'];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('tx:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#tx-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('tx-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('tx-screen-intro')) build();
    syncLang();
    show('tx-screen-intro');
    TXP.wake();
  }
  function close() {
    cleanup();
    TXP.sleep();
    document.getElementById('tx-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('tx-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'tx-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeToxotes()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΤΟΞΟΤΗΣ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="tx-wrap"></div></div>';
    document.body.appendChild(ov);
    ov.querySelectorAll('.ov-lang button').forEach(b=>{
      b.addEventListener('click', ()=>{
        window.siteLang = b.dataset.lang;
        ov.querySelectorAll('.ov-lang button').forEach(x=>x.classList.toggle('on', x===b));
        syncLang();
      });
    });
  }

  /* ───────── build ───────── */
  function build() {
    document.getElementById('tx-wrap').innerHTML = `
<!-- INTRO / MODE SELECT -->
<div id="tx-screen-intro" class="tx-screen">
  ${bowSVG('tx-bow')}
  <div class="tx-logo">ΤΟΞΟΤΗΣ</div>
  <div class="tx-logo-en" data-i18n="subtitle"></div>
  <div class="tx-intro-txt" data-i18n="intro"></div>
  <div class="tx-modes">
    <button class="tx-mode" onclick="Toxotes._mode('true')">
      <div class="tx-mode-ic">🎯</div>
      <div class="tx-mode-name" data-i18n="m1"></div>
      <div class="tx-mode-desc" data-i18n="m1d"></div>
    </button>
    <button class="tx-mode" onclick="Toxotes._mode('volley')">
      <div class="tx-mode-ic">🏺</div>
      <div class="tx-mode-name" data-i18n="m2"></div>
      <div class="tx-mode-desc" data-i18n="m2d"></div>
    </button>
  </div>
</div>

<!-- GAME -->
<div id="tx-screen-game" class="tx-screen">
  <div class="tx-hud">
    <div class="tx-score"><span class="tx-score-lbl" data-i18n="score"></span><span class="tx-score-val" id="tx-score">0</span></div>
    <div class="tx-mid" id="tx-mid"></div>
    <div class="tx-streak" id="tx-streak"></div>
  </div>
  <div class="tx-qbar" id="tx-qbar"></div>
  <div class="tx-range" id="tx-range">
    <div class="tx-reticle" id="tx-reticle">${reticleSVG()}</div>
    <div class="tx-ground"></div>
  </div>
  <div class="tx-answers" id="tx-answers"></div>
</div>

<!-- END -->
<div id="tx-screen-end" class="tx-screen">
  <div id="tx-end-art"></div>
  <div class="tx-end-title" id="tx-end-title"></div>
  <div class="tx-end-sub" id="tx-end-sub"></div>
  <div class="tx-final-board" id="tx-final-board"></div>
  <div class="tx-end-btns">
    <button class="sym-btn" onclick="Toxotes._again()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Toxotes.close()" data-i18n="exit"></button>
  </div>
</div>`;
    // reticle follows the pointer across the range
    const range=document.getElementById('tx-range'), ret=document.getElementById('tx-reticle');
    range.addEventListener('pointermove', e=>{
      const r=range.getBoundingClientRect();
      ret.style.left=(e.clientX-r.left)+'px'; ret.style.top=(e.clientY-r.top)+'px'; ret.style.opacity='1';
    });
    range.addEventListener('pointerleave', ()=>{ ret.style.opacity='0'; });
    TXP.mount();
  }

  const I18N = {
    subtitle:{ gr:'Τα βέλη της Αρτέμιδος', en:'The Arrows of Artemis' },
    intro:   { gr:'Τέντωσε το τόξο και χτύπησε τους πετούμενους πίθους. Διάλεξε τρόπο παιχνιδιού.', en:'Draw your bow and strike the flying amphorae. Choose a mode of play.' },
    m1:  { gr:'ΕΥΣΤΟΧΗ ΒΟΛΗ', en:'TRUE SHOT' },
    m1d: { gr:'Τέσσερις πίθοι, μία σωστή απάντηση — τόξευσε τη σωστή.', en:'Four amphorae, one right answer — shoot the correct one.' },
    m2:  { gr:'ΟΜΟΒΡΟΝΤΙΑ', en:'VOLLEY' },
    m2d: { gr:'Απάντησε σωστά, μετά 10 δευτερόλεπτα ελεύθερης βολής.', en:'Answer right, then 10 seconds of free shooting.' },
    score:{ gr:'ΠΟΝΤΟΙ', en:'SCORE' },
    again:{ gr:'ΝΕΟ ΠΑΙΧΝΙΔΙ', en:'PLAY AGAIN' },
    exit: { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#tx-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.mode && document.getElementById('tx-screen-game').classList.contains('active')) {
      if (st.phase==='true') renderTrueQuestion(true);
      else if (st.phase==='question') renderVolleyQuestion(true);
      renderHud();
    }
  }
  function show(id){ document.querySelectorAll('#tx-wrap .tx-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); TXP.screen(id); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _mode(m) { st = { mode:m }; _start(); }
  function _again() { if (st.mode) _start(); else show('tx-screen-intro'); }

  function _start() {
    const m = st.mode;
    cleanup();
    st = {
      mode:m, round:0, score:0, streak:0, answered:false, phase:null, cur:null,
      pool: shuffle([..._gpPool()]), idx:0, timers:[],
      rivals: RIVALS.map(n=>({ name:n, score:0 })),
      done:false,
    };
    show('tx-screen-game');
    document.getElementById('tx-mid').textContent = (m==='true'?T('ΕΥΣΤΟΧΗ ΒΟΛΗ','TRUE SHOT'):T('ΟΜΟΒΡΟΝΤΙΑ','VOLLEY'));
    if (m==='true') nextTrue(); else nextVolley();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }
  function clearRange(){ const r=document.getElementById('tx-range'); r.querySelectorAll('.tx-amphora, .tx-arrow, .tx-pop').forEach(e=>e.remove()); }
  function cleanup(){
    if (!st) return;
    (st.timers||[]).forEach(t=>clearTimeout(t));
    if (st.spawnTimer) clearTimeout(st.spawnTimer);
    if (st.countdown) clearInterval(st.countdown);
    st.timers=[]; st.spawnTimer=null; st.countdown=null; st.volleyActive=false;
    if (st.fallTweens){ st.fallTweens.forEach(t=>{ try{ t && t.kill && t.kill(); }catch(_){} }); st.fallTweens=[]; }
    const r=document.getElementById('tx-range'); if(r) r.querySelectorAll('.tx-amphora, .tx-arrow, .tx-pop').forEach(e=>e.remove());
    TXP.calm();
  }
  function later(fn, ms){ const t=setTimeout(fn, ms); st.timers.push(t); return t; }

  /* ───────── leaderboard ───────── */
  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), score:st.score, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.score-a.score);
    return all;
  }
  function renderHud() {
    if(window.SymStandings) SymStandings.feed('tx', standings(), {key:'score', unit:'πόντοι', accent:'var(--sym-terra)', title:'ΤΟΞΟΤΗΣ'});
    document.getElementById('tx-score').textContent = st.score;
    const total = (st.mode==='true'?ROUNDS_TRUE:ROUNDS_VOLLEY);
    document.getElementById('tx-mid').textContent = T('ΓΥΡΟΣ ','ROUND ')+Math.min(st.round,total)+' / '+total;
    const sEl=document.getElementById('tx-streak');
    if (st.phase==='volley') { sEl.textContent=''; }
    else { sEl.textContent = st.streak>=2 ? T(`ΣΕΡΙ ×${st.streak}`,`STREAK ×${st.streak}`) : ''; sEl.classList.toggle('hot', st.streak>=2); }
  }
  function advanceRivals(strong){ st.rivals.forEach(r=> r.score += (strong? 120+((Math.random()*220)|0) : 50+((Math.random()*120)|0))); }

  /* ───────── shooting visuals (canvas-driven via TXP) ───────── */
  function shootArrow(x, y) {
    const range=document.getElementById('tx-range'); if(!range) return;
    TXP.fire(x, y);
    _fx('shoot');
  }
  function shatter(el, cls) {
    el.classList.add('shatter', cls||'');
    TXP.shatterAt(el, cls);
    later(()=>el.remove(), 420);
  }
  function popScore(x, y, txt, cls) {
    const range=document.getElementById('tx-range'); if(!range) return;
    const p=document.createElement('div'); p.className='tx-pop '+(cls||''); p.textContent=txt;
    p.style.left=x+'px'; p.style.top=y+'px'; range.appendChild(p);
    later(()=>p.remove(), 800);
  }
  function localXY(el, range) {
    const er=el.getBoundingClientRect(), rr=range.getBoundingClientRect();
    return [er.left-rr.left+er.width/2, er.top-rr.top+er.height/2];
  }

  /* ═══════════ MODE 1 · TRUE SHOT ═══════════ */
  function nextTrue() {
    if (st.done) return;
    if (st.round>=ROUNDS_TRUE) return end();
    st.phase='true'; st.answered=false; st.cur=getQ(); st.round++;
    killTrueTweens();
    clearRange();
    renderTrueQuestion(false);
    renderHud();
    // amphorae pop in at random spots and slowly drift downward; shoot the right one before they fall off (15s)
    const range=document.getElementById('tx-range');
    const keys=['Α','Β','Γ','Δ'];
    const lanes=shuffle([0,1,2,3]);
    const g=window.gsap;
    st.fallTweens=[];
    // On narrow (mobile) ranges, pull the lanes inward so each amphora's
    // answer label stays inside the frame instead of being clipped at the
    // edges (the range is overflow:hidden). Desktop keeps the full spread.
    const narrow=(range.clientWidth||range.getBoundingClientRect().width||360)<520;
    st.cur.a.forEach((opt,i)=>{
      const el=document.createElement('button'); el.className='tx-amphora falling';
      const laneW=100/4; let x=lanes[i]*laneW + 5 + Math.random()*(laneW-18);
      if (narrow) x=8+x*0.76;   // compress ~[5,87]% → ~[12,74]% so labels fit
      el.style.left=x.toFixed(1)+'%'; el.style.top='-18%';
      el.innerHTML = amphoraSVG('normal') + `<span class="tx-label"><b>${keys[i]}</b> ${opt}</span>`;
      el.dataset.idx=i;
      el.addEventListener('click', ev=>onTrueHit(ev, el));
      range.appendChild(el);
      const delay=Math.random()*2.2;            // random pop-in time
      if (g) {
        g.fromTo(el, {scale:0, opacity:0, rotate:(Math.random()*40-20)},
                     {scale:1, opacity:1, rotate:0, duration:.5, delay, ease:'back.out(2.2)'});
        st.fallTweens.push(g.to(el, {top:'116%', duration:14.5, delay, ease:'none'}));
        st.fallTweens.push(g.to(el, {rotate:'+=8', duration:2.4, delay, repeat:-1, yoyo:true, ease:'sine.inOut'}));
      } else {
        el.style.opacity='0';
        el.style.transition=`top 14.5s linear ${delay}s, opacity .5s ${delay}s, transform .5s ${delay}s`;
        requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.top='116%'; });
      }
    });
    startTrueTimer(15);
  }
  function startTrueTimer(secs) {
    st.trueEnd=Date.now()+secs*1000;
    if (st.countdown) clearInterval(st.countdown);
    st.countdown=setInterval(()=>{
      const left=Math.max(0,(st.trueEnd-Date.now())/1000);
      const sEl=document.getElementById('tx-streak');
      if (sEl){ sEl.textContent='⧗ '+left.toFixed(1)+'s'; sEl.classList.toggle('hot', left<=5); }
      if (left<=0){ clearInterval(st.countdown); st.countdown=null; trueTimeout(); }
    },100);
  }
  function killTrueTweens() {
    if (st.fallTweens){ st.fallTweens.forEach(t=>{ try{ t && t.kill && t.kill(); }catch(_){} }); st.fallTweens=[]; }
    if (st.countdown){ clearInterval(st.countdown); st.countdown=null; }
  }
  function trueTimeout() {
    if (st.answered) return; st.answered=true;
    killTrueTweens(); st.streak=0; advanceRivals(true);
    document.querySelectorAll('#tx-range .tx-amphora').forEach(a=>a.style.pointerEvents='none');
    const right=document.querySelector(`#tx-range .tx-amphora[data-idx="${st.cur.c}"]`);
    if (right) right.classList.add('reveal');
    flashQ(T('Ο ΧΡΟΝΟΣ ΤΕΛΕΙΩΣΕ — να η σωστή','TIME UP — there was the mark'),'bad');
    renderHud();
    later(()=>{ st.round>=ROUNDS_TRUE ? end() : nextTrue(); }, 1600);
  }
  function renderTrueQuestion(translateOnly) {
    const bar=document.getElementById('tx-qbar');
    bar.className='tx-qbar';
    bar.innerHTML = `<span class="tx-q-tag">${T('ΤΟΞΕΥΣΕ ΤΗ ΣΩΣΤΗ','SHOOT THE CORRECT')}</span><span class="tx-q-text">${QT(st.cur.q)}</span>`;
    document.getElementById('tx-answers').innerHTML='';
    if (!translateOnly) { /* labels already rebuilt via spawn on fresh round */ }
    else {
      // live re-translate amphora labels
      const keys=['Α','Β','Γ','Δ'];
      document.querySelectorAll('#tx-range .tx-amphora').forEach(el=>{
        const i=+el.dataset.idx; const lab=el.querySelector('.tx-label');
        if (lab && st.cur && st.cur.a[i]!=null) lab.innerHTML=`<b>${keys[i]}</b> ${st.cur.a[i]}`;
      });
    }
  }
  function onTrueHit(ev, el) {
    if (st.answered) return; st.answered=true;
    killTrueTweens();
    const range=document.getElementById('tx-range');
    const rr=range.getBoundingClientRect();
    shootArrow(ev.clientX-rr.left, ev.clientY-rr.top);
    const idx=+el.dataset.idx, correct=idx===st.cur.c;
    advanceRivals(!correct);
    document.querySelectorAll('#tx-range .tx-amphora').forEach(a=>a.style.pointerEvents='none');
    const [lx,ly]=localXY(el, range);
    if (correct) {
      st.streak++; const gain=100 + (st.streak>=2?st.streak*20:0);
      st.score += gain; _fx('correct');
      shatter(el,'good'); popScore(lx,ly,'+'+gain,'good');
      flashQ(T('ΕΥΣΤΟΧΑ!','A TRUE SHOT!'),'ok');
    } else {
      if (window.symLogMistake) { try { window.symLogMistake({ q: st.cur.q, wrong: (st.cur.a && st.cur.a[idx]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat:'Τοξότης', gameId:'toxotes' }); } catch(_){} }
      st.streak=0; _fx('wrong');
      shatter(el,'bad'); popScore(lx,ly,T('ΑΣΤΟΧΙΑ','MISS'),'bad');
      // reveal correct amphora
      const right=document.querySelector(`#tx-range .tx-amphora[data-idx="${st.cur.c}"]`);
      if (right) right.classList.add('reveal');
      flashQ(T('ΑΣΤΟΧΙΑ — να η σωστή','MISS — there was the mark'),'bad');
    }
    renderHud();
    later(()=>{ st.round>=ROUNDS_TRUE ? end() : nextTrue(); }, 1500);
  }
  function flashQ(msg, tone) {
    const bar=document.getElementById('tx-qbar');
    bar.className='tx-qbar flash '+(tone==='ok'?'ok':'bad');
    bar.querySelector('.tx-q-tag').textContent=msg;
  }

  /* ═══════════ MODE 2 · VOLLEY ═══════════ */
  function nextVolley() {
    if (st.done) return;
    if (st.round>=ROUNDS_VOLLEY) return end();
    st.phase='question'; st.answered=false; st.cur=getQ(); st.round++;
    clearRange();
    renderVolleyQuestion(false);
    renderHud();
  }
  function renderVolleyQuestion(translateOnly) {
    const bar=document.getElementById('tx-qbar'); bar.className='tx-qbar';
    bar.innerHTML = `<span class="tx-q-tag">${T('ΑΠΑΝΤΗΣΕ ΣΩΣΤΑ','ANSWER CORRECTLY')}</span><span class="tx-q-text">${QT(st.cur.q)}</span>`;
    const wrap=document.getElementById('tx-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='tx-ans';
      b.innerHTML=`<span class="tx-ans-key">${keys[i]}</span><span>${opt}</span>`;
      if (!translateOnly) b.onclick=()=>onVolleyAnswer(i,b);
      else b.onclick=()=>onVolleyAnswer(i,b);
      wrap.appendChild(b);
    });
  }
  function onVolleyAnswer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#tx-answers .tx-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    if (chosen===st.cur.c) {
      st.score += 50; _fx('correct'); btn.classList.add('correct');
      flashQ(T('ΣΩΣΤΟ — ΒΟΛΕΣ!','CORRECT — VOLLEY!'),'ok'); renderHud();
      later(startVolley, 700);
    } else {
      if (window.symLogMistake) { try { window.symLogMistake({ q: st.cur.q, wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat:'Τοξότης', gameId:'toxotes' }); } catch(_){} }
      btn.classList.add('wrong'); _fx('wrong'); st.streak=0;
      advanceRivals(true);
      flashQ(T('ΛΑΘΟΣ — χωρίς βολές','WRONG — no volley'),'bad'); renderHud();
      later(()=>{ st.round>=ROUNDS_VOLLEY ? end() : nextVolley(); }, 1400);
    }
  }
  function startVolley() {
    st.phase='volley'; document.getElementById('tx-answers').innerHTML='';
    advanceRivals(false);
    clearRange();
    TXP.volley(true);
    st.volleyActive=true; st.volleyHits=0;
    st.volleyEnd=Date.now()+VOLLEY_MS;
    st.countdown=setInterval(()=>{
      const left=Math.max(0,(st.volleyEnd-Date.now())/1000);
      const bar=document.getElementById('tx-qbar');
      bar.className='tx-qbar volley';
      bar.innerHTML=`<span class="tx-q-tag">${T('ΒΟΛΗ!','SHOOT!')}</span><span class="tx-timer">${left.toFixed(1)}s</span>`;
      if (left<=0) endVolley();
    },100);
    spawnVolley();
  }
  function spawnVolley() {
    if (!st.volleyActive) return;
    const range=document.getElementById('tx-range'); if(!range){ return; }
    const rect=range.getBoundingClientRect();
    const r=Math.random();
    let type;
    if (r<0.12) type='gold';
    else if (r<0.24) type='cracked';
    else if (r<0.35) type='snake';
    else if (r<0.45) type='curse';
    else type='normal';
    const el=document.createElement('button'); el.className='tx-amphora fly '+type;
    const badge = type==='gold'?'<span class="tx-vbadge gold">★</span>'
                : type==='curse'?'<span class="tx-vbadge">💀</span>'
                : type==='snake'?'<span class="tx-vbadge">🐍</span>'
                : type==='cracked'?'<span class="tx-vbadge">☠</span>' : '';
    el.innerHTML=amphoraSVG(type)+badge;
    const startX = 8+Math.random()*78;
    const dir = Math.random()<0.5?1:-1;
    el.style.left=startX+'%'; el.style.top='100%';
    el.dataset.type=type;
    el.addEventListener('click', ev=>onVolleyHit(ev, el, type));
    range.appendChild(el);
    const peak=rect.height*(0.42+Math.random()*0.34);
    const dx=dir*rect.width*(0.14+Math.random()*0.28);
    try {
      const anim=el.animate([
        {transform:'translate(-50%,0) rotate(0deg)'},
        {transform:`translate(calc(-50% + ${dx*0.5}px),${-peak}px) rotate(${dir*180}deg)`, offset:0.5},
        {transform:`translate(calc(-50% + ${dx}px),${rect.height*0.16}px) rotate(${dir*360}deg)`}
      ], {duration:2100+Math.random()*700, easing:'cubic-bezier(.4,.05,.6,1)'});
      el._anim=anim;
      anim.onfinish=()=>el.remove();
    } catch(_){ later(()=>el.remove(), 2400); }
    st.spawnTimer=setTimeout(spawnVolley, 430+Math.random()*330);
  }
  function onVolleyHit(ev, el, type) {
    if (el._hit) return; el._hit=true; el.style.pointerEvents='none';
    if (el._anim) try{ el._anim.pause(); }catch(_){}
    const range=document.getElementById('tx-range');
    const rr=range.getBoundingClientRect();
    shootArrow(ev.clientX-rr.left, ev.clientY-rr.top);
    const [lx,ly]=localXY(el, range);
    let gain, cls;
    if (type==='gold'){ gain=150; cls='gold'; }
    else if (type==='cracked'){ gain=-40; cls='bad'; }
    else if (type==='snake'){ gain=-60; cls='bad'; }
    else if (type==='curse'){ gain=-100; cls='bad'; }
    else { gain=50; cls='good'; }
    st.score=Math.max(0, st.score+gain); st.volleyHits++;
    shatter(el, cls); popScore(lx,ly,(gain>=0?'+':'')+gain, cls);
    _fx(type==='cracked'?'wrong':'correct');
    renderHud();
  }
  function endVolley() {
    st.volleyActive=false;
    if (st.countdown) clearInterval(st.countdown); st.countdown=null;
    if (st.spawnTimer) clearTimeout(st.spawnTimer); st.spawnTimer=null;
    clearRange();
    TXP.volley(false);
    flashQ(T(`ΟΜΟΒΡΟΝΤΙΑ: ${st.volleyHits} βολές`,`VOLLEY: ${st.volleyHits} hits`),'ok');
    later(()=>{ st.round>=ROUNDS_VOLLEY ? end() : nextVolley(); }, 1300);
  }

  /* ───────── end ───────── */
  function end() {
    st.done=true; cleanup();
    show('tx-screen-end');
    const board=standings();
    const won=board[0].me;
    _fx(won?'win':'lose');
    document.getElementById('tx-end-art').innerHTML = bowSVG('tx-end-bow');
    const title=document.getElementById('tx-end-title'), sub=document.getElementById('tx-end-sub');
    // medal by score
    const medal = st.score>=900?'🥇':st.score>=500?'🥈':'🥉';
    if (won) {
      title.innerHTML=T('ΑΡΙΣΤΟΤΟΞΟΣ '+medal,'MASTER ARCHER '+medal); title.className='tx-end-title win';
      sub.textContent=T('Το βέλος σου δεν αστόχησε. Η Άρτεμις σε καμαρώνει.','Your arrow never strayed. Artemis is proud.');
    } else {
      title.innerHTML=T('ΤΟ ΤΟΞΟ ΑΝΑΠΑΥΕΤΑΙ '+medal,'THE BOW RESTS '+medal); title.className='tx-end-title lose';
      sub.textContent=T(`Σημείωσες ${st.score} πόντους, στη ${board.findIndex(x=>x.me)+1}η θέση. Πρώτος: ${board[0].name}.`,`You scored ${st.score} points, in position ${board.findIndex(x=>x.me)+1}. First: ${board[0].name}.`);
    }
    document.getElementById('tx-final-board').innerHTML = board.map((x,i)=>
      `<div class="tx-final-row${x.me?' me':''}"><span class="tx-final-pos">${i+1}</span><span class="tx-final-name">${x.name}${i===0?' 🏆':''}</span><span class="tx-final-s">${x.score}</span></div>`
    ).join('');
  }

  /* ───────── art ───────── */
  function bowSVG(cls){ return `<svg class="${cls}" viewBox="0 0 120 130" fill="none">
    <defs><linearGradient id="tx-b1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E59A7E"/><stop offset="1" stop-color="#9E3B2E"/></linearGradient></defs>
    <path d="M40 12C84 30 84 100 40 118" stroke="url(#tx-b1)" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M40 12L40 118" stroke="#E0D6C4" stroke-width="2"/>
    <path d="M40 65L96 65" stroke="#5A4226" stroke-width="3"/>
    <path d="M96 65l-12-6m12 6l-12 6" stroke="#5A4226" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M40 65l-8 0" stroke="#5A4226" stroke-width="3"/>
    <g fill="#C4A448"><path d="M96 65l10-4-4 4 4 4z"/></g>
  </svg>`; }
  function reticleSVG(){ return `<svg viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="19" stroke="#C9DCE8" stroke-width="1" opacity="0.35"/>
    <circle cx="24" cy="24" r="14" stroke="#E59A7E" stroke-width="1.8" opacity="0.85"/>
    <path d="M24 1v9M24 38v9M1 24h9M38 24h9" stroke="#E59A7E" stroke-width="2" stroke-linecap="round"/>
    <path d="M24 14v4M24 30v4M14 24h4M30 24h4" stroke="#F0EBE0" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>
    <circle cx="24" cy="24" r="1.8" fill="#FFE48A"/>
  </svg>`; }
  function amphoraSVG(type){
    const t = (type==='gold'||type==='snake'||type==='curse'||type==='cracked') ? type : 'normal';
    const body = { normal:'url(#tx-amn)', gold:'url(#tx-amg)', snake:'url(#tx-ams)', curse:'url(#tx-amc)', cracked:'url(#tx-amk)' }[t];
    const motifCol = { normal:'#D08A52', gold:'#8F6E20', snake:'#C9DFA0', curse:'#8E6A9A', cracked:'#7A5A44' }[t];
    const bandFill = { normal:'#26130A', gold:'#3A2C10', snake:'#1E2A14', curse:'#140A16', cracked:'#20120A' }[t];
    /* per-type belly motif, red-figure style on the dark band */
    let motif='';
    if (t==='normal') {
      motif = `<path d="M27 61l4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4 4-4 4 4" stroke="${motifCol}" stroke-width="1.5" fill="none"/>`;
    } else if (t==='gold') {
      motif = `<path d="M28 60h40" stroke="${motifCol}" stroke-width="1.3"/>
      <path d="M32 60c1-3 3-4 5-4m-5 4c1 3 3 4 5 4M42 60c1-3 3-4 5-4m-5 4c1 3 3 4 5 4M52 60c1-3 3-4 5-4m-5 4c1 3 3 4 5 4M62 60c1-3 3-4 5-4m-5 4c1 3 3 4 5 4" stroke="${motifCol}" stroke-width="1.2" fill="none"/>`;
    } else if (t==='snake') {
      motif = `<path d="M26 61q5-6 10 0t10 0 10 0 10 0" stroke="${motifCol}" stroke-width="1.7" fill="none" stroke-linecap="round"/>
      <circle cx="68" cy="59.4" r="1.6" fill="${motifCol}"/><path d="M70 59l4-1.4M70 59l4 1" stroke="${motifCol}" stroke-width="0.9"/>`;
    } else if (t==='curse') {
      motif = `<path d="M31 57l6 8m0-8l-6 8M45 57l6 8m0-8l-6 8M59 57l6 8m0-8l-6 8" stroke="${motifCol}" stroke-width="1.4" stroke-linecap="round"/>`;
    } else {
      motif = `<path d="M27 61l4-4 4 4 4-4" stroke="${motifCol}" stroke-width="1.4" fill="none" opacity="0.8"/>
      <path d="M57 61l4-4 4 4 4-4" stroke="${motifCol}" stroke-width="1.4" fill="none" opacity="0.8"/>`;
    }
    const cracks =
      t==='cracked' ? `<path d="M52 34l-7 13 9 8-7 15 4 10" stroke="#1B0E07" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M34 44l6 9-4 8" stroke="#1B0E07" stroke-width="1.2" fill="none" opacity="0.8"/>
        <path d="M58 14l3 6" stroke="#1B0E07" stroke-width="1.6" stroke-linecap="round"/>` :
      t==='curse' ? `<path d="M52 36l-6 12 8 8-6 14" stroke="#0C060E" stroke-width="1.8" fill="none" stroke-linecap="round"/>
        <path d="M40 30c-3 4-3 9 0 12m18-6c2 3 2 7 0 10" stroke="#8E6A9A" stroke-width="1" fill="none" opacity="0.45"/>` : '';
    const glint = t==='gold' ? `<path d="M60 36l1.4 3.4 3.4 1.4-3.4 1.4-1.4 3.4-1.4-3.4-3.4-1.4 3.4-1.4z" fill="#FFF6D8" opacity="0.9"/>
      <path d="M36 74l1 2.4 2.4 1-2.4 1-1 2.4-1-2.4-2.4-1 2.4-1z" fill="#FFF6D8" opacity="0.75"/>` : '';
    return `<svg class="tx-amphora-svg" viewBox="0 0 96 116" fill="none">
      <defs>
        <linearGradient id="tx-amn" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#D08A52"/><stop offset="0.4" stop-color="#B5683E"/><stop offset="0.75" stop-color="#8A4526"/><stop offset="1" stop-color="#5E2D16"/></linearGradient>
        <linearGradient id="tx-amg" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#F4DC8A"/><stop offset="0.4" stop-color="#E3C766"/><stop offset="0.75" stop-color="#B08E2E"/><stop offset="1" stop-color="#755C18"/></linearGradient>
        <linearGradient id="tx-ams" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#93B061"/><stop offset="0.4" stop-color="#7E9E5C"/><stop offset="0.75" stop-color="#556F38"/><stop offset="1" stop-color="#31461F"/></linearGradient>
        <linearGradient id="tx-amc" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#57404E"/><stop offset="0.4" stop-color="#3E2C3A"/><stop offset="0.75" stop-color="#271A24"/><stop offset="1" stop-color="#140D12"/></linearGradient>
        <linearGradient id="tx-amk" x1="0" y1="0" x2="0.7" y2="1"><stop offset="0" stop-color="#8A6A4E"/><stop offset="0.4" stop-color="#6B4A38"/><stop offset="0.75" stop-color="#4C3223"/><stop offset="1" stop-color="#2E1D12"/></linearGradient>
        <linearGradient id="tx-shd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="rgba(0,0,0,0)"/><stop offset="0.62" stop-color="rgba(0,0,0,0)"/><stop offset="1" stop-color="rgba(0,0,0,0.42)"/></linearGradient>
        <radialGradient id="tx-shn" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="rgba(255,248,235,0.36)"/><stop offset="1" stop-color="rgba(255,248,235,0)"/></radialGradient>
      </defs>
      <path d="M34 10h28l-4 8c11 6 18 18 18 33 0 27-15 56-32 56S12 78 12 51c0-15 7-27 18-33z" fill="${body}"/>
      <g>
        <path d="M24 54h48v14H24z" fill="${bandFill}" opacity="0.9"/>
        <path d="M24 54h48M24 68h48" stroke="${motifCol}" stroke-width="1" opacity="0.75"/>
        ${motif}
      </g>
      <path d="M34 10h28l-4 8c11 6 18 18 18 33 0 27-15 56-32 56S12 78 12 51c0-15 7-27 18-33z" fill="url(#tx-shd)"/>
      <ellipse cx="33" cy="38" rx="10" ry="16" fill="url(#tx-shn)" transform="rotate(-16 33 38)"/>
      <path d="M31 19c-8 5-16 15-16 32 0 14 3 27 8 37" stroke="#C9DCE8" stroke-width="2" fill="none" opacity="0.45" stroke-linecap="round"/>
      <path d="M30 24h36" stroke="#2E1A10" stroke-width="3"/>
      <path d="M31 30h34" stroke="#2E1A10" stroke-width="1.4" opacity="0.55"/>
      <path d="M34 10c-7-2-12-7-12-10M62 10c7-2 12-7 12-10" stroke="#2E1A10" stroke-width="3" fill="none"/>
      <path d="M34 10c-7-2-12-7-12-10M62 10c7-2 12-7 12-10" stroke="${motifCol}" stroke-width="1" fill="none" opacity="0.5"/>
      <ellipse cx="48" cy="104" rx="7" ry="2.6" fill="rgba(0,0,0,0.35)"/>
      ${cracks}
      ${glint}
      <path d="M34 10h28l-4 8c11 6 18 18 18 33 0 27-15 56-32 56S12 78 12 51c0-15 7-27 18-33z" fill="none" stroke="#2E1A10" stroke-width="3"/>
    </svg>`;
  }

  return { open, close, _mode, _again, syncLang };
})();
window.Toxotes = Toxotes;

/* ── Games-Panel entry points ── */
window.openToxotes  = function(gp){ Toxotes.open(gp || {}); };
window.closeToxotes = function(){ Toxotes.close(); };
