/* ══════════════════ ΕΚΚΛΗΣΙΑ ΤΟΥ ΔΗΜΟΥ — engine ══════════════════
   A live buzzer game for the room. Each citizen (team) has their own
   buzzer — tap it or hit its number key. First to buzz wins the floor and
   answers; a wrong answer hands the floor to the rest (steal). Most
   honour after the session carries the vote.
   API:  Ekklisia.open()   Ekklisia.close()
═══════════════════════════════════════════════════════════════════ */
const Ekklisia = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');

  // Pick the language string from a question's `q`, tolerating {gr,en},
  // bare strings, {q:{gr,en}} wrappers and object-valued langs — so the
  // card never renders the literal "[object Object]" (host/picker banks may
  // deliver q as a bilingual object rather than a plain string).
  const QT = (q) => {
    if (q == null) return '';
    if (typeof q === 'string') return q;
    if (typeof q === 'object') {
      const v = q[L()] != null ? q[L()] : (q.gr != null ? q.gr : q.en);
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object') return QT(v);
      if (q.q !== undefined) return QT(q.q);
    }
    return String(q);
  };

  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.EK_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const ROUNDS = 10;
  const TRIBES = [
    { name:'ΕΡΕΧΘΗΙΣ',   c:'#D97B5C' },
    { name:'ΑΙΓΗΙΣ',     c:'#5E8B96' },
    { name:'ΠΑΝΔΙΟΝΙΣ',  c:'#6A8752' },
    { name:'ΛΕΩΝΤΙΣ',    c:'#C4A448' },
    { name:'ΑΚΑΜΑΝΤΙΣ',  c:'#9E3B2E' },
    { name:'ΟΙΝΗΙΣ',     c:'#7FB0BC' },
  ];
  const KEYS = ['1','2','3','4','5','6'];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('ek:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#ek-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('ek-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('ek-screen-intro')) build();
    _bindKeys();
    syncLang();
    show('ek-screen-intro');
  }
  function close() {
    _unbindKeys();
    document.getElementById('ek-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('ek-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'ek-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeEkklisia()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u0395\u039a\u039a\u039b\u0397\u03a3\u0399\u0391 \u03a4\u039f\u03a5 \u0394\u0397\u039c\u039f\u03a5') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="ek-wrap"></div></div>';
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
    document.getElementById('ek-wrap').innerHTML = `
<!-- INTRO -->
<div id="ek-screen-intro" class="ek-screen">
  ${bemaSVG('ek-bema')}
  <div class="ek-logo">ΕΚΚΛΗΣΙΑ ΤΟΥ ΔΗΜΟΥ</div>
  <div class="ek-logo-en" data-i18n="subtitle"></div>
  <div class="ek-intro-txt" data-i18n="intro"></div>
  <div class="ek-pick-lbl" data-i18n="pick"></div>
  <div class="ek-pickrow" id="ek-pickrow"></div>
</div>

<!-- GAME -->
<div id="ek-screen-game" class="ek-screen">
  <div class="ek-top">
    <div class="ek-round" id="ek-round"></div>
    <div class="ek-phase" id="ek-phase"></div>
  </div>
  <div class="ek-q-card"><div class="ek-q-text" id="ek-qtext"></div></div>
  <div class="ek-answers" id="ek-answers"></div>
  <div class="ek-feedback" id="ek-feedback"></div>
  <div class="ek-buzzers" id="ek-buzzers"></div>
</div>

<!-- END -->
<div id="ek-screen-end" class="ek-screen">
  <div id="ek-end-art"></div>
  <div class="ek-end-title" id="ek-end-title"></div>
  <div class="ek-end-sub" id="ek-end-sub"></div>
  <div class="ek-final-board" id="ek-final-board"></div>
  <div class="ek-end-btns">
    <button class="sym-btn" onclick="Ekklisia._restart()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Ekklisia.close()" data-i18n="exit"></button>
  </div>
</div>`;
    renderPick();
  }

  function renderPick() {
    const wrap=document.getElementById('ek-pickrow'); if(!wrap) return;
    wrap.innerHTML = [2,3,4,5,6].map(n=>`<button class="ek-pick" onclick="Ekklisia._begin(${n})">${n}</button>`).join('');
  }

  const I18N = {
    subtitle:{ gr:'Ο αγών της Πνύκας', en:'The Contest of the Pnyx' },
    intro:   { gr:'Κάθε <b>φυλή</b> έχει το δικό της κουμπί — πάτησέ το (ή το πλήκτρο της) μόλις ξέρεις. Όποιος <b>βουλεύεται πρώτος</b> παίρνει τον λόγο και απαντά· λάθος απάντηση δίνει τον λόγο στους υπόλοιπους.', en:'Each <b>tribe</b> has its own button — press it (or its number key) the moment you know. Whoever <b>buzzes first</b> takes the floor and answers; a wrong answer passes the floor to the rest.' },
    pick:    { gr:'ΠΟΣΕΣ ΦΥΛΕΣ ΣΥΝΕΔΡΙΑΖΟΥΝ;', en:'HOW MANY TRIBES CONVENE?' },
    again:   { gr:'ΝΕΑ ΣΥΝΕΛΕΥΣΗ', en:'NEW ASSEMBLY' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#ek-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('ek-screen-game').classList.contains('active')) {
      document.getElementById('ek-qtext').textContent = QT(st.cur.q);
      renderPhase(); renderBuzzers();
      if (st.phase==='answer') renderAnswers();
    }
  }
  function show(id){ document.querySelectorAll('#ek-wrap .ek-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── keyboard ───────── */
  function _bindKeys() {
    if (st._keyh) return;
    st._keyh = (e)=>{
      if (!document.getElementById('ek-screen-game') || !document.getElementById('ek-screen-game').classList.contains('active')) return;
      const i=KEYS.indexOf(e.key);
      if (i>=0 && i<(st.players?st.players.length:0)) { buzz(i); }
    };
    window.addEventListener('keydown', st._keyh);
  }
  function _unbindKeys() { if (st._keyh){ window.removeEventListener('keydown', st._keyh); st._keyh=null; } }

  /* ───────── start ───────── */
  function _begin(n) {
    st = {
      n, players: TRIBES.slice(0,n).map((t,i)=>({ ...t, key:KEYS[i], score:0 })),
      round:0, pool: shuffle([..._gpPool()]), idx:0,
      phase:'armed', cur:null, buzzed:-1, attempted:[], answered:false, _keyh:st._keyh,
    };
    _bindKeys();
    show('ek-screen-game');
    newRound();
  }
  function _restart(){ show('ek-screen-intro'); }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function standings(){ return st.players.map((p,i)=>({...p,i})).sort((a,b)=>b.score-a.score); }

  /* ───────── round ───────── */
  function newRound() {
    if (st.round>=ROUNDS) return end();
    st.round++; st.phase='armed'; st.buzzed=-1; st.attempted=[]; st.answered=false;
    st.cur=getQ();
    document.getElementById('ek-qtext').textContent = QT(st.cur.q);
    document.getElementById('ek-answers').innerHTML='';
    const fb=document.getElementById('ek-feedback'); fb.textContent=''; fb.className='ek-feedback';
    renderPhase(); renderBuzzers();
  }

  function renderPhase() {
    document.getElementById('ek-round').textContent = T('ΓΥΡΟΣ ','ROUND ')+st.round+' / '+ROUNDS;
    const ph=document.getElementById('ek-phase');
    if (st.phase==='armed') { ph.textContent=T('ΠΑΤΗΣΤΕ ΤΟ ΚΟΥΜΠΙ ΣΑΣ!','PRESS YOUR BUTTON!'); ph.className='ek-phase live'; }
    else if (st.phase==='answer') { ph.textContent=T(`${st.players[st.buzzed].name} ΕΧΕΙ ΤΟΝ ΛΟΓΟ`,`${st.players[st.buzzed].name} HAS THE FLOOR`); ph.className='ek-phase'; }
    else { ph.textContent=''; ph.className='ek-phase'; }
  }

  function renderBuzzers() {
    const wrap=document.getElementById('ek-buzzers');
    if(window.SymStandings) SymStandings.feed('ek', st.players.map(p=>({name:p.name, score:p.score, glyph:p.key})), {key:'score', unit:'τιμή', accent:'var(--sym-aegean)', title:'ΕΚΚΛΗΣΙΑ'});
    wrap.innerHTML = st.players.map((p,i)=>{
      const out = st.attempted.includes(i);
      const buzzed = st.buzzed===i;
      const cls=['ek-buzzer']; if(out)cls.push('out'); if(buzzed)cls.push('buzzed'); if(st.phase==='armed'&&!out)cls.push('live');
      return `<button class="${cls.join(' ')}" data-i="${i}" style="--c:${p.c}" onclick="Ekklisia._buzz(${i})">
        <span class="ek-buzz-key">${p.key}</span>
        <span class="ek-buzz-name">${p.name}</span>
        <span class="ek-buzz-score">${p.score}</span>
      </button>`;
    }).join('');
  }

  function _buzz(i){ buzz(i); }
  function buzz(i) {
    if (st.phase!=='armed') return;
    if (i<0 || i>=st.players.length) return;
    if (st.attempted.includes(i)) return;
    st.phase='answer'; st.buzzed=i; st.answered=false;
    _fx('steal');
    const el=document.querySelector(`.ek-buzzer[data-i="${i}"]`);
    if (el && window.gsap) gsap.fromTo(el,{scale:1},{scale:1.12,duration:.16,yoyo:true,repeat:1,ease:'power2.out'});
    renderPhase(); renderBuzzers(); renderAnswers();
  }

  function renderAnswers() {
    const wrap=document.getElementById('ek-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='ek-ans';
      b.innerHTML=`<span class="ek-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    if (window.gsap) gsap.fromTo('#ek-answers .ek-ans',{opacity:0,y:12},{opacity:1,y:0,duration:.35,stagger:.05,ease:'power2.out'});
  }

  function answer(chosen, btn) {
    if (st.phase!=='answer' || st.answered) return; st.answered=true;
    const p=st.players[st.buzzed];
    const fb=document.getElementById('ek-feedback');
    if (chosen===st.cur.c) {
      document.querySelectorAll('#ek-answers .ek-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
      p.score += 100; _fx('correct',{el:btn});
      fb.textContent=T(`+100 — ${p.name} κερδίζει τον λόγο`,`+100 — ${p.name} carries the floor`); fb.className='ek-feedback ek-fb-ok';
      st.phase='resolve'; renderBuzzers();
      setTimeout(()=>{ st.round>=ROUNDS ? end() : newRound(); }, 1500);
    } else {
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      p.score = Math.max(0, p.score-50);
      st.attempted.push(st.buzzed);
      if (st.attempted.length >= st.players.length) {
        // everyone failed — reveal & move on
        document.querySelectorAll('#ek-answers .ek-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
        fb.textContent=T('Κανείς δεν έπεισε τον δήμο.','None swayed the assembly.'); fb.className='ek-feedback ek-fb-bad';
        st.phase='resolve'; renderBuzzers();
        setTimeout(()=>{ st.round>=ROUNDS ? end() : newRound(); }, 1500);
      } else {
        // floor passes to the rest
        fb.textContent=T(`Λάθος — ο λόγος περνά! (−50 ${p.name})`,`Wrong — the floor passes! (−50 ${p.name})`); fb.className='ek-feedback ek-fb-bad';
        st.phase='armed'; st.buzzed=-1; st.answered=false;
        document.getElementById('ek-answers').innerHTML='';
        renderPhase(); renderBuzzers();
      }
    }
  }

  /* ───────── end ───────── */
  function end() {
    show('ek-screen-end');
    const board = standings();
    _fx('win');
    document.getElementById('ek-end-art').innerHTML = bemaSVG('ek-end-bema');
    const top=board[0];
    document.getElementById('ek-end-title').textContent = T(`Η ${top.name} ΥΠΕΡΙΣΧΥΣΕ`,`${top.name} PREVAILS`);
    document.getElementById('ek-end-title').className='ek-end-title win';
    document.getElementById('ek-end-sub').textContent = T(`Με ${top.score} τιμή, η ${top.name} κέρδισε την ψήφο του δήμου.`,`With ${top.score} honour, ${top.name} won the vote of the assembly.`);
    document.getElementById('ek-final-board').innerHTML = board.map((x,i)=>
      `<div class="ek-final-row" style="--c:${x.c}"><span class="ek-final-pos">${i+1}</span><span class="ek-final-dot"></span><span class="ek-final-name">${x.name}${i===0?' 🏆':''}</span><span class="ek-final-s">${x.score}</span></div>`
    ).join('');
  }

  /* ───────── art ───────── */
  function bemaSVG(cls){ return `<svg class="${cls}" viewBox="0 0 140 120" fill="none">
    <defs><linearGradient id="ek-m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8E0CE"/><stop offset="1" stop-color="#C9BCA0"/></linearGradient></defs>
    <!-- bema (speaker's platform) -->
    <path d="M40 64h60l8 20H32z" fill="url(#ek-m)" stroke="#9C8E72" stroke-width="2"/>
    <rect x="28" y="84" width="84" height="9" fill="#DCD2BA" stroke="#9C8E72" stroke-width="1.5"/>
    <rect x="20" y="93" width="100" height="9" fill="#CFC4AA" stroke="#9C8E72" stroke-width="1.5"/>
    <rect x="12" y="102" width="116" height="10" fill="#BFB394" stroke="#9C8E72" stroke-width="1.5"/>
    <!-- speaker -->
    <circle cx="70" cy="34" r="9" fill="#C7553A"/>
    <path d="M61 64c0-14 4-22 9-22s9 8 9 22z" fill="#9E3B2E"/>
    <path d="M79 46l16-10" stroke="#C7553A" stroke-width="4" stroke-linecap="round"/>
    <!-- raised hands (vote) -->
    <g stroke="#5E8B96" stroke-width="3" stroke-linecap="round"><path d="M18 58l-6-12M30 54l-3-12M110 54l3-12M122 58l6-12"/></g>
  </svg>`; }

  return { open, close, _begin, _buzz, _restart, syncLang };
})();
window.Ekklisia = Ekklisia;

/* ── Games-Panel entry points ── */
window.openEkklisia  = function(gp){ Ekklisia.open(gp || {}); };
window.closeEkklisia = function(){ Ekklisia.close(); };
