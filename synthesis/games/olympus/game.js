/* ══════════════════ ΑΝΑΒΑΣΙΣ — engine ══════════════════
   Millionaire-style tier ladder reimagined as the climb to Olympus.
   Answer to climb a rung; safe sanctuaries bank your ascent; a wrong
   answer casts you down to the last sanctuary. Reach the Throne of Zeus.
   API:  Olympus.open()   Olympus.close()
   Reads window.SYM_QUESTIONS and window.siteLang ('gr'|'en').
═════════════════════════════════════════════════════════════════════ */
const Olympus = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.AO_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  // Ascent length is chosen at the start. Rungs are generated; ⛩ marks a banked sanctuary.
  const LEVELS = {
    short:  { n:12, label:{gr:'ΣΥΝΤΟΜΗ',en:'SHORT'},  sub:{gr:'12 ερωτήσεις',en:'12 questions'} },
    normal: { n:24, label:{gr:'ΚΑΝΟΝΙΚΗ',en:'NORMAL'}, sub:{gr:'24 ερωτήσεις',en:'24 questions'} },
    epic:   { n:40, label:{gr:'ΕΠΙΚΗ',en:'EPIC'},     sub:{gr:'40 ερωτήσεις',en:'40 questions'} },
  };
  const NAMEPOOL = [['Πιερία','Pieria'],['Τὰ Δάση','The Forests'],['Αἱ Πηγαί','The Springs'],['Τὰ Φαράγγια','The Ravines'],['Αἱ Νεφέλαι','The Clouds'],['Ἡ Αἴθρα','The Upper Air'],['Οἱ Κρημνοί','The Crags'],['Ὁ Αἰθήρ','The Aether'],['Αὐλὴ τῶν Θεῶν','Court of the Gods']];
  function genRungs(n){
    const arr=[{gr:'Πρόποδες',en:'Foothills'}];
    const cp=Math.max(3, Math.round(n/4));
    for(let i=1;i<n;i++){
      if(i%cp===0) arr.push({gr:'Τέμενος',en:'Sanctuary',safe:true});
      else { const p=NAMEPOOL[(i-1)%NAMEPOOL.length]; arr.push({gr:p[0],en:p[1]}); }
    }
    arr.push({gr:'Θρόνος Διός',en:'Throne of Zeus',summit:true});
    return arr;
  }
  let RUNGS = genRungs(24);
  let TOP = RUNGS.length - 1;

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('ao:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#ao-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('ao-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('ao-screen-intro')) build();
    syncLang();
    show('ao-screen-intro');
  }
  function close() {
    document.getElementById('ao-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('ao-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'ao-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeOlympus()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u0391\u039d\u0391\u0392\u0391\u03a3\u0399\u03a3') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="ao-wrap"></div></div>';
    document.body.appendChild(ov);
    ov.querySelectorAll('.ov-lang button').forEach(b=>{
      b.addEventListener('click', ()=>{
        window.siteLang = b.dataset.lang;
        ov.querySelectorAll('.ov-lang button').forEach(x=>x.classList.toggle('on', x===b));
        syncLang();
      });
    });
  }

  /* ───────── build ───────── */
  function build() {
    document.getElementById('ao-wrap').innerHTML = `
<!-- INTRO -->
<div id="ao-screen-intro" class="ao-screen">
  ${mountainSVG('ao-mtn')}
  <div class="ao-logo">ΑΝΑΒΑΣΙΣ</div>
  <div class="ao-logo-en" data-i18n="subtitle"></div>
  <div class="ao-intro-txt" data-i18n="intro"></div>
  <div class="ao-levels" id="ao-levels"></div>
</div>

<!-- GAME -->
<div id="ao-screen-game" class="ao-screen">
  <div class="ao-arena">
    <aside class="ao-ladder" id="ao-ladder"></aside>
    <div class="ao-main">
      <div class="ao-q-meta">
        <span class="ao-q-num" id="ao-qnum"></span>
        <span class="ao-q-line"></span>
        <span class="ao-altitude" id="ao-altitude"></span>
      </div>
      <div class="ao-q-card"><div class="ao-q-text" id="ao-qtext"></div></div>
      <div class="ao-answers" id="ao-answers"></div>
      <div class="ao-feedback" id="ao-feedback"></div>
      <div class="ao-lifelines">
        <button class="ao-life" id="ao-life-muse" onclick="Olympus._muse()">
          <span class="ao-life-ic">𓏲</span><span class="ao-life-tx" data-i18n="muse"></span>
        </button>
        <button class="ao-life" id="ao-life-oracle" onclick="Olympus._oracle()">
          <span class="ao-life-ic">◓</span><span class="ao-life-tx" data-i18n="oracle"></span>
        </button>
      </div>
    </div>
  </div>
</div>

<!-- END -->
<div id="ao-screen-end" class="ao-screen">
  <div id="ao-end-art"></div>
  <div class="ao-end-title" id="ao-end-title"></div>
  <div class="ao-end-sub" id="ao-end-sub"></div>
  <div class="ao-end-rung" id="ao-end-rung"></div>
  <div class="ao-end-btns">
    <button class="sym-btn" onclick="Olympus._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Olympus.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    subtitle:{ gr:'Η ανάβαση στον Όλυμπο', en:'The Ascent of Olympus' },
    intro:   { gr:'Κάθε σωστή απάντηση σε ανεβάζει μία βαθμίδα προς τον <b>Θρόνο του Διός</b>. Τα <b>τεμένη</b> (⛩) κατοχυρώνουν την άνοδό σου· ένα λάθος σε ρίχνει στο τελευταίο τέμενος. Φτάσε στην κορυφή.', en:'Each correct answer lifts you one rung toward the <b>Throne of Zeus</b>. <b>Sanctuaries</b> (⛩) bank your ascent; a wrong answer casts you back to the last one. Reach the summit.' },
    begin:   { gr:'ΑΡΧΙΣΕ ΤΗΝ ΑΝΑΒΑΣΗ', en:'BEGIN THE ASCENT' },
    muse:    { gr:'ΜΟΥΣΑ · 50:50', en:'MUSE · 50:50' },
    oracle:  { gr:'ΜΑΝΤΕΙΟ · ΟΡΑΜΑ', en:'ORACLE · VISION' },
    again:   { gr:'ΝΕΑ ΑΝΑΒΑΣΗ', en:'CLIMB AGAIN' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#ao-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    renderLevels();
    if (st && st.cur && document.getElementById('ao-screen-game').classList.contains('active')) {
      document.getElementById('ao-qtext').textContent = st.cur.q[L()];
      renderLadder(); renderMeta();
    }
  }
  function renderLevels(){
    const wrap=document.getElementById('ao-levels'); if(!wrap) return;
    wrap.innerHTML = Object.keys(LEVELS).map(k=>{
      const lv=LEVELS[k];
      return `<button class="ao-level" onclick="Olympus._level('${k}')"><span class="ao-level-name">${lv.label[L()]}</span><span class="ao-level-sub">${lv.sub[L()]}</span></button>`;
    }).join('');
  }
  function _level(k){ st.levelKey=k; _start(); }
  function show(id){ document.querySelectorAll('#ao-wrap .ao-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _start() {
    const lvlKey = st.levelKey || 'normal';
    RUNGS = genRungs(LEVELS[lvlKey].n); TOP = RUNGS.length - 1;
    st = {
      levelKey:lvlKey,
      rung:0, lastSafe:0, qNum:0, answered:false, glory:0,
      pool: shuffle([..._gpPool()]), idx:0,
      muse:true, oracle:true, fiftyHidden:[],
    };
    show('ao-screen-game');
    document.getElementById('ao-life-muse').classList.remove('spent');
    document.getElementById('ao-life-oracle').classList.remove('spent');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  /* ───────── ladder render ───────── */
  function renderLadder() {
    const lad = document.getElementById('ao-ladder');
    const WIN=9;
    let start = TOP<=WIN-1 ? 0 : Math.max(0, Math.min(st.rung-4, TOP-WIN+1));
    let end = Math.min(TOP, start+WIN-1);
    const items=[];
    for (let i=start;i<=end;i++){
      const r=RUNGS[i], cls=['ao-rung'];
      if (i===st.rung) cls.push('cur');
      if (i<st.rung) cls.push('passed');
      if (r.safe) cls.push('safe');
      if (r.summit) cls.push('summit');
      const mark = r.summit ? '♕' : (r.safe ? '⛩' : '');
      items.push(`<div class="${cls.join(' ')}">
        <span class="ao-rung-n">${String(i).padStart(2,'0')}</span>
        <span class="ao-rung-name">${r[L()]}</span>
        <span class="ao-rung-mark">${mark}</span>
        ${i===st.rung?'<span class="ao-climber">▲</span>':''}
      </div>`);
    }
    items.reverse();
    let html=items.join('');
    if (end<TOP) html = `<div class="ao-rung-ell">⋯ +${TOP-end}</div>`+html;
    if (start>0) html = html+`<div class="ao-rung-ell">⋯ ${start}</div>`;
    lad.innerHTML=html;
  }
  function renderMeta() {
    document.getElementById('ao-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum;
    document.getElementById('ao-altitude').textContent = T('ΒΑΘΜΙΔΑ ','RUNG ')+st.rung+' / '+TOP;
  }

  /* ───────── loop ───────── */
  function nextQ() {
    st.answered=false; st.cur=getQ(); st.qNum++; st.fiftyHidden=[];
    document.getElementById('ao-qtext').textContent = st.cur.q[L()];
    const fb=document.getElementById('ao-feedback'); fb.textContent=''; fb.className='ao-feedback';
    const wrap=document.getElementById('ao-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='ao-ans'; b.dataset.i=i;
      b.innerHTML=`<span class="ao-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderLadder(); renderMeta();
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#ao-answers .ao-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('ao-feedback');
    if (chosen===st.cur.c) {
      st.rung++; st.glory += 100 + st.rung*20;
      if (RUNGS[st.rung].safe) st.lastSafe = st.rung;
      _fx('correct',{el:btn});
      if (st.rung>=TOP) {
        fb.textContent=T('ΕΦΤΑΣΕΣ ΤΗΝ ΚΟΡΥΦΗ','YOU REACHED THE SUMMIT'); fb.className='ao-feedback ao-fb-ok';
        renderLadder(); renderMeta();
        return setTimeout(()=>end(true), 1100);
      }
      const banked = RUNGS[st.rung].safe;
      fb.textContent = banked ? T('ΣΩΣΤΟ — τέμενος! Η άνοδος κατοχυρώθηκε','CORRECT — sanctuary! Ascent banked')
                              : T('ΣΩΣΤΟ — ανεβαίνεις','CORRECT — you climb');
      fb.className='ao-feedback ao-fb-ok';
      renderLadder(); renderMeta();
      setTimeout(nextQ, 1150);
    } else {
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      const fell = st.rung - st.lastSafe;
      st.rung = st.lastSafe;
      if (fell<=0) {
        fb.textContent=T('ΛΑΘΟΣ — γκρεμίστηκες από τον Όλυμπο','WRONG — cast down from Olympus'); fb.className='ao-feedback ao-fb-bad';
        renderLadder(); renderMeta();
        return setTimeout(()=>end(false), 1500);
      }
      fb.textContent=T(`ΛΑΘΟΣ — πέφτεις στο τέμενος (βαθμ. ${st.lastSafe})`,`WRONG — you fall to the sanctuary (rung ${st.lastSafe})`);
      fb.className='ao-feedback ao-fb-bad';
      renderLadder(); renderMeta();
      setTimeout(nextQ, 1600);
    }
  }

  /* ───────── lifelines ───────── */
  function _muse() {
    if (!st.muse || st.answered) return; st.muse=false;
    document.getElementById('ao-life-muse').classList.add('spent');
    const wrong = [0,1,2,3].filter(i=>i!==st.cur.c);
    shuffle(wrong); const hide=[wrong[0],wrong[1]];
    document.querySelectorAll('#ao-answers .ao-ans').forEach(b=>{ if(hide.includes(+b.dataset.i)){ b.classList.add('hidden'); b.disabled=true; } });
    _fx('muse');
  }
  function _oracle() {
    if (!st.oracle || st.answered) return; st.oracle=false;
    document.getElementById('ao-life-oracle').classList.add('spent');
    const b = document.querySelector(`#ao-answers .ao-ans[data-i="${st.cur.c}"]`);
    if (b) b.classList.add('vision');
    _fx('oracle');
    const fb=document.getElementById('ao-feedback');
    fb.textContent=T('Η Πυθία ψιθυρίζει…','The Pythia whispers…'); fb.className='ao-feedback ao-fb-hint';
  }

  /* ───────── end ───────── */
  function end(won) {
    show('ao-screen-end');
    _fx(won?'win':'lose');
    document.getElementById('ao-end-art').innerHTML = won ? boltSVG('ao-end-bolt') : mountainSVG('ao-end-mtn');
    const title=document.getElementById('ao-end-title'), sub=document.getElementById('ao-end-sub');
    if (won) {
      title.textContent=T('ΑΘΑΝΑΣΙΑ','IMMORTALITY'); title.className='ao-end-title win';
      sub.textContent=T('Ανέβηκες στον Θρόνο του Διός και κάθισες ανάμεσα στους αθανάτους. Δόξα αἰώνιος.','You climbed to the Throne of Zeus and sat among the immortals. Glory everlasting.');
    } else {
      title.textContent=T('Η ΠΤΩΣΗ','THE FALL'); title.className='ao-end-title lose';
      sub.textContent=T(`Έφτασες ως τη βαθμίδα «${RUNGS[st.rung][L()]}». Ο Όλυμπος περιμένει την επόμενη ανάβαση.`,`You reached "${RUNGS[st.rung][L()]}". Olympus awaits your next ascent.`);
    }
    document.getElementById('ao-end-rung').innerHTML =
      `<div class="ao-end-glory">${T('ΔΟΞΑ','GLORY')} <b>${st.glory}</b></div>
       <div class="ao-end-rungname">${T('Υψηλότερη βαθμίδα','Highest rung')}: ${RUNGS[won?TOP:st.rung][L()]}</div>`;
  }

  /* ───────── art ───────── */
  function mountainSVG(cls){ return `<svg class="${cls}" viewBox="0 0 140 120" fill="none">
    <defs><linearGradient id="ao-m1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E3C766"/><stop offset="1" stop-color="#8E7322"/></linearGradient>
    <linearGradient id="ao-m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E5A1E"/><stop offset="1" stop-color="#3A2F12"/></linearGradient></defs>
    <path d="M8 112L52 28l20 34 14-22 38 72z" fill="url(#ao-m2)" stroke="#2A2210" stroke-width="2"/>
    <path d="M52 28l-14 30h28z" fill="#F3ECDC"/><path d="M86 40l-9 18h18z" fill="#F3ECDC"/>
    <path d="M70 2l4 12 12-2-8 10 8 10-12-2-4 12-4-12-12 2 8-10-8-10 12 2z" fill="url(#ao-m1)" opacity="0.95"/>
  </svg>`; }
  function boltSVG(cls){ return `<svg class="${cls}" viewBox="0 0 120 120" fill="none">
    <defs><radialGradient id="ao-b1" cx="50%" cy="40%"><stop offset="0" stop-color="#F3ECDC"/><stop offset="0.5" stop-color="#E3C766"/><stop offset="1" stop-color="#8E7322"/></radialGradient></defs>
    <circle cx="60" cy="58" r="50" fill="none" stroke="#C4A448" stroke-opacity="0.4" stroke-width="2" stroke-dasharray="4 6"/>
    <path d="M66 8L34 64h22l-8 48 44-66H66l10-38z" fill="url(#ao-b1)" stroke="#6E5A1E" stroke-width="2" stroke-linejoin="round"/>
  </svg>`; }

  return { open, close, _start, _level, _muse, _oracle, syncLang };
})();
window.Olympus = Olympus;

/* ── Games-Panel entry points ── */
window.openOlympus  = function(gp){ Olympus.open(gp || {}); };
window.closeOlympus = function(){ Olympus.close(); };
