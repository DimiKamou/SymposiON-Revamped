/* ════════════════════════════════════════════════════════════════════
   sym-nav.js — history-based routing + in-game exit guard.

   The shell used to navigate with history.replaceState, so every click
   overwrote the same entry and Back left the app / jumped to home. This
   module turns navigation into a real browser history STACK:

     • symGo() pushes a back-stack entry per navigation, with the full
       {screen, param} stored in history.state → Back/Forward restore the
       EXACT previous screen, never home. URLs read as #/gamepanel/agora-surfers.
     • Launching a game pushes its own entry (#/.../play); Back closes the
       game back into its panel after a confirm, instead of leaving.
     • beforeunload warns before a tab-close / refresh during an active game.

   Loaded AFTER app.js (window.symGo / window.STATE / window.symRender) and
   syn-launch.js (window.synLaunch). app.js's symGo calls SymNav._sync.
   review-hub.js keeps its own capture-phase popstate guard for the Tartarus
   overlay; it stopImmediatePropagation()s, so our handler yields to it.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.SymNav) return;

  function ST() { return window.STATE || {}; }
  function render() { if (typeof window.symRender === 'function') window.symRender(); }
  function knownScreen(name) { return !!(window.SYM_SCREENS && window.SYM_SCREENS[name]); }
  function tr(o) { return (typeof window.L === 'function') ? window.L(o) : (o.gr || o.en); }
  function slug(s) { return String(s == null ? '' : s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  // history.state must be structured-cloneable; tiles/params are plain data.
  function safeParam(p) {
    if (!p || typeof p !== 'object') return (p == null ? null : p);
    try { return JSON.parse(JSON.stringify(p)); } catch (_) { return null; }
  }

  // (screen, param) → readable hash path, e.g. #/gamepanel/agora-surfers
  function pathFor(screen, param) {
    if (!screen || screen === 'home') return '#/';
    var seg = '';
    if (param) {
      if (param.game) seg = slug(param.game.id || param.game.en || param.game.gr);
      else if (param.tag) seg = slug(param.tag);
      else if (param.subject) seg = slug(param.subject.id || param.subject);
      else if (param.id) seg = slug(param.id);
    }
    if (screen === 'level' && param && param.from === 'gamepanel' && seg) return '#/gamepanel/' + seg;
    if (screen === 'tag' && param && param.tag) return '#/tag/' + slug(param.tag);
    return '#/' + screen + (seg ? '/' + seg : '');
  }

  function navState(screen, param, extra) {
    var st = { _sym: true, screen: screen || 'home', param: safeParam(param) };
    if (extra) for (var k in extra) st[k] = extra[k];
    return st;
  }

  function pushNav(screen, param) {
    try { history.pushState(navState(screen, param), '', pathFor(screen, param)); } catch (_) {}
  }
  function replaceNav(screen, param) {
    try { history.replaceState(navState(screen, param), '', pathFor(screen, param)); } catch (_) {}
  }

  // ── called by app.js's symGo after STATE is updated ──
  // Pushes a new entry when the destination changed, else replaces in place.
  function _sync(prevScreen, prevParam) {
    if (_game) endGame();               // navigating away via symGo ends the game session
    var s = ST();
    var same = (s.screen === prevScreen) &&
               (JSON.stringify(s.screenParam || null) === JSON.stringify(prevParam || null));
    if (same) replaceNav(s.screen, s.screenParam);
    else pushNav(s.screen, s.screenParam);
  }

  /* ── Game session ──────────────────────────────────────────────────
     A game is an overlay launched outside the screen router (synLaunch /
     openAnodos). We give it its own history entry so Back targets the game
     first, and remember how to close it. */
  var _game = null; // { openFn, label, closeName, closeFn }

  function gameActive() { return !!_game; }

  // Resolve a game's teardown global NAME: ENGINE_INJECTION closeFn →
  // openFoo→closeFoo convention. (Live Arena is excluded — host/lobby flow.)
  function resolveCloseName(openFn) {
    try {
      var inj = window.SymMix && SymMix.ENGINE_INJECTION && SymMix.ENGINE_INJECTION[openFn];
      if (inj && inj.closeFn && typeof window[inj.closeFn] === 'function') return inj.closeFn;
    } catch (_) {}
    var conv = openFn && openFn.replace(/^open/, 'close');
    if (conv && typeof window[conv] === 'function') return conv;
    return null;
  }

  // Wrap a game's global close fn ONCE so that closing it from the game's own
  // ✕/home button (not just browser Back) ends the session and drops the
  // /play suffix from the URL — otherwise _game goes stale and triggers a
  // false exit warning later.
  function wrapCloseName(name) {
    var orig = window[name];
    if (typeof orig !== 'function' || orig.__symNavClose) return;
    var wrapped = function () {
      var r = orig.apply(this, arguments);
      if (_game && _game.closeName === name) {   // self-close while this game is active
        _game = null;
        try {
          if (history.state && history.state._game) {
            var s = ST();
            history.replaceState(navState(s.screen, s.screenParam), '', pathFor(s.screen, s.screenParam));
          }
        } catch (_) {}
      }
      return r;
    };
    wrapped.__symNavClose = true;
    wrapped.__symNavOrig = orig;
    window[name] = wrapped;
  }

  // Register an active game + push its history entry (over the current screen).
  // explicitClose is for overlay games not exposed as a window global (Anodos).
  function beginGame(openFn, label, explicitClose) {
    var closeName = resolveCloseName(openFn);
    if (closeName) wrapCloseName(closeName);
    _game = { openFn: openFn, label: label || openFn || '', closeName: closeName, closeFn: explicitClose || null };
    var s = ST();
    try {
      history.pushState(
        navState(s.screen, s.screenParam, { _game: true, openFn: openFn }),
        '', pathFor(s.screen, s.screenParam) + '/play'
      );
    } catch (_) {}
  }

  function endGame() { _game = null; }

  function closeActiveGame() {
    if (!_game) return;
    var g = _game;
    _game = null;                                // clear FIRST so the close wrap no-ops
    var fn = g.closeFn || (g.closeName && window[g.closeName]);
    if (typeof fn === 'function') { try { fn(); } catch (_) {} }
  }

  var EXIT_MSG = { gr: 'Έξοδος από το παιχνίδι; Η πρόοδος θα χαθεί.', en: 'Exit the game? Your progress will be lost.' };

  // ── Back / Forward ──
  function onPop(e) {
    // If a game is open, Back means "leave the game" → confirm first.
    if (_game) {
      var ok = window.confirm(tr(EXIT_MSG));
      if (!ok) {                              // stay: re-trap by re-pushing the game entry
        var s = ST();
        try {
          history.pushState(
            navState(s.screen, s.screenParam, { _game: true, openFn: _game.openFn }),
            '', pathFor(s.screen, s.screenParam) + '/play'
          );
        } catch (_) {}
        return;
      }
      closeActiveGame();                       // fall through to restore the entry we landed on
    }
    var st = e.state;
    if (st && st._sym) {
      window.STATE.screen = st.screen || 'home';
      window.STATE.screenParam = st.param || null;
      render(); window.scrollTo(0, 0);
    } else {
      restoreFromHash();
    }
  }

  // Cold deep-link / manual hash edit → best-effort restore of the first segment.
  function restoreFromHash() {
    var h = (location.hash || '').replace(/^#\/?/, '');
    var segs = h.split('/');
    var first = segs[0] || '';
    var screen = 'home', param = null;
    if (first === 'tag' && segs[1]) { screen = 'tag'; param = { tag: segs[1] }; }
    else if (first.indexOf('tag-') === 0) { screen = 'tag'; param = { tag: first.slice(4) }; } // legacy
    else if (first && knownScreen(first)) { screen = first; }
    if (screen === ST().screen && !param) return;
    window.STATE.screen = screen;
    window.STATE.screenParam = param;
    render(); window.scrollTo(0, 0);
  }

  // ── Exit warning on tab close / refresh during a game ──
  function onBeforeUnload(e) {
    if (_game) { e.preventDefault(); e.returnValue = ''; return ''; }
  }

  // ── Wrap synLaunch so every real game launch registers a session ──
  function installLaunchWrap() {
    if (typeof window.synLaunch !== 'function' || window.synLaunch.__symNav) return;
    var orig = window.synLaunch;
    var wrapped = function (openFn) {
      var p = orig.apply(this, arguments);
      // Only guard real single games — not the Live Arena host/lobby flow,
      // and only when the manifest actually has the opener.
      if (openFn && openFn !== 'openLiveArena' && window.SYN_GAMES && window.SYN_GAMES[openFn]) {
        Promise.resolve(p).then(function () { beginGame(openFn, openFn); }).catch(function () {});
      }
      return p;
    };
    wrapped.__symNav = true;
    window.synLaunch = wrapped;
  }

  // ── Public API ──
  window.SymNav = {
    _sync: _sync,
    beginGame: beginGame,
    endGame: endGame,
    gameActive: gameActive,
    closeActiveGame: closeActiveGame,
    push: pushNav,
    replace: replaceNav,
  };

  function init() {
    installLaunchWrap();
    window.addEventListener('popstate', onPop);
    window.addEventListener('beforeunload', onBeforeUnload);
    // Baseline entry for the screen the app booted into (so Back has state).
    var s = ST();
    replaceNav(s.screen || 'home', s.screenParam || null);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
