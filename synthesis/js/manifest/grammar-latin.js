// SymposiON — Synthesis manifest fragment: grammar-latin
// Latin grammar games wired into the revamp shell. Each entry's js paths are
// relative to synthesis/ (the copied Ver1 games/ tree). Overlay ids confirmed
// by reading each overlay's heading text in Ver1 index.html (2254–2403).
//
// Confirmed overlay-id ↔ slug pairings (COLLISION-resolved):
//   lat-nouns          → openLatNouns()             → latn-overlay
//   lat-nouns-kata     → openLatNounsKata()         → latnk-overlay
//     (+theory)        → openLatNounsKataTheory()   → latnt-overlay
//   lat-epitheta       → openLatEpitheta()          → late-overlay
//   lat-epitheta-kata  → openLatEpithetaKata()      → latek-overlay
//     (+theory)        → openLatEpithetaKataTheory()→ lekt-overlay
//   lat-kata           → openLatKata()              → latk-overlay
//   lat-verbs          → openLatVerbs()             → latv-overlay
//   lat-anwmala        → openLatAnwmala()=LIV.open  → latanw-overlay (inner liv-wrap)
//     (+theory)        → openLatAnwmalaTheory()     → latanwt-overlay
//   lat-antonymies     → openLatAntonymies()        → latp-overlay   <-- NOT latanwt
//     (+theory)        → openLatAntonymiesTheory()  → latpt-overlay
window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
  openLatNouns: {
    js: ['games/lat-nouns/data.js', 'games/lat-nouns/game.js'],
    css: [], overlay: 'latn-overlay', eager: false, fb: false
  },
  openLatNounsKata: {
    js: ['games/lat-nouns-kata/data.js', 'games/lat-nouns-kata/game.js', 'games/lat-nouns-kata/theory.js'],
    css: [], overlay: 'latnk-overlay', eager: false, fb: false
  },
  openLatNounsKataTheory: {
    js: ['games/lat-nouns-kata/data.js', 'games/lat-nouns-kata/game.js', 'games/lat-nouns-kata/theory.js'],
    css: [], overlay: 'latnt-overlay', eager: false, fb: false
  },
  openLatEpitheta: {
    js: ['games/lat-epitheta/data.js', 'games/lat-epitheta/game.js'],
    css: [], overlay: 'late-overlay', eager: false, fb: false
  },
  openLatEpithetaKata: {
    js: ['games/lat-epitheta-kata/data.js', 'games/lat-epitheta-kata/game.js', 'games/lat-epitheta-kata/theory.js'],
    css: [], overlay: 'latek-overlay', eager: false, fb: false
  },
  openLatEpithetaKataTheory: {
    js: ['games/lat-epitheta-kata/data.js', 'games/lat-epitheta-kata/game.js', 'games/lat-epitheta-kata/theory.js'],
    css: [], overlay: 'lekt-overlay', eager: false, fb: false
  },
  openLatKata: {
    js: ['games/lat-kata/data.js', 'games/lat-kata/game.js'],
    css: [], overlay: 'latk-overlay', eager: false, fb: false
  },
  openLatVerbs: {
    js: ['games/lat-verbs/data.js', 'games/lat-verbs/game.js'],
    css: [], overlay: 'latv-overlay', eager: false, fb: false
  },
  openLatAnwmala: {
    js: ['games/lat-anwmala/data.js', 'games/lat-anwmala/game.js', 'games/lat-anwmala/theory.js'],
    css: ['games/lat-anwmala/game.css'], overlay: 'latanw-overlay', eager: false, fb: false
  },
  openLatAnwmalaTheory: {
    js: ['games/lat-anwmala/data.js', 'games/lat-anwmala/game.js', 'games/lat-anwmala/theory.js'],
    css: ['games/lat-anwmala/game.css'], overlay: 'latanwt-overlay', eager: false, fb: false
  },
  openLatAntonymies: {
    js: ['games/lat-antonymies/data.js', 'games/lat-antonymies/game.js', 'games/lat-antonymies/theory.js'],
    css: [], overlay: 'latp-overlay', eager: false, fb: false
  },
  openLatAntonymiesTheory: {
    js: ['games/lat-antonymies/data.js', 'games/lat-antonymies/game.js', 'games/lat-antonymies/theory.js'],
    css: [], overlay: 'latpt-overlay', eager: false, fb: false
  }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
  // Latin tile display names → openFn (spec §3.2). Latin-context disambiguation.
  'Noun Declension (Latin)': 'openLatNouns',
  'Κλίση Λατινικών Ουσιαστικών': 'openLatNouns',
  'Adjectives (Latin)': 'openLatEpitheta',
  'Κλίση Λατινικών Επιθέτων': 'openLatEpitheta',
  'Adjectives by Text': 'openLatEpithetaKata',
  'Επίθετα ανά Κείμενο': 'openLatEpithetaKata',
  'Irregular Verbs (Latin)': 'openLatAnwmala',
  'Ανώμαλα Ρήματα Λατινικών': 'openLatAnwmala',
  'Verb Conjugation (Latin)': 'openLatVerbs',
  'Κλίση Λατινικών Ρημάτων': 'openLatVerbs',
  'Nouns by Text': 'openLatNounsKata',
  'Ουσιαστικά ανά Κείμενο': 'openLatNounsKata',
  // "Text Sorting" disambiguated by subject: Latin verbs-by-text grouping.
  'Text Sorting': 'openLatKata',
  'Κατάταξη Κειμένων': 'openLatKata',
  'Ρήματα ανά Κείμενο': 'openLatKata',
  // Latin Pronouns tile → antonymies game.
  'Pronouns (Latin)': 'openLatAntonymies',
  'Κλίση Λατινικών Αντωνυμιών': 'openLatAntonymies'
  // 'Theory' tile is per-game (openLat*Theory) — resolve via tile.launch.fn,
  // not a single ambiguous map key, since each Latin game has its own opener.
});
