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
    17: 'Λατινικά · Ενότητα 17 — Φόβος μπροστά στο άγνωστο',
    18: 'Λατινικά · Ενότητα 18 — Ο Ηρακλής στην Ιταλία',
    19: 'Λατινικά · Ενότητα 19 — Η συνωμοσία του Κατιλίνα',
    20: 'Λατινικά · Ενότητα 20 — Πίσω από τις κουρτίνες ή πώς ο Κλαύδιος έγινε αυτοκράτορας',
    21: 'Λατινικά · Ενότητα 21 — Πώς πήρε το όνομά του το Πίσαυρο',
    22: 'Λατινικά · Ενότητα 22 — Προτροπές προς τους Ρωμαίους',
    23: 'Λατινικά · Ενότητα 23 — Ένας υπέροχος άνθρωπος',
    24: 'Λατινικά · Ενότητα 24 — Το πάθημα ενός ψεύτη',
    25: 'Λατινικά · Ενότητα 25 — Πώς ένα σύκο στάθηκε αφορμή να καταστραφεί η Καρχηδόνα',
    26: 'Λατινικά · Ενότητα 26 — Το πνεύμα ωριμάζει όπως οι καρποί',
    27: 'Λατινικά · Ενότητα 27 — Το πνεύμα ωριμάζει όπως και οι καρποί',
    29: 'Λατινικά · Ενότητα 29 — Ο Οκταβιανός, ο παπουτσής και το κοράκι',
    31: 'Λατινικά · Ενότητα 31 — Η γενναιότητα δε βγαίνει πάντα σε καλό',
    32: 'Λατινικά · Ενότητα 32 — Ένας πανηγυρικός της λογοτεχνίας',
    33: 'Λατινικά · Ενότητα 33 — Καιρός για ανασυγκρότηση',
    34: 'Λατινικά · Ενότητα 34 — Ο Σκιπίωνας ο Αφρικανός και οι λήσταρχοι',
    35: 'Λατινικά · Ενότητα 35 — Ο φιλόσοφος μπροστά στα δεινά της εξορίας',
    36: 'Λατινικά · Ενότητα 36 — Μια απόπειρα δωροδοκίας',
    37: 'Λατινικά · Ενότητα 37 — Η κατάρα των εμφυλίων πολέμων',
    38: 'Λατινικά · Ενότητα 38 — Η μοίρα της Καικιλίας',
    39: 'Λατινικά · Ενότητα 39 — Ένα πρότυπο ιδανικού ανθρώπου',
    40: 'Λατινικά · Ενότητα 40 — Ακλόνητη αποφασιστικότητα μπροστά στις απειλές του δικτάτορα',
    41: 'Λατινικά · Ενότητα 41 — Μίλα για να σε καταλαβαίνουν, όχι για να μιλάς',
    42: 'Λατινικά · Ενότητα 42 — Ο Κικέρωνας και η συνωμοσία του Κατιλίνα',
    43: 'Λατινικά · Ενότητα 43 — Η οργή της μάνας',
    44: 'Λατινικά · Ενότητα 44 — Η ζωή των τυράννων',
    45: 'Λατινικά · Ενότητα 45 — Μια επιστολή στα ελληνικά αναπτερώνει το ηθικό των πολιορκημένων',
    46: 'Λατινικά · Ενότητα 46 — Το γενικό συμφέρον μπαίνει πριν από το ατομικό'
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
