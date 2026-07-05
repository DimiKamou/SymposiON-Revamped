/* ════════════════════════════════════════════════════════════════════
   admin-synthesis.js — revamp-native LIGHT admin (sc-admin2 design).

   Replaces the Ver1 "Command Center" overlay as the default admin screen by
   registering window.SYM_SCREENS.admin AFTER syn-admin.js (so it wins). Keeps
   the REAL engines wired:
     • Studio  → window.AdminStudio (js/admin-studio.js) mounted in-pane.
     • Atlas   → window.ccOpenAtlas() (js/admin-atlas.js) overlay.
     • Realm   → window.synOpenAcroteria() (js/dir-synthesis.js) + custom-acro.
     • The legacy "Classic Command Center" overlay is REMOVED — its views are
       integrated inline here (Access = Class Plan, Studio, Atlas, Realm).

   NEW — real Access Control (the "Έλεγχος Πρόσβασης" section): a class/bank ×
   game × level matrix. The admin sets the minimum TIER (Free / Pro / School)
   per class and per content-bank, drills into per-game and per-level
   availability, and toggles individual games/levels. Persisted to
   SymStore('access_control', …) and mirrored to Firestore config/accessControl
   when firebase is present (guarded — degrades gracefully in the sandbox).

   Gated end-to-end on the bare global `isAdmin` (auth.js), exactly like
   syn-admin.js. Non-admins are bounced home.

   ── Access Control persisted shape (SymStore key 'access_control') ──
   {
     version: 1,
     updatedAt: <ms>,
     // keyed by class id (gym-a…lyk-c) AND content-bank id (gram-archaia,
     // gram-latin, gram-neo):
     scopes: {
       'gym-a': {
         tier: 'free' | 'pro' | 'school',   // minimum tier to access the scope
         games: {
           '<gameKey>': {                    // gameKey = openFn (synResolveLaunch)
             enabled: true|false,            //   or slug of english name
             tier: 'free'|'pro'|'school'|'', // '' = inherit scope tier
             levels: { '<levelId>': true|false }   // only for level-bank games
           }
         }
       },
       …
     }
   }
   The runtime gate is intentionally NOT wired here (future work); this module
   only authors + persists + reflects the configuration.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var SS = function () { return window.SymStore; };
  var L  = function (o) { return window.L ? window.L(o) : (o && (o.gr || o.en)) || ''; };
  var el = function () { return window.el.apply(null, arguments); };
  var SYM = function () { return window.SYM || {}; };

  /* ── confirm guard for destructive admin actions ──────────────────────
     Native confirm() is used deliberately: the styled cc-confirm scrim only
     exists while the Command Center is mounted, so it's unreliable from the
     synthesis admin panel. This matches the existing confirm() guards in this
     file. Pass a bilingual message; onYes runs only on confirmation. */
  function adminConfirm(msg, onYes) {
    try { if (window.confirm(typeof msg === 'string' ? msg : L(msg))) onYes(); } catch (_) {}
  }

  /* ── tier vocabulary — from the SymTiers registry (Free/Student/Teacher/Pro
     + admin-created custom tiers); fallback list if the module isn't loaded. ── */
  function tierVocab() {
    if (window.SymTiers) return SymTiers.all().map(function (t) { return [t.id, { gr: t.gr, en: t.en }]; });
    return [['free', { gr: 'Δωρεάν', en: 'Free' }], ['student', { gr: 'Μαθητής', en: 'Student' }], ['teacher', { gr: 'Καθηγητής', en: 'Teacher' }], ['pro', { gr: 'Pro', en: 'Pro' }]];
  }

  /* ── Access-Control persistence ───────────────────────────────────── */
  var AC_KEY = 'access_control';
  function acLoad() {
    var st = SS() ? SS().get(AC_KEY, null) : null;
    if (!st || typeof st !== 'object') st = { version: 1, scopes: {} };
    if (!st.scopes) st.scopes = {};
    return st;
  }
  function acSave(st) {
    st.version = 1;
    st.updatedAt = Date.now();
    if (SS()) SS().set(AC_KEY, st);
    acMirror(st);
  }
  // Mirror to Firestore config/accessControl — GUARDED (sandbox has no firebase).
  function acMirror(st) {
    try {
      if (typeof firebase !== 'undefined' && firebase && firebase.firestore) {
        firebase.firestore().collection('config').doc('accessControl')
          .set(st, { merge: true })
          .catch(function () { /* offline / rules — degrade silently */ });
      }
    } catch (_e) { /* no firebase global — fine */ }
  }
  function acScope(st, id) {
    if (!st.scopes[id]) st.scopes[id] = { tier: 'free', games: {} };
    if (!st.scopes[id].games) st.scopes[id].games = {};
    return st.scopes[id];
  }
  function acGame(scope, key) {
    if (!scope.games[key]) scope.games[key] = { enabled: true, tier: '', levels: {} };
    if (!scope.games[key].levels) scope.games[key].levels = {};
    return scope.games[key];
  }

  // Resolve a tile → a stable game key (openFn if known, else slug of en name).
  function gameKey(tile) {
    var fn = (window.synResolveLaunch && window.synResolveLaunch(tile)) || null;
    if (fn) return fn;
    var base = (tile && (tile.en || tile.gr)) || 'game';
    return 'g_' + String(base).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  /* ── The scopes shown in Access Control: 6 grade classes + content banks ── */
  function acScopeList() {
    var sym = SYM();
    var out = [];
    (sym.CLASSES || []).forEach(function (c) {
      out.push({ id: c.id, kind: 'class', label: { gr: c.gr, en: c.en }, accent: c.accent });
    });
    // content banks (grammar/theory + Νέα Ελληνικά)
    (sym.GRAMMAR || []).forEach(function (gr) {
      out.push({ id: gr.id, kind: 'bank', label: { gr: gr.gr, en: gr.en }, accent: gr.accent });
    });
    return out;
  }
  // Subjects/games for a scope id. Uses SYM.SUBJECTS (keyed by class/bank id).
  function acSubjects(id) {
    var subs = (SYM().SUBJECTS || {})[id];
    return Array.isArray(subs) ? subs : [];
  }

  /* ── Template assignments (admin assigns a Trivia/Istoria template to a
     class+subject → student tile, consumed by js/syn-assignments.js). Stored
     in SymStore + a single guarded Firestore mirror config/templateAssignments. */
  function taLoad() { var a = SS() ? SS().get('template_assignments', []) : []; return Array.isArray(a) ? a : []; }
  function taSave(arr) {
    if (SS()) SS().set('template_assignments', arr);
    try { if (fsReady()) firebase.firestore().collection('config').doc('templateAssignments').set({ items: arr, updatedAt: Date.now() }, { merge: true }).catch(function () {}); } catch (_e) {}
  }

  /* ════════════════ REAL STATS (no fake demo numbers) ═════════════════
     Games  → real count of launchable games (window.SYN_GAMES) or, failing
              that, distinct game tiles authored across SYM.SUBJECTS.
     Users / Subscribers / MRR / Churn → Firestore when present (GUARDED),
              otherwise an HONEST local value (0 / SymStore-tracked). Never
              invents 3.218 / €5.4k. Async Firestore results patch the DOM
              live via statSet(...). */
  function fsReady() {
    try { return typeof firebase !== 'undefined' && !!(firebase && firebase.firestore); }
    catch (_e) { return false; }
  }
  // Real games count from authored data (never a hardcoded 41).
  function gamesCount() {
    var n = 0;
    try { n = Object.keys(window.SYN_GAMES || {}).length; } catch (_e) { n = 0; }
    if (n > 0) return n;
    // Fallback: distinct game tiles across all subjects (by stable game key).
    var seen = {}, subj = (SYM().SUBJECTS || {});
    Object.keys(subj).forEach(function (cid) {
      (subj[cid] || []).forEach(function (s) {
        (s.games || []).forEach(function (tile) { seen[gameKey(tile)] = 1; });
      });
    });
    return Object.keys(seen).length;
  }
  // Locally-tracked honest counters (start at 0; trigger sites may bump them).
  function localStat(key) {
    var v = SS() ? SS().get(key, 0) : 0;
    return (typeof v === 'number' && isFinite(v)) ? v : 0;
  }
  // Patch every rendered copy of a named stat value in the live DOM.
  function statSet(name, text) {
    try {
      document.querySelectorAll('.sc-stat__v[data-stat="' + name + '"]').forEach(function (n) {
        n.textContent = text;
      });
    } catch (_e) { /* DOM gone — fine */ }
  }
  // Fire Firestore count queries (GUARDED) and patch the DOM when they return.
  // Each collection's size is the real metric; degrades silently with no firebase.
  function loadFirestoreStats() {
    if (!fsReady()) return;
    var db;
    try { db = firebase.firestore(); } catch (_e) { return; }
    function count(coll, cb) {
      try {
        var c = db.collection(coll);
        // Prefer the lightweight count() aggregate when available.
        if (typeof c.count === 'function') {
          c.count().get().then(function (snap) {
            try { cb(snap.data().count); } catch (_e) { cb(null); }
          }).catch(function () { cb(null); });
        } else {
          c.get().then(function (snap) { cb(snap.size); }).catch(function () { cb(null); });
        }
      } catch (_e) { cb(null); }
    }
    count('users', function (n) {
      if (n != null) statSet('users', String(n));
    });
    // Active subscriptions + MRR derived from real subscription docs.
    try {
      db.collection('subscriptions').where('status', '==', 'active').get()
        .then(function (snap) {
          var active = snap.size, mrr = 0;
          snap.forEach(function (d) {
            var v = d.data() || {};
            var p = Number(v.priceMonthly != null ? v.priceMonthly : v.price);
            if (isFinite(p)) mrr += p;
          });
          statSet('subs', String(active));
          statSet('mrr', '€' + (mrr >= 1000 ? (mrr / 1000).toFixed(1) + 'k' : String(Math.round(mrr))));
        })
        .catch(function () { /* rules/offline — keep local */ });
    } catch (_e) { /* no firebase — fine */ }
  }

  /* ════════════════ BULK GRANT (CSV upload + template) ═══════════════
     Grants persist to SymStore('access_grants', []) and mirror to Firestore
     collection 'accessGrants' (GUARDED). CSV columns: email,role,class,tier,
     duration. Parser handles commas/semicolons, a header row and quoted
     fields (ported approach from admin-studio.js's ccQImport*). */
  var GRANT_KEY = 'access_grants';
  var GRANT_ROLES = ['student', 'teacher', 'admin'];
  function grantTiers() { return window.SymTiers ? SymTiers.ids() : ['free', 'student', 'teacher', 'pro']; }
  function grantsLoad() {
    var arr = SS() ? SS().get(GRANT_KEY, []) : [];
    return Array.isArray(arr) ? arr : [];
  }
  function grantsSave(arr) {
    if (SS()) SS().set(GRANT_KEY, arr);
    try {
      if (fsReady()) {
        var db = firebase.firestore();
        arr.forEach(function (g) {
          if (!g || !g.email) return;
          db.collection('accessGrants').doc(String(g.email).toLowerCase())
            .set(g, { merge: true })
            .catch(function () { /* offline / rules — degrade silently */ });
        });
      }
    } catch (_e) { /* no firebase — fine */ }
  }
  // Client-side download via Blob + object URL (no server).
  function csvDownload(filename, text) {
    try {
      var url = URL.createObjectURL(new Blob([text], { type: 'text/csv;charset=utf-8' }));
      var a = document.createElement('a'); a.href = url; a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(function () { try { URL.revokeObjectURL(url); a.remove(); } catch (_e) {} }, 0);
      return true;
    } catch (_e) { return false; }
  }
  function grantTemplateCSV() {
    return 'email,role,class,tier,duration\n'
      + 'student@example.com,student,Β΄ Γυμνασίου,pro,12m\n'
      + 'teacher@example.com,teacher,Όλες,teacher,perm\n';
  }
  // RFC-ish CSV: comma OR semicolon delimiter, quoted fields, header row.
  function parseCSV(text) {
    var nl = text.indexOf('\n'); var first = nl < 0 ? text : text.slice(0, nl);
    var cnt = function (ch) { return first.split(ch).length - 1; };
    var delim = ','; if (cnt(';') > cnt(',')) delim = ';'; else if (cnt('\t') > cnt(',')) delim = '\t';
    var rows = [], row = [], field = '', inQ = false;
    for (var i = 0; i < text.length; i++) {
      var c = text[i];
      if (inQ) {
        if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
        else field += c;
      } else if (c === '"') inQ = true;
      else if (c === delim) { row.push(field); field = ''; }
      else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
      else if (c !== '\r') field += c;
    }
    if (field !== '' || row.length) { row.push(field); rows.push(row); }
    return rows;
  }
  function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(s || '').trim()); }
  // Parse a grant CSV → [{email,role,class,tier,duration,ok,err}] (preview rows).
  function parseGrantCSV(text) {
    text = String(text || '').replace(/^﻿/, '');
    var table = parseCSV(text);
    var out = [];
    if (!table.length) return out;
    var start = 0;
    var h0 = String(table[0][0] || '').trim().toLowerCase();
    if (h0 === 'email' || h0 === 'e-mail') start = 1;
    for (var r = start; r < table.length; r++) {
      var cells = table[r];
      if (!cells || cells.every(function (c) { return String(c).trim() === ''; })) continue;
      var email = String(cells[0] || '').trim();
      var role = String(cells[1] || 'student').trim().toLowerCase();
      var klass = String(cells[2] || '').trim();
      var tier = String(cells[3] || 'pro').trim().toLowerCase();
      var dur = String(cells[4] || '').trim();
      var errs = [];
      if (!validEmail(email)) errs.push('email');
      if (role && GRANT_ROLES.indexOf(role) < 0) errs.push('role');
      if (tier && grantTiers().indexOf(tier) < 0) errs.push('tier');
      out.push({
        email: email, role: role || 'student', 'class': klass,
        tier: tier || 'pro', duration: dur,
        ok: errs.length === 0, err: errs
      });
    }
    return out;
  }

  /* ════════════════ PRICING (real — config/pricing) ═════════════════
     Source of truth = Firestore config/pricing (the SAME doc the legacy CC
     writes via admin.js adminSavePricing). Shape:
       { <planKey>: {1:€,3:€,6:€,12:€}, free:{…0…},
         _customPlans:[...], _labels:{key:{gr,en}},
         _kinds:{key:'tier'|'bundle'|'family'},   // plan kind
         _unlocks:{key:{tier,classId,levels}},    // what the plan grants
         _bundles:[{id,gr,en,plans:[key…],price,save}],
         _family:{enabled,addonPct,parentRead}     // family/multi-class options
       }
     Mirrored to SymStore('admin_pricing') so the sandbox/offline editor works.
     Plans always declare a TIER from SymTiers — never hardcoded. */
  var PRICING_KEY = 'admin_pricing';
  var PRICE_MONTHS = [1, 3, 6, 12];
  function pricingLoad() {
    var st = SS() ? SS().get(PRICING_KEY, null) : null;
    if (!st || typeof st !== 'object') st = {};
    if (!Array.isArray(st._customPlans)) st._customPlans = [];
    if (!st._labels || typeof st._labels !== 'object') st._labels = {};
    if (!st._kinds || typeof st._kinds !== 'object') st._kinds = {};
    if (!st._unlocks || typeof st._unlocks !== 'object') st._unlocks = {};
    if (!Array.isArray(st._bundles)) st._bundles = [];
    if (!st._family || typeof st._family !== 'object') st._family = { enabled: false, addonPct: 50, parentRead: false, parentEmail: '' };
    return st;
  }
  function pricingSave(st) {
    st.updatedAt = Date.now();
    if (SS()) SS().set(PRICING_KEY, st);
    // Guarded Firestore mirror to config/pricing — same doc as admin.js.
    // Strip undefined; Firestore rejects them. Degrades silently offline.
    try {
      if (fsReady()) {
        firebase.firestore().collection('config').doc('pricing')
          .set(st, { merge: true })
          .catch(function () { /* offline / rules — SymStore is the fallback */ });
      }
    } catch (_e) { /* no firebase — fine */ }
  }
  // Best-effort: pull config/pricing from Firestore once and merge into SymStore
  // so the editor reflects what the legacy CC / prod saved (guarded, async).
  function pricingHydrate(after) {
    if (!fsReady()) { if (after) after(); return; }
    try {
      firebase.firestore().collection('config').doc('pricing').get()
        .then(function (s) {
          if (s.exists && SS()) {
            var d = s.data() || {};
            // Keep our editor-only meta keys if remote lacks them.
            var cur = pricingLoad();
            ['_kinds', '_unlocks', '_bundles', '_family'].forEach(function (k) {
              if (d[k] == null && cur[k] != null) d[k] = cur[k];
            });
            SS().set(PRICING_KEY, d);
          }
          if (after) after();
        })
        .catch(function () { if (after) after(); });
    } catch (_e) { if (after) after(); }
  }
  function planKeys(st) {
    // Built-in plan keys (student/teacher) + any custom plans, de-duped.
    var seen = {}, out = [];
    ['student', 'teacher'].forEach(function (k) { seen[k] = 1; out.push(k); });
    (st._customPlans || []).forEach(function (k) { if (k && !seen[k]) { seen[k] = 1; out.push(k); } });
    return out;
  }
  function planLabel(st, key) {
    var l = st._labels && st._labels[key];
    if (l && typeof l === 'object') return l;
    if (typeof l === 'string') return { gr: l, en: l };
    var defs = { student: { gr: 'Μαθητής', en: 'Student' }, teacher: { gr: 'Καθηγητής', en: 'Teacher' } };
    return defs[key] || { gr: key, en: key };
  }

  /* ════════════════ COUPONS (real — 'coupons' collection) ════════════
     A code has a % discount, a maxUses cap, and a real validity WINDOW
     (validFrom + validUntil, each with time-of-day). Source of truth =
     Firestore 'coupons' collection (the SAME the legacy admin.js writes).
     Mirrored to SymStore('discount_codes') so the editor works offline.
     Public checkout redemption is unchanged (Stripe wired later). */
  var COUPON_KEY = 'discount_codes';
  function couponsLoad() {
    var arr = SS() ? SS().get(COUPON_KEY, []) : [];
    return Array.isArray(arr) ? arr : [];
  }
  function couponsSaveLocal(arr) { if (SS()) SS().set(COUPON_KEY, arr); }
  // Mirror ONE coupon to Firestore (guarded). Stores discount + maxUses
  // (rule-validated) plus the validFrom/validUntil window + active flag.
  function couponMirror(c) {
    try {
      if (!fsReady()) return;
      var fb = firebase.firestore;
      var doc = {
        code: c.code, discount: c.discount, type: 'percentage',
        maxUses: c.maxUses || 0, usedCount: c.usedCount || 0,
        active: c.active !== false,
      };
      // validFrom / validUntil are stored as Firestore Timestamps when possible,
      // else as epoch-ms numbers (kept readable by both admin surfaces).
      if (c.validFrom) doc.validFrom = _ts(c.validFrom);
      if (c.validUntil) { doc.validUntil = _ts(c.validUntil); doc.expiresAt = _ts(c.validUntil); }
      firebase.firestore().collection('coupons').doc(c.code).set(doc, { merge: true })
        .catch(function () { /* offline / rules — SymStore is the fallback */ });
    } catch (_e) { /* no firebase — fine */ }
  }
  function _ts(ms) {
    try {
      if (typeof firebase !== 'undefined' && firebase.firestore && firebase.firestore.Timestamp) {
        return firebase.firestore.Timestamp.fromMillis(Number(ms));
      }
    } catch (_e) {}
    return Number(ms);
  }
  function couponDelete(code) {
    try {
      if (fsReady()) {
        firebase.firestore().collection('coupons').doc(code).delete()
          .catch(function () {});
      }
    } catch (_e) {}
  }
  function couponSetActive(code, active) {
    try {
      if (fsReady()) {
        firebase.firestore().collection('coupons').doc(code).set({ active: !!active }, { merge: true })
          .catch(function () {});
      }
    } catch (_e) {}
  }
  // Best-effort: pull existing coupons from Firestore once → merge into SymStore.
  function couponsHydrate(after) {
    if (!fsReady()) { if (after) after(); return; }
    try {
      firebase.firestore().collection('coupons').limit(50).get()
        .then(function (snap) {
          if (!snap.empty && SS()) {
            var arr = [];
            snap.forEach(function (d) {
              var v = d.data() || {};
              arr.push({
                code: v.code || d.id,
                discount: Number(v.discount) || 0,
                maxUses: Number(v.maxUses) || 0,
                usedCount: Number(v.usedCount) || 0,
                active: v.active !== false,
                validFrom: _msOf(v.validFrom),
                validUntil: _msOf(v.validUntil != null ? v.validUntil : v.expiresAt),
              });
            });
            SS().set(COUPON_KEY, arr);
          }
          if (after) after();
        })
        .catch(function () { if (after) after(); });
    } catch (_e) { if (after) after(); }
  }
  function _msOf(v) {
    if (v == null) return null;
    if (typeof v === 'number') return v;
    try { if (typeof v.toMillis === 'function') return v.toMillis(); } catch (_e) {}
    try { if (typeof v.toDate === 'function') return v.toDate().getTime(); } catch (_e) {}
    var n = Date.parse(v); return isFinite(n) ? n : null;
  }
  // <input type="datetime-local"> value (local, no TZ) ↔ epoch ms.
  function dtToMs(s) { if (!s) return null; var n = new Date(s).getTime(); return isFinite(n) ? n : null; }
  function msToDt(ms) {
    if (ms == null) return '';
    try {
      var d = new Date(Number(ms)); if (isNaN(d.getTime())) return '';
      var pad = function (x) { return String(x).padStart(2, '0'); };
      return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + ':' + pad(d.getMinutes());
    } catch (_e) { return ''; }
  }
  function couponStatus(c, now) {
    now = now || Date.now();
    if (c.active === false) return { id: 'inactive', gr: 'Ανενεργός', en: 'Inactive' };
    if (c.validFrom && now < c.validFrom) return { id: 'pending', gr: 'Προγραμματισμένος', en: 'Scheduled' };
    if (c.validUntil && now > c.validUntil) return { id: 'expired', gr: 'Έληξε', en: 'Expired' };
    if (c.maxUses && (c.usedCount || 0) >= c.maxUses) return { id: 'used', gr: 'Εξαντλήθηκε', en: 'Used up' };
    return { id: 'active', gr: 'Ενεργός', en: 'Active' };
  }

  /* ════════════════ ADMIN FLAGS (persisted toggles) ══════════════════
     Tartarus + platform Settings switches persist to SymStore('admin_flags')
     and mirror to Firestore config/adminFlags (guarded). Consumers read the
     live value via window.adminFlag(key, fallback). */
  var FLAGS_KEY = 'admin_flags';
  function adminFlagsAll() { var o = SS() ? SS().get(FLAGS_KEY, {}) : {}; return (o && typeof o === 'object') ? o : {}; }
  function adminFlagGet(key, def) { var o = adminFlagsAll(); return (key in o) ? !!o[key] : !!def; }
  function adminFlagSet(key, val) {
    var o = adminFlagsAll(); o[key] = !!val;
    if (SS()) SS().set(FLAGS_KEY, o);
    try {
      if (fsReady()) {
        firebase.firestore().collection('config').doc('adminFlags')
          .set(o, { merge: true }).catch(function () {});
      }
    } catch (_e) {}
  }
  // Public reader so runtime code (signups gate, maintenance mode, …) can honour
  // these admin switches without re-reading SymStore everywhere.
  window.adminFlag = function (key, def) { return adminFlagGet(key, def); };

  /* ════════════════ ACTIVITY FEED (real, aggregated) ═════════════════
     Overview «Πρόσφατη δραστηριότητα» aggregates timestamped events from the
     stores we actually own — admin_messages, access_grants, user_feedback,
     template_assignments + banner changes — newest first. No demo strings;
     honest empty state when there is nothing yet. */
  function activityFeed(limit) {
    var out = [];
    function push(ts, ic, t) { if (ts && isFinite(ts)) out.push({ ts: ts, ic: ic, t: t }); }
    try {
      (SS() ? SS().get('admin_messages', []) : []).forEach(function (m) {
        push(m.ts, '✉', L({ gr: 'Μήνυμα: ', en: 'Message: ' }) + (m.title || m.body || ''));
      });
    } catch (_e) {}
    try {
      (SS() ? SS().get(GRANT_KEY, []) : []).forEach(function (g) {
        push(g.ts, '✦', L({ gr: 'Χορήγηση πρόσβασης · ', en: 'Access granted · ' }) + (g.email || '') + (g.tier ? ' (' + g.tier + ')' : ''));
      });
    } catch (_e) {}
    try {
      (SS() ? SS().get('user_feedback', []) : []).forEach(function (f) {
        push(f.ts, '☆', L({ gr: 'Σχόλιο · ', en: 'Feedback · ' }) + (f.n || L({ gr: 'Ανώνυμος', en: 'Anonymous' })));
      });
    } catch (_e) {}
    try {
      (SS() ? SS().get('template_assignments', []) : []).forEach(function (a) {
        push(a.ts, '⚱', L({ gr: 'Ανάθεση προτύπου · ', en: 'Template assigned · ' }) + (a.label ? L(a.label) : a.type || ''));
      });
    } catch (_e) {}
    try {
      (SS() ? SS().get('site_banners', []) : []).forEach(function (b) {
        var ts = b.updatedAt || b.createdAt || b.ts;
        push(ts, '◰', L({ gr: 'Banner · ', en: 'Banner · ' }) + (b.title || b.text || ''));
      });
    } catch (_e) {}
    try {
      (SS() ? SS().get(COUPON_KEY, []) : []).forEach(function (c) {
        push(c.ts, '%', L({ gr: 'Εκπτωτικός κωδικός · ', en: 'Coupon · ' }) + (c.code || '') + (c.discount ? ' −' + c.discount + '%' : ''));
      });
    } catch (_e) {}
    out.sort(function (a, b) { return b.ts - a.ts; });
    return out.slice(0, limit || 12);
  }
  function relTime(ts) {
    var s = Math.max(0, Math.round((Date.now() - ts) / 1000));
    if (s < 60) return L({ gr: 'τώρα', en: 'now' });
    var m = Math.round(s / 60); if (m < 60) return m + '′';
    var h = Math.round(m / 60); if (h < 24) return h + L({ gr: 'ω', en: 'h' });
    var d = Math.round(h / 24); return d + L({ gr: 'μ', en: 'd' });
  }

  /* ════════════════ MAIN SCREEN ════════════════════════════════════ */
  function adminScreen(home /*, ctx */) {
    // Admin-only — bounce non-admins home.
    if (typeof isAdmin === 'undefined' || !isAdmin) {
      if (window.symGo) setTimeout(function () { window.symGo('home'); }, 0);
      return;
    }
    // We render our own light page → make sure the Ver1 overlay is hidden.
    if (window.synHideAdmin) window.synHideAdmin();

    var accent = '#6E8B3D';
    var P = window.synPage;
    var SymStore = SS();
    var go = function (s, p) { return window.symGo(s, p); };
    var glyph = function (name, cls) { return el('span', { class: cls || 'sc-gl', 'data-illu': name }); };
    var stat = function (v, label, ac, name) {
      var vEl = el('div', { class: 'sc-stat__v' }, v);
      if (name) vEl.setAttribute('data-stat', name);
      return el('div', { class: 'sc-stat has-accent', style: '--ca:' + (ac || accent) },
        [vEl, el('div', { class: 'sc-stat__l' }, label)]);
    };

    var body = P(home, {
      back: 'home', accent: accent,
      eyebrow: L({ gr: 'Κέντρο Διοίκησης', en: 'Command Center' }),
      title: L({ gr: 'Διαχείριση', en: 'Admin' }),
      sub: L({ gr: 'Revamp-native — πραγματικές λειτουργίες.', en: 'Revamp-native — real functions.' }),
    });

    // Top stat band + Sync. REAL values only — games is
    // computed from authored data; users/subs/MRR start from honest local
    // counters and are patched live when Firestore answers (loadFirestoreStats).
    body.appendChild(el('div', { class: 'sc-stats sc-stats--4 sc-stagger' }, [
      stat(String(localStat('stat_users')), L({ gr: 'Χρήστες', en: 'Users' }), accent, 'users'),
      stat(String(localStat('stat_subs')), L({ gr: 'Συνδρομές', en: 'Subscribers' }), accent, 'subs'),
      stat('€' + String(localStat('stat_mrr')), 'MRR', accent, 'mrr'),
      stat(String(gamesCount()), L({ gr: 'Παιχνίδια', en: 'Games' }), accent, 'games'),
    ]));
    // Kick off the guarded Firestore reads; they patch the DOM when they return.
    loadFirestoreStats();
    body.appendChild(el('div', { class: 'sc-adminx__bar sc-stagger' }, [
      // Global Sync — bust caches + re-pull catalog/datasets/games, then re-render
      // the admin so newly-added games/content appear without a page reload.
      el('button', {
        class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function (e) {
          var btn = e.currentTarget;
          try {
            if (window.ContentSource) {
              if (ContentSource.bustCache) ContentSource.bustCache();
              if (ContentSource.loadCatalog) { try { ContentSource.loadCatalog(true); } catch (_) {} }
            }
            if (typeof window.ccRefreshCurriculum === 'function') { try { window.ccRefreshCurriculum(); } catch (_) {} }
            if (window.RealmStore && RealmStore.getCatalog) { try { RealmStore.getCatalog(); } catch (_) {} }
          } catch (_) {}
          btn.textContent = '✓ ' + L({ gr: 'Συγχρονίστηκε', en: 'Synced' });
          setTimeout(function () { if (window.symRender) symRender(); }, 400);
        }
      }, [L({ gr: '↻ Συγχρονισμός', en: '↻ Sync' })]),
      // Classic Command Center button removed — the old admin-cc views are now
      // integrated INLINE in this light admin (Access = Class Plan, Studio, etc.),
      // so there is no separate legacy overlay to open.
    ]));

    var shell = el('div', { class: 'sc-admin2 sc-stagger has-accent', style: '--ca:' + accent });
    var rail = el('div', { class: 'sc-admin2__rail' });
    var pane = el('div', { class: 'sc-admin2__pane' });

    // Rail search — live-filter the 21+ section buttons (paint() rebuilds only
    // the pane, so this input + its query persist across section navigation).
    var railSearch = el('input', {
      class: 'sc-field__i', type: 'search',
      style: 'margin:0 0 10px;width:100%;box-sizing:border-box',
      placeholder: L({ gr: 'Αναζήτηση ενότητας…', en: 'Search sections…' }),
      oninput: function (e) {
        var q = (e.target.value || '').trim().toLowerCase();
        rail.querySelectorAll('.sc-admin2__nav').forEach(function (b) {
          b.style.display = (!q || (b.textContent || '').toLowerCase().indexOf(q) >= 0) ? '' : 'none';
        });
      }
    });
    rail.appendChild(railSearch);

    var sections = [
      ['overview', '◷', { gr: 'Επισκόπηση', en: 'Overview' }],
      ['grant', '✦', { gr: 'Χορήγηση Πρόσβασης', en: 'Grant Access' }],
      ['kleos', '✧', { gr: 'Χορήγηση Kleos', en: 'Grant Kleos' }],
      ['users', '◆', { gr: 'Χρήστες', en: 'Users' }],
      ['access', '◫', { gr: 'Έλεγχος Πρόσβασης', en: 'Access Control' }],
      ['pricing', '€', { gr: 'Τιμολόγηση', en: 'Pricing' }],
      ['discounts', '%', { gr: 'Εκπτωτικοί Κωδικοί', en: 'Discount Codes' }],
      ['subs', '◷', { gr: 'Συνδρομές', en: 'Subscriptions' }],
      ['studio', '✎', { gr: 'Studio (Περιεχόμενο)', en: 'Studio (Content)' }],
      ['aisources', '✸', { gr: 'AI Πηγές · Βιβλία', en: 'AI Sources · Books' }],
      ['voyage', '⚱', { gr: 'Πρότυπα', en: 'Templates' }],
      ['realm', '⛩', { gr: 'Curator · Ναός', en: 'Curator · Realm' }],
      ['games', '▦', { gr: 'Παιχνίδια — Έλεγχος', en: 'Games — Review' }],
      ['arcade', '⚔', { gr: 'Arcade — Ραψωδίες', en: 'Arcade — Rhapsodies' }],
      ['tags', '#', { gr: 'Ετικέτες Παιχνιδιών', en: 'Game Tags' }],
      ['tartarus', '❂', { gr: 'Tartarus', en: 'Tartarus' }],
      ['banners', '◰', { gr: 'Banners', en: 'Banners' }],
      ['messaging', '✉', { gr: 'Μηνύματα', en: 'Messages' }],
      ['hero', '◳', { gr: 'Hero Carousel', en: 'Hero Carousel' }],
      ['about', 'ⓘ', { gr: 'Σχετικά', en: 'About' }],
      ['feedback', '☆', { gr: 'Σχόλια', en: 'Feedback' }],
      ['guides', '☰', { gr: 'Οδηγοί', en: 'Guides' }],
      ['atlas', '⌘', { gr: 'Atlas · Έκτακτα', en: 'Atlas · Emergency' }],
      ['settings', '⚙', { gr: 'Ρυθμίσεις', en: 'Settings' }],
    ];
    var activeSec = window.__adminSec || 'overview';
    function railBtn(id, ic, lab) {
      return el('button', {
        class: 'sc-admin2__nav' + (id === activeSec ? ' active' : ''), 'data-s': id,
        onclick: function () {
          activeSec = id; window.__adminSec = id;
          rail.querySelectorAll('.sc-admin2__nav').forEach(function (b) { b.classList.toggle('active', b.dataset.s === id); });
          paint();
        }
      }, [el('span', { class: 'sc-admin2__ic' }, ic), L(lab)]);
    }
    sections.forEach(function (s) { rail.appendChild(railBtn(s[0], s[1], s[2])); });
    (SymStore ? SymStore.get('admin_custom_secs', []) : []).forEach(function (s) {
      sections.push([s.id, '◦', { gr: s.nm, en: s.nm }]);
      rail.appendChild(railBtn(s.id, '◦', { gr: s.nm, en: s.nm }));
    });
    rail.appendChild(el('div', { class: 'sc-admin2__railfoot' }, [
      // ISSUE 7: the "＋ Νέα ενότητα / Add section" creator was removed — it only
      // ever produced an EMPTY placeholder section (real sections are added in
      // code). The rail-edit toggle below is kept, and any custom sections users
      // already saved still render + are deletable via the ✎ edit "×".
      el('button', {
        class: 'sc-admin2__add', onclick: function () { window.__adminRailEdit = !window.__adminRailEdit; symRender(); }
      }, [el('span', { class: 'sc-admin2__ic' }, '✎'), window.__adminRailEdit ? L({ gr: 'Τέλος', en: 'Done' }) : L({ gr: 'Επεξεργασία', en: 'Edit' })]),
    ]));
    if (window.__adminRailEdit) {
      rail.querySelectorAll('.sc-admin2__nav').forEach(function (b) {
        b.classList.add('editing');
        var x = el('span', { class: 'sc-admin2__del', onclick: function (e) { e.stopPropagation(); if (!SymStore) return; var cur = SymStore.get('admin_custom_secs', []).filter(function (s) { return s.id !== b.dataset.s; }); SymStore.set('admin_custom_secs', cur); symRender(); } }, '×');
        b.appendChild(x);
      });
    }
    shell.appendChild(rail); shell.appendChild(pane);
    body.appendChild(shell);

    /* ── small reusable bits (ported from screens-2.js S.admin) ── */
    // toggleRow(label, on[, key]) — when `key` is given, the switch is BACKED by
    // SymStore('admin_flags').<key>: it initialises from the stored value and
    // persists (+ guarded Firestore mirror config/adminFlags) on every flip, so
    // the state survives re-renders. Consuming code can read window.adminFlag(key).
    function toggleRow(label, on, key) {
      var stored = key ? adminFlagGet(key, !!on) : !!on;
      var t = el('button', { class: 'sc-toggle' + (stored ? ' on' : ''), onclick: function (e) {
        var nowOn = !e.currentTarget.classList.contains('on');
        e.currentTarget.classList.toggle('on', nowOn);
        if (key) adminFlagSet(key, nowOn);
      } }, [el('span', { class: 'sc-toggle__k' })]);
      return el('div', { class: 'sc-adrow' }, [el('span', {}, L(label)), t]);
    }
    function field2(label, ph) { return el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, label), el('input', { class: 'sc-field__i', placeholder: ph })]); }
    function rowSel(label, opts) { var s = el('select', { class: 'sc-field__i sc-select' }, opts.map(function (o) { return el('option', {}, o); })); return el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, label), s]); }
    function atlasRow(ic, label, on) { return el('div', { class: 'sc-adrow' }, [el('span', {}, [el('span', { style: 'margin-right:8px' }, ic), label]), el('button', { class: 'sc-toggle' + (on ? ' on' : ''), onclick: function (e) { e.currentTarget.classList.toggle('on'); } }, [el('span', { class: 'sc-toggle__k' })])]); }
    function msgEditor(key, label, def) {
      var wrap = el('div', { class: 'sc-msg' });
      wrap.appendChild(el('div', { class: 'sc-cfg__l' }, L(label)));
      var ta = el('textarea', { class: 'sc-textarea', rows: '3' }, SymStore ? SymStore.get(key, def) : def);
      ta.addEventListener('blur', function () { if (SymStore) SymStore.set(key, ta.value); });
      wrap.appendChild(ta);
      wrap.appendChild(el('div', { class: 'sc-msg__foot' }, [
        el('button', { class: 'sc-mini', onclick: function () { if (window.SymPreview) SymPreview.open('mc', { title: L({ gr: 'Προεπισκόπηση', en: 'Preview' }), note: (ta.value || def).replace('{name}', 'Μαρία').replace('{plan}', 'Pro').replace('{expiry}', '12/2026') }); } }, L({ gr: 'Προεπισκόπηση', en: 'Preview' })),
        el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () { if (SymStore) SymStore.set(key, ta.value); } }, L({ gr: 'Αποθήκευση', en: 'Save' })),
      ]));
      return wrap;
    }
    function aboutField(key, label, def, multi) {
      var wrap = el('div', { class: 'sc-msg' });
      wrap.appendChild(el('div', { class: 'sc-cfg__l' }, L(label)));
      var inp = multi ? el('textarea', { class: 'sc-textarea', rows: '3' }, SymStore ? SymStore.get(key, def) : def) : el('input', { class: 'sc-field__i', value: SymStore ? SymStore.get(key, def) : def });
      inp.addEventListener('blur', function () { if (SymStore) SymStore.set(key, inp.value); });
      wrap.appendChild(inp);
      return wrap;
    }

    /* ════════════════ ACCESS CONTROL (real) ════════════════════════ */
    function renderAccessControl() {
      pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Έλεγχος Πρόσβασης — ανά τάξη, παιχνίδι & επίπεδο', en: 'Access Control — per class, game & level' })));
      pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({
        gr: 'Όρισε το ελάχιστο πακέτο (Δωρεάν / Pro / School) ανά τάξη ή τράπεζα περιεχομένου, και κατέβα σε επίπεδο παιχνιδιού/level. Οι αλλαγές αποθηκεύονται τοπικά (SymStore) και συγχρονίζονται στο Firestore όταν υπάρχει σύνδεση.',
        en: 'Set the minimum tier (Free / Pro / School) per class or content bank, then drill into per-game and per-level availability. Changes persist locally (SymStore) and sync to Firestore when connected.'
      })));

      var st = acLoad();
      var scopes = acScopeList();
      var fsOk = (function () { try { return typeof firebase !== 'undefined' && !!(firebase && firebase.firestore); } catch (_e) { return false; } })();
      pane.appendChild(el('div', { class: 'sc-ac__status' }, [
        el('span', { class: 'sc-ac__dot' + (fsOk ? ' on' : '') }),
        L(fsOk ? { gr: 'Συγχρονισμός Firestore ενεργός', en: 'Firestore sync active' }
               : { gr: 'Τοπική αποθήκευση (χωρίς firebase εδώ)', en: 'Local-only (no firebase here)' }),
      ]));

      function tierPills(curTier, allowInherit, onPick) {
        var row = el('div', { class: 'sc-pill2-row' });
        if (allowInherit) {
          row.appendChild(el('button', { class: 'sc-pill2 sc-pill2--inherit' + (curTier === '' ? ' on' : ''), onclick: function () { onPick(''); } }, L({ gr: 'Κληρ.', en: 'Inherit' })));
        }
        tierVocab().forEach(function (t) {
          row.appendChild(el('button', {
            class: 'sc-pill2 sc-pill2--' + t[0] + (curTier === t[0] ? ' on' : ''),
            onclick: function () { onPick(t[0]); }
          }, L(t[1])));
        });
        return row;
      }

      var wrap = el('div', { class: 'sc-ac' });
      pane.appendChild(wrap);

      function paintMatrix() {
        wrap.innerHTML = '';
        scopes.forEach(function (sc) {
          var scope = acScope(st, sc.id);
          var card = el('div', { class: 'sc-ac__scope' });
          var expanded = window.__acOpen === sc.id;
          // header: scope name + scope tier pills + expand caret
          var head = el('div', { class: 'sc-ac__head' }, [
            el('button', {
              class: 'sc-ac__name', onclick: function () { window.__acOpen = expanded ? null : sc.id; paintMatrix(); }
            }, [el('span', { class: 'sc-ac__caret' }, expanded ? '▾' : '▸'),
                el('b', {}, L(sc.label)),
                el('span', { class: 'sc-ac__kind' }, sc.kind === 'bank' ? L({ gr: 'τράπεζα', en: 'bank' }) : L({ gr: 'τάξη', en: 'class' }))]),
            tierPills(scope.tier, false, function (tier) { scope.tier = tier; acSave(st); paintMatrix(); }),
          ]);
          card.appendChild(head);

          if (expanded) {
            var subs = acSubjects(sc.id);
            if (!subs.length) {
              card.appendChild(el('p', { class: 'sc-hint', style: 'margin:8px 0 0' }, L({ gr: 'Δεν υπάρχουν μαθήματα γι’ αυτήν την τράπεζα ακόμη.', en: 'No subjects for this bank yet.' })));
            }
            subs.forEach(function (subj) {
              card.appendChild(el('div', { class: 'sc-ac__subj' }, L(subj)));
              (subj.games || []).forEach(function (tile) {
                var key = gameKey(tile);
                var gcfg = acGame(scope, key);
                var bank = (SYM().levelBankFor && SYM().levelBankFor(tile)) || null;
                var grow = el('div', { class: 'sc-ac__game' + (gcfg.enabled === false ? ' off' : '') });
                // enable toggle + name + per-game tier
                var enable = el('button', {
                  class: 'sc-toggle' + (gcfg.enabled !== false ? ' on' : ''), title: L({ gr: 'Ενεργό', en: 'Enabled' }),
                  onclick: function (e) { gcfg.enabled = !(gcfg.enabled !== false); e.currentTarget.classList.toggle('on', gcfg.enabled); grow.classList.toggle('off', gcfg.enabled === false); acSave(st); }
                }, [el('span', { class: 'sc-toggle__k' })]);
                var head2 = el('div', { class: 'sc-ac__grow' }, [
                  enable,
                  el('span', { class: 'sc-ac__gname' }, L(tile) + (tile.soon ? ' · ' + L({ gr: 'σύντομα', en: 'soon' }) : '')),
                  tierPills(gcfg.tier || '', true, function (tier) { gcfg.tier = tier; acSave(st); paintMatrix(); }),
                ]);
                grow.appendChild(head2);
                // per-level toggles for content-bank games
                if (bank && bank.levels && bank.levels.length) {
                  var lvKey = sc.id + '/' + key;
                  var lvOpen = window.__acLvOpen === lvKey;
                  head2.appendChild(el('button', {
                    class: 'sc-ac__lvtoggle', onclick: function () { window.__acLvOpen = lvOpen ? null : lvKey; paintMatrix(); }
                  }, (lvOpen ? '▾ ' : '▸ ') + bank.levels.length + ' ' + L({ gr: 'επίπεδα', en: 'levels' })));
                  if (lvOpen) {
                    var lvWrap = el('div', { class: 'sc-ac__levels' });
                    bank.levels.forEach(function (lv) {
                      var lid = String(lv.id);
                      var lon = gcfg.levels[lid] !== false;
                      lvWrap.appendChild(el('button', {
                        class: 'sc-ac__lv lv-' + (lv.color || 'lgreen') + (lon ? ' on' : ''),
                        title: (lv.group ? lv.group + ' · ' : '') + (lv.desc || ''),
                        onclick: function (e) { gcfg.levels[lid] = !(gcfg.levels[lid] !== false); e.currentTarget.classList.toggle('on', gcfg.levels[lid] !== false); acSave(st); }
                      }, [el('span', { class: 'sc-ac__lvn' }, lid), el('span', { class: 'sc-ac__lvd' }, lv.desc || (lv.group || ''))]));
                    });
                    grow.appendChild(lvWrap);
                  }
                }
                card.appendChild(grow);
              });
            });
          }
          wrap.appendChild(card);
        });
      }
      paintMatrix();

      pane.appendChild(el('div', { class: 'sc-ac__foot' }, [
        el('button', {
          class: 'sc-mini', onclick: function () {
            if (confirm(L({ gr: 'Επαναφορά όλων των ρυθμίσεων πρόσβασης;', en: 'Reset all access settings?' }))) {
              st = { version: 1, scopes: {} }; acSave(st); paintMatrix();
            }
          }
        }, L({ gr: 'Επαναφορά', en: 'Reset' })),
        el('button', {
          class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function (e) {
            acSave(st); e.currentTarget.textContent = '✓ ' + L({ gr: 'Αποθηκεύτηκε', en: 'Saved' });
            setTimeout(function () { try { e.currentTarget.textContent = L({ gr: 'Αποθήκευση', en: 'Save' }); } catch (_e) {} }, 1400);
          }
        }, L({ gr: 'Αποθήκευση', en: 'Save' })),
      ]));
    }

    /* ════════════════ MESSAGES (real store + compose) ══════════════════
       Messages live in SymStore('admin_messages', []) and mirror to Firestore
       config/messages (GUARDED). The composer (title/body/audience + Send)
       appends to the store and surfaces a notification via SymSys.notify so a
       sent message reaches users. Starts EMPTY — the admin adds messages. */
    var MSG_KEY = 'admin_messages';
    function msgLoad() {
      var arr = SS() ? SS().get(MSG_KEY, []) : [];
      return Array.isArray(arr) ? arr : [];
    }
    function msgSave(arr) {
      if (SS()) SS().set(MSG_KEY, arr);
      // Mirror to Firestore config/messages — GUARDED (sandbox has no firebase).
      try {
        if (fsReady()) {
          firebase.firestore().collection('config').doc('messages')
            .set({ items: arr, updatedAt: Date.now() }, { merge: true })
            .catch(function () { /* offline / rules — degrade silently */ });
        }
      } catch (_e) { /* no firebase global — fine */ }
    }
    function renderMessaging() {
      pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Μηνύματα προς χρήστες', en: 'Messages to users' })));
      pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({
        gr: 'Σύνταξε ένα μήνυμα και στείλ’ το. Αποθηκεύεται τοπικά (SymStore) και — όταν υπάρχει σύνδεση — συγχρονίζεται στο Firestore. Κάθε αποστολή εμφανίζεται και ως ειδοποίηση στους χρήστες.',
        en: 'Compose a message and send it. It persists locally (SymStore) and — when connected — syncs to Firestore. Each send also surfaces as a user notification.'
      })));

      var AUDIENCES = [
        ['all', { gr: 'Όλοι', en: 'Everyone' }],
        ['free', { gr: 'Δωρεάν χρήστες', en: 'Free users' }],
        ['pro', { gr: 'Συνδρομητές Pro', en: 'Pro subscribers' }],
        ['school', { gr: 'Σχολεία', en: 'Schools' }],
        ['teachers', { gr: 'Καθηγητές', en: 'Teachers' }],
      ];
      function audLabel(id) { for (var i = 0; i < AUDIENCES.length; i++) if (AUDIENCES[i][0] === id) return L(AUDIENCES[i][1]); return id; }

      // ── compose form ─────────────────────────────────────────────────
      var titleIn = el('input', { class: 'sc-field__i', id: 'msgTitle', placeholder: L({ gr: 'Τίτλος μηνύματος', en: 'Message title' }) });
      var bodyIn = el('textarea', { class: 'sc-textarea', id: 'msgBody', rows: '3', placeholder: L({ gr: 'Κείμενο μηνύματος…', en: 'Message body…' }) });
      // Prefill when opened from a user row's «Μήνυμα» action (one-shot).
      try {
        if (window.__msgPrefill) {
          var pf = window.__msgPrefill; window.__msgPrefill = null;
          if (pf.title) titleIn.value = pf.title;
          if (pf.body) bodyIn.value = pf.body;
          if (pf.to) titleIn.value = (titleIn.value ? titleIn.value : L({ gr: 'Προς ', en: 'To ' }) + pf.to);
        }
      } catch (_e) {}
      var audSel = el('select', { class: 'sc-field__i sc-select', id: 'msgAud' }, AUDIENCES.map(function (a) { return el('option', { value: a[0] }, L(a[1])); }));
      var sendBtn = el('button', {
        class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function (e) {
          var title = titleIn.value.trim(), body = bodyIn.value.trim(), aud = audSel.value;
          if (!title && !body) { titleIn.focus(); return; }
          var arr = msgLoad();
          var msg = { id: 'm-' + Date.now().toString(36), title: title, body: body, audience: aud, ts: Date.now() };
          arr.unshift(msg);
          msgSave(arr);
          // Surface to the user notification system (guarded).
          try {
            if (window.SymSys && typeof window.SymSys.notify === 'function') {
              window.SymSys.notify({ ic: '✉', screen: 'home', t: { gr: title || body, en: title || body } });
            }
          } catch (_e) { /* no notify — fine */ }
          titleIn.value = ''; bodyIn.value = '';
          e.currentTarget.textContent = '✓ ' + L({ gr: 'Στάλθηκε', en: 'Sent' });
          setTimeout(function () { paint(); }, 600);
        }
      }, [el('span', { style: 'margin-right:6px' }, '✉'), L({ gr: 'Αποστολή μηνύματος', en: 'Send message' })]);

      pane.appendChild(el('div', { class: 'sc-form sc-msgform' }, [
        el('div', { class: 'sc-cfg__l' }, L({ gr: 'Νέο μήνυμα', en: 'New message' })),
        titleIn,
        bodyIn,
        el('div', { class: 'sc-msgform__row' }, [
          el('label', { class: 'sc-field', style: 'flex:1;min-width:160px' }, [
            el('span', { class: 'sc-field__l' }, L({ gr: 'Παραλήπτες', en: 'Audience' })), audSel,
          ]),
          sendBtn,
        ]),
      ]));

      // ── existing messages list ────────────────────────────────────────
      pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:18px 0 8px' }, L({ gr: 'Σταλμένα μηνύματα', en: 'Sent messages' })));
      var msgs = msgLoad();
      if (!msgs.length) {
        pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Κανένα μήνυμα ακόμη — σύνταξε το πρώτο σου παραπάνω.', en: 'No messages yet — compose your first one above.' })));
      } else {
        var mlist = el('div', { class: 'sc-msglist' });
        msgs.forEach(function (m) {
          var when = '';
          try { when = new Date(m.ts).toLocaleString(); } catch (_e) { when = ''; }
          mlist.appendChild(el('div', { class: 'sc-msgcard' }, [
            el('div', { class: 'sc-msgcard__hd' }, [
              el('span', { class: 'sc-msgcard__t' }, m.title || L({ gr: '(χωρίς τίτλο)', en: '(no title)' })),
              el('span', { class: 'sc-msgcard__aud' }, audLabel(m.audience)),
            ]),
            (m.body ? el('p', { class: 'sc-msgcard__b' }, m.body) : null),
            el('div', { class: 'sc-msgcard__ft' }, [
              el('span', { class: 'sc-msgcard__tm' }, when),
              el('button', { class: 'sc-mini', onclick: function () {
                var cur = msgLoad().filter(function (x) { return x.id !== m.id; });
                msgSave(cur); paint();
              } }, L({ gr: 'Διαγραφή', en: 'Delete' })),
            ]),
          ]));
        });
        pane.appendChild(mlist);
      }

      // ── message templates (kept) ──────────────────────────────────────
      pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:20px 0 8px' }, L({ gr: 'Πρότυπα Μηνυμάτων', en: 'Message Templates' })));
      pane.appendChild(msgEditor('msg_signup', { gr: 'Μήνυμα εγγραφής (welcome)', en: 'Sign-up welcome message' }, 'Καλώς ήρθες στο SymposiON, {name}! Ο αρχαίος κόσμος σε περιμένει — ξεκίνα το πρώτο σου παιχνίδι και κέρδισε Kleos.'));
      pane.appendChild(msgEditor('msg_sub', { gr: 'Μήνυμα συνδρομής (μετά την πληρωμή)', en: 'Subscription confirmation message' }, 'Ευχαριστούμε για τη συνδρομή σου, {name}! Η πρόσβαση Pro είναι ενεργή. Καλή μάθηση & καλό παιχνίδι!'));
      pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Διαθέσιμες μεταβλητές: {name}, {plan}, {expiry}', en: 'Available variables: {name}, {plan}, {expiry}' })));
    }

    /* ════════════════ GRANT ACCESS (single + bulk CSV) ═════════════════ */
    function renderGrant() {
      pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Χορήγησε δωρεάν πρόσβαση', en: 'Grant free access' })));

      // ── single grant ─────────────────────────────────────────────────
      var emailFld = field2(L({ gr: 'Email χρήστη', en: 'User email' }), 'student@example.com');
      var roleSel = rowSel(L({ gr: 'Ρόλος', en: 'Role' }), ['student', 'teacher', 'admin']);
      var classSel = rowSel(L({ gr: 'Τάξη', en: 'Class' }), ['Όλες', 'Β΄ Γυμνασίου', 'Γ΄ Λυκείου', 'Λατινικά']);
      var tierSel = rowSel(L({ gr: 'Πακέτο', en: 'Tier' }), grantTiers());
      var durSel = rowSel(L({ gr: 'Διάρκεια', en: 'Duration' }), ['1m', '3m', '12m', 'perm']);
      pane.appendChild(el('div', { class: 'sc-form sc-form--grid' }, [
        emailFld, roleSel, classSel, tierSel, durSel,
        el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', style: 'margin-top:6px', onclick: function (e) {
          var email = (emailFld.querySelector('input') || {}).value || '';
          email = email.trim();
          if (!validEmail(email)) { emailFld.querySelector('input').focus(); return; }
          var g = {
            email: email.toLowerCase(),
            role: (roleSel.querySelector('select') || {}).value || 'student',
            'class': (classSel.querySelector('select') || {}).value || '',
            tier: (tierSel.querySelector('select') || {}).value || 'pro',
            duration: (durSel.querySelector('select') || {}).value || '',
            ts: Date.now()
          };
          var arr = grantsLoad(); arr.unshift(g); grantsSave(arr);
          emailFld.querySelector('input').value = '';
          e.currentTarget.textContent = '✓ ' + L({ gr: 'Χορηγήθηκε', en: 'Granted' });
          setTimeout(function () { paint(); }, 700);
        } }, L({ gr: 'Χορήγηση πρόσβασης', en: 'Grant access' })),
      ]));

      // ── BULK grant via CSV ────────────────────────────────────────────
      pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:20px 0 8px' }, L({ gr: 'Μαζική χορήγηση', en: 'Bulk grant' })));
      pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 10px' }, L({
        gr: 'Κατέβασε το πρότυπο, συμπλήρωσε γραμμές (email,role,class,tier,duration) και ανέβασέ το για προεπισκόπηση & μαζική χορήγηση.',
        en: 'Download the template, fill rows (email,role,class,tier,duration) and upload it for a preview & mass grant.'
      })));

      var bulkWrap = el('div', { class: 'sc-bulk' });
      pane.appendChild(bulkWrap);

      var fileIn = el('input', { type: 'file', accept: '.csv,.txt', class: 'sc-bulk__file', id: 'grantCsv',
        onchange: function (ev) {
          var f = ev.target.files && ev.target.files[0]; ev.target.value = '';
          if (!f) return;
          var reader = new FileReader();
          reader.onload = function () {
            window.__grantPreview = parseGrantCSV(String(reader.result || ''));
            paintBulk();
          };
          reader.onerror = function () { window.__grantPreview = null; paintBulk(); };
          reader.readAsText(f, 'utf-8');
        }
      });

      bulkWrap.appendChild(el('div', { class: 'sc-bulk__bar' }, [
        el('button', { class: 'sc-cta sc-cta--ghost sc-cta--sm', onclick: function (e) {
          var ok = csvDownload('symposion-grants-template.csv', grantTemplateCSV());
          var prev = e.currentTarget.textContent;
          e.currentTarget.textContent = ok ? '✓ ' + L({ gr: 'Κατέβηκε', en: 'Downloaded' }) : L({ gr: 'Σφάλμα', en: 'Failed' });
          setTimeout(function () { try { e.currentTarget.textContent = prev; } catch (_e) {} }, 1400);
        } }, [el('span', { style: 'margin-right:6px' }, '⬇'), L({ gr: 'Κατέβασε πρότυπο', en: 'Download template' })]),
        el('label', { class: 'sc-cta sc-cta--ghost sc-cta--sm', for: 'grantCsv', style: 'cursor:pointer' },
          [el('span', { style: 'margin-right:6px' }, '⬆'), L({ gr: 'Ανέβασε αρχείο', en: 'Upload file' })]),
        fileIn,
      ]));

      var preview = el('div', { class: 'sc-bulk__preview' });
      bulkWrap.appendChild(preview);

      function paintBulk() {
        preview.innerHTML = '';
        var rows = window.__grantPreview;
        if (!rows) return;
        if (!rows.length) {
          preview.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Δεν βρέθηκαν γραμμές στο αρχείο.', en: 'No rows found in the file.' })));
          return;
        }
        var okN = rows.filter(function (r) { return r.ok; }).length;
        var badN = rows.length - okN;
        preview.appendChild(el('div', { class: 'sc-bulk__sum' },
          L({ gr: 'Προεπισκόπηση: ', en: 'Preview: ' }) + okN + ' ' + L({ gr: 'έγκυρες', en: 'valid' })
          + (badN ? ' · ' + badN + ' ' + L({ gr: 'με σφάλμα', en: 'with errors' }) : '')));

        var tbl = el('div', { class: 'sc-table sc-bulk__tbl' });
        tbl.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [
          el('span', {}, 'Email'), el('span', {}, L({ gr: 'Ρόλος', en: 'Role' })),
          el('span', {}, L({ gr: 'Πακέτο', en: 'Tier' })), el('span', {}, L({ gr: 'Κατάσταση', en: 'Status' })),
        ]));
        rows.forEach(function (r) {
          tbl.appendChild(el('div', { class: 'sc-tr' + (r.ok ? '' : ' sc-tr--bad') }, [
            el('span', { class: 'sc-tr__task' }, r.email || '—'),
            el('span', {}, r.role),
            el('span', {}, r.tier),
            el('span', {}, r.ok
              ? el('em', { class: 'sc-badge2 sc-badge2--done' }, 'OK')
              : el('em', { class: 'sc-badge2 sc-badge2--open' }, '✕ ' + r.err.join(', '))),
          ]));
        });
        preview.appendChild(tbl);

        preview.appendChild(el('div', { style: 'display:flex;gap:8px;margin-top:12px;flex-wrap:wrap' }, [
          el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm' + (okN ? '' : ' off'), onclick: function (e) {
            var valid = rows.filter(function (r) { return r.ok; });
            if (!valid.length) return;
            var arr = grantsLoad();
            valid.forEach(function (r) {
              arr.unshift({ email: r.email.toLowerCase(), role: r.role, 'class': r['class'], tier: r.tier, duration: r.duration, ts: Date.now() });
            });
            grantsSave(arr);
            window.__grantPreview = null;
            e.currentTarget.textContent = '✓ ' + valid.length + ' ' + L({ gr: 'χορηγήθηκαν', en: 'granted' });
            setTimeout(function () { paint(); }, 900);
          } }, L({ gr: 'Χορήγηση σε όλους', en: 'Grant all' }) + (okN ? ' (' + okN + ')' : '')),
          el('button', { class: 'sc-mini', onclick: function () { window.__grantPreview = null; paintBulk(); } }, L({ gr: 'Ακύρωση', en: 'Cancel' })),
        ]));
      }
      paintBulk();

      // ── existing grants list ──────────────────────────────────────────
      var grants = grantsLoad();
      if (grants.length) {
        pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:20px 0 8px' }, L({ gr: 'Χορηγήσεις', en: 'Grants' }) + ' (' + grants.length + ')'));
        var gtbl = el('div', { class: 'sc-table' });
        gtbl.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [
          el('span', {}, 'Email'), el('span', {}, L({ gr: 'Ρόλος', en: 'Role' })),
          el('span', {}, L({ gr: 'Πακέτο', en: 'Tier' })), el('span', {}, ''),
        ]));
        grants.forEach(function (g) {
          gtbl.appendChild(el('div', { class: 'sc-tr' }, [
            el('span', { class: 'sc-tr__task' }, g.email),
            el('span', {}, g.role || '—'),
            el('span', {}, el('em', { class: 'sc-badge2 sc-badge2--' + (g.tier === 'free' ? 'open' : 'done') }, g.tier || '—')),
            el('span', { class: 'sc-tr__acts' }, [el('button', { class: 'sc-mini', onclick: function () {
              adminConfirm(L({ gr: 'Διαγραφή πρόσβασης για ' + g.email + ';', en: 'Remove access for ' + g.email + '?' }), function () {
                var cur = grantsLoad().filter(function (x) { return x.email !== g.email || x.ts !== g.ts; });
                grantsSave(cur); paint();
              });
            } }, L({ gr: 'Διαγραφή', en: 'Delete' }))]),
          ]));
        });
        pane.appendChild(gtbl);
      }
    }

    /* ════════════════ GRANT KLEOS (ISSUE 5b) ═══════════════════════════
       Kleos lives in each student's LOCAL SymStore('kleos') — there is no
       server-side per-student balance. So "award kleos to student X" is done
       exactly like access grants: write a server-side grant record the target
       student's client drains once on next login (sym-kleos.js →
       symClaimKleosGrants). Persist to SymStore('kleos_grants') + a guarded
       Firestore mirror kleosGrants/{email} using a FieldValue.increment so
       repeated grants accumulate. Reuses field2()/rowSel()/validEmail()/
       fsReady()/SS() already in this file.
       NOTE: the bootstrap admin has INFINITE kleos (sym-kleos.js), so test the
       claim/credit flow signed in as a NON-admin account. */
    function kleosGrantsLoad() {
      var arr = SS() ? SS().get('kleos_grants', []) : [];
      return Array.isArray(arr) ? arr : [];
    }
    function kleosGrantsSave(email, amount, reason) {
      var rec = {
        email: String(email || '').toLowerCase(),
        kleos: +amount || 0,
        reason: reason || '',
        ts: Date.now()
      };
      var arr = kleosGrantsLoad(); arr.unshift(rec);
      if (SS()) SS().set('kleos_grants', arr);
      try {
        if (fsReady()) {
          firebase.firestore().collection('kleosGrants').doc(rec.email)
            .set({
              pending: firebase.firestore.FieldValue.increment(rec.kleos),
              lastReason: rec.reason,
              ts: rec.ts
            }, { merge: true })
            .catch(function () { /* offline / rules — degrade to local */ });
        }
      } catch (_e) { /* no firebase — fine */ }
      return rec;
    }

    function renderKleosGrant() {
      pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Χορήγηση Kleos', en: 'Grant Kleos' })));
      pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({
        gr: 'Πρόσθεσε Kleos σε έναν μαθητή (με email). Το Kleos πιστώνεται στον λογαριασμό του την επόμενη φορά που θα συνδεθεί. Χρειάζεται σύνδεση Firestore για να φτάσει σε άλλη συσκευή· αλλιώς μένει τοπικά.',
        en: 'Add Kleos to a student (by email). It is credited to their account the next time they sign in. A Firestore connection is required to reach another device; otherwise it stays local.'
      })));

      var fsOk = fsReady();
      pane.appendChild(el('div', { class: 'sc-ac__status' }, [
        el('span', { class: 'sc-ac__dot' + (fsOk ? ' on' : '') }),
        L(fsOk ? { gr: 'Συγχρονισμός Firestore ενεργός', en: 'Firestore sync active' } : { gr: 'Τοπική αποθήκευση (χωρίς firebase εδώ)', en: 'Local-only (no firebase here)' }),
      ]));

      var emailFld = field2(L({ gr: 'Email μαθητή', en: 'Student email' }), 'student@example.com');
      var amountFld = field2(L({ gr: 'Ποσό Kleos', en: 'Kleos amount' }), '100');
      try { amountFld.querySelector('input').type = 'number'; amountFld.querySelector('input').min = '1'; } catch (_e) {}
      var reasonFld = field2(L({ gr: 'Αιτιολογία (προαιρετικό)', en: 'Reason (optional)' }), L({ gr: 'π.χ. βραβείο διαγωνισμού', en: 'e.g. contest prize' }));

      pane.appendChild(el('div', { class: 'sc-form sc-form--grid' }, [
        emailFld, amountFld, reasonFld,
        el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', style: 'margin-top:6px', onclick: function (e) {
          var email = ((emailFld.querySelector('input') || {}).value || '').trim();
          if (!validEmail(email)) { emailFld.querySelector('input').focus(); return; }
          var amount = +(((amountFld.querySelector('input') || {}).value) || 0);
          if (!(amount > 0)) { amountFld.querySelector('input').focus(); return; }
          var reason = ((reasonFld.querySelector('input') || {}).value || '').trim();
          kleosGrantsSave(email, amount, reason);
          emailFld.querySelector('input').value = '';
          amountFld.querySelector('input').value = '';
          reasonFld.querySelector('input').value = '';
          e.currentTarget.textContent = '✓ ' + L({ gr: 'Χορηγήθηκε', en: 'Granted' });
          setTimeout(function () { paint(); }, 700);
        } }, L({ gr: 'Χορήγηση Kleos', en: 'Grant Kleos' })),
      ]));

      // ── existing kleos grants list ────────────────────────────────────
      var grants = kleosGrantsLoad();
      if (grants.length) {
        pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:20px 0 8px' }, L({ gr: 'Χορηγήσεις Kleos', en: 'Kleos grants' }) + ' (' + grants.length + ')'));
        var gtbl = el('div', { class: 'sc-table' });
        gtbl.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [
          el('span', {}, 'Email'), el('span', {}, 'Kleos'),
          el('span', {}, L({ gr: 'Αιτιολογία', en: 'Reason' })), el('span', {}, ''),
        ]));
        grants.forEach(function (g) {
          gtbl.appendChild(el('div', { class: 'sc-tr' }, [
            el('span', { class: 'sc-tr__task' }, g.email),
            el('span', {}, el('em', { class: 'sc-badge2 sc-badge2--done' }, '+' + (g.kleos || 0))),
            el('span', {}, g.reason || '—'),
            el('span', { class: 'sc-tr__acts' }, [el('button', { class: 'sc-mini', onclick: function () {
              adminConfirm(L({ gr: 'Αφαίρεση εγγραφής για ' + g.email + ' (δεν αναιρεί ήδη πιστωμένο Kleos);', en: 'Remove record for ' + g.email + ' (does not undo already-credited Kleos)?' }), function () {
                var cur = kleosGrantsLoad().filter(function (x) { return x.email !== g.email || x.ts !== g.ts; });
                if (SS()) SS().set('kleos_grants', cur); paint();
              });
            } }, L({ gr: 'Διαγραφή', en: 'Delete' }))]),
          ]));
        });
        pane.appendChild(gtbl);
      }
    }

    /* ════════════════ PRICING EDITOR (real) ════════════════════════ */
    function renderPricing() {
      pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Τιμολόγηση — πακέτα, bundles & οικογενειακό', en: 'Pricing — plans, bundles & family' })));
      pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({
        gr: 'Όρισε τιμή ανά διάρκεια (1/3/6/12 μήνες) για κάθε πακέτο, τι ξεκλειδώνει (βαθμίδα + τάξη/levels), φτιάξε bundles και ενεργοποίησε το Οικογενειακό. Αποθηκεύεται τοπικά και — με σύνδεση — στο Firestore (config/pricing).',
        en: 'Set price per duration (1/3/6/12 months) per plan, what it unlocks (tier + class/levels), build bundles and enable the Family plan. Persists locally and — when connected — to Firestore (config/pricing).'
      })));

      var fsOk = fsReady();
      pane.appendChild(el('div', { class: 'sc-ac__status' }, [
        el('span', { class: 'sc-ac__dot' + (fsOk ? ' on' : '') }),
        L(fsOk ? { gr: 'Συγχρονισμός Firestore ενεργός', en: 'Firestore sync active' } : { gr: 'Τοπική αποθήκευση (χωρίς firebase εδώ)', en: 'Local-only (no firebase here)' }),
      ]));

      var st = pricingLoad();
      var host = el('div', {});
      pane.appendChild(host);

      // Tier options from SymTiers (never hardcoded).
      var tierOpts = tierVocab();                       // [[id,{gr,en}], …]
      // Class options for "unlocks → class" (from authored data).
      var classOpts = [['', { gr: 'Όλες οι τάξεις', en: 'All classes' }]].concat((SYM().CLASSES || []).map(function (c) { return [c.id, { gr: c.gr, en: c.en }]; }));
      var PLAN_KINDS = [['tier', { gr: 'Βαθμίδα', en: 'Tier' }], ['bundle', { gr: 'Bundle', en: 'Bundle' }], ['family', { gr: 'Οικογενειακό', en: 'Family' }]];

      function selOf(opts, cur, onCh) {
        return el('select', { class: 'sc-field__i sc-select', onchange: function (e) { onCh(e.target.value); } },
          opts.map(function (o) { return el('option', { value: o[0], selected: o[0] === cur ? 'selected' : null }, L(o[1])); }));
      }

      function paintPricing() {
        host.innerHTML = '';
        var keys = planKeys(st);

        // ── plan rows ──
        keys.forEach(function (k) {
          var isBuiltin = (k === 'student' || k === 'teacher');
          if (!st[k]) st[k] = {};
          st._kinds[k] = st._kinds[k] || (isBuiltin ? 'tier' : 'tier');
          st._unlocks[k] = st._unlocks[k] || { tier: (k === 'teacher' ? 'teacher' : (k === 'student' ? 'student' : 'pro')), classId: '', levels: '' };

          var card = el('div', { class: 'sc-form', style: 'margin:0 0 12px' });
          var lab = planLabel(st, k);
          // header: editable label (custom) + kind + delete
          var head = el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px' });
          if (isBuiltin) {
            head.appendChild(el('b', { style: 'flex:1;min-width:120px' }, L(lab)));
          } else {
            head.appendChild(el('input', { class: 'sc-field__i', style: 'flex:1;min-width:120px', value: L(lab),
              onblur: (function (key) { return function (e) { var v = e.target.value.trim(); if (v) { st._labels[key] = { gr: v, en: v }; pricingSave(st); } }; })(k) }));
          }
          head.appendChild(el('label', { class: 'sc-field', style: 'flex:0 0 auto' }, [
            el('span', { class: 'sc-field__l' }, L({ gr: 'Τύπος', en: 'Kind' })),
            selOf(PLAN_KINDS, st._kinds[k], (function (key) { return function (v) { st._kinds[key] = v; pricingSave(st); paintPricing(); }; })(k)),
          ]));
          if (!isBuiltin) {
            head.appendChild(el('button', { class: 'sc-mini', onclick: (function (key) { return function () {
              st._customPlans = (st._customPlans || []).filter(function (x) { return x !== key; });
              delete st[key]; delete st._labels[key]; delete st._kinds[key]; delete st._unlocks[key];
              pricingSave(st); paintPricing();
            }; })(k) }, L({ gr: '✕ Διαγραφή', en: '✕ Delete' })));
          }
          card.appendChild(head);

          // price-per-duration inputs (1/3/6/12 months)
          var prRow = el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' });
          PRICE_MONTHS.forEach(function (m) {
            prRow.appendChild(el('label', { class: 'sc-field', style: 'flex:1;min-width:78px' }, [
              el('span', { class: 'sc-field__l' }, m + L({ gr: 'μ €', en: 'mo €' })),
              el('input', { class: 'sc-field__i sc-price', type: 'number', min: '0', step: '0.01', value: (st[k][m] != null ? st[k][m] : ''),
                'data-plan': k, 'data-month': m, placeholder: '0.00' }),
            ]));
          });
          card.appendChild(prRow);

          // unlocks: tier (from SymTiers) + class + levels (comma list)
          var u = st._unlocks[k];
          card.appendChild(el('div', { class: 'sc-cfg__l', style: 'margin:10px 0 4px' }, L({ gr: 'Ξεκλειδώνει', en: 'Unlocks' })));
          card.appendChild(el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [
            el('label', { class: 'sc-field', style: 'flex:1;min-width:120px' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Βαθμίδα', en: 'Tier' })), selOf(tierOpts, u.tier || '', (function (key) { return function (v) { st._unlocks[key].tier = v; pricingSave(st); }; })(k))]),
            el('label', { class: 'sc-field', style: 'flex:1;min-width:120px' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Τάξη', en: 'Class' })), selOf(classOpts, u.classId || '', (function (key) { return function (v) { st._unlocks[key].classId = v; pricingSave(st); }; })(k))]),
            el('label', { class: 'sc-field', style: 'flex:1;min-width:120px' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Levels (προαιρ.)', en: 'Levels (opt.)' })), el('input', { class: 'sc-field__i', value: u.levels || '', placeholder: '1,2,3', onblur: (function (key) { return function (e) { st._unlocks[key].levels = e.target.value.trim(); pricingSave(st); }; })(k) })]),
          ]));
          host.appendChild(card);
        });

        // ── add a new plan ──
        host.appendChild(el('div', { class: 'sc-form', style: 'margin:0 0 16px' }, [
          el('div', { class: 'sc-cfg__l' }, L({ gr: 'Νέο πακέτο', en: 'New plan' })),
          el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [
            el('input', { class: 'sc-field__i', id: 'pxNewNm', placeholder: L({ gr: 'Όνομα (π.χ. Σχολείο)', en: 'Name (e.g. School)' }), style: 'flex:2;min-width:160px' }),
            el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () {
              var nm = (document.getElementById('pxNewNm') || {}).value || ''; nm = nm.trim(); if (!nm) return;
              var key = 'plan_' + Date.now().toString(36);
              st._customPlans.push(key);
              st._labels[key] = { gr: nm, en: nm };
              st._kinds[key] = 'tier';
              st._unlocks[key] = { tier: 'pro', classId: '', levels: '' };
              st[key] = {};
              pricingSave(st); paintPricing();
            } }, L({ gr: '＋ Πρόσθεσε πακέτο', en: '＋ Add plan' })),
          ]),
        ]));

        // ── BUNDLES ──
        host.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:6px 0 8px' }, L({ gr: 'Bundles', en: 'Bundles' })));
        host.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 8px' }, L({ gr: 'Συνδυασμός πακέτων με ενιαία τιμή.', en: 'Combine plans at one price.' })));
        (st._bundles || []).forEach(function (b, bi) {
          host.appendChild(el('div', { class: 'sc-tr' }, [
            el('span', { class: 'sc-tr__task' }, L(b) + ' · ' + (Array.isArray(b.plans) ? b.plans.join(' + ') : '')),
            el('span', {}, b.price != null ? '€' + b.price : '—'),
            el('span', { class: 'sc-tr__acts' }, [el('button', { class: 'sc-mini', onclick: function () { st._bundles.splice(bi, 1); pricingSave(st); paintPricing(); } }, L({ gr: 'Διαγραφή', en: 'Delete' }))]),
          ]));
        });
        host.appendChild(el('div', { class: 'sc-form', style: 'margin:8px 0 16px' }, [
          el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [
            el('input', { class: 'sc-field__i', id: 'pxBunNm', placeholder: L({ gr: 'Όνομα bundle', en: 'Bundle name' }), style: 'flex:2;min-width:140px' }),
            el('input', { class: 'sc-field__i', id: 'pxBunPlans', placeholder: L({ gr: 'πακέτα (π.χ. student,teacher)', en: 'plans (e.g. student,teacher)' }), style: 'flex:2;min-width:160px' }),
            el('input', { class: 'sc-field__i sc-price', id: 'pxBunPr', type: 'number', min: '0', step: '0.01', placeholder: '€', style: 'flex:1;min-width:80px' }),
            el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () {
              var nm = (document.getElementById('pxBunNm') || {}).value || ''; nm = nm.trim();
              var plans = ((document.getElementById('pxBunPlans') || {}).value || '').split(',').map(function (s) { return s.trim(); }).filter(Boolean);
              var pr = parseFloat((document.getElementById('pxBunPr') || {}).value || '0');
              if (!nm || !plans.length) return;
              st._bundles.push({ id: 'bun_' + Date.now().toString(36), gr: nm, en: nm, plans: plans, price: isFinite(pr) ? pr : 0 });
              pricingSave(st); paintPricing();
            } }, L({ gr: '＋ Bundle', en: '＋ Bundle' })),
          ]),
        ]));

        // ── FAMILY / multi-class plan options (no multi-account auth) ──
        host.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:6px 0 8px' }, L({ gr: 'Οικογενειακό / πολλαπλές τάξεις', en: 'Family / multi-class' })));
        host.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 8px' }, L({ gr: 'Έκπτωση −X% στη 2η τάξη + read-only πρόσβαση γονέα με 2ο email (μοντελοποίηση επιλογών — όχι ξεχωριστός λογαριασμός).', en: 'A −X% discount on a 2nd class + read-only parent access by a 2nd email (modelled as options — no separate account).' })));
        var fam = st._family;
        host.appendChild(el('div', { class: 'sc-form', style: 'margin:0 0 16px' }, [
          (function () { var r = el('div', { class: 'sc-adrow' }, [el('span', {}, L({ gr: 'Ενεργό Οικογενειακό', en: 'Family enabled' })), el('button', { class: 'sc-toggle' + (fam.enabled ? ' on' : ''), onclick: function (e) { fam.enabled = !fam.enabled; e.currentTarget.classList.toggle('on', fam.enabled); pricingSave(st); } }, [el('span', { class: 'sc-toggle__k' })])]); return r; })(),
          el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Έκπτωση 2ης τάξης (%)', en: '2nd-class discount (%)' })), el('input', { class: 'sc-field__i', type: 'number', min: '0', max: '100', value: (fam.addonPct != null ? fam.addonPct : 50), onblur: function (e) { var v = parseInt(e.target.value, 10); fam.addonPct = isFinite(v) ? Math.max(0, Math.min(100, v)) : 50; pricingSave(st); } })]),
          (function () { var r = el('div', { class: 'sc-adrow' }, [el('span', {}, L({ gr: 'Read-only πρόσβαση γονέα (2ο email)', en: 'Read-only parent access (2nd email)' })), el('button', { class: 'sc-toggle' + (fam.parentRead ? ' on' : ''), onclick: function (e) { fam.parentRead = !fam.parentRead; e.currentTarget.classList.toggle('on', fam.parentRead); pricingSave(st); } }, [el('span', { class: 'sc-toggle__k' })])]); return r; })(),
        ]));

        // ── save ──
        host.appendChild(el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [
          el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function (e) {
            // Pull every price input's live value into st before persisting.
            try {
              host.querySelectorAll('input[data-plan][data-month]').forEach(function (inp) {
                var pk = inp.getAttribute('data-plan'), mo = inp.getAttribute('data-month');
                var v = parseFloat(inp.value); if (!st[pk]) st[pk] = {};
                st[pk][mo] = isFinite(v) ? Math.max(0, v) : 0;
              });
            } catch (_e) {}
            pricingSave(st);
            e.currentTarget.textContent = '✓ ' + L({ gr: 'Αποθηκεύτηκε', en: 'Saved' });
            setTimeout(function () { try { e.currentTarget.textContent = L({ gr: 'Αποθήκευση τιμών', en: 'Save pricing' }); } catch (_e2) {} }, 1400);
          } }, L({ gr: 'Αποθήκευση τιμών', en: 'Save pricing' })),
        ]));
      }
      // Hydrate from Firestore once (guarded), then paint.
      pricingHydrate(function () { st = pricingLoad(); paintPricing(); });
      paintPricing();
    }

    /* ════════════════ COUPONS EDITOR (real) ════════════════════════ */
    function renderCoupons() {
      pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Εκπτωτικοί κωδικοί', en: 'Discount codes' })));
      pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({
        gr: 'Κωδικός με % έκπτωση, όριο χρήσεων και πραγματικό παράθυρο ισχύος (από / έως, με ώρα). Αποθηκεύεται τοπικά + στη συλλογή coupons του Firestore. (Η εξαργύρωση στο checkout συνδέεται αργότερα με Stripe.)',
        en: 'A code with a % discount, a usage cap and a real validity window (from / until, with time). Persists locally + to the Firestore coupons collection. (Checkout redemption is wired with Stripe later.)'
      })));

      var fsOk = fsReady();
      pane.appendChild(el('div', { class: 'sc-ac__status' }, [
        el('span', { class: 'sc-ac__dot' + (fsOk ? ' on' : '') }),
        L(fsOk ? { gr: 'Συγχρονισμός Firestore ενεργός', en: 'Firestore sync active' } : { gr: 'Τοπική αποθήκευση (χωρίς firebase εδώ)', en: 'Local-only (no firebase here)' }),
      ]));

      // ── create form ──
      var codeIn = el('input', { class: 'sc-field__i', placeholder: 'WELCOME10', style: 'text-transform:uppercase' });
      var discIn = el('input', { class: 'sc-field__i', type: 'number', min: '1', max: '100', value: '10' });
      var maxIn = el('input', { class: 'sc-field__i', type: 'number', min: '0', value: '0', placeholder: '0 = ∞' });
      var fromIn = el('input', { class: 'sc-field__i', type: 'datetime-local' });
      var untilIn = el('input', { class: 'sc-field__i', type: 'datetime-local' });
      var errEl = el('p', { class: 'sc-hint', style: 'color:#b3261e;margin:6px 0 0;display:none' });

      pane.appendChild(el('div', { class: 'sc-form' }, [
        el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [
          el('label', { class: 'sc-field', style: 'flex:2;min-width:140px' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Κωδικός', en: 'Code' })), codeIn]),
          el('label', { class: 'sc-field', style: 'flex:1;min-width:90px' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Έκπτωση %', en: 'Discount %' })), discIn]),
          el('label', { class: 'sc-field', style: 'flex:1;min-width:90px' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Μέγιστες χρήσεις', en: 'Max uses' })), maxIn]),
        ]),
        el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin-top:8px' }, [
          el('label', { class: 'sc-field', style: 'flex:1;min-width:170px' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Ισχύει από', en: 'Valid from' })), fromIn]),
          el('label', { class: 'sc-field', style: 'flex:1;min-width:170px' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Ισχύει έως', en: 'Valid until' })), untilIn]),
        ]),
        errEl,
        el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', style: 'margin-top:8px', onclick: function (e) {
          errEl.style.display = 'none';
          var code = (codeIn.value || '').trim().toUpperCase();
          var disc = parseInt(discIn.value, 10);
          var maxU = parseInt(maxIn.value, 10); if (!isFinite(maxU) || maxU < 0) maxU = 0;
          var fromMs = dtToMs(fromIn.value);
          var untilMs = dtToMs(untilIn.value);
          function fail(msg) { errEl.textContent = L(msg); errEl.style.display = ''; }
          if (!/^[A-Z0-9_-]{3,}$/.test(code)) { fail({ gr: 'Μη έγκυρος κωδικός (≥3 χαρακτήρες, A–Z/0–9).', en: 'Invalid code (≥3 chars, A–Z/0–9).' }); return; }
          if (!isFinite(disc) || disc < 1 || disc > 100) { fail({ gr: 'Η έκπτωση πρέπει 1–100%.', en: 'Discount must be 1–100%.' }); return; }
          if (fromMs && untilMs && untilMs <= fromMs) { fail({ gr: 'Το «έως» πρέπει να είναι μετά το «από».', en: '“Until” must be after “from”.' }); return; }
          var arr = couponsLoad();
          if (arr.some(function (c) { return c.code === code; })) { fail({ gr: 'Ο κωδικός υπάρχει ήδη.', en: 'Code already exists.' }); return; }
          var c = { code: code, discount: disc, maxUses: maxU, usedCount: 0, active: true, validFrom: fromMs, validUntil: untilMs, ts: Date.now() };
          arr.unshift(c); couponsSaveLocal(arr); couponMirror(c);
          codeIn.value = ''; maxIn.value = '0'; fromIn.value = ''; untilIn.value = '';
          e.currentTarget.textContent = '✓ ' + L({ gr: 'Δημιουργήθηκε', en: 'Created' });
          setTimeout(function () { paint(); }, 600);
        } }, L({ gr: 'Δημιουργία κωδικού', en: 'Create code' })),
      ]));

      // ── existing codes ──
      pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:18px 0 8px' }, L({ gr: 'Κωδικοί', en: 'Codes' })));
      var listHost = el('div', {});
      pane.appendChild(listHost);
      function paintCodes() {
        listHost.innerHTML = '';
        var arr = couponsLoad();
        if (!arr.length) { listHost.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Κανένας κωδικός ακόμη — φτιάξε τον πρώτο σου παραπάνω.', en: 'No codes yet — create your first one above.' }))); return; }
        var tbl = el('div', { class: 'sc-table' });
        tbl.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [el('span', {}, 'Code'), el('span', {}, L({ gr: 'Έκπτ.', en: 'Off' })), el('span', {}, L({ gr: 'Χρήσεις', en: 'Uses' })), el('span', {}, L({ gr: 'Κατάσταση / Παράθυρο', en: 'Status / Window' })), el('span', {}, '')]));
        arr.forEach(function (c) {
          var stt = couponStatus(c);
          var win = '';
          if (c.validFrom || c.validUntil) {
            var f = c.validFrom ? new Date(c.validFrom).toLocaleString() : '—';
            var u2 = c.validUntil ? new Date(c.validUntil).toLocaleString() : '—';
            win = f + ' → ' + u2;
          }
          var badgeMod = (stt.id === 'active') ? 'done' : (stt.id === 'pending' ? 'open' : 'open');
          tbl.appendChild(el('div', { class: 'sc-tr' }, [
            el('span', { class: 'sc-tr__task' }, c.code),
            el('span', {}, '−' + c.discount + '%'),
            el('span', {}, (c.usedCount || 0) + ' / ' + (c.maxUses ? c.maxUses : '∞')),
            el('span', {}, [el('em', { class: 'sc-badge2 sc-badge2--' + badgeMod }, L(stt)), win ? el('small', { style: 'display:block;opacity:.7;margin-top:2px' }, win) : null]),
            el('span', { class: 'sc-tr__acts' }, [
              el('button', { class: 'sc-mini', onclick: (function (code, active) { return function () {
                var a = couponsLoad(); a.forEach(function (x) { if (x.code === code) x.active = !active; }); couponsSaveLocal(a); couponSetActive(code, !active); paintCodes();
              }; })(c.code, c.active !== false) }, c.active === false ? L({ gr: 'Ενεργ.', en: 'Enable' }) : L({ gr: 'Απενεργ.', en: 'Disable' })),
              el('button', { class: 'sc-mini', onclick: (function (code) { return function () {
                if (!confirm(L({ gr: 'Διαγραφή κωδικού ' + code + ';', en: 'Delete code ' + code + '?' }))) return;
                var a = couponsLoad().filter(function (x) { return x.code !== code; }); couponsSaveLocal(a); couponDelete(code); paintCodes();
              }; })(c.code) }, L({ gr: 'Διαγραφή', en: 'Delete' })),
            ]),
          ]));
        });
        listHost.appendChild(tbl);
      }
      couponsHydrate(function () { paintCodes(); });
      paintCodes();
    }

    /* ════════════════ AI SOURCES (knowledge base) ══════════════════
       Upload books/files (PDF/.txt/.md) → extracted text stored in Firestore
       (ai_corpus, chunked ≤700KB/doc). The gradeAnswer Cloud Function grounds
       the AI tutor's grading in this material (keyword retrieval, server-side).
       Persists across redeploys (Firestore) and reaches the grader on any
       device. Enabling the AI itself needs ANTHROPIC_KEY on the Functions. */
    var AI_SUBJ = [['istoria', 'Ιστορία'], ['archaia', 'Αρχαία Ελληνικά'], ['latinika', 'Λατινικά'],
                   ['logotexnia', 'Λογοτεχνία'], ['ekthesi', 'Έκθεση'], ['all', 'Όλα τα μαθήματα (global)']];
    function _aiSubjLabel(k) { var f = AI_SUBJ.filter(function (s) { return s[0] === k; })[0]; return f ? f[1] : k; }
    function _loadPdfJs() {
      if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
      return new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        s.onload = function () { try { window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; } catch (_) {} res(window.pdfjsLib); };
        s.onerror = function () { rej(new Error('pdf.js load failed')); };
        document.head.appendChild(s);
      });
    }
    // Resolves to { text, pdf } so callers can reuse the already-parsed pdf
    // document (page count, OCR rendering) instead of re-buffering + re-parsing.
    function _extractPdf(file) {
      return _loadPdfJs().then(function (lib) {
        return file.arrayBuffer().then(function (buf) {
          return lib.getDocument({ data: buf }).promise.then(function (pdf) {
            var chain = Promise.resolve('');
            for (var i = 1; i <= pdf.numPages; i++) {
              (function (n) {
                chain = chain.then(function (acc) {
                  return pdf.getPage(n).then(function (pg) { return pg.getTextContent(); })
                    .then(function (tc) { return acc + tc.items.map(function (it) { return it.str; }).join(' ') + '\n\n'; });
                });
              })(i);
            }
            return chain.then(function (text) { return { text: text, pdf: pdf }; });
          });
        });
      });
    }
    /* ── lazy CDN loaders for the extra extractors (mirrors _loadPdfJs) ──
       Each caches the resolved global on window., resolves it, rejects on
       <script> error. No CSP on the site, so external CDN loads are fine. */
    function _loadMammoth() {
      if (window.mammoth) return Promise.resolve(window.mammoth);
      return new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
        s.onload = function () { window.mammoth ? res(window.mammoth) : rej(new Error('mammoth load failed')); };
        s.onerror = function () { rej(new Error('mammoth load failed')); };
        document.head.appendChild(s);
      });
    }
    function _loadJSZip() {
      if (window.JSZip) return Promise.resolve(window.JSZip);
      return new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
        s.onload = function () { window.JSZip ? res(window.JSZip) : rej(new Error('JSZip load failed')); };
        s.onerror = function () { rej(new Error('JSZip load failed')); };
        document.head.appendChild(s);
      });
    }
    function _loadTesseract() {
      if (window.Tesseract) return Promise.resolve(window.Tesseract);
      return new Promise(function (res, rej) {
        var s = document.createElement('script');
        s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        s.onload = function () { window.Tesseract ? res(window.Tesseract) : rej(new Error('tesseract load failed')); };
        s.onerror = function () { rej(new Error('tesseract load failed')); };
        document.head.appendChild(s);
      });
    }
    // .docx → raw text via mammoth.
    function _extractDocx(file) {
      return _loadMammoth().then(function (mammoth) {
        return file.arrayBuffer().then(function (arrayBuffer) {
          return mammoth.extractRawText({ arrayBuffer: arrayBuffer }).then(function (r) { return (r && r.value) || ''; });
        });
      });
    }
    // .epub → unzip, concatenate the text of every (x)html chapter in name order.
    // Bounded (chapter count + cumulative chars) so a huge or pathological/zip-
    // bomb epub can't decompress unbounded and freeze the tab.
    function _extractEpub(file) {
      var MAX_CHAPTERS = 2000, MAX_CHARS = 12000000; // ~12M chars hard ceiling
      return _loadJSZip().then(function (JSZip) {
        return file.arrayBuffer().then(function (buf) {
          return JSZip.loadAsync(buf).then(function (zip) {
            var names = [];
            zip.forEach(function (path, entry) {
              if (entry.dir) return;
              if (/\.x?html?$/i.test(path)) names.push(path);
            });
            names.sort(); // spine order ≈ alphabetical (acceptable approximation)
            if (names.length > MAX_CHAPTERS) names = names.slice(0, MAX_CHAPTERS);
            var chain = Promise.resolve('');
            names.forEach(function (path) {
              chain = chain.then(function (acc) {
                if (acc.length >= MAX_CHARS) return acc; // cumulative ceiling — stop growing
                return zip.file(path).async('string').then(function (html) {
                  var txt = '';
                  try {
                    var doc = new DOMParser().parseFromString(html, 'text/html');
                    txt = (doc.body && doc.body.textContent) || doc.documentElement.textContent || '';
                  } catch (_e) {
                    txt = String(html).replace(/<[^>]*>/g, ' ');
                  }
                  return acc + txt.replace(/[ \t]+/g, ' ').replace(/\n{3,}/g, '\n\n').trim() + '\n\n';
                });
              });
            });
            return chain;
          });
        });
      });
    }
    /* ── PDF extraction with OCR fallback for scanned PDFs ──
       Extract via pdf.js first. If the text is suspiciously empty for the page
       count (total trimmed < 40 chars, OR < 15 chars/page → likely a scan),
       OCR each rendered page with Tesseract ('ell+eng'). Capped at 30 pages to
       bound time. onStatus(msg) drives the live status line; OCR is slow — that
       is expected. Best-effort: any OCR failure falls back to the pdf.js text. */
    var OCR_PAGE_CAP = 30;
    function _extractPdfSmart(file, onStatus) {
      var note = function (m) { if (onStatus) onStatus(m); };
      return _extractPdf(file).then(function (res) {
        var pdfText = res.text, pdf = res.pdf;     // reuse the already-parsed doc
        var pages = pdf.numPages;
        var trimmed = (pdfText || '').trim();
        var looksScanned = trimmed.length < 40 || (pages > 0 && trimmed.length < pages * 15);
        if (!looksScanned) return pdfText;
        // → OCR fallback (only here do we pay for rendering each page).
        return _loadTesseract().then(function (Tesseract) {
          var cap = Math.min(pages, OCR_PAGE_CAP);
          if (pages > OCR_PAGE_CAP) {
            note(L({ gr: 'Σαρωμένο PDF — OCR στις πρώτες ' + OCR_PAGE_CAP + ' σελίδες (από ' + pages + ')…',
                     en: 'Scanned PDF — OCR on first ' + OCR_PAGE_CAP + ' pages (of ' + pages + ')…' }));
          }
          var chain = Promise.resolve('');
          for (var i = 1; i <= cap; i++) {
            (function (n) {
              chain = chain.then(function (acc) {
                note(L({ gr: 'OCR σελίδα ' + n + '/' + cap + '…', en: 'OCR page ' + n + '/' + cap + '…' }));
                return pdf.getPage(n).then(function (pg) {
                  var viewport = pg.getViewport({ scale: 2 });
                  var canvas = document.createElement('canvas');
                  canvas.width = viewport.width; canvas.height = viewport.height;
                  var ctx = canvas.getContext('2d');
                  return pg.render({ canvasContext: ctx, viewport: viewport }).promise.then(function () {
                    return Tesseract.recognize(canvas, 'ell+eng').then(function (r) {
                      return acc + ((r && r.data && r.data.text) || '') + '\n\n';
                    });
                  });
                });
              });
            })(i);
          }
          return chain.then(function (ocrText) {
            // If OCR yielded more than pdf.js, use it; else keep what we had.
            return (ocrText.trim().length > trimmed.length) ? ocrText : pdfText;
          });
        }).catch(function () { return pdfText; }); // OCR unavailable → pdf.js text
      });
    }
    function renderAiSources() {
      pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'AI Πηγές · Βιβλία αναφοράς', en: 'AI Sources · Reference books' })));
      pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 14px' }, L({
        gr: 'Ανέβασε βιβλία/αρχεία (PDF, .txt, .md, .docx, .epub). Σαρωμένα PDF αναγνωρίζονται αυτόματα με OCR. Ο AI βοηθός που βαθμολογεί Μετάφραση / Συντακτικό / Ανάπτυξη στηρίζεται ΚΥΡΙΩΣ σε αυτό το υλικό (και συμπληρωματικά στη γενική του γνώση). Αποθηκεύεται στο Firestore — επιβιώνει redeploy.',
        en: 'Upload books/files (PDF, .txt, .md, .docx, .epub). Scanned PDFs are auto-detected and OCR’d. The AI tutor that grades Translation / Syntax / Development grounds its answers MAINLY in this material (falling back to general knowledge). Stored in Firestore — survives redeploy.'
      })));

      // ── AI status pill ──
      var statusBox = el('div', { style: 'margin:0 0 16px;padding:12px 14px;border-radius:12px;border:1px solid var(--line,#e6ddcf);background:var(--card,#fff)' }, L({ gr: 'Έλεγχος κατάστασης AI…', en: 'Checking AI status…' }));
      pane.appendChild(statusBox);
      try {
        if (fsReady() && firebase.functions) {
          firebase.functions().httpsCallable('aiGraderStatus')({}).then(function (r) {
            var d = (r && r.data) || {}; statusBox.innerHTML = '';
            if (d.configured) {
              statusBox.appendChild(el('div', { style: 'font-weight:700;color:#2e7d32' }, '✓ ' + L({ gr: 'AI ενεργός', en: 'AI active' }) + (d.model ? ' · ' + d.model : '')));
              statusBox.appendChild(el('div', { class: 'sc-hint', style: 'margin-top:4px' }, L({ gr: 'Ενεργές πηγές: ', en: 'Active sources: ' }) + (d.sources || 0)));
            } else {
              statusBox.appendChild(el('div', { style: 'font-weight:700;color:#b8862b' }, '● ' + L({ gr: 'AI ανενεργός — δεν έχει οριστεί κλειδί', en: 'AI inactive — key not set' })));
              statusBox.appendChild(el('div', { class: 'sc-hint', style: 'margin-top:6px' }, L({ gr: 'Ενεργοποίησέ τον ορίζοντας το ANTHROPIC_KEY και κάνε deploy:', en: 'Enable it by setting ANTHROPIC_KEY, then deploy:' })));
              statusBox.appendChild(el('pre', { style: 'margin:6px 0 0;padding:8px;border-radius:8px;background:#1d1a14;color:#e9e2d2;font-size:11px;overflow:auto' }, 'firebase functions:secrets:set ANTHROPIC_KEY\nfirebase deploy --only functions'));
            }
          }).catch(function () { statusBox.textContent = L({ gr: 'Δεν ήταν δυνατός ο έλεγχος (σύνδεση/δικαιώματα).', en: 'Status check unavailable (connection/permissions).' }); });
        } else { statusBox.textContent = L({ gr: 'Σύνδεσε Firebase για κατάσταση AI.', en: 'Connect Firebase for AI status.' }); }
      } catch (_) { statusBox.textContent = '—'; }

      // ── upload form ──
      var titleInp = el('input', { class: 'sc-field__i', placeholder: L({ gr: 'Τίτλος (π.χ. Ιστορία Γ΄ — Κεφ. 1)', en: 'Title (e.g. History 12th — Ch. 1)' }) });
      var subjSel = el('select', { class: 'sc-field__i sc-select' }, AI_SUBJ.map(function (s) { return el('option', { value: s[0] }, s[1]); }));
      var fileInp = el('input', { type: 'file', accept: '.txt,.md,.pdf,.docx,.epub', class: 'sc-field__i' });
      var statusLine = el('div', { class: 'sc-hint', style: 'margin:6px 0' }, '');
      var extracted = { text: '', name: '' };
      var upBtn = el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: doUpload }, L({ gr: 'Ανέβασμα', en: 'Upload' }));
      fileInp.addEventListener('change', function () {
        var f = fileInp.files && fileInp.files[0]; if (!f) return;
        extracted = { text: '', name: f.name };
        // Guard against absurd inputs before any in-browser extraction/OCR runs
        // (a huge or pathological file would otherwise freeze the admin's tab).
        var MAX_MB = 80;
        if (f.size > MAX_MB * 1024 * 1024) {
          statusLine.textContent = L({ gr: 'Πολύ μεγάλο αρχείο (όριο ' + MAX_MB + 'MB) — χώρισέ το σε μέρη.',
                                       en: 'File too large (' + MAX_MB + 'MB limit) — split it into parts.' });
          fileInp.value = ''; return;
        }
        var done = function (txt) {
          extracted.text = txt || '';
          statusLine.textContent = (extracted.text.length).toLocaleString('en-US') + ' ' + L({ gr: 'χαρακτήρες', en: 'chars' }) + ' · ' + f.name;
          if (!titleInp.value) titleInp.value = f.name.replace(/\.[^.]+$/, '');
        };
        var setStatus = function (m) { statusLine.textContent = m; };
        var ext = (f.name.split('.').pop() || '').toLowerCase();
        if (ext === 'pdf') {
          statusLine.textContent = L({ gr: 'Εξαγωγή κειμένου από PDF…', en: 'Extracting PDF text…' });
          _extractPdfSmart(f, setStatus).then(done).catch(function (e) { statusLine.textContent = L({ gr: 'Σφάλμα PDF: ', en: 'PDF error: ' }) + (e && e.message || e); });
        } else if (ext === 'docx') {
          statusLine.textContent = L({ gr: 'Εξαγωγή από .docx…', en: 'Extracting .docx…' });
          _extractDocx(f).then(done).catch(function (e) { statusLine.textContent = L({ gr: 'Σφάλμα .docx: ', en: '.docx error: ' }) + (e && e.message || e); });
        } else if (ext === 'epub') {
          statusLine.textContent = L({ gr: 'Εξαγωγή από .epub…', en: 'Extracting .epub…' });
          _extractEpub(f).then(done).catch(function (e) { statusLine.textContent = L({ gr: 'Σφάλμα .epub: ', en: '.epub error: ' }) + (e && e.message || e); });
        } else {
          statusLine.textContent = L({ gr: 'Ανάγνωση…', en: 'Reading…' });
          var rd = new FileReader();
          rd.onload = function () { done(String(rd.result || '')); };
          rd.onerror = function () { statusLine.textContent = L({ gr: 'Σφάλμα ανάγνωσης', en: 'Read error' }); };
          rd.readAsText(f);
        }
      });
      pane.appendChild(el('div', { class: 'sc-card', style: 'padding:14px;border:1px solid var(--line,#e6ddcf);border-radius:12px;margin:0 0 18px' }, [
        el('div', { class: 'sc-cfg__l' }, L({ gr: 'Νέα πηγή', en: 'New source' })),
        el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Τίτλος', en: 'Title' })), titleInp]),
        el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Μάθημα', en: 'Subject' })), subjSel]),
        el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Αρχείο (PDF/.txt/.md/.docx/.epub)', en: 'File (PDF/.txt/.md/.docx/.epub)' })), fileInp]),
        statusLine, upBtn,
      ]));
      function doUpload() {
        var txt = (extracted.text || '').trim();
        if (!txt) { statusLine.textContent = L({ gr: 'Διάλεξε αρχείο πρώτα.', en: 'Pick a file first.' }); return; }
        if (!titleInp.value.trim()) { titleInp.focus(); return; }
        if (!fsReady() || !firebase.firestore) { statusLine.textContent = L({ gr: 'Χρειάζεται σύνδεση Firebase.', en: 'Firebase connection required.' }); return; }
        upBtn.disabled = true; upBtn.textContent = '…';
        var db = firebase.firestore(); var sid = 'src_' + Date.now();
        // Chunk by UTF-8 BYTE length, not character count. Firestore's hard
        // per-document limit is 1,048,576 bytes; Greek code points are 2 bytes
        // in UTF-8, so a fixed 700K-char stride yields ~1.4 MB chunks that the
        // batch rejects (a sizeable Greek book then silently fails to upload).
        // We grow each chunk character-by-character until adding the next char
        // would push its encoded size past MAX_BYTES (~900 KB headroom under the
        // 1 MiB cap, leaving room for the other doc fields + Firestore overhead).
        var MAX_BYTES = 900000;
        var enc = (typeof TextEncoder !== 'undefined') ? new TextEncoder() : null;
        var byteLen = enc
          ? function (s) { return enc.encode(s).length; }
          : function (s) { return unescape(encodeURIComponent(s)).length; };
        var chunks = [];
        (function () {
          var n = txt.length, start = 0;
          while (start < n) {
            // Coarse CHAR ceiling = the ai_corpus rule's 480K-char cap. For
            // ASCII/Latin (1 byte/char) a MAX_BYTES-wide slice would be ~900K
            // CHARS — over the 480K char rule → permission-denied. Capping the
            // slice at 480K chars satisfies the char rule; the byte-shrink below
            // then enforces the 900KB byte cap on top (binds for 2-byte Greek).
            var end = Math.min(n, start + 480000);
            var piece = txt.slice(start, end);
            // Shrink until the encoded piece fits. Always keep at least one
            // character so a lone multi-byte char can never spin forever.
            while (piece.length > 1 && byteLen(piece) > MAX_BYTES) {
              // Scale the cut proportionally to the current overshoot, then
              // step back by one as a safety margin (handles surrogate pairs).
              var ratio = MAX_BYTES / byteLen(piece);
              var cut = Math.max(1, Math.floor(piece.length * ratio) - 1);
              piece = piece.slice(0, cut);
            }
            if (!piece.length) piece = txt.slice(start, start + 1); // guard
            chunks.push(piece);
            start += piece.length;
          }
        })();
        var batch = db.batch();
        chunks.forEach(function (ch, idx) {
          batch.set(db.collection('ai_corpus').doc(), { sourceId: sid, title: titleInp.value.trim(), subject: subjSel.value, part: idx, parts: chunks.length, text: ch, chars: ch.length, filename: extracted.name || '', enabled: true, uploadedAt: Date.now() });
        });
        batch.commit().then(function () {
          upBtn.disabled = false; upBtn.textContent = L({ gr: 'Ανέβασμα', en: 'Upload' });
          statusLine.textContent = '✓ ' + L({ gr: 'Αποθηκεύτηκε', en: 'Saved' }) + ' (' + chunks.length + ' ' + L({ gr: 'τμήματα', en: 'chunks' }) + ')';
          titleInp.value = ''; fileInp.value = ''; extracted = { text: '', name: '' }; loadList();
        }).catch(function (e) {
          upBtn.disabled = false; upBtn.textContent = L({ gr: 'Ανέβασμα', en: 'Upload' });
          var em = (e && (e.message || e.code) || '') + '';
          var oversize = (e && e.code === 'invalid-argument')
            || /invalid[_ -]?argument|too large|1048576|exceeds the maximum/i.test(em);
          if (oversize) {
            statusLine.textContent = L({
              gr: 'Σφάλμα: το αρχείο είναι πολύ μεγάλο για ένα τμήμα (όριο Firestore 1 MiB ανά έγγραφο). Δοκίμασε μικρότερο αρχείο.',
              en: 'Error: a chunk exceeds Firestore\'s 1 MiB per-document limit. Try a smaller file.'
            });
          } else {
            statusLine.textContent = L({ gr: 'Σφάλμα: ', en: 'Error: ' }) + (e && e.message || e);
          }
        });
      }

      // ── existing sources ──
      pane.appendChild(el('div', { class: 'sc-cfg__l', style: 'margin:4px 0 8px' }, L({ gr: 'Ανεβασμένες πηγές', en: 'Uploaded sources' })));
      var listHost = el('div', {}); pane.appendChild(listHost); loadList();

      // ── admin test-chat: ask the live tutor (askTutor callable) ──
      var tcSubj = el('select', { class: 'sc-field__i sc-select' }, AI_SUBJ.map(function (s) { return el('option', { value: s[0] }, s[1]); }));
      var tcQ = el('textarea', { class: 'sc-field__i', rows: 3, placeholder: L({ gr: 'Γράψε μια ερώτηση για τον βοηθό…', en: 'Type a question for the tutor…' }), style: 'resize:vertical;min-height:64px' });
      var tcAns = el('div', { class: 'sc-hint', style: 'margin:8px 0 0;padding:12px 14px;border-radius:12px;border:1px solid var(--line,#e6ddcf);background:var(--card,#fff);white-space:pre-wrap;min-height:20px' }, L({ gr: 'Η απάντηση θα εμφανιστεί εδώ.', en: 'The answer will appear here.' }));
      var tcBtn = el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: tcAsk }, L({ gr: 'Ρώτησε', en: 'Ask' }));
      function tcAsk() {
        var q = (tcQ.value || '').trim();
        if (!q) { tcQ.focus(); return; }
        if (!fsReady() || !firebase.functions) { tcAns.textContent = L({ gr: 'Χρειάζεται σύνδεση Firebase.', en: 'Firebase connection required.' }); return; }
        var subjOpt = AI_SUBJ.filter(function (s) { return s[0] === tcSubj.value; })[0];
        var subject = (subjOpt && tcSubj.value !== 'all') ? subjOpt[1] : 'all';
        tcBtn.disabled = true; tcBtn.textContent = '…';
        tcAns.textContent = L({ gr: 'Σκέφτεται…', en: 'Thinking…' });
        firebase.functions().httpsCallable('askTutor')({ question: q, subject: subject }).then(function (r) {
          var d = (r && r.data) || {};
          tcBtn.disabled = false; tcBtn.textContent = L({ gr: 'Ρώτησε', en: 'Ask' });
          tcAns.textContent = (d.answer || L({ gr: '(κενή απάντηση)', en: '(empty answer)' }))
            + (d.grounded ? '' : '\n\n— ' + L({ gr: 'χωρίς τεκμηρίωση από τις πηγές', en: 'not grounded in sources' }));
        }).catch(function (e) {
          tcBtn.disabled = false; tcBtn.textContent = L({ gr: 'Ρώτησε', en: 'Ask' });
          var code = (e && e.code) || '';
          var msg;
          if (code === 'failed-precondition') msg = L({ gr: 'Ο AI δεν είναι ενεργός — όρισε ANTHROPIC_KEY', en: 'AI not active — set ANTHROPIC_KEY' });
          else if (code === 'unauthenticated') msg = L({ gr: 'Συνδέσου', en: 'Sign in' });
          else if (code === 'resource-exhausted') msg = L({ gr: 'Πάρα πολλές ερωτήσεις', en: 'Too many questions' });
          else msg = L({ gr: 'Σφάλμα: ', en: 'Error: ' }) + ((e && e.message) || e);
          tcAns.textContent = msg;
        });
      }
      pane.appendChild(el('div', { class: 'sc-cfg__l', style: 'margin:18px 0 8px' }, L({ gr: 'Δοκίμασε τον βοηθό', en: 'Test the tutor' })));
      pane.appendChild(el('div', { class: 'sc-card', style: 'padding:14px;border:1px solid var(--line,#e6ddcf);border-radius:12px;margin:0 0 18px' }, [
        el('p', { class: 'sc-hint', style: 'margin:0 0 10px' }, L({ gr: 'Στείλε μια ερώτηση στον ζωντανό AI βοηθό (askTutor) για να ελέγξεις την κατάστασή του. Ο βοηθός απαντά μόνο σε εκπαιδευτικά θέματα.', en: 'Send a question to the live AI tutor (askTutor) to check its state. The tutor only answers educational questions.' })),
        el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Μάθημα', en: 'Subject' })), tcSubj]),
        el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Ερώτηση', en: 'Question' })), tcQ]),
        tcBtn, tcAns,
      ]));
      function loadList() {
        listHost.innerHTML = '';
        if (!fsReady() || !firebase.firestore) { listHost.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Σύνδεσε Firebase για τις πηγές.', en: 'Connect Firebase to list sources.' }))); return; }
        firebase.firestore().collection('ai_corpus').limit(500).get().then(function (snap) {
          var groups = {};
          snap.forEach(function (d) { var x = d.data() || {}; var sid = x.sourceId || d.id; var g = groups[sid] || (groups[sid] = { title: x.title || '—', subject: x.subject || 'all', chars: 0, enabled: true, ids: [] }); g.chars += (x.chars || 0); g.ids.push(d.id); if (x.enabled === false) g.enabled = false; });
          var keys = Object.keys(groups);
          if (!keys.length) { listHost.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Καμία πηγή ακόμη — ανέβασε το πρώτο βιβλίο/αρχείο.', en: 'No sources yet — upload your first book/file.' }))); return; }
          keys.forEach(function (sid) {
            var g = groups[sid]; var kb = Math.max(1, Math.round(g.chars / 1024));
            listHost.appendChild(el('div', { class: 'sc-tr' }, [
              el('span', { class: 'sc-tr__task' }, g.title),
              el('span', {}, _aiSubjLabel(g.subject)),
              el('span', {}, kb + ' KB'),
              el('span', { class: 'sc-tr__acts' }, [
                el('button', { class: 'sc-toggle' + (g.enabled ? ' on' : ''), title: L({ gr: 'Ενεργό', en: 'Enabled' }), onclick: function () { _aiSetEnabled(g.ids, !g.enabled, loadList); } }, [el('span', { class: 'sc-toggle__k' })]),
                el('button', { class: 'sc-mini', onclick: function () { adminConfirm(L({ gr: 'Διαγραφή πηγής «' + g.title + '»;', en: 'Delete source “' + g.title + '”?' }), function () { _aiDelGroup(g.ids, loadList); }); } }, L({ gr: 'Διαγραφή', en: 'Delete' })),
              ]),
            ]));
          });
        }).catch(function () { listHost.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Σφάλμα φόρτωσης.', en: 'Load error.' }))); });
      }
    }
    function _aiSetEnabled(ids, on, cb) { var db = firebase.firestore(), b = db.batch(); ids.forEach(function (id) { b.update(db.collection('ai_corpus').doc(id), { enabled: !!on }); }); b.commit().then(cb).catch(cb); }
    function _aiDelGroup(ids, cb) { var db = firebase.firestore(), b = db.batch(); ids.forEach(function (id) { b.delete(db.collection('ai_corpus').doc(id)); }); b.commit().then(cb).catch(cb); }

    /* ════════════════ ARCADE — ΡΑΨΩΔΙΕΣ (Iliada/Odysseia editor) ═════
       Edits the rhapsody meta + quiz banks of the Iliada/Odysseia Arcade game.
       Baseline = window.ARCADE_DEFAULTS; admin overrides saved to
       SymStore('arcade_content') and consumed by play/override.js. The saved
       cfg shape MUST match override.js:
         { iliada:{ rhaps:{ <key>:{ roman,latin?,title,quiz:[{q,o:[4],a}] } }, order?:[keys] }, odysseia:{…} }
       Firestore persistence + student boot-hydration are AUTOMATIC (the key is
       whitelisted in syn-hydrate.js) — no Firestore code here. */
    var ARCADE_CAMPS = [['iliada', { gr: 'ΙΛΙΑΔΑ', en: 'ILIAD' }], ['odysseia', { gr: 'ΟΔΥΣΣΕΙΑ', en: 'ODYSSEY' }]];
    function _arcDefaults() { return (window.ARCADE_DEFAULTS && typeof window.ARCADE_DEFAULTS === 'object') ? window.ARCADE_DEFAULTS : { iliada: { order: [], rhaps: {} }, odysseia: { order: [], rhaps: {} } }; }
    // Deep-ish clone (data is plain JSON: strings/numbers/arrays/objects).
    function _arcClone(v) { try { return JSON.parse(JSON.stringify(v)); } catch (_) { return v; } }
    // Effective content for a campaign = ARCADE_DEFAULTS overlaid by the saved
    // override, mirroring override.js (existing keys: roman/latin/title/quiz
    // replaced; new keys added; order applied if present).
    function _arcEffective(camp) {
      var defs = _arcClone((_arcDefaults()[camp]) || { order: [], rhaps: {} });
      if (!defs.rhaps) defs.rhaps = {};
      if (!Array.isArray(defs.order)) defs.order = Object.keys(defs.rhaps);
      var ov = (SymStore ? SymStore.get('arcade_content', null) : null);
      var cc = ov && ov[camp];
      if (cc && cc.rhaps) {
        Object.keys(cc.rhaps).forEach(function (key) {
          var src = cc.rhaps[key]; if (!src) return;
          if (defs.rhaps[key]) {
            if (src.roman) defs.rhaps[key].roman = src.roman;
            if (src.latin != null) defs.rhaps[key].latin = src.latin;
            if (src.title) defs.rhaps[key].title = src.title;
            if (Array.isArray(src.quiz)) defs.rhaps[key].quiz = _arcClone(src.quiz);
          } else {
            defs.rhaps[key] = {
              roman: src.roman || key.toUpperCase().slice(0, 1),
              latin: src.latin || '',
              title: src.title || key,
              boss: src.boss || '',
              quiz: Array.isArray(src.quiz) ? _arcClone(src.quiz) : []
            };
            if (defs.order.indexOf(key) < 0) defs.order.push(key);
          }
        });
      }
      if (cc && Array.isArray(cc.order) && cc.order.length) {
        defs.order = cc.order.filter(function (k) { return defs.rhaps[k]; });
      }
      // Make sure every rhapsody has a quiz array of well-formed questions.
      defs.order.forEach(function (k) {
        var r = defs.rhaps[k]; if (!r) return;
        if (!Array.isArray(r.quiz)) r.quiz = [];
        r.quiz = r.quiz.map(function (q) {
          var o = Array.isArray(q.o) ? q.o.slice(0, 4) : [];
          while (o.length < 4) o.push('');
          var a = (typeof q.a === 'number' && q.a >= 0 && q.a <= 3) ? q.a : 0;
          return { q: q.q || '', o: o, a: a };
        });
      });
      return defs;
    }
    // slugify a label to a lowercase ascii key (Greek → translit-ish fallback);
    // ensure uniqueness against `taken` keys.
    function _arcSlug(s, taken) {
      var base = String(s || '').toLowerCase()
        .replace(/[άα]/g, 'a').replace(/[έε]/g, 'e').replace(/[ήη]/g, 'i')
        .replace(/[ίϊΐι]/g, 'i').replace(/[όο]/g, 'o').replace(/[ύϋΰυ]/g, 'y')
        .replace(/[ώω]/g, 'o').replace(/β/g, 'v').replace(/γ/g, 'g').replace(/δ/g, 'd')
        .replace(/ζ/g, 'z').replace(/θ/g, 'th').replace(/κ/g, 'k').replace(/λ/g, 'l')
        .replace(/μ/g, 'm').replace(/ν/g, 'n').replace(/ξ/g, 'x').replace(/π/g, 'p')
        .replace(/ρ/g, 'r').replace(/[σς]/g, 's').replace(/τ/g, 't').replace(/φ/g, 'f')
        .replace(/χ/g, 'ch').replace(/ψ/g, 'ps')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      if (!base) base = 'extra';
      var key = base, n = 1;
      while (taken.indexOf(key) >= 0) { key = base + '-' + (++n); }
      if (taken.indexOf(base) < 0 && base === key) return base;
      // if base alone wasn't taken we'd have returned it; otherwise key is unique.
      return key;
    }

    function renderArcade() {
      pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Arcade — Ραψωδίες & Ερωτήσεις (Ιλιάδα / Οδύσσεια)', en: 'Arcade — Rhapsodies & Questions (Iliad / Odyssey)' })));
      pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({
        gr: 'Πρόσθεσε ραψωδίες και επεξεργάσου το κουίζ κάθε ραψωδίας του παιχνιδιού Arcade. Βάση = το ενσωματωμένο περιεχόμενο· οι αλλαγές αποθηκεύονται ως override και — με σύνδεση — συγχρονίζονται αυτόματα στο Firestore και φτάνουν στους μαθητές.',
        en: 'Add rhapsodies and edit the quiz of each Arcade rhapsody. Baseline = built-in content; edits are saved as an override and — when connected — auto-sync to Firestore and reach students.'
      })));

      var fsOk = fsReady();
      pane.appendChild(el('div', { class: 'sc-ac__status' }, [
        el('span', { class: 'sc-ac__dot' + (fsOk ? ' on' : '') }),
        L(fsOk ? { gr: 'Συγχρονισμός Firestore ενεργός', en: 'Firestore sync active' } : { gr: 'Τοπική αποθήκευση (χωρίς firebase εδώ)', en: 'Local-only (no firebase here)' }),
      ]));

      // Working model: per-campaign effective content, edited live in memory.
      // We diff against ARCADE_DEFAULTS at save time to build the override cfg.
      var activeCamp = (window.__arcCamp === 'odysseia') ? 'odysseia' : 'iliada';
      var model = { iliada: _arcEffective('iliada'), odysseia: _arcEffective('odysseia') };

      // ── campaign switcher (pills) ──
      var tabs = el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;margin:4px 0 14px' });
      ARCADE_CAMPS.forEach(function (c) {
        tabs.appendChild(el('button', {
          class: 'sc-cta sc-cta--sm' + (c[0] === activeCamp ? ' sc-cta--solid' : ''),
          onclick: (function (id) { return function () { sweep(); window.__arcCamp = id; activeCamp = id; paintArc(); }; })(c[0])
        }, L(c[1])));
      });
      pane.appendChild(tabs);

      var host = el('div', {});
      pane.appendChild(host);

      // Validate the whole model; returns array of human-readable problems.
      function validate() {
        var probs = [];
        ARCADE_CAMPS.forEach(function (c) {
          var camp = c[0], m = model[camp];
          (m.order || []).forEach(function (key) {
            var r = m.rhaps[key]; if (!r) return;
            if (!String(r.title || '').trim()) probs.push(L(c[1]) + ' · ' + key + ': ' + L({ gr: 'λείπει τίτλος', en: 'missing title' }));
            (r.quiz || []).forEach(function (q, qi) {
              var label = L(c[1]) + ' · ' + (r.roman || key) + ' · Q' + (qi + 1);
              if (!String(q.q || '').trim()) probs.push(label + ': ' + L({ gr: 'κενή ερώτηση', en: 'empty question' }));
              var filled = (q.o || []).filter(function (x) { return String(x || '').trim(); }).length;
              if (filled < 2) probs.push(label + ': ' + L({ gr: '≥2 απαντήσεις', en: 'needs ≥2 options' }));
              if (!(typeof q.a === 'number' && q.a >= 0 && q.a <= 3)) probs.push(label + ': ' + L({ gr: 'μη έγκυρη σωστή', en: 'invalid correct index' }));
              else if (!String((q.o || [])[q.a] || '').trim()) probs.push(label + ': ' + L({ gr: 'η σωστή είναι κενή', en: 'correct option is empty' }));
            });
          });
        });
        return probs;
      }

      // Pull every live input value into the model (mirrors pricing's save sweep).
      function sweep() {
        try {
          host.querySelectorAll('[data-arc-q]').forEach(function (inp) {
            var key = inp.getAttribute('data-rhap'), qi = +inp.getAttribute('data-qi');
            var r = model[activeCamp].rhaps[key]; if (!r || !r.quiz[qi]) return;
            r.quiz[qi].q = inp.value;
          });
          host.querySelectorAll('[data-arc-o]').forEach(function (inp) {
            var key = inp.getAttribute('data-rhap'), qi = +inp.getAttribute('data-qi'), oi = +inp.getAttribute('data-oi');
            var r = model[activeCamp].rhaps[key]; if (!r || !r.quiz[qi]) return;
            r.quiz[qi].o[oi] = inp.value;
          });
          host.querySelectorAll('[data-arc-a]:checked').forEach(function (inp) {
            var key = inp.getAttribute('data-rhap'), qi = +inp.getAttribute('data-qi');
            var r = model[activeCamp].rhaps[key]; if (!r || !r.quiz[qi]) return;
            r.quiz[qi].a = +inp.getAttribute('data-arc-a');
          });
          host.querySelectorAll('[data-arc-roman]').forEach(function (inp) {
            var r = model[activeCamp].rhaps[inp.getAttribute('data-rhap')]; if (r) r.roman = inp.value;
          });
          host.querySelectorAll('[data-arc-title]').forEach(function (inp) {
            var r = model[activeCamp].rhaps[inp.getAttribute('data-rhap')]; if (r) r.title = inp.value;
          });
        } catch (_e) {}
      }

      // Build the override cfg by diffing the model against ARCADE_DEFAULTS.
      // Only campaigns/rhapsodies with actual changes are included.
      function buildCfg() {
        var defs = _arcDefaults();
        var cfg = {};
        ARCADE_CAMPS.forEach(function (c) {
          var camp = c[0], m = model[camp];
          var dCamp = defs[camp] || { order: [], rhaps: {} };
          var dRhaps = dCamp.rhaps || {};
          var dOrder = Array.isArray(dCamp.order) ? dCamp.order : Object.keys(dRhaps);
          var outRhaps = {}, touched = false;
          (m.order || []).forEach(function (key) {
            var r = m.rhaps[key]; if (!r) return;
            var d = dRhaps[key];
            if (!d) {
              // NEW rhapsody → store full editable object (override.js clones visuals).
              outRhaps[key] = { roman: r.roman || key.toUpperCase().slice(0, 1), latin: r.latin || '', title: r.title || key, quiz: _arcCleanQuiz(r.quiz) };
              touched = true;
            } else {
              // Existing default → include only if roman/latin/title/quiz changed.
              var changed = false, entry = {};
              if ((r.roman || '') !== (d.roman || '')) { entry.roman = r.roman || ''; changed = true; }
              if ((r.latin || '') !== (d.latin || '')) { entry.latin = r.latin || ''; changed = true; }
              if ((r.title || '') !== (d.title || '')) { entry.title = r.title || ''; changed = true; }
              if (!_arcQuizEq(r.quiz, d.quiz)) { entry.quiz = _arcCleanQuiz(r.quiz); changed = true; }
              if (changed) { outRhaps[key] = entry; touched = true; }
            }
          });
          // order override only if rhapsodies were added or reordered.
          var orderChanged = m.order.length !== dOrder.length || m.order.some(function (k, i) { return dOrder[i] !== k; });
          if (touched || orderChanged) {
            cfg[camp] = { rhaps: outRhaps };
            if (orderChanged) cfg[camp].order = m.order.slice();
          }
        });
        return cfg;
      }

      function paintArc() {
        host.innerHTML = '';
        var m = model[activeCamp];
        var order = m.order || [];

        if (!order.length) {
          host.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Καμία ραψωδία σε αυτή την εκστρατεία.', en: 'No rhapsodies in this campaign.' })));
        }

        order.forEach(function (key) {
          var r = m.rhaps[key]; if (!r) return;
          var isDefault = !!((_arcDefaults()[activeCamp] || {}).rhaps || {})[key];
          var card = el('div', { class: 'sc-form', style: 'margin:0 0 14px' });

          // ── rhapsody header: roman + title + count + actions ──
          var head = el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:8px' });
          head.appendChild(el('label', { class: 'sc-field', style: 'flex:0 0 auto;width:70px' }, [
            el('span', { class: 'sc-field__l' }, L({ gr: 'Ραψ.', en: 'Rhap.' })),
            el('input', { class: 'sc-field__i', value: r.roman || '', 'data-arc-roman': '1', 'data-rhap': key, oninput: (function (k) { return function (e) { model[activeCamp].rhaps[k].roman = e.target.value; }; })(key) }),
          ]));
          head.appendChild(el('label', { class: 'sc-field', style: 'flex:1;min-width:160px' }, [
            el('span', { class: 'sc-field__l' }, L({ gr: 'Τίτλος', en: 'Title' })),
            el('input', { class: 'sc-field__i', value: r.title || '', 'data-arc-title': '1', 'data-rhap': key, oninput: (function (k) { return function (e) { model[activeCamp].rhaps[k].title = e.target.value; }; })(key) }),
          ]));
          head.appendChild(el('em', { class: 'sc-badge2 sc-badge2--' + (isDefault ? 'done' : 'open'), style: 'flex:0 0 auto' },
            (r.quiz || []).length + ' ' + L({ gr: 'ερωτ.', en: 'Q' }) + (isDefault ? '' : ' · ' + L({ gr: 'νέα', en: 'new' }))));
          if (isDefault) {
            head.appendChild(el('button', { class: 'sc-mini', style: 'flex:0 0 auto', onclick: (function (k) { return function () {
              adminConfirm(L({ gr: 'Επαναφορά της ραψωδίας «' + (model[activeCamp].rhaps[k].title || k) + '» στις προεπιλογές;', en: 'Reset rhapsody “' + (model[activeCamp].rhaps[k].title || k) + '” to defaults?' }), function () {
                var d = _arcClone(((_arcDefaults()[activeCamp] || {}).rhaps || {})[k]);
                if (d) {
                  if (!Array.isArray(d.quiz)) d.quiz = [];
                  d.quiz = d.quiz.map(function (q) { var o = Array.isArray(q.o) ? q.o.slice(0, 4) : []; while (o.length < 4) o.push(''); return { q: q.q || '', o: o, a: (typeof q.a === 'number' ? q.a : 0) }; });
                  model[activeCamp].rhaps[k] = d;
                }
                paintArc();
              });
            }; })(key) }, L({ gr: 'Επαναφορά', en: 'Reset' })));
          } else {
            head.appendChild(el('button', { class: 'sc-mini', style: 'flex:0 0 auto', onclick: (function (k) { return function () {
              adminConfirm(L({ gr: 'Διαγραφή της νέας ραψωδίας «' + (model[activeCamp].rhaps[k].title || k) + '»;', en: 'Delete new rhapsody “' + (model[activeCamp].rhaps[k].title || k) + '”?' }), function () {
                delete model[activeCamp].rhaps[k];
                model[activeCamp].order = model[activeCamp].order.filter(function (x) { return x !== k; });
                paintArc();
              });
            }; })(key) }, L({ gr: '✕ Διαγραφή', en: '✕ Delete' })));
          }
          card.appendChild(head);

          // ── question list ──
          var qHost = el('div', {});
          (r.quiz || []).forEach(function (q, qi) {
            qHost.appendChild(_arcQuestionRow(key, q, qi));
          });
          card.appendChild(qHost);

          // ── add question ──
          card.appendChild(el('button', { class: 'sc-cta sc-cta--sm', style: 'margin-top:6px', onclick: (function (k) { return function () {
            sweep();
            model[activeCamp].rhaps[k].quiz.push({ q: '', o: ['', '', '', ''], a: 0 });
            paintArc();
          }; })(key) }, L({ gr: '＋ Ερώτηση', en: '＋ Question' })));

          host.appendChild(card);
        });

        // ── add rhapsody ──
        host.appendChild(el('div', { class: 'sc-form', style: 'margin:0 0 16px' }, [
          el('div', { class: 'sc-cfg__l' }, L({ gr: 'Νέα ραψωδία', en: 'New rhapsody' })),
          el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [
            el('input', { class: 'sc-field__i', id: 'arcNewRoman', placeholder: L({ gr: 'Γράμμα (π.χ. Ν)', en: 'Letter (e.g. Ν)' }), style: 'flex:0 0 auto;width:110px' }),
            el('input', { class: 'sc-field__i', id: 'arcNewTitle', placeholder: L({ gr: 'Τίτλος ραψωδίας', en: 'Rhapsody title' }), style: 'flex:2;min-width:160px' }),
            el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () {
              sweep();
              var roman = ((document.getElementById('arcNewRoman') || {}).value || '').trim();
              var title = ((document.getElementById('arcNewTitle') || {}).value || '').trim();
              if (!title && !roman) return;
              if (!title) title = roman;
              var taken = Object.keys(model[activeCamp].rhaps);
              var key = _arcSlug(title || roman, taken);
              model[activeCamp].rhaps[key] = { roman: roman || (title.toUpperCase().slice(0, 1)), latin: '', title: title, boss: '', quiz: [] };
              model[activeCamp].order.push(key);
              paintArc();
            } }, L({ gr: '＋ Πρόσθεσε ραψωδία', en: '＋ Add rhapsody' })),
          ]),
        ]));

        // ── save ──
        var msg = el('span', { class: 'sc-hint', style: 'margin-left:10px' });
        host.appendChild(el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:6px' }, [
          el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function (e) {
            sweep();
            var probs = validate();
            if (probs.length) {
              msg.textContent = '⚠ ' + probs.slice(0, 4).join(' · ') + (probs.length > 4 ? ' …(+' + (probs.length - 4) + ')' : '');
              msg.style.color = '#b3261e';
              return;
            }
            try {
              var cfg = buildCfg();
              if (Object.keys(cfg).length) { if (SymStore) SymStore.set('arcade_content', cfg); }
              else { if (SymStore) SymStore.set('arcade_content', null); }
            } catch (_e) {}
            msg.style.color = '';
            var btn = e.currentTarget;
            btn.textContent = '✓ ' + L({ gr: 'Αποθηκεύτηκε', en: 'Saved' });
            setTimeout(function () { try { btn.textContent = L({ gr: 'Αποθήκευση Arcade', en: 'Save Arcade' }); } catch (_e2) {} }, 1400);
          } }, L({ gr: 'Αποθήκευση Arcade', en: 'Save Arcade' })),
          msg,
        ]));
      }

      // Single editable question row (q + 4 options + correct radio + delete).
      function _arcQuestionRow(key, q, qi) {
        var row = el('div', { class: 'sc-form', style: 'margin:0 0 8px;background:color-mix(in srgb,var(--sym-fg,#1E1810) 4%,transparent)' });
        var top = el('div', { style: 'display:flex;gap:8px;align-items:flex-end;flex-wrap:wrap' });
        top.appendChild(el('label', { class: 'sc-field', style: 'flex:1;min-width:200px' }, [
          el('span', { class: 'sc-field__l' }, L({ gr: 'Ερώτηση', en: 'Question' }) + ' ' + (qi + 1)),
          el('input', { class: 'sc-field__i', value: q.q || '', 'data-arc-q': '1', 'data-rhap': key, 'data-qi': qi, oninput: (function (k, i) { return function (e) { model[activeCamp].rhaps[k].quiz[i].q = e.target.value; }; })(key, qi) }),
        ]));
        top.appendChild(el('button', { class: 'sc-mini', style: 'flex:0 0 auto', onclick: (function (k, i) { return function () {
          sweep();
          model[activeCamp].rhaps[k].quiz.splice(i, 1);
          paintArc();
        }; })(key, qi) }, L({ gr: '✕', en: '✕' })));
        row.appendChild(top);

        // four options, each with a "correct" radio.
        var radioName = 'arc-' + activeCamp + '-' + key + '-' + qi;
        var opts = el('div', { style: 'display:flex;flex-direction:column;gap:6px;margin-top:8px' });
        [0, 1, 2, 3].forEach(function (oi) {
          var radioAttrs = { type: 'radio', name: radioName, 'data-arc-a': oi, 'data-rhap': key, 'data-qi': qi,
            style: 'flex:0 0 auto', onchange: (function (k, i, idx) { return function () { model[activeCamp].rhaps[k].quiz[i].a = idx; }; })(key, qi, oi) };
          if (q.a === oi) radioAttrs.checked = 'checked';
          opts.appendChild(el('label', { class: 'sc-field', style: 'flex-direction:row;align-items:center;gap:8px;margin:0' }, [
            el('input', radioAttrs),
            el('span', { class: 'sc-field__l', style: 'margin:0;min-width:54px' }, L({ gr: 'Σωστή', en: 'Correct' })),
            el('input', { class: 'sc-field__i', style: 'flex:1', value: (q.o && q.o[oi]) || '', placeholder: L({ gr: 'Επιλογή', en: 'Option' }) + ' ' + (oi + 1),
              'data-arc-o': '1', 'data-rhap': key, 'data-qi': qi, 'data-oi': oi,
              oninput: (function (k, i, idx) { return function (e) { model[activeCamp].rhaps[k].quiz[i].o[idx] = e.target.value; }; })(key, qi, oi) }),
          ]));
        });
        row.appendChild(opts);
        return row;
      }

      paintArc();
    }
    // Normalise a quiz array to the exact {q,o:[4],a} shape override.js expects.
    function _arcCleanQuiz(quiz) {
      return (Array.isArray(quiz) ? quiz : []).map(function (q) {
        var o = Array.isArray(q.o) ? q.o.slice(0, 4) : [];
        while (o.length < 4) o.push('');
        var a = (typeof q.a === 'number' && q.a >= 0 && q.a <= 3) ? q.a : 0;
        return { q: String(q.q || ''), o: o.map(function (x) { return String(x == null ? '' : x); }), a: a };
      });
    }
    // Structural equality of two quiz arrays (for change detection vs defaults).
    function _arcQuizEq(a, b) {
      a = Array.isArray(a) ? a : []; b = Array.isArray(b) ? b : [];
      if (a.length !== b.length) return false;
      for (var i = 0; i < a.length; i++) {
        var x = a[i], y = b[i];
        if (String(x.q || '') !== String(y.q || '')) return false;
        if ((x.a | 0) !== (y.a | 0)) return false;
        var xo = Array.isArray(x.o) ? x.o : [], yo = Array.isArray(y.o) ? y.o : [];
        for (var j = 0; j < 4; j++) { if (String(xo[j] || '') !== String(yo[j] || '')) return false; }
      }
      return true;
    }

    /* ════════════════ PAINT ════════════════════════════════════════ */
    function paint() {
      pane.innerHTML = '';
      if (activeSec === 'overview') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Πρόσφατη δραστηριότητα', en: 'Recent activity' })));
        // REAL feed aggregated from the stores we own (messages / grants /
        // feedback / template assignments / banners / coupons). Honest empty
        // state when nothing has happened yet — no demo strings.
        var feed = activityFeed(12);
        if (!feed.length) {
          pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Καμία πρόσφατη δραστηριότητα ακόμη. Οι ενέργειες (μηνύματα, χορηγήσεις, σχόλια, αναθέσεις, banners) θα εμφανίζονται εδώ.', en: 'No recent activity yet. Actions (messages, grants, feedback, assignments, banners) will appear here.' })));
        } else {
          feed.forEach(function (a) {
            pane.appendChild(el('div', { class: 'sc-act' }, [
              el('span', { class: 'sc-act__ic' }, a.ic),
              el('span', { class: 'sc-act__t' }, a.t),
              el('span', { class: 'sc-act__tm' }, relTime(a.ts)),
            ]));
          });
        }
      }
      else if (activeSec === 'users') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Χρήστες', en: 'Users' })));
        pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({
          gr: 'Από τις χορηγήσεις πρόσβασης (τοπικά) + τη συλλογή users του Firestore όταν υπάρχει σύνδεση.',
          en: 'From access grants (local) + the Firestore users collection when connected.'
        })));
        pane.appendChild(el('input', { class: 'sc-search', placeholder: L({ gr: 'Αναζήτηση χρήστη…', en: 'Search user…' }), oninput: function (e) { var q = e.target.value.toLowerCase(); pane.querySelectorAll('.sc-tr:not(.sc-tr--h)').forEach(function (r) { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; }); } }));

        // Seed from real grants (email + role + tier). De-dupe by email.
        var byEmail = {};
        grantsLoad().forEach(function (g) {
          var e = String(g.email || '').toLowerCase(); if (!e) return;
          if (!byEmail[e]) byEmail[e] = { email: e, name: '', role: g.role || '', tier: g.tier || '' };
        });
        var users = Object.keys(byEmail).map(function (k) { return byEmail[k]; });

        var tblHost = el('div', {});
        pane.appendChild(tblHost);
        function paintUsers() {
          tblHost.innerHTML = '';
          if (!users.length) {
            tblHost.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Κανένας χρήστης ακόμη. Χορήγησε πρόσβαση από «Χορήγηση Πρόσβασης» ή συνδέσου στο Firestore.', en: 'No users yet. Grant access from “Grant Access”, or connect Firestore.' })));
            return;
          }
          var tbl = el('div', { class: 'sc-table' });
          tbl.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [el('span', {}, L({ gr: 'Όνομα / Email', en: 'Name / Email' })), el('span', {}, L({ gr: 'Ρόλος', en: 'Role' })), el('span', {}, L({ gr: 'Πακέτο', en: 'Tier' })), el('span', {}, L({ gr: 'Ενέργειες', en: 'Actions' }))]));
          users.forEach(function (u) {
            var tierLabel = (window.SymTiers ? SymTiers.label(u.tier) : null);
            tbl.appendChild(el('div', { class: 'sc-tr' }, [
              el('span', { class: 'sc-tr__task' }, u.name ? (u.name + ' · ' + u.email) : u.email),
              el('span', {}, u.role || '—'),
              el('span', {}, u.tier ? el('em', { class: 'sc-badge2 sc-badge2--' + (u.tier === 'free' ? 'open' : 'done') }, tierLabel ? L(tierLabel) : u.tier) : '—'),
              el('span', { class: 'sc-tr__acts' }, [
                // View → message composer pre-targeted (real action, not a stub).
                el('button', { class: 'sc-mini', onclick: (function (em) { return function () { window.__adminSec = 'messaging'; window.__msgPrefill = { title: '', body: '', to: em }; activeSec = 'messaging'; paint(); }; })(u.email) }, L({ gr: 'Μήνυμα', en: 'Message' })),
                // Edit → jump to Grant Access (the real place to change a user's tier).
                el('button', { class: 'sc-mini sc-mini--accent', onclick: function () { window.__adminSec = 'grant'; activeSec = 'grant'; rail.querySelectorAll('.sc-admin2__nav').forEach(function (b) { b.classList.toggle('active', b.dataset.s === 'grant'); }); paint(); } }, L({ gr: 'Χορήγηση', en: 'Grant' })),
              ]),
            ]));
          });
          tblHost.appendChild(tbl);
        }
        paintUsers();

        // Guarded Firestore patch: pull real users → merge by email, re-render.
        try {
          if (fsReady()) {
            firebase.firestore().collection('users').limit(200).get().then(function (snap) {
              if (snap.empty) return;
              snap.forEach(function (d) {
                var v = d.data() || {};
                var e = String(v.email || d.id || '').toLowerCase(); if (!e) return;
                if (!byEmail[e]) { byEmail[e] = { email: e, name: '', role: '', tier: '' }; users.push(byEmail[e]); }
                var rec = byEmail[e];
                if (v.displayName || v.name) rec.name = v.displayName || v.name;
                if (v.role && !rec.role) rec.role = v.role;
                if ((v.tier || v.userType) && !rec.tier) rec.tier = v.tier || v.userType;
              });
              // Only repaint if the users section is still showing.
              if (activeSec === 'users') paintUsers();
            }).catch(function () { /* rules/offline — keep grants-only list */ });
          }
        } catch (_e) { /* no firebase — fine */ }
      }
      else if (activeSec === 'access') {
        // Έλεγχος Πρόσβασης → the REAL per-class Class Plan planner (Ver1
        // functionality: class tabs · Practice/Theory · datasets+engines with
        // level toggles + tier · Save). admin-cc.css scopes its styles to
        // #page-admin, so mount inside a scoping host with the fullscreen/hidden
        // layout neutralised inline so it renders inline + light in the pane.
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Έλεγχος Πρόσβασης — Σχέδιο Τάξης', en: 'Access Control — Class Plan' })));
        if (window.AdminCC && typeof window.AdminCC.classPlanHTML === 'function') {
          var cphost = el('div', { id: 'page-admin-embed', class: 'syn-cc-embed',
            style: 'position:static;display:block;inset:auto;z-index:auto;height:auto;min-height:0;background:transparent;color:inherit' });
          var cpwork = el('div', { class: 'cc-work', style: 'padding:0' });
          cphost.appendChild(cpwork);
          pane.appendChild(cphost);
          try {
            cpwork.innerHTML = window.AdminCC.classPlanHTML();
            window.AdminCC.classPlanInit();
          } catch (e) {
            console.error('[admin-synthesis] class plan mount failed', e);
            cphost.remove();
            if (typeof renderAccessControl === 'function') renderAccessControl();
          }
        } else if (typeof renderAccessControl === 'function') {
          renderAccessControl();
        }
      }
      else if (activeSec === 'studio') {
        // Real Site Studio (admin-studio.js) mounted in-pane.
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Studio — Τάξεις → Μαθήματα → Παιχνίδια → Ερωτήσεις', en: 'Studio — Grades → Subjects → Games → Questions' })));
        if (window.AdminStudio && typeof window.AdminStudio.view === 'function') {
          // Scope under a neutralised #page-admin host so admin-studio.css /
          // admin-cc.css light styles apply (same trick as the Access planner).
          var shost = el('div', { id: 'page-admin-embed', class: 'syn-cc-embed',
            style: 'position:static;display:block;inset:auto;z-index:auto;height:auto;min-height:0;background:transparent;color:inherit' });
          var host = el('div', { class: 'cc-work sc-studio-host', style: 'padding:0' });
          var panel = el('div', { class: 'cc-panel', id: 'cc-panel' });
          host.appendChild(panel);
          shost.appendChild(host);
          pane.appendChild(shost);
          try {
            panel.innerHTML = window.AdminStudio.view();
            if (typeof window.AdminStudio.init === 'function') window.AdminStudio.init();
          } catch (e) {
            console.error('[admin-synthesis] studio mount failed', e);
            panel.innerHTML = '';
            panel.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Το Studio δεν φόρτωσε εδώ — δοκίμασε «↻ Συγχρονισμός» ή ανανέωσε τη σελίδα.', en: 'Studio could not mount here — try “↻ Sync” or reload the page.' })));
          }
        } else {
          pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Το AdminStudio δεν είναι διαθέσιμο.', en: 'AdminStudio is not available.' })));
        }
      }
      else if (activeSec === 'voyage') {
        // ── Authoring TEMPLATES (Trivia & History Synthesis) ──────────────
        // Self-contained React/Babel composer + live-preview tools (export
        // JSON). Each opens in a full-screen overlay iframe via
        // template-launchers.js.
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Πρότυπα — Συνθέτες περιεχομένου', en: 'Templates — Content composers' })));
        pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({ gr: 'Σχεδίασε πρότυπα Trivia & Ιστορίας μέσα από το UI με ζωντανή προεπισκόπηση — εξάγουν JSON config.', en: 'Design Trivia & History templates through the UI with a live preview — they export a JSON config.' })));
        // Present the two templates as cards in the SAME style as the Ζωφόρος
        // (Iliada/Eleni) rows below, so they read consistently ("like iliada").
        var twrap = el('div', { class: 'sc-voyadmin', style: 'margin:0 0 22px' });
        [
          { ic: '◆', gr: 'Πρότυπο Trivia', en: 'Trivia Template', mgr: 'Σύνθεση Trivia — περιεχόμενο, πίνακας & ρυθμίσεις', men: 'Compose Trivia — content, board & setup', fn: 'openTriviaTemplate' },
          { ic: '⛩', gr: 'Πρότυπο Ιστορίας', en: 'History Template', mgr: 'Σύνθεση Ιστορίας — θεματικές ενότητες & λειτουργίες μελέτης', men: 'Compose History — thematic units & study modes', fn: 'openHistoryTemplate' },
          { ic: '📜', gr: 'Κείμενα · Μεταφράσεις', en: 'Texts · Translations', mgr: 'Σύνθεση παράλληλου κειμένου — απόδοση & σύνταξη ανά λέξη', men: 'Compose parallel text — translation & per-word syntax', fn: 'openParallelStudio' },
        ].forEach(function (t) {
          twrap.appendChild(el('div', { class: 'sc-voyadmin__row' }, [
            el('span', { class: 'sc-voyadmin__ic', style: 'display:flex;align-items:center;justify-content:center;font-size:18px' }, t.ic),
            el('div', { class: 'sc-voyadmin__b' }, [
              el('div', { class: 'sc-voyadmin__nm' }, t.gr + ' · ' + t.en),
              el('div', { class: 'sc-voyadmin__m' }, L({ gr: t.mgr, en: t.men })),
            ]),
            el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: (function (fn) { return function () { if (typeof window[fn] === 'function') window[fn](); }; })(t.fn) }, L({ gr: 'Άνοιγμα →', en: 'Open →' })),
          ]));
        });
        pane.appendChild(twrap);

        // ── Assign a template to a class + subject → student tile ──────────
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Ανάθεση προτύπου σε τάξη / μάθημα', en: 'Assign template to class / subject' })));
        pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({ gr: 'Διάλεξε τύπο, τάξη & μάθημα — το πρότυπο εμφανίζεται ως πλακίδιο στη σελίδα του μαθήματος (όπως ο Ζωφόρος Ιλιάδας).', en: 'Pick type, class & subject — the template appears as a tile on that subject page (like the Iliad Frieze).' })));
        (function () {
          var aType = 'trivia', aClass = '', aSubj = '';
          var typeS = el('select', { class: 'sc-field__i sc-select', onchange: function (e) { aType = e.target.value; } }, [el('option', { value: 'trivia' }, 'Trivia'), el('option', { value: 'history' }, L({ gr: 'Ιστορία', en: 'History' }))]);
          var subjS = el('select', { class: 'sc-field__i sc-select', onchange: function (e) { aSubj = e.target.value; } }, []);
          function fillSubj() {
            subjS.innerHTML = ''; aSubj = '';
            subjS.appendChild(el('option', { value: '' }, L({ gr: '— μάθημα —', en: '— subject —' })));
            acSubjects(aClass).forEach(function (s) { subjS.appendChild(el('option', { value: s.id }, L(s))); });
          }
          // ISSUE 6: use acScopeList() (6 grade classes + grammar/theory banks)
          // instead of SYM().CLASSES, so every keyed SUBJECTS scope is
          // assignable — grammar-track subjects (Ρήματα, Ονόματα, Συντακτικό…)
          // were previously unreachable because only CLASSES was iterated.
          var classS = el('select', { class: 'sc-field__i sc-select', onchange: function (e) { aClass = e.target.value; fillSubj(); } },
            [el('option', { value: '' }, L({ gr: '— τάξη —', en: '— class —' }))].concat(acScopeList().map(function (c) { return el('option', { value: c.id }, L(c.label)); })));
          var labGr = el('input', { class: 'sc-field__i', placeholder: L({ gr: 'Τίτλος (π.χ. Trivia Λογοτεχνίας)', en: 'Title (gr)' }) });
          var labEn = el('input', { class: 'sc-field__i', placeholder: 'Title (en)' });
          fillSubj();
          pane.appendChild(el('div', { class: 'sc-voyadmin', style: 'gap:8px' }, [
            el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Τύπος', en: 'Type' })), typeS]),
            el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Τάξη', en: 'Class' })), classS]),
            el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Μάθημα', en: 'Subject' })), subjS]),
            el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Τίτλος', en: 'Title' })), labGr]),
            el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, 'EN'), labEn]),
            el('button', {
              class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () {
                if (!aClass || !aSubj || !labGr.value.trim()) return;
                var arr = taLoad();
                arr.push({ id: 'ta-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), classId: aClass, subjectId: aSubj, type: aType, label: { gr: labGr.value.trim(), en: labEn.value.trim() || labGr.value.trim() }, meta: aType === 'history' ? 'Ιστορία' : 'Trivia', illu: aType === 'history' ? 'scroll' : 'amphora', preset: aSubj, course: 'g3', ts: Date.now() });
                taSave(arr); paint();
              }
            }, L({ gr: '＋ Ανάθεση', en: '＋ Assign' })),
          ]));
          var list = taLoad();
          if (list.length) {
            var lw = el('div', { class: 'sc-voyadmin', style: 'margin-top:12px' });
            list.forEach(function (a) {
              var c = (SYM().classById && SYM().classById(a.classId));
              lw.appendChild(el('div', { class: 'sc-voyadmin__row' }, [
                el('div', { class: 'sc-voyadmin__b' }, [
                  el('div', { class: 'sc-voyadmin__nm' }, L(a.label)),
                  el('div', { class: 'sc-voyadmin__m' }, (c ? L(c) : a.classId) + ' · ' + a.subjectId + ' · ' + a.type),
                ]),
                el('button', { class: 'sc-mini', onclick: (function (id, lbl) { return function () { adminConfirm(L({ gr: 'Αφαίρεση ανάθεσης «' + lbl + '»;', en: 'Remove assignment “' + lbl + '”?' }), function () { taSave(taLoad().filter(function (x) { return x.id !== id; })); paint(); }); }; })(a.id, L(a.label)) }, L({ gr: '✕ Διαγραφή', en: '✕ Delete' })),
              ]));
            });
            pane.appendChild(lw);
          }
        })();

        // ── ΠΡΟΤΥΠΑ ΘΕΩΡΙΑΣ (ISSUE 8) ─────────────────────────────────────
        // List every registered theory lesson (window.THEORY_META) and open the
        // override editor for it; plus assign a theory lesson to a class/subject
        // so it renders as a student tile (type:'theory' + datasetId → launches
        // openTheoryLesson via syn-assignments.js).
        (function () {
          var META = window.THEORY_META || {};
          var ids = Object.keys(META);
          pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Πρότυπα Θεωρίας', en: 'Theory Prototypes' })));
          pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({
            gr: 'Επεξεργάσου το πρότυπο κάθε μαθήματος θεωρίας (εισαγωγή, badges, παράδειγμα, κάρτες). Οι αλλαγές αποθηκεύονται ως override (lesson_overrides) και υπερισχύουν του προεπιλεγμένου. Οι πίνακες κλίσης προέρχονται από το dataset και δεν αλλάζουν εδώ.',
            en: 'Edit each theory lesson prototype (intro, badges, example, cards). Changes save as an override (lesson_overrides) and win over the default. Declension tables come from the dataset and are not edited here.'
          })));
          if (!ids.length) {
            pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Δεν φορτώθηκαν πρότυπα θεωρίας (theory-data.js).', en: 'No theory prototypes loaded (theory-data.js).' })));
          } else {
            var tw = el('div', { class: 'sc-voyadmin', style: 'margin:0 0 22px' });
            ids.forEach(function (id) {
              var m = META[id] || {};
              tw.appendChild(el('div', { class: 'sc-voyadmin__row' }, [
                el('span', { class: 'sc-voyadmin__ic', style: 'display:flex;align-items:center;justify-content:center;font-size:18px' }, '📖'),
                el('div', { class: 'sc-voyadmin__b' }, [
                  el('div', { class: 'sc-voyadmin__nm' }, id + (m.posLabel ? ' · ' + m.posLabel : '')),
                  el('div', { class: 'sc-voyadmin__m' }, (m.level || '') + (m.meaning ? ' · ' + m.meaning : '')),
                ]),
                el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: (function (lid) { return function () {
                  var lesson = (typeof window.buildLessonFromDataset === 'function') ? window.buildLessonFromDataset(lid) : null;
                  if (!lesson) { lesson = { id: lid, title: lid, posLabel: (META[lid] || {}).posLabel, level: (META[lid] || {}).level, meaning: (META[lid] || {}).meaning, intro: (META[lid] || {}).intro, badges: (META[lid] || {}).badges, example: (META[lid] || {}).example, cards: (META[lid] || {}).cards }; }
                  if (typeof window.openTheoryEditor === 'function') window.openTheoryEditor(lesson, function () { paint(); });
                  else adminConfirm(L({ gr: 'Ο επεξεργαστής θεωρίας δεν φορτώθηκε.', en: 'Theory editor not loaded.' }), function () {});
                }; })(id) }, L({ gr: '✎ Επεξεργασία', en: '✎ Edit' })),
              ]));
            });
            pane.appendChild(tw);

            // ── assign a theory lesson to a class + subject ──────────────
            pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:0 0 8px' }, L({ gr: 'Ανάθεση θεωρίας σε τάξη / μάθημα', en: 'Assign theory to class / subject' })));
            (function () {
              var thClass = '', thSubj = '', thId = ids[0] || '';
              var thIdS = el('select', { class: 'sc-field__i sc-select', onchange: function (e) { thId = e.target.value; } },
                ids.map(function (id) { return el('option', { value: id }, id); }));
              var thSubjS = el('select', { class: 'sc-field__i sc-select', onchange: function (e) { thSubj = e.target.value; } }, []);
              function thFill() {
                thSubjS.innerHTML = ''; thSubj = '';
                thSubjS.appendChild(el('option', { value: '' }, L({ gr: '— μάθημα —', en: '— subject —' })));
                acSubjects(thClass).forEach(function (s) { thSubjS.appendChild(el('option', { value: s.id }, L(s))); });
              }
              var thClassS = el('select', { class: 'sc-field__i sc-select', onchange: function (e) { thClass = e.target.value; thFill(); } },
                [el('option', { value: '' }, L({ gr: '— τάξη —', en: '— class —' }))].concat(acScopeList().map(function (c) { return el('option', { value: c.id }, L(c.label)); })));
              var thLabGr = el('input', { class: 'sc-field__i', placeholder: L({ gr: 'Τίτλος πλακιδίου', en: 'Tile title (gr)' }) });
              var thLabEn = el('input', { class: 'sc-field__i', placeholder: 'Title (en)' });
              thFill();
              pane.appendChild(el('div', { class: 'sc-voyadmin', style: 'gap:8px' }, [
                el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Μάθημα θεωρίας', en: 'Theory lesson' })), thIdS]),
                el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Τάξη', en: 'Class' })), thClassS]),
                el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Μάθημα', en: 'Subject' })), thSubjS]),
                el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, L({ gr: 'Τίτλος', en: 'Title' })), thLabGr]),
                el('label', { class: 'sc-field' }, [el('span', { class: 'sc-field__l' }, 'EN'), thLabEn]),
                el('button', {
                  class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () {
                    if (!thClass || !thSubj || !thId || !thLabGr.value.trim()) return;
                    var arr = taLoad();
                    arr.push({ id: 'ta-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), classId: thClass, subjectId: thSubj, type: 'theory', datasetId: thId, label: { gr: thLabGr.value.trim(), en: thLabEn.value.trim() || thLabGr.value.trim() }, meta: 'Θεωρία', illu: 'column', ts: Date.now() });
                    taSave(arr); paint();
                  }
                }, L({ gr: '＋ Ανάθεση θεωρίας', en: '＋ Assign theory' })),
              ]));
            })();
          }
        })();

        // ── Ζωφόρος literature games (existing editor, kept additively) ────
        // edit episodes/quizzes via each game's own built-in editor
        // (SymVoyage.openEditor unlocks it; content persists to the same
        // zofatos:content override the student game reads).
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Ζωφόρος — Λογοτεχνικά παιχνίδια', en: 'Frieze — Literature games' })));
        pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({ gr: 'Άνοιξε ένα έργο σε λειτουργία επεξεργασίας για να αλλάξεις επεισόδια, διαλόγους & ερωτήσεις. Οι αλλαγές αποθηκεύονται και εμφανίζονται στους μαθητές.', en: 'Open a work in edit mode to change episodes, dialogues & questions. Changes persist and show to students.' })));
        if (window.SymVoyage) {
          var vs = window.SymVoyage.summary();
          var vwrap = el('div', { class: 'sc-voyadmin' });
          vs.works.forEach(function (w) {
            vwrap.appendChild(el('div', { class: 'sc-voyadmin__row' }, [
              el('span', { class: 'sc-voyadmin__ic', 'data-illu': w.illu }),
              el('div', { class: 'sc-voyadmin__b' }, [
                el('div', { class: 'sc-voyadmin__nm' }, w.gr + ' · ' + w.en),
                el('div', { class: 'sc-voyadmin__m' }, w.started ? (w.answered + ' ✓ · ' + w.stations + ' ' + L({ gr: 'σταθμοί', en: 'stations' })) : L({ gr: 'Καμία δραστηριότητα ακόμη', en: 'No activity yet' })),
              ]),
              el('button', { class: 'sc-mini', onclick: (function (slug) { return function () { window.SymVoyage.open(slug, false); }; })(w.slug) }, L({ gr: '▷ Προεπισκόπηση', en: '▷ Preview' })),
              el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: (function (slug) { return function () { window.SymVoyage.openEditor(slug); }; })(w.slug) }, L({ gr: '✎ Επεξεργασία', en: '✎ Edit' })),
            ]));
          });
          pane.appendChild(vwrap);
        } else {
          pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Τα παιχνίδια Ζωφόρος δεν φορτώθηκαν.', en: 'Voyage games not loaded.' })));
        }
      }
      else if (activeSec === 'atlas') {
        // Real Command Atlas (admin-atlas.js) — standalone overlay.
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Command Atlas — Έκτακτα & Kill-switch', en: 'Command Atlas — Emergency & Kill-switch' })));
        pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({ gr: 'Ο πλήρης Atlas (kill-switches, wildcard access, καθαρισμός cache) ανοίγει σε overlay.', en: 'The full Atlas (kill-switches, wildcard access, cache purge) opens as an overlay.' })));
        pane.appendChild(el('button', {
          class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () { if (typeof window.ccOpenAtlas === 'function') window.ccOpenAtlas(); }
        }, [el('span', { style: 'margin-right:6px' }, '⌘'), L({ gr: 'Άνοιγμα Command Atlas', en: 'Open Command Atlas' })]));
        // quick local toggles (still here for at-a-glance)
        pane.appendChild(el('div', { class: 'sc-atlas', style: 'margin-top:16px' }, [
          atlasRow('🛑', L({ gr: 'Kill switch συνδρομών', en: 'Subscriptions kill-switch' }), 1),
          atlasRow('🛑', L({ gr: 'Παύση Live Arena', en: 'Pause Live Arena' }), 0),
          atlasRow('🔒', L({ gr: 'Κλείδωμα εγγραφών', en: 'Lock signups' }), 0),
          atlasRow('🧹', L({ gr: 'Καθαρισμός cache', en: 'Purge cache' }), 0),
        ]));
      }
      else if (activeSec === 'realm') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Curator’s Realm — Οικονομία Ναού', en: 'Curator’s Realm — Temple economy' })));
        pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({ gr: 'Επεξεργασία ακρωτηρίων, ευλογιών, άθλων & saga — χωρίς deploy.', en: 'Edit cosmetics, boons, quests & saga — no deploy.' })));
        pane.appendChild(el('div', { class: 'sc-realm' }, [['⛩', 'Ακρωτήρια', '13'], ['⚡', 'Ευλογίες', '5'], ['🜂', 'Αναλώσιμα', '3'], ['📜', 'Άθλοι', '10'], ['🏛', 'Saga', '5 κεφ.'], ['💰', 'Game rewards', '17']].map(function (r) {
          return el('button', { class: 'sc-realm__c', onclick: function () { if (window.synOpenAcroteria) window.synOpenAcroteria(); } }, [el('span', { class: 'sc-realm__ic' }, r[0]), el('b', {}, r[1]), el('small', {}, r[2])]);
        })));
        // add a new acroterion → appears in the Agora automatically
        var customAcro = SymStore ? SymStore.get('custom_acroteria', []) : [];
        pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:18px 0 6px' }, L({ gr: 'Νέο ακρωτήριο → Ἀγορά', en: 'New acroterion → Agora' })));
        var RILLUS = ['acropolis', 'trireme', 'owl', 'column', 'amphora', 'olive-branch', 'trident', 'horse', 'helmet', 'lyre', 'eagle', 'wreath-laurel', 'flame', 'torch', 'sword', 'crown'];
        var RCATS = [['found', 'Θεμέλια'], ['season', 'Ἑορταί'], ['myth', 'Μυθολογία'], ['epic', 'Ἔπη'], ['life', 'Βίος'], ['byz', 'Βυζάντιο'], ['modern', 'Νεωτέρα'], ['world', 'Κόσμος']];
        pane.appendChild(el('div', { class: 'sc-form' }, [
          el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap;align-items:center' }, [
            el('input', { class: 'sc-field__i', id: 'newAcroNm', placeholder: L({ gr: 'Όνομα (π.χ. Ἡφαίστειον)', en: 'Name (e.g. Hephaisteion)' }), style: 'flex:2;min-width:150px' }),
            el('input', { class: 'sc-field__i', id: 'newAcroCost', type: 'number', value: '1200', style: 'flex:1;min-width:84px' }),
            el('select', { class: 'sc-field__i sc-select', id: 'newAcroIllu', style: 'flex:1;min-width:110px' }, RILLUS.map(function (i) { return el('option', { value: i }, i); })),
            el('select', { class: 'sc-field__i sc-select', id: 'newAcroCat', style: 'flex:1;min-width:110px' }, RCATS.map(function (c) { return el('option', { value: c[0] }, c[1]); })),
            el('button', {
              class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () {
                var nm = document.getElementById('newAcroNm').value.trim(); if (!nm || !SymStore) return;
                var cost = parseInt(document.getElementById('newAcroCost').value, 10) || 0;
                var illu = document.getElementById('newAcroIllu').value, cat = document.getElementById('newAcroCat').value;
                var cur = SymStore.get('custom_acroteria', []); cur.push({ id: 'cac-' + Date.now(), cat: cat, illu: illu, gr: nm, en: nm, cost: cost, owned: 0, lore: { gr: 'Προστέθηκε από τον Curator.', en: 'Added by the Curator.' } });
                SymStore.set('custom_acroteria', cur); paint();
              }
            }, L({ gr: '＋ Πρόσθεσε', en: '＋ Add' })),
          ]),
        ]));
        if (customAcro.length) {
          var tbl2 = el('div', { class: 'sc-table', style: 'margin-top:12px' });
          tbl2.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [el('span', {}, L({ gr: 'Ακρωτήριο', en: 'Acroterion' })), el('span', {}, 'Kleos'), el('span', {}, '')]));
          customAcro.forEach(function (a, i) { tbl2.appendChild(el('div', { class: 'sc-tr' }, [el('span', { class: 'sc-tr__task' }, L(a)), el('span', {}, (a.cost || 0).toLocaleString('en-US')), el('span', { class: 'sc-tr__acts' }, [el('button', { class: 'sc-mini', onclick: function () { adminConfirm(L({ gr: 'Διαγραφή «' + L(a) + '»;', en: 'Delete “' + L(a) + '”?' }), function () { var c = SymStore.get('custom_acroteria', []).filter(function (_x, j) { return j !== i; }); SymStore.set('custom_acroteria', c); paint(); }); } }, L({ gr: 'Διαγραφή', en: 'Delete' }))])])); });
          pane.appendChild(tbl2);
        }
      }
      else if (activeSec === 'games') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Έλεγχος περιεχομένου — όλα τα παιχνίδια του Πίνακα', en: 'Content review — every game in the Panel' })));
        // Clarify what this section IS — it is preview/spot-check ("έλεγχος"), NOT
        // a Q&A authoring tool. Point to where authoring & the registry actually live.
        pane.appendChild(el('div', { class: 'sc-hint', style: 'margin:-4px 0 10px;opacity:.8' }, L({ gr: 'Μόνο προεπισκόπηση. Για δημιουργία ερωτήσεων → «Studio» · για ετικέτες & μητρώο → «Ετικέτες Παιχνιδιών».', en: 'Preview only. To author questions → "Studio" · for tags & registry → "Game Tags".' })));
        pane.appendChild(el('div', { class: 'sc-refreshbar' }, [el('button', { class: 'sc-refresh', onclick: function () { if (window.SymTags) SymTags.refresh(); paint(); } }, [el('span', { class: 'sc-refresh__ic', html: '↻' }), L({ gr: 'Ανανέωση για νέα', en: 'Refresh for new' })])]));
        // Show the FULL game catalogue (every game in the Game Panel), not just the
        // 12 carousel engines — this is the admin's "see what exists in the panel".
        var _cat = (window.SymTags && SymTags.catalogue) ? SymTags.catalogue() : (SYM().ENGINES || []);
        var g = el('div', { class: 'sc-admin__games' });
        _cat.forEach(function (e) {
          g.appendChild(el('button', {
            class: 'sc-admin__game', onclick: function () { if (window.SymPreview) SymPreview.open((SymPreview.typeFor && SymPreview.typeFor(e)) || 'mc', { title: L(e), illu: e.illu, note: L({ gr: 'Έλεγξε ερωτήσεις & απαντήσεις για λάθη.', en: 'Check questions & answers for mistakes.' }) }); }
          }, [glyph(e.illu, 'sc-admin__gicon'), el('span', {}, L(e)), el('span', { class: 'sc-admin__qa', title: L({ gr: 'προεπισκόπηση', en: 'preview' }) }, '⌕')]));
        });
        pane.appendChild(g);
        pane.appendChild(el('div', { class: 'sc-hint', style: 'margin-top:10px;opacity:.7' }, L({ gr: _cat.length + ' παιχνίδια στο μητρώο', en: _cat.length + ' games in the registry' })));
      }
      else if (activeSec === 'tags') {
        // Re-expose the COMPLETE game-tags admin (Refresh + full catalogue + tag
        // toggling) — it shipped in js/tags.js but was only wired in the dead
        // screens-2.js admin, so it was unreachable from the active light admin.
        if (window.SymTags && SymTags.renderAdmin) SymTags.renderAdmin(pane, { accent: accent });
        else pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Η μονάδα ετικετών δεν φορτώθηκε.', en: 'Tags module not loaded.' })));
      }
      else if (activeSec === 'subs') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Συνδρομές & Πακέτα', en: 'Subscriptions & Bundles' })));
        // REAL figures — honest local counters, patched live by Firestore (statSet).
        pane.appendChild(el('div', { class: 'sc-stats' }, [
          stat(String(localStat('stat_subs')), L({ gr: 'Ενεργές', en: 'Active' }), accent, 'subs'),
          stat('€' + String(localStat('stat_mrr')), 'MRR', accent, 'mrr'),
          stat(String(localStat('stat_churn')) + '%', L({ gr: 'Churn', en: 'Churn' }), accent, 'churn'),
        ]));
        loadFirestoreStats();
        // Plans come from the pricing config (the single source of truth).
        // Per-plan subscriber counts are REAL (from active subscription docs) or
        // '—' — never the old invented 892/160/17.
        var pst = pricingLoad();
        var keys = planKeys(pst);
        pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:14px 0 8px' }, L({ gr: 'Πακέτα', en: 'Plans' })));
        var ptbl = el('div', { class: 'sc-table' });
        ptbl.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [el('span', {}, L({ gr: 'Πακέτο', en: 'Plan' })), el('span', {}, '€/' + L({ gr: 'μήνα', en: 'mo' })), el('span', {}, L({ gr: 'Συνδρομές', en: 'Subs' })), el('span', {}, '')]));
        keys.forEach(function (k) {
          var mPrice = (pst[k] && pst[k][1] != null) ? pst[k][1] : '—';
          ptbl.appendChild(el('div', { class: 'sc-tr' }, [
            el('span', { class: 'sc-tr__task' }, L(planLabel(pst, k))),
            el('span', {}, mPrice === '—' ? '—' : '€' + mPrice),
            el('span', { class: 'sc-plan-n', 'data-plan-n': k }, '—'),
            el('span', {}, ''),
          ]));
        });
        pane.appendChild(ptbl);
        pane.appendChild(el('p', { class: 'sc-hint', style: 'margin-top:10px' }, L({ gr: 'Διαχείριση τιμών, bundles & οικογενειακού πακέτου → ενότητα «Τιμολόγηση».', en: 'Manage prices, bundles & the family plan → the “Pricing” section.' })));
        // Guarded per-plan active-subscriber counts from real subscription docs.
        try {
          if (fsReady()) {
            firebase.firestore().collection('subscriptions').where('status', '==', 'active').get().then(function (snap) {
              var tally = {};
              snap.forEach(function (d) { var v = d.data() || {}; var pk = v.userType || v.plan || v.tier; if (pk) tally[pk] = (tally[pk] || 0) + 1; });
              try {
                document.querySelectorAll('.sc-plan-n[data-plan-n]').forEach(function (n) {
                  var pk = n.getAttribute('data-plan-n'); n.textContent = tally[pk] != null ? String(tally[pk]) : '—';
                });
              } catch (_e) {}
            }).catch(function () {});
          }
        } catch (_e) {}
      }
      else if (activeSec === 'messaging') {
        renderMessaging();
      }
      else if (activeSec === 'hero') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Hero Carousel — διαφάνειες αρχικής', en: 'Hero Carousel — homepage slides' })));
        var slides = (SymStore && SymStore.get('hero_slides', null)) || (SYM().SHOWCASE || []).map(function (s) { return { kind: s.kind, illu: s.illu, tgr: L(s.t), dgr: L(s.d) }; });
        var list = el('div', { class: 'sc-slides' });
        function saveHero() { if (SymStore) SymStore.set('hero_slides', slides.map(function (s) { return { kind: s.kind || 'mode', illu: s.illu, t: { gr: s.tgr || '', en: s.tgr || '' }, d: { gr: s.dgr || '', en: s.dgr || '' } }; })); }
        function paintSlides() {
          list.innerHTML = '';
          slides.forEach(function (s, i) {
            list.appendChild(el('div', { class: 'sc-slide' }, [
              el('button', { class: 'sc-slide__ic', onclick: function () { var ic = prompt(L({ gr: 'Εικονίδιο:', en: 'Icon name:' }), s.illu); if (ic) { s.illu = ic; saveHero(); } } }, [glyph(s.illu, 'sc-gl')]),
              el('div', { class: 'sc-slide__b' }, [
                el('div', { style: 'display:flex;gap:8px' }, [
                  el('select', { class: 'sc-field__i sc-select', style: 'width:auto', onchange: function (e) { s.kind = e.target.value; saveHero(); } }, [el('option', { value: 'mode', selected: s.kind === 'mode' ? 'selected' : null }, 'Mode'), el('option', { value: 'news', selected: s.kind === 'news' ? 'selected' : null }, 'News')]),
                  el('input', { class: 'sc-field__i', value: s.tgr || (s.t && L(s.t)) || '', oninput: function (e) { s.tgr = e.target.value; }, onblur: saveHero, placeholder: L({ gr: 'Τίτλος', en: 'Title' }) }),
                ]),
                el('input', { class: 'sc-field__i', value: s.dgr || (s.d && L(s.d)) || '', oninput: function (e) { s.dgr = e.target.value; }, onblur: saveHero, placeholder: L({ gr: 'Περιγραφή', en: 'Description' }) }),
              ]),
              el('button', { class: 'sc-slide__del', onclick: function () { slides.splice(i, 1); saveHero(); paintSlides(); }, html: '×' }),
            ]));
          });
          if (window.injectIllus) injectIllus(list);
        }
        paintSlides();
        pane.appendChild(list);
        pane.appendChild(el('div', { class: 'sc-slide__foot' }, [
          el('button', { class: 'sc-cta sc-cta--ghost sc-cta--sm', onclick: function () { slides.push({ kind: 'mode', illu: 'lightning-bolt', tgr: 'Νέα διαφάνεια', dgr: '' }); saveHero(); paintSlides(); } }, ['＋ ', L({ gr: 'Νέα διαφάνεια', en: 'New slide' })]),
          el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () { saveHero(); go('home'); } }, L({ gr: 'Αποθήκευση & προβολή', en: 'Save & view' })),
          el('button', { class: 'sc-mini', onclick: function () { if (SymStore) SymStore.set('hero_slides', null); symRender(); } }, L({ gr: 'Επαναφορά', en: 'Reset' })),
        ]));
      }
      else if (activeSec === 'about') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Σχετικά & Επικοινωνία — panels του footer', en: 'About & Contact — footer panels' })));
        pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:0 0 8px' }, L({ gr: 'Σχετικά', en: 'About' })));
        pane.appendChild(aboutField('about_title', { gr: 'Τίτλος', en: 'Title' }, 'Η αρχαιότητα, σαν παιχνίδι', false));
        pane.appendChild(aboutField('about_mission', { gr: 'Αποστολή', en: 'Mission' }, 'Το SymposiON μετατρέπει τα Αρχαία Ελληνικά, τα Ομηρικά Έπη, την Ιστορία και τα Λατινικά σε παιχνίδια.', true));
        pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:16px 0 8px' }, L({ gr: 'Στοιχεία επικοινωνίας', en: 'Contact details' })));
        pane.appendChild(aboutField('contact_email', { gr: 'Email', en: 'Email' }, 'hello@symposi-on.com', false));
        pane.appendChild(aboutField('contact_address', { gr: 'Διεύθυνση', en: 'Address' }, 'Αθήνα, Ελλάδα', false));
        pane.appendChild(aboutField('contact_hours', { gr: 'Ώρες', en: 'Hours' }, 'Δευτ–Παρ · 9:00–17:00', false));
        pane.appendChild(el('div', { style: 'display:flex;gap:8px;margin-top:14px;flex-wrap:wrap' }, [
          el('button', { class: 'sc-mini sc-mini--accent', onclick: function () { if (window.SymInfoPanel) SymInfoPanel.about(); } }, L({ gr: 'Προεπισκόπηση «Σχετικά»', en: 'Preview “About”' })),
          el('button', { class: 'sc-mini sc-mini--accent', onclick: function () { if (window.SymInfoPanel) SymInfoPanel.contact(); } }, L({ gr: 'Προεπισκόπηση «Επικοινωνία»', en: 'Preview “Contact”' })),
        ]));
      }
      else if (activeSec === 'feedback') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Σχόλια & Αναφορές χρηστών', en: 'User feedback & reports' })));
        var stored = (SymStore && SymStore.get('user_feedback', [])) || [];
        // REAL stored counts — no fake +218 / +12 offsets.
        pane.appendChild(el('div', { class: 'sc-stats', style: 'margin-bottom:12px' }, [stat(String(stored.length), L({ gr: 'Σχόλια', en: 'Reviews' }), accent), stat(String(stored.filter(function (f) { return f.kind === 'bug'; }).length), L({ gr: 'Bugs', en: 'Bugs' }), accent), stat(String(stored.filter(function (f) { return f.new; }).length), L({ gr: 'Νέα', en: 'New' }), accent)]));
        pane.appendChild(el('button', { class: 'sc-mini sc-mini--accent', style: 'margin-bottom:12px', onclick: function () { if (window.SymInfoPanel) SymInfoPanel.feedback(); } }, L({ gr: 'Άνοιγμα φόρμας σχολίων', en: 'Open feedback form' })));
        var fwrap = el('div', { class: 'sc-fbs' });
        stored.forEach(function (f, idx) {
          var isBug = f.kind === 'bug', isContact = f.kind === 'contact';
          fwrap.appendChild(el('div', { class: 'sc-fb' + (f.new ? ' new' : '') + (isBug ? ' sc-fb--bug' : '') }, [
            el('div', { class: 'sc-fb__hd' }, [
              el('span', { class: 'sc-fb__n' }, f.n || L({ gr: 'Ανώνυμος', en: 'Anonymous' })),
              el('span', { class: 'sc-fb__kind' + (isBug ? ' sc-fb__kind--bug' : isContact ? ' sc-fb__kind--contact' : '') }, isBug ? 'BUG' : isContact ? L({ gr: 'ΕΠΙΚΟΙΝΩΝΙΑ', en: 'CONTACT' }) : L({ gr: 'ΣΧΟΛΙΟ', en: 'COMMENT' })),
              (f.new ? el('span', { class: 'sc-fb__new' }, L({ gr: 'ΝΕΟ', en: 'NEW' })) : null),
            ]),
            el('p', { class: 'sc-fb__t' }, f.t),
            (f.ref ? el('div', { class: 'sc-fb__ref' }, '⌖ ' + f.ref) : null),
            el('div', { class: 'sc-fb__act' }, [
              el('button', { class: 'sc-mini', onclick: function (e) { var cur = SymStore.get('user_feedback', []); if (cur[idx]) { cur[idx].new = 0; SymStore.set('user_feedback', cur); } e.currentTarget.textContent = '✓ ' + L({ gr: 'Αναγνωσμένο', en: 'Read' }); } }, L({ gr: 'Σημείωση', en: 'Mark read' })),
              el('button', { class: 'sc-mini', onclick: function () { var cur = SymStore.get('user_feedback', []); cur.splice(idx, 1); SymStore.set('user_feedback', cur); symRender(); } }, L({ gr: 'Διαγραφή', en: 'Delete' })),
            ]),
          ]));
        });
        // (removed hardcoded demo reviews — the section now shows only real
        //  stored feedback, so the count matches the visible cards.)
        pane.appendChild(fwrap);
      }
      else if (activeSec === 'guides') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Οδηγοί — how-to-play', en: 'Guides — how-to-play' })));
        pane.appendChild(el('button', { class: 'sc-mini sc-mini--accent', style: 'margin-bottom:12px', onclick: function () { if (window.SymInfoPanel) SymInfoPanel.guides(); } }, L({ gr: 'Προεπισκόπηση οδηγών', en: 'Preview guides' })));
        var guides = (SymStore && SymStore.get('guides', null)) || (window.SYM_GUIDES_DEFAULT || []).map(function (g) { return Object.assign({}, g, { steps: (g.steps || []).slice() }); });
        var saveG = function () { if (SymStore) SymStore.set('guides', guides); };
        var screensList = [['anodos', 'Άνοδος'], ['temple', 'Ναός'], ['tartarus', 'Tartarus'], ['gamepanel', 'Παιχνίδια'], ['live', 'Live Arena'], ['', '—']];
        var glist = el('div', { class: 'sc-guides' });
        function paintG() {
          glist.innerHTML = '';
          guides.forEach(function (g, i) {
            var card = el('div', { class: 'sc-guide' });
            card.appendChild(el('div', { class: 'sc-guide__hd' }, [
              el('span', { class: 'sc-guide__no' }, String(i + 1).padStart(2, '0')),
              el('input', { class: 'sc-guide__hl', value: g.headline || '', placeholder: 'Headline', oninput: function (e) { g.headline = e.target.value; saveG(); } }),
              el('button', { class: 'sc-mini', onclick: function () { guides.splice(i, 1); saveG(); paintG(); } }, L({ gr: 'Διαγραφή', en: 'Delete' })),
            ]));
            card.appendChild(el('input', { class: 'sc-guide__in', value: g.kicker || '', placeholder: L({ gr: 'Υπότιτλος', en: 'Kicker' }), oninput: function (e) { g.kicker = e.target.value; saveG(); } }));
            card.appendChild(el('textarea', { class: 'sc-guide__in sc-guide__ta', rows: '2', placeholder: L({ gr: 'Εισαγωγή…', en: 'Intro…' }), oninput: function (e) { g.intro = e.target.value; saveG(); } }, g.intro || ''));
            card.appendChild(el('textarea', { class: 'sc-guide__in sc-guide__ta', rows: '4', placeholder: L({ gr: 'Βήματα — ένα ανά γραμμή', en: 'Steps — one per line' }), oninput: function (e) { g.steps = e.target.value.split('\n').map(function (s) { return s.trim(); }).filter(Boolean); saveG(); } }, (g.steps || []).join('\n')));
            var sel = el('select', { class: 'sc-guide__sel', onchange: function (e) { g.ctaScreen = e.target.value; saveG(); } }, screensList.map(function (s) { return el('option', { value: s[0] }, s[1]); }));
            sel.value = g.ctaScreen || '';
            card.appendChild(el('div', { class: 'sc-guide__row' }, [
              el('input', { class: 'sc-guide__in', value: g.ctaLabel || '', placeholder: L({ gr: 'Κείμενο κουμπιού', en: 'Button label' }), oninput: function (e) { g.ctaLabel = e.target.value; saveG(); } }),
              el('label', { class: 'sc-guide__sl' }, [el('span', {}, L({ gr: 'Πάει σε', en: 'Goes to' })), sel]),
            ]));
            glist.appendChild(card);
          });
          if (window.injectIllus) injectIllus(glist);
        }
        paintG();
        pane.appendChild(glist);
        pane.appendChild(el('div', { style: 'display:flex;gap:8px;margin-top:12px;flex-wrap:wrap' }, [
          el('button', { class: 'sc-cta sc-cta--ghost sc-cta--sm', onclick: function () { guides.push({ id: 'g-' + Date.now(), illu: 'book', kicker: 'Πώς να παίξεις', headline: 'Νέος οδηγός', intro: '', steps: [], ctaLabel: 'Άνοιγμα', ctaScreen: '' }); saveG(); paintG(); } }, ['＋ ' + L({ gr: 'Νέος οδηγός', en: 'New guide' })]),
          el('button', { class: 'sc-mini', onclick: function () { if (SymStore) SymStore.set('guides', null); symRender(); } }, L({ gr: 'Επαναφορά', en: 'Reset' })),
        ]));
      }
      else if (activeSec === 'tartarus') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Διαχείριση Tartarus', en: 'Manage Tartarus' })));
        // Persisted toggles (SymStore admin_flags + guarded mirror); read live
        // anywhere via window.adminFlag('tartarus_spaced', true) etc.
        [['tartarus_spaced', { gr: 'Ενεργό spaced-repetition', en: 'Spaced-repetition enabled' }, 1],
         ['tartarus_share', { gr: 'Κοινοποίηση σε καθηγητές', en: 'Share with teachers' }, 1],
         ['tartarus_autoclear', { gr: 'Auto-clear 90 ημερών', en: 'Auto-clear after 90 days' }, 0]
        ].forEach(function (r) { pane.appendChild(toggleRow(r[1], r[2], r[0])); });
      }
      else if (activeSec === 'grant') {
        // ── Access-tier registry: built-ins + admin-created custom tiers ──
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Βαθμίδες Πρόσβασης', en: 'Access Tiers' })));
        pane.appendChild(el('p', { class: 'sc-hint', style: 'margin:0 0 10px' }, L({ gr: 'Ενσωματωμένες (Δωρεάν · Μαθητής · Καθηγητής · Pro) + όσες προσθέσεις. Χρησιμοποιούνται παντού: χορήγηση, έλεγχος πρόσβασης, τιμολόγηση.', en: 'Built-ins (Free · Student · Teacher · Pro) + any you add. Used everywhere: grant, access control, pricing.' })));
        var tlist = el('div', { class: 'sc-tagmgr', style: 'margin-bottom:6px' });
        (window.SymTiers ? SymTiers.all() : []).forEach(function (t) {
          tlist.appendChild(el('span', { class: 'sc-tagchip' + (t.builtin ? '' : ' sc-tagchip--custom') }, [
            L(t),
            t.builtin ? null : el('button', { class: 'sc-tagchip__x', title: L({ gr: 'Διαγραφή', en: 'Delete' }), onclick: (function (id) { return function () { if (window.SymTiers) SymTiers.remove(id); paint(); }; })(t.id), html: '&times;' }),
          ]));
        });
        tlist.appendChild(el('button', { class: 'sc-tagchip sc-tagchip--add', onclick: function () {
          var gr = prompt(L({ gr: 'Όνομα νέας βαθμίδας (Ελληνικά):', en: 'New tier name (Greek):' }), ''); if (!gr) return;
          var en = prompt(L({ gr: 'Όνομα (Αγγλικά):', en: 'Name (English):' }), gr) || gr;
          if (window.SymTiers) { SymTiers.add(gr, en); paint(); }
        } }, [el('span', { html: '&#43; ' }), L({ gr: 'Νέα βαθμίδα', en: 'New tier' })]));
        pane.appendChild(tlist);
        pane.appendChild(el('div', { style: 'height:1px;background:color-mix(in srgb,var(--sym-fg,#1E1810) 9%,transparent);margin:16px 0' }));
        renderGrant();
      }
      else if (activeSec === 'kleos') {
        renderKleosGrant();
      }
      else if (activeSec === 'aisources') {
        renderAiSources();
      }
      else if (activeSec === 'pricing') {
        renderPricing();
      }
      else if (activeSec === 'arcade') {
        renderArcade();
      }
      else if (activeSec === 'discounts') {
        renderCoupons();
      }
      else if (activeSec === 'banners') {
        // Real banner admin — create + edit + activate/deactivate + LIVE PREVIEW +
        // seed (js/banner-admin.js). The sticky site bar (js/banner-bar.js)
        // self-inits and re-renders after any banner change.
        if (window.BannerAdmin && BannerAdmin.render) BannerAdmin.render(pane);
        else {
          pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Banners & ανακοινώσεις', en: 'Banners & announcements' })));
          pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Η μονάδα banners δεν φορτώθηκε.', en: 'Banner module not loaded.' })));
        }
      }
      else if (activeSec === 'settings') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Ρυθμίσεις πλατφόρμας', en: 'Platform settings' })));
        // Persisted switches (SymStore admin_flags + guarded mirror). Read live
        // anywhere via window.adminFlag('signups_open', true) etc.
        [['signups_open', { gr: 'Εγγραφές ανοιχτές', en: 'Signups open' }, 1],
         ['maintenance', { gr: 'Λειτουργία συντήρησης', en: 'Maintenance mode' }, 0],
         ['email_notify', { gr: 'Email ειδοποιήσεις', en: 'Email notifications' }, 1],
         ['season_auto', { gr: 'Auto-detect εποχής', en: 'Auto-detect season' }, 1]
        ].forEach(function (s) { pane.appendChild(toggleRow(s[1], s[2], s[0])); });
        pane.appendChild(el('p', { class: 'sc-hint', style: 'margin-top:10px' }, L({ gr: 'Οι διακόπτες αποθηκεύονται και διαβάζονται από τον κώδικα μέσω adminFlag(…).', en: 'Switches persist and are read by runtime code via adminFlag(…).' })));
      }
      else {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Νέα ενότητα', en: 'New section' })));
        pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Προσαρμοσμένη ενότητα — πρόσθεσε πεδία, πίνακες ή διακόπτες.', en: 'Custom section — add fields, tables or toggles.' })));
      }
      if (window.injectIllus) injectIllus(pane);
    }
    paint();
  }

  /* ── Register, winning over syn-admin.js (loaded after it) ────────── */
  function register() {
    if (!window.SYM_SCREENS) window.SYM_SCREENS = {};
    window.SYM_SCREENS.admin = adminScreen;
  }
  register();
  // app.js builds SYM_SCREENS lazily in places; re-assert on next tick too.
  setTimeout(register, 0);
})();
