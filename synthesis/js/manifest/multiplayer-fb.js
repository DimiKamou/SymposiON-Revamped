// ============================================================
//  SymposiON — Synthesis manifest fragment: multiplayer-fb
//  Batch: Ver1 multiplayer / Firebase games wired into the revamp shell.
//  Games: live-arena (eager engine), golden-fleece, halieia, teacher.
//
//  All four need Firebase at runtime (fb:true). golden-fleece & halieia
//  also need the LiveArena engine for their PvP/Live mode, so the LA
//  engine js is prepended to their js[] load order.
// ============================================================
(function () {
  'use strict';

  // ── Window-global opener wrappers ──────────────────────────────
  // LiveArena is a top-level `const LiveArena` IIFE (NOT assigned to
  // window), so we resolve it at CALL time from the shared global
  // lexical environment that all classic scripts share. Defining the
  // wrapper here is safe: `LiveArena` is only dereferenced when the
  // wrapper runs (after live-arena.js has been lazy-loaded).
  if (!window.openLiveArena) {
    window.openLiveArena = function (cfg) {
      if (typeof LiveArena === 'undefined') {
        console.warn('[syn] LiveArena engine not loaded');
        return;
      }
      // cfg.questions → launch directly as host;
      // cfg.host → the "Φιλοξένησε/Host" button: go STRAIGHT to the host content
      //   picker (la-host-dataset, the section→grade→subject multi-select), not
      //   the teacher-gated Host/Join chooser that fell to the student PIN screen;
      // otherwise open the picker/lobby (host chooser or ?join= student flow).
      // cfg.duel → Friendly Battle (real 2-seat 1v1 room). Must be checked BEFORE
      // the generic questions branch, since a duel also carries a question bank.
      if (cfg && cfg.duel && typeof LiveArena.launchDuelHost === 'function') return LiveArena.launchDuelHost(cfg);
      if (cfg && cfg.questions) return LiveArena.launchHost(cfg);
      if (cfg && cfg.host && typeof LiveArena.pickDataset === 'function') return LiveArena.pickDataset();
      return LiveArena.launchPicker();
    };
  }
  // golden-fleece / halieia already self-register window.openGoldenFleece
  // and window.openHalieia (GoldenFleece.open / Halieia.open) at the tail
  // of their game.js. The framework calls window[openFn] AFTER lazyLoad,
  // so those globals exist by the time we dispatch — no wrapper needed.
  // teacher's launchCustomHomework / openTemplatePicker / openBuilderModal
  // are top-level function declarations → already global. No wrapper needed.

  // ── Manifest entries ───────────────────────────────────────────
  window.SYN_GAMES = Object.assign(window.SYN_GAMES || {}, {

    // Live Arena — realtime Firestore quiz arena. Eager-by-design in Ver1
    // (const IIFE + unguarded inline onclicks + ?join= auto-join). Here it
    // is lazy-loaded on first launch; synLaunch injects la-overlay BEFORE
    // loading the engine so the inline onclick="LiveArena.x()" handlers and
    // _checkUrlJoin() find their DOM. eager:true is recorded for the
    // orchestrator (see COLLISION note re: ?join= deep-link at page load).
    openLiveArena: {
      js: [
        'js/live-arena.js',
        'js/live-arena-lobby.js',
        'js/live-arena-quiz-builder.js'
      ],
      css: [
        'games/live-arena/game.css',
        'games/live-arena/live-arena-lobby.css'
      ],
      overlay: 'la-overlay',
      eager: true,
      fb: true
    },

    // Golden Fleece — builds its own gf-overlay at runtime; uses la-overlay
    // only when handing off to LiveArena live mode → LA engine loaded first.
    openGoldenFleece: {
      js: [
        'js/live-arena.js',
        'js/live-arena-lobby.js',
        'js/live-arena-quiz-builder.js',
        'games/golden-fleece/game.js'
      ],
      css: [
        'games/live-arena/game.css',
        'games/live-arena/live-arena-lobby.css',
        'games/golden-fleece/game.css'
      ],
      overlay: 'la-overlay',
      eager: false,
      fb: true
    },

    // Halieia — same shape as golden-fleece; self-builds al-overlay, uses
    // la-overlay for LiveArena live mode.
    openHalieia: {
      js: [
        'js/live-arena.js',
        'js/live-arena-lobby.js',
        'js/live-arena-quiz-builder.js',
        'games/halieia/game.js'
      ],
      css: [
        'games/live-arena/game.css',
        'games/live-arena/live-arena-lobby.css',
        'games/halieia/game.css'
      ],
      overlay: 'la-overlay',
      eager: false,
      fb: true
    },

    // Teacher custom homework — adapter.js drives the hwk-overlay; builder.js
    // provides the template picker / builder modal. Uses shared-engine
    // (gramRunGame), loaded eagerly by index.html.
    launchCustomHomework: {
      js: [
        'games/teacher/adapter.js',
        'games/teacher/builder.js'
      ],
      css: ['games/teacher/teacher.css'],
      overlay: 'hwk-overlay',
      eager: false,
      fb: true
    }

  });

  // ── Tile display-name → openFn map ─────────────────────────────
  // golden-fleece / halieia map by their MPGAMES ids and display names;
  // 'Live Arena' → openLiveArena.
  window.SYN_LAUNCH_MAP = Object.assign(window.SYN_LAUNCH_MAP || {}, {
    'Live Arena': 'openLiveArena',
    'Agora Live Arena': 'openLiveArena',
    'golden-fleece': 'openGoldenFleece',
    'Golden Fleece': 'openGoldenFleece',
    'Χρυσόμαλλον Δέρας': 'openGoldenFleece',
    'halieia': 'openHalieia',
    'Halieia': 'openHalieia',
    'Αλιεία': 'openHalieia',
    'teacher': 'launchCustomHomework',
    'Custom Homework': 'launchCustomHomework'
  });

})();
