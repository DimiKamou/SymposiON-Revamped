/* ══════════════════════════════════════════════════════════════════════
   ΧΡΥΣΟΜΑΛΛΟΝ ΔΕΡΑΣ — FX hooks  (fx-fleece.js)
   Mounts SymFX with the gold-dust theme and maps gf:fx events to set-pieces:
   gold fountain, theft/swap shimmer, Pandora's shatter, the Fleece finale.
   ════════════════════════════════════════════════════════════════════════ */
window.GF_FX = (function () {
  const cx = () => window.innerWidth / 2;
  const rectOf = el => el && el.getBoundingClientRect();
  /* cheap heuristic for mid/low-end phones: thin the ambient layer there */
  const LITE = matchMedia("(pointer:coarse)").matches || innerWidth < 720 || (navigator.deviceMemory || 8) <= 4;
  let started = false;

  function start() {
    if (started || !window.SymFX) return;
    started = true;
    SymFX.mount({
      accent: '#C4A448', accent2: '#5E8B96',
      glow: 'rgba(196,164,72,0.5)',
      rain: false, particles: 'motes', fieldCount: LITE ? 14 : 32,
      scanlines: false, sweep: true, grain: false, vignette: true,
      shakeSelector: '#gf-wrap',
    });
  }

  window.addEventListener('gf:fx', (e) => {
    if (!window.SymFX) return;
    const d = e.detail || {};
    const midY = window.innerHeight * 0.45;
    switch (d.type) {
      case 'correct': {
        const r = rectOf(d.el);
        if (r) SymFX.burst(r.right - 14, r.top + r.height / 2,
          { colors: ['#E3C766', '#C4A448', '#fff'], count: 12, power: 6, life: 850 });
        SymFX.pop(d.el, 1.04);
        SymFX.flash('rgba(196,164,72,0.14)', 0.35, 0.4);
        break;
      }
      case 'wrong':
        SymFX.shake(11, 0.5);
        SymFX.flash('rgba(158,59,46,0.45)', 0.5, 0.45);
        break;
      case 'gold':
        SymFX.flash('rgba(227,199,102,0.3)', 0.45, 0.55);
        SymFX.burst(cx(), midY, { emoji: ['🪙', '✦'], count: 18, power: 11, up: 0.5, life: 1400 });
        break;
      case 'steal':
        SymFX.flash('rgba(127,176,188,0.26)', 0.4, 0.5);
        SymFX.burst(cx(), midY, { emoji: ['🪽', '🪙'], count: 12, power: 9, up: 0.4, life: 1100 });
        break;
      case 'swap':
        SymFX.shake(7, 0.4);
        SymFX.flash('rgba(127,176,188,0.24)', 0.4, 0.5);
        SymFX.combo('⇄', cx(), window.innerHeight * 0.32, { size: 64, color: '#7FB0BC' });
        break;
      case 'pandora':
        SymFX.shake(20, 0.75);
        SymFX.flash('rgba(158,59,46,0.6)', 0.6, 0.65);
        SymFX.burst(cx(), midY, { emoji: ['🏺', '☠', '✦'], count: 18, power: 11, up: 0.2, life: 1300 });
        break;
      case 'win':
        SymFX.flash('rgba(227,199,102,0.42)', 0.5, 0.7);
        SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['🪙', '🐏', '✦', '🏆'], count: 32, power: 13, up: 0.5, life: 1700 });
        setTimeout(() => SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['🪙', '✦'], count: 18, power: 10, up: 0.5, life: 1500 }), 400);
        break;
    }
  });

  if (document.readyState !== 'loading') start();
  else window.addEventListener('DOMContentLoaded', start);

  return { start };
})();
