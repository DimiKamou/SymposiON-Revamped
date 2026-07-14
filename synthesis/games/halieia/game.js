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

  // presentation helpers: reduced-motion check, standalone FX event, anim kill
  const RM = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const _fx = (type, detail) => { try { window.dispatchEvent(new CustomEvent('al:fx', { detail: Object.assign({ type }, detail || {}) })); } catch (_) {} };
  const _kill = (el) => { if (el && el.getAnimations) el.getAnimations().forEach(a => a.cancel()); };

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
  let _lineRAF = 0; // handle for the slack-line settle animation
  // Animations created on the bob are tracked by reference: Chrome can drop
  // replaced fill:forwards animations from getAnimations() while they still
  // paint, so _kill alone leaves a zombie holding the PREVIOUS cast's target
  // (the bob visibly teleported there between touchdown and bite).
  let _bobAnims = [];
  const _bobPlay = (bob, kf, opts) => { const a = bob.animate(kf, opts); _bobAnims.push(a); return a; };

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
    if (_lineRAF) { cancelAnimationFrame(_lineRAF); _lineRAF = 0; }
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
<!-- ambient Aegean backdrop behind every screen (presentation only) -->
<div class="al-ambience" aria-hidden="true">${ambienceSVG()}${moteHTML()}</div>

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
  <!-- phone-sized zone buttons: the in-scene plates render too small to read
       on narrow screens, so these mirror them (same Halieia._cast targets) -->
  <div class="al-zone-btns" id="al-zone-btns">
    <button class="al-zone-btn" onclick="if(!document.getElementById('al-scene').classList.contains('al-disabled'))Halieia._cast(0)"><b id="al-zb0-lbl"></b><span id="al-zb0-hint"></span></button>
    <button class="al-zone-btn" onclick="if(!document.getElementById('al-scene').classList.contains('al-disabled'))Halieia._cast(1)"><b id="al-zb1-lbl"></b><span id="al-zb1-hint"></span></button>
    <button class="al-zone-btn al-zb-deep" onclick="if(!document.getElementById('al-scene').classList.contains('al-disabled'))Halieia._cast(2)"><b id="al-zb2-lbl"></b><span id="al-zb2-hint"></span></button>
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
      document.getElementById('al-qtext').textContent = QT(st.cur.q);
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
    // frenzy streak: the water itself glows (scene CSS hook)
    const sea=document.getElementById('al-sea'); if(sea) sea.classList.toggle('al-hot', hot);
    // the ambient backdrop warms with the streak too
    const amb=document.querySelector('#al-wrap .al-ambience'); if(amb) amb.classList.toggle('al-hot', hot);
    // question progress in the HUD (visible on the cast screen)
    document.querySelectorAll('#al-wrap .al-qcount').forEach(e=>{
      e.textContent = (st && st.qNum) ? (T('ΕΡΩΤΗΣΗ ','QUESTION ') + st.qNum + ' / ' + TOTAL) : '';
    });
  }
  function advanceRivals(){ st.rivals.forEach(r=> r.gold += (Math.random()<r.skill ? 60+((Math.random()*220)|0) : 10+((Math.random()*40)|0))); }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.qNum >= TOTAL) return end();
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('al-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum+' / '+TOTAL;
    document.getElementById('al-qtext').textContent = QT(st.cur.q);
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
      _fx('correct', { el: btn });
      fb.textContent=T('ΣΩΣΤΟ — στη θάλασσα!','CORRECT — to the sea!'); fb.className='al-feedback al-fb-ok';
      setTimeout(toCast, 650);
    } else {
      _fx('wrong');
      btn.classList.add('wrong');
      st.streak=0;
      if (window.symLogMistake) { try { window.symLogMistake({ q: QT(st.cur.q), wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Αλιεία', gameId: 'halieia' }); } catch (_) {} }
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
      const bl=document.getElementById('al-zb'+i+'-lbl'); const bh=document.getElementById('al-zb'+i+'-hint');
      if(bl) bl.textContent = z.nm[L()];
      if(bh) bh.textContent = z.hint[L()];
    });
  }
  function resetCastBits() {
    if (_lineRAF) { cancelAnimationFrame(_lineRAF); _lineRAF=0; }
    const line=document.getElementById('al-castline');
    line.classList.remove('al-tense');
    line.style.transition='none'; line.setAttribute('stroke-dashoffset','1000'); line.setAttribute('d','');
    const bob=document.getElementById('al-bob');
    _kill(bob);
    _bobAnims.forEach(a=>{ try { a.cancel(); } catch(_) {} });
    _bobAnims.length=0;
    bob.style.transition='none'; bob.setAttribute('transform',`translate(${ROD.x},${ROD.y})`); bob.style.opacity='0';
    const idg=document.getElementById('al-idleg'); if(idg) idg.classList.remove('al-off');
    _kill(document.getElementById('al-rodg'));
    _kill(document.getElementById('al-flash'));
    const fish=document.getElementById('al-fish');
    fish.getAnimations().forEach(a=>a.cancel());
    fish.style.transition='none'; fish.style.transform=''; fish.style.opacity='0';
    const splashG=document.getElementById('al-splash'); if(splashG) splashG.innerHTML='';
    const schoolG=document.getElementById('al-school'); if(schoolG) schoolG.innerHTML='';
    const tentG=document.getElementById('al-tent'); if(tentG) tentG.innerHTML='';
    const scn=document.getElementById('al-scene'); if(scn) scn.classList.remove('al-quake');
    void document.getElementById('al-scene').offsetWidth;
  }

  function _cast(zi) {
    const z = ZONES[zi];
    const [tx,ty] = z.target;
    const scene = document.getElementById('al-scene');
    scene.classList.add('al-disabled');
    document.getElementById('al-cast-prompt').textContent = T('…ρίχνεις στα βαθιά…','…the line flies out…').replace('βαθιά', z.nm.gr.toLowerCase());
    document.getElementById('al-cast-sub').textContent = '';
    _fx('cast');
    const rm = RM();

    // the slack idle line is reeled in the instant the cast begins
    const idg=document.getElementById('al-idleg'); if(idg) idg.classList.add('al-off');

    // the rod whips back, then snaps forward as the line flies out
    const rod=document.getElementById('al-rodg');
    _kill(rod);
    if (!rm && rod) rod.animate([
      { transform:'rotate(0deg)' },
      { transform:'rotate(-9deg)',  offset:0.2 },
      { transform:'rotate(6.5deg)', offset:0.52 },
      { transform:'rotate(-2.5deg)',offset:0.78 },
      { transform:'rotate(0deg)' },
    ], { duration:720, easing:'cubic-bezier(.3,.7,.3,1)' });

    // draw the line along its true arc length (no snap)
    const line=document.getElementById('al-castline');
    const cx=(ROD.x+tx)/2, cy=Math.min(ROD.y,ty)-70;
    line.style.transition='none';
    line.setAttribute('d',`M${ROD.x} ${ROD.y} Q ${cx} ${cy} ${tx} ${ty}`);
    let len=1000; try { len=Math.ceil(line.getTotalLength())+2; } catch(_) {}
    line.setAttribute('stroke-dasharray',len); line.setAttribute('stroke-dashoffset',len);
    void line.getBoundingClientRect();
    line.style.transition='stroke-dashoffset '+(rm?'.01s':'.5s')+' cubic-bezier(.55,.08,.45,.96)';
    line.setAttribute('stroke-dashoffset','0');

    // the bob rides the same arc as the line (real cast physics)
    const bob=document.getElementById('al-bob');
    _kill(bob);
    bob.style.transition='none';
    bob.style.opacity='1';
    bob.setAttribute('transform',`translate(${tx},${ty})`);
    if (!rm) {
      const N=9, kf=[];
      for (let i=0;i<=N;i++){
        const t=i/N, u=1-t;
        const bx=u*u*ROD.x + 2*u*t*cx + t*t*tx;
        const by=u*u*ROD.y + 2*u*t*cy + t*t*ty;
        kf.push({ transform:`translate(${bx.toFixed(1)}px,${by.toFixed(1)}px)` });
      }
      // fill:'forwards' holds the touchdown point through the pre-bite wait
      // (newest animation wins the composite, burying any zombie fill)
      _bobPlay(bob, kf, { duration:500, easing:'linear', fill:'forwards' });
    }

    // a fading ghost-trail marks the arc the cast flew along
    if (!rm) {
      const sp=document.getElementById('al-splash');
      if (sp) for (let i=1;i<=6;i++){
        const t=i/7, u=1-t;
        const gx=u*u*ROD.x + 2*u*t*cx + t*t*tx;
        const gy=u*u*ROD.y + 2*u*t*cy + t*t*ty;
        const dot=document.createElementNS(SVGNS,'circle');
        dot.setAttribute('cx',gx.toFixed(1)); dot.setAttribute('cy',gy.toFixed(1));
        dot.setAttribute('r',(1+t*1.2).toFixed(2));
        dot.setAttribute('fill','#EDEAE0'); dot.setAttribute('opacity','0');
        sp.appendChild(dot);
        dot.animate([
          { opacity:0 }, { opacity:0.55, offset:0.3 }, { opacity:0 },
        ], { duration:560, delay:t*470, easing:'ease-out', fill:'forwards' });
      }
    }

    // touchdown: splash, spreading rings, and the taut line sags slack
    setTimeout(()=>{
      if (!document.getElementById('al-castline')) return;
      splash(tx, ty, 0.45);
      if (!rm) { rippleRings(tx, ty); lineSettle(tx, ty); }
    }, rm?60:520);

    // bite: the bob is yanked under — tension on rod, line and water
    setTimeout(()=>{
      if (rm) { bob.setAttribute('transform',`translate(${tx},${ty-6})`); return; }
      _bobPlay(bob, [
        { transform:`translate(${tx}px,${ty}px)` },
        { transform:`translate(${tx}px,${ty+9}px)`, offset:0.4 },
        { transform:`translate(${tx}px,${ty+6}px)` },
      ], { duration:200, easing:'cubic-bezier(.4,0,.6,1)', fill:'forwards' });
      if (rod) rod.animate([
        { transform:'rotate(0deg)' }, { transform:'rotate(3deg)' },
      ], { duration:150, easing:'ease-out', fill:'forwards' });
      line.classList.add('al-tense');
      biteAlert(tx, ty);
    }, 760);
    setTimeout(()=>{
      if (rm) { bob.setAttribute('transform',`translate(${tx},${ty})`); return; }
      _bobPlay(bob, [
        { transform:`translate(${tx}px,${ty+6}px)` },
        { transform:`translate(${tx}px,${ty}px)` },
      ], { duration:190, easing:'cubic-bezier(.34,1.56,.64,1)', fill:'forwards' });
      if (rod) rod.animate([
        { transform:'rotate(3deg)' }, { transform:'rotate(0deg)' },
      ], { duration:240, easing:'cubic-bezier(.34,1.56,.64,1)', fill:'forwards' });
      line.classList.remove('al-tense');
    }, 960);
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

    // fish rises at the bob point — splash, scatter, rarity flash, drama
    const power = c.cls==='big' ? 1.65 : c.cls==='bad' ? (key==='monster'?1.9:0.7) : c.cls==='steal' ? 1.2 : 1;
    splash(tx, ty, power);
    spawnSchool(tx, ty, key);
    if      (key==='monster')  { sceneFlash('#9E3B2E', 0.34, 700); sceneQuake(); spawnTentacles(tx, ty, 'monster'); }
    else if (key==='octopus')  { sceneFlash('#5E8B96', 0.20, 600); spawnTentacles(tx, ty, 'octopus'); }
    else if (c.cls==='big')    { sceneFlash('#F4D9A0', 0.30, 800); goldBeam(tx); }
    else if (c.cls==='gain')   { sceneFlash('#F4D9A0', 0.13, 480); }
    _fx('reveal', { cls:c.cls, streak:st.streak });
    const fish=document.getElementById('al-fish');
    fish.textContent=c.emoji;
    fish.setAttribute('x',tx); fish.setAttribute('y',ty+6);
    fish.getAnimations().forEach(a=>a.cancel());
    fish.style.opacity='1';
    fish.animate([
      { transform:'translate(0px,48px) scale(.4)', opacity:0 },
      { transform:'translate(0px,-42px) scale(1) rotate(9deg)', opacity:1, offset:0.5 },
      { transform:'translate(0px,-42px) scale(1) rotate(-8deg)', offset:0.74 },
      { transform:'translate(0px,-42px) scale(1) rotate(4deg)', offset:0.9 },
      { transform:'translate(0px,-42px) scale(1) rotate(0deg)' },
    ], { duration:1150, easing:'cubic-bezier(.3,.9,.3,1)', fill:'forwards' });

    updateHud(); renderBoard();
    document.getElementById('al-cast-prompt').textContent='';

    // the haul counter reacts with its weight (pop on gain, flinch on loss)
    document.querySelectorAll('#al-wrap .al-haul').forEach(h=>{
      h.classList.remove('pop','hit'); void h.offsetWidth;
      h.classList.add(c.cls==='bad' ? 'hit' : 'pop');
      setTimeout(()=>h.classList.remove('pop','hit'), 720);
    });

    const rv=document.getElementById('al-reveal');
    // al-rvz{zi} slides the card sideways so it never covers the catch drama
    rv.className='al-reveal al-rvz'+zi + (c.cls==='big'?' al-rv-big':c.cls==='bad'?' al-rv-bad':c.cls==='steal'?' al-rv-steal':'');
    rv.innerHTML = `
      <div class="al-reveal-row">
        <div class="al-reveal-emoji">${c.emoji}</div>
        <div class="al-reveal-txt">
          <div class="al-reveal-name ${nameCls}">${c.nm[L()]}</div>
          <div class="al-reveal-val ${c.cls==='bad'?'bad':'gain'}">${valStr} ${T('δρχ','dr')}</div>
          <div class="al-reveal-mult">${multStr}</div>
        </div>
      </div>
      <div class="al-reveal-desc">${desc}</div>
      <button class="sym-btn al-reveal-cont" onclick="Halieia._cont()">${T('ΣΥΝΕΧΕΙΑ','CONTINUE')}</button>`;
    setTimeout(()=> rv.classList.add('show'), RM()?350:880);
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
      _fx('win');
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

  /* ───────── ambient backdrop (behind every screen) ───────── */
  // seamless swell silhouette: sinusoid band of `per` period closed to the floor
  function swellPath(y, amp, per) {
    let d = `M${-per} ${y} q${per / 2} ${-amp} ${per} 0`;
    const n = Math.ceil((1440 + 2 * per) / per);
    for (let k = 0; k < n; k++) d += ` t${per} 0`;
    d += ` V560 H${-per} Z`;
    return d;
  }
  function ambienceSVG() {
    // sun glitter dashes low on the swell
    let glit = '';
    for (let i = 0; i < 10; i++) {
      const x = Math.round(760 + (Math.random() - 0.5) * 320);
      const y = Math.round(332 + Math.random() * 96);
      const w = Math.round(8 + Math.random() * 20);
      const o = (0.05 + Math.random() * 0.09).toFixed(2);
      const tw = (2.2 + Math.random() * 2.8).toFixed(1);
      glit += `<rect class="al-glit" x="${x}" y="${y}" width="${w}" height="2" rx="1" fill="#F6E2B0" opacity="${o}" style="--tw:${tw}s;--twd:${(-Math.random() * 3).toFixed(1)}s"/>`;
    }
    return `<svg class="alb-sea" viewBox="0 0 1440 560" preserveAspectRatio="xMidYMax slice" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="alb-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#F4D9A0" stop-opacity="0.5"/><stop offset="1" stop-color="#F4D9A0" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="alb-b1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#2E5B64" stop-opacity="0.34"/><stop offset="1" stop-color="#0A1D22" stop-opacity="0.05"/>
        </linearGradient>
        <linearGradient id="alb-b2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#1C4049" stop-opacity="0.5"/><stop offset="1" stop-color="#081418" stop-opacity="0.1"/>
        </linearGradient>
        <linearGradient id="alb-b3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0F2830" stop-opacity="0.72"/><stop offset="1" stop-color="#050D10" stop-opacity="0.3"/>
        </linearGradient>
      </defs>
      <ellipse class="alb-hglow" cx="920" cy="352" rx="470" ry="190" fill="url(#alb-glow)" opacity="0.12"/>
      <path d="M330 336 q100 -34 210 -28 t250 28 z" fill="#0C1F26" opacity="0.55"/>
      <path d="M880 336 q90 -26 190 -21 t210 21 z" fill="#0E242B" opacity="0.5"/>
      <g transform="translate(596 318)" fill="#091820" opacity="0.75">
        <path d="M-10 0 H10 L0 -5.5 Z"/>
        <path d="M-7 6 V1 M-3.5 6 V1 M0 6 V1 M3.5 6 V1 M7 6 V1" stroke="#091820" stroke-width="1.5" fill="none"/>
        <rect x="-10" y="6" width="20" height="2"/>
      </g>
      <path d="M0 336 H1440" stroke="#7FB0BC" stroke-opacity="0.1" stroke-width="1.2"/>
      <g class="alb-drift" style="--sw:-264px;--swd:34s"><path d="${swellPath(346, 9, 264)}" fill="url(#alb-b1)"/></g>
      <g>${glit}</g>
      <g class="alb-fishg" style="--fdur:52s;--fdel:-12s" opacity="0.3">
        <g transform="translate(0 402)"><g transform="scale(-1.1 1.1)">
          <path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#0A1D22"/><path d="M0 0l-7-5 0 10z" fill="#0A1D22"/>
        </g></g>
      </g>
      <g class="alb-drift" style="--sw:220px;--swd:27s"><path d="${swellPath(398, 12, 220)}" fill="url(#alb-b2)"/></g>
      <g class="alb-fishg" style="--fdur:64s;--fdel:-40s" opacity="0.24">
        <g transform="translate(0 470)"><g transform="scale(-1.7 1.7)">
          <path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#071318"/><path d="M0 0l-7-5 0 10z" fill="#071318"/>
        </g></g>
      </g>
      <g class="alb-drift" style="--sw:-184px;--swd:21s"><path d="${swellPath(452, 15, 184)}" fill="url(#alb-b3)"/></g>
    </svg>`;
  }
  // slow-rising bubbles + twinkling star pins (HTML spans, CSS-driven)
  function moteHTML() {
    let h = '';
    for (let i = 0; i < 7; i++) {
      const lf = (4 + Math.random() * 92).toFixed(1);
      const sz = (3 + Math.random() * 5).toFixed(1);
      const dur = (11 + Math.random() * 10).toFixed(1);
      const del = (-Math.random() * 16).toFixed(1);
      h += `<span class="al-mote" style="left:${lf}%;width:${sz}px;height:${sz}px;--mdur:${dur}s;--mdel:${del}s"></span>`;
    }
    for (let i = 0; i < 8; i++) {
      const lf = (3 + Math.random() * 94).toFixed(1);
      const tp = (2 + Math.random() * 16).toFixed(1);
      const tw = (2.6 + Math.random() * 3).toFixed(1);
      h += `<span class="al-amb-star" style="left:${lf}%;top:${tp}%;--tw:${tw}s;--twd:${(-Math.random() * 4).toFixed(1)}s"></span>`;
    }
    return h;
  }

  /* ───────── scene art ───────── */
  // seamless wave stroke: 88px period, wide enough to drift ±88px without gaps
  function wavePath(y) {
    let d = `M-152 ${y} q22 -7 44 0`;
    for (let k = 0; k < 27; k++) d += ' t44 0';
    return d;
  }
  function starsSVG() {
    let s = '';
    for (let i = 0; i < 14; i++) {
      const x = Math.round(Math.random() * 960);
      if (x > 530 && x < 780) continue; // keep the sun's halo clean
      const y = Math.round(8 + Math.random() * 92);
      const r = (0.7 + Math.random() * 0.9).toFixed(1);
      const tw = (2.4 + Math.random() * 3).toFixed(1);
      const twd = (-Math.random() * 4).toFixed(1);
      s += `<circle class="al-star" cx="${x}" cy="${y}" r="${r}" fill="#EAF2F6" style="--tw:${tw}s;--twd:${twd}s"/>`;
    }
    return s;
  }
  function glitterSVG() {
    let g = '';
    for (let i = 0; i < 18; i++) {
      const t = Math.random();
      const y = Math.round(242 + t * t * 118);
      const x = Math.round(590 + (Math.random() - 0.5) * (96 + t * 60));
      const w = Math.round(5 + Math.random() * 15);
      const o = (0.12 + Math.random() * 0.22).toFixed(2);
      const tw = (1.7 + Math.random() * 2.4).toFixed(1);
      const twd = (-Math.random() * 3).toFixed(1);
      g += `<rect class="al-glit" x="${x}" y="${y}" width="${w}" height="2" rx="1" fill="#F6E2B0" opacity="${o}" style="--tw:${tw}s;--twd:${twd}s"/>`;
    }
    return g;
  }
  function causticsSVG() {
    let c = '';
    for (let i = 0; i < 7; i++) {
      const x = Math.round(270 + Math.random() * 620);
      const y = Math.round(248 + Math.random() * 52);
      const w = Math.round(26 + Math.random() * 26);
      const o = (0.08 + Math.random() * 0.1).toFixed(2);
      c += `<path d="M${x} ${y} q ${Math.round(w / 2)} -9 ${w} 0" stroke="#BFE4E8" stroke-opacity="${o}" stroke-width="1.3" fill="none"/>`;
    }
    return c;
  }

  function sceneSVG() {
    const zoneX=[[240,240],[480,230],[710,250]]; // [x,width] per zone over the water
    // hover-only fauna preview: what swims in these waters, told by rarity
    const FAUNA=[
      // ΑΚΤΗ: a shoal of small silver sardines
      `<g class="al-zfish" style="--zfd:2.8s"><g transform="translate(-34 16) scale(.62)"><path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#7FA8B0"/><path d="M0 0l-7-5 0 10z" fill="#7FA8B0"/></g></g>
       <g class="al-zfish" style="--zfd:3.4s;--zfdel:-1.2s"><g transform="translate(22 22) scale(-.5 .5)"><path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#6E99A2"/><path d="M0 0l-7-5 0 10z" fill="#6E99A2"/></g></g>
       <g class="al-zfish" style="--zfd:3s;--zfdel:-2s"><g transform="translate(-6 27) scale(.45)"><path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#7FA8B0"/><path d="M0 0l-7-5 0 10z" fill="#7FA8B0"/></g></g>`,
      // ΠΕΛΑΓΟΣ: a proper fish and a curling octopus arm
      `<g class="al-zfish" style="--zfd:3.2s"><g transform="translate(-30 14) scale(1)"><path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#5E8B96"/><path d="M0 0l-7-5 0 10z" fill="#5E8B96"/><circle cx="14" cy="-1.4" r="1" fill="#D6ECEF"/></g></g>
       <g class="al-zfish" style="--zfd:3.8s;--zfdel:-1.6s"><g transform="translate(26 24) scale(-.6 .6)"><path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#4E7B86"/><path d="M0 0l-7-5 0 10z" fill="#4E7B86"/></g></g>
       <path class="al-ztent" d="M40 34 C 36 22 44 16 40 6 C 38 2 42 -1 45 1" stroke="#122A33" stroke-width="3.4" stroke-linecap="round" fill="none"/>`,
      // ΒΥΘΟΣ: a golden glint and a great shadow beneath
      `<g class="al-zfish" style="--zfd:3.6s"><g transform="translate(-26 10) scale(-.9 .9)"><path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#C9A54C"/><path d="M0 0l-7-5 0 10z" fill="#B08838"/><circle cx="14" cy="-1.2" r="1" fill="#F6E2B0"/></g></g>
       <g class="al-zfish" style="--zfd:4.4s;--zfdel:-2.2s"><g transform="translate(6 30) scale(1.8)" opacity=".65"><path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#06131B"/><path d="M0 0l-7-5 0 10z" fill="#06131B"/></g></g>`,
    ];
    let zones='';
    ZONES.forEach((z,i)=>{
      const [x,w]=zoneX[i]; const cx=x+w/2; const [tx,ty]=z.target;
      zones += `<g class="al-zone" onclick="Halieia._cast(${i})">
        <rect class="al-zone-fill" x="${x}" y="235" width="${w}" height="178"/>
        <ellipse class="al-zone-spot" cx="${tx}" cy="${ty}" rx="88" ry="32" fill="url(#alx-spot)"/>
        <g class="al-zone-fauna" transform="translate(${tx} ${ty})">${FAUNA[i]}</g>
        <g class="al-zone-mark" transform="translate(${tx} ${ty-56})"><g>
          <circle cx="0" cy="2" r="15" fill="url(#alx-spot)" opacity="0.85"/>
          <path d="M0 9 L-8 -5 L8 -5 Z" fill="#F4D9A0" stroke="#3A2A10" stroke-opacity="0.4" stroke-width="1"/>
        </g></g>
        <rect class="al-zone-plate" x="${cx-84}" y="366" width="168" height="47" rx="10"/>
        <text class="al-zone-lbl" id="al-z${i}-lbl" x="${cx}" y="388" font-size="17"></text>
        <text class="al-zone-hint" id="al-z${i}-hint" x="${cx}" y="406" fill="${i===2?'#E08577':i===0?'#9DBE84':'#E3C766'}"></text>
      </g>`;
    });
    return `<svg viewBox="0 0 960 420" fill="none" id="al-sea" class="al-sea">
      <defs>
        <linearGradient id="alx-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#0C1A28"/><stop offset="0.42" stop-color="#17383F"/>
          <stop offset="0.66" stop-color="#275048"/><stop offset="0.86" stop-color="#6E5638"/>
          <stop offset="1" stop-color="#C8985A"/>
        </linearGradient>
        <radialGradient id="alx-halo" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#F4D9A0" stop-opacity="0.85"/><stop offset="1" stop-color="#F4D9A0" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="alx-disc" cx="42%" cy="38%" r="70%">
          <stop offset="0" stop-color="#FFF4D6"/><stop offset="0.55" stop-color="#F6DFA8"/><stop offset="1" stop-color="#ECB877"/>
        </radialGradient>
        <linearGradient id="alx-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4E8791"/><stop offset="0.35" stop-color="#2E5B64"/>
          <stop offset="0.7" stop-color="#143039"/><stop offset="1" stop-color="#091C24"/>
        </linearGradient>
        <linearGradient id="alx-tint0" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#8BC4A8" stop-opacity="0"/><stop offset="0.3" stop-color="#8BC4A8" stop-opacity="0.24"/>
          <stop offset="1" stop-color="#8BC4A8" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="alx-tint2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#040A12" stop-opacity="0"/><stop offset="1" stop-color="#040A12" stop-opacity="0.58"/>
        </linearGradient>
        <radialGradient id="alx-abyss" cx="50%" cy="50%" r="50%">
          <stop offset="0.3" stop-color="#020610" stop-opacity="0"/><stop offset="1" stop-color="#020610" stop-opacity="0.6"/>
        </radialGradient>
        <linearGradient id="alx-ray" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F6E2B0" stop-opacity="0.52"/><stop offset="0.55" stop-color="#F6E2B0" stop-opacity="0.17"/>
          <stop offset="1" stop-color="#F6E2B0" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="alx-beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F6E2B0" stop-opacity="0.55"/><stop offset="0.6" stop-color="#E3C766" stop-opacity="0.18"/>
          <stop offset="1" stop-color="#E3C766" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="alx-streak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F4D9A0" stop-opacity="0.2"/><stop offset="0.5" stop-color="#F4D9A0" stop-opacity="0.06"/>
          <stop offset="1" stop-color="#F4D9A0" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="alx-spot" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#D6ECEF" stop-opacity="0.32"/><stop offset="0.55" stop-color="#D6ECEF" stop-opacity="0.1"/>
          <stop offset="1" stop-color="#D6ECEF" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="alx-fire" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#F2B36B" stop-opacity="0.55"/><stop offset="1" stop-color="#F2B36B" stop-opacity="0"/>
        </radialGradient>
        <radialGradient id="alx-tipglow" cx="50%" cy="50%" r="50%">
          <stop offset="0" stop-color="#E3C766" stop-opacity="0.8"/><stop offset="1" stop-color="#E3C766" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="alx-hot" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#F2C87E" stop-opacity="0.44"/><stop offset="1" stop-color="#F2C87E" stop-opacity="0"/>
        </linearGradient>
        <radialGradient id="alx-bobg" cx="38%" cy="30%" r="75%">
          <stop offset="0" stop-color="#E06048"/><stop offset="1" stop-color="#93301F"/>
        </radialGradient>
        <radialGradient id="alx-vig" cx="50%" cy="42%" r="72%">
          <stop offset="0.55" stop-color="#030B0D" stop-opacity="0"/><stop offset="1" stop-color="#030B0D" stop-opacity="0.5"/>
        </radialGradient>
        <pattern id="alx-meander" width="26" height="13" patternUnits="userSpaceOnUse">
          <path d="M2 11 V3 H20 V7 H8 V11 H24" fill="none" stroke="#F4D9A0" stroke-width="1.4" stroke-opacity="0.75"/>
        </pattern>
        <filter id="alx-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
        <filter id="alx-soft2" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="11"/></filter>
      </defs>

      <!-- ═ sky ═ -->
      <rect x="0" y="0" width="960" height="235" fill="url(#alx-sky)"/>
      <g>${starsSVG()}</g>
      <circle class="al-halo" cx="650" cy="207" r="150" fill="url(#alx-halo)" filter="url(#alx-soft2)"/>
      <circle cx="650" cy="207" r="58" fill="url(#alx-halo)" opacity="0.9"/>
      <circle cx="650" cy="208" r="34" fill="url(#alx-disc)"/>
      <rect x="520" y="203" width="260" height="3" rx="1.5" fill="#F6E2B0" opacity="0.22" filter="url(#alx-soft)"/>
      <!-- drifting cloud bands -->
      <g class="al-cloud" style="--cld:34s" opacity="0.5">
        <ellipse cx="300" cy="118" rx="92" ry="10" fill="#122530"/>
        <ellipse cx="362" cy="110" rx="58" ry="8" fill="#122530"/>
        <path d="M212 124 h178" stroke="#E0A868" stroke-opacity="0.25" stroke-width="1.4"/>
      </g>
      <g class="al-cloud" style="--cld:46s" opacity="0.6">
        <ellipse cx="742" cy="150" rx="110" ry="9" fill="#1A2E36"/>
        <path d="M642 158 h200" stroke="#F4D9A0" stroke-opacity="0.3" stroke-width="1.2"/>
      </g>
      <g class="al-cloud" style="--cld:58s" opacity="0.35">
        <ellipse cx="520" cy="58" rx="130" ry="7" fill="#20343C"/>
      </g>
      <!-- gulls -->
      <g class="al-gull" style="--gld:19s" transform="translate(468 128)">
        <path d="M-8 0 Q-4 -5 0 -1 Q4 -5 8 0" stroke="#0D1B24" stroke-width="2" fill="none" stroke-linecap="round"/>
      </g>
      <g class="al-gull" style="--gld:24s" transform="translate(536 100)">
        <path d="M-6 0 Q-3 -4 0 -1 Q3 -4 6 0" stroke="#0D1B24" stroke-width="1.7" fill="none" stroke-linecap="round"/>
      </g>
      <!-- distant isles + a temple against the dusk -->
      <path d="M400 235 q70 -30 150 -26 t170 26 z" fill="#16262C" opacity="0.85"/>
      <path d="M690 235 q60 -24 130 -19 t140 19 z" fill="#1B3138"/>
      <g transform="translate(546 214)" fill="#0E1A22" stroke="#0E1A22" opacity="0.9">
        <path d="M-11 0 H11 L0 -6 Z"/>
        <path d="M-8 7 V1 M-4 7 V1 M0 7 V1 M4 7 V1 M8 7 V1" stroke-width="1.7" fill="none"/>
        <rect x="-11" y="7" width="22" height="2.2"/>
      </g>
      <rect x="380" y="212" width="580" height="23" fill="#C8985A" opacity="0.05"/>

      <!-- ═ one living body of water ═ -->
      <rect x="0" y="235" width="960" height="185" fill="url(#alx-water)"/>
      <rect x="240" y="235" width="270" height="185" fill="url(#alx-tint0)"/>
      <rect x="600" y="235" width="360" height="185" fill="url(#alx-tint2)"/>
      <ellipse cx="880" cy="430" rx="270" ry="150" fill="url(#alx-abyss)"/>
      <!-- god rays under the sun -->
      <g class="al-rays" filter="url(#alx-soft2)">
        <path d="M604 236 L536 420 L618 420 L634 236 Z" fill="url(#alx-ray)" opacity="0.5"/>
        <path d="M636 236 L640 420 L700 420 L664 236 Z" fill="url(#alx-ray)" opacity="0.68"/>
        <path d="M668 236 L742 420 L806 420 L692 236 Z" fill="url(#alx-ray)" opacity="0.4"/>
      </g>
      <!-- the sun's reflection streak breathing on the swell -->
      <path class="al-sunstreak" d="M626 236 L674 236 L708 420 L592 420 Z" fill="url(#alx-streak)" filter="url(#alx-soft)"/>
      <!-- sun glitter on the swell -->
      <g>${glitterSVG()}</g>
      <!-- surface line + drifting wave strokes -->
      <path d="M0 236 H960" stroke="#D7ECEF" stroke-opacity="0.28" stroke-width="1.4"/>
      <g class="al-waves-1" stroke="#9CC3CC" stroke-opacity="0.26" stroke-width="1.8" fill="none">
        <path d="${wavePath(252)}"/><path d="${wavePath(270)}" stroke-opacity="0.18"/>
      </g>
      <g class="al-waves-2" stroke="#9CC3CC" stroke-opacity="0.18" stroke-width="2" fill="none">
        <path d="${wavePath(312)}"/>
      </g>
      <g class="al-waves-3" stroke="#9CC3CC" stroke-opacity="0.13" stroke-width="2" fill="none">
        <path d="${wavePath(356)}"/><path d="${wavePath(392)}" stroke-opacity="0.09"/>
      </g>
      <g class="al-caustics">${causticsSVG()}</g>

      <!-- ambient fish drifting in the sea -->
      <g class="al-ambient" fill="#0C2227" fill-opacity="0.55">
        ${ambientFishSVG(330,288,1.0,0)}
        ${ambientFishSVG(560,360,0.8,-1)}
        ${ambientFishSVG(770,300,1.25,0)}
        ${ambientFishSVG(640,392,0.7,-1)}
        ${ambientFishSVG(440,344,0.9,-1)}
        ${ambientFishSVG(302,322,0.55,0)}
        ${ambientFishSVG(318,330,0.5,0)}
        ${ambientFishSVG(290,332,0.5,0)}
      </g>
      <!-- a rare golden fish glints through the deep now and then -->
      <g class="al-amb-rareg" transform="translate(918 330)"><g class="al-amb-rare">
        <g transform="scale(-1.15 1.15)">
          <path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#C9A54C" fill-opacity="0.85"/>
          <path d="M0 0l-7-5 0 10z" fill="#B08838" fill-opacity="0.85"/>
          <circle cx="14" cy="-1.2" r="1" fill="#F6E2B0"/>
        </g>
      </g></g>
      <!-- something big patrols the deep… -->
      <g class="al-amb-big" opacity="0.5">
        <g transform="translate(846 384)"><g transform="scale(-2.6 2.6)">
          <path d="M0 0q9-7 19 0q-10 7-19 0z" fill="#06131B"/>
          <path d="M0 0l-7-5 0 10z" fill="#06131B"/>
        </g></g>
      </g>
      <path class="al-tenthint" d="M946 424 C 938 386 954 366 940 338 C 934 326 942 318 948 322" stroke="#050D14" stroke-width="8" stroke-linecap="round" fill="none" opacity="0.16"/>

      <!-- frenzy: the water itself glows -->
      <g id="al-fglow">
        <rect x="0" y="235" width="960" height="80" fill="url(#alx-hot)"/>
        <circle class="al-hotspark" cx="340" cy="300" r="1.7" fill="#F2C87E" style="--spk:3.1s;--spkd:0s"/>
        <circle class="al-hotspark" cx="470" cy="330" r="1.3" fill="#F6E2B0" style="--spk:3.8s;--spkd:-1.2s"/>
        <circle class="al-hotspark" cx="590" cy="296" r="1.8" fill="#F2C87E" style="--spk:2.8s;--spkd:-2s"/>
        <circle class="al-hotspark" cx="700" cy="332" r="1.4" fill="#F6E2B0" style="--spk:3.5s;--spkd:-0.6s"/>
        <circle class="al-hotspark" cx="820" cy="308" r="1.6" fill="#F2C87E" style="--spk:3.3s;--spkd:-1.8s"/>
        <circle class="al-hotspark" cx="880" cy="340" r="1.2" fill="#F6E2B0" style="--spk:4s;--spkd:-2.6s"/>
      </g>

      <!-- ═ rocky shore, the angler's world ═ -->
      <path d="M0 420 L0 352 L44 308 L96 294 L154 300 L206 330 L234 374 L240 420 Z" fill="#0A1410"/>
      <path d="M0 352 L44 308 L96 294 L154 300 L148 308 L94 302 L48 318 L8 360 Z" fill="#1E3B30" opacity="0.85"/>
      <path d="M154 300 L206 330 L234 374" stroke="#C8985A" stroke-opacity="0.45" stroke-width="2" fill="none"/>
      <circle cx="60" cy="318" r="3" fill="#2C5A44" opacity="0.8"/>
      <circle cx="84" cy="313" r="2" fill="#2C5A44" opacity="0.7"/>
      <circle cx="108" cy="306" r="2.3" fill="#2C5A44" opacity="0.75"/>
      <!-- foam licking the rock -->
      <ellipse class="al-foam" cx="196" cy="326" rx="14" ry="2.4" fill="#D6ECEF" opacity="0.3"/>
      <ellipse class="al-foam" cx="224" cy="360" rx="16" ry="3" fill="#D6ECEF" opacity="0.26" style="animation-delay:-1.4s"/>
      <ellipse class="al-foam" cx="238" cy="396" rx="12" ry="2.6" fill="#D6ECEF" opacity="0.2" style="animation-delay:-2.3s"/>
      <!-- amphora of the day's catch -->
      <g transform="translate(44 312)">
        <path d="M-5 -16 h10 l-1.5 3 h-7 z" fill="#8A4A2E"/>
        <rect x="-3" y="-13" width="6" height="4" fill="#7C3F26"/>
        <path d="M0 -9 q8 2 7 11 q-1 9 -7 13 q-6 -4 -7 -13 q-1 -9 7 -11 z" fill="#8A4A2E"/>
        <path d="M-4.6 -7 q-3.4 4 -2.6 9" stroke="#C97C4A" stroke-opacity="0.8" stroke-width="1.3" fill="none"/>
        <path d="M-6.6 -8 q-4.4 2 -2.8 6 M6.6 -8 q4.4 2 2.8 6" stroke="#7C3F26" stroke-width="1.6" fill="none"/>
        <path d="M-6.4 -2 h12.8 M-6.8 1.5 h13.6" stroke="#3A2015" stroke-opacity="0.85" stroke-width="1.1"/>
      </g>
      <!-- brazier: a real light source on the rock -->
      <g transform="translate(86 302)">
        <circle class="al-fireglow" r="32" cy="-8" fill="url(#alx-fire)" filter="url(#alx-soft2)"/>
        <path d="M-6 8 L0 0 L6 8 M0 0 V-2" stroke="#241A10" stroke-width="1.8" fill="none"/>
        <path d="M-7 -3 q7 7 14 0 l-2 -4 h-10 z" fill="#241A10"/>
        <g class="al-flame" transform="translate(0 -6)">
          <path d="M0 0 C-4.5 -6 -2.5 -11 0 -16 C2.5 -11 4.5 -6 0 0 Z" fill="#E89A54"/>
          <path d="M0 -1.5 C-2.4 -5 -1.4 -8 0 -10.5 C1.4 -8 2.4 -5 0 -1.5 Z" fill="#FBE1A8"/>
        </g>
      </g>
      <!-- the angler, black-figure style -->
      <g fill="#0B1712" stroke="#0B1712">
        <path d="M104 296 l-6 -42 14 0 -2 42z"/>
        <path d="M118 296 l4 -44 12 2 -4 42z"/>
        <path d="M96 256 q18 -20 44 -8 l8 30 q-30 12 -56 2z"/>
        <path d="M132 236 l34 14 -4 9 -34 -12z"/>
        <circle cx="116" cy="222" r="12.5"/>
        <path d="M98 256 q-6 -24 14 -36 l8 6 q-16 10 -10 32z"/>
      </g>
      <!-- sun rim + fire bounce light on the figure -->
      <path d="M128 196 q12 6 12 24 M150 250 l14 6" stroke="#C8985A" stroke-opacity="0.55" stroke-width="2" fill="none"/>
      <path class="al-fireglow" d="M100 254 q-6 -22 12 -34" stroke="#E8A868" stroke-opacity="0.4" stroke-width="1.6" fill="none"/>
      <!-- the rod (καλάμι) -->
      <g id="al-rodg" style="transform-box:fill-box;transform-origin:0% 100%;">
        <path d="M150 250 Q 210 196 ${ROD.x} ${ROD.y}" stroke="#6E5024" stroke-width="3.5" fill="none" stroke-linecap="round"/>
        <path d="M150 250 Q 210 196 ${ROD.x} ${ROD.y}" stroke="#B98A4C" stroke-opacity="0.6" stroke-width="1.4" fill="none" stroke-linecap="round"/>
        <circle class="al-rodtip" cx="${ROD.x}" cy="${ROD.y}" r="7" fill="url(#alx-tipglow)" opacity="0.6"/>
        <circle cx="${ROD.x}" cy="${ROD.y}" r="2.5" fill="#E3C766"/>
      </g>

      <!-- idle tackle: the line hangs slack in the water until the cast -->
      <g id="al-idleg" class="al-idleg">
        <path d="M${ROD.x} ${ROD.y} Q ${ROD.x+17} ${((ROD.y+240)/2)+16} ${ROD.x+34} 240" stroke="#EDEAE0" stroke-opacity="0.55" stroke-width="1.3" fill="none"/>
        <path d="M${ROD.x+34} 240 q 3 5 1 9" stroke="#BFE4E8" stroke-opacity="0.35" stroke-width="1" fill="none"/>
        <ellipse class="al-idleripple" cx="${ROD.x+34}" cy="241" rx="7" ry="2.6" fill="none" stroke="#D6ECEF" stroke-opacity="0.55" stroke-width="1.2"/>
        <ellipse class="al-idleripple" cx="${ROD.x+34}" cy="241" rx="7" ry="2.6" fill="none" stroke="#D6ECEF" stroke-opacity="0.55" stroke-width="1.2" style="animation-delay:-1.7s"/>
      </g>

      <!-- cast bits -->
      <path id="al-castline" d="" stroke="#EDEAE0" stroke-opacity="0.75" stroke-width="1.6" fill="none"/>
      <g id="al-bob" transform="translate(${ROD.x},${ROD.y})" opacity="0">
        <ellipse cx="0" cy="0" rx="6" ry="7" fill="url(#alx-bobg)"/>
        <ellipse cx="0" cy="2.8" rx="6" ry="4" fill="#F0EBE0"/>
        <ellipse cx="-1.8" cy="-2.8" rx="1.9" ry="2.5" fill="#FFFFFF" opacity="0.4"/>
        <circle cx="0" cy="0" r="1.6" fill="#3A1410"/>
      </g>
      <!-- fill must be explicit: the root svg carries fill="none", and Chromium
           skips painting inherited-none text entirely — the catch never showed -->
      <text id="al-fish" x="0" y="0" font-size="60" text-anchor="middle" opacity="0" fill="#EDEAE0">🐟</text>
      <g id="al-splash"></g>
      <g id="al-school"></g>
      <g id="al-tent"></g>

      <!-- meander band + vignette + sheen -->
      <rect x="0" y="406" width="960" height="14" fill="url(#alx-meander)" opacity="0.14"/>
      <rect x="0" y="0" width="960" height="420" fill="url(#alx-vig)" pointer-events="none"/>
      <path d="M0 0 L330 0 L120 420 L0 420 Z" fill="#F6E2B0" opacity="0.02" pointer-events="none"/>
      <rect id="al-flash" x="0" y="0" width="960" height="420" fill="#F4D9A0" opacity="0"/>

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

  // water burst where the line breaks the surface — power scales with the event
  function splash(tx, ty, power) {
    const p = (power == null) ? 1 : power;
    const sp = document.getElementById('al-splash');
    if (!sp) return;
    sp.innerHTML = '';
    const n = RM() ? 4 : Math.max(4, Math.round(10*p));
    const reach = 0.72 + 0.5*p;
    for (let i=0;i<n;i++){
      const c = document.createElementNS(SVGNS,'circle');
      c.setAttribute('cx',tx); c.setAttribute('cy',ty);
      c.setAttribute('r',((1.4+Math.random()*2.4)*(0.8+0.35*p)).toFixed(1));
      c.setAttribute('fill','#D6ECEF'); c.setAttribute('fill-opacity','0.85');
      sp.appendChild(c);
      const ang = -Math.PI/2 + (Math.random()-0.5)*Math.PI*0.95;
      const d = (26+Math.random()*44)*reach;
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
      { transform:`scale(${(3.6*(0.75+0.45*p)).toFixed(1)})`, opacity:0 },
    ], { duration:820, easing:'ease-out', fill:'forwards' });
  }

  /* ── cast-scene set pieces (presentation only) ── */

  // after touchdown the taut cast line sags into a slack curve with a damped bounce
  function lineSettle(tx, ty) {
    if (_lineRAF) cancelAnimationFrame(_lineRAF);
    const midX=(ROD.x+tx)/2;
    const tautY=Math.min(ROD.y,ty)-70;
    const restY=(ROD.y+ty)/2+42;
    const t0=performance.now(), D=640;
    const step=(now)=>{
      const el=document.getElementById('al-castline');
      if (!el) { _lineRAF=0; return; }
      const t=Math.min(1,(now-t0)/D);
      const k=1 - Math.exp(-4.2*t)*Math.cos(9.5*t);
      const cy=tautY+(restY-tautY)*k;
      el.setAttribute('d',`M${ROD.x} ${ROD.y} Q ${midX} ${cy.toFixed(1)} ${tx} ${ty}`);
      _lineRAF = (t<1) ? requestAnimationFrame(step) : 0;
    };
    _lineRAF=requestAnimationFrame(step);
  }

  // concentric rings spreading from the bob while it waits for a bite
  function rippleRings(tx, ty) {
    const sp=document.getElementById('al-splash'); if(!sp) return;
    for (let i=0;i<3;i++){
      const ring=document.createElementNS(SVGNS,'ellipse');
      ring.setAttribute('cx',tx); ring.setAttribute('cy',ty+4);
      ring.setAttribute('rx','6'); ring.setAttribute('ry','2.6');
      ring.setAttribute('fill','none'); ring.setAttribute('stroke','#D6ECEF');
      ring.setAttribute('stroke-width','1.4'); ring.setAttribute('stroke-opacity','0.55');
      sp.appendChild(ring);
      ring.animate([
        { transform:'scale(.4)', opacity:0.7 },
        { transform:'scale(3.1)', opacity:0 },
      ], { duration:900, delay:i*240, easing:'cubic-bezier(.2,.6,.4,1)', fill:'forwards' });
    }
  }

  // the hook is set — a golden alert flares over the bob
  function biteAlert(tx, ty) {
    const sp=document.getElementById('al-splash'); if(!sp) return;
    const t=document.createElementNS(SVGNS,'text');
    t.setAttribute('class','al-bite-alert');
    t.setAttribute('x',tx); t.setAttribute('y',ty-30);
    t.setAttribute('text-anchor','middle');
    t.textContent='!';
    sp.appendChild(t);
    t.animate([
      { transform:'translate(0px,8px) scale(.3)', opacity:0 },
      { transform:'translate(0px,0px) scale(1.3)', opacity:1, offset:0.35 },
      { transform:'translate(0px,-2px) scale(1)', opacity:1, offset:0.7 },
      { transform:'translate(0px,-11px) scale(.8)', opacity:0 },
    ], { duration:470, easing:'cubic-bezier(.34,1.56,.64,1)', fill:'forwards' });
  }

  // full-scene colour flash, tinted by what surfaced (screen-blend rect)
  function sceneFlash(color, peak, dur) {
    const f=document.getElementById('al-flash'); if(!f) return;
    _kill(f);
    f.setAttribute('fill', color);
    const rm=RM();
    f.animate([
      { opacity:0 }, { opacity: rm ? peak*0.5 : peak, offset:0.16 }, { opacity:0 },
    ], { duration: rm ? 280 : dur, easing:'ease-out', fill:'forwards' });
  }

  // Scylla strikes: the whole scene shudders
  function sceneQuake() {
    if (RM()) return;
    const sc=document.getElementById('al-scene'); if(!sc) return;
    sc.classList.remove('al-quake'); void sc.offsetWidth; sc.classList.add('al-quake');
    setTimeout(()=>{ const s=document.getElementById('al-scene'); if(s) s.classList.remove('al-quake'); }, 620);
  }

  // tentacles breach around the bob — full drama for Scylla, one arm for the octopus
  function spawnTentacles(tx, ty, kind) {
    const tent=document.getElementById('al-tent'); if(!tent) return;
    tent.innerHTML='';
    const rm=RM();
    const stain=document.createElementNS(SVGNS,'ellipse');
    stain.setAttribute('cx',tx); stain.setAttribute('cy',ty+8);
    stain.setAttribute('rx','34'); stain.setAttribute('ry','12');
    stain.setAttribute('fill','#020910'); stain.setAttribute('opacity','0');
    tent.appendChild(stain);
    stain.animate([
      { opacity:0,   transform:'scale(.5)' },
      { opacity:0.62,transform:'scale(1.25)', offset:0.3 },
      { opacity:0.55,transform:'scale(1.45)', offset:0.75 },
      { opacity:0,   transform:'scale(1.7)' },
    ], { duration: rm?900:2100, easing:'ease-out', fill:'forwards' });

    // Scylla only: two baleful eyes glint up through the ink
    if (kind==='monster') {
      [-12, 12].forEach((ex, ei)=>{
        const eye=document.createElementNS(SVGNS,'ellipse');
        eye.setAttribute('cx',tx+ex); eye.setAttribute('cy',ty+10);
        eye.setAttribute('rx','2.7'); eye.setAttribute('ry','3.6');
        eye.setAttribute('fill','#F2C87E');
        eye.setAttribute('class','al-scylla-eye');
        eye.setAttribute('opacity','0');
        tent.appendChild(eye);
        eye.animate([
          { opacity:0,    transform:'translateY(7px)' },
          { opacity:0.95, transform:'translateY(0px)',  offset:0.22 },
          { opacity:0.85, transform:'translateY(-1px)', offset:0.68 },
          { opacity:0,    transform:'translateY(5px)' },
        ], { duration: rm?900:1600, delay: rm?0:230+ei*70, easing:'ease-in-out', fill:'forwards' });
      });
    }

    const arms = kind==='octopus'
      ? [ {dx:-16, s:0.75, flip:1, d:0}, {dx:14, s:0.6, flip:-1, d:140} ]
      : [ {dx:-30, s:1.05, flip:1, d:0}, {dx:26, s:0.9, flip:-1, d:130}, {dx:-2, s:1.32, flip:1, d:260} ];
    const armD='M0 6 C-11 -6 -7 -34 1 -54 C4 -63 11 -72 19 -70 C23 -69 23 -63 19 -62 C13 -60 9 -51 7 -41 C4 -23 7 -6 10 6 Z';
    const inkFill = kind==='octopus' ? '#122A33' : '#050D14';
    arms.forEach(a=>{
      const outer=document.createElementNS(SVGNS,'g');
      outer.setAttribute('transform',`translate(${tx+a.dx} ${ty+10}) scale(${a.flip*a.s} ${a.s})`);
      const inner=document.createElementNS(SVGNS,'g');
      inner.style.transformBox='fill-box'; inner.style.transformOrigin='50% 100%';
      inner.innerHTML =
        `<path d="${armD}" fill="${inkFill}"/>`+
        `<path d="M1 -54 C4 -63 11 -72 19 -70" stroke="#C8985A" stroke-opacity="0.35" stroke-width="1.2" fill="none"/>`+
        `<circle cx="-1" cy="-20" r="1.6" fill="#123039" opacity="0.9"/>`+
        `<circle cx="0.5" cy="-32" r="1.4" fill="#123039" opacity="0.9"/>`+
        `<circle cx="3" cy="-44" r="1.2" fill="#123039" opacity="0.9"/>`;
      outer.appendChild(inner); tent.appendChild(outer);
      if (rm) {
        inner.animate([
          { opacity:0 }, { opacity:0.95, offset:0.3 }, { opacity:0.95, offset:0.7 }, { opacity:0 },
        ], { duration:1000, fill:'forwards' });
      } else {
        inner.animate([
          { transform:'translateY(64px) scaleY(.25) rotate(0deg)', opacity:0 },
          { transform:'translateY(2px) scaleY(1.06) rotate(-4deg)', opacity:1, offset:0.22 },
          { transform:'translateY(0px) scaleY(1) rotate(7deg)', offset:0.42 },
          { transform:'translateY(1px) scaleY(1.02) rotate(-6deg)', offset:0.62 },
          { transform:'translateY(0px) scaleY(1) rotate(4deg)', offset:0.78 },
          { transform:'translateY(70px) scaleY(.3) rotate(-2deg)', opacity:0 },
        ], { duration:2050, delay:a.d, easing:'cubic-bezier(.3,.7,.3,1)', fill:'forwards' });
      }
    });
  }

  // a rare catch pulls a shaft of golden light down through the water
  function goldBeam(tx) {
    const sp=document.getElementById('al-splash'); if(!sp) return;
    const r=document.createElementNS(SVGNS,'rect');
    r.setAttribute('x',tx-30); r.setAttribute('y',236);
    r.setAttribute('width','60'); r.setAttribute('height','184');
    r.setAttribute('fill','url(#alx-beam)'); r.setAttribute('opacity','0');
    sp.appendChild(r);
    r.animate([
      { opacity:0,   transform:'scaleX(.3)' },
      { opacity:0.9, transform:'scaleX(1)', offset:0.3 },
      { opacity:0,   transform:'scaleX(1.25)' },
    ], { duration: RM()?400:950, easing:'ease-out', fill:'forwards' });
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
        b.setAttribute('fill','#D6ECEF'); // root svg is fill:none — text needs its own
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
      t.setAttribute('fill','#EDEAE0'); // root svg is fill:none — text needs its own
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
