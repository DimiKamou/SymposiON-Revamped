/* ════════════════════════════════════════════════════════════
   admin-studio.js — Site Studio (production)
   ------------------------------------------------------------
   Navigate & edit the whole site without touching code:
     Grades → Subjects → Games → Game content (Units · Texts) → Questions
                                           ↳ Paradigm tables (Λύω, declensions…)

   Port of the prototype cc-studio.js + cc-studio-paradigm.js, rewired to:
     • read the catalog/content from Firestore via window.ContentSource
       (cache-first, bundled-static fallback);
     • persist every change through the validated, audited Cloud Functions
       adminSaveCatalog / adminSaveGameContent (debounced, whole-doc);
     • mount inside the Command Center as the `studio` view (admin-cc.js
       delegates VIEWS.studio → window.AdminStudio).

   No direct Firestore writes — the functions enforce RBAC + the
   quiz/paradigm invariants the client cannot be trusted to keep.
   ════════════════════════════════════════════════════════════ */
(function () {
'use strict';

const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const clone = o => (typeof structuredClone === 'function')
  ? structuredClone(o) : JSON.parse(JSON.stringify(o));
const tierBadge = t => `<span class="st-badge ${esc(t)}">${esc(t)}</span>`;

// ── game-type registry (ported from cc-studio-data.js) ──────────
const GAME_TYPES = [
  { type:'trivia',        ic:'🏆', label:'Trivia & Tug of War',     kind:'trivia'  },
  { type:'iliada-arcade', ic:'⚔️', label:'Arcade (action)',         kind:'arcade'  },
  { type:'epic-puzzle',   ic:'📋', label:'Χρονολόγιο (sequencer)',   kind:'puzzle'  },
  { type:'myth-memory',   ic:'🃏', label:'Memory (pairs)',           kind:'memory'  },
  { type:'rapid-fire',    ic:'⚡', label:'Καταιγισμός (rapid)',       kind:'trivia'  },
  { type:'naumachia',     ic:'⚓', label:'Ναυμαχία (naval PvP)',      kind:'trivia'  },
  { type:'phalanx',       ic:'🛡️', label:'Φάλαγγα (strategy)',        kind:'trivia'  },
  { type:'temple-run',    ic:'🏛️', label:'Temple Run (endless)',      kind:'arcade'  },
  { type:'labyrinth',     ic:'🌀', label:'Λαβύρινθος (maze)',         kind:'trivia'  },
  { type:'dig',           ic:'⛏️', label:'Ανασκαφή (dig)',            kind:'trivia'  },
  { type:'history-game',  ic:'🗺️', label:'Εξάσκηση — 7 Modes',        kind:'trivia'  },
  { type:'flashcards',    ic:'📇', label:'Μνημοσύνη (study)',         kind:'study'   },
  { type:'conjugation',   ic:'⚡', label:'Κλίση Ρημάτων (paradigm)',  kind:'paradigm'},
  { type:'declension',    ic:'📐', label:'Κλίση Ονομάτων (paradigm)', kind:'paradigm'},
];
const gameType = t => GAME_TYPES.find(x => x.type === t) || { type:t, ic:'🎮', label:t, kind:'arcade' };

// ── paradigm starter seeds (admin-only fallback when Firestore is empty
//    and there is no quiz static — replaced by the migration scripts) ──
const PE = (lemma, meta, cells) => ({ lemma, meta, cells });
const PU = (key, label, rowAxis, colAxis, entries) => ({ key, label, rowAxis, colAxis, entries });
const PERSONS  = ['α΄ ενικ.','β΄ ενικ.','γ΄ ενικ.','α΄ πληθ.','β΄ πληθ.','γ΄ πληθ.'];
const LAT_CASES = ['Nominative','Genitive','Dative','Accusative','Vocative','Ablative'];
const GR_CASES  = ['Ονομαστική','Γενική','Δοτική','Αιτιατική','Κλητική'];
const STUDIO_SEED = {
  'lyo': { schema:'paradigm', unitWord:'Χρόνος', unitWordEn:'Tense', units:[
    PU('pres-act','Ενεστώτας · Ενεργητική Φωνή', PERSONS,
      ['Οριστική','Υποτακτική','Ευκτική','Προστακτική'], [ PE('λύω','ομαλό ρήμα σε -ω',[
        ['λύω','λύω','λύοιμι','—'],['λύεις','λύῃς','λύοις','λῦε'],['λύει','λύῃ','λύοι','λυέτω'],
        ['λύομεν','λύωμεν','λύοιμεν','—'],['λύετε','λύητε','λύοιτε','λύετε'],
        ['λύουσι(ν)','λύωσι(ν)','λύοιεν','λυόντων'] ]) ]),
  ]},
  'aoristos-b': { schema:'paradigm', unitWord:'Έγκλιση', unitWordEn:'Mood', units:[
    PU('ind-act','Αόριστος Β΄ · Οριστική Ενεργητικής', PERSONS, ['βάλλω','λαμβάνω','λείπω'],
      [ PE('Αόριστος Β΄','3 ρήματα με ανώμαλο θέμα',[
        ['ἔβαλον','ἔλαβον','ἔλιπον'],['ἔβαλες','ἔλαβες','ἔλιπες'],['ἔβαλε(ν)','ἔλαβε(ν)','ἔλιπε(ν)'],
        ['ἐβάλομεν','ἐλάβομεν','ἐλίπομεν'],['ἐβάλετε','ἐλάβετε','ἐλίπετε'],['ἔβαλον','ἔλαβον','ἔλιπον'] ]) ]),
  ]},
  'ousiastika': { schema:'paradigm', unitWord:'Κλίση', unitWordEn:'Declension', units:[
    PU('a','Α΄ Κλίση', GR_CASES, ['Ενικός','Πληθυντικός'], [
      PE('ἡ χώρα','θηλυκό',[['χώρα','χῶραι'],['χώρας','χωρῶν'],['χώρᾳ','χώραις'],['χώραν','χώρας'],['χώρα','χῶραι']]),
      PE('ὁ ταμίας','αρσενικό',[['ταμίας','ταμίαι'],['ταμίου','ταμιῶν'],['ταμίᾳ','ταμίαις'],['ταμίαν','ταμίας'],['ταμία','ταμίαι']]) ]),
  ]},
  'lat-nouns': { schema:'paradigm', unitWord:'Κλίση', unitWordEn:'Declension', units:[
    PU('1','Α΄ Κλίση (1st)', LAT_CASES, ['Singular','Plural'], [
      PE('puella, -ae','θηλυκό',[['puella','puellae'],['puellae','puellarum'],['puellae','puellis'],['puellam','puellas'],['puella','puellae'],['puella','puellis']]) ]),
    PU('2','Β΄ Κλίση (2nd)', LAT_CASES, ['Singular','Plural'], [
      PE('dominus, -i','αρσενικό',[['dominus','domini'],['domini','dominorum'],['domino','dominis'],['dominum','dominos'],['domine','domini'],['domino','dominis']]) ]),
  ]},
  'lat-verbs': { schema:'paradigm', unitWord:'Χρόνος', unitWordEn:'Tense', units:[
    PU('pres','Praesens · Indicativus Activi', ['1 sg','2 sg','3 sg','1 pl','2 pl','3 pl'], ['amo (1)','moneo (2)'],
      [ PE('Praesens','δύο συζυγίες',[['amo','moneo'],['amas','mones'],['amat','monet'],['amamus','monemus'],['amatis','monetis'],['amant','monent']]) ]),
  ]},
};

// ── working model + nav state ───────────────────────────────────
const M = { tree: { grades: [] }, content: Object.create(null), curriculum: Object.create(null), loadingCid: null, ready: false };
const S = { grade:null, subject:null, game:null, unit:null, tab:'units', section:null };

// ── accessors ───────────────────────────────────────────────────
const grade    = key => M.tree.grades.find(g => g.key === key);
const subject  = (gk, sid) => { const g = grade(gk); return g && g.subjects.find(s => s.id === sid); };
const gameNode = (gk, sid, gid) => { const s = subject(gk, sid); return s && s.games.find(x => x.id === gid); };
const gameData = cid => (cid && M.content[cid]) || null;
function gmContent() { const g = gameNode(S.grade, S.subject, S.game); return g && g.content; }

// ════════ persistence (debounced → validated Cloud Functions) ═══
let _catTimer = null; const _contentTimers = Object.create(null);
function _callable(name) { return firebase.functions().httpsCallable(name); }

function scheduleCatalogSave() { _status('saving'); clearTimeout(_catTimer); _catTimer = setTimeout(doSaveCatalog, 800); }
function scheduleContentSave(cid) {
  if (!cid) return; _status('saving');
  clearTimeout(_contentTimers[cid]); _contentTimers[cid] = setTimeout(() => doSaveContent(cid), 800);
}

async function doSaveCatalog() {
  try {
    await _callable('adminSaveCatalog')({ tree: { grades: M.tree.grades } });
    // live-apply so the underlying student catalog reflects the edit now
    try {
      if (window.ContentSource) {
        ContentSource.bustCache();
        ContentSource.applyCatalogToGRADES({ grades: M.tree.grades });
        ContentSource._refreshCatalogView();
      }
    } catch (_) {}
    _status('saved');
  } catch (e) { _status('error', _errMsg(e)); }
}

async function doSaveContent(cid) {
  const content = M.content[cid];
  if (!content) return;
  try {
    await _callable('adminSaveGameContent')({ contentId: cid, content });
    try {
      if (window.ContentSource) {
        ContentSource.bustCache(cid);
        ContentSource.applyContentToGlobals(cid, content);  // live for trivia banks
      }
    } catch (_) {}
    _status('saved');
  } catch (e) { _status('error', _errMsg(e)); }
}
const _errMsg = e => (e && (e.message || e.details)) || 'Save failed';

// audit() in the prototype just logged; here it ALSO routes the right
// debounced save based on the action target encoded in the string.
function audit(action) {
  try { console.debug('[studio]', action); } catch (_) {}
  if (/studio\.(subject|game)\b/.test(action) || /reorder · (subj|game)\b/.test(action)) {
    scheduleCatalogSave();
  } else {
    scheduleContentSave(gmContent());
  }
}

function _status(state, msg) {
  const el = document.getElementById('st-status'); if (!el) return;
  if (state === 'saving') { el.className = 'st-status saving'; el.textContent = '↻ Saving…'; }
  else if (state === 'saved') { el.className = 'st-status ok'; el.textContent = '✓ Saved'; setTimeout(() => { if (el.textContent === '✓ Saved') { el.className = 'st-status idle'; el.textContent = ''; } }, 1800); }
  else if (state === 'error') { el.className = 'st-status err'; el.textContent = '⚠ ' + (msg || 'Save failed'); if (window.ccToast) ccToast(msg || 'Save failed', 'danger'); }
  else { el.className = 'st-status idle'; el.textContent = ''; }
}

// ════════ render ════════════════════════════════════════════════
function paint() {
  const panel = document.getElementById('cc-panel');
  if (panel) panel.innerHTML = view();
}
window.AdminStudio = {
  view: () => view(),
  init: () => { boot(); },
  paint,
};

function boot() {
  // Deep-link target from the inline "✎ Edit" button (studioEditHere), else root.
  const pend = window.__studioPending; window.__studioPending = null;
  S.grade = (pend && pend.grade) || null;
  S.subject = (pend && pend.subject) || null;
  S.game = S.unit = null; S.tab = 'units'; S.section = null;
  if (!window.ContentSource) {
    const p = document.getElementById('cc-panel');
    if (p) p.innerHTML = `<div class="cc-note">Site Studio needs <code>js/content-source.js</code> — not loaded.</div>`;
    return;
  }
  ContentSource.loadCatalog().then(cat => {
    M.tree = { grades: clone((cat && cat.grades) || []) };
    M.ready = true;
    // Validate the deep-link target against the loaded tree; fall back gracefully.
    if (S.grade && !grade(S.grade)) { S.grade = null; S.subject = null; }
    else if (S.subject && !subject(S.grade, S.subject)) { S.subject = null; }
    paint();
  }).catch(() => { M.tree = { grades: [] }; M.ready = true; paint(); });
}

// breadcrumb + status bar
function crumb() {
  const parts = [`<button class="st-crumb root" onclick="ccSGo()">◆ Site</button>`];
  if (S.grade) { const g = grade(S.grade); parts.push(`<span class="st-sep">›</span><button class="st-crumb" onclick="ccSGo('${S.grade}')">${esc(g ? g.label : S.grade)}</button>`); }
  if (S.subject) { const sub = subject(S.grade, S.subject); parts.push(`<span class="st-sep">›</span><button class="st-crumb" onclick="ccSGo('${S.grade}','${S.subject}')">${esc(sub ? sub.icon : '')} ${esc(sub ? sub.label : S.subject)}</button>`); }
  if (S.game) { const gm = gameNode(S.grade, S.subject, S.game); parts.push(`<span class="st-sep">›</span><button class="st-crumb" onclick="ccSGo('${S.grade}','${S.subject}','${S.game}')">${esc(gm ? gm.ic : '')} ${esc(gm ? gm.label : S.game)}</button>`); }
  if (S.unit) { const d = gameData(gmContent()); const u = d && d.units.find(x => x.key === S.unit); parts.push(`<span class="st-sep">›</span><span class="st-crumb cur">${esc(d ? d.unitWord : '')} ${esc(u ? u.label : S.unit)}</span>`); }
  return `<div class="st-bar"><div class="st-crumbs">${parts.join('')}</div><div class="st-status idle" id="st-status"></div></div>`;
}

// DEPTH 0 — grades
function gradesView() {
  if (!M.ready) return `${crumb()}<div class="cc-note">Loading the live catalog…</div>`;
  const cards = M.tree.grades.map(g => {
    const subs = g.subjects.length, games = g.subjects.reduce((n, s) => n + s.games.length, 0);
    const empty = g.subjects.filter(s => s.games.length === 0).length;
    return `<button class="st-card" onclick="ccSGo('${g.key}')">
      <div class="st-card-cyc">${esc(g.cycle || '')}</div>
      <div class="st-card-nm">${esc(g.label)}</div>
      <div class="st-card-meta">${subs} μαθήματα · ${games} παιχνίδια</div>
      ${empty ? `<div class="st-card-flag">${empty} κενό μάθημα</div>` : '<div class="st-card-ok">πλήρες</div>'}</button>`;
  }).join('');
  return `${crumb()}
    <div class="cc-note"><b>Site Studio.</b> The whole catalog as a live tree — exactly what students see. Drill in to <b>reorder</b>, <b>rename</b>, <b>add</b> or <b>remove</b> games on any subject, then open a game to edit its <b>rhapsodies, questions and texts</b> (or its <b>paradigm tables</b>). No code, no redeploy — every change is validated &amp; audited server-side.</div>
    <div class="st-bulkbar"><button class="st-add" onclick="ccSAddGrammarAll()"><span class="ai">＋</span> Γραμματική σε όλες τις τάξεις (Α΄ Γυμν. → Γ΄ Λυκ.)</button>
      <button class="st-add ts-entry" onclick="ccTSEnter()"><span class="ai">🏆</span> Trivia Subjects — μετονομασία &amp; ρυθμίσεις</button></div>
    <div class="st-grid">${cards || '<div class="st-empty"><div class="st-empty-t">Καμία τάξη ακόμη / No grades yet</div><div class="st-empty-s">Δεν βρέθηκαν τάξεις στον κατάλογο. / No grades found in the catalog.</div></div>'}</div>`;
}

// DEPTH 1 — subjects in a grade
function subjectsView() {
  const g = grade(S.grade);
  const trackNote = g.hasTracks ? `<div class="cc-note warn">This grade uses <b>tracks</b> — reordering &amp; adding subjects here is saved but applied to the live site in a later pass. Editing the <b>content</b> of its games works live now.</div>` : '';
  const rows = g.subjects.map((s, i) => `<div class="st-row drag" draggable="true" data-i="${i}"
      ondragstart="ccSDrag.start(event,'subj',${i})" ondragover="ccSDrag.over(event)" ondrop="ccSDrag.drop(event,'subj',${i})" ondragend="ccSDrag.end(event)">
    <span class="st-grip">⠿</span>
    <span class="st-row-ic">${esc(s.icon)}</span>
    <div class="st-row-main">
      <input class="st-inp nm" value="${esc(s.label)}" onchange="ccSSubjRename('${s.id}','label',this.value)" aria-label="Subject name"/>
      <input class="st-inp en" value="${esc(s.labelEn)}" onchange="ccSSubjRename('${s.id}','labelEn',this.value)" aria-label="English name"/>
    </div>
    ${s.track ? `<span class="st-track">${esc(s.track)}</span>` : ''}
    <span class="st-count ${s.games.length ? '' : 'zero'}">${s.games.length} ${s.games.length === 1 ? 'game' : 'games'}</span>
    <button class="st-open" onclick="ccSGo('${S.grade}','${s.id}')">Open →</button>
    <button class="st-del" title="delete subject" onclick="ccSSubjDel('${s.id}')">✕</button>
  </div>`).join('');
  return `${crumb()}${trackNote}
    <div class="cc-note">Drag to reorder how subjects appear for <b>${esc(g.label)}</b>. Rename inline (Greek + English). Open a subject to manage its games.</div>
    <div class="st-list">${rows || '<div class="st-empty"><div class="st-empty-t">Κανένα μάθημα ακόμη / No subjects yet</div><div class="st-empty-s">Πρόσθεσε το πρώτο μάθημα παρακάτω. / Add the first subject below.</div></div>'}</div>
    <button class="st-add" onclick="ccSSubjAdd()"><span class="ai">＋</span> Add subject</button>`;
}

// DEPTH 2 — games in a subject
function gamesView() {
  const sub = subject(S.grade, S.subject);
  const rows = sub.games.map((gm, i) => {
    const editable = !!gm.content;
    if (gm.sys && gm.type === 'trivia') {
      // The trivia launcher's name lives in the Trivia Subjects editor (titleEm),
      // not the catalog — show the live title and route renaming there so it's
      // one coherent place (and persists via the direct-write config path).
      const tkey = String(gm.content || '').replace(/-trivia$/, '');
      const TSUB = (typeof window !== 'undefined' && window.TRIVIA_SUBJECTS) ? window.TRIVIA_SUBJECTS[tkey] : null;
      const tlbl = TSUB ? (((TSUB.titlePre ? TSUB.titlePre + ' ' : '') + ((TSUB.titleEm && TSUB.titleEm.gr) || gm.label))) : gm.label;
      const open = TSUB ? `ccTSEnter('${esc(tkey)}')` : 'ccTSEnter()';
      return `<div class="st-row sys">
        <span class="st-grip ghost">▪</span>
        <span class="st-row-ic">${esc(gm.ic)}</span>
        <div class="st-row-main"><div class="st-sysnm">${esc(tlbl)}</div>
          <div class="st-row-sub"><span class="st-type">Trivia</span> · <span class="st-systag">όνομα από τα Trivia Subjects</span></div></div>
        <button class="st-edit" onclick="${open}">✎ Trivia Subjects →</button>
      </div>`;
    }
    if (gm.type === 'history-game') {
      // Istoria keeps its own per-course content editor (admin.html). Open it
      // scoped to this grade's course; renaming still goes through the catalog.
      const course = encodeURIComponent(S.grade || 'g3');
      const url = (typeof window !== 'undefined' && window.APP_BASE ? window.APP_BASE : '') + 'games/istoria/admin.html?course=' + course;
      return `<div class="st-row">
        <span class="st-grip ghost">▪</span>
        <span class="st-row-ic">${esc(gm.ic || '🗺️')}</span>
        <div class="st-row-main">
          <input class="st-inp nm" value="${esc(gm.label)}" onchange="ccSGameField('${gm.id}','label',this.value)" aria-label="Game name"/>
          <div class="st-row-sub"><span class="st-type">Ιστορία · Atlas/Agon</span> · <span class="st-systag">περιεχόμενο ανά τάξη</span></div></div>
        <button class="st-edit" onclick="window.open('${url}','_blank','noopener')">✎ Επεξεργασία περιεχομένου →</button>
        ${gm.sys ? '' : `<button class="st-del" title="remove game" onclick="ccSGameDel('${gm.id}')">✕</button>`}
      </div>`;
    }
    if (gm.sys) {
      return `<div class="st-row sys">
        <span class="st-grip ghost">▪</span>
        <span class="st-row-ic">${esc(gm.ic)}</span>
        <div class="st-row-main"><div class="st-sysnm">${esc(gm.label)}</div>
          <div class="st-row-sub"><span class="st-type">${esc(gameType(gm.type).label)}</span> · <span class="st-systag">system card</span></div></div>
        <button class="st-edit" onclick="ccSGo('${S.grade}','${S.subject}','${gm.id}')">${editable ? '✎ Edit content →' : '⚙ Επίπεδα & πρόσβαση →'}</button>
      </div>`;
    }
    return `<div class="st-row drag" draggable="true" data-i="${i}"
        ondragstart="ccSDrag.start(event,'game',${i})" ondragover="ccSDrag.over(event)" ondrop="ccSDrag.drop(event,'game',${i})" ondragend="ccSDrag.end(event)">
      <span class="st-grip">⠿</span>
      <span class="st-row-ic">${esc(gm.ic)}</span>
      <div class="st-row-main">
        <input class="st-inp nm" value="${esc(gm.label)}" onchange="ccSGameField('${gm.id}','label',this.value)" aria-label="Game name"/>
        <div class="st-row-sub"><span class="st-type">${esc(gameType(gm.type).label)}</span> · <code>${esc(gm.type)}</code></div>
      </div>
      <select class="st-tier" onchange="ccSGameField('${gm.id}','tier',this.value)" title="Catalog tier (access is enforced in Subscriptions)">
        <option value="free"    ${gm.tier === 'free' ? 'selected' : ''}>Free</option>
        <option value="student" ${gm.tier === 'student' ? 'selected' : ''}>Student</option>
        <option value="teacher" ${gm.tier === 'teacher' ? 'selected' : ''}>Teacher</option></select>
      <button class="st-edit" onclick="ccSGo('${S.grade}','${S.subject}','${gm.id}')">${editable ? '✎ Edit content →' : '⚙ Επίπεδα & πρόσβαση →'}</button>
      <button class="st-del" title="remove game" onclick="ccSGameDel('${gm.id}')">✕</button>
    </div>`;
  }).join('');
  const empty = `<div class="st-empty big"><div class="st-empty-ic">${esc(sub.icon)}</div>
    <div class="st-empty-t">«${esc(sub.label)}» has no games yet</div>
    <div class="st-empty-s">This subject is empty for students. Add a game to bring it to life.</div></div>`;
  return `${crumb()}
    <div class="cc-note">Reorder by dragging — this is the order students see in <b>${esc(sub.label)}</b>. Rename inline, set the catalog tier, or open a game with editable content (Trivia / paradigm) to edit its questions &amp; texts.</div>
    <div class="st-list">${sub.games.length ? rows : empty}</div>
    <button class="st-add" onclick="ccSGameAdd()"><span class="ai">＋</span> Add game to «${esc(sub.label)}»</button>`;
}

// DEPTH 3 — game content (quiz: units · texts / paradigm: slices)
function gameContentView() {
  const gm = gameNode(S.grade, S.subject, S.game);
  const cid = gm.content;
  // istoria/history keeps its content in its OWN per-course editor (admin.html),
  // not in gameContent — route there instead of an empty/stuck content view.
  if (gm.type === 'history-game') {
    const course = encodeURIComponent(S.grade || 'g3');
    const url = (typeof window !== 'undefined' && window.APP_BASE ? window.APP_BASE : '') + 'games/istoria/admin.html?course=' + course;
    return `${crumb()}
      <div class="st-gamehd"><span class="st-row-ic big">${esc(gm.ic || '🗺️')}</span>
        <div style="flex:1;min-width:0"><div class="st-gamehd-nm">${esc(gm.label)}</div>
          <div class="st-gamehd-sub">Ιστορία · Atlas/Agon — περιεχόμενο ανά τάξη (<code>${esc(S.grade || 'g3')}</code>)</div></div>
        <button class="st-open" onclick="window.open('${url}','_blank','noopener')" title="Άνοιγμα σε νέα καρτέλα">↗ Νέα καρτέλα</button></div>
      <div class="cc-note">7 τύποι ασκήσεων ανά τάξη (κωδικός επεξεργαστή: <code>admin</code>). Αλλαγές αποθηκεύονται στο Firestore (<code>game_data/istoria:${esc(S.grade || 'g3')}</code>) — οι μαθητές τις βλέπουν στην επόμενη φόρτωση.</div>
      <iframe class="st-embed" src="${esc(url)}" title="Ιστορία — Επεξεργαστής Περιεχομένου" loading="lazy"></iframe>`;
  }
  if (cid && M.loadingCid === cid) return `${crumb()}<div class="cc-note">Loading content for <b>${esc(gm.label)}</b>…</div>`;
  const data = gameData(cid);
  if (!data) {
    return `${crumb()}<div class="cc-note">This game (<code>${esc(gm.type)}</code>) has no editable content here. <b>Trivia</b> games are editable in the Studio and reach players live; grammar (conjugation/declension) games store their tables in code, and other games store their content as levels or decks.</div>`;
  }
  if (data.schema === 'paradigm') return paradigmContentView(gm, data);

  const tab = S.tab || 'units';
  const totalQ = data.units.reduce((n, u) => n + u.questions.length, 0);
  const totalT = data.units.reduce((n, u) => n + (u.texts ? u.texts.length : 0), 0);
  const tabs = `<div class="st-tabs">
    <button class="st-tab ${tab === 'units' ? 'on' : ''}" onclick="ccSTab('units')">${esc(data.unitWord)}ς · ${data.units.length}</button>
    <button class="st-tab ${tab === 'texts' ? 'on' : ''}" onclick="ccSTab('texts')">Κείμενα · ${totalT}</button></div>`;
  let body;
  if (tab === 'units') {
    const rows = data.units.map((u, i) => `<div class="st-row drag" draggable="true" data-i="${i}"
        ondragstart="ccSDrag.start(event,'unit',${i})" ondragover="ccSDrag.over(event)" ondrop="ccSDrag.drop(event,'unit',${i})" ondragend="ccSDrag.end(event)">
      <span class="st-grip">⠿</span><span class="st-key">${esc(u.key)}</span>
      <div class="st-row-main">
        <input class="st-inp nm" value="${esc(u.label)}" onchange="ccSUnitRename('${u.key}',this.value)" aria-label="Rhapsody label"/>
        <div class="st-row-sub">${u.questions.length} ερωτήσεις${u.texts && u.texts.length ? ` · ${u.texts.length} κείμ.` : ''}</div>
      </div>
      <button class="st-edit" onclick="ccSOpenUnit('${u.key}')">✎ Ερωτήσεις →</button>
      <button class="st-del" title="delete rhapsody" onclick="ccSUnitDel('${u.key}')">✕</button>
    </div>`).join('');
    body = `<div class="st-list">${rows || `<div class="st-empty"><div class="st-empty-t">Καμία ${esc(data.unitWord.toLowerCase())} ακόμη / No ${esc(data.unitWord.toLowerCase())} yet</div><div class="st-empty-s">Πρόσθεσε την πρώτη παρακάτω. / Add the first one below.</div></div>`}</div>
      <button class="st-add" onclick="ccSUnitAdd()"><span class="ai">＋</span> Νέα ${esc(data.unitWord)}</button>`;
  } else {
    const all = []; data.units.forEach(u => (u.texts || []).forEach((t, ti) => all.push({ u: u.key, ti, t })));
    const rows = all.map(x => `<div class="st-text">
      <div class="st-text-hd"><span class="st-key sm">${esc(x.u)}</span>
        <input class="st-inp nm" value="${esc(x.t.title)}" onchange="ccSTextField('${x.u}',${x.ti},'title',this.value)" aria-label="Text title"/>
        <button class="st-del" title="delete text" onclick="ccSTextDel('${x.u}',${x.ti})">✕</button></div>
      <textarea class="st-text-body" rows="4" onchange="ccSTextField('${x.u}',${x.ti},'body',this.value)" placeholder="Κείμενο…">${esc(x.t.body)}</textarea>
    </div>`).join('');
    body = `<div class="cc-note">Reading passages (κείμενα) attached to a ${esc(data.unitWord.toLowerCase())}. Add the source text students study alongside the questions.</div>
      ${all.length ? rows : '<div class="st-empty"><div class="st-empty-t">Κανένα κείμενο ακόμη / No texts yet</div><div class="st-empty-s">Πρόσθεσε ένα κείμενο σε μια ραψωδία παρακάτω. / Add a passage to a rhapsody below.</div></div>'}
      <button class="st-add" onclick="ccSTextAdd()"><span class="ai">＋</span> Add text</button>`;
  }
  const canPreview = (typeof launchStudioTrivia === 'function') && totalQ > 0;
  const previewBtn = canPreview
    ? `<button class="st-preview" onclick="ccSPreviewTrivia()" title="Παίξε το quiz με τις τρέχουσες (μη αποθηκευμένες) ερωτήσεις">▶ Δοκιμή</button>`
    : '';
  return `${crumb()}
    <div class="st-gamehd"><span class="st-row-ic big">${esc(gm.ic)}</span>
      <div style="flex:1;min-width:0"><div class="st-gamehd-nm">${esc(gm.label)}</div>
        <div class="st-gamehd-sub"><code>gameContent/${esc(cid)}</code> · ${totalQ} ερωτήσεις σε ${data.units.length} ${esc(data.unitWord.toLowerCase())}ς</div></div>
      ${previewBtn}</div>
    ${tabs}${body}`;
}

// DEPTH 4 — questions in a unit
// ── question types (reimagined editor) ──────────────────────────
// Every question keeps a valid { opts, ans } "shadow" so the server accepts it
// (functions/index.js validates only opts.length>=2 & ans-in-range) and every
// MC engine still plays it. The optional `type` + type fields drive richer
// authoring. Absent type ⇒ 'mc'. mc/tf play natively today; fill/match/order are
// stored + play AS multiple-choice (native rendering is a documented follow-up).
const TYPE_OPTS = [['mc', 'Πολλαπλή'], ['tf', 'Σωστό/Λάθος'], ['fill', 'Συμπλήρωση κενού'], ['match', 'Αντιστοίχιση'], ['order', 'Σειρά']];
const TYPE_PLAYS = { mc: true, tf: true, fill: false, match: false, order: false };
function _qTypeBadge(t) {
  const ok = !!TYPE_PLAYS[t];
  return `<span class="st-typebadge ${ok ? 'plays' : 'stored'}" title="${ok ? 'Παίζει αυτούσιο στα παιχνίδια' : 'Αποθηκεύεται & παίζεται ως πολλαπλή — πλήρες παίξιμο σε επόμενη φάση'}">${ok ? 'Παίζει' : 'Αποθ.'}</span>`;
}
function _convertType(q, t) {
  q.type = (t === 'mc') ? undefined : t;
  if (t === 'tf') { q.opts = ['Σωστό', 'Λάθος']; if (!(q.ans === 0 || q.ans === 1)) q.ans = 0; }
  else if (t === 'fill') { q.gap = q.gap || (q.opts && q.opts[q.ans]) || ''; }
  else if (t === 'match') { if (!Array.isArray(q.pairs)) q.pairs = [['', ''], ['', ''], ['', '']]; }
  else if (t === 'order') { if (!Array.isArray(q.seq)) q.seq = ['', '', '']; }
}
// Keep { opts, ans } valid (server invariant + MC engines + rapid-fire) for non-MC types.
function _syncShadow(q) {
  const t = q.type || 'mc';
  if (t === 'mc' || t === 'tf') return;
  if (t === 'fill') {
    const gap = q.gap || '';
    const d = (q.opts || []).filter((o, idx) => o && idx !== q.ans && o !== gap).slice(0, 3);
    q.opts = [gap, ...d]; q.ans = 0;
  } else if (t === 'match') {
    q.opts = (q.pairs || []).map(p => (p && p[1]) || '').filter(Boolean).slice(0, 4); q.ans = 0;
    if (!q.q) q.q = 'Αντιστοίχισε';
  } else if (t === 'order') {
    q.opts = (q.seq || []).filter(Boolean).slice(0, 4); q.ans = 0;
  }
  while (q.opts.length < 2) q.opts.push('—');
}
function _qBody(q, i, t) {
  if (t === 'tf') {
    return `<div class="st-opts">${['Σωστό', 'Λάθος'].map((o, oi) => `<label class="st-opt ${q.ans === oi ? 'correct' : ''}">
      <input type="radio" name="ans${i}" ${q.ans === oi ? 'checked' : ''} onchange="ccSQAns(${i},${oi})" title="Σήμανε το σωστό"/>
      <span class="st-opt-dot"></span><input class="st-inp o ts-ro" value="${o}" readonly tabindex="-1"/></label>`).join('')}</div>`;
  }
  if (t === 'fill') {
    const dis = (q.opts || []).map((o, oi) => oi === q.ans ? '' : `<label class="st-opt"><span class="st-opt-dot off"></span><input class="st-inp o" value="${esc(o)}" onchange="ccSQOpt(${i},${oi},this.value)" aria-label="Distractor"/></label>`).join('');
    return `<div class="st-fill">
      <label class="st-flabel">Σωστή λέξη — γεμίζει το <code>___</code></label>
      <input class="st-inp" value="${esc(q.gap || '')}" onchange="ccSQGap(${i},this.value)" placeholder="π.χ. Όμηρος" aria-label="Gap answer"/>
      <button class="st-add sm" onclick="ccSQMarkGap(${i})">＋ Βάλε ___ κενό στην ερώτηση</button>
      <div class="st-fill-sub">Περισπασμοί (για παίξιμο ως πολλαπλή):</div>
      <div class="st-opts">${dis}</div></div>`;
  }
  if (t === 'match') {
    return `<div class="st-pairs">${(q.pairs || []).map((p, pi) => `<div class="st-pair">
      <input class="st-inp" value="${esc((p && p[0]) || '')}" onchange="ccSQPair(${i},${pi},0,this.value)" placeholder="στήλη Α" aria-label="Left ${pi + 1}"/>
      <span class="st-pair-arrow">↔</span>
      <input class="st-inp" value="${esc((p && p[1]) || '')}" onchange="ccSQPair(${i},${pi},1,this.value)" placeholder="στήλη Β" aria-label="Right ${pi + 1}"/>
      ${(q.pairs || []).length > 2 ? `<button class="st-del" title="Αφαίρεση" onclick="ccSQPairDel(${i},${pi})">✕</button>` : ''}</div>`).join('')}
      <button class="st-add sm" onclick="ccSQPairAdd(${i})"><span class="ai">＋</span> ζεύγος</button></div>`;
  }
  if (t === 'order') {
    return `<div class="st-seq">${(q.seq || []).map((s, si) => `<div class="st-seqitem">
      <span class="st-seq-n">${si + 1}</span>
      <input class="st-inp" value="${esc(s || '')}" onchange="ccSQSeq(${i},${si},this.value)" placeholder="βήμα ${si + 1}" aria-label="Step ${si + 1}"/>
      ${(q.seq || []).length > 2 ? `<button class="st-del" title="Αφαίρεση" onclick="ccSQSeqDel(${i},${si})">✕</button>` : ''}</div>`).join('')}
      <button class="st-add sm" onclick="ccSQSeqAdd(${i})"><span class="ai">＋</span> βήμα</button>
      <div class="st-fill-sub">Η σειρά που τα γράφεις = η σωστή σειρά.</div></div>`;
  }
  // mc (default) — 2–8 options, add/remove
  return `<div class="st-opts">${q.opts.map((o, oi) => `<label class="st-opt ${q.ans === oi ? 'correct' : ''}">
      <input type="radio" name="ans${i}" ${q.ans === oi ? 'checked' : ''} onchange="ccSQAns(${i},${oi})" title="Mark correct"/>
      <span class="st-opt-dot"></span>
      <input class="st-inp o" value="${esc(o)}" onchange="ccSQOpt(${i},${oi},this.value)" aria-label="Option ${oi + 1}"/>
      ${q.opts.length > 2 ? `<button class="st-opt-del" title="Αφαίρεση επιλογής" onclick="ccSQOptDel(${i},${oi})">✕</button>` : ''}</label>`).join('')}
    ${q.opts.length < 8 ? `<button class="st-add sm" onclick="ccSQOptAdd(${i})"><span class="ai">＋</span> επιλογή</button>` : ''}</div>`;
}

function questionsView() {
  const data = gameData(gmContent()); const u = data.units.find(x => x.key === S.unit);
  if (!u) { S.unit = null; return gameContentView(); }
  const rows = u.questions.map((q, i) => {
    const t = q.type || 'mc';
    return `<div class="st-q drag t-${t}" draggable="true" data-i="${i}"
        ondragstart="ccSDrag.start(event,'q',${i})" ondragover="ccSDrag.over(event)" ondrop="ccSDrag.drop(event,'q',${i})" ondragend="ccSDrag.end(event)">
      <div class="st-q-hd"><span class="st-grip">⠿</span><span class="st-q-n">${i + 1}</span>
        <select class="st-qtype" onchange="ccSQType(${i},this.value)" title="Τύπος ερώτησης" aria-label="Question type">${TYPE_OPTS.map(([v, lbl]) => `<option value="${v}" ${t === v ? 'selected' : ''}>${lbl}</option>`).join('')}</select>
        ${_qTypeBadge(t)}
        <input class="st-inp q" value="${esc(q.q)}" onchange="ccSQField(${i},'q',this.value)" placeholder="Ερώτηση…" aria-label="Question"/>
        <button class="st-del" title="Διπλασιασμός" onclick="ccSQDup(${i})">⧉</button>
        <button class="st-del" title="Διαγραφή" onclick="ccSQDel(${i})">✕</button></div>
      ${_qBody(q, i, t)}</div>`;
  }).join('');
  const imp = (_imp && _imp.unit === S.unit) ? _qImportPanel(u) : '';
  return `${crumb()}
    <div class="cc-note">Editing <b>${esc(data.unitWord)} ${esc(u.label)}</b>. Pick a <b>type</b> per question. <span class="st-typebadge plays">Παίζει</span> = παίζει αυτούσιο · <span class="st-typebadge stored">Αποθ.</span> = αποθηκεύεται &amp; παίζεται ως πολλαπλή. Σήμανε το σωστό με την κουκκίδα. Drag ⠿ to reorder. Saved &amp; audited.</div>
    <div class="st-qlist">${rows || '<div class="st-empty"><div class="st-empty-t">Καμία ερώτηση ακόμη — πρόσθεσε την πρώτη / No questions yet — add the first</div><div class="st-empty-s">Διάλεξε τύπο από το «Πρόσθεσε ερώτηση…» παρακάτω. / Pick a type from “Add question…” below.</div></div>'}</div>
    <div class="st-qactions">
      <select class="st-addsel" aria-label="Πρόσθεσε ερώτηση — διάλεξε τύπο" onchange="if(this.value){ccSQAdd(this.value);this.selectedIndex=0;}">
        <option value="">＋ Πρόσθεσε ερώτηση…</option>
        <option value="mc">Πολλαπλή επιλογή</option>
        <option value="tf">Σωστό / Λάθος</option>
        <option value="fill">Συμπλήρωση κενού</option>
        <option value="match">Αντιστοίχιση</option>
        <option value="order">Σειρά</option>
      </select>
      <input type="file" id="q-imp-file" class="qimp-file" accept=".csv,.tsv,.txt,.json" onchange="ccQImportFile(this)" aria-label="Import questions file"/>
      <button class="st-add qimp-btn" onclick="document.getElementById('q-imp-file').click()" title="Μαζική εισαγωγή από CSV/JSON"><span class="ai">⬆</span> Εισαγωγή αρχείου</button>
      <button class="st-open" onclick="ccQTemplate()" title="Κατέβασε υπόδειγμα CSV">⬇ Πρότυπο</button>
    </div>
    <div class="qimp-hint">Μαζική εισαγωγή: <b>CSV</b> (Excel → «Αποθήκευση ως CSV») ή <b>JSON</b>. Στήλες: <code>ερώτηση, επιλογή Α, Β, Γ, Δ, σωστή</code>. Το <b>Καταιγισμός</b> φτιάχνει αυτόματα Σωστό/Λάθος, Αντιστοίχιση &amp; Σειρά.</div>
    ${imp}`;
}

// ════════ PARADIGM (ported from cc-studio-paradigm.js) ══════════
function paradigmContentView(gm, data) {
  const totalEntries = data.units.reduce((n, u) => n + u.entries.length, 0);
  const rows = data.units.map((u, i) => `<div class="st-row drag" draggable="true" data-i="${i}"
      ondragstart="ccSDrag.start(event,'unit',${i})" ondragover="ccSDrag.over(event)" ondrop="ccSDrag.drop(event,'unit',${i})" ondragend="ccSDrag.end(event)">
    <span class="st-grip">⠿</span><span class="st-key slug">${esc(u.key)}</span>
    <div class="st-row-main">
      <input class="st-inp nm" value="${esc(u.label)}" onchange="ccPUnitRename('${u.key}',this.value)" aria-label="Slice label"/>
      <div class="st-row-sub">${u.entries.length} ${u.entries.length === 1 ? 'λήμμα' : 'λήμματα'} · πίνακας ${u.rowAxis.length}×${u.colAxis.length}</div>
    </div>
    <button class="st-edit" onclick="ccPOpenUnit('${u.key}')">✎ Πίνακας →</button>
    <button class="st-del" title="delete slice" onclick="ccPUnitDel('${u.key}')">✕</button>
  </div>`).join('');
  return `${crumb()}
    <div class="st-gamehd"><span class="st-row-ic big">${esc(gm.ic)}</span>
      <div><div class="st-gamehd-nm">${esc(gm.label)}</div>
        <div class="st-gamehd-sub"><code>gameContent/${esc(gm.content)}</code> · ${totalEntries} λήμματα σε ${data.units.length} ${esc(data.unitWord.toLowerCase())}${data.units.length === 1 ? '' : 'ς'}</div></div>
      <span class="st-schema">⊞ paradigm</span></div>
    <div class="cc-note"><b>Πίνακας κλίσης — not a quiz.</b> This game stores <b>paradigm tables</b>: a word and its forms across grammatical axes (πτώσεις, χρόνοι, φωνές). Open a ${esc(data.unitWord.toLowerCase())} to edit its table — the game builds its exercises from these cells.</div>
    <div class="st-list">${rows}</div>
    <button class="st-add" onclick="ccPUnitAdd()"><span class="ai">＋</span> Νέα ${esc(data.unitWord)}</button>`;
}

function paradigmTableView() {
  const data = gameData(gmContent()); const u = data.units.find(x => x.key === S.unit);
  if (!u) { S.unit = null; return paradigmContentView(gameNode(S.grade, S.subject, S.game), data); }
  const rowChips = u.rowAxis.map((r, ri) => `<span class="pt-chip"><input class="pt-axin" value="${esc(r)}" onchange="ccPRowLabel(${ri},this.value)" aria-label="Row label"/>${u.rowAxis.length > 1 ? `<button class="pt-x" title="delete row" onclick="ccPDelRow(${ri})">✕</button>` : ''}</span>`).join('');
  const colChips = u.colAxis.map((c, ci) => `<span class="pt-chip"><input class="pt-axin" value="${esc(c)}" onchange="ccPColLabel(${ci},this.value)" aria-label="Column label"/>${u.colAxis.length > 1 ? `<button class="pt-x" title="delete column" onclick="ccPDelCol(${ci})">✕</button>` : ''}</span>`).join('');
  const colHeads = u.colAxis.map(c => `<th class="pt-colh">${esc(c)}</th>`).join('');
  const entries = u.entries.map((e, ei) => {
    const body = u.rowAxis.map((r, ri) => `<tr><th class="pt-rowh">${esc(r)}</th>${u.colAxis.map((c, ci) => `<td><input class="pt-cell" value="${esc((e.cells[ri] && e.cells[ri][ci]) || '')}" onchange="ccPCell(${ei},${ri},${ci},this.value)" aria-label="${esc(r)} ${esc(c)}"/></td>`).join('')}</tr>`).join('');
    return `<div class="pt-entry">
      <div class="pt-entry-hd">
        <input class="pt-lemma" value="${esc(e.lemma)}" onchange="ccPLemma(${ei},this.value)" placeholder="λήμμα / lemma"/>
        <input class="pt-meta" value="${esc(e.meta || '')}" onchange="ccPMeta(${ei},this.value)" placeholder="σημείωση"/>
        ${u.entries.length > 1 ? `<button class="st-del" title="remove word" onclick="ccPDelEntry(${ei})">✕</button>` : ''}</div>
      <div class="pt-wrap"><table class="pt"><thead><tr><th class="pt-corner"></th>${colHeads}</tr></thead><tbody>${body}</tbody></table></div>
    </div>`;
  }).join('');
  return `${crumb()}
    <div class="cc-note">Editing <b>${esc(u.label)}</b>. The <b>axes</b> below define the table — rename a label, or add/remove a row or column and every word updates. Each <b>λήμμα</b> gets its own form grid. Saved &amp; audited.</div>
    <div class="pt-axes">
      <div class="pt-axgrp"><span class="pt-axlbl">Γραμμές · rows</span><div class="pt-chips">${rowChips}<button class="pt-addax" title="add row" onclick="ccPAddRow()">＋</button></div></div>
      <div class="pt-axgrp"><span class="pt-axlbl">Στήλες · columns</span><div class="pt-chips">${colChips}<button class="pt-addax" title="add column" onclick="ccPAddCol()">＋</button></div></div>
    </div>
    ${entries}
    <button class="st-add" onclick="ccPAddEntry()"><span class="ai">＋</span> Νέο λήμμα (word)</button>`;
}

// ── router ──
function view() {
  if (S.section === 'trivia') return triviaView();
  if (!S.grade)   return gradesView();
  if (!S.subject) return subjectsView();
  if (!S.game)    return gamesView();
  const data = gameData(gmContent());
  if (S.unit && data) return data.schema === 'paradigm' ? paradigmTableView() : questionsView();
  // game level (no unit open): content editor + the per-class Levels & Access panel
  const gm = gameNode(S.grade, S.subject, S.game);
  return gameContentView() + _levelsAccessPanel(gm);
}

// ════════ navigation ════════════════════════════════════════════
window.ccSGo = (g = null, s = null, gm = null) => {
  S.section = null;
  S.grade = g; S.subject = s; S.game = gm; S.unit = null; S.tab = 'units';
  if (gm) {
    const node = gameNode(g, s, gm);
    const cid = node && node.content;
    if (cid && !M.content[cid]) { ensureContent(cid).then(paint); paint(); return; }
  }
  paint();
};
window.ccSOpenUnit = key => { S.unit = key; paint(); };
window.ccSTab = t => { S.tab = t; paint(); };
// Playtest the trivia quiz with the LIVE in-editor content (unsaved edits
// included) — opens the shared trivia overlay over the Studio panel.
window.ccSPreviewTrivia = () => {
  const gm = gameNode(S.grade, S.subject, S.game);
  if (!gm) return;
  const data = gameData(gm.content);
  if (!data || data.schema !== 'quiz') return;
  const total = (data.units || []).reduce((n, u) => n + ((u.questions && u.questions.length) || 0), 0);
  if (!total) { if (typeof showToast === 'function') showToast('Πρόσθεσε ερωτήσεις για δοκιμή.'); return; }
  if (typeof launchStudioTrivia === 'function') {
    launchStudioTrivia(data, gm.label, (typeof siteLang !== 'undefined' && siteLang === 'en') ? 'en' : 'gr');
  }
};
window.ccPOpenUnit = key => { S.unit = key; paint(); };

async function ensureContent(cid) {
  if (!cid || M.content[cid]) return M.content[cid];
  M.loadingCid = cid;
  let data = null;
  try { data = await ContentSource.loadGameContent(cid); } catch (_) {}
  if (!data) data = STUDIO_SEED[cid] ? clone(STUDIO_SEED[cid]) : null;
  if (data) M.content[cid] = clone(data);
  M.loadingCid = null;
  return M.content[cid];
}

// ════════ drag-reorder (generic) ════════════════════════════════
let _drag = { type: null, from: -1 };
window.ccSDrag = {
  start(e, type, i) { _drag = { type, from: i }; e.dataTransfer.effectAllowed = 'move'; try { e.dataTransfer.setData('text/plain', String(i)); } catch (_) {} e.currentTarget.classList.add('dragging'); },
  over(e) { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; e.currentTarget.classList.add('drop-into'); },
  end() { document.querySelectorAll('.dragging,.drop-into').forEach(el => el.classList.remove('dragging', 'drop-into')); },
  drop(e, type, to) {
    e.preventDefault();
    if (_drag.type !== type || _drag.from < 0 || _drag.from === to) { _drag = { type: null, from: -1 }; return; }
    const arr = listFor(type); if (!arr) return;
    const [m] = arr.splice(_drag.from, 1); arr.splice(to, 0, m);
    audit(`studio.reorder · ${type}`); _drag = { type: null, from: -1 }; paint();
  },
};
function listFor(type) {
  if (type === 'subj') return grade(S.grade).subjects;
  if (type === 'game') return subject(S.grade, S.subject).games;
  if (type === 'unit') return gameData(gmContent()).units;
  if (type === 'q') { const d = gameData(gmContent()); return d.units.find(x => x.key === S.unit).questions; }
  return null;
}

// confirm wrapper (folds `lines` into intro for the production ccConfirm)
function _confirm(o) {
  let intro = o.intro || '';
  if (o.lines && o.lines.length) intro += `<div class="st-conf-lines">${o.lines.map(l => `<div><span>${esc(l.k)}</span><b>${l.v}</b></div>`).join('')}</div>`;
  if (window.ccConfirm) window.ccConfirm({ title: o.title, danger: o.danger, intro, note: o.note, confirmLabel: o.confirmLabel, onConfirm: o.onConfirm });
  else if (o.onConfirm) o.onConfirm();
}
const toast = m => { if (window.ccToast) ccToast(m); };

// ════════ subjects ══════════════════════════════════════════════
window.ccSSubjRename = (sid, field, v) => { const s = subject(S.grade, sid); if (s) { s[field] = v; audit('studio.subject.rename · ' + sid); } };
window.ccSSubjAdd = () => { const g = grade(S.grade);
  g.subjects.push({ id: 'subj' + Date.now(), icon: '📘', label: 'Νέο Μάθημα', labelEn: 'New Subject', games: [] });
  audit('studio.subject.add'); paint(); toast('Subject added — rename & add games'); };
window.ccSSubjDel = sid => { const g = grade(S.grade), s = g.subjects.find(x => x.id === sid);
  const go = () => { g.subjects = g.subjects.filter(x => x.id !== sid); audit('studio.subject.delete · ' + sid); paint(); toast('Subject removed'); };
  if (s.games.length === 0) { go(); return; }
  _confirm({ title: `Delete «${s.label}»?`, danger: true,
    intro: `This subject has <b>${s.games.length}</b> game(s). Deleting it removes the subject and unlinks those games from <b>${esc(g.label)}</b>.`,
    lines: [{ k: 'Games removed', v: String(s.games.length) }], confirmLabel: 'Delete subject', onConfirm: go });
};

// ════════ games ═════════════════════════════════════════════════
window.ccSGameField = (gid, field, v) => { const gm = gameNode(S.grade, S.subject, gid); if (gm) { gm[field] = v; audit(`studio.game.${field} · ${gid}`); if (field === 'tier') paint(); } };
window.ccSGameDel = gid => { const sub = subject(S.grade, S.subject), gm = sub.games.find(x => x.id === gid);
  const hasContent = gm.content && gameData(gm.content);
  const go = () => { sub.games = sub.games.filter(x => x.id !== gid); audit('studio.game.delete · ' + gm.label); paint(); toast('Game removed from subject'); };
  _confirm({ title: `Remove «${gm.label}»?`, danger: true,
    intro: hasContent ? `Removes this game from <b>${esc(sub.label)}</b>. Its question content stays on file and can be re-added later — students just won't see the tile.`
                      : `Removes this game tile from <b>${esc(sub.label)}</b>. Students will no longer see it here.`,
    lines: [{ k: 'Type', v: esc(gameType(gm.type).label) }, { k: 'Tier', v: tierBadge(gm.tier) }],
    confirmLabel: 'Remove game', onConfirm: go });
};
// Curated real games you can drop into any subject (correct launch `type` +
// `content` dataset for the level/content editors). preset:1 = core grammar.
const EXISTING_GAMES = [
  { c: 'Αρχαία Ελληνικά', type: 'lyo',             content: 'lyo',             ic: '🏛️', label: 'Μαθαίνοντας το Λύω',   preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'aoristos-b',      content: 'aoristos-b',      ic: '📜', label: 'Αόριστος Β΄',           preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'afwnolekta',      content: 'afwnolekta',      ic: '🔤', label: 'Αφωνόληκτα',            preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'rimata-mi',       content: 'rimata-mi',       ic: '⚙️', label: 'Ρήματα -μι',            preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'synirimmena',     content: 'synirimmena',     ic: '🔗', label: 'Συνηρημένα Ρήματα',     preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'pathitiko',       content: 'pathitiko',       ic: '⚗️', label: 'Παθητικός Μέλλ. & Αόρ.', preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'paratheta',       content: 'paratheta',       ic: '🔼', label: 'Παραθετικά Επιθέτων',   preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'anwmala-rimata',  content: 'anwmala-rimata',  ic: '⚠️', label: 'Ανώμαλα Ρήματα',        preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'eimi',            content: 'eimi',            ic: '⚡', label: 'Κλίση εἰμί',            preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'klisi-epitheton', content: 'epitheta',        ic: '🔆', label: 'Κλίση Επιθέτων',        preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'antonymies',      content: 'antonymies',      ic: '👤', label: 'Κλίση Αντωνυμιών',      preset: 1 },
  { c: 'Αρχαία Ελληνικά', type: 'klisi-rimaton',   content: 'klisi-rimaton',   ic: '🎚️', label: 'Κλίση Ρημάτων (Πλήρης)' },
  { c: 'Λατινικά', type: 'lat-nouns',     content: 'lat-nouns',     ic: '🏺', label: 'Λατ. Ουσιαστικά' },
  { c: 'Λατινικά', type: 'lat-verbs',     content: 'lat-verbs',     ic: '📋', label: 'Λατ. Ρήματα' },
  { c: 'Λατινικά', type: 'lat-epitheta',  content: 'lat-epitheta',  ic: '🔆', label: 'Λατ. Επίθετα' },
  { c: 'Λατινικά', type: 'lat-antonymies', content: 'lat-antonymies', ic: '👤', label: 'Λατ. Αντωνυμίες' },
  { c: 'Παιχνίδια', type: 'naumachia',   content: null, ic: '⚓', label: 'Ναυμαχία' },
  { c: 'Παιχνίδια', type: 'temple-run',  content: null, ic: '🏛️', label: 'Temple Run' },
  { c: 'Παιχνίδια', type: 'labyrinth',   content: null, ic: '🌀', label: 'Λαβύρινθος' },
  { c: 'Παιχνίδια', type: 'phalanx',     content: null, ic: '🛡️', label: 'Φάλαγγα' },
  { c: 'Παιχνίδια', type: 'dig',         content: null, ic: '⛏️', label: 'Ανασκαφή' },
  { c: 'Παιχνίδια', type: 'rapid-fire',  content: null, ic: '⚡', label: 'Καταιγισμός' },
  { c: 'Παιχνίδια', type: 'myth-memory', content: null, ic: '🃏', label: 'Mythology Memory' },
  { c: 'Παιχνίδια', type: 'epic-puzzle', content: null, ic: '📋', label: 'Χρονολόγιο' },
  { c: 'Ομηρικά / Ιστορία', type: 'odyssey-trivia', content: 'odyssey-trivia', ic: '🌊', label: 'Οδύσσεια Trivia' },
  { c: 'Ομηρικά / Ιστορία', type: 'history-game',   content: null, ic: '🗺️', label: 'Ιστορία — 7 Modes' },
];
let _pickerTab = 'existing';
window.ccSGameAdd = () => { _pickerTab = 'existing'; _openPicker(); };
function _openPicker() {
  const sub = subject(S.grade, S.subject);
  const m = document.getElementById('cc-confirm-modal'); if (!m) return;
  let grid;
  if (_pickerTab === 'existing') {
    const byCat = {};
    EXISTING_GAMES.forEach(g => { (byCat[g.c] = byCat[g.c] || []).push(g); });
    grid = Object.entries(byCat).map(([cat, list]) =>
      `<div class="st-pick-cat">${esc(cat)}</div><div class="st-pickgrid">${list.map(g =>
        `<button class="st-pick" onclick="ccSAddExisting('${g.type}')"><span class="st-pick-ic">${g.ic}</span><span class="st-pick-nm">${esc(g.label)}</span><span class="st-pick-k">${g.content ? '✎ levels + content' : 'engine'}</span></button>`).join('')}</div>`).join('');
  } else {
    grid = `<div class="st-pickgrid">${GAME_TYPES.map(t =>
      `<button class="st-pick" onclick="ccSGamePick('${t.type}')"><span class="st-pick-ic">${t.ic}</span><span class="st-pick-nm">${esc(t.label)}</span><span class="st-pick-k">${t.kind === 'trivia' ? '✎ editable questions' : t.kind === 'paradigm' ? '⊞ editable table' : t.kind}</span></button>`).join('')}</div>`;
  }
  m.innerHTML = `<h2><span class="x">＋</span> Add a game to «${esc(sub.label)}»</h2>
    <div class="st-pick-tabs">
      <button class="st-pick-tab${_pickerTab === 'existing' ? ' on' : ''}" onclick="ccSPickerTab('existing')">📚 Υπάρχον παιχνίδι</button>
      <button class="st-pick-tab${_pickerTab === 'new' ? ' on' : ''}" onclick="ccSPickerTab('new')">✦ Νέο κενό</button></div>
    <p>${_pickerTab === 'existing' ? 'Add a <b>real</b> game (Λύω, Ουσιαστικά, Latin…) — it keeps its levels and content.' : 'Create a <b>blank</b> game — Trivia gets an editable question set, conjugation/declension an editable table.'}</p>
    <div class="st-pickwrap">${grid}</div>
    <div class="cc-mbtns"><button class="cc-mbtn" onclick="ccConfirmNo()">Cancel</button></div>`;
  const scrim = document.getElementById('cc-confirm-scrim'); if (scrim) scrim.classList.add('on');
}
window.ccSPickerTab = t => { _pickerTab = t; _openPicker(); };
window.ccSAddExisting = type => {
  const meta = EXISTING_GAMES.find(g => g.type === type); if (!meta) return;
  const sub = subject(S.grade, S.subject);
  sub.games.push({ id: 'g' + Date.now(), type: meta.type, label: meta.label, labelEn: meta.labelEn || meta.label, ic: meta.ic, tier: 'free', content: meta.content || null });
  audit('studio.game.add · existing ' + meta.type + ' → ' + sub.label);
  if (window.ccConfirmNo) ccConfirmNo();
  paint(); toast(`Added «${meta.label}»`);
};
// Bulk: add a Γραμματική subject (core grammar games) to all 6 student classes.
window.ccSAddGrammarAll = () => {
  _confirm({ title: 'Προσθήκη «Γραμματική» σε όλες τις τάξεις;',
    intro: 'Adds a <b>Γραμματική</b> subject filled with the core Ancient-Greek grammar games (Λύω, Αόριστος Β΄, Αφωνόληκτα, Ρήματα-μι, Συνηρημένα, Παθητικός, Παραθετικά, Ανώμαλα, εἰμί, Επίθετα, Αντωνυμίες) to <b>Α΄ Γυμνασίου → Γ΄ Λυκείου</b>. Existing games are skipped — trim per class afterwards.',
    confirmLabel: 'Add to all 6 classes', onConfirm: () => {
      const preset = EXISTING_GAMES.filter(g => g.preset);
      ['gym-a', 'gym-b', 'gym-c', 'lyk-a', 'lyk-b', 'lyk-c'].forEach(gk => {
        const g = grade(gk); if (!g) return;
        let sub = g.subjects.find(s => s.id === 'grammatiki');
        if (!sub) { sub = { id: 'grammatiki', icon: '🔤', label: 'Γραμματική', labelEn: 'Grammar', games: [] }; g.subjects.push(sub); }
        preset.forEach(meta => { if (!sub.games.some(x => x.type === meta.type))
          sub.games.push({ id: 'g' + Date.now() + Math.floor(Math.random() * 9999), type: meta.type, label: meta.label, labelEn: meta.labelEn || meta.label, ic: meta.ic, tier: 'free', content: meta.content || null }); });
      });
      audit('studio.subject.add'); paint(); toast('«Γραμματική» added to all 6 classes');
    } });
};
window.ccSGamePick = type => {
  const sub = subject(S.grade, S.subject); const t = gameType(type);
  const newId = 'g' + Date.now();
  let content = null;
  if (t.kind === 'trivia') {
    content = 'c' + Date.now();
    M.content[content] = { schema: 'quiz', unitWord: 'Ενότητα', unitWordEn: 'Unit',
      units: [{ key: '1', label: 'Ενότητα 1', questions: [{ q: 'Νέα ερώτηση;', opts: ['Σωστό', 'Λάθος', '—', '—'], ans: 0 }], texts: [] }] };
    scheduleContentSave(content);
  } else if (t.kind === 'paradigm') {
    content = 'c' + Date.now();
    M.content[content] = { schema: 'paradigm', unitWord: 'Ενότητα', unitWordEn: 'Unit',
      units: [{ key: '1', label: 'Νέα ενότητα', rowAxis: ['Γραμμή 1', 'Γραμμή 2', 'Γραμμή 3'], colAxis: ['Στήλη 1', 'Στήλη 2'], entries: [{ lemma: 'λήμμα', meta: '', cells: [['', ''], ['', ''], ['', '']] }] }] };
    scheduleContentSave(content);
  }
  sub.games.push({ id: newId, type, label: t.label, labelEn: t.label, ic: t.ic, tier: 'free', content });
  audit('studio.game.add · ' + type + ' → ' + sub.label);
  if (window.ccConfirmNo) ccConfirmNo();
  paint(); toast(`Added «${t.label}»${content ? ' — opens with a starter you can edit' : ''}`);
};

// ════════ units (rhapsodies) ════════════════════════════════════
window.ccSUnitRename = (key, v) => { const u = gameData(gmContent()).units.find(x => x.key === key); if (u) { u.label = v; audit('studio.rhapsody.rename · ' + key); } };
window.ccSUnitAdd = () => { const d = gameData(gmContent());
  const used = d.units.map(u => u.key);
  const RH = ['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω'];
  const next = RH.find(r => !used.includes(r)) || String(d.units.length + 1);
  d.units.push({ key: next, label: 'Νέα ' + (d.unitWord || 'Ενότητα'), questions: [], texts: [] });
  audit('studio.rhapsody.add · ' + next); paint(); toast(`${d.unitWord} ${next} added`); };
window.ccSUnitDel = key => { const d = gameData(gmContent()), u = d.units.find(x => x.key === key);
  const go = () => { d.units = d.units.filter(x => x.key !== key); audit('studio.rhapsody.delete · ' + key); paint(); toast('Rhapsody removed'); };
  if (u.questions.length === 0 && (!u.texts || u.texts.length === 0)) { go(); return; }
  _confirm({ title: `Delete ${d.unitWord} «${u.label}»?`, danger: true,
    intro: 'This removes the rhapsody and everything inside it.',
    lines: [{ k: 'Questions', v: String(u.questions.length) }, { k: 'Texts', v: String(u.texts ? u.texts.length : 0) }],
    confirmLabel: 'Delete rhapsody', onConfirm: go });
};

// ════════ questions ═════════════════════════════════════════════
function curUnit() { const d = gameData(gmContent()); return d.units.find(x => x.key === S.unit); }
window.ccSQField = (i, f, v) => { curUnit().questions[i][f] = v; audit('studio.question.edit'); };
window.ccSQOpt = (i, oi, v) => { curUnit().questions[i].opts[oi] = v; audit('studio.question.opt'); };
window.ccSQAns = (i, oi) => { curUnit().questions[i].ans = oi; audit('studio.question.answer'); paint(); };
window.ccSQAdd = (t) => {
  t = t || 'mc';
  let q;
  if (t === 'tf')         q = { type: 'tf', q: 'Νέα πρόταση…', opts: ['Σωστό', 'Λάθος'], ans: 0 };
  else if (t === 'fill')  q = { type: 'fill', q: 'Συμπλήρωσε το ___ .', gap: '', opts: [], ans: 0 };
  else if (t === 'match') q = { type: 'match', q: 'Αντιστοίχισε', pairs: [['', ''], ['', ''], ['', '']], opts: [], ans: 0 };
  else if (t === 'order') q = { type: 'order', q: 'Βάλε σε σειρά', seq: ['', '', ''], opts: [], ans: 0 };
  else                    q = { q: 'Νέα ερώτηση;', opts: ['Επιλογή Α', 'Επιλογή Β', 'Επιλογή Γ', 'Επιλογή Δ'], ans: 0 };
  _syncShadow(q);
  curUnit().questions.push(q);
  audit('studio.question.add'); paint(); toast('Προστέθηκε ερώτηση');
};
window.ccSQDel = i => {
  const go = () => { curUnit().questions.splice(i, 1); audit('studio.question.delete'); paint(); toast('Question deleted'); };
  _confirm({ title: 'Διαγραφή ερώτησης; / Delete question?', danger: true,
    intro: 'Αφαιρεί οριστικά αυτή την ερώτηση. / Permanently removes this question.',
    confirmLabel: 'Διαγραφή / Delete', onConfirm: go });
};
// ── reimagined per-type authoring ──
window.ccSQType = (i, t) => { const q = curUnit().questions[i]; _convertType(q, t); _syncShadow(q); audit('studio.question.type'); paint(); };
window.ccSQDup = i => { const u = curUnit(); u.questions.splice(i + 1, 0, clone(u.questions[i])); audit('studio.question.add'); paint(); toast('Διπλασιάστηκε'); };
window.ccSQOptAdd = i => { const q = curUnit().questions[i]; if ((q.opts || []).length < 8) { q.opts.push(''); audit('studio.question.opt'); paint(); } };
window.ccSQOptDel = (i, oi) => { const q = curUnit().questions[i]; if (q.opts.length > 2) { q.opts.splice(oi, 1); if (q.ans >= q.opts.length) q.ans = 0; else if (q.ans > oi) q.ans--; audit('studio.question.opt'); paint(); } };
window.ccSQGap = (i, v) => { const q = curUnit().questions[i]; q.gap = v; _syncShadow(q); audit('studio.question.edit'); };
window.ccSQMarkGap = i => { const q = curUnit().questions[i]; if (!/___/.test(q.q || '')) { q.q = (q.q || '').replace(/\s*$/, '') + ' ___'; audit('studio.question.edit'); paint(); } };
window.ccSQPair = (i, pi, side, v) => { const q = curUnit().questions[i]; (q.pairs[pi] = q.pairs[pi] || ['', ''])[side] = v; _syncShadow(q); audit('studio.question.edit'); };
window.ccSQPairAdd = i => { const q = curUnit().questions[i]; (q.pairs = q.pairs || []).push(['', '']); _syncShadow(q); audit('studio.question.edit'); paint(); };
window.ccSQPairDel = (i, pi) => { const q = curUnit().questions[i]; q.pairs.splice(pi, 1); _syncShadow(q); audit('studio.question.edit'); paint(); };
window.ccSQSeq = (i, si, v) => { const q = curUnit().questions[i]; q.seq[si] = v; _syncShadow(q); audit('studio.question.edit'); };
window.ccSQSeqAdd = i => { const q = curUnit().questions[i]; (q.seq = q.seq || []).push(''); _syncShadow(q); audit('studio.question.edit'); paint(); };
window.ccSQSeqDel = (i, si) => { const q = curUnit().questions[i]; q.seq.splice(si, 1); _syncShadow(q); audit('studio.question.edit'); paint(); };

// ════════ bulk import — premade questions from CSV / JSON ════════
// Append many { q, opts, ans } questions to the open rhapsody at once. MC is
// the authoring format; Καταιγισμός derives Σωστό/Λάθος, Αντιστοίχιση & Σειρά
// from it automatically. Saved via the normal content-save path (audit()).
let _imp = null;   // { unit, fileName, rows:[valid questions], errors:[{line,msg}] }

// Resolve a "correct" token (A–H / Α–Θ / 1–N / exact option text) → 0-based index.
function _resolveCorrect(tok, opts) {
  tok = String(tok == null ? '' : tok).trim();
  if (!tok) return -1;
  const ti = opts.findIndex(o => o.trim().toLowerCase() === tok.toLowerCase());
  if (ti >= 0) return ti;                                   // exact text
  if (/^\d+$/.test(tok)) { const n = +tok - 1; return (n >= 0 && n < opts.length) ? n : -1; }  // 1-based number
  if (tok.length === 1) {                                   // single letter (Latin or Greek)
    const up = tok.toUpperCase();
    const lat = 'ABCDEFGH'.indexOf(up); if (lat >= 0 && lat < opts.length) return lat;
    const gr = 'ΑΒΓΔΕΖΗΘ'.indexOf(up);  if (gr >= 0 && gr < opts.length) return gr;
  }
  return -1;
}
function _mkQuestion(q, opts, correctTok, line, errors) {
  q = String(q == null ? '' : q).trim();
  opts = (opts || []).map(o => String(o == null ? '' : o).trim()).filter(o => o !== '');
  if (!q) { errors.push({ line, msg: 'κενή ερώτηση' }); return null; }
  if (opts.length < 2) { errors.push({ line, msg: 'χρειάζονται ≥2 επιλογές' }); return null; }
  if (opts.length > 6) opts = opts.slice(0, 6);
  const ans = _resolveCorrect(correctTok, opts);
  if (ans < 0) { errors.push({ line, msg: 'άγνωστη σωστή απάντηση «' + String(correctTok).trim() + '»' }); return null; }
  return { q, opts, ans };
}
// Minimal CSV parser: quoted fields, "" escapes, newlines inside quotes, and
// comma / tab / semicolon delimiters (Excel in some locales exports ';').
function _parseCSV(text) {
  const nl = text.indexOf('\n'); const first = nl < 0 ? text : text.slice(0, nl);
  const cnt = ch => first.split(ch).length - 1;
  let delim = ','; if (cnt('\t') > cnt(',') && cnt('\t') >= cnt(';')) delim = '\t'; else if (cnt(';') > cnt(',')) delim = ';';
  const rows = []; let row = [], field = '', inQ = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQ) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else inQ = false; }
      else field += c;
    } else if (c === '"') inQ = true;
    else if (c === delim) { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}
// Parse a CSV or JSON file into { rows:[{q,opts,ans}], errors:[{line,msg}] }.
function _parseImport(text, fileName) {
  text = String(text || '').replace(/^﻿/, '');
  const isJson = /\.json$/i.test(fileName) || /^\s*[[{]/.test(text);
  const rows = [], errors = [];
  if (isJson) {
    let data; try { data = JSON.parse(text); } catch (e) { throw new Error('μη έγκυρο JSON'); }
    const arr = Array.isArray(data) ? data : (data && Array.isArray(data.questions) ? data.questions : null);
    if (!arr) throw new Error('το JSON πρέπει να είναι πίνακας ερωτήσεων');
    arr.forEach((it, i) => {
      if (!it || typeof it !== 'object') { errors.push({ line: i + 1, msg: 'μη έγκυρη εγγραφή' }); return; }
      const q = it.q != null ? it.q : it.question;
      const opts = Array.isArray(it.opts) ? it.opts : (Array.isArray(it.options) ? it.options : []);
      const correctTok = (typeof it.ans === 'number') ? String(it.ans + 1)
        : (it.correct != null ? it.correct : it.answer);
      const mk = _mkQuestion(q, opts, correctTok, i + 1, errors); if (mk) rows.push(mk);
    });
  } else {
    const table = _parseCSV(text);
    let start = 0;
    if (table.length && /^(question|ερώτηση|quest|q)$/i.test(String(table[0][0] || '').trim())) start = 1;
    for (let r = start; r < table.length; r++) {
      const cells = table[r];
      if (!cells || cells.every(c => String(c).trim() === '')) continue;
      if (cells.length < 3) { errors.push({ line: r + 1, msg: 'χρειάζονται: ερώτηση, επιλογές, σωστή' }); continue; }
      const mk = _mkQuestion(cells[0], cells.slice(1, -1), cells[cells.length - 1], r + 1, errors);
      if (mk) rows.push(mk);
    }
  }
  return { rows, errors };
}
function _qDownload(filename, text, mime) {
  try {
    const url = URL.createObjectURL(new Blob([text], { type: mime || 'text/plain;charset=utf-8' }));
    const a = document.createElement('a'); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 0);
  } catch (e) { toast('Αποτυχία λήψης.'); }
}

window.ccQImportFile = (input) => {
  const f = input.files && input.files[0]; input.value = ''; if (!f) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = _parseImport(String(reader.result || ''), f.name);
      _imp = { unit: S.unit, fileName: f.name, rows: parsed.rows, errors: parsed.errors };
      paint();
      if (!parsed.rows.length) toast('Δεν βρέθηκαν έγκυρες ερωτήσεις.');
    } catch (e) { _imp = null; toast('Αποτυχία: ' + (e && e.message || e)); }
  };
  reader.onerror = () => toast('Αποτυχία ανάγνωσης αρχείου.');
  reader.readAsText(f, 'utf-8');
};
window.ccQImportConfirm = () => {
  if (!_imp || _imp.unit !== S.unit || !_imp.rows.length) return;
  const u = curUnit(); if (!u) { _imp = null; return; }
  const n = _imp.rows.length;
  u.questions.push(...clone(_imp.rows));
  _imp = null; audit('studio.question.import'); paint(); toast(n + ' ερωτήσεις προστέθηκαν');
};
window.ccQImportCancel = () => { _imp = null; paint(); };
window.ccQTemplate = () => {
  _qDownload('trivia-template.csv', '﻿' +
    'question,optionA,optionB,optionC,optionD,correct\n' +
    '"Ποιος συνέθεσε την Ιλιάδα;",Όμηρος,Ησίοδος,Σαπφώ,Πίνδαρος,A\n' +
    '"Πόσες ραψωδίες έχει η Ιλιάδα;",12,18,24,36,C\n' +
    '"Η μητέρα του Αχιλλέα ήταν η…",Ήρα,Θέτιδα,Αθηνά,Αφροδίτη,B\n',
    'text/csv;charset=utf-8');
};
function _qImportPanel(u) {
  const e = _imp;
  const errs = e.errors.length
    ? `<div class="qimp-errors">${e.errors.slice(0, 6).map(x => `<div>γρ. ${x.line}: ${esc(x.msg)}</div>`).join('')}${e.errors.length > 6 ? `<div>…και ${e.errors.length - 6} ακόμη</div>` : ''}</div>`
    : '';
  const prev = e.rows.slice(0, 4).map(q =>
    `<div class="qimp-pq"><b>${esc(q.q)}</b><div class="qimp-po">${q.opts.map((o, i) => `<span class="${i === q.ans ? 'ok' : ''}">${esc(o)}</span>`).join('')}</div></div>`).join('');
  return `<div class="qimp-panel">
    <div class="qimp-hd"><b>${esc(e.fileName)}</b> — <span class="qimp-ok-n">${e.rows.length}</span> έγκυρες${e.errors.length ? ` · <span class="qimp-err">${e.errors.length} με σφάλμα</span>` : ''}
      <button class="st-del" title="Κλείσιμο" onclick="ccQImportCancel()">✕</button></div>
    ${errs}
    <div class="qimp-preview">${prev || '<div class="st-empty">Καμία έγκυρη ερώτηση.</div>'}${e.rows.length > 4 ? `<div class="qimp-more">…+${e.rows.length - 4} ακόμη</div>` : ''}</div>
    <div class="qimp-actions">
      <button class="st-add" onclick="ccQImportConfirm()" ${e.rows.length ? '' : 'disabled'}><span class="ai">＋</span> Προσθήκη ${e.rows.length} στη «${esc(u.label)}»</button>
      <button class="st-open" onclick="ccQImportCancel()">Άκυρο</button>
    </div>
  </div>`;
}

// ════════ texts ═════════════════════════════════════════════════
window.ccSTextField = (ukey, ti, f, v) => { const u = gameData(gmContent()).units.find(x => x.key === ukey); u.texts[ti][f] = v; audit('studio.text.edit'); };
window.ccSTextAdd = () => { const d = gameData(gmContent()); const u = (S.unit && d.units.find(x => x.key === S.unit)) || d.units[0]; (u.texts = u.texts || []).push({ title: 'Νέο κείμενο', body: '' });
  audit('studio.text.add'); paint(); toast(`Text added to ${d.unitWord} ${u.key}`); };
window.ccSTextDel = (ukey, ti) => {
  const u = gameData(gmContent()).units.find(x => x.key === ukey);
  const ttl = (u.texts[ti] && u.texts[ti].title) || '';
  const go = () => { u.texts.splice(ti, 1); audit('studio.text.delete'); paint(); toast('Text deleted'); };
  _confirm({ title: 'Διαγραφή κειμένου; / Delete text?', danger: true,
    intro: ttl ? `Αφαιρεί το κείμενο «${esc(ttl)}». / Removes the passage «${esc(ttl)}».`
               : 'Αφαιρεί αυτό το κείμενο. / Removes this passage.',
    confirmLabel: 'Διαγραφή / Delete', onConfirm: go });
};

// ════════ paradigm interactions ═════════════════════════════════
function curP() { return gameData(gmContent()).units.find(u => u.key === S.unit); }
window.ccPUnitRename = (key, v) => { const u = gameData(gmContent()).units.find(x => x.key === key); if (u) { u.label = v; audit('studio.paradigm.rename · ' + key); } };
window.ccPUnitAdd = () => { const d = gameData(gmContent()); const k = String(d.units.length + 1);
  d.units.push({ key: k, label: 'Νέα ' + (d.unitWord || 'ενότητα'), rowAxis: ['Γραμμή 1', 'Γραμμή 2', 'Γραμμή 3'], colAxis: ['Στήλη 1', 'Στήλη 2'], entries: [{ lemma: 'λήμμα', meta: '', cells: [['', ''], ['', ''], ['', '']] }] });
  audit('studio.paradigm.slice.add'); paint(); toast(`${d.unitWord} added`); };
window.ccPUnitDel = key => { const d = gameData(gmContent()), u = d.units.find(x => x.key === key);
  const go = () => { d.units = d.units.filter(x => x.key !== key); audit('studio.paradigm.slice.delete · ' + key); paint(); toast('Slice removed'); };
  if (u.entries.length <= 1) { go(); return; }
  _confirm({ title: `Delete «${u.label}»?`, danger: true, intro: 'Removes this slice and its paradigm table(s).',
    lines: [{ k: 'Λήμματα', v: String(u.entries.length) }, { k: 'Πίνακας', v: `${u.rowAxis.length}×${u.colAxis.length}` }], confirmLabel: 'Delete', onConfirm: go });
};
window.ccPCell = (ei, ri, ci, v) => { const e = curP().entries[ei]; if (!e.cells[ri]) e.cells[ri] = []; e.cells[ri][ci] = v; audit('studio.paradigm.cell'); };
window.ccPLemma = (ei, v) => { curP().entries[ei].lemma = v; audit('studio.paradigm.lemma'); };
window.ccPMeta = (ei, v) => { curP().entries[ei].meta = v; audit('studio.paradigm.meta'); };
window.ccPRowLabel = (ri, v) => { curP().rowAxis[ri] = v; audit('studio.paradigm.row.label'); };
window.ccPColLabel = (ci, v) => { curP().colAxis[ci] = v; audit('studio.paradigm.col.label'); };
window.ccPAddRow = () => { const u = curP(); u.rowAxis.push('Γραμμή ' + (u.rowAxis.length + 1)); u.entries.forEach(e => e.cells.push(u.colAxis.map(() => ''))); audit('studio.paradigm.row.add'); paint(); };
window.ccPDelRow = ri => { const u = curP(); if (u.rowAxis.length <= 1) return;
  const go = () => { u.rowAxis.splice(ri, 1); u.entries.forEach(e => e.cells.splice(ri, 1)); audit('studio.paradigm.row.del'); paint(); toast('Row removed'); };
  _confirm({ title: 'Διαγραφή γραμμής; / Delete row?', danger: true,
    intro: `Αφαιρεί τη γραμμή «${esc(u.rowAxis[ri] || '')}» και τα κελιά της σε όλα τα λήμματα. / Removes the row «${esc(u.rowAxis[ri] || '')}» and its cells across every entry.`,
    confirmLabel: 'Διαγραφή / Delete', onConfirm: go });
};
window.ccPAddCol = () => { const u = curP(); u.colAxis.push('Στήλη ' + (u.colAxis.length + 1)); u.entries.forEach(e => e.cells.forEach(r => r.push(''))); audit('studio.paradigm.col.add'); paint(); };
window.ccPDelCol = ci => { const u = curP(); if (u.colAxis.length <= 1) return;
  const go = () => { u.colAxis.splice(ci, 1); u.entries.forEach(e => e.cells.forEach(r => r.splice(ci, 1))); audit('studio.paradigm.col.del'); paint(); toast('Column removed'); };
  _confirm({ title: 'Διαγραφή στήλης; / Delete column?', danger: true,
    intro: `Αφαιρεί τη στήλη «${esc(u.colAxis[ci] || '')}» και τα κελιά της σε όλα τα λήμματα. / Removes the column «${esc(u.colAxis[ci] || '')}» and its cells across every entry.`,
    confirmLabel: 'Διαγραφή / Delete', onConfirm: go });
};
window.ccPAddEntry = () => { const u = curP(); u.entries.push({ lemma: 'νέο λήμμα', meta: '', cells: u.rowAxis.map(() => u.colAxis.map(() => '')) }); audit('studio.paradigm.word.add'); paint(); toast('Word added'); };
window.ccPDelEntry = ei => { const u = curP();
  const lemma = (u.entries[ei] && u.entries[ei].lemma) || '';
  const go = () => { u.entries.splice(ei, 1); audit('studio.paradigm.word.del'); paint(); toast('Word removed'); };
  _confirm({ title: 'Διαγραφή λήμματος; / Delete word?', danger: true,
    intro: lemma ? `Αφαιρεί το λήμμα «${esc(lemma)}» και όλα τα κελιά του. / Removes the entry «${esc(lemma)}» and all its cells.`
                 : 'Αφαιρεί αυτό το λήμμα και όλα τα κελιά του. / Removes this entry and all its cells.',
    confirmLabel: 'Διαγραφή / Delete', onConfirm: go });
};

// ════════ LEVELS & ACCESS (per-class curriculum) ════════════════
// Inline surface for the SAME store the Class Plan writes:
// classes/{classKey}/curriculum/main = { datasets:{[id]:{enabled,levels[]}}, engines:{[id]:{enabled}} }.
// Direct Firestore writes are allowed by the rules (can('curriculum')); we
// merge-write only the touched dataset/engine so the rest of the doc is kept.
const STUDENT_CLASSES = [
  { key: 'gym-a', label: 'Α΄ Γυμν.' }, { key: 'gym-b', label: 'Β΄ Γυμν.' }, { key: 'gym-c', label: 'Γ΄ Γυμν.' },
  { key: 'lyk-a', label: 'Α΄ Λυκ.' }, { key: 'lyk-b', label: 'Β΄ Λυκ.' }, { key: 'lyk-c', label: 'Γ΄ Λυκ.' },
];
let _laClass = null;
const _curTimers = Object.create(null);

function _gpDatasets() { return (typeof GP_DATASETS !== 'undefined' && GP_DATASETS) || window.GP_DATASETS || []; }
function _gpEngines() { return (typeof GP_ENGINES !== 'undefined' && GP_ENGINES) || window.GP_ENGINES || []; }
function _gameTarget(game) {
  if (!game) return null;
  const DS = _gpDatasets(), EN = _gpEngines();
  const ds = DS.find(d => d.id === game.content) || DS.find(d => d.id === game.type);
  if (ds) return { kind: 'dataset', id: ds.id, ds };
  const en = EN.find(e => e.id === game.type) || EN.find(e => e.id === game.content);
  if (en) return { kind: 'engine', id: en.id, en };
  return null;
}
function _laLevels(ds) {
  if (!ds || !(ds.leveled && ds.levelsGlobal) || typeof _cpResolveLevels !== 'function') return null;
  const a = _cpResolveLevels(ds.levelsGlobal);
  return Array.isArray(a) && a.length ? a : null;
}
async function ensureCurriculum(classKey) {
  if (M.curriculum[classKey]) return M.curriculum[classKey];
  let data = { datasets: {}, engines: {} };
  try {
    const snap = await firebase.firestore().doc(`classes/${classKey}/curriculum/main`).get();
    if (snap.exists) { const d = snap.data(); data = { datasets: d.datasets || {}, engines: d.engines || {} }; }
  } catch (_) {}
  M.curriculum[classKey] = data; return data;
}

function _levelsAccessPanel(game) {
  const tgt = _gameTarget(game);
  const head = `<div class="st-la-title">🔓 Επίπεδα &amp; Πρόσβαση <span class="st-la-sub">per class</span></div>`;
  if (!tgt) return `<div class="st-la">${head}<div class="cc-note">This game isn't a leveled dataset or a known engine, so there's nothing to unlock per class here.</div></div>`;
  const cls = (_laClass && STUDENT_CLASSES.some(c => c.key === _laClass)) ? _laClass
            : (STUDENT_CLASSES.some(c => c.key === S.grade) ? S.grade : STUDENT_CLASSES[0].key);
  _laClass = cls;
  const cur = M.curriculum[cls];
  const tabs = STUDENT_CLASSES.map(c => `<button class="st-la-cls${c.key === cls ? ' on' : ''}" onclick="ccLAClass('${c.key}')">${esc(c.label)}</button>`).join('');
  let body;
  if (!cur) { ensureCurriculum(cls).then(paint); body = '<div class="cc-note">Loading class curriculum…</div>'; }
  else if (tgt.kind === 'engine') {
    const on = (cur.engines[tgt.id] || {}).enabled !== false;
    body = _laEnableRow(on) + `<div class="cc-note">«${esc(tgt.en.label || tgt.id)}» is an <b>engine</b> — it has no levels of its own; it runs on whatever datasets are enabled for the class. Toggle whether this class can use it.</div>`;
  } else {
    const st = cur.datasets[tgt.id] || {};
    const lvls = _laLevels(tgt.ds);
    body = _laEnableRow(!!st.enabled) + (lvls ? _laPicker(lvls, Array.isArray(st.levels) ? st.levels : [], !!st.enabled)
      : '<div class="cc-note">This dataset has no levels — access is simply on/off per class.</div>');
  }
  return `<div class="st-la">
    <div class="st-la-hd">${head}<div class="st-la-tabs">${tabs}</div></div>
    ${body}
    <div class="st-la-foot">Saved to <code>classes/${esc(cls)}/curriculum/main</code> — the same store as <b>Curriculum → Class Plan</b>.</div>
  </div>`;
}
function _laEnableRow(on) {
  return `<label class="st-la-enable"><input type="checkbox" ${on ? 'checked' : ''} onchange="ccLAEnable(this.checked)"/><span>Διαθέσιμο για αυτή την τάξη</span></label>`;
}
function _laPicker(lvlArr, selected, on) {
  const groups = {}; lvlArr.forEach(l => { (groups[l.group || 'Επίπεδα'] = groups[l.group || 'Επίπεδα'] || []).push(l); });
  const sel = new Set(selected);
  const groupsHtml = Object.entries(groups).map(([grp, lvls]) => {
    const allSel = lvls.every(l => sel.has(l.id));
    const chips = lvls.map(l => `<button class="cp-lyo-chip cp-lyo-chip--${l.color || 'lgreen'}${sel.has(l.id) ? ' selected' : ''}" title="${esc(l.desc || '')}" onclick="ccLALevel(${l.id})">${l.id}</button>`).join('');
    const grpArg = String(grp).replace(/'/g, "\\'");
    return `<div class="cp-lyo-group"><div class="cp-lyo-grp-hd"><span class="cp-lyo-grp-name">${esc(grp)}</span><button class="cp-lyo-grp-btn${allSel ? ' active' : ''}" onclick="ccLAGroup('${grpArg}')">${allSel ? '✓ Όλα' : 'Επιλογή Όλων'}</button></div><div class="cp-lyo-chips">${chips}</div></div>`;
  }).join('');
  return `<div class="cp-lyo-picker${on ? '' : ' cp-lyo-picker--hidden'}" style="margin-top:10px">
    <div class="cp-lyo-picker-hd"><span class="cp-lyo-picker-title">Επίπεδα</span><span class="cp-lyo-picker-count">${selected.length}/${lvlArr.length} επίπεδα</span>
      <button class="cp-lyo-all-btn" onclick="ccLAAll(true)">Όλα</button><button class="cp-lyo-all-btn" onclick="ccLAAll(false)">Κανένα</button></div>
    <div class="cp-lyo-groups">${groupsHtml}</div></div>`;
}

function _laTarget() { return _gameTarget(gameNode(S.grade, S.subject, S.game)); }
function _laState() {
  const cur = M.curriculum[_laClass], t = _laTarget(); if (!cur || !t) return null;
  const bag = t.kind === 'engine' ? cur.engines : cur.datasets;
  return (bag[t.id] = bag[t.id] || {});
}
window.ccLAClass = k => { _laClass = k; if (!M.curriculum[k]) ensureCurriculum(k).then(paint); else paint(); };
window.ccLAEnable = on => { const st = _laState(); if (!st) return; st.enabled = !!on; _laSave(); paint(); };
window.ccLALevel = id => { const st = _laState(); if (!st) return; const s = new Set(Array.isArray(st.levels) ? st.levels : []); s.has(id) ? s.delete(id) : s.add(id); st.levels = [...s]; _laSave(); paint(); };
window.ccLAGroup = grp => { const t = _laTarget(), st = _laState(); if (!t || !st) return; const ids = (_laLevels(t.ds) || []).filter(l => (l.group || 'Επίπεδα') === grp).map(l => l.id); const s = new Set(Array.isArray(st.levels) ? st.levels : []); const allSel = ids.every(i => s.has(i)); ids.forEach(i => allSel ? s.delete(i) : s.add(i)); st.levels = [...s]; _laSave(); paint(); };
window.ccLAAll = all => { const t = _laTarget(), st = _laState(); if (!t || !st) return; st.levels = all ? (_laLevels(t.ds) || []).map(l => l.id) : []; _laSave(); paint(); };

function _laSave() {
  const cls = _laClass, t = _laTarget(), st = _laState(); if (!cls || !t || !st) return;
  _status('saving'); clearTimeout(_curTimers[cls]);
  const payload = t.kind === 'engine'
    ? { engines: { [t.id]: { enabled: st.enabled !== false } } }
    : { datasets: { [t.id]: { enabled: !!st.enabled, levels: Array.isArray(st.levels) ? st.levels : [] } } };
  _curTimers[cls] = setTimeout(async () => {
    try { await firebase.firestore().doc(`classes/${cls}/curriculum/main`).set(payload, { merge: true });
      if (window.CurriculumGate) CurriculumGate.bust(cls); _status('saved'); }
    catch (e) { _status('error', _errMsg(e)); }
  }, 700);
}

// ════════════════════════════════════════════════════════════════════
//  TRIVIA SUBJECTS — editor for the trivia launcher presets
//  (games/trivia-panel/panel.js · window.TRIVIA_SUBJECTS). Renames, adds,
//  removes and re-themes the subject presets a teacher sees when a trivia
//  opens. Persisted to config/triviaSubjects (admin-writable, world-readable)
//  so edits survive reloads AND redeploys — no code change. Export-to-code
//  regenerates the SUBJECTS literal for committing back into panel.js.
// ════════════════════════════════════════════════════════════════════
const TS = { subjects: null, order: [], loaded: false, loading: false, editing: null, showCode: false };
let _tsTimer = null;

// [field key, label, placeholder] for the eight bilingual {gr,en} presets.
const TS_BIL = [
  ['eyebrow', 'Υπέρτιτλος · eyebrow', 'ΟΜΗΡΙΚΟ ΕΠΟΣ'],
  ['titleEm', 'Τίτλος (έμφαση) · titleEm', 'Ἰλιάδας'],
  ['sub',     'Υπότιτλος · sub', 'Ένα παιχνίδι επικής γνώσης'],
  ['heading', 'Επικεφαλίδα επιλογής · heading', 'Επιλογή Ραψωδιών'],
  ['unit',    'Μονάδα ενικός · unit', 'Ραψωδία'],
  ['units',   'Μονάδες πληθ. · units', 'ραψωδίες'],
  ['whole',   'Όλη η ύλη · whole', 'Ολόκληρη η Ιλιάδα'],
  ['pickOne', 'Προτροπή · pickOne', '— διάλεξε ραψωδία —'],
];
const TS_GLYPHS = ['amphora', 'compass', 'column', 'laurel', 'swords', 'bolt', 'rope', 'dice'];

function _tsDeepMerge(base, ov) {
  const out = clone(base || {});
  if (!ov || typeof ov !== 'object') return out;
  Object.keys(ov).forEach(k => {
    const v = ov[k];
    if (v && typeof v === 'object' && !Array.isArray(v)) out[k] = _tsDeepMerge(out[k], v);
    else out[k] = Array.isArray(v) ? v.slice() : v;
  });
  return out;
}
// Guarantee a subject's full editable shape (mirrors panel.js _mergeSubject).
function _tsNormalize(s) {
  s = s || {};
  const o = {
    glyph: s.glyph || 'amphora',
    engineDataset: s.engineDataset || '',
    titlePre: (s.titlePre != null) ? String(s.titlePre) : 'Trivia',
    cols: (+s.cols > 0) ? +s.cols : 8,
    sections: Array.isArray(s.sections) ? s.sections.map(String) : [],
    initial: Array.isArray(s.initial) ? s.initial.map(String) : [],
  };
  TS_BIL.forEach(([k]) => { const b = s[k] || {}; o[k] = { gr: b.gr != null ? String(b.gr) : '', en: b.en != null ? String(b.en) : '' }; });
  o.initial = o.initial.filter(x => o.sections.includes(x));
  return o;
}
// Build the editor model: code defaults ⊕ saved Firestore override.
function _tsBuild(base, doc) {
  const subjects = {};
  const baseKeys = Object.keys(base || {});
  let order;
  if (doc && doc.subjects && typeof doc.subjects === 'object') {
    const src = doc.subjects;
    order = ((Array.isArray(doc.order) && doc.order.length) ? doc.order : Object.keys(src)).filter(k => src[k]);
    order.forEach(k => { subjects[k] = _tsNormalize(_tsDeepMerge(base[k] || {}, src[k])); });
  } else {
    order = baseKeys;
    baseKeys.forEach(k => { subjects[k] = _tsNormalize(base[k]); });
  }
  return { subjects, order };
}

async function tsLoad() {
  if (TS.loaded || TS.loading) return;
  TS.loading = true;
  const base = (window.TriviaSubjects && window.TriviaSubjects.base)
    ? window.TriviaSubjects.base()
    : (window.TRIVIA_SUBJECTS ? clone(window.TRIVIA_SUBJECTS) : {});
  let doc = null;
  try {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
      const snap = await firebase.firestore().doc('config/triviaSubjects').get(); if (snap.exists) doc = snap.data();
    }
  }
  catch (_) { /* offline / perms — start from the code defaults */ }
  const built = _tsBuild(base, doc);
  TS.subjects = built.subjects; TS.order = built.order;
  TS.loaded = true; TS.loading = false;
  if (S.section === 'trivia') paint();
}

// Debounced authoritative whole-doc write (so removals actually stick), then
// re-merge live into the panel via the editor bridge. Mirrors _laSave.
function tsSave() {
  _status('saving'); clearTimeout(_tsTimer);
  _tsTimer = setTimeout(async () => {
    try {
      const subjects = clone(TS.subjects), order = TS.order.slice();
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        const uid = (firebase.auth && firebase.auth().currentUser && firebase.auth().currentUser.uid) || null;
        await firebase.firestore().doc('config/triviaSubjects').set({
          subjects, order,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(), updatedBy: uid,
        });
      }
      if (window.TriviaSubjects && window.TriviaSubjects.apply) window.TriviaSubjects.apply({ subjects, order });
      _status('saved');
    } catch (e) { _status('error', _errMsg(e)); }
  }, 700);
}

const _tsSubj = key => TS.subjects && TS.subjects[key];

// ── edit ops (each mutates TS then schedules a save) ──
window.ccTSField = (key, field, v) => { const s = _tsSubj(key); if (!s) return; s[field] = (field === 'cols') ? Math.max(1, Math.min(12, +v || 8)) : v; tsSave(); };
window.ccTSBil = (key, field, lang, v) => { const s = _tsSubj(key); if (!s || !s[field]) return; s[field][lang] = v; tsSave(); };
window.ccTSSecEdit = (key, i, v) => { const s = _tsSubj(key); if (!s) return; v = String(v).trim(); if (!v) { paint(); return; } const old = s.sections[i]; s.sections[i] = v; const j = s.initial.indexOf(old); if (j >= 0) s.initial[j] = v; tsSave(); paint(); };
window.ccTSSecAdd = key => { const s = _tsSubj(key); if (!s) return; let n = s.sections.length + 1; while (s.sections.includes(String(n))) n++; s.sections.push(String(n)); tsSave(); paint(); };
window.ccTSSecDel = (key, i) => { const s = _tsSubj(key); if (!s) return;
  const sec = s.sections[i];
  const go = () => { const tok = s.sections.splice(i, 1)[0]; s.initial = s.initial.filter(x => x !== tok); tsSave(); paint(); };
  _confirm({ title: 'Διαγραφή ενότητας; / Delete section?', danger: true,
    intro: sec != null ? `Αφαιρεί την ενότητα «${esc(String(sec))}» από αυτό το trivia subject. / Removes the section «${esc(String(sec))}» from this trivia subject.`
                       : 'Αφαιρεί αυτή την ενότητα από το trivia subject. / Removes this section from the trivia subject.',
    confirmLabel: 'Διαγραφή / Delete', onConfirm: go });
};
window.ccTSInitial = (key, i) => { const s = _tsSubj(key); if (!s) return; const tok = s.sections[i]; if (tok == null) return; const j = s.initial.indexOf(tok); if (j >= 0) s.initial.splice(j, 1); else s.initial.push(tok); tsSave(); paint(); };

window.ccTSAdd = () => {
  const inp = document.getElementById('ts-newkey');
  const raw = ((inp && inp.value) || '').trim();
  if (!/^[a-z][a-z0-9_-]*$/i.test(raw)) { toast('Δώσε ένα έγκυρο key (γράμμα πρώτο, π.χ. mythology).'); return; }
  if (TS.subjects[raw]) { toast('Υπάρχει ήδη subject «' + raw + '».'); return; }
  TS.subjects[raw] = _tsNormalize({ titleEm: { gr: raw, en: raw }, sections: ['1', '2', '3'], initial: ['1'], cols: 8 });
  TS.order.push(raw);
  tsSave(); TS.editing = raw; TS.showCode = false; paint();
};
window.ccTSDup = key => {
  const s = _tsSubj(key); if (!s) return;
  let nk = key + '-copy', n = 2; while (TS.subjects[nk]) nk = key + '-copy' + (n++);
  TS.subjects[nk] = clone(s); TS.order.splice(TS.order.indexOf(key) + 1, 0, nk);
  tsSave(); TS.editing = nk; paint();
};
window.ccTSDel = key => {
  const s = _tsSubj(key); if (!s) return;
  _confirm({
    title: `Διαγραφή «${esc(s.titleEm.gr || key)}»;`, danger: true,
    intro: `Αφαιρεί το trivia subject <code>${esc(key)}</code> από τον launcher. Αν είναι συνδεδεμένο σε κουμπί (π.χ. <code>openTriviaPanel('${esc(key)}')</code>), φρόντισε να το αλλάξεις κι εκεί.`,
    lines: [{ k: 'Key', v: esc(key) }, { k: 'Ενότητες', v: String(s.sections.length) }],
    confirmLabel: 'Διαγραφή', onConfirm: () => {
      delete TS.subjects[key]; TS.order = TS.order.filter(k => k !== key);
      if (TS.editing === key) TS.editing = null;
      tsSave(); paint(); toast('Trivia subject removed');
    },
  });
};
window.ccTSMove = (key, dir) => {
  const i = TS.order.indexOf(key), j = i + dir;
  if (i < 0 || j < 0 || j >= TS.order.length) return;
  TS.order.splice(j, 0, TS.order.splice(i, 1)[0]);
  tsSave(); paint();
};

// ── navigation ──
window.ccTSEnter = (openKey) => { S.section = 'trivia'; S.grade = S.subject = S.game = S.unit = null; TS.editing = (typeof openKey === 'string' && openKey) ? openKey : null; TS.showCode = false; paint(); if (!TS.loaded) tsLoad(); };
window.ccTSOpen = key => { TS.editing = key; TS.showCode = false; paint(); };
window.ccTSBack = () => { TS.editing = null; paint(); };

// ── live preview: push current (unsaved) edits to the real panel, open it ──
window.ccTSPreview = key => {
  if (window.TriviaSubjects && window.TriviaSubjects.apply) window.TriviaSubjects.apply({ subjects: clone(TS.subjects), order: TS.order.slice() });
  if (typeof openTriviaPanel === 'function') openTriviaPanel(key);
  else toast('Το trivia panel δεν είναι φορτωμένο σε αυτή τη σελίδα.');
};

// ── export to code (regenerate the panel.js SUBJECTS literal) ──
function _tsQ(s) { return "'" + String(s == null ? '' : s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\n/g, '\\n') + "'"; }
const _tsBilLit = o => '{gr:' + _tsQ(o && o.gr) + ',en:' + _tsQ(o && o.en) + '}';
const _tsArrLit = a => '[' + (a || []).map(_tsQ).join(',') + ']';
const _tsKeyLit = k => /^[A-Za-z_$][\w$]*$/.test(k) ? k : _tsQ(k);
function _tsGenerateCode() {
  const body = TS.order.map(key => {
    const s = TS.subjects[key];
    return (
`    ${_tsKeyLit(key)}: {
      glyph:${_tsQ(s.glyph)}, engineDataset:${_tsQ(s.engineDataset)},
      eyebrow:${_tsBilLit(s.eyebrow)},
      titlePre:${_tsQ(s.titlePre)}, titleEm:${_tsBilLit(s.titleEm)},
      sub:${_tsBilLit(s.sub)},
      heading:${_tsBilLit(s.heading)},
      unit:${_tsBilLit(s.unit)}, units:${_tsBilLit(s.units)},
      whole:${_tsBilLit(s.whole)},
      pickOne:${_tsBilLit(s.pickOne)},
      sections:${_tsArrLit(s.sections)},
      initial:${_tsArrLit(s.initial)}, cols:${(+s.cols > 0) ? +s.cols : 8},
    },`);
  }).join('\n');
  return 'const SUBJECTS = {\n' + body + '\n};';
}
window.ccTSExport = () => { TS.showCode = true; paint(); };
window.ccTSExportClose = () => { TS.showCode = false; paint(); };
window.ccTSCopy = () => {
  const code = _tsGenerateCode();
  const done = () => toast('SUBJECTS code copied');
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(code).then(done, _tsCopyFallback); return; }
  } catch (_) {}
  _tsCopyFallback();
};
function _tsCopyFallback() {
  const ta = document.getElementById('ts-code'); if (!ta) return;
  try { ta.removeAttribute('readonly'); ta.focus(); ta.select(); document.execCommand('copy'); ta.setAttribute('readonly', ''); toast('SUBJECTS code copied'); } catch (_) {}
}

// ── views ──
function triviaView() {
  if (!TS.loaded) return `${_tsCrumb()}<div class="cc-note">Loading the trivia subjects…</div>`;
  return (TS.editing && _tsSubj(TS.editing)) ? triviaEditView(TS.editing) : triviaListView();
}
function _tsCrumb(editingKey) {
  const parts = [
    `<button class="st-crumb root" onclick="ccSGo()">◆ Site</button>`,
    `<span class="st-sep">›</span><button class="st-crumb${editingKey ? '' : ' cur'}" onclick="ccTSEnter()">🏆 Trivia Subjects</button>`,
  ];
  if (editingKey) { const s = _tsSubj(editingKey); parts.push(`<span class="st-sep">›</span><span class="st-crumb cur">${esc((s && s.titleEm.gr) || editingKey)}</span>`); }
  return `<div class="st-bar"><div class="st-crumbs">${parts.join('')}</div><div class="st-status idle" id="st-status"></div></div>`;
}

function triviaListView() {
  const G = (window.TriviaSubjects && window.TriviaSubjects.glyph) ? window.TriviaSubjects.glyph : null;
  const rows = TS.order.map((key, i) => {
    const s = TS.subjects[key];
    const ic = G ? G(s.glyph, 22) : '🏆';
    return `<div class="st-row">
      <span class="ts-reorder">
        <button class="ts-arrow" title="Move up" onclick="ccTSMove('${key}',-1)" ${i === 0 ? 'disabled' : ''}>▲</button>
        <button class="ts-arrow" title="Move down" onclick="ccTSMove('${key}',1)" ${i === TS.order.length - 1 ? 'disabled' : ''}>▼</button>
      </span>
      <span class="ts-glyph" aria-hidden="true">${ic}</span>
      <span class="st-key">${esc(key)}</span>
      <div class="st-row-main">
        <input class="st-inp nm" value="${esc(s.titleEm.gr)}" onchange="ccTSBil('${key}','titleEm','gr',this.value)" aria-label="Title (Greek)" placeholder="Τίτλος (έμφαση)"/>
        <div class="st-row-sub"><code>${esc(s.engineDataset || '—')}</code> · ${s.sections.length} ${s.sections.length === 1 ? 'ενότητα' : 'ενότητες'} · ${esc(s.titlePre)} ${esc(s.titleEm.en)}</div>
      </div>
      <button class="st-open" onclick="ccTSOpen('${key}')">Open →</button>
      <button class="st-del" title="Duplicate" onclick="ccTSDup('${key}')">⧉</button>
      <button class="st-del" title="Delete subject" onclick="ccTSDel('${key}')">✕</button>
    </div>`;
  }).join('');
  return `${_tsCrumb()}
    <div class="cc-note"><b>Trivia Subjects.</b> These presets drive the trivia launcher (<code>window.TRIVIA_SUBJECTS</code>) — the eyebrow, title, subtitle and the unit labels/sections a teacher picks before a game. Rename the bold title inline (e.g. «Ἰλιάδας» → «Λογοτεχνίας»), or open a subject to edit every field in both languages. Saved to <code>config/triviaSubjects</code> — live on next open, surviving reloads &amp; redeploys.</div>
    <div class="st-list">${rows || '<div class="st-empty">No trivia subjects.</div>'}</div>
    <div class="ts-newrow">
      <input class="st-inp" id="ts-newkey" placeholder="key (π.χ. mythology)" aria-label="New subject key" onkeydown="if(event.key==='Enter'){event.preventDefault();ccTSAdd();}"/>
      <button class="st-add" onclick="ccTSAdd()"><span class="ai">＋</span> New subject</button>
      <button class="st-add ts-export" onclick="ccTSExport()"><span class="ai">⌁</span> Export to code</button>
    </div>
    ${TS.showCode ? _tsCodePanel() : ''}`;
}

function _tsCodePanel() {
  return `<div class="ts-code-wrap">
    <div class="ts-code-hd">
      <div>Paste into <code>games/trivia-panel/panel.js</code> — replaces the <code>const SUBJECTS = {…}</code> block. For version control only; the live site already reads your saved edits from Firestore.</div>
      <div class="ts-code-actions">
        <button class="st-open" onclick="ccTSCopy()">⧉ Copy</button>
        <button class="st-del" title="Close" onclick="ccTSExportClose()">✕</button>
      </div>
    </div>
    <textarea class="ts-code" id="ts-code" readonly rows="18" spellcheck="false" onclick="this.select()">${esc(_tsGenerateCode())}</textarea>
  </div>`;
}

function triviaEditView(key) {
  const s = _tsSubj(key);
  const G = (window.TriviaSubjects && window.TriviaSubjects.glyph) ? window.TriviaSubjects.glyph : null;
  const bil = (field, label, ph) => `<div class="ts-field">
      <label class="ts-flabel${field === 'titleEm' ? ' hot' : ''}">${esc(label)}${field === 'titleEm' ? ' <span class="ts-hot-tag">rename</span>' : ''}</label>
      <div class="ts-bil">
        <input class="st-inp" value="${esc(s[field].gr)}" onchange="ccTSBil('${key}','${field}','gr',this.value)" placeholder="${esc(ph)}" aria-label="${esc(label)} Greek"/>
        <input class="st-inp en" value="${esc(s[field].en)}" onchange="ccTSBil('${key}','${field}','en',this.value)" placeholder="English" aria-label="${esc(label)} English"/>
      </div>
    </div>`;
  const glyphOpts = TS_GLYPHS.map(g => `<option value="${g}" ${s.glyph === g ? 'selected' : ''}>${g}</option>`).join('');
  const secChips = s.sections.map((tok, i) => {
    const on = s.initial.includes(tok);
    return `<span class="ts-sec${on ? ' start' : ''}">
      <button class="ts-sec-star" title="${on ? 'Προεπιλεγμένη στην εκκίνηση' : 'Όρισε ως προεπιλογή εκκίνησης (initial)'}" onclick="ccTSInitial('${key}',${i})">★</button>
      <input class="ts-sec-in" value="${esc(tok)}" onchange="ccTSSecEdit('${key}',${i},this.value)" aria-label="Section ${i + 1}"/>
      <button class="ts-sec-x" title="Remove" onclick="ccTSSecDel('${key}',${i})">✕</button>
    </span>`;
  }).join('');
  return `${_tsCrumb(key)}
    <div class="st-gamehd">
      <span class="ts-glyph big" aria-hidden="true">${G ? G(s.glyph, 34) : '🏆'}</span>
      <div style="flex:1;min-width:0">
        <div class="st-gamehd-nm">${esc(s.titlePre)} <em style="color:var(--cc-bronze)">${esc(s.titleEm.gr || key)}</em></div>
        <div class="st-gamehd-sub"><code>TRIVIA_SUBJECTS.${esc(key)}</code> · <code>openTriviaPanel('${esc(key)}')</code></div>
      </div>
      <button class="st-preview" onclick="ccTSPreview('${key}')" title="Preview the launcher with these (unsaved) edits">▶ Preview</button>
    </div>

    <div class="ts-group"><div class="ts-group-h">Ταυτότητα · Identity</div>
      <div class="ts-fgrid">
        <div class="ts-field"><label class="ts-flabel">Key</label><input class="st-inp ts-ro" value="${esc(key)}" readonly title="The launch id — fixed (referenced by openTriviaPanel calls in code)."/></div>
        <div class="ts-field"><label class="ts-flabel">Glyph · εικονίδιο</label><select class="st-inp ts-sel" onchange="ccTSField('${key}','glyph',this.value)" aria-label="Glyph">${glyphOpts}</select></div>
        <div class="ts-field"><label class="ts-flabel">Engine dataset</label><input class="st-inp" value="${esc(s.engineDataset)}" onchange="ccTSField('${key}','engineDataset',this.value)" placeholder="iliada / odyssey / istoria" aria-label="Engine dataset"/></div>
        <div class="ts-field"><label class="ts-flabel">Στήλες · cols</label><input class="st-inp" type="number" min="1" max="12" value="${+s.cols || 8}" onchange="ccTSField('${key}','cols',this.value)" aria-label="Grid columns"/></div>
        <div class="ts-field"><label class="ts-flabel">Πρόθεμα τίτλου · titlePre</label><input class="st-inp" value="${esc(s.titlePre)}" onchange="ccTSField('${key}','titlePre',this.value)" placeholder="Trivia" aria-label="Title prefix"/></div>
      </div>
    </div>

    <div class="ts-group"><div class="ts-group-h">Επικεφαλίδα · Header text</div>
      <div class="ts-fcol">
        ${bil('eyebrow', 'Υπέρτιτλος · eyebrow', 'ΟΜΗΡΙΚΟ ΕΠΟΣ')}
        ${bil('titleEm', 'Τίτλος (έμφαση) · titleEm', 'Ἰλιάδας')}
        ${bil('sub', 'Υπότιτλος · sub', 'Ένα παιχνίδι επικής γνώσης')}
      </div>
    </div>

    <div class="ts-group"><div class="ts-group-h">Ετικέτες ύλης · Content labels</div>
      <div class="ts-fcol">
        ${bil('heading', 'Επικεφαλίδα επιλογής · heading', 'Επιλογή Ραψωδιών')}
        ${bil('unit', 'Μονάδα ενικός · unit', 'Ραψωδία')}
        ${bil('units', 'Μονάδες πληθ. · units', 'ραψωδίες')}
        ${bil('whole', 'Όλη η ύλη · whole', 'Ολόκληρη η Ιλιάδα')}
        ${bil('pickOne', 'Προτροπή · pickOne', '— διάλεξε ραψωδία —')}
      </div>
    </div>

    <div class="ts-group"><div class="ts-group-h">Ενότητες · Sections <span class="ts-group-note">★ = προεπιλεγμένη στην εκκίνηση (initial)</span></div>
      <div class="ts-secs">${secChips || '<span class="st-empty" style="padding:6px 8px">Καμία ενότητα.</span>'}
        <button class="ts-sec-add" title="Add section" onclick="ccTSSecAdd('${key}')">＋</button>
      </div>
    </div>

    <button class="st-add" onclick="ccTSBack()">‹ Όλα τα subjects</button>`;
}

})();
