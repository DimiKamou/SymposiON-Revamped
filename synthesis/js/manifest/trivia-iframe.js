// SymposiON — Synthesis manifest fragment: trivia-iframe
//
// Wires Ver1 trivia / iframe / study / symposion games into the revamp shell.
// The launcher functions live in synthesis/js/trivia-iframe-launchers.js
// (extracted from Ver1 js/nav.js) and load EAGERLY — ORCHESTRATOR must add:
//   <script src="js/trivia-iframe-launchers.js"></script>
// to synthesis/index.html. The per-game JS below is lazy-loaded by synLaunch.
//
// Notes:
//  - iliada-trivia: opener `synOpenIliadaTrivia` → launchGame('gr') (shared engine).
//  - odyssey-trivia: opener `launchOdysseyTrivia` (defined in its own game.js)
//    REUSES trivia-overlay + the iliada-trivia engine, so its js list includes
//    the iliada-trivia engine files first, then the odyssey set. overlay reuses
//    'trivia-overlay'.
//  - istoria / history-game / symposion: iframe loaders; overlay partials hold
//    the iframe shell (symposion) or an empty wrap the opener injects into.
//  - istoria modules (Chronicle/Multiple-Choice/Matching) all map to openIstoria
//    which loads games/istoria/index.html?course=g3 (default). istoria is a
//    single iframe app whose internal modules are chosen inside the iframe.
//  - study: opener `synOpenStudyFlashcards` → navToStudy('iliada-trivia') default
//    dataset; depends on the eager GP_DATASETS bridge (gp-content.js) + Mnemosyne
//    (games/study/flashcards.js).
window.SYN_GAMES = Object.assign(window.SYN_GAMES||{}, {
  // ── Iliad Trivia ──────────────────────────────────────────
  synOpenIliadaTrivia: {
    js:      ['games/iliada-trivia/questions.js', 'games/iliada-trivia/game.js'],
    css:     ['games/iliada-trivia/game.css'],
    overlay: 'trivia-overlay',
    eager:   false,
    fb:      false
  },
  // ── Odyssey Trivia (reuses iliada-trivia engine + trivia-overlay) ──
  launchOdysseyTrivia: {
    js:      ['games/iliada-trivia/questions.js', 'games/iliada-trivia/game.js',
              'games/odyssey-trivia/questions.js', 'games/odyssey-trivia/game.js'],
    css:     ['games/iliada-trivia/game.css'],
    overlay: 'trivia-overlay',
    eager:   false,
    fb:      false
  },
  // ── Istoria (iframe → games/istoria/index.html?course=g3) ──
  // Chronicle / Multiple-Choice / Matching all route here.
  openIstoria: {
    js:      [],
    css:     [],
    overlay: 'istoria-overlay',
    eager:   false,
    fb:      false
  },
  // ── History Game (iframe; course = current grade) ──────────
  openHistoryGame: {
    js:      [],
    css:     [],
    overlay: 'history-game-overlay',
    eager:   false,
    fb:      false
  },
  // ── Study / Flashcards (Mnemosyne) ─────────────────────────
  // Default dataset is 'iliada-trivia'; its questions.js sets window.QUESTIONS
  // (the GP_DATASETS iliada-trivia loader reads it), so include it here so the
  // default Flashcards launch has content without depending on Firestore.
  synOpenStudyFlashcards: {
    js:      ['games/iliada-trivia/questions.js', 'games/study/flashcards.js'],
    css:     [],
    overlay: 'study-overlay',
    eager:   false,
    fb:      false
  },
  // ── Recreation of Key Historical Battles (iframe → games/battles/<era>.html) ──
  openBattles: {
    js:      [],
    css:     [],
    overlay: 'battles-overlay',
    eager:   false,
    fb:      false
  },
  // ── Symposion board game (iframe overlay) ──────────────────
  openSymposion: {
    js:      [],
    css:     [],
    overlay: 'symposion-overlay',
    eager:   false,
    fb:      false
  }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP||{}, {
  // Iliad Trivia
  'Iliad Trivia':            'synOpenIliadaTrivia',
  'Trivia Ιλιάδας':          'synOpenIliadaTrivia',
  // Odyssey Trivia
  'Odyssey Trivia':          'launchOdysseyTrivia',
  'Οδύσσεια':                'launchOdysseyTrivia',
  // Istoria modules (iframe; default course=g3)
  'Chronicle':               'openIstoria',
  'Timeline':                'openIstoria',
  'Χρονολόγιο':              'openIstoria',
  'Multiple Choice':         'openIstoria',
  'Πολλαπλής Επιλογής':      'openIstoria',
  'Matching':                'openIstoria',
  'Αντιστοίχιση':            'openIstoria',
  // Study / Flashcards
  'Flashcards':              'synOpenStudyFlashcards',
  'Κάρτες Μνήμης':           'synOpenStudyFlashcards',
  // Recreation of Key Historical Battles (era comes from the tile's launch.args)
  'Recreation of Key Historical Battles':        'openBattles',
  'Αναπαράσταση Κορυφαίων Ιστορικών Μαχών':      'openBattles',
  // Symposion
  'Symposion':               'openSymposion',
  'Συμπόσιον':               'openSymposion'
});
