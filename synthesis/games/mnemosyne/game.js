/* ══════════════════ ΜΝΗΜΟΣΥΝΗ — engine ══════════════════
   Memory-match reimagined as the gift of Mnemosyne, mother of the Muses.
   A correct answer earns the right to turn two tiles of the mnemonic wall;
   find the matching pair of divine symbols. Clear your wall — or hold the
   most pairs — before the rival pupils.
   API:  Mnemosyne.open()   Mnemosyne.close()
═══════════════════════════════════════════════════════════════════ */
const Mnemosyne = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.MN_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const MAXQ   = 16;
  const SYMS   = ['🦉','⚡','🔱','🎼','🏺','🍇','🐍','☀'];   // 8 pairs → 16 tiles
  const PAIRS  = SYMS.length;
  const RIVALS = ['ΕΥΤΕΡΠΗ','ΚΑΛΛΙΟΠΗ','ΚΛΕΙΩ'];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('mn:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#mn-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('mn-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('mn-screen-intro')) build();
    syncLang();
    show('mn-screen-intro');
  }
  function close() {
    document.getElementById('mn-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('mn-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'mn-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeMnemosyne()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u039c\u039d\u0397\u039c\u039f\u03a3\u03a5\u039d\u0397') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="mn-wrap"></div></div>';
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
    document.getElementById('mn-wrap').innerHTML = `
<!-- INTRO -->
<div id="mn-screen-intro" class="mn-screen">
  ${owlSVG('mn-owl')}
  <div class="mn-logo">ΜΝΗΜΟΣΥΝΗ</div>
  <div class="mn-logo-en" data-i18n="subtitle"></div>
  <div class="mn-intro-txt" data-i18n="intro"></div>
  <button class="sym-btn" onclick="Mnemosyne._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="mn-screen-game" class="mn-screen">
  <div class="mn-top">
    <div class="mn-pairs">
      <span class="mn-pairs-lbl" data-i18n="pairs"></span>
      <span class="mn-pairs-val" id="mn-pairs">0 / ${PAIRS}</span>
    </div>
    <div class="mn-round" id="mn-round"></div>
  </div>
  <div class="mn-board" id="mn-board"></div>
  <div class="mn-grid-wrap"><div class="mn-grid" id="mn-grid"></div></div>
  <div class="mn-qbody" id="mn-qbody">
    <div class="mn-q-card"><div class="mn-q-text" id="mn-qtext"></div></div>
    <div class="mn-answers" id="mn-answers"></div>
    <div class="mn-feedback" id="mn-feedback"></div>
  </div>
</div>

<!-- END -->
<div id="mn-screen-end" class="mn-screen">
  <div id="mn-end-art"></div>
  <div class="mn-end-title" id="mn-end-title"></div>
  <div class="mn-end-sub" id="mn-end-sub"></div>
  <div class="mn-final-board" id="mn-final-board"></div>
  <div class="mn-end-btns">
    <button class="sym-btn" onclick="Mnemosyne._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Mnemosyne.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    subtitle:{ gr:'Το δώρο της Μνημοσύνης', en:'The Gift of Mnemosyne' },
    intro:   { gr:'Η Μνημοσύνη, μητέρα των Μουσών, δοκιμάζει τη μνήμη σου. Κάθε σωστή απάντηση σου επιτρέπει να <b>γυρίσεις δύο πλακίδια</b> — βρες το ζευγάρι των θεϊκών συμβόλων. Καθάρισε τον τοίχο πριν από τις αντίπαλες μαθήτριες.', en:'Mnemosyne, mother of the Muses, tests your memory. Each correct answer lets you <b>turn two tiles</b> — find the matching pair of divine symbols. Clear the wall before the rival pupils.' },
    begin:   { gr:'ΞΥΠΝΑ ΤΗ ΜΝΗΜΗ', en:'WAKE THE MEMORY' },
    pairs:   { gr:'ΖΕΥΓΑΡΙΑ', en:'PAIRS' },
    again:   { gr:'ΝΕΟΣ ΤΟΙΧΟΣ', en:'NEW WALL' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#mn-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('mn-screen-game').classList.contains('active')) {
      document.getElementById('mn-qtext').textContent = st.cur.q[L()];
      renderTop(); renderBoard();
    }
  }
  function show(id){ document.querySelectorAll('#mn-wrap .mn-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _start() {
    const deck = shuffle([...SYMS, ...SYMS]).map((s,i)=>({ id:i, sym:s, matched:false, up:false }));
    st = {
      qNum:0, answered:false, pairs:0, canFlip:0, sel:[], locking:false,
      pool: shuffle([..._gpPool()]), idx:0, tiles:deck,
      rivals: RIVALS.map(n=>({ name:n, pairs:0 })),
      done:false,
    };
    show('mn-screen-game');
    renderGrid(); 
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), pairs:st.pairs, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.pairs-a.pairs);
    return all;
  }
  function renderTop() {
    document.getElementById('mn-pairs').textContent = st.pairs+' / '+PAIRS;
    document.getElementById('mn-round').textContent = T('ΓΥΡΟΣ ','ROUND ')+st.qNum+' / '+MAXQ;
  }
  function renderBoard() {
    if(window.SymStandings) SymStandings.feed('mn', standings(), {key:'pairs', unit:'ζεύγη', accent:'var(--sym-aegean)', title:'ΜΝΗΜΟΣΥΝΗ'});
    document.getElementById('mn-board').innerHTML = standings().map((x,i)=>
      `<div class="mn-board-chip${x.me?' me':''}"><span class="mn-board-rank">${i+1}</span><span class="mn-board-name">${x.name}</span><span class="mn-board-p">${x.pairs}</span></div>`
    ).join('');
  }
  function renderGrid() {
    const g=document.getElementById('mn-grid'); g.innerHTML='';
    st.tiles.forEach(t=>{
      const el=document.createElement('button');
      el.className='mn-tile'+(t.matched?' matched':'')+(t.up?' up':'');
      el.dataset.id=t.id;
      el.innerHTML=`<span class="mn-tile-face mn-back">𐤀</span><span class="mn-tile-face mn-front">${t.sym}</span>`;
      el.onclick=()=>flipTile(t.id);
      g.appendChild(el);
    });
  }

  /* ───────── memory loop ───────── */
  function nextQ() {
    if (st.done) return;
    if (st.qNum>=MAXQ || st.pairs>=PAIRS) return end();
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('mn-qtext').textContent = st.cur.q[L()];
    const fb=document.getElementById('mn-feedback'); fb.textContent=''; fb.className='mn-feedback';
    const wrap=document.getElementById('mn-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='mn-ans';
      b.innerHTML=`<span class="mn-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    document.getElementById('mn-qbody').classList.remove('flipphase');
    renderTop(); renderBoard();
  }

  function advanceRivals(strong) {
    st.rivals.forEach(r=>{ if (r.pairs<PAIRS && Math.random() < (strong?0.5:0.28)) r.pairs++; });
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#mn-answers .mn-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('mn-feedback');
    if (chosen===st.cur.c) {
      _fx('correct',{el:btn});
      advanceRivals(false);
      st.canFlip=2; st.sel=[];
      fb.textContent=T('ΣΩΣΤΟ — γύρισε δύο πλακίδια','CORRECT — turn two tiles'); fb.className='mn-feedback mn-fb-ok';
      document.getElementById('mn-qbody').classList.add('flipphase');
      renderBoard();
    } else {
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      advanceRivals(true);
      fb.textContent=T('ΛΑΘΟΣ — οι Μούσες θυμούνται για σένα','WRONG — the Muses recall for others'); fb.className='mn-feedback mn-fb-bad';
      renderBoard();
      checkDone();
      if (!st.done) setTimeout(nextQ, 1500);
    }
  }

  function flipTile(id) {
    if (st.locking || st.canFlip<=0) return;
    const t = st.tiles.find(x=>x.id===id);
    if (!t || t.matched || t.up) return;
    t.up=true; st.canFlip--; st.sel.push(id);
    renderGrid(); _fx('flip');
    if (st.sel.length===2) {
      st.locking=true;
      const [a,b]=st.sel.map(i=>st.tiles.find(x=>x.id===i));
      if (a.sym===b.sym) {
        setTimeout(()=>{
          a.matched=b.matched=true; st.pairs++;
          st.sel=[]; st.locking=false; renderGrid(); renderTop(); renderBoard(); _fx('match');
          afterFlip(T('ΖΕΥΓΑΡΙ!','A PAIR!'), 'ok');
        }, 500);
      } else {
        setTimeout(()=>{
          a.up=b.up=false; st.sel=[]; st.locking=false; renderGrid();
          afterFlip(T('Δεν ταιριάζουν — θυμήσου τις θέσεις','No match — remember the spots'), 'bad');
        }, 1000);
      }
    }
  }

  function afterFlip(msg, tone) {
    const fb=document.getElementById('mn-feedback');
    fb.textContent=msg; fb.className='mn-feedback '+(tone==='ok'?'mn-fb-ok':'mn-fb-bad');
    checkDone();
    if (!st.done) setTimeout(nextQ, 900);
  }

  function checkDone() {
    const rivalDone = st.rivals.some(r=>r.pairs>=PAIRS);
    if (st.pairs>=PAIRS || st.qNum>=MAXQ || rivalDone) { st.done=true; setTimeout(end, 950); }
  }

  /* ───────── end ───────── */
  function end() {
    show('mn-screen-end');
    const board = standings();
    const won = board[0].me;
    _fx(won?'win':'lose');
    document.getElementById('mn-end-art').innerHTML = owlSVG('mn-end-owl');
    const title=document.getElementById('mn-end-title'), sub=document.getElementById('mn-end-sub');
    if (won) {
      title.textContent=T('ΤΕΛΕΙΑ ΜΝΗΜΗ','PERFECT RECALL'); title.className='mn-end-title win';
      sub.textContent=T('Θυμήθηκες περισσότερα ζευγάρια από κάθε άλλον. Οι Μούσες σε ευλογούν.','You recalled more pairs than any other. The Muses bless you.');
    } else {
      title.textContent=T('Ο ΤΟΙΧΟΣ ΞΕΘΩΡΙΑΖΕΙ','THE WALL FADES'); title.className='mn-end-title lose';
      sub.textContent=T(`Βρήκες ${st.pairs}/${PAIRS} ζευγάρια, στη ${board.findIndex(x=>x.me)+1}η θέση. Νικητής: ${board[0].name}.`,`You found ${st.pairs}/${PAIRS} pairs, in position ${board.findIndex(x=>x.me)+1}. Winner: ${board[0].name}.`);
    }
    document.getElementById('mn-final-board').innerHTML = board.map((x,i)=>
      `<div class="mn-final-row${x.me?' me':''}"><span class="mn-final-pos">${i+1}</span><span class="mn-final-name">${x.name}${i===0?' 🏆':''}</span><span class="mn-final-p">${x.pairs}/${PAIRS}</span></div>`
    ).join('');
  }

  /* ───────── art ───────── */
  function owlSVG(cls){ return `<svg class="${cls}" viewBox="0 0 120 120" fill="none">
    <defs><linearGradient id="mn-o1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FB0BC"/><stop offset="1" stop-color="#3E5E66"/></linearGradient></defs>
    <path d="M60 24c20 0 32 16 32 38 0 26-16 40-32 40S28 88 28 62c0-22 12-38 32-38z" fill="url(#mn-o1)" stroke="#23383E" stroke-width="2"/>
    <circle cx="46" cy="54" r="14" fill="#F0EBE0" stroke="#23383E" stroke-width="2"/>
    <circle cx="74" cy="54" r="14" fill="#F0EBE0" stroke="#23383E" stroke-width="2"/>
    <circle cx="46" cy="54" r="6" fill="#1A130C"/><circle cx="74" cy="54" r="6" fill="#1A130C"/>
    <path d="M60 60l-6 9h12z" fill="#C4A448" stroke="#8E7322" stroke-width="1"/>
    <path d="M40 30c-6-6-4-14-2-18 4 4 10 9 8 18M80 30c6-6 4-14 2-18-4 4-10 9-8 18" fill="#3E5E66"/>
    <g stroke="#CDE3E8" stroke-width="1.4" opacity="0.5"><path d="M44 80q16 8 32 0M48 90q12 5 24 0"/></g>
  </svg>`; }

  return { open, close, _start, syncLang };
})();
window.Mnemosyne = Mnemosyne;

/* ── Games-Panel entry points ── */
window.openMnemosyne  = function(gp){ Mnemosyne.open(gp || {}); };
window.closeMnemosyne = function(){ Mnemosyne.close(); };
