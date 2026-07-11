/* ============================================================================
 *  SymposiON — Λατινικά · Κείμενα (Latin Text Analysis Panel)
 *  Self-contained React 18 component (compiled at runtime by @babel/standalone,
 *  same isolated-iframe pattern as the Voyage literature games).
 *
 *  The whole panel is DATA-DRIVEN: one data module per Ενότητα
 *  (units/unit16.js, unit17.js, …) exporting `UNIT`. Drop in a new data file →
 *  all 7 parts (Κείμενο, Μετάφραση, Ουσιαστικά/Επίθετα, Παραθετικά, Αντωνυμίες,
 *  Ρήματα, SOS), colours, brackets, marks, arrows, hovers and tables regenerate.
 *
 *  This file preserves the reference design's data schema and algorithms
 *  (connection-colour groups, dependency arrows, syntax marks, admin editing)
 *  exactly; only the view layer was moved onto real React/JSX.
 * ==========================================================================*/
(function () {
  'use strict';

  /* s("prop:val;prop:val") -> React style object.
     Keeps CSS custom properties (--x) and var(...) verbatim; camelCases the
     rest. Lets us copy the reference's inline style strings unchanged. */
  function s(css) {
    var o = {};
    String(css).split(';').forEach(function (decl) {
      var i = decl.indexOf(':');
      if (i < 0) return;
      var k = decl.slice(0, i).trim();
      var v = decl.slice(i + 1).trim();
      if (!k || !v) return;
      if (k.slice(0, 2) === '--') { o[k] = v; return; }
      k = k.replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
      o[k] = v;
    });
    return o;
  }

  class LatinUnitPanel extends React.Component {
    state = {
      loaded:false, err:'', unit:null,
      part:'text', dir:'A',
      showSyntax:false, showAnalysis:true, hideGreek:false, printAll:false, dark:false,
      query:'', pinned:false, highlight:null, revealed:{}, admin:false, editId:null, showArrows:false,
      practice:null,
      pop:{show:false,x:0,y:0,tf:'translate(-50%,-100%)',l:'',r:'',g:'',d:'',note:''}
    };

    rootRef = React.createRef();
    scrollRef = React.createRef();
    arrowSvgRef = React.createRef();
    arrowPathRef = React.createRef();
    arrowAllRef = React.createRef();
    _scrollWanted = false;
    _scrollPractice = false;

    clauseMeta = {
      kyria:{label:'Κύρια', hue:null},
      xroniki:{label:'Χρονική', hue:250},
      aitiologiki:{label:'Αιτιολογική', hue:28},
      teliki:{label:'Τελική', hue:150},
      voulitiki:{label:'Βουλητική', hue:305},
      endoiastiki:{label:'Ενδοιαστική', hue:12},
      symperasmatiki:{label:'Συμπερασματική', hue:330},
      anaforiki:{label:'Αναφορική', hue:195},
      ypothetiki:{label:'Υποθετική', hue:95},
      plagia:{label:'Πλάγια ερωτηματική', hue:275},
      eidiki:{label:'Ειδική', hue:190},
      paravoliki:{label:'Παραβολική', hue:60},
      enantiomatiki:{label:'Εναντιωματική', hue:340},
      paraxoritiki:{label:'Παραχωρητική', hue:20}
    };

    themes = {
      A:{
        '--bg':'#ecede7','--panel':'#fbfcf8','--panel2':'#eff1ea','--fg':'#20261e','--muted':'#5f6b5b','--line':'#dae0d3','--line2':'#e7ebe1',
        '--accent':'oklch(0.47 0.10 168)','--accent2':'oklch(0.42 0.11 168)','--on-accent':'#f4faf2','--hl':'oklch(0.9 0.13 116)',
        '--font-ui':"'Commissioner',system-ui,sans-serif",'--font-serif':"'EB Garamond',Georgia,serif",'--font-latin':"'EB Garamond',Georgia,serif",'--font-mono':"'IBM Plex Mono',monospace",
        '--r':'5px','--r-lg':'10px','--body-dir':'column','--nav-dir':'row','--nav-w':'100%','--nav-wrap':'wrap','--nav-pad':'11px clamp(16px,3vw,32px)','--nav-bb':'1px','--nav-br':'0px','--maxw':'1060px'
      },
      B:{
        '--bg':'#e7ecf1','--panel':'#ffffff','--panel2':'#f3f6f9','--fg':'#121a24','--muted':'#5c6b7a','--line':'#dbe3ec','--line2':'#eaeff4',
        '--accent':'oklch(0.55 0.16 264)','--accent2':'oklch(0.49 0.17 264)','--on-accent':'#ffffff','--hl':'oklch(0.9 0.08 250)',
        '--font-ui':"'IBM Plex Sans',system-ui,sans-serif",'--font-serif':"'IBM Plex Sans',system-ui,sans-serif",'--font-latin':"'IBM Plex Serif',Georgia,serif",'--font-mono':"'IBM Plex Mono',monospace",
        '--r':'12px','--r-lg':'18px','--body-dir':'row','--nav-dir':'column','--nav-w':'258px','--nav-wrap':'nowrap','--nav-pad':'18px 16px','--nav-bb':'0px','--nav-br':'1px','--maxw':'1060px'
      }
    };

    darkOverrides = {
      A:{ '--bg':'#191c17','--panel':'#212620','--panel2':'#2a2f28','--fg':'#e9e7dc','--muted':'#9ba695','--line':'#363d33','--line2':'#2c332a','--accent':'oklch(0.74 0.13 165)','--accent2':'oklch(0.68 0.13 165)','--on-accent':'#0f130d','--hl':'oklch(0.5 0.13 116)' },
      B:{ '--bg':'#0f151b','--panel':'#18202a','--panel2':'#202a35','--fg':'#e6edf4','--muted':'#93a2b1','--line':'#2b3742','--line2':'#232e39','--accent':'oklch(0.74 0.15 264)','--accent2':'oklch(0.68 0.15 264)','--on-accent':'#0a0e14','--hl':'oklch(0.46 0.12 255)' }
    };

    roleDefs = [
      {re:/Ρήμα/, label:'Ρήμα', hue:25},
      {re:/Υποκείμεν/, label:'Υποκείμενο', hue:255},
      {re:/Αντικείμεν/, label:'Αντικείμενο', hue:150},
      {re:/παρέμφ|απαρεμφ/, label:'Απαρέμφατο', hue:312},
      {re:/Επιθετικ/, label:'Επιθετικός', hue:200},
      {re:/Εμπρόθ/, label:'Εμπρόθετος', hue:60},
      {re:/ενική/, label:'Γενική', hue:340},
      {re:/φαιρετ|αφαιρ/, label:'Αφαιρετική', hue:95},
      {re:/ατηγορ/, label:'Κατηγορούμενο', hue:225},
      {re:/Παράθεση/, label:'Παράθεση', hue:285},
      {re:/πιρρ|πίρρ/, label:'Επιρρηματικός', hue:130}
    ];

    partDefs = [
      {id:'text', rn:'I', label:'Κείμενο'},
      {id:'trans', rn:'II', label:'Μετάφραση'},
      {id:'nouns', rn:'III', label:'Ουσιαστικά & Επίθετα'},
      {id:'compar', rn:'IV', label:'Παραθετικά'},
      {id:'pron', rn:'V', label:'Αντωνυμίες'},
      {id:'verbs', rn:'VI', label:'Ρήματα'},
      {id:'sos', rn:'✦', label:'SOS'},
      {id:'transforms', rn:'⇄', label:'Μετατροπές'}   // Μέρος VIII — μόνο όταν η ενότητα έχει `transforms`
    ];

    componentDidMount(){
      this.applyTheme();
      const p=this.props||{};
      const patch={};
      if(p.direction==='A'||p.direction==='B') patch.dir=p.direction;
      if(p.startPart) patch.part=p.startPart;
      if(typeof p.syntaxDefault==='boolean') patch.showSyntax=p.syntaxDefault;
      try{ if(localStorage.getItem('latinAdmin')==='1') patch.admin=true; }catch(e){}
      if(Object.keys(patch).length) this.setState(patch);
      this.load();
      document.addEventListener('keydown', this.onKey);
      document.addEventListener('focusout', this.onEditBlur);
      this._onResize=()=>this.drawAllArrows(); window.addEventListener('resize', this._onResize);
    }
    componentWillUnmount(){ document.removeEventListener('keydown', this.onKey); document.removeEventListener('focusout', this.onEditBlur); window.removeEventListener('resize', this._onResize); }
    componentDidUpdate(){ this.applyTheme(); if(this._scrollWanted){ this._scrollWanted=false; this.doScroll(); } if(this._scrollPractice){ this._scrollPractice=false; const prq=this.state.practice; if(prq&&prq.phase!=='done'&&prq.steps[prq.idx]){ const stq=prq.steps[prq.idx]; const tid= stq.kind==='role'? stq.id : (stq.clauseIds&&stq.clauseIds[0]); const c=this.scrollRef.current; const el=c&&c.querySelector('[data-tid="'+tid+'"]'); if(el){ const cr=c.getBoundingClientRect(), er=el.getBoundingClientRect(); const delta=(er.top-cr.top)-(c.clientHeight/2)+(er.height/2); c.scrollTo({top:Math.max(0,c.scrollTop+delta), behavior:'smooth'}); } } } this.drawAllArrows(); }

    onKey = (e)=>{ if(e.key!=='Escape') return; if(this.state.practice){ this.exitPractice(); return; } this.setState(s=>({pinned:false, pop:{...s.pop,show:false}})); };

    /* The unit data (an ES module `export const UNIT`) is imported by a small
       module <script> in the shell HTML, which sets window.LATIN_UNIT and fires
       'latin-unit-ready'. Keeping the dynamic import out of this Babel-compiled
       file avoids any module/transform surprises and keeps unit files clean. */
    load(){
      const apply = ()=>{
        try{
          if(window.LATIN_UNIT_ERR){ this.setState({err:String(window.LATIN_UNIT_ERR), loaded:true}); return; }
          const orig = window.LATIN_UNIT;
          if(!orig){ this.setState({err:'Δεν βρέθηκαν δεδομένα ενότητας.', loaded:true}); return; }
          this._origUnit = JSON.parse(JSON.stringify(orig));
          let U = JSON.parse(JSON.stringify(orig));
          try{ const saved=localStorage.getItem('latin-unit-'+U.number); if(saved){ const sv=JSON.parse(saved); if(sv&&sv.periods && sv.dataVersion===U.dataVersion) U=sv; } }catch(e){}
          this.assignIds(U);
          this.setState({unit:U, loaded:true, err:''});
          try{ document.title = 'Λατινικά · Ενότητα '+U.number+' — '+(U.title||''); }catch(e){}
        }catch(err){ console.error('Data load error:', err); this.setState({err:String(err&&err.message||err), loaded:true}); }
      };
      if(window.LATIN_UNIT || window.LATIN_UNIT_ERR) apply();
      else window.addEventListener('latin-unit-ready', apply, {once:true});
    }

    applyTheme(){ const el=this.rootRef.current; if(!el) return; const dir=this.state.dir; const base=this.themes[dir]||this.themes.A; const t=this.state.dark? Object.assign({}, base, this.darkOverrides[dir]||{}) : base; for(const k in t) el.style.setProperty(k, t[k]); if(this.state.printAll){ el.style.height='auto'; el.style.minHeight='0'; el.style.overflow='visible'; } else { el.style.height='100dvh'; el.style.minHeight='0'; el.style.overflow='hidden'; } }

    keyOf(s){ if(!s) return ''; const parts=String(s).split(/[\s,/()]+/).filter(Boolean); return (parts[0]||'').replace(/[^A-Za-z]/g,'').toLowerCase(); }
    clauseColor(key){ if(!key || key==='kyria') return 'var(--accent)'; const m=this.clauseMeta[key]; const hue=(m&&m.hue!=null)?m.hue:250; return 'oklch('+(this.state.dark?0.74:0.56)+' 0.15 '+hue+')'; }
    composeRole(t){ return (t.r||'') + (t.to? ' '+t.to : ''); }
    roleColorL(){ return this.state.dark ? 0.76 : 0.5; }
    roleColorsFor(role){ if(!role) return ['var(--muted)']; const L=this.roleColorL(); const out=[]; this.roleDefs.forEach(d=>{ if(d.re.test(role)) out.push('oklch('+L+' 0.16 '+d.hue+')'); }); if(!out.length) out.push('var(--muted)'); return out; }
    splitGrad(cols){ if(cols.length<2) return cols[0]; const seg=100/cols.length; return 'linear-gradient(135deg,'+cols.map((c,i)=>c+' '+(seg*i).toFixed(1)+'% '+(seg*(i+1)).toFixed(1)+'%').join(',')+')'; }
    swatchStyle(cols){ return {width:'11px',height:'11px',borderRadius:'3px',flex:'none',alignSelf:'center',boxShadow:'0 0 0 1px rgba(0,0,0,.06) inset',background: cols.length>1 ? this.splitGrad(cols) : cols[0]}; }
    toggleDark=()=>{ this.setState(s=>({dark:!s.dark})); };

    groupPalette = [25,150,255,300,60,190,335,95,225,130,285,45];
    buildGroups(){
      const u=this.state.unit; const G={tok:new Map(), cl:new Map(), head:new Map()}; if(!u||!u.periods) return G;
      const L=this.state.dark?0.72:0.5; const c=(hue)=>'oklch('+L+' 0.16 '+hue+')';
      let pi=0; const nextCol=()=>c(this.groupPalette[(pi++)%this.groupPalette.length]);
      const isInf=(t)=> !!(t.g && /απαρέμφατο/.test(t.g));
      const isConn=(t)=> !!(t.r && t.r.trim()==='Σύνδεσμος');
      const norm=(x)=> (x||'').replace(/[^A-Za-z]/g,'').toLowerCase();
      const headName=(to)=>{ if(!to) return ''; let x=to.replace(/\([^)]*\)/g,' ').replace(/^\s*(στον|στη[νς]?|στους|στα|στο)\s+/,''); return norm(x.trim().split(/[\s,]+/)[0]); };
      const visit=(cl)=>{
        const clauseCol=nextCol(); G.cl.set(cl, clauseCol);
        const infCols={};
        cl.kids.forEach(t=>{ if(!t.kids && isInf(t)) infCols[norm(t.l)]=nextCol(); });
        cl.kids.forEach(t=>{
          if(t.kids || t.plain) return;
          if(isConn(t)){ G.tok.set(t,['var(--muted)']); return; }
          if(isInf(t)){ G.tok.set(t,[clauseCol, infCols[norm(t.l)]]); return; }
          const hn=headName(t.to);
          if(hn && infCols[hn]){ G.tok.set(t,[infCols[hn]]); return; }
          G.tok.set(t,[clauseCol]);
        });
        const nameToId={}; cl.kids.forEach(t=>{ if(!t.kids && t.l){ const fw=norm(t.l.split(/\s+/)[0]); if(nameToId[fw]==null) nameToId[fw]=t._id; } });
        cl.kids.forEach(t=>{ if(t.kids||t.plain) return; const hn=headName(t.to); if(hn && nameToId[hn]!=null && nameToId[hn]!==t._id) G.head.set(t, nameToId[hn]); });
        cl.kids.forEach(t=>{ if(t.kids) visit(t); });
      };
      u.periods.forEach(p=> p.kids.forEach(t=>{ if(t.kids) visit(t); else if(t.r && !t.plain) G.tok.set(t,['var(--muted)']); }));
      return G;
    }
    textColorStyle(cols){ if(!cols||!cols.length) return {}; if(cols.length<2) return {color:cols[0]}; const seg=100/cols.length; const stops=cols.map((x,i)=>x+' '+(seg*i).toFixed(1)+'% '+(seg*(i+1)).toFixed(1)+'%').join(','); return {background:'linear-gradient(90deg,'+stops+')', WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent'}; }

    // ── ADMIN / EDITING ──
    adminPin = '5384';
    assignIds(u){ let i=1; const walk=(arr)=>{ if(!arr) return; arr.forEach(t=>{ t._id=i++; if(t.kids) walk(t.kids); }); }; (u&&u.periods||[]).forEach(p=>walk(p.kids)); }
    _persist(u){ try{ localStorage.setItem('latin-unit-'+u.number, JSON.stringify(u)); }catch(e){} }
    editData(mut){ const u=JSON.parse(JSON.stringify(this.state.unit)); mut(u); this._persist(u); this.setState({unit:u}); }
    setByPath(o,path,val){ const ks=String(path).split('.'); let x=o; for(let j=0;j<ks.length-1;j++){ x=x[ks[j]]; if(x==null) return; } const last=ks[ks.length-1]; x[last]= last==='number' ? (parseInt(val,10)||x[last]) : val; }
    commitPath=(path,val)=>{ this.editData(u=>this.setByPath(u,path,val)); };
    onEditBlur=(e)=>{ if(!this.state.admin) return; const el=e.target; if(!el||!el.getAttribute) return; const p=el.getAttribute('data-edit'); if(!p) return; this.commitPath(p, (el.textContent||'').trim()); };
    editToken=(field,e)=>{ const id=this.state.editId; if(id==null) return; const val=(e&&e.target)?e.target.value:''; const u=JSON.parse(JSON.stringify(this.state.unit)); const walk=(arr)=>arr.forEach(t=>{ if(t._id===id) t[field]=val; if(t.kids) walk(t.kids); }); u.periods.forEach(p=>walk(p.kids)); this._persist(u); const pk={r:'rawR',to:'toRaw',g:'g',d:'d',note:'note',l:'l'}[field]; this.setState(st=>({unit:u, pop: pk? Object.assign({}, st.pop, {[pk]:val}) : st.pop})); };
    toggleAdmin=()=>{ if(this.state.admin){ this.setState({admin:false, editId:null}); try{localStorage.removeItem('latinAdmin');}catch(e){} return; } const p=window.prompt('Κωδικός καθηγητή (admin):'); if(p===this.adminPin){ this.setState({admin:true}); try{localStorage.setItem('latinAdmin','1');}catch(e){} } else if(p!=null){ window.alert('Λάθος κωδικός.'); } };
    exportData=()=>{ const u=JSON.parse(JSON.stringify(this.state.unit)); const strip=(arr)=>{ if(!arr) return; arr.forEach(t=>{ delete t._id; if(t.kids) strip(t.kids); }); }; (u.periods||[]).forEach(p=>strip(p.kids)); const js='// '+(u.course||'')+' — Ενότητα '+u.number+'\nexport const UNIT = '+JSON.stringify(u,null,2)+';\n\nexport default UNIT;\n'; const blob=new Blob([js],{type:'text/javascript'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='unit'+u.number+'.js'; document.body.appendChild(a); a.click(); setTimeout(()=>{ URL.revokeObjectURL(a.href); a.remove(); },120); };
    resetData=()=>{ if(!window.confirm('Επαναφορά αρχικών δεδομένων; Θα χαθούν οι αλλαγές σε αυτό το πρόγραμμα περιήγησης.')) return; try{ localStorage.removeItem('latin-unit-'+this.state.unit.number); }catch(e){} const U=JSON.parse(JSON.stringify(this._origUnit||this.state.unit)); this.assignIds(U); this.setState({unit:U, editId:null}); };

    setPart=(id)=>{ this.setState({part:id}); };
    setDir=(d)=>{ this.setState({dir:d}); };
    toggleSyntax=()=>{ this.setState(s=>({showSyntax:!s.showSyntax})); };
    toggleAnalysis=()=>{ this.setState(s=>({showAnalysis:!s.showAnalysis})); };
    toggleGreek=()=>{ this.setState(s=>({hideGreek:!s.hideGreek, revealed:{}})); };
    revealLine=(i)=>{ if(!this.state.hideGreek) return; this.setState(s=>({revealed:Object.assign({}, s.revealed, {[i]: !s.revealed[i]})})); };
    onSearch=(e)=>{ this.setState({query:e.target.value}); };
    clearSearch=()=>{ this.setState({query:''}); };
    clearHighlight=()=>{ this.setState({highlight:null}); };
    closePop=()=>{ this.setState(s=>({pinned:false, pop:{...s.pop,show:false}})); };
    doPrint=()=>{ this.setState({printAll:true}, ()=>{ setTimeout(()=>{ try{window.print();}catch(e){} this.setState({printAll:false}); }, 140); }); };

    // ── ΑΣΚΗΣΗ ΣΥΝΤΑΞΗΣ (guided practice) ────────────────────────────────────
    // Per clause: (1) "βρες το ρήμα" — click the verb in the (highlighted)
    // clause; then (2..n) three-option role questions for subject → object →
    // the remaining terms. Popups/overlays are suppressed so answers don't leak.
    buildPracticeSteps(){
      const u=this.state.unit; const steps=[]; if(!u||!u.periods) return steps;
      const isV=t=>/^Ρήμα/.test(t.r||''), isS=t=>/^Υποκείμεν/.test(t.r||''), isO=t=>/^Αντικείμεν/.test(t.r||''), isC=t=>((t.r||'').trim()==='Σύνδεσμος');
      const push=(t,kind,cl,ids)=>steps.push({id:t._id, l:t.l, role:t.r, kind, label:cl.label||'', clauseIds:ids});
      const visit=(cl)=>{
        const ws=cl.kids.filter(t=>!t.kids && !t.plain && t.r);
        const ids=ws.map(t=>t._id);
        const verbs=ws.filter(isV);
        if(verbs.length) push(verbs[0],'find',cl,ids);
        ws.filter(isS).forEach(t=>push(t,'role',cl,ids));
        ws.filter(isO).forEach(t=>push(t,'role',cl,ids));
        ws.filter(t=>!isV(t)&&!isS(t)&&!isO(t)&&!isC(t)).forEach(t=>push(t,'role',cl,ids));
        cl.kids.forEach(k=>{ if(k.kids) visit(k); });
      };
      u.periods.forEach(p=>p.kids.forEach(k=>{ if(k.kids) visit(k); }));
      return steps;
    }
    rolePool(){ const set=new Set(); const u=this.state.unit; if(!u) return []; const walk=cl=>cl.kids.forEach(t=>{ if(t.kids) walk(t); else if(t.r) set.add(t.r); }); u.periods.forEach(p=>p.kids.forEach(k=>{ if(k.kids) walk(k); else if(k.r) set.add(k.r); })); return Array.from(set); }
    _mkOptions(step){
      const DEF=['Υποκείμενο','Αντικείμενο','Ρήμα','Επιθετικός προσδ.','Γενική κτητική'];
      let pool=this.rolePool().filter(r=>r!==step.role);
      DEF.forEach(d=>{ if(pool.indexOf(d)<0 && d!==step.role) pool.push(d); });
      for(let i=pool.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const tmp=pool[i]; pool[i]=pool[j]; pool[j]=tmp; }
      const opts=[step.role].concat(pool.slice(0,2));
      for(let i=opts.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); const tmp=opts[i]; opts[i]=opts[j]; opts[j]=tmp; }
      return opts;
    }
    startPractice=()=>{
      const steps=this.buildPracticeSteps(); if(!steps.length) return;
      const cur=this.state.practice;
      const saved=cur&&cur.saved? cur.saved : {syntax:this.state.showSyntax, analysis:this.state.showAnalysis, arrows:this.state.showArrows};
      const st={steps, idx:0, ok:0, done:0, phase:'ask', options: steps[0].kind==='role'? this._mkOptions(steps[0]) : null, pickedRight:null, picked:null, pickedRole:null, saved};
      this._scrollPractice=true;
      this.setState({practice:st, part:'text', showSyntax:false, showAnalysis:false, showArrows:false, pinned:false, pop:Object.assign({},this.state.pop,{show:false})});
    };
    exitPractice=()=>{ const pr=this.state.practice; const sv=(pr&&pr.saved)||{}; this.setState({practice:null, showSyntax:!!sv.syntax, showAnalysis:sv.analysis!==false, showArrows:!!sv.arrows}); };
    practiceClick=(t)=>{
      const pr=this.state.practice; if(!pr||pr.phase!=='ask') return;
      const step=pr.steps[pr.idx]; if(step.kind!=='find') return;
      if(!step.clauseIds||step.clauseIds.indexOf(t._id)<0) return;
      const right=/^Ρήμα/.test(t.r||'');
      this.setState({practice:Object.assign({},pr,{phase:'feedback', pickedRight:right, picked:t.l, pickedRole:t.r||'', ok:pr.ok+(right?1:0), done:pr.done+1})});
    };
    practiceAnswer=(opt)=>{
      const pr=this.state.practice; if(!pr||pr.phase!=='ask') return;
      const step=pr.steps[pr.idx]; const right=(opt===step.role);
      this.setState({practice:Object.assign({},pr,{phase:'feedback', pickedRight:right, picked:opt, pickedRole:null, ok:pr.ok+(right?1:0), done:pr.done+1})});
    };
    practiceNext=()=>{
      const pr=this.state.practice; if(!pr) return;
      const idx=pr.idx+1;
      if(idx>=pr.steps.length){ this.setState({practice:Object.assign({},pr,{phase:'done'})}); return; }
      const step=pr.steps[idx];
      this._scrollPractice=true;
      this.setState({practice:Object.assign({},pr,{idx, phase:'ask', options: step.kind==='role'? this._mkOptions(step) : null, pickedRight:null, picked:null, pickedRole:null})});
    };

    showPop(t, el){ if(!t || !t.r) return; const r=el.getBoundingClientRect(); const above=r.top>150; this.setState({editId:(t._id!=null?t._id:null), pop:{show:true, x:Math.round(r.left+r.width/2), y: above?Math.round(r.top-10):Math.round(r.bottom+10), tf: above?'translate(-50%,-100%)':'translate(-50%,0)', l:t.l, r:this.composeRole(t), g:t.g||'', d:t.d||'', note:t.note||'', rawR:t.r||'', toRaw:t.to||''}}); }
    hidePop(){ if(this.state.pinned) return; if(this.state.pop.show) this.setState(s=>({pop:{...s.pop,show:false}})); }
    togglePin(t, el){ if(!t || !t.r) return; const s=this.state; if(s.pinned && s.pop.show && s.pop.l===t.l){ this.setState(st=>({pinned:false, pop:{...st.pop,show:false}})); } else { this.showPop(t, el); this.setState({pinned:true}); } }

    jumpTo=(form)=>{ this.setState({highlight:this.keyOf(form), part:'text'}); this._scrollWanted=true; };
    doScroll(){ const c=this.scrollRef.current; if(!c||!this.state.highlight) return; const el=c.querySelector('[data-wkey="'+this.state.highlight+'"]'); if(el){ const cr=c.getBoundingClientRect(), er=el.getBoundingClientRect(); const delta=(er.top-cr.top)-(c.clientHeight/2)+(er.height/2); c.scrollTo({top:Math.max(0,c.scrollTop+delta), behavior:'smooth'}); } }
    /* Rectilinear "elbow" connector: up from the word, straight across a lane,
       down into the head — small rounded corners, no big curves. */
    _elbow(x1,y1,x2,y2,lift){ const lane=Math.min(y1,y2)-lift; const dx=x2-x1; if(Math.abs(dx)<14){ return 'M '+x1.toFixed(1)+' '+y1.toFixed(1)+' L '+x2.toFixed(1)+' '+y2.toFixed(1); } const r=Math.min(7,Math.abs(dx)/2); const sgn=dx>0?1:-1; return 'M '+x1.toFixed(1)+' '+y1.toFixed(1)+' L '+x1.toFixed(1)+' '+(lane+r).toFixed(1)+' Q '+x1.toFixed(1)+' '+lane.toFixed(1)+' '+(x1+sgn*r).toFixed(1)+' '+lane.toFixed(1)+' L '+(x2-sgn*r).toFixed(1)+' '+lane.toFixed(1)+' Q '+x2.toFixed(1)+' '+lane.toFixed(1)+' '+x2.toFixed(1)+' '+(lane+r).toFixed(1)+' L '+x2.toFixed(1)+' '+y2.toFixed(1); }
    drawArrow(fromEl){ const svg=this.arrowSvgRef.current, path=this.arrowPathRef.current; if(!svg||!path||!fromEl) return; const hid=fromEl.getAttribute('data-head'); if(!hid){ path.style.opacity=0; return; } const cont=svg.parentNode; const headEl=cont.querySelector('[data-tid="'+hid+'"]'); if(!headEl){ path.style.opacity=0; return; } const cr=cont.getBoundingClientRect(), a=fromEl.getBoundingClientRect(), b=headEl.getBoundingClientRect(); const x1=a.left+a.width/2-cr.left, y1=a.top-cr.top-1; const x2=b.left+b.width/2-cr.left, y2=b.top-cr.top-1; const d=this._elbow(x1,y1,x2,y2,18); path.setAttribute('d',d); path.style.stroke=fromEl.getAttribute('data-col')||'var(--accent)'; path.style.opacity=0.95; }
    hideArrow(){ const path=this.arrowPathRef.current; if(path) path.style.opacity=0; }
    toggleArrows=()=>{ this.setState(s=>({showArrows:!s.showArrows})); };
    drawAllArrows(){ const svg=this.arrowSvgRef.current, g=this.arrowAllRef.current; if(!svg||!g) return; while(g.firstChild) g.removeChild(g.firstChild); if(!this.state.showArrows) return; const cont=svg.parentNode; if(!cont) return; const cr=cont.getBoundingClientRect(); const els=[].slice.call(cont.querySelectorAll('[data-tid]')); const byId={}; els.forEach(e=>{ byId[e.getAttribute('data-tid')]=e; }); const NS='http://www.w3.org/2000/svg'; let na=0; els.forEach(fromEl=>{ const hid=fromEl.getAttribute('data-head'); if(!hid) return; const headEl=byId[hid]; if(!headEl) return; const a=fromEl.getBoundingClientRect(), b=headEl.getBoundingClientRect(); const x1=a.left+a.width/2-cr.left, y1=a.top-cr.top-1; const x2=b.left+b.width/2-cr.left, y2=b.top-cr.top-1; const lift=12+((na++)%4)*8; const d=this._elbow(x1,y1,x2,y2,lift); const p=document.createElementNS(NS,'path'); p.setAttribute('d',d); p.setAttribute('fill','none'); p.setAttribute('stroke', fromEl.getAttribute('data-col')||'var(--accent)'); p.setAttribute('stroke-width','1.5'); p.setAttribute('stroke-linejoin','round'); p.setAttribute('stroke-linecap','round'); p.setAttribute('marker-end','url(#lt-arrow)'); p.setAttribute('opacity','0.8'); g.appendChild(p); }); }

    segStyle(on){ return {cursor:'pointer',border:0,fontFamily:'var(--font-ui)',fontSize:'12.5px',fontWeight:700,padding:'7px 14px',background:(on?'var(--accent)':'transparent'),color:(on?'var(--on-accent)':'var(--muted)'),transition:'all .15s'}; }
    pillStyle(on){ return {display:'inline-flex',alignItems:'center',gap:'7px',cursor:'pointer',fontFamily:'var(--font-ui)',fontSize:'13px',fontWeight:600,padding:'7px 14px',borderRadius:'999px',border:'1px solid '+(on?'transparent':'var(--line)'),background:(on?'var(--accent)':'var(--panel)'),color:(on?'var(--on-accent)':'var(--fg)'),transition:'all .15s'}; }

    buildText(){
      const s=this.state, u=s.unit; if(!u||!u.periods) return null;
      const h=React.createElement, F=React.Fragment, self=this, syn=s.showSyntax; const G=self.buildGroups(); let idx=0;
      const decor=(t,c0)=>{ const r=t.r||'', g=t.g||''; if(/^Ρήμα/.test(r)) return {border:'1.7px solid '+c0, borderRadius:'50%', padding:'1px 8px 2px'}; if(/απαρέμφατο|μετοχ/.test(g)) return {textDecorationLine:'underline', textDecorationStyle:'solid', textDecorationColor:c0, textDecorationThickness:'2px', textUnderlineOffset:'4px'}; if(/Εμπρόθ/.test(r)) return {textDecorationLine:'underline', textDecorationStyle:'wavy', textDecorationColor:c0, textUnderlineOffset:'4px'}; return {}; };
      const word=(t,ck)=>{
        if(t.plain) return h('span',{key:'k'+(idx++),style:{fontFamily:'var(--font-latin)',fontStyle:'italic',color:'var(--muted)'}}, t.l);
        const k=self.keyOf(t.k||t.d||t.l);
        const hot = s.highlight && k===s.highlight;
        const pr0=s.practice; const pst=(pr0&&pr0.phase!=='done')?pr0.steps[pr0.idx]:null;
        const isTarget=!!(pst&&((pst.kind==='role'&&pst.id===t._id)||(pst.kind==='find'&&pr0.phase==='feedback'&&pst.id===t._id)));
        const inClause=!!(pst&&pst.kind==='find'&&pr0.phase==='ask'&&pst.clauseIds&&pst.clauseIds.indexOf(t._id)>=0);
        const pbg=isTarget?'var(--hl)':(inClause?'color-mix(in oklab, var(--accent) 9%, transparent)':(hot?'var(--hl)':'transparent'));
        const cols = t.r ? (G.tok.get(t)||['var(--accent)']) : null;
        const c0 = cols?cols[0]:'var(--fg)';
        const latinStyle={fontFamily:'var(--font-latin)',fontStyle:'italic',fontWeight:600};
        if(syn && cols){ Object.assign(latinStyle, self.textColorStyle(cols), decor(t,c0)); }
        const latin=h('span',{style:latinStyle}, t.l+(t.a||''));
        let content=latin; const extra={};
        if(isTarget){ extra.animation='ltring 1.4s ease-in-out infinite'; extra.borderRadius='6px'; }
        if(syn && t.r){
          const chip=h('span',{style:{fontFamily:'var(--font-ui)',fontSize:'9px',fontWeight:700,letterSpacing:'.02em',textTransform:'uppercase',lineHeight:1.15,color:c0,background:'color-mix(in oklab,'+c0+' 15%,transparent)',border:'1px solid color-mix(in oklab,'+c0+' 32%,transparent)',borderRadius:'4px',padding:'0 4px 1px',marginBottom:'5px',whiteSpace:'nowrap'}}, t.r);
          content=h('span',{style:{display:'inline-flex',flexDirection:'column',alignItems:'center'}}, chip, latin);
          extra.verticalAlign='bottom';
        }
        const hid=G.head.get(t);
        return h('span',Object.assign({key:'k'+(idx++),'data-wkey':k,'data-tid':t._id,'data-head':(hid!=null?hid:''),'data-col':c0,onMouseEnter:(e)=>{ if(!self.state.admin && !self.state.practice) self.showPop(t,e.currentTarget); if(!self.state.practice) self.drawArrow(e.currentTarget); },onMouseLeave:()=>{ if(!self.state.admin) self.hidePop(); self.hideArrow(); },onClick:(e)=>{ if(self.state.practice) self.practiceClick(t); else self.togglePin(t,e.currentTarget); },style:Object.assign({cursor:'pointer',borderRadius:'4px',padding:syn?'2px 3px 0':'0 1px',borderBottom:syn?'none':'1px dotted color-mix(in oklab,var(--accent) 45%,transparent)',background:pbg,transition:'background .2s'},extra)}), content);
      };
      const node=(n,ck)=>{
        if(n.kids){
          const items=[]; n.kids.forEach((c,i)=>{ if(i>0) items.push(' '); items.push(node(c, n.key||ck)); });
          if(!syn) return h(F,{key:'c'+(idx++)}, items);
          const col=G.cl.get(n)||self.clauseColor(n.key); const main=n.type!=='sub';
          const brk=(ch)=>h('span',{style:{color:col,fontWeight:800,fontSize:'1.25em',fontFamily:'var(--font-serif)'}}, ch);
          const label=h('span',{style:{fontFamily:'var(--font-ui)',fontSize:'8.5px',fontWeight:800,letterSpacing:'.07em',textTransform:'uppercase',color:'var(--on-accent)',background:col,borderRadius:'4px',padding:'1px 5px 2px',margin:'0 5px 0 2px',verticalAlign:'3px',whiteSpace:'nowrap'}}, n.label||(main?'Κύρια':'Δευτ.'));
          return h('span',{key:'c'+(idx++)}, brk(main?'[':'('), label, ...items, ' ', brk(main?']':')'));
        }
        return word(n,ck);
      };
      const periods=u.periods.map((p,pi)=>{
        const inner=[]; p.kids.forEach((c,i)=>{ if(i>0) inner.push(' '); inner.push(node(c,null)); });
        const num = syn ? h('span',{style:{fontFamily:'var(--font-mono)',fontSize:'10px',color:'var(--muted)',border:'1px solid var(--line)',borderRadius:'999px',padding:'1px 6px',marginRight:'7px',verticalAlign:'4px'}}, p.n) : null;
        return h('span',{key:'p'+pi}, num, ...inner, ' ');
      });
      const flow=h('div',{style:{fontFamily:'var(--font-latin)',fontSize:'clamp(20px,2.4vw,26px)',lineHeight: syn?'3.5':'2.2',color:'var(--fg)',wordSpacing:'.02em',position:'relative',zIndex:1}}, ...periods);
      const svg=h('svg',{ref:self.arrowSvgRef,style:{position:'absolute',left:0,top:0,width:'100%',height:'100%',overflow:'visible',pointerEvents:'none',zIndex:2}}, h('defs',{}, h('marker',{id:'lt-arrow',markerWidth:'9',markerHeight:'9',refX:'6',refY:'3',orient:'auto',markerUnits:'strokeWidth'}, h('path',{d:'M0,0 L6,3 L0,6 Z',fill:'context-stroke'}))), h('g',{ref:self.arrowAllRef}), h('path',{ref:self.arrowPathRef,d:'',fill:'none',stroke:'var(--accent)',strokeWidth:'2',markerEnd:'url(#lt-arrow)',style:{opacity:0,transition:'opacity .15s'}}));
      return h('div',{style:{position:'relative'}}, svg, flow);
    }

    buildAnalysis(){
      const u=this.state.unit; if(!u||!u.periods) return []; const out=[]; let n=0; const self=this; const G=self.buildGroups();
      const visit=(cl)=>{
        n++; const clauseCol=G.cl.get(cl)||self.clauseColor(cl.key); const items=[];
        const isVerb=(c)=> !c.kids && !!c.r && c.r.indexOf('Ρήμα')===0;
        cl.kids.forEach(c=>{ if(!c.kids && !c.plain && c.r){ const v=isVerb(c); const cols=G.tok.get(c)||[clauseCol]; const lStyle=Object.assign({fontFamily:'var(--font-latin)',fontStyle:'italic',fontWeight:700}, self.textColorStyle(cols), v?{textDecorationLine:'underline',textDecorationColor:cols[0],textDecorationThickness:'2px',textUnderlineOffset:'3px'}:{}); items.push({l:c.l, role:self.composeRole(c), lStyle, swatch:self.swatchStyle(cols)}); } });
        const sentenceParts=cl.kids.map(c=>{ if(c.kids) return {t:'(…)', style:{color:'var(--muted)'}}; const t=c.plain? c.l : (c.l+(c.a||'')); if(!c.r) return {t, style:{}}; const cols=G.tok.get(c)||[clauseCol]; const v=isVerb(c); return {t, style:Object.assign({}, self.textColorStyle(cols), v?{textDecorationLine:'underline',textDecorationColor:cols[0],textDecorationThickness:'2px',textUnderlineOffset:'3px',fontWeight:700}:{}) }; });
        out.push({key:'a'+n, n, label:cl.label||(cl.type==='sub'?'Δευτ.':'Κύρια'), note:cl.note||'', items, sentenceParts,
          card:{background:'var(--panel)',border:'1px solid var(--line)',borderLeft:'4px solid '+clauseCol,borderRadius:'var(--r)',padding:'13px 16px'},
          badge:{fontFamily:'var(--font-ui)',fontSize:'10px',fontWeight:800,letterSpacing:'.06em',textTransform:'uppercase',color:'#fff',background:clauseCol,padding:'2px 8px',borderRadius:'4px',whiteSpace:'nowrap'}});
        cl.kids.forEach(c=>{ if(c.kids) visit(c); });
      };
      u.periods.forEach(p=> p.kids.forEach(c=>{ if(c.kids) visit(c); }));
      return out;
    }

    renderVals(){
      const s=this.state, u=s.unit;
      const q=s.query.trim().toLowerCase();
      const inc=(...vals)=> !q || vals.some(v=> String(v||'').toLowerCase().includes(q));
      const ready = s.loaded && !s.err && !!u;
      const hasTransforms = ready && u && Array.isArray(u.transforms) && u.transforms.length>0;

      const parts=this.partDefs.filter(p=> p.id!=='transforms' || hasTransforms).map(p=>{
        const active=p.id===s.part;
        return {id:p.id, rn:p.rn, label:p.label, onSelect:()=>this.setPart(p.id),
          style:{display:'flex',alignItems:'center',gap:'10px',width:(s.dir==='B'?'100%':'auto'),textAlign:'left',cursor:'pointer',fontFamily:'var(--font-ui)',fontSize:'14px',fontWeight:600,padding:'9px 13px',borderRadius:'var(--r)',border:'1px solid '+(active?'transparent':'var(--line)'),background:(active?'var(--accent)':'var(--panel2)'),color:(active?'var(--on-accent)':'var(--fg)'),whiteSpace:'nowrap',transition:'all .15s'},
          rnStyle:{fontFamily:'var(--font-mono)',fontSize:'11px',opacity:(active?0.9:0.5),flex:'none'}};
      });

      const boxBase={alignSelf:'flex-start', background:'var(--panel)', border:'1px solid var(--line)', borderRadius:'var(--r-lg)', padding:'15px 15px 12px'};
      const jump=(form)=>()=>{ if(this.state.admin) return; this.jumpTo(form); };
      const nouns=(ready?u.nouns:[]).map((kl,ki)=>{ const groups=kl.groups.map((g,gi)=>({gender:g.gender, items:g.items.map((it,ii)=>({form:it.form, note:it.note||'', onJump:jump(it.form), pForm:'nouns.'+ki+'.groups.'+gi+'.items.'+ii+'.form', pNote:'nouns.'+ki+'.groups.'+gi+'.items.'+ii+'.note'})).filter(it=>inc(it.form,it.note))})).filter(g=>g.items.length); const count=groups.reduce((a,g)=>a+g.items.length,0); return {kl:kl.kl, groups, cardStyle:Object.assign({flex:Math.max(2,count)+' 1 148px'}, boxBase)}; }).filter(kl=>kl.groups.length);
      const adjectives=(ready?u.adjectives:[]).map((kl,ki)=>{ const items=kl.items.map((it,ii)=>({form:it.form, note:it.note||'', onJump:jump(it.form), pForm:'adjectives.'+ki+'.items.'+ii+'.form', pNote:'adjectives.'+ki+'.items.'+ii+'.note'})).filter(it=>inc(it.form,it.note)); return {kl:kl.kl, items, cardStyle:Object.assign({flex:Math.max(2,items.length)+' 1 160px'}, boxBase)}; }).filter(kl=>kl.items.length);
      const comparatives=(ready?u.comparatives:[]).map((kl,ki)=>({kl:kl.kl, rows:kl.rows.map((r,ri)=>({pos:r.pos, comp:r.comp, sup:r.sup, onJump:jump(r.pos), pPos:'comparatives.'+ki+'.rows.'+ri+'.pos', pComp:'comparatives.'+ki+'.rows.'+ri+'.comp', pSup:'comparatives.'+ki+'.rows.'+ri+'.sup'})).filter(r=>inc(r.pos,r.comp,r.sup))})).filter(kl=>kl.rows.length);
      const pronouns=(ready?u.pronouns:[]).map((p,pi)=>({form:p.form, kind:p.kind, extra:p.extra||'', onJump:jump(p.form), pForm:'pronouns.'+pi+'.form', pKind:'pronouns.'+pi+'.kind', pExtra:'pronouns.'+pi+'.extra'})).filter(p=>inc(p.form,p.kind,p.extra));
      const verbs=(ready?u.verbs:[]).map((sz,zi)=>{ const rows=sz.rows.map((r,ri)=>({pres:r.pres, perf:r.perf, sup:r.sup, inf:r.inf, note:r.note||'', onJump:jump(r.pres), pPres:'verbs.'+zi+'.rows.'+ri+'.pres', pPerf:'verbs.'+zi+'.rows.'+ri+'.perf', pSup:'verbs.'+zi+'.rows.'+ri+'.sup', pInf:'verbs.'+zi+'.rows.'+ri+'.inf', pNote:'verbs.'+zi+'.rows.'+ri+'.note'})).filter(r=>inc(r.pres,r.perf,r.sup,r.inf,r.note)); return {syz:sz.syz, rows, hasRows:rows.length>0, empty: rows.length===0}; }).filter(sz=> sz.hasRows || !q);
      const sosHueL=s.dark?0.7:0.52;
      const sosHueOf=(tg)=>{ let hh=0; const strv=String(tg||''); for(let ii=0;ii<strv.length;ii++) hh=(hh*31+strv.charCodeAt(ii))|0; return this.groupPalette[Math.abs(hh)%this.groupPalette.length]; };
      const sos=(ready?u.sos:[]).map((x,xi)=>({tag:x.tag, title:x.title, body:x.body, pTag:'sos.'+xi+'.tag', pTitle:'sos.'+xi+'.title', pBody:'sos.'+xi+'.body'})).filter(x=>inc(x.title,x.body,x.tag)).map((x,xi)=>Object.assign(x,{n:xi+1, hue:'oklch('+sosHueL+' 0.14 '+sosHueOf(x.tag)+')'}));

      // ΜΕΡΟΣ VIII — Μετατροπές (προαιρετικό: εμφανίζεται μόνο αν η ενότητα έχει `transforms`)
      const transforms=(ready && Array.isArray(u.transforms)?u.transforms:[]).map((g,gi)=>{
        const items=(g.items||[]).map((it,ii)=>({
          from:it.from||'', note:it.note||'', n:ii+1,
          to: Array.isArray(it.to)? it.to.slice() : (it.to!=null && it.to!==''? [it.to] : [])
        })).filter(it=> inc(it.from, it.note, ...it.to));
        return {id:g.id||g.key||('§'+(gi+1)), label:g.label||'', intro:g.intro||'', items,
                hue:'oklch('+sosHueL+' 0.13 '+sosHueOf(g.id||g.label||gi)+')'};
      }).filter(g=>g.items.length);

      const greekBase={padding:'11px 16px', borderTop:'1px solid var(--line2)', borderLeft:'1px solid var(--line2)', fontFamily:'var(--font-ui)', fontSize:'15px', lineHeight:1.5, color:'var(--fg)'};
      const align=(ready?u.alignment:[]).map((a,i)=>{ const bg = i%2===1 ? 'var(--panel2)' : 'var(--panel)'; const masked = s.hideGreek && !s.revealed[i]; const gs=Object.assign({}, greekBase, {background:bg, cursor: s.hideGreek?'pointer':'default', transition:'filter .18s, opacity .18s'}); if(masked) Object.assign(gs,{filter:'blur(5px)',userSelect:'none',opacity:0.5}); return {la:a.la, el:a.el, pLa:'alignment.'+i+'.la', pEl:'alignment.'+i+'.el', laStyle:{padding:'11px 16px', borderTop:'1px solid var(--line2)', fontFamily:'var(--font-latin)', fontStyle:'italic', fontSize:'15px', lineHeight:1.5, color:'var(--fg)', background:bg}, elStyle:gs, onReveal:()=>this.revealLine(i)}; });

      const presentKeys={kyria:true};
      if(ready){ const walk=(cl)=>{ if(cl.key) presentKeys[cl.key]=true; if(cl.kids) cl.kids.forEach(k=>{ if(k.kids) walk(k); }); }; u.periods.forEach(p=>p.kids.forEach(k=>{ if(k.kids) walk(k); })); }
      const legendActive=Object.keys(presentKeys).filter(k=>this.clauseMeta[k]).map(k=>({label:this.clauseMeta[k].label, swatch:{width:'12px',height:'12px',borderRadius:'3px',background:this.clauseColor(k),flex:'none'}}));
      const roleLegend=[]; if(ready){ const seen={}; const L=s.dark?0.76:0.5; const scan=(role)=>{ if(!role) return; this.roleDefs.forEach(d=>{ if(d.re.test(role) && !seen[d.label]){ seen[d.label]=true; roleLegend.push({label:d.label, swatch:{width:'12px',height:'12px',borderRadius:'3px',flex:'none',background:'oklch('+L+' 0.16 '+d.hue+')'}}); } }); }; const walk=(cl)=>{ cl.kids.forEach(c=>{ if(c.kids) walk(c); else scan(c.r); }); }; u.periods.forEach(p=>p.kids.forEach(c=>{ if(c.kids) walk(c); else scan(c.r); })); }

      return {
        rootRef:this.rootRef, scrollRef:this.scrollRef,
        ready, notReady: !ready && !s.err, err:s.err,
        ui: u? {course:u.course, number:u.number, title:u.title, numLabel:('0'+u.number).slice(-2)} : {course:'Λατινικά Προσανατολισμού', number:'', title:'Φόρτωση…', numLabel:'—'},
        parts,
        dirABtn:this.segStyle(s.dir==='A'), dirBBtn:this.segStyle(s.dir==='B'),
        onDirA:()=>this.setDir('A'), onDirB:()=>this.setDir('B'),
        showText:(s.part==='text'||s.printAll), showTrans:(s.part==='trans'||s.printAll), showNouns:(s.part==='nouns'||s.printAll), showCompar:(s.part==='compar'||s.printAll), showPron:(s.part==='pron'||s.printAll), showVerbs:(s.part==='verbs'||s.printAll), showSos:(s.part==='sos'||s.printAll), showTransforms:(s.part==='transforms'||s.printAll),
        showSyntax:s.showSyntax, showAnalysis:s.showAnalysis, hideGreek:s.hideGreek,
        syntaxBtn:this.pillStyle(s.showSyntax), analysisBtn:this.pillStyle(s.showAnalysis), greekBtn:this.pillStyle(s.hideGreek), greekBtnLabel: s.hideGreek?'👁 Δείξε μετάφραση':'⊘ Κρύψε μετάφραση',
        showArrows:s.showArrows, arrowsBtn:this.pillStyle(s.showArrows), toggleArrows:this.toggleArrows,
        practiceOn:!!s.practice, practice:s.practice, practiceBtn:this.pillStyle(!!s.practice), startPractice:this.startPractice, exitPractice:this.exitPractice, practiceAnswer:this.practiceAnswer, practiceNext:this.practiceNext,
        toggleSyntax:this.toggleSyntax, toggleAnalysis:this.toggleAnalysis, toggleGreek:this.toggleGreek,
        onSearch:this.onSearch, clearSearch:this.clearSearch, query:s.query, doPrint:this.doPrint,
        hasHighlight:!!s.highlight, clearHighlight:this.clearHighlight,
        dark:s.dark, toggleDark:this.toggleDark, darkBtn:this.pillStyle(s.dark), darkLabel: s.dark?'☀ Φωτεινό':'☾ Σκούρο', roleLegend,
        admin:s.admin, notAdmin:!s.admin, adminCE:s.admin, adminBtn:this.pillStyle(s.admin), adminLabel: s.admin?'🔓 Admin':'🔒 Admin', onToggleAdmin:this.toggleAdmin, doExport:this.exportData, doReset:this.resetData,
        editL:(e)=>this.editToken('l',e), editR:(e)=>this.editToken('r',e), editTo:(e)=>this.editToken('to',e), editG:(e)=>this.editToken('g',e), editD:(e)=>this.editToken('d',e), editNote:(e)=>this.editToken('note',e),
        textView:this.buildText(), analysis:this.buildAnalysis(), legendActive,
        align, nouns, adjectives, comparatives, pronouns, verbs, sos, hasSos:sos.length>0, noSos:sos.length===0,
        transforms, hasTransforms:transforms.length>0,
        pop:s.pop, closePop:this.closePop,
        popStyle:{position:'fixed', left:s.pop.x+'px', top:s.pop.y+'px', transform:s.pop.tf, zIndex:9999, width:(s.admin?'min(370px,92vw)':'min(330px,86vw)'), maxHeight:'74vh', overflowY:'auto', background:'var(--panel)', border:'1px solid var(--line)', borderRadius:'var(--r-lg)', boxShadow:'0 16px 44px -12px rgba(0,0,0,.34),0 3px 9px rgba(0,0,0,.12)', padding:'15px 16px', animation:'ltpop .14s ease both'}
      };
    }

    render(){
      const V = this.renderVals();
      return (
        <div data-root ref={V.rootRef} style={s("height:100dvh;overflow:hidden;display:flex;flex-direction:column;background:var(--bg);color:var(--fg);font-family:var(--font-ui);--bg:#ecede7;--panel:#fbfcf8;--panel2:#eff1ea;--fg:#20261e;--muted:#5f6b5b;--line:#dae0d3;--line2:#e7ebe1;--accent:oklch(0.47 0.10 168);--accent2:oklch(0.42 0.11 168);--on-accent:#f4faf2;--hl:oklch(0.9 0.13 116);--font-ui:'Commissioner',system-ui,sans-serif;--font-serif:'EB Garamond',Georgia,serif;--font-latin:'EB Garamond',Georgia,serif;--font-mono:'IBM Plex Mono',monospace;--r:5px;--r-lg:10px;--body-dir:column;--nav-dir:row;--nav-w:100%;--nav-wrap:wrap;--nav-pad:11px clamp(16px,3vw,32px);--nav-bb:1px;--nav-br:0px;--maxw:1060px")}>

          <header data-chrome style={s("display:flex;flex-wrap:wrap;gap:12px 20px;align-items:center;justify-content:space-between;padding:13px clamp(16px,3vw,32px);background:var(--panel);border-bottom:1px solid var(--line);position:sticky;top:0;z-index:60")}>
            <div style={s("display:flex;align-items:center;gap:14px;min-width:0")}>
              <div style={s("display:flex;align-items:center;justify-content:center;width:48px;height:48px;border-radius:var(--r);background:var(--accent);color:var(--on-accent);font-family:var(--font-serif);font-weight:800;font-size:21px;flex:none;letter-spacing:.01em")}>{V.ui.numLabel}</div>
              <div style={s("min-width:0")}>
                <div style={s("font-family:var(--font-ui);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}><span contentEditable={V.adminCE} suppressContentEditableWarning={true} data-edit="course">{V.ui.course}</span> · Ενότητα {V.ui.number}</div>
                <div contentEditable={V.adminCE} suppressContentEditableWarning={true} data-edit="title" style={s("font-family:var(--font-serif);font-weight:800;font-size:clamp(16px,2vw,22px);line-height:1.12")}>{V.ui.title}</div>
              </div>
            </div>
            <div style={s("display:flex;align-items:center;gap:10px;flex-wrap:wrap")}>
              <div style={s("display:flex;align-items:center;background:var(--panel2);border:1px solid var(--line);border-radius:999px;padding:5px 7px 5px 13px;gap:7px")}>
                <span style={s("color:var(--muted);font-size:14px")}>⌕</span>
                <input value={V.query} onChange={V.onSearch} placeholder="Αναζήτηση λέξης…" style={s("border:0;background:transparent;outline:none;font-family:var(--font-ui);font-size:14px;color:var(--fg);width:150px")} />
                {V.query && <button onClick={V.clearSearch} style={s("border:0;background:var(--line);border-radius:999px;width:19px;height:19px;cursor:pointer;color:var(--fg);line-height:1;flex:none")}>×</button>}
              </div>
              <div style={s("display:flex;border:1px solid var(--line);border-radius:999px;overflow:hidden;background:var(--panel2)")}>
                <button onClick={V.onDirA} style={V.dirABtn}>Α · Κώδικας</button>
                <button onClick={V.onDirB} style={V.dirBBtn}>Β · Εφαρμογή</button>
              </div>
              <button onClick={V.toggleDark} title="Εναλλαγή σκούρου / φωτεινού θέματος" style={V.darkBtn}>{V.darkLabel}</button>
              {V.admin && <button onClick={V.doExport} title="Εξαγωγή δεδομένων ενότητας (.js)" className="lt-hova" style={s("display:inline-flex;align-items:center;gap:6px;cursor:pointer;border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:999px;padding:7px 13px;font-family:var(--font-ui);font-size:13px;font-weight:600")}>⭳ Εξαγωγή</button>}
              {V.admin && <button onClick={V.doReset} title="Επαναφορά αρχικών δεδομένων" className="lt-hova" style={s("cursor:pointer;border:1px solid var(--line);background:var(--panel);color:var(--muted);border-radius:999px;padding:7px 11px;font-family:var(--font-ui);font-size:13px;font-weight:600")}>↺</button>}
              {V.admin && <button onClick={V.doPrint} title="Εκτύπωση / PDF" className="lt-hova" style={s("display:inline-flex;align-items:center;gap:7px;cursor:pointer;border:1px solid var(--line);background:var(--panel);color:var(--fg);border-radius:999px;padding:7px 14px;font-family:var(--font-ui);font-size:13px;font-weight:600")}>⎙ PDF</button>}
              <button onClick={V.onToggleAdmin} title="Λειτουργία καθηγητή (επεξεργασία)" style={V.adminBtn}>{V.adminLabel}</button>
            </div>
          </header>

          <div data-body style={s("display:flex;flex-direction:var(--body-dir);flex:1;min-height:0")}>
            <nav data-nav style={s("display:flex;flex-direction:var(--nav-dir);gap:8px;width:var(--nav-w);padding:var(--nav-pad);background:var(--panel);border-right:var(--nav-br) solid var(--line);border-bottom:var(--nav-bb) solid var(--line);flex-wrap:var(--nav-wrap);align-content:flex-start")}>
              {V.parts.map(p => (
                <button key={p.id} onClick={p.onSelect} style={p.style} className="lt-hovb">
                  <span style={p.rnStyle}>{p.rn}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </nav>

            <main data-scroll ref={V.scrollRef} className="lt-sc" style={s("position:relative;flex:1;min-height:0;overflow:auto;padding:clamp(18px,3vw,42px) clamp(16px,3vw,42px) 80px")}>
              <div style={s("max-width:var(--maxw);margin:0 auto")}>

                {V.notReady && (
                  <div style={s("display:flex;flex-direction:column;align-items:center;justify-content:center;gap:14px;padding:80px 20px;color:var(--muted);font-family:var(--font-ui)")}>
                    <div style={s("width:34px;height:34px;border:3px solid var(--line);border-top-color:var(--accent);border-radius:50%;animation:ltspin 1s linear infinite")}></div>
                    <div>Φόρτωση δεδομένων ενότητας…</div>
                  </div>
                )}
                {V.err && (
                  <div style={s("padding:40px 20px;color:var(--muted);font-family:var(--font-ui)")}>⚠ Σφάλμα φόρτωσης δεδομένων: {V.err}</div>
                )}

                {V.ready && (
                <React.Fragment>

                  {/* ══ ΜΕΡΟΣ I · ΚΕΙΜΕΝΟ ══ */}
                  {V.showText && (
                  <section data-part data-screen-label="Μέρος I — Κείμενο" style={s("animation:ltfade .4s ease both")}>
                    <div style={s("display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;justify-content:space-between;margin-bottom:8px")}>
                      <div>
                        <div style={s("font-family:var(--font-ui);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)")}>Μέρος I</div>
                        <h2 style={s("margin:3px 0 0;font-family:var(--font-serif);font-weight:800;font-size:clamp(23px,3vw,32px)")}>Λατινικό κείμενο</h2>
                      </div>
                      <div style={s("display:flex;flex-wrap:wrap;gap:8px")}>
                        {!V.practiceOn && <button onClick={V.toggleSyntax} style={V.syntaxBtn}>⌊ ⌋ Ανάλυση σύνταξης</button>}
                        {!V.practiceOn && <button onClick={V.toggleAnalysis} style={V.analysisBtn}>☰ Πλήρης ανάλυση</button>}
                        {!V.practiceOn && <button onClick={V.toggleArrows} style={V.arrowsBtn}>➤ Βελάκια εξάρτησης</button>}
                        <button onClick={V.practiceOn? V.exitPractice : V.startPractice} style={V.practiceBtn}>🎯 Άσκηση σύνταξης</button>
                        {V.hasHighlight && !V.practiceOn && <button onClick={V.clearHighlight} style={s("display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-family:var(--font-ui);font-size:13px;font-weight:600;padding:7px 13px;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:var(--muted)")}>✕ επισήμανση</button>}
                      </div>
                    </div>
                    <p style={s("font-family:var(--font-ui);font-size:14px;color:var(--muted);margin:0 0 18px;max-width:64ch;line-height:1.5")}>Πέρασε τον δείκτη πάνω από μια λέξη (ή πάτησέ την σε κινητό/tablet) για συντακτική &amp; γραμματική αναγνώριση. Με την <b style={s("color:var(--accent)")}>Ανάλυση σύνταξης</b> βλέπεις όλο το κείμενο σε <b>[ κύριες ]</b> και <b>( δευτερεύουσες )</b> προτάσεις, με χρώμα, ετικέτα είδους και ρόλο κάθε λέξης.</p>

                    {V.showSyntax && (
                      <div style={s("display:flex;flex-wrap:wrap;gap:7px 14px;align-items:center;margin-bottom:16px;padding:11px 15px;background:var(--panel);border:1px solid var(--line);border-radius:var(--r-lg)")}>
                        <span style={s("font-family:var(--font-ui);font-size:12.5px;color:var(--muted);line-height:1.55")}>🎨 Κάθε πρόταση κι οι όροι της μοιράζονται <b style={s("color:var(--fg)")}>το ίδιο χρώμα</b>· λέξη με δύο ρήματα παίρνει <b style={s("color:var(--fg)")}>δύο χρώματα</b>. &nbsp;⃝ ρήμα σε κύκλο · <span style={s("text-decoration:underline;text-decoration-thickness:2px")}>απαρέμφατο/μετοχή</span> υπογραμμισμένα · <span style={s("text-decoration:underline wavy")}>εμπρόθετος</span> με κυματιστή. Πέρασε πάνω από λέξη για <b style={s("color:var(--fg)")}>βελάκι</b> προς τον όρο εξάρτησης.</span>
                      </div>
                    )}

                    <div style={s("background:var(--panel);border:1px solid var(--line);border-radius:var(--r-lg);padding:clamp(20px,3.2vw,38px);box-shadow:0 1px 2px rgba(0,0,0,.03)")}>
                      {V.textView}
                    </div>

                    {V.showAnalysis && (
                      <div style={s("margin-top:26px")}>
                        <h3 style={s("font-family:var(--font-serif);font-weight:800;font-size:22px;margin:0 0 14px")}>Συντακτική ανάλυση</h3>
                        <div style={s("display:flex;flex-wrap:wrap;gap:7px 14px;align-items:center;margin-bottom:14px;padding:11px 15px;background:var(--panel);border:1px solid var(--line);border-radius:var(--r-lg)")}>
                          <span style={s("font-family:var(--font-ui);font-size:12.5px;color:var(--muted);line-height:1.55")}>🎨 Κάθε πρόταση κι οι συνδεδεμένοι όροι της έχουν <b style={s("color:var(--fg)")}>το ίδιο χρώμα</b>· λέξη που ανήκει σε δύο ρήματα εμφανίζεται με <b style={s("color:var(--fg)")}>δύο χρώματα</b>.</span>
                        </div>
                        <div style={s("display:flex;flex-direction:column;gap:11px")}>
                          {V.analysis.map(a => (
                            <div key={a.key} style={a.card}>
                              <div style={s("display:flex;gap:10px;align-items:baseline;flex-wrap:wrap")}>
                                <span style={s("font-family:var(--font-mono);font-size:12px;color:var(--muted);flex:none")}>{a.n}.</span>
                                <span style={s("font-family:var(--font-latin);font-style:italic;font-size:17px")}>{a.sentenceParts.map((sp,i) => (<span key={i} style={sp.style}>{sp.t} </span>))}</span>
                                <span style={a.badge}>{a.label}</span>
                              </div>
                              {a.note && <div style={s("font-family:var(--font-ui);font-size:13px;color:var(--muted);margin-top:7px;line-height:1.5")}>{a.note}</div>}
                              <div style={s("display:flex;flex-wrap:wrap;gap:5px 16px;margin-top:10px")}>
                                {a.items.map((it,i) => (
                                  <span key={i} style={s("display:inline-flex;align-items:center;gap:7px;font-family:var(--font-ui);font-size:13.5px;color:var(--fg)")}><span style={it.swatch}></span><b style={it.lStyle}>{it.l}</b>: {it.role}</span>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                  )}

                  {/* ══ ΜΕΡΟΣ II · ΜΕΤΑΦΡΑΣΗ ══ */}
                  {V.showTrans && (
                  <section data-part data-screen-label="Μέρος II — Μετάφραση" style={s("animation:ltfade .4s ease both")}>
                    <div style={s("display:flex;flex-wrap:wrap;gap:12px;align-items:flex-end;justify-content:space-between;margin-bottom:18px")}>
                      <div>
                        <div style={s("font-family:var(--font-ui);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)")}>Μέρος II</div>
                        <h2 style={s("margin:3px 0 0;font-family:var(--font-serif);font-weight:800;font-size:clamp(23px,3vw,32px)")}>Μετάφραση σε αντιστοίχιση</h2>
                      </div>
                      <button onClick={V.toggleGreek} style={V.greekBtn}>{V.greekBtnLabel}</button>
                    </div>
                    {V.hideGreek && <p style={s("margin:-6px 0 16px;font-family:var(--font-ui);font-size:13px;color:var(--accent);font-weight:600")}>✦ Λειτουργία εξάσκησης — πάτησε κάθε γραμμή για να αποκαλύψεις τη μετάφρασή της.</p>}
                    <div data-align style={s("display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--line);border-radius:var(--r-lg);overflow:hidden")}>
                      <div style={s("padding:10px 16px;background:var(--panel2);font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)")}>Latine</div>
                      <div style={s("padding:10px 16px;background:var(--panel2);font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);border-left:1px solid var(--line2)")}>Ελληνικά</div>
                      {V.align.map((row,i) => (
                        <div key={i} style={s("display:contents")}>
                          <div style={row.laStyle} contentEditable={V.adminCE} suppressContentEditableWarning={true} data-edit={row.pLa}>{row.la}</div>
                          <div data-el style={row.elStyle} onClick={row.onReveal} contentEditable={V.adminCE} suppressContentEditableWarning={true} data-edit={row.pEl}>{row.el}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                  )}

                  {/* ══ ΜΕΡΟΣ III · ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ ══ */}
                  {V.showNouns && (
                  <section data-part data-screen-label="Μέρος III — Ουσιαστικά & Επίθετα" style={s("animation:ltfade .4s ease both")}>
                    <div style={s("margin-bottom:8px")}>
                      <div style={s("font-family:var(--font-ui);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)")}>Μέρος III</div>
                      <h2 style={s("margin:3px 0 0;font-family:var(--font-serif);font-weight:800;font-size:clamp(23px,3vw,32px)")}>Ουσιαστικά &amp; Επίθετα</h2>
                    </div>
                    <p style={s("font-family:var(--font-ui);font-size:13.5px;color:var(--muted);margin:0 0 20px")}>Ταξινομημένα κατά κλίση και γένος. Πάτησε μια λέξη για να μεταβείς σε αυτήν μέσα στο κείμενο.</p>

                    <h3 style={s("font-family:var(--font-serif);font-weight:800;font-size:19px;margin:0 0 13px")}>Ουσιαστικά</h3>
                    <div style={s("display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start;margin-bottom:30px")}>
                      {V.nouns.map((kl,ki) => (
                        <div key={ki} style={kl.cardStyle}>
                          <div style={s("font-family:var(--font-ui);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:0 0 4px;padding-bottom:8px;border-bottom:2px solid var(--line)")}>{kl.kl}</div>
                          {kl.groups.map((g,gi) => (
                            <React.Fragment key={gi}>
                              <div style={s("font-family:var(--font-ui);font-size:11px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);margin:13px 0 8px")}>{g.gender}</div>
                              <div style={s("display:flex;flex-direction:column")}>
                                {g.items.map((it,ii) => (
                                  <div key={ii} onClick={it.onJump} className="lt-hovc" style={s("display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:1px 12px;width:100%;text-align:left;cursor:pointer;font-family:var(--font-ui);color:var(--fg);border-bottom:1px solid var(--line2);padding:7px 4px;transition:all .15s")}>
                                    <span contentEditable={V.adminCE} suppressContentEditableWarning={true} data-edit={it.pForm} style={s("font-family:var(--font-latin);font-style:italic;font-weight:600;font-size:16.5px")}>{it.form}</span>
                                    {it.note && <span contentEditable={V.adminCE} suppressContentEditableWarning={true} data-edit={it.pNote} style={s("font-size:11.5px;color:var(--muted);white-space:nowrap;font-style:italic")}>{it.note}</span>}
                                  </div>
                                ))}
                              </div>
                            </React.Fragment>
                          ))}
                        </div>
                      ))}
                    </div>

                    <h3 style={s("font-family:var(--font-serif);font-weight:800;font-size:19px;margin:0 0 13px")}>Επίθετα</h3>
                    <div style={s("display:flex;flex-wrap:wrap;gap:14px;align-items:flex-start")}>
                      {V.adjectives.map((kl,ki) => (
                        <div key={ki} style={kl.cardStyle}>
                          <div style={s("font-family:var(--font-ui);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:0 0 12px;padding-bottom:8px;border-bottom:2px solid var(--line)")}>{kl.kl}</div>
                          <div style={s("display:flex;flex-direction:column")}>
                            {kl.items.map((it,ii) => (
                              <button key={ii} onClick={it.onJump} className="lt-hova" style={s("display:flex;align-items:baseline;justify-content:space-between;flex-wrap:wrap;gap:1px 12px;width:100%;text-align:left;cursor:pointer;font-family:var(--font-ui);color:var(--fg);background:transparent;border:0;border-bottom:1px solid var(--line2);padding:7px 4px;transition:all .15s")}>
                                <span style={s("font-family:var(--font-latin);font-style:italic;font-weight:600;font-size:16.5px")}>{it.form}</span>
                                {it.note && <span style={s("font-size:11.5px;color:var(--muted);white-space:nowrap;font-style:italic")}>{it.note}</span>}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                  )}

                  {/* ══ ΜΕΡΟΣ IV · ΠΑΡΑΘΕΤΙΚΑ ══ */}
                  {V.showCompar && (
                  <section data-part data-screen-label="Μέρος IV — Παραθετικά" style={s("animation:ltfade .4s ease both")}>
                    <div style={s("margin-bottom:8px")}>
                      <div style={s("font-family:var(--font-ui);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)")}>Μέρος IV</div>
                      <h2 style={s("margin:3px 0 0;font-family:var(--font-serif);font-weight:800;font-size:clamp(23px,3vw,32px)")}>Παραθετικά Επιθέτων</h2>
                    </div>
                    <p style={s("font-family:var(--font-ui);font-size:13.5px;color:var(--muted);margin:0 0 20px")}>Θετικός · Συγκριτικός · Υπερθετικός βαθμός, κατά κλίση.</p>
                    {V.comparatives.map((kl,ki) => (
                      <div key={ki} style={s("margin-bottom:22px")}>
                        <div style={s("font-family:var(--font-ui);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:0 0 10px")}>{kl.kl}</div>
                        <div style={s("overflow-x:auto;border:1px solid var(--line);border-radius:var(--r-lg)")}>
                          <table style={s("width:100%;border-collapse:collapse;font-family:var(--font-latin);table-layout:fixed")}>
                            <colgroup><col style={s("width:34%")} /><col style={s("width:33%")} /><col style={s("width:33%")} /></colgroup>
                            <thead><tr>
                              <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);padding:11px 16px;background:var(--panel2)")}>Θετικός</th>
                              <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);padding:11px 16px;background:var(--panel2)")}>Συγκριτικός</th>
                              <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);padding:11px 16px;background:var(--panel2)")}>Υπερθετικός</th>
                            </tr></thead>
                            <tbody>
                              {kl.rows.map((r,ri) => (
                                <tr key={ri} className="lt-hovr">
                                  <td style={s("padding:10px 16px;border-top:1px solid var(--line2);word-break:break-word")}><button onClick={r.onJump} className="lt-hovu" style={s("border:0;background:transparent;cursor:pointer;font-family:var(--font-latin);font-style:italic;font-weight:700;font-size:15.5px;color:var(--accent);padding:0;text-align:left")}>{r.pos}</button></td>
                                  <td style={s("padding:10px 16px;border-top:1px solid var(--line2);font-style:italic;font-size:15px;color:var(--fg);word-break:break-word")}>{r.comp}</td>
                                  <td style={s("padding:10px 16px;border-top:1px solid var(--line2);font-style:italic;font-size:15px;color:var(--fg);word-break:break-word")}>{r.sup}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </section>
                  )}

                  {/* ══ ΜΕΡΟΣ V · ΑΝΤΩΝΥΜΙΕΣ ══ */}
                  {V.showPron && (
                  <section data-part data-screen-label="Μέρος V — Αντωνυμίες" style={s("animation:ltfade .4s ease both")}>
                    <div style={s("margin-bottom:18px")}>
                      <div style={s("font-family:var(--font-ui);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)")}>Μέρος V</div>
                      <h2 style={s("margin:3px 0 0;font-family:var(--font-serif);font-weight:800;font-size:clamp(23px,3vw,32px)")}>Αντωνυμίες</h2>
                    </div>
                    <div style={s("overflow-x:auto;border:1px solid var(--line);border-radius:var(--r-lg)")}>
                      <table style={s("width:100%;border-collapse:collapse;table-layout:fixed")}>
                        <colgroup><col style={s("width:32%")} /><col style={s("width:24%")} /><col style={s("width:44%")} /></colgroup>
                        <thead><tr>
                          <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);padding:11px 16px;background:var(--panel2)")}>Αντωνυμία</th>
                          <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);padding:11px 16px;background:var(--panel2)")}>Είδος</th>
                          <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--muted);padding:11px 16px;background:var(--panel2)")}>Παρατήρηση</th>
                        </tr></thead>
                        <tbody>
                          {V.pronouns.map((p,pi) => (
                            <tr key={pi} className="lt-hovr">
                              <td style={s("padding:11px 16px;border-top:1px solid var(--line2);word-break:break-word")}><button onClick={p.onJump} className="lt-hovu" style={s("border:0;background:transparent;cursor:pointer;font-family:var(--font-latin);font-style:italic;font-weight:700;font-size:15.5px;color:var(--accent);padding:0;text-align:left")}>{p.form}</button></td>
                              <td style={s("padding:11px 16px;border-top:1px solid var(--line2);font-family:var(--font-ui);font-size:14px;font-weight:600;color:var(--fg);word-break:break-word")}>{p.kind}</td>
                              <td style={s("padding:11px 16px;border-top:1px solid var(--line2);font-family:var(--font-ui);font-size:13.5px;color:var(--muted);word-break:break-word")}>{p.extra}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                  )}

                  {/* ══ ΜΕΡΟΣ VI · ΡΗΜΑΤΑ ══ */}
                  {V.showVerbs && (
                  <section data-part data-screen-label="Μέρος VI — Ρήματα" style={s("animation:ltfade .4s ease both")}>
                    <div style={s("margin-bottom:8px")}>
                      <div style={s("font-family:var(--font-ui);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)")}>Μέρος VI</div>
                      <h2 style={s("margin:3px 0 0;font-family:var(--font-serif);font-weight:800;font-size:clamp(23px,3vw,32px)")}>Αρχικοί Χρόνοι Ρημάτων</h2>
                    </div>
                    <p style={s("font-family:var(--font-ui);font-size:13.5px;color:var(--muted);margin:0 0 20px")}>Ταξινομημένα κατά συζυγία. Πάτησε τον ενεστώτα για μετάβαση στο κείμενο.</p>
                    {V.verbs.map((sz,zi) => (
                      <div key={zi} style={s("margin-bottom:22px")}>
                        <div style={s("font-family:var(--font-ui);font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--accent);margin:0 0 10px")}>{sz.syz}</div>
                        {sz.hasRows && (
                          <div style={s("overflow-x:auto;border:1px solid var(--line);border-radius:var(--r-lg)")}>
                            <table style={s("width:100%;border-collapse:collapse;min-width:520px;table-layout:fixed")}>
                              <colgroup><col style={s("width:20%")} /><col style={s("width:20%")} /><col style={s("width:18%")} /><col style={s("width:20%")} /><col style={s("width:22%")} /></colgroup>
                              <thead><tr>
                                <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);padding:10px 14px;background:var(--panel2)")}>Ενεστ.</th>
                                <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);padding:10px 14px;background:var(--panel2)")}>Παρακ.</th>
                                <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);padding:10px 14px;background:var(--panel2)")}>Σουπ.</th>
                                <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);padding:10px 14px;background:var(--panel2)")}>Απαρέμφ.</th>
                                <th style={s("text-align:left;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);padding:10px 14px;background:var(--panel2)")}>Παρατ.</th>
                              </tr></thead>
                              <tbody>
                                {sz.rows.map((r,ri) => (
                                  <tr key={ri} className="lt-hovr">
                                    <td style={s("padding:9px 14px;border-top:1px solid var(--line2);word-break:break-word")}><button onClick={r.onJump} className="lt-hovu" style={s("border:0;background:transparent;cursor:pointer;font-family:var(--font-latin);font-style:italic;font-weight:700;font-size:15px;color:var(--accent);padding:0")}>{r.pres}</button></td>
                                    <td style={s("padding:9px 14px;border-top:1px solid var(--line2);font-family:var(--font-latin);font-style:italic;font-size:14.5px;color:var(--fg);word-break:break-word")}>{r.perf}</td>
                                    <td style={s("padding:9px 14px;border-top:1px solid var(--line2);font-family:var(--font-latin);font-style:italic;font-size:14.5px;color:var(--fg);word-break:break-word")}>{r.sup}</td>
                                    <td style={s("padding:9px 14px;border-top:1px solid var(--line2);font-family:var(--font-latin);font-style:italic;font-size:14.5px;color:var(--fg);word-break:break-word")}>{r.inf}</td>
                                    <td style={s("padding:9px 14px;border-top:1px solid var(--line2);font-family:var(--font-ui);font-size:12.5px;color:var(--muted)")}>{r.note}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {sz.empty && (
                          <div style={s("font-family:var(--font-ui);font-size:13px;color:var(--muted);padding:12px 16px;border:1px dashed var(--line);border-radius:var(--r-lg)")}>— δεν απαντά ρήμα αυτής της συζυγίας στην ενότητα</div>
                        )}
                      </div>
                    ))}
                  </section>
                  )}

                  {/* ══ ΜΕΡΟΣ VII · SOS ══ */}
                  {V.showSos && (
                  <section data-part data-screen-label="Μέρος VII — SOS" style={s("animation:ltfade .4s ease both")}>
                    <div style={s("margin-bottom:8px")}>
                      <div style={s("font-family:var(--font-ui);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)")}>Μέρος VII · Προαιρετικό</div>
                      <h2 style={s("margin:3px 0 0;font-family:var(--font-serif);font-weight:800;font-size:clamp(23px,3vw,32px)")}>SOS — Παρατηρήσεις σύνταξης</h2>
                    </div>
                    <p style={s("font-family:var(--font-ui);font-size:13.5px;color:var(--muted);margin:0 0 20px")}>Ιδιαιτερότητες &amp; «παγίδες» της ενότητας που αξίζει να θυμάσαι.</p>
                    {V.hasSos && (
                      <div style={s("display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px")}>
                        {V.sos.map((x,xi) => (
                          <div key={xi} className="lt-sosc" style={Object.assign(s("position:relative;overflow:hidden;border:1px solid var(--line);border-radius:var(--r-lg);padding:18px 18px 16px"),{background:'color-mix(in oklab, '+x.hue+' 5%, var(--panel))',borderTop:'3px solid '+x.hue})}>
                            <div style={Object.assign(s("position:absolute;top:-16px;right:8px;font-family:var(--font-serif);font-style:italic;font-weight:800;font-size:76px;line-height:1;user-select:none;pointer-events:none"),{color:x.hue,opacity:0.13})}>{x.n}</div>
                            <div style={Object.assign(s("display:inline-flex;align-items:center;font-family:var(--font-ui);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--on-accent);padding:3px 10px;border-radius:999px"),{background:x.hue})}>{x.tag}</div>
                            <h4 style={s("margin:11px 0 6px;font-family:var(--font-serif);font-size:18.5px;font-weight:800;line-height:1.25")}>{x.title}</h4>
                            <p style={s("margin:0;font-family:var(--font-ui);font-size:13.5px;line-height:1.6;color:var(--muted)")}>{x.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {V.noSos && (
                      <div style={s("font-family:var(--font-ui);font-size:13.5px;color:var(--muted);padding:16px;border:1px dashed var(--line);border-radius:var(--r-lg)")}>Δεν έχουν οριστεί παρατηρήσεις SOS για αυτή την ενότητα.</div>
                    )}
                  </section>
                  )}

                  {V.showTransforms && V.hasTransforms && (
                  <section data-part data-screen-label="Μέρος VIII — Μετατροπές" style={s("animation:ltfade .4s ease both")}>
                    <div style={s("margin-bottom:8px")}>
                      <div style={s("font-family:var(--font-ui);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)")}>Μέρος VIII · Συντακτική επεξεργασία</div>
                      <h2 style={s("margin:3px 0 0;font-family:var(--font-serif);font-weight:800;font-size:clamp(23px,3vw,32px)")}>Μετατροπές</h2>
                    </div>
                    <p style={s("font-family:var(--font-ui);font-size:13.5px;color:var(--muted);margin:0 0 20px")}>Ανάλυση &amp; μετατροπή μετοχών ↔ δευτερευουσών προτάσεων, ενεργητική ↔ παθητική σύνταξη, ευθύς ↔ πλάγιος λόγος.</p>
                    <div style={s("display:flex;flex-direction:column;gap:18px")}>
                      {V.transforms.map((g,gi) => (
                        <section key={gi} style={Object.assign(s("overflow:hidden;border:1px solid var(--line);border-radius:var(--r-lg);background:var(--panel)"),{borderLeft:'4px solid '+g.hue})}>
                          <header style={Object.assign(s("display:flex;align-items:center;gap:11px;padding:12px 16px;border-bottom:1px solid var(--line)"),{background:'color-mix(in oklab, '+g.hue+' 8%, var(--panel))'})}>
                            <span style={Object.assign(s("display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:26px;padding:0 7px;font-family:var(--font-serif);font-weight:800;font-size:15px;color:var(--on-accent);border-radius:7px"),{background:g.hue})}>{g.id}</span>
                            <h3 style={s("margin:0;font-family:var(--font-serif);font-weight:800;font-size:17px;line-height:1.25;color:var(--fg)")}>{g.label}</h3>
                          </header>
                          <div style={s("display:flex;flex-direction:column")}>
                            {g.items.map((it,ii) => (
                              <div key={ii} style={Object.assign(s("padding:13px 16px 14px"),{borderTop: ii>0?'1px solid var(--line2)':'none'})}>
                                <div style={s("display:flex;gap:10px;align-items:flex-start")}>
                                  <span style={Object.assign(s("flex:none;font-family:var(--font-mono);font-size:11px;font-weight:700;color:var(--muted);border:1px solid var(--line);border-radius:999px;min-width:20px;height:20px;display:inline-flex;align-items:center;justify-content:center;margin-top:2px"),{})}>{it.n}</span>
                                  <div style={s("flex:1;min-width:0")}>
                                    {it.from && (
                                      <div style={s("font-family:var(--font-latin);font-style:italic;font-size:16px;line-height:1.5;color:var(--muted)")}>{it.from}</div>
                                    )}
                                    {it.to.map((t,ti) => (
                                      <div key={ti} style={s("display:flex;gap:8px;align-items:baseline;margin-top:5px")}>
                                        <span style={Object.assign(s("flex:none;font-weight:800;font-size:17px;line-height:1.3"),{color:g.hue})}>→</span>
                                        <span style={s("font-family:var(--font-latin);font-style:italic;font-weight:600;font-size:16.5px;line-height:1.5;color:var(--fg)")}>{t}</span>
                                      </div>
                                    ))}
                                    {it.note && (
                                      <p style={s("margin:9px 0 0;font-family:var(--font-ui);font-size:13px;line-height:1.6;color:var(--muted)")}>{it.note}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      ))}
                    </div>
                  </section>
                  )}

                </React.Fragment>
                )}
              </div>
            </main>
          </div>

          {V.pop.show && (
            <div style={V.popStyle}>
              <div style={s("display:flex;justify-content:space-between;align-items:flex-start;gap:10px")}>
                <span style={s("font-family:var(--font-latin);font-style:italic;font-weight:800;font-size:20px;color:var(--fg)")}>{V.pop.l}</span>
                <button onClick={V.closePop} style={s("border:0;background:var(--panel2);border-radius:999px;width:23px;height:23px;cursor:pointer;color:var(--muted);flex:none;line-height:1")}>×</button>
              </div>
              {V.notAdmin && (
                <React.Fragment>
                  <div style={s("display:inline-block;margin-top:8px;font-family:var(--font-ui);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--on-accent);background:var(--accent);padding:3px 9px;border-radius:5px")}>{V.pop.r}</div>
                  <div style={s("margin-top:11px;font-family:var(--font-ui);font-size:13.5px;color:var(--fg);line-height:1.5")}>{V.pop.g}</div>
                  <div style={s("margin-top:7px;font-family:var(--font-latin);font-size:15px;font-style:italic;color:var(--muted)")}>{V.pop.d}</div>
                  {V.pop.note && <div style={s("margin-top:10px;padding-top:10px;border-top:1px dashed var(--line);font-family:var(--font-ui);font-size:12.5px;color:var(--muted);line-height:1.5")}>➟ {V.pop.note}</div>}
                </React.Fragment>
              )}
              {V.admin && (
                <div style={s("display:flex;flex-direction:column;gap:9px;margin-top:11px")}>
                  <label style={s("font-family:var(--font-ui);font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)")}>Λατινικός τύπος<input value={V.pop.l} onChange={V.editL} style={s("display:block;width:100%;margin-top:3px;font-family:var(--font-latin);font-style:italic;font-size:14px;padding:6px 9px;border:1px solid var(--line);border-radius:7px;background:var(--panel2);color:var(--fg)")} /></label>
                  <label style={s("font-family:var(--font-ui);font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)")}>Συντακτικός ρόλος<input value={V.pop.rawR} onChange={V.editR} style={s("display:block;width:100%;margin-top:3px;font-family:var(--font-ui);font-size:13px;padding:6px 9px;border:1px solid var(--line);border-radius:7px;background:var(--panel2);color:var(--fg)")} /></label>
                  <label style={s("font-family:var(--font-ui);font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)")}>Εξάρτηση (π.χ. «στο gerunt»)<input value={V.pop.toRaw} onChange={V.editTo} style={s("display:block;width:100%;margin-top:3px;font-family:var(--font-ui);font-size:13px;padding:6px 9px;border:1px solid var(--line);border-radius:7px;background:var(--panel2);color:var(--fg)")} /></label>
                  <label style={s("font-family:var(--font-ui);font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)")}>Γραμματική<textarea value={V.pop.g} onChange={V.editG} rows="2" style={s("display:block;width:100%;margin-top:3px;font-family:var(--font-ui);font-size:13px;padding:6px 9px;border:1px solid var(--line);border-radius:7px;background:var(--panel2);color:var(--fg);resize:vertical")}></textarea></label>
                  <label style={s("font-family:var(--font-ui);font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)")}>Λήμμα – σημασία<textarea value={V.pop.d} onChange={V.editD} rows="2" style={s("display:block;width:100%;margin-top:3px;font-family:var(--font-ui);font-size:13px;padding:6px 9px;border:1px solid var(--line);border-radius:7px;background:var(--panel2);color:var(--fg);resize:vertical")}></textarea></label>
                  <label style={s("font-family:var(--font-ui);font-size:10px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--muted)")}>Σημείωση (προαιρετικό)<textarea value={V.pop.note} onChange={V.editNote} rows="2" style={s("display:block;width:100%;margin-top:3px;font-family:var(--font-ui);font-size:13px;padding:6px 9px;border:1px solid var(--line);border-radius:7px;background:var(--panel2);color:var(--fg);resize:vertical")}></textarea></label>
                  <div style={s("font-family:var(--font-ui);font-size:11px;color:var(--muted)")}>✓ Αυτόματη αποθήκευση. Χρησιμοποίησε «⭳ Εξαγωγή» για μόνιμο αρχείο.</div>
                </div>
              )}
            </div>
          )}

          {V.practice && (()=>{ const pr=V.practice; const len=pr.steps.length; const step=pr.steps[Math.min(pr.idx,len-1)]; const pct=Math.round(100*((pr.phase==='done'?len:pr.idx))/Math.max(1,len));
            return (
            <div style={s("position:fixed;left:50%;bottom:16px;transform:translateX(-50%);z-index:9500;width:min(660px,94vw);background:var(--panel);border:1px solid var(--line);border-radius:var(--r-lg);box-shadow:0 18px 50px -16px rgba(0,0,0,.38),0 4px 12px rgba(0,0,0,.14);padding:13px 16px 14px;animation:ltpop .18s ease both")}>
              <div style={s("display:flex;align-items:center;gap:10px")}>
                <span style={s("font-family:var(--font-ui);font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:var(--on-accent);background:var(--accent);padding:3px 9px;border-radius:999px;flex:none")}>🎯 Ασκηση συνταξης</span>
                {pr.phase!=='done' && <span style={s("font-family:var(--font-mono);font-size:12px;color:var(--muted)")}>{pr.idx+1} / {len}</span>}
                {pr.phase!=='done' && step.label && <span style={s("font-family:var(--font-ui);font-size:11px;font-weight:700;color:var(--muted);border:1px solid var(--line);border-radius:999px;padding:1px 9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis")}>{step.label}</span>}
                <span style={s("font-family:var(--font-ui);font-size:12.5px;font-weight:700;color:var(--accent);margin-left:auto;flex:none")}>✓ {pr.ok}</span>
                <button onClick={V.exitPractice} style={s("border:0;background:var(--panel2);border-radius:999px;width:24px;height:24px;cursor:pointer;color:var(--muted);flex:none;line-height:1")}>×</button>
              </div>
              <div style={s("height:4px;background:var(--line2);border-radius:999px;overflow:hidden;margin:9px 0 11px")}><div style={Object.assign(s("height:100%;background:var(--accent);transition:width .25s"),{width:pct+'%'})}></div></div>
              {pr.phase==='ask' && step.kind==='find' && (
                <div style={s("font-family:var(--font-ui);font-size:14.5px;line-height:1.55;color:var(--fg)")}>🔎 <b>Βρες το ρήμα</b> — πάτησε τη λέξη μέσα στο κείμενο (η πρόταση είναι φωτισμένη).</div>
              )}
              {pr.phase==='ask' && step.kind==='role' && (
                <div>
                  <div style={s("font-family:var(--font-ui);font-size:14.5px;line-height:1.5;color:var(--fg)")}>Τι είναι συντακτικά η λέξη <b style={s("font-family:var(--font-latin);font-style:italic;font-size:16.5px;color:var(--accent)")}>{step.l}</b> ;</div>
                  {pr.options.map((o,oi)=>(<button key={oi} className="lt-popt" onClick={()=>V.practiceAnswer(o)} style={s("display:block;width:100%;text-align:left;font-family:var(--font-ui);font-size:13.5px;font-weight:600;color:var(--fg);background:var(--panel2);border:1px solid var(--line);border-radius:9px;padding:9px 12px;margin-top:7px")}>{['Α','Β','Γ'][oi]}. {o}</button>))}
                </div>
              )}
              {pr.phase==='feedback' && (
                <div>
                  <div style={Object.assign(s("font-family:var(--font-ui);font-size:14px;font-weight:600;line-height:1.5;border-radius:9px;padding:9px 12px;color:var(--fg)"),{background: pr.pickedRight? 'color-mix(in oklab, oklch(0.6 0.15 150) 16%, var(--panel2))' : 'color-mix(in oklab, oklch(0.6 0.19 25) 14%, var(--panel2))'})}>
                    {pr.pickedRight? '✓ Σωστά! ' : '✗ Λάθος. '}
                    {step.kind==='find'
                      ? (pr.pickedRight ? <span>Το ρήμα είναι «{pr.picked}».</span> : <span>«{pr.picked}» είναι: {pr.pickedRole||'—'} · Το ρήμα είναι «{step.l}».</span>)
                      : <span>«{step.l}» — {step.role}</span>}
                  </div>
                  <button onClick={V.practiceNext} style={s("display:inline-flex;align-items:center;gap:7px;cursor:pointer;font-family:var(--font-ui);font-size:13.5px;font-weight:700;padding:8px 18px;border-radius:999px;border:0;background:var(--accent);color:var(--on-accent);margin-top:10px")}>Συνέχεια →</button>
                </div>
              )}
              {pr.phase==='done' && (
                <div style={s("text-align:center;padding:4px 0 2px")}>
                  <div style={s("font-family:var(--font-serif);font-weight:800;font-size:30px")}>🏆 {pr.ok} / {len}</div>
                  <div style={s("font-family:var(--font-ui);font-size:13px;color:var(--muted);margin-top:2px")}>σωστές απαντήσεις · {Math.round(100*pr.ok/Math.max(1,len))}%</div>
                  <div style={s("display:flex;gap:9px;justify-content:center;margin-top:12px")}>
                    <button onClick={V.startPractice} style={s("cursor:pointer;font-family:var(--font-ui);font-size:13.5px;font-weight:700;padding:8px 16px;border-radius:999px;border:0;background:var(--accent);color:var(--on-accent)")}>↺ Ξανά</button>
                    <button onClick={V.exitPractice} style={s("cursor:pointer;font-family:var(--font-ui);font-size:13.5px;font-weight:600;padding:8px 16px;border-radius:999px;border:1px solid var(--line);background:var(--panel);color:var(--fg)")}>Κλείσιμο</button>
                  </div>
                </div>
              )}
            </div> ); })()}
        </div>
      );
    }
  }

  window.LatinUnitPanel = LatinUnitPanel;

  // ── boot ──────────────────────────────────────────────────────────────────
  function boot(){
    var params = new URLSearchParams(location.search);
    var props = {
      unit: parseInt(params.get('unit') || '16', 10) || 16,
      direction: (params.get('dir') === 'B' ? 'B' : 'A'),
      startPart: params.get('part') || 'text',
      syntaxDefault: params.get('syntax') === '1'
    };
    var mount = document.getElementById('root');
    ReactDOM.createRoot(mount).render(React.createElement(LatinUnitPanel, props));
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
