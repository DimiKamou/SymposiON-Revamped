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

  function start() {
    if (started || !window.SymFX) return;
    started = true;
    SymFX.mount({
      accent: '#C4A448', accent2: '#D97B5C',
      rainColor: '#C9A14A', glow: 'rgba(196,164,72,0.55)',
      rainChars: 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789/\\<>=+·',
      rainCount: 24, scanlines: true, sweep: true, grain: true, vignette: true,
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
        break;
      }
      case 'wrong':
        SymFX.shake(12, 0.5);
        SymFX.flash('rgba(158,59,46,0.5)', 0.5, 0.45);
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
        break;
      }
      case 'decrypt-fail':
        SymFX.flash('rgba(140,140,140,0.28)', 0.3, 0.4);
        break;
      case 'multiply':
        SymFX.shake(8, 0.4);
        SymFX.flash('rgba(196,164,72,0.34)', 0.5, 0.55);
        SymFX.combo('×', cx(), window.innerHeight * 0.34, { size: 64, color: '#E3C766' });
        break;
      case 'divide':
        SymFX.shake(11, 0.5);
        SymFX.flash('rgba(127,176,188,0.3)', 0.4, 0.45);
        break;
      case 'bonus':
        SymFX.flash('rgba(196,164,72,0.3)', 0.45, 0.5);
        break;
      case 'curse':
        SymFX.shake(19, 0.7);
        SymFX.flash('rgba(158,59,46,0.6)', 0.6, 0.6);
        SymFX.burst(cx(), window.innerHeight * 0.4,
          { emoji: ['☠', '✦', '🩸'], count: 18, power: 10, up: 0.2, life: 1200 });
        break;
      case 'win':
        SymFX.flash('rgba(196,164,72,0.4)', 0.5, 0.7);
        SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['🪙', '👑', '✦', '🏛'], count: 32, power: 13, up: 0.5, life: 1700 });
        setTimeout(() => SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['🪙', '✦'], count: 18, power: 10, up: 0.5, life: 1500 }), 400);
        break;
    }
  });

  // auto-start once DOM + game are present
  if (document.readyState !== 'loading') start();
  else window.addEventListener('DOMContentLoaded', start);

  return { start };
})();
