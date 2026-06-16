/* ══════════════════ ΤΟΞΟΤΗΣ — engine ══════════════════
   A Duck-Hunt-style archery game: loose arrows at flying amphorae.
   Two modes:
     • ΕΥΣΤΟΧΗ ΒΟΛΗ (True Shot) — four amphorae drift, each carrying an
       answer; shoot the correct one.
     • ΟΜΟΒΡΟΝΤΙΑ (Volley) — answer correctly, then a 10-second window to
       shatter as many amphorae as you can for bonus points.
   Targets react to clicks AND touches. API: Toxotes.open() / .close()
═══════════════════════════════════════════════════════════════════ */
const Toxotes = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.TX_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const ROUNDS_TRUE   = 10;
  const ROUNDS_VOLLEY = 6;
  const VOLLEY_MS     = 10000;
  const RIVALS = ['ΑΡΤΕΜΙΣ','ΦΙΛΟΚΤΗΤΗΣ','ΟΔΥΣΣΕΥΣ'];

  let st = {};

  function _fx(type, detail){ try{ window.dispatchEvent(new CustomEvent('tx:fx', { detail: Object.assign({ type }, detail||{}) })); }catch(_){} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#tx-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('tx-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('tx-screen-intro')) build();
    syncLang();
    show('tx-screen-intro');
  }
  function close() {
    cleanup();
    document.getElementById('tx-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('tx-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'tx-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeToxotes()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u03a4\u039f\u039e\u039f\u03a4\u0397\u03a3') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="tx-wrap"></div></div>';
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
    document.getElementById('tx-wrap').innerHTML = `
<!-- INTRO / MODE SELECT -->
<div id="tx-screen-intro" class="tx-screen">
  ${bowSVG('tx-bow')}
  <div class="tx-logo">ΤΟΞΟΤΗΣ</div>
  <div class="tx-logo-en" data-i18n="subtitle"></div>
  <div class="tx-intro-txt" data-i18n="intro"></div>
  <div class="tx-modes">
    <button class="tx-mode" onclick="Toxotes._mode('true')">
      <div class="tx-mode-ic">🎯</div>
      <div class="tx-mode-name" data-i18n="m1"></div>
      <div class="tx-mode-desc" data-i18n="m1d"></div>
    </button>
    <button class="tx-mode" onclick="Toxotes._mode('volley')">
      <div class="tx-mode-ic">🏺</div>
      <div class="tx-mode-name" data-i18n="m2"></div>
      <div class="tx-mode-desc" data-i18n="m2d"></div>
    </button>
  </div>
</div>

<!-- GAME -->
<div id="tx-screen-game" class="tx-screen">
  <div class="tx-hud">
    <div class="tx-score"><span class="tx-score-lbl" data-i18n="score"></span><span class="tx-score-val" id="tx-score">0</span></div>
    <div class="tx-mid" id="tx-mid"></div>
    <div class="tx-streak" id="tx-streak"></div>
  </div>
  <div class="tx-qbar" id="tx-qbar"></div>
  <div class="tx-range" id="tx-range">
    <div class="tx-reticle" id="tx-reticle">${reticleSVG()}</div>
    <div class="tx-ground"></div>
  </div>
  <div class="tx-answers" id="tx-answers"></div>
</div>

<!-- END -->
<div id="tx-screen-end" class="tx-screen">
  <div id="tx-end-art"></div>
  <div class="tx-end-title" id="tx-end-title"></div>
  <div class="tx-end-sub" id="tx-end-sub"></div>
  <div class="tx-final-board" id="tx-final-board"></div>
  <div class="tx-end-btns">
    <button class="sym-btn" onclick="Toxotes._again()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Toxotes.close()" data-i18n="exit"></button>
  </div>
</div>`;
    // reticle follows the pointer across the range
    const range=document.getElementById('tx-range'), ret=document.getElementById('tx-reticle');
    range.addEventListener('pointermove', e=>{
      const r=range.getBoundingClientRect();
      ret.style.left=(e.clientX-r.left)+'px'; ret.style.top=(e.clientY-r.top)+'px'; ret.style.opacity='1';
    });
    range.addEventListener('pointerleave', ()=>{ ret.style.opacity='0'; });
  }

  const I18N = {
    subtitle:{ gr:'Τα βέλη της Αρτέμιδος', en:'The Arrows of Artemis' },
    intro:   { gr:'Τέντωσε το τόξο και χτύπησε τους πετούμενους πίθους. Διάλεξε τρόπο παιχνιδιού.', en:'Draw your bow and strike the flying amphorae. Choose a mode of play.' },
    m1:  { gr:'ΕΥΣΤΟΧΗ ΒΟΛΗ', en:'TRUE SHOT' },
    m1d: { gr:'Τέσσερις πίθοι, μία σωστή απάντηση — τόξευσε τη σωστή.', en:'Four amphorae, one right answer — shoot the correct one.' },
    m2:  { gr:'ΟΜΟΒΡΟΝΤΙΑ', en:'VOLLEY' },
    m2d: { gr:'Απάντησε σωστά, μετά 10 δευτερόλεπτα ελεύθερης βολής.', en:'Answer right, then 10 seconds of free shooting.' },
    score:{ gr:'ΠΟΝΤΟΙ', en:'SCORE' },
    again:{ gr:'ΝΕΟ ΠΑΙΧΝΙΔΙ', en:'PLAY AGAIN' },
    exit: { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#tx-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    if (st && st.mode && document.getElementById('tx-screen-game').classList.contains('active')) {
      if (st.phase==='true') renderTrueQuestion(true);
      else if (st.phase==='question') renderVolleyQuestion(true);
      renderHud();
    }
  }
  function show(id){ document.querySelectorAll('#tx-wrap .tx-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen',{id}); }

  /* ───────── start ───────── */
  function _mode(m) { st = { mode:m }; _start(); }
  function _again() { if (st.mode) _start(); else show('tx-screen-intro'); }

  function _start() {
    const m = st.mode;
    cleanup();
    st = {
      mode:m, round:0, score:0, streak:0, answered:false, phase:null, cur:null,
      pool: shuffle([..._gpPool()]), idx:0, timers:[],
      rivals: RIVALS.map(n=>({ name:n, score:0 })),
      done:false,
    };
    show('tx-screen-game');
    document.getElementById('tx-mid').textContent = (m==='true'?T('ΕΥΣΤΟΧΗ ΒΟΛΗ','TRUE SHOT'):T('ΟΜΟΒΡΟΝΤΙΑ','VOLLEY'));
    if (m==='true') nextTrue(); else nextVolley();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }
  function clearRange(){ const r=document.getElementById('tx-range'); r.querySelectorAll('.tx-amphora, .tx-arrow, .tx-pop').forEach(e=>e.remove()); }
  function cleanup(){
    if (!st) return;
    (st.timers||[]).forEach(t=>clearTimeout(t));
    if (st.spawnTimer) clearTimeout(st.spawnTimer);
    if (st.countdown) clearInterval(st.countdown);
    st.timers=[]; st.spawnTimer=null; st.countdown=null; st.volleyActive=false;
    if (st.fallTweens){ st.fallTweens.forEach(t=>{ try{ t && t.kill && t.kill(); }catch(_){} }); st.fallTweens=[]; }
    const r=document.getElementById('tx-range'); if(r) r.querySelectorAll('.tx-amphora, .tx-arrow, .tx-pop').forEach(e=>e.remove());
  }
  function later(fn, ms){ const t=setTimeout(fn, ms); st.timers.push(t); return t; }

  /* ───────── leaderboard ───────── */
  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), score:st.score, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.score-a.score);
    return all;
  }
  function renderHud() {
    if(window.SymStandings) SymStandings.feed('tx', standings(), {key:'score', unit:'πόντοι', accent:'var(--sym-terra)', title:'ΤΟΞΟΤΗΣ'});
    document.getElementById('tx-score').textContent = st.score;
    const total = (st.mode==='true'?ROUNDS_TRUE:ROUNDS_VOLLEY);
    document.getElementById('tx-mid').textContent = T('ΓΥΡΟΣ ','ROUND ')+Math.min(st.round,total)+' / '+total;
    const sEl=document.getElementById('tx-streak');
    if (st.phase==='volley') { sEl.textContent=''; }
    else { sEl.textContent = st.streak>=2 ? T(`ΣΕΡΙ ×${st.streak}`,`STREAK ×${st.streak}`) : ''; sEl.classList.toggle('hot', st.streak>=2); }
  }
  function advanceRivals(strong){ st.rivals.forEach(r=> r.score += (strong? 120+((Math.random()*220)|0) : 50+((Math.random()*120)|0))); }

  /* ───────── shooting visuals ───────── */
  function shootArrow(x, y) {
    const range=document.getElementById('tx-range'); if(!range) return;
    const ar=document.createElement('div'); ar.className='tx-arrow';
    const r=range.getBoundingClientRect();
    const x0=r.width/2, y0=r.height-6;
    const ang=Math.atan2(y-y0, x-x0)*180/Math.PI;
    ar.style.left=x0+'px'; ar.style.top=y0+'px'; ar.style.setProperty('--ang', ang+'deg');
    ar.innerHTML='➤';
    range.appendChild(ar);
    try { ar.animate(
      [{transform:`translate(-50%,-50%) rotate(${ang}deg) translateX(0)`, opacity:1},
       {transform:`translate(-50%,-50%) rotate(${ang}deg) translateX(${Math.hypot(x-x0,y-y0)}px)`, opacity:1}],
      {duration:160, easing:'ease-out'}); } catch(_){}
    later(()=>ar.remove(), 200);
    _fx('shoot');
  }
  function shatter(el, cls) {
    el.classList.add('shatter', cls||'');
    if (window.SymFX) {
      const r=el.getBoundingClientRect();
      SymFX.burst(r.left+r.width/2, r.top+r.height/2, {emoji:['🏺','✦'], count:8, power:8, up:0.4, life:700});
    }
    later(()=>el.remove(), 420);
  }
  function popScore(x, y, txt, cls) {
    const range=document.getElementById('tx-range'); if(!range) return;
    const p=document.createElement('div'); p.className='tx-pop '+(cls||''); p.textContent=txt;
    p.style.left=x+'px'; p.style.top=y+'px'; range.appendChild(p);
    later(()=>p.remove(), 800);
  }
  function localXY(el, range) {
    const er=el.getBoundingClientRect(), rr=range.getBoundingClientRect();
    return [er.left-rr.left+er.width/2, er.top-rr.top+er.height/2];
  }

  /* ═══════════ MODE 1 · TRUE SHOT ═══════════ */
  function nextTrue() {
    if (st.done) return;
    if (st.round>=ROUNDS_TRUE) return end();
    st.phase='true'; st.answered=false; st.cur=getQ(); st.round++;
    killTrueTweens();
    clearRange();
    renderTrueQuestion(false);
    renderHud();
    // amphorae pop in at random spots and slowly drift downward; shoot the right one before they fall off (15s)
    const range=document.getElementById('tx-range');
    const keys=['\u0391','\u0392','\u0393','\u0394'];
    const lanes=shuffle([0,1,2,3]);
    const g=window.gsap;
    st.fallTweens=[];
    st.cur.a.forEach((opt,i)=>{
      const el=document.createElement('button'); el.className='tx-amphora falling';
      const laneW=100/4, x=lanes[i]*laneW + 5 + Math.random()*(laneW-18);
      el.style.left=x.toFixed(1)+'%'; el.style.top='-18%';
      el.innerHTML = amphoraSVG('normal') + `<span class="tx-label"><b>${keys[i]}</b> ${opt}</span>`;
      el.dataset.idx=i;
      el.addEventListener('click', ev=>onTrueHit(ev, el));
      range.appendChild(el);
      const delay=Math.random()*2.2;            // random pop-in time
      if (g) {
        g.fromTo(el, {scale:0, opacity:0, rotate:(Math.random()*40-20)},
                     {scale:1, opacity:1, rotate:0, duration:.5, delay, ease:'back.out(2.2)'});
        st.fallTweens.push(g.to(el, {top:'116%', duration:14.5, delay, ease:'none'}));
        st.fallTweens.push(g.to(el, {rotate:'+=8', duration:2.4, delay, repeat:-1, yoyo:true, ease:'sine.inOut'}));
      } else {
        el.style.opacity='0';
        el.style.transition=`top 14.5s linear ${delay}s, opacity .5s ${delay}s, transform .5s ${delay}s`;
        requestAnimationFrame(()=>{ el.style.opacity='1'; el.style.top='116%'; });
      }
    });
    startTrueTimer(15);
  }
  function startTrueTimer(secs) {
    st.trueEnd=Date.now()+secs*1000;
    if (st.countdown) clearInterval(st.countdown);
    st.countdown=setInterval(()=>{
      const left=Math.max(0,(st.trueEnd-Date.now())/1000);
      const sEl=document.getElementById('tx-streak');
      if (sEl){ sEl.textContent='\u29D7 '+left.toFixed(1)+'s'; sEl.classList.toggle('hot', left<=5); }
      if (left<=0){ clearInterval(st.countdown); st.countdown=null; trueTimeout(); }
    },100);
  }
  function killTrueTweens() {
    if (st.fallTweens){ st.fallTweens.forEach(t=>{ try{ t && t.kill && t.kill(); }catch(_){} }); st.fallTweens=[]; }
    if (st.countdown){ clearInterval(st.countdown); st.countdown=null; }
  }
  function trueTimeout() {
    if (st.answered) return; st.answered=true;
    killTrueTweens(); st.streak=0; advanceRivals(true);
    document.querySelectorAll('#tx-range .tx-amphora').forEach(a=>a.style.pointerEvents='none');
    const right=document.querySelector(`#tx-range .tx-amphora[data-idx="${st.cur.c}"]`);
    if (right) right.classList.add('reveal');
    flashQ(T('\u039f \u03a7\u03a1\u039f\u039d\u039f\u03a3 \u03a4\u0395\u039b\u0395\u0399\u03a9\u03a3\u0395 \u2014 \u03bd\u03b1 \u03b7 \u03c3\u03c9\u03c3\u03c4\u03ae','TIME UP \u2014 there was the mark'),'bad');
    renderHud();
    later(()=>{ st.round>=ROUNDS_TRUE ? end() : nextTrue(); }, 1600);
  }
  function renderTrueQuestion(translateOnly) {
    const bar=document.getElementById('tx-qbar');
    bar.className='tx-qbar';
    bar.innerHTML = `<span class="tx-q-tag">${T('ΤΟΞΕΥΣΕ ΤΗ ΣΩΣΤΗ','SHOOT THE CORRECT')}</span><span class="tx-q-text">${st.cur.q[L()]}</span>`;
    document.getElementById('tx-answers').innerHTML='';
    if (!translateOnly) { /* labels already rebuilt via spawn on fresh round */ }
    else {
      // live re-translate amphora labels
      const keys=['Α','Β','Γ','Δ'];
      document.querySelectorAll('#tx-range .tx-amphora').forEach(el=>{
        const i=+el.dataset.idx; const lab=el.querySelector('.tx-label');
        if (lab && st.cur && st.cur.a[i]!=null) lab.innerHTML=`<b>${keys[i]}</b> ${st.cur.a[i]}`;
      });
    }
  }
  function onTrueHit(ev, el) {
    if (st.answered) return; st.answered=true;
    killTrueTweens();
    const range=document.getElementById('tx-range');
    const rr=range.getBoundingClientRect();
    shootArrow(ev.clientX-rr.left, ev.clientY-rr.top);
    const idx=+el.dataset.idx, correct=idx===st.cur.c;
    advanceRivals(!correct);
    document.querySelectorAll('#tx-range .tx-amphora').forEach(a=>a.style.pointerEvents='none');
    const [lx,ly]=localXY(el, range);
    if (correct) {
      st.streak++; const gain=100 + (st.streak>=2?st.streak*20:0);
      st.score += gain; _fx('correct');
      shatter(el,'good'); popScore(lx,ly,'+'+gain,'good');
      flashQ(T('ΕΥΣΤΟΧΑ!','A TRUE SHOT!'),'ok');
    } else {
      st.streak=0; _fx('wrong');
      shatter(el,'bad'); popScore(lx,ly,T('ΑΣΤΟΧΙΑ','MISS'),'bad');
      // reveal correct amphora
      const right=document.querySelector(`#tx-range .tx-amphora[data-idx="${st.cur.c}"]`);
      if (right) right.classList.add('reveal');
      flashQ(T('ΑΣΤΟΧΙΑ — να η σωστή','MISS — there was the mark'),'bad');
    }
    renderHud();
    later(()=>{ st.round>=ROUNDS_TRUE ? end() : nextTrue(); }, 1500);
  }
  function flashQ(msg, tone) {
    const bar=document.getElementById('tx-qbar');
    bar.className='tx-qbar flash '+(tone==='ok'?'ok':'bad');
    bar.querySelector('.tx-q-tag').textContent=msg;
  }

  /* ═══════════ MODE 2 · VOLLEY ═══════════ */
  function nextVolley() {
    if (st.done) return;
    if (st.round>=ROUNDS_VOLLEY) return end();
    st.phase='question'; st.answered=false; st.cur=getQ(); st.round++;
    clearRange();
    renderVolleyQuestion(false);
    renderHud();
  }
  function renderVolleyQuestion(translateOnly) {
    const bar=document.getElementById('tx-qbar'); bar.className='tx-qbar';
    bar.innerHTML = `<span class="tx-q-tag">${T('ΑΠΑΝΤΗΣΕ ΣΩΣΤΑ','ANSWER CORRECTLY')}</span><span class="tx-q-text">${st.cur.q[L()]}</span>`;
    const wrap=document.getElementById('tx-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='tx-ans';
      b.innerHTML=`<span class="tx-ans-key">${keys[i]}</span><span>${opt}</span>`;
      if (!translateOnly) b.onclick=()=>onVolleyAnswer(i,b);
      else b.onclick=()=>onVolleyAnswer(i,b);
      wrap.appendChild(b);
    });
  }
  function onVolleyAnswer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#tx-answers .tx-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    if (chosen===st.cur.c) {
      st.score += 50; _fx('correct'); btn.classList.add('correct');
      flashQ(T('ΣΩΣΤΟ — ΒΟΛΕΣ!','CORRECT — VOLLEY!'),'ok'); renderHud();
      later(startVolley, 700);
    } else {
      btn.classList.add('wrong'); _fx('wrong'); st.streak=0;
      advanceRivals(true);
      flashQ(T('ΛΑΘΟΣ — χωρίς βολές','WRONG — no volley'),'bad'); renderHud();
      later(()=>{ st.round>=ROUNDS_VOLLEY ? end() : nextVolley(); }, 1400);
    }
  }
  function startVolley() {
    st.phase='volley'; document.getElementById('tx-answers').innerHTML='';
    advanceRivals(false);
    clearRange();
    st.volleyActive=true; st.volleyHits=0;
    st.volleyEnd=Date.now()+VOLLEY_MS;
    st.countdown=setInterval(()=>{
      const left=Math.max(0,(st.volleyEnd-Date.now())/1000);
      const bar=document.getElementById('tx-qbar');
      bar.className='tx-qbar volley';
      bar.innerHTML=`<span class="tx-q-tag">${T('ΒΟΛΗ!','SHOOT!')}</span><span class="tx-timer">${left.toFixed(1)}s</span>`;
      if (left<=0) endVolley();
    },100);
    spawnVolley();
  }
  function spawnVolley() {
    if (!st.volleyActive) return;
    const range=document.getElementById('tx-range'); if(!range){ return; }
    const rect=range.getBoundingClientRect();
    const r=Math.random();
    let type;
    if (r<0.12) type='gold';
    else if (r<0.24) type='cracked';
    else if (r<0.35) type='snake';
    else if (r<0.45) type='curse';
    else type='normal';
    const el=document.createElement('button'); el.className='tx-amphora fly '+type;
    const badge = type==='gold'?'<span class="tx-vbadge gold">\u2605</span>'
                : type==='curse'?'<span class="tx-vbadge">\uD83D\uDC80</span>'
                : type==='snake'?'<span class="tx-vbadge">\uD83D\uDC0D</span>'
                : type==='cracked'?'<span class="tx-vbadge">\u2620</span>' : '';
    el.innerHTML=amphoraSVG(type)+badge;
    const startX = 8+Math.random()*78;
    const dir = Math.random()<0.5?1:-1;
    el.style.left=startX+'%'; el.style.top='100%';
    el.dataset.type=type;
    el.addEventListener('click', ev=>onVolleyHit(ev, el, type));
    range.appendChild(el);
    const peak=rect.height*(0.42+Math.random()*0.34);
    const dx=dir*rect.width*(0.14+Math.random()*0.28);
    try {
      const anim=el.animate([
        {transform:'translate(-50%,0) rotate(0deg)'},
        {transform:`translate(calc(-50% + ${dx*0.5}px),${-peak}px) rotate(${dir*180}deg)`, offset:0.5},
        {transform:`translate(calc(-50% + ${dx}px),${rect.height*0.16}px) rotate(${dir*360}deg)`}
      ], {duration:2100+Math.random()*700, easing:'cubic-bezier(.4,.05,.6,1)'});
      el._anim=anim;
      anim.onfinish=()=>el.remove();
    } catch(_){ later(()=>el.remove(), 2400); }
    st.spawnTimer=setTimeout(spawnVolley, 430+Math.random()*330);
  }
  function onVolleyHit(ev, el, type) {
    if (el._hit) return; el._hit=true; el.style.pointerEvents='none';
    if (el._anim) try{ el._anim.pause(); }catch(_){}
    const range=document.getElementById('tx-range');
    const rr=range.getBoundingClientRect();
    shootArrow(ev.clientX-rr.left, ev.clientY-rr.top);
    const [lx,ly]=localXY(el, range);
    let gain, cls;
    if (type==='gold'){ gain=150; cls='gold'; }
    else if (type==='cracked'){ gain=-40; cls='bad'; }
    else if (type==='snake'){ gain=-60; cls='bad'; }
    else if (type==='curse'){ gain=-100; cls='bad'; }
    else { gain=50; cls='good'; }
    st.score=Math.max(0, st.score+gain); st.volleyHits++;
    shatter(el, cls); popScore(lx,ly,(gain>=0?'+':'')+gain, cls);
    _fx(type==='cracked'?'wrong':'correct');
    renderHud();
  }
  function endVolley() {
    st.volleyActive=false;
    if (st.countdown) clearInterval(st.countdown); st.countdown=null;
    if (st.spawnTimer) clearTimeout(st.spawnTimer); st.spawnTimer=null;
    clearRange();
    flashQ(T(`ΟΜΟΒΡΟΝΤΙΑ: ${st.volleyHits} βολές`,`VOLLEY: ${st.volleyHits} hits`),'ok');
    later(()=>{ st.round>=ROUNDS_VOLLEY ? end() : nextVolley(); }, 1300);
  }

  /* ───────── end ───────── */
  function end() {
    st.done=true; cleanup();
    show('tx-screen-end');
    const board=standings();
    const won=board[0].me;
    _fx(won?'win':'lose');
    document.getElementById('tx-end-art').innerHTML = bowSVG('tx-end-bow');
    const title=document.getElementById('tx-end-title'), sub=document.getElementById('tx-end-sub');
    // medal by score
    const medal = st.score>=900?'🥇':st.score>=500?'🥈':'🥉';
    if (won) {
      title.innerHTML=T('ΑΡΙΣΤΟΤΟΞΟΣ '+medal,'MASTER ARCHER '+medal); title.className='tx-end-title win';
      sub.textContent=T('Το βέλος σου δεν αστόχησε. Η Άρτεμις σε καμαρώνει.','Your arrow never strayed. Artemis is proud.');
    } else {
      title.innerHTML=T('ΤΟ ΤΟΞΟ ΑΝΑΠΑΥΕΤΑΙ '+medal,'THE BOW RESTS '+medal); title.className='tx-end-title lose';
      sub.textContent=T(`Σημείωσες ${st.score} πόντους, στη ${board.findIndex(x=>x.me)+1}η θέση. Πρώτος: ${board[0].name}.`,`You scored ${st.score} points, in position ${board.findIndex(x=>x.me)+1}. First: ${board[0].name}.`);
    }
    document.getElementById('tx-final-board').innerHTML = board.map((x,i)=>
      `<div class="tx-final-row${x.me?' me':''}"><span class="tx-final-pos">${i+1}</span><span class="tx-final-name">${x.name}${i===0?' 🏆':''}</span><span class="tx-final-s">${x.score}</span></div>`
    ).join('');
  }

  /* ───────── art ───────── */
  function bowSVG(cls){ return `<svg class="${cls}" viewBox="0 0 120 130" fill="none">
    <defs><linearGradient id="tx-b1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E59A7E"/><stop offset="1" stop-color="#9E3B2E"/></linearGradient></defs>
    <path d="M40 12C84 30 84 100 40 118" stroke="url(#tx-b1)" stroke-width="6" fill="none" stroke-linecap="round"/>
    <path d="M40 12L40 118" stroke="#E0D6C4" stroke-width="2"/>
    <path d="M40 65L96 65" stroke="#5A4226" stroke-width="3"/>
    <path d="M96 65l-12-6m12 6l-12 6" stroke="#5A4226" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M40 65l-8 0" stroke="#5A4226" stroke-width="3"/>
    <g fill="#C4A448"><path d="M96 65l10-4-4 4 4 4z"/></g>
  </svg>`; }
  function reticleSVG(){ return `<svg viewBox="0 0 44 44" fill="none"><circle cx="22" cy="22" r="16" stroke="#E59A7E" stroke-width="2" opacity="0.8"/><path d="M22 2v10M22 32v10M2 22h10M32 22h10" stroke="#E59A7E" stroke-width="2" stroke-linecap="round"/><circle cx="22" cy="22" r="2" fill="#E59A7E"/></svg>`; }
  function amphoraSVG(type){
    const body = type==='gold' ? 'url(#tx-amg)' : type==='cracked' ? '#6B4A38' : type==='curse' ? '#33272C' : type==='snake' ? 'url(#tx-ams)' : 'url(#tx-amn)';
    const crack = (type==='cracked'||type==='curse') ? `<path d="M52 36l-6 12 8 8-6 14" stroke="#1E120A" stroke-width="2" fill="none"/>` : '';
    return `<svg class="tx-amphora-svg" viewBox="0 0 96 116" fill="none">
      <defs>
        <linearGradient id="tx-amn" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#B5683E"/><stop offset="1" stop-color="#7A3E22"/></linearGradient>
        <linearGradient id="tx-amg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E3C766"/><stop offset="1" stop-color="#9A7E2A"/></linearGradient>
        <linearGradient id="tx-ams" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7E9E5C"/><stop offset="1" stop-color="#3E5A2C"/></linearGradient>
      </defs>
      <path d="M34 10h28l-4 8c11 6 18 18 18 33 0 27-15 56-32 56S12 78 12 51c0-15 7-27 18-33z" fill="${body}" stroke="#2E1A10" stroke-width="3"/>
      <path d="M30 24h36" stroke="#2E1A10" stroke-width="3"/>
      <path d="M34 10c-7-2-12-7-12-10M62 10c7-2 12-7 12-10" stroke="#2E1A10" stroke-width="3" fill="none"/>
      <ellipse cx="48" cy="58" rx="20" ry="9" fill="none" stroke="#F0D9B8" stroke-width="2" opacity="0.45"/>
      ${crack}
    </svg>`;
  }

  return { open, close, _mode, _again, syncLang };
})();
window.Toxotes = Toxotes;

/* ── Games-Panel entry points ── */
window.openToxotes  = function(gp){ Toxotes.open(gp || {}); };
window.closeToxotes = function(){ Toxotes.close(); };
