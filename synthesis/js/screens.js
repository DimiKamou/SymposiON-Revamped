/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · INNER SCREENS (Synthesis language)
   Every navigable panel, enriched per teammate review. Uses synPage(),
   SymPreview (game mockups), SymStore (persistence), shared helpers.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const SITE = '#C18A2C';
  const go = (s, p) => window.symGo(s, p);
  const P  = window.synPage;
  const SY = window.SYM;
  const ST = () => window.STATE;
  const isAdmin = () => !!(window.STATE && window.STATE.adminEdit);

  /* ── shared bits ───────────────────────────────────────────────── */
  function glyph(name, cls){ return el('span', { class:(cls||'sc-gl'), 'data-illu':name }); }

  // ── PvP Arena (Ο Ἀγών) launcher ──
  // The Arena is a self-contained standalone page (games/pvp-arena/) — its own
  // topbar/body, localStorage profiles, NO Firebase/realtime. It reads the
  // shared question bank window.SYM_QUESTIONS; since it loads as a separate
  // document we hand the live library across via localStorage (the Arena's
  // prelude hydrates window.SYM_QUESTIONS from it, else falls back to its
  // bundled js/questions.js sample). Opened in a new tab so the SPA stays put.
  function launchPvPArena(){
    try {
      if (Array.isArray(window.SYM_QUESTIONS) && window.SYM_QUESTIONS.length) {
        localStorage.setItem('SYM_QUESTIONS', JSON.stringify(window.SYM_QUESTIONS));
      }
    } catch (_) {}
    var base = (window.APP_BASE || (new URL('./', location.href).href));
    window.open(base + 'games/pvp-arena/index.html', '_blank', 'noopener');
  }
  window.launchPvPArena = launchPvPArena;
  // "Coming soon" helpers — tiles flagged `soon:true` in data.js have no real
  // game yet. Reuse the shared badge + friendly notice defined in dir-synthesis.js;
  // fall back to inline equivalents if that module hasn't registered them.
  function soonBadge(){
    if (typeof window.synSoonBadge === 'function') return window.synSoonBadge();
    return el('span',{ class:'syn-soon-badge',
      style:'position:absolute;top:8px;left:8px;z-index:3;display:inline-flex;align-items:center;gap:4px;'
        + 'padding:3px 8px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.09em;'
        + 'text-transform:uppercase;line-height:1;color:var(--sym-terra-dk,#9C3F1F);'
        + 'background:color-mix(in srgb, var(--sym-gold,#A2862F) 16%, transparent);'
        + 'border:1px solid color-mix(in srgb, var(--sym-terra,#C5572F) 38%, transparent);' },
      [ el('span',{html:'&#9685;'}), L({gr:'Σύντομα',en:'Soon'}) ]);
  }
  function comingSoon(g){
    if (typeof window.synComingSoon === 'function') return window.synComingSoon(g);
    SymPreview.open('mc', { title:L(g)+' · '+L({gr:'Σύντομα',en:'Coming soon'}), illu:g.illu,
      note:L({gr:'Αυτό το παιχνίδι ετοιμάζεται — θα είναι σύντομα διαθέσιμο.',en:'This game is on the way — available soon.'}) });
  }
  function pill(t, accent){ return el('span',{class:'sc-pill has-accent', style:`--ca:${accent||SITE}`}, t); }
  function stat(v, label, accent){ return el('div', { class:'sc-stat has-accent', style:`--ca:${accent||SITE}` }, [
    el('div',{class:'sc-stat__v'}, v), el('div',{class:'sc-stat__l'}, label) ]); }
  function chip(t, on, onclick){ return el('button', { class:'sc-fil'+(on?' active':''),
    onclick:(e)=>{ const par=e.currentTarget.parentNode; par.querySelectorAll('.sc-fil').forEach(b=>b.classList.remove('active')); e.currentTarget.classList.add('active'); if(onclick) onclick(); } }, t); }

  // favorite heart (persists)
  function favBtn(id){
    const on = SymStore.isFav(id);
    const b = el('button', { class:'sc-fav'+(on?' on':''), title:'Favorite', onclick:(e)=>{
      e.preventDefault(); e.stopPropagation();
      const nowOn = SymStore.toggleFav(id);
      b.classList.toggle('on', nowOn);
      if(nowOn && window.gsap) gsap.fromTo(b,{scale:.6},{scale:1,duration:.45,ease:'back.out(2)'});
    }, html:'★' });
    return b;
  }
  // display toggle (grid / list)  +  optional admin edit toggle
  function viewBar(opts){
    opts = opts || {};
    const bar = el('div', { class:'sc-viewbar' });
    if(opts.left) bar.appendChild(opts.left);
    bar.appendChild(el('div',{class:'sc-viewbar__sp'}));
    if(opts.admin && isAdmin()){
      bar.appendChild(el('button', { class:'sc-editbtn'+(ST().adminEdit==='on'||window.__symEdit?' on':''), onclick:()=>{
        window.__symEdit = !window.__symEdit; symRender();
      } }, [ glyph('quill','sc-editbtn__gl'), window.__symEdit?L({gr:'Τέλος',en:'Done'}):L({gr:'Επεξεργασία',en:'Edit'}) ]));
    }
    const seg = el('div', { class:'sc-disp' });
    [['grid','▦'],['list','≣'],['compact','▤'],['gallery','◳']].forEach(([v,ic])=> seg.appendChild(el('button', {
      class:(ST().display===v?'active':''), title:v, onclick:()=>{ ST().display=v; symRender(); }
    }, ic)));
    bar.appendChild(seg);
    return bar;
  }
  // editable text (admin) — persists
  function editable(key, def, cls){
    const txt = SymStore.name(key, def);
    if(!isAdmin() || !window.__symEdit) return el('span',{class:cls}, txt);
    const s = el('span', { class:(cls||'')+' sc-edit', contenteditable:'true', spellcheck:'false' }, txt);
    s.addEventListener('blur', ()=>SymStore.setName(key, s.textContent.trim()||def));
    s.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); s.blur(); } });
    return s;
  }
  // simple drag-reorder for admin
  function attachReorder(container, listId, getIds){
    if(!isAdmin() || !window.__symEdit) return;
    let dragEl=null;
    container.querySelectorAll('[data-rid]').forEach(node=>{
      node.setAttribute('draggable','true'); node.classList.add('sc-draggable');
      node.addEventListener('dragstart', ()=>{ dragEl=node; node.classList.add('dragging'); });
      node.addEventListener('dragend', ()=>{ node.classList.remove('dragging'); dragEl=null;
        SymStore.setOrder(listId, [...container.querySelectorAll('[data-rid]')].map(n=>n.getAttribute('data-rid'))); });
      node.addEventListener('dragover', (e)=>{ e.preventDefault();
        const after = (function(){ const els=[...container.querySelectorAll('[data-rid]:not(.dragging)')];
          return els.reduce((closest,child)=>{ const box=child.getBoundingClientRect(); const off=e.clientY-box.top-box.height/2;
            if(off<0 && off>closest.offset) return {offset:off, element:child}; return closest; },{offset:-Infinity}).element; })();
        if(!dragEl) return; if(after==null) container.appendChild(dragEl); else container.insertBefore(dragEl, after);
      });
    });
  }

  function defaults(ctx){
    const cls = (ctx.param && ctx.param.cls) || ctx.activeClass;
    const subject = (ctx.param && ctx.param.subject) || (ctx.subjects[cls.id] || ctx.subjects['gym-b'])[0];
    const game = (ctx.param && ctx.param.game) || subject.games[0];
    return { cls, subject, game, accent: cls.accent };
  }

  const S = {};

  /* ══ 1 · SUBJECT PAGE ══ (display modes · favorites · admin edit · results) */
  S.subject = function(home, ctx){
    const { cls, subject, accent } = defaults(ctx);
    const body = P(home, { back:'home', accent, roman:subject.roman, eyebrow:L(cls)+' · '+subject.sub,
      title:L(subject), sub:L(subject.summary),
      actions:[ el('button',{class:'sc-cta sc-cta--solid', onclick:()=>go('gamepanel') },
        [ glyph('grid-blocks','sc-cta__gl'), L({gr:'Δες στον Πίνακα Παιχνιδιών',en:'Browse Game Panel'}) ]) ] });

    // tabs: games / results / students
    const tabwrap = el('div',{class:'sc-subtabs sc-stagger'});
    const panes = el('div',{class:'sc-subpane'});
    // students only see Games; teachers/admins see Results & Students
    const tabs = isAdmin()
      ? [ ['games', {gr:'Παιχνίδια',en:'Games'}], ['results', {gr:'Αποτελέσματα',en:'Results'}], ['students', {gr:'Μαθητές',en:'Students'}] ]
      : [ ['games', {gr:'Παιχνίδια',en:'Games'}] ];
    if(tabs.length>1) body.appendChild(tabwrap);
    function showTab(id){
      tabwrap.querySelectorAll('.sc-subtab').forEach(b=>b.classList.toggle('active', b.dataset.t===id));
      panes.innerHTML=''; panes.appendChild(({games:gamesPane, results:resultsPane, students:studentsPane})[id]());
      if(window.injectIllus) injectIllus(panes);
    }
    tabs.forEach(([id,lab],i)=> tabwrap.appendChild(el('button',{class:'sc-subtab'+(i===0?' active':''),'data-t':id, onclick:()=>showTab(id)}, L(lab))));
    body.appendChild(panes);

    function gamesPane(){
      const wrap = el('div',{});
      wrap.appendChild(viewBar({ admin:true,
        left: el('span',{class:'sc-count'}, subject.games.length+' '+L({gr:'παιχνίδια',en:'games'})) }));
      const listId = 'subj_'+subject.id;
      let games = subject.games.map((g,i)=>({ g, rid:subject.id+'_'+i }));
      // favorites first
      games.sort((a,b)=> (SymStore.isFav(a.rid)?-1:0) - (SymStore.isFav(b.rid)?-1:0));
      const grid = el('div', { class:'sc-cards has-accent'+(ST().display!=='grid'?' sc-cards--'+ST().display:''), style:`--ca:${accent}` });
      games.forEach(({g,rid},i)=>{
        const soon = !!g.soon;
        const card = el('a', { class:'sc-gcard'+(soon?' sc-gcard--soon':''), href:'javascript:void 0', style:'position:relative', 'data-rid':rid,
          onclick: soon ? (e)=>{ e.preventDefault(); comingSoon(g); } : ()=>go('level',{subject,game:g,cls}) }, [
          soon ? soonBadge() : null,
          el('div',{class:'sc-gcard__ban'},[ favBtn(rid), glyph(g.illu,'sc-gcard__illu'), (!soon&&i%3===0?el('span',{class:'sc-tag'},L({gr:'Δωρεάν',en:'Free'})):null),
            isAdmin()&&window.__symEdit? el('span',{class:'sc-gcard__drag',html:'⠿'}):null ]),
          el('div',{class:'sc-gcard__b'},[ el('h3',{class:'sc-gcard__t'}, L(g)), el('p',{class:'sc-gcard__m'}, g.meta),
            el('div',{class:'sc-gcard__f'},[ el('span',{class:'sc-gcard__tags'},[pill(soon?L({gr:'Σύντομα',en:'Soon'}):L({gr:'Μόνος',en:'Solo'}),accent)]),
              soon ? null : el('button',{class:'sc-gcard__eye', title:'Preview', onclick:(e)=>{ e.preventDefault(); e.stopPropagation(); SymPreview.open(SymPreview.typeFor(g),{title:L(g), illu:g.illu}); }, html:'&#128065;'}),
              el('span',{class:'sc-gcard__play',html: soon ? '&#9679;' : '&#9654;'}) ]) ]),
        ]);
        grid.appendChild(card);
      });
      wrap.appendChild(grid);
      setTimeout(()=>attachReorder(grid, listId, ()=>games.map(x=>x.rid)),0);
      return wrap;
    }

    function resultsPane(){
      const wrap = el('div',{class:'has-accent', style:`--ca:${accent}`});
      wrap.appendChild(el('div',{class:'sc-stats'},[ stat('24',L({gr:'Μαθητές',en:'Students'}),accent), stat('78%',L({gr:'Μ.Ο. ακρίβειας',en:'Avg accuracy'}),accent), stat('312',L({gr:'Παιχνίδια',en:'Plays'}),accent), stat('5',L({gr:'Προς ανασκόπηση',en:'Need review'}),accent) ]));
      wrap.appendChild(el('div',{class:'sc-sec-lbl'}, L({gr:'Ανά παιχνίδι',en:'By game'})));
      const tbl = el('div',{class:'sc-table'});
      tbl.appendChild(el('div',{class:'sc-tr sc-tr--h'},[ el('span',{},L({gr:'Παιχνίδι',en:'Game'})), el('span',{},L({gr:'Μ.Ο.',en:'Avg'})), el('span',{},L({gr:'Ολοκλήρωση',en:'Completion'})), el('span',{},L({gr:'Ενέργειες',en:'Actions'})) ]));
      subject.games.slice(0,5).forEach((g,i)=>{
        const avg = [92,84,76,71,63][i]||70;
        tbl.appendChild(el('div',{class:'sc-tr'},[
          el('span',{class:'sc-tr__task'}, L(g)),
          el('span',{}, avg+'%'),
          el('span',{}, el('span',{class:'sc-bar'},[ el('span',{class:'sc-bar__f',style:`width:${avg}%`}) ])),
          el('span',{class:'sc-tr__acts'},[
            el('button',{class:'sc-mini', onclick:()=>SymPreview.open(SymPreview.typeFor(g),{title:L(g),illu:g.illu})}, L({gr:'Προεπισκόπηση',en:'Preview'})),
            el('button',{class:'sc-mini sc-mini--accent', onclick:()=>go('tartarus')}, L({gr:'Ανασκόπηση',en:'Review'})),
          ]),
        ]));
      });
      wrap.appendChild(tbl);
      return wrap;
    }

    function studentsPane(){
      const wrap = el('div',{class:'has-accent', style:`--ca:${accent}`});
      wrap.appendChild(el('div',{class:'sc-students__bar'},[
        el('input',{class:'sc-search', placeholder:L({gr:'Αναζήτηση μαθητή…',en:'Search student…'})}),
        el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>go('anathesi')},[ '＋ ', L({gr:'Ανάθεση',en:'Assign'}) ]),
      ]));
      const names = ['Αλέξης Π.','Μαρία Κ.','Νίκος Δ.','Ελένη Σ.','Γιώργος Μ.','Σοφία Ρ.','Δημήτρης Α.','Κατερίνα Ν.'];
      const grid = el('div',{class:'sc-roster'});
      names.forEach((n,i)=>{
        const acc=[88,76,93,71,64,82,59,90][i];
        grid.appendChild(el('div',{class:'sc-rcard'},[
          el('span',{class:'sc-rcard__av'}, n[0]),
          el('div',{class:'sc-rcard__b'},[ el('span',{class:'sc-rcard__n'}, n),
            el('span',{class:'sc-rcard__m'}, L({gr:'Ακρίβεια',en:'Accuracy'})+' '+acc+'%') ]),
          el('span',{class:'sc-rcard__badge'+(acc<70?' low':'')}, acc<70?'⚠':'✓'),
          el('button',{class:'sc-mini', onclick:()=>go('tartarus')}, L({gr:'Λάθη',en:'Mistakes'})),
        ]));
      });
      wrap.appendChild(grid);
      return wrap;
    }

    showTab('games');
  };

  /* ══ 2 · MODE SELECT ══ */
  S.mode = function(home, ctx){
    const { cls, subject, game, accent } = defaults(ctx);
    const body = P(home, { back:'subject', backLabel:L(subject), accent, eyebrow:L(subject)+' · '+L(game),
      title:L({gr:'Επίλεξε Λειτουργία',en:'Choose a mode'}), sub:L({gr:'Πώς θες να παίξεις απόψε;',en:'How do you want to play tonight?'}),
      actions:[ el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>SymPreview.open(SymPreview.typeFor(game),{title:L(game),illu:game.illu})},[ el('span',{html:'&#128065;'}), L({gr:'Δες σε δράση',en:'See it in action'}) ]) ] });
    const modes = [
      { gr:'Μόνος', en:'Solo', d:{gr:'Παίξε με τον ρυθμό σου',en:'Play at your own pace'}, illu:'runner', to:()=>go('level',{subject,game,cls}) },
      { gr:'Διελκυστίνδα', en:'Tug of War', d:{gr:'1 vs 1 · τράβα τη γραμμή',en:'1 vs 1 · pull the line'}, illu:'rope', to:()=>go('level',{subject,game,cls}) },
      { gr:'Live Arena', en:'Live Arena', d:{gr:'Όλη η τάξη ζωντανά',en:'The whole class, live'}, illu:'lightning-bolt', to:()=>go('live'), hot:1 },
      { gr:'Εξάσκηση', en:'Practice', d:{gr:'Χωρίς βαθμολογία',en:'No scoring, just drills'}, illu:'scroll', to:()=>go('level',{subject,game,cls}) },
    ];
    const grid = el('div', { class:'sc-modes sc-stagger has-accent', style:`--ca:${accent}` });
    modes.forEach(m=> grid.appendChild(el('button', { class:'sc-mode'+(m.hot?' sc-mode--hot':''), onclick:m.to }, [
      el('span',{class:'sc-mode__ic'},[ glyph(m.illu,'sc-mode__gl') ]),
      el('span',{class:'sc-mode__t'}, L(m)), el('span',{class:'sc-mode__d'}, L(m.d)),
      m.hot? el('span',{class:'sc-mode__badge'}, 'LIVE'):null, el('span',{class:'sc-mode__go',html:'&rarr;'}),
    ])));
    body.appendChild(grid);
  };

  /* ══ 3 · LEVEL SELECT ══ (+ grammar showcase preview) */
  S.level = function(home, ctx){
    const { cls, subject, game, accent } = defaults(ctx);
    const showType = SymPreview.typeFor(game);
    const grammar = showType==='grammar-verb' || showType==='grammar-noun';

    const CATS = grammar && showType==='grammar-verb'
      ? [ { id:'oristiki', t:{gr:'Οριστική',en:'Indicative'}, done:8, total:8 },
          { id:'ypotaktiki', t:{gr:'Υποτακτική',en:'Subjunctive'}, done:0, total:6 },
          { id:'eyktiki', t:{gr:'Ευκτική',en:'Optative'}, done:0, total:8 },
          { id:'prostaktiki', t:{gr:'Προστακτική',en:'Imperative'}, done:0, total:8 },
          { id:'onomatikoi', t:{gr:'Ονοματικοί Τύποι',en:'Nominal forms'}, done:0, total:5 },
          { id:'syndyastiko', t:{gr:'Συνδυαστικό',en:'Combined'}, done:0, total:1 } ]
      : grammar
      ? [ { id:'a', t:{gr:'Α΄ Κλίση',en:'1st declension'}, done:5, total:5 },
          { id:'b', t:{gr:'Β΄ Κλίση',en:'2nd declension'}, done:0, total:5 },
          { id:'g', t:{gr:'Γ΄ Κλίση',en:'3rd declension'}, done:0, total:6 },
          { id:'epith', t:{gr:'Επίθετα',en:'Adjectives'}, done:0, total:4 },
          { id:'syndyastiko', t:{gr:'Συνδυαστικό',en:'Combined'}, done:0, total:2 } ]
      : [ { id:'easy', t:{gr:'Εισαγωγή',en:'Intro'}, done:3, total:4 },
          { id:'mid', t:{gr:'Ενδιάμεσο',en:'Intermediate'}, done:1, total:5 },
          { id:'hard', t:{gr:'Προχωρημένο',en:'Advanced'}, done:0, total:5 },
          { id:'boss', t:{gr:'Αφεντικά',en:'Bosses'}, done:0, total:2 } ];

    const ROWS = {
      oristiki: ['Ενεστώτας, Μέλλοντας — Ενεργητική Φωνή','Παρατατικός, Αόριστος — Ενεργητική Φωνή','Παρακείμενος, Υπερσυντέλικος — Ενεργητική','Όλοι οι χρόνοι — Ενεργητική Φωνή','Ενεστώτας, Μέλλοντας — Μέση Φωνή','Παρατατικός, Αόριστος — Μέση Φωνή','Όλοι οι χρόνοι — Μέση Φωνή','Όλοι οι χρόνοι — Ενεργητική & Μέση'],
    };
    const totalAll = CATS.reduce((s,c)=>s+c.total,0), doneAll = CATS.reduce((s,c)=>s+c.done,0);

    const body = P(home, { back:'subject', backLabel:L(subject), accent, eyebrow:L(subject)+' · '+L(game),
      title:L(game),
      actions:[ el('button',{class:'lv-share', onclick:()=>go('live')},[ glyph('grid-blocks','lv-share__gl'), L({gr:'Μοιράσου στην τάξη',en:'Share to class'}) ]) ] });

    body.appendChild(el('div',{class:'lv-progress sc-stagger'},[
      el('div',{class:'lv-progress__bar'},[ el('span',{class:'lv-progress__fill',style:`width:${doneAll/totalAll*100}%`}) ]),
      el('span',{class:'lv-progress__t'}, doneAll+'/'+totalAll+' '+L({gr:'ολοκληρωμένα',en:'completed'})),
    ]));

    const shell = el('div',{class:'lv-shell sc-stagger has-accent', style:`--ca:${accent}`});
    const rail = el('div',{class:'lv-cats'});
    rail.appendChild(el('div',{class:'lv-cats__hd'}, L({gr:'Κατηγορίες',en:'Categories'})));
    const list = el('div',{class:'lv-list'});
    let activeCat = CATS[0].id;

    function paintList(){
      const cat = CATS.find(c=>c.id===activeCat) || CATS[0];
      list.innerHTML='';
      list.appendChild(el('div',{class:'lv-list__hd'},[
        el('span',{class:'lv-list__ttl'}, L(cat.t)),
        el('span',{class:'lv-list__ct'}, cat.total+' '+L({gr:'επίπεδα',en:'levels'})),
      ]));
      const rows = ROWS[cat.id] || Array.from({length:cat.total},(_,i)=>L({gr:'Επίπεδο',en:'Level'})+' '+(i+1));
      rows.forEach((label,i)=>{
        const dn = i<cat.done, now = i===cat.done;
        list.appendChild(el('button',{class:'lv-row'+(dn?' done':now?' now':''), onclick:()=>{
          // coming-soon tile → friendly notice, never a fake preview
          if (game && game.soon) { return comingSoon(game); }
          const _fn = (window.synResolveLaunch && synResolveLaunch(game));
          if (_fn && window.SYN_GAMES && SYN_GAMES[_fn]) {
            // PER-LEVEL deep-start: thread the clicked row's level id (1-based)
            // and the active category as `mode`. Openers that accept
            // (levelId, mode) start at the chosen level; others ignore the args.
            return synLaunch(_fn, i + 1, activeCat);
          }
          return SymPreview.open(grammar?showType:'mc',{title:L(game)+' · '+label, illu:game.illu, note:L({gr:'Στατική προεπισκόπηση — δεν ξεκινά το παιχνίδι.',en:'Static preview — does not start the game.'})});
        } },[
          el('span',{class:'lv-row__n'}, dn?'✓':String(i+1).padStart(2,'0')),
          el('span',{class:'lv-row__t'}, label),
          el('span',{class:'lv-row__go'}, (dn?L({gr:'Ξανά',en:'Replay'}):L({gr:'Ξεκίνα',en:'Start'}))+' →'),
        ]));
      });
    }
    CATS.forEach(c=>{
      rail.appendChild(el('button',{class:'lv-cat'+(c.id===activeCat?' active':''),'data-c':c.id, onclick:()=>{ activeCat=c.id; rail.querySelectorAll('.lv-cat').forEach(b=>b.classList.toggle('active', b.dataset.c===c.id)); paintList(); }},[
        el('div',{class:'lv-cat__b'},[ el('span',{class:'lv-cat__t'}, L(c.t)), el('span',{class:'lv-cat__m'}, c.done+'/'+c.total+' '+L({gr:'ολοκλ.',en:'done'})) ]),
        el('span',{class:'lv-cat__n'+(c.done===c.total?' full':'')}, c.done),
      ]));
    });
    rail.appendChild(el('button',{class:'lv-cat lv-cat--custom', onclick:()=>SymPreview.open(grammar?showType:'mc',{title:L({gr:'Προσαρμοσμένο',en:'Custom'})})},[
      el('div',{class:'lv-cat__b'},[ el('span',{class:'lv-cat__t'}, L({gr:'Προσαρμοσμένο',en:'Custom'})), el('span',{class:'lv-cat__m'}, L({gr:'Φωνή, Εγκλίσεις, Χρόνοι & Τύποι',en:'Voice, moods, tenses & forms'})) ]),
    ]));
    if(isAdmin()){
      rail.appendChild(el('button',{class:'lv-cat lv-cat--admin', onclick:()=>SymPreview.open('mc',{title:L({gr:'Διαχείριση κατηγοριών',en:'Manage categories'}), note:L({gr:'Πρόσθεση, μετονομασία & σειρά κατηγοριών — από τον πίνακα διαχείρισης.',en:'Add, rename & reorder categories — from admin.'})})},[
        el('div',{class:'lv-cat__b'},[ el('span',{class:'lv-cat__t'}, '✎ '+L({gr:'Επεξεργασία κατηγοριών',en:'Edit categories'})), el('span',{class:'lv-cat__m'}, L({gr:'Admin: πρόσθεση / σειρά',en:'Admin: add / reorder'})) ]),
      ]));
    }
    shell.appendChild(rail); shell.appendChild(list);
    body.appendChild(shell);
    paintList();
  };

  /* ══ 4 · GAME PANEL ══ (all engines · display modes · favorites · admin edit) */
  S.gamepanel = function(home, ctx){
    const body = P(home, { back:'home', accent:SITE, eyebrow:L({gr:'Μηχανές & Ύλη',en:'Engines & content'}),
      title:L({gr:'Πίνακας Παιχνιδιών',en:'Game Panel'}), sub:L({gr:'Διάλεξε μηχανή, ταίριαξέ τη με ύλη — ή ανέβασε δική σου.',en:'Pick an engine, pair it with any material — or upload your own.'}) });
    const cats = ['Όλα','Ιλιάδα','Οδύσσεια','Γραμματική','Ιστορία','Λατινικά'];
    // ── game mode selection ──
    const gmodes = [
      { v:'solo', illu:'runner', t:{gr:'Ατομικά',en:'Solo'}, d:{gr:'Παίξε μόνος σου',en:'Play on your own'}, to:()=>go('subject') },
      { v:'live', illu:'lightning-bolt', t:{gr:'Live Arena',en:'Live Arena'}, d:{gr:'Όλη η τάξη ζωντανά',en:'Whole class, live'}, to:()=>go('live',{step:'config'}) },
      { v:'tow', illu:'rope', t:{gr:'Διελκυστίνδα',en:'Tug of War'}, d:{gr:'Ομάδες, τράβα τη γραμμή',en:'Teams, pull the line'}, to:()=>go('live',{step:'config',cfg:{mode:'team',teams:3,gmode:'tow',time:5,score:['standard'],count:10}}) },
      { v:'pvp', illu:'crossed-swords', t:{gr:'Ο Ἀγών · PvP',en:'The Agon · PvP'}, d:{gr:'Μονομαχίες & ομαδικοί αγώνες',en:'Duels & free-for-all'}, to:()=>launchPvPArena() },
      { v:'practice', illu:'scroll', t:{gr:'Εξάσκηση',en:'Practice'}, d:{gr:'Χωρίς βαθμολογία',en:'No scoring'}, to:()=>go('subject') },
    ];
    const gmwrap = el('div',{class:'sc-pmodes sc-stagger'}, gmodes.map(m=> el('button',{class:'sc-pmode', onclick:m.to},[
      el('span',{class:'sc-pmode__ic'},[ glyph(m.illu,'sc-pmode__gl') ]),
      el('span',{class:'sc-pmode__b'},[ el('span',{class:'sc-pmode__t'}, L(m.t)), el('span',{class:'sc-pmode__d'}, L(m.d)) ]),
    ])));
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger', style:'margin-top:0'}, L({gr:'Λειτουργία παιχνιδιού',en:'Game mode'})));
    body.appendChild(gmwrap);
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Μηχανές',en:'Engines'})));
    const filwrap = el('div',{class:'sc-fils sc-stagger'}, cats.map((c,i)=>chip(c,i===0)));
    body.appendChild(filwrap);
    // ── FULL engine catalogue ──
    // The panel must surface EVERY launchable game: the curated carousel
    // (SY.ENGINES) AND every registered Game-Panel engine (window.GP_ENGINES
    // — naumachia, phalanx, the whole PvP / engines pack, …). Build a merged,
    // de-duped list keyed by the openFn each tile resolves to via
    // synResolveLaunch, so nothing shows twice and every tile can launch.
    const _ALL_ENGINES = (function buildAllEngines(){
      const out = [], seen = new Set();
      function keyOf(t){
        return (window.synResolveLaunch && synResolveLaunch(t)) ||
               ('label:' + (t.en || t.gr || ''));
      }
      // 1) curated carousel first (keeps its hand-picked illu + meta + order)
      (SY.ENGINES || []).forEach(e => { out.push(e); seen.add(keyOf(e)); });
      // 2) every GP engine not already represented by a carousel tile
      (window.GP_ENGINES || []).forEach(g => {
        // map a GP engine record → a panel tile shape {gr,en,meta,illu,launch}
        const fn = (window.SYN_LAUNCH_MAP &&
                    (SYN_LAUNCH_MAP[g.id] || SYN_LAUNCH_MAP[g.label])) || null;
        const tile = {
          gr: g.label,
          en: g.subtitle || g.label,
          meta: { gr: g.subtitle || '', en: g.subtitle || '' },
          illu: g.illu || null,
          icon: g.icon || null,
          launch: fn ? { fn } : undefined
        };
        const k = fn ? fn : ('label:' + g.label);
        if (seen.has(k)) return;            // already shown via carousel
        seen.add(k);
        out.push(tile);
      });
      return out;
    })();

    body.appendChild(viewBar({ admin:true, left: el('span',{class:'sc-count'}, _ALL_ENGINES.length+' '+L({gr:'μηχανές',en:'engines'})) }));

    const list = ST().display==='list';
    const grid = el('div',{class:'sc-eng-grid'+(ST().display!=='grid'?' sc-eng-grid--'+ST().display:'')});
    grid.appendChild(el('button',{class:'sc-upload', onclick:()=>SymPreview.open('mc',{title:L({gr:'Νέο κουίζ',en:'New quiz'}), note:L({gr:'Ανέβασε CSV/JSON και γίνεται παιχνίδι.',en:'Upload CSV/JSON and it becomes a game.'})})},[ el('span',{class:'sc-upload__ic',html:'&#8682;'}),
      el('span',{},[ el('span',{class:'sc-upload__t'}, L({gr:'Ανέβασε δικό σου κουίζ',en:'Upload your own quiz'})), el('span',{class:'sc-upload__s'}, 'CSV · JSON · TSV') ]) ]));

    // favorites first, then saved order
    let items = _ALL_ENGINES.map((e,i)=>({ e, rid:'eng_'+i, a:SY.CLASSES[i%SY.CLASSES.length].accent }));
    const ordered = SymStore.order('gamepanel', items.map(x=>x.rid));
    items.sort((a,b)=> ordered.indexOf(a.rid)-ordered.indexOf(b.rid));
    items.sort((a,b)=> (SymStore.isFav(b.rid)?1:0)-(SymStore.isFav(a.rid)?1:0));
    items.forEach(({e,rid,a})=>{
      grid.appendChild(el('a',{class:'sc-engc has-accent',href:'javascript:void 0','data-rid':rid,style:`--ca:${a}`,onclick:()=>go('level',{game:e})},[
        favBtn(rid),
        el('span',{class:'sc-engc__ban'},[ e.illu ? glyph(e.illu,'sc-engc__illu') : el('span',{class:'sc-engc__illu sc-engc__illu--emoji'}, e.icon || '🎮') ]),
        el('span',{class:'sc-engc__b'},[ el('span',{class:'sc-engc__t'}, L(e)), el('span',{class:'sc-engc__m'}, L(e.meta)) ]),
        el('span',{class:'sc-engc__tools'},[
          el('button',{class:'sc-engc__eye', title:'Preview', onclick:(ev)=>{ ev.preventDefault(); ev.stopPropagation(); SymPreview.open(SymPreview.typeFor(e),{title:L(e),illu:e.illu}); }, html:'&#128065;'}),
          (isAdmin()&&window.__symEdit)? el('span',{class:'sc-engc__drag',html:'⠿'}) : el('span',{class:'sc-engc__go',html:'&#9654;'}),
        ]),
      ]));
    });
    body.appendChild(grid);
    setTimeout(()=>attachReorder(grid,'gamepanel',()=>items.map(x=>x.rid)),0);
  };

  /* ══ 5 · LIVE ARENA ══ (host/join → config → lobby) */
  S.live = function(home, ctx){
    const accent = '#C23A2E';
    const step = (ctx.param && ctx.param.step) || 'choose';
    const cfg = (ctx.param && ctx.param.cfg) || { mode:'solo', teams:3, gmode:'classic', time:5, score:['standard'], count:10 };
    if(!Array.isArray(cfg.score)) cfg.score = [cfg.score || 'standard'];
    const body = P(home, { back:'home', accent, eyebrow:L({gr:'Ζωντανή Αρένα',en:'Live Arena'}),
      title: step==='lobby'?L({gr:'Λόμπι Μάχης',en:'Battle Lobby'}):L({gr:'Ζωντανή Μάχη',en:'Live Battle'}),
      sub: step==='lobby'?L({gr:'Οι μαθητές μπαίνουν με PIN ή QR.',en:'Students join with a PIN or QR.'}):L({gr:'Φιλοξένησε ή μπες σε αγώνα.',en:'Host or join a match.'}),
      actions: step==='lobby'?[ el('button',{class:'sc-cta sc-cta--solid'},[ glyph('play-button','sc-cta__gl'), L({gr:'Έναρξη',en:'Start'}) ]) ]:null });

    if(step==='choose'){
      const ch = el('div',{class:'sc-live2 sc-stagger'});
      ch.appendChild(el('button',{class:'sc-host', onclick:()=>go('live',{step:'config',cfg})},[
        el('span',{class:'sc-host__ic'},[ glyph('crown-laurel','sc-gl') ]),
        el('span',{class:'sc-host__t'}, L({gr:'Φιλοξένησε',en:'Host'})),
        el('span',{class:'sc-host__d'}, L({gr:'Στήσε αγώνα για την τάξη σου',en:'Set up a match for your class'})),
      ]));
      ch.appendChild(el('div',{class:'sc-join2'},[
        el('span',{class:'sc-host__ic'},[ glyph('lightning-bolt','sc-gl') ]),
        el('span',{class:'sc-host__t'}, L({gr:'Μπες με PIN',en:'Join with PIN'})),
        el('div',{class:'sc-join2__form'},[ el('input',{class:'sc-join2__pin',maxlength:'6',placeholder:'A7K92M'}),
          el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>go('live',{step:'lobby',cfg})}, L({gr:'Μπες',en:'Join'})) ]),
      ]));
      body.appendChild(ch);
      return;
    }

    if(step==='config'){
      const c = Object.assign({}, cfg); c.score = (cfg.score||['standard']).slice();
      const wrap = el('div',{class:'sc-cfg sc-stagger has-accent', style:`--ca:${accent}`});

      // ── GAME (loaded from the Game Panel) ──
      if(!c.game) c.game = (window.SYM.MPGAMES[0]);
      const gG = el('div',{class:'sc-cfg__g'});
      gG.appendChild(el('div',{class:'sc-cfg__l'}, L({gr:'Παιχνίδι',en:'Game'})));
      const gGrid = el('div',{class:'sc-gpick'});
      function paintGames(){
        gGrid.innerHTML='';
        window.SYM.MPGAMES.forEach(g=> gGrid.appendChild(el('button',{class:'sc-gpick__o'+(c.game&&c.game.id===g.id?' active':''), onclick:()=>{ c.game=g; paintGames(); }},[
          el('span',{class:'sc-gpick__ic','data-illu':g.illu}), el('span',{class:'sc-gpick__t'}, L(g)) ])));
        gGrid.appendChild(el('button',{class:'sc-gpick__o sc-gpick__o--more', onclick:()=>gamePanelPopup(g=>{ c.game=g; paintGames(); })},[
          el('span',{class:'sc-gpick__ic',html:'▦'}), el('span',{class:'sc-gpick__t'}, L({gr:'Επίλεξε άλλο…',en:'Select another…'})) ]));
        if(window.injectIllus) injectIllus(gGrid);
      }
      paintGames();
      gG.appendChild(gGrid); wrap.appendChild(gG);

      // ── CONTENT: pick existing level OR upload new ──
      const ctG = el('div',{class:'sc-cfg__g'});
      ctG.appendChild(el('div',{class:'sc-cfg__l'}, L({gr:'Περιεχόμενο',en:'Content'})));
      const ctSeg = el('div',{class:'sc-cfg__opts'});
      const ctBody = el('div',{class:'sc-content'});
      [{v:'existing',gr:'Υπάρχον επίπεδο',en:'Existing level'},{v:'upload',gr:'Νέο / ανέβασμα',en:'New / upload'}].forEach(o=> ctSeg.appendChild(el('button',{class:'sc-cfg__o'+((c.content||'existing')===o.v?' active':''), onclick:(e)=>{ c.content=o.v; ctSeg.querySelectorAll('.sc-cfg__o').forEach(b=>b.classList.remove('active')); e.currentTarget.classList.add('active'); paintContent(); }}, L(o))));
      ctG.appendChild(ctSeg); ctG.appendChild(ctBody); wrap.appendChild(ctG);
      function paintContent(){
        ctBody.innerHTML='';
        if((c.content||'existing')==='existing'){
          // pick a Class→Subject→Exercise→Level via a level-selection popup
          c.nav = c.nav || { grade:'Α΄ Γυμνασίου', subject:'Οδύσσεια', exercise:'Τρίβια', level:'Level 3', expl:{gr:'Νησιά & περιπέτειες — μεσαία δυσκολία',en:'Islands & adventures — medium'} };
          const card = el('div',{class:'sc-lvlsel'});
          function paintCard(){
            card.innerHTML='';
            card.appendChild(el('div',{class:'sc-lvlsel__b'},[
              el('div',{class:'sc-lvlsel__bc'}, c.nav.grade+' › '+c.nav.subject+' › '+c.nav.exercise),
              el('div',{class:'sc-lvlsel__lv'}, c.nav.level),
              el('div',{class:'sc-lvlsel__ex'}, L(c.nav.expl||{gr:'',en:''})),
            ]));
            card.appendChild(el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>levelPopup()}, L({gr:'Άλλαξε επίπεδο',en:'Change level'})));
          }
          function levelPopup(){
            const ov=el('div',{class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
            const box=el('div',{class:'sc-lvpop'});
            box.appendChild(el('div',{class:'sc-lvpop__bar'},[ el('span',{},'≣ '+L({gr:'Επιλογή επιπέδου',en:'Select level'})), el('button',{class:'pv-modal__x', onclick:()=>ov.remove(), html:'&times;'}) ]));
            const navrow=el('div',{class:'sc-lvpop__nav'});
            [['grade',{gr:'Τάξη',en:'Class'},['Α΄ Γυμνασίου','Β΄ Γυμνασίου','Γ΄ Γυμνασίου','Α΄ Λυκείου','Β΄ Λυκείου','Γ΄ Λυκείου']],
             ['subject',{gr:'Μάθημα',en:'Subject'},['Οδύσσεια','Ιλιάδα','Αρχαία','Ιστορία','Λατινικά']],
             ['exercise',{gr:'Άσκηση',en:'Exercise'},['Τρίβια','Κλίση ρημάτων','Λεξιλόγιο','Χρονολόγιο']]].forEach(([k,lab,opts])=>{
              navrow.appendChild(el('label',{class:'sc-nav-step'},[ el('span',{class:'sc-nav-step__l'}, L(lab)), el('select',{class:'sc-field__i sc-select', onchange:(e)=>{ c.nav[k]=e.target.value; }}, opts.map(o=>el('option',{selected:c.nav[k]===o?'selected':null}, o))) ]));
            });
            box.appendChild(navrow);
            box.appendChild(el('div',{class:'sc-lvpop__hd'}, L({gr:'Επίπεδα',en:'Levels'})));
            const LV=[ {n:'Level 1',e:{gr:'Εισαγωγή — βασικά γεγονότα',en:'Intro — basic facts'}},
                       {n:'Level 2',e:{gr:'Ήρωες & χαρακτήρες',en:'Heroes & characters'}},
                       {n:'Level 3',e:{gr:'Νησιά & περιπέτειες — μεσαία δυσκολία',en:'Islands & adventures — medium'}},
                       {n:'Level 4',e:{gr:'Βαθιά ανάλυση — δύσκολο',en:'Deep analysis — hard'}},
                       {n:'Όλα',e:{gr:'Όλα τα επίπεδα μαζί',en:'All levels combined'}} ];
            const list=el('div',{class:'sc-lvpop__list'});
            LV.forEach((lv,i)=> list.appendChild(el('button',{class:'sc-lvpop__row'+(c.nav.level===lv.n?' on':''), onclick:()=>{ c.nav.level=lv.n; c.nav.expl=lv.e; ov.remove(); paintCard(); }},[
              el('span',{class:'sc-lvpop__n'}, i<2?'✓':String(i+1)),
              el('span',{class:'sc-lvpop__t'},[ el('b',{}, lv.n), el('span',{class:'sc-lvpop__e'}, L(lv.e)) ]),
              el('span',{class:'sc-lvpop__go', onclick:(ev)=>{ ev.stopPropagation(); SymPreview.open('mc',{title:lv.n+' · '+c.nav.subject}); }, html:'&#128065;'}),
            ])));
            box.appendChild(list);
            ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
            requestAnimationFrame(()=>ov.classList.add('in'));
            if(window.gsap) gsap.from(box,{y:20,scale:.97,autoAlpha:0,duration:.35,ease:'back.out(1.5)'});
          }
          paintCard();
          ctBody.appendChild(card);
        } else {
          // upload + questions count
          const qLab = el('div',{class:'sc-cfg__l', style:'margin-top:4px'},[ L({gr:'Αριθμός ερωτήσεων',en:'Number of questions'}), el('b',{class:'sc-cfg__val', id:'cfgQ'}, String(c.count)) ]);
          const qInput = el('input',{class:'sc-slider', type:'range', min:'1', max:'100', step:'1', value:String(c.count)});
          qInput.addEventListener('input', ()=>{ c.count=+qInput.value; document.getElementById('cfgQ').textContent=String(c.count); fillSlider(qInput); });
          ctBody.appendChild(qLab); ctBody.appendChild(qInput);
          ctBody.appendChild(el('div',{class:'sc-upl'},[
            el('button',{class:'sc-upl__b', onclick:()=>SymPreview.open('mc',{title:L({gr:'Το αρχείο σου',en:'Your file'}), note:L({gr:'Ανέβασε CSV/JSON και γίνεται παιχνίδι.',en:'Upload CSV/JSON and it becomes a game.'})})},[ el('span',{html:'⬆ '}), L({gr:'Ανέβασε το αρχείο σου',en:'Upload your file'}) ]),
            el('button',{class:'sc-upl__b sc-upl__b--ghost'},[ el('span',{html:'⬇ '}), L({gr:'Κατέβασε πρότυπο',en:'Download template'}) ]),
          ]));
          setTimeout(()=>fillSlider(qInput),0);
        }
      }
      paintContent();

      // ── participation: Solo / Teams (+ team count) ──
      const partG = el('div',{class:'sc-cfg__g'});
      partG.appendChild(el('div',{class:'sc-cfg__l'}, L({gr:'Παίκτες',en:'Players'})));
      const partRow = el('div',{class:'sc-cfg__opts'});
      const teamStepper = el('div',{class:'sc-stepper'+(c.mode==='team'?'':' off')});
      [{v:'solo',gr:'Μόνος',en:'Solo'},{v:'team',gr:'Ομάδες',en:'Teams'}].forEach(o=> partRow.appendChild(el('button',{class:'sc-cfg__o'+(c.mode===o.v?' active':''), onclick:(e)=>{ c.mode=o.v; partRow.querySelectorAll('.sc-cfg__o').forEach(b=>b.classList.remove('active')); e.currentTarget.classList.add('active'); teamStepper.classList.toggle('off', o.v!=='team'); }}, L(o))));
      // team count stepper
      const tval = el('b',{}, String(c.teams));
      teamStepper.appendChild(el('button',{class:'sc-stepper__b', onclick:()=>{ c.teams=Math.max(2,c.teams-1); tval.textContent=String(c.teams); }}, '−'));
      teamStepper.appendChild(el('span',{class:'sc-stepper__v'},[ tval, ' ', el('small',{}, L({gr:'ομάδες',en:'teams'})) ]));
      teamStepper.appendChild(el('button',{class:'sc-stepper__b', onclick:()=>{ c.teams=Math.min(6,c.teams+1); tval.textContent=String(c.teams); }}, '+'));
      partRow.appendChild(teamStepper);
      partG.appendChild(partRow); wrap.appendChild(partG);

      // ── time slider (1–60 min) ──
      const timeG = el('div',{class:'sc-cfg__g'});
      const timeLab = el('div',{class:'sc-cfg__l'},[ L({gr:'Χρόνος παιχνιδιού',en:'Game time'}), el('b',{class:'sc-cfg__val', id:'cfgTime'}, c.time+' '+L({gr:'λεπτά',en:'min'})) ]);
      timeG.appendChild(timeLab);
      const timeInput = el('input',{class:'sc-slider', type:'range', min:'1', max:'60', step:'1', value:String(c.time)});
      timeInput.addEventListener('input', ()=>{ c.time=+timeInput.value; document.getElementById('cfgTime').textContent=c.time+' '+L({gr:'λεπτά',en:'min'}); fillSlider(timeInput); });
      timeG.appendChild(timeInput); wrap.appendChild(timeG);

      // ── scoring (multi-select) ──
      const scoreG = el('div',{class:'sc-cfg__g'});
      scoreG.appendChild(el('div',{class:'sc-cfg__l'},[ L({gr:'Βαθμολογία',en:'Scoring'}), el('span',{class:'sc-cfg__hint'}, L({gr:'(πολλαπλή επιλογή)',en:'(multi-select)'})) ]));
      const scoreRow = el('div',{class:'sc-cfg__opts'});
      [{v:'standard',gr:'Κανονική',en:'Standard'},{v:'speed',gr:'Ταχύτητα',en:'Speed bonus'},{v:'streak',gr:'Σερί',en:'Streak'}].forEach(o=> scoreRow.appendChild(el('button',{class:'sc-cfg__o sc-cfg__o--multi'+(c.score.indexOf(o.v)>=0?' active':''), onclick:(e)=>{ const i=c.score.indexOf(o.v); if(i>=0){ if(c.score.length>1) c.score.splice(i,1); } else c.score.push(o.v); e.currentTarget.classList.toggle('active', c.score.indexOf(o.v)>=0); }}, [ el('span',{class:'sc-cfg__chk'}), L(o) ])));
      scoreG.appendChild(scoreRow); wrap.appendChild(scoreG);

      wrap.appendChild(el('div',{class:'sc-cfg__foot'},[
        el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>go('live',{step:'choose'})}, L({gr:'← Πίσω',en:'← Back'})),
        el('button',{class:'sc-cta sc-cta--solid', onclick:()=>go('live',{step:'lobby',cfg:c})},[ L({gr:'Δημιουργία λόμπι',en:'Create lobby'}), el('span',{html:' &rarr;'}) ]),
      ]));
      body.appendChild(wrap);
      setTimeout(()=>{ fillSlider(timeInput); },0);
      function fillSlider(inp){ const p=(inp.value-inp.min)/(inp.max-inp.min)*100; inp.style.background=`linear-gradient(90deg, var(--ca) ${p}%, var(--sink) ${p}%)`; }

      // popup that loads the Game Panel to pick any game
      function gamePanelPopup(onpick){
        const ov=el('div',{class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
        const box=el('div',{class:'sc-gpop'});
        box.appendChild(el('div',{class:'sc-gpop__bar'},[ el('span',{},'▦ '+L({gr:'Πίνακας Παιχνιδιών',en:'Game Panel'})), el('button',{class:'pv-modal__x', onclick:()=>ov.remove(), html:'&times;'}) ]));
        box.appendChild(el('input',{class:'sc-search', placeholder:L({gr:'Αναζήτηση παιχνιδιού…',en:'Search game…'}), oninput:(e)=>{ const q=e.target.value.toLowerCase(); box.querySelectorAll('.sc-gpop__c').forEach(n=>{ n.style.display=n.textContent.toLowerCase().includes(q)?'':'none'; }); }}));
        const grid=el('div',{class:'sc-gpop__grid'});
        window.SYM.ENGINES.concat(window.SYM.MPGAMES).forEach(g=> grid.appendChild(el('button',{class:'sc-gpop__c', onclick:()=>{ onpick(g); ov.remove(); }},[ el('span',{class:'sc-gpop__ic','data-illu':g.illu}), el('span',{}, L(g)) ])));
        box.appendChild(grid);
        ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
        if(window.injectIllus) injectIllus(ov);
        requestAnimationFrame(()=>ov.classList.add('in'));
        if(window.gsap) gsap.from(box,{y:20,scale:.97,autoAlpha:0,duration:.35,ease:'back.out(1.5)'});
      }
      return;
    }

    // lobby
    const gName = (cfg.game && L(cfg.game)) || L({gr:'Παιχνίδι',en:'Game'});
    const partName = cfg.mode==='team'?{gr:cfg.teams+' Ομάδες',en:cfg.teams+' Teams'}:{gr:'Μόνος',en:'Solo'};
    const contentName = (cfg.content==='upload') ? {gr:'Δικό σου ('+cfg.count+' ερωτ.)',en:'Custom ('+cfg.count+' Qs)'} : (cfg.nav ? {gr:cfg.nav.subject+' · '+cfg.nav.exercise,en:cfg.nav.subject+' · '+cfg.nav.exercise} : {gr:'Υπάρχον',en:'Existing'});
    body.appendChild(el('div',{class:'sc-cfg-recap sc-stagger'},[
      pill(gName, accent), pill(L(contentName), accent), pill(L(partName), accent), pill((cfg.time||5)+' '+L({gr:'λεπτά',en:'min'}), accent),
      el('button',{class:'sc-mini', onclick:()=>go('live',{step:'config',cfg})}, '✎ '+L({gr:'Αλλαγή',en:'Edit'})),
    ]));
    const wrap = el('div',{class:'sc-live sc-stagger'});
    wrap.appendChild(el('div',{class:'sc-live__join'},[
      el('div',{class:'sc-live__url'},[ el('span',{class:'sc-live__urll'},L({gr:'Μπες από',en:'Join at'})), el('b',{},'symposi-on.com') ]),
      el('div',{class:'sc-live__pinrow'},[
        el('div',{class:'sc-qr'}, Array.from({length:64}).map((_,i)=>el('i',{class:(i*7+((i*i)%5))%3===0?'on':''}))),
        el('div',{class:'sc-live__pinbox'},[ el('span',{class:'sc-live__pinl'},'PIN'), el('div',{class:'sc-live__pin'},'A7K92M'),
          el('div',{class:'sc-live__share'},[ el('button',{class:'sc-mini'},'⌁ '+L({gr:'Σύνδεσμος',en:'Link'})), el('button',{class:'sc-mini'},'⎘ PIN') ]) ]),
      ]),
    ]));
    const players = ['Αλέξης','Μαρία','Νίκος','Ελένη','Γιώργος','Σοφία','Δημήτρης','Κατερίνα','Παύλος'];
    wrap.appendChild(el('div',{class:'sc-live__players'},[
      el('div',{class:'sc-live__phd'},[ el('span',{},[glyph('owl','sc-gl'),' '+L({gr:'Παίκτες',en:'Players'})]), el('span',{class:'sc-live__count'},'9') ]),
      el('div',{class:'sc-live__grid'}, players.map(n=>el('div',{class:'sc-pl'},[ el('span',{class:'sc-pl__av'}, n[0]), el('span',{class:'sc-pl__n'}, n) ]))),
    ]));
    body.appendChild(wrap);
  };

  /* ══ 6 · HERO PROFILE ══ */
  S.profile = function(home, ctx){
    const accent = '#7C5AC2';
    const body = P(home, { back:'home', accent, eyebrow:L({gr:'Ο Ήρωάς μου',en:'My Hero'}), title:L({gr:'Προφίλ',en:'Profile'}) });
    // ── Live profile: bound to the signed-in user + real progression ──
    // A brand-new (or signed-out) user therefore shows their own name and
    // zeroed stats — never the old hardcoded "Ὀδυσσεύς / Lv.12 / 142 games".
    const prog = (typeof getProgression === 'function' && getProgression()) || {};
    const xp = Math.max(0, Math.round(prog.xp || 0));
    const HEROLV = Math.max(0, prog.level != null ? prog.level
      : (typeof _hjLevel === 'function' ? _hjLevel(xp) : 0));
    // level L spans xp ∈ [100·L², 100·(L+1)²) under _hjLevel = floor(√(xp/100))
    const lvBase = 100 * HEROLV * HEROLV;
    const lvNext = 100 * (HEROLV + 1) * (HEROLV + 1);
    const lvPct  = lvNext > lvBase ? Math.min(100, Math.max(0, Math.round((xp - lvBase) / (lvNext - lvBase) * 100))) : 0;
    const fmt = n => Number(n || 0).toLocaleString('el-GR');
    const u = (typeof currentUser !== 'undefined') ? currentUser : null;
    const heroName = (u && (u.displayName || (u.email ? u.email.split('@')[0] : null)))
      || L({gr:'Ήρωας',en:'Hero'});
    const st = prog.stats || {};
    const eqId = SymStore.get('avatar', 'av-athena');
    const eqAv = SY.AVATARS.find(a=>a.id===eqId) || SY.AVATARS[0];
    const eqTitleId = SymStore.get('title', 't-rhetor');
    const eqTitle = (SY.TITLES.find(t=>t.id===eqTitleId)) || SY.TITLES[2];
    const card = el('div',{class:'sc-prof sc-stagger has-accent', style:`--ca:${accent}`});
    card.appendChild(el('div',{class:'sc-prof__hero'},[
      el('button',{class:'sc-prof__ring sc-prof__ring--btn', title:L({gr:'Άλλαξε avatar',en:'Change avatar'}), onclick:()=>avatarPicker()},[ el('span',{class:'sc-prof__seal','data-illu':eqAv.illu}), el('span',{class:'sc-prof__lvl'}, String(HEROLV)), el('span',{class:'sc-prof__edit',html:'✎'}) ]),
      el('div',{class:'sc-prof__id'},[
        el('h2',{class:'sc-prof__name'}, heroName),
        el('button',{class:'sc-prof__title sc-prof__title--btn', onclick:()=>titlePicker()},[ glyph('crown-laurel','sc-gl'), el('span',{}, L(eqTitle)), el('span',{class:'sc-prof__tedit',html:'✎'}) ]),
        el('div',{class:'sc-xp'},[ el('div',{class:'sc-xp__bar'},[el('span',{class:'sc-xp__fill',style:'width:'+lvPct+'%'})]), el('span',{class:'sc-xp__t'}, fmt(xp)+' / '+fmt(lvNext)+' XP') ]),
      ]),
    ]));
    card.appendChild(el('div',{class:'sc-prof__stats'},[ stat(fmt(st.sessions||0),L({gr:'Παιχνίδια',en:'Games'}),accent), stat(Math.round(st.accuracy||0)+'%',L({gr:'Ακρίβεια',en:'Accuracy'}),accent), stat(fmt(st.bestStreak||0),L({gr:'Σερί',en:'Streak'}),accent), stat(fmt(st.wins||0),L({gr:'Νίκες Live',en:'Live wins'}),accent) ]));
    body.appendChild(card);

    function titlePicker(){
      const ov=el('div',{class:'acro-ov', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
      const box=el('div',{class:'acro-box', style:'max-width:440px'});
      box.appendChild(el('div',{class:'acro-box__bar'},[
        el('div',{class:'acro-box__ttl'},[ glyph('crown-laurel','acro-box__ic'), L({gr:'Τίτλοι Ήρωα',en:'Hero Titles'}) ]),
        el('span',{class:'av-lv'}, 'Lv. '+HEROLV),
        el('button',{class:'acro-box__x', onclick:()=>ov.remove(), html:'&times;'}),
      ]));
      const list=el('div',{class:'ttl-list'});
      SY.TITLES.forEach(t=>{
        const locked = HEROLV < t.lv, eq = SymStore.get('title','t-rhetor')===t.id;
        list.appendChild(el('button',{class:'ttl-row'+(locked?' locked':'')+(eq?' eq':''), onclick:()=>{ if(locked) return; SymStore.set('title',t.id); ov.remove(); symRender(); }},[
          el('span',{class:'ttl-row__ic'},[ glyph(locked?'column':'crown-laurel','sc-gl') ]),
          el('span',{class:'ttl-row__b'},[ el('span',{class:'ttl-row__nm'}, L(t)), el('span',{class:'ttl-row__en'}, t.en) ]),
          locked? el('span',{class:'ttl-row__lock'}, '🔒 Lv.'+t.lv) : (eq? el('span',{class:'ttl-row__on'}, '✓') : el('span',{class:'ttl-row__use'}, L({gr:'Επίλεξε',en:'Equip'}))),
        ]));
      });
      box.appendChild(list);
      ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
      if(window.injectIllus) injectIllus(ov);
      requestAnimationFrame(()=>ov.classList.add('in'));
      if(window.gsap) gsap.from(box,{y:24,scale:.97,autoAlpha:0,duration:.4,ease:'back.out(1.5)'});
    }

    function avatarPicker(){
      const ov=el('div',{class:'acro-ov', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
      const box=el('div',{class:'acro-box'});
      box.appendChild(el('div',{class:'acro-box__bar'},[
        el('div',{class:'acro-box__ttl'},[ glyph('owl','acro-box__ic'), L({gr:'Η Αγορά των Ηρώων',en:'The Hero’s Agora'}) ]),
        el('span',{class:'av-lv'}, 'Lv. '+HEROLV),
        el('button',{class:'acro-box__x', onclick:()=>ov.remove(), html:'&times;'}),
      ]));
      SY.AVATAR_CATS.forEach(cat=>{
        box.appendChild(el('div',{class:'sc-sec-lbl', style:'margin:10px 16px 6px'}, L(cat.t)));
        const grid=el('div',{class:'av-grid'});
        SY.AVATARS.filter(a=>a.cat===cat.k).forEach(a=>{
          const locked = HEROLV < a.lv, eq = SymStore.get('avatar','av-athena')===a.id;
          grid.appendChild(el('button',{class:'av-seal'+(locked?' locked':'')+(eq?' eq':''), title:L(a)+(locked?' · Lv.'+a.lv:''), onclick:()=>{ if(locked) return; SymStore.set('avatar',a.id); ov.remove(); symRender(); }},[
            el('span',{class:'av-seal__art','data-illu':a.illu}),
            locked? el('span',{class:'av-seal__lock'}, '🔒 '+a.lv) : el('span',{class:'av-seal__nm'}, L(a)),
          ]));
        });
        box.appendChild(grid);
      });
      ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
      if(window.injectIllus) injectIllus(ov);
      requestAnimationFrame(()=>ov.classList.add('in'));
      if(window.gsap) gsap.from(box,{y:24,scale:.97,autoAlpha:0,duration:.4,ease:'back.out(1.5)'});
    }
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Παράσημα',en:'Badges'})));
    const badges = [['trophy','Πρωταθλητής'],['medal','Άριστα'],['wreath','Νικητής'],['owl','Σοφός'],['flame','Σερί 20'],['star-streak','Πρώτος'],['shield-round','Αμυντικός'],['lightning-bolt','Ταχύς']];
    body.appendChild(el('div',{class:'sc-badges sc-stagger'}, badges.map((b,i)=>el('div',{class:'sc-badge'+(i>5?' locked':''),style:`--ca:${accent}`},[ glyph(b[0],'sc-badge__gl'), el('span',{class:'sc-badge__t'}, b[1]) ]))));
  };

  /* ══ 7 · LEVEL UP ══ */
  S.levelup = function(home, ctx){
    const accent = '#E0B24C';
    const lv = 13;
    const entry = (window.SYM.rewardsForLevel ? window.SYM.rewardsForLevel(lv) : null) || { title:{gr:'Hero',en:'Hero of the Iliad'}, rewards:[] };
    const sec = el('section',{class:'sc-lu has-accent', style:`--ca:${accent}`});
    sec.appendChild(el('button',{class:'sc-lu__close', onclick:()=>go('profile'), html:'&times;'}));
    sec.appendChild(el('div',{class:'sc-lu__burst'}));
    sec.appendChild(el('div',{class:'sc-lu__in'},[
      el('div',{class:'sc-lu__eyebrow'}, L({gr:'ΑΝΕΒΗΚΕΣ ΕΠΙΠΕΔΟ',en:'LEVEL UP'})),
      el('div',{class:'sc-lu__ring'},[ glyph('wreath','sc-lu__wreath'), el('span',{class:'sc-lu__num'}, String(lv)) ]),
      el('h1',{class:'sc-lu__ttl'}, L(entry.title)),
      el('p',{class:'sc-lu__sub'}, L({gr:'Ξεκλείδωσες νέες ανταμοιβές.',en:'You unlocked new rewards.'})),
      el('div',{class:'sc-lu__rewards'},
        (entry.rewards||[]).map(r=>el('div',{class:'sc-lu__reward'},[ el('span',{class:'sc-lu__ric'}, r.ic||'\u2726'), L(r.t) ]))),
      el('div',{class:'sc-lu__btns'},[
        el('button',{class:'sc-cta sc-cta--ghost', onclick:()=>go('temple')}, L({gr:'Στον Ναό',en:'To Temple'})),
        el('button',{class:'sc-cta sc-cta--solid', onclick:()=>go('profile')}, L({gr:'Συνέχεια',en:'Continue'})),
      ]),
    ]));
    home.appendChild(sec);
    if (window.gsap) {
      const r = sec.querySelector('.sc-lu__burst');
      for(let i=0;i<22;i++){ const s=document.createElement('span'); s.className='sc-spark'; r.appendChild(s);
        const a=Math.random()*Math.PI*2, d=80+Math.random()*180;
        gsap.set(s,{x:0,y:0}); gsap.to(s,{x:Math.cos(a)*d,y:Math.sin(a)*d,opacity:0,scale:0.3,duration:1+Math.random()*0.6,ease:'power2.out',delay:0.1,repeat:-1,repeatDelay:0.6}); }
      gsap.from(sec.querySelector('.sc-lu__ring'),{scale:0,rotate:-40,duration:0.9,ease:'back.out(1.6)'});
      gsap.from(sec.querySelectorAll('.sc-lu__reward'),{y:18,autoAlpha:0,stagger:0.12,delay:0.5,duration:0.5});
    }
  };

  window.SYM_SCREENS = S;
  window.SYM_SCREENS_HELPERS = { glyph, pill, stat, chip, favBtn, viewBar, editable, attachReorder, defaults, SITE, isAdmin };
})();
