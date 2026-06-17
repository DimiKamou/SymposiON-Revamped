/* ══════════════════ ΜΟΙΡΑΙ — engine ══════════════════
   Spin-the-wheel reimagined as the Wheel of the Fates (Clotho, Lachesis,
   Atropos). A correct answer earns a spin: multiply your thread, hit the
   jackpot, or let Atropos cut it. Most thread at the end wins.
   API:  Moirai.open()   Moirai.close()
═══════════════════════════════════════════════════════════════════ */
const Moirai = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.MO_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const ROUNDS = 10;
  const BASE   = 100;
  const RIVALS = ['ΚΛΩΘΩ','ΛΑΧΕΣΙΣ','ΑΤΡΟΠΟΣ'];
  // two 8-sector wheels: boon (correct answer) and curse (wrong answer)
  const WHEELS = {
    boon: [
      { k:'x2',       label:'×2', col:'#C4A448' },
      { k:'x3',       label:'×3', col:'#6A8752' },
      { k:'jack',     label:'🏆', col:'#E3C766' },
      { k:'steal',    label:'💰', col:'#5E8B96' },
      { k:'sabotage', label:'⚔️', col:'#D97B5C' },
      { k:'nothing',  label:'∅',  col:'#5A4E3C' },
      { k:'x3',       label:'×3', col:'#6A8752' },
      { k:'steal',    label:'💰', col:'#5E8B96' },
    ],
    curse: [
      { k:'nothing', label:'∅',  col:'#5A4E3C' },
      { k:'donate',  label:'🎁', col:'#9E3B2E' },
      { k:'lock',    label:'⏳', col:'#5E8B96' },
      { k:'cut',     label:'✂',  col:'#9E3B2E' },
      { k:'nothing', label:'∅',  col:'#5A4E3C' },
      { k:'donate',  label:'🎁', col:'#9E3B2E' },
      { k:'lock',    label:'⏳', col:'#5E8B96' },
      { k:'cut',     label:'✂',  col:'#9E3B2E' },
    ],
  };
  const curSectors = () => WHEELS[st.wheelKind==='curse'?'curse':'boon'];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('mo:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#mo-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('mo-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('mo-screen-intro')) build();
    syncLang();
    show('mo-screen-intro');
  }
  function close() {
    if (st && st.lockTimer){ clearInterval(st.lockTimer); st.lockTimer=null; }
    document.getElementById('mo-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('mo-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'mo-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeMoirai()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u039c\u039f\u0399\u03a1\u0391\u0399') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="mo-wrap"></div></div>';
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
    document.getElementById('mo-wrap').innerHTML = `
<!-- INTRO -->
<div id="mo-screen-intro" class="mo-screen">
  ${spindleSVG('mo-spindle')}
  <div class="mo-logo">ΜΟΙΡΑΙ</div>
  <div class="mo-logo-en" data-i18n="subtitle"></div>
  <div class="mo-intro-txt" data-i18n="intro"></div>
  <button class="sym-btn" onclick="Moirai._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="mo-screen-game" class="mo-screen">
  <div class="mo-top">
    <div class="mo-thread">
      <span class="mo-thread-lbl" data-i18n="thread"></span>
      <span class="mo-thread-val" id="mo-thread">0</span>
    </div>
    <div class="mo-round" id="mo-round"></div>
  </div>
  <div class="mo-board" id="mo-board"></div>
  <div class="mo-qbody">
    <div class="mo-q-card"><div class="mo-q-text" id="mo-qtext"></div></div>
    <div class="mo-answers" id="mo-answers"></div>
    <div class="mo-feedback" id="mo-feedback"></div>
  </div>
</div>

<!-- SPIN -->
<div id="mo-screen-spin" class="mo-screen">
  <div class="mo-spin-head" data-i18n="spinhead"></div>
  <div class="mo-wheel-wrap">
    <div class="mo-pointer">▼</div>
    <div id="mo-wheel-host"></div>
  </div>
  <div class="mo-outcome" id="mo-outcome"></div>
</div>

<!-- END -->
<div id="mo-screen-end" class="mo-screen">
  <div id="mo-end-art"></div>
  <div class="mo-end-title" id="mo-end-title"></div>
  <div class="mo-end-sub" id="mo-end-sub"></div>
  <div class="mo-final-board" id="mo-final-board"></div>
  <div class="mo-end-btns">
    <button class="sym-btn" onclick="Moirai._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Moirai.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    subtitle:{ gr:'Ο τροχός των Μοιρών', en:'The Wheel of the Fates' },
    intro:   { gr:'Η Κλωθώ γνέθει, η Λάχεσις μετρά, η Άτροπος κόβει. Κάθε σωστή απάντηση σου χαρίζει μια <b>περιστροφή</b> — πολλαπλασίασε το νήμα σου, χτύπα το <b>τζάκποτ</b> (★)… ή άσε την <b>Άτροπο</b> (✂) να το κόψει.', en:'Clotho spins, Lachesis measures, Atropos cuts. Each correct answer grants a <b>spin</b> — multiply your thread, hit the <b>jackpot</b> (★)… or let <b>Atropos</b> (✂) sever it.' },
    begin:   { gr:'ΓΝΕΣΕ ΤΟ ΝΗΜΑ', en:'SPIN THE THREAD' },
    thread:  { gr:'ΝΗΜΑ', en:'THREAD' },
    spinhead:{ gr:'ΓΥΡΙΣΕ ΤΟΝ ΤΡΟΧΟ ΤΗΣ ΜΟΙΡΑΣ', en:'TURN THE WHEEL OF FATE' },
    again:   { gr:'ΝΕΟ ΝΗΜΑ', en:'NEW THREAD' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#mo-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('mo-screen-game').classList.contains('active')) {
      document.getElementById('mo-qtext').textContent = st.cur.q[L()];
      renderTop(); renderBoard();
    }
  }
  function show(id){ document.querySelectorAll('#mo-wrap .mo-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _start() {
    st = {
      thread:0, round:0, answered:false, spin:0,
      pool: shuffle([..._gpPool()]), idx:0,
      rivals: RIVALS.map(n=>({ name:n, thread: 150 + ((Math.random()*200)|0) })),
    };
    show('mo-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), thread:st.thread, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.thread-a.thread);
    return all;
  }
  function renderTop() {
    document.getElementById('mo-thread').textContent = st.thread;
    document.getElementById('mo-round').textContent = T('ΓΥΡΟΣ ','ROUND ')+st.round+' / '+ROUNDS;
  }
  function renderBoard() {
    if(window.SymStandings) SymStandings.feed('mo', standings(), {key:'thread', unit:'νήμα', accent:'var(--sym-blood)', title:'ΜΟΙΡΑΙ'});
    document.getElementById('mo-board').innerHTML = standings().map((x,i)=>
      `<div class="mo-board-chip${x.me?' me':''}"><span class="mo-board-rank">${i+1}</span><span class="mo-board-name">${x.name}</span><span class="mo-board-t">${x.thread}</span></div>`
    ).join('');
  }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.round>=ROUNDS) return end();
    st.answered=false; st.cur=getQ(); st.round++;
    document.getElementById('mo-qtext').textContent = st.cur.q[L()];
    const fb=document.getElementById('mo-feedback'); fb.textContent=''; fb.className='mo-feedback';
    const wrap=document.getElementById('mo-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='mo-ans';
      b.innerHTML=`<span class="mo-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderTop(); renderBoard();
  }

  function advanceRivals(){ st.rivals.forEach(r=> r.thread += 40 + ((Math.random()*180)|0)); }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#mo-answers .mo-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('mo-feedback');
    advanceRivals();
    if (chosen===st.cur.c) {
      st.wheelKind='boon';
      fb.textContent=T('ΣΩΣΤΟ — γύρισε τον τροχό της τύχης','CORRECT — spin the wheel of fortune'); fb.className='mo-feedback mo-fb-ok';
      _fx('correct',{el:btn});
    } else {
      st.wheelKind='curse';
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      fb.textContent=T('ΛΑΘΟΣ — γύρισε τον τροχό της συμφοράς','WRONG — spin the wheel of misfortune'); fb.className='mo-feedback mo-fb-bad';
    }
    renderBoard();
    setTimeout(showSpin, 950);
  }

  /* ───────── wheel spin ─────────
     Rotate a wrapping HTML <div> (robust) rather than the SVG group. */
  function showSpin() {
    show('mo-screen-spin');
    const sectors=curSectors();
    const headEl=document.querySelector('#mo-screen-spin .mo-spin-head');
    if (headEl) headEl.textContent = st.wheelKind==='curse'
      ? T('Ο ΤΡΟΧΟΣ ΤΗΣ ΣΥΜΦΟΡΑΣ','THE WHEEL OF MISFORTUNE')
      : T('Ο ΤΡΟΧΟΣ ΤΗΣ ΜΟΙΡΑΣ','THE WHEEL OF FATE');
    document.getElementById('mo-outcome').innerHTML='';
    document.getElementById('mo-wheel-host').innerHTML = `<div class="mo-rot ${st.wheelKind}" id="mo-rot">${wheelSVG(sectors)}</div>`;
    const rot = document.getElementById('mo-rot');
    rot.style.transition='none';
    rot.style.transform=`rotate(${st.spin||0}deg)`;
    const idx=(Math.random()*sectors.length)|0;
    const center = idx*45 + 22.5;
    const jitter = (Math.random()*30-15);
    st.spin = (st.spin||0) + 360*5 + ((360 - (((st.spin||0)+center) % 360)) % 360) - jitter;
    void rot.getBoundingClientRect();
    rot.style.transition='transform 3.1s cubic-bezier(.13,.86,.22,1)';
    rot.style.transform=`rotate(${st.spin}deg)`;
    let applied=false;
    const done = ()=>{ if(applied) return; applied=true; rot.removeEventListener('transitionend', done); applySpin(idx); };
    rot.addEventListener('transitionend', done);
    setTimeout(done, 3400);
    _fx('spin');
  }

  function applySpin(idx) {
    const s = curSectors()[idx];
    let big='', desc='', cls='gain', delta=0, lock=false;
    if (s.k==='x1'){ delta=BASE; big=`+${delta}`; desc=T('Η Λάχεσις μετρά ένα μέτρο νήματος.','Lachesis measures one length of thread.'); }
    else if (s.k==='x2'){ delta=BASE*2; big=`+${delta}`; desc=T('Διπλό νήμα από τον αδράχτι της Κλωθούς.','A double thread from Clotho\u2019s spindle.'); }
    else if (s.k==='x3'){ delta=BASE*3; big=`+${delta}`; desc=T('Τριπλό νήμα — η μοίρα σε ευνοεί.','A triple thread — fate favours you.'); }
    else if (s.k==='jack'){ delta=500; big=T('ΤΖΑΚΠΟΤ +500','JACKPOT +500'); desc=T('Το χρυσό νήμα της μοίρας!','The golden thread of destiny!'); _fx('jackpot'); }
    else if (s.k==='cut'){ delta=-Math.round(st.thread*0.5); big=T(`ΑΤΡΟΠΟΣ ${delta}`,`ATROPOS ${delta}`); desc=T('Η Άτροπος κόβει το μισό σου νήμα.','Atropos severs half your thread.'); cls='loss'; _fx('cut'); }
    else if (s.k==='steal'){
      const board=standings(); const leader=board.find(x=>!x.me);
      const amt = leader ? Math.max(20, Math.round(leader.thread*0.3/5)*5) : BASE;
      if (leader){ const rv=st.rivals.find(r=>r.name===leader.name); if(rv) rv.thread=Math.max(0, rv.thread-amt); }
      delta=amt; cls='steal'; big=T('ΚΛΟΠΗ +'+amt,'STEAL +'+amt);
      desc=T('Άρπαξες νήμα από τον/την '+(leader?leader.name:''),'You snatched thread from '+(leader?leader.name:''));
    }
    else if (s.k==='sabotage'){
      const rv=st.rivals[(Math.random()*st.rivals.length)|0];
      const amt=Math.max(20, Math.round(rv.thread*0.3/5)*5); rv.thread=Math.max(0, rv.thread-amt);
      cls='steal'; big=T('ΔΟΛΙΟΦΘΟΡΑ','SABOTAGE'); desc=T('Έκοψες '+amt+' νήμα από τον/την '+rv.name,'You cut '+amt+' thread from '+rv.name);
    }
    else if (s.k==='nothing'){ big=T('ΤΙΠΟΤΑ','NOTHING'); desc=T('Οι Μοίρες σιωπούν.','The Fates are silent.'); }
    else if (s.k==='donate'){
      const rv=st.rivals[(Math.random()*st.rivals.length)|0];
      const amt=Math.max(20, Math.round(st.thread*0.3/5)*5); st.thread=Math.max(0, st.thread-amt); rv.thread+=amt;
      cls='loss'; big=T('ΔΩΡΕΑ -'+amt,'DONATION -'+amt); desc=T('Χάρισες '+amt+' νήμα στον/στην '+rv.name,'You gifted '+amt+' thread to '+rv.name);
    }
    else if (s.k==='lock'){ cls='loss'; lock=true; big=T('ΚΛΕΙΔΩΜΑ','LOCKED'); desc=T('Οι Μοίρες σε ακινητοποιούν για 5 δευτερόλεπτα.','The Fates freeze you for 5 seconds.'); }
    st.thread = Math.max(0, st.thread + delta);
    if ((cls==='gain'||cls==='steal') && delta>0 && window.SymFX) SymFX.burst(window.innerWidth/2, window.innerHeight*0.4, {emoji:['✦','🧵'], count:16, power:10, up:0.5, life:1200});
    const contLabel = st.round>=ROUNDS?T('ΑΠΟΤΕΛΕΣΜΑ','RESULT'):T('ΣΥΝΕΧΕΙΑ','CONTINUE');
    let html=`<div class="mo-outcome-big ${cls}">${big}</div><div class="mo-outcome-desc">${desc}</div>`;
    html += lock ? `<button class="sym-btn mo-cont" id="mo-cont" disabled>5s</button>` : `<button class="sym-btn mo-cont" onclick="Moirai._cont()">${contLabel}</button>`;
    document.getElementById('mo-outcome').innerHTML = html;
    if (window.gsap) gsap.from('#mo-outcome .mo-outcome-big', {scale:0.6, opacity:0, duration:.5, ease:'back.out(2.2)'});
    if (lock){ let s5=5; const btn=document.getElementById('mo-cont'); st.lockTimer=setInterval(()=>{ s5--; if(s5<=0){ clearInterval(st.lockTimer); st.lockTimer=null; if(btn){ btn.disabled=false; btn.textContent=contLabel; btn.onclick=()=>_cont(); } } else if(btn){ btn.textContent=s5+'s'; } },1000); }
  }

  function _cont() {
    if (st.lockTimer){ clearInterval(st.lockTimer); st.lockTimer=null; }
    show('mo-screen-game');
    renderTop(); renderBoard();
    if (st.round>=ROUNDS) end(); else nextQ();
  }

  /* ───────── end ───────── */
  function end() {
    show('mo-screen-end');
    const board = standings();
    const won = board[0].me;
    _fx(won?'win':'lose');
    document.getElementById('mo-end-art').innerHTML = spindleSVG('mo-end-spindle');
    const title=document.getElementById('mo-end-title'), sub=document.getElementById('mo-end-sub');
    if (won) {
      title.textContent=T('ΤΟ ΝΗΜΑ ΤΗΣ ΜΟΙΡΑΣ','THE THREAD OF FATE'); title.className='mo-end-title win';
      sub.textContent=T('Ύφανες το μακρύτερο νήμα ζωής. Ακόμη και οι Μοίρες υποκλίνονται.','You wove the longest thread of life. Even the Fates bow.');
    } else {
      title.textContent=T('ΟΙ ΜΟΙΡΕΣ ΑΠΟΦΑΣΙΣΑΝ','THE FATES HAVE SPOKEN'); title.className='mo-end-title lose';
      sub.textContent=T(`Τελείωσες στη ${board.findIndex(x=>x.me)+1}η θέση. Νικητής: ${board[0].name}.`,`You finished in position ${board.findIndex(x=>x.me)+1}. Winner: ${board[0].name}.`);
    }
    document.getElementById('mo-final-board').innerHTML = board.map((x,i)=>
      `<div class="mo-final-row${x.me?' me':''}"><span class="mo-final-pos">${i+1}</span><span class="mo-final-name">${x.name}${i===0?' 🏆':''}</span><span class="mo-final-t">${x.thread}</span></div>`
    ).join('');
  }

  /* ───────── art ───────── */
  function wheelSVG(secs) {
    secs = secs || curSectors();
    const cx=110, cy=110, r=100;
    const pt=(deg)=>{ const a=(deg-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; };
    let sectors='';
    secs.forEach((s,i)=>{
      const a0=i*45, a1=(i+1)*45, mid=i*45+22.5;
      const [x0,y0]=pt(a0), [x1,y1]=pt(a1);
      const [mx,my]=(()=>{ const a=(mid-90)*Math.PI/180; return [cx+r*0.66*Math.cos(a), cy+r*0.66*Math.sin(a)]; })();
      sectors += `<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="${s.col}" stroke="#0D0A06" stroke-width="2"/>
        <text x="${mx.toFixed(1)}" y="${my.toFixed(1)}" transform="rotate(${mid} ${mx.toFixed(1)} ${my.toFixed(1)})" text-anchor="middle" dominant-baseline="central" font-family="JetBrains Mono, monospace" font-size="22" font-weight="700" fill="#1A130C">${s.label}</text>`;
    });
    return `<svg class="mo-wheel" viewBox="0 0 220 220" fill="none">
      <circle cx="110" cy="110" r="104" fill="#0D0A06" stroke="#3A2F12" stroke-width="3"/>
      <g>${sectors}</g>
      <circle cx="110" cy="110" r="16" fill="#241A10" stroke="#C4A448" stroke-width="3"/>
      <circle cx="110" cy="110" r="5" fill="#E3C766"/>
    </svg>`;
  }
  function spindleSVG(cls){ return `<svg class="${cls}" viewBox="0 0 110 140" fill="none">
    <defs><linearGradient id="mo-s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9E3B2E"/><stop offset="1" stop-color="#5E1B14"/></linearGradient></defs>
    <ellipse cx="55" cy="58" rx="34" ry="22" fill="url(#mo-s1)" stroke="#3A140E" stroke-width="2"/>
    <g stroke="#E0D6C4" stroke-width="1.5" opacity="0.6" fill="none"><ellipse cx="55" cy="58" rx="26" ry="16"/><ellipse cx="55" cy="58" rx="16" ry="10"/></g>
    <rect x="52" y="10" width="6" height="120" rx="3" fill="#5A4226" stroke="#2E2113" stroke-width="1.5"/>
    <path d="M55 10c-6 4-6 10 0 14 6-4 6-10 0-14z" fill="#C4A448"/>
    <path d="M58 30q22 6 14 28" stroke="#E0D6C4" stroke-width="1.5" fill="none" opacity="0.7"/>
  </svg>`; }

  return { open, close, _start, _cont, syncLang };
})();
window.Moirai = Moirai;

/* ── Games-Panel entry points ── */
window.openMoirai  = function(gp){ Moirai.open(gp || {}); };
window.closeMoirai = function(){ Moirai.close(); };
