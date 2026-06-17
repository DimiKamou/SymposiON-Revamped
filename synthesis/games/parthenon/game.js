/* ══════════════════ ΑΚΡΟΠΟΛΙΣ — engine ══════════════════
   Builder reimagined as raising the monuments of the Acropolis.
   Pick a scale of ambition:
     • ΧΑΜΗΛΟ — the Parthenon alone
     • ΜΕΣΑΙΟ — the Parthenon and the Erechtheion
     • ΥΨΗΛΟ  — the whole rock: Propylaia, Athena Nike, Parthenon, Erechtheion
   Each correct answer sets one member (column → architrave → pediment).
   Raise every monument before the rival masters.  API: Parthenon.open()/.close()
═══════════════════════════════════════════════════════════════════ */
const Parthenon = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.PN_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const RIVALS = ['ΙΚΤΙΝΟΣ','ΚΑΛΛΙΚΡΑΤΗΣ','ΦΕΙΔΙΑΣ'];

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
        '<button class="overlay-back" onclick="closeParthenon()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u0391\u039a\u03a1\u039f\u03a0\u039f\u039b\u0399\u03a3') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="pn-wrap"></div></div>';
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
<!-- INTRO -->
<div id="pn-screen-intro" class="pn-screen">
  ${templeSVG('high', 99, -1, 'pn-hero')}
  <div class="pn-logo">ΑΚΡΟΠΟΛΙΣ</div>
  <div class="pn-logo-en" data-i18n="subtitle"></div>
  <div class="pn-intro-txt" data-i18n="intro"></div>
  <div class="pn-levels" id="pn-levels"></div>
</div>

<!-- GAME -->
<div id="pn-screen-game" class="pn-screen">
  <div class="pn-stage" id="pn-stage"></div>
  <div class="pn-board" id="pn-board"></div>
  <div class="pn-qbody">
    <div class="pn-q-meta"><span class="pn-q-num" id="pn-qnum"></span><span class="pn-q-line"></span><span class="pn-built" id="pn-built"></span></div>
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
      document.getElementById('pn-qtext').textContent = st.cur.q[L()];
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
    if (latest>=0 && window.gsap) {
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
    document.getElementById('pn-board').innerHTML = builders().map(x=>
      `<div class="pn-board-chip${x.me?' me':''}"><span class="pn-board-name">${x.name}</span>
        <span class="pn-board-bar"><span class="pn-board-fill" style="width:${(x.built/tot)*100}%"></span></span>
        <span class="pn-board-n">${x.built}/${tot}</span></div>`
    ).join('');
  }
  function renderMeta() {
    document.getElementById('pn-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum;
    document.getElementById('pn-built').textContent = T('ΜΕΛΗ ','MEMBERS ')+st.built+' / '+total();
  }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.done) return;
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('pn-qtext').textContent = st.cur.q[L()];
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
    document.getElementById('pn-end-art').innerHTML = templeSVG(st.levelKey, won?tot:st.built, -1, 'pn-end-temple');
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
  }

  /* ───────── art ─────────
     Composite Acropolis. Buildings laid left→right, bottoms on a shared
     ground line. `built` pieces fill building-by-building; `latest` is the
     global index of the newest piece (for the rise animation). */
  function templeSVG(levelKey, built, latest, cls) {
    const VW=520, VH=212, GY=168;
    const keys=LEVELS[levelKey].keys;
    const gap=16;
    const bw=keys.reduce((s,k)=>s+B[k].w,0) + gap*(keys.length-1);
    let x=(VW-bw)/2;
    let off=0, body='';
    keys.forEach(k=>{
      const b=B[k];
      const localBuilt=Math.max(0, Math.min(b.cols+2, built-off));
      body += oneBuilding(b, x, GY, localBuilt, off, latest);
      x+=b.w+gap; off+=b.cols+2;
    });
    return `<svg class="${cls}" viewBox="0 0 ${VW} ${VH}" fill="none">
      <defs>
        <linearGradient id="pn-marble" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4EEDF"/><stop offset="1" stop-color="#D6CCB4"/></linearGradient>
        <radialGradient id="pn-sky" cx="50%" cy="14%" r="80%"><stop offset="0" stop-color="#7FB0BC" stop-opacity="0.18"/><stop offset="1" stop-color="#7FB0BC" stop-opacity="0"/></radialGradient>
        <linearGradient id="pn-rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6B5E48"/><stop offset="1" stop-color="#3E3526"/></linearGradient>
      </defs>
      <rect width="${VW}" height="${VH}" fill="url(#pn-sky)"/>
      <path d="M0 ${GY+14} Q${VW*0.2} ${GY+6} ${VW*0.5} ${GY+12} T${VW} ${GY+14} L${VW} ${VH} L0 ${VH} Z" fill="url(#pn-rock)" opacity="0.9"/>
      ${body}
    </svg>`;
  }

  function oneBuilding(b, x, gy, n, gOff, latest) {
    const cw=14, pad=10, yTop=gy-b.h;
    const span=b.w-2*pad;
    const step=b.cols>1 ? (span-cw)/(b.cols-1) : 0;
    const cols=Math.min(n, b.cols);
    let s='';
    // crepidoma (steps) — drawn once the plot is laid (always visible)
    s+=`<rect x="${x-4}" y="${gy}" width="${b.w+8}" height="6" fill="#E8E0CE" stroke="#9C8E72" stroke-width="0.8"/>
        <rect x="${x-8}" y="${gy+6}" width="${b.w+16}" height="6" fill="#DCD2BA" stroke="#9C8E72" stroke-width="0.8"/>`;
    for (let i=0;i<cols;i++){
      const cx=x+pad+i*step, rise=(latest===gOff+i)?' pn-rise':'';
      s+=`<g class="pn-piece${rise}">
        <rect x="${cx}" y="${yTop+8}" width="${cw}" height="${b.h-8}" fill="url(#pn-marble)" stroke="#9C8E72" stroke-width="0.8"/>
        <g stroke="#B7A887" stroke-width="0.7" opacity="0.55"><path d="M${cx+4} ${yTop+8}V${gy}M${cx+8} ${yTop+8}V${gy}M${cx+11} ${yTop+8}V${gy}"/></g>
        <rect x="${cx-2}" y="${yTop+3}" width="${cw+4}" height="5" fill="#E8E0CE" stroke="#9C8E72" stroke-width="0.8"/>
        <rect x="${cx-2}" y="${gy-4}" width="${cw+4}" height="5" fill="#E8E0CE" stroke="#9C8E72" stroke-width="0.8"/>
      </g>`;
    }
    if (n>=b.cols+1){ // architrave
      const rise=(latest===gOff+b.cols)?' pn-rise':'';
      s+=`<g class="pn-piece${rise}"><rect x="${x+2}" y="${yTop-5}" width="${b.w-4}" height="11" fill="#E8E0CE" stroke="#9C8E72" stroke-width="1"/></g>`;
    }
    if (n>=b.cols+2){ // pediment
      const rise=(latest===gOff+b.cols+1)?' pn-rise':'';
      const apex=yTop-26;
      s+=`<g class="pn-piece${rise}"><path d="M${x} ${yTop-5} L${x+b.w/2} ${apex} L${x+b.w} ${yTop-5} Z" fill="url(#pn-marble)" stroke="#9C8E72" stroke-width="1.2"/></g>`;
    }
    // name plate (faint)
    s+=`<text x="${x+b.w/2}" y="${gy+24}" text-anchor="middle" font-family="Montserrat, sans-serif" font-size="9" letter-spacing="0.5" fill="#B7A887" opacity="0.85">${b.name[L()]}</text>`;
    return s;
  }

  return { open, close, _level, _again, syncLang };
})();
window.Parthenon = Parthenon;

/* ── Games-Panel entry points ── */
window.openParthenon  = function(gp){ Parthenon.open(gp || {}); };
window.closeParthenon = function(){ Parthenon.close(); };
