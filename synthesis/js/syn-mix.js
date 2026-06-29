/* ════════════════════════════════════════════════════════════════════
   SymposiON — syn-mix.js · MULTI-SELECT CONTENT MIXER  (Phase 2)
   --------------------------------------------------------------------
   A reusable "combined bank" builder for the engine-game setup screen.
   A student picks a grammar MATERIAL (dataset) + MANY of its levels;
   SymMix turns that selection into one merged question bank shaped for
   the live engines:

        { q:{gr,en}|string , a:[…options…] , c:correctIndex }

   This is the SAME shape js/syn-questions.js seeds into
   window.SYM_QUESTIONS (read by Heptapylos, agora, oracle, …) and the
   paideia shape Agora Surfers' adapter accepts ({q, a:[…], correct}).

   It NEVER touches the existing single-pick grammar launch path
   (synLaunch(fn, levelId, group)) — it is an additive injection layer.

   Public API (window.SymMix):
     bank(datasetId, levelIds)  → Promise<Array<MCItem>>  (always resolves)
     materials()                → [{ id, label }]   datasets pairable here
     ENGINE_INJECTION           → metadata map (see js/screens.js)

   Design notes / data facts this relies on (verified in the repo):
   • GP_LEVEL_PROVIDERS[ds] exposes EITHER generator(id)=>[{q,opts,ans}]
     (lyo) OR filterRaw(rawDB, ids)=>filteredRawDB  (everything else).
   • The raw DB for a filterRaw dataset lives behind GP_CONTENT.find(ds)
     .loader(), but the underlying global (AOB_G, ANT_DB, …) only exists
     AFTER that dataset's data.js is lazy-loaded — so bank() ensures the
     data file is loaded first (idempotent via lazyLoad's cache).
   • _gpNormalizeQuestions(rawDB, ds) → [{q:str, a:str, options:[], hint}]
     (fill-in shape; options frequently empty). We up-convert each into a
     4-option MC item, synthesizing distractors from OTHER answers in the
     same merged bank when the source carries none — so MC-only engines
     (which drop items with < 2 options) still receive a usable set.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Map each filterRaw dataset → the data.js file(s) that define its raw-DB
  // global. Loading these is what makes GP_CONTENT.find(ds).loader() return
  // real data instead of null on the setup screen (before the game opens).
  // (Mirrors the `js` arrays in js/manifest/grammar-greek.js / grammar-latin.js.)
  var DATA_FILES = {
    'aoristos-b':    ['games/aoristos-b/data.js'],
    'synirimmena':   ['games/synirimmena/data.js'],
    'afwnolekta':    ['games/afwnolekta/data.js'],
    'rimata-mi':     ['games/rimata-mi/data.js'],
    'ousiastika':    ['games/ousiastika/data.js'],
    'antonymies':    ['games/antonymies/data.js'],
    'epitheta':      ['games/epitheta/data.js'],
    'lat-nouns':     ['games/lat-nouns/data.js'],
    'lat-epitheta':  ['games/lat-epitheta/data.js'],
    'lat-antonymies':['games/lat-antonymies/data.js'],
    'lat-verbs':     ['games/lat-verbs/data.js'],
    // lyo is generator-based, but the generator (_gpLyoGenQuestions) lives in the
    // game file — load it so the universal picker can host Λύω.
    'lyo':            ['games/lyo/game.js'],
    // trivia banks: the loader reads QUESTIONS / OD_QUESTIONS, defined in these
    // question files (lazy-loaded so the universal picker can host them too).
    'iliada-trivia':  ['games/iliada-trivia/questions.js'],
    'odyssey-trivia': ['games/odyssey-trivia/questions.js']
  };

  // Lazy-load a dataset's backing code (generator game file / raw-DB data file)
  // so its loader/generator is defined before we call it. Idempotent.
  function _ensureData(id) {
    var files = DATA_FILES[id];
    if (!files || typeof window.lazyLoad !== 'function') return Promise.resolve();
    return window.lazyLoad(files).then(function () {}, function () {});
  }

  function _provider(datasetId) {
    return (window.GP_LEVEL_PROVIDERS && window.GP_LEVEL_PROVIDERS[datasetId]) || null;
  }

  // Resolve the raw DB for a filterRaw dataset, loading its data file first
  // if the global isn't present yet. Resolves to the rawDB (or null).
  function _rawDB(datasetId) {
    function read() {
      try {
        var rec = (window.GP_CONTENT && window.GP_CONTENT.find && window.GP_CONTENT.find(datasetId))
          || (window.GP_DATASETS && window.GP_DATASETS.find
              ? (Array.isArray(window.GP_DATASETS) ? window.GP_DATASETS.filter(function (d) { return d.id === datasetId; })[0] : null)
              : null);
        if (rec && typeof rec.loader === 'function') return rec.loader();
      } catch (_) {}
      return null;
    }
    var db = read();
    if (db != null) return Promise.resolve(db);
    var files = DATA_FILES[datasetId];
    if (!files || typeof window.lazyLoad !== 'function') return Promise.resolve(db);
    return window.lazyLoad(files).then(read, function () { return null; });
  }

  // ── normalizer-output → MC item up-conversion ──────────────────────
  // Input items are the _gpNormalizeQuestions shape: {q:str, a:str, options:[], hint}.
  // Output is the engine MC shape: {q:{gr,en}, a:[…≤4…], c:idx}. When an item
  // carries no real distractors we pull plausible wrong answers from the pool
  // of OTHER correct answers (same merged bank → same morphological family).
  function _shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function _toMC(normItems) {
    var items = (normItems || []).filter(function (x) { return x && x.q != null && x.a != null && String(x.a).length; });
    // Pool of all distinct correct answers → distractor source.
    var answerPool = [];
    var seenA = Object.create(null);
    items.forEach(function (x) {
      var a = String(x.a);
      if (!seenA[a]) { seenA[a] = 1; answerPool.push(a); }
    });
    return items.map(function (x) {
      var correct = String(x.a);
      // Start from any options the source already provided (deduped, non-empty).
      var opts = [];
      var seen = Object.create(null);
      function push(v) {
        v = (v == null ? '' : String(v)).trim();
        if (!v || seen[v]) return;
        seen[v] = 1; opts.push(v);
      }
      push(correct);
      (Array.isArray(x.options) ? x.options : []).forEach(push);
      // Top up to 4 with distractors drawn from other answers in the bank.
      if (opts.length < 4 && answerPool.length > 1) {
        var pool = _shuffle(answerPool);
        for (var i = 0; i < pool.length && opts.length < 4; i++) push(pool[i]);
      }
      // Shuffle so the correct answer isn't always first, then find its index.
      var shuffled = opts.length > 1 ? _shuffle(opts) : opts;
      var c = shuffled.indexOf(correct);
      if (c < 0) { shuffled.unshift(correct); c = 0; }   // safety: correct must be present
      var qText = (x.q && typeof x.q === 'object') ? x.q : { gr: String(x.q), en: String(x.q) };
      var item = { q: qText, a: shuffled.slice(0, 4), c: Math.min(c, 3) };
      if (item.c > 3) { item.a[3] = correct; item.c = 3; }   // keep correct in the kept slice
      return item;
    }).filter(function (it) { return it.a.length >= 2; });
  }

  // ── universal raw → MC ─────────────────────────────────────────────
  // Non-grammar datasets (trivia banks, published teacher quizzes, curriculum)
  // expose questions through GP_CONTENT.find(id).loader(). Those come in a few
  // shapes — a flat array of {q,opts/a,ans/correct}, OR a language→category pool
  // ({gr:{cat:[…]}, en:{…}}). Flatten + normalize to the engine MC shape.
  function _flattenPool(raw) {
    if (Array.isArray(raw)) return raw;
    if (raw && typeof raw === 'object') {
      if (Array.isArray(raw.questions)) return raw.questions;
      var lang = (typeof window.siteLang !== 'undefined' && window.siteLang === 'en') ? 'en' : 'gr';
      var pool = raw[lang] || raw.gr || raw.en || raw;
      var out = [];
      Object.keys(pool || {}).forEach(function (k) {
        var v = pool[k];
        if (Array.isArray(v)) out = out.concat(v);
      });
      return out;
    }
    return [];
  }
  function _anyToMC(raw) {
    return _flattenPool(raw).map(function (x) {
      if (!x) return null;
      var opts = x.opts || x.a || x.options || [];
      if (!Array.isArray(opts) || opts.length < 2) return null;
      var ans = (typeof x.ans === 'number') ? x.ans
              : (typeof x.c === 'number') ? x.c
              : (typeof x.correct === 'number') ? x.correct
              : (x.correct != null ? opts.map(String).indexOf(String(x.correct)) : 0);
      if (ans < 0 || ans >= opts.length) ans = 0;
      var qRaw = (x.q != null) ? x.q : (x.question != null ? x.question : '');
      var qText = (qRaw && typeof qRaw === 'object') ? qRaw
        : { gr: String(qRaw).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(),
            en: String(qRaw).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() };
      return { q: qText, a: opts.map(String).slice(0, 4), c: Math.min(ans, 3) };
    }).filter(Boolean);
  }

  // Normalize a generator item ({q, opts, ans}) to the engine MC shape.
  function _genItemToMC(g) {
    if (!g) return null;
    var opts = (g.opts || g.a || g.options || []).map(function (o) { return String(o); });
    if (!opts.length) return null;
    var ans = typeof g.ans === 'number' ? g.ans
            : typeof g.correct === 'number' ? g.correct : 0;
    ans = Math.min(Math.max(ans | 0, 0), opts.length - 1);
    var qText = (g.q && typeof g.q === 'object') ? g.q : { gr: String(g.q == null ? '' : g.q), en: String(g.q == null ? '' : g.q) };
    return { q: qText, a: opts.slice(0, 4), c: Math.min(ans, 3) };
  }

  // ── public: bank(datasetId, levelIds) → Promise<Array<MCItem>> ──────
  function bank(datasetId, levelIds) {
    var ids = Array.isArray(levelIds) ? levelIds : (levelIds != null ? [levelIds] : []);
    return _ensureData(datasetId).then(function () {
      var prov = _provider(datasetId);

      // GENERATOR path (lyo): build per-id question lists and concat. Default to
      // every level when none are passed (whole-dataset host).
      if (prov && typeof prov.generator === 'function') {
        var useIds = ids.length ? ids : _allLevelIds(datasetId);
        var out = [];
        useIds.forEach(function (id) {
          var g = null;
          try { g = prov.generator(id); } catch (_) { g = null; }
          if (Array.isArray(g)) g.forEach(function (item) { var mc = _genItemToMC(item); if (mc) out.push(mc); });
        });
        return out;
      }

      // FILTER-RAW path: subset the raw DB, normalize → up-convert to MC.
      if (prov && typeof prov.filterRaw === 'function') {
        var useIds2 = ids.length ? ids : _allLevelIds(datasetId);
        return _rawDB(datasetId).then(function (rawDB) {
          try {
            if (rawDB == null) return [];
            var filtered = prov.filterRaw(rawDB, useIds2);
            var norm = (typeof window._gpNormalizeQuestions === 'function')
              ? (window._gpNormalizeQuestions(filtered, datasetId) || []) : [];
            return _toMC(norm);
          } catch (_) { return []; }
        }, function () { return []; });
      }

      // LOADER path (trivia / published quizzes / curriculum): no provider.
      return _loaderBank(datasetId);
    }).catch(function () { return []; });
  }

  // ── non-grammar (trivia / published quizzes / curriculum) bank ─────
  // No GP_LEVEL_PROVIDERS entry: pull questions from GP_CONTENT.find(id).loader()
  // (lazy-loading the dataset's data file first if we know it), normalise to MC.
  function _loaderBank(datasetId) {
    var rec = (window.GP_CONTENT && window.GP_CONTENT.find && window.GP_CONTENT.find(datasetId)) || null;
    if (!rec || typeof rec.loader !== 'function') return Promise.resolve([]);
    function read() { try { return rec.loader(); } catch (_) { return null; } }
    var raw = read();
    if (raw != null) return Promise.resolve(_anyToMC(raw));
    // try lazy-loading a known data file, then re-read
    var files = DATA_FILES[datasetId];
    if (!files || typeof window.lazyLoad !== 'function') return Promise.resolve([]);
    return window.lazyLoad(files).then(function () { return _anyToMC(read()); }, function () { return []; });
  }

  // ── public: bankMulti(selections) → Promise<Array<MCItem>> ─────────
  // selections: [{ id, levelIds? }]. Builds each dataset's bank, concatenates,
  // de-dups by question text, and shuffles so mixed sources interleave.
  function bankMulti(selections) {
    var sels = (selections || []).filter(function (s) { return s && s.id; });
    if (!sels.length) return Promise.resolve([]);
    return Promise.all(sels.map(function (s) {
      return bank(s.id, (s.levelIds && s.levelIds.length) ? s.levelIds : _allLevelIds(s.id)).catch(function () { return []; });
    })).then(function (banks) {
      var out = [], seen = Object.create(null);
      banks.forEach(function (b) {
        (b || []).forEach(function (it) {
          var key = (it.q && (it.q.gr || it.q.en)) || JSON.stringify(it.q);
          if (key && seen[key]) return;
          if (key) seen[key] = 1;
          out.push(it);
        });
      });
      return _shuffle(out);
    });
  }
  function _allLevelIds(datasetId) {
    var prov = _provider(datasetId);
    return (prov && prov.levels) ? prov.levels.map(function (l) { return l.id; }) : [];
  }

  // ── public: catalog() → grouped, hostable universal ύλη list ───────
  // Mirrors GP_CONTENT.groups() but keeps only datasets we can actually turn
  // into a question bank, and tags each with its access state for the picker.
  function catalog() {
    try {
      var groups = (window.GP_CONTENT && typeof window.GP_CONTENT.groups === 'function')
        ? window.GP_CONTENT.groups() : [];
      var out = [];
      groups.forEach(function (g) {
        var items = (g.items || []).filter(_hostable).map(function (d) {
          var prov = _provider(d.id);
          return {
            id: d.id, label: d.label || d.id, meta: d.meta || '', icon: d.icon || '◆',
            tier: d.tier || 'free', source: d.source, isNew: !!d.isNew,
            leveled: !!(prov && prov.levels && prov.levels.length),
            levels: (prov && prov.levels) ? prov.levels : null,
            locked: !_canAccess(d.tier)
          };
        });
        if (items.length) out.push({ group: g.group, items: items });
      });
      return out;
    } catch (_) { return []; }
  }
  // A dataset is hostable if it has a working grammar provider OR a loader that
  // can yield questions (teacher quizzes carry them inline; trivia/grammar have
  // known data files; cloud-only loaders that return null are skipped).
  function _hostable(d) {
    if (!d || !d.id) return false;
    var prov = _provider(d.id);
    if (prov && prov.levels && prov.levels.length) {
      if (typeof prov.generator === 'function') {
        try { if (Array.isArray(prov.generator(prov.levels[0].id))) return true; } catch (_) {}
        return !!DATA_FILES[d.id];   // generator's code is lazy-loadable
      }
      return typeof prov.filterRaw === 'function';
    }
    if (typeof d.loader !== 'function') return false;
    try { if (d.loader() != null) return true; } catch (_) {}
    return !!DATA_FILES[d.id];   // loadable on demand
  }
  function _canAccess(tier) {
    if (typeof window.isAdmin !== 'undefined' && window.isAdmin) return true;
    if (typeof window._gpCanAccessTier === 'function') { try { return window._gpCanAccessTier(tier || 'free'); } catch (_) {} }
    var role = (typeof window.currentUserRole !== 'undefined') ? window.currentUserRole : 'free';
    if (!tier || tier === 'free') return true;
    if (tier === 'student') return role === 'student' || role === 'teacher';
    if (tier === 'teacher') return role === 'teacher';
    return false;
  }

  // ── public: materials() → [{id,label}] ─────────────────────────────
  // The grammar datasets a student can pair with an engine: leveled, with a
  // real provider (generator OR filterRaw) carrying selectable levels.
  function materials() {
    var out = [];
    try {
      var provs = window.GP_LEVEL_PROVIDERS || {};
      var all = (window.GP_CONTENT && typeof window.GP_CONTENT.all === 'function')
        ? window.GP_CONTENT.all()
        : (Array.isArray(window.GP_DATASETS) ? window.GP_DATASETS : []);
      all.forEach(function (d) {
        if (!d || !d.id || !d.leveled) return;
        var prov = provs[d.id];
        if (!prov || !prov.levels || !prov.levels.length) return;
        var hasBuilder = (typeof prov.generator === 'function') || (typeof prov.filterRaw === 'function');
        if (!hasBuilder) return;
        // generator datasets need the generator to actually exist (lyo's
        // _gpLyoGenQuestions is provided by nav.js in Ver1; absent here).
        if (typeof prov.generator === 'function') {
          var probe = null;
          try { probe = prov.generator(prov.levels[0].id); } catch (_) { probe = null; }
          if (!Array.isArray(probe)) return;   // generator not wired → skip
        } else if (!DATA_FILES[d.id]) {
          // filterRaw dataset we don't know how to load → skip (would yield []).
          return;
        }
        out.push({ id: d.id, label: d.label || d.id });
      });
    } catch (_) {}
    return out;
  }

  // ── per-engine injection metadata (consumed by js/screens.js) ──────
  // mode 'config'   → engine takes a config arg: synLaunch(fn, {questions, title})
  //                   (paideia {q,a:[],c} shape is accepted by these engines).
  // mode 'sym'      → engine reads window.SYM_QUESTIONS at open; we snapshot &
  //                   restore around the launch (mirrors the HEP_Q pattern).
  // closeFn is the engine's teardown global to wrap for restore (mode 'sym').
  var ENGINE_INJECTION = {
    openAgoraSurfers: { mode: 'config' },
    openTempleRun:    { mode: 'config' },
    openHeptapylos:   { mode: 'sym', closeFn: 'closeHeptapylos' },
    openNaumachia:    { mode: 'sym', closeFn: 'closeNaumachia' },
    openPhalanx:      { mode: 'sym', closeFn: 'closePhalanx' },
    openRapidFire:    { mode: 'sym', closeFn: 'closeRapidFire' },
    openDig:          { mode: 'sym', closeFn: 'closeDig' },
    // ── coverage extension: quiz-driven engines that read window.SYM_QUESTIONS ──
    openMnemosyne:    { mode: 'sym', closeFn: 'closeMnemosyne' },
    openGoldenFleece: { mode: 'sym', closeFn: 'closeGoldenFleece' },
    openHalieia:      { mode: 'sym', closeFn: 'closeHalieia' },
    openHegemonia:    { mode: 'sym', closeFn: 'closeHegemonia' },
    openToxotes:      { mode: 'sym', closeFn: 'closeToxotes' },
    openAgora:        { mode: 'sym', closeFn: 'closeAgora' },
    openDiscus:       { mode: 'sym', closeFn: 'closeDiscus' },
    openKrypteia:     { mode: 'sym', closeFn: 'closeKrypteia' },
    // ── config-mode engines taught to read cfg.questions (own data source) ──
    openTow:          { mode: 'config' },
    openBlade:        { mode: 'config', closeFn: 'closeBlade' }
  };

  window.SymMix = {
    bank: bank,
    bankMulti: bankMulti,
    materials: materials,
    catalog: catalog,
    ENGINE_INJECTION: ENGINE_INJECTION,
    // exposed for tests / reuse
    _toMC: _toMC
  };
})();
