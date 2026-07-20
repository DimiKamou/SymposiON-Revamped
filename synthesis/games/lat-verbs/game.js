// Latin Verbs — conjugation quiz (4 conjugations, active/passive)
// Depends on: lat-verbs/data.js, shared-engine.js

function openLatVerbs() {
  document.getElementById('latv-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('latv-screen-levels')) _latvBuild();
}
function closeLatVerbs() {
  _latvToLevels();
  document.getElementById('latv-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

const LATV_LEVEL_GROUPS = [
  { group:'Α΄ Συζυγία (amare)', color:'lgreen',  packs:['1_ind_act','1_sub_act','1_pas'] },
  { group:'Β΄ Συζυγία (delere)',color:'lyellow', packs:['2_ind_act','2_sub_act','2_pas'] },
  { group:'Γ΄ Συζυγία (legere)',color:'lgreen',  packs:['3_ind_act','3_sub_act','3_pas'] },
  { group:'Δ΄ Συζυγία (audire)',color:'lyellow', packs:['4_ind_act','4_sub_act','4_pas'] },
  { group:'Συνδυαστικά',        color:'lred',    packs:['all_pres','all_act','master'] },
];

let _latvMode = 'mc', _latvState = null, _latvLastSelPacks = [];
const LATV_MIX_POOL=['mc','fi'];
const LATV_MIX_LABELS={mc:'Πολλαπλή Επιλογή',fi:'Συμπλήρωση Κενού'};
let _latvCurMode='mc';

function _latvBuild() {
  document.getElementById('latv-wrap').innerHTML = `
<div id="latv-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Κλίση Λατινικών Ρημάτων</h1>
    <p class="lsubtitle">Λατινικά — Τέσσερις Συζυγίες · Ενεργητική & Παθητική Φωνή</p>
    <button class="game-share-btn" onclick="showQR('Κλίση Λατινικών Ρημάτων',{nav:'game',id:'lat-verbs'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="latv-level-grid"></div>
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:16px;">
      <div style="display:none;">
        <select id="latv-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option><option value="0">∞ χρόνος</option>
        </select>
        <select id="latv-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">∞ ζωές</option>
        </select>
        <select id="latv-sel-mode" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="" disabled selected>— τρόπος —</option>
          <option value="mc">Πολλ. Επιλογή</option>
          <option value="fi">Συμπλήρωση</option>
          <option value="mix">🎲 MIX</option>
        </select>
      </div>
      <button id="latv-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="latvOpenSettings()">✓ Διάλεξε επίπεδο →</button>
    </div>
  </div>
</div>
<div id="latv-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="latv-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="latv-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="latv-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_latvEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="latv-q"><div class="lq-main">Φόρτωση...</div></div>
    <div class="lfeedback" id="latv-fb"></div>
    <div id="latv-mc-area" class="lopts-grid" style="display:none;"></div>
    <div id="latv-fi-area" style="display:none;">
      <div style="text-align:center;margin-bottom:14px;">
        <input type="text" id="latv-fi-input" autocomplete="off" autocorrect="off" spellcheck="false"
          placeholder="πληκτρολογήστε..."
          style="font-size:1.5rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:8px;color:#e8c87a;width:100%;max-width:340px;outline:none;text-align:center;caret-color:#c9a44a;">
      </div>
      <button class="lfi-submit" id="latv-fi-submit" onclick="latvSubmitFI()">Υποβολή ↵</button>
    </div>
  </div>
</div>
<div id="latv-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="latv-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="latv-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_latvRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_latvToLevels()">Επίπεδα</button>
    </div>
  </div>
</div>`;

  const _latvLvls = [];
  LATV_LEVEL_GROUPS.forEach(grp => grp.packs.forEach(pid => {
    const pack = LAT_V_PACKS.find(p => p.id === pid);
    if (pack) _latvLvls.push({ id: pid, group: grp.group, desc: pack.label, color: grp.color });
  }));
  gramBuildSubPicker('latv', _latvLvls, { selClass: 'latv-sel', railLabel: 'Συζυγίες', dataAttrs: l => ({ pack: l.id }), onToggle: _latvUpdateStartBtn });
  document.getElementById('latv-fi-input').onkeydown=e=>{if(e.key==='Enter')latvSubmitFI();};
  document.getElementById('latv-sel-mode').addEventListener('change',_latvUpdateStartBtn);
}

function _latvUpdateStartBtn(){
  const sel=document.querySelectorAll('#latv-level-grid .lvl-card.latv-sel');
  const mode=document.getElementById('latv-sel-mode')?.value;
  const btn=document.getElementById('latv-start-btn');
  if(!btn)return;
  if(sel.length>0){btn.style.opacity='1';btn.style.pointerEvents='auto';btn.textContent=`Επόμενο (${sel.length} επ.) →`;}
  else{btn.style.opacity='.5';btn.style.pointerEvents='none';btn.textContent='✓ Επίπεδο & τρόπος →';}
}

function _latvShowScreen(id){document.querySelectorAll('#latv-wrap .lyo-screen').forEach(s=>s.classList.remove('active'));document.getElementById(id)?.classList.add('active');}
function _latvToLevels(){
  if(_latvState){clearInterval(_latvState.timerInterval);if(_latvState.pendingTimeout)clearTimeout(_latvState.pendingTimeout);_latvState.timerInterval=null;_latvState.pendingTimeout=null;}
  _latvShowScreen('latv-screen-levels');
}
function _latvRetry(){
  if(_latvState){
    _latvState.score=0;_latvState.lives=_latvState.lives===Infinity?Infinity:parseInt(document.getElementById('latv-sel-lives')?.value||3);
    _latvState.timerRemaining=_latvState.timer;_latvState.mistakes=[];_latvState.answering=false;
    if(_latvState.pendingTimeout)clearTimeout(_latvState.pendingTimeout);clearInterval(_latvState.timerInterval);
    _latvShowScreen('latv-screen-game');_latvHUD();if(_latvState.timer>0)_latvStartTimer();latvNext();
  }else{_latvToLevels();}
}

function _latvBuildPool(packIds){
  const pool=[];
  packIds.forEach(pid=>{
    const pack=LAT_V_PACKS.find(p=>p.id===pid);if(!pack)return;
    pack.keys.forEach(key=>{
      LAT_V_DB.filter(v=>pack.conj.includes(v.conj)).forEach(verb=>{
        const forms=verb[key];if(!forms)return;
        forms.forEach((ans,pi)=>{
          if(ans)pool.push({verb,key,pi,ans,packLabel:pack.label});
        });
      });
    });
  });
  return pool;
}

function latvOpenSettings(){
  if(!document.querySelectorAll('#latv-level-grid .lvl-card.latv-sel').length) return;
  gramOpenQuizSettings('latv', { title:'Λατινικά Ρήματα', datasetId:'lat-verbs',
    modes:[
      {id:'mc', label:'Πολλαπλή Επιλογή', hint:'Επίλεξε από 4 επιλογές'},
      {id:'fi', label:'Συμπλήρωση Κενού', hint:'Γράψε τον τύπο'},
      {id:'mix', label:'MIX — Ανάμεικτο', hint:'Τυχαίο στυλ σε κάθε ερώτηση'},
    ],
    onLaunch: latvLaunch, onClose: closeLatVerbs });
}
function latvLaunch(){
  const selCards=document.querySelectorAll('#latv-level-grid .lvl-card.latv-sel');
  const modeVal=document.getElementById('latv-sel-mode')?.value;
  if(!selCards.length||!modeVal)return;
  const packIds=[];selCards.forEach(c=>{const p=c.dataset.pack;if(p&&!packIds.includes(p))packIds.push(p);});
  _latvLastSelPacks=packIds;
  _latvMode=modeVal;
  const t=parseInt(document.getElementById('latv-sel-time').value);
  const l=parseInt(document.getElementById('latv-sel-lives').value);
  const pool=_latvBuildPool(packIds);
  _latvState={score:0,lives:l===0?Infinity:l,timer:t,timerRemaining:t,timerInterval:null,answering:false,pendingTimeout:null,pool,curr:null,mistakes:[]};
  if(!_latvState.pool.length){alert('Δεν βρέθηκαν ρήματα.');return;}
  document.getElementById('latv-mc-area').style.display=_latvMode==='mc'?'grid':'none';
  document.getElementById('latv-fi-area').style.display=_latvMode==='fi'?'block':'none';
  _latvShowScreen('latv-screen-game');_latvHUD();if(t>0)_latvStartTimer();latvNext();
}

function _latvStartTimer(){
  _latvState.timerInterval=setInterval(()=>{
    _latvState.timerRemaining--;
    const tv=document.getElementById('latv-tv');
    if(tv){tv.textContent=_gramFmtSec(_latvState.timerRemaining);tv.classList.toggle('ltimer-warn',_latvState.timerRemaining<=10);tv.classList.toggle('ltimer-caut',_latvState.timerRemaining<=20&&_latvState.timerRemaining>10);}
    if(_latvState.timerRemaining<=0)_latvEndGame();
  },1000);
}
function _latvHUD(){
  const sv=document.getElementById('latv-sv');if(sv)sv.textContent=_latvState.score;
  const lv=document.getElementById('latv-lv');if(lv){if(_latvState.lives===Infinity){lv.textContent='∞';lv.style.fontSize='1.4rem';}else lv.innerHTML=Array(_latvState.lives).fill('❤️').join('')||'💀';}
  const tv=document.getElementById('latv-tv');if(tv&&_latvState.timer===0){tv.textContent='∞';tv.classList.remove('ltimer-warn','ltimer-caut');}
}

function latvNext(){
  _latvState.answering=false;
  const fb=document.getElementById('latv-fb');if(fb){fb.textContent='';fb.className='lfeedback';}
  const item=_latvState.pool[Math.floor(Math.random()*_latvState.pool.length)];
  _latvState.curr=item;
  const conj=LAT_V_CONJ_LABELS[item.verb.conj]||'';
  const tenseLabel=_latvKeyLabel(item.key);
  const person=LAT_V_PERSONS[item.pi];
  const qt=`<div class="lq-main" style="font-size:1.1rem;text-align:center;margin-bottom:8px;"><em>${item.verb.inf}</em> <span style="color:#8a7a60;font-size:.85em;">(${item.verb.meaning})</span></div><div class="lq-tags"><span class="lq-tag voice">${tenseLabel}</span><span class="lq-tag tense">${person}</span><span class="lq-tag mood">${conj}</span></div>`;
  _latvCurMode=(_latvMode==='mix')?LATV_MIX_POOL[Math.floor(Math.random()*LATV_MIX_POOL.length)]:_latvMode;
  document.getElementById('latv-mc-area').style.display=_latvCurMode==='mc'?'grid':'none';
  document.getElementById('latv-fi-area').style.display=_latvCurMode==='fi'?'block':'none';
  const _mixChip=(_latvMode==='mix')?`<div class="gram-mixchip">🎲 ${LATV_MIX_LABELS[_latvCurMode]||''}</div>`:'';document.getElementById('latv-q').innerHTML=_mixChip+qt;
  if(_latvCurMode==='mc'){
    const grid=document.getElementById('latv-mc-area');grid.innerHTML='';
    _latvGenOpts(item).forEach(opt=>{
      const b=document.createElement('button');b.className='lopt-btn';b.textContent=opt;b.onclick=()=>latvAnswer(opt);grid.appendChild(b);
    });
  }else{
    const inp=document.getElementById('latv-fi-input');if(inp){inp.value='';inp.disabled=false;inp.style.borderColor='#7a6030';inp.focus();}
    document.getElementById('latv-fi-submit').disabled=false;
  }
}

function _latvGenOpts(item){
  const norm=s=>s.trim().toLowerCase();
  const correct=item.ans;
  const used=new Set([norm(correct)]);
  const opts=[correct];
  const push=f=>{if(f&&!used.has(norm(f))&&opts.length<4){opts.push(f);used.add(norm(f));}};
  // Same verb, different person, same key
  (item.verb[item.key]||[]).forEach(f=>{if(opts.length<4)push(f);});
  // Same key, different verb of same conjugation
  for(const v of _latvShuffle(LAT_V_DB.filter(v=>v!==item.verb&&v.conj===item.verb.conj))){
    if(opts.length>=4)break;push((v[item.key]||[])[item.pi]);
  }
  // Any form of same verb
  ['act_ind_pres','act_ind_ipf','act_ind_fut','pas_ind_pres','pas_ind_ipf','act_sub_pres'].forEach(k=>{
    if(opts.length>=4)return;(item.verb[k]||[]).forEach(f=>{if(opts.length<4)push(f);});
  });
  // Any form from pool
  if(opts.length<4){
    for(const it of _latvShuffle([..._latvState.pool])){if(opts.length>=4)break;push(it.ans);}
  }
  return _latvShuffle(opts);
}
function _latvShuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const _latvNorm=s=>s.trim().toLowerCase();

function latvAnswer(chosen){
  if(_latvState.answering)return;_latvState.answering=true;
  const ok=_latvNorm(chosen)===_latvNorm(_latvState.curr.ans);
  document.querySelectorAll('#latv-mc-area .lopt-btn').forEach(b=>{
    b.disabled=true;
    if(_latvNorm(b.textContent)===_latvNorm(_latvState.curr.ans))b.classList.add('lcorrect');
    else if(b.textContent===chosen&&!ok)b.classList.add('lwrong');
  });
  const fb=document.getElementById('latv-fb');
  if(ok){_latvState.score++;if(fb){fb.textContent='✓ Σωστό!';fb.className='lfeedback lok';}}
  else{
    const m=_latvState.curr;
    _latvState.mistakes.push({verb:m.verb.inf,tense:_latvKeyLabel(m.key),person:LAT_V_PERSONS[m.pi],typed:chosen,correct:m.ans});
    if(typeof logStudentMistake==='function') logStudentMistake('lat-verbs','latinika','mc',{q:`${m.verb.inf} — ${_latvKeyLabel(m.key)} ${LAT_V_PERSONS[m.pi]}`,a:m.ans},chosen);
    if(fb){fb.innerHTML=`✗ Λάθος — σωστό: <strong>${_latvState.curr.ans}</strong>`;fb.className='lfeedback lerr';}
    if(_latvState.lives!==Infinity){_latvState.lives--;_latvHUD();if(_latvState.lives<=0){_latvState.pendingTimeout=setTimeout(()=>_latvEndGame(),1200);return;}}
  }
  _latvHUD();_latvState.pendingTimeout=setTimeout(()=>latvNext(),1500);
}

function latvSubmitFI(){
  if(_latvState.answering)return;
  const inp=document.getElementById('latv-fi-input');const typed=inp?inp.value.trim():'';if(!typed){inp?.focus();return;}
  _latvState.answering=true;if(inp)inp.disabled=true;document.getElementById('latv-fi-submit').disabled=true;
  const ok=_latvNorm(typed)===_latvNorm(_latvState.curr.ans);
  if(inp)inp.style.borderColor=ok?'#27ae60':'#c0392b';
  const fb=document.getElementById('latv-fb');
  if(ok){_latvState.score++;if(fb){fb.textContent='✓ Σωστό!';fb.className='lfeedback lok';}}
  else{
    const m=_latvState.curr;
    _latvState.mistakes.push({verb:m.verb.inf,tense:_latvKeyLabel(m.key),person:LAT_V_PERSONS[m.pi],typed,correct:m.ans});
    if(typeof logStudentMistake==='function') logStudentMistake('lat-verbs','latinika','fi',{q:`${m.verb.inf} — ${_latvKeyLabel(m.key)} ${LAT_V_PERSONS[m.pi]}`,a:m.ans},typed);
    if(fb){fb.innerHTML=`✗ Λάθος — σωστό: <strong>${_latvState.curr.ans}</strong>`;fb.className='lfeedback lerr';}
    if(_latvState.lives!==Infinity){_latvState.lives--;_latvHUD();if(_latvState.lives<=0){_latvState.pendingTimeout=setTimeout(()=>_latvEndGame(),1400);return;}}
  }
  _latvHUD();_latvState.pendingTimeout=setTimeout(()=>latvNext(),1600);
}

function _latvEndGame(){
  clearInterval(_latvState.timerInterval);if(_latvState.pendingTimeout)clearTimeout(_latvState.pendingTimeout);
  document.getElementById('latv-es').textContent=_latvState.score;
  const log=document.getElementById('latv-mistakes-log');
  if(!_latvState.mistakes.length){log.innerHTML=`<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>`;}
  else{
    let h=`<div class="lmistakes-hdr">Λάθη: ${_latvState.mistakes.length}</div><div class="lmistakes-list">`;
    _latvState.mistakes.forEach(m=>{h+=`<div class="lmistake-row"><div class="lm-q">${m.verb} — ${m.tense} ${m.person}</div><div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div></div>`;});
    h+='</div>';log.innerHTML=h;
  }
  _latvLastSelPacks.forEach(pid=>{try{
    const pkey=`latv_prog_${pid}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');
    const completed=_latvState.mistakes.length===0&&_latvState.score>0;
    const data={best:Math.max(_latvState.score,prev.best||0),completed:prev.completed||completed,ts:Date.now()};
    localStorage.setItem(pkey,JSON.stringify(data));
    const card=document.querySelector(`#latv-level-grid .lvl-card[data-pack="${pid}"]`);
    if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className=data.completed?'lvl-badge lvl-badge-done':'lvl-badge';b.textContent=(data.completed?'✓ ':'↗ ')+data.best+'πτ';}
  }catch(e){}});
  _latvShowScreen('latv-screen-end');
}
