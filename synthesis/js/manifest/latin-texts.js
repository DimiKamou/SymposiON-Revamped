// ============================================================
//  SYN manifest fragment — Λατινικά · Κείμενα (Latin text-analysis panels)
//  The openers are defined eagerly in js/latin-texts-launchers.js (loaded by
//  index.html), so these manifest entries carry no extra js to load — synLaunch
//  just invokes the global opener. Registered so the panels resolve via
//  SYN_LAUNCH_MAP (display-name fallback) in addition to tile.launch.fn.
// ============================================================
(function () {
  var entry = { js: [], css: [], overlay: null, eager: false, fb: false };
  var G = window.SYN_GAMES = window.SYN_GAMES || {};
  var M = window.SYN_LAUNCH_MAP = window.SYN_LAUNCH_MAP || {};
  var UNITS = window.LATIN_TEXT_UNITS || { 16: '' };

  Object.keys(UNITS).forEach(function (n) {
    G['openLatinText' + n] = entry;
    M['Ανάλυση Κειμένου — Ενότητα ' + n] = 'openLatinText' + n;
    M['Text Analysis — Unit ' + n]       = 'openLatinText' + n;
    M['Λατινικά · Ενότητα ' + n]          = 'openLatinText' + n;
  });

  // Self-contained global openers (also defined in latin-texts-launchers.js).
  // No js/overlay to lazy-load — synLaunch just calls the global. Registered so
  // launchTile()'s `SYN_GAMES[fn]` gate passes and the tiles actually launch.
  ['openLatinIntro', 'openLatinTextPicker',
   'openLatSyntaxDomi', 'openLatSyntaxDeuterevouses', 'openLatSyntaxCum',
   'openLatSyntaxGerund', 'openLatSyntaxPlagios', 'openLatMorphologia']
    .forEach(function (fn) { G[fn] = entry; });
})();
