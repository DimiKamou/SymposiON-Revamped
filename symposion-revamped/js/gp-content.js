/* ============================================================
   gp-content.js  —  Engine Configurator content discovery
   ------------------------------------------------------------
   SINGLE source of truth for the configurator's content list.
   Replaces the hand-maintained GP_DATASETS array: merges
     (1) in-code datasets (grammar + Homer + Latin), ported 1:1
         from the old GP_DATASETS rows (loader/tier/leveled kept),
     (2) the data.js GRADES curriculum (real class → subject),
     (3) Firestore published packs (config/datasets + custom_games),
   and groups them: "Γραμματική" first, then thematic / class groups.

   Load EAGERLY, before nav.js.  Back-compat: window.GP_DATASETS is
   kept as a LIVE view of the registry array, so every remaining
   `GP_DATASETS.find(...)` caller (initGameWithData, _renderTheoryLibrary,
   navToStudy, QR-challenge restore) keeps working unchanged.

   A dataset object:
     { id, label, meta, subject?, classKey?, classLabel?, category, icon, tier,
       leveled?, levelsGlobal?, source:'grammar'|'curriculum'|'cloud'|'teacher',
       isNew?, loader(levelId) }
   ============================================================ */
window.GP_CONTENT = (function () {
  'use strict';

  const _reg = [];                 // all registered datasets (live array)
  const byId = Object.create(null);

  function registerDataset(d) {
    if (!d || !d.id) return;
    if (byId[d.id]) {              // re-register overwrites (cloud refresh)
      Object.assign(byId[d.id], d);
    } else {
      byId[d.id] = d;
      _reg.push(d);
    }
    return byId[d.id];
  }
  const find = (id) => byId[id] || null;
  const all  = () => _reg.slice();

  // ── 1. IN-CODE DATASETS (ported 1:1 from the old nav.js GP_DATASETS) ──
  //  IMPORTANT: keep loader / tier / leveled / levelsGlobal / meta / label
  //  byte-identical to the old rows so the launch cfg is unchanged.
  function _registerInCode() {
    // Αρχαία Ελληνική Γραμματική → group "Γραμματική"
    const GRAMMAR = [
      { id:'lyo',            icon:'🏛️', label:'Ρήμα: Λύω',              meta:'Αρχαία Ελληνικά · Κλίση Ρημάτων · 32 επίπεδα', tier:'free',    leveled:true,  levelsGlobal:'LYO_LVL',    loader:(levelId)=>_gpLyoGenQuestions(levelId || 23, 25) },
      { id:'eimi',           icon:'⚡',  label:'Ρήμα: Εἰμί',            meta:'Αρχαία Ελληνικά · Ανώμαλα Ρήματα',             tier:'free',    leveled:false, loader:()=>(typeof EIMI_PARADIGM!=='undefined'?EIMI_PARADIGM:null) },
      { id:'aoristos-b',     icon:'⏳',  label:'Αόριστος Β΄',           meta:'Αρχαία Ελληνικά · Χρόνοι Ρημάτων',             tier:'free',    leveled:true,  levelsGlobal:'AOB_LEVELS', loader:()=>(typeof AOB_G!=='undefined'?AOB_G:null) },
      { id:'synirimmena',    icon:'🔀',  label:'Συνηρημένα Ρήματα',     meta:'Αρχαία Ελληνικά · -άω / -έω / -όω',            tier:'free',    leveled:true,  levelsGlobal:'SYN_LEVELS', loader:()=>(typeof SYN_G!=='undefined'?SYN_G:null) },
      { id:'anwmala-rimata', icon:'🌀',  label:'Ανώμαλα Ρήματα',        meta:'Αρχαία Ελληνικά · Αρχικοί Χρόνοι',             tier:'free',    leveled:false, loader:()=>(typeof ARV_DB!=='undefined'?ARV_DB:null) },
      { id:'afwnolekta',     icon:'📝',  label:'Αφωνόληκτα Ρήματα',     meta:'Αρχαία Ελληνικά · Χαρακτηριστικά Θέματα',      tier:'free',    leveled:true,  levelsGlobal:'AFW_LEVELS', loader:()=>(typeof AFW_G!=='undefined'?AFW_G:null) },
      { id:'ousiastika',     icon:'📜',  label:'Κλίση Ουσιαστικών',     meta:'Αρχαία Ελληνικά · Α΄ Β΄ Γ΄ Κλίση',            tier:'free',    leveled:true,  levelsGlobal:'OUS_LEVELS', loader:()=>(typeof OUS_DB!=='undefined'?OUS_DB:null) },
      { id:'antonymies',     icon:'👤',  label:'Κλίση Αντωνυμιών',      meta:'Αρχαία Ελληνικά · 19 Επίπεδα',                 tier:'free',    leveled:true,  levelsGlobal:'ANT_LEVELS', loader:()=>(typeof ANT_DB!=='undefined'?ANT_DB:null) },
      { id:'klisi-rimaton',  icon:'🎚️', label:'Κλίση Ρημάτων (Πλήρης)',meta:'Αρχαία Ελληνικά · Όλες οι Εγκλίσεις',          tier:'student', leveled:false, loader:()=>(typeof KR_DB!=='undefined'?KR_DB:null) },
      { id:'rimata-mi',      icon:'🧪',  label:'Ρήματα σε -μι',         meta:'Αρχαία Ελληνικά · Αθεματικά Ρήματα',           tier:'student', leveled:true,  levelsGlobal:'RMI_LEVELS', loader:()=>(typeof RMI_G!=='undefined'?RMI_G:null) },
    ];
    GRAMMAR.forEach(d => registerDataset(Object.assign({ category:'Γραμματική', source:'grammar', type:'practice' }, d)));

    // Ομηρική Ποίηση
    const HOMER = [
      { id:'iliada-trivia',  icon:'⚔️',  label:'Ιλιάδα Trivia',          meta:'Β΄ Γυμνασίου · Επίπεδα 1–3',       tier:'free',    loader:()=>(typeof QUESTIONS!=='undefined'?QUESTIONS:null) },
      { id:'odyssey-trivia', icon:'🌊',  label:'Οδύσσεια Trivia',        meta:'Α΄ Γυμνασίου · Ραψωδίες & Ήρωες',  tier:'free',    loader:()=>(typeof OD_QUESTIONS!=='undefined'?OD_QUESTIONS:null) },
      { id:'iliada-deep',    icon:'⚔️',  label:'Ιλιάδα — Γλώσσα & Ύφος', meta:'Β΄ Γυμνασίου · Επίπεδα 4–5',       tier:'student', loader:()=>null /* Firestore game_data fallback */ },
    ];
    HOMER.forEach(d => registerDataset(Object.assign({ category:'Ομηρική Ποίηση', source:'grammar', type:'practice' }, d)));

    // Λατινικά
    const LATIN = [
      { id:'lat-nouns',    icon:'🏺',  label:'Λατινικά Ουσιαστικά', meta:'Λατινικά · Κλίση Ουσιαστικών', tier:'student', leveled:true, levelsGlobal:'LATN_LEVELS', loader:()=>(typeof LAT_N_DB!=='undefined'?LAT_N_DB:null) },
      { id:'lat-verbs',    icon:'📋',  label:'Λατινικά Ρήματα',     meta:'Λατινικά · Κλίση Ρημάτων',     tier:'student', loader:()=>(typeof LAT_V_DB!=='undefined'?LAT_V_DB:null) },
      { id:'lat-epitheta', icon:'✨',  label:'Λατινικά Επίθετα',    meta:'Λατινικά · Κλίση Επιθέτων',    tier:'student', leveled:true, levelsGlobal:'LATE_LEVELS', loader:()=>(typeof LAT_A_DB!=='undefined'?LAT_A_DB:null) },
      { id:'lat-antonymies', icon:'👤', label:'Λατινικές Αντωνυμίες', meta:'Λατινικά · Κλίση Αντωνυμιών',  tier:'student', loader:()=>(typeof LAT_P_DB!=='undefined'?LAT_P_DB:null) },
    ];
    LATIN.forEach(d => registerDataset(Object.assign({ category:'Λατινικά', source:'grammar', type:'practice' }, d)));
  }

  // ── 2. CURRICULUM from data.js GRADES (trivia/theory, tagged by class) ──
  // Map game `type` → dataset descriptor. Extend TRIVIA_MAP as you add banks.
  // Anything already registered above is skipped (dedupe), so this only adds
  // NEW content banks reached from GRADES — making new subjects auto-appear.
  const TRIVIA_MAP = {
    'odyssey-trivia': { icon:'🌊',  tier:'free', loader:()=>(typeof OD_QUESTIONS!=='undefined'?OD_QUESTIONS:null) },
    'iliada-trivia':  { icon:'⚔️', tier:'free', loader:()=>(typeof QUESTIONS!=='undefined'?QUESTIONS:null) },
    'history-game':   { icon:'🗺️', tier:'free', loader:()=>null /* Firestore game_data fallback */ },
    // add future trivia types here, or publish them via Firestore (§3) for zero-code.
  };
  function _registerCurriculum() {
    if (typeof GRADES === 'undefined') return;
    Object.keys(GRADES).forEach(gKey => {
      const grade = GRADES[gKey];
      const clsLabel = grade.title || grade.label || gKey;
      // GRADES rows can hold subjects directly or under tracks[].subjects
      const subjects = [].concat(
        grade.subjects || [],
        (grade.tracks || []).reduce((a, t) => a.concat(t.subjects || []), [])
      );
      subjects.forEach(subj => {
        const games = [].concat(subj.games || [], subj.extraGames || []);
        games.forEach(g => {
          const t = g.type;
          if (!TRIVIA_MAP[t]) return;           // only known content banks, not engines
          const dsId = t;                        // dataset id == bank id
          if (byId[dsId]) return;                // already registered (don't dupe)
          registerDataset(Object.assign({
            id: dsId,
            label: (g.label || subj.title || dsId),
            meta: (g.desc || subj.desc || ''),
            subject: subj.title,
            classKey: gKey,
            classLabel: clsLabel,
            category: clsLabel,
            source: 'curriculum',
          }, TRIVIA_MAP[t]));
        });
      });
    });
  }

  // ── 3. FIRESTORE published content (async; merged on modal open) ──
  let _cloudLoaded = false;
  async function loadCloud(force) {
    if (_cloudLoaded && !force) return;
    if (typeof firebase === 'undefined' || !firebase.firestore) { _cloudLoaded = true; return; }
    const db = firebase.firestore();
    try {
      // 3a. Official manifest: config/datasets = { items:[{id,label,classKey,subject,tier,leveled,icon}] }
      const man = await db.collection('config').doc('datasets').get();
      if (man.exists) {
        (man.data().items || []).forEach(it => registerDataset(Object.assign({
          category: it.classLabel || _gradeLabel(it.classKey) || it.classKey || 'Δημοσιευμένα',
          source: 'cloud', isNew: true,
          loader: () => null,            // initGameWithData falls back to game_data/{id}
        }, it)));
      }
    } catch (e) { console.warn('[gp-content] datasets manifest:', e); }
    try {
      // 3b. Teacher quizzes published to the library (see builder.js §5)
      const snap = await db.collection('custom_games').where('published', '==', true).get();
      snap.forEach(doc => {
        const d = doc.data() || {};
        registerDataset({
          id: 'cg:' + doc.id,
          label: d.title || 'Κουίζ',
          meta: ((d.questions || []).length) + ' ερωτήσεις',
          subject: d.subject || null,
          classKey: d.classKey || null,
          category: d.classLabel || _gradeLabel(d.classKey) || 'Δημοσιευμένα',
          icon: '✏️', tier: 'free', source: 'teacher', isNew: true,
          _customDoc: Object.assign({ id: doc.id }, d),
          loader: () => (d.questions || null),   // already MC-shaped
        });
      });
    } catch (e) { console.warn('[gp-content] custom_games:', e); }
    try {
      // 3c. Admin tier overrides (set via Subs → Lock & Unlock in the curator's console)
      const gt = await db.collection('config').doc('game-tiers').get();
      if (gt.exists) {
        const overrides = gt.data().tiers || {};
        Object.keys(overrides).forEach(id => { if (byId[id]) byId[id].tier = overrides[id]; });
      }
    } catch (e) { console.warn('[gp-content] game-tiers:', e); }
    _cloudLoaded = true;
  }
  function _gradeLabel(key) {
    return (typeof GRADES !== 'undefined' && GRADES[key]) ? (GRADES[key].title || GRADES[key].label) : null;
  }

  // ── grouping: Γραμματική → Homer → Latin → classes (GRADES order) → published ──
  function _classOrder() {
    if (typeof GRADES === 'undefined') return [];
    return Object.keys(GRADES).map(_gradeLabel).filter(Boolean);
  }
  function groups() {
    const order = ['Γραμματική', 'Ομηρική Ποίηση', 'Λατινικά', ..._classOrder(), 'Δημοσιευμένα'];
    const map = new Map();
    _reg.forEach(d => {
      const k = d.category || 'Δημοσιευμένα';
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(d);
    });
    const out = [];
    const seen = new Set();
    order.forEach(k => { if (map.has(k) && !seen.has(k)) { out.push({ group:k, items:map.get(k) }); seen.add(k); } });
    map.forEach((items, k) => { if (!seen.has(k)) out.push({ group:k, items }); }); // any extras
    return out;
  }

  // init (synchronous sources). Call loadCloud() from openEngineConfigurator.
  _registerInCode();
  _registerCurriculum();

  // back-compat: a LIVE array view so old `GP_DATASETS.find(...)` keeps working.
  try { window.GP_DATASETS = _reg; } catch (_) {}

  return { registerDataset, find, all, groups, loadCloud };
})();
