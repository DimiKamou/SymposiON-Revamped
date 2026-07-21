/* ════════════════════════════════════════════════════════════════════
   study.js — engine for «Διδαγμένο Κείμενο», Αρχαία Γ' Λυκείου
   Consumes window.GNWSTO.units (each data/eNN.js pushes one unit).
   Features: ancient/modern translation toggle; verbatim book comments;
   ερμηνευτική; REFRESHABLE generated λεξιλογικά-ετυμολογικά (from etymBank,
   both directions incl. "locate the cognate in the text"); refreshable
   ερμηνευτικές & κατανόηση drawn from banks; admin overrides (localStorage).
   Zero dependencies.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  const G = window.GNWSTO = window.GNWSTO || { units:[] };
  const $  = (s,r)=> (r||document).querySelector(s);
  const $$ = (s,r)=> Array.from((r||document).querySelectorAll(s));
  const el = (tag,cls,html)=>{ const n=document.createElement(tag); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n; };
  const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  /* lenient Greek comparison: strip diacritics/case, normalise final sigma */
  function norm(s){
    return String(s||'').toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g,'')
      .replace(/ς/g,'σ')
      .replace(/[^Ͱ-Ͽἀ-῿a-z0-9]/g,'').trim();
  }
  const matches = (val, accept)=> (accept||[]).some(a => norm(a)===norm(val));

  /* random helpers (browser Math.random is fine here) */
  function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  const sample = (a,n)=> shuffle(a).slice(0,n);
  const pick = a => a[Math.floor(Math.random()*a.length)];

  const ADMIN_KEY = 'gnwsto.admin';
  const LAST_KEY  = 'gnwsto.last';
  const EXAM_KEY  = 'gnwsto.examOnly';
  // Εξεταστέα ύλη 2026 (ΥΠΑΙΘΑ, ΔΙΔΑΓΜΕΝΟ ΚΕΙΜΕΝΟ): κείμενα αναφοράς Α.1–Ε.18 + ΣΤ.21.
  // Εκτός: 19 (Πολιτικά Δ – δημοκρατία), 20 (Επίκτητος), 22 (Μάρκος Αυρήλιος).
  const EXAM_2026 = new Set([1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,21]);
  let examOnly = true, searchQ = '';

  /* merge admin overrides (localStorage) into the base units */
  function applyOverrides(){
    let ov={};
    try{ ov = JSON.parse(localStorage.getItem(ADMIN_KEY)||'{}'); }catch(e){}
    G.units.forEach(u=>{
      const o = ov[u.id]; if(!o) return;
      Object.keys(o).forEach(k=>{ u[k] = o[k]; });   // arrays/strings fully replace
    });
  }

  /* ── sidebar ── */
  function buildSidebar(){
    const nav = $('#nav'); nav.innerHTML='';
    // εξεταστέα-ύλη filter
    const ctrl = el('label','exam-filter');
    ctrl.innerHTML = `<span class="switch"><input type="checkbox" id="examTgl"><span class="track"></span></span> <span>Μόνο εξεταστέα ύλη <b>2026</b></span>`;
    nav.appendChild(ctrl);
    const tgl = $('#examTgl',ctrl); tgl.checked = examOnly;
    tgl.onchange = e=>{ examOnly=e.target.checked; try{localStorage.setItem(EXAM_KEY, examOnly?'1':'0')}catch(_){}; applyFilters(); };

    const arcs = [];
    G.units.forEach(u=>{
      let a = arcs.find(x=>x.name===(u.arc||'Ενότητες'));
      if(!a){ a={name:u.arc||'Ενότητες', units:[]}; arcs.push(a); }
      a.units.push(u);
    });
    arcs.forEach(a=>{
      const box = el('div','arc');
      box.appendChild(el('h2',null,esc(a.name)));
      a.units.forEach(u=>{
        const b = el('button','unit-link');
        b.dataset.id=u.id;
        b.dataset.exam = u.exam ? '1' : '0';
        if(!u.exam) b.classList.add('nonexam');
        b.dataset.search = norm((u.author||'')+(u.title||'')+(u.work||'')+(u.num||''));
        b.innerHTML = `<span class="n">${u.type==='intro'?'❧':esc(u.num)}</span><span class="tt">${esc(u.title)}<span class="au">${esc(u.author)}${u.work?' · '+esc(u.work):''}</span>${u.exam?'':'<span class="offscope">εκτός ύλης 2026</span>'}</span>`;
        b.onclick = ()=> show(u.id);
        box.appendChild(b);
      });
      nav.appendChild(box);
    });
    applyFilters();
  }
  function applyFilters(){
    $$('.unit-link').forEach(b=>{
      const hideSearch = searchQ && !b.dataset.search.includes(searchQ);
      const hideExam = examOnly && b.dataset.exam==='0';
      b.hidden = hideSearch || hideExam;
    });
    $$('.arc').forEach(a=> a.hidden = !$$('.unit-link:not([hidden])',a).length);
  }

  /* ── render a unit ── */
  function show(id){
    const u = G.units.find(x=>x.id===id) || G.units[0];
    if(!u){ $('#main').innerHTML='<p class="empty">Δεν βρέθηκαν ενότητες.</p>'; return; }
    try{ localStorage.setItem(LAST_KEY, u.id); }catch(e){}
    $$('.unit-link').forEach(b=> b.classList.toggle('active', b.dataset.id===u.id));

    const tabs = (u.type==='intro' ? [
      ['intro','Εισαγωγή',  ()=>renderIntro(u)],
      ['quiz','Κατανόηση',  ()=>renderQuiz(u)],
    ] : [
      ['text','Κείμενο & Μετάφραση', ()=>renderText(u)],
      ['intro','Εισαγωγικά Σχόλια',  ()=>renderIntro(u)],
      ['interp','Ερμηνευτική',       ()=>renderInterp(u)],
      ['sxolia','Σχόλια Βιβλίου',    ()=>renderSxolia(u)],
      ['parallels','Παράλληλα Κείμενα', ()=>renderParallels(u)],
      ['lexico','Ετυμολογικά',       ()=>renderLexico(u)],
      ['ex','Ασκήσεις',              ()=>renderEx(u)],
      ['quiz','Κατανόηση',           ()=>renderQuiz(u)],
    ]).filter(t=>{
      if(t[0]==='intro')  return (u.eisagogika&&u.eisagogika.length)||(u.fakelos&&u.fakelos.length);
      if(t[0]==='interp') return (u.ermineutiki&&u.ermineutiki.length)||(u.domi&&u.domi.length)||(u.yfologika&&u.yfologika.length);
      if(t[0]==='sxolia') return u.sxolia&&u.sxolia.length;
      if(t[0]==='parallels') return u.parallels&&u.parallels.length;
      if(t[0]==='lexico') return (u.etymRef&&u.etymRef.length)||(u.etymBank&&u.etymBank.length)||(u.etymologika&&u.etymologika.length);
      if(t[0]==='ex')     return (u.ermineytikes&&u.ermineytikes.length);
      if(t[0]==='quiz')   return u.quiz&&u.quiz.length;
      return true;
    });

    const idx = G.units.indexOf(u);
    const prev = G.units[idx-1], next = G.units[idx+1];
    const main = $('#main'); main.innerHTML=''; main.dataset.unit=u.id;
    const head = el('header','doc-head');
    head.innerHTML = `
      <div class="cite">${esc(u.author)}${u.work?' — <span class="grk">'+esc(u.work)+'</span>':''}${u.ref?' · '+esc(u.ref):''}</div>
      <h2>${esc(u.title)}</h2>
      <div class="arc-tag">${u.type==='intro'?'Εισαγωγή':'Διδακτική Ενότητα '+esc(u.num)+(u.arc?' · '+esc(u.arc):'')} <span class="scope ${u.exam?'in':'out'}">${u.exam?'Εξεταστέα ύλη 2026':'Εκτός εξεταστέας ύλης 2026'}</span></div>`;
    main.appendChild(head);
    if(u.theme) main.appendChild(el('div','theme',esc(u.theme)));

    const bar = el('div','tabbar'); bar.setAttribute('role','tablist');
    const host = el('div','panel-host');
    tabs.forEach((t,i)=>{
      const btn = el('button','tab',esc(t[1]));
      btn.setAttribute('role','tab'); btn.dataset.accent = t[0];
      btn.onclick = ()=>{
        $$('.tab',bar).forEach(x=>x.setAttribute('aria-selected','false'));
        btn.setAttribute('aria-selected','true');
        host.innerHTML=''; host.dataset.accent=t[0]; host.appendChild(t[2]());
      };
      bar.appendChild(btn);
      if(i===0) setTimeout(()=>btn.click(),0);
    });
    main.appendChild(bar); main.appendChild(host);

    const pager = el('div','pager');
    const pb = el('button',null, prev?`<span class="lbl">Προηγούμενη</span>${esc(prev.num)}. ${esc(prev.title)}`:'');
    const nb = el('button',null, next?`<span class="lbl">Επόμενη</span>${esc(next.num)}. ${esc(next.title)}`:'');
    if(prev) pb.onclick=()=>show(prev.id); else pb.disabled=true;
    if(next) nb.onclick=()=>show(next.id); else nb.disabled=true;
    pager.append(pb,nb); main.appendChild(pager);
    window.scrollTo(0,0);
  }

  /* ── Κείμενο & Μετάφραση ── */
  function renderText(u){
    const wrap = el('div','panel'); wrap.removeAttribute('hidden');
    const seg = u.text||[];
    const tb = el('div','txt-toolbar');
    tb.innerHTML = `
      <label class="toggle"><span class="switch"><input type="checkbox" id="tgMod" checked><span class="track"></span></span> Μετάφραση</label>
      <div class="sep"></div>
      <label class="toggle"><span class="switch"><input type="checkbox" id="tgSelf"><span class="track"></span></span> Λειτουργία αυτοελέγχου</label>
      <div class="sep"></div>
      <span class="hint">Στον αυτοέλεγχο, κάνε κλικ σε μια μετάφραση για να αποκαλυφθεί.</span>`;
    wrap.appendChild(tb);
    const v = el('div','verse');
    seg.forEach(s=>{
      const row = el('div','seg');
      const g = el('div','gr grk'); g.innerHTML = esc(s.gr).replace(/\n/g,'<br>');
      const m = el('div','mod');   m.innerHTML = esc(s.mod).replace(/\n/g,'<br>');
      m.onclick = ()=>{ if(v.classList.contains('hide-mod')) m.classList.add('revealed'); };
      row.append(g,m); v.appendChild(row);
    });
    wrap.appendChild(v);
    if(u.translator) wrap.appendChild(el('div','trans-credit','μετάφραση: '+esc(u.translator)));
    $('#tgMod',tb).onchange = e=>{
      v.classList.toggle('mono', !e.target.checked);
      if(!e.target.checked){ v.classList.remove('hide-mod'); $('#tgSelf',tb).checked=false; $('#tgSelf',tb).disabled=true; }
      else $('#tgSelf',tb).disabled=false;
    };
    $('#tgSelf',tb).onchange = e=>{
      v.classList.toggle('hide-mod', e.target.checked);
      if(!e.target.checked) $$('.mod',v).forEach(m=>m.classList.remove('revealed'));
    };
    return wrap;
  }

  /* ── Εισαγωγικά Σχόλια (verbatim) ── */
  function block(blk){
    const note = el('div','book-note');
    if(blk.src) note.appendChild(el('span','src',esc(blk.src)));
    (blk.paras||[blk.text||'']).forEach(p=> note.appendChild(el('p',null,esc(p))));
    return note;
  }
  function renderIntro(u){
    const wrap = el('div','panel'); wrap.removeAttribute('hidden');
    if(u.type==='intro'){
      if(u.note) wrap.appendChild(el('div','intro-note',esc(u.note)));
    } else {
      wrap.appendChild(el('div','verbatim-flag','◆ Αυτούσια σχόλια από το βιβλίο / Φάκελο Υλικού'));
    }
    (u.eisagogika||[]).forEach(blk=> wrap.appendChild(block(blk)));
    if(u.fakelos&&u.fakelos.length){
      wrap.appendChild(el('h3','sec-h','Από τον Φάκελο Υλικού'));
      (u.fakelos||[]).forEach(blk=> wrap.appendChild(block(blk)));
    }
    return wrap;
  }

  /* ── Ερμηνευτική ── */
  function renderInterp(u){
    const wrap = el('div','panel'); wrap.removeAttribute('hidden');
    if(u.ermineutiki&&u.ermineutiki.length){
      wrap.appendChild(el('h3','sec-h','Ερμηνευτική προσέγγιση'));
      u.ermineutiki.forEach(x=>{
        const l = el('div','lemma');
        if(x.lemma) l.appendChild(el('span','l grk',esc(x.lemma)));
        l.appendChild(el('div','note',esc(x.note)));
        wrap.appendChild(l);
      });
    }
    if(u.domi&&u.domi.length){
      wrap.appendChild(el('h3','sec-h','Δομή του συλλογισμού'));
      const ol = el('ol','syllogism');
      u.domi.forEach(d=>{
        const li = el('li');
        if(typeof d==='string'){ li.innerHTML=esc(d); }
        else { if(d.tag) li.appendChild(el('span','tag',esc(d.tag))); li.appendChild(document.createTextNode(d.text||'')); }
        ol.appendChild(li);
      });
      wrap.appendChild(ol);
    }
    if(u.yfologika&&u.yfologika.length){
      wrap.appendChild(el('h3','sec-h','Αισθητικά — υφολογικά στοιχεία'));
      const box = el('div','chips');
      u.yfologika.forEach(y=>{
        const c = el('div','chip-note');
        c.innerHTML = (y.tag?'<b>'+esc(y.tag)+'</b> — ':'')+esc(y.note);
        box.appendChild(c);
      });
      wrap.appendChild(box);
    }
    return wrap;
  }

  /* ── Σχόλια Βιβλίου (verbatim, χρωματικά ανά πηγή — προς αποστήθιση) ──
     u.sxolia = [{ src:'fakelos'|'filosofikos', title?, paras:[…] }]
       🔵 Φάκελος Υλικού   ·   🟣 Φιλοσοφικός Λόγος   (χρώματα προσωρινά) */
  function renderSxolia(u){
    const wrap = el('div','panel'); wrap.removeAttribute('hidden');
    const META = { fakelos:['sx-fakelos','Σχόλια · Φάκελος Υλικού'], filosofikos:['sx-filosofikos','Ερμηνευτικά σχόλια · Φιλοσοφικός Λόγος'] };
    ['fakelos','filosofikos'].forEach(k=>{
      const g = (u.sxolia||[]).filter(s=> (s.src==='filosofikos'?'filosofikos':'fakelos')===k );
      if(!g.length) return;
      wrap.appendChild(el('h3','sec-h '+META[k][0], META[k][1]));
      g.forEach(s=>{
        const box = el('div','sxolio '+META[k][0]);
        if(s.title) box.appendChild(el('div','sx-title',esc(s.title)));
        (s.paras||[s.text||'']).forEach(p=> box.appendChild(el('p',null,esc(p))));
        wrap.appendChild(box);
      });
    });
    return wrap;
  }

  /* ── Παράλληλα Κείμενα (από τον Φάκελο Υλικού) + απαντημένες ερωτήσεις ──
     u.parallels = [{ source, intro?, text?, mod?, questions:[{q, a}] }] */
  function renderParallels(u){
    const wrap = el('div','panel'); wrap.removeAttribute('hidden');
    (u.parallels||[]).forEach((p,pi)=>{
      const card = el('div','parallel');
      card.appendChild(el('div','par-src',esc(p.source||('Παράλληλο κείμενο '+(pi+1)))));
      if(p.intro) card.appendChild(el('div','par-intro',esc(p.intro)));
      if(p.text)  card.appendChild(el('div','par-text',esc(p.text)));
      if(p.mod)   card.appendChild(el('div','par-mod',esc(p.mod)));
      if(p.questions&&p.questions.length){
        card.appendChild(el('div','par-qh','Ερωτήσεις'));
        p.questions.forEach((q,qi)=>{
          const qb = el('div','par-q');
          qb.appendChild(el('div','pq',esc((qi+1)+'. '+(q.q||''))));
          if(q.a){
            const btn = el('button','par-reveal','Δες ενδεικτική απάντηση');
            const ans = el('div','par-ans'); ans.hidden=true; ans.innerHTML = esc(q.a).replace(/\n/g,'<br>');
            btn.onclick = ()=>{ ans.hidden=!ans.hidden; btn.textContent = ans.hidden?'Δες ενδεικτική απάντηση':'Απόκρυψη απάντησης'; };
            qb.appendChild(btn); qb.appendChild(ans);
          }
          card.appendChild(qb);
        });
      }
      wrap.appendChild(card);
    });
    return wrap;
  }

  /* refresh toolbar helper */
  function refreshBar(label, onClick){
    const bar = el('div','gen-bar');
    const btn = el('button','gen-btn',`<span class="ico">↻</span> ${esc(label)}`);
    btn.onclick = onClick;
    bar.appendChild(btn);
    return {bar, btn};
  }

  /* ── Ασκήσεις (interpretive) ── */
  function renderEx(u){
    const wrap = el('div','panel'); wrap.removeAttribute('hidden');

    /* Ερμηνευτικές — random subset + refresh */
    if(u.ermineytikes&&u.ermineytikes.length){
      wrap.appendChild(el('h3','sec-h accent-interp','Ερμηνευτικές ερωτήσεις'));
      const host = el('div');
      const N = Math.min(3, u.ermineytikes.length);
      let showAll=false;
      const {bar,btn} = refreshBar('Άλλες ερωτήσεις', ()=>roll());
      const allBtn = el('button','gen-btn ghost','Όλες οι ερωτήσεις');
      allBtn.onclick=()=>{ showAll=!showAll; allBtn.textContent = showAll?'Λιγότερες':'Όλες οι ερωτήσεις'; roll(); };
      bar.appendChild(allBtn);
      if(u.ermineytikes.length<=N){ bar.querySelector('.gen-btn').style.display='none'; }
      function roll(){
        host.innerHTML='';
        const list = showAll ? u.ermineytikes : sample(u.ermineytikes, N);
        list.forEach((q,i)=> host.appendChild(interpEx(q,i)));
      }
      wrap.append(bar, host); roll();
    }
    return wrap;
  }

  /* ── Ετυμολογικά: reference lexicon (ομόρριζα + συνώνυμα/αντώνυμα) + exercises ── */
  function renderLexico(u){
    const wrap = el('div','panel'); wrap.removeAttribute('hidden');

    /* Α. Λεξικό αναφοράς — από τον Φάκελο Υλικού */
    if(u.etymRef && u.etymRef.length){
      wrap.appendChild(el('h3','sec-h accent-lexico','Λεξικό ενότητας — ομόρριζα & συγγενικά'));
      wrap.appendChild(el('p','gen-hint','Ομόρριζα / παράγωγα και, όπου υπάρχουν, συνώνυμα (ΣΥΝ.) και αντώνυμα (ΑΝΤ.), από τον Φάκελο Υλικού.'));
      const glo = el('div','etym-lex');
      u.etymRef.forEach(e=> glo.appendChild(etymRefBox(e, u.num)));
      wrap.appendChild(glo);
    }

    /* Β. Ασκήσεις: generated (refreshable) + book */
    if((u.etymBank&&u.etymBank.length>=3) || (u.etymologika&&u.etymologika.length)){
      wrap.appendChild(el('h3','sec-h accent-lexico','Ασκήσεις λεξιλογικές — ετυμολογικές'));
    }
    if(u.etymBank&&u.etymBank.length>=3){
      const genHost = el('div');
      const {bar} = refreshBar('Νέες ασκήσεις', ()=>rollEtym(u,genHost));
      bar.appendChild(el('span','gen-hint','Κάθε φορά δημιουργούνται νέες ασκήσεις από το ετυμολογικό λεξικό της ενότητας.'));
      wrap.append(bar, genHost); rollEtym(u,genHost);
    }
    if(u.etymologika&&u.etymologika.length){
      wrap.appendChild(el('h4','sub-h','Ασκήσεις από το βιβλίο'));
      u.etymologika.forEach((x,i)=> wrap.appendChild(etymEx(x,i)));
    }
    return wrap;
  }

  /* one reference box: highlighted lemma(s) stacked, then the cognate family,
     then ΣΥΝ./ΑΝΤ. if available (e.g. ὁράω / παροράω share a box). */
  function etymRefBox(e, curNum){
    const box = el('div','etym-entry');
    const heads = el('div','etym-heads');
    (e.lemmas||[]).forEach(lm=>{
      const row = el('div','etym-lemma');
      row.appendChild(el('span','etym-word grk', esc(lm)));
      heads.appendChild(row);
    });
    if(e.note) heads.appendChild(el('span','etym-note grk', esc(e.note)));
    box.appendChild(heads);
    if(e.forms) box.appendChild(el('div','etym-forms grk', esc(e.forms)));
    if(e.cognates && e.cognates.length)
      box.appendChild(el('div','etym-cognates', esc(e.cognates.join(' · '))));
    if((e.syn&&e.syn.length)||(e.ant&&e.ant.length)){
      const sa = el('div','etym-synant');
      if(e.syn&&e.syn.length){
        const l=el('span','etym-sa'); l.innerHTML='<span class="tag syn">ΣΥΝ.</span> '+esc(e.syn.join(', '));
        sa.appendChild(l);
      }
      if(e.ant&&e.ant.length){
        const l=el('span','etym-sa'); l.innerHTML='<span class="tag ant">ΑΝΤ.</span> '+esc(e.ant.join(', '));
        sa.appendChild(l);
      }
      box.appendChild(sa);
    }
    if(e.units && e.units.length){
      const others = e.units.filter(n=> String(n)!==String(curNum));
      if(others.length) box.appendChild(el('div','etym-units','Επίσης στις ενότ. '+others.join(', ')));
    }
    return box;
  }

  /* generate a fresh set of etymology exercises from etymBank */
  function rollEtym(u, host){
    host.innerHTML='';
    const bank = u.etymBank.filter(e=>e.gr && e.mods && e.mods.length);
    if(bank.length>=4)  host.appendChild(genLocate(bank));   // reverse: find cognate in text
    if(bank.length>=1)  host.appendChild(genOmorriza(bank)); // text → modern cognate
    if(bank.length>=4)  host.appendChild(genMatch(bank));    // matching
  }

  /* εντοπισμός: modern word → which text word is its cognate (MC) */
  function genLocate(bank){
    const entry = pick(bank);
    const modWord = pick(entry.mods);
    const distract = sample(bank.filter(e=>e.gr!==entry.gr), 3).map(e=>e.gr);
    const opts = shuffle([entry.gr, ...distract]);
    const x = {
      q:`Ποια λέξη του κειμένου είναι ετυμολογικά συγγενής με τη νεοελληνική λέξη «${modWord}»;`,
      opts, correct:opts.indexOf(entry.gr),
      explain: entry.gloss ? `Κοινή ρίζα: ${entry.gloss}.` : `Κοινή ετυμολογική ρίζα με το «${entry.gr}».`
    };
    const box = exBox('locate','Εντοπισμός στο κείμενο', x.q, 0);
    box.appendChild(mcBlock(x, true));   // greek options
    return box;
  }

  /* ομόρριζα: text word → give a modern cognate (input) */
  function genOmorriza(bank){
    const items = sample(bank, Math.min(4, bank.length));
    const x = { q:'Γράψε μία ομόρριζη / συγγενή λέξη της Νέας Ελληνικής για καθεμία λέξη του κειμένου.',
                items: items.map(e=>({ word:e.gr, accept:e.mods })) };
    const box = exBox('omorriza','Ομόρριζα / Παράγωγα', x.q, 0);
    box.appendChild(inputSet(x.items));
    return box;
  }

  /* αντιστοίχιση from bank */
  function genMatch(bank){
    const chosen = sample(bank, Math.min(5, bank.length));
    const x = { type:'match', q:'Αντιστοίχισε κάθε λέξη του κειμένου με μια ετυμολογικά συγγενή νεοελληνική λέξη.',
                pairs: chosen.map(e=>[e.gr, pick(e.mods)]) };
    const box = exBox('match','Αντιστοίχιση', x.q, 0);
    box.appendChild(matchBlock(x));
    return box;
  }

  /* shared exercise box with type accent */
  function exBox(type, kindLabel, q, qn){
    const box = el('div','ex ex--'+type);
    const chip = el('span','kind'); chip.textContent = kindLabel; box.appendChild(chip);
    if(q) box.appendChild(el('div','q', (qn?`<span class="qn">${qn}.</span>`:'')+esc(q)));
    return box;
  }

  function interpEx(q,i){
    const box = el('div','ex ex--interp');
    box.appendChild(el('span','kind','Ερμηνευτική ερώτηση'));
    box.appendChild(el('div','q',`<span class="qn">${i+1}.</span>${esc(q.q)}`));
    if(q.passage) box.appendChild(el('div','book-note','<p>'+esc(q.passage).replace(/\n/g,'</p><p>')+'</p>'));
    const btn = el('button','reveal-btn','Δες ενδεικτική απάντηση');
    const ans = el('div','model-ans'); ans.hidden=true;
    ans.innerHTML = '<span class="cap">Ενδεικτική απάντηση</span>'+esc(q.answer).replace(/\n/g,'<br>');
    btn.onclick = ()=>{ ans.hidden=!ans.hidden; btn.textContent = ans.hidden?'Δες ενδεικτική απάντηση':'Απόκρυψη'; };
    box.append(btn,ans);
    return box;
  }

  /* input set for omorriza/fill */
  function inputSet(items){
    const holder = el('div');
    const inputs = [];
    items.forEach(it=>{
      const r = el('div','fillrow');
      const promptHtml = it.prompt
        ? esc(it.prompt).replace(/___+/g,'<b>____</b>')
        : (it.word?'<span class="prompt"><span class="grk">'+esc(it.word)+'</span></span>':'');
      r.appendChild(el('span','prompt',promptHtml));
      const inp = el('input'); inp.type='text'; inp.setAttribute('aria-label','απάντηση');
      r.appendChild(inp);
      const acc = el('span','accepted'); acc.hidden=true; r.appendChild(acc);
      inputs.push({inp,acc,accept:it.accept||[]});
      holder.appendChild(r);
    });
    const check = el('button','check-btn','Έλεγχος');
    const score = el('div','scoreline'); score.hidden=true;
    check.onclick = ()=>{
      let ok=0;
      inputs.forEach(o=>{
        const good = o.inp.value.trim() && matches(o.inp.value,o.accept);
        o.inp.classList.toggle('right',good); o.inp.classList.toggle('wrong',!good && !!o.inp.value.trim());
        if(good) ok++;
        if(!good && o.accept.length){ o.acc.hidden=false; o.acc.textContent='π.χ. '+o.accept.slice(0,3).join(', '); }
        else o.acc.hidden=true;
      });
      score.hidden=false; score.textContent=`Σωστά: ${ok}/${inputs.length}`;
    };
    holder.append(check,score);
    return holder;
  }

  function matchBlock(x){
    const holder = el('div');
    const grid = el('div','match');
    const L=el('div','col'), R=el('div','col');
    const pairs = x.pairs.map((p,idx)=>({a:p[0],b:p[1],idx}));
    const rShuf = shuffle(pairs);
    let sel=null, done=0;
    const score = el('div','scoreline'); score.hidden=true;
    pairs.forEach(p=>{
      const it=el('button','item'); it.innerHTML='<span class="grk">'+esc(p.a)+'</span>'; it.dataset.idx=p.idx;
      it.onclick=()=>{ if(sel)sel.classList.remove('sel'); sel=it; it.classList.add('sel'); };
      L.appendChild(it);
    });
    rShuf.forEach(p=>{
      const it=el('button','item',esc(p.b)); it.dataset.idx=p.idx;
      it.onclick=()=>{
        if(!sel) return;
        if(sel.dataset.idx===it.dataset.idx){
          sel.classList.remove('sel'); sel.classList.add('done'); it.classList.add('done'); sel=null; done++;
          if(done===pairs.length){ score.hidden=false; score.textContent='Όλα σωστά! ✓'; }
        } else { it.classList.add('miss'); setTimeout(()=>it.classList.remove('miss'),320); }
      };
      R.appendChild(it);
    });
    grid.append(L,R); holder.append(grid,score);
    return holder;
  }

  /* fixed (book) etymology exercises */
  function etymEx(x,i){
    const type = x.type||'omorriza';
    const label = ({omorriza:'Ομόρριζα / Παράγωγα',fill:'Συμπλήρωση',match:'Αντιστοίχιση',mc:'Πολλαπλή επιλογή',open:'Παραγωγική άσκηση'})[type]||'Άσκηση';
    const box = el('div','ex ex--'+type);
    box.appendChild(el('span','kind',label));
    if(x.q) box.appendChild(el('div','q',`<span class="qn">${i+1}.</span>${esc(x.q)}`));
    if(type==='omorriza'||type==='fill') box.appendChild(inputSet(x.items||[x]));
    else if(type==='open'){
      (x.items||[x]).forEach(it=>{
        const r = el('div','fillrow');
        r.appendChild(el('span','prompt', it.word?'<span class="grk">'+esc(it.word)+'</span>':esc(it.prompt||'')));
        const btn = el('button','reveal-btn','Δες παράδειγμα');
        const ans = el('div','model-ans'); ans.hidden=true;
        ans.innerHTML = '<span class="cap">Ενδεικτικό παράδειγμα</span>'+esc(it.sample||'').replace(/\n/g,'<br>');
        btn.onclick=()=>{ ans.hidden=!ans.hidden; btn.textContent=ans.hidden?'Δες παράδειγμα':'Απόκρυψη'; };
        r.appendChild(btn); box.appendChild(r); box.appendChild(ans);
      });
    }
    else if(type==='match') box.appendChild(matchBlock(x));
    else if(type==='mc') box.appendChild(mcBlock(x));
    return box;
  }

  function mcBlock(x, greek){
    const holder = el('div');
    const opts = el('div','opts');
    const explain = el('div','explain'); explain.hidden=true;
    if(x.explain) explain.innerHTML=esc(x.explain);
    x.opts.forEach((o,idx)=>{
      const label = `<span class="mk">${'ΑΒΓΔΕ'[idx]||idx+1}</span><span${greek?' class="grk"':''}>${esc(o)}</span>`;
      const b = el('button','opt',label);
      b.onclick = ()=>{
        $$('.opt',opts).forEach(z=>{z.disabled=true;});
        if(idx===x.correct){ b.classList.add('correct'); }
        else { b.classList.add('incorrect'); const c=$$('.opt',opts)[x.correct]; if(c)c.classList.add('correct'); }
        explain.hidden=false;
      };
      opts.appendChild(b);
    });
    holder.append(opts,explain);
    return holder;
  }

  /* ── Κατανόηση (quiz) — random subset + refresh ── */
  function renderQuiz(u){
    const wrap = el('div','panel'); wrap.removeAttribute('hidden');
    wrap.appendChild(el('h3','sec-h accent-quiz','Έλεγχος κατανόησης'));
    const host = el('div');
    const N = Math.min(5, u.quiz.length);
    const {bar} = refreshBar('Νέες ερωτήσεις', ()=>roll());
    if(u.quiz.length<=N) bar.querySelector('.gen-btn').style.display='none';
    else bar.appendChild(el('span','gen-hint',`Τράπεζα ${u.quiz.length} ερωτήσεων — κάθε φορά ${N} τυχαίες.`));
    function roll(){
      host.innerHTML='';
      sample(u.quiz, N).forEach((q,i)=>{
        const box=el('div','ex ex--quiz');
        box.appendChild(el('div','q',`<span class="qn">${i+1}.</span>${esc(q.q)}`));
        box.appendChild(mcBlock(q));
        host.appendChild(box);
      });
    }
    wrap.append(bar, host); roll();
    return wrap;
  }

  /* ── boot ── */
  function initSearch(){ const s=$('#search'); if(s) s.oninput=e=>{ searchQ=norm(e.target.value); applyFilters(); }; }
  function boot(){
    if(!G.units.length){ $('#main').innerHTML='<p class="empty">Δεν έχουν φορτωθεί ενότητες.</p>'; return; }
    applyOverrides();
    G.units.sort((a,b)=> (a.num||0)-(b.num||0));
    G.units.forEach(u=> u.exam = (u.type==='intro') ? true : EXAM_2026.has(u.num));
    try{ examOnly = localStorage.getItem(EXAM_KEY)!=='0'; }catch(e){}  // default: exam-only
    buildSidebar(); initSearch();
    let start=null; try{ start=localStorage.getItem(LAST_KEY); }catch(e){}
    let u = (start && G.units.find(x=>x.id===start)) || G.units[0];
    if(examOnly && !u.exam) u = G.units.find(x=>x.exam) || u;
    show(u.id);
  }
  if(document.readyState!=='loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
