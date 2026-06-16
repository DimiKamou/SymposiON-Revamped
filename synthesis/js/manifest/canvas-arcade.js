// SymposiON — Synthesis manifest fragment: canvas-arcade (Batch agent fills this)
// Batch 0 seeds ONE real proof-of-concept game (invaders) end-to-end.
window.SYN_GAMES = Object.assign(window.SYN_GAMES||{}, {
  openInvaders: {
    js:      ['games/invaders/data.js', 'games/invaders/game.js'],
    css:     ['games/invaders/game.css'],
    overlay: 'invaders-overlay',
    eager:   false,
    fb:      false
  }
  /* filled by batch agent */
});
window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP||{}, {
  'Grammar Invaders': 'openInvaders'
  /* 'Tile name': 'openFn' */
});
