/* ══════════════════ ΑΓΟΡΑ — engine ══════════════════
   Auction reimagined as the bidding floor of the ancient Agora.
   Each round a treasure is cried; bid your drachmas against rival
   merchants for the right to answer. Win the lot and answer truly to
   claim its worth — bid rashly and your purse runs dry. Richest wins.
   API:  Agora.open()   Agora.close()
═══════════════════════════════════════════════════════════════════ */
const Agora = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  // Pick the language string from a question's `q`, tolerating {gr,en},
  // bare strings, {q:{gr,en}} wrappers and object-valued langs — so the card
  // never renders the literal "[object Object]".
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

  const _gpPool = () => {
    const g = window.AG_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const ROUNDS = 8;
  const START  = 1000;
  const RIVALS = ['ΚΡΟΙΣΟΣ','ΤΡΙΜΑΛΧΙΩΝ','ΑΣΠΑΣΙΑ'];
  const LOTS = [
    { v:120, ic:'🏺', gr:'Κορινθιακό αγγείο',   en:'A Corinthian vase' },
    { v:160, ic:'🪖', gr:'Χάλκινη περικεφαλαία',  en:'A bronze helmet' },
    { v:200, ic:'💍', gr:'Χρυσό δαχτυλίδι',       en:'A gold ring' },
    { v:140, ic:'🗿', gr:'Μαρμάρινη προτομή',     en:'A marble bust' },
    { v:240, ic:'🏆', gr:'Ασημένιος κρατήρας',    en:'A silver krater' },
    { v:300, ic:'🔱', gr:'Αναθηματικός τρίποδας', en:'A votive tripod' },
    { v:100, ic:'🪆', gr:'Πήλινο ειδώλιο',        en:'A clay figurine' },
    { v:180, ic:'🪞', gr:'Ελεφαντοστέινο χτένι',  en:'An ivory comb' },
  ];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('ag:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#ag-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('ag-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('ag-screen-intro')) build();
    syncLang();
    show('ag-screen-intro');
  }
  function close() {
    document.getElementById('ag-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('ag-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'ag-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeAgora()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u0391\u0393\u039f\u03a1\u0391') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="ag-wrap"></div></div>';
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
    document.getElementById('ag-wrap').innerHTML = `
<!-- INTRO -->
<div id="ag-screen-intro" class="ag-screen">
  ${gavelSVG('ag-gavel')}
  <div class="ag-logo">ΑΓΟΡΑ</div>
  <div class="ag-logo-en" data-i18n="subtitle"></div>
  <div class="ag-intro-txt" data-i18n="intro"></div>
  <button class="sym-btn" onclick="Agora._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="ag-screen-game" class="ag-screen">
  <div class="ag-top">
    <div class="ag-purse">
      <span class="ag-purse-lbl" data-i18n="purse"></span>
      <span class="ag-purse-val" id="ag-purse">0</span>
    </div>
    <div class="ag-round" id="ag-round"></div>
  </div>
  <div class="ag-board" id="ag-board"></div>
  <div class="ag-lot" id="ag-lot"></div>
  <div class="ag-phase" id="ag-phase"></div>
  <div class="ag-feedback" id="ag-feedback"></div>
</div>

<!-- END -->
<div id="ag-screen-end" class="ag-screen">
  <div id="ag-end-art"></div>
  <div class="ag-end-title" id="ag-end-title"></div>
  <div class="ag-end-sub" id="ag-end-sub"></div>
  <div class="ag-final-board" id="ag-final-board"></div>
  <div class="ag-end-btns">
    <button class="sym-btn" onclick="Agora._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Agora.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    subtitle:{ gr:'Το σφυρί της Αγοράς', en:'The Auction Floor' },
    intro:   { gr:'Στην <b>Αγορά</b>, κάθε γύρο κηρύσσεται ένας θησαυρός. <b>Πλειοδότησε</b> με δραχμές ενάντια στους εμπόρους για το δικαίωμα της απάντησης. Κέρδισε τον θησαυρό και απάντησε σωστά για να πάρεις την αξία του — μα μη σπαταλήσεις το πουγκί σου. Ο πλουσιότερος νικά.', en:'In the <b>Agora</b>, each round a treasure is cried. <b>Bid</b> your drachmas against rival merchants for the right to answer. Win the lot and answer truly to claim its worth — but don\u2019t empty your purse. The richest wins.' },
    begin:   { gr:'ΣΤΟ ΣΦΥΡΙ', en:'TO THE BLOCK' },
    purse:   { gr:'ΠΟΥΓΚΙ', en:'PURSE' },
    again:   { gr:'ΝΕΑ ΔΗΜΟΠΡΑΣΙΑ', en:'NEW AUCTION' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#ag-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.lot && document.getElementById('ag-screen-game').classList.contains('active')) {
      renderTop(); renderBoard(); renderLot();
      if (st.phase==='bid') renderBid();
      else if (st.phase==='answer') renderQuestion();
    }
  }
  function show(id){ document.querySelectorAll('#ag-wrap .ag-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _start() {
    st = {
      drach:START, round:0, phase:'bid', lot:null, bid:0,
      pool: shuffle([..._gpPool()]), idx:0, lots: shuffle([...LOTS]), lotIdx:0,
      rivals: RIVALS.map(n=>({ name:n, drach:START })),
    };
    show('ag-screen-game');
    newRound();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }
  function getLot(){ if(st.lotIdx>=st.lots.length){ st.lots=shuffle([...LOTS]); st.lotIdx=0; } return st.lots[st.lotIdx++]; }

  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), drach:st.drach, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.drach-a.drach);
    return all;
  }
  function renderTop() {
    document.getElementById('ag-purse').textContent = st.drach;
    document.getElementById('ag-round').textContent = T('ΛΟΤ ','LOT ')+st.round+' / '+ROUNDS;
  }
  function pulsePurse(up) {
    const el=document.getElementById('ag-purse'); if(!el) return;
    if (window.gsap) gsap.fromTo(el, {scale:1.4}, {scale:1, duration:.55, ease:'back.out(2.6)'});
    el.style.color = up? '#9DBE84' : '#E08577';
    setTimeout(()=>{ el.style.color=''; }, 700);
  }
  function renderBoard() {
    if(window.SymStandings) SymStandings.feed('ag', standings(), {key:'drach', unit:'δρ', accent:'var(--sym-gold)', title:'ΑΓΟΡΑ'});
    document.getElementById('ag-board').innerHTML = standings().map((x,i)=>
      `<div class="ag-board-chip${x.me?' me':''}"><span class="ag-board-rank">${i+1}</span><span class="ag-board-name">${x.name}</span><span class="ag-board-d">${x.drach}</span></div>`
    ).join('');
  }
  function renderLot() {
    const lot=st.lot;
    document.getElementById('ag-lot').innerHTML =
      `<div class="ag-lot-ic">${lot.ic}</div>
       <div class="ag-lot-info">
         <div class="ag-lot-name">${lot[L()]}</div>
         <div class="ag-lot-val">${T('ΑΞΙΑ','WORTH')} <b>${lot.v}</b> ${T('δραχμές','drachmas')}</div>
       </div>`;
  }

  /* ───────── round ───────── */
  function newRound() {
    if (st.round>=ROUNDS) return end();
    st.round++; st.phase='bid'; st.lot=getLot(); st.bid=0;
    document.getElementById('ag-feedback').textContent=''; document.getElementById('ag-feedback').className='ag-feedback';
    renderTop(); renderBoard(); renderLot(); renderBid();
  }

  function bidOptions() {
    const V=st.lot.v, opts=[{lbl:T('ΠΑΣΟ','PASS'),amt:0,tone:'pass'}];
    [[0.4,'low'],[0.7,'fair'],[1.0,'bold']].forEach(([f,tone])=>{
      const a=Math.round(V*f/10)*10;
      if (a>0 && a<=st.drach && !opts.some(o=>o.amt===a)) opts.push({ lbl:({low:T('ΧΑΜΗΛΑ','LOW'),fair:T('ΔΙΚΑΙΑ','FAIR'),bold:T('ΓΕΝΝΑΙΑ','BOLD')})[tone], amt:a, tone });
    });
    return opts;
  }
  function renderBid() {
    const opts=bidOptions();
    document.getElementById('ag-phase').innerHTML =
      `<div class="ag-bid-head">${T('Η ΠΡΟΣΦΟΡΑ ΣΟΥ','YOUR BID')}</div>
       <div class="ag-bid-opts">${opts.map((o,i)=>`<button class="ag-bid-btn ${o.tone}" data-i="${i}"><span class="ag-bid-lbl">${o.lbl}</span><span class="ag-bid-amt">${o.amt||'—'}</span></button>`).join('')}</div>`;
    const btns=document.querySelectorAll('#ag-phase .ag-bid-btn');
    btns.forEach((b,i)=>{ b.onclick=()=>placeBid(opts[i].amt, btns); });
  }

  function placeBid(amt, btns) {
    if (st.phase!=='bid') return; st.phase='bidding';
    btns && btns.forEach(b=>b.disabled=true);
    st.bid=amt;
    const V=st.lot.v;
    // rival bids
    st.rivalBids = st.rivals.map(r=>{
      if (r.drach<10 || Math.random()<0.18) return { r, bid:0 };
      let b=Math.round(V*(0.3+Math.random()*0.8)/10)*10;
      b=Math.min(b, r.drach);
      return { r, bid:b };
    });
    // determine winner (ties → player)
    const all=[{me:true, bid:amt}, ...st.rivalBids.map(x=>({me:false, r:x.r, bid:x.bid}))];
    const max=Math.max(...all.map(x=>x.bid));
    let winner;
    if (max===0) winner={none:true};
    else if (amt===max) winner={me:true, bid:amt};
    else { const top=all.filter(x=>x.bid===max && !x.me); winner=top[(Math.random()*top.length)|0]; }

    // show bids
    const bidLine = st.rivalBids.map(x=>`${x.r.name}: ${x.bid||T('πάσο','pass')}`).join('   ·   ');
    const fb=document.getElementById('ag-feedback');
    fb.innerHTML = `<span class="ag-bidline">${T('ΕΣΥ','YOU')}: ${amt||T('πάσο','pass')}   ·   ${bidLine}</span>`;
    fb.className='ag-feedback ag-fb-hint';

    setTimeout(()=>{
      if (winner.none) {
        st.phase='resolve';
        document.getElementById('ag-phase').innerHTML =
          `<div class="ag-resolve">${T('Κανείς δεν πλειοδότησε. Ο θησαυρός αποσύρεται.','No one bid. The treasure is withdrawn.')}</div>
           <button class="sym-btn ag-cont" onclick="Agora._next()">${st.round>=ROUNDS?T('ΑΠΟΤΕΛΕΣΜΑ','RESULT'):T('ΕΠΟΜΕΝΟ ΛΟΤ','NEXT LOT')}</button>`;
      } else if (winner.me) {
        st.phase='answer'; renderQuestion();
        _fx('win-bid');
      } else {
        rivalWins(winner.r, winner.bid);
      }
    }, 1100);
  }

  function rivalWins(r, bid) {
    st.phase='resolve';
    const correct = Math.random()<0.6;
    if (correct) r.drach += st.lot.v; else r.drach = Math.max(0, r.drach - bid);
    renderBoard();
    document.getElementById('ag-phase').innerHTML =
      `<div class="ag-resolve">${T(`Ο/Η <b>${r.name}</b> πήρε τον θησαυρό για ${bid} δρ. `,`<b>${r.name}</b> took the lot for ${bid} dr. `)}${correct?T('και απάντησε σωστά.','and answered truly.'):T('μα απάντησε λάθος.','but answered falsely.')}</div>
       <button class="sym-btn ag-cont" onclick="Agora._next()">${st.round>=ROUNDS?T('ΑΠΟΤΕΛΕΣΜΑ','RESULT'):T('ΕΠΟΜΕΝΟ ΛΟΤ','NEXT LOT')}</button>`;
  }

  function renderQuestion() {
    st.cur = st.cur || getQ();
    const keys=['Α','Β','Γ','Δ'];
    document.getElementById('ag-phase').innerHTML =
      `<div class="ag-won-tag">${T('ΚΕΡΔΙΣΕΣ ΤΟ ΛΟΤ — ΑΠΑΝΤΗΣΕ','YOU WON THE LOT — ANSWER')}</div>
       <div class="ag-q-card"><div class="ag-q-text">${QT(st.cur.q)}</div></div>
       <div class="ag-answers">${st.cur.a.map((opt,i)=>`<button class="ag-ans" data-i="${i}"><span class="ag-ans-key">${keys[i]}</span><span>${opt}</span></button>`).join('')}</div>`;
    const btns=document.querySelectorAll('#ag-phase .ag-ans');
    btns.forEach((b,i)=>{ b.onclick=()=>answerLot(i, btns); });
  }

  function answerLot(chosen, btns) {
    if (st.phase!=='answer') return; st.phase='resolve';
    btns.forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('ag-feedback');
    let msg;
    if (chosen===st.cur.c) {
      st.drach += st.lot.v; pulsePurse(true); _fx('correct',{el:btns[chosen]});
      msg=T(`ΣΩΣΤΟ — κέρδισες τον θησαυρό αξίας ${st.lot.v} δρ.`,`CORRECT — you gain the treasure worth ${st.lot.v} dr.`);
      fb.className='ag-feedback ag-fb-ok';
      if (window.SymFX) SymFX.burst(window.innerWidth/2, window.innerHeight*0.4, {emoji:['🪙','✦'], count:16, power:11, up:0.5, life:1200});
    } else {
      btns[chosen].classList.add('wrong'); _fx('wrong',{el:btns[chosen]});
      if (window.symLogMistake) { try { window.symLogMistake({ q: QT(st.cur.q), wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Αγορά', gameId: 'agora' }); } catch (_) {} }
      st.drach = Math.max(0, st.drach - st.bid); pulsePurse(false);
      msg=T(`ΛΑΘΟΣ — έχασες την προσφορά σου (${st.bid} δρ.)`,`WRONG — you forfeit your bid (${st.bid} dr.)`);
      fb.className='ag-feedback ag-fb-bad';
    }
    fb.textContent=msg;
    renderTop(); renderBoard();
    document.getElementById('ag-phase').insertAdjacentHTML('beforeend',
      `<button class="sym-btn ag-cont" onclick="Agora._next()">${st.round>=ROUNDS?T('ΑΠΟΤΕΛΕΣΜΑ','RESULT'):T('ΕΠΟΜΕΝΟ ΛΟΤ','NEXT LOT')}</button>`);
  }

  function _next() { st.cur=null; newRound(); }

  /* ───────── end ───────── */
  function end() {
    show('ag-screen-end');
    const board = standings();
    const won = board[0].me;
    _fx(won?'win':'lose');
    document.getElementById('ag-end-art').innerHTML = gavelSVG('ag-end-gavel');
    const title=document.getElementById('ag-end-title'), sub=document.getElementById('ag-end-sub');
    if (won) {
      title.textContent=T('ΑΡΧΕΜΠΟΡΟΣ','MASTER MERCHANT'); title.className='ag-end-title win';
      sub.textContent=T('Έκλεισες με το βαρύτερο πουγκί της Αγοράς. Έμπορος ανάμεσα στους εμπόρους.','You closed with the heaviest purse in the Agora. A merchant among merchants.');
    } else {
      title.textContent=T('ΤΟ ΣΦΥΡΙ ΕΠΕΣΕ','THE GAVEL FALLS'); title.className='ag-end-title lose';
      sub.textContent=T(`Τελείωσες με ${st.drach} δρ., στη ${board.findIndex(x=>x.me)+1}η θέση. Πλουσιότερος: ${board[0].name}.`,`You finished with ${st.drach} dr., in position ${board.findIndex(x=>x.me)+1}. Richest: ${board[0].name}.`);
    }
    document.getElementById('ag-final-board').innerHTML = board.map((x,i)=>
      `<div class="ag-final-row${x.me?' me':''}"><span class="ag-final-pos">${i+1}</span><span class="ag-final-name">${x.name}${i===0?' 🏆':''}</span><span class="ag-final-d">${x.drach}</span></div>`
    ).join('');
  }

  /* ───────── art ───────── */
  function gavelSVG(cls){ return `<svg class="${cls}" viewBox="0 0 130 120" fill="none">
    <defs><linearGradient id="ag-g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E3C766"/><stop offset="1" stop-color="#8E7322"/></linearGradient>
    <linearGradient id="ag-g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A4226"/><stop offset="1" stop-color="#2E2113"/></linearGradient></defs>
    <!-- gavel head -->
    <g transform="rotate(-28 64 50)">
      <rect x="40" y="34" width="48" height="30" rx="6" fill="url(#ag-g1)" stroke="#6E5A1E" stroke-width="2"/>
      <rect x="44" y="30" width="8" height="38" rx="2" fill="#B7972F"/>
      <rect x="76" y="30" width="8" height="38" rx="2" fill="#B7972F"/>
      <rect x="60" y="62" width="8" height="44" rx="4" fill="url(#ag-g2)" stroke="#2E2113" stroke-width="1.5"/>
    </g>
    <!-- sound block -->
    <rect x="30" y="98" width="70" height="12" rx="3" fill="url(#ag-g2)" stroke="#2E2113" stroke-width="1.5"/>
  </svg>`; }

  return { open, close, _start, _next, syncLang };
})();
window.Agora = Agora;

/* ── Games-Panel entry points ── */
window.openAgora  = function(gp){ Agora.open(gp || {}); };
window.closeAgora = function(){ Agora.close(); };
