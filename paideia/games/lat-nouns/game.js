// Latin Nouns — declension quiz (5 declensions, 6 cases)
// Depends on: lat-nouns/data.js, shared-engine.js

function openLatNouns() {
  document.getElementById('latn-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('latn-screen-levels')) _latnBuild();
}
function closeLatNouns() {
  _latnToLevels();
  document.getElementById('latn-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

const LATN_LEVELS = [
  {id:1,  group:'Α΄ Κλίση', color:'lgreen',  desc:'Θηλυκά: puella, aqua, terra (-a)',  sub:['1f']},
  {id:2,  group:'Α΄ Κλίση', color:'lyellow', desc:'Αρσενικά: nauta, poeta, agricola',   sub:['1m']},
  {id:3,  group:'Α΄ Κλίση', color:'lred',    desc:'Α΄ Κλίση — Όλα',                     sub:['1']},
  {id:4,  group:'Β΄ Κλίση', color:'lgreen',  desc:'Αρσ. -us/-er: dominus, puer, magister', sub:['2m','2m_er']},
  {id:5,  group:'Β΄ Κλίση', color:'lyellow', desc:'Ουδ. -um: donum, bellum, regnum',    sub:['2n']},
  {id:6,  group:'Β΄ Κλίση', color:'lred',    desc:'Β΄ Κλίση — Όλα',                     sub:['2']},
  {id:7,  group:'Γ΄ Κλίση', section:'Συμφωνόληκτα', color:'lgreen',  desc:'Συμφ. (ανισοσύλλ.): rex, miles, homo', sub:['3cons']},
  {id:8,  group:'Γ΄ Κλίση', section:'Φωνηεντόληκτα (i-stem)', color:'lgreen',  desc:'Φωνηεντόλ. (ισοσύλλ.): civis, urbs, mons', sub:['3istem']},
  {id:9,  group:'Γ΄ Κλίση', section:'Ουδέτερα', color:'lyellow', desc:'Ουδ. σύμφ.: nomen, corpus, tempus',  sub:['3n']},
  {id:10, group:'Γ΄ Κλίση', section:'Ουδέτερα', color:'lyellow', desc:'Ουδ. -al/-ar/-e: animal, mare',      sub:['3n_al']},
  {id:11, group:'Γ΄ Κλίση', section:null, color:'lred',    desc:'Γ΄ Κλίση — Όλα',                     sub:['3']},
  {id:12, group:'Δ΄ Κλίση', color:'lgreen',  desc:'Αρσ./Θηλ. -us: exercitus, manus',    sub:['4m','4f']},
  {id:13, group:'Δ΄ Κλίση', color:'lyellow', desc:'Ουδ. -u: cornu, genu',               sub:['4n']},
  {id:14, group:'Δ΄ Κλίση', color:'lred',    desc:'Δ΄ Κλίση — Όλα',                     sub:['4']},
  {id:15, group:'Ε΄ Κλίση', color:'lpurple', desc:'Ε΄ Κλίση: dies, res, spes, fides',  sub:['5']},
  {id:16, group:'Master Challenge', color:'lred', desc:'Όλες οι κλίσεις μαζί',          sub:['all']},
];

function _latnFilter(subs) {
  if (subs.includes('all')) return LAT_N_DB;
  const result = [], seen = new Set();
  LAT_N_DB.forEach(n => {
    for (const s of subs) {
      let match = false;
      if      (s==='1') match = n.d===1;
      else if (s==='2') match = n.d===2;
      else if (s==='3') match = n.d===3;
      else if (s==='4') match = n.d===4;
      else if (s==='5') match = n.d===5;
      else              match = n.sub===s;
      if (match && !seen.has(n.l)) { seen.add(n.l); result.push(n); break; }
    }
  });
  return result;
}

let _latnMode = 'mc', _latnState = null, _latnLastSelIds = [];

function _latnBuild() {
  document.getElementById('latn-wrap').innerHTML = `
<div id="latn-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Κλίση Λατινικών Ουσιαστικών</h1>
    <p class="lsubtitle">Λατινικά — Α΄ έως Ε΄ Κλίση · 6 Πτώσεις</p>
    <button class="game-share-btn" onclick="showQR('Κλίση Λατινικών Ουσιαστικών',{nav:'game',id:'lat-nouns'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="latn-level-grid"></div>
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:16px;">
      <div style="display:none;">
        <select id="latn-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option><option value="0">∞ χρόνος</option>
        </select>
        <select id="latn-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">∞ ζωές</option>
        </select>
        <select id="latn-sel-mode" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="" disabled selected>— τρόπος —</option>
          <option value="mc">Πολλ. Επιλογή</option>
          <option value="fi">Συμπλήρωση</option>
          <option value="match">🔗 Αντιστοίχιση</option>
        </select>
      </div>
      <button id="latn-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="latnOpenSettings()">✓ Διάλεξε επίπεδο →</button>
    </div>
  </div>
</div>
<div id="latn-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="latn-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="latn-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="latn-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_latnEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="latn-q"><div class="lq-main">Φόρτωση...</div></div>
    <div class="lfeedback" id="latn-fb"></div>
    <div id="latn-mc-area" class="lopts-grid" style="display:none;"></div>
    <div id="latn-fi-area" style="display:none;">
      <div style="text-align:center;margin-bottom:14px;">
        <input type="text" id="latn-fi-input" autocomplete="off" autocorrect="off" spellcheck="false"
          placeholder="πληκτρολογήστε..."
          style="font-size:1.6rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:8px;color:#e8c87a;width:100%;max-width:320px;outline:none;text-align:center;caret-color:#c9a44a;">
      </div>
      <button class="lfi-submit" id="latn-fi-submit" onclick="latnSubmitFI()">Υποβολή ↵</button>
    </div>
  </div>
</div>
<div id="latn-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="latn-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="latn-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_latnRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_latnToLevels()">Επίπεδα</button>
    </div>
  </div>
</div>
<div id="latn-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="latn-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="latn-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('latn')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="latn-match-body"></div>
    <div class="lfeedback" id="latn-match-fb"></div>
  </div>
</div>`;

  gramBuildSubPicker('latn', LATN_LEVELS, { selClass: 'latn-sel', railLabel: 'Κλίσεις', onToggle: _latnUpdateStartBtn });
  document.getElementById('latn-fi-input').onkeydown = e => { if (e.key === 'Enter') latnSubmitFI(); };
  document.getElementById('latn-sel-mode').addEventListener('change', _latnUpdateStartBtn);
}

function _latnUpdateStartBtn() {
  const sel  = document.querySelectorAll('#latn-level-grid .lvl-card.latn-sel');
  const mode = document.getElementById('latn-sel-mode')?.value;
  const btn  = document.getElementById('latn-start-btn');
  if (!btn) return;
  if (sel.length > 0) {
    btn.style.opacity='1'; btn.style.pointerEvents='auto';
    btn.textContent=`Έναρξη (${sel.length} επ.) →`;
  } else {
    btn.style.opacity='.5'; btn.style.pointerEvents='none';
    btn.textContent='✓ Επίπεδο & τρόπος →';
  }
}

function _latnShowScreen(id) {
  document.querySelectorAll('#latn-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}
function _latnToLevels() {
  if (_latnState) {
    clearInterval(_latnState.timerInterval);
    if (_latnState.pendingTimeout) clearTimeout(_latnState.pendingTimeout);
    _latnState.timerInterval = null; _latnState.pendingTimeout = null;
  }
  _latnShowScreen('latn-screen-levels');
}
function _latnRetry() {
  if (_latnState) {
    _latnState.score = 0;
    _latnState.lives = _latnState.lives===Infinity ? Infinity : parseInt(document.getElementById('latn-sel-lives')?.value||3);
    _latnState.timerRemaining = _latnState.timer;
    _latnState.mistakes = []; _latnState.answering = false;
    if (_latnState.pendingTimeout) clearTimeout(_latnState.pendingTimeout);
    clearInterval(_latnState.timerInterval);
    _latnShowScreen('latn-screen-game'); _latnHUD();
    if (_latnState.timer > 0) _latnStartTimer();
    latnNext();
  } else { _latnToLevels(); }
}

function latnOpenSettings(){
  if(!document.querySelectorAll('#latn-level-grid .lvl-card.latn-sel').length) return;
  gramOpenQuizSettings('latn', { title:'Λατινικά Ουσιαστικά', datasetId:'lat-nouns',
    modes:[
      {id:'mc',    label:'Πολλαπλή Επιλογή', hint:'Επίλεξε από 4 επιλογές'},
      {id:'fi',    label:'Συμπλήρωση Κενού', hint:'Γράψε τον τύπο'},
      {id:'match', label:'Αντιστοίχιση',     hint:'Αντιστοίχισε τύπο με μορφή'},
    ],
    onLaunch: latnLaunch, onClose: closeLatNouns });
}
function latnLaunch() {
  const selCards = document.querySelectorAll('#latn-level-grid .lvl-card.latn-sel');
  const modeVal  = document.getElementById('latn-sel-mode')?.value;
  if (!selCards.length || !modeVal) return;
  const allSubs = [];
  selCards.forEach(c => { JSON.parse(c.dataset.subs||'[]').forEach(s => { if (!allSubs.includes(s)) allSubs.push(s); }); });
  _latnLastSelIds = [...selCards].map(c => +c.dataset.lvlId).filter(Boolean);
  _latnMode = modeVal;

  if (modeVal === 'match') {
    if (_latnState) { clearInterval(_latnState.timerInterval); if (_latnState.pendingTimeout) clearTimeout(_latnState.pendingTimeout); }
    const active = _latnFilter(allSubs);
    if (!active.length) { alert('Δεν βρέθηκαν ουσιαστικά.'); return; }
    const matchG = {};
    active.forEach(n => {
      [true,false].forEach(isSg => {
        for (let ci = 0; ci < 6; ci++) {
          const ans = isSg ? n.s[ci] : n.p[ci];
          if (!ans || ans==='-') continue;
          const key = `${n.l}|${isSg?'sg':'pl'}|${ci}`;
          matchG[key] = {
            endings:[ans], fi_endings:[ans],
            _qt:`<div class="lq-main">${n.l} — ${LAT_N_CASES[ci]} ${isSg?'Ενικός':'Πληθυντικός'}</div>`
          };
        }
      });
    });
    if (!Object.keys(matchG).length) { alert('Δεν βρέθηκαν δεδομένα.'); return; }
    _gramMatchDoneHook['latn']=(st)=>{_latnLastSelIds.forEach(id=>{try{const pkey=`latn_prog_${id}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');const data={best:Math.max(st.total,prev.best||0),completed:true,ts:Date.now()};localStorage.setItem(pkey,JSON.stringify(data));const card=document.querySelector(`#latn-level-grid .lvl-card[data-lvl-id="${id}"]`);if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className='lvl-badge lvl-badge-done';b.textContent='✓ '+data.best+'πτ';}}catch(e){}});};
    gramStartMatch('latn', matchG, ()=>Object.keys(matchG), ()=>'', g=>g._qt, null, 'latn-wrap');
    return;
  }

  const t = parseInt(document.getElementById('latn-sel-time').value);
  const l = parseInt(document.getElementById('latn-sel-lives').value);
  const active = _latnFilter(allSubs);
  _latnState = { score:0, lives:l===0?Infinity:l, timer:t, timerRemaining:t, timerInterval:null,
    answering:false, pendingTimeout:null, active, curr:null, mistakes:[] };
  if (!_latnState.active.length) { alert('Δεν βρέθηκαν ουσιαστικά.'); return; }
  document.getElementById('latn-mc-area').style.display = _latnMode==='mc' ? 'grid' : 'none';
  document.getElementById('latn-fi-area').style.display  = _latnMode==='fi' ? 'block' : 'none';
  _latnShowScreen('latn-screen-game'); _latnHUD();
  if (t > 0) _latnStartTimer();
  latnNext();
}

function _latnStartTimer() {
  _latnState.timerInterval = setInterval(() => {
    _latnState.timerRemaining--;
    const tv = document.getElementById('latn-tv');
    if (tv) { tv.textContent=_gramFmtSec(_latnState.timerRemaining); tv.classList.toggle('ltimer-warn',_latnState.timerRemaining<=10); tv.classList.toggle('ltimer-caut',_latnState.timerRemaining<=20&&_latnState.timerRemaining>10); }
    if (_latnState.timerRemaining <= 0) _latnEndGame();
  }, 1000);
}
function _latnHUD() {
  const sv = document.getElementById('latn-sv'); if (sv) sv.textContent = _latnState.score;
  const lv = document.getElementById('latn-lv');
  if (lv) { if (_latnState.lives===Infinity){lv.textContent='∞';lv.style.fontSize='1.4rem';}else lv.innerHTML=Array(_latnState.lives).fill('❤️').join('')||'💀'; }
  const tv = document.getElementById('latn-tv');
  if (tv && _latnState.timer===0) { tv.textContent='∞'; tv.classList.remove('ltimer-warn','ltimer-caut'); }
}

const _LATN_GEND = { αρσενικό:'m.', θηλυκό:'f.', ουδέτερο:'n.' };
const _LATN_DECL = n => ['Α΄','Β΄','Γ΄','Δ΄','Ε΄'][n.d-1]+' Κλίση';

function latnNext() {
  _latnState.answering = false;
  const fb = document.getElementById('latn-fb'); if (fb) { fb.textContent=''; fb.className='lfeedback'; }
  let n, isSg, cIdx, ans, tries=0;
  do {
    n = _latnState.active[Math.floor(Math.random()*_latnState.active.length)];
    isSg = Math.random()>.5; cIdx = Math.floor(Math.random()*6);
    ans = isSg ? n.s[cIdx] : n.p[cIdx]; tries++;
  } while ((!ans||ans==='-') && tries<80);
  if (!ans||ans==='-') { latnNext(); return; }
  _latnState.curr = { n, isSg, cIdx, ans };
  const qt = `<div class="lq-main" style="font-size:1.15rem;text-align:center;margin-bottom:8px;"><em>${n.l}</em></div><div class="lq-tags"><span class="lq-tag voice">${LAT_N_CASES[cIdx]}</span><span class="lq-tag tense">${isSg?'Ενικός':'Πληθυντικός'}</span><span class="lq-tag mood">${_LATN_DECL(n)}</span><span class="lq-tag gender">${_LATN_GEND[n.t]||n.t}</span></div>`;
  document.getElementById('latn-q').innerHTML = qt;
  if (_latnMode==='mc') {
    const grid = document.getElementById('latn-mc-area'); grid.innerHTML = '';
    _latnGenOpts(n,isSg,cIdx,ans).forEach(opt => {
      const b = document.createElement('button'); b.className='lopt-btn'; b.textContent=opt;
      b.onclick = () => latnAnswer(opt); grid.appendChild(b);
    });
  } else {
    const inp = document.getElementById('latn-fi-input');
    if (inp) { inp.value=''; inp.disabled=false; inp.style.borderColor='#7a6030'; inp.focus(); }
    document.getElementById('latn-fi-submit').disabled = false;
  }
}

function _latnGenOpts(n, isSg, cIdx, correct) {
  const norm = s => s.trim().toLowerCase();
  const used = new Set([norm(correct)]);
  const opts = [correct];
  const push = f => { if (f&&f!=='-'&&!used.has(norm(f))&&opts.length<4){opts.push(f);used.add(norm(f));} };
  for (const o of _latnShuffle(LAT_N_DB.filter(o=>o!==n&&o.d===n.d)))
    { if (opts.length>=4) break; push(isSg?o.s[cIdx]:o.p[cIdx]); }
  if (opts.length<4) push(isSg?n.p[cIdx]:n.s[cIdx]);
  if (opts.length<4)
    for (const ci of _latnShuffle([0,1,2,3,4,5].filter(i=>i!==cIdx)))
      { if (opts.length>=4) break; push(isSg?n.s[ci]:n.p[ci]); }
  if (opts.length<4)
    for (const o of _latnShuffle(_latnState.active.filter(o=>o!==n)))
      { if (opts.length>=4) break; push(isSg?o.s[cIdx]:o.p[cIdx]); }
  if (opts.length<4) {
    const any = [];
    _latnState.active.forEach(o => [...o.s,...o.p].forEach(f => { if (f&&f!=='-'&&!used.has(norm(f))) any.push(f); }));
    for (const f of _latnShuffle(any)) { if (opts.length>=4) break; push(f); }
  }
  return _latnShuffle(opts);
}
function _latnShuffle(a) { for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
const _latnNorm = s => s.trim().toLowerCase();

function latnAnswer(chosen) {
  if (_latnState.answering) return; _latnState.answering = true;
  const ok = _latnNorm(chosen)===_latnNorm(_latnState.curr.ans);
  document.querySelectorAll('#latn-mc-area .lopt-btn').forEach(b => {
    b.disabled=true;
    if (_latnNorm(b.textContent)===_latnNorm(_latnState.curr.ans)) b.classList.add('lcorrect');
    else if (b.textContent===chosen&&!ok) b.classList.add('lwrong');
  });
  const fb = document.getElementById('latn-fb');
  if (ok) {
    _latnState.score++;
    if (fb) { fb.textContent='✓ Σωστό!'; fb.className='lfeedback lok'; }
  } else {
    const m=_latnState.curr;
    _latnState.mistakes.push({noun:m.n.l,caseLabel:LAT_N_CASES[m.cIdx],num:m.isSg?'Ενικός':'Πληθυντικός',typed:chosen,correct:m.ans});
    if(typeof logStudentMistake==='function') logStudentMistake('lat-nouns','latinika','mc',{q:`${m.n.l} — ${LAT_N_CASES[m.cIdx]} ${m.isSg?'Ενικός':'Πληθυντικός'}`,a:m.ans},chosen);
    if (fb) { fb.innerHTML=`✗ Λάθος — σωστό: <strong>${_latnState.curr.ans}</strong>`; fb.className='lfeedback lerr'; }
    if (_latnState.lives!==Infinity) { _latnState.lives--; _latnHUD(); if (_latnState.lives<=0){_latnState.pendingTimeout=setTimeout(()=>_latnEndGame(),1200);return;} }
  }
  _latnHUD(); _latnState.pendingTimeout=setTimeout(()=>latnNext(),1500);
}

function latnSubmitFI() {
  if (_latnState.answering) return;
  const inp = document.getElementById('latn-fi-input');
  const typed = inp ? inp.value.trim() : ''; if (!typed){inp?.focus();return;}
  _latnState.answering=true; if(inp)inp.disabled=true; document.getElementById('latn-fi-submit').disabled=true;
  const ok = _latnNorm(typed)===_latnNorm(_latnState.curr.ans);
  if (inp) inp.style.borderColor=ok?'#27ae60':'#c0392b';
  const fb = document.getElementById('latn-fb');
  if (ok) {
    _latnState.score++;
    if (fb) { fb.textContent='✓ Σωστό!'; fb.className='lfeedback lok'; }
  } else {
    const m=_latnState.curr;
    _latnState.mistakes.push({noun:m.n.l,caseLabel:LAT_N_CASES[m.cIdx],num:m.isSg?'Ενικός':'Πληθυντικός',typed,correct:m.ans});
    if(typeof logStudentMistake==='function') logStudentMistake('lat-nouns','latinika','fi',{q:`${m.n.l} — ${LAT_N_CASES[m.cIdx]} ${m.isSg?'Ενικός':'Πληθυντικός'}`,a:m.ans},typed);
    if (fb) { fb.innerHTML=`✗ Λάθος — σωστό: <strong>${_latnState.curr.ans}</strong>`; fb.className='lfeedback lerr'; }
    if (_latnState.lives!==Infinity) { _latnState.lives--; _latnHUD(); if (_latnState.lives<=0){_latnState.pendingTimeout=setTimeout(()=>_latnEndGame(),1400);return;} }
  }
  _latnHUD(); _latnState.pendingTimeout=setTimeout(()=>latnNext(),1600);
}

function _latnEndGame() {
  clearInterval(_latnState.timerInterval); if (_latnState.pendingTimeout) clearTimeout(_latnState.pendingTimeout);
  document.getElementById('latn-es').textContent = _latnState.score;
  const log = document.getElementById('latn-mistakes-log');
  if (!_latnState.mistakes.length) {
    log.innerHTML=`<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>`;
  } else {
    let h=`<div class="lmistakes-hdr">Λάθη: ${_latnState.mistakes.length}</div><div class="lmistakes-list">`;
    _latnState.mistakes.forEach(m=>{h+=`<div class="lmistake-row"><div class="lm-q">${m.noun} — ${m.caseLabel} ${m.num}</div><div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div></div>`;});
    h+='</div>'; log.innerHTML=h;
  }
  _latnLastSelIds.forEach(id=>{try{
    const pkey=`latn_prog_${id}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');
    const completed=_latnState.mistakes.length===0&&_latnState.score>0;
    const data={best:Math.max(_latnState.score,prev.best||0),completed:prev.completed||completed,ts:Date.now()};
    localStorage.setItem(pkey,JSON.stringify(data));
    const card=document.querySelector(`#latn-level-grid .lvl-card[data-lvl-id="${id}"]`);
    if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className=data.completed?'lvl-badge lvl-badge-done':'lvl-badge';b.textContent=(data.completed?'✓ ':'↗ ')+data.best+'πτ';}
  }catch(e){}});
  _latnShowScreen('latn-screen-end');
}
window.LATN_LEVELS = LATN_LEVELS;
