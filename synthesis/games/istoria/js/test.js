/* ════════════════════════════════════════════════════════════════════
   test.js — window.TT: Τεστ + Διαγώνισμα (timed, mixed, AI-graded)
   Both are the same engine over different banks:
     • Τεστ        → ISTORIA.getMethods(course).test  (shuffle bank, length 6/10)
     • Διαγώνισμα  → ISTORIA.getMethods(course).diagonisma (fixed items)
   Σ/Λ items are auto-graded; written items (ορισμός/σύντομη ανάπτυξη) go
   through SK.grade(). Themed by the panel's global ΑΤΛΑΣ⇄ΑΓΩΝ toggle.
   Screen #tt-exam lives in index.html. Requires study-kit.js + hub.js.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  const $  = (s,r=document)=>r.querySelector(s);
  const ICON=(n)=>`<span class="ico">${SYM.icon(n)}</span>`;
  const esc=(s)=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  let COURSE='g3';
  let MODE='test', ITEMS=[], picks={}, left=0, timer=null, submitted=false, LEN=6;

  function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]];}return a;}

  function open(mode){
    MODE=mode; submitted=false; picks={}; clearInterval(timer);
    show('tt-exam'); renderShell(); openOverlay();
  }
  function show(scr){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on')); $('#'+scr).classList.add('on'); window.scrollTo({top:0,behavior:'instant'}); }

  function cfg(){
    const M=ISTORIA.getMethods(COURSE)||{};
    return MODE==='diag'
      ? { title:'Διαγώνισμα', ds:'Μικτό, με χρόνο — όπως στις Πανελλαδικές. Στο τέλος ο AI βαθμολογεί.', src:M.diagonisma||{duration:900,items:[]} }
      : { title:'Τεστ Ιστορίας', ds:'Μικτό, με χρόνο — ο AI βαθμολογεί νόημα, όχι λέξεις.', src:M.test||{duration:1200,bank:[]} };
  }

  function renderShell(){
    const c=cfg();
    $('#tt-exam').innerHTML = `<div class="sk-wrap">
      <div class="tt-bar">
        <div class="sk-badge">${ICON('lyre')}</div>
        <div><h1>${esc(c.title)}</h1><div class="ds">${esc(c.ds)}</div></div>
        <button class="back" style="margin-left:auto" onclick="HUB.goHub()">← Κατάλογος</button>
        <div class="timer" id="tt-timer"><span class="ico">${SYM.icon('flame')}</span><span id="tt-tt">00:00</span></div>
      </div>
      <div id="tt-total"></div>
      <div id="tt-paper"></div>
      <div class="tt-actions">
        <button class="btn primary" id="tt-submit" onclick="TT.submitAll()"><span class="ico">${SYM.icon('owl')}</span> Υποβολή & βαθμολόγηση</button>
        <button class="btn ghost" onclick="TT.open('${MODE}')">Νέο</button>
        <div class="sk-think" id="tt-think" style="margin:0;"><span class="sk-spin"></span> Ο βοηθός βαθμολογεί όλο το τεστ…</div>
      </div>
    </div>
    <div class="ov" id="tt-ov"></div>`;
  }

  function openOverlay(){
    const c=cfg();
    const lenRow = MODE==='test' ? `
      <div class="ov-dir"><div class="l">Μήκος</div>
        <div class="len-row" id="tt-len">
          <button data-n="6" class="on" onclick="TT.setLen(6,this)">Σύντομο · 6</button>
          <button data-n="10" onclick="TT.setLen(10,this)">Πλήρες · 10</button>
        </div>
      </div>` : '';
    const info = MODE==='diag'
      ? `${(c.src.items||[]).length} ερωτήσεις · ${Math.round((c.src.duration||0)/60)} λεπτά · μικτοί τύποι.`
      : `Μικτοί τύποι (ορισμοί, Σ/Λ, σύντομη ανάπτυξη) από όλη την ύλη.`;
    $('#tt-ov').innerHTML = `<div class="ov-card">
      <div class="ic ico">${SYM.icon('lyre')}</div>
      <h2>${MODE==='diag'?'Έτοιμος;':'Τεστ Ιστορίας'}</h2>
      <p>${esc(info)}</p>
      ${lenRow}
      <button class="btn primary" style="margin:0 auto;" onclick="TT.start()">${MODE==='diag'?'Ξεκίνα το διαγώνισμα':'Ξεκίνα το τεστ'}</button>
    </div>`;
    $('#tt-ov').style.display='grid';
  }
  function setLen(n,btn){ LEN=n; document.querySelectorAll('#tt-len button').forEach(b=>b.classList.remove('on')); btn.classList.add('on'); }

  function start(){
    const c=cfg();
    if(MODE==='diag'){ ITEMS=(c.src.items||[]).slice(); left=c.src.duration||900; }
    else { ITEMS=shuffle(c.src.bank||[]).slice(0,LEN); left=Math.round((c.src.duration||1200)*LEN/12); }
    submitted=false; picks={};
    $('#tt-ov').style.display='none';
    renderPaper(); updTimer();
    timer=setInterval(()=>{ left--; updTimer(); if(left<=0){ clearInterval(timer); submitAll(); } },1000);
  }

  function itemView(it){
    const ty = it.type==='orismos'?'Ορισμός':it.type==='sl'?'Σωστό / Λάθος':'Σύντομη ανάπτυξη';
    let q, gq;
    if(it.type==='sl'){ q=esc(it.claim); gq=null; }
    else if(it.type==='orismos'){ q = it.term?('Δώσε τον ορισμό: <b>'+esc(it.term)+'</b>'):esc(it.q); gq = it.term?('Δώσε τον ορισμό: '+it.term):it.q; }
    else { q=esc(it.q); gq=it.q; }
    return {ty,q,gq};
  }

  function renderPaper(){
    $('#tt-paper').innerHTML = ITEMS.map((it,i)=>{
      const v=itemView(it);
      const input = it.type==='sl'
        ? `<div class="sk-choice tt-choice" data-i="${i}"><button class="sk-tf t" onclick="TT.pickSL(${i},true,this)">✓ ΣΩΣΤΟ</button><button class="sk-tf f" onclick="TT.pickSL(${i},false,this)">✕ ΛΑΘΟΣ</button></div>`
        : `<textarea data-i="${i}" placeholder="Η απάντησή σου…"></textarea>`;
      return `<div class="item"><div class="h"><span class="num">${esc(it.n||(i+1))}</span><span class="ty">${v.ty}</span><span class="un">${esc(it.unit||'')}</span></div>
        <div class="q">${v.q}</div>${input}<div class="res" id="tt-res${i}"></div></div>`;
    }).join('');
  }
  function pickSL(i,v,btn){ if(submitted)return; picks[i]=v; btn.parentNode.querySelectorAll('.sk-tf').forEach(b=>b.classList.remove('sel')); btn.classList.add('sel'); }

  function updTimer(){
    const m=Math.floor(Math.max(0,left)/60), s=((left%60)+60)%60;
    $('#tt-tt').textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    $('#tt-timer').classList.toggle('warn', left<=60);
  }

  async function submitAll(){
    if(submitted)return; submitted=true; clearInterval(timer);
    $('#tt-submit').disabled=true; $('#tt-think').classList.add('on');
    const scores=[];
    for(let i=0;i<ITEMS.length;i++){
      const it=ITEMS[i], res=$('#tt-res'+i); res.classList.add('on'); let sc, html;
      if(it.type==='sl'){
        const ch=picks[i], ok=(ch===it.ans); sc=ok?100:0;
        const col=ok?'var(--sage)':'var(--terra)';
        html=`<div class="rline"><span class="chipscore" style="background:${col}">${ok?'Σωστό':'Λάθος'}</span><span class="rfb">${ch===undefined?'Δεν απάντησες.':(ok?'Σωστή επιλογή.':'Λάθος επιλογή.')} Σωστό: «${it.ans?'Σωστό':'Λάθος'}».</span></div>`;
      } else {
        const v=itemView(it), ta=$(`#tt-paper textarea[data-i="${i}"]`), ans=(ta?ta.value:'').trim();
        if(ans.length<4){ sc=0; html=`<div class="rline"><span class="chipscore" style="background:var(--terra)">0</span><span class="rfb">Δεν απάντησες.</span></div><div class="rmod"><b>ΕΝΔΕΙΚΤΙΚΗ</b><br>${esc(it.model)}</div>`; }
        else{
          const r=await SK.grade({question:v.gq, model:it.model, points:it.points, answer:ans});
          sc=Math.max(0,Math.min(100,r.score|0));
          html=`<div class="rline"><span class="chipscore" style="background:${SK.scoreColor(sc)}">${sc}/100</span><span class="rfb">${esc(r.feedback)}</span></div>`+
               ((r.missed&&r.missed.length)?`<div class="rmiss">Έλειπαν: ${r.missed.map(esc).join(' · ')}</div>`:'')+
               `<div class="rmod"><b>ΕΝΔΕΙΚΤΙΚΗ</b><br>${esc(it.model)}</div>`;
        }
      }
      scores.push(sc); res.innerHTML=html;
    }
    const avg=Math.round(scores.reduce((a,b)=>a+b,0)/(scores.length||1));
    const msg=avg>=85?'Άριστα — είσαι έτοιμος.':avg>=65?'Πολύ καλά, με περιθώρια.':avg>=50?'Καλή βάση — συνέχισε.':'Χρειάζεται περισσότερη μελέτη.';
    $('#tt-total').innerHTML=`<div class="total"><div><div class="lab">Βαθμολογία</div><div class="big" style="color:${SK.scoreColor(avg)}">${avg}<span style="font-size:.4em;color:var(--stone)">/100</span></div></div>
      <div><div class="msg">${msg}</div><div style="font-family:var(--f-mono);font-size:11px;color:var(--stone);margin-top:6px;">${scores.filter(s=>s>=50).length}/${scores.length} ερωτήσεις σε καλό επίπεδο</div></div></div>`;
    $('#tt-total').scrollIntoView({behavior:'smooth',block:'start'});
    $('#tt-think').classList.remove('on'); $('#tt-submit').disabled=false;
    $('#tt-timer').innerHTML='<span class="ico">'+SYM.icon('owl')+'</span> ολοκληρώθηκε';
  }

  function init(course){ COURSE = course || (window.HUB && HUB.course) || 'g3'; }
  function hasExams(){ const M=ISTORIA.getMethods(COURSE)||{}; return !!((M.test&&(M.test.bank||[]).length)||(M.diagonisma&&(M.diagonisma.items||[]).length)); }

  window.TT = { init, open, start, setLen, pickSL, submitAll, hasExams, get mode(){return MODE;} };
})();
