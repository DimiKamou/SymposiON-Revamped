/* ══════════════════ ΑΚΡΟΠΟΛΙΣ — engine ══════════════════
   Builder reimagined as raising the monuments of the Acropolis.
   Pick a scale of ambition:
     • ΧΑΜΗΛΟ — the Parthenon alone
     • ΜΕΣΑΙΟ — the Parthenon and the Erechtheion
     • ΥΨΗΛΟ  — the whole rock: Propylaia, Athena Nike, Parthenon, Erechtheion
   Each correct answer sets one member (column → architrave → pediment).
   Raise every monument before the rival masters.  API: Parthenon.open()/.close()

   v2 presentation: golden-hour construction site — dusk sky, sun-warmed
   marble, ghost-blueprint of the members still to set, wooden scaffold and
   geranos hoist on the active monument, dust when a member lands, gold beam
   on completion. All FX live INSIDE the overlay (the .sym-overlay stacking
   context sits above fx.js body-level set-pieces). Reduced-motion aware.
═══════════════════════════════════════════════════════════════════ */
const Parthenon = (() => {

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
    const g = window.PN_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const RIVALS = ['ΙΚΤΙΝΟΣ','ΚΑΛΛΙΚΡΑΤΗΣ','ΦΕΙΔΙΑΣ'];

  const REDUCE = (() => {
    try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (_) { return false; }
  })();

  // each building costs (cols + 2) pieces: columns, then architrave, then pediment
  const B = {
    propylaia:   { cols:4, w:104, h:66, name:{gr:'Προπύλαια',en:'Propylaia'} },
    nike:        { cols:4, w:78,  h:50, name:{gr:'Ναός Αθηνάς Νίκης',en:'Temple of Athena Nike'} },
    parthenon:   { cols:6, w:150, h:82, name:{gr:'Παρθενών',en:'Parthenon'} },
    erechtheion: { cols:4, w:104, h:64, name:{gr:'Ερέχθειο',en:'Erechtheion'} },
  };
  const LEVELS = {
    low:  { label:{gr:'ΧΑΜΗΛΟ',en:'LOW'},   sub:{gr:'Ο Παρθενώνας',en:'The Parthenon'},            keys:['parthenon'] },
    mid:  { label:{gr:'ΜΕΣΑΙΟ',en:'MID'},   sub:{gr:'Παρθενών & Ερέχθειο',en:'Parthenon & Erechtheion'}, keys:['parthenon','erechtheion'] },
    high: { label:{gr:'ΥΨΗΛΟ',en:'HIGH'},   sub:{gr:'Ολόκληρη η Ακρόπολη',en:'The whole Acropolis'}, keys:['propylaia','nike','parthenon','erechtheion'] },
  };

  let st = {};
  // presentational only: last-seen rival progress, so the hill-camps can
  // flash the render in which their rival actually advanced
  let _rivPrev = null;

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('pn:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#pn-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('pn-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('pn-screen-intro')) build();
    syncLang();
    show('pn-screen-intro');
  }
  function close() {
    document.getElementById('pn-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('pn-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'pn-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeParthenon()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΑΚΡΟΠΟΛΙΣ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="pn-wrap"></div></div>' +
      '<div class="pn-flash" id="pn-flash" aria-hidden="true"></div>';
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
    document.getElementById('pn-wrap').innerHTML = `
${ambientHTML()}
<!-- INTRO -->
<div id="pn-screen-intro" class="pn-screen">
  ${templeSVG('high', 99, -1, 'pn-hero')}
  <div class="pn-logo">${logoHTML('ΑΚΡΟΠΟΛΙΣ')}</div>
  <div class="pn-logo-en" data-i18n="subtitle"></div>
  <div class="pn-meander" aria-hidden="true">${meanderSVG()}</div>
  <div class="pn-intro-txt" data-i18n="intro"></div>
  <div class="pn-levels" id="pn-levels"></div>
</div>

<!-- GAME -->
<div id="pn-screen-game" class="pn-screen">
  <div class="pn-stage" id="pn-stage"></div>
  <div class="pn-board" id="pn-board"></div>
  <div class="pn-qbody">
    <div class="pn-q-meta"><span class="pn-q-num" id="pn-qnum"></span><span class="pn-q-line"></span><span class="pn-next" id="pn-next"></span><span class="pn-built" id="pn-built"></span></div>
    <div class="pn-q-card"><div class="pn-q-text" id="pn-qtext"></div></div>
    <div class="pn-answers" id="pn-answers"></div>
    <div class="pn-feedback" id="pn-feedback"></div>
  </div>
</div>

<!-- END -->
<div id="pn-screen-end" class="pn-screen">
  <div id="pn-end-art"></div>
  <div class="pn-end-title" id="pn-end-title"></div>
  <div class="pn-end-sub" id="pn-end-sub"></div>
  <div class="pn-final-board" id="pn-final-board"></div>
  <div class="pn-end-btns">
    <button class="sym-btn" onclick="Parthenon._again()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Parthenon.close()" data-i18n="exit"></button>
  </div>
</div>`;
    renderLevels();
  }

  function renderLevels() {
    const wrap=document.getElementById('pn-levels'); if(!wrap) return;
    wrap.innerHTML = Object.keys(LEVELS).map(k=>{
      const lv=LEVELS[k], tot=totalFor(k);
      return `<button class="pn-level" onclick="Parthenon._level('${k}')">
        <span class="pn-level-glyph">${scopeGlyph(lv.keys.length)}</span>
        <span class="pn-level-name">${lv.label[L()]}</span>
        <span class="pn-level-sub">${lv.sub[L()]}</span>
        <span class="pn-level-cost">${tot} ${T('μέλη','members')}</span>
      </button>`;
    }).join('');
  }

  const I18N = {
    subtitle:{ gr:'Τα μνημεία της Ακρόπολης', en:'The monuments of the Acropolis' },
    intro:   { gr:'Είσαι ο αρχιτέκτονας της <b>Ακρόπολης</b>. Κάθε σωστή απάντηση τοποθετεί ένα μέλος — κίονα, επιστύλιο, αέτωμα. Διάλεξε πόσο φιλόδοξο θα είναι το έργο σου και πρόλαβε τους αντίπαλους μαστόρους.', en:'You are the architect of the <b>Acropolis</b>. Each correct answer sets one member — a column, an architrave, a pediment. Choose how ambitious your work will be and outpace the rival masters.' },
    again:   { gr:'ΑΛΛΟ ΕΡΓΟ', en:'ANOTHER WORK' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#pn-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    renderLevels();
    if (st && st.cur && document.getElementById('pn-screen-game').classList.contains('active')) {
      document.getElementById('pn-qtext').textContent = QT(st.cur.q);
      renderStage(-1); renderBoard(); renderMeta();
    }
  }
  function show(id){ document.querySelectorAll('#pn-wrap .pn-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── totals / piece lookup ───────── */
  function totalFor(levelKey){ return LEVELS[levelKey].keys.reduce((s,k)=>s+B[k].cols+2,0); }
  function total(){ return totalFor(st.levelKey); }
  function pieceAt(g){
    let off=0;
    for (const k of LEVELS[st.levelKey].keys){
      const b=B[k], pc=b.cols+2;
      if (g<off+pc){
        const li=g-off;
        const type = li<b.cols ? {gr:'κίονα',en:'column'} : (li===b.cols ? {gr:'επιστύλιο',en:'architrave'} : {gr:'αέτωμα',en:'pediment'});
        return { b, type };
      }
      off+=pc;
    }
    const b=B[LEVELS[st.levelKey].keys.slice(-1)[0]];
    return { b, type:{gr:'αέτωμα',en:'pediment'} };
  }

  /* ───────── start ───────── */
  function _level(k){ st.levelKey=k; _start(); }
  function _again(){ if (st.levelKey) _start(); else show('pn-screen-intro'); }
  function _start() {
    const lvl = st.levelKey || 'low';
    st = {
      levelKey:lvl, qNum:0, answered:false, built:0,
      pool: shuffle([..._gpPool()]), idx:0,
      rivals: RIVALS.map(n=>({ name:n, built:0 })),
      done:false,
    };
    _rivPrev = null; // presentational reset (camp flash tracking)
    show('pn-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function renderStage(latest) {
    const tot=total();
    const riv=(st.rivals||[]).map(r=>tot?r.built/tot:0);
    document.getElementById('pn-stage').innerHTML = templeSVG(st.levelKey, st.built, latest, 'pn-temple', riv);
    // the weighted drop (accelerating fall → contact squash → settle) is
    // fully CSS-driven via .pn-rise so the same easing runs with or without
    // gsap; keeping a second tween on the element would fight the keyframes.
  }
  function builders() {
    const tot=total();
    return [{name:T('ΕΣΥ','YOU'),built:st.built,me:true}, ...st.rivals.map(r=>({...r,me:false}))]
      .sort((a,b)=>b.built-a.built).map(x=>({...x, tot}));
  }
  function renderBoard() {
    const tot=total();
    if(window.SymStandings) SymStandings.feed('pn', builders(), {key:'built', unit:'μέλη', accent:'var(--sym-gold)', title:'ΑΚΡΟΠΟΛΙΣ'});
    const host=document.getElementById('pn-board');
    // FLIP capture: remember where each builder's chip sat before re-render
    // so overtakes glide instead of snapping (presentational only)
    const prevTop={};
    if (!REDUCE) host.querySelectorAll('.pn-board-chip').forEach(el=>{
      const n=el.querySelector('.pn-board-name');
      if (n) prevTop[n.textContent]=el.getBoundingClientRect().top;
    });
    host.innerHTML = builders().map((x,i)=>
      `<div class="pn-board-chip${x.me?' me':''}${i===0&&x.built>0?' lead':''}"><span class="pn-board-name">${x.name}</span>
        <span class="pn-board-bar"><span class="pn-board-fill" style="width:${(x.built/tot)*100}%"></span></span>
        <span class="pn-board-n">${x.built}/${tot}</span></div>`
    ).join('');
    if (!REDUCE) host.querySelectorAll('.pn-board-chip').forEach(el=>{
      const n=el.querySelector('.pn-board-name');
      const was=n?prevTop[n.textContent]:undefined;
      if (was===undefined) return;
      const d=was-el.getBoundingClientRect().top;
      if (Math.abs(d)>2){
        try{ el.animate([{transform:`translateY(${d.toFixed(1)}px)`},{transform:'translateY(0)'}],{duration:430,easing:'cubic-bezier(.3,.85,.3,1)'}); }catch(_){}
      }
    });
  }
  function renderMeta() {
    document.getElementById('pn-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum;
    document.getElementById('pn-built').textContent = T('ΜΕΛΗ ','MEMBERS ')+st.built+' / '+total();
    const nx=document.getElementById('pn-next');
    if (nx){
      if (st.built>=total()){ nx.innerHTML=''; nx.style.display='none'; }
      else {
        const info=pieceAt(st.built);
        const lbl = L()==='en'
          ? info.type.en.toUpperCase()
          : ({'κίονα':'ΚΙΩΝ','επιστύλιο':'ΕΠΙΣΤΥΛΙΟ','αέτωμα':'ΑΕΤΩΜΑ'})[info.type.gr] || info.type.gr;
        nx.style.display='';
        nx.innerHTML = pieceGlyph(info.type.en)+`<span>${T('ΕΠΟΜΕΝΟ','NEXT')}: ${lbl} · ${info.b.name[L()]}</span>`;
        // eased pop when the awaited member actually changes (not every question)
        const sig = lbl+'·'+info.b.name[L()];
        if (nx.dataset.pv!==sig){
          nx.dataset.pv=sig;
          if(!REDUCE){ nx.classList.remove('pn-next-pop'); void nx.offsetWidth; nx.classList.add('pn-next-pop'); }
        }
      }
    }
  }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.done) return;
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('pn-qtext').textContent = QT(st.cur.q);
    const card=document.querySelector('#pn-screen-game .pn-q-card');
    if (card){ card.classList.remove('pn-q-in'); void card.offsetWidth; card.classList.add('pn-q-in'); }
    const fb=document.getElementById('pn-feedback'); fb.textContent=''; fb.className='pn-feedback';
    const wrap=document.getElementById('pn-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='pn-ans';
      b.innerHTML=`<span class="pn-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderStage(-1); renderBoard(); renderMeta();
  }

  function advanceRivals() {
    const tot=total();
    st.rivals.forEach(r=>{ if (Math.random()<0.5) r.built=Math.min(tot, r.built+1); });
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#pn-answers .pn-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('pn-feedback');
    const tot=total();
    advanceRivals();
    if (chosen===st.cur.c) {
      const idx = st.built; st.built=Math.min(tot, st.built+1);
      _fx('correct',{el:btn});
      const info=pieceAt(idx);
      fb.textContent=T(`ΣΩΣΤΟ — τοποθετείς ${info.type.gr} (${info.b.name.gr})`,`CORRECT — you set the ${info.type.en} (${info.b.name.en})`); fb.className='pn-feedback pn-fb-ok';
      renderStage(idx);
      _fx('placed',{ done: info.type.en==='pediment', name: info.b.name[L()] });
    } else {
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      fb.textContent=T('ΛΑΘΟΣ — οι αντίπαλοι χτίζουν','WRONG — rivals keep building'); fb.className='pn-feedback pn-fb-bad';
      renderStage(-1);
    }
    renderBoard(); renderMeta();
    const winner = builders().find(x=>x.built>=tot);
    if (winner) { st.done=true; return setTimeout(()=>end(), 1400); }
    setTimeout(nextQ, 1300);
  }

  /* ───────── end ───────── */
  function end() {
    show('pn-screen-end');
    const tot=total();
    const board = builders();
    const won = st.built>=tot && board[0].me;
    _fx(won?'win':'lose');
    const art=document.getElementById('pn-end-art');
    art.classList.toggle('won', won);
    art.innerHTML =
      (won ? '<div class="pn-beam" aria-hidden="true"></div><div class="pn-rays" aria-hidden="true"></div>' : '') +
      templeSVG(st.levelKey, won?tot:st.built, -1, 'pn-end-temple');
    const lvlName = LEVELS[st.levelKey].sub[L()];
    const title=document.getElementById('pn-end-title'), sub=document.getElementById('pn-end-sub');
    if (won) {
      title.textContent=T('ΤΟ ΕΡΓΟ ΟΛΟΚΛΗΡΩΘΗΚΕ','THE WORK IS COMPLETE'); title.className='pn-end-title win';
      sub.textContent=T(`Ύψωσες «${lvlName}» πρώτος. Η Αθηνά κατοικεί πλέον στην Ακρόπολη.`,`You raised "${lvlName}" first. Athena now dwells upon the Acropolis.`);
    } else {
      title.textContent=T('ΤΟ ΕΡΓΟ ΣΥΝΕΧΙΖΕΤΑΙ','THE WORK GOES ON'); title.className='pn-end-title lose';
      sub.textContent=T(`Έχτισες ${st.built}/${tot} μέλη. Ο/Η ${board[0].name} τελείωσε πρώτος.`,`You raised ${st.built}/${tot} members. ${board[0].name} finished first.`);
    }
    document.getElementById('pn-final-board').innerHTML = board.map((x,i)=>
      `<div class="pn-final-row${x.me?' me':''}"><span class="pn-final-pos">${i+1}</span><span class="pn-final-name">${x.name}${i===0?' 🏆':''}</span><span class="pn-final-n">${x.built}/${tot}</span></div>`
    ).join('');
    // presentational count-up of the final tallies
    if (!REDUCE) {
      document.querySelectorAll('#pn-final-board .pn-final-n').forEach((el,i)=>{
        const target=board[i]?board[i].built:0;
        el.textContent='0/'+tot;
        const t0=performance.now(), dur=650+i*90;
        // progress from performance.now(), clamped: rAF timestamps can lag
        // t0 after an idle frame gap, which used to explode the count-up
        const tick=()=>{
          const p=Math.max(0,Math.min(1,(performance.now()-t0)/dur)), eased=1-Math.pow(1-p,3);
          el.textContent=Math.round(eased*target)+'/'+tot;
          if(p<1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }
  }

  /* ───────── art ─────────
     Composite Acropolis at golden hour. Buildings laid left→right, bottoms
     on a shared ground line. `built` pieces fill building-by-building;
     `latest` is the global index of the newest piece (rise animation + dust).
     The first incomplete monument carries the scaffold + geranos hoist, and
     unbuilt members are sketched as a twilight ghost-blueprint.
     Gradient/clip ids are namespaced by `cls` (multiple instances co-exist
     in the DOM: intro hero, game stage, end art). */
  function templeSVG(levelKey, built, latest, cls, riv) {
    const keys=LEVELS[levelKey].keys;
    const gap=18;
    const bw=keys.reduce((s,k)=>s+B[k].w,0) + gap*(keys.length-1);
    const VW=Math.max(bw+150, 340), VH=224, GY=176;
    // ── dawn progression (presentational): the golden hour advances with the
    //    work — sky warms, sun swells, stars thin as built/total grows. Each
    //    re-render nudges it ~1/total, so day breaks over the whole match. ──
    const dayP = Math.max(0, Math.min(1, built/(totalFor(levelKey)||1)));
    const mix  = (a,b)=>(a+(b-a)*dayP);
    const mixc = (a,b)=>{
      const pa=parseInt(a.slice(1),16), pb=parseInt(b.slice(1),16);
      let out=0;
      [16,8,0].forEach(sh=>{ const va=(pa>>sh)&255, vb=(pb>>sh)&255; out|=Math.round(va+(vb-va)*dayP)<<sh; });
      return '#'+out.toString(16).padStart(6,'0').toUpperCase();
    };
    // first incomplete monument gets the scaffold + hoist
    let activeOff=-1, cum=0;
    for (const k of keys){ const pc=B[k].cols+2; if (built-cum<pc){ activeOff=cum; break; } cum+=pc; }
    let x=(VW-bw)/2, off=0, body='';
    keys.forEach(k=>{
      const b=B[k];
      const localBuilt=Math.max(0, Math.min(b.cols+2, built-off));
      body += oneBuilding(b, x, GY, localBuilt, off, latest, off===activeOff, cls);
      x+=b.w+gap; off+=b.cols+2;
    });
    let stars='';
    for(let i=0;i<20;i++){
      const sx=((i*131+37)%VW), sy=6+((i*67)%72);
      stars+=`<circle class="pn-star" cx="${sx}" cy="${sy}" r="${(0.5+(i%3)*0.35).toFixed(2)}" fill="#F4EEDF" opacity="${(0.12+(i%4)*0.07).toFixed(2)}" style="animation-delay:${(i*0.41).toFixed(2)}s"/>`;
    }
    // ── golden-hour dressing: moon, drifting clouds, sweeping sun rays,
    //    rival work-camps progressing on the far hills, braziers on the rock
    //    shoulders and forecourt debris. Purely presentational — CSS animates
    //    the flicker/sweep/drift; everything is static under reduced motion. ──
    const rf = Array.isArray(riv) ? riv : [];
    // camp flash: presentational diff against the previous stage render
    let adv = [false,false,false];
    if (Array.isArray(riv)){
      if (_rivPrev) adv = riv.map((v,i)=>v>((_rivPrev[i]||0)+1e-9));
      _rivPrev = riv.slice();
    }
    const mX = (VW*0.84)|0;
    const moon = `<g class="pn-moon"><circle cx="${mX}" cy="26" r="12" fill="#F4EEDF" opacity="0.08"/><circle cx="${mX}" cy="26" r="6" fill="#EFE7CF" opacity="0.9"/><circle cx="${mX-2.4}" cy="24.8" r="5.2" fill="#182338" opacity="0.92"/></g>`;
    const cloud = (cx,cy,sc,dur)=>`<g class="pn-cloud" style="animation-duration:${dur}s">
      <ellipse cx="${cx}" cy="${cy}" rx="${(26*sc).toFixed(0)}" ry="${(4.4*sc).toFixed(1)}" fill="#1F2A44" opacity="0.55"/>
      <ellipse cx="${(cx+15*sc).toFixed(0)}" cy="${(cy+2.4*sc).toFixed(1)}" rx="${(16*sc).toFixed(0)}" ry="${(3.2*sc).toFixed(1)}" fill="#26324F" opacity="0.5"/>
      <path d="M${(cx-18*sc).toFixed(0)} ${(cy+4.4*sc).toFixed(1)} h${(36*sc).toFixed(0)}" stroke="#B87F3A" stroke-width="0.8" opacity="0.35"/>
    </g>`;
    const clouds = cloud((VW*0.2)|0,44,1,64)+cloud((VW*0.64)|0,58,0.72,88);
    // crepuscular rays fanning up from the sun below the horizon + a sun
    // pillar of warm light behind the monuments — the golden hour made legible
    const rays = `<g transform="translate(${(VW/2)|0} ${GY-2})"><g class="pn-swp" fill="#E8B45A">
      <path d="M0 0 L-${(VW*0.34)|0} -${GY-14} L-${(VW*0.21)|0} -${GY-6} Z" opacity="0.07"/>
      <path d="M0 0 L-${(VW*0.13)|0} -${GY-2} L-${(VW*0.04)|0} -${GY-2} Z" opacity="0.08"/>
      <path d="M0 0 L${(VW*0.02)|0} -${GY-2} L${(VW*0.1)|0} -${GY-2} Z" opacity="0.09"/>
      <path d="M0 0 L${(VW*0.19)|0} -${GY-6} L${(VW*0.33)|0} -${GY-16} Z" opacity="0.07"/>
      <path d="M0 0 L${(VW*0.42)|0} -${GY-40} L${(VW*0.5)|0} -${GY-62} Z" opacity="0.05"/>
    </g></g>`;
    const pillar = `<rect class="pn-pillar" x="${(VW*0.42)|0}" y="0" width="${(VW*0.16)|0}" height="${GY}" fill="url(#${cls}-pillar)"/>`;
    const haze = `<rect class="pn-haze" x="0" y="${GY-32}" width="${VW}" height="32" fill="url(#${cls}-haze)"/>`;
    // slow golden sheen drifting across the diorama glass
    const sheen = `<g class="pn-sheeng"><rect x="0" y="-24" width="${(VW*0.3)|0}" height="${VH+48}" fill="url(#${cls}-sheen)" transform="skewX(-14)"/></g>`;
    // rival hill-camps: torch-lit work sites with their own tiny builder,
    // rising smoke, and a one-shot flash on the render their wall advanced
    const camp = (cx,cy,col,f,d,advd)=>{
      const w = 4+10*Math.max(0,Math.min(1,f||0));
      return `<g class="pn-camp">
        <rect x="${cx-9}" y="${(cy-2.6).toFixed(1)}" width="${w.toFixed(1)}" height="2.6" fill="${col}"/>
        <path d="M${cx+2} ${cy} l3.2 -4.4 3.2 4.4 Z" fill="${col}"/>
        <path d="M${cx+10.3} ${cy} v-6.6 l3.8 2.2" stroke="${col}" stroke-width="0.9" fill="none"/>
        <g class="pn-wkr" style="animation-delay:${(d+0.2).toFixed(2)}s">
          <circle cx="${cx+7.1}" cy="${(cy-4.6).toFixed(1)}" r="0.8" fill="#0D1220"/>
          <path d="M${cx+6.4} ${(cy-3.9).toFixed(1)} h1.4 l0.3 3.9 h-2 Z" fill="#0D1220"/>
        </g>
        <path class="pn-smoke" style="animation-delay:${(d+0.5).toFixed(2)}s" d="M${cx-1.2} ${(cy-3.2).toFixed(1)} q1.1 -2 0.2 -3.7 q-0.8 -1.5 0.4 -3" stroke="#C9BCA0" stroke-width="0.7" fill="none" opacity="0"/>
        <circle class="pn-flame" style="animation-delay:${d}s" cx="${cx-1.2}" cy="${(cy-1.4).toFixed(1)}" r="1.1" fill="#E8A452"/>
        <circle class="pn-fglow" style="animation-delay:${d}s" cx="${cx-1.2}" cy="${(cy-1.6).toFixed(1)}" r="4.4" fill="#E8A452" opacity="0.13"/>
        ${advd?`<rect class="pn-campflash" x="${cx-10.5}" y="${(cy-9).toFixed(1)}" width="25" height="11" rx="2.5" fill="#F6E7A9" opacity="0"/>`:''}
      </g>`;
    };
    const camps = camp((VW*0.15)|0, GY-36, '#1D2942', rf[0], 0, adv[0])
                + camp((VW*0.79)|0, GY-38, '#1D2942', rf[1], 0.7, adv[1])
                + camp((VW*0.43)|0, GY-16.5, '#2B2834', rf[2], 0.35, adv[2]);
    const brazier = (bx,by,d)=>`<g class="pn-brz">
      <ellipse class="pn-fglow" style="animation-delay:${(d+0.3).toFixed(2)}s" cx="${bx}" cy="${by+2.2}" rx="16" ry="3.6" fill="url(#${cls}-fpool)"/>
      <path d="M${bx-3.2} ${by} L${bx} ${by-3.6} L${bx+3.2} ${by} M${bx} ${by-3.6} V${by}" stroke="#3A3023" stroke-width="1" fill="none"/>
      <path d="M${bx-3.4} ${by-3.6} h6.8 l-1.2 -2.5 h-4.4 Z" fill="#4E4232" stroke="#241C11" stroke-width="0.5"/>
      <path class="pn-flame" style="animation-delay:${d}s" d="M${bx} ${by-12.6} q2.7 3.3 1.4 5.3 q-0.7 1.2 -1.4 1.2 q-0.7 0 -1.4 -1.2 q-1.3 -2 1.4 -5.3 Z" fill="#F0B85C"/>
      <path class="pn-flame" style="animation-delay:${(d+0.25).toFixed(2)}s" d="M${bx} ${by-10.4} q1.4 2 0.7 3.2 q-0.35 0.7 -0.7 0.7 q-0.35 0 -0.7 -0.7 q-0.7 -1.2 0.7 -3.2 Z" fill="#FBE7B4" opacity="0.9"/>
      <circle class="pn-fglow" style="animation-delay:${d}s" cx="${bx}" cy="${by-8.4}" r="10" fill="#E8A452" opacity="0.13"/>
      <path class="pn-smoke" style="animation-delay:${(d+0.8).toFixed(2)}s" d="M${bx} ${by-13.6} q1.7 -2.6 0.4 -4.9 q-1.1 -2 0.5 -4" stroke="#C9BCA0" stroke-width="0.8" fill="none" opacity="0"/>
    </g>`;
    const braziers = brazier((VW*0.105)|0, GY+27, 0)+brazier((VW*0.895)|0, GY+27, 0.5);
    const fx1=(VW*0.05)|0, fx2=(VW*0.93)|0;
    const debris = `<g class="pn-fgblk">
      <rect x="${fx1}" y="${VH-13}" width="17" height="9" fill="#15100A" stroke="#C98F4A" stroke-opacity="0.16" stroke-width="0.6"/>
      <rect x="${fx1+5}" y="${VH-20}" width="11" height="7" fill="#1C150D" stroke="#C98F4A" stroke-opacity="0.12" stroke-width="0.6"/>
      <circle cx="${fx2}" cy="${VH-9}" r="6.6" fill="#15100A" stroke="#C98F4A" stroke-opacity="0.14" stroke-width="0.6"/>
      <circle cx="${fx2}" cy="${VH-9}" r="2.5" fill="none" stroke="#C98F4A" stroke-opacity="0.12" stroke-width="0.6"/>
    </g>`;
    return `<svg class="${cls}" viewBox="0 0 ${VW} ${VH}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${cls}-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${mixc('#0A0F1F','#141F3B')}"/><stop offset="0.45" stop-color="${mixc('#182338','#233252')}"/>
          <stop offset="0.68" stop-color="${mixc('#3B2E20','#54402A')}"/><stop offset="0.84" stop-color="${mixc('#7C5224','#9C6A2E')}"/>
          <stop offset="1" stop-color="${mixc('#8A5E28','#B07C3B')}"/>
        </linearGradient>
        <radialGradient id="${cls}-sun" cx="${VW/2}" cy="${GY-2}" r="${(VW*0.44)|0}" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#FFCF7A" stop-opacity="${mix(0.44,0.74).toFixed(2)}"/>
          <stop offset="0.35" stop-color="#E8A452" stop-opacity="${mix(0.2,0.36).toFixed(2)}"/>
          <stop offset="1" stop-color="#E8A452" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${cls}-marble" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#FAF3E1"/><stop offset="0.55" stop-color="#E6DCC1"/><stop offset="1" stop-color="#BFB191"/>
        </linearGradient>
        <linearGradient id="${cls}-marbleh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F2EBD9"/><stop offset="1" stop-color="#D3C8AB"/>
        </linearGradient>
        <linearGradient id="${cls}-marbled" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#FFF6DC"/><stop offset="0.55" stop-color="#F3E4BC"/><stop offset="1" stop-color="#CBB78C"/>
        </linearGradient>
        <linearGradient id="${cls}-marblehd" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#FBEFCF"/><stop offset="1" stop-color="#DCC998"/>
        </linearGradient>
        <linearGradient id="${cls}-pillar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#E8B45A" stop-opacity="0"/>
          <stop offset="0.72" stop-color="#E8B45A" stop-opacity="${mix(0.07,0.16).toFixed(2)}"/>
          <stop offset="1" stop-color="#FFCF7A" stop-opacity="${mix(0.17,0.34).toFixed(2)}"/>
        </linearGradient>
        <linearGradient id="${cls}-haze" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#E8A452" stop-opacity="0"/>
          <stop offset="1" stop-color="#E8A452" stop-opacity="${mix(0.13,0.26).toFixed(2)}"/>
        </linearGradient>
        <linearGradient id="${cls}-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#FFD98A" stop-opacity="0"/>
          <stop offset="0.5" stop-color="#FFD98A" stop-opacity="0.07"/>
          <stop offset="1" stop-color="#FFD98A" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="${cls}-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F6E7A9" stop-opacity="0"/>
          <stop offset="0.55" stop-color="#F6E7A9" stop-opacity="0.3"/>
          <stop offset="1" stop-color="#FFF3C9" stop-opacity="0.75"/>
        </linearGradient>
        <linearGradient id="${cls}-stepshade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#FFF6DF" stop-opacity="0.2"/>
          <stop offset="0.5" stop-color="#FFF6DF" stop-opacity="0"/>
          <stop offset="1" stop-color="#1B1408" stop-opacity="0.26"/>
        </linearGradient>
        <radialGradient id="${cls}-fpool" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stop-color="#E8A452" stop-opacity="0.3"/>
          <stop offset="1" stop-color="#E8A452" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${cls}-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4E4232"/><stop offset="0.5" stop-color="#3A3023"/><stop offset="1" stop-color="#201A10"/>
        </linearGradient>
        <radialGradient id="${cls}-vig" cx="0.5" cy="0.42" r="0.72">
          <stop offset="0.58" stop-color="#05060A" stop-opacity="0"/>
          <stop offset="1" stop-color="#05060A" stop-opacity="0.5"/>
        </radialGradient>
        <clipPath id="${cls}-clip"><rect width="${VW}" height="${VH}" rx="12"/></clipPath>
      </defs>
      <g clip-path="url(#${cls}-clip)">
        <rect width="${VW}" height="${VH}" fill="url(#${cls}-sky)"/>
        <g opacity="${mix(1,0.5).toFixed(2)}">${stars}</g>
        <g opacity="${mix(1,0.62).toFixed(2)}">${moon}</g>
        ${clouds}
        <g class="pn-bird" style="animation-duration:46s"><path d="M${(VW*0.16)|0} 38 q4 -4 8 0 q4 -4 8 0" stroke="#33405E" stroke-width="1.2" opacity="0.8"/></g>
        <g class="pn-bird" style="animation-duration:62s;animation-delay:-21s"><path d="M${(VW*0.72)|0} 26 q3.5 -3.5 7 0 q3.5 -3.5 7 0" stroke="#33405E" stroke-width="1.1" opacity="0.7"/></g>
        <rect width="${VW}" height="${VH}" fill="url(#${cls}-sun)"/>
        ${pillar}
        ${rays}
        <path d="M0 ${GY-28} Q${(VW*0.18)|0} ${GY-52} ${(VW*0.36)|0} ${GY-34} T${(VW*0.7)|0} ${GY-40} T${VW} ${GY-30} L${VW} ${GY+20} L0 ${GY+20} Z" fill="#10182A" opacity="0.85"/>
        ${haze}
        <path d="M0 ${GY-13} Q${(VW*0.25)|0} ${GY-29} ${(VW*0.5)|0} ${GY-15} T${VW} ${GY-19} L${VW} ${GY+22} L0 ${GY+22} Z" fill="#1B1A22" opacity="0.92"/>
        ${camps}
        <path d="M${(VW*0.03)|0} ${VH} L${(VW*0.09)|0} ${GY+30} L${(VW*0.13)|0} ${GY+16} L${(VW*0.87)|0} ${GY+16} L${(VW*0.91)|0} ${GY+30} L${(VW*0.97)|0} ${VH} Z" fill="url(#${cls}-rock)"/>
        <line x1="${(VW*0.13)|0}" y1="${GY+16}" x2="${(VW*0.87)|0}" y2="${GY+16}" stroke="#C98F4A" stroke-width="0.8" opacity="0.5"/>
        <path d="M${(VW*0.11)|0} ${GY+34} H${(VW*0.89)|0} M${(VW*0.08)|0} ${GY+44} H${(VW*0.92)|0}" stroke="#6B5B44" stroke-width="0.6" opacity="0.3"/>
        <path d="M${(VW*0.32)|0} ${GY+22} l3 6 -2 5 M${(VW*0.61)|0} ${GY+24} l-2.5 7 1.5 6" stroke="#171310" stroke-width="0.8" opacity="0.55"/>
        ${braziers}
        ${body}
        ${debris}
        ${sheen}
        <rect width="${VW}" height="${VH}" fill="url(#${cls}-vig)"/>
      </g>
    </svg>`;
  }

  function oneBuilding(b, x, gy, n, gOff, latest, active, idp) {
    const cw=14, pad=10, yTop=gy-b.h;
    const span=b.w-2*pad;
    const step=b.cols>1 ? (span-cw)/(b.cols-1) : 0;
    const cols=Math.min(n, b.cols);
    const done=n>=b.cols+2;
    let s='';
    // contact shadow grounding the monument on the plateau
    s+=`<ellipse cx="${x+b.w/2}" cy="${gy+15.2}" rx="${(b.w*0.72).toFixed(0)}" ry="4.6" fill="#06070C" opacity="0.42"/>`;
    // crepidoma (three steps) — always visible: the plot is laid.
    // Each course is jointed blockwork with a sun-caught top edge and a
    // left→right shade pass so the platform reads as lit marble, not flat fill.
    const steps=[[x-3,gy,b.w+6,'#EDE3C6','#FBF3DD'],[x-7,gy+5,b.w+14,'#DCD0AE','#F0E6C9'],[x-11,gy+10,b.w+22,'#C9BC99','#E2D7B8']];
    steps.forEach((r)=>{
      let joints='';
      const nj=Math.max(2, Math.round(r[2]/17));
      for(let j=1;j<nj;j++){ const jx=(r[0]+j*(r[2]/nj)).toFixed(1); joints+=`M${jx} ${r[1]+0.9} V${r[1]+4.3} `; }
      s+=`<rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="5" fill="${r[3]}" stroke="#8F815F" stroke-width="0.7"/>
          <line x1="${r[0]+0.5}" y1="${r[1]+0.6}" x2="${r[0]+r[2]-0.5}" y2="${r[1]+0.6}" stroke="${r[4]}" stroke-width="0.9" opacity="0.9"/>
          <path d="${joints}" stroke="#8F815F" stroke-width="0.5" opacity="0.42" fill="none"/>
          <rect x="${r[0]}" y="${r[1]}" width="${r[2]}" height="5" fill="url(#${idp}-stepshade)"/>`;
    });
    // ghost blueprint of the members still to set
    let ghost='';
    for(let i=cols;i<b.cols;i++){
      const cx=x+pad+i*step;
      ghost+=`<rect x="${cx}" y="${yTop+8}" width="${cw}" height="${b.h-8}" rx="1"/>`;
    }
    if(n<b.cols+1) ghost+=`<rect x="${x+2}" y="${yTop-6}" width="${b.w-4}" height="12"/>`;
    if(n<b.cols+2) ghost+=`<path d="M${x} ${yTop-6} L${x+b.w/2} ${yTop-27} L${x+b.w} ${yTop-6} Z"/>`;
    if(ghost) s+=`<g class="pn-ghost" fill="none" stroke="#7FB0BC" stroke-width="0.9" stroke-dasharray="3.5 3.5" opacity="0.28">${ghost}</g>`;
    // columns — tapered sunlit shafts, flutes, capital + plinth; completed
    // monuments swap to the warmer "gilded" marble so finished work glows
    const colFill = done ? `url(#${idp}-marbled)` : `url(#${idp}-marble)`;
    for (let i=0;i<cols;i++){
      const cx=x+pad+i*step, rising=(latest===gOff+i), rise=rising?' pn-rise':'';
      s+=`<g class="pn-piece${rise}">
        <rect x="${cx-2.5}" y="${gy-5}" width="${cw+5}" height="5" fill="#EDE5D2" stroke="#8F815F" stroke-width="0.7"/>
        <path d="M${cx} ${gy-5} L${cx+1.6} ${yTop+9} L${cx+cw-1.6} ${yTop+9} L${cx+cw} ${gy-5} Z" fill="${colFill}" stroke="#8F815F" stroke-width="0.8"/>
        <g stroke="#A5966F" stroke-width="0.6" opacity="0.55"><path d="M${cx+4.4} ${yTop+9} L${cx+4} ${gy-5}"/><path d="M${cx+7} ${yTop+9} V${gy-5}"/><path d="M${cx+9.6} ${yTop+9} L${cx+10} ${gy-5}"/></g>
        <path d="M${cx+1.9} ${yTop+10.5} L${cx+2.6} ${(gy-7).toFixed(1)}" stroke="#FFF8E4" stroke-width="0.8" opacity="0.6"/>
        <path d="M${cx+1.1} ${(yTop+9+(gy-14-yTop)*0.4).toFixed(1)} h${cw-2.2} M${cx+0.7} ${(yTop+9+(gy-14-yTop)*0.72).toFixed(1)} h${cw-1.4}" stroke="#9A8B6E" stroke-width="0.5" opacity="0.35"/>
        <rect x="${cx-1}" y="${yTop+5.5}" width="${cw+2}" height="3.5" fill="#EDE5D2" stroke="#8F815F" stroke-width="0.7"/>
        <rect x="${cx-2.5}" y="${yTop+2}" width="${cw+5}" height="3.5" fill="#F2EBD9" stroke="#8F815F" stroke-width="0.7"/>
        ${rising?liftTackle(cx+cw/2, yTop+2, cw/2+2.5):''}
      </g>${dustAt(latest, gOff+i, cx+cw/2, gy-4)}`;
    }
    // architrave + frieze (taenia line, triglyph slots, faint veining)
    if (n>=b.cols+1){
      const rising=(latest===gOff+b.cols), rise=rising?' pn-rise':'';
      let trig='';
      const nT=Math.max(3, Math.round(b.w/16));
      for(let t=0;t<nT;t++){ const tx=(x+6+t*((b.w-15)/(nT-1))).toFixed(1); trig+=`<rect x="${tx}" y="${yTop-3.2}" width="3" height="6.4" fill="#B4A582" opacity="0.7"/>`; }
      s+=`<g class="pn-piece${rise}">
        <rect x="${x+2}" y="${yTop-6}" width="${b.w-4}" height="12" fill="url(#${idp}-marbleh${done?'d':''})" stroke="#8F815F" stroke-width="0.9"/>
        <line x1="${x+2}" y1="${yTop-2.5}" x2="${x+b.w-2}" y2="${yTop-2.5}" stroke="#C7B992" stroke-width="0.7" opacity="0.8"/>
        <path d="M${x+8} ${yTop+1.6} q${(b.w*0.16).toFixed(0)} 1.4 ${(b.w*0.34).toFixed(0)} 0.3 t${(b.w*0.4).toFixed(0)} -0.9" stroke="#AE9E77" stroke-width="0.45" fill="none" opacity="0.4"/>
        <line x1="${x+2.6}" y1="${yTop-5.4}" x2="${x+b.w-2.6}" y2="${yTop-5.4}" stroke="#FFF6DD" stroke-width="0.7" opacity="0.65"/>
        ${trig}
        ${rising?liftTackle(x+b.w/2, yTop-6, 16):''}
      </g>${dustAt(latest, gOff+b.cols, x+b.w/2, yTop+6)}`;
    }
    // pediment — raking cornice, shaded tympanum, gold acroterion when done
    if (n>=b.cols+2){
      const justDone = latest===gOff+b.cols+1;
      const rise=justDone?' pn-rise':'';
      const apex=yTop-27;
      s+=`<g class="pn-piece${rise}">
        <path d="M${x-2} ${yTop-6} L${x+b.w/2} ${apex} L${x+b.w+2} ${yTop-6} Z" fill="url(#${idp}-marble${done?'d':''})" stroke="#8F815F" stroke-width="1.1"/>
        <path d="M${x+9} ${yTop-8.5} L${x+b.w/2} ${apex+7} L${x+b.w-9} ${yTop-8.5} Z" fill="#C4B896" opacity="0.75"/>
        <path d="M${x-1} ${yTop-6.8} L${x+b.w/2} ${apex-0.8}" stroke="#FFF6DD" stroke-width="0.7" opacity="0.55"/>
        ${done?`<path class="pn-glint" d="M${x+b.w/2} ${apex-6.5} l2.6 4 -2.6 4 -2.6 -4 Z" fill="#E3C766"/>
        <path class="pn-glow" d="M${x-2} ${yTop-6} L${x+b.w/2} ${apex} L${x+b.w+2} ${yTop-6}" stroke="#E3C766" stroke-width="1.1" fill="none"/>`:''}
        ${justDone?liftTackle(x+b.w/2, apex, 11):''}
      </g>${dustAt(latest, gOff+b.cols+1, x+b.w/2, yTop-10)}`;
      // one-shot consecration: a beam of light stands on the just-finished
      // monument and gold embers climb it (play-scene celebration)
      if (justDone && !REDUCE){
        s+=`<rect class="pn-donebeam" x="${(x+b.w/2-b.w*0.19).toFixed(1)}" y="0" width="${(b.w*0.38).toFixed(1)}" height="${(apex-2).toFixed(1)}" fill="url(#${idp}-beam)" opacity="0"/>`;
        for(let gI=0;gI<6;gI++){
          const gx=(x+b.w/2+(gI-2.5)*b.w*0.11).toFixed(1);
          s+=`<circle class="pn-riseglint" style="animation-delay:${(0.55+gI*0.13).toFixed(2)}s" cx="${gx}" cy="${(apex-4-(gI%3)*7).toFixed(1)}" r="${(1+(gI%2)*0.5).toFixed(1)}" fill="#F6E7A9" opacity="0"/>`;
        }
      }
    }
    // scaffold + geranos hoist + waiting blocks on the active monument
    if (active && !done){
      const sTop=yTop-34;
      let bars='';
      for(let by=gy-8; by>sTop; by-=20) bars+=`<line x1="${x-8}" y1="${by}" x2="${x+b.w+8}" y2="${by}"/>`;
      s+=`<g class="pn-scaffold" stroke="#7A5A33" opacity="0.8">
        <line x1="${x-8}" y1="${gy+14}" x2="${x-8}" y2="${sTop}" stroke-width="2"/>
        <line x1="${x+b.w+8}" y1="${gy+14}" x2="${x+b.w+8}" y2="${sTop}" stroke-width="2"/>
        <g stroke-width="0.9" opacity="0.75">${bars}</g>
        <line x1="${x-8}" y1="${gy-8}" x2="${x-2}" y2="${sTop+6}" stroke-width="0.8" opacity="0.6"/>
        <line x1="${x+b.w+8}" y1="${gy-8}" x2="${x+b.w+2}" y2="${sTop+6}" stroke-width="0.8" opacity="0.6"/>
      </g>`;
      const nx = n<b.cols ? x+pad+n*step+cw/2 : x+b.w/2;
      const ny = n<b.cols ? yTop+14 : (n===b.cols ? yTop-2 : yTop-18);
      const mx = x+b.w+22, mTop=yTop-46;
      // one-shot recoil when the member this crane just lowered has landed
      const recoil = (latest>=gOff && latest<gOff+b.cols+2) ? ' pn-crane-recoil' : '';
      s+=`<g class="pn-crane${recoil}">
        <line x1="${mx-7}" y1="${gy+14}" x2="${mx}" y2="${mTop}" stroke="#8A6B43" stroke-width="2.2"/>
        <line x1="${mx+7}" y1="${gy+14}" x2="${mx}" y2="${mTop}" stroke="#8A6B43" stroke-width="2.2"/>
        <line x1="${mx-4}" y1="${gy-24}" x2="${mx+4}" y2="${gy-24}" stroke="#8A6B43" stroke-width="1.4"/>
        <line x1="${mx}" y1="${mTop}" x2="${nx}" y2="${mTop+6}" stroke="#8A6B43" stroke-width="1.6"/>
        <g class="pn-hoist${recoil?' pn-hoist-kick':''}">
          <circle cx="${nx}" cy="${mTop+6}" r="2" fill="none" stroke="#C9BFA8" stroke-width="1"/>
          <line x1="${nx}" y1="${mTop+8}" x2="${nx}" y2="${ny}" stroke="#C9BFA8" stroke-width="0.9" stroke-dasharray="1.5 2.5"/>
          <rect x="${nx-3}" y="${ny}" width="6" height="4" fill="#D8CBAB" opacity="0.9"/>
        </g>
      </g>
      <g opacity="0.9">
        <rect x="${x-27}" y="${gy+9}" width="12" height="6" fill="#D6CCB4" stroke="#8F815F" stroke-width="0.6"/>
        <rect x="${x-24}" y="${gy+3}" width="10" height="6" fill="#E4DAC2" stroke="#8F815F" stroke-width="0.6"/>
        <path d="M${x-13.5} ${gy+15} l6 -4.6" stroke="#7A5A33" stroke-width="0.9"/>
      </g>`;
      // worksite crew — small silhouettes with a slow bob: a hauler at the
      // geranos, a mason up on the scaffold, a carrier by the waiting blocks
      const wk=(wx,wy,sc,dl,fl)=>`<g transform="translate(${wx} ${wy}) scale(${fl?-sc:sc} ${sc})"><g class="pn-wkr" style="animation-delay:${dl}s">
        <circle cx="0" cy="-7" r="1.5" fill="#1A130B"/>
        <path d="M-1.4 -5.5 Q0 -6.3 1.4 -5.5 L1.8 -1.5 L0.9 -1.5 L0.8 0 L-0.8 0 L-0.9 -1.5 L-1.8 -1.5 Z" fill="#1A130B"/>
        <path d="M1.3 -4.9 L3.1 -3.2" stroke="#1A130B" stroke-width="0.8" stroke-linecap="round"/>
        <path d="M-1.6 -6.6 Q0 -7.8 1.6 -6.6" stroke="#C98F4A" stroke-width="0.35" fill="none" opacity="0.5"/>
      </g></g>`;
      const barY = (gy-28>sTop) ? gy-28 : gy-8;
      s+=wk(mx-10.5, gy+14, 1.1, 0.15, false)
        + wk(x-4, barY, 0.92, 0.6, true)
        + wk(x-13, gy+15, 1, 0.95, true);
    }
    // engraved name plate — gilded once the monument stands
    s+=`<text x="${x+b.w/2}" y="${gy+27}" text-anchor="middle" font-family="Alegreya, 'Cormorant Garamond', Georgia, serif" font-size="9.5" letter-spacing="1.2" fill="${done?'#E3C766':'#9A8B6E'}" opacity="${done?'0.95':'0.75'}">${b.name[L()]}</text>`;
    return s;
  }

  // one-shot dust puff + settling shockwave ring baked into the markup
  // where the newest member landed. Delayed ~0.26s so it erupts at the
  // moment of CONTACT of the .pn-rise drop, not while the block is airborne.
  function dustAt(latest, idx, px, py){
    if (latest!==idx || REDUCE) return '';
    let c='';
    for(let k=0;k<11;k++){
      c+=`<circle class="pn-dustp" cx="${px}" cy="${py}" r="${(2.4+(k%3)*1.5).toFixed(1)}" opacity="0" style="--dx:${((k-5)*8)}px;--dy:${(-(6+(k%3)*9))}px;animation-delay:${(0.26+k*0.028).toFixed(3)}s"/>`;
    }
    // a couple of heavier stone chips kicked sideways
    c+=`<rect class="pn-dustp" x="${px-1.4}" y="${py-1.2}" width="2.6" height="1.8" opacity="0" style="--dx:-15px;--dy:-5px;animation-delay:0.27s"/>`;
    c+=`<rect class="pn-dustp" x="${px-1}" y="${py-1}" width="2.2" height="1.6" opacity="0" style="--dx:14px;--dy:-7px;animation-delay:0.3s"/>`;
    // low billows rolling out of the impact along the course
    for(let m=0;m<3;m++){
      c+=`<ellipse class="pn-billow" cx="${px}" cy="${py}" rx="5.2" ry="1.9" style="--bx:${(m-1)*17}px;animation-delay:${(0.27+m*0.05).toFixed(2)}s"/>`;
    }
    // AO shadow swelling under the falling stone (peaks exactly at contact)
    return `<ellipse class="pn-landshadow" cx="${px}" cy="${(py+1.4).toFixed(1)}" rx="9.5" ry="2.5" fill="#06070C" opacity="0"/>
      <g class="pn-dustg" fill="#D8CBAB" opacity="0.85">${c}</g>
      <ellipse class="pn-dustring" cx="${px}" cy="${py}" rx="7" ry="2.2" fill="none" stroke="#E7DCC2" stroke-width="1.1" opacity="0" style="animation-delay:0.3s"/>`;
  }

  // crane tackle riding the airborne member: taut rope reaching down from
  // beyond the top of frame + rope sling gripping the stone; it releases
  // (fades) the instant the member touches down. One-shot markup, only on
  // the rising piece; inert under reduced motion (drop doesn't animate).
  function liftTackle(mx, topY, half){
    if (REDUCE) return '';
    const hy=(topY-7).toFixed(1);
    return `<g class="pn-lift">
      <line x1="${mx}" y1="-95" x2="${mx}" y2="${hy}" stroke="#C9BFA8" stroke-width="1"/>
      <path d="M${(mx-half).toFixed(1)} ${(topY+3).toFixed(1)} L${mx} ${hy} L${(mx+half).toFixed(1)} ${(topY+3).toFixed(1)}" stroke="#C9BFA8" stroke-width="0.8" fill="none" opacity="0.9"/>
      <circle cx="${mx}" cy="${hy}" r="1.4" fill="#E7DCC2"/>
    </g>`;
  }

  /* ───────── decorative fragments (intro chrome) ───────── */
  function logoHTML(t){
    return t.split('').map((ch,i)=>`<span style="animation-delay:${(0.05+i*0.05).toFixed(2)}s">${ch}</span>`).join('');
  }
  function meanderSVG(){
    let u='';
    for(let i=0;i<9;i++){ const o=i*14; u+=`<path d="M${o+1} 11 V2 H${o+11} V11 H${o+5} V6 H${o+8}"/>`; }
    return `<svg class="pn-meander-svg" viewBox="0 0 128 13" fill="none" stroke="#C4A448" stroke-width="1.3" opacity="0.75">${u}</svg>`;
  }
  function pieceGlyph(en){
    const s='stroke="#E3C766" stroke-width="1.3" fill="none"';
    if(en==='column')     return `<svg class="pn-next-g" viewBox="0 0 14 14"><path d="M3.5 3 H10.5 M5 3 V11 M9 3 V11 M3 11 H11" ${s}/></svg>`;
    if(en==='architrave') return `<svg class="pn-next-g" viewBox="0 0 14 14"><rect x="1.5" y="5" width="11" height="4" ${s}/></svg>`;
    return `<svg class="pn-next-g" viewBox="0 0 14 14"><path d="M1.5 11 L7 3.5 L12.5 11 Z" ${s}/></svg>`;
  }
  function scopeGlyph(k){
    let t='';
    for(let i=0;i<k;i++){
      t+=`<g transform="translate(${i*18},0)"><path d="M1 6 L7 1.5 L13 6 Z"/><path d="M2.5 6 V12 M7 6 V12 M11.5 6 V12"/><path d="M1 12.8 H13"/></g>`;
    }
    return `<svg class="pn-level-g" viewBox="0 0 ${k*18-4} 14" fill="none" stroke="currentColor" stroke-width="1.2">${t}</svg>`;
  }
  function ambientHTML(){
    let motes='';
    if (!REDUCE) for(let i=0;i<14;i++){
      const sz=(1.5+Math.random()*2.2).toFixed(1);
      motes+=`<i class="pn-mote" style="left:${(Math.random()*100).toFixed(1)}%;width:${sz}px;height:${sz}px;animation-duration:${(12+Math.random()*14).toFixed(1)}s;animation-delay:${(-Math.random()*20).toFixed(1)}s;--drift:${((Math.random()-.5)*120).toFixed(0)}px"></i>`;
    }
    return `<div class="pn-ambient" aria-hidden="true"><div class="pn-amb-glow"></div><div class="pn-amb-shaft"></div>${motes}</div>`;
  }

  /* ───────── presentation FX kit (in-overlay) ─────────
     fx.js set-pieces mount on <body> at z-index 90-93 — the .sym-overlay
     stacking context (z-index 1000) paints over them, so the juice for this
     game is self-hosted inside #pn-overlay. Purely visual; no state. */
  function _flash(color, peak, dur){
    const el=document.getElementById('pn-flash'); if(!el||REDUCE) return;
    el.style.background=color;
    try{ el.animate([{opacity:0},{opacity:peak,offset:.14},{opacity:0}],{duration:dur,easing:'ease-out'}); }catch(_){}
  }
  function _shakeEl(el, intensity, dur){
    if(!el||REDUCE) return;
    const kf=[{transform:'translate(0,0)'}];
    const steps=7;
    for(let i=0;i<steps;i++){
      const d=1-i/steps;
      kf.push({transform:`translate(${((Math.random()-.5)*2*intensity*d).toFixed(1)}px,${((Math.random()-.5)*2*intensity*d).toFixed(1)}px)`});
    }
    kf.push({transform:'translate(0,0)'});
    try{ el.animate(kf,{duration:dur,easing:'ease-out'}); }catch(_){}
  }
  // vertical-only "the ground took the weight" settle (placement feels heavy,
  // not jittery — random shake is reserved for wrong answers)
  function _settleEl(el, px, dur){
    if(!el||REDUCE) return;
    try{
      el.animate([
        {transform:'translateY(0)'},
        {transform:`translateY(${px}px)`,offset:.3},
        {transform:`translateY(${(-px*0.35).toFixed(1)}px)`,offset:.62},
        {transform:'translateY(0)'}
      ],{duration:dur,easing:'cubic-bezier(.3,.7,.3,1)'});
    }catch(_){}
  }
  function _burst(x, y, o){
    if(REDUCE) return;
    const ov=document.getElementById('pn-overlay'); if(!ov) return;
    o=Object.assign({count:14,colors:['#E7DCC2','#C9BCA0','#B7A887'],spark:false,power:8,life:900,size:6,spread:Math.PI*1.5},o||{});
    for(let i=0;i<o.count;i++){
      const p=document.createElement('i'); p.className='pn-p'+(o.spark?' spark':'');
      const c=o.colors[(Math.random()*o.colors.length)|0];
      const sz=o.size*(0.55+Math.random()*0.9);
      p.style.left=x+'px'; p.style.top=y+'px';
      p.style.width=sz.toFixed(1)+'px'; p.style.height=(o.spark?sz:sz*0.72).toFixed(1)+'px';
      p.style.background=c;
      if(o.spark) p.style.boxShadow='0 0 9px '+c;
      ov.appendChild(p);
      const ang=-Math.PI/2+(Math.random()-.5)*o.spread;
      const sp=o.power*(0.5+Math.random());
      const dx=Math.cos(ang)*sp*22, dyU=Math.sin(ang)*sp*22, dyD=dyU+150+Math.random()*140;
      const rot=(Math.random()-.5)*540, dur=o.life*(0.7+Math.random()*0.6);
      try{
        p.animate([
          {transform:'translate(0,0) rotate(0deg) scale(1)',opacity:1},
          {transform:`translate(${dx*0.65}px,${dyU}px) rotate(${rot*0.5}deg)`,opacity:1,offset:.42},
          {transform:`translate(${dx}px,${dyD}px) rotate(${rot}deg) scale(.4)`,opacity:0}
        ],{duration:dur,easing:'cubic-bezier(.22,.7,.4,1)',fill:'forwards'});
      }catch(_){}
      setTimeout(()=>p.remove(),dur+60);
    }
  }
  function _float(text){
    if(REDUCE) return;
    const ov=document.getElementById('pn-overlay'); if(!ov) return;
    const stage=document.getElementById('pn-stage');
    const r=stage&&stage.offsetParent?stage.getBoundingClientRect():{left:window.innerWidth/2,top:window.innerHeight*0.3,width:0,height:0};
    const el=document.createElement('div'); el.className='pn-float'; el.textContent=text;
    el.style.left=(r.left+r.width/2)+'px'; el.style.top=(r.top+r.height*0.42)+'px';
    ov.appendChild(el);
    try{
      el.animate([
        {transform:'translate(-50%,-50%) scale(.5)',opacity:0},
        {transform:'translate(-50%,-64%) scale(1.08)',opacity:1,offset:.3},
        {transform:'translate(-50%,-78%) scale(1)',opacity:1,offset:.7},
        {transform:'translate(-50%,-108%) scale(.94)',opacity:0}
      ],{duration:1500,easing:'cubic-bezier(.2,.8,.3,1)',fill:'forwards'});
    }catch(_){}
    setTimeout(()=>el.remove(),1560);
  }

  window.addEventListener('pn:fx', (e)=>{
    const d=(e&&e.detail)||{};
    switch(d.type){
      case 'correct': {
        if (d.el && d.el.getBoundingClientRect){
          const r=d.el.getBoundingClientRect();
          _burst(r.left+26, r.top+r.height/2, {spark:true, colors:['#E3C766','#F4EEDF'], count:10, power:6, size:5, life:750, spread:Math.PI*2});
        }
        // the new member enters the DOM right after this event; its CSS drop
        // touches down ~0.32s in — burst + ground settle at CONTACT, not launch
        setTimeout(()=>{
          const el=document.querySelector('#pn-stage .pn-rise');
          if (el){
            const r=el.getBoundingClientRect();
            _burst(r.left+r.width/2, r.bottom-4, {colors:['#E7DCC2','#C9BCA0','#9C8E72'], count:12, power:5, size:5, life:820, spread:Math.PI*1.2});
          }
          _settleEl(document.getElementById('pn-stage'), 3, 300);
          const bEl=document.getElementById('pn-built');
          if (bEl){ bEl.classList.remove('bump'); void bEl.offsetWidth; bEl.classList.add('bump'); }
        }, 330);
        break;
      }
      case 'placed': {
        if (d.done){
          // fire once the pediment has actually settled and the in-scene
          // consecration beam is standing (beam delay .42s + grow)
          setTimeout(()=>{
            _flash('rgba(227,199,102,0.5)', 0.3, 650);
            const stEl=document.getElementById('pn-stage');
            if (stEl){
              const r=stEl.getBoundingClientRect();
              _burst(r.left+r.width/2, r.top+r.height*0.35, {spark:true, colors:['#E3C766','#F6E7A9','#FFFFFF'], count:22, power:9, size:5, life:1200, spread:Math.PI*2});
            }
            if (d.name) _float('✦ '+d.name+' ✦');
          }, 500);
        }
        break;
      }
      case 'wrong': {
        _shakeEl(document.getElementById('pn-wrap'), 7, 380);
        _flash('rgba(158,59,46,0.55)', 0.26, 450);
        // a puff of grey rubble at the worksite — the course was refused
        const stEl=document.getElementById('pn-stage');
        if (stEl && stEl.offsetParent){
          const r=stEl.getBoundingClientRect();
          _burst(r.left+r.width/2, r.bottom-20, {colors:['#6B5B44','#4E4232','#867660'], count:9, power:4, size:5, life:680, spread:Math.PI*0.9});
        }
        break;
      }
      case 'win': {
        _flash('rgba(227,199,102,0.6)', 0.38, 900);
        [0,260,560].forEach((t,wi)=>setTimeout(()=>{
          const art=document.getElementById('pn-end-art');
          const r=art?art.getBoundingClientRect():null;
          const cx=(r&&r.width)? r.left+r.width/2 : window.innerWidth/2;
          const cy=(r&&r.height)? r.top+r.height*0.5 : window.innerHeight*0.35;
          _burst(cx+(wi-1)*90, cy, {spark:true, colors:['#E3C766','#F6E7A9','#FFFFFF'], count:20, power:10, size:6, life:1400, spread:Math.PI*2});
        }, t+160));
        break;
      }
      case 'lose': {
        _flash('rgba(94,139,150,0.35)', 0.22, 700);
        break;
      }
    }
  });

  return { open, close, _level, _again, syncLang };
})();
window.Parthenon = Parthenon;

/* ── Games-Panel entry points ── */
window.openParthenon  = function(gp){ Parthenon.open(gp || {}); };
window.closeParthenon = function(){ Parthenon.close(); };
