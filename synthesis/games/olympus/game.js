/* ══════════════════ ΑΝΑΒΑΣΙΣ — engine ══════════════════
   Millionaire-style tier ladder reimagined as the climb to Olympus.
   Answer to climb a rung; safe sanctuaries bank your ascent; a wrong
   answer casts you down to the last sanctuary. Reach the Throne of Zeus.

   2026 visual revamp — "from the foothill mists to the gold of the aether":
   gameplay/scoring untouched; everything below the rules is presentation.
   The sky itself tracks your altitude (--ao-alt 0→1): clouds thin, divine
   light shafts and the ambrosial aura intensify as you near the Throne.
   Thunder cracks (procedural lightning SVG + flash + shake) punish errors;
   sanctuary milestones flare gold. All particles are overlay-scoped
   (SymFX body layers sit under .sym-overlay z-1000, so juice lives in
   #ao-fxhost). Reduced-motion collapses all ambience.

   API:  Olympus.open()   Olympus.close()
   Reads window.SYM_QUESTIONS and window.siteLang ('gr'|'en').
═════════════════════════════════════════════════════════════════════ */
const Olympus = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const RMQ = (window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null);
  const RM = () => !!(RMQ && RMQ.matches);

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
    const g = window.AO_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  /* ── inline SVG glyphs (procedural, no assets) ── */
  const ICO = {
    temple: '<svg viewBox="0 0 14 12" width="12" height="10" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M2 4.2L7 1.4l5 2.8"/><path d="M2.4 5.4h9.2" opacity="0.8"/><path d="M3.2 6.6v3M7 6.6v3M10.8 6.6v3"/><path d="M1.6 11h10.8"/></svg>',
    bolt:   '<svg viewBox="0 0 10 14" width="9" height="13" fill="currentColor"><path d="M6.2 0.8L1.6 7.6h2.9L3.1 13.4 8.6 5.9H5.4L7.8 0.8z"/></svg>',
    lyre:   '<svg viewBox="0 0 14 14" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"><path d="M2.6 1.2c-.3 3.4.9 5.4 2.4 5.9M11.4 1.2c.3 3.4-.9 5.4-2.4 5.9"/><path d="M5 7.4v3.2M7 7.6v3M9 7.4v3.2"/><path d="M4 12.6h6"/><path d="M5.5 1.6h3" opacity="0.7"/></svg>',
    eye:    '<svg viewBox="0 0 14 10" width="14" height="10" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M1 5c2.2-2.8 4.2-4 6-4s3.8 1.2 6 4c-2.2 2.8-4.2 4-6 4S3.2 7.8 1 5z"/><circle cx="7" cy="5" r="1.7" fill="currentColor" stroke="none"/></svg>',
  };
  const LVLICO = {
    short:  '<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18L12 7l7 8 5-6 14 9"/></svg>',
    normal: '<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18L16 3l6 7 4-4 12 12"/><path d="M13 8l3 3 3-3" opacity="0.7"/></svg>',
    epic:   '<svg viewBox="0 0 40 20" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M2 18L14 5l5 6 3-3 16 10" opacity="0.55"/><path d="M22 2l-5 9h4l-2 7 7-10h-4l3-6z" fill="currentColor" stroke="none"/></svg>',
  };
  const INL_TEMPLE = '<span class="ao-inl">' + ICO.temple + '</span>';

  // Ascent length is chosen at the start. Rungs are generated; a temple mark = banked sanctuary.
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
        '<button class="overlay-back" onclick="closeOlympus()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΑΝΑΒΑΣΙΣ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
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
<!-- AMBIENT SKY (altitude-reactive: --ao-alt 0..1) -->
<div class="ao-sky" id="ao-sky" aria-hidden="true">
  <div class="ao-stars" id="ao-stars"></div>
  <div class="ao-aura"></div>
  <div class="ao-shafts"><i></i><i></i><i></i></div>
  <div class="ao-clouds" id="ao-clouds"></div>
  <div class="ao-motes" id="ao-motes"></div>
  <div class="ao-bank ao-bank-l"></div>
  <div class="ao-bank ao-bank-r"></div>
  <div class="ao-mist"></div>
</div>

<!-- INTRO -->
<div id="ao-screen-intro" class="ao-screen">
  ${mountainSVG('ao-mtn')}
  <div class="ao-logo" id="ao-logo">ΑΝΑΒΑΣΙΣ</div>
  <div class="ao-logo-en" data-i18n="subtitle"></div>
  <div class="ao-intro-txt" data-i18n="intro"></div>
  <div class="ao-levels" id="ao-levels"></div>
</div>

<!-- GAME -->
<div id="ao-screen-game" class="ao-screen">
  <div class="ao-arena">
    <aside class="ao-path">
      <div class="ao-meter" aria-hidden="true"><i id="ao-meter-fill"></i><span class="ao-meter-peak">${ICO.bolt}</span></div>
      <div class="ao-ladder" id="ao-ladder"></div>
    </aside>
    <div class="ao-main">
      <div class="ao-q-meta">
        <span class="ao-q-num" id="ao-qnum"></span>
        <span class="ao-q-line"></span>
        <span class="ao-glorybox" id="ao-glorybox">✦ <span class="ao-glory-lb" id="ao-glory-lb"></span> <b id="ao-glory">0</b></span>
        <span class="ao-altitude" id="ao-altitude"></span>
      </div>
      <div class="ao-q-card"><div class="ao-q-text" id="ao-qtext"></div></div>
      <div class="ao-answers" id="ao-answers"></div>
      <div class="ao-feedback" id="ao-feedback"></div>
      <div class="ao-lifelines">
        <button class="ao-life" id="ao-life-muse" onclick="Olympus._muse()">
          <span class="ao-life-ic">${ICO.lyre}</span><span class="ao-life-tx" data-i18n="muse"></span>
        </button>
        <button class="ao-life" id="ao-life-oracle" onclick="Olympus._oracle()">
          <span class="ao-life-ic">${ICO.eye}</span><span class="ao-life-tx" data-i18n="oracle"></span>
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
</div>

<!-- OVERLAY-SCOPED FX LAYERS -->
<div class="ao-stormveil" id="ao-storm" aria-hidden="true"></div>
<div class="ao-flash" id="ao-flash" aria-hidden="true"></div>
<div class="ao-fxhost" id="ao-fxhost" aria-hidden="true"></div>`;
    buildAmbient();
    kineticLogo();
  }

  /* ── ambient: stars (one box-shadow field), drifting clouds, rising motes ── */
  function buildAmbient() {
    const stars = document.getElementById('ao-stars');
    if (stars) {
      const sh = [];
      for (let i = 0; i < 72; i++) {
        sh.push(`${(Math.random()*100).toFixed(1)}vw ${(Math.random()*72).toFixed(1)}vh 0 ${(Math.random()<0.22?1:0)}px rgba(240,235,224,${(0.2+Math.random()*0.6).toFixed(2)})`);
      }
      stars.style.boxShadow = sh.join(',');
    }
    const cl = document.getElementById('ao-clouds');
    if (cl) {
      for (let i = 0; i < 7; i++) {
        const c = document.createElement('i'); c.className='ao-cloud';
        const w = 220 + Math.random()*320;
        c.style.width = w.toFixed(0)+'px';
        c.style.height = (w*0.28).toFixed(0)+'px';
        c.style.left = (Math.random()*92 - 6).toFixed(1)+'%';
        c.style.top = (6 + Math.random()*70).toFixed(1)+'%';
        c.style.opacity = (0.05 + Math.random()*0.09).toFixed(3);
        c.style.animationDuration = (26 + Math.random()*32).toFixed(1)+'s';
        c.style.animationDelay = (-Math.random()*30).toFixed(1)+'s';
        cl.appendChild(c);
      }
    }
    const mo = document.getElementById('ao-motes');
    if (mo && !RM()) {
      for (let i = 0; i < 22; i++) {
        const m = document.createElement('i'); m.className='ao-mote';
        const s = 1.8 + Math.random()*2;
        m.style.width = m.style.height = s.toFixed(1)+'px';
        m.style.left = (Math.random()*100).toFixed(1)+'%';
        m.style.setProperty('--dx', ((Math.random()-0.5)*90).toFixed(0)+'px');
        m.style.animationDuration = (9 + Math.random()*11).toFixed(1)+'s';
        m.style.animationDelay = (-Math.random()*16).toFixed(1)+'s';
        mo.appendChild(m);
      }
    }
  }

  /* ── kinetic gold logotype: letters rise in staggered ── */
  function kineticLogo() {
    const logo = document.getElementById('ao-logo');
    if (!logo) return;
    const txt = logo.textContent;
    logo.innerHTML = txt.split('').map((c,i)=>`<span style="animation-delay:${90+i*55}ms">${c}</span>`).join('');
  }

  const I18N = {
    subtitle:{ gr:'Η ανάβαση στον Όλυμπο', en:'The Ascent of Olympus' },
    intro:   { gr:'Κάθε σωστή απάντηση σε ανεβάζει μία βαθμίδα προς τον <b>Θρόνο του Διός</b>. Τα <b>τεμένη</b> ('+INL_TEMPLE+') κατοχυρώνουν την άνοδό σου· ένα λάθος σε ρίχνει στο τελευταίο τέμενος. Φτάσε στην κορυφή.', en:'Each correct answer lifts you one rung toward the <b>Throne of Zeus</b>. <b>Sanctuaries</b> ('+INL_TEMPLE+') bank your ascent; a wrong answer casts you back to the last one. Reach the summit.' },
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
      document.getElementById('ao-qtext').textContent = QT(st.cur.q);
      renderLadder(); renderMeta();
    }
  }
  function renderLevels(){
    const wrap=document.getElementById('ao-levels'); if(!wrap) return;
    wrap.innerHTML = Object.keys(LEVELS).map(k=>{
      const lv=LEVELS[k];
      return `<button class="ao-level" onclick="Olympus._level('${k}')"><span class="ao-level-ic">${LVLICO[k]||''}</span><span class="ao-level-name">${lv.label[L()]}</span><span class="ao-level-sub">${lv.sub[L()]}</span></button>`;
    }).join('');
  }
  function _level(k){ st.levelKey=k; _start(); }
  function show(id){
    document.querySelectorAll('#ao-wrap .ao-screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    const sky=document.getElementById('ao-sky');
    if (sky && id==='ao-screen-intro') sky.classList.remove('ao-part');
    _fx('screen',{id});
  }

  /* ───────── start ───────── */
  function _start() {
    const lvlKey = st.levelKey || 'normal';
    RUNGS = genRungs(LEVELS[lvlKey].n); TOP = RUNGS.length - 1;
    st = {
      levelKey:lvlKey,
      rung:0, lastSafe:0, qNum:0, answered:false, glory:0,
      pool: shuffle([..._gpPool()]), idx:0,
      muse:true, oracle:true, fiftyHidden:[],
      _gloryShown:0,
    };
    show('ao-screen-game');
    const sky=document.getElementById('ao-sky'); if(sky) sky.classList.add('ao-part');
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
      const mark = r.summit ? ICO.bolt : (r.safe ? ICO.temple : '');
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
    const lb=document.getElementById('ao-glory-lb'); if(lb) lb.textContent=T('ΔΟΞΑ','GLORY');
    const g=document.getElementById('ao-glory');
    if (g) {
      const shown = st._gloryShown||0;
      if (st.glory !== shown) {
        countUp(g, shown, st.glory, 700);
        st._gloryShown = st.glory;
        if (window.SymFX) SymFX.pop(document.getElementById('ao-glorybox'), 1.15);
      } else g.textContent = st.glory;
    }
    // altitude drives the ambient sky (aura, shafts, clouds, mist, stars)
    const wrap=document.getElementById('ao-wrap');
    const alt = TOP ? (st.rung/TOP) : 0;
    if (wrap) wrap.style.setProperty('--ao-alt', alt.toFixed(3));
    const mf=document.getElementById('ao-meter-fill');
    if (mf) mf.style.height = (alt*100).toFixed(1)+'%';
  }

  /* ───────── loop ───────── */
  function nextQ() {
    st.answered=false; st.cur=getQ(); st.qNum++; st.fiftyHidden=[];
    const qt=document.getElementById('ao-qtext');
    qt.textContent = QT(st.cur.q);
    qt.classList.remove('in'); void qt.offsetWidth; qt.classList.add('in');
    const fb=document.getElementById('ao-feedback'); fb.textContent=''; fb.className='ao-feedback';
    const wrap=document.getElementById('ao-answers'); wrap.innerHTML=''; wrap.classList.remove('done');
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='ao-ans'; b.dataset.i=i;
      b.style.animationDelay=(i*70)+'ms';
      b.innerHTML=`<span class="ao-ans-key">${keys[i]}</span><span class="ao-ans-tx">${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderLadder(); renderMeta();
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#ao-answers .ao-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    document.getElementById('ao-answers').classList.add('done');
    const fb=document.getElementById('ao-feedback');
    if (chosen===st.cur.c) {
      st.rung++; const gain = 100 + st.rung*20; st.glory += gain;
      if (RUNGS[st.rung].safe) st.lastSafe = st.rung;
      _fx('correct',{el:btn});
      sparksAt(btn, { count:18 });
      floatDelta('+'+gain+' '+T('ΔΟΞΑ','GLORY'), 'ok', btn);
      climbFeel();
      if (st.rung>=TOP) {
        fb.textContent=T('ΕΦΤΑΣΕΣ ΤΗΝ ΚΟΡΥΦΗ','YOU REACHED THE SUMMIT'); fb.className='ao-feedback ao-fb-ok';
        sparksAt(btn, { count:26, power:11, colors:['#F6E7B0','#E3C766','#FFF'] });
        renderLadder(); renderMeta();
        return setTimeout(()=>end(true), 1100);
      }
      const banked = RUNGS[st.rung].safe;
      fb.textContent = banked ? T('ΣΩΣΤΟ — τέμενος! Η άνοδος κατοχυρώθηκε','CORRECT — sanctuary! Ascent banked')
                              : T('ΣΩΣΤΟ — ανεβαίνεις','CORRECT — you climb');
      fb.className='ao-feedback ao-fb-ok';
      renderLadder(); renderMeta();
      if (banked) sanctFlare();
      setTimeout(nextQ, 1150);
    } else {
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      thunder(btn);
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
      fallFeel();
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
    sparksAt(document.getElementById('ao-life-muse'), { count:10, colors:['#7FB0BC','#F0EBE0'] });
  }
  function _oracle() {
    if (!st.oracle || st.answered) return; st.oracle=false;
    document.getElementById('ao-life-oracle').classList.add('spent');
    const b = document.querySelector(`#ao-answers .ao-ans[data-i="${st.cur.c}"]`);
    if (b) b.classList.add('vision');
    _fx('oracle');
    sparksAt(document.getElementById('ao-life-oracle'), { count:10, colors:['#7FB0BC','#F0EBE0'] });
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
      const tt=T('ΑΘΑΝΑΣΙΑ','IMMORTALITY');
      title.textContent=tt; title.className='ao-end-title win';
      sub.textContent=T('Ανέβηκες στον Θρόνο του Διός και κάθισες ανάμεσα στους αθανάτους. Δόξα αἰώνιος.','You climbed to the Throne of Zeus and sat among the immortals. Glory everlasting.');
      if (window.SymFX && !RM()) SymFX.scramble(title, tt, { duration:850 });
      goldFlash(); goldRain();
    } else {
      title.textContent=T('Η ΠΤΩΣΗ','THE FALL'); title.className='ao-end-title lose';
      sub.textContent=T(`Έφτασες ως τη βαθμίδα «${RUNGS[st.rung][L()]}». Ο Όλυμπος περιμένει την επόμενη ανάβαση.`,`You reached "${RUNGS[st.rung][L()]}". Olympus awaits your next ascent.`);
    }
    document.getElementById('ao-end-rung').innerHTML =
      `<div class="ao-end-glory">${T('ΔΟΞΑ','GLORY')} <b id="ao-end-gn">0</b></div>
       <div class="ao-end-rungname">${T('Υψηλότερη βαθμίδα','Highest rung')}: ${RUNGS[won?TOP:st.rung][L()]}</div>`;
    countUp(document.getElementById('ao-end-gn'), 0, st.glory, 1100);
  }

  /* ═════════ presentation FX (overlay-scoped; gameplay untouched) ═════════ */

  function _host(){ return document.getElementById('ao-fxhost'); }

  function countUp(el, from, to, ms) {
    if (!el) return;
    if (RM() || from === to) { el.textContent = to; return; }
    const t0 = performance.now();
    (function f(t){
      const k = Math.min(1, (t - t0) / ms);
      const e = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }

  /* particle scatter at an element, inside the overlay (above the stage) */
  function sparksAt(el, o) {
    const host=_host(); if (!host || !el || RM()) return;
    o = Object.assign({ count:16, colors:['#E3C766','#F0EBE0','#C4A448'], power:8, size:5, life:900 }, o||{});
    const hr=host.getBoundingClientRect(), r=el.getBoundingClientRect();
    const cx=r.left+r.width/2-hr.left, cy=r.top+r.height/2-hr.top;
    for (let i=0;i<o.count;i++){
      const p=document.createElement('i'); p.className='ao-spark';
      const c=o.colors[(Math.random()*o.colors.length)|0];
      const s=2+Math.random()*o.size;
      p.style.width=p.style.height=s.toFixed(1)+'px';
      p.style.background=c; p.style.boxShadow=`0 0 8px ${c}`;
      p.style.left=cx+'px'; p.style.top=cy+'px';
      host.appendChild(p);
      const a=Math.random()*Math.PI*2, sp=o.power*(6+Math.random()*16);
      const dx=Math.cos(a)*sp, dy=Math.sin(a)*sp-30;
      const dur=o.life*(0.7+Math.random()*0.6);
      p.animate([
        { transform:'translate(-50%,-50%)', opacity:1 },
        { transform:`translate(calc(-50% + ${(dx*0.7).toFixed(0)}px), calc(-50% + ${dy.toFixed(0)}px))`, opacity:1, offset:0.5 },
        { transform:`translate(calc(-50% + ${dx.toFixed(0)}px), calc(-50% + ${(dy+70).toFixed(0)}px)) scale(.4)`, opacity:0 },
      ], { duration:dur, easing:'cubic-bezier(.2,.7,.4,1)', fill:'forwards' });
      setTimeout(()=>p.remove(), dur+60);
    }
  }

  /* floating "+N GLORY" delta above an element */
  function floatDelta(txt, cls, el) {
    const host=_host(); if (!host || !el) return;
    const hr=host.getBoundingClientRect(), r=el.getBoundingClientRect();
    const d=document.createElement('div');
    d.className='ao-float '+(cls||'');
    d.textContent=txt;
    d.style.left=(r.left+r.width/2-hr.left)+'px';
    d.style.top=(r.top-hr.top)+'px';
    host.appendChild(d);
    if (RM()) { setTimeout(()=>d.remove(), 900); return; }
    d.animate([
      { transform:'translate(-50%,0) scale(.7)', opacity:0 },
      { transform:'translate(-50%,-26px) scale(1.08)', opacity:1, offset:0.3 },
      { transform:'translate(-50%,-72px) scale(1)', opacity:0 },
    ], { duration:1150, easing:'cubic-bezier(.2,.8,.3,1)', fill:'forwards' });
    setTimeout(()=>d.remove(), 1200);
  }

  /* expanding gold ring (sanctuary milestone) */
  function ringAt(el) {
    const host=_host(); if (!host || !el || RM()) return;
    const hr=host.getBoundingClientRect(), r=el.getBoundingClientRect();
    const d=document.createElement('div'); d.className='ao-ring';
    d.style.left=(r.left+r.width/2-hr.left)+'px';
    d.style.top=(r.top+r.height/2-hr.top)+'px';
    host.appendChild(d);
    d.animate([
      { transform:'translate(-50%,-50%) scale(.25)', opacity:1 },
      { transform:'translate(-50%,-50%) scale(1.6)', opacity:0 },
    ], { duration:720, easing:'cubic-bezier(.2,.7,.3,1)', fill:'forwards' });
    setTimeout(()=>d.remove(), 780);
  }

  /* divine wrath: white-blue flash + procedural lightning crack + shake + storm veil */
  function thunder(el) {
    const veil=document.getElementById('ao-storm');
    if (veil) { veil.classList.add('on'); setTimeout(()=>veil.classList.remove('on'), 700); }
    if (window.SymFX) SymFX.shake(9, .5, document.querySelector('#ao-screen-game .ao-arena'));
    if (RM()) return;
    const flash=document.getElementById('ao-flash');
    if (flash) flash.animate(
      [{opacity:0},{opacity:.9,offset:.08},{opacity:.22,offset:.4},{opacity:0}],
      { duration:520, easing:'ease-out' });
    const host=_host(); if (!host || !el) return;
    const hr=host.getBoundingClientRect(), r=el.getBoundingClientRect();
    const x1=r.left+r.width/2-hr.left, y1=Math.max(30, r.top-hr.top);
    const x0=x1+(Math.random()-0.5)*140, segs=7;
    let d=`M${x0.toFixed(1)} 0`;
    for (let i=1;i<=segs;i++){
      const t=i/segs;
      const px=x0+(x1-x0)*t+(Math.random()-0.5)*46*(1-t*0.5);
      d+=` L${px.toFixed(1)} ${(y1*t).toFixed(1)}`;
    }
    const NS='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(NS,'svg');
    svg.setAttribute('class','ao-crack');
    svg.setAttribute('width',hr.width); svg.setAttribute('height',hr.height);
    const path=document.createElementNS(NS,'path');
    path.setAttribute('d',d); path.setAttribute('fill','none');
    path.setAttribute('stroke','#EAF4FF'); path.setAttribute('stroke-width','2.4');
    path.setAttribute('stroke-linejoin','miter');
    svg.appendChild(path); host.appendChild(svg);
    try {
      const len=path.getTotalLength();
      path.style.strokeDasharray=len; path.style.strokeDashoffset=len;
      path.animate([{strokeDashoffset:len},{strokeDashoffset:0}], { duration:130, easing:'ease-in', fill:'forwards' });
    } catch(_){}
    svg.animate([{opacity:1},{opacity:1,offset:.55},{opacity:0}], { duration:620, fill:'forwards' });
    setTimeout(()=>svg.remove(), 680);
  }

  /* camera settle on climb / ladder judder on fall */
  function climbFeel() {
    const ar=document.querySelector('#ao-screen-game .ao-arena');
    if (!ar || RM()) return;
    ar.classList.remove('climb'); void ar.offsetWidth; ar.classList.add('climb');
    setTimeout(()=>ar.classList.remove('climb'), 650);
  }
  function fallFeel() {
    const lad=document.getElementById('ao-ladder');
    if (!lad || RM()) return;
    lad.classList.remove('ao-fall'); void lad.offsetWidth; lad.classList.add('ao-fall');
    setTimeout(()=>lad.classList.remove('ao-fall'), 700);
  }

  /* sanctuary banked: flare the current rung */
  function sanctFlare() {
    const cur=document.querySelector('#ao-ladder .ao-rung.cur'); if(!cur) return;
    if (window.SymFX) SymFX.pop(cur, 1.1);
    sparksAt(cur, { count:14, colors:['#E3C766','#FFF6D8'] });
    ringAt(cur);
  }

  /* summit celebration */
  function goldFlash() {
    const flash=document.getElementById('ao-flash');
    if (!flash || RM()) return;
    const old=flash.style.background;
    flash.style.background='radial-gradient(120% 90% at 50% 0%, rgba(255,243,196,.95), rgba(227,199,102,.45) 45%, transparent 75%)';
    flash.animate([{opacity:0},{opacity:.75,offset:.12},{opacity:0}], { duration:900, easing:'ease-out' });
    setTimeout(()=>{ flash.style.background=old; }, 950);
  }
  function goldRain() {
    const host=_host(); if (!host || RM()) return;
    const hr=host.getBoundingClientRect();
    for (let i=0;i<34;i++){
      const p=document.createElement('i'); p.className='ao-spark';
      const s=2.5+Math.random()*3.6;
      p.style.width=p.style.height=s.toFixed(1)+'px';
      const c=['#E3C766','#F6E7B0','#C4A448'][(Math.random()*3)|0];
      p.style.background=c; p.style.boxShadow=`0 0 8px ${c}`;
      p.style.left=(Math.random()*hr.width).toFixed(0)+'px';
      p.style.top='-8px';
      host.appendChild(p);
      const dist=hr.height*(0.45+Math.random()*0.45);
      const delay=Math.random()*900, dur=1200+Math.random()*900;
      p.animate([
        { transform:'translateY(0)', opacity:0 },
        { opacity:1, offset:0.12 },
        { transform:`translateY(${dist.toFixed(0)}px) translateX(${((Math.random()-0.5)*60).toFixed(0)}px)`, opacity:0 },
      ], { duration:dur, delay, easing:'cubic-bezier(.3,.4,.6,1)', fill:'both' });
      setTimeout(()=>p.remove(), delay+dur+80);
    }
  }

  /* ───────── art (procedural SVG; ids namespaced per instance) ───────── */
  function mountainSVG(cls){ return `<svg class="${cls}" viewBox="0 0 180 140" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="${cls}-peak" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A5878"/><stop offset="0.55" stop-color="#242E4C"/><stop offset="1" stop-color="#101624"/></linearGradient>
      <linearGradient id="${cls}-far" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B3552"/><stop offset="1" stop-color="#141A2C"/></linearGradient>
      <radialGradient id="${cls}-sun" cx="50%" cy="42%"><stop offset="0" stop-color="#FFF3C4"/><stop offset="0.55" stop-color="#E3C766"/><stop offset="1" stop-color="#8E7322"/></radialGradient>
    </defs>
    <circle cx="90" cy="20" r="17" fill="#E3C766" opacity="0.14"/>
    <circle cx="90" cy="20" r="27" fill="#E3C766" opacity="0.06"/>
    <path d="M4 132L52 66l30 38 26-34 40 46 24 16z" fill="url(#${cls}-far)" opacity="0.85"/>
    <path d="M20 132L90 26l70 106z" fill="url(#${cls}-peak)" stroke="#0C1220" stroke-width="1.5"/>
    <path d="M90 26L76 50l8-3 6 6 7-7 7 4z" fill="#F3ECDC"/>
    <path d="M90 26L66 66" stroke="#E3C766" stroke-width="1.4" opacity="0.55" stroke-linecap="round"/>
    <ellipse cx="50" cy="94" rx="30" ry="8" fill="#C9D4E4" opacity="0.15"/>
    <ellipse cx="130" cy="80" rx="26" ry="7" fill="#C9D4E4" opacity="0.12"/>
    <ellipse cx="92" cy="110" rx="42" ry="9" fill="#C9D4E4" opacity="0.10"/>
    <g transform="translate(37,-5) scale(0.72)"><path d="M70 2l4 12 12-2-8 10 8 10-12-2-4 12-4-12-12 2 8-10-8-10 12 2z" fill="url(#${cls}-sun)" opacity="0.95"/></g>
  </svg>`; }
  function boltSVG(cls){ return `<svg class="${cls}" viewBox="0 0 140 140" fill="none" aria-hidden="true">
    <defs><radialGradient id="${cls}-b1" cx="50%" cy="40%"><stop offset="0" stop-color="#FFF6D8"/><stop offset="0.5" stop-color="#E3C766"/><stop offset="1" stop-color="#8E7322"/></radialGradient></defs>
    <circle cx="70" cy="70" r="52" fill="#E3C766" opacity="0.07"/>
    <circle cx="70" cy="70" r="50" fill="none" stroke="#C4A448" stroke-opacity="0.4" stroke-width="2" stroke-dasharray="4 6"/>
    <g class="ao-rays" stroke="#C4A448" stroke-width="2" stroke-linecap="round" opacity="0.5">
      <path d="M70 12v16M111 29l-11.3 11.3M128 70h-16M111 111l-11.3-11.3M70 128v-16M29 111l11.3-11.3M12 70h16M29 29l11.3 11.3"/>
    </g>
    <g transform="translate(10,10)"><path d="M66 8L34 64h22l-8 48 44-66H66l10-38z" fill="url(#${cls}-b1)" stroke="#6E5A1E" stroke-width="2" stroke-linejoin="round"/></g>
  </svg>`; }

  return { open, close, _start, _level, _muse, _oracle, syncLang };
})();
window.Olympus = Olympus;

/* ── Games-Panel entry points ── */
window.openOlympus  = function(gp){ Olympus.open(gp || {}); };
window.closeOlympus = function(){ Olympus.close(); };
