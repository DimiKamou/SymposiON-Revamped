/* ════════════════════════════════════════════════════════════════════
   DIRECTION ★ — "SYNTHESIS" · navigable multi-screen prototype
   Persistent pill nav + a "Screens" launcher route to every panel.
   Home lives here; the rest live in js/screens.js (window.SYM_SCREENS).
   ════════════════════════════════════════════════════════════════════ */
(function () {

  function magnetize(node, strength) {
    if (!window.gsap) return;
    const s = strength || 0.35;
    node.addEventListener('mousemove', e => {
      const r = node.getBoundingClientRect();
      gsap.to(node, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s, duration: 0.4, ease: 'power3' });
    });
    node.addEventListener('mouseleave', () => gsap.to(node, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1,0.4)' }));
  }
  window.synMagnetize = magnetize;

  /* ── "Coming soon" treatment (shared) ──
     Tiles flagged `soon:true` in data.js have NO backing game yet. Instead of
     pretending they are playable, we badge them "ΣΥΝΤΟΜΑ / Coming soon" and, on
     click, show a friendly notice (reusing SymPreview's modal note) rather than
     a fake game preview. Alabaster style: terra/gold accent, uppercase, small. */
  function soonBadge() {
    return el('span', { class:'syn-soon-badge',
      style:'position:absolute;top:8px;left:8px;z-index:3;display:inline-flex;align-items:center;gap:4px;'
        + 'padding:3px 8px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.09em;'
        + 'text-transform:uppercase;line-height:1;color:var(--sym-terra-dk,#9C3F1F);'
        + 'background:color-mix(in srgb, var(--sym-gold,#A2862F) 16%, transparent);'
        + 'border:1px solid color-mix(in srgb, var(--sym-terra,#C5572F) 38%, transparent);' },
      [ el('span',{ html:'&#9685;' }), L({ gr:'Σύντομα', en:'Soon' }) ]);
  }
  window.synSoonBadge = soonBadge;

  function comingSoon(gm) {
    const title = L(gm) + ' · ' + L({ gr:'Σύντομα', en:'Coming soon' });
    const note  = L({ gr:'Αυτό το παιχνίδι ετοιμάζεται — θα είναι σύντομα διαθέσιμο. Ευχαριστούμε για την υπομονή!',
                      en:'This game is on the way — it will be available soon. Thanks for your patience!' });
    if (window.SymPreview && SymPreview.open) {
      SymPreview.open('mc', { title, illu:gm.illu, note });
    } else if (typeof window.showToast === 'function') {
      showToast(note, '');
    }
  }
  window.synComingSoon = comingSoon;

  function tile(gm, accent, onclick) {
    const soon = !!(gm && gm.soon);
    return el('a', { class:'syn-tile has-accent'+(soon?' syn-tile--soon':''), href:'javascript:void 0',
      style:`--ca:${accent};position:relative`,
      onclick: soon ? (e)=>{ if(e&&e.preventDefault) e.preventDefault(); comingSoon(gm); } : (onclick || null) }, [
      soon ? soonBadge() : null,
      el('span', { class:'syn-tile__ban' }, [ el('span', { class:'syn-tile__illu', 'data-illu':gm.illu }) ]),
      el('span', { class:'syn-tile__body' }, [
        el('span', { class:'syn-tile__nm' }, L(gm)),
        el('span', { class:'syn-tile__mt' }, gm.meta),
      ]),
      el('span', { class:'syn-tile__play', html: soon ? '&#9679;' : '&#9654;' }),
    ]);
  }
  window.synTile = tile;

  /* ── HERO VISUAL variants (replaces the old headline) ── */
  function heroVisual(variant) {
    if (variant === 'monogram') {
      const wrap = el('div', { class:'syn-mono' });
      wrap.appendChild(brandMark('syn-mono__mark'));
      wrap.appendChild(el('div', { class:'syn-mono__wm', html:'Symposi<span>ON</span>' }));
      wrap.appendChild(el('div', { class:'syn-mono__sub' }, window.SYM_LANG==='en'?'Play the ancient world':'Παίξε τον αρχαίο κόσμο'));
      return wrap;
    }
    if (variant === 'minimal') {
      return el('div', { class:'syn-hero__min' }, [ el('span', { class:'syn-hero__minrule' }) ]);
    }
    // showcase — slow rotating feed of game modes & news, with Try-now
    // admin-edited slides (SymStore) take priority over the data.js default
    const custom = window.SymStore ? SymStore.get('hero_slides', null) : null;
    const ITEMS = (custom && custom.length ? custom : (window.SYM.SHOWCASE || [])).slice();
    const show = el('div', { class:'syn-show' });
    const art = el('div', { class:'syn-show__art' },
      ITEMS.map((it,i)=> el('span', { class:'syn-show__slide'+(i===0?' on':''), 'data-illu':it.illu })));
    const body = el('div', { class:'syn-show__body' }, [
      el('span', { class:'syn-show__kind' }, '' ),
      el('span', { class:'syn-show__nm' }, '' ),
      el('span', { class:'syn-show__desc' }, '' ),
    ]);
    const cta = el('button', { class:'syn-show__try', onclick:()=>symGo('gamepanel') }, [ L({gr:'Δοκίμασέ το',en:'Try now'}), el('span',{class:'syn-show__arr',html:'&rarr;'}) ]);
    const dots = el('div', { class:'syn-show__dots' },
      ITEMS.map((_,i)=> el('button', { class:'syn-show__dot'+(i===0?' on':''), onclick:()=>{ setShow(i, true); } })));
    show.appendChild(art); show.appendChild(body); show.appendChild(cta); show.appendChild(dots);
    // admin-only: jump straight to the Hero Carousel editor (Admin → Hero)
    if (window.STATE && window.STATE.role === 'admin') {
      show.appendChild(el('button', { class:'syn-show__edit', title:L({gr:'Επεξεργασία στο Admin',en:'Edit in Admin'}),
        onclick:(e)=>{ e.stopPropagation(); window.__adminSec='hero'; symGo('admin'); } },
        [ el('span',{class:'syn-show__editq'},'✎'), L({gr:'Επεξεργασία',en:'Edit'}) ]));
    }
    let idx = 0;
    function setShow(n, manual){
      idx = (n+ITEMS.length)%ITEMS.length; const it = ITEMS[idx];
      art.querySelectorAll('.syn-show__slide').forEach((s,i)=>s.classList.toggle('on', i===idx));
      dots.querySelectorAll('.syn-show__dot').forEach((d,i)=>d.classList.toggle('on', i===idx));
      const kind = body.querySelector('.syn-show__kind'); kind.textContent = it.kind==='news'?L({gr:'Νέα',en:'News'}):L({gr:'Λειτουργία',en:'Game mode'});
      kind.className = 'syn-show__kind syn-show__kind--'+it.kind;
      body.querySelector('.syn-show__nm').textContent = L(it.t);
      body.querySelector('.syn-show__desc').textContent = L(it.d);
      if(window.gsap) gsap.fromTo(body,{y:8,autoAlpha:.4},{y:0,autoAlpha:1,duration:.5,ease:'power2.out'});
      if(manual){ clearInterval(window.__symShow); window.__symShow = setInterval(()=>{ if(document.body.contains(show)) setShow(idx+1); else clearInterval(window.__symShow); }, 6000); }
    }
    setShow(0);
    clearInterval(window.__symShow);
    window.__symShow = setInterval(()=>{ if(document.body.contains(show)) setShow(idx+1); else clearInterval(window.__symShow); }, 6000);
    return show;
  }
  window.synHeroVisual = heroVisual;

  /* ── interactive SPEC card (acroteria + rotating trivia/live counts) ── */
  function specCard(ctx) {
    const equippedId = SymStore.get('acro_equipped', 'parthenon');
    const eq = (window.SYM.ACROTERIA.find(a=>a.id===equippedId) || window.SYM.ACROTERIA[0]);
    const spec = el('div', { class:'syn-spec' }, [
      el('span', { class:'syn-spec__t syn-spec__t--tl' }), el('span', { class:'syn-spec__t syn-spec__t--tr' }),
      el('span', { class:'syn-spec__t syn-spec__t--bl' }), el('span', { class:'syn-spec__t syn-spec__t--br' }),
      el('span', { class:'syn-spec__glow' }),
      el('button', { class:'syn-spec__art', title:L({gr:'Άνοιξε τα ακρωτήρια',en:'Open acroteria'}), onclick:()=>openAcroteria(ctx) }, [
        el('span', { class:'syn-spec__illu', 'data-illu':eq.illu }),
        el('span', { class:'syn-spec__taphint' }, L({gr:'πάτα · ακρωτήρια',en:'tap · acroteria'})),
      ]),
      el('div', { class:'syn-spec__rows' }, [ el('div', { class:'syn-spec__ticker', id:'specTicker' }) ]),
    ]);
    return spec;
  }
  function tickerItems() {
    // trivia only — sciences · drama · arts · history (shuffled)
    const t = (window.SYM.TRIVIA || []).slice();
    for(let i=t.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [t[i],t[j]]=[t[j],t[i]]; }
    return t.map(fact=>({type:'fact', fact}));
  }
  function startSpecTicker() {
    clearInterval(window.__symTicker);
    const items = tickerItems(); let i = 0;
    function paint() {
      const host = document.getElementById('specTicker'); if(!host){ clearInterval(window.__symTicker); return; }
      const it = items[i % items.length];
      const node = el('div',{class:'syn-tick syn-tick--fact'},[
        el('span',{class:'syn-tick__lbl'}, L(it.fact.tag || {gr:'Ήξερες;',en:'Did you know'})),
        el('span',{class:'syn-tick__tx'}, L(it.fact)) ]);
      host.innerHTML=''; host.appendChild(node);
      if(window.gsap) gsap.from(node,{y:8,autoAlpha:0,duration:.4,ease:'power2.out'});
      i++;
    }
    paint();
    window.__symTicker = setInterval(paint, 5200);
  }

  function openAcroteria(ctx) {
    const ov = el('div', { class:'acro-ov', onclick:(e)=>{ if(e.target===ov) ov.remove(); } });
    const box = el('div', { class:'acro-box' });
    const kleos = SymStore.get('kleos', 0);
    box.appendChild(el('div', { class:'acro-box__bar' }, [
      el('div', { class:'acro-box__ttl' }, [ el('span',{class:'acro-box__ic','data-illu':'crown-laurel'}), L({gr:'Ακρωτήρια',en:'Acroteria'}) ]),
      el('div', { class:'acro-box__kleos' }, [ el('span',{class:'acro-box__kic','data-illu':'wreath-laurel'}), el('b',{id:'acroKleos'}, kleos.toLocaleString('en-US')), 'Kleos' ]),
      el('button', { class:'acro-box__x', onclick:()=>ov.remove(), html:'&times;' }),
    ]));
    const detail = el('div', { class:'acro-detail' });
    function showDetail(a){
      const owned = SymStore.get('acro_owned', window.SYM.ACROTERIA.filter(x=>x.owned).map(x=>x.id));
      const equipped = SymStore.get('acro_equipped', 'parthenon');
      const isOwned = owned.indexOf(a.id)>=0, isEq = equipped===a.id;
      detail.innerHTML='';
      detail.appendChild(el('span',{class:'acro-detail__art'+(isOwned?'':' locked')},[ el('span',{class:'acro-detail__illu','data-illu':a.illu}) ]));
      detail.appendChild(el('div',{class:'acro-detail__b'},[
        el('div',{class:'acro-detail__nm'}, L(a)),
        el('p',{class:'acro-detail__lore'}, a.lore?L(a.lore):''),
        el('div',{class:'acro-detail__act'},
          isOwned
            ? [ el('button',{class:'acro-detail__btn'+(isEq?' on':''), onclick:()=>{ SymStore.set('acro_equipped', a.id); paintGrid(); showDetail(a); symRender(); }}, isEq?L({gr:'✓ Εξοπλισμένο',en:'✓ Equipped'}):L({gr:'Εξοπλισμός',en:'Equip'})) ]
            : [ el('span',{class:'acro-detail__price'},[ '🔒 '+a.cost.toLocaleString('en-US')+' Kleos' ]),
                el('button',{class:'acro-detail__btn acro-detail__btn--buy', onclick:()=>buy(a)}, L({gr:'Ξεκλείδωμα',en:'Unlock'})) ]
        ),
      ]));
      if(window.injectIllus) injectIllus(detail);
    }
    function buy(a){
      const owned = SymStore.get('acro_owned', window.SYM.ACROTERIA.filter(x=>x.owned).map(x=>x.id));
      const k = SymStore.get('kleos', 0);
      if(k>=a.cost){ SymStore.set('kleos', k-a.cost); const o=owned.slice(); o.push(a.id); SymStore.set('acro_owned', o); SymStore.set('acro_equipped', a.id);
        const kEl=document.getElementById('acroKleos'); if(kEl) kEl.textContent=(k-a.cost).toLocaleString('en-US');
        if(window.gsap){ for(let i=0;i<14;i++){const sp=document.createElement('span');const r=detail.getBoundingClientRect();sp.style.cssText=`position:fixed;left:${r.left+50}px;top:${r.top+40}px;width:6px;height:6px;border-radius:50%;background:var(--gold,#E0B24C);z-index:9999;pointer-events:none`;document.body.appendChild(sp);const ang=Math.random()*6.28,d=24+Math.random()*46;gsap.to(sp,{x:Math.cos(ang)*d,y:Math.sin(ang)*d,opacity:0,duration:.7,onComplete:()=>sp.remove()});} }
        paintGrid(); showDetail(a); symRender(); }
      else { detail.classList.add('shake'); setTimeout(()=>detail.classList.remove('shake'),400); }
    }
    const grid = el('div', { class:'acro-grid' });
    let selectedId = SymStore.get('acro_equipped', 'parthenon');
    function paintGrid(){
      grid.innerHTML='';
      const owned = SymStore.get('acro_owned', window.SYM.ACROTERIA.filter(a=>a.owned).map(a=>a.id));
      const equipped = SymStore.get('acro_equipped', 'parthenon');
      window.SYM.ACROTERIA.forEach(a=>{
        const isOwned = owned.indexOf(a.id)>=0, isEq = equipped===a.id;
        const card = el('div', { class:'acro-card'+(isOwned?'':' locked')+(isEq?' eq':'')+(a.id===selectedId?' sel':'')+(a.premium?' acro-card--premium':''), onclick:()=>{ selectedId=a.id; paintGrid(); showDetail(a); } }, [
          el('span', { class:'acro-card__art' }, [ el('span',{class:'acro-card__illu','data-illu':a.illu}), a.premium?el('span',{class:'acro-card__prem'},'★'):null ]),
          el('span', { class:'acro-card__nm' }, L(a)),
          el('span', { class:'acro-card__tag' }, isOwned ? (isEq?L({gr:'✓',en:'✓'}):L({gr:'στη συλλογή',en:'owned'})) : ('🔒 '+a.cost.toLocaleString('en-US'))),
        ]);
        if(!isOwned){
          // unlock straight from the grid if you can afford it
          card.appendChild(el('button',{ class:'acro-card__btn acro-card__btn--buy', onclick:(e)=>{ e.stopPropagation(); selectedId=a.id; const k=SymStore.get('kleos',0); if(k>=a.cost){ buy(a); } else { showDetail(a); card.classList.add('shake'); setTimeout(()=>card.classList.remove('shake'),400); } } }, L({gr:'Ξεκλείδωμα',en:'Unlock'})));
        }
        grid.appendChild(card);
      });
      if(window.injectIllus) injectIllus(grid);
    }
    paintGrid();
    showDetail(window.SYM.ACROTERIA.find(a=>a.id===selectedId) || window.SYM.ACROTERIA[0]);
    box.appendChild(detail);
    box.appendChild(grid);
    box.appendChild(el('div', { class:'acro-box__foot' }, [
      el('span', {}, L({gr:'Κέρδισε Kleos παίζοντας.',en:'Earn Kleos by playing.'})),
      el('button', { class:'acro-box__temple', onclick:()=>{ ov.remove(); symGo('temple'); } }, [ L({gr:'Ἐμπόριον',en:'Emporion'}), el('span',{html:' &rarr;'}) ]),
    ]));
    ov.appendChild(box);
    document.querySelector('.stage').appendChild(ov);
    if(window.injectIllus) injectIllus(ov);
    requestAnimationFrame(()=>ov.classList.add('in'));
    if(window.gsap) gsap.from(box,{y:24,scale:.97,autoAlpha:0,duration:.4,ease:'back.out(1.5)'});
  }
  window.synOpenAcroteria = openAcroteria;


  /* ── SCREEN destinations for the launcher ── */
  const SCREENS = [
    { id:'home',      gr:'Αρχική',           en:'Home',         ico:'⌂' },
    { id:'assignments',gr:'Εργασίες',        en:'Homework',     ico:'✓' },
    { id:'subject',   gr:'Σελίδα Μαθήματος',  en:'Subject',      ico:'❐' },
    { id:'mode',      gr:'Επιλογή Λειτουργίας',en:'Mode select',  ico:'◎' },
    { id:'level',     gr:'Επιλογή Επιπέδου',   en:'Levels',       ico:'≣' },
    { id:'gamepanel', gr:'Πίνακας Παιχνιδιών', en:'Game Panel',   ico:'▦' },
    { id:'live',      gr:'Live Arena',         en:'Live Arena',   ico:'⚡' },
    { id:'profile',   gr:'Προφίλ Ήρωα',        en:'Hero Profile', ico:'◆' },
    { id:'levelup',   gr:'Level Up',           en:'Level Up',     ico:'✦' },
    { id:'temple',    gr:'Ἀγορά',               en:'Agora',        ico:'⛩' },
    { id:'anodos',    gr:'Άνοδος',             en:'Anodos',       ico:'⛰' },
    { id:'tartarus',  gr:'Tartarus Review',    en:'Tartarus',     ico:'❂' },
    { id:'anathesi',  gr:'Ανάθεση · Καθηγητής', en:'Teacher',      ico:'❖' },
    { id:'parent',    gr:'Γονέας',             en:'Parent',       ico:'◈' },
    { id:'admin',     gr:'Διαχείριση',         en:'Admin',        ico:'✚' },
    { id:'login',     gr:'Είσοδος',            en:'Sign in',      ico:'⎆' },
    { id:'subscribe', gr:'Συνδρομές',          en:'Plans',        ico:'€' },
    { id:'account',   gr:'Ο Λογαριασμός μου',  en:'My Account',   ico:'◷' },
    { id:'settings',  gr:'Ρυθμίσεις',           en:'Settings',     ico:'⚙' },
  ];

  function synNav(home, ctx) {
    const screen = ctx.screen || 'home';
    const nav = el('nav', { class:'syn-nav' });
    const inner = el('div', { class:'syn-nav__in' });
    const brand = el('a', { class:'syn-brand', href:'javascript:void 0', onclick:()=>symGo('home') });
    brand.appendChild(brandMark('syn-brand__mark'));
    brand.appendChild(el('span', { class:'syn-brand__wm', html:'Symposi<span>ON</span>' }));
    inner.appendChild(brand);

    // Screens launcher
    const launcher = el('div', { class:'syn-screens' });
    const lbtn = el('button', { class:'syn-screens__btn', onclick:(e)=>{ e.stopPropagation(); menu.classList.toggle('open'); } },
      [ el('span',{class:'syn-screens__grid',html:'▦'}), L({gr:'Οθόνες',en:'Screens'}), el('span',{class:'syn-screens__cv',html:'▾'}) ]);
    const menu = el('div', { class:'syn-screens__menu syn-screens__menu--mega' });
    // comprehensive launcher — every part of the site we've built, grouped
    const NAV_GROUPS = [
      { lbl:{gr:'Μάθηση',en:'Learn'}, items:[
        { id:'home', gr:'Αρχική', en:'Home', ico:'⌂' },
        { id:'assignments', gr:'Εργασίες', en:'Homework', ico:'✓' },
        { id:'gym', gr:'Γυμνάσιο', en:'Gymnasio', ico:'Ⅰ' },
        { id:'lyk', gr:'Λύκειο', en:'Lykeio', ico:'Ⅳ' },
        { id:'gramhub', gr:'Θεωρία & Γραμματική', en:'Theory & Grammar', ico:'✎' },
        { id:'gamepanel', gr:'Πίνακας Παιχνιδιών', en:'Game Panel', ico:'▦' },
      ]},
      { lbl:{gr:'Παιχνίδι',en:'Play'}, items:[
        { id:'live', gr:'Live Arena', en:'Live Arena', ico:'⚡' },
        { id:'anodos', gr:'Άνοδος', en:'Anodos', ico:'⛰' },
        { id:'tartarus', gr:'Tartarus Review', en:'Tartarus', ico:'❂' },
        // "Level Up" is a TRIGGER event (fires from progression on level gain),
        // not a manually navigable screen — so it is intentionally not listed.
      ]},
      { lbl:{gr:'Ἀγορά & Ἥρωας',en:'Agora & Hero'}, items:[
        { id:'temple', gr:'Ἀγορά', en:'Agora', ico:'⛩' },
        { id:'profile', gr:'Προφίλ Ήρωα', en:'Hero Profile', ico:'◆' },
        { id:'account', gr:'Ο Λογαριασμός μου', en:'My Account', ico:'◷' },
        { id:'settings', gr:'Ρυθμίσεις', en:'Settings', ico:'⚙' },
        { id:'subscribe', gr:'Συνδρομές', en:'Plans', ico:'€' },
      ]},
      { lbl:{gr:'Διαχείριση',en:'Manage'}, items:[
        { id:'admin', gr:'Διαχείριση', en:'Admin', ico:'✚' },
        { id:'anathesi', gr:'Ανάθεση · Καθηγητής', en:'Teacher', ico:'❖' },
        { id:'parent', gr:'Γονέας', en:'Parent', ico:'◈' },
        { id:'login', gr:'Είσοδος', en:'Sign in', ico:'⎆' },
      ]},
    ];
    const navItem = s => el('button', {
      class:'syn-screens__item'+((s.id&&s.id===screen)?' active':''),
      onclick:()=>{ menu.classList.remove('open'); if(s.cls){ window.STATE.classId=s.cls; symGo('home'); } else { symGo(s.id); } }
    }, [ el('span',{class:'syn-screens__ico'}, s.ico), L(s) ]);
    NAV_GROUPS.forEach(g => {
      const col = el('div', { class:'syn-screens__col' });
      col.appendChild(el('div', { class:'syn-screens__lbl' }, L(g.lbl)));
      g.items.forEach(s => col.appendChild(navItem(s)));
      menu.appendChild(col);
    });
    // tag pages — the "extra pages" we added (each its own destination)
    (function(){
      const tags = (window.SymTags ? SymTags.tagsAll() : (window.SYM.TAGS||[]));
      if(!tags.length) return;
      const col = el('div', { class:'syn-screens__col syn-screens__col--tags' });
      col.appendChild(el('div', { class:'syn-screens__lbl' }, L({gr:'Ετικέτες',en:'Tag pages'})));
      const wrap = el('div', { class:'syn-screens__tags' });
      tags.forEach(t => wrap.appendChild(el('button', {
        class:'syn-screens__tag', onclick:()=>{ menu.classList.remove('open'); symGo('tag', {tag:t.id}); }
      }, L(t))));
      col.appendChild(wrap);
      menu.appendChild(col);
    })();
    launcher.appendChild(lbtn); launcher.appendChild(menu);

    const links = el('div', { class:'syn-nav__links' }, [
      el('a', { class:'syn-nav__lnk'+(/home|subject|mode|level|gamepanel/.test(screen)?' active':''), href:'javascript:void 0', onclick:()=>symGo('home') }, L({gr:'Παιχνίδια',en:'Games'})),
      el('a', { class:'syn-nav__lnk'+(screen==='gamepanel'?' active':''), href:'javascript:void 0', onclick:()=>symGo('gamepanel') }, L({gr:'Πίνακας',en:'Panel'})),
      el('a', { class:'syn-nav__lnk syn-nav__lnk--agora'+(screen==='temple'?' active':''), href:'javascript:void 0', onclick:()=>symGo('temple') }, [ el('span',{class:'syn-nav__ico','data-illu':'amphora'}), L({gr:'Ἀγορά',en:'Agora'}) ]),
    ]);
    const act = el('div', { class:'syn-nav__act' }, [
      el('button', { class:'syn-live', onclick:()=>symGo('live') }, [ el('span',{class:'syn-live__bolt',html:'&#9889;'}), L(ctx.STR.live) ]),
      (window.SymSys ? SymSys.searchButton() : null),
      (window.SymSys ? SymSys.bellButton() : null),
      // instructor / guide avatar — distinct, hover for detailed instructions, click to toggle on/off
      (function(){
        var G = window.SymGuide; var gon = !!(G && G.isOn && G.isOn());
        var info = (G && G.tipFor) ? G.tipFor(screen) : null;
        var wrap = el('div', { class:'syn-mentor-wrap' });
        var btn = el('button', { class:'syn-mentor'+(gon?' on':''), 'aria-pressed':gon?'true':'false',
          title:L({gr:'Ο Οδηγός σου — πάτα για on/off',en:'Your guide — tap to toggle'}),
          onclick:function(){ if(G&&G.toggle) G.toggle(); symRender(); } },
          [ el('span',{class:'syn-mentor__av','data-illu':'philosopher'}), el('span',{class:'syn-mentor__dot'}) ]);
        wrap.appendChild(btn);
        var pop = el('div', { class:'syn-mentor__pop' });
        pop.appendChild(el('div',{class:'syn-mentor__phd'},[
          el('span',{class:'syn-mentor__pav','data-illu':'philosopher'}),
          el('div',{class:'syn-mentor__pmeta'},[
            el('div',{class:'syn-mentor__pname'}, L({gr:'Ο Οδηγός σου',en:'Your guide'})),
            el('div',{class:'syn-mentor__pstate'+(gon?' on':'')}, gon?L({gr:'● Ενεργός',en:'● On'}):L({gr:'○ Ανενεργός',en:'○ Off'})) ]) ]));
        if(info){
          pop.appendChild(el('div',{class:'syn-mentor__pt'}, L(info.t)));
          pop.appendChild(el('div',{class:'syn-mentor__pd'}, L(info.d)));
          if(info.more) pop.appendChild(el('ul',{class:'syn-mentor__pmore'}, info.more.map(function(m){ return el('li',{}, L(m)); })));
        }
        // short "what is this" orientation over the main parts of the site
        if(G && G.parts){
          pop.appendChild(el('div',{class:'syn-mentor__plbl'}, L({gr:'Τα κύρια μέρη — τι είναι;',en:'The main parts — what is this?'})));
          var pl = el('div',{class:'syn-mentor__parts'});
          G.parts().forEach(function(p){
            pl.appendChild(el('button',{class:'syn-mentor__part'+(p.id===screen?' here':''), onclick:function(){ symGo(p.id); }},[
              el('span',{class:'syn-mentor__partn'}, L(p.nm)),
              el('span',{class:'syn-mentor__partd'}, L(p.d)) ]));
          });
          pop.appendChild(pl);
        }
        pop.appendChild(el('button',{class:'syn-mentor__ptoggle'+(gon?' on':''),
          onclick:function(){ if(G&&G.toggle) G.toggle(); symRender(); } },
          gon?L({gr:'Σβήσε τον οδηγό',en:'Turn guide off'}):L({gr:'Άναψε τον οδηγό',en:'Turn guide on'})));
        wrap.appendChild(pop);
        return wrap;
      })(),
      (function(){ var av=(window.SymStore&&window.SYM.AVATARS)?window.SYM.AVATARS.find(function(a){return a.id===SymStore.get('avatar','av-athena');}):null; var b=el('button', { class:'syn-prof', title:'Προφίλ', onclick:()=>symGo('profile') }); var s=el('span',{class:'syn-prof__av'}); if(av){ s.setAttribute('data-illu', av.illu); } else { s.textContent='ΣΟ'; } b.appendChild(s); return b; })(),
      // ── Auth controls (Firebase via js/auth.js) ──
      // When a user is signed in we show a compact chip with their name +
      // sign-out; otherwise the sign-in / sign-up buttons open the auth modal.
      // openAuthModal/signOutUser/currentUser come from js/auth.js (global).
      ...(function(){
        var u = (typeof currentUser !== 'undefined') ? currentUser : null;
        var hasAuth = (typeof window.openAuthModal === 'function');
        if (u) {
          var nm = u.displayName || (u.email ? u.email.split('@')[0] : L({gr:'Χρήστης',en:'User'}));
          var chip = el('div', { class:'syn-authchip' }, [
            el('span', { class:'syn-authchip__av' }, (nm[0]||'?').toUpperCase()),
            el('span', { class:'syn-authchip__nm' }, nm),
            el('button', { class:'syn-authchip__out', title:L({gr:'Έξοδος',en:'Sign out'}),
              onclick:()=>{ if(typeof window.signOutUser==='function') window.signOutUser(); }, html:'&#8617;' })
          ]);
          return [ chip ];
        }
        return [
          el('button', { class:'syn-btn syn-btn--ghost',
            onclick:()=>{ if(hasAuth) window.openAuthModal('login'); else symGo('login'); } }, L(ctx.STR.signin)),
          el('button', { class:'syn-btn syn-btn--solid',
            onclick:()=>{ var go=()=>{ if(hasAuth) window.openAuthModal('signup'); else symGo('login'); };
                          // Sign-up flow order: human-verify → age → mode → open signup.
                          if(window.SymSignupFlow) window.SymSignupFlow(go);
                          else if(window.SymConsent&&SymConsent.requireConsent) SymConsent.requireConsent(go);
                          else go(); } }, L(ctx.STR.signup)),
        ];
      })(),
    ]);
    // mobile: collapse launcher + links + act into a drawer toggled by a burger.
    // (display:contents on desktop keeps the original bar layout untouched.)
    const cluster = el('div', { class:'syn-nav__cluster' }, [ launcher, links, act ]);
    const burger = el('button', { class:'syn-burger', 'aria-label':L({gr:'Μενού',en:'Menu'}), 'aria-expanded':'false',
      onclick:(e)=>{ e.stopPropagation(); const open = nav.classList.toggle('is-open'); burger.setAttribute('aria-expanded', open?'true':'false'); if(!open) menu.classList.remove('open'); } },
      [ el('span',{class:'syn-burger__b'}), el('span',{class:'syn-burger__b'}), el('span',{class:'syn-burger__b'}) ]);
    inner.appendChild(burger);
    inner.appendChild(cluster);
    nav.appendChild(inner);
    home.appendChild(nav);
  }
  window.synNav = synNav;

  /* ── shared page-header scaffold for inner screens ── */
  function synPage(home, o) {
    const sec = el('section', { class:'sc-page'+(o.accent?' has-accent':''), style:o.accent?`--ca:${o.accent}`:null });
    const head = el('div', { class:'sc-head' }, [
      el('button', { class:'sc-back', onclick:()=>symGo(o.back||'home') }, [ el('span',{html:'&larr;'}), o.backLabel||L({gr:'Πίσω',en:'Back'}) ]),
      el('div', { class:'sc-head__row' }, [
        el('div', { class:'sc-head__main' }, [
          o.eyebrow ? el('div', { class:'sc-eyebrow' }, [ o.roman?el('span',{class:'sc-eyebrow__rom'},o.roman):null, o.eyebrow ]) : null,
          el('h1', { class:'sc-title' }, o.title),
          o.sub ? el('p', { class:'sc-sub' }, o.sub) : null,
        ]),
        o.actions ? el('div', { class:'sc-head__act' }, o.actions) : null,
      ]),
    ]);
    sec.appendChild(head);
    const body = el('div', { class:'sc-body' });
    sec.appendChild(body);
    home.appendChild(sec);
    return body;
  }
  window.synPage = synPage;

  function synFooter(home, ctx){
    const STR = ctx.STR;
    const f = el('footer', { class:'syn-foot' });
    f.appendChild(el('span', { class:'syn-foot__rule' }));
    const top = el('div', { class:'syn-foot__top' });
    const fb = el('div', { class:'syn-foot__brand' });
    fb.appendChild(brandMark('syn-foot__mark'));
    fb.appendChild(el('div', {}, [ el('div',{class:'syn-foot__wm', html:'Symposi<span>ON</span>'}), el('p',{class:'syn-foot__tag'}, L(STR.tagline)) ]));
    top.appendChild(fb);
    const IP = window.SymInfoPanel;
    [ { h:{gr:'Πλατφόρμα',en:'Platform'}, links:[
        {gr:'Παιχνίδια',en:'Games', act:()=>symGo('home')},
        {gr:'Συνδρομές',en:'Plans', act:()=>symGo('subscribe')},
        {gr:'Tartarus Review',en:'Tartarus Review', act:()=>symGo('tartarus')} ] },
      { h:{gr:'Πληροφορίες',en:'Information'}, links:[
        {gr:'Σχετικά',en:'About', act:()=>IP&&IP.about()},
        {gr:'Επικοινωνία',en:'Contact', act:()=>IP&&IP.contact()},
        {gr:'Σχόλια',en:'Feedback', act:()=>IP&&IP.feedback()} ] },
      { h:{gr:'Νομικά',en:'Legal'}, links:[
        {gr:'Όροι Χρήσης',en:'Terms of Use', act:()=>window.SymConsent&&SymConsent.terms()},
        {gr:'Απόρρητο',en:'Privacy', act:()=>window.SymConsent&&SymConsent.privacy()},
        {gr:'Cookies',en:'Cookies', act:()=>window.SymConsent&&SymConsent.privacy()} ] },
    ].forEach(c => {
      const col = el('div', { class:'syn-foot__col' });
      col.appendChild(el('h4', {}, L(c.h)));
      c.links.forEach(lk => col.appendChild(el('a', { href:'javascript:void 0', onclick:lk.act||null }, L(lk))));
      top.appendChild(col);
    });
    f.appendChild(top);
    f.appendChild(el('div', { class:'syn-foot__bot' }, [
      el('span', {}, '© 2026 SymposiON'),
      el('div', { class:'syn-foot__social' }, [
        socialBtn('instagram', 'Instagram'),
        socialBtn('youtube', 'YouTube'),
        socialBtn('tiktok', 'TikTok'),
      ]),
      el('button', { class:'syn-foot__pro', onclick:()=>symGo('subscribe') }, window.SYM_LANG==='en'?'↑ Upgrade to Pro · €4.99':'↑ Αναβάθμιση σε Pro · €4.99'),
    ]));
    home.appendChild(f);
  }
  function socialBtn(kind, label) {
    const ICON = {
      instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" stroke="none"/>',
      youtube: '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="M10 9l5 3-5 3z" fill="currentColor" stroke="none"/>',
      tiktok: '<path d="M14 4v9.5a3.5 3.5 0 1 1-3-3.46"/><path d="M14 4c.5 2.4 2 3.8 4 4"/>',
    };
    const s = document.createElementNS('http://www.w3.org/2000/svg','svg');
    s.setAttribute('viewBox','0 0 24 24'); s.setAttribute('fill','none'); s.setAttribute('stroke','currentColor');
    s.setAttribute('stroke-width','1.7'); s.setAttribute('stroke-linecap','round'); s.setAttribute('stroke-linejoin','round');
    s.innerHTML = ICON[kind] || '';
    return el('a', { class:'syn-soc', href:'javascript:void 0', title:label, 'aria-label':label }, [ s ]);
  }
  window.synFooter = synFooter;

  /* ════════════════════════ DISPATCH ════════════════════════ */
  window.SYM_DIR.synthesis = function (home, ctx) {
    const screen = ctx.screen || 'home';
    synNav(home, ctx);
    if (screen !== 'home') {
      const fn = window.SYM_SCREENS && (window.SYM_SCREENS[screen] || window.SYM_SCREENS.notfound);
      if (fn) {
        fn(home, ctx);
        synFooter(home, ctx);
        home.querySelectorAll('.syn-cta--solid, .sc-cta--solid').forEach(b => magnetize(b, 0.28));
        if (window.gsap && ctx.fresh) {
          gsap.from(home.querySelectorAll('.sc-head, .sc-stagger'), { y: 22, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: 'power3.out' });
        }
        return;
      }
    }
    synHome(home, ctx);
  };

  function synHome(home, ctx) {
    const STR = ctx.STR;

    /* HERO */
    const hero = el('header', { class:'syn-hero' });
    // Hero visual is the SymposiON monogram lockup (showcase relocated to the class section).
    const heroVar = (window.STATE && window.STATE.hero) || 'monogram';
    const left = el('div', { class:'syn-hero__l' }, [
      el('div', { class:'syn-hero__ix' }, [ el('span',{class:'syn-hero__no'},'01'), el('span',{class:'syn-hero__sl'},'/'), el('span',{class:'syn-hero__ek'}, L(STR.eyebrow)) ]),
      heroVisual(heroVar),
      el('p', { class:'syn-hero__lede' }, L(STR.lede)),
      el('div', { class:'syn-hero__cta' }, [
        el('button', { class:'syn-cta syn-cta--solid', onclick:()=>symGo('subject', {subject: (ctx.subjects[ctx.activeClass.id]||[])[0], cls: ctx.activeClass}) }, [ L(STR.startFree), el('span',{class:'syn-cta__ar',html:'&rarr;'}) ]),
        el('button', { class:'syn-cta syn-cta--ghost', onclick:()=>symGo('gamepanel') }, [ el('span',{class:'syn-cta__play',html:'&#9654;'}), L(STR.browse) ]),
      ]),
    ]);
    const eqAv = (window.SYM.AVATARS||[]).find(a=>a.id===SymStore.get('avatar','av-athena')) || (window.SYM.AVATARS||[])[0];
    const eqIllu = (eqAv && eqAv.illu) || 'owl';
    const right = el('div', { class:'syn-hero__r' }, [ specCard(ctx),
      el('button', { class:'syn-spec__owl', 'data-illu':eqIllu, title:(eqAv?L(eqAv):'')+' · '+L({gr:'Άλλαξε σφραγίδα',en:'Change seal'}), onclick:()=>symGo('profile') }) ]);
    const mdr = () => el('span', { class:'syn-mdr' });
    hero.appendChild(el('span', { class:'syn-hero__deco syn-hero__deco--l', 'aria-hidden':'true' }, [ mdr() ]));
    hero.appendChild(el('span', { class:'syn-hero__deco syn-hero__deco--r', 'aria-hidden':'true' }, [ mdr() ]));
    const stripTags = (window.SymTags ? SymTags.tagsAll() : (window.SYM.TAGS||[]));
    const heroStrip = el('div', { class:'syn-hero__strip' }, stripTags.map(t=>
      el('button', { class:'syn-chiplet syn-chiplet--tag', title:L({gr:'Άνοιξε τη σελίδα',en:'Open page'})+' · '+L(t),
        onclick:()=>symGo('tag', {tag:t.id}) },
        [ L(t), el('span',{class:'syn-chiplet__n'}, String(window.SymTags?SymTags.tagCount(t.id):'')) ])));
    hero.appendChild(left); hero.appendChild(right); hero.appendChild(heroStrip);
    home.appendChild(hero);
    startSpecTicker();

    /* CLASS GROUPS — three side-by-side columns: Γυμνάσιο · Λύκειο · Γραμματική/Θεωρία */
    const chips = el('div', { class:'syn-classes' });
    // section header — kicker + orienting subtitle + live catalogue stats
    const SUBJ = window.SYM.SUBJECTS || {};
    const nTracks = (ctx.classes ? ctx.classes.length : 0) + ((window.SYM.GRAMMAR || []).length);
    const allSubjects = Object.keys(SUBJ).reduce((n,k)=> n + SUBJ[k].length, 0);
    const allGames = Object.keys(SUBJ).reduce((n,k)=> n + SUBJ[k].reduce((m,s)=> m + (s.games ? s.games.length : 0), 0), 0);
    const clsHead = el('div', { class:'syn-classes__head' });
    const clsLead = el('div', { class:'syn-classes__lead' });
    clsLead.appendChild(el('div', { class:'syn-classes__lbl' }, [ el('span',{class:'syn-classes__ln'}), L(STR.pickClass) ]));
    clsLead.appendChild(el('p', { class:'syn-classes__hint' }, L({
      gr:'Γυμνάσιο, Λύκειο, Γραμματική & Θεωρία — διάλεξε την τάξη σου και δες τα μαθήματα και τα παιχνίδια της.',
      en:'Gymnasio, Lykeio, Grammar & Theory — choose your class to see its subjects and games.' })));
    clsHead.appendChild(clsLead);
    chips.appendChild(clsHead);
    const groupsWrap = el('div', { class:'syn-cgroups' });
    (ctx.groups || []).forEach((group, gi) => {
      if (gi > 0) groupsWrap.appendChild(el('span', { class:'syn-cdiv', 'aria-hidden':'true' }));
      const grp = el('div', { class:'syn-cgroup'+(group.grammar?' syn-cgroup--gram':'') });
      // group header now opens the hierarchical grade / grammar hub subpage
      const groupScreen = group.grammar ? 'gramhub' : (group.id==='lyk' ? 'lyk' : 'gym');
      grp.appendChild(el('button', { class:'syn-cgroup__h syn-cgroup__h--link',
        title:L({gr:'Άνοιξε την ενότητα',en:'Open section'}), onclick:()=>symGo(groupScreen),
        style:'display:inline-flex;align-items:center;gap:6px;background:none;border:none;cursor:pointer;'
          + 'font:inherit;color:inherit;padding:0;text-align:left' }, [
        L(group.label), el('span', { class:'syn-cgroup__arr', html:'&rarr;', style:'opacity:.55;font-size:.85em' }) ]));
      const row = el('div', { class:'syn-classes__row' });
      group.ids.forEach(id => {
        const c = ctx.byId(id); if(!c) return;
        const active = c.id===ctx.classId;
        const badge = group.grammar
          ? el('span', { class:'syn-chip__rom syn-chip__rom--gl', 'data-illu':c.glyph })
          : el('span', { class:'syn-chip__rom' }, c.roman);
        // hover previews the panels in-place; a click opens the class subpage
        const chipEl = el('button', {
          class:'syn-chip has-accent'+(group.grammar?' syn-chip--gram':'')+(active?' active':''),
          'data-cls':c.id, style:`--ca:${c.accent}`,
          onclick:()=> group.grammar ? symGo('gramtrack', {trackId:c.id}) : symGo('classpage', {cls:c})
        }, [ badge, el('span',{class:'syn-chip__nm'}, L(c)) ]);
        chipEl.addEventListener('mouseenter', ()=>{ if(!group.grammar) setActiveClass(c.id, false); });
        row.appendChild(chipEl);
      });
      grp.appendChild(row);
      groupsWrap.appendChild(grp);
    });
    // Promo — now a rotating "navigation" carousel: Anodos / Agora / How-to-play.
    const PROMO = [
      { kick:{gr:'ΞΕΚΛΕΙΔΩΣΕ & ΜΑΘΕ',en:'UNLOCK & LEARN'}, illu:'acropolis', ttl:{gr:'Άνοδος',en:'Anodos'},
        desc:{gr:'Σκαρφάλωσε στον Όλυμπο, κέρδισε Kleos κι ανέβα σκαλί-σκαλί.',en:'Climb Olympus, earn Kleos and rise tier by tier.'},
        cta:{gr:'Ξεκίνα την Άνοδο',en:'Start the climb'}, go:()=>symGo('anodos') },
      { kick:{gr:'ΞΟΔΕΨΕ & ΣΤΟΛΙΣΕ',en:'SPEND & ADORN'}, illu:'wreath-laurel', ttl:{gr:'Ἀγορά',en:'Agora'},
        desc:{gr:'Ξόδεψε Kleos σε ακρωτήρια, θέματα κι εφέ για την αρχική σου.',en:'Spend Kleos on acroteria, themes and effects for your home.'},
        cta:{gr:'Πήγαινε στην Ἀγορά',en:'Enter the Agora'}, go:()=>symGo('temple') },
      { kick:{gr:'ΟΔΗΓΟΙ',en:'GUIDES'}, illu:'book', ttl:{gr:'Πῶς παίζεται',en:'How to play'},
        desc:{gr:'Σύντομοι οδηγοί για κάθε παιχνίδι — κανόνες, βαθμοί, κόλπα.',en:'Quick guides for every game — rules, scoring, tips.'},
        cta:{gr:'Δες τους οδηγούς',en:'See the guides'}, go:()=>{ if(window.SymInfoPanel) SymInfoPanel.guides(); } },
    ];
    const pKick = el('span', { class:'syn-promo__kick' });
    const pTtl  = el('h3', { class:'syn-promo__ttl' });
    const pDesc = el('p', { class:'syn-promo__desc' });
    const pCta  = el('button', { class:'syn-promo__cta' }, [ el('span',{class:'syn-promo__ctal'}), el('span',{class:'syn-promo__ca',html:'&rarr;'}) ]);
    const pDots = el('div', { class:'syn-promo__dots' },
      PROMO.map((_,i)=> el('button', { class:'syn-promo__dot'+(i===0?' on':''), 'aria-label':'slide '+(i+1), onclick:()=>setPromo(i, true) })));
    const pArt  = el('div', { class:'syn-promo__art' }, [ el('span', { class:'syn-promo__artillu' }) ]);
    const promoCard = el('div', { class:'syn-promo syn-promo--carousel syn-promo--split' }, [
      el('div', { class:'syn-promo__txt' }, [
        el('div', { class:'syn-promo__hd' }, [ pKick, pTtl, pDesc ]),
        pCta, pDots,
      ]),
      pArt,
    ]);
    let pIdx = 0;
    function setPromo(n, manual){
      pIdx = (n+PROMO.length)%PROMO.length; const it = PROMO[pIdx];
      pKick.textContent = L(it.kick);
      pArt.querySelector('.syn-promo__artillu').setAttribute('data-illu', it.illu);
      pTtl.textContent = L(it.ttl);
      pDesc.textContent = L(it.desc);
      pCta.querySelector('.syn-promo__ctal').textContent = L(it.cta);
      pCta.onclick = it.go;
      pDots.querySelectorAll('.syn-promo__dot').forEach((d,i)=>d.classList.toggle('on', i===pIdx));
      if(window.injectIllus) injectIllus(pArt);
      if(window.gsap) gsap.fromTo(promoCard.querySelector('.syn-promo__txt'),{y:8,autoAlpha:.4},{y:0,autoAlpha:1,duration:.5,ease:'power2.out'});
      if(manual){ clearInterval(window.__symPromo); window.__symPromo = setInterval(()=>{ if(document.body.contains(promoCard)) setPromo(pIdx+1); else clearInterval(window.__symPromo); }, 6500); }
    }
    setPromo(0);
    clearInterval(window.__symPromo);
    window.__symPromo = setInterval(()=>{ if(document.body.contains(promoCard)) setPromo(pIdx+1); else clearInterval(window.__symPromo); }, 6500);
    chips.appendChild(el('div', { class:'syn-classes__split' }, [
      el('div', { class:'syn-classes__col' }, [ groupsWrap ]),
      el('div', { class:'syn-classes__showw' }, [ heroVisual('showcase'), promoCard ]),
    ]));
    home.appendChild(chips);

    /* SUBJECT BLOCKS — rebuildable so the active class can auto-rotate */
    const wrap = el('div', { class:'syn-subjects' });
    function buildSubjects(ac){
      wrap.innerHTML='';
      (ctx.subjects[ac.id] || []).forEach((s,i)=> {
        const block = el('section', { class:'syn-subj has-accent', style:`--ca:${ac.accent}` });
        block.appendChild(el('div', { class:'syn-subj__hd' }, [
          el('span', { class:'syn-subj__no' }, String(i+1).padStart(2,'0')),
          el('span', { class:'syn-subj__badge' }, [ el('span', { class:'syn-subj__illu', 'data-illu':s.illu }) ]),
          el('div', { class:'syn-subj__tx' }, [ el('h3', { class:'syn-subj__ttl' }, L(s)), el('p', { class:'syn-subj__sum' }, L(s.summary)) ]),
          el('a', { class:'syn-subj__all', href:'javascript:void 0', onclick:()=>symGo('subject', {subject:s, cls:ac}) }, [ L(STR.allGames), el('span', { class:'syn-subj__cnt' }, s.games.length) ]),
        ]));
        block.appendChild(el('div', { class:'syn-subj__grid' }, s.games.map(gm => tile(gm, ac.accent, ()=>symGo('mode', {subject:s, game:gm, cls:ac})))));
        wrap.appendChild(block);
      });
      if (window.injectIllus) injectIllus(wrap);
    }
    // switch class WITHOUT a full re-render — only the panels below change
    function setActiveClass(id, userInitiated){
      const ac = ctx.byId(id) || ctx.activeClass;
      STATE.classId = id; ctx.classId = id; ctx.activeClass = ac;
      buildSubjects(ac);
      chips.querySelectorAll('.syn-chip[data-cls]').forEach(b => b.classList.toggle('active', b.getAttribute('data-cls')===id));
      if (window.gsap) gsap.fromTo(wrap.children, { y:14, autoAlpha:0 }, { y:0, autoAlpha:1, duration:.45, stagger:.06, ease:'power2.out', clearProps:'opacity,visibility,transform' });
      if (userInitiated) startClassRotation(); // user took the wheel → restart the timer
    }
    // auto-rotate through the grade tracks so the subject panels cycle on their own
    function startClassRotation(){
      clearInterval(window.__symClassRotate);
      window.__symClassRotate = setInterval(()=>{
        if (STATE.screen!=='home' || STATE.direction!=='synthesis' || !document.body.contains(chips)) { clearInterval(window.__symClassRotate); return; }
        if (chips.matches(':hover') || wrap.matches(':hover')) return; // pause while the user reads
        const list = ctx.classes;
        const i = list.findIndex(c=>c.id===STATE.classId);
        const next = list[(i+1) % list.length] || list[0];
        setActiveClass(next.id, false);
      }, 5500);
    }
    buildSubjects(ctx.activeClass);
    home.appendChild(wrap);
    startClassRotation();

    /* SUBJECT MARQUEE (rolling band — carousel.js) */
    const mq = el('section', { class:'syn-mq' });
    mq.appendChild(el('div', { class:'syn-mq__hd' }, [
      el('span',{class:'syn-engines__no'},'//'),
      el('h2', { class:'syn-engines__ttl' }, L({gr:'Όλα τα μαθήματα',en:'Every subject'})),
    ]));
    const items = (window.SYM.CAROUSEL||[]);
    function buildTrack(dir){
      const track = el('div', { class:'syn-mq__track syn-mq__track--'+dir });
      const doubled = items.concat(items);
      doubled.forEach(s=> track.appendChild(el('a', { class:'syn-mq__card has-accent', href:'javascript:void 0', style:`--ca:${s.accent}`,
        onclick:()=>symGo('subject',{cls: ctx.classes.find(c=>c.id===s.cls)||ctx.activeClass}) }, [
        el('span', { class:'syn-mq__ic', 'data-illu':s.illu }),
        el('span', { class:'syn-mq__tx' }, [
          el('span', { class:'syn-mq__nm' }, L(s)),
          el('span', { class:'syn-mq__meta' }, s.meta),
        ]),
      ])));
      return track;
    }
    mq.appendChild(el('div',{class:'syn-mq__row'}, [ buildTrack('a') ]));
    mq.appendChild(el('div',{class:'syn-mq__row'}, [ buildTrack('b') ]));
    home.appendChild(mq);

    /* ENGINES */
    const eng = el('section', { class:'syn-engines' });
    eng.appendChild(el('div', { class:'syn-engines__hd' }, [
      el('div', {}, [ el('span',{class:'syn-engines__no'},'//'), el('h2', { class:'syn-engines__ttl' }, L(STR.engines)) ]),
      el('p', { class:'syn-engines__sub' }, L(STR.enginesSub)),
    ]));
    const scroller = el('div', { class:'syn-engines__scroll' });
    ctx.engines.forEach((e,i) => scroller.appendChild(el('a', {
      class:'syn-eng has-accent', href:'javascript:void 0', style:`--ca:${ctx.classes[i % ctx.classes.length].accent}`, onclick:()=>symGo('gamepanel')
    }, [
      el('span', { class:'syn-eng__ban' }, [ el('span', { class:'syn-eng__illu', 'data-illu':e.illu }) ]),
      el('span', { class:'syn-eng__nm' }, L(e)), el('span', { class:'syn-eng__mt' }, L(e.meta)),
    ])));
    eng.appendChild(scroller);
    home.appendChild(eng);

    /* JOIN */
    home.appendChild(el('section', { class:'syn-join' }, [
      el('div', { class:'syn-join__card' }, [
        el('span', { class:'syn-join__rail' }),
        el('span', { class:'syn-join__bolt', html:'&#9889;' }),
        el('div', { class:'syn-join__tx' }, [
          el('div', { class:'syn-join__no' }, '06 / ' + L({gr:'ΕΙΣΟΔΟΣ',en:'JOIN'})),
          el('div', { class:'syn-join__ttl' }, L(STR.joinTitle)),
          el('p', { class:'syn-join__sub' }, L(STR.joinSub)),
        ]),
        el('div', { class:'syn-join__form' }, [
          el('input', { class:'syn-join__pin', type:'text', maxlength:'6', placeholder:'A7K92M' }),
          el('button', { class:'syn-cta syn-cta--solid', onclick:()=>symGo('live') }, [ L(STR.joinBtn), el('span',{html:'&rarr;'}) ]),
        ]),
      ]),
    ]));

    synFooter(home, ctx);

    /* GSAP reveal */
    home.querySelectorAll('.syn-cta--solid').forEach(b => magnetize(b, 0.3));
    if (window.gsap && ctx.fresh) {
      if (window.ScrollTrigger) ScrollTrigger.getAll().forEach(s => s.kill());
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.from('.syn-nav__in', { y: -22, autoAlpha: 0, duration: 0.6 })
        .from('.syn-hero__ix', { y: 16, autoAlpha: 0, duration: 0.5 }, '-=0.2')
        .from('.syn-hero__l > :nth-child(2)', { y: 18, autoAlpha: 0, duration: 0.65 }, '-=0.25')
        .from('.syn-hero__lede', { y: 14, autoAlpha: 0, duration: 0.5 }, '-=0.4')
        .from('.syn-hero__cta .syn-cta', { y: 14, autoAlpha: 0, duration: 0.45, stagger: 0.1 }, '-=0.3')
        .from('.syn-chiplet', { y: 10, autoAlpha: 0, duration: 0.3, stagger: 0.05 }, '-=0.25')
        .from('.syn-spec', { scale: 0.9, autoAlpha: 0, duration: 0.7, ease: 'back.out(1.4)' }, '-=0.9')
        .from('.syn-spec__t', { scale: 0, autoAlpha: 0, duration: 0.4, stagger: 0.06 }, '-=0.4')
        .from('.syn-spec__ticker', { x: 14, autoAlpha: 0, duration: 0.4 }, '-=0.4')
        .from('.syn-rail', { scaleY: 0, transformOrigin: 'top', duration: 0.6 }, '-=0.6')
        .from('.syn-classes__row .syn-chip', { y: 16, autoAlpha: 0, duration: 0.4, stagger: 0.05, immediateRender: false, clearProps: 'opacity,visibility,transform' }, '-=0.3');
      if (window.ScrollTrigger) gsap.utils.toArray('.syn-subj, .syn-engines, .syn-join').forEach(sec => {
        gsap.from(sec, { y: 34, autoAlpha: 0, duration: 0.6, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 86%', toggleActions: 'play none none none', once: true } });
      });
      // Footer: never gate visibility on a scroll trigger (it could get stuck
      // hidden in the scaled stage). Animate y only — opacity stays 1 throughout.
      gsap.from('.syn-foot', { y: 24, duration: 0.6, ease: 'power3.out', clearProps: 'transform',
        scrollTrigger: window.ScrollTrigger ? { trigger: '.syn-foot', start: 'top 96%', once: true } : undefined });
    }
  }

  document.addEventListener('click', ()=>document.querySelectorAll('.syn-screens__menu.open').forEach(m=>m.classList.remove('open')));
})();
