// ============================================================
//  SymposiON — Λατινικά · Κείμενα (Latin text-analysis panels)
//  Opens each Ενότητα's analysis panel as a full-screen overlay iframe.
//  The panel (games/latin-texts/enotita.html) is a self-contained React 18
//  app (vendored React, no CDN) that reads ?unit=NN and renders the 7-part
//  study panel — Κείμενο, Μετάφραση, Ουσιαστικά/Επίθετα, Παραθετικά,
//  Αντωνυμίες, Ρήματα, SOS. The iframe isolates its React runtime from the
//  vanilla shell; the shared `.game-overlay` class auto-suppresses the custom
//  cursor / mouse-FX while open — same mechanism as the Voyage games.
//
//  Add a text = add games/latin-texts/units/unitNN.js + one line in UNITS
//  below (+ a tile in data.js). Public openers: openLatinText(n, title),
//  openLatinText16 … ; closeLatinText().
// ============================================================
(function () {
  'use strict';

  // Registry of published Ενότητες → header title used on the overlay topbar.
  var UNITS = {
    16: 'Λατινικά · Ενότητα 16 — Η τελευταία μάχη του Καίσαρα στη Γαλατία',
    17: 'Λατινικά · Ενότητα 17 — Φόβος μπροστά στο άγνωστο'
  };

  function _appBase() { return window.APP_BASE || (new URL('./', location.href).href); }
  var OVID = 'latin-texts-overlay';

  function closeLatinText() {
    var ov = document.getElementById(OVID);
    if (ov) {
      ov.classList.remove('active');
      var fr = ov.querySelector('iframe');
      if (fr) fr.src = 'about:blank';   // stop the inner React app + free memory
    }
    document.body.style.overflow = '';
  }
  window.closeLatinText = closeLatinText;

  function openLatinText(n, title) {
    n = parseInt(n, 10) || 16;
    title = title || UNITS[n] || ('Λατινικά · Ενότητα ' + n);
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
            'style="width:100%;height:100%;border:none;display:block;background:#e7e0cf"></iframe>' +
        '</div>';
      document.body.appendChild(ov);
      ov.querySelector('.overlay-back').addEventListener('click', closeLatinText);
    }
    ov.querySelector('.overlay-title').textContent = title;
    var fr = ov.querySelector('iframe');
    fr.title = title;
    fr.src = _appBase() + 'games/latin-texts/enotita.html?unit=' + n;
    fr.addEventListener('load', function _l() {
      if (window.SymLoader && typeof SymLoader.hide === 'function') { try { SymLoader.hide(); } catch (_) {} }
      fr.removeEventListener('load', _l);
    });
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { if (window.SymLoader && SymLoader.hide) { try { SymLoader.hide(); } catch (_) {} } }, 2500);
  }
  window.openLatinText = openLatinText;

  // Per-unit openers (one global per published Ενότητα, à la openIliadaVoyage).
  Object.keys(UNITS).forEach(function (n) {
    window['openLatinText' + n] = function () { openLatinText(n, UNITS[n]); };
  });
  window.LATIN_TEXT_UNITS = UNITS;
})();
