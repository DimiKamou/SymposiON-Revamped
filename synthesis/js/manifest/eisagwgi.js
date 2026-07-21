// SymposiON — Synthesis manifest fragment: eisagwgi (Εισαγωγή — Αρχαία Γ΄ Λυκείου)
//
// The «Εισαγωγή» theory + quiz module is a self-contained HTML page
// (games/eisagwgi/index.html), mounted full-screen as an iframe overlay by
// js/eisagwgi-launch.js (loaded eagerly, before app wires clicks). Empty js +
// overlay:null → synLaunch loads nothing and just calls the opener (same
// convention as gnwsto).
window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
  openEisagwgi:      { js: [], css: [], overlay: null, eager: false, fb: false },
  openEisagwgiAdmin: { js: [], css: [], overlay: null, eager: false, fb: false }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
  'Εισαγωγή':               'openEisagwgi',
  'Introduction':           'openEisagwgi',
  'Εισαγωγή · Διαχείριση':  'openEisagwgiAdmin'
});
