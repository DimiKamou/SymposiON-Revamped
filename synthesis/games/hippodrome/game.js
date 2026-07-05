/* ══════════════════ ΑΡΜΑΤΟΔΡΟΜΙΑ — engine ══════════════════
   Board-race reimagined as the chariot race of the Hippodrome.
   Each correct answer drives your chariot forward; streaks build speed;
   the track hides broken-axle hazards and shortcut turns. First past the
   finish post wins the olive crown.
   API:  Hippodrome.open()   Hippodrome.close()
   ── Visual layer: black-figure kylix medallion, living sand track with
   crowd wall, in-place lane updates so chariots actually glide, dust
   trails, gate-drop banner, and a laurel-and-rays finale. Gameplay,
   scoring and data sources are untouched.
═══════════════════════════════════════════════════════════════════ */
const Hippodrome = (() => {

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
  let _raceN = 0;        // visual-only: forces lane rebuild per race
  let _laneSig = '';
  const _reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
        '<button class="overlay-back" onclick="closeHippodrome()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΑΡΜΑΤΟΔΡΟΜΙΑ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
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
    const logo = 'ΑΡΜΑΤΟΔΡΟΜΙΑ'.split('').map((ch,i)=>`<span style="--i:${i}">${ch}</span>`).join('');
    document.getElementById('hp-wrap').innerHTML = `
<!-- INTRO -->
<div id="hp-screen-intro" class="hp-screen">
  <div class="hp-medal-wrap">${chariotSVG('hp-rig')}</div>
  <div class="hp-logo" aria-label="ΑΡΜΑΤΟΔΡΟΜΙΑ">${logo}</div>
  <div class="hp-meander" aria-hidden="true"></div>
  <div class="hp-logo-en" data-i18n="subtitle"></div>
  <div class="hp-intro-txt" data-i18n="intro"></div>
  <div class="hp-legend">
    <span class="hp-chip hp-chip-hazard"><i>⚡</i><b data-i18n="hazard"></b></span>
    <span class="hp-chip hp-chip-boon"><i>»</i><b data-i18n="boon"></b></span>
    <span class="hp-chip hp-chip-streak"><i>×3</i><b data-i18n="speed"></b></span>
  </div>
  <button class="sym-btn hp-begin" onclick="Hippodrome._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="hp-screen-game" class="hp-screen">
  <div class="hp-track-wrap">
    <div class="hp-crowd" aria-hidden="true"><div class="hp-crowd-glints"></div></div>
    <div class="hp-track-head">
      <span class="hp-race-state" id="hp-qnum"></span>
      <span class="hp-streak" id="hp-streak"></span>
    </div>
    <div class="hp-lanes" id="hp-lanes"></div>
  </div>
  <div class="hp-qbody">
    <div class="hp-q-card">
      <span class="hp-q-num" id="hp-lap"></span>
      <div class="hp-q-text" id="hp-qtext"></div>
    </div>
    <div class="hp-answers" id="hp-answers"></div>
    <div class="hp-feedback" id="hp-feedback"></div>
  </div>
</div>

<!-- END -->
<div id="hp-screen-end" class="hp-screen">
  <div class="hp-end-rays" aria-hidden="true"></div>
  <div id="hp-end-art"></div>
  <div class="hp-end-title" id="hp-end-title"></div>
  <div class="hp-end-sub" id="hp-end-sub"></div>
  <div class="hp-final-board" id="hp-final-board"></div>
  <div class="hp-end-btns">
    <button class="sym-btn" onclick="Hippodrome._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Hippodrome.close()" data-i18n="exit"></button>
  </div>
</div>`;
    _mountDust();
  }

  /* ambient dust motes drifting across the arena (visual only) */
  function _mountDust() {
    if (_reduce()) return;
    const wrap = document.getElementById('hp-wrap');
    if (!wrap || wrap.querySelector('.hp-dust-field')) return;
    const f = document.createElement('div');
    f.className = 'hp-dust-field'; f.setAttribute('aria-hidden','true');
    let html = '';
    for (let i = 0; i < 16; i++) {
      const sz = (1.5 + Math.random()*2.5).toFixed(1);
      html += `<span class="hp-mote" style="left:${(Math.random()*100).toFixed(1)}%;width:${sz}px;height:${sz}px;animation-duration:${(9+Math.random()*13).toFixed(1)}s;animation-delay:${(-Math.random()*20).toFixed(1)}s;"></span>`;
    }
    f.innerHTML = html;
    wrap.appendChild(f);
  }

  const I18N = {
    subtitle:{ gr:'Η αρματοδρομία του Ιπποδρόμου', en:'The Chariot Race of the Hippodrome' },
    intro:   { gr:'Λάβε θέση στην ἄφεση. Κάθε σωστή απάντηση οδηγεί το άρμα σου μπροστά — και τα <b>σερί</b> χτίζουν ταχύτητα. Πρόσεχε τον <b>σπασμένο άξονα</b> (⚡) και άρπαξε τις <b>στροφές-συντομεύσεις</b> (»). Πρώτος στον τέρμα παίρνει το στεφάνι.', en:'Take your place at the starting gate. Each correct answer drives your chariot forward — and <b>streaks</b> build speed. Beware the <b>broken axle</b> (⚡) and seize the <b>shortcut turns</b> (»). First past the post takes the crown.' },
    begin:   { gr:'ΣΤΗΝ ΑΦΕΣΗ', en:'TO THE GATE' },
    again:   { gr:'ΝΕΑ ΚΟΥΡΣΑ', en:'NEW RACE' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
    hazard:  { gr:'σπασμένος άξονας −2', en:'broken axle −2' },
    boon:    { gr:'συντόμευση +2', en:'shortcut +2' },
    speed:   { gr:'το σερί χτίζει ταχύτητα', en:'streaks build speed' },
  };

  function syncLang() {
    document.querySelectorAll('#hp-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('hp-screen-game').classList.contains('active')) {
      document.getElementById('hp-qtext').textContent = QT(st.cur.q);
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
    _raceN++;
    show('hp-screen-game');
    _gateBanner();
    nextQ();
  }

  /* visual-only: "gates drop" banner over the track at race start */
  function _gateBanner() {
    if (_reduce()) return;
    const gs = document.getElementById('hp-screen-game');
    if (!gs) return;
    const old = gs.querySelector('.hp-gate'); if (old) old.remove();
    const g = document.createElement('div');
    g.className = 'hp-gate';
    g.innerHTML = '<span>' + T('ΑΦΕΣΙΣ','GATES DROP') + '</span>';
    gs.appendChild(g);
    setTimeout(()=>{ g.remove(); }, 1500);
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function racers(){ return [st.me, ...st.rivals]; }

  /* ───────── track render ─────────
     Lanes are built once per race, then updated in place so the CSS
     transitions actually glide the chariots down the sand. */
  function renderLanes() {
    const lanes = document.getElementById('hp-lanes');
    if(window.SymStandings) SymStandings.feed('hp', racers().map(r=>({name:r.name, pos:r.pos, me:r.me, glyph:r.icon})), {key:'pos', unit:'στάδια', accent:'var(--sym-terra)', title:'ΑΡΜΑΤΟΔΡΟΜΙΑ'});
    const rs = racers();
    const sig = _raceN + '|' + rs.length + '|' + st.tiles.join(',');
    if (_laneSig !== sig || lanes.childElementCount !== rs.length) {
      _laneSig = sig;
      lanes.innerHTML = rs.map((rc)=>{
        const tileMarks = st.tiles.map((t,j)=>{
          if (!t) return '';
          const p=(j/TRACK)*100;
          return `<span class="hp-tile hp-tile-${t}" style="left:${p}%"><i>${t==='hazard'?'⚡':'»'}</i></span>`;
        }).join('');
        return `<div class="hp-lane${rc.me?' me':''}">
          <span class="hp-lane-name"></span>
          <div class="hp-lane-track">
            <div class="hp-lane-marks">${tileMarks}</div>
            <div class="hp-lane-fill"></div>
            <div class="hp-lane-lines" aria-hidden="true"><i></i><i></i><i></i></div>
            <span class="hp-chariot">${chariotMini(rc.me)}</span>
            ${postSVG()}
          </div>
          <span class="hp-lane-pos"></span>
        </div>`;
      }).join('');
    }
    const maxPos = Math.max.apply(null, rs.map(r=>r.pos));
    Array.prototype.forEach.call(lanes.children, (lane, i)=>{
      const rc = rs[i]; if (!rc) return;
      const pct = Math.min(100, (rc.pos/TRACK)*100);
      lane.querySelector('.hp-lane-name').textContent = rc.name;
      lane.querySelector('.hp-lane-fill').style.width = pct + '%';
      lane.querySelector('.hp-chariot').style.left = pct + '%';
      lane.querySelector('.hp-lane-pos').textContent = rc.pos + '/' + TRACK;
      lane.classList.toggle('lead', maxPos > 0 && rc.pos === maxPos);
      const prev = (lane._pos == null) ? 0 : lane._pos;
      if (prev !== rc.pos && !_reduce()) {
        lane.classList.remove('dash','stumble');
        void lane.offsetWidth;
        lane.classList.add(rc.pos < prev ? 'stumble' : 'dash');
        clearTimeout(lane._dashT);
        lane._dashT = setTimeout(()=>lane.classList.remove('dash','stumble'), 950);
      }
      lane._pos = rc.pos;
    });
  }
  function renderHead() {
    document.getElementById('hp-lap').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum;
    const rsEl=document.getElementById('hp-qnum');
    if (rsEl) {
      const best = Math.max.apply(null, st.rivals.map(r=>r.pos));
      const d = st.me.pos - best;
      rsEl.textContent = d>0 ? T('ΠΡΟΗΓΕΙΣΑΙ +'+d,'LEADING +'+d)
                       : d===0 ? T('ΣΤΗΘΟΣ ΜΕ ΣΤΗΘΟΣ','NECK AND NECK')
                       : T('ΠΙΣΩ ΚΑΤΑ '+(-d),'TRAILING '+(-d));
      rsEl.classList.toggle('ahead', d>0);
      rsEl.classList.toggle('behind', d<0);
    }
    const sEl=document.getElementById('hp-streak');
    sEl.textContent = st.streak>=2 ? T(`ΣΕΡΙ ×${st.streak} · ΤΑΧΥΤΗΤΑ!`,`STREAK ×${st.streak} · SPEED!`) : '';
    sEl.classList.toggle('hot', st.streak>=2);
  }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.finished) return;
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('hp-qtext').textContent = QT(st.cur.q);
    const qc=document.querySelector('#hp-screen-game .hp-q-card');
    if (qc && !_reduce()) { qc.classList.remove('swap'); void qc.offsetWidth; qc.classList.add('swap'); }
    const fb=document.getElementById('hp-feedback'); fb.textContent=''; fb.className='hp-feedback';
    const wrap=document.getElementById('hp-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='hp-ans';
      b.style.setProperty('--n', i);
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
      let hit = '';
      if (tile==='hazard' && landed<TRACK) { landed=Math.max(0,landed-2); note=T('ΣΩΣΤΟ — μα σπασμένος άξονας! ⚡','CORRECT — but a broken axle! ⚡'); _fx('hazard'); hit='hazard'; }
      else if (tile==='boon' && landed<TRACK) { landed=Math.min(TRACK,landed+2); note=T('ΣΩΣΤΟ — συντόμευση! »','CORRECT — shortcut! »'); _fx('boon'); hit='boon'; }
      st.me.pos = landed;
      _fx('correct',{el:btn});
      setTimeout(()=>{
        const el=document.querySelector('.hp-lane.me .hp-chariot');
        if(el&&window.SymFX){
          const r=el.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
          if (hit==='hazard') { SymFX.burst(cx,cy,{emoji:['💥','⚙️','🔩'], count:12, power:8, life:850}); SymFX.shake(7,0.4,document.querySelector('#hp-screen-game .hp-track-wrap')); }
          else if (hit==='boon') { SymFX.burst(cx,cy,{emoji:['✨','✦','»'], count:12, power:8, up:0.3, life:900}); }
          else SymFX.burst(cx,cy,{emoji:['💨','✦'], count:9, power:7, up:0.25, life:750});
          if (st.streak>=2 && !hit) SymFX.combo('×'+st.streak, cx, cy-28, {size:30, color:'#E3C766', rise:70});
        }
      }, 360);
      if (landed>=TRACK && window.SymFX) SymFX.flash('#E3C766', 0.25, 0.7);
      fb.textContent=note; fb.className='hp-feedback hp-fb-ok';
    } else {
      st.streak=0;
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      if (window.SymFX) SymFX.shake(6,0.35,document.querySelector('#hp-screen-game .hp-q-card'));
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
    const endScr = document.getElementById('hp-screen-end');
    endScr.classList.toggle('win', !!won);
    document.getElementById('hp-end-art').innerHTML = won ? crownSVG('hp-end-crown') : chariotSVG('hp-end-rig');
    const title=document.getElementById('hp-end-title'), sub=document.getElementById('hp-end-sub');
    if (won) {
      title.textContent=T('ΝΙΚΗΤΗΣ','VICTOR'); title.className='hp-end-title win';
      sub.textContent=T('Πέρασες πρώτος τον τέρμα και έλαβες τον κότινο, το ιερό στεφάνι της ελιάς.','You crossed the post first and received the kotinos, the sacred olive crown.');
      if (window.SymFX) setTimeout(()=>{
        const a=document.getElementById('hp-end-art');
        if (a) { SymFX.burstAt(a,{emoji:['🏆','🌿','✦'], count:16, power:10, life:1300}); SymFX.flash('#E3C766', 0.2, 0.8); }
      }, 300);
    } else {
      title.textContent=T('Η ΚΟΥΡΣΑ ΤΕΛΕΙΩΣΕ','THE RACE IS RUN'); title.className='hp-end-title lose';
      const pos = board.findIndex(x=>x.me)+1;
      sub.textContent=T(`Τερμάτισες στη ${pos}η θέση. Νικητής: ${board[0].name}. Ζέψε ξανά τα άλογα.`,`You finished in position ${pos}. Winner: ${board[0].name}. Yoke the horses again.`);
    }
    if (window.SymFX) SymFX.pop(title, 1.12);
    document.getElementById('hp-final-board').innerHTML = board.map((x,i)=>
      `<div class="hp-final-row${x.me?' me':''}${i===0?' first':''}" style="--d:${i*110}ms">
        <span class="hp-final-pos">${i+1}</span>
        <span class="hp-final-name">${x.name}${i===0?' <i class="hp-laurel">🏆</i>':''}</span>
        <span class="hp-final-bar"><i style="width:${Math.min(100,(x.pos/TRACK)*100)}%"></i></span>
        <span class="hp-final-dist">${x.pos}/${TRACK}</span>
      </div>`
    ).join('');
  }

  /* ───────── art ─────────
     Black-figure pottery language: dark silhouettes on terracotta clay,
     bronze ring, two-frame galloping legs (.hp-fA/.hp-fB), spinning wheels. */

  function _horse(x, y, s, fill) {
    return `<g transform="translate(${x} ${y}) scale(${s})"><g fill="${fill}">
      <path d="M14,36 C10,26 16,16 30,15 L50,14 C56,7 63,1 72,0.5 C77,0.3 79,4 76,7 L72,10 C77,11 80,15 77,18 C73,22 66,20 61,25 C66,28 69,33 68,39 C67,45 60,49 51,49 L30,49 C20,49 17,44 14,36 Z"/>
      <path d="M15,31 C7,29 2,35 0,43 C6,41 11,39 15,39 Z"/>
      <path d="M70,2 L74,-4 L76,3 Z"/>
      <g class="hp-fA"><path d="M56,45 L76,58 L79,53 L62,42 Z"/><path d="M50,46 L58,64 L62,62 L56,45 Z"/><path d="M27,46 L8,58 L5,53 L21,42 Z"/><path d="M33,46 L26,64 L30,65 L38,46 Z"/></g>
      <g class="hp-fB"><path d="M55,44 L66,53 L62,58 L51,47 Z"/><path d="M49,46 L51,60 L46,61 L44,47 Z"/><path d="M29,45 L18,52 L22,58 L33,48 Z"/><path d="M35,46 L33,61 L38,62 L40,47 Z"/></g>
    </g></g>`;
  }

  function chariotSVG(cls){ return `<svg class="${cls}" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="hpm-clay" cx="50%" cy="40%" r="68%">
        <stop offset="0" stop-color="#B4552F"/><stop offset="0.55" stop-color="#8C3A22"/><stop offset="1" stop-color="#571F12"/>
      </radialGradient>
      <linearGradient id="hpm-bronze" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#E3C766"/><stop offset="0.5" stop-color="#C4A448"/><stop offset="1" stop-color="#8A6D2A"/>
      </linearGradient>
    </defs>
    <circle cx="150" cy="150" r="146" fill="#160D07" stroke="url(#hpm-bronze)" stroke-width="3"/>
    <circle cx="150" cy="150" r="132" fill="url(#hpm-clay)"/>
    <g class="hpm-ring"><circle cx="150" cy="150" r="139" fill="none" stroke="#E3C766" stroke-width="1.4" opacity="0.55" stroke-dasharray="11 7"/></g>
    <circle cx="150" cy="150" r="126" fill="none" stroke="#3A1408" stroke-width="2" opacity="0.55"/>
    <path d="M28,205 H272" stroke="#3A1B10" stroke-width="5" stroke-linecap="round" opacity="0.75"/>
    <g class="hpm-lines" stroke="#F0EBE0" stroke-width="3" stroke-linecap="round" opacity="0.45">
      <path class="s1" d="M38,120 h32"/><path class="s2" d="M32,142 h24"/><path class="s3" d="M42,164 h28"/>
    </g>
    <g class="hpm-dust" fill="#E0B48C" opacity="0.8">
      <circle class="d1" cx="86" cy="196" r="7"/><circle class="d2" cx="70" cy="200" r="5"/><circle class="d3" cx="100" cy="201" r="4"/>
    </g>
    ${_horse(120, 112, 1.4, '#26130A')}
    ${_horse(128, 108, 1.4, '#1E1006')}
    <g fill="#1E1006">
      <path d="M60,148 h32 c7,0 11,5 11,12 v16 h-43 z"/>
      <path d="M100,170 L132,166" stroke="#1E1006" stroke-width="4" stroke-linecap="round"/>
      <path d="M72,148 c-2,-12 4,-22 14,-24 l4,-9 c2,-4 8,-3 8,1 l-1,9 c9,1 14,8 15,17 z"/>
      <path d="M94,132 C118,120 148,116 176,120" stroke="#1E1006" stroke-width="2.6" fill="none"/>
    </g>
    <circle cx="86" cy="187" r="17" fill="#140A04"/>
    <g class="hp-wheel-sp" stroke="#E3C766">
      <circle cx="86" cy="187" r="17" fill="none" stroke-width="3"/>
      <path d="M86 170v34M69 187h34M74 175l24 24M98 175l-24 24" stroke-width="1.5"/>
    </g>
    <g fill="#E3C766" opacity="0.75"><circle cx="222" cy="82" r="2.4"/><circle cx="238" cy="102" r="1.7"/><circle cx="210" cy="64" r="1.5"/></g>
  </svg>`; }

  function chariotMini(me){
    const cab  = me ? '#D97B5C' : '#6B5230';
    const rim  = me ? '#7A2E1B' : '#3A2A16';
    const horse= me ? '#241206' : '#1C1108';
    return `<svg class="hp-rig-mini${me?' me':''}" viewBox="0 0 50 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g class="hp-mini-dust" fill="#D9A87C">
        <circle class="pd1" cx="4" cy="24" r="2.6"/><circle class="pd2" cx="9" cy="26" r="2"/><circle class="pd3" cx="2" cy="27" r="1.6"/>
      </g>
      <path d="M6 14h9c2.6 0 4.2 1.7 4.2 4.4V23H6z" fill="${cab}" stroke="${rim}" stroke-width="1.2"/>
      <path d="M18 19.5h7" stroke="${horse}" stroke-width="1.4" stroke-linecap="round"/>
      ${_horse(21, 5, 0.31, horse)}
      <circle cx="10" cy="23.5" r="5" fill="#160C05"/>
      <g class="hp-wheel-sp" stroke="#E0D6C4">
        <circle cx="10" cy="23.5" r="5" fill="none" stroke-width="1.6"/>
        <path d="M10 18.5v10M5 23.5h10M6.5 20l7 7M13.5 20l-7 7" stroke-width="0.9"/>
      </g>
    </svg>`;
  }

  function postSVG(){ return `<svg class="hp-post" viewBox="0 0 16 34" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
    <path d="M8,3 L11.5,26 H4.5 Z" fill="#C4A448"/>
    <path d="M8,3 L11.5,26 H8 Z" fill="#8A6D2A"/>
    <rect x="2.5" y="26" width="11" height="4" rx="1" fill="#5A4226"/>
    <circle cx="8" cy="3.4" r="2.4" fill="#E3C766"/>
  </svg>`; }

  function crownSVG(cls){ return `<svg class="${cls}" viewBox="0 0 130 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="hp-cr" cx="50%" cy="40%"><stop offset="0" stop-color="#9DBE84"/><stop offset="1" stop-color="#4E6B3A"/></radialGradient></defs>
    <path d="M65 104C30 96 16 70 18 44c12 6 20 4 26-4 5-7 5-16 3-24 14 6 24 18 24 34" fill="url(#hp-cr)" stroke="#2E3F22" stroke-width="2"/>
    <path d="M65 104c35-8 49-34 47-60-12 6-20 4-26-4-5-7-5-16-3-24-14 6-24 18-24 34" fill="url(#hp-cr)" stroke="#2E3F22" stroke-width="2" opacity="0.92"/>
    <g fill="#2E3F22" opacity="0.5"><ellipse cx="40" cy="40" rx="4" ry="8" transform="rotate(40 40 40)"/><ellipse cx="90" cy="40" rx="4" ry="8" transform="rotate(-40 90 40)"/><ellipse cx="34" cy="62" rx="4" ry="8" transform="rotate(50 34 62)"/><ellipse cx="96" cy="62" rx="4" ry="8" transform="rotate(-50 96 62)"/></g>
    <g fill="#E3C766"><circle cx="47" cy="30" r="2.6"/><circle cx="83" cy="30" r="2.6"/><circle cx="38" cy="52" r="2.2"/><circle cx="92" cy="52" r="2.2"/></g>
    <path d="M56 102 L50 116 M74 102 L80 116" stroke="#C05535" stroke-width="4" stroke-linecap="round"/>
  </svg>`; }

  return { open, close, _start, syncLang };
})();
window.Hippodrome = Hippodrome;

/* ── Games-Panel entry points ── */
window.openHippodrome  = function(gp){ Hippodrome.open(gp || {}); };
window.closeHippodrome = function(){ Hippodrome.close(); };
