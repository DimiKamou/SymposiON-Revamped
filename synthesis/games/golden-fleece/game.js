/* ══════════════════ ΧΡΥΣΟΜΑΛΛΟΝ ΔΕΡΑΣ — engine ══════════════════
   Gold Quest reimagined as the voyage of the Argo.
   API:  GoldenFleece.open()   GoldenFleece.close()
   Reads window.SYM_QUESTIONS and window.siteLang ('gr'|'en').
═══════════════════════════════════════════════════════════════════ */
const GoldenFleece = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  // Question source. The Games-Panel bridge fills window.GF_Q with MC items
  // {q:{gr,en}, a:[4], c} at launch; standalone falls back to SYM_QUESTIONS.
  const _gpPool = () => {
    const g = window.GF_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const TOTAL = 10;            // questions per voyage
  const RIVAL_NAMES = ['ΗΡΑΚΛΗΣ','ΟΡΦΕΥΣ','ΑΤΑΛΑΝΤΗ','ΚΑΣΤΩΡ','ΘΗΣΕΥΣ','ΠΟΛΥΔΕΥΚΗΣ'];

  let st = {};
  let _cfg = {};

  /* ───────── public ───────── */
  function open(gp) {
    _cfg = gp || {};
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#gf-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('gf-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('gf-screen-intro')) build();
    syncLang();
    show('gf-screen-intro');
    _showMode();
  }
  function close() {
    const ov = document.getElementById('gf-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Build the overlay shell on demand (drop-in: works with or without host markup).
  function _ensureOverlay(gp) {
    if (document.getElementById('gf-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'gf-overlay';
    ov.className = 'game-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="GoldenFleece._tryClose()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΧΡΥΣΟΜΑΛΛΟΝ ΔΕΡΑΣ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="gf-wrap"></div></div>';
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
    document.getElementById('gf-wrap').innerHTML = `
<!-- INTRO -->
<div id="gf-screen-intro" class="gf-screen">
  ${fleeceSVG('gf-fleece')}
  <div class="gf-logo">ΧΡΥΣΟΜΑΛΛΟΝ ΔΕΡΑΣ</div>
  <div class="gf-logo-en" data-i18n="subtitle"></div>
  <div class="gf-intro-txt" data-i18n="intro"></div>
  <div id="gf-mode-area"></div>
</div>

<!-- GAME -->
<div id="gf-screen-game" class="gf-screen">
  <div class="gf-top">
    <div class="gf-purse">
      ${coinSVG('gf-purse-coin')}
      <div class="gf-purse-txt">
        <span class="gf-purse-lbl" data-i18n="yourgold"></span>
        <span class="gf-purse-val" id="gf-gold">0</span>
      </div>
    </div>
    <div class="gf-voyage">
      <div class="gf-voyage-lbls"><span data-i18n="iolcus"></span><span data-i18n="colchis"></span></div>
      <div class="gf-voyage-track"><div class="gf-voyage-fill" id="gf-fill"></div><div class="gf-argo" id="gf-argo">⛵</div></div>
    </div>
    <div class="gf-rank" id="gf-rank">—</div>
  </div>
  <div class="gf-board" id="gf-board"></div>
  <div class="gf-qbody">
    <div class="gf-q-meta"><span class="gf-q-num" id="gf-qnum"></span><span class="gf-q-line"></span></div>
    <div class="gf-q-card"><div class="gf-q-text" id="gf-qtext"></div></div>
    <div class="gf-answers" id="gf-answers"></div>
    <div class="gf-feedback" id="gf-feedback"></div>
  </div>
</div>

<!-- PICK -->
<div id="gf-screen-pick" class="gf-screen">
  <div class="gf-pick-head" data-i18n="pickhead"></div>
  <div class="gf-pick-sub" data-i18n="picksub"></div>
  <div class="gf-pots" id="gf-pots"></div>
  <div class="gf-outcome" id="gf-outcome"></div>
</div>

<!-- END -->
<div id="gf-screen-end" class="gf-screen">
  <div id="gf-end-art"></div>
  <div class="gf-end-title" id="gf-end-title"></div>
  <div class="gf-end-sub" id="gf-end-sub"></div>
  <div class="gf-final-board" id="gf-final-board"></div>
  <div class="gf-end-btns">
    <button class="sym-btn" onclick="GoldenFleece._showMode()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="GoldenFleece.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    subtitle:{ gr:'Το ταξίδι της Αργούς', en:'The Voyage of the Argo' },
    intro:   { gr:'Σαλπάρεις με τους Αργοναύτες προς την <b>Κολχίδα</b>. Σε κάθε σωστή απάντηση, διάλεξε έναν πίθο — χρυσός, αρπαγή, ανταλλαγή… ή ο <b>πίθος της Πανδώρας</b>. Πρώτος σε χρυσό στην Κολχίδα κερδίζει το Δέρας.', en:'You sail with the Argonauts toward <b>Colchis</b>. On each correct answer, choose a jar — gold, theft, a swap… or <b>Pandora’s Jar</b>. Whoever holds the most gold at Colchis claims the Fleece.' },
    setsail: { gr:'ΑΠΟΠΛΟΥΣ', en:'SET SAIL' },
    yourgold:{ gr:'Ο ΧΡΥΣΟΣ ΣΟΥ', en:'YOUR GOLD' },
    iolcus:  { gr:'ΙΩΛΚΟΣ', en:'IOLCUS' },
    colchis: { gr:'ΚΟΛΧΙΣ', en:'COLCHIS' },
    pickhead:{ gr:'ΔΙΑΛΕΞΕ ΕΝΑΝ ΠΙΘΟ', en:'CHOOSE A JAR' },
    picksub: { gr:'Η τύχη των θεών κρύβεται μέσα.', en:'The fortune of the gods hides within.' },
    again:   { gr:'ΝΕΟ ΤΑΞΙΔΙ', en:'NEW VOYAGE' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#gf-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    // live-translate the current question + standings if a voyage is in progress
    if (st && st.cur && document.getElementById('gf-screen-game').classList.contains('active')) {
      document.getElementById('gf-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum+' / '+TOTAL;
      document.getElementById('gf-qtext').textContent = st.cur.q[L()];
      renderBoard();
    }
  }
  function show(id){ document.querySelectorAll('#gf-wrap .gf-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); }

  /* ───────── leave confirmation ───────── */
  function _tryClose() {
    const gameActive = document.getElementById('gf-screen-game')?.classList.contains('active');
    const pickActive = document.getElementById('gf-screen-pick')?.classList.contains('active');
    if ((gameActive || pickActive) && st && st.qNum > 0) {
      _showLeaveConfirm();
    } else {
      close();
      if (typeof openGamesPanel === 'function') openGamesPanel();
    }
  }
  function _showLeaveConfirm() {
    document.getElementById('gf-leave-modal')?.remove();
    const L2 = L();
    const el = document.createElement('div');
    el.id = 'gf-leave-modal';
    el.className = 'gf-leave-modal';
    el.innerHTML =
      '<div class="gf-leave-box">' +
        '<div class="gf-leave-msg">' + (L2==='en'?'Leave the game? Your progress will be lost.':'Έξοδος από το παιχνίδι; Η πρόοδός σου θα χαθεί.') + '</div>' +
        '<div class="gf-leave-btns">' +
          '<button class="gf-leave-yes" onclick="GoldenFleece._doLeave()">' + (L2==='en'?'LEAVE':'ΕΞΟΔΟΣ') + '</button>' +
          '<button class="gf-leave-no" onclick="document.getElementById(\'gf-leave-modal\').remove()">' + (L2==='en'?'STAY':'ΜΕΙΝΕ') + '</button>' +
        '</div>' +
      '</div>';
    const ov = document.getElementById('gf-overlay');
    if (ov) ov.appendChild(el);
  }
  function _doLeave() {
    document.getElementById('gf-leave-modal')?.remove();
    close();
    if (typeof openGamesPanel === 'function') openGamesPanel();
  }

  /* ───────── mode screen ───────── */
  function _showMode() {
    const area = document.getElementById('gf-mode-area');
    if (!area) return;
    const L2 = L();
    area.innerHTML =
      '<div class="gf-mode-btns">' +
        '<button class="gf-mode-btn" onclick="GoldenFleece._pickSolo()">' +
          '<span class="gf-mode-icon">⚔️</span>' +
          '<span class="gf-mode-lbl">' + (L2==='en'?'SOLO':'ΜΟΝΟΣ') + '</span>' +
          '<span class="gf-mode-sub">' + (L2==='en'?'Play with AI rivals':'Παιχνίδι με AI αντιπάλους') + '</span>' +
        '</button>' +
        '<button class="gf-mode-btn gf-mode-btn-vs" onclick="GoldenFleece._pickVs()">' +
          '<span class="gf-mode-icon">🌐</span>' +
          '<span class="gf-mode-lbl">' + (L2==='en'?'LIVE VS':'ΖΩΝΤΑΝΟ VS') + '</span>' +
          '<span class="gf-mode-sub">' + (L2==='en'?'Live Arena · multiple players':'Live Arena · πολλοί παίκτες') + '</span>' +
        '</button>' +
      '</div>';
  }

  function _pickSolo() {
    const area = document.getElementById('gf-mode-area');
    if (!area) return;
    const L2 = L(), maxR = RIVAL_NAMES.length;
    const rv = L2==='en' ? 'RIVALS' : 'ΑΝΤΙΠΑΛΟΙ';
    area.innerHTML =
      '<div class="gf-bot-cfg">' +
        '<div class="gf-bot-q">' + (L2==='en'?'How many AI rivals?':'Πόσους AI αντιπάλους θέλεις;') + '</div>' +
        '<div class="gf-bot-opts">' +
          '<button class="gf-bot-btn" onclick="GoldenFleece._start(0)">' + (L2==='en'?'SAIL ALONE':'ΜΟΝΟΣ ΣΑΛΠΑΡΩ') + '</button>' +
          '<button class="gf-bot-btn" onclick="GoldenFleece._start(2)">2 ' + rv + '</button>' +
          '<button class="gf-bot-btn" onclick="GoldenFleece._start(4)">4 ' + rv + '</button>' +
          '<button class="gf-bot-btn gf-bot-btn-max" onclick="GoldenFleece._start(' + maxR + ')">' + maxR + ' ' + rv + ' ★</button>' +
        '</div>' +
        '<button class="gf-bot-back" onclick="GoldenFleece._showMode()">‹ ' + (L2==='en'?'BACK':'ΠΙΣΩ') + '</button>' +
      '</div>';
  }

  function _pickVs() {
    const questions = _gpPool().map(item => ({
      q:    (item.q && typeof item.q === 'object') ? (item.q[L()] || item.q.gr || '') : String(item.q || ''),
      opts: item.a || [],
      ans:  typeof item.c === 'number' ? item.c : 0,
    })).filter(q => q.q && q.opts.length === 4);
    close();
    if (typeof LiveArena !== 'undefined') {
      if (questions.length) {
        LiveArena.launchHost({ questions, gameName: (_cfg && _cfg.title) || T('Χρυσόμαλλον Δέρας — Live','Golden Fleece — Live') });
      } else {
        LiveArena.launchPicker();
      }
    }
  }

  /* ───────── start ───────── */
  function _start(rivalCount) {
    const rc = (rivalCount == null) ? RIVAL_NAMES.length : Math.max(0, Math.min(+rivalCount, RIVAL_NAMES.length));
    st = {
      gold:0, qNum:0, answered:false,
      pool: shuffle([..._gpPool()]), idx:0,
      rivals: RIVAL_NAMES.slice(0, rc).map(n=>({ name:n, gold: 200 + ((Math.random()*250)|0) })),
    };
    show('gf-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  /* leaderboard */
  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), gold:st.gold, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.gold-a.gold);
    return all;
  }
  function myRank(){ return standings().findIndex(x=>x.me)+1; }

  function renderBoard() {
    const board=standings();
    document.getElementById('gf-board').innerHTML = board.slice(0,4).map((x,i)=>
      `<div class="gf-board-chip${x.me?' me':''}"><span class="gf-board-rank">${i+1}</span><span class="gf-board-name">${x.name}</span><span class="gf-board-gold">${x.gold}</span></div>`
    ).join('');
    const r=myRank(), n=board.length;
    document.getElementById('gf-rank').textContent = T(`ΘΕΣΗ ${r}/${n}`,`RANK ${r}/${n}`);
    document.getElementById('gf-gold').textContent = st.gold;
    const pct = Math.min(100, (st.qNum/TOTAL)*100);
    document.getElementById('gf-fill').style.width = pct+'%';
    document.getElementById('gf-argo').style.left = pct+'%';
  }

  /* rivals drift upward each round */
  function advanceRivals(){ st.rivals.forEach(r=> r.gold += 40 + ((Math.random()*160)|0)); }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.qNum >= TOTAL) return end();
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('gf-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum+' / '+TOTAL;
    document.getElementById('gf-qtext').textContent = st.cur.q[L()];
    const fb=document.getElementById('gf-feedback'); fb.textContent=''; fb.className='gf-feedback';
    const wrap=document.getElementById('gf-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='gf-ans';
      b.innerHTML=`<span class="gf-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderBoard();
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#gf-answers .gf-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('gf-feedback');
    advanceRivals();
    if (chosen===st.cur.c) {
      fb.textContent=T('ΣΩΣΤΟ — διάλεξε πίθο','CORRECT — choose a jar'); fb.className='gf-feedback gf-fb-ok';
      setTimeout(showPick, 1000);
    } else {
      btn.classList.add('wrong');
      if (window.symLogMistake) { try { window.symLogMistake({ q: st.cur.q[L()], wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Χρυσόμαλλον Δέρας', gameId: 'golden-fleece' }); } catch (_) {} }
      fb.textContent=T('ΛΑΘΟΣ — οι αντίπαλοι κερδίζουν έδαφος','WRONG — rivals gain ground'); fb.className='gf-feedback gf-fb-bad';
      renderBoard();
      setTimeout(()=>{ if(st.qNum>=TOTAL) end(); else nextQ(); }, 1700);
    }
  }

  /* ───────── pithos pick ───────── */
  function makeOutcomes() {
    const base = 120 + st.qNum*25;
    const g = (m)=> Math.round((base*m + Math.random()*60)/5)*5;
    // weighted pool, then cap specials
    const pool = [];
    const r = Math.random();
    // always at least a couple gold jars
    pool.push({ type:'gold', amt:g(0.6+Math.random()*0.6) });
    pool.push({ type:'gold', amt:g(1.2+Math.random()*1.1) });
    // Pandora only bites once the player has gold worth losing
    const canPandora = st.gold >= 80;
    if (r < 0.30 && canPandora) pool.push({ type:'pandora' });
    else if (r < 0.55) pool.push({ type:'steal' });
    else if (r < 0.75) pool.push({ type:'swap' });
    else pool.push({ type:'gold', amt:g(1.8+Math.random()*1.4) });
    return shuffle(pool);
  }

  function showPick() {
    show('gf-screen-pick');
    document.getElementById('gf-outcome').innerHTML='';
    const outs = makeOutcomes();
    st.outs = outs;
    const wrap=document.getElementById('gf-pots'); wrap.innerHTML='';
    outs.forEach((o,i)=>{
      const el=document.createElement('div'); el.className='gf-pot'; el.dataset.i=i;
      el.innerHTML = `${pithosSVG('gf-pot-jar')}
        <div class="gf-pot-base">${T('ΠΙΘΟΣ','JAR')} ${['Α','Β','Γ'][i]}</div>
        <div class="gf-pot-reveal" id="gf-rev-${i}"></div>`;
      el.onclick=()=>pickPot(i);
      wrap.appendChild(el);
    });
  }

  function outcomeView(o) {
    if (o.type==='gold')    return { icon:'🪙', amt:'+'+o.amt, cls:'gain',  tag:T('ΧΡΥΣΟΣ','GOLD') };
    if (o.type==='pandora') return { icon:'🏺', amt:'−'+o.lost, cls:'loss', tag:T('ΠΑΝΔΩΡΑ','PANDORA') };
    if (o.type==='steal')   return { icon:'🪽', amt:'+'+o.amt, cls:'steal', tag:T('ΑΡΠΑΓΗ','THEFT') };
    if (o.type==='swap')    return { icon:'🔄', amt:'⇄', cls:'steal', tag:T('ΑΝΤΑΛΛΑΓΗ','SWAP') };
  }

  function pickPot(i) {
    document.querySelectorAll('.gf-pot').forEach(p=>p.style.pointerEvents='none');
    const chosen = st.outs[i];

    // resolve dynamic amounts now (relative to current standings)
    const board = standings();
    const leader = board.find(x=>!x.me) || board[0];
    if (chosen.type==='steal')   chosen.amt = Math.round((leader.gold*0.25)/5)*5;
    if (chosen.type==='pandora') chosen.lost = Math.min(st.gold, Math.round((st.gold*0.5)/5)*5);

    // reveal all three
    st.outs.forEach((o,k)=>{
      if (o.type==='steal' && o.amt==null) o.amt = Math.round((leader.gold*0.25)/5)*5;
      if (o.type==='pandora' && o.lost==null) o.lost = Math.min(st.gold, Math.round((st.gold*0.5)/5)*5);
      const v=outcomeView(o);
      const pot=document.querySelector(`.gf-pot[data-i="${k}"]`);
      document.getElementById('gf-rev-'+k).innerHTML =
        `<div class="gf-reveal-icon">${v.icon}</div><div class="gf-reveal-amt ${v.cls}">${v.amt}</div><div class="gf-reveal-tag">${v.tag}</div>`;
      pot.classList.add('revealed');
      if (k===i) pot.classList.add('picked'); else pot.classList.add('dim');
    });

    setTimeout(()=>applyOutcome(chosen, leader), 700);
  }

  function applyOutcome(o, leader) {
    const ob = document.getElementById('gf-outcome');
    let big='', desc='', cls='gain';
    if (o.type==='gold') {
      st.gold += o.amt; cls='gain'; coinBurst();
      big=T(`+${o.amt} ΧΡΥΣΟΣ`,`+${o.amt} GOLD`);
      desc=T('Ο πίθος ξεχείλιζε από χρυσές δραχμές.','The jar brimmed with golden drachmas.');
    } else if (o.type==='steal') {
      const rival = st.rivals.find(r=>r.name===leader.name);
      const amt = Math.min(o.amt, rival? rival.gold : o.amt);
      if (rival) rival.gold -= amt;
      st.gold += amt; cls='steal'; coinBurst();
      big=T(`ΑΡΠΑΓΗ +${amt}`,`THEFT +${amt}`);
      desc=T(`Ο Ερμής έκλεψε χρυσό από τον/την ${leader.name}.`,`Hermes stole gold from ${leader.name}.`);
    } else if (o.type==='swap') {
      const idx=(Math.random()*st.rivals.length)|0; const rv=st.rivals[idx];
      const tmp=st.gold; st.gold=rv.gold; rv.gold=tmp; cls='steal';
      big=T('ΑΝΤΑΛΛΑΓΗ','SWAP');
      desc=T(`Αντάλλαξες θησαυρό με τον/την ${rv.name}.`,`You swapped fortunes with ${rv.name}.`);
    } else { // pandora
      st.gold = Math.max(0, st.gold - o.lost); cls='loss';
      big=T(`ΠΙΘΟΣ ΠΑΝΔΩΡΑΣ −${o.lost}`,`PANDORA’S JAR −${o.lost}`);
      desc=T('Άνοιξες το μοιραίο πιθάρι· τα δεινά σκόρπισαν τον χρυσό σου.','You opened the fateful jar; its evils scattered your gold.');
    }
    ob.innerHTML = `<div class="gf-outcome-big ${cls}">${big}</div><div class="gf-outcome-desc">${desc}</div>
      <button class="sym-btn gf-outcome-cont" onclick="GoldenFleece._cont()">${T('ΣΥΝΕΧΕΙΑ','CONTINUE')}</button>`;
  }

  function _cont() {
    show('gf-screen-game');
    if (st.qNum>=TOTAL) end(); else nextQ();
  }

  /* ───────── end ───────── */
  function end() {
    show('gf-screen-end');
    const board = standings();
    const won = board[0].me;
    document.getElementById('gf-end-art').innerHTML = fleeceSVG('gf-end-fleece');
    const title=document.getElementById('gf-end-title');
    const sub=document.getElementById('gf-end-sub');
    if (won) {
      title.textContent=T('ΤΟ ΔΕΡΑΣ ΕΙΝΑΙ ΔΙΚΟ ΣΟΥ','THE FLEECE IS YOURS'); title.className='gf-end-title win';
      sub.textContent=T('Έφτασες πρώτος στην Κολχίδα και άρπαξες το Χρυσόμαλλο Δέρας από το ιερό άλσος του Άρη.','You reached Colchis first and seized the Golden Fleece from the sacred grove of Ares.');
    } else {
      title.textContent=T('ΤΟ ΤΑΞΙΔΙ ΤΕΛΕΙΩΣΕ','THE VOYAGE ENDS'); title.className='gf-end-title lose';
      sub.textContent=T(`Έφτασες στην Κολχίδα στη ${myRank()}η θέση. Το Δέρας πήγε στον/στην ${board[0].name}.`,`You reached Colchis in position ${myRank()}. The Fleece went to ${board[0].name}.`);
    }
    document.getElementById('gf-final-board').innerHTML = board.map((x,i)=>
      `<div class="gf-final-row${x.me?' me':''}"><span class="gf-final-pos">${i+1}</span><span class="gf-final-name">${x.name}${i===0?' 🏆':''}</span><span class="gf-final-gold">${x.gold}</span></div>`
    ).join('');
    if (won) coinBurst();
  }

  /* ───────── coins ───────── */
  function coinBurst() {
    const cx=window.innerWidth/2, cy=window.innerHeight*0.4;
    for(let i=0;i<22;i++){
      const el=document.createElement('div'); el.className='gf-coin'; el.textContent='🪙';
      el.style.left=cx+'px'; el.style.top=cy+'px'; document.body.appendChild(el);
      const ang=Math.random()*Math.PI*2, sp=4+Math.random()*8;
      let vx=Math.cos(ang)*sp, vy=Math.sin(ang)*sp-7, x=0,y=0,life=1;
      const tick=()=>{ x+=vx; y+=vy; vy+=0.4; life-=0.02;
        el.style.transform=`translate(${x}px,${y}px) rotate(${x*4}deg)`; el.style.opacity=life;
        if(life>0) requestAnimationFrame(tick); else el.remove(); };
      requestAnimationFrame(tick);
    }
  }

  /* ───────── art ───────── */
  function fleeceSVG(cls){ return `<svg class="${cls}" viewBox="0 0 120 120" fill="none">
    <defs><radialGradient id="gf-g1" cx="42%" cy="36%"><stop offset="0" stop-color="#E3C766"/><stop offset="0.6" stop-color="#C4A448"/><stop offset="1" stop-color="#8E7322"/></radialGradient></defs>
    <path d="M60 18c14 0 22 8 24 18 8 2 12 9 10 17-2 7-9 10-9 10s2 9-6 14c-6 4-13 2-13 2s-4 8-16 8-15-8-15-8-8 2-14-3c-7-6-4-14-4-14s-7-4-8-12 5-14 11-15c2-10 11-18 26-17z" fill="url(#gf-g1)" stroke="#6E5A1E" stroke-width="2"/>
    <g stroke="#9A7E2A" stroke-width="1.6" opacity="0.65"><path d="M44 44c4 4 4 9 1 13M60 40c3 5 3 10 0 15M76 44c-4 4-4 9-1 13M52 60c3 4 3 9 0 13M68 60c-3 4-3 9 0 13"/></g>
    <circle cx="48" cy="40" r="3" fill="#5A4711"/><circle cx="72" cy="40" r="3" fill="#5A4711"/>
  </svg>`; }

  function pithosSVG(cls){ return `<svg class="${cls}" viewBox="0 0 118 140" fill="none">
    <defs><linearGradient id="gf-j" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9B5432"/><stop offset="1" stop-color="#6B3820"/></linearGradient></defs>
    <path d="M44 16h30l-3 8c10 5 17 16 17 30 0 24-14 50-28 50S32 78 32 54c0-14 7-25 17-30z" fill="url(#gf-j)" stroke="#3A2012" stroke-width="2.5"/>
    <path d="M40 30h38" stroke="#3A2012" stroke-width="2.5"/>
    <ellipse cx="59" cy="58" rx="22" ry="9" fill="none" stroke="#E8C99A" stroke-width="2" opacity="0.5"/>
    <path d="M48 74c7 5 15 5 22 0" stroke="#E8C99A" stroke-width="2" opacity="0.4" fill="none"/>
    <path d="M44 16c-6-2-10-6-10-10M74 16c6-2 10-6 10-10" stroke="#3A2012" stroke-width="2.5" fill="none"/>
  </svg>`; }

  function coinSVG(cls){ return `<svg class="${cls}" viewBox="0 0 64 64" fill="none"><circle cx="32" cy="32" r="26" fill="#C4A448" stroke="#8E7322" stroke-width="2"/><circle cx="32" cy="32" r="20" fill="none" stroke="#E3C766" stroke-width="1.5"/><text x="32" y="43" font-family="Cinzel,serif" font-size="28" fill="#5A4711" text-anchor="middle" font-weight="700">Α</text></svg>`; }

  return { open, close, _start, _tryClose, _doLeave, _showMode, _pickSolo, _pickVs, _cont, syncLang };
})();
window.GoldenFleece = GoldenFleece;

/* ── Games-Panel entry points ── */
window.openGoldenFleece  = function(gp){ GoldenFleece.open(gp || {}); };
window.closeGoldenFleece = function(){ GoldenFleece.close(); };
