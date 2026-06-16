/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · SYSTEM layer
   • Notifications (nav bell + panel)
   • Global search (nav button + overlay over games / tags / screens)
   • Offline banner + 404 / error screens + reusable empty-state card
   Vanilla, token-driven, bilingual, persisted via SymStore.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const SS = () => window.SymStore;
  function svgIcon(paths, vb){ const s=document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('viewBox', vb||'0 0 24 24'); s.setAttribute('fill','none'); s.setAttribute('stroke','currentColor');
    s.setAttribute('stroke-width','1.8'); s.setAttribute('stroke-linecap','round'); s.setAttribute('stroke-linejoin','round');
    s.innerHTML = paths; return s; }
  // strip accents + lowercase for forgiving Greek/Latin matching
  const norm = s => String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');

  /* ───────────────────────── NOTIFICATIONS ─────────────────────── */
  const NOTIFS = [
    { id:'n-due',   ic:'⏰', screen:'assignments', time:{gr:'1ω',en:'1h'},
      t:{gr:'«Ιλιάδα Trivia» λήγει αύριο',en:'“Iliad Trivia” is due tomorrow'} },
    { id:'n-fb',    ic:'✎', screen:'assignments', time:{gr:'3ω',en:'3h'},
      t:{gr:'Η κ. Καραγιάννη σχολίασε την εργασία σου',en:'Ms. Karagianni commented on your work'} },
    { id:'n-lvl',   ic:'✦', screen:'profile', time:{gr:'Χθες',en:'Yesterday'},
      t:{gr:'Έφτασες στο Επίπεδο 13!',en:'You reached Level 13!'} },
    { id:'n-chal',  ic:'⚡', screen:'live', time:{gr:'Χθες',en:'Yesterday'},
      t:{gr:'Ο Νίκος σε προκαλεί σε Live Arena',en:'Nikos challenges you in Live Arena'} },
    { id:'n-kleos', ic:'⌾', screen:'temple', time:{gr:'2μ',en:'2d'},
      t:{gr:'Κέρδισες 250 Kleos',en:'You earned 250 Kleos'} },
  ];
  const readSet = () => SS().get('notif_read', []);
  const isRead  = id => readSet().indexOf(id) >= 0;
  const unread  = () => NOTIFS.filter(n => !isRead(n.id)).length;
  function markRead(id){ const r=readSet(); if(r.indexOf(id)<0){ r.push(id); SS().set('notif_read', r); } }
  function markAll(){ SS().set('notif_read', NOTIFS.map(n=>n.id)); }

  function bellButton(){
    const wrap = el('div',{class:'sys-pop-wrap'});
    const n = unread();
    const btn = el('button',{class:'sys-iconbtn sys-bell', 'aria-label':L({gr:'Ειδοποιήσεις',en:'Notifications'}),
      onclick:(e)=>{ e.stopPropagation(); togglePanel(wrap); } },
      [ svgIcon('<path d="M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6"/><path d="M10.5 20a2 2 0 0 0 3 0"/>') ]);
    if(n>0) btn.appendChild(el('span',{class:'sys-badge'}, n>9?'9+':String(n)));
    wrap.appendChild(btn);

    const panel = el('div',{class:'sys-panel'});
    panel.appendChild(el('div',{class:'sys-panel__hd'},[
      el('span',{class:'sys-panel__t'}, L({gr:'Ειδοποιήσεις',en:'Notifications'})),
      el('button',{class:'sys-panel__all', onclick:()=>{ markAll(); symRender(); }}, L({gr:'Όλα ως διαβασμένα',en:'Mark all read'})),
    ]));
    NOTIFS.forEach(no=>{
      const row = el('button',{class:'sys-notif'+(isRead(no.id)?' read':''),
        onclick:()=>{ markRead(no.id); symGo(no.screen); } },[
        el('span',{class:'sys-notif__ic'}, no.ic),
        el('span',{class:'sys-notif__b'},[ el('span',{class:'sys-notif__t'}, L(no.t)),
          el('span',{class:'sys-notif__tm'}, L(no.time)) ]),
        isRead(no.id)?null:el('span',{class:'sys-notif__dot'}),
      ]);
      panel.appendChild(row);
    });
    wrap.appendChild(panel);
    return wrap;
  }

  function togglePanel(wrap){
    const open = wrap.classList.toggle('open');
    // close others + outside-click
    document.querySelectorAll('.sys-pop-wrap.open').forEach(w=>{ if(w!==wrap) w.classList.remove('open'); });
    if(open){
      const close = (ev)=>{ if(!wrap.contains(ev.target)){ wrap.classList.remove('open'); document.removeEventListener('click', close); } };
      setTimeout(()=>document.addEventListener('click', close), 0);
    }
  }

  /* ───────────────────────── GLOBAL SEARCH ─────────────────────── */
  const SCREENS_IDX = [
    {id:'home', gr:'Αρχική', en:'Home'}, {id:'assignments', gr:'Εργασίες', en:'Homework'},
    {id:'gamepanel', gr:'Πίνακας Παιχνιδιών', en:'Game Panel'}, {id:'live', gr:'Live Arena', en:'Live Arena'},
    {id:'temple', gr:'Ἀγορά · Κατάστημα', en:'Agora · Shop'}, {id:'anodos', gr:'Άνοδος', en:'Anodos'},
    {id:'tartarus', gr:'Tartarus Review', en:'Tartarus Review'}, {id:'profile', gr:'Προφίλ Ήρωα', en:'Hero Profile'},
    {id:'levelup', gr:'Level Up', en:'Level Up'}, {id:'anathesi', gr:'Κονσόλα Καθηγητή', en:'Teacher Console'},
    {id:'parent', gr:'Γονικός Πίνακας', en:'Parent dashboard'}, {id:'subscribe', gr:'Συνδρομές', en:'Plans'},
    {id:'account', gr:'Ο Λογαριασμός μου', en:'My Account'}, {id:'admin', gr:'Διαχείριση', en:'Admin'},
  ];
  function results(q){
    const nq = norm(q); if(!nq) return { games:[], tags:[], screens:[] };
    const hit = o => norm(L(o)).indexOf(nq) >= 0 || norm(o.gr).indexOf(nq)>=0 || norm(o.en).indexOf(nq)>=0;
    const games = (window.SymTags ? SymTags.catalogue() : []).filter(hit).slice(0,8);
    const tags  = (window.SymTags ? SymTags.tagsAll() : []).filter(hit).slice(0,8);
    const screens = SCREENS_IDX.filter(hit).slice(0,8);
    return { games, tags, screens };
  }

  function openSearch(){
    if(document.querySelector('.sys-search')) return;
    const ov = el('div',{class:'sys-search', onclick:(e)=>{ if(e.target===ov) close(); }});
    window.symApplyThemeClass(ov);
    const box = el('div',{class:'sys-search__box'});
    const input = el('input',{class:'sys-search__in', type:'text', placeholder:L({gr:'Αναζήτησε παιχνίδια, ετικέτες, οθόνες…',en:'Search games, tags, screens…'}), autocomplete:'off'});
    const head = el('div',{class:'sys-search__hd'},[
      svgIcon('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
      input,
      el('button',{class:'sys-search__esc', onclick:close}, 'Esc'),
    ]);
    const out = el('div',{class:'sys-search__out'});
    box.appendChild(head); box.appendChild(out);
    ov.appendChild(box); document.body.appendChild(ov);
    requestAnimationFrame(()=>ov.classList.add('in')); setTimeout(()=>ov.classList.add('in'),60);
    setTimeout(()=>input.focus(), 80);

    function close(){ ov.classList.remove('in'); setTimeout(()=>ov.remove(),200); document.removeEventListener('keydown', onKey); }
    function onKey(e){ if(e.key==='Escape') close(); }
    document.addEventListener('keydown', onKey);

    function go(fn){ close(); fn(); }
    function section(label, items, render){
      if(!items.length) return;
      out.appendChild(el('div',{class:'sys-search__sec'}, label));
      items.forEach(it=> out.appendChild(render(it)));
    }
    function paint(){
      const q = input.value.trim(); out.innerHTML='';
      if(!q){ out.appendChild(el('div',{class:'sys-search__hint'}, L({gr:'Γράψε για αναζήτηση σε όλη την πλατφόρμα.',en:'Type to search across the whole platform.'}))); return; }
      const r = results(q);
      if(!r.games.length && !r.tags.length && !r.screens.length){
        out.appendChild(el('div',{class:'sys-search__empty'},[
          el('div',{class:'sys-search__emptyic','data-illu':'amphora'}),
          el('p',{}, L({gr:'Κανένα αποτέλεσμα για «',en:'No results for “'})+q+'».'),
        ]));
        if(window.injectIllus) injectIllus(out);
        return;
      }
      section(L({gr:'Οθόνες',en:'Screens'}), r.screens, s=>el('button',{class:'sys-res', onclick:()=>go(()=>symGo(s.id))},[
        el('span',{class:'sys-res__ic sys-res__ic--scr'}, '▦'), el('span',{class:'sys-res__t'}, L(s)) ]));
      section(L({gr:'Παιχνίδια',en:'Games'}), r.games, g=>el('button',{class:'sys-res', onclick:()=>go(()=>{ if(window.SymTags&&SymTags.openGame) SymTags.openGame(g); else symGo('gamepanel'); })},[
        el('span',{class:'sys-res__ic','data-illu':g.illu||'scroll'}), el('span',{class:'sys-res__t'}, L(g)),
        g.meta?el('span',{class:'sys-res__m'}, g.meta):null ]));
      section(L({gr:'Ετικέτες',en:'Tags'}), r.tags, t=>el('button',{class:'sys-res', onclick:()=>go(()=>symGo('tag',{tag:t.id}))},[
        el('span',{class:'sys-res__ic sys-res__ic--tag'}, '#'), el('span',{class:'sys-res__t'}, L(t)) ]));
      if(window.injectIllus) injectIllus(out);
    }
    input.addEventListener('input', paint);
    paint();
  }

  function searchButton(){
    return el('button',{class:'sys-iconbtn sys-search-btn', 'aria-label':L({gr:'Αναζήτηση',en:'Search'}),
      onclick:openSearch }, [ svgIcon('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>') ]);
  }

  /* ───────────────────────── OFFLINE BANNER ────────────────────── */
  function initOffline(){
    let bar;
    function show(){ if(bar) return; bar = el('div',{class:'sys-offline'},[
      el('span',{class:'sys-offline__dot'}),
      el('span',{}, L({gr:'Εκτός σύνδεσης — η πρόοδός σου αποθηκεύεται και συγχρονίζεται μόλις επανέλθει το δίκτυο.',
        en:'You’re offline — progress is saved and will sync once you’re back online.'})),
    ]); window.symApplyThemeClass(bar); document.body.appendChild(bar); requestAnimationFrame(()=>bar.classList.add('in')); setTimeout(()=>bar&&bar.classList.add('in'),60); }
    function hide(){ if(!bar) return; const b=bar; bar=null; b.classList.remove('in'); setTimeout(()=>b.remove(),250); }
    window.addEventListener('offline', show);
    window.addEventListener('online', hide);
    if(navigator.onLine === false) show();
  }

  /* ───────────── REUSABLE EMPTY / ERROR STATE ───────────── */
  window.symEmptyState = function(o){
    const wrap = el('div',{class:'sys-empty'+(o.tone==='error'?' sys-empty--error':'')});
    wrap.appendChild(el('div',{class:'sys-empty__ic','data-illu':o.illu||'amphora'}));
    wrap.appendChild(el('h2',{class:'sys-empty__t'}, L(o.title)));
    if(o.desc) wrap.appendChild(el('p',{class:'sys-empty__d'}, L(o.desc)));
    const acts = el('div',{class:'sys-empty__acts'});
    (o.actions||[]).forEach(a=> acts.appendChild(el('button',{class:'syn-cta '+(a.solid?'syn-cta--solid':'syn-cta--ghost'), onclick:a.onclick}, L(a.label))));
    if((o.actions||[]).length) wrap.appendChild(acts);
    return wrap;
  };

  /* ───────────── 404 / NOT-FOUND + ERROR screens ───────────── */
  window.SYM_SCREENS = window.SYM_SCREENS || {};
  window.SYM_SCREENS.notfound = function(home, ctx){
    const body = window.synPage(home, { back:'home', accent:'#B0395A',
      eyebrow:L({gr:'Σφάλμα 404',en:'Error 404'}), title:L({gr:'Δεν βρέθηκε',en:'Not found'}),
      sub:L({gr:'Η οθόνη που ζήτησες δεν υπάρχει ή μετακινήθηκε.',en:'The screen you asked for doesn’t exist or moved.'}) });
    body.appendChild(window.symEmptyState({
      illu:'labyrinth', tone:'error',
      title:{gr:'Χάθηκες στον λαβύρινθο;',en:'Lost in the labyrinth?'},
      desc:{gr:'Πάρε τον μίτο της Αριάδνης και γύρνα πίσω.',en:'Take Ariadne’s thread and head back.'},
      actions:[ {label:{gr:'Στην Αρχική',en:'Go home'}, solid:true, onclick:()=>symGo('home')},
        {label:{gr:'Πίνακας Παιχνιδιών',en:'Game Panel'}, onclick:()=>symGo('gamepanel')} ],
    }));
    if(window.injectIllus) injectIllus(body);
  };
  window.SYM_SCREENS.error = function(home, ctx){
    const body = window.synPage(home, { back:'home', accent:'#C2553A',
      eyebrow:L({gr:'Κάτι πήγε στραβά',en:'Something went wrong'}), title:L({gr:'Σφάλμα',en:'Error'}) });
    body.appendChild(window.symEmptyState({
      illu:'amphora', tone:'error',
      title:{gr:'Το παιχνίδι δεν φόρτωσε',en:'The game failed to load'},
      desc:{gr:'Δοκίμασε ξανά σε λίγο. Αν συνεχιστεί, ειδοποίησε τον καθηγητή σου.',en:'Try again shortly. If it keeps happening, let your teacher know.'},
      actions:[ {label:{gr:'Δοκίμασε ξανά',en:'Try again'}, solid:true, onclick:()=>symGo('home')},
        {label:{gr:'Αναφορά',en:'Report'}, onclick:()=>{ if(window.SymInfoPanel) SymInfoPanel.feedback(); }} ],
    }));
    if(window.injectIllus) injectIllus(body);
  };

  window.SymSys = { bellButton, searchButton, openSearch, initOffline, unread };
})();
