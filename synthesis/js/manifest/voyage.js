// ============================================================
//  SYN manifest fragment — Voyage (Ζωφόρος) literature games
//  The openers are defined eagerly in js/voyage-launchers.js (loaded by
//  index.html), so these manifest entries carry no extra js to load —
//  synLaunch just invokes the global opener. Registered so the games resolve
//  via SYN_LAUNCH_MAP (display-name fallback) in addition to the explicit
//  tile.launch.fn used in data.js.
// ============================================================
(function () {
  var entry = { js: [], css: [], overlay: null, eager: false, fb: false };
  window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
    openIliadaVoyage:   entry,
    openOdysseiaVoyage: entry,
    openEleniVoyage:    entry,
    openTroadesVoyage:  entry,
    openAlkistisVoyage: entry,
  });
  var M = window.SYN_LAUNCH_MAP = window.SYN_LAUNCH_MAP || {};
  M['Ζωφόρος Ιλιάδας']    = 'openIliadaVoyage';   M['Iliad Frieze']        = 'openIliadaVoyage';
  M['Ζωφόρος Οδύσσειας']  = 'openOdysseiaVoyage'; M['Odyssey Frieze']      = 'openOdysseiaVoyage';
  M['Ζωφόρος Ελένης']     = 'openEleniVoyage';    M['Helen Frieze']        = 'openEleniVoyage';
  M['Ζωφόρος Τρωάδων']    = 'openTroadesVoyage';  M['Trojan Women Frieze'] = 'openTroadesVoyage';
  M['Ζωφόρος Αλκήστιδος'] = 'openAlkistisVoyage'; M['Alcestis Frieze']     = 'openAlkistisVoyage';
})();
