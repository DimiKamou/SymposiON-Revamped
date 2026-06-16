/* ════════════════════════════════════════════════════════════
   syn-admin.js — wires Ver1's Command Center into the synthesis shell.

   Synthesis routes through window.SYM_SCREENS[screen] (rendered into
   #sym-home). The Ver1 admin engine (admin-cc.js) instead mounts into a
   dedicated full-screen host (#page-admin) and toggles visibility via a
   Ver1 page-router (goTo). Synthesis has neither, so this bridge:

     • provides a minimal window.goTo shim (only acts on 'admin' — toggles
       the #page-admin overlay; harmless no-op for any other page id, so it
       never fights the synthesis router);
     • registers SYM_SCREENS.admin → builds + shows the Command Center;
     • hides the overlay whenever any non-admin screen renders.

   Gated end-to-end on the global isAdmin (auth.js). Non-admins who reach
   #admin get bounced home.
   ════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function _host()    { return document.getElementById('page-admin'); }
  function _backBtn() { return document.getElementById('syn-admin-back'); }

  function _showAdmin() {
    var h = _host(); if (!h) return;
    h.classList.add('syn-admin-on');
    var b = _backBtn(); if (b) b.classList.add('syn-admin-on');
    document.body.classList.add('syn-admin-open');
  }
  function hideAdmin() {
    var h = _host(); if (h) h.classList.remove('syn-admin-on');
    var b = _backBtn(); if (b) b.classList.remove('syn-admin-on');
    document.body.classList.remove('syn-admin-open');
  }
  window.synHideAdmin = hideAdmin;

  // ── Minimal goTo shim ────────────────────────────────────────
  // admin-cc.js calls goTo('admin') from navToAdmin/_renderAdminPage. We only
  // care about that case; anything else is left alone (no Ver1 .page system).
  if (typeof window.goTo !== 'function') {
    window.goTo = function (page) {
      if (page === 'admin') _showAdmin();
      else hideAdmin();
    };
  }

  // ── Screen registration ─────────────────────────────────────
  function _ensure() {
    if (!window.SYM_SCREENS) window.SYM_SCREENS = {};
    window.SYM_SCREENS.admin = function (home /*, ctx */) {
      // Admin-only. Bounce non-admins back home.
      if (typeof isAdmin === 'undefined' || !isAdmin) {
        if (window.symGo) { setTimeout(function () { window.symGo('home'); }, 0); }
        return;
      }
      // Don't paint anything into the home mount — the Command Center lives in
      // its own overlay. Clear home so nothing shows behind it.
      if (home) home.innerHTML = '';
      if (typeof window._renderAdminPage === 'function') {
        try { window._renderAdminPage(); } catch (e) { console.error('[syn-admin] render failed', e); }
      }
      _showAdmin();
    };
  }
  _ensure();

  // Hide the overlay whenever navigation targets a non-admin screen. The
  // synthesis router exposes window.symGo (app.js); it calls its internal
  // render() directly, so wrapping symRender alone misses programmatic nav.
  // Wrapping symGo catches every navigation, including the back button.
  function _patchGo() {
    if (typeof window.symGo !== 'function' || window.symGo.__adminPatched) return;
    var orig = window.symGo;
    var wrapped = function (screen, param) {
      if (screen !== 'admin') hideAdmin();
      return orig.call(this, screen, param);
    };
    wrapped.__adminPatched = true;
    window.symGo = wrapped;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _patchGo);
  } else {
    _patchGo();
  }
  // app.js loads right after us; also try on the next tick in case symGo
  // is defined slightly later.
  setTimeout(_patchGo, 0);
})();
