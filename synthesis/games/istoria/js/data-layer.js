/* ════════════════════════════════════════════════════════════════════
   data-layer.js — window.ISTORIA content store
   The single seam between the UI and where content lives. Today: seed packs
   (js/content/*.js → window.ISTORIA_CONTENT) with a localStorage overlay for
   admin edits, plus JSON import/export. Swap to a backend by implementing the
   Firestore adapter at the bottom and setting ISTORIA.useRemote = true — no UI
   changes required.

   Course registry maps every history entry in the site to a content pack:
     g3     → Ιστορία Κατεύθυνσης (Β΄ & Γ΄ Λυκείου)   [real content, AI-graded]
     gym-a/b/c, lyk-a → topic scaffolds (fill via admin)
   ════════════════════════════════════════════════════════════════════ */
(function(){
  const CONTENT = (window.ISTORIA_CONTENT = window.ISTORIA_CONTENT || {});

  const COURSES = {
    'g3':    { pack:'g3',    label:'Ιστορία Κατεύθυνσης' },
    'gym-a': { pack:'gym-a', label:'Ιστορία Α΄ Γυμνασίου' },
    'gym-b': { pack:'gym-b', label:'Ιστορία Β΄ Γυμνασίου' },
    'gym-c': { pack:'gym-c', label:'Ιστορία Γ΄ Γυμνασίου' },
    'lyk-a': { pack:'lyk-a', label:'Ιστορία Α΄ Λυκείου' },
  };
  // back-compat with history-game.html's ?grade= values
  const GRADE_ALIAS = { gymA:'gym-a', gymB:'gym-b', gymC:'gym-c', 'gym-a':'gym-a', 'gym-b':'gym-b', 'gym-c':'gym-c', 'lyk-a':'lyk-a' };

  const clone = (o)=> (typeof structuredClone==='function') ? structuredClone(o) : JSON.parse(JSON.stringify(o));
  const KEY   = (course)=> 'istoria-content:'+course;

  /* ── course resolution from URL ─────────────────────────────────────── */
  function resolveCourse(search){
    const p = new URLSearchParams(search || (location && location.search) || '');
    let c = p.get('course');
    if (!c){ const g = p.get('grade'); if (g) c = GRADE_ALIAS[g] || null; }
    if (!c || !COURSES[c]) c = 'g3';
    return c;
  }
  function courseInfo(course){ return COURSES[course] || COURSES.g3; }
  function listCourses(){ return Object.keys(COURSES); }

  /* ── seed pack (immutable source) ───────────────────────────────────── */
  function seedPack(course){
    const packId = courseInfo(course).pack;
    return CONTENT[packId] || null;
  }

  /* ── localStorage overlay (admin edits) ─────────────────────────────── */
  function overlay(course){
    try{ const s = localStorage.getItem(KEY(course)); return s ? JSON.parse(s) : null; }catch(_){ return null; }
  }
  function persist(course, editable){
    try{ localStorage.setItem(KEY(course), JSON.stringify(editable)); }catch(_){}
    if (ISTORIA.useRemote) ISTORIA.remote.save(course, editable).catch(()=>{});
  }

  /* The editable slice of a pack = { data, methods }. units/meta stay in seed. */
  function editableFromSeed(course){
    const s = seedPack(course) || { data:{}, methods:{} };
    return { data: clone(s.data||{}), methods: clone(s.methods||{}) };
  }

  /* ── merged pack the UI consumes ────────────────────────────────────── */
  function getPack(course){
    const seed = seedPack(course);
    if (!seed) return null;
    const ov = overlay(course);
    return {
      meta:  seed.meta || {},
      units: seed.units || [],
      data:    ov && ov.data    ? ov.data    : clone(seed.data || {}),
      methods: ov && ov.methods ? ov.methods : clone(seed.methods || {}),
    };
  }

  function getUnits(course){ const p = getPack(course); return p ? p.units : []; }
  function getMeta(course){ const p = getPack(course); return p ? p.meta : {}; }
  function getMethods(course){ const p = getPack(course); return p ? p.methods : {}; }
  function getModeData(course, unitId, mode){
    const p = getPack(course); if (!p) return mode==='vid' ? null : [];
    const u = p.data[unitId] || {};
    return u[mode] != null ? u[mode] : (mode==='vid' ? null : []);
  }
  function hasAnyData(course){
    const p = getPack(course); if (!p) return false;
    return p.units.some(u=>{ const d=p.data[u.id]||{}; return ['mc','fc','match','tl','tf','fib'].some(m=>(d[m]||[]).length); });
  }

  /* ── admin CRUD (operates on the localStorage overlay) ──────────────── */
  function _editable(course){ return overlay(course) || editableFromSeed(course); }
  function getItems(course, unitId, type){
    const e = _editable(course); return ((e.data[unitId]||{})[type]) || [];
  }
  function setItems(course, unitId, type, arr){
    const e = _editable(course);
    e.data[unitId] = e.data[unitId] || {};
    e.data[unitId][type] = arr;
    persist(course, e);
  }
  function exportJSON(course){
    const e = _editable(course);
    return JSON.stringify({ course, exportedAt:new Date().toISOString(), content:e }, null, 2);
  }
  function importJSON(course, text){
    const parsed = JSON.parse(text);
    const e = parsed.content || parsed;            // accept either shape
    if (!e.data) throw new Error('bad shape');
    persist(course, { data:e.data, methods:e.methods || _editable(course).methods });
    return true;
  }
  function reset(course){ try{ localStorage.removeItem(KEY(course)); }catch(_){} }

  /* ── theme direction (single root switch, persisted) ────────────────── */
  const DIR_KEY = 'istoria-dir';
  function getDir(fallback){ try{ return localStorage.getItem(DIR_KEY) || fallback || 'dir-atlas'; }catch(_){ return fallback||'dir-atlas'; } }
  function setDir(d){ try{ localStorage.setItem(DIR_KEY, d); }catch(_){} }

  /* ── Firestore adapter (the swap point — now live) ──────────────────────
     Persists the editable slice { data, methods } per course at
     historyContent/<course> via the validated callable
     adminSaveHistoryContent (Admin-SDK write; client rules deny direct
     writes). Reads are world-readable so students on any device get the
     admin's latest pack. The localStorage overlay stays as the immediate
     local cache AND the offline fallback. useRemote auto-enables whenever
     the Firebase SDK is present; when it isn't (e.g. the game's index.html
     loads no Firebase), everything degrades to localStorage + seed. */
  /* Resolve the Firebase SDK. This file runs both standalone and inside the
     synthesis app as a SAME-ORIGIN iframe — the game's own index.html ships no
     Firebase, but the parent shell does, so fall back to window.parent.firebase.
     That lets the student-facing game page hydrate cloud content (and carries
     the signed-in owner's auth for the admin save) without bundling the SDK. */
  function _fb(){
    try{ if (typeof firebase !== 'undefined' && firebase) return firebase; }catch(_){}
    try{ if (window.parent && window.parent !== window && window.parent.firebase) return window.parent.firebase; }catch(_){ /* cross-origin */ }
    return null;
  }

  const remote = {
    // load → return the stored editable slice ({data,methods}) or null.
    async load(course){
      const fb = _fb();
      if (!fb || !fb.firestore) return null;
      try{
        const snap = await fb.firestore().doc('historyContent/'+course).get();
        if (!snap.exists) return null;
        const d = snap.data() || {};
        return { data: d.data || {}, methods: d.methods || {} };
      }catch(_){ return null; }
    },
    // save → write via the validated callable. Returns the callable's promise.
    save(course, editable){
      const fb = _fb();
      if (!fb || !fb.functions){
        return Promise.reject(new Error('firebase-unavailable'));
      }
      return fb.functions()
        .httpsCallable('adminSaveHistoryContent')({ course, content: editable })
        .then(res => (res && res.data) || { ok:true });
    },
  };

  /* ── async hydrate ──────────────────────────────────────────────────────
     Pull the latest pack from Firestore into the localStorage overlay so the
     SYNC getPack() callers immediately see the admin's saved content, then
     fire the re-render hook (ISTORIA.onHydrate) if a page registered one.
     Safe to call on any page: no-op when remote is off / unavailable, and it
     never throws. Existing sync callers are untouched — they keep reading the
     overlay, which hydrate simply refreshes from the cloud. */
  function hydrate(course){
    course = course || resolveCourse();
    if (!ISTORIA.useRemote) return Promise.resolve(false);
    return remote.load(course).then(slice=>{
      if (slice && (slice.data || slice.methods)){
        const base = _editable(course);
        const merged = {
          data:    slice.data    || base.data    || {},
          methods: slice.methods || base.methods || {},
        };
        try{ localStorage.setItem(KEY(course), JSON.stringify(merged)); }catch(_){}
        if (typeof ISTORIA.onHydrate === 'function'){
          try{ ISTORIA.onHydrate(course); }catch(_){}
        }
        return true;
      }
      return false;
    }).catch(()=>false);
  }

  const ISTORIA = {
    COURSES, resolveCourse, courseInfo, listCourses,
    getPack, getUnits, getMeta, getMethods, getModeData, hasAnyData,
    getItems, setItems, exportJSON, importJSON, reset,
    getDir, setDir,
    // Multi-device: on whenever Firebase is reachable (own page or parent shell).
    useRemote: (function(){ var fb = _fb(); return !!(fb && fb.firestore); })(),
    remote, hydrate, onHydrate:null,
  };
  window.ISTORIA = ISTORIA;

  /* Auto-hydrate on load for any page that ships Firebase (e.g. an embedded
     shell). Pages without the SDK skip this and run from localStorage + seed.
     Admin/game boots can also call ISTORIA.hydrate(course) explicitly. */
  if (ISTORIA.useRemote){
    try{ hydrate(resolveCourse()); }catch(_){}
  }
})();
