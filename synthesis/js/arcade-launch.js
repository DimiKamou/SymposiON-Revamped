/* ════════════════════════════════════════════════════════════════════
   arcade-launch.js — opens the Iliada / Odyssea Arcade.

   The combat-quiz arcade (games/iliada-arcade/) is a self-contained HTML
   document. We mount it full-screen in an iframe overlay (same convention as
   Anodos), pinned to one campaign via ?campaign=, and seed the admin-edited
   rhapsody/quiz content across via localStorage (the game's play/config.js
   reads it). SymNav (js/sym-nav.js) treats it as a game session: its
   synLaunch wrap pushes the /play entry + wraps closeIliadaArcade /
   closeOdysseaArcade so browser Back prompts and closes it.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Hand the admin-edited content (config/arcadeContent → SymStore mirror) to
  // the game tab via localStorage, so play/config.js can merge it over the
  // bundled defaults. Cleared when there is no override.
  function seedContent() {
    try {
      var cfg = (window.SymStore && typeof SymStore.get === 'function') ? SymStore.get('arcade_content', null) : null;
      if (cfg && typeof cfg === 'object') localStorage.setItem('ARCADE_CONTENT', JSON.stringify(cfg));
      else localStorage.removeItem('ARCADE_CONTENT');
    } catch (_) {}
  }

  // Map an app-wide MC bank entry {q:{gr,en}|string, a:[options], c:index} to the
  // arcade's quiz shape {q:string, o:[≤4 options], a:correctIndex}. Drops entries
  // without a prompt or fewer than 2 options; clamps the correct index in range.
  function _mapBank(qs) {
    return (qs || []).map(function (e) {
      if (!e) return null;
      var q = (e.q && typeof e.q === 'object') ? (e.q.gr || e.q.en || '') : (e.q || '');
      var o = (Array.isArray(e.a) ? e.a : (Array.isArray(e.o) ? e.o : [])).slice(0, 4).map(String);
      var c = (typeof e.c === 'number') ? e.c : (typeof e.a === 'number' ? e.a : 0);
      if (c < 0 || c >= o.length) c = 0;
      return (q && o.length >= 2) ? { q: String(q), o: o, a: c } : null;
    }).filter(Boolean);
  }
  // Seed / clear the injected practice bank the arcade reads (localStorage, same
  // origin as the iframe). Called with the picked bank from the Game-Panel picker.
  function seedBank(cfg) {
    try {
      var pool = (cfg && cfg.questions) ? _mapBank(cfg.questions) : null;
      if (pool && pool.length) localStorage.setItem('ARCADE_QUESTION_BANK', JSON.stringify(pool));
      else localStorage.removeItem('ARCADE_QUESTION_BANK');
    } catch (_) {}
  }

  var _close = null; // teardown for the currently-open overlay

  function openArcade(campaign, cfg) {
    seedContent();
    seedBank(cfg);
    var endless = !!(cfg && cfg.endless);
    var prev = document.getElementById('arcade-overlay'); if (prev) prev.remove();

    var ov = document.createElement('div');
    ov.id = 'arcade-overlay'; ov.className = 'game-overlay active';
    ov.style.cssText = 'position:fixed;inset:0;z-index:9000;background:#05060a;';

    var esc = function (e) { if (e.key === 'Escape') doClose(); };
    function doClose() {
      try { ov.remove(); } catch (_) {}
      document.body.classList.remove('syn-game-open');
      document.removeEventListener('keydown', esc);
      _close = null;
    }
    _close = doClose;

    var closeGlobal = (campaign === 'odysseia') ? 'closeOdysseaArcade' : 'closeIliadaArcade';
    ov.innerHTML =
      '<button id="arcade-close" aria-label="Έξοδος" style="position:fixed;top:14px;right:16px;z-index:10;' +
        'font:600 13px Oswald,system-ui,sans-serif;color:#ECDAB4;background:rgba(20,14,8,.85);' +
        'border:1px solid rgba(232,201,106,.45);border-radius:999px;padding:8px 15px;cursor:pointer;' +
        'backdrop-filter:blur(6px)">✕ Έξοδος</button>' +
      '<iframe src="games/iliada-arcade/index.html?campaign=' + encodeURIComponent(campaign) + (endless ? '&mode=endless' : '') + '" ' +
        'title="Arcade" style="width:100%;height:100%;border:0;display:block" allow="autoplay; fullscreen"></iframe>';

    document.body.appendChild(ov);
    document.body.classList.add('syn-game-open');
    // Route the ✕ through the (SymNav-wrapped) global close so the history
    // session ends + the /play URL suffix is dropped.
    ov.querySelector('#arcade-close').onclick = function () { (window[closeGlobal] || doClose)(); };
    document.addEventListener('keydown', esc);
    if (window.symApplyThemeClass) { try { window.symApplyThemeClass(ov); } catch (_) {} }
    // NOTE: SymNav's synLaunch wrap calls beginGame('openIliadaArcade'/'openOdysseaArcade')
    // for us, so we do NOT push a history entry here (avoids a double /play).
  }

  function closeArcade() { if (_close) _close(); }

  // cfg (from the Game-Panel content picker via injectBankAndLaunch) may carry
  // { questions, endless }. Direct launches (home/subject tiles) pass nothing →
  // default Homer content, finite waves.
  window.openIliadaArcade  = function (cfg) { openArcade('iliada', cfg); };
  window.openOdysseaArcade = function (cfg) { openArcade('odysseia', cfg); };
  window.closeIliadaArcade  = closeArcade;
  window.closeOdysseaArcade = closeArcade;
})();
