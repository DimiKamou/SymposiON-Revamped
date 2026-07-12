/* ════════════════════════════════════════════════════════════════════
   sym-kleos.js — effective Kleos balance + admin override.

   The bootstrap admin (dimikamou@gmail.com / any provisioned admin) gets
   INFINITE Kleos so every cosmetic unlock succeeds — but items still SHOW
   locked, so the admin can exercise the real unlock flow while testing.

   Usage (replaces `SymStore.get('kleos', 0)` reads):
     window.symKleos()            → current balance (Infinity for admin)
     window.symKleosIsAdmin()     → true if the infinite-Kleos admin
     window.symSpendKleos(n)      → true if affordable; deducts for non-admins only
     window.symKleosLabel()       → display string ("∞" for admin, else formatted)
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function isInfiniteAdmin() {
    try {
      // isAdmin is a top-level `let` in auth.js (a global lexical binding).
      if (typeof isAdmin !== 'undefined' && isAdmin) return true;
    } catch (_) {}
    try {
      // currentUser in auth.js is a top-level `let` (NOT on window) — the
      // reliable cross-script source of the signed-in user is firebase.auth().
      var fu = (window.firebase && firebase.auth && firebase.auth().currentUser) || null;
      if (fu && fu.email === 'dimikamou@gmail.com') return true;
    } catch (_) {}
    try {
      if (document.body && document.body.classList.contains('is-admin')) return true;
    } catch (_) {}
    return false;
  }

  function stored() {
    try { return (window.SymStore && SymStore.get('kleos', 0)) || 0; }
    catch (_) { return 0; }
  }

  window.symKleosIsAdmin = isInfiniteAdmin;

  window.symKleos = function () {
    return isInfiniteAdmin() ? Infinity : stored();
  };

  // Returns true if the cost is affordable; deducts from the stored balance for
  // non-admins only (admins keep their infinite pool).
  window.symSpendKleos = function (n) {
    n = +n || 0;
    if (window.symKleos() < n) return false;
    if (!isInfiniteAdmin()) {
      try { SymStore.set('kleos', Math.max(0, stored() - n)); } catch (_) {}
    }
    return true;
  };

  // Display helper: "∞" for the admin, otherwise the localized number.
  window.symKleosLabel = function () {
    var k = window.symKleos();
    if (!isFinite(k)) return '∞';
    try { return k.toLocaleString('en-US'); } catch (_) { return String(k); }
  };

  /* ── ADMIN KLEOS GRANTS (ISSUE 5b) ──────────────────────────────────
     There is no server-side per-student kleos balance — the balance lives in
     each browser's SymStore('kleos'). The admin "Grant Kleos" panel writes a
     grant record to Firestore kleosGrants/{email} (a `pending` counter). On
     login the target student's client DRAINS the pending amount once, credits
     the local balance, and zeroes the counter so it is never double-claimed. */

  // Credit the local balance (no-op for the infinite admin — nothing to store).
  window.symAddKleos = function (n) {
    n = +n || 0; if (n <= 0) return;
    if (isInfiniteAdmin()) return;
    try { SymStore.set('kleos', Math.max(0, stored() + n)); } catch (_) {}
    // Refresh any live kleos display if the app exposes a hook.
    try { if (typeof window.symKleosRefresh === 'function') window.symKleosRefresh(); } catch (_) {}
  };

  // Drain any pending server grant for the signed-in user (once), then clear it.
  window.symClaimKleosGrants = function () {
    try {
      if (!(window.firebase && firebase.firestore)) return;
      // Signed-in user comes from firebase.auth() — auth.js's `currentUser` is a
      // top-level let, not a window property, so window.currentUser is undefined.
      var u = (firebase.auth && firebase.auth().currentUser) || null;
      if (!u || !u.email) return;
      var db = firebase.firestore();
      var ref = db.collection('kleosGrants').doc(String(u.email).toLowerCase());
      // Transaction so two tabs / rapid auth events can't both drain `pending`
      // (a get→credit→set race would double-credit). Exactly one client reads a
      // positive pending; it credits locally and zeroes the counter atomically.
      db.runTransaction(function (tx) {
        return tx.get(ref).then(function (d) {
          var pending = +(((d && d.exists && d.data()) || {}).pending) || 0;
          if (pending > 0) tx.set(ref, { pending: 0 }, { merge: true });
          return pending;
        });
      }).then(function (pending) {
        if (pending > 0) window.symAddKleos(pending);
      }).catch(function () {});
    } catch (_) {}
  };

  // Self-wire the claim to auth (additive — auth.js is not editable here, but
  // firebase.auth().onAuthStateChanged supports multiple independent listeners).
  // Waits for firebase to init, then claims on every signed-in state change.
  (function wireClaim() {
    var tries = 0;
    (function attach() {
      try {
        if (window.firebase && firebase.auth) {
          firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
              // currentUser may be set slightly after this fires; small defer.
              setTimeout(function () { window.symClaimKleosGrants(); }, 300);
            }
          });
          return;
        }
      } catch (_) {}
      if (tries++ < 40) setTimeout(attach, 250);   // up to ~10s for firebase init
    })();
  })();
})();
