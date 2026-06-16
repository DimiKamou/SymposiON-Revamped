// ============================================================
//  εἰμί — «είμαι, υπάρχω»
//  Modes: Καρτέλες · Κουίζ · Πίνακας · Αντιστοίχιση · Χρονική Αντικατάσταση
//  Depends on: eimi/data.js  (EIMI_PARADIGM)
// ============================================================

const EIMI = (() => {

// ── Polytonic keyboard ────────────────────────────────────────
const DIAC = [
  {id:'ox',l:'´',h:'Οξεία'},{id:'per',l:'͂',h:'Περισπ.'},
  {id:'ypogr',l:'ͅ',h:'Υπογ.'},{id:'das',l:'῾',h:'Δασεία'},
  {id:'psi',l:'᾿',h:'Ψιλή'},{id:'das_ox',l:'῾´',h:'Δασ+Οξ'},
  {id:'das_per',l:'῟',h:'Δασ+Περ'},{id:'psi_ox',l:'᾿´',h:'Ψιλ+Οξ'},
  {id:'psi_per',l:'῏',h:'Ψιλ+Περ'},
];
const COMBO = {
  ox:     {α:'ά',ε:'έ',η:'ή',ι:'ί',ο:'ό',υ:'ύ',ω:'ώ'},
  per:    {α:'ᾶ',η:'ῆ',ι:'ῖ',υ:'ῦ',ω:'ῶ'},
  ypogr:  {α:'ᾳ',η:'ῃ',ω:'ῳ'},
  das:    {α:'ἁ',ε:'ἑ',η:'ἡ',ι:'ἱ',ο:'ὁ',υ:'ὑ',ω:'ὡ'},
  psi:    {α:'ἀ',ε:'ἐ',η:'ἠ',ι:'ἰ',ο:'ὀ',υ:'ὐ',ω:'ὠ'},
  das_ox: {α:'ἅ',ε:'ἕ',η:'ἥ',ι:'ἵ',ο:'ὅ',υ:'ὕ',ω:'ὥ'},
  das_per:{α:'ἇ',η:'ἧ',ι:'ἷ',υ:'ὗ',ω:'ὧ'},
  psi_ox: {α:'ἄ',ε:'ἔ',η:'ἤ',ι:'ἴ',ο:'ὄ',υ:'ὔ',ω:'ὤ'},
  psi_per:{α:'ἆ',η:'ἦ',ι:'ἶ',υ:'ὖ',ω:'ὦ'},
};
let _kbDiac = null, _kbLastInput = null;

function _kbToggle(id) {
  _kbDiac = _kbDiac === id ? null : id;
  document.querySelectorAll('#eimi-diac-row .eimi-dkey').forEach(b =>
    b.classList.toggle('eimi-dkey-on', b.dataset.id === _kbDiac));
  _kbRenderVowels();
}
function _kbRenderVowels() {
  ['α','ε','η','ι','ο','υ','ω'].forEach(v => {
    const c = document.getElementById('eimi-vkeys-' + v); if (!c) return;
    while (c.children.length > 1) c.removeChild(c.lastChild);
    if (!_kbDiac) return;
    const ch = (COMBO[_kbDiac] || {})[v]; if (!ch) return;
    const b = document.createElement('button'); b.className = 'eimi-vkey eimi-vkey-hi';
    b.textContent = ch; b.onmousedown = e => { e.preventDefault(); _kbInsert(ch); }; c.appendChild(b);
  });
}
function _kbInsert(ch) {
  let inp = (_kbLastInput && document.contains(_kbLastInput)) ? _kbLastInput
          : document.getElementById('eimi-quiz-input');
  if (!inp) {
    inp = document.getElementById('eimi-antik-input');
  }
  if (!inp) return;
  const s = inp.selectionStart, e = inp.selectionEnd;
  inp.value = inp.value.slice(0, s) + ch + inp.value.slice(e);
  inp.selectionStart = inp.selectionEnd = s + ch.length; inp.focus();
  if (_kbDiac) { _kbDiac = null; document.querySelectorAll('#eimi-diac-row .eimi-dkey').forEach(b => b.classList.remove('eimi-dkey-on')); _kbRenderVowels(); }
}
function _kbVowelClick(v) { _kbInsert(_kbDiac ? (COMBO[_kbDiac] || {})[v] || v : v); }
function _kbTogglePanel() {
  document.getElementById('eimi-poly-toggle')?.classList.toggle('open');
  document.getElementById('eimi-poly-body')?.classList.toggle('open');
}
function _buildKB() {
  const dr = document.getElementById('eimi-diac-row');
  const vr = document.getElementById('eimi-vowel-rows');
  if (!dr || !vr) return;
  dr.innerHTML = ''; vr.innerHTML = '';
  DIAC.forEach(d => {
    const b = document.createElement('button'); b.className = 'eimi-dkey'; b.dataset.id = d.id;
    b.innerHTML = `<span>${d.l}</span><span class="eimi-dkey-label">${d.h}</span>`;
    b.onclick = () => _kbToggle(d.id); dr.appendChild(b);
  });
  ['α','ε','η','ι','ο','υ','ω'].forEach(v => {
    const row = document.createElement('div'); row.className = 'eimi-vowel-row';
    const lbl = document.createElement('div'); lbl.className = 'eimi-vlabel'; lbl.textContent = v; row.appendChild(lbl);
    const keys = document.createElement('div'); keys.className = 'eimi-vkeys'; keys.id = 'eimi-vkeys-' + v;
    const plain = document.createElement('button'); plain.className = 'eimi-vkey'; plain.textContent = v;
    plain.onmousedown = e => { e.preventDefault(); _kbVowelClick(v); }; keys.appendChild(plain); row.appendChild(keys); vr.appendChild(row);
  });
  _kbDiac = null; _kbRenderVowels();
}

// ── Helpers ───────────────────────────────────────────────────
function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const $ = id => document.getElementById(id);
function _show(id) {
  document.querySelectorAll('#eimi-wrap .eimi-screen').forEach(s => s.classList.remove('active'));
  $(id)?.classList.add('active');
  const kbWrap = $('eimi-kb-wrap');
  if (kbWrap) kbWrap.style.display =
    (id === 'eimi-screen-quiz' || id === 'eimi-screen-table' || id === 'eimi-screen-antik') ? '' : 'none';
}

// Build flat deck of cards from EIMI_PARADIGM filtered by tense id
function _buildDeck(filter) {
  const cards = [];
  for (const tense of EIMI_PARADIGM.tenses) {
    if (filter !== 'all' && filter !== tense.id) continue;
    for (const group of tense.groups) {
      for (const form of group.forms) {
        cards.push({
          tenseId:    tense.id,
          tenseLabel: tense.label,
          moodLabel:  group.mood,
          person:     form.l,
          form:       form.f,
        });
      }
    }
  }
  return _shuffle(cards);
}

// ── FLASHCARD MODE ────────────────────────────────────────────
let _deck = [], _deckKnown = 0, _deckTotal = 0, _flipped = false;

function _startFlash() {
  _deck = _buildDeck(_filter);
  _deckKnown = 0; _deckTotal = _deck.length; _flipped = false;
  _show('eimi-screen-flash');
  _renderCard();
}
function _renderCard() {
  if (!_deck.length) { _flashDone(); return; }
  const card = _deck[0];
  const done = _deckTotal - _deck.length;
  $('eimi-flash-count').textContent = `${done} / ${_deckTotal}`;
  const pct = _deckTotal > 0 ? done / _deckTotal * 100 : 0;
  $('eimi-flash-fill').style.width = pct + '%';
  $('eimi-flash-tense').textContent = `${card.tenseLabel} · ${card.moodLabel}`;
  $('eimi-flash-person').textContent = card.person;
  $('eimi-flash-form').textContent = card.form;
  $('eimi-flash-back-label').textContent = `${card.tenseLabel} · ${card.moodLabel} · ${card.person}`;
  _flipped = false;
  const fc = $('eimi-flashcard'); if (fc) fc.classList.remove('eimi-flipped');
  $('eimi-flash-btns').style.display = 'none';
  $('eimi-flash-reveal').style.display = '';
}
function _flipCard() {
  if (!_deck.length) return;
  _flipped = !_flipped;
  $('eimi-flashcard')?.classList.toggle('eimi-flipped', _flipped);
  $('eimi-flash-btns').style.display = _flipped ? 'flex' : 'none';
  $('eimi-flash-reveal').style.display = _flipped ? 'none' : '';
}
function _flashAnswer(knew) {
  if (!_flipped || !_deck.length) return;
  const card = _deck.shift();
  if (knew) { _deckKnown++; }
  else { _deck.push(card); }
  _renderCard();
}
function _flashDone() {
  $('eimi-flash-done-score').textContent = `${_deckKnown} / ${_deckTotal}`;
  _show('eimi-screen-flash-done');
}

// ── QUIZ MODE (FI) ────────────────────────────────────────────
let _quizPool = [], _quizScore = 0, _quizMistakes = [], _quizAnswering = false, _quizCurr = null;

function _startQuiz() {
  _quizPool = _buildDeck(_filter);
  _quizScore = 0; _quizMistakes = []; _quizAnswering = false;
  _show('eimi-screen-quiz');
  _buildKB();
  const inp = $('eimi-quiz-input');
  if (inp) {
    inp.addEventListener('focus', () => { _kbLastInput = inp; });
    inp.onkeydown = e => { if (e.key === 'Enter') _quizSubmit(); };
  }
  _quizNext();
}
function _quizNext() {
  if (!_quizPool.length) { _quizEnd(); return; }
  _quizAnswering = false;
  _quizCurr = _quizPool.shift();
  $('eimi-quiz-q').innerHTML = `
    <div class="eimi-q-main">
      <span class="eimi-q-lemma">εἰμί</span>
      <span class="eimi-q-meaning">(${EIMI_PARADIGM.meaning})</span>
    </div>
    <div class="eimi-q-group">${_quizCurr.tenseLabel} · ${_quizCurr.moodLabel}</div>
    <div class="eimi-q-ask">Γράψε τον/την <strong>${_quizCurr.person}</strong>:</div>`;
  const inp = $('eimi-quiz-input');
  if (inp) { inp.value = ''; inp.disabled = false; inp.className = 'eimi-fi-inp'; inp.focus(); }
  const sub = $('eimi-quiz-submit'); if (sub) sub.disabled = false;
  $('eimi-quiz-fb').textContent = ''; $('eimi-quiz-fb').className = 'eimi-fb';
  _kbDiac = null;
  document.querySelectorAll('#eimi-diac-row .eimi-dkey').forEach(b => b.classList.remove('eimi-dkey-on'));
  _kbRenderVowels();
  _hudQuiz();
}
function _quizSubmit() {
  if (_quizAnswering || !_quizCurr) return;
  const inp = $('eimi-quiz-input'); if (!inp) return;
  const typed = inp.value.trim(); if (!typed) { inp.focus(); return; }
  _quizAnswering = true; inp.disabled = true;
  const sub = $('eimi-quiz-submit'); if (sub) sub.disabled = true;
  const correct = _quizCurr.form;
  const ok = typed === correct;
  inp.classList.add(ok ? 'eimi-fi-ok' : 'eimi-fi-err');
  const fb = $('eimi-quiz-fb');
  if (ok) { fb.textContent = '✓ Σωστό!'; fb.className = 'eimi-fb eimi-ok'; _quizScore++; }
  else {
    fb.innerHTML = `✗ Λάθος — σωστό: <strong>${correct}</strong>`; fb.className = 'eimi-fb eimi-err';
    _quizMistakes.push({ label: `${_quizCurr.tenseLabel} · ${_quizCurr.moodLabel} · ${_quizCurr.person}`, typed, correct });
    if (window.GE_CERBERUS_QUEUE) window.GE_CERBERUS_QUEUE.push({gameId:'eimi',subjectId:'ancient-greek',qt:`εἰμί — ${_quizCurr.tenseLabel} · ${_quizCurr.moodLabel} · ${_quizCurr.person}`,chosen:typed,correct,error_metadata:{category:'verb_morphology',mutation_type:'incorrect_form',details:{tense:_quizCurr.tenseLabel,mood:_quizCurr.moodLabel,person:_quizCurr.person}},ts:Date.now()});
  }
  _hudQuiz();
  setTimeout(_quizNext, 1600);
}
function _hudQuiz() {
  $('eimi-qscore').textContent  = _quizScore;
  $('eimi-qerr').textContent    = _quizMistakes.length;
  $('eimi-qremain').textContent = _quizPool.length + (_quizCurr ? 1 : 0);
}
function _quizEnd() {
  const total = _buildDeck(_filter).length;
  $('eimi-quiz-end-score').textContent = `${_quizScore} / ${total}`;
  const log = $('eimi-quiz-mistakes');
  if (!_quizMistakes.length) {
    log.innerHTML = '<p style="color:#27ae60;text-align:center;font-style:italic;margin:12px 0;">Τέλειο! Κανένα λάθος! 🎉</p>';
  } else {
    let h = `<div class="eimi-mis-hdr">Λάθη: ${_quizMistakes.length}</div><div class="eimi-mis-list">`;
    _quizMistakes.forEach(m => {
      h += `<div class="eimi-mis-row">
        <div class="eimi-mis-q">${m.label}</div>
        <div class="eimi-mis-ans"><span class="eimi-wrong">${m.typed || '—'}</span> → <span class="eimi-correct">${m.correct}</span></div>
      </div>`;
    });
    h += '</div>'; log.innerHTML = h;
  }
  _show('eimi-screen-quiz-end');
}

// ── TABLE MODE ────────────────────────────────────────────────
let _tableSubmitted = false, _tableQueue = [], _tableQIdx = 0;

function _startTable() {
  _tableQueue = EIMI_PARADIGM.tenses.filter(t => _filter === 'all' || _filter === t.id);
  _tableQIdx = 0;
  if (!_tableQueue.length) return;
  _show('eimi-screen-table');
  _buildKB();
  _renderTable();
}
function _renderTable() {
  _tableSubmitted = false;
  const tense = _tableQueue[_tableQIdx];
  $('eimi-tprogress').textContent = `${_tableQIdx + 1} / ${_tableQueue.length}`;

  const container = $('eimi-table-content');
  let html = `<div class="eimi-tense-hdr">${tense.label}</div>`;
  tense.groups.forEach(group => {
    html += `<div class="eimi-table-group">
      <div class="eimi-table-mood-lbl">${group.mood}</div>
      <div class="eimi-table-grid">`;
    group.forms.forEach(form => {
      html += `<div class="eimi-table-cell">
        <div class="eimi-table-cell-lbl">${form.l}</div>
        <input class="eimi-table-inp eimi-fi-inp" data-expected="${form.f}"
          autocomplete="off" autocorrect="off" spellcheck="false"
          placeholder="…">
      </div>`;
    });
    html += `</div></div>`;
  });
  html += `<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px;">
    <button class="eimi-btn-gold" id="eimi-table-submit-btn" onclick="EIMI.tableSubmit()">Υποβολή →</button>
    <button class="eimi-btn-ghost" onclick="EIMI.back()">Μενού</button>
  </div>`;
  container.innerHTML = html;

  const inps = [...container.querySelectorAll('.eimi-table-inp')];
  inps.forEach((inp, i) => {
    inp.addEventListener('focus', () => { _kbLastInput = inp; });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') { if (inps[i + 1]) inps[i + 1].focus(); else _tableSubmit(); }
    });
  });
  setTimeout(() => inps[0]?.focus(), 80);
}
function _tableSubmit() {
  if (_tableSubmitted) return; _tableSubmitted = true;
  const container = $('eimi-table-content');
  let correct = 0, total = 0;
  container.querySelectorAll('.eimi-table-inp').forEach(inp => {
    total++;
    inp.disabled = true;
    const typed = inp.value.trim(), expected = inp.dataset.expected;
    if (typed === expected) {
      correct++; inp.classList.add('eimi-fi-ok');
    } else {
      inp.classList.add('eimi-fi-err');
      const cell = inp.closest('.eimi-table-cell');
      if (cell) {
        const hint = document.createElement('div'); hint.className = 'eimi-table-hint';
        hint.innerHTML = `<span class="eimi-wrong">${typed || '—'}</span> → <span class="eimi-correct">${expected}</span>`;
        cell.appendChild(hint);
      }
    }
  });
  const btn = $('eimi-table-submit-btn');
  if (btn) {
    const hasNext = _tableQIdx + 1 < _tableQueue.length;
    btn.textContent = hasNext
      ? `Επόμενος χρόνος → (${correct}/${total} σωστά)`
      : `Ξανά από αρχή → (${correct}/${total} σωστά)`;
    btn.onclick = () => {
      if (hasNext) { _tableQIdx++; _renderTable(); }
      else { _tableQIdx = 0; _renderTable(); }
    };
  }
}

// ── ΑΝΤΙΣΤΟΙΧΙΣΗ MODE ─────────────────────────────────────────
let _matchGroups = [], _matchGIdx = 0;
let _matchScore = 0, _matchWrong = 0, _matchTotal = 0;
let _matchLeft = [], _matchRight = []; // [{id, text, matched, selected, wrong}]
let _matchSel = null; // {side, idx} | null

function _buildMatchGroups() {
  const groups = [];
  for (const tense of EIMI_PARADIGM.tenses) {
    if (_filter !== 'all' && _filter !== tense.id) continue;
    for (const group of tense.groups) {
      groups.push({ header: `${tense.label} · ${group.mood}`, forms: group.forms });
    }
  }
  return groups;
}
function _startMatch() {
  _matchGroups = _buildMatchGroups();
  _matchGIdx = 0; _matchScore = 0; _matchWrong = 0; _matchTotal = 0;
  _matchGroups.forEach(g => _matchTotal += g.forms.length);
  _show('eimi-screen-match');
  _renderMatch();
}
function _renderMatch() {
  const g = _matchGroups[_matchGIdx];
  _matchSel = null;
  const ids = g.forms.map((_, i) => i);
  _matchLeft  = _shuffle([...ids]).map(id => ({ id, text: g.forms[id].l, matched:false, selected:false, wrong:false }));
  _matchRight = _shuffle([...ids]).map(id => ({ id, text: g.forms[id].f, matched:false, selected:false, wrong:false }));
  $('eimi-match-progress').textContent = `${_matchGIdx + 1} / ${_matchGroups.length}`;
  $('eimi-match-hdr-text').textContent = g.header;
  $('eimi-match-score').textContent = _matchScore;
  _redrawMatchGrid();
}
function _matchItemHTML(side, idx, item) {
  if (!item) return '<div></div>';
  const cls = ['eimi-match-item', `eimi-match-${side}`,
    item.matched  ? 'eimi-match-matched'  : '',
    item.selected ? 'eimi-match-sel'      : '',
    item.wrong    ? 'eimi-match-wrong'    : '',
  ].filter(Boolean).join(' ');
  const click = item.matched ? '' : `onclick="EIMI.matchClick('${side}',${idx})"`;
  return `<div class="${cls}" ${click}>${item.text}</div>`;
}
function _redrawMatchGrid() {
  const n = Math.max(_matchLeft.length, _matchRight.length);
  let html = '';
  for (let i = 0; i < n; i++) html += _matchItemHTML('left', i, _matchLeft[i]) + _matchItemHTML('right', i, _matchRight[i]);
  $('eimi-match-grid').innerHTML = html;
  $('eimi-match-score').textContent = _matchScore;
}
function _matchClick(side, idx) {
  const arr  = side === 'left' ? _matchLeft : _matchRight;
  const item = arr[idx];
  if (!item || item.matched) return;

  if (!_matchSel || _matchSel.side === side) {
    // First pick or same-side re-pick
    _matchLeft.forEach(x => x.selected = false);
    _matchRight.forEach(x => x.selected = false);
    item.selected = true;
    _matchSel = { side, idx };
    _redrawMatchGrid();
    return;
  }
  // Second pick — different side → attempt match
  const prevArr  = _matchSel.side === 'left' ? _matchLeft : _matchRight;
  const prevItem = prevArr[_matchSel.idx];
  const lItem = side === 'right' ? prevItem : item;
  const rItem = side === 'right' ? item : prevItem;
  _matchLeft.forEach(x => x.selected = false);
  _matchRight.forEach(x => x.selected = false);
  _matchSel = null;

  if (lItem.id === rItem.id) {
    // ✓ Correct match
    lItem.matched = true; rItem.matched = true; _matchScore++;
    _redrawMatchGrid();
    if (_matchLeft.every(x => x.matched) && _matchRight.every(x => x.matched)) {
      setTimeout(_matchGroupDone, 500);
    }
  } else {
    // ✗ Wrong match
    _matchWrong++;
    lItem.wrong = true; rItem.wrong = true;
    _redrawMatchGrid();
    setTimeout(() => { lItem.wrong = false; rItem.wrong = false; _redrawMatchGrid(); }, 700);
  }
}
function _matchGroupDone() {
  if (_matchGIdx + 1 < _matchGroups.length) { _matchGIdx++; _renderMatch(); }
  else _matchEnd();
}
function _matchEnd() {
  $('eimi-match-end-score').textContent = _matchScore;
  $('eimi-match-end-total').textContent = _matchTotal;
  $('eimi-match-end-wrong').textContent = _matchWrong;
  _show('eimi-screen-match-end');
}

// ── ΧΡΟΝΙΚΗ ΑΝΤΙΚΑΤΑΣΤΑΣΗ MODE ───────────────────────────────
// Uses only indicative forms (the only mood shared across all 3 tenses)
let _antikPool = [], _antikTotal = 0, _antikScore = 0;
let _antikMistakes = [], _antikCurr = null, _antikAnswering = false;

function _buildAntikPool() {
  // Collect indicative groups per tense
  const ti = {}; // {tenseId: {label, forms: {person: form}}}
  for (const tense of EIMI_PARADIGM.tenses) {
    const ind = tense.groups.find(g => g.mood === 'Οριστική');
    if (!ind) continue;
    ti[tense.id] = { label: tense.label, forms: {} };
    for (const f of ind.forms) ti[tense.id].forms[f.l] = f.f;
  }
  const tIds = Object.keys(ti);
  if (tIds.length < 2) return [];
  // Source tenses = filter (or all); target tenses = everything else
  const srcIds = (_filter === 'all' ? tIds : [_filter]).filter(id => ti[id]);
  const persons = Object.keys(ti[tIds[0]].forms);
  const pool = [];
  for (const person of persons) {
    for (const srcId of srcIds) {
      for (const tgtId of tIds) {
        if (srcId === tgtId) continue;
        pool.push({
          person,
          srcLabel: ti[srcId].label, srcForm: ti[srcId].forms[person],
          tgtLabel: ti[tgtId].label, tgtForm: ti[tgtId].forms[person],
        });
      }
    }
  }
  return _shuffle(pool);
}
function _startAntik() {
  _antikPool = _buildAntikPool();
  _antikTotal = _antikPool.length;
  _antikScore = 0; _antikMistakes = []; _antikCurr = null; _antikAnswering = false;
  _show('eimi-screen-antik');
  _buildKB();
  const inp = $('eimi-antik-input');
  if (inp) {
    inp.addEventListener('focus', () => { _kbLastInput = inp; });
    inp.onkeydown = e => { if (e.key === 'Enter') _antikSubmit(); };
  }
  _antikNext();
}
function _antikNext() {
  if (!_antikPool.length) { _antikEnd(); return; }
  _antikAnswering = false;
  _antikCurr = _antikPool.shift();
  $('eimi-antik-src-form').textContent = _antikCurr.srcForm;
  $('eimi-antik-src-ctx').textContent  = `${_antikCurr.srcLabel} · Οριστική · ${_antikCurr.person}`;
  $('eimi-antik-tgt-lbl').textContent  = `→ ${_antikCurr.tgtLabel}:`;
  const inp = $('eimi-antik-input');
  if (inp) { inp.value = ''; inp.disabled = false; inp.className = 'eimi-fi-inp'; inp.focus(); }
  const sub = $('eimi-antik-submit'); if (sub) sub.disabled = false;
  $('eimi-antik-fb').textContent = ''; $('eimi-antik-fb').className = 'eimi-fb';
  _kbDiac = null;
  document.querySelectorAll('#eimi-diac-row .eimi-dkey').forEach(b => b.classList.remove('eimi-dkey-on'));
  _kbRenderVowels();
  _hudAntik();
}
function _antikSubmit() {
  if (_antikAnswering || !_antikCurr) return;
  const inp = $('eimi-antik-input'); if (!inp) return;
  const typed = inp.value.trim(); if (!typed) { inp.focus(); return; }
  _antikAnswering = true; inp.disabled = true;
  const sub = $('eimi-antik-submit'); if (sub) sub.disabled = true;
  const correct = _antikCurr.tgtForm;
  const ok = typed === correct;
  inp.classList.add(ok ? 'eimi-fi-ok' : 'eimi-fi-err');
  const fb = $('eimi-antik-fb');
  if (ok) { fb.textContent = '✓ Σωστό!'; fb.className = 'eimi-fb eimi-ok'; _antikScore++; }
  else {
    fb.innerHTML = `✗ Λάθος — σωστό: <strong>${correct}</strong>`; fb.className = 'eimi-fb eimi-err';
    _antikMistakes.push({
      q: `${_antikCurr.srcForm} (${_antikCurr.srcLabel}) → ${_antikCurr.tgtLabel} · ${_antikCurr.person}`,
      typed, correct,
    });
    if (window.GE_CERBERUS_QUEUE) window.GE_CERBERUS_QUEUE.push({gameId:'eimi-antikatastatika',subjectId:'ancient-greek',qt:`${_antikCurr.srcForm} → ${_antikCurr.tgtLabel} · ${_antikCurr.person}`,chosen:typed,correct,error_metadata:{category:'verb_morphology',mutation_type:'incorrect_tense_substitution',details:{from_tense:_antikCurr.srcLabel,to_tense:_antikCurr.tgtLabel,person:_antikCurr.person}},ts:Date.now()});
  }
  _hudAntik();
  setTimeout(_antikNext, 1600);
}
function _hudAntik() {
  $('eimi-ascore').textContent   = _antikScore;
  $('eimi-aerr').textContent     = _antikMistakes.length;
  $('eimi-aremain').textContent  = _antikPool.length + (_antikCurr ? 1 : 0);
}
function _antikEnd() {
  $('eimi-antik-end-score').textContent = `${_antikScore} / ${_antikTotal}`;
  const log = $('eimi-antik-mistakes');
  if (!_antikMistakes.length) {
    log.innerHTML = '<p style="color:#27ae60;text-align:center;font-style:italic;margin:12px 0;">Τέλειο! Κανένα λάθος! 🎉</p>';
  } else {
    let h = `<div class="eimi-mis-hdr">Λάθη: ${_antikMistakes.length}</div><div class="eimi-mis-list">`;
    _antikMistakes.forEach(m => {
      h += `<div class="eimi-mis-row">
        <div class="eimi-mis-q">${m.q}</div>
        <div class="eimi-mis-ans"><span class="eimi-wrong">${m.typed||'—'}</span> → <span class="eimi-correct">${m.correct}</span></div>
      </div>`;
    });
    h += '</div>';
    log.innerHTML = h;
  }
  _show('eimi-screen-antik-end');
}

// ── Build HTML ────────────────────────────────────────────────
function _build() {
  const wrap = $('eimi-wrap');
  const filterBtns = [
    {id:'all',  label:'Όλα'},
    {id:'pres', label:'Ενεστώτας'},
    {id:'imp',  label:'Παρατατικός'},
    {id:'fut',  label:'Μέλλοντας'},
  ].map(f => `<button class="eimi-filter-btn${f.id === 'all' ? ' eimi-filter-on' : ''}" data-f="${f.id}" onclick="EIMI.setFilter('${f.id}',this)">${f.label}</button>`).join('');

  wrap.innerHTML = `
<!-- MENU -->
<div id="eimi-screen-menu" class="eimi-screen active">
  <div class="eimi-card">
    <div class="eimi-hero">
      <div class="eimi-hero-lemma">εἰμί</div>
      <div class="eimi-hero-meaning">«εἶναι, ὑπάρχειν»</div>
    </div>
    <hr class="eimi-hr">
    <h3>Τρόπος Εξάσκησης</h3>
    <div class="eimi-mode-grid">
      <div class="eimi-mode eimi-mode-sel" data-mode="flash" onclick="EIMI.setMode('flash',this)">
        <span class="eimi-mi">🃏</span><span>Καρτέλες</span>
        <span class="eimi-mh">Αναστρέψιμες κάρτες — δες τον τύπο, αυτοαξιολογήσου</span>
      </div>
      <div class="eimi-mode" data-mode="quiz" onclick="EIMI.setMode('quiz',this)">
        <span class="eimi-mi">✏️</span><span>Κουίζ</span>
        <span class="eimi-mh">Δίνεται ο χρόνος & το πρόσωπο — γράψε τον τύπο</span>
      </div>
      <div class="eimi-mode" data-mode="table" onclick="EIMI.setMode('table',this)">
        <span class="eimi-mi">📋</span><span>Πίνακας</span>
        <span class="eimi-mh">Συμπλήρωσε ολόκληρο τον πίνακα κλίσης</span>
      </div>
      <div class="eimi-mode" data-mode="match" onclick="EIMI.setMode('match',this)">
        <span class="eimi-mi">🔗</span><span>Αντιστοίχιση</span>
        <span class="eimi-mh">Σύνδεσε κάθε πρόσωπο με τον σωστό τύπο</span>
      </div>
      <div class="eimi-mode" data-mode="antik" onclick="EIMI.setMode('antik',this)">
        <span class="eimi-mi">⏳</span><span>Χρον. Αντικατάσταση</span>
        <span class="eimi-mh">Βρες τον ισοδύναμο τύπο σε διαφορετικό χρόνο</span>
      </div>
    </div>
    <h3>Χρόνος</h3>
    <div class="eimi-filter-row">${filterBtns}</div>
    <button class="eimi-btn-gold" onclick="EIMI.start()">Έναρξη →</button>
  </div>
</div>

<!-- FLASHCARD SCREEN -->
<div id="eimi-screen-flash" class="eimi-screen">
  <div class="eimi-card">
    <div class="eimi-flash-hdr">
      <button class="eimi-back-link" onclick="EIMI.back()">← Πίσω</button>
      <div class="eimi-flash-counter" id="eimi-flash-count">0 / 0</div>
    </div>
    <div class="eimi-progress-bar"><div class="eimi-progress-fill" id="eimi-flash-fill"></div></div>

    <div class="eimi-flashcard" id="eimi-flashcard" onclick="EIMI.flipCard()">
      <div class="eimi-flashcard-inner">
        <div class="eimi-flashcard-front">
          <div class="eimi-flash-tense-lbl" id="eimi-flash-tense"></div>
          <div class="eimi-flash-person-lbl" id="eimi-flash-person"></div>
          <div class="eimi-flash-hint">▸ κλικ για αποκάλυψη</div>
        </div>
        <div class="eimi-flashcard-back">
          <div class="eimi-flash-form-big" id="eimi-flash-form"></div>
          <div class="eimi-flash-back-ctx" id="eimi-flash-back-label"></div>
        </div>
      </div>
    </div>

    <div id="eimi-flash-reveal">
      <button class="eimi-btn-flip" onclick="EIMI.flipCard()">Δείξε τον τύπο ▸</button>
    </div>
    <div class="eimi-flash-btns" id="eimi-flash-btns" style="display:none;">
      <button class="eimi-btn-wrong" onclick="EIMI.flashAnswer(false)">✗ Δεν Ξέρω</button>
      <button class="eimi-btn-right" onclick="EIMI.flashAnswer(true)">✓ Ξέρω</button>
    </div>
  </div>
</div>

<!-- FLASHCARD DONE -->
<div id="eimi-screen-flash-done" class="eimi-screen">
  <div class="eimi-card" style="text-align:center;padding:40px 28px;">
    <div style="font-size:3rem;margin-bottom:16px;">🎉</div>
    <h2>Τέλος Καρτελών!</h2>
    <div class="eimi-big-score" id="eimi-flash-done-score">0/0</div>
    <p style="color:#8a7a60;margin-bottom:24px;">κάρτες που γνώριζες με την πρώτη</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button class="eimi-btn-gold" onclick="EIMI.start()">Ξανά →</button>
      <button class="eimi-btn-ghost" onclick="EIMI.back()">Μενού</button>
    </div>
  </div>
</div>

<!-- QUIZ SCREEN -->
<div id="eimi-screen-quiz" class="eimi-screen">
  <div class="eimi-card">
    <div class="eimi-game-hdr">
      <div class="eimi-stat"><div class="eimi-stat-l">Σωστά</div><div class="eimi-stat-v" id="eimi-qscore">0</div></div>
      <div class="eimi-stat"><div class="eimi-stat-l">Λάθη</div><div class="eimi-stat-v" id="eimi-qerr">0</div></div>
      <div class="eimi-stat"><div class="eimi-stat-l">Απομένουν</div><div class="eimi-stat-v" id="eimi-qremain">—</div></div>
      <button class="eimi-btn-ghost eimi-end-btn" onclick="EIMI.quizEnd()">Τέλος</button>
    </div>
    <div class="eimi-qbox" id="eimi-quiz-q"></div>
    <input type="text" id="eimi-quiz-input" class="eimi-fi-inp"
      autocomplete="off" autocorrect="off" spellcheck="false" placeholder="γράψε τον τύπο…">
    <button class="eimi-fi-submit" id="eimi-quiz-submit" onclick="EIMI.quizSubmit()">Υποβολή ↵</button>
    <div class="eimi-fb" id="eimi-quiz-fb"></div>
  </div>
</div>

<!-- QUIZ END -->
<div id="eimi-screen-quiz-end" class="eimi-screen">
  <div class="eimi-card" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="eimi-big-score" id="eimi-quiz-end-score">0/0</div>
    <hr class="eimi-hr">
    <div id="eimi-quiz-mistakes"></div>
    <hr class="eimi-hr">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button class="eimi-btn-gold" onclick="EIMI.start()">Ξανά →</button>
      <button class="eimi-btn-ghost" onclick="EIMI.back()">Μενού</button>
    </div>
  </div>
</div>

<!-- TABLE SCREEN -->
<div id="eimi-screen-table" class="eimi-screen">
  <div class="eimi-card">
    <div class="eimi-game-hdr">
      <button class="eimi-back-link" onclick="EIMI.back()">← Μενού</button>
      <div class="eimi-stat"><div class="eimi-stat-l">Χρόνος</div><div class="eimi-stat-v" id="eimi-tprogress">1/1</div></div>
    </div>
    <div id="eimi-table-content"></div>
  </div>
</div>

<!-- ΑΝΤΙΣΤΟΙΧΙΣΗ SCREEN -->
<div id="eimi-screen-match" class="eimi-screen">
  <div class="eimi-card">
    <div class="eimi-game-hdr">
      <button class="eimi-back-link" onclick="EIMI.back()">← Μενού</button>
      <div class="eimi-stat"><div class="eimi-stat-l">Σωστά</div><div class="eimi-stat-v" id="eimi-match-score">0</div></div>
      <div class="eimi-stat"><div class="eimi-stat-l">Ομάδα</div><div class="eimi-stat-v" id="eimi-match-progress">1/1</div></div>
    </div>
    <div class="eimi-match-group-hdr" id="eimi-match-hdr-text"></div>
    <p class="eimi-match-instr">Κάνε κλικ σε ένα πρόσωπο, μετά στον αντίστοιχο τύπο</p>
    <div class="eimi-match-grid" id="eimi-match-grid"></div>
  </div>
</div>

<!-- ΑΝΤΙΣΤΟΙΧΙΣΗ END -->
<div id="eimi-screen-match-end" class="eimi-screen">
  <div class="eimi-card" style="text-align:center;padding:40px 28px;">
    <div style="font-size:3rem;margin-bottom:16px;">🎯</div>
    <h2>Τέλος Αντιστοίχισης!</h2>
    <div class="eimi-big-score"><span id="eimi-match-end-score">0</span> / <span id="eimi-match-end-total">0</span></div>
    <p style="color:#8a7a60;margin:6px 0 4px;">σωστές αντιστοιχίσεις</p>
    <p style="color:#e67e6a;font-size:.9rem;margin-bottom:24px;">Λάθη: <span id="eimi-match-end-wrong">0</span></p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button class="eimi-btn-gold" onclick="EIMI.start()">Ξανά →</button>
      <button class="eimi-btn-ghost" onclick="EIMI.back()">Μενού</button>
    </div>
  </div>
</div>

<!-- ΧΡΟΝΙΚΗ ΑΝΤΙΚΑΤΑΣΤΑΣΗ SCREEN -->
<div id="eimi-screen-antik" class="eimi-screen">
  <div class="eimi-card">
    <div class="eimi-game-hdr">
      <div class="eimi-stat"><div class="eimi-stat-l">Σωστά</div><div class="eimi-stat-v" id="eimi-ascore">0</div></div>
      <div class="eimi-stat"><div class="eimi-stat-l">Λάθη</div><div class="eimi-stat-v" id="eimi-aerr">0</div></div>
      <div class="eimi-stat"><div class="eimi-stat-l">Απομένουν</div><div class="eimi-stat-v" id="eimi-aremain">—</div></div>
      <button class="eimi-btn-ghost eimi-end-btn" onclick="EIMI.antikEnd()">Τέλος</button>
    </div>
    <div class="eimi-antik-src">
      <div class="eimi-antik-src-ctx" id="eimi-antik-src-ctx"></div>
      <div class="eimi-antik-src-form" id="eimi-antik-src-form"></div>
    </div>
    <div class="eimi-antik-tgt-lbl" id="eimi-antik-tgt-lbl"></div>
    <input type="text" id="eimi-antik-input" class="eimi-fi-inp"
      autocomplete="off" autocorrect="off" spellcheck="false" placeholder="γράψε τον τύπο…">
    <button class="eimi-fi-submit" id="eimi-antik-submit" onclick="EIMI.antikSubmit()">Υποβολή ↵</button>
    <div class="eimi-fb" id="eimi-antik-fb"></div>
  </div>
</div>

<!-- ΧΡΟΝΙΚΗ ΑΝΤΙΚΑΤΑΣΤΑΣΗ END -->
<div id="eimi-screen-antik-end" class="eimi-screen">
  <div class="eimi-card" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Αντικατάστασης!</h2>
    <div class="eimi-big-score" id="eimi-antik-end-score">0/0</div>
    <hr class="eimi-hr">
    <div id="eimi-antik-mistakes"></div>
    <hr class="eimi-hr">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button class="eimi-btn-gold" onclick="EIMI.start()">Ξανά →</button>
      <button class="eimi-btn-ghost" onclick="EIMI.back()">Μενού</button>
    </div>
  </div>
</div>

<!-- POLYTONIC KEYBOARD -->
<div id="eimi-kb-wrap" style="display:none;position:sticky;bottom:0;background:#0e0c0a;padding:6px 20px 10px;border-top:1px solid #3d3020;">
  <div class="eimi-poly-kb">
    <button class="eimi-poly-toggle" id="eimi-poly-toggle" onclick="EIMI.kbToggle()">
      Πολυτονικό Πληκτρολόγιο <span class="eimi-poly-arrow">▼</span>
    </button>
    <div class="eimi-poly-body" id="eimi-poly-body">
      <div class="eimi-diac-row" id="eimi-diac-row"></div>
      <div id="eimi-vowel-rows"></div>
    </div>
  </div>
</div>`;
}

// ── Public state ──────────────────────────────────────────────
let _mode = 'flash', _filter = 'all';

// ── Public API ────────────────────────────────────────────────
return {
  open() {
    document.getElementById('eimi-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!$('eimi-screen-menu')) _build();
    _show('eimi-screen-menu');
  },
  close() {
    document.getElementById('eimi-overlay').classList.remove('active');
    document.body.style.overflow = '';
  },
  setMode(m, el) {
    _mode = m;
    document.querySelectorAll('.eimi-mode').forEach(b => b.classList.remove('eimi-mode-sel'));
    el.classList.add('eimi-mode-sel');
  },
  setFilter(f, el) {
    _filter = f;
    document.querySelectorAll('.eimi-filter-btn').forEach(b => b.classList.remove('eimi-filter-on'));
    el.classList.add('eimi-filter-on');
  },
  start() {
    _deckTotal = _buildDeck(_filter).length;
    if (_mode === 'flash')       _startFlash();
    else if (_mode === 'quiz')   _startQuiz();
    else if (_mode === 'table')  _startTable();
    else if (_mode === 'match')  _startMatch();
    else if (_mode === 'antik')  _startAntik();
  },
  flipCard()          { _flipCard(); },
  flashAnswer(knew)   { _flashAnswer(knew); },
  quizSubmit()        { _quizSubmit(); },
  quizEnd()           { _quizEnd(); },
  tableSubmit()       { _tableSubmit(); },
  matchClick(s, i)    { _matchClick(s, i); },
  antikSubmit()       { _antikSubmit(); },
  antikEnd()          { _antikEnd(); },
  back()              { _show('eimi-screen-menu'); },
  kbToggle()          { _kbTogglePanel(); },
};

})();

function openEimi()  { EIMI.open();  }
function closeEimi() { EIMI.close(); }
