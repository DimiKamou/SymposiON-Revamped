/* ══════════════════════════════════════════════════════════════════════
   ΑΛΙΕΙΑ — FX hooks  (fx-halieia.js)
   Mounts SymFX with the Aegean theme (rising bubbles) and maps al:fx events
   to set-pieces: cast ripple, catch sparkle, frenzy combo, snap shake.
   ════════════════════════════════════════════════════════════════════════ */
window.AL_FX = (function () {
  const cx = () => window.innerWidth / 2;
  const rectOf = el => el && el.getBoundingClientRect();
  let started = false;

  function start() {
    if (started || !window.SymFX) return;
    started = true;
    SymFX.mount({
      accent: '#9DBE84', accent2: '#5E8B96',
      glow: 'rgba(106,135,82,0.5)',
      rain: false, particles: 'bubbles', fieldCount: 34,
      scanlines: false, sweep: true, grain: false, vignette: true,
      shakeSelector: '#al-wrap',
    });
  }

  window.addEventListener('al:fx', (e) => {
    if (!window.SymFX) return;
    const d = e.detail || {};
    switch (d.type) {
      case 'correct': {
        const r = rectOf(d.el);
        if (r) SymFX.burst(r.right - 14, r.top + r.height / 2,
          { colors: ['#9DBE84', '#7FB0BC', '#fff'], count: 12, power: 6, life: 850 });
        SymFX.pop(d.el, 1.04);
        SymFX.flash('rgba(106,135,82,0.16)', 0.4, 0.4);
        break;
      }
      case 'wrong':
        SymFX.shake(11, 0.5);
        SymFX.flash('rgba(158,59,46,0.45)', 0.5, 0.45);
        break;
      case 'cast':
        SymFX.shake(5, 0.3);
        SymFX.flash('rgba(127,176,188,0.16)', 0.3, 0.4);
        break;
      case 'reveal': {
        if (d.cls === 'big') {
          SymFX.flash('rgba(227,199,102,0.34)', 0.5, 0.6);
          SymFX.shake(9, 0.45);
          SymFX.burst(cx(), window.innerHeight * 0.46,
            { emoji: ['🐠', '🪙', '✦', '🐡'], count: 22, power: 11, up: 0.5, life: 1500 });
        } else if (d.cls === 'gain') {
          SymFX.burst(cx(), window.innerHeight * 0.5,
            { emoji: ['💧', '🐟', '✦'], count: 12, power: 8, up: 0.5, life: 1100 });
        } else if (d.cls === 'steal') {
          SymFX.flash('rgba(127,176,188,0.28)', 0.45, 0.5);
          SymFX.burst(cx(), window.innerHeight * 0.46,
            { emoji: ['🐙', '🪙'], count: 12, power: 9, up: 0.4, life: 1100 });
        } else { // bad: monster / empty
          SymFX.shake(16, 0.6);
          SymFX.flash('rgba(158,59,46,0.5)', 0.55, 0.6);
        }
        // frenzy callout once the streak is hot
        if ((d.cls === 'gain' || d.cls === 'big' || d.cls === 'steal') && d.streak >= 3) {
          const m = Math.min(3, 1 + d.streak * 0.25).toFixed(1);
          SymFX.combo('ΦΡΕΝΙΤΙΔΑ ×' + m, cx(), window.innerHeight * 0.3,
            { size: 46, color: '#E59A7E' });
        }
        break;
      }
      case 'win':
        SymFX.flash('rgba(157,190,132,0.4)', 0.5, 0.7);
        SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['🐠', '🪙', '🏆', '✦', '🐡'], count: 32, power: 13, up: 0.5, life: 1700 });
        setTimeout(() => SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['🪙', '✦', '🐟'], count: 18, power: 10, up: 0.5, life: 1500 }), 400);
        break;
    }
  });

  if (document.readyState !== 'loading') start();
  else window.addEventListener('DOMContentLoaded', start);

  return { start };
})();
