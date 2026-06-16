/* ════════════════════════════════════════════════════════════════════
   SymposiON · friezes-init.js
   Wires the Greek-key friezes + seasonal ornament row into the live
   .nav and .footer, and keeps them in sync with the active season.
   Depends on: ornaments.js (window.ORN), friezes.css.
   Load AFTER ornaments.js and after the DOM (defer or end of body).

   Season source of truth = the body's `season-*` class (set by
   setSymSeason in app.js). We read it, paint the motif + decor, and
   observe the <body> class list so it updates the instant the user
   flips a season — no change needed inside setSymSeason.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  if (!window.ORN) { console.warn('[friezes] ornaments.js not loaded'); return; }
  const SEASONS = ['halloween', 'christmas', 'easter', 'carnival'];

  function currentSeason() {
    for (const s of SEASONS) if (document.body.classList.contains('season-' + s)) return s;
    return '';
  }

  // build a frieze strip element
  function frieze(kind) {
    const d = document.createElement('div');
    d.className = 'rt-frieze rt-frieze--' + kind;
    return d;
  }

  function ensureMounted() {
    const nav = document.querySelector('.nav');
    const footer = document.querySelector('.footer');
    if (nav && !nav.querySelector('.rt-frieze--nav')) nav.appendChild(frieze('nav'));
    if (footer && !footer.querySelector('.rt-frieze--foot')) {
      footer.appendChild(frieze('foot'));
      const row = document.createElement('div');
      row.className = 'rt-decor-row';
      footer.insertBefore(row, footer.firstChild);
    }
  }

  function paint() {
    const s = currentSeason();
    // motif → CSS var consumed by friezes.css (.rt-frieze mask)
    document.documentElement.style.setProperty('--rt-frieze-mask', ORN.friezeMask(s));
    // ornament row in the footer
    const row = document.querySelector('.rt-decor-row');
    if (row) row.innerHTML = ORN.iconsFor(s).map(x => `<span class="rt-di">${x[1]}</span>`).join('');
  }

  function boot() {
    ensureMounted();
    paint();
    // react to season (and theme) changes on <body>
    new MutationObserver(paint).observe(document.body, { attributes: true, attributeFilter: ['class', 'data-sym-theme'] });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
