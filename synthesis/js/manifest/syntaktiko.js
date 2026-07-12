// SymposiON — Synthesis manifest fragment: syntaktiko (Συντακτικό)
//
// Self-contained syntax-practice module (games/syntaktiko/index.html) + its
// curator editor (admin.html), each mounted full-screen as an iframe overlay
// by js/syntaktiko-launch.js (loaded eagerly). Empty js + overlay:null →
// synLaunch loads nothing and just calls the opener, forwarding any tile
// launch.args (e.g. 'ptoseis') to openSyntaktiko(topic).
window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
  openSyntaktiko:      { js: [], css: [], overlay: null, eager: false, fb: false },
  openSyntaktikoAdmin: { js: [], css: [], overlay: null, eager: false, fb: false }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
  'Συντακτικό':            'openSyntaktiko',
  'Syntax':                'openSyntaktiko',
  'Πτώσεις & Λειτουργίες': 'openSyntaktiko',
  'Μετοχές':               'openSyntaktiko',
  'Δευτερεύουσες Προτάσεις':'openSyntaktiko',
  'Συντακτικό · Διαχείριση':'openSyntaktikoAdmin'
});
