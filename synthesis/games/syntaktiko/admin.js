/* ════════════════════════════════════════════════════════════════════
   admin.js — editor for «Συντακτικό» topics.
   Edits: intro, theory sections {h,paras}, exercises (mc/match), quiz (mc).
   Saves overrides to localStorage (syntaktiko.admin) — the student app
   overlays them same-origin — and exports a regenerated data/<id>.js.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  const KEY='syntaktiko.admin';
  const $=(s,r)=>(r||document).querySelector(s);
  const el=(t,c,h)=>{const n=document.createElement(t); if(c)n.className=c; if(h!=null)n.innerHTML=h; return n;};
  const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const clone=o=>JSON.parse(JSON.stringify(o));
  const EDITABLE=['intro','theory','exercises','quiz'];

  let base={}, work={}, curId=null;
  function loadOv(){ try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {};} }
  function saveOv(ov){ localStorage.setItem(KEY, JSON.stringify(ov)); }

  function init(){
    const topics=(window.SYNTAX.topics||[]).slice().sort((a,b)=>(a.num||0)-(b.num||0));
    if(!topics.length){ $('#editor').innerHTML='<p class="empty">Δεν φορτώθηκαν ενότητες.</p>'; return; }
    const ov=loadOv();
    topics.forEach(t=>{
      base[t.id]=clone(t);
      const w=clone(t); const o=ov[t.id]||{}; Object.keys(o).forEach(k=> w[k]=o[k]);
      ['theory','exercises','quiz'].forEach(k=> w[k]=w[k]||[]);
      work[t.id]=w;
    });
    const sel=$('#topicSel');
    topics.forEach(t=>{ const o=el('option'); o.value=t.id; o.textContent=`${t.num}. ${t.title}`; sel.appendChild(o); });
    sel.onchange=()=>render(sel.value);
    render(topics[0].id);
  }

  function badge(){ const ov=loadOv(); const has=ov[curId]&&Object.keys(ov[curId]).length; $('#ovBadge').textContent = has?'● υπάρχουν τοπικές αλλαγές (μη εξαγμένες)':''; }

  function render(id){
    curId=id; const t=work[id]; const root=$('#editor'); root.innerHTML='';

    /* Intro */
    root.appendChild(section('Εισαγωγή', '', body=>{
      const ta=el('textarea'); ta.value=t.intro||''; ta.oninput=()=>t.intro=ta.value; body.appendChild(ta);
    }));

    /* Θεωρία */
    root.appendChild(listSection('Θεωρία (ενότητες)', t.theory, ()=>({h:'',paras:['']}), (item,card)=>{
      card.appendChild(field('Τίτλος ενότητας', item, 'h'));
      const lab=el('label',null,'Κείμενο (κενή γραμμή = νέα παράγραφος)'); card.appendChild(lab);
      const ta=el('textarea'); ta.value=(item.paras||[]).join('\n\n');
      ta.oninput=()=> item.paras=ta.value.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
      card.appendChild(ta);
    }));

    /* Ασκήσεις */
    root.appendChild(listSection('Ασκήσεις', t.exercises, ()=>({type:'mc',q:'',opts:['',''],correct:0,explain:''}), (item,card)=>{
      const tl=el('label',null,'Τύπος'); card.appendChild(tl);
      const sel=el('select'); ['mc','match'].forEach(tp=>{ const o=el('option'); o.value=tp; o.textContent=(tp==='mc'?'Πολλαπλή επιλογή / Χαρακτηρισμός':'Αντιστοίχιση'); if((item.type||'mc')===tp)o.selected=true; sel.appendChild(o); });
      sel.onchange=()=>{ item.type=sel.value; if(item.type==='match'){ if(!Array.isArray(item.pairs))item.pairs=[['','']]; } else { if(!Array.isArray(item.opts))item.opts=['','']; if(typeof item.correct!=='number')item.correct=0; } render(curId); };
      card.appendChild(sel);
      card.appendChild(field('Ερώτηση / εκφώνηση', item, 'q', true));
      if((item.type||'mc')==='match') matchEditor(item,card); else mcEditor(item,card);
    }));

    /* Κατανόηση */
    root.appendChild(listSection('Κατανόηση (πολλαπλή επιλογή)', t.quiz, ()=>({q:'',opts:['',''],correct:0,explain:''}), (item,card)=>{
      card.appendChild(field('Ερώτηση', item, 'q', true));
      mcEditor(item,card);
    }));

    root.appendChild(saveBar());
    badge();
  }

  function mcEditor(item,card){
    if(!Array.isArray(item.opts)) item.opts=['',''];
    if(typeof item.correct!=='number') item.correct=0;
    card.appendChild(el('label',null,'Επιλογές (σημείωσε τη σωστή)'));
    const og=el('div','opts-grid'); card.appendChild(og);
    function draw(){
      og.innerHTML='';
      item.opts.forEach((o,i)=>{
        const r=el('label','radio-correct');
        const radio=el('input'); radio.type='radio'; radio.name='c-'+Math.random().toString(36).slice(2); radio.checked=(item.correct===i);
        radio.onchange=()=>{ item.correct=i; };
        r.append(radio, document.createTextNode('ΑΒΓΔΕ'[i]||(i+1)));
        const inp=el('input'); inp.type='text'; inp.value=o; inp.oninput=()=>item.opts[i]=inp.value;
        const del=el('button','btn sm danger','✕'); del.onclick=()=>{ if(item.opts.length>2){ item.opts.splice(i,1); if(item.correct>=item.opts.length)item.correct=0; draw(); } };
        const wrap=el('div'); wrap.style.cssText='display:flex;gap:6px'; wrap.append(inp,del);
        og.append(r,wrap);
      });
    }
    draw();
    const add=el('button','btn sm','+ Επιλογή'); add.onclick=()=>{ if(item.opts.length<5){ item.opts.push(''); draw(); } };
    card.appendChild(add);
    card.appendChild(field('Επεξήγηση', item, 'explain', true));
  }

  function matchEditor(item,card){
    if(!Array.isArray(item.pairs)) item.pairs=[['','']];
    card.appendChild(el('label',null,'Ζεύγη — μία γραμμή ανά ζεύγος, μορφή:  αριστερό | δεξί'));
    const ta=el('textarea'); ta.style.minHeight='110px';
    ta.value=(item.pairs||[]).map(p=> (p[0]||'')+' | '+(p[1]||'')).join('\n');
    ta.oninput=()=> item.pairs = ta.value.split('\n').map(l=>l.split('|').map(s=>s.trim())).filter(p=>p[0]&&p[1]).map(p=>[p[0],p.slice(1).join('|')]);
    card.appendChild(ta);
  }

  /* generic list section */
  function listSection(title, arr, factory, fill){
    return section(title, arr.length+' εγγραφές', body=>{
      arr.forEach((item,i)=> body.appendChild(cardFor(arr,item,i,fill)));
      const add=el('button','btn primary','+ Προσθήκη'); add.onclick=()=>{ arr.push(factory()); render(curId); };
      body.appendChild(add);
    });
  }
  function cardFor(arr,item,i,fill){
    const card=el('div','card');
    const head=el('div'); head.style.cssText='display:flex;justify-content:space-between;align-items:center;margin-bottom:6px';
    head.appendChild(el('span','eyebrow','#'+(i+1)));
    const acts=el('div','card-actions');
    const up=el('button','btn sm','↑'); up.onclick=()=>{ if(i>0){ [arr[i-1],arr[i]]=[arr[i],arr[i-1]]; render(curId);} };
    const dn=el('button','btn sm','↓'); dn.onclick=()=>{ if(i<arr.length-1){ [arr[i+1],arr[i]]=[arr[i],arr[i+1]]; render(curId);} };
    const del=el('button','btn sm danger','Διαγραφή'); del.onclick=()=>{ arr.splice(i,1); render(curId); };
    acts.append(up,dn,del); head.appendChild(acts); card.appendChild(head);
    fill(item,card); return card;
  }
  function field(label,obj,key,multiline){
    const w=el('div'); w.style.marginBottom='8px'; w.appendChild(el('label',null,label));
    const inp = multiline ? el('textarea') : el('input'); if(!multiline) inp.type='text';
    inp.value = obj[key]!=null?obj[key]:''; inp.oninput=()=>{ obj[key]=inp.value; };
    w.appendChild(inp); return w;
  }
  function section(title,count,build){
    const s=el('div','adm-section');
    s.appendChild(el('h2',null,esc(title)+(count?`<span class="count">${esc(count)}</span>`:'')));
    const b=el('div','adm-body'); build(b); s.appendChild(b); return s;
  }

  function saveBar(){
    const bar=el('div','save-bar');
    const save=el('button','btn primary','💾 Αποθήκευση (τοπικά)');
    save.onclick=()=>{ const ov=loadOv(); const o={}; EDITABLE.forEach(k=>{ if(work[curId][k]!=null)o[k]=work[curId][k]; }); ov[curId]=o; saveOv(ov); status('Αποθηκεύτηκε τοπικά.'); badge(); };
    const exp=el('button','btn','⬇ Εξαγωγή '+curId+'.js'); exp.onclick=()=>openExport();
    const reset=el('button','btn danger','Επαναφορά'); reset.onclick=()=>{ if(confirm('Να αναιρεθούν όλες οι τοπικές αλλαγές αυτής της ενότητας;')){ const ov=loadOv(); delete ov[curId]; saveOv(ov); work[curId]=clone(base[curId]); ['theory','exercises','quiz'].forEach(k=>work[curId][k]=work[curId][k]||[]); render(curId); } };
    const st=el('span','status'); st.id='saveStatus';
    bar.append(save,exp,reset,st); return bar;
  }
  function status(m){ const s=$('#saveStatus'); if(s)s.textContent=m; }

  function buildFile(id){
    const t=clone(base[id]); EDITABLE.forEach(k=>{ if(work[id][k]!=null)t[k]=work[id][k]; });
    return `/* Συντακτικό — ${t.title} (επεξεργάστηκε από τον πίνακα διαχείρισης) */\nwindow.SYNTAX = window.SYNTAX || { topics: [] };\nwindow.SYNTAX.topics.push(\n${JSON.stringify(t,null,2)}\n);\n`;
  }
  function openExport(){
    const txt=buildFile(curId); $('#exportText').value=txt;
    const dlg=$('#exportDlg'); if(dlg.showModal)dlg.showModal(); else dlg.setAttribute('open','');
    $('#copyBtn').onclick=()=>{ navigator.clipboard&&navigator.clipboard.writeText(txt); $('#copyBtn').textContent='Αντιγράφηκε ✓'; setTimeout(()=>$('#copyBtn').textContent='Αντιγραφή',1500); };
    $('#downloadBtn').onclick=()=>{ const b=new Blob([txt],{type:'text/javascript;charset=utf-8'}); const a=el('a'); a.href=URL.createObjectURL(b); a.download=curId+'.js'; a.click(); URL.revokeObjectURL(a.href); };
  }
  $('#dlgClose') && ($('#dlgClose').onclick=()=>{ const d=$('#exportDlg'); d.close?d.close():d.removeAttribute('open'); });

  if(document.readyState!=='loading') init(); else document.addEventListener('DOMContentLoaded', init);
})();
