// ============================================================
//  Λατινικά Ουσιαστικά — Θεωρία & Μελέτη (launcher)
//  games/lat-nouns-kata/theory.js
//
//  Hosts the polished standalone build (theory-study.html) inside the
//  existing #latnt-overlay via an iframe. The standalone page consumes the
//  verified shared dataset (data.js → LATNK_DB) and inherits the active
//  SymposiON theme: we copy the host's --sym-* tokens into the iframe on load.
//
//  Entry points (global): openLatNounsKataTheory(), closeLatNounsKataTheory()
//  Additive — touches no auth/checkout/routing/Firebase/game logic.
// ============================================================
(function () {
  'use strict';

  // Resolve theory-study.html as an ABSOLUTE url derived from this script's own
  // location, so it works regardless of the SPA route the user is on (on
  // localhost the app injects no <base href>, so a relative src would resolve
  // against deep routes like /gram-lat/rimata and 404).
  const SELF = document.currentScript;
  function resolveSrc() {
    try { if (SELF && SELF.src) return SELF.src.replace(/theory\.js(\?[^#]*)?$/, 'theory-study.html'); } catch (e) {}
    const base = (typeof window !== 'undefined' && window.APP_BASE) ||
                 (document.querySelector('base') && document.querySelector('base').href) || '';
    return (base ? base.replace(/\/?$/, '/') : '') + 'games/lat-nouns-kata/theory-study.html';
  }
  const SRC = resolveSrc();
  const SYM = ['--sym-bg','--sym-bg-card','--sym-bg-raise','--sym-gold',
               '--sym-gold-lt','--sym-fg','--sym-fg-muted'];

  // copy the host app's theme tokens into the (same-origin) iframe so the
  // module re-tints with the active theme; harmless no-op if tokens are unset.
  function syncTheme(frame) {
    try {
      const idoc = frame.contentDocument;
      if (!idoc || !idoc.body) return;
      const cs = getComputedStyle(document.body);
      SYM.forEach(k => { const v = cs.getPropertyValue(k).trim(); if (v) idoc.body.style.setProperty(k, v); });
    } catch (e) { /* same-origin expected; ignore if blocked */ }
  }

  window.openLatNounsKataTheory = function () {
    const ov = document.getElementById('latnt-overlay');
    if (!ov) return;
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';

    const wrap = document.getElementById('latnt-wrap');
    if (!wrap) return;
    let frame = document.getElementById('latnt-frame');
    if (!frame) {
      wrap.style.position = 'relative';
      wrap.style.padding = '0';
      wrap.innerHTML = '';
      frame = document.createElement('iframe');
      frame.id = 'latnt-frame';
      frame.title = 'Ουσιαστικά — Θεωρία & Μελέτη';
      frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:transparent;';
      frame.addEventListener('load', () => syncTheme(frame));
      frame.src = SRC + '#0';
      wrap.appendChild(frame);
    } else {
      try { if (frame.contentWindow.location.hash !== '#0') frame.contentWindow.location.hash = '#0'; } catch (e) {}
      syncTheme(frame);
    }
  };

  window.closeLatNounsKataTheory = function () {
    const ov = document.getElementById('latnt-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
  };
})();
