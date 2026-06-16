/* ════════════════════════════════════════════════════════════════════
   admin.js — window.ADM: content studio for the Ιστορία panel
   Non-technical CRUD per CLASS · unit · exercise type, on top of the data
   layer (window.ISTORIA): edits land in the localStorage overlay; Export /
   Import round-trip the editable slice as JSON (the bridge to a backend);
   Reset re-seeds from the bundled pack. Demo gate password: "admin"
   (placeholder — replace with real auth; this is not security).
   ════════════════════════════════════════════════════════════════════ */
(function(){
  const $  = s=>document.querySelector(s);
  const $$ = s=>[...document.querySelectorAll(s)];
  const escHtml=(s)=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const escAttr=(s)=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
  const esc=escHtml;

  // exercise types (keys match the hub's mode keys + the data model)
  const TYPES=[
    {id:'mc',    label:'Πολλαπλής Επιλογής', icon:'stele',   opts:true, fields:[{k:'q',t:'area',l:'Ερώτηση'}], sum:it=>it.q},
    {id:'fc',    label:'Κάρτες Μνήμης',      icon:'amphora', fields:[{k:'front',t:'line',l:'Όρος (μπροστά)'},{k:'back',t:'area',l:'Ορισμός (πίσω)'}], sum:it=>it.front+' — '+(it.back||'').slice(0,60)+'…'},
    {id:'tf',    label:'Σωστό / Λάθος',      icon:'coin',    fields:[{k:'claim',t:'area',l:'Ισχυρισμός'},{k:'ans',t:'bool',l:'Σωστή απάντηση'}], sum:it=>it.claim+'  ['+(it.ans?'Σωστό':'Λάθος')+']'},
    {id:'fib',   label:'Συμπλήρωση',         icon:'chisel',  fields:[{k:'before',t:'line',l:'Κείμενο πριν το κενό'},{k:'answer',t:'line',l:'Σωστή λέξη (το κενό)'},{k:'after',t:'line',l:'Κείμενο μετά'},{k:'bank',t:'list',l:'Τράπεζα λέξεων (μία ανά γραμμή)'}], sum:it=>it.before+' ___ '+it.after},
    {id:'match', label:'Αντιστοίχιση',       icon:'mosaic',  fields:[{k:'left',t:'line',l:'Όρος'},{k:'right',t:'area',l:'Ορισμός'}], sum:it=>it.left+' ↔ '+(it.right||'').slice(0,50)},
    {id:'tl',    label:'Χρονολόγιο',         icon:'column',  fields:[{k:'event',t:'line',l:'Γεγονός'},{k:'year',t:'num',l:'Έτος'}], sum:it=>it.year+' — '+it.event},
    {id:'vid',   label:'Βίντεο',             icon:'theatre', single:true, fields:[{k:'title',t:'line',l:'Τίτλος'},{k:'desc',t:'line',l:'Περιγραφή'},{k:'url',t:'line',l:'YouTube / embed URL (προαιρετικό)'},{k:'q',t:'qlist',l:'Ερωτήσεις κατανόησης (μία ανά γραμμή: mm:ss | ερώτηση)'}]},
  ];

  let curCourse='g3', curUnit=null, curType='mc', editIdx=null;

  function units(){ return ISTORIA.getUnits(curCourse); }
  function type(){ return TYPES.find(t=>t.id===curType); }
  function listOf(typeId){ const v=ISTORIA.getItems(curCourse, curUnit, typeId); return Array.isArray(v)?v:[]; }
  function vidOf(){ const v=ISTORIA.getItems(curCourse, curUnit, 'vid'); return (v&&!Array.isArray(v))?v:{title:'',desc:'',url:'',q:[]}; }
  function count(typeId){ if(typeId==='vid'){ const v=vidOf(); return v&&v.title?1:0; } return listOf(typeId).length; }

  /* ── sidebar ──────────────────────────────────────────────────────── */
  function renderSide(){
    $('#adm-courses').innerHTML = ISTORIA.listCourses().map(c=>{
      const info=ISTORIA.courseInfo(c);
      return `<button class="unit ${c===curCourse?'on':''}" onclick="ADM.selCourse('${c}')"><span class="rn">${(ISTORIA.getMeta(c).hasAI)?'★':'·'}</span>${esc(info.label)}</button>`;
    }).join('');
    $('#adm-units').innerHTML = units().map(u=>`<button class="unit ${u.id===curUnit?'on':''}" onclick="ADM.selUnit('${u.id}')"><span class="rn">${u.rn||''}</span>${esc(u.t)}</button>`).join('');
    $('#adm-types').innerHTML = TYPES.map(t=>`<button class="ty ${t.id===curType?'on':''}" onclick="ADM.selType('${t.id}')"><span class="ico">${SYM.icon(t.icon)}</span>${esc(t.label)}<span class="ct">${count(t.id)}</span></button>`).join('');
  }

  /* ── list ─────────────────────────────────────────────────────────── */
  function renderList(){
    const t=type();
    $('#adm-ptitle').textContent=t.label;
    const u=units().find(x=>x.id===curUnit);
    $('#adm-psub').textContent=`${ISTORIA.courseInfo(curCourse).label} · ${u?u.t:''}`;
    if(t.single){ $('#adm-list').innerHTML=''; return; }
    const a=listOf(curType);
    if(!a.length){ $('#adm-list').innerHTML=`<div class="adm-empty">Καμία εγγραφή ακόμη. Πρόσθεσε την πρώτη παρακάτω.</div>`; return; }
    $('#adm-list').innerHTML=a.map((it,i)=>`<div class="itemrow"><span class="ix">${i+1}</span>
      <div class="tx">${escHtml(t.sum(it))}${curType==='mc'?`<small>Σωστή: ${'ΑΒΓΔ'[it.ans]||'-'} · ${(it.opts||[]).length} επιλογές</small>`:''}</div>
      <div class="ops"><button class="iconb" title="Επεξεργασία" onclick="ADM.edit(${i})">✎</button><button class="iconb del" title="Διαγραφή" onclick="ADM.del(${i})">🗑</button></div></div>`).join('');
  }

  /* ── form ─────────────────────────────────────────────────────────── */
  function renderForm(){
    const t=type();
    const it = t.single ? vidOf() : (editIdx!=null ? listOf(curType)[editIdx] : {});
    let html=`<h3><span class="ico" style="font-size:20px;color:var(--terra)">${SYM.icon(t.icon)}</span> ${t.single?'Βίντεο ενότητας':(editIdx!=null?'Επεξεργασία':'Νέα')+' '+t.label.toLowerCase()}</h3>`;
    t.fields.forEach(f=>{
      const v=it[f.k]!=null?it[f.k]:'';
      html+=`<div class="fld"><label>${esc(f.l)}</label>`;
      if(f.t==='area') html+=`<textarea id="f_${f.k}">${escHtml(v)}</textarea>`;
      else if(f.t==='num') html+=`<input id="f_${f.k}" type="number" value="${escAttr(v)}">`;
      else if(f.t==='bool') html+=`<select id="f_${f.k}"><option value="true" ${v===true?'selected':''}>Σωστό</option><option value="false" ${v===false?'selected':''}>Λάθος</option></select>`;
      else if(f.t==='list') html+=`<textarea id="f_${f.k}" placeholder="μία λέξη ανά γραμμή">${escHtml((v||[]).join('\n'))}</textarea>`;
      else if(f.t==='qlist') html+=`<textarea id="f_${f.k}" placeholder="00:42 | Η ερώτηση…">${escHtml((v||[]).map(x=>(x.ts||'')+' | '+(x.q||'')).join('\n'))}</textarea>`;
      else html+=`<input id="f_${f.k}" type="text" value="${escAttr(v)}">`;
      html+=`</div>`;
    });
    if(t.opts){
      const opts=it.opts||['','','',''];
      html+=`<div class="fld"><label>Επιλογές (διάλεξε τη σωστή)</label>`;
      for(let i=0;i<4;i++) html+=`<div class="optrow"><input type="radio" name="correct" value="${i}" ${it.ans===i||(it.ans==null&&i===0)?'checked':''}><span class="ltr">${'ΑΒΓΔ'[i]}</span><input type="text" id="o_${i}" value="${escAttr(opts[i]||'')}" placeholder="Επιλογή ${'ΑΒΓΔ'[i]}"></div>`;
      html+=`</div>`;
    }
    html+=`<div class="form-actions"><button class="btn primary" onclick="ADM.submitForm()">${t.single?'Αποθήκευση':(editIdx!=null?'Αποθήκευση':'Προσθήκη')}</button>${(!t.single&&editIdx!=null)?'<button class="btn ghost" onclick="ADM.cancel()">Άκυρο</button>':''}</div>`;
    $('#adm-editor').innerHTML=html;
  }

  function submitForm(){
    const t=type(), obj={};
    t.fields.forEach(f=>{ const el=$('#f_'+f.k); let v=el.value;
      if(f.t==='num') v=parseInt(v)||0;
      else if(f.t==='bool') v=(v==='true');
      else if(f.t==='list') v=v.split('\n').map(x=>x.trim()).filter(Boolean);
      else if(f.t==='qlist') v=v.split('\n').map(x=>x.trim()).filter(Boolean).map(line=>{ const p=line.split('|'); return {ts:(p[0]||'').trim(), q:(p.slice(1).join('|')||'').trim()}; }).filter(x=>x.q);
      obj[f.k]=v; });
    if(t.opts){ obj.opts=[0,1,2,3].map(i=>$('#o_'+i).value.trim()); obj.ans=parseInt(($$('input[name=correct]:checked')[0]||{}).value||0); }
    const first=t.fields[0];
    if(!obj[first.k] || (typeof obj[first.k]==='string' && !obj[first.k].trim())){ toast('Συμπλήρωσε τουλάχιστον το «'+first.l+'»'); return; }
    if(t.single){ ISTORIA.setItems(curCourse,curUnit,'vid',obj); toast('Αποθηκεύτηκε ✓'); }
    else { const a=listOf(curType).slice(); if(editIdx!=null) a[editIdx]=obj; else a.push(obj); ISTORIA.setItems(curCourse,curUnit,curType,a); toast(editIdx!=null?'Αποθηκεύτηκε':'Προστέθηκε ✓'); }
    editIdx=null; renderAll();
  }
  function edit(i){ editIdx=i; renderAll(); $('#adm-editor').scrollIntoView({behavior:'smooth',block:'center'}); }
  function cancel(){ editIdx=null; renderAll(); }
  function del(i){ if(!confirm('Διαγραφή εγγραφής;'))return; const a=listOf(curType).slice(); a.splice(i,1); ISTORIA.setItems(curCourse,curUnit,curType,a); if(editIdx===i)editIdx=null; renderAll(); toast('Διαγράφηκε'); }

  function selCourse(c){ curCourse=c; curUnit=(units()[0]||{}).id; editIdx=null; renderAll(); }
  function selUnit(id){ curUnit=id; editIdx=null; renderAll(); }
  function selType(id){ curType=id; editIdx=null; renderAll(); }

  /* ── import / export / reset ──────────────────────────────────────── */
  function exportJSON(){ const blob=new Blob([ISTORIA.exportJSON(curCourse)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='istoria-'+curCourse+'.json'; a.click(); toast('Εξήχθη istoria-'+curCourse+'.json'); }
  function importJSON(file){ if(!file)return; const r=new FileReader(); r.onload=()=>{ try{ ISTORIA.importJSON(curCourse, r.result); editIdx=null; renderAll(); toast('Εισήχθη ✓'); }catch(e){ toast('Μη έγκυρο JSON'); } }; r.readAsText(file); }
  function resetAll(){ if(!confirm('Επαναφορά στο αρχικό περιεχόμενο; (χάνονται οι αλλαγές σου για αυτή την τάξη)'))return; ISTORIA.reset(curCourse); editIdx=null; renderAll(); toast('Έγινε επαναφορά'); }

  let tt; function toast(m){ const t=$('#adm-toast'); t.textContent=m; t.classList.add('on'); clearTimeout(tt); tt=setTimeout(()=>t.classList.remove('on'),1900); }

  function renderAll(){ renderSide(); renderList(); renderForm(); }

  /* ── gate + boot ──────────────────────────────────────────────────── */
  function login(){ const v=$('#adm-pass').value.trim().toLowerCase(); if(v==='admin'){ $('#adm-gate').style.display='none'; } else { $('#adm-pass').style.borderColor='var(--terra)'; $('#adm-pass').value=''; $('#adm-pass').placeholder='λάθος κωδικός'; } }

  function boot(){
    curCourse = ISTORIA.resolveCourse();
    curUnit = (units()[0]||{}).id;
    renderAll();
  }

  window.ADM = { boot, login, selCourse, selUnit, selType, edit, cancel, del, submitForm, exportJSON, importJSON, resetAll };
})();
