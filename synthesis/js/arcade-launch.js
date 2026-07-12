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

  var _close = null; // teardown for the currently-open overlay

  function openArcade(campaign) {
    seedContent();
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
      '<iframe src="games/iliada-arcade/index.html?campaign=' + encodeURIComponent(campaign) + '" ' +
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

  window.openIliadaArcade  = function () { openArcade('iliada'); };
  window.openOdysseaArcade = function () { openArcade('odysseia'); };
  window.closeIliadaArcade  = closeArcade;
  window.closeOdysseaArcade = closeArcade;
})();
