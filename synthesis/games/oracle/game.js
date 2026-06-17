/* ══════════════════ ΜΑΝΤΕΙΟΝ — engine ══════════════════
   Jeopardy-style wager reimagined as the Oracle of Delphi.
   Each round you stake your wisdom before the Pythia's question — answer
   right to multiply it, wrong to lose your stake. Outlast rival seekers.
   API:  Oracle.open()   Oracle.close()
═══════════════════════════════════════════════════════════════════ */
const Oracle = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.OR_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const ROUNDS = 8;
  const START  = 500;
  const RIVALS = ['ΣΙΒΥΛΛΑ','ΤΕΙΡΕΣΙΑΣ','ΚΑΛΧΑΣ'];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('or:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#or-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('or-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('or-screen-intro')) build();
    syncLang();
    show('or-screen-intro');
  }
  function close() {
    document.getElementById('or-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('or-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'or-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeOracle()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u039c\u0391\u039d\u03a4\u0395\u0399\u039f\u039d') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="or-wrap"></div></div>';
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
    document.getElementById('or-wrap').innerHTML = `
<!-- INTRO -->
<div id="or-screen-intro" class="or-screen">
  ${tripodSVG('or-tripod')}
  <div class="or-logo">ΜΑΝΤΕΙΟΝ</div>
  <div class="or-logo-en" data-i18n="subtitle"></div>
  <div class="or-intro-txt" data-i18n="intro"></div>
  <button class="sym-btn" onclick="Oracle._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="or-screen-game" class="or-screen">
  <div class="or-top">
    <div class="or-wisdom">
      <span class="or-wisdom-lbl" data-i18n="wisdom"></span>
      <span class="or-wisdom-val" id="or-wisdom">0</span>
    </div>
    <div class="or-round" id="or-round"></div>
  </div>
  <div class="or-board" id="or-board"></div>

  <div class="or-qbody">
    <div class="or-q-card"><div class="or-q-text" id="or-qtext"></div></div>

    <!-- stake chooser -->
    <div class="or-stake" id="or-stake">
      <div class="or-stake-head" data-i18n="stakehead"></div>
      <div class="or-stake-opts" id="or-stake-opts"></div>
    </div>

    <!-- answers (locked until staked) -->
    <div class="or-answers locked" id="or-answers"></div>
    <div class="or-feedback" id="or-feedback"></div>
    <button class="sym-btn or-cont" id="or-cont" style="display:none" onclick="Oracle._next()"></button>
  </div>
</div>

<!-- END -->
<div id="or-screen-end" class="or-screen">
  <div id="or-end-art"></div>
  <div class="or-end-title" id="or-end-title"></div>
  <div class="or-end-sub" id="or-end-sub"></div>
  <div class="or-final-board" id="or-final-board"></div>
  <div class="or-end-btns">
    <button class="sym-btn" onclick="Oracle._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Oracle.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    subtitle:{ gr:'Το μαντείο των Δελφών', en:'The Oracle of Delphi' },
    intro:   { gr:'Στάσου μπροστά στην <b>Πυθία</b>. Σε κάθε χρησμό, πόντισε τη <b>σοφία</b> σου πριν δεις την απάντηση — σωστά την <b>διπλασιάζεις</b>, λάθος τη χάνεις. Όποιος μαζέψει την περισσότερη σοφία κερδίζει την εύνοια του Απόλλωνα.', en:'Stand before the <b>Pythia</b>. Each oracle, stake your <b>wisdom</b> before you see the answer — right and you <b>multiply</b> it, wrong and you lose the stake. Whoever gathers the most wisdom wins Apollo\u2019s favour.' },
    begin:   { gr:'ΖΗΤΗΣΕ ΧΡΗΣΜΟ', en:'SEEK THE ORACLE' },
    wisdom:  { gr:'ΣΟΦΙΑ', en:'WISDOM' },
    stakehead:{ gr:'ΠΟΣΗ ΣΟΦΙΑ ΠΟΝΤΑΡΕΙΣ;', en:'HOW MUCH WISDOM DO YOU STAKE?' },
    again:   { gr:'ΝΕΟΣ ΧΡΗΣΜΟΣ', en:'NEW ORACLE' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#or-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('or-screen-game').classList.contains('active')) {
      if (st.staked) document.getElementById('or-qtext').textContent = st.cur.q[L()];
      else document.getElementById('or-qtext').textContent = T('Η Πυθία ετοιμάζει χρησμό… πόνταρε πρώτα.','The Pythia prepares an oracle… stake first.');
      renderTop(); renderBoard();
      if (!st.staked) renderStakes();
    }
  }
  function show(id){ document.querySelectorAll('#or-wrap .or-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _start() {
    st = {
      wisdom:START, round:0, answered:false, staked:false, stake:0,
      pool: shuffle([..._gpPool()]), idx:0,
      rivals: RIVALS.map(n=>({ name:n, wisdom:START })),
    };
    show('or-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), wisdom:st.wisdom, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.wisdom-a.wisdom);
    return all;
  }
  function renderTop() {
    document.getElementById('or-wisdom').textContent = st.wisdom;
    document.getElementById('or-round').textContent = T('ΧΡΗΣΜΟΣ ','ORACLE ')+st.round+' / '+ROUNDS;
  }
  function renderBoard() {
    if(window.SymStandings) SymStandings.feed('or', standings(), {key:'wisdom', unit:'σοφία', accent:'var(--sym-aegean)', title:'ΜΑΝΤΕΙΟΝ'});
    document.getElementById('or-board').innerHTML = standings().map((x,i)=>
      `<div class="or-board-chip${x.me?' me':''}"><span class="or-board-rank">${i+1}</span><span class="or-board-name">${x.name}</span><span class="or-board-w">${x.wisdom}</span></div>`
    ).join('');
  }

  /* ───────── stake ───────── */
  function stakeOpts() {
    const w = st.wisdom;
    return [
      { lbl:T('ΣΥΝΕΤΗ','CAUTIOUS'), mult:'×2', amt:Math.max(25, Math.round(w*0.25/5)*5), tone:'safe' },
      { lbl:T('ΤΟΛΜΗΡΗ','BOLD'),    mult:'×2', amt:Math.max(25, Math.round(w*0.5/5)*5),  tone:'bold' },
      { lbl:T('ΟΛΑ ΓΙΑ ΟΛΑ','ALL-IN'), mult:'×2', amt:w, tone:'allin' },
    ];
  }
  function renderStakes() {
    const wrap=document.getElementById('or-stake-opts'); wrap.innerHTML='';
    stakeOpts().forEach(o=>{
      const b=document.createElement('button'); b.className='or-stake-btn '+o.tone;
      b.innerHTML=`<span class="or-stake-lbl">${o.lbl}</span><span class="or-stake-amt">${o.amt}</span>`;
      b.onclick=()=>setStake(o.amt,b); wrap.appendChild(b);
    });
  }
  function setStake(amt, btn) {
    if (st.staked) return; st.staked=true; st.stake=Math.min(amt, st.wisdom);
    document.querySelectorAll('.or-stake-btn').forEach(b=>{ b.disabled=true; if(b!==btn) b.classList.add('dim'); });
    btn.classList.add('chosen');
    const qc=document.querySelector('#or-screen-game .or-q-card'); if(qc) qc.classList.remove('veiled');
    document.getElementById('or-qtext').textContent = st.cur.q[L()];
    if (window.gsap) gsap.fromTo('#or-qtext',{opacity:0,y:10},{opacity:1,y:0,duration:.5,ease:'power3.out'});
    document.getElementById('or-answers').classList.remove('locked');
    if (window.gsap) gsap.fromTo('#or-answers .or-ans',{opacity:0,y:12},{opacity:1,y:0,duration:.4,stagger:.06,ease:'power2.out'});
    const fb=document.getElementById('or-feedback');
    fb.textContent=T(`Πόνταρες ${st.stake} σοφία. Διάλεξε απάντηση.`,`You staked ${st.stake} wisdom. Choose an answer.`); fb.className='or-feedback or-fb-hint';
    _fx('stake');
  }

  /* ───────── loop ───────── */
  function nextQ() {
    st.answered=false; st.staked=false; st.stake=0; st.cur=getQ(); st.round++;
    // gamble first — keep the question veiled until a stake is placed
    const qc=document.querySelector('#or-screen-game .or-q-card'); if(qc) qc.classList.add('veiled');
    document.getElementById('or-qtext').textContent = T('Η Πυθία ετοιμάζει χρησμό… πόνταρε πρώτα.','The Pythia prepares an oracle… stake first.');
    document.getElementById('or-cont').style.display='none';
    const fb=document.getElementById('or-feedback'); fb.textContent=''; fb.className='or-feedback';
    document.getElementById('or-stake').style.display='';
    renderStakes();
    const wrap=document.getElementById('or-answers'); wrap.className='or-answers locked'; wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='or-ans';
      b.innerHTML=`<span class="or-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderTop(); renderBoard();
  }

  function advanceRivals() {
    st.rivals.forEach(r=>{
      const bet = Math.round(r.wisdom*(0.2+Math.random()*0.4)/5)*5;
      if (Math.random()<0.62) r.wisdom += bet; else r.wisdom = Math.max(0, r.wisdom-bet);
    });
  }

  function answer(chosen, btn) {
    if (st.answered || !st.staked) return; st.answered=true;
    document.querySelectorAll('#or-answers .or-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    document.getElementById('or-stake').style.display='none';
    const fb=document.getElementById('or-feedback');
    advanceRivals();
    if (chosen===st.cur.c) {
      st.wisdom += st.stake; _fx('correct',{el:btn});
      fb.textContent=T(`ΑΛΗΘΗΣ ΧΡΗΣΜΟΣ — +${st.stake} σοφία`,`TRUE ORACLE — +${st.stake} wisdom`); fb.className='or-feedback or-fb-ok';
    } else {
      btn.classList.add('wrong'); st.wisdom=Math.max(0, st.wisdom-st.stake); _fx('wrong',{el:btn});
      fb.textContent=T(`ΨΕΥΔΗΣ ΧΡΗΣΜΟΣ — −${st.stake} σοφία`,`FALSE ORACLE — −${st.stake} wisdom`); fb.className='or-feedback or-fb-bad';
    }
    renderTop(); renderBoard();
    const cont=document.getElementById('or-cont');
    cont.textContent = (st.round>=ROUNDS || st.wisdom<=0) ? T('ΑΠΟΤΕΛΕΣΜΑ','RESULT') : T('ΕΠΟΜΕΝΟΣ ΧΡΗΣΜΟΣ','NEXT ORACLE');
    cont.style.display='';
  }

  function _next() {
    if (st.round>=ROUNDS || st.wisdom<=0) return end();
    nextQ();
  }

  /* ───────── end ───────── */
  function end() {
    show('or-screen-end');
    const board = standings();
    const won = board[0].me && st.wisdom>0;
    _fx(won?'win':'lose');
    document.getElementById('or-end-art').innerHTML = tripodSVG('or-end-tripod');
    const title=document.getElementById('or-end-title'), sub=document.getElementById('or-end-sub');
    if (st.wisdom<=0) {
      title.textContent=T('Η ΣΟΦΙΑ ΕΧΑΘΗ','WISDOM SPENT'); title.className='or-end-title lose';
      sub.textContent=T('Πόνταρες τα πάντα και η Πυθία σώπασε. Επίστρεψε στους Δελφούς ξανά.','You staked all and the Pythia fell silent. Return to Delphi again.');
    } else if (won) {
      title.textContent=T('ΕΥΝΟΙΑ ΑΠΟΛΛΩΝΟΣ','APOLLO\u2019S FAVOUR'); title.className='or-end-title win';
      sub.textContent=T('Συγκέντρωσες την περισσότερη σοφία και κέρδισες την εύνοια του θεού του φωτός.','You gathered the most wisdom and won the favour of the god of light.');
    } else {
      title.textContent=T('Ο ΧΡΗΣΜΟΣ ΕΚΛΕΙΣΕ','THE ORACLE CLOSES'); title.className='or-end-title lose';
      sub.textContent=T(`Τελείωσες με ${st.wisdom} σοφία, στη ${board.findIndex(x=>x.me)+1}η θέση. Νικητής: ${board[0].name}.`,`You finished with ${st.wisdom} wisdom, in position ${board.findIndex(x=>x.me)+1}. Winner: ${board[0].name}.`);
    }
    document.getElementById('or-final-board').innerHTML = board.map((x,i)=>
      `<div class="or-final-row${x.me?' me':''}"><span class="or-final-pos">${i+1}</span><span class="or-final-name">${x.name}${i===0?' 🏆':''}</span><span class="or-final-w">${x.wisdom}</span></div>`
    ).join('');
  }

  /* ───────── art ───────── */
  function tripodSVG(cls){ return `<svg class="${cls}" viewBox="0 0 120 140" fill="none">
    <defs><linearGradient id="or-t1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB0BC"/><stop offset="1" stop-color="#3E5E66"/></linearGradient>
    <radialGradient id="or-t2" cx="50%" cy="40%"><stop offset="0" stop-color="#CDE3E8"/><stop offset="1" stop-color="#5E8B96"/></radialGradient></defs>
    <!-- vapor -->
    <path d="M60 40c-8-8-2-20 0-28 4 8 10 18 2 28" fill="none" stroke="#CDE3E8" stroke-width="2" opacity="0.5"/>
    <!-- bowl -->
    <path d="M30 46h60c0 16-13 26-30 26S30 62 30 46z" fill="url(#or-t2)" stroke="#2E4A50" stroke-width="2"/>
    <ellipse cx="60" cy="46" rx="30" ry="7" fill="#1E343A" stroke="#2E4A50" stroke-width="2"/>
    <!-- legs -->
    <g stroke="url(#or-t1)" stroke-width="5" stroke-linecap="round" fill="none">
      <path d="M40 64l-14 60M80 64l14 60M60 70v54"/>
    </g>
    <g stroke="#2E4A50" stroke-width="2"><path d="M22 124h16M52 124h16M82 124h16"/></g>
  </svg>`; }

  return { open, close, _start, _next, syncLang };
})();
window.Oracle = Oracle;

/* ── Games-Panel entry points ── */
window.openOracle  = function(gp){ Oracle.open(gp || {}); };
window.closeOracle = function(){ Oracle.close(); };
