/* ════════════════════════════════════════════════════════════════════
   adidakto-launch.js — opens the ΑΔΙΔΑΚΤΟ (unseen-text) pillar.

   Three self-contained screens under games/adidakto/, each mounted
   full-screen in an iframe overlay (same convention as gnwsto/arcade):
     openAdidakto(id)     → index.html[?id=…]  (student workspace)
     openExamSim()        → exam.html          (Panhellenic simulator)
     openAdidaktoAdmin()  → admin.html         (corpus manager)
   All three share data/corpus.js (window.CORPUS_BASE) + localStorage
   'sym_corpus_v1'. Firestore-ready: corpus/exams shapes match handoff §C/§D.
   synLaunch resolves overlay:null and calls the opener (js/manifest/adidakto.js).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var _close = null;
  function _appBase() { return window.APP_BASE || (new URL('./', location.href).href); }

  function open(page, title) {
    var prev = document.getElementById('adidakto-overlay'); if (prev) prev.remove();
    var ov = document.createElement('div');
    ov.id = 'adidakto-overlay'; ov.className = 'game-overlay active';
    ov.style.cssText = 'position:fixed;inset:0;z-index:9000;background:#F7F3EA;';
    var onKey = function (e) { if (e.key === 'Escape') doClose(); };
    function doClose() {
      try { ov.remove(); } catch (_) {}
      document.body.classList.remove('syn-game-open');
      document.removeEventListener('keydown', onKey);
      _close = null;
    }
    _close = doClose;
    ov.innerHTML =
      '<button id="adidakto-close" aria-label="Έξοδος" style="position:fixed;top:14px;right:16px;z-index:10;' +
        'font:600 13px Oswald,system-ui,sans-serif;color:#1E1810;background:rgba(255,255,255,.92);' +
        'border:1px solid rgba(140,127,107,.5);border-radius:999px;padding:8px 15px;cursor:pointer;' +
        'backdrop-filter:blur(6px)">✕ Έξοδος</button>' +
      '<iframe src="' + _appBase() + 'games/adidakto/' + page + '" title="' + title + '" ' +
        'style="width:100%;height:100%;border:0;display:block"></iframe>';
    document.body.appendChild(ov);
    document.body.classList.add('syn-game-open');
    ov.querySelector('#adidakto-close').onclick = function () { (window.closeAdidakto || doClose)(); };
    document.addEventListener('keydown', onKey);
    if (window.symApplyThemeClass) { try { window.symApplyThemeClass(ov); } catch (_) {} }
  }

  window.openAdidakto = function (id) {
    var q = (typeof id === 'string' && id) ? ('index.html?id=' + encodeURIComponent(id)) : 'index.html';
    open(q, 'Αδίδακτο Κείμενο');
  };
  window.openExamSim = function () { open('exam.html', 'Προσομοίωση Πανελληνίων'); };
  window.openAdidaktoAdmin = function () { open('admin.html', 'Ανθολόγιο Αδιδάκτων — Διαχείριση'); };
  window.closeAdidakto = function () { if (_close) _close(); };
})();
