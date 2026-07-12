/* ══════════════════ ΜΟΙΡΑΙ — engine ══════════════════
   Spin-the-wheel reimagined as the Wheel of the Fates (Clotho, Lachesis,
   Atropos). A correct answer earns a spin: multiply your thread, hit the
   jackpot, or let Atropos cut it. Most thread at the end wins.

   Visual direction: "The Midnight Loom" — candlelit mysticism over deep
   indigo, bronze/gold wheel with vector fate-icons, thread-of-destiny
   ambient filaments + rising embers, cut-thread cinematics. All FX are
   procedural (SVG/CSS/WAAPI) and overlay-scoped: the shared SymFX body
   layers render BENEATH the z-1000 .sym-overlay, so bursts/flashes are
   re-implemented inside the overlay subtree here.

   API:  Moirai.open()   Moirai.close()
═══════════════════════════════════════════════════════════════════ */
const Moirai = (() => {

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
    const g = window.MO_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const RM = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const ROUNDS = 10;
  const BASE   = 100;
  const RIVALS = ['ΚΛΩΘΩ','ΛΑΧΕΣΙΣ','ΑΤΡΟΠΟΣ'];
  // two 8-sector wheels: boon (correct answer) and curse (wrong answer)
  // (labels/colours are purely presentational — outcome logic keys off `k`)
  const WHEELS = {
    boon: [
      { k:'x2',       label:'×2', col:'#C9A44A' },
      { k:'x3',       label:'×3', col:'#6D5FB4' },
      { k:'jack',     label:'★',  col:'#F0DC96' },
      { k:'steal',    label:'⛁',  col:'#4E7D8C' },
      { k:'sabotage', label:'⚔',  col:'#C2653C' },
      { k:'nothing',  label:'∅',  col:'#37325A' },
      { k:'x3',       label:'×3', col:'#6D5FB4' },
      { k:'steal',    label:'⛁',  col:'#4E7D8C' },
    ],
    curse: [
      { k:'nothing', label:'∅', col:'#37325A' },
      { k:'donate',  label:'🎁', col:'#8E3226' },
      { k:'lock',    label:'⏳', col:'#40566B' },
      { k:'cut',     label:'✂', col:'#C13A24' },
      { k:'nothing', label:'∅', col:'#37325A' },
      { k:'donate',  label:'🎁', col:'#8E3226' },
      { k:'lock',    label:'⏳', col:'#40566B' },
      { k:'cut',     label:'✂', col:'#C13A24' },
    ],
  };
  const curSectors = () => WHEELS[st.wheelKind==='curse'?'curse':'boon'];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('mo:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── overlay-scoped FX (visible above the z-1000 shell) ───────── */
  function moBurst(x, y, o) {
    if (RM) return;
    const ov = document.getElementById('mo-overlay'); if (!ov) return;
    o = Object.assign({
      count:18, glyphs:null, colors:['#E8CF7E','#C9A44A','#F5E3A8'],
      power:9, gravity:0.45, spread:Math.PI*2, up:0, size:17, life:1100,
    }, o||{});
    for (let i=0;i<o.count;i++){
      const g = o.glyphs && o.glyphs.length;
      const p = document.createElement('div');
      p.className = 'mo-p' + (g ? ' glyph' : '');
      if (g){
        p.textContent = o.glyphs[(Math.random()*o.glyphs.length)|0];
        p.style.fontSize = (o.size*(0.7+Math.random()*0.8)).toFixed(0)+'px';
        p.style.color = o.colors[(Math.random()*o.colors.length)|0];
      } else {
        const c = o.colors[(Math.random()*o.colors.length)|0];
        const s = 3+Math.random()*6;
        p.style.width = p.style.height = s.toFixed(1)+'px';
        p.style.background = c;
        p.style.boxShadow = '0 0 10px '+c;
      }
      p.style.left = x+'px'; p.style.top = y+'px';
      ov.appendChild(p);
      const ang = -Math.PI/2 + (Math.random()-0.5)*o.spread - o.up;
      const sp  = o.power*(0.5+Math.random());
      const dx  = Math.cos(ang)*sp*26;
      const dyU = Math.sin(ang)*sp*26;
      const dyD = dyU + o.gravity*360;
      const rot = (Math.random()-0.5)*540;
      const dur = o.life*(0.7+Math.random()*0.6);
      p.animate([
        { transform:'translate(-50%,-50%) rotate(0deg) scale(1)', opacity:1 },
        { transform:`translate(calc(-50% + ${(dx*0.6).toFixed(0)}px), calc(-50% + ${dyU.toFixed(0)}px)) rotate(${(rot*0.5).toFixed(0)}deg) scale(1)`, opacity:1, offset:0.45 },
        { transform:`translate(calc(-50% + ${dx.toFixed(0)}px), calc(-50% + ${dyD.toFixed(0)}px)) rotate(${rot.toFixed(0)}deg) scale(.4)`, opacity:0 },
      ], { duration:dur, easing:'cubic-bezier(.25,.7,.4,1)', fill:'forwards' });
      setTimeout(()=>p.remove(), dur+60);
    }
  }
  function moFlash(color, peak, dur) {
    if (RM) return;
    const el = document.getElementById('mo-flash'); if (!el) return;
    el.style.background = color;
    el.animate([{opacity:0},{opacity:(peak==null?0.4:peak),offset:0.14},{opacity:0}],
      { duration:(dur==null?0.5:dur)*1000, easing:'ease-out' });
  }
  function moShake(intensity, dur) {
    // shake the ACTIVE SCREEN, not the stage: a leftover inline transform on
    // an ancestor of the position:fixed ambient/flash layers would turn it
    // into their containing block and shift them below the topbar.
    const el = document.querySelector('#mo-wrap .mo-screen.active');
    if (!el || !window.SymFX) return;
    SymFX.shake(intensity, dur, el);
    // gsap leaves an inline identity matrix behind — clear it once settled
    setTimeout(()=>{ try{ if (window.gsap) gsap.set(el, {clearProps:'transform'}); else el.style.transform=''; }catch(_){} }, dur*1000+260);
  }
  // eased count-up on a numeric element (instant under reduced-motion)
  function tickNum(el, to, dur) {
    if (!el) return;
    to = to|0; dur = dur||650;
    const from = parseInt(el.dataset.v!=null?el.dataset.v:el.textContent, 10) || 0;
    el.dataset.v = to;
    if (RM || Math.abs(to-from) < 2) { el.textContent = to; return; }
    if (el._moRaf) cancelAnimationFrame(el._moRaf);
    const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1,(now-t0)/dur), e = 1-Math.pow(1-p,3);
      el.textContent = Math.round(from+(to-from)*e);
      if (p<1) el._moRaf = requestAnimationFrame(step); else el._moRaf = null;
    };
    el._moRaf = requestAnimationFrame(step);
    // failsafe: if rAF is throttled, settle the value
    setTimeout(()=>{ if (el.dataset.v == to && el.textContent != to) el.textContent = to; }, dur+300);
  }

  /* golden life-thread streams from the wheel hub up onto the spool when
     winnings grow — pure FX, torn down by its own timers (visual only) */
  function _threadStream() {
    if (RM) return;
    const scr=document.getElementById('mo-screen-spin');
    if (!scr || !scr.classList.contains('active')) return;
    const wrap=document.getElementById('mo-wheel-wrap');
    const sp=document.querySelector('#mo-spool .mo-spool-svg');
    if (!wrap || !sp) return;
    const sr=scr.getBoundingClientRect(), a=wrap.getBoundingClientRect(), b=sp.getBoundingClientRect();
    if (sr.width<10 || sr.height<10) return;
    const x1=a.left+a.width/2-sr.left,  y1=a.top+a.height/2-sr.top;
    const x2=b.left+b.width/2-sr.left,  y2=b.top+b.height*0.6-sr.top;
    const ns='http://www.w3.org/2000/svg';
    const svg=document.createElementNS(ns,'svg');
    svg.setAttribute('class','mo-stream'); svg.setAttribute('aria-hidden','true');
    svg.setAttribute('viewBox',`0 0 ${Math.max(1,Math.round(sr.width))} ${Math.max(1,Math.round(sr.height))}`);
    svg.setAttribute('preserveAspectRatio','none');
    const d=`M${x1.toFixed(0)} ${y1.toFixed(0)} C ${(x1+a.width*0.30).toFixed(0)} ${(y1-a.height*0.36).toFixed(0)}, ${(x2+120).toFixed(0)} ${(y2+96).toFixed(0)}, ${x2.toFixed(0)} ${y2.toFixed(0)}`;
    const mk=(cls)=>{ const p=document.createElementNS(ns,'path'); p.setAttribute('d',d); p.setAttribute('pathLength','1'); p.setAttribute('class',cls); svg.appendChild(p); return p; };
    const g=mk('glow'), c=mk('core');
    scr.appendChild(svg);
    const run=(p,delay)=>{ try{ p.animate([
      { strokeDashoffset: 0.24,  opacity: 0 },
      { strokeDashoffset: 0.02,  opacity: 1, offset: 0.16 },
      { strokeDashoffset: -0.88, opacity: 0.95, offset: 0.85 },
      { strokeDashoffset: -1.08, opacity: 0 },
    ], { duration: 1050, delay, easing:'cubic-bezier(.32,.5,.28,1)', fill:'both' }); }catch(_){} };
    run(g,0); run(c,90);
    setTimeout(()=>{ if (!svg.isConnected) return;
      const r2=sp.getBoundingClientRect();
      moBurst(r2.left+r2.width/2, r2.top+r2.height*0.5, {count:7, power:3.6, colors:['#F5E3A8','#E8CF7E'], life:640, spread:Math.PI*1.4, gravity:0.3});
    }, 780);
    setTimeout(()=>svg.remove(), 1500);
  }

  /* ───────── procedural WebAudio flourishes (presentation only) ─────────
     Lazily created on a user gesture; every call is guarded so a missing/
     blocked AudioContext silently no-ops. Nothing here affects game logic. */
  let AC=null, NB=null;
  function _ac(){
    try{
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return null;
      if (!AC) AC = new C();
      if (AC.state==='suspended') AC.resume().catch(()=>{});
      return AC;
    }catch(_){ return null; }
  }
  function _live(){ const o=document.getElementById('mo-overlay'); return !!(o && o.classList.contains('active')); }
  function _noise(ac){
    if (NB) return NB;
    const n=(ac.sampleRate*0.5)|0, b=ac.createBuffer(1,n,ac.sampleRate), d=b.getChannelData(0);
    for (let i=0;i<n;i++) d[i]=Math.random()*2-1;
    NB=b; return b;
  }
  function _env(ac,t,g0,dur){
    const g=ac.createGain();
    g.gain.setValueAtTime(Math.max(0.0009,g0), t);
    g.gain.exponentialRampToValueAtTime(0.0008, t+dur);
    g.connect(ac.destination); return g;
  }
  // wooden pin-tick against the wheel; pitch follows angular velocity
  function sTick(vel){
    const ac=_ac(); if(!ac||!_live()) return;
    try{
      const t=ac.currentTime;
      const s=ac.createBufferSource(); s.buffer=_noise(ac);
      const f=ac.createBiquadFilter(); f.type='bandpass';
      f.frequency.value=1800+Math.min(1500, vel*1.05); f.Q.value=6.5;
      s.connect(f); f.connect(_env(ac,t,0.085,0.05)); s.start(t); s.stop(t+0.055);
      const o=ac.createOscillator(); o.type='triangle'; o.frequency.value=680+Math.min(320, vel*0.2);
      o.connect(_env(ac,t,0.024,0.04)); o.start(t); o.stop(t+0.045);
    }catch(_){}
  }
  function sWhoosh(){
    const ac=_ac(); if(!ac||!_live()) return;
    try{
      const t=ac.currentTime;
      const s=ac.createBufferSource(); s.buffer=_noise(ac); s.loop=true;
      const f=ac.createBiquadFilter(); f.type='lowpass'; f.Q.value=1.1;
      f.frequency.setValueAtTime(240,t);
      f.frequency.exponentialRampToValueAtTime(1500,t+0.28);
      f.frequency.exponentialRampToValueAtTime(320,t+0.8);
      const g=ac.createGain();
      g.gain.setValueAtTime(0.0009,t);
      g.gain.exponentialRampToValueAtTime(0.05,t+0.16);
      g.gain.exponentialRampToValueAtTime(0.0008,t+0.85);
      s.connect(f); f.connect(g); g.connect(ac.destination);
      s.start(t); s.stop(t+0.9);
    }catch(_){}
  }
  function sLand(){
    const ac=_ac(); if(!ac||!_live()) return;
    try{
      const t=ac.currentTime;
      const o=ac.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(62,t+0.26);
      o.connect(_env(ac,t,0.16,0.3)); o.start(t); o.stop(t+0.32);
      const s=ac.createBufferSource(); s.buffer=_noise(ac);
      const f=ac.createBiquadFilter(); f.type='lowpass'; f.frequency.value=520;
      s.connect(f); f.connect(_env(ac,t,0.06,0.1)); s.start(t); s.stop(t+0.11);
    }catch(_){}
  }
  function sChime(){
    const ac=_ac(); if(!ac||!_live()) return;
    try{
      const t=ac.currentTime;
      [880, 1108.73, 1318.51].forEach((fr,i)=>{
        const o=ac.createOscillator(); o.type='triangle'; o.frequency.value=fr;
        const at=t+0.1+i*0.13;
        o.connect(_env(ac,at,0.055,0.6)); o.start(at); o.stop(at+0.62);
      });
      const s=ac.createBufferSource(); s.buffer=_noise(ac);
      const f=ac.createBiquadFilter(); f.type='highpass'; f.frequency.value=6200;
      s.connect(f); f.connect(_env(ac,t+0.1,0.028,0.5)); s.start(t+0.1); s.stop(t+0.62);
    }catch(_){}
  }
  function sSnip(){
    const ac=_ac(); if(!ac||!_live()) return;
    try{
      const t=ac.currentTime;
      [0,0.085].forEach(d=>{
        const s=ac.createBufferSource(); s.buffer=_noise(ac);
        const f=ac.createBiquadFilter(); f.type='bandpass'; f.frequency.value=3400; f.Q.value=3;
        s.connect(f); f.connect(_env(ac,t+d,0.13,0.045)); s.start(t+d); s.stop(t+d+0.05);
      });
      const o=ac.createOscillator(); o.type='sine';
      o.frequency.setValueAtTime(300,t+0.05); o.frequency.exponentialRampToValueAtTime(105,t+0.3);
      o.connect(_env(ac,t+0.05,0.04,0.27)); o.start(t+0.05); o.stop(t+0.34);
    }catch(_){}
  }
  function sGood(){
    const ac=_ac(); if(!ac||!_live()) return;
    try{
      const t=ac.currentTime;
      [659.25, 830.61].forEach((fr,i)=>{
        const o=ac.createOscillator(); o.type='triangle'; o.frequency.value=fr;
        o.connect(_env(ac,t+i*0.09,0.05,0.24)); o.start(t+i*0.09); o.stop(t+i*0.09+0.26);
      });
    }catch(_){}
  }
  function sBad(){
    const ac=_ac(); if(!ac||!_live()) return;
    try{
      const t=ac.currentTime;
      const o=ac.createOscillator(); o.type='sawtooth';
      o.frequency.setValueAtTime(138,t); o.frequency.exponentialRampToValueAtTime(92,t+0.24);
      const f=ac.createBiquadFilter(); f.type='lowpass'; f.frequency.value=620;
      const g=_env(ac,t,0.05,0.26);
      o.connect(f); f.connect(g); o.start(t); o.stop(t+0.28);
    }catch(_){}
  }

  /* ───────── pointer-tick ticker: rAF sampling of the live CSS rotation.
     Purely presentational — the spin transition, landing handler and all
     outcome timing are untouched. Torn down in done()/close(). ───────── */
  function _startTicker(rot){
    if (RM || !rot) return;
    if (st.tickRaf){ cancelAnimationFrame(st.tickRaf); st.tickRaf=null; }
    st.spinDone=false;
    const ptr=document.querySelector('#mo-screen-spin .mo-pointer');
    let prev=null, cum=0, lastCross=null, kick=0, lastT=performance.now(), lastSpark=0;
    const read=()=>{
      const tr=getComputedStyle(rot).transform;
      if (!tr || tr==='none') return 0;
      const p=tr.slice(7,-1).split(',');
      return Math.atan2(parseFloat(p[1]), parseFloat(p[0]))*180/Math.PI;
    };
    const step=(now)=>{
      st.tickRaf=null;
      if (st.spinDone || !rot.isConnected){ if(ptr) ptr.style.transform=''; return; }
      const dt=Math.max(0.001,(now-lastT)/1000); lastT=now;
      const a=read();
      if (prev==null){ prev=a; cum=((a%360)+360)%360; lastCross=Math.floor(cum/45); }
      let d=a-prev; d=((d%360)+540)%360-180; prev=a; cum+=d;
      const vel=Math.abs(d)/dt;                    // deg/s
      const c=Math.floor(cum/45);
      if (c!==lastCross){
        lastCross=c;
        kick=Math.min(15, 6.5+vel*0.011);
        sTick(vel);
        if (vel<240 && ptr && now-lastSpark>150){  // sparks only on the slow final ticks
          lastSpark=now;
          const r=ptr.getBoundingClientRect();
          moBurst(r.left+r.width/2, r.bottom-5, {count:3, power:3.2, colors:['#F5E3A8','#E8CF7E'], life:420, spread:Math.PI*0.8, gravity:0.28});
        }
      }
      kick*=Math.exp(-dt*9.5);                     // pin tension eases back
      if (ptr) ptr.style.transform=`translateX(-50%) rotate(${(-kick).toFixed(2)}deg)`;
      st.tickRaf=requestAnimationFrame(step);
    };
    st.tickRaf=requestAnimationFrame(step);
  }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#mo-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('mo-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('mo-screen-intro')) build();
    syncLang();
    show('mo-screen-intro');
  }
  function close() {
    if (st && st.lockTimer){ clearInterval(st.lockTimer); st.lockTimer=null; }
    if (st && st.tickRaf){ cancelAnimationFrame(st.tickRaf); st.tickRaf=null; }
    if (st) st.spinDone = true;
    document.getElementById('mo-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('mo-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'mo-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeMoirai()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΜΟΙΡΑΙ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="mo-wrap"></div></div>';
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
    const logo = 'ΜΟΙΡΑΙ'.split('').map((c,i)=>`<span style="--i:${i}">${c}</span>`).join('');
    document.getElementById('mo-wrap').innerHTML = `
${ambientHTML()}
<!-- INTRO -->
<div id="mo-screen-intro" class="mo-screen">
  ${spindleSVG('mo-spindle')}
  <div class="mo-logo" aria-label="ΜΟΙΡΑΙ">${logo}</div>
  <div class="mo-logo-en" data-i18n="subtitle"></div>
  <div class="mo-fates" aria-hidden="true">
    <div class="mo-fate" style="--i:0">${fateIcon('k')}<div class="mo-fate-n">ΚΛΩΘΩ</div><div class="mo-fate-r" data-i18n="fateK"></div></div>
    <div class="mo-fate" style="--i:1">${fateIcon('l')}<div class="mo-fate-n">ΛΑΧΕΣΙΣ</div><div class="mo-fate-r" data-i18n="fateL"></div></div>
    <div class="mo-fate" style="--i:2">${fateIcon('a')}<div class="mo-fate-n">ΑΤΡΟΠΟΣ</div><div class="mo-fate-r" data-i18n="fateA"></div></div>
  </div>
  <div class="mo-intro-txt" data-i18n="intro"></div>
  <button class="sym-btn" onclick="Moirai._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="mo-screen-game" class="mo-screen">
  <div class="mo-top">
    <div class="mo-thread">
      <span class="mo-thread-ic" aria-hidden="true">${threadIcon()}</span>
      <span class="mo-thread-lbl" data-i18n="thread"></span>
      <span class="mo-thread-val" id="mo-thread">0</span>
    </div>
    <div class="mo-round" id="mo-round"></div>
  </div>
  <div class="mo-board" id="mo-board"></div>
  <div class="mo-qbody">
    <div class="mo-watchers" id="mo-watchers" aria-hidden="true">
      <svg class="mo-watch-svg" viewBox="0 0 860 84" preserveAspectRatio="none">
        <path class="mo-wthread back" d="M-6 50 C 150 28 300 62 430 43 C 560 24 710 58 866 36"/>
        <path class="mo-wthread" d="M-6 50 C 150 28 300 62 430 43 C 560 24 710 58 866 36"/>
      </svg>
      <div class="mo-watch-row">
        <div class="mo-watcher" data-fate="k" style="--i:0">${fateIcon('k')}<span class="mo-watch-n">ΚΛΩΘΩ</span></div>
        <div class="mo-watcher" data-fate="l" style="--i:1">${fateIcon('l')}<span class="mo-watch-n">ΛΑΧΕΣΙΣ</span></div>
        <div class="mo-watcher" data-fate="a" style="--i:2">${fateIcon('a')}<span class="mo-watch-n">ΑΤΡΟΠΟΣ</span></div>
      </div>
    </div>
    <div class="mo-q-card"><div class="mo-q-text" id="mo-qtext"></div></div>
    <div class="mo-answers" id="mo-answers"></div>
    <div class="mo-feedback" id="mo-feedback"></div>
  </div>
</div>

<!-- SPIN -->
<div id="mo-screen-spin" class="mo-screen">
  <div class="mo-spool" id="mo-spool" aria-hidden="true">
    ${spoolSVG()}
    <div class="mo-spool-txt">
      <span class="mo-spool-lbl" data-i18n="thread"></span>
      <span class="mo-spool-val" id="mo-spool-v">0</span>
    </div>
  </div>
  <div class="mo-spin-head" data-i18n="spinhead"></div>
  <div class="mo-spin-rule" aria-hidden="true"></div>
  <div class="mo-wheel-wrap" id="mo-wheel-wrap">
    <div class="mo-wheel-ground" aria-hidden="true"></div>
    <div class="mo-wheel-halo" aria-hidden="true"></div>
    <div class="mo-pointer" aria-hidden="true">${pointerSVG()}</div>
    <div id="mo-wheel-host"></div>
    <div class="mo-wheel-sheen" aria-hidden="true"></div>
    <div class="mo-speed" aria-hidden="true"></div>
    <div class="mo-win-wedge" id="mo-win-wedge" aria-hidden="true"></div>
  </div>
  <div class="mo-outcome" id="mo-outcome"></div>
  <div class="mo-braziers" aria-hidden="true">
    <div class="mo-brazier l">${brazierSVG('l')}</div>
    <div class="mo-brazier r">${brazierSVG('r')}</div>
  </div>
</div>

<!-- END -->
<div id="mo-screen-end" class="mo-screen">
  <div id="mo-end-art"></div>
  <div class="mo-end-title" id="mo-end-title"></div>
  <div class="mo-end-sub" id="mo-end-sub"></div>
  <div class="mo-final-board" id="mo-final-board"></div>
  <div class="mo-end-btns">
    <button class="sym-btn" onclick="Moirai._start()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Moirai.close()" data-i18n="exit"></button>
  </div>
</div>
<div class="mo-flash" id="mo-flash" aria-hidden="true"></div>`;
    buildEmbers();
  }

  const I18N = {
    subtitle:{ gr:'Ο τροχός των Μοιρών', en:'The Wheel of the Fates' },
    fateK:   { gr:'γνέθει το νήμα', en:'spins the thread' },
    fateL:   { gr:'μετρά το μήκος του', en:'measures its length' },
    fateA:   { gr:'κόβει το τέλος', en:'cuts the end' },
    intro:   { gr:'Η Κλωθώ γνέθει, η Λάχεσις μετρά, η Άτροπος κόβει. Κάθε σωστή απάντηση σου χαρίζει μια <b>περιστροφή</b> — πολλαπλασίασε το νήμα σου, χτύπα το <b>τζάκποτ</b> (★)… ή άσε την <b>Άτροπο</b> (✂) να το κόψει.', en:'Clotho spins, Lachesis measures, Atropos cuts. Each correct answer grants a <b>spin</b> — multiply your thread, hit the <b>jackpot</b> (★)… or let <b>Atropos</b> (✂) sever it.' },
    begin:   { gr:'ΓΝΕΣΕ ΤΟ ΝΗΜΑ', en:'SPIN THE THREAD' },
    thread:  { gr:'ΝΗΜΑ', en:'THREAD' },
    spinhead:{ gr:'ΓΥΡΙΣΕ ΤΟΝ ΤΡΟΧΟ ΤΗΣ ΜΟΙΡΑΣ', en:'TURN THE WHEEL OF FATE' },
    again:   { gr:'ΝΕΟ ΝΗΜΑ', en:'NEW THREAD' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#mo-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('mo-screen-game').classList.contains('active')) {
      document.getElementById('mo-qtext').textContent = QT(st.cur.q);
      renderTop(); renderBoard();
    }
  }
  function show(id){ document.querySelectorAll('#mo-wrap .mo-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _start() {
    st = {
      thread:0, round:0, answered:false, spin:0,
      pool: shuffle([..._gpPool()]), idx:0,
      rivals: RIVALS.map(n=>({ name:n, thread: 150 + ((Math.random()*200)|0) })),
    };
    const tEl = document.getElementById('mo-thread');
    if (tEl){ tEl.dataset.v = 0; tEl.textContent = '0'; }
    show('mo-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), thread:st.thread, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.thread-a.thread);
    return all;
  }
  function renderTop() {
    tickNum(document.getElementById('mo-thread'), st.thread);
    const pips = Array.from({length:ROUNDS},(_,i)=>
      `<span class="mo-pip${i<st.round?' done':''}${i===st.round-1?' cur':''}"></span>`).join('');
    document.getElementById('mo-round').innerHTML =
      `<span class="mo-round-txt">${T('ΓΥΡΟΣ ','ROUND ')+st.round+' / '+ROUNDS}</span><span class="mo-pips" aria-hidden="true">${pips}</span>`;
  }
  function renderBoard() {
    if(window.SymStandings) SymStandings.feed('mo', standings(), {key:'thread', unit:'νήμα', accent:'var(--sym-blood)', title:'ΜΟΙΡΑΙ'});
    const rows = standings();
    const max  = Math.max(1, rows.length ? rows[0].thread : 1);
    document.getElementById('mo-board').innerHTML = rows.map((x,i)=>{
      const pct = x.thread>0 ? Math.max(7, Math.round(x.thread/max*100)) : 0;
      return `<div class="mo-board-chip${x.me?' me':''}${i===0?' lead':''}"><span class="mo-board-rank">${i+1}</span><span class="mo-board-name">${x.name}</span><span class="mo-board-t">${x.thread}</span><span class="mo-board-bar" aria-hidden="true"><i style="--w:${pct}%"></i></span></div>`;
    }).join('');
  }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.round>=ROUNDS) return end();
    st.answered=false; st.cur=getQ(); st.round++;
    document.getElementById('mo-qtext').textContent = QT(st.cur.q);
    const card=document.querySelector('#mo-screen-game .mo-q-card');
    if (card){ card.classList.remove('deal'); void card.offsetWidth; card.classList.add('deal'); }
    const fb=document.getElementById('mo-feedback'); fb.textContent=''; fb.className='mo-feedback';
    const wt=document.getElementById('mo-watchers'); if (wt) wt.classList.remove('bless','doom');
    const wrap=document.getElementById('mo-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='mo-ans'; b.style.setProperty('--i', i);
      b.innerHTML=`<span class="mo-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderTop(); renderBoard();
  }

  function advanceRivals(){ st.rivals.forEach(r=> r.thread += 40 + ((Math.random()*180)|0)); }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    _ac(); // unlock audio inside the click gesture (no-op if unavailable)
    document.querySelectorAll('#mo-answers .mo-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('mo-feedback');
    advanceRivals();
    if (chosen===st.cur.c) {
      st.wheelKind='boon';
      fb.textContent=T('ΣΩΣΤΟ — γύρισε τον τροχό της τύχης','CORRECT — spin the wheel of fortune'); fb.className='mo-feedback mo-fb-ok';
      _fx('correct',{el:btn});
      sGood();
      const r=btn.getBoundingClientRect();
      moBurst(r.left+r.width/2, r.top+r.height/2, {count:16, power:8, glyphs:['✦','✧'], colors:['#E8CF7E','#F5E3A8','#C9A44A'], up:0.4, life:1000});
      moFlash('rgba(232,207,126,0.16)', 0.35, 0.45);
    } else {
      st.wheelKind='curse';
      btn.classList.add('wrong'); _fx('wrong',{el:btn});
      sBad();
      fb.textContent=T('ΛΑΘΟΣ — γύρισε τον τροχό της συμφοράς','WRONG — spin the wheel of misfortune'); fb.className='mo-feedback mo-fb-bad';
      moShake(9, 0.4);
      moFlash('rgba(178,59,42,0.22)', 0.4, 0.45);
    }
    /* the presiding Fates react (visual only): Clotho blesses a correct
       answer with candle-gold, Atropos leans in on a wrong one */
    const wt=document.getElementById('mo-watchers');
    if (wt){ wt.classList.remove('bless','doom'); void wt.offsetWidth; wt.classList.add(chosen===st.cur.c?'bless':'doom'); }
    renderBoard();
    setTimeout(showSpin, 950);
  }

  /* ───────── wheel spin ─────────
     Rotate a wrapping HTML <div> (robust) rather than the SVG group. */
  function showSpin() {
    show('mo-screen-spin');
    const sectors=curSectors();
    // presentation only: bathe the header/rule in blood-light on the curse wheel
    const scr=document.getElementById('mo-screen-spin');
    if (scr) scr.classList.toggle('curse', st.wheelKind==='curse');
    const headEl=document.querySelector('#mo-screen-spin .mo-spin-head');
    if (headEl) headEl.textContent = st.wheelKind==='curse'
      ? T('Ο ΤΡΟΧΟΣ ΤΗΣ ΣΥΜΦΟΡΑΣ','THE WHEEL OF MISFORTUNE')
      : T('Ο ΤΡΟΧΟΣ ΤΗΣ ΜΟΙΡΑΣ','THE WHEEL OF FATE');
    const wrap=document.getElementById('mo-wheel-wrap');
    if (wrap){ wrap.classList.remove('boon','curse','landed'); wrap.classList.add(st.wheelKind==='curse'?'curse':'boon'); wrap.classList.add('spinning'); }
    const wg=document.getElementById('mo-win-wedge'); if (wg) wg.classList.remove('on');
    const spv=document.getElementById('mo-spool-v');
    if (spv){ if (spv._moRaf){ cancelAnimationFrame(spv._moRaf); spv._moRaf=null; } spv.dataset.v=st.thread; spv.textContent=st.thread; }
    const spc=document.getElementById('mo-spool');
    if (spc){ spc.classList.remove('wind','snap','lose'); spc.style.setProperty('--fill', Math.min(1, st.thread/1500).toFixed(3)); }
    document.getElementById('mo-outcome').innerHTML='';
    document.getElementById('mo-wheel-host').innerHTML = `<div class="mo-rot ${st.wheelKind}" id="mo-rot">${wheelSVG(sectors)}</div>`;
    const rot = document.getElementById('mo-rot');
    rot.style.transition='none';
    rot.style.transform=`rotate(${st.spin||0}deg)`;
    const idx=(Math.random()*sectors.length)|0;
    const center = idx*45 + 22.5;
    const jitter = (Math.random()*30-15);
    st.spin = (st.spin||0) + 360*5 + ((360 - (((st.spin||0)+center) % 360)) % 360) - jitter;
    void rot.getBoundingClientRect();
    const dur = RM ? 1.1 : 3.9;                       // weightier turn of fate
    rot.style.transition=`transform ${dur}s cubic-bezier(.09,.83,.14,1)`;
    rot.style.transform=`rotate(${st.spin}deg)`;
    sWhoosh();
    _startTicker(rot);
    let applied=false;
    const done = ()=>{
      if(applied) return; applied=true;
      rot.removeEventListener('transitionend', done);
      st.spinDone=true;
      if (st.tickRaf){ cancelAnimationFrame(st.tickRaf); st.tickRaf=null; }
      if (wrap) wrap.classList.remove('spinning');
      if (wrap) wrap.classList.add('landed');
      const ptr=document.querySelector('#mo-screen-spin .mo-pointer');
      if (ptr){ ptr.style.transform=''; ptr.classList.add('land'); setTimeout(()=>ptr.classList.remove('land'), 460); }
      const wg2=document.getElementById('mo-win-wedge');
      if (wg2){ wg2.style.setProperty('--wcol', sectors[idx].col); wg2.classList.remove('on'); void wg2.offsetWidth; wg2.classList.add('on'); }
      sLand();
      if (wrap){
        const r=wrap.getBoundingClientRect();
        moBurst(r.left+r.width/2, r.top+22, {count:12, power:6.5, colors:[sectors[idx].col,'#E8CF7E','#F5E3A8'], life:850, spread:Math.PI*1.2, up:0.2});
      }
      moFlash(st.wheelKind==='curse' ? 'rgba(178,59,42,0.20)' : 'rgba(232,207,126,0.16)', 0.35, 0.5);
      applySpin(idx);
    };
    rot.addEventListener('transitionend', done);
    setTimeout(done, dur*1000+320);
    _fx('spin');
  }

  function applySpin(idx) {
    const s = curSectors()[idx];
    let big='', desc='', cls='gain', delta=0, lock=false;
    if (s.k==='x1'){ delta=BASE; big=`+${delta}`; desc=T('Η Λάχεσις μετρά ένα μέτρο νήματος.','Lachesis measures one length of thread.'); }
    else if (s.k==='x2'){ delta=BASE*2; big=`+${delta}`; desc=T('Διπλό νήμα από τον αδράχτι της Κλωθούς.','A double thread from Clotho’s spindle.'); }
    else if (s.k==='x3'){ delta=BASE*3; big=`+${delta}`; desc=T('Τριπλό νήμα — η μοίρα σε ευνοεί.','A triple thread — fate favours you.'); }
    else if (s.k==='jack'){ delta=500; big=T('ΤΖΑΚΠΟΤ +500','JACKPOT +500'); desc=T('Το χρυσό νήμα της μοίρας!','The golden thread of destiny!'); _fx('jackpot'); }
    else if (s.k==='cut'){ delta=-Math.round(st.thread*0.5); big=T(`ΑΤΡΟΠΟΣ ${delta}`,`ATROPOS ${delta}`); desc=T('Η Άτροπος κόβει το μισό σου νήμα.','Atropos severs half your thread.'); cls='loss'; _fx('cut'); }
    else if (s.k==='steal'){
      const board=standings(); const leader=board.find(x=>!x.me);
      const amt = leader ? Math.max(20, Math.round(leader.thread*0.3/5)*5) : BASE;
      if (leader){ const rv=st.rivals.find(r=>r.name===leader.name); if(rv) rv.thread=Math.max(0, rv.thread-amt); }
      delta=amt; cls='steal'; big=T('ΚΛΟΠΗ +'+amt,'STEAL +'+amt);
      desc=T('Άρπαξες νήμα από τον/την '+(leader?leader.name:''),'You snatched thread from '+(leader?leader.name:''));
    }
    else if (s.k==='sabotage'){
      const rv=st.rivals[(Math.random()*st.rivals.length)|0];
      const amt=Math.max(20, Math.round(rv.thread*0.3/5)*5); rv.thread=Math.max(0, rv.thread-amt);
      cls='steal'; big=T('ΔΟΛΙΟΦΘΟΡΑ','SABOTAGE'); desc=T('Έκοψες '+amt+' νήμα από τον/την '+rv.name,'You cut '+amt+' thread from '+rv.name);
    }
    else if (s.k==='nothing'){ big=T('ΤΙΠΟΤΑ','NOTHING'); desc=T('Οι Μοίρες σιωπούν.','The Fates are silent.'); }
    else if (s.k==='donate'){
      const rv=st.rivals[(Math.random()*st.rivals.length)|0];
      const amt=Math.max(20, Math.round(st.thread*0.3/5)*5); st.thread=Math.max(0, st.thread-amt); rv.thread+=amt;
      cls='loss'; big=T('ΔΩΡΕΑ -'+amt,'DONATION -'+amt); desc=T('Χάρισες '+amt+' νήμα στον/στην '+rv.name,'You gifted '+amt+' thread to '+rv.name);
    }
    else if (s.k==='lock'){ cls='loss'; lock=true; big=T('ΚΛΕΙΔΩΜΑ','LOCKED'); desc=T('Οι Μοίρες σε ακινητοποιούν για 5 δευτερόλεπτα.','The Fates freeze you for 5 seconds.'); }
    st.thread = Math.max(0, st.thread + delta);

    /* thread-spool HUD reacts to the verdict (visual only) */
    const spl=document.getElementById('mo-spool'), splv=document.getElementById('mo-spool-v');
    if (splv) tickNum(splv, st.thread, 900);
    if (spl){
      spl.classList.remove('wind','snap','lose'); void spl.offsetWidth;
      spl.style.setProperty('--fill', Math.min(1, st.thread/1500).toFixed(3));  // coil visibly fattens/thins with the verdict
      if (s.k==='cut') spl.classList.add('snap');
      else if (s.k==='donate') spl.classList.add('lose');
      else if (delta>0) { spl.classList.add('wind'); _threadStream(); }
    }

    /* set-piece FX per outcome (visual only) */
    if ((cls==='gain'||cls==='steal') && delta>0)
      moBurst(window.innerWidth/2, window.innerHeight*0.42, {glyphs:['✦','✧','🧵'], count:18, power:10, up:0.5, life:1200});
    if (s.k==='jack'){
      sChime();
      moFlash('rgba(232,207,126,0.32)', 0.5, 0.7);
      moBurst(window.innerWidth/2, window.innerHeight*0.45, {count:26, power:12, colors:['#F5E3A8','#E8CF7E','#C9A44A','#FFFFFF'], life:1400});
      setTimeout(()=>moBurst(window.innerWidth/2, window.innerHeight*0.4, {glyphs:['★','✦'], count:14, power:9, up:0.4, life:1200}), 180);
    }
    if (s.k==='cut'){
      moShake(13, 0.55); moFlash('rgba(178,59,42,0.32)', 0.5, 0.6);
      setTimeout(sSnip, 430);
      if (!RM) setTimeout(()=>{                       // fibres drift off the severed thread
        const fx=document.querySelector('#mo-outcome .mo-cutfx'); if(!fx) return;
        const r=fx.getBoundingClientRect();
        moBurst(r.left+r.width/2, r.top+r.height/2, {count:10, power:4.5, colors:['#E8CF7E','#C9A44A','#E06A52'], life:950, gravity:0.85, spread:Math.PI*0.9});
      }, 600);
    }

    let fxHtml='';
    if (s.k==='cut')  fxHtml=
      `<div class="mo-cutfx" aria-hidden="true">`+
        `<span class="mo-cut-th mo-cut-l"></span><span class="mo-cut-th mo-cut-r"></span>`+
        `<span class="mo-cut-flash"></span>`+
        `<svg class="mo-shears" viewBox="0 0 64 64" fill="none">`+
          `<g class="mo-sh-a"><path d="M13 5 L36 40" stroke="#E9E4F4" stroke-width="4" stroke-linecap="round"/>`+
            `<path d="M13 5 L36 40" stroke="#8F87AC" stroke-width="1.3" stroke-linecap="round" transform="translate(1.2 1)"/>`+
            `<circle cx="42.5" cy="49" r="6" stroke="#C9A44A" stroke-width="3.2"/></g>`+
          `<g class="mo-sh-b"><path d="M51 5 L28 40" stroke="#F4F0FB" stroke-width="4" stroke-linecap="round"/>`+
            `<path d="M51 5 L28 40" stroke="#9A92B6" stroke-width="1.3" stroke-linecap="round" transform="translate(-1.2 1)"/>`+
            `<circle cx="21.5" cy="49" r="6" stroke="#C9A44A" stroke-width="3.2"/></g>`+
          `<circle cx="32" cy="33.5" r="2.6" fill="#E8CF7E" stroke="#241C40" stroke-width="1"/>`+
        `</svg>`+
      `</div>`;
    if (s.k==='jack') fxHtml=`<div class="mo-rays" aria-hidden="true"></div><span class="mo-shock" aria-hidden="true"></span><span class="mo-shock s2" aria-hidden="true"></span>`;
    const contLabel = st.round>=ROUNDS?T('ΑΠΟΤΕΛΕΣΜΑ','RESULT'):T('ΣΥΝΕΧΕΙΑ','CONTINUE');
    let html=fxHtml+`<div class="mo-outcome-big ${cls}">${big}</div><div class="mo-outcome-desc">${desc}</div>`;
    html += lock ? `<button class="sym-btn mo-cont" id="mo-cont" disabled>5s</button>` : `<button class="sym-btn mo-cont" onclick="Moirai._cont()">${contLabel}</button>`;
    document.getElementById('mo-outcome').innerHTML = html;
    if (window.gsap) gsap.from('#mo-outcome .mo-outcome-big', {scale:0.6, opacity:0, duration:.5, ease:'back.out(2.2)'});
    if (lock){ let s5=5; const btn=document.getElementById('mo-cont'); st.lockTimer=setInterval(()=>{ s5--; if(s5<=0){ clearInterval(st.lockTimer); st.lockTimer=null; if(btn){ btn.disabled=false; btn.textContent=contLabel; btn.onclick=()=>_cont(); } } else if(btn){ btn.textContent=s5+'s'; } },1000); }
  }

  function _cont() {
    if (st.lockTimer){ clearInterval(st.lockTimer); st.lockTimer=null; }
    show('mo-screen-game');
    renderTop(); renderBoard();
    if (st.round>=ROUNDS) end(); else nextQ();
  }

  /* ───────── end ───────── */
  function end() {
    show('mo-screen-end');
    const board = standings();
    const won = board[0].me;
    _fx(won?'win':'lose');
    document.getElementById('mo-end-art').innerHTML = spindleSVG('mo-end-spindle', won?'win':'lose');
    const title=document.getElementById('mo-end-title'), sub=document.getElementById('mo-end-sub');
    if (won) {
      title.textContent=T('ΤΟ ΝΗΜΑ ΤΗΣ ΜΟΙΡΑΣ','THE THREAD OF FATE'); title.className='mo-end-title win';
      sub.textContent=T('Ύφανες το μακρύτερο νήμα ζωής. Ακόμη και οι Μοίρες υποκλίνονται.','You wove the longest thread of life. Even the Fates bow.');
      moFlash('rgba(232,207,126,0.28)', 0.45, 0.8);
      moBurst(window.innerWidth/2, window.innerHeight*0.34, {count:26, power:12, colors:['#F5E3A8','#E8CF7E','#C9A44A','#FFFFFF'], life:1500});
      setTimeout(()=>moBurst(window.innerWidth/2, window.innerHeight*0.3, {glyphs:['✦','★','✧'], count:16, power:9, up:0.4, life:1300}), 250);
    } else {
      title.textContent=T('ΟΙ ΜΟΙΡΕΣ ΑΠΟΦΑΣΙΣΑΝ','THE FATES HAVE SPOKEN'); title.className='mo-end-title lose';
      sub.textContent=T(`Τελείωσες στη ${board.findIndex(x=>x.me)+1}η θέση. Νικητής: ${board[0].name}.`,`You finished in position ${board.findIndex(x=>x.me)+1}. Winner: ${board[0].name}.`);
      moFlash('rgba(178,59,42,0.18)', 0.3, 0.7);
    }
    document.getElementById('mo-final-board').innerHTML = board.map((x,i)=>
      `<div class="mo-final-row${x.me?' me':''}${i===0?' first':''}" style="--i:${i}"><span class="mo-final-pos">${i+1}</span><span class="mo-final-name">${x.name}${i===0?' 🏆':''}</span><span class="mo-final-t">${x.thread}</span></div>`
    ).join('');
  }

  /* ───────── art ───────── */
  function _rgb(h){ h=h.replace('#',''); return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)]; }
  function _shade(h,f){ const c=_rgb(h); const t=f<0?0:255, p=Math.abs(f); const m=v=>Math.round(v+(t-v)*p); return `rgb(${m(c[0])},${m(c[1])},${m(c[2])})`; }
  function _lum(h){ const c=_rgb(h); return (0.299*c[0]+0.587*c[1]+0.114*c[2])/255; }

  // hand-drawn vector icon per sector kind (replaces flat emoji labels)
  // inkOv: optional ink override, used to stamp a dark offset copy beneath
  // the lit copy so icons read as chiselled into the bronze.
  function secIcon(s, inkOv) {
    const ink = inkOv || (_lum(s.col)>0.55 ? '#221B3A' : '#F2EBDA');
    const sk  = `stroke="${ink}" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" fill="none"`;
    switch (s.k) {
      case 'x1': case 'x2': case 'x3':
        return `<text y="1" text-anchor="middle" dominant-baseline="central" font-family="Georgia, 'Times New Roman', serif" font-size="17" font-weight="700" fill="${ink}">${s.label}</text>`;
      case 'jack':   // star of the golden thread
        return `<path d="M0 -12.5 L3.7 -4.2 L12.6 -3.9 L5.8 1.8 L8 10.4 L0 5.4 L-8 10.4 L-5.8 1.8 L-12.6 -3.9 L-3.7 -4.2 Z" fill="${ink}"/>`;
      case 'steal':  // stack of coins
        return `<g ${sk}><ellipse cx="0" cy="-4.5" rx="9" ry="4"/><path d="M-9 -4.5 v8 a9 4 0 0 0 18 0 v-8"/><path d="M-9 -0.5 a9 4 0 0 0 18 0"/></g>`;
      case 'sabotage': // dagger
        return `<g><path d="M0 -13 L3.2 -3.5 L1.8 5 H-1.8 L-3.2 -3.5 Z" fill="${ink}"/><path d="M-6.5 5 H6.5 M0 5 V12" ${sk}/></g>`;
      case 'donate': // amphora (a gift)
        return `<g ${sk}><path d="M-5 -10 H5 M-3.4 -10 C-3.4 -6.5 -7 -5 -7 -1 C-7 4 -3.4 6.5 -3.4 9.5 H3.4 C3.4 6.5 7 4 7 -1 C7 -5 3.4 -6.5 3.4 -10"/><path d="M-6.6 -5.5 q-3.4 1.6 -1.4 4.6 M6.6 -5.5 q3.4 1.6 1.4 4.6"/></g>`;
      case 'lock':   // hourglass
        return `<g ${sk}><path d="M-6.5 -11 H6.5 M-6.5 11 H6.5 M-5 -11 C-5 -4.5 -1.4 -2.6 0 0 C1.4 2.6 5 4.5 5 11 M5 -11 C5 -4.5 1.4 -2.6 0 0 C-1.4 2.6 -5 4.5 -5 11"/><circle cx="0" cy="6.5" r="1.4" fill="${ink}" stroke="none"/></g>`;
      case 'cut':    // Atropos' shears
        return `<g ${sk}><path d="M-7.5 -11 L4.5 5.5 M7.5 -11 L-4.5 5.5"/><circle cx="6" cy="8" r="3.1"/><circle cx="-6" cy="8" r="3.1"/></g>`;
      default:       // nothing
        return `<g ${sk} opacity="0.85"><circle cx="0" cy="0" r="7.5"/><path d="M-5 5 L5 -5"/></g>`;
    }
  }

  function wheelSVG(secs) {
    secs = secs || curSectors();
    const cx=130, cy=130, r=104;
    const pt=(deg,rr)=>{ const a=(deg-90)*Math.PI/180; return [cx+rr*Math.cos(a), cy+rr*Math.sin(a)]; };
    let defs='', sectors='', engrave='', seps='', rivets='';
    secs.forEach((s,i)=>{
      defs += `<radialGradient id="mo-sg${i}" cx="50%" cy="50%" r="72%"><stop offset="0" stop-color="${_shade(s.col,0.18)}"/><stop offset="0.66" stop-color="${s.col}"/><stop offset="1" stop-color="${_shade(s.col,-0.42)}"/></radialGradient>`;
      const a0=i*45, a1=(i+1)*45, mid=a0+22.5;
      const [x0,y0]=pt(a0,r), [x1,y1]=pt(a1,r);
      const [mx,my]=pt(mid, r*0.66);
      sectors += `<path d="M${cx} ${cy} L${x0.toFixed(1)} ${y0.toFixed(1)} A${r} ${r} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)} Z" fill="url(#mo-sg${i})" stroke="#120E24" stroke-width="1.6"/>
        <g transform="translate(${mx.toFixed(1)} ${my.toFixed(1)}) rotate(${mid})"><g transform="translate(0.9 1.8)" opacity="0.5">${secIcon(s,'#0A0718')}</g>${secIcon(s)}</g>`;
      [a0+11.25, a0+33.75].forEach(gg=>{           // engraved grooves within each panel
        const [gx0,gy0]=pt(gg,31), [gx1,gy1]=pt(gg,r*0.94);
        engrave += `<line x1="${gx0.toFixed(1)}" y1="${gy0.toFixed(1)}" x2="${gx1.toFixed(1)}" y2="${gy1.toFixed(1)}" stroke="#0A0718" stroke-width="1" opacity="0.16"/>`;
      });
      const [sx,sy]=pt(a0,r), [hx,hy]=pt(a0,21);
      seps += `<line x1="${hx.toFixed(1)}" y1="${hy.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${sy.toFixed(1)}" stroke="#0A0718" stroke-width="2.6" opacity="0.25"/>
               <line x1="${hx.toFixed(1)}" y1="${hy.toFixed(1)}" x2="${sx.toFixed(1)}" y2="${sy.toFixed(1)}" stroke="#E8CF7E" stroke-width="0.9" opacity="0.55"/>`;
      const [vx,vy]=pt(a0, r+6.5);
      rivets += `<circle cx="${vx.toFixed(1)}" cy="${vy.toFixed(1)}" r="2.4" fill="url(#mo-rivg)" stroke="#120E24" stroke-width="0.8"/>`;
    });
    let dentils='';                                 // temple-dentil ring engraved in the rim
    for (let i=0;i<24;i++) dentils += `<use href="#mo-dnt" transform="rotate(${i*15} 130 130)"/>`;
    return `<svg class="mo-wheel" viewBox="0 0 260 260" fill="none">
      <defs>${defs}
        <linearGradient id="mo-rimg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8A6B2F"/><stop offset="0.45" stop-color="#E8CF7E"/><stop offset="0.6" stop-color="#C9A44A"/><stop offset="1" stop-color="#6E5424"/></linearGradient>
        <radialGradient id="mo-hubg" cx="38%" cy="34%" r="80%"><stop offset="0" stop-color="#3B3268"/><stop offset="1" stop-color="#171230"/></radialGradient>
        <radialGradient id="mo-vign" cx="50%" cy="50%" r="50%"><stop offset="0.55" stop-color="#0A0718" stop-opacity="0"/><stop offset="0.85" stop-color="#0A0718" stop-opacity="0.10"/><stop offset="1" stop-color="#0A0718" stop-opacity="0.5"/></radialGradient>
        <radialGradient id="mo-rivg" cx="35%" cy="30%" r="85%"><stop offset="0" stop-color="#F5E3A8"/><stop offset="1" stop-color="#8A6B2F"/></radialGradient>
        <path id="mo-dnt" d="M124.4 16.4 h3 v-5.6 h5.2 v5.6 h3" stroke="#231A0C" stroke-width="1.5" fill="none" opacity="0.5" stroke-linejoin="round"/>
      </defs>
      <circle cx="130" cy="130" r="126" fill="#0B0917"/>
      <circle cx="130" cy="130" r="117" fill="none" stroke="url(#mo-rimg)" stroke-width="11"/>
      <g>${dentils}</g>
      <circle cx="130" cy="130" r="122.6" fill="none" stroke="#3A2C10" stroke-width="1.1" opacity="0.8"/>
      <circle cx="130" cy="130" r="111.4" fill="none" stroke="#F7ECC4" stroke-width="0.9" opacity="0.5"/>
      <circle cx="130" cy="130" r="${r}" fill="#0E0B1E"/>
      <g>${sectors}</g>
      <g>${engrave}</g>
      <circle cx="130" cy="130" r="44" fill="none" stroke="#0A0718" stroke-width="1.2" opacity="0.28"/>
      <circle cx="130" cy="130" r="45.2" fill="none" stroke="#F7ECC4" stroke-width="0.7" opacity="0.14"/>
      <circle cx="130" cy="130" r="76" fill="none" stroke="#0A0718" stroke-width="1.2" opacity="0.22"/>
      <circle cx="130" cy="130" r="77.2" fill="none" stroke="#F7ECC4" stroke-width="0.7" opacity="0.10"/>
      <circle cx="130" cy="130" r="${r}" fill="url(#mo-vign)"/>
      <g>${seps}</g><g>${rivets}</g>
      <circle cx="130" cy="130" r="123.5" fill="none" stroke="#2A2350" stroke-width="1.5"/>
      <circle cx="130" cy="130" r="27" fill="none" stroke="#0A0718" stroke-width="5" opacity="0.35"/>
      <circle cx="130" cy="130" r="20" fill="url(#mo-hubg)" stroke="#C9A44A" stroke-width="2.5"/>
      <g stroke="#E8CF7E" stroke-width="1.1" opacity="0.8" fill="none">
        <ellipse cx="130" cy="127.4" rx="13.6" ry="4.6"/>
        <ellipse cx="130" cy="131.2" rx="15.2" ry="5.2"/>
        <ellipse cx="130" cy="134.6" rx="12.8" ry="4.2"/>
      </g>
      <path class="mo-hub-thread" d="M143.5 133 Q 158 141 171 130" stroke="#F5E3A8" stroke-width="1.2" stroke-linecap="round" stroke-dasharray="3 4.4" opacity="0.7"/>
      <circle cx="130" cy="130" r="6" fill="#E8CF7E"/>
      <circle cx="130" cy="130" r="2.3" fill="#191029"/>
    </svg>`;
  }

  // miniature drop-spindle for the spin-screen thread HUD
  function spoolSVG() {
    return `<svg class="mo-spool-svg" viewBox="0 0 44 46" fill="none" aria-hidden="true">
      <defs><linearGradient id="mo-splg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6B2F"/><stop offset="0.5" stop-color="#E8CF7E"/><stop offset="1" stop-color="#8A6B2F"/></linearGradient></defs>
      <path class="mo-spool-tail" d="M31 22 C 39 27 38 35 30 41" stroke="#E8CF7E" stroke-width="1.4" stroke-linecap="round" stroke-dasharray="3 4"/>
      <rect x="19" y="5" width="6" height="34" rx="3" fill="url(#mo-splg)" stroke="#4A3818" stroke-width="1"/>
      <ellipse cx="22" cy="5.5" rx="7" ry="2.4" fill="url(#mo-splg)" stroke="#4A3818" stroke-width="0.9"/>
      <g class="mo-spool-coil" stroke="#E8CF7E" stroke-width="1.3" fill="none" opacity="0.85">
        <ellipse cx="22" cy="17" rx="9" ry="3"/>
        <ellipse cx="22" cy="22" rx="11" ry="3.6"/>
        <ellipse cx="22" cy="27" rx="9.5" ry="3.2"/>
      </g>
      <ellipse cx="22" cy="41" rx="12" ry="3.4" fill="url(#mo-splg)" stroke="#4A3818" stroke-width="1"/>
    </svg>`;
  }

  // tiny inline spindle for the question-screen thread counter (no <defs>,
  // so it can never collide with the spin-screen spool gradient ids)
  function threadIcon() {
    return `<svg viewBox="0 0 20 22" fill="none" aria-hidden="true">
      <path d="M10 2 v17" stroke="#C9A44A" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M10 3.4 c-2.4 1.5 -2.4 3.7 0 5.2 c2.4 -1.5 2.4 -3.7 0 -5.2 z" fill="#E8CF7E" opacity="0.9"/>
      <ellipse cx="10" cy="12" rx="4.6" ry="2.2" stroke="#E8CF7E" stroke-width="1.15"/>
      <ellipse cx="10" cy="15.2" rx="5.4" ry="2.5" stroke="#E8CF7E" stroke-width="1.15"/>
      <path class="mo-thread-ic-tail" d="M12.5 18.6 q4.2 1.4 6 -1.8" stroke="#F5E3A8" stroke-width="1.1" stroke-linecap="round" stroke-dasharray="2.2 3.2"/>
    </svg>`;
  }

  function pointerSVG() {
    return `<svg viewBox="0 0 44 58" fill="none">
      <defs><linearGradient id="mo-ptrg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0DC96"/><stop offset="0.5" stop-color="#C9A44A"/><stop offset="1" stop-color="#8A6B2F"/></linearGradient></defs>
      <path d="M22 54 L7 12 Q22 1 37 12 Z" fill="url(#mo-ptrg)" stroke="#241C40" stroke-width="2"/>
      <path d="M11 12.5 Q22 4.5 33 12.5" stroke="#FFF6DC" stroke-width="1.1" opacity="0.55" fill="none"/>
      <circle class="mo-ptr-gem" cx="22" cy="14" r="4.5" fill="#241C40" stroke="#F0DC96" stroke-width="1.5"/>
    </svg>`;
  }

  // bronze tripod brazier flanking the wheel — the candlelight made literal.
  // sfx keeps gradient ids unique per instance (left/right copies coexist).
  function brazierSVG(sfx) {
    const f='mo-brzf-'+sfx, b='mo-brzb-'+sfx, c='mo-brzc-'+sfx;
    return `<svg class="mo-brz-svg" viewBox="0 0 90 132" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="${f}" cx="50%" cy="82%" r="75%">
          <stop offset="0" stop-color="#FFF3CE"/><stop offset="0.45" stop-color="#F5C86B"/><stop offset="1" stop-color="#E0813F"/>
        </radialGradient>
        <linearGradient id="${b}" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stop-color="#6E5424"/><stop offset="0.5" stop-color="#C9A44A"/><stop offset="1" stop-color="#7A5D28"/>
        </linearGradient>
        <radialGradient id="${c}" cx="50%" cy="30%" r="80%">
          <stop offset="0" stop-color="#F0B04A"/><stop offset="1" stop-color="#8E3226"/>
        </radialGradient>
      </defs>
      <g class="mo-brz-flame">
        <path class="mo-brz-f1" d="M45 4 C33 20 28 31 45 46 C62 31 57 20 45 4 Z" fill="url(#${f})" opacity="0.92"/>
        <path class="mo-brz-f2" d="M45 17 C39 25.5 37 31.5 45 40 C53 31.5 51 25.5 45 17 Z" fill="#FFF6DC" opacity="0.85"/>
      </g>
      <g class="mo-brz-coals">
        <circle cx="36" cy="45" r="2.6" fill="url(#${c})"/>
        <circle cx="45" cy="47" r="3" fill="url(#${c})"/>
        <circle cx="54" cy="45" r="2.6" fill="url(#${c})"/>
      </g>
      <path d="M17 46 Q45 58 73 46 L67.5 60 Q45 70 22.5 60 Z" fill="url(#${b})" stroke="#3A2C10" stroke-width="1.2"/>
      <ellipse cx="45" cy="46.5" rx="28" ry="5" fill="none" stroke="#F0DC96" stroke-width="1.3" opacity="0.75"/>
      <path d="M45 64 V88" stroke="url(#${b})" stroke-width="6.5" stroke-linecap="round"/>
      <circle cx="45" cy="77" r="4.4" fill="url(#${b})" stroke="#3A2C10" stroke-width="1"/>
      <path d="M45 86 L27 121 M45 86 L63 121 M45 88 V123" stroke="url(#${b})" stroke-width="4" stroke-linecap="round"/>
      <circle cx="27" cy="122" r="3" fill="#8A6B2F"/><circle cx="63" cy="122" r="3" fill="#8A6B2F"/><circle cx="45" cy="124" r="3" fill="#8A6B2F"/>
      <path d="M33.5 103 Q45 110 56.5 103" stroke="#8A6B2F" stroke-width="2" fill="none" opacity="0.8"/>
    </svg><i class="mo-brz-halo"></i>`;
  }

  // drop-spindle of the Fates; mode: undefined | 'win' | 'lose'
  function spindleSVG(cls, mode) {
    const g = cls + 'g';
    const th = mode==='lose' ? '#E06A52' : '#E8CF7E';
    return `<svg class="${cls}${mode?' '+mode:''}" viewBox="0 0 140 176" fill="none">
      <defs>
        <linearGradient id="${g}1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3B3268"/><stop offset="1" stop-color="#1B1536"/></linearGradient>
        <linearGradient id="${g}2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A6B2F"/><stop offset="0.5" stop-color="#E8CF7E"/><stop offset="1" stop-color="#8A6B2F"/></linearGradient>
      </defs>
      ${mode==='lose'
        ? `<path class="mo-sp-thread" d="M70 6 C58 22 80 34 70 46" stroke="${th}" stroke-width="1.7" stroke-linecap="round"/>
           <path d="M66 50 l-6 7 M74 50 l6 7 M70 51 l0 8" stroke="${th}" stroke-width="1.3" opacity="0.75" stroke-linecap="round"/>`
        : `<path class="mo-sp-thread" d="M70 4 C56 26 86 42 70 64" stroke="${th}" stroke-width="1.7" stroke-linecap="round"/>`}
      <rect x="67" y="60" width="6" height="102" rx="3" fill="url(#${g}2)" stroke="#4A3818" stroke-width="1.2"/>
      <path d="M70 56 c-6 4 -6 10 0 14 c6 -4 6 -10 0 -14 z" fill="#E8CF7E" stroke="#8A6B2F" stroke-width="1"/>
      <path d="M70 84 C 96 92 100 116 70 126 C 40 116 44 92 70 84 Z" fill="url(#${g}1)" stroke="#120E24" stroke-width="1.6"/>
      <g class="mo-sp-coil" stroke="${th}" stroke-width="1.3" fill="none" opacity="0.75">
        <ellipse cx="70" cy="98" rx="21" ry="6.5"/>
        <ellipse cx="70" cy="106" rx="24" ry="7"/>
        <ellipse cx="70" cy="114" rx="20" ry="6"/>
      </g>
      <ellipse cx="70" cy="146" rx="31" ry="9" fill="url(#${g}2)" stroke="#4A3818" stroke-width="1.4"/>
      <ellipse cx="70" cy="143.6" rx="31" ry="8" fill="#191029" opacity="0.35"/>
      <path d="M70 155 v14" stroke="url(#${g}2)" stroke-width="4" stroke-linecap="round"/>
      ${mode==='win' ? `<g stroke="#E8CF7E" stroke-width="1.3" opacity="0.9" stroke-linecap="round"><path d="M28 40 v10 M23 45 h10"/><path d="M112 60 v8 M108 64 h8"/><path d="M104 22 v7 M100.5 25.5 h7"/></g>` : ''}
    </svg>`;
  }

  // tiny emblem per Fate for the intro triptych
  function fateIcon(k) {
    const s='stroke="#C9A44A" stroke-width="1.8" stroke-linecap="round" fill="none"';
    if (k==='k') return `<svg class="mo-fate-ic" viewBox="0 0 34 34"><path d="M17 4 v22" ${s}/><ellipse cx="17" cy="13" rx="6" ry="3.4" ${s}/><ellipse cx="17" cy="18" rx="7" ry="3.8" ${s}/><path d="M17 26 v4" ${s}/></svg>`;
    if (k==='l') return `<svg class="mo-fate-ic" viewBox="0 0 34 34"><path d="M17 4 v26 M12 8 h10 M13.5 14 h7 M12 20 h10 M13.5 26 h7" ${s}/></svg>`;
    return `<svg class="mo-fate-ic" viewBox="0 0 34 34"><path d="M9 6 l12 15 M25 6 L13 21" ${s}/><circle cx="11" cy="24.5" r="3.4" ${s}/><circle cx="23" cy="24.5" r="3.4" ${s}/></svg>`;
  }

  /* ───────── ambient: the midnight loom ───────── */
  function ambientHTML() {
    return `<div class="mo-ambient" aria-hidden="true">
  <div class="mo-loom"></div>
  <svg class="mo-filaments" viewBox="0 0 1200 800" preserveAspectRatio="none">
    <path class="mo-fil f1" d="M-40 620 C 200 560 380 700 620 640 C 860 580 1040 700 1240 630"/>
    <path class="mo-fil f2" d="M-40 250 C 240 300 420 180 660 240 C 900 300 1060 190 1240 250"/>
    <path class="mo-fil f3" d="M-40 440 C 260 400 460 500 700 450 C 940 400 1100 480 1240 440"/>
  </svg>
  <div class="mo-glow mo-glow-a"></div>
  <div class="mo-glow mo-glow-b"></div>
  <div class="mo-embers" id="mo-embers"></div>
  <div class="mo-vig"></div>
</div>`;
  }
  function buildEmbers() {
    const host = document.getElementById('mo-embers');
    if (!host || RM) return;
    let h='';
    for (let i=0;i<26;i++){
      const s=(1.5+Math.random()*3).toFixed(1);
      h += `<span style="left:${(Math.random()*100).toFixed(1)}%;width:${s}px;height:${s}px;--o:${(0.25+Math.random()*0.5).toFixed(2)};--dr:${((Math.random()-0.5)*120)|0}px;animation-duration:${(7+Math.random()*10).toFixed(1)}s;animation-delay:${(-Math.random()*16).toFixed(1)}s"></span>`;
    }
    host.innerHTML = h;
  }

  return { open, close, _start, _cont, syncLang };
})();
window.Moirai = Moirai;

/* ── Games-Panel entry points ── */
window.openMoirai  = function(gp){ Moirai.open(gp || {}); };
window.closeMoirai = function(){ Moirai.close(); };
