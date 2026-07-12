/* ══════════════════ ΜΝΗΜΟΣΥΝΗ — engine ══════════════════
   Memory-match reimagined as the gift of Mnemosyne, mother of the Muses.
   A correct answer earns the right to turn two tiles of the mnemonic wall;
   find the matching pair of divine symbols. Clear your wall — or hold the
   most pairs — before the rival pupils.
   API:  Mnemosyne.open()   Mnemosyne.close()
═══════════════════════════════════════════════════════════════════ */
const Mnemosyne = (() => {

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
    const g = window.MN_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const MAXQ   = 16;
  const SYMS   = ['🦉','⚡','🔱','🎼','🏺','🍇','🐍','☀'];   // 8 pairs → 16 tiles
  const PAIRS  = SYMS.length;
  const RIVALS = ['ΕΥΤΕΡΠΗ','ΚΑΛΛΙΟΠΗ','ΚΛΕΙΩ'];

  const REDUCE = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    River.start();
    _decode(document.getElementById('mn-logo'), 'ΜΝΗΜΟΣΥΝΗ');
  }
  function close() {
    document.getElementById('mn-overlay').classList.remove('active');
    document.body.style.overflow = '';
    River.stop();
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('mn-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'mn-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeMnemosyne()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΜΝΗΜΟΣΥΝΗ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
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
<canvas id="mn-river" aria-hidden="true"></canvas>
<div class="mn-glow mn-glow-a" aria-hidden="true"></div>
<div class="mn-glow mn-glow-b" aria-hidden="true"></div>

<!-- INTRO -->
<div id="mn-screen-intro" class="mn-screen">
  <div class="mn-hero">
    ${owlSVG('mn-owl')}
    <div class="mn-logo" id="mn-logo">ΜΝΗΜΟΣΥΝΗ</div>
    <div class="mn-meander" aria-hidden="true"></div>
    <div class="mn-logo-en" data-i18n="subtitle"></div>
  </div>
  <div class="mn-intro-txt" data-i18n="intro"></div>
  <div class="mn-muses">
    <span class="mn-muses-lbl" data-i18n="rivals"></span>
    ${RIVALS.map(n=>`<span class="mn-muse">${n}</span>`).join('')}
  </div>
  <button class="sym-btn mn-begin" onclick="Mnemosyne._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="mn-screen-game" class="mn-screen">
  <div class="mn-top">
    <div class="mn-pairs">
      <span class="mn-pairs-lbl" data-i18n="pairs"></span>
      <span class="mn-pairs-val" id="mn-pairs">0 / ${PAIRS}</span>
      <span class="mn-pips" id="mn-pips" aria-hidden="true"></span>
    </div>
    <div class="mn-round" id="mn-round"></div>
  </div>
  <div class="mn-prog" aria-hidden="true"><i id="mn-prog-i"></i></div>
  <div class="mn-board" id="mn-board"></div>
  <div class="mn-grid-wrap" id="mn-gridwrap">
    <div class="mn-grid" id="mn-grid"></div>
    <div class="mn-flips" id="mn-flips"></div>
  </div>
  <div class="mn-qbody" id="mn-qbody">
    <div class="mn-q-card">
      <div class="mn-q-kicker"><span data-i18n="question"></span><span id="mn-qnum"></span></div>
      <div class="mn-q-text" id="mn-qtext"></div>
    </div>
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
    _tiltInit(); /* presentation only — wall parallax */
  }

  const I18N = {
    subtitle:{ gr:'Το δώρο της Μνημοσύνης', en:'The Gift of Mnemosyne' },
    intro:   { gr:'Η Μνημοσύνη, μητέρα των Μουσών, δοκιμάζει τη μνήμη σου. Κάθε σωστή απάντηση σου επιτρέπει να <b>γυρίσεις δύο πλακίδια</b> — βρες το ζευγάρι των θεϊκών συμβόλων. Καθάρισε τον τοίχο πριν από τις αντίπαλες μαθήτριες.', en:'Mnemosyne, mother of the Muses, tests your memory. Each correct answer lets you <b>turn two tiles</b> — find the matching pair of divine symbols. Clear the wall before the rival pupils.' },
    begin:   { gr:'ΞΥΠΝΑ ΤΗ ΜΝΗΜΗ', en:'WAKE THE MEMORY' },
    pairs:   { gr:'ΖΕΥΓΑΡΙΑ', en:'PAIRS' },
    again:   { gr:'ΝΕΟΣ ΤΟΙΧΟΣ', en:'NEW WALL' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
    question:{ gr:'ΕΡΩΤΗΜΑ', en:'QUESTION' },
    rivals:  { gr:'ΟΙ ΑΝΤΙΠΑΛΕΣ ΜΑΘΗΤΡΙΕΣ', en:'THE RIVAL PUPILS' },
  };

  function syncLang() {
    document.querySelectorAll('#mn-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('mn-screen-game').classList.contains('active')) {
      document.getElementById('mn-qtext').textContent = QT(st.cur.q);
      renderTop(); renderBoard(); renderFlips();
    }
  }
  function show(id){ document.querySelectorAll('#mn-wrap .mn-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* decode-in title (SymFX glyph scramble, safe no-op without it) */
  function _decode(el, txt){
    if (!el) return;
    if (window.SymFX && !REDUCE) { try{ SymFX.scramble(el, txt, { duration: 950 }); return; }catch(_){} }
    el.textContent = txt;
  }

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
    renderGrid(true);
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
    const pp=document.getElementById('mn-pips');
    if (pp) pp.innerHTML = Array.from({length:PAIRS},(_,i)=>`<i class="${i<st.pairs?'on':''}"></i>`).join('');
    const pr=document.getElementById('mn-prog-i');
    if (pr) pr.style.width = Math.min(100, (st.qNum/MAXQ)*100).toFixed(1)+'%';
  }
  function renderBoard() {
    if(window.SymStandings) SymStandings.feed('mn', standings(), {key:'pairs', unit:'ζεύγη', accent:'var(--sym-aegean)', title:'ΜΝΗΜΟΣΥΝΗ'});
    document.getElementById('mn-board').innerHTML = standings().map((x,i)=>
      `<div class="mn-board-chip${x.me?' me':''}${i===0&&x.pairs>0?' lead':''}"><span class="mn-board-rank">${i+1}</span><span class="mn-board-name">${x.name}</span><span class="mn-board-p">${x.pairs}</span></div>`
    ).join('');
  }

  /* Build once, then update tiles IN PLACE so the 3D flip actually animates. */
  function renderGrid(fresh) {
    const g=document.getElementById('mn-grid');
    if (fresh || g.children.length !== st.tiles.length) {
      g.innerHTML='';
      st.tiles.forEach((t,i)=>{
        const el=document.createElement('button');
        el.className='mn-tile'+(t.matched?' matched':'')+(t.up?' up':'');
        el.dataset.id=t.id;
        el.style.setProperty('--mn-d', (i*45)+'ms');
        el.innerHTML=
          `<span class="mn-tile-face mn-back">${rosetteSVG()}</span>`+
          `<span class="mn-tile-face mn-front"><i class="mn-sym">${t.sym}</i></span>`;
        el.onclick=()=>flipTile(t.id);
        g.appendChild(el);
      });
    } else {
      st.tiles.forEach(t=>{
        const el=g.querySelector('.mn-tile[data-id="'+t.id+'"]');
        if (!el) return;
        const cls='mn-tile'+(t.matched?' matched':'')+(t.up?' up':'');
        if (el.className!==cls) el.className=cls;
      });
    }
    renderFlips();
  }

  function renderFlips() {
    const f=document.getElementById('mn-flips'); if(!f) return;
    if (st.canFlip>0) {
      f.innerHTML = '<span>'+T('ΓΥΡΙΣΕ','FLIP')+'</span>'+'<i>◆</i>'.repeat(st.canFlip);
      f.className='mn-flips on';
    } else {
      f.textContent = T('ΑΠΑΝΤΗΣΕ ΣΩΣΤΑ ΓΙΑ ΝΑ ΓΥΡΙΣΕΙΣ ΠΛΑΚΙΔΙΑ','ANSWER RIGHT TO TURN TILES');
      f.className='mn-flips';
    }
  }

  function _gridLive(on) {
    const w=document.getElementById('mn-gridwrap');
    if (w) w.classList.toggle('mn-live', !!on);
  }

  /* ───────── presentation-only flourish (no game-state impact) ───────── */
  function _tileEl(id){ const g=document.getElementById('mn-grid'); return g && g.querySelector('.mn-tile[data-id="'+id+'"]'); }

  /* the wall leans gently toward the pointer — layered depth, nothing more */
  function _tiltInit(){
    if (REDUCE) return;
    const wrap=document.getElementById('mn-gridwrap'), grid=document.getElementById('mn-grid');
    if (!wrap || !grid || wrap._mnTilt) return;
    wrap._mnTilt=true;
    let raf=0, px=0, py=0;
    const apply=()=>{
      raf=0;
      const ov=document.getElementById('mn-overlay');
      if (!ov || !ov.classList.contains('active')) return;
      const r=wrap.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const nx=((px-r.left)/r.width)*2-1, ny=((py-r.top)/r.height)*2-1;
      grid.style.setProperty('--mn-ry', (nx*2.1).toFixed(2)+'deg');
      grid.style.setProperty('--mn-rx', (-ny*2.1).toFixed(2)+'deg');
    };
    wrap.addEventListener('pointermove', (ev)=>{
      px=ev.clientX; py=ev.clientY;
      if (!raf) raf=requestAnimationFrame(apply);
    });
    wrap.addEventListener('pointerleave', ()=>{
      if (raf){ cancelAnimationFrame(raf); raf=0; }
      grid.style.setProperty('--mn-ry','0deg');
      grid.style.setProperty('--mn-rx','0deg');
    });
  }

  /* stagger the second tile of a resolving pair (claim or turn-back) */
  function _pairStagger(id){
    if (REDUCE) return;
    const el=_tileEl(id); if (!el) return;
    el.style.setProperty('--mn-fd','130ms');
    setTimeout(()=>{ try{ el.style.removeProperty('--mn-fd'); }catch(_){} }, 1500);
  }

  /* the slab answers a claimed pair with a beat of gold */
  function _wallClaimPulse(){
    const gw=document.getElementById('mn-gridwrap'); if (!gw) return;
    gw.classList.add('mn-claimed');
    setTimeout(()=>gw.classList.remove('mn-claimed'), 750);
  }

  /* a rival muse visibly "takes her turn" — cold ping on a face-down tile + name tag */
  function _rivalPing(names){
    if (REDUCE || !names || !names.length) return;
    const g=document.getElementById('mn-grid'), wrap=document.getElementById('mn-gridwrap');
    if (!g || !wrap) return;
    names.forEach((nm,k)=>{
      setTimeout(()=>{
        const down=[...g.querySelectorAll('.mn-tile:not(.matched):not(.up)')];
        if (!down.length) return;
        const el=down[(Math.random()*down.length)|0];
        el.classList.remove('mn-rival'); void el.offsetWidth; el.classList.add('mn-rival');
        setTimeout(()=>el.classList.remove('mn-rival'), 1050);
        const tag=document.createElement('span');
        tag.className='mn-rival-tag'; tag.textContent=nm;
        const wr=wrap.getBoundingClientRect(), tr=el.getBoundingClientRect();
        tag.style.left=(tr.left-wr.left+tr.width/2)+'px';
        tag.style.top=(tr.top-wr.top-4)+'px';
        wrap.appendChild(tag);
        try{
          tag.animate([
            { opacity:0, transform:'translate(-50%,6px) scale(.85)' },
            { opacity:1, transform:'translate(-50%,-14px) scale(1)', offset:.3 },
            { opacity:1, transform:'translate(-50%,-22px) scale(1)', offset:.75 },
            { opacity:0, transform:'translate(-50%,-34px) scale(.95)' }
          ], { duration:1250, easing:'cubic-bezier(.25,.8,.3,1)' }).onfinish=()=>tag.remove();
        }catch(_){ }
        setTimeout(()=>{ if (tag.parentNode) tag.remove(); }, 1500);
      }, 380+k*300);
    });
  }

  /* gold beam briefly linking the two tiles of a claimed pair */
  function _pairBeam(aId, bId){
    if (REDUCE) return;
    const wrap=document.getElementById('mn-gridwrap'), a=_tileEl(aId), b=_tileEl(bId);
    if (!wrap || !a || !b) return;
    const wr=wrap.getBoundingClientRect(), ra=a.getBoundingClientRect(), rb=b.getBoundingClientRect();
    const x1=ra.left-wr.left+ra.width/2, y1=ra.top-wr.top+ra.height/2;
    const x2=rb.left-wr.left+rb.width/2, y2=rb.top-wr.top+rb.height/2;
    const ln=document.createElement('i');
    ln.className='mn-link';
    ln.style.left=x1+'px'; ln.style.top=y1+'px';
    ln.style.width=Math.hypot(x2-x1, y2-y1)+'px';
    ln.style.transform='rotate('+(Math.atan2(y2-y1, x2-x1)*180/Math.PI)+'deg)';
    wrap.appendChild(ln);
    try{
      ln.animate([
        { opacity:0 }, { opacity:1, offset:.22 }, { opacity:1, offset:.6 }, { opacity:0 }
      ], { duration:720, easing:'ease-out' }).onfinish=()=>ln.remove();
    }catch(_){ }
    setTimeout(()=>{ if (ln.parentNode) ln.remove(); }, 950);
  }

  /* gold sparks drift from the claimed tiles up to the pair score */
  function _sparkDrift(ids){
    if (REDUCE) return;
    const ov=document.getElementById('mn-overlay'), score=document.getElementById('mn-pairs');
    if (!ov || !score) return;
    const sr=score.getBoundingClientRect();
    const sx=sr.left+sr.width/2, sy=sr.top+sr.height/2;
    (ids||[]).forEach(id=>{
      const el=_tileEl(id); if (!el) return;
      const r=el.getBoundingClientRect();
      const cx=r.left+r.width/2, cy=r.top+r.height/2;
      for (let i=0;i<4;i++){
        const sp=document.createElement('i');
        sp.className='mn-spark';
        sp.style.left=cx+'px'; sp.style.top=cy+'px';
        ov.appendChild(sp);
        const mx=(cx+sx)/2+(Math.random()*100-50), my=Math.min(cy,sy)-36-Math.random()*70;
        try{
          sp.animate([
            { transform:'translate(-50%,-50%) translate(0px,0px) scale('+(0.7+Math.random()*0.6).toFixed(2)+')', opacity:1 },
            { transform:'translate(-50%,-50%) translate('+(mx-cx).toFixed(1)+'px,'+(my-cy).toFixed(1)+'px) scale(.85)', opacity:1, offset:.55 },
            { transform:'translate(-50%,-50%) translate('+(sx-cx).toFixed(1)+'px,'+(sy-cy).toFixed(1)+'px) scale(.35)', opacity:.15 }
          ], { duration:640+Math.random()*260, delay:i*45, easing:'cubic-bezier(.3,.4,.2,1)', fill:'backwards' }).onfinish=()=>sp.remove();
        }catch(_){ sp.remove(); }
        setTimeout(()=>{ if (sp.parentNode) sp.remove(); }, 1500);
      }
    });
    setTimeout(()=>{
      const v=document.getElementById('mn-pairs'); if (!v) return;
      v.classList.remove('mn-score-hit'); void v.offsetWidth; v.classList.add('mn-score-hit');
      setTimeout(()=>v.classList.remove('mn-score-hit'), 620);
    }, 640);
  }

  /* the whole wall celebrates when cleared — staggered diagonal wave */
  function _wallCascade(){
    if (REDUCE) return;
    const g=document.getElementById('mn-grid'); if (!g) return;
    [...g.querySelectorAll('.mn-tile')].forEach((el,i)=>{
      el.style.animationDelay=(((i/4)|0)+(i%4))*55+'ms';
      el.classList.add('mn-clear');
    });
  }

  /* ───────── memory loop ───────── */
  function nextQ() {
    if (st.done) return;
    if (st.qNum>=MAXQ || st.pairs>=PAIRS) return end();
    st.answered=false; st.cur=getQ(); st.qNum++;
    _gridLive(false);
    const qc=document.querySelector('#mn-overlay .mn-q-card'); /* visual only — new question slides in */
    if (qc && !REDUCE){ qc.classList.remove('mn-qnew'); void qc.offsetWidth; qc.classList.add('mn-qnew'); }
    document.getElementById('mn-qtext').textContent = QT(st.cur.q);
    const qn=document.getElementById('mn-qnum'); if(qn) qn.textContent=' '+st.qNum;
    const fb=document.getElementById('mn-feedback'); fb.textContent=''; fb.className='mn-feedback';
    const wrap=document.getElementById('mn-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='mn-ans';
      b.style.setProperty('--mn-d', (i*60)+'ms');
      b.innerHTML=`<span class="mn-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    document.getElementById('mn-qbody').classList.remove('flipphase');
    renderTop(); renderBoard(); renderFlips();
  }

  function advanceRivals(strong) {
    const gained=[];
    st.rivals.forEach(r=>{ if (r.pairs<PAIRS && Math.random() < (strong?0.5:0.28)) { r.pairs++; gained.push(r.name); } });
    _rivalPing(gained); /* visual only — their picks flash on the wall */
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
      _gridLive(true);
      renderFlips();
      renderBoard();
    } else {
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      if (window.symLogMistake) { try { window.symLogMistake({ q: st.cur.q, wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Μνημοσύνη', gameId: 'mnemosyne' }); } catch(_){} }
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
    renderGrid(); _fx('flip',{id});
    if (st.sel.length===2) {
      st.locking=true;
      const [a,b]=st.sel.map(i=>st.tiles.find(x=>x.id===i));
      if (a.sym===b.sym) {
        setTimeout(()=>{
          _pairStagger(b.id); _wallClaimPulse(); /* visual only */
          a.matched=b.matched=true; st.pairs++;
          st.sel=[]; st.locking=false; renderGrid(); renderTop(); renderBoard(); _fx('match',{ids:[a.id,b.id]});
          _pairBeam(a.id, b.id); _sparkDrift([a.id, b.id]); /* visual only */
          afterFlip(T('ΖΕΥΓΑΡΙ!','A PAIR!'), 'ok');
        }, 500);
      } else {
        // presentation-only: brief "wrong pair" wobble once the flip settles
        setTimeout(()=>{
          const g=document.getElementById('mn-grid');
          [a,b].forEach(x=>{ const el=g&&g.querySelector('.mn-tile[data-id="'+x.id+'"]'); if(el) el.classList.add('mn-no'); });
          _fx('miss',{ids:[a.id,b.id]});
        }, 430);
        setTimeout(()=>{
          _pairStagger(b.id); /* visual only — second tile turns back a beat later */
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
    if (st.pairs>=PAIRS || st.qNum>=MAXQ || rivalDone) {
      st.done=true;
      if (st.pairs>=PAIRS) _wallCascade(); /* visual only */
      setTimeout(end, 950);
    }
  }

  /* ───────── end ───────── */
  function end() {
    show('mn-screen-end');
    const board = standings();
    const won = board[0].me;
    const title=document.getElementById('mn-end-title'), sub=document.getElementById('mn-end-sub');
    document.getElementById('mn-end-art').innerHTML = owlSVG('mn-end-owl', won);
    let ttxt;
    if (won) {
      ttxt=T('ΤΕΛΕΙΑ ΜΝΗΜΗ','PERFECT RECALL'); title.className='mn-end-title win';
      sub.textContent=T('Θυμήθηκες περισσότερα ζευγάρια από κάθε άλλον. Οι Μούσες σε ευλογούν.','You recalled more pairs than any other. The Muses bless you.');
    } else {
      ttxt=T('Ο ΤΟΙΧΟΣ ΞΕΘΩΡΙΑΖΕΙ','THE WALL FADES'); title.className='mn-end-title lose';
      sub.textContent=T(`Βρήκες ${st.pairs}/${PAIRS} ζευγάρια, στη ${board.findIndex(x=>x.me)+1}η θέση. Νικητής: ${board[0].name}.`,`You found ${st.pairs}/${PAIRS} pairs, in position ${board.findIndex(x=>x.me)+1}. Winner: ${board[0].name}.`);
    }
    title.textContent=ttxt; _decode(title, ttxt);
    document.getElementById('mn-final-board').innerHTML = board.map((x,i)=>
      `<div class="mn-final-row${x.me?' me':''}" style="--mn-d:${140+i*110}ms"><i class="mn-final-bar" style="--w:${(x.pairs/PAIRS*100).toFixed(0)}%"></i><span class="mn-final-pos">${i+1}</span><span class="mn-final-name">${x.name}${i===0?' 🏆':''}</span><span class="mn-final-p">${x.pairs}/${PAIRS}</span></div>`
    ).join('');
    _fx(won?'win':'lose');
  }

  /* ───────── art ───────── */
  function owlSVG(cls, laurel){ return `<svg class="${cls}" viewBox="0 0 140 140" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="mn-o1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FB8C4"/><stop offset="1" stop-color="#35525B"/></linearGradient>
      <radialGradient id="mn-o2" cx="0.5" cy="0.4" r="0.75"><stop offset="0" stop-color="rgba(227,199,102,0.45)"/><stop offset="1" stop-color="rgba(227,199,102,0)"/></radialGradient>
    </defs>
    <circle class="mn-owl-halo" cx="70" cy="68" r="58" fill="url(#mn-o2)"/>
    ${laurel ? `
    <g class="mn-laurel" fill="#C4A448" stroke="#8E7322" stroke-width="0.6" opacity="0.92">
      <ellipse cx="24" cy="98" rx="10" ry="3.6" transform="rotate(-62 24 98)"/>
      <ellipse cx="17" cy="80" rx="10" ry="3.6" transform="rotate(-78 17 80)"/>
      <ellipse cx="15" cy="60" rx="10" ry="3.6" transform="rotate(-92 15 60)"/>
      <ellipse cx="19" cy="41" rx="10" ry="3.6" transform="rotate(-110 19 41)"/>
      <ellipse cx="29" cy="25" rx="10" ry="3.6" transform="rotate(-130 29 25)"/>
      <ellipse cx="116" cy="98" rx="10" ry="3.6" transform="rotate(62 116 98)"/>
      <ellipse cx="123" cy="80" rx="10" ry="3.6" transform="rotate(78 123 80)"/>
      <ellipse cx="125" cy="60" rx="10" ry="3.6" transform="rotate(92 125 60)"/>
      <ellipse cx="121" cy="41" rx="10" ry="3.6" transform="rotate(110 121 41)"/>
      <ellipse cx="111" cy="25" rx="10" ry="3.6" transform="rotate(130 111 25)"/>
    </g>` : ''}
    <path d="M46 32c-7-7-5-16-2.5-21 4.7 4.7 11.7 10.5 9.4 21z" fill="#3E5E66" stroke="#152A30" stroke-width="1.4"/>
    <path d="M94 32c7-7 5-16 2.5-21-4.7 4.7-11.7 10.5-9.4 21z" fill="#3E5E66" stroke="#152A30" stroke-width="1.4"/>
    <path d="M70 26c23 0 37 18 37 43 0 29-18 45-37 45S33 98 33 69c0-25 14-43 37-43z" fill="url(#mn-o1)" stroke="#152A30" stroke-width="2"/>
    <g stroke="#CDE3E8" stroke-width="1.2" opacity="0.4" fill="none">
      <path d="M50 92q20 10 40 0M54 102q16 7 32 0M58 111q12 5 24 0"/>
    </g>
    <circle cx="54" cy="60" r="15.5" fill="#F0EBE0" stroke="#152A30" stroke-width="2"/>
    <circle cx="86" cy="60" r="15.5" fill="#F0EBE0" stroke="#152A30" stroke-width="2"/>
    <g class="mn-owl-eyes">
      <circle cx="54" cy="60" r="6.4" fill="#1A130C"/><circle cx="86" cy="60" r="6.4" fill="#1A130C"/>
      <circle cx="56.2" cy="57.6" r="1.9" fill="#F0EBE0" opacity="0.9"/><circle cx="88.2" cy="57.6" r="1.9" fill="#F0EBE0" opacity="0.9"/>
    </g>
    <path d="M70 66l-6.5 10h13z" fill="#C4A448" stroke="#8E7322" stroke-width="1"/>
  </svg>`; }

  function rosetteSVG(){
    const petals = Array.from({length:8},(_,i)=>
      `<ellipse cx="24" cy="14.6" rx="3.1" ry="6.6" transform="rotate(${i*45} 24 24)"/>`).join('');
    return `<svg viewBox="0 0 48 48" class="mn-rosette" aria-hidden="true" fill="none" stroke="currentColor">
    <circle cx="24" cy="24" r="17.5" stroke-width="1.1"/>
    <circle cx="24" cy="24" r="15" stroke-width="0.6" opacity="0.5" stroke-dasharray="1.4 3.4"/>
    <g stroke-width="0.9" fill="currentColor" fill-opacity="0.16" opacity="0.9">${petals}</g>
    <circle cx="24" cy="24" r="5.4" stroke-width="0.8" opacity="0.75"/>
    <circle cx="24" cy="24" r="3" fill="#D9B75A" fill-opacity="0.85" stroke="#8E7322" stroke-width="0.7"/>
    <circle cx="24" cy="24" r="1" fill="#F6E7A9" stroke="none"/>
  </svg>`; }

  /* ───────── river-of-memory ambient (canvas, procedural) ───────── */
  const River = (() => {
    let cv=null, ctx=null, raf=0, on=false, w=0, h=0, t0=0, glyphs=[], motes=[];
    const CH='ΜΝΗΜΟΣΥΝΑΛΘΕΙΩΦΚΡ';
    function ensure(){
      cv=document.getElementById('mn-river');
      if(!cv) return false;
      ctx=cv.getContext('2d');
      resize(); return true;
    }
    function resize(){
      if(!cv||!cv.parentElement) return;
      const r=cv.parentElement.getBoundingClientRect();
      const dpr=Math.min(window.devicePixelRatio||1, 1.5);
      w=Math.max(320, r.width); h=Math.max(320, r.height);
      cv.width=w*dpr; cv.height=h*dpr;
      ctx.setTransform(dpr,0,0,dpr,0,0);
      seed();
    }
    function seed(){
      glyphs=Array.from({length: Math.round(Math.min(22, w/60))}, ()=>({
        x:Math.random()*w, y:h*(0.12+Math.random()*0.8),
        v:6+Math.random()*16, s:11+Math.random()*15,
        ch:CH[(Math.random()*CH.length)|0],
        ph:Math.random()*Math.PI*2, o:0.05+Math.random()*0.1,
      }));
      motes=Array.from({length:10}, ()=>({
        x:Math.random()*w, y:h*(0.1+Math.random()*0.85),
        v:3+Math.random()*8, r:0.8+Math.random()*1.7,
        ph:Math.random()*Math.PI*2,
      }));
    }
    function stream(t, yBase, amp, speed, alpha, width){
      ctx.beginPath();
      for(let x=-40;x<=w+40;x+=22){
        const y=yBase + Math.sin(x*0.0042 + t*speed)*amp + Math.sin(x*0.0011 - t*speed*0.6)*amp*0.6;
        x<=-40 ? ctx.moveTo(x,y) : ctx.lineTo(x,y);
      }
      ctx.strokeStyle='rgba(94,139,150,'+alpha+')';
      ctx.lineWidth=width; ctx.lineCap='round'; ctx.stroke();
    }
    function frame(now){
      if(!on) return;
      if(document.hidden){ raf=requestAnimationFrame(frame); return; }
      const t=(now-t0)/1000;
      ctx.clearRect(0,0,w,h);
      // memory currents
      stream(t, h*0.24, 14, 0.30, 0.045, 46);
      stream(t, h*0.24, 14, 0.30, 0.10, 1.4);
      stream(t, h*0.52, 18, 0.22, 0.04, 60);
      stream(t, h*0.52, 18, 0.22, 0.085, 1.2);
      stream(t, h*0.80, 12, 0.36, 0.05, 40);
      stream(t, h*0.80, 12, 0.36, 0.11, 1.4);
      // drifting memory glyphs
      ctx.textBaseline='middle';
      glyphs.forEach(g=>{
        g.x+=g.v/60; if(g.x>w+30){ g.x=-30; g.y=h*(0.1+Math.random()*0.82); g.ch=CH[(Math.random()*CH.length)|0]; }
        const pulse=0.5+0.5*Math.sin(t*0.7+g.ph);
        ctx.font='400 '+g.s+'px Alegreya, Georgia, serif';
        ctx.fillStyle='rgba(127,176,188,'+(g.o*(0.4+pulse)).toFixed(3)+')';
        ctx.fillText(g.ch, g.x, g.y + Math.sin(t*0.6+g.ph)*7);
      });
      // gold motes
      motes.forEach(m=>{
        m.x+=m.v/60; if(m.x>w+10){ m.x=-10; m.y=h*(0.1+Math.random()*0.85); }
        const a=0.10+0.10*Math.sin(t*0.9+m.ph);
        ctx.beginPath();
        ctx.arc(m.x, m.y+Math.sin(t*0.5+m.ph)*9, m.r, 0, Math.PI*2);
        ctx.fillStyle='rgba(227,199,102,'+a.toFixed(3)+')';
        ctx.fill();
      });
      raf=requestAnimationFrame(frame);
    }
    function staticFrame(){
      ctx.clearRect(0,0,w,h);
      stream(1.7, h*0.24, 14, 0.3, 0.05, 46);
      stream(1.7, h*0.52, 18, 0.22, 0.045, 60);
      stream(1.7, h*0.80, 12, 0.36, 0.05, 40);
    }
    function start(){
      if(!ensure()) return;
      if(REDUCE){ staticFrame(); return; }
      if(on) return;
      on=true; t0=performance.now();
      window.addEventListener('resize', resize);
      raf=requestAnimationFrame(frame);
    }
    function stop(){
      on=false;
      if(raf) cancelAnimationFrame(raf); raf=0;
      window.removeEventListener('resize', resize);
    }
    return { start, stop };
  })();

  /* ───────── juice: SymFX hooks on the internal fx bus ───────── */
  window.addEventListener('mn:fx', (e)=>{
    const d=(e && e.detail)||{}, fx=window.SymFX;
    if(!fx) return;
    const grid=document.getElementById('mn-grid');
    const tileEl=id=>grid && grid.querySelector('.mn-tile[data-id="'+id+'"]');
    switch(d.type){
      case 'correct':
        if(d.el) fx.burstAt(d.el,{count:14, colors:['#E3C766','#7FB0BC','#F0EBE0'], power:7, life:900});
        break;
      case 'wrong': {
        const c=document.querySelector('#mn-overlay .mn-q-card');
        fx.shake(7, 0.4, c);
        fx.flash('#9E3B2E', 0.09, 0.4);
        break;
      }
      case 'miss':
        if(grid) fx.shake(4, 0.28, grid);
        break;
      case 'match': {
        (d.ids||[]).forEach(id=>{ const el=tileEl(id); if(el) fx.burstAt(el,{count:11, colors:['#E3C766','#C4A448','#FFF6DC'], power:6, life:950}); });
        fx.pop(document.getElementById('mn-pairs'), 1.3);
        if(grid && !fx.reduce){
          const r=grid.getBoundingClientRect();
          fx.combo(T('ΖΕΥΓΑΡΙ!','A PAIR!'), r.left+r.width/2, r.top+r.height/2, {size:32, color:'#E3C766', rise:70});
        }
        break;
      }
      case 'win': {
        fx.flash('#E3C766', 0.14, 0.7);
        const art=document.getElementById('mn-end-art');
        setTimeout(()=>{ if(art) fx.burstAt(art,{count:26, colors:['#E3C766','#7FB0BC','#F0EBE0'], power:10, life:1400}); }, 250);
        break;
      }
      case 'lose':
        fx.flash('#5E8B96', 0.07, 0.6);
        break;
    }
  });

  return { open, close, _start, syncLang };
})();
window.Mnemosyne = Mnemosyne;

/* ── Games-Panel entry points ── */
window.openMnemosyne  = function(gp){ Mnemosyne.open(gp || {}); };
window.closeMnemosyne = function(){ Mnemosyne.close(); };
