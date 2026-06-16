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

  /* ── Firestore adapter (the swap point) ─────────────────────────────────
     Off by default. To go multi-device: set ISTORIA.useRemote = true after a
     firebase app is initialised. Stores the editable slice per course at
     game_data/istoria:<course>. */
  const remote = {
    async load(course){
      if (!window.firebase || !firebase.firestore) return null;
      try{
        const snap = await firebase.firestore().collection('game_data').doc('istoria:'+course).get();
        return snap.exists ? (snap.data().content || null) : null;
      }catch(_){ return null; }
    },
    async save(course, editable){
      if (!window.firebase || !firebase.firestore) return false;
      try{
        await firebase.firestore().collection('game_data').doc('istoria:'+course)
          .set({ content:editable, updatedAt: Date.now() }, { merge:true });
        return true;
      }catch(_){ return false; }
    },
  };

  const ISTORIA = {
    COURSES, resolveCourse, courseInfo, listCourses,
    getPack, getUnits, getMeta, getMethods, getModeData, hasAnyData,
    getItems, setItems, exportJSON, importJSON, reset,
    getDir, setDir,
    useRemote:false, remote,
  };
  window.ISTORIA = ISTORIA;
})();
