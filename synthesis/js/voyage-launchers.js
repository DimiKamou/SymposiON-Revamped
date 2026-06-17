// ============================================================
//  SymposiON — Voyage (Ζωφόρος) literature games
//  Opens each black-figure "frieze" voyage game as a full-screen overlay
//  iframe. The games (games/voyage/<slug>.html) are self-contained
//  React 18 + Babel-standalone + GSAP apps that read their own window.VOYAGE
//  config and render a campaign of rhapsodies/episodes with dialogue-quizzes,
//  laurels and a hero-seal collection (progress persists in their own
//  same-origin localStorage). The iframe isolates their React runtime from the
//  vanilla shell; using the shared `.game-overlay` class means the custom
//  cursor / mouse-FX are auto-suppressed while a game is open.
//
//  Public openers (global): openIliadaVoyage, openOdysseiaVoyage,
//  openEleniVoyage, openTroadesVoyage, openAlkistisVoyage; closeVoyage().
// ============================================================
(function () {
  'use strict';

  function _appBase() { return window.APP_BASE || (new URL('./', location.href).href); }
  var OVID = 'voyage-overlay';

  function closeVoyage() {
    var ov = document.getElementById(OVID);
    if (ov) {
      ov.classList.remove('active');
      var fr = ov.querySelector('iframe');
      if (fr) fr.src = 'about:blank';   // stop the inner React app + free memory
    }
    document.body.style.overflow = '';
  }
  window.closeVoyage = closeVoyage;

  function openVoyage(slug, title) {
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
      ov.querySelector('.overlay-back').addEventListener('click', closeVoyage);
    }
    ov.querySelector('.overlay-title').textContent = title || '';
    var fr = ov.querySelector('iframe');
    fr.title = title || 'Voyage';
    fr.src = _appBase() + 'games/voyage/' + slug + '.html';
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
  window.openVoyage = openVoyage;

  window.openIliadaVoyage   = function () { openVoyage('iliada',   'Ἰλιάς · Ἡ Ζωφόρος τῆς Μήνιδος'); };
  window.openOdysseiaVoyage = function () { openVoyage('odysseia', 'Ὀδύσσεια · Ἡ Ζωφόρος τοῦ Νόστου'); };
  window.openEleniVoyage    = function () { openVoyage('eleni',    'Εὐριπίδη Ἑλένη · Ἡ Ζωφόρος τοῦ Εἰδώλου'); };
  window.openTroadesVoyage  = function () { openVoyage('troades',  'Εὐριπίδη Τρῳάδες · Ἡ Ζωφόρος τῶν Τρῳάδων'); };
  window.openAlkistisVoyage = function () { openVoyage('alkistis', 'Εὐριπίδη Ἄλκηστις · Ἡ Ζωφόρος τῆς Ἀλκήστιδος'); };
})();
