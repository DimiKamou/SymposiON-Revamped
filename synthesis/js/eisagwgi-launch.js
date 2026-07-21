/* ════════════════════════════════════════════════════════════════════
   eisagwgi-launch.js — opens «Εισαγωγή» (Αρχαία Γ΄ Λυκείου, Φιλοσοφικός Λόγος).

   The module (games/eisagwgi/) is a self-contained HTML page (theory + quiz).
   We mount it full-screen in an iframe overlay (same convention as the arcade
   / gnwsto — js/gnwsto-launch.js). Openers:
     openEisagwgi()      → games/eisagwgi/index.html   (student theory + quiz)
     openEisagwgiAdmin() → games/eisagwgi/admin.html   (curator editor, if present)
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var _close = null;
  function _appBase() { return window.APP_BASE || (new URL('./', location.href).href); }

  function open(page, title) {
    var prev = document.getElementById('eisagwgi-overlay'); if (prev) prev.remove();
    var ov = document.createElement('div');
    ov.id = 'eisagwgi-overlay'; ov.className = 'game-overlay active';
    ov.style.cssText = 'position:fixed;inset:0;z-index:9000;background:#f4f1ea;';
    var onKey = function (e) { if (e.key === 'Escape') doClose(); };
    function doClose() {
      try { ov.remove(); } catch (_) {}
      document.body.classList.remove('syn-game-open');
      document.removeEventListener('keydown', onKey);
      _close = null;
    }
    _close = doClose;
    ov.innerHTML =
      '<button id="eisagwgi-close" aria-label="Έξοδος" style="position:fixed;top:14px;right:16px;z-index:10;' +
        'font:600 13px system-ui,-apple-system,sans-serif;color:#3c372e;background:rgba(251,249,243,.92);' +
        'border:1px solid rgba(146,136,115,.5);border-radius:999px;padding:8px 15px;cursor:pointer;' +
        'backdrop-filter:blur(6px)">✕ Έξοδος</button>' +
      '<iframe src="' + _appBase() + 'games/eisagwgi/' + page + '" title="' + title + '" ' +
        'style="width:100%;height:100%;border:0;display:block"></iframe>';
    document.body.appendChild(ov);
    document.body.classList.add('syn-game-open');
    ov.querySelector('#eisagwgi-close').onclick = function () { (window.closeEisagwgi || doClose)(); };
    document.addEventListener('keydown', onKey);
    if (window.symApplyThemeClass) { try { window.symApplyThemeClass(ov); } catch (_) {} }
  }

  window.openEisagwgi      = function () { open('index.html', 'Εισαγωγή — Αρχαία Γ′ Λυκείου'); };
  window.openEisagwgiAdmin = function () { open('admin.html', 'Εισαγωγή — Διαχείριση'); };
  window.closeEisagwgi     = function () { if (_close) _close(); };
})();
