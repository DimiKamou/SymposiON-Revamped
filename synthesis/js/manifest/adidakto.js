// SymposiON — Synthesis manifest fragment: adidakto (ΑΔΙΔΑΚΤΟ / unseen-text pillar)
//
// Three self-contained screens under games/adidakto/ (Workspace, Panhellenic
// Exam Simulator, Corpus Admin), each mounted full-screen as an iframe overlay
// by js/adidakto-launch.js (loaded eagerly). Empty js + overlay:null → synLaunch
// loads nothing and calls the opener, forwarding a tile's launch.args (a corpus
// id) to openAdidakto(id).
window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
  openAdidakto:      { js: [], css: [], overlay: null, eager: false, fb: false },
  openExamSim:       { js: [], css: [], overlay: null, eager: false, fb: false },
  openAdidaktoAdmin: { js: [], css: [], overlay: null, eager: false, fb: false }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
  'Αδίδακτο Κείμενο':          'openAdidakto',
  'Unseen Text':               'openAdidakto',
  'Προσομοίωση Πανελληνίων':   'openExamSim',
  'Panhellenic Exam Simulator':'openExamSim',
  'Ανθολόγιο Αδιδάκτων · Διαχείριση':'openAdidaktoAdmin'
});
