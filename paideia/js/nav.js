// ============================================================
//  SymposiON — Navigation & Page Rendering
//  Handles: routing, breadcrumbs, grade/subject/game pages
// ============================================================

// ── GLOBAL ERROR BOUNDARY ─────────────────────────────────────
// Installed immediately (nav.js loads before auth.js) so it covers
// every script on the page.
//
// Two classes of error:
//   BENIGN  — Firebase internal tab-sync noise ("No Listener",
//             "tabs:outgoing.message.ready", etc.).  Suppressed
//             silently; they do not affect app functionality.
//   FATAL   — Anything else. Shows a localised Onyx-Gold alert
//             banner and prevents the default browser crash UI.
;(function _installErrorBoundary() {
  'use strict';

  // Firebase internals and known benign runtime messages to silence
  const _BENIGN_PATTERNS = [
    'No Listener',
    'tabs:outgoing.message.ready',
    'INTERNAL ASSERT FAILED',
    'setClient called',
    'Provided persistence',
    'IndexedDB',          // SW/IDB setup races on first load
    'document is not defined',
  ];

  function _isBenign(msg) {
    const s = String(msg ?? '');
    return _BENIGN_PATTERNS.some(p => s.includes(p));
  }

  // Build and show the Onyx-Gold crash banner (idempotent — only one ever shown)
  function _showCrashBanner() {
    if (document.getElementById('sym-crash-banner')) return;
    const wrap = document.createElement('div');
    wrap.id = 'sym-crash-banner';
    wrap.setAttribute('role', 'alert');
    wrap.innerHTML =
      '<div class="sym-cb-inner">' +
        '<span class="sym-cb-icon" aria-hidden="true">⚠</span>' +
        '<div class="sym-cb-body">' +
          '<div class="sym-cb-title">Σφάλμα Συστήματος</div>' +
          '<div class="sym-cb-msg">Παρουσιάστηκε σφάλμα χρονισμού δικτύου. ' +
          'Παρακαλώ ανανεώστε τη σελίδα ή δοκιμάστε ξανά.</div>' +
        '</div>' +
        '<button class="sym-cb-reload" onclick="location.reload()" ' +
                'aria-label="Ανανέωση σελίδας">↺ Ανανέωση</button>' +
        '<button class="sym-cb-close" ' +
                'onclick="document.getElementById(\'sym-crash-banner\').remove()" ' +
                'aria-label="Κλείσιμο">✕</button>' +
      '</div>';
    // Append safely even if body isn't ready yet
    const target = document.body || document.documentElement;
    if (target) target.appendChild(wrap);
  }

  // ── window.onerror — synchronous errors ──
  window.onerror = function(msg, _src, _line, _col, _err) {
    if (_isBenign(msg)) return true; // suppress silently
    console.error('[SymposiON] Unhandled error:', msg, _src + ':' + _line);
    _showCrashBanner();
    return true; // prevent default browser error UI
  };

  // ── unhandledrejection — async / Promise errors ──
  window.addEventListener('unhandledrejection', function(ev) {
    const reason = ev?.reason;
    // Firebase sometimes double-wraps: Error{ message: "Uncaught Error: No Listener: …" }
    // Check both the .message property and the full string serialisation.
    const msgA = reason instanceof Error ? reason.message : '';
    const msgB = String(reason ?? '');
    if (_isBenign(msgA) || _isBenign(msgB)) { ev.preventDefault(); return; }
    console.error('[SymposiON] Unhandled promise rejection:', reason);
    ev.preventDefault();
    _showCrashBanner();
  });
})();

// ── STATE ──
let currentGradeKey = 'gym-b';
let currentSubjectId = 'iliada';
let browseLevel = 'root';
let siteLang = 'gr';

// ── SITE ACCESS CONFIG (loaded from Firestore /config/access) ──
var _siteAccess = {
  'gym-a':     'free',
  'gym-b':     'free',
  'gym-c':     'student',
  'lyk-a':     'student',
  'lyk-b':     'student',
  'lyk-c':     'student',
  'gram-nea':  'student',
  'gram-arch': 'student',
  'gram-lat':  'teacher',
};

// ── FEATURE FLAGS (loaded from Firestore /config/features) ──
// upload = the "Δικό μου" Αρχείο/AI box in the games configurator.
//   { enabled: bool, tier: 'free'|'student'|'teacher' }  (tier = minimum plan)
// Default mirrors the previous hard-coded behaviour: teachers only.
var _siteFeatures = {
  upload: { enabled: true, tier: 'teacher' },
};

async function _loadSiteFeatures() {
  try {
    const doc = await firebase.firestore().collection('config').doc('features').get();
    if (doc.exists && doc.data() && doc.data().upload) {
      Object.assign(_siteFeatures.upload, doc.data().upload);
    }
  } catch (_) {}
  // Re-render the upload box if the configurator is already open
  if (typeof _gpRenderUploadBox === 'function') { try { _gpRenderUploadBox(); } catch (_) {} }
}

// True if the current user may use the upload / AI box (admin-gated + tiered).
function _gpCanUseUpload() {
  if (typeof isAdmin !== 'undefined' && isAdmin) return true;
  const f = (_siteFeatures && _siteFeatures.upload) || {};
  if (f.enabled === false) return false;
  return (typeof _gpCanAccessTier === 'function') ? _gpCanAccessTier(f.tier || 'teacher') : false;
}

async function _loadSiteConfig() {
  try {
    const doc = await firebase.firestore().collection('config').doc('access').get();
    if (doc.exists && doc.data().grades) Object.assign(_siteAccess, doc.data().grades);
  } catch (_) {}
  _refreshHomeLocks();
}

// ── Load per-game tier overrides + tags from Firestore /config/game-tiers ──
async function _loadGameTiers() {
  try {
    const doc = await firebase.firestore().collection('config').doc('game-tiers').get();
    if (!doc.exists) return;
    const d = doc.data();

    // Dataset tiers
    if (d.tiers && typeof GP_DATASETS !== 'undefined') {
      GP_DATASETS.forEach(ds => {
        if (d.tiers[ds.id] !== undefined) ds.tier = d.tiers[ds.id];
      });
    }
    // Engine tiers
    if (d.engineTiers && typeof GP_ENGINES !== 'undefined') {
      GP_ENGINES.forEach(e => {
        if (d.engineTiers[e.id] !== undefined) e.tier = d.engineTiers[e.id];
      });
    }
    // Dataset tags → drive isNew, isFeatured flags on each dataset object
    if (d.datasetTags && typeof GP_DATASETS !== 'undefined') {
      GP_DATASETS.forEach(ds => {
        const tags = d.datasetTags[ds.id] || [];
        ds.isNew      = tags.includes('new')      || !!ds.isNew;
        ds.isFeatured = tags.includes('featured')  || !!ds.isFeatured;
        ds.isPopular  = tags.includes('popular');
        ds.isUpdated  = tags.includes('updated');
      });
    }
    // Engine tags → same pattern
    if (d.engineTags && typeof GP_ENGINES !== 'undefined') {
      GP_ENGINES.forEach(e => {
        const tags = d.engineTags[e.id] || [];
        e.isNew      = tags.includes('new');
        e.isFeatured = tags.includes('featured');
        e.isPopular  = tags.includes('popular');
        e.isUpdated  = tags.includes('updated');
      });
    }
  } catch (_) {}
}

// ── Load engine↔content allow-list from Firestore /config/engine-content ──
//   map = { 'Γραμματική': [engineId,…], 'Λατινικά': [...] }. A category key
//   present = only those engines allowed; a category absent = no override =
//   all engines allowed. Mirrors _loadGameTiers.
var _gpEngineContent = null;

async function _loadEngineContent() {
  try {
    const doc = await firebase.firestore().collection('config').doc('engine-content').get();
    if (doc.exists && doc.data().map) {
      _gpEngineContent = doc.data().map;
      window._gpEngineContent = _gpEngineContent;
    }
  } catch (_) {}
}

// True when `engineId` is allowed for content `category`. Falls back to
// "all allowed" when no map is stored or the category key is missing.
// Reads window._gpEngineContent so an admin save applies without reload.
function _gpEngineAllowedForCategory(engineId, category) {
  const map = (typeof window !== 'undefined' && window._gpEngineContent) || _gpEngineContent;
  if (!map) return true;
  const list = map[category];
  if (!Array.isArray(list)) return true;
  return list.includes(engineId);
}

// ── Stamp 🔒 on home-page dropdown items whose grade is locked ──
function _refreshHomeLocks() {
  document.querySelectorAll('.dd-item[onclick]').forEach(el => {
    const m = el.getAttribute('onclick').match(/navToGrade\('([^']+)'\)/);
    if (!m) return;
    const key = m[1];
    // Strip any previously added lock span
    el.querySelectorAll('.dd-lock').forEach(s => s.remove());
    if (!_gradeAccessible(key)) {
      const lock = document.createElement('span');
      lock.className = 'dd-lock';
      lock.textContent = ' 🔒';
      lock.style.cssText = 'font-size:11px;opacity:0.7;';
      el.appendChild(lock);
    }
  });
}

function _gradeAccessible(gradeKey) {
  // ── Temporarily open — admin will configure per-grade restrictions ──
  return true;
  /* Original gate (restore when admin restrictions are ready):
  if (typeof isAdmin !== 'undefined' && isAdmin) return true;
  const required = _siteAccess[gradeKey] || 'student';
  if (required === 'free') return true;
  const role = (typeof currentUserRole !== 'undefined') ? currentUserRole : 'free';
  if (role === 'free') return false;
  if (required === 'student') return role === 'student' || role === 'teacher';
  if (required === 'teacher') return role === 'teacher';
  return false;
  */
}

// ── BANNER SYSTEM ──
var _dismissedBanners = new Set(
  JSON.parse(localStorage.getItem('symposion_dismissed_banners') || '[]')
);

async function _loadSiteBanners() {
  const wrap = document.getElementById('site-banners-wrap');
  if (!wrap) return;
  try {
    const snap = await firebase.firestore()
      .collection('banners')
      .where('active', '==', true)
      .orderBy('createdAt', 'desc')
      .limit(5)
      .get();

    const banners = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(b => {
        if (_dismissedBanners.has(b.id)) return false;
        if (b.endsAt && b.endsAt.toDate() < new Date()) return false;
        return true;
      });

    wrap.innerHTML = banners.map(b => {
      const title  = siteLang === 'en' ? (b.titleEn || b.titleGr) : b.titleGr;
      const body   = siteLang === 'en' ? (b.bodyEn  || b.bodyGr)  : b.bodyGr;
      const ctaTxt = siteLang === 'en' ? (b.ctaEn   || b.ctaGr)   : b.ctaGr;
      return `
        <div class="site-banner site-banner--${b.type || 'info'}" data-banner-id="${b.id}">
          <div class="site-banner-body">
            <strong class="site-banner-title">${title}</strong>
            ${body ? `<span class="site-banner-text">${body}</span>` : ''}
            ${ctaTxt && b.ctaAction ? `<button class="site-banner-cta" onclick="${b.ctaAction}">${ctaTxt}</button>` : ''}
          </div>
          <button class="site-banner-close" onclick="_dismissBanner('${b.id}')" aria-label="Close">✕</button>
        </div>`;
    }).join('');
  } catch (_) { if (wrap) wrap.innerHTML = ''; }
}

function _dismissBanner(id) {
  _dismissedBanners.add(id);
  localStorage.setItem('symposion_dismissed_banners', JSON.stringify([..._dismissedBanners]));
  const el = document.querySelector(`[data-banner-id="${id}"]`);
  if (el) { el.style.opacity = '0'; setTimeout(() => el.remove(), 280); }
}

// ── TEMPLE RUN config builder ──
function buildTempleRunConfig(subjectId) {
  const titles = {
    gr: { iliada: 'Ιλιάδα', odysseia: 'Οδύσσεια', archaia: 'Αρχαία Ελληνικά',
          'archaia-thx': 'Αρχαία Ελληνικά', eleni: 'Ελένη' },
    en: { iliada: 'Iliad', odysseia: 'Odyssey', archaia: 'Ancient Greek',
          'archaia-thx': 'Ancient Greek', eleni: 'Helen' },
  };
  const title = (titles[siteLang] || titles.gr)[subjectId] || subjectId;

  /* Pull Iliad questions from the arcade data if available */
  let questions = [];
  if ((subjectId === 'iliada' || subjectId === 'odysseia') && typeof window._trQCache !== 'undefined') {
    questions = window._trQCache[subjectId] || [];
  }

  return { title: `${title} — Agora Surfers`, questions, lang: siteLang };
}

// ── CONTEXTUAL THEME ──
function setTheme(gradeKey, subjectId) {
  // Preload the class curriculum so leveled-game pickers can gate synchronously.
  if (window.CurriculumGate) CurriculumGate.prefetch(gradeKey);
  let theme = '';
  if      (subjectId === 'iliada')   theme = 'iliada';
  else if (subjectId === 'odysseia') theme = 'odysseia';
  else if (subjectId === 'eleni')    theme = 'eleni';
  else {
    const gradeTheme = { 'gym-a': 'history-7', 'gym-b': 'history-8', 'gym-c': 'history-9' };
    theme = gradeTheme[gradeKey] || '';
  }
  document.body.dataset.theme = theme;
}

// ── CAROUSEL NAVIGATION ──
function carouselScroll(id, dir) {
  const el = document.getElementById(id);
  if (!el) return;
  const cardW = 175 + 14; // card min-width + gap
  el.scrollBy({ left: dir * cardW * 2, behavior: 'smooth' });
}

// ── NAV HISTORY (back / forward) ──
const _navH = [];
let _navC = -1;
let _navRestoring = false;

function _navPush(state) {
  if (_navRestoring) return;
  const prev = _navH[_navC];
  if (prev && prev.page === state.page && prev.gradeKey === state.gradeKey && prev.subjectId === state.subjectId && prev.browseLevel === state.browseLevel) return;
  _navH.splice(_navC + 1);
  _navH.push(state);
  _navC = _navH.length - 1;
  // Sync with browser History API so mouse/keyboard back-forward work natively
  const _url = typeof Router !== 'undefined' ? Router.pathFor(state) : undefined;
  history.pushState({ _navC: _navC }, '', _url);
}

function _navJump(d) {
  const c = _navC + d;
  if (c < 0 || c >= _navH.length) return;
  _navC = c;
  _navRestoring = true;
  const s = _navH[c];
  switch (s.page) {
    case 'home':      goTo('home'); break;
    case 'browse':    browseLevel = s.browseLevel || 'root'; renderBrowse(); goTo('browse'); break;
    case 'grade':     navToGrade(s.gradeKey); break;
    case 'subject':   navToSubject(s.gradeKey, s.subjectId); break;
    case 'trivia':    navToTrivia(s.gradeKey, s.subjectId); break;
    case 'subscribe': if (typeof navToSubscribe === 'function') navToSubscribe(); break;
    case 'admin':
      if (typeof _showAdminInCurrentTab === 'function') _showAdminInCurrentTab();
      break;
    case 'profile':   if (typeof navToProfile  === 'function') navToProfile();  break;
    case 'favorites': if (typeof navToFavorites === 'function') navToFavorites(); break;
    case 'about':     if (typeof navToAbout === 'function') navToAbout(); break;
    case 'contact':   if (typeof navToContact === 'function') navToContact(); break;
    case 'feedback':    if (typeof navToFeedback    === 'function') navToFeedback();    break;
    case 'review-hub':  if (typeof navToReviewHub  === 'function') navToReviewHub();  break;
    case 'gamepanel':   if (typeof openGamesPanel   === 'function') openGamesPanel();  break;
  }
  _navRestoring = false;
}

// ── OVERLAY CLOSE MAP (for popstate interception) ──
function _closeActiveOverlay(el) {
  const map = {
    'trivia-overlay':          () => closeGame(),
    'path-overlay':            () => closePathitiko(),
    'lyo-overlay':             () => closeLyo(),
    'afw-overlay':             () => closeAfwnolekta(),
    'aob-overlay':             () => closeAoristosB(),
    'rmi-overlay':             () => closeRimataMi(),
    'ous-overlay':             () => closeOusiastika(),
    'gv-overlay':              () => { if (typeof closeGrammarVerbs === 'function') closeGrammarVerbs(); },
    'iliada-arcade-overlay':   () => closeIliadaArcade(),
    'gn-overlay':              () => closeGrammarNouns(),
    'tow-overlay':             () => closeTow(),
    'noun-tow-overlay':        () => closeNounTow(),
    'odyssey-journey-overlay': () => closeOdysseyJourney(),
    'ch-overlay':              () => { if (typeof CryptoHack !== 'undefined') CryptoHack.close(); },
    'syn-overlay':             () => closeSynirimmena(),
    'history-game-overlay':    () => closeHistoryGame(),
    'istoria-overlay':         () => closeIstoria(),
    'ept-overlay':             () => { if (typeof closeEpitheta === 'function') closeEpitheta(); },
    'par-overlay':             () => closeParatheta(),
    'kr-overlay':              () => closeKlisiRimaton(),
    'eimi-overlay':            () => closeEimi(),
    'temple-run-overlay':      () => closeTempleRun(),
    'agora-surfers-overlay':   () => { if (typeof closeAgoraSurfers === 'function') closeAgoraSurfers(); else closeTempleRun(); },
    'arv-overlay':             () => closeAnwmalaRimata(),
    'noun-fill-overlay':       () => closeNounFill(),
    'ant-overlay':             () => closeAntonymies(),
    'invaders-overlay':        () => closeInvaders(),
    'myth-memory-overlay':     () => { if (typeof closeMythMemory    === 'function') closeMythMemory();    },
    'rf-overlay':              () => { if (typeof closeRapidFire    === 'function') closeRapidFire();    },
    'epic-puzzle-overlay':     () => { if (typeof closeEpicPuzzle  === 'function') closeEpicPuzzle();   },
    'latk-overlay':            () => { if (typeof closeLatKata      === 'function') closeLatKata();      },
    'latnk-overlay':           () => { if (typeof closeLatNounsKata === 'function') closeLatNounsKata(); },
    'latn-overlay':            () => { if (typeof closeLatNouns     === 'function') closeLatNouns();     },
    'latv-overlay':            () => { if (typeof closeLatVerbs     === 'function') closeLatVerbs();     },
    'late-overlay':            () => { if (typeof closeLatEpitheta  === 'function') closeLatEpitheta();  },
    'latek-overlay':           () => { if (typeof closeLatEpithetaKata === 'function') closeLatEpithetaKata(); },
    'latp-overlay':            () => { if (typeof closeLatAntonymies=== 'function') closeLatAntonymies();},
    'latpt-overlay':           () => { if (typeof closeLatAntonymiesTheory === 'function') closeLatAntonymiesTheory();},
    'latnt-overlay':           () => { if (typeof closeLatNounsKataTheory === 'function') closeLatNounsKataTheory();},
    'lekt-overlay':            () => { if (typeof closeLatEpithetaKataTheory === 'function') closeLatEpithetaKataTheory();},
    'phalanx-overlay':         () => { if (typeof closePhalanx      === 'function') closePhalanx();     },
    'dig-overlay':             () => { if (typeof closeDig          === 'function') closeDig();         },
    'labyrinth-overlay':       () => { if (typeof closeLabyrinth    === 'function') closeLabyrinth();   },
    'naumachia-overlay':       () => { if (typeof closeNaumachia    === 'function') closeNaumachia();   },
    'anodos-overlay':          () => { if (typeof closeAnodos       === 'function') closeAnodos();      },
    'gf-overlay':              () => { if (typeof GoldenFleece !== 'undefined' && GoldenFleece._tryClose) GoldenFleece._tryClose(); else if (typeof closeGoldenFleece === 'function') closeGoldenFleece(); },
    'al-overlay':              () => { if (typeof Halieia !== 'undefined' && Halieia._tryClose) Halieia._tryClose(); else if (typeof closeHalieia === 'function') closeHalieia(); },
    'study-overlay':           () => closeStudyOverlay(),
    'tartarus-overlay':        () => { if (typeof closeTartarusReview === 'function') closeTartarusReview(); },
  };
  const fn = map[el.id];
  if (fn) { try { fn(); } catch (err) { el.classList.remove('active'); document.body.style.overflow = ''; } }
  else { el.classList.remove('active'); document.body.style.overflow = ''; }
}

// Browser back/forward (includes mouse side-buttons and keyboard Alt+←/→).
// If an overlay is open the back button gracefully closes it instead of
// breaking the routing stack.
window.addEventListener('popstate', e => {
  // ── Games panel open? Close it, then navigate to target state ──
  const gpOv = document.getElementById('games-panel-overlay');
  if (gpOv?.classList.contains('active')) {
    closeGamesPanel(true); // fromPopstate — skip URL manipulation inside closeGamesPanel
    const targetIdx = e.state?._navC ?? 0;
    const d = targetIdx - _navC;
    if (d !== 0) {
      _navJump(d);
    } else {
      // Same position — just re-anchor the URL to the current nav state
      const _cur = typeof Router !== 'undefined' ? Router.pathFor(_navH[_navC]) : undefined;
      history.pushState({ _navC: _navC }, '', _cur);
    }
    return;
  }

  // ── Engine configurator modal open? Close it and re-anchor ──
  const ecmOv = document.getElementById('engine-cfg-modal');
  if (ecmOv?.classList.contains('active')) {
    closeEngineConfigurator();
    const _cur = typeof Router !== 'undefined' ? Router.pathFor(_navH[_navC]) : undefined;
    history.pushState({ _navC: _navC }, '', _cur);
    return;
  }

  // ── Game overlay open? Close it and re-anchor ──
  const activeOverlay = document.querySelector('.game-overlay.active');
  if (activeOverlay) {
    const _reanchor = () => {
      const _cur = typeof Router !== 'undefined' ? Router.pathFor(_navH[_navC]) : undefined;
      history.pushState(e.state ?? { _navC: _navC }, '', _cur);
    };
    // GF / Halieia: restore history first, then show leave-confirm inside the game
    if (activeOverlay.id === 'gf-overlay' &&
        typeof GoldenFleece !== 'undefined' && typeof GoldenFleece._tryClose === 'function') {
      _reanchor();
      GoldenFleece._tryClose();
      return;
    }
    if (activeOverlay.id === 'al-overlay' &&
        typeof Halieia !== 'undefined' && typeof Halieia._tryClose === 'function') {
      _reanchor();
      Halieia._tryClose();
      return;
    }
    // All other game overlays: close and re-open game panel
    _closeActiveOverlay(activeOverlay);
    _reanchor();
    if (typeof openGamesPanel === 'function') setTimeout(openGamesPanel, 80);
    return;
  }

  const targetIdx = e.state?._navC ?? 0;
  const d = targetIdx - _navC;
  if (d !== 0) _navJump(d);
});

// Alt + ← / → keyboard shortcut — delegate to browser history so popstate handles it
document.addEventListener('keydown', e => {
  if (e.altKey && e.key === 'ArrowLeft')  { e.preventDefault(); history.go(-1); }
  if (e.altKey && e.key === 'ArrowRight') { e.preventDefault(); history.go(1); }
});

// ── i18n ──
function t(gr, en) { return siteLang === 'en' ? (en || gr) : gr; }

function setSiteLang(l) {
  siteLang = l;
  // Sync all lang-opt buttons across all navs
  document.querySelectorAll('.lang-opt').forEach(btn => {
    const text = btn.textContent.trim();
    btn.classList.toggle('active', (text === 'GR' && l === 'gr') || (text === 'EN' && l === 'en'));
  });
  // Swap [data-gr] / [data-en] text content
  document.querySelectorAll('[data-gr]').forEach(el => {
    el.textContent = l === 'en' ? (el.dataset.en || el.dataset.gr) : el.dataset.gr;
  });
  // Swap [data-gr-html] / [data-en-html] inner HTML (for elements with child tags)
  document.querySelectorAll('[data-gr-html]').forEach(el => {
    el.innerHTML = l === 'en' ? (el.dataset.enHtml || el.dataset.grHtml) : el.dataset.grHtml;
  });
  // Re-render nav auth area so dynamically-injected buttons (Assign, Admin) also translate
  if (typeof _updateAllNavbars === 'function') _updateAllNavbars();
  // Re-render active dynamic page so generated content also translates
  const activePage = document.querySelector('.page.active');
  if (!activePage) return;
  switch (activePage.id) {
    case 'page-browse':    renderBrowse(); break;
    case 'page-grade':     navToGrade(currentGradeKey); break;
    case 'page-subject':   navToSubject(currentGradeKey, currentSubjectId); break;
    case 'page-trivia':    navToTrivia(currentGradeKey, currentSubjectId); break;
    case 'page-subscribe': if (typeof _renderSubscribePage === 'function') _renderSubscribePage(); break;
    case 'page-admin':     if (typeof _renderAdminPage === 'function') _renderAdminPage(); break;
    case 'page-profile':   if (typeof renderProfilePage === 'function') renderProfilePage(); break;
    case 'page-favorites': if (typeof navToFavorites === 'function') navToFavorites(); break;
    case 'page-about':     if (typeof _renderAboutPage === 'function') _renderAboutPage(); break;
    case 'page-contact':   if (typeof _renderContactPage === 'function') _renderContactPage(); break;
    case 'page-feedback':    if (typeof _renderFeedbackPage === 'function') _renderFeedbackPage(); break;
    case 'page-review-hub':  if (typeof loadReviewDashboard === 'function') loadReviewDashboard(typeof _rhFilter !== 'undefined' ? _rhFilter : 'all'); break;
  }
}

// ── GLOBAL LOADING SCREEN ──
// ── SYMPOSION BOARD GAME ─────────────────────────────────────────────
function openSymposion() {
  const ov = document.getElementById('symposion-overlay');
  if (!ov) return;
  ov.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeSymposion() {
  const ov = document.getElementById('symposion-overlay');
  if (!ov) return;
  ov.classList.remove('active');
  document.body.style.overflow = '';
  goTo('home');
}
window.openSymposion  = openSymposion;
window.closeSymposion = closeSymposion;

// showLoadingScreen() / hideLoadingScreen() — standardised overlay for any
// async cross-module fetch. Prevents the invisible-freeze UX bug on production.
function showLoadingScreen(msg) {
  let screen = document.getElementById('sym-loading-screen');
  if (!screen) {
    screen = document.createElement('div');
    screen.id = 'sym-loading-screen';
    screen.innerHTML = `
      <div class="sym-ls-inner">
        <div class="sym-ls-ring"></div>
        <div class="sym-ls-msg" id="sym-ls-msg"></div>
      </div>`;
    document.body.appendChild(screen);
  }
  const msgEl = document.getElementById('sym-ls-msg');
  if (msgEl) msgEl.textContent = msg || '';
  screen.offsetHeight; // force reflow so CSS transition fires on first call
  screen.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function hideLoadingScreen() {
  const screen = document.getElementById('sym-loading-screen');
  if (!screen) return;
  screen.classList.remove('active');
  // Restore scroll only when no other modal/overlay is using it
  if (!document.querySelector('.game-overlay.active, #auth-modal.active')) {
    document.body.style.overflow = '';
  }
}

// ── TOAST NOTIFICATION ──
function showToast(msgGr, msgEn) {
  const existing = document.getElementById('site-toast');
  if (existing) existing.remove();
  const toast = document.createElement('div');
  toast.id = 'site-toast';
  toast.className = 'site-toast';
  toast.textContent = t(msgGr, msgEn);
  document.body.appendChild(toast);
  requestAnimationFrame(() => { requestAnimationFrame(() => toast.classList.add('show')); });
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 350); }, 2600);
}

// ── AUTH BUTTONS ──
function onLogin()  { if (typeof openAuthModal === 'function') openAuthModal('login');  }
function onSignup() { if (typeof openAuthModal === 'function') openAuthModal('signup'); }

// ── PAGE ROUTING ──
function goTo(page) {
  // Guard: admin page is exclusively accessible by the admin account
  if (page === 'admin' && (typeof isAdmin === 'undefined' || !isAdmin)) return;

  // Guard: profile page requires authentication
  if (page === 'profile' && (typeof currentUser === 'undefined' || !currentUser)) {
    if (typeof openAuthModal === 'function') openAuthModal('login');
    return;
  }

  const pageEl = document.getElementById('page-' + page);
  if (!pageEl) return;

  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  pageEl.classList.add('active');
  window.scrollTo(0, 0);
  closeBcDDs();
  closeAllDD();
  if (page === 'home') { _navPush({ page: 'home' }); document.body.dataset.theme = ''; }
}

// ── HOME DROPDOWNS ──
function toggleDD(id, btnId) {
  const dd = document.getElementById(id), btn = document.getElementById(btnId);
  document.querySelectorAll('.dropdown').forEach(d => { if (d.id !== id) d.classList.remove('open'); });
  document.querySelectorAll('.grade-btn:not(.locked)').forEach(b => { if (b.id !== btnId) b.classList.remove('active', 'open'); });
  dd.classList.toggle('open');
  btn.classList.toggle('active');
  btn.classList.toggle('open');
}
function closeAllDD() {
  document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  document.querySelectorAll('.grade-btn:not(.locked)').forEach(b => b.classList.remove('active', 'open'));
}
document.addEventListener('click', e => {
  if (!e.target.closest('.grade-item')) closeAllDD();
  if (!e.target.closest('.bc')) closeBcDDs();
});

// ── BREADCRUMB DROPDOWNS ──
function toggleBcDD(ddId, e) {
  e.stopPropagation();
  const dd = document.getElementById(ddId);
  if (!dd) return;
  const isOpen = dd.classList.contains('open');
  closeBcDDs();
  if (!isOpen) dd.classList.add('open');
}
function closeBcDDs() {
  document.querySelectorAll('.bc-dropdown').forEach(d => d.classList.remove('open'));
}

function sectionDropdown() {
  return [
    { label: t('Αρχική', 'Home'),         action: "goTo('home')" },
    { label: t('Όλα', 'All'),             action: "browseToRoot()" },
    { label: '─────',                     action: '', disabled: true },
    { label: t('Γυμνάσιο', 'Middle School'),  action: "browseTo('gymnasio')" },
    { label: t('Λύκειο', 'High School'),      action: "browseTo('lykeio')" },
    { label: t('Γραμματική', 'Grammar'),      action: "browseTo('grammatiki')" },
  ];
}
function gradeDropdown(parentKey) {
  const map = { gymnasio: ['gym-a','gym-b','gym-c'], lykeio: ['lyk-a','lyk-b','lyk-c'], grammatiki: ['gram-nea','gram-arch','gram-lat'] };
  return (map[parentKey] || []).map(k => {
    const g = GRADES[k];
    return { label: siteLang === 'en' ? (g.titleEn || g.title) : g.title, action: `navToGrade('${k}')` };
  });
}

// ── NAV BUILDER ──
function buildNav(containerId, crumbs) {
  const c = document.getElementById(containerId);
  if (!c) return;
  let html = `<nav class="nav"><div style="display:flex;align-items:center;gap:1.25rem;min-width:0;flex:1;overflow:hidden;"><div class="logo" onclick="goTo('home')">Symposi<span>ON</span></div><div class="breadcrumb">`;
  crumbs.forEach((cr, i) => {
    if (i > 0) html += `<span class="bc-sep">›</span>`;
    if (cr.dropdown && cr.action) {
      // Both action and dropdown: label navigates, small ▾ opens dropdown
      const ddId    = `bc-dd-${containerId}-${i}`;
      const ddBtnId = `bc-${containerId}-${i}`;
      html += `<span class="bc-split">`;
      html += `<span class="bc bc-nav" onclick="${cr.action};closeBcDDs()">${cr.label}</span>`;
      html += `<span class="bc bc-chevron" id="${ddBtnId}" onclick="toggleBcDD('${ddId}',event)">▾`;
      html += `<div class="bc-dropdown" id="${ddId}">`;
      cr.dropdown.forEach(opt => {
        html += `<div class="bc-dd-item${opt.disabled ? ' disabled' : ''}" onclick="${opt.action};closeBcDDs();event.stopPropagation();">${opt.label}</div>`;
      });
      html += `</div></span></span>`;
    } else if (cr.dropdown) {
      // Dropdown only (no direct nav action)
      html += `<span class="bc has-dd" id="bc-${containerId}-${i}" onclick="toggleBcDD('bc-dd-${containerId}-${i}', event)">${cr.label}`;
      html += `<div class="bc-dropdown" id="bc-dd-${containerId}-${i}">`;
      cr.dropdown.forEach(opt => {
        html += `<div class="bc-dd-item${opt.disabled ? ' disabled' : ''}" onclick="${opt.action};closeBcDDs();event.stopPropagation();">${opt.label}</div>`;
      });
      html += `</div></span>`;
    } else if (cr.action) {
      html += `<span class="bc" onclick="${cr.action}">${cr.label}</span>`;
    } else {
      html += `<span class="bc current">${cr.label}</span>`;
    }
  });
  html += `</div></div><div class="nav-right">`;
  html += `<div class="lang-toggle">`;
  html += `<button class="lang-opt${siteLang === 'gr' ? ' active' : ''}" onclick="setSiteLang('gr')">GR</button>`;
  html += `<button class="lang-opt${siteLang === 'en' ? ' active' : ''}" onclick="setSiteLang('en')">EN</button>`;
  html += `</div>`;
  html += `<div class="nav-auth-area"></div>`;
  html += `</div></nav>`;
  c.innerHTML = html;
  // Populate the auth area based on current login state
  const authArea = c.querySelector('.nav-auth-area');
  if (authArea && typeof _renderNavAuthArea === 'function') _renderNavAuthArea(authArea);
}

// ── BROWSE PAGE ──
function browseTo(sectionKey) {
  browseLevel = sectionKey;
  renderBrowse();
  goTo('browse');
  _navPush({ page: 'browse', browseLevel: sectionKey });
}
function renderBrowse() {
  const isRoot = browseLevel === 'root';
  const items  = BROWSE_SECTIONS[browseLevel] || BROWSE_SECTIONS.root;

  document.getElementById('browse-title').textContent    = isRoot ? t('Όλες οι βαθμίδες', 'All Levels') : labelFor(browseLevel);
  document.getElementById('browse-subtitle').textContent = isRoot
    ? t('Επίλεξε βαθμίδα για να δεις τα διαθέσιμα μαθήματα.', 'Choose a level to see available courses.')
    : t('Επίλεξε τάξη ή κατηγορία.', 'Choose a grade or category.');
  const backBtn = document.getElementById('browse-back-btn');
  backBtn.style.display  = isRoot ? 'none' : 'inline-flex';
  backBtn.textContent    = t('← Πίσω', '← Back');
  document.getElementById('browse-section-label').textContent = isRoot ? t('Βαθμίδες', 'Levels') : labelFor(browseLevel);

  if (isRoot) {
    buildNav('browse-nav-wrap', [
      { label: t('Αρχική', 'Home'), action: "goTo('home')" },
      { label: t('Όλα', 'All') }
    ]);
  } else {
    buildNav('browse-nav-wrap', [
      { label: t('Αρχική', 'Home'), action: "goTo('home')" },
      { label: t('Όλα', 'All'),     action: "browseToRoot()" },
      { label: labelFor(browseLevel) }
    ]);
  }

  const grid = document.getElementById('browse-grid');
  grid.innerHTML = '';
  items.forEach(item => {
    const label     = siteLang === 'en' ? (item.labelEn || item.label) : item.label;
    const desc      = siteLang === 'en' ? (item.descEn  || item.desc)  : item.desc;
    const soonLabel = t('Σύντομα', 'Soon');
    const box = document.createElement('div');
    box.className = 'browse-box' + (item.disabled ? ' disabled' : '');
    box.innerHTML = `<div class="browse-box-banner" style="background:${item.bg};position:relative;">${item.icon}</div><div class="browse-box-body"><h3>${label}</h3><p>${desc}</p></div>${item.disabled ? `<div class="coming-soon">${soonLabel}</div>` : ''}`;
    if (!item.disabled) box.onclick = () => {
      if (GRADES[item.key]) navToGrade(item.key); else browseTo(item.key);
    };
    grid.appendChild(box);
  });
}
function browseback() {
  browseLevel = 'root';
  renderBrowse();
  _navPush({ page: 'browse', browseLevel: 'root' });
}

function browseToRoot() {
  browseLevel = 'root';
  renderBrowse();
  // Directly activate browse page without going through goTo to avoid
  // any future logic in goTo interfering with browseLevel state
  const pageEl = document.getElementById('page-browse');
  if (pageEl) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    pageEl.classList.add('active');
    window.scrollTo(0, 0);
  }
  _navPush({ page: 'browse', browseLevel: 'root' });
}
function labelFor(key) {
  return {
    gymnasio:   t('Γυμνάσιο', 'Middle School'),
    lykeio:     t('Λύκειο', 'High School'),
    grammatiki: t('Γραμματική', 'Grammar'),
  }[key] || key;
}

// ── GRADE PAGE ──
function navToGrade(gradeKey) {
  // Navigation is always free — paywall only fires at game launch
  currentGradeKey = gradeKey;
  closeAllDD(); closeBcDDs();
  _navPush({ page: 'grade', gradeKey });
  setTheme(gradeKey, null);
  const g = GRADES[gradeKey];
  if (!g) return;

  const label  = siteLang === 'en' ? (g.labelEn  || g.label)  : g.label;
  const title  = siteLang === 'en' ? (g.titleEn  || g.title)  : g.title;
  const desc   = siteLang === 'en' ? (g.descEn   || g.desc)   : g.desc;
  const parent = siteLang === 'en' ? (g.parentEn || g.parent) : g.parent;

  document.getElementById('grade-pill-label').textContent = label;
  document.getElementById('grade-page-title').textContent = title;
  document.getElementById('grade-page-desc').textContent  = desc;

  buildNav('grade-nav-wrap', [
    { label: t('Αρχική', 'Home'), action: "goTo('home')" },
    { label: parent, dropdown: sectionDropdown(), action: `browseTo('${g.parentKey}')` },
    { label: title,  dropdown: gradeDropdown(g.parentKey) },
  ]);

  const wrap = document.getElementById('grade-subjects-wrap');
  wrap.innerHTML = '';
  const availableLabel = t('Διαθέσιμα μαθήματα', 'Available subjects');

  if (g.tracks) {
    g.tracks.forEach(track => {
      const trackTitle = siteLang === 'en' ? (track.titleEn || track.title) : track.title;
      const sec = document.createElement('div');
      sec.className = 'track-section';
      sec.innerHTML = `<div class="grid-label">${trackTitle}</div><div class="subject-grid"></div>`;
      wrap.appendChild(sec);
      track.subjects.forEach(s => sec.querySelector('.subject-grid').appendChild(buildSubjectCard(s, gradeKey)));
    });
  } else {
    const lbl = document.createElement('div');
    lbl.className = 'grid-label';
    lbl.textContent = availableLabel;
    wrap.appendChild(lbl);
    const grid = document.createElement('div');
    grid.className = 'subject-grid';
    g.subjects.forEach(s => grid.appendChild(buildSubjectCard(s, gradeKey)));
    wrap.appendChild(grid);
  }
  goTo('grade');
}

function buildSubjectCard(s, gradeKey) {
  const title      = siteLang === 'en' ? (s.en?.title || s.title) : s.title;
  const desc       = siteLang === 'en' ? (s.en?.desc  || s.desc)  : s.desc;
  const gamesLabel = t('παιχνίδια', 'games');
  const card = document.createElement('div');
  card.className = 'subject-card';
  card.onclick = () => navToSubject(gradeKey, s.id);
  card.innerHTML = `<div class="card-banner" style="background:${s.bg}">${s.icon}</div><div class="subj-body"><h3>${title}</h3><div class="subj-desc">${desc}</div><div class="subj-footer"><span class="game-count">${s.count} ${gamesLabel}</span><div class="card-arrow">→</div></div></div>`;
  return card;
}

// ── SUBJECT / GAMES PAGE ──
function navToSubject(gradeKey, subjectId) {
  // Navigation is always free — paywall only fires at game launch
  currentGradeKey = gradeKey;
  currentSubjectId = subjectId;
  _navPush({ page: 'subject', gradeKey, subjectId });
  setTheme(gradeKey, subjectId);
  const g = GRADES[gradeKey];
  let subject = null;
  if (g.subjects) subject = g.subjects.find(s => s.id === subjectId);
  if (!subject && g.tracks) g.tracks.forEach(tr => { const f = tr.subjects.find(s => s.id === subjectId); if (f) subject = f; });
  if (!subject) subject = { title: subjectId, bg: 'linear-gradient(135deg,#3D1A0A,#8B3E18)', icon: '📚', desc: '' };

  const gradeTitle  = siteLang === 'en' ? (g.titleEn  || g.title)  : g.title;
  const gradeParent = siteLang === 'en' ? (g.parentEn || g.parent) : g.parent;
  const subjectTitle = siteLang === 'en' ? (subject.en?.title || subject.title) : subject.title;
  const subjectDesc  = siteLang === 'en' ? (subject.en?.desc  || subject.desc)  : subject.desc;

  buildNav('subject-nav-wrap', [
    { label: t('Αρχική', 'Home'), action: "goTo('home')" },
    { label: gradeParent, dropdown: sectionDropdown(), action: `browseTo('${g.parentKey}')` },
    { label: gradeTitle,  dropdown: gradeDropdown(g.parentKey), action: `navToGrade('${gradeKey}')` },
    { label: subjectTitle }
  ]);

  document.getElementById('subject-pill').textContent      = `${gradeTitle} · ${subjectTitle}`;
  document.getElementById('subject-title').textContent     = subjectTitle;
  document.getElementById('subject-desc-text').textContent = subjectDesc;
  // Clear any previous inline background so CSS linen gradient (main-upgrade.css) renders
  const _heroEl = document.getElementById('subject-hero-el');
  _heroEl.style.background = '';
  // Preserve the subject's identity colour as a slim top accent bar
  let _heroAccent = document.getElementById('subject-hero-accent');
  if (!_heroAccent) {
    _heroAccent = document.createElement('div');
    _heroAccent.id = 'subject-hero-accent';
    _heroAccent.className = 'subject-hero-accent';
    _heroEl.insertBefore(_heroAccent, _heroEl.firstChild);
  }
  _heroAccent.style.background = subject.bg;

  // Translate filter tabs
  const tabTexts = [t('Όλα','All'), t('Μόνος','Solo'), 'Multiplayer', t('Δωρεάν','Free')];
  document.querySelectorAll('#page-subject .ftab').forEach((tab, i) => {
    if (tabTexts[i] !== undefined) tab.textContent = tabTexts[i];
    tab.classList.remove('active');
  });
  document.querySelector('#page-subject .ftab').classList.add('active');

  // Translate "Available games" label
  const gamesLabel = document.querySelector('.games-content .grid-label');
  if (gamesLabel) gamesLabel.textContent = t('Διαθέσιμα παιχνίδια', 'Available games');

  const grid = document.getElementById('games-grid');
  grid.innerHTML = '';
  const _allCards = []; // collect all cards; sort by favorites before appending
  let _studyCds   = []; // study cards — routed to theory-library-hub

  // Featured game card
  if (subject.featuredGame) {
    const ft = subject.featuredGame.type;

    if (ft === 'lyo') {
      const feat = document.createElement('div');
      feat.className = 'g-card';
      feat.setAttribute('data-tags', 'free solo');
      feat.onclick = () => openLyo();
      feat.style.borderColor = 'rgba(201,164,74,0.4)';
      const fTitle  = t('Μαθαίνοντας το Λύω', 'Learning to Decline: Lyo');
      const fDesc   = t('Κλίση ρημάτων — 32 επίπεδα από Οριστική έως Μετοχή.', 'Verb conjugation — 32 levels from Indicative to Participle.');
      const fLvl    = t('32 επίπεδα', '32 levels');
      const solo    = t('Μόνος', 'Solo');
      const free    = t('Δωρεάν', 'Free');
      const featLbl = t('ΕΠΙΛΕΓΜΕΝΟ', 'FEATURED');
      feat.innerHTML = `<div class="g-banner" style="background:linear-gradient(135deg,#1a1208,#5a4010);position:relative;"><span style="font-size:38px;">🏛️</span><div class="free-b">${free}</div><div class="g-feat-label" style="color:rgba(201,164,74,0.7);">${featLbl}</div></div><div class="g-body"><h3>${fTitle}</h3><div class="g-desc">${fDesc}</div><div class="g-meta"><div class="meta-tags"><span class="tag">${solo}</span><span class="tag">${fLvl}</span></div><div class="play-btn">▶</div></div></div>`;
      feat.dataset.gameId = 'feat-lyo';
      if (typeof createFavBtn === 'function') { const _b = feat.querySelector('.g-banner'); if (_b) _b.appendChild(createFavBtn('feat-lyo')); }
      _allCards.push(feat);
    }

    if (ft === 'paratheta') {
      const feat = document.createElement('div');
      feat.className = 'g-card';
      feat.setAttribute('data-tags', 'free solo');
      feat.onclick = () => openParatheta();
      feat.style.borderColor = 'rgba(180,120,240,0.4)';
      const fTitle  = t('Παραθετικά Επιθέτων', 'Degrees of Adjectives');
      const fDesc   = t('Συγκριτικός & υπερθετικός — ομαλά (-ος/-ης) και ανώμαλα, 10 επίπεδα.', 'Comparative & superlative — regular (-ος/-ης) and irregular adjectives, 10 levels.');
      const solo    = t('Μόνος', 'Solo');
      const free    = t('Δωρεάν', 'Free');
      const featLbl = t('ΕΠΙΛΕΓΜΕΝΟ', 'FEATURED');
      feat.innerHTML = `<div class="g-banner" style="background:linear-gradient(135deg,#1a1028,#4a2060);position:relative;"><span style="font-size:38px;">🔼</span><div class="free-b">${free}</div><div class="g-feat-label" style="color:rgba(180,120,240,0.7);">${featLbl}</div></div><div class="g-body"><h3>${fTitle}</h3><div class="g-desc">${fDesc}</div><div class="g-meta"><div class="meta-tags"><span class="tag">${solo}</span><span class="tag">10 επίπεδα</span></div><div class="play-btn">▶</div></div></div>`;
      feat.dataset.gameId = 'feat-paratheta';
      if (typeof createFavBtn === 'function') { const _b = feat.querySelector('.g-banner'); if (_b) _b.appendChild(createFavBtn('feat-paratheta')); }
      _allCards.push(feat);
    }

    if (ft === 'nouns') {
      const feat = document.createElement('div');
      feat.className = 'g-card';
      feat.setAttribute('data-tags', 'free solo');
      feat.onclick = () => openOusiastika();
      feat.style.borderColor = 'rgba(100,150,200,0.4)';
      const fTitle  = t('Κλίση Ουσιαστικών', 'Noun Declension');
      const fDesc   = t('Α΄, Β΄, Γ΄ κλίση — 200+ λέξεις με όλες τις υποκατηγορίες.', '1st, 2nd, 3rd declension — 200+ words across all subcategories.');
      const solo    = t('Μόνος', 'Solo');
      const free    = t('Δωρεάν', 'Free');
      const featLbl = t('ΕΠΙΛΕΓΜΕΝΟ', 'FEATURED');
      feat.innerHTML = `<div class="g-banner" style="background:linear-gradient(135deg,#0D2A3A,#185FA5);position:relative;"><span style="font-size:38px;">📜</span><div class="free-b">${free}</div><div class="g-feat-label" style="color:rgba(100,180,240,0.7);">${featLbl}</div></div><div class="g-body"><h3>${fTitle}</h3><div class="g-desc">${fDesc}</div><div class="g-meta"><div class="meta-tags"><span class="tag">${solo}</span><span class="tag">200+</span></div><div class="play-btn">▶</div></div></div>`;
      feat.dataset.gameId = 'feat-nouns';
      if (typeof createFavBtn === 'function') { const _b = feat.querySelector('.g-banner'); if (_b) _b.appendChild(createFavBtn('feat-nouns')); }
      _allCards.push(feat);
    }

    if (ft === 'antonymies') {
      const feat = document.createElement('div');
      feat.className = 'g-card';
      feat.setAttribute('data-tags', 'free solo');
      feat.onclick = () => openAntonymies();
      feat.style.borderColor = 'rgba(80,160,80,0.4)';
      const fTitle  = t('Κλίση Αντωνυμιών', 'Pronoun Declension');
      const fDesc   = t('Προσωπικές, δεικτικές, αυτοπαθείς, αναφορικές, κτητικές — 19 επίπεδα.', 'Personal, demonstrative, reflexive, relative, possessive — 19 levels.');
      const solo    = t('Μόνος', 'Solo');
      const free    = t('Δωρεάν', 'Free');
      const featLbl = t('ΕΠΙΛΕΓΜΕΝΟ', 'FEATURED');
      feat.innerHTML = `<div class="g-banner" style="background:linear-gradient(135deg,#1A2E10,#3B6D11);position:relative;"><span style="font-size:38px;">👤</span><div class="free-b">${free}</div><div class="g-feat-label" style="color:rgba(120,200,100,0.7);">${featLbl}</div></div><div class="g-body"><h3>${fTitle}</h3><div class="g-desc">${fDesc}</div><div class="g-meta"><div class="meta-tags"><span class="tag">${solo}</span><span class="tag">19 επίπεδα</span></div><div class="play-btn">▶</div></div></div>`;
      feat.dataset.gameId = 'feat-antonymies';
      if (typeof createFavBtn === 'function') { const _b = feat.querySelector('.g-banner'); if (_b) _b.appendChild(createFavBtn('feat-antonymies')); }
      _allCards.push(feat);
    }
  }

  // Extra grammar modules
  if (subject.extraGames) {
    const openers = {
      'klisi-epitheton':  () => { if (typeof openEpitheta === 'function') openEpitheta(); },
      'paratheta':       () => openParatheta(),
      'blade':           () => { if (typeof openBlade === 'function') openBlade(); },
      'pathitiko':        () => openPathitiko(),
      'afwnolekta':      () => openAfwnolekta(),
      'aoristos-b':      () => openAoristosB(),
      'rimata-mi':       () => openRimataMi(),
      'synirimmena':     () => openSynirimmena(),
      'anwmala-rimata':  () => openAnwmalaRimata(),
      'klisi-rimaton':   () => openKlisiRimaton(),
      'eimi':            () => openEimi(),
      'iliada-arcade':   () => openIliadaArcade(),
      'temple-run':      () => openTempleRun(buildTempleRunConfig(subjectId)),
      'iliada-tow':      () => openTow(),
      'noun-tow':        () => openNounTow(),
      'noun-fill':       () => openNounFill(),
      'odyssey-journey': () => openOdysseyJourney(),
      'odyssey-trivia':  () => launchOdysseyTrivia(siteLang),
      'istoria-g3':      () => openIstoria(),
      'history-game':    () => openHistoryGame(),
      'antonymies':      () => openAntonymies(),
      'grammar-invaders': () => openInvaders(),
      'myth-memory':      () => { if (typeof openMythMemory     === 'function') openMythMemory();      },
      'rapid-fire':       () => { if (typeof openRapidFire     === 'function') openRapidFire();      },
      'epic-puzzle':      () => { if (typeof openEpicPuzzle    === 'function') openEpicPuzzle(subjectId); },
      'lat-kata':         () => { if (typeof openLatKata       === 'function') openLatKata();        },
      'lat-nouns-kata':   () => { if (typeof openLatNounsKata  === 'function') openLatNounsKata();   },
      'lat-nouns':        () => { if (typeof openLatNouns      === 'function') openLatNouns();       },
      'lat-verbs':        () => { if (typeof openLatVerbs      === 'function') openLatVerbs();       },
      'lat-anwmala':      () => { if (typeof openLatAnwmala    === 'function') openLatAnwmala();     },
      'lat-anwmala-theory': () => { if (typeof openLatAnwmalaTheory === 'function') openLatAnwmalaTheory(); },
      'lat-epitheta':     () => { if (typeof openLatEpitheta   === 'function') openLatEpitheta();    },
      'lat-epitheta-kata':() => { if (typeof openLatEpithetaKata === 'function') openLatEpithetaKata(); },
      'lat-antonymies':   () => { if (typeof openLatAntonymies === 'function') openLatAntonymies();  },
      'lat-antonymies-theory': () => { if (typeof openLatAntonymiesTheory === 'function') openLatAntonymiesTheory(); },
      'lat-nouns-kata-theory': () => { if (typeof openLatNounsKataTheory === 'function') openLatNounsKataTheory(); },
      'lat-epitheta-kata-theory': () => { if (typeof openLatEpithetaKataTheory === 'function') openLatEpithetaKataTheory(); },
      // ── Games wired to Engine Configurator (pick content in-app) ──
      'naumachia':        () => openEngineConfigurator('naumachia'),
      'labyrinth':        () => openEngineConfigurator('labyrinth'),
      'dig':              () => openEngineConfigurator('dig'),
      'phalanx':          () => openEngineConfigurator('phalanx'),
      // ── Cross-section: lyo appears in non-grammar subjects too ──
      'lyo':              () => openLyo(),
    };
    subject.extraGames.forEach(eg => {
      const egTitle = siteLang === 'en' ? (eg.en?.label || eg.label) : eg.label;
      const egDesc  = siteLang === 'en' ? (eg.en?.desc  || eg.desc)  : eg.desc;
      const solo = t('Μόνος', 'Solo');
      const free = t('Δωρεάν', 'Free');
      const card = document.createElement('div');
      card.className = 'g-card';
      card.setAttribute('data-tags', 'free solo');
      card.onclick = openers[eg.type] || (() => {});
      card.dataset.gameId = eg.type;
      card.innerHTML = `<div class="g-banner" style="background:linear-gradient(135deg,#1a1208,#4a3010);position:relative;"><span style="font-size:38px;">${eg.icon}</span><div class="free-b">${free}</div></div><div class="g-body"><h3>${egTitle}</h3><div class="g-desc">${egDesc}</div><div class="g-meta"><div class="meta-tags"><span class="tag">${solo}</span></div><div class="play-btn">▶</div></div></div>`;
      if (typeof createFavBtn === 'function') { const _b = card.querySelector('.g-banner'); if (_b) _b.appendChild(createFavBtn(eg.type)); }
      _allCards.push(card);
    });
  }

  // ── Mnemosyne study shortcut cards ────────────────────────────
  // For any extraGame type / featuredGame / subjectId that maps to a GP_DATASETS
  // entry, prepend a "Study" card so students can jump into flashcard mode.
  {
    const _studyTypeMap = {
      'eimi':           'eimi',
      'lyo':            'lyo',
      'afwnolekta':     'afwnolekta',
      'aoristos-b':     'aoristos-b',
      'rimata-mi':      'rimata-mi',
      'synirimmena':    'synirimmena',
      'anwmala-rimata': 'anwmala-rimata',
      'klisi-rimaton':  'klisi-rimaton',
      'nouns':          'ousiastika',
      'antonymies':     'antonymies',
    };
    const _studySubjectMap = {
      'iliada':   'iliada-trivia',
      'odysseia': 'odyssey-trivia',
    };
    const _seenDs    = new Set();
    _studyCds = []; // reset (uses hoisted let from outer scope)
    const _addStudyCard = dsId => {
      if (!dsId || _seenDs.has(dsId)) return;
      const ds = (typeof GP_DATASETS !== 'undefined') ? GP_DATASETS.find(d => d.id === dsId) : null;
      if (!ds) return;
      _seenDs.add(dsId);
      const card = document.createElement('div');
      card.className = 'g-card g-card--study';
      card.setAttribute('data-tags', `${ds.tier === 'free' ? 'free' : 'pro'} solo study`);
      card.dataset.gameId = 'study-' + dsId;
      card.onclick = () => navToStudy(dsId);
      const _free = t('Δωρεάν', 'Free');
      const _tierB = ds.tier === 'free' ? `<div class="free-b">${_free}</div>` : '<div class="pro-b">Pro</div>';
      const _studyTag = t('Μελέτη', 'Study');
      card.innerHTML = `<div class="g-banner g-banner--study" style="position:relative;"><span style="font-size:34px;">${ds.icon || '🃏'}</span>${_tierB}</div><div class="g-body"><h3 class="study-gc-title">${ds.label}</h3><div class="g-desc">${t('Μνημοσύνη · Κάρτες μελέτης · Spaced repetition', 'Mnemosyne · Flashcards · Spaced repetition')}</div><div class="g-meta"><div class="meta-tags"><span class="tag tag--study">🃏 ${_studyTag}</span></div><div class="play-btn" style="font-size:18px;">🃏</div></div></div>`;
      if (typeof createFavBtn === 'function') { const _b = card.querySelector('.g-banner'); if (_b) _b.appendChild(createFavBtn('study-' + dsId)); }
      _studyCds.push(card);
    };
    if (subject.extraGames) subject.extraGames.forEach(eg => _addStudyCard(_studyTypeMap[eg.type]));
    if (subject.featuredGame) _addStudyCard(_studyTypeMap[subject.featuredGame.type]);
    _addStudyCard(_studySubjectMap[subjectId]);
    // Study cards route to Theory Library hub — not the game grid
  }

  DEFAULT_GAMES.forEach(gm => {
    // Trivia card is only relevant for the Ιλιάδα subject
    if (gm.isTrivia && subjectId !== 'iliada') return;

    const gmTitle = siteLang === 'en' ? (gm.titleEn || gm.title) : gm.title;
    const gmDesc  = siteLang === 'en' ? (gm.descEn  || gm.desc)  : gm.desc;
    const gmTags2 = siteLang === 'en' ? (gm.tags2En || gm.tags2) : gm.tags2;
    const free    = t('Δωρεάν', 'Free');
    const multi   = 'Multiplayer';
    const card = document.createElement('div');
    const _gmId = gm.isTrivia ? 'trivia-iliada' : (gm.type || 'gm-default');
    card.className = 'g-card';
    card.setAttribute('data-tags', gm.tags);
    card.dataset.gameId = _gmId;
    if (gm.isTrivia) {
      // Launch the trivia game overlay directly — skip the intermediate page
      card.onclick = () => launchGame('gr');
    }
    card.innerHTML = `<div class="g-banner" style="background:${gm.bg}">${gm.banner}${gm.free ? `<div class="free-b">${free}</div>` : ''}${gm.multi ? `<div class="multi-b">${multi}</div>` : ''}</div><div class="g-body"><h3>${gmTitle}</h3><div class="g-desc">${gmDesc}</div><div class="g-meta"><div class="meta-tags">${gmTags2.map(tg => `<span class="tag">${tg}</span>`).join('')}</div><div class="play-btn">▶</div></div></div>`;
    if (typeof createFavBtn === 'function') { const _b = card.querySelector('.g-banner'); if (_b) _b.appendChild(createFavBtn(_gmId)); }
    _allCards.push(card);
  });

  // Sort favorited games to the front of the grid
  if (typeof getFavorites === 'function') {
    const _fIds = getFavorites();
    _allCards.sort((a, b) =>
      (_fIds.indexOf(a.dataset.gameId) !== -1 ? 0 : 1) -
      (_fIds.indexOf(b.dataset.gameId) !== -1 ? 0 : 1)
    );
  }
  _allCards.forEach(c => grid.appendChild(c));

  // ── Theory Library Hub ─────────────────────────────────────
  // Populate #theory-library-content with Mnemosyne deck cards.
  _renderTheoryLibrary(_studyCds);

  // Reset workspace tabs to games view on every subject navigation
  if (typeof switchWorkspaceTab === 'function') switchWorkspaceTab('games');

  goTo('subject');
}

// ── Theory Library renderer ────────────────────────────────────
// Fills #theory-library-content with sx-tile study decks (same
// vocabulary + theme tokens as the subject page). Honours the
// SX_LAYOUT density (card | list); featured falls back to card.
// Decks are recovered from the prebuilt _studyCds (data-game-id).
function _renderTheoryLibrary(studyCds) {
  const content = document.getElementById('theory-library-content');
  if (!content) return;
  window.__lastStudyDecks = studyCds || []; // cached for live density re-render
  content.removeAttribute('data-sx-themed');
  content.innerHTML = '';

  if (!studyCds || studyCds.length === 0) {
    content.innerHTML = `
      <div class="theory-empty">
        <div class="theory-empty-icon" aria-hidden="true">📚</div>
        <p>${t(
          'Δεν υπάρχουν διαθέσιμα flashcard decks για αυτό το μάθημα.',
          'No flashcard decks available for this subject.'
        )}</p>
      </div>`;
    return;
  }

  const isEn    = siteLang === 'en';
  const dens    = (window.SX_LAYOUT ? window.SX_LAYOUT.get().density : 'card');
  const variant = (dens === 'list') ? 'list' : 'card';
  const tag     = isEn ? 'Study'  : 'Μελέτη';
  const cta     = isEn ? 'STUDY'  : 'ΜΕΛΕΤΗ';
  const desc    = isEn
    ? 'Mnemosyne · Flashcards · Spaced repetition'
    : 'Μνημοσύνη · Κάρτες μελέτης · Spaced repetition';

  // Recover dataset records from the prebuilt study cards
  const decks = studyCds.map(sc => {
    const dsId = (sc.dataset.gameId || '').replace(/^study-/, '');
    const ds   = (typeof GP_DATASETS !== 'undefined') ? GP_DATASETS.find(d => d.id === dsId) : null;
    return ds ? { dsId, ds } : null;
  }).filter(Boolean);

  const tile = ({ dsId, ds }) => {
    const favId = 'study-' + dsId;
    const fav   = (typeof window.SX !== 'undefined') ? window.SX.favBtn(favId) : '';
    const pro   = ds.tier !== 'free' ? '<span class="sx-tile-pro">Pro</span>' : '';
    const emoji = ds.icon || '🃏';
    const attrs = `role="button" tabindex="0" data-ds-id="${dsId}" aria-label="${ds.label}" `
      + `onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"`;

    if (variant === 'list') {
      return `<div class="sx-tile sx-tile--row" ${attrs}>
        <span class="sx-row-chip sx-chip--emoji">${emoji}</span>${pro}
        <div class="sx-row-main">
          <div class="sx-row-top"><h3>${ds.label}</h3><span class="sx-tile-tag">${tag}</span></div>
          <p class="sx-row-desc">${desc}</p>
        </div>${fav}<span class="sx-row-play">→</span></div>`;
    }
    return `<div class="sx-tile sx-tile--compact" ${attrs}>${fav}
      <div class="sx-tile-head">
        <span class="sx-glyph-chip sx-chip--emoji">${emoji}</span>
        <div class="sx-head-tt"><h3>${ds.label}</h3><div class="sx-tagrow"><span class="sx-tile-tag">${tag}</span></div></div>
      </div>
      <p class="sx-desc">${desc}</p>
      <div class="sx-tile-cta"><span>${cta}</span><span class="arrow">→</span></div></div>`;
  };

  content.dataset.sxThemed = '1';
  content.innerHTML = (variant === 'list')
    ? `<div class="sx-rows">${decks.map(tile).join('')}</div>`
    : `<div class="sx-tiles--card">${decks.map(tile).join('')}</div>`;

  content.querySelectorAll('.sx-tile[data-ds-id]').forEach(el => {
    el.onclick = () => { if (typeof navToStudy === 'function') navToStudy(el.dataset.dsId); };
  });
  if (typeof refreshAllHearts === 'function') refreshAllHearts();
}

// Re-render the theory deck with the current density (called on sx-layout-change)
window.refreshTheoryDeck = function () { _renderTheoryLibrary(window.__lastStudyDecks || []); };

function filterGames(btn, type) {
  document.querySelectorAll('#page-subject .ftab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.g-card').forEach(card => {
    const tags = card.getAttribute('data-tags') || '';
    card.style.display = (type === 'all' || tags.includes(type)) ? '' : 'none';
  });
}

// ── TRIVIA ENTRY PAGE ──
function navToTrivia(gradeKey, subjectId) {
  _navPush({ page: 'trivia', gradeKey, subjectId });
  setTheme(gradeKey, subjectId);

  const g = GRADES[gradeKey];
  let subject = null;
  if (g.subjects) subject = g.subjects.find(s => s.id === subjectId);
  if (!subject && g.tracks) g.tracks.forEach(tr => { const f = tr.subjects.find(s => s.id === subjectId); if (f) subject = f; });

  const gradeTitle   = siteLang === 'en' ? (g.titleEn  || g.title)  : g.title;
  const gradeParent  = siteLang === 'en' ? (g.parentEn || g.parent) : g.parent;
  const subjectTitle = subject ? (siteLang === 'en' ? (subject.en?.title || subject.title) : subject.title) : subjectId;

  buildNav('trivia-nav-wrap', [
    { label: t('Αρχική', 'Home'),  action: "goTo('home')" },
    { label: gradeParent,          dropdown: sectionDropdown(), action: `browseTo('${g.parentKey}')` },
    { label: gradeTitle,           dropdown: gradeDropdown(g.parentKey), action: `navToGrade('${gradeKey}')` },
    { label: subjectTitle,         action: `navToSubject('${gradeKey}','${subjectId}')` },
    { label: t('Ιλιάδα Trivia', 'Iliad Trivia') }
  ]);

  // Clear mode row — no longer used
  const modeRow = document.getElementById('trivia-mode-row');
  if (modeRow) modeRow.innerHTML = '';

  goTo('trivia');
}

function showTriviaTab(btn, tab) {
  document.querySelectorAll('#page-trivia .ftab').forEach(tabEl => tabEl.classList.remove('active'));
  btn.classList.add('active');
  ['levels', 'scores', 'info'].forEach(tabId => { const el = document.getElementById('ttab-' + tabId); if (el) el.style.display = 'none'; });
  document.getElementById('ttab-' + tab).style.display = 'block';
}

// ── GAME OVERLAYS ──
function launchGame(lang) {
  // Always restore Iliad questions (in case Odyssey Trivia was last used)
  if (typeof ILIADA_QUESTIONS !== 'undefined') {
    window.QUESTIONS  = ILIADA_QUESTIONS;
    window.RHAPSODIES = ILIADA_RHAPSODIES;
  }
  // Restore overlay title to Iliad
  const titleEl = document.querySelector('#trivia-overlay .overlay-title');
  if (titleEl) { titleEl.textContent = lang === 'en' ? 'Iliad Trivia' : 'Trivia Ιλιάδας'; }

  document.getElementById('trivia-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  document.getElementById('ol-gr').classList.toggle('active', lang === 'gr');
  document.getElementById('ol-en').classList.toggle('active', lang === 'en');
  initGame(lang);
}
function closeGame() {
  document.getElementById('trivia-overlay').classList.remove('active');
  document.body.style.overflow = '';
  if (typeof soloStopTimer === 'function') soloStopTimer();
  if (typeof tStopTimer === 'function') tStopTimer();
  // Restore Iliad data if Odyssey Trivia was active
  if (typeof ILIADA_QUESTIONS !== 'undefined') {
    window.QUESTIONS  = ILIADA_QUESTIONS;
    window.RHAPSODIES = ILIADA_RHAPSODIES;
  }
  if (window._savedQuotesEn) {
    window.QUOTES_EN = window._savedQuotesEn;
    window.QUOTES_GR = window._savedQuotesGr;
    window._savedQuotesEn = null;
    window._savedQuotesGr = null;
  }
}
function switchGameLang(l) {
  document.getElementById('ol-gr').classList.toggle('active', l === 'gr');
  document.getElementById('ol-en').classList.toggle('active', l === 'en');
  if (typeof setLang === 'function') setLang(l);
}

// ── QR CODE SHARING ──
function _buildShareURL(params) {
  const base = window.location.href.split('?')[0].split('#')[0];
  const qs = Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
  return `${base}?${qs}`;
}

function showQR(title, params, pinCode) {
  const modal   = document.getElementById('qr-modal');
  const qrBox   = document.getElementById('qr-canvas-wrap');
  const titleEl = document.getElementById('qr-modal-title');
  const urlEl   = document.getElementById('qr-url-text');
  if (!modal) return;

  const url = _buildShareURL(params);
  titleEl.textContent = title;
  urlEl.textContent   = url;
  qrBox.innerHTML     = '';

  if (typeof QRCode !== 'undefined') {
    new QRCode(qrBox, {
      text: url,
      width: 220, height: 220,
      colorDark:  '#1C1510',
      colorLight: '#FAF5ED',
      correctLevel: QRCode.CorrectLevel.M
    });
  } else {
    qrBox.innerHTML = '<div style="color:#8A7060;font-size:13px;padding:30px;text-align:center;">⚠ QR library unavailable.<br>Copy the link below.</div>';
  }

  // Show or hide the PIN row depending on whether a pinCode was passed
  const pinRow  = document.getElementById('qr-pin-row');
  const pinEl   = document.getElementById('qr-modal-pin');
  if (pinRow && pinEl) {
    if (pinCode) {
      pinEl.textContent    = pinCode;
      pinRow.style.display = '';
    } else {
      pinRow.style.display = 'none';
      pinEl.textContent    = '';
    }
  }

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function copyQRPin() {
  const pin = (document.getElementById('qr-modal-pin') || {}).textContent || '';
  if (!pin) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(pin)
      .then(() => showToast('PIN αντιγράφηκε! 📋', 'PIN copied! 📋'))
      .catch(() => _fallbackCopy(pin));
  } else {
    _fallbackCopy(pin);
  }
}

function closeQR() {
  const modal = document.getElementById('qr-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function copyQRURL() {
  const txt = (document.getElementById('qr-url-text') || {}).textContent || '';
  if (!txt) return;
  if (navigator.clipboard) {
    navigator.clipboard.writeText(txt).then(() => showToast('Αντιγράφηκε! 📋', 'Copied! 📋')).catch(() => _fallbackCopy(txt));
  } else {
    _fallbackCopy(txt);
  }
}

function _fallbackCopy(txt) {
  const ta = document.createElement('textarea');
  ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0';
  document.body.appendChild(ta); ta.select();
  try { document.execCommand('copy'); showToast('Αντιγράφηκε! 📋', 'Copied! 📋'); } catch(e) {}
  document.body.removeChild(ta);
}

// ── URL PARAM AUTO-NAVIGATION ──
// Call on load so students who scan a QR code land on the right page
function _initFromURL() {
  const params = new URLSearchParams(window.location.search);
  const nav = params.get('nav');
  if (!nav) return;
  const grade   = params.get('grade')   || 'gym-b';
  const subject = params.get('subject') || 'iliada';
  switch (nav) {
    case 'study': {
      // ?nav=study&id=eimi  — opens Mnemosyne directly on a specific dataset
      const id = params.get('id') || '';
      if (id) setTimeout(() => navToStudy(id), 150);
      break;
    }
    case 'trivia':  navToTrivia(grade, subject);  break;
    case 'subject': navToSubject(grade, subject); break;
    case 'grade':   navToGrade(grade);             break;
    case 'arcade':
      navToSubject(grade, subject);
      setTimeout(() => { if (typeof openIliadaArcade === 'function') openIliadaArcade(); }, 300);
      break;
    case 'homework': {
      // QR-scanned custom quiz: ?nav=homework&id=DOC_ID
      // Fetch the custom_games document and launch the homework game adapter.
      const id = params.get('id') || '';
      if (!id) break;
      showLoadingScreen(t('Φόρτωση κουίζ…', 'Loading quiz…'));
      firebase.firestore()
        .collection('custom_games')
        .doc(id)
        .get()
        .then(snap => {
          hideLoadingScreen();
          if (!snap.exists) {
            showToast('Το κουίζ δεν βρέθηκε.', 'Quiz not found.');
            return;
          }
          if (typeof launchCustomHomework === 'function') {
            launchCustomHomework({ id: snap.id, ...snap.data() });
          }
        })
        .catch(err => {
          hideLoadingScreen();
          showToast('Σφάλμα φόρτωσης κουίζ.', 'Quiz load error.');
          console.error('[nav] homework load error:', err);
        });
      break;
    }
    case 'game': {
      const id = params.get('id') || '';
      const gameOpeners = {
        'iliada-trivia': () => { if (typeof launchGame === 'function') launchGame('gr'); },
        'lyo':           () => { if (typeof openLyo === 'function') openLyo(params.get('level'), params.get('mode')); },
        'paratheta':     () => { if (typeof openParatheta === 'function') openParatheta(params.get('level'), params.get('mode')); },
        'blade':         () => { if (typeof openBlade === 'function') openBlade(params.get('level'), params.get('mode')); },
        'afw':           () => { if (typeof openAfwnolekta === 'function') openAfwnolekta(params.get('level'), params.get('mode')); },
        'aob':           () => { if (typeof openAoristosB === 'function') openAoristosB(params.get('level'), params.get('mode')); },
        'rmi':           () => { if (typeof openRimataMi === 'function') openRimataMi(params.get('level'), params.get('mode')); },
        'ous':           () => { if (typeof openOusiastika === 'function') openOusiastika(); },
        'syn':           () => { if (typeof openSynirimmena === 'function') openSynirimmena(params.get('level'), params.get('mode')); },
        'arv':           () => { if (typeof openAnwmalaRimata === 'function') openAnwmalaRimata(); },
        'kr':            () => { if (typeof openKlisiRimaton === 'function') openKlisiRimaton(); },
        'eimi':          () => { if (typeof openEimi === 'function') openEimi(); },
        'ant':           () => { if (typeof openAntonymies === 'function') openAntonymies(); },
        'ept':           () => { if (typeof openEpitheta === 'function') openEpitheta(); },
        'path':          () => { if (typeof openPathitiko === 'function') openPathitiko(params.get('level'), params.get('mode')); },
        'odyssey-trivia':() => { if (typeof launchOdysseyTrivia === 'function') launchOdysseyTrivia('gr'); },
        'lat-nouns':     () => { if (typeof openLatNouns === 'function') openLatNouns(); },
        'lat-nouns-kata':() => { if (typeof openLatNounsKata === 'function') openLatNounsKata(); },
        'lat-verbs':     () => { if (typeof openLatVerbs === 'function') openLatVerbs(); },
        'lat-epitheta':  () => { if (typeof openLatEpitheta === 'function') openLatEpitheta(); },
        'lat-epitheta-kata':() => { if (typeof openLatEpithetaKata === 'function') openLatEpithetaKata(); },
        'lat-antonymies':() => { if (typeof openLatAntonymies === 'function') openLatAntonymies(); },
        'lat-antonymies-theory':() => { if (typeof openLatAntonymiesTheory === 'function') openLatAntonymiesTheory(); },
        'lat-nouns-kata-theory':() => { if (typeof openLatNounsKataTheory === 'function') openLatNounsKataTheory(); },
        'lat-epitheta-kata-theory':() => { if (typeof openLatEpithetaKataTheory === 'function') openLatEpithetaKataTheory(); },
        'lat-kata':      () => { if (typeof openLatKata === 'function') openLatKata(); },
        'lat-anwmala':   () => { if (typeof openLatAnwmala === 'function') openLatAnwmala(); },
        'lat-anwmala-theory': () => { if (typeof openLatAnwmalaTheory === 'function') openLatAnwmalaTheory(); },
      };
      const opener = gameOpeners[id];
      if (opener) setTimeout(opener, 150);
      break;
    }
    case 'engine': {
      // ?nav=engine&engine=naumachia&dataset=lyo&level=3
      // Opens the engine configurator pre-selected for the given engine+dataset.
      // Generated by the "Μοιράσου · QR" join method in gramOpenQuizSettings.
      const engineId  = params.get('engine')  || '';
      const datasetId = params.get('dataset') || '';
      const levelId   = params.get('level')   || null;
      if (engineId && datasetId) {
        setTimeout(() => {
          if (typeof openEngineConfigurator === 'function') {
            openEngineConfigurator(engineId, datasetId, levelId ? { levelId } : {});
          }
        }, 200);
      }
      break;
    }
  }
}

// ── TEACHER MODE ──
// Route to the teacher dashboard and initialise it.
function navToTeacher() {
  goTo('teacher');
  if (typeof initTeacherDashboard === 'function') initTeacherDashboard();
}

// ── GRAMMAR OVERLAY OPENERS (not defined in game files) ──
// Legacy redirect aliases from the modular-SPA migration: the generic
// "grammar nouns/verbs" overlays just forward to the real modern games, mirror
// of how #gn-overlay → ousiastika. #gv-overlay (Γραμματική Ρημάτων) forwards to
// klisi-rimaton (verb conjugation). Both close handlers are called UNGUARDED by
// the overlay back buttons in index.html, so they must always be defined.
function openGrammarNouns() { openOusiastika(); }
function closeGrammarNouns() { closeOusiastika(); }
function openGrammarVerbs() { openKlisiRimaton(); }
function closeGrammarVerbs() { closeKlisiRimaton(); }

// ── ΙΣΤΟΡΙΑ ΓΥΜΝΑΣΙΟΥ / Α΄ ΛΥΚΕΙΟΥ ──
// Reimagined panel (games/istoria/) — the same themed module as the
// Κατεύθυνσης history, parameterised by class. gym-a/b/c & lyk-a ship the
// themed shell + topic scaffold (content authored via the admin studio).
function openHistoryGame() {
  const course = currentGradeKey || 'gym-a';
  const src = (window.APP_BASE || '') + 'games/istoria/index.html?course=' + encodeURIComponent(course);
  const wrap = document.getElementById('history-game-wrap');
  if (wrap) {
    wrap.innerHTML = '<iframe src="' + src + '" style="width:100%;height:100%;border:none;display:block;"></iframe>';
  }
  const ov = document.getElementById('history-game-overlay');
  if (ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeHistoryGame() {
  const ov = document.getElementById('history-game-overlay');
  if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
}

// ── MNEMOSYNE STUDY MODE ────────────────────────────────────

function closeStudyOverlay() {
  const ov = document.getElementById('study-overlay');
  if (ov) ov.classList.remove('active');
  document.body.style.overflow = '';
}

/**
 * navToStudy(datasetId)
 * Resolves a GP_DATASETS entry, gates on subscription tier,
 * loads & normalises its questions, then hands them to Mnemosyne.
 *
 * Can be called from any game card, menu item, or URL param.
 *
 * @param {string} datasetId — must match a GP_DATASETS[].id value
 */
async function navToStudy(datasetId) {
  // ── 1. Resolve dataset descriptor ────────────────────────
  const dataset = (typeof GP_DATASETS !== 'undefined')
    ? GP_DATASETS.find(d => d.id === datasetId)
    : null;

  if (!dataset) {
    showToast(
      t('Δεν βρέθηκε η ύλη.', 'Content module not found.'),
      ''
    );
    return;
  }

  // ── 2. Subscription gate ──────────────────────────────────
  if (typeof _gpCanAccessTier === 'function' && !_gpCanAccessTier(dataset.tier)) {
    showToast(
      t('Απαιτείται Pro συνδρομή για αυτή την ύλη.', 'Pro subscription required for this content.'),
      ''
    );
    if (typeof navToSubscribe === 'function') navToSubscribe();
    return;
  }

  // ── 3. Load raw data ──────────────────────────────────────
  let rawData = null;

  if (typeof dataset.loader === 'function') {
    try { rawData = dataset.loader(); } catch (_) { rawData = null; }
  }

  // Firestore fallback if window-scope data is absent
  if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
    try {
      const snap = await firebase.firestore()
        .collection('game_data').doc(datasetId).get();
      if (snap.exists) {
        rawData = snap.data().questions
               || snap.data().items
               || snap.data().data
               || [];
      }
    } catch (err) {
      console.warn('[navToStudy] Firestore fallback failed:', err);
    }
  }

  if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
    showToast(
      t('Τα δεδομένα δεν φορτώθηκαν.', 'Content data could not be loaded.'),
      ''
    );
    return;
  }

  // ── 4. Normalise to {q, a, hint} ─────────────────────────
  const items = (typeof _gpNormalizeQuestions === 'function')
    ? _gpNormalizeQuestions(rawData, datasetId)
    : rawData;

  if (!items || items.length === 0) {
    showToast(
      t('Δεν βρέθηκαν κάρτες για αυτή την ύλη.', 'No flashcards found for this module.'),
      ''
    );
    return;
  }

  // ── 5. Hand off to MnemosyneEngine ───────────────────────
  if (typeof Mnemosyne === 'undefined') {
    console.error('[navToStudy] MnemosyneEngine not loaded.');
    return;
  }

  await Mnemosyne.startStudySession(datasetId, items, dataset.label || datasetId);
}

// ── ΙΣΤΟΡΙΑ ΚΑΤΕΥΘΥΝΣΗΣ (Β΄ & Γ΄ ΛΥΚΕΙΟΥ) ──
// Reimagined panel (games/istoria/) — Θέματα Νεοελληνικής Ιστορίας, with the
// 7 themed modes + AI-graded methods. course=g3 carries the real exam content.
function openIstoria() {
  const wrap = document.getElementById('istoria-wrap');
  if (wrap && !wrap.querySelector('iframe')) {
    wrap.innerHTML = '<iframe src="' + (window.APP_BASE || '') + 'games/istoria/index.html?course=g3" style="width:100%;height:100%;border:none;display:block;"></iframe>';
  }
  const ov = document.getElementById('istoria-overlay');
  if (ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
}
function closeIstoria() {
  const ov = document.getElementById('istoria-overlay');
  if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
}

// ── ODYSSEY JOURNEY 3D ──
function openOdysseyJourney() {
  const ov = document.getElementById('odyssey-journey-overlay');
  if (!ov) return;
  ov.classList.add('active');
  document.body.style.overflow = 'hidden';
  // Delay init so the overlay is fully rendered before Three.js reads clientWidth/Height
  setTimeout(() => {
    if (typeof initOdysseyJourney === 'function') initOdysseyJourney(siteLang);
  }, 60);
}
function closeOdysseyJourney() {
  const ov = document.getElementById('odyssey-journey-overlay');
  if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
  if (typeof destroyOdysseyJourney === 'function') destroyOdysseyJourney();
}

// ── INIT ──
// Seed home as the first entry in the nav stack and replace the initial
// browser history entry to match — so mouse back-button from the first
// navigation returns to home instead of falling off the edge of the stack.
_navH.push({ page: 'home' });
_navC = 0;
history.replaceState({ _navC: 0 }, '');
renderBrowse();
_initFromURL();

// ── ΑΝΟΔΟΣ admin content (config/anodos: riddles + rewards) ──────────
// Loaded into window._anodosConfig so openAnodos() can inject it into the
// game iframe. Public-read config doc; admin-only write (firestore.rules).
var _anodosConfig = null;
async function _loadAnodosContent() {
  try {
    const doc = await firebase.firestore().collection('config').doc('anodos').get();
    if (doc.exists) { _anodosConfig = doc.data(); window._anodosConfig = _anodosConfig; }
  } catch (_) {}
}

// Load remote config after Firebase is ready (1500ms fallback covers most cases)
setTimeout(() => {
  if (typeof firebase !== 'undefined') {
    _loadSiteConfig().then(() => renderBrowse());
    _loadGameTiers();
    _loadSiteFeatures();
    _loadEngineContent();
    _loadSiteBanners();
    _loadAnodosContent();
  }
}, 1500);

// ============================================================
//  GAMES PANEL  ·  Πίνακας Παιχνιδιών
//  ──────────────────────────────────────────────────────────
//  Architecture:
//    openGamesPanel()              → full-screen overlay with engine grid
//    openEngineConfigurator(id)    → modal to pick dataset + mode
//    initGameWithData(e, d, cfg)   → router adapter launching engine with data
// ============================================================

// ── ENGINE REGISTRY ─────────────────────────────────────────
// Describes every standalone game mechanic (the "engine").
// opener(cfg) — called by initGameWithData after building the config.
const GP_ENGINES = [
  {
    id: 'naumachia',
    label: 'Ναυμαχία',
    subtitle: 'Naval Battleship',
    icon: '⚓',
    bg: 'linear-gradient(135deg,#030D1C,#083050)',
    desc: 'Ναυτική σύγκρουση — βύθισε τον στόλο του αντιπάλου απαντώντας σωστά.',
    tags: ['Στρατηγική', 'PvP'],
    multiplayer: true,
    maxPlayers: 2,          // battleship is inherently 1-v-1
    tier: 'free',
    opener: cfg => { if (typeof openNaumachia === 'function') openNaumachia(cfg); }
  },
  {
    id: 'invaders',
    label: 'Space Invaders',
    subtitle: 'Γραμματική Invaders',
    icon: '🚀',
    bg: 'linear-gradient(135deg,#04001A,#18083C)',
    desc: 'Αποκρούσε τα ερωτήματα — κάθε λάθος απάντηση φέρνει τους εισβολείς πιο κοντά!',
    tags: ['Action', 'Solo'],
    multiplayer: false,
    tier: 'free',
    opener: cfg => { if (typeof openInvaders === 'function') openInvaders(cfg); }
  },
  {
    id: 'labyrinth',
    label: 'Λαβύρινθος',
    subtitle: 'Maze Explorer',
    icon: '🌀',
    bg: 'linear-gradient(135deg,#0A1A06,#1C3010)',
    desc: 'Βρες τον δρόμο σου μέσα από τον λαβύρινθο απαντώντας σωστά σε κάθε σταυροδρόμι.',
    tags: ['Puzzle', 'Solo'],
    multiplayer: false,
    tier: 'free',
    opener: cfg => { if (typeof openLabyrinth === 'function') openLabyrinth(cfg); }
  },
  {
    id: 'myth-memory',
    label: 'Mythology Memory',
    subtitle: 'Ζεύγη Μυθολογίας',
    icon: '🃏',
    bg: 'linear-gradient(135deg,#160A22,#321658)',
    desc: 'Βρες τα ζεύγη καρτών — αντιστοίχισε έννοιες, ήρωες και ορισμούς.',
    tags: ['Memory', 'Solo'],
    multiplayer: false,
    tier: 'free',
    allowedCategories: ['Ομηρική Ποίηση'], // epics only
    opener: cfg => { if (typeof openMythMemory === 'function') openMythMemory(cfg); }
  },
  {
    id: 'phalanx',
    label: 'Φάλαγγα',
    subtitle: 'Phalanx Formation',
    icon: '🛡️',
    bg: 'linear-gradient(135deg,#1C0A06,#44180C)',
    desc: 'Κράτα τον σχηματισμό! Κάθε σωστή απάντηση ενισχύει τη γραμμή, κάθε λάθος τη σπάει.',
    tags: ['Strategy', 'Solo'],
    multiplayer: false,
    tier: 'free',
    opener: cfg => { if (typeof openPhalanx === 'function') openPhalanx(cfg); }
  },
  {
    id: 'rapid-fire',
    label: 'Καταιγισμός',
    subtitle: 'Rapid Fire — The Gathering Storm',
    icon: '⚡',
    bg: 'linear-gradient(135deg,#1A1206,#342800)',
    desc: 'Κράτα την καταιγίδα ζωντανή — εναλλασσόμενοι τύποι, επιλογή χρόνου, άπειρες ερωτήσεις!',
    tags: ['Speed', 'Solo'],
    multiplayer: false,
    maxPlayers: 8,          // class speed-quiz — up to 8 competing
    tier: 'free',
    opener: cfg => { if (typeof openRapidFire === 'function') openRapidFire(cfg); }
  },
  {
    id: 'tow',
    label: 'Tug of War',
    subtitle: 'Αγώνας Διελκυστίνδας',
    icon: '⚔️',
    bg: 'linear-gradient(135deg,#1E0806,#440E08)',
    desc: 'Παιχνίδι διελκυστίνδας — απάντα σωστά για να σπρώξεις τον αντίπαλο!',
    tags: ['PvP', 'Competitive'],
    multiplayer: true,
    maxPlayers: 8,          // team tug-of-war — 2 / 4 / 6 / 8 players
    tier: 'free',
    opener: cfg => { if (typeof openTow === 'function') openTow(cfg); }
  },
  {
    id: 'epic-puzzle',
    label: 'Χρονολόγιο',
    subtitle: 'Chronicle Sequencer',
    icon: '📋',
    bg: 'linear-gradient(135deg,#060C1A,#102236)',
    desc: 'Βάλε τα γεγονότα και έννοιες στη σωστή χρονολογική σειρά.',
    tags: ['Puzzle', 'Solo'],
    multiplayer: false,
    tier: 'free',
    allowedCategories: ['Ομηρική Ποίηση', 'Ιστορία'], // epics & history only
    opener: cfg => { if (typeof openEpicPuzzle === 'function') openEpicPuzzle(null, cfg); }
  },
  {
    id: 'dig',
    label: 'Ανασκαφή',
    subtitle: 'Archaeological Dig',
    icon: '⛏️',
    bg: 'linear-gradient(135deg,#1A1006,#382808)',
    desc: 'Σκάψε και ανακάλυψε — κάθε σωστή απάντηση αποκαλύπτει ένα αρχαίο εύρημα.',
    tags: ['Discovery', 'Solo'],
    multiplayer: false,
    tier: 'free',
    opener: cfg => { if (typeof openDig === 'function') openDig(cfg); }
  },
  {
    id: 'mnemosyne',
    label: 'Μνημοσύνη',
    subtitle: 'Flashcard Study Mode',
    icon: '🃏',
    bg: 'linear-gradient(135deg,#0D0F0A,#1E2E14)',
    desc: 'Κάρτες μελέτης με spaced repetition — μάθε οποιαδήποτε ύλη με 3D flip & mastery tracking.',
    tags: ['Μελέτη', 'Solo'],
    multiplayer: false,
    tier: 'free',
    opener: cfg => { if (typeof navToStudy === 'function') navToStudy(cfg.datasetId || cfg.dataset || ''); }
  },
  {
    id: 'blade',
    label: 'Ξίφος του Γραμματικού',
    subtitle: "Grammarian's Blade",
    icon: '🗡️',
    bg: 'linear-gradient(135deg,#1A0E06,#3A1E0A)',
    desc: 'Κόψε τον σωστό γραμματικό τύπο — Fruit-Ninja στυλ με Κλίση & Παραθετικά.',
    tags: ['Action', 'Solo'],
    multiplayer: false,
    tier: 'free',
    // Flows through the configurator like every other engine, but restricted to
    // the grammar section (Ancient Greek + Latin grammar). Its slice mechanic
    // consumes the normalized cfg.G bank via the 'blade' bridge in
    // _gpInjectEngineData (window._gpBladePool).
    allowedCategories: ['Γραμματική', 'Λατινικά'],
    opener: cfg => { if (typeof openBlade === 'function') openBlade(cfg); }
  },
  {
    id: 'anodos',
    label: 'Ἄνοδος',
    subtitle: 'The Ascent · Roguelike',
    icon: '⛰️',
    bg: 'linear-gradient(135deg,#0D0B09,#C87830)',
    desc: 'Σκαρφάλωσε στὴν Τροία — roguelike ἄνοδος μὲ μάχες ἐρωτήσεων, αἰνίγματα καὶ ἄρχοντες σὲ τρία Μέρη.',
    tags: ['Roguelike', 'Solo'],
    multiplayer: false,
    tier: 'free',
    // Accepts the full uploadable-content pipeline like the other quiz engines
    // (no allowedCategories restriction). The chosen study material feeds ONLY
    // the game's trivia multiple-choice bank via openAnodos → window.QUESTIONS;
    // the riddles (EVENTS) and true/false volley (TF_BANK) stay built-in.
    opener: cfg => { if (typeof openAnodos === 'function') openAnodos(cfg); }
  },
  {
    id: 'battle-royale',
    label: 'Battle Royale',
    subtitle: 'Arena Tournament',
    icon: '🏛️',
    bg: 'linear-gradient(135deg,#1A1000,#4A2800)',
    desc: 'Τουρνουά 24 μαχητών — πολέμησε διαδοχικούς αντιπάλους σε ταχύτητα & γνώση μέχρι να κατακτήσεις την αρένα.',
    tags: ['Tournament', 'Solo / PvP'],
    multiplayer: false,
    tier: 'free',
    opener: cfg => {
      if (cfg.pvp) { _gpLaunchLiveArena(cfg); return; }
      if (typeof openBattleRoyale === 'function') openBattleRoyale(cfg);
    }
  },
  {
    id: 'temple-run',
    label: 'Agora Surfers',
    subtitle: '3D Endless Runner',
    icon: '🏃',
    bg: 'linear-gradient(135deg,#0a0400,#241006)',
    desc: 'Τρέξε στην αρχαία αγορά — μάζεψε δραχμές, πήδα εμπόδια και απάντα σωστά για να κρατήσεις τον χάλκινο Τάλω μακριά!',
    tags: ['Runner', 'Solo'],
    multiplayer: false,
    tier: 'free',
    opener: cfg => { if (typeof openTempleRun === 'function') openTempleRun(cfg); },
  },
  {
    id: 'golden-fleece',
    label: 'Χρυσόμαλλον Δέρας',
    subtitle: 'Gold Quest — Το ταξίδι της Αργούς',
    icon: '⛵',
    bg: 'linear-gradient(135deg,#0A1014,#13303A)',
    desc: 'Άνοιξε πίθους για χρυσό — πρόσεχε όμως τον πίθο της Πανδώρας. Νίκησε τους Αργοναύτες.',
    tags: ['Τύχη', 'Solo'],
    multiplayer: false,
    tier: 'free',
    opener: cfg => { if (typeof openGoldenFleece === 'function') openGoldenFleece(cfg); }
  },
  {
    id: 'halieia',
    label: 'Αλιεία',
    subtitle: 'Fishing Frenzy — Τα δίχτυα του Ποσειδώνα',
    icon: '🎣',
    bg: 'linear-gradient(135deg,#06100C,#143A30)',
    desc: 'Ρίξε το καλάμι στο Αιγαίο — ψάρια, χρυσό ή θησαυρό. Χτίσε σερί φρενίτιδας για τη μεγαλύτερη ψαριά.',
    tags: ['Φρενίτιδα', 'Solo'],
    multiplayer: false,
    tier: 'free',
    opener: cfg => { if (typeof openHalieia === 'function') openHalieia(cfg); }
  },
];

// Auto-classify engines: anything tagged 'Μελέτη' is theory; everything else practice.
GP_ENGINES.forEach(e => { if (!e.type) e.type = (e.tags||[]).includes('Μελέτη') ? 'theory' : 'practice'; });

// ── DATASET REGISTRY ─────────────────────────────────────────
// The hand-maintained GP_DATASETS array now lives in js/gp-content.js
// (window.GP_CONTENT auto-discovery: grammar + GRADES curriculum + Firestore).
// window.GP_CONTENT exposes a LIVE view as window.GP_DATASETS, so every
// `GP_DATASETS.find(...)` caller below (initGameWithData, _renderTheoryLibrary,
// navToStudy, QR-challenge restore) keeps working with no other change.
// Resolve datasets via GP_CONTENT.find(id) / GP_DATASETS.find(...).

// ── PANEL STATE ──────────────────────────────────────────────
let _gpCurrentEngine   = null;   // GP_ENGINES entry currently being configured
let _gpSelectedDataset = null;   // datasetId chosen in the content step (primary)
let _gpExtraDatasets   = [];     // [{ id, all, levels }] extras merged into question pool
let _gpExtraOpenId     = null;   // which extra's compact level picker is expanded
let _gpSelectedLevels  = [];     // multi-select level ids (numbers) for leveled datasets
let _gpLevelsAll       = false;  // true when "Όλα τα επίπεδα" is chosen
let _gpSelectedLevel   = null;   // = _gpSelectedLevels[0] ?? null (back-compat single id)
let _gpOpenGroup       = null;   // currently open umbrella in the two-pane level picker
let _gpLvlSearch       = '';     // level-search query within the open dataset
let _gpModeKey         = null;   // current mode-card key (engine-specific)
let _gpPvpMode         = false;  // backward-compat alias — use _gpPlayMode
let _gpPlayMode        = 'solo'; // 'solo' | 'pvp'
let _gpPlayerCount     = 2;      // 2 / 4 / 6 / 8
let _gpJoinMethod      = 'local';// 'local' | 'qr'
let _gpChallengeSeed   = null;   // random seed for reproducible challenge link

// ── SUBSCRIPTION ACCESS HELPERS ─────────────────────────────
/**
 * Returns true if the current user may access content at the given tier.
 * Reads currentUserRole from auth.js (populated after Firestore user doc load).
 */
function _gpCanAccessTier(tier) {
  if (typeof isAdmin !== 'undefined' && isAdmin) return true;
  const role = (typeof currentUserRole !== 'undefined') ? currentUserRole : 'free';
  if (tier === 'free')    return true;
  if (tier === 'student') return role === 'student' || role === 'teacher';
  if (tier === 'teacher') return role === 'teacher';
  return false;
}

/**
 * Returns true only for verified Pro teachers (role === 'teacher').
 * Used to gate the Creator Mode box.
 */
function _gpIsProTeacher() {
  if (typeof isAdmin !== 'undefined' && isAdmin) return true;
  const role = (typeof currentUserRole !== 'undefined') ? currentUserRole : 'free';
  return role === 'teacher';
}

// ── LYO QUESTION GENERATOR (for use as a GP dataset) ────────
/**
 * Generates count questions from lyo's internal verb tables for the
 * given levelId. Returns [{q, opts:[4 strings], ans:number}] or null.
 * The format matches _gpNormalizeQuestions format-J so it flows through
 * initGameWithData unmodified.
 */
function _gpLyoGenQuestions(levelId, count) {
  if (typeof LYO_LVL === 'undefined' || typeof LYO_G === 'undefined' ||
      typeof lyoKeys === 'undefined' || typeof lyoGenQ === 'undefined') return null;
  const lvl = LYO_LVL.find(l => l.id === +levelId);
  if (!lvl) return null;
  const keys = lyoKeys(lvl.filter);
  if (!keys.length) return null;

  const qs = [];
  // Temporarily suppress GE distractor metadata (avoids crash if GE not ready)
  const savedGE = window.GE;
  if (savedGE) window.GE = Object.assign({}, savedGE, {
    classifyGDictDistractors: () => [],
  });

  for (let i = 0; i < count; i++) {
    try {
      const raw = lyoGenQ([...keys]);
      if (!raw) continue;
      // Strip HTML — insert spaces before block elements so textContent doesn't concatenate them
      const tmp = document.createElement('div');
      tmp.innerHTML = raw.qt || '';
      tmp.querySelectorAll('div,p,br,li,td,th').forEach(el => el.before(' '));
      const qText = (tmp.textContent || tmp.innerText || '').replace(/\s+/g, ' ').trim();
      const ans = raw.opts.indexOf(raw.correct);
      if (qText && ans >= 0) qs.push({ q: qText, opts: raw.opts.slice(0, 4), ans });
    } catch (_) {}
  }

  if (savedGE) window.GE = savedGE;
  return qs.length ? qs : null;
}

// ── OPEN / CLOSE GAMES PANEL ─────────────────────────────────
function openGamesPanel() {
  const ov = document.getElementById('games-panel-overlay');
  if (!ov) return;
  closeAllDD();
  ov.classList.add('active');
  document.body.style.overflow = 'hidden';
  _renderMechanicsGrid();
  // Push /gamepanel into the nav stack + browser history URL
  _navPush({ page: 'gamepanel' });
}

// fromPopstate=true when invoked by the Back-button handler — skip URL manipulation.
function closeGamesPanel(fromPopstate) {
  const ov = document.getElementById('games-panel-overlay');
  if (ov) ov.classList.remove('active');
  // Release scroll-lock only when no other overlay / modal is open
  if (!document.querySelector('.game-overlay.active, #engine-cfg-modal.active, #auth-modal.active')) {
    document.body.style.overflow = '';
  }
  // When closed by the × button (not via Back), remove /gamepanel from the URL
  if (!fromPopstate && window.location.pathname === '/gamepanel') {
    const prev = _navC > 0 ? _navC - 1 : -1;
    if (prev >= 0) {
      _navC = prev;
      _navH.splice(prev + 1);
      const _cur = typeof Router !== 'undefined' ? Router.pathFor(_navH[prev]) : '/';
      history.replaceState({ _navC: prev }, '', _cur);
    } else {
      // No previous page in the stack — go home
      if (typeof goTo === 'function') goTo('home');
    }
  }
}

// ── ΑΝΟΔΟΣ (The Ascent) — standalone roguelike, embedded via same-origin iframe ─
// Launched from the games panel through the normal configurator pipeline, so the
// chosen study material arrives on cfg.G exactly like every other engine. We map
// that bank into the game's TRIVIA multiple-choice pool only (the iframe's live
// window.QUESTIONS array). The riddles (EVENTS) and the true/false volley
// (TF_BANK) are never touched — so the "studying material" option never affects
// non-trivia content. With no dataset chosen the game just runs its built-ins.
let _anodosSeq = 0;
// Resolve the app root (the folder that holds index.html) from the nav.js
// <script> tag, so asset URLs work regardless of where the server is rooted:
//   · Firebase Hosting / preview → root is paideia/  → base = "<origin>/"
//   · VS Code Live Server / repo-root server → app at /paideia/ → base = "<origin>/paideia/"
// Using the script's own URL means we always match wherever the app actually loaded.
function _anodosBase() {
  try {
    const s = document.querySelector('script[src*="js/nav.js"]');
    if (s && s.src) return s.src.replace(/js\/nav\.js.*$/, '');
  } catch (_) {}
  return '/';
}
function openAnodos(cfg) {
  cfg = cfg || window._gpPendingConfig || {};

  // Convert the normalized GP bank → ΑΝΟΔΟΣ trivia shape {q, opts:[4], a:idx, hint}.
  // _gpToMcItems guarantees 4 options (same helper Labyrinth/Phalanx/Naumachia use).
  let injected = null;
  if (Array.isArray(cfg.G) && cfg.G.length && typeof _gpToMcItems === 'function') {
    injected = _gpToMcItems(cfg.G)
      .map(it => ({ q: it.q.gr, opts: it.a, a: it.c,
                    hint: (it.q.en && it.q.en !== it.q.gr) ? it.q.en : '' }))
      .filter(it => it.q && Array.isArray(it.opts) && it.opts.length >= 2);
  }

  let ov = document.getElementById('anodos-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'anodos-overlay';
    ov.className = 'game-overlay';   // fixed inset:0 flex-column; .active → display:flex
    ov.innerHTML =
      '<div style="flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:8px 14px;background:#181412;border-bottom:1px solid rgba(200,120,48,.16);font:600 13px/1 Inter,system-ui,sans-serif;color:#EFE9DC;">' +
        '<button type="button" onclick="closeAnodos()" style="display:inline-flex;align-items:center;gap:7px;color:#C87830;background:transparent;border:1px solid rgba(200,120,48,.38);padding:7px 12px;border-radius:7px;cursor:pointer;font:inherit;letter-spacing:.4px;">← Πίσω</button>' +
        '<span style="font-family:Cinzel,\'Cormorant Garamond\',serif;letter-spacing:2px;font-size:14px;color:#E09E52;">ΑΝΟΔΟΣ · <b style="color:#D96B30;">The Ascent</b></span>' +
        '<span id="anodos-ov-src" style="margin-left:auto;font:500 11px/1 \'JetBrains Mono\',monospace;color:#7C6F58;letter-spacing:.5px;"></span>' +
      '</div>' +
      '<iframe class="anodos-ov-frame" title="ΑΝΟΔΟΣ — The Ascent" allow="fullscreen" referrerpolicy="no-referrer" style="flex:1 1 auto;width:100%;border:0;display:block;"></iframe>';
    document.body.appendChild(ov);
  }

  const frame  = ov.querySelector('.anodos-ov-frame');
  const srcLbl = ov.querySelector('#anodos-ov-src');
  if (srcLbl) srcLbl.textContent = (injected && injected.length)
    ? ((cfg.datasetLabel || 'Ὑλικὸ μελέτης') + ' · ' + injected.length + ' ἐρωτήσεις')
    : '';

  // Once the game's globals are live in the (same-origin) iframe, apply content
  // through the shared bridge: swap the trivia bank with the chosen study
  // material, auto-generate the true/false volley from it, and append the
  // admin-managed riddles + rewards from config/anodos (window._anodosConfig).
  // The bundle replaces its document and runs Babel async after load, so the
  // bridge polls contentWindow until QUESTIONS/EVENTS/RELICS exist.
  // Cancel any stale poll from a previous launch before starting a new one
  if (frame._anodosCancel) { frame._anodosCancel(); frame._anodosCancel = null; }
  frame.onload = () => {
    if (typeof ANODOS_applyWhenReady !== 'function') return;
    frame._anodosCancel = ANODOS_applyWhenReady(frame, {
      studyQuestions: injected,
      config: window._anodosConfig || null,
    });
  };

  // Cache-bust so every launch reboots the game and re-fires onload (and re-reads
  // a freshly-injected bank). The query is harmless — the bundle fetches its
  // assets from inlined blob: URLs, not relative to this HTML.
  frame.src = _anodosBase() + 'play/anodos/Anodos-standalone.html?gp=' + (++_anodosSeq);

  closeEngineConfigurator();
  closeGamesPanel();
  ov.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeAnodos() {
  const ov = document.getElementById('anodos-overlay');
  if (!ov) return;
  ov.classList.remove('active');
  const frame = ov.querySelector('.anodos-ov-frame');
  if (frame) { if (frame._anodosCancel) { frame._anodosCancel(); frame._anodosCancel = null; } frame.onload = null; frame.src = 'about:blank'; }   // stop the game, free memory
  if (!document.querySelector('.game-overlay.active, #engine-cfg-modal.active, #auth-modal.active')) {
    document.body.style.overflow = '';
  }
}

// ── BATTLE ROYALE — Greek-arena trivia tournament, embedded via same-origin iframe ─
let _brSeq = 0;
function openBattleRoyale(cfg) {
  cfg = cfg || {};

  // Convert GP normalized bank → QUESTION_POOL format {q, opts:[4], ans:idx}
  let injected = null;
  if (Array.isArray(cfg.G) && cfg.G.length && typeof _gpToMcItems === 'function') {
    const items = _gpToMcItems(cfg.G)
      .map(it => ({ q: it.q.gr || it.q.en || '', opts: it.a, ans: it.c }))
      .filter(it => it.q && Array.isArray(it.opts) && it.opts.length >= 2);
    if (items.length) injected = items;
  }

  let ov = document.getElementById('battle-royale-overlay');
  if (!ov) {
    ov = document.createElement('div');
    ov.id = 'battle-royale-overlay';
    ov.className = 'game-overlay';
    ov.innerHTML =
      '<div style="flex:0 0 auto;display:flex;align-items:center;gap:12px;padding:8px 14px;background:#181412;border-bottom:1px solid rgba(185,142,46,.16);font:600 13px/1 Inter,system-ui,sans-serif;color:#EFE9DC;">' +
        '<button type="button" onclick="closeBattleRoyale()" style="display:inline-flex;align-items:center;gap:7px;color:#B98E2E;background:transparent;border:1px solid rgba(185,142,46,.38);padding:7px 12px;border-radius:7px;cursor:pointer;font:inherit;letter-spacing:.4px;">← Πίσω</button>' +
        '<span style="font-family:Cinzel,\'Cormorant Garamond\',serif;letter-spacing:2px;font-size:14px;color:#D4A83A;">BATTLE ROYALE · <b style="color:#C87830;">Arena Tournament</b></span>' +
        '<span id="br-ov-src" style="margin-left:auto;font:500 11px/1 \'JetBrains Mono\',monospace;color:#7C6F58;letter-spacing:.5px;"></span>' +
      '</div>' +
      '<iframe class="br-ov-frame" title="Battle Royale — Arena Tournament" allow="autoplay" referrerpolicy="no-referrer" style="flex:1 1 auto;width:100%;border:0;display:block;"></iframe>';
    document.body.appendChild(ov);
  }

  const frame  = ov.querySelector('.br-ov-frame');
  const srcLbl = ov.querySelector('#br-ov-src');
  if (srcLbl) srcLbl.textContent = injected
    ? ((cfg.datasetLabel || 'Ὑλικὸ μελέτης') + ' · ' + injected.length + ' ἐρωτήσεις')
    : '';

  // Poll until the iframe's React app has set window.BR_APP_READY, then inject config.
  if (frame._brPoll) { clearInterval(frame._brPoll); frame._brPoll = null; }
  frame.onload = () => {
    let tries = 0;
    frame._brPoll = setInterval(() => {
      if (++tries > 80) { clearInterval(frame._brPoll); frame._brPoll = null; return; }
      try {
        const cw = frame.contentWindow;
        if (cw && cw.BR_APP_READY) {
          clearInterval(frame._brPoll); frame._brPoll = null;
          cw.postMessage({ type: 'BR_CONFIG', questions: injected, pvp: !!cfg.pvp }, '*');
        }
      } catch(e) { clearInterval(frame._brPoll); frame._brPoll = null; }
    }, 100);
  };
  frame.src = _anodosBase() + 'play/battle-royale/Battle%20Royale.html?br=' + (++_brSeq);

  closeEngineConfigurator();
  closeGamesPanel();
  ov.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeBattleRoyale() {
  const ov = document.getElementById('battle-royale-overlay');
  if (!ov) return;
  ov.classList.remove('active');
  const frame = ov.querySelector('.br-ov-frame');
  if (frame) {
    if (frame._brPoll) { clearInterval(frame._brPoll); frame._brPoll = null; }
    frame.onload = null; frame.src = 'about:blank';
  }
  if (!document.querySelector('.game-overlay.active, #engine-cfg-modal.active, #auth-modal.active')) {
    document.body.style.overflow = '';
  }
}

// ── ENGINE CATEGORY MAP ──────────────────────────────────────
// Groups engines into coloured sections for the games panel.
const GP_ENGINE_CATEGORIES = [
  {
    id:      'adventure',
    label:   'Περιπέτεια',
    sublabel:'Roguelike · Adventure',
    icon:    '⛰️',
    accent:  '#C8632A',          // terracotta-amber (ΑΝΟΔΟΣ signature)
    ids:     ['anodos', 'battle-royale'],
  },
  {
    id:      'pvp',
    label:   'Ανταγωνισμός',
    sublabel:'PvP · Multiplayer',
    icon:    '⚔️',
    accent:  '#B03A1E',          // terracotta-red
    ids:     ['naumachia', 'tow'],
  },
  {
    id:      'action',
    label:   'Action & Ταχύτητα',
    sublabel:'Arcade · Speed',
    icon:    '🚀',
    accent:  '#2B4FAA',          // electric blue
    ids:     ['invaders', 'rapid-fire', 'blade'],
  },
  {
    id:      'strategy',
    label:   'Στρατηγική',
    sublabel:'Turn-based · Formation',
    icon:    '🛡️',
    accent:  '#4A6B28',          // military olive
    ids:     ['phalanx'],
  },
  {
    id:      'puzzle',
    label:   'Εξερεύνηση & Puzzle',
    sublabel:'Discovery · Sequencing · Maze',
    icon:    '🧩',
    accent:  '#9A6B10',          // amber-gold
    ids:     ['labyrinth', 'epic-puzzle', 'dig'],
  },
  {
    id:      'memory',
    label:   'Μνήμη & Μελέτη',
    sublabel:'Memory · Flashcards',
    icon:    '🃏',
    accent:  '#5B3A8A',          // indigo-violet
    ids:     ['myth-memory', 'mnemosyne'],
  },
  {
    id:      'fortune',
    label:   'Τύχη & Φρενίτιδα',
    sublabel:'Fortune · Frenzy',
    icon:    '⛵',
    accent:  '#C4A448',          // aegean gold
    ids:     ['golden-fleece', 'halieia'],
  },
];

// ── RENDER ENGINE GRID ───────────────────────────────────────
function _renderMechanicsGrid() {
  const grid = document.getElementById('mechanics-grid');
  if (!grid) return;
  grid.innerHTML = '';

  // Build a quick lookup: engine id → engine object
  const engMap = {};
  GP_ENGINES.forEach(e => { engMap[e.id] = e; });

  GP_ENGINE_CATEGORIES.forEach(cat => {
    // ── Category section wrapper ──────────────────────────────
    const section = document.createElement('div');
    section.className = 'gp-engine-section';
    section.dataset.catId = cat.id;

    // Category header
    const header = document.createElement('div');
    header.className = 'gp-cat-header';
    header.style.setProperty('--cat-accent', cat.accent);
    header.innerHTML = `
      <span class="gp-cat-icon">${cat.icon}</span>
      <div class="gp-cat-labels">
        <span class="gp-cat-name">${cat.label}</span>
        <span class="gp-cat-sub">${cat.sublabel}</span>
      </div>`;
    section.appendChild(header);

    // Engine cards row
    const row = document.createElement('div');
    row.className = 'gp-engine-row';

    cat.ids.forEach(eid => {
      const eng = engMap[eid];
      if (!eng) return;

      const card = document.createElement('div');
      card.className = `engine-card engine-card--${cat.id}`;
      card.style.setProperty('--cat-accent', cat.accent);
      // Self-contained engines bring their own mode-select screen, so launch
      // them directly; everything else flows through the dataset configurator.
      card.onclick = (eng.selfContained && typeof eng.opener === 'function')
        ? () => { closeGamesPanel(); eng.opener(); }
        : () => openEngineConfigurator(eng.id);

      const multiTag = eng.multiplayer
        ? `<div class="engine-card-multiplayer">Multiplayer</div>` : '';

      const tagsHtml = eng.tags
        .map(tag => `<span class="engine-card-tag engine-card-tag--${cat.id}">${tag}</span>`).join('');

      card.innerHTML = `
        <div class="engine-card-banner" style="background:${eng.bg}">
          ${multiTag}
          <span class="engine-card-cat-stripe" style="background:${cat.accent}"></span>
          <span style="position:relative;z-index:1;">${eng.icon}</span>
        </div>
        <div class="engine-card-body">
          <div class="engine-card-name">${eng.label}</div>
          <div class="engine-card-subtitle">${eng.subtitle}</div>
          <div class="engine-card-desc">${eng.desc}</div>
          <div class="engine-card-footer">
            <div class="engine-card-tags">${tagsHtml}</div>
            <div class="engine-card-arrow">→</div>
          </div>
        </div>`;

      // Favorite heart on the card itself — favoriting happens here, at the
      // game-selection step (syncs with everywhere else via favorites.js).
      if (typeof createFavBtn === 'function') {
        const fav = createFavBtn(eng.id);
        fav.classList.add('gp-card-fav');
        fav.addEventListener('click', e => e.stopPropagation(), true);
        const banner = card.querySelector('.engine-card-banner');
        (banner || card).appendChild(fav);
      }

      row.appendChild(card);
    });

    section.appendChild(row);
    grid.appendChild(section);
  });
}

// ════════════════════════════════════════════════════════════
//  ENGINE CONFIGURATOR (Reimagined) — UI layer
//  Builds (engineId, datasetId, modeConfig) and hands off to the
//  UNCHANGED launch core (ecmLaunchImport → initGameWithData,
//  ecmLaunchCustom → engine.opener). Markup/flow ported from the
//  prototype (configurator.reference.js). Content comes from
//  window.GP_CONTENT (gp-content.js); levels from GP_LEVEL_PROVIDERS
//  (gp-levels.js); icons from pIcon/pEmojiIcon (paideia-icons.js).
// ════════════════════════════════════════════════════════════

// bilingual helper (siteLang is the global site language: 'gr' | 'en')
function _ecmT(gr, en) { return (typeof siteLang !== 'undefined' && siteLang === 'en') ? en : gr; }

let _gpDsSearch = '';   // current content-search term (preserved across re-renders)

// True only when the dataset is leveled AND a real level provider exists.
// Leveled datasets without a provider fall back to whole-DB (no level step, no gate).
function _gpHasLevels(ds) {
  return !!(ds && ds.leveled && typeof GP_LEVEL_PROVIDERS !== 'undefined' &&
            GP_LEVEL_PROVIDERS[ds.id] && Array.isArray(GP_LEVEL_PROVIDERS[ds.id].levels) &&
            GP_LEVEL_PROVIDERS[ds.id].levels.length);
}

// ── MODE DEFINITIONS PER ENGINE (§6) ─────────────────────────
// Each mode resolves to the existing `pvp` boolean (+ count/join).
function _ecmModesFor(eng) {
  if (!eng) return [];
  if (eng.id === 'naumachia') return [
    { key:'ai',  pvp:false, icon:'cpu',   t:_ecmT('Εναντίον Υπολογιστή','Versus AI'),
      d:_ecmT('Παίξε μια μονομαχία ενάντια στο σύστημα.','Duel the computer one-on-one.') },
    { key:'pvp', pvp:true,  icon:'users', t:_ecmT('Εναντίον Παίκτη','Versus Player'),
      d:_ecmT('Προκάλεσε φίλο — ίδια συσκευή ή QR.','Challenge a friend — same device or QR.'), join:true },
  ];
  if (eng.id === 'tow' || eng.id === 'rapid-fire') return [
    { key:'solo', pvp:false, icon:'user',  t:_ecmT('Μόνος','Solo'),
      d:_ecmT('Εξάσκηση με τον δικό σου ρυθμό.','Practice at your own pace.') },
    { key:'pvp',  pvp:true,  icon:'users', t:_ecmT('Εναντίον Παικτών','Versus Players'),
      d:_ecmT('Ομάδες 2–8 — μοίρασε ή σκάναρε QR.','Teams of 2–8 — pass device or scan.'), count:true, join:true },
  ];
  if (eng.id === 'battle-royale') return [
    { key:'ai',  pvp:false, icon:'cpu',   t:_ecmT('Εναντίον AI','Versus AI'),
      d:_ecmT('Τουρνουά 24 πολεμιστών κατά της μηχανής.','24-warrior tournament against the computer.') },
    { key:'pvp', pvp:true,  icon:'users', t:_ecmT('Εναντίον Παίκτη','Versus Player'),
      d:_ecmT('Παίκτης 2 απαντά με πλήκτρα 1–4 — ίδια συσκευή.','Player 2 answers with keys 1–4 — same device.') },
  ];
  return [
    { key:'solo', pvp:false, icon:'user',  t:_ecmT('Μόνος','Solo'),
      d:_ecmT('Παίξε μόνος σου.','Play on your own.') },
    { key:'pvp',  pvp:true,  icon:'users', t:_ecmT('Εναντίον Παίκτη','Versus Player'),
      d:_ecmT('Δύο παίκτες — ίδια συσκευή ή QR.','Two players — same device or QR.'), join:true },
  ];
}
function _ecmCurMode() {
  const modes = _ecmModesFor(_gpCurrentEngine);
  return modes.find(m => m.key === _gpModeKey) || modes[0] || { key:'solo', pvp:false };
}

// ── OPEN ENGINE CONFIGURATOR ─────────────────────────────────
function openEngineConfigurator(engineId) {
  const eng = GP_ENGINES.find(e => e.id === engineId);
  if (!eng) return;
  _gpCurrentEngine   = eng;
  _gpSelectedDataset = null;
  _gpExtraDatasets   = [];
  _gpExtraOpenId     = null;
  _gpSelectedLevels  = [];
  _gpLevelsAll       = false;
  _gpSelectedLevel   = null;
  _gpCustomQuestions = null;
  _gpDsSearch        = '';
  const modes = _ecmModesFor(eng);
  _gpModeKey   = modes[0] ? modes[0].key : 'solo';
  _gpPvpMode   = modes[0] ? modes[0].pvp : false;
  _gpPlayMode  = _gpPvpMode ? 'pvp' : 'solo';
  _gpPlayerCount   = 2;
  _gpJoinMethod    = 'local';
  _gpChallengeSeed = null;

  _renderEcmShell();
  _renderDatasetList();
  _gpRenderUploadBox();
  _gpRenderLevelPicker(null);
  _renderEcmModes();
  _ecmRefresh();

  const modal = document.getElementById('engine-cfg-modal');
  if (modal) { modal.classList.add('active'); document.body.style.overflow = 'hidden'; }

  // Arcade handoff: a grammar quiz chose "Παιχνίδι" → pre-select its dataset
  // so the learner plays the same content through this engine.
  if (window._gpPendingDataset) {
    const _pd = window._gpPendingDataset; window._gpPendingDataset = null;
    try { if (typeof _gpSelectDataset === 'function') _gpSelectDataset(_pd); } catch (e) {}
  }

  // Merge cloud content (config/datasets + published teacher quizzes), then re-render.
  if (window.GP_CONTENT && typeof GP_CONTENT.loadCloud === 'function') {
    Promise.resolve(GP_CONTENT.loadCloud()).then(() => {
      if (_gpCurrentEngine && _gpCurrentEngine.id === engineId &&
          document.getElementById('engine-cfg-modal') &&
          document.getElementById('engine-cfg-modal').classList.contains('active')) {
        _renderDatasetList();
      }
    }).catch(() => {});
  }
}

function closeEngineConfigurator() {
  const modal = document.getElementById('engine-cfg-modal');
  if (modal) modal.classList.remove('active');
  _gpCurrentEngine   = null;
  _gpSelectedDataset = null;
  _gpExtraDatasets   = [];
  _gpExtraOpenId     = null;
  _gpSelectedLevels  = [];
  _gpLevelsAll       = false;
  _gpSelectedLevel   = null;
  _gpCustomQuestions = null;
  _gpModeKey         = null;
  _gpPlayMode        = 'solo';
  _gpPvpMode         = false;
  _gpPlayerCount     = 2;
  _gpJoinMethod      = 'local';
  _gpChallengeSeed   = null;
  if (!document.querySelector('.game-overlay.active, #games-panel-overlay.active, #auth-modal.active')) {
    document.body.style.overflow = '';
  }
}

// ── SHELL ────────────────────────────────────────────────────
function _renderEcmShell() {
  const m = document.getElementById('engine-cfg-modal');
  if (!m) return;
  const eng = _gpCurrentEngine;
  m.innerHTML =
  '<div class="ecx-box">' +
    '<div class="ecx-head">' +
      '<button class="ecx-back" type="button" title="' + _ecmT('Πίσω στα παιχνίδια','Back to games') + '" ' +
        'onclick="ecmBackToGamesPanel()">' + pIcon('arrow',20) + '</button>' +
      '<div class="ecx-glyph">' + pEmojiIcon(eng.icon, 26) + '</div>' +
      '<div class="ecx-titles"><span class="ecx-gr">' + eng.label + '</span>' +
        '<span class="ecx-en">' + (eng.subtitle || '') + ' · ' + _ecmT('Στήσιμο Παιχνιδιού','Game Setup') + '</span></div>' +
      '<span id="ecx-fav-slot" class="ecx-fav-slot"></span>' +
      '<button class="ecx-x" type="button" title="' + _ecmT('Κλείσιμο','Close') + '" ' +
        'onclick="closeEngineConfigurator()">' + pIcon('arrow',20) + '</button>' +
    '</div>' +
    '<div class="ecx-body">' +
      '<nav class="ecx-rail" id="ecx-rail"></nav>' +
      '<div class="ecx-content" id="ecx-content">' +
        '<section class="ecx-sec" id="sec-content"></section>' +
        '<section class="ecx-sec" id="sec-upload"></section>' +
        '<section class="ecx-sec" id="sec-level"></section>' +
        '<section class="ecx-sec" id="sec-mix-levels"></section>' +
        '<section class="ecx-sec" id="sec-mode"></section>' +
      '</div>' +
    '</div>' +
    '<div class="ecx-foot">' +
      '<div class="ecx-summary"><span class="ecx-summary-k">' + _ecmT('Έτοιμο για εκκίνηση','Ready to launch') + '</span>' +
        '<span class="ecx-summary-v" id="ecx-summary">—</span></div>' +
      '<button class="ecx-launch" type="button" id="ecx-launch" disabled onclick="_gpDoLaunch()">' +
        '<span id="ecx-launch-txt">' + _ecmT('Εκκίνηση','Launch') + '</span>' + pIcon('arrow',20) + '</button>' +
    '</div>' +
  '</div>';

  // Favorite is set in the games panel (at game-selection time), not here.
}

// Back button → return to the Games Panel (engine/mode selection), not home.
function ecmBackToGamesPanel() {
  closeEngineConfigurator();
  const ov = document.getElementById('games-panel-overlay');
  if (ov && !ov.classList.contains('active') && typeof openGamesPanel === 'function') {
    openGamesPanel();
  }
}

// ── STEP 1: CONTENT ──────────────────────────────────────────
function _renderDatasetList(filter) {
  const sec = document.getElementById('sec-content');
  if (!sec) return;
  if (typeof filter === 'string') _gpDsSearch = filter;
  const term = (_gpDsSearch || '').trim().toLowerCase();
  const allowed = (_gpCurrentEngine && _gpCurrentEngine.allowedCategories) || null;

  const rawGroups = (window.GP_CONTENT && typeof GP_CONTENT.groups === 'function')
    ? GP_CONTENT.groups() : [];
  const groups = rawGroups.map(g => ({
    group: g.group,
    items: g.items.filter(d =>
      (!allowed || allowed.includes(d.category)) &&
      (!term || ((d.label || '') + ' ' + (d.subject || '') + ' ' + (d.meta || '')).toLowerCase().includes(term))
    ),
  })).filter(g => g.items.length);

  let html =
    '<div class="ecx-sec-hd"><span class="ecx-sec-k">' + _ecmT('Βήμα 1','Step 1') + '</span></div>' +
    '<h2 class="ecx-sec-t">' + _ecmT('Διάλεξε ύλη','Choose content') + '</h2>' +
    '<p class="ecx-sec-s">' + _ecmT('Αυτόματη λίστα: γραμματική + ύλη τάξεων + δημοσιευμένα πακέτα.','Auto-listed: grammar + class content + published packs.') + '</p>' +
    '<div class="ecx-search">' + pIcon('search',18) +
      '<input id="ecx-ds-search" type="text" placeholder="' + _ecmT('Αναζήτηση ύλης…','Search content…') + '" value="' + _ecmEsc(_gpDsSearch) + '"/></div>';

  if (!groups.length) {
    html += '<p class="ecx-sec-s">' + _ecmT('Καμία ύλη δεν ταιριάζει.','No content matches.') + '</p>';
  }
  groups.forEach(grp => {
    html += '<div class="ecx-ds-cat">' + grp.group + '</div><div class="ecx-ds-grid">';
    grp.items.forEach(d => {
      const ok      = _gpCanAccessTier(d.tier);
      const sel     = _gpSelectedDataset === d.id;
      const isExtra = _gpExtraDatasets.some(e => e.id === d.id);
      const meta    = (d.subject ? d.subject + ' · ' : '') + (d.meta || '');
      const isNew   = d.isNew || d.source === 'teacher' || d.source === 'cloud';
      let right;
      if (!ok) right = '<span class="ecx-ds-flag">' + pIcon('lock',15) + ' Pro</span>';
      else if (isNew) right = '<span class="ecx-ds-flag ecx-ds-new">' + _ecmT('νέο','new') + '</span><span class="ecx-ds-check">' + pIcon('check',16) + '</span>';
      else right = '<span class="ecx-ds-check">' + pIcon('check',16) + '</span>';
      // "Add to mix" button — visible at all times on unlocked, non-primary cards
      const mixBtn = (ok && !sel)
        ? '<button type="button" class="ecx-ds-mix' + (isExtra ? ' on' : '') + '" data-ds="' + _ecmEsc(d.id) + '">' +
            (isExtra ? pIcon('check',13) + ' ' + _ecmT('Στη μείξη','In mix') : '+ ' + _ecmT('Mix','Mix')) +
          '</button>'
        : (sel ? '<div class="ecx-ds-primary-badge">' + _ecmT('Κύρια','Primary') + '</div>' : '');
      html +=
        '<div class="ecx-ds-wrap">' +
          '<button type="button" class="ecx-ds' + (sel ? ' sel' : '') + (isExtra ? ' sel-extra' : '') + (ok ? '' : ' locked') + '" data-ds="' + _ecmEsc(d.id) + '">' +
            '<span class="ecx-ds-ic">' + pIcon(d.icon || 'scroll', 22) + '</span>' +
            '<span class="ecx-ds-info"><span class="ecx-ds-name">' + (d.label || d.id) + '</span>' +
              '<span class="ecx-ds-meta">' + meta + '</span></span>' + right +
          '</button>' + mixBtn +
        '</div>';
    });
    html += '</div>';
  });
  sec.innerHTML = html;

  const q = document.getElementById('ecx-ds-search');
  if (q) {
    q.oninput = () => _renderDatasetList(q.value);
    if (term) { q.focus(); try { q.setSelectionRange(q.value.length, q.value.length); } catch (_) {} }
  }
  sec.querySelectorAll('.ecx-ds').forEach(el => {
    if (el.classList.contains('locked')) {
      el.onclick = () => { try { el.animate([{transform:'translateX(0)'},{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}],{duration:240}); } catch(_){} };
    } else {
      el.onclick = () => _gpSelectDataset(el.dataset.ds);
    }
  });
  sec.querySelectorAll('.ecx-ds-mix').forEach(el => {
    el.onclick = (e) => { e.stopPropagation(); _gpToggleExtraDataset(el.dataset.ds); };
  });
}

function _ecmEsc(s) { return String(s == null ? '' : s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;'); }

function _gpSelectDataset(dsId) {
  if (_gpSelectedDataset === dsId) {
    // toggle off: deselect primary
    _gpSelectedDataset = null;
    _gpSelectedLevels  = [];
    _gpLevelsAll       = false;
    _gpSelectedLevel   = null;
    _gpOpenGroup       = null;
    _gpLvlSearch       = '';
    _renderDatasetList();
    _gpRenderLevelPicker(null);
    _ecmRefresh();
    return;
  }
  // If it was an extra, promote it to primary (remove from extras)
  _gpExtraDatasets   = _gpExtraDatasets.filter(e => e.id !== dsId);
  _gpSelectedDataset = dsId;
  _gpCustomQuestions = null;            // dataset selection wins over an upload
  const ds = GP_CONTENT.find(dsId);
  const leveled = _gpHasLevels(ds);
  _gpSelectedLevels = [];
  _gpLevelsAll      = leveled;          // default to "Όλα" for a leveled module
  _gpSelectedLevel  = null;
  _gpOpenGroup      = null;             // reset two-pane picker view-state
  _gpLvlSearch      = '';
  // reset a teacher's "use questions" button if present
  const useBtn = document.getElementById('ecm-use-questions-btn');
  if (useBtn) { useBtn.disabled = false; useBtn.textContent = _ecmT('✓ Χρήση αυτών των ερωτήσεων','✓ Use these questions'); }
  _renderDatasetList();
  _gpRenderLevelPicker(dsId);
  _ecmRefresh();
  _ecmScrollTo(leveled ? 'sec-level' : 'sec-mode');
  if (_gpJoinMethod === 'qr' && _gpPvpMode) _gpRefreshQR();
}

function _gpToggleExtraDataset(dsId) {
  const idx = _gpExtraDatasets.findIndex(e => e.id === dsId);
  if (idx >= 0) {
    _gpExtraDatasets.splice(idx, 1);
    if (_gpExtraOpenId === dsId) _gpExtraOpenId = null;
  } else {
    _gpExtraDatasets.push({ id: dsId, all: true, levels: [] });
    setTimeout(() => _ecmScrollTo('sec-mix-levels'), 60);
  }
  _renderDatasetList();
  _gpRenderExtraLevelPickers();
  _ecmRefresh();
  if (_gpJoinMethod === 'qr' && _gpPvpMode) _gpRefreshQR();
}

function _gpExtraFind(dsId) {
  return _gpExtraDatasets.find(e => e.id === dsId) || null;
}

function _gpExtraSetAll(dsId) {
  const e = _gpExtraFind(dsId);
  if (!e) return;
  e.all    = true;
  e.levels = [];
  _gpRenderExtraLevelPickers();
  _ecmRefresh();
}

function _gpExtraToggleLevel(dsId, levelId) {
  const e = _gpExtraFind(dsId);
  if (!e) return;
  e.all = false;
  const i = e.levels.indexOf(levelId);
  if (i >= 0) e.levels.splice(i, 1); else e.levels.push(levelId);
  if (e.levels.length === 0) e.all = true;   // fall back to "all" if nothing picked
  _gpRenderExtraLevelPickers();
  _ecmRefresh();
}

function _gpExtraOpenPicker(dsId) {
  _gpExtraOpenId = (_gpExtraOpenId === dsId) ? null : dsId;
  _gpRenderExtraLevelPickers();
}

// ── STEP 2b: MIX LEVEL PICKERS ───────────────────────────────
function _gpRenderExtraLevelPickers() {
  const sec = document.getElementById('sec-mix-levels');
  if (!sec) return;
  if (_gpExtraDatasets.length === 0) { sec.innerHTML = ''; sec.style.display = 'none'; return; }
  sec.style.display = '';

  let html =
    '<div class="ecx-sec-hd"><span class="ecx-sec-k">' + _ecmT('Mix','Mix') + '</span></div>' +
    '<h2 class="ecx-sec-t">' + _ecmT('Επίπεδα μείξης','Mix levels') + '</h2>' +
    '<p class="ecx-sec-s">' + _ecmT('Επίλεξε επίπεδα για κάθε πρόσθετη ύλη.','Choose levels for each extra dataset.') + '</p>';

  _gpExtraDatasets.forEach(entry => {
    const ds = GP_CONTENT.find(entry.id);
    if (!ds) return;
    const prov = (typeof GP_LEVEL_PROVIDERS !== 'undefined') ? GP_LEVEL_PROVIDERS[entry.id] : null;
    const hasLevels = !!(prov && prov.levels && prov.levels.length);
    const levelSummary = !hasLevels ? _ecmT('Όλα','All')
      : entry.all ? _ecmT('Όλα τα επίπεδα','All levels')
      : entry.levels.length + ' ' + _ecmT('επ.','lv.');
    const isOpen = hasLevels && _gpExtraOpenId === entry.id;

    html += '<div class="ecx-mix-row' + (isOpen ? ' open' : '') + '" data-mix-id="' + _ecmEsc(entry.id) + '">';
    html +=
      '<div class="ecx-mix-hd">' +
        '<span class="ecx-mix-name">' + _ecmEsc(ds.label) + '</span>' +
        (hasLevels
          ? '<button type="button" class="ecx-mix-lv-toggle" data-mix-id="' + _ecmEsc(entry.id) + '">' +
              levelSummary + ' ▾</button>'
          : '<span class="ecx-mix-lv-toggle">' + levelSummary + '</span>') +
        '<button type="button" class="ecx-mix-rm" data-mix-id="' + _ecmEsc(entry.id) + '" title="' + _ecmT('Αφαίρεση','Remove') + '">×</button>' +
      '</div>';

    if (isOpen && hasLevels) {
      html += '<div class="ecx-mix-picker">';
      // "All" button
      html += '<button type="button" class="ecx-mix-pill' + (entry.all ? ' on' : '') + '" data-mix-id="' + _ecmEsc(entry.id) + '" data-all="1">' + _ecmT('Όλα','All') + '</button>';
      // Individual level buttons
      const levels = prov.levels;
      const groups = [], gmap = {};
      levels.forEach(l => {
        if (!gmap[l.group]) { gmap[l.group] = []; groups.push(l.group); }
        gmap[l.group].push(l);
      });
      groups.forEach(g => {
        html += '<span class="ecx-mix-grp">' + _ecmEsc(g) + '</span>';
        gmap[g].forEach(l => {
          const on = !entry.all && entry.levels.includes(l.id);
          html += '<button type="button" class="ecx-mix-pill' + (on ? ' on' : '') + '" data-mix-id="' + _ecmEsc(entry.id) + '" data-lv="' + l.id + '">' +
            String(l.id).padStart(2,'0') + ' ' + _ecmEsc(l.desc.length > 28 ? l.desc.slice(0,27) + '…' : l.desc) + '</button>';
        });
      });
      html += '</div>';
    }
    html += '</div>';
  });

  sec.innerHTML = html;

  // event bindings
  sec.querySelectorAll('.ecx-mix-lv-toggle').forEach(el => {
    el.onclick = () => _gpExtraOpenPicker(el.dataset.mixId);
  });
  sec.querySelectorAll('.ecx-mix-rm').forEach(el => {
    el.onclick = () => _gpToggleExtraDataset(el.dataset.mixId);
  });
  sec.querySelectorAll('.ecx-mix-pill[data-all]').forEach(el => {
    el.onclick = () => _gpExtraSetAll(el.dataset.mixId);
  });
  sec.querySelectorAll('.ecx-mix-pill[data-lv]').forEach(el => {
    el.onclick = () => _gpExtraToggleLevel(el.dataset.mixId, +el.dataset.lv);
  });
}

// ── STEP 2: LEVELS — two-pane picker (umbrella rail + section detail) ──
//   Multi-select preserved (_gpSelectedLevels / _gpLevelsAll). Levels carry
//   { id, group, section?, desc }. High score is read from each game's own
//   localStorage progress store (`<prefix>_prog_<id>` = {best, completed}).

// dataset.id → localStorage score-store prefix (matches each game module).
const GP_SCORE_PREFIX = {
  lyo:'lyo', ousiastika:'ous', antonymies:'ant', 'aoristos-b':'aob',
  synirimmena:'syn', afwnolekta:'afw', 'rimata-mi':'rmi', 'lat-nouns':'latn',
  'lat-epitheta':'late', paratheta:'par', epitheta:'ept', pathitiko:'path',
  'lat-verbs':'latv', 'lat-antonymies':'latp', eimi:'eimi',
};
function _gpLvlProg(dsId, levelId) {
  const pfx = GP_SCORE_PREFIX[dsId];
  if (pfx) {
    try {
      const p = JSON.parse(localStorage.getItem(pfx + '_prog_' + levelId) || 'null');
      if (p) return { state: p.completed ? 'done' : 'active', best: p.best || 0 };
    } catch (e) {}
  }
  return { state: 'new', best: 0 };
}
function _gpGroupStats(dsId, levels) {
  const done = levels.filter(l => _gpLvlProg(dsId, l.id).state === 'done').length;
  return { done, total: levels.length, pct: levels.length ? Math.round(done / levels.length * 100) : 0 };
}
function _gpRailLabel(ds) {
  if (ds && ds.alpha) return _ecmT('Αλφάβητο', 'Alphabet');
  const M = { ousiastika:['Κλίσεις','Declensions'], 'lat-nouns':['Κλίσεις','Declensions'],
              lyo:['Εγκλίσεις','Moods'], 'aoristos-b':['Εγκλίσεις','Moods'] };
  const m = M[ds && ds.id];
  return m ? _ecmT(m[0], m[1]) : _ecmT('Κατηγορίες', 'Categories');
}
function _gpRing(pct, label) {
  const r = 12, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  return '<span class="gpx-ring"><svg width="28" height="28" viewBox="0 0 28 28">' +
    '<circle class="trk" cx="14" cy="14" r="' + r + '" fill="none" stroke-width="2.6"/>' +
    '<circle class="fil" cx="14" cy="14" r="' + r + '" fill="none" stroke-width="2.6" stroke-linecap="round" ' +
    'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 14 14)"/></svg>' +
    '<i>' + label + '</i></span>';
}
function _gpLvlRow(ds, l, seq, showGroup) {
  const on = !_gpLevelsAll && _gpSelectedLevels.indexOf(l.id) >= 0;
  const pr = _gpLvlProg(ds.id, l.id);
  let chip;
  if (pr.state === 'done')        chip = '<span class="gpx-score done" title="' + _ecmT('Υψηλό σκορ','High score') + '">' + pIcon('check',11) + ' ' + pr.best + '<i>πτ</i></span>';
  else if (pr.state === 'active') chip = '<span class="gpx-score act">' + pr.best + '<i>πτ</i> · ' + _ecmT('ΣΥΝΕΧΙΣΕ','RESUME') + '</span>';
  else                            chip = '<span class="gpx-score new">' + _ecmT('Ξεκίνα →','Start →') + '</span>';
  return '<button type="button" class="gpx-row' + (on ? ' on' : '') + ' s-' + pr.state + '" data-lv="' + l.id + '">' +
    '<span class="gpx-box">' + pIcon('check',13) + '</span>' +
    '<span class="gpx-num">' + String(seq).padStart(2,'0') + '</span>' +
    '<span class="gpx-rowbody"><span class="gpx-desc">' + l.desc + '</span>' +
      (showGroup ? '<span class="gpx-rowgrp">' + _ecmEsc(l.group) + (l.section ? ' · ' + _ecmEsc(l.section) : '') + '</span>' : '') +
    '</span>' + chip + '</button>';
}
function _gpAlphaBody(ds, gmap, groups, seqOf) {
  let bar = '<div class="gpx-alphabar">';
  groups.forEach(letter => {
    const st = _gpGroupStats(ds.id, gmap[letter]);
    const on = letter === _gpOpenGroup;
    bar += '<button type="button" class="gpx-achip' + (on ? ' on' : '') + '" data-grp="' + encodeURIComponent(letter) + '">' +
      _ecmEsc(letter) + (st.done > 0 && !on ? '<span class="dot"></span>' : '') + '</button>';
  });
  bar += '</div>';
  const shown = gmap[_gpOpenGroup] || [];
  return '<div class="gpx-alphabody">' + bar +
    '<div class="gpx-detail-hd"><h3>' + _ecmEsc(_gpOpenGroup) + '</h3><span class="meta">' + shown.length + '</span></div>' +
    '<div class="gpx-rows gpx-alpha-rows">' + shown.map(l => _gpLvlRow(ds, l, seqOf[l.id], false)).join('') + '</div></div>';
}
function _gpRenderLevelPicker(dsId) {
  const sec = document.getElementById('sec-level');
  if (!sec) return;
  const ds = dsId ? GP_CONTENT.find(dsId) : (_gpSelectedDataset ? GP_CONTENT.find(_gpSelectedDataset) : null);
  if (!_gpHasLevels(ds)) { sec.innerHTML = ''; sec.style.display = 'none'; return; }
  sec.style.display = '';
  sec.classList.add('gpx-pick');
  const lv = GP_LEVEL_PROVIDERS[ds.id].levels;

  // umbrellas in first-appearance order; sequence number = position in the list
  const groups = [], gmap = {}, seqOf = {};
  lv.forEach((l, i) => {
    if (!gmap[l.group]) { gmap[l.group] = []; groups.push(l.group); }
    gmap[l.group].push(l); seqOf[l.id] = i + 1;
  });
  if (!_gpOpenGroup || !gmap[_gpOpenGroup]) {
    const act = lv.find(l => _gpLvlProg(ds.id, l.id).state === 'active') || lv[0];
    _gpOpenGroup = act ? act.group : groups[0];
  }

  const esc = _ecmEsc;
  const ql = _gpLvlSearch.trim().toLowerCase();
  const searching = ql.length > 0;
  const matches = searching
    ? lv.filter(l => (l.desc + ' ' + l.group + ' ' + (l.section || '')).toLowerCase().includes(ql) || String(seqOf[l.id]) === ql)
    : [];
  const stTot = _gpGroupStats(ds.id, lv);

  let head =
    '<div class="ecx-sec-hd"><span class="ecx-sec-k">' + _ecmT('Βήμα 2','Step 2') + '</span></div>' +
    '<h2 class="ecx-sec-t">' + _ecmT('Διάλεξε επίπεδα','Choose levels') + '</h2>' +
    '<div class="gpx-search"><span class="gpx-si">' + pIcon('search',14) + '</span>' +
      '<input id="gpx-lvl-q" type="text" autocomplete="off" placeholder="' + _ecmT('Αναζήτηση επιπέδου…','Search level…') + '" value="' + esc(_gpLvlSearch) + '"/>' +
      (searching ? '<button type="button" id="gpx-lvl-qx" class="gpx-qx" title="' + _ecmT('Καθάρισε','Clear') + '">' + pIcon('close',12) + '</button>' : '') +
    '</div>' +
    '<div class="gpx-prog"><div class="gpx-bar"><i style="width:' + stTot.pct + '%"></i></div>' +
      '<span>' + stTot.done + '/' + stTot.total + ' ' + _ecmT('ολοκληρωμένα','done') + '</span></div>';

  let body;
  if (ds.alpha && !searching) {
    body = _gpAlphaBody(ds, gmap, groups, seqOf);
  } else {
    // rail of umbrellas + "Όλα τα επίπεδα" card
    let rail = '<div class="gpx-rail"><div class="gpx-rail-lbl">' + esc(_gpRailLabel(ds)) + '</div>' +
      '<button type="button" class="gpx-all' + (_gpLevelsAll ? ' on' : '') + '" data-all="1">' +
        '<span class="gpx-all-box">' + pIcon('check',14) + '</span>' +
        '<span class="gpx-all-tx"><b>' + _ecmT('Όλα τα επίπεδα','All levels') + '</b>' +
        '<i>' + lv.length + ' ' + _ecmT('επίπεδα · ανακατεμένα','levels · shuffled') + '</i></span></button>';
    groups.forEach(g => {
      const st = _gpGroupStats(ds.id, gmap[g]);
      const on = !searching && g === _gpOpenGroup;
      rail += '<button type="button" class="gpx-railitem' + (on ? ' on' : '') + '" data-grp="' + encodeURIComponent(g) + '">' +
        '<span class="gpx-railbody"><span class="nm">' + esc(g) + '</span>' +
        '<span class="bl">' + st.done + '/' + st.total + ' ' + _ecmT('ολοκλ.','done') + '</span></span>' +
        _gpRing(st.pct, st.done) + '</button>';
    });
    rail += '</div>';

    // detail pane: search results (flat) or the open umbrella's levels by section
    const shown = searching ? matches : (gmap[_gpOpenGroup] || []);
    let detail = '<div class="gpx-detail"><div class="gpx-detail-hd"><h3>' +
      (searching ? _ecmT('Αποτελέσματα','Results') : esc(_gpOpenGroup)) + '</h3>' +
      '<span class="meta">' + shown.length + ' ' + _ecmT('επίπεδα','levels') +
      (searching ? '' : ' · <span class="gpx-gsel" data-gsel="' + encodeURIComponent(_gpOpenGroup) + '">' + _ecmT('επίλεξε ομάδα','select group') + '</span>') +
      '</span></div>';
    if (!shown.length) {
      detail += '<div class="gpx-empty">' + _ecmT('Κανένα επίπεδο για «','No level for "') + esc(_gpLvlSearch) + '»</div>';
    } else if (searching) {
      detail += '<div class="gpx-rows">' + shown.map(l => _gpLvlRow(ds, l, seqOf[l.id], true)).join('') + '</div>';
    } else {
      const sects = [], smap = {};
      shown.forEach(l => { const s = l.section || ''; if (!(s in smap)) { smap[s] = []; sects.push(s); } smap[s].push(l); });
      sects.forEach(s => {
        if (s) detail += '<div class="gpx-subdiv">' + esc(s) + '<span class="ct">' + smap[s].length + '</span></div>';
        detail += '<div class="gpx-rows">' + smap[s].map(l => _gpLvlRow(ds, l, seqOf[l.id], false)).join('') + '</div>';
      });
    }
    detail += '</div>';
    body = '<div class="gpx-body">' + rail + detail + '</div>';
  }

  sec.innerHTML = head + body;
  _gpWirePicker(sec, ds, gmap);
}
function _gpWirePicker(sec, ds, gmap) {
  const rerender = () => { _gpRenderLevelPicker(ds.id); _ecmRefresh(); if (_gpJoinMethod === 'qr' && _gpPvpMode) _gpRefreshQR(); };
  const q = sec.querySelector('#gpx-lvl-q');
  if (q) q.oninput = () => {
    _gpLvlSearch = q.value; _gpRenderLevelPicker(ds.id);
    const nq = document.getElementById('gpx-lvl-q');
    if (nq) { nq.focus(); const n = nq.value.length; try { nq.setSelectionRange(n, n); } catch (e) {} }
  };
  const qx = sec.querySelector('#gpx-lvl-qx');
  if (qx) qx.onclick = () => { _gpLvlSearch = ''; _gpRenderLevelPicker(ds.id); };

  const allBtn = sec.querySelector('[data-all]');
  if (allBtn) allBtn.onclick = () => {
    _gpLevelsAll = !_gpLevelsAll;
    if (_gpLevelsAll) _gpSelectedLevels = [];
    _gpSelectedLevel = _gpSelectedLevels[0] != null ? _gpSelectedLevels[0] : null;
    rerender();
  };
  sec.querySelectorAll('.gpx-railitem, .gpx-achip').forEach(el => el.onclick = () => {
    _gpOpenGroup = decodeURIComponent(el.dataset.grp); _gpLvlSearch = ''; _gpRenderLevelPicker(ds.id);
  });
  sec.querySelectorAll('.gpx-row').forEach(el => el.onclick = () => _gpSelectLevel(+el.dataset.lv));

  const gsel = sec.querySelector('[data-gsel]');
  if (gsel) gsel.onclick = (e) => {
    e.stopPropagation();
    const g = decodeURIComponent(gsel.dataset.gsel);
    _gpLevelsAll = false;
    const ids = (gmap[g] || []).map(l => l.id);
    const allOn = ids.every(i => _gpSelectedLevels.indexOf(i) >= 0);
    ids.forEach(i => {
      const k = _gpSelectedLevels.indexOf(i);
      if (allOn) { if (k >= 0) _gpSelectedLevels.splice(k, 1); }
      else if (k < 0) _gpSelectedLevels.push(i);
    });
    _gpSelectedLevel = _gpSelectedLevels[0] != null ? _gpSelectedLevels[0] : null;
    rerender();
  };
}

function _gpSelectLevel(levelId) {
  const id = +levelId;
  _gpLevelsAll = false;
  const i = _gpSelectedLevels.indexOf(id);
  if (i >= 0) _gpSelectedLevels.splice(i, 1); else _gpSelectedLevels.push(id);
  _gpSelectedLevel = _gpSelectedLevels[0] != null ? _gpSelectedLevels[0] : null;
  _gpRenderLevelPicker(_gpSelectedDataset);
  _ecmRefresh();
  if (_gpJoinMethod === 'qr' && _gpPvpMode) _gpRefreshQR();
}

// ── STEP 3: MODE ─────────────────────────────────────────────
function _renderEcmModes() {
  const sec = document.getElementById('sec-mode');
  if (!sec) return;
  const modes = _ecmModesFor(_gpCurrentEngine);
  let html =
    '<div class="ecx-sec-hd"><span class="ecx-sec-k">' + _ecmT('Βήμα 3','Step 3') + '</span></div>' +
    '<h2 class="ecx-sec-t">' + _ecmT('Διάλεξε τρόπο','Choose mode') + '</h2>' +
    '<p class="ecx-sec-s">' + _ecmT('Πώς θες να παίξεις;','How do you want to play?') + '</p>' +
    '<div class="ecx-modes">';
  modes.forEach(mo => {
    const on = _gpModeKey === mo.key;
    html += '<button type="button" class="ecx-mode' + (on ? ' on' : '') + '" data-mode="' + mo.key + '">' +
      '<span class="ecx-mode-ic">' + pIcon(mo.icon, 24) + '</span>' +
      '<span class="ecx-mode-t">' + mo.t + '</span>' +
      '<span class="ecx-mode-d">' + mo.d + '</span></button>';
  });
  html += '</div><div id="ecx-pvp-slot"></div>';
  sec.innerHTML = html;
  sec.querySelectorAll('.ecx-mode').forEach(el => {
    el.onclick = () => _gpPickMode(el.dataset.mode);
  });
  _renderEcmPvp();
}

function _gpPickMode(key) {
  const modes = _ecmModesFor(_gpCurrentEngine);
  const mo = modes.find(m => m.key === key) || modes[0];
  if (!mo) return;
  _gpModeKey  = mo.key;
  _gpPvpMode  = mo.pvp;
  _gpPlayMode = mo.pvp ? 'pvp' : 'solo';
  if (!mo.pvp) { _gpJoinMethod = 'local'; _gpChallengeSeed = null; }
  _renderEcmModes();
  _ecmRefresh();
}

function _renderEcmPvp() {
  const slot = document.getElementById('ecx-pvp-slot');
  if (!slot) return;
  const mo = _ecmCurMode();
  if (!_gpPvpMode || (!mo.count && !mo.join)) { slot.innerHTML = ''; return; }
  const maxP = (_gpCurrentEngine && _gpCurrentEngine.maxPlayers) || 2;
  let html = '<div class="ecx-pvp">';
  if (mo.count) {
    const counts = [2,4,6,8].filter(n => n <= maxP);
    html += '<div><div class="ecx-row-l">' + _ecmT('Παίκτες','Players') + '</div><div class="ecx-seg" id="ecx-count">' +
      counts.map(n => '<button type="button" class="' + (_gpPlayerCount === n ? 'on' : '') + '" data-n="' + n + '">' + n + '</button>').join('') + '</div></div>';
  }
  if (mo.join) {
    html += '<div><div class="ecx-row-l">' + _ecmT('Σύνδεση','Join') + '</div><div class="ecx-seg ecx-join" id="ecx-join">' +
      '<button type="button" class="' + (_gpJoinMethod === 'local' ? 'on' : '') + '" data-j="local">' + pIcon('phone',18) + ' ' + _ecmT('Ίδια Συσκευή','Same Device') + '</button>' +
      '<button type="button" class="' + (_gpJoinMethod === 'qr' ? 'on' : '') + '" data-j="qr">' + pIcon('scan',18) + ' QR</button></div></div>';
    if (_gpJoinMethod === 'qr') html += '<div class="ecx-qr" id="ecm-qr-img"></div>';
  }
  html += '</div>';
  slot.innerHTML = html;
  const cnt = document.getElementById('ecx-count');
  if (cnt) cnt.querySelectorAll('button').forEach(b => b.onclick = () => ecmSetPlayerCount(+b.dataset.n));
  const jn = document.getElementById('ecx-join');
  if (jn) jn.querySelectorAll('button').forEach(b => b.onclick = () => ecmSetJoinMethod(b.dataset.j));
  if (_gpJoinMethod === 'qr') _gpRefreshQR();
}

// Public mode setters (kept for any external callers / inline handlers)
function ecmSetPlayMode(mode) {
  const modes = _ecmModesFor(_gpCurrentEngine);
  const want = (mode === 'pvp');
  const mo = modes.find(m => m.pvp === want) || modes[0];
  if (mo) _gpPickMode(mo.key);
}
function ecmSetPvp(isPvp) { ecmSetPlayMode(isPvp ? 'pvp' : 'solo'); }

function ecmSetPlayerCount(n) {
  _gpPlayerCount = n;
  _renderEcmPvp();
  _ecmRefresh();
}

function ecmSetJoinMethod(method) {
  _gpJoinMethod = method;
  if (method !== 'qr') _gpChallengeSeed = null;
  _renderEcmPvp();
  _ecmRefresh();
}

// ── QR CODE (same params/builder; restyled container) ────────
function _gpRefreshQR() {
  const host = document.getElementById('ecm-qr-img');
  if (!host) return;
  if (!_gpCurrentEngine || !_gpSelectedDataset) {
    host.innerHTML = '<div class="ecx-qr-box">' + pIcon('scan',40) + '</div>' +
      '<div class="ecx-qr-info">' + _ecmT('Επίλεξε ύλη πρώτα →','Choose content first →') + '</div>';
    return;
  }
  if (!_gpChallengeSeed) _gpChallengeSeed = Math.random().toString(36).slice(2, 8).toUpperCase();
  const params = new URLSearchParams({
    challenge: '1',
    e:    _gpCurrentEngine.id,
    d:    _gpSelectedDataset,
    seed: _gpChallengeSeed,
  });
  if (_gpSelectedLevel)   params.set('l', _gpSelectedLevel);
  if (_gpPlayerCount > 2) params.set('p', _gpPlayerCount);
  const link  = location.origin + '/?' + params;
  const qrUrl = 'https://api.qrserver.com/v1/create-qr-code/?size=190x190' +
    '&data=' + encodeURIComponent(link) + '&color=C8A84B&bgcolor=111009&margin=7&format=svg';
  host.innerHTML =
    '<div class="ecx-qr-box"><img src="' + qrUrl + '" alt="Challenge QR" width="96" height="96" loading="lazy"></div>' +
    '<div class="ecx-qr-info">' + _ecmT('Σάρωσε για να μπεις στην πρόκληση.','Scan to join the challenge.') +
    '<br><span class="ecx-qr-seed">' + _gpChallengeSeed + '</span></div>';
}

// ── RAIL + SUMMARY + LAUNCH STATE ────────────────────────────
function _ecmLevelSummary() {
  const ds = _gpSelectedDataset ? GP_CONTENT.find(_gpSelectedDataset) : null;
  if (!_gpHasLevels(ds)) return null;
  if (_gpLevelsAll) return _ecmT('Όλα τα επίπεδα','All levels');
  if (_gpSelectedLevels.length === 0) return _ecmT('— διάλεξε','— pick');
  if (_gpSelectedLevels.length === 1) return _ecmT('Επίπεδο ','Level ') + _gpSelectedLevels[0];
  return _gpSelectedLevels.length + ' ' + _ecmT('επίπεδα','levels');
}
function _ecmModeSummary() {
  const mo = _ecmCurMode();
  let s = mo.t || '';
  if (_gpPvpMode && mo.count) s += ' · ' + _gpPlayerCount + 'p';
  if (_gpPvpMode && mo.join)  s += ' · ' + (_gpJoinMethod === 'qr' ? 'QR' : _ecmT('Ίδια συσκ.','Same dev.'));
  return s;
}
function _ecmIsReady() {
  if (_gpCustomQuestions && _gpCustomQuestions.length && !_gpSelectedDataset && _gpExtraDatasets.length === 0) return true;
  if (!_gpSelectedDataset && _gpExtraDatasets.length === 0) return false;
  if (_gpSelectedDataset) {
    const ds = GP_CONTENT.find(_gpSelectedDataset);
    if (_gpHasLevels(ds) && !_gpLevelsAll && _gpSelectedLevels.length === 0) return false;
  }
  return true;
}
function _ecmSummaryLine() {
  if (_gpCustomQuestions && _gpCustomQuestions.length && !_gpSelectedDataset && _gpExtraDatasets.length === 0) {
    return '<b>' + (_gpCurrentEngine ? _gpCurrentEngine.label : '') + '</b> &nbsp;·&nbsp; ' +
      _gpCustomQuestions.length + ' ' + _ecmT('ερωτήσεις','questions') + ' &nbsp;·&nbsp; ' + _ecmModeSummary();
  }
  if (!_gpSelectedDataset && _gpExtraDatasets.length === 0) return _ecmT('Διάλεξε ύλη για να ξεκινήσεις','Choose content to begin');
  const ds = _gpSelectedDataset ? GP_CONTENT.find(_gpSelectedDataset) : null;
  const bits = ['<b>' + (_gpCurrentEngine ? _gpCurrentEngine.label : '') + '</b>'];
  if (ds) {
    bits.push(ds.label);
    if (_gpHasLevels(ds)) bits.push(_ecmLevelSummary());
  }
  if (_gpExtraDatasets.length > 0) {
    const extraLabels = _gpExtraDatasets.map(e => { const d = GP_CONTENT.find(e.id); return d ? d.label : e.id; });
    bits.push('+&nbsp;' + extraLabels.join(', '));
  }
  bits.push(_ecmModeSummary());
  return bits.join(' &nbsp;·&nbsp; ');
}

function _ecmRefresh() {
  const rail = document.getElementById('ecx-rail');
  if (rail) {
    const ds = _gpSelectedDataset ? GP_CONTENT.find(_gpSelectedDataset) : null;
    const leveled = _gpHasLevels(ds);
    const _contentDone = !!_gpSelectedDataset || !!(_gpCustomQuestions && _gpCustomQuestions.length) || _gpExtraDatasets.length > 0;
    let _contentV;
    if (ds) _contentV = ds.label + (_gpExtraDatasets.length > 0 ? ' +' + _gpExtraDatasets.length : '');
    else if (_gpExtraDatasets.length > 0) _contentV = _gpExtraDatasets.length + ' ' + _ecmT('ύλες','topics');
    else _contentV = _ecmT('— διάλεξε','— pick');
    if (typeof _gpRenderExtraLevelPickers === 'function') _gpRenderExtraLevelPickers();
    const steps = [
      { id:'sec-content', n:1, t:_ecmT('Ύλη','Content'), v: _contentV, done: _contentDone },
    ];
    if (leveled) steps.push({ id:'sec-level', n:2, t:_ecmT('Επίπεδο','Level'),
      v:_ecmLevelSummary(), done:(_gpLevelsAll || _gpSelectedLevels.length > 0) });
    steps.push({ id:'sec-mode', n:steps.length + 1, t:_ecmT('Τρόπος','Mode'), v:_ecmModeSummary(), done:true });
    rail.innerHTML = steps.map(s =>
      '<button type="button" class="ecx-step' + (s.done ? ' done' : '') + '" data-go="' + s.id + '">' +
        '<span class="ecx-step-num">' + (s.done ? pIcon('check',16) : s.n) + '</span>' +
        '<span class="ecx-step-body"><span class="ecx-step-t">' + s.t + '</span>' +
          '<span class="ecx-step-v">' + (s.v || '—') + '</span></span></button>').join('') +
      '<div class="ecx-rail-spacer"></div>' +
      '<div class="ecx-rail-note">' + _ecmT('Κάθε επιλογή τροφοδοτεί τον ίδιο μηχανισμό εκκίνησης.',
        'Every choice feeds the same launch contract.') + '</div>';
    rail.querySelectorAll('.ecx-step').forEach(el => el.onclick = () => _ecmScrollTo(el.dataset.go));
  }
  const sum = document.getElementById('ecx-summary');
  if (sum) sum.innerHTML = _ecmSummaryLine();
  _gpUpdateLaunchBtn();
}

function _gpUpdateLaunchBtn() {
  const btn = document.getElementById('ecx-launch');
  if (!btn) return;
  const txt = document.getElementById('ecx-launch-txt');
  const customReady = _gpCustomQuestions && _gpCustomQuestions.length && !_gpSelectedDataset && _gpExtraDatasets.length === 0;
  const ready = _ecmIsReady();
  btn.disabled = !ready;
  let label;
  if (customReady) {
    label = _ecmT('Εκκίνηση με ' + _gpCustomQuestions.length + ' ερωτήσεις',
                  'Launch with ' + _gpCustomQuestions.length + ' questions');
  } else if (!_gpSelectedDataset && _gpExtraDatasets.length === 0) {
    label = _ecmT('Διάλεξε ύλη','Choose content');
  } else if (!ready) {
    label = _ecmT('Διάλεξε επίπεδο','Choose a level');
  } else if (_gpExtraDatasets.length > 0) {
    label = _ecmT('Εκκίνηση μεικτής ύλης','Launch mixed');
  } else {
    label = _ecmT('Εκκίνηση','Launch');
  }
  if (txt) txt.textContent = label;
}

function _gpDoLaunch() {
  if (_gpCustomQuestions && _gpCustomQuestions.length && !_gpSelectedDataset && _gpExtraDatasets.length === 0) { ecmLaunchCustom(); return; }
  ecmLaunchImport();
}

function _ecmScrollTo(id) {
  const el = document.getElementById(id);
  const c  = document.getElementById('ecx-content');
  if (el && c) { try { c.scrollTo({ top: el.offsetTop - 8, behavior:'smooth' }); } catch (_) { c.scrollTop = el.offsetTop - 8; } }
}

// ── STEP 1b: "Δικό μου" upload / AI box (Pro teachers only) ───
// Hosts the (unchanged) ecmUploadTab / ecmHandleFileUpload / ecmGenerateWithAI
// / ecmUseCustomQuestions functions — only the surrounding markup moved here.
function _gpRenderUploadBox() {
  const sec = document.getElementById('sec-upload');
  if (!sec) return;
  if (!_gpCanUseUpload()) { sec.innerHTML = ''; sec.style.display = 'none'; return; }
  sec.style.display = '';
  const savedKey = (typeof localStorage !== 'undefined' && localStorage.getItem('_paideia_ak')) || '';
  sec.innerHTML =
    '<div class="ecx-ds-cat">' + _ecmT('Δικό μου','My content') + '</div>' +
    '<div class="ecx-upload">' +
      '<div class="ecx-utabs">' +
        '<button type="button" class="ecx-utab ecm-upload-tab--active" id="ecm-utab-file" onclick="ecmUploadTab(\'file\')">' + _ecmT('Αρχείο','File') + '</button>' +
        '<button type="button" class="ecx-utab" id="ecm-utab-ai" onclick="ecmUploadTab(\'ai\')">AI</button>' +
      '</div>' +
      '<div id="ecm-upanel-file">' +
        '<div class="ecx-up-row">' +
          '<input type="file" id="ecm-file-input" accept=".json,.csv,.txt" onchange="ecmHandleFileUpload(this)">' +
          '<span class="ecx-up-status" id="ecm-file-status"></span>' +
        '</div>' +
        '<div class="ecx-up-row"><a href="#" onclick="ecmToggleFmtHint();return false;" style="color:var(--gold);font-size:.85rem;">' + _ecmT('Μορφή αρχείου;','File format?') + '</a></div>' +
        '<pre id="ecm-fmt-hint" style="display:none;">JSON: [{"q":"…","opts":["σωστό","λ1","λ2","λ3"],"ans":0}]\nCSV: Ερώτηση,Σωστό,Λάθος1,Λάθος2,Λάθος3\nTXT: Q: … / A: … / W: …</pre>' +
      '</div>' +
      '<div id="ecm-upanel-ai" style="display:none;">' +
        '<div class="ecx-up-row"><input type="password" id="ecm-ai-key" placeholder="sk-ant-… (Anthropic API key)" value="' + _ecmEsc(savedKey) + '" style="flex:1;min-width:200px;">' +
          '<button type="button" class="ecx-mini-btn" onclick="ecmSaveApiKey()">' + _ecmT('Αποθήκευση','Save') + '</button></div>' +
        '<textarea id="ecm-ai-text" rows="4" placeholder="' + _ecmT('Επικόλλησε κείμενο…','Paste text…') + '"></textarea>' +
        '<div class="ecx-up-row"><label style="color:var(--dim);font-size:.85rem;">' + _ecmT('Πλήθος','Count') + '</label>' +
          '<input type="number" id="ecm-ai-count" value="10" min="3" max="30" style="width:80px;">' +
          '<button type="button" class="ecx-mini-btn" id="ecm-ai-gen-btn" onclick="ecmGenerateWithAI()">' + _ecmT('Δημιουργία','Generate') + '</button></div>' +
        '<span class="ecx-up-status" id="ecm-ai-status"></span>' +
      '</div>' +
      '<div id="ecm-upload-preview" style="display:none;">' +
        '<div class="ecx-up-row"><span id="ecm-preview-count" style="color:var(--gold-hi);"></span>' +
          '<button type="button" class="ecx-mini-btn" id="ecm-use-questions-btn" onclick="ecmUseCustomQuestions()">' + _ecmT('✓ Χρήση αυτών των ερωτήσεων','✓ Use these questions') + '</button></div>' +
      '</div>' +
    '</div>';
  if (typeof ecmUploadTab === 'function') ecmUploadTab('file');
}

// ── LAUNCH: Creator Mode ─────────────────────────────────────
function ecmLaunchCreator() {
  if (!_gpIsProTeacher() || !_gpCurrentEngine) return;
  closeEngineConfigurator();
  closeGamesPanel();
  if (typeof navToTeacher === 'function') navToTeacher();
  setTimeout(() => {
    if (typeof window._teacherPreSelectEngine === 'function') {
      window._teacherPreSelectEngine(_gpCurrentEngine.id);
    }
  }, 280);
}

// ── LAUNCH: Import Content Mode ──────────────────────────────
async function ecmLaunchImport() {
  if (!_gpCurrentEngine) return;
  if (!_gpSelectedDataset && _gpExtraDatasets.length === 0) return;

  const engineId = _gpCurrentEngine.id;
  const hasExtras = _gpExtraDatasets.length > 0;

  // ── resolve primary dataset opts ──────────────────────────
  let primaryDsId = _gpSelectedDataset;
  let levelIds = null, levelId = null;
  if (primaryDsId) {
    const ds = GP_CONTENT.find(primaryDsId);
    const leveled = _gpHasLevels(ds);
    if (leveled && !_gpLevelsAll && _gpSelectedLevels.length === 0) return; // level required
    levelIds = leveled ? (_gpLevelsAll ? 'ALL' : _gpSelectedLevels.slice().sort((a, b) => a - b)) : null;
    levelId  = Array.isArray(levelIds) ? (levelIds[0] != null ? levelIds[0] : null) : null;
  }

  if (!hasExtras) {
    // ── original single-dataset path ──────────────────────
    const modeCfg = {
      pvp: _gpPvpMode, lang: siteLang,
      levelId, levelIds,
      playerCount: _gpPlayerCount, joinMethod: _gpJoinMethod,
      seed: _gpChallengeSeed || null,
    };
    closeEngineConfigurator();
    closeGamesPanel();
    try {
      await initGameWithData(engineId, primaryDsId, modeCfg);
    } catch (err) {
      console.error('[GP] Launch failed:', err);
      showToast('Σφάλμα εκκίνησης παιχνιδιού.', 'Failed to launch game.');
    }
    return;
  }

  // ── mixed path: load & merge all selected datasets ────────
  let allQuestions = [];
  const labelParts = [];

  if (primaryDsId) {
    const r = await gpLoadQuestions(primaryDsId, { levelId, levelIds });
    if (r.denied) {
      showToast('Απαιτείται Pro συνδρομή για αυτή την ύλη.', 'Pro subscription required for this content.');
      return;
    }
    allQuestions = allQuestions.concat(r.questions || []);
    const pds = GP_CONTENT.find(primaryDsId);
    if (pds) labelParts.push(pds.label);
  }

  for (const entry of _gpExtraDatasets) {
    const xLevelIds = (!entry.all && entry.levels.length) ? entry.levels.slice() : null;
    const r = await gpLoadQuestions(entry.id, xLevelIds ? { levelIds: xLevelIds } : {});
    if (!r.denied) allQuestions = allQuestions.concat(r.questions || []);
    const xds = GP_CONTENT.find(entry.id);
    if (xds) {
      const lvNote = (!entry.all && entry.levels.length) ? ' (' + entry.levels.length + ' ' + _ecmT('επ.','lv.') + ')' : '';
      labelParts.push(xds.label + lvNote);
    }
  }

  if (allQuestions.length === 0) {
    showToast('Δεν βρέθηκαν ερωτήσεις σε αυτή την ύλη.', 'No questions found in this dataset.');
    return;
  }

  // shuffle merged pool
  for (let i = allQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = allQuestions[i]; allQuestions[i] = allQuestions[j]; allQuestions[j] = tmp;
  }

  const modeCfg = {
    pvp: _gpPvpMode, lang: siteLang,
    levelId, levelIds,
    playerCount: _gpPlayerCount, joinMethod: _gpJoinMethod,
    seed: _gpChallengeSeed || null,
    preloadedQuestions: allQuestions,
    mixedLabel: labelParts.join(' + '),
  };

  closeEngineConfigurator();
  closeGamesPanel();
  try {
    await initGameWithData(engineId, primaryDsId || _gpExtraDatasets[0].id, modeCfg);
  } catch (err) {
    console.error('[GP] Mixed launch failed:', err);
    showToast('Σφάλμα εκκίνησης παιχνιδιού.', 'Failed to launch game.');
  }
}

// ── BOX C: FILE UPLOAD / AI GENERATE  ───────────────────────
// Holds parsed questions until teacher clicks "Use these questions"
let _gpCustomQuestions = null;

// Show/hide Box C on teacher login
function _gpUpdateUploadBox() {
  const box = document.getElementById('ecm-box-upload');
  if (box) box.style.display = _gpCanUseUpload() ? '' : 'none';
}

// Tab switcher (File | AI)
function ecmUploadTab(tab) {
  document.getElementById('ecm-upanel-file').style.display = tab === 'file' ? '' : 'none';
  document.getElementById('ecm-upanel-ai').style.display   = tab === 'ai'   ? '' : 'none';
  document.getElementById('ecm-utab-file').classList.toggle('ecm-upload-tab--active', tab === 'file');
  document.getElementById('ecm-utab-ai').classList.toggle('ecm-upload-tab--active',   tab === 'ai');
}

// Show/hide the format hint code block
function ecmToggleFmtHint() {
  const h = document.getElementById('ecm-fmt-hint');
  if (h) h.style.display = h.style.display === 'none' ? '' : 'none';
}

// ── Parse an uploaded file and store questions in _gpCustomQuestions ──
function ecmHandleFileUpload(input) {
  const file = input?.files?.[0];
  if (!file) return;
  const statusEl  = document.getElementById('ecm-file-status');
  const previewEl = document.getElementById('ecm-upload-preview');
  if (statusEl) statusEl.textContent = '…';

  const reader = new FileReader();
  reader.onload = e => {
    try {
      const text = e.target.result;
      let qs = null;

      if (file.name.endsWith('.json')) {
        qs = _ecmParseJSON(text);
      } else if (file.name.endsWith('.csv')) {
        qs = _ecmParseCSV(text);
      } else {
        qs = _ecmParseTXT(text);
      }

      if (!qs || qs.length === 0) throw new Error('no questions found');

      _gpCustomQuestions = qs;
      _ecmShowUploadPreview(qs.length);
      if (statusEl) {
        statusEl.style.color = 'var(--tint, #C4A448)';
        statusEl.textContent =
          (siteLang === 'en' ? '✓ Loaded ' : '✓ Φορτώθηκαν ') + qs.length +
          (siteLang === 'en' ? ' questions' : ' ερωτήσεις');
      }
    } catch (err) {
      _gpCustomQuestions = null;
      if (previewEl) previewEl.style.display = 'none';
      if (statusEl) {
        statusEl.style.color = '#e55';
        statusEl.textContent = siteLang === 'en'
          ? '✗ Could not parse file. Check the format.'
          : '✗ Αδύνατη ανάγνωση αρχείου. Ελέγξτε τη μορφή.';
      }
    }
  };
  reader.readAsText(file, 'UTF-8');
}

// JSON: [{q, opts:[…], ans:0}, …]  or  [{q, a, options:[…]}, …]
function _ecmParseJSON(text) {
  const arr = JSON.parse(text);
  if (!Array.isArray(arr)) throw new Error('expected array');
  return arr.map((item, i) => {
    const q = item.q || item.question || item.front;
    if (!q) throw new Error(`no question text at index ${i}`);
    // Format-J: {opts, ans}
    if (Array.isArray(item.opts) && typeof item.ans === 'number') {
      return { q, opts: item.opts, ans: item.ans };
    }
    // Format-L: {a/correct/answer, options/choices}
    const correct = item.a || item.correct || item.answer || item.back || '';
    const distractors = (item.options || item.choices || []).filter(o => o !== correct);
    const opts = [correct, ...distractors].slice(0, 4);
    return { q, opts, ans: 0 };
  });
}

// CSV: Question,CorrectAnswer,Wrong1,Wrong2,Wrong3  (header row skipped)
function _ecmParseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  // Skip header if first cell looks like a label
  const start = /^(question|q|ερώτηση)/i.test(lines[0]) ? 1 : 0;
  return lines.slice(start).map(line => {
    const cols = line.split(',').map(c => c.trim().replace(/^"|"$/g, ''));
    const q    = cols[0];
    const opts = cols.slice(1, 5).filter(Boolean);
    if (!q || opts.length < 2) return null;
    return { q, opts, ans: 0 };
  }).filter(Boolean);
}

// TXT: Q: … / A: … / W: … blocks separated by blank lines
function _ecmParseTXT(text) {
  const blocks = text.split(/\n{2,}/);
  return blocks.map(block => {
    const lines = block.split(/\n/).map(l => l.trim()).filter(Boolean);
    let q = '', ans = '', wrong = [];
    lines.forEach(l => {
      if (/^Q:/i.test(l)) q = l.replace(/^Q:\s*/i, '');
      else if (/^A:/i.test(l)) ans = l.replace(/^A:\s*/i, '');
      else if (/^W:/i.test(l)) wrong.push(l.replace(/^W:\s*/i, ''));
    });
    if (!q || !ans) return null;
    const opts = [ans, ...wrong].slice(0, 4);
    return { q, opts, ans: 0 };
  }).filter(Boolean);
}

function _ecmShowUploadPreview(count) {
  const preview = document.getElementById('ecm-upload-preview');
  const countEl = document.getElementById('ecm-preview-count');
  if (!preview) return;
  if (countEl) countEl.textContent = siteLang === 'en'
    ? `${count} questions ready`
    : `${count} ερωτήσεις έτοιμες`;
  preview.style.display = '';
  if (typeof _ecmRefresh === 'function') _ecmRefresh(); else _gpUpdateLaunchBtn();
}

// ── AI generation via Anthropic API ────────────────────────
function ecmSaveApiKey() {
  const val = document.getElementById('ecm-ai-key')?.value?.trim();
  if (val) {
    localStorage.setItem('_paideia_ak', val);
    showToast('Κλειδί αποθηκεύτηκε.', 'API key saved.');
  }
}

async function ecmGenerateWithAI() {
  const apiKey = localStorage.getItem('_paideia_ak') || '';
  if (!apiKey.startsWith('sk-ant-')) {
    const statusEl = document.getElementById('ecm-ai-status');
    if (statusEl) {
      statusEl.style.color = '#e55';
      statusEl.textContent = siteLang === 'en'
        ? '✗ Enter a valid Anthropic API key above (starts with sk-ant-).'
        : '✗ Εισάγετε έγκυρο Anthropic API key παραπάνω (ξεκινά με sk-ant-).';
    }
    return;
  }

  const text  = (document.getElementById('ecm-ai-text')?.value || '').trim();
  const count = parseInt(document.getElementById('ecm-ai-count')?.value || '10', 10);
  if (text.length < 30) {
    const statusEl = document.getElementById('ecm-ai-status');
    if (statusEl) {
      statusEl.style.color = '#e55';
      statusEl.textContent = siteLang === 'en'
        ? '✗ Please paste at least a paragraph of text.'
        : '✗ Επικολλήστε τουλάχιστον μία παράγραφο κειμένου.';
    }
    return;
  }

  const genBtn   = document.getElementById('ecm-ai-gen-btn');
  const statusEl = document.getElementById('ecm-ai-status');
  if (genBtn)   { genBtn.disabled = true; genBtn.textContent = '⏳'; }
  if (statusEl) { statusEl.style.color = ''; statusEl.textContent = siteLang === 'en' ? 'Generating…' : 'Δημιουργία…'; }

  const lang = siteLang === 'en' ? 'English' : 'Greek';
  const prompt = `You are a quiz question generator for a school app.

Generate exactly ${count} multiple-choice questions in ${lang} based on the following text.

Return ONLY a valid JSON array (no explanation, no markdown, no code fences) in this format:
[{"q":"Question text?","opts":["Correct answer","Wrong 1","Wrong 2","Wrong 3"],"ans":0}]

Rules:
- "ans" is always 0 (the correct answer is always the first item in "opts")
- Each question must have exactly 4 options
- Questions must be factual and directly based on the provided text
- Keep questions clear and concise

Text to use:
${text.slice(0, 4000)}`;

  try {
    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':                            apiKey,
        'anthropic-version':                    '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
        'content-type':                         'application/json',
      },
      body: JSON.stringify({
        model:      'claude-haiku-4-5',
        max_tokens: 2000,
        messages:   [{ role: 'user', content: prompt }],
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.json().catch(() => ({}));
      throw new Error(errBody?.error?.message || `HTTP ${resp.status}`);
    }

    const data = await resp.json();
    const raw  = data?.content?.[0]?.text || '';
    // Strip any accidental markdown fences
    const jsonStr = raw.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    const qs = JSON.parse(jsonStr);
    if (!Array.isArray(qs) || qs.length === 0) throw new Error('empty result');

    _gpCustomQuestions = qs;
    _ecmShowUploadPreview(qs.length);
    if (statusEl) {
      statusEl.style.color = 'var(--tint, #C4A448)';
      statusEl.textContent = (siteLang === 'en' ? '✓ ' : '✓ ') + qs.length +
        (siteLang === 'en' ? ' questions generated' : ' ερωτήσεις δημιουργήθηκαν');
    }
  } catch (err) {
    if (statusEl) {
      statusEl.style.color = '#e55';
      statusEl.textContent = (siteLang === 'en' ? '✗ Error: ' : '✗ Σφάλμα: ') + err.message;
    }
  } finally {
    if (genBtn) { genBtn.disabled = false; genBtn.textContent = siteLang === 'en' ? '🤖 Generate' : '🤖 Δημιουργία'; }
  }
}

// Mark custom questions as chosen and update the launch button
function ecmUseCustomQuestions() {
  if (!_gpCustomQuestions?.length) return;
  // Hide the Box B dataset selection to avoid confusion
  const useBtn = document.getElementById('ecm-use-questions-btn');
  if (useBtn) {
    useBtn.textContent = siteLang === 'en' ? '✓ Selected' : '✓ Επιλέχτηκαν';
    useBtn.disabled = true;
  }
  // Deselect any chosen dataset so the launch button routes to the custom launch
  _gpSelectedDataset = null;
  _gpExtraDatasets   = [];
  _gpExtraOpenId     = null;
  _gpSelectedLevels  = [];
  _gpLevelsAll       = false;
  _gpSelectedLevel   = null;
  if (typeof _renderDatasetList === 'function') _renderDatasetList();
  if (typeof _gpRenderLevelPicker === 'function') _gpRenderLevelPicker(null);
  if (typeof _ecmRefresh === 'function') _ecmRefresh(); else _gpUpdateLaunchBtn();
}

// ── LAUNCH: Custom questions from file or AI ────────────────
async function ecmLaunchCustom() {
  if (!_gpCurrentEngine || !_gpCustomQuestions?.length) return;
  const eng = _gpCurrentEngine;

  const questions = _gpCustomQuestions.map(item => {
    // Normalise to standard { q, a, options } format
    const q   = item.q || item.question || '';
    const opts = item.opts || item.options || [];
    const ans  = typeof item.ans === 'number' ? item.ans : 0;
    const a    = opts[ans] || '';
    const distractors = opts.filter((_, i) => i !== ans);
    return { q, a, options: [a, ...distractors].slice(0, 4) };
  }).filter(item => item.q && item.a);

  if (questions.length === 0) {
    showToast('Δεν βρέθηκαν έγκυρες ερωτήσεις.', 'No valid questions found.');
    return;
  }

  const cfg = {
    engineId:     eng.id,
    datasetId:    'custom-upload',
    datasetLabel: siteLang === 'en' ? 'Uploaded Questions' : 'Ανεβασμένες Ερωτήσεις',
    levelId:      null,
    G:            questions,
    mode:         _gpPvpMode ? 'pvp' : 'solo',
    pvp:          Boolean(_gpPvpMode),
    lang:         siteLang,
    title:        `${eng.label} — ${siteLang === 'en' ? 'Custom' : 'Προσαρμοσμένο'}`,
    subtitle:     `${questions.length} ${siteLang === 'en' ? 'questions' : 'ερωτήσεις'}`,
  };

  // Apply engine-specific settings (same logic as initGameWithData)
  switch (eng.id) {
    case 'naumachia': cfg.boardSize = 10; cfg.questionsPerHit = 1; break;
    case 'invaders':  cfg.waves = Math.min(6, Math.ceil(questions.length / 5)); cfg.lives = 3; break;
    case 'rapid-fire': cfg.timeLimit = 12; cfg.lives = 3; cfg.combo = true; break;
    case 'myth-memory': cfg.pairs = Math.min(18, Math.floor(questions.length / 2)); break;
    case 'tow': cfg.ropeLength = 7; break;
    case 'labyrinth': cfg.gridSize = questions.length >= 20 ? 'large' : 'medium'; break;
    case 'phalanx': cfg.rows = 3; cfg.cols = 5; break;
    case 'epic-puzzle': cfg.rounds = Math.min(5, Math.ceil(questions.length / 4)); break;
    case 'dig': cfg.depth = Math.min(6, Math.ceil(questions.length / 3)); break;
  }

  window._gpPendingConfig = cfg;
  history.pushState({ _gpGame: true, engineId: eng.id, datasetId: 'custom-upload' }, '');

  // Close panels BEFORE opening the game so body.overflow is clean
  closeEngineConfigurator();
  closeGamesPanel();
  _gpCustomQuestions = null;

  if (typeof _gpInjectEngineData === 'function') _gpInjectEngineData(eng.id, cfg);
  eng.opener(cfg);
  if (typeof _gpPostLaunch === 'function') _gpPostLaunch(eng.id, cfg);
}

// ============================================================
//  initGameWithData(engineId, datasetId, modeConfig)
//  ────────────────────────────────────────────────────────────
//  Central router adapter decoupling game engines from data.
//
//  Workflow:
//    1. Resolve engine descriptor from GP_ENGINES
//    2. Resolve dataset descriptor from GP_DATASETS
//    3. Gate on subscription tier
//    4. Load questions (window scope → Firestore fallback)
//    5. Normalize questions to { q, a, options?, hint? }
//    6. Build engine cfg object (cfg.G, cfg.mode, cfg.pvp, …)
//    7. Push browser history entry (Back closes the overlay)
//    8. Call engine.opener(cfg) — launches the game
//
//  @param {string} engineId   — one of GP_ENGINES[].id
//  @param {string} datasetId  — one of GP_DATASETS[].id
//  @param {object} modeConfig — { pvp?: bool, lang?: 'gr'|'en' }
//  @returns {Promise<void>}
// ============================================================
// ════════════════════════════════════════════════════════════
//  SHARED DATASET LOADER — single source of truth
//  Both the Games Panel (initGameWithData) and the Καταιγισμός in-game
//  lobby (storm-content.loadPool) resolve content through gpLoadQuestions(),
//  so tier-gating, sync→Firestore loading, per-level filtering, and
//  dataset-aware normalization behave identically everywhere — no drift.
// ════════════════════════════════════════════════════════════

// Session cache for Firestore-fetched question sets (datasetId → questions[]).
const _gpFsCache = {};
async function _gpFetchFirestore(datasetId) {
  if (_gpFsCache[datasetId]) return _gpFsCache[datasetId];
  try {
    const snap = await firebase.firestore().collection('game_data').doc(datasetId).get();
    if (snap.exists) {
      const d = snap.data() || {};
      const q = d.questions || d.items || d.data || [];
      _gpFsCache[datasetId] = q;
      return q;
    }
  } catch (e) {
    console.warn(`[GP] Firestore fetch failed for "${datasetId}":`, e);
  }
  return null;
}

// Resolve a dataset's level object by id. Level globals (OUS_LEVELS, …) are
// top-level `const` on the live site — not window props — so try window then
// indirect eval (which can see const/let globals).
function _gpResolveLevel(ds, levelId) {
  if (levelId == null || !ds || !ds.leveled || !ds.levelsGlobal) return null;
  let arr = null;
  try { if (typeof window[ds.levelsGlobal] !== 'undefined') arr = window[ds.levelsGlobal]; } catch (e) {}
  if (!arr) { try { const v = (0, eval)(ds.levelsGlobal); if (typeof v !== 'undefined') arr = v; } catch (e) {} }
  if (!Array.isArray(arr)) return null;
  return arr.find(l => String(l.id) === String(levelId)) || null;
}

// datasetId (+ optional levelId) → { questions:[{q,a,options}], denied?, error? }.
// Gated → sync loader → Firestore fallback (cached) → per-level filter → normalized.
async function gpLoadQuestions(datasetId, opts = {}) {
  const ds = GP_DATASETS.find(d => d.id === datasetId);
  if (!ds) return { questions: [], error: 'unknown-dataset' };
  if (!_gpCanAccessTier(ds.tier)) return { questions: [], denied: true };

  const levelId  = (opts.levelId != null) ? opts.levelId : null;
  // Multi-select level ids (gp-levels.js). 'ALL' / non-array → whole module.
  const levelIds = Array.isArray(opts.levelIds) ? opts.levelIds : null;

  // load: synchronous window-scope loader first, Firestore fallback if empty
  let raw = null;
  if (typeof ds.loader === 'function') { try { raw = ds.loader(levelId); } catch (_) { raw = null; } }
  if (!raw || (Array.isArray(raw) && raw.length === 0)) raw = await _gpFetchFirestore(datasetId);

  // ── Multi-select level union (gp-levels.js GP_LEVEL_PROVIDERS) ──
  // Applied on RAW data BEFORE normalization. Generator-leveled modules (lyo)
  // build the union by calling the generator per id; filter-leveled modules
  // subset the raw DB (dict → dict, array → array). Missing provider / empty
  // selection → fall through to today's single-level behavior (no regression).
  let _multiApplied = false;
  const _prov = (typeof GP_LEVEL_PROVIDERS !== 'undefined') ? GP_LEVEL_PROVIDERS[datasetId] : null;
  if (_prov && levelIds && levelIds.length) {
    if (typeof _prov.generator === 'function') {
      const merged = [];
      levelIds.forEach(id => { const qs = _prov.generator(id); if (Array.isArray(qs)) merged.push(...qs); });
      if (merged.length) { raw = merged; _multiApplied = true; }
    } else if (typeof _prov.filterRaw === 'function' && raw) {
      try {
        const f = _prov.filterRaw(raw, levelIds);
        if (f && (Array.isArray(f) ? f.length : Object.keys(f).length)) { raw = f; _multiApplied = true; }
      } catch (e) { console.warn('[GP] level filter failed:', e); }
    }
  }

  // per-level filter for sub/filter datasets (loader-leveled ones already filtered
  // inside their loader; RF_LEVEL_FILTER is a no-op for those). Skipped when the
  // multi-select union above already produced the bank.
  const levelObj = _gpResolveLevel(ds, levelId);
  if (!_multiApplied && raw && levelObj && typeof window.RF_LEVEL_FILTER === 'function') {
    try { const f = window.RF_LEVEL_FILTER(raw, levelObj, ds); if (f) raw = f; } catch (e) {}
  }

  const questions = (raw && typeof _gpNormalizeQuestions === 'function')
    ? _gpNormalizeQuestions(raw, datasetId) : (raw || []);
  return { questions, ds };
}

async function initGameWithData(engineId, datasetId, modeConfig = {}) {

  // ── 1. Resolve engine ────────────────────────────────────
  const engine = GP_ENGINES.find(e => e.id === engineId);
  if (!engine) {
    throw new Error(`[GP] Unknown engine id: "${engineId}"`);
  }

  // ── 2. Resolve dataset ───────────────────────────────────
  const dataset = GP_DATASETS.find(d => d.id === datasetId);
  if (!dataset) {
    throw new Error(`[GP] Unknown dataset id: "${datasetId}"`);
  }

  // ── 3-5. Gate + load + normalize (via the shared authority) ──
  //  gpLoadQuestions() handles the subscription gate, the sync→Firestore load
  //  (with session cache), per-level filtering, and dataset-aware normalization —
  //  the exact same path the Καταιγισμός lobby uses, so the two never diverge.
  const _levelId = modeConfig.levelId || null;
  // When a pre-merged question pool is supplied (mixed-dataset launch) we skip
  // loading entirely and use it directly.
  let questions;
  if (modeConfig.preloadedQuestions && modeConfig.preloadedQuestions.length) {
    questions = modeConfig.preloadedQuestions;
  } else {
    const _loaded  = await gpLoadQuestions(datasetId, { levelId: _levelId, levelIds: modeConfig.levelIds });
    if (_loaded.denied) {
      showToast(
        'Απαιτείται Pro συνδρομή για αυτή την ύλη.',
        'Pro subscription required for this content.'
      );
      if (typeof navToSubscribe === 'function') navToSubscribe();
      throw new Error(`[GP] Access denied — dataset "${datasetId}" requires tier "${dataset.tier}"`);
    }
    questions = _loaded.questions || [];
    if (questions.length === 0) {
      showToast('Δεν βρέθηκαν ερωτήσεις σε αυτή την ύλη.', 'No questions found in this dataset.');
      throw new Error(`[GP] No questions resolved for dataset "${datasetId}"`);
    }
  }

  // ── 6. Build engine cfg ──────────────────────────────────
  const _lyoLvlObj = (_levelId && typeof LYO_LVL !== 'undefined')
    ? LYO_LVL.find(l => l.id === +_levelId) : null;
  const _levelLabel = _lyoLvlObj ? ` · Επ. ${_levelId}` : '';
  const cfg = {
    // Identification
    engineId,
    datasetId,
    datasetLabel: modeConfig.mixedLabel || dataset.label,
    levelId: _levelId,

    // Normalized question bank — the universal key all engines should read
    G:    questions,

    // Playback mode
    mode: modeConfig.pvp ? 'pvp' : 'solo',
    pvp:  Boolean(modeConfig.pvp),
    lang: modeConfig.lang || siteLang,

    // Human-readable labels for overlays
    title:    `${engine.label} — ${modeConfig.mixedLabel || dataset.label}${_levelLabel}`,
    subtitle: _lyoLvlObj ? _lyoLvlObj.desc : (modeConfig.mixedLabel ? null : dataset.meta),
  };

  // Engine-specific extra fields mapped onto cfg
  switch (engineId) {
    case 'naumachia':
      cfg.boardSize        = 10;
      cfg.questionsPerHit  = 1;
      break;
    case 'invaders':
      cfg.waves = Math.min(6, Math.ceil(questions.length / 5));
      cfg.lives = 3;
      break;
    case 'rapid-fire':
      cfg.timeLimit = 12;  // seconds per question
      cfg.lives     = 3;
      cfg.combo     = true;
      break;
    case 'myth-memory':
      cfg.pairs = Math.min(18, Math.floor(questions.length / 2));
      break;
    case 'tow':
      cfg.ropeLength = 7;
      break;
    case 'labyrinth':
      cfg.gridSize = questions.length >= 20 ? 'large' : 'medium';
      break;
    case 'phalanx':
      cfg.rows = 3;
      cfg.cols = 5;
      break;
    case 'epic-puzzle':
      cfg.rounds = Math.min(5, Math.ceil(questions.length / 4));
      break;
    case 'dig':
      cfg.depth = Math.min(6, Math.ceil(questions.length / 3));
      break;
  }

  // Store on window so engines that don't yet accept a parameter can still read it
  window._gpPendingConfig = cfg;

  // ── 7. Push history entry ────────────────────────────────
  // The Back button will fire popstate → the existing overlay close map
  // catches the specific engine overlay and closes it cleanly.
  history.pushState({ _gpGame: true, engineId, datasetId }, '');

  // ── 8. Launch ────────────────────────────────────────────
  if (typeof engine.opener === 'function') {
    _gpInjectEngineData(engineId, cfg);   // inject GP data BEFORE opener
    engine.opener(cfg);
    _gpPostLaunch(engineId, cfg);         // auto-start AFTER opener (RF only)
  } else {
    throw new Error(`[GP] No opener defined for engine "${engineId}"`);
  }

  // ── 9. QR share — show join QR when host selected "Μοιράσου · QR" ──
  if (modeConfig.joinMethod === 'qr' && typeof showQR === 'function') {
    const _joinURL = { nav: 'engine', engine: engineId, dataset: datasetId };
    if (modeConfig.levelId != null) _joinURL.level = modeConfig.levelId;
    setTimeout(() => showQR(cfg.title, _joinURL), 400);
  }
}

// ── LIVE ARENA REDIRECT ──────────────────────────────────────
/**
 * Convert GP questions to Live Arena format and launch a host session.
 * Called when VS mode is selected for engines that redirect to Live Arena.
 */
function _gpLaunchLiveArena(cfg) {
  const lang = (typeof siteLang !== 'undefined' && siteLang === 'en') ? 'en' : 'gr';
  const questions = (cfg.G || []).map(item => ({
    q:    (item.q && typeof item.q === 'object') ? (item.q[lang] || item.q.gr || '') : String(item.q || ''),
    opts: item.a || [],
    ans:  typeof item.c === 'number' ? item.c : 0,
  })).filter(q => q.q && q.opts.length === 4);
  const gameName = cfg.datasetLabel || cfg.title || 'Live Arena';
  if (typeof LiveArena !== 'undefined') {
    if (questions.length) {
      LiveArena.launchHost({ questions, gameName });
    } else {
      LiveArena.launchPicker();
    }
  }
}

// ── GP ENGINE BRIDGE HELPERS ─────────────────────────────────
/**
 * Convert GP normalized questions → MC format used by Labyrinth / Phalanx / Rapid-Fire.
 * Returns: [{q:{gr,en}, a:[4 strings], c:idx, correct:idx}]
 *
 * Distractor strategy: prefer answers from the same paradigm group (same verb / noun / lemma)
 * so the wrong options are other forms of the same word — much more pedagogically useful
 * than pulling from an unrelated random pool.
 */
function _gpToMcItems(questions) {
  if (!Array.isArray(questions) || questions.length === 0) return [];

  // ── 1. Build per-lemma answer pools ──────────────────────────
  // Group key = text before the first "—", "·", ":", or newline in the question.
  // For grammar datasets this extracts the lemma (λύω, ὁ λόγος, …).
  // For trivia questions the whole first sentence acts as the group key.
  const _lemmaOf = q => {
    if (!q) return '__misc__';
    const m = String(q).match(/^([^—·:\n]+)/u);
    return m ? m[1].trim() : String(q).slice(0, 40).trim();
  };

  const lemmaPools = {};            // lemma → Set of answers
  questions.forEach(item => {
    if (!item.a) return;
    const lk = _lemmaOf(item.q);
    if (!lemmaPools[lk]) lemmaPools[lk] = new Set();
    lemmaPools[lk].add(item.a);
  });

  // Fallback global pool for when a lemma group has < 3 distinct answers
  const allAnswers = [...new Set(questions.map(x => x.a).filter(Boolean))];

  const _rnd = arr => [...arr].sort(() => Math.random() - 0.5);

  return questions.map(item => {
    // ── Pre-existing 4-option choices take priority ───────────
    if (Array.isArray(item.options) && item.options.length >= 4) {
      const opts = item.options.slice(0, 4);
      let ci = opts.indexOf(item.a);
      if (ci < 0) { opts[0] = item.a; ci = 0; } // ensure correct answer is present
      return { q: { gr: item.q, en: item.hint || item.q }, a: opts,
               c: ci, correct: ci };
    }

    // ── Lemma-first distractor selection ─────────────────────
    const lk        = _lemmaOf(item.q);
    // Same-lemma answers (minus the correct one)
    const sameGroup = _rnd([...(lemmaPools[lk] || [])].filter(a => a !== item.a));
    // Global fallback (answers not already in sameGroup and not correct)
    const globalRem = _rnd(allAnswers.filter(a => a !== item.a && !sameGroup.includes(a)));

    // Fill up to 3 distractors: same-group first, then global
    const distractors = [...sameGroup, ...globalRem].slice(0, 3);
    while (distractors.length < 3) distractors.push('—');

    const shuffled = _rnd([item.a, ...distractors]);
    const ci = shuffled.indexOf(item.a);
    return { q: { gr: item.q, en: item.hint || item.q }, a: shuffled,
             c: ci, correct: ci };
  });
}

/**
 * Convert GP normalized questions → Naumachia format.
 * Returns: [{q:string, opts:[4 strings], ans:number}]
 */
function _gpToNauItems(questions) {
  return _gpToMcItems(questions).map(item => ({
    q:    item.q.gr,
    opts: item.a,
    ans:  item.c,
  }));
}

/**
 * Pre-launch: inject GP questions into the target engine's native data store.
 * Registers an on-close restore hook so original data is recovered when the
 * player exits the game.
 */
function _gpInjectEngineData(engineId, cfg) {
  const Q = cfg.G;
  if (!Array.isArray(Q) || Q.length === 0) return;

  switch (engineId) {

    case 'naumachia': {
      // Inject via window globals that _nauGetQuestion reads at call time.
      // (Overriding window._nauGetQuestion doesn't work because the function is
      // in naumachia/game.js's own closure scope, not on window.)
      window._gpNauPool = _gpToNauItems(Q);
      window._gpNauIdx  = 0;
      const origClose = window.closeNaumachia;
      window.closeNaumachia = function(...args) {
        window._gpNauPool = null;
        window._gpNauIdx  = 0;
        // Only restore if origClose was captured (script was already loaded at inject time).
        // If it was undefined the game script defines closeNaumachia as a hoisted declaration
        // which re-establishes itself on the next lazy-load; don't clobber it with undefined.
        if (typeof origClose === 'function') { window.closeNaumachia = origClose; origClose(...args); }
        else { delete window.closeNaumachia; }
      };
      break;
    }

    case 'rapid-fire': {
      if (typeof RF_PACKS === 'undefined') break;
      // Push a synthetic pack into RF_PACKS then remove it on close
      const rfQuestions = _gpToMcItems(Q).map(item => ({
        q:       item.q,
        a:       item.a,
        correct: item.correct,
      }));
      const gpPack = {
        id:        '_gp',
        icon:      cfg.datasetIcon || '📚',
        name:      cfg.datasetLabel || 'GP Dataset',
        nameEn:    cfg.datasetLabel || 'GP Dataset',
        questions: rfQuestions,
      };
      RF_PACKS.push(gpPack);
      const origCloseRF = window.closeRapidFire;
      window.closeRapidFire = function(...args) {
        const idx = RF_PACKS.findIndex(p => p.id === '_gp');
        if (idx !== -1) RF_PACKS.splice(idx, 1);
        window.closeRapidFire = origCloseRF;
        if (typeof origCloseRF === 'function') origCloseRF(...args);
      };
      break;
    }

    case 'labyrinth': {
      const gpItems = _gpToMcItems(Q).map(item => ({ q: item.q, a: item.a, c: item.c }));
      if (!gpItems.length) break;
      // Pre-seed window.LB_Q whether or not labyrinth/questions.js has loaded yet.
      // questions.js checks: if LB_Q is a non-empty array it skips seeding defaults,
      // so writing here BEFORE the script loads makes the selected level questions stick.
      const snapshot = Array.isArray(window.LB_Q) ? window.LB_Q.slice() : null;
      if (Array.isArray(window.LB_Q)) {
        window.LB_Q.length = 0;
        window.LB_Q.push(...gpItems);
      } else {
        window.LB_Q = gpItems.slice();
      }
      const origCloseLabyrinth = window.closeLabyrinth;
      window.closeLabyrinth = function(...args) {
        if (snapshot !== null) {
          if (Array.isArray(window.LB_Q)) { window.LB_Q.length = 0; window.LB_Q.push(...snapshot); }
          else { window.LB_Q = snapshot.slice(); }
        } else {
          window.LB_Q = null; // let questions.js re-seed defaults on next launch
        }
        window.closeLabyrinth = origCloseLabyrinth;
        if (typeof origCloseLabyrinth === 'function') origCloseLabyrinth(...args);
      };
      break;
    }

    case 'phalanx': {
      // The Reimagined engine reads the live global window.PH_Q (no top-level
      // const anymore). It snapshots PH_Q at the start of each run, and we
      // inject here BEFORE the lazy engine loads, so ensure the array exists
      // and mutate it in place (same bridge shape as labyrinth's LB_Q).
      if (!Array.isArray(window.PH_Q)) window.PH_Q = [];
      const gpItems  = _gpToMcItems(Q).map(item => ({ q: item.q, a: item.a, c: item.c }));
      const snapshot = window.PH_Q.slice();
      window.PH_Q.length = 0;
      window.PH_Q.push(...gpItems);
      const origClosePhalanx = window.closePhalanx;
      window.closePhalanx = function(...args) {
        window.PH_Q.length = 0;
        window.PH_Q.push(...snapshot);
        window.closePhalanx = origClosePhalanx;
        if (typeof origClosePhalanx === 'function') origClosePhalanx(...args);
      };
      break;
    }

    case 'tow': {
      // Pre-convert GP questions to tow format {q, opts, ans} and store for openTow()
      window._gpTowPool = _gpToNauItems(Q);
      const origCloseTow = window.closeTow;
      window.closeTow = function(...args) {
        window._gpTowPool = null;
        window.closeTow = origCloseTow;
        if (typeof origCloseTow === 'function') origCloseTow(...args);
      };
      break;
    }

    case 'blade': {
      // Blade slices the correct grammatical form among falling tokens, so it
      // needs {prompt, correct, distract[]} — exactly _gpToMcItems shaped. The
      // pool is read by openBlade()/loadGP(); cleared on close.
      window._gpBladePool = _gpToMcItems(Q).map(it => ({
        prompt:   it.q && it.q.gr ? it.q.gr : String(it.q || ''),
        correct:  it.a[it.c],
        distract: it.a.filter((_, i) => i !== it.c),
      })).filter(r => r.prompt && r.correct);
      const origCloseBlade = window.closeBlade;
      window.closeBlade = function(...args) {
        window._gpBladePool = null;
        window.closeBlade = origCloseBlade;
        if (typeof origCloseBlade === 'function') origCloseBlade(...args);
      };
      break;
    }

    case 'invaders': {
      // Convert GP MC questions to INVADERS_DB-compatible levels (groups of 6).
      // word = correct answer (shown on enemy ship), label = question text (shoot target).
      // Store in window._gpInvadersDB so it works even when invaders/data.js is lazy-loaded.
      // game.js reads window._gpInvadersDB before INVADERS_DB when it is set.
      const gpItems = _gpToMcItems(Q);
      if (!gpItems.length) break;
      const gpDB = [];
      for (let i = 0; i < gpItems.length; i += 6) {
        const chunk = gpItems.slice(i, i + 6);
        while (chunk.length < 6) chunk.push({ ...chunk[chunk.length - 1] }); // pad with copies
        const lvlTitle = cfg.title
          ? cfg.title + (gpDB.length ? ' · ' + (gpDB.length + 1) : '')
          : 'Επίπεδο ' + (gpDB.length + 1);
        gpDB.push({
          title: lvlTitle,
          entries: chunk.map(item => ({
            word:  item.a[item.c],
            label: item.q && item.q.gr ? item.q.gr : String(item.q || ''),
          })),
        });
      }
      if (!gpDB.length) break;
      window._gpInvadersDB = gpDB;
      // Pool is cleared inside game.js closeInvaders directly — no wrapper needed.
      break;
    }

    case 'temple-run': {
      // Pre-convert GP questions to paideia format {q, opts, ans} and store on a
      // window global.  The adapter reads window._gpTrPool as a fallback when no
      // questions are passed directly (same bridge shape as naumachia/_gpNauPool).
      window._gpTrPool = _gpToNauItems(Q);
      const origCloseTR = window.closeTempleRun;
      window.closeTempleRun = function(...args) {
        window._gpTrPool = null;
        window.closeTempleRun = origCloseTR;
        if (typeof origCloseTR === 'function') origCloseTR(...args);
      };
      break;
    }

    case 'golden-fleece': {
      if (!Array.isArray(window.GF_Q)) window.GF_Q = [];
      const gpItemsGF  = _gpToMcItems(Q).map(item => ({ q: item.q, a: item.a, c: item.c }));
      const snapshotGF = window.GF_Q.slice();
      window.GF_Q.length = 0;
      window.GF_Q.push(...gpItemsGF);
      const origCloseGF = window.closeGoldenFleece;
      window.closeGoldenFleece = function(...args) {
        window.GF_Q.length = 0;
        window.GF_Q.push(...snapshotGF);
        window.closeGoldenFleece = origCloseGF;
        if (typeof origCloseGF === 'function') origCloseGF(...args);
      };
      break;
    }

    case 'halieia': {
      if (!Array.isArray(window.AL_Q)) window.AL_Q = [];
      const gpItemsAL  = _gpToMcItems(Q).map(item => ({ q: item.q, a: item.a, c: item.c }));
      const snapshotAL = window.AL_Q.slice();
      window.AL_Q.length = 0;
      window.AL_Q.push(...gpItemsAL);
      const origCloseAL = window.closeHalieia;
      window.closeHalieia = function(...args) {
        window.AL_Q.length = 0;
        window.AL_Q.push(...snapshotAL);
        window.closeHalieia = origCloseAL;
        if (typeof origCloseAL === 'function') origCloseAL(...args);
      };
      break;
    }

    default:
      break;
  }
}

/**
 * Post-launch: engines that need to skip their internal pack/menu selection
 * and auto-start with the GP pack.
 */
function _gpPostLaunch(engineId, cfg) {
  if (engineId === 'rapid-fire') {
    if (typeof RF_PACKS === 'undefined' || typeof _rf === 'undefined') return;
    // The Reimagined storm engine self-starts from cfg.G inside openRapidFire
    // (it sets _rf.source = { id:'_gp', … } and calls _rfBegin itself). Calling
    // _rfBegin again here would tear the run down and rebuild it — a visible
    // flicker plus a wasted arena+audio init. Only drive the begin for a legacy
    // engine that didn't already self-start.
    if (_rf && _rf.source && _rf.source.id === '_gp') return;
    const gpPack = RF_PACKS.find(p => p.id === '_gp');
    if (!gpPack) return;
    _rf.pack = gpPack;
    if (typeof _rfBegin === 'function') _rfBegin();
  }
}

// ── QUESTION NORMALIZER ──────────────────────────────────────
/**
 * Coerces every raw data shape used in this project into the standard
 * GP question schema: { q:string, a:string, options:string[], hint:string }
 *
 * Handled formats (detection order matters):
 *  NON-ARRAY
 *   A. Trivia lang-object  — { gr:{all:[{q,opts,ans}]}, en:{...} }  (QUESTIONS / OD_QUESTIONS)
 *   B. EIMI_PARADIGM       — { lemma, tenses:[{label, groups:[{mood, forms:[{l,f}]}]}] }
 *   C. Paradigm dict       — { key:{verb,form,voice,mood,tense,endings:[]} } (SYN_G / AOB_G / RMI_G / AFW_G)
 *   D. ANT_DB dict         — { key:{lemma, ptosi, arithmos, genos, form, alts[]} }
 *   E. Wrapper objects     — { questions:[] } | { items:[] }
 *  ARRAY
 *   F. ARV_DB              — [{id, lemma, forms:[{v,t,l,f}]}]
 *   G. KR_DB               — [{id, lemma, groups:[{label, forms:[{l,f}]}]}]
 *   H. OUS_DB / LAT_N_DB / LAT_A_DB — [{l, t?, s:[forms], p:[forms]}]
 *   I. LAT_V_DB            — [{inf, meaning, act_ind_pres:[6], …}]
 *   J. Trivia items        — [{q, opts:[4], ans:number}]
 *   K. Standard            — [{q, a, options?, hint?}]
 *   L. Question/answer     — [{question, answer|correct, options?, choices?}]
 *   M. Flashcard           — [{front, back}]
 *   N. Verb/word form      — [{verb|word, form, tense?}]
 *   O. Generic fallback    — first two string/number keys
 */
function _gpNormalizeQuestions(rawData, _datasetId) {
  if (!rawData) return [];

  // ════════════════════════════════════════════════════════
  //  NON-ARRAY BRANCH
  // ════════════════════════════════════════════════════════
  if (!Array.isArray(rawData)) {
    if (typeof rawData !== 'object') return [];

    // A. Trivia lang-object: { gr:{all:[...]}, en:{all:[...]} }
    const langData = rawData.gr || rawData.en;
    if (langData && typeof langData === 'object') {
      const allArr = langData.all;
      if (Array.isArray(allArr) && allArr.length > 0)
        return _gpNormalizeQuestions(allArr, _datasetId);
      // Fallback: flatten all rhapsody sub-arrays
      const flat = Object.values(langData).filter(Array.isArray).flat();
      if (flat.length > 0) return _gpNormalizeQuestions(flat, _datasetId);
    }

    // B. EIMI_PARADIGM: { lemma, tenses:[{label, groups:[{mood, forms:[{l,f}]}]}] }
    if (rawData.lemma !== undefined && Array.isArray(rawData.tenses)) {
      const lemma = rawData.lemma;
      return rawData.tenses.flatMap(tense =>
        (tense.groups || []).flatMap(g =>
          (g.forms || []).filter(f => f && f.f).map(f => ({
            q:       `${lemma} — ${f.l} · ${g.mood || g.label || ''} · ${tense.label || ''}`,
            a:       String(f.f),
            options: [],
            hint:    rawData.meaning || '',
          }))
        )
      ).filter(x => x.q && x.a);
    }

    const vals = Object.values(rawData);
    if (vals.length === 0) return [];
    const v0 = vals.find(Boolean);
    if (!v0 || typeof v0 !== 'object') return [];

    // C. Paradigm dict (SYN_G / AOB_G / RMI_G / AFW_G):
    //    { key: { verb, form(=person label), voice, mood, tense, endings:[] } }
    if (v0.verb !== undefined && v0.tense !== undefined && Array.isArray(v0.endings)) {
      return vals.filter(Boolean).map(item => {
        const form = Array.isArray(item.endings) && item.endings[0]
          ? String(item.endings[0]) : null;
        if (!form) return null;
        return {
          q:       `${item.verb} — ${item.form || ''} · ${item.mood || ''} · ${item.tense || ''}`,
          a:       form,
          options: item.endings.slice(0, 4).map(String),
          hint:    '',
        };
      }).filter(Boolean);
    }

    // D. ANT_DB dict: { key: { lemma, ptosi, arithmos, genos, form, alts[] } }
    if (v0.lemma !== undefined && v0.form !== undefined && v0.ptosi !== undefined) {
      return vals.filter(Boolean).map(item => ({
        q: `${item.lemma} — ${item.ptosi || ''}${item.arithmos ? ' (' + item.arithmos + ')' : ''}${item.genos ? ' ' + item.genos : ''}`,
        a:       String(item.form),
        options: Array.isArray(item.alts) ? [item.form, ...item.alts].slice(0, 4).map(String) : [],
        hint:    item.en || '',
      })).filter(x => x.q && x.a);
    }

    // E. Wrapper objects
    if (rawData.questions) return _gpNormalizeQuestions(rawData.questions, _datasetId);
    if (rawData.items)     return _gpNormalizeQuestions(rawData.items,     _datasetId);
    return [];
  }

  // ════════════════════════════════════════════════════════
  //  ARRAY BRANCH
  // ════════════════════════════════════════════════════════
  if (rawData.length === 0) return [];
  const sample = rawData.find(x => x && typeof x === 'object');
  if (!sample) return [];

  // F. ARV_DB: [{ id, lemma, forms:[{v,t,l,f}] }]
  if (sample.lemma !== undefined && Array.isArray(sample.forms) &&
      sample.forms.length > 0 && sample.forms[0] && sample.forms[0].t !== undefined) {
    const TENSE_GR = {
      present: 'Ενεστώτας', imperfect: 'Παρατατικός', future: 'Μέλλοντας',
      aorist:  'Αόριστος',  perfect:   'Παρακείμενος', pluperfect: 'Υπερσυντελικός',
    };
    const VOICE_SFX = { active: '', middle_passive: ' (μεσ./παθ.)', passive: ' (παθ.)' };
    return rawData.filter(Boolean).flatMap(item =>
      (item.forms || []).filter(f => f && f.f).map(f => {
        // f.f may contain multiple alternatives separated by — or ,
        const answer = String(f.f).split(/[—,]/)[0].trim();
        return {
          q:       `${item.lemma} — ${TENSE_GR[f.t] || f.t}${VOICE_SFX[f.v] || ''}`,
          a:       answer,
          options: [],
          hint:    item.meaning || '',
        };
      }).filter(x => x.a)
    ).filter(x => x.q && x.a);
  }

  // G. KR_DB: [{ id, lemma, groups:[{id, label, forms:[{l,f}]}] }]
  if (sample.lemma !== undefined && Array.isArray(sample.groups) &&
      sample.groups.length > 0 && sample.groups[0].forms !== undefined) {
    return rawData.filter(Boolean).flatMap(item =>
      (item.groups || []).flatMap(g =>
        (g.forms || []).filter(f => f && f.f).map(f => ({
          q:       `${item.lemma} — ${f.l} · ${g.label || ''}`,
          a:       String(f.f),
          options: [],
          hint:    item.meaning || '',
        }))
      )
    ).filter(x => x.q && x.a);
  }

  // H. OUS_DB / LAT_N_DB / LAT_A_DB: [{ l, t?, s:[forms], p:[forms] }]
  if (sample.l !== undefined && Array.isArray(sample.s) && Array.isArray(sample.p)) {
    const CASES = ['Ονομαστική','Γενική','Δοτική','Αιτιατική','Κλητική','Αφαιρετική'];
    return rawData.filter(Boolean).flatMap(entry => {
      const rows = [];
      const genderNote = entry.t ? ` (${entry.t})` : '';
      entry.s.forEach((form, i) => {
        if (form) rows.push({
          q:       `${entry.l}${genderNote} — ${CASES[i] || 'πτώση ' + (i + 1)} εν.`,
          a:       String(form), options: [], hint: entry.meaning || '',
        });
      });
      entry.p.forEach((form, i) => {
        if (form) rows.push({
          q:       `${entry.l}${genderNote} — ${CASES[i] || 'πτώση ' + (i + 1)} πλ.`,
          a:       String(form), options: [], hint: entry.meaning || '',
        });
      });
      return rows;
    }).filter(x => x.q && x.a);
  }

  // I. LAT_V_DB: [{ inf, meaning, act_ind_pres:[6], act_ind_ipf:[6], … }]
  if (sample.inf !== undefined) {
    const PERSONS = ['α΄ εν.','β΄ εν.','γ΄ εν.','α΄ πλ.','β΄ πλ.','γ΄ πλ.'];
    const TENSE_KEYS = [
      { k: 'act_ind_pres', l: 'Ενεστ. Ενεργ. Οριστ.' },
      { k: 'act_ind_ipf',  l: 'Παρατ. Ενεργ. Οριστ.' },
      { k: 'act_ind_fut',  l: 'Μέλλ. Ενεργ. Οριστ.'  },
      { k: 'act_ind_prf',  l: 'Παρακ. Ενεργ. Οριστ.'  },
      { k: 'pas_ind_pres', l: 'Ενεστ. Παθ. Οριστ.'   },
      { k: 'pas_ind_ipf',  l: 'Παρατ. Παθ. Οριστ.'   },
    ];
    return rawData.filter(Boolean).flatMap(entry =>
      TENSE_KEYS.flatMap(({ k, l }) => {
        if (!Array.isArray(entry[k])) return [];
        return entry[k].map((form, i) => ({
          q:       `${entry.inf} — ${l}, ${PERSONS[i]}`,
          a:       String(form),
          options: [],
          hint:    entry.meaning || '',
        })).filter(x => x.a);
      })
    ).filter(x => x.q && x.a);
  }

  // J. Trivia items: [{ q, opts:[4 strings], ans:number }]
  if (sample.opts !== undefined) {
    return rawData.filter(Boolean).map(item => {
      const opts = Array.isArray(item.opts) ? item.opts : [];
      const ans  = typeof item.ans === 'number'
        ? (opts[item.ans] || '') : String(item.ans || '');
      return { q: String(item.q || ''), a: ans, options: opts, hint: item.hint || '' };
    }).filter(x => x.q && x.a);
  }

  // K. Standard: [{ q, a, options?, hint? }]
  if (sample.q !== undefined && sample.a !== undefined) {
    return rawData.filter(Boolean).map(item => ({
      q:       String(item.q),
      a:       String(item.a),
      options: Array.isArray(item.options) ? item.options : [],
      hint:    item.hint || '',
    })).filter(x => x.q && x.a);
  }

  // L. Question/answer: [{ question, answer|correct, options?, choices? }]
  if (sample.question !== undefined) {
    return rawData.filter(Boolean).map(item => ({
      q:       String(item.question),
      a:       String(item.answer ?? item.correct ?? ''),
      options: item.options ?? item.choices ?? [],
      hint:    item.hint ?? '',
    })).filter(x => x.q && x.a);
  }

  // M. Flashcard: [{ front, back }]
  if (sample.front !== undefined && sample.back !== undefined) {
    return rawData.filter(Boolean).map(item => ({
      q: String(item.front), a: String(item.back || ''), options: [], hint: '',
    })).filter(x => x.q && x.a);
  }

  // N. Verb/word + form: [{ verb|word, form, tense? }]
  if (sample.verb !== undefined && sample.form !== undefined) {
    return rawData.filter(Boolean).map(item => ({
      q:       `${item.verb}${item.tense ? ' (' + item.tense + ')' : ''}`,
      a:       String(item.form),
      options: [],
      hint:    item.hint || '',
    })).filter(x => x.q && x.a);
  }
  if (sample.word !== undefined && sample.form !== undefined) {
    return rawData.filter(Boolean).map(item => ({
      q:       `${item.word}${item.case ? ' — ' + item.case : ''}`,
      a:       String(item.form),
      options: [],
      hint:    '',
    })).filter(x => x.q && x.a);
  }

  // O. Generic fallback: use first two string/number keys
  const strKeys = Object.keys(sample).filter(k =>
    typeof sample[k] === 'string' || typeof sample[k] === 'number'
  );
  if (strKeys.length >= 2) {
    return rawData.filter(Boolean).map(item => ({
      q: String(item[strKeys[0]]), a: String(item[strKeys[1]]), options: [], hint: '',
    })).filter(x => x.q && x.a);
  }

  return [];
}

// ── POPSTATE INTERCEPTOR FOR GAMES PANEL ────────────────────
// Runs in capture phase so it fires *before* the existing nav.js
// popstate handler. Closes ECM modal or Games Panel as needed,
// then swallows the event to prevent double-handling.
(function _gpRegisterPopstateGuard() {
  if (window._gpPopstateRegistered) return;   // idempotent
  window._gpPopstateRegistered = true;

  window.addEventListener('popstate', function _gpPopGuard(e) {
    // Check ECM modal first (it sits on top of the panel)
    const ecmModal = document.getElementById('engine-cfg-modal');
    if (ecmModal && ecmModal.classList.contains('active')) {
      closeEngineConfigurator();
      history.pushState(e.state ?? {}, '');
      e.stopImmediatePropagation();
      return;
    }
    // Then the Games Panel overlay itself
    const gpOv = document.getElementById('games-panel-overlay');
    if (gpOv && gpOv.classList.contains('active')) {
      closeGamesPanel();
      history.pushState(e.state ?? {}, '');
      e.stopImmediatePropagation();
      return;
    }
    // Otherwise fall through to nav.js's existing popstate handler
  }, true /* capture */);
})();

// ============================================================
//  SCREEN ORIENTATION UTILITY
//  Shows a "rotate device" overlay when a landscape-preferred
//  game is open on a portrait phone.
//  Usage:
//    orientHint.request()  — call when opening action games
//    orientHint.release()  — call when closing those games
// ============================================================
window.orientHint = (() => {
  const LANDSCAPE_GAMES = ['invaders-overlay', 'iliada-arcade-overlay'];
  let _active = false;

  function _isTouch() {
    return navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  }

  function _update() {
    if (!_active || !_isTouch()) {
      document.body.classList.remove('orient-needed');
      return;
    }
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    document.body.classList.toggle('orient-needed', isPortrait);
  }

  function request(overlayId) {
    // Try to lock orientation (silently fails on desktop/unsupported)
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock('landscape').catch(() => {});
    }
    _active = true;
    _update();
  }

  function release() {
    _active = false;
    document.body.classList.remove('orient-needed');
    if (screen.orientation && screen.orientation.unlock) {
      try { screen.orientation.unlock(); } catch (e) {}
    }
  }

  // React to physical rotation
  window.addEventListener('orientationchange', () => setTimeout(_update, 80));
  window.matchMedia('(orientation: portrait)').addEventListener('change', _update);

  return { request, release };
})();

// ============================================================
//  HOME PAGE TAB SYSTEM (stubs — Θεωρία tab removed from home)
// ============================================================

/** No-op stub kept for safety in case any legacy code still calls it. */
function switchHomeTab(zone) {}
function switchHubTab(zone)  {}

// NOTE: the former `renderTheoryLibrary()` (sx-tiles → #theory-library-inner)
// was dead code — never called and that container never existed. The live
// Theory Library is `_renderTheoryLibrary()` → #theory-library-content, above.

// ── .subject-all-link buttons retain their HTML onclick (navToSubject / navToGrade / etc.) ──
// No override — each button navigates to its specific subject as defined in index.html.

// ── Καταιγισμός per-level filter hook ────────────────────────────────────────
// Loader-leveled datasets (e.g. lyo) already filter inside their loader(levelId).
// For sub/filter datasets (ousiastika, antonymies) the level is applied downstream
// via level.sub. Καταιγισμός' storm-content.js calls window.RF_LEVEL_FILTER so its
// level popup can restrict the bank — we just reuse each game's own filter fn
// (_ousFilterNouns / _antFilterEntries), which read level.sub and the eager
// OUS_DB / ANT_DB globals. Unknown datasets / missing fns → unfiltered (never empty).
window.RF_LEVEL_FILTER = function (rawData, levelObj, dataset) {
  if (!rawData || !levelObj) return rawData;
  const subs = Array.isArray(levelObj.sub) ? levelObj.sub
             : (levelObj.sub ? [levelObj.sub] : null);
  if (!subs || !subs.length) return rawData;
  const id = dataset && dataset.id;
  try {
    if (id === 'ousiastika' && typeof _ousFilterNouns === 'function') return _ousFilterNouns(subs);
    if (id === 'antonymies' && typeof _antFilterEntries === 'function') return _antFilterEntries(subs);
  } catch (e) { /* fall through to unfiltered */ }
  return rawData; // graceful: unfiltered rather than empty
};
