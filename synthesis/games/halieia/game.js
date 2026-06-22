/* ══════════════════ ΑΛΙΕΙΑ — engine ══════════════════
   Fishing Frenzy reimagined. Answer right, then step to the shore as an
   ancient angler and CAST YOUR LINE where you choose — the safe shallows
   (ΑΚΤΗ), the open sea (ΠΕΛΑΓΟΣ), or the rich & dangerous deep (ΒΥΘΟΣ).
   Reel in a catch; consecutive catches build a FRENZY multiplier. A wrong
   answer or a sea-monster snaps it. Biggest haul of drachmas wins.
   API:  Halieia.open()  Halieia.close()
   Reads window.SYM_QUESTIONS and window.siteLang ('gr'|'en').
═══════════════════════════════════════════════════════════════════════ */
const Halieia = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  // Question source. The Games-Panel bridge fills window.AL_Q with MC items
  // {q:{gr,en}, a:[4], c} at launch; standalone falls back to SYM_QUESTIONS.
  const _gpPool = () => {
    const g = window.AL_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const TOTAL = 10;
  const ROD = { x:250, y:172 };
  const RIVALS = [
    { name:'ΓΛΑΥΚΟΣ', skill:0.72 },
    { name:'ΝΗΡΕΥΣ',  skill:0.64 },
    { name:'ΦΟΡΚΥΣ',  skill:0.56 },
    { name:'ΤΡΙΤΩΝ',  skill:0.50 },
  ];

  const FISH = {
    sardine: { emoji:'🐟', lo:20,  hi:45,  cls:'gain', nm:{gr:'ΣΑΡΔΕΛΑ',en:'SARDINE'} },
    mackerel:{ emoji:'🐠', lo:45,  hi:80,  cls:'gain', nm:{gr:'ΣΚΟΥΜΠΡΙ',en:'MACKEREL'} },
    tuna:    { emoji:'🦈', lo:90,  hi:150, cls:'gain', nm:{gr:'ΤΟΝΟΣ',en:'TUNA'} },
    octopus: { emoji:'🐙', cls:'steal',    nm:{gr:'ΧΤΑΠΟΔΙ — ΑΡΠΑΓΗ',en:'OCTOPUS — STEAL'} },
    golden:  { emoji:'🐡', lo:220, hi:340, cls:'big',  nm:{gr:'ΧΡΥΣΟ ΨΑΡΙ',en:'GOLDEN FISH'} },
    amphora: { emoji:'🏺', lo:320, hi:480, cls:'big',  nm:{gr:'ΑΜΦΟΡΕΑΣ ΘΗΣΑΥΡΟΥ',en:'TREASURE AMPHORA'} },
    monster: { emoji:'🐉', cls:'bad',      nm:{gr:'Η ΣΚΥΛΛΑ',en:'SCYLLA'} },
    empty:   { emoji:'🕳️', cls:'bad',      nm:{gr:'ΑΔΕΙΟ ΔΙΧΤΥ',en:'EMPTY NET'} },
  };
  const ZONES = [
    { key:'shallow', nm:{gr:'ΑΚΤΗ',en:'SHORE'},     hint:{gr:'ασφαλές',en:'safe'},            target:[365,300],
      table:[['sardine',42],['mackerel',34],['tuna',16],['golden',3],['empty',5]] },
    { key:'open',    nm:{gr:'ΠΕΛΑΓΟΣ',en:'OPEN SEA'},hint:{gr:'ισορροπία',en:'balanced'},      target:[595,322],
      table:[['sardine',16],['mackerel',26],['tuna',24],['octopus',9],['golden',11],['amphora',5],['monster',5],['empty',4]] },
    { key:'deep',    nm:{gr:'ΒΥΘΟΣ',en:'THE DEEP'},  hint:{gr:'ρίσκο · θησαυρός',en:'risk · treasure'}, target:[820,348],
      table:[['tuna',20],['octopus',13],['golden',22],['amphora',16],['monster',18],['empty',11]] },
  ];

  let st = {};
  let _cfg = {};

  /* ───────── public ───────── */
  function open(gp) {
    _cfg = gp || {};
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#al-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('al-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('al-screen-intro')) build();
    syncLang();
    show('al-screen-intro');
    _showMode();
  }
  function close() {
    const ov = document.getElementById('al-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Build the overlay shell on demand (drop-in: works with or without host markup).
  function _ensureOverlay(gp) {
    if (document.getElementById('al-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'al-overlay';
    ov.className = 'game-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="Halieia._tryClose()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΑΛΙΕΙΑ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="al-wrap"></div></div>';
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
    document.getElementById('al-wrap').innerHTML = `
<!-- INTRO -->
<div id="al-screen-intro" class="al-screen">
  ${tridentSVG('al-trident')}
  <div class="al-logo">ΑΛΙΕΙΑ</div>
  <div class="al-logo-en" data-i18n="subtitle"></div>
  <div class="al-intro-txt" data-i18n="intro"></div>
  <div id="al-mode-area"></div>
</div>

<!-- GAME -->
<div id="al-screen-game" class="al-screen">
  ${hudHTML()}
  <div class="al-board" id="al-board"></div>
  <div class="al-qbody">
    <div class="al-q-meta"><span class="al-q-num" id="al-qnum"></span><span class="al-q-line"></span></div>
    <div class="al-q-card"><div class="al-q-text" id="al-qtext"></div></div>
    <div class="al-answers" id="al-answers"></div>
    <div class="al-feedback" id="al-feedback"></div>
  </div>
</div>

<!-- CAST -->
<div id="al-screen-cast" class="al-screen">
  ${hudHTML()}
  <div class="al-cast-prompt" id="al-cast-prompt"></div>
  <div class="al-cast-sub" id="al-cast-sub"></div>
  <div class="al-scene-wrap">
    <div class="al-scene" id="al-scene">
      ${sceneSVG()}
      <div class="al-reveal" id="al-reveal"></div>
    </div>
  </div>
</div>

<!-- END -->
<div id="al-screen-end" class="al-screen">
  <div class="al-end-emoji" id="al-end-emoji">🐠</div>
  <div class="al-end-title" id="al-end-title"></div>
  <div class="al-end-sub" id="al-end-sub"></div>
  <div class="al-final-board" id="al-final-board"></div>
  <div class="al-end-btns">
    <button class="sym-btn" onclick="Halieia._showMode()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Halieia.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  function hudHTML(){ return `
  <div class="al-top">
    <div class="al-haul">
      <span class="al-haul-icon">🪙</span>
      <div class="al-haul-txt">
        <span class="al-haul-lbl" data-i18n="haul"></span>
        <span class="al-haul-val">0</span>
      </div>
    </div>
    <div class="al-frenzy">
      <div class="al-frenzy-top">
        <span class="al-frenzy-lbl" data-i18n="frenzy"></span>
        <span class="al-frenzy-mult">×1.0</span>
      </div>
      <div class="al-frenzy-track"><div class="al-frenzy-fill"></div></div>
    </div>
    <div class="al-qcount" id="al-qcount"></div>
  </div>`; }

  const I18N = {
    subtitle:{ gr:'Τα δίχτυα του Ποσειδώνα', en:'The nets of Poseidon' },
    intro:   { gr:'Στάσου στον βράχο σαν αρχαίος ψαράς και <b>ρίξε το καλάμι εκεί που θες</b> — στα ασφαλή ρηχά, στο ανοιχτό πέλαγος ή στον πλούσιο μα επικίνδυνο βυθό. Οι συνεχόμενες ψαριές ανεβάζουν τη <b>φρενίτιδα</b> και πολλαπλασιάζουν την αξία· μα η Σκύλλα κόβει το σερί. Η μεγαλύτερη ψαριά κερδίζει.', en:'Stand on the rock as an ancient angler and <b>cast your line where you choose</b> — the safe shallows, the open sea, or the rich but dangerous deep. Consecutive catches raise the <b>frenzy</b> and multiply their worth; but Scylla snaps the streak. The biggest haul wins.' },
    cast:    { gr:'ΣΤΗ ΘΑΛΑΣΣΑ', en:'TO THE SEA' },
    haul:    { gr:'Η ΨΑΡΙΑ ΣΟΥ', en:'YOUR HAUL' },
    frenzy:  { gr:'ΦΡΕΝΙΤΙΔΑ', en:'FRENZY' },
    again:   { gr:'ΝΕΑ ΨΑΡΙΑ', en:'FISH AGAIN' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#al-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('al-screen-game').classList.contains('active')) {
      document.getElementById('al-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum+' / '+TOTAL;
      document.getElementById('al-qtext').textContent = st.cur.q[L()];
      renderBoard();
    }
    if (document.getElementById('al-screen-cast').classList.contains('active')) labelZones();
  }
  function show(id){ document.querySelectorAll('#al-wrap .al-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); }

  /* ───────── leave confirmation ───────── */
  function _tryClose() {
    const gameActive = document.getElementById('al-screen-game')?.classList.contains('active');
    const castActive = document.getElementById('al-screen-cast')?.classList.contains('active');
    if ((gameActive || castActive) && st && st.qNum > 0) {
      _showLeaveConfirm();
    } else {
      close();
      if (typeof openGamesPanel === 'function') openGamesPanel();
    }
  }
  function _showLeaveConfirm() {
    document.getElementById('al-leave-modal')?.remove();
    const L2 = L();
    const el = document.createElement('div');
    el.id = 'al-leave-modal';
    el.className = 'al-leave-modal';
    el.innerHTML =
      '<div class="al-leave-box">' +
        '<div class="al-leave-msg">' + (L2==='en'?'Leave the game? Your progress will be lost.':'Έξοδος από το παιχνίδι; Η πρόοδός σου θα χαθεί.') + '</div>' +
        '<div class="al-leave-btns">' +
          '<button class="al-leave-yes" onclick="Halieia._doLeave()">' + (L2==='en'?'LEAVE':'ΕΞΟΔΟΣ') + '</button>' +
          '<button class="al-leave-no" onclick="document.getElementById(\'al-leave-modal\').remove()">' + (L2==='en'?'STAY':'ΜΕΙΝΕ') + '</button>' +
        '</div>' +
      '</div>';
    const ov = document.getElementById('al-overlay');
    if (ov) ov.appendChild(el);
  }
  function _doLeave() {
    document.getElementById('al-leave-modal')?.remove();
    close();
    if (typeof openGamesPanel === 'function') openGamesPanel();
  }

  /* ───────── mode screen ───────── */
  function _showMode() {
    const area = document.getElementById('al-mode-area');
    if (!area) return;
    const L2 = L();
    area.innerHTML =
      '<div class="al-mode-btns">' +
        '<button class="al-mode-btn" onclick="Halieia._pickSolo()">' +
          '<span class="al-mode-icon">🎣</span>' +
          '<span class="al-mode-lbl">' + (L2==='en'?'SOLO':'ΜΟΝΟΣ') + '</span>' +
          '<span class="al-mode-sub">' + (L2==='en'?'Play with AI rivals':'Παιχνίδι με AI αντιπάλους') + '</span>' +
        '</button>' +
        '<button class="al-mode-btn al-mode-btn-vs" onclick="Halieia._pickVs()">' +
          '<span class="al-mode-icon">🌐</span>' +
          '<span class="al-mode-lbl">' + (L2==='en'?'LIVE VS':'ΖΩΝΤΑΝΟ VS') + '</span>' +
          '<span class="al-mode-sub">' + (L2==='en'?'Live Arena · multiple players':'Live Arena · πολλοί παίκτες') + '</span>' +
        '</button>' +
      '</div>';
  }

  function _pickSolo() {
    const area = document.getElementById('al-mode-area');
    if (!area) return;
    const L2 = L(), maxR = RIVALS.length;
    const rv = L2==='en' ? 'RIVALS' : 'ΑΝΤΙΠΑΛΟΙ';
    area.innerHTML =
      '<div class="al-bot-cfg">' +
        '<div class="al-bot-q">' + (L2==='en'?'How many AI rivals?':'Πόσους AI αντιπάλους θέλεις;') + '</div>' +
        '<div class="al-bot-opts">' +
          '<button class="al-bot-btn" onclick="Halieia._start(0)">' + (L2==='en'?'FISH ALONE':'ΜΟΝΟΣ ΨΑΡΕΥΩ') + '</button>' +
          '<button class="al-bot-btn" onclick="Halieia._start(2)">2 ' + rv + '</button>' +
          '<button class="al-bot-btn al-bot-btn-max" onclick="Halieia._start(' + maxR + ')">' + maxR + ' ' + rv + ' ★</button>' +
        '</div>' +
        '<button class="al-bot-back" onclick="Halieia._showMode()">‹ ' + (L2==='en'?'BACK':'ΠΙΣΩ') + '</button>' +
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
        LiveArena.launchHost({ questions, gameName: (_cfg && _cfg.title) || T('Αλιεία — Live','Halieia — Live') });
      } else {
        LiveArena.launchPicker();
      }
    }
  }

  /* ───────── start ───────── */
  function _start(rivalCount) {
    const rc = (rivalCount == null) ? RIVALS.length : Math.max(0, Math.min(+rivalCount, RIVALS.length));
    st = {
      haul:0, streak:0, qNum:0, answered:false, cur:null,
      pool: shuffle([..._gpPool()]), idx:0,
      rivals: RIVALS.slice(0, rc).map(r=>({ name:r.name, skill:r.skill, gold: 150 + ((Math.random()*180)|0) })),
    };
    show('al-screen-game');
    updateHud();
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }
  function rint(lo,hi){ return Math.round((lo + Math.random()*(hi-lo))/5)*5; }
  function mult(){ return Math.min(3, 1 + st.streak*0.25); }
  function pickFromTable(table){
    const tot=table.reduce((s,e)=>s+e[1],0); let r=Math.random()*tot;
    for (const [k,w] of table){ if((r-=w)<=0) return k; } return table[0][0];
  }

  /* ───────── HUD + leaderboard ───────── */
  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), gold:st.haul, me:true}, ...st.rivals.map(r=>({name:r.name,gold:r.gold,me:false}))];
    all.sort((a,b)=>b.gold-a.gold); return all;
  }
  function renderBoard() {
    const board=standings();
    document.getElementById('al-board').innerHTML = board.map((x,i)=>
      `<div class="al-board-chip${x.me?' me':''}"><span class="al-board-rank">${i+1}</span><span class="al-board-name">${x.name}</span><span class="al-board-gold">${x.gold}</span></div>`
    ).join('');
  }
  function updateHud() {
    const m=mult(), hot=m>=2;
    document.querySelectorAll('#al-wrap .al-haul-val').forEach(e=>e.textContent=st.haul);
    document.querySelectorAll('#al-wrap .al-frenzy-mult').forEach(e=>{ e.textContent='×'+m.toFixed(1); e.classList.toggle('hot',hot); });
    document.querySelectorAll('#al-wrap .al-frenzy-fill').forEach(e=>{ e.style.width=((m-1)/2*100)+'%'; e.classList.toggle('hot',hot); });
  }
  function advanceRivals(){ st.rivals.forEach(r=> r.gold += (Math.random()<r.skill ? 60+((Math.random()*220)|0) : 10+((Math.random()*40)|0))); }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.qNum >= TOTAL) return end();
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('al-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum+' / '+TOTAL;
    document.getElementById('al-qtext').textContent = st.cur.q[L()];
    const fb=document.getElementById('al-feedback'); fb.textContent=''; fb.className='al-feedback';
    const wrap=document.getElementById('al-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='al-ans';
      b.innerHTML=`<span class="al-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderBoard(); updateHud();
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#al-answers .al-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('al-feedback');
    advanceRivals();
    if (chosen===st.cur.c) {
      fb.textContent=T('ΣΩΣΤΟ — στη θάλασσα!','CORRECT — to the sea!'); fb.className='al-feedback al-fb-ok';
      setTimeout(toCast, 650);
    } else {
      btn.classList.add('wrong');
      st.streak=0;
      if (window.symLogMistake) { try { window.symLogMistake({ q: st.cur.q[L()], wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Αλιεία', gameId: 'halieia' }); } catch (_) {} }
      updateHud();
      fb.textContent=T('ΛΑΘΟΣ — δεν ρίχνεις δίχτυ','WRONG — no cast for you'); fb.className='al-feedback al-fb-bad';
      renderBoard();
      setTimeout(()=>{ if(st.qNum>=TOTAL) end(); else nextQ(); }, 1700);
    }
  }

  /* ───────── cast screen ───────── */
  function toCast() {
    show('al-screen-cast');
    updateHud(); labelZones();
    resetCastBits();
    document.getElementById('al-scene').classList.remove('al-disabled');
    document.getElementById('al-reveal').className='al-reveal';
    document.getElementById('al-cast-prompt').textContent = T('ΡΙΞΕ ΤΟ ΚΑΛΑΜΙ','CAST YOUR LINE');
    document.getElementById('al-cast-sub').textContent = T('Διάλεξε νερά — όσο πιο βαθιά, τόσο πιο πλούσια και επικίνδυνα.','Choose your waters — the deeper you cast, the richer and riskier.');
  }
  function labelZones() {
    ZONES.forEach((z,i)=>{
      const lbl=document.getElementById('al-z'+i+'-lbl'); const h=document.getElementById('al-z'+i+'-hint');
      if(lbl) lbl.textContent = z.nm[L()];
      if(h) h.textContent = z.hint[L()];
    });
  }
  function resetCastBits() {
    const line=document.getElementById('al-castline');
    line.style.transition='none'; line.setAttribute('stroke-dashoffset','1000'); line.setAttribute('d','');
    const bob=document.getElementById('al-bob');
    bob.style.transition='none'; bob.setAttribute('transform',`translate(${ROD.x},${ROD.y})`); bob.style.opacity='0';
    const fish=document.getElementById('al-fish');
    fish.getAnimations().forEach(a=>a.cancel());
    fish.style.transition='none'; fish.style.transform=''; fish.style.opacity='0';
    const splashG=document.getElementById('al-splash'); if(splashG) splashG.innerHTML='';
    const schoolG=document.getElementById('al-school'); if(schoolG) schoolG.innerHTML='';
    void document.getElementById('al-scene').offsetWidth;
  }

  function _cast(zi) {
    const z = ZONES[zi];
    const [tx,ty] = z.target;
    const scene = document.getElementById('al-scene');
    scene.classList.add('al-disabled');
    document.getElementById('al-cast-prompt').textContent = T('…ρίχνεις στα βαθιά…','…the line flies out…').replace('βαθιά', z.nm.gr.toLowerCase());
    document.getElementById('al-cast-sub').textContent = '';

    // draw the line
    const line=document.getElementById('al-castline');
    const cx=(ROD.x+tx)/2, cy=Math.min(ROD.y,ty)-70;
    line.setAttribute('d',`M${ROD.x} ${ROD.y} Q ${cx} ${cy} ${tx} ${ty}`);
    line.setAttribute('stroke-dasharray','1000'); line.setAttribute('stroke-dashoffset','1000');
    void line.getBoundingClientRect();
    line.style.transition='stroke-dashoffset .5s ease'; line.setAttribute('stroke-dashoffset','0');

    // fly the bob to the target
    const bob=document.getElementById('al-bob');
    bob.style.opacity='1';
    requestAnimationFrame(()=>{ bob.style.transition='transform .5s cubic-bezier(.4,.7,.3,1)'; bob.setAttribute('transform',`translate(${tx},${ty})`); });

    // bite, then reel up the catch
    setTimeout(()=>{ bob.setAttribute('transform',`translate(${tx},${ty-6})`); }, 760);
    setTimeout(()=>{ bob.setAttribute('transform',`translate(${tx},${ty})`); }, 960);
    setTimeout(()=> revealCatch(zi, tx, ty), 1250);
  }

  function revealCatch(zi, tx, ty) {
    const z=ZONES[zi];
    const key=pickFromTable(z.table);
    const c=FISH[key];
    const m=mult();
    let valStr='', desc='', multStr='', nameCls=c.cls;

    if (c.cls==='gain' || c.cls==='big') {
      const base=rint(c.lo,c.hi); const val=Math.round(base*m);
      st.haul+=val; st.streak++;
      valStr='+'+val;
      if (m>1) multStr=T(`βάση ${base} × ${m.toFixed(1)} φρενίτιδα`,`base ${base} × ${m.toFixed(1)} frenzy`);
      desc = c.cls==='big' ? T('Σπάνια ψαριά! Ο Ποσειδών χαμογελά.','A rare catch! Poseidon smiles.')
                           : T('Καλή ψαριά γεμίζει το καλάθι.','A good catch fills the basket.');
    } else if (c.cls==='steal') {
      const board=standings(); const leader=board.find(x=>!x.me)||board[0];
      const rival=st.rivals.find(r=>r.name===leader.name);
      const amt=rival?Math.round(rival.gold*0.18/5)*5:rint(60,120);
      if (rival) rival.gold=Math.max(0,rival.gold-amt);
      st.haul+=amt; st.streak++;
      valStr='+'+amt;
      desc=T(`Το χταπόδι άρπαξε ψάρια από τον ${leader.name}.`,`The octopus snatched fish from ${leader.name}.`);
    } else { // bad
      const lost = key==='monster' ? Math.min(st.haul, Math.round(st.haul*0.2/5)*5) : 0;
      st.haul=Math.max(0,st.haul-lost); st.streak=0;
      valStr = lost>0 ? '−'+lost : '0';
      desc = key==='monster' ? T('Η Σκύλλα άρπαξε μέρος της ψαριάς σου και έκοψε το σερί.','Scylla seized part of your haul and snapped your streak.')
                             : T('Το δίχτυ ανέβηκε άδειο. Το σερί χάθηκε.','The net came up empty. Your streak is gone.');
    }

    // fish rises at the bob point — splash, scatter, and a dangling catch
    splash(tx, ty);
    spawnSchool(tx, ty, key);
    const fish=document.getElementById('al-fish');
    fish.textContent=c.emoji;
    fish.setAttribute('x',tx); fish.setAttribute('y',ty+6);
    fish.getAnimations().forEach(a=>a.cancel());
    fish.style.opacity='1';
    fish.animate([
      { transform:'translate(0px,48px) scale(.4)', opacity:0 },
      { transform:'translate(0px,-30px) scale(1) rotate(9deg)', opacity:1, offset:0.5 },
      { transform:'translate(0px,-30px) scale(1) rotate(-8deg)', offset:0.74 },
      { transform:'translate(0px,-30px) scale(1) rotate(4deg)', offset:0.9 },
      { transform:'translate(0px,-30px) scale(1) rotate(0deg)' },
    ], { duration:1150, easing:'cubic-bezier(.3,.9,.3,1)', fill:'forwards' });

    updateHud(); renderBoard();
    document.getElementById('al-cast-prompt').textContent='';

    const rv=document.getElementById('al-reveal');
    rv.innerHTML = `
      <div class="al-reveal-emoji">${c.emoji}</div>
      <div class="al-reveal-name ${nameCls}">${c.nm[L()]}</div>
      <div class="al-reveal-val ${c.cls==='bad'?'bad':'gain'}">${valStr} ${T('δρχ','dr')}</div>
      <div class="al-reveal-mult">${multStr}</div>
      <div class="al-reveal-desc">${desc}</div>
      <button class="sym-btn al-reveal-cont" onclick="Halieia._cont()">${T('ΣΥΝΕΧΕΙΑ','CONTINUE')}</button>`;
    setTimeout(()=> rv.className='al-reveal show', 350);
  }

  function _cont() {
    document.getElementById('al-reveal').className='al-reveal';
    show('al-screen-game');
    if (st.qNum>=TOTAL) end(); else nextQ();
  }

  /* ───────── end ───────── */
  function end() {
    show('al-screen-end');
    const board=standings(); const won=board[0].me;
    document.getElementById('al-end-emoji').textContent = won?'🏆':'🦈';
    const title=document.getElementById('al-end-title'); const sub=document.getElementById('al-end-sub');
    if (won) {
      title.textContent=T('Η ΜΕΓΑΛΥΤΕΡΗ ΨΑΡΙΑ','THE GREATEST CATCH'); title.className='al-end-title win';
      sub.textContent=T(`Γέμισες τα δίχτυα με ${st.haul} δραχμές και κέρδισες την εύνοια του Ποσειδώνα.`,`You filled your nets with ${st.haul} drachmas and won Poseidon's favour.`);
    } else {
      title.textContent=T('Η ΑΛΙΕΙΑ ΤΕΛΕΙΩΣΕ','THE FISHING ENDS'); title.className='al-end-title lose';
      const r=board.findIndex(x=>x.me)+1;
      sub.textContent=T(`Τερμάτισες στη ${r}η θέση με ${st.haul} δραχμές. Η καλύτερη ψαριά ήταν του ${board[0].name}.`,`You finished in position ${r} with ${st.haul} drachmas. The best catch was ${board[0].name}'s.`);
    }
    document.getElementById('al-final-board').innerHTML = board.map((x,i)=>
      `<div class="al-final-row${x.me?' me':''}"><span class="al-final-pos">${i+1}</span><span class="al-final-name">${x.name}${i===0?' 🏆':''}</span><span class="al-final-gold">${x.gold} ${T('δρχ','dr')}</span></div>`
    ).join('');
  }

  /* ───────── scene art ───────── */
  function sceneSVG() {
    const zoneX=[[240,240],[480,230],[710,250]]; // [x,width] per zone over the water
    let zones='';
    ZONES.forEach((z,i)=>{
      const [x,w]=zoneX[i]; const cx=x+w/2;
      zones += `<g class="al-zone" onclick="Halieia._cast(${i})">
        <rect class="al-zone-fill" x="${x}" y="235" width="${w}" height="178"/>
        <rect class="al-zone-ring" x="${x+6}" y="241" width="${w-12}" height="166" rx="6" fill="none" stroke="#F0EBE0" stroke-opacity="0.7" stroke-width="2" stroke-dasharray="5 6"/>
        <text class="al-zone-lbl" id="al-z${i}-lbl" x="${cx}" y="388" font-size="17"></text>
        <text class="al-zone-hint" id="al-z${i}-hint" x="${cx}" y="406" fill="${i===2?'#E08577':i===0?'#9DBE84':'#E3C766'}"></text>
      </g>`;
    });
    return `<svg viewBox="0 0 960 420" fill="none">
      <defs>
        <linearGradient id="al-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#13242A"/><stop offset="0.6" stop-color="#2C4A44"/><stop offset="1" stop-color="#C8985A"/>
        </linearGradient>
        <radialGradient id="al-sun" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#F4D9A0" stop-opacity="0.9"/><stop offset="1" stop-color="#F4D9A0" stop-opacity="0"/></radialGradient>
        <linearGradient id="al-w0" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4C808A"/><stop offset="1" stop-color="#33636C"/></linearGradient>
        <linearGradient id="al-w1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#356068"/><stop offset="1" stop-color="#244A52"/></linearGradient>
        <linearGradient id="al-w2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#234851"/><stop offset="1" stop-color="#142E36"/></linearGradient>
      </defs>
      <!-- sky -->
      <rect x="0" y="0" width="960" height="235" fill="url(#al-sky)"/>
      <circle cx="650" cy="205" r="120" fill="url(#al-sun)"/>
      <circle cx="650" cy="208" r="34" fill="#F6E2B0" opacity="0.85"/>
      <!-- distant isles -->
      <path d="M470 235q40-26 92-22t96 22z" fill="#1c333a" opacity="0.6"/>
      <path d="M760 235q34-20 78-16t70 16z" fill="#1c333a" opacity="0.5"/>
      <!-- sea zones -->
      <rect x="240" y="235" width="240" height="185" fill="url(#al-w0)"/>
      <rect x="480" y="235" width="230" height="185" fill="url(#al-w1)"/>
      <rect x="710" y="235" width="250" height="185" fill="url(#al-w2)"/>
      <rect x="0" y="235" width="240" height="185" fill="#0c1f1f"/>
      <!-- sun reflection -->
      <rect x="610" y="236" width="80" height="120" fill="#F6E2B0" opacity="0.12"/>
      <!-- wave strokes -->
      <g stroke="#9CC3CC" stroke-opacity="0.22" stroke-width="2" fill="none">
        <path d="M250 270q22-7 44 0t44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0"/>
        <path d="M250 312q22-7 44 0t44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0"/>
        <path d="M250 356q22-7 44 0t44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0 44 0"/>
      </g>

      <!-- ambient fish drifting in the sea -->
      <g class="al-ambient" fill="#0C2227" fill-opacity="0.5">
        ${ambientFishSVG(330,288,1.0,0)}
        ${ambientFishSVG(560,360,0.8,-1)}
        ${ambientFishSVG(770,300,1.25,0)}
        ${ambientFishSVG(640,392,0.7,-1)}
        ${ambientFishSVG(440,344,0.9,-1)}
      </g>

      <!-- rocky shore + angler silhouette -->
      <path d="M0 360 L52 312 132 300 210 332 240 420 0 420Z" fill="#0A1410"/>
      <path d="M0 360 L52 312 132 300 210 332 210 340 130 308 54 320 0 372Z" fill="#152821" opacity="0.7"/>
      <g fill="#0B1712" stroke="#0B1712">
        <!-- legs -->
        <path d="M104 296 l-6 -42 14 0 -2 42z"/>
        <path d="M118 296 l4 -44 12 2 -4 42z"/>
        <!-- chiton / torso -->
        <path d="M96 256 q18 -20 44 -8 l8 30 q-30 12 -56 2z"/>
        <!-- raised arm to the rod -->
        <path d="M132 236 l34 14 -4 9 -34 -12z"/>
        <!-- head -->
        <circle cx="116" cy="222" r="12.5"/>
        <!-- back -->
        <path d="M98 256 q-6 -24 14 -36 l8 6 q-16 10 -10 32z"/>
      </g>
      <!-- rim light on the figure -->
      <path d="M128 196 q12 6 12 24 M150 250 l14 6" stroke="#C8985A" stroke-opacity="0.5" stroke-width="2" fill="none"/>
      <!-- the rod (καλάμι) -->
      <path d="M150 250 Q 210 196 ${ROD.x} ${ROD.y}" stroke="#8A6A3A" stroke-width="3.5" fill="none" stroke-linecap="round"/>
      <circle cx="${ROD.x}" cy="${ROD.y}" r="2.5" fill="#C8985A"/>

      <!-- cast bits -->
      <path id="al-castline" d="" stroke="#EDEAE0" stroke-opacity="0.7" stroke-width="1.6" fill="none"/>
      <g id="al-bob" transform="translate(${ROD.x},${ROD.y})" opacity="0">
        <ellipse cx="0" cy="0" rx="6" ry="7" fill="#C0392B"/>
        <ellipse cx="0" cy="3" rx="6" ry="4" fill="#F0EBE0"/>
        <circle cx="0" cy="0" r="1.6" fill="#3A1410"/>
      </g>
      <text id="al-fish" x="0" y="0" font-size="60" text-anchor="middle" opacity="0">🐟</text>
      <g id="al-splash"></g>
      <g id="al-school"></g>

      <!-- clickable depth zones -->
      ${zones}
    </svg>`;
  }

  /* ───────── pull-up animations ───────── */
  const SVGNS = 'http://www.w3.org/2000/svg';

  // a small silhouette fish for the ambient sea layer
  function ambientFishSVG(x, y, scale, flip) {
    const dur = (10 + Math.random()*8).toFixed(1);
    const delay = (-Math.random()*12).toFixed(1);
    const range = 26 + Math.random()*22;
    const sx = flip ? -scale : scale;
    return `<g transform="translate(${x} ${y})"><g class="al-amb" style="--amb-dur:${dur}s;--amb-delay:${delay}s;--amb-range:${range}px">
      <g transform="scale(${sx} ${scale})">
        <path d="M0 0q9-7 19 0q-10 7-19 0z"/>
        <path d="M0 0l-7-5 0 10z"/>
      </g>
    </g></g>`;
  }

  // water burst where the line breaks the surface
  function splash(tx, ty) {
    const sp = document.getElementById('al-splash');
    sp.innerHTML = '';
    for (let i=0;i<10;i++){
      const c = document.createElementNS(SVGNS,'circle');
      c.setAttribute('cx',tx); c.setAttribute('cy',ty);
      c.setAttribute('r',(1.4+Math.random()*2.4).toFixed(1));
      c.setAttribute('fill','#D6ECEF'); c.setAttribute('fill-opacity','0.85');
      sp.appendChild(c);
      const ang = -Math.PI/2 + (Math.random()-0.5)*Math.PI*0.95;
      const d = 26+Math.random()*44;
      const dx = Math.cos(ang)*d, dy = Math.sin(ang)*d;
      c.animate([
        { transform:'translate(0px,0px)', opacity:0.9 },
        { transform:`translate(${dx*0.95}px,${dy}px)`, opacity:0.85, offset:0.45 },
        { transform:`translate(${dx*1.15}px,${dy*0.25+46}px)`, opacity:0 },
      ], { duration:680+Math.random()*220, easing:'cubic-bezier(.25,.7,.5,1)', fill:'forwards' });
    }
    const ring = document.createElementNS(SVGNS,'ellipse');
    ring.setAttribute('cx',tx); ring.setAttribute('cy',ty+5);
    ring.setAttribute('rx','7'); ring.setAttribute('ry','3.4');
    ring.setAttribute('fill','none'); ring.setAttribute('stroke','#D6ECEF');
    ring.setAttribute('stroke-opacity','0.7'); ring.setAttribute('stroke-width','2');
    sp.appendChild(ring);
    ring.animate([
      { transform:'scale(.3)', opacity:0.8 },
      { transform:'scale(3.6)', opacity:0 },
    ], { duration:820, easing:'ease-out', fill:'forwards' });
  }

  // build the keyframes for a single fish leaping out of the water in an arc
  function leapKeyframes(dx, peak, spin) {
    const kf = [];
    const steps = 7;
    for (let s=0; s<=steps; s++) {
      const p = s/steps;
      const x = dx * p;
      const y = -4 * peak * p * (1-p);
      const grow = p < 0.18 ? p/0.18 : 1;
      const sc = (0.35 + 0.75*grow) * (1 - 0.25*Math.max(0,(p-0.7)/0.3));
      const rot = spin * p;
      kf.push({
        transform:`translate(${x.toFixed(1)}px,${(y+8).toFixed(1)}px) scale(${sc.toFixed(2)}) rotate(${rot.toFixed(0)}deg)`,
        opacity: p < 0.08 ? 0 : (p > 0.92 ? 0 : 1),
        offset: p,
      });
    }
    return kf;
  }

  // a lively burst of fish that leap up out of the water as the catch is reeled in
  function spawnSchool(tx, ty, key) {
    const school = document.getElementById('al-school');
    school.innerHTML = '';

    if (key==='monster' || key==='empty') {
      for (let i=0;i<7;i++){
        const b = document.createElementNS(SVGNS,'text');
        b.setAttribute('x',tx); b.setAttribute('y',ty);
        b.setAttribute('font-size',(11+Math.random()*12).toFixed(0));
        b.setAttribute('text-anchor','middle');
        b.textContent = '🫧';
        school.appendChild(b);
        const dx=(Math.random()-0.5)*48;
        b.animate([
          { transform:'translate(0px,6px) scale(.4)', opacity:0 },
          { transform:`translate(${(dx*0.6).toFixed(0)}px,-26px) scale(1)`, opacity:0.9, offset:0.5 },
          { transform:`translate(${dx.toFixed(0)}px,-64px) scale(.7)`, opacity:0 },
        ], { duration:1100+Math.random()*400, delay:i*70, easing:'ease-out', fill:'forwards' });
      }
      return;
    }

    const rich = (key==='golden' || key==='amphora' || key==='tuna');
    const palette = (key==='octopus') ? ['🐟','🐠','🐟','🦐']
                  : rich              ? ['🐟','🐠','🐟','🦐','🐡','🐟','🐠']
                  :                     ['🐟','🐠','🐟','🦐','🐟'];
    const n = rich ? 9 : 6;

    for (let i=0;i<n;i++){
      const em = palette[i % palette.length];
      const t = document.createElementNS(SVGNS,'text');
      t.setAttribute('x',tx); t.setAttribute('y',ty);
      t.setAttribute('font-size',(16+Math.random()*14).toFixed(0));
      t.setAttribute('text-anchor','middle');
      t.textContent = em;
      school.appendChild(t);

      const side = i % 2 ? 1 : -1;
      const dx = side * (24 + Math.random()*78);
      const peak = 56 + Math.random()*78;
      const spin = side * (200 + Math.random()*220);
      t.animate(
        leapKeyframes(dx, peak, spin),
        { duration:1000+Math.random()*420, delay:i*55, easing:'cubic-bezier(.25,.6,.4,1)', fill:'forwards' }
      );
    }

    // a few water droplets flung off with the leaping fish
    for (let i=0;i<8;i++){
      const d = document.createElementNS(SVGNS,'circle');
      d.setAttribute('cx',tx); d.setAttribute('cy',ty);
      d.setAttribute('r',(1+Math.random()*2).toFixed(1));
      d.setAttribute('fill','#D6ECEF'); d.setAttribute('fill-opacity','0.8');
      school.appendChild(d);
      const dx=(Math.random()-0.5)*120, peak=40+Math.random()*60;
      d.animate(leapKeyframes(dx, peak, 0).map(k=>({transform:k.transform.replace(/rotate\([^)]*\)/,''),opacity:k.opacity,offset:k.offset})),
        { duration:760+Math.random()*260, delay:Math.random()*120, easing:'cubic-bezier(.3,.7,.5,1)', fill:'forwards' });
    }

    // rare catches throw off a sparkle of light
    if (rich) {
      for (let i=0;i<6;i++){
        const sp = document.createElementNS(SVGNS,'text');
        sp.setAttribute('x',tx); sp.setAttribute('y',ty-12);
        sp.setAttribute('font-size',(10+Math.random()*8).toFixed(0));
        sp.setAttribute('text-anchor','middle');
        sp.textContent='✦';
        sp.setAttribute('fill','#E9CF8A');
        school.appendChild(sp);
        const dx=(Math.random()-0.5)*150, dy=-30-Math.random()*70;
        sp.animate([
          { transform:'translate(0px,0px) scale(.2)', opacity:0 },
          { transform:`translate(${(dx*0.6).toFixed(0)}px,${(dy*0.6).toFixed(0)}px) scale(1)`, opacity:1, offset:0.4 },
          { transform:`translate(${dx.toFixed(0)}px,${dy.toFixed(0)}px) scale(.3)`, opacity:0 },
        ], { duration:900+Math.random()*400, delay:200+i*60, easing:'ease-out', fill:'forwards' });
      }
    }
  }

  function tridentSVG(cls){ return `<svg class="${cls}" viewBox="0 0 120 120" fill="none">
    <defs><linearGradient id="al-tr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9DBE84"/><stop offset="1" stop-color="#4E6B3A"/></linearGradient></defs>
    <rect x="56" y="40" width="8" height="68" rx="4" fill="url(#al-tr)" stroke="#2E3F22" stroke-width="1.5"/>
    <path d="M30 16v22c0 10 6 16 14 17M90 16v22c0 10-6 16-14 17M60 12v40" stroke="url(#al-tr)" stroke-width="8" stroke-linecap="round" fill="none"/>
    <path d="M30 16l-5 8 5 4 5-4zM90 16l5 8-5 4-5-4zM60 8l-6 8 6 4 6-4z" fill="#9DBE84" stroke="#2E3F22" stroke-width="1.5"/>
    <ellipse cx="60" cy="112" rx="30" ry="6" fill="#5E8B96" opacity="0.35"/>
  </svg>`; }

  return { open, close, _start, _tryClose, _doLeave, _showMode, _pickSolo, _pickVs, _cast, _cont, syncLang };
})();
window.Halieia = Halieia;

/* ── Games-Panel entry points ── */
window.openHalieia  = function(gp){ Halieia.open(gp || {}); };
window.closeHalieia = function(){ Halieia.close(); };
