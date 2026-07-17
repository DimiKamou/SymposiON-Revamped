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
      // Drop the shareable #/agnwsto… deep link when the pillar closes (sym-nav
      // restores the underlying screen URL right after, when it was a game session).
      try { if (/^#\/agnwsto/.test(location.hash)) history.replaceState(history.state, '', '#/'); } catch (_) {}
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

  // Accepts nothing (author index / menu), a text id (legacy: 'lys-mantitheos'),
  // or a deep-link route ('lysias' | 'xenophon/anabasis'). The workspace resolves
  // ?route / ?id / ?author internally and renders the matching page.
  window.openAdidakto = function (spec) {
    var q = 'index.html';
    if (typeof spec === 'string' && spec) {
      // an id has a hyphen with an author prefix we know; a route is an author slug
      q += (/^(lysias|xenophon|plato|isokrates|demosthenes|thucydides)(\/|$)/.test(spec))
        ? ('?route=' + encodeURIComponent(spec))
        : ('?id=' + encodeURIComponent(spec));
    }
    open(q, 'Αδίδακτο Κείμενο');
  };
  window.openExamSim = function () { open('exam.html', 'Προσομοίωση Πανελληνίων'); };
  window.openAdidaktoAdmin = function () { open('admin.html', 'Ανθολόγιο Αδιδάκτων — Διαχείριση'); };
  window.closeAdidakto = function () { if (_close) _close(); };

  // ── shell ⇄ iframe deep-link bridge ──────────────────────────────────
  // As the student moves between the author index and a text, the workspace
  // posts its route; we reflect it in the address bar as a real, shareable
  // #/agnwsto/<author>[/<text>] link (replaceState keeps sym-nav's game state).
  window.addEventListener('message', function (e) {
    var d = e && e.data;
    if (!d || d.type !== 'adidakto:route' || !document.getElementById('adidakto-overlay')) return;
    var slug = (typeof d.slug === 'string') ? d.slug : '';
    try { history.replaceState(history.state, '', '#/agnwsto' + (slug ? '/' + slug : '')); } catch (_) {}
  });

  // Cold-load / manual deep link: symposion/#/agnwsto[/<author>[/<text>]] opens the pillar.
  function _bootAgnwsto() {
    var m = (location.hash || '').match(/^#\/agnwsto(?:\/(.+))?$/);
    if (m) { try { window.openAdidakto(m[1] || ''); } catch (_) {} }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _bootAgnwsto);
  else _bootAgnwsto();
})();
