/* ══════════════════════════════════════════════════════════════════════
   ΗΓΕΜΟΝΙΑ — FX hooks  (fx-hegemonia.js)
   Mounts SymFX with the war theme (rising embers) and maps hg:fx events to
   set-pieces: flag-plant burst at the tile, glory flash, conquest finale.
   ════════════════════════════════════════════════════════════════════════ */
window.HG_FX = (function () {
  const cx = () => window.innerWidth / 2;
  const rectOf = el => el && el.getBoundingClientRect();
  let started = false;

  function start() {
    if (started || !window.SymFX) return;
    started = true;
    SymFX.mount({
      accent: '#D97B5C', accent2: '#9E3B2E',
      glow: 'rgba(217,123,92,0.5)',
      rain: false, particles: 'embers', fieldCount: 30,
      scanlines: true, sweep: false, grain: true, vignette: true,
      shakeSelector: '#hg-wrap',
    });
  }

  window.addEventListener('hg:fx', (e) => {
    if (!window.SymFX) return;
    const d = e.detail || {};
    switch (d.type) {
      case 'correct': {
        const r = rectOf(d.el);
        if (r) SymFX.burst(r.right - 14, r.top + r.height / 2,
          { colors: ['#E3C766', '#D97B5C', '#fff'], count: 12, power: 6, life: 850 });
        SymFX.pop(d.el, 1.04);
        SymFX.flash('rgba(217,123,92,0.16)', 0.4, 0.4);
        if (d.flags >= 3) SymFX.combo('×3 ΣΗΜΑΙΕΣ', cx(), window.innerHeight * 0.28, { size: 40, color: '#E3C766' });
        break;
      }
      case 'wrong':
        SymFX.shake(12, 0.5);
        SymFX.flash('rgba(158,59,46,0.45)', 0.5, 0.45);
        break;
      case 'plant': {
        // burst of embers at the just-claimed tile — the conquest beat
        const tile = document.querySelector(`#hg-tiles .hg-tile[data-i="${d.i}"]`);
        const r = rectOf(tile);
        if (r) SymFX.burst(r.left + r.width / 2, r.top + r.height / 2,
          { emoji: ['⚑', '✦'], count: 7, power: 6, up: 0.4, size: 16, life: 900 });
        SymFX.flash('rgba(217,123,92,0.12)', 0.3, 0.35);
        break;
      }
      case 'win':
        SymFX.flash('rgba(217,123,92,0.4)', 0.5, 0.7);
        SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['⚑', '👑', '✦', '🏛'], count: 30, power: 13, up: 0.5, life: 1700 });
        setTimeout(() => SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['⚑', '✦'], count: 18, power: 10, up: 0.5, life: 1500 }), 400);
        break;
    }
  });

  if (document.readyState !== 'loading') start();
  else window.addEventListener('DOMContentLoaded', start);

  return { start };
})();
