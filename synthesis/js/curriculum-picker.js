/* ════════════════════════════════════════════════════════════════════
   curriculum-picker.js — admin-content curriculum drill-down (S.curriculum).

   Browses the Site Studio catalog (ContentSource.loadCatalog() — the
   admin-authored Τάξεις → Μαθήματα → Παιχνίδια tree) as a drill-down:
     στάδιο (Γυμνάσιο / Λύκειο / Γραμματική) → τάξη → μάθημα → παιχνίδι → launch.
   Reuses the game-panel/level-select visual language (sc-* / syn-* classes).
   Additive: reached from a "Διάλεξε από την ύλη" entry on the Game Panel; the
   existing engine grid is untouched.

   "Admin-authored only": the catalog IS the admin-editable structure
   (studio_catalog); we surface its games and prefer ones with deliverable
   content. Launch reuses synResolveLaunch + synLaunch, same as the subject pages.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  function el() { return window.el.apply(null, arguments); }
  function L(o) { return (typeof window.L === 'function') ? window.L(o) : (o && (o.gr || o.en) || ''); }
  function go(s, p) { return window.symGo(s, p); }
  function gl(name) { return el('span', { class: 'sc-gl', 'data-illu': name || 'amphora' }); }

  // cycle labels → which grade-keys belong (mirrors SYM.CLASS_GROUPS + GRAMMAR)
  var CYCLES = [
    { id: 'gym', gr: 'Γυμνάσιο', en: 'Gymnasio', match: function (g) { return /^gym-/.test(g.key); } },
    { id: 'lyk', gr: 'Λύκειο', en: 'Lykeio', match: function (g) { return /^lyk-/.test(g.key); } },
    { id: 'gram', gr: 'Γραμματική · Θεωρία', en: 'Grammar · Theory', match: function (g) { return /^gram-/.test(g.key); } },
  ];

  var _catalog = null;          // cached { grades:[...] }
  var st = { cycle: 'gym', gradeKey: null, subId: null };
  var _authored = {};           // subId → { contentId: bool } (resolved once per subject)
  var _pvp = false;             // true when the picker is choosing PvP material

  // PvP: build the duel question bank from a catalog game's authored content,
  // store it as SYM_QUESTIONS_SELECTION, then open the standalone Arena.
  function _pvpLaunchFromNode(node) {
    function fire(sel) {
      try { if (sel && sel.length) localStorage.setItem('SYM_QUESTIONS_SELECTION', JSON.stringify(sel)); else localStorage.removeItem('SYM_QUESTIONS_SELECTION'); } catch (_e) {}
      if (typeof window.launchPvPArena === 'function') window.launchPvPArena();
    }
    if (!node.content || !window.ContentSource || typeof window.ContentSource.loadGameContent !== 'function') { fire(null); return; }
    Promise.resolve(window.ContentSource.loadGameContent(node.content)).then(function (doc) {
      var items = [];
      (((doc && doc.units) || [])).forEach(function (u) {
        (u.questions || u.items || []).forEach(function (q) {
          var opts = q.opts || q.o || q.a || [];
          items.push({ q: q.q, a: opts.slice ? opts.slice() : opts, c: (typeof q.ans === 'number' ? q.ans : (typeof q.c === 'number' ? q.c : 0)) });
        });
      });
      items = items.filter(function (it) { return it.q && it.a && it.a.length >= 2; });
      fire(items);
    }).catch(function () { fire(null); });
  }

  // Resolve which quiz content ids in a subject have admin-authored content,
  // then re-render (symRender = no extra history entry, unlike symGo).
  function _resolveAuthored(subId, ids) {
    var CS = window.ContentSource;
    if (!CS || typeof CS.hasAuthored !== 'function') { _authored[subId] = {}; if (window.symRender) window.symRender(); return; }
    Promise.all(ids.map(function (cid) {
      return Promise.resolve(CS.hasAuthored(cid)).then(function (ok) { return [cid, ok]; }).catch(function () { return [cid, false]; });
    })).then(function (pairs) {
      var m = {}; pairs.forEach(function (p) { m[p[0]] = p[1]; }); _authored[subId] = m;
      if (window.symRender) window.symRender();
    }).catch(function () { _authored[subId] = {}; if (window.symRender) window.symRender(); });
  }

  function launchOf(node) {
    var fn = (node._launch && node._launch.fn) ||
      (window.synResolveLaunch && window.synResolveLaunch({ en: node.labelEn, gr: node.label, launch: node._launch }));
    return fn || null;
  }

  function gradesIn(cycle) {
    var cy = CYCLES.find(function (c) { return c.id === cycle; }) || CYCLES[0];
    return ((_catalog && _catalog.grades) || []).filter(cy.match);
  }

  function render(home) {
    var P = window.synPage;
    var body = P(home, _pvp ? {
      back: 'live', backLabel: L({ gr: 'Live', en: 'Live' }), accent: '#C5572F',
      eyebrow: L({ gr: 'Ο Ἀγών · PvP', en: 'The Agon · PvP' }),
      title: L({ gr: 'Διάλεξε ύλη για τον Αγώνα', en: 'Pick content for the duel' }),
      sub: L({ gr: 'Στάδιο → τάξη → μάθημα → παιχνίδι — διάλεξε ύλη και άνοιξε την Αρένα.', en: 'Stage → grade → subject → game — pick content and open the Arena.' }),
    } : {
      back: 'gamepanel', backLabel: L({ gr: 'Πίνακας Παιχνιδιών', en: 'Game Panel' }), accent: '#C5572F',
      eyebrow: L({ gr: 'Η ύλη σου', en: 'Your curriculum' }),
      title: L({ gr: 'Διάλεξε από την ύλη', en: 'Browse by curriculum' }),
      sub: L({ gr: 'Στάδιο → τάξη → μάθημα → παιχνίδι — μόνο περιεχόμενο από το πάνελ διαχείρισης.', en: 'Stage → grade → subject → game — admin-authored content only.' }),
    });

    if (!_catalog) {
      body.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Φόρτωση ύλης…', en: 'Loading curriculum…' })));
      _load(home);
      return;
    }

    // ── στάδιο (cycle) pills ──
    body.appendChild(el('div', { class: 'sc-sec-lbl', style: 'margin-top:0' }, L({ gr: 'Στάδιο', en: 'Stage' })));
    var cycleRow = el('div', { class: 'sc-fils' });
    CYCLES.forEach(function (c) {
      if (!gradesIn(c.id).length) return;
      cycleRow.appendChild(el('button', { class: 'sc-fil' + (st.cycle === c.id ? ' active' : ''),
        onclick: function () { st.cycle = c.id; st.gradeKey = null; st.subId = null; go('curriculum'); } }, L(c)));
    });
    body.appendChild(cycleRow);

    // ── τάξη (grade) ──
    var grades = gradesIn(st.cycle);
    if (!st.gradeKey && grades.length) st.gradeKey = grades[0].key;
    body.appendChild(el('div', { class: 'sc-sec-lbl' }, L({ gr: 'Τάξη', en: 'Grade' })));
    var gradeRow = el('div', { class: 'sc-fils' });
    grades.forEach(function (g) {
      gradeRow.appendChild(el('button', { class: 'sc-fil' + (st.gradeKey === g.key ? ' active' : ''),
        onclick: function () { st.gradeKey = g.key; st.subId = null; go('curriculum'); } }, g.label));
    });
    body.appendChild(gradeRow);

    var grade = grades.find(function (g) { return g.key === st.gradeKey; }) || grades[0];
    if (!grade) { body.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Καμία ύλη εδώ ακόμη.', en: 'No content here yet.' }))); return; }

    // ── μάθημα (subject) ──
    var subjects = grade.subjects || [];
    if (!st.subId && subjects.length) st.subId = subjects[0].id;
    body.appendChild(el('div', { class: 'sc-sec-lbl' }, L({ gr: 'Μάθημα', en: 'Subject' })));
    var subRow = el('div', { class: 'sc-fils' });
    subjects.forEach(function (s) {
      subRow.appendChild(el('button', { class: 'sc-fil' + (st.subId === s.id ? ' active' : ''),
        onclick: function () { st.subId = s.id; go('curriculum'); } }, s.label));
    });
    body.appendChild(subRow);

    var sub = subjects.find(function (s) { return s.id === st.subId; }) || subjects[0];
    if (!sub) { body.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Διάλεξε μάθημα.', en: 'Pick a subject.' }))); return; }

    // ── παιχνίδι (game) cards → launch ──
    body.appendChild(el('div', { class: 'sc-sec-lbl' }, L({ gr: 'Παιχνίδι', en: 'Game' })));
    var launchable = (sub.games || []).map(function (n) { return { n: n, fn: launchOf(n) }; }).filter(function (x) { return x.fn; });
    // Admin-authored only: a quiz game (with a content id) shows ONLY if content
    // was uploaded/authored; built-in games (grammar, arcade, voyage — no content
    // id) always show. The authored map is resolved once per subject (async).
    var quizIds = launchable.filter(function (x) { return x.n.content; }).map(function (x) { return x.n.content; });
    if (quizIds.length && !_authored[sub.id]) {
      _resolveAuthored(sub.id, quizIds);
      body.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Έλεγχος περιεχομένου…', en: 'Checking content…' })));
      return;
    }
    var amap = _authored[sub.id] || {};
    var games = launchable.filter(function (x) { return !x.n.content || amap[x.n.content] === true; });
    if (!games.length) {
      body.appendChild(el('div', { class: 'sc-form', style: 'text-align:center;padding:22px' }, [
        el('p', { class: 'sc-hint', style: 'margin:0 0 12px' }, L({ gr: 'Δεν έχει ανέβει περιεχόμενο γι’ αυτό το μάθημα ακόμη.', en: 'No content uploaded for this subject yet.' })),
        el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: function () {
          if (typeof window.openTriviaTemplate === 'function') window.openTriviaTemplate();
          else if (window.SymPreview) window.SymPreview.open('mc', { title: L({ gr: 'Ανέβασε περιεχόμενο', en: 'Upload content' }), note: L({ gr: 'Διαθέσιμο με συνδρομή καθηγητή — ανέβασε CSV/JSON ερωτήσεων.', en: 'Available with a teacher subscription — upload CSV/JSON questions.' }) });
        } }, L({ gr: 'Ανέβασε περιεχόμενο →', en: 'Upload content →' })),
        el('p', { class: 'sc-cap', style: 'margin:10px 0 0;opacity:.7' }, L({ gr: 'Οι καθηγητές με συνδρομή ανεβάζουν δικά τους αρχεία.', en: 'Teachers with a subscription upload their own files.' })),
      ]));
      return;
    }
    var grid = el('div', { class: 'sc-eng-grid' });
    games.forEach(function (x) {
      var node = x.n;
      grid.appendChild(el('button', { class: 'sc-engc has-accent', style: '--ca:#C5572F',
        onclick: function () {
          try {
            if (_pvp) { _pvpLaunchFromNode(node); return; }
            var args = (node._launch && node._launch.args) || [];
            if (window.synLaunch && window.SYN_GAMES && window.SYN_GAMES[x.fn]) return window.synLaunch.apply(null, [x.fn].concat(args));
            if (typeof window[x.fn] === 'function') return window[x.fn].apply(window, args);
            if (window.SymPreview) window.SymPreview.open('mc', { title: node.label });
          } catch (_e) {}
        } }, [
        el('span', { class: 'sc-engc__ban' }, [el('span', { class: 'sc-gl sc-engc__illu', 'data-illu': node._illu || 'amphora' })]),
        el('span', { class: 'sc-engc__b' }, [
          el('span', { class: 'sc-engc__t' }, node.label),
          el('span', { class: 'sc-engc__m' }, node.labelEn || ''),
        ]),
      ]));
    });
    body.appendChild(grid);
    if (window.injectIllus) try { window.injectIllus(body); } catch (_e) {}
  }

  function _load(home) {
    var CS = window.ContentSource;
    if (!CS || typeof CS.loadCatalog !== 'function') { _catalog = { grades: [] }; go('curriculum'); return; }
    Promise.resolve(CS.loadCatalog()).then(function (cat) {
      _catalog = (cat && Array.isArray(cat.grades)) ? cat : { grades: [] };
      go('curriculum');
    }).catch(function () { _catalog = { grades: [] }; go('curriculum'); });
  }

  // Bust the authored-content cache when an admin/teacher saves game content, so
  // a newly-uploaded game appears without a hard reload.
  try {
    window.addEventListener('sym-store', function (e) {
      var k = e && e.detail && e.detail.key;
      if (k && (k.indexOf('gameContent/') === 0 || k === 'studio_catalog')) { _authored = {}; if (k === 'studio_catalog') _catalog = null; }
    });
  } catch (_e) {}

  window.SYM_SCREENS = window.SYM_SCREENS || {};
  window.SYM_SCREENS.curriculum = function (home, ctx) { render(home, ctx); };

  // Entry points: the Game Panel opens it to browse+launch; the Live PvP button
  // opens it to pick duel content (same picker, different leaf action).
  window.SymCurriculum = {
    openPanel: function () { _pvp = false; window.symGo('curriculum'); },
    openForPvp: function () { _pvp = true; window.symGo('curriculum'); },
  };
})();
