/* override.js — apply admin-edited rhapsodies/quizzes on top of the built-in
   content. MUST load AFTER data.js (defaults) AND quiz.js (which rewrites every
   rhapsody's .quiz from its own bank) so the admin edits are the final word.

   Source: window.ARCADE_CONFIG (set by play/config.js from localStorage
   ARCADE_CONTENT, seeded by the panel's config/arcadeContent). Shape:
     { iliada:{ rhaps:{ <key>:{ roman, latin, title, quiz:[{q,o:[4],a}] } }, order:[keys] }, odysseia:{…} }
   • existing rhapsody → editable fields (roman/latin/title/quiz) overridden
   • new rhapsody → clones the campaign's first rhapsody's visuals (palette/hero/
     boss), applies the admin's roman/title/quiz, appended to RHAP_ORDER. */
(function () {
  try {
    var cfg = window.ARCADE_CONFIG;
    var GD = window.GAME_DATA, RO = window.RHAP_ORDER;
    if (!cfg || !GD || !RO) return;
    ['iliada', 'odysseia'].forEach(function (camp) {
      var cc = cfg[camp]; if (!cc) return;
      var dest = GD[camp]; if (!dest) return;
      var tmpl = dest.rhaps[RO[camp][0]];
      if (cc.rhaps) Object.keys(cc.rhaps).forEach(function (key) {
        var src = cc.rhaps[key]; if (!src) return;
        if (dest.rhaps[key]) {
          if (src.roman) dest.rhaps[key].roman = src.roman;
          if (src.latin) dest.rhaps[key].latin = src.latin;
          if (src.title) dest.rhaps[key].title = src.title;
          if (Array.isArray(src.quiz) && src.quiz.length) dest.rhaps[key].quiz = src.quiz.slice();
        } else if (tmpl) {
          var clone = JSON.parse(JSON.stringify(tmpl));
          clone.roman = src.roman || key.toUpperCase().slice(0, 1);
          clone.latin = src.latin || '';
          clone.title = src.title || key;
          clone.quiz  = Array.isArray(src.quiz) ? src.quiz.slice() : [];
          dest.rhaps[key] = clone;
          if (RO[camp].indexOf(key) < 0) RO[camp].push(key);
        }
      });
      if (Array.isArray(cc.order) && cc.order.length) {
        RO[camp] = cc.order.filter(function (k) { return dest.rhaps[k]; });
      }
    });
  } catch (e) { /* bad config → keep built-in content */ }
})();
