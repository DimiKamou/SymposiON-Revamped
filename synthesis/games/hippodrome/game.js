/* ══════════════════ ΑΡΜΑΤΟΔΡΟΜΙΑ — engine ══════════════════
   Board-race reimagined as the chariot race of the Hippodrome.
   Each correct answer drives your chariot forward; streaks build speed;
   the track hides broken-axle hazards and shortcut turns. First past the
   finish post wins the olive crown.
   API:  Hippodrome.open()   Hippodrome.close()
═══════════════════════════════════════════════════════════════════ */
const Hippodrome = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.HP_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const TRACK = 16;          // segments to the finish post
  const RIVALS = [
    { name:'ΠΕΛΟΨ',     icon:'🏇' },
    { name:'ΟΙΝΟΜΑΟΣ',  icon:'🏇' },
    { name:'ΦΑΕΘΩΝ',    icon:'🏇' },
  ];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('hp:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#hp-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('hp-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('hp-screen-intro')) build();
    syncLang();
    show('hp-screen-intro');
  }
  function close() {
    document.getElementById('hp-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('hp-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'hp-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeHippodrome()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u0391\u03a1\u039c\u0391\u03a4\u039f\u0394\u03a1\u039f\u039c\u0399\u0391') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="hp-wrap"></div></div>';
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
    document.getElementById('hp-wrap').innerHTML = `
<!-- INTRO -->
<div id="hp-screen-intro" class="hp-screen">
  ${chariotSVG('hp-rig')}
  <div class="hp-logo">ΑΡΜΑΤΟΔΡΟΜΙΑ</div>
  <div class="hp-logo-en" data-i18n="subtitle"></div>
  <div class="hp-intro-txt" data-i18n="intro"></div>
  <button class="sym-btn" onclick="Hippodrome._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="hp-screen-game" class="hp-screen">
  <div class="hp-track-wrap">
    <div class="hp-track-head">
      <span class="hp-lap" id="hp-lap"></span>
      <span class="hp-streak" id="hp-streak"></span>
    </div>
    <div class="hp-lanes" id="hp-lanes"></div>
  </div>
  <div class="hp-qbody">
    <div class="hp-q-meta"><span class="hp-q-num" id="hp-qnum"></span><span class="hp-q-line"></span></div>
    <div class="hp-q-card"><div class="hp-q-text" id="hp-qtext"></div></div>
    <div class="hp-answers" id="hp-answers"></div>
    <div class="hp-feedback" id="hp-feedback"></div>
  </div>
</div>

<!-- END -->
<div id="hp-screen-end" class="hp-screen">
  <div id="hp-end-art"></div>
  <div class="hp-end-title" id="hp-end-title"></div>
  <div class="hp-end-sub" id="hp-end-sub"></div>
  <div class="hp-final-board" id="hp-final-board"></div>
  <div class="hp-end-btns">
    <button class="sym-btn" onclick="Hippodrome._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Hippodrome.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    subtitle:{ gr:'Η αρματοδρομία του Ιπποδρόμου', en:'The Chariot Race of the Hippodrome' },
    intro:   { gr:'Λάβε θέση στην ἄφεση. Κάθε σωστή απάντηση οδηγεί το άρμα σου μπροστά — και τα <b>σερί</b> χτίζουν ταχύτητα. Πρόσεχε τον <b>σπασμένο άξονα</b> (⚡) και άρπαξε τις <b>στροφές-συντομεύσεις</b> (»). Πρώτος στον τέρμα παίρνει το στεφάνι.', en:'Take your place at the starting gate. Each correct answer drives your chariot forward — and <b>streaks</b> build speed. Beware the <b>broken axle</b> (⚡) and seize the <b>shortcut turns</b> (»). First past the post takes the crown.' },
    begin:   { gr:'ΣΤΗΝ ΑΦΕΣΗ', en:'TO THE GATE' },
    again:   { gr:'ΝΕΑ ΚΟΥΡΣΑ', en:'NEW RACE' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#hp-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('hp-screen-game').classList.contains('active')) {
      document.getElementById('hp-qtext').textContent = st.cur.q[L()];
      renderLanes(); renderHead();
    }
  }
  function show(id){ document.querySelectorAll('#hp-wrap .hp-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _start() {
    // build a track of hazard/boon tiles (skip start & finish zones)
    const tiles = Array(TRACK+1).fill('');
    for (let i=3;i<TRACK-1;i++){
      const r=Math.random();
      if (r<0.12) tiles[i]='hazard';
      else if (r<0.24) tiles[i]='boon';
    }
    st = {
      qNum:0, answered:false, streak:0,
      pool: shuffle([..._gpPool()]), idx:0, tiles,
      me:{ name:T('ΕΣΥ','YOU'), pos:0, me:true, icon:'🏇' },
      rivals: RIVALS.map(r=>({ ...r, pos:0 })),
      finished:false,
    };
    show('hp-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function racers(){ return [st.me, ...st.rivals]; }

  /* ───────── track render ───────── */
  function renderLanes() {
    const lanes = document.getElementById('hp-lanes');
    if(window.SymStandings) SymStandings.feed('hp', racers().map(r=>({name:r.name, pos:r.pos, me:r.me, glyph:r.icon})), {key:'pos', unit:'στάδια', accent:'var(--sym-terra)', title:'ΑΡΜΑΤΟΔΡΟΜΙΑ'});
    lanes.innerHTML = racers().map(rc=>{
      const pct = Math.min(100, (rc.pos/TRACK)*100);
      const tileMarks = st.tiles.map((t,i)=>{
        if (!t) return '';
        const p=(i/TRACK)*100;
        return `<span class="hp-tile hp-tile-${t}" style="left:${p}%">${t==='hazard'?'⚡':'»'}</span>`;
      }).join('');
      return `<div class="hp-lane${rc.me?' me':''}">
        <span class="hp-lane-name">${rc.name}</span>
        <div class="hp-lane-track">
          <div class="hp-lane-marks">${tileMarks}</div>
          <div class="hp-lane-fill" style="width:${pct}%"></div>
          <span class="hp-chariot" style="left:${pct}%">${chariotMini(rc.me)}</span>
          <span class="hp-post">🏛</span>
        </div>
        <span class="hp-lane-pos">${rc.pos}/${TRACK}</span>
      </div>`;
    }).join('');
  }
  function renderHead() {
    document.getElementById('hp-lap').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum;
    const sEl=document.getElementById('hp-streak');
    sEl.textContent = st.streak>=2 ? T(`ΣΕΡΙ ×${st.streak} · ΤΑΧΥΤΗΤΑ!`,`STREAK ×${st.streak} · SPEED!`) : '';
    sEl.classList.toggle('hot', st.streak>=2);
  }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.finished) return;
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('hp-qtext').textContent = st.cur.q[L()];
    const fb=document.getElementById('hp-feedback'); fb.textContent=''; fb.className='hp-feedback';
    const wrap=document.getElementById('hp-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='hp-ans';
      b.innerHTML=`<span class="hp-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderLanes(); renderHead();
  }

  function advanceRivals() {
    st.rivals.forEach(r=>{
      let step = 1 + (Math.random()<0.35?1:0);
      r.pos = Math.min(TRACK, r.pos+step);
    });
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#hp-answers .hp-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('hp-feedback');
    advanceRivals();
    if (chosen===st.cur.c) {
      st.streak++;
      let step = 1 + (st.streak>=2?1:0) + (st.streak>=4?1:0);   // streak builds speed
      let landed = Math.min(TRACK, st.me.pos+step);
      // resolve hazard/boon at landing tile
      let note = T('ΣΩΣΤΟ — εμπρός!','CORRECT — drive on!');
      const tile = st.tiles[landed];
      if (tile==='hazard' && landed<TRACK) { landed=Math.max(0,landed-2); note=T('ΣΩΣΤΟ — μα σπασμένος άξονας! ⚡','CORRECT — but a broken axle! ⚡'); _fx('hazard'); }
      else if (tile==='boon' && landed<TRACK) { landed=Math.min(TRACK,landed+2); note=T('ΣΩΣΤΟ — συντομευση! »','CORRECT — shortcut! »'); _fx('boon'); }
      st.me.pos = landed;
      _fx('correct',{el:btn});
      setTimeout(()=>{ const el=document.querySelector('.hp-lane.me .hp-chariot'); if(el&&window.SymFX){ const r=el.getBoundingClientRect(); SymFX.burst(r.left+r.width/2, r.top+r.height/2, {emoji:['💨','✦'], count:8, power:7, up:0.25, life:700}); } }, 360);
      fb.textContent=note; fb.className='hp-feedback hp-fb-ok';
    } else {
      st.streak=0;
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      fb.textContent=T('ΛΑΘΟΣ — το άρμα κομπιάζει','WRONG — your chariot stalls'); fb.className='hp-feedback hp-fb-bad';
    }
    renderLanes(); renderHead();

    // check for a winner
    const done = racers().filter(r=>r.pos>=TRACK);
    if (done.length) {
      st.finished=true;
      return setTimeout(()=>end(), 1300);
    }
    setTimeout(nextQ, 1300);
  }

  /* ───────── end ───────── */
  function standings(){ return racers().slice().sort((a,b)=>b.pos-a.pos); }

  function end() {
    show('hp-screen-end');
    const board = standings();
    const won = board[0].me;
    _fx(won?'win':'lose');
    document.getElementById('hp-end-art').innerHTML = won ? crownSVG('hp-end-crown') : chariotSVG('hp-end-rig');
    const title=document.getElementById('hp-end-title'), sub=document.getElementById('hp-end-sub');
    if (won) {
      title.textContent=T('ΝΙΚΗΤΗΣ','VICTOR'); title.className='hp-end-title win';
      sub.textContent=T('Πέρασες πρώτος τον τέρμα και έλαβες τον κότινο, το ιερό στεφάνι της ελιάς.','You crossed the post first and received the kotinos, the sacred olive crown.');
    } else {
      title.textContent=T('Η ΚΟΥΡΣΑ ΤΕΛΕΙΩΣΕ','THE RACE IS RUN'); title.className='hp-end-title lose';
      const pos = board.findIndex(x=>x.me)+1;
      sub.textContent=T(`Τερμάτισες στη ${pos}η θέση. Νικητής: ${board[0].name}. Ζέψε ξανά τα άλογα.`,`You finished in position ${pos}. Winner: ${board[0].name}. Yoke the horses again.`);
    }
    document.getElementById('hp-final-board').innerHTML = board.map((x,i)=>
      `<div class="hp-final-row${x.me?' me':''}"><span class="hp-final-pos">${i+1}</span><span class="hp-final-name">${x.name}${i===0?' 🏆':''}</span><span class="hp-final-dist">${x.pos}/${TRACK}</span></div>`
    ).join('');
  }

  /* ───────── art ───────── */
  /* ───────── art ───────── */
  function chariotMini(me){
    const c = me ? '#E59A7E' : '#A87A48', c2 = me ? '#7A2E1B' : '#5A4226';
    return `<svg class="hp-rig-mini" viewBox="0 0 42 30" fill="none">
      <path d="M20 13h12c3 0 5 2 5 6v3H20z" fill="${c}" stroke="${c2}" stroke-width="1.5"/>
      <path d="M7 20c-2-7 2-12 8-13 3-1 5 0 6 2l-2 7c3 0 6 2 6 2l-4 3-3-2-2 4-2-5-5 3z" fill="#3A2A16" stroke="#1E1408" stroke-width="1"/>
      <circle cx="28" cy="24" r="6" fill="#241A10"/>
      <g class="hp-wheel-sp"><circle cx="28" cy="24" r="6" fill="none" stroke="#E0D6C4" stroke-width="2"/><path d="M28 18v12M22 24h12M23.8 19.8l8.4 8.4M32.2 19.8l-8.4 8.4" stroke="#E0D6C4" stroke-width="1.1"/></g>
    </svg>`;
  }
  function chariotSVG(cls){ return `<svg class="${cls}" viewBox="0 0 150 110" fill="none">
    <defs><linearGradient id="hp-c1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E59A7E"/><stop offset="1" stop-color="#C05535"/></linearGradient></defs>
    <path d="M14 86q22-10 44 0" stroke="#5A4226" stroke-width="3" fill="none"/>
    <!-- car -->
    <path d="M70 56h34c8 0 12 6 12 14v8H70z" fill="url(#hp-c1)" stroke="#7A2E1B" stroke-width="2"/>
    <!-- wheel -->
    <circle cx="92" cy="92" r="16" fill="none" stroke="#E0D6C4" stroke-width="3"/>
    <circle cx="92" cy="92" r="3" fill="#E0D6C4"/>
    <g stroke="#E0D6C4" stroke-width="2"><path d="M92 76v32M76 92h32M81 81l22 22M103 81l-22 22"/></g>
    <!-- horse (stylised) -->
    <path d="M30 78c-4-10 2-22 12-26 6-3 12-2 14 2 3-2 8-1 8 3 0 3-3 4-3 4l-4 14c8 0 14 4 14 4l-8 6-6-4-6 8-4-10-8 6z" fill="#3A2A16" stroke="#1E1408" stroke-width="1.5"/>
    <!-- finish flecks -->
    <g fill="#E3C766" opacity="0.7"><circle cx="128" cy="20" r="2"/><circle cx="120" cy="30" r="1.5"/><circle cx="135" cy="34" r="1.5"/></g>
  </svg>`; }
  function crownSVG(cls){ return `<svg class="${cls}" viewBox="0 0 130 120" fill="none">
    <defs><radialGradient id="hp-cr" cx="50%" cy="40%"><stop offset="0" stop-color="#9DBE84"/><stop offset="1" stop-color="#4E6B3A"/></radialGradient></defs>
    <path d="M65 104C30 96 16 70 18 44c12 6 20 4 26-4 5-7 5-16 3-24 14 6 24 18 24 34" fill="url(#hp-cr)" stroke="#2E3F22" stroke-width="2"/>
    <path d="M65 104c35-8 49-34 47-60-12 6-20 4-26-4-5-7-5-16-3-24-14 6-24 18-24 34" fill="url(#hp-cr)" stroke="#2E3F22" stroke-width="2" opacity="0.92"/>
    <g fill="#2E3F22" opacity="0.5"><ellipse cx="40" cy="40" rx="4" ry="8" transform="rotate(40 40 40)"/><ellipse cx="90" cy="40" rx="4" ry="8" transform="rotate(-40 90 40)"/><ellipse cx="34" cy="62" rx="4" ry="8" transform="rotate(50 34 62)"/><ellipse cx="96" cy="62" rx="4" ry="8" transform="rotate(-50 96 62)"/></g>
  </svg>`; }

  return { open, close, _start, syncLang };
})();
window.Hippodrome = Hippodrome;

/* ── Games-Panel entry points ── */
window.openHippodrome  = function(gp){ Hippodrome.open(gp || {}); };
window.closeHippodrome = function(){ Hippodrome.close(); };
