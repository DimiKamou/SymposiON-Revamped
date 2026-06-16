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
const S = { grade:null, subject:null, game:null, unit:null, tab:'units' };

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
  S.game = S.unit = null; S.tab = 'units';
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
    <div class="st-bulkbar"><button class="st-add" onclick="ccSAddGrammarAll()"><span class="ai">＋</span> Γραμματική σε όλες τις τάξεις (Α΄ Γυμν. → Γ΄ Λυκ.)</button></div>
    <div class="st-grid">${cards || '<div class="st-empty">No grades.</div>'}</div>`;
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
    <div class="st-list">${rows || '<div class="st-empty">No subjects.</div>'}</div>
    <button class="st-add" onclick="ccSSubjAdd()"><span class="ai">＋</span> Add subject</button>`;
}

// DEPTH 2 — games in a subject
function gamesView() {
  const sub = subject(S.grade, S.subject);
  const rows = sub.games.map((gm, i) => {
    const editable = !!gm.content;
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
  if (M.loadingCid === cid) return `${crumb()}<div class="cc-note">Loading content for <b>${esc(gm.label)}</b>…</div>`;
  const data = gameData(cid);
  if (!data) {
    return `${crumb()}<div class="cc-note">This game (<code>${esc(gm.type)}</code>) has no editable question/paradigm content yet. Trivia &amp; conjugation/declension games are editable; others store their content as levels or decks.</div>`;
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
    body = `<div class="st-list">${rows || '<div class="st-empty">No units.</div>'}</div>
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
      ${all.length ? rows : '<div class="st-empty"><div class="st-empty-t">No texts yet</div><div class="st-empty-s">Add a passage to a rhapsody.</div></div>'}
      <button class="st-add" onclick="ccSTextAdd()"><span class="ai">＋</span> Add text</button>`;
  }
  return `${crumb()}
    <div class="st-gamehd"><span class="st-row-ic big">${esc(gm.ic)}</span>
      <div><div class="st-gamehd-nm">${esc(gm.label)}</div>
        <div class="st-gamehd-sub"><code>gameContent/${esc(cid)}</code> · ${totalQ} ερωτήσεις σε ${data.units.length} ${esc(data.unitWord.toLowerCase())}ς</div></div></div>
    ${tabs}${body}`;
}

// DEPTH 4 — questions in a unit
function questionsView() {
  const data = gameData(gmContent()); const u = data.units.find(x => x.key === S.unit);
  if (!u) { S.unit = null; return gameContentView(); }
  const rows = u.questions.map((q, i) => `<div class="st-q drag" draggable="true" data-i="${i}"
      ondragstart="ccSDrag.start(event,'q',${i})" ondragover="ccSDrag.over(event)" ondrop="ccSDrag.drop(event,'q',${i})" ondragend="ccSDrag.end(event)">
    <div class="st-q-hd"><span class="st-grip">⠿</span><span class="st-q-n">${i + 1}</span>
      <input class="st-inp q" value="${esc(q.q)}" onchange="ccSQField(${i},'q',this.value)" placeholder="Ερώτηση…" aria-label="Question"/>
      <button class="st-del" title="delete question" onclick="ccSQDel(${i})">✕</button></div>
    <div class="st-opts">${q.opts.map((o, oi) => `<label class="st-opt ${q.ans === oi ? 'correct' : ''}">
      <input type="radio" name="ans${i}" ${q.ans === oi ? 'checked' : ''} onchange="ccSQAns(${i},${oi})" title="Mark correct"/>
      <span class="st-opt-dot"></span>
      <input class="st-inp o" value="${esc(o)}" onchange="ccSQOpt(${i},${oi},this.value)" aria-label="Option ${oi + 1}"/>
    </label>`).join('')}</div></div>`).join('');
  return `${crumb()}
    <div class="cc-note">Editing <b>${esc(data.unitWord)} ${esc(u.label)}</b>. Click an option's dot to mark the <b>correct</b> answer (green). Drag ⠿ to reorder. Saved &amp; audited — students get it on next load.</div>
    <div class="st-qlist">${rows || '<div class="st-empty">No questions yet.</div>'}</div>
    <button class="st-add" onclick="ccSQAdd()"><span class="ai">＋</span> Add question</button>`;
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
window.ccSQAdd = () => { curUnit().questions.push({ q: 'Νέα ερώτηση;', opts: ['Επιλογή Α', 'Επιλογή Β', 'Επιλογή Γ', 'Επιλογή Δ'], ans: 0 });
  audit('studio.question.add'); paint(); toast('Question added'); };
window.ccSQDel = i => { curUnit().questions.splice(i, 1); audit('studio.question.delete'); paint(); toast('Question deleted'); };

// ════════ texts ═════════════════════════════════════════════════
window.ccSTextField = (ukey, ti, f, v) => { const u = gameData(gmContent()).units.find(x => x.key === ukey); u.texts[ti][f] = v; audit('studio.text.edit'); };
window.ccSTextAdd = () => { const d = gameData(gmContent()); const u = d.units[0]; (u.texts = u.texts || []).push({ title: 'Νέο κείμενο', body: '' });
  audit('studio.text.add'); paint(); toast(`Text added to ${d.unitWord} ${u.key}`); };
window.ccSTextDel = (ukey, ti) => { const u = gameData(gmContent()).units.find(x => x.key === ukey); u.texts.splice(ti, 1); audit('studio.text.delete'); paint(); toast('Text deleted'); };

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
window.ccPDelRow = ri => { const u = curP(); if (u.rowAxis.length <= 1) return; u.rowAxis.splice(ri, 1); u.entries.forEach(e => e.cells.splice(ri, 1)); audit('studio.paradigm.row.del'); paint(); toast('Row removed'); };
window.ccPAddCol = () => { const u = curP(); u.colAxis.push('Στήλη ' + (u.colAxis.length + 1)); u.entries.forEach(e => e.cells.forEach(r => r.push(''))); audit('studio.paradigm.col.add'); paint(); };
window.ccPDelCol = ci => { const u = curP(); if (u.colAxis.length <= 1) return; u.colAxis.splice(ci, 1); u.entries.forEach(e => e.cells.forEach(r => r.splice(ci, 1))); audit('studio.paradigm.col.del'); paint(); toast('Column removed'); };
window.ccPAddEntry = () => { const u = curP(); u.entries.push({ lemma: 'νέο λήμμα', meta: '', cells: u.rowAxis.map(() => u.colAxis.map(() => '')) }); audit('studio.paradigm.word.add'); paint(); toast('Word added'); };
window.ccPDelEntry = ei => { const u = curP(); u.entries.splice(ei, 1); audit('studio.paradigm.word.del'); paint(); toast('Word removed'); };

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

})();
