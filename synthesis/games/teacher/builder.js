// ============================================================
//  SymposiON — Teacher Mode: Custom Game Builder
//  Firebase Firestore CRUD + QR integration
//
//  Collection:  custom_games
//  Document:    { creatorId, title, gameType, questions[], createdAt }
//  MC question: { q, correct, distractors[] }
//  FI question: { q, correct }
//  Pair:        { term, definition }
// ============================================================

// ── TEMPLATES CONFIG ──
const _TEMPLATES = [
  {
    type:  'mc-trivia',
    icon:  '🏛',
    name:  'MC Quiz',
    desc:  'Multiple choice — 4 options, 30s timer',
    mode:  'mc',
    timer: 30,
    lives: 3,
  },
  {
    type:  'rapid-fire',
    icon:  '⚡',
    name:  'Speed Round',
    desc:  'Fast-paced quiz — 8 seconds per question',
    mode:  'mc',
    timer: 8,
    lives: 3,
  },
  {
    type:  'fill-in',
    icon:  '✍',
    name:  'Fill in the Blank',
    desc:  'Students type the correct answer',
    mode:  'fi',
    timer: 30,
    lives: 3,
  },
  {
    type:  'memory',
    icon:  '🃏',
    name:  'Memory Match',
    desc:  'Flip cards to match pairs',
    mode:  null,
    timer: 0,
    lives: 0,
    soon:  true,
  },
];

// ── STATE ──
let _teacherGames    = [];
let _teacherUser     = null;
let _qRowCounter     = 0;
let _selectedTemplate = _TEMPLATES[0]; // default to MC Quiz

const _GAME_LIMIT = 50;
const _DB_COLL    = 'custom_games';

// ── PIN GENERATION ──
// Omits ambiguous chars: I, O, 0, 1
const _PIN_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function _generatePin() {
  let pin = '';
  for (let i = 0; i < 6; i++) {
    pin += _PIN_CHARS[Math.floor(Math.random() * _PIN_CHARS.length)];
  }
  return pin;
}

async function _getUniquePin() {
  const db = firebase.firestore();
  for (let attempt = 0; attempt < 8; attempt++) {
    const pin  = _generatePin();
    const snap = await db.collection(_DB_COLL).where('pinCode', '==', pin).limit(1).get();
    if (snap.empty) return pin;
  }
  throw new Error('Could not generate a unique PIN — please try again.');
}

// ── INIT ──
function initTeacherDashboard() {
  const unsubAuth = firebase.auth().onAuthStateChanged(user => {
    unsubAuth();
    if (!user) {
      goTo('home');
      if (typeof openAuthModal === 'function') openAuthModal();
      return;
    }
    _teacherUser = user;
    _renderLoading();
    _loadTeacherGames(user.uid);
  });
}

// ── DATA LOAD ──
function _loadTeacherGames(uid) {
  firebase.firestore()
    .collection(_DB_COLL)
    .where('creatorId', '==', uid)
    .orderBy('createdAt', 'desc')
    .get()
    .then(snap => {
      _teacherGames = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      _renderDashboard();
    })
    .catch(err => {
      console.error('[builder] load error:', err);
      const grid = document.getElementById('teacher-games-grid');
      if (grid) grid.innerHTML = `
        <div class="teacher-empty-state" style="grid-column:1/-1">
          <div class="teacher-empty-icon">⚠</div>
          <p>Could not load games.<br/>
            <small style="font-size:12px;opacity:.7">${err.code === 'failed-precondition'
              ? 'A Firestore index is required. Check the browser console for the creation link.'
              : 'Check your connection and try again.'
            }</small>
          </p>
        </div>`;
    });
}

// ── RENDER ──
function _renderLoading() {
  const grid = document.getElementById('teacher-games-grid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="teacher-skeleton-grid" style="grid-column:1/-1;display:grid;grid-template-columns:inherit;gap:1.25rem;">
      <div class="teacher-skeleton-card"></div>
      <div class="teacher-skeleton-card"></div>
      <div class="teacher-skeleton-card"></div>
    </div>`;
}

function _renderDashboard() {
  const count    = _teacherGames.length;
  const countEl  = document.getElementById('teacher-game-count');
  const createBtn = document.getElementById('teacher-create-btn');
  const grid     = document.getElementById('teacher-games-grid');
  const emptyEl  = document.getElementById('teacher-empty-state');

  if (countEl)   countEl.textContent = count;
  if (createBtn) createBtn.disabled  = count >= _GAME_LIMIT;

  if (!_teacherGames.length) {
    if (grid)    grid.innerHTML = '';
    if (emptyEl) emptyEl.style.display = '';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';
  if (!grid)   return;

  grid.innerHTML = _teacherGames.map(game => {
    const qCount   = (game.questions || []).length;
    const dateStr  = _fmtDate(game.createdAt);
    const titleSafe = _esc(game.title || 'Untitled');
    const titleAttr = _escAttr(game.title || 'Untitled');
    const tpl       = _TEMPLATES.find(t => t.type === game.gameType) || _TEMPLATES[0];
    return `
      <div class="teacher-game-card" data-id="${game.id}">
        <button class="tgc-delete-btn"
                onclick="deleteCustomGame('${game.id}')"
                title="Delete game">🗑</button>
        <div class="tgc-header">
          <div class="tgc-type-badge">${tpl.icon} ${tpl.name}</div>
          <div class="tgc-title">${titleSafe}</div>
          <div class="tgc-meta">${qCount} question${qCount !== 1 ? 's' : ''} · ${dateStr}</div>
        </div>
        <div class="tgc-actions">
          <button class="tgc-preview-btn"
                  onclick="previewCustomGame('${game.id}')">▶ Play (Preview)</button>
          ${game.pinCode
            ? `<div class="tgc-pin-badge" title="Μαθητές: πληκτρολογήστε αυτόν τον κωδικό στην αρχική σελίδα">PIN: ${game.pinCode}</div>`
            : ''}
          <button class="tgc-qr-btn"
                  onclick="shareCustomGameQR('${game.id}', '${titleAttr}')">📱 Share via QR</button>
        </div>
      </div>`;
  }).join('');
}

// ── CRUD ──
// opts (optional, additive): { classKey, subject, publish } — used by the
// Engine Configurator's auto-discovery (gp-content.js custom_games query
// `where('published','==',true)`). The PIN / nav=homework flow ignores them.
async function saveCustomGame(title, questions, gameType, opts = {}) {
  if (!_teacherUser) throw new Error('Not authenticated');
  if (_teacherGames.length >= _GAME_LIMIT) throw new Error('Game limit reached');

  const pinCode  = await _getUniquePin();
  const classKey = opts.classKey || null;
  const subject  = opts.subject  || null;
  const published = !!opts.publish;

  const ref = await firebase.firestore().collection(_DB_COLL).add({
    creatorId: _teacherUser.uid,
    title,
    gameType:  gameType || 'mc-trivia',
    questions,
    pinCode,
    classKey,                       // null unless teacher tagged a class
    subject,                        // null unless teacher tagged a subject
    published,                      // configurator reads where('published','==',true)
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  _teacherGames.unshift({
    id: ref.id,
    title,
    gameType: gameType || 'mc-trivia',
    questions,
    pinCode,
    classKey,
    subject,
    published,
    createdAt: { toDate: () => new Date() },
  });

  return ref.id;
}

async function deleteCustomGame(docId) {
  if (!confirm('Delete this game? This cannot be undone.')) return;
  try {
    await firebase.firestore().collection(_DB_COLL).doc(docId).delete();
    _teacherGames = _teacherGames.filter(g => g.id !== docId);
    _renderDashboard();
  } catch (err) {
    console.error('[builder] delete error:', err);
    alert('Could not delete. Please try again.');
  }
}

function previewCustomGame(docId) {
  const game = _teacherGames.find(g => g.id === docId);
  if (game && typeof launchCustomHomework === 'function') {
    launchCustomHomework(game);
  }
}

// ── QR INTEGRATION ──
function shareCustomGameQR(docId, gameTitle) {
  if (typeof showQR !== 'function') {
    console.error('[builder] showQR is not defined — check nav.js is loaded.');
    return;
  }
  // Pass the game's PIN so the modal shows both the QR and the code simultaneously
  const game    = _teacherGames.find(g => g.id === docId);
  const pinCode = game?.pinCode || null;
  showQR(gameTitle, { nav: 'homework', id: docId }, pinCode);
}

// ── TEMPLATE PICKER ──
function openTemplatePicker() {
  if (_teacherGames.length >= _GAME_LIMIT) return;
  const modal = document.getElementById('template-picker-modal');
  if (modal) modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeTemplatePicker() {
  const modal = document.getElementById('template-picker-modal');
  if (modal) modal.classList.remove('active');
  if (!document.getElementById('builder-modal')?.classList.contains('active')) {
    document.body.style.overflow = '';
  }
}

function selectTemplate(type) {
  const tpl = _TEMPLATES.find(t => t.type === type);
  if (!tpl || tpl.soon) return;
  _selectedTemplate = tpl;
  closeTemplatePicker();
  openBuilderModal();
}

// ── BUILDER MODAL ──
function openBuilderModal() {
  if (_teacherGames.length >= _GAME_LIMIT) return;
  _resetBuilderModal();
  const modal = document.getElementById('builder-modal');
  if (!modal) return;

  // Reflect chosen template in modal header
  const titleEl = modal.querySelector('.builder-modal-title');
  if (titleEl) {
    titleEl.textContent = _selectedTemplate
      ? `${_selectedTemplate.icon} ${_selectedTemplate.name}`
      : 'New Quiz';
  }

  // Adjust "Add" button label for pairs
  const addBtn = document.getElementById('builder-add-q-btn');
  if (addBtn) {
    addBtn.textContent = _selectedTemplate?.type === 'memory' ? '+ Add Pair' : '+ Add Question';
  }

  _ensureBuilderPublishControls();

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  addQuestionRow();
  document.getElementById('builder-title')?.focus();
}

// ── Class / Subject / Publish-to-library controls (additive) ──
// Injected next to the title field so teacher quizzes can be tagged + published
// to the class library (auto-discovered by the Engine Configurator). Optional —
// the PIN / homework flow ignores these fields.
function _ensureBuilderPublishControls() {
  const titleEl = document.getElementById('builder-title');
  if (!titleEl) return;
  let row = document.getElementById('builder-publish-row');
  if (!row) {
    row = document.createElement('div');
    row.id = 'builder-publish-row';
    row.className = 'builder-field builder-publish-row';

    // Class options from GRADES (key → label)
    let classOpts = '<option value="">— Τάξη / Class (προαιρετικό) —</option>';
    const subjSet = [];
    if (typeof GRADES !== 'undefined') {
      Object.keys(GRADES).forEach(k => {
        const g = GRADES[k];
        const label = g.title || g.label || k;
        classOpts += `<option value="${k}">${label}</option>`;
        const subjects = [].concat(g.subjects || [],
          (g.tracks || []).reduce((a, t) => a.concat(t.subjects || []), []));
        subjects.forEach(s => { if (s.title && subjSet.indexOf(s.title) < 0) subjSet.push(s.title); });
      });
    }
    const subjList = subjSet.map(s => `<option value="${s}"></option>`).join('');

    row.innerHTML = `
      <div class="builder-publish-grid" style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;">
        <select class="builder-input" id="builder-class" style="flex:1;min-width:160px;">${classOpts}</select>
        <input class="builder-input" id="builder-subject" list="builder-subject-list"
               placeholder="Μάθημα / Subject (προαιρετικό)" autocomplete="off" style="flex:1;min-width:160px;">
        <datalist id="builder-subject-list">${subjList}</datalist>
      </div>
      <label class="builder-publish-toggle" style="display:flex;gap:8px;align-items:center;margin-top:8px;cursor:pointer;">
        <input type="checkbox" id="builder-publish">
        <span>Δημοσίευση στη βιβλιοθήκη τάξης / Publish to class library</span>
      </label>`;
    // place right after the title input
    if (titleEl.parentNode) titleEl.parentNode.insertBefore(row, titleEl.nextSibling);
  }
  // reset values each open
  const cls = document.getElementById('builder-class');
  const sub = document.getElementById('builder-subject');
  const pub = document.getElementById('builder-publish');
  if (cls) cls.value = '';
  if (sub) sub.value = '';
  if (pub) pub.checked = false;
}

function closeBuilderModal() {
  const modal = document.getElementById('builder-modal');
  if (modal) modal.classList.remove('active');
  document.body.style.overflow = '';
}

function _resetBuilderModal() {
  const titleEl = document.getElementById('builder-title');
  const list    = document.getElementById('builder-questions-list');
  const errEl   = document.getElementById('builder-error');
  const saveBtn = document.querySelector('.builder-save-btn');
  if (titleEl) titleEl.value = '';
  if (list)    list.innerHTML = '';
  if (errEl)   errEl.textContent = '';
  if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Game →'; }
  _qRowCounter = 0;
}

// ── QUESTION ROWS ──
function addQuestionRow() {
  const list = document.getElementById('builder-questions-list');
  if (!list) return;
  const num   = list.children.length + 1;
  const type  = _selectedTemplate?.type || 'mc-trivia';
  _qRowCounter++;
  const rowId = _qRowCounter;
  const row   = document.createElement('div');
  row.className     = 'builder-q-row';
  row.dataset.rowId = rowId;

  if (type === 'memory') {
    // Pair: term + definition
    row.innerHTML = `
      <div class="bqr-header">
        <span class="bqr-num">Pair ${num}</span>
        <button class="bqr-remove" onclick="removeQuestionRow(this)" title="Remove pair">✕</button>
      </div>
      <input class="builder-input bqr-term"       type="text" placeholder="Term (e.g. δικαιοσύνη)" autocomplete="off"/>
      <input class="builder-input bqr-definition" type="text" placeholder="Definition (e.g. justice)" autocomplete="off"/>`;
  } else if (type === 'fill-in') {
    // Fill-in: question + correct answer only
    row.innerHTML = `
      <div class="bqr-header">
        <span class="bqr-num">Question ${num}</span>
        <button class="bqr-remove" onclick="removeQuestionRow(this)" title="Remove question">✕</button>
      </div>
      <input class="builder-input bqr-question" type="text" placeholder="Question text…" autocomplete="off"/>
      <input class="builder-input bqr-correct"  type="text" placeholder="✓  Correct answer" autocomplete="off"/>`;
  } else {
    // MC / Rapid-fire: question + correct + 3 distractors
    row.innerHTML = `
      <div class="bqr-header">
        <span class="bqr-num">Question ${num}</span>
        <button class="bqr-remove" onclick="removeQuestionRow(this)" title="Remove question">✕</button>
      </div>
      <input class="builder-input bqr-question"   type="text" placeholder="Question text…" autocomplete="off"/>
      <input class="builder-input bqr-correct"    type="text" placeholder="✓  Correct answer" autocomplete="off"/>
      <div class="bqr-distractors">
        <input class="builder-input bqr-distractor" type="text" placeholder="✗  Wrong answer 1" autocomplete="off"/>
        <input class="builder-input bqr-distractor" type="text" placeholder="✗  Wrong answer 2" autocomplete="off"/>
        <input class="builder-input bqr-distractor" type="text" placeholder="✗  Wrong answer 3" autocomplete="off"/>
      </div>`;
  }

  list.appendChild(row);
  row.querySelector('input')?.focus();
  _renumberRows();
}

function removeQuestionRow(btn) {
  const row = btn.closest('.builder-q-row');
  if (row) { row.remove(); _renumberRows(); }
}

function _renumberRows() {
  const type  = _selectedTemplate?.type || 'mc-trivia';
  const label = type === 'memory' ? 'Pair' : 'Question';
  const rows  = document.querySelectorAll('#builder-questions-list .builder-q-row');
  rows.forEach((row, i) => {
    const numEl = row.querySelector('.bqr-num');
    if (numEl) numEl.textContent = `${label} ${i + 1}`;
  });
}

// ── SAVE HANDLER ──
async function submitBuilderForm() {
  const errEl   = document.getElementById('builder-error');
  const saveBtn = document.querySelector('.builder-save-btn');
  const title   = (document.getElementById('builder-title')?.value || '').trim();
  const rows    = [...document.querySelectorAll('#builder-questions-list .builder-q-row')];
  const type    = _selectedTemplate?.type || 'mc-trivia';

  if (errEl) errEl.textContent = '';

  if (!title) {
    if (errEl) errEl.textContent = 'Please enter a game title.';
    document.getElementById('builder-title')?.focus();
    return;
  }
  if (!rows.length) {
    if (errEl) errEl.textContent = type === 'memory' ? 'Add at least one pair.' : 'Add at least one question.';
    return;
  }
  if (_teacherGames.length >= _GAME_LIMIT) {
    if (errEl) errEl.textContent = `Game limit (${_GAME_LIMIT}) reached. Delete a game first.`;
    return;
  }

  // ── Parse rows by type ──
  const questions = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    if (type === 'memory') {
      const term       = (row.querySelector('.bqr-term')?.value       || '').trim();
      const definition = (row.querySelector('.bqr-definition')?.value || '').trim();
      if (!term)       { if (errEl) errEl.textContent = `Pair ${i + 1}: enter a term.`;       row.querySelector('.bqr-term')?.focus();       return; }
      if (!definition) { if (errEl) errEl.textContent = `Pair ${i + 1}: enter a definition.`; row.querySelector('.bqr-definition')?.focus(); return; }
      questions.push({ term, definition });
    } else if (type === 'fill-in') {
      const q       = (row.querySelector('.bqr-question')?.value || '').trim();
      const correct = (row.querySelector('.bqr-correct')?.value  || '').trim();
      if (!q)       { if (errEl) errEl.textContent = `Question ${i + 1}: enter the question text.`; row.querySelector('.bqr-question')?.focus(); return; }
      if (!correct) { if (errEl) errEl.textContent = `Question ${i + 1}: enter the correct answer.`; row.querySelector('.bqr-correct')?.focus(); return; }
      questions.push({ q, correct, distractors: [] });
    } else {
      const q           = (row.querySelector('.bqr-question')?.value || '').trim();
      const correct     = (row.querySelector('.bqr-correct')?.value  || '').trim();
      const distractors = [...row.querySelectorAll('.bqr-distractor')]
        .map(el => el.value.trim()).filter(v => v);
      if (!q)               { if (errEl) errEl.textContent = `Question ${i + 1}: enter the question text.`; row.querySelector('.bqr-question')?.focus(); return; }
      if (!correct)         { if (errEl) errEl.textContent = `Question ${i + 1}: enter the correct answer.`; row.querySelector('.bqr-correct')?.focus(); return; }
      if (!distractors.length) { if (errEl) errEl.textContent = `Question ${i + 1}: add at least one wrong answer.`; row.querySelector('.bqr-distractor')?.focus(); return; }
      questions.push({ q, correct, distractors });
    }
  }

  if (saveBtn) { saveBtn.disabled = true; saveBtn.textContent = 'Saving…'; }

  // Optional class-library tagging (additive; ignored by the PIN/homework flow)
  const classKey = (document.getElementById('builder-class')?.value || '').trim() || null;
  const subject  = (document.getElementById('builder-subject')?.value || '').trim() || null;
  const publish  = !!document.getElementById('builder-publish')?.checked;

  try {
    await saveCustomGame(title, questions, type, { classKey, subject, publish });
    closeBuilderModal();
    _renderDashboard();
  } catch (err) {
    console.error('[builder] save error:', err);
    if (errEl) errEl.textContent = 'Save failed — please try again.';
  } finally {
    if (saveBtn) { saveBtn.disabled = false; saveBtn.textContent = 'Save Game →'; }
  }
}

// ── UTILITIES ──
function _fmtDate(ts) {
  if (!ts) return '';
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function _esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function _escAttr(str) {
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/"/g, '&quot;');
}
