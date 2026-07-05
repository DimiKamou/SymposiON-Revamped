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
    show('pn-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function renderStage(latest) {
    document.getElementById('pn-stage').innerHTML = templeSVG(st.levelKey, st.built, latest, 'pn-temple');
    if (latest>=0 && window.gsap && !REDUCE) {
      const el=document.querySelector('#pn-stage .pn-rise');
      if (el) gsap.fromTo(el, {opacity:0, transformOrigin:'50% 100%', y:-26, scale:.92}, {opacity:1, y:0, scale:1, duration:.55, ease:'back.out(1.7)'});
    }
  }
  function builders() {
    const tot=total();
    return [{name:T('ΕΣΥ','YOU'),built:st.built,me:true}, ...st.rivals.map(r=>({...r,me:false}))]
      .sort((a,b)=>b.built-a.built).map(x=>({...x, tot}));
  }
  function renderBoard() {
    const tot=total();
    if(window.SymStandings) SymStandings.feed('pn', builders(), {key:'built', unit:'μέλη', accent:'var(--sym-gold)', title:'ΑΚΡΟΠΟΛΙΣ'});
    document.getElementById('pn-board').innerHTML = builders().map((x,i)=>
      `<div class="pn-board-chip${x.me?' me':''}${i===0&&x.built>0?' lead':''}"><span class="pn-board-name">${x.name}</span>
        <span class="pn-board-bar"><span class="pn-board-fill" style="width:${(x.built/tot)*100}%"></span></span>
        <span class="pn-board-n">${x.built}/${tot}</span></div>`
    ).join('');
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
        const tick=(now)=>{
          const p=Math.min(1,(now-t0)/dur), eased=1-Math.pow(1-p,3);
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
  function templeSVG(levelKey, built, latest, cls) {
    const keys=LEVELS[levelKey].keys;
    const gap=18;
    const bw=keys.reduce((s,k)=>s+B[k].w,0) + gap*(keys.length-1);
    const VW=Math.max(bw+150, 340), VH=224, GY=176;
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
    return `<svg class="${cls}" viewBox="0 0 ${VW} ${VH}" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="${cls}-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0A0F1F"/><stop offset="0.45" stop-color="#182338"/>
          <stop offset="0.68" stop-color="#3B2E20"/><stop offset="0.84" stop-color="#7C5224"/>
          <stop offset="1" stop-color="#8A5E28"/>
        </linearGradient>
        <radialGradient id="${cls}-sun" cx="${VW/2}" cy="${GY-2}" r="${(VW*0.44)|0}" gradientUnits="userSpaceOnUse">
          <stop offset="0" stop-color="#FFCF7A" stop-opacity="0.5"/>
          <stop offset="0.35" stop-color="#E8A452" stop-opacity="0.22"/>
          <stop offset="1" stop-color="#E8A452" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="${cls}-marble" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#FAF3E1"/><stop offset="0.55" stop-color="#E6DCC1"/><stop offset="1" stop-color="#BFB191"/>
        </linearGradient>
        <linearGradient id="${cls}-marbleh" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F2EBD9"/><stop offset="1" stop-color="#D3C8AB"/>
        </linearGradient>
        <linearGradient id="${cls}-rock" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4E4232"/><stop offset="0.5" stop-color="#3A3023"/><stop offset="1" stop-color="#201A10"/>
        </linearGradient>
        <clipPath id="${cls}-clip"><rect width="${VW}" height="${VH}" rx="12"/></clipPath>
      </defs>
      <g clip-path="url(#${cls}-clip)">
        <rect width="${VW}" height="${VH}" fill="url(#${cls}-sky)"/>
        ${stars}
        <path d="M${(VW*0.16)|0} 38 q4 -4 8 0 q4 -4 8 0" stroke="#33405E" stroke-width="1.2" opacity="0.8"/>
        <path d="M${(VW*0.72)|0} 26 q3.5 -3.5 7 0 q3.5 -3.5 7 0" stroke="#33405E" stroke-width="1.1" opacity="0.7"/>
        <rect width="${VW}" height="${VH}" fill="url(#${cls}-sun)"/>
        <path d="M0 ${GY-28} Q${(VW*0.18)|0} ${GY-52} ${(VW*0.36)|0} ${GY-34} T${(VW*0.7)|0} ${GY-40} T${VW} ${GY-30} L${VW} ${GY+20} L0 ${GY+20} Z" fill="#10182A" opacity="0.85"/>
        <path d="M0 ${GY-13} Q${(VW*0.25)|0} ${GY-29} ${(VW*0.5)|0} ${GY-15} T${VW} ${GY-19} L${VW} ${GY+22} L0 ${GY+22} Z" fill="#1B1A22" opacity="0.92"/>
        <path d="M${(VW*0.03)|0} ${VH} L${(VW*0.09)|0} ${GY+30} L${(VW*0.13)|0} ${GY+16} L${(VW*0.87)|0} ${GY+16} L${(VW*0.91)|0} ${GY+30} L${(VW*0.97)|0} ${VH} Z" fill="url(#${cls}-rock)"/>
        <line x1="${(VW*0.13)|0}" y1="${GY+16}" x2="${(VW*0.87)|0}" y2="${GY+16}" stroke="#C98F4A" stroke-width="0.8" opacity="0.5"/>
        <path d="M${(VW*0.11)|0} ${GY+34} H${(VW*0.89)|0} M${(VW*0.08)|0} ${GY+44} H${(VW*0.92)|0}" stroke="#6B5B44" stroke-width="0.6" opacity="0.3"/>
        ${body}
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
    // crepidoma (three steps) — always visible: the plot is laid
    s+=`<rect x="${x-3}" y="${gy}" width="${b.w+6}" height="5" fill="#E9E1CE" stroke="#8F815F" stroke-width="0.7"/>
        <rect x="${x-7}" y="${gy+5}" width="${b.w+14}" height="5" fill="#DCD2BA" stroke="#8F815F" stroke-width="0.7"/>
        <rect x="${x-11}" y="${gy+10}" width="${b.w+22}" height="5" fill="#CEC3A8" stroke="#8F815F" stroke-width="0.7"/>`;
    // ghost blueprint of the members still to set
    let ghost='';
    for(let i=cols;i<b.cols;i++){
      const cx=x+pad+i*step;
      ghost+=`<rect x="${cx}" y="${yTop+8}" width="${cw}" height="${b.h-8}" rx="1"/>`;
    }
    if(n<b.cols+1) ghost+=`<rect x="${x+2}" y="${yTop-6}" width="${b.w-4}" height="12"/>`;
    if(n<b.cols+2) ghost+=`<path d="M${x} ${yTop-6} L${x+b.w/2} ${yTop-27} L${x+b.w} ${yTop-6} Z"/>`;
    if(ghost) s+=`<g class="pn-ghost" fill="none" stroke="#7FB0BC" stroke-width="0.9" stroke-dasharray="3.5 3.5" opacity="0.28">${ghost}</g>`;
    // columns — tapered sunlit shafts, flutes, capital + plinth
    for (let i=0;i<cols;i++){
      const cx=x+pad+i*step, rise=(latest===gOff+i)?' pn-rise':'';
      s+=`<g class="pn-piece${rise}">
        <rect x="${cx-2.5}" y="${gy-5}" width="${cw+5}" height="5" fill="#EDE5D2" stroke="#8F815F" stroke-width="0.7"/>
        <path d="M${cx} ${gy-5} L${cx+1.6} ${yTop+9} L${cx+cw-1.6} ${yTop+9} L${cx+cw} ${gy-5} Z" fill="url(#${idp}-marble)" stroke="#8F815F" stroke-width="0.8"/>
        <g stroke="#A5966F" stroke-width="0.6" opacity="0.55"><path d="M${cx+4.4} ${yTop+9} L${cx+4} ${gy-5}"/><path d="M${cx+7} ${yTop+9} V${gy-5}"/><path d="M${cx+9.6} ${yTop+9} L${cx+10} ${gy-5}"/></g>
        <rect x="${cx-1}" y="${yTop+5.5}" width="${cw+2}" height="3.5" fill="#EDE5D2" stroke="#8F815F" stroke-width="0.7"/>
        <rect x="${cx-2.5}" y="${yTop+2}" width="${cw+5}" height="3.5" fill="#F2EBD9" stroke="#8F815F" stroke-width="0.7"/>
      </g>${dustAt(latest, gOff+i, cx+cw/2, gy-4)}`;
    }
    // architrave + frieze (taenia line, triglyph slots)
    if (n>=b.cols+1){
      const rise=(latest===gOff+b.cols)?' pn-rise':'';
      let trig='';
      const nT=Math.max(3, Math.round(b.w/16));
      for(let t=0;t<nT;t++){ const tx=(x+6+t*((b.w-15)/(nT-1))).toFixed(1); trig+=`<rect x="${tx}" y="${yTop-3.2}" width="3" height="6.4" fill="#B4A582" opacity="0.7"/>`; }
      s+=`<g class="pn-piece${rise}">
        <rect x="${x+2}" y="${yTop-6}" width="${b.w-4}" height="12" fill="url(#${idp}-marbleh)" stroke="#8F815F" stroke-width="0.9"/>
        <line x1="${x+2}" y1="${yTop-2.5}" x2="${x+b.w-2}" y2="${yTop-2.5}" stroke="#C7B992" stroke-width="0.7" opacity="0.8"/>
        ${trig}
      </g>${dustAt(latest, gOff+b.cols, x+b.w/2, yTop+6)}`;
    }
    // pediment — raking cornice, shaded tympanum, gold acroterion when done
    if (n>=b.cols+2){
      const rise=(latest===gOff+b.cols+1)?' pn-rise':'';
      const apex=yTop-27;
      s+=`<g class="pn-piece${rise}">
        <path d="M${x-2} ${yTop-6} L${x+b.w/2} ${apex} L${x+b.w+2} ${yTop-6} Z" fill="url(#${idp}-marble)" stroke="#8F815F" stroke-width="1.1"/>
        <path d="M${x+9} ${yTop-8.5} L${x+b.w/2} ${apex+7} L${x+b.w-9} ${yTop-8.5} Z" fill="#C4B896" opacity="0.75"/>
        ${done?`<path class="pn-glint" d="M${x+b.w/2} ${apex-6.5} l2.6 4 -2.6 4 -2.6 -4 Z" fill="#E3C766"/>
        <path class="pn-glow" d="M${x-2} ${yTop-6} L${x+b.w/2} ${apex} L${x+b.w+2} ${yTop-6}" stroke="#E3C766" stroke-width="1.1" fill="none"/>`:''}
      </g>${dustAt(latest, gOff+b.cols+1, x+b.w/2, yTop-10)}`;
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
      s+=`<g class="pn-crane">
        <line x1="${mx-7}" y1="${gy+14}" x2="${mx}" y2="${mTop}" stroke="#8A6B43" stroke-width="2.2"/>
        <line x1="${mx+7}" y1="${gy+14}" x2="${mx}" y2="${mTop}" stroke="#8A6B43" stroke-width="2.2"/>
        <line x1="${mx-4}" y1="${gy-24}" x2="${mx+4}" y2="${gy-24}" stroke="#8A6B43" stroke-width="1.4"/>
        <line x1="${mx}" y1="${mTop}" x2="${nx}" y2="${mTop+6}" stroke="#8A6B43" stroke-width="1.6"/>
        <circle cx="${nx}" cy="${mTop+6}" r="2" fill="none" stroke="#C9BFA8" stroke-width="1"/>
        <line x1="${nx}" y1="${mTop+8}" x2="${nx}" y2="${ny}" stroke="#C9BFA8" stroke-width="0.9" stroke-dasharray="1.5 2.5"/>
        <rect x="${nx-3}" y="${ny}" width="6" height="4" fill="#D8CBAB" opacity="0.9"/>
      </g>
      <g opacity="0.9">
        <rect x="${x-27}" y="${gy+9}" width="12" height="6" fill="#D6CCB4" stroke="#8F815F" stroke-width="0.6"/>
        <rect x="${x-24}" y="${gy+3}" width="10" height="6" fill="#E4DAC2" stroke="#8F815F" stroke-width="0.6"/>
      </g>`;
    }
    // engraved name plate — gilded once the monument stands
    s+=`<text x="${x+b.w/2}" y="${gy+27}" text-anchor="middle" font-family="Alegreya, 'Cormorant Garamond', Georgia, serif" font-size="9.5" letter-spacing="1.2" fill="${done?'#E3C766':'#9A8B6E'}" opacity="${done?'0.95':'0.75'}">${b.name[L()]}</text>`;
    return s;
  }

  // one-shot dust puff baked into the markup where the newest member landed
  function dustAt(latest, idx, px, py){
    if (latest!==idx || REDUCE) return '';
    let c='';
    for(let k=0;k<7;k++){
      c+=`<circle class="pn-dustp" cx="${px}" cy="${py}" r="${(1.6+(k%3)*1.1).toFixed(1)}" style="--dx:${((k-3)*7)}px;--dy:${(-(5+(k%3)*7))}px;animation-delay:${(k*0.035).toFixed(3)}s"/>`;
    }
    return `<g class="pn-dustg" fill="#D8CBAB">${c}</g>`;
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
        // the new member enters the DOM right after this event — catch it
        setTimeout(()=>{
          const el=document.querySelector('#pn-stage .pn-rise');
          if (el){
            const r=el.getBoundingClientRect();
            _burst(r.left+r.width/2, r.bottom-4, {colors:['#E7DCC2','#C9BCA0','#9C8E72'], count:12, power:5, size:5, life:820, spread:Math.PI*1.2});
          }
          _shakeEl(document.getElementById('pn-stage'), 3, 260);
          const bEl=document.getElementById('pn-built');
          if (bEl){ bEl.classList.remove('bump'); void bEl.offsetWidth; bEl.classList.add('bump'); }
        }, 90);
        break;
      }
      case 'placed': {
        if (d.done){
          setTimeout(()=>{
            _flash('rgba(227,199,102,0.5)', 0.3, 650);
            const stEl=document.getElementById('pn-stage');
            if (stEl){
              const r=stEl.getBoundingClientRect();
              _burst(r.left+r.width/2, r.top+r.height*0.35, {spark:true, colors:['#E3C766','#F6E7A9','#FFFFFF'], count:22, power:9, size:5, life:1200, spread:Math.PI*2});
            }
            if (d.name) _float('✦ '+d.name+' ✦');
          }, 140);
        }
        break;
      }
      case 'wrong': {
        _shakeEl(document.getElementById('pn-wrap'), 7, 380);
        _flash('rgba(158,59,46,0.55)', 0.26, 450);
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
