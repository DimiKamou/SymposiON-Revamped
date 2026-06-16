// ============================================================
//  SymposiON — Lazy Script Loader
//  Loads route/feature-gated scripts on demand instead of in the
//  initial bundle. Must load EARLY (before auth.js / nav.js /
//  router.js) so the route stubs exist before anything calls them.
//
//  Public API:
//    window.lazyLoad(srcs)        → Promise, loads scripts in series
//    window._lazyRoute(name, srcs)→ install a global stub that, on first
//                                   call, loads `srcs` then delegates to
//                                   the real function the script defines.
// ============================================================
(function () {
  'use strict';

  const _cache = new Map(); // src -> Promise (dedup + race-safe)

  // App base URL — the directory that holds index.html. We derive it from
  // lazy.js's OWN resolved <script src>, so manifest paths resolve exactly
  // like the eager <script src="js/..."> / <script src="games/..."> tags did,
  // regardless of (a) the current SPA sub-route (/gym-b/iliada, /admin, set via
  // pushState) or (b) where the dev server is rooted (project root vs parent).
  // lazy.js lives at <appBase>js/lazy.js, so appBase = parent of its js/ dir.
  const _appBase = (function () {
    let self = document.currentScript;
    if (!self || !self.src) {
      self = document.querySelector('script[src*="js/lazy.js"]');
    }
    try {
      return new URL('../', new URL('./', self.src)).href; // .../js/ → .../
    } catch (e) {
      return new URL('./', location.href).href;            // fallback
    }
  })();

  // Expose the resolved app base so other early code (e.g. the inline
  // illustration injector) can resolve asset paths the same robust way,
  // instead of guessing from the SPA-mutated location.href.
  window.APP_BASE = _appBase;

  // Resolve a manifest src against the app base (unless already absolute).
  function _resolve(src) {
    if (/^(?:https?:)?\/\//.test(src) || src.charAt(0) === '/') return src;
    try { return new URL(src, _appBase).href; } catch (e) { return src; }
  }

  function loadOne(src) {
    src = _resolve(src);
    if (_cache.has(src)) return _cache.get(src);
    const p = new Promise(function (resolve, reject) {
      const s = document.createElement('script');
      s.src = src;
      s.async = false;            // preserve execution order within a batch
      s.dataset.lazy = src;
      s.onload = function () { resolve(src); };
      s.onerror = function () { _cache.delete(src); reject(new Error('lazyLoad failed: ' + src)); };
      document.head.appendChild(s);
    });
    _cache.set(src, p);
    return p;
  }

  // Load scripts strictly in series so later files can rely on earlier ones.
  window.lazyLoad = function (srcs) {
    return srcs.reduce(function (chain, src) {
      return chain.then(function () { return loadOne(src); });
    }, Promise.resolve());
  };

  // Install a stub at window[name]. On first invocation it shows the loader,
  // loads `srcs`, then delegates to the real function (which has by then
  // overwritten this stub via its own `function name(){}` declaration).
  window._lazyRoute = function (name, srcs) {
    if (typeof window[name] === 'function') return; // real impl already present
    const stub = async function () {
      const args = Array.prototype.slice.call(arguments);
      const hasLoader = (typeof SymLoader !== 'undefined' && SymLoader && typeof SymLoader.show === 'function');
      if (hasLoader) { try { SymLoader.show(); } catch (_) {} }
      try {
        await window.lazyLoad(srcs);
      } catch (e) {
        console.error('[lazy] failed to load route "' + name + '"', e);
        return;
      } finally {
        if (hasLoader) { try { SymLoader.hide(); } catch (_) {} }
      }
      const fn = window[name];
      if (typeof fn === 'function' && fn !== stub) {
        return fn.apply(this, args);
      }
      console.warn('[lazy] "' + name + '" was not defined after loading', srcs);
    };
    window[name] = stub;
  };

  // ── Route registrations ───────────────────────────────────
  // Phase 1a: Admin panel (admin-only; kept out of the initial bundle for
  // every non-admin visitor). The Command Center (admin-cc.js) is the admin
  // UI; it delegates backend actions to admin.js handlers. (The legacy
  // Tartarus dashboard + Command Atlas were removed — admin-atlas.js /
  // admin-subs.js are no longer loaded.)
  const ADMIN_SRCS = [
    'js/admin.js?v=15',
    'js/admin-cc.js?v=6',
    'js/admin-realm.js?v=2',
    'js/admin-studio.js?v=5',
  ];
  ['_showAdminInCurrentTab', '_renderAdminPage', 'navToAdmin'].forEach(function (name) {
    window._lazyRoute(name, ADMIN_SRCS);
  });

  // Phase 1b: Subscribe + Checkout (~760 lines; only needed on the
  // /subscribe route). checkout.js has no external entry points — it is
  // only ever called from inside the subscribe flow (openCheckoutZone),
  // so the two load together as one bundle.
  const SUBSCRIBE_SRCS = [
    'js/subscribe.js?v=7',
    'js/checkout.js?v=1',
  ];
  ['navToSubscribe', '_renderSubscribePage'].forEach(function (name) {
    window._lazyRoute(name, SUBSCRIBE_SRCS);
  });

  // Boot guard: both files run a load-time IIFE that shows a confirmation
  // toast after returning from a Stripe/PayPal redirect (?payment=… in
  // subscribe.js, ?redirect_status=… in checkout.js). On a normal visit
  // those IIFEs no-op, so deferring them costs nothing — but if the URL
  // carries a payment-return param we must load the bundle so the toast
  // fires. Defer to DOMContentLoaded so showToast() (from nav.js/app.js)
  // is defined before the IIFE runs, matching the original load order.
  function _bootPaymentReturn() {
    const p = new URLSearchParams(window.location.search);
    if (p.get('payment') || p.get('redirect_status')) {
      window.lazyLoad(SUBSCRIBE_SRCS);
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _bootPaymentReturn);
  } else {
    _bootPaymentReturn();
  }

  // ── Phase 2a: Heavy, self-contained games ─────────────────
  // Each entry maps a game's global open/launch function to the script(s)
  // that game needs, in load order (shared engine first where applicable).
  // Selection criteria for this slice: launched via a plain global function
  // (not an IIFE object), every call site is typeof-guarded or click-driven,
  // no dependency on games/shared-engine.js, and no load-time DOMContentLoaded
  // listener that would be missed when deferred. Their open functions take
  // their arguments from EAGER helpers (e.g. buildTempleRunConfig lives in
  // nav.js), so the inline onclick expressions stay valid before load.
  //
  // Deliberately excluded (handled separately / later): iliada-arcade
  // (controls init on DOMContentLoaded), crypto-hack (CryptoHack IIFE object),
  // live-arena (see Phase 1c), all grammar games (need shared-engine.js —
  // Phase 2b), and blade (currently in active development).
  const GAME_MANIFEST = {
    openTempleRun:       ['games/agora-surfers/adapter.js'],
    openInvaders:        ['games/invaders/data.js', 'games/invaders/game.js'],
    openMythMemory:      ['games/myth-memory/game.js'],
    // Reimagined Καταιγισμός: audio → arena → content → engine LAST (defines
    // openRapidFire). Reads content live from window.GP_DATASETS / RF_PACKS.
    openRapidFire:       ['games/rapid-fire/storm-audio.js', 'games/rapid-fire/storm-arena.js',
                          'games/rapid-fire/storm-content.js', 'games/rapid-fire/storm-engine.js'],
    openEpicPuzzle:      ['games/epic-puzzle/game.js'],
    openOdysseyJourney:  ['games/odyssey-journey/data.js', 'games/odyssey-journey/game.js'],
    openNaumachia:       ['games/naumachia/game.js'],
    openLabyrinth:       ['games/labyrinth/maze.js', 'games/labyrinth/questions.js',
                          'games/labyrinth/audio.js', 'games/labyrinth/ui.js',
                          'games/labyrinth/game.js'],
    openDig:             ['games/dig/game.js'],
    // Reimagined Phalanx: audio + canvas arena first, engine LAST (defines
    // openPhalanx). phalanx-data.js (in-lobby subject picker) is omitted —
    // questions are fed live via window.PH_Q from the GP bridge in nav.js.
    openPhalanx:         ['games/phalanx/phalanx-audio.js', 'games/phalanx/phalanx-arena.js',
                          'games/phalanx/phalanx-engine.js'],
    // Reimagined buzz-in TOW: shared module list, engine (game.js) LAST.
    // Reads questions live from window._gpTowPool → TOW_BANKS → TOW_Q.
    openTow:             ['games/tow/tow-audio.js', 'games/tow/tow-arena.js',
                          'games/tow/tow-questions.js', 'games/tow/game.js'],
    openNounTow:         ['games/tow/tow-audio.js', 'games/tow/tow-arena.js',
                          'games/tow/tow-questions.js', 'games/tow/game.js'],
  };
  Object.keys(GAME_MANIFEST).forEach(function (name) {
    window._lazyRoute(name, GAME_MANIFEST[name]);
  });

  // ── NOTE: grammar games are intentionally NOT lazy-loaded ──
  // They were tried as a lazy slice (Phase 2b) but are too tightly coupled to
  // the eager data layer: the Games Panel (GP_DATASETS loaders in nav.js) reads
  // their data globals (OUS_DB, LAT_V_DB, EIMI_PARADIGM, AOB_G, …) synchronously,
  // their level grids read the same data, and several reuse each other's
  // constants (LYO_DIACRITICS, etc.). Lazy-loading broke level display and the
  // Games Panel "import dataset into engine" flow. They remain eager in
  // index.html (small footprint). odyssey-trivia is likewise eager because its
  // OD_QUESTIONS feeds a GP dataset. Heavy canvas ENGINES above stay lazy — the
  // GP injects the (eager) dataset into them at launch via their opener.
})();
