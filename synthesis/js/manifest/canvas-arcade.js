// SymposiON — Synthesis manifest fragment: canvas-arcade (Batch agent fills this)
// Batch 0 seeds ONE real proof-of-concept game (invaders) end-to-end.
window.SYN_GAMES = Object.assign(window.SYN_GAMES||{}, {
  openInvaders: {
    js:      ['games/invaders/data.js', 'games/invaders/game.js'],
    css:     ['games/invaders/game.css'],
    overlay: 'invaders-overlay',
    eager:   false,
    fb:      false
  },

  // ── canvas / arcade / engine games ─────────────────────────────────────

  // Iliada / Odyssea Arcade — the combat-quiz arcade is a self-contained HTML
  // document opened as a full-screen iframe overlay (window.openIliadaArcade /
  // openOdysseaArcade in js/arcade-launch.js). Empty manifest so synLaunch just
  // loads nothing and calls the opener; SymNav wraps it as a game session.
  openIliadaArcade:  { js: [], css: [], overlay: null, eager: false, fb: false },
  openOdysseaArcade: { js: [], css: [], overlay: null, eager: false, fb: false },

  // Agora Surfers (alias openTempleRun). adapter.js builds its OWN iframe
  // overlay (agora-surfers-overlay) and loads src/* inside the iframe.
  openAgoraSurfers: {
    js:      ['games/agora-surfers/adapter.js'],
    css:     [],
    overlay: 'temple-run-overlay',
    eager:   false,
    fb:      false
  },

  openMythMemory: {
    js:      ['games/myth-memory/game.js'],
    css:     ['games/myth-memory/game.css'],
    overlay: 'myth-memory-overlay',
    eager:   false,
    fb:      false
  },

  openEpicPuzzle: {
    js:      ['games/epic-puzzle/game.js'],
    css:     ['games/epic-puzzle/game.css'],
    overlay: 'epic-puzzle-overlay',
    eager:   false,
    fb:      false
  },

  // Odyssey 3D — init/destroy pair; needs ODYSSEY_LOCATIONS from data.js.
  initOdysseyJourney: {
    js:      ['games/odyssey-journey/data.js', 'games/odyssey-journey/game.js'],
    css:     ['games/odyssey-journey/game.css'],
    overlay: 'odyssey-journey-overlay',
    eager:   false,
    fb:      false
  },

  openBlade: {
    js:      ['games/blade/game.js'],
    css:     ['games/blade/game.css'],
    overlay: 'blade-overlay',
    eager:   false,
    fb:      false
  },

  // GP games — content comes from the GP_DATASETS bridge (gp-content.js eager);
  // each has a built-in fallback pool/lobby so a direct open() works.
  openDig: {
    js:      ['games/dig/game.js'],
    css:     ['games/dig/game.css'],
    overlay: 'dig-overlay',
    eager:   false,
    fb:      false
  },

  openLabyrinth: {
    js:      ['games/labyrinth/maze.js', 'games/labyrinth/questions.js',
              'games/labyrinth/audio.js', 'games/labyrinth/ui.js',
              'games/labyrinth/game.js'],
    css:     ['games/labyrinth/game.css'],
    overlay: 'labyrinth-overlay',
    eager:   false,
    fb:      false
  },

  openPhalanx: {
    js:      ['games/phalanx/phalanx-audio.js', 'games/phalanx/phalanx-arena.js',
              'games/phalanx/phalanx-engine.js'],
    css:     ['games/phalanx/phalanx.css'],
    overlay: 'phalanx-overlay',
    eager:   false,
    fb:      false
  },

  openNaumachia: {
    js:      ['games/naumachia/game.js'],
    css:     ['games/naumachia/game.css'],
    overlay: 'naumachia-overlay',
    eager:   false,
    fb:      false
  },

  openRapidFire: {
    js:      ['games/rapid-fire/storm-audio.js', 'games/rapid-fire/storm-arena.js',
              'games/rapid-fire/storm-content.js', 'games/rapid-fire/storm-engine.js'],
    css:     ['games/rapid-fire/kataigismos.css'],
    overlay: 'rf-overlay',
    eager:   false,
    fb:      false
  },

  openTow: {
    js:      ['games/tow/tow-audio.js', 'games/tow/tow-arena.js',
              'games/tow/tow-questions.js', 'games/tow/game.js'],
    css:     ['games/tow/tow.css'],
    overlay: 'tow-overlay',
    eager:   false,
    fb:      false
  },

  // noun-tow shares the tow engine files; different overlay/wrap.
  openNounTow: {
    js:      ['games/tow/tow-audio.js', 'games/tow/tow-arena.js',
              'games/tow/tow-questions.js', 'games/tow/game.js'],
    css:     ['games/tow/tow.css'],
    overlay: 'noun-tow-overlay',
    eager:   false,
    fb:      false
  },

  // ── Ἑπτάπυλος — Connect-Four "siege of seven-gated Thebes" quiz engine ──
  // IIFE that self-registers window.openHeptapylos/closeHeptapylos and BUILDS
  // ITS OWN overlay shell on demand (<div id="hep-overlay" class="sym-overlay">),
  // exactly like the pvp-pack engines — so overlay:null (synLaunch must NOT gate
  // on / fetch an overlays/hep-overlay.html partial; the engine injects the shell
  // itself). It reuses the shared `.sym-overlay` shell + dark "Hearth" `--sym-*`
  // tokens which, in synthesis, live in games/pvp-shell.css — loaded FIRST so the
  // overlay renders styled (synthesis' eager tokens.css is the LIGHT alabaster
  // home palette and does NOT define .sym-overlay or the --sym-*-lt / font tokens
  // this game uses). Reads its bank live from window.HEP_Q, falling back to the
  // eagerly-seeded shared library window.SYM_QUESTIONS — so it always opens with
  // real content, never an empty board.
  openHeptapylos: {
    js:      ['games/heptapylos/game.js'],
    css:     ['games/pvp-shell.css'],
    overlay: null,
    eager:   true,
    fb:      false
  }
});

window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP||{}, {
  'Grammar Invaders':         'openInvaders',
  'Ιλιάδα Arcade':            'openIliadaArcade',
  'Iliad Arcade':             'openIliadaArcade',
  'Οδύσσεια Arcade':          'openOdysseaArcade',
  'Odyssey Arcade':           'openOdysseaArcade',
  'Odyssea Arcade':           'openOdysseaArcade',
  'Agora Surfers':            'openAgoraSurfers',
  'Mythology Memory':         'openMythMemory',
  'Epic Puzzle':              'openEpicPuzzle',
  'epic-puzzle':              'openEpicPuzzle',
  'Odyssey 3D':               'initOdysseyJourney',
  "Grammarian's Blade":       'openBlade',
  'Ξίφος Γραμματικού':        'openBlade',
  'Ανασκαφή':                 'openDig',
  'Archaeological Dig':       'openDig',
  'Λαβύρινθος':               'openLabyrinth',
  'Labyrinth':                'openLabyrinth',
  'Φάλαγγα':                  'openPhalanx',
  'Phalanx':                  'openPhalanx',
  'Ναυμαχία':                 'openNaumachia',
  'Naumachia':                'openNaumachia',
  'Rapid Fire':               'openRapidFire',
  'Καταιγισμός':              'openRapidFire',
  'Tug of War':               'openTow',
  'Ἑπτάπυλος':                'openHeptapylos',
  'Επτάπυλος':                'openHeptapylos',
  'Heptapylos':               'openHeptapylos'
});

// (The old iliada-arcade eager-boot trap was removed: the arcade is now a
// self-contained iframe overlay — see js/arcade-launch.js — with no in-page
// game.js/IliadaControls.js to boot.)
