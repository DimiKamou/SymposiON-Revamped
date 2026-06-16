// ============================================================
//  SymposiON — Client-Side Router
//  HTML5 History API · clean pathname-based URL routing
//
//  Integrates with nav.js globals: _navH, _navC, _navRestoring
//  Must be loaded AFTER all other js/ scripts (see index.html).
// ============================================================

const _GRADE_KEYS = new Set([
  'gym-a', 'gym-b', 'gym-c',
  'lyk-a', 'lyk-b', 'lyk-c',
  'gram-nea', 'gram-arch', 'gram-lat',
]);

const _BROWSE_KEYS = new Set(['gymnasio', 'lykeio', 'grammatiki']);

// ── State object → URL pathname ──────────────────────────────
function _stateToPath(state) {
  if (!state) return '/';
  switch (state.page) {
    case 'home':       return '/';
    case 'browse': {
      const lvl = state.browseLevel;
      return (lvl && lvl !== 'root' && _BROWSE_KEYS.has(lvl))
        ? `/browse/${lvl}` : '/browse';
    }
    case 'grade':      return state.gradeKey ? `/${state.gradeKey}` : '/';
    case 'subject':    return `/${state.gradeKey}/${state.subjectId}`;
    case 'trivia':     return `/${state.gradeKey}/${state.subjectId}/trivia`;
    case 'admin':      return '/admin';
    case 'profile':    return '/profile';
    case 'subscribe':  return '/subscribe';
    case 'favorites':  return '/favorites';
    case 'about':      return '/about';
    case 'contact':    return '/contact';
    case 'feedback':   return '/feedback';
    case 'review-hub': return '/review-hub';
    case 'teacher':    return '/teacher';
    case 'gamepanel':  return '/gamepanel';
    default:           return '/';
  }
}

// ── URL pathname → view handler function ──────────────────────
function _pathToHandler(pathname) {
  const clean = pathname.split('?')[0].split('#')[0];
  const parts = clean.replace(/^\//, '').split('/').filter(Boolean);
  const [p0, p1, p2] = parts;

  if (!p0) return () => goTo('home');

  switch (p0) {
    case 'browse':
      return () => (_BROWSE_KEYS.has(p1) ? browseTo(p1) : goTo('browse'));
    case 'admin':
      // The router runs before auth resolves; auth.js triggers _showAdminInCurrentTab()
      // once isAdmin is confirmed. This is a no-op safety fallback.
      return () => { if (typeof _showAdminInCurrentTab === 'function') _showAdminInCurrentTab(); };
    case 'profile':
      return () => { if (typeof navToProfile    === 'function') navToProfile();    };
    case 'subscribe':
      return () => { if (typeof navToSubscribe  === 'function') navToSubscribe();  };
    case 'favorites':
      return () => { if (typeof navToFavorites  === 'function') navToFavorites();  };
    case 'about':
      return () => { if (typeof navToAbout      === 'function') navToAbout();      };
    case 'contact':
      return () => { if (typeof navToContact    === 'function') navToContact();    };
    case 'feedback':
      return () => { if (typeof navToFeedback   === 'function') navToFeedback();   };
    case 'review-hub':
      return () => { if (typeof navToReviewHub  === 'function') navToReviewHub();  };
    case 'teacher':
      return () => { if (typeof navToTeacher    === 'function') navToTeacher();    };
    case 'gamepanel':
      return () => { if (typeof openGamesPanel  === 'function') openGamesPanel();  };
  }

  if (_GRADE_KEYS.has(p0)) {
    if (!p1)             return () => navToGrade(p0);
    if (p2 === 'trivia') return () => navToTrivia(p0, p1);
    return () => navToSubject(p0, p1);
  }

  return null; // unrecognised path
}

// ── URL pathname → nav-stack state object ─────────────────────
function _stateFromPath(pathname) {
  const clean = pathname.split('?')[0].split('#')[0];
  const parts = clean.replace(/^\//, '').split('/').filter(Boolean);
  const [p0, p1, p2] = parts;

  if (!p0)                 return { page: 'home' };
  if (p0 === 'browse')     return { page: 'browse', browseLevel: p1 || 'root' };
  if (p0 === 'admin')      return { page: 'admin' };
  if (p0 === 'profile')    return { page: 'profile' };
  if (p0 === 'subscribe')  return { page: 'subscribe' };
  if (p0 === 'favorites')  return { page: 'favorites' };
  if (p0 === 'about')      return { page: 'about' };
  if (p0 === 'contact')    return { page: 'contact' };
  if (p0 === 'feedback')   return { page: 'feedback' };
  if (p0 === 'review-hub') return { page: 'review-hub' };
  if (p0 === 'teacher')    return { page: 'teacher' };
  if (p0 === 'gamepanel')  return { page: 'gamepanel' };

  if (_GRADE_KEYS.has(p0)) {
    if (!p1)             return { page: 'grade',   gradeKey: p0 };
    if (p2 === 'trivia') return { page: 'trivia',  gradeKey: p0, subjectId: p1 };
    return               { page: 'subject', gradeKey: p0, subjectId: p1 };
  }

  return { page: 'home' };
}

// ── Public API ────────────────────────────────────────────────
const Router = {
  // Used by _navPush in nav.js to get the URL for history.pushState.
  pathFor: _stateToPath,

  // Intercept <a href="/..."> clicks — route them internally without a reload.
  // Anchors with existing onclick attributes handle their own navigation and
  // are intentionally skipped.
  interceptLinks() {
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a) return;
      const href = a.getAttribute('href');
      // Only handle same-origin absolute paths.
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;
      if (a.hasAttribute('download') || a.target === '_blank') return;
      // Skip anchors already wired to inline navigation logic.
      if (a.hasAttribute('onclick')) return;
      const handler = _pathToHandler(href);
      if (!handler) return;
      e.preventDefault();
      handler(); // _navPush inside the handler writes the URL to history
    }, true);
  },

  // Boot-time: parse window.location.pathname and dispatch the correct view.
  // This handles hard-refreshes to sub-URLs like /admin or /gym-b/iliada.
  //
  // Steps:
  //  1. Find the matching route handler.
  //  2. Replace the baseline "home" entry in _navH with this page's state so
  //     that back-navigation from within the SPA works correctly.
  //  3. Show the view with _navRestoring=true so _navPush doesn't create an
  //     extra browser history entry (the URL is already correct).
  initFromPathname() {
    const path = window.location.pathname;
    if (!path || path === '/') return;

    // Query-param routes (?nav=…) are handled by _initFromURL() in nav.js.
    // Don't conflict with them.
    if (window.location.search) return;

    const handler = _pathToHandler(path);
    if (!handler) {
      // Unknown path — silently fall back to home and fix the URL.
      history.replaceState({ _navC: 0 }, '', '/');
      return;
    }

    // Replace the seeded "home" entry so the nav stack reflects reality.
    // The browser history entry for this URL already exists (the hard-refresh
    // itself), so we only replaceState to attach the correct _navC index.
    const pageState = _stateFromPath(path);
    _navH[0] = pageState;
    _navC = 0;
    history.replaceState({ _navC: 0 }, '', path);

    // Activate the view without writing another history entry.
    _navRestoring = true;
    try { handler(); } finally { _navRestoring = false; }
  },
};

// ── Boot ──────────────────────────────────────────────────────
Router.interceptLinks();
Router.initFromPathname();
