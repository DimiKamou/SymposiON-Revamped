/* ════════════════════════════════════════════════════════════════════
   syn-hydrate.js — admin content persistence (Firestore ⇄ SymStore)

   The "light" admin panel writes site content to SymStore (localStorage).
   On its own that means content the owner creates is invisible to students
   on other devices and is tied to one browser. This module closes that gap
   WITHOUT touching every admin handler: it listens to the `sym-store` event
   that SymStore.set already dispatches, mirrors a whitelist of admin-content
   keys to a single Firestore doc (config/adminMirror), and hydrates them
   back into SymStore at boot for EVERY visitor.

   Net effect: anything the owner creates/uploads through the admin panel
   reaches students on any device and survives a Firebase Hosting redeploy
   (Hosting deploys never touch Firestore).

   NOT mirrored here: per-user state (favorites/order/progression), sensitive
   data (user_feedback — lives in the support-only `feedback` collection), and
   surfaces already hydrated elsewhere (access_tiers → SymTiers.hydrate,
   banners → banner-bar). Game catalog/content has its own Firestore path
   (siteCatalog / gameContent via content-source.js + Cloud Functions).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Admin-authored, PUBLIC, site-wide content keys.
  var KEYS = [
    'access_control', 'template_assignments', 'admin_pricing', 'admin_flags',
    'admin_messages', 'hero_slides', 'guides', 'custom_acroteria', 'admin_custom_secs',
    'msg_signup', 'msg_sub', 'about_title', 'about_mission',
    'contact_email', 'contact_address', 'contact_hours'
  ];
  var KEYSET = {}; KEYS.forEach(function (k) { KEYSET[k] = true; });

  var MIRROR_DOC = 'adminMirror';   // config/adminMirror
  var _hydrating = false;           // guard: hydration writes must not echo back
  var _pending = {};                // debounced set of changed keys
  var _timer = null;

  function _fs() {
    try { return (typeof firebase !== 'undefined' && firebase && firebase.firestore) ? firebase.firestore() : null; }
    catch (_) { return null; }
  }
  function _ss() { return window.SymStore || null; }
  function _isAdmin() {
    // `isAdmin` is a top-level let in auth.js (a global, not window.isAdmin).
    try { if (typeof isAdmin !== 'undefined' && isAdmin) return true; } catch (_) {}
    try { return document.body.classList.contains('is-admin'); } catch (_) { return false; }
  }

  /* ── MIRROR: admin edits → Firestore (debounced, admin-only) ── */
  function _flush() {
    _timer = null;
    var fs = _fs(), ss = _ss();
    var keys = Object.keys(_pending); _pending = {};
    if (!fs || !ss || !keys.length) return;
    var patch = {};
    keys.forEach(function (k) { patch[k] = ss.get(k, null); });
    patch._updatedAt = Date.now();
    try {
      fs.collection('config').doc(MIRROR_DOC).set(patch, { merge: true })
        .catch(function () { /* offline / rules — local copy still holds */ });
    } catch (_) {}
  }
  function _onStore(e) {
    if (_hydrating) return;
    var key = e && e.detail && e.detail.key;
    if (!key || !KEYSET[key]) return;
    if (!_isAdmin()) return;          // only the owner publishes site content
    _pending[key] = true;
    if (_timer) clearTimeout(_timer);
    _timer = setTimeout(_flush, 800);
  }

  /* ── HYDRATE: Firestore → SymStore at boot (everyone) ── */
  // Legacy per-doc mirrors written by admin-synthesis.js before this module
  // existed, so pre-existing content is still picked up. pick() maps the doc
  // shape to the SymStore value.
  var LEGACY = [
    { key: 'access_control',       doc: 'accessControl',       pick: function (d) { return d; } },
    { key: 'template_assignments', doc: 'templateAssignments', pick: function (d) { return d.items; } },
    { key: 'admin_pricing',        doc: 'pricing',             pick: function (d) { return d; } },
    { key: 'admin_flags',          doc: 'adminFlags',          pick: function (d) { return d; } },
    { key: 'admin_messages',       doc: 'messages',            pick: function (d) { return d.items; } }
  ];

  function _setQuiet(key, val) {
    if (val == null) return false;
    var ss = _ss(); if (!ss) return false;
    _hydrating = true;
    try { ss.set(key, val); } finally { _hydrating = false; }
    return true;
  }

  var _done = false;
  function hydrate() {
    if (_done) return;
    var fs = _fs(); if (!fs) return;   // firebase not ready yet — caller retries
    _done = true;
    var changed = false, seen = {};
    fs.collection('config').doc(MIRROR_DOC).get().then(function (snap) {
      if (snap && snap.exists) {
        var d = snap.data() || {};
        KEYS.forEach(function (k) {
          if (k in d && d[k] != null && _setQuiet(k, d[k])) { changed = true; seen[k] = true; }
        });
      }
    }).catch(function () {}).then(function () {
      return Promise.all(LEGACY.map(function (entry) {
        if (seen[entry.key]) return null;       // consolidated mirror already won
        return fs.collection('config').doc(entry.doc).get().then(function (s) {
          if (s && s.exists) { var v = entry.pick(s.data() || {}); if (_setQuiet(entry.key, v)) changed = true; }
        }).catch(function () {});
      }));
    }).then(function () {
      if (changed) _reRender();
    }).catch(function () {});
  }

  function _reRender() {
    try { if (typeof window.symRender === 'function') window.symRender(); } catch (_) {}
    try { if (window.BannerBar && BannerBar.reload) BannerBar.reload(); } catch (_) {}
  }

  /* ── wire up ── */
  window.addEventListener('sym-store', _onStore);

  // Firebase may finish init after this script loads — poll briefly.
  function _boot(tries) {
    if (_fs()) { hydrate(); return; }
    if (tries <= 0) return;
    setTimeout(function () { _boot(tries - 1); }, 400);
  }
  if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', function () { _boot(25); });
  } else {
    _boot(25);
  }

  window.SynHydrate = { hydrate: hydrate, keys: KEYS };
})();
