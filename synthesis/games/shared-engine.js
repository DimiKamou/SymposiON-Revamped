// ============================================================
//  SHARED GRAMMAR GAME ENGINE
//  Χρησιμοποιείται από: Αφωνόληκτα, Αόριστος Β΄, Ρήματα -μι, Ουσιαστικά
//
//  Κάθε παιχνίδι ορίζει:
//    openXxx() / closeXxx()   — overlay control
//    xxxBuild()               — inject HTML into wrap div
//    xxx_G, xxxKeys(), xxxGetStem(), xxxBuildQText()  — data interface
//    xxx_LEVELS               — level definitions
//    xxx_VERBS / xxx_DB       — verb/noun list for selector
// ============================================================

// ── Shared timer formatter (MM:SS when ≥60s, Xs otherwise) ──
function _gramFmtSec(s) {
  if (s >= 60) return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  return s + 's';
}

// ── POLYTONIC KEYBOARD (shared across all grammar games) ──
const GRAM_COMBO={
  ox:{α:'ά',ε:'έ',η:'ή',ι:'ί',ο:'ό',υ:'ύ',ω:'ώ',Α:'Ά',Ε:'Έ',Η:'Ή',Ι:'Ί',Ο:'Ό',Υ:'Ύ',Ω:'Ώ'},
  per:{α:'ᾶ',η:'ῆ',ι:'ῖ',υ:'ῦ',ω:'ῶ'},
  ypogr:{α:'ᾳ',η:'ῃ',ω:'ῳ'},
  ox_yp:{α:'ᾴ',η:'ῄ',ω:'ῴ'},
  per_yp:{α:'ᾷ',η:'ῇ',ω:'ῷ'},
  das:{α:'ἁ',ε:'ἑ',η:'ἡ',ι:'ἱ',ο:'ὁ',υ:'ὑ',ω:'ὡ'},
  psi:{α:'ἀ',ε:'ἐ',η:'ἠ',ι:'ἰ',ο:'ὀ',υ:'ὐ',ω:'ὠ'},
  das_yp:{α:'ᾁ',η:'ᾑ',ω:'ᾡ'},
  psi_yp:{α:'ᾀ',η:'ᾐ',ω:'ᾠ'},
  das_ox:{α:'ἅ',ε:'ἕ',η:'ἥ',ι:'ἵ',ο:'ὅ',υ:'ὕ',ω:'ὥ'},
  das_per:{α:'ἇ',η:'ἧ',ι:'ἷ',υ:'ὗ',ω:'ὧ'},
  das_yp_ox:{α:'ᾅ',η:'ᾕ',ω:'ᾥ'},
  das_yp_per:{α:'ᾇ',η:'ᾗ',ω:'ᾧ'},
  psi_ox:{α:'ἄ',ε:'ἔ',η:'ἤ',ι:'ἴ',ο:'ὄ',υ:'ὔ',ω:'ὤ'},
  psi_per:{α:'ἆ',η:'ἦ',ι:'ἶ',υ:'ὖ',ω:'ὦ'},
  psi_yp_ox:{α:'ᾄ',η:'ᾔ',ω:'ᾤ'},
  psi_yp_per:{α:'ᾆ',η:'ᾖ',ω:'ᾦ'},
};

// Three-part diacritic state per prefix
const _gramTonos={};   // 'ox'|'per'|null
const _gramPneuma={};  // 'psi'|'das'|null
const _gramYpogr={};   // true|false

function gramActiveCombo(prefix){
  const t=_gramTonos[prefix]||null,p=_gramPneuma[prefix]||null,y=!!_gramYpogr[prefix];
  if(!t&&!p&&!y)return null;
  if(p&&t&&y){
    if(p==='das'&&t==='per')return 'das_yp_per';
    if(p==='psi'&&t==='per')return 'psi_yp_per';
    if(p==='das'&&t==='ox')return 'das_yp_ox';
    if(p==='psi'&&t==='ox')return 'psi_yp_ox';
  }
  if(p&&t){
    if(p==='das'&&t==='ox')return 'das_ox';
    if(p==='psi'&&t==='ox')return 'psi_ox';
    if(p==='das'&&t==='per')return 'das_per';
    if(p==='psi'&&t==='per')return 'psi_per';
  }
  if(p&&y){if(p==='das')return 'das_yp';if(p==='psi')return 'psi_yp';}
  if(t&&y){if(t==='per')return 'per_yp';if(t==='ox')return 'ox_yp';}
  if(p)return p;
  if(t)return t;
  return 'ypogr';
}
function gramClearDiacritics(prefix){
  _gramTonos[prefix]=null;_gramPneuma[prefix]=null;_gramYpogr[prefix]=false;
  gramUpdateKBState(prefix);
}
function gramToggleTonos(prefix,id){
  _gramTonos[prefix]=_gramTonos[prefix]===id?null:id;gramUpdateKBState(prefix);
}
function gramTogglePneuma(prefix,id){
  _gramPneuma[prefix]=_gramPneuma[prefix]===id?null:id;gramUpdateKBState(prefix);
}
function gramToggleYpogr(prefix){
  _gramYpogr[prefix]=!_gramYpogr[prefix];gramUpdateKBState(prefix);
}
function gramUpdateKBState(prefix){
  const t=_gramTonos[prefix],p=_gramPneuma[prefix],y=!!_gramYpogr[prefix];
  ['ox','per'].forEach(id=>document.getElementById(`${prefix}-dkey-${id}`)?.classList.toggle('ldkey-active',t===id));
  ['psi','das'].forEach(id=>document.getElementById(`${prefix}-dkey-${id}`)?.classList.toggle('ldkey-active',p===id));
  document.getElementById(`${prefix}-dkey-ypogr`)?.classList.toggle('ldkey-active',y);
  gramRenderVowels(prefix);
}

// Latin-key → Greek vowel map for reactive physical keyboard input
const GRAM_VOWEL_KEYS={a:'α',e:'ε',h:'η',i:'ι',o:'ο',u:'υ',v:'ω',y:'υ',
                        α:'α',ε:'ε',η:'η',ι:'ι',ο:'ο',υ:'υ',ω:'ω'};
function gramReactiveKey(prefix,e){
  const combo=gramActiveCombo(prefix);if(!combo)return false;
  const v=GRAM_VOWEL_KEYS[e.key];if(!v)return false;
  e.preventDefault();
  const ch=(GRAM_COMBO[combo]||{})[v]||v;
  gramInsert(prefix,ch);gramClearDiacritics(prefix);return true;
}

function gramBuildKeyboard(prefix){
  const dr=document.getElementById(`${prefix}-diac-row`);
  const vr=document.getElementById(`${prefix}-vowel-rows`);
  if(!dr||!vr)return;
  dr.innerHTML=`
    <div class="lpoly-kb-groups">
      <div class="lpoly-kb-group">
        <div class="lpoly-kb-group-lbl">Τόνος</div>
        <div class="lpoly-kb-group-btns">
          <button class="lpoly-dkey" id="${prefix}-dkey-ox" onclick="gramToggleTonos('${prefix}','ox')"><span style="font-size:1.1rem;">´</span><span class="ldkey-label">Οξεία</span></button>
          <button class="lpoly-dkey" id="${prefix}-dkey-per" onclick="gramToggleTonos('${prefix}','per')"><span style="font-size:1.1rem;">͂</span><span class="ldkey-label">Περισπ.</span></button>
        </div>
      </div>
      <div class="lpoly-kb-group">
        <div class="lpoly-kb-group-lbl">Πνεύμα</div>
        <div class="lpoly-kb-group-btns">
          <button class="lpoly-dkey" id="${prefix}-dkey-psi" onclick="gramTogglePneuma('${prefix}','psi')"><span style="font-size:1.1rem;">᾿</span><span class="ldkey-label">Ψιλή</span></button>
          <button class="lpoly-dkey" id="${prefix}-dkey-das" onclick="gramTogglePneuma('${prefix}','das')"><span style="font-size:1.1rem;">῾</span><span class="ldkey-label">Δασεία</span></button>
        </div>
      </div>
      <div class="lpoly-kb-group">
        <div class="lpoly-kb-group-lbl">Άλλο</div>
        <div class="lpoly-kb-group-btns">
          <button class="lpoly-dkey" id="${prefix}-dkey-ypogr" onclick="gramToggleYpogr('${prefix}')"><span style="font-size:1.1rem;">ͅ</span><span class="ldkey-label">Υπογεγρ.</span></button>
        </div>
      </div>
    </div>`;
  const vowels=['α','ε','η','ι','ο','υ','ω'];
  vr.innerHTML='';
  vowels.forEach(v=>{
    const row=document.createElement('div');row.className='lpoly-vowel-row';
    const lbl=document.createElement('div');lbl.className='lpoly-vlabel';lbl.textContent=v;row.appendChild(lbl);
    const keys=document.createElement('div');keys.className='lpoly-vkeys';keys.id=`${prefix}-vkeys-${v}`;
    const plain=document.createElement('button');plain.className='lpoly-vkey';plain.textContent=v;
    plain.onclick=()=>gramVowelClick(prefix,v);keys.appendChild(plain);row.appendChild(keys);vr.appendChild(row);
  });
  gramRenderVowels(prefix);
}

function gramRenderVowels(prefix){
  ['α','ε','η','ι','ο','υ','ω'].forEach(v=>{
    const c=document.getElementById(`${prefix}-vkeys-${v}`);if(!c)return;
    while(c.children.length>1)c.removeChild(c.lastChild);
    const d=gramActiveCombo(prefix);if(!d)return;
    const combo=GRAM_COMBO[d];if(!combo)return;
    const ch=combo[v];if(!ch)return;
    const b=document.createElement('button');b.className='lpoly-vkey';
    b.style.borderColor='#c9a44a';b.style.color='#e8c87a';b.textContent=ch;
    b.onclick=()=>{gramInsert(prefix,ch);gramClearDiacritics(prefix);};c.appendChild(b);
  });
}
function gramVowelClick(prefix,v){
  const d=gramActiveCombo(prefix);
  const ch=d?(GRAM_COMBO[d]||{})[v]||v:v;
  gramInsert(prefix,ch);
  gramClearDiacritics(prefix);
}
const _gramLastInput={};
function gramInsert(prefix,ch){
  const inp=(_gramLastInput[prefix]&&document.contains(_gramLastInput[prefix]))?_gramLastInput[prefix]:document.getElementById(`${prefix}-fi-input`);
  if(!inp)return;
  const s=inp.selectionStart,e=inp.selectionEnd;
  inp.value=inp.value.slice(0,s)+ch+inp.value.slice(e);
  inp.selectionStart=inp.selectionEnd=s+ch.length;inp.focus();
}
function gramToggleKB(prefix){
  document.getElementById(`${prefix}-poly-toggle`)?.classList.toggle('open');
  document.getElementById(`${prefix}-poly-body`)?.classList.toggle('open');
}

// ── GENERIC GAME RUNNER ──
// Called by each game with its own namespace prefix and data functions
function gramRunGame(cfg){
  // cfg = { prefix, G, keysFn, stemFn, qtFn, levels, filter, mode, lives, timer, wrapId, verbSelectorId, gameId, subjectId }
  const {prefix,G,keysFn,stemFn,qtFn,filter,mode,lives,timer,wrapId}=cfg;
  const _gameId    = cfg.gameId    || prefix;   // unique game identifier for mistake logging
  const _subjectId = cfg.subjectId || 'archaia'; // subject area (default: Ancient Greek)

  // Match mode: start matching screen and bail out of normal game loop
  if(mode==='match'){
    gramStartMatch(prefix,G,keysFn,stemFn,qtFn,filter,wrapId);
    return;
  }
  // Chrono mode: separate screen and logic
  if(mode==='chrono'){
    gramStartChrono(cfg);
    return;
  }

  // Kill any previously running game for this prefix (prevents ghost timers on re-launch)
  if(_gramCleanup[prefix]) _gramCleanup[prefix]();

  const state={
    score:0,lives:lives===0?Infinity:lives,timer,timerRemaining:timer,
    timerInterval:null,answering:false,pendingTimeout:null,
    lastVerb:null,activeKeys:[],curr:null,mistakes:[],
  };

  if(!filter){alert("Διάλεξε πρώτα ένα επίπεδο.");return;}
  const keys=keysFn(filter);
  if(!keys.length){alert("Δεν βρέθηκαν ερωτήσεις.");return;}
  state.activeKeys=keys;

  const $=id=>document.getElementById(id);
  const show=id=>{
    document.querySelectorAll(`#${wrapId} .lyo-screen`).forEach(s=>s.classList.remove('active'));
    $(id)?.classList.add('active');
  };
  const hud=()=>{
    const sv=$(prefix+'-sv');if(sv)sv.textContent=state.score;
    const lv=$(prefix+'-lv');
    if(lv){if(state.lives===Infinity){lv.textContent='∞';lv.style.fontSize='1.4rem';}
    else lv.innerHTML=Array(state.lives).fill('❤️').join('')||'💀';}
    const tv=$(prefix+'-tv');
    if(tv){if(state.timer===0){tv.textContent='∞';tv.classList.remove('ltimer-warn','ltimer-caut');}
    else{tv.textContent=_gramFmtSec(state.timerRemaining);}}
  };
  const startTimer=()=>{
    state.timerInterval=setInterval(()=>{
      state.timerRemaining--;
      const tv=$(prefix+'-tv');
      if(tv){tv.textContent=_gramFmtSec(state.timerRemaining);
        tv.classList.toggle('ltimer-warn',state.timerRemaining<=10);
        tv.classList.toggle('ltimer-caut',state.timerRemaining<=20&&state.timerRemaining>10);}
      if(state.timerRemaining<=0)end();
    },1000);
  };
  const end=()=>{
    if(state._ended)return;state._ended=true;
    clearInterval(state.timerInterval);state.timerInterval=null;
    if(state.pendingTimeout){clearTimeout(state.pendingTimeout);state.pendingTimeout=null;}
    const es=$(prefix+'-es');if(es)es.textContent=state.score;
    // Save progress to localStorage and refresh level grid badges
    if(_gramCurrentLvlId[prefix]){
      try{
        const pkey=`${prefix}_prog_${_gramCurrentLvlId[prefix]}`;
        const prev=JSON.parse(localStorage.getItem(pkey)||'{}');
        const completed=state.mistakes.length===0&&state.score>0;
        localStorage.setItem(pkey,JSON.stringify({best:Math.max(state.score,prev.best||0),completed:prev.completed||completed,ts:Date.now()}));
        if(_gramLevelRefresh[prefix])_gramLevelRefresh[prefix]();
      }catch(e){}
    }
    // ── Temple rewards (config-driven per-game params; gameId = engine prefix) ──
    if(typeof awardGameRewards==='function' && state.score>0){
      awardGameRewards(prefix,{score:state.score,perfect:state.mistakes.length===0&&state.score>0});
    }
    const log=$(prefix+'-mistakes-log');
    if(log){
      if(!state.mistakes.length){log.innerHTML='<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>';}
      else{
        let h=`<div class="lmistakes-hdr">Λάθη: ${state.mistakes.length}</div><div class="lmistakes-list">`;
        state.mistakes.forEach(m=>{
          const tmp=document.createElement('div');tmp.innerHTML=m.qt;
          const main=tmp.querySelector('.lq-main');
          const qtxt=main?main.textContent:m.qt.replace(/<[^>]+>/g,' ');
          const ttags=[...tmp.querySelectorAll('.lq-tag')].map(el=>el.textContent).join(' · ');
          // mc_correct = full word form (set by both MC and FI answer handlers)
          const showCorrect = m.mc_correct || m.correct;
          h+=`<div class="lmistake-row"><div class="lm-q">${qtxt}</div><div style="font-size:0.72rem;color:#8a7a60;margin:2px 0 5px;">${ttags}</div><div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${showCorrect}</span></div></div>`;
        });
        h+='</div>';log.innerHTML=h;
      }
    }
    show(prefix+'-screen-end');
  };

  const genQ=()=>{
    if(!state.activeKeys.length)return null;
    let key;
    for(let a=0;a<12;a++){
      const c=state.activeKeys[Math.floor(Math.random()*state.activeKeys.length)];
      if(a<11&&G[c]?.verb===state.lastVerb)continue;
      key=c;break;
    }
    if(!key)key=state.activeKeys[Math.floor(Math.random()*state.activeKeys.length)];
    const g=G[key];state.lastVerb=g.verb||g.lemma;
    const correct=g.endings[0];
    const fi_ends=g.fi_endings||g.endings;
    const stem=stemFn(g);
    // Compute full-word forms for fw mode
    const _stemBase = stem.endsWith('-') ? stem.slice(0,-1) : stem;
    const _spacer   = stem.endsWith('-') ? '' : ' ';
    const fw_correct = stem.endsWith('-') ? _stemBase+(fi_ends[0]||'') : g.endings[0];
    const fw_ends    = fi_ends.map(e => stem.endsWith('-') ? _stemBase+e : e);
    // Same-lemma distractor pool only — no cross-lemma fallback (enforces morphological purity)
    // sv=sameVerb, mt=matchTense, mm=matchMood, mv=matchVoice, df=differentForm
    function pickPool(sv,mt,mm,mv,df){
      const p=[];const seen=new Set();
      for(const k of Object.keys(G)){
        if(k===key)continue;
        const c=G[k];
        if(sv&&(c.verb||c.lemma||c.noun)!==(g.verb||g.lemma||g.noun))continue;
        if(mt&&g.tense&&c.tense!==g.tense)continue;
        if(mm&&g.mood&&c.mood!==g.mood)continue;
        if(mv&&g.voice&&c.voice!==g.voice)continue;
        if(df&&g.form&&c.form===g.form)continue;
        const e=c.endings[0];
        if(!g.endings.includes(e)&&!seen.has(e)){seen.add(e);p.push({form:e,entry:c});}
      }
      return p;
    }
    // 1. Same word, same tense/mood/voice, different form — ideal paradigm mates
    let rawPool=pickPool(true,true,true,true,true);
    // 2. Same word, different form (relax tense/mood/voice)
    if(rawPool.length<3){const s=new Set(rawPool.map(x=>x.form));pickPool(true,false,false,false,true).forEach(x=>{if(!s.has(x.form)){s.add(x.form);rawPool.push(x);}});}
    // 3. Same word, any form (catch remaining endings of the same paradigm)
    if(rawPool.length<3){const s=new Set(rawPool.map(x=>x.form));pickPool(true,false,false,false,false).forEach(x=>{if(!s.has(x.form)){s.add(x.form);rawPool.push(x);}});}
    for(let i=rawPool.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[rawPool[i],rawPool[j]]=[rawPool[j],rawPool[i]];}
    const wrongItems=rawPool.slice(0,3);
    const wrong=wrongItems.map(x=>x.form);
    while(wrong.length<3)wrong.push('—');
    // Classify distractors via GrammarEngine for Cerberus metadata
    const _eType=g.ptosi!=null?'noun':'verb';
    const _wEntries=wrongItems.map(x=>x.entry).filter(Boolean);
    const _wMeta=window.GE?.classifyGDictDistractors(g,_wEntries,_eType)||[];
    const _wrongMetaMap=Object.create(null);
    // Compact-index walk: _wMeta is indexed against the filtered _wEntries array,
    // so we track a separate counter _mi that only advances for non-null entries.
    let _mi=0;
    wrongItems.forEach(x=>{if(x.entry){if(x.form!=='—'&&_wMeta[_mi])_wrongMetaMap[x.form]=_wMeta[_mi];_mi++;}});
    const opts=[correct,...wrong].sort(()=>Math.random()-.5);
    return{qt:qtFn(g),opts,correct,endings:g.endings,fi_ends,fi_correct:fi_ends[0],stem,fw_correct,fw_ends,_wrongMetaMap};
  };

  const nextQ=()=>{
    state.curr=genQ();if(!state.curr){end();return;}
    state.answering=false;
    const qel=$(prefix+'-q');if(qel)qel.innerHTML=state.curr.qt;
    const fb=$(prefix+'-fb');if(fb){fb.textContent='';fb.className='lfeedback';}
    if(mode==='mc'){
      const grid=$(prefix+'-opts');if(!grid)return;grid.innerHTML='';
      state.curr.opts.forEach(opt=>{
        const b=document.createElement('button');b.className='lopt-btn';b.textContent=opt;
        b.onclick=()=>answer(opt);grid.appendChild(b);
      });
    }else{
      // Both fi and fw use the FI area — fw overrides fi_ends/fi_correct with full-word versions
      if(mode==='fw'){
        state.curr.fi_ends    = state.curr.fw_ends;
        state.curr.fi_correct = state.curr.fw_correct;
      }
      const stemEl=$(prefix+'-stem');
      if(stemEl){
        if(mode==='fw'){stemEl.style.display='none';}
        else{stemEl.style.display='';stemEl.textContent=state.curr.stem||'—';}
      }
      const inp=$(prefix+'-fi-input');
      if(inp){
        inp.value='';inp.disabled=false;inp.className='';
        if(mode==='fw'){
          inp.style.borderRadius='8px';inp.style.minWidth='220px';inp.placeholder='Γράψε ολόκληρο τον τύπο';
        } else {
          inp.style.borderRadius='';inp.style.minWidth='';inp.placeholder='κατάληξη';
        }
        inp.focus();
      }
      const sub=$(prefix+'-fi-submit');if(sub)sub.disabled=false;
      gramClearDiacritics(prefix);
    }
  };

  const answer=(chosen)=>{
    if(state.answering)return;state.answering=true;
    const acc=state.curr.endings,ok=acc.includes(chosen);
    document.querySelectorAll(`#${prefix}-opts .lopt-btn`).forEach(b=>{
      b.disabled=true;
      if(acc.includes(b.textContent))b.classList.add('lcorrect');
      else if(b.textContent===chosen&&!ok)b.classList.add('lwrong');
    });
    const fb=$(prefix+'-fb');
    if(ok){state.score++;if(fb){fb.textContent='✓ Σωστό!';fb.className='lfeedback lok';}}
    else{
      if(fb){fb.textContent=`✗ Λάθος — σωστό: ${state.curr.correct}`;fb.className='lfeedback lerr';}
      state.mistakes.push({qt:state.curr.qt,typed:chosen,correct:state.curr.correct,mc_correct:state.curr.correct,stem:state.curr.stem});
      if(typeof logStudentMistake==='function')logStudentMistake(_gameId,_subjectId,'grammar',{q:state.curr.qt,a:state.curr.correct},chosen);
      const _m=state.curr._wrongMetaMap?.[chosen];
      if(window.GE_CERBERUS_QUEUE&&_m)window.GE_CERBERUS_QUEUE.push({gameId:_gameId,subjectId:_subjectId,qt:state.curr.qt,chosen,correct:state.curr.correct,error_metadata:_m,ts:Date.now()});
      if(state.lives!==Infinity){state.lives--;hud();if(state.lives<=0){state.pendingTimeout=setTimeout(()=>end(),1200);return;}}
    }
    hud();state.pendingTimeout=setTimeout(()=>nextQ(),1500);
  };

  const submitFI=()=>{
    if(state.answering)return;
    const inp=$(prefix+'-fi-input');if(!inp)return;
    const typed=inp.value.trim();if(!typed){inp.focus();return;}
    state.answering=true;
    inp.disabled=true;const sub=$(prefix+'-fi-submit');if(sub)sub.disabled=true;
    const acc=state.curr.fi_ends,ok=acc.includes(typed);
    inp.classList.add(ok?'lcorrect':'lwrong');
    const fb=$(prefix+'-fb');
    if(ok){state.score++;if(fb){fb.textContent='✓ Σωστό!';fb.className='lfeedback lok';}}
    else{
      if(fb){fb.innerHTML=`✗ Λάθος — σωστό: <strong>${state.curr.fi_correct}</strong>`;fb.className='lfeedback lerr';}
      state.mistakes.push({qt:state.curr.qt,typed,correct:state.curr.fi_correct,mc_correct:state.curr.correct,stem:state.curr.stem});
      if(typeof logStudentMistake==='function')logStudentMistake(_gameId,_subjectId,'grammar',{q:state.curr.qt,a:state.curr.fi_correct},typed);
      const _m=state.curr._wrongMetaMap?.[typed];
      if(window.GE_CERBERUS_QUEUE&&_m)window.GE_CERBERUS_QUEUE.push({gameId:_gameId,subjectId:_subjectId,qt:state.curr.qt,chosen:typed,correct:state.curr.fi_correct,error_metadata:_m,ts:Date.now()});
      if(state.lives!==Infinity){state.lives--;hud();if(state.lives<=0){state.pendingTimeout=setTimeout(()=>end(),1400);return;}}
    }
    hud();state.pendingTimeout=setTimeout(()=>nextQ(),1600);
  };

  // Wire FI submit button and Enter key
  const inp=$(prefix+'-fi-input');
  if(inp)inp.onkeydown=e=>{if(gramReactiveKey(prefix,e))return;if(e.key==='Enter')submitFI();};
  const sub=$(prefix+'-fi-submit');
  if(sub)sub.onclick=submitFI;

  // Register cleanup so closeXxx() / back navigation can always kill this timer
  const stopGame=()=>{
    clearInterval(state.timerInterval);if(state.pendingTimeout)clearTimeout(state.pendingTimeout);
    state.timerInterval=null;state.pendingTimeout=null;
  };
  _gramCleanup[prefix]=stopGame;

  // Wire end/retry/levels/sett-back buttons
  // end-btn must call the local end() so the timer is always cleared properly
  const endBtn=$(prefix+'-end-btn');
  if(endBtn)endBtn.onclick=end;
  const retryBtn=$(prefix+'-retry');
  if(retryBtn)retryBtn.onclick=()=>show(prefix+'-screen-settings');
  // "Επίπεδα" and ← Επιστροφή both stop the game and go to levels
  const goLevels=()=>{stopGame();show(prefix+'-screen-levels');};
  const levelsBtn=$(prefix+'-to-levels');
  if(levelsBtn)levelsBtn.onclick=goLevels;
  const settBack=$(prefix+'-sett-back');
  if(settBack)settBack.onclick=goLevels;

  // Show game area
  const mcArea=$(prefix+'-mc-area'),fiArea=$(prefix+'-fi-area');
  if(mcArea)mcArea.style.display=mode==='mc'?'':'none';
  if(fiArea){(mode==='fi'||mode==='fw')?fiArea.classList.add('active'):fiArea.classList.remove('active');}

  show(prefix+'-screen-game');
  hud();
  if(timer>0)startTimer();
  nextQ();
}

// ── Tense sort order for Χρονική Αντικατάσταση ──
const _GRAM_TENSE_ORDER=['ενεστώτας','παρατατικός','μέλλοντας','αόριστος','παρακείμενος','υπερσυντέλικος'];
function _gramSortKeys(keys,G){
  return [...keys].sort((a,b)=>{
    let ai=_GRAM_TENSE_ORDER.indexOf(G[a].tense),bi=_GRAM_TENSE_ORDER.indexOf(G[b].tense);
    if(ai<0)ai=99;if(bi<0)bi=99;return ai-bi;
  });
}

// ── CHRONO MODE (Χρονική Αντικατάσταση) ──
function gramStartChrono(cfg){
  const {prefix,G,keysFn,stemFn,filter,lives,timer,wrapId}=cfg;
  if(_gramCleanup[prefix])_gramCleanup[prefix]();
  const $=id=>document.getElementById(id);
  const show=id=>{document.querySelectorAll(`#${wrapId} .lyo-screen`).forEach(s=>s.classList.remove('active'));$(id)?.classList.add('active');};

  const state={score:0,lives:lives===0?Infinity:lives,timer,timerRemaining:timer,timerInterval:null,pendingTimeout:null,mistakes:[],submitted:false};

  // Group keys by verb+voice+mood+form (the combo that should have multiple tenses)
  const allKeys=keysFn(filter);
  const groups={};
  for(const k of allKeys){
    const g=G[k];
    const gk=`${g.verb||''}|${g.voice}|${g.mood}|${g.form}${g.gender?'|'+g.gender:''}`;
    if(!groups[gk])groups[gk]=[];
    groups[gk].push(k);
  }
  const validGroups=Object.values(groups).filter(ks=>ks.length>=2);
  if(!validGroups.length){alert('Δεν βρέθηκαν ζεύγη χρόνων για αυτό το επίπεδο.');return;}

  const hud=()=>{
    const sv=$(prefix+'-csv');if(sv)sv.textContent=state.score;
    const lv=$(prefix+'-clv');if(lv){if(state.lives===Infinity){lv.textContent='∞';lv.style.fontSize='1.4rem';}else{lv.innerHTML=Array(state.lives).fill('❤️').join('')||'💀';}}
    {const tv=$(prefix+'-ctv');if(tv){if(state.timer===0){tv.textContent='∞';tv.classList.remove('ltimer-warn','ltimer-caut');}else{tv.textContent=_gramFmtSec(state.timerRemaining);}}}
  };
  const startTimer=()=>{state.timerInterval=setInterval(()=>{state.timerRemaining--;const tv=$(prefix+'-ctv');if(tv){tv.textContent=_gramFmtSec(state.timerRemaining);tv.classList.toggle('ltimer-warn',state.timerRemaining<=10);tv.classList.toggle('ltimer-caut',state.timerRemaining<=20&&state.timerRemaining>10);}if(state.timerRemaining<=0)end();},1000);};
  const end=()=>{
    if(state._ended)return;state._ended=true;
    clearInterval(state.timerInterval);state.timerInterval=null;
    if(state.pendingTimeout){clearTimeout(state.pendingTimeout);state.pendingTimeout=null;}
    const es=$(prefix+'-es');if(es)es.textContent=state.score;
    // Save progress to localStorage and refresh level grid badges
    if(_gramCurrentLvlId[prefix]){
      try{
        const pkey=`${prefix}_prog_${_gramCurrentLvlId[prefix]}`;
        const prev=JSON.parse(localStorage.getItem(pkey)||'{}');
        const completed=state.mistakes.length===0&&state.score>0;
        localStorage.setItem(pkey,JSON.stringify({best:Math.max(state.score,prev.best||0),completed:prev.completed||completed,ts:Date.now()}));
        if(_gramLevelRefresh[prefix])_gramLevelRefresh[prefix]();
      }catch(e){}
    }
    // ── Temple rewards (config-driven per-game params; gameId = engine prefix) ──
    if(typeof awardGameRewards==='function' && state.score>0){
      awardGameRewards(prefix,{score:state.score,perfect:state.mistakes.length===0&&state.score>0});
    }
    const log=$(prefix+'-mistakes-log');
    if(log){
      if(!state.mistakes.length){log.innerHTML='<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>';}
      else{let h=`<div class="lmistakes-hdr">Λάθη: ${state.mistakes.length}</div><div class="lmistakes-list">`;state.mistakes.forEach(m=>{h+=`<div class="lmistake-row"><div class="lm-q" style="color:#c9a44a;font-style:normal;">${m.tense}</div><div class="lm-ans"><span class="lm-wrong">${m.typed||'—'}</span><span style="color:#8a7a60">→</span><span class="lm-correct">${m.correct}</span></div></div>`;});h+='</div>';log.innerHTML=h;}
    }
    show(prefix+'-screen-end');
  };
  const stopGame=()=>{clearInterval(state.timerInterval);if(state.pendingTimeout)clearTimeout(state.pendingTimeout);state.timerInterval=null;state.pendingTimeout=null;};
  _gramCleanup[prefix]=stopGame;
  const endBtn=$(prefix+'-cend-btn');if(endBtn)endBtn.onclick=end;
  const retryBtn=$(prefix+'-retry');if(retryBtn)retryBtn.onclick=()=>show(prefix+'-screen-settings');
  const levelsBtn=$(prefix+'-to-levels');if(levelsBtn)levelsBtn.onclick=()=>{stopGame();show(prefix+'-screen-levels');};

  const nextVerb=()=>{
    state.submitted=false;
    const grpKeys=validGroups[Math.floor(Math.random()*validGroups.length)];
    const givenIdx=Math.floor(Math.random()*grpKeys.length);
    const givenKey=grpKeys[givenIdx];
    const givenG=G[givenKey];
    // Sort all keys in this group by standard tense order
    const sortedKeys=_gramSortKeys(grpKeys,G);
    const toFillKeys=sortedKeys.filter(k=>k!==givenKey);
    state.curr={givenG,toFillKeys};
    const container=$(prefix+'-chrono-container');if(!container)return;
    // Build unified table: given row in-place, fill rows as inputs
    let fillIdx=0;
    const rowsHTML=sortedKeys.map(k=>{
      const g=G[k];const stem=stemFn(g);const hs=stem&&stem!=='—';
      if(k===givenKey){
        return `<div class="gram-chrono-row gram-chrono-given-row">
          <div class="gram-chrono-tense">${g.tense}</div>
          <div class="gram-chrono-wrap gram-chrono-given-wrap">
            ${hs?`<span class="gram-chrono-stem gram-chrono-given-stem">${stem}</span><span style="color:#8a7a60;margin:0 4px">→</span>`:''}
            <span class="gram-chrono-given-val${hs?'':' no-stem'}">${g.endings[0]}</span>
          </div>
        </div>`;
      } else {
        const idx=fillIdx++;
        return `<div class="gram-chrono-row" data-idx="${idx}">
          <div class="gram-chrono-tense">${g.tense}</div>
          <div class="gram-chrono-wrap">
            ${hs?`<span class="gram-chrono-stem">${stem}</span><span style="color:#8a7a60;margin:0 4px">→</span>`:''}
            <input class="gram-chrono-inp" data-idx="${idx}" data-key="${k}"
              autocomplete="off" autocorrect="off" spellcheck="false"
              placeholder="${hs?'συνηρημένος τύπος':'τύπος'}">
          </div>
        </div>`;
      }
    }).join('');
    container.innerHTML=`
      <div class="lq-tags" style="justify-content:flex-start;margin-bottom:12px;">
        ${givenG.verb?`<span class="lq-tag" style="border-color:#5a4a2a;color:#c9a44a">${givenG.verb}</span>`:''}
        <span class="lq-tag voice">${givenG.voice} Φωνή</span>
        <span class="lq-tag mood">${givenG.mood}</span>
        <span class="lq-tag form">${givenG.form}</span>
      </div>
      <div class="gram-chrono-table">${rowsHTML}</div>
      <button class="lbtn lbtn-primary" id="${prefix}-chrono-submit-btn">Υποβολή →</button>
      <div class="lfeedback" id="${prefix}-chrono-fb"></div>`;
    const kpfx=prefix+'-c';
    container.querySelectorAll('.gram-chrono-inp').forEach((inp,i)=>{
      inp.addEventListener('focus',()=>{_gramLastInput[kpfx]=inp;gramClearDiacritics(kpfx);});
      inp.addEventListener('keydown',e=>{if(gramReactiveKey(kpfx,e))return;if(e.key==='Enter'){const next=container.querySelector(`.gram-chrono-inp[data-idx="${i+1}"]`);if(next)next.focus();else submit();}});
    });
    $(prefix+'-chrono-submit-btn').onclick=submit;
    setTimeout(()=>{const first=container.querySelector('.gram-chrono-inp');if(first){_gramLastInput[kpfx]=first;first.focus();}},80);
  };

  const submit=()=>{
    if(state.submitted)return;state.submitted=true;
    const {toFillKeys}=state.curr;let correct=0;
    const container=$(prefix+'-chrono-container');
    container.querySelectorAll('.gram-chrono-inp').forEach((inp,i)=>{
      inp.disabled=true;
      const g=G[inp.dataset.key];const typed=inp.value.trim();
      const accepted=g.fi_endings||g.endings;const ok=accepted.includes(typed);
      if(ok){correct++;inp.classList.add('lcorrect');}
      else{
        inp.classList.add('lwrong');
        const row=inp.closest('.gram-chrono-row');
        if(row){const h=document.createElement('div');h.className='gram-chrono-hint';h.innerHTML=`<span style="color:#e67e6a">${typed||'—'}</span> → <span style="color:#5dca8a">${accepted[0]}</span>`;row.appendChild(h);}
        state.mistakes.push({tense:g.tense,typed,correct:accepted[0]});
      }
    });
    state.score+=correct;
    if(state.lives!==Infinity&&correct<toFillKeys.length)state.lives=Math.max(0,state.lives-(toFillKeys.length-correct));
    hud();
    const fb=$(prefix+'-chrono-fb');
    if(fb){const all=correct===toFillKeys.length;fb.textContent=all?'✓ Τέλεια!':correct+'/'+toFillKeys.length+' σωστά';fb.className='lfeedback '+(all?'lok':'lerr');}
    const btn=$(prefix+'-chrono-submit-btn');
    if(btn){btn.textContent='Επόμενο →';btn.onclick=()=>{if(state.lives<=0){if(state.pendingTimeout){clearTimeout(state.pendingTimeout);state.pendingTimeout=null;}end();return;}nextVerb();};}
    if(state.lives<=0)state.pendingTimeout=setTimeout(()=>end(),1800);
  };

  show(prefix+'-screen-chrono');
  gramBuildKeyboard(prefix+'-c');
  hud();
  if(timer>0)startTimer();
  nextVerb();
}

// ── SHARED HTML TEMPLATE BUILDER ──
const GRAM_STD_MODES=[
  {id:'mc',    icon:'🔲', label:'Πολλαπλή Επιλογή',      hint:'Επίλεξε από 4 καταλήξεις'},
  {id:'fi',    icon:'✏️',  label:'Συμπλήρωση Κενού',      hint:'Γράψε τον τύπο μόνος σου'},
  {id:'fw',    icon:'📝',  label:'Ολόκληρος Τύπος',       hint:'Γράψε ολόκληρη τη λέξη'},
  {id:'match', icon:'🔗',  label:'Αντιστοίχιση',           hint:'Αντίστοιχισε τύπο με μορφή'},
  {id:'chrono',icon:'⏱️',  label:'Χρονική Αντικατάσταση', hint:'Δίνεται ένας χρόνος — συμπλήρωσε τους υπόλοιπους'},
];
// SVG mode icons (no emoji) keyed by mode id; falls back to the supplied glyph.
function _gramModeIcon(id,glyph){
  const s='<svg width="20" height="20" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
  switch(id){
    case 'mc':     return s+'<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1" fill="currentColor"/></svg>';
    case 'fi':     return s+'<path d="M3 13h10"/><path d="M10.5 3.2l2.3 2.3-6 6-2.6.3.3-2.6z"/></svg>';
    case 'fw':     return s+'<path d="M3 4h10M3 8h10M3 12h6"/></svg>';
    case 'match':  return s+'<path d="M6.5 6.5L9.5 9.5"/><path d="M5.5 4.2L4 5.7a2.4 2.4 0 003.4 3.4l1.1-1.1"/><path d="M10.5 11.8L12 10.3a2.4 2.4 0 00-3.4-3.4L7.5 8"/></svg>';
    case 'chrono': return s+'<circle cx="8" cy="9" r="5"/><path d="M8 6.5V9l2 1.5M6 1.7h4"/></svg>';
    case 'arcade': return s+'<rect x="1.5" y="5" width="13" height="7.5" rx="3.2"/><path d="M4.6 8.75h2M5.6 7.75v2"/><circle cx="10.4" cy="8" r=".6" fill="currentColor"/><circle cx="11.6" cy="9.4" r=".6" fill="currentColor"/></svg>';
    default:       return glyph||'';
  }
}
// Segmented control → mirror selection into a hidden source <select> (so the
// existing launch read of `<select>.value` keeps working unchanged).
function _gramSeg(selId,btn,val){
  const sel=document.getElementById(selId);
  if(sel){sel.value=val;sel.dispatchEvent(new Event('change',{bubbles:true}));}
  const wrap=btn.parentElement;
  if(wrap)wrap.querySelectorAll('.gpx-segbtn').forEach(b=>b.classList.toggle('on',b===btn));
}
function _gramSegHTML(selId,opts,selVal){
  // selVal that matches no option → start unselected (placeholder), so callers
  // (e.g. a mode picker) keep their "nothing chosen yet" gating.
  const has=opts.some(o=>o[0]===selVal);
  return '<div class="gpx-seg">'+opts.map(o=>'<button type="button" class="gpx-segbtn'+(o[0]===selVal?' on':'')+
      '" onclick="_gramSeg(\''+selId+'\',this,\''+o[0]+'\')">'+o[1]+'</button>').join('')+'</div>'+
    '<select id="'+selId+'" hidden data-gpx-seg="1">'+(has?'':'<option value="" selected disabled></option>')+
      opts.map(o=>'<option value="'+o[0]+'"'+(o[0]===selVal?' selected':'')+'>'+o[1]+'</option>').join('')+'</select>';
}

// ── Runtime enhancer: upgrade the standalone grammar games' settings
// dropdowns (…-sel-time / -sel-lives / -sel-mode) into segmented controls
// without editing each game. The native <select> stays the hidden source of
// truth, so every game's existing launch read (`select.value`) is unchanged.
(function(){
  const SHORT={'60':'60″','90':'90″','120':'2′','180':'3′','300':'5′','0':'∞','1':'1','3':'3','5':'5'};
  function shortLabel(sel,o){
    if(/-sel-(time|lives)$/.test(sel.id) && SHORT[o.value]!=null) return SHORT[o.value];
    return o.textContent.replace(/^[^\p{L}\p{N}∞]+/u,'').trim();   // strip leading emoji/symbols
  }
  function upgrade(sel){
    if(!sel || sel.dataset.gpxSeg || !/-sel-(time|lives|mode)$/.test(sel.id||'') || !sel.parentNode) return;
    sel.dataset.gpxSeg='1';
    const seg=document.createElement('div'); seg.className='gpx-seg';
    [...sel.options].forEach(o=>{
      if(o.disabled && o.value==='') return;                       // skip placeholder
      const b=document.createElement('button'); b.type='button';
      b.className='gpx-segbtn'+(o.selected && o.value!==''?' on':'');
      b.textContent=shortLabel(sel,o);
      b.onclick=()=>{ sel.value=o.value; sel.dispatchEvent(new Event('change',{bubbles:true}));
        seg.querySelectorAll('.gpx-segbtn').forEach(x=>x.classList.toggle('on',x===b)); };
      seg.appendChild(b);
    });
    sel.setAttribute('hidden',''); sel.parentNode.insertBefore(seg,sel);
  }
  function scan(root){ try{ (root||document).querySelectorAll('select[id$="-sel-time"],select[id$="-sel-lives"],select[id$="-sel-mode"]').forEach(upgrade); }catch(e){} }
  window._gramUpgradeSelects=scan;
  if(typeof MutationObserver!=='undefined'){
    const mo=new MutationObserver(muts=>{ for(const m of muts) for(const n of m.addedNodes){ if(n.nodeType!==1)continue;
      if(n.matches && n.matches('select[id*="-sel-"]')) upgrade(n);
      if(n.querySelectorAll) scan(n); } });
    const start=()=>{ if(document.body){ mo.observe(document.body,{childList:true,subtree:true}); scan(document); } };
    if(document.body) start(); else document.addEventListener('DOMContentLoaded',start);
  } else {
    document.addEventListener('DOMContentLoaded',()=>scan(document));
  }
})();
// Generates the screens HTML for any grammar game overlay.
// cfg (optional): { modes: [{id,icon,label,hint},...], extraScreens: '<html>...' }
function gramBuildScreens(prefix,title,subtitle,cfg){
  const _modes=(cfg&&cfg.modes)||GRAM_STD_MODES;
  const _extra=(cfg&&cfg.extraScreens)||'';
  const _cols=Math.min(_modes.length,3);
  const _modesSel=`<div class="lmode-sel" style="grid-template-columns:repeat(${_cols},1fr);">`
    +_modes.map(m=>`<div class="lmode-btn" id="${prefix}-mode-${m.id}" onclick="gramSetMode('${prefix}','${m.id}')">`
      +`<span class="lm-icon">${_gramModeIcon(m.id,m.icon)}</span><span>${m.label}</span>`
      +`<span class="lm-hint">${m.hint}</span></div>`).join('')+'</div>';
  return `
<div id="${prefix}-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels">
    <h1>${title}</h1>
    <p class="lsubtitle">${subtitle}</p>
    <button class="game-share-btn" onclick="showQR('${_gramEsc(title)}',{nav:'game',id:'${prefix}'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="${prefix}-level-grid"></div>
  </div>
</div>

<div id="${prefix}-screen-settings" class="lyo-screen">
  <div class="lcard">
    <button class="lback-link" id="${prefix}-sett-back">← Επιστροφή</button>
    <h2 id="${prefix}-sett-title">Ρυθμίσεις</h2>
    <div id="${prefix}-verb-selector"></div>
    <h3>Τρόπος Παιχνιδιού</h3>
    ${_modesSel}
    <div class="lsett-row">
      <div class="lfield"><label>Χρόνος</label>
        ${_gramSegHTML(prefix+'-sel-time',[['60','60″'],['90','90″'],['120','2′'],['180','3′'],['0','∞']],'90')}
      </div>
      <div class="lfield"><label>Ζωές</label>
        ${_gramSegHTML(prefix+'-sel-lives',[['1','1'],['3','3'],['5','5'],['0','∞']],'3')}
      </div>
    </div>
    <button class="lsett-qr-btn" id="${prefix}-sett-qr" style="opacity:0.38;pointer-events:none;">📱 <span>Μοιράσου αυτή τη ρύθμιση</span></button>
    <button class="lbtn lbtn-primary" id="${prefix}-launch-btn" style="opacity:.5;pointer-events:none;">Έναρξη Κουίζ →</button>
  </div>
</div>

<div id="${prefix}-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="${prefix}-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="${prefix}-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="${prefix}-lv"></div></div>
      <button class="lbtn lbtn-secondary" id="${prefix}-end-btn" style="padding:7px 13px;font-size:0.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="${prefix}-q"><div class="lq-main">Φόρτωση...</div></div>
    <div id="${prefix}-mc-area"><div class="lopts-grid" id="${prefix}-opts"></div></div>
    <div id="${prefix}-fi-area" class="lfi-wrap">
      <div class="lstem-display">
        <div class="lstem-part" id="${prefix}-stem">—</div>
        <div class="lfi-inp-wrap">
          <input type="text" id="${prefix}-fi-input" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="κατάληξη"
            style="font-family:'Noto Serif',serif;font-size:1.9rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:0 8px 8px 0;color:#e8c87a;width:160px;outline:none;caret-color:#c9a44a;">
        </div>
      </div>
      <button class="lfi-submit" id="${prefix}-fi-submit">Υποβολή ↵</button>
      <div class="lpoly-kb">
        <button class="lpoly-toggle" id="${prefix}-poly-toggle" onclick="gramToggleKB('${prefix}')">
          <span>Πολυτονικό Πληκτρολόγιο</span><span class="lpoly-arrow">▼</span>
        </button>
        <div class="lpoly-body" id="${prefix}-poly-body">
          <div class="lpoly-diac-row" id="${prefix}-diac-row"></div>
          <div id="${prefix}-vowel-rows"></div>
        </div>
      </div>
    </div>
    <div class="lfeedback" id="${prefix}-fb"></div>
  </div>
</div>

<div id="${prefix}-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="${prefix}-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="${prefix}-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" id="${prefix}-retry">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" id="${prefix}-to-levels">Επίπεδα</button>
    </div>
  </div>
</div>

<div id="${prefix}-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="${prefix}-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="${prefix}-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('${prefix}')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="${prefix}-match-body"></div>
    <div class="lfeedback" id="${prefix}-match-fb"></div>
  </div>
</div>

<div id="${prefix}-screen-chrono" class="lyo-screen">
  <div class="lcard" style="max-height:88vh;overflow-y:auto;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="${prefix}-csv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="${prefix}-ctv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="${prefix}-clv"></div></div>
      <button class="lbtn lbtn-secondary" id="${prefix}-cend-btn" style="padding:7px 13px;font-size:0.77rem;">Τέλος</button>
    </div>
    <div id="${prefix}-chrono-container"></div>
    <div class="lpoly-kb" style="margin-top:16px;">
      <button class="lpoly-toggle" id="${prefix}-c-poly-toggle" onclick="gramToggleKB('${prefix}-c')">
        <span>Πολυτονικό Πληκτρολόγιο</span><span class="lpoly-arrow">▼</span>
      </button>
      <div class="lpoly-body" id="${prefix}-c-poly-body">
        <div class="lpoly-diac-row" id="${prefix}-c-diac-row"></div>
        <div id="${prefix}-c-vowel-rows"></div>
      </div>
    </div>
  </div>
</div>
${_extra}`;
}

// ── LEVEL GRID BUILDER ──
// Stores a refresh callback per prefix so end() can update badges after a game
const _gramLevelRefresh={};

// Two-pane picker (umbrella rail + section detail), matching the configurator
// (.gpx-pick). Single-select: click a level → onSelect(lvl). High score is the
// best-points from `<prefix>_prog_<id>` (done/active/new states).
const _gramPickGroup={};   // open umbrella per prefix
function _gramProg(prefix,id){
  try{ const p=JSON.parse(localStorage.getItem(prefix+'_prog_'+id)||'null');
    if(p) return {state:p.completed?'done':'active',best:p.best||0}; }catch(e){}
  return {state:'new',best:0};
}
function _gramGStats(prefix,lvls){
  const done=lvls.filter(l=>_gramProg(prefix,l.id).state==='done').length;
  return {done,total:lvls.length,pct:lvls.length?Math.round(done/lvls.length*100):0};
}
function _gramEsc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
function _gramRing(pct,label){const r=12,c=2*Math.PI*r,off=c*(1-pct/100);
  return '<span class="gpx-ring"><svg width="28" height="28" viewBox="0 0 28 28"><circle class="trk" cx="14" cy="14" r="'+r+'" fill="none" stroke-width="2.6"/><circle class="fil" cx="14" cy="14" r="'+r+'" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'" transform="rotate(-90 14 14)"/></svg><i>'+label+'</i></span>';}
function gramBuildLevelGrid(prefix,levels,onSelect,opts){
  opts=opts||{};
  const c=document.getElementById(prefix+'-level-grid'); if(!c) return;
  // Per-class curriculum gate: keep only levels assigned to the browsed grade.
  if(window.CurriculumGate && typeof currentGradeKey!=='undefined'){
    const _allow=CurriculumGate.allowedLevels(prefix,currentGradeKey);
    if(_allow){ levels=levels.filter(l=>_allow.has(l.id));
      if(!levels.length){ c.innerHTML='<div class="gpx-locked-note">Δεν έχουν ανατεθεί επίπεδα για αυτή την τάξη.</div>'; return; } }
  }
  _gramLevelRefresh[prefix]=()=>gramBuildLevelGrid(prefix,levels,onSelect,opts);
  const groups=[],gmap={},seq={};
  levels.forEach((l,i)=>{ if(!gmap[l.group]){gmap[l.group]=[];groups.push(l.group);} gmap[l.group].push(l); seq[l.id]=i+1; });
  if(!_gramPickGroup[prefix]||!gmap[_gramPickGroup[prefix]]){
    const act=levels.find(l=>_gramProg(prefix,l.id).state==='active')||levels[0];
    _gramPickGroup[prefix]=act?act.group:groups[0];
  }
  const open=_gramPickGroup[prefix];
  const rowHTML=l=>{ const pr=_gramProg(prefix,l.id); let chip;
    if(pr.state==='done') chip='<span class="gpx-score done">✓ '+pr.best+'<i>πτ</i></span>';
    else if(pr.state==='active') chip='<span class="gpx-score act">'+pr.best+'<i>πτ</i> · ΣΥΝΕΧΙΣΕ</span>';
    else chip='<span class="gpx-score new">Ξεκίνα →</span>';
    return '<button type="button" class="gpx-row s-'+pr.state+'" data-lv="'+l.id+'"><span class="gpx-num">'+String(seq[l.id]).padStart(2,'0')+'</span><span class="gpx-rowbody"><span class="gpx-desc">'+_gramEsc(l.desc)+'</span></span>'+chip+'</button>'; };
  const stTot=_gramGStats(prefix,levels);
  let rail='<div class="gpx-rail"><div class="gpx-rail-lbl">Κατηγορίες</div>';
  groups.forEach(g=>{ const st=_gramGStats(prefix,gmap[g]);
    rail+='<button type="button" class="gpx-railitem'+(g===open?' on':'')+'" data-grp="'+encodeURIComponent(g)+'"><span class="gpx-railbody"><span class="nm">'+_gramEsc(g)+'</span><span class="bl">'+st.done+'/'+st.total+' ολοκλ.</span></span>'+_gramRing(st.pct,st.done)+'</button>'; });
  if(opts.onExtra)rail+='<button type="button" class="gpx-railitem gpx-extra" data-extra="1"><span class="gpx-railbody"><span class="nm">'+_gramEsc(opts.extraLabel||'Προσαρμοσμένο')+'</span><span class="bl">'+_gramEsc(opts.extraHint||'')+'</span></span></button>';
  rail+='</div>';
  const shown=gmap[open]||[]; const sects=[],smap={};
  shown.forEach(l=>{const s=l.section||'';if(!(s in smap)){smap[s]=[];sects.push(s);}smap[s].push(l);});
  let detail='<div class="gpx-detail"><div class="gpx-detail-hd"><h3>'+_gramEsc(open)+'</h3><span class="meta">'+shown.length+' επίπεδα</span></div>';
  sects.forEach(s=>{ if(s)detail+='<div class="gpx-subdiv">'+_gramEsc(s)+'<span class="ct">'+smap[s].length+'</span></div>'; detail+='<div class="gpx-rows">'+smap[s].map(rowHTML).join('')+'</div>'; });
  detail+='</div>';
  c.classList.add('gpx-pick');
  c.innerHTML='<div class="gpx-prog"><div class="gpx-bar"><i style="width:'+stTot.pct+'%"></i></div><span>'+stTot.done+'/'+stTot.total+' ολοκληρωμένα</span></div><div class="gpx-body">'+rail+detail+'</div>';
  c.querySelectorAll('.gpx-railitem').forEach(el=>el.onclick=()=>{ _gramPickGroup[prefix]=decodeURIComponent(el.dataset.grp); gramBuildLevelGrid(prefix,levels,onSelect); });
  c.querySelectorAll('.gpx-row').forEach(el=>el.onclick=()=>{ const lvl=levels.find(l=>l.id===+el.dataset.lv); if(!lvl) return;
    _gramCurrentLvlId[prefix]=lvl.id; const qb=document.getElementById(prefix+'-sett-qr'); if(qb){qb.style.opacity='0.38';qb.style.pointerEvents='none';}
    onSelect(lvl); });
  if(opts.onExtra){ const ex=c.querySelector('[data-extra]'); if(ex) ex.onclick=opts.onExtra; }
}

// Two-pane MULTI-select picker for the standalone grammar games (ousiastika,
// antonymies, epitheta, lat-nouns, lat-epitheta …). Rows are `.gpx-row.lvl-card`
// carrying data-lvl-id/data-subs and toggle the game's own `selClass` — so each
// game's existing launch reader (`#<prefix>-level-grid .lvl-card.<selClass>`)
// keeps working. Every umbrella renders (hidden when not open) so the selection
// persists across rail switches. opts: { selClass, railLabel, onToggle }.
function gramBuildSubPicker(prefix, levels, opts){
  opts = opts || {};
  const selClass = opts.selClass || (prefix+'-sel');
  const railLabel = opts.railLabel || 'Κατηγορίες';
  const onToggle = typeof opts.onToggle === 'function' ? opts.onToggle : function(){};
  const grid = document.getElementById(opts.containerId || (prefix+'-level-grid')); if(!grid) return;
  // Per-class curriculum gate: keep only levels assigned to the browsed grade.
  if(window.CurriculumGate && typeof currentGradeKey!=='undefined'){
    const _allow=CurriculumGate.allowedLevels(prefix,currentGradeKey);
    if(_allow){ levels=levels.filter(l=>_allow.has(l.id));
      if(!levels.length){ grid.innerHTML='<div class="gpx-locked-note">Δεν έχουν ανατεθεί επίπεδα για αυτή την τάξη.</div>'; return; } }
  }
  grid.classList.add('gpx-pick');
  const groups=[],gmap={},seq={};
  levels.forEach((l,i)=>{ if(!gmap[l.group]){gmap[l.group]=[];groups.push(l.group);} gmap[l.group].push(l); seq[l.id]=i+1; });
  if(!_gramPickGroup[prefix]||!gmap[_gramPickGroup[prefix]]){ const act=levels.find(l=>_gramProg(prefix,l.id).state==='active')||levels[0]; _gramPickGroup[prefix]=act?act.group:groups[0]; }
  const open=_gramPickGroup[prefix];
  const chip=l=>{ const pr=_gramProg(prefix,l.id);
    return pr.state==='done'?'<span class="gpx-score done">✓ '+pr.best+'<i>πτ</i></span>':pr.state==='active'?'<span class="gpx-score act">'+pr.best+'<i>πτ</i></span>':'<span class="gpx-score new">Ξεκίνα →</span>'; };
  let rail='<div class="gpx-rail"><div class="gpx-rail-lbl">'+_gramEsc(railLabel)+'</div>';
  groups.forEach(g=>{ const st=_gramGStats(prefix,gmap[g]); rail+='<button type="button" class="gpx-railitem'+(g===open?' on':'')+'" data-g="'+encodeURIComponent(g)+'"><span class="gpx-railbody"><span class="nm">'+_gramEsc(g)+'</span><span class="bl">'+st.done+'/'+st.total+' ολοκλ.</span></span>'+_gramRing(st.pct,st.done)+'</button>'; });
  rail+='</div>';
  let detail='<div class="gpx-detail">';
  groups.forEach(g=>{ detail+='<div class="gram-gsec" data-g="'+encodeURIComponent(g)+'"'+(g===open?'':' style="display:none"')+'><div class="gpx-detail-hd"><h3>'+_gramEsc(g)+'</h3><span class="meta">'+gmap[g].length+' επίπεδα</span></div>';
    const sects=[],smap={}; gmap[g].forEach(l=>{const s=l.section||'';if(!(s in smap)){smap[s]=[];sects.push(s);}smap[s].push(l);});
    sects.forEach(s=>{ if(s)detail+='<div class="gpx-subdiv">'+_gramEsc(s)+'<span class="ct">'+smap[s].length+'</span></div>';
      detail+='<div class="gpx-rows">'+smap[s].map(l=>{
        const extra = opts.dataAttrs ? Object.entries(opts.dataAttrs(l)).map(kv=>' data-'+kv[0]+'="'+kv[1]+'"').join('') : '';
        return '<button type="button" class="gpx-row lvl-card" data-lvl-id="'+l.id+'" data-subs=\''+JSON.stringify(l.sub||[])+'\''+extra+'><span class="gpx-box"></span><span class="gpx-num">'+String(seq[l.id]).padStart(2,'0')+'</span><span class="gpx-rowbody"><span class="gpx-desc">'+_gramEsc(l.desc)+'</span></span>'+chip(l)+'</button>';
      }).join('')+'</div>'; });
    detail+='</div>'; });
  detail+='</div>';
  grid.innerHTML='<div class="gpx-body">'+rail+detail+'</div>';
  grid.querySelectorAll('.gpx-railitem').forEach(el=>el.onclick=()=>{ _gramPickGroup[prefix]=decodeURIComponent(el.dataset.g);
    grid.querySelectorAll('.gpx-railitem').forEach(b=>b.classList.toggle('on',b===el));
    grid.querySelectorAll('.gram-gsec').forEach(sx=>{sx.style.display=(decodeURIComponent(sx.dataset.g)===_gramPickGroup[prefix])?'':'none';}); });
  grid.querySelectorAll('.gpx-row.lvl-card').forEach(d=>d.onclick=()=>{ d.classList.toggle(selClass); d.classList.toggle('on'); onToggle(d); });
}

// Mode-selection PAGE for the multi-select grammar games — a full page (not a
// popup), styled like the level picker: a rail listing the quiz modes AND the
// arcade games, with the chosen item's controls on the side. Quiz modes set the
// game's hidden <select>s and call opts.onLaunch; arcade games launch the engine
// with the already-selected content + levels via initGameWithData (skipping the
// configurator's content/level steps). Arcade section only shows for datasets
// registered in GP_DATASETS.
// opts: { title, datasetId, modes:[{id,icon,label,hint}], selClass, onLaunch, onClose }
function gramOpenQuizSettings(prefix, opts){
  opts = opts || {};
  const quizModes = opts.modes || GRAM_STD_MODES;
  const datasetId = opts.datasetId || null;
  const selClass  = opts.selClass || (prefix+'-sel');
  const dsReg = (typeof GP_DATASETS!=='undefined') && datasetId && GP_DATASETS.find(d=>d.id===datasetId);
  // Auto-list every non-self-contained engine that allows this dataset's category
  // (so e.g. Χρονολόγιο / Mythology — epics/history only — never show for grammar),
  // and surface the user's favourites first. New engines appear automatically.
  let engines = (dsReg && typeof GP_ENGINES!=='undefined')
    ? GP_ENGINES.filter(e => e && e.id && !e.selfContained && (!e.allowedCategories || e.allowedCategories.indexOf(dsReg.category) >= 0))
    : [];
  if (typeof isFavorite === 'function') engines = engines.slice().sort((a,b)=>(isFavorite(b.id)?1:0)-(isFavorite(a.id)?1:0));
  const selLevelIds = () => [...document.querySelectorAll('#'+prefix+'-level-grid .lvl-card.'+selClass)].map(c=>{ const n=+c.dataset.lvlId; return isNaN(n)?c.dataset.lvlId:n; });
  let ov = document.getElementById('gram-qs-overlay');
  if (!ov) { ov = document.createElement('div'); ov.id='gram-qs-overlay'; document.body.appendChild(ov); }
  ov.className = 'gram-qs-page lyo-screen';
  const S = { kind:null, id:null, time:'90', lives:'3', pvp:false, join:'local', extras:{} };
  const seg = (id, arr, def) => '<div class="gpx-seg" id="'+id+'">'+arr.map(o=>'<button type="button" class="gpx-segbtn'+(o[0]===def?' on':'')+'" data-v="'+o[0]+'">'+o[1]+'</button>').join('')+'</div>';
  const railHTML = () => {
    let h='<div class="gpx-rail"><div class="gpx-rail-lbl">Κουίζ</div>';
    quizModes.forEach(m=>{ h+='<button type="button" class="gpx-railitem'+(S.kind==='quiz'&&S.id===m.id?' on':'')+'" data-kind="quiz" data-id="'+m.id+'"><span style="display:flex;color:var(--gpx-gold)">'+_gramModeIcon(m.id,m.icon)+'</span><span class="gpx-railbody"><span class="nm">'+_gramEsc(m.label)+'</span></span></button>'; });
    if (engines.length){ h+='<div class="gpx-rail-lbl">Παιχνίδια</div>';
      engines.forEach(e=>{ h+='<button type="button" class="gpx-railitem'+(S.kind==='arcade'&&S.id===e.id?' on':'')+'" data-kind="arcade" data-id="'+e.id+'"><span class="gram-qs-eng-ic">'+(e.icon||'')+'</span><span class="gpx-railbody"><span class="nm">'+_gramEsc(e.label)+'</span></span></button>'; });
    }
    return h+'</div>';
  };
  const detailHTML = () => {
    if (!S.kind) return '<div class="gpx-empty">Διάλεξε τρόπο παιχνιδιού από τα αριστερά →</div>';
    if (S.kind==='quiz'){
      const m = quizModes.find(x=>x.id===S.id)||{};
      return '<div class="gpx-detail-hd"><h3>'+_gramEsc(m.label)+'</h3></div>'+
        (m.hint?'<p class="gram-qs-desc">'+_gramEsc(m.hint)+'</p>':'')+
        (opts.extras||[]).map((ex,i)=>'<div class="gram-qs-fieldlbl">'+_gramEsc(ex.label)+'</div>'+seg('gram-qs-extra-'+i, ex.options, (S.extras[ex.selId]!=null?S.extras[ex.selId]:ex.default))).join('')+
        '<div class="lsett-row"><div class="lfield"><label>Χρόνος</label>'+seg('gram-qs-time',[['60','60″'],['90','90″'],['120','2′'],['180','3′'],['0','∞']],S.time)+'</div>'+
        '<div class="lfield"><label>Ζωές</label>'+seg('gram-qs-lives',[['1','1'],['3','3'],['5','5'],['0','∞']],S.lives)+'</div></div>'+
        '<button class="lbtn lbtn-primary gram-qs-go" id="gram-qs-go">Εκκίνηση →</button>';
    }
    const e = engines.find(x=>x.id===S.id)||{};
    const pm = (typeof _ecmModesFor==='function') ? _ecmModesFor(e) : [{key:'solo',pvp:false,t:'Μόνος',d:''}];
    let h = '<div class="gpx-detail-hd"><h3>'+_gramEsc(e.label)+'</h3></div>'+
      '<p class="gram-qs-desc">'+_gramEsc(e.desc||e.subtitle||'')+'</p>';
    if (pm.length>1){ h+='<div class="gram-qs-fieldlbl">Πώς θες να παίξεις;</div>'+
      '<div class="lmode-sel" style="grid-template-columns:repeat('+Math.min(pm.length,2)+',1fr);">'+
      pm.map(p=>'<div class="lmode-btn'+(S.pvp===p.pvp?' selected':'')+'" data-pvp="'+(p.pvp?1:0)+'"><span class="lm-icon">'+_gramModeIcon(p.pvp?'arcade':'fw')+'</span><span>'+_gramEsc(p.t)+'</span>'+(p.d?'<span class="lm-hint">'+_gramEsc(p.d)+'</span>':'')+'</div>').join('')+'</div>'; }
    const curMode = pm.find(p=>p.pvp===S.pvp);
    if (S.pvp && curMode && curMode.join){
      h+='<div class="gram-qs-fieldlbl">Σύνδεση</div><div class="gpx-seg" id="gram-qs-join">'+
        '<button type="button" class="gpx-segbtn'+(S.join!=='qr'?' on':'')+'" data-j="local">Ίδια Συσκευή</button>'+
        '<button type="button" class="gpx-segbtn'+(S.join==='qr'?' on':'')+'" data-j="qr">Μοιράσου · QR</button></div>';
    }
    return h+'<button class="lbtn lbtn-primary gram-qs-go" id="gram-qs-go">Εκκίνηση →</button>';
  };
  const close = () => { ov.classList.remove('active'); if(ov._onKey){ document.removeEventListener('keydown',ov._onKey); ov._onKey=null; } };
  const launch = () => {
    if (S.kind==='quiz'){
      const set=(sid,v)=>{ const s=document.getElementById(sid); if(s){ s.value=v; s.dispatchEvent(new Event('change',{bubbles:true})); } };
      set(opts.modeSelId||(prefix+'-sel-mode'),S.id); set(prefix+'-sel-time',S.time); set(prefix+'-sel-lives',S.lives);
      (opts.extras||[]).forEach(ex=>set(ex.selId, S.extras[ex.selId]!=null?S.extras[ex.selId]:ex.default));
      close();
      if (typeof opts.onLaunch==='function') opts.onLaunch();
    } else if (S.kind==='arcade' && datasetId){
      close();
      if (typeof opts.onClose==='function') opts.onClose();
      const ids = selLevelIds();
      if (typeof initGameWithData==='function'){
        try { initGameWithData(S.id, datasetId, { pvp:S.pvp, levelIds: ids.length?ids:'ALL', levelId: ids[0]!=null?ids[0]:null, lang:(typeof siteLang!=='undefined'?siteLang:'gr'), playerCount:2, joinMethod:(S.join||'local') }); }
        catch(err){ console.error('[gram arcade]', err); }
      }
    }
  };
  const render = () => {
    ov.innerHTML = '<div class="gram-qs-inner gpx-pick"><div class="gram-qs-top">'+
        '<button class="lback-link" id="gram-qs-back">← Επίπεδα</button>'+
        '<button class="gram-qs-home" id="gram-qs-home" title="Αρχική σελίδα">Symposi<b>ON</b></button></div>'+
      '<h2>'+_gramEsc(opts.title?opts.title+' — Διάλεξε τρόπο':'Διάλεξε τρόπο')+'</h2>'+
      '<div class="gpx-body">'+railHTML()+'<div class="gpx-detail">'+detailHTML()+'</div></div></div>';
    ov.querySelector('#gram-qs-back').onclick=()=>{ close(); };
    const hb=ov.querySelector('#gram-qs-home'); if(hb)hb.onclick=()=>{ close(); if(typeof opts.onClose==='function')opts.onClose(); if(typeof goTo==='function')goTo('home'); };
    ov.querySelectorAll('.gpx-railitem').forEach(b=>b.onclick=()=>{
      S.kind=b.dataset.kind; S.id=b.dataset.id;
      if (S.kind==='arcade'){ const e=engines.find(x=>x.id===S.id); const pm=(typeof _ecmModesFor==='function')?_ecmModesFor(e):[]; S.pvp = pm[0]?pm[0].pvp:false; }
      render();
    });
    const wseg=(id,key)=>{ const el=ov.querySelector('#'+id); if(el)el.querySelectorAll('.gpx-segbtn').forEach(b=>b.onclick=()=>{ S[key]=b.dataset.v; el.querySelectorAll('.gpx-segbtn').forEach(x=>x.classList.toggle('on',x===b)); }); };
    wseg('gram-qs-time','time'); wseg('gram-qs-lives','lives');
    (opts.extras||[]).forEach((ex,i)=>{ const el=ov.querySelector('#gram-qs-extra-'+i); if(el)el.querySelectorAll('.gpx-segbtn').forEach(b=>b.onclick=()=>{ S.extras[ex.selId]=b.dataset.v; el.querySelectorAll('.gpx-segbtn').forEach(x=>x.classList.toggle('on',x===b)); }); });
    ov.querySelectorAll('[data-pvp]').forEach(b=>b.onclick=()=>{ S.pvp=b.dataset.pvp==='1'; render(); });
    const jn=ov.querySelector('#gram-qs-join'); if(jn)jn.querySelectorAll('.gpx-segbtn').forEach(b=>b.onclick=()=>{ S.join=b.dataset.j; jn.querySelectorAll('.gpx-segbtn').forEach(x=>x.classList.toggle('on',x===b)); });
    if (typeof createFavBtn==='function'){
      ov.querySelectorAll('.gpx-railitem[data-kind="arcade"]').forEach(b=>{ const fav=createFavBtn(b.dataset.id); fav.classList.add('gram-qs-railfav'); fav.addEventListener('click',e=>e.stopPropagation(),true); b.appendChild(fav); });
    }
    const go=ov.querySelector('#gram-qs-go'); if(go)go.onclick=()=>launch();
  };
  render();
  ov.classList.add('active');
  if (ov._onKey) document.removeEventListener('keydown', ov._onKey);
  ov._onKey = (e)=>{ if(e.key==='Enter' && S.kind && ov.classList.contains('active')){ const go=ov.querySelector('#gram-qs-go'); if(go){ e.preventDefault(); go.click(); } } };
  document.addEventListener('keydown', ov._onKey);
}

// ── CLEANUP REGISTRY ──
// Stores a stop-function per prefix so closeXxx() can always kill a running timer
const _gramCleanup={};
// Tracks which level ID is currently selected per prefix (for config QR + progress save)
const _gramCurrentLvlId={};

// Navigate to the levels screen within an overlay without closing it
function _goToGameLevels(prefix) {
  (_gramCleanup[prefix] || function(){})();
  const wrap = document.getElementById(prefix + '-wrap');
  if (!wrap) return;
  wrap.querySelectorAll('.lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(prefix + '-screen-levels')?.classList.add('active');
}

// ── MODE SELECTOR ──
const _gramModes={};
function gramSetMode(prefix,mode){
  _gramModes[prefix]=mode;
  const sett=document.getElementById(`${prefix}-screen-settings`);
  if(sett)sett.querySelectorAll('.lmode-btn').forEach(b=>{
    const m=b.id.slice(`${prefix}-mode-`.length);
    b.classList.toggle('selected',m===mode);
  });
  const btn=document.getElementById(`${prefix}-launch-btn`);
  if(btn){btn.style.opacity='1';btn.style.pointerEvents='auto';}
  // Enable config QR only when a level has been selected
  const qb=document.getElementById(`${prefix}-sett-qr`);
  if(qb&&_gramCurrentLvlId[prefix]){
    qb.style.opacity='1';qb.style.pointerEvents='auto';
    const modeNames={mc:'Πολλαπλή Επιλογή',fi:'Συμπλήρωση Κενού',fw:'Ολόκληρος Τύπος',match:'Αντιστοίχιση',chrono:'Χρονική Αντικατάσταση'};
    const titleEl=document.getElementById(`${prefix}-sett-title`);
    const title=titleEl?titleEl.textContent:'Παιχνίδι';
    qb.onclick=()=>showQR(`${title} — ${modeNames[mode]||mode}`,{nav:'game',id:prefix,level:_gramCurrentLvlId[prefix],mode});
  }
}
function gramGetMode(prefix){return _gramModes[prefix]||'mc';}

// ── VERB PILL SELECTOR (for rimata-mi) ──
function gramBuildVerbPills(prefix,verbs,allSelectedByDefault){
  const c=document.getElementById(`${prefix}-verb-selector`);if(!c)return;
  c.innerHTML=`<h3>Επίλεξε Ρήματα</h3><div class="lcheck-grid" id="${prefix}-verb-pills"></div>`;
  const grid=document.getElementById(`${prefix}-verb-pills`);
  verbs.forEach(v=>{
    const l=document.createElement('label');l.className='lcheck-pill'+(allSelectedByDefault?' checked':'');
    l.innerHTML=`<input type="checkbox" value="${v}"${allSelectedByDefault?' checked':''}><span>${v}</span>`;
    l.querySelector('input').addEventListener('change',function(){l.classList.toggle('checked',this.checked);});
    grid.appendChild(l);
  });
}
function gramGetSelectedVerbs(prefix){
  return Array.from(document.querySelectorAll(`#${prefix}-verb-pills input:checked`)).map(i=>i.value);
}

// ── MATCH MODE ENGINE ──
const _gramMatchState={};
const _gramMatchDoneHook={}; // per-prefix callback called when all match pairs are done; receives state

function gramStartMatch(prefix,G,keysFn,stemFn,qtFn,filter,wrapId){
  if(_gramCleanup[prefix])_gramCleanup[prefix]();

  const keys=keysFn(filter);
  if(!keys.length){alert('Δεν βρέθηκαν ερωτήσεις.');return;}

  // Build pair objects
  const pairs=keys.map(key=>{
    const g=G[key];
    const stem=stemFn(g);
    const fi_ends=g.fi_endings||g.endings;
    const fw_correct=stem.endsWith('-')?stem.slice(0,-1)+(fi_ends[0]||''):g.endings[0];
    // Extract grammatical label from qt tags
    const tmp=document.createElement('div');tmp.innerHTML=qtFn(g);
    const tags=[...tmp.querySelectorAll('.lq-tag')].map(el=>el.textContent).join(' · ');
    const main=tmp.querySelector('.lq-main');
    const label=tags||(main?main.textContent:fw_correct);
    return{key,label,form:fw_correct};
  });
  // Shuffle
  pairs.sort(()=>Math.random()-.5);

  const state={
    pairs,batchSize:5,batchOffset:0,
    score:0,total:pairs.length,
    currentBatch:null,rightOrder:null,
    batchMatchedCount:0,
    selectedLeft:null,selectedRight:null,
    wrapId,
  };
  _gramMatchState[prefix]=state;
  _gramCleanup[prefix]=()=>{delete _gramMatchState[prefix];};

  // Show match screen
  document.querySelectorAll(`#${wrapId} .lyo-screen`).forEach(s=>s.classList.remove('active'));
  document.getElementById(`${prefix}-screen-match`)?.classList.add('active');
  gramRenderMatchBatch(prefix);
}

function gramRenderMatchBatch(prefix){
  const state=_gramMatchState[prefix];if(!state)return;
  const{pairs,batchOffset,batchSize,score,total}=state;

  const end=Math.min(batchOffset+batchSize,pairs.length);
  const batch=pairs.slice(batchOffset,end);
  state.currentBatch=batch;
  state.rightOrder=[...batch].sort(()=>Math.random()-.5);
  state.batchMatchedCount=0;
  state.selectedLeft=null;state.selectedRight=null;

  const scoreEl=document.getElementById(`${prefix}-match-score`);
  if(scoreEl)scoreEl.textContent=`${score}/${total}`;
  const lbl=document.getElementById(`${prefix}-match-lbl`);
  if(lbl)lbl.textContent=`Ζεύγη ${batchOffset+1}–${end} από ${total}`;

  const body=document.getElementById(`${prefix}-match-body`);
  if(!body)return;
  body.innerHTML=`<div class="syn-match-cols"><div class="syn-match-col syn-match-left" id="${prefix}-match-left" data-label="Γραμματικός Τύπος"></div><div class="syn-match-col syn-match-right" id="${prefix}-match-right" data-label="Μορφή"></div></div>`;

  const leftCol=document.getElementById(`${prefix}-match-left`);
  const rightCol=document.getElementById(`${prefix}-match-right`);

  batch.forEach((pair,idx)=>{
    const c=document.createElement('div');
    c.className='syn-match-card syn-left-card';c.dataset.idx=idx;
    c.textContent=pair.label;
    c.onclick=()=>gramMatchClickLeft(prefix,idx);
    leftCol.appendChild(c);
  });
  state.rightOrder.forEach((pair,idx)=>{
    const c=document.createElement('div');
    c.className='syn-match-card syn-right-card';c.dataset.idx=idx;
    c.textContent=pair.form;
    c.onclick=()=>gramMatchClickRight(prefix,idx);
    rightCol.appendChild(c);
  });

  const fb=document.getElementById(`${prefix}-match-fb`);
  if(fb){fb.textContent='';fb.className='lfeedback';}
}

function gramMatchClickLeft(prefix,li){
  const state=_gramMatchState[prefix];if(!state)return;
  const leftCol=document.getElementById(`${prefix}-match-left`);if(!leftCol)return;
  const card=leftCol.children[li];
  if(!card||card.classList.contains('syn-matched'))return;
  leftCol.querySelectorAll('.syn-match-card:not(.syn-matched)').forEach(c=>c.classList.remove('syn-selected'));
  card.classList.add('syn-selected');
  state.selectedLeft=li;
  if(state.selectedRight!==null)_gramMatchCheck(prefix);
}

function gramMatchClickRight(prefix,ri){
  const state=_gramMatchState[prefix];if(!state)return;
  const rightCol=document.getElementById(`${prefix}-match-right`);if(!rightCol)return;
  const card=rightCol.children[ri];
  if(!card||card.classList.contains('syn-matched'))return;
  rightCol.querySelectorAll('.syn-match-card:not(.syn-matched)').forEach(c=>c.classList.remove('syn-selected'));
  card.classList.add('syn-selected');
  state.selectedRight=ri;
  if(state.selectedLeft!==null)_gramMatchCheck(prefix);
}

function _gramMatchCheck(prefix){
  const state=_gramMatchState[prefix];if(!state)return;
  const li=state.selectedLeft,ri=state.selectedRight;
  const leftPair=state.currentBatch[li];
  const rightPair=state.rightOrder[ri];
  const leftCol=document.getElementById(`${prefix}-match-left`);
  const rightCol=document.getElementById(`${prefix}-match-right`);
  const lc=leftCol?.children[li];
  const rc=rightCol?.children[ri];
  const fb=document.getElementById(`${prefix}-match-fb`);

  if(leftPair.key===rightPair.key){
    lc?.classList.remove('syn-selected');lc?.classList.add('syn-matched');
    rc?.classList.remove('syn-selected');rc?.classList.add('syn-matched');
    state.batchMatchedCount++;
    state.score++;
    const scoreEl=document.getElementById(`${prefix}-match-score`);
    if(scoreEl)scoreEl.textContent=`${state.score}/${state.total}`;
    if(fb){fb.textContent='✓ Σωστό!';fb.className='lfeedback lok';}
    state.selectedLeft=null;state.selectedRight=null;
    if(state.batchMatchedCount===state.currentBatch.length){
      setTimeout(()=>gramMatchDone(prefix),700);
    }
  }else{
    lc?.classList.add('syn-wrong');rc?.classList.add('syn-wrong');
    if(fb){fb.textContent='✗ Λάθος ζεύγος!';fb.className='lfeedback lerr';}
    setTimeout(()=>{
      const st=_gramMatchState[prefix];if(!st)return;
      lc?.classList.remove('syn-wrong','syn-selected');
      rc?.classList.remove('syn-wrong','syn-selected');
      st.selectedLeft=null;st.selectedRight=null;
      const fb2=document.getElementById(`${prefix}-match-fb`);
      if(fb2){fb2.textContent='';fb2.className='lfeedback';}
    },900);
  }
}

function gramMatchDone(prefix){
  const state=_gramMatchState[prefix];if(!state)return;
  state.batchOffset+=state.batchSize;
  if(state.batchOffset>=state.pairs.length){
    // Save progress — match mode = always completed when all pairs matched
    if(_gramCurrentLvlId[prefix]){
      try{
        const pkey=`${prefix}_prog_${_gramCurrentLvlId[prefix]}`;
        const prev=JSON.parse(localStorage.getItem(pkey)||'{}');
        localStorage.setItem(pkey,JSON.stringify({best:Math.max(state.total,prev.best||0),completed:true,ts:Date.now()}));
        if(_gramLevelRefresh[prefix])_gramLevelRefresh[prefix]();
      }catch(e){}
    }
    // ── Temple rewards (config-driven; match mode = full clear) ──
    if(typeof awardGameRewards==='function' && state.total>0){
      awardGameRewards(prefix,{score:state.total,perfect:true});
    }
    // Custom hook for games with multi-pack or custom progress save (e.g. Latin games)
    if(_gramMatchDoneHook[prefix]){
      try{ _gramMatchDoneHook[prefix](state); }catch(e){}
    }
    // All pairs matched — show completion panel
    const body=document.getElementById(`${prefix}-match-body`);
    if(body)body.innerHTML=`<div style="text-align:center;padding:32px 0;"><div style="font-size:3rem;margin-bottom:12px;">🎉</div><div style="font-size:1.4rem;color:#e8dcc8;font-family:'Cinzel',serif;">Τέλειο!</div><div style="font-size:1rem;color:#8a7a60;margin:8px 0 20px;">Αντιστοιχίσατε και τα ${state.total} ζεύγη</div><button class="lbtn lbtn-primary" onclick="gramMatchRestart('${prefix}')">Ξανά →</button></div>`;
    const fb=document.getElementById(`${prefix}-match-fb`);
    if(fb){fb.textContent='';fb.className='lfeedback';}
  }else{
    gramRenderMatchBatch(prefix);
  }
}

function gramMatchRestart(prefix){
  const state=_gramMatchState[prefix];if(!state)return;
  state.pairs.sort(()=>Math.random()-.5);
  state.batchOffset=0;state.score=0;
  gramRenderMatchBatch(prefix);
}

function gramMatchExit(prefix){
  const state=_gramMatchState[prefix];if(!state)return;
  const wrapId=state.wrapId;
  delete _gramMatchState[prefix];
  document.querySelectorAll(`#${wrapId} .lyo-screen`).forEach(s=>s.classList.remove('active'));
  // Fall back to levels screen if no settings screen exists
  const target=document.getElementById(`${prefix}-screen-settings`)||document.getElementById(`${prefix}-screen-levels`);
  target?.classList.add('active');
}
