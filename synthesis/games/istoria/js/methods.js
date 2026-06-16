/* ════════════════════════════════════════════════════════════════════
   methods.js — window.MT: the AI-graded written methods
   One engine for the five free-response methods that the handoff shipped as
   separate pages — Ανάπτυξη, Ορισμοί, Επεξεργασία Πηγής, Σ/Λ με τεκμηρίωση,
   Σύγκριση. Each reads its bank from ISTORIA.getMethods(course), collects the
   student's answer, grades via SK.grade(), and renders SK.reviewHTML().
   Screens live as #mt-<id> in index.html. Requires study-kit.js + hub.js.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  const $  = (s,r=document)=>r.querySelector(s);
  const ICON = (n)=>`<span class="ico">${SYM.icon(n)}</span>`;
  const esc = (s)=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  let COURSE='g3', CUR=null, idx=0, sel=null;

  // method descriptors (id → meta + how its question card and inputs render)
  const METHODS = {
    anaptyxi:{ key:'anaptyxi', badge:'scroll', title:'Ανάπτυξη',
      ds:'Γράψε ελεύθερα — ο βοηθός ελέγχει το νόημα, όχι τις ακριβείς λέξεις.' },
    orismoi:{ key:'orismoi', badge:'scroll', title:'Ορισμοί',
      ds:'Δες τον όρο, γράψε τον ορισμό με δικά σου λόγια — ο AI ελέγχει το νόημα.' },
    pigi:{ key:'pigi', badge:'stele', title:'Επεξεργασία Πηγής',
      ds:'Συνδύασε την πηγή με τις γνώσεις σου — ο AI ελέγχει αν αξιοποίησες και τα δύο.' },
    sl:{ key:'sl', badge:'coin', title:'Σωστό / Λάθος με τεκμηρίωση',
      ds:'Διάλεξε — και δικαιολόγησε. Ο AI ελέγχει επιλογή ΚΑΙ αιτιολόγηση.' },
    sygkrisi:{ key:'sygkrisi', badge:'owl', title:'Σύγκριση Εννοιών',
      ds:'Εντόπισε ομοιότητες & διαφορές — ο AI ελέγχει τι συνέλαβες.' },
  };
  const ORDER = ['anaptyxi','orismoi','pigi','sl','sygkrisi'];

  function bank(id){ return (ISTORIA.getMethods(COURSE)||{})[METHODS[id].key] || []; }
  function available(){ return ORDER.filter(id=>bank(id).length); }

  function open(id){ if(!bank(id).length) return; CUR=id; idx=0; sel=null; render(); show('mt-'+id); }
  function show(scr){ document.querySelectorAll('.screen').forEach(s=>s.classList.remove('on')); $('#'+scr).classList.add('on'); window.scrollTo({top:0,behavior:'instant'}); }
  function pick(i){ idx=i; sel=null; render(); }

  function render(){
    const m=METHODS[CUR], arr=bank(CUR), q=arr[idx];
    const pills = arr.map((x,i)=>`<button class="${i===idx?'on':''}" onclick="MT.pick(${i})">${i+1}</button>`).join('');
    $('#mt-'+CUR).innerHTML = `<div class="sk-wrap">
      <div class="topbar"><button class="back" onclick="HUB.goHub()">← Κατάλογος</button>
        <span class="crumb">ΓΡΑΠΤΗ ΕΞΑΣΚΗΣΗ &nbsp;/&nbsp; <b>${esc(m.title)}</b></span></div>
      <div class="sk-top">
        <div class="sk-badge">${ICON(m.badge)}</div>
        <div><h1>${esc(m.title)}</h1><div class="ds">${esc(m.ds)}</div></div>
        <div class="sk-pick">${pills}</div>
      </div>
      <div class="sk-q">${questionCard(q)}</div>
      ${inputs(q)}
      <div class="sk-think" id="mt-think"><span class="sk-spin"></span> Ο βοηθός διαβάζει και συγκρίνει την απάντησή σου…</div>
      <div class="sk-rev" id="mt-rev"></div>
    </div>`;
    $('#mt-goico') && ($('#mt-goico').innerHTML = SYM.icon('owl'));
  }

  /* ── per-type question card ──────────────────────────────────────── */
  function questionCard(q){
    if(CUR==='orismoi') return `<div class="qn">ΟΡΙΣΜΟΣ · ${esc((q.unit||'').toUpperCase())}</div><div class="term">${esc(q.term)}</div>`;
    if(CUR==='sygkrisi') return `<div class="qn">ΣΥΓΚΡΙΣΗ ${String(idx+1).padStart(2,'0')}</div>
        <div class="vs"><div class="c"><div class="t">${esc(q.a)}</div></div><div class="mid">VS</div><div class="c"><div class="t">${esc(q.b)}</div></div></div>
        <div class="qt" style="margin-top:14px;">${esc(q.prompt)}</div>`;
    if(CUR==='sl') return `<div class="qn">ΙΣΧΥΡΙΣΜΟΣ ${String(idx+1).padStart(2,'0')}</div><div class="qt">${esc(q.claim)}</div>`;
    // anaptyxi / pigi
    const head = `<div class="qn">${esc(q.n||'ΕΡΩΤΗΣΗ '+String(idx+1).padStart(2,'0'))}</div>`;
    const src  = q.src ? `<div class="sk-src"><b>Πηγή — ${esc(q.src.ref)}</b>${esc(q.src.text)}</div>` : '';
    return head + (CUR==='pigi'?src:'') + `<div class="qt" style="margin-top:14px;">${esc(q.q)}</div>` + (CUR==='anaptyxi'?src:'');
  }

  /* ── per-type inputs ─────────────────────────────────────────────── */
  function inputs(q){
    if(CUR==='sygkrisi') return `<div class="sk-ed">
        <div class="dual">
          <div><label>Ομοιότητες / κοινά</label><textarea id="mt-sim" placeholder="Τι έχουν κοινό…" oninput="MT.wc()"></textarea></div>
          <div><label>Διαφορές</label><textarea id="mt-dif" placeholder="Σε τι διαφέρουν…" oninput="MT.wc()"></textarea></div>
        </div>${bar('Έλεγχος σύγκρισης')}</div>`;
    if(CUR==='sl') return `<div class="sk-choice" id="mt-choice">
          <button class="sk-tf t" onclick="MT.setSL(true,this)"><span style="font-size:1.3em">✓</span> ΣΩΣΤΟ</button>
          <button class="sk-tf f" onclick="MT.setSL(false,this)"><span style="font-size:1.3em">✕</span> ΛΑΘΟΣ</button>
        </div>
        <div class="sk-ed"><textarea id="mt-ans" placeholder="Δικαιολόγησε την επιλογή σου με ιστορικά στοιχεία…" oninput="MT.wc()"></textarea>${bar('Έλεγχος')}</div>`;
    const ph = CUR==='orismoi'?'Γράψε τον ορισμό…' : CUR==='pigi'?'Γράψε την απάντησή σου αξιοποιώντας ΚΑΙ την πηγή ΚΑΙ τις γνώσεις σου…' : 'Γράψε εδώ την απάντησή σου με δικά σου λόγια…';
    return `<div class="sk-ed"><textarea id="mt-ans" placeholder="${ph}" oninput="MT.wc()"></textarea>${bar(CUR==='orismoi'?'Έλεγχος ορισμού':'Έλεγχος απάντησης')}</div>`;
  }
  function bar(label){
    return `<div class="sk-bar">
      <button class="btn primary" id="mt-go" onclick="MT.check()"><span class="ico" id="mt-goico"></span> ${esc(label)}</button>
      <button class="btn ghost" onclick="MT.reset()">Καθαρισμός</button>
      <span class="sk-wc" id="mt-wc">0 λέξεις</span>
    </div>`;
  }

  function setSL(v,btn){ sel=v; document.querySelectorAll('#mt-choice .sk-tf').forEach(b=>b.classList.remove('sel')); btn.classList.add('sel'); }
  function wc(){
    let t='';
    if(CUR==='sygkrisi') t=($('#mt-sim').value+' '+$('#mt-dif').value);
    else t=($('#mt-ans')?$('#mt-ans').value:'');
    const w=t.trim().split(/\s+/).filter(Boolean).length;
    if($('#mt-wc')) $('#mt-wc').textContent=w+' λέξεις';
  }
  function reset(){
    if($('#mt-ans')) $('#mt-ans').value='';
    if($('#mt-sim')) $('#mt-sim').value=''; if($('#mt-dif')) $('#mt-dif').value='';
    sel=null; document.querySelectorAll('#mt-choice .sk-tf').forEach(b=>b.classList.remove('sel'));
    wc(); $('#mt-rev').classList.remove('on');
  }

  /* ── gather + grade ──────────────────────────────────────────────── */
  async function check(){
    const arr=bank(CUR), q=arr[idx];
    let params=null, you=null, model=q.model, opts={};

    if(CUR==='orismoi'){
      const ans=($('#mt-ans').value||'').trim(); if(ans.length<5){$('#mt-ans').focus();return;}
      params={question:'Δώσε τον ορισμό του όρου: '+q.term, model:q.model, points:q.points, answer:ans};
      you=ans; opts={modelLabel:'Ενδεικτικός ορισμός'};
    } else if(CUR==='pigi' || CUR==='anaptyxi'){
      const ans=($('#mt-ans').value||'').trim(); if(ans.length<(CUR==='pigi'?10:8)){$('#mt-ans').focus();return;}
      const rubric = q.src ? `Η ερώτηση απαιτεί ΣΥΝΔΥΑΣΜΟ της πηγής με τις ιστορικές γνώσεις. Στα «missed» επισήμανε ρητά αν ο μαθητής ΔΕΝ αξιοποίησε την πηγή. Η πηγή είναι: "${q.src.text}"` : '';
      params={question:q.q, model:q.model, points:q.points, answer:ans, rubric};
      you=ans;
    } else if(CUR==='sl'){
      if(sel===null){ alert('Διάλεξε πρώτα Σωστό ή Λάθος.'); return; }
      const ans=($('#mt-ans').value||'').trim(); if(ans.length<5){$('#mt-ans').focus();return;}
      const rubric=`Ο μαθητής επέλεξε «${sel?'Σωστό':'Λάθος'}». Η σωστή επιλογή είναι «${q.ans?'Σωστό':'Λάθος'}». Βαθμολόγησε ΚΑΙ την ορθότητα της επιλογής ΚΑΙ την ποιότητα της τεκμηρίωσης. Αν η επιλογή είναι λάθος, το σκορ να είναι χαμηλό ακόμη κι αν η τεκμηρίωση έχει στοιχεία.`;
      params={question:'Σωστό ή Λάθος (με τεκμηρίωση): '+q.claim, model:q.model, points:q.points, answer:`Επιλογή: ${sel?'Σωστό':'Λάθος'}. Τεκμηρίωση: ${ans}`, rubric};
      you=`Επιλογή: ${sel?'Σωστό ✓':'Λάθος ✕'}\n\n${ans}`;
      opts={covLabel:'Σωστά σημεία', misLabel:'Τι έλειπε από την τεκμηρίωση', modelLabel:'Ενδεικτική τεκμηρίωση'};
    } else if(CUR==='sygkrisi'){
      const sim=($('#mt-sim').value||'').trim(), dif=($('#mt-dif').value||'').trim();
      if((sim+dif).length<10){$('#mt-sim').focus();return;}
      const rubric='Αξιολόγησε ξεχωριστά αν εντόπισε σωστές ομοιότητες και σωστές διαφορές μεταξύ των δύο εννοιών.';
      const answer=`ΟΜΟΙΟΤΗΤΕΣ: ${sim||'(καμία)'}\nΔΙΑΦΟΡΕΣ: ${dif||'(καμία)'}`;
      params={question:q.prompt+' ('+q.a+' vs '+q.b+')', model:q.model, points:q.points, answer, rubric};
      you=answer; opts={covLabel:'Σωστές παρατηρήσεις', misLabel:'Τι έλειπε', modelLabel:'Ενδεικτική σύγκριση'};
    }

    $('#mt-go').disabled=true; $('#mt-think').classList.add('on'); $('#mt-rev').classList.remove('on');
    const r=await SK.grade(params);
    let html=SK.reviewHTML(r, you, model, opts);
    if(CUR==='sl'){
      const ok=(sel===q.ans);
      html=`<div style="font-family:var(--f-mono);font-size:12px;letter-spacing:.1em;margin-bottom:12px;color:${ok?'var(--sage)':'var(--terra)'}">${ok?'✓ ΣΩΣΤΗ ΕΠΙΛΟΓΗ':'✕ ΛΑΘΟΣ ΕΠΙΛΟΓΗ — σωστό ήταν «'+(q.ans?'Σωστό':'Λάθος')+'»'}</div>`+html;
    }
    $('#mt-rev').innerHTML=html;
    $('#mt-think').classList.remove('on'); $('#mt-go').disabled=false;
    $('#mt-rev').classList.add('on'); $('#mt-rev').scrollIntoView({behavior:'smooth',block:'start'});
  }

  function init(course){ COURSE = course || (window.HUB && HUB.course) || 'g3'; }

  window.MT = { init, open, pick, setSL, wc, reset, check, available, METHODS, ORDER };
})();
