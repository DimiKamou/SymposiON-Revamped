/* ════════════════════════════════════════════════════════════
   content-source.js — Site Studio runtime read path.
   ------------------------------------------------------------
   Cache-first Firestore with a bundled static fallback, so content
   edited in the Studio goes live WITHOUT a redeploy, while the app
   still renders offline / on first paint from the bundled JS.

     siteCatalog/tree        → the catalog (grades → subjects → games)
     gameContent/{contentId} → one game's content (quiz | paradigm)

   On boot it loads both and applies them IN PLACE:
     • quiz content   → mutates the trivia globals (QUESTIONS / RHAPSODIES,
                        OD_QUESTIONS / OD_RHAPSODIES) the engine reads;
     • catalog        → overlays editable fields (subject/​game order,
                        labels, icons, add/​remove) onto the live `GRADES`,
                        preserving every field the Studio does not edit.

   Everything is guarded — a missing doc, offline Firestore or a malformed
   payload leaves the bundled static content untouched.
   Loaded eager, right after js/data.js.
   ════════════════════════════════════════════════════════════ */
window.ContentSource = (function () {
  'use strict';

  const _cache = Object.create(null);        // { catalog, [contentId]: data }
  let _baseGRADES = null;                     // pristine snapshot of code GRADES

  const clone = o => (typeof structuredClone === 'function')
    ? structuredClone(o) : JSON.parse(JSON.stringify(o));
  const _db = () => (typeof firebase !== 'undefined' && firebase.firestore)
    ? firebase.firestore() : null;

  // ── trivia banks the Studio can edit (quiz schema) ──────────
  // The engine reads (window.QUESTIONS || QUESTIONS); odyssey swaps
  // window.QUESTIONS at launch. We mutate the const objects in place so
  // BOTH the bare-const read and the window swap observe the override.
  function _quizTargets(contentId) {
    if (contentId === 'iliada-trivia' && typeof QUESTIONS !== 'undefined')
      return { Q: QUESTIONS, R: (typeof RHAPSODIES !== 'undefined' ? RHAPSODIES : null) };
    if (contentId === 'odyssey-trivia' && typeof OD_QUESTIONS !== 'undefined')
      return { Q: OD_QUESTIONS, R: (typeof OD_RHAPSODIES !== 'undefined' ? OD_RHAPSODIES : null) };
    return null;
  }

  // ── static fallbacks (built lazily from the bundled globals) ─
  function staticContent(contentId) {
    const tgt = _quizTargets(contentId);
    if (tgt) return _quizDocFromGlobals(tgt);
    return null;
  }

  // Project the live QUESTIONS/RHAPSODIES globals → a quiz content doc.
  function _quizDocFromGlobals(tgt) {
    const order = (tgt.R && tgt.R.length) ? tgt.R.slice() : [];
    const keys  = Object.keys(tgt.Q.gr || tgt.Q.en || {});
    // keep RHAPSODIES order first, then any extra keys (e.g. 'all')
    keys.forEach(k => { if (!order.includes(k)) order.push(k); });
    const units = order
      .filter(k => (tgt.Q.gr && tgt.Q.gr[k]) || (tgt.Q.en && tgt.Q.en[k]))
      .map(k => ({
        key: k, label: k,
        questions: clone((tgt.Q.gr && tgt.Q.gr[k]) || (tgt.Q.en && tgt.Q.en[k]) || []),
        texts: [],
      }));
    return { schema: 'quiz', unitWord: 'Ραψωδία', unitWordEn: 'Rhapsody', units };
  }

  // ── apply a quiz doc onto the live trivia globals (in place) ─
  function applyContentToGlobals(contentId, data) {
    const tgt = _quizTargets(contentId);
    if (!tgt || !data || data.schema !== 'quiz' || !Array.isArray(data.units)) return false;
    const Q = tgt.Q;
    Q.gr = Q.gr || {}; Q.en = Q.en || {};
    // Replace the keyed question sets the doc carries (Greek-authored model);
    // mirror to English only where English is currently empty, so existing
    // English banks are preserved.
    data.units.forEach(u => {
      if (!u || u.key == null) return;
      const qs = Array.isArray(u.questions) ? u.questions : [];
      Q.gr[u.key] = clone(qs);
      if (!Q.en[u.key] || Q.en[u.key].length === 0) Q.en[u.key] = clone(qs);
    });
    // Rebuild RHAPSODIES order (unit order, minus the 'all' pool) in place.
    if (tgt.R) {
      const ks = data.units.map(u => u.key).filter(k => k !== 'all');
      tgt.R.length = 0; ks.forEach(k => tgt.R.push(k));
    }
    return true;
  }

  // ════════ CATALOG ════════════════════════════════════════════
  // Project the code `GRADES` → the Studio tree shape. Faithful: ids,
  // labels, icons and the extraGames list (the editable cards). Featured
  // and the Ιλιάδα default-trivia card are marked sys:true (shown but not
  // reordered/removed by the live overlay — they render from data.js).
  function buildCatalogFromData() {
    if (typeof GRADES === 'undefined') return { grades: [] };
    const grades = Object.keys(GRADES).map(key => {
      const g = GRADES[key];
      const containers = g.subjects
        ? [{ subjects: g.subjects }]
        : (g.tracks || []).map(tr => ({ track: tr.title, subjects: tr.subjects || [] }));
      const subjects = [];
      containers.forEach(c => (c.subjects || []).forEach(s => {
        const games = [];
        if (s.featuredGame) {
          const ft = s.featuredGame.type;
          games.push({ id: `${s.id}~feat~${ft}`, sys: true, type: ft,
            label: (s.title || '') + ' (featured)', labelEn: (s.en && s.en.title) || '',
            ic: s.icon || '⭐', tier: 'free', content: _contentIdFor(ft) });
        }
        (s.extraGames || []).forEach((eg, i) => games.push({
          id: `${s.id}~x${i}~${eg.type}`, srcType: eg.type, type: eg.type,
          label: eg.label || eg.type, labelEn: (eg.en && eg.en.label) || '',
          ic: eg.icon || '🎮', tier: 'free', content: _contentIdFor(eg.type),
        }));
        if (s.id === 'iliada') games.push({ id: `${s.id}~trivia`, sys: true, type: 'trivia',
          label: 'Ιλιάδα Trivia', labelEn: 'Iliad Trivia', ic: '🏆', tier: 'free', content: 'iliada-trivia' });
        subjects.push({ id: s.id, icon: s.icon || '📘', label: s.title || s.id,
          labelEn: (s.en && s.en.title) || '', track: c.track || null, games });
      }));
      return { key, label: g.title || g.label || key,
        cycle: g.parent || '', hasTracks: !!g.tracks, subjects };
    });
    return { grades };
  }

  // Map an editable game `type` → its gameContent id. Quiz banks apply
  // LIVE (the engine reads the override); paradigm games (e.g. lat-nouns)
  // are editable + persisted, but the live game reading gameContent is a
  // documented follow-up (needs a per-game adapter — see the migration).
  const _CONTENT_BY_TYPE = {
    'odyssey-trivia': 'odyssey-trivia', 'lat-nouns': 'lat-nouns',
    'aoristos-b': 'aoristos-b', 'afwnolekta': 'afwnolekta',
    'rimata-mi': 'rimata-mi', 'synirimmena': 'synirimmena',
    'nouns': 'ousiastika', 'klisi-epitheton': 'epitheta', 'eimi': 'eimi',
    'anwmala-rimata': 'anwmala-rimata', 'lat-epitheta': 'lat-epitheta',
    'antonymies': 'antonymies', 'lat-verbs': 'lat-verbs', 'lat-antonymies': 'lat-antonymies',
    'pathitiko': 'pathitiko', 'paratheta': 'paratheta',
  };
  function _contentIdFor(type) { return _CONTENT_BY_TYPE[type] || null; }

  // Overlay a Studio tree onto the live GRADES in place. Only the editable
  // surface (non-track grades): subject order/label/icon + extraGames
  // order/label/icon/add/remove. Everything else (desc, bg, featured,
  // tracks) is preserved from the pristine base. Per-grade try/catch so a
  // bad node can never break the whole catalog.
  function applyCatalogToGRADES(tree) {
    if (!tree || !Array.isArray(tree.grades) || typeof GRADES === 'undefined') return false;
    if (!_baseGRADES) _baseGRADES = clone(GRADES);
    let touched = false;
    tree.grades.forEach(tg => {
      try {
        const key = tg.key, base = _baseGRADES[key], live = GRADES[key];
        if (!base || !live) return;
        const treeSubs = tg.subjects || [];
        if (base.tracks) {
          // Track grade (e.g. Β΄/Γ΄ Λυκείου): rebuild each track's subjects from
          // the tree (matched by `track` title); added subjects (no track) go to
          // the first track so they render and launch live.
          const byTrack = {}; const added = [];
          treeSubs.forEach(ts => {
            if (ts.track) (byTrack[ts.track] = byTrack[ts.track] || []).push(ts);
            else if (_findBaseSubject(base, ts.id)) (byTrack['_'] = byTrack['_'] || []).push(ts);
            else added.push(ts);
          });
          live.tracks = base.tracks.map((bt, i) => {
            let subs = (byTrack[bt.title] || []).map(ts => _applySubject(base, ts));
            if (i === 0) subs = subs.concat((byTrack['_'] || []).map(ts => _applySubject(base, ts)),
                                            added.map(ts => _newSubject(ts)));
            return Object.assign({}, bt, { subjects: subs });
          });
        } else {
          live.subjects = treeSubs.map(ts => _applySubject(base, ts));
        }
        touched = true;
      } catch (e) { console.warn('[content-source] catalog grade skip', tg && tg.key, e); }
    });
    return touched;
  }

  function _findBaseSubject(base, id) {
    if (base.subjects) { const s = base.subjects.find(x => x.id === id); if (s) return s; }
    if (base.tracks) { for (const t of base.tracks) { const s = (t.subjects || []).find(x => x.id === id); if (s) return s; } }
    return null;
  }
  function _applySubject(base, ts) {
    const orig = _findBaseSubject(base, ts.id);
    if (orig) {
      const sub = clone(orig);
      if (ts.label)   sub.title = ts.label;
      if (ts.icon)    sub.icon  = ts.icon;
      if (ts.labelEn) sub.en = Object.assign({}, sub.en, { title: ts.labelEn });
      sub.extraGames = _mergeGames(orig.extraGames || [], ts.games || []);
      return sub;
    }
    return _newSubject(ts);
  }

  function _mergeGames(origExtra, treeGames) {
    const pool = (origExtra || []).map(g => ({ g, used: false }));
    const out = [];
    (treeGames || []).filter(g => !g.sys).forEach(tg => {
      let card = null;
      if (tg.srcType != null) {
        const hit = pool.find(p => !p.used && p.g.type === tg.srcType);
        if (hit) { hit.used = true; card = clone(hit.g); }
      }
      if (!card) card = { type: tg.type, icon: tg.ic || '🎮', label: tg.label || tg.type,
        desc: '', en: { label: tg.labelEn || tg.label || tg.type, desc: '' },
        _studioContent: tg.content || null };
      if (tg.label)   card.label = tg.label;
      if (tg.ic)      card.icon  = tg.ic;
      if (tg.labelEn) card.en = Object.assign({}, card.en, { label: tg.labelEn });
      out.push(card);
    });
    return out;
  }

  function _newSubject(ts) {
    return { id: ts.id, title: ts.label || ts.id, icon: ts.icon || '📘',
      bg: 'linear-gradient(135deg,#1a1208,#4a3010)',
      desc: '', count: (ts.games || []).filter(g => !g.sys).length,
      en: { title: ts.labelEn || ts.label || ts.id, desc: '' },
      extraGames: _mergeGames([], ts.games || []) };
  }

  // ════════ LOADERS (cache-first Firestore → static) ══════════
  async function loadCatalog(force) {
    if (_cache.catalog && !force) return _cache.catalog;
    const db = _db();
    if (db) {
      try {
        const snap = await db.doc('siteCatalog/tree').get();
        if (snap.exists && Array.isArray(snap.data().grades))
          return (_cache.catalog = snap.data());
      } catch (e) { /* offline / perms — fall through to static */ }
    }
    return (_cache.catalog = buildCatalogFromData());
  }

  async function loadGameContent(contentId, force) {
    if (!contentId) return null;
    if (_cache[contentId] && !force) return _cache[contentId];
    const db = _db();
    if (db) {
      try {
        const snap = await db.doc('gameContent/' + contentId).get();
        if (snap.exists && Array.isArray(snap.data().units))
          return (_cache[contentId] = snap.data());
      } catch (e) { /* fall through */ }
    }
    return (_cache[contentId] = staticContent(contentId));
  }

  function bustCache(contentId) {
    if (contentId) delete _cache[contentId]; else delete _cache.catalog;
  }

  // ════════ BOOT — load + apply once Firebase is ready ════════
  let _booted = false;
  async function boot() {
    if (_booted) return; _booted = true;
    if (typeof GRADES !== 'undefined' && !_baseGRADES) _baseGRADES = clone(GRADES);
    // 1. catalog overlay (skips entirely if Firestore has no tree yet)
    try {
      const db = _db();
      if (db) {
        const snap = await db.doc('siteCatalog/tree').get();
        if (snap.exists && Array.isArray(snap.data().grades)) {
          _cache.catalog = snap.data();
          if (applyCatalogToGRADES(snap.data())) _refreshCatalogView();
        }
      }
    } catch (e) { console.warn('[content-source] catalog boot', e); }
    // 2. quiz content for the bundled trivia banks
    for (const id of ['iliada-trivia', 'odyssey-trivia']) {
      try {
        const data = await loadGameContent(id);
        if (data) applyContentToGlobals(id, data);
      } catch (e) { /* keep static */ }
    }
  }

  // Re-render the current grade/subject page so a live catalog edit shows
  // immediately (best-effort; safe no-ops if the user is elsewhere).
  function _refreshCatalogView() {
    try {
      const onSubject = document.getElementById('page-subject');
      const onGrade   = document.getElementById('page-grade');
      if (onSubject && onSubject.classList.contains('active') &&
          typeof currentGradeKey !== 'undefined' && typeof currentSubjectId !== 'undefined' &&
          currentGradeKey && currentSubjectId && typeof navToSubject === 'function') {
        navToSubject(currentGradeKey, currentSubjectId);
      } else if (onGrade && onGrade.classList.contains('active') &&
          typeof currentGradeKey !== 'undefined' && currentGradeKey && typeof navToGrade === 'function') {
        navToGrade(currentGradeKey);
      }
    } catch (_) {}
  }

  // Boot AFTER the DOM is parsed — this guarantees the bundled game scripts
  // further down index.html (QUESTIONS / OD_QUESTIONS at ~line 4560) have run,
  // so applyContentToGlobals has its targets — then wait for Firebase.
  function _start() {
    (function _waitFirebase(tries) {
      if (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length) { boot(); return; }
      if (tries > 120) return;               // ~6s; give up, stay static
      setTimeout(() => _waitFirebase(tries + 1), 50);
    })(0);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _start);
  else _start();

  return {
    loadCatalog, loadGameContent, bustCache,
    buildCatalogFromData, applyCatalogToGRADES, applyContentToGlobals,
    staticContent, _refreshCatalogView,
  };
})();

/* ════════════════════════════════════════════════════════════
   CurriculumGate — runtime enforcement of per-class level access.
   Reads classes/{gradeKey}/curriculum/main (written by the Class Plan
   and Site Studio's Levels & Access panel) and tells the leveled-game
   pickers which levels the browsed class may use. Fail-open: any missing
   doc / unconfigured dataset / not-yet-loaded grade ⇒ no restriction.
   ════════════════════════════════════════════════════════════ */
window.CurriculumGate = (function () {
  'use strict';
  const _cache = Object.create(null);            // gradeKey -> data|null (null = no doc)
  const _db = () => (typeof firebase !== 'undefined' && firebase.firestore) ? firebase.firestore() : null;

  async function load(gradeKey) {
    if (!gradeKey) return null;
    if (gradeKey in _cache) return _cache[gradeKey];
    _cache[gradeKey] = null;                      // in-flight marker (also the no-doc default)
    const db = _db();
    if (db) {
      try { const s = await db.doc(`classes/${gradeKey}/curriculum/main`).get(); if (s.exists) _cache[gradeKey] = s.data(); }
      catch (_) {}
    }
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

/* ════════════════════════════════════════════════════════════
   Inline "✎ Edit" — an admin-only floating button on subject/grade
   pages that jumps straight into Site Studio for the lesson you're on
   (so you don't navigate the admin tree manually).
   ════════════════════════════════════════════════════════════ */
window.studioEditHere = function () {
  const g = (typeof currentGradeKey   !== 'undefined') ? currentGradeKey   : null;
  const s = (typeof currentSubjectId  !== 'undefined') ? currentSubjectId  : null;
  window.__studioPending = { grade: g, subject: s };
  if (typeof navToAdmin === 'function') navToAdmin();   // lazy-loads + opens Command Center
  let n = 0;
  const iv = setInterval(() => {                          // once Studio is loaded, jump to it
    if (window.AdminStudio && typeof ccGoDom === 'function') { clearInterval(iv); try { ccGoDom('site'); } catch (_) {} }
    else if (++n > 60) clearInterval(iv);
  }, 80);
};

(function _studioEditFab() {
  function ensure() {
    let b = document.getElementById('studio-edit-fab');
    if (!b) {
      b = document.createElement('button');
      b.id = 'studio-edit-fab'; b.type = 'button';
      b.title = 'Edit this lesson in Site Studio'; b.setAttribute('aria-label', 'Edit in Site Studio');
      b.innerHTML = '✎';
      b.onclick = () => window.studioEditHere();
      b.style.cssText = 'position:fixed;right:18px;bottom:18px;z-index:9000;width:50px;height:50px;'
        + 'border-radius:50%;border:1px solid rgba(201,164,74,.55);background:#1b1611;color:#D4AE58;'
        + 'font-size:21px;cursor:pointer;box-shadow:0 6px 18px rgba(0,0,0,.45);display:none;'
        + 'align-items:center;justify-content:center;transition:transform .15s,background .15s';
      b.onmouseenter = () => { b.style.transform = 'scale(1.08)'; b.style.background = '#241d15'; };
      b.onmouseleave = () => { b.style.transform = 'scale(1)';    b.style.background = '#1b1611'; };
      document.body.appendChild(b);
    }
    return b;
  }
  function tick() {
    const admin = (typeof isAdmin !== 'undefined' && isAdmin) || window.isAdmin;
    if (!admin) { const ex = document.getElementById('studio-edit-fab'); if (ex) ex.style.display = 'none'; return; }
    const onEditable = ['page-subject', 'page-grade', 'page-trivia'].some(id => {
      const el = document.getElementById(id); return el && el.classList.contains('active');
    });
    ensure().style.display = onEditable ? 'flex' : 'none';
  }
  const start = () => setInterval(tick, 600);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
