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
     saveCatalog(tree)      → SymStore['studio_catalog'] (+ guarded Firestore
                              config/catalog) — survives reload.
     saveContent(cid, doc)  → SymStore['gameContent/<cid>'] (+ guarded
                              Firestore gameContent/<cid>).

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
      content: ct ? ct.content : null,
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
    const ov = await _readOverride(CATALOG_KEY, 'config/catalog');
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
    _ssSet(CATALOG_KEY, doc);
    _cache.catalog = doc;
    const db = _db();
    if (db) {
      try { await db.doc('config/catalog').set(doc, { merge: false }); } catch (_) { /* SymStore-only */ }
    }
    return true;
  }

  async function saveContent(contentId, content) {
    if (!contentId || !content) return false;
    const doc = clone(content);
    _ssSet(contentKey(contentId), doc);
    _cache[contentId] = doc;
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
    // Always persist first — guarantees reload-survival.
    try { saveContent(contentId, data); } catch (_) {}

    if (!data || data.schema !== 'quiz' || !Array.isArray(data.units)) return false;
    const tgt = _quizTargets(contentId);
    if (!tgt || !tgt.Q) {
      // No live global on this page — mirror into a generic question store the
      // engines can fall back to, then we're done (persisted above).
      try {
        if (typeof window !== 'undefined') {
          window.SYM_CONTENT_OVERRIDES = window.SYM_CONTENT_OVERRIDES || Object.create(null);
          window.SYM_CONTENT_OVERRIDES[contentId] = clone(data);
        }
      } catch (_) {}
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
    // Apply a persisted catalog override onto SYM so the student pages reflect
    // prior Studio edits immediately on load.
    try {
      const cat = _ssGet(CATALOG_KEY, null);
      if (cat && Array.isArray(cat.grades)) { _cache.catalog = cat; applyCatalogToGRADES(cat); }
    } catch (_) {}
    // Apply persisted trivia content overrides onto any live globals.
    try {
      for (const id of ['iliada-trivia', 'odyssey-trivia']) {
        const c = _ssGet(contentKey(id), null);
        if (c && Array.isArray(c.units)) { _cache[id] = c; applyContentToGlobals(id, c); }
      }
    } catch (_) {}
  }
  function _start() {
    if (typeof document === 'undefined') { boot(); return; }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
  _start();

  return {
    // loaders
    loadCatalog, loadGameContent, loadContent,
    // savers
    saveCatalog, saveContent,
    // apply / live
    applyCatalogToGRADES, applyContentToGlobals,
    // cache + render
    bustCache, _refreshCatalogView,
    // builders (handy for tests / future migration)
    buildCatalogFromSYM, seedContent,
  };
})();
