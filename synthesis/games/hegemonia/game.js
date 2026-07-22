/* ══════════════════ ΗΓΕΜΟΝΙΑ — engine ══════════════════
   Color Kingdom(s) reimagined, faithful to the real mode:
   • Your kingdom is a CONNECTED empire. You may only plant a flag on a
     block touching land you already hold (or push into a rival's bordering
     block). You choose which edge to grow — so you race for open ground
     and wall rivals off.
   • Answer FAST & correct to earn MORE flags that turn (1–3 by speed).
   • Rival hegemons grow their own empires and fight for the same frontier.
   • The board fills; whoever colours the most blocks rules the hegemony.
   API:  Hegemonia.open()  Hegemonia.close()
   Reads window.SYM_QUESTIONS and window.siteLang ('gr'|'en').
═══════════════════════════════════════════════════════════════════════ */
const Hegemonia = (() => {

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

  // Question source. The Games-Panel bridge fills window.HG_Q with MC items
  // {q:{gr,en}, a:[4], c} at launch; standalone falls back to SYM_QUESTIONS.
  const _gpPool = () => {
    const g = window.HG_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const DUR  = 15000;
  const COLS = 7, ROWS = 5, N = COLS*ROWS;
  const CAP  = 20;          // max questions (board usually fills first)

  const ME = { name:'ΕΣΥ', mono:'Σ', color:'#D97B5C' };
  const RIVALS = [
    { name:'ΛΥΣΑΝΔΡΟΣ',   mono:'Λ', color:'#9E3B2E', skill:0.80 },
    { name:'ΑΛΚΙΒΙΑΔΗΣ',  mono:'Α', color:'#5E8B96', skill:0.70 },
    { name:'ΕΠΑΜΙΝΩΝΔΑΣ', mono:'Ε', color:'#C4A448', skill:0.62 },
    { name:'ΘΕΜΙΣΤΟΚΛΗΣ', mono:'Θ', color:'#6A8752', skill:0.54 },
  ];
  /* spread starting capitals per total player-count (index 0 = YOU) */
  const SEEDS = {
    2: [[4,3],[0,3]],
    3: [[4,3],[0,1],[0,5]],
    4: [[4,3],[0,1],[0,5],[2,6]],
  };
  const SHAPES = ['triangle','diamond','circle','square'];

  let chosen = 4;          // total players (YOU + rivals), set on the intro
  let st = {};

  /* fire a cinematic-FX event; no-op if nothing is listening (standalone-safe) */
  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('hg:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* presentation helpers (visual only — no game logic) */
  const REDUCE_FX = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  /* lighten (amt>0) / darken (amt<0) a #rrggbb — used for tile lighting */
  function shade(hex, amt){
    const n = parseInt(hex.slice(1), 16);
    let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
    if (amt >= 0) { r += (255-r)*amt; g += (255-g)*amt; b += (255-b)*amt; }
    else { r *= (1+amt); g *= (1+amt); b *= (1+amt); }
    const h = v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0');
    return '#' + h(r) + h(g) + h(b);
  }
  /* #rrggbb → rgba() string — used for faction-tinted light washes */
  function hexRGBA(hex, a){
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n>>16)&255},${(n>>8)&255},${n&255},${a})`;
  }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#hg-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('hg-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    document.body.classList.add('hg-live');   // scopes fx z-lift while the game is open
    if (!document.getElementById('hg-screen-intro')) build();
    syncLang();
    show('hg-screen-intro');
  }
  function close() {
    stopTimer(); clearSelTimer();
    document.getElementById('hg-overlay').classList.remove('active');
    document.body.style.overflow = '';
    document.body.classList.remove('hg-live');
  }

  // Build the overlay shell on demand (drop-in: works with or without host markup).
  function _ensureOverlay(gp) {
    if (document.getElementById('hg-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'hg-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeHegemonia()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u0397\u0393\u0395\u039c\u039f\u039d\u0399\u0391') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="hg-wrap"></div></div>';
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
    document.getElementById('hg-wrap').innerHTML = `
<!-- INTRO -->
<div id="hg-screen-intro" class="hg-screen">
  ${crestSVG('hg-crest')}
  <div class="hg-logo">ΗΓΕΜΟΝΙΑ</div>
  <div class="hg-logo-en" data-i18n="subtitle"></div>
  <div class="hg-intro-txt" data-i18n="intro"></div>
  <div class="hg-quad-demo">
    <span style="background:var(--sym-terra)">${shapeSVG('triangle','#2A140C')}</span>
    <span style="background:var(--sym-aegean)">${shapeSVG('diamond','#08171A')}</span>
    <span style="background:var(--sym-gold)">${shapeSVG('circle','#2A2208')}</span>
    <span style="background:var(--sym-sage)">${shapeSVG('square','#0E1808')}</span>
  </div>
  <div class="hg-pcount">
    <span class="hg-pcount-lbl" data-i18n="players"></span>
    <div class="hg-pcount-seg" id="hg-pcount-seg">
      <button data-n="2" onclick="Hegemonia._setPlayers(2)">2</button>
      <button data-n="3" onclick="Hegemonia._setPlayers(3)">3</button>
      <button data-n="4" class="on" onclick="Hegemonia._setPlayers(4)">4</button>
    </div>
  </div>
  <button class="sym-btn" onclick="Hegemonia._start()" data-i18n="march"></button>
</div>

<!-- GAME -->
<div id="hg-screen-game" class="hg-screen">
  <div class="hg-top">
    <div class="hg-score">
      <div class="hg-score-badge">Σ</div>
      <div class="hg-score-txt">
        <span class="hg-score-lbl" data-i18n="glory"></span>
        <span class="hg-score-val" id="hg-glory">0</span>
      </div>
    </div>
    <div class="hg-qcount" id="hg-qcount"></div>
  </div>
  <div class="hg-arena">
    <div class="hg-grid" id="hg-grid"></div>
    <div class="hg-ladder" id="hg-ladder"></div>
  </div>
  <div class="hg-select-hint" id="hg-select-hint"></div>
  <div class="hg-qbody">
    <div class="hg-q-card"><div class="hg-q-text" id="hg-qtext"></div></div>
    <div class="hg-timer"><div class="hg-timer-fill" id="hg-timer-fill"></div></div>
    <div class="hg-answers" id="hg-answers"></div>
    <div class="hg-feedback" id="hg-feedback"></div>
  </div>
</div>

<!-- END -->
<div id="hg-screen-end" class="hg-screen">
  ${crestSVG('hg-end-crest')}
  <div class="hg-end-title" id="hg-end-title"></div>
  <div class="hg-end-sub" id="hg-end-sub"></div>
  <div class="hg-final-board" id="hg-final-board"></div>
  <div class="hg-end-btns">
    <button class="sym-btn" onclick="Hegemonia._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Hegemonia.close()" data-i18n="exit"></button>
  </div>
</div>`;
    _mountAmbient();
  }

  /* scoped ambience inside the overlay (the shared .fx-ambient mounts on
     <body> BELOW the overlay plate, so the war-embers live here instead) */
  function _mountAmbient() {
    const wrap = document.getElementById('hg-wrap');
    if (!wrap || wrap.querySelector('.hg-ambient')) return;
    const amb = document.createElement('div');
    amb.className = 'hg-ambient';
    let h = '<div class="hg-blob b1"></div><div class="hg-blob b2"></div><div class="hg-blob b3"></div>';
    if (!REDUCE_FX) {
      for (let i = 0; i < 14; i++) {
        const x  = (Math.random()*100).toFixed(1),
              sz = (2 + Math.random()*3.4).toFixed(1),
              d  = (7 + Math.random()*9).toFixed(1),
              dl = (-Math.random()*16).toFixed(1),
              dr = ((Math.random()-0.5)*90).toFixed(0);
        h += `<span class="hg-em" style="--x:${x}%;--sz:${sz}px;--d:${d}s;--dl:${dl}s;--drift:${dr}px"></span>`;
      }
    }
    amb.innerHTML = h;
    wrap.insertBefore(amb, wrap.firstChild);
  }

  const I18N = {
    subtitle:{ gr:'Η βασιλεία των χρωμάτων', en:'The kingdom of colours' },
    intro:   { gr:'Το βασίλειό σου μεγαλώνει <b>ενωμένο</b>: μπορείς να βάλεις σημαία μόνο σε τετράγωνο που <b>ακουμπά τη γη σου</b> — διάλεξε από ποια άκρη θα απλωθείς και απέκλεισε τους αντιπάλους. Όσο πιο <b>γρήγορα & σωστά</b> απαντάς, τόσες <b>περισσότερες σημαίες</b> παίρνεις (1–3). Όποιος χρωματίσει τα περισσότερα τετράγωνα κερδίζει.', en:'Your kingdom grows as one <b>connected</b> empire: you may only flag a block <b>touching your own land</b> — choose which edge to expand and wall your rivals off. The <b>faster & more correct</b> you answer, the <b>more flags</b> you place (1–3). Colour the most blocks to win.' },
    march:   { gr:'ΕΚΣΤΡΑΤΕΙΑ', en:'MARCH OUT' },
    players: { gr:'ΠΑΙΚΤΕΣ', en:'PLAYERS' },
    glory:   { gr:'ΔΟΞΑ', en:'GLORY' },
    again:   { gr:'ΝΕΑ ΕΚΣΤΡΑΤΕΙΑ', en:'NEW CAMPAIGN' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#hg-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('hg-screen-game').classList.contains('active')) {
      document.getElementById('hg-qcount').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum;
      document.getElementById('hg-qtext').textContent = QT(st.cur.q);
      renderLadder();
      if (st.selecting) showHint();
    }
  }
  function show(id){ document.querySelectorAll('#hg-wrap .hg-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _setPlayers(n) {
    chosen = n;
    document.querySelectorAll('#hg-pcount-seg button').forEach(b=> b.classList.toggle('on', +b.dataset.n===n));
  }
  function _start() {
    stopTimer(); clearSelTimer();
    const seeds = SEEDS[chosen];
    st = {
      glory:0, qNum:0, answered:false, selecting:false, placing:0, cur:null,
      pool: shuffle([..._gpPool()]), idx:0,
      grid: Array.from({length:N}, ()=>({ owner:null })),
      players: [{ ...ME, me:true }, ...RIVALS.slice(0, chosen-1).map(r=>({ ...r, me:false, glory:0 }))],
      caps: {},
    };
    st.players.forEach((_,p)=>{ const i=seeds[p][0]*COLS+seeds[p][1]; st.grid[i].owner=p; st.caps[p]=i; });
    buildGrid();
    show('hg-screen-game');
    updateBoard([]);
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }
  const rc = i => [ (i/COLS)|0, i%COLS ];
  function neighbors(i){ const [r,c]=rc(i); const o=[]; if(r>0)o.push(i-COLS); if(r<ROWS-1)o.push(i+COLS); if(c>0)o.push(i-1); if(c<COLS-1)o.push(i+1); return o; }
  function unclaimedCount(){ return st.grid.filter(t=>t.owner===null).length; }

  /* tiles bordering player p's land that p does not yet own */
  function frontier(p){
    const set=new Set();
    st.grid.forEach((t,i)=>{ if(t.owner===p) neighbors(i).forEach(n=>{ if(st.grid[n].owner!==p) set.add(n); }); });
    return [...set];
  }
  function openScore(i){ return neighbors(i).filter(n=>st.grid[n].owner===null).length; }

  /* ───────── grid DOM ───────── */
  function buildGrid() {
    const g = document.getElementById('hg-grid');
    let tiles = '<div class="hg-tiles" id="hg-tiles">';
    for (let i=0;i<N;i++) tiles += `<div class="hg-tile" data-i="${i}"></div>`;
    tiles += '</div>';
    g.innerHTML = '<div class="hg-glowbed"></div>' + tiles + '<div class="hg-frame"></div>';
    g.querySelector('#hg-tiles').onclick = (e)=>{
      const t=e.target.closest('.hg-tile'); if(!t||!st.selecting) return;
      const i=+t.dataset.i; if(t.classList.contains('sel')) placeFlag(i);
    };
  }
  function darkOn(hex){ return ['#C4A448','#6A8752'].includes(hex); }
  function color(p){ return st.players[p].color; }
  function terr(p){ return st.grid.filter(t=>t.owner===p).length; }

  function updateBoard(flash) {
    const fresh=new Set(flash||[]);
    const tiles=document.getElementById('hg-tiles').children;
    let rank=0;                                   // stagger multi-tile advances into a wave
    for (let i=0;i<N;i++){
      const t=tiles[i], o=st.grid[i].owner;
      if (o!=null){
        const c=color(o);
        t.classList.add('own');
        t.style.setProperty('--tc', c);
        t.style.setProperty('--tc-lt', shade(c, 0.34));
        t.style.setProperty('--tc-dk', shade(c, -0.42));
        t.style.background='';
      } else {
        t.classList.remove('own');
        t.style.removeProperty('--tc'); t.style.removeProperty('--tc-lt'); t.style.removeProperty('--tc-dk');
        t.style.background='';
      }
      const isCap = o!=null && st.caps[o]===i;
      t.classList.toggle('cap-tile', isCap);
      let inner = isCap ? capSVG(darkOn(color(o))) : '';
      if (o!=null) inner += edgeSpans(i, o);
      let dl = 0;
      if (fresh.has(i)) dl = rank++ * 70;
      if (fresh.has(i) && o!=null && o!==0 && !REDUCE_FX) inner += `<i class="hg-sweep" style="--dl:${dl+80}ms"></i>`;
      t.innerHTML = inner;
      if (fresh.has(i)){
        t.style.animationDelay = dl+'ms';
        t.classList.remove('flash','mine'); void t.offsetWidth; t.classList.add('flash');
        if (o===0) t.classList.add('mine');
      } else {
        t.style.animationDelay = '';
      }
    }
    renderLadder();
  }

  function standings() {
    return st.players.map((p,i)=>({ ...p, idx:i, terr:terr(i), glory:p.me?st.glory:(p.glory||0) }))
      .sort((a,b)=> b.terr-a.terr || b.glory-a.glory);
  }
  function renderLadder() {
    const board=standings();
    if(window.SymStandings) SymStandings.feed('hg', board, {key:'terr', unit:'χώρες', accent:'var(--sym-blood)', title:'ΗΓΕΜΟΝΙΑ'});
    const lad=document.getElementById('hg-ladder');
    /* patch rows in place (keyed by player idx) so bars ease and rank swaps
       slide (FLIP) instead of teleporting — presentation only */
    const canPatch = lad.children.length===board.length &&
      board.every(p=> lad.querySelector(`[data-p="${p.idx}"]`));
    if (!canPatch) {
      lad.innerHTML = board.map((p,ri)=>
        `<div class="hg-ladder-row${p.me?' me':''}${ri===0?' lead':''}" data-p="${p.idx}">
          <span class="hg-ladder-swatch" style="background:${p.color}; color:${p.color}"></span>
          <span class="hg-ladder-name">${p.name}</span>
          <span class="hg-ladder-terr">${p.terr}</span>
          <span class="hg-ladder-pct">${Math.round(p.terr/N*100)}%</span>
          <span class="hg-ladder-bar" style="--w:${Math.max(3, Math.round(p.terr/N*100))}%; --pc:${p.color}"></span>
        </div>`).join('');
    } else {
      const oldTop=new Map();
      Array.from(lad.children).forEach(r=> oldTop.set(r.dataset.p, r.getBoundingClientRect().top));
      board.forEach((p,ri)=>{
        const row=lad.querySelector(`[data-p="${p.idx}"]`);
        row.className='hg-ladder-row'+(p.me?' me':'')+(ri===0?' lead':'');
        const t=row.querySelector('.hg-ladder-terr');
        if (t.textContent!==String(p.terr)){
          t.textContent=p.terr;
          if(!REDUCE_FX){ try{ t.animate(
            [{transform:'scale(1)'},{transform:'scale(1.4)',offset:.35},{transform:'scale(1)'}],
            {duration:380, easing:'cubic-bezier(.2,.9,.3,1.35)'}); }catch(_){}}
        }
        row.querySelector('.hg-ladder-pct').textContent=Math.round(p.terr/N*100)+'%';
        row.querySelector('.hg-ladder-bar').style.setProperty('--w', Math.max(3, Math.round(p.terr/N*100))+'%');
        lad.appendChild(row);                       // reorder into standings order
      });
      if(!REDUCE_FX) Array.from(lad.children).forEach(r=>{
        const ot=oldTop.get(r.dataset.p); if(ot==null) return;
        const dy=ot - r.getBoundingClientRect().top;
        if (Math.abs(dy)>2){ try{ r.animate(
          [{transform:`translateY(${dy}px)`},{transform:'translateY(0)'}],
          {duration:430, easing:'cubic-bezier(.2,.8,.2,1)'}); }catch(_){}}
      });
    }
    /* torch bed + board glow lean toward whoever rules the map right now */
    const grid=document.getElementById('hg-grid');
    if (grid) grid.style.setProperty('--hg-leadc', board[0].color);
    document.getElementById('hg-glory').textContent = st.glory;
  }

  /* ───────── timer ───────── */
  function startTimer() {
    stopTimer(); st.tStart=performance.now();
    const fill=document.getElementById('hg-timer-fill');
    st.timer=setInterval(()=>{
      const el=performance.now()-st.tStart, frac=Math.max(0,1-el/DUR);
      fill.style.width=(frac*100)+'%'; fill.classList.toggle('warn', frac<0.35);
      if(el>=DUR){ stopTimer(); if(!st.answered) answer(-1,null); }
    },50);
  }
  function stopTimer(){ if(st.timer){ clearInterval(st.timer); st.timer=null; } }
  function frac(){ return Math.max(0, 1-(performance.now()-st.tStart)/DUR); }
  function clearSelTimer(){ if(st.selTimer){ clearTimeout(st.selTimer); st.selTimer=null; } }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.qNum>=CAP || unclaimedCount()===0) return end();
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('hg-qcount').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum;
    document.getElementById('hg-qtext').textContent = QT(st.cur.q);
    const card=document.querySelector('#hg-screen-game .hg-q-card');
    if (card){ card.classList.remove('q-in'); void card.offsetWidth; card.classList.add('q-in'); }
    const fb=document.getElementById('hg-feedback'); fb.textContent=''; fb.className='hg-feedback';
    const wrap=document.getElementById('hg-answers'); wrap.innerHTML='';
    const inks=['#2A140C','#08171A','#2A2208','#0E1808'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='hg-ans hg-sh-'+i;
      b.innerHTML=`<span class="hg-shape">${shapeSVG(SHAPES[i],inks[i])}</span><span class="hg-ans-txt">${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    document.getElementById('hg-timer-fill').style.width='100%';
    startTimer();
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true; stopTimer();
    const correct = chosen===st.cur.c;
    if (!correct && window.symLogMistake) { try { window.symLogMistake({ q: st.cur.q, wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Ηγεμονία', gameId: 'hegemonia' }); } catch (_) {} }
    const speed = frac();
    document.querySelectorAll('#hg-answers .hg-ans').forEach((b,i)=>{
      b.disabled=true;
      if (i===st.cur.c){ b.classList.add('correct'); b.insertAdjacentHTML('beforeend','<span class="hg-mark">✓</span>'); }
      else if (i===chosen){ b.classList.add('wrong'); b.insertAdjacentHTML('beforeend','<span class="hg-mark">✕</span>'); }
      else b.classList.add('dim');
    });

    const fb=document.getElementById('hg-feedback');
    if (correct) {
      const flags = speed>=0.7 ? 3 : speed>=0.38 ? 2 : 1;
      const gain = 500 + Math.round(500*speed);
      st.glory += gain;
      fb.className='hg-feedback hg-fb-ok';
      fb.textContent = T(`+${gain} ΔΟΞΑ — ${flags} ${flags===1?'σημαία':'σημαίες'}! Άπλωσε το βασίλειο`, `+${gain} GLORY — ${flags} ${flags===1?'flag':'flags'}! Expand your kingdom`);
      _fx('correct',{el:btn, flags, gain, speed});
      enterPlace(flags);
    } else {
      fb.className='hg-feedback hg-fb-bad';
      _fx('wrong',{el:btn});
      fb.textContent = chosen===-1 ? T('Ο ΧΡΟΝΟΣ ΤΕΛΕΙΩΣΕ — οι ηγεμόνες απλώνονται','TIME UP — the hegemons spread') : T('ΛΑΘΟΣ — οι ηγεμόνες απλώνονται','WRONG — the hegemons spread');
      setTimeout(()=>{ rivalsTurn(); afterTurn(); }, 700);
    }
  }

  /* ───────── player plants flags on the frontier ───────── */
  function enterPlace(count) {
    const front = frontier(0);
    if (!front.length){ // boxed in — skip to rivals
      document.getElementById('hg-feedback').textContent = T('Δεν υπάρχει χώρος να απλωθείς…','No room to expand…');
      setTimeout(()=>{ rivalsTurn(); afterTurn(); }, 900);
      return;
    }
    st.placing = count; st.selecting = true;
    const tilesEl=document.getElementById('hg-tiles');
    if (tilesEl) tilesEl.setAttribute('data-momentum', String(count));   // combo speed → frontier pulse
    highlightFrontier();
    showHint();
    clearSelTimer();
    st.selTimer = setTimeout(()=> placeFlag(autoPick()), 7000);
  }
  function highlightFrontier() {
    const tiles=document.getElementById('hg-tiles').children;
    for (let i=0;i<N;i++){ tiles[i].classList.remove('sel','frontier-open','frontier-foe'); }
    frontier(0).forEach(i=>{
      tiles[i].classList.add('sel', st.grid[i].owner===null?'frontier-open':'frontier-foe');
    });
  }
  function showHint() {
    const h=document.getElementById('hg-select-hint');
    h.textContent = T(`ΔΙΑΛΕΞΕ ΤΕΤΡΑΓΩΝΟ ΣΤΑ ΣΥΝΟΡΑ ΣΟΥ · ${st.placing} ${st.placing===1?'ΣΗΜΑΙΑ':'ΣΗΜΑΙΕΣ'} ΑΚΟΜΗ`, `PICK A BLOCK ON YOUR BORDER · ${st.placing} ${st.placing===1?'FLAG':'FLAGS'} LEFT`);
    h.classList.add('on');
  }
  function autoPick() {
    const front=frontier(0); if(!front.length) return -1;
    const open=front.filter(i=>st.grid[i].owner===null);
    const pool=open.length?open:front;
    return pool.reduce((b,i)=> openScore(i)>openScore(b)?i:b, pool[0]);
  }
  function placeFlag(i) {
    if (!st.selecting || i<0) return;
    clearSelTimer();
    const prev=st.grid[i].owner;
    const src=neighbors(i).find(n=>st.grid[n].owner===0);   // the land we marched from (visual trail)
    st.grid[i].owner=0;
    updateBoard([i]);
    rippleFrom(i);
    _fx('plant',{i, from:(src!=null?src:st.caps[0]), conquest: prev!=null});
    st.placing--;
    if (st.placing>0 && frontier(0).length){
      highlightFrontier(); showHint();
      st.selTimer=setTimeout(()=> placeFlag(autoPick()), 7000);
      return;
    }
    // done placing
    st.selecting=false;
    const tilesEl=document.getElementById('hg-tiles');
    if (tilesEl) tilesEl.removeAttribute('data-momentum');
    document.getElementById('hg-select-hint').classList.remove('on');
    Array.from(document.getElementById('hg-tiles').children).forEach(t=>t.classList.remove('sel','frontier-open','frontier-foe'));
    setTimeout(()=>{ rivalsTurn(); afterTurn(); }, 650);
  }

  /* ───────── rival hegemons expand & block ───────── */
  function rivalsTurn() {
    const flash=[]; let raided=0;
    // each rival hegemon expands its connected empire
    for (let p=1; p<st.players.length; p++) {
      const skill=st.players[p].skill;
      let n = 1 + (Math.random()<skill?1:0);
      for (let k=0;k<n;k++){
        const front=frontier(p); if(!front.length) break;
        const open=front.filter(i=>st.grid[i].owner===null);
        let pick;
        if (open.length){
          pick = open.reduce((b,i)=> openScore(i)>openScore(b)?i:b, open[0]);
        } else {
          // press the current leader (other than self) on the shared border
          const lead = leaderExcept(p);
          const foe = front.filter(i=>st.grid[i].owner===lead);
          pick = (foe.length?foe:front)[(Math.random()*(foe.length?foe.length:front.length))|0];
        }
        if (st.grid[pick].owner===0) raided++;          // visual only: they took OUR land
        st.grid[pick].owner=p; flash.push(pick);
        st.players[p].glory += 300 + ((Math.random()*450)|0);
      }
    }
    updateBoard(flash);
    _fx('march',{tiles:flash.slice(), raided});
  }
  function leaderExcept(p){
    let best=-1, bi=0; st.players.forEach((_,i)=>{ if(i!==p){ const t=terr(i); if(t>best){best=t; bi=i;} } });
    return bi;
  }

  function afterTurn() {
    setTimeout(()=>{ if(st.qNum>=CAP || unclaimedCount()===0) end(); else nextQ(); }, 850);
  }

  /* ───────── end ───────── */
  function end() {
    stopTimer(); clearSelTimer();
    show('hg-screen-end');
    const board=standings(); const won=board[0].me; const mine=board.find(x=>x.me);
    const scr=document.getElementById('hg-screen-end');   // the winner's colour floods the field
    if (scr){ scr.style.setProperty('--hg-win', board[0].color); scr.classList.remove('sweep-go'); void scr.offsetWidth; scr.classList.add('sweep-go'); }
    _fx(won?'win':'lose', {color: board[0].color});
    const title=document.getElementById('hg-end-title'); const sub=document.getElementById('hg-end-sub');
    if (won) {
      title.textContent=T('Η ΗΓΕΜΟΝΙΑ ΕΙΝΑΙ ΔΙΚΗ ΣΟΥ','THE HEGEMONY IS YOURS'); title.className='hg-end-title win';
      sub.textContent=T(`Το βασίλειό σου χρωμάτισε ${Math.round(mine.terr/N*100)}% του χάρτη — κανείς δεν σε σταμάτησε.`,`Your empire coloured ${Math.round(mine.terr/N*100)}% of the map — none could stop you.`);
    } else {
      title.textContent=T('Η ΕΚΣΤΡΑΤΕΙΑ ΤΕΛΕΙΩΣΕ','THE CAMPAIGN ENDS'); title.className='hg-end-title lose';
      sub.textContent=T(`Κράτησες ${Math.round(mine.terr/N*100)}% του χάρτη. Η ηγεμονία πήγε στον ${board[0].name} (${Math.round(board[0].terr/N*100)}%).`,`You held ${Math.round(mine.terr/N*100)}% of the map. The hegemony went to ${board[0].name} (${Math.round(board[0].terr/N*100)}%).`);
    }
    document.getElementById('hg-final-board').innerHTML = board.map((x,i)=>
      `<div class="hg-final-row${x.me?' me':''}">
        <span class="hg-final-pos">${i+1}</span>
        <span class="hg-final-swatch" style="background:${x.color}"></span>
        <span class="hg-final-name">${x.name}${i===0?' 🏆':''}</span>
        <span class="hg-final-terr">${x.terr}</span>
        <span class="hg-final-pct">${Math.round(x.terr/N*100)}%</span>
      </div>`).join('');
  }

  /* ───────── art ───────── */
  /* capital pennant: pole + forked banner that flutters (CSS: .hg-cap-cloth) */
  function capSVG(dark){
    const ink  = dark ? '#2A1E08' : '#F7EFE2';
    const edge = dark ? 'rgba(255,255,255,0.28)' : 'rgba(0,0,0,0.35)';
    return `<span class="hg-cap"><svg viewBox="0 0 24 24" aria-hidden="true">
      <ellipse cx="12.2" cy="19.9" rx="5.6" ry="1.4" fill="rgba(0,0,0,0.28)"/>
      <path d="M8.6 4.4v15.3" stroke="${ink}" stroke-width="1.6" stroke-linecap="round"/>
      <circle cx="8.6" cy="3.3" r="1.35" fill="${ink}"/>
      <path class="hg-cap-cloth" d="M9.7 5.2 L20.6 7.1 L17 9.4 L20.6 11.7 L9.7 13.6 Z" fill="${ink}" stroke="${edge}" stroke-width="0.4"/>
    </svg></span>`;
  }
  /* smouldering front-line strips on edges that touch a DIFFERENT empire */
  function edgeSpans(i, o){
    const [r,c]=rc(i); let out='';
    const ph=(-((i*37)%160)/100).toFixed(2);   // deterministic flicker phase
    const add=(n,cls)=>{ const no=st.grid[n].owner; if(no!=null && no!==o) out+=`<i class="hg-edge ${cls}" style="animation-delay:${ph}s"></i>`; };
    if (r>0)      add(i-COLS,'e-t');
    if (r<ROWS-1) add(i+COLS,'e-b');
    if (c>0)      add(i-1,'e-l');
    if (c<COLS-1) add(i+1,'e-r');
    return out;
  }
  /* claim ripple: brightness wave rolling outward through neighbouring land —
     your own banners also catch a wash of the faction colour as it passes */
  function rippleFrom(i){
    if (REDUCE_FX) return;
    const tilesEl=document.getElementById('hg-tiles'); if(!tilesEl) return;
    const tiles=tilesEl.children; const [r0,c0]=rc(i);
    const wash=hexRGBA(color(0), 0.55);
    for (let j=0;j<N;j++){
      if (j===i) continue;
      const [r,c]=rc(j); const d=Math.abs(r-r0)+Math.abs(c-c0);
      if (d>2) continue;
      const mine = st.grid[j].owner===0;
      try{
        tiles[j].animate(
          mine
          ? [{filter:'brightness(1) saturate(1)',    boxShadow:'inset 0 0 0 0 rgba(0,0,0,0)'},
             {filter:'brightness(1.55) saturate(1.2)', boxShadow:`inset 0 0 16px ${wash}`, offset:.4},
             {filter:'brightness(1) saturate(1)',    boxShadow:'inset 0 0 0 0 rgba(0,0,0,0)'}]
          : [{filter:'brightness(1) saturate(1)'},{filter:'brightness(1.5) saturate(1.15)',offset:.4},{filter:'brightness(1) saturate(1)'}],
          {duration:480, delay:70*d, easing:'ease-out'});
      }catch(_){}
    }
  }
  function shapeSVG(type, ink){
    const f=`fill="${ink}"`;
    if (type==='triangle') return `<svg viewBox="0 0 32 32"><path d="M16 4l12 24H4z" ${f}/></svg>`;
    if (type==='diamond')  return `<svg viewBox="0 0 32 32"><path d="M16 3l13 13-13 13L3 16z" ${f}/></svg>`;
    if (type==='circle')   return `<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="13" ${f}/></svg>`;
    return `<svg viewBox="0 0 32 32"><rect x="4" y="4" width="24" height="24" rx="3" ${f}/></svg>`;
  }
  function crestSVG(cls){ return `<svg class="${cls}" viewBox="0 0 120 120" fill="none">
    <defs><linearGradient id="hg-cr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C7553A"/><stop offset="1" stop-color="#7E261C"/></linearGradient></defs>
    <path d="M60 10l40 14v28c0 30-20 50-40 58-20-8-40-28-40-58V24z" fill="url(#hg-cr)" stroke="#4A140E" stroke-width="2.5"/>
    <path d="M60 22l28 10v22c0 22-14 37-28 43-14-6-28-21-28-43V32z" fill="none" stroke="#F4D9B0" stroke-opacity="0.4" stroke-width="2"/>
    <text x="60" y="78" font-family="Cinzel,serif" font-size="46" font-weight="700" fill="#F4D9B0" text-anchor="middle">Η</text>
  </svg>`; }

  return { open, close, _start, _setPlayers, syncLang };
})();
window.Hegemonia = Hegemonia;

/* ── Games-Panel entry points ── */
window.openHegemonia  = function(gp){ Hegemonia.open(gp || {}); };
window.closeHegemonia = function(){ Hegemonia.close(); };
