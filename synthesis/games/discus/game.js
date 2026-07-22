/* ══════════════════ ΔΙΣΚΟΣ — engine ══════════════════
   Plinko-drop reimagined as the discus throw of the pentathlon.
   A correct answer lets you release the discus down the pegs of the
   stadium; where it settles is your score. Edge slots reward the boldest
   line. Most distance wins the crown.
   API:  Discus.open()   Discus.close()
═══════════════════════════════════════════════════════════════════ */
const Discus = (() => {

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
    const g = window.DI_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const ROUNDS = 10;
  const ROWS   = 8;
  const SLOTS  = [250,140,70,30,70,140,250];   // 7 slots, edges reward
  const RIVALS = ['ΜΙΛΩΝ','ΦΑΥΛΛΟΣ','ΧΙΟΝΙΣ'];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('di:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  // presentation-only: honor prefers-reduced-motion for decorative particles
  const REDUCE = () => {
    try { return (window.SymFX && SymFX.reduce) || window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch(_){ return false; }
  };

  /* ── tiny procedural WebAudio flourishes (presentation only, no assets).
        Context is created lazily on the first user-gesture-driven call and
        suspended on close(); every call is fail-safe. ── */
  const SND = (() => {
    let ctx=null, master=null, noiseBuf=null;
    function ok(){
      try {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        if (!ctx) { ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.17; master.connect(ctx.destination); }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
      } catch(_) { return null; }
    }
    function noise(c){
      if (noiseBuf) return noiseBuf;
      const b = c.createBuffer(1, c.sampleRate, c.sampleRate);
      const d = b.getChannelData(0);
      for (let i=0;i<d.length;i++) d[i] = Math.random()*2-1;
      noiseBuf = b; return b;
    }
    function env(g,t,a,d,pk){ g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(Math.max(pk,0.001),t+a); g.gain.exponentialRampToValueAtTime(0.0001,t+a+d); }
    function ping(depth){ const c=ok(); if(!c) return; try{
      const t=c.currentTime, o=c.createOscillator(), g=c.createGain();
      const f=460 + depth*760 + Math.random()*70;              // bronze pitch rises as the disc descends
      o.type='triangle'; o.frequency.setValueAtTime(f,t); o.frequency.exponentialRampToValueAtTime(f*0.66,t+0.16);
      env(g,t,0.005,0.16,0.5); o.connect(g); g.connect(master); o.start(t); o.stop(t+0.2);
    }catch(_){} }
    function whoosh(){ const c=ok(); if(!c) return; try{
      const t=c.currentTime, s=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain();
      s.buffer=noise(c); f.type='bandpass'; f.frequency.setValueAtTime(700,t); f.frequency.exponentialRampToValueAtTime(2400,t+0.3); f.Q.value=1.2;
      env(g,t,0.05,0.32,0.28); s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t+0.45);
    }catch(_){} }
    function thud(){ const c=ok(); if(!c) return; try{
      const t=c.currentTime, o=c.createOscillator(), g=c.createGain();
      o.type='sine'; o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(52,t+0.16);
      env(g,t,0.006,0.22,0.8); o.connect(g); g.connect(master); o.start(t); o.stop(t+0.26);
      const s=c.createBufferSource(), lf=c.createBiquadFilter(), ng=c.createGain();
      s.buffer=noise(c); lf.type='lowpass'; lf.frequency.value=900; env(ng,t,0.004,0.12,0.3);
      s.connect(lf); lf.connect(ng); ng.connect(master); s.start(t); s.stop(t+0.16);
    }catch(_){} }
    function roar(){ const c=ok(); if(!c) return; try{       // stadium crowd swell
      const t=c.currentTime, s=c.createBufferSource(), f=c.createBiquadFilter(), g=c.createGain();
      s.buffer=noise(c); s.loop=true;
      f.type='bandpass'; f.frequency.setValueAtTime(420,t); f.frequency.linearRampToValueAtTime(980,t+0.5); f.Q.value=0.8;
      g.gain.setValueAtTime(0.0001,t); g.gain.exponentialRampToValueAtTime(0.5,t+0.28); g.gain.exponentialRampToValueAtTime(0.0001,t+1.5);
      s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t+1.6);
      const o=c.createOscillator(), og=c.createGain();
      o.type='triangle'; o.frequency.setValueAtTime(880,t+0.05); o.frequency.exponentialRampToValueAtTime(1320,t+0.4);
      env(og,t+0.05,0.03,0.5,0.12); o.connect(og); og.connect(master); o.start(t+0.05); o.stop(t+0.7);
    }catch(_){} }
    function chime(){ const c=ok(); if(!c) return; try{
      const t=c.currentTime;
      [[659,0],[988,0.09]].forEach(p=>{ const o=c.createOscillator(), g=c.createGain();
        o.type='sine'; o.frequency.value=p[0]; env(g,t+p[1],0.008,0.3,0.32);
        o.connect(g); g.connect(master); o.start(t+p[1]); o.stop(t+p[1]+0.36); });
    }catch(_){} }
    function buzz(){ const c=ok(); if(!c) return; try{
      const t=c.currentTime, o=c.createOscillator(), g=c.createGain();
      o.type='square'; o.frequency.setValueAtTime(140,t); o.frequency.linearRampToValueAtTime(96,t+0.16);
      env(g,t,0.008,0.18,0.16); o.connect(g); g.connect(master); o.start(t); o.stop(t+0.22);
    }catch(_){} }
    function suspend(){ try{ if(ctx && ctx.state==='running') ctx.suspend(); }catch(_){} }
    return { ping, whoosh, thud, roar, chime, buzz, suspend };
  })();

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#di-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('di-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('di-screen-intro')) build();
    syncLang();
    show('di-screen-intro');
  }
  function close() {
    if (st && st.dropTL && st.dropTL.kill) try{ st.dropTL.kill(); }catch(_){}
    if (st && st.dropFallback) clearTimeout(st.dropFallback);
    try{ SND.suspend(); }catch(_){}
    document.getElementById('di-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('di-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'di-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeDiscus()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u0394\u0399\u03a3\u039a\u039f\u03a3') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="di-wrap"></div></div>';
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
    document.getElementById('di-wrap').innerHTML = `
<!-- INTRO -->
<div id="di-screen-intro" class="di-screen">
  ${discusSVG('di-disc-art')}
  <div class="di-logo">ΔΙΣΚΟΣ</div>
  <div class="di-logo-en" data-i18n="subtitle"></div>
  <div class="di-intro-txt" data-i18n="intro"></div>
  <button class="sym-btn" onclick="Discus._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="di-screen-game" class="di-screen">
  <div class="di-top">
    <div class="di-dist">
      <span class="di-dist-lbl" data-i18n="distance"></span>
      <span class="di-dist-val" id="di-dist">0</span>
    </div>
    <div class="di-round" id="di-round"></div>
  </div>
  <div class="di-board" id="di-board"></div>
  <div class="di-qbody">
    <div class="di-q-card"><div class="di-q-text" id="di-qtext"></div></div>
    <div class="di-answers" id="di-answers"></div>
    <div class="di-feedback" id="di-feedback"></div>
  </div>
</div>

<!-- DROP -->
<div id="di-screen-drop" class="di-screen">
  <div class="di-arena" aria-hidden="true">
    <div class="di-tiers"></div>
    <div class="di-sunshaft"></div>
    <div class="di-brazier l"><span class="di-brazier-glow"></span><span class="di-flame"></span><span class="di-flame f2"></span><span class="di-brazier-bowl"></span></div>
    <div class="di-brazier r"><span class="di-brazier-glow"></span><span class="di-flame"></span><span class="di-flame f2"></span><span class="di-brazier-bowl"></span></div>
  </div>
  <div class="di-drop-head" data-i18n="drophead"></div>
  <div class="di-drop-meta" id="di-drop-meta"></div>
  <div class="di-field" id="di-field"></div>
</div>

<!-- END -->
<div id="di-screen-end" class="di-screen">
  <div id="di-end-art"></div>
  <div class="di-end-title" id="di-end-title"></div>
  <div class="di-end-sub" id="di-end-sub"></div>
  <div class="di-final-board" id="di-final-board"></div>
  <div class="di-end-btns">
    <button class="sym-btn" onclick="Discus._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Discus.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    subtitle:{ gr:'Η ρίψη του δίσκου', en:'The Discus Throw' },
    intro:   { gr:'Στο στάδιο της Ολυμπίας, κάθε σωστή απάντηση σου χαρίζει μια <b>ρίψη</b>. Άσε τον δίσκο να κατρακυλήσει στους πασσάλους — οι <b>ακριανές</b> θέσεις δίνουν τη μεγαλύτερη απόσταση. Η μεγαλύτερη βολή κερδίζει.', en:'In the stadium of Olympia, each correct answer earns a <b>throw</b>. Let the discus tumble through the pegs — the <b>edge</b> slots give the greatest distance. The longest throw wins.' },
    begin:   { gr:'ΣΤΗ ΓΡΑΜΜΗ ΡΙΨΗΣ', en:'TO THE THROWING LINE' },
    distance:{ gr:'ΑΠΟΣΤΑΣΗ', en:'DISTANCE' },
    drophead:{ gr:'ΑΦΗΣΕ ΤΟΝ ΔΙΣΚΟ', en:'RELEASE THE DISCUS' },
    again:   { gr:'ΝΕΟΙ ΑΓΩΝΕΣ', en:'NEW GAMES' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#di-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('di-screen-game').classList.contains('active')) {
      document.getElementById('di-qtext').textContent = QT(st.cur.q);
      renderTop(); renderBoard();
    }
  }
  function show(id){ document.querySelectorAll('#di-wrap .di-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _start() {
    st = {
      dist:0, round:0, answered:false,
      pool: shuffle([..._gpPool()]), idx:0,
      rivals: RIVALS.map(n=>({ name:n, dist: 200 + ((Math.random()*250)|0) })),
      trails: [],   // presentation only: faint ghosts of past trajectories
    };
    show('di-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), dist:st.dist, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.dist-a.dist);
    return all;
  }
  function renderTop() {
    document.getElementById('di-dist').textContent = st.dist;
    document.getElementById('di-round').textContent = T('ΡΙΨΗ ','THROW ')+st.round+' / '+ROUNDS;
  }
  function renderBoard() {
    if(window.SymStandings) SymStandings.feed('di', standings(), {key:'dist', unit:'μ', accent:'var(--sym-sage)', title:'ΔΙΣΚΟΣ'});
    document.getElementById('di-board').innerHTML = standings().map((x,i)=>
      `<div class="di-board-chip${x.me?' me':''}"><span class="di-board-rank">${i+1}</span><span class="di-board-name">${x.name}</span><span class="di-board-d">${x.dist}</span></div>`
    ).join('');
  }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.round>=ROUNDS) return end();
    st.answered=false; st.cur=getQ(); st.round++;
    document.getElementById('di-qtext').textContent = QT(st.cur.q);
    const fb=document.getElementById('di-feedback'); fb.textContent=''; fb.className='di-feedback';
    const wrap=document.getElementById('di-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='di-ans';
      b.innerHTML=`<span class="di-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderTop(); renderBoard();
  }

  function advanceRivals(){ st.rivals.forEach(r=> r.dist += 30 + ((Math.random()*150)|0)); }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#di-answers .di-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('di-feedback');
    advanceRivals();
    if (chosen===st.cur.c) {
      fb.textContent=T('ΣΩΣΤΟ — άφησε τον δίσκο','CORRECT — release the discus'); fb.className='di-feedback di-fb-ok';
      _fx('correct',{el:btn});
      try{ SND.chime(); }catch(_){}
      if (window.SymFX && SymFX.burstAt) try{ SymFX.burstAt(btn, {colors:['#9DBE84','#E3C766','#F0EBE0'], count:14, power:7, size:13, life:900}); }catch(_){}
      setTimeout(showDrop, 900);
    } else {
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      try{ SND.buzz(); }catch(_){}
      if (window.symLogMistake) { try { window.symLogMistake({ q: (st.cur.q && (st.cur.q.gr || st.cur.q.en)) || '', wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Δίσκος', gameId: 'discus' }); } catch(_){} }
      fb.textContent=T('ΛΑΘΟΣ — άκυρη βολή','WRONG — no throw'); fb.className='di-feedback di-fb-bad';
      renderBoard();
      setTimeout(()=>{ st.round>=ROUNDS ? end() : nextQ(); }, 1450);
    }
  }

  /* ───────── plinko drop · player-aimed ───────── */
  function showDrop() {
    show('di-screen-drop');
    if (st.dropTL && st.dropTL.kill) try{ st.dropTL.kill(); }catch(_){}
    if (st.dropFallback) clearTimeout(st.dropFallback);
    const meta=document.getElementById('di-drop-meta');
    if (meta) meta.textContent = T('ΡΙΨΗ ','THROW ')+st.round+' / '+ROUNDS+'  ·  '+T('ΑΠΟΣΤΑΣΗ ','DISTANCE ')+st.dist;
    document.getElementById('di-field').innerHTML = fieldHTML() + '<div class="di-aim" id="di-aim"></div>';
    const field=document.getElementById('di-field');
    const disc=document.getElementById('di-token');
    const aim=document.getElementById('di-aim');
    st.pegEls = Array.prototype.slice.call(field.querySelectorAll('.di-peg'));
    st.dropped=false; st.aimX=50; st._trailPrev=null;
    disc.style.transition='left .1s ease-out'; disc.style.top='4%'; disc.style.left='50%';
    aim.style.left='50%';
    document.getElementById('di-outcome').innerHTML =
      `<div class="di-aimhint">${T('\u03a3\u03b7\u03bc\u03ac\u03b4\u03b5\u03c8\u03b5 \u03ba\u03b1\u03b9 \u03ac\u03c6\u03b7\u03c3\u03b5 \u03c4\u03bf\u03bd \u03b4\u03af\u03c3\u03ba\u03bf','Aim, then release the discus')}</div>`;
    const toX = cx=>{ const r=field.getBoundingClientRect(); return Math.max(6,Math.min(94,((cx-r.left)/r.width)*100)); };
    const move = e=>{ if(st.dropped) return; const x=toX(e.clientX); st.aimX=x; disc.style.left=x+'%'; aim.style.left=x+'%';
      setNearSlot(Math.round(Math.max(0, Math.min(6, (x/100)*7 - 0.5)))); };
    const release = e=>{
      if(st.dropped) return; st.dropped=true;
      try{ SND.whoosh(); }catch(_){}
      if(e && e.clientX!=null) st.aimX=toX(e.clientX);
      disc.style.left=st.aimX+'%'; aim.style.display='none';
      field.removeEventListener('pointermove', move);
      field.removeEventListener('pointerdown', release);
      document.getElementById('di-outcome').innerHTML='';
      setNearSlot(null);
      dropDisc(Math.max(0, Math.min(6, (st.aimX/100)*7 - 0.5)));
    };
    field.addEventListener('pointermove', move);
    field.addEventListener('pointerdown', release);
    setNearSlot(3);
    _fx('aim');
  }

  /* ── presentation helpers (drop-scene juice; no gameplay effect) ── */
  function setNearSlot(idx) {
    document.querySelectorAll('#di-field .di-slot').forEach(s=>{
      s.classList.toggle('near', idx!=null && +s.dataset.i===idx);
    });
  }
  function pingPegNear(disc) {
    const field=document.getElementById('di-field');
    if(!field||!disc||!st.pegEls||!st.pegEls.length) return;
    const dr=disc.getBoundingClientRect(), fr=field.getBoundingClientRect();
    if(!fr.width) return;
    const cx=dr.left-fr.left+dr.width/2, cy=dr.top-fr.top+dr.height/2;
    let best=null, bd=Infinity;
    for(let i=0;i<st.pegEls.length;i++){
      const p=st.pegEls[i];
      if(!p._c) p._c={x:p.offsetLeft, y:p.offsetTop};
      const d=(p._c.x-cx)*(p._c.x-cx)+(p._c.y-cy)*(p._c.y-cy);
      p._d=d;
      if(d<bd){ bd=d; best=p; }
    }
    const lim=fr.width*0.17;
    if(!best || bd>lim*lim) return;
    best.classList.remove('ping'); void best.offsetWidth; best.classList.add('ping');
    try{ SND.ping(Math.max(0, Math.min(1, cy/fr.height))); }catch(_){}
    if (REDUCE()) return;
    // colored bounce-light spills onto the neighbouring bronze pegs
    const nlim=(lim*1.9)*(lim*1.9);
    for(let i=0;i<st.pegEls.length;i++){
      const p=st.pegEls[i];
      if(p!==best && p._d<nlim){ p.classList.add('lit'); setTimeout(()=>{ p.classList.remove('lit'); }, 300); }
    }
    const ring=document.createElement('span');
    ring.className='di-ring';
    ring.style.left=best._c.x+'px'; ring.style.top=best._c.y+'px';
    field.appendChild(ring);
    setTimeout(()=>{ ring.remove(); }, 640);
    // a couple of bronze flecks knocked off the peg
    for(let k=0;k<2;k++){
      const fk=document.createElement('span');
      fk.className='di-fleck';
      fk.style.left=best._c.x+'px'; fk.style.top=best._c.y+'px';
      fk.style.setProperty('--fx', ((Math.random()*36-18)|0)+'px');
      fk.style.setProperty('--fy', (-(6+Math.random()*26)|0)+'px');
      field.appendChild(fk);
      setTimeout(()=>{ fk.remove(); }, 620);
    }
  }
  function spawnTrail(disc) {
    if (REDUCE()) return;
    const now=performance.now();
    if (now-(st._lastTrail||0) < 30) return;
    st._lastTrail=now;
    const field=document.getElementById('di-field'); if(!field||!disc) return;
    const dr=disc.getBoundingClientRect(), fr=field.getBoundingClientRect();
    const x=dr.left-fr.left+dr.width/2, y=dr.top-fr.top+dr.height/2;
    // streak the puff along the direction of travel for a comet-tail read
    let ang=90;
    if (st._trailPrev){ const dx=x-st._trailPrev.x, dy=y-st._trailPrev.y; if(dx*dx+dy*dy>1) ang=Math.atan2(dy,dx)*180/Math.PI; }
    st._trailPrev={x,y};
    const t=document.createElement('span');
    t.className='di-trail';
    t.style.left=x+'px';
    t.style.top=y+'px';
    t.style.setProperty('--a', ang.toFixed(1)+'deg');
    field.appendChild(t);
    setTimeout(()=>{ t.remove(); }, 580);
  }
  function slotFlare(sEl) {
    if(!sEl) return;
    const f=document.createElement('span');
    f.className='di-flare';
    sEl.appendChild(f);
    setTimeout(()=>{ f.remove(); }, 720);
    const num=sEl.querySelector('span');
    if (num && window.gsap) gsap.fromTo(num, {scale:1}, {scale:1.5, duration:.14, yoyo:true, repeat:1, ease:'power2.inOut', transformOrigin:'50% 100%', clearProps:'transform'});
    if (window.SymFX && SymFX.burst) {
      try {
        const r=sEl.getBoundingClientRect();
        SymFX.burst(r.left+r.width/2, r.top+4, {colors:['#D8C08A','#B7A887','#8C7F6B'], count:8, power:5, gravity:.6, size:10, life:750});
      } catch(_){}
    }
  }
  function fieldFlash(strong) {
    const fl=document.getElementById('di-fieldflash'); if(!fl) return;
    fl.classList.remove('on','strong'); void fl.offsetWidth;
    fl.classList.add('on'); if(strong) fl.classList.add('strong');
    setTimeout(()=>{ fl.classList.remove('on','strong'); }, strong?900:520);
  }
  function sandPuff(sEl) {
    if (REDUCE() || !sEl) return;
    const field=document.getElementById('di-field'); if(!field) return;
    const sr=sEl.getBoundingClientRect(), fr=field.getBoundingClientRect();
    if(!fr.width) return;
    const x=sr.left-fr.left+sr.width/2, y=sr.top-fr.top+6;
    const cols=['232,209,138','201,164,74','140,127,107'];
    for(let k=0;k<9;k++){
      const p=document.createElement('span');
      p.className='di-sand';
      const sz=(2.5+Math.random()*3.5).toFixed(1);
      p.style.left=(x+(Math.random()*26-13)).toFixed(1)+'px'; p.style.top=y.toFixed(1)+'px';
      p.style.width=sz+'px'; p.style.height=sz+'px';
      p.style.background='rgba('+cols[k%3]+','+(0.55+Math.random()*0.35).toFixed(2)+')';
      p.style.setProperty('--sx', ((Math.random()*56-28)|0)+'px');
      p.style.setProperty('--sy', (-(10+Math.random()*40)|0)+'px');
      p.style.animationDuration=(0.5+Math.random()*0.35).toFixed(2)+'s';
      field.appendChild(p);
      setTimeout(()=>{ p.remove(); }, 900);
    }
  }

  function dropDisc(startCol) {
    const disc=document.getElementById('di-token');
    const field=document.getElementById('di-field');
    const leftFor = c => ((c+0.5)/7)*100;
    const topFor  = i => 5 + (i/ROWS)*74;
    let col=startCol; const path=[col];
    for (let r=0;r<ROWS;r++){ col += (Math.random()<0.5?-0.5:0.5); col=Math.max(0,Math.min(6,col)); path.push(col); }
    const slot=Math.max(0,Math.min(6,Math.round(col)));
    let awarded=false;
    const finish=()=>{ if(awarded) return; awarded=true;
      if (disc) disc.classList.remove('flying');
      const sEl=document.querySelector(`.di-slot[data-i="${slot}"]`); if(sEl){ sEl.classList.remove('near'); sEl.classList.add('hit'); slotFlare(sEl); sandPuff(sEl); }
      try{ SND.thud(); }catch(_){}
      if (st.trails) { st.trails.push({ path: path.slice(), slot }); if (st.trails.length>6) st.trails.shift(); }
      if (window.gsap && field) gsap.fromTo(field,{x:-7},{x:0,duration:.45,ease:'elastic.out(1,0.45)'});
      award(slot);
    };
    disc.style.transition='none';
    disc.classList.add('flying');
    const g=window.gsap;
    if (g) {
      const tl=g.timeline({ onComplete:finish, onUpdate:()=>spawnTrail(disc) });
      path.forEach((c,i)=>{
        tl.to(disc, { top:topFor(i)+'%', left:leftFor(c)+'%', duration:0.3, ease:'sine.in',
          onStart:()=>{ if(i>0){ sparkAt(disc); pingPegNear(disc); if(i>=4) setNearSlot(Math.round(c)); g.fromTo(disc,{rotation:'-=18'},{rotation:'+=36',duration:.3}); } } });
      });
      tl.to(disc, { top:'82%', left:leftFor(slot)+'%', duration:0.5, ease:'bounce.out', onStart:()=>{ sparkAt(disc); setNearSlot(slot); } });
      st.dropTL=tl;
      st.dropFallback=setTimeout(finish, path.length*300 + 1500);  // fires even if rAF throttled
    } else {
      disc.style.transition='top 2.6s cubic-bezier(.4,.05,.6,1), left 2.6s ease-in-out';
      void disc.getBoundingClientRect();
      disc.style.top='82%'; disc.style.left=leftFor(slot)+'%';
      st.dropFallback=setTimeout(finish, 2700);
    }
    _fx('drop');
  }

  function sparkAt(disc) {
    const field=document.getElementById('di-field'); if(!field||!disc) return;
    const dr=disc.getBoundingClientRect(), fr=field.getBoundingClientRect();
    const s=document.createElement('div'); s.className='di-spark';
    s.style.left=(dr.left-fr.left+dr.width/2)+'px'; s.style.top=(dr.top-fr.top+dr.height/2)+'px';
    field.appendChild(s);
    if (window.gsap) gsap.fromTo(s,{scale:0,opacity:.9},{scale:1.8,opacity:0,duration:.45,ease:'power2.out',onComplete:()=>s.remove()});
    else setTimeout(()=>s.remove(),450);
  }

  function award(slot) {
    const gain = SLOTS[slot];
    st.dist += gain;
    const edge = (slot===0||slot===6);
    fieldFlash(edge);
    if (edge) {
      try{ SND.roar(); }catch(_){}
      const arena=document.querySelector('#di-screen-drop .di-arena');
      if (arena){ arena.classList.remove('roar'); void arena.offsetWidth; arena.classList.add('roar'); setTimeout(()=>{ arena.classList.remove('roar'); }, 1700); }
      const rays=document.getElementById('di-rays');
      if (rays && !REDUCE()){ rays.style.left=(((slot+0.5)/7)*100)+'%'; rays.classList.remove('on'); void rays.offsetWidth; rays.classList.add('on'); setTimeout(()=>{ rays.classList.remove('on'); }, 1300); }
    }
    if (edge && window.SymFX && SymFX.shake) { try{ SymFX.shake(11, .55, document.getElementById('di-field')); }catch(_){} }
    if (window.SymFX) SymFX.burst(window.innerWidth/2, window.innerHeight*0.5, {colors: edge?['#E3C766','#C4A448','#9DBE84','#F0EBE0']:['#9DBE84','#C4A448'], count: edge?26:10, power: edge?12:10, up:0.5, life:1100});
    document.getElementById('di-outcome').innerHTML =
      `<div class="di-outcome-big ${edge?'edge':'gain'}">+${gain} ${T('ΠΗΧΕΙΣ','CUBITS')}</div>
       <div class="di-outcome-desc">${edge?T('Τέλεια ακριανή γραμμή — τεράστια βολή!','A perfect edge line — a mighty throw!'):T('Καλή βολή στο στάδιο.','A fair throw down the stadium.')}</div>
       <button class="sym-btn di-cont" onclick="Discus._cont()">${st.round>=ROUNDS?T('ΑΠΟΤΕΛΕΣΜΑ','RESULT'):T('ΣΥΝΕΧΕΙΑ','CONTINUE')}</button>`;
    _fx(edge?'jackpot':'gold');
  }

  function _cont() {
    if (st.dropTL && st.dropTL.kill) try{ st.dropTL.kill(); }catch(_){}
    if (st.dropFallback) clearTimeout(st.dropFallback);
    show('di-screen-game');
    renderTop(); renderBoard();
    if (st.round>=ROUNDS) end(); else nextQ();
  }

  /* ───────── end ───────── */
  function end() {
    show('di-screen-end');
    const board = standings();
    const won = board[0].me;
    _fx(won?'win':'lose');
    document.getElementById('di-end-art').innerHTML = discusSVG('di-end-disc');
    const title=document.getElementById('di-end-title'), sub=document.getElementById('di-end-sub');
    if (won) {
      title.textContent=T('ΟΛΥΜΠΙΟΝΙΚΗΣ','OLYMPIC VICTOR'); title.className='di-end-title win';
      sub.textContent=T('Η βολή σου ξεπέρασε όλες τις άλλες. Στεφανώθηκες με κότινο στην Ολυμπία.','Your throw surpassed all others. You are crowned with the olive at Olympia.');
    } else {
      title.textContent=T('ΟΙ ΑΓΩΝΕΣ ΕΛΗΞΑΝ','THE GAMES ARE OVER'); title.className='di-end-title lose';
      sub.textContent=T(`Τερμάτισες στη ${board.findIndex(x=>x.me)+1}η θέση. Νικητής: ${board[0].name}.`,`You finished in position ${board.findIndex(x=>x.me)+1}. Winner: ${board[0].name}.`);
    }
    document.getElementById('di-final-board').innerHTML = board.map((x,i)=>
      `<div class="di-final-row${x.me?' me':''}"><span class="di-final-pos">${i+1}</span><span class="di-final-name">${x.name}${i===0?' 🏆':''}</span><span class="di-final-d">${x.dist}</span></div>`
    ).join('');
  }

  /* ───────── field + art ───────── */
  function fieldHTML() {
    // peg rows
    let pegs='';
    for (let r=0;r<ROWS;r++){
      const count = 6 + (r%2);
      const top = 10 + (r/(ROWS))*66;
      let row='';
      for (let c=0;c<count;c++){
        const left = ((c+ (r%2?0.5:0) +0.5)/(count + (r%2?0.5:0)))*100;   // keep the stagger inside the wall
        row += `<span class="di-peg" style="left:${left}%; top:${top}%"></span>`;
      }
      pegs+=row;
    }
    const slots = SLOTS.map((v,i)=>{
      const edge=(i===0||i===6);
      return `<div class="di-slot${edge?' edge':''}" data-i="${i}" style="left:${(i/7)*100}%; width:${100/7}%"><span>${v}</span></div>`;
    }).join('');
    // faint ghosts of this run's previous trajectories (presentation only)
    const leftFor = c => ((c+0.5)/7)*100;
    const ghostLines = (st.trails||[]).map((t,gi,arr)=>{
      const a = (0.10 + 0.10*((gi+1)/arr.length)).toFixed(3);
      const col = (gi===arr.length-1) ? `rgba(227,199,102,${Math.min(0.34, +a+0.10).toFixed(3)})` : `rgba(157,190,132,${a})`;
      const pts = t.path.map((c,i)=>`${leftFor(c).toFixed(2)},${(5+(i/ROWS)*74).toFixed(2)}`).join(' ') + ` ${leftFor(t.slot).toFixed(2)},86`;
      return `<polyline points="${pts}" style="stroke:${col}"/>`;
    }).join('');
    const ghosts = `<svg class="di-ghosts" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${ghostLines}</svg>`;
    // drifting stadium dust (pure CSS animation)
    const dust = [ [12,64,11,-2], [30,38,13,-6], [48,72,10,-4], [63,30,14,-8], [78,58,12,-1], [90,42,15,-7] ]
      .map(d=>`<span class="di-dust" style="left:${d[0]}%; top:${d[1]}%; animation-duration:${d[2]}s; animation-delay:${d[3]}s"></span>`).join('');
    return `${ghosts}<div class="di-pegs">${pegs}</div>${dust}
      <div class="di-token" id="di-token" style="top:6%; left:50%">${tokenSVG()}</div>
      <div class="di-slots">${slots}</div>
      <div class="di-rays" id="di-rays"></div>
      <div class="di-fieldflash" id="di-fieldflash"></div>
      <div class="di-outcome" id="di-outcome"></div>`;
  }

  function tokenSVG(){ return `<span class="di-halo" aria-hidden="true"></span><span class="di-token-spin"><svg viewBox="0 0 40 40" aria-hidden="true">
    <defs><radialGradient id="di-tkg" cx="34%" cy="30%">
      <stop offset="0" stop-color="#EFDDA6"/><stop offset="0.42" stop-color="#C9A44A"/>
      <stop offset="0.78" stop-color="#8A6B2A"/><stop offset="1" stop-color="#57411A"/>
    </radialGradient></defs>
    <circle cx="20" cy="20" r="15.5" fill="url(#di-tkg)" stroke="#2E2410" stroke-width="1.4"/>
    <circle cx="20" cy="20" r="10" fill="none" stroke="rgba(46,36,16,0.55)" stroke-width="1.1"/>
    <circle cx="20" cy="20" r="3.4" fill="rgba(46,36,16,0.55)"/>
    <path d="M7.5 15.5 A14 14 0 0 1 18 5.7" stroke="rgba(255,246,218,0.85)" stroke-width="1.7" fill="none" stroke-linecap="round"/>
  </svg></span>`; }

  function discusSVG(cls){ return `<svg class="${cls}" viewBox="0 0 130 120" fill="none">
    <defs><radialGradient id="di-d1" cx="40%" cy="34%"><stop offset="0" stop-color="#9DBE84"/><stop offset="0.6" stop-color="#6A8752"/><stop offset="1" stop-color="#3E5A2C"/></radialGradient></defs>
    <!-- thrower arm hint -->
    <path d="M30 96c6-26 18-44 36-54" stroke="#4E6B3A" stroke-width="4" fill="none" stroke-linecap="round" opacity="0.5"/>
    <ellipse cx="78" cy="40" rx="34" ry="13" fill="url(#di-d1)" stroke="#2E3F22" stroke-width="2" transform="rotate(-24 78 40)"/>
    <ellipse cx="78" cy="40" rx="22" ry="7" fill="none" stroke="#CDE0BC" stroke-width="1.5" opacity="0.6" transform="rotate(-24 78 40)"/>
    <g fill="#C4A448" opacity="0.7"><circle cx="108" cy="20" r="2"/><circle cx="116" cy="30" r="1.5"/></g>
  </svg>`; }

  return { open, close, _start, _cont, syncLang };
})();
window.Discus = Discus;

/* ── Games-Panel entry points ── */
window.openDiscus  = function(gp){ Discus.open(gp || {}); };
window.closeDiscus = function(){ Discus.close(); };
