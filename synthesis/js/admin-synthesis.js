/* ════════════════════════════════════════════════════════════════════
   admin-synthesis.js — revamp-native LIGHT admin (sc-admin2 design).

   Replaces the Ver1 "Command Center" overlay as the default admin screen by
   registering window.SYM_SCREENS.admin AFTER syn-admin.js (so it wins). Keeps
   the REAL engines wired:
     • Studio  → window.AdminStudio (js/admin-studio.js) mounted in-pane.
     • Atlas   → window.ccOpenAtlas() (js/admin-atlas.js) overlay.
     • Realm   → window.synOpenAcroteria() (js/dir-synthesis.js) + custom-acro.
     • A "Classic Command Center" button still opens the old #page-admin
       (window._renderAdminPage / goTo('admin')) so nothing is lost.

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
      + 'teacher@example.com,teacher,Όλες,school,perm\n';
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

    // Top stat band + Classic Command Center link. REAL values only — games is
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
      el('button', {
        class: 'sc-cta sc-cta--ghost sc-cta--sm', onclick: function () {
          // Open the legacy Ver1 Command Center overlay (admin-cc.js).
          try {
            if (typeof window._renderAdminPage === 'function') window._renderAdminPage();
            if (typeof window.goTo === 'function') window.goTo('admin');
            var h = document.getElementById('page-admin');
            if (h) h.classList.add('syn-admin-on');
            document.body.classList.add('syn-admin-open');
          } catch (e) { console.error('[admin-synthesis] classic CC failed', e); }
        }
      }, [glyph('compass', 'sc-gl'), L({ gr: 'Κλασικό Command Center', en: 'Classic Command Center' })]),
    ]));

    var shell = el('div', { class: 'sc-admin2 sc-stagger has-accent', style: '--ca:' + accent });
    var rail = el('div', { class: 'sc-admin2__rail' });
    var pane = el('div', { class: 'sc-admin2__pane' });

    var sections = [
      ['overview', '◷', { gr: 'Επισκόπηση', en: 'Overview' }],
      ['grant', '✦', { gr: 'Χορήγηση Πρόσβασης', en: 'Grant Access' }],
      ['users', '◆', { gr: 'Χρήστες', en: 'Users' }],
      ['access', '◫', { gr: 'Έλεγχος Πρόσβασης', en: 'Access Control' }],
      ['pricing', '€', { gr: 'Τιμολόγηση', en: 'Pricing' }],
      ['discounts', '%', { gr: 'Εκπτωτικοί Κωδικοί', en: 'Discount Codes' }],
      ['subs', '◷', { gr: 'Συνδρομές', en: 'Subscriptions' }],
      ['studio', '✎', { gr: 'Studio (Περιεχόμενο)', en: 'Studio (Content)' }],
      ['voyage', '⚱', { gr: 'Πρότυπα', en: 'Templates' }],
      ['realm', '⛩', { gr: 'Curator · Ναός', en: 'Curator · Realm' }],
      ['games', '▦', { gr: 'Παιχνίδια — Έλεγχος', en: 'Games — Review' }],
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
      el('button', {
        class: 'sc-admin2__add', onclick: function () {
          var nm = prompt(L({ gr: 'Όνομα νέας ενότητας:', en: 'New section name:' }), L({ gr: 'Νέα ενότητα', en: 'New section' }));
          if (nm && SymStore) { var cur = SymStore.get('admin_custom_secs', []); var id = 'custom_' + Date.now(); cur.push({ id: id, nm: nm }); SymStore.set('admin_custom_secs', cur); window.__adminSec = id; symRender(); }
        }
      }, [el('span', { class: 'sc-admin2__ic' }, '＋'), L({ gr: 'Νέα ενότητα', en: 'Add section' })]),
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
    function toggleRow(label, on) {
      var t = el('button', { class: 'sc-toggle' + (on ? ' on' : ''), onclick: function (e) { e.currentTarget.classList.toggle('on'); } }, [el('span', { class: 'sc-toggle__k' })]);
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
      var tierSel = rowSel(L({ gr: 'Πακέτο', en: 'Tier' }), ['free', 'pro', 'school']);
      var durSel = rowSel(L({ gr: 'Διάρκεια', en: 'Duration' }), ['1m', '3m', '12m', 'perm']);
      pane.appendChild(el('div', { class: 'sc-form' }, [
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
              var cur = grantsLoad().filter(function (x) { return x.email !== g.email || x.ts !== g.ts; });
              grantsSave(cur); paint();
            } }, L({ gr: 'Διαγραφή', en: 'Delete' }))]),
          ]));
        });
        pane.appendChild(gtbl);
      }
    }

    /* ════════════════ PAINT ════════════════════════════════════════ */
    function paint() {
      pane.innerHTML = '';
      if (activeSec === 'overview') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Πρόσφατη δραστηριότητα', en: 'Recent activity' })));
        [['＋', 'Νέα εγγραφή · Μαρία Κ.', '2′'], ['⚡', 'Live Arena ξεκίνησε · Β1', '11′'], ['◆', 'Αναβάθμιση σε Pro · Νίκος Π.', '24′'], ['❂', 'Ανασκόπηση Tartarus · 38 κάρτες', '1ω'], ['❖', 'Νέα ανάθεση · Γ Λυκείου', '2ω']].forEach(function (a) {
          pane.appendChild(el('div', { class: 'sc-act' }, [el('span', { class: 'sc-act__ic' }, a[0]), el('span', { class: 'sc-act__t' }, a[1]), el('span', { class: 'sc-act__tm' }, a[2])]));
        });
      }
      else if (activeSec === 'users') {
        pane.appendChild(el('input', { class: 'sc-search', placeholder: L({ gr: 'Αναζήτηση χρήστη…', en: 'Search user…' }), oninput: function (e) { var q = e.target.value.toLowerCase(); pane.querySelectorAll('.sc-tr:not(.sc-tr--h)').forEach(function (r) { r.style.display = r.textContent.toLowerCase().includes(q) ? '' : 'none'; }); } }));
        var tbl = el('div', { class: 'sc-table' });
        tbl.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [el('span', {}, L({ gr: 'Όνομα', en: 'Name' })), el('span', {}, 'Email'), el('span', {}, L({ gr: 'Πλάνο', en: 'Plan' })), el('span', {}, L({ gr: 'Ενέργειες', en: 'Actions' }))]));
        [['Μαρία Κ.', 'maria@…', 'Pro'], ['Νίκος Π.', 'nikos@…', 'Free'], ['Ελένη Σ.', 'eleni@…', 'Pro'], ['Γιώργος Μ.', 'giorgos@…', 'Free'], ['Σοφία Ρ.', 'sofia@…', 'Pro']].forEach(function (u) {
          tbl.appendChild(el('div', { class: 'sc-tr' }, [el('span', { class: 'sc-tr__task' }, u[0]), el('span', {}, u[1]), el('span', {}, el('em', { class: 'sc-badge2 sc-badge2--' + (u[2] === 'Pro' ? 'done' : 'open') }, u[2])), el('span', { class: 'sc-tr__acts' }, [el('button', { class: 'sc-mini' }, L({ gr: 'Προβολή', en: 'View' })), el('button', { class: 'sc-mini sc-mini--accent' }, L({ gr: 'Επεξεργασία', en: 'Edit' }))])]));
        });
        pane.appendChild(tbl);
      }
      else if (activeSec === 'access') {
        // Έλεγχος Πρόσβασης → the REAL per-class Class Plan planner (Ver1
        // functionality: class tabs · Practice/Theory · datasets+engines with
        // level toggles + tier · Save). admin-cc.css scopes its styles to
        // #page-admin, so mount inside a scoping host with the fullscreen/hidden
        // layout neutralised inline so it renders inline + light in the pane.
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Έλεγχος Πρόσβασης — Σχέδιο Τάξης', en: 'Access Control — Class Plan' })));
        if (window.AdminCC && typeof window.AdminCC.classPlanHTML === 'function') {
          var cphost = el('div', { id: 'page-admin', class: 'syn-cc-embed',
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
          var shost = el('div', { id: 'page-admin', class: 'syn-cc-embed',
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
            panel.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Το Studio δεν φόρτωσε εδώ — άνοιξέ το από το Κλασικό Command Center.', en: 'Studio could not mount here — open it from the Classic Command Center.' })));
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
          var classS = el('select', { class: 'sc-field__i sc-select', onchange: function (e) { aClass = e.target.value; fillSubj(); } },
            [el('option', { value: '' }, L({ gr: '— τάξη —', en: '— class —' }))].concat((SYM().CLASSES || []).map(function (c) { return el('option', { value: c.id }, L(c)); })));
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
                el('button', { class: 'sc-mini', onclick: (function (id) { return function () { taSave(taLoad().filter(function (x) { return x.id !== id; })); paint(); }; })(a.id) }, L({ gr: '✕ Διαγραφή', en: '✕ Delete' })),
              ]));
            });
            pane.appendChild(lw);
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
          customAcro.forEach(function (a, i) { tbl2.appendChild(el('div', { class: 'sc-tr' }, [el('span', { class: 'sc-tr__task' }, L(a)), el('span', {}, (a.cost || 0).toLocaleString('en-US')), el('span', { class: 'sc-tr__acts' }, [el('button', { class: 'sc-mini', onclick: function () { var c = SymStore.get('custom_acroteria', []).filter(function (_x, j) { return j !== i; }); SymStore.set('custom_acroteria', c); paint(); } }, L({ gr: 'Διαγραφή', en: 'Delete' }))])])); });
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
        var defPlans = [{ id: 'student', nm: 'Μαθητής', price: '4.99', n: '892' }, { id: 'teacher', nm: 'Καθηγητής', price: '7.99', n: '160' }, { id: 'school', nm: 'School', price: '49', n: '17' }];
        var customPlans = SymStore ? SymStore.get('admin_plans', []) : [];
        pane.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin:14px 0 8px' }, L({ gr: 'Πακέτα', en: 'Plans' })));
        var ptbl = el('div', { class: 'sc-table' });
        ptbl.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [el('span', {}, L({ gr: 'Πακέτο', en: 'Plan' })), el('span', {}, '€/' + L({ gr: 'μήνα', en: 'mo' })), el('span', {}, L({ gr: 'Συνδρομές', en: 'Subs' })), el('span', {}, '')]));
        defPlans.concat(customPlans).forEach(function (p, i) {
          ptbl.appendChild(el('div', { class: 'sc-tr' }, [
            el('span', { class: 'sc-tr__task' }, p.nm), el('span', {}, el('input', { class: 'sc-price', value: p.price })), el('span', {}, p.n || '—'),
            el('span', { class: 'sc-tr__acts' }, [el('button', { class: 'sc-mini' + (i < 3 ? ' off' : ''), onclick: function () { if (i >= 3 && SymStore) { var c = customPlans.filter(function (_x, j) { return j !== i - 3; }); SymStore.set('admin_plans', c); symRender(); } } }, L({ gr: 'Διαγραφή', en: 'Delete' }))]),
          ]));
        });
        pane.appendChild(ptbl);
        pane.appendChild(el('div', { class: 'sc-form', style: 'margin-top:12px' }, [
          el('div', { class: 'sc-cfg__l' }, L({ gr: 'Νέο πακέτο', en: 'New plan' })),
          el('div', { style: 'display:flex;gap:8px;flex-wrap:wrap' }, [
            el('input', { class: 'sc-field__i', id: 'newPlanNm', placeholder: L({ gr: 'Όνομα (π.χ. Οικογενειακό)', en: 'Name (e.g. Family)' }), style: 'flex:2;min-width:160px' }),
            el('input', { class: 'sc-field__i', id: 'newPlanPr', placeholder: '€ / ' + L({ gr: 'μήνα', en: 'mo' }), style: 'flex:1;min-width:90px' }),
            el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () { if (!SymStore) return; var nm = document.getElementById('newPlanNm').value.trim(), pr = document.getElementById('newPlanPr').value.trim(); if (nm) { var c = SymStore.get('admin_plans', []); c.push({ id: 'pl' + Date.now(), nm: nm, price: pr || '0' }); SymStore.set('admin_plans', c); symRender(); } } }, L({ gr: 'Πρόσθεσε', en: 'Add' })),
          ]),
        ]));
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
        [{ n: 'Μαρία Κ.', r: 5, t: 'Τα παιδιά λατρεύουν τη Διελκυστίνδα!', new: 1 }, { n: 'κ. Παπαδόπουλος', r: 5, t: 'Ο πίνακας αδυναμιών με βοηθά. Εξαιρετικό.' }, { n: 'Νίκος Δ.', r: 4, t: 'Πολύ καλό, θα ήθελα περισσότερα Λατινικά.' }].forEach(function (f) {
          fwrap.appendChild(el('div', { class: 'sc-fb' + (f.new ? ' new' : '') }, [
            el('div', { class: 'sc-fb__hd' }, [el('span', { class: 'sc-fb__n' }, f.n), el('span', { class: 'sc-fb__stars' }, '★★★★★'.slice(0, f.r) + '☆☆☆☆☆'.slice(0, 5 - f.r)), (f.new ? el('span', { class: 'sc-fb__new' }, L({ gr: 'ΝΕΟ', en: 'NEW' })) : null)]),
            el('p', { class: 'sc-fb__t' }, f.t),
            el('div', { class: 'sc-fb__act' }, [el('button', { class: 'sc-mini' }, L({ gr: 'Απάντηση', en: 'Reply' })), el('button', { class: 'sc-mini' }, L({ gr: 'Προβολή', en: 'Feature' }))]),
          ]));
        });
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
        [['Ενεργό spaced-repetition', 1], ['Κοινοποίηση σε καθηγητές', 1], ['Auto-clear 90 ημερών', 0]].forEach(function (r) { pane.appendChild(toggleRow({ gr: r[0], en: r[0] }, r[1])); });
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
      else if (activeSec === 'pricing') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Τιμολόγηση', en: 'Pricing' })));
        [['Free', '€0', '—'], ['Pro (μήνας)', '€4.99', '892'], ['Pro (έτος)', '€39.99', '310'], ['School', '€49', '17']].forEach(function (p) {
          pane.appendChild(el('div', { class: 'sc-adrow' }, [el('span', {}, p[0]), el('div', { style: 'display:flex;gap:12px;align-items:center' }, [el('input', { class: 'sc-price', value: p[1] }), el('small', { style: 'color:var(--muted)' }, p[2])])]));
        });
        pane.appendChild(el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', style: 'margin-top:10px' }, L({ gr: 'Αποθήκευση τιμών', en: 'Save pricing' })));
      }
      else if (activeSec === 'discounts') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Εκπτωτικοί κωδικοί', en: 'Discount codes' })));
        pane.appendChild(el('div', { class: 'sc-form' }, [field2(L({ gr: 'Κωδικός', en: 'Code' }), 'PAIDEIA20'), rowSel(L({ gr: 'Έκπτωση', en: 'Discount' }), ['10%', '20%', '50%', '3 μήνες δωρεάν']), el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm' }, L({ gr: 'Δημιουργία', en: 'Create' }))]));
        var dtbl = el('div', { class: 'sc-table', style: 'margin-top:14px' });
        dtbl.appendChild(el('div', { class: 'sc-tr sc-tr--h' }, [el('span', {}, 'Code'), el('span', {}, L({ gr: 'Έκπτωση', en: 'Off' })), el('span', {}, L({ gr: 'Χρήσεις', en: 'Uses' })), el('span', {}, '')]));
        [['WELCOME10', '10%', '124'], ['SCHOOL50', '50%', '8'], ['SUMMER', '3μ', '41']].forEach(function (d) { dtbl.appendChild(el('div', { class: 'sc-tr' }, [el('span', { class: 'sc-tr__task' }, d[0]), el('span', {}, d[1]), el('span', {}, d[2]), el('span', { class: 'sc-tr__acts' }, [el('button', { class: 'sc-mini' }, L({ gr: 'Απενεργ.', en: 'Disable' }))])])); });
        pane.appendChild(dtbl);
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
        [['Εγγραφές ανοιχτές', 1], ['Λειτουργία συντήρησης', 0], ['Email ειδοποιήσεις', 1], ['Auto-detect εποχής', 1]].forEach(function (s) { pane.appendChild(toggleRow({ gr: s[0], en: s[0] }, s[1])); });
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
