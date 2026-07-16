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
    // ?mode=endless (or ?endless) → unlimited-wave run (Game-Panel launch).
    if (q.get('mode') === 'endless' || q.get('endless')) window.ARCADE_ENDLESS = true;
  } catch (e) {}
  try {
    var raw = localStorage.getItem('ARCADE_CONTENT');
    if (raw) {
      var cfg = JSON.parse(raw);
      if (cfg && typeof cfg === 'object') window.ARCADE_CONFIG = cfg;
    }
  } catch (e) {}
  // Injected practice bank (from the Game-Panel content picker) — already in the
  // arcade quiz shape [{q,o,a}]. engine.js's openQuiz() prefers it over the
  // bundled per-rhapsody questions when present.
  try {
    var qb = localStorage.getItem('ARCADE_QUESTION_BANK');
    if (qb) {
      var bank = JSON.parse(qb);
      if (Array.isArray(bank) && bank.length) window.ARCADE_BANK = bank;
    }
  } catch (e) {}
})();
