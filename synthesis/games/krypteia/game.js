/* ══════════════════════ ΚΡΥΠΤΕΙΑ — Competitive Cipher Arena ══════════════════════
   A timed cipher contest among you + 5–9 bot agents.
   Answer → draw a cipher operation → steal / reduce / divide(dice) / multiply(dice)
   / bonus / curse / nothing. Crack the target's scytale by hand. Sometimes the
   cipher breaks clean and you choose your victim. Highest drachmas at the bell wins.
   API:  Krypteia.open()  Krypteia.close()   reads window.SYM_QUESTIONS + window.siteLang
═══════════════════════════════════════════════════════════════════════════════ */
const Krypteia = (() => {

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

  // Question source. The Games-Panel bridge (nav.js _gpInjectEngineData) fills
  // the live global window.KR_Q with MC items {q:{gr,en}, a:[4], c} at launch;
  // a standalone launch falls back to the shared window.SYM_QUESTIONS bank.
  const _gpPool = () => {
    const g = window.KR_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const RIVAL_POOL = [
    { name:'ΛΥΣΑΝΔΡΟΣ',  word:'ΣΠΑΡΤΗ'  }, { name:'ΒΡΑΣΙΔΑΣ',    word:'ΝΙΚΗ'    },
    { name:'ΓΥΛΙΠΠΟΣ',   word:'ΛΟΓΧΗ'   }, { name:'ΑΛΚΙΒΙΑΔΗΣ',  word:'ΚΡΥΠΤΟΣ' },
    { name:'ΠΑΥΣΑΝΙΑΣ',  word:'ΑΣΠΙΣ'   }, { name:'ΑΓΗΣΙΛΑΟΣ',   word:'ΦΑΛΑΓΞ'  },
    { name:'ΛΕΩΝΙΔΑΣ',   word:'ΘΕΡΜΟΣ'  }, { name:'ΘΕΜΙΣΤΟΚΛΗΣ', word:'ΣΑΛΑΜΙΣ' },
    { name:'ΑΡΧΙΔΑΜΟΣ',  word:'ΔΟΡΥ'    }, { name:'ΚΛΕΟΜΒΡΟΤΟΣ', word:'ΞΙΦΟΣ'   },
  ];
  const RIVAL_GLYPHS = ['Λ','Β','Γ','Α','Π','Ξ','Ρ','Θ','Δ','Κ'];
  const SEALS = [
    { glyph:'Σ', name:'ΣΦΗΞ',  sub:()=>T('Η Σφήγγα','The Sphinx') },
    { glyph:'Φ', name:'ΦΟΒΟΣ', sub:()=>T('Ο Φόβος','Dread') },
    { glyph:'Δ', name:'ΔΡΑΚΩΝ', sub:()=>T('Ο Δράκων','The Dragon') },
  ];
  const GREEK = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';
  // 100 random Greek scytale words (uppercase, no diacritics) — drawn at random for each rival's code
  const GREEK_WORDS = [
    'ΣΠΑΡΤΗ','ΝΙΚΗ','ΛΟΓΧΗ','ΚΡΥΠΤΟΣ','ΑΣΠΙΣ','ΦΑΛΑΓΞ','ΘΕΡΜΟΣ','ΣΑΛΑΜΙΣ','ΔΟΡΥ','ΞΙΦΟΣ',
    'ΑΘΗΝΑ','ΑΡΗΣ','ΖΕΥΣ','ΗΡΑ','ΑΠΟΛΛΩΝ','ΕΡΜΗΣ','ΑΡΤΕΜΙΣ','ΕΣΤΙΑ','ΠΛΟΥΤΩΝ','ΧΑΟΣ',
    'ΚΟΣΜΟΣ','ΛΟΓΟΣ','ΨΥΧΗ','ΣΩΜΑ','ΝΟΥΣ','ΑΡΕΤΗ','ΣΟΦΙΑ','ΔΙΚΗ','ΤΥΧΗ','ΜΟΙΡΑ',
    'ΧΡΟΝΟΣ','ΘΑΝΑΤΟΣ','ΥΠΝΟΣ','ΦΟΒΟΣ','ΕΡΩΣ','ΧΑΡΙΣ','ΕΙΡΗΝΗ','ΠΟΛΕΜΟΣ','ΝΟΜΟΣ','ΔΗΜΟΣ',
    'ΠΟΛΙΣ','ΑΓΟΡΑ','ΒΟΥΛΗ','ΣΤΡΑΤΟΣ','ΝΑΥΣ','ΤΡΙΗΡΗΣ','ΛΙΜΗΝ','ΝΗΣΟΣ','ΘΑΛΑΣΣΑ','ΚΥΜΑ',
    'ΑΝΕΜΟΣ','ΠΥΡ','ΥΔΩΡ','ΓΑΙΑ','ΟΥΡΑΝΟΣ','ΗΛΙΟΣ','ΣΕΛΗΝΗ','ΑΣΤΗΡ','ΦΩΣ','ΣΚΙΑ',
    'ΟΡΟΣ','ΠΟΤΑΜΟΣ','ΔΕΝΔΡΟΝ','ΑΝΘΟΣ','ΚΑΡΠΟΣ','ΟΙΝΟΣ','ΑΡΤΟΣ','ΜΕΛΙ','ΓΑΛΑ','ΧΡΥΣΟΣ',
    'ΑΡΓΥΡΟΣ','ΣΙΔΗΡΟΣ','ΛΙΘΟΣ','ΠΕΤΡΑ','ΣΤΕΦΑΝΟΣ','ΘΡΟΝΟΣ','ΒΑΣΙΛΕΥΣ','ΤΥΡΑΝΝΟΣ','ΔΟΥΛΟΣ','ΞΕΝΟΣ',
    'ΦΙΛΟΣ','ΕΧΘΡΟΣ','ΜΑΧΗ','ΤΕΙΧΟΣ','ΠΥΛΗ','ΠΥΡΓΟΣ','ΤΟΞΟΝ','ΒΕΛΟΣ','ΚΡΑΝΟΣ','ΘΩΡΑΞ',
    'ΙΠΠΟΣ','ΑΡΜΑ','ΗΡΩΣ','ΜΥΘΟΣ','ΟΡΚΟΣ','ΤΙΜΗ','ΔΟΞΑ','ΚΛΕΟΣ','ΠΑΘΟΣ','ΑΙΝΙΓΜΑ',
  ];
  const DIE_PIPS = { 1:[4], 2:[0,8], 3:[0,4,8], 4:[0,2,6,8], 5:[0,2,4,6,8], 6:[0,2,3,5,6,8] };

  let st = {};
  let timers = { game:null, bots:null, dx:null, anim:null };
  let cfg = { rivals:5, time:180 };

  /* fire a cinematic-FX event; no-op if nothing is listening (standalone-safe) */
  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('kr:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#kr-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('kr-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    _bdStart();
    if (!document.getElementById('kr-screen-seal')) build();
    syncLang();
    show('kr-screen-seal');
    renderSetup();
    renderSeals();
  }
  function close() {
    stopAll();
    _bdStop();
    document.getElementById('kr-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }
  function stopAll(){ Object.keys(timers).forEach(k=>{ if(timers[k]){ clearInterval(timers[k]); clearTimeout(timers[k]); timers[k]=null; } }); }

  // Build the overlay shell on demand so the game is drop-in: it works whether or
  // not the host page already declares <div id="kr-overlay">. Uses the shared
  // SymposiON overlay classes (.sym-overlay / .overlay-topbar / .sym-btn …).
  function _ensureOverlay(gp) {
    if (document.getElementById('kr-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'kr-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeKrypteia()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u039a\u03a1\u03a5\u03a0\u03a4\u0395\u0399\u0391') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<canvas id="kr-backdrop" aria-hidden="true"></canvas>' +
      '<div class="overlay-stage"><div id="kr-wrap"></div></div>';
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
    document.getElementById('kr-wrap').innerHTML = `
<!-- SEAL / SETUP -->
<div id="kr-screen-seal" class="kr-screen">
  <div class="kr-logo">ΚΡΥΠΤΕΙΑ</div>
  <div class="kr-tag" data-i18n="tag"></div>
  <div class="kr-tag2" data-i18n="intro"></div>
  <div class="kr-setup">
    <div class="kr-setup-group">
      <span class="kr-setup-lbl" data-i18n="rivals"></span>
      <div class="kr-seg" id="kr-seg-rivals">
        <button data-v="5" class="on">5</button><button data-v="7">7</button><button data-v="9">9</button>
      </div>
    </div>
    <div class="kr-setup-group">
      <span class="kr-setup-lbl" data-i18n="duration"></span>
      <div class="kr-seg" id="kr-seg-time">
        <button data-v="120">2:00</button><button data-v="180" class="on">3:00</button><button data-v="300">5:00</button>
      </div>
    </div>
  </div>
  <div class="kr-seal-prompt" data-i18n="pickseal"></div>
  <div class="kr-seal-cards" id="kr-seal-cards"></div>
</div>

<!-- ARENA -->
<div id="kr-screen-arena" class="kr-screen">
  <div class="kr-arena-grid">
    <aside class="kr-board">
      <div class="kr-board-head" data-i18n="standings"></div>
      <div id="kr-board"></div>
    </aside>
    <main class="kr-arena-main">
      <div class="kr-hud">
        <div class="kr-hud-id">
          <div class="kr-hud-seal" id="kr-hud-seal">Σ</div>
          <div class="kr-hud-id-txt"><span class="kr-hud-id-lbl" data-i18n="agent"></span><span class="kr-hud-id-val" id="kr-hud-name">—</span></div>
        </div>
        <div class="kr-timer" id="kr-timer"><span class="kr-timer-lbl" data-i18n="time"></span><span class="kr-timer-val" id="kr-timer-val">3:00</span></div>
        <div class="kr-hud-stats">
          <div class="kr-stat kr-stat-dr"><span class="kr-stat-lbl" data-i18n="drachmas"></span><span class="kr-stat-row"><span class="kr-pouch" aria-hidden="true"><i id="kr-pouch-fill"></i></span><span class="kr-stat-val" id="kr-score">0</span></span></div>
          <div class="kr-stat"><span class="kr-stat-lbl" data-i18n="mult"></span><span class="kr-stat-val" id="kr-mult">×1</span></div>
        </div>
      </div>
      <div class="kr-cord" id="kr-cord" aria-hidden="true"><div class="kr-cord-burn" id="kr-cord-burn"><i class="kr-cord-ember"></i></div></div>
      <div class="kr-qbody">
        <div class="kr-q-meta"><span class="kr-q-num" id="kr-qnum">ΓΡΙΦΟΣ 001</span><span class="kr-q-line"></span></div>
        <div class="kr-q-card"><i class="kr-nail kr-nail-tl"></i><i class="kr-nail kr-nail-tr"></i><i class="kr-nail kr-nail-bl"></i><i class="kr-nail kr-nail-br"></i><div class="kr-q-text" id="kr-qtext"></div></div>
        <div class="kr-answers" id="kr-answers"></div>
        <div class="kr-feedback" id="kr-feedback"></div>
      </div>
    </main>
  </div>
  <div class="kr-modal" id="kr-modal"><div class="kr-modal-inner" id="kr-modal-inner"></div></div>
</div>

<!-- OVER -->
<div id="kr-screen-over" class="kr-screen">
  <div class="kr-over-crown" id="kr-over-crown">👑</div>
  <div class="kr-over-title" id="kr-over-title"></div>
  <div class="kr-over-sub" id="kr-over-sub"></div>
  <div class="kr-final" id="kr-final"></div>
  <div class="kr-over-btns">
    <button class="sym-btn" onclick="Krypteia._restart()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Krypteia.close()" data-i18n="exit"></button>
  </div>
</div>`;

    document.getElementById('kr-seg-rivals').addEventListener('click', e=>segPick(e,'kr-seg-rivals','rivals'));
    document.getElementById('kr-seg-time').addEventListener('click', e=>segPick(e,'kr-seg-time','time'));
  }

  function segPick(e, id, key) {
    const b = e.target.closest('button'); if(!b) return;
    document.querySelectorAll('#'+id+' button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on');
    cfg[key] = +b.dataset.v;
  }

  const I18N = {
    tag:      { gr:'ΑΓΩΝ ΚΑΤΑΣΚΟΠΩΝ ΤΗΣ ΛΑΚΕΔΑΙΜΟΝΟΣ', en:'A CONTEST OF LACEDAEMONIAN AGENTS' },
    intro:    { gr:'Διαγωνίσου με πράκτορες-αντιπάλους μέσα σε χρονικό όριο. Λύσε γρίφους, σπάσε τις σκυτάλες τους και κλέψε, μείωσε ή διαίρεσε τον θησαυρό τους. Όποιος έχει τις περισσότερες δραχμές στο τέλος, νικά.', en:'Race rival agents against the clock. Solve riddles, break their scytales, and steal, reduce, or divide their drachmas. Whoever holds the most at the final bell wins.' },
    rivals:   { gr:'ΑΝΤΙΠΑΛΟΙ', en:'RIVALS' },
    duration: { gr:'ΔΙΑΡΚΕΙΑ', en:'DURATION' },
    pickseal: { gr:'ΔΙΑΛΕΞΕ ΤΗ ΣΦΡΑΓΙΔΑ ΣΟΥ ΓΙΑ ΝΑ ΑΡΧΙΣΕΙΣ', en:'CHOOSE YOUR SEAL TO BEGIN' },
    standings:{ gr:'ΚΑΤΑΤΑΞΗ', en:'STANDINGS' },
    agent:    { gr:'ΚΑΤΑΣΚΟΠΟΣ', en:'AGENT' },
    time:     { gr:'ΧΡΟΝΟΣ', en:'TIME' },
    drachmas: { gr:'ΔΡΑΧΜΑΙ', en:'DRACHMAS' },
    mult:     { gr:'ΠΟΛ/ΣΤΗΣ', en:'MULT' },
    again:    { gr:'ΝΕΟΣ ΑΓΩΝ', en:'NEW CONTEST' },
    exit:     { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };
  function syncLang() {
    document.querySelectorAll('#kr-wrap [data-i18n]').forEach(el=>{ const k=el.getAttribute('data-i18n'); if(I18N[k]) el.textContent=I18N[k][L()]; });
    if (st && st.cur && document.getElementById('kr-screen-arena').classList.contains('active')) {
      document.getElementById('kr-qnum').textContent = (L()==='en'?'RIDDLE ':'ΓΡΙΦΟΣ ')+String(st.qNum).padStart(3,'0');
      document.getElementById('kr-qtext').textContent = QT(st.cur.q);
    }
    if (document.getElementById('kr-seal-cards')) renderSeals();
  }
  function show(id){ document.querySelectorAll('#kr-wrap .kr-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── setup / seals ───────── */
  function renderSetup(){ /* segments already in DOM; reflect cfg */
    [['kr-seg-rivals','rivals'],['kr-seg-time','time']].forEach(([id,key])=>{
      document.querySelectorAll('#'+id+' button').forEach(b=>b.classList.toggle('on', +b.dataset.v===cfg[key]));
    });
  }
  function renderSeals() {
    const wrap=document.getElementById('kr-seal-cards'); if(!wrap) return; wrap.innerHTML='';
    SEALS.forEach((s,i)=>{
      const c=document.createElement('div'); c.className='kr-seal-card';
      c.innerHTML=`<div class="kr-seal-wax"><span class="kr-seal-glyph">${s.glyph}</span></div>
        <div class="kr-seal-name">${s.name}</div><div class="kr-seal-sub">${s.sub()}</div>
        <button class="kr-seal-pick">[ ${T('ΕΠΙΛΟΓΗ','SELECT')} ]</button>`;
      c.onclick=()=>startGame(i); wrap.appendChild(c);
    });
  }

  function genCode(){ const C='ABCDEFGHJKLMNPQRSTUVWXYZ0123456789'; const seg=()=>Array.from({length:3},()=>C[(Math.random()*C.length)|0]).join(''); return `${seg()}-${seg()}-${seg()}`; }
  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }

  /* ───────── start ───────── */
  function startGame(sealIdx) {
    stopAll();
    const seal = SEALS[sealIdx];
    const wordPool = shuffle([...GREEK_WORDS]);
    const rivals = shuffle([...RIVAL_POOL]).slice(0, cfg.rivals).map((r,i)=>({
      name:r.name, word: wordPool[i % wordPool.length], glyph:RIVAL_GLYPHS[RIVAL_POOL.findIndex(x=>x.name===r.name)]||r.name[0],
      code:genCode(), drachmas: 300 + ((Math.random()*350)|0), isMe:false,
    }));
    const me = { name:T('ΕΣΥ','YOU'), glyph:seal.glyph, code:genCode(), drachmas:0, isMe:true, seal };
    st = {
      seal, me, rivals, players:[me,...rivals],
      score:0, mult:1, qNum:0, answered:false, busy:false, over:false,
      pool: shuffle([..._gpPool()]), idx:0,
      timeLeft: cfg.time, cur:null, pending:null,
    };
    document.getElementById('kr-hud-seal').textContent = seal.glyph;
    document.getElementById('kr-hud-name').textContent = me.name;
    document.getElementById('kr-modal').classList.remove('show');
    show('kr-screen-arena');
    updTimer(); updHUD(); renderBoard();
    nextQ();
    timers.game = setInterval(tickClock, 1000);
    timers.bots = setInterval(tickBots, 950);
  }

  /* ───────── clocks ───────── */
  function tickClock() {
    st.timeLeft--; updTimer();
    if (st.timeLeft <= 0) gameOver();
  }
  function updTimer() {
    const m=Math.floor(st.timeLeft/60), s=st.timeLeft%60;
    document.getElementById('kr-timer-val').textContent = m+':'+String(s).padStart(2,'0');
    document.getElementById('kr-timer').classList.toggle('low', st.timeLeft<=30);
    /* decorative burning-cord: mirrors the same timeLeft value, nothing more */
    const cord=document.getElementById('kr-cord'), burn=document.getElementById('kr-cord-burn');
    if (cord && burn) {
      burn.style.width=(Math.max(0, st.timeLeft/cfg.time)*100).toFixed(2)+'%';
      cord.classList.toggle('low', st.timeLeft<=30);
    }
  }
  function tickBots() {
    if (st.over) return;
    const n = st.rivals.length;
    const hits = Math.min(n, 1 + (cfg.rivals>=7?1:0));
    const picks = shuffle([...st.rivals]).slice(0, hits);
    picks.forEach(r=> r.drachmas += 35 + ((Math.random()*95)|0));
    renderBoard();
  }

  /* ───────── standings / hud ───────── */
  function ranked(){ return [...st.players].sort((a,b)=>b.drachmas-a.drachmas); }
  function myRank(){ return ranked().findIndex(p=>p.isMe)+1; }
  function renderBoard(flash) {
    const board=ranked();
    const top=Math.max(1, board[0].drachmas);
    document.getElementById('kr-board').innerHTML = board.map((p,i)=>{
      const fl = flash && flash.name===p.name ? (' '+flash.kind) : '';
      return `<div class="kr-board-row${p.isMe?' me':''}${i===0?' lead':''}${fl}"><span class="kr-br-pos">${i+1}</span><span class="kr-br-seal">${p.glyph}</span><span class="kr-br-name">${p.name}</span><span class="kr-br-gold">${p.drachmas}</span><i class="kr-br-bar" style="--kr-w:${Math.min(100,p.drachmas/top*100).toFixed(1)}%"></i></div>`;
    }).join('');
    if(window.SymStandings) SymStandings.feed('kr', board, {key:'drachmas', unit:'δρ', accent:'var(--sym-terra)', title:'ΚΡΥΠΤΕΙΑ'});
  }
  function updHUD() {
    document.getElementById('kr-score').textContent = st.me.drachmas;
    document.getElementById('kr-mult').textContent = '×'+st.mult;
    /* decorative: pouch fill (my hoard vs the current leader) + score delta pop */
    const pf=document.getElementById('kr-pouch-fill');
    if (pf && st.players) {
      const top=Math.max(1, ...st.players.map(p=>p.drachmas));
      pf.style.height=(st.me.drachmas<=0?0:Math.max(8, Math.min(100, st.me.drachmas/top*100))).toFixed(1)+'%';
    }
    const prev=(typeof st._shownScore==='number')?st._shownScore:st.me.drachmas;
    const diff=st.me.drachmas-prev; st._shownScore=st.me.drachmas;
    if (diff!==0) {
      const host=document.querySelector('.kr-stat-dr');
      if (host) {
        const d=document.createElement('span');
        d.className='kr-score-pop '+(diff>0?'up':'dn');
        d.textContent=(diff>0?'+':'')+diff;
        host.appendChild(d);
        setTimeout(()=>{ try{ d.remove(); }catch(_){} }, 1150);
        const pouch=host.querySelector('.kr-pouch');
        if (pouch && diff>0){ pouch.classList.remove('bump'); void pouch.offsetWidth; pouch.classList.add('bump'); }
      }
    }
  }

  /* ───────── question loop ───────── */
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }
  function nextQ() {
    if (st.over) return;
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('kr-qnum').textContent=(L()==='en'?'RIDDLE ':'ΓΡΙΦΟΣ ')+String(st.qNum).padStart(3,'0');
    document.getElementById('kr-qtext').textContent=QT(st.cur.q);
    const qc=document.querySelector('#kr-screen-arena .kr-q-card');
    if (qc){ qc.classList.remove('kr-q-in'); void qc.offsetWidth; qc.classList.add('kr-q-in'); }
    const fb=document.getElementById('kr-feedback'); fb.textContent=''; fb.className='kr-feedback';
    const wrap=document.getElementById('kr-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{ const b=document.createElement('button'); b.className='kr-ans'; b.style.setProperty('--kr-d',(i*60)+'ms'); b.innerHTML=`<span class="kr-ans-key">${keys[i]}</span><span>${opt}</span>`; b.onclick=()=>answer(i,b); wrap.appendChild(b); });
  }
  function answer(chosen, btn) {
    if (st.answered || st.over || st.busy) return;
    st.answered=true;
    document.querySelectorAll('#kr-answers .kr-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('kr-feedback');
    if (chosen===st.cur.c) {
      const pts = 90 * st.mult;
      st.me.drachmas += pts; updHUD(); renderBoard({name:st.me.name,kind:'gain'});
      fb.textContent=T(`ΣΩΣΤΟ — +${pts} δραχμαί · σκυτάλη ληφθείσα`, `CORRECT — +${pts} drachmas · scytale intercepted`);
      fb.className='kr-feedback kr-fb-ok';
      _fx('correct',{el:btn, pts});
      setTimeout(drawOperation, 900);
    } else {
      if (window.symLogMistake) { try { window.symLogMistake({ q: st.cur.q, wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Κρυπτεία', gameId: 'krypteia' }); } catch(_){} }
      btn.classList.add('wrong');
      _fx('wrong',{el:btn});
      fb.textContent=T('ΛΑΘΟΣ — οι αντίπαλοι κερδίζουν έδαφος','WRONG — rivals gain ground');
      fb.className='kr-feedback kr-fb-bad';
      setTimeout(()=>{ if(!st.over) nextQ(); }, 1300);
    }
  }

  /* ───────── operation: pick a coded tablet ───────── */
  const EFFECTS = [
    { type:'steal',    w:20 }, { type:'divide', w:13 }, { type:'reduce', w:13 },
    { type:'multiply', w:16 }, { type:'bonus',  w:13 }, { type:'curse',  w:12 }, { type:'nothing', w:8 },
  ];
  function rollEffect(){ const tot=EFFECTS.reduce((s,e)=>s+e.w,0); let r=Math.random()*tot; for(const e of EFFECTS){ if((r-=e.w)<0) return e.type; } return 'nothing'; }

  function drawOperation() {
    if (st.over) return;
    st.busy = true;
    const modal=document.getElementById('kr-modal'); const inner=document.getElementById('kr-modal-inner');
    const targets = shuffle([...st.rivals]).slice(0,3);
    st.tablets = targets.map(t=>({ rival:t, effect:rollEffect() }));
    inner.innerHTML = `
      <div class="kr-op-head">${T('ΥΠΟΚΛΑΠΕΙΣΑ ΣΚΥΤΑΛΗ','INTERCEPTED SCYTALE')}</div>
      <div class="kr-op-sub">${T('Διάλεξε έναν κρυπτογραφημένο κώδικα.','Choose an enciphered code.')}</div>
      <div class="kr-tablets" id="kr-tablets">
        ${st.tablets.map((tb,i)=>`
          <div class="kr-tablet" data-i="${i}" style="--kr-d:${i*90}ms">
            <div class="kr-tablet-inner">
              <div class="kr-tablet-face kr-tablet-front">
                <i class="kr-tb-hole kr-tb-hole-l"></i><i class="kr-tb-hole kr-tb-hole-r"></i>
                <div class="kr-tablet-wax">${tb.rival.glyph}</div>
                <div class="kr-tablet-code">${tb.rival.code}</div>
                <div class="kr-tablet-codelbl">${T('ΚΩΔΙΚΑΣ','CODE')} · ${tb.rival.name}</div>
              </div>
              <div class="kr-tablet-face kr-tablet-back" id="kr-tb-back-${i}"></div>
            </div>
          </div>`).join('')}
      </div>`;
    modal.classList.add('show');
    _fx('op');
    inner.querySelectorAll('.kr-tablet').forEach(el=> el.onclick=()=>pickTablet(+el.dataset.i, el));
  }

  const EFF_META = {
    steal:    { icon:'🗡', cls:'bad',     name:()=>T('ΑΡΠΑΓΗ','STEAL'),    desc:()=>T('Κλέψε δραχμές','Steal drachmas') },
    reduce:   { icon:'🔥', cls:'bad',     name:()=>T('ΜΕΙΩΣΗ','REDUCE'),    desc:()=>T('Κάψε τον θησαυρό του','Burn their hoard') },
    divide:   { icon:'⚖', cls:'bad',     name:()=>T('ΔΙΑΙΡΕΣΗ','DIVIDE'),  desc:()=>T('Ρίξε ζάρι — διαίρεσέ τον','Roll a die — divide them') },
    multiply: { icon:'✦', cls:'good',    name:()=>T('ΠΟΛ/ΣΜΟΣ','MULTIPLY'),desc:()=>T('Ρίξε ζάρι — πολλαπλασίασε','Roll a die — multiply you') },
    bonus:    { icon:'🪙', cls:'good',    name:()=>T('ΔΩΡΟΝ','BONUS'),      desc:()=>T('Δωρεάν δραχμές','Free drachmas') },
    curse:    { icon:'☠', cls:'bad',     name:()=>T('ΚΑΤΑΡΑ','CURSE'),     desc:()=>T('Κακό σημάδι για σένα','An ill omen on you') },
    nothing:  { icon:'∅', cls:'neutral', name:()=>T('ΟΥΔΕΝ','NOTHING'),    desc:()=>T('Κενή σκυτάλη','A blank scytale') },
  };

  function pickTablet(i, el) {
    const inner=document.getElementById('kr-modal-inner');
    inner.querySelectorAll('.kr-tablet').forEach(t=>t.style.pointerEvents='none');
    const tb = st.tablets[i];
    const m = EFF_META[tb.effect];
    const back=document.getElementById('kr-tb-back-'+i);
    back.innerHTML =
      `<div class="kr-tablet-icon">${m.icon}</div><div class="kr-tablet-effect ${m.cls}">${m.name()}</div><div class="kr-tablet-effdesc">${m.desc()}</div>`;
    back.classList.add(m.cls);
    el.classList.add('flipped');
    _fx('flip',{cls:m.cls});
    setTimeout(()=>resolveEffect(tb), 1050);
  }

  /* ───────── resolve effects ───────── */
  const OFFENSIVE = ['steal','reduce','divide'];
  function resolveEffect(tb) {
    const type = tb.effect;
    if (OFFENSIVE.includes(type)) {
      // ~40% chance the cipher breaks clean → you choose any victim
      if (Math.random() < 0.4) chooseVictim(type, tb.rival);
      else startDecrypt(type, tb.rival);
    } else if (type==='multiply') {
      rollDice('multiply', null);
    } else if (type==='bonus') {
      const amt = 200 + ((Math.random()*380)|0);
      st.me.drachmas += amt; updHUD();
      showResult('good','🪙', T('ΔΩΡΟΝ ΘΕΩΝ','GIFT OF THE GODS'), T(`Βρήκες <span class="amt">+${amt}</span> δραχμές σε κρυμμένο θησαυρό.`,`You found <span class="amt">+${amt}</span> drachmas in a hidden cache.`), {name:st.me.name,kind:'gain'});
      coinBurst();
      _fx('bonus');
    } else if (type==='curse') {
      applyCurse();
    } else {
      showResult('neutral','∅', T('ΟΥΔΕΝ','NOTHING'), T('Η σκυτάλη ήταν κενή. Τίποτα δεν συνέβη.','The scytale was blank. Nothing happened.'), null);
    }
  }

  /* victim picker — the random "choose whom to curse" */
  function chooseVictim(type, fallback) {
    const m = EFF_META[type];
    const inner=document.getElementById('kr-modal-inner');
    const list = ranked().filter(p=>!p.isMe);
    inner.innerHTML = `
      <div class="kr-op-head">${T('Η ΣΦΡΑΓΙΣ ΕΣΠΑΣΕ ΚΑΘΑΡΑ','THE SEAL BROKE CLEAN')}</div>
      <div class="kr-op-sub">${m.icon} ${T('Διάλεξε ποιον θα','Choose whom to')} <b style="color:#E08577">${m.name()}</b> — ${T('χτύπα όποιον θες!','strike anyone you like!')}</div>
      <div class="kr-victims">
        ${list.map((p,vi)=>`<div class="kr-victim" data-name="${p.name}" style="--kr-d:${vi*55}ms">
          <span class="kr-victim-seal">${p.glyph}</span>
          <span class="kr-victim-name">${p.name}${p===list[0]?`<span class="kr-victim-tag">${T('ΠΡΩΤΟΣ','LEADER')}</span>`:''}</span>
          <span class="kr-victim-code">${p.code}</span>
          <span class="kr-victim-gold">${p.drachmas}</span>
        </div>`).join('')}
      </div>`;
    inner.querySelectorAll('.kr-victim').forEach(el=>{
      el.onclick=()=>{ const r=st.rivals.find(x=>x.name===el.dataset.name)||fallback; startDecrypt(type, r); };
    });
  }

  /* ───────── decrypt mini-game ───────── */
  function startDecrypt(type, target) {
    st.dxType=type; st.dxTarget=target; st.dxNext=0;
    const word = target.word;
    const scrambled = shuffle(word.split('').map((ch,idx)=>({ch,idx})));
    const inner=document.getElementById('kr-modal-inner');
    const m = EFF_META[type];
    inner.innerHTML = `
      <div class="kr-dx-target"><span class="l">▶ ${T('ΣΤΟΧΟΣ','TARGET')} · ${m.name()}</span><span class="n">${target.name}</span><span class="c">${T('ΚΩΔΙΚΑΣ','CODE')}: ${target.code} · ${T('θησαυρός','hoard')} ${target.drachmas}</span></div>
      <div class="kr-dx-timer"><div class="kr-dx-timer-fill" id="kr-dx-fill"><i class="kr-cord-ember"></i></div></div>
      <div class="kr-dx-prompt">${T('Σπάσε τη σκυτάλη: πάτα τα γράμματα με τη σωστή σειρά.','Break the scytale: tap the letters in the right order.')}</div>
      <div class="kr-scytale"><i class="kr-scy-knob kr-scy-knob-l"></i><i class="kr-scy-rod"></i><i class="kr-scy-knob kr-scy-knob-r"></i>
        <div class="kr-dx-slots" id="kr-dx-slots">${word.split('').map((_,si)=>`<div class="kr-dx-slot" style="--kr-d:${si*50}ms"></div>`).join('')}</div>
      </div>
      <div class="kr-dx-tiles" id="kr-dx-tiles">${scrambled.map((o,i)=>`<button class="kr-dx-tile" data-idx="${o.idx}" data-pos="${i}" style="--kr-d:${120+i*45}ms">${o.ch}</button>`).join('')}</div>`;
    inner.querySelectorAll('.kr-dx-tile').forEach(b=> b.onclick=()=>tapTile(b));
    _fx('decrypt-start',{name:target.name});
    // per-hack timer
    st.dxTime = 9000; const fill=document.getElementById('kr-dx-fill'); const start=Date.now();
    if(timers.dx) clearInterval(timers.dx);
    timers.dx = setInterval(()=>{
      const left = st.dxTime - (Date.now()-start);
      fill.style.width = Math.max(0,(left/st.dxTime)*100)+'%';
      if (left<=0) { clearInterval(timers.dx); timers.dx=null; decryptFail(); }
    }, 80);
  }
  function tapTile(btn) {
    if (st.dxTarget==null || btn.disabled) return;
    const word = st.dxTarget.word;
    // accept ANY tile whose letter matches the next needed letter — so repeated
    // letters (e.g. both Σ in ΑΣΠΙΣ) are interchangeable
    if (word[+btn.dataset.idx] === word[st.dxNext]) {
      btn.classList.add('used'); btn.disabled=true;
      const slots=document.querySelectorAll('#kr-dx-slots .kr-dx-slot');
      slots[st.dxNext].textContent = word[st.dxNext];
      slots[st.dxNext].classList.add('filled');
      st.dxNext++;
      _fx('decrypt-tap',{el:slots[st.dxNext-1], n:st.dxNext, of:word.length});
      if (st.dxNext>=word.length) { if(timers.dx){clearInterval(timers.dx);timers.dx=null;} decryptWin(); }
    } else {
      btn.classList.add('shake'); setTimeout(()=>btn.classList.remove('shake'),300);
    }
  }
  function decryptFail() {
    const t=st.dxTarget; _fx('decrypt-fail');
    showResult('neutral','🛡', T('Η ΣΚΥΤΑΛΗ ΑΝΤΕΞΕ','THE SCYTALE HELD'), T(`Δεν πρόλαβες να σπάσεις τον κώδικα του ${t.name}. Τίποτα δεν συνέβη.`,`You failed to break ${t.name}'s code in time. Nothing happened.`), null);
    st.dxTarget=null;
  }
  function decryptWin() {
    const type=st.dxType, t=st.dxTarget; st.dxTarget=null;
    if (type==='steal') {
      const amt=Math.round(t.drachmas*(0.28+Math.random()*0.12));
      t.drachmas=Math.max(0,t.drachmas-amt); st.me.drachmas+=amt; updHUD();
      showResult('good','🗡', T('ΑΡΠΑΓΗ ΕΠΙΤΥΧΗΣ','THEFT SUCCESSFUL'), T(`Άρπαξες <span class="amt">+${amt}</span> δραχμές από τον ${t.name}.`,`You seized <span class="amt">+${amt}</span> drachmas from ${t.name}.`), {name:st.me.name,kind:'gain'}, {name:t.name,kind:'hit'});
      _fx('decrypt-win',{kind:'steal'}); coinBurst();
    } else if (type==='reduce') {
      _fx('decrypt-win',{kind:'reduce'});
      const amt=Math.max(150, Math.round(t.drachmas*0.14));
      t.drachmas=Math.max(0,t.drachmas-amt);
      showResult('good','🔥', T('ΘΗΣΑΥΡΟΣ ΚΑΗΚΕ','HOARD BURNED'), T(`Έκαψες <span class="amt">−${amt}</span> δραχμές του ${t.name}.`,`You destroyed <span class="amt">−${amt}</span> of ${t.name}'s drachmas.`), {name:t.name,kind:'hit'});
    } else if (type==='divide') {
      rollDice('divide', t);
      return;
    }
  }

  /* ───────── dice (multiply / divide) ───────── */
  function rollDice(kind, target) {
    const inner=document.getElementById('kr-modal-inner');
    const isMul = kind==='multiply';
    inner.innerHTML = `
      <div class="kr-op-head">${isMul?T('ΠΟΛΛΑΠΛΑΣΙΑΣΜΟΣ','MULTIPLY'):T('ΔΙΑΙΡΕΣΗ','DIVIDE')}</div>
      <div class="kr-op-sub">${isMul?T('Ρίξε το ζάρι της Μοίρας — πολλαπλασίασε τις δραχμές σου.',"Roll the die of Fate — multiply your drachmas."):T(`Ρίξε το ζάρι — διαίρεσε τον θησαυρό του ${target.name}.`,`Roll the die — divide ${target.name}'s hoard.`)}</div>
      <div class="kr-die-wrap"><div class="kr-die roll" id="kr-die">${Array.from({length:9},()=>'<div class="kr-pip"></div>').join('')}</div><div class="kr-result-desc" id="kr-die-cap">${T('…κυλά…','…rolling…')}</div></div>`;
    _fx('dice');
    const die=document.getElementById('kr-die');
    let ticks=0;
    if(timers.anim) clearInterval(timers.anim);
    timers.anim = setInterval(()=>{
      setDie(die, 1+((Math.random()*6)|0)); ticks++;
      if (ticks>=12) {
        clearInterval(timers.anim); timers.anim=null;
        const roll=1+((Math.random()*6)|0); setDie(die, roll); die.classList.remove('roll');
        setTimeout(()=>applyDice(kind, target, roll), 600);
      }
    }, 90);
  }
  function setDie(die, n){ const pips=die.querySelectorAll('.kr-pip'); pips.forEach((p,i)=>p.classList.toggle('on', DIE_PIPS[n].includes(i))); }
  function applyDice(kind, target, roll) {
    if (kind==='multiply') {
      const factor = 1 + roll*0.2;       // ×1.2 … ×2.2
      const before=st.me.drachmas; st.me.drachmas=Math.round(st.me.drachmas*factor); const gain=st.me.drachmas-before;
      updHUD();
      showResult('good','✦', T(`ΖΑΡΙ ${roll} · ×${factor.toFixed(1)}`,`DIE ${roll} · ×${factor.toFixed(1)}`), T(`Οι δραχμές σου πολλαπλασιάστηκαν: <span class="amt">+${gain}</span>.`,`Your drachmas multiplied: <span class="amt">+${gain}</span>.`), {name:st.me.name,kind:'gain'});
      _fx('multiply'); coinBurst();
    } else {
      const div = 1 + roll*0.22;          // ÷1.22 … ÷2.32
      const before=target.drachmas; target.drachmas=Math.floor(target.drachmas/div); const lost=before-target.drachmas;
      showResult('good','⚖', T(`ΖΑΡΙ ${roll} · ÷${div.toFixed(1)}`,`DIE ${roll} · ÷${div.toFixed(1)}`), T(`Διαίρεσες τον θησαυρό του ${target.name}: <span class="amt">−${lost}</span>.`,`You divided ${target.name}'s hoard: <span class="amt">−${lost}</span>.`), {name:target.name,kind:'hit'});
      _fx('divide');
    }
  }

  /* ───────── curse (on you) ───────── */
  function applyCurse() {
    _fx('curse');
    const roll = (Math.random()*3)|0;
    if (roll===0) {
      const amt=Math.round(st.me.drachmas*0.2);
      st.me.drachmas=Math.max(0,st.me.drachmas-amt); updHUD();
      showResult('bad','☠', T('ΚΑΤΑΡΑ ΤΩΝ ΕΡΙΝΥΩΝ','CURSE OF THE FURIES'), T(`Έχασες <span class="amt" style="color:#E08577">−${amt}</span> δραχμές.`,`You lost <span class="amt" style="color:#E08577">−${amt}</span> drachmas.`), {name:st.me.name,kind:'hit'});
    } else if (roll===1) {
      st.mult=1; updHUD();
      showResult('bad','✦', T('ΣΠΑΣΜΕΝΟΣ ΠΟΛ/ΣΤΗΣ','MULTIPLIER BROKEN'), T('Ο πολλαπλασιαστής σου επανήλθε σε ×1.','Your multiplier was reset to ×1.'), null);
    } else {
      const thief = st.rivals[(Math.random()*st.rivals.length)|0];
      const amt=Math.round(st.me.drachmas*0.15);
      st.me.drachmas=Math.max(0,st.me.drachmas-amt); thief.drachmas+=amt; updHUD();
      showResult('bad','🗡', T('ΑΝΤΙΚΑΤΑΣΚΟΠΕΙΑ','COUNTER-ESPIONAGE'), T(`Ο ${thief.name} σε υπέκλεψε: <span class="amt" style="color:#E08577">−${amt}</span> δραχμές.`,`${thief.name} counter-hacked you: <span class="amt" style="color:#E08577">−${amt}</span> drachmas.`), {name:st.me.name,kind:'hit'});
    }
    // small chance a correct streak grants +mult to keep it climbing
  }

  /* ───────── result toast → next ───────── */
  function showResult(cls, icon, big, desc, flashA, flashB) {
    renderBoard(flashA);
    if (flashB) setTimeout(()=>{ const r=ranked(); renderBoard(flashB); }, 50);
    updHUD();
    const inner=document.getElementById('kr-modal-inner');
    inner.innerHTML = `<div class="kr-result">
      <div class="kr-result-icon">${icon}</div>
      <div class="kr-result-big ${cls}">${big}</div>
      <div class="kr-result-desc">${desc}</div>
      <button class="sym-btn" style="margin-top:14px" onclick="Krypteia._afterOp()">${T('ΣΥΝΕΧΕΙΑ','CONTINUE')}</button>
    </div>`;
  }
  function _afterOp() {
    document.getElementById('kr-modal').classList.remove('show');
    st.busy=false;
    renderBoard();
    if (!st.over) nextQ();
  }

  /* ───────── game over ───────── */
  function gameOver() {
    if (st.over) return;
    st.over=true; stopAll();
    document.getElementById('kr-modal').classList.remove('show');
    const board=ranked(); const won=board[0].isMe; const rank=myRank();
    document.getElementById('kr-over-crown').textContent = won?'👑':'⌛';
    const title=document.getElementById('kr-over-title');
    title.textContent = won?T('ΝΙΚΗΤΗΣ ΤΟΥ ΑΓΩΝΟΣ','CHAMPION OF THE CONTEST'):T('Ο ΑΓΩΝ ΕΛΗΞΕ','THE CONTEST ENDS');
    title.className = 'kr-over-title '+(won?'win':'lose');
    document.getElementById('kr-over-sub').textContent = won
      ? T('Συγκέντρωσες τις περισσότερες δραχμές. Η Λακεδαίμων σε τιμά.','You amassed the most drachmas. Lacedaemon honours you.')
      : T(`Τερμάτισες στη ${rank}η θέση. Ο ${board[0].name} κυριάρχησε στο δίκτυο.`,`You finished in position ${rank}. ${board[0].name} ruled the network.`);
    document.getElementById('kr-final').innerHTML = board.map((p,i)=>
      `<div class="kr-final-row${p.isMe?' me':''}"><span class="kr-final-pos">${i+1}</span><span class="kr-final-name">${p.name}${i===0?' 🏆':''}</span><span class="kr-final-gold">${p.drachmas}</span></div>`
    ).join('');
    show('kr-screen-over');
    _fx(won?'win':'lose');
    if (won) coinBurst();
  }
  function _restart(){ stopAll(); show('kr-screen-seal'); renderSetup(); renderSeals(); }

  /* ───────── coins ───────── */
  function coinBurst() {
    if (window.SymFX) { SymFX.burst(window.innerWidth/2, window.innerHeight*0.42, {emoji:['🪙','✦','🏛'], count:24, power:12, up:0.5, life:1400}); return; }
    const cx=window.innerWidth/2, cy=window.innerHeight/2;
    for(let i=0;i<16;i++){
      const el=document.createElement('div'); el.className='kr-coin'; el.textContent='🪙';
      el.style.left=cx+'px'; el.style.top=cy+'px'; document.body.appendChild(el);
      const ang=Math.random()*Math.PI*2, sp=4+Math.random()*7;
      let vx=Math.cos(ang)*sp, vy=Math.sin(ang)*sp-6, x=0,y=0,life=1;
      const tick=()=>{ x+=vx; y+=vy; vy+=0.4; life-=0.024; el.style.transform=`translate(${x}px,${y}px) rotate(${x*4}deg)`; el.style.opacity=life; if(life>0) requestAnimationFrame(tick); else el.remove(); };
      requestAnimationFrame(tick);
    }
  }

  /* ───────── moonlit-camp backdrop (canvas, purely decorative) ─────────
     Lives behind every screen inside the overlay: night sky + twinkling
     stars + crescent moon, twin mountain ridges, watch-fires with rising
     embers, drifting ground fog and a whisper of falling cipher glyphs.
     Draws a single static frame under prefers-reduced-motion; the rAF loop
     is cancelled on close(). Gameplay state is never read or written here. */
  let bd = null;
  function _ridge(base, amp, rough, R){
    const pts=[]; let y=base+(R()-0.5)*amp;
    for(let i=0;i<=64;i++){ y+=(R()-0.5)*amp*2/rough; y=Math.max(base-amp, Math.min(base+amp, y)); pts.push(y); }
    return pts;
  }
  function _ridgePath(ctx, pts, w, h){
    ctx.beginPath(); ctx.moveTo(-2, pts[0]*h);
    for(let i=1;i<=64;i++) ctx.lineTo(i/64*w, pts[i]*h);
    ctx.lineTo(w+2, h+2); ctx.lineTo(-2, h+2); ctx.closePath();
  }
  function _bdStart(){
    const cv=document.getElementById('kr-backdrop'); if(!cv) return;
    _bdStop();
    const ctx=cv.getContext('2d'); if(!ctx) return;
    const reduce=!!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    const R=Math.random;
    const S={ ctx, cv, reduce, raf:0, w:0, h:0,
      dpr:Math.min(1.5, window.devicePixelRatio||1),
      stars:Array.from({length:110},()=>({x:R(),y:R()*0.60,r:0.6+R()*1.1,ph:R()*6.28,sp:0.4+R()*1.6,g:R()<0.22})),
      glyphs:Array.from({length:11},()=>({x:R(),sp:9+R()*17,off:R()*900,fs:10+R()*5,n:6+((R()*9)|0),ch:Array.from({length:16},()=>GREEK[(R()*GREEK.length)|0])})),
      fires:[0.13,0.30,0.52,0.71,0.88].map(x=>({x:Math.min(0.96,Math.max(0.03,x+(R()-0.5)*0.05)),ph:R()*6.28,sp:2.2+R()*1.6,sc:0.8+R()*0.55})),
      embers:Array.from({length:24},()=>({f:(R()*5)|0,sp:0.06+R()*0.09,dr:(R()-0.5)*36,r:0.9+R()*1.3,ph:R()})),
      farPts:_ridge(0.50,0.055,7,R), nearPts:_ridge(0.665,0.075,5,R) };
    bd=S;
    const frame=(now)=>{ if(bd!==S) return; _bdDraw(S, now); S.raf=requestAnimationFrame(frame); };
    if (reduce) _bdDraw(S, 0);
    else S.raf=requestAnimationFrame(frame);
  }
  function _bdStop(){ if(bd){ if(bd.raf) cancelAnimationFrame(bd.raf); bd=null; } }
  function _bdDraw(S, now){
    const cv=S.cv, ctx=S.ctx, t=now/1000;
    const W=cv.clientWidth||window.innerWidth, H=cv.clientHeight||window.innerHeight;
    if(!W||!H) return;
    if(S.w!==W||S.h!==H){ S.w=W; S.h=H; cv.width=Math.round(W*S.dpr); cv.height=Math.round(H*S.dpr); }
    ctx.setTransform(S.dpr,0,0,S.dpr,0,0);
    const w=S.w, h=S.h;
    /* sky */
    let g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'#04050C'); g.addColorStop(0.45,'#0A0912'); g.addColorStop(0.64,'#150E13');
    g.addColorStop(0.74,'#221109'); g.addColorStop(1,'#070404');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    /* stars */
    for(const s of S.stars){
      const a=S.reduce?0.5:(0.22+0.5*(0.5+0.5*Math.sin(t*s.sp+s.ph)));
      ctx.globalAlpha=a; ctx.fillStyle=s.g?'#E8D9A8':'#D9E0F0';
      ctx.fillRect(s.x*w, s.y*h, s.r, s.r);
    }
    ctx.globalAlpha=1;
    /* crescent moon + halo — low over the ridge, clear of the HUD plaque */
    const mx=w*0.93, my=h*0.295, mr=Math.max(13, Math.min(22, w*0.018));
    g=ctx.createRadialGradient(mx,my,mr*0.5,mx,my,mr*6);
    g.addColorStop(0,'rgba(213,220,252,0.16)'); g.addColorStop(0.4,'rgba(190,200,250,0.05)'); g.addColorStop(1,'rgba(190,200,250,0)');
    ctx.fillStyle=g; ctx.fillRect(mx-mr*6,my-mr*6,mr*12,mr*12);
    ctx.beginPath(); ctx.arc(mx,my,mr,0,6.2832); ctx.fillStyle='#E9E6D6'; ctx.fill();
    ctx.beginPath(); ctx.arc(mx-mr*0.55,my-mr*0.28,mr*0.82,0,6.2832); ctx.fillStyle='#0B0A13'; ctx.fill();
    /* falling cipher glyphs (very faint) */
    ctx.save(); ctx.fillStyle='#C9A14A'; ctx.textBaseline='top';
    for(const c of S.glyphs){
      ctx.font=c.fs+'px monospace';
      const lh=c.fs*1.15, colH=c.n*lh, span=h*0.60+colH;
      const y0=((S.reduce?c.off:(t*c.sp+c.off))%span)-colH;
      for(let i=0;i<c.n;i++){
        ctx.globalAlpha=(i===c.n-1)?0.13:0.05;
        ctx.fillText(c.ch[i%16], c.x*w, y0+i*lh);
      }
    }
    ctx.restore(); ctx.globalAlpha=1;
    /* mountain ridges */
    _ridgePath(ctx,S.farPts,w,h);  ctx.fillStyle='#0A0711'; ctx.fill();
    _ridgePath(ctx,S.nearPts,w,h); ctx.fillStyle='#130C0B'; ctx.fill();
    /* firelit rim along the near crest */
    ctx.beginPath(); ctx.moveTo(-2,S.nearPts[0]*h);
    for(let i=1;i<=64;i++) ctx.lineTo(i/64*w, S.nearPts[i]*h);
    ctx.strokeStyle='rgba(217,123,92,0.14)'; ctx.lineWidth=1.2; ctx.stroke();
    /* watch-fires on the near ridge */
    for(let i=0;i<S.fires.length;i++){
      const f=S.fires[i];
      const fx=f.x*w, fy=S.nearPts[Math.max(0,Math.min(64,Math.round(f.x*64)))]*h-2;
      const fl=S.reduce?1:(0.72+0.22*(0.5+0.5*Math.sin(t*f.sp+f.ph))+0.08*Math.sin(t*7.3+f.ph*2));
      const rad=(30+42*f.sc)*fl;
      g=ctx.createRadialGradient(fx,fy,0,fx,fy,rad);
      g.addColorStop(0,'rgba(255,176,84,'+(0.42*fl).toFixed(3)+')');
      g.addColorStop(0.35,'rgba(226,116,46,'+(0.19*fl).toFixed(3)+')');
      g.addColorStop(1,'rgba(226,116,46,0)');
      ctx.fillStyle=g; ctx.beginPath(); ctx.arc(fx,fy,rad,0,6.2832); ctx.fill();
      ctx.fillStyle='rgba(255,150,60,'+(0.5*fl).toFixed(3)+')';
      ctx.beginPath(); ctx.arc(fx,fy-3*fl,1.1+2.1*fl*f.sc,0,6.2832); ctx.fill();
      ctx.fillStyle='rgba(255,214,138,'+(0.85*fl).toFixed(3)+')';
      ctx.beginPath(); ctx.arc(fx,fy-1,1.5+1.2*fl*f.sc,0,6.2832); ctx.fill();
    }
    /* rising embers */
    if(!S.reduce){
      for(const e of S.embers){
        const f=S.fires[e.f];
        const fy=S.nearPts[Math.max(0,Math.min(64,Math.round(f.x*64)))]*h-2;
        const pr=(t*e.sp+e.ph)%1;
        const x=f.x*w+Math.sin(t*1.4+e.ph*9)*5+e.dr*pr, y=fy-pr*h*0.26;
        ctx.globalAlpha=Math.max(0,(1-pr))*0.55;
        ctx.fillStyle='#F4A23C'; ctx.fillRect(x,y,e.r,e.r);
      }
      ctx.globalAlpha=1;
    }
    /* ground fog */
    for(let i=0;i<3;i++){
      const fx=w*(0.18+0.32*i)+(S.reduce?0:Math.sin(t*0.07+i*2.1)*w*0.04), fy=h*(0.80+0.045*i);
      g=ctx.createRadialGradient(fx,fy,0,fx,fy,w*0.26);
      g.addColorStop(0,'rgba(26,17,26,0.16)'); g.addColorStop(1,'rgba(26,17,26,0)');
      ctx.fillStyle=g; ctx.fillRect(fx-w*0.26,fy-w*0.26,w*0.52,w*0.52);
    }
    /* warm camp under-glow + vignette */
    g=ctx.createRadialGradient(w*0.5,h*1.06,0,w*0.5,h*1.06,h*0.6);
    g.addColorStop(0,'rgba(217,123,92,0.10)'); g.addColorStop(1,'rgba(217,123,92,0)');
    ctx.fillStyle=g; ctx.fillRect(0,h*0.45,w,h*0.55);
    g=ctx.createRadialGradient(w*0.5,h*0.46,Math.min(w,h)*0.34,w*0.5,h*0.52,Math.max(w,h)*0.78);
    g.addColorStop(0,'rgba(0,0,0,0)'); g.addColorStop(1,'rgba(0,0,0,0.55)');
    ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
  }

  return { open, close, _afterOp, _restart, syncLang };
})();
window.Krypteia = Krypteia;

/* ── Games-Panel entry points (nav.js GP_ENGINES opener + overlay close map) ── */
window.openKrypteia  = function(gp){ Krypteia.open(gp || {}); };
window.closeKrypteia = function(){ Krypteia.close(); };
