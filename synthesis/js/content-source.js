/* ════════════════════════════════════════════════════════════════════
   content-source.js — Site Studio runtime read / write path (synthesis)
   --------------------------------------------------------------------
   The Site Studio UI (js/admin-studio.js) navigates & edits the whole
   catalog (Τάξεις → Μαθήματα → Παιχνίδια → Ερωτήσεις) entirely through
   window.ContentSource. This module is that source — adapted to the
   synthesis revamp's own data model (window.SYM) and its tiny
   localStorage layer (window.SymStore), NOT Ver1's Firestore-only paths.

   Sourcing (read):
     loadCatalog()          → grades → subjects → games tree, built from
                              SYM.CLASSES + SYM.GRAMMAR (grades) and
                              SYM.SUBJECTS (per-grade subjects → game tiles).
                              A SymStore (or Firestore) override wins; else
                              the seed derived from SYM is returned.
     loadGameContent(cid)   → one game's editable content (quiz | paradigm).
                              SymStore/Firestore override first, else the
                              bundled STUDIO_SEED-style seed derived from the
                              synthesis trivia banks / paradigm tables.

   Persistence (write):
     saveCatalog(tree)      → SymStore['studio_catalog'] (+ validated callable
                              adminSaveCatalog → siteCatalog/tree) — survives reload.
     saveContent(cid, doc)  → SymStore['gameContent/<cid>'] (+ validated callable
                              adminSaveGameContent → gameContent/<cid>).

   All Firestore access is GUARDED by
       typeof firebase !== 'undefined' && firebase.firestore
   so in the sandbox (no firebase) it degrades to SymStore-only WITHOUT
   throwing.

   Apply (live):
     applyCatalogToGRADES(tree)        → overlay catalog edits onto SYM in
                                         place (re-render shows them live).
     applyContentToGlobals(cid, doc)   → push edited trivia/question content
                                         into the runtime globals the games
                                         read (window.QUESTIONS / OD_QUESTIONS
                                         / SYM_QUESTIONS) where present, and
                                         always persist so a reload reflects it.
     bustCache(cid?) · _refreshCatalogView() — cache invalidation + re-render.

   Loaded after js/data.js & js/store.js (the orchestrator wires the tag).
   ════════════════════════════════════════════════════════════════════ */
window.ContentSource = (function () {
  'use strict';

  const clone = o => (o == null) ? o : ((typeof structuredClone === 'function')
    ? structuredClone(o) : JSON.parse(JSON.stringify(o)));

  // ── stores ──────────────────────────────────────────────────────
  const _store = () => (typeof window !== 'undefined' && window.SymStore) || null;
  const _db = () => (typeof firebase !== 'undefined' && firebase.firestore)
    ? firebase.firestore() : null;
  const _sym = () => (typeof window !== 'undefined' && window.SYM) || null;

  const CATALOG_KEY = 'studio_catalog';                 // SymStore key
  const contentKey = cid => 'gameContent/' + cid;       // SymStore key + Firestore doc

  // in-memory cache: { catalog, [contentId]: doc }
  const _cache = Object.create(null);
  let _baseSnapshot = null;   // pristine clone of SYM.SUBJECTS for non-destructive overlays

  // ── SymStore helpers (guarded; no-throw) ────────────────────────
  function _ssGet(key, def) {
    try { const s = _store(); return s ? s.get(key, def) : def; } catch (_) { return def; }
  }
  function _ssSet(key, val) {
    try { const s = _store(); if (s) s.set(key, val); return true; } catch (_) { return false; }
  }

  /* ════════════════ CATALOG · build from SYM ════════════════════ */
  // Map a synthesis game TILE { gr, en, meta, illu, launch } → a Studio
  // game node { id, type, label, labelEn, ic, tier, content }. We derive a
  // best-effort `type`/`content` so trivia & paradigm tiles open editable;
  // tiles with no editable backing get content:null (still renamable/orderable).
  const ICON_BY_ILLU = {
    trireme: '🚢', helmet: '🪖', column: '🏛️', scroll: '📜', masks: '🎭',
    walls: '🧱', acropolis: '🏛️', amphora: '🏺', wreath: '🌿', owl: '🦉',
    quill: '🪶', book: '📖', cipher: '🔐', labyrinth: '🌀', 'shield-spear': '🛡️',
    'shield-round': '🛡️', 'cyclops-eye': '👁️', cards: '🃏', chariot: '🏇',
    'trojan-horse': '🐴', agora: '🏛️', 'lightning-bolt': '⚡', trident: '🔱',
    runner: '🏃', map: '🗺️', timeline: '📋', invader: '👾', sword: '⚔️',
  };

  // Editable-content map. Greek-authored content lives in a quiz/paradigm doc
  // keyed by a stable content id. A tile is matched to one of these by its
  // launch fn, by an explicit english tag, or by a label heuristic.
  // type drives the studio editor (trivia → quiz UI · *paradigm* → table UI).
  const CONTENT_TYPES = {
    // trivia (quiz schema) — the in-game globals the engine reads
    'odyssey-trivia': { type: 'odyssey-trivia', schema: 'quiz', content: 'odyssey-trivia', ic: '🌊' },
    'iliada-trivia':  { type: 'trivia',         schema: 'quiz', content: 'iliada-trivia',  ic: '🏆' },
    // paradigm tables (paradigm schema)
    'lyo':            { type: 'conjugation', schema: 'paradigm', content: 'lyo',        ic: '🏛️' },
    'aoristos-b':     { type: 'conjugation', schema: 'paradigm', content: 'aoristos-b', ic: '📜' },
    'ousiastika':     { type: 'declension',  schema: 'paradigm', content: 'ousiastika', ic: '📐' },
    'lat-nouns':      { type: 'declension',  schema: 'paradigm', content: 'lat-nouns',  ic: '🏺' },
    'lat-verbs':      { type: 'conjugation', schema: 'paradigm', content: 'lat-verbs',  ic: '📋' },
  };

  // Heuristics: launch.fn → content id.
  const FN_TO_CONTENT = {
    openLatNouns: 'lat-nouns', openLatAnwmala: 'lat-verbs', openLatEpitheta: 'lat-nouns',
  };
  // Label substrings (lower-cased, Greek) → content id, for tiles without a fn.
  const LABEL_RULES = [
    [/odyssey trivia|οδύσσεια trivia/i, 'odyssey-trivia'],
    [/trivia ιλιάδας|iliad trivia|ιλιάδα trivia/i, 'iliada-trivia'],
    [/λύω|learning to decline/i, 'lyo'],
    [/αόριστος β/i, 'aoristos-b'],
    [/κλίση ουσιαστικ|noun declension/i, 'ousiastika'],
    [/κλίσις ρημάτων|verb forms|κλίση ρημάτων/i, 'lyo'],
  ];

  function _contentFor(tile) {
    if (!tile) return null;
    const fn = tile.launch && tile.launch.fn;
    if (fn && FN_TO_CONTENT[fn]) return FN_TO_CONTENT[fn];
    const hay = String(tile.gr || '') + ' ' + String(tile.en || '');
    for (const [re, id] of LABEL_RULES) { if (re.test(hay)) return id; }
    return null;
  }

  function _gameNode(tile, gradeKey, subId, i) {
    const cid = _contentFor(tile);
    const ct = cid ? CONTENT_TYPES[cid] : null;
    const ic = ICON_BY_ILLU[tile.illu] || (ct && ct.ic) || '🎮';
    return {
      id: `${subId}~g${i}`,
      type: ct ? ct.type : (tile.illu || 'game'),
      label: tile.gr || tile.en || 'Παιχνίδι',
      labelEn: tile.en || tile.gr || '',
      ic,
      tier: 'free',
      // Only quiz (trivia) content is editable AND deliverable in the Studio.
      // Paradigm games read bespoke per-game data.js banks that the Studio's
      // paradigm doc doesn't match, so they're surfaced as non-editable rather
      // than opening a toy editor whose saves never reach the game. (Delivering
      // paradigm edits is a model-reconciliation project — see applyLiveGameOverride.)
      content: (ct && ct.schema === 'quiz') ? ct.content : null,
      // keep the original launch hint so an overlay can preserve it
      _launch: tile.launch || null,
      _illu: tile.illu || null,
    };
  }

  // Build the full grades → subjects → games tree from SYM.
  function buildCatalogFromSYM() {
    const SYM = _sym();
    if (!SYM || !Array.isArray(SYM.CLASSES)) return { grades: [] };
    const SUBJECTS = SYM.SUBJECTS || {};
    const grades = [];

    const pushGrade = (cls, cycle, hasTracks) => {
      const subsSrc = SUBJECTS[cls.id] || [];
      const subjects = subsSrc.map(s => ({
        id: s.id,
        icon: ICON_BY_ILLU[s.illu] || '📘',
        label: s.gr || s.en || s.id,
        labelEn: s.en || s.gr || '',
        track: s.track || null,
        games: (s.games || []).map((t, i) => _gameNode(t, cls.id, s.id, i)),
      }));
      grades.push({
        key: cls.id,
        label: cls.gr || cls.en || cls.id,
        cycle: cycle || '',
        hasTracks: !!hasTracks,
        subjects,
      });
    };

    // 6 student classes (Γυμνάσιο Α–Γ, Λύκειο Α–Γ)
    SYM.CLASSES.forEach(c => {
      const grp = (SYM.CLASS_GROUPS || []).find(g => (g.ids || []).indexOf(c.id) >= 0);
      pushGrade(c, grp ? (grp.label && (grp.label.gr || grp.label.en)) || '' : '', false);
    });
    // Grammar / content banks (Αρχαία · Λατινικά · Έκθεση) — appended as grades
    (SYM.GRAMMAR || []).forEach(c => pushGrade(c, 'Γραμματική · Θεωρία', false));

    return { grades };
  }

  /* ════════════════ CONTENT · seed from SYM / banks ═════════════ */
  // Greek persons / cases (mirror admin-studio.js STUDIO_SEED axes).
  const PERSONS = ['α΄ ενικ.', 'β΄ ενικ.', 'γ΄ ενικ.', 'α΄ πληθ.', 'β΄ πληθ.', 'γ΄ πληθ.'];
  const GR_CASES = ['Ονομαστική', 'Γενική', 'Δοτική', 'Αιτιατική', 'Κλητική'];
  const LAT_CASES = ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Vocative', 'Ablative'];
  const PE = (lemma, meta, cells) => ({ lemma, meta, cells });
  const PU = (key, label, rowAxis, colAxis, entries) => ({ key, label, rowAxis, colAxis, entries });

  // Paradigm seeds for the content ids the catalog can surface. These mirror
  // admin-studio.js STUDIO_SEED so the editor opens with real starter tables
  // even before any Firestore migration exists.
  const PARADIGM_SEED = {
    'lyo': { schema: 'paradigm', unitWord: 'Χρόνος', unitWordEn: 'Tense', units: [
      PU('pres-act', 'Ενεστώτας · Ενεργητική Φωνή', PERSONS,
        ['Οριστική', 'Υποτακτική', 'Ευκτική', 'Προστακτική'], [PE('λύω', 'ομαλό ρήμα σε -ω', [
          ['λύω', 'λύω', 'λύοιμι', '—'], ['λύεις', 'λύῃς', 'λύοις', 'λῦε'], ['λύει', 'λύῃ', 'λύοι', 'λυέτω'],
          ['λύομεν', 'λύωμεν', 'λύοιμεν', '—'], ['λύετε', 'λύητε', 'λύοιτε', 'λύετε'],
          ['λύουσι(ν)', 'λύωσι(ν)', 'λύοιεν', 'λυόντων']])]),
    ] },
    'aoristos-b': { schema: 'paradigm', unitWord: 'Έγκλιση', unitWordEn: 'Mood', units: [
      PU('ind-act', 'Αόριστος Β΄ · Οριστική Ενεργητικής', PERSONS, ['βάλλω', 'λαμβάνω', 'λείπω'],
        [PE('Αόριστος Β΄', '3 ρήματα με ανώμαλο θέμα', [
          ['ἔβαλον', 'ἔλαβον', 'ἔλιπον'], ['ἔβαλες', 'ἔλαβες', 'ἔλιπες'], ['ἔβαλε(ν)', 'ἔλαβε(ν)', 'ἔλιπε(ν)'],
          ['ἐβάλομεν', 'ἐλάβομεν', 'ἐλίπομεν'], ['ἐβάλετε', 'ἐλάβετε', 'ἐλίπετε'], ['ἔβαλον', 'ἔλαβον', 'ἔλιπον']])]),
    ] },
    'ousiastika': { schema: 'paradigm', unitWord: 'Κλίση', unitWordEn: 'Declension', units: [
      PU('a', 'Α΄ Κλίση', GR_CASES, ['Ενικός', 'Πληθυντικός'], [
        PE('ἡ χώρα', 'θηλυκό', [['χώρα', 'χῶραι'], ['χώρας', 'χωρῶν'], ['χώρᾳ', 'χώραις'], ['χώραν', 'χώρας'], ['χώρα', 'χῶραι']]),
        PE('ὁ ταμίας', 'αρσενικό', [['ταμίας', 'ταμίαι'], ['ταμίου', 'ταμιῶν'], ['ταμίᾳ', 'ταμίαις'], ['ταμίαν', 'ταμίας'], ['ταμία', 'ταμίαι']])]),
    ] },
    'lat-nouns': { schema: 'paradigm', unitWord: 'Κλίση', unitWordEn: 'Declension', units: [
      PU('1', 'Α΄ Κλίση (1st)', LAT_CASES, ['Singular', 'Plural'], [
        PE('puella, -ae', 'θηλυκό', [['puella', 'puellae'], ['puellae', 'puellarum'], ['puellae', 'puellis'], ['puellam', 'puellas'], ['puella', 'puellae'], ['puella', 'puellis']])]),
      PU('2', 'Β΄ Κλίση (2nd)', LAT_CASES, ['Singular', 'Plural'], [
        PE('dominus, -i', 'αρσενικό', [['dominus', 'domini'], ['domini', 'dominorum'], ['domino', 'dominis'], ['dominum', 'dominos'], ['domine', 'domini'], ['domino', 'dominis']])]),
    ] },
    'lat-verbs': { schema: 'paradigm', unitWord: 'Χρόνος', unitWordEn: 'Tense', units: [
      PU('pres', 'Praesens · Indicativus Activi', ['1 sg', '2 sg', '3 sg', '1 pl', '2 pl', '3 pl'], ['amo (1)', 'moneo (2)'],
        [PE('Praesens', 'δύο συζυγίες', [['amo', 'moneo'], ['amas', 'mones'], ['amat', 'monet'], ['amamus', 'monemus'], ['amatis', 'monetis'], ['amant', 'monent']])]),
    ] },
  };

  // Trivia banks the synthesis games read. On the home page these globals live
  // inside the game iframes (not loaded here), so we tolerate their absence and
  // fall back to a small starter quiz so the editor still opens with content.
  function _quizTargets(contentId) {
    if (typeof window === 'undefined') return null;
    if (contentId === 'iliada-trivia') {
      return { Q: window.QUESTIONS || null, R: window.RHAPSODIES || null };
    }
    if (contentId === 'odyssey-trivia') {
      return { Q: window.OD_QUESTIONS || null, R: window.OD_RHAPSODIES || null };
    }
    return null;
  }

  // Project a live QUESTIONS-style global → a quiz content doc.
  function _quizDocFromGlobals(tgt) {
    if (!tgt || !tgt.Q) return null;
    const Q = tgt.Q;
    const order = (Array.isArray(tgt.R) && tgt.R.length) ? tgt.R.slice() : [];
    const keys = Object.keys((Q.gr || Q.en || Q) || {});
    keys.forEach(k => { if (order.indexOf(k) < 0) order.push(k); });
    const pick = k => (Q.gr && Q.gr[k]) || (Q.en && Q.en[k]) || (Array.isArray(Q[k]) ? Q[k] : null);
    const units = order
      .filter(k => Array.isArray(pick(k)))
      .map(k => ({ key: k, label: k, questions: clone(pick(k)) || [], texts: [] }));
    if (!units.length) return null;
    return { schema: 'quiz', unitWord: 'Ραψωδία', unitWordEn: 'Rhapsody', units };
  }

  // A minimal editable starter quiz when no live bank is present.
  function _starterQuiz(label) {
    return { schema: 'quiz', unitWord: 'Ραψωδία', unitWordEn: 'Rhapsody', units: [
      { key: 'Α', label: 'Α', texts: [], questions: [
        { q: 'Νέα ερώτηση;', opts: ['Σωστό', 'Λάθος', '—', '—'], ans: 0 },
      ] },
    ] };
  }

  // The bundled seed for a content id (paradigm table or trivia bank).
  function seedContent(contentId) {
    if (!contentId) return null;
    if (PARADIGM_SEED[contentId]) return clone(PARADIGM_SEED[contentId]);
    const tgt = _quizTargets(contentId);
    if (tgt) {
      const doc = _quizDocFromGlobals(tgt);
      if (doc) return doc;
      return _starterQuiz(contentId);
    }
    return null;
  }

  /* ════════════════ LOADERS (override-first) ════════════════════ */
  // Read an override doc: SymStore first (works offline), then Firestore.
  async function _readOverride(key, fsDoc) {
    const local = _ssGet(key, null);
    if (local) return local;
    const db = _db();
    if (db && fsDoc) {
      try {
        const snap = await db.doc(fsDoc).get();
        if (snap && snap.exists) { const d = snap.data(); if (d) { _ssSet(key, d); return d; } }
      } catch (_) { /* offline / perms — fall through */ }
    }
    return null;
  }

  async function loadCatalog(force) {
    if (_cache.catalog && !force) return _cache.catalog;
    // Read from the same doc the validated callable writes (siteCatalog/tree),
    // NOT config/catalog — otherwise Studio catalog edits are write-only and
    // loadCatalog always falls through to the static SYM seed.
    const ov = await _readOverride(CATALOG_KEY, 'siteCatalog/tree');
    if (ov && Array.isArray(ov.grades)) return (_cache.catalog = ov);
    return (_cache.catalog = buildCatalogFromSYM());
  }

  async function loadGameContent(contentId, force) {
    if (!contentId) return null;
    if (_cache[contentId] && !force) return _cache[contentId];
    const ov = await _readOverride(contentKey(contentId), contentKey(contentId));
    if (ov && Array.isArray(ov.units)) return (_cache[contentId] = ov);
    const seed = seedContent(contentId);
    return (_cache[contentId] = seed);
  }
  // admin-studio.js historically also calls loadContent(cid) — alias it.
  const loadContent = loadGameContent;

  /* ════════════════ SAVERS (SymStore + guarded Firestore) ══════ */
  async function saveCatalog(tree) {
    const doc = (tree && Array.isArray(tree.grades)) ? { grades: clone(tree.grades) }
      : (tree && tree.tree && Array.isArray(tree.tree.grades)) ? { grades: clone(tree.tree.grades) }
        : null;
    if (!doc) return false;
    _ssSet(CATALOG_KEY, doc);                     // offline mirror — always
    _cache.catalog = doc;

    // Authoritative Firestore write goes through the validated callable
    // (adminSaveCatalog → siteCatalog/tree). Security rules block raw client
    // writes to siteCatalog/* (Admin SDK only), and the callable re-checks the
    // catalog invariants (grade.key, unique game ids, valid tiers) server-side —
    // exactly mirroring saveContent's adminSaveGameContent path.
    if (typeof firebase !== 'undefined' && firebase.functions) {
      try {
        await firebase.functions().httpsCallable('adminSaveCatalog')({ tree: doc });
        return true;
      } catch (e) {
        const code = (e && e.code) || '';
        // A validation rejection must surface, not silently degrade to a raw
        // write that bypasses the very check that failed.
        if (code === 'invalid-argument' || code === 'functions/invalid-argument') {
          try { console.warn('[content-source] server rejected catalog:', e && e.message); } catch (_) {}
          return false;
        }
        // Unauthenticated/unavailable/internal → SymStore mirror is the fallback.
        try { console.warn('[content-source] adminSaveCatalog unavailable:', e && e.message); } catch (_) {}
      }
    }
    // Offline / no functions: the SymStore mirror already holds it. No raw
    // Firestore fallback — siteCatalog/* is rules-locked (Admin SDK only), so a
    // direct client write would only ever fail or strand a divergent doc.
    return true;
  }

  // Local-only persistence: SymStore mirror + in-memory cache. Used for
  // reload-survival without a remote write (e.g. boot re-apply, or right after
  // the Studio's own validated callable write).
  function _persistLocal(contentId, content) {
    if (!contentId || !content) return false;
    _ssSet(contentKey(contentId), clone(content));
    _cache[contentId] = clone(content);
    return true;
  }

  async function saveContent(contentId, content) {
    if (!contentId || !content) return false;
    const doc = clone(content);
    _persistLocal(contentId, doc);               // offline mirror — always

    // Authoritative Firestore write goes through the validated callable
    // (adminSaveGameContent) — security rules block raw client writes to
    // gameContent/* for non-bootstrap admins, and the callable re-checks the
    // quiz/paradigm invariants server-side. Only eligible when the doc matches
    // the callable's contract (units[] + a known schema).
    const eligible = Array.isArray(doc.units) && (doc.schema === 'quiz' || doc.schema === 'paradigm');
    if (eligible && typeof firebase !== 'undefined' && firebase.functions) {
      try {
        await firebase.functions().httpsCallable('adminSaveGameContent')({ contentId: contentId, content: doc });
        return true;
      } catch (e) {
        const code = (e && e.code) || '';
        // A validation rejection must NOT silently fall back to a raw write
        // that bypasses the very check that failed — surface it instead.
        if (code === 'invalid-argument' || code === 'functions/invalid-argument') {
          try { console.warn('[content-source] server rejected content:', e && e.message); } catch (_) {}
          return false;
        }
        // Unauthenticated/unavailable/internal → fall through to the raw write.
        try { console.warn('[content-source] callable unavailable, raw write:', e && e.message); } catch (_) {}
      }
    }
    // Fallback: direct write (bootstrap admin, non-quiz/paradigm docs, offline).
    const db = _db();
    if (db) {
      try { await db.doc(contentKey(contentId)).set(doc, { merge: false }); } catch (_) { /* SymStore-only */ }
    }
    return true;
  }

  /* ════════════════ APPLY · catalog overlay onto SYM ═══════════ */
  // Overlay a Studio tree onto the live SYM.SUBJECTS in place, so a save shows
  // immediately on the student pages. Non-destructive: only the editable surface
  // (subject order/label/icon + game order/label/tier/add/remove) is overlaid;
  // every other field on the original tile (launch, summary, meta…) is kept.
  function applyCatalogToGRADES(tree) {
    const SYM = _sym();
    if (!tree || !Array.isArray(tree.grades) || !SYM || !SYM.SUBJECTS) return false;
    if (!_baseSnapshot) _baseSnapshot = clone(SYM.SUBJECTS);
    let touched = false;
    tree.grades.forEach(g => {
      try {
        const key = g.key;
        const baseSubs = _baseSnapshot[key];
        if (!Array.isArray(baseSubs)) return;            // unknown grade — skip
        SYM.SUBJECTS[key] = (g.subjects || []).map(ts => _applySubject(baseSubs, ts));
        touched = true;
      } catch (e) { try { console.warn('[content-source] catalog grade skip', g && g.key, e); } catch (_) {} }
    });
    return touched;
  }

  function _applySubject(baseSubs, ts) {
    const orig = baseSubs.find(s => s.id === ts.id);
    const sub = orig ? clone(orig) : { id: ts.id, games: [] };
    if (ts.label) sub.gr = ts.label;
    if (ts.labelEn) sub.en = ts.labelEn;
    sub.games = _applyGames((orig && orig.games) || [], ts.games || []);
    return sub;
  }

  // Re-build a subject's game tiles from the tree, preserving each original
  // tile's hidden fields (launch/meta/illu) where the tree node maps back to it.
  function _applyGames(origGames, treeGames) {
    const pool = (origGames || []).map(g => ({ g, used: false }));
    return (treeGames || []).map(tg => {
      let tile = null;
      // Prefer the carried launch/illu hints to re-find the original tile.
      const wantLaunch = tg._launch && tg._launch.fn;
      const hit = pool.find(p => !p.used && (
        (wantLaunch && p.g.launch && p.g.launch.fn === wantLaunch) ||
        (tg._illu && p.g.illu === tg._illu && (p.g.gr === tg.label || p.g.en === tg.labelEn)) ||
        (p.g.gr === tg.label) || (p.g.en === tg.labelEn)
      ));
      if (hit) { hit.used = true; tile = clone(hit.g); }
      if (!tile) tile = { gr: tg.label || tg.type, en: tg.labelEn || tg.label || '', meta: '', illu: tg._illu || null, launch: tg._launch || null };
      if (tg.label) tile.gr = tg.label;
      if (tg.labelEn) tile.en = tg.labelEn;
      return tile;
    });
  }

  /* ════════════════ APPLY · content onto runtime globals ═══════ */
  // Push edited trivia/quiz content into the live globals the games read, AND
  // always persist (so a reload reflects it even when the global isn't on this
  // page — synthesis loads QUESTIONS/OD_QUESTIONS inside the game iframes).
  function applyContentToGlobals(contentId, data) {
    // Mirror to SymStore for reload-survival. The authoritative remote write is
    // owned by the caller (Site Studio calls adminSaveGameContent directly), so
    // this path is local-only — no duplicate/rules-blocked Firestore write.
    try { _persistLocal(contentId, data); } catch (_) {}

    if (!data || data.schema !== 'quiz' || !Array.isArray(data.units)) return false;
    const tgt = _quizTargets(contentId);
    if (!tgt || !tgt.Q) {
      // No live global on this page — already persisted via _persistLocal above;
      // nothing more to do. (The old SYM_CONTENT_OVERRIDES mirror here had no
      // reader anywhere in js/ or games/, so it was dead — removed.)
      return false;
    }
    const Q = tgt.Q;
    Q.gr = Q.gr || {}; Q.en = Q.en || {};
    data.units.forEach(u => {
      if (!u || u.key == null) return;
      const qs = Array.isArray(u.questions) ? u.questions : [];
      Q.gr[u.key] = clone(qs);
      if (!Q.en[u.key] || Q.en[u.key].length === 0) Q.en[u.key] = clone(qs);
    });
    if (Array.isArray(tgt.R)) {
      const ks = data.units.map(u => u.key).filter(k => k !== 'all');
      tgt.R.length = 0; ks.forEach(k => tgt.R.push(k));
    }
    return true;
  }

  // Apply a persisted content override (gameContent/<id>) onto the live game
  // globals, reading the override SYNCHRONOUSLY from SymStore → cache (warmed by
  // boot's Firestore hydration). The trivia launcher calls this right after it
  // assigns the lazy-loaded banks to window.QUESTIONS and before the engine reads
  // them, so an admin's saved questions reach players on any device. Returns true
  // when an override was applied. No-op (false) when none exists ⇒ bundled banks.
  function applyLiveGameOverride(contentId) {
    if (!contentId) return false;
    let ov = _ssGet(contentKey(contentId), null);
    if (!ov || !Array.isArray(ov.units)) ov = _cache[contentId];
    if (ov && Array.isArray(ov.units)) {
      try { return applyContentToGlobals(contentId, ov); } catch (_) { return false; }
    }
    return false;
  }

  /* ════════════════ CACHE + RE-RENDER HOOKS ════════════════════ */
  function bustCache(contentId) {
    if (contentId) delete _cache[contentId]; else delete _cache.catalog;
  }

  // Re-render the live student view + the Studio panel so an edit shows now.
  function _refreshCatalogView() {
    try {
      // Re-render the student-facing SPA if its renderer is present.
      if (typeof window !== 'undefined' && typeof window.symRender === 'function') {
        window.symRender();
      }
    } catch (_) {}
    try {
      // Re-render the Studio panel itself (admin-studio exposes AdminStudio.paint).
      if (typeof window !== 'undefined' && window.AdminStudio && typeof window.AdminStudio.paint === 'function') {
        window.AdminStudio.paint();
      }
    } catch (_) {}
  }

  /* ════════════════ BOOT — apply persisted overrides on load ═══ */
  let _booted = false;
  function boot() {
    if (_booted) return; _booted = true;
    // 1) Instant — apply this device's SymStore-persisted overrides (a prior
    //    session in this browser). Synchronous, so there's no flash when present.
    try {
      const cat = _ssGet(CATALOG_KEY, null);
      if (cat && Array.isArray(cat.grades)) { _cache.catalog = cat; applyCatalogToGRADES(cat); }
    } catch (_) {}
    try {
      for (const id of ['iliada-trivia', 'odyssey-trivia']) {
        const c = _ssGet(contentKey(id), null);
        if (c && Array.isArray(c.units)) { _cache[id] = c; applyContentToGlobals(id, c); }
      }
    } catch (_) {}
    // 2) Authoritative — hydrate from Firestore for EVERY visitor, so Studio
    //    edits saved on one device reach students on any other:
    //      • catalog (siteCatalog/tree) → overlaid onto SYM.SUBJECTS, which the
    //        home page renders straight from; fetch + apply + re-render.
    //      • trivia content (gameContent/<id>) → persisted + cached so the trivia
    //        launcher can apply it onto the lazy-loaded banks at game open.
    //    (PARADIGM content is intentionally NOT delivered here: those games read
    //    bespoke per-game data.js shapes that don't match the Studio's paradigm
    //    doc — a model reconciliation, tracked separately.)
    _pollHydrate(25);
  }

  // Hydrate the catalog + trivia content from Firestore. firebase may finish init
  // after this file loads, so poll briefly — like syn-hydrate.js — then give up.
  // Fail-open throughout: offline / missing doc / not-yet-ready ⇒ the static SYM
  // seed (and bundled banks) simply stand.
  const TRIVIA_CONTENT_IDS = ['iliada-trivia', 'odyssey-trivia'];
  let _fsHydrated = false;
  function _pollHydrate(tries) {
    if (_fsHydrated) return;
    const db = _db();
    if (!db) { if (tries > 0) setTimeout(function () { _pollHydrate(tries - 1); }, 400); return; }
    _fsHydrated = true;
    // Catalog → overlay onto SYM + re-render.
    try {
      db.doc('siteCatalog/tree').get().then(function (snap) {
        if (!snap || !snap.exists) return;                 // nothing published — keep the seed
        const data = snap.data();
        if (!data || !Array.isArray(data.grades)) return;
        _ssSet(CATALOG_KEY, data);                         // warm this device for an instant next load
        _cache.catalog = data;
        if (applyCatalogToGRADES(data)) _refreshCatalogView();
      }).catch(function () { /* offline / perms — fail open */ });
    } catch (_) { /* SDK shape mismatch — fail open */ }
    // Trivia content → persist + cache for the launcher (banks are lazy-loaded,
    // so usually absent now; applyContentToGlobals applies live if a game is open).
    TRIVIA_CONTENT_IDS.forEach(function (id) {
      try {
        db.doc(contentKey(id)).get().then(function (snap) {
          if (!snap || !snap.exists) return;
          const data = snap.data();
          if (!data || !Array.isArray(data.units)) return;
          _ssSet(contentKey(id), data);
          _cache[id] = data;
          try { applyContentToGlobals(id, data); } catch (_) {}
        }).catch(function () { /* offline / perms — fail open */ });
      } catch (_) { /* SDK shape mismatch — fail open */ }
    });
  }
  function _start() {
    if (typeof document === 'undefined') { boot(); return; }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
  _start();

  // True only when an admin/teacher has actually authored content for this id
  // (a gameContent/<cid> override exists in SymStore or Firestore) — i.e. it was
  // "uploaded", as opposed to the bundled SYM seed. Used to filter the curriculum
  // picker to admin-authored content only.
  async function hasAuthored(contentId) {
    if (!contentId) return false;
    try { return !!(await _readOverride(contentKey(contentId), contentKey(contentId))); }
    catch (_) { return false; }
  }

  return {
    // loaders
    loadCatalog, loadGameContent, loadContent, hasAuthored,
    // savers
    saveCatalog, saveContent,
    // apply / live
    applyCatalogToGRADES, applyContentToGlobals, applyLiveGameOverride,
    // cache + render
    bustCache, _refreshCatalogView,
    // builders (handy for tests / future migration)
    buildCatalogFromSYM, seedContent,
  };
})();

/* ════════════════════════════════════════════════════════════
   CurriculumGate — runtime enforcement of per-class level access.
   Ported from Ver1 (paideia/js/content-source.js). Reads
   classes/{gradeKey}/curriculum/main (written by the Class Plan and
   Site Studio's «Διαθέσιμο για αυτή την τάξη» Levels & Access panel) and
   tells the leveled-game pickers in games/shared-engine.js which levels
   the browsed class may use. Fail-open: any missing doc / unconfigured
   dataset / not-yet-loaded grade ⇒ no restriction.

   NOTE: this was dropped in the synthesis content-source.js rewrite, which
   is why the Studio visibility toggle persisted but never took effect —
   admin-studio.js calls `if(window.CurriculumGate) CurriculumGate.bust(cls)`
   and shared-engine.js gates on `window.CurriculumGate`, both of which were
   permanently false. Restoring it here re-activates both call-sites.
   ════════════════════════════════════════════════════════════ */
window.CurriculumGate = (function () {
  'use strict';
  const _cache = Object.create(null);            // gradeKey -> data|null (null = no doc)
  const _db = () => (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;

  async function load(gradeKey) {
    if (!gradeKey) return null;
    if (gradeKey in _cache) return _cache[gradeKey];
    const db = _db();
    if (!db) return null;                         // firebase not ready yet — DON'T cache, allow a later retry
    _cache[gradeKey] = null;                      // in-flight marker (also the no-doc default)
    try { const s = await db.doc(`classes/${gradeKey}/curriculum/main`).get(); if (s.exists) _cache[gradeKey] = s.data(); }
    catch (_) {}
    return _cache[gradeKey];
  }
  function prefetch(gradeKey) { if (gradeKey && !(gradeKey in _cache)) load(gradeKey); }
  function bust(gradeKey) { if (gradeKey) delete _cache[gradeKey]; else Object.keys(_cache).forEach(k => delete _cache[k]); }

  // Set of allowed level ids, or null = unrestricted (don't filter).
  function allowedLevels(datasetId, gradeKey) {
    const d = _cache[gradeKey];
    if (!d || !d.datasets) return null;            // no curriculum for this grade
    const e = d.datasets[datasetId];
    if (!e) return null;                           // dataset not configured ⇒ unrestricted
    if (e.enabled === false) return new Set();     // explicitly disabled ⇒ no levels
    if (!Array.isArray(e.levels)) return null;     // no level list ⇒ unrestricted
    return new Set(e.levels);
  }
  return { load, prefetch, bust, allowedLevels };
})();
