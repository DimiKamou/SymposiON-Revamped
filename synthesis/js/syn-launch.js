// ============================================================
//  SymposiON — Synthesis Game Launcher (Batch 0 framework)
//  Injector + dispatcher that mirrors Ver1's lazy-loader, but driven
//  by a per-batch manifest (SYN_GAMES) and a tile→openFn map
//  (SYN_LAUNCH_MAP). Game batch agents only append to manifest
//  fragments under js/manifest/ and drop overlay partials in overlays/.
//
//  Public API (all on window):
//    synEnsureCss(cssArr)        inject <link rel=stylesheet> once per href
//    synEnsureOverlay(id)        fetch+inject overlays/<id>.html once (tolerant)
//    synEnsureFirebase()         no-op (FB already loaded by index.html)
//    synLaunch(openFn, ...args)  load deps + call the real Ver1 opener
//    synResolveLaunch(tile)      tile → openFn (via tile.launch.fn or map)
// ============================================================
(function () {
  'use strict';

  // Shared registries — initialised once; batch fragments Object.assign onto them.
  window.SYN_GAMES = window.SYN_GAMES || {};
  window.SYN_LAUNCH_MAP = window.SYN_LAUNCH_MAP || {};

  function _appBase() {
    return window.APP_BASE || (new URL('./', location.href).href);
  }

  // Inject a <link rel=stylesheet> once per href (idempotent).
  function synEnsureCss(cssArr) {
    (cssArr || []).forEach(function (href) {
      if (!href) return;
      var resolved = /^(?:https?:)?\/\//.test(href) || href.charAt(0) === '/'
        ? href : (_appBase() + href);
      // Idempotent: skip if a link with the same resolved href is already present.
      var existing = document.querySelector('link[data-syn-css="' + href + '"]');
      if (existing) return;
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = resolved;
      link.dataset.synCss = href;
      document.head.appendChild(link);
    });
  }

  // If the overlay element already exists, no-op. Otherwise fetch its partial
  // from overlays/<id>.html and inject into <body>. Tolerates a missing/404
  // partial without throwing (logs a warning and resolves).
  function synEnsureOverlay(id) {
    if (!id) return Promise.resolve();
    if (document.getElementById(id)) return Promise.resolve();
    var url = _appBase() + 'overlays/' + id + '.html';
    return fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error('overlay partial ' + r.status + ' ' + url);
        return r.text();
      })
      .then(function (html) {
        // Re-check in case a concurrent launch already injected it.
        if (document.getElementById(id)) return;
        var wrap = document.createElement('div');
        wrap.innerHTML = html;
        while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
      })
      .catch(function (e) {
        console.warn('[syn] overlay partial unavailable for "' + id + '"', e && e.message);
      });
  }

  // Firebase is already loaded eagerly by synthesis/index.html (firebase-config.js
  // + auth.js). This is a safe no-op so manifest entries can declare fb:true.
  function synEnsureFirebase() {
    return Promise.resolve();
  }

  // Load a game's deps (per its manifest entry) then invoke the real opener.
  async function synLaunch(openFn, ...args) {
    if (window.SymLoader && typeof SymLoader.show === 'function') {
      try { SymLoader.show(); } catch (_) {}
    }
    var m = window.SYN_GAMES[openFn];
    if (!m) { console.warn('[syn] no manifest entry', openFn); return; }
    try {
      if (m.fb) await synEnsureFirebase();
      synEnsureCss(m.css || []);
      if (m.overlay) await synEnsureOverlay(m.overlay);
      await window.lazyLoad(m.js || []);
    } finally {
      if (window.SymLoader && typeof SymLoader.hide === 'function') {
        try { SymLoader.hide(); } catch (_) {}
      }
    }
    if (typeof window[openFn] === 'function') {
      return window[openFn].apply(window, args);
    }
    console.warn('[syn] opener missing after load', openFn);
  }

  // Resolve a revamp tile object to its openFn: explicit launch.fn wins,
  // else fall back to the display-name map (English then Greek).
  function synResolveLaunch(tile) {
    return (tile && tile.launch && tile.launch.fn) ||
      window.SYN_LAUNCH_MAP[tile && tile.en] ||
      window.SYN_LAUNCH_MAP[tile && tile.gr] ||
      null;
  }

  window.synEnsureCss = synEnsureCss;
  window.synEnsureOverlay = synEnsureOverlay;
  window.synEnsureFirebase = synEnsureFirebase;
  window.synLaunch = synLaunch;
  window.synResolveLaunch = synResolveLaunch;
})();
