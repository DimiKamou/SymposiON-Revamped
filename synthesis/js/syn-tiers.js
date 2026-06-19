/* ════════════════════════════════════════════════════════════════════
   SymposiON · syn-tiers.js — the ACCESS-TIER REGISTRY.
   Single source of truth for the access tiers: the canonical built-ins
   (Free · Student · Teacher · Pro) PLUS admin-created custom tiers. Every
   tier-consuming surface (admin grant, access-control matrix, pricing, the
   runtime gate) reads from here instead of hardcoded arrays — so a new tier
   created in the admin propagates everywhere.

   Custom tiers persist in SymStore ('access_tiers') and mirror to Firestore
   config/tiers ({custom:[...]}). Built-ins cannot be deleted.

   API: SymTiers.all() · .ids() · .byId(id) · .label(id) · .add(gr,en) ·
        .remove(id) · .rank(id) · .meets(userTier, requiredTier) · .hydrate()
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var KEY = 'access_tiers';

  // Canonical built-in tiers (product decision: Free / Student / Teacher / Pro).
  // Array order = rank (higher index unlocks more) for the runtime gate's meets().
  var BUILTIN = [
    { id: 'free',    gr: 'Δωρεάν',    en: 'Free',    builtin: true },
    { id: 'student', gr: 'Μαθητής',   en: 'Student', builtin: true },
    { id: 'teacher', gr: 'Καθηγητής', en: 'Teacher', builtin: true },
    { id: 'pro',     gr: 'Pro',       en: 'Pro',     builtin: true },
  ];

  function _ss() { return window.SymStore; }
  function _custom() { var a = _ss() ? _ss().get(KEY, []) : []; return Array.isArray(a) ? a : []; }
  function _slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }

  function all() {
    var seen = {}, out = [];
    BUILTIN.forEach(function (t) { seen[t.id] = 1; out.push(t); });
    _custom().forEach(function (t) {
      if (t && t.id && !seen[t.id]) { seen[t.id] = 1; out.push({ id: t.id, gr: t.gr || t.id, en: t.en || t.id, builtin: false }); }
    });
    return out;
  }
  function ids() { return all().map(function (t) { return t.id; }); }
  function byId(id) { return all().find(function (t) { return t.id === id; }) || null; }
  function label(id) { var t = byId(id); return t ? { gr: t.gr, en: t.en } : { gr: id, en: id }; }
  function rank(id) { var i = ids().indexOf(id); return i < 0 ? 0 : i; }
  // does a user's tier satisfy a required tier? (free=0 … custom appended above)
  function meets(userTier, requiredTier) {
    if (!requiredTier) return true;                 // no requirement
    return rank(userTier || 'free') >= rank(requiredTier);
  }

  function _save(cur) {
    if (_ss()) _ss().set(KEY, cur);
    try {
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        firebase.firestore().collection('config').doc('tiers')
          .set({ custom: cur, updatedAt: Date.now() }, { merge: true }).catch(function () {});
      }
    } catch (_e) {}
  }
  function add(nameGr, nameEn) {
    var gr = String(nameGr || '').trim(); if (!gr) return null;
    var en = String(nameEn || '').trim() || gr;
    var id = _slug(en) || ('tier-' + Date.now());
    while (ids().indexOf(id) >= 0) id += '-x';
    var cur = _custom(); cur.push({ id: id, gr: gr, en: en, builtin: false });
    _save(cur); return id;
  }
  function remove(id) {
    if (BUILTIN.some(function (t) { return t.id === id; })) return false;  // built-ins are permanent
    _save(_custom().filter(function (t) { return t.id !== id; })); return true;
  }
  // best-effort: pull custom tiers from Firestore once on load
  function hydrate() {
    try {
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        firebase.firestore().collection('config').doc('tiers').get().then(function (s) {
          if (s.exists) { var d = s.data(); if (d && Array.isArray(d.custom) && _ss()) _ss().set(KEY, d.custom); }
        }).catch(function () {});
      }
    } catch (_e) {}
  }

  window.SymTiers = { all: all, ids: ids, byId: byId, label: label, rank: rank, meets: meets, add: add, remove: remove, hydrate: hydrate, BUILTIN: BUILTIN };
  hydrate();
})();
