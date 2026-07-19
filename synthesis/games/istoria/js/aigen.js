/* ════════════════════════════════════════════════════════════════════
   aigen.js — window.AIGEN: student-driven AI source generator
   The student names the unit/theme + describes what they're struggling
   with; SK.generateSource() asks the backend for a DIDACTIC RECONSTRUCTION
   (a synthetic exam-style παράθεμα) grounded in the unit's real theory +
   authentic πηγές. It is always rendered with a prominent "AI-generated"
   disclaimer, then graded through the same SK.grade() pipeline as the
   authentic sources. Screen: #m-aigen. Requires study-kit.js + data-layer.js.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  const $   = (s,r=document)=>r.querySelector(s);
  const esc = (s)=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const ICON= (n)=>`<span class="ico">${SYM.icon(n)}</span>`;
  let COURSE='g3', GEN=null;   // GEN = last generated {title,source,question,model,points,disclaimer}

  function units(){ return ISTORIA.getUnits(COURSE)||[]; }
  function curUnitId(){ return (window.HUB&&HUB.curUnit) || (units()[0]||{}).id; }
  function show(scr){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on')); $('#'+scr).classList.add('on'); window.scrollTo({top:0,behavior:'instant'}); }

  function open(){ GEN=null; render(); show('m-aigen'); }

  function render(){
    const us=units(), cu=curUnitId();
    const opts=us.map(u=>`<option value="${u.id}" ${u.id===cu?'selected':''}>${esc(u.t)}</option>`).join('');
    $('#m-aigen').innerHTML = `<div class="sk-wrap">
      <div class="topbar"><button class="back" onclick="HUB.goHub()">← Κατάλογος</button>
        <span class="crumb">ΓΡΑΠΤΗ ΕΞΑΣΚΗΣΗ &nbsp;/&nbsp; <b>AI Πηγή</b></span></div>
      <div class="sk-top">
        <div class="sk-badge">${SYM.icon('stele')}</div>
        <div><h1>Φτιάξε τη δική σου πηγή</h1><div class="ds">Πες μας τι σε δυσκολεύει — ο AI συνθέτει μια πηγή εξάσκησης, βασισμένη στο σχολικό βιβλίο και στις πηγές της ενότητας.</div></div>
      </div>
      <div class="ai-form">
        <div class="ai-row">
          <div><label>Ενότητα</label><select id="ai-unit">${opts}</select></div>
          <div><label>Θεματική <span class="opt">(προαιρετικό)</span></label><input id="ai-theme" type="text" placeholder="π.χ. Εθνική Τράπεζα, αγροτική μεταρρύθμιση…"></div>
        </div>
        <label>Τι σε δυσκολεύει;</label>
        <textarea id="ai-struggle" placeholder="π.χ. Δεν καταλαβαίνω γιατί απέτυχε η διανομή των εθνικών γαιών και τι σχέση έχει με τους μεγαλοκτηματίες…"></textarea>
        <div class="ai-disc-pre">${SYM.icon('owl')} Η πηγή που θα δημιουργηθεί είναι <b>AI-generated</b>, για εξάσκηση — όχι αυθεντικό ιστορικό ντοκουμέντο.</div>
        <button class="btn primary" id="ai-gen" onclick="AIGEN.generate()">${ICON('scroll')} Δημιουργία πηγής</button>
      </div>
      <div class="sk-think" id="ai-think"><span class="sk-spin"></span> Ο AI συνθέτει μια ακριβή πηγή από το υλικό της ενότητας…</div>
      <div id="ai-out"></div>
    </div>`;
  }

  // gather grounding context from the real content: theory (blocks) + a few authentic πηγές
  function gatherContext(unitId){
    const theoryBlocks = ISTORIA.getTheory(COURSE, unitId)||[];
    const theory = theoryBlocks
      .map(t=> (t.blocks||[]).map(b=>(b.h?b.h+': ':'')+(b.p||'')).join('\n'))
      .join('\n\n').slice(0,5000);
    const uLabel = (units().find(u=>u.id===unitId)||{}).t || '';
    const pigi = ((ISTORIA.getMethods(COURSE)||{}).pigi)||[];
    const pool = pigi.filter(x=>x && x.unit===uLabel);
    const srcs=[];
    for(const it of pool){
      const arr=(it.srcs&&it.srcs.length)?it.srcs:(it.src?[it.src]:[]);
      for(const s of arr){ if(srcs.length<6) srcs.push({ref:s.ref||'', text:s.text||''}); }
      if(srcs.length>=6) break;
    }
    return { theory, sources:srcs, uLabel };
  }

  async function generate(){
    const unitId=$('#ai-unit').value;
    const theme=($('#ai-theme').value||'').trim();
    const struggle=($('#ai-struggle').value||'').trim();
    if(struggle.length<4){ $('#ai-struggle').focus(); return; }
    const ctx=gatherContext(unitId);
    $('#ai-gen').disabled=true; $('#ai-think').classList.add('on'); $('#ai-out').innerHTML='';
    const r=await SK.generateSource({ unit:ctx.uLabel, theme, struggle, context:{theory:ctx.theory, sources:ctx.sources} });
    $('#ai-think').classList.remove('on'); $('#ai-gen').disabled=false;
    if(!r || r.error){
      const msg = (r&&r.error==='unconfigured')
        ? 'Η υπηρεσία AI δεν είναι διαθέσιμη αυτή τη στιγμή. Δοκίμασε τις αυθεντικές πηγές στην «Επεξεργασία Πηγής».'
        : 'Δεν ήταν δυνατή η δημιουργία πηγής. Δοκίμασε ξανά σε λίγο.';
      $('#ai-out').innerHTML=`<div class="ai-err">${esc(msg)}</div>`; return;
    }
    GEN=r; renderResult(r);
  }

  function renderResult(r){
    $('#ai-out').innerHTML=`
      <div class="ai-disc">${SYM.icon('owl')}<span>${esc(r.disclaimer||'⚠ Πηγή δημιουργημένη από AI — για εξάσκηση, όχι αυθεντικό ντοκουμέντο.')}</span></div>
      <div class="sk-q">
        <div class="qn">AI ΠΗΓΗ${r.title?' · '+esc(r.title):''}<span class="qcat ai-tag">AI-generated</span></div>
        <div class="sk-src ai-src"><b>Κατασκευασμένη πηγή (AI) — για εξάσκηση</b>${esc(r.source)}</div>
        <div class="qt" style="margin-top:14px;">${esc(r.question)}</div>
      </div>
      <div class="sk-ed"><textarea id="ai-ans" placeholder="Γράψε την απάντησή σου αξιοποιώντας ΚΑΙ την πηγή ΚΑΙ τις γνώσεις σου…" oninput="AIGEN.wc()"></textarea>
        <div class="sk-bar">
          <button class="btn primary" id="ai-check" onclick="AIGEN.check()">${ICON('owl')} Έλεγχος απάντησης</button>
          <button class="btn ghost" onclick="AIGEN.open()">Νέα πηγή</button>
          <span class="sk-wc" id="ai-wc">0 λέξεις</span>
        </div></div>
      <div class="sk-think" id="ai-rthink"><span class="sk-spin"></span> Ο βοηθός διαβάζει και συγκρίνει την απάντησή σου…</div>
      <div class="sk-rev" id="ai-rev"></div>`;
    $('#ai-out').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function wc(){ const t=($('#ai-ans')?$('#ai-ans').value:''); const w=t.trim().split(/\s+/).filter(Boolean).length; if($('#ai-wc')) $('#ai-wc').textContent=w+' λέξεις'; }

  async function check(){
    if(!GEN) return;
    const ans=($('#ai-ans').value||'').trim(); if(ans.length<10){$('#ai-ans').focus();return;}
    const rubric=`Η ερώτηση απαιτεί ΣΥΝΔΥΑΣΜΟ της πηγής με τις ιστορικές γνώσεις. Στα «missed» επισήμανε αν ΔΕΝ αξιοποιήθηκε η πηγή. Η πηγή (AI-generated, διδακτική): "${GEN.source}"`;
    $('#ai-check').disabled=true; $('#ai-rthink').classList.add('on'); $('#ai-rev').classList.remove('on');
    const res=await SK.grade({ question:GEN.question, model:GEN.model, points:GEN.points, answer:ans, rubric });
    $('#ai-rev').innerHTML=SK.reviewHTML(res, ans, GEN.model, {});
    $('#ai-rthink').classList.remove('on'); $('#ai-check').disabled=false;
    $('#ai-rev').classList.add('on'); $('#ai-rev').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function init(course){ COURSE=course||(window.HUB&&HUB.course)||'g3'; }
  window.AIGEN={ init, open, generate, check, wc };
})();
