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

  /* ── tier vocabulary ──────────────────────────────────────────────── */
  var TIERS = [
    ['free',   { gr: 'Δωρεάν',  en: 'Free' }],
    ['pro',    { gr: 'Pro',     en: 'Pro' }],
    ['school', { gr: 'School',  en: 'School' }],
  ];

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
    var stat = function (v, label, ac) {
      return el('div', { class: 'sc-stat has-accent', style: '--ca:' + (ac || accent) },
        [el('div', { class: 'sc-stat__v' }, v), el('div', { class: 'sc-stat__l' }, label)]);
    };

    var body = P(home, {
      back: 'home', accent: accent,
      eyebrow: L({ gr: 'Κέντρο Διοίκησης', en: 'Command Center' }),
      title: L({ gr: 'Διαχείριση', en: 'Admin' }),
      sub: L({ gr: 'Revamp-native — πραγματικές λειτουργίες.', en: 'Revamp-native — real functions.' }),
    });

    // Top stat band + Classic Command Center link.
    body.appendChild(el('div', { class: 'sc-stats sc-stats--4 sc-stagger' }, [
      stat('3.218', L({ gr: 'Χρήστες', en: 'Users' }), accent),
      stat('1.094', L({ gr: 'Συνδρομές', en: 'Subscribers' }), accent),
      stat('€5.4k', 'MRR', accent),
      stat('41', L({ gr: 'Παιχνίδια', en: 'Games' }), accent),
    ]));
    body.appendChild(el('div', { class: 'sc-adminx__bar sc-stagger' }, [
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
      ['realm', '⛩', { gr: 'Curator · Ναός', en: 'Curator · Realm' }],
      ['games', '▦', { gr: 'Παιχνίδια (QA)', en: 'Games (QA)' }],
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
        TIERS.forEach(function (t) {
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
        renderAccessControl();
      }
      else if (activeSec === 'studio') {
        // Real Site Studio (admin-studio.js) mounted in-pane.
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Studio — Τάξεις → Μαθήματα → Παιχνίδια → Ερωτήσεις', en: 'Studio — Grades → Subjects → Games → Questions' })));
        if (window.AdminStudio && typeof window.AdminStudio.view === 'function') {
          var host = el('div', { class: 'cc-work sc-studio-host' });
          var panel = el('div', { class: 'cc-panel', id: 'cc-panel' });
          host.appendChild(panel);
          pane.appendChild(host);
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
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Έλεγχος περιεχομένου — πάτα για προεπισκόπηση & εντοπισμό λαθών', en: 'Content QA — click to preview & spot mistakes' })));
        var g = el('div', { class: 'sc-admin__games' });
        (SYM().ENGINES || []).forEach(function (e) {
          g.appendChild(el('button', {
            class: 'sc-admin__game', onclick: function () { if (window.SymPreview) SymPreview.open(SymPreview.typeFor(e), { title: L(e), illu: e.illu, note: L({ gr: 'Έλεγξε ερωτήσεις & απαντήσεις για λάθη.', en: 'Check questions & answers for mistakes.' }) }); }
          }, [glyph(e.illu, 'sc-admin__gicon'), el('span', {}, L(e)), el('span', { class: 'sc-admin__qa' }, 'QA')]));
        });
        pane.appendChild(g);
      }
      else if (activeSec === 'subs') {
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Συνδρομές & Πακέτα', en: 'Subscriptions & Bundles' })));
        pane.appendChild(el('div', { class: 'sc-stats' }, [stat('1.094', L({ gr: 'Ενεργές', en: 'Active' }), accent), stat('€5.4k', 'MRR', accent), stat('3.1%', L({ gr: 'Churn', en: 'Churn' }), accent)]));
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
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Πρότυπα Μηνυμάτων', en: 'Message Templates' })));
        pane.appendChild(msgEditor('msg_signup', { gr: 'Μήνυμα εγγραφής (welcome)', en: 'Sign-up welcome message' }, 'Καλώς ήρθες στο SymposiON, {name}! Ο αρχαίος κόσμος σε περιμένει — ξεκίνα το πρώτο σου παιχνίδι και κέρδισε Kleos.'));
        pane.appendChild(msgEditor('msg_sub', { gr: 'Μήνυμα συνδρομής (μετά την πληρωμή)', en: 'Subscription confirmation message' }, 'Ευχαριστούμε για τη συνδρομή σου, {name}! Η πρόσβαση Pro είναι ενεργή. Καλή μάθηση & καλό παιχνίδι!'));
        pane.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Διαθέσιμες μεταβλητές: {name}, {plan}, {expiry}', en: 'Available variables: {name}, {plan}, {expiry}' })));
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
        pane.appendChild(el('div', { class: 'sc-stats', style: 'margin-bottom:12px' }, [stat(String(stored.length + 218), L({ gr: 'Σχόλια', en: 'Reviews' }), accent), stat(String(stored.filter(function (f) { return f.kind === 'bug'; }).length), L({ gr: 'Bugs', en: 'Bugs' }), accent), stat(String(stored.filter(function (f) { return f.new; }).length + 12), L({ gr: 'Νέα', en: 'New' }), accent)]));
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
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Χορήγησε δωρεάν πρόσβαση', en: 'Grant free access' })));
        pane.appendChild(el('div', { class: 'sc-form' }, [
          field2(L({ gr: 'Email χρήστη', en: 'User email' }), 'student@example.com'),
          rowSel(L({ gr: 'Ρόλος', en: 'Role' }), ['Μαθητής', 'Καθηγητής', 'Admin']),
          rowSel(L({ gr: 'Τάξη', en: 'Class' }), ['Όλες', 'Β΄ Γυμνασίου', 'Γ΄ Λυκείου', 'Λατινικά']),
          rowSel(L({ gr: 'Διάρκεια', en: 'Duration' }), ['1 μήνας', '3 μήνες', '12 μήνες', 'Μόνιμα']),
          el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', style: 'margin-top:6px', onclick: function (e) { e.currentTarget.textContent = '✓ ' + L({ gr: 'Χορηγήθηκε', en: 'Granted' }); } }, L({ gr: 'Χορήγηση πρόσβασης', en: 'Grant access' })),
        ]));
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
        pane.appendChild(el('div', { class: 'sc-panel__h' }, L({ gr: 'Banners & ανακοινώσεις', en: 'Banners & announcements' })));
        [['Καλοκαιρινό event', 1], ['Νέο παιχνίδι: Φάλαγγα', 1], ['Black Friday Pro', 0]].forEach(function (b) { pane.appendChild(toggleRow({ gr: b[0], en: b[0] }, b[1])); });
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
