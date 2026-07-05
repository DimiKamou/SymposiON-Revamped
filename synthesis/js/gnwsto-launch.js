/* ════════════════════════════════════════════════════════════════════
   gnwsto-launch.js — opens «Διδαγμένο Κείμενο» (Αρχαία Γ΄ Λυκείου).

   The study module (games/gnwsto/) is a self-contained HTML page. We mount
   it full-screen in an iframe overlay (same convention as the arcade —
   js/arcade-launch.js). Two openers:
     openGnwsto()      → games/gnwsto/index.html   (student study/self-test)
     openGnwstoAdmin() → games/gnwsto/admin.html   (curator editor; edits
                          persist to localStorage + export-to-code)
   synLaunch resolves overlay:null and just calls the opener (see
   js/manifest/gnwsto.js).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var _close = null; // teardown for the currently-open overlay

  function _appBase() { return window.APP_BASE || (new URL('./', location.href).href); }

  function open(page, title) {
    var prev = document.getElementById('gnwsto-overlay'); if (prev) prev.remove();

    var ov = document.createElement('div');
    ov.id = 'gnwsto-overlay'; ov.className = 'game-overlay active';
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
      '<button id="gnwsto-close" aria-label="Έξοδος" style="position:fixed;top:14px;right:16px;z-index:10;' +
        'font:600 13px system-ui,-apple-system,sans-serif;color:#3c372e;background:rgba(251,249,243,.92);' +
        'border:1px solid rgba(146,136,115,.5);border-radius:999px;padding:8px 15px;cursor:pointer;' +
        'backdrop-filter:blur(6px)">✕ Έξοδος</button>' +
      '<iframe src="' + _appBase() + 'games/gnwsto/' + page + '" title="' + title + '" ' +
        'style="width:100%;height:100%;border:0;display:block"></iframe>';

    document.body.appendChild(ov);
    document.body.classList.add('syn-game-open');
    ov.querySelector('#gnwsto-close').onclick = function () { (window.closeGnwsto || doClose)(); };
    document.addEventListener('keydown', onKey);
    if (window.symApplyThemeClass) { try { window.symApplyThemeClass(ov); } catch (_) {} }
  }

  window.openGnwsto      = function () { open('index.html', 'Διδαγμένο Κείμενο — Αρχαία Γ΄ Λυκείου'); };
  window.openGnwstoAdmin = function () { open('admin.html', 'Διδαγμένο Κείμενο — Διαχείριση'); };
  window.closeGnwsto     = function () { if (_close) _close(); };
})();
