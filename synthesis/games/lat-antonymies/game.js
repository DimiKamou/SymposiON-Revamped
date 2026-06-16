// Latin Pronouns — declension quiz
// Depends on: lat-antonymies/data.js, shared-engine.js

function openLatAntonymies() {
  document.getElementById('latp-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('latp-screen-levels')) _latpBuild();
}
function closeLatAntonymies() {
  _latpToLevels();
  document.getElementById('latp-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

let _latpMode = 'mc', _latpState = null, _latpLastSelIds = [];

function _latpBuild() {
  document.getElementById('latp-wrap').innerHTML = `
<div id="latp-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Κλίση Λατινικών Αντωνυμιών</h1>
    <p class="lsubtitle">Λατινικά — Προσωπικές · Κτητικές · Δεικτικές · Οριστικές · Αναφορικές · Ερωτηματικές · Αόριστες · 6 Πτώσεις</p>
    <button class="game-share-btn" onclick="showQR('Κλίση Λατινικών Αντωνυμιών',{nav:'game',id:'lat-antonymies'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="latp-level-grid"></div>
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:16px;">
      <div style="display:none;">
        <select id="latp-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option><option value="0">∞ χρόνος</option>
        </select>
        <select id="latp-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">∞ ζωές</option>
        </select>
        <select id="latp-sel-mode" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="" disabled selected>— τρόπος —</option>
          <option value="mc">Πολλ. Επιλογή</option>
          <option value="fi">Συμπλήρωση</option>
          <option value="match">🔗 Αντιστοίχιση</option>
        </select>
      </div>
      <button id="latp-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="latpOpenSettings()">✓ Διάλεξε επίπεδο →</button>
    </div>
  </div>
</div>
<div id="latp-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="latp-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="latp-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="latp-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_latpEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="latp-q"><div class="lq-main">Φόρτωση...</div></div>
    <div class="lfeedback" id="latp-fb"></div>
    <div id="latp-mc-area" class="lopts-grid" style="display:none;"></div>
    <div id="latp-fi-area" style="display:none;">
      <div style="text-align:center;margin-bottom:14px;">
        <input type="text" id="latp-fi-input" autocomplete="off" autocorrect="off" spellcheck="false"
          placeholder="πληκτρολογήστε..."
          style="font-size:1.6rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:8px;color:#e8c87a;width:100%;max-width:320px;outline:none;text-align:center;caret-color:#c9a44a;">
      </div>
      <button class="lfi-submit" id="latp-fi-submit" onclick="latpSubmitFI()">Υποβολή ↵</button>
    </div>
  </div>
</div>
<div id="latp-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="latp-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="latp-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_latpRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_latpToLevels()">Επίπεδα</button>
    </div>
  </div>
</div>
<div id="latp-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="latp-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="latp-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('latp')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="latp-match-body"></div>
    <div class="lfeedback" id="latp-match-fb"></div>
  </div>
</div>`;

  const _latpLvls = LAT_P_PACKS.map((pack, i) => ({ id: i, group: pack.label.split(/ [—(]/)[0].trim(), sub: pack.subs, desc: pack.label, color: pack.color }));
  gramBuildSubPicker('latp', _latpLvls, { selClass: 'latp-sel', railLabel: 'Κατηγορίες', onToggle: _latpUpdateStartBtn });
  document.getElementById('latp-fi-input').onkeydown = e => { if (e.key === 'Enter') latpSubmitFI(); };
  document.getElementById('latp-sel-mode').addEventListener('change', _latpUpdateStartBtn);
}

function _latpUpdateStartBtn() {
  const sel  = document.querySelectorAll('#latp-level-grid .lvl-card.latp-sel');
  const mode = document.getElementById('latp-sel-mode')?.value;
  const btn  = document.getElementById('latp-start-btn');
  if (!btn) return;
  if (sel.length > 0) {
    btn.style.opacity='1'; btn.style.pointerEvents='auto';
    btn.textContent=`Έναρξη (${sel.length} επ.) →`;
  } else {
    btn.style.opacity='.5'; btn.style.pointerEvents='none';
    btn.textContent='✓ Επίπεδο & τρόπος →';
  }
}

function _latpShowScreen(id) {
  document.querySelectorAll('#latp-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}
function _latpToLevels() {
  if (_latpState) {
    clearInterval(_latpState.timerInterval);
    if (_latpState.pendingTimeout) clearTimeout(_latpState.pendingTimeout);
    _latpState.timerInterval = null; _latpState.pendingTimeout = null;
  }
  _latpShowScreen('latp-screen-levels');
}
function _latpRetry() {
  if (_latpState) {
    _latpState.score = 0;
    _latpState.lives = _latpState.lives===Infinity ? Infinity : parseInt(document.getElementById('latp-sel-lives')?.value||3);
    _latpState.timerRemaining = _latpState.timer;
    _latpState.mistakes = []; _latpState.answering = false;
    if (_latpState.pendingTimeout) clearTimeout(_latpState.pendingTimeout);
    clearInterval(_latpState.timerInterval);
    _latpShowScreen('latp-screen-game'); _latpHUD();
    if (_latpState.timer > 0) _latpStartTimer();
    latpNext();
  } else { _latpToLevels(); }
}

function _latpFilter(subs) {
  if (subs.includes('all')) return LAT_P_DB;
  return LAT_P_DB.filter(p => subs.includes(p.sub));
}

function latpOpenSettings(){
  if(!document.querySelectorAll('#latp-level-grid .lvl-card.latp-sel').length) return;
  gramOpenQuizSettings('latp', { title:'Λατινικές Αντωνυμίες', datasetId:'lat-antonymies',
    modes:[
      {id:'mc',    label:'Πολλαπλή Επιλογή', hint:'Επίλεξε από 4 επιλογές'},
      {id:'fi',    label:'Συμπλήρωση Κενού', hint:'Γράψε τον τύπο'},
      {id:'match', label:'Αντιστοίχιση',     hint:'Αντιστοίχισε τύπο με μορφή'},
    ],
    onLaunch: latpLaunch, onClose: closeLatAntonymies });
}
function latpLaunch() {
  const selCards = document.querySelectorAll('#latp-level-grid .lvl-card.latp-sel');
  const modeVal  = document.getElementById('latp-sel-mode')?.value;
  if (!selCards.length || !modeVal) return;
  const allSubs = [];
  selCards.forEach(c => { JSON.parse(c.dataset.subs||'[]').forEach(s => { if (!allSubs.includes(s)) allSubs.push(s); }); });
  _latpLastSelIds = [...selCards].map(c => +c.dataset.lvlId);
  _latpMode = modeVal;

  if (modeVal === 'match') {
    if (_latpState) { clearInterval(_latpState.timerInterval); if (_latpState.pendingTimeout) clearTimeout(_latpState.pendingTimeout); }
    const active = _latpFilter(allSubs);
    if (!active.length) { alert('Δεν βρέθηκαν αντωνυμίες.'); return; }
    const matchG = {};
    active.forEach(p => {
      [true,false].forEach(isSg => {
        for (let ci = 0; ci < 6; ci++) {
          const ans = isSg ? p.s[ci] : p.p[ci];
          if (!ans || ans==='-') continue;
          const key = `${p.l}|${p.t}|${isSg?'sg':'pl'}|${ci}`;
          matchG[key] = {
            endings:[ans], fi_endings:[ans],
            _qt:`<div class="lq-main">${p.l} (${p.t}) — ${LAT_P_CASES[ci]} ${isSg?'Ενικός':'Πληθυντικός'}</div>`
          };
        }
      });
    });
    if (!Object.keys(matchG).length) { alert('Δεν βρέθηκαν δεδομένα.'); return; }
    _gramMatchDoneHook['latp']=(st)=>{_latpLastSelIds.forEach(id=>{try{const pkey=`latp_prog_${id}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');const data={best:Math.max(st.total,prev.best||0),completed:true,ts:Date.now()};localStorage.setItem(pkey,JSON.stringify(data));const card=document.querySelector(`#latp-level-grid .lvl-card[data-lvl-id="${id}"]`);if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className='lvl-badge lvl-badge-done';b.textContent='✓ '+data.best+'πτ';}}catch(e){}});};
    gramStartMatch('latp', matchG, ()=>Object.keys(matchG), ()=>'', g=>g._qt, null, 'latp-wrap');
    return;
  }

  const t = parseInt(document.getElementById('latp-sel-time').value);
  const l = parseInt(document.getElementById('latp-sel-lives').value);
  const active = _latpFilter(allSubs);
  _latpState = { score:0, lives:l===0?Infinity:l, timer:t, timerRemaining:t, timerInterval:null,
    answering:false, pendingTimeout:null, active, curr:null, mistakes:[] };
  if (!_latpState.active.length) { alert('Δεν βρέθηκαν αντωνυμίες.'); return; }
  document.getElementById('latp-mc-area').style.display = _latpMode==='mc' ? 'grid' : 'none';
  document.getElementById('latp-fi-area').style.display  = _latpMode==='fi' ? 'block' : 'none';
  _latpShowScreen('latp-screen-game'); _latpHUD();
  if (t > 0) _latpStartTimer();
  latpNext();
}

function _latpStartTimer() {
  _latpState.timerInterval = setInterval(() => {
    _latpState.timerRemaining--;
    const tv = document.getElementById('latp-tv');
    if (tv) { tv.textContent=_gramFmtSec(_latpState.timerRemaining); tv.classList.toggle('ltimer-warn',_latpState.timerRemaining<=10); tv.classList.toggle('ltimer-caut',_latpState.timerRemaining<=20&&_latpState.timerRemaining>10); }
    if (_latpState.timerRemaining <= 0) _latpEndGame();
  }, 1000);
}
function _latpHUD() {
  const sv = document.getElementById('latp-sv'); if (sv) sv.textContent = _latpState.score;
  const lv = document.getElementById('latp-lv');
  if (lv) { if (_latpState.lives===Infinity){lv.textContent='∞';lv.style.fontSize='1.4rem';}else lv.innerHTML=Array(_latpState.lives).fill('❤️').join('')||'💀'; }
  const tv = document.getElementById('latp-tv');
  if (tv && _latpState.timer===0) { tv.textContent='∞'; tv.classList.remove('ltimer-warn','ltimer-caut'); }
}

const _LATP_GEND_LBL = { 'αρσενικό':'m.', 'θηλυκό':'f.', 'ουδέτερο':'n.', 'αόριστο':'', 'αρσενικό/θηλυκό':'m./f.' };

function latpNext() {
  _latpState.answering = false;
  const fb = document.getElementById('latp-fb'); if (fb) { fb.textContent=''; fb.className='lfeedback'; }
  let p, isSg, cIdx, ans, tries=0;
  do {
    p = _latpState.active[Math.floor(Math.random()*_latpState.active.length)];
    isSg = Math.random()>.5; cIdx = Math.floor(Math.random()*6);
    ans = isSg ? p.s[cIdx] : p.p[cIdx]; tries++;
  } while ((!ans||ans==='-') && tries<80);
  if (!ans||ans==='-') { latpNext(); return; }
  _latpState.curr = { p, isSg, cIdx, ans };
  const gLbl = _LATP_GEND_LBL[p.t] || p.t;
  const qt = `<div class="lq-main" style="font-size:1.1rem;text-align:center;margin-bottom:8px;"><em>${p.l}</em></div><div class="lq-tags"><span class="lq-tag voice">${LAT_P_CASES[cIdx]}</span><span class="lq-tag tense">${isSg?'Ενικός':'Πληθυντικός'}</span>${gLbl?`<span class="lq-tag gender">${gLbl}</span>`:''}</div>`;
  document.getElementById('latp-q').innerHTML = qt;
  if (_latpMode==='mc') {
    const grid = document.getElementById('latp-mc-area'); grid.innerHTML = '';
    _latpGenOpts(p,isSg,cIdx,ans).forEach(opt => {
      const b = document.createElement('button'); b.className='lopt-btn'; b.textContent=opt;
      b.onclick = () => latpAnswer(opt); grid.appendChild(b);
    });
  } else {
    const inp = document.getElementById('latp-fi-input');
    if (inp) { inp.value=''; inp.disabled=false; inp.style.borderColor='#7a6030'; inp.focus(); }
    document.getElementById('latp-fi-submit').disabled = false;
  }
}

function _latpGenOpts(p, isSg, cIdx, correct) {
  const norm = s => s.trim().toLowerCase();
  const used = new Set([norm(correct)]);
  const opts = [correct];
  const push = f => { if (f&&f!=='-'&&!used.has(norm(f))&&opts.length<4){opts.push(f);used.add(norm(f));} };
  // same sub, different entry
  for (const o of _latpShuffle(LAT_P_DB.filter(o=>o!==p&&o.sub===p.sub)))
    { if (opts.length>=4) break; push(isSg?o.s[cIdx]:o.p[cIdx]); }
  // opposite number
  if (opts.length<4) push(isSg?p.p[cIdx]:p.s[cIdx]);
  // other cases of same word
  if (opts.length<4)
    for (const ci of _latpShuffle([0,1,2,3,4,5].filter(i=>i!==cIdx)))
      { if (opts.length>=4) break; push(isSg?p.s[ci]:p.p[ci]); }
  // other active entries
  if (opts.length<4)
    for (const o of _latpShuffle(_latpState.active.filter(o=>o!==p)))
      { if (opts.length>=4) break; push(isSg?o.s[cIdx]:o.p[cIdx]); }
  // any form from pool
  if (opts.length<4) {
    const any = [];
    _latpState.active.forEach(o => [...o.s,...o.p].forEach(f => { if (f&&f!=='-'&&!used.has(norm(f))) any.push(f); }));
    for (const f of _latpShuffle(any)) { if (opts.length>=4) break; push(f); }
  }
  return _latpShuffle(opts);
}
function _latpShuffle(a) { for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }
const _latpNorm = s => s.trim().toLowerCase();
// A correct form may list comma-separated alternates (e.g. "nostri, nostrum").
// In fill-in mode accept the full canonical string OR any single alternate.
function _latpAcceptsFI(typed, ans) {
  const n = _latpNorm(typed);
  if (n === _latpNorm(ans)) return true;
  return ans.split(',').some(part => _latpNorm(part) === n);
}

function latpAnswer(chosen) {
  if (_latpState.answering) return; _latpState.answering = true;
  const ok = _latpNorm(chosen)===_latpNorm(_latpState.curr.ans);
  document.querySelectorAll('#latp-mc-area .lopt-btn').forEach(b => {
    b.disabled=true;
    if (_latpNorm(b.textContent)===_latpNorm(_latpState.curr.ans)) b.classList.add('lcorrect');
    else if (b.textContent===chosen&&!ok) b.classList.add('lwrong');
  });
  const fb = document.getElementById('latp-fb');
  if (ok) {
    _latpState.score++;
    if (fb) { fb.textContent='✓ Σωστό!'; fb.className='lfeedback lok'; }
  } else {
    const m=_latpState.curr;
    _latpState.mistakes.push({lemma:m.p.l,gender:m.p.t,caseLabel:LAT_P_CASES[m.cIdx],num:m.isSg?'Ενικός':'Πληθυντικός',typed:chosen,correct:m.ans});
    if(typeof logStudentMistake==='function') logStudentMistake('lat-antonymies','latinika','mc',{q:`${m.p.l} (${m.p.t}) — ${LAT_P_CASES[m.cIdx]} ${m.isSg?'Ενικός':'Πληθυντικός'}`,a:m.ans},chosen);
    if (fb) { fb.innerHTML=`✗ Λάθος — σωστό: <strong>${_latpState.curr.ans}</strong>`; fb.className='lfeedback lerr'; }
    if (_latpState.lives!==Infinity) { _latpState.lives--; _latpHUD(); if (_latpState.lives<=0){_latpState.pendingTimeout=setTimeout(()=>_latpEndGame(),1200);return;} }
  }
  _latpHUD(); _latpState.pendingTimeout=setTimeout(()=>latpNext(),1500);
}

function latpSubmitFI() {
  if (_latpState.answering) return;
  const inp = document.getElementById('latp-fi-input');
  const typed = inp ? inp.value.trim() : ''; if (!typed){inp?.focus();return;}
  _latpState.answering=true; if(inp)inp.disabled=true; document.getElementById('latp-fi-submit').disabled=true;
  const ok = _latpAcceptsFI(typed, _latpState.curr.ans);
  if (inp) inp.style.borderColor=ok?'#27ae60':'#c0392b';
  const fb = document.getElementById('latp-fb');
  if (ok) {
    _latpState.score++;
    if (fb) { fb.textContent='✓ Σωστό!'; fb.className='lfeedback lok'; }
  } else {
    const m=_latpState.curr;
    _latpState.mistakes.push({lemma:m.p.l,gender:m.p.t,caseLabel:LAT_P_CASES[m.cIdx],num:m.isSg?'Ενικός':'Πληθυντικός',typed,correct:m.ans});
    if(typeof logStudentMistake==='function') logStudentMistake('lat-antonymies','latinika','fi',{q:`${m.p.l} (${m.p.t}) — ${LAT_P_CASES[m.cIdx]} ${m.isSg?'Ενικός':'Πληθυντικός'}`,a:m.ans},typed);
    if (fb) { fb.innerHTML=`✗ Λάθος — σωστό: <strong>${_latpState.curr.ans}</strong>`; fb.className='lfeedback lerr'; }
    if (_latpState.lives!==Infinity) { _latpState.lives--; _latpHUD(); if (_latpState.lives<=0){_latpState.pendingTimeout=setTimeout(()=>_latpEndGame(),1400);return;} }
  }
  _latpHUD(); _latpState.pendingTimeout=setTimeout(()=>latpNext(),1600);
}

function _latpEndGame() {
  clearInterval(_latpState.timerInterval); if (_latpState.pendingTimeout) clearTimeout(_latpState.pendingTimeout);
  document.getElementById('latp-es').textContent = _latpState.score;
  const log = document.getElementById('latp-mistakes-log');
  if (!_latpState.mistakes.length) {
    log.innerHTML=`<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>`;
  } else {
    let h=`<div class="lmistakes-hdr">Λάθη: ${_latpState.mistakes.length}</div><div class="lmistakes-list">`;
    _latpState.mistakes.forEach(m=>{h+=`<div class="lmistake-row"><div class="lm-q">${m.lemma} (${m.gender}) — ${m.caseLabel} ${m.num}</div><div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div></div>`;});
    h+='</div>'; log.innerHTML=h;
  }
  _latpLastSelIds.forEach(id=>{try{
    const pkey=`latp_prog_${id}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');
    const completed=_latpState.mistakes.length===0&&_latpState.score>0;
    const data={best:Math.max(_latpState.score,prev.best||0),completed:prev.completed||completed,ts:Date.now()};
    localStorage.setItem(pkey,JSON.stringify(data));
    const card=document.querySelector(`#latp-level-grid .lvl-card[data-lvl-id="${id}"]`);
    if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className=data.completed?'lvl-badge lvl-badge-done':'lvl-badge';b.textContent=(data.completed?'✓ ':'↗ ')+data.best+'πτ';}
  }catch(e){}});
  _latpShowScreen('latp-screen-end');
}
