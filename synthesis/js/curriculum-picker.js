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

  // ── PvP universal picker ──────────────────────────────────────────────
  // The Agon content chooser. Mirrors the game-panel universal picker
  // (screens.js → engineSetup) but, instead of injecting a bank into an engine,
  // writes SYM_QUESTIONS_SELECTION and opens the standalone Arena. Reuses the
  // same syn-* visual classes (already in css/screens.css → no new CSS). The
  // selection is held in a module-level Map so a re-render keeps the picks.
  var _pvpSel = new Map();   // dsId → { levels:Set, item }
  var _pvpSearch = '';
  var _pvpTag = null;
  var _pvpCat = [];

  function renderPvp(home) {
    var body = window.synPage(home, {
      back: 'live', backLabel: L({ gr: 'Live', en: 'Live' }), accent: '#C5572F',
      eyebrow: L({ gr: 'Ο Ἀγών · PvP', en: 'The Agon · PvP' }),
      title: L({ gr: 'Διάλεξε ύλη για τον Αγώνα', en: 'Pick content for the duel' }),
      sub: L({ gr: 'Διάλεξε ύλη (και επίπεδα) από όλη την πλατφόρμα — ή συνδύασε πολλές.', en: 'Pick content (and levels) from across the platform — or combine several.' }),
    });

    var SM = window.SymMix;
    if (!SM || typeof SM.catalog !== 'function') {
      body.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Η ύλη δεν είναι διαθέσιμη.', en: 'Content is unavailable.' })));
      return;
    }
    _pvpCat = SM.catalog() || [];

    var sel = _pvpSel;
    var wrap = el('div', { class: 'syn-mix sc-stagger has-accent', style: '--ca:#C5572F' });

    wrap.appendChild(el('div', { class: 'syn-mix__lbl', style: 'margin-top:0' }, L({ gr: 'Διάλεξε ύλη', en: 'Choose content' })));
    wrap.appendChild(el('p', { class: 'sc-cap', style: 'margin:0 0 6px;opacity:.8' },
      L({ gr: 'Αυτόματη λίστα: γραμματική + ύλη τάξεων + δημοσιευμένα πακέτα.', en: 'Auto-listed: grammar + class content + published packs.' })));

    var searchInput = el('input', { class: 'syn-mix__search', type: 'text',
      placeholder: L({ gr: 'Αναζήτηση ύλης…', en: 'Search content…' }),
      oninput: function (e) { _pvpSearch = ((e.target && e.target.value) || '').toLowerCase(); paintList(); } });
    if (_pvpSearch) searchInput.value = _pvpSearch;
    wrap.appendChild(searchInput);

    var tagRow = el('div', { class: 'syn-mix__tags' });
    wrap.appendChild(tagRow);
    function paintTags() {
      tagRow.innerHTML = '';
      function chip(key, label) {
        return el('button', { class: 'syn-tagchip' + (_pvpTag === key ? ' on' : ''),
          onclick: function () { _pvpTag = key; paintTags(); paintList(); } },
          [el('span', { class: 'syn-tagchip__t' }, label)]);
      }
      tagRow.appendChild(chip(null, L({ gr: 'Όλα', en: 'All' })));
      _pvpCat.forEach(function (g) { if ((g.items || []).length) tagRow.appendChild(chip(g.group, g.group)); });
    }

    var listWrap = el('div', { class: 'syn-mix__cats' });
    wrap.appendChild(listWrap);

    function levelPanel(it, st) {
      var panel = el('div', { class: 'syn-ds-levels' });
      var allIds = (it.levels || []).map(function (lv) { return lv.id; });
      var allOn = allIds.length > 0 && allIds.every(function (id) { return st.levels.has(id); });
      panel.appendChild(el('button', { class: 'syn-lvpill--all' + (allOn ? ' on' : ''),
        onclick: function () { if (allOn) st.levels.clear(); else allIds.forEach(function (id) { st.levels.add(id); }); paintList(); updateBar(); } },
        allOn ? ('✓ ' + L({ gr: 'Όλα επιλεγμένα — καθάρισε', en: 'All selected — clear' }))
              : L({ gr: 'Επιλογή όλων των επιπέδων', en: 'Select all levels' })));
      var order = [], byG = {};
      (it.levels || []).forEach(function (lv) { var g = lv.group || ''; if (!byG[g]) { byG[g] = []; order.push(g); } byG[g].push(lv); });
      var n = 0;
      order.forEach(function (g) {
        var rows = byG[g];
        var gOn = rows.length > 0 && rows.every(function (lv) { return st.levels.has(lv.id); });
        panel.appendChild(el('div', { class: 'syn-lvgrp-row' }, [
          el('span', { class: 'syn-lvgrp' }, g || L({ gr: 'Επίπεδα', en: 'Levels' })),
          el('button', { class: 'syn-lvgrp-all' + (gOn ? ' on' : ''), onclick: function () {
            var turnOn = !gOn;
            rows.forEach(function (lv) { if (turnOn) st.levels.add(lv.id); else st.levels.delete(lv.id); });
            paintList(); updateBar();
          } }, gOn ? L({ gr: 'Καμία', en: 'None' }) : L({ gr: 'Όλα', en: 'All' })),
        ]));
        rows.forEach(function (lv) {
          n++;
          var lon = st.levels.has(lv.id);
          panel.appendChild(el('button', { class: 'syn-lvrowpill' + (lon ? ' on' : '') + (lv.color ? ' syn-lvpill--' + lv.color : ''),
            onclick: function () {
              if (st.levels.has(lv.id)) st.levels.delete(lv.id); else st.levels.add(lv.id);
              paintList(); updateBar();
            } }, [
            el('span', { class: 'syn-lvpill__box' }, lon ? '✓' : ''),
            el('span', { class: 'syn-lvpill__n' }, String(n).padStart(2, '0')),
            el('span', { class: 'syn-lvpill__t' }, [
              lv.section ? el('span', { class: 'syn-lvpill__sec' }, lv.section + ' · ') : null,
              lv.desc || ('Επίπεδο ' + lv.id)]) ]));
        });
      });
      return panel;
    }

    function paintList() {
      listWrap.innerHTML = '';
      var shown = 0;
      _pvpCat.forEach(function (group) {
        if (_pvpTag && group.group !== _pvpTag) return;
        var items = (group.items || []).filter(function (i) {
          return !_pvpSearch
            || (i.label || '').toLowerCase().indexOf(_pvpSearch) >= 0
            || (i.meta || '').toLowerCase().indexOf(_pvpSearch) >= 0;
        });
        if (!items.length) return;
        listWrap.appendChild(el('div', { class: 'syn-ds-cat' }, group.group));
        var grid = el('div', { class: 'syn-ds-grid' });
        items.forEach(function (it) {
          shown++;
          var st = sel.get(it.id);
          var on = !!st;
          var card = el('div', { class: 'syn-ds' + (on ? ' on' : '') + (it.locked ? ' locked' : '') }, [
            el('span', { class: 'syn-ds__ic' }, it.icon || '◆'),
            el('span', { class: 'syn-ds__info' }, [
              el('span', { class: 'syn-ds__name' }, it.label + (it.isNew ? ' •' : '')),
              el('span', { class: 'syn-ds__meta' }, (function () {
                if (!(on && it.leveled)) return it.meta || '';
                var total = (it.levels || []).length;
                return st.levels.size >= total
                  ? L({ gr: 'όλα τα επίπεδα', en: 'all levels' })
                  : (st.levels.size + ' / ' + total + ' ' + L({ gr: 'επίπεδα', en: 'levels' }));
              })()),
            ]),
            it.locked
              ? el('span', { class: 'syn-ds__flag' }, '🔒 Pro')
              : el('button', { class: 'syn-ds__mix' + (on ? ' on' : ''), onclick: function () {
                  if (sel.has(it.id)) sel.delete(it.id);
                  else sel.set(it.id, { levels: new Set((it.levels || []).map(function (l) { return l.id; })), item: it });
                  paintList(); updateBar();
                } }, on ? ('✓ ' + L({ gr: 'Στη μείξη', en: 'In mix' })) : ('+ MIX')),
          ]);
          grid.appendChild(card);
          if (on && it.leveled && it.levels && it.levels.length) grid.appendChild(levelPanel(it, st));
        });
        listWrap.appendChild(grid);
      });
      if (!shown) listWrap.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Καμία ύλη δεν ταιριάζει.', en: 'No content matches.' })));
    }

    var bar = el('div', { class: 'syn-mix__bar' });
    var count = el('span', { class: 'syn-mix__count' });
    var startBtn = el('button', { class: 'syn-mix__start', onclick: function () {
      if (!sel.size || !window.SymMix || typeof window.SymMix.bankMulti !== 'function') return;
      var picks = Array.from(sel.entries()).map(function (e) { return { id: e[0], levelIds: Array.from(e[1].levels) }; });
      startBtn.disabled = true;
      var old = startBtn.textContent;
      startBtn.textContent = L({ gr: 'Φόρτωση…', en: 'Loading…' });
      window.SymMix.bankMulti(picks).then(function (arr) {
        var items = (arr || []).map(function (it) { return { q: (it.q && (it.q.gr || it.q.en)) || it.q, a: it.a, c: it.c }; });
        try {
          if (items.length) localStorage.setItem('SYM_QUESTIONS_SELECTION', JSON.stringify(items));
          else localStorage.removeItem('SYM_QUESTIONS_SELECTION');
        } catch (_e) {}
        if (typeof window.launchPvPArena === 'function') window.launchPvPArena();
        startBtn.disabled = false; startBtn.textContent = old;
      }).catch(function () { startBtn.disabled = false; startBtn.textContent = old; });
    } });
    bar.appendChild(count);
    bar.appendChild(el('span', { class: 'syn-mix__sp' }));
    bar.appendChild(startBtn);

    function updateBar() {
      var n = sel.size;
      count.textContent = n + ' ' + L({ gr: 'πηγές', en: 'sources' });
      startBtn.disabled = n === 0;
      startBtn.classList.toggle('is-off', n === 0);
      startBtn.textContent = n
        ? L({ gr: 'Έναρξη Αγώνα', en: 'Start the Agon' })
        : L({ gr: 'Διάλεξε ύλη', en: 'Choose content' });
    }

    wrap.appendChild(bar);
    body.appendChild(wrap);
    paintTags(); paintList(); updateBar();

    // Merge Firestore published packs, then refresh the catalog (call once on open).
    if (window.GP_CONTENT && typeof window.GP_CONTENT.loadCloud === 'function') {
      Promise.resolve(window.GP_CONTENT.loadCloud()).then(function () {
        if (window.SymMix && window.SymMix.catalog) { _pvpCat = window.SymMix.catalog() || []; paintTags(); paintList(); }
      }).catch(function () {});
    }
  }

  function render(home) {
    if (_pvp) { renderPvp(home); return; }
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
            // Launch the game. Grammar/level games open their OWN native level
            // grid (e.g. Λύω's «Μαθαίνοντας το Λύω» screen) — the polished level
            // selector — so we just launch; everything else starts directly.
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
    openForPvp: function () {
      _pvp = true;
      _pvpSel = new Map(); _pvpSearch = ''; _pvpTag = null; _pvpCat = [];
      window.symGo('curriculum');
    },
  };
})();
