/* ══════════════════ ΜΑΝΤΕΙΟΝ — engine ══════════════════
   Jeopardy-style wager reimagined as the Oracle of Delphi.
   Each round you stake your wisdom before the Pythia's question — answer
   right to multiply it, wrong to lose your stake. Outlast rival seekers.
   API:  Oracle.open()   Oracle.close()

   2026 visual revamp — "bronze & vapour on basalt":
   gameplay/scoring untouched; everything below the rules is presentation.
   Ambient smoke wisps + drifting glyphs, bronze tripod with living flame,
   prophecy revealed letter-by-letter in gold shimmer, overlay-scoped
   particle bursts (SymFX body-level layers sit under .sym-overlay z-1000,
   so the juice here is self-contained inside #or-overlay).
═══════════════════════════════════════════════════════════════════ */
const Oracle = (() => {

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
    const g = window.OR_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const ROUNDS = 8;
  const START  = 500;
  const RIVALS = ['ΣΙΒΥΛΛΑ','ΤΕΙΡΕΣΙΑΣ','ΚΑΛΧΑΣ'];

  let st = {};

  /* ───────── presentation state (visual only) ───────── */
  const REDUCE = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const GLYPHS = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';
  let _glyphTimer = null;      // veiled-card murmuring glyphs
  let _dispW = null;           // last wisdom value shown in the HUD (for count-up)
  let _wAnim = null;           // rAF handle of the running count-up
  let _svgSeq = 0;             // unique gradient ids per inline SVG instance

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('or:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#or-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('or-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('or-screen-intro')) build();
    syncLang();
    show('or-screen-intro');
  }
  function close() {
    stopGlyphs();
    document.getElementById('or-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('or-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'or-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeOracle()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΜΑΝΤΕΙΟΝ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="or-wrap"></div></div>' +
      '<div class="or-veilfx" id="or-veilfx" aria-hidden="true"></div>';
    document.body.appendChild(ov);
    // ambient layer lives OUTSIDE #or-wrap so build() re-renders never wipe it
    ov.insertBefore(buildAmbient(), ov.querySelector('.overlay-stage'));
    // gentle pointer parallax on the vapour field
    if (!REDUCE) {
      ov.addEventListener('pointermove', (e)=>{
        const w = ov.clientWidth || 1, h = ov.clientHeight || 1;
        ov.style.setProperty('--pax', ((e.clientX / w) - 0.5).toFixed(3));
        ov.style.setProperty('--pay', ((e.clientY / h) - 0.5).toFixed(3));
      }, { passive:true });
    }
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
    const logoSpans = 'ΜΑΝΤΕΙΟΝ'.split('').map((c,i)=>`<span class="or-lg" style="--d:${i}">${c}</span>`).join('');
    document.getElementById('or-wrap').innerHTML = `
<!-- INTRO -->
<div id="or-screen-intro" class="or-screen">
  <div class="or-maxim" data-i18n="maxim"></div>
  ${tripodSVG('or-tripod')}
  <div class="or-logo" aria-label="ΜΑΝΤΕΙΟΝ">${logoSpans}</div>
  <div class="or-sub-row">
    ${laurelSVG('or-laurel')}
    <div class="or-logo-en" data-i18n="subtitle"></div>
    ${laurelSVG('or-laurel flip')}
  </div>
  <div class="or-intro-txt" data-i18n="intro"></div>
  <button class="sym-btn or-begin" onclick="Oracle._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="or-screen-game" class="or-screen">
  <div class="or-top">
    <div class="or-wisdom">
      <span class="or-wisdom-lbl" data-i18n="wisdom"></span>
      <span class="or-wisdom-val" id="or-wisdom">0</span>
    </div>
    <div class="or-round" id="or-round"></div>
  </div>
  <div class="or-board" id="or-board"></div>

  <div class="or-qbody">
    <div class="or-q-card veiled">
      <span class="or-q-eps" aria-hidden="true">Ε</span>
      <div class="or-glyph-line" id="or-glyphs" aria-hidden="true"></div>
      <div class="or-q-text" id="or-qtext"></div>
    </div>

    <!-- stake chooser -->
    <div class="or-stake" id="or-stake">
      <div class="or-stake-head" data-i18n="stakehead"></div>
      <div class="or-stake-opts" id="or-stake-opts"></div>
    </div>

    <!-- answers (locked until staked) -->
    <div class="or-answers locked" id="or-answers"></div>
    <div class="or-feedback" id="or-feedback"></div>
    <button class="sym-btn or-cont" id="or-cont" style="display:none" onclick="Oracle._next()"></button>
  </div>
</div>

<!-- END -->
<div id="or-screen-end" class="or-screen">
  <div id="or-end-art"></div>
  <div class="or-end-title" id="or-end-title"></div>
  <div class="or-end-sub" id="or-end-sub"></div>
  <div class="or-final-board" id="or-final-board"></div>
  <div class="or-end-btns">
    <button class="sym-btn" onclick="Oracle._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Oracle.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    maxim:   { gr:'ΓΝΩΘΙ ΣΑΥΤΟΝ', en:'ΓΝΩΘΙ ΣΑΥΤΟΝ · KNOW THYSELF' },
    subtitle:{ gr:'Το μαντείο των Δελφών', en:'The Oracle of Delphi' },
    intro:   { gr:'Στάσου μπροστά στην <b>Πυθία</b>. Σε κάθε χρησμό, πόντισε τη <b>σοφία</b> σου πριν δεις την απάντηση — σωστά την <b>διπλασιάζεις</b>, λάθος τη χάνεις. Όποιος μαζέψει την περισσότερη σοφία κερδίζει την εύνοια του Απόλλωνα.', en:'Stand before the <b>Pythia</b>. Each oracle, stake your <b>wisdom</b> before you see the answer — right and you <b>multiply</b> it, wrong and you lose the stake. Whoever gathers the most wisdom wins Apollo’s favour.' },
    begin:   { gr:'ΖΗΤΗΣΕ ΧΡΗΣΜΟ', en:'SEEK THE ORACLE' },
    wisdom:  { gr:'ΣΟΦΙΑ', en:'WISDOM' },
    stakehead:{ gr:'ΠΟΣΗ ΣΟΦΙΑ ΠΟΝΤΑΡΕΙΣ;', en:'HOW MUCH WISDOM DO YOU STAKE?' },
    again:   { gr:'ΝΕΟΣ ΧΡΗΣΜΟΣ', en:'NEW ORACLE' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#or-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('or-screen-game').classList.contains('active')) {
      if (st.staked) document.getElementById('or-qtext').textContent = QT(st.cur.q);
      else document.getElementById('or-qtext').textContent = T('Η Πυθία ετοιμάζει χρησμό… πόνταρε πρώτα.','The Pythia prepares an oracle… stake first.');
      renderTop(); renderBoard();
      if (!st.staked) renderStakes();
    }
  }
  function show(id){
    document.querySelectorAll('#or-wrap .or-screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if (id === 'or-screen-game') { _dispW = null; }               // HUD counter resets per game
    if (window.gsap && !REDUCE) {                                  // staggered screen entrance
      try {
        const kids = document.querySelectorAll('#'+id+' > *');
        gsap.fromTo(kids, {autoAlpha:0, y:16}, {autoAlpha:1, y:0, duration:.45, stagger:.06, ease:'power3.out', delay:.04, clearProps:'all'});
        setTimeout(()=>{ kids.forEach(n=>{ n.style.opacity=''; n.style.visibility=''; n.style.transform=''; }); }, 1400);
      } catch(_){}
    }
    _fx('screen',{id});
  }

  /* ───────── start ───────── */
  function _start() {
    st = {
      wisdom:START, round:0, answered:false, staked:false, stake:0,
      pool: shuffle([..._gpPool()]), idx:0,
      rivals: RIVALS.map(n=>({ name:n, wisdom:START })),
    };
    show('or-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), wisdom:st.wisdom, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.wisdom-a.wisdom);
    return all;
  }
  function renderTop() {
    setWisdomVal(st.wisdom);
    const pips = Array.from({length:ROUNDS},(_,i)=>`<i class="${i<st.round?'on':''}${i===st.round-1?' new':''}"></i>`).join('');
    document.getElementById('or-round').innerHTML =
      `<span class="or-round-lbl">${T('ΧΡΗΣΜΟΣ ','ORACLE ')}${st.round} / ${ROUNDS}</span><span class="or-pips" aria-hidden="true">${pips}</span>`;
  }
  function renderBoard() {
    if(window.SymStandings) SymStandings.feed('or', standings(), {key:'wisdom', unit:'σοφία', accent:'var(--sym-aegean)', title:'ΜΑΝΤΕΙΟΝ'});
    document.getElementById('or-board').innerHTML = standings().map((x,i)=>
      `<div class="or-board-chip${x.me?' me':''}${i===0?' lead':''}"><span class="or-board-rank">${i+1}</span><span class="or-board-name">${x.name}</span><span class="or-board-w">${x.wisdom}</span></div>`
    ).join('');
  }

  /* ───────── stake ───────── */
  function stakeOpts() {
    const w = st.wisdom;
    return [
      { lbl:T('ΣΥΝΕΤΗ','CAUTIOUS'), mult:'×2', amt:Math.max(25, Math.round(w*0.25/5)*5), tone:'safe' },
      { lbl:T('ΤΟΛΜΗΡΗ','BOLD'),    mult:'×2', amt:Math.max(25, Math.round(w*0.5/5)*5),  tone:'bold' },
      { lbl:T('ΟΛΑ ΓΙΑ ΟΛΑ','ALL-IN'), mult:'×2', amt:w, tone:'allin' },
    ];
  }
  function renderStakes() {
    const wrap=document.getElementById('or-stake-opts'); wrap.innerHTML='';
    stakeOpts().forEach(o=>{
      const b=document.createElement('button'); b.className='or-stake-btn '+o.tone;
      b.innerHTML=`<span class="or-stake-lbl">${o.lbl}</span><span class="or-stake-amt">${o.amt}</span>`;
      b.onclick=()=>setStake(o.amt,b); wrap.appendChild(b);
    });
  }
  function setStake(amt, btn) {
    if (st.staked) return; st.staked=true; st.stake=Math.min(amt, st.wisdom);
    document.querySelectorAll('.or-stake-btn').forEach(b=>{ b.disabled=true; if(b!==btn) b.classList.add('dim'); });
    btn.classList.add('chosen');
    stopGlyphs();
    const qc=document.querySelector('#or-screen-game .or-q-card');
    if(qc){ qc.classList.remove('veiled'); qc.classList.add('unveil'); }
    revealProphecy(document.getElementById('or-qtext'), QT(st.cur.q));
    sparksAt(btn, { count:10, power:5, size:5, life:700, colors:['#E3C766','#C4A448','#8C6A3F'] });
    document.getElementById('or-answers').classList.remove('locked');
    if (window.gsap) gsap.fromTo('#or-answers .or-ans',{opacity:0,y:12},{opacity:1,y:0,duration:.4,stagger:.06,ease:'power2.out'});
    const fb=document.getElementById('or-feedback');
    fb.textContent=T(`Πόνταρες ${st.stake} σοφία. Διάλεξε απάντηση.`,`You staked ${st.stake} wisdom. Choose an answer.`); fb.className='or-feedback or-fb-hint';
    _fx('stake');
  }

  /* ───────── loop ───────── */
  function nextQ() {
    st.answered=false; st.staked=false; st.stake=0; st.cur=getQ(); st.round++;
    // gamble first — keep the question veiled until a stake is placed
    const qc=document.querySelector('#or-screen-game .or-q-card'); if(qc){ qc.classList.add('veiled'); qc.classList.remove('unveil'); }
    document.getElementById('or-qtext').textContent = T('Η Πυθία ετοιμάζει χρησμό… πόνταρε πρώτα.','The Pythia prepares an oracle… stake first.');
    startGlyphs();
    document.getElementById('or-cont').style.display='none';
    const fb=document.getElementById('or-feedback'); fb.textContent=''; fb.className='or-feedback';
    document.getElementById('or-stake').style.display='';
    renderStakes();
    const wrap=document.getElementById('or-answers'); wrap.className='or-answers locked'; wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='or-ans';
      b.innerHTML=`<span class="or-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderTop(); renderBoard();
  }

  function advanceRivals() {
    st.rivals.forEach(r=>{
      const bet = Math.round(r.wisdom*(0.2+Math.random()*0.4)/5)*5;
      if (Math.random()<0.62) r.wisdom += bet; else r.wisdom = Math.max(0, r.wisdom-bet);
    });
  }

  function answer(chosen, btn) {
    if (st.answered || !st.staked) return; st.answered=true;
    document.querySelectorAll('#or-answers .or-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    document.getElementById('or-stake').style.display='none';
    const fb=document.getElementById('or-feedback');
    advanceRivals();
    if (chosen===st.cur.c) {
      st.wisdom += st.stake; _fx('correct',{el:btn});
      fb.textContent=T(`ΑΛΗΘΗΣ ΧΡΗΣΜΟΣ — +${st.stake} σοφία`,`TRUE ORACLE — +${st.stake} wisdom`); fb.className='or-feedback or-fb-ok';
      sparksAt(btn, { count:22, power:10, glyphs:'✦', colors:['#E3C766','#C4A448','#F0EBE0','#7FB0BC'] });
      flashVeil('ok');
      floatDelta('+'+st.stake, true);
      if (window.SymFX) SymFX.pop(document.getElementById('or-wisdom'), 1.25);
    } else {
      btn.classList.add('wrong'); st.wisdom=Math.max(0, st.wisdom-st.stake); _fx('wrong',{el:btn});
      fb.textContent=T(`ΨΕΥΔΗΣ ΧΡΗΣΜΟΣ — −${st.stake} σοφία`,`FALSE ORACLE — −${st.stake} wisdom`); fb.className='or-feedback or-fb-bad';
      sparksAt(btn, { count:14, power:7, gravity:0.8, colors:['#9E3B2E','#C05535','#5A4E3C'] });
      flashVeil('bad');
      floatDelta('−'+st.stake, false);
      if (window.SymFX) { SymFX.shake(7, .4, btn); SymFX.shake(4, .35, document.querySelector('#or-screen-game .or-q-card')); }
    }
    renderTop(); renderBoard();
    const cont=document.getElementById('or-cont');
    cont.textContent = (st.round>=ROUNDS || st.wisdom<=0) ? T('ΑΠΟΤΕΛΕΣΜΑ','RESULT') : T('ΕΠΟΜΕΝΟΣ ΧΡΗΣΜΟΣ','NEXT ORACLE');
    cont.style.display='';
  }

  function _next() {
    if (st.round>=ROUNDS || st.wisdom<=0) return end();
    nextQ();
  }

  /* ───────── end ───────── */
  function end() {
    stopGlyphs();
    show('or-screen-end');
    const board = standings();
    const won = board[0].me && st.wisdom>0;
    _fx(won?'win':'lose');
    document.getElementById('or-end-art').innerHTML = won ? wreathSVG('or-wreath') : tripodSVG('or-end-tripod dim');
    const title=document.getElementById('or-end-title'), sub=document.getElementById('or-end-sub');
    if (st.wisdom<=0) {
      title.textContent=T('Η ΣΟΦΙΑ ΕΧΑΘΗ','WISDOM SPENT'); title.className='or-end-title lose';
      sub.textContent=T('Πόνταρες τα πάντα και η Πυθία σώπασε. Επίστρεψε στους Δελφούς ξανά.','You staked all and the Pythia fell silent. Return to Delphi again.');
    } else if (won) {
      title.textContent=T('ΕΥΝΟΙΑ ΑΠΟΛΛΩΝΟΣ','APOLLO’S FAVOUR'); title.className='or-end-title win';
      sub.textContent=T('Συγκέντρωσες την περισσότερη σοφία και κέρδισες την εύνοια του θεού του φωτός.','You gathered the most wisdom and won the favour of the god of light.');
    } else {
      title.textContent=T('Ο ΧΡΗΣΜΟΣ ΕΚΛΕΙΣΕ','THE ORACLE CLOSES'); title.className='or-end-title lose';
      sub.textContent=T(`Τελείωσες με ${st.wisdom} σοφία, στη ${board.findIndex(x=>x.me)+1}η θέση. Νικητής: ${board[0].name}.`,`You finished with ${st.wisdom} wisdom, in position ${board.findIndex(x=>x.me)+1}. Winner: ${board[0].name}.`);
    }
    document.getElementById('or-final-board').innerHTML = board.map((x,i)=>
      `<div class="or-final-row${x.me?' me':''}${i===0?' first':''}" style="--i:${i}"><span class="or-final-pos">${i+1}</span><span class="or-final-name">${x.name}${i===0?' 🏆':''}</span><span class="or-final-w">${x.wisdom}</span></div>`
    ).join('');
    if (won) {
      setTimeout(()=>{ const t=document.getElementById('or-end-title'); if(t) sparksAt(t,{count:26,power:11,glyphs:'✦',colors:['#E3C766','#C4A448','#F0EBE0']}); }, 380);
      setTimeout(()=>{ const a=document.getElementById('or-end-art'); if(a) sparksAt(a,{count:16,power:8,colors:['#E3C766','#6A8752','#F0EBE0']}); }, 700);
    }
  }

  /* ═════════════ presentation helpers (visual only) ═════════════ */

  /* HUD wisdom count-up: eases the displayed number toward the real one */
  function setWisdomVal(val) {
    const el = document.getElementById('or-wisdom'); if (!el) return;
    const from = (_dispW == null ? val : _dispW);
    _dispW = val;
    if (from === val || REDUCE || !window.requestAnimationFrame) { el.textContent = val; return; }
    if (_wAnim) cancelAnimationFrame(_wAnim);
    el.classList.remove('up','down'); void el.offsetWidth;
    el.classList.add(val > from ? 'up' : 'down');
    const t0 = performance.now(), dur = 650;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(from + (val - from) * e);
      if (t < 1) _wAnim = requestAnimationFrame(step); else { el.textContent = val; _wAnim = null; }
    };
    _wAnim = requestAnimationFrame(step);
  }

  /* floating +N / −N tag rising off the wisdom counter */
  function floatDelta(txt, ok) {
    if (REDUCE) return;
    const ov = document.getElementById('or-overlay'), anchor = document.getElementById('or-wisdom');
    if (!ov || !anchor) return;
    const r = anchor.getBoundingClientRect();
    const d = document.createElement('span');
    d.className = 'or-delta ' + (ok ? 'ok' : 'bad');
    d.textContent = txt;
    d.style.left = (r.left + r.width / 2) + 'px';
    d.style.top  = (r.top - 4) + 'px';
    ov.appendChild(d);
    setTimeout(()=>d.remove(), 1300);
  }

  /* overlay-scoped particle burst (dots + optional glyph chars) */
  function sparks(x, y, o) {
    if (REDUCE) return;
    const ov = document.getElementById('or-overlay'); if (!ov) return;
    o = Object.assign({ count:16, colors:['#E3C766','#C4A448','#F0EBE0'], glyphs:null,
                        power:9, up:0.15, gravity:0.42, size:7, life:950 }, o||{});
    for (let i = 0; i < o.count; i++) {
      const useGlyph = o.glyphs && Math.random() < 0.32;
      const p = document.createElement(useGlyph ? 'span' : 'i');
      p.className = 'or-spark' + (useGlyph ? ' glyph' : '');
      const c = o.colors[(Math.random() * o.colors.length) | 0];
      if (useGlyph) {
        p.textContent = o.glyphs[(Math.random() * o.glyphs.length) | 0];
        p.style.color = c; p.style.fontSize = (11 + Math.random() * 10).toFixed(0) + 'px';
        p.style.textShadow = `0 0 9px ${c}`;
      } else {
        const s = 3 + Math.random() * o.size;
        p.style.width = p.style.height = s.toFixed(1) + 'px';
        p.style.background = c; p.style.boxShadow = `0 0 10px ${c}`;
      }
      p.style.left = x + 'px'; p.style.top = y + 'px';
      ov.appendChild(p);
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.6 - o.up;
      const sp = o.power * (0.5 + Math.random());
      const dx = Math.cos(ang) * sp * 24, dy0 = Math.sin(ang) * sp * 24, dy1 = dy0 + o.gravity * 340;
      const rot = (Math.random() - 0.5) * 540, dur = o.life * (0.7 + Math.random() * 0.6);
      try {
        p.animate([
          { transform:'translate(0,0) rotate(0deg) scale(1)', opacity:1 },
          { transform:`translate(${dx*0.6}px,${dy0}px) rotate(${rot*0.5}deg) scale(1)`, opacity:1, offset:0.45 },
          { transform:`translate(${dx}px,${dy1}px) rotate(${rot}deg) scale(0.4)`, opacity:0 },
        ], { duration:dur, easing:'cubic-bezier(.22,.68,.4,1)', fill:'forwards' });
      } catch(_){}
      setTimeout(()=>p.remove(), dur + 60);
    }
  }
  function sparksAt(el, o){ if(!el) return; const r=el.getBoundingClientRect(); sparks(r.left+r.width/2, r.top+r.height/2, o); }

  /* full-stage tinted veil pulse (gold blessing / crimson omen) */
  function flashVeil(kind) {
    const f = document.getElementById('or-veilfx'); if (!f || REDUCE) return;
    f.className = 'or-veilfx ' + kind; void f.offsetWidth;
    f.classList.add('on');
    setTimeout(()=>{ f.className = 'or-veilfx'; }, 750);
  }

  /* prophecy reveal: letter-by-letter gold shimmer (word-wrapped safely) */
  function revealProphecy(el, text) {
    if (!el) return;
    text = String(text == null ? '' : text);
    if (REDUCE || !text) { el.textContent = text; return; }
    const n = Math.max(1, text.length);
    const d = Math.min(26, Math.max(9, Math.round(1500 / n)));   // cap total sweep ~1.5s
    let ci = 0;
    el.innerHTML = text.split(' ').map(w => {
      const chars = Array.from(w).map(ch =>
        `<span class="or-rv" style="animation-delay:${ci++ * d}ms">${esc(ch)}</span>`).join('');
      ci += 2; // breath between words
      return `<span class="or-rw">${chars}</span>`;
    }).join(' ');
  }

  /* veiled card: the Pythia murmurs — a line of ever-morphing glyphs */
  function startGlyphs() {
    stopGlyphs();
    const el = document.getElementById('or-glyphs'); if (!el) return;
    const s = Array.from({length:14}, ()=>GLYPHS[(Math.random()*GLYPHS.length)|0]);
    const paint = ()=>{ el.textContent = s.join(' '); };
    paint();
    if (REDUCE) return;
    _glyphTimer = setInterval(()=>{
      for (let k = 0; k < 3; k++) s[(Math.random()*s.length)|0] = GLYPHS[(Math.random()*GLYPHS.length)|0];
      paint();
    }, 150);
  }
  function stopGlyphs(){ if (_glyphTimer){ clearInterval(_glyphTimer); _glyphTimer = null; } }

  /* ambient vapour + drifting glyphs behind the whole overlay */
  function buildAmbient() {
    const amb = document.createElement('div');
    amb.className = 'or-ambient';
    amb.setAttribute('aria-hidden','true');
    if (!REDUCE) {
      for (let i = 0; i < 7; i++) {
        const w = document.createElement('i'); w.className = 'or-wisp';
        const sz = 140 + Math.random() * 180;
        w.style.width = sz.toFixed(0) + 'px'; w.style.height = (sz * 1.9).toFixed(0) + 'px';
        w.style.left = (16 + Math.random() * 66).toFixed(1) + '%';
        w.style.setProperty('--sw', ((Math.random() - 0.5) * 170).toFixed(0) + 'px');
        w.style.animationDuration = (16 + Math.random() * 14).toFixed(1) + 's';
        w.style.animationDelay = (-Math.random() * 28).toFixed(1) + 's';
        amb.appendChild(w);
      }
      for (let i = 0; i < 14; i++) {
        const g = document.createElement('span'); g.className = 'or-fglyph';
        g.textContent = GLYPHS[(Math.random() * GLYPHS.length) | 0];
        g.style.left = (Math.random() * 100).toFixed(1) + '%';
        g.style.fontSize = (13 + Math.random() * 20).toFixed(0) + 'px';
        g.style.setProperty('--go', (0.08 + Math.random() * 0.22).toFixed(2));
        g.style.setProperty('--gd', ((Math.random() - 0.5) * 130).toFixed(0) + 'px');
        g.style.animationDuration = (18 + Math.random() * 16).toFixed(1) + 's';
        g.style.animationDelay = (-Math.random() * 32).toFixed(1) + 's';
        amb.appendChild(g);
      }
    }
    return amb;
  }

  /* ───────── art ───────── */
  /* Bronze Delphic tripod-cauldron: living flame, ember glow, smoke curls */
  function tripodSVG(cls){
    const u = 'orx' + (_svgSeq++);
    return `<svg class="${cls}" viewBox="0 0 140 170" fill="none" aria-hidden="true">
    <defs>
      <linearGradient id="${u}-br" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#E8CF8A"/><stop offset=".45" stop-color="#B98A3C"/><stop offset="1" stop-color="#6B4A22"/>
      </linearGradient>
      <linearGradient id="${u}-leg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#C49A52"/><stop offset="1" stop-color="#5C3E1E"/>
      </linearGradient>
      <radialGradient id="${u}-em" cx="50%" cy="50%">
        <stop offset="0" stop-color="#FFE9A8" stop-opacity=".95"/><stop offset=".55" stop-color="#E3A23C" stop-opacity=".55"/><stop offset="1" stop-color="#E3A23C" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="${u}-fl" x1="0" y1="1" x2="0" y2="0">
        <stop offset="0" stop-color="#E3742C"/><stop offset=".5" stop-color="#F2B23C"/><stop offset="1" stop-color="#FFF2C0"/>
      </linearGradient>
    </defs>
    <!-- smoke curls -->
    <g class="or-smoke-g" stroke="#CDE3E8" stroke-width="2.4" stroke-linecap="round" fill="none">
      <path class="or-smoke s1" d="M66 46 C60 36 70 28 64 16"/>
      <path class="or-smoke s2" d="M74 46 C82 34 70 26 78 12"/>
      <path class="or-smoke s3" d="M70 44 C62 30 76 24 68 8"/>
    </g>
    <!-- ember glow -->
    <circle class="or-ember" cx="70" cy="52" r="20" fill="url(#${u}-em)"/>
    <!-- flame -->
    <path class="or-flame" d="M70 52 C63 45 66 38 70 30 C74 38 78 44 70 52 Z" fill="url(#${u}-fl)"/>
    <!-- cauldron -->
    <path d="M36 58h68c0 17-14 28-34 28S36 75 36 58z" fill="url(#${u}-br)" stroke="#3A2812" stroke-width="2"/>
    <ellipse cx="70" cy="58" rx="34" ry="8" fill="#241708" stroke="#3A2812" stroke-width="2"/>
    <ellipse cx="70" cy="55.6" rx="34" ry="8" fill="none" stroke="#F0E3B2" stroke-width="1.1" opacity=".5"/>
    <!-- rim ring-handles -->
    <circle cx="34" cy="55" r="4.6" stroke="url(#${u}-br)" stroke-width="2.4"/>
    <circle cx="106" cy="55" r="4.6" stroke="url(#${u}-br)" stroke-width="2.4"/>
    <!-- legs -->
    <g stroke="url(#${u}-leg)" stroke-width="6" stroke-linecap="round">
      <path d="M46 82 L28 148"/><path d="M94 82 L112 148"/><path d="M70 86 L70 150"/>
    </g>
    <!-- cross brace -->
    <ellipse cx="70" cy="120" rx="31" ry="6" stroke="#8C6A3F" stroke-width="2" opacity=".65"/>
    <!-- feet -->
    <g stroke="#3A2812" stroke-width="2.6" stroke-linecap="round">
      <path d="M22 150h13M63 152h14M105 150h13"/>
    </g>
  </svg>`; }

  /* horizontal laurel sprig flanking the subtitle */
  function laurelSVG(cls){
    let el = '<path d="M4 19 Q36 10 76 6" stroke="#6A8752" stroke-width="1.6" fill="none" opacity=".85"/>';
    for (let i = 0; i < 6; i++) {
      const t = i / 5, x = 8 + t * 62, y = 18 - t * 11, ang = -14 - t * 10;
      el += `<ellipse cx="${x.toFixed(1)}" cy="${(y-4).toFixed(1)}" rx="7" ry="2.6" fill="#6A8752" opacity="${(0.9-t*0.15).toFixed(2)}" transform="rotate(${(ang-26).toFixed(1)} ${x.toFixed(1)} ${(y-4).toFixed(1)})"/>`;
      el += `<ellipse cx="${(x+2).toFixed(1)}" cy="${(y+3).toFixed(1)}" rx="7" ry="2.6" fill="#59713F" opacity="${(0.85-t*0.15).toFixed(2)}" transform="rotate(${(ang+20).toFixed(1)} ${(x+2).toFixed(1)} ${(y+3).toFixed(1)})"/>`;
    }
    return `<svg class="${cls}" viewBox="0 0 80 26" aria-hidden="true">${el}</svg>`;
  }

  /* victory laurel wreath (two arcs of leaves + gold berries) */
  function wreathSVG(cls){
    const cx = 80, cy = 78, R = 56;
    let el = '';
    for (const s of [1, -1]) {
      for (let i = 0; i < 10; i++) {
        const deg = s === 1 ? 112 + i * 15 : 68 - i * 15;
        const rad = deg * Math.PI / 180;
        const x = cx + Math.cos(rad) * R, y = cy + Math.sin(rad) * R;
        const tang = deg + 90;
        const gold = i % 3 === 2;
        el += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="10" ry="3.4" fill="${gold ? '#C4A448' : '#6A8752'}" opacity="${(0.92 - i * 0.03).toFixed(2)}" transform="rotate(${(tang - s * 16).toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
        const x2 = cx + Math.cos(rad) * (R - 10), y2 = cy + Math.sin(rad) * (R - 10);
        el += `<ellipse cx="${x2.toFixed(1)}" cy="${y2.toFixed(1)}" rx="8" ry="2.8" fill="#59713F" opacity="0.8" transform="rotate(${(tang - s * 40).toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)})"/>`;
        if (i % 3 === 1) el += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2" fill="#E3C766" opacity=".9"/>`;
      }
    }
    el += '<circle cx="80" cy="137" r="4" fill="#C4A448"/><path d="M72 141 L66 152 M88 141 L94 152" stroke="#C4A448" stroke-width="2.4" stroke-linecap="round"/>';
    el += '<text x="80" y="86" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#E3C766" opacity=".9">Ε</text>';
    return `<svg class="${cls}" viewBox="0 0 160 160" fill="none" aria-hidden="true">${el}</svg>`;
  }

  return { open, close, _start, _next, syncLang };
})();
window.Oracle = Oracle;

/* ── Games-Panel entry points ── */
window.openOracle  = function(gp){ Oracle.open(gp || {}); };
window.closeOracle = function(){ Oracle.close(); };
