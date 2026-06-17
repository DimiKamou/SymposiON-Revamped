// SymposiON — Synthesis manifest fragment: trivia-panel
//
// The Universal Trivia Panel (a.k.a. the "create-a-trivia" setup tool), ported
// from Ver1 paideia/games/trivia-panel/panel.js. It is a self-contained overlay:
// games/trivia-panel/panel.js builds and manages its OWN #trivia-panel-overlay
// DOM and exposes window.openTriviaPanel(subjectId) / window.closeTriviaPanel().
// No overlay partial is needed (overlay:null).
//
// synLaunch lazy-loads panel.js + panel.css, then calls window.openTriviaPanel.
// The opener is also re-exported eagerly from trivia-iframe-launchers.js as a
// thin synLaunch shim (openTriviaPanel) so a data.js tile { launch:{fn:'openTriviaPanel'} }
// resolves before the heavy panel.js has loaded.
//
// SYN_LAUNCH_MAP entries let a data.js tile named "Trivia Panel" / "Πίνακας Trivia"
// (or the subject-specific tiles) resolve to this opener by display name.
window.SYN_GAMES = Object.assign(window.SYN_GAMES||{}, {
  // ── Universal Trivia Panel (self-contained overlay) ──
  openTriviaPanel: {
    js:      ['games/trivia-panel/panel.js'],
    css:     ['games/trivia-panel/panel.css'],
    overlay: null,
    eager:   false,
    fb:      false
  }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP||{}, {
  'Trivia Panel':            'openTriviaPanel',
  'Πίνακας Trivia':          'openTriviaPanel',
  'Universal Trivia':        'openTriviaPanel',
  'Trivia Setup':            'openTriviaPanel',
  'Δημιουργία Trivia':       'openTriviaPanel'
});
