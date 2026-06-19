// ============================================================
//  SymposiON — Synthesis manifest fragment: pvp-pack
//  New / updated PvP & multiplayer-style Game-Panel engines from the
//  "Gold Quest" pack:
//      krypteia, hegemonia, discus, toxotes, agora
//  (+ FX layer for the already-present golden-fleece / halieia).
//
//  Contract (per the pack's HANDOFF/INSTALL docs, adapted to synthesis):
//   - Each engine is a top-level `const X = (…)()` IIFE that self-registers
//     window.open<Name> / window.close<Name> and BUILDS ITS OWN overlay shell
//     on demand (`_ensureOverlay` → <div id="xx-overlay" class="sym-overlay">).
//     => manifest `overlay:null` (synLaunch must NOT gate on an overlay partial;
//        the game injects its own overlay shell).
//   - Each reads its live question global window.<XX>_Q, falling back to the
//     shared library window.SYM_QUESTIONS (seeded eagerly by js/syn-questions.js
//     in index.html) — so every game launches with real content, not an empty
//     shell, even with no GP dataset bridged in.
//   - The shared overlay shell + dark Hearth `--sym-*` tokens come from
//     games/pvp-shell.css (scoped to .sym-overlay so the home stays alabaster).
//   - Cinematic FX: games/fx.js exposes window.SymFX; each game's fx-*.js maps
//     its `xx:fx` CustomEvents to set-pieces and no-ops without SymFX. FX js is
//     loaded AFTER game.js (it auto-starts on load / DOMContentLoaded).
//   - NOTE on FX css: the per-game `*-fx.css` files (krypteia-fx.css /
//     hegemonia-fx.css) are NOT loaded here. They were authored for the
//     STANDALONE game page and contain `body{ background:#… }` + `#xx-overlay{
//     background:transparent; z-index:1 }` rules that leak onto the SPA <body>
//     and make the overlay see-through (the home bleeds through). The shared
//     games/fx.css (only `.fx-*` ambient classes, no body/html rules) IS loaded,
//     so the SymFX ambient/particle/flash set-pieces still render, while the
//     overlay keeps its solid dark background from pvp-shell.css + game.css.
// ============================================================
(function () {
  'use strict';

  window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {

    // ── Κρυπτεία — competitive cipher arena (you + bot agents) ──
    openKrypteia: {
      js:      ['games/fx.js', 'games/krypteia/game.js', 'games/krypteia/fx-krypteia.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/krypteia/game.css'],
      overlay: null,
      eager:   false,
      fb:      false
    },

    // ── Ηγεμονία — colour-kingdom speed conquest ──
    openHegemonia: {
      js:      ['games/fx.js', 'games/hegemonia/game.js', 'games/hegemonia/fx-hegemonia.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/hegemonia/game.css'],
      overlay: null,
      eager:   false,
      fb:      false
    },

    // ── Δίσκος — plinko / discus throw ── (no per-game fx file in pack)
    openDiscus: {
      js:      ['games/fx.js', 'games/discus/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/discus/game.css'],
      overlay: null,
      eager:   false,
      fb:      false
    },

    // ── Τοξότης — archer / target ── (no per-game fx file in pack)
    openToxotes: {
      js:      ['games/fx.js', 'games/toxotes/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/toxotes/game.css'],
      overlay: null,
      eager:   false,
      fb:      false
    },

    // ── Αγορά — auction / bidding ── (no per-game fx file in pack)
    openAgora: {
      js:      ['games/fx.js', 'games/agora/game.js'],
      css:     ['games/pvp-shell.css', 'games/fx.css', 'games/agora/game.css'],
      overlay: null,
      eager:   false,
      fb:      false
    }

  });

  // ── Tile display-name → openFn map ─────────────────────────────
  // Greek + English (+ engine-id) keys so synResolveLaunch resolves from
  // whichever name a revamp tile carries.
  window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
    'Κρυπτεία':            'openKrypteia',
    'krypteia':            'openKrypteia',
    'Ηγεμονία':            'openHegemonia',
    'hegemonia':           'openHegemonia',
    'Color Kingdom':       'openHegemonia',
    'Δίσκος':              'openDiscus',
    'discus':              'openDiscus',
    'Discus':              'openDiscus',
    'Τοξότης':             'openToxotes',
    'toxotes':             'openToxotes',
    'Archer':              'openToxotes',
    'Αγορά':               'openAgora',
    'agora':               'openAgora',
    'Auction':             'openAgora'
  });

})();
