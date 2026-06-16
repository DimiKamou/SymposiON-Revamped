// ============================================================
//  Λατινικές Αντωνυμίες — Θεωρία & Μελέτη (launcher)
//  games/lat-antonymies/theory.js
//
//  Hosts the polished standalone build (theory-study.html) inside the
//  existing #latpt-overlay via an iframe. The standalone page consumes the
//  verified shared dataset (data.js → LAT_P_DB) and inherits the active
//  SymposiON theme: we copy the host's --sym-* tokens into the iframe on load.
//
//  Entry points (global): openLatAntonymiesTheory(), closeLatAntonymiesTheory()
//  This is additive — it touches no auth/checkout/routing/Firebase/game logic.
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
    return (base ? base.replace(/\/?$/, '/') : '') + 'games/lat-antonymies/theory-study.html';
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

  window.openLatAntonymiesTheory = function () {
    const ov = document.getElementById('latpt-overlay');
    if (!ov) return;
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';

    const wrap = document.getElementById('latpt-wrap');
    if (!wrap) return;
    let frame = document.getElementById('latpt-frame');
    if (!frame) {
      wrap.style.position = 'relative';
      wrap.style.padding = '0';
      wrap.innerHTML = '';
      frame = document.createElement('iframe');
      frame.id = 'latpt-frame';
      frame.title = 'Αντωνυμίες — Θεωρία & Μελέτη';
      frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:transparent;';
      frame.addEventListener('load', () => syncTheme(frame));
      frame.src = SRC + '#0';
      wrap.appendChild(frame);
    } else {
      // reuse: re-tint and land on the Παράδειγμα (Explorer) tab
      try { if (frame.contentWindow.location.hash !== '#0') frame.contentWindow.location.hash = '#0'; } catch (e) {}
      syncTheme(frame);
    }
  };

  window.closeLatAntonymiesTheory = function () {
    const ov = document.getElementById('latpt-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
  };
})();
