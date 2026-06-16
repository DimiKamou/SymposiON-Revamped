// ============================================================
//  ΚΛΙΣΗ ΡΗΜΑΤΩΝ — εἰμί · φημί · οἶδα
//  Modes: MC · FI · Match · All Forms
//  Depends on: klisi-rimaton/data.js  (KR_DB)
// ============================================================

const KR = (() => {

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

let _kbDiac = null;
let _kbLastInput = null;

function _kbToggle(id) {
  _kbDiac = _kbDiac === id ? null : id;
  document.querySelectorAll('#kr-diac-row .kr-dkey').forEach(b =>
    b.classList.toggle('kr-dkey-on', b.dataset.id === _kbDiac));
  _kbRenderVowels();
}
function _kbRenderVowels() {
  ['α','ε','η','ι','ο','υ','ω'].forEach(v => {
    const c = document.getElementById('kr-vkeys-' + v); if (!c) return;
    while (c.children.length > 1) c.removeChild(c.lastChild);
    if (!_kbDiac) return;
    const ch = (COMBO[_kbDiac] || {})[v]; if (!ch) return;
    const b = document.createElement('button'); b.className = 'kr-vkey kr-vkey-hi';
    b.textContent = ch; b.onmousedown = e => { e.preventDefault(); _kbInsert(ch); }; c.appendChild(b);
  });
}
function _kbInsert(ch) {
  let inp = (_kbLastInput && document.contains(_kbLastInput)) ? _kbLastInput : document.getElementById('kr-fi-input');
  if (!inp) return;
  const s = inp.selectionStart, e = inp.selectionEnd;
  inp.value = inp.value.slice(0, s) + ch + inp.value.slice(e);
  inp.selectionStart = inp.selectionEnd = s + ch.length; inp.focus();
  if (_kbDiac) { _kbDiac = null; document.querySelectorAll('#kr-diac-row .kr-dkey').forEach(b => b.classList.remove('kr-dkey-on')); _kbRenderVowels(); }
}
function _kbVowelClick(v) { const ch = _kbDiac ? (COMBO[_kbDiac] || {})[v] || v : v; _kbInsert(ch); }
function _kbTogglePanel() {
  document.getElementById('kr-poly-toggle')?.classList.toggle('open');
  document.getElementById('kr-poly-body')?.classList.toggle('open');
}
function _buildKB() {
  const dr = document.getElementById('kr-diac-row');
  const vr = document.getElementById('kr-vowel-rows');
  if (!dr || !vr) return;
  dr.innerHTML = '';
  DIAC.forEach(d => {
    const b = document.createElement('button'); b.className = 'kr-dkey'; b.dataset.id = d.id;
    b.innerHTML = `<span>${d.l}</span><span class="kr-dkey-label">${d.h}</span>`;
    b.onclick = () => _kbToggle(d.id); dr.appendChild(b);
  });
  ['α','ε','η','ι','ο','υ','ω'].forEach(v => {
    const row = document.createElement('div'); row.className = 'kr-vowel-row';
    const lbl = document.createElement('div'); lbl.className = 'kr-vlabel'; lbl.textContent = v; row.appendChild(lbl);
    const keys = document.createElement('div'); keys.className = 'kr-vkeys'; keys.id = 'kr-vkeys-' + v;
    const plain = document.createElement('button'); plain.className = 'kr-vkey'; plain.textContent = v;
    plain.onmousedown = e => { e.preventDefault(); _kbVowelClick(v); }; keys.appendChild(plain); row.appendChild(keys); vr.appendChild(row);
  });
  _kbDiac = null; _kbRenderVowels();
}

// ── Data helpers ─────────────────────────────────────────────
function _pool(verbIds) {
  return KR_DB.filter(e => verbIds.includes('all') || verbIds.includes(e.id));
}
function _rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Build wrong MC options from other forms across all verbs
function _wrongOpts(correct, n = 3) {
  const all = [];
  for (const e of KR_DB) for (const g of e.groups) for (const f of g.forms) if (f.f !== correct) all.push(f.f);
  const shuffled = _shuffle(all);
  const seen = new Set([correct]);
  const res = [];
  for (const v of shuffled) { if (!seen.has(v)) { seen.add(v); res.push(v); if (res.length >= n) break; } }
  while (res.length < n) res.push('—');
  return res;
}

// ── DOM helpers ───────────────────────────────────────────────
const $ = id => document.getElementById(id);
function _show(id) {
  document.querySelectorAll('#kr-wrap .kr-screen').forEach(s => s.classList.remove('active'));
  $(id)?.classList.add('active');
}

// ── State ─────────────────────────────────────────────────────
let _state = {};
function _initState(mode, verbIds, time, lives) {
  _state = {
    mode, verbIds, time, lives,
    score: 0, livesLeft: lives === 0 ? Infinity : lives,
    timerLeft: time, timerInterval: null, pendingTO: null,
    answering: false, lastKey: null, mistakes: [],
    pool: _pool(verbIds),
  };
}

// ── HUD ───────────────────────────────────────────────────────
function _hud() {
  ['kr-sv','kr-msv','kr-asv'].forEach(id => { const el = $(id); if (el) el.textContent = _state.score; });
  ['kr-lv','kr-mlv','kr-alv'].forEach(id => {
    const el = $(id); if (!el) return;
    if (_state.livesLeft === Infinity) { el.textContent = '∞'; el.style.fontSize = '1.4rem'; }
    else el.innerHTML = Array(_state.livesLeft).fill('❤️').join('') || '💀';
  });
}
function _startTimer() {
  if (_state.time === 0) return;
  _state.timerInterval = setInterval(() => {
    _state.timerLeft--;
    ['kr-tv','kr-mtv','kr-atv'].forEach(id => {
      const tv = $(id); if (!tv) return;
      tv.textContent = _gramFmtSec(_state.timerLeft);
      tv.classList.toggle('kr-warn', _state.timerLeft <= 10);
      tv.classList.toggle('kr-caut', _state.timerLeft <= 20 && _state.timerLeft > 10);
    });
    if (_state.timerLeft <= 0) _end();
  }, 1000);
}

// ── End ───────────────────────────────────────────────────────
function _end() {
  clearInterval(_state.timerInterval);
  if (_state.pendingTO) clearTimeout(_state.pendingTO);
  const es = $('kr-es'); if (es) es.textContent = _state.score;
  const log = $('kr-mistakes-log');
  if (log) {
    if (!_state.mistakes.length) {
      log.innerHTML = '<p style="color:#27ae60;text-align:center;font-style:italic;margin:12px 0;">Τέλειο! Κανένα λάθος! 🎉</p>';
    } else {
      let h = `<div class="kr-mis-hdr">Λάθη: ${_state.mistakes.length}</div><div class="kr-mis-list">`;
      _state.mistakes.forEach(m => {
        h += `<div class="kr-mis-row">
          <div class="kr-mis-q"><em>${m.lemma}</em> — <span style="color:#c9a44a;">${m.groupLabel} · ${m.askLabel}</span></div>
          <div class="kr-mis-ans"><span class="kr-wrong">${m.typed || '—'}</span><span style="color:#8a7a60"> → </span><span class="kr-correct">${m.correct}</span></div>
        </div>`;
      });
      h += '</div>'; log.innerHTML = h;
    }
  }
  _show('kr-screen-end');

  // ── Temple rewards (config-driven per-game params — see realm.js gameRewards) ──
  if (typeof awardGameRewards === 'function') {
    const total = _state.score + _state.mistakes.length;
    awardGameRewards('klisi-rimaton', { score: _state.score, perfect: _state.mistakes.length === 0 && total > 0 });
  } else if (typeof awardRewards === 'function') {
    const perfect = _state.mistakes.length === 0 && (_state.score + _state.mistakes.length) > 0;
    awardRewards(Math.round(_state.score * 15 + (perfect ? 10 : 0)), 3 + (perfect ? 3 : 0));
  }
}

// ── Feedback ──────────────────────────────────────────────────
function _fb(elId, ok, correct) {
  const fb = $(elId); if (!fb) return;
  if (ok) { fb.textContent = '✓ Σωστό!'; fb.className = 'kr-fb kr-ok'; }
  else { fb.innerHTML = `✗ Λάθος — σωστό: <strong>${correct}</strong>`; fb.className = 'kr-fb kr-err'; }
}
function _fbClear(elId) { const fb = $(elId); if (fb) { fb.textContent = ''; fb.className = 'kr-fb'; } }

// ── Pick random question ──────────────────────────────────────
function _pickQ() {
  if (!_state.pool.length) return null;
  let entry;
  for (let a = 0; a < 10; a++) { const c = _rand(_state.pool); if (a < 9 && c.id === _state.lastKey) continue; entry = c; break; }
  if (!entry) entry = _rand(_state.pool);
  _state.lastKey = entry.id;
  const groups = entry.groups.filter(g => g.forms.length >= 2);
  if (!groups.length) return null;
  const group = _rand(groups);
  const givenIdx = Math.floor(Math.random() * group.forms.length);
  let askedIdx = givenIdx;
  for (let t = 0; t < 12 && askedIdx === givenIdx; t++) askedIdx = Math.floor(Math.random() * group.forms.length);
  if (askedIdx === givenIdx) askedIdx = (givenIdx + 1) % group.forms.length;
  return { entry, group, given: group.forms[givenIdx], asked: group.forms[askedIdx] };
}

// ── MC MODE ───────────────────────────────────────────────────
function _mcNextQ() {
  if (!_state.pool.length) { _end(); return; }
  _state.answering = false; _fbClear('kr-fb');
  const q = _pickQ(); if (!q) { _end(); return; }
  _state.curr = q;
  const { entry, group, given, asked } = q;
  const correct = asked.f;
  const opts = _shuffle([correct, ..._wrongOpts(correct, 3)]);
  const qel = $('kr-q');
  if (qel) qel.innerHTML = `
    <div class="kr-q-main">
      <span class="kr-q-lemma">${entry.lemma}</span>
      ${entry.meaning ? `<span class="kr-q-meaning">(${entry.meaning})</span>` : ''}
    </div>
    <div class="kr-q-group">${group.label}</div>
    <div class="kr-q-given">
      <span class="kr-q-label">${given.l}:</span>
      <span class="kr-q-form">${given.f}</span>
    </div>
    <div class="kr-q-ask">Ποιος είναι ο/η <strong>${asked.l}</strong>;</div>`;
  const grid = $('kr-opts'); if (!grid) return;
  grid.innerHTML = '';
  opts.forEach(opt => {
    const b = document.createElement('button'); b.className = 'kr-opt'; b.textContent = opt;
    b.onclick = () => _mcAnswer(opt); grid.appendChild(b);
  });
}
function _mcAnswer(chosen) {
  if (_state.answering) return; _state.answering = true;
  const { asked, entry, group } = _state.curr;
  const correct = asked.f;
  const ok = chosen === correct;
  document.querySelectorAll('#kr-opts .kr-opt').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('kr-opt-ok');
    else if (b.textContent === chosen && !ok) b.classList.add('kr-opt-err');
  });
  _fb('kr-fb', ok, correct);
  if (ok) _state.score++;
  else {
    _state.mistakes.push({ lemma: entry.lemma, groupLabel: group.label, askLabel: asked.l, typed: chosen, correct });
    if(typeof logStudentMistake==='function') logStudentMistake('klisi-rimaton','klisi-rimaton','mc',{q:`${entry.lemma} · ${group.label} · ${asked.l}`,a:correct},chosen);
    if (window.GE_CERBERUS_QUEUE) window.GE_CERBERUS_QUEUE.push({gameId:'klisi-rimaton',subjectId:'ancient-greek',qt:`${entry.lemma} · ${group.label} · ${asked.l}`,chosen,correct,error_metadata:{category:'verb_morphology',mutation_type:'incorrect_form',details:{lemma:entry.lemma,group:group.label,person:asked.l}},ts:Date.now()});
    if (_state.livesLeft !== Infinity) { _state.livesLeft--; _hud(); if (_state.livesLeft <= 0) { _state.pendingTO = setTimeout(_end, 1200); return; } }
  }
  _hud(); _state.pendingTO = setTimeout(_mcNextQ, 1500);
}

// ── FI MODE ───────────────────────────────────────────────────
function _fiNextQ() {
  if (!_state.pool.length) { _end(); return; }
  _state.answering = false; _fbClear('kr-fb');
  const q = _pickQ(); if (!q) { _end(); return; }
  _state.curr = q;
  const { entry, group, given, asked } = q;
  const qel = $('kr-q');
  if (qel) qel.innerHTML = `
    <div class="kr-q-main">
      <span class="kr-q-lemma">${entry.lemma}</span>
      ${entry.meaning ? `<span class="kr-q-meaning">(${entry.meaning})</span>` : ''}
    </div>
    <div class="kr-q-group">${group.label}</div>
    <div class="kr-q-given">
      <span class="kr-q-label">${given.l}:</span>
      <span class="kr-q-form">${given.f}</span>
    </div>
    <div class="kr-q-ask">Γράψε τον/την <strong>${asked.l}</strong>:</div>`;
  const inp = $('kr-fi-input');
  if (inp) { inp.value = ''; inp.disabled = false; inp.className = 'kr-fi-inp'; inp.focus(); }
  const sub = $('kr-fi-submit'); if (sub) sub.disabled = false;
  _kbDiac = null;
  document.querySelectorAll('#kr-diac-row .kr-dkey').forEach(b => b.classList.remove('kr-dkey-on'));
  _kbRenderVowels();
}
function _fiSubmit() {
  if (_state.answering) return;
  const inp = $('kr-fi-input'); if (!inp) return;
  const typed = inp.value.trim(); if (!typed) { inp.focus(); return; }
  _state.answering = true; inp.disabled = true;
  const sub = $('kr-fi-submit'); if (sub) sub.disabled = true;
  const { asked, entry, group } = _state.curr;
  const correct = asked.f;
  const ok = typed === correct;
  inp.classList.add(ok ? 'kr-fi-ok' : 'kr-fi-err');
  _fb('kr-fb', ok, correct);
  if (ok) _state.score++;
  else {
    _state.mistakes.push({ lemma: entry.lemma, groupLabel: group.label, askLabel: asked.l, typed, correct });
    if(typeof logStudentMistake==='function') logStudentMistake('klisi-rimaton','klisi-rimaton','fi',{q:`${entry.lemma} · ${group.label} · ${asked.l}`,a:correct},typed);
    if (window.GE_CERBERUS_QUEUE) window.GE_CERBERUS_QUEUE.push({gameId:'klisi-rimaton',subjectId:'ancient-greek',qt:`${entry.lemma} · ${group.label} · ${asked.l}`,chosen:typed,correct,error_metadata:{category:'verb_morphology',mutation_type:'incorrect_form',details:{lemma:entry.lemma,group:group.label,person:asked.l}},ts:Date.now()});
    if (_state.livesLeft !== Infinity) { _state.livesLeft--; _hud(); if (_state.livesLeft <= 0) { _state.pendingTO = setTimeout(_end, 1400); return; } }
  }
  _hud(); _state.pendingTO = setTimeout(_fiNextQ, 1700);
}

// ── MATCH MODE ────────────────────────────────────────────────
let _matchState = { leftSel: null, rightSel: null, matched: 0, total: 0, pairs: [] };

function _matchNextRound() {
  _fbClear('kr-fb-match');
  // Collect all (entry, group, formIdx) candidates from selected pool
  const candidates = [];
  for (const entry of _state.pool) {
    for (const group of entry.groups) {
      for (let i = 0; i < group.forms.length; i++) {
        candidates.push({ entry, group, formIdx: i, id: `${entry.id}|${group.id}|${i}` });
      }
    }
  }
  const batch = _shuffle(candidates).slice(0, 6);
  const pairs = batch.map(c => ({
    id: c.id,
    leftLabel: `${c.entry.lemma} — ${c.group.label} — ${c.group.forms[c.formIdx].l}`,
    rightForm: c.group.forms[c.formIdx].f,
  }));

  _matchState = { leftSel: null, rightSel: null, matched: 0, total: pairs.length, pairs };
  const leftEl = $('kr-match-left'), rightEl = $('kr-match-right');
  if (!leftEl || !rightEl) return;
  leftEl.innerHTML = ''; rightEl.innerHTML = '';

  const leftItems = _shuffle([...pairs]);
  const rightItems = _shuffle([...pairs]);

  leftItems.forEach(p => {
    const b = document.createElement('div'); b.className = 'kr-match-item kr-match-left-item';
    b.dataset.id = p.id; b.textContent = p.leftLabel;
    b.onclick = () => _matchLeft(b, p); leftEl.appendChild(b);
  });
  rightItems.forEach(p => {
    const b = document.createElement('div'); b.className = 'kr-match-item kr-match-right-item';
    b.dataset.id = p.id; b.textContent = p.rightForm;
    b.onclick = () => _matchRight(b, p); rightEl.appendChild(b);
  });

  const hdr = $('kr-match-rnd');
  if (hdr) hdr.textContent = `Αντιστοίχηση — ${pairs.length} ζεύγη`;
}
function _matchLeft(el, p) {
  if (el.classList.contains('kr-match-done')) return;
  document.querySelectorAll('.kr-match-left-item.kr-match-sel').forEach(b => b.classList.remove('kr-match-sel'));
  el.classList.add('kr-match-sel'); _matchState.leftSel = { el, p };
  if (_matchState.rightSel) _matchCheck();
}
function _matchRight(el, p) {
  if (el.classList.contains('kr-match-done')) return;
  document.querySelectorAll('.kr-match-right-item.kr-match-sel').forEach(b => b.classList.remove('kr-match-sel'));
  el.classList.add('kr-match-sel'); _matchState.rightSel = { el, p };
  if (_matchState.leftSel) _matchCheck();
}
function _matchCheck() {
  const { leftSel, rightSel } = _matchState;
  if (!leftSel || !rightSel) return;
  _matchState.leftSel = null; _matchState.rightSel = null;
  const ok = leftSel.p.id === rightSel.p.id;
  if (ok) {
    leftSel.el.classList.remove('kr-match-sel'); leftSel.el.classList.add('kr-match-done', 'kr-match-ok');
    rightSel.el.classList.remove('kr-match-sel'); rightSel.el.classList.add('kr-match-done', 'kr-match-ok');
    _state.score++; _matchState.matched++; _hud();
    if (_matchState.matched >= _matchState.total)
      _state.pendingTO = setTimeout(_matchNextRound, 700);
  } else {
    leftSel.el.classList.add('kr-match-err'); rightSel.el.classList.add('kr-match-err');
    if (_state.livesLeft !== Infinity) {
      _state.livesLeft--; _hud();
      if (_state.livesLeft <= 0) { _state.pendingTO = setTimeout(_end, 1200); return; }
    }
    setTimeout(() => {
      leftSel.el.classList.remove('kr-match-sel', 'kr-match-err');
      rightSel.el.classList.remove('kr-match-sel', 'kr-match-err');
    }, 700);
  }
}

// ── ALL FORMS MODE ────────────────────────────────────────────
let _allSubmitted = false;

function _allNextGroup() {
  _allSubmitted = false;
  let entry;
  for (let a = 0; a < 10; a++) { const c = _rand(_state.pool); if (a < 9 && c.id === _state.lastKey) continue; entry = c; break; }
  if (!entry) entry = _rand(_state.pool);
  _state.lastKey = entry.id;
  const group = _rand(entry.groups);
  _state.currAll = { entry, group };

  const container = $('kr-all-container'); if (!container) return;
  container.innerHTML = `
    <div class="kr-all-header">
      <span class="kr-q-lemma">${entry.lemma}</span>
      ${entry.meaning ? `<span class="kr-q-meaning"> (${entry.meaning})</span>` : ''}
      <div class="kr-q-group" style="margin-top:6px;">${group.label}</div>
    </div>
    <div class="kr-all-table">
      ${group.forms.map((f, i) => `
        <div class="kr-all-row" data-idx="${i}">
          <div class="kr-all-label">${f.l}</div>
          <input class="kr-all-inp kr-fi-inp" data-idx="${i}"
            autocomplete="off" autocorrect="off" spellcheck="false"
            placeholder="γράψε τον τύπο…">
        </div>`).join('')}
    </div>
    <button class="kr-btn-gold kr-all-submit" id="kr-all-submit-btn">Υποβολή →</button>`;

  container.querySelectorAll('.kr-all-inp').forEach((inp, i) => {
    inp.addEventListener('focus', () => { _kbLastInput = inp; });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const next = container.querySelector(`.kr-all-inp[data-idx="${i + 1}"]`);
        if (next) next.focus(); else _allSubmit();
      }
    });
  });
  $('kr-all-submit-btn').onclick = _allSubmit;
  setTimeout(() => container.querySelector('.kr-all-inp')?.focus(), 80);
}
function _allSubmit() {
  if (_allSubmitted) return; _allSubmitted = true;
  const { entry, group } = _state.currAll;
  let correct = 0;
  const container = $('kr-all-container');
  container.querySelectorAll('.kr-all-inp').forEach((inp, i) => {
    inp.disabled = true;
    const typed = inp.value.trim(), expected = group.forms[i].f;
    const ok = typed === expected;
    if (ok) { correct++; inp.classList.add('kr-fi-ok'); }
    else {
      inp.classList.add('kr-fi-err');
      const row = inp.closest('.kr-all-row');
      if (row) {
        const hint = document.createElement('div'); hint.className = 'kr-all-hint';
        hint.innerHTML = `<span style="color:#e67e6a">${typed || '—'}</span> → <span style="color:#5dca8a">${expected}</span>`;
        row.appendChild(hint);
      }
      _state.mistakes.push({ lemma: entry.lemma, groupLabel: group.label, askLabel: group.forms[i].l, typed, correct: expected });
      if(typeof logStudentMistake==='function') logStudentMistake('klisi-rimaton','klisi-rimaton','all',{q:`${entry.lemma} · ${group.label} · ${group.forms[i].l}`,a:expected},typed||'—');
    }
  });
  _state.score += correct;
  if (_state.livesLeft !== Infinity && correct < group.forms.length)
    _state.livesLeft = Math.max(0, _state.livesLeft - (group.forms.length - correct));
  _hud();
  const btn = $('kr-all-submit-btn');
  if (btn) {
    btn.textContent = `Επόμενη ομάδα → (${correct}/${group.forms.length} σωστά)`;
    btn.onclick = () => { if (_state.livesLeft <= 0) { _end(); return; } _allNextGroup(); };
  }
  if (_state.livesLeft <= 0) _state.pendingTO = setTimeout(_end, 1800);
}

// ── Build HTML ────────────────────────────────────────────────
function _build() {
  const wrap = $('kr-wrap');

  const verbBtns = KR_DB.map(e => `
    <button class="kr-verb-btn kr-verb-on" data-id="${e.id}" onclick="KR.toggleVerb('${e.id}',this)">
      <span class="kr-verb-lemma">${e.lemma}</span>
      <span class="kr-verb-meaning">${e.meaning}</span>
    </button>`).join('');

  wrap.innerHTML = `
<!-- VERB SELECT SCREEN -->
<div id="kr-screen-verbs" class="kr-screen active">
  <div class="kr-card kr-card-scroll">
    <h1>Κλίση Ρημάτων</h1>
    <p class="kr-sub">εἰμί · φημί · οἶδα — Αρχαία Ελληνικά</p>
    <hr class="kr-hr">
    <h3>Επίλεξε Ρήμα / Ρήματα</h3>
    <div class="kr-verb-grid">${verbBtns}</div>
    <button class="kr-btn-all" onclick="KR.selectAll()">Όλα ✓</button>
    <div class="kr-filter-info">Επιλεγμένα: <strong id="kr-filter-count">${KR_DB.length} ρήματα</strong></div>
    <button class="kr-btn-gold" id="kr-continue-btn" onclick="KR.goSettings()">Συνέχεια →</button>
  </div>
</div>

<!-- SETTINGS -->
<div id="kr-screen-settings" class="kr-screen">
  <div class="kr-card">
    <button class="kr-back-link" onclick="KR.back()">← Επιστροφή</button>
    <h2 id="kr-sett-title">Ρυθμίσεις</h2>
    <hr class="kr-hr">
    <h3>Τρόπος Παιχνιδιού</h3>
    <div class="kr-mode-grid">
      <div class="kr-mode kr-mode-sel" data-mode="mc" onclick="KR.setMode('mc',this)">
        <span class="kr-mi">🔲</span><span>Πολλαπλή Επιλογή</span>
        <span class="kr-mh">Δίνεται τύπος → βρες άλλον</span>
      </div>
      <div class="kr-mode" data-mode="fi" onclick="KR.setMode('fi',this)">
        <span class="kr-mi">✏️</span><span>Συμπλήρωση Κενού</span>
        <span class="kr-mh">Γράψε τον ζητούμενο τύπο</span>
      </div>
      <div class="kr-mode" data-mode="match" onclick="KR.setMode('match',this)">
        <span class="kr-mi">🔗</span><span>Αντιστοίχηση</span>
        <span class="kr-mh">Ταίριαξε γραμματικό τύπο με λέξη</span>
      </div>
      <div class="kr-mode" data-mode="all" onclick="KR.setMode('all',this)">
        <span class="kr-mi">📋</span><span>Όλοι οι Τύποι</span>
        <span class="kr-mh">Συμπλήρωσε ολόκληρη ομάδα τύπων</span>
      </div>
    </div>
    <div class="kr-sett-row">
      <div class="kr-field"><label>Χρόνος</label>
        <select id="kr-sel-time">
          <option value="60">60 δευτ.</option>
          <option value="90" selected>90 δευτ.</option>
          <option value="120">120 δευτ.</option>
          <option value="180">180 δευτ.</option>
          <option value="0">Απεριόριστο</option>
        </select>
      </div>
      <div class="kr-field"><label>Ζωές</label>
        <select id="kr-sel-lives">
          <option value="1">1 ζωή</option>
          <option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option>
          <option value="0">Απεριόριστο</option>
        </select>
      </div>
    </div>
    <button class="kr-btn-gold" onclick="KR.launch()">Έναρξη →</button>
  </div>
</div>

<!-- GAME SCREEN (MC + FI) -->
<div id="kr-screen-game" class="kr-screen">
  <div class="kr-card">
    <div class="kr-hdr">
      <div class="kr-stat"><div class="kr-stat-l">Βαθμός</div><div class="kr-stat-v" id="kr-sv">0</div></div>
      <div class="kr-stat"><div class="kr-stat-l">Χρόνος</div><div class="kr-stat-v" id="kr-tv">—</div></div>
      <div class="kr-stat"><div class="kr-stat-l">Ζωές</div><div class="kr-stat-v" id="kr-lv"></div></div>
      <button class="kr-btn-ghost kr-end-btn" onclick="KR.endGame()">Τέλος</button>
    </div>
    <div class="kr-qbox" id="kr-q"></div>
    <div id="kr-mc-area"><div class="kr-opts" id="kr-opts"></div></div>
    <div id="kr-fi-area" style="display:none;">
      <input type="text" id="kr-fi-input" class="kr-fi-inp"
        autocomplete="off" autocorrect="off" spellcheck="false"
        placeholder="γράψε τον τύπο…">
      <button class="kr-fi-submit" id="kr-fi-submit" onclick="KR.fiSubmit()">Υποβολή ↵</button>
    </div>
    <div class="kr-fb" id="kr-fb"></div>
  </div>
</div>

<!-- MATCH SCREEN -->
<div id="kr-screen-match" class="kr-screen">
  <div class="kr-card kr-card-wide">
    <div class="kr-hdr">
      <div class="kr-stat"><div class="kr-stat-l">Βαθμός</div><div class="kr-stat-v" id="kr-msv">0</div></div>
      <div class="kr-stat"><div class="kr-stat-l">Χρόνος</div><div class="kr-stat-v" id="kr-mtv">—</div></div>
      <div class="kr-stat"><div class="kr-stat-l">Ζωές</div><div class="kr-stat-v" id="kr-mlv"></div></div>
      <button class="kr-btn-ghost kr-end-btn" onclick="KR.endGame()">Τέλος</button>
    </div>
    <div class="kr-match-hdr" id="kr-match-rnd">Αντιστοίχηση</div>
    <div class="kr-fb" id="kr-fb-match"></div>
    <div class="kr-match-grid">
      <div class="kr-match-col" id="kr-match-left"></div>
      <div class="kr-match-col" id="kr-match-right"></div>
    </div>
  </div>
</div>

<!-- ALL FORMS SCREEN -->
<div id="kr-screen-all" class="kr-screen">
  <div class="kr-card">
    <div class="kr-hdr">
      <div class="kr-stat"><div class="kr-stat-l">Βαθμός</div><div class="kr-stat-v" id="kr-asv">0</div></div>
      <div class="kr-stat"><div class="kr-stat-l">Χρόνος</div><div class="kr-stat-v" id="kr-atv">—</div></div>
      <div class="kr-stat"><div class="kr-stat-l">Ζωές</div><div class="kr-stat-v" id="kr-alv"></div></div>
      <button class="kr-btn-ghost kr-end-btn" onclick="KR.endGame()">Τέλος</button>
    </div>
    <div id="kr-all-container"></div>
  </div>
</div>

<!-- SHARED POLYTONIC KEYBOARD (shown in FI + All modes) -->
<div id="kr-kb-wrap" style="display:none;position:sticky;bottom:0;background:#0e0c0a;padding:6px 20px 10px;border-top:1px solid #3d3020;">
  <div class="kr-poly-kb">
    <button class="kr-poly-toggle" id="kr-poly-toggle" onclick="KR.kbToggle()">
      Πολυτονικό Πληκτρολόγιο <span class="kr-poly-arrow">▼</span>
    </button>
    <div class="kr-poly-body" id="kr-poly-body">
      <div class="kr-diac-row" id="kr-diac-row"></div>
      <div id="kr-vowel-rows"></div>
    </div>
  </div>
</div>

<!-- END SCREEN -->
<div id="kr-screen-end" class="kr-screen">
  <div class="kr-card" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="kr-big-score" id="kr-es">0</div>
    <div style="color:#8a7a60;margin-bottom:16px;text-align:center;">Τελική βαθμολογία</div>
    <hr class="kr-hr">
    <div id="kr-mistakes-log"></div>
    <hr class="kr-hr">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button class="kr-btn-gold" onclick="KR.retry()">Δοκιμάστε Ξανά</button>
      <button class="kr-btn-ghost" onclick="KR.back()">Αρχική</button>
    </div>
  </div>
</div>`;
}

// ── Public API ────────────────────────────────────────────────
let _selectedVerbs = ['eim', 'phimi', 'oida'];
let _mode = 'mc';

function _updateFilterInfo() {
  const cnt = _selectedVerbs.length;
  const el = $('kr-filter-count'); if (el) el.textContent = cnt + ' ρήματα';
  const btn = $('kr-continue-btn'); if (btn) btn.disabled = cnt === 0;
}

return {
  open() {
    document.getElementById('kr-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!$('kr-screen-verbs')) { _build(); _updateFilterInfo(); }
    _show('kr-screen-verbs');
  },
  close() {
    clearInterval(_state.timerInterval);
    if (_state.pendingTO) clearTimeout(_state.pendingTO);
    _state.timerInterval = null; _state.pendingTO = null;
    document.getElementById('kr-overlay').classList.remove('active');
    document.body.style.overflow = '';
    _show('kr-screen-verbs');
  },
  toggleVerb(id, el) {
    if (_selectedVerbs.includes(id)) {
      if (_selectedVerbs.length === 1) return; // keep at least one selected
      _selectedVerbs = _selectedVerbs.filter(v => v !== id);
      el.classList.remove('kr-verb-on');
    } else {
      _selectedVerbs.push(id);
      el.classList.add('kr-verb-on');
    }
    _updateFilterInfo();
  },
  selectAll() {
    _selectedVerbs = KR_DB.map(e => e.id);
    document.querySelectorAll('.kr-verb-btn').forEach(b => b.classList.add('kr-verb-on'));
    _updateFilterInfo();
  },
  goSettings() {
    const names = _selectedVerbs.map(id => KR_DB.find(e => e.id === id)?.lemma || id);
    const t = $('kr-sett-title'); if (t) t.textContent = names.join(' · ');
    _show('kr-screen-settings');
  },
  back() {
    clearInterval(_state.timerInterval);
    if (_state.pendingTO) clearTimeout(_state.pendingTO);
    _state.timerInterval = null; _state.pendingTO = null;
    _show('kr-screen-verbs');
  },
  setMode(m, el) {
    _mode = m;
    document.querySelectorAll('.kr-mode').forEach(b => b.classList.remove('kr-mode-sel'));
    el.classList.add('kr-mode-sel');
  },
  launch() {
    const time = parseInt($('kr-sel-time')?.value || '90');
    const lives = parseInt($('kr-sel-lives')?.value || '3');
    _initState(_mode, _selectedVerbs, time, lives);
    if (!_state.pool.length) { alert('Δεν βρέθηκαν ρήματα.'); return; }
    ['kr-tv','kr-mtv','kr-atv'].forEach(id => {
      const el = $(id); if (el) { el.textContent = time === 0 ? '∞' : _gramFmtSec(time); el.classList.remove('kr-warn', 'kr-caut'); }
    });
    _hud();
    const kbWrap = $('kr-kb-wrap');
    if (_mode === 'mc') {
      $('kr-mc-area').style.display = '';
      $('kr-fi-area').style.display = 'none';
      if (kbWrap) kbWrap.style.display = 'none';
      _show('kr-screen-game');
      _startTimer(); _mcNextQ();
    } else if (_mode === 'fi') {
      $('kr-mc-area').style.display = 'none';
      $('kr-fi-area').style.display = '';
      if (kbWrap) kbWrap.style.display = '';
      _show('kr-screen-game');
      _buildKB();
      const inp = $('kr-fi-input');
      if (inp) { inp.addEventListener('focus', () => { _kbLastInput = inp; }); inp.onkeydown = e => { if (e.key === 'Enter') _fiSubmit(); }; }
      _startTimer(); _fiNextQ();
    } else if (_mode === 'match') {
      if (kbWrap) kbWrap.style.display = 'none';
      _show('kr-screen-match');
      _startTimer(); _matchNextRound();
    } else if (_mode === 'all') {
      if (kbWrap) kbWrap.style.display = '';
      _show('kr-screen-all');
      _buildKB();
      _startTimer(); _allNextGroup();
    }
  },
  endGame() { _end(); },
  retry() {
    clearInterval(_state.timerInterval);
    if (_state.pendingTO) clearTimeout(_state.pendingTO);
    _show('kr-screen-settings');
  },
  fiSubmit() { _fiSubmit(); },
  kbToggle() { _kbTogglePanel(); },
};

})();

function openKlisiRimaton()  { KR.open();  }
function closeKlisiRimaton() { KR.close(); }
