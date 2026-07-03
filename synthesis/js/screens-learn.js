/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · LEARNING NAVIGATION (hierarchical)
   ────────────────────────────────────────────────────────────────────
   Adds the grade → class → games hierarchy the brief asks for, plus the
   Γραμματική (Αρχαία / Λατινικά / Έκθεση) hub, and the bridge that opens
   the ported THEORY subsystem (Θεωρία · Πίνακας · Κάρτες lesson subpages).

   New screens registered on window.SYM_SCREENS:
     · grade      — a grade's 3 classes as cards   (param {grade:'gym'|'lyk'})
     · classpage  — a class's subjects + games      (param {cls} | classId)
     · gramhub    — Γραμματική hub (Αρχαία/Λατινικά/Έκθεση)
     · gramtrack  — a grammar track's subjects, games + theory lessons
                                                     (param {trackId})

   Uses the same building blocks as the rest of the synthesis shell:
   synPage(), synTile(), el(), L(), symGo(), glyph(), STATE, and the
   existing tile-launch path (synResolveLaunch / synLaunch).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const P  = window.synPage;
  const go = (s, p) => window.symGo(s, p);
  const SY = () => window.SYM || {};

  function glyph(name, cls) { return el('span', { class: (cls || 'sc-gl'), 'data-illu': name }); }

  // group meta for the two grade tracks
  const GRADE_GROUPS = {
    gym: { id: 'gym', label: { gr: 'Γυμνάσιο', en: 'Gymnasio' }, ids: ['gym-a', 'gym-b', 'gym-c'],
      eyebrow: { gr: 'Δευτεροβάθμια · Γυμνάσιο', en: 'Secondary · Gymnasio' },
      blurb: { gr: 'Διάλεξε τάξη για να δεις τα μαθήματα και τα παιχνίδια της.',
               en: 'Pick a class to see its subjects and games.' } },
    lyk: { id: 'lyk', label: { gr: 'Λύκειο', en: 'Lykeio' }, ids: ['lyk-a', 'lyk-b', 'lyk-c'],
      eyebrow: { gr: 'Δευτεροβάθμια · Λύκειο', en: 'Secondary · Lykeio' },
      blurb: { gr: 'Διάλεξε τάξη για να δεις τα μαθήματα και τα παιχνίδια της.',
               en: 'Pick a class to see its subjects and games.' } },
  };

  /* ── THEORY lesson registry per grammar track ──────────────────────
     Each entry maps to a ported THEORY_META dataset (theory-data.js /
     theory-codex.js). `data` is the data-only script that defines the
     dataset global(s) the adapter reads — lazy-loaded before opening the
     lesson so the build() succeeds. The Mnemosyne (Κάρτες) handoff and the
     teacher-edit chrome degrade gracefully when their globals are absent. */
  const THEORY_TRACKS = {
    'gram-archaia': [
      { id: 'grammar-theoria', gr: 'Γραμματική', en: 'Grammar', illu: 'scroll',
        meta: { gr: '44 μαθήματα · Θεωρία · Άσκηση · Εξέταση', en: '44 lessons · Theory · Practice · Exam' },
        module: 'grammar-theoria', data: 'games/grammar-theoria/grammar-theoria.js' },
      { id: 'eimi',       gr: 'Ρήμα: εἰμί',          en: 'Verb: eimí',           illu: 'scroll',
        meta: { gr: 'Θεωρία · Πίνακας · Κάρτες', en: 'Theory · Table · Cards' },
        data: 'games/eimi/data.js' },
      { id: 'aoristos-b', gr: 'Αόριστος Β΄',          en: 'Aorist B',             illu: 'amphora',
        meta: { gr: 'Codex · 20 ανώμαλα ρήματα', en: 'Codex · 20 irregular verbs' },
        data: 'games/aoristos-b/data.js' },
      { id: 'ousiastika', gr: 'Κλίση Ουσιαστικών',    en: 'Noun Declension',      illu: 'column',
        meta: { gr: 'Θεωρία · Πίνακας · Κάρτες', en: 'Theory · Table · Cards' },
        data: 'games/ousiastika/data.js' },
      { id: 'epitheta',   gr: 'Επίθετα',              en: 'Adjectives',           illu: 'wreath',
        meta: { gr: 'Θεωρία · Πίνακας · Κάρτες', en: 'Theory · Table · Cards' },
        data: 'games/epitheta/data.js' },
    ],
    'gram-latin': [
      // Latin theory ships through the game-side theory openers; the shared
      // three-mode view has no Latin META adapter yet, so this track shows
      // its grammar games and the Latin theory note opener where present.
    ],
    'gram-neo': [
      // Έκθεση/composition has no grammar-table datasets yet → games-only.
    ],
  };

  /* ── Συντακτικό (kind:'syntax') — a self-contained, client-side course.
     Its 36 lessons register into window.SYNTAX at load; we surface them as
     theory cards in the Αρχαία grammar track's Θεωρία block (auto-scaling —
     any lesson added to the registry appears here with no wiring). They
     carry no lazy `data` (eager-loaded via index.html) and open through the
     shared openTheoryLesson(), which dispatches kind:'syntax' → the engine. */
  function syntaxTheoryLessons() {
    if (!(window.SYNTAX && typeof window.SYNTAX.all === 'function')) return [];
    return window.SYNTAX.all().filter(Boolean).map(function (Lx) {
      var title = ((Lx.title || '') + (Lx.titleEm || '')).trim() || Lx.id;
      var m = Lx.subtitle || Lx.section || 'Συντακτικό';
      return { id: Lx.id, gr: title, en: title, illu: 'labyrinth',
               meta: { gr: m, en: m } };
    });
  }
  // theory list for a track = ported grammar-table lessons + (Αρχαία only)
  // the live Συντακτικό registry.
  function theoryListFor(trackId) {
    var base = THEORY_TRACKS[trackId] || [];
    return (trackId === 'gram-archaia') ? base.concat(syntaxTheoryLessons()) : base;
  }

  // Ensure the theory subsystem CSS is present, lazy-load the dataset's
  // data-only script (defines the global the adapter reads), then open the
  // three-mode lesson. Falls back to a friendly notice if anything is off.
  function openTheory(lesson) {
    // Self-contained grammar module (Αρχαία Γραμματική): lazy-load its single
    // script, then open its shadow-DOM overlay. Isolated from the theory engine.
    if (lesson.module === 'grammar-theoria') {
      const runGram = function () {
        if (typeof window.openGrammarTheoria === 'function') window.openGrammarTheoria();
        else _theoryUnavailable(lesson);
      };
      if (lesson.data && typeof window.lazyLoad === 'function') {
        window.lazyLoad([lesson.data]).then(runGram).catch(runGram);
      } else { runGram(); }
      return;
    }
    const ds = lesson.id;
    if (window.synEnsureCss) {
      try { window.synEnsureCss(['css/theory-lessons.css']); } catch (_) {}
    }
    const launch = function () {
      if (typeof window.openTheoryLesson === 'function') { window.openTheoryLesson(ds); return; }
      _theoryUnavailable(lesson);
    };
    if (lesson.data && typeof window.lazyLoad === 'function') {
      window.lazyLoad([lesson.data]).then(launch).catch(launch);
    } else {
      launch();
    }
  }

  function _theoryUnavailable(lesson) {
    const note = L({ gr: 'Το μάθημα θεωρίας ετοιμάζεται — θα είναι σύντομα διαθέσιμο.',
                     en: 'This theory lesson is on the way — available soon.' });
    if (window.SymPreview && SymPreview.open) SymPreview.open('mc', { title: L(lesson), note });
    else if (typeof window.showToast === 'function') showToast(note, note);
  }

  // Resolve a dataset's required tier (for the visible subscription lock).
  function _datasetTier(id) {
    try {
      const ds = (window.GP_CONTENT && window.GP_CONTENT.find && window.GP_CONTENT.find(id)) ||
                 (typeof GP_DATASETS !== 'undefined' && GP_DATASETS.find(d => d.id === id)) || null;
      return ds ? ds.tier : null;
    } catch (_) { return null; }
  }
  // Locked = content has a paid tier the current user can't yet meet.
  function _tierLocked(tier) {
    return !!(tier && tier !== 'free' &&
      typeof _gpCanAccessTier === 'function' && !_gpCanAccessTier(tier));
  }

  function theoryCard(lesson) {
    const tier   = _datasetTier(lesson.id);
    const locked = _tierLocked(tier);
    const tierLbl = (window.SymTiers && SymTiers.label) ? L(SymTiers.label(tier))
                  : (tier ? tier.charAt(0).toUpperCase() + tier.slice(1) : 'Pro');
    const card = el('a', {
      class: 'sc-gcard sc-gcard--theory' + (locked ? ' sc-gcard--locked' : ''),
      href: 'javascript:void 0', style: 'position:relative',
      onclick: () => openTheory(lesson),   // launch path shows the upgrade toast + redirect
    }, [
      el('div', { class: 'sc-gcard__ban' }, [
        el('span', { class: 'sc-theory-tag' }, L({ gr: 'Θεωρία', en: 'Theory' })),
        locked ? el('span', { class: 'sc-tag sc-tag--lock', title: L({ gr: 'Απαιτείται συνδρομή', en: 'Subscription required' }) }, '🔒 ' + tierLbl) : null,
        glyph(lesson.illu, 'sc-gcard__illu'),
      ]),
      el('div', { class: 'sc-gcard__b' }, [
        el('h3', { class: 'sc-gcard__t' }, L(lesson)),
        el('p', { class: 'sc-gcard__m' }, L(lesson.meta)),
        el('div', { class: 'sc-gcard__f' }, [
          el('span', { class: 'sc-gcard__tags' }, [
            locked
              ? el('span', { class: 'sc-pill sc-pill--lock' }, '🔒 ' + tierLbl)
              : el('span', { class: 'sc-pill has-accent' }, L({ gr: 'Μάθημα', en: 'Lesson' })) ]),
          el('span', { class: 'sc-gcard__play' + (locked ? ' sc-gcard__play--locked' : ''), html: locked ? '&#128274;' : '&#9656;' }),
        ]),
      ]),
    ]);
    return card;
  }

  // a single game tile that dispatches through the real launch path
  // (mirrors what the home subject grid + S.subject games pane do).
  function gameTile(gm, cls, accent) {
    if (gm.soon) {
      return window.synTile ? window.synTile(gm, accent) : el('div', {}, L(gm));
    }
    const onclick = () => {
      const fn = window.synResolveLaunch && window.synResolveLaunch(gm);
      if (fn && window.synLaunch) { window.synLaunch(fn, ...((gm.launch && gm.launch.args) || [])); return; }
      // no real opener wired → reuse the existing mode/level flow
      const subj = _subjectOf(gm, cls);
      go('mode', { subject: subj, game: gm, cls });
    };
    return window.synTile ? window.synTile(gm, accent, onclick)
      : el('a', { href: 'javascript:void 0', onclick }, L(gm));
  }

  function _subjectOf(gm, cls) {
    const list = (SY().SUBJECTS && SY().SUBJECTS[cls.id]) || [];
    return list.find(s => (s.games || []).indexOf(gm) >= 0) || list[0] || { id: cls.id, games: [gm] };
  }

  // shared renderer: a class/track's subjects, each with its game grid,
  // plus (optionally) a Θεωρία block of lesson cards.
  function renderSubjectBlocks(body, node, theoryLessons) {
    const accent = node.accent || '#C18A2C';
    const subjects = (SY().SUBJECTS && SY().SUBJECTS[node.id]) || [];

    // Theory block first (when the track has lessons) — the headline ask
    if (theoryLessons && theoryLessons.length) {
      const sec = el('section', { class: 'syn-subj has-accent', style: `--ca:${accent}` });
      sec.appendChild(el('div', { class: 'syn-subj__hd' }, [
        el('span', { class: 'syn-subj__no' }, 'Θ' ),
        el('span', { class: 'syn-subj__badge' }, [ el('span', { class: 'syn-subj__illu', 'data-illu': 'book' }) ]),
        el('div', { class: 'syn-subj__tx' }, [
          el('h3', { class: 'syn-subj__ttl' }, L({ gr: 'Θεωρία & Μαθήματα', en: 'Theory & Lessons' })),
          el('p', { class: 'syn-subj__sum' }, L({ gr: 'Άνοιξε ένα μάθημα — Θεωρία · Πίνακας · Κάρτες.',
                                                  en: 'Open a lesson — Theory · Table · Cards.' })),
        ]),
      ]));
      const grid = el('div', { class: 'sc-cards has-accent', style: `--ca:${accent}` });
      theoryLessons.forEach(lz => grid.appendChild(theoryCard(lz)));
      sec.appendChild(grid);
      body.appendChild(sec);
    }

    if (!subjects.length && !(theoryLessons && theoryLessons.length)) {
      body.appendChild(el('p', { class: 'sc-sub', style: 'margin-top:20px' },
        L({ gr: 'Δεν υπάρχουν ακόμη αναθέσεις για αυτή την ενότητα.',
            en: 'No assigned material for this section yet.' })));
      return;
    }

    subjects.forEach((s, i) => {
      // admin-assigned template tiles for this class+subject — merged at render
      // time so they appear exactly like the hardcoded voyage tiles (no data.js
      // edits, idempotent per render). See js/syn-assignments.js.
      const _extra = (window.synAssignedTiles && window.synAssignedTiles(node.id, s.id)) || [];
      const _games = (s.games || []).concat(_extra);
      const block = el('section', { class: 'syn-subj has-accent', style: `--ca:${accent}` });
      block.appendChild(el('div', { class: 'syn-subj__hd' }, [
        el('span', { class: 'syn-subj__no' }, String(i + 1).padStart(2, '0')),
        el('span', { class: 'syn-subj__badge' }, [ el('span', { class: 'syn-subj__illu', 'data-illu': s.illu }) ]),
        el('div', { class: 'syn-subj__tx' }, [
          el('h3', { class: 'syn-subj__ttl' }, L(s)),
          el('p', { class: 'syn-subj__sum' }, L(s.summary)),
        ]),
        el('a', { class: 'syn-subj__all', href: 'javascript:void 0',
          onclick: () => go('subject', { subject: s, cls: node }) }, [
          L({ gr: 'Όλα', en: 'All' }), el('span', { class: 'syn-subj__cnt' }, _games.length) ]),
      ]));
      block.appendChild(el('div', { class: 'syn-subj__grid' },
        _games.map(gm => gameTile(gm, node, accent))));
      body.appendChild(block);
    });
  }

  const S = {};

  /* ══ GRADE — a grade's three classes as cards ══ */
  function gradeScreen(home, ctx) {
    const grade = (ctx.param && ctx.param.grade) || 'gym';
    const G = GRADE_GROUPS[grade] || GRADE_GROUPS.gym;
    const accent = (ctx.byId(G.ids[0]) || {}).accent || '#C18A2C';
    const body = P(home, {
      back: 'home', accent, eyebrow: L(G.eyebrow), title: L(G.label), sub: L(G.blurb),
    });
    const grid = el('div', { class: 'sc-modes sc-stagger has-accent', style: `--ca:${accent}` });
    G.ids.forEach(id => {
      const c = ctx.byId(id); if (!c) return;
      const subs = (ctx.subjects[id] || []);
      const nGames = subs.reduce((n, s) => n + ((s.games && s.games.length) || 0), 0);
      grid.appendChild(el('button', {
        class: 'sc-mode has-accent', style: `--ca:${c.accent}`,
        onclick: () => go('classpage', { cls: c }),
      }, [
        el('span', { class: 'sc-mode__ic' }, [ el('span', { class: 'sc-mode__rom' }, c.roman) ]),
        el('span', { class: 'sc-mode__t' }, L(c)),
        el('span', { class: 'sc-mode__d' }, L(c.blurb)),
        el('span', { class: 'sc-mode__meta' },
          subs.length + ' ' + L({ gr: 'μαθήματα', en: 'subjects' }) + ' · ' +
          nGames + ' ' + L({ gr: 'παιχνίδια', en: 'games' })),
        el('span', { class: 'sc-mode__go', html: '&rarr;' }),
      ]));
    });
    body.appendChild(grid);
  }
  S.gym = function (home, ctx) { ctx.param = Object.assign({}, ctx.param, { grade: 'gym' }); gradeScreen(home, ctx); };
  S.lyk = function (home, ctx) { ctx.param = Object.assign({}, ctx.param, { grade: 'lyk' }); gradeScreen(home, ctx); };
  S.grade = gradeScreen;

  /* ══ CLASSPAGE — a class's subjects + assigned games ══ */
  S.classpage = function (home, ctx) {
    let cls = (ctx.param && ctx.param.cls) ||
              (ctx.param && ctx.param.classId && ctx.byId(ctx.param.classId)) ||
              ctx.byId(ctx.classId) || ctx.activeClass;
    if (!cls) { go('home'); return; }
    const isGym = String(cls.id).indexOf('gym') === 0;
    const back = isGym ? 'gym' : 'lyk';
    const grLbl = isGym ? GRADE_GROUPS.gym.label : GRADE_GROUPS.lyk.label;
    const body = P(home, {
      back, backLabel: L(grLbl), accent: cls.accent,
      roman: cls.roman, eyebrow: L(grLbl) + ' · ' + L({ gr: 'Τάξη', en: 'Class' }),
      title: L(cls), sub: L(cls.blurb),
      actions: [ el('button', { class: 'sc-cta sc-cta--ghost sc-cta--sm', onclick: () => go('gamepanel') },
        [ glyph('grid-blocks', 'sc-cta__gl'), L({ gr: 'Πίνακας Παιχνιδιών', en: 'Game Panel' }) ]) ],
    });
    const wrap = el('div', { class: 'syn-subjects' });
    renderSubjectBlocks(wrap, cls, null);
    body.appendChild(wrap);
    if (window.injectIllus) injectIllus(wrap);
  };

  /* ══ GRAMHUB — Γραμματική hub (Αρχαία / Λατινικά / Έκθεση) ══ */
  S.gramhub = function (home, ctx) {
    const tracks = SY().GRAMMAR || [];
    const accent = (tracks[0] && tracks[0].accent) || '#C18A2C';
    const body = P(home, {
      back: 'home', accent,
      eyebrow: L({ gr: 'Γραμματική & Θεωρία', en: 'Grammar & Theory' }),
      title: L({ gr: 'Γραμματική', en: 'Grammar' }),
      sub: L({ gr: 'Αρχαία, Λατινικά & Έκθεση — διάλεξε ενότητα για τα παιχνίδια και τη θεωρία της.',
               en: 'Ancient Greek, Latin & Composition — pick a track for its games and theory.' }),
    });
    const grid = el('div', { class: 'sc-modes sc-stagger has-accent', style: `--ca:${accent}` });
    tracks.forEach(tr => {
      const subs = (ctx.subjects[tr.id] || []);
      const nGames = subs.reduce((n, s) => n + ((s.games && s.games.length) || 0), 0);
      const nTheory = theoryListFor(tr.id).length;
      grid.appendChild(el('button', {
        class: 'sc-mode has-accent', style: `--ca:${tr.accent}`,
        onclick: () => go('gramtrack', { trackId: tr.id }),
      }, [
        el('span', { class: 'sc-mode__ic' }, [ glyph(tr.glyph, 'sc-mode__gl') ]),
        el('span', { class: 'sc-mode__t' }, L(tr)),
        el('span', { class: 'sc-mode__d' }, L(tr.blurb)),
        el('span', { class: 'sc-mode__meta' },
          nGames + ' ' + L({ gr: 'παιχνίδια', en: 'games' }) +
          (nTheory ? ' · ' + nTheory + ' ' + L({ gr: 'μαθήματα θεωρίας', en: 'theory lessons' }) : '')),
        el('span', { class: 'sc-mode__go', html: '&rarr;' }),
      ]));
    });
    body.appendChild(grid);
  };

  /* ══ GRAMTRACK — a grammar track's games + theory lessons ══ */
  S.gramtrack = function (home, ctx) {
    const trackId = (ctx.param && ctx.param.trackId) || 'gram-archaia';
    const tr = (SY().GRAMMAR || []).find(t => t.id === trackId) ||
               (window.SYM.classById && window.SYM.classById(trackId));
    if (!tr) { go('gramhub'); return; }
    const body = P(home, {
      back: 'gramhub', backLabel: L({ gr: 'Γραμματική', en: 'Grammar' }), accent: tr.accent,
      eyebrow: L({ gr: 'Γραμματική & Θεωρία', en: 'Grammar & Theory' }) + ' · ' + L(tr.sub || tr),
      title: L(tr), sub: L(tr.blurb),
    });
    const wrap = el('div', { class: 'syn-subjects' });
    renderSubjectBlocks(wrap, tr, theoryListFor(trackId));
    body.appendChild(wrap);
    if (window.injectIllus) injectIllus(wrap);
  };

  // register all new learning screens onto the shared dispatch table
  window.SYM_SCREENS = window.SYM_SCREENS || {};
  Object.assign(window.SYM_SCREENS, S);

  // expose the theory bridge so other modules / menu items can reuse it
  window.synOpenTheory = openTheory;
  window.SYN_THEORY_TRACKS = THEORY_TRACKS;
})();
