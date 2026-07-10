// SymposiON — Synthesis manifest fragment: experiences
//
// Cultural 3D experiences (iframe overlays). First entry: the
// Hagia Sophia 537 interactive museum — a walkable Three.js
// reconstruction of Justinian's Great Church as consecrated in
// 537 (games/hagia-sophia/). The launcher glue (openHagiaSophia /
// closeHagiaSophia) is lazy-loaded from the game folder itself so
// the shell pays nothing until launch.
window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
  openHagiaSophia: {
    js:      ['games/hagia-sophia/launcher.js'],
    css:     [],
    overlay: 'hagia-sophia-overlay',
    eager:   false,
    fb:      false
  }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
  'Hagia Sophia 537':  'openHagiaSophia',
  'Αγία Σοφία 537':    'openHagiaSophia'
});
