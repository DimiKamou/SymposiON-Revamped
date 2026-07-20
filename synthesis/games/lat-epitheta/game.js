// Latin Adjectives — declension quiz + degrees of comparison
// Depends on: lat-epitheta/data.js, shared-engine.js

function openLatEpitheta() {
  document.getElementById('late-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('late-screen-levels')) _lateBuild();
}
function closeLatEpitheta() {
  _lateToLevels();
  document.getElementById('late-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

const LATE_LEVELS = [
  {id:1,  group:"Β΄ Κλίση Επιθέτων", color:'lgreen',  desc:'Τρικατάληκτα -us/-a/-um: bonus, magnus, malus', sub:['2nd_us']},
  {id:2,  group:"Β΄ Κλίση Επιθέτων", color:'lyellow', desc:'Σε -er: pulcher, liber (συγκοπτ. & μη)', sub:['2nd_er']},
  {id:3,  group:"Β΄ Κλίση Επιθέτων", color:'lred',    desc:'Β΄ Κλίση — Όλα', sub:['2nd_us','2nd_er']},
  {id:4,  group:"Γ΄ Κλίση Επιθέτων", color:'lgreen',  desc:'Δικατάληκτα -is/-e: omnis, brevis, celer', sub:['3rd_2']},
  {id:5,  group:"Γ΄ Κλίση Επιθέτων", color:'lyellow', desc:'Μονοκατάληκτα: felix, acer', sub:['3rd_1']},
  {id:6,  group:"Γ΄ Κλίση Επιθέτων", color:'lred',    desc:'Γ΄ Κλίση — Όλα', sub:['3rd_2','3rd_1']},
  {id:7,  group:"Παραθετικά",         color:'lpurple', desc:'Συγκριτικός (-ior/-ius): altior', sub:['comp']},
  {id:8,  group:"Παραθετικά",         color:'lpurple', desc:'Υπερθετικός (-issimus): altissimus', sub:['superl']},
  {id:9,  group:"Παραθετικά",         color:'lred',    desc:'Παραθετικά — Αναγνώριση βαθμών', sub:['degrees']},
  {id:10, group:"Master Challenge",   color:'lred',    desc:'Όλα μαζί',   sub:['all']},
];

function _lateFilter(subs) {
  if (subs.includes('all')) return LAT_A_DB.filter(a=>a.degree==='positive'||a.sub==='comp'||a.sub==='superl');
  if (subs.includes('degrees')) return null; // special mode
  const result=[], seen=new Set();
  LAT_A_DB.forEach(a=>{
    for(const s of subs){
      if(a.sub===s){
        const key=a.l+'|'+a.t;
        if(!seen.has(key)){seen.add(key);result.push(a);break;}
      }
    }
  });
  return result;
}

let _lateMode='mc', _lateState=null, _lateLastSelIds=[];
const LATE_MIX_POOL=['mc','fi'];
const LATE_MIX_LABELS={mc:'Πολλαπλή Επιλογή',fi:'Συμπλήρωση Κενού'};
let _lateCurMode='mc';

function _lateBuild(){
  document.getElementById('late-wrap').innerHTML=`
<div id="late-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Κλίση Λατινικών Επιθέτων</h1>
    <p class="lsubtitle">Λατινικά — Β΄ & Γ΄ Κλίση · Παραθετικά</p>
    <button class="game-share-btn" onclick="showQR('Κλίση Λατινικών Επιθέτων',{nav:'game',id:'lat-epitheta'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="late-level-grid"></div>
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:16px;">
      <div style="display:none;">
        <select id="late-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option><option value="0">∞ χρόνος</option>
        </select>
        <select id="late-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">∞ ζωές</option>
        </select>
        <select id="late-sel-mode" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="" disabled selected>— τρόπος —</option>
          <option value="mc">Πολλ. Επιλογή</option>
          <option value="fi">Συμπλήρωση</option>
          <option value="match">🔗 Αντιστοίχιση</option>
          <option value="mix">🎲 MIX</option>
        </select>
      </div>
      <button id="late-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="lateOpenSettings()">✓ Διάλεξε επίπεδο →</button>
    </div>
  </div>
</div>
<div id="late-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="late-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="late-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="late-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_lateEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="late-q"><div class="lq-main">Φόρτωση...</div></div>
    <div class="lfeedback" id="late-fb"></div>
    <div id="late-mc-area" class="lopts-grid" style="display:none;"></div>
    <div id="late-fi-area" style="display:none;">
      <div style="text-align:center;margin-bottom:14px;">
        <input type="text" id="late-fi-input" autocomplete="off" autocorrect="off" spellcheck="false"
          placeholder="πληκτρολογήστε..."
          style="font-size:1.5rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:8px;color:#e8c87a;width:100%;max-width:340px;outline:none;text-align:center;caret-color:#c9a44a;">
      </div>
      <button class="lfi-submit" id="late-fi-submit" onclick="lateSubmitFI()">Υποβολή ↵</button>
    </div>
  </div>
</div>
<div id="late-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="late-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="late-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_lateRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_lateToLevels()">Επίπεδα</button>
    </div>
  </div>
</div>
<div id="late-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="late-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="late-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('late')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="late-match-body"></div>
    <div class="lfeedback" id="late-match-fb"></div>
  </div>
</div>`;

  gramBuildSubPicker('late', LATE_LEVELS, { selClass: 'late-sel', onToggle: _lateUpdateStartBtn });
  document.getElementById('late-fi-input').onkeydown=e=>{if(e.key==='Enter')lateSubmitFI();};
  document.getElementById('late-sel-mode').addEventListener('change',_lateUpdateStartBtn);
}

function _lateUpdateStartBtn(){
  const sel=document.querySelectorAll('#late-level-grid .lvl-card.late-sel');
  const mode=document.getElementById('late-sel-mode')?.value;
  const btn=document.getElementById('late-start-btn');
  if(!btn)return;
  if(sel.length>0){btn.style.opacity='1';btn.style.pointerEvents='auto';btn.textContent=`Επόμενο (${sel.length} επ.) →`;}
  else{btn.style.opacity='.5';btn.style.pointerEvents='none';btn.textContent='✓ Επίπεδο & τρόπος →';}
}

function _lateShowScreen(id){document.querySelectorAll('#late-wrap .lyo-screen').forEach(s=>s.classList.remove('active'));document.getElementById(id)?.classList.add('active');}
function _lateToLevels(){
  if(_lateState){clearInterval(_lateState.timerInterval);if(_lateState.pendingTimeout)clearTimeout(_lateState.pendingTimeout);_lateState.timerInterval=null;_lateState.pendingTimeout=null;}
  _lateShowScreen('late-screen-levels');
}
function _lateRetry(){
  if(_lateState){
    _lateState.score=0;_lateState.lives=_lateState.lives===Infinity?Infinity:parseInt(document.getElementById('late-sel-lives')?.value||3);
    _lateState.timerRemaining=_lateState.timer;_lateState.mistakes=[];_lateState.answering=false;
    if(_lateState.pendingTimeout)clearTimeout(_lateState.pendingTimeout);clearInterval(_lateState.timerInterval);
    _lateShowScreen('late-screen-game');_lateHUD();if(_lateState.timer>0)_lateStartTimer();lateNext();
  }else{_lateToLevels();}
}

function lateOpenSettings(){
  if(!document.querySelectorAll('#late-level-grid .lvl-card.late-sel').length) return;
  gramOpenQuizSettings('late', { title:'Λατινικά Επίθετα', datasetId:'lat-epitheta',
    modes:[
      {id:'mc',    label:'Πολλαπλή Επιλογή', hint:'Επίλεξε από 4 επιλογές'},
      {id:'fi',    label:'Συμπλήρωση Κενού', hint:'Γράψε τον τύπο'},
      {id:'match', label:'Αντιστοίχιση',     hint:'Αντιστοίχισε τύπο με μορφή'},
      {id:'mix', label:'MIX — Ανάμεικτο', hint:'Τυχαίο στυλ σε κάθε ερώτηση'},
    ],
    onLaunch: lateLaunch, onClose: closeLatEpitheta });
}
function lateLaunch(){
  const selCards=document.querySelectorAll('#late-level-grid .lvl-card.late-sel');
  const modeVal=document.getElementById('late-sel-mode')?.value;
  if(!selCards.length||!modeVal)return;
  const allSubs=[];selCards.forEach(c=>{JSON.parse(c.dataset.subs||'[]').forEach(s=>{if(!allSubs.includes(s))allSubs.push(s);});});
  _lateLastSelIds=[...selCards].map(c=>+c.dataset.lvlId).filter(Boolean);
  _lateMode=modeVal;

  if(modeVal==='match'){
    if(_lateState){clearInterval(_lateState.timerInterval);if(_lateState.pendingTimeout)clearTimeout(_lateState.pendingTimeout);}
    const active=_lateFilter(allSubs);
    if(!active||!active.length){alert('Δεν βρέθηκαν επίθετα.');return;}
    const matchG={};
    active.forEach(a=>{
      [true,false].forEach(isSg=>{
        for(let ci=0;ci<6;ci++){
          const ans=isSg?a.s[ci]:a.p[ci];
          if(!ans||ans==='-')continue;
          const key=`${a.l}|${a.t}|${isSg?'sg':'pl'}|${ci}`;
          matchG[key]={endings:[ans],fi_endings:[ans],_qt:`<div class="lq-main">${a.l} — ${LAT_A_CASES[ci]} ${isSg?'Ενικός':'Πληθυντικός'} (${a.t==='αρσενικό'?'m.':a.t==='θηλυκό'?'f.':'n.'})</div>`};
        }
      });
    });
    if(!Object.keys(matchG).length){alert('Δεν βρέθηκαν δεδομένα.');return;}
    _gramMatchDoneHook['late']=(st)=>{_lateLastSelIds.forEach(id=>{try{const pkey=`late_prog_${id}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');const data={best:Math.max(st.total,prev.best||0),completed:true,ts:Date.now()};localStorage.setItem(pkey,JSON.stringify(data));const card=document.querySelector(`#late-level-grid .lvl-card[data-lvl-id="${id}"]`);if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className='lvl-badge lvl-badge-done';b.textContent='✓ '+data.best+'πτ';}}catch(e){}});};
    gramStartMatch('late',matchG,()=>Object.keys(matchG),()=>'',g=>g._qt,null,'late-wrap');
    return;
  }

  const t=parseInt(document.getElementById('late-sel-time').value);
  const l=parseInt(document.getElementById('late-sel-lives').value);
  const isDegrees=allSubs.includes('degrees');
  const active=isDegrees?null:_lateFilter(allSubs);
  _lateState={score:0,lives:l===0?Infinity:l,timer:t,timerRemaining:t,timerInterval:null,answering:false,pendingTimeout:null,active,isDegrees,curr:null,mistakes:[]};
  if(!isDegrees&&(!_lateState.active||!_lateState.active.length)){alert('Δεν βρέθηκαν επίθετα.');return;}
  document.getElementById('late-mc-area').style.display=_lateMode==='mc'?'grid':'none';
  document.getElementById('late-fi-area').style.display=_lateMode==='fi'?'block':'none';
  _lateShowScreen('late-screen-game');_lateHUD();if(t>0)_lateStartTimer();lateNext();
}

function _lateStartTimer(){
  _lateState.timerInterval=setInterval(()=>{
    _lateState.timerRemaining--;
    const tv=document.getElementById('late-tv');
    if(tv){tv.textContent=_gramFmtSec(_lateState.timerRemaining);tv.classList.toggle('ltimer-warn',_lateState.timerRemaining<=10);tv.classList.toggle('ltimer-caut',_lateState.timerRemaining<=20&&_lateState.timerRemaining>10);}
    if(_lateState.timerRemaining<=0)_lateEndGame();
  },1000);
}
function _lateHUD(){
  const sv=document.getElementById('late-sv');if(sv)sv.textContent=_lateState.score;
  const lv=document.getElementById('late-lv');if(lv){if(_lateState.lives===Infinity){lv.textContent='∞';lv.style.fontSize='1.4rem';}else lv.innerHTML=Array(_lateState.lives).fill('❤️').join('')||'💀';}
  const tv=document.getElementById('late-tv');if(tv&&_lateState.timer===0){tv.textContent='∞';tv.classList.remove('ltimer-warn','ltimer-caut');}
}
const _LATE_GEND={αρσενικό:'m.',θηλυκό:'f.',ουδέτερο:'n.'};

function lateNext(){
  _lateState.answering=false;
  const fb=document.getElementById('late-fb');if(fb){fb.textContent='';fb.className='lfeedback';}
  _lateCurMode=(_lateMode==='mix')?LATE_MIX_POOL[Math.floor(Math.random()*LATE_MIX_POOL.length)]:_lateMode;
  document.getElementById('late-mc-area').style.display=_lateCurMode==='mc'?'grid':'none';
  document.getElementById('late-fi-area').style.display=_lateCurMode==='fi'?'block':'none';
  const _mixChip=(_lateMode==='mix')?`<div class="gram-mixchip">🎲 ${LATE_MIX_LABELS[_lateCurMode]||''}</div>`:'';
  if(_lateState.isDegrees){_lateNextDegrees();return;}
  let a,isSg,cIdx,ans,tries=0;
  do{
    a=_lateState.active[Math.floor(Math.random()*_lateState.active.length)];
    isSg=Math.random()>.5;cIdx=Math.floor(Math.random()*6);ans=isSg?a.s[cIdx]:a.p[cIdx];tries++;
  }while((!ans||ans==='-')&&tries<80);
  if(!ans||ans==='-'){lateNext();return;}
  _lateState.curr={a,isSg,cIdx,ans,isDegree:false};
  const degLabel={positive:'θετικός',comparative:'συγκριτικός',superlative:'υπερθετικός'}[a.degree]||'';
  const qt=`<div class="lq-main" style="font-size:1.1rem;text-align:center;margin-bottom:8px;"><em>${a.l}</em> <span style="color:#8a7a60;font-size:.8em;">${a.meaning}</span></div><div class="lq-tags"><span class="lq-tag voice">${LAT_A_CASES[cIdx]}</span><span class="lq-tag tense">${isSg?'Ενικός':'Πληθυντικός'}</span><span class="lq-tag mood">${_LATE_GEND[a.t]||a.t}</span>${degLabel?`<span class="lq-tag gender">${degLabel}</span>`:''}</div>`;
  document.getElementById('late-q').innerHTML=_mixChip+qt;
  if(_lateCurMode==='mc'){
    const grid=document.getElementById('late-mc-area');grid.innerHTML='';
    _lateGenOpts(a,isSg,cIdx,ans).forEach(opt=>{const b=document.createElement('button');b.className='lopt-btn';b.textContent=opt;b.onclick=()=>lateAnswer(opt);grid.appendChild(b);});
  }else{
    const inp=document.getElementById('late-fi-input');if(inp){inp.value='';inp.disabled=false;inp.style.borderColor='#7a6030';inp.focus();}
    document.getElementById('late-fi-submit').disabled=false;
  }
}

function _lateNextDegrees(){
  const row=LAT_A_DEGREES[Math.floor(Math.random()*LAT_A_DEGREES.length)];
  const options=['comp','superl'];
  const pick=options[Math.floor(Math.random()*options.length)];
  const askComp=pick==='comp';
  const correct=askComp?row.comp:row.superl;
  const qLabel=askComp?'Συγκριτικός':'Υπερθετικός';
  _lateState.curr={isDegree:true,row,askComp,ans:correct,qLabel};
  const qt=`<div class="lq-main" style="font-size:1.1rem;text-align:center;margin-bottom:8px;">Θετικός: <em>${row.pos}</em></div><div class="lq-tags"><span class="lq-tag voice">${qLabel}</span></div>`;
  const _mixChip=(_lateMode==='mix')?`<div class="gram-mixchip">🎲 ${LATE_MIX_LABELS[_lateCurMode]||''}</div>`:'';
  document.getElementById('late-q').innerHTML=_mixChip+qt;
  const distractors=_lateShuffle(LAT_A_DEGREES.filter(r=>r!==row)).slice(0,3).map(r=>askComp?r.comp:r.superl);
  const opts=_lateShuffle([correct,...distractors].slice(0,4));
  if(_lateCurMode==='mc'){
    const grid=document.getElementById('late-mc-area');grid.innerHTML='';
    opts.forEach(opt=>{const b=document.createElement('button');b.className='lopt-btn';b.textContent=opt;b.onclick=()=>lateAnswer(opt);grid.appendChild(b);});
  }else{
    const inp=document.getElementById('late-fi-input');if(inp){inp.value='';inp.disabled=false;inp.style.borderColor='#7a6030';inp.focus();}
    document.getElementById('late-fi-submit').disabled=false;
  }
}

function _lateGenOpts(a,isSg,cIdx,correct){
  const norm=s=>s.trim().toLowerCase();const used=new Set([norm(correct)]);const opts=[correct];
  const push=f=>{if(f&&f!=='-'&&!used.has(norm(f))&&opts.length<4){opts.push(f);used.add(norm(f));}};
  for(const o of _lateShuffle(LAT_A_DB.filter(o=>o!==a&&o.sub===a.sub&&o.t===a.t))){if(opts.length>=4)break;push(isSg?o.s[cIdx]:o.p[cIdx]);}
  if(opts.length<4)push(isSg?a.p[cIdx]:a.s[cIdx]);
  if(opts.length<4)for(const ci of _lateShuffle([0,1,2,3,4,5].filter(i=>i!==cIdx))){if(opts.length>=4)break;push(isSg?a.s[ci]:a.p[ci]);}
  if(opts.length<4)for(const o of _lateShuffle(_lateState.active.filter(o=>o!==a))){if(opts.length>=4)break;push(isSg?o.s[cIdx]:o.p[cIdx]);}
  return _lateShuffle(opts);
}
function _lateShuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const _lateNorm=s=>s.trim().toLowerCase();

function lateAnswer(chosen){
  if(_lateState.answering)return;_lateState.answering=true;
  const ok=_lateNorm(chosen)===_lateNorm(_lateState.curr.ans);
  document.querySelectorAll('#late-mc-area .lopt-btn').forEach(b=>{b.disabled=true;if(_lateNorm(b.textContent)===_lateNorm(_lateState.curr.ans))b.classList.add('lcorrect');else if(b.textContent===chosen&&!ok)b.classList.add('lwrong');});
  const fb=document.getElementById('late-fb');
  if(ok){_lateState.score++;if(fb){fb.textContent='✓ Σωστό!';fb.className='lfeedback lok';}}
  else{
    const m=_lateState.curr;
    const q=m.isDegree?`${m.row.pos} — ${m.qLabel}`:`${m.a.l} — ${LAT_A_CASES[m.cIdx]} ${m.isSg?'Ενικός':'Πληθυντικός'} ${_LATE_GEND[m.a.t]||''}`;
    _lateState.mistakes.push({q,typed:chosen,correct:m.ans});
    if(typeof logStudentMistake==='function') logStudentMistake('lat-epitheta','latinika','mc',{q,a:m.ans},chosen);
    if(fb){fb.innerHTML=`✗ Λάθος — σωστό: <strong>${_lateState.curr.ans}</strong>`;fb.className='lfeedback lerr';}
    if(_lateState.lives!==Infinity){_lateState.lives--;_lateHUD();if(_lateState.lives<=0){_lateState.pendingTimeout=setTimeout(()=>_lateEndGame(),1200);return;}}
  }
  _lateHUD();_lateState.pendingTimeout=setTimeout(()=>lateNext(),1500);
}
function lateSubmitFI(){
  if(_lateState.answering)return;
  const inp=document.getElementById('late-fi-input');const typed=inp?inp.value.trim():'';if(!typed){inp?.focus();return;}
  _lateState.answering=true;if(inp)inp.disabled=true;document.getElementById('late-fi-submit').disabled=true;
  const ok=_lateNorm(typed)===_lateNorm(_lateState.curr.ans);
  if(inp)inp.style.borderColor=ok?'#27ae60':'#c0392b';
  const fb=document.getElementById('late-fb');
  if(ok){_lateState.score++;if(fb){fb.textContent='✓ Σωστό!';fb.className='lfeedback lok';}}
  else{
    const m=_lateState.curr;
    const q=m.isDegree?`${m.row.pos} — ${m.qLabel}`:`${m.a.l} — ${LAT_A_CASES[m.cIdx]} ${m.isSg?'Ενικός':'Πληθυντικός'}`;
    _lateState.mistakes.push({q,typed,correct:m.ans});
    if(typeof logStudentMistake==='function') logStudentMistake('lat-epitheta','latinika','fi',{q,a:m.ans},typed);
    if(fb){fb.innerHTML=`✗ Λάθος — σωστό: <strong>${_lateState.curr.ans}</strong>`;fb.className='lfeedback lerr';}
    if(_lateState.lives!==Infinity){_lateState.lives--;_lateHUD();if(_lateState.lives<=0){_lateState.pendingTimeout=setTimeout(()=>_lateEndGame(),1400);return;}}
  }
  _lateHUD();_lateState.pendingTimeout=setTimeout(()=>lateNext(),1600);
}
function _lateEndGame(){
  clearInterval(_lateState.timerInterval);if(_lateState.pendingTimeout)clearTimeout(_lateState.pendingTimeout);
  document.getElementById('late-es').textContent=_lateState.score;
  const log=document.getElementById('late-mistakes-log');
  if(!_lateState.mistakes.length){log.innerHTML=`<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>`;}
  else{let h=`<div class="lmistakes-hdr">Λάθη: ${_lateState.mistakes.length}</div><div class="lmistakes-list">`;_lateState.mistakes.forEach(m=>{h+=`<div class="lmistake-row"><div class="lm-q">${m.q}</div><div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div></div>`;});h+='</div>';log.innerHTML=h;}
  _lateLastSelIds.forEach(id=>{try{
    const pkey=`late_prog_${id}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');
    const completed=_lateState.mistakes.length===0&&_lateState.score>0;
    const data={best:Math.max(_lateState.score,prev.best||0),completed:prev.completed||completed,ts:Date.now()};
    localStorage.setItem(pkey,JSON.stringify(data));
    const card=document.querySelector(`#late-level-grid .lvl-card[data-lvl-id="${id}"]`);
    if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className=data.completed?'lvl-badge lvl-badge-done':'lvl-badge';b.textContent=(data.completed?'✓ ':'↗ ')+data.best+'πτ';}
  }catch(e){}});
  _lateShowScreen('late-screen-end');
}
window.LATE_LEVELS = LATE_LEVELS;
