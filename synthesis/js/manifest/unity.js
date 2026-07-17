// ============================================================
//  SymposiON — Synthesis manifest fragment: unity
//
//  Wires the Unity WebGL engine into the revamp shell. Same shape as the
//  iframe games in js/manifest/trivia-iframe.js (istoria / symposion):
//   - js:[]   → no lazy JS; the opener is EAGER in js/unity-launcher.js
//               (ORCHESTRATOR adds <script src="js/unity-launcher.js"> to
//               synthesis/index.html, like trivia-iframe-launchers.js).
//   - overlay:'unity-overlay' → overlays/unity-overlay.html holds the shell;
//               openUnity() injects the <iframe src="games/unity/index.html">.
//
//  The data.js ENGINES tile carries launch:{fn:'openUnity'}; these map keys
//  are a redundant name→openFn fallback for synResolveLaunch.
window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
  openUnity: {
    js:      [],
    css:     [],
    overlay: 'unity-overlay',
    eager:   false,
    fb:      false
  }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
  'Unity':        'openUnity',
  'unity':        'openUnity',
  'Unity Engine': 'openUnity',
  'Μηχανή Unity': 'openUnity'
});
