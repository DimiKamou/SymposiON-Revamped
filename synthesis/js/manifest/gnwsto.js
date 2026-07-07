// SymposiON — Synthesis manifest fragment: gnwsto (Διδαγμένο Κείμενο Γ΄ Λυκείου)
//
// The «Διδαγμένο Κείμενο» study module is a self-contained HTML page
// (games/gnwsto/index.html) + its curator editor (games/gnwsto/admin.html),
// each mounted full-screen as an iframe overlay by js/gnwsto-launch.js (loaded
// eagerly, before app wires clicks). Empty js + overlay:null → synLaunch loads
// nothing and just calls the opener (same convention as the arcade).
window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
  openGnwsto:      { js: [], css: [], overlay: null, eager: false, fb: false },
  openGnwstoAdmin: { js: [], css: [], overlay: null, eager: false, fb: false }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
  'Διδαγμένο Κείμενο':          'openGnwsto',
  'Seen Text':                  'openGnwsto',
  'Διδαγμένο Κείμενο · Διαχείριση': 'openGnwstoAdmin'
});
