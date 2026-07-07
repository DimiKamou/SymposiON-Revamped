/* ════════════════════════════════════════════════════════════════════
   study.js — engine for «Συντακτικό» (Ancient Greek syntax practice)
   Consumes window.SYNTAX.topics (each data/<id>.js pushes one topic).
   Tabs per topic: Θεωρία · Ασκήσεις · Κατανόηση. Interactive mc + match
   exercises with self-check + a ↻ refresh that re-rolls a random subset.
   Admin overrides via localStorage (syntaktiko.admin). Zero dependencies.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  const G = window.SYNTAX = window.SYNTAX || { topics:[] };
  const $  = (s,r)=> (r||document).querySelector(s);
  const $$ = (s,r)=> Array.from((r||document).querySelectorAll(s));
  const el = (tag,cls,html)=>{ const n=document.createElement(tag); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n; };
  const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  function shuffle(a){ a=a.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
  const sample = (a,n)=> shuffle(a).slice(0,n);

  const ADMIN_KEY='syntaktiko.admin', LAST_KEY='syntaktiko.last';

  function applyOverrides(){
    let ov={}; try{ ov=JSON.parse(localStorage.getItem(ADMIN_KEY)||'{}'); }catch(e){}
    G.topics.forEach(t=>{ const o=ov[t.id]; if(o) Object.keys(o).forEach(k=> t[k]=o[k]); });
  }

  function buildSidebar(){
    const nav=$('#nav'); nav.innerHTML='';
    G.topics.forEach(t=>{
      const b=el('button','unit-link');
      b.dataset.id=t.id;
      b.innerHTML=`<span class="n">${esc(t.num)}</span><span class="tt">${esc(t.title)}${t.subtitle?'<span class="au">'+esc(t.subtitle)+'</span>':''}</span>`;
      b.onclick=()=>show(t.id);
      nav.appendChild(b);
    });
  }

  function show(id){
    const t=G.topics.find(x=>x.id===id)||G.topics[0];
    if(!t){ $('#main').innerHTML='<p class="empty">Δεν βρέθηκαν ενότητες.</p>'; return; }
    try{ localStorage.setItem(LAST_KEY,t.id); }catch(e){}
    $$('.unit-link').forEach(b=> b.classList.toggle('active', b.dataset.id===t.id));

    const tabs=[
      ['theory','Θεωρία',   ()=>renderTheory(t)],
      ['ex','Ασκήσεις',     ()=>renderEx(t)],
      ['quiz','Κατανόηση',  ()=>renderQuiz(t)],
    ].filter(x=>{
      if(x[0]==='theory') return t.theory&&t.theory.length;
      if(x[0]==='ex')     return t.exercises&&t.exercises.length;
      if(x[0]==='quiz')   return t.quiz&&t.quiz.length;
      return true;
    });

    const idx=G.topics.indexOf(t), prev=G.topics[idx-1], next=G.topics[idx+1];
    const main=$('#main'); main.innerHTML='';
    const head=el('header','doc-head');
    head.innerHTML=`<div class="cite">Συντακτικό · Αρχαία Ελληνικά</div>
      <h2>${esc(t.title)}</h2>${t.subtitle?'<div class="arc-tag">'+esc(t.subtitle)+'</div>':''}`;
    main.appendChild(head);
    if(t.intro) main.appendChild(el('div','theme',esc(t.intro)));

    const bar=el('div','tabbar'); bar.setAttribute('role','tablist');
    const host=el('div','panel-host');
    tabs.forEach((x,i)=>{
      const btn=el('button','tab',esc(x[1])); btn.setAttribute('role','tab'); btn.dataset.accent=x[0];
      btn.onclick=()=>{ $$('.tab',bar).forEach(z=>z.setAttribute('aria-selected','false')); btn.setAttribute('aria-selected','true'); host.innerHTML=''; host.appendChild(x[2]()); };
      bar.appendChild(btn); if(i===0) setTimeout(()=>btn.click(),0);
    });
    main.append(bar,host);

    const pager=el('div','pager');
    const pb=el('button',null, prev?`<span class="lbl">Προηγούμενη</span>${esc(prev.num)}. ${esc(prev.title)}`:'');
    const nb=el('button',null, next?`<span class="lbl">Επόμενη</span>${esc(next.num)}. ${esc(next.title)}`:'');
    if(prev) pb.onclick=()=>show(prev.id); else pb.disabled=true;
    if(next) nb.onclick=()=>show(next.id); else nb.disabled=true;
    pager.append(pb,nb); main.appendChild(pager);
    window.scrollTo(0,0);
  }

  function renderTheory(t){
    const wrap=el('div','panel'); wrap.removeAttribute('hidden');
    (t.theory||[]).forEach(sec=>{
      const note=el('div','book-note');
      if(sec.h) note.appendChild(el('span','src',esc(sec.h)));
      (sec.paras||[]).forEach(p=> note.appendChild(el('p',null,esc(p))));
      wrap.appendChild(note);
    });
    return wrap;
  }

  function renderEx(t){
    const wrap=el('div','panel'); wrap.removeAttribute('hidden');
    wrap.appendChild(el('h3','sec-h accent-ex','Ασκήσεις'));
    const host=el('div');
    const N=Math.min(6, t.exercises.length);
    const bar=el('div','gen-bar');
    const btn=el('button','gen-btn','<span class="ico">↻</span> Νέες ασκήσεις');
    btn.onclick=()=>roll();
    bar.appendChild(btn);
    if(t.exercises.length>N) bar.appendChild(el('span','gen-hint',`Τράπεζα ${t.exercises.length} ασκήσεων — κάθε φορά ${N} τυχαίες.`));
    function roll(){
      host.innerHTML='';
      sample(t.exercises, N).forEach((x,i)=> host.appendChild(exerciseCard(x,i)));
    }
    wrap.append(bar,host); roll();
    return wrap;
  }

  function exerciseCard(x,i){
    const type=x.type||'mc';
    const box=el('div','ex ex--'+(type==='match'?'match':'mc'));
    box.appendChild(el('span','kind', type==='match'?'Αντιστοίχιση':'Χαρακτηρισμός / Πολλαπλή επιλογή'));
    if(x.q) box.appendChild(el('div','q',`<span class="qn">${i+1}.</span>${esc(x.q)}`));
    if(type==='match' && Array.isArray(x.pairs)) box.appendChild(matchBlock(x));
    else box.appendChild(mcBlock(x));
    return box;
  }

  function mcBlock(x){
    const holder=el('div'); const opts=el('div','opts');
    const explain=el('div','explain'); explain.hidden=true; if(x.explain) explain.innerHTML=esc(x.explain);
    (x.opts||[]).forEach((o,idx)=>{
      const b=el('button','opt',`<span class="mk">${'ΑΒΓΔΕ'[idx]||idx+1}</span><span>${esc(o)}</span>`);
      b.onclick=()=>{ $$('.opt',opts).forEach(z=>z.disabled=true); if(idx===x.correct) b.classList.add('correct'); else { b.classList.add('incorrect'); const c=$$('.opt',opts)[x.correct]; if(c)c.classList.add('correct'); } explain.hidden=false; };
      opts.appendChild(b);
    });
    holder.append(opts,explain); return holder;
  }

  function matchBlock(x){
    const holder=el('div'); const grid=el('div','match'); const L=el('div','col'), R=el('div','col');
    const pairs=x.pairs.map((p,idx)=>({a:p[0],b:p[1],idx}));
    const rShuf=shuffle(pairs); let sel=null, done=0;
    const score=el('div','scoreline'); score.hidden=true;
    pairs.forEach(p=>{ const it=el('button','item'); it.innerHTML='<span class="grk">'+esc(p.a)+'</span>'; it.dataset.idx=p.idx; it.onclick=()=>{ if(sel)sel.classList.remove('sel'); sel=it; it.classList.add('sel'); }; L.appendChild(it); });
    rShuf.forEach(p=>{ const it=el('button','item',esc(p.b)); it.dataset.idx=p.idx; it.onclick=()=>{ if(!sel) return; if(sel.dataset.idx===it.dataset.idx){ sel.classList.remove('sel'); sel.classList.add('done'); it.classList.add('done'); sel=null; done++; if(done===pairs.length){ score.hidden=false; score.textContent='Όλα σωστά! ✓'; } } else { it.classList.add('miss'); setTimeout(()=>it.classList.remove('miss'),320); } }; R.appendChild(it); });
    grid.append(L,R); holder.append(grid,score); return holder;
  }

  function renderQuiz(t){
    const wrap=el('div','panel'); wrap.removeAttribute('hidden');
    wrap.appendChild(el('h3','sec-h accent-quiz','Έλεγχος κατανόησης'));
    const host=el('div'); const N=Math.min(5, t.quiz.length);
    const bar=el('div','gen-bar');
    const btn=el('button','gen-btn','<span class="ico">↻</span> Νέες ερωτήσεις'); btn.onclick=()=>roll();
    bar.appendChild(btn);
    if(t.quiz.length>N) bar.appendChild(el('span','gen-hint',`Τράπεζα ${t.quiz.length} ερωτήσεων — κάθε φορά ${N} τυχαίες.`));
    function roll(){ host.innerHTML=''; sample(t.quiz,N).forEach((q,i)=>{ const box=el('div','ex ex--quiz'); box.appendChild(el('div','q',`<span class="qn">${i+1}.</span>${esc(q.q)}`)); box.appendChild(mcBlock(q)); host.appendChild(box); }); }
    wrap.append(bar,host); roll();
    return wrap;
  }

  function initSearch(){ const s=$('#search'); if(s) s.oninput=e=>{ const q=(e.target.value||'').toLowerCase(); $$('.unit-link').forEach(b=> b.hidden = q && !b.textContent.toLowerCase().includes(q)); }; }

  function boot(){
    if(!G.topics.length){ $('#main').innerHTML='<p class="empty">Δεν έχουν φορτωθεί ενότητες.</p>'; return; }
    applyOverrides();
    G.topics.sort((a,b)=>(a.num||0)-(b.num||0));
    buildSidebar(); initSearch();
    let want=null; try{ want=new URLSearchParams(location.search).get('topic'); }catch(e){}
    if(want && G.topics.some(t=>t.id===want)){ show(want); return; }
    let start=null; try{ start=localStorage.getItem(LAST_KEY); }catch(e){}
    show((start && G.topics.some(t=>t.id===start))?start:G.topics[0].id);
  }
  if(document.readyState!=='loading') boot(); else document.addEventListener('DOMContentLoaded', boot);
})();
