// SymposiON — Synthesis manifest fragment: grammar-greek
// Batch: Greek grammar games. Appends to the shared SYN_GAMES / SYN_LAUNCH_MAP
// registries (initialised by syn-launch.js). JS paths are relative to the
// copied games/ tree. Grammar data globals load via each game's data.js;
// shared-engine.js (gramRunGame) is loaded eagerly by index.html.
window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {
  openAfwnolekta:   { js: ['games/afwnolekta/data.js',   'games/afwnolekta/game.js'],   overlay: 'afw-overlay',       eager: false, fb: false },
  openAoristosB:    { js: ['games/aoristos-b/data.js',   'games/aoristos-b/game.js'],   overlay: 'aob-overlay',       eager: false, fb: false },
  openRimataMi:     { js: ['games/rimata-mi/data.js',    'games/rimata-mi/game.js'],    overlay: 'rmi-overlay',       eager: false, fb: false },
  openSynirimmena:  { js: ['games/synirimmena/data.js',  'games/synirimmena/game.js'],  css: ['games/synirimmena/game.css'],   overlay: 'syn-overlay',       eager: false, fb: false },
  openPathitiko:    { js: ['games/pathitiko/game.js'],                                   css: ['games/pathitiko/game.css'],     overlay: 'path-overlay',      eager: false, fb: false },
  openAntonymies:   { js: ['games/antonymies/data.js',   'games/antonymies/game.js'],   overlay: 'ant-overlay',       eager: false, fb: false },
  openAnwmalaRimata:{ js: ['games/anwmala-rimata/data.js','games/anwmala-rimata/game.js'], css: ['games/anwmala-rimata/game.css'], overlay: 'arv-overlay',       eager: false, fb: false },
  openEpitheta:     { js: ['games/epitheta/data.js',     'games/epitheta/game.js'],     overlay: 'ept-overlay',       eager: false, fb: false },
  openEimi:         { js: ['games/eimi/data.js',         'games/eimi/game.js'],         css: ['games/eimi/game.css'],          overlay: 'eimi-overlay',      eager: false, fb: false },
  openKlisiRimaton: { js: ['games/klisi-rimaton/data.js','games/klisi-rimaton/game.js'], css: ['games/klisi-rimaton/game.css'], overlay: 'kr-overlay',        eager: false, fb: false },
  openOusiastika:   { js: ['games/ousiastika/data.js',   'games/ousiastika/game.js'],   overlay: 'ous-overlay',       eager: false, fb: false },
  // paratheta/game.js reuses lyo's LYO_DIACRITICS global → load lyo's game.js first (lazyLoad dedups).
  openParatheta:    { js: ['games/lyo/game.js', 'games/paratheta/game.js'],               css: ['games/lyo/game.css'],           overlay: 'par-overlay',       eager: false, fb: false },
  openNounFill:     { js: ['games/noun-fill/game.js'],                                   overlay: 'noun-fill-overlay', eager: false, fb: false },
  openLyo:          { js: ['games/lyo/game.js'],                                         css: ['games/lyo/game.css'],           overlay: 'lyo-overlay',       eager: false, fb: false }
});
window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
  // Verb conjugation
  'Κλίσις Ρημάτων': 'openKlisiRimaton',
  'Κλίση Ρημάτων': 'openKlisiRimaton',
  'Verb Forms': 'openKlisiRimaton',
  // Contract verbs
  'Συνηρημένα': 'openSynirimmena',
  'Contract Verbs': 'openSynirimmena',
  // Irregular verbs (Greek)
  'Ανώμαλα Ρήματα': 'openAnwmalaRimata',
  'Irregular Verbs': 'openAnwmalaRimata',
  // Noun declension (Greek)
  'Κλίση Ουσιαστικών': 'openOusiastika',
  'Noun Declension': 'openOusiastika',
  // Adjectives (Greek)
  'Επίθετα': 'openEpitheta',
  'Adjectives': 'openEpitheta',
  // Adjective degrees
  'Παραθετικά': 'openParatheta',
  'Adjective Degrees': 'openParatheta',
  // Pronouns
  'Αντωνυμίες': 'openAntonymies',
  'Pronouns': 'openAntonymies',
  // Lyo
  'Λύω': 'openLyo',
  'Learning to Decline': 'openLyo',
  // Mute-ending verbs
  'Αφωνόληκτα Ρήματα': 'openAfwnolekta',
  'Αφωνόληκτα': 'openAfwnolekta',
  'Mute-ending Verbs': 'openAfwnolekta',
  // 2nd Aorist
  'Αόριστος Β΄': 'openAoristosB',
  'Αόριστος Β': 'openAoristosB',
  '2nd Aorist': 'openAoristosB',
  // -mi verbs
  'Ρήματα σε -μι': 'openRimataMi',
  '-mi Verbs': 'openRimataMi',
  // Passive future & aorist
  'Παθητικός Μέλλοντας & Αόριστος': 'openPathitiko',
  'Passive Future': 'openPathitiko',
  // εἰμί
  'Κλίση εἰμί': 'openEimi',
  'Conjugation of εἰμί': 'openEimi',
  // Noun fill-in
  'Συμπλήρωση Κατάληξης': 'openNounFill',
  'Noun Fill-in': 'openNounFill'
});
