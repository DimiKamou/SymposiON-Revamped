// Latin verb principal parts — "Ρήματα ανά Κείμενο" exercise
// Depends on: lat-kata/data.js, shared-engine.js

function openLatKata() {
  document.getElementById('latk-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('latk-screen-levels')) _latkBuild();
}
function closeLatKata() {
  _latkToLevels();
  document.getElementById('latk-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

let _latkState = null;

// ── normalise Latin forms for comparison ─────────────────────────────────────
function _latkNorm(s) {
  return (s || '').trim().toLowerCase()
    .replace(/ā/g,'a').replace(/ē/g,'e').replace(/ī/g,'i').replace(/ō/g,'o').replace(/ū/g,'u')
    .replace(/ĕ/g,'e').replace(/ŏ/g,'o');
}
function _latkMatch(input, expected) {
  const ni = _latkNorm(input), ne = _latkNorm(expected);
  if (ni === ne) return true;
  // accept contracted (v) or expanded forms: abi(v)i → abii or abivi
  const contracted = ne.replace(/\([^)]+\)/g, '');
  const expanded   = ne.replace(/\(([^)]+)\)/g, '$1');
  return ni === contracted || ni === expanded;
}

// ── build overlay HTML ────────────────────────────────────────────────────────
function _latkBuild() {
  document.getElementById('latk-wrap').innerHTML = `
<div id="latk-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Ρήματα ανά Κείμενο</h1>
    <p class="lsubtitle">Επίλεξε κείμενα — συμπλήρωσε Ενεστώτα · Παρακείμενο · Σούπινο · Απαρέμφατο</p>
    <button class="game-share-btn" onclick="showQR('Ρήματα ανά Κείμενο',{nav:'game',id:'lat-kata'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div style="margin-bottom:10px;font-size:.82rem;color:#8a7a60;">Επίλεξε ένα ή περισσότερα κείμενα:</div>
    <div id="latk-text-grid" style="margin-bottom:16px;"></div>
    <hr class="ldivider">
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:8px;">
      <div style="display:none;">
        <select id="latk-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option><option value="0">∞ χρόνος</option>
        </select>
        <select id="latk-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">∞ ζωές</option>
        </select>
      </div>
      <div id="latk-sel-info" style="font-size:.78rem;color:#8a7a60;margin-bottom:8px;text-align:center;"></div>
      <button id="latk-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="latkOpenSettings()">✓ Διάλεξε κείμενα →</button>
    </div>
  </div>
</div>

<div id="latk-screen-game" class="lyo-screen">
  <div class="lcard" style="max-width:600px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="latk-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="latk-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="latk-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_latkEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>

    <div id="latk-meaning" style="text-align:center;font-size:1rem;color:#c9a44a;font-style:italic;margin:10px 0 4px;"></div>

    <div id="latk-forms-grid" style="display:flex;flex-direction:column;gap:10px;margin:10px 0;"></div>

    <div class="lfeedback" id="latk-fb"></div>

    <button class="lfi-submit" id="latk-submit" onclick="latkSubmit()" style="margin-top:8px;">Υποβολή ↵</button>
  </div>
</div>

<div id="latk-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="latk-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="latk-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_latkRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_latkToLevels()">Επίπεδα</button>
    </div>
  </div>
</div>`;

  _latkBuildTextGrid();
  document.addEventListener('keydown', _latkKeyHandler);
}

function _latkKeyHandler(e) {
  if (e.key === 'Enter') {
    const g = document.getElementById('latk-screen-game');
    if (g && g.classList.contains('active')) latkSubmit();
  }
}

function _latkTextGroup(t){ const lo = Math.floor((t - 1) / 10) * 10 + 1; return 'Κείμενα ' + lo + '–' + (lo + 9); }
function _latkBuildTextGrid() {
  const lvls = [];
  for (let t = 16; t <= 50; t++) lvls.push({ id: t, group: _latkTextGroup(t), desc: 'Κείμενο ' + t + ' · ' + ((LAT_KATA_BY_TEXT[t] || []).length) + ' ρήματα' });
  gramBuildSubPicker('latk', lvls, { containerId:'latk-text-grid', selClass:'latk-sel', railLabel:'Κείμενα', dataAttrs:l=>({text:l.id}), onToggle:_latkUpdateStart });
}

function _latkUpdateStart() {
  const sel = [...document.querySelectorAll('#latk-text-grid .latk-sel')];
  const btn = document.getElementById('latk-start-btn');
  const info = document.getElementById('latk-sel-info');
  if (!btn) return;
  if (sel.length > 0) {
    const texts = sel.map(b => parseInt(b.dataset.text));
    const verbs = _latkFilterVerbs(texts);
    const unique = new Set(verbs.map(v => v.n)).size;
    if (info) info.textContent = `${unique} ρήματα στα επιλεγμένα κείμενα`;
    btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
    btn.textContent = `Έναρξη (${sel.length} κειμ.) →`;
  } else {
    if (info) info.textContent = '';
    btn.style.opacity = '.5'; btn.style.pointerEvents = 'none';
    btn.textContent = '✓ Επιλέξτε κείμενο →';
  }
}

function _latkFilterVerbs(texts) {
  const seen = new Set(), result = [];
  texts.forEach(t => {
    (LAT_KATA_BY_TEXT[t] || []).forEach(v => {
      if (!seen.has(v.n)) { seen.add(v.n); result.push(v); }
    });
  });
  return result;
}

function _latkShowScreen(id) {
  document.querySelectorAll('#latk-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}
function _latkToLevels() {
  if (_latkState) {
    clearInterval(_latkState.timerInterval);
    if (_latkState.pendingTimeout) clearTimeout(_latkState.pendingTimeout);
    _latkState = null;
  }
  _latkShowScreen('latk-screen-levels');
}
function _latkRetry() {
  if (_latkState?._lastTexts) {
    _latkStart(_latkState._lastTexts,
               _latkState._lastTimer,
               _latkState._lastLives);
  } else { _latkToLevels(); }
}

// ── launch ────────────────────────────────────────────────────────────────────
function latkOpenSettings(){
  if(!document.querySelectorAll('#latk-text-grid .latk-sel').length) return;
  gramOpenQuizSettings('latk', { title:'Ρήματα ανά Κείμενο', datasetId:'lat-kata',
    modes:[{id:'fi', label:'Κουίζ Ρημάτων', hint:'Κλίνε τα ρήματα των επιλεγμένων κειμένων'}],
    onLaunch: latkLaunch, onClose: closeLatKata });
}
function latkLaunch() {
  const sel = [...document.querySelectorAll('#latk-text-grid .latk-sel')];
  if (!sel.length) return;
  const texts = sel.map(b => parseInt(b.dataset.text));
  const t = parseInt(document.getElementById('latk-sel-time').value);
  const l = parseInt(document.getElementById('latk-sel-lives').value);
  _latkStart(texts, t, l);
}

function _latkStart(texts, timer, livesVal) {
  const verbs = _latkFilterVerbs(texts);
  if (!verbs.length) { alert('Δεν βρέθηκαν ρήματα.'); return; }
  _latkState = {
    verbs, score:0,
    lives: livesVal === 0 ? Infinity : livesVal,
    timer, timerRemaining: timer, timerInterval: null,
    answering: false, pendingTimeout: null, mistakes: [],
    curr: null,
    _lastTexts: texts, _lastTimer: timer, _lastLives: livesVal,
  };
  _latkShowScreen('latk-screen-game');
  _latkHUD();
  if (timer > 0) _latkStartTimer();
  _latkNext();
}

function _latkStartTimer() {
  _latkState.timerInterval = setInterval(() => {
    _latkState.timerRemaining--;
    const tv = document.getElementById('latk-tv');
    if (tv) {
      tv.textContent = _gramFmtSec(_latkState.timerRemaining);
      tv.classList.toggle('ltimer-warn', _latkState.timerRemaining <= 10);
      tv.classList.toggle('ltimer-caut', _latkState.timerRemaining <= 20 && _latkState.timerRemaining > 10);
    }
    if (_latkState.timerRemaining <= 0) _latkEndGame();
  }, 1000);
}

function _latkHUD() {
  const sv = document.getElementById('latk-sv'); if (sv) sv.textContent = _latkState.score;
  const lv = document.getElementById('latk-lv');
  if (lv) {
    if (_latkState.lives === Infinity) { lv.textContent = '∞'; lv.style.fontSize = '1.4rem'; }
    else lv.innerHTML = Array(_latkState.lives).fill('❤️').join('') || '💀';
  }
  const tv = document.getElementById('latk-tv');
  if (tv && _latkState.timer === 0) { tv.textContent = '∞'; tv.classList.remove('ltimer-warn','ltimer-caut'); }
}

// ── question ──────────────────────────────────────────────────────────────────
function _latkNext() {
  if (!_latkState) return;
  _latkState.answering = false;
  const fb = document.getElementById('latk-fb');
  if (fb) { fb.textContent = ''; fb.className = 'lfeedback'; }

  const v = _latkState.verbs[Math.floor(Math.random() * _latkState.verbs.length)];

  // pick a form to show (not '-')
  const available = LAT_KATA_FIELDS.filter(f => v[f.key] !== '-');
  if (!available.length) { _latkNext(); return; }
  const given = available[Math.floor(Math.random() * available.length)];
  const others = LAT_KATA_FIELDS.filter(f => f.key !== given.key);

  _latkState.curr = { v, given, others };

  const meaning = document.getElementById('latk-meaning');
  if (meaning) meaning.textContent = v.meaning;

  const grid = document.getElementById('latk-forms-grid');
  if (!grid) return;
  grid.innerHTML = '';

  LAT_KATA_FIELDS.forEach(f => {
    const row = document.createElement('div');
    row.style.cssText = 'display:grid;grid-template-columns:130px 1fr;align-items:center;gap:10px;';
    const lbl = document.createElement('div');
    lbl.style.cssText = 'font-size:.78rem;color:#8a7a60;font-weight:600;text-align:right;text-transform:uppercase;letter-spacing:.04em;';
    lbl.textContent = f.label;
    row.appendChild(lbl);

    if (f.key === given.key) {
      const val = document.createElement('div');
      val.style.cssText = 'font-size:1.3rem;color:#c9a44a;font-weight:600;padding:8px 12px;background:#2a1e0a;border:2px solid #7a6030;border-radius:8px;text-align:center;';
      val.textContent = v[f.key];
      row.appendChild(val);
    } else {
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.dataset.field = f.key;
      inp.autocomplete = 'off';
      inp.autocorrect = 'off';
      inp.spellcheck = false;
      inp.placeholder = v[f.key] === '-' ? 'πληκτρ. – (παύλα)' : 'πληκτρολογήστε...';
      inp.style.cssText = 'font-size:1.1rem;padding:8px 12px;background:#241e16;border:2px solid #3d3020;border-radius:8px;color:#e8c87a;width:100%;outline:none;text-align:center;caret-color:#c9a44a;box-sizing:border-box;';
      inp.onfocus = () => { inp.style.borderColor = '#7a6030'; };
      row.appendChild(inp);
    }
    grid.appendChild(row);
  });

  // focus first input
  const first = grid.querySelector('input');
  if (first) first.focus();

  const sub = document.getElementById('latk-submit');
  if (sub) sub.disabled = false;
}

// ── submit ────────────────────────────────────────────────────────────────────
function latkSubmit() {
  if (!_latkState || _latkState.answering) return;
  const { v, given, others } = _latkState.curr;

  // collect inputs
  const inputs = {};
  document.querySelectorAll('#latk-forms-grid input').forEach(inp => {
    inputs[inp.dataset.field] = inp.value.trim();
  });

  // check each "other" field
  let allOk = true;
  const fieldResults = {};
  others.forEach(f => {
    const typed = inputs[f.key] || '';
    const expected = v[f.key]; // may be '-'
    let ok;
    if (expected === '-') {
      ok = typed === '-' || typed === '–';
    } else {
      ok = _latkMatch(typed, expected);
    }
    fieldResults[f.key] = { typed, expected, ok };
    if (!ok) allOk = false;
  });

  _latkState.answering = true;

  // colour inputs
  document.querySelectorAll('#latk-forms-grid input').forEach(inp => {
    const res = fieldResults[inp.dataset.field];
    if (!res) return;
    inp.disabled = true;
    inp.style.borderColor = res.ok ? '#27ae60' : '#c0392b';
  });

  const fb = document.getElementById('latk-fb');
  if (allOk) {
    _latkState.score++;
    if (fb) { fb.textContent = '✓ Σωστό!'; fb.className = 'lfeedback lok'; }
  } else {
    // build mistake entry
    const wrongFields = others.filter(f => !fieldResults[f.key].ok);
    const correctLine = others.map(f => `${f.label}: ${v[f.key]}`).join(' · ');
    _latkState.mistakes.push({ pres: v.pres, meaning: v.meaning, given: given.label, givenVal: v[given.key], correct: correctLine, fields: fieldResults, others });
    if(typeof logStudentMistake==='function') logStudentMistake('lat-kata','latinika','fw',{q:`${v.pres} — ${given.label}: ${v[given.key]}`,a:correctLine},wrongFields.map(f=>`${f.label}: ${fieldResults[f.key].typed||'—'}`).join(' / '));
    const hint = wrongFields.map(f => `<strong>${f.label}:</strong> ${v[f.key]}`).join(' &nbsp;|&nbsp; ');
    if (fb) { fb.innerHTML = `✗ Λάθος &nbsp;→&nbsp; ${hint}`; fb.className = 'lfeedback lerr'; }
    if (_latkState.lives !== Infinity) {
      _latkState.lives--;
      _latkHUD();
      if (_latkState.lives <= 0) {
        _latkState.pendingTimeout = setTimeout(() => _latkEndGame(), 1400);
        return;
      }
    }
  }
  _latkHUD();
  _latkState.pendingTimeout = setTimeout(() => _latkNext(), 1800);
}

// ── end ───────────────────────────────────────────────────────────────────────
function _latkEndGame() {
  if (!_latkState) return;
  clearInterval(_latkState.timerInterval);
  if (_latkState.pendingTimeout) clearTimeout(_latkState.pendingTimeout);

  document.getElementById('latk-es').textContent = _latkState.score;
  const log = document.getElementById('latk-mistakes-log');
  if (!_latkState.mistakes.length) {
    log.innerHTML = `<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>`;
  } else {
    let h = `<div class="lmistakes-hdr">Λάθη: ${_latkState.mistakes.length}</div><div class="lmistakes-list">`;
    _latkState.mistakes.forEach(m => {
      h += `<div class="lmistake-row">`;
      h += `<div class="lm-q" style="font-size:.85rem;"><strong>${m.pres}</strong> — ${m.meaning}<br><span style="color:#8a7a60;font-size:.75rem;">Δόθηκε: ${m.given} = ${m.givenVal}</span></div>`;
      h += `<div class="lm-ans" style="flex-direction:column;gap:4px;align-items:flex-start;">`;
      m.others.forEach(f => {
        const res = m.fields[f.key];
        h += `<div style="display:flex;gap:8px;align-items:center;font-size:.8rem;">
          <span style="color:#8a7a60;min-width:110px;">${f.label}:</span>
          <span class="${res.ok ? '' : 'lm-wrong'}">${res.typed || '—'}</span>
          ${!res.ok ? `<span style="color:#8a7a60;">→</span><span class="lm-correct">${res.expected}</span>` : ''}
        </div>`;
      });
      h += `</div></div>`;
    });
    h += '</div>';
    log.innerHTML = h;
  }
  // Save progress per selected text
  (_latkState._lastTexts||[]).forEach(t=>{try{
    const pkey=`latk_prog_${t}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');
    const completed=_latkState.mistakes.length===0&&_latkState.score>0;
    localStorage.setItem(pkey,JSON.stringify({best:Math.max(_latkState.score,prev.best||0),completed:prev.completed||completed,ts:Date.now()}));
    // Update text button border if completed
    const btn=document.querySelector(`#latk-text-grid [data-text="${t}"]`);
    if(btn&&completed){btn.style.borderColor='#27ae60';btn.style.color='#5dca8a';}
  }catch(e){}});
  _latkShowScreen('latk-screen-end');
}
