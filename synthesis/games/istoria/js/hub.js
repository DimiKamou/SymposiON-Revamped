/* ════════════════════════════════════════════════════════════════════
   hub.js — the reimagined Ιστορία hub + 7 exercise modes
   ONE renderer, data-driven by ISTORIA (the data layer). The look (museum
   ΑΤΛΑΣ vs arena ΑΓΩΝ) is entirely CSS via the body class; this file is
   theme-agnostic. Exposes window.HUB.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  const ICON = (n)=>`<span class="ico">${SYM.icon(n)}</span>`;
  const $ = (s,r=document)=>r.querySelector(s);
  const esc = (s)=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  const MODES = [
    {id:'mc',   ico:'stele',  gr:'Πολλαπλής Επιλογής', en:'Multiple Choice', c:'#E0894C', meta:'Μία σωστή από τέσσερις.'},
    {id:'match',ico:'mosaic', gr:'Αντιστοίχιση',       en:'Matching',        c:'#5E8B96', meta:'Ένωσε όρο με ορισμό.'},
    {id:'fc',   ico:'amphora',gr:'Κάρτες Μνήμης',      en:'Flashcards',      c:'#D2B36A', meta:'Λήμμα κι ερμηνεία.'},
    {id:'tl',   ico:'column', gr:'Χρονολόγιο',         en:'Timeline',        c:'#7caab4', meta:'Τοποθέτησε στον χρόνο.'},
    {id:'tf',   ico:'coin',   gr:'Σωστό / Λάθος',      en:'True / False',    c:'#e0694c', meta:'Η κρίση σου, μία ψήφος.'},
    {id:'fib',  ico:'chisel', gr:'Συμπλήρωση',         en:'Fill the gap',    c:'#D2B36A', meta:'Συμπλήρωσε το κενό.'},
    {id:'vid',  ico:'theatre',gr:'Βίντεο + Ερωτήσεις', en:'Video',           c:'#E0894C', meta:'Παρακολούθησε & απάντησε.'},
  ];

  let COURSE = 'g3';
  let CUR_UNIT = null;
  const idx = {};   // per-mode current index

  function units(){ return ISTORIA.getUnits(COURSE); }
  function unit(){ return units().find(u=>u.id===CUR_UNIT) || units()[0]; }
  function modeData(mode){ return ISTORIA.getModeData(COURSE, CUR_UNIT, mode); }

  /* ── hub ──────────────────────────────────────────────────────────── */
  function renderHub(){
    const us = units();
    if (!CUR_UNIT && us.length) CUR_UNIT = us[0].id;
    $('#units').innerHTML = us.map(u=>`
      <button class="unit ${u.id===CUR_UNIT?'on':''}" onclick="HUB.pickUnit('${u.id}')">
        <div class="rn">${u.rn||''}</div>
        <h3>${esc(u.t)}</h3>
        <p>${esc(u.p||'')}</p>
        <div class="mini"><i style="width:${u.pct||0}%"></i></div>
        <div class="cnt">${(u.en||'').toUpperCase()}${u.cnt?' · '+esc(u.cnt):''}</div>
      </button>`).join('');
    $('#modes').innerHTML = MODES.map(m=>`
      <button class="mode" style="--c:${m.c}" onclick="HUB.openMode('${m.id}')">
        <span class="glow"></span>${ICON(m.ico)}
        <div><div class="gr">${esc(m.gr)}</div><div class="en">${m.en}</div></div>
        <div class="meta">${esc(m.meta)}</div>
      </button>`).join('');
    renderAISection();
  }

  // §Γ — AI-graded written methods (shown only when the course ships them)
  function renderAISection(){
    const sec=$('#ai-sec'), grid=$('#aimodes');
    if(!sec||!grid) return;
    const meta=ISTORIA.getMeta(COURSE);
    const ids=(window.MT && MT.available) ? MT.available() : [];
    if(meta.hasAI && ids.length){
      sec.style.display=''; grid.style.display='';
      grid.innerHTML = ids.map(id=>{ const d=MT.METHODS[id];
        return `<button class="mode" style="--c:#9C8238" onclick="MT.open('${id}')">
          <span class="glow"></span>${ICON(d.badge)}
          <div><div class="gr">${esc(d.title)}</div><div class="en">AI · σημασιολογικός έλεγχος</div></div>
          <div class="meta">${esc(d.ds)}</div>
        </button>`; }).join('');
    } else { sec.style.display='none'; grid.style.display='none'; }

    // §Δ — timed exams (Τεστ / Διαγώνισμα)
    const esec=$('#exam-sec'), egrid=$('#exammodes');
    if(esec && egrid){
      if(meta.hasAI && window.TT && TT.hasExams()){
        esec.style.display=''; egrid.style.display='';
        const cards=[
          {ico:'lyre',  gr:'Τεστ Ιστορίας', mode:'test', meta:'Μικτό & χρονομετρημένο — διάλεξε μήκος.'},
          {ico:'column',gr:'Διαγώνισμα',     mode:'diag', meta:'Όπως στις Πανελλαδικές — με συνολική βαθμολογία.'},
        ];
        egrid.innerHTML = cards.map(c=>`<button class="mode" style="--c:#C5572F" onclick="TT.open('${c.mode}')">
          <span class="glow"></span>${ICON(c.ico)}
          <div><div class="gr">${esc(c.gr)}</div><div class="en">AI · με χρόνο</div></div>
          <div class="meta">${esc(c.meta)}</div></button>`).join('');
      } else { esec.style.display='none'; egrid.style.display='none'; }
    }
  }
  function pickUnit(id){ CUR_UNIT=id; renderHub(); }

  /* ── navigation ───────────────────────────────────────────────────── */
  function show(id){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on')); $('#'+id).classList.add('on'); window.scrollTo({top:0,behavior:'instant'}); }
  function goHub(){ renderHub(); show('hub'); }

  function head(m, prog){
    const u = unit();
    return `<div class="wrap">
      <div class="topbar">
        <button class="back" onclick="HUB.goHub()">← Κατάλογος</button>
        <span class="crumb">${esc((u.t||'').toUpperCase())} &nbsp;/&nbsp; <b>${esc(m.gr)}</b></span>
      </div>
      <div class="mode-head" style="--c:${m.c}">
        <div class="badge">${ICON(m.ico)}</div>
        <div><div class="ttl">${esc(m.gr)}</div><div class="ds">${esc(m.meta)}</div></div>
        <div class="progress">${prog}</div>
      </div>`;
  }

  function openMode(id){ idx[id]=0; renderMode(id); show('m-'+id); }
  function renderMode(id){
    const m = MODES.find(x=>x.id===id);
    $('#m-'+id).innerHTML = RENDER[id](m);
  }
  function nextItem(id){ idx[id]=(idx[id]||0)+1; renderMode(id); }

  /* ── per-mode renderers ───────────────────────────────────────────── */
  const RENDER = {
    mc(m){
      const arr = modeData('mc')||[]; const i = Math.min(idx.mc||0, Math.max(0,arr.length-1));
      if(!arr.length) return head(m,'—')+emptyBody();
      const q = arr[i];
      return head(m,`<b>${i+1}</b>/${arr.length} ερωτήσεις`)+`
        <div class="q-stele">
          <div class="qn">ΕΡΩΤΗΣΗ ${String(i+1).padStart(2,'0')}</div>
          <div class="qt">${esc(q.q)}</div>
          <div class="opts">
            ${q.opts.map((o,k)=>`<button class="opt" onclick="HUB.mcPick(this,${k},${q.ans})"><span class="ltr">${'ΑΒΓΔ'[k]}</span>${esc(o)}</button>`).join('')}
          </div>
          <div class="next-row" id="mc-next"></div>
        </div></div>`;
    },
    match(m){
      const arr = (modeData('match')||[]).slice(0,5);
      if(!arr.length) return head(m,'—')+emptyBody();
      const rights = arr.map((p,i)=>({p,i})).sort(()=>Math.random()-.5);
      return head(m,`<b>0</b>/${arr.length} ζεύγη`)+`
        <div class="match">
          <div class="mcol"><span class="lab">Όροι</span>
            ${arr.map((p,i)=>`<button class="tile term" data-k="${i}" onclick="HUB.mSel(this,'L',${i})">${esc(p.left)}</button>`).join('')}
          </div>
          <div class="mcol"><span class="lab">Ορισμοί</span>
            ${rights.map(({p,i})=>`<button class="tile" data-k="${i}" onclick="HUB.mSel(this,'R',${i})">${esc(p.right)}</button>`).join('')}
          </div>
        </div></div>`;
    },
    fc(m){
      const arr = modeData('fc')||[]; const i = Math.min(idx.fc||0, Math.max(0,arr.length-1));
      if(!arr.length) return head(m,'—')+emptyBody();
      const c = arr[i];
      return head(m,`<b>${i+1}</b>/${arr.length} κάρτες`)+`
        <div class="fc-stage">
          <div class="fc" id="fcCard" onclick="this.classList.toggle('flip')">
            <div class="fc-face fc-front"><div class="fc-tag">Λήμμα · Όρος</div><div class="lemma" style="margin-top:14px;">${esc(c.front)}</div><div class="fc-corner">πάτησε για ερμηνεία ↻</div></div>
            <div class="fc-face fc-back"><div class="fc-tag">Ερμηνεία</div><div class="fc-def">${esc(c.back)}</div><div class="fc-corner">№ ${String(i+1).padStart(2,'0')} / ${String(arr.length).padStart(2,'0')}</div></div>
          </div>
        </div>
        <div class="fc-nav"><button class="cbtn" onclick="HUB.fcStep(-1)">←</button><span class="fc-count">${String(i+1).padStart(2,'0')} — ${String(arr.length).padStart(2,'0')}</span><button class="cbtn" onclick="HUB.fcStep(1)">→</button></div>
      </div>`;
    },
    tl(m){
      const ev = [...(modeData('tl')||[])].sort((a,b)=>a.year-b.year);
      if(!ev.length) return head(m,'—')+emptyBody();
      return head(m,'<b>χρονικά</b> ταξινομημένο')+`
        <p style="font-family:var(--f-quote);font-style:italic;font-size:17px;color:var(--ink-soft);margin:0 0 6px;">Τα γεγονότα ταξινομημένα κατά μήκος της ζωφόρου, στη σωστή χρονική σειρά.</p>
        <div class="frieze"><div class="band"></div></div>
        <div class="tl-row">
          ${ev.map((e,i)=>`<div class="tl-card"><span class="dot"></span><span class="seq">${i+1}</span><div class="yr">${e.year}</div><div class="ev">${esc(e.event)}</div></div>`).join('')}
        </div></div>`;
    },
    tf(m){
      const arr = modeData('tf')||[]; const i = Math.min(idx.tf||0, Math.max(0,arr.length-1));
      if(!arr.length) return head(m,'—')+emptyBody();
      const t = arr[i];
      return head(m,`<b>${i+1}</b>/${arr.length} κρίσεις`)+`
        <div class="verdict-q">
          <div class="claim">${esc(t.claim)}</div>
          <div class="tf-row">
            <button class="tf t" onclick="HUB.tfPick(this,true,${!!t.ans})"><span class="g">✓</span> ΣΩΣΤΟ</button>
            <button class="tf f" onclick="HUB.tfPick(this,false,${!!t.ans})"><span class="g">✕</span> ΛΑΘΟΣ</button>
          </div>
          <div class="next-row" id="tf-next" style="text-align:center;"></div>
        </div></div>`;
    },
    fib(m){
      const arr = modeData('fib')||[]; const i = Math.min(idx.fib||0, Math.max(0,arr.length-1));
      if(!arr.length) return head(m,'—')+emptyBody();
      const f = arr[i];
      return head(m,`<b>${i+1}</b>/${arr.length} κενά`)+`
        <div class="inscr">
          <div class="lac-h">ΕΠΙΓΡΑΦΗ — ΣΥΜΠΛΗΡΩΣΕ ΤΟ ΚΕΝΟ</div>
          <div class="text">${esc(f.before)}<span class="lac empty" id="lacuna">${esc(f.answer)}</span>${esc(f.after)}</div>
        </div>
        <div class="bank">
          ${f.bank.map(b=>`<button class="chip" onclick="HUB.fillLac(this,'${esc(b).replace(/'/g,"\\'")}','${esc(f.answer).replace(/'/g,"\\'")}')">${esc(b)}</button>`).join('')}
        </div>
        <div class="next-row" id="fib-next" style="text-align:center;margin-top:18px;"></div></div>`;
    },
    vid(m){
      const v = modeData('vid');
      if(!v) return head(m,'—')+emptyBody();
      const yt = (v.url||'').match(/(?:youtu\.be\/|[?&]v=|embed\/)([\w-]{11})/);
      const screen = yt
        ? `<div class="stage" style="aspect-ratio:16/9"><iframe src="https://www.youtube.com/embed/${yt[1]}" title="${esc(v.title)}" allowfullscreen style="width:100%;height:100%;border:0;display:block;"></iframe></div>`
        : `<div class="stage"><div class="play"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 3l16 9-16 9z"/></svg></div></div><div class="scrub"><i></i></div>`;
      return head(m,'<b>'+esc((v.desc||'').split('·')[0].trim())+'</b> διάρκεια')+`
        <div class="theatre">
          <div class="player">
            ${screen}
            <div class="meta"><div class="t">${esc(v.title)}</div><div class="d">${esc(v.desc)}</div></div>
          </div>
          <div class="compre">
            <span class="lab">Ερωτήσεις κατανόησης</span>
            ${(v.q||[]).map(q=>`<div class="cq"><span class="ts">${esc(q.ts)}</span> &nbsp;${esc(q.q)}</div>`).join('')}
          </div>
        </div></div>`;
    },
  };
  function emptyBody(){ return `<div class="wrap"><div class="empty-mode">Δεν υπάρχει ακόμη περιεχόμενο για αυτή την ενότητα.<br>Πρόσθεσέ το από τη <b>Διαχείριση Περιεχομένου</b>.</div></div>`; }
  function nextBtn(id,label){ return `<button class="btn ghost" style="margin-top:16px;" onclick="HUB.nextItem('${id}')">${label} →</button>`; }

  /* ── interactions ─────────────────────────────────────────────────── */
  function mcPick(el, k, ans){
    const box = el.closest('.opts'); if(box.dataset.done) return; box.dataset.done=1;
    const opts=[...box.children]; opts.forEach(b=>b.style.pointerEvents='none');
    el.classList.add(k===ans?'ok':'bad');
    if(k!==ans) opts[ans].classList.add('ok');
    const arr = modeData('mc')||[]; const i=idx.mc||0;
    if(i < arr.length-1) $('#mc-next').innerHTML = nextBtn('mc','Επόμενη');
  }
  let mPick=null;
  function mSel(el,side,k){
    if(el.classList.contains('done'))return;
    if(!mPick){ mPick={el,side,k}; el.classList.add('sel'); return; }
    if(mPick.side===side){ mPick.el.classList.remove('sel'); mPick={el,side,k}; el.classList.add('sel'); return; }
    if(mPick.k===k){
      el.classList.add('done'); mPick.el.classList.add('done'); el.classList.remove('sel'); mPick.el.classList.remove('sel');
      if(!el.querySelector('.pin')) el.insertAdjacentHTML('afterbegin','<span class="pin">✓</span>');
      const total=document.querySelectorAll('.tile.term').length, done=document.querySelectorAll('.tile.term.done').length;
      const prog=document.querySelector('#m-match .progress'); if(prog) prog.innerHTML=`<b>${done}</b>/${total} ζεύγη`;
    } else {
      const a=mPick.el; el.classList.add('sel');
      setTimeout(()=>{el.classList.remove('sel');a.classList.remove('sel');},420);
    }
    mPick=null;
  }
  function fcStep(d){
    const arr=modeData('fc')||[]; if(!arr.length)return;
    idx.fc=((idx.fc||0)+d+arr.length)%arr.length; renderMode('fc');
  }
  function tfPick(el,choice,ans){
    const row=el.closest('.tf-row'); if(row.dataset.done)return; row.dataset.done=1;
    [...row.children].forEach(b=>b.style.pointerEvents='none');
    const correct = (choice===ans);
    el.classList.add(correct?'picked-ok':'picked-bad');
    const arr=modeData('tf')||[]; const i=idx.tf||0;
    const fb = `<p style="font-family:var(--f-quote);font-style:italic;font-size:17px;margin-top:16px;color:${correct?'var(--sage)':'var(--terra)'}">${correct?'Σωστά!':'Όχι — σωστό ήταν «'+(ans?'Σωστό':'Λάθος')+'».'}</p>`;
    $('#tf-next').innerHTML = fb + (i<arr.length-1 ? nextBtn('tf','Επόμενη') : '');
  }
  function fillLac(el,val,ans){
    const lac=$('#lacuna'); if(!lac)return; lac.textContent=val; lac.classList.remove('empty');
    document.querySelectorAll('.chip').forEach(c=>c.classList.remove('used'));
    el.classList.add('used');
    const ok = (val===ans);
    lac.style.color = ok?'var(--sage)':'var(--terra)';
    lac.style.borderColor = ok?'var(--sage)':'var(--terra)';
    const arr=modeData('fib')||[]; const i=idx.fib||0;
    $('#fib-next').innerHTML = (ok && i<arr.length-1) ? nextBtn('fib','Επόμενο') : '';
  }

  /* ── boot ─────────────────────────────────────────────────────────── */
  function init(course){
    COURSE = course || ISTORIA.resolveCourse();
    const meta = ISTORIA.getMeta(COURSE);
    const mast = $('#mast');
    if(mast){
      // H1 wordmark (ΑΤΛΑΣ/ΑΓΩΝ) is set by app.setDir per direction
      mast.querySelector('.kicker').textContent = meta.kicker||'';
      mast.querySelector('.sub').textContent = (meta.title||'') + (meta.subtitle?(' — '+meta.subtitle):'');
      mast.querySelector('.cat').textContent = meta.category||'';
    }
    renderHub();
  }

  window.HUB = { init, renderHub, pickUnit, openMode, goHub, nextItem, mcPick, mSel, fcStep, tfPick, fillLac, get course(){return COURSE;} };
})();
