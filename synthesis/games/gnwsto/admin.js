/* ════════════════════════════════════════════════════════════════════
   admin.js — editor for «Διδαγμένο Κείμενο» units.
   Edits: theme, εισαγωγικά/Φάκελο comments, ερμηνευτικές, κατανόηση (quiz),
   ετυμολογικό λεξικό (etymBank). Saves overrides to localStorage
   (gnwsto.admin) — the student app overlays them same-origin — and exports
   a regenerated data/eNN.js for permanent commit.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  const KEY='gnwsto.admin';
  const $=(s,r)=>(r||document).querySelector(s);
  const el=(t,c,h)=>{const n=document.createElement(t); if(c)n.className=c; if(h!=null)n.innerHTML=h; return n;};
  const clone=o=>JSON.parse(JSON.stringify(o));
  const EDITABLE=['theme','eisagogika','fakelos','ermineytikes','quiz','etymBank'];

  let base={}, work={}, curId=null;

  function loadOv(){ try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){return {};} }
  function saveOv(ov){ localStorage.setItem(KEY, JSON.stringify(ov)); }

  function init(){
    const units=(window.GNWSTO.units||[]).slice().sort((a,b)=>(a.num||0)-(b.num||0));
    if(!units.length){ $('#editor').innerHTML='<p class="empty">Δεν φορτώθηκαν ενότητες.</p>'; return; }
    const ov=loadOv();
    units.forEach(u=>{
      base[u.id]=clone(u);
      const w=clone(u); const o=ov[u.id]||{};
      Object.keys(o).forEach(k=> w[k]=o[k]);
      ['eisagogika','fakelos','ermineytikes','quiz','etymBank'].forEach(k=> w[k]=w[k]||[]);
      work[u.id]=w;
    });
    const sel=$('#unitSel');
    units.forEach(u=>{ const o=el('option'); o.value=u.id; o.textContent = u.type==='intro' ? `Εισαγωγή · ${u.title}` : `${u.num}. ${u.title} — ${u.author}`; sel.appendChild(o); });
    sel.onchange=()=>render(sel.value);
    render(units[0].id);
  }

  function badge(){
    const ov=loadOv(); const has=ov[curId] && Object.keys(ov[curId]).length;
    $('#ovBadge').textContent = has ? '● υπάρχουν τοπικές αλλαγές (μη εξαγμένες)' : '';
  }

  function render(id){
    curId=id; const u=work[id];
    const isIntro = u.type==='intro';
    const root=$('#editor'); root.innerHTML='';

    if(isIntro) root.appendChild(el('div','intro-note','Ενότητα «Εισαγωγή». Επεξεργάσου τα κεφάλαια — μπορείς να επικολλήσεις το αυτούσιο κείμενο του σχολικού βιβλίου — και τις ερωτήσεις κατανόησης. Οι υπόλοιπες κατηγορίες (θέμα, ερμηνευτικές, ετυμολογικά, Φάκελος) δεν ισχύουν εδώ.'));

    /* Θέμα */
    if(!isIntro) root.appendChild(section('Θέμα ενότητας','', body=>{
      const t=el('textarea'); t.value=u.theme||''; t.oninput=()=>u.theme=t.value;
      body.appendChild(t);
    }));

    /* Ερμηνευτικές */
    if(!isIntro) root.appendChild(listSection('Ερμηνευτικές ερωτήσεις', u.ermineytikes, ()=>({q:'',answer:''}), (item,card)=>{
      card.appendChild(field('Ερώτηση', item, 'q', true));
      card.appendChild(field('Ενδεικτική απάντηση', item, 'answer', true));
      card.appendChild(field('Παράθεμα (προαιρετικό)', item, 'passage', true));
    }));

    /* Κατανόηση (quiz) */
    root.appendChild(listSection('Κατανόηση — ερωτήσεις πολλαπλής επιλογής', u.quiz, ()=>({q:'',opts:['',''],correct:0,explain:''}), (item,card)=>{
      card.appendChild(field('Ερώτηση', item, 'q', true));
      if(!Array.isArray(item.opts)) item.opts=['',''];
      if(typeof item.correct!=='number') item.correct=0;
      const lab=el('label',null,'Επιλογές (σημείωσε τη σωστή)'); card.appendChild(lab);
      const og=el('div','opts-grid'); card.appendChild(og);
      function drawOpts(){
        og.innerHTML='';
        item.opts.forEach((o,i)=>{
          const r=el('label','radio-correct');
          const radio=el('input'); radio.type='radio'; radio.name='correct-'+Math.random().toString(36).slice(2); radio.checked=(item.correct===i);
          radio.onchange=()=>{ item.correct=i; };
          r.append(radio, document.createTextNode('ΑΒΓΔΕ'[i]||(i+1)));
          const inp=el('input'); inp.type='text'; inp.value=o; inp.oninput=()=>item.opts[i]=inp.value;
          const del=el('button','btn sm danger','✕'); del.title='Διαγραφή επιλογής';
          del.onclick=()=>{ if(item.opts.length>2){ item.opts.splice(i,1); if(item.correct>=item.opts.length)item.correct=0; drawOpts(); } };
          const wrap=el('div'); wrap.style.display='flex'; wrap.style.gap='6px'; wrap.append(inp,del);
          og.append(r, wrap);
        });
      }
      drawOpts();
      const addOpt=el('button','btn sm','+ Επιλογή'); addOpt.onclick=()=>{ if(item.opts.length<5){ item.opts.push(''); drawOpts(); } };
      card.appendChild(addOpt);
      card.appendChild(field('Επεξήγηση', item, 'explain', true));
    }));

    /* Ετυμολογικό λεξικό */
    if(!isIntro) root.appendChild(listSection('Ετυμολογικό λεξικό (τροφοδοτεί τις παραγόμενες ασκήσεις)', u.etymBank, ()=>({gr:'',gloss:'',mods:[]}), (item,card)=>{
      const g=el('div','mini');
      g.appendChild(field('Λέξη του κειμένου', item, 'gr', false, true));
      g.appendChild(field('Ρίζα / γλωσσικό σχόλιο', item, 'gloss', false));
      card.appendChild(g);
      // mods as CSV
      const lab=el('label',null,'Νεοελληνικές ομόρριζες / συγγενείς (χωρισμένες με κόμμα)'); card.appendChild(lab);
      const ta=el('textarea'); ta.value=(item.mods||[]).join(', ');
      ta.oninput=()=> item.mods = ta.value.split(',').map(s=>s.trim()).filter(Boolean);
      card.appendChild(ta);
    }));

    /* Σχόλια (verbatim) / Κεφάλαια εισαγωγής */
    root.appendChild(listSection(isIntro?'Κεφάλαια εισαγωγής (αυτούσιο κείμενο)':'Εισαγωγικά σχόλια (αυτούσια)', u.eisagogika, ()=>({src:'',paras:['']}), (item,card)=>{
      card.appendChild(field(isIntro?'Τίτλος κεφαλαίου':'Πηγή / τίτλος', item, 'src', false));
      const lab=el('label',null,'Κείμενο (κενή γραμμή = νέα παράγραφος)'); card.appendChild(lab);
      const ta=el('textarea'); ta.value=(item.paras||[item.text||'']).join('\n\n');
      ta.oninput=()=> item.paras = ta.value.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
      card.appendChild(ta);
    }));
    if(!isIntro) root.appendChild(listSection('Φάκελος Υλικού (αυτούσια)', u.fakelos, ()=>({src:'',paras:['']}), (item,card)=>{
      card.appendChild(field('Πηγή / τίτλος (π.χ. Φάκελος Υλικού, σελ. 15)', item, 'src', false));
      const lab=el('label',null,'Κείμενο (κενή γραμμή = νέα παράγραφος)'); card.appendChild(lab);
      const ta=el('textarea'); ta.value=(item.paras||[item.text||'']).join('\n\n');
      ta.oninput=()=> item.paras = ta.value.split(/\n\s*\n/).map(s=>s.trim()).filter(Boolean);
      card.appendChild(ta);
    }));

    root.appendChild(saveBar());
    badge();
  }

  /* generic list section with add/remove */
  function listSection(title, arr, factory, fill){
    return section(title, arr.length+' εγγραφές', body=>{
      arr.forEach((item,i)=> body.appendChild(cardFor(arr,item,i,fill)));
      const add=el('button','btn primary','+ Προσθήκη');
      add.onclick=()=>{ arr.push(factory()); render(curId); };
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
    fill(item,card);
    return card;
  }
  function field(label,obj,key,multiline,greek){
    const w=el('div'); w.style.marginBottom='8px';
    w.appendChild(el('label',null,label));
    const inp = multiline ? el('textarea') : el('input');
    if(!multiline) inp.type='text';
    if(greek) inp.className='grk';
    inp.value = obj[key]!=null ? obj[key] : '';
    inp.oninput=()=>{ obj[key]=inp.value; };
    w.appendChild(inp);
    return w;
  }
  function section(title, count, build){
    const s=el('div','adm-section');
    s.appendChild(el('h2',null,esc(title)+(count?`<span class="count">${esc(count)}</span>`:'')));
    const b=el('div','adm-body'); build(b); s.appendChild(b);
    return s;
  }
  const esc=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  /* save / export / reset */
  function saveBar(){
    const bar=el('div','save-bar');
    const save=el('button','btn primary','💾 Αποθήκευση (τοπικά)');
    save.onclick=()=>{
      const ov=loadOv(); const o={};
      EDITABLE.forEach(k=>{ if(work[curId][k]!=null) o[k]=work[curId][k]; });
      ov[curId]=o; saveOv(ov);
      status('Αποθηκεύτηκε τοπικά. Ανοίγοντας την εφαρμογή θα δεις τις αλλαγές.'); badge();
    };
    const exp=el('button','btn','⬇ Εξαγωγή '+curId+'.js');
    exp.onclick=()=>openExport();
    const reset=el('button','btn danger','Επαναφορά ενότητας');
    reset.onclick=()=>{ if(confirm('Να αναιρεθούν όλες οι τοπικές αλλαγές αυτής της ενότητας;')){ const ov=loadOv(); delete ov[curId]; saveOv(ov); work[curId]=clone(base[curId]); ['eisagogika','fakelos','ermineytikes','quiz','etymBank'].forEach(k=>work[curId][k]=work[curId][k]||[]); render(curId); } };
    const st=el('span','status'); st.id='saveStatus';
    bar.append(save,exp,reset,st);
    return bar;
  }
  function status(msg){ const s=$('#saveStatus'); if(s) s.textContent=msg; }

  function buildFile(id){
    const unit=clone(base[id]);
    EDITABLE.forEach(k=>{ if(work[id][k]!=null) unit[k]=work[id][k]; });
    // drop empty editable arrays for cleanliness
    ['eisagogika','fakelos','ermineytikes','quiz','etymBank'].forEach(k=>{ if(Array.isArray(unit[k])&&!unit[k].length) delete unit[k]; });
    const json=JSON.stringify(unit,null,2);
    return `/* Διδακτική Ενότητα ${unit.num} — ${unit.author}, ${unit.work||''} ${unit.ref||''}\n   (παρήχθη/επεξεργάστηκε από τον πίνακα διαχείρισης) */\nwindow.GNWSTO.units.push(\n${json}\n);\n`;
  }
  function openExport(){
    const txt=buildFile(curId);
    $('#exportText').value=txt;
    const dlg=$('#exportDlg'); if(dlg.showModal) dlg.showModal(); else dlg.setAttribute('open','');
    $('#copyBtn').onclick=()=>{ navigator.clipboard && navigator.clipboard.writeText(txt); $('#copyBtn').textContent='Αντιγράφηκε ✓'; setTimeout(()=>$('#copyBtn').textContent='Αντιγραφή',1500); };
    $('#downloadBtn').onclick=()=>{
      const blob=new Blob([txt],{type:'text/javascript;charset=utf-8'});
      const a=el('a'); a.href=URL.createObjectURL(blob); a.download=curId+'.js'; a.click(); URL.revokeObjectURL(a.href);
    };
  }
  $('#dlgClose') && ($('#dlgClose').onclick=()=>{ const d=$('#exportDlg'); d.close?d.close():d.removeAttribute('open'); });

  if(document.readyState!=='loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
