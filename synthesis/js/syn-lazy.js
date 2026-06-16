// ============================================================
//  SymposiON — Synthesis Lazy Script Loader (Batch 0 framework)
//  Core of Ver1 js/lazy.js: window.lazyLoad(srcs) dedup script
//  injector + window.APP_BASE resolution from its OWN <script src>.
//  Self-contained; load EARLY in synthesis/index.html.
//
//  Public API:
//    window.lazyLoad(srcs) → Promise, loads scripts in series (dedup'd)
//    window.APP_BASE       → resolved directory that holds index.html
// ============================================================
(function () {
  'use strict';

  const _cache = new Map(); // src -> Promise (dedup + race-safe)

  // App base URL — the directory that holds index.html. Derived from this
  // file's OWN resolved <script src> so manifest paths resolve like the eager
  // <script src="js/..."> / <script src="games/..."> tags did, regardless of
  // SPA sub-route or where the dev server is rooted. syn-lazy.js lives at
  // <appBase>js/syn-lazy.js, so appBase = parent of its js/ dir.
  const _appBase = (function () {
    let self = document.currentScript;
    if (!self || !self.src) {
      self = document.querySelector('script[src*="js/syn-lazy.js"]');
    }
    try {
      return new URL('../', new URL('./', self.src)).href; // .../js/ → .../
    } catch (e) {
      return new URL('./', location.href).href;            // fallback
    }
  })();

  // Expose the resolved app base so other early code can resolve asset paths
  // the same robust way (do not clobber if a prior loader already set it).
  if (!window.APP_BASE) window.APP_BASE = _appBase;

  // Resolve a manifest src against the app base (unless already absolute).
  function _resolve(src) {
    if (/^(?:https?:)?\/\//.test(src) || src.charAt(0) === '/') return src;
    try { return new URL(src, window.APP_BASE || _appBase).href; } catch (e) { return src; }
  }

  function loadOne(src) {
    src = _resolve(src);
    if (_cache.has(src)) return _cache.get(src);
    const p = new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;            // preserve execution order within a batch
      s.dataset.lazy = src;
      s.onload = function () { resolve(src); };
      s.onerror = function () { _cache.delete(src); reject(new Error('lazyLoad failed: ' + src)); };
      document.head.appendChild(s);
    });
    _cache.set(src, p);
    return p;
  }

  // Load scripts strictly in series so later files can rely on earlier ones.
  window.lazyLoad = function (srcs) {
    return (srcs || []).reduce(function (chain, src) {
      return chain.then(function () { return loadOne(src); });
    }, Promise.resolve());
  };
})();
