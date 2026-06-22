/* config.js — campaign pin + admin-content bridge.
   Runs BEFORE data.js. Reads:
     • ?campaign=iliada|odysseia  → window.ARCADE_PIN  (single-campaign tile)
     • localStorage ARCADE_CONTENT → window.ARCADE_CONFIG (admin rhapsodies/quizzes)
   data.js merges ARCADE_CONFIG over the bundled defaults; engine.js honours
   ARCADE_PIN (locks the campaign + hides the campaign toggle). */
(function () {
  try {
    var q = new URLSearchParams(location.search);
    var camp = q.get('campaign');
    if (camp === 'iliada' || camp === 'odysseia') window.ARCADE_PIN = camp;
  } catch (e) {}
  try {
    var raw = localStorage.getItem('ARCADE_CONTENT');
    if (raw) {
      var cfg = JSON.parse(raw);
      if (cfg && typeof cfg === 'object') window.ARCADE_CONFIG = cfg;
    }
  } catch (e) {}
})();
