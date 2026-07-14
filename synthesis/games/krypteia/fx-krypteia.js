/* ══════════════════════════════════════════════════════════════════════
   ΚΡΥΠΤΕΙΑ — FX hooks  (fx-krypteia.js)
   Mounts the shared SymFX ambient layer with the Krypteia theme and maps the
   engine's kr:fx events to cinematic set-pieces. Safe no-op without SymFX.
   ════════════════════════════════════════════════════════════════════════ */
window.KR_FX = (function () {
  const stage = () => document.getElementById('kr-wrap');
  const rectOf = el => el && el.getBoundingClientRect();
  const cx = () => window.innerWidth / 2;
  let started = false;
  // weak-device heuristic (matches game.js): halve the ambient glyph rain
  const LITE = (function () {
    try { return matchMedia('(pointer:coarse)').matches || innerWidth < 720 || (navigator.deviceMemory || 8) <= 4; }
    catch (_) { return false; }
  })();

  /* ── tiny procedural WebAudio flourishes (no assets, gesture-gated) ──
     The context is created lazily inside event handlers that only ever run
     as a result of a user click, so autoplay policies are satisfied. */
  let AC = null, AMG = null;
  function ac() {
    try {
      if (!AC) {
        const Ctor = window.AudioContext || window.webkitAudioContext;
        if (!Ctor) return null;
        AC = new Ctor();
        AMG = AC.createGain(); AMG.gain.value = 0.15; AMG.connect(AC.destination);
      }
      if (AC.state === 'suspended') AC.resume();
    } catch (_) { AC = null; }
    return AC;
  }
  function tone(f0, o) {
    const c = ac(); if (!c) return;
    o = o || {};
    try {
      const t0 = c.currentTime + (o.t || 0), d = o.d || 0.18;
      const osc = c.createOscillator(), g = c.createGain();
      osc.type = o.type || 'sine';
      osc.frequency.setValueAtTime(f0, t0);
      if (o.f1) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.f1), t0 + d);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(o.v || 0.4, t0 + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + d);
      osc.connect(g); g.connect(AMG);
      osc.start(t0); osc.stop(t0 + d + 0.03);
    } catch (_) {}
  }
  function hiss(o) {
    const c = ac(); if (!c) return;
    o = o || {};
    try {
      const t0 = c.currentTime + (o.t || 0), d = o.d || 0.08;
      const n = Math.max(1, Math.round(c.sampleRate * d));
      const buf = c.createBuffer(1, n, c.sampleRate);
      const ch = buf.getChannelData(0);
      for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = c.createBufferSource(); src.buffer = buf;
      const bp = c.createBiquadFilter(); bp.type = 'bandpass';
      bp.frequency.value = o.fc || 3000; bp.Q.value = o.q || 1;
      const g = c.createGain(); g.gain.value = o.v || 0.25;
      src.connect(bp); bp.connect(g); g.connect(AMG);
      src.start(t0);
    } catch (_) {}
  }
  const SND = {
    correct(){ tone(660,{d:.13,type:'triangle',v:.3}); tone(990,{t:.085,d:.2,type:'triangle',v:.26}); },
    wrong(){ tone(150,{d:.28,type:'sawtooth',v:.2,f1:65}); hiss({d:.12,v:.16,fc:420,q:.8}); },
    tap(r){ hiss({d:.028,v:.3,fc:5200,q:2}); tone(1250*(1+.55*(r||0)),{d:.05,type:'square',v:.1}); },
    unlock(){ tone(185,{d:.11,type:'square',v:.26}); tone(880,{t:.08,d:.14,type:'sine',v:.2}); tone(1175,{t:.15,d:.16,type:'sine',v:.18}); tone(1568,{t:.22,d:.22,type:'sine',v:.16}); },
    held(){ tone(220,{d:.5,type:'sine',v:.24,f1:150}); },
    coins(){ [1318,1661,2093].forEach((f,i)=>tone(f,{t:i*.06,d:.14,type:'sine',v:.14})); },
    whoosh(){ hiss({d:.2,v:.1,fc:820,q:.6}); },
    flip(){ hiss({d:.14,v:.12,fc:1200,q:.9}); tone(520,{d:.1,type:'triangle',v:.1,f1:760}); },
    dice(){ [0,.09,.2].forEach(t=>hiss({t,d:.04,v:.2,fc:2400,q:1.4})); },
    divide(){ tone(520,{d:.2,type:'square',v:.16,f1:240}); },
    curse(){ tone(233,{d:.65,type:'sawtooth',v:.2,f1:104}); tone(110,{d:.65,type:'sine',v:.2}); },
    dash(){ hiss({d:.3,v:.16,fc:640,q:.5}); },
    win(){ [523,659,784,1047].forEach((f,i)=>tone(f,{t:i*.11,d:.3,type:'triangle',v:.2})); },
    lose(){ tone(392,{d:.55,type:'sine',v:.2,f1:196}); },
  };

  /* ── shadow-dash: a cloaked runner streaks across the screen on raids ── */
  function shadowDash() {
    if (window.SymFX && SymFX.reduce) return;
    try {
      const d = document.createElement('div');
      d.className = 'krx-dash';
      d.innerHTML =
        '<svg viewBox="0 0 190 104">' +
          '<path class="krx-streak" d="M4,66 C40,58 96,54 148,58"/>' +
          '<path class="krx-cape" d="M16,44 C44,24 86,20 112,32 C96,38 84,46 76,58 C56,48 34,46 16,44 Z"/>' +
          '<path class="krx-body" d="M112,32 c6,-9 20,-8 23,1 c2,7 -4,13 -12,13 l-8,14 20,12 c5,3 2,10 -4,8 l-27,-8 -10,18 c-3,5 -11,3 -10,-3 l4,-23 -24,-5 c-6,-2 -5,-9 1,-9 l27,0 7,-14 c-5,-1 -9,-2 -13,-4 Z"/>' +
          '<circle class="krx-glint" cx="164" cy="44" r="3"/>' +
        '</svg>';
      document.body.appendChild(d);
      const y = window.innerHeight * (0.28 + Math.random() * 0.3);
      const fromL = Math.random() < 0.5;
      const x0 = fromL ? -210 : window.innerWidth + 30;
      const x1 = fromL ? window.innerWidth + 30 : -210;
      d.style.top = y + 'px';
      d.animate([
        { transform: 'translateX(' + x0 + 'px) scaleX(' + (fromL ? 1 : -1) + ') skewX(-6deg)', opacity: 0 },
        { opacity: 0.92, offset: 0.14 },
        { opacity: 0.92, offset: 0.8 },
        { transform: 'translateX(' + x1 + 'px) translateY(-16px) scaleX(' + (fromL ? 1 : -1) + ') skewX(-13deg)', opacity: 0 },
      ], { duration: 720, easing: 'cubic-bezier(.3,.1,.2,1)', fill: 'forwards' });
      setTimeout(() => { try { d.remove(); } catch (_) {} }, 800);
      SND.dash();
    } catch (_) {}
  }

  function start() {
    if (started || !window.SymFX) return;
    started = true;
    SymFX.mount({
      accent: '#C4A448', accent2: '#D97B5C',
      rainColor: '#C9A14A', glow: 'rgba(196,164,72,0.55)',
      rainChars: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789/\\<>=+·',
      rainCount: LITE ? 12 : 24, scanlines: true, sweep: !LITE, grain: !LITE, vignette: true,
      shakeSelector: '#kr-wrap',
    });
  }

  window.addEventListener('kr:fx', (e) => {
    if (!window.SymFX) return;
    const d = e.detail || {};
    switch (d.type) {
      case 'screen': {
        // entrance is handled by the CSS transform-only keyframe (krx-screenin),
        // which never traps opacity — so content is visible even if animations
        // are frozen. We only add an additive child stagger on capable views.
        break;
      }
      case 'correct': {
        const r = rectOf(d.el);
        if (r) SymFX.burst(r.right - 14, r.top + r.height / 2,
          { colors: ['#E3C766', '#A9C98C', '#fff'], count: 14, power: 7, life: 900 });
        SymFX.pop(d.el, 1.04);
        SymFX.flash('rgba(196,164,72,0.16)', 0.4, 0.4);
        SND.correct();
        break;
      }
      case 'wrong':
        SymFX.shake(12, 0.5);
        SymFX.flash('rgba(158,59,46,0.5)', 0.5, 0.45);
        SND.wrong();
        break;
      case 'op':
        SND.whoosh();
        break;
      case 'flip':
        SND.flip();
        break;
      case 'dice':
        SND.dice();
        break;
      case 'decrypt-start': {
        // glyph-scramble the target codename into focus
        const n = document.querySelector('.kr-dx-target .n');
        if (n && d.name) SymFX.scramble(n, d.name, { duration: 750 });
        break;
      }
      case 'decrypt-tap': {
        const r = rectOf(d.el);
        if (r) SymFX.burst(r.left + r.width / 2, r.top + r.height / 2,
          { colors: ['#A9C98C', '#E3C766'], count: 6, power: 4, life: 600 });
        // lockpick ratchet: each accepted letter turns the rod one notch
        // (--krx-spin scrolls the ring-notch texture; tiny torque jolt on the
        // whole prop). Purely decorative — gameplay state untouched.
        if (!SymFX.reduce) {
          try {
            const rod = document.querySelector('.kr-scy-rod');
            if (rod) {
              const cur = parseFloat(rod.style.getPropertyValue('--krx-spin')) || 0;
              rod.style.setProperty('--krx-spin', String(cur + 9));
            }
            const scy = document.querySelector('.kr-scytale');
            if (scy && scy.animate) scy.animate(
              [ { transform: 'rotate(0deg)' },
                { transform: 'rotate(-1.2deg) translateY(1px)', offset: 0.3 },
                { transform: 'rotate(0.5deg)', offset: 0.68 },
                { transform: 'rotate(0deg)' } ],
              { duration: 230, easing: 'cubic-bezier(.3,.7,.2,1)' });
          } catch (_) {}
        }
        SND.tap(d.of ? (d.n || 0) / d.of : 0);
        break;
      }
      case 'decrypt-win': {
        SymFX.shake(d.kind === 'reduce' ? 15 : 10, 0.55);
        if (d.kind === 'reduce') {
          SymFX.flash('rgba(217,123,92,0.5)', 0.55, 0.55);
          SymFX.burst(cx(), window.innerHeight * 0.4,
            { emoji: ['🔥', '✦'], count: 16, power: 9, up: 0.3, life: 1100 });
        } else {
          SymFX.flash('rgba(196,164,72,0.3)', 0.5, 0.5);
        }
        SND.unlock();
        if (d.kind === 'steal') { setTimeout(shadowDash, 120); SND.coins(); }
        break;
      }
      case 'decrypt-fail':
        SymFX.flash('rgba(140,140,140,0.28)', 0.3, 0.4);
        SND.held();
        break;
      case 'multiply':
        SymFX.shake(8, 0.4);
        SymFX.flash('rgba(196,164,72,0.34)', 0.5, 0.55);
        SymFX.combo('×', cx(), window.innerHeight * 0.34, { size: 64, color: '#E3C766' });
        SND.coins();
        break;
      case 'divide':
        SymFX.shake(11, 0.5);
        SymFX.flash('rgba(127,176,188,0.3)', 0.4, 0.45);
        SND.divide();
        break;
      case 'bonus':
        SymFX.flash('rgba(196,164,72,0.3)', 0.45, 0.5);
        SND.coins();
        break;
      case 'curse':
        SymFX.shake(19, 0.7);
        SymFX.flash('rgba(158,59,46,0.6)', 0.6, 0.6);
        SymFX.burst(cx(), window.innerHeight * 0.4,
          { emoji: ['☠', '✦', '🩸'], count: 18, power: 10, up: 0.2, life: 1200 });
        SND.curse();
        setTimeout(shadowDash, 200);
        break;
      case 'win':
        SymFX.flash('rgba(196,164,72,0.4)', 0.5, 0.7);
        SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['🪙', '👑', '✦', '🏛'], count: 32, power: 13, up: 0.5, life: 1700 });
        setTimeout(() => SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['🪙', '✦'], count: 18, power: 10, up: 0.5, life: 1500 }), 400);
        SND.win();
        break;
      case 'lose':
        SND.lose();
        break;
    }
  });

  // auto-start once DOM + game are present
  if (document.readyState !== 'loading') start();
  else window.addEventListener('DOMContentLoaded', start);

  return { start };
})();
