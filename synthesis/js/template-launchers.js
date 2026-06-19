// ============================================================
//  SymposiON — Admin authoring TEMPLATES (Trivia & History Synthesis)
//  Opens each self-contained React 18 + Babel-standalone authoring tool as a
//  full-screen overlay iframe — the same pattern as voyage-launchers.js. These
//  are ADMIN composer + live-preview tools that export JSON configs (no student
//  game). The iframe isolates their React runtime from the vanilla shell, and
//  reusing the shared `.game-overlay` class auto-suppresses the custom cursor /
//  mouse-FX while a tool is open.
//
//  Public openers (global): openTriviaTemplate, openHistoryTemplate;
//  closeTemplate().
// ============================================================
(function () {
  'use strict';

  function _appBase() { return window.APP_BASE || (new URL('./', location.href).href); }
  var OVID = 'template-overlay';

  function closeTemplate() {
    var ov = document.getElementById(OVID);
    if (ov) {
      ov.classList.remove('active');
      var fr = ov.querySelector('iframe');
      if (fr) fr.src = 'about:blank';   // stop the inner React app + free memory
    }
    document.body.style.overflow = '';
  }
  window.closeTemplate = closeTemplate;

  // file = path under games/, relative to the app base (e.g.
  // "trivia-synthesis/Trivia Synthesis.html"); title = overlay caption.
  function openTemplate(file, title) {
    if (window.SymLoader && typeof SymLoader.show === 'function') { try { SymLoader.show(); } catch (_) {} }
    var ov = document.getElementById(OVID);
    if (!ov) {
      ov = document.createElement('div');
      ov.id = OVID;
      ov.className = 'game-overlay';
      var back = (window.SYM_LANG === 'en') ? 'Back' : 'Πίσω';
      ov.innerHTML =
        '<div class="overlay-topbar">' +
          '<button class="overlay-back" type="button">&larr; ' + back + '</button>' +
          '<span class="overlay-title"></span>' +
          '<span style="width:64px;display:inline-block"></span>' +
        '</div>' +
        '<div class="overlay-frame" style="padding:0;overflow:hidden">' +
          '<iframe title="" allow="fullscreen" ' +
            'style="width:100%;height:100%;border:none;display:block;background:#15100A"></iframe>' +
        '</div>';
      document.body.appendChild(ov);
      ov.querySelector('.overlay-back').addEventListener('click', closeTemplate);
    }
    ov.querySelector('.overlay-title').textContent = title || '';
    var fr = ov.querySelector('iframe');
    fr.title = title || 'Template';
    fr.src = _appBase() + 'games/' + encodeURI(file);
    // reveal once the frame has a chance to start loading
    fr.addEventListener('load', function _l() {
      if (window.SymLoader && typeof SymLoader.hide === 'function') { try { SymLoader.hide(); } catch (_) {} }
      fr.removeEventListener('load', _l);
    });
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    // safety: hide the loader even if the frame's load event is slow/blocked
    setTimeout(function () { if (window.SymLoader && SymLoader.hide) { try { SymLoader.hide(); } catch (_) {} } }, 2500);
  }
  window.openTemplate = openTemplate;

  window.openTriviaTemplate  = function () { openTemplate('trivia-synthesis/Trivia Synthesis.html',  'Πρότυπο Trivia · Σύνθεση'); };
  window.openHistoryTemplate = function () { openTemplate('history-synthesis/History Synthesis.html', 'Πρότυπο Ιστορίας · Σύνθεση'); };
})();
