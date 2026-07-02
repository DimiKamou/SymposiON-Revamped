/* ══════════════════ ΕΚΚΛΗΣΙΑ ΤΟΥ ΔΗΜΟΥ — engine ══════════════════
   A live buzzer game for the room. Each citizen (team) has their own
   buzzer — tap it or hit its number key. First to buzz wins the floor and
   answers; a wrong answer hands the floor to the rest (steal). Most
   honour after the session carries the vote.

   Visual direction: "Dawn on the Pnyx" — the assembly convenes at first
   light. Aegean night sky warming to terracotta at the horizon, a marble
   stele for the motion, ostraka shards drifting like ash from the potters'
   quarter, and a silhouetted δῆμος that votes by show of hands
   (χειροτονία) when an answer carries. Presentation only — gameplay,
   scoring and data flow are untouched.
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

  const REDUCE = (() => {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (_) { return false; }
  })();

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
        '<button class="overlay-back" onclick="closeEkklisia()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΕΚΚΛΗΣΙΑ ΤΟΥ ΔΗΜΟΥ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
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
<div class="ek-ambient" aria-hidden="true">
  <div class="ek-sky"></div>
  ${pnyxSVG()}
  <div class="ek-shards" id="ek-shards"></div>
</div>

<!-- INTRO -->
<div id="ek-screen-intro" class="ek-screen">
  <div class="ek-kicker" data-i18n="kicker"></div>
  ${bemaSVG('ek-bema')}
  <div class="ek-logo">ΕΚΚΛΗΣΙΑ ΤΟΥ ΔΗΜΟΥ</div>
  <div class="ek-logo-en" data-i18n="subtitle"></div>
  ${meanderSVG('ekm-intro')}
  <div class="ek-intro-txt" data-i18n="intro"></div>
  <div class="ek-tribes">${TRIBES.map(t=>`<span class="ek-tribe" style="--c:${t.c}">${t.name}</span>`).join('')}</div>
  <div class="ek-pick-lbl" data-i18n="pick"></div>
  <div class="ek-pickrow" id="ek-pickrow"></div>
</div>

<!-- GAME -->
<div id="ek-screen-game" class="ek-screen">
  <div class="ek-top">
    <div class="ek-round" id="ek-round"></div>
    <div class="ek-phase" id="ek-phase"></div>
  </div>
  <div class="ek-q-card" id="ek-qcard">
    <div class="ek-q-kicker" data-i18n="motion"></div>
    <div class="ek-q-text" id="ek-qtext"></div>
  </div>
  <div class="ek-answers" id="ek-answers"></div>
  <div class="ek-feedback" id="ek-feedback"></div>
  <div class="ek-stagebot">
    <div class="ek-crowd" id="ek-crowd" aria-hidden="true">${crowdHTML()}</div>
    <div class="ek-buzzers" id="ek-buzzers"></div>
  </div>
</div>

<!-- END -->
<div id="ek-screen-end" class="ek-screen">
  <div id="ek-end-art"></div>
  <div class="ek-end-crest">
    ${laurelSVG('left')}
    <div class="ek-end-heads">
      <div class="ek-end-title" id="ek-end-title"></div>
      <div class="ek-end-sub" id="ek-end-sub"></div>
    </div>
    ${laurelSVG('right')}
  </div>
  <div class="ek-final-board" id="ek-final-board"></div>
  <div class="ek-end-btns">
    <button class="sym-btn" onclick="Ekklisia._restart()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Ekklisia.close()" data-i18n="exit"></button>
  </div>
</div>
<div class="ek-flash" id="ek-flash" aria-hidden="true"></div>`;
    buildShards();
    renderPick();
  }

  function renderPick() {
    const wrap=document.getElementById('ek-pickrow'); if(!wrap) return;
    wrap.innerHTML = [2,3,4,5,6].map(n=>`<button class="ek-pick" onclick="Ekklisia._begin(${n})"><span>${n}</span></button>`).join('');
  }

  const I18N = {
    kicker:  { gr:'ΠΝΥΞ · ΑΘΗΝΑΙ · ΑΜΑ ΤΗ ΑΥΓΗ', en:'THE PNYX · ATHENS · AT FIRST LIGHT' },
    subtitle:{ gr:'Ο αγών της Πνύκας', en:'The Contest of the Pnyx' },
    intro:   { gr:'Κάθε <b>φυλή</b> έχει το δικό της κουμπί — πάτησέ το (ή το πλήκτρο της) μόλις ξέρεις. Όποιος <b>βουλεύεται πρώτος</b> παίρνει τον λόγο και απαντά· λάθος απάντηση δίνει τον λόγο στους υπόλοιπους.', en:'Each <b>tribe</b> has its own button — press it (or its number key) the moment you know. Whoever <b>buzzes first</b> takes the floor and answers; a wrong answer passes the floor to the rest.' },
    pick:    { gr:'ΠΟΣΕΣ ΦΥΛΕΣ ΣΥΝΕΔΡΙΑΖΟΥΝ;', en:'HOW MANY TRIBES CONVENE?' },
    motion:  { gr:'ΤΟ ΖΗΤΗΜΑ ΠΡΟ ΤΟΥ ΔΗΜΟΥ', en:'THE MOTION BEFORE THE ASSEMBLY' },
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
      _disp:{},
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
    _crowdSet('');
    _replayClass(document.getElementById('ek-qcard'), 'ek-q-in');
    renderPhase(); renderBuzzers();
  }

  function renderPhase() {
    const r=document.getElementById('ek-round');
    let pips=''; for(let i=1;i<=ROUNDS;i++) pips+=`<span class="ek-pip${i<st.round?' done':(i===st.round?' now':'')}"></span>`;
    r.innerHTML = `<span class="ek-round-lbl">${T('ΓΥΡΟΣ ','ROUND ')+st.round+' / '+ROUNDS}</span><span class="ek-pips">${pips}</span>`;
    const ph=document.getElementById('ek-phase');
    if (st.phase==='armed') { ph.textContent=T('ΠΑΤΗΣΤΕ ΤΟ ΚΟΥΜΠΙ ΣΑΣ!','PRESS YOUR BUTTON!'); ph.className='ek-phase live'; ph.style.removeProperty('--pc'); }
    else if (st.phase==='answer') { ph.textContent=T(`${st.players[st.buzzed].name} ΕΧΕΙ ΤΟΝ ΛΟΓΟ`,`${st.players[st.buzzed].name} HAS THE FLOOR`); ph.className='ek-phase floor'; ph.style.setProperty('--pc', st.players[st.buzzed].c); }
    else { ph.textContent=''; ph.className='ek-phase'; ph.style.removeProperty('--pc'); }
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
    // count-up the honour scores that changed since the last paint
    st.players.forEach((p,i)=>{
      const prev = (st._disp && st._disp[i]!=null) ? st._disp[i] : p.score;
      if (prev!==p.score) {
        const el=wrap.querySelector(`.ek-buzzer[data-i="${i}"] .ek-buzz-score`);
        _countUp(el, prev, p.score, 620);
      }
      if (st._disp) st._disp[i]=p.score;
    });
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
    if (window.gsap && !REDUCE) gsap.fromTo('#ek-answers .ek-ans',{opacity:0,y:14},{opacity:1,y:0,duration:.38,stagger:.06,ease:'power3.out'});
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
      `<div class="ek-final-row${i===0?' top':''}" style="--c:${x.c}"><span class="ek-final-pos">${i+1}</span><span class="ek-final-dot"></span><span class="ek-final-name">${x.name}${i===0?' 🏆':''}</span><span class="ek-final-s">${x.score}</span></div>`
    ).join('');
    // count the honour up from zero, row by row
    document.querySelectorAll('#ek-final-board .ek-final-row').forEach((row,i)=>{
      const el=row.querySelector('.ek-final-s'); const v=board[i].score;
      if (REDUCE || !el) return;
      el.textContent='0';
      setTimeout(()=>_countUp(el, 0, v, 900), 380 + i*140);
    });
  }

  /* ───────── presentation helpers (visual only) ───────── */
  function _countUp(el, from, to, dur) {
    if (!el) return;
    if (REDUCE || from===to) { el.textContent=to; return; }
    dur = dur || 600;
    const t0 = performance.now();
    el.classList.add('tick');
    function step(now){
      const k=Math.min(1,(now-t0)/dur);
      el.textContent=Math.round(from+(to-from)*(1-Math.pow(1-k,3)));
      if (k<1) requestAnimationFrame(step);
      else { el.textContent=to; el.classList.remove('tick'); }
    }
    requestAnimationFrame(step);
  }

  function _replayClass(el, cls) {
    if (!el || REDUCE) return;
    el.classList.remove(cls);
    void el.offsetWidth;
    el.classList.add(cls);
  }

  let _crowdTimer=null;
  function _crowdSet(mode) {
    const c=document.getElementById('ek-crowd'); if(!c) return;
    c.classList.remove('cheer','murmur','hush');
    if (!mode || REDUCE) return;
    void c.offsetWidth;
    c.classList.add(mode);
    clearTimeout(_crowdTimer);
    _crowdTimer=setTimeout(()=>c.classList.remove('cheer','murmur','hush'), mode==='cheer'?1650:1100);
  }

  function _flashTint(color, peak) {
    if (REDUCE) return;
    const f=document.getElementById('ek-flash'); if(!f) return;
    f.style.background=`radial-gradient(ellipse at 50% 62%, ${color}, transparent 72%)`;
    try {
      f.animate([{opacity:0},{opacity:peak,offset:.16},{opacity:0}],{duration:560,easing:'ease-out'});
    } catch(_){}
  }

  /* map the engine's ek:fx events to set-pieces (SymFX optional) */
  window.addEventListener('ek:fx', (e)=>{
    const d=(e && e.detail)||{};
    const FX=window.SymFX;
    const wrapEl=document.getElementById('ek-wrap');
    try {
      switch (d.type) {
        case 'steal': {
          const c=(st.players && st.buzzed>=0 && st.players[st.buzzed]) ? st.players[st.buzzed].c : '#7FB0BC';
          _flashTint(`color-mix(in srgb, ${c} 40%, transparent)`, .3);
          _crowdSet('hush');
          const ph=document.getElementById('ek-phase');
          if (ph && window.gsap && !REDUCE) gsap.fromTo(ph,{scale:.72,opacity:0},{scale:1,opacity:1,duration:.42,ease:'back.out(2.4)',clearProps:'transform,opacity'});
          break;
        }
        case 'correct': {
          _crowdSet('cheer');
          _flashTint('rgba(227,199,102,0.5)', .3);
          const r=d.el && d.el.getBoundingClientRect ? d.el.getBoundingClientRect() : null;
          if (FX && r) {
            FX.burst(r.left+r.width/2, r.top+r.height/2, {colors:['#E3C766','#A9C98C','#F0EBE0'], count:20, power:9, life:1050});
            FX.combo('+100', r.left+r.width/2, r.top-6, {size:32, color:'#E3C766'});
          }
          const bz=document.querySelector('.ek-buzzer.buzzed');
          if (FX && bz) FX.pop(bz, 1.1);
          break;
        }
        case 'wrong': {
          _crowdSet('murmur');
          _flashTint('rgba(158,59,46,0.55)', .34);
          if (FX) FX.shake(9, .45, wrapEl);
          const r=d.el && d.el.getBoundingClientRect ? d.el.getBoundingClientRect() : null;
          if (FX && r) FX.combo('−50', r.left+r.width/2, r.top-6, {size:26, color:'#E08577'});
          break;
        }
        case 'win': {
          _flashTint('rgba(227,199,102,0.45)', .38);
          if (FX) {
            FX.burst(window.innerWidth/2, window.innerHeight*0.42, {emoji:['\u{1F33F}','✦','\u{1F3DB}'], count:26, power:12, up:.45, life:1600});
            setTimeout(()=>FX.burst(window.innerWidth/2, window.innerHeight*0.46, {colors:['#E3C766','#7FB0BC','#D97B5C','#F0EBE0'], count:24, power:10, life:1300}), 380);
          }
          break;
        }
      }
    } catch(_){}
  });

  /* ───────── art ───────── */
  // Hero scene: the bema at dawn — sun-halo speaker, marble steps,
  // laurel sprigs and the raised hands of the demos.
  function bemaSVG(cls){ const id=cls+'g'; return `<svg class="${cls}" viewBox="0 0 260 150" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="${id}m" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0E9D7"/><stop offset="1" stop-color="#C9BCA0"/></linearGradient>
      <radialGradient id="${id}s" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#E3C766" stop-opacity="0.85"/><stop offset="0.55" stop-color="#E3C766" stop-opacity="0.22"/><stop offset="1" stop-color="#E3C766" stop-opacity="0"/></radialGradient>
    </defs>
    <!-- dawn halo -->
    <circle class="ek-sun" cx="130" cy="56" r="46" fill="url(#${id}s)"/>
    <!-- bema (speaker's platform) -->
    <path d="M96 76h68l10 24H86z" fill="url(#${id}m)" stroke="#9C8E72" stroke-width="2"/>
    <rect x="78" y="100" width="104" height="10" fill="#DCD2BA" stroke="#9C8E72" stroke-width="1.5"/>
    <rect x="64" y="110" width="132" height="10" fill="#CFC4AA" stroke="#9C8E72" stroke-width="1.5"/>
    <rect x="50" y="120" width="160" height="11" fill="#BFB394" stroke="#9C8E72" stroke-width="1.5"/>
    <!-- speaker -->
    <circle cx="130" cy="45" r="9" fill="#C7553A"/>
    <path d="M121 76c0-14 4-23 9-23s9 9 9 23z" fill="#9E3B2E"/>
    <path d="M139 57l19-11" stroke="#C7553A" stroke-width="4" stroke-linecap="round"/>
    <!-- laurel sprigs -->
    <g stroke="#8FA86A" stroke-width="2" stroke-linecap="round" fill="#A9C98C">
      <path d="M22 128C16 112 18 96 28 84" fill="none"/>
      <path d="M24 116q-9-2-12 4 9 3 12-4z"/><path d="M22 102q-9-1-11 5 9 2 11-5z"/><path d="M25 90q-8-4-12 1 7 5 12-1z"/>
      <path d="M238 128c6-16 4-32-6-44" fill="none"/>
      <path d="M236 116q9-2 12 4-9 3-12-4z"/><path d="M238 102q9-1 11 5-9 2-11-5z"/><path d="M235 90q8-4 12 1-7 5-12-1z"/>
    </g>
    <!-- the demos: heads + raised hands (χειροτονία) -->
    <g fill="#2A353C">
      <circle cx="44" cy="98" r="6"/><circle cx="62" cy="103" r="6"/><circle cx="80" cy="97" r="5.4"/>
      <circle cx="180" cy="97" r="5.4"/><circle cx="198" cy="103" r="6"/><circle cx="216" cy="98" r="6"/>
    </g>
    <g stroke="#5E8B96" stroke-width="3.4" stroke-linecap="round">
      <path d="M38 90l-6-14"/><path d="M58 94l-3-14"/><path d="M85 89l5-13"/>
      <path d="M175 89l-5-13"/><path d="M202 94l3-14"/><path d="M222 90l6-14"/>
    </g>
  </svg>`; }

  // Distant Pnyx skyline for the ambient layer.
  function pnyxSVG(){ return `<svg class="ek-pnyx" viewBox="0 0 1200 220" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs><linearGradient id="ekpnyxg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18242B"/><stop offset="1" stop-color="#0C1318"/></linearGradient></defs>
    <path d="M0 152 L170 120 L330 136 L520 96 L700 126 L890 104 L1070 132 L1200 116 V220 H0 Z" fill="url(#ekpnyxg)"/>
    <g fill="#1E2C34">
      <rect x="546" y="82" width="108" height="13" rx="1"/>
      <rect x="530" y="95" width="140" height="13" rx="1"/>
      <rect x="514" y="108" width="172" height="13" rx="1"/>
    </g>
    <rect x="588" y="58" width="24" height="24" fill="#1E2C34"/>
    <g fill="#141F26">
      <rect x="300" y="98" width="9" height="40"/><rect x="322" y="104" width="9" height="34"/>
      <rect x="872" y="82" width="9" height="46"/><rect x="894" y="90" width="9" height="38"/>
    </g>
  </svg>`; }

  // Greek-key divider (pattern id parameterised so it can appear twice).
  function meanderSVG(id){ return `<svg class="ek-meander" viewBox="0 0 240 12" preserveAspectRatio="none" aria-hidden="true">
    <defs><pattern id="${id}" width="12" height="12" patternUnits="userSpaceOnUse">
      <path d="M1 11V1h10v7H5V5h3" fill="none" stroke="currentColor" stroke-width="1.5"/>
    </pattern></defs>
    <rect width="240" height="12" fill="url(#${id})"/>
  </svg>`; }

  // One laurel branch for the victory crest (mirrored via CSS for .right).
  function laurelSVG(side){ return `<svg class="ek-laurel ${side}" viewBox="0 0 60 120" fill="none" aria-hidden="true">
    <path d="M50 116C24 96 15 64 27 12" stroke="#8FA86A" stroke-width="3" stroke-linecap="round"/>
    <g fill="#A9C98C">
      <path d="M44 104q12-4 18 3-11 6-18-3z"/>
      <path d="M36 88q12-3 17 4-11 5-17-4z" fill="#8FA86A"/>
      <path d="M30 72q11-3 16 4-10 5-16-4z"/>
      <path d="M27 56q11-2 15 5-10 4-15-5z" fill="#8FA86A"/>
      <path d="M26 40q10-2 14 5-9 4-14-5z"/>
      <path d="M26 26q10-1 13 6-9 3-13-6z" fill="#8FA86A"/>
      <path d="M27 13q9-1 12 6-8 3-12-6z"/>
    </g>
  </svg>`; }

  // Silhouetted citizens whose arms swing up when the vote carries.
  function crowdHTML(){
    let h='';
    for (let i=0;i<16;i++){
      h+=`<span class="ek-cit" style="--i:${i};--h:${(Math.random()*10)|0}px">
        <svg viewBox="0 0 36 60" aria-hidden="true">
          <circle class="ek-hd" cx="17" cy="13" r="7.2"/>
          <path class="ek-bd" d="M2 60Q17 30 32 60Z"/>
          <g class="ek-arm"><path d="M25 40L33 20" stroke-width="5" stroke-linecap="round"/><circle cx="33" cy="17" r="4"/></g>
        </svg></span>`;
    }
    return h;
  }

  // Drifting ostraka shards (skipped entirely under reduced motion).
  function buildShards(){
    const wrap=document.getElementById('ek-shards');
    if (!wrap || REDUCE) return;
    let html='';
    for (let i=0;i<10;i++){
      const s=(9+Math.random()*15).toFixed(0);
      html+=`<span class="ek-shard" style="left:${(Math.random()*100).toFixed(1)}%;width:${s}px;height:${s}px;--r:${(Math.random()*360)|0}deg;animation-duration:${(17+Math.random()*17).toFixed(1)}s;animation-delay:${(-Math.random()*30).toFixed(1)}s;"></span>`;
    }
    wrap.innerHTML=html;
  }

  return { open, close, _begin, _buzz, _restart, syncLang };
})();
window.Ekklisia = Ekklisia;

/* ── Games-Panel entry points ── */
window.openEkklisia  = function(gp){ Ekklisia.open(gp || {}); };
window.closeEkklisia = function(){ Ekklisia.close(); };
