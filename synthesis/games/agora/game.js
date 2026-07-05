/* ══════════════════ ΑΓΟΡΑ — engine ══════════════════
   Auction reimagined as the bidding floor of the ancient Agora.
   Each round a treasure is cried; bid your drachmas against rival
   merchants for the right to answer. Win the lot and answer truly to
   claim its worth — bid rashly and your purse runs dry. Richest wins.

   Visual layer: "Νυχτερινή δημοπρασία στη Στοά" — a lamplit auction
   hall. Treasures rise on a marble pedestal under a warm spotlight,
   rival merchants bark their bids with personality, the gavel slams a
   ΠΩΛΗΘΗΚΕ stamp onto the lot, and drachmas fly to the purse.
   All procedural (SVG / CSS / WebAudio) — gameplay logic untouched.
   API:  Agora.open()   Agora.close()
═══════════════════════════════════════════════════════════════════ */
const Agora = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);
  const REDUCE = (() => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } })();

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

  /* rival merchant personalities — colours, epithets, bark lines (display only) */
  const RIV_META = {
    'ΚΡΟΙΣΟΣ': {
      c:'#E3C766', ini:'Κ',
      ep:{ gr:'ο αχόρταγος', en:'the Insatiable' },
      win:[
        { gr:'Το χρυσάφι τραβά χρυσάφι!',        en:'Gold draws gold!' },
        { gr:'Δικό μου — όπως όλα, κάποτε.',      en:'Mine — as all things shall be.' },
        { gr:'Πληρώνω χωρίς να μετρώ.',           en:'I pay without counting.' },
      ],
      grr:[
        { gr:'Χμ. Ψίχουλα, έτσι κι αλλιώς.',      en:'Hmph. Crumbs anyway.' },
        { gr:'Θα το ξαναγοράσω από σένα.',        en:'I shall buy it back from you.' },
      ],
    },
    'ΤΡΙΜΑΛΧΙΩΝ': {
      c:'#E59A7E', ini:'Τ',
      ep:{ gr:'ο επιδεικτικός', en:'the Extravagant' },
      win:[
        { gr:'Στο τραπέζι μου θα λάμπει!',        en:'It shall gleam upon my table!' },
        { gr:'Κι άλλο στολίδι για μένα!',          en:'Another jewel for me!' },
        { gr:'Οι καλεσμένοι μου θα ζηλέψουν.',    en:'My guests will burn with envy.' },
      ],
      grr:[
        { gr:'Ανήκουστο! Εγώ ήθελα να το δείξω!', en:'Outrageous! I meant to flaunt that!' },
        { gr:'Πφφ. Δεν ταίριαζε στην έπαυλή μου.', en:'Pff. It clashed with my villa anyway.' },
      ],
    },
    'ΑΣΠΑΣΙΑ': {
      c:'#7FB0BC', ini:'Α',
      ep:{ gr:'η διορατική', en:'the Discerning' },
      win:[
        { gr:'Η γνώση διαλέγει σοφά.',            en:'Knowledge chooses wisely.' },
        { gr:'Στην ακρίβεια κρύβεται η τέχνη.',    en:'In precision lies the art.' },
        { gr:'Μια δίκαιη τιμή, τίποτε παραπάνω.',  en:'A fair price, not a coin more.' },
      ],
      grr:[
        { gr:'Καλή προσφορά. Το ομολογώ.',        en:'A fair bid. I confess it.' },
        { gr:'Ας δούμε αν αξίζεις τον θησαυρό…',  en:'Let us see if you deserve it…' },
      ],
    },
  };

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
  let _escBound = false;

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('ag:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── tiny WebAudio synth (lazy, gesture-gated, always guarded) ───────── */
  const SFX = (() => {
    let ctx = null, master = null;
    const AC = window.AudioContext || window.webkitAudioContext;
    function ac() {
      if (!AC) return null;
      try {
        if (!ctx) { ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination); }
        if (ctx.state === 'suspended') ctx.resume();
        return ctx;
      } catch (_) { return null; }
    }
    function tone(f, o) {
      o = o || {};
      const c = ac(); if (!c) return;
      const osc = c.createOscillator(), g = c.createGain();
      const now = c.currentTime + (o.t || 0), d = o.d || 0.18;
      osc.type = o.type || 'sine';
      osc.frequency.setValueAtTime(f, now);
      if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), now + d);
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(o.g || 0.05, now + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + d);
      osc.connect(g); g.connect(master);
      osc.start(now); osc.stop(now + d + 0.03);
    }
    function noise(d, o) {
      o = o || {};
      const c = ac(); if (!c) return;
      d = d || 0.1;
      const n = Math.max(1, Math.floor(c.sampleRate * d));
      const buf = c.createBuffer(1, n, c.sampleRate), ch = buf.getChannelData(0);
      for (let i = 0; i < n; i++) ch[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = c.createBufferSource(); src.buffer = buf;
      const flt = c.createBiquadFilter(); flt.type = o.type || 'bandpass'; flt.frequency.value = o.f || 900; flt.Q.value = o.q || 1;
      const g = c.createGain(); const now = c.currentTime + (o.t || 0);
      g.gain.setValueAtTime(o.g || 0.06, now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + d);
      src.connect(flt); flt.connect(g); g.connect(master);
      src.start(now);
    }
    return {
      tap()    { tone(440, {type:'triangle', d:.05, g:.025}); noise(.03, {g:.015, f:2600}); },
      paddle() { tone(330, {type:'triangle', d:.08, g:.03}); tone(495, {t:.05, type:'triangle', d:.09, g:.025}); },
      gavel()  { noise(.09, {g:.13, f:230, q:.7, type:'lowpass'}); tone(92, {type:'sine', d:.22, g:.11, to:50}); noise(.05, {t:.012, g:.05, f:1700}); },
      knock()  { noise(.06, {g:.06, f:340, type:'lowpass'}); tone(140, {d:.12, g:.04, to:88}); },
      coin(i)  { i = i || 0; tone(1568, {t:i*.07, d:.13, g:.04}); tone(2093, {t:i*.07+.02, d:.15, g:.03}); },
      coins(n) { n = n || 3; for (let i = 0; i < n; i++) this.coin(i); },
      wrong()  { tone(220, {type:'sawtooth', d:.26, g:.04, to:110}); tone(233, {type:'sawtooth', d:.26, g:.03, to:116}); },
      win()    { [523,659,784,1047].forEach((f,i)=>tone(f,{t:i*.12, type:'triangle', d:.3, g:.045})); this.coins(4); },
      lose()   { [392,330,262].forEach((f,i)=>tone(f,{t:i*.15, type:'triangle', d:.3, g:.035})); },
    };
  })();
  function sfx(name){ try { const f = SFX[name]; if (f) f.apply(SFX, [].slice.call(arguments, 1)); } catch (_) {} }

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
        '<button class="overlay-back" onclick="closeAgora()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΑΓΟΡΑ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
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
    if (!_escBound) {
      _escBound = true;
      document.addEventListener('keydown', (e)=>{
        if (e.key !== 'Escape') return;
        const o = document.getElementById('ag-overlay');
        if (o && o.classList.contains('active')) { try { window.closeAgora(); } catch (_) { close(); } }
      });
    }
  }

  /* ───────── build ───────── */
  function build() {
    document.getElementById('ag-wrap').innerHTML = `
${ambientHTML()}
<!-- INTRO -->
<div id="ag-screen-intro" class="ag-screen">
  <div class="ag-kicker" data-i18n="kicker"></div>
  <div class="ag-hero">${gavelSVG('ag-gavel')}</div>
  <div class="ag-logo">ΑΓΟΡΑ</div>
  <div class="ag-logo-en" data-i18n="subtitle"></div>
  ${meanderSVG('ag-meander')}
  <div class="ag-intro-txt" data-i18n="intro"></div>
  <div class="ag-rivals-lbl" data-i18n="rivalsLbl"></div>
  <div class="ag-rivals">${RIVALS.map((n,i)=>{
    const m=RIV_META[n];
    return `<div class="ag-rival" style="--c:${m.c}">
      <span class="ag-rival-seal">${m.ini}</span>
      <span class="ag-rival-name">${n}</span>
      <span class="ag-rival-ep" data-i18n="ep${i+1}"></span>
    </div>`;
  }).join('')}</div>
  <div class="ag-steps">
    <div class="ag-step"><span class="ag-step-n">Ι</span><b data-i18n="st1"></b><span data-i18n="st1d"></span></div>
    <div class="ag-step"><span class="ag-step-n">ΙΙ</span><b data-i18n="st2"></b><span data-i18n="st2d"></span></div>
    <div class="ag-step"><span class="ag-step-n">ΙΙΙ</span><b data-i18n="st3"></b><span data-i18n="st3d"></span></div>
  </div>
  <button class="sym-btn ag-cta" onclick="Agora._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="ag-screen-game" class="ag-screen">
  <div class="ag-top">
    <div class="ag-purse" id="ag-purse-box">
      ${coinSVG('ag-purse-coin')}
      <span class="ag-purse-lbl" data-i18n="purse"></span>
      <span class="ag-purse-val" id="ag-purse">0</span>
      <span class="ag-purse-unit" data-i18n="unit"></span>
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
    spawnMotes();
  }

  const I18N = {
    kicker:  { gr:'ΝΥΧΤΕΡΙΝΗ ΔΗΜΟΠΡΑΣΙΑ ΣΤΗ ΣΤΟΑ', en:'A NIGHT AUCTION AT THE STOA' },
    subtitle:{ gr:'Το σφυρί της Αγοράς', en:'The Auction Floor' },
    intro:   { gr:'Στην <b>Αγορά</b>, κάθε γύρο κηρύσσεται ένας θησαυρός. <b>Πλειοδότησε</b> με δραχμές ενάντια στους εμπόρους για το δικαίωμα της απάντησης. Κέρδισε τον θησαυρό και απάντησε σωστά για να πάρεις την αξία του — μα μη σπαταλήσεις το πουγκί σου. Ο πλουσιότερος νικά.', en:'In the <b>Agora</b>, each round a treasure is cried. <b>Bid</b> your drachmas against rival merchants for the right to answer. Win the lot and answer truly to claim its worth — but don’t empty your purse. The richest wins.' },
    rivalsLbl:{ gr:'ΟΙ ΑΝΤΙΠΑΛΟΙ ΕΜΠΟΡΟΙ', en:'THE RIVAL MERCHANTS' },
    ep1:     { gr:'ο αχόρταγος', en:'the Insatiable' },
    ep2:     { gr:'ο επιδεικτικός', en:'the Extravagant' },
    ep3:     { gr:'η διορατική', en:'the Discerning' },
    st1:     { gr:'ΠΛΕΙΟΔΟΤΗΣΕ', en:'BID' },
    st1d:    { gr:'για το δικαίωμα απάντησης', en:'for the right to answer' },
    st2:     { gr:'ΑΠΑΝΤΗΣΕ', en:'ANSWER' },
    st2d:    { gr:'σωστά και πάρε την αξία', en:'truly and claim the worth' },
    st3:     { gr:'ΠΛΟΥΤΙΣΕ', en:'PROSPER' },
    st3d:    { gr:'πριν πέσει το σφυρί', en:'before the gavel falls' },
    begin:   { gr:'ΣΤΟ ΣΦΥΡΙ', en:'TO THE BLOCK' },
    purse:   { gr:'ΠΟΥΓΚΙ', en:'PURSE' },
    unit:    { gr:'δρ.', en:'dr.' },
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
    sfx('paddle');
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

  /* number count-up (skips under reduced motion) */
  function tweenNum(el, to, ms) {
    if (!el) return;
    const from = el.dataset.v != null ? (parseInt(el.dataset.v, 10) || 0) : null;
    el.dataset.v = to;
    if (from == null || REDUCE || Math.abs(to - from) < 2) { el.textContent = to; return; }
    const t0 = performance.now(), dur = ms || 650;
    requestAnimationFrame(function loop(now){
      if (el.dataset.v != String(to)) return; /* superseded by a newer tween */
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (to - from) * e);
      if (t < 1) requestAnimationFrame(loop); else el.textContent = to;
    });
  }

  function renderTop() {
    tweenNum(document.getElementById('ag-purse'), st.drach);
    const box = document.getElementById('ag-purse-box');
    if (box) box.classList.toggle('low', st.drach < 100);
    const r = document.getElementById('ag-round');
    if (r) {
      let pips = '';
      for (let i = 1; i <= ROUNDS; i++) pips += `<i class="${i < st.round ? 'done' : i === st.round ? 'now' : ''}"></i>`;
      r.innerHTML = `<span class="ag-round-lbl">${T('ΛΟΤ','LOT')} ${st.round}<em>/</em>${ROUNDS}</span><span class="ag-pips">${pips}</span>`;
    }
  }
  function pulsePurse(up) {
    const el=document.getElementById('ag-purse'); if(!el) return;
    if (window.gsap && !REDUCE) gsap.fromTo(el, {scale:1.4}, {scale:1, duration:.55, ease:'back.out(2.6)'});
    el.style.color = up? '#9DBE84' : '#E08577';
    setTimeout(()=>{ el.style.color=''; }, 700);
  }
  function renderBoard() {
    if(window.SymStandings) SymStandings.feed('ag', standings(), {key:'drach', unit:'δρ', accent:'var(--sym-gold)', title:'ΑΓΟΡΑ'});
    st._pb = st._pb || {};
    document.getElementById('ag-board').innerHTML = standings().map((x,i)=>{
      const m = RIV_META[x.name];
      const prev = st._pb[x.name];
      const delta = (prev != null && prev !== x.drach) ? x.drach - prev : 0;
      st._pb[x.name] = x.drach;
      return `<div class="ag-board-chip${x.me?' me':''}${i===0?' lead':''}" style="--c:${x.me?'#E3C766':(m?m.c:'#867660')}">
        <span class="ag-board-dot"></span>
        <span class="ag-board-rank">${i+1}</span>
        <span class="ag-board-name">${x.name}</span>
        <span class="ag-board-d${delta>0?' up':delta<0?' dn':''}">${x.drach}</span>
        ${delta ? `<span class="ag-board-delta ${delta>0?'up':'dn'}">${delta>0?'+':''}${delta}</span>` : ''}
      </div>`;
    }).join('');
  }
  function renderLot() {
    const lot=st.lot;
    const el=document.getElementById('ag-lot');
    el.innerHTML =
      `<div class="ag-lot-stage">
         <span class="ag-lot-lamp">${lampSVG()}</span>
         <div class="ag-spot"></div>
         <div class="ag-lot-item"><span class="ag-lot-ic">${lot.ic}</span></div>
         ${pedestalSVG()}
       </div>
       <div class="ag-lot-info">
         <div class="ag-lot-no">${T('ΛΟΤ','LOT')} ${romal(st.round)}</div>
         <div class="ag-lot-name">${lot[L()]}</div>
         <div class="ag-lot-val">${coinSVG('ag-val-coin')} ${T('ΑΞΙΑ','WORTH')} <b>${lot.v}</b> <span>${T('δραχμές','drachmas')}</span></div>
       </div>`;
    el.classList.remove('in');
    void el.offsetWidth;
    el.classList.add('in');
  }
  function romal(n){ const R=['','Ι','ΙΙ','ΙΙΙ','ΙV','V','VΙ','VΙΙ','VΙΙΙ','ΙΧ','Χ']; return R[n]||n; }

  /* ───────── round ───────── */
  function newRound() {
    if (st.round>=ROUNDS) return end();
    st.round++; st.phase='bid'; st.lot=getLot(); st.bid=0; st.grumble=null;
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
    const PIPS={pass:0, low:1, fair:2, bold:3};
    document.getElementById('ag-phase').innerHTML =
      `<div class="ag-bid-head">${T('Η ΠΡΟΣΦΟΡΑ ΣΟΥ','YOUR BID')}</div>
       <div class="ag-bid-hint">${T('Σήκωσε μια πινακίδα — ο πλειοδότης απαντά','Raise a paddle — the highest bidder answers')}</div>
       <div class="ag-bid-opts">${opts.map((o,i)=>`<button class="ag-bid-btn ${o.tone}" data-i="${i}">
          <span class="ag-bid-lbl">${o.lbl}</span>
          <span class="ag-bid-amt">${o.amt||'—'}</span>
          <span class="ag-bid-pips">${'<i></i>'.repeat(PIPS[o.tone]||0)}</span>
        </button>`).join('')}</div>`;
    const btns=document.querySelectorAll('#ag-phase .ag-bid-btn');
    btns.forEach((b,i)=>{ b.onclick=()=>placeBid(opts[i].amt, btns, b); });
  }

  function placeBid(amt, btns, chosenBtn) {
    if (st.phase!=='bid') return; st.phase='bidding';
    sfx('paddle');
    btns && btns.forEach(b=>{
      b.disabled=true;
      b.classList.add(b===chosenBtn ? 'raised' : 'dim');
    });
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

    // show bids — staggered reveal chips (YOU first, then each rival)
    const fb=document.getElementById('ag-feedback');
    const chips=[{name:T('ΕΣΥ','YOU'), me:true, bid:amt}, ...st.rivalBids.map(x=>({name:x.r.name, bid:x.bid}))];
    fb.innerHTML = `<div class="ag-bids-row">${chips.map((c,i)=>{
      const m=RIV_META[c.name];
      return `<div class="ag-bidchip${c.me?' me':''}${c.bid?'':' pass'}" style="--d:${(i*0.18).toFixed(2)}s; --c:${c.me?'#E3C766':(m?m.c:'#867660')}">
        <span class="ag-bidchip-name">${c.name}</span>
        <span class="ag-bidchip-amt">${c.bid ? c.bid+' '+T('δρ.','dr.') : T('πάσο','pass')}</span>
      </div>`;
    }).join('')}</div>`;
    fb.className='ag-feedback ag-fb-hint';

    setTimeout(()=>{
      if (winner.none) {
        st.phase='resolve';
        markChips(-1);
        soldStamp('none'); sfx('knock');
        document.getElementById('ag-phase').innerHTML =
          `<div class="ag-resolve"><div class="ag-resolve-txt">${T('Κανείς δεν πλειοδότησε. Ο θησαυρός αποσύρεται.','No one bid. The treasure is withdrawn.')}</div></div>
           <button class="sym-btn ag-cont" onclick="Agora._next()">${st.round>=ROUNDS?T('ΑΠΟΤΕΛΕΣΜΑ','RESULT'):T('ΕΠΟΜΕΝΟ ΛΟΤ','NEXT LOT')} ›</button>`;
      } else if (winner.me) {
        st.phase='answer';
        markChips(0);
        gavelHit('sold');
        // a beaten rival grumbles (display only)
        let top=null; st.rivalBids.forEach(x=>{ if(x.bid>0 && (!top || x.bid>top.bid)) top=x; });
        st.grumble = top ? { name:top.r.name, gi:(Math.random()*RIV_META[top.r.name].grr.length)|0 } : null;
        setTimeout(renderQuestion, REDUCE ? 0 : 620);
        _fx('win-bid');
      } else {
        markChips(1 + st.rivalBids.findIndex(x=>x.r===winner.r));
        gavelHit('rival', winner.r);
        rivalWins(winner.r, winner.bid);
      }
    }, 1100);
  }

  function markChips(winIdx) {
    document.querySelectorAll('#ag-feedback .ag-bidchip').forEach((c,i)=>{
      c.classList.add(i===winIdx ? 'won' : 'out');
    });
  }

  /* gavel slam set-piece: stamp over the lot + shake + dust + thock */
  function gavelHit(kind, r) {
    soldStamp(kind, r);
    sfx('gavel');
    const lot=document.getElementById('ag-lot');
    if (lot) {
      lot.classList.remove('slam'); void lot.offsetWidth; lot.classList.add('slam');
      if (window.SymFX) {
        try {
          SymFX.shake(7, .4, lot);
          const rct=lot.getBoundingClientRect();
          SymFX.burst(rct.left+rct.width*0.28, rct.top+rct.height*0.82, {colors:['#C8B08A','#8A7458','#5A4E3C'], count:10, power:5, up:0.2, life:620});
        } catch(_){}
      }
    }
  }
  function soldStamp(kind, r) {
    const lot=document.getElementById('ag-lot'); if(!lot) return;
    const old=lot.querySelector('.ag-stamp'); if(old) old.remove();
    const s=document.createElement('div');
    s.className='ag-stamp '+(kind||'sold');
    if (kind==='rival' && r) { const m=RIV_META[r.name]; if(m) s.style.setProperty('--c', m.c); }
    s.textContent = kind==='none' ? T('ΑΠΟΣΥΡΘΗΚΕ','WITHDRAWN') : T('ΠΩΛΗΘΗΚΕ!','SOLD!');
    lot.appendChild(s);
  }

  function rivalWins(r, bid) {
    st.phase='resolve';
    const correct = Math.random()<0.6;
    if (correct) r.drach += st.lot.v; else r.drach = Math.max(0, r.drach - bid);
    renderBoard();
    const m=RIV_META[r.name];
    const qp=m ? m.win[(Math.random()*m.win.length)|0] : null;
    document.getElementById('ag-phase').innerHTML =
      `<div class="ag-resolve">
         <div class="ag-resolve-txt">${T(`Ο/Η <b>${r.name}</b> πήρε τον θησαυρό για ${bid} δρ. `,`<b>${r.name}</b> took the lot for ${bid} dr. `)}${correct?T('και απάντησε σωστά.','and answered truly.'):T('μα απάντησε λάθος.','but answered falsely.')}</div>
         ${qp?`<div class="ag-quip" style="--c:${m.c}"><span class="ag-quip-seal">${m.ini}</span>«${qp[L()]}»</div>`:''}
       </div>
       <button class="sym-btn ag-cont" onclick="Agora._next()">${st.round>=ROUNDS?T('ΑΠΟΤΕΛΕΣΜΑ','RESULT'):T('ΕΠΟΜΕΝΟ ΛΟΤ','NEXT LOT')} ›</button>`;
  }

  function renderQuestion() {
    st.cur = st.cur || getQ();
    const keys=['Α','Β','Γ','Δ'];
    const g = st.grumble, gm = g && RIV_META[g.name];
    const quip = gm ? gm.grr[g.gi] : null;
    document.getElementById('ag-phase').innerHTML =
      `<div class="ag-won-tag">${T('ΚΕΡΔΙΣΕΣ ΤΟ ΛΟΤ — ΑΠΑΝΤΗΣΕ','YOU WON THE LOT — ANSWER')}</div>
       ${quip?`<div class="ag-grumble" style="--c:${gm.c}"><span class="ag-quip-seal">${gm.ini}</span><b>${g.name}</b>&nbsp;«${quip[L()]}»</div>`:''}
       <div class="ag-q-card"><div class="ag-q-text">${QT(st.cur.q)}</div></div>
       <div class="ag-answers">${st.cur.a.map((opt,i)=>`<button class="ag-ans" data-i="${i}" style="--d:${(i*0.07).toFixed(2)}s"><span class="ag-ans-key">${keys[i]}</span><span>${opt}</span></button>`).join('')}</div>`;
    const btns=document.querySelectorAll('#ag-phase .ag-ans');
    btns.forEach((b,i)=>{ b.onclick=()=>answerLot(i, btns); });
  }

  /* coins fly between two elements, then the target pops */
  function coinFly(fromEl, toEl, n) {
    if (!fromEl || !toEl) return;
    if (REDUCE) { if (window.SymFX) try{ SymFX.pop(toEl); }catch(_){} return; }
    const a=fromEl.getBoundingClientRect(), b=toEl.getBoundingClientRect();
    const x0=a.left+a.width/2, y0=a.top+a.height/2;
    const x1=b.left+b.width/2, y1=b.top+b.height/2;
    for (let i=0;i<n;i++) {
      const c=document.createElement('div');
      c.className='ag-coinfly'; c.textContent='Δ';
      const jx=(Math.random()-0.5)*36, jy=(Math.random()-0.5)*20;
      c.style.left=(x0+jx)+'px'; c.style.top=(y0+jy)+'px';
      document.body.appendChild(c);
      const dx=x1-(x0+jx), dy=y1-(y0+jy);
      const lift=-(46+Math.random()*60);
      const dur=520+i*55+Math.random()*90;
      try {
        const anim=c.animate([
          { transform:'translate(0,0) scale(1)', opacity:1 },
          { transform:`translate(${dx*0.45}px,${dy*0.45+lift}px) scale(1.08)`, opacity:1, offset:0.55 },
          { transform:`translate(${dx}px,${dy}px) scale(0.5)`, opacity:0.9 },
        ], { duration:dur, delay:i*40, easing:'cubic-bezier(.3,.6,.35,1)', fill:'backwards' });
        anim.onfinish=()=>{ c.remove(); if(i===n-1 && window.SymFX) try{ SymFX.pop(toEl); }catch(_){} };
      } catch(_) { setTimeout(()=>c.remove(), dur+i*40+60); }
      setTimeout(()=>{ if(c.parentNode) c.remove(); }, dur+i*40+400);
    }
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
      sfx('coins', 4);
      const lot=document.getElementById('ag-lot'), purse=document.getElementById('ag-purse-box');
      coinFly(lot, purse, 6);
      if (window.SymFX) {
        SymFX.burst(window.innerWidth/2, window.innerHeight*0.4, {emoji:['🪙','✦'], count:16, power:11, up:0.5, life:1200});
        try {
          const pr=purse.getBoundingClientRect();
          SymFX.combo('+'+st.lot.v, pr.left+pr.width/2, pr.top+pr.height+26, {size:30, color:'#E3C766', rise:60});
        } catch(_){}
      }
    } else {
      btns[chosen].classList.add('wrong'); _fx('wrong',{el:btns[chosen]});
      if (window.symLogMistake) { try { window.symLogMistake({ q: QT(st.cur.q), wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Αγορά', gameId: 'agora' }); } catch (_) {} }
      st.drach = Math.max(0, st.drach - st.bid); pulsePurse(false);
      msg=T(`ΛΑΘΟΣ — έχασες την προσφορά σου (${st.bid} δρ.)`,`WRONG — you forfeit your bid (${st.bid} dr.)`);
      fb.className='ag-feedback ag-fb-bad';
      sfx('wrong');
      const lot=document.getElementById('ag-lot'), purse=document.getElementById('ag-purse-box');
      if (st.bid>0) coinFly(purse, lot, 4);
      if (window.SymFX) {
        try {
          SymFX.shake(6, .35, document.querySelector('#ag-phase .ag-q-card'));
          if (st.bid>0) { const pr=purse.getBoundingClientRect(); SymFX.combo('-'+st.bid, pr.left+pr.width/2, pr.top+pr.height+26, {size:26, color:'#E08577', rise:52}); }
        } catch(_){}
      }
    }
    fb.innerHTML = `<span class="ag-verdict ${chosen===st.cur.c?'ok':'bad'}">${chosen===st.cur.c?'✓':'✗'} ${msg}</span>`;
    renderTop(); renderBoard();
    document.getElementById('ag-phase').insertAdjacentHTML('beforeend',
      `<button class="sym-btn ag-cont" onclick="Agora._next()">${st.round>=ROUNDS?T('ΑΠΟΤΕΛΕΣΜΑ','RESULT'):T('ΕΠΟΜΕΝΟ ΛΟΤ','NEXT LOT')} ›</button>`);
    try { fb.scrollIntoView({ block:'nearest', behavior: REDUCE ? 'auto' : 'smooth' }); } catch(_) {}
  }

  function _next() { st.cur=null; sfx('tap'); newRound(); }

  /* ───────── end ───────── */
  function end() {
    show('ag-screen-end');
    const board = standings();
    const won = board[0].me;
    _fx(won?'win':'lose');
    document.getElementById('ag-end-art').innerHTML = won ? laurelGavelSVG('ag-end-gavel') : gavelSVG('ag-end-gavel rest');
    const title=document.getElementById('ag-end-title'), sub=document.getElementById('ag-end-sub');
    if (won) {
      title.textContent=T('ΑΡΧΕΜΠΟΡΟΣ','MASTER MERCHANT'); title.className='ag-end-title win';
      sub.textContent=T('Έκλεισες με το βαρύτερο πουγκί της Αγοράς. Έμπορος ανάμεσα στους εμπόρους.','You closed with the heaviest purse in the Agora. A merchant among merchants.');
      sfx('win');
      coinRain();
      if (window.SymFX) try{ SymFX.burst(window.innerWidth/2, window.innerHeight*0.34, {emoji:['🪙','✦','🏺'], count:22, power:12, up:0.5, life:1400}); }catch(_){}
    } else {
      title.textContent=T('ΤΟ ΣΦΥΡΙ ΕΠΕΣΕ','THE GAVEL FALLS'); title.className='ag-end-title lose';
      sub.textContent=T(`Τελείωσες με ${st.drach} δρ., στη ${board.findIndex(x=>x.me)+1}η θέση. Πλουσιότερος: ${board[0].name}.`,`You finished with ${st.drach} dr., in position ${board.findIndex(x=>x.me)+1}. Richest: ${board[0].name}.`);
      sfx('lose');
    }
    document.getElementById('ag-final-board').innerHTML = board.map((x,i)=>
      `<div class="ag-final-row${x.me?' me':''} p${i+1}" style="--d:${(0.12+i*0.12).toFixed(2)}s"><span class="ag-final-pos">${i+1}</span><span class="ag-final-name">${x.name}${i===0?' 🏆':''}</span><span class="ag-final-d">${x.drach}</span></div>`
    ).join('');
  }

  function coinRain(n) {
    if (REDUCE) return;
    const wrap=document.getElementById('ag-wrap'); if(!wrap) return;
    n = n || 20;
    for (let i=0;i<n;i++) {
      const c=document.createElement('div');
      c.className='ag-raincoin'; c.textContent='Δ';
      c.style.left=(3+Math.random()*94)+'%';
      const sz=(11+Math.random()*10)|0; c.style.width=c.style.height=sz+'px'; c.style.fontSize=Math.round(sz*0.6)+'px';
      wrap.appendChild(c);
      const dur=1500+Math.random()*1300, delay=Math.random()*900;
      try {
        const anim=c.animate([
          { transform:'translateY(-8vh) rotate(0deg)', opacity:0 },
          { transform:'translateY(6vh) rotate('+((Math.random()*280-140)|0)+'deg)', opacity:1, offset:0.12 },
          { transform:'translateY(108vh) rotate('+((Math.random()*720-360)|0)+'deg)', opacity:0.9 },
        ], { duration:dur, delay, easing:'cubic-bezier(.42,.1,.72,.9)', fill:'backwards' });
        anim.onfinish=()=>c.remove();
      } catch(_) { setTimeout(()=>c.remove(), dur+delay+80); }
      setTimeout(()=>{ if(c.parentNode) c.remove(); }, dur+delay+300);
    }
  }

  /* ───────── ambient scene (built once inside #ag-wrap) ───────── */
  function ambientHTML() {
    return `<div class="ag-ambient" aria-hidden="true">
      <div class="ag-halo"></div>
      ${stoaSVG()}
      <div class="ag-lamp l">${lampSVG()}</div>
      <div class="ag-lamp r">${lampSVG()}</div>
      <div class="ag-motes" id="ag-motes"></div>
      <div class="ag-vign"></div>
    </div>`;
  }
  function spawnMotes() {
    const host=document.getElementById('ag-motes');
    if (!host || REDUCE) return;
    let html='';
    for (let i=0;i<24;i++) {
      const sz=(2+Math.random()*3).toFixed(1);
      html += `<i style="left:${(Math.random()*100).toFixed(1)}%; width:${sz}px; height:${sz}px; --dr:${((Math.random()-0.5)*90)|0}px; animation-duration:${(9+Math.random()*13).toFixed(1)}s; animation-delay:${(-Math.random()*20).toFixed(1)}s;"></i>`;
    }
    host.innerHTML=html;
  }

  /* ───────── art ───────── */
  function gavelSVG(cls){ return `<svg class="${cls}" viewBox="0 0 150 130" fill="none">
    <defs>
      <linearGradient id="ag-g1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1D98A"/><stop offset=".5" stop-color="#C4A448"/><stop offset="1" stop-color="#8E7322"/></linearGradient>
      <linearGradient id="ag-g2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E5230"/><stop offset="1" stop-color="#2E2113"/></linearGradient>
      <linearGradient id="ag-g3" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A2A18"/><stop offset="1" stop-color="#1C1208"/></linearGradient>
      <radialGradient id="ag-g4" cx=".5" cy=".4" r=".65"><stop offset="0" stop-color="#F7E7A8"/><stop offset=".55" stop-color="#E3C766"/><stop offset="1" stop-color="#8E7322"/></radialGradient>
    </defs>
    <ellipse class="gv-shadow" cx="76" cy="121" rx="52" ry="6" fill="#000" opacity="0.4"/>
    <g class="gv-swing">
      <g transform="rotate(-30 78 52)">
        <rect x="70" y="60" width="9" height="52" rx="4" fill="url(#ag-g2)" stroke="#1C1208" stroke-width="1.5"/>
        <rect x="48" y="34" width="56" height="32" rx="7" fill="url(#ag-g1)" stroke="#6E5A1E" stroke-width="2"/>
        <rect x="52" y="30" width="9" height="40" rx="2.5" fill="#B7972F" stroke="#6E5A1E" stroke-width="1"/>
        <rect x="91" y="30" width="9" height="40" rx="2.5" fill="#B7972F" stroke="#6E5A1E" stroke-width="1"/>
        <rect x="66" y="38" width="20" height="4" rx="2" fill="#F7E7A8" opacity="0.55"/>
      </g>
      <path class="gv-arc" d="M34 30 A52 52 0 0 1 66 12" stroke="#E3C766" stroke-width="2" stroke-linecap="round" opacity="0.4" fill="none"/>
      <path class="gv-arc a2" d="M26 44 A62 62 0 0 1 52 16" stroke="#E3C766" stroke-width="1.4" stroke-linecap="round" opacity="0.22" fill="none"/>
    </g>
    <ellipse class="gv-dust" cx="52" cy="106" rx="17" ry="4" fill="#C8B08A" opacity="0"/>
    <g>
      <rect x="34" y="104" width="82" height="11" rx="3" fill="url(#ag-g3)" stroke="#1C1208" stroke-width="1.5"/>
      <rect x="42" y="97" width="34" height="9" rx="2.5" fill="url(#ag-g2)" stroke="#1C1208" stroke-width="1.5"/>
      <circle cx="126" cy="102" r="8" fill="url(#ag-g4)" stroke="#6E5A1E" stroke-width="1.4"/>
      <text x="126" y="105.5" text-anchor="middle" font-size="9" font-family="Georgia, serif" fill="#5C4A14" font-weight="bold">Δ</text>
    </g>
  </svg>`; }

  function laurelGavelSVG(cls){
    let leaves='';
    for (let i=0;i<9;i++) {
      const t=i/8, ang=200-t*145;
      const rad=56, cx=75+Math.cos(ang*Math.PI/180)*rad, cy=74-Math.sin(ang*Math.PI/180)*rad*0.94;
      const rot=-ang+90;
      leaves += `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="3.4" ry="9" fill="url(#ag-lg)" transform="rotate(${rot.toFixed(0)} ${cx.toFixed(1)} ${cy.toFixed(1)})" opacity="${(0.65+t*0.35).toFixed(2)}"/>`;
      const ang2=-20+t*145;
      const cx2=75+Math.cos(ang2*Math.PI/180)*rad, cy2=74-Math.sin(ang2*Math.PI/180)*rad*0.94;
      leaves += `<ellipse cx="${cx2.toFixed(1)}" cy="${cy2.toFixed(1)}" rx="3.4" ry="9" fill="url(#ag-lg)" transform="rotate(${(-ang2-90).toFixed(0)} ${cx2.toFixed(1)} ${cy2.toFixed(1)})" opacity="${(0.65+t*0.35).toFixed(2)}"/>`;
    }
    return `<svg class="${cls} laur" viewBox="0 0 150 130" fill="none">
      <defs><linearGradient id="ag-lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B8C47F"/><stop offset="1" stop-color="#6A8752"/></linearGradient></defs>
      <g class="ag-laurel">${leaves}</g>
    </svg>` + gavelSVG(cls);
  }

  function coinSVG(cls){ return `<svg class="${cls||''}" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <defs><radialGradient id="ag-cg" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#F7E7A8"/><stop offset=".55" stop-color="#E3C766"/><stop offset="1" stop-color="#8E7322"/></radialGradient></defs>
    <circle cx="12" cy="12" r="10.4" fill="url(#ag-cg)" stroke="#6E5A1E" stroke-width="1.6"/>
    <circle cx="12" cy="12" r="7.2" fill="none" stroke="#8E7322" stroke-width="0.9" opacity="0.7"/>
    <text x="12" y="16" text-anchor="middle" font-size="10" font-family="Georgia, serif" font-weight="bold" fill="#5C4A14">Δ</text>
  </svg>`; }

  function lampSVG(){ return `<svg viewBox="0 0 40 84" fill="none" aria-hidden="true">
    <path d="M20 0v34" stroke="#5A4E3C" stroke-width="1.6"/>
    <path d="M20 8l-5 5m5-5l5 5" stroke="#5A4E3C" stroke-width="1"/>
    <ellipse cx="20" cy="46" rx="12" ry="7" fill="#3A2A18" stroke="#8E7322" stroke-width="1.4"/>
    <path d="M8 46c0 4 5.4 7 12 7s12-3 12-7" fill="#241A10"/>
    <path class="ag-flame" d="M31 40c2.6-2.6 2.2-6.4 1-8.6-.5 1.7-1.4 2.4-2.5 3.1-1.2.8-2 2.4-1 4.3.6 1.2 1.6 1.5 2.5 1.2z" fill="#F4A23C"/>
    <circle class="ag-flame-core" cx="30.4" cy="37.6" r="1.5" fill="#FFE3A0"/>
  </svg>`; }

  function pedestalSVG(){ return `<svg class="ag-plinth" viewBox="0 0 150 74" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="ag-pm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4038"/><stop offset=".5" stop-color="#332B24"/><stop offset="1" stop-color="#241E18"/></linearGradient>
      <linearGradient id="ag-pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6B5F52"/><stop offset="1" stop-color="#4A4038"/></linearGradient>
    </defs>
    <rect x="30" y="4" width="90" height="9" rx="2" fill="url(#ag-pt)" stroke="#171310" stroke-width="1.2"/>
    <rect x="38" y="13" width="74" height="6" rx="1.5" fill="url(#ag-pm)" stroke="#171310" stroke-width="1"/>
    <path d="M44 19h62l-5 38H49z" fill="url(#ag-pm)" stroke="#171310" stroke-width="1.2"/>
    <path d="M55 22l-3.4 32M75 22v32M95 22l3.4 32" stroke="#171310" stroke-width="1" opacity="0.65"/>
    <path d="M47 22h56" stroke="#8A7A66" stroke-width="1" opacity="0.4"/>
    <rect x="36" y="57" width="78" height="7" rx="1.5" fill="url(#ag-pm)" stroke="#171310" stroke-width="1"/>
    <rect x="28" y="64" width="94" height="9" rx="2" fill="url(#ag-pt)" stroke="#171310" stroke-width="1.2"/>
  </svg>`; }

  function meanderSVG(cls){
    /* clean Greek fret: continuous square-wave key line */
    let d='M2 10';
    for (let i=0;i<8;i++){ d+=' h5.5 v-7 h5.5 v7'; }
    return `<svg class="${cls}" viewBox="0 0 96 13" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid meet"><path d="${d}" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>`;
  }

  function stoaSVG(){
    let cols='';
    for (let i=0;i<9;i++){
      const x=30+i*145;
      cols += `<g>
        <rect x="${x}" y="66" width="34" height="10" fill="#181008"/>
        <rect x="${x+3}" y="76" width="28" height="150" fill="#140D06"/>
        <rect x="${x-2}" y="58" width="38" height="9" rx="2" fill="#1C1309"/>
        <path d="M${x-2} 58h38" stroke="#C4A448" stroke-width="1" opacity="0.16"/>
      </g>`;
    }
    return `<svg class="ag-stoa" viewBox="0 0 1300 230" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <rect x="0" y="34" width="1300" height="14" fill="#1C1309"/>
      <rect x="0" y="48" width="1300" height="10" fill="#181008"/>
      <path d="M0 34h1300" stroke="#C4A448" stroke-width="1.2" opacity="0.2"/>
      ${cols}
      <rect x="0" y="212" width="1300" height="8" fill="#181008"/>
      <rect x="0" y="220" width="1300" height="10" fill="#140D06"/>
    </svg>`;
  }

  return { open, close, _start, _next, syncLang };
})();
window.Agora = Agora;

/* ── Games-Panel entry points ── */
window.openAgora  = function(gp){ Agora.open(gp || {}); };
window.closeAgora = function(){ Agora.close(); };
