// ============================================================
//  ΑΝΩΜΑΛΑ ΡΗΜΑΤΑ ΛΑΤΙΝΙΚΩΝ
//  Modes: MC · FI · Match · All Forms
//  Verb picker: επίλεξε ένα, πολλά ή όλα τα ρήματα
//  Depends on: lat-anwmala/data.js  (LIV_DB)
// ============================================================

const LIV = (() => {

// ── Form helpers (alt-answer support) ─────────────────────────
function _alts(form) { return [form.f, ...(form.alt || [])]; }
// Comparison-only normalization: case/space-insensitive, and fold the classic
// Latin spelling pairs u/v and i/j so e.g. "uolui"/"volui" or "jam"/"iam" match.
function _norm(s) {
  return (s || '').normalize('NFC').trim().toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/v/g, 'u').replace(/j/g, 'i');
}
function _accept(form, typed) { const t = _norm(typed); return _alts(form).some(a => _norm(a) === t); }
function _disp(form) { return _alts(form).join(' / '); }

// ── Data helpers ─────────────────────────────────────────────
function _pool(verbIds) {
  return LIV_DB.filter(e => verbIds.includes('all') || verbIds.includes(e.id));
}
function _rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Build wrong MC options. Prefer forms from the SAME paradigm cell (same group
// label = same tense/mood/voice) across the pool, so distractors are
// morphologically parallel and not trivially eliminable; then fall back to any
// other form, and finally to the whole DB.
function _wrongOpts(correctForm, group, n = 3) {
  const correctSet = new Set(_alts(correctForm).map(_norm));
  const label = group ? group.label : null;
  const gather = src => {
    const same = [], other = [];
    for (const e of src) for (const g of e.groups) for (const f of g.forms) {
      if (correctSet.has(_norm(f.f))) continue;
      (label && g.label === label ? same : other).push(f.f);
    }
    return [same, other];
  };
  const seen = new Set(correctSet);
  const res = [];
  const drain = list => {
    for (const v of _shuffle(list)) {
      const nv = _norm(v);
      if (!seen.has(nv)) { seen.add(nv); res.push(v); if (res.length >= n) return; }
    }
  };
  const [same, other] = gather(_state && _state.pool && _state.pool.length ? _state.pool : LIV_DB);
  drain(same);
  if (res.length < n) drain(other);
  if (res.length < n) { const [s2, o2] = gather(LIV_DB); drain(s2); if (res.length < n) drain(o2); }
  while (res.length < n) res.push('—');
  return res.slice(0, n);
}

// ── DOM helpers ───────────────────────────────────────────────
const $ = id => document.getElementById(id);
function _show(id) {
  document.querySelectorAll('#liv-wrap .liv-screen').forEach(s => s.classList.remove('active'));
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
  ['liv-sv','liv-msv','liv-asv'].forEach(id => { const el = $(id); if (el) el.textContent = _state.score; });
  ['liv-lv','liv-mlv','liv-alv'].forEach(id => {
    const el = $(id); if (!el) return;
    if (_state.livesLeft === Infinity) { el.textContent = '∞'; el.style.fontSize = '1.4rem'; }
    else el.innerHTML = Array(_state.livesLeft).fill('❤️').join('') || '💀';
  });
}
function _startTimer() {
  if (_state.time === 0) return;
  _state.timerInterval = setInterval(() => {
    _state.timerLeft--;
    ['liv-tv','liv-mtv','liv-atv'].forEach(id => {
      const tv = $(id); if (!tv) return;
      tv.textContent = (typeof _gramFmtSec === 'function') ? _gramFmtSec(_state.timerLeft) : _state.timerLeft;
      tv.classList.toggle('liv-warn', _state.timerLeft <= 10);
      tv.classList.toggle('liv-caut', _state.timerLeft <= 20 && _state.timerLeft > 10);
    });
    if (_state.timerLeft <= 0) _end();
  }, 1000);
}

// ── End ───────────────────────────────────────────────────────
function _end() {
  clearInterval(_state.timerInterval);
  if (_state.pendingTO) clearTimeout(_state.pendingTO);
  const es = $('liv-es'); if (es) es.textContent = _state.score;
  const log = $('liv-mistakes-log');
  if (log) {
    if (!_state.mistakes.length) {
      log.innerHTML = '<p style="color:#27ae60;text-align:center;font-style:italic;margin:12px 0;">Τέλειο! Κανένα λάθος! 🎉</p>';
    } else {
      let h = `<div class="liv-mis-hdr">Λάθη: ${_state.mistakes.length}</div><div class="liv-mis-list">`;
      _state.mistakes.forEach(m => {
        h += `<div class="liv-mis-row">
          <div class="liv-mis-q"><em>${m.lemma}</em> — <span style="color:#c9a44a;">${m.groupLabel} · ${m.askLabel}</span></div>
          <div class="liv-mis-ans"><span class="liv-wrong">${m.typed || '—'}</span><span style="color:#8a7a60"> → </span><span class="liv-correct">${m.correct}</span></div>
        </div>`;
      });
      h += '</div>'; log.innerHTML = h;
    }
  }
  _show('liv-screen-end');

  // ── Temple rewards (config-driven per-game params — see realm.js gameRewards) ──
  if (typeof awardGameRewards === 'function') {
    const total = _state.score + _state.mistakes.length;
    awardGameRewards('lat-anwmala', { score: _state.score, perfect: _state.mistakes.length === 0 && total > 0 });
  } else if (typeof awardRewards === 'function') {
    const perfect = _state.mistakes.length === 0 && (_state.score + _state.mistakes.length) > 0;
    awardRewards(Math.round(_state.score * 15 + (perfect ? 10 : 0)), 3 + (perfect ? 3 : 0));
  }
}

// ── Feedback ──────────────────────────────────────────────────
function _fb(elId, ok, correct) {
  const fb = $(elId); if (!fb) return;
  if (ok) { fb.textContent = '✓ Σωστό!'; fb.className = 'liv-fb liv-ok'; }
  else { fb.innerHTML = `✗ Λάθος — σωστό: <strong>${correct}</strong>`; fb.className = 'liv-fb liv-err'; }
}
function _fbClear(elId) { const fb = $(elId); if (fb) { fb.textContent = ''; fb.className = 'liv-fb'; } }

// ── Question header ───────────────────────────────────────────
function _qHeader(entry) {
  return `
    <div class="liv-q-main">
      <span class="liv-q-lemma">${entry.lemma}</span>
      ${entry.meaning ? `<span class="liv-q-meaning">(${entry.meaning})</span>` : ''}
    </div>
    ${entry.pp ? `<div class="liv-q-pp">${entry.pp}</div>` : ''}`;
}

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
  // Avoid asking for a form identical to the one shown (some cells share a form,
  // e.g. the future imperative "ito" for both 2nd & 3rd sing.).
  for (let t = 0; t < 12 && (askedIdx === givenIdx || group.forms[askedIdx].f === group.forms[givenIdx].f); t++)
    askedIdx = Math.floor(Math.random() * group.forms.length);
  if (askedIdx === givenIdx) askedIdx = (givenIdx + 1) % group.forms.length;
  return { entry, group, given: group.forms[givenIdx], asked: group.forms[askedIdx] };
}

// ── MC MODE ───────────────────────────────────────────────────
function _mcNextQ() {
  if (!_state.pool.length) { _end(); return; }
  _state.answering = false; _fbClear('liv-fb');
  const q = _pickQ(); if (!q) { _end(); return; }
  _state.curr = q;
  const { entry, group, given, asked } = q;
  const correct = asked.f;
  const opts = _shuffle([correct, ..._wrongOpts(asked, group, 3)]);
  const qel = $('liv-q');
  if (qel) qel.innerHTML = `
    ${_qHeader(entry)}
    <div class="liv-q-group">${group.label}</div>
    <div class="liv-q-given">
      <span class="liv-q-label">${given.l}:</span>
      <span class="liv-q-form">${given.f}</span>
    </div>
    <div class="liv-q-ask">Ποιος είναι ο τύπος: <strong>${asked.l}</strong>;</div>`;
  const grid = $('liv-opts'); if (!grid) return;
  grid.innerHTML = '';
  opts.forEach(opt => {
    const b = document.createElement('button'); b.className = 'liv-opt'; b.textContent = opt;
    b.onclick = () => _mcAnswer(opt); grid.appendChild(b);
  });
}
function _mcAnswer(chosen) {
  if (_state.answering) return; _state.answering = true;
  const { asked, entry, group } = _state.curr;
  const correct = asked.f;
  const ok = chosen === correct;
  document.querySelectorAll('#liv-opts .liv-opt').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('liv-opt-ok');
    else if (b.textContent === chosen && !ok) b.classList.add('liv-opt-err');
  });
  _fb('liv-fb', ok, _disp(asked));
  if (ok) _state.score++;
  else {
    _state.mistakes.push({ lemma: entry.lemma, groupLabel: group.label, askLabel: asked.l, typed: chosen, correct: _disp(asked) });
    if (typeof logStudentMistake === 'function') logStudentMistake('lat-anwmala', 'latinika', 'mc', { q: `${entry.lemma} · ${group.label} · ${asked.l}`, a: correct }, chosen);
    if (window.GE_CERBERUS_QUEUE) window.GE_CERBERUS_QUEUE.push({ gameId: 'lat-anwmala', subjectId: 'latinika', qt: `${entry.lemma} · ${group.label} · ${asked.l}`, chosen, correct, error_metadata: { category: 'verb_morphology', mutation_type: 'incorrect_form', details: { lemma: entry.lemma, group: group.label, person: asked.l } }, ts: Date.now() });
    if (_state.livesLeft !== Infinity) { _state.livesLeft--; _hud(); if (_state.livesLeft <= 0) { _state.pendingTO = setTimeout(_end, 1200); return; } }
  }
  _hud(); _state.pendingTO = setTimeout(_mcNextQ, 1500);
}

// ── FI MODE ───────────────────────────────────────────────────
function _fiNextQ() {
  if (!_state.pool.length) { _end(); return; }
  _state.answering = false; _fbClear('liv-fb');
  const q = _pickQ(); if (!q) { _end(); return; }
  _state.curr = q;
  const { entry, group, given, asked } = q;
  const qel = $('liv-q');
  if (qel) qel.innerHTML = `
    ${_qHeader(entry)}
    <div class="liv-q-group">${group.label}</div>
    <div class="liv-q-given">
      <span class="liv-q-label">${given.l}:</span>
      <span class="liv-q-form">${given.f}</span>
    </div>
    <div class="liv-q-ask">Γράψε τον τύπο: <strong>${asked.l}</strong></div>`;
  const inp = $('liv-fi-input');
  if (inp) { inp.value = ''; inp.disabled = false; inp.className = 'liv-fi-inp'; inp.focus(); }
  const sub = $('liv-fi-submit'); if (sub) sub.disabled = false;
}
function _fiSubmit() {
  if (_state.answering) return;
  const inp = $('liv-fi-input'); if (!inp) return;
  const typed = inp.value.trim(); if (!typed) { inp.focus(); return; }
  _state.answering = true; inp.disabled = true;
  const sub = $('liv-fi-submit'); if (sub) sub.disabled = true;
  const { asked, entry, group } = _state.curr;
  const ok = _accept(asked, typed);
  inp.classList.add(ok ? 'liv-fi-ok' : 'liv-fi-err');
  _fb('liv-fb', ok, _disp(asked));
  if (ok) _state.score++;
  else {
    _state.mistakes.push({ lemma: entry.lemma, groupLabel: group.label, askLabel: asked.l, typed, correct: _disp(asked) });
    if (typeof logStudentMistake === 'function') logStudentMistake('lat-anwmala', 'latinika', 'fi', { q: `${entry.lemma} · ${group.label} · ${asked.l}`, a: asked.f }, typed);
    if (window.GE_CERBERUS_QUEUE) window.GE_CERBERUS_QUEUE.push({ gameId: 'lat-anwmala', subjectId: 'latinika', qt: `${entry.lemma} · ${group.label} · ${asked.l}`, chosen: typed, correct: asked.f, error_metadata: { category: 'verb_morphology', mutation_type: 'incorrect_form', details: { lemma: entry.lemma, group: group.label, person: asked.l } }, ts: Date.now() });
    if (_state.livesLeft !== Infinity) { _state.livesLeft--; _hud(); if (_state.livesLeft <= 0) { _state.pendingTO = setTimeout(_end, 1400); return; } }
  }
  _hud(); _state.pendingTO = setTimeout(_fiNextQ, 1700);
}

// ── MATCH MODE ────────────────────────────────────────────────
let _matchState = { leftSel: null, rightSel: null, matched: 0, total: 0, pairs: [] };

function _matchNextRound() {
  _fbClear('liv-fb-match');
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
  const leftEl = $('liv-match-left'), rightEl = $('liv-match-right');
  if (!leftEl || !rightEl) return;
  leftEl.innerHTML = ''; rightEl.innerHTML = '';

  const leftItems = _shuffle([...pairs]);
  const rightItems = _shuffle([...pairs]);

  leftItems.forEach(p => {
    const b = document.createElement('div'); b.className = 'liv-match-item liv-match-left-item';
    b.dataset.id = p.id; b.textContent = p.leftLabel;
    b.onclick = () => _matchLeft(b, p); leftEl.appendChild(b);
  });
  rightItems.forEach(p => {
    const b = document.createElement('div'); b.className = 'liv-match-item liv-match-right-item';
    b.dataset.id = p.id; b.textContent = p.rightForm;
    b.onclick = () => _matchRight(b, p); rightEl.appendChild(b);
  });

  const hdr = $('liv-match-rnd');
  if (hdr) hdr.textContent = `Αντιστοίχηση — ${pairs.length} ζεύγη`;
}
function _matchLeft(el, p) {
  if (el.classList.contains('liv-match-done')) return;
  document.querySelectorAll('.liv-match-left-item.liv-match-sel').forEach(b => b.classList.remove('liv-match-sel'));
  el.classList.add('liv-match-sel'); _matchState.leftSel = { el, p };
  if (_matchState.rightSel) _matchCheck();
}
function _matchRight(el, p) {
  if (el.classList.contains('liv-match-done')) return;
  document.querySelectorAll('.liv-match-right-item.liv-match-sel').forEach(b => b.classList.remove('liv-match-sel'));
  el.classList.add('liv-match-sel'); _matchState.rightSel = { el, p };
  if (_matchState.leftSel) _matchCheck();
}
function _matchCheck() {
  const { leftSel, rightSel } = _matchState;
  if (!leftSel || !rightSel) return;
  _matchState.leftSel = null; _matchState.rightSel = null;
  const ok = leftSel.p.id === rightSel.p.id;
  if (ok) {
    leftSel.el.classList.remove('liv-match-sel'); leftSel.el.classList.add('liv-match-done', 'liv-match-ok');
    rightSel.el.classList.remove('liv-match-sel'); rightSel.el.classList.add('liv-match-done', 'liv-match-ok');
    _state.score++; _matchState.matched++; _hud();
    if (_matchState.matched >= _matchState.total)
      _state.pendingTO = setTimeout(_matchNextRound, 700);
  } else {
    leftSel.el.classList.add('liv-match-err'); rightSel.el.classList.add('liv-match-err');
    if (_state.livesLeft !== Infinity) {
      _state.livesLeft--; _hud();
      if (_state.livesLeft <= 0) { _state.pendingTO = setTimeout(_end, 1200); return; }
    }
    setTimeout(() => {
      leftSel.el.classList.remove('liv-match-sel', 'liv-match-err');
      rightSel.el.classList.remove('liv-match-sel', 'liv-match-err');
    }, 700);
  }
}

// ── ALL FORMS MODE ────────────────────────────────────────────
let _allSubmitted = false;

function _allNextGroup() {
  _allSubmitted = false;
  let entry, group;
  for (let a = 0; a < 14; a++) {
    const c = _rand(_state.pool);
    const gs = c.groups.filter(g => g.forms.length >= 2);
    if (!gs.length) continue;
    if (a < 13 && c.id === _state.lastKey) continue;
    entry = c; group = _rand(gs); break;
  }
  if (!entry) { _end(); return; }
  _state.lastKey = entry.id;
  _state.currAll = { entry, group };

  const container = $('liv-all-container'); if (!container) return;
  container.innerHTML = `
    <div class="liv-all-header">
      <span class="liv-q-lemma">${entry.lemma}</span>
      ${entry.meaning ? `<span class="liv-q-meaning"> (${entry.meaning})</span>` : ''}
      ${entry.pp ? `<div class="liv-q-pp">${entry.pp}</div>` : ''}
      <div class="liv-q-group" style="margin-top:6px;">${group.label}</div>
    </div>
    <div class="liv-all-table">
      ${group.forms.map((f, i) => `
        <div class="liv-all-row" data-idx="${i}">
          <div class="liv-all-label">${f.l}</div>
          <input class="liv-all-inp liv-fi-inp" data-idx="${i}"
            autocomplete="off" autocorrect="off" spellcheck="false"
            placeholder="γράψε τον τύπο…">
        </div>`).join('')}
    </div>
    <button class="liv-btn-gold liv-all-submit" id="liv-all-submit-btn">Υποβολή →</button>`;

  container.querySelectorAll('.liv-all-inp').forEach((inp, i) => {
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const next = container.querySelector(`.liv-all-inp[data-idx="${i + 1}"]`);
        if (next) next.focus(); else _allSubmit();
      }
    });
  });
  $('liv-all-submit-btn').onclick = _allSubmit;
  setTimeout(() => container.querySelector('.liv-all-inp')?.focus(), 80);
}
function _allSubmit() {
  if (_allSubmitted) return; _allSubmitted = true;
  const { entry, group } = _state.currAll;
  let correct = 0;
  const container = $('liv-all-container');
  container.querySelectorAll('.liv-all-inp').forEach((inp, i) => {
    inp.disabled = true;
    const typed = inp.value.trim(), form = group.forms[i];
    const ok = _accept(form, typed);
    if (ok) { correct++; inp.classList.add('liv-fi-ok'); }
    else {
      inp.classList.add('liv-fi-err');
      const row = inp.closest('.liv-all-row');
      if (row) {
        const hint = document.createElement('div'); hint.className = 'liv-all-hint';
        hint.innerHTML = `<span style="color:#e67e6a">${typed || '—'}</span> → <span style="color:#5dca8a">${_disp(form)}</span>`;
        row.appendChild(hint);
      }
      _state.mistakes.push({ lemma: entry.lemma, groupLabel: group.label, askLabel: form.l, typed, correct: _disp(form) });
      if (typeof logStudentMistake === 'function') logStudentMistake('lat-anwmala', 'latinika', 'all', { q: `${entry.lemma} · ${group.label} · ${form.l}`, a: form.f }, typed || '—');
    }
  });
  _state.score += correct;
  if (_state.livesLeft !== Infinity && correct < group.forms.length)
    _state.livesLeft = Math.max(0, _state.livesLeft - (group.forms.length - correct));
  _hud();
  const btn = $('liv-all-submit-btn');
  if (btn) {
    btn.textContent = `Επόμενη ομάδα → (${correct}/${group.forms.length} σωστά)`;
    btn.onclick = () => { if (_state.livesLeft <= 0) { _end(); return; } _allNextGroup(); };
  }
  if (_state.livesLeft <= 0) _state.pendingTO = setTimeout(_end, 1800);
}

// ── Build HTML ────────────────────────────────────────────────
function _build() {
  const wrap = $('liv-wrap');

  const verbBtns = LIV_DB.map(e => `
    <button class="liv-verb-btn liv-verb-on" data-id="${e.id}" data-l="${(e.lemma[0] || '').toUpperCase()}" onclick="LIV.toggleVerb('${e.id}',this)">
      <span class="liv-verb-lemma">${e.lemma}</span>
      <span class="liv-verb-meaning">${e.meaning}</span>
    </button>`).join('');

  // Initial-letter filter (mirrors anwmala-rimata's "Αρχικό Γράμμα")
  const lc = {};
  for (const e of LIV_DB) { const l = (e.lemma[0] || '').toUpperCase(); lc[l] = (lc[l] || 0) + 1; }
  const letterGrid = Object.keys(lc).sort().map(l =>
    `<button class="liv-letter-btn" data-l="${l}" onclick="LIV.toggleLetter('${l}',this)">${l}<span class="liv-letter-cnt">${lc[l]}</span></button>`
  ).join('');

  wrap.innerHTML = `
<!-- VERB SELECT SCREEN -->
<div id="liv-screen-verbs" class="liv-screen active">
  <div class="liv-card liv-card-scroll">
    <h1>Ανώμαλα Ρήματα</h1>
    <p class="liv-sub">Λατινικά — πλήρη παραδείγματα κλίσης</p>
    <button class="liv-theory-btn" onclick="if(typeof openLatAnwmalaTheory==='function')openLatAnwmalaTheory()">📖 Θεωρία &amp; Σημειώσεις</button>
    <hr class="liv-hr">
    <h3>Αρχικό Γράμμα <span class="liv-hint-inline">(κλικ για φιλτράρισμα — επίλεξε πολλά)</span></h3>
    <div class="liv-letter-grid">${letterGrid}</div>
    <button class="liv-letter-btn liv-letter-all liv-letter-on" id="liv-all-letters-btn" onclick="LIV.allLetters(this)">Όλα τα Ρήματα</button>
    <hr class="liv-hr">
    <h3>Επίλεξε Ρήμα / Ρήματα <span class="liv-hint-inline">(κλικ για επιλογή / αποεπιλογή)</span></h3>
    <div class="liv-verb-grid">${verbBtns}</div>
    <div class="liv-verb-tools">
      <button class="liv-btn-all" onclick="LIV.selectAll()">Όλα ✓</button>
      <button class="liv-btn-all" onclick="LIV.selectNone()">Κανένα</button>
    </div>
    <div class="liv-filter-info">Επιλεγμένα: <strong id="liv-filter-count">${LIV_DB.length} ρήματα</strong></div>
    <button class="liv-btn-gold" id="liv-continue-btn" onclick="LIV.goSettings()">Συνέχεια →</button>
  </div>
</div>

<!-- SETTINGS -->
<div id="liv-screen-settings" class="liv-screen">
  <div class="liv-card">
    <button class="liv-back-link" onclick="LIV.back()">← Επιστροφή</button>
    <h2 id="liv-sett-title">Ρυθμίσεις</h2>
    <hr class="liv-hr">
    <h3>Τρόπος Παιχνιδιού</h3>
    <div class="liv-mode-grid">
      <div class="liv-mode liv-mode-sel" data-mode="mc" onclick="LIV.setMode('mc',this)">
        <span class="liv-mi">🔲</span><span>Πολλαπλή Επιλογή</span>
        <span class="liv-mh">Δίνεται τύπος → βρες άλλον</span>
      </div>
      <div class="liv-mode" data-mode="fi" onclick="LIV.setMode('fi',this)">
        <span class="liv-mi">✏️</span><span>Συμπλήρωση Κενού</span>
        <span class="liv-mh">Γράψε τον ζητούμενο τύπο</span>
      </div>
      <div class="liv-mode" data-mode="match" onclick="LIV.setMode('match',this)">
        <span class="liv-mi">🔗</span><span>Αντιστοίχηση</span>
        <span class="liv-mh">Ταίριαξε γραμματικό τύπο με λέξη</span>
      </div>
      <div class="liv-mode" data-mode="all" onclick="LIV.setMode('all',this)">
        <span class="liv-mi">📋</span><span>Όλοι οι Τύποι</span>
        <span class="liv-mh">Συμπλήρωσε ολόκληρη ομάδα τύπων</span>
      </div>
    </div>
    <div class="liv-sett-row">
      <div class="liv-field"><label>Χρόνος</label>
        <select id="liv-sel-time">
          <option value="60">60 δευτ.</option>
          <option value="90" selected>90 δευτ.</option>
          <option value="120">120 δευτ.</option>
          <option value="180">180 δευτ.</option>
          <option value="0">Απεριόριστο</option>
        </select>
      </div>
      <div class="liv-field"><label>Ζωές</label>
        <select id="liv-sel-lives">
          <option value="1">1 ζωή</option>
          <option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option>
          <option value="0">Απεριόριστο</option>
        </select>
      </div>
    </div>
    <button class="liv-btn-gold" onclick="LIV.launch()">Έναρξη →</button>
  </div>
</div>

<!-- GAME SCREEN (MC + FI) -->
<div id="liv-screen-game" class="liv-screen">
  <div class="liv-card">
    <div class="liv-hdr">
      <div class="liv-stat"><div class="liv-stat-l">Βαθμός</div><div class="liv-stat-v" id="liv-sv">0</div></div>
      <div class="liv-stat"><div class="liv-stat-l">Χρόνος</div><div class="liv-stat-v" id="liv-tv">—</div></div>
      <div class="liv-stat"><div class="liv-stat-l">Ζωές</div><div class="liv-stat-v" id="liv-lv"></div></div>
      <button class="liv-btn-ghost liv-end-btn" onclick="LIV.endGame()">Τέλος</button>
    </div>
    <div class="liv-qbox" id="liv-q"></div>
    <div id="liv-mc-area"><div class="liv-opts" id="liv-opts"></div></div>
    <div id="liv-fi-area" style="display:none;">
      <input type="text" id="liv-fi-input" class="liv-fi-inp"
        autocomplete="off" autocorrect="off" spellcheck="false"
        placeholder="γράψε τον τύπο…">
      <button class="liv-fi-submit" id="liv-fi-submit" onclick="LIV.fiSubmit()">Υποβολή ↵</button>
    </div>
    <div class="liv-fb" id="liv-fb"></div>
  </div>
</div>

<!-- MATCH SCREEN -->
<div id="liv-screen-match" class="liv-screen">
  <div class="liv-card liv-card-wide">
    <div class="liv-hdr">
      <div class="liv-stat"><div class="liv-stat-l">Βαθμός</div><div class="liv-stat-v" id="liv-msv">0</div></div>
      <div class="liv-stat"><div class="liv-stat-l">Χρόνος</div><div class="liv-stat-v" id="liv-mtv">—</div></div>
      <div class="liv-stat"><div class="liv-stat-l">Ζωές</div><div class="liv-stat-v" id="liv-mlv"></div></div>
      <button class="liv-btn-ghost liv-end-btn" onclick="LIV.endGame()">Τέλος</button>
    </div>
    <div class="liv-match-hdr" id="liv-match-rnd">Αντιστοίχηση</div>
    <div class="liv-fb" id="liv-fb-match"></div>
    <div class="liv-match-grid">
      <div class="liv-match-col" id="liv-match-left"></div>
      <div class="liv-match-col" id="liv-match-right"></div>
    </div>
  </div>
</div>

<!-- ALL FORMS SCREEN -->
<div id="liv-screen-all" class="liv-screen">
  <div class="liv-card">
    <div class="liv-hdr">
      <div class="liv-stat"><div class="liv-stat-l">Βαθμός</div><div class="liv-stat-v" id="liv-asv">0</div></div>
      <div class="liv-stat"><div class="liv-stat-l">Χρόνος</div><div class="liv-stat-v" id="liv-atv">—</div></div>
      <div class="liv-stat"><div class="liv-stat-l">Ζωές</div><div class="liv-stat-v" id="liv-alv"></div></div>
      <button class="liv-btn-ghost liv-end-btn" onclick="LIV.endGame()">Τέλος</button>
    </div>
    <div id="liv-all-container"></div>
  </div>
</div>

<!-- END SCREEN -->
<div id="liv-screen-end" class="liv-screen">
  <div class="liv-card" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="liv-big-score" id="liv-es">0</div>
    <div style="color:#8a7a60;margin-bottom:16px;text-align:center;">Τελική βαθμολογία</div>
    <hr class="liv-hr">
    <div id="liv-mistakes-log"></div>
    <hr class="liv-hr">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button class="liv-btn-gold" onclick="LIV.retry()">Δοκιμάστε Ξανά</button>
      <button class="liv-btn-ghost" onclick="LIV.back()">Αρχική</button>
    </div>
  </div>
</div>`;
}

// ── Public API ────────────────────────────────────────────────
let _selectedVerbs = LIV_DB.map(e => e.id);
let _mode = 'mc';
let _letterFilter = new Set();

function _applyLetterFilter() {
  const all = !_letterFilter.size;
  document.querySelectorAll('.liv-verb-btn').forEach(b => {
    b.style.display = (all || _letterFilter.has(b.dataset.l)) ? '' : 'none';
  });
  const allBtn = $('liv-all-letters-btn');
  if (allBtn) allBtn.classList.toggle('liv-letter-on', all);
}

function _updateFilterInfo() {
  const cnt = _selectedVerbs.length;
  const el = $('liv-filter-count'); if (el) el.textContent = cnt + ' ρήματα';
  const btn = $('liv-continue-btn'); if (btn) btn.disabled = cnt === 0;
}

return {
  open() {
    document.getElementById('latanw-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!$('liv-screen-verbs')) { _build(); _updateFilterInfo(); }
    _show('liv-screen-verbs');
  },
  close() {
    clearInterval(_state.timerInterval);
    if (_state.pendingTO) clearTimeout(_state.pendingTO);
    _state.timerInterval = null; _state.pendingTO = null;
    document.getElementById('latanw-overlay').classList.remove('active');
    document.body.style.overflow = '';
    _show('liv-screen-verbs');
  },
  toggleLetter(l, el) {
    if (_letterFilter.has(l)) { _letterFilter.delete(l); el.classList.remove('liv-letter-on'); }
    else { _letterFilter.add(l); el.classList.add('liv-letter-on'); }
    _applyLetterFilter();
  },
  allLetters(el) {
    _letterFilter.clear();
    document.querySelectorAll('.liv-letter-btn:not(.liv-letter-all)').forEach(b => b.classList.remove('liv-letter-on'));
    if (el) el.classList.add('liv-letter-on');
    _applyLetterFilter();
  },
  toggleVerb(id, el) {
    if (_selectedVerbs.includes(id)) {
      _selectedVerbs = _selectedVerbs.filter(v => v !== id);
      el.classList.remove('liv-verb-on');
    } else {
      _selectedVerbs.push(id);
      el.classList.add('liv-verb-on');
    }
    _updateFilterInfo();
  },
  selectAll() {
    _selectedVerbs = LIV_DB.map(e => e.id);
    document.querySelectorAll('.liv-verb-btn').forEach(b => b.classList.add('liv-verb-on'));
    _updateFilterInfo();
  },
  selectNone() {
    _selectedVerbs = [];
    document.querySelectorAll('.liv-verb-btn').forEach(b => b.classList.remove('liv-verb-on'));
    _updateFilterInfo();
  },
  goSettings() {
    if (!_selectedVerbs.length) return;
    const names = _selectedVerbs.map(id => LIV_DB.find(e => e.id === id)?.lemma || id);
    const t = $('liv-sett-title');
    if (t) t.textContent = names.length > 6 ? `${names.length} ρήματα επιλεγμένα` : names.join(' · ');
    _show('liv-screen-settings');
  },
  back() {
    clearInterval(_state.timerInterval);
    if (_state.pendingTO) clearTimeout(_state.pendingTO);
    _state.timerInterval = null; _state.pendingTO = null;
    _show('liv-screen-verbs');
  },
  setMode(m, el) {
    _mode = m;
    document.querySelectorAll('.liv-mode').forEach(b => b.classList.remove('liv-mode-sel'));
    el.classList.add('liv-mode-sel');
  },
  launch() {
    const time = parseInt($('liv-sel-time')?.value || '90');
    const lives = parseInt($('liv-sel-lives')?.value || '3');
    _initState(_mode, _selectedVerbs.length ? _selectedVerbs : ['all'], time, lives);
    if (!_state.pool.length) { alert('Δεν βρέθηκαν ρήματα.'); return; }
    ['liv-tv','liv-mtv','liv-atv'].forEach(id => {
      const el = $(id); if (el) { el.textContent = time === 0 ? '∞' : ((typeof _gramFmtSec === 'function') ? _gramFmtSec(time) : time); el.classList.remove('liv-warn', 'liv-caut'); }
    });
    _hud();
    if (_mode === 'mc') {
      $('liv-mc-area').style.display = '';
      $('liv-fi-area').style.display = 'none';
      _show('liv-screen-game');
      _startTimer(); _mcNextQ();
    } else if (_mode === 'fi') {
      $('liv-mc-area').style.display = 'none';
      $('liv-fi-area').style.display = '';
      _show('liv-screen-game');
      const inp = $('liv-fi-input');
      if (inp) { inp.onkeydown = e => { if (e.key === 'Enter') _fiSubmit(); }; }
      _startTimer(); _fiNextQ();
    } else if (_mode === 'match') {
      _show('liv-screen-match');
      _startTimer(); _matchNextRound();
    } else if (_mode === 'all') {
      _show('liv-screen-all');
      _startTimer(); _allNextGroup();
    }
  },
  endGame() { _end(); },
  retry() {
    clearInterval(_state.timerInterval);
    if (_state.pendingTO) clearTimeout(_state.pendingTO);
    _show('liv-screen-settings');
  },
  fiSubmit() { _fiSubmit(); },
};

})();

function openLatAnwmala()  { LIV.open();  }
function closeLatAnwmala() { LIV.close(); }
