// ============================================================
//  SymposiON — Authentication
//  Google Sign-In + Email/Password via Firebase Auth
// ============================================================

let _firebaseReady  = false;
let _auth           = null;
let currentUser     = null;       // exposed globally for nav.js, subscribe.js, admin.js
let currentUserRole = 'free';     // 'free' | 'student' | 'teacher'
let isAdmin         = false;      // true for bootstrap email OR any provisioned admin role
let adminRole       = null;       // 'super' | 'content' | 'support' | 'finance' | null

const _ADMIN_EMAIL  = 'dimikamou@gmail.com';

// ── FIREBASE INIT ─────────────────────────────────────────────
// IMPORTANT — keep initializeApp() SYNCHRONOUS.
// Scripts that load after auth.js (favorites.js, scores.js, etc.)
// call firebase.auth() immediately in their own IIFEs. Deferring
// initializeApp() breaks them with "No Firebase App '[DEFAULT]'".
//
// The "No Listener: tabs:outgoing.message.ready" error is a benign
// Firebase-internal BroadcastChannel tab-sync race. It is silenced
// by the global error boundary in nav.js — not by deferring init.
//
// What IS deferred: onAuthStateChanged, so the user-role Firestore
// read and nav re-render only fire after all scripts have loaded.

let _initAttempts = 0;
const _MAX_INIT_ATTEMPTS = 3;

function _doFirebaseInit() {
  // Graceful degradation: if the Firebase compat SDK never loaded (e.g. the
  // gstatic CDN is blocked/offline) the `firebase` global is undefined.
  // Bail quietly instead of throwing — the revamp shell must stay usable and
  // the auth modal still opens (it just reports "not configured" on submit).
  if (typeof firebase === 'undefined') {
    console.warn('[symposion auth] Firebase SDK unavailable — auth disabled (offline / CDN blocked).');
    return;
  }
  if (typeof FIREBASE_CONFIG === 'undefined' ||
      FIREBASE_CONFIG.apiKey === 'YOUR_API_KEY') {
    console.warn('[symposion auth] Firebase not configured — fill in js/firebase-config.js');
    return;
  }
  try {
    // Guard: don't double-init (retry calls, HMR, etc.)
    if (!firebase.apps?.length) {
      firebase.initializeApp(FIREBASE_CONFIG);
    }
    _auth          = firebase.auth();
    _firebaseReady = true;

    // Notify dependent modules (favorites.js, scores.js) that
    // firebase.auth() is now available.
    window.dispatchEvent(new CustomEvent('symposion:firebase-ready'));

    // Attach synchronously — same as the original IIFE.
    // Deferring via setTimeout breaks timing for modules that check
    // currentUser or auth state immediately on load.
    _attachAuthListener();

  } catch (e) {
    _initAttempts++;
    if (_initAttempts < _MAX_INIT_ATTEMPTS) {
      const delay = _initAttempts * 100;
      console.warn(
        `[symposion auth] Init attempt ${_initAttempts} failed — retrying in ${delay}ms`, e
      );
      setTimeout(_doFirebaseInit, delay);
    } else {
      console.error('[symposion auth] Firebase init failed after all retries:', e);
    }
  }
}

function _attachAuthListener() {
  if (!_auth) return;

  _auth.onAuthStateChanged(user => {
    currentUser = user;
    if (user) {
      grantMemberThemes();   // member perk: free premium themes (idempotent)
      _loadUserRole(user?.uid)
        .then(() => {
          if (typeof initProgression === 'function') return initProgression(user?.uid);
        })
        .then(() => {
          _updateAllNavbars();
          // Production race: router.js resolves before onAuthStateChanged.
          // Activate the admin panel now that isAdmin is confirmed.
          if (isAdmin && window.location.pathname === '/admin') {
            if (typeof _showAdminInCurrentTab === 'function') _showAdminInCurrentTab();
          }
        })
        .catch(err => {
          // Post-login Firestore/progression failure must not freeze the UI
          console.warn('[symposion auth] Post-login setup error:', err);
          _updateAllNavbars();
        });
    } else {
      currentUserRole = 'free';
      isAdmin         = false;
      if (typeof resetProgression === 'function') resetProgression();
      _updateAllNavbars();
    }
  });
}

// ── MEMBER PERK: free premium themes for signed-up users ──
// When a user is signed in we grant a tasteful set of normally-locked themes.
// Adds their ids to STATE.unlocked (deduped, persisted to sym_revamp_unlocked),
// mirrors them into SymStore 'own_theme' so the theme picker shows them
// unlocked, then refreshes the harness. Idempotent — safe to call repeatedly.
const MEMBER_FREE_THEMES = [
  'tyrian',        // Tyrian Purple — unlockable
  'golden-fleece', // Golden Fleece — unlockable
  'royalcourt',    // Royal Court — combo
  'ultraviolet',   // Ultraviolet — vivid
  'synthwave',     // Synthwave — neon
  'petrol',        // Petrol — combo
];
window.MEMBER_FREE_THEMES = MEMBER_FREE_THEMES;

function grantMemberThemes() {
  try {
    const ST = window.STATE;
    // 1) STATE.unlocked — merge + dedupe.
    if (ST) {
      const set = new Set(Array.isArray(ST.unlocked) ? ST.unlocked : []);
      MEMBER_FREE_THEMES.forEach(id => set.add(id));
      ST.unlocked = Array.from(set);
      // 2) Persist to localStorage 'sym_revamp_unlocked'.
      try { localStorage.setItem('sym_revamp_unlocked', JSON.stringify(ST.unlocked)); } catch (_) {}
    }
    // 3) Mirror into SymStore 'own_theme' so the picker renders them unlocked.
    if (window.SymStore) {
      const owned = SymStore.get('own_theme', null);
      const base = Array.isArray(owned) ? owned.slice() : [];
      let changed = !Array.isArray(owned);
      MEMBER_FREE_THEMES.forEach(id => { if (base.indexOf(id) < 0) { base.push(id); changed = true; } });
      if (changed) SymStore.set('own_theme', base);
    }
    // 4) Refresh the theme picker / harness so the change shows immediately.
    if (typeof window.symRefreshHarness === 'function') window.symRefreshHarness();
  } catch (e) {
    try { console.warn('[symposion auth] grantMemberThemes failed:', e); } catch (_) {}
  }
}
window.grantMemberThemes = grantMemberThemes;

// Run synchronously — firebase.auth() must be available before
// favorites.js, scores.js, and other scripts run their own IIFEs.
_doFirebaseInit();

// ── ROLE LOADING ──
// Reads both the Firestore user doc (app role: free/student/teacher)
// and the ID token claims (admin role: super/content/support/finance).
// Uses getIdTokenResult() — no forced refresh, just the cached token.
// Force-refresh is only needed client-side after setAdminRole resolves.
function _loadUserRole(uid) {
  const firestoreRead = firebase.firestore().doc(`users/${uid}`).get();
  const tokenRead     = (_auth?.currentUser)
    ? _auth.currentUser.getIdTokenResult()
    : Promise.resolve(null);

  return Promise.all([firestoreRead, tokenRead])
    .then(([doc, tokenResult]) => {
      currentUserRole = doc.exists ? (doc.data().role || 'free') : 'free';

      // Read provisioned admin role from custom claim.
      const claimRole = tokenResult?.claims?.role || null;
      adminRole = claimRole;

      // Bootstrap email is always super regardless of claims.
      if (_auth?.currentUser?.email === _ADMIN_EMAIL) {
        isAdmin         = true;
        adminRole       = adminRole || 'super';
        currentUserRole = 'teacher'; // highest non-admin role; ensures all gating passes
        document.body.classList.add('is-admin');
        if (window.location.pathname === '/admin') {
          if (typeof _showAdminInCurrentTab === 'function') _showAdminInCurrentTab();
        }
      } else if (claimRole) {
        // Provisioned admin (non-bootstrap email with a role claim).
        isAdmin = true;
        document.body.classList.add('is-admin');
        if (window.location.pathname === '/admin') {
          if (typeof _showAdminInCurrentTab === 'function') _showAdminInCurrentTab();
        }
      }
    })
    .catch(() => { currentUserRole = 'free'; isAdmin = false; adminRole = null; });
}

// ── FORCE TOKEN REFRESH (call after setAdminRole resolves) ──
// Custom claims are invisible until the ID token is refreshed.
// Any UI that calls setAdminRole must await this immediately after.
async function refreshAdminClaims() {
  if (!_auth?.currentUser) return;
  await _auth.currentUser.getIdToken(/* forceRefresh= */ true);
  await _loadUserRole(_auth.currentUser.uid);
  if (typeof _updateAllNavbars === 'function') _updateAllNavbars();
}

// ── ENSURE USER DOC EXISTS (creates with role:'free' if missing) ──
function _ensureUserDoc(user) {
  const ref = firebase.firestore().doc(`users/${user.uid}`);
  return ref.get().then(doc => {
    if (!doc.exists) {
      return ref.set({
        role:        'free',
        displayName: user.displayName || '',
        email:       user.email       || '',
        createdAt:   firebase.firestore.FieldValue.serverTimestamp(),
      });
    }
  }).catch(() => {});
}

// ── MODAL OPEN / CLOSE ──
function openAuthModal(view) {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  _clearAuthError();
  switchAuthTab(view || 'login');
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  setTimeout(() => {
    const first = modal.querySelector('input:not([type=hidden])');
    if (first) first.focus();
  }, 180);
}

function closeAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
  _clearAuthError();
}

// ── TAB TOGGLE ──
function switchAuthTab(view) {
  ['login', 'signup'].forEach(v => {
    const tab   = document.getElementById('auth-tab-' + v);
    const panel = document.getElementById('auth-view-' + v);
    const isActive = v === view;
    if (tab)   tab.classList.toggle('active', isActive);
    if (panel) panel.style.display = isActive ? 'flex' : 'none';
  });
  _clearAuthError();
}

// ── GOOGLE SIGN-IN ──
function signInWithGoogle() {
  if (!_firebaseReady) { _showNotConfigured(); return; }
  _setAuthLoading(true);
  try {
    const provider = new firebase.auth.GoogleAuthProvider();
    _auth.signInWithPopup(provider)
      .then(cred => {
        const user = cred?.user;
        if (!user) throw Object.assign(new Error('Δεν επεστράφη λογαριασμός.'), { code: 'auth/no-user' });
        return _ensureUserDoc(user);
      })
      .then(() => closeAuthModal())
      .catch(err => {
        console.error('[symposion auth] Google Sign-In error:', err);
        _showAuthError(_friendlyError(err));
      })
      .finally(() => _setAuthLoading(false));
  } catch (err) {
    console.error('[symposion auth] Google Sign-In sync error:', err);
    _showAuthError(_friendlyError(err));
    _setAuthLoading(false);
  }
}

// ── EMAIL/PASSWORD SIGN-IN ──
function signInWithEmail() {
  // Client-side validation runs BEFORE the Firebase-ready guard so empty/invalid
  // submits show the specific validation message even when Firebase is unavailable.
  const email = document.getElementById('auth-email')?.value?.trim()    ?? '';
  const pass  = document.getElementById('auth-password')?.value          ?? '';
  if (!email || !pass) { _showAuthError('Συμπλήρωσε email και κωδικό.'); return; }
  if (!_firebaseReady) { _showNotConfigured(); return; }
  _setAuthLoading(true);
  try {
    _auth.signInWithEmailAndPassword(email, pass)
      .then(() => closeAuthModal())
      .catch(err => {
        console.error('[symposion auth] Email login error:', err);
        _showAuthError(_friendlyError(err));
      })
      .finally(() => _setAuthLoading(false));
  } catch (err) {
    console.error('[symposion auth] Email login sync error:', err);
    _showAuthError(_friendlyError(err));
    _setAuthLoading(false);
  }
}

// ── ANTI-BOT: install a honeypot on the sign-up form (idempotent) ──
// Guarded — the anti-bot module (window.SymAntiBot) may be absent in tests.
let _signupHoneypot = null;
function _installSignupHoneypot() {
  if (!window.SymAntiBot || typeof SymAntiBot.honeypot !== 'function') return null;
  const form = document.getElementById('auth-view-signup')
            || document.getElementById('auth-modal')
            || document.querySelector('#auth-view-signup, form');
  if (!form) return null;
  if (!_signupHoneypot || _signupHoneypot._form !== form) {
    try { _signupHoneypot = SymAntiBot.honeypot(form); if (_signupHoneypot) _signupHoneypot._form = form; }
    catch (_) { _signupHoneypot = null; }
  }
  return _signupHoneypot;
}

// ── EMAIL/PASSWORD SIGN-UP ──
// The full sign-up gate runs first: human-verify → AGE → MODE/role (via
// window.SymSignupFlow), with anti-bot defences (honeypot, throttle, sanitize).
// Each external dependency is GUARDED so the form still works if a module is
// absent (e.g. in an isolated test harness).
function signUpWithEmail() {
  const hp = _installSignupHoneypot();

  // Anti-bot: silently abort if the hidden honeypot field was filled.
  if (hp && typeof hp.isBot === 'function') {
    try { if (hp.isBot()) { _showAuthError('Κάτι πήγε στραβά. Δοκίμασε ξανά.'); return; } } catch (_) {}
  }

  // Anti-bot: throttle attempts (max 5 per 60s) with a friendly notice.
  if (window.SymAntiBot && typeof SymAntiBot.throttle === 'function') {
    try {
      const t = SymAntiBot.throttle('signup', 5, 60000);
      if (t && t.allowed === false) {
        const secs = Math.ceil((t.retryAfter || 0) / 1000);
        _showAuthError('Πάρα πολλές απόπειρες. Δοκίμασε ξανά' + (secs ? ' σε ' + secs + 'δ.' : ' αργότερα.'));
        return;
      }
    } catch (_) {}
  }

  // Run the gated flow (human-verify → age → mode) THEN create the account.
  if (window.SymSignupFlow) {
    window.SymSignupFlow(_doEmailSignUp);
  } else {
    _doEmailSignUp();
  }
}

function _doEmailSignUp() {
  // Client-side validation runs BEFORE the Firebase-ready guard so empty/invalid
  // submits show the specific validation message even when Firebase is unavailable.
  let name  = document.getElementById('auth-name')?.value?.trim()            ?? '';
  let email = document.getElementById('auth-signup-email')?.value?.trim()    ?? '';
  const pass  = document.getElementById('auth-signup-password')?.value          ?? '';
  // Anti-bot: sanitize the user-supplied name & email before use (guarded).
  if (window.SymAntiBot && typeof SymAntiBot.sanitize === 'function') {
    try { name = SymAntiBot.sanitize(name); email = SymAntiBot.sanitize(email); } catch (_) {}
  }
  if (!name)              { _showAuthError('Συμπλήρωσε το όνομά σου.'); return; }
  if (!email)             { _showAuthError('Συμπλήρωσε email.'); return; }
  if (pass.length < 6)   { _showAuthError('Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.'); return; }
  if (!_firebaseReady) { _showNotConfigured(); return; }
  _setAuthLoading(true);
  try {
    _auth.createUserWithEmailAndPassword(email, pass)
      .then(cred => {
        const user = cred?.user;
        if (!user) throw Object.assign(new Error('Δεν επεστράφη λογαριασμός.'), { code: 'auth/no-user' });
        return Promise.all([
          user.updateProfile({ displayName: name }),
          _ensureUserDoc(user),
        ]);
      })
      .then(() => closeAuthModal())
      .catch(err => {
        console.error('[symposion auth] Signup error:', err);
        _showAuthError(_friendlyError(err));
      })
      .finally(() => _setAuthLoading(false));
  } catch (err) {
    console.error('[symposion auth] Signup sync error:', err);
    _showAuthError(_friendlyError(err));
    _setAuthLoading(false);
  }
}

// ── SIGN-OUT ──
function signOutUser() {
  if (!_firebaseReady || !_auth) return;
  // Show themed confirmation modal instead of browser confirm()
  const modal = document.getElementById('signout-modal');
  if (modal) {
    // Sync language on modal text nodes
    if (typeof siteLang !== 'undefined') {
      modal.querySelectorAll('[data-gr]').forEach(el => {
        el.textContent = siteLang === 'en' ? (el.dataset.en || el.dataset.gr) : el.dataset.gr;
      });
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    // Fallback if modal not in DOM
    if (confirm('Θέλεις σίγουρα να αποσυνδεθείς;')) _doSignOut();
  }
}

function _doSignOut() {
  closeSignoutModal();
  if (!_firebaseReady || !_auth) return;
  _auth.signOut().catch(err => console.warn('[symposion auth] Sign-out error:', err));
}

function closeSignoutModal() {
  const modal = document.getElementById('signout-modal');
  if (modal) modal.classList.remove('active');
  if (!document.querySelector('.game-overlay.active, #auth-modal.active')) {
    document.body.style.overflow = '';
  }
}

// ── MICROSOFT (OUTLOOK) SIGN-IN ──
function signInWithMicrosoft() {
  if (!_firebaseReady) { _showNotConfigured(); return; }
  _setAuthLoading(true);
  try {
    const provider = new firebase.auth.OAuthProvider('microsoft.com');
    provider.setCustomParameters({ prompt: 'select_account' });
    _auth.signInWithPopup(provider)
      .then(cred => {
        const user = cred?.user;
        if (!user) throw Object.assign(new Error('Δεν επεστράφη λογαριασμός.'), { code: 'auth/no-user' });
        return _ensureUserDoc(user);
      })
      .then(() => closeAuthModal())
      .catch(err => {
        console.error('[symposion auth] Microsoft Sign-In error:', err);
        _showAuthError(_friendlyError(err));
      })
      .finally(() => _setAuthLoading(false));
  } catch (err) {
    console.error('[symposion auth] Microsoft Sign-In sync error:', err);
    _showAuthError(_friendlyError(err));
    _setAuthLoading(false);
  }
}

// ── FACEBOOK SIGN-IN — REMOVED ──
// Facebook/Meta login was removed. Kept as a silent no-op so a stale cached
// page that still has the old button can't throw a ReferenceError.
function signInWithFacebook() { /* removed */ }

// ── UPDATE ALL NAV BARS ──
function _updateAllNavbars() {
  // Ver1 navbars (if any are present) — guarded, harmless when absent.
  document.querySelectorAll('.nav-auth-area').forEach(area => {
    _renderNavAuthArea(area);
  });
  // Revamp shell: its nav is rebuilt by symRender(). Re-render so the
  // sign-in / sign-up buttons swap to the signed-in user chip (and back).
  // Guarded so a missing revamp shell never throws.
  if (typeof window.symRender === 'function') {
    try { window.symRender(); } catch (e) { /* shell not ready — ignore */ }
  }
}

function _renderNavAuthArea(area) {
  if (!area) return;
  if (currentUser) {
    const name  = currentUser.displayName || currentUser.email?.split('@')[0] || 'Χρήστης';
    const photo = currentUser.photoURL;

    // ── Progression data (from progression.js, if loaded) ──
    const prog       = typeof getProgression === 'function' ? getProgression() : null;
    const level      = prog ? prog.level : null;
    const avatarObj  = typeof getActiveAvatar === 'function' ? getActiveAvatar() : null;
    const useSymbol  = typeof shouldUseSymbolAvatar === 'function' && shouldUseSymbolAvatar();

    // Avatar HTML: an equipped symbol the user chose wins; otherwise photo, then SVG/initial
    const avatarHtml = (photo && !useSymbol)
      ? `<img class="nav-avatar" src="${photo}" alt="">`
      : (avatarObj
          ? `<span class="nav-avatar-svg">${avatarObj.svg}</span>`
          : `<div class="nav-avatar-fallback">${name[0].toUpperCase()}</div>`);

    // Level badge — only shown when progression is loaded; acts as profile shortcut
    const levelBadge = (level !== null)
      ? `<span class="nav-level-badge" onclick="if(typeof navToProfile==='function')navToProfile()" title="Το Μονοπάτι του Ήρωα">${level}</span>`
      : '';

    // ── Action buttons ──
    const adminLabel  = typeof t === 'function' ? t('Διαχείριση', 'Admin')  : 'Admin';
    const adminTitle  = typeof t === 'function' ? t('Πίνακας Ελέγχου', 'Admin Control Panel') : 'Admin Control Panel';
    const adminBtn = isAdmin
      ? `<button class="nav-btn nav-btn-admin"
                 onclick="navToAdmin()"
                 title="${adminTitle}">⚙ ${adminLabel}</button>`
      : '';

    const assignLabel = typeof t === 'function' ? t('Ανάθεση', 'Assign') : 'Assign';
    const assignTitle = typeof t === 'function' ? t('Λειτουργία Καθηγητή — δημιουργία &amp; κοινοποίηση κουίζ', 'Teacher Mode — build &amp; share custom quizzes') : 'Teacher Mode';
    const teacherBtn = (currentUserRole === 'teacher' || isAdmin)
      ? `<button class="nav-btn nav-btn-teacher"
                 onclick="if(typeof navToTeacher==='function')navToTeacher()"
                 title="${assignTitle}">🎓 ${assignLabel}</button>`
      : '';

    const upgradeTitle = typeof t === 'function' ? t('Αναβάθμιση σε Pro', 'Upgrade to Pro') : 'Upgrade to Pro';
    const upgradeBtn = (!isAdmin && currentUserRole === 'free')
      ? `<button class="nav-btn nav-btn-upgrade"
                 onclick="if(typeof navToSubscribe==='function')navToSubscribe()"
                 title="${upgradeTitle}">⭐ Pro</button>`
      : '';

    // Profile / Hero's Journey button
    const profileLabel = typeof t === 'function' ? t('Ήρωας', 'Hero') : 'Ήρωας';
    const profileBtn = `<button class="nav-btn nav-btn-profile"
               onclick="if(typeof navToProfile==='function')navToProfile()"
               title="${typeof t === 'function' ? t('Το Μονοπάτι του Ήρωα', "The Hero's Journey") : 'Το Μονοπάτι του Ήρωα'}">⚔ ${profileLabel}</button>`;

    // Tartarus Review Hub button — visible to all authenticated users
    const reviewHubLabel = typeof t === 'function' ? t('Τάρταρος', 'Tartarus') : 'Τάρταρος';
    const reviewHubBtn = `<button class="nav-btn nav-btn-review-hub"
               onclick="if(typeof navToReviewHub==='function')navToReviewHub()"
               title="${typeof t === 'function' ? t('Αρχείο Σφαλμάτων — Έξυπνη Αναθεώρηση', 'Error Archive — Intelligent Review') : 'Error Archive'}">🗡️ ${reviewHubLabel}</button>`;

    area.innerHTML = `
      ${adminBtn}
      ${teacherBtn}
      ${upgradeBtn}
      ${reviewHubBtn}
      ${profileBtn}
      <div class="nav-user-chip">
        ${avatarHtml}
        <span class="nav-username">${name}</span>
        ${levelBadge}
        <button class="nav-btn nav-signout-btn" onclick="signOutUser()">↩</button>
      </div>`;
  } else {
    const loginLabel  = typeof t === 'function' ? t('Είσοδος','Sign In')  : 'Είσοδος';
    const signupLabel = typeof t === 'function' ? t('Εγγραφή','Sign Up') : 'Εγγραφή';
    area.innerHTML = `
      <button class="nav-btn"         onclick="openAuthModal('login')">${loginLabel}</button>
      <button class="nav-btn primary" onclick="openAuthModal('signup')">${signupLabel}</button>`;
  }
}

// ── HELPER: render user chip into a generic container ──
function _renderUserChip(container, user) {
  const name      = user.displayName || user.email?.split('@')[0] || 'Χρήστης';
  const photo     = user.photoURL;
  const prog      = typeof getProgression === 'function' ? getProgression() : null;
  const level     = prog ? prog.level : null;
  const avatarObj = typeof getActiveAvatar === 'function' ? getActiveAvatar() : null;
  const useSymbol = typeof shouldUseSymbolAvatar === 'function' && shouldUseSymbolAvatar();

  const avatarHtml = (photo && !useSymbol)
    ? `<img class="nav-avatar" src="${photo}" alt="">`
    : (avatarObj
        ? `<span class="nav-avatar-svg">${avatarObj.svg}</span>`
        : `<div class="nav-avatar-fallback">${name[0].toUpperCase()}</div>`);

  const levelBadge = (level !== null)
    ? `<span class="nav-level-badge" onclick="if(typeof navToProfile==='function')navToProfile()" title="Το Μονοπάτι του Ήρωα">${level}</span>`
    : '';

  container.innerHTML = `
    <div class="nav-user-chip">
      ${avatarHtml}
      <span class="nav-username">${name}</span>
      ${levelBadge}
      <button class="nav-btn nav-signout-btn" onclick="signOutUser()">↩</button>
    </div>`;
}

// ── UI HELPERS ──
function _showAuthError(msg) {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}
function _clearAuthError() {
  const el = document.getElementById('auth-error');
  if (el) { el.textContent = ''; el.style.display = 'none'; }
}
let _popupRecover = null;
function _setAuthLoading(on) {
  document.querySelectorAll('.auth-submit-btn').forEach(btn => {
    if (on) {
      btn.dataset.origLabel = btn.textContent; // capture before overwriting
      btn.disabled    = true;
      btn.textContent = '…';
    } else {
      btn.disabled    = false;
      btn.textContent = btn.dataset.origLabel || btn.textContent;
    }
  });
  // Re-enable every OAuth button (Google / Microsoft), not just the submit ones.
  document.querySelectorAll('#auth-google-btn, .auth-oauth-btn').forEach(b => { b.disabled = on; });
  // Safety net: signInWithPopup sometimes NEVER settles when the user closes the
  // popup (so the .finally that re-enables never runs, leaving the button
  // "blacked out"). Re-enable as soon as focus returns to this window and no
  // sign-in actually happened.
  if (on) {
    if (_popupRecover) window.removeEventListener('focus', _popupRecover);
    _popupRecover = () => {
      window.removeEventListener('focus', _popupRecover); _popupRecover = null;
      setTimeout(() => { if (!(_auth && _auth.currentUser)) _setAuthLoading(false); }, 600);
    };
    window.addEventListener('focus', _popupRecover);
  } else if (_popupRecover) {
    window.removeEventListener('focus', _popupRecover); _popupRecover = null;
  }
}
function _showNotConfigured() {
  _showAuthError('Η σύνδεση δεν έχει ρυθμιστεί ακόμα. Συμπλήρωσε το js/firebase-config.js.');
}
function _friendlyError(err) {
  const map = {
    'auth/user-not-found':        'Δεν βρέθηκε λογαριασμός με αυτό το email.',
    'auth/wrong-password':        'Λανθασμένος κωδικός.',
    'auth/email-already-in-use':  'Αυτό το email χρησιμοποιείται ήδη.',
    'auth/invalid-email':         'Μη έγκυρο email.',
    'auth/weak-password':         'Ο κωδικός είναι πολύ αδύναμος.',
    'auth/popup-closed-by-user':  'Το παράθυρο σύνδεσης έκλεισε.',
    'auth/popup-blocked':         'Το παράθυρο σύνδεσης μπλοκαρίστηκε από τον browser.',
    'auth/network-request-failed':'Πρόβλημα σύνδεσης. Έλεγξε το internet.',
    'auth/too-many-requests':     'Πάρα πολλές απόπειρες. Δοκίμασε αργότερα.',
    'auth/invalid-credential':    'Λανθασμένα στοιχεία σύνδεσης.',
    'auth/unauthorized-domain':   'Ο τομέας δεν είναι εξουσιοδοτημένος. Επικοινώνησε με τον διαχειριστή.',
    'auth/cancelled-popup-request':'Η αίτηση ακυρώθηκε. Δοκίμασε ξανά.',
    'auth/operation-not-allowed': 'Αυτή η μέθοδος σύνδεσης δεν επιτρέπεται.',
  };
  return map[err.code] || err.message || 'Κάτι πήγε στραβά. Δοκίμασε ξανά.';
}
