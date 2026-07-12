/* ════════════════════════════════════════════════════════════════════
   syntaktiko-launch.js — opens «Συντακτικό» (Ancient Greek syntax practice).

   Self-contained study module (games/syntaktiko/) mounted full-screen in an
   iframe overlay (same convention as the arcade / gnwsto). Openers:
     openSyntaktiko(topic) → games/syntaktiko/index.html[?topic=<id>]
     openSyntaktikoAdmin() → games/syntaktiko/admin.html (curator editor)
   The optional `topic` (ptoseis / metoxes / protaseis) is forwarded from a
   tile's launch.args so a tile can deep-link to its topic; absent → the
   module opens at its first/last topic. synLaunch resolves overlay:null and
   just calls the opener (see js/manifest/syntaktiko.js).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var _close = null;
  function _appBase() { return window.APP_BASE || (new URL('./', location.href).href); }

  function open(page, title) {
    var prev = document.getElementById('syntaktiko-overlay'); if (prev) prev.remove();
    var ov = document.createElement('div');
    ov.id = 'syntaktiko-overlay'; ov.className = 'game-overlay active';
    ov.style.cssText = 'position:fixed;inset:0;z-index:9000;background:#f3efe6;';
    var onKey = function (e) { if (e.key === 'Escape') doClose(); };
    function doClose() {
      try { ov.remove(); } catch (_) {}
      document.body.classList.remove('syn-game-open');
      document.removeEventListener('keydown', onKey);
      _close = null;
    }
    _close = doClose;
    ov.innerHTML =
      '<button id="syntaktiko-close" aria-label="Έξοδος" style="position:fixed;top:14px;right:16px;z-index:10;' +
        'font:600 13px system-ui,-apple-system,sans-serif;color:#3c372e;background:rgba(251,249,243,.92);' +
        'border:1px solid rgba(146,136,115,.5);border-radius:999px;padding:8px 15px;cursor:pointer;' +
        'backdrop-filter:blur(6px)">✕ Έξοδος</button>' +
      '<iframe src="' + _appBase() + 'games/syntaktiko/' + page + '" title="' + title + '" ' +
        'style="width:100%;height:100%;border:0;display:block"></iframe>';
    document.body.appendChild(ov);
    document.body.classList.add('syn-game-open');
    ov.querySelector('#syntaktiko-close').onclick = function () { (window.closeSyntaktiko || doClose)(); };
    document.addEventListener('keydown', onKey);
    if (window.symApplyThemeClass) { try { window.symApplyThemeClass(ov); } catch (_) {} }
  }

  window.openSyntaktiko = function (topic) {
    var q = (typeof topic === 'string' && topic) ? ('index.html?topic=' + encodeURIComponent(topic)) : 'index.html';
    open(q, 'Συντακτικό — Αρχαία Ελληνικά');
  };
  window.openSyntaktikoAdmin = function () { open('admin.html', 'Συντακτικό — Διαχείριση'); };
  window.closeSyntaktiko = function () { if (_close) _close(); };
})();
