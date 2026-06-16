// Ουσιαστικά ανά Κείμενο — Latin noun declension grouped by text (κείμενα 3–45)
// Practice style mirrors the Greek/Latin noun games (MC / Συμπλήρωση / Αντιστοίχιση).
// Depends on: lat-nouns-kata/data.js, shared-engine.js

function openLatNounsKata() {
  document.getElementById('latnk-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('latnk-screen-levels')) _latnkBuild();
}
function closeLatNounsKata() {
  _latnkToLevels();
  document.getElementById('latnk-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

let _latnkMode = 'mc', _latnkState = null, _latnkLastTexts = [];

// ── helpers for variant cells ────────────────────────────────────────────────
function _latnkForms(cell) {            // → array of attested forms (no '-')
  if (cell === '-' || cell == null) return [];
  return Array.isArray(cell) ? cell.filter(f => f && f !== '-') : [cell];
}
function _latnkPrimary(cell) {          // → first/display form, or '' if none
  const f = _latnkForms(cell);
  return f.length ? f[0] : '';
}
function _latnkNorm(s) {
  return (s || '').trim().toLowerCase()
    .replace(/ā/g,'a').replace(/ē/g,'e').replace(/ī/g,'i').replace(/ō/g,'o').replace(/ū/g,'u')
    .replace(/ĕ/g,'e').replace(/ŏ/g,'o');
}
function _latnkShuffle(a){ for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }

function _latnkFilterNouns(texts) {
  const seen = new Set(), result = [];
  texts.forEach(t => {
    (LATNK_BY_TEXT[t] || []).forEach(n => { if (!seen.has(n.l)) { seen.add(n.l); result.push(n); } });
  });
  return result;
}

// ── build overlay ─────────────────────────────────────────────────────────────
function _latnkBuild() {
  document.getElementById('latnk-wrap').innerHTML = `
<div id="latnk-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Ουσιαστικά ανά Κείμενο</h1>
    <p class="lsubtitle">Λατινικά — Επίλεξε κείμενα · κλίνε τα ουσιαστικά τους (6 πτώσεις)</p>
    <button class="game-share-btn" onclick="showQR('Ουσιαστικά ανά Κείμενο',{nav:'game',id:'lat-nouns-kata'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div style="margin-bottom:10px;font-size:.82rem;color:#8a7a60;">Επίλεξε ένα ή περισσότερα κείμενα:</div>
    <div id="latnk-text-grid" style="margin-bottom:16px;"></div>
    <hr class="ldivider">
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:8px;">
      <div style="display:none;">
        <select id="latnk-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option><option value="0">∞ χρόνος</option>
        </select>
        <select id="latnk-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">∞ ζωές</option>
        </select>
        <select id="latnk-sel-mode" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="" disabled selected>— τρόπος —</option>
          <option value="mc">Πολλ. Επιλογή</option>
          <option value="fi">Συμπλήρωση</option>
          <option value="match">🔗 Αντιστοίχιση</option>
        </select>
      </div>
      <div id="latnk-sel-info" style="font-size:.78rem;color:#8a7a60;margin-bottom:8px;text-align:center;"></div>
      <button id="latnk-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="latnkOpenSettings()">✓ Διάλεξε κείμενα →</button>
    </div>
  </div>
</div>
<div id="latnk-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="latnk-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="latnk-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="latnk-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_latnkEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="latnk-q"><div class="lq-main">Φόρτωση...</div></div>
    <div class="lfeedback" id="latnk-fb"></div>
    <div id="latnk-mc-area" class="lopts-grid" style="display:none;"></div>
    <div id="latnk-fi-area" style="display:none;">
      <div style="text-align:center;margin-bottom:14px;">
        <input type="text" id="latnk-fi-input" autocomplete="off" autocorrect="off" spellcheck="false"
          placeholder="πληκτρολογήστε..."
          style="font-size:1.6rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:8px;color:#e8c87a;width:100%;max-width:320px;outline:none;text-align:center;caret-color:#c9a44a;">
      </div>
      <button class="lfi-submit" id="latnk-fi-submit" onclick="latnkSubmitFI()">Υποβολή ↵</button>
    </div>
  </div>
</div>
<div id="latnk-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="latnk-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="latnk-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_latnkRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_latnkToLevels()">Κείμενα</button>
    </div>
  </div>
</div>
<div id="latnk-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="latnk-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="latnk-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('latnk')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="latnk-match-body"></div>
    <div class="lfeedback" id="latnk-match-fb"></div>
  </div>
</div>`;

  _latnkBuildTextGrid();
  document.getElementById('latnk-fi-input').onkeydown = e => { if (e.key === 'Enter') latnkSubmitFI(); };
  document.getElementById('latnk-sel-mode').addEventListener('change', _latnkUpdateStart);
}

function _latnkTextGroup(t){ const lo = Math.floor((t - 1) / 10) * 10 + 1; return 'Κείμενα ' + lo + '–' + (lo + 9); }
function _latnkBuildTextGrid() {
  const lvls = LATNK_TEXTS.map(t => ({ id: t, group: _latnkTextGroup(t), desc: 'Κείμενο ' + t + ' · ' + ((LATNK_BY_TEXT[t] || []).length) + ' ουσιαστικά' }));
  gramBuildSubPicker('latnk', lvls, { containerId:'latnk-text-grid', selClass:'latnk-sel', railLabel:'Κείμενα', dataAttrs:l=>({text:l.id}), onToggle:_latnkUpdateStart });
}

function _latnkUpdateStart() {
  const sel  = [...document.querySelectorAll('#latnk-text-grid .latnk-sel')];
  const mode = document.getElementById('latnk-sel-mode')?.value;
  const btn  = document.getElementById('latnk-start-btn');
  const info = document.getElementById('latnk-sel-info');
  if (!btn) return;
  if (sel.length) {
    const texts = sel.map(b => parseInt(b.dataset.text));
    const n = _latnkFilterNouns(texts).length;
    if (info) info.textContent = `${n} ουσιαστικά στα επιλεγμένα κείμενα`;
  } else if (info) info.textContent = '';
  if (sel.length) {
    btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
    btn.textContent = `Επόμενο (${sel.length} κειμ.) →`;
  } else {
    btn.style.opacity = '.5'; btn.style.pointerEvents = 'none';
    btn.textContent = '✓ Διάλεξε κείμενα →';
  }
}
function latnkOpenSettings(){
  if(!document.querySelectorAll('#latnk-text-grid .latnk-sel').length) return;
  gramOpenQuizSettings('latnk', { title:'Ουσιαστικά ανά Κείμενο', datasetId:'lat-nouns-kata',
    modes:[
      {id:'mc',    label:'Πολλαπλή Επιλογή', hint:'Επίλεξε από 4 επιλογές'},
      {id:'fi',    label:'Συμπλήρωση Κενού', hint:'Γράψε τον τύπο'},
      {id:'match', label:'Αντιστοίχιση',     hint:'Αντιστοίχισε τύπο με μορφή'},
    ],
    onLaunch: latnkLaunch, onClose: closeLatNounsKata });
}

function _latnkShowScreen(id) {
  document.querySelectorAll('#latnk-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}
function _latnkToLevels() {
  if (_latnkState) {
    clearInterval(_latnkState.timerInterval);
    if (_latnkState.pendingTimeout) clearTimeout(_latnkState.pendingTimeout);
    _latnkState.timerInterval = null; _latnkState.pendingTimeout = null;
  }
  _latnkShowScreen('latnk-screen-levels');
}
function _latnkRetry() {
  if (_latnkState) {
    _latnkState.score = 0;
    _latnkState.lives = _latnkState.lives === Infinity ? Infinity : parseInt(document.getElementById('latnk-sel-lives')?.value || 3);
    _latnkState.timerRemaining = _latnkState.timer;
    _latnkState.mistakes = []; _latnkState.answering = false;
    if (_latnkState.pendingTimeout) clearTimeout(_latnkState.pendingTimeout);
    clearInterval(_latnkState.timerInterval);
    _latnkShowScreen('latnk-screen-game'); _latnkHUD();
    if (_latnkState.timer > 0) _latnkStartTimer();
    latnkNext();
  } else { _latnkToLevels(); }
}

// ── launch ──────────────────────────────────────────────────────────────────
function latnkLaunch() {
  const sel = [...document.querySelectorAll('#latnk-text-grid .latnk-sel')];
  const modeVal = document.getElementById('latnk-sel-mode')?.value;
  if (!sel.length || !modeVal) return;
  const texts = sel.map(b => parseInt(b.dataset.text));
  _latnkLastTexts = texts;
  _latnkMode = modeVal;
  const active = _latnkFilterNouns(texts);
  if (!active.length) { alert('Δεν βρέθηκαν ουσιαστικά.'); return; }

  if (modeVal === 'match') {
    if (_latnkState) { clearInterval(_latnkState.timerInterval); if (_latnkState.pendingTimeout) clearTimeout(_latnkState.pendingTimeout); }
    const matchG = {};
    active.forEach(n => {
      [true, false].forEach(isSg => {
        for (let ci = 0; ci < 6; ci++) {
          const cell = isSg ? n.s[ci] : n.p[ci];
          const forms = _latnkForms(cell);
          if (!forms.length) continue;
          matchG[`${n.l}|${isSg?'sg':'pl'}|${ci}`] = {
            endings: [forms[0]], fi_endings: forms,
            _qt: `<div class="lq-main">${n.l} — ${LATNK_CASES[ci]} ${isSg?'Ενικός':'Πληθυντικός'}</div>`
          };
        }
      });
    });
    if (!Object.keys(matchG).length) { alert('Δεν βρέθηκαν δεδομένα.'); return; }
    _gramMatchDoneHook['latnk'] = (st) => { _latnkLastTexts.forEach(t => _latnkSaveProg(t, st.total, true)); };
    gramStartMatch('latnk', matchG, () => Object.keys(matchG), () => '', g => g._qt, null, 'latnk-wrap');
    return;
  }

  const t = parseInt(document.getElementById('latnk-sel-time').value);
  const l = parseInt(document.getElementById('latnk-sel-lives').value);
  _latnkState = { score:0, lives:l===0?Infinity:l, timer:t, timerRemaining:t, timerInterval:null,
    answering:false, pendingTimeout:null, active, curr:null, mistakes:[] };
  document.getElementById('latnk-mc-area').style.display = _latnkMode==='mc' ? 'grid' : 'none';
  document.getElementById('latnk-fi-area').style.display = _latnkMode==='fi' ? 'block' : 'none';
  _latnkShowScreen('latnk-screen-game'); _latnkHUD();
  if (t > 0) _latnkStartTimer();
  latnkNext();
}

function _latnkStartTimer() {
  _latnkState.timerInterval = setInterval(() => {
    _latnkState.timerRemaining--;
    const tv = document.getElementById('latnk-tv');
    if (tv) { tv.textContent=_gramFmtSec(_latnkState.timerRemaining); tv.classList.toggle('ltimer-warn',_latnkState.timerRemaining<=10); tv.classList.toggle('ltimer-caut',_latnkState.timerRemaining<=20&&_latnkState.timerRemaining>10); }
    if (_latnkState.timerRemaining <= 0) _latnkEndGame();
  }, 1000);
}
function _latnkHUD() {
  const sv = document.getElementById('latnk-sv'); if (sv) sv.textContent = _latnkState.score;
  const lv = document.getElementById('latnk-lv');
  if (lv) { if (_latnkState.lives===Infinity){lv.textContent='∞';lv.style.fontSize='1.4rem';}else lv.innerHTML=Array(_latnkState.lives).fill('❤️').join('')||'💀'; }
  const tv = document.getElementById('latnk-tv');
  if (tv && _latnkState.timer===0) { tv.textContent='∞'; tv.classList.remove('ltimer-warn','ltimer-caut'); }
}

const _LATNK_DECL = n => LATNK_DECL_LBL[n.d] || '';

function latnkNext() {
  _latnkState.answering = false;
  const fb = document.getElementById('latnk-fb'); if (fb) { fb.textContent=''; fb.className='lfeedback'; }
  let n, isSg, cIdx, forms, tries=0;
  do {
    n = _latnkState.active[Math.floor(Math.random()*_latnkState.active.length)];
    isSg = Math.random()>.5; cIdx = Math.floor(Math.random()*6);
    forms = _latnkForms(isSg ? n.s[cIdx] : n.p[cIdx]); tries++;
  } while (!forms.length && tries<120);
  if (!forms.length) { return; }
  _latnkState.curr = { n, isSg, cIdx, forms, primary:forms[0] };
  const qt = `<div class="lq-main" style="font-size:1.15rem;text-align:center;margin-bottom:8px;"><em>${n.l}</em></div><div class="lq-sub" style="text-align:center;color:#8a7a60;font-size:.8rem;margin-bottom:8px;">${n.m||''}</div><div class="lq-tags"><span class="lq-tag voice">${LATNK_CASES[cIdx]}</span><span class="lq-tag tense">${isSg?'Ενικός':'Πληθυντικός'}</span><span class="lq-tag mood">${_LATNK_DECL(n)}</span><span class="lq-tag gender">${LATNK_GEND[n.t]||n.t}</span></div>`;
  document.getElementById('latnk-q').innerHTML = qt;
  if (_latnkMode==='mc') {
    const grid = document.getElementById('latnk-mc-area'); grid.innerHTML = '';
    _latnkGenOpts(n,isSg,cIdx,forms[0]).forEach(opt => {
      const b = document.createElement('button'); b.className='lopt-btn'; b.textContent=opt;
      b.onclick = () => latnkAnswer(opt); grid.appendChild(b);
    });
  } else {
    const inp = document.getElementById('latnk-fi-input');
    if (inp) { inp.value=''; inp.disabled=false; inp.style.borderColor='#7a6030'; inp.focus(); }
    document.getElementById('latnk-fi-submit').disabled = false;
  }
}

function _latnkGenOpts(n, isSg, cIdx, correct) {
  const used = new Set([_latnkNorm(correct)]);
  const opts = [correct];
  const push = f => { f=_latnkPrimary(f); if (f && !used.has(_latnkNorm(f)) && opts.length<4){opts.push(f);used.add(_latnkNorm(f));} };
  for (const o of _latnkShuffle(LATNK_DB.filter(o=>o!==n&&o.d===n.d)))
    { if (opts.length>=4) break; push(isSg?o.s[cIdx]:o.p[cIdx]); }
  if (opts.length<4) push(isSg?n.p[cIdx]:n.s[cIdx]);
  if (opts.length<4)
    for (const ci of _latnkShuffle([0,1,2,3,4,5].filter(i=>i!==cIdx)))
      { if (opts.length>=4) break; push(isSg?n.s[ci]:n.p[ci]); }
  if (opts.length<4)
    for (const o of _latnkShuffle(_latnkState.active.filter(o=>o!==n)))
      { if (opts.length>=4) break; push(isSg?o.s[cIdx]:o.p[cIdx]); }
  if (opts.length<4) {
    const any = [];
    _latnkState.active.forEach(o => [...o.s,...o.p].forEach(c => _latnkForms(c).forEach(f=>{ if(!used.has(_latnkNorm(f))) any.push(f); })));
    for (const f of _latnkShuffle(any)) { if (opts.length>=4) break; push(f); }
  }
  return _latnkShuffle(opts);
}

function _latnkMistake(typed) {
  const m = _latnkState.curr;
  const correct = m.forms.join(' / ');
  _latnkState.mistakes.push({ noun:m.n.l, caseLabel:LATNK_CASES[m.cIdx], num:m.isSg?'Ενικός':'Πληθυντικός', typed, correct });
  if (typeof logStudentMistake==='function')
    logStudentMistake('lat-nouns-kata','latinika',_latnkMode,{q:`${m.n.l} — ${LATNK_CASES[m.cIdx]} ${m.isSg?'Ενικός':'Πληθυντικός'}`,a:correct},typed);
}

function latnkAnswer(chosen) {
  if (_latnkState.answering) return; _latnkState.answering = true;
  const m = _latnkState.curr;
  const ok = m.forms.some(f => _latnkNorm(f) === _latnkNorm(chosen));
  document.querySelectorAll('#latnk-mc-area .lopt-btn').forEach(b => {
    b.disabled = true;
    if (_latnkNorm(b.textContent) === _latnkNorm(m.primary)) b.classList.add('lcorrect');
    else if (b.textContent === chosen && !ok) b.classList.add('lwrong');
  });
  const fb = document.getElementById('latnk-fb');
  if (ok) {
    _latnkState.score++;
    if (fb) { fb.textContent='✓ Σωστό!'; fb.className='lfeedback lok'; }
  } else {
    _latnkMistake(chosen);
    if (fb) { fb.innerHTML=`✗ Λάθος — σωστό: <strong>${m.forms.join(' / ')}</strong>`; fb.className='lfeedback lerr'; }
    if (_latnkState.lives!==Infinity) { _latnkState.lives--; _latnkHUD(); if (_latnkState.lives<=0){_latnkState.pendingTimeout=setTimeout(()=>_latnkEndGame(),1200);return;} }
  }
  _latnkHUD(); _latnkState.pendingTimeout=setTimeout(()=>latnkNext(),1500);
}

function latnkSubmitFI() {
  if (_latnkState.answering) return;
  const inp = document.getElementById('latnk-fi-input');
  const typed = inp ? inp.value.trim() : ''; if (!typed){inp?.focus();return;}
  _latnkState.answering=true; if(inp)inp.disabled=true; document.getElementById('latnk-fi-submit').disabled=true;
  const m = _latnkState.curr;
  const ok = m.forms.some(f => _latnkNorm(f) === _latnkNorm(typed));
  if (inp) inp.style.borderColor = ok ? '#27ae60' : '#c0392b';
  const fb = document.getElementById('latnk-fb');
  if (ok) {
    _latnkState.score++;
    if (fb) { fb.textContent='✓ Σωστό!'; fb.className='lfeedback lok'; }
  } else {
    _latnkMistake(typed);
    if (fb) { fb.innerHTML=`✗ Λάθος — σωστό: <strong>${m.forms.join(' / ')}</strong>`; fb.className='lfeedback lerr'; }
    if (_latnkState.lives!==Infinity) { _latnkState.lives--; _latnkHUD(); if (_latnkState.lives<=0){_latnkState.pendingTimeout=setTimeout(()=>_latnkEndGame(),1400);return;} }
  }
  _latnkHUD(); _latnkState.pendingTimeout=setTimeout(()=>latnkNext(),1600);
}

function _latnkSaveProg(t, score, completed) {
  try {
    const pkey = `latnk_prog_${t}`;
    const prev = JSON.parse(localStorage.getItem(pkey) || '{}');
    const data = { best:Math.max(score, prev.best||0), completed:prev.completed||completed, ts:Date.now() };
    localStorage.setItem(pkey, JSON.stringify(data));
    const btn = document.querySelector(`#latnk-text-grid [data-text="${t}"]`);
    if (btn && data.completed) {
      btn.dataset.defBorder = '#27ae60'; btn.dataset.defColor = '#5dca8a';
      if (!btn.classList.contains('latnk-sel')) { btn.style.borderColor='#27ae60'; btn.style.color='#5dca8a'; }
    }
  } catch(e) {}
}

function _latnkEndGame() {
  clearInterval(_latnkState.timerInterval); if (_latnkState.pendingTimeout) clearTimeout(_latnkState.pendingTimeout);
  document.getElementById('latnk-es').textContent = _latnkState.score;
  const log = document.getElementById('latnk-mistakes-log');
  if (!_latnkState.mistakes.length) {
    log.innerHTML=`<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>`;
  } else {
    let h=`<div class="lmistakes-hdr">Λάθη: ${_latnkState.mistakes.length}</div><div class="lmistakes-list">`;
    _latnkState.mistakes.forEach(m=>{h+=`<div class="lmistake-row"><div class="lm-q">${m.noun} — ${m.caseLabel} ${m.num}</div><div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div></div>`;});
    h+='</div>'; log.innerHTML=h;
  }
  const completed = _latnkState.mistakes.length===0 && _latnkState.score>0;
  _latnkLastTexts.forEach(t => _latnkSaveProg(t, _latnkState.score, completed));
  _latnkShowScreen('latnk-screen-end');
}
