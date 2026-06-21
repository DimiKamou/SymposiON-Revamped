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
      if (window.currentUser && window.currentUser.email === 'dimikamou@gmail.com') return true;
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
})();
