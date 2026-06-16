// ============================================================
//  ΑΝΩΜΑΛΑ ΡΗΜΑΤΑ — Αρχικοί Χρόνοι
//  Modes: MC · MC-Letter · FI · FT · FT-Any · Match · All · Chrono
//  Depends on: anwmala-rimata/data.js  (ARV_DB)
// ============================================================

const ARV = (() => {

// ── Polytonic keyboard ────────────────────────────────────────
const DIAC = [
  {id:'ox',l:'´',h:'Οξεία'},{id:'per',l:'͂',h:'Περισπ.'},
  {id:'ypogr',l:'ͅ',h:'Υπογ.'},{id:'das',l:'῾',h:'Δασεία'},
  {id:'psi',l:'᾿',h:'Ψιλή'},{id:'das_ox',l:'῾´',h:'Δασ+Οξ'},
  {id:'das_per',l:'῟',h:'Δασ+Περ'},{id:'psi_ox',l:'᾿´',h:'Ψιλ+Οξ'},
  {id:'psi_per',l:'῏',h:'Ψιλ+Περ'},
];
const COMBO={
  ox:{α:'ά',ε:'έ',η:'ή',ι:'ί',ο:'ό',υ:'ύ',ω:'ώ'},
  per:{α:'ᾶ',η:'ῆ',ι:'ῖ',υ:'ῦ',ω:'ῶ'},
  ypogr:{α:'ᾳ',η:'ῃ',ω:'ῳ'},
  das:{α:'ἁ',ε:'ἑ',η:'ἡ',ι:'ἱ',ο:'ὁ',υ:'ὑ',ω:'ὡ'},
  psi:{α:'ἀ',ε:'ἐ',η:'ἠ',ι:'ἰ',ο:'ὀ',υ:'ὐ',ω:'ὠ'},
  das_ox:{α:'ἅ',ε:'ἕ',η:'ἥ',ι:'ἵ',ο:'ὅ',υ:'ὕ',ω:'ὥ'},
  das_per:{α:'ἇ',η:'ἧ',ι:'ἷ',υ:'ὗ',ω:'ὧ'},
  psi_ox:{α:'ἄ',ε:'ἔ',η:'ἤ',ι:'ἴ',ο:'ὄ',υ:'ὔ',ω:'ὤ'},
  psi_per:{α:'ἆ',η:'ἦ',ι:'ἶ',υ:'ὖ',ω:'ὦ'},
};

let _kbDiac = null;
let _kbLastInput = null;

function _kbToggle(id){
  _kbDiac = _kbDiac === id ? null : id;
  document.querySelectorAll('#arv-diac-row .arv-dkey').forEach(b =>
    b.classList.toggle('arv-dkey-on', b.dataset.id === _kbDiac));
  _kbRenderVowels();
}
function _kbRenderVowels(){
  ['α','ε','η','ι','ο','υ','ω'].forEach(v => {
    const c = document.getElementById('arv-vkeys-'+v); if(!c) return;
    while(c.children.length > 1) c.removeChild(c.lastChild);
    if(!_kbDiac) return;
    const ch = (COMBO[_kbDiac]||{})[v]; if(!ch) return;
    const b = document.createElement('button'); b.className='arv-vkey arv-vkey-hi';
    b.textContent=ch; b.onmousedown=e=>{e.preventDefault();_kbInsert(ch);}; c.appendChild(b);
  });
}
function _kbInsert(ch){
  let inp = (_kbLastInput && document.contains(_kbLastInput)) ? _kbLastInput
    : document.getElementById('arv-fi-input');
  if(!inp) return;
  const s=inp.selectionStart, e=inp.selectionEnd;
  inp.value=inp.value.slice(0,s)+ch+inp.value.slice(e);
  inp.selectionStart=inp.selectionEnd=s+ch.length; inp.focus();
  if(_kbDiac){ _kbDiac=null; document.querySelectorAll('#arv-diac-row .arv-dkey').forEach(b=>b.classList.remove('arv-dkey-on')); _kbRenderVowels(); }
}
function _kbVowelClick(v){
  const ch=_kbDiac?(COMBO[_kbDiac]||{})[v]||v:v; _kbInsert(ch);
}
function _kbTogglePanel(){
  document.getElementById('arv-poly-toggle')?.classList.toggle('open');
  document.getElementById('arv-poly-body')?.classList.toggle('open');
}
function _buildKB(){
  const dr=document.getElementById('arv-diac-row');
  const vr=document.getElementById('arv-vowel-rows');
  if(!dr||!vr) return;
  dr.innerHTML='';
  DIAC.forEach(d=>{
    const b=document.createElement('button'); b.className='arv-dkey'; b.dataset.id=d.id;
    b.innerHTML=`<span>${d.l}</span><span class="arv-dkey-label">${d.h}</span>`;
    b.onclick=()=>_kbToggle(d.id); dr.appendChild(b);
  });
  ['α','ε','η','ι','ο','υ','ω'].forEach(v=>{
    const row=document.createElement('div'); row.className='arv-vowel-row';
    const lbl=document.createElement('div'); lbl.className='arv-vlabel'; lbl.textContent=v; row.appendChild(lbl);
    const keys=document.createElement('div'); keys.className='arv-vkeys'; keys.id='arv-vkeys-'+v;
    const plain=document.createElement('button'); plain.className='arv-vkey'; plain.textContent=v;
    plain.onmousedown=e=>{e.preventDefault();_kbVowelClick(v);}; keys.appendChild(plain); row.appendChild(keys); vr.appendChild(row);
  });
  _kbDiac=null; _kbRenderVowels();
}

// ── Data helpers ──────────────────────────────────────────────
function _stripDia(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g,''); }
function _pool(){
  if(_selectedIds.size>0){
    return ARV_DB.filter(e=>_selectedIds.has(e.id)&&e.forms.length>=2);
  }
  return ARV_DB.filter(e =>
    (_letters.length===0 || _letters.includes(e.letter)) &&
    (_diff==='all' || e.diff===_diff) &&
    e.forms.length >= 2
  );
}
function _letterCounts(){
  const m={};
  for(const e of ARV_DB){ m[e.letter]=(m[e.letter]||0)+1; }
  return m;
}
let _byTense=null;
function _buildIndex(){
  _byTense={};
  for(const e of ARV_DB) for(const f of e.forms){
    const k=f.v+'|'+f.t; if(!_byTense[k]) _byTense[k]=[];
    _byTense[k].push(f.f);
  }
}
let _byTenseLetter=null;
function _buildLetterIndex(){
  _byTenseLetter={};
  for(const e of ARV_DB) for(const f of e.forms){
    const k=e.letter+'|'+f.v+'|'+f.t;
    if(!_byTenseLetter[k]) _byTenseLetter[k]=[];
    _byTenseLetter[k].push(f.f);
  }
}
function _wrongOpts(correct, voice, tense, n=3, letter=null){
  const excl=Array.isArray(correct)?correct:[correct];
  if(!_byTense) _buildIndex();
  let pool;
  if(letter){
    if(!_byTenseLetter) _buildLetterIndex();
    pool = [...new Set((_byTenseLetter[letter+'|'+voice+'|'+tense]||[]).filter(v=>!excl.includes(v)))];
    if(pool.length < n){
      const extra = (_byTense[voice+'|'+tense]||[]).filter(v=>!excl.includes(v)&&!pool.includes(v));
      pool = [...pool, ...extra];
    }
  } else {
    pool = (_byTense[voice+'|'+tense]||[]).filter(v=>!excl.includes(v));
  }
  pool = [...new Set(pool)].sort(()=>Math.random()-.5);
  const res=pool.slice(0,n); while(res.length<n) res.push('—'); return res;
}
function _rand(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function _shuffle(arr){ const a=[...arr]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function _splitForms(f){ return f.split('-').map(s=>s.trim()).filter(Boolean); }
function _presentOf(entry,voice){ const pf=entry.forms.find(f=>f.v===voice&&f.t==='present'); return pf?_splitForms(pf.f).join(' / '):entry.lemma; }

const TENSE_ORDER=['present','imperfect','future','aorist','perfect','pluperfect'];
const TENSE_LABELS={
  present:'Ενεστώτας',imperfect:'Παρατατικός',future:'Μέλλοντας',
  aorist:'Αόριστος',perfect:'Παρακείμενος',pluperfect:'Υπερσυντέλικος'
};
function _tenseLabel(f){ return TENSE_LABELS[f.t]||f.l; }
function _sortForms(forms){
  return [...forms].sort((a,b)=>{
    let ai=TENSE_ORDER.indexOf(a.t),bi=TENSE_ORDER.indexOf(b.t);
    if(ai<0)ai=99;if(bi<0)bi=99;return ai-bi;
  });
}
function _helpHTML(){ return `<div class="arv-help-wrap"><button class="arv-help-btn" id="arv-help-btn" onclick="ARV.helpToggle()">? Βοήθεια</button><div class="arv-help-options" id="arv-help-options"><button class="arv-help-opt" onclick="ARV.helpReveal('stem')">Θέμα</button><button class="arv-help-opt" onclick="ARV.helpReveal('other')">Άλλος Τύπος</button></div><div class="arv-help-result" id="arv-help-result" style="display:none;"></div></div>`; }

// ── DOM helpers ───────────────────────────────────────────────
const $=id=>document.getElementById(id);
function _show(id){
  document.querySelectorAll('#arv-wrap .arv-screen').forEach(s=>s.classList.remove('active'));
  $(id)?.classList.add('active');
}

// ── State ─────────────────────────────────────────────────────
let _state={};
function _initState(mode, time, lives){
  _state={mode, time, lives,
    score:0, livesLeft:lives===0?Infinity:lives,
    timerLeft:time, timerInterval:null, pendingTO:null,
    answering:false, lastId:null, mistakes:[],
    pool:_pool(),
  };
}

// ── HUD ────────────────────────────────────────────────────────
function _hud(){
  ['arv-sv','arv-msv','arv-asv','arv-csv'].forEach(id=>{const el=$(id);if(el)el.textContent=_state.score;});
  ['arv-lv','arv-mlv','arv-alv','arv-clv'].forEach(id=>{
    const el=$(id);if(!el)return;
    if(_state.livesLeft===Infinity){el.textContent='∞';el.style.fontSize='1.4rem';}
    else el.innerHTML=Array(_state.livesLeft).fill('❤️').join('')||'💀';
  });
}
function _startTimer(){
  if(_state.time===0) return;
  _state.timerInterval=setInterval(()=>{
    _state.timerLeft--;
    ['arv-tv','arv-mtv','arv-atv','arv-ctv'].forEach(id=>{
      const tv=$(id); if(!tv) return;
      tv.textContent=_gramFmtSec(_state.timerLeft);
      tv.classList.toggle('arv-warn',_state.timerLeft<=10);
      tv.classList.toggle('arv-caut',_state.timerLeft<=20&&_state.timerLeft>10);
    });
    if(_state.timerLeft<=0) _end();
  },1000);
}

// ── End ───────────────────────────────────────────────────────
function _end(){
  clearInterval(_state.timerInterval);
  if(_state.pendingTO) clearTimeout(_state.pendingTO);
  const es=$('arv-es'); if(es) es.textContent=_state.score;
  const log=$('arv-mistakes-log');
  if(log){
    if(!_state.mistakes.length){
      log.innerHTML='<p style="color:#27ae60;text-align:center;font-style:italic;margin:12px 0;">Τέλειο! Κανένα λάθος! 🎉</p>';
    } else {
      let h=`<div class="arv-mis-hdr">Λάθη: ${_state.mistakes.length}</div><div class="arv-mis-list">`;
      _state.mistakes.forEach(m=>{
        h+=`<div class="arv-mis-row">
          <div class="arv-mis-q"><em>${m.lemma}</em> — <span style="color:#c9a44a;">${m.askLabel}</span></div>
          <div class="arv-mis-ans"><span class="arv-wrong">${m.typed||'—'}</span><span style="color:#8a7a60"> → </span><span class="arv-correct">${m.correct}</span></div>
        </div>`;
      });
      h+='</div>'; log.innerHTML=h;
    }
  }
  _show('arv-screen-end');

  // ── Temple rewards (config-driven per-game params — see realm.js gameRewards) ──
  if (typeof awardGameRewards === 'function') {
    const perfect = _state.mistakes.length === 0 && _state.score > 0;
    awardGameRewards('anwmala-rimata', { score: _state.score, perfect: perfect });
  } else if (typeof awardRewards === 'function') {
    const perfect = _state.mistakes.length === 0 && _state.score > 0;
    awardRewards(Math.round(_state.score * 15 + (perfect ? 10 : 0)), 3 + (perfect ? 3 : 0));
  }
}

// ── Feedback ──────────────────────────────────────────────────
function _fb(elId,ok,correct){
  const fb=$(elId); if(!fb) return;
  if(ok){fb.textContent='✓ Σωστό!';fb.className='arv-fb arv-ok';}
  else{fb.innerHTML=`✗ Λάθος — σωστό: <strong>${correct}</strong>`;fb.className='arv-fb arv-err';}
}
function _fbClear(elId){const fb=$(elId);if(fb){fb.textContent='';fb.className='arv-fb';}}

// ── MC MODE (standard + mc_letter) ───────────────────────────
function _mcNextQ(){
  if(!_state.pool.length){_end();return;}
  _state.answering=false; _fbClear('arv-fb');
  let entry;
  for(let a=0;a<10;a++){const c=_rand(_state.pool);if(a<9&&c.id===_state.lastId)continue;entry=c;break;}
  _state.lastId=entry.id;
  const pool=entry.forms;
  const givenIdx=Math.floor(Math.random()*pool.length);
  let askedIdx=givenIdx;
  for(let t=0;t<12&&askedIdx===givenIdx;t++) askedIdx=Math.floor(Math.random()*pool.length);
  if(askedIdx===givenIdx) askedIdx=(givenIdx+1)%pool.length;
  const given=pool[givenIdx], asked=pool[askedIdx];
  const allForms=_splitForms(asked.f);
  const primaryCorrect=allForms[0];
  const letter=(_state.mode==='mc_letter') ? entry.letter : null;
  const wrongCount=Math.max(0,4-allForms.length);
  const opts=_shuffle([...allForms,..._wrongOpts(allForms,asked.v,asked.t,wrongCount,letter)]);
  _state.curr={entry,given,asked,correct:primaryCorrect,allForms};
  const qel=$('arv-q');
  if(qel) qel.innerHTML=`
    <div class="arv-q-main">
      <span class="arv-q-lemma">${entry.lemma}</span>
      ${entry.meaning?`<span class="arv-q-meaning">(${entry.meaning})</span>`:''}
    </div>
    <div class="arv-q-given">
      <span class="arv-q-form">${_splitForms(given.f).join(' / ')}</span>
    </div>
    <div class="arv-q-ask">Ποιος είναι ο <strong>${asked.l}</strong>;</div>
    ${_helpHTML()}`;
  const grid=$('arv-opts'); if(!grid) return;
  grid.innerHTML='';
  opts.forEach(opt=>{
    const b=document.createElement('button'); b.className='arv-opt'; b.textContent=opt;
    b.onclick=()=>_mcAnswer(opt); grid.appendChild(b);
  });
}
function _mcAnswer(chosen){
  if(_state.answering)return; _state.answering=true;
  const{correct,asked,entry,allForms}=_state.curr;
  const ok=allForms.some(f=>f===chosen);
  document.querySelectorAll('#arv-opts .arv-opt').forEach(b=>{
    b.disabled=true;
    if(allForms.includes(b.textContent)) b.classList.add('arv-opt-ok');
    else if(b.textContent===chosen&&!ok) b.classList.add('arv-opt-err');
  });
  if(ok){
    const fb=$('arv-fb');
    if(fb){
      const others=allForms.filter(f=>f!==chosen);
      fb.innerHTML='✓ Σωστό!'+(others.length?` <span class="arv-fb-alts">Επίσης: ${others.join(', ')}</span>`:'');
      fb.className='arv-fb arv-ok';
    }
    _state.score++;
  } else {
    const fb=$('arv-fb');
    if(fb){
      const disp=allForms.join(' / ');
      fb.innerHTML=`✗ Λάθος — σωστ${allForms.length>1?'οί τύποι':'ό'}: <strong>${disp}</strong>`;
      fb.className='arv-fb arv-err';
    }
    _state.mistakes.push({lemma:entry.lemma,askLabel:asked.l,typed:chosen,correct:allForms.join(' / ')});
    if(typeof logStudentMistake==='function') logStudentMistake('arv','anwmala-rimata','mc',{q:`${entry.lemma} — ${asked.l}`,a:allForms[0]},chosen);
    if(_state.livesLeft!==Infinity){_state.livesLeft--;_hud();if(_state.livesLeft<=0){_state.pendingTO=setTimeout(_end,1200);return;}}
  }
  _hud(); _state.pendingTO=setTimeout(_mcNextQ,1500);
}

// ── FI / FT / FT-Any MODE ─────────────────────────────────────
function _fiNextQ(){
  if(!_state.pool.length){_end();return;}
  _state.answering=false; _fbClear('arv-fb');
  let entry;
  for(let a=0;a<10;a++){const c=_rand(_state.pool);if(a<9&&c.id===_state.lastId)continue;entry=c;break;}
  _state.lastId=entry.id;

  let given, asked;
  const mode=_state.mode;

  if(mode==='ft'){
    // Ζητούμενος Τύπος: given = present of a chosen voice, asked = another tense of SAME voice
    const voices=[...new Set(entry.forms.map(f=>f.v))];
    const voice=_rand(voices);
    const vForms=entry.forms.filter(f=>f.v===voice);
    given=vForms.find(f=>f.t==='present')||vForms[0];
    const askable=vForms.filter(f=>f.f!==given.f);
    asked=askable.length?_rand(askable):vForms[Math.floor(Math.random()*vForms.length)];
  } else if(mode==='ft_any'){
    // Τυχαίος Τύπος: given = any random form, asked = any other form
    const givenIdx=Math.floor(Math.random()*entry.forms.length);
    given=entry.forms[givenIdx];
    const askable=entry.forms.filter((_,i)=>i!==givenIdx);
    asked=askable.length?_rand(askable):entry.forms[0];
  } else {
    // Standard FI: given = active present, asked = any other
    const askable=entry.forms.filter(f=>!(f.v==='active'&&f.t==='present'));
    asked=askable.length?_rand(askable):_rand(entry.forms);
    given=entry.forms.find(f=>f.v==='active'&&f.t==='present')||entry.forms[0];
  }

  const allForms=_splitForms(asked.f);
  _state.curr={entry,given,asked,correct:allForms[0],allForms};
  const qel=$('arv-q');
  if(qel) qel.innerHTML=`
    <div class="arv-q-main">
      <span class="arv-q-lemma">${entry.lemma}</span>
      ${entry.meaning?`<span class="arv-q-meaning">(${entry.meaning})</span>`:''}
    </div>
    <div class="arv-q-given">
      <span class="arv-q-label">${_tenseLabel(given)}:</span>
      <span class="arv-q-form">${_splitForms(given.f).join(' / ')}</span>
    </div>
    <div class="arv-q-ask">Γράψε τον <strong>${_tenseLabel(asked)}</strong>:</div>
    ${_helpHTML()}`;
  const inp=$('arv-fi-input');
  if(inp){inp.value='';inp.disabled=false;inp.className='arv-fi-inp';inp.focus();}
  const sub=$('arv-fi-submit'); if(sub) sub.disabled=false;
  _kbDiac=null;
  document.querySelectorAll('#arv-diac-row .arv-dkey').forEach(b=>b.classList.remove('arv-dkey-on'));
  _kbRenderVowels();
}
function _fiSubmit(){
  if(_state.answering)return;
  const inp=$('arv-fi-input'); if(!inp)return;
  const typed=inp.value.trim(); if(!typed){inp.focus();return;}
  _state.answering=true; inp.disabled=true;
  const sub=$('arv-fi-submit'); if(sub) sub.disabled=true;
  const{allForms,asked,entry}=_state.curr;
  const ok=allForms.some(f=>f===typed);
  inp.classList.add(ok?'arv-fi-ok':'arv-fi-err');
  const fb=$('arv-fb');
  if(ok){
    if(fb){
      const others=allForms.filter(f=>f!==typed).join(', ');
      fb.innerHTML='✓ Σωστό!'+(others?` <span class="arv-fb-alts">Επίσης: ${others}</span>`:'');
      fb.className='arv-fb arv-ok';
    }
    _state.score++;
  } else {
    if(fb){
      const disp=allForms.length>1?allForms.join(' / '):allForms[0];
      fb.innerHTML=`✗ Λάθος — σωστ${allForms.length>1?'οί τύποι':'ό'}: <strong>${disp}</strong>`;
      fb.className='arv-fb arv-err';
    }
    _state.mistakes.push({lemma:entry.lemma,askLabel:asked.l,typed,correct:allForms.join(' / ')});
    if(typeof logStudentMistake==='function') logStudentMistake('arv','anwmala-rimata',_state.mode,{q:`${entry.lemma} — ${asked.l}`,a:allForms[0]},typed);
    if(_state.livesLeft!==Infinity){_state.livesLeft--;_hud();if(_state.livesLeft<=0){_state.pendingTO=setTimeout(_end,1400);return;}}
  }
  _hud(); _state.pendingTO=setTimeout(_fiNextQ,1700);
}

// ── MATCH MODE ────────────────────────────────────────────────
let _matchState={leftSel:null,rightSel:null,matched:0,total:0};

function _matchNextRound(){
  _fbClear('arv-fb-match');
  _matchState={leftSel:null,rightSel:null,matched:0,total:0};
  const pool=_shuffle([..._state.pool]).slice(0,8);
  const pairs=[];
  for(const entry of pool){
    if(pairs.length>=6) break;
    const askable=entry.forms.filter(f=>!(f.v==='active'&&f.t==='present'));
    if(!askable.length) continue;
    pairs.push({entry,asked:_rand(askable),id:entry.id});
  }
  if(pairs.length<2){_end();return;}
  _matchState.total=pairs.length;
  const leftItems=_shuffle([...pairs]);
  const rightItems=_shuffle([...pairs]);
  const leftEl=$('arv-match-left'), rightEl=$('arv-match-right');
  if(!leftEl||!rightEl) return;
  leftEl.innerHTML=''; rightEl.innerHTML='';
  leftItems.forEach(p=>{
    const b=document.createElement('div');
    b.className='arv-match-item arv-match-left-item';
    b.innerHTML=`<span class="arv-match-lemma">${p.entry.lemma}</span>`;
    b.onclick=()=>_matchLeft(b,p); leftEl.appendChild(b);
  });
  rightItems.forEach(p=>{
    const b=document.createElement('div');
    b.className='arv-match-item arv-match-right-item';
    b.innerHTML=`<span class="arv-match-form">${p.asked.f}</span><span class="arv-match-tense">${p.asked.l}</span>`;
    b.onclick=()=>_matchRight(b,p); rightEl.appendChild(b);
  });
  const hdr=$('arv-match-rnd');
  if(hdr) hdr.textContent=`Αντιστοίχηση — ${pairs.length} ζεύγη`;
}
function _matchLeft(el,p){
  if(el.classList.contains('arv-match-done')) return;
  document.querySelectorAll('.arv-match-left-item.arv-match-sel').forEach(b=>b.classList.remove('arv-match-sel'));
  el.classList.add('arv-match-sel');
  _matchState.leftSel={el,p};
  if(_matchState.rightSel) _matchCheck();
}
function _matchRight(el,p){
  if(el.classList.contains('arv-match-done')) return;
  document.querySelectorAll('.arv-match-right-item.arv-match-sel').forEach(b=>b.classList.remove('arv-match-sel'));
  el.classList.add('arv-match-sel');
  _matchState.rightSel={el,p};
  if(_matchState.leftSel) _matchCheck();
}
function _matchCheck(){
  const{leftSel,rightSel}=_matchState;
  if(!leftSel||!rightSel) return;
  _matchState.leftSel=null; _matchState.rightSel=null;
  const ok=leftSel.p.id===rightSel.p.id;
  if(ok){
    leftSel.el.classList.remove('arv-match-sel'); leftSel.el.classList.add('arv-match-done','arv-match-ok');
    rightSel.el.classList.remove('arv-match-sel'); rightSel.el.classList.add('arv-match-done','arv-match-ok');
    _state.score++; _matchState.matched++; _hud();
    if(_matchState.matched>=_matchState.total) _state.pendingTO=setTimeout(_matchNextRound,700);
  } else {
    leftSel.el.classList.add('arv-match-err'); rightSel.el.classList.add('arv-match-err');
    _state.mistakes.push({lemma:leftSel.p.entry.lemma,askLabel:rightSel.p.asked.l,typed:rightSel.p.asked.f,correct:leftSel.p.asked.f});
    if(_state.livesLeft!==Infinity){_state.livesLeft--;_hud();if(_state.livesLeft<=0){_state.pendingTO=setTimeout(_end,1200);return;}}
    setTimeout(()=>{
      leftSel.el.classList.remove('arv-match-sel','arv-match-err');
      rightSel.el.classList.remove('arv-match-sel','arv-match-err');
    },700);
  }
}

// ── ALL FORMS MODE ────────────────────────────────────────────
let _allSubmitted=false;
let _allHintData=[];

function _allNextVerb(){
  _allSubmitted=false;
  let entry;
  for(let a=0;a<10;a++){const c=_rand(_state.pool);if(a<9&&c.id===_state.lastId)continue;entry=c;break;}
  _state.lastId=entry.id;
  const toFill=entry.forms.filter(f=>!(f.v==='active'&&f.t==='present'));
  _state.currAll={entry,toFill};
  const container=$('arv-all-container'); if(!container) return;
  container.innerHTML=`
    <div class="arv-all-header">
      <span class="arv-q-lemma">${entry.lemma}</span>
      ${entry.meaning?`<span class="arv-q-meaning"> (${entry.meaning})</span>`:''}
    </div>
    <div class="arv-all-table">
      ${toFill.map((_f,i)=>`
        <div class="arv-all-row arv-chrono-row" data-idx="${i}">
          <span class="arv-chrono-row-label">${_tenseLabel(_f)}</span>
          <div class="arv-chrono-inp-row">
            <input class="arv-all-inp arv-fi-inp" data-idx="${i}"
              autocomplete="off" autocorrect="off" spellcheck="false"
              placeholder="γράψε τον τύπο…">
            <button class="arv-row-hint-btn" id="arv-ahb-${i}" onclick="ARV.allHint(${i})">? Βοήθεια</button>
          </div>
          <div class="arv-row-hint-panel" id="arv-ahp-${i}"></div>
        </div>`).join('')}
    </div>
    <button class="arv-btn-gold arv-all-submit" id="arv-all-submit-btn">Υποβολή →</button>`;
  _allHintData=toFill.map((f,i)=>{
    const firstForm=_splitForms(f.f)[0];
    const stemLen=Math.max(3,Math.ceil(firstForm.length*0.55));
    const stem=firstForm.slice(0,stemLen)+'-';
    const others=toFill.filter((_,j)=>j!==i);
    const pool=others.length?others:entry.forms.filter(ef=>ef!==f);
    const other=pool[Math.floor(Math.random()*pool.length)];
    return{stem,other};
  });
  container.querySelectorAll('.arv-all-inp').forEach((inp,i)=>{
    inp.addEventListener('focus',()=>{ _kbLastInput=inp; });
    inp.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        const next=container.querySelector(`.arv-all-inp[data-idx="${i+1}"]`);
        if(next) next.focus(); else _allSubmit();
      }
    });
  });
  $('arv-all-submit-btn').onclick=_allSubmit;
  setTimeout(()=>container.querySelector('.arv-all-inp')?.focus(),80);
}
function _allSubmit(){
  if(_allSubmitted) return; _allSubmitted=true;
  const{entry,toFill}=_state.currAll;
  let correct=0;
  const container=$('arv-all-container');
  container.querySelectorAll('.arv-row-hint-btn').forEach(b=>b.style.display='none');
  container.querySelectorAll('.arv-row-hint-panel').forEach(p=>{p.innerHTML='';p.classList.remove('arv-rhp-open');});
  container.querySelectorAll('.arv-all-inp').forEach((inp,i)=>{
    inp.disabled=true;
    const typed=inp.value.trim();
    const forms=_splitForms(toFill[i].f);
    const ok=forms.some(f=>f===typed);
    if(ok){ correct++; inp.classList.add('arv-fi-ok');
      if(forms.length>1){
        const row=inp.closest('.arv-all-row');
        if(row){const hint=document.createElement('div');hint.className='arv-all-hint';hint.innerHTML=`<span style="color:#5dca8a">✓</span> <span class="arv-fb-alts">Επίσης: ${forms.filter(f=>f!==typed).join(', ')}</span>`;row.appendChild(hint);}
      }
    } else {
      inp.classList.add('arv-fi-err');
      const row=inp.closest('.arv-all-row');
      if(row){
        const disp=forms.length>1?forms.join(' / '):forms[0];
        const hint=document.createElement('div'); hint.className='arv-all-hint';
        hint.innerHTML=`<span style="color:#e67e6a">${typed||'—'}</span> → <span style="color:#5dca8a">${disp}</span>`;
        row.appendChild(hint);
      }
      _state.mistakes.push({lemma:entry.lemma,askLabel:toFill[i].l,typed,correct:forms.join(' / ')});
      if(typeof logStudentMistake==='function') logStudentMistake('arv','anwmala-rimata',_state.mode,{q:`${entry.lemma} — ${toFill[i].l}`,a:forms[0]},typed||'—');
    }
  });
  _state.score+=correct;
  if(_state.livesLeft!==Infinity&&correct<toFill.length)
    _state.livesLeft=Math.max(0,_state.livesLeft-(toFill.length-correct));
  _hud();
  const btn=$('arv-all-submit-btn');
  if(btn){ btn.textContent=`Επόμενο ρήμα → (${correct}/${toFill.length} σωστά)`; btn.onclick=()=>{ if(_state.livesLeft<=0){_end();return;} _allNextVerb(); }; }
  if(_state.livesLeft<=0) _state.pendingTO=setTimeout(_end,1800);
}

// ── CHRONO MODE (Χρονική Αντικατάσταση) ─────────────────────
let _chronoSubmitted=false;
let _chronoHintData=[];

function _chronoNextVerb(){
  _chronoSubmitted=false;
  let entry;
  for(let a=0;a<10;a++){const c=_rand(_state.pool);if(a<9&&c.id===_state.lastId)continue;entry=c;break;}
  _state.lastId=entry.id;
  // Pick one random form as the "given" clue
  const givenIdx=Math.floor(Math.random()*entry.forms.length);
  const given=entry.forms[givenIdx];
  // Sort all forms by standard tense order for the table
  const sortedForms=_sortForms(entry.forms);
  const toFill=sortedForms.filter(f=>f!==given);
  _state.currChrono={entry,given,toFill};
  const container=$('arv-chrono-container'); if(!container) return;
  let fillIdx=0;
  const rowsHTML=sortedForms.map(f=>{
    if(f===given){
      return `<div class="arv-all-row arv-chrono-row arv-chrono-given-row">
        <span class="arv-chrono-row-label">${_tenseLabel(f)}</span>
        <span class="arv-chrono-row-given">${_splitForms(f.f).join(' / ')}</span>
      </div>`;
    } else {
      const idx=fillIdx++;
      return `<div class="arv-all-row arv-chrono-row" data-idx="${idx}">
        <span class="arv-chrono-row-label">${_tenseLabel(f)}</span>
        <div class="arv-chrono-inp-row">
          <input class="arv-all-inp arv-fi-inp" data-idx="${idx}"
            autocomplete="off" autocorrect="off" spellcheck="false"
            placeholder="γράψε τον τύπο…">
          <button class="arv-row-hint-btn" id="arv-rhb-${idx}" onclick="ARV.chronoHint(${idx})">? Βοήθεια</button>
        </div>
        <div class="arv-row-hint-panel" id="arv-rhp-${idx}"></div>
      </div>`;
    }
  }).join('');
  container.innerHTML=`
    <div class="arv-all-header">
      <span class="arv-q-lemma">${entry.lemma}</span>
      ${entry.meaning?`<span class="arv-q-meaning"> (${entry.meaning})</span>`:''}
    </div>
    <div class="arv-all-table">${rowsHTML}</div>
    <button class="arv-btn-gold arv-all-submit" id="arv-chrono-submit-btn">Υποβολή →</button>`;
  // Pre-compute hint data for each toFill entry (in sorted order)
  _chronoHintData=toFill.map(f=>{
    const firstForm=_splitForms(f.f)[0];
    const stemLen=Math.max(3,Math.ceil(firstForm.length*0.55));
    const stem=firstForm.slice(0,stemLen)+'-';
    const others=entry.forms.filter(ef=>ef!==f);
    const pool=(others.filter(ef=>ef!==given).length?others.filter(ef=>ef!==given):others);
    const other=pool[Math.floor(Math.random()*pool.length)];
    return{stem,label:f.l,other};
  });
  container.querySelectorAll('.arv-all-inp').forEach((inp,i)=>{
    inp.addEventListener('focus',()=>{ _kbLastInput=inp; });
    inp.addEventListener('keydown',e=>{
      if(e.key==='Enter'){
        const next=container.querySelector(`.arv-all-inp[data-idx="${i+1}"]`);
        if(next) next.focus(); else _chronoSubmit();
      }
    });
  });
  $('arv-chrono-submit-btn').onclick=_chronoSubmit;
  setTimeout(()=>container.querySelector('.arv-all-inp')?.focus(),80);
}
function _chronoSubmit(){
  if(_chronoSubmitted) return; _chronoSubmitted=true;
  const{entry,toFill}=_state.currChrono;
  let correct=0;
  const container=$('arv-chrono-container');
  // Hide hint buttons and panels before showing results
  container.querySelectorAll('.arv-row-hint-btn').forEach(b=>b.style.display='none');
  container.querySelectorAll('.arv-row-hint-panel').forEach(p=>{p.innerHTML='';p.classList.remove('arv-rhp-open');});
  container.querySelectorAll('.arv-all-inp').forEach((inp,i)=>{
    inp.disabled=true;
    const typed=inp.value.trim();
    const forms=_splitForms(toFill[i].f);
    const ok=forms.some(f=>f===typed);
    if(ok){ correct++; inp.classList.add('arv-fi-ok');
      if(forms.length>1){
        const row=inp.closest('.arv-all-row');
        if(row){const hint=document.createElement('div');hint.className='arv-all-hint';hint.innerHTML=`<span style="color:#5dca8a">✓</span> <span class="arv-fb-alts">Επίσης: ${forms.filter(f=>f!==typed).join(', ')}</span>`;row.appendChild(hint);}
      }
    } else {
      inp.classList.add('arv-fi-err');
      const row=inp.closest('.arv-all-row');
      if(row){
        const disp=forms.length>1?forms.join(' / '):forms[0];
        const hint=document.createElement('div'); hint.className='arv-all-hint';
        hint.innerHTML=`<span style="color:#e67e6a">${typed||'—'}</span> → <span style="color:#5dca8a">${disp}</span>`;
        row.appendChild(hint);
      }
      _state.mistakes.push({lemma:entry.lemma,askLabel:toFill[i].l,typed,correct:forms.join(' / ')});
      if(typeof logStudentMistake==='function') logStudentMistake('arv','anwmala-rimata',_state.mode,{q:`${entry.lemma} — ${toFill[i].l}`,a:forms[0]},typed||'—');
    }
  });
  _state.score+=correct;
  if(_state.livesLeft!==Infinity&&correct<toFill.length)
    _state.livesLeft=Math.max(0,_state.livesLeft-(toFill.length-correct));
  _hud();
  const btn=$('arv-chrono-submit-btn');
  if(btn){ btn.textContent=`Επόμενο ρήμα → (${correct}/${toFill.length} σωστά)`; btn.onclick=()=>{ if(_state.livesLeft<=0){_end();return;} _chronoNextVerb(); }; }
  if(_state.livesLeft<=0) _state.pendingTO=setTimeout(_end,1800);
}

// ── Filter info ───────────────────────────────────────────────
function _updateFilterInfo(){
  const cnt=_pool().length;
  const el=$('arv-filter-count'); if(el) el.textContent=cnt+' ρήματα';
  const btn=$('arv-continue-btn'); if(btn) btn.disabled=cnt===0;
  const badge=$('arv-custom-sel-badge');
  if(badge){
    if(_selectedIds.size>0){
      const n=_selectedIds.size;
      badge.innerHTML=`📌 <strong>${n} ${n===1?'ρήμα επιλεγμένο':'ρήματα επιλεγμένα'}</strong> <span class="arv-badge-note">— φίλτρα αγνοούνται</span>`;
      badge.style.display='';
    } else {
      badge.style.display='none';
    }
  }
}
function _updateVerbSelCount(){
  const el=$('arv-vp-sel-count'); if(!el) return;
  const n=_selectedIds.size;
  el.textContent=n===0?'Κανένα επιλεγμένο':n===1?'1 ρήμα επιλεγμένο':`${n} ρήματα επιλεγμένα`;
}
function _buildVerbList(filter=''){
  const list=$('arv-vp-list'); if(!list) return;
  const fNorm=filter?_stripDia(filter.toLowerCase().trim()):'';
  const groups={}, letterOrder=[];
  for(const e of ARV_DB){
    if(fNorm){
      const ln=_stripDia(e.lemma.toLowerCase());
      const mn=_stripDia((e.meaning||'').toLowerCase());
      if(!ln.includes(fNorm)&&!mn.includes(fNorm)) continue;
    }
    if(!groups[e.letter]){groups[e.letter]=[];letterOrder.push(e.letter);}
    groups[e.letter].push(e);
  }
  if(!letterOrder.length){list.innerHTML='<div class="arv-vp-empty">Δεν βρέθηκαν ρήματα</div>';return;}
  const diffCol={beginner:'#27ae60',intermediate:'#f39c12',advanced:'#e74c3c'};
  let html='';
  for(const letter of letterOrder){
    html+=`<div class="arv-vp-group" id="arv-vp-grp-${letter}">`;
    html+=`<div class="arv-vp-letter-hdr">${letter}</div>`;
    for(const e of groups[letter]){
      const chk=_selectedIds.has(e.id);
      const dc=diffCol[e.diff]||'#7a6030';
      html+=`<label class="arv-vp-verb-row${chk?' arv-vp-selected':''}"><input type="checkbox" class="arv-vp-cb" data-id="${e.id}"${chk?' checked':''} onchange="ARV.toggleVerb('${e.id}',this.checked)"><span class="arv-vp-lemma">${e.lemma}</span>${e.meaning?`<span class="arv-vp-meaning">${e.meaning}</span>`:''}<span class="arv-vp-diff-dot" style="color:${dc}" title="${e.diff}">●</span></label>`;
    }
    html+='</div>';
  }
  list.innerHTML=html;
}
function _buildJumpBar(){
  const jump=$('arv-vp-jump'); if(!jump) return;
  const letters=[...new Set(ARV_DB.map(e=>e.letter))];
  jump.innerHTML=letters.map(l=>`<button class="arv-vp-jump-btn" onclick="ARV.jumpToLetter('${l}')">${l}</button>`).join('');
}

// ── Build HTML ────────────────────────────────────────────────
function _build(){
  const wrap=$('arv-wrap');
  const lc=_letterCounts();
  const dc={all:ARV_DB.length,beginner:0,intermediate:0,advanced:0};
  for(const e of ARV_DB) dc[e.diff]=(dc[e.diff]||0)+1;
  const letters=['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω'];
  const letterGrid=letters.map(l=>{
    const n=lc[l]||0; if(!n) return '';
    return `<button class="arv-letter-btn" data-l="${l}" onclick="ARV.toggleLetter('${l}',this)">${l}<span class="arv-letter-cnt">${n}</span></button>`;
  }).join('');

  wrap.innerHTML=`
<!-- LEVELS / FILTER SCREEN -->
<div id="arv-screen-levels" class="arv-screen active">
  <div class="arv-card arv-card-scroll">
    <h1>Ανώμαλα Ρήματα</h1>
    <p class="arv-sub">Αρχαία Ελληνικά — Αρχικοί Χρόνοι</p>
    <hr class="arv-hr">

    <h3>Αρχικό Γράμμα <span class="arv-filter-hint">(κλικ για επιλογή/αποεπιλογή — επίλεξε πολλά)</span></h3>
    <div class="arv-letter-grid">
      ${letterGrid}
    </div>
    <div style="margin-top:8px;">
      <button class="arv-letter-btn arv-letter-all arv-letter-on" id="arv-all-letters-btn" onclick="ARV.selectAll(this)">Όλα τα Ανώμαλα Ρήματα</button>
    </div>

    <hr class="arv-hr">
    <h3>Δυσκολία</h3>
    <div class="arv-diff-row">
      <button class="arv-diff-btn arv-green arv-diff-on" data-d="all" onclick="ARV.selectDiff('all',this)">Όλα<span class="arv-diff-sub">${dc.all}</span></button>
      <button class="arv-diff-btn arv-green2" data-d="beginner" onclick="ARV.selectDiff('beginner',this)">Αρχάριοι<span class="arv-diff-sub">${dc.beginner}</span></button>
      <button class="arv-diff-btn arv-yellow" data-d="intermediate" onclick="ARV.selectDiff('intermediate',this)">Μέσοι<span class="arv-diff-sub">${dc.intermediate}</span></button>
      <button class="arv-diff-btn arv-red" data-d="advanced" onclick="ARV.selectDiff('advanced',this)">Προχ.<span class="arv-diff-sub">${dc.advanced}</span></button>
    </div>

    <div class="arv-filter-info">
      Επιλεγμένα: <strong id="arv-filter-count">${ARV_DB.length} ρήματα</strong>
    </div>
    <div id="arv-custom-sel-badge" class="arv-custom-sel-badge" style="display:none;"></div>
    <button class="arv-verb-sel-btn" onclick="ARV.openVerbPicker()">📌 Επιλογή Ρημάτων</button>
    <button class="arv-btn-gold" id="arv-continue-btn" onclick="ARV.goSettings()">Συνέχεια →</button>
  </div>
</div>

<!-- VERB PICKER -->
<div id="arv-screen-verbs" class="arv-screen">
  <div class="arv-card arv-vp-card">
    <div class="arv-vp-header">
      <button class="arv-back-link" onclick="ARV.backFromVerbPicker()">← Επιστροφή</button>
      <h2>Επιλογή Ρημάτων</h2>
      <input type="text" class="arv-vp-search" id="arv-vp-search"
        autocomplete="off" autocorrect="off" spellcheck="false"
        placeholder="Αναζήτηση ρήματος…"
        oninput="ARV.filterVerbList(this.value)">
      <div class="arv-vp-jump" id="arv-vp-jump"></div>
      <div class="arv-vp-toolbar">
        <button class="arv-vp-act-btn" onclick="ARV.selectAllVerbs()">Επιλογή Όλων</button>
        <button class="arv-vp-act-btn arv-vp-act-none" onclick="ARV.deselectAllVerbs()">Αποεπιλογή Όλων</button>
      </div>
    </div>
    <div class="arv-vp-list" id="arv-vp-list"></div>
    <div class="arv-vp-footer">
      <span class="arv-vp-sel-count" id="arv-vp-sel-count">Κανένα επιλεγμένο</span>
      <div class="arv-vp-footer-btns">
        <button class="arv-btn-ghost" onclick="ARV.clearVerbSelection()">Καθαρισμός</button>
        <button class="arv-btn-gold arv-vp-confirm-btn" onclick="ARV.confirmVerbSelection()">Συνέχεια →</button>
      </div>
    </div>
  </div>
</div>

<!-- SETTINGS -->
<div id="arv-screen-settings" class="arv-screen">
  <div class="arv-card arv-card-scroll">
    <button class="arv-back-link" onclick="ARV.back()">← Επιστροφή</button>
    <h2 id="arv-sett-title">Ρυθμίσεις</h2>
    <hr class="arv-hr">
    <h3>Τρόπος Παιχνιδιού</h3>
    <div class="arv-mode-grid">
      <div class="arv-mode arv-mode-sel" data-mode="mc" onclick="ARV.setMode('mc',this)">
        <span class="arv-mi">🔲</span><span>Πολλαπλή Επιλογή</span>
        <span class="arv-mh">Δίνεται τύπος → βρες άλλο χρόνο</span>
      </div>
      <div class="arv-mode" data-mode="mc_letter" onclick="ARV.setMode('mc_letter',this)">
        <span class="arv-mi">🔠</span><span>ΠΕ — Ίδιο Γράμμα</span>
        <span class="arv-mh">Επιλογές από ρήματα ίδιου αρχικού γράμματος</span>
      </div>
      <div class="arv-mode" data-mode="fi" onclick="ARV.setMode('fi',this)">
        <span class="arv-mi">✏️</span><span>Συμπλήρωση Κενού</span>
        <span class="arv-mh">Ενεστώτας → γράψε άλλο χρόνο</span>
      </div>
      <div class="arv-mode" data-mode="ft" onclick="ARV.setMode('ft',this)">
        <span class="arv-mi">🔍</span><span>Ζητούμενος Τύπος</span>
        <span class="arv-mh">Ενεστώτας ίδιας φωνής → γράψε άλλο χρόνο</span>
      </div>
      <div class="arv-mode" data-mode="ft_any" onclick="ARV.setMode('ft_any',this)">
        <span class="arv-mi">🎲</span><span>Τυχαίος Τύπος</span>
        <span class="arv-mh">Τυχαίος χρόνος → γράψε άλλον τύπο</span>
      </div>
      <div class="arv-mode" data-mode="match" onclick="ARV.setMode('match',this)">
        <span class="arv-mi">🔗</span><span>Αντιστοίχηση</span>
        <span class="arv-mh">Ταίριαξε ρήμα με αρχικό χρόνο</span>
      </div>
      <div class="arv-mode" data-mode="all" onclick="ARV.setMode('all',this)">
        <span class="arv-mi">📋</span><span>Όλοι οι Χρόνοι</span>
        <span class="arv-mh">Συμπλήρωσε όλους τους αρχικούς χρόνους</span>
      </div>
      <div class="arv-mode" data-mode="chrono" onclick="ARV.setMode('chrono',this)">
        <span class="arv-mi">⏱️</span><span>Χρονική Αντικατάσταση</span>
        <span class="arv-mh">Δίνεται ένας χρόνος → συμπλήρωσε τους υπόλοιπους</span>
      </div>
    </div>
    <div class="arv-sett-row">
      <div class="arv-field"><label>Χρόνος</label>
        <select id="arv-sel-time">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">120 δευτ.</option><option value="180">180 δευτ.</option>
          <option value="0">Απεριόριστο</option>
        </select>
      </div>
      <div class="arv-field"><label>Ζωές</label>
        <select id="arv-sel-lives">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">Απεριόριστο</option>
        </select>
      </div>
    </div>
    <button class="arv-btn-gold" onclick="ARV.launch()">Έναρξη →</button>
  </div>
</div>

<!-- GAME SCREEN (MC · MC-Letter · FI · FT · FT-Any) -->
<div id="arv-screen-game" class="arv-screen">
  <div class="arv-card">
    <div class="arv-hdr">
      <div class="arv-stat"><div class="arv-stat-l">Βαθμός</div><div class="arv-stat-v" id="arv-sv">0</div></div>
      <div class="arv-stat"><div class="arv-stat-l">Χρόνος</div><div class="arv-stat-v" id="arv-tv">—</div></div>
      <div class="arv-stat"><div class="arv-stat-l">Ζωές</div><div class="arv-stat-v" id="arv-lv"></div></div>
      <button class="arv-btn-ghost arv-end-btn" onclick="ARV.endGame()">Τέλος</button>
    </div>
    <div class="arv-qbox" id="arv-q"></div>
    <div id="arv-mc-area"><div class="arv-opts" id="arv-opts"></div></div>
    <div id="arv-fi-area" style="display:none;">
      <input type="text" id="arv-fi-input" class="arv-fi-inp"
        autocomplete="off" autocorrect="off" spellcheck="false" placeholder="γράψε τον τύπο…">
      <button class="arv-fi-submit" id="arv-fi-submit" onclick="ARV.fiSubmit()">Υποβολή ↵</button>
    </div>
    <div class="arv-fb" id="arv-fb"></div>
  </div>
</div>

<!-- MATCH SCREEN -->
<div id="arv-screen-match" class="arv-screen">
  <div class="arv-card arv-card-wide">
    <div class="arv-hdr">
      <div class="arv-stat"><div class="arv-stat-l">Βαθμός</div><div class="arv-stat-v" id="arv-msv">0</div></div>
      <div class="arv-stat"><div class="arv-stat-l">Χρόνος</div><div class="arv-stat-v" id="arv-mtv">—</div></div>
      <div class="arv-stat"><div class="arv-stat-l">Ζωές</div><div class="arv-stat-v" id="arv-mlv"></div></div>
      <button class="arv-btn-ghost arv-end-btn" onclick="ARV.endGame()">Τέλος</button>
    </div>
    <div class="arv-match-hdr" id="arv-match-rnd">Αντιστοίχηση</div>
    <div class="arv-fb" id="arv-fb-match"></div>
    <div class="arv-match-grid">
      <div class="arv-match-col" id="arv-match-left"></div>
      <div class="arv-match-col" id="arv-match-right"></div>
    </div>
  </div>
</div>

<!-- ALL FORMS SCREEN -->
<div id="arv-screen-all" class="arv-screen">
  <div class="arv-card">
    <div class="arv-hdr">
      <div class="arv-stat"><div class="arv-stat-l">Βαθμός</div><div class="arv-stat-v" id="arv-asv">0</div></div>
      <div class="arv-stat"><div class="arv-stat-l">Χρόνος</div><div class="arv-stat-v" id="arv-atv">—</div></div>
      <div class="arv-stat"><div class="arv-stat-l">Ζωές</div><div class="arv-stat-v" id="arv-alv"></div></div>
      <button class="arv-btn-ghost arv-end-btn" onclick="ARV.endGame()">Τέλος</button>
    </div>
    <div id="arv-all-container"></div>
  </div>
</div>

<!-- CHRONO SCREEN (Χρονική Αντικατάσταση) -->
<div id="arv-screen-chrono" class="arv-screen">
  <div class="arv-card">
    <div class="arv-hdr">
      <div class="arv-stat"><div class="arv-stat-l">Βαθμός</div><div class="arv-stat-v" id="arv-csv">0</div></div>
      <div class="arv-stat"><div class="arv-stat-l">Χρόνος</div><div class="arv-stat-v" id="arv-ctv">—</div></div>
      <div class="arv-stat"><div class="arv-stat-l">Ζωές</div><div class="arv-stat-v" id="arv-clv"></div></div>
      <button class="arv-btn-ghost arv-end-btn" onclick="ARV.endGame()">Τέλος</button>
    </div>
    <div id="arv-chrono-container"></div>
  </div>
</div>

<!-- SHARED POLYTONIC KEYBOARD -->
<div id="arv-kb-wrap" style="display:none;position:sticky;bottom:0;background:#0e0c0a;padding:6px 20px 10px;border-top:1px solid #3d3020;">
  <div class="arv-poly-kb">
    <button class="arv-poly-toggle" id="arv-poly-toggle" onclick="ARV.kbToggle()">
      Πολυτονικό Πληκτρολόγιο <span class="arv-poly-arrow">▼</span>
    </button>
    <div class="arv-poly-body" id="arv-poly-body">
      <div class="arv-diac-row" id="arv-diac-row"></div>
      <div id="arv-vowel-rows"></div>
    </div>
  </div>
</div>

<!-- END SCREEN -->
<div id="arv-screen-end" class="arv-screen">
  <div class="arv-card" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="arv-big-score" id="arv-es">0</div>
    <div style="color:#8a7a60;margin-bottom:16px;text-align:center;">Τελική βαθμολογία</div>
    <hr class="arv-hr">
    <div id="arv-mistakes-log"></div>
    <hr class="arv-hr">
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
      <button class="arv-btn-gold" onclick="ARV.retry()">Δοκιμάστε Ξανά</button>
      <button class="arv-btn-ghost" onclick="ARV.back()">Αρχική</button>
    </div>
  </div>
</div>`;
}

// ── Public API ────────────────────────────────────────────────
let _diff='all', _letters=[], _mode='mc', _selectedIds=new Set();

return {
  open(){
    document.getElementById('arv-overlay').classList.add('active');
    document.body.style.overflow='hidden';
    if(!document.getElementById('arv-screen-levels')){ _build(); _updateFilterInfo(); }
    _show('arv-screen-levels');
  },
  close(){
    clearInterval(_state.timerInterval);
    if(_state.pendingTO) clearTimeout(_state.pendingTO);
    _state.timerInterval=null; _state.pendingTO=null;
    document.getElementById('arv-overlay').classList.remove('active');
    document.body.style.overflow='';
    _show('arv-screen-levels');
  },
  goLevels(){
    clearInterval(_state.timerInterval);
    if(_state.pendingTO) clearTimeout(_state.pendingTO);
    _state.timerInterval=null; _state.pendingTO=null;
    if(document.getElementById('arv-screen-levels')) _show('arv-screen-levels');
  },
  toggleLetter(l, el){
    const idx=_letters.indexOf(l);
    if(idx>=0){ _letters.splice(idx,1); el.classList.remove('arv-letter-on'); }
    else{ _letters.push(l); el.classList.add('arv-letter-on'); }
    const allBtn=document.getElementById('arv-all-letters-btn');
    if(allBtn) allBtn.classList.toggle('arv-letter-on', _letters.length===0);
    _updateFilterInfo();
  },
  selectAll(el){
    _letters=[];
    document.querySelectorAll('.arv-letter-btn:not(#arv-all-letters-btn)').forEach(b=>b.classList.remove('arv-letter-on'));
    el.classList.add('arv-letter-on');
    _updateFilterInfo();
  },
  selectDiff(d, el){
    _diff=d;
    document.querySelectorAll('.arv-diff-btn').forEach(b=>b.classList.remove('arv-diff-on'));
    el.classList.add('arv-diff-on');
    _updateFilterInfo();
  },
  goSettings(){
    let titleStr;
    if(_selectedIds.size>0){
      titleStr=`📌 ${_selectedIds.size} επιλεγμένα ρήματα`;
    } else {
      const letterPart=_letters.length===0?'Όλα τα γράμματα':'Γράμματα: '+_letters.join(', ');
      const diffLbl={beginner:'Αρχάριοι',intermediate:'Μέσοι',advanced:'Προχωρημένοι',all:'Όλα'};
      titleStr=`${letterPart} · ${diffLbl[_diff]||_diff}`;
    }
    const t=$('arv-sett-title'); if(t) t.textContent=titleStr;
    _show('arv-screen-settings');
  },
  back(){
    clearInterval(_state.timerInterval);
    if(_state.pendingTO) clearTimeout(_state.pendingTO);
    _state.timerInterval=null; _state.pendingTO=null;
    _show('arv-screen-levels');
  },
  setMode(m,el){
    _mode=m;
    document.querySelectorAll('.arv-mode').forEach(b=>b.classList.remove('arv-mode-sel'));
    el.classList.add('arv-mode-sel');
  },
  launch(){
    const time=parseInt($('arv-sel-time')?.value||'90');
    const lives=parseInt($('arv-sel-lives')?.value||'3');
    _initState(_mode,time,lives);
    if(!_state.pool.length){alert('Δεν βρέθηκαν ρήματα για αυτό το επίπεδο.');return;}
    ['arv-tv','arv-mtv','arv-atv','arv-ctv'].forEach(id=>{const el=$(id);if(el){el.textContent=time===0?'∞':_gramFmtSec(time);el.classList.remove('arv-warn','arv-caut');}});
    _hud();
    const kbWrap=$('arv-kb-wrap');
    if(_mode==='mc'||_mode==='mc_letter'){
      $('arv-mc-area').style.display='';
      $('arv-fi-area').style.display='none';
      if(kbWrap) kbWrap.style.display='none';
      _show('arv-screen-game');
      _startTimer(); _mcNextQ();
    } else if(_mode==='fi'||_mode==='ft'||_mode==='ft_any'){
      $('arv-mc-area').style.display='none';
      $('arv-fi-area').style.display='';
      if(kbWrap) kbWrap.style.display='';
      _show('arv-screen-game');
      _buildKB();
      const inp=$('arv-fi-input');
      if(inp){ inp.addEventListener('focus',()=>{_kbLastInput=inp;}); inp.onkeydown=e=>{if(e.key==='Enter')_fiSubmit();}; }
      _startTimer(); _fiNextQ();
    } else if(_mode==='match'){
      if(kbWrap) kbWrap.style.display='none';
      _show('arv-screen-match');
      _startTimer(); _matchNextRound();
    } else if(_mode==='all'){
      if(kbWrap) kbWrap.style.display='';
      _show('arv-screen-all');
      _buildKB();
      _startTimer(); _allNextVerb();
    } else if(_mode==='chrono'){
      if(kbWrap) kbWrap.style.display='';
      _show('arv-screen-chrono');
      _buildKB();
      _startTimer(); _chronoNextVerb();
    }
  },
  endGame(){ _end(); },
  retry(){
    clearInterval(_state.timerInterval);
    if(_state.pendingTO) clearTimeout(_state.pendingTO);
    _show('arv-screen-settings');
  },
  fiSubmit(){ _fiSubmit(); },
  kbToggle(){ _kbTogglePanel(); },
  chronoHint(idx){
    const panel=$(`arv-rhp-${idx}`); if(!panel) return;
    const d=_chronoHintData[idx]; if(!d) return;
    if(panel.classList.contains('arv-rhp-open')){
      panel.classList.remove('arv-rhp-open'); panel.innerHTML=''; return;
    }
    panel.innerHTML=`<div class="arv-row-hint-choices">
      <button class="arv-row-hint-choice" onclick="ARV.chronoHintReveal(${idx},'stem')">Θέμα</button>
      <button class="arv-row-hint-choice" onclick="ARV.chronoHintReveal(${idx},'other')">Άλλος Τύπος</button>
    </div>`;
    panel.classList.add('arv-rhp-open');
  },
  chronoHintReveal(idx,type){
    const panel=$(`arv-rhp-${idx}`); if(!panel) return;
    const d=_chronoHintData[idx]; if(!d) return;
    let html;
    if(type==='stem'){
      html=`<div class="arv-row-hint-text">${d.stem}</div>`;
    } else {
      html=`<div class="arv-row-hint-text">
        <span style="font-size:.73rem;color:#8a7a60;font-family:'Cinzel',serif;text-transform:uppercase;letter-spacing:.07em;">${d.other.l}</span>
        <span style="margin:0 8px;color:#5a4a2a;">→</span>
        <span style="color:#e8c87a;">${d.other.f.split('-')[0].trim()}</span>
      </div>`;
    }
    panel.innerHTML=html;
    panel.classList.add('arv-rhp-open');
  },
  allHint(idx){
    const panel=$(`arv-ahp-${idx}`); if(!panel) return;
    const d=_allHintData[idx]; if(!d) return;
    if(panel.classList.contains('arv-rhp-open')){
      panel.classList.remove('arv-rhp-open'); panel.innerHTML=''; return;
    }
    panel.innerHTML=`<div class="arv-row-hint-choices">
      <button class="arv-row-hint-choice" onclick="ARV.allHintReveal(${idx},'stem')">Θέμα</button>
      <button class="arv-row-hint-choice" onclick="ARV.allHintReveal(${idx},'other')">Άλλος Τύπος</button>
    </div>`;
    panel.classList.add('arv-rhp-open');
  },
  allHintReveal(idx,type){
    const panel=$(`arv-ahp-${idx}`); if(!panel) return;
    const d=_allHintData[idx]; if(!d) return;
    let html;
    if(type==='stem'){
      html=`<div class="arv-row-hint-text">${d.stem}</div>`;
    } else {
      html=`<div class="arv-row-hint-text">
        <span style="font-size:.73rem;color:#8a7a60;font-family:'Cinzel',serif;text-transform:uppercase;letter-spacing:.07em;">${d.other.l}</span>
        <span style="margin:0 8px;color:#5a4a2a;">→</span>
        <span style="color:#e8c87a;">${d.other.f.split('-')[0].trim()}</span>
      </div>`;
    }
    panel.innerHTML=html;
    panel.classList.add('arv-rhp-open');
  },
  openVerbPicker(){
    if(!$('arv-screen-verbs')) return;
    _buildJumpBar();
    _buildVerbList($('arv-vp-search')?.value||'');
    _updateVerbSelCount();
    _show('arv-screen-verbs');
    setTimeout(()=>$('arv-vp-search')?.focus(),80);
  },
  backFromVerbPicker(){
    _updateFilterInfo();
    _show('arv-screen-levels');
  },
  confirmVerbSelection(){
    _updateFilterInfo();
    _show('arv-screen-levels');
  },
  clearVerbSelection(){
    _selectedIds.clear();
    _buildVerbList($('arv-vp-search')?.value||'');
    _updateVerbSelCount();
    _updateFilterInfo();
  },
  toggleVerb(id,checked){
    if(checked) _selectedIds.add(id); else _selectedIds.delete(id);
    const row=document.querySelector(`.arv-vp-cb[data-id="${id}"]`)?.closest('.arv-vp-verb-row');
    if(row) row.classList.toggle('arv-vp-selected',checked);
    _updateVerbSelCount();
    _updateFilterInfo();
  },
  selectAllVerbs(){
    document.querySelectorAll('#arv-vp-list .arv-vp-cb').forEach(cb=>{
      _selectedIds.add(cb.dataset.id);
      cb.checked=true;
      cb.closest('.arv-vp-verb-row')?.classList.add('arv-vp-selected');
    });
    _updateVerbSelCount();
    _updateFilterInfo();
  },
  deselectAllVerbs(){
    document.querySelectorAll('#arv-vp-list .arv-vp-cb').forEach(cb=>{
      _selectedIds.delete(cb.dataset.id);
      cb.checked=false;
      cb.closest('.arv-vp-verb-row')?.classList.remove('arv-vp-selected');
    });
    _updateVerbSelCount();
    _updateFilterInfo();
  },
  filterVerbList(q){ _buildVerbList(q); },
  jumpToLetter(l){
    const grp=$('arv-vp-grp-'+l);
    const list=$('arv-vp-list');
    if(!grp||!list) return;
    list.scrollTop=grp.offsetTop-list.offsetTop;
  },
  helpToggle(){
    const opts=$('arv-help-options'); if(!opts) return;
    const visible=getComputedStyle(opts).display!=='none';
    opts.style.display=visible?'none':'flex';
  },
  helpReveal(type){
    const q=_state.curr; if(!q) return;
    const{entry,given,asked}=q;
    const opts=$('arv-help-options');
    const result=$('arv-help-result');
    const btn=$('arv-help-btn');
    if(opts) opts.style.display='none';
    if(btn) btn.style.display='none';
    if(!result) return;
    if(type==='stem'){
      // Show first ~55% of the asked form as a stem hint
      const firstForm=_splitForms(asked.f)[0];
      const stemLen=Math.max(3,Math.ceil(firstForm.length*0.55));
      result.innerHTML=firstForm.slice(0,stemLen)+'-';
    } else {
      // Show the label + form of a random other tense (not given, not asked)
      const others=entry.forms.filter(f=>f!==given&&f!==asked);
      const pool=others.length?others:entry.forms.filter(f=>f!==asked);
      const other=pool[Math.floor(Math.random()*pool.length)];
      result.innerHTML=`<span style="font-size:.75rem;color:#8a7a60;font-family:'Cinzel',serif;text-transform:uppercase;letter-spacing:.07em;">${other.l}</span><span style="margin:0 8px;color:#5a4a2a;">→</span><span>${_splitForms(other.f)[0]}</span>`;
    }
    result.style.display='';
  },
};
})();

function openAnwmalaRimata(){ ARV.open(); }
function closeAnwmalaRimata(){ ARV.close(); }
