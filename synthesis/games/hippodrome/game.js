/* ══════════════════ ΑΡΜΑΤΟΔΡΟΜΙΑ — engine ══════════════════
   Board-race reimagined as the chariot race of the Hippodrome.
   Each correct answer drives your chariot forward; streaks build speed;
   the track hides broken-axle hazards and shortcut turns. First past the
   finish post wins the olive crown.
   API:  Hippodrome.open()   Hippodrome.close()
   ── Visual layer: black-figure kylix medallion, raked-sand lanes under a
   living crowd wall, big red-figure racing rigs (two-horse flying gallop,
   driver + reins, spinning wheel), a canvas dust/spark/laurel particle
   layer, crowd cheer waves, overtake callouts, gate-drop banner and a
   laurel-and-rays finale. Gameplay, scoring and data are untouched.
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
  /* visual-only: team accents for lane names / trims (bronze, aegean, bone) */
  const LANE_ACC = ['#CDBB77','#A9C0CE','#D8C8A2'];

  let st = {};
  let _raceN = 0;        // visual-only: forces lane rebuild per race
  let _laneSig = '';
  let _vfx = null;                 // visual-only: canvas particle layer state
  let _leadPrev = null;            // visual-only: last sole leader (overtake callouts)
  const _vTimers = new Set();      // visual-only: tracked timers, cleared on close
  const _reduce = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // weak-device heuristic (presentation only): thinner crowd, fewer motes,
  // lower canvas DPR on touch phones / narrow viewports / low memory
  const LITE = (() => {
    try { return matchMedia('(pointer:coarse)').matches || innerWidth < 720 || (navigator.deviceMemory || 8) <= 4; }
    catch (_) { return false; }
  })();

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('hp:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }
  function _vT(fn, ms){ const id = setTimeout(()=>{ _vTimers.delete(id); fn(); }, ms); _vTimers.add(id); return id; }

  /* visual-only position map: rigs start clear of the carceres gate and
     nose the finish tape at TRACK, tiles use the same map so they align. */
  const _vpos = p => 4.5 + (p / TRACK) * 90;

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
    /* visual-only teardown: stop the particle rAF, drop pending flourishes */
    _vTimers.forEach(id=>clearTimeout(id)); _vTimers.clear();
    document.querySelectorAll('#hp-overlay .hp-float').forEach(n=>n.remove());
    if (_vfx) {
      if (_vfx.raf) { cancelAnimationFrame(_vfx.raf); _vfx.raf = 0; }
      _vfx.ps.length = 0; _vfx.ems.length = 0;
      try { _vfx.ctx.clearRect(0, 0, _vfx.w, _vfx.h); } catch(_){}
    }
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('hp-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'hp-overlay';
    ov.className = 'sym-overlay' + (LITE ? ' hp-lite' : '');
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
    _mountCrowd();
    _mountDust();
    _vfxMount();
  }

  /* visual-only: fill the stadium wall with two tiers of bobbing spectators */
  function _mountCrowd() {
    const c = document.querySelector('#hp-screen-game .hp-crowd');
    if (!c || c.querySelector('.hp-spec')) return;
    const hues = ['#6E3A24','#7A5A2E','#46586A','#5C6B3F','#71412F','#665033','#3F5560','#82502C','#5A3A46'];
    let html = '';
    for (let row = 0; row < 2; row++) {
      const n = LITE ? (row ? 18 : 14) : (row ? 30 : 24);
      for (let i = 0; i < n; i++) {
        const l   = (((i + (row ? 0.55 : 0.1)) / n) * 100 + (Math.random()*1.6 - 0.8)).toFixed(2);
        const h   = (row ? 16 + Math.random()*7 : 12 + Math.random()*5).toFixed(1);
        const hue = hues[(Math.random()*hues.length)|0];
        const dur = (1.6 + Math.random()*1.8).toFixed(2);
        const del = (-Math.random()*3.5).toFixed(2);
        const wav = Math.random() < 0.16 ? ' w' : '';
        html += `<i class="hp-spec r${row}${wav}" style="left:${l}%;height:${h}px;background:${hue};color:${hue};--wd:${(l*9)|0}ms;animation-duration:${dur}s;animation-delay:${del}s;"></i>`;
      }
    }
    c.insertAdjacentHTML('afterbegin', html);
  }

  /* visual-only: the stands rise in a wave — heads jump, arms go up */
  function _cheer() {
    if (_reduce()) return;
    const c = document.querySelector('#hp-screen-game .hp-crowd');
    if (!c) return;
    c.classList.remove('cheer'); void c.offsetWidth; c.classList.add('cheer');
    clearTimeout(c._chT);
    c._chT = _vT(()=>c.classList.remove('cheer'), 1600);
  }

  /* ambient dust motes drifting across the arena (visual only) */
  function _mountDust() {
    if (_reduce()) return;
    const wrap = document.getElementById('hp-wrap');
    if (!wrap || wrap.querySelector('.hp-dust-field')) return;
    const f = document.createElement('div');
    f.className = 'hp-dust-field'; f.setAttribute('aria-hidden','true');
    let html = '';
    for (let i = 0; i < (LITE ? 6 : 16); i++) {
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
    _leadPrev = null;
    show('hp-screen-game');
    _vfxSize();
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
      lanes.innerHTML = rs.map((rc, ri)=>{
        const marks = [];
        for (let j=1;j<TRACK;j++) marks.push(`<span class="hp-tick${j%4===0?' q':''}" style="left:${_vpos(j)}%"></span>`);
        st.tiles.forEach((t,j)=>{
          if (t) marks.push(`<span class="hp-tile hp-tile-${t}" style="left:${_vpos(j)}%"><i>${t==='hazard'?'⚡':'»'}</i></span>`);
        });
        const acc = rc.me ? 'var(--sym-terra-lt)' : LANE_ACC[(ri-1) % 3];
        return `<div class="hp-lane${rc.me?' me':''}" style="--rig-c:${acc}">
          <span class="hp-lane-name"></span>
          <div class="hp-lane-track">
            <div class="hp-lane-marks">${marks.join('')}</div>
            <div class="hp-lane-fill"></div>
            <div class="hp-lane-lines" aria-hidden="true"><i></i><i></i><i></i></div>
            <span class="hp-chariot">${chariotMini(rc.me, rc.me ? 0 : (ri-1) % 3)}</span>
            ${postSVG()}
          </div>
          <span class="hp-lane-pos"></span>
        </div>`;
      }).join('');
    }
    lanes.classList.toggle('hot', st.streak >= 2);          // visual: speed-lines intensity
    const maxPos = Math.max.apply(null, rs.map(r=>r.pos));
    Array.prototype.forEach.call(lanes.children, (lane, i)=>{
      const rc = rs[i]; if (!rc) return;
      const pct = _vpos(Math.min(TRACK, rc.pos));
      lane.querySelector('.hp-lane-name').textContent = rc.name;
      lane.querySelector('.hp-lane-fill').style.width = (rc.pos === 0 ? 0 : pct) + '%';
      lane.querySelector('.hp-chariot').style.left = pct + '%';
      lane.querySelector('.hp-lane-pos').textContent = rc.pos + '/' + TRACK;
      lane.classList.toggle('lead', maxPos > 0 && rc.pos === maxPos);
      const wasDone = lane.classList.contains('done');
      lane.classList.toggle('done', rc.pos >= TRACK);       // visual: finish-post laurel glow
      if (!wasDone && rc.pos >= TRACK && !_reduce()) _vT(()=>_finishFx(lane), 880);
      const prev = (lane._pos == null) ? 0 : lane._pos;
      if (prev !== rc.pos && !_reduce()) {
        lane.classList.remove('dash','stumble');
        void lane.offsetWidth;
        lane.classList.add(rc.pos < prev ? 'stumble' : 'dash');
        clearTimeout(lane._dashT);
        lane._dashT = setTimeout(()=>lane.classList.remove('dash','stumble'), 950);
        _vfxTrail(lane.querySelector('.hp-chariot'), Math.min(4, Math.abs(rc.pos - prev)), rc.me && st.streak >= 2);
      }
      lane._pos = rc.pos;
    });
    /* visual-only: overtake callout when a new sole leader emerges mid-race */
    const leads = rs.filter(r=>r.pos===maxPos);
    if (maxPos > 0 && leads.length === 1) {
      const nm = leads[0].name;
      if (_leadPrev && _leadPrev !== nm && maxPos >= 3 && maxPos < TRACK && !_reduce()) {
        const laneEl = lanes.children[rs.indexOf(leads[0])];
        _vT(()=>_overtakeFx(laneEl, leads[0]), 700);
      }
      _leadPrev = nm;
    }
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
      /* visual-only: canvas beat when the rig lands on its tile */
      if (hit) _vT(()=>{
        const el=document.querySelector('.hp-lane.me .hp-chariot');
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (hit==='hazard') { _vfxBurstAt(el, 'sparks'); _floatNote(T('ΣΠΑΣΜΕΝΟΣ ΑΞΟΝΑΣ','BROKEN AXLE'), r.left + r.width/2, r.top - 4, 'bad'); }
        else { _vfxBurstAt(el, 'gleam'); _cheer(); _floatNote(T('ΣΥΝΤΟΜΕΥΣΗ +2','SHORTCUT +2'), r.left + r.width/2, r.top - 4, 'gold'); }
      }, 920);
      /* visual-only: streak multiplier over the rig (in-overlay; SymFX text
         layers render beneath the overlay so they cannot carry this beat) */
      else if (st.streak >= 2) _vT(()=>{
        const el=document.querySelector('.hp-lane.me .hp-chariot');
        if (!el) return;
        const r = el.getBoundingClientRect();
        _floatNote('×' + st.streak, r.left + r.width/2, r.top - 2, 'gold big');
      }, 500);
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

  /* ═══════════ visual-only: canvas particle layer (dust / sparks / laurel) ═══════════ */
  function _vfxMount() {
    if (_reduce() || _vfx) return;
    const wrap = document.querySelector('#hp-screen-game .hp-track-wrap');
    if (!wrap || wrap.querySelector('.hp-vfx')) return;
    const cv = document.createElement('canvas');
    cv.className = 'hp-vfx'; cv.setAttribute('aria-hidden','true');
    wrap.appendChild(cv);
    const mkSprite = (r,g,b) => {
      const c = document.createElement('canvas'); c.width = c.height = 32;
      const x = c.getContext('2d');
      const gr = x.createRadialGradient(16,16,1,16,16,15);
      gr.addColorStop(0,`rgba(${r},${g},${b},0.85)`);
      gr.addColorStop(0.55,`rgba(${r},${g},${b},0.32)`);
      gr.addColorStop(1,`rgba(${r},${g},${b},0)`);
      x.fillStyle = gr; x.beginPath(); x.arc(16,16,15,0,7); x.fill();
      return c;
    };
    _vfx = {
      cv, ctx: cv.getContext('2d'), ps: [], ems: [], raf: 0, t: 0, w: 0, h: 0,
      dpr: Math.min(LITE ? 1.5 : 2, window.devicePixelRatio || 1),
      spr: { dust: mkSprite(214,158,112), pale: mkSprite(238,210,166) },
    };
    _vfx.onRes = () => _vfxSize();
    window.addEventListener('resize', _vfx.onRes);
    _vfxSize();
  }
  function _vfxSize() {
    if (!_vfx) return;
    const r = _vfx.cv.getBoundingClientRect();
    if (!r.width || !r.height) return;
    _vfx.w = r.width; _vfx.h = r.height;
    _vfx.cv.width = Math.round(r.width * _vfx.dpr);
    _vfx.cv.height = Math.round(r.height * _vfx.dpr);
    _vfx.ctx.setTransform(_vfx.dpr, 0, 0, _vfx.dpr, 0, 0);
  }
  function _vfxXY(el, fx, fy) {
    const cr = _vfx.cv.getBoundingClientRect(), r = el.getBoundingClientRect();
    return { x: r.left - cr.left + r.width * fx, y: r.top - cr.top + r.height * fy };
  }
  function _pDust(x, y, hot) {
    if (_vfx.ps.length > (LITE ? 180 : 420)) return;
    const pale = Math.random() < 0.3;
    _vfx.ps.push({ t:'d', spr: pale ? 'pale' : 'dust',
      x: x + (Math.random()*8 - 4), y: y + (Math.random()*4 - 2),
      vx: -(26 + Math.random()*70) * (hot ? 1.35 : 1), vy: -(8 + Math.random()*30), g: -14,
      size: 2.5 + Math.random()*3, grow: 9 + Math.random()*8,
      life: 0.55 + Math.random()*0.5, age: 0, a: hot ? 0.4 : 0.32 });
  }
  function _pSpark(x, y) {
    _vfx.ps.push({ t:'s', x, y, vx: -30 + Math.random()*110, vy: -(60 + Math.random()*150), g: 540,
      size: 1.2 + Math.random()*1.6, life: 0.4 + Math.random()*0.4, age: 0,
      hue: Math.random() < 0.5 ? '#FFD982' : '#F0A268' });
  }
  /* dust trail that follows a gliding rig for the length of the move */
  function _vfxTrail(rigEl, mag, hot) {
    if (!_vfx || _reduce() || !rigEl) return;
    if (!_vfx.w) _vfxSize();
    _vfx.ems.push({ el: rigEl, until: performance.now() + 900, rate: 55 + mag*26 + (hot ? 34 : 0), acc: 0, hot: !!hot });
    _vfxWake();
  }
  function _vfxBurstAt(el, type) {
    if (!_vfx || _reduce() || !el) return;
    if (!_vfx.w) _vfxSize();
    const p = _vfxXY(el, 0.5, 0.55);
    if (type === 'sparks') {
      for (let i=0;i<22;i++) _pSpark(p.x + Math.random()*16 - 8, p.y + 6);
      for (let i=0;i<7;i++)  _pDust(p.x + Math.random()*18 - 9, p.y + 4, true);
    } else if (type === 'gleam') {
      for (let i=0;i<16;i++) _vfx.ps.push({ t:'g', x: p.x + Math.random()*24 - 12, y: p.y + Math.random()*14 - 7,
        vx: -8 + Math.random()*38, vy: -(24 + Math.random()*74), g: -26,
        size: 2 + Math.random()*2.6, life: 0.7 + Math.random()*0.6, age: 0,
        wob: Math.random()*6.28, rot: Math.random()*0.8 });
    } else if (type === 'laurel') {
      const leaves = (n)=>{ for (let i=0;i<n;i++) _vfx.ps.push({ t:'l', x: p.x + Math.random()*8 - 4, y: p.y + Math.random()*8 - 4,
        vx: -(24 + Math.random()*150), vy: -(80 + Math.random()*200), g: 260,
        rot: Math.random()*3.14, vr: (Math.random()<0.5?-1:1)*(2 + Math.random()*4),
        size: 3.6 + Math.random()*3, life: 1.2 + Math.random()*0.8, age: 0,
        wob: Math.random()*6.28, c: ['#8FAE6B','#A9C77F','#6E8B52','#D9C476'][(Math.random()*4)|0] }); };
      leaves(20);
      _vT(()=>{ leaves(14); _vfxWake(); }, 240);
      for (let i=0;i<14;i++) _vfx.ps.push({ t:'g', x: p.x, y: p.y,
        vx: -40 + Math.random()*56, vy: -(40 + Math.random()*120), g: -20,
        size: 2.4 + Math.random()*2.6, life: 0.9 + Math.random()*0.6, age: 0,
        wob: Math.random()*6.28, rot: Math.random()*0.8 });
    }
    _vfxWake();
  }
  function _vfxWake() {
    if (_vfx && !_vfx.raf) { _vfx.t = 0; if (!_vfx.w) _vfxSize(); _vfx.raf = requestAnimationFrame(_vfxLoop); }
  }
  function _vfxLoop(now) {
    const v = _vfx; if (!v) return;
    v.raf = 0;
    const ov = document.getElementById('hp-overlay');
    if (!ov || !ov.classList.contains('active')) { v.ps.length = 0; v.ems.length = 0; v.ctx.clearRect(0,0,v.w,v.h); return; }
    const dt = Math.min(0.04, (now - (v.t || now)) / 1000); v.t = now;
    for (let i = v.ems.length - 1; i >= 0; i--) {
      const e = v.ems[i];
      if (now > e.until || !e.el.isConnected) { v.ems.splice(i,1); continue; }
      e.acc += e.rate * dt;
      if (e.acc >= 1) {
        const p = _vfxXY(e.el, 0.16, 0.8);
        if (p.y > 0 && p.y < v.h + 20) { while (e.acc >= 1) { e.acc--; _pDust(p.x + Math.random()*10, p.y - Math.random()*6, e.hot); } }
        else e.acc = 0;
      }
    }
    const ctx = v.ctx; ctx.clearRect(0, 0, v.w, v.h);
    for (let i = v.ps.length - 1; i >= 0; i--) {
      const p = v.ps[i]; p.age += dt;
      if (p.age >= p.life) { v.ps.splice(i,1); continue; }
      p.vy += (p.g || 0) * dt; p.x += p.vx * dt; p.y += p.vy * dt;
      const k = p.age / p.life;
      if (p.t === 'd') {
        const s = p.size + p.grow * k;
        ctx.globalAlpha = p.a * (1 - k);
        ctx.drawImage(v.spr[p.spr], p.x - s, p.y - s, s*2, s*2);
      } else if (p.t === 's') {
        ctx.globalAlpha = 1 - k;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = p.hue;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size * (1 - k*0.4), 0, 7); ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      } else if (p.t === 'g') {
        const tw = 0.55 + 0.45 * Math.sin(p.age*22 + p.wob);
        ctx.globalAlpha = (1 - k) * tw;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = '#F2D98A';
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot || 0);
        const s = p.size * (1 - k*0.3);
        ctx.fillRect(-s, -0.7, s*2, 1.4); ctx.fillRect(-0.7, -s, 1.4, s*2);
        ctx.restore();
        ctx.globalCompositeOperation = 'source-over';
      } else if (p.t === 'l') {
        p.rot += p.vr * dt; p.vx *= 0.985;
        p.x += Math.sin(p.age*5 + p.wob) * 12 * dt;
        ctx.save();
        ctx.globalAlpha = k > 0.75 ? (1 - k) / 0.25 : 1;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot + Math.sin(p.age*3.2 + p.wob) * 0.6);
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.ellipse(0, 0, p.size, p.size*0.42, 0, 0, 7); ctx.fill();
        ctx.strokeStyle = 'rgba(18,24,10,0.55)'; ctx.lineWidth = 0.7; ctx.stroke();
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
    if (v.ps.length || v.ems.length) v.raf = requestAnimationFrame(_vfxLoop);
    else v.t = 0;
  }

  /* visual-only: floating callout INSIDE the overlay (fx.css layers sit
     below the overlay's z-index, so SymFX text would be hidden) */
  function _floatNote(text, x, y, cls) {
    if (_reduce()) return;
    const ov = document.getElementById('hp-overlay');
    if (!ov) return;
    const el = document.createElement('div');
    el.className = 'hp-float' + (cls ? ' ' + cls : '');
    el.textContent = text;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    ov.appendChild(el);
    _vT(()=>el.remove(), 1350);
  }

  /* visual-only: crowd + floating callout when the lead changes hands */
  function _overtakeFx(laneEl, rc) {
    const rig = laneEl && laneEl.querySelector('.hp-chariot');
    if (!rig) return;
    _cheer();
    const r = rig.getBoundingClientRect();
    _floatNote(T('ΠΡΟΣΠΕΡΑΣΗ!','OVERTAKE!'), r.left + r.width/2, r.top - 6, rc.me ? 'gold' : '');
  }
  /* visual-only: laurel burst off the finish post when a rig crosses */
  function _finishFx(laneEl) {
    _cheer();
    const post = laneEl.querySelector('.hp-post');
    if (post) _vfxBurstAt(post, 'laurel');
  }

  /* ───────── art ─────────
     Pottery language: black-figure medallion on the intro; on the track,
     red-figure racing rigs — clay-lit silhouettes against dark sand with
     two-frame galloping legs (.hp-fA/.hp-fB) and spinning wheels. */

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

  /* mini-scale horse drawn for the lane rigs: arched neck, clear muzzle,
     long flying-gallop legs in two frames (.hp-fA/.hp-fB) */
  function _rigHorse(dx, dy, s, fill, eye) {
    return `<g transform="translate(${dx} ${dy}) scale(${s})"><g fill="${fill}">
      <path d="M4,10 C5,7 8,5.6 12,5.2 L20,5 C24,4 27,2 30.5,0.5 L31,-2.5 L32.6,-0.4 C35,-0.2 37.6,1 39.4,3 C40.6,4.4 41.8,5.6 43,6.2 L42.6,7.8 C40.4,8.6 38.2,8.2 36.6,7.4 C34.8,9.8 32,11.2 29,12 C28,14 26,15.6 23,16.2 C19,17 14,17 11,16.4 C7,15.8 4.6,13.6 4,10 Z"/>
      <path d="M4.6,8.4 C1,6.4 -3.4,7 -6.6,10.2 C-3,10.4 0.2,11.6 2.6,13.4 C3.4,11.6 4,9.8 4.6,8.4 Z"/>
      <g class="hp-fA">
        <path d="M26.4,12.4 L40.6,14.6 L40.2,18 L25.6,15.6 Z"/>
        <path d="M24,13.6 L36,19.4 L34.4,22.2 L22.6,16.2 Z"/>
        <path d="M8.6,12 L-4.6,17.4 L-3.2,20.6 L9.8,15.2 Z"/>
        <path d="M11.6,13.6 L1,22.6 L3.4,24.8 L13.6,15.8 Z"/>
      </g>
      <g class="hp-fB">
        <path d="M26,12.6 L31.6,19.8 L28.6,21.6 L23.6,14.8 Z"/>
        <path d="M23.4,14 L24.6,23 L21.4,23.4 L20.6,14.6 Z"/>
        <path d="M9,12.6 L14.8,20.4 L12,22.2 L6.6,14.8 Z"/>
        <path d="M12,14 L10.4,23 L13.6,23.6 L15.2,14.6 Z"/>
      </g>
      ${eye ? `<circle cx="35.2" cy="2.8" r="0.95" fill="${eye}"/>` : ''}
    </g></g>`;
  }

  /* the racing rig — clay-lit team against the dark sand, per-racer livery */
  function chariotMini(me, idx){
    const P = me ? {
        body:'#C9702F', hi:'#EFA35F', rear:'#6E3414', cab:'#AC4A28', cabHi:'#E08A5C',
        trim:'#E9CE79', wheel:'#E3C766', drv:'#2A1206', line:'#2E1206'
      } : [
        { body:'#8F7A3E', hi:'#BBA65E', rear:'#55481F', cab:'#6A5A28', cabHi:'#98843F', trim:'#CDBB77', wheel:'#CFC08A', drv:'#1E1806', line:'#221C08' },
        { body:'#6E8BA0', hi:'#9DB6C8', rear:'#3D5568', cab:'#45606F', cabHi:'#6E8B9C', trim:'#BFD0DA', wheel:'#C4D4DE', drv:'#0C1922', line:'#10202C' },
        { body:'#B49B72', hi:'#DCC7A0', rear:'#6E5B3A', cab:'#7E6A48', cabHi:'#AC9263', trim:'#E2D4AE', wheel:'#DECFA8', drv:'#241C0C', line:'#2A2210' },
      ][idx % 3];
    return `<svg class="hp-rig-mini${me?' me':''}" viewBox="0 0 92 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="46" cy="46.5" rx="34" ry="3.2" fill="rgba(0,0,0,0.45)"/>
      <g class="hp-mini-dust" fill="#D9A87C">
        <circle class="pd1" cx="7" cy="39" r="4.2"/><circle class="pd2" cx="13" cy="43" r="3.4"/><circle class="pd3" cx="4" cy="45" r="2.6"/>
      </g>
      ${_rigHorse(36.5, 14.7, 1.05, P.rear)}
      ${_rigHorse(41, 17.7, 1.05, P.body, P.line)}
      <path d="M47 23.2 C53 21.8 59 21.3 65 21.9" stroke="${P.hi}" stroke-width="1.4" stroke-linecap="round" opacity="0.85"/>
      <path d="M27 34.5 C36 33.5 46 32.5 56 32.5" stroke="${P.line}" stroke-width="2" stroke-linecap="round"/>
      <path d="M27 20.5 C46 15.5 64 14.5 81 23.5" stroke="${P.trim}" stroke-width="1.1" stroke-linecap="round" opacity="0.9" fill="none"/>
      <g fill="${P.drv}">
        <path d="M12.5 24.5 C12.5 19 16 15.2 20.4 14.5 L27.2 18.6 C24.2 20.4 22.2 23 21.6 26.6 Z"/>
        <circle cx="21.8" cy="12.4" r="3.2"/>
        <path d="M20.4 16.8 L27.6 19.4 L26.8 21.8 L19.4 19.2 Z"/>
      </g>
      <path d="M18.6 10.2 C20.4 8 23.6 7.8 25.4 9.8" stroke="${P.trim}" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M5 21 h14.5 c4.6 0 7.8 3.1 7.8 7.8 V38 H5 Z" fill="${P.cab}"/>
      <path d="M5 21 h14.5 c4.6 0 7.8 3.1 7.8 7.8 V38" fill="none" stroke="${P.cabHi}" stroke-width="1.3"/>
      <path d="M5 24.6 H25" stroke="${P.trim}" stroke-width="1.1" opacity="0.85"/>
      <path d="M8.5 38 V21.4 M13.5 38 V21.2 M18.5 38 V21.3" stroke="rgba(0,0,0,0.28)" stroke-width="1"/>
      <circle cx="16.5" cy="38" r="8.3" fill="#140A04"/>
      <g class="hp-wheel-sp" stroke="${P.wheel}">
        <circle cx="16.5" cy="38" r="8.3" fill="none" stroke-width="2.3"/>
        <path d="M16.5 29.7 v16.6 M8.2 38 h16.6 M10.6 32.1 l11.8 11.8 M22.4 32.1 l-11.8 11.8" stroke-width="1.25"/>
        <circle cx="16.5" cy="38" r="1.9" fill="${P.wheel}" stroke="none"/>
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
