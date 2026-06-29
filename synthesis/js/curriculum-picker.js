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
    var body = P(home, {
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
    var games = (sub.games || []).map(function (n) { return { n: n, fn: launchOf(n) }; }).filter(function (x) { return x.fn; });
    if (!games.length) {
      body.appendChild(el('p', { class: 'sc-hint' }, L({ gr: 'Δεν υπάρχει ακόμη περιεχόμενο γι’ αυτό το μάθημα — πρόσθεσέ το από το πάνελ διαχείρισης.', en: 'No content authored for this subject yet — add it from the admin panel.' })));
      return;
    }
    var grid = el('div', { class: 'sc-eng-grid' });
    games.forEach(function (x) {
      var node = x.n;
      grid.appendChild(el('button', { class: 'sc-engc has-accent', style: '--ca:#C5572F',
        onclick: function () {
          try {
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

  window.SYM_SCREENS = window.SYM_SCREENS || {};
  window.SYM_SCREENS.curriculum = function (home, ctx) { render(home, ctx); };
})();
