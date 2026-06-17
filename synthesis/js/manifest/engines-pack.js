// ============================================================
//  SymposiON — Synthesis manifest fragment: engines-pack
//  The remaining self-contained Game-Panel engines from the
//  "Crypto Hack / Gold Quest" pack (HANDOFF-all-games.md rows 5–15
//  not already shipped by pvp-pack.js):
//      moirai, ekklisia, oracle, parthenon, olympus,
//      hippodrome, mnemosyne (memory), erinyes
//
//  Contract (identical to pvp-pack.js — read that header for the full
//  rationale):
//   - Each engine is a top-level IIFE that self-registers
//     window.open<Name> / window.close<Name> and BUILDS ITS OWN overlay
//     shell on demand (`_ensureOverlay` → <div id="xx-overlay"
//     class="sym-overlay">). => manifest `overlay:null` (synLaunch must
//     NOT gate on an overlay partial; the game injects its own, exactly
//     like crypto-hack / krypteia).
//   - Each reads its live question global window.<XX>_Q, falling back to
//     the shared library window.SYM_QUESTIONS (seeded eagerly by
//     js/syn-questions.js) — so every game launches with real content.
//   - The shared overlay shell + dark Hearth `--sym-*` tokens come from
//     games/pvp-shell.css (scoped to .sym-overlay so the home stays
//     alabaster); ambient FX from games/fx.js + games/fx.css. None of
//     these engines ship a per-game fx-*.js in the pack, so only the
//     shared fx.js is loaded.
// ============================================================
(function () {
  'use strict';

  window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {

    // ── Μοίραι — wheel-of-fates ──
    openMoirai: {
      js:      ['games/fx.js', 'games/moirai/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/moirai/game.css'],
      overlay: null, eager: false, fb: false
    },

    // ── Εκκλησία — buzzer / Pnyx ──
    openEkklisia: {
      js:      ['games/fx.js', 'games/ekklisia/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/ekklisia/game.css'],
      overlay: null, eager: false, fb: false
    },

    // ── Μαντείον — wager quiz / Delphi ──
    openOracle: {
      js:      ['games/fx.js', 'games/oracle/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/oracle/game.css'],
      overlay: null, eager: false, fb: false
    },

    // ── Ακρόπολις — temple builder ──
    openParthenon: {
      js:      ['games/fx.js', 'games/parthenon/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/parthenon/game.css'],
      overlay: null, eager: false, fb: false
    },

    // ── Ανάβασις — millionaire ladder / Olympus ──
    openOlympus: {
      js:      ['games/fx.js', 'games/olympus/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/olympus/game.css'],
      overlay: null, eager: false, fb: false
    },

    // ── Αρματοδρομία — chariot race ──
    openHippodrome: {
      js:      ['games/fx.js', 'games/hippodrome/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/hippodrome/game.css'],
      overlay: null, eager: false, fb: false
    },

    // ── Μνημοσύνη — memory pairs (pack engine; distinct from the
    //    registry's 'mnemosyne' flashcard-study mode) ──
    openMnemosyne: {
      js:      ['games/fx.js', 'games/mnemosyne/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/mnemosyne/game.css'],
      overlay: null, eager: false, fb: false
    },

    // ── Διωγμός — the Furies' pursuit ──
    openErinyes: {
      js:      ['games/fx.js', 'games/erinyes/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/erinyes/game.css'],
      overlay: null, eager: false, fb: false
    }

  });

  // ── Tile display-name → openFn map ─────────────────────────────
  // Greek + English (+ engine-id) keys so synResolveLaunch resolves from
  // whichever name a panel tile carries.
  window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
    'Μοίραι':              'openMoirai',
    'moirai':              'openMoirai',
    'Wheel of Fates':      'openMoirai',
    'Εκκλησία':            'openEkklisia',
    'ekklisia':            'openEkklisia',
    'Assembly Buzzer':     'openEkklisia',
    'Μαντείον':            'openOracle',
    'oracle':              'openOracle',
    'Oracle Wager':        'openOracle',
    'Ακρόπολις':           'openParthenon',
    'parthenon':           'openParthenon',
    'Temple Builder':      'openParthenon',
    'Ανάβασις':            'openOlympus',
    'olympus':             'openOlympus',
    'Ascent':              'openOlympus',
    'Αρματοδρομία':        'openHippodrome',
    'hippodrome':          'openHippodrome',
    'Chariot Race':        'openHippodrome',
    'Μνημοσύνη':           'openMnemosyne',
    'mnemosyne-memory':    'openMnemosyne',
    'Memory':              'openMnemosyne',
    'Διωγμός':             'openErinyes',
    'erinyes':             'openErinyes',
    'The Pursuit':         'openErinyes',

    // ── Coverage fixups so EVERY window.GP_ENGINES record resolves to a
    //    launchable openFn when surfaced in the full Game-Panel list.
    //    (Their canvas-arcade openFns existed but were only keyed by the
    //    carousel display name, not the GP_ENGINES id/label.) ──
    'invaders':            'openInvaders',
    'Space Invaders':      'openInvaders',
    'blade':               'openBlade',
    'Ξίφος του Γραμματικού': 'openBlade'
  });

})();
