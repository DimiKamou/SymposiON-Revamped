/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · INNER SCREENS · part 2
   Temple · Anodos · Tartarus · Anathesi · Admin · Login
   Adds onto window.SYM_SCREENS.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const go = (s, p) => window.symGo(s, p);
  const P  = window.synPage;
  const SY = window.SYM;
  const H  = window.SYM_SCREENS_HELPERS;
  const glyph = H.glyph, stat = H.stat, pill = H.pill, chip = H.chip, editable = H.editable, isAdmin = H.isAdmin;

  function ritual(accent){
    const wrap = el('div',{class:'sc-ritual','aria-hidden':'true', style:`--ca:${accent}`});
    wrap.innerHTML = '<svg viewBox="0 0 300 300"><g class="rr rr1"><circle cx="150" cy="150" r="132" fill="none" stroke="currentColor" stroke-width="0.8" stroke-opacity=".3"/><circle cx="150" cy="150" r="110" fill="none" stroke="currentColor" stroke-width="0.6" stroke-opacity=".22"/></g><g class="rr rr2"><circle cx="150" cy="150" r="92" fill="none" stroke="currentColor" stroke-width="0.7" stroke-dasharray="2 7" stroke-opacity=".3"/></g><g class="rr rr1"><circle cx="150" cy="150" r="60" fill="none" stroke="currentColor" stroke-width="0.6" stroke-opacity=".2"/></g></svg>';
    return wrap;
  }

  const S = {};

  /* ══ TEMPLE OF THE MUSES ══ (kleos · slots · quests · saga · ritual) */
  S.temple = function(home, ctx){
    const accent = '#3E9183';
    const kleos = SymStore.get('kleos', 2400);
    const body = P(home, { back:'home', accent, eyebrow:L({gr:'Ἀγορά',en:'Agora · The Marketplace'}),
      title:L({gr:'Στόλισε τον κόσμο σου',en:'Adorn your world'}), sub:L({gr:'Ξόδεψε Kleos σε ακρωτήρια, θέματα, δείκτες & εφέ — κι όλα φοριούνται στην αρχική σου.',en:'Spend Kleos on acroteria, themes, cursors & effects — all worn across your home.'}),
      actions:[ el('div',{class:'sc-kleos'},[ glyph('wreath-laurel','sc-kleos__gl'), el('b',{},kleos.toLocaleString('en-US')), 'Kleos' ]) ] });

    // ── altar: ritual circle + backdrop ambient + corner acroteria ──
    const bd = SymStore.get('cosm_backdrop','bd-circle');
    const altar = el('div',{class:'sc-altar sc-stagger has-accent sc-altar--'+bd, style:`--ca:${accent}`});
    altar.appendChild(ritual(accent));
    const eqAcro = SymStore.get('acro_equipped','parthenon');
    const ALLACRO = SY.ACROTERIA.concat((window.SymStore&&SymStore.get('custom_acroteria',[]))||[]);
    const eqA = ALLACRO.find(a=>a.id===eqAcro)||SY.ACROTERIA[0];
    altar.appendChild(el('span',{class:'sc-altar__corner sc-altar__corner--l','data-illu':eqA.illu}));
    altar.appendChild(el('span',{class:'sc-altar__corner sc-altar__corner--r','data-illu':'owl'}));
    altar.appendChild(el('div',{class:'sc-altar__center'},[
      (function(){ var T=(window.SYM_TITLES||[]).find(function(t){return t.id===SymStore.get('title_eq','t-neophyte');}); return el('div',{class:'sc-altar__title'+(T&&T.id!=='t-neophyte'?' on':'')}, T?L(T):''); })(),
      el('span',{class:'sc-altar__illu','data-illu':eqA.illu}),
      el('div',{class:'sc-altar__nm'}, L(eqA)),
      el('div',{class:'sc-altar__sub'}, L({gr:'Τρέχον ακρωτήριο',en:'Equipped acroterion'})),
    ]));
    body.appendChild(altar);

    // ── sticky pillar navigation (sits above the shop) ──
    const TABS=[['tg-acro',{gr:'Ἀκρωτήρια',en:'Acroteria'}],['tg-cosmetics',{gr:'Διάκοσμος',en:'Adornments'}],['tg-titles',{gr:'Τίτλοι',en:'Titles'}],['tg-quests',{gr:'ἆθλοι',en:'Quests'}],['tg-ach',{gr:'Τρόπαια',en:'Medals'}],['tg-oracles',{gr:'Μαντεῖα',en:'Oracles'}]];
    body.appendChild(el('div',{class:'sc-tnav sc-stagger'}, TABS.map(([id,lab])=> el('button',{class:'sc-tnav__b', onclick:(e)=>{ document.querySelectorAll('.sc-tnav__b').forEach(b=>b.classList.remove('on')); e.currentTarget.classList.add('on'); const t=document.getElementById(id); if(t){ window.scrollTo({top:t.getBoundingClientRect().top+window.scrollY-70, behavior:'smooth'}); } }}, L(lab)))));

    // ── AKROTERIA · the altar centrepiece collection (heart of the Emporion) ──
    body.appendChild(el('div',{class:'sc-templ-hd sc-stagger', id:'tg-acro'},[
      el('span',{class:'sc-sec-lbl', style:'margin:0'}, L({gr:'Ἀκρωτήρια · Acroteria',en:'Acroteria'})),
      el('span',{class:'sc-loadout'}, L({gr:'Στεφανώνει τον βωμό σου',en:'Crowns your altar'})),
    ]));
    const ACAT_LABELS = {found:{gr:'Θεμέλια',en:'Founding'},season:{gr:'Ἑορταί',en:'Seasonal'},myth:{gr:'Μυθολογία',en:'Myth'},epic:{gr:'Ἔπη',en:'Epics'},life:{gr:'Βίος',en:'Daily Life'},byz:{gr:'Βυζάντιο',en:'Byzantium'},modern:{gr:'Νεωτέρα',en:'Modern'},world:{gr:'Κόσμος',en:'World'}};
    function acroCats(){ const list=SY.ACROTERIA.concat((window.SymStore&&SymStore.get('custom_acroteria',[]))||[]); const seen=[]; list.forEach(a=>{ if(a.cat&&seen.indexOf(a.cat)<0) seen.push(a.cat); }); return [['all',{gr:'Ὅλα',en:'All'}]].concat(seen.map(c=>[c, ACAT_LABELS[c]||{gr:c,en:c}])); }
    const acroGrid = el('div',{class:'sc-temple sc-stagger has-accent', style:`--ca:${accent}`});
    const acroFils = el('div',{class:'sc-fils sc-stagger'});
    function paintAcro(){
      const ACList = SY.ACROTERIA.concat((window.SymStore&&SymStore.get('custom_acroteria',[]))||[]);
      const cat = SymStore.get('acro_cat','all');
      acroFils.innerHTML=''; acroCats().forEach(([cid,lab])=> acroFils.appendChild(chip(L(lab), cid===cat, ()=>{ SymStore.set('acro_cat',cid); paintAcro(); })));
      const defOwned = ACList.filter(a=>a.owned||a.cost===0).map(a=>a.id);
      const owned = SymStore.get('acro_owned', defOwned);
      const eq = SymStore.get('acro_equipped','parthenon');
      acroGrid.innerHTML='';
      ACList.filter(a=> cat==='all' || a.cat===cat).forEach(a=>{
        const isOwned = owned.indexOf(a.id)>=0 || a.cost===0, isEq = eq===a.id;
        const card = el('div',{class:'sc-acro'+(isOwned?'':' locked')+(isEq?' eq':'')+(a.premium?' sc-acro--premium':''), onclick:()=>{
          if(isEq) return;
          if(isOwned){ SymStore.set('acro_equipped',a.id); symRender(); return; }
          const k=SymStore.get('kleos',2400);
          if(k>=a.cost){ SymStore.set('kleos',k-a.cost); const o=owned.slice(); o.push(a.id); SymStore.set('acro_owned',o); SymStore.set('acro_equipped',a.id); symRender(); }
          else { card.classList.add('shake'); setTimeout(()=>card.classList.remove('shake'),400); }
        }},[
          el('div',{class:'sc-acro__art'},[ glyph(a.illu,'sc-acro__gl'), a.premium?el('span',{class:'sc-acro__prem', title:'Premium'},'★'):null ]),
          el('div',{class:'sc-acro__t'}, L(a)),
          el('div',{class:'sc-acro__st'}, isOwned ? (isEq?L({gr:'✓ Στὸν βωμό',en:'✓ On the altar'}):L({gr:'Στὴ συλλογή',en:'Owned'})) : ('⌾ '+a.cost.toLocaleString('en-US'))),
        ]);
        acroGrid.appendChild(card);
      });
      if(window.injectIllus) injectIllus(acroGrid);
    }
    paintAcro();
    body.appendChild(acroFils);
    body.appendChild(acroGrid);

    // ── ADORNMENTS · themes · cursor effects · avatar (worn platform-wide) ──
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger', id:'tg-cosmetics'}, L({gr:'Διάκοσμος · Adornments',en:'Adornments'})));
    body.appendChild(el('p',{class:'sc-acro-intro sc-stagger'}, L({gr:'Πέρα από το ακρωτήριο: διάλεξε θέμα, δείκτη και avatar — όλα φοριούνται σε όλη την πλατφόρμα.',en:'Beyond the acroterion: pick a theme, a cursor and an avatar — all worn across the whole platform.'})));
    /* Cursor cosmetics — the SAME shape + icon system as the theme-panel cursor
       picker, sharing SymStore keys (own_cursor_shape/icon, cursor_shape/icon)
       so unlocks & equips sync across both surfaces. */
    const CUR_PREMIUM = ['monsterball','invader','ghost','mushroom','pixelheart','joystick','skull','katana'];
    const curShapeSVG = (id)=> (window.SymCursor && SymCursor.shapeSVG) ? SymCursor.shapeSVG(id) : '';
    const curIconSVG  = (id)=> (window.SymCursor && SymCursor.iconSVG)  ? SymCursor.iconSVG(id)  : '';
    const shapeItems = [ { id:'none', gr:'Κανένα', en:'None', price:0, ch:'∅' } ].concat(
      [['circle','Κύκλος','Ring'],['diamond','Ρόμβος','Diamond'],['square','Τετράγωνο','Square'],['hexagon','Ἑξάγωνο','Hexagon'],['triangle','Τρίγωνο','Triangle'],['reticle','Στόχαστρο','Reticle']]
        .map(([id,gr,en])=>({ id, gr, en, price:(id==='circle'?0:600), svg:curShapeSVG(id) })) );
    const ICON_ILLU = { trident:'trident', owl:'owl', wreath:'wreath-laurel', stylus:'quill' };
    const iconItems = [ { id:'none', gr:'Κανένα', en:'None', price:0, ch:'∅' } ].concat(
      [['star','Ἀστέρι','Star'],['eye','Μάτι','Eye'],['dot','Κουκκίδα','Dot'],['arrow','Βέλος','Arrow'],['meander','Μαίανδρος','Meander'],['bolt','Κεραυνός','Bolt'],['trident','Τρίαινα','Trident'],['owl','Γλαῦξ','Owl'],['wreath','Στέφανος','Wreath'],['laurel','Δάφνη','Laurel'],['stylus','Γραφίς','Stylus'],['monsterball','Σφαίρα','Ball'],['invader','Invader','Invader'],['ghost','Φάντασμα','Ghost'],['mushroom','Μανιτάρι','Mushroom'],['pixelheart','Καρδιά','Heart'],['joystick','Joystick','Joystick'],['skull','Κρανίο','Skull'],['katana','Κατάνα','Katana']]
        .map(([id,gr,en])=>{ const price = CUR_PREMIUM.indexOf(id)>=0?1800:600; const svg = curIconSVG(id); const it={ id, gr, en, price }; if(svg) it.svg=svg; else if(id==='laurel') it.sym='laurel-arc'; else it.illu=ICON_ILLU[id]||'owl'; return it; }) );
    const themeItems  = (window.SYM_THEMES||[]).map(t=>({ id:t.id, gr:t.nm, en:t.nm, price:(t.lock?2600:(t.group==='vivid'?1400:0)), sw:[t.a, t.b] }));
    const avatarItems = (SY.AVATARS||[]).map(a=>({ id:a.id, gr:a.gr, en:a.en, price:0, illu:a.illu }));
    const mfxItems = [
      { id:'none',    gr:'Κανένα',     en:'None',       price:0,   ch:'∅' },
      { id:'snow',    gr:'Χιόνι',      en:'Snowflakes', price:0,   ch:'❄' },
      { id:'sparks',  gr:'Σπίθες',     en:'Sparks',     price:500, ch:'✦' },
      { id:'embers',  gr:'Θράκα',      en:'Embers',     price:500, ch:'✸' },
      { id:'petals',  gr:'Πέταλα',     en:'Petals',     price:700, ch:'❀' },
      { id:'stars',   gr:'Ἀστέρια',    en:'Stars',      price:700, ch:'✧' },
      { id:'bubbles', gr:'Φυσαλίδες',  en:'Bubbles',    price:800, ch:'○' },
      { id:'laurel',  gr:'Δάφνη',      en:'Laurel',     price:800, ch:'❧' },
      { id:'comet',   gr:'Κομήτης',    en:'Comet',      price:900, ch:'☄' },
      { id:'runes',   gr:'Σύμβολα',    en:'Glyphs',     price:900, ch:'Ω' },
      { id:'confetti',gr:'Κομφετί',    en:'Confetti',   price:800, ch:'▰' },
      { id:'eggs',    gr:'Πασχαλινὰ αὐγά', en:'Easter eggs', price:700, ch:'🥚', season:1 },
      { id:'pumpkins',gr:'Κολοκῦθες',  en:'Pumpkins',   price:700, ch:'🎃', season:1 },
      { id:'masks',   gr:'Μάσκες Καρναβαλιοῦ', en:'Carnival masks', price:700, ch:'🎭', season:1 },
      { id:'leaves',  gr:'Φθινοπωρινὰ φύλλα', en:'Autumn leaves', price:700, ch:'🍂', season:1 },
      { id:'fireflies',gr:'Πυγολαμπίδες',en:'Fireflies',price:900, ch:'∗' },
      { id:'ink',     gr:'Μελάνι',     en:'Ink',        price:600, ch:'⬤' },
      { id:'gold',    gr:'Χρυσόσκονη',  en:'Gold dust',  price:900, ch:'✦' },
      { id:'ripple',  gr:'Κυματισμός',  en:'Ripple',     price:700, ch:'◌' },
    ];
    const SLOTS = [
      { key:'theme',  t:{gr:'Θέματα',en:'Themes'},  blurb:{gr:'Ὅλη ἡ παλέτα · συγχρονίζεται ἀπ’ τὸ admin',en:'The full palette · syncs from admin'}, illu:'column', items:themeItems,
        cur:()=>window.STATE.theme, apply:(id)=>{ window.STATE.theme=id; window.STATE.season=null; if(window.SymSeasons) SymSeasons.apply(null); SymStore.set('theme',id); } },
      { key:'cursor_shape', t:{gr:'Δείκτης · Σχῆμα',en:'Cursor · Shape'}, blurb:{gr:'Σχῆμα δείκτη — ίδιο μὲ τὸ πάνελ θεμάτων', en:'Cursor shape — same as the theme panel'}, illu:'quill', items:shapeItems,
        cur:()=>SymStore.get('cursor_shape', (window.STATE&&STATE.cursorShape)||'circle'), apply:(id)=>{ if(window.STATE) STATE.cursorShape=id; SymStore.set('cursor_shape',id); if(window.SymCursor) SymCursor.setShape(id); } },
      { key:'cursor_icon', t:{gr:'Δείκτης · Εἰκονίδιο',en:'Cursor · Icon'}, blurb:{gr:'Εἰκονίδιο δείκτη — ξεκλειδώνει κι ἐδῶ κι ἀπ’ τὰ θέματα',en:'Cursor icon — unlocks here and from themes'}, illu:'owl', items:iconItems,
        cur:()=>SymStore.get('cursor_icon', (window.STATE&&STATE.cursorIcon)||'none'), apply:(id)=>{ if(window.STATE) STATE.cursorIcon=id; SymStore.set('cursor_icon',id); if(window.SymCursor) SymCursor.setIcon(id); } },
      { key:'mousefx',t:{gr:'Ἐφὲ Δείκτη',en:'Mouse FX'}, blurb:{gr:'Ἴχνος ποντικιοῦ: χιόνι, αὐγά, κομφετί & ἐποχικά…',en:'Pointer trail: snow, eggs, confetti & seasonal…'}, illu:'lightning-bolt', items:mfxItems,
        cur:()=>(window.SymStore?SymStore.get('mousefx','none'):'none'), apply:(id)=>{ SymStore.set('mousefx',id); if(window.SymMouseFX) SymMouseFX.set(id); } },
      { key:'avatar', t:{gr:'Avatar',en:'Avatar'},  blurb:{gr:'Τὸ πρόσωπό σου στὴν ἀρχικὴ & τὸ προφίλ',en:'Your face in the nav & profile'}, illu:'owl', items:avatarItems,
        cur:()=>SymStore.get('avatar','av-athena'), apply:(id)=>{ SymStore.set('avatar',id); } },
    ];
    const slotGrid = el('div',{class:'sc-slots sc-stagger has-accent', style:`--ca:${accent}`});
    SLOTS.forEach(slot=>{
      const eq = slot.items.find(x=>x.id===slot.cur()) || slot.items[0];
      const art = (eq&&eq.sw) ? el('span',{class:'sc-slot__art', style:`background:linear-gradient(135deg, ${eq.sw[0]} 50%, ${eq.sw[1]} 50%)`})
                  : (eq&&eq.svg) ? el('span',{class:'sc-slot__art'},[ el('span',{class:'sc-slot__gl', html:eq.svg}) ])
                  : (eq&&eq.sym) ? el('span',{class:'sc-slot__art'},[ el('span',{class:'sc-slot__gl','data-sym':eq.sym}) ])
                  : (eq&&eq.ch) ? el('span',{class:'sc-slot__art'},[ el('span',{class:'sc-slot__gl sc-slot__ch'}, eq.ch) ])
                              : el('span',{class:'sc-slot__art'},[ (eq&&eq.illu)?glyph(eq.illu,'sc-slot__gl'):el('span',{class:'sc-slot__gl', style:'font-size:22px;display:grid;place-items:center'}, '↖') ]);
      const sb = el('button',{class:'sc-slot', onclick:()=>openSlotPicker(slot)},[
        art,
        el('div',{class:'sc-slot__b'},[ el('span',{class:'sc-slot__l'}, L(slot.t)), el('span',{class:'sc-slot__v','data-slotv':slot.key}, eq?L(eq):'—'), el('span',{class:'sc-slot__hint'}, L(slot.blurb)) ]),
        el('span',{class:'sc-slot__edit',html:'✎'}),
      ]);
      slotGrid.appendChild(sb);
    });
    body.appendChild(slotGrid);

    function openSlotPicker(slot){
      const ownKey = 'own_'+slot.key;
      const ov = el('div',{class:'acro-ov', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
      const box = el('div',{class:'acro-box'});
      box.appendChild(el('div',{class:'acro-box__bar'},[
        el('div',{class:'acro-box__ttl'},[ el('span',{class:'acro-box__ic','data-illu':slot.illu}), L(slot.t) ]),
        el('div',{class:'acro-box__kleos'},[ el('span',{class:'acro-box__kic','data-illu':'wreath-laurel'}), el('b',{id:'slotKleos'}, SymStore.get('kleos',2400).toLocaleString('en-US')), 'Kleos' ]),
        el('button',{class:'acro-box__x', onclick:()=>ov.remove(), html:'&times;'}),
      ]));
      const grid = el('div',{class:'acro-grid'});
      function paint(){
        grid.innerHTML='';
        const own = SymStore.get(ownKey, slot.items.filter(x=>x.price===0).map(x=>x.id));
        const cur = slot.cur();
        slot.items.forEach(it=>{
          const isOwned = own.indexOf(it.id)>=0 || it.price===0, isEq = cur===it.id;
          const card = el('div',{class:'acro-card'+(isOwned?'':' locked')+(isEq?' eq':'')},[
            it.sw ? el('span',{class:'acro-card__art', style:`background:linear-gradient(135deg, ${it.sw[0]} 50%, ${it.sw[1]} 50%)`}) : it.svg ? el('span',{class:'acro-card__art'},[ el('span',{class:'acro-card__illu', html:it.svg}) ]) : it.sym ? el('span',{class:'acro-card__art'},[ el('span',{class:'acro-card__illu','data-sym':it.sym}) ]) : it.ch ? el('span',{class:'acro-card__art'},[ el('span',{class:'acro-card__illu sc-slot__ch', style:'font-size:30px;display:grid;place-items:center'}, it.ch) ]) : el('span',{class:'acro-card__art'},[ it.illu?glyph(it.illu,'acro-card__illu'):el('span',{class:'acro-card__illu', style:'font-size:30px;display:grid;place-items:center'}, '↖') ]),
            el('span',{class:'acro-card__nm'}, L(it)),
            el('span',{class:'acro-card__tag'}, isOwned ? (isEq?'✓':L({gr:'στη συλλογή',en:'owned'})) : ('⌾ '+it.price.toLocaleString('en-US'))),
            isOwned
              ? el('button',{class:'acro-card__btn'+(isEq?' on':''), onclick:()=>{ slot.apply(it.id); paint(); symRender(); }}, isEq?L({gr:'✓ Ἐπιλεγμένο',en:'✓ Selected'}):L({gr:'Ἐπίλεξε',en:'Select'}))
              : el('button',{class:'acro-card__btn acro-card__btn--buy', onclick:()=>{ const k=SymStore.get('kleos',2400); if(k>=it.price){ SymStore.set('kleos',k-it.price); const o=own.slice(); o.push(it.id); SymStore.set(ownKey,o); slot.apply(it.id); const kk=document.getElementById('slotKleos'); if(kk) kk.textContent=(k-it.price).toLocaleString('en-US'); paint(); symRender(); } else { card.classList.add('shake'); setTimeout(()=>card.classList.remove('shake'),400); } }}, L({gr:'Ξεκλείδωμα',en:'Unlock'})),
          ]);
          grid.appendChild(card);
        });
        if(window.injectIllus) injectIllus(grid);
      }
      paint();
      box.appendChild(grid);
      box.appendChild(el('div',{class:'acro-box__foot'},[ el('span',{}, L({gr:'Κέρδισε Kleos παίζοντας.',en:'Earn Kleos by playing.'})), el('button',{class:'acro-box__temple', onclick:()=>ov.remove()}, L({gr:'Έγινε',en:'Done'})) ]));
      ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
      if(window.injectIllus) injectIllus(ov);
      requestAnimationFrame(()=>ov.classList.add('in'));
      if(window.gsap) gsap.from(box,{y:24,scale:.97,autoAlpha:0,duration:.4,ease:'back.out(1.5)'});
    }

    // ── quests · 5 daily (1 free reroll) + 5 weekly (resets Monday) ──
    const DAILY_POOL = [
      { t:{gr:'Παίξε 3 παιχνίδια',en:'Play 3 games'}, n:3, r:120 },
      { t:{gr:'Πέτυχε σερί 10',en:'Hit a 10 streak'}, n:10, r:90 },
      { t:{gr:'Κέρδισε 500 Kleos',en:'Earn 500 Kleos'}, n:500, r:80 },
      { t:{gr:'Απάντησε 20 σωστά',en:'Answer 20 correctly'}, n:20, r:70 },
      { t:{gr:'Νίκησε σε ένα Live Arena',en:'Win a Live Arena'}, n:1, r:150 },
      { t:{gr:'Ανασκόπησε 15 κάρτες Tartarus',en:'Review 15 Tartarus cards'}, n:15, r:90 },
      { t:{gr:'Παίξε 2 διαφορετικά μαθήματα',en:'Play 2 different subjects'}, n:2, r:100 },
      { t:{gr:'Πέτυχε 90% ακρίβεια',en:'Score 90%+ accuracy'}, n:1, r:110 },
      { t:{gr:'Ανέβα 1 βαθμίδα στην Άνοδο',en:'Climb 1 Anodos tier'}, n:1, r:120 },
      { t:{gr:'Μελέτησε 5 λεπτά',en:'Study for 5 minutes'}, n:5, r:60 },
    ];
    const WEEKLY_POOL = [
      { t:{gr:'Νίκησε σε 5 Live Arenas',en:'Win 5 Live Arenas'}, n:5, r:500 },
      { t:{gr:'Κατάκτησε 50 κάρτες Tartarus',en:'Master 50 Tartarus cards'}, n:50, r:400 },
      { t:{gr:'Ολοκλήρωσε ένα κεφάλαιο Saga',en:'Complete a Saga chapter'}, n:1, r:600 },
      { t:{gr:'Κέρδισε 5.000 Kleos',en:'Earn 5,000 Kleos'}, n:5000, r:450 },
      { t:{gr:'Παίξε 7 μέρες στη σειρά',en:'Play 7 days in a row'}, n:7, r:700 },
      { t:{gr:'Φτάσε σερί 30',en:'Reach a 30 streak'}, n:30, r:400 },
      { t:{gr:'Τελείωσε 25 παιχνίδια',en:'Finish 25 games'}, n:25, r:400 },
      { t:{gr:'Ξεκλείδωσε ένα ακρωτήριο',en:'Unlock an acroterion'}, n:1, r:350 },
      { t:{gr:'Κορυφή στον πίνακα της τάξης',en:'Top your class leaderboard'}, n:1, r:650 },
      { t:{gr:'Απάντησε 200 σωστά',en:'Answer 200 correctly'}, n:200, r:450 },
    ];
    const DAY = Math.floor(Date.now()/86400000);
    const WEEK = Math.floor((Date.now()/86400000 + 3)/7); // Monday-based
    let rr = SymStore.get('quest_reroll', {d:DAY,n:0}); if(rr.d!==DAY){ rr={d:DAY,n:0}; SymStore.set('quest_reroll',rr); }
    const dOff = SymStore.get('quest_daily_off',0);
    function pickN(pool, n, seed){ const a=pool.slice(), out=[]; let x=seed>>>0; for(let k=0;k<n && a.length;k++){ x=(x*9301+49297)%233280; out.push(a.splice(Math.floor(x/233280*a.length),1)[0]); } return out; }
    function qh(str){ let h=2166136261; for(let k=0;k<str.length;k++){ h^=str.charCodeAt(k); h=Math.imul(h,16777619); } return h>>>0; }
    function withProg(q, salt){ const p=Math.min(q.n, Math.round((qh(L(q.t)+salt)%100)/100*q.n*1.18)); return Object.assign({},q,{p}); }
    const daily  = pickN(DAILY_POOL, 5, DAY + dOff*101).map(q=>withProg(q,'d'+DAY+dOff));
    const weekly = pickN(WEEKLY_POOL, 5, WEEK).map(q=>withProg(q,'w'+WEEK));
    const hrsToDay = 24 - new Date().getUTCHours();
    const daysToMon = ((8 - (((new Date().getUTCDay())||7))) % 7) || 7;
    function questCard(q, kindLabel){ const done=q.p>=q.n; return el('div',{class:'sc-quest'+(done?' done':'')},[
      el('span',{class:'sc-quest__kind'}, kindLabel),
      el('div',{class:'sc-quest__t'}, L(q.t)),
      el('div',{class:'sc-quest__bar'},[ el('span',{class:'sc-quest__fill',style:`width:${Math.min(100,q.p/q.n*100)}%`}) ]),
      el('div',{class:'sc-quest__foot'},[ el('span',{class:'sc-quest__p'}, q.p+'/'+q.n),
        el('button',{class:'sc-quest__claim'+(done?'':' off'), disabled:done?null:'', onclick:()=>{ if(done){ SymStore.set('kleos',SymStore.get('kleos',2400)+q.r); symRender(); } }}, done?('+'+q.r+' Kleos'):('🔒 +'+q.r)) ]),
    ]); }
    // daily header + free reroll
    const canReroll = rr.n < 1;
    body.appendChild(el('div',{class:'sc-templ-hd sc-stagger', id:'tg-quests'},[
      el('span',{class:'sc-sec-lbl', style:'margin:0'}, L({gr:'Ημερήσιοι Άθλοι · Daily',en:'Daily Labours'})),
      el('span',{class:'sc-loadout'}, L({gr:'ανανέωση σε',en:'resets in'})+' '+hrsToDay+'ω'),
      el('button',{class:'sc-reroll'+(canReroll?'':' off'), disabled:canReroll?null:'', onclick:()=>{ if(rr.n<1){ rr.n+=1; SymStore.set('quest_reroll',rr); SymStore.set('quest_daily_off',dOff+1); symRender(); } }},[ el('span',{html:'↻ '}), canReroll?L({gr:'Δωρεάν reroll',en:'Free reroll'}):L({gr:'Reroll αύριο',en:'Reroll tomorrow'}) ]),
    ]));
    const qgrid = el('div',{class:'sc-quests sc-stagger has-accent', style:`--ca:${accent}`});
    daily.forEach(q=> qgrid.appendChild(questCard(q, L({gr:'Ημερήσιο',en:'Daily'}))));
    body.appendChild(qgrid);
    // weekly header + grid
    body.appendChild(el('div',{class:'sc-templ-hd sc-stagger'},[
      el('span',{class:'sc-sec-lbl', style:'margin:0'}, L({gr:'Εβδομαδιαίοι Άθλοι · Weekly',en:'Weekly Labours'})),
      el('span',{class:'sc-loadout'}, L({gr:'ανανέωση Δευτέρα · σε',en:'resets Monday · in'})+' '+daysToMon+L({gr:'μ',en:'d'})),
    ]));
    const wgrid = el('div',{class:'sc-quests sc-stagger has-accent', style:`--ca:${accent}`});
    weekly.forEach(q=> wgrid.appendChild(questCard(q, L({gr:'Εβδομαδιαίο',en:'Weekly'}))));
    body.appendChild(wgrid);

    // ── saga ──
    const ch = SymStore.get('saga_ch', 3);
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Σάγκα · The Saga',en:'The Saga'})));
    body.appendChild(el('p',{class:'sc-acro-intro sc-stagger'}, L({gr:'Η αφηγηματική σου πορεία — έξι κεφάλαια από το Χάος ως την Ἀπόλυση. Τέλεσε ιεροτελεστίες για να προχωράς και να κερδίζεις Kleos.',en:'Your narrative path — six chapters from Chaos to Release. Perform rites to advance and earn Kleos.'})));
    const saga = el('div',{class:'sc-saga sc-stagger has-accent', style:`--ca:${accent}`, id:'tg-saga'});
    const chapters = ['Χάος','Τιτᾶνες','Ὀλύμπιοι','Ἥρωες','Νόστος','Ἀπόλυσις'];
    chapters.forEach((c,i)=> saga.appendChild(el('div',{class:'sc-sagac sc-sagac--'+(i<ch?'done':i===ch?'now':'lock')},[
      el('span',{class:'sc-sagac__n'}, i<ch?'✓':i===ch?'◆':'🔒'),
      el('span',{class:'sc-sagac__t'}, c),
    ])));
    body.appendChild(saga);
    body.appendChild(el('div',{class:'sc-saga__bar sc-stagger'},[ el('span',{class:'sc-saga__fill',style:`width:${ch/chapters.length*100}%`}), el('span',{class:'sc-saga__t'}, L({gr:'Κεφάλαιο',en:'Chapter'})+' '+ch+' / '+chapters.length) ]));
    body.appendChild(el('div',{class:'sc-rite-cta sc-stagger'},[
      el('button',{class:'sc-cta sc-cta--solid', onclick:()=>{ if(ch<chapters.length){ SymStore.set('saga_ch', ch+1); const k=SymStore.get('kleos',2400); SymStore.set('kleos',k+250); symRender(); } }},[ el('span',{class:'sc-illu','data-illu':'flame', style:'width:18px;height:18px;display:inline-block;vertical-align:-3px'}), ' ', L({gr:'Τέλεσε Ιεροτελεστία · +250 Kleos',en:'Perform a Rite · +250 Kleos'}) ]),
      el('span',{class:'sc-rite-cta__n'}, L({gr:'Προχωρά την σάγκα σου.',en:'Advance your saga.'})),
    ]));

    // ── TITLES · Τίτλοι (honorary epithets — wear one; it shows on your altar, profile & nav) ──
    const titleEq = SymStore.get('title_eq','t-neophyte');
    body.appendChild(el('div',{class:'sc-templ-hd sc-stagger'},[
      el('span',{class:'sc-sec-lbl', style:'margin:0'}, L({gr:'Τίτλοι · Honours',en:'Titles · Honours'})),
      el('span',{class:'sc-loadout'},[ L({gr:'Τίτλος',en:'Worn'})+' ', el('b',{id:'titleNow'}, (function(){var T=(window.SYM_TITLES||[]).find(function(t){return t.id===titleEq;});return T?L(T):'—';})()) ]),
    ]));
    body.appendChild(el('p',{class:'sc-acro-intro sc-stagger'}, L({gr:'Κέρδισε τιμητικούς τίτλους και φόρεσε έναν — εμφανίζεται στον βωμό σου, στο προφίλ και δίπλα στο avatar σου.',en:'Earn honorary titles and wear one — it appears on your altar, your profile, and beside your avatar.'})));
    const TITLES = (window.SYM_TITLES||[]);
    const titleGrid = el('div',{class:'sc-titles sc-stagger has-accent', style:`--ca:${accent}`, id:'tg-titles'});
    function paintTitles(){
      titleGrid.innerHTML='';
      const owned = SymStore.get('title_owned',['t-neophyte']); const eq = SymStore.get('title_eq','t-neophyte');
      TITLES.forEach(t=>{
        const isOwned = owned.indexOf(t.id)>=0 || t.price===0, isEq = eq===t.id;
        let foot;
        if(!isOwned) foot = el('button',{class:'sc-boon__btn buy', onclick:()=>{ const k=SymStore.get('kleos',2400); if(k>=t.price){ SymStore.set('kleos',k-t.price); const o=owned.slice(); o.push(t.id); SymStore.set('title_owned',o); SymStore.set('title_eq',t.id); symRender(); } else { titleGrid.classList.add('shake'); setTimeout(()=>titleGrid.classList.remove('shake'),400);} }},[ glyph('wreath-laurel','sc-boon__k'), t.price.toLocaleString('en-US') ]);
        else foot = el('button',{class:'sc-boon__btn'+(isEq?' on':''), onclick:()=>{ SymStore.set('title_eq', isEq?'t-neophyte':t.id); symRender(); }}, isEq?L({gr:'✓ Σε χρήση',en:'✓ Worn'}):L({gr:'Φόρεσέ τον',en:'Wear it'}));
        titleGrid.appendChild(el('div',{class:'sc-title-card'+(isEq?' eq':'')+(isOwned?'':' locked')},[
          el('div',{class:'sc-title-card__rk'}, t.rank),
          el('div',{class:'sc-title-card__b'},[ el('h4',{class:'sc-boon__nm'}, L(t)), el('span',{class:'sc-boon__eff'}, L(t.note)) ]),
          foot,
        ]));
      });
      if(window.injectIllus) injectIllus(titleGrid);
    }
    paintTitles();
    body.appendChild(titleGrid);

    // (Lifelines / Σωτηρίαι live in Anodos now — removed from the Agora shop.)

    // ── ACHIEVEMENTS · stat dashboard + medals ──
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Βίος ἐν Ἀριθμοῖς · A Life in Numbers',en:'A Life in Numbers'})));
    body.appendChild(el('div',{class:'sc-tstats sc-stagger'},[
      tstat('48.2k', L({gr:'Κλέος αἰώνιον',en:'Lifetime Glory'}), 'gold'),
      tstat('312', L({gr:'Ἐπιστροφαί',en:'Sessions'})),
      tstat('27', L({gr:'Μεγίστη Σειρά',en:'Best Streak'})),
      tstat('64h', L({gr:'Ὧραι',en:'Hours in Rite'})),
      tstat('87%', L({gr:'Ἀκρίβεια',en:'Accuracy'})),
    ]));
    function tstat(v,l,gold){ return el('div',{class:'sc-tstat'+(gold?' gold':'')},[ el('div',{class:'sc-tstat__v'}, v), el('div',{class:'sc-tstat__l'}, l) ]); }
    const ALLACH = window.SYM.ACHIEVEMENTS||[];
    const earnedN = ALLACH.filter(a=>a.val>=a.goal).length;
    body.appendChild(el('div',{class:'sc-templ-hd sc-stagger', id:'tg-ach'},[
      el('span',{class:'sc-sec-lbl', style:'margin:0'}, L({gr:'Τρόπαια · Medals',en:'Medals'})),
      el('span',{class:'sc-loadout'},[ el('b',{}, earnedN+' / '+ALLACH.length), ' '+L({gr:'κερδισμένα',en:'won'}) ]),
    ]));
    const achFils = el('div',{class:'sc-fils sc-stagger'});
    const achGrid = el('div',{class:'sc-medals sc-stagger has-accent', style:`--ca:${accent}`});
    function paintAch(){
      const cat = SymStore.get('ach_cat','milestone');
      [...achFils.children].forEach((b,k)=> b.classList.toggle('active', ((window.SYM.ACH_CATS[k]||{}).id===cat)));
      achGrid.innerHTML='';
      ALLACH.filter(a=> cat==='all'||a.cat===cat).forEach(a=>{ const earned=a.val>=a.goal, pct=Math.min(100,a.val/a.goal*100);
        achGrid.appendChild(el('div',{class:'sc-medal'+(earned?' earned':'')},[
          el('div',{class:'sc-medal__ring', style:`background:conic-gradient(var(--ca) ${pct}%, var(--sink) 0)`},[ el('span',{class:'sc-medal__ic'},[ glyph(a.icon,'sc-gl') ]) ]),
          el('div',{class:'sc-medal__b'},[ el('h4',{class:'sc-boon__nm'}, L(a)), el('span',{class:'sc-boon__eff'}, L(a.note)), el('span',{class:'sc-medal__p'}, Math.min(a.val,a.goal)+' / '+a.goal+(earned?' · '+L({gr:'κερδήθηκε',en:'won'}):'') ) ]),
        ]));
      });
      if(window.injectIllus) injectIllus(achGrid);
    }
    (window.SYM.ACH_CATS||[]).forEach(c=> achFils.appendChild(chip(L(c)+' '+(c.id==='all'?ALLACH.length:ALLACH.filter(a=>a.cat===c.id).length), SymStore.get('ach_cat','milestone')===c.id, ()=>{ SymStore.set('ach_cat',c.id); paintAch(); })));
    body.appendChild(achFils);
    paintAch();
    body.appendChild(achGrid);

    // ── ORACLES · custom pillar (Μαντεῖα) ──
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger', id:'tg-oracles'}, L({gr:'Μαντεῖα · Oracles',en:'Oracles'})));
    body.appendChild(el('p',{class:'sc-acro-intro sc-stagger'}, L({gr:'Το εξοπλισμένο μαντείο σου χαρίζει έναν δωρεάν χρησμό κάθε μέρα — μια βοήθεια σε γρίφο ή κουίζ. Δες τον στην κορυφή της αρχικής και μέσα στην Άνοδο.',en:'Your equipped oracle grants one free divination a day — a hint on a riddle or quiz. Find it atop your home screen and inside Anodos.'})));
    const ORC=[ {id:'or-delphi',el:'Δελφοί',en:'Oracle of Delphi',icon:'acropolis',price:0,lore:{gr:'Οι καπνοστεφείς στίχοι της Πυθίας.',en:'The Pythia’s smoke-wreathed verses.'},reward:{gr:'1 δωρεάν βοήθεια/μέρα σε γρίφο',en:'1 free riddle hint per day'}},
      {id:'or-dodona',el:'Δωδώνη',en:'Whispering Oaks',icon:'olive-tree',price:1200,lore:{gr:'Ο Δίας μιλά μέσα από τα φύλλα.',en:'Zeus speaks through rustling leaves.'},reward:{gr:'1 δωρεάν παράλειψη ερώτησης/μέρα',en:'1 free question-skip per day'}},
      {id:'or-trophonius',el:'Τροφώνιος',en:'Cave of Trophonius',icon:'labyrinth',price:2600,lore:{gr:'Όποιος κατεβεί δεν επιστρέφει ίδιος.',en:'None who descend return unchanged.'},reward:{gr:'+10% Kleos & καθημερινός χρησμός',en:'+10% Kleos & a daily divination'}} ];
    const orcGrid = el('div',{class:'sc-oracles sc-stagger has-accent', style:`--ca:${accent}`});
    function paintOracles(){
      orcGrid.innerHTML='';
      const owned=SymStore.get('oracle_owned',['or-delphi']); const eq=SymStore.get('oracle_eq','or-delphi');
      ORC.forEach(o=>{ const isOwned=owned.indexOf(o.id)>=0||o.price===0, isEq=eq===o.id;
        orcGrid.appendChild(el('div',{class:'sc-oracle'+(isEq?' eq':'')},[
          el('span',{class:'sc-oracle__ic'},[ glyph(o.icon,'sc-gl') ]),
          el('h4',{class:'sc-boon__nm'}, L({gr:o.el,en:o.en})),
          el('p',{class:'sc-boon__eff'}, L(o.lore)),
          el('p',{class:'sc-oracle__reward'},[ glyph('wreath-laurel','sc-oracle__rk'), L(o.reward) ]),
          isOwned
            ? el('button',{class:'sc-boon__btn'+(isEq?' on':''), onclick:()=>{ SymStore.set('oracle_eq',o.id); paintOracles(); }}, isEq?L({gr:'Εξοπλισμένο',en:'Equipped'}):L({gr:'Εξόπλισε',en:'Equip'}))
            : el('button',{class:'sc-boon__btn buy', onclick:()=>{ const k=SymStore.get('kleos',2400); if(k>=o.price){ SymStore.set('kleos',k-o.price); const ow=owned.slice(); ow.push(o.id); SymStore.set('oracle_owned',ow); SymStore.set('oracle_eq',o.id); symRender(); } else { orcGrid.classList.add('shake'); setTimeout(()=>orcGrid.classList.remove('shake'),400);} }},[ glyph('wreath-laurel','sc-boon__k'), o.price.toLocaleString('en-US') ]),
        ]));
      });
      if(window.injectIllus) injectIllus(orcGrid);
    }
    paintOracles();
    body.appendChild(orcGrid);
  };

  /* ══ ANODOS ══ (ritualistic, replayable, editable tiers, riddles) */
  S.anodos = function(home, ctx){
    const accent = '#9C3F1F';
    const reached = SymStore.get('anodos_reached', 4); // tier index reached (from bottom)
    const body = P(home, { back:'home', accent, eyebrow:L({gr:'Ἄνοδος · The Ascent',en:'Anodos · The Ascent'}),
      title:L({gr:'Από τον Τάρταρο στον Όλυμπο',en:'From Tartarus to Olympus'}), sub:L({gr:'Λύσε γρίφους, κέρδισε προκλήσεις, ανέβα τις βαθμίδες.',en:'Solve riddles, win challenges, climb the tiers.'}),
      actions:[ el('button',{class:'sc-cta sc-cta--solid', onclick:()=>beginRun()},[ glyph('flame','sc-cta__gl'), L({gr:'Ξεκίνα την Άνοδο',en:'Begin the Ascent'}) ]) ] });

    function beginRun(){
      SymStore.set('anodos_reached', 0); SymStore.set('anodos_run', (SymStore.get('anodos_run',0)+1));
      symRender();
      if(window.gsap){ const c=document.querySelector('.sc-anodos'); if(c) gsap.from(c.querySelectorAll('.sc-tier'),{x:-16,autoAlpha:0,stagger:0.06,duration:.5,ease:'power3.out'}); }
    }

    // ritual challenge banner
    const challenge = el('div',{class:'sc-rite sc-stagger has-accent', style:`--ca:${accent}`});
    challenge.appendChild(ritual(accent));
    challenge.appendChild(el('div',{class:'sc-rite__in'},[
      el('div',{class:'sc-rite__eyebrow'}, L({gr:'Ο ΓΡΙΦΟΣ ΤΗΣ ΒΑΘΜΙΔΑΣ',en:'RIDDLE OF THE TIER'})),
      el('div',{class:'sc-rite__q'}, L({gr:'«Φτερωτός θεός, ταχύς ἀγγελιαφόρος — ποιος;»',en:'“Winged god, swift messenger — who am I?”'})),
      el('div',{class:'sc-rite__opts'}, [
        {t:'Ἑρμῆς',ok:1},{t:'Ἄρης'},{t:'Ἀπόλλων'},{t:'Διόνυσος'}
      ].map(o=> el('button',{class:'sc-rite__o', onclick:(e)=>{ e.currentTarget.classList.add(o.ok?'ok':'no'); if(o.ok){ const r=Math.min(6, SymStore.get('anodos_reached',reached)+1); SymStore.set('anodos_reached', r); setTimeout(symRender,500);} }}, o.t))),
    ]));
    body.appendChild(challenge);

    // the ladder (top = Olympus)
    const run = SymStore.get('anodos_run',1);
    const r = SymStore.get('anodos_reached', reached);
    const tiers = [
      { id:'olympus', gr:'Ὄλυμπος', en:'Olympus', ch:{gr:'Θρόνος των θεών',en:'Throne of the gods'} },
      { id:'aether', gr:'Αἰθήρ', en:'Aether', ch:{gr:'Πρόκληση φωτός',en:'Trial of light'} },
      { id:'ouranos', gr:'Οὐρανός', en:'Ouranos', ch:{gr:'Γρίφος των άστρων',en:'Riddle of stars'} },
      { id:'agora', gr:'Ἀγορά', en:'Agora', ch:{gr:'Μάχη ρητορικής',en:'Rhetoric duel'} },
      { id:'gaia', gr:'Γῆ', en:'Gaia', ch:{gr:'Δοκιμασία γης',en:'Trial of earth'} },
      { id:'hades', gr:'Ἅιδης', en:'Hades', ch:{gr:'Πέρασμα σκιών',en:'Passage of shades'} },
      { id:'tartarus', gr:'Τάρταρος', en:'Tartarus', ch:{gr:'Η αρχή',en:'The beginning'} },
    ];
    const total = tiers.length;
    body.appendChild(el('div',{class:'sc-anodos__hd sc-stagger'},[
      el('span',{class:'sc-sec-lbl'}, L({gr:'Η Κλίμακα',en:'The Ladder'})),
      el('span',{class:'sc-anodos__run'}, L({gr:'Άνοδος',en:'Run'})+' #'+run+' · '+L({gr:'βαθμίδα',en:'tier'})+' '+r+'/'+total),
    ]));
    const ladder = el('div',{class:'sc-anodos sc-stagger has-accent', style:`--ca:${accent}`});
    tiers.forEach((t,i)=>{
      const fromBottom = total-1-i; // 0 = tartarus
      const st = fromBottom < r ? 'done' : fromBottom===r ? 'now' : 'lock';
      ladder.appendChild(el('div',{class:'sc-tier sc-tier--'+st},[
        el('span',{class:'sc-tier__node'}, st==='done'?'✓':st==='now'?'◆':'🔒'),
        el('div',{class:'sc-tier__b'},[
          editable('anodos_'+t.id, L(t), 'sc-tier__gr'),
          el('span',{class:'sc-tier__en'}, L(t.ch)),
        ]),
        el('span',{class:'sc-tier__rk'}, ['Ⅰ','Ⅱ','Ⅲ','Ⅳ','Ⅴ','Ⅵ','Ⅶ'][fromBottom]),
        st==='now'? el('button',{class:'sc-cta sc-cta--solid sc-tier__go', onclick:()=>{ const nr=Math.min(total, r+1); SymStore.set('anodos_reached', nr); symRender(); }}, L({gr:'Πρόκληση',en:'Challenge'})):null,
      ]));
    });
    body.appendChild(ladder);
    if(isAdmin()) body.appendChild(el('p',{class:'sc-hint sc-stagger'}, L({gr:'⚙ Διαχειριστής: άνοιξε «Επεξεργασία» (Tweaks → Role: Admin) για να μετονομάσεις βαθμίδες.',en:'⚙ Admin: turn on Edit to rename tiers.'})));
  };

  /* ══ TARTARUS REVIEW ══ (share · categorize · common mistakes · clear) */
  S.tartarus = function(home, ctx){
    const accent = '#B0395A';
    const body = P(home, { back:'home', accent, eyebrow:L({gr:'Μνημοσύνη · Spaced Repetition',en:'Mnemosyne · Spaced Repetition'}),
      title:'Tartarus Review', sub:L({gr:'Τα λάθη σου επιστρέφουν — μέχρι να τα κατακτήσεις.',en:'Your mistakes return — until you master them.'}),
      actions:[
        el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>shareModal()},[ el('span',{html:'⤴'}), L({gr:'Κοινοποίηση',en:'Share'}) ]),
        el('button',{class:'sc-cta sc-cta--solid', onclick:()=>SymPreview.open('flash',{title:'Tartarus Review'})},[ glyph('flame','sc-cta__gl'), L({gr:'Ξεκίνα ανασκόπηση',en:'Start review'}) ]),
      ] });
    body.appendChild(el('div',{class:'sc-stats sc-stagger'},[ stat('38',L({gr:'Προς ανασκόπηση',en:'Due today'}),accent), stat('7',L({gr:'Ημέρες σερί',en:'Day streak'}),accent), stat('214',L({gr:'Κατακτημένα',en:'Mastered'}),accent), stat('92%',L({gr:'Συγκράτηση',en:'Retention'}),accent) ]));

    // categorization
    body.appendChild(el('div',{class:'sc-cat sc-stagger'},[
      el('span',{class:'sc-cat__l'}, L({gr:'Κατηγορία:',en:'Category:'})),
      el('div',{class:'sc-fils'}, ['Όλα','Ανά μάθημα','Ανά τύπο','Πιο πρόσφατα','Πιο δύσκολα'].map((c,i)=>chip(c,i===0))),
    ]));

    // most common mistakes
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Πιο συχνά λάθη',en:'Most common mistakes'})));
    const mistakes = [
      { q:{gr:'Κλίση: λύομεν → ?',en:'Conjugate: λύομεν → ?'}, wrong:'λύωμεν', right:'λύομεν', n:14, cat:'Λύω' },
      { q:{gr:'Latin gen. sing. rosa → ?',en:'Latin gen. sing. rosa → ?'}, wrong:'rosā', right:'rosae', n:11, cat:'Latin' },
      { q:{gr:'Ποιος σκότωσε τον Έκτορα;',en:'Who slew Hector?'}, wrong:'Αἴας', right:'Ἀχιλλεύς', n:9, cat:'Ιλιάδα' },
      { q:{gr:'Μάχη Μαραθώνα: έτος;',en:'Battle of Marathon: year?'}, wrong:'480 π.Χ.', right:'490 π.Χ.', n:7, cat:'Ιστορία' },
    ];
    const mwrap = el('div',{class:'sc-mistakes sc-stagger has-accent', style:`--ca:${accent}`});
    mistakes.forEach(m=> mwrap.appendChild(el('div',{class:'sc-mis'},[
      el('span',{class:'sc-mis__n'}, m.n+'×'),
      el('div',{class:'sc-mis__b'},[ el('div',{class:'sc-mis__q'}, L(m.q)),
        el('div',{class:'sc-mis__ans'},[ el('span',{class:'sc-mis__wrong'}, '✗ '+m.wrong), el('span',{class:'sc-mis__right'}, '✓ '+m.right) ]) ]),
      pill(m.cat, accent),
      el('button',{class:'sc-mini', onclick:()=>SymPreview.open('flash',{title:m.cat})}, L({gr:'Εξάσκηση',en:'Drill'})),
    ])));
    body.appendChild(mwrap);

    // review schedule forecast (enrich)
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Πρόγραμμα επανάληψης',en:'Review schedule'})));
    const days = window.SYM_LANG==='en' ? ['Today','Tue','Wed','Thu','Fri','Sat','Sun'] : ['Σήμ','Τρί','Τετ','Πέμ','Παρ','Σάβ','Κυρ'];
    const due = [38,21,14,26,9,17,5];
    const max = Math.max(...due);
    const fc = el('div',{class:'sc-forecast sc-stagger has-accent', style:`--ca:${accent}`});
    due.forEach((n,i)=> fc.appendChild(el('div',{class:'sc-fc'},[
      el('span',{class:'sc-fc__n'}, n),
      el('div',{class:'sc-fc__barwrap'},[ el('span',{class:'sc-fc__bar'+(i===0?' today':''), style:`height:${Math.max(8,n/max*100)}%`}) ]),
      el('span',{class:'sc-fc__d'}, days[i]),
    ])));
    body.appendChild(fc);

    // decks + clear history
    body.appendChild(el('div',{class:'sc-tartbar sc-stagger'},[
      el('span',{class:'sc-sec-lbl', style:'margin:0'}, L({gr:'Σετ καρτών ανά θέμα',en:'Card sets by topic'})),
      el('button',{class:'sc-clear', onclick:(e)=>clearHistory(e.currentTarget)},[ el('span',{html:'⌫'}), L({gr:'Καθαρισμός ιστορικού',en:'Clear history'}) ]),
    ]));
    const decks = [['Ιλιάδα — Ήρωες','helmet',12],['Αρχαία — Ρήματα','column',9],['Ιστορία — Χρονολόγιο','acropolis',7],['Λατινικά — Κλίσεις','walls',6],['Οδύσσεια — Νησιά','trireme',4]];
    const grid = el('div',{class:'sc-decks has-accent', style:`--ca:${accent}`});
    decks.forEach(d=> grid.appendChild(el('a',{class:'sc-deck',href:'javascript:void 0', onclick:()=>SymPreview.open('flash',{title:d[0]})},[
      el('span',{class:'sc-deck__gl'},[ glyph(d[1],'sc-gl') ]),
      el('span',{class:'sc-deck__b'},[ el('span',{class:'sc-deck__t'}, d[0]), el('span',{class:'sc-deck__m'}, d[2]+' '+L({gr:'κάρτες προς επανάληψη',en:'cards to review'})) ]),
      el('span',{class:'sc-deck__due'}, d[2]),
    ])));
    body.appendChild(grid);

    function shareModal(){
      const ov = el('div',{class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
      const box = el('div',{class:'sc-share'});
      box.appendChild(el('div',{class:'sc-share__hd'},[ el('span',{},'⤴ '+L({gr:'Κοινοποίηση στον καθηγητή',en:'Share with teacher'})), el('button',{class:'pv-modal__x', onclick:()=>ov.remove(), html:'&times;'}) ]));
      box.appendChild(el('p',{class:'sc-share__sub'}, L({gr:'Στείλε τα λάθη σου για να σου ετοιμάσει στοχευμένη εξάσκηση.',en:'Send your mistakes so they can build targeted practice.'})));
      box.appendChild(el('div',{class:'sc-share__to'},[ el('span',{class:'sc-rcard__av'},'Κ'), el('div',{},[ el('b',{},'κ. Καραγιάννη'), el('span',{class:'sc-share__cls'},' · Β1 Γυμνασίου') ]) ]));
      box.appendChild(el('div',{class:'sc-share__opts'}, [
        {gr:'38 λάθη προς ανασκόπηση',en:'38 mistakes due'},{gr:'Πιο συχνά λάθη (4)',en:'Top mistakes (4)'},{gr:'Στατιστικά συγκράτησης',en:'Retention stats'}
      ].map((o,i)=> el('label',{class:'sc-share__opt'},[ el('input',{type:'checkbox', checked:i<2?'checked':null}), L(o) ]) )));
      box.appendChild(el('div',{class:'sc-share__foot'},[
        el('button',{class:'sc-mini'},'⎘ '+L({gr:'Αντιγραφή συνδέσμου',en:'Copy link'})),
        el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{ box.innerHTML=''; box.appendChild(el('div',{class:'sc-share__done'},[ el('span',{class:'sc-share__check'},'✓'), L({gr:'Στάλθηκε στον καθηγητή!',en:'Sent to your teacher!'}) ])); setTimeout(()=>ov.remove(),1200); }}, L({gr:'Αποστολή',en:'Send'})),
      ]));
      ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
      requestAnimationFrame(()=>ov.classList.add('in'));
      if(window.gsap) gsap.from(box,{y:20,scale:.97,autoAlpha:0,duration:.35,ease:'back.out(1.5)'});
    }
    function clearHistory(btn){
      if(btn.dataset.confirm){ btn.textContent='✓ '+L({gr:'Καθαρίστηκε',en:'Cleared'}); btn.classList.add('done');
        document.querySelectorAll('.sc-mis,.sc-deck').forEach((n,i)=>{ if(window.gsap) gsap.to(n,{autoAlpha:.25,duration:.3,delay:i*0.03}); });
        return; }
      btn.dataset.confirm='1'; btn.classList.add('confirm'); btn.innerHTML=''; btn.appendChild(el('span',{}, L({gr:'Σίγουρα; Πάτα ξανά',en:'Sure? Tap again'})));
      setTimeout(()=>{ if(btn.dataset.confirm && !btn.classList.contains('done')){ delete btn.dataset.confirm; btn.classList.remove('confirm'); btn.innerHTML='⌫ '+L({gr:'Καθαρισμός ιστορικού',en:'Clear history'}); } },2600);
    }
  };

  /* ══ ANATHESI · teacher console ══ */
  S.anathesi = function(home, ctx){
    const accent = '#2F6F8E';
    const tab = (ctx.param && ctx.param.tab) || 'overview';
    const klass = (ctx.param && ctx.param.klass) || 'Β1 Γυμνασίου';
    const body = P(home, { back:'home', accent, eyebrow:L({gr:'Κονσόλα Καθηγητή · Ανάθεση',en:'Teacher Console · Anathesi'}),
      title:L({gr:'Πίνακας Τάξης',en:'Class Dashboard'}), sub:L({gr:'Δημιούργησε εργασίες, δες αδυναμίες, παρακολούθησε πρόοδο.',en:'Create assignments, spot weak spots, track progress.'}),
      actions:[
        el('div',{class:'sc-classsel'},[ el('span',{class:'sc-classsel__l'}, L({gr:'Τμήμα',en:'Class'})),
          el('select',{class:'sc-field__i sc-select sc-classsel__s', onchange:(e)=>{ if(e.target.value==='__new'){ const nm=prompt(L({gr:'Όνομα νέας τάξης:',en:'New class name:'}),'Α1 Γυμνασίου'); if(nm){ const cur=SymStore.get('teacher_classes',[]); cur.push(nm); SymStore.set('teacher_classes',cur); go('anathesi',{tab,klass:nm}); } else { go('anathesi',{tab,klass}); } } else go('anathesi',{tab,klass:e.target.value}); }},
            ['Β1 Γυμνασίου','Β2 Γυμνασίου','Γ2 Γυμνασίου','Γ Λυκείου'].concat(SymStore.get('teacher_classes',[])).map(c=>el('option',{selected:c===klass?'selected':null}, c)).concat([el('option',{value:'__new'}, '＋ '+L({gr:'Νέα τάξη…',en:'New class…'}))])) ]),
        el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>wizard()},[ '＋ ', L({gr:'Νέα Ανάθεση',en:'New assignment'}) ]),
      ] });

    // seats bar
    body.appendChild(el('div',{class:'sc-seats sc-stagger has-accent', style:`--ca:${accent}`},[
      el('div',{class:'sc-seats__b'},[ el('span',{class:'sc-seats__l'}, L({gr:'Θέσεις τάξης',en:'Class seats'})), el('div',{class:'sc-seats__bar'},[ el('span',{class:'sc-seats__fill',style:'width:75%'}) ]) ]),
      el('span',{class:'sc-seats__t'}, '18 / 24 '+L({gr:'σε χρήση',en:'used'})),
    ]));

    // tabs
    const tabs = [['overview',{gr:'Επισκόπηση',en:'Overview'}],['assign',{gr:'Αναθέσεις',en:'Assignments'}],['students',{gr:'Μαθητές',en:'Students'}],['reports',{gr:'Αδυναμίες',en:'Weak spots'}]];
    body.appendChild(el('div',{class:'sc-subtabs sc-stagger'}, tabs.map(([id,lab])=> el('button',{class:'sc-subtab'+(id===tab?' active':''), onclick:()=>go('anathesi',{tab:id,klass})}, L(lab)))));

    if(tab==='overview'){
      body.appendChild(el('div',{class:'sc-stats sc-stagger'},[ stat('24',L({gr:'Μαθητές',en:'Students'}),accent), stat('5',L({gr:'Ενεργές αναθ.',en:'Active'}),accent), stat('78%',L({gr:'Παράδοση',en:'Turn-in'}),accent), stat('71%',L({gr:'Μ.Ο. σκορ',en:'Avg score'}),accent) ]));
      body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Πρόσφατη δραστηριότητα',en:'Recent activity'})));
      [['✓','Μαρία Κ. ολοκλήρωσε «Ιλιάδα Trivia»','5′'],['⚡','Live Arena: 22 παίκτες','1ω'],['⚠','Νίκος Δ. — χαμηλό σκορ στα Ρήματα','2ω'],['＋','Νέα ανάθεση: Λατινικά Κλίσεις','3ω']].forEach(a=>
        body.appendChild(el('div',{class:'sc-act sc-stagger'},[ el('span',{class:'sc-act__ic'}, a[0]), el('span',{class:'sc-act__t'}, a[1]), el('span',{class:'sc-act__tm'}, a[2]) ])));
    }
    else if(tab==='assign'){
      const rows = [['Ιλιάδα — Trivia Επ.3','22/24','open'],['Ρήματα — Κλίση','18/26','open'],['Ιστορία — Quiz','30/30','done'],['Λατινικά — Κατάταξη','9/21','late']];
      const tbl = el('div',{class:'sc-table sc-stagger has-accent', style:`--ca:${accent}`});
      tbl.appendChild(el('div',{class:'sc-tr sc-tr--h'},[ el('span',{},L({gr:'Εργασία',en:'Task'})), el('span',{},L({gr:'Παράδοση',en:'Turn-in'})), el('span',{},L({gr:'Κατάσταση',en:'Status'})), el('span',{},'') ]));
      rows.forEach(r=> tbl.appendChild(el('div',{class:'sc-tr'},[
        el('span',{class:'sc-tr__task'}, r[0]), el('span',{}, r[1]),
        el('span',{}, el('em',{class:'sc-badge2 sc-badge2--'+r[2]}, r[2]==='done'?L({gr:'Ολοκληρώθηκε',en:'Done'}):r[2]==='late'?L({gr:'Εκπρόθεσμη',en:'Late'}):L({gr:'Ανοιχτή',en:'Open'}))),
        el('span',{class:'sc-tr__acts'},[ el('button',{class:'sc-mini', onclick:()=>SymPreview.open('mc',{title:r[0]})}, L({gr:'Προβολή',en:'View'})) ]),
      ])));
      body.appendChild(tbl);
    }
    else if(tab==='students'){
      const names=['Αλέξης Π.','Μαρία Κ.','Νίκος Δ.','Ελένη Σ.','Γιώργος Μ.','Σοφία Ρ.','Δημήτρης Α.','Κατερίνα Ν.'].concat(SymStore.get('teacher_students',[]));
      body.appendChild(el('div',{class:'sc-students__bar sc-stagger'},[
        el('input',{class:'sc-search', placeholder:L({gr:'Αναζήτηση μαθητή…',en:'Search student…'})}),
        el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>SymPreview.open('mc',{title:L({gr:'Κωδικός τάξης: A7K92M',en:'Class code: A7K92M'}), note:L({gr:'Οι μαθητές μπαίνουν με κωδικό ή σύνδεσμο.',en:'Students join with a code or link.'})})},[ '⤴ ', L({gr:'Πρόσκληση',en:'Invite'}) ]),
        el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{ const nm=prompt(L({gr:'Όνομα μαθητή:',en:'Student name:'}),''); if(nm){ const cur=SymStore.get('teacher_students',[]); cur.push(nm); SymStore.set('teacher_students',cur); symRender(); } }},[ '＋ ', L({gr:'Προσθήκη μαθητή',en:'Add student'}) ]),
      ]));
      const grid=el('div',{class:'sc-roster sc-stagger'});
      names.forEach((n,i)=>{ const acc=[88,76,93,71,64,82,59,90][i%8];
        grid.appendChild(el('div',{class:'sc-rcard'},[ el('span',{class:'sc-rcard__av', style:`--ca:${accent}`}, n[0]),
          el('div',{class:'sc-rcard__b'},[ el('span',{class:'sc-rcard__n'}, n), el('span',{class:'sc-rcard__m'}, L({gr:'Ακρίβεια',en:'Accuracy'})+' '+acc+'%') ]),
          el('span',{class:'sc-rcard__badge'+(acc<70?' low':'')}, acc<70?'⚠':'✓'),
          el('button',{class:'sc-mini', onclick:()=>go('tartarus')}, L({gr:'Λάθη',en:'Mistakes'})) ])); });
      body.appendChild(grid);
    }
    else if(tab==='reports'){
      body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Θερμικός χάρτης αδυναμιών',en:'Weak-spot heatmap'})));
      const topics=['Ρήματα','Συντακτικό','Ιλιάδα','Ιστορία','Λατ. κλίση','Λεξιλόγιο'];
      const names=['Αλέξης','Μαρία','Νίκος','Ελένη','Γιώργος'];
      const heat=el('div',{class:'sc-heat sc-stagger has-accent', style:`--ca:${accent}`});
      heat.appendChild(el('div',{class:'sc-heat__row sc-heat__row--h'},[ el('span',{}), ...topics.map(t=>el('span',{class:'sc-heat__th'}, t)) ]));
      names.forEach((n,ri)=>{ const row=el('div',{class:'sc-heat__row'},[ el('span',{class:'sc-heat__name'}, n) ]);
        topics.forEach((_,ci)=>{ const v=(ri*7+ci*13+5)%100; row.appendChild(el('span',{class:'sc-heat__c', title:v+'%', style:`background:color-mix(in srgb, ${v<40?'#c2553a':v<70?'var(--gold)':'var(--sage)'} ${30+v*0.5}%, transparent)`}, v)); });
        heat.appendChild(row); });
      body.appendChild(heat);
      body.appendChild(el('p',{class:'sc-hint sc-stagger'}, L({gr:'Πάτα ένα κελί για να αναθέσεις στοχευμένη εξάσκηση.',en:'Tap a cell to assign targeted practice.'})));
    }

    function wizard(){
      const ov=el('div',{class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
      const box=el('div',{class:'sc-wiz'});
      let s=0; const steps=[
        {t:{gr:'Διάλεξε παιχνίδι',en:'Pick a game'}, body:()=>el('div',{class:'sc-wiz__grid'}, SY.ENGINES.slice(0,6).map(e=>el('button',{class:'sc-wiz__pick', onclick:()=>next()},[ glyph(e.illu,'sc-wiz__gl'), L(e) ])))},
        {t:{gr:'Διάλεξε ύλη',en:'Pick content'}, body:()=>el('div',{class:'sc-wiz__list'}, ['Ραψωδία Α','Ραψωδία Β','Όλη η Ιλιάδα','Προσαρμοσμένο'].map(c=>el('button',{class:'sc-wiz__row', onclick:()=>next()}, c)))},
        {t:{gr:'Ρύθμισε & ανάθεσε',en:'Configure & assign'}, body:()=>el('div',{class:'sc-wiz__cfg'},[ el('p',{}, L({gr:'Προθεσμία, επίπεδα, βαθμολογία…',en:'Deadline, levels, scoring…'})), el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{ box.innerHTML=''; box.appendChild(el('div',{class:'sc-share__done'},[ el('span',{class:'sc-share__check'},'✓'), L({gr:'Η ανάθεση στάλθηκε!',en:'Assignment sent!'}) ])); setTimeout(()=>{ ov.remove(); go('anathesi',{tab:'assign',klass}); },1100); }}, L({gr:'Ανάθεση στην τάξη',en:'Assign to class'})) ])},
      ];
      function paintW(){ box.innerHTML='';
        box.appendChild(el('div',{class:'sc-wiz__bar'},[ el('div',{class:'sc-wiz__steps'}, steps.map((_,i)=>el('span',{class:'sc-wiz__dot'+(i<=s?' on':'')}))), el('button',{class:'pv-modal__x', onclick:()=>ov.remove(), html:'&times;'}) ]));
        box.appendChild(el('div',{class:'sc-wiz__ttl'}, L(steps[s].t)));
        box.appendChild(steps[s].body());
        if(window.injectIllus) injectIllus(box);
      }
      function next(){ if(s<steps.length-1){ s++; paintW(); } }
      paintW(); ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
      requestAnimationFrame(()=>ov.classList.add('in'));
      if(window.gsap) gsap.from(box,{y:20,scale:.97,autoAlpha:0,duration:.35,ease:'back.out(1.5)'});
    }
  };

  /* ══ ADMIN ══ (fully interactive: rail + switching detail panes) */
  S.admin = function(home, ctx){
    const accent = '#6E8B3D';
    const body = P(home, { back:'home', accent, eyebrow:L({gr:'Κέντρο Διοίκησης',en:'Command Center'}),
      title:L({gr:'Διαχείριση',en:'Admin'}), sub:L({gr:'Πλήρως διαδραστικό — δες τι δουλεύει.',en:'Fully interactive — see what works.'}) });
    body.appendChild(el('div',{class:'sc-stats sc-stats--4 sc-stagger'},[ stat('3.218',L({gr:'Χρήστες',en:'Users'}),accent), stat('1.094',L({gr:'Συνδρομές',en:'Subscribers'}),accent), stat('€5.4k','MRR',accent), stat('41',L({gr:'Παιχνίδια',en:'Games'}),accent) ]));

    const shell = el('div',{class:'sc-admin2 sc-stagger has-accent', style:`--ca:${accent}`});
    const rail = el('div',{class:'sc-admin2__rail'});
    const pane = el('div',{class:'sc-admin2__pane'});
    const sections = [
      ['overview','◷',{gr:'Επισκόπηση',en:'Overview'}],
      ['grant','✦',{gr:'Χορήγηση Πρόσβασης',en:'Grant Access'}],
      ['users','◆',{gr:'Χρήστες',en:'Users'}],
      ['access','◫',{gr:'Έλεγχος Πρόσβασης',en:'Access Control'}],
      ['pricing','€',{gr:'Τιμολόγηση',en:'Pricing'}],
      ['discounts','%',{gr:'Εκπτωτικοί Κωδικοί',en:'Discount Codes'}],
      ['subs','◷',{gr:'Συνδρομές',en:'Subscriptions'}],
      ['studio','✎',{gr:'Studio (Περιεχόμενο)',en:'Studio (Content)'}],
      ['realm','⛩',{gr:'Curator · Ἀγορά',en:'Curator · Realm'}],
      ['games','▦',{gr:'Παιχνίδια (QA)',en:'Games (QA)'}],
      ['tags','#',{gr:'Ετικέτες Παιχνιδιών',en:'Game Tags'}],
      ['rewards','⬆',{gr:'Ανταμοιβές Επιπέδων',en:'Level Rewards'}],
      ['tartarus','❂',{gr:'Tartarus',en:'Tartarus'}],
      ['banners','◰',{gr:'Banners',en:'Banners'}],
      ['messaging','✉',{gr:'Μηνύματα',en:'Messages'}],
      ['hero','◳',{gr:'Hero Carousel',en:'Hero Carousel'}],
      ['about','ⓘ',{gr:'Σχετικά',en:'About'}],
      ['feedback','☆',{gr:'Σχόλια',en:'Feedback'}],
      ['guides','☰',{gr:'Οδηγοί',en:'Guides'}],
      ['atlas','⌘',{gr:'Atlas · Έκτακτα',en:'Atlas · Emergency'}],
      ['settings','⚙',{gr:'Ρυθμίσεις',en:'Settings'}],
    ];
    let activeSec = window.__adminSec || 'overview';
    sections.forEach(([id,ic,lab])=> rail.appendChild(railBtn(id,ic,lab)));
    function railBtn(id,ic,lab){ return el('button',{class:'sc-admin2__nav'+(id===activeSec?' active':''), 'data-s':id, onclick:()=>{ activeSec=id; window.__adminSec=id; rail.querySelectorAll('.sc-admin2__nav').forEach(b=>b.classList.toggle('active', b.dataset.s===id)); paint(); }},[ el('span',{class:'sc-admin2__ic'}, ic), L(lab) ]); }
    (SymStore.get('admin_custom_secs', [])).forEach(s=>{ sections.push([s.id,'◦',{gr:s.nm,en:s.nm}]); rail.appendChild(railBtn(s.id,'◦',{gr:s.nm,en:s.nm})); });
    // add/edit the sidebar
    rail.appendChild(el('div',{class:'sc-admin2__railfoot'},[
      el('button',{class:'sc-admin2__add', onclick:()=>{
        const nm = prompt(L({gr:'Όνομα νέας ενότητας:',en:'New section name:'}), L({gr:'Νέα ενότητα',en:'New section'}));
        if(nm){ const cur=SymStore.get('admin_custom_secs',[]); const id='custom_'+Date.now(); cur.push({id,nm}); SymStore.set('admin_custom_secs',cur); window.__adminSec=id; symRender(); }
      }},[ el('span',{class:'sc-admin2__ic'}, '＋'), L({gr:'Νέα ενότητα',en:'Add section'}) ]),
      el('button',{class:'sc-admin2__add', onclick:()=>{ window.__adminRailEdit=!window.__adminRailEdit; symRender(); }},[ el('span',{class:'sc-admin2__ic'}, '✎'), window.__adminRailEdit?L({gr:'Τέλος',en:'Done'}):L({gr:'Επεξεργασία',en:'Edit'}) ]),
    ]));
    if(window.__adminRailEdit){ rail.querySelectorAll('.sc-admin2__nav').forEach(b=>{ b.classList.add('editing'); const x=el('span',{class:'sc-admin2__del', onclick:(e)=>{ e.stopPropagation(); const cur=SymStore.get('admin_custom_secs',[]).filter(s=>s.id!==b.dataset.s); SymStore.set('admin_custom_secs',cur); symRender(); }}, '×'); b.appendChild(x); }); }
    shell.appendChild(rail); shell.appendChild(pane);
    body.appendChild(shell);

    function toggleRow(label, on){
      const t = el('button',{class:'sc-toggle'+(on?' on':''), onclick:(e)=>e.currentTarget.classList.toggle('on')},[ el('span',{class:'sc-toggle__k'}) ]);
      return el('div',{class:'sc-adrow'},[ el('span',{}, L(label)), t ]);
    }
    function field2(label, ph){ return el('label',{class:'sc-field'},[ el('span',{class:'sc-field__l'}, label), el('input',{class:'sc-field__i', placeholder:ph}) ]); }
    function rowSel(label, opts){ const s=el('select',{class:'sc-field__i sc-select'}, opts.map(o=>el('option',{}, o))); return el('label',{class:'sc-field'},[ el('span',{class:'sc-field__l'}, label), s ]); }
    function atlasRow(ic, label, on){ return el('div',{class:'sc-adrow'},[ el('span',{},[ el('span',{style:'margin-right:8px'}, ic), label ]), el('button',{class:'sc-toggle'+(on?' on':''), onclick:(e)=>e.currentTarget.classList.toggle('on')},[ el('span',{class:'sc-toggle__k'}) ]) ]); }
    function msgEditor(key, label, def){
      const wrap=el('div',{class:'sc-msg'});
      wrap.appendChild(el('div',{class:'sc-cfg__l'}, L(label)));
      const ta=el('textarea',{class:'sc-textarea', rows:'3'}, SymStore.get(key, def));
      ta.addEventListener('blur', ()=>SymStore.set(key, ta.value));
      wrap.appendChild(ta);
      const row=el('div',{class:'sc-msg__foot'},[
        el('button',{class:'sc-mini', onclick:()=>SymPreview.open('mc',{title:L({gr:'Προεπισκόπηση',en:'Preview'}), note:(ta.value||def).replace('{name}','Μαρία').replace('{plan}','Pro').replace('{expiry}','12/2026')})}, L({gr:'Προεπισκόπηση',en:'Preview'})),
        el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{ SymStore.set(key, ta.value); }}, L({gr:'Αποθήκευση',en:'Save'})),
      ]);
      wrap.appendChild(row);
      return wrap;
    }
    function aboutField(key, label, def, multi){
      const wrap=el('div',{class:'sc-msg'});
      wrap.appendChild(el('div',{class:'sc-cfg__l'}, L(label)));
      const inp = multi ? el('textarea',{class:'sc-textarea', rows:'3'}, SymStore.get(key, def)) : el('input',{class:'sc-field__i', value:SymStore.get(key, def)});
      inp.addEventListener('blur', ()=>SymStore.set(key, multi?inp.value:inp.value));
      wrap.appendChild(inp);
      return wrap;
    }
    function renderRewardsAdmin(pane){
      pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Ανταμοιβές Επιπέδων',en:'Level Rewards'})));
      pane.appendChild(el('p',{class:'sc-hint', style:'margin:0 0 10px'}, L({gr:'Οι ανταμοιβές ορίζονται εδώ. Η οθόνη «Level Up» τις διαβάζει από αυτή τη λίστα — άλλαξέ τες χωρίς deploy.',en:'Rewards are defined here. The Level-Up screen reads them from this ladder — edit without a deploy.'})));
      let data = JSON.parse(JSON.stringify(window.SYM.levelLadder()));
      const ICONS=['◆','❧','⛩','✦','⌾','✶','⚡','◈'];
      const TYPES=[['theme',{gr:'Θέμα',en:'Theme'}],['cursor',{gr:'Δείκτης',en:'Cursor'}],['acro',{gr:'Ακρωτήριο',en:'Acroterion'}],['avatar',{gr:'Avatar',en:'Avatar'}],['kleos',{gr:'Kleos',en:'Kleos'}],['title',{gr:'Τίτλος',en:'Title'}]];
      const wrap = el('div',{class:'sc-rewards'});
      pane.appendChild(wrap);
      function save(){ SymStore.set('level_rewards', data); }
      function rewardOptions(type){
        const P=(pfx,arr)=>arr.map(n=>pfx+n);
        if(type==='theme') return P('Θέμα: ', (window.SYM_THEMES||[]).map(t=>t.nm));
        if(type==='cursor') return P('Δείκτης: ', ['Δάφνη','Γραφίδα','Γλαύκα','Στέφανος','Τρίαινα','Σταυρόνημα','Ρόμβος','Κουκκίδα','Στόχαστρο']);
        if(type==='acro') return P('Ακρωτήριο: ', (window.SYM.ACROTERIA||[]).map(a=>L(a)));
        if(type==='avatar') return P('Avatar: ', (window.SYM.AVATARS||[]).map(a=>L(a)));
        if(type==='title') return P('Τίτλος: ', (window.SYM.TITLES||[]).map(t=>L(t)));
        if(type==='kleos') return ['+100 Kleos','+200 Kleos','+300 Kleos','+500 Kleos','+1.000 Kleos','+2.000 Kleos'];
        return [];
      }
      function paintR(){
        wrap.innerHTML='';
        data.sort((a,b)=>a.lv-b.lv);
        data.forEach((entry,ei)=>{
          const card = el('div',{class:'sc-rwd'});
          card.appendChild(el('div',{class:'sc-rwd__h'},[
            el('span',{class:'sc-rwd__lv'},[ el('small',{}, L({gr:'Επ.',en:'Lv'})), el('input',{class:'sc-rwd__lvi', type:'number', value:entry.lv, onchange:(e)=>{ entry.lv=parseInt(e.target.value,10)||entry.lv; save(); }}) ]),
            el('input',{class:'sc-rwd__ttl', value:L(entry.title), placeholder:L({gr:'Τίτλος επιπέδου',en:'Level title'}), onchange:(e)=>{ entry.title={gr:e.target.value,en:e.target.value}; save(); }}),
            el('button',{class:'sc-rwd__del', title:L({gr:'Διαγραφή επιπέδου',en:'Remove level'}), onclick:()=>{ data.splice(ei,1); save(); paintR(); }, html:'&times;'}),
          ]));
          const rl = el('div',{class:'sc-rwd__list'});
          (entry.rewards||[]).forEach((r,ri)=>{
            rl.appendChild(el('div',{class:'sc-rwd__row'},[
              el('button',{class:'sc-rwd__ic', title:L({gr:'Αλλαγή εικονιδίου',en:'Cycle icon'}), onclick:(e)=>{ const i=ICONS.indexOf(r.ic); r.ic=ICONS[(i+1)%ICONS.length]; e.currentTarget.textContent=r.ic; save(); }}, r.ic||'✦'),
              (function(){ const opts=rewardOptions(r.type); const cur=L(r.t); const all=(opts.indexOf(cur)<0?[cur].concat(opts):opts); return el('select',{class:'sc-field__i sc-select sc-rwd__lbl', onchange:(e)=>{ r.t={gr:e.target.value,en:e.target.value}; save(); }}, all.map(o=>el('option',{value:o, selected:o===cur?'selected':null}, o))); })(),
              el('select',{class:'sc-field__i sc-select sc-rwd__type', onchange:(e)=>{ r.type=e.target.value; const o=rewardOptions(r.type); if(o.length) r.t={gr:o[0],en:o[0]}; save(); paintR(); }}, TYPES.map(([v,t])=>el('option',{value:v, selected:r.type===v?'selected':null}, L(t)))),
              el('button',{class:'sc-rwd__x', title:L({gr:'Διαγραφή',en:'Remove'}), onclick:()=>{ entry.rewards.splice(ri,1); save(); paintR(); }, html:'&times;'}),
            ]));
          });
          rl.appendChild(el('button',{class:'sc-rwd__addr', onclick:()=>{ entry.rewards=entry.rewards||[]; entry.rewards.push({ic:'✦',type:'theme',t:{gr:'Νέα ανταμοιβή',en:'New reward'}}); save(); paintR(); }},[ el('span',{html:'&#43; '}), L({gr:'Ανταμοιβή',en:'Reward'}) ]));
          card.appendChild(rl);
          wrap.appendChild(card);
        });
      }
      paintR();
      pane.appendChild(el('div',{class:'sc-rwd__foot'},[
        el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>{ data.push({lv:(data.reduce((m,e)=>Math.max(m,e.lv),0)+1), title:{gr:'Νέο επίπεδο',en:'New level'}, rewards:[]}); save(); paintR(); }},[ el('span',{html:'&#43; '}), L({gr:'Νέο επίπεδο',en:'Add level'}) ]),
        el('button',{class:'sc-mini', onclick:()=>{ SymStore.set('level_rewards', null); data=JSON.parse(JSON.stringify(window.SYM.LEVEL_REWARDS)); paintR(); }}, L({gr:'Επαναφορά',en:'Reset'})),
        el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{ save(); symRender(); }}, L({gr:'Αποθήκευση',en:'Save'})),
      ]));
    }
    function paint(){
      pane.innerHTML='';
      if(activeSec==='overview'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Πρόσφατη δραστηριότητα',en:'Recent activity'})));
        [['＋','Νέα εγγραφή · Μαρία Κ.','2′'],['⚡','Live Arena ξεκίνησε · Β1','11′'],['◆','Αναβάθμιση σε Pro · Νίκος Π.','24′'],['❂','Ανασκόπηση Tartarus · 38 κάρτες','1ω'],['❖','Νέα ανάθεση · Γ Λυκείου','2ω']].forEach(a=>
          pane.appendChild(el('div',{class:'sc-act'},[ el('span',{class:'sc-act__ic'}, a[0]), el('span',{class:'sc-act__t'}, a[1]), el('span',{class:'sc-act__tm'}, a[2]) ])));
      }
      else if(activeSec==='users'){
        pane.appendChild(el('input',{class:'sc-search', placeholder:L({gr:'Αναζήτηση χρήστη…',en:'Search user…'}), oninput:(e)=>{ const q=e.target.value.toLowerCase(); pane.querySelectorAll('.sc-tr:not(.sc-tr--h)').forEach(r=>{ r.style.display = r.textContent.toLowerCase().includes(q)?'':'none'; }); }}));
        const tbl=el('div',{class:'sc-table'});
        tbl.appendChild(el('div',{class:'sc-tr sc-tr--h'},[el('span',{},L({gr:'Όνομα',en:'Name'})),el('span',{},'Email'),el('span',{},L({gr:'Πλάνο',en:'Plan'})),el('span',{},L({gr:'Ενέργειες',en:'Actions'}))]));
        [['Μαρία Κ.','maria@…','Pro'],['Νίκος Π.','nikos@…','Free'],['Ελένη Σ.','eleni@…','Pro'],['Γιώργος Μ.','giorgos@…','Free'],['Σοφία Ρ.','sofia@…','Pro']].forEach(u=>
          tbl.appendChild(el('div',{class:'sc-tr'},[ el('span',{class:'sc-tr__task'},u[0]), el('span',{},u[1]), el('span',{}, el('em',{class:'sc-badge2 sc-badge2--'+(u[2]==='Pro'?'done':'open')}, u[2])), el('span',{class:'sc-tr__acts'},[ el('button',{class:'sc-mini'},L({gr:'Προβολή',en:'View'})), el('button',{class:'sc-mini sc-mini--accent'},L({gr:'Επεξεργασία',en:'Edit'})) ]) ])));
        pane.appendChild(tbl);
      }
      else if(activeSec==='games'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Έλεγχος περιεχομένου — πάτα για προεπισκόπηση & εντοπισμό λαθών',en:'Content QA — click to preview & spot mistakes'})));
        pane.appendChild(el('div',{class:'sc-refreshbar'},[ el('button',{class:'sc-refresh', onclick:()=>{ if(window.SymTags) SymTags.refresh(); paint(); }},[ el('span',{class:'sc-refresh__ic',html:'↻'}), L({gr:'Ανανέωση για νέα',en:'Refresh for new'}) ]) ]));
        const g=el('div',{class:'sc-admin__games'});
        SY.ENGINES.forEach(e=> g.appendChild(el('button',{class:'sc-admin__game', onclick:()=>SymPreview.open(SymPreview.typeFor(e),{title:L(e), illu:e.illu, note:L({gr:'Έλεγξε ερωτήσεις & απαντήσεις για λάθη.',en:'Check questions & answers for mistakes.'}),
          tools: el('div',{class:'pv-seg'}, ['mc','grammar-verb','grammar-noun'].map((ty,i)=>el('button',{class:(i===0?'active':''), onclick:(ev)=>{ const fr=document.querySelector('.pv-frame'); fr.innerHTML=''; fr.appendChild(SymPreview.scene(ty,{title:L(e)})); ev.currentTarget.parentNode.querySelectorAll('button').forEach(b=>b.classList.remove('active')); ev.currentTarget.classList.add('active'); }}, ty==='mc'?'Quiz':ty==='grammar-verb'?'Λύω':'Latin'))) })},[
          glyph(e.illu,'sc-admin__gicon'), el('span',{}, L(e)), el('span',{class:'sc-admin__qa'},'QA') ])));
        pane.appendChild(g);
      }
      else if(activeSec==='tags'){
        if(window.SymTags) window.SymTags.renderAdmin(pane, {accent});
        else pane.appendChild(el('p',{class:'sc-hint'}, 'Tags module not loaded.'));
      }
      else if(activeSec==='rewards'){
        renderRewardsAdmin(pane);
      }
      else if(activeSec==='subs'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Συνδρομές & Πακέτα',en:'Subscriptions & Bundles'})));
        pane.appendChild(el('div',{class:'sc-stats'},[ stat('1.094',L({gr:'Ενεργές',en:'Active'}),accent), stat('€5.4k','MRR',accent), stat('3.1%',L({gr:'Churn',en:'Churn'}),accent) ]));
        const defPlans=[ {id:'student',nm:'Μαθητής',price:'4.99',n:'892'}, {id:'teacher',nm:'Καθηγητής',price:'7.99',n:'160'}, {id:'school',nm:'School',price:'49',n:'17'} ];
        const customPlans=SymStore.get('admin_plans',[]);
        pane.appendChild(el('div',{class:'sc-sec-lbl', style:'margin:14px 0 8px'}, L({gr:'Πακέτα',en:'Plans'})));
        const ptbl=el('div',{class:'sc-table'});
        ptbl.appendChild(el('div',{class:'sc-tr sc-tr--h'},[el('span',{},L({gr:'Πακέτο',en:'Plan'})),el('span',{},'€/'+L({gr:'μήνα',en:'mo'})),el('span',{},L({gr:'Συνδρομές',en:'Subs'})),el('span',{},'')]));
        defPlans.concat(customPlans).forEach((p,i)=> ptbl.appendChild(el('div',{class:'sc-tr'},[
          el('span',{class:'sc-tr__task'}, p.nm), el('span',{}, el('input',{class:'sc-price', value:p.price})), el('span',{}, p.n||'—'),
          el('span',{class:'sc-tr__acts'},[ el('button',{class:'sc-mini'+(i<3?' off':''), onclick:()=>{ if(i>=3){ const c=customPlans.filter((_,j)=>j!==i-3); SymStore.set('admin_plans',c); symRender(); } }}, L({gr:'Διαγραφή',en:'Delete'})) ]),
        ])));
        pane.appendChild(ptbl);
        pane.appendChild(el('div',{class:'sc-form', style:'margin-top:12px'},[
          el('div',{class:'sc-cfg__l'}, L({gr:'Νέο πακέτο',en:'New plan'})),
          el('div',{style:'display:flex;gap:8px;flex-wrap:wrap'},[
            el('input',{class:'sc-field__i', id:'newPlanNm', placeholder:L({gr:'Όνομα (π.χ. Οικογενειακό)',en:'Name (e.g. Family)'}), style:'flex:2;min-width:160px'}),
            el('input',{class:'sc-field__i', id:'newPlanPr', placeholder:'€ / '+L({gr:'μήνα',en:'mo'}), style:'flex:1;min-width:90px'}),
            el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{ const nm=document.getElementById('newPlanNm').value.trim(), pr=document.getElementById('newPlanPr').value.trim(); if(nm){ const c=SymStore.get('admin_plans',[]); c.push({id:'pl'+Date.now(),nm,price:pr||'0'}); SymStore.set('admin_plans',c); symRender(); } }}, L({gr:'Πρόσθεσε',en:'Add'})),
          ]),
        ]));
        pane.appendChild(el('div',{class:'sc-sec-lbl', style:'margin:18px 0 8px'}, L({gr:'Bundles',en:'Bundles'})));
        const defBundles=[ {nm:'3 μήνες',off:'−13%'}, {nm:'6 μήνες',off:'−27%'}, {nm:'12 μήνες',off:'−40%'} ];
        const customB=SymStore.get('admin_bundles',[]);
        const bwrap=el('div',{class:'sc-bundles'});
        defBundles.concat(customB).forEach((b,i)=> bwrap.appendChild(el('div',{class:'sc-bundle'},[ el('b',{}, b.nm), el('span',{class:'sc-bundle__off'}, b.off), (i>=3?el('button',{class:'sc-bundle__x', onclick:()=>{ const c=customB.filter((_,j)=>j!==i-3); SymStore.set('admin_bundles',c); symRender(); }, html:'×'}):null) ])));
        bwrap.appendChild(el('button',{class:'sc-bundle sc-bundle--add', onclick:()=>{ const nm=prompt(L({gr:'Όνομα bundle (π.χ. 24 μήνες):',en:'Bundle name (e.g. 24 months):'})); if(nm){ const off=prompt(L({gr:'Έκπτωση (π.χ. −50%):',en:'Discount (e.g. −50%):'}),'−50%')||''; const c=SymStore.get('admin_bundles',[]); c.push({nm,off}); SymStore.set('admin_bundles',c); symRender(); } }},[ '＋ ', L({gr:'Νέο bundle',en:'New bundle'}) ]));
        pane.appendChild(bwrap);
      }
      else if(activeSec==='messaging'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Πρότυπα Μηνυμάτων',en:'Message Templates'})));
        pane.appendChild(msgEditor('msg_signup', {gr:'Μήνυμα εγγραφής (welcome)',en:'Sign-up welcome message'}, 'Καλώς ήρθες στο SymposiON, {name}! Ο αρχαίος κόσμος σε περιμένει — ξεκίνα το πρώτο σου παιχνίδι και κέρδισε Kleos.'));
        pane.appendChild(msgEditor('msg_sub', {gr:'Μήνυμα συνδρομής (μετά την πληρωμή)',en:'Subscription confirmation message'}, 'Ευχαριστούμε για τη συνδρομή σου, {name}! Η πρόσβαση Pro είναι ενεργή. Καλή μάθηση & καλό παιχνίδι!'));
        pane.appendChild(el('p',{class:'sc-hint'}, L({gr:'Διαθέσιμες μεταβλητές: {name}, {plan}, {expiry}',en:'Available variables: {name}, {plan}, {expiry}'})));
      }
      else if(activeSec==='hero'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Hero Carousel — διαφάνειες αρχικής',en:'Hero Carousel — homepage slides'})));
        const slides = SymStore.get('hero_slides', null) || (window.SYM.SHOWCASE||[]).map(s=>({ kind:s.kind, illu:s.illu, tgr:L(s.t), dgr:L(s.d) }));
        const list=el('div',{class:'sc-slides'});
        function paintSlides(){
          list.innerHTML='';
          slides.forEach((s,i)=> list.appendChild(el('div',{class:'sc-slide'},[
            el('button',{class:'sc-slide__ic', onclick:()=>{ const ic=prompt(L({gr:'Εικονίδιο:',en:'Icon name:'}), s.illu); if(ic){ s.illu=ic; save(); } }},[ glyph(s.illu,'sc-gl') ]),
            el('div',{class:'sc-slide__b'},[
              el('div',{style:'display:flex;gap:8px'},[
                el('select',{class:'sc-field__i sc-select', style:'width:auto', onchange:(e)=>{ s.kind=e.target.value; save(); }},[ el('option',{value:'mode',selected:s.kind==='mode'?'selected':null},'Mode'), el('option',{value:'news',selected:s.kind==='news'?'selected':null},'News') ]),
                el('input',{class:'sc-field__i', value:s.tgr||s.t&&L(s.t)||'', oninput:(e)=>{ s.tgr=e.target.value; }, onblur:save, placeholder:L({gr:'Τίτλος',en:'Title'}) }),
              ]),
              el('input',{class:'sc-field__i', value:s.dgr||s.d&&L(s.d)||'', oninput:(e)=>{ s.dgr=e.target.value; }, onblur:save, placeholder:L({gr:'Περιγραφή',en:'Description'}) }),
            ]),
            el('button',{class:'sc-slide__del', onclick:()=>{ slides.splice(i,1); save(); paintSlides(); }, html:'×'}),
          ])));
          if(window.injectIllus) injectIllus(list);
        }
        function save(){ SymStore.set('hero_slides', slides.map(s=>({ kind:s.kind||'mode', illu:s.illu, t:{gr:s.tgr||'',en:s.tgr||''}, d:{gr:s.dgr||'',en:s.dgr||''} }))); }
        paintSlides();
        pane.appendChild(list);
        pane.appendChild(el('div',{class:'sc-slide__foot'},[
          el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>{ slides.push({kind:'mode',illu:'lightning-bolt',tgr:'Νέα διαφάνεια',dgr:''}); save(); paintSlides(); }},[ '＋ ', L({gr:'Νέα διαφάνεια',en:'New slide'}) ]),
          el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{ save(); go('home'); }}, L({gr:'Αποθήκευση & προβολή',en:'Save & view'})),
          el('button',{class:'sc-mini', onclick:()=>{ SymStore.set('hero_slides',null); symRender(); }}, L({gr:'Επαναφορά',en:'Reset'})),
        ]));
      }
      else if(activeSec==='about'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Σχετικά & Επικοινωνία — panels του footer',en:'About & Contact — footer panels'})));
        pane.appendChild(el('p',{class:'sc-hint', style:'margin:0 0 12px'}, L({gr:'Τα στοιχεία εμφανίζονται στα panels «Σχετικά» και «Επικοινωνία» που ανοίγουν από το footer.',en:'These feed the “About” and “Contact” panels opened from the footer.'})));
        pane.appendChild(el('div',{class:'sc-sec-lbl', style:'margin:0 0 8px'}, L({gr:'Σχετικά',en:'About'})));
        pane.appendChild(aboutField('about_title', {gr:'Τίτλος',en:'Title'}, 'Η αρχαιότητα, σαν παιχνίδι', false));
        pane.appendChild(aboutField('about_mission', {gr:'Αποστολή',en:'Mission'}, 'Το SymposiON μετατρέπει τα Αρχαία Ελληνικά, τα Ομηρικά Έπη, την Ιστορία και τα Λατινικά σε παιχνίδια — ώστε κάθε μαθητής να μαθαίνει παίζοντας.', true));
        pane.appendChild(aboutField('about_contact', {gr:'Γραμμή επικοινωνίας (panel «Σχετικά»)',en:'Contact line (About panel)'}, 'hello@symposi-on.com · Αθήνα, Ελλάδα', false));
        pane.appendChild(el('div',{class:'sc-sec-lbl', style:'margin:16px 0 8px'}, L({gr:'Στοιχεία επικοινωνίας (panel «Επικοινωνία»)',en:'Contact details (Contact panel)'})));
        pane.appendChild(aboutField('contact_email', {gr:'Email',en:'Email'}, 'hello@symposi-on.com', false));
        pane.appendChild(aboutField('contact_address', {gr:'Διεύθυνση',en:'Address'}, 'Αθήνα, Ελλάδα', false));
        pane.appendChild(aboutField('contact_hours', {gr:'Ώρες',en:'Hours'}, 'Δευτ–Παρ · 9:00–17:00', false));
        pane.appendChild(el('div',{style:'display:flex;gap:8px;margin-top:14px;flex-wrap:wrap'},[
          el('button',{class:'sc-mini sc-mini--accent', onclick:()=>{ if(window.SymInfoPanel) SymInfoPanel.about(); }}, L({gr:'Προεπισκόπηση «Σχετικά»',en:'Preview “About”'})),
          el('button',{class:'sc-mini sc-mini--accent', onclick:()=>{ if(window.SymInfoPanel) SymInfoPanel.contact(); }}, L({gr:'Προεπισκόπηση «Επικοινωνία»',en:'Preview “Contact”'})),
        ]));
      }
      else if(activeSec==='feedback'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Σχόλια & Αναφορές χρηστών',en:'User feedback & reports'})));
        pane.appendChild(el('p',{class:'sc-hint', style:'margin:0 0 12px'}, L({gr:'Υποβολές από το panel «Σχόλια» του footer εμφανίζονται πρώτες.',en:'Submissions from the footer “Feedback” panel appear first.'})));
        const stored = (SymStore.get('user_feedback',[]) || []);
        const fb=[ {n:'Μαρία Κ.',r:5,t:'Τα παιδιά λατρεύουν τη Διελκυστίνδα! Έμαθαν την Ιλιάδα χωρίς να το καταλάβουν.',new:1},
          {n:'κ. Παπαδόπουλος',r:5,t:'Ο πίνακας αδυναμιών με βοηθά να στοχεύω την εξάσκηση. Εξαιρετικό.',new:1},
          {n:'Νίκος Δ.',r:4,t:'Πολύ καλό, θα ήθελα περισσότερα παιχνίδια για Λατινικά.'},
          {n:'Ελένη Σ.',r:5,t:'Το Tartarus Review είναι ιδιοφυές για επανάληψη.'},
          {n:'Ανώνυμος',r:3,t:'Μερικές φορές αργεί να φορτώσει το Live Arena.'} ];
        pane.appendChild(el('div',{class:'sc-stats', style:'margin-bottom:12px'},[ stat(String(stored.length+218),L({gr:'Σχόλια',en:'Reviews'}),accent), stat(String(stored.filter(f=>f.kind==='bug').length),L({gr:'Bugs',en:'Bugs'}),accent), stat(String(stored.filter(f=>f.new).length+12),L({gr:'Νέα',en:'New'}),accent) ]));
        pane.appendChild(el('button',{class:'sc-mini sc-mini--accent', style:'margin-bottom:12px', onclick:()=>{ if(window.SymInfoPanel) SymInfoPanel.feedback(); }}, L({gr:'Άνοιγμα φόρμας σχολίων',en:'Open feedback form'})));
        const fwrap=el('div',{class:'sc-fbs'});
        stored.forEach((f,idx)=>{
          const isBug=f.kind==='bug', isContact=f.kind==='contact';
          fwrap.appendChild(el('div',{class:'sc-fb'+(f.new?' new':'')+(isBug?' sc-fb--bug':'')},[
            el('div',{class:'sc-fb__hd'},[
              el('span',{class:'sc-fb__n'}, f.n||L({gr:'Ανώνυμος',en:'Anonymous'})),
              el('span',{class:'sc-fb__kind'+(isBug?' sc-fb__kind--bug':isContact?' sc-fb__kind--contact':'')}, isBug?'BUG':isContact?L({gr:'ΕΠΙΚΟΙΝΩΝΙΑ',en:'CONTACT'}):L({gr:'ΣΧΟΛΙΟ',en:'COMMENT'})),
              (f.new?el('span',{class:'sc-fb__new'}, L({gr:'ΝΕΟ',en:'NEW'})):null),
            ]),
            el('p',{class:'sc-fb__t'}, f.t),
            (f.ref?el('div',{class:'sc-fb__ref'}, '⌖ '+f.ref):null),
            el('div',{class:'sc-fb__act'},[
              el('button',{class:'sc-mini', onclick:(e)=>{ const cur=SymStore.get('user_feedback',[]); if(cur[idx]){ cur[idx].new=0; SymStore.set('user_feedback',cur); } e.currentTarget.textContent='✓ '+L({gr:'Αναγνωσμένο',en:'Read'}); }}, L({gr:'Σημείωση',en:'Mark read'})),
              el('button',{class:'sc-mini', onclick:()=>{ const cur=SymStore.get('user_feedback',[]); cur.splice(idx,1); SymStore.set('user_feedback',cur); symRender(); }}, L({gr:'Διαγραφή',en:'Delete'})),
            ]),
          ]));
        });
        fb.forEach(f=> fwrap.appendChild(el('div',{class:'sc-fb'+(f.new?' new':'')},[
          el('div',{class:'sc-fb__hd'},[ el('span',{class:'sc-fb__n'}, f.n), el('span',{class:'sc-fb__stars'}, '★★★★★'.slice(0,f.r)+'☆☆☆☆☆'.slice(0,5-f.r)), (f.new?el('span',{class:'sc-fb__new'}, L({gr:'ΝΕΟ',en:'NEW'})):null) ]),
          el('p',{class:'sc-fb__t'}, f.t),
          el('div',{class:'sc-fb__act'},[ el('button',{class:'sc-mini'}, L({gr:'Απάντηση',en:'Reply'})), el('button',{class:'sc-mini'}, L({gr:'Προβολή',en:'Feature'})), el('button',{class:'sc-mini'}, L({gr:'Απόκρυψη',en:'Hide'})) ]),
        ])));
        pane.appendChild(fwrap);
      }
      else if(activeSec==='guides'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Οδηγοί — how-to-play (panel & promo αρχικής)',en:'Guides — how-to-play (panel & home promo)'})));
        pane.appendChild(el('p',{class:'sc-hint', style:'margin:0 0 12px'}, L({gr:'Εμφανίζονται στο panel «Οδηγοί» και στην προωθητική κάρτα της αρχικής. Ένα βήμα ανά γραμμή.',en:'Shown in the “Guides” panel and the home promo card. One step per line.'})));
        pane.appendChild(el('button',{class:'sc-mini sc-mini--accent', style:'margin-bottom:12px', onclick:()=>{ if(window.SymInfoPanel) SymInfoPanel.guides(); }}, L({gr:'Προεπισκόπηση οδηγών',en:'Preview guides'})));
        const guides = SymStore.get('guides', null) || (window.SYM_GUIDES_DEFAULT||[]).map(g=>Object.assign({}, g, { steps:(g.steps||[]).slice() }));
        const save=()=>SymStore.set('guides', guides);
        const screens=[['anodos','Άνοδος'],['temple','Ἀγορά / Olympia'],['tartarus','Tartarus'],['gamepanel','Παιχνίδια'],['live','Live Arena'],['','—']];
        const list=el('div',{class:'sc-guides'});
        function paintG(){
          list.innerHTML='';
          guides.forEach((g,i)=>{
            const card=el('div',{class:'sc-guide'});
            card.appendChild(el('div',{class:'sc-guide__hd'},[
              el('span',{class:'sc-guide__no'}, String(i+1).padStart(2,'0')),
              el('input',{class:'sc-guide__hl', value:g.headline||'', placeholder:'Headline', oninput:(e)=>{ g.headline=e.target.value; save(); }}),
              el('button',{class:'sc-mini', onclick:()=>{ guides.splice(i,1); save(); paintG(); }}, L({gr:'Διαγραφή',en:'Delete'})),
            ]));
            card.appendChild(el('input',{class:'sc-guide__in', value:g.kicker||'', placeholder:L({gr:'Υπότιτλος (π.χ. Πώς να παίξεις)',en:'Kicker (e.g. How to play)'}), oninput:(e)=>{ g.kicker=e.target.value; save(); }}));
            card.appendChild(el('textarea',{class:'sc-guide__in sc-guide__ta', rows:'2', placeholder:L({gr:'Εισαγωγή…',en:'Intro…'}), oninput:(e)=>{ g.intro=e.target.value; save(); }}, g.intro||''));
            card.appendChild(el('textarea',{class:'sc-guide__in sc-guide__ta', rows:'4', placeholder:L({gr:'Βήματα — ένα ανά γραμμή',en:'Steps — one per line'}), oninput:(e)=>{ g.steps=e.target.value.split('\n').map(s=>s.trim()).filter(Boolean); save(); }}, (g.steps||[]).join('\n')));
            const sel=el('select',{class:'sc-guide__sel', onchange:(e)=>{ g.ctaScreen=e.target.value; save(); }}, screens.map(([v,lab])=> el('option',{value:v}, lab)));
            sel.value = g.ctaScreen||'';
            card.appendChild(el('div',{class:'sc-guide__row'},[
              el('input',{class:'sc-guide__in', value:g.ctaLabel||'', placeholder:L({gr:'Κείμενο κουμπιού',en:'Button label'}), oninput:(e)=>{ g.ctaLabel=e.target.value; save(); }}),
              el('label',{class:'sc-guide__sl'},[ el('span',{}, L({gr:'Πάει σε',en:'Goes to'})), sel ]),
            ]));
            list.appendChild(card);
          });
          if(window.injectIllus) injectIllus(list);
        }
        paintG();
        pane.appendChild(list);
        pane.appendChild(el('div',{style:'display:flex;gap:8px;margin-top:12px;flex-wrap:wrap'},[
          el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>{ guides.push({ id:'g-'+Date.now(), illu:'book', kicker:'Πώς να παίξεις', headline:'Νέος οδηγός', intro:'', steps:[], ctaLabel:'Άνοιγμα', ctaScreen:'' }); save(); paintG(); }},[ '＋ '+L({gr:'Νέος οδηγός',en:'New guide'}) ]),
          el('button',{class:'sc-mini', onclick:()=>{ SymStore.set('guides',null); symRender(); }}, L({gr:'Επαναφορά',en:'Reset'})),
        ]));
      }
      else if(activeSec==='tartarus' || activeSec==='acroteria'){
        const isT = activeSec==='tartarus';
        pane.appendChild(el('div',{class:'sc-panel__h'}, isT?L({gr:'Διαχείριση Tartarus',en:'Manage Tartarus'}):L({gr:'Διαχείριση Ακρωτηρίων',en:'Manage Acroteria'})));
        (isT?[['Ενεργό spaced-repetition',1],['Κοινοποίηση σε καθηγητές',1],['Auto-clear 90 ημερών',0]]
            :[['Νέα ακρωτήρια ορατά',1],['Εποχιακά ξεκλειδώματα',1],['Kleos διπλασιασμός (event)',0]]).forEach(r=>
          pane.appendChild(toggleRow({gr:r[0],en:r[0]}, r[1])));
        if(!isT){ pane.appendChild(el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', style:'margin-top:12px', onclick:()=>window.synOpenAcroteria(ctx)}, L({gr:'Άνοιγμα συλλογής',en:'Open collection'}))); }
      }
      else if(activeSec==='content' || activeSec==='studio'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Studio — Τάξεις → Μαθήματα → Παιχνίδια → Ερωτήσεις',en:'Studio — Grades → Subjects → Games → Questions'})));
        pane.appendChild(el('div',{class:'sc-crumbs'}, ['Β΄ Γυμνασίου','Ιλιάδα','Ιλιάδα Trivia','Ραψωδία Α'].map((c,i,a)=> el('span',{class:'sc-crumb'+(i===a.length-1?' on':'')}, c))));
        // editable game name + ICON picker
        pane.appendChild(el('div',{class:'sc-iconedit'},[
          el('div',{class:'sc-iconedit__l'},[ el('span',{class:'sc-iconedit__lab'}, L({gr:'Όνομα & εικονίδιο παιχνιδιού',en:'Game name & icon'})), el('input',{class:'sc-field__i', value:'Ιλιάδα Trivia'}) ]),
          el('button',{class:'sc-iconedit__cur', onclick:()=>iconPicker(window.SymStore.get('admin_game_icon','helmet'))},[ glyph(window.SymStore.get('admin_game_icon','helmet'),'sc-iconedit__gl'), el('span',{},'✎') ]),
        ]));
        function iconPicker(cur){
          const ov=el('div',{class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
          const box=el('div',{class:'sc-iconpop'});
          box.appendChild(el('div',{class:'sc-lvpop__bar'},[ el('span',{},'◆ '+L({gr:'Επίλεξε εικονίδιο',en:'Choose icon'})), el('button',{class:'pv-modal__x', onclick:()=>ov.remove(), html:'&times;'}) ]));
          const grid=el('div',{class:'sc-iconpop__grid'});
          ['helmet','sword','shield-round','shield-lion','crossed-spears','bow','trident','trireme','ship-prow','horse','trojan-horse','owl','eagle','snake','fish','wave','column','column-row','acropolis','walls','building','amphora','scroll','quill','quill-feather','book','tablet','cards','dice','cipher','crossword','puzzle','lyre','masks','theatre','wreath','wreath-laurel','crown-laurel','crown','trophy','medal','flame','torch','lightning-bolt','star-streak','sun','olive-branch','olive-tree','map','compass','anchor','hourglass','sand-timer','timeline','scales','target','labyrinth','runner','discus','coin','goddess','speech','world'].forEach(ic=>
            grid.appendChild(el('button',{class:'sc-iconpop__c'+(ic===cur?' on':''), onclick:()=>{ window.SymStore.set('admin_game_icon', ic); ov.remove(); paint(); }},[ glyph(ic,'sc-iconpop__gl') ])));
          box.appendChild(grid);
          ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
          if(window.injectIllus) injectIllus(ov);
          requestAnimationFrame(()=>ov.classList.add('in'));
          if(window.gsap) gsap.from(box,{y:20,scale:.97,autoAlpha:0,duration:.35,ease:'back.out(1.5)'});
        }
        pane.appendChild(el('div',{class:'sc-editor'},[
          el('div',{class:'sc-editor__row'},[ el('span',{class:'sc-editor__l'},L({gr:'Ερώτηση',en:'Question'})), el('input',{class:'sc-field__i', value:'Ποιος σκότωσε τον Έκτορα;'}) ]),
          ...['Ἀχιλλεύς','Ὀδυσσεύς','Αἴας','Διομήδης'].map((a,i)=> el('div',{class:'sc-editor__opt'},[ el('input',{type:'radio',name:'qa', checked:i===0?'checked':null}), el('input',{class:'sc-field__i', value:a}) ])),
          el('div',{class:'sc-editor__foot'},[ el('button',{class:'sc-mini', onclick:()=>SymPreview.open('mc',{title:'QA'})}, L({gr:'Προεπισκόπηση',en:'Preview'})), el('button',{class:'sc-mini'}, L({gr:'+ Παράδειγμα κλίσης (Λύω)',en:'+ Paradigm (Lyo)'})), el('button',{class:'sc-cta sc-cta--solid sc-cta--sm'}, L({gr:'Αποθήκευση',en:'Save'})) ]),
        ]));
      }
      else if(activeSec==='grant'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Χορήγησε δωρεάν πρόσβαση',en:'Grant free access'})));
        pane.appendChild(el('div',{class:'sc-form'},[
          field2(L({gr:'Email χρήστη',en:'User email'}),'student@example.com'),
          rowSel(L({gr:'Ρόλος',en:'Role'}), ['Μαθητής','Καθηγητής','Admin']),
          rowSel(L({gr:'Τάξη',en:'Class'}), ['Όλες','Β΄ Γυμνασίου','Γ΄ Λυκείου','Λατινικά']),
          rowSel(L({gr:'Διάρκεια',en:'Duration'}), ['1 μήνας','3 μήνες','12 μήνες','Μόνιμα']),
          el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', style:'margin-top:6px', onclick:(e)=>{ e.currentTarget.textContent='✓ '+L({gr:'Χορηγήθηκε',en:'Granted'}); }}, L({gr:'Χορήγηση πρόσβασης',en:'Grant access'})),
        ]));
      }
      else if(activeSec==='access'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Έλεγχος πρόσβασης ανά τάξη',en:'Access control per class'})));
        [['Α΄ Γυμνασίου','free'],['Β΄ Γυμνασίου','free'],['Γ΄ Γυμνασίου','free'],['Α΄ Λυκείου','pro'],['Β΄ Λυκείου','pro'],['Γ΄ Λυκείου','pro'],['Νέα Ελληνικά','free'],['Αρχαία (Γραμμ.)','free'],['Λατινικά','pro']].forEach(r=>{
          const isFree = r[1]==='free';
          pane.appendChild(el('div',{class:'sc-adrow'},[ el('span',{}, r[0]), el('div',{class:'sc-pill2-row'},[
            el('button',{class:'sc-pill2'+(isFree?' on':''), onclick:(e)=>{ e.currentTarget.classList.add('on'); e.currentTarget.nextSibling.classList.remove('on'); }}, L({gr:'Δωρεάν',en:'Free'})),
            el('button',{class:'sc-pill2'+(isFree?'':' on'), onclick:(e)=>{ e.currentTarget.classList.add('on'); e.currentTarget.previousSibling.classList.remove('on'); }}, 'Pro') ]) ]));
        });
      }
      else if(activeSec==='pricing'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Τιμολόγηση',en:'Pricing'})));
        [['Free','€0','—'],['Pro (μήνας)','€4.99','892 '+L({gr:'συνδρομές',en:'subs'})],['Pro (έτος)','€39.99','310'],['School','€49','17']].forEach(p=>
          pane.appendChild(el('div',{class:'sc-adrow'},[ el('span',{}, p[0]), el('div',{style:'display:flex;gap:12px;align-items:center'},[ el('input',{class:'sc-price', value:p[1]}), el('small',{style:'color:var(--muted)'}, p[2]) ]) ])));
        pane.appendChild(el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', style:'margin-top:10px'}, L({gr:'Αποθήκευση τιμών',en:'Save pricing'})));
      }
      else if(activeSec==='discounts'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Εκπτωτικοί κωδικοί',en:'Discount codes'})));
        pane.appendChild(el('div',{class:'sc-form'},[ field2(L({gr:'Κωδικός',en:'Code'}),'PAIDEIA20'), rowSel(L({gr:'Έκπτωση',en:'Discount'}),['10%','20%','50%','3 μήνες δωρεάν']), el('button',{class:'sc-cta sc-cta--solid sc-cta--sm'}, L({gr:'Δημιουργία',en:'Create'})) ]));
        const tbl=el('div',{class:'sc-table', style:'margin-top:14px'});
        tbl.appendChild(el('div',{class:'sc-tr sc-tr--h'},[el('span',{},'Code'),el('span',{},L({gr:'Έκπτωση',en:'Off'})),el('span',{},L({gr:'Χρήσεις',en:'Uses'})),el('span',{},'')]));
        [['WELCOME10','10%','124'],['SCHOOL50','50%','8'],['SUMMER','3μ','41']].forEach(d=>
          tbl.appendChild(el('div',{class:'sc-tr'},[ el('span',{class:'sc-tr__task'},d[0]), el('span',{},d[1]), el('span',{},d[2]), el('span',{class:'sc-tr__acts'},[ el('button',{class:'sc-mini'},L({gr:'Απενεργ.',en:'Disable'})) ]) ])));
        pane.appendChild(tbl);
      }
      else if(activeSec==='realm'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Curator’s Realm — Οικονομία Ναού',en:'Curator’s Realm — Temple economy'})));
        pane.appendChild(el('p',{class:'sc-hint', style:'margin:0 0 12px'}, L({gr:'Επεξεργασία ακρωτηρίων, ευλογιών, άθλων & saga — χωρίς deploy.',en:'Edit cosmetics, boons, quests & saga — no deploy.'})));
        pane.appendChild(el('div',{class:'sc-realm'}, [['⛩','Ακρωτήρια','13'],['⚡','Ευλογίες','5'],['🜂','Αναλώσιμα','3'],['📜','Άθλοι','10'],['🏛','Saga','5 κεφ.'],['💰','Game rewards','17']].map(r=>
          el('button',{class:'sc-realm__c', onclick:()=>window.synOpenAcroteria(ctx)},[ el('span',{class:'sc-realm__ic'}, r[0]), el('b',{}, r[1]), el('small',{}, r[2]) ]))));
        // add a new acroterion → appears in the Agora automatically (and live, if it's open in another tab)
        const customAcro = SymStore.get('custom_acroteria', []);
        pane.appendChild(el('div',{class:'sc-sec-lbl', style:'margin:18px 0 6px'}, L({gr:'Νέο ακρωτήριο → Ἀγορά',en:'New acroterion → Agora'})));
        pane.appendChild(el('p',{class:'sc-hint', style:'margin:0 0 10px'}, L({gr:'Πρόσθεσέ το εδώ — εμφανίζεται αυτόματα στην Ἀγορά (ζωντανά αν είναι ανοιχτή).',en:'Add it here — it appears in the Agora automatically (live if it\u2019s open).'})));
        const RILLUS=['acropolis','trireme','owl','column','amphora','olive-branch','trident','horse','helmet','lyre','eagle','wreath-laurel','flame','torch','sword','crown'];
        const RCATS=[['found','Θεμέλια'],['season','Ἑορταί'],['myth','Μυθολογία'],['epic','Ἔπη'],['life','Βίος'],['byz','Βυζάντιο'],['modern','Νεωτέρα'],['world','Κόσμος']];
        pane.appendChild(el('div',{class:'sc-form'},[
          el('div',{style:'display:flex;gap:8px;flex-wrap:wrap;align-items:center'},[
            el('input',{class:'sc-field__i', id:'newAcroNm', placeholder:L({gr:'Όνομα (π.χ. Ἡφαίστειον)',en:'Name (e.g. Hephaisteion)'}), style:'flex:2;min-width:150px'}),
            el('input',{class:'sc-field__i', id:'newAcroCost', type:'number', value:'1200', style:'flex:1;min-width:84px'}),
            el('select',{class:'sc-field__i sc-select', id:'newAcroIllu', style:'flex:1;min-width:110px'}, RILLUS.map(i=>el('option',{value:i}, i))),
            el('select',{class:'sc-field__i sc-select', id:'newAcroCat', style:'flex:1;min-width:110px'}, RCATS.map(([v,t])=>el('option',{value:v}, t))),
            el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{
              const nm=document.getElementById('newAcroNm').value.trim(); if(!nm) return;
              const cost=parseInt(document.getElementById('newAcroCost').value,10)||0;
              const illu=document.getElementById('newAcroIllu').value, cat=document.getElementById('newAcroCat').value;
              const cur=SymStore.get('custom_acroteria',[]); cur.push({ id:'cac-'+Date.now(), cat, illu, gr:nm, en:nm, cost, owned:0, lore:{gr:'Προστέθηκε από τον Curator.',en:'Added by the Curator.'} });
              SymStore.set('custom_acroteria', cur); paint();
            }}, L({gr:'＋ Πρόσθεσε',en:'＋ Add'})),
          ]),
        ]));
        if(customAcro.length){
          const tbl=el('div',{class:'sc-table', style:'margin-top:12px'});
          tbl.appendChild(el('div',{class:'sc-tr sc-tr--h'},[el('span',{},L({gr:'Ακρωτήριο',en:'Acroterion'})),el('span',{},'Kleos'),el('span',{},'')]));
          customAcro.forEach((a,i)=> tbl.appendChild(el('div',{class:'sc-tr'},[ el('span',{class:'sc-tr__task'}, L(a)), el('span',{}, (a.cost||0).toLocaleString('en-US')), el('span',{class:'sc-tr__acts'},[ el('button',{class:'sc-mini', onclick:()=>{ const c=SymStore.get('custom_acroteria',[]).filter((_,j)=>j!==i); SymStore.set('custom_acroteria',c); paint(); }}, L({gr:'Διαγραφή',en:'Delete'})) ]) ])));
          pane.appendChild(tbl);
        }
      }
      else if(activeSec==='atlas'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Command Atlas — Έκτακτα & Kill-switch',en:'Command Atlas — Emergency & Kill-switch'})));
        pane.appendChild(el('input',{class:'sc-search', placeholder:L({gr:'Αναζήτηση λειτουργίας…',en:'Search feature…'})}));
        pane.appendChild(el('div',{class:'sc-atlas'},[
          atlasRow('🛑', L({gr:'Kill switch συνδρομών',en:'Subscriptions kill-switch'}), 1),
          atlasRow('🛑', L({gr:'Παύση Live Arena',en:'Pause Live Arena'}), 0),
          atlasRow('🔒', L({gr:'Κλείδωμα εγγραφών',en:'Lock signups'}), 0),
          atlasRow('🧹', L({gr:'Καθαρισμός cache',en:'Purge cache'}), 0),
        ]));
      }
      else if(activeSec==='banners'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Banners & ανακοινώσεις',en:'Banners & announcements'})));
        [['Καλοκαιρινό event',1],['Νέο παιχνίδι: Φάλαγγα',1],['Black Friday Pro',0]].forEach(b=>
          pane.appendChild(toggleRow({gr:b[0],en:b[0]}, b[1])));
      }
      else if(activeSec==='settings'){
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Ρυθμίσεις πλατφόρμας',en:'Platform settings'})));
        [['Εγγραφές ανοιχτές',1],['Λειτουργία συντήρησης',0],['Email ειδοποιήσεις',1],['Auto-detect εποχής',1]].forEach(s=>
          pane.appendChild(toggleRow({gr:s[0],en:s[0]}, s[1])));
      }
      else {
        pane.appendChild(el('div',{class:'sc-panel__h'}, L({gr:'Νέα ενότητα',en:'New section'})));
        pane.appendChild(el('p',{class:'sc-hint'}, L({gr:'Προσαρμοσμένη ενότητα — πρόσθεσε πεδία, πίνακες ή διακόπτες.',en:'Custom section — add fields, tables or toggles.'})));
        pane.appendChild(el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm'}, L({gr:'＋ Πρόσθεση widget',en:'＋ Add widget'})));
      }
      if(window.injectIllus) injectIllus(pane);
    }
    paint();
  };

  /* ══ LOGIN ══ (+ Google · Outlook · forgot password) */
  S.login = function(home, ctx){
    const view = (ctx.param && ctx.param.view) || 'signin';
    const sec = el('section',{class:'sc-login'});
    const card = el('div',{class:'sc-login__card sc-stagger'});
    const brand = el('div',{class:'sc-login__brand'});
    brand.appendChild(brandMark('sc-login__mark'));
    brand.appendChild(el('span',{class:'sc-login__wm',html:'Symposi<span>ON</span>'}));
    card.appendChild(brand);

    if(view==='forgot'){
      card.appendChild(el('h2',{class:'sc-login__h'}, L({gr:'Επαναφορά κωδικού',en:'Reset password'})));
      card.appendChild(el('p',{class:'sc-login__p'}, L({gr:'Δώσε το email σου και θα λάβεις σύνδεσμο επαναφοράς.',en:'Enter your email and we’ll send a reset link.'})));
      card.appendChild(field(L({gr:'Email',en:'Email'}),'email','you@symposi-on.com'));
      card.appendChild(el('button',{class:'sc-cta sc-cta--solid sc-login__go', onclick:(e)=>{ const c=e.currentTarget; c.innerHTML=''; c.appendChild(el('span',{},'✓ '+L({gr:'Στάλθηκε ο σύνδεσμος',en:'Link sent'}))); }}, [ L({gr:'Αποστολή συνδέσμου',en:'Send reset link'}) ]));
      card.appendChild(el('button',{class:'sc-login__back', onclick:()=>go('login',{view:'signin'})}, L({gr:'← Επιστροφή στην είσοδο',en:'← Back to sign in'})));
      sec.appendChild(loginArt()); sec.appendChild(card); home.appendChild(sec); return;
    }

    card.appendChild(el('div',{class:'sc-login__tabs'},[
      chip(L({gr:'Είσοδος',en:'Sign in'}), view!=='signup', ()=>go('login',{view:'signin'})),
      chip(L({gr:'Εγγραφή',en:'Sign up'}), view==='signup', ()=>go('login',{view:'signup'})),
    ]));
    card.appendChild(el('div',{class:'sc-login__sso'},[
      el('button',{class:'sc-sso'},[ el('span',{class:'sc-sso__g sc-sso__g--google'},'G'), L({gr:'Συνέχεια με Google',en:'Continue with Google'}) ]),
      el('button',{class:'sc-sso'},[ el('span',{class:'sc-sso__g sc-sso__g--ms'},'⊞'), L({gr:'Συνέχεια με Outlook',en:'Continue with Outlook'}) ]),
    ]));
    card.appendChild(el('div',{class:'sc-login__or'}, L({gr:'ή',en:'or'})));
    if(view==='signup') card.appendChild(field(L({gr:'Όνομα',en:'Name'}),'text','Όνομα'));
    card.appendChild(field(L({gr:'Email',en:'Email'}),'email','you@symposi-on.com'));
    const pwField = field(L({gr:'Κωδικός',en:'Password'}),'password','••••••••');
    if(view!=='signup') pwField.appendChild(el('button',{class:'sc-login__forgot', onclick:()=>go('login',{view:'forgot'})}, L({gr:'Ξέχασες;',en:'Forgot?'})));
    card.appendChild(pwField);
    card.appendChild(el('button',{class:'sc-cta sc-cta--solid sc-login__go', onclick:()=>{ if(window.SymLoader) SymLoader.show(L({gr:'Σύνδεση…',en:'Signing in…'})); setTimeout(()=>{ if(window.SymLoader) SymLoader.hide(); go('home'); }, 900); }},[ view==='signup'?L({gr:'Δημιουργία λογαριασμού',en:'Create account'}):L({gr:'Είσοδος',en:'Sign in'}), el('span',{html:'&rarr;'}) ]));
    card.appendChild(el('button',{class:'sc-login__back', onclick:()=>go('home')}, L({gr:'← Επιστροφή στην αρχική',en:'← Back to home'})));
    sec.appendChild(loginArt()); sec.appendChild(card); home.appendChild(sec);

    function field(lbl, type, ph){ return el('label',{class:'sc-field'},[ el('span',{class:'sc-field__l'}, lbl), el('input',{class:'sc-field__i', type:type, placeholder:ph}) ]); }
    function loginArt(){ return el('div',{class:'sc-login__art'},[ glyph('owl','sc-login__owl') ]); }
  };

  /* ══ SUBSCRIBE / PRICING (customer-facing) ══ */
  S.subscribe = function(home, ctx){
    const accent = '#C18A2C';
    const SS = window.SymStore;
    const body = window.synPage(home, { back:'home', accent, eyebrow:L({gr:'Συνδρομές · Πλάνα',en:'Subscriptions · Plans'}),
      title:L({gr:'Ξεκλείδωσε όλον τον αρχαίο κόσμο',en:'Unlock the whole ancient world'}),
      sub:L({gr:'Όλα τα παιχνίδια, όλα τα επίπεδα, σε κάθε μάθημα.',en:'All games, all levels, every subject.'}) });

    const st = { type:'student', cls:'all', months:6 };
    // built-in + admin custom plans
    const builtIn = [
      { key:'student', t:{gr:'Μαθητής',en:'Student'}, icon:'scroll', d:{gr:'Πρόσβαση σε όλα τα παιχνίδια & επίπεδα.',en:'Access to all games & levels.'}, price:{1:4.99,3:12.99,6:21.99,12:35.99} },
      { key:'teacher', t:{gr:'Καθηγητής',en:'Teacher'}, icon:'crown-laurel', d:{gr:'Μαθητής + δημιουργία κουίζ & QR.',en:'Student + quiz builder & QR.'}, price:{1:7.99,3:19.99,6:34.99,12:59.99} },
    ];
    const custom = (SS?SS.get('admin_plans',[]):[]).map(p=>({ key:p.id, t:{gr:p.nm,en:p.nm}, icon:'star-streak', d:{gr:'Προσαρμοσμένο πλάνο.',en:'Custom plan.'}, price:{1:+p.price||0,3:(+p.price||0)*2.6,6:(+p.price||0)*4.4,12:(+p.price||0)*7.2} }));
    const PLANS = builtIn.concat(custom);
    const bundles = [ {m:1,t:{gr:'1 Μήνας',en:'1 Month'}},{m:3,t:{gr:'3 Μήνες',en:'3 Months'}},{m:6,t:{gr:'6 Μήνες',en:'6 Months'},pop:1},{m:12,t:{gr:'12 Μήνες',en:'12 Months'}} ];
    const euro = n => '€'+Number(n).toFixed(2);
    const plan = () => PLANS.find(p=>p.key===st.type) || PLANS[0];
    const savings = m => { const p=plan(); if(m===1) return ''; const pct=Math.round((1 - p.price[m]/(p.price[1]*m))*100); return pct>0?'−'+pct+'%':''; };

    // type pills
    const typeWrap = el('div',{class:'sub-types sc-stagger'});
    PLANS.forEach(p=> typeWrap.appendChild(el('button',{class:'sub-type'+(st.type===p.key?' on':''), onclick:()=>{ st.type=p.key; repaint(); }},[
      el('span',{class:'sub-type__ic'},[ glyph(p.icon,'sc-gl') ]),
      el('span',{class:'sub-type__t'}, L(p.t)), el('span',{class:'sub-type__d'}, L(p.d)),
    ])));
    body.appendChild(typeWrap);

    // class scope
    const CLASSES=[ {k:'all',t:{gr:'🌐 Όλες οι τάξεις — All Access',en:'🌐 All Grades'}},{k:'gym-a',t:{gr:'Α΄ Γυμνασίου',en:'7th Grade'}},{k:'gym-b',t:{gr:'Β΄ Γυμνασίου',en:'8th Grade'}},{k:'gym-c',t:{gr:'Γ΄ Γυμνασίου',en:'9th Grade'}},{k:'lyk-a',t:{gr:'Α΄ Λυκείου',en:'10th Grade'}},{k:'lyk-b',t:{gr:'Β΄ Λυκείου',en:'11th Grade'}},{k:'lyk-c',t:{gr:'Γ΄ Λυκείου',en:'12th Grade'}},{k:'gram',t:{gr:'Αρχαία (Γραμματική)',en:'Ancient Greek Grammar'}} ];
    body.appendChild(el('label',{class:'sub-cls sc-stagger'},[ el('span',{class:'sc-nav-step__l'}, L({gr:'Διάλεξε τάξη',en:'Choose grade'})),
      el('select',{class:'sc-field__i sc-select', onchange:(e)=>{ st.cls=e.target.value; }}, CLASSES.map(c=>el('option',{value:c.k,selected:st.cls===c.k?'selected':null}, L(c.t)))) ]));

    // duration cards
    const cardWrap = el('div',{class:'sub-cards sc-stagger has-accent', style:`--ca:${accent}`});
    body.appendChild(cardWrap);
    // features
    const FEAT=[ ['joystick',{gr:'Όλα τα παιχνίδια ξεκλειδωμένα',en:'All games unlocked'},{gr:'30+ mini-games χωρίς κλειδώματα',en:'30+ mini-games, no locks'}],
      ['grid-blocks',{gr:'Όλα τα επίπεδα',en:'All difficulty levels'},{gr:'Premium επίπεδα σε κάθε παιχνίδι',en:'Premium levels in every game'}],
      ['crown-laurel',{gr:'Teacher Mode',en:'Teacher Mode'},{gr:'Δημιουργία κουίζ & QR (Καθηγητής)',en:'Quiz builder & QR (Teacher)'}],
      ['owl',{gr:'Δίγλωσση πλατφόρμα',en:'Bilingual platform'},{gr:'Ελληνικά & Αγγλικά παντού',en:'Greek & English throughout'}],
      ['flame',{gr:'Tartarus Review',en:'Tartarus Review'},{gr:'Έξυπνη επανάληψη λαθών',en:'Smart mistake review'}],
      ['wreath-laurel',{gr:'Ἀγορά',en:'Agora'},{gr:'Kleos, ακρωτήρια & θέματα',en:'Kleos, acroteria & themes'}] ];
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Τι περιλαμβάνεται',en:'What’s included'})));
    body.appendChild(el('div',{class:'sub-feats sc-stagger'}, FEAT.map(f=> el('div',{class:'sub-feat'},[
      el('span',{class:'sub-feat__ic'},[ glyph(f[0],'sc-gl') ]),
      el('div',{},[ el('div',{class:'sub-feat__t'}, L(f[1])), el('div',{class:'sub-feat__d'}, L(f[2])) ]),
    ]))));

    // sticky checkout bar
    const bar = el('div',{class:'sub-bar'});
    body.appendChild(bar);

    function repaint(){
      cardWrap.innerHTML='';
      bundles.forEach(b=>{ const p=plan(); const sv=savings(b.m); const per='€'+(p.price[b.m]/b.m).toFixed(2);
        cardWrap.appendChild(el('button',{class:'sub-card'+(st.months===b.m?' on':'')+(b.pop?' pop':''), onclick:()=>{ st.months=b.m; repaint(); }},[
          b.pop? el('span',{class:'sub-card__tag'}, L({gr:'Δημοφιλές',en:'Popular'})):null,
          sv? el('span',{class:'sub-card__save'}, sv):null,
          el('div',{class:'sub-card__dur'}, L(b.t)),
          el('div',{class:'sub-card__price'}, euro(p.price[b.m])),
          el('div',{class:'sub-card__per'}, per+' / '+L({gr:'μήνα',en:'mo'})),
          el('span',{class:'sub-card__chk'+(st.months===b.m?' on':'')}, '✓'),
        ]));
      });
      const p=plan(); const cl=CLASSES.find(c=>c.k===st.cls);
      bar.innerHTML='';
      bar.appendChild(el('div',{class:'sub-bar__sum'},[
        el('div',{class:'sub-bar__plan'}, L(p.t)+' · '+(L(cl.t).replace('🌐 ','')) ),
        el('div',{class:'sub-bar__price'},[ euro(p.price[st.months]), el('span',{class:'sub-bar__cyc'}, ' / '+st.months+' '+L({gr:'μήνες',en:'mo'})) ]),
      ]));
      bar.appendChild(el('button',{class:'sc-cta sc-cta--solid sub-bar__go', onclick:()=>checkout(p)},[ glyph('coin','sc-cta__gl'), L({gr:'Συνέχεια στην πληρωμή',en:'Continue to checkout'}) ]));
    }
    repaint();

    function checkout(p){
      const ov=el('div',{class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
      const box=el('div',{class:'sub-co'});
      box.appendChild(el('div',{class:'sc-lvpop__bar'},[ el('span',{},'🔒 '+L({gr:'Ασφαλής πληρωμή',en:'Secure checkout'})), el('button',{class:'pv-modal__x', onclick:()=>ov.remove(), html:'&times;'}) ]));
      box.appendChild(el('div',{class:'sub-co__sum'},[ el('span',{}, L(p.t)+' · '+st.months+' '+L({gr:'μήνες',en:'months'})), el('b',{}, euro(p.price[st.months])) ]));
      box.appendChild(field2(L({gr:'Email',en:'Email'}),'you@symposi-on.com'));
      box.appendChild(field2(L({gr:'Αριθμός κάρτας',en:'Card number'}),'4242 4242 4242 4242'));
      box.appendChild(el('div',{style:'display:flex;gap:8px'},[ field2('MM/YY','12/27'), field2('CVC','123') ]));
      box.appendChild(el('button',{class:'sc-cta sc-cta--solid', style:'width:100%;justify-content:center;margin-top:6px', onclick:()=>{ box.innerHTML=''; box.appendChild(el('div',{class:'sc-share__done'},[ el('span',{class:'sc-share__check'},'✓'), L({gr:'Καλώς ήρθες στο Pro!',en:'Welcome to Pro!'}) ])); setTimeout(()=>{ ov.remove(); go('home'); },1300); }},[ L({gr:'Πλήρωσε',en:'Pay'})+' '+euro(p.price[st.months]) ]));
      box.appendChild(el('p',{class:'sc-hint', style:'text-align:center;margin:10px 0 0'}, L({gr:'Με Stripe · Ακύρωση ανά πάσα στιγμή',en:'Powered by Stripe · Cancel anytime'})));
      ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
      requestAnimationFrame(()=>ov.classList.add('in'));
      if(window.gsap) gsap.from(box,{y:20,scale:.97,autoAlpha:0,duration:.35,ease:'back.out(1.5)'});
    }
    function field2(label, ph){ return el('label',{class:'sc-field'},[ el('span',{class:'sc-field__l'}, label), el('input',{class:'sc-field__i', placeholder:ph}) ]); }
  };

  window.SYM_SCREENS.subscribe = S.subscribe;

  /* ══ ACCOUNT · manage subscription + billing ══ */
  S.account = function(home, ctx){
    const accent = '#5B7574';
    const body = window.synPage(home, { back:'home', accent, eyebrow:L({gr:'Ο Λογαριασμός μου',en:'My Account'}),
      title:L({gr:'Συνδρομή & Χρεώσεις',en:'Subscription & Billing'}),
      actions:[ el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>go('subscribe')},[ '↑ ', L({gr:'Αναβάθμιση',en:'Upgrade'}) ]) ] });

    // current plan card
    body.appendChild(el('div',{class:'acc-plan sc-stagger has-accent', style:`--ca:${accent}`},[
      el('div',{class:'acc-plan__l'},[
        el('div',{class:'acc-plan__badge'}, 'PRO'),
        el('div',{},[
          el('div',{class:'acc-plan__nm'}, L({gr:'Μαθητής · All Access',en:'Student · All Access'})),
          el('div',{class:'acc-plan__sub'}, L({gr:'€21.99 / 6 μήνες · Ανανέωση 12 Δεκ 2026',en:'€21.99 / 6 months · Renews Dec 12, 2026'})),
        ]),
      ]),
      el('div',{class:'acc-plan__act'},[
        el('button',{class:'sc-mini'}, L({gr:'Αλλαγή πλάνου',en:'Change plan'})),
        el('button',{class:'sc-mini'}, L({gr:'Ακύρωση',en:'Cancel'})),
      ]),
    ]));

    // payment method
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Τρόπος πληρωμής',en:'Payment method'})));
    body.appendChild(el('div',{class:'acc-pay sc-stagger'},[
      el('span',{class:'acc-pay__card'}, 'VISA'),
      el('span',{class:'acc-pay__no'}, '•••• •••• •••• 4242'),
      el('span',{class:'acc-pay__exp'}, '12/27'),
      el('button',{class:'sc-mini', style:'margin-left:auto'}, L({gr:'Ενημέρωση',en:'Update'})),
    ]));

    // billing history / receipts
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Ιστορικό χρεώσεων',en:'Billing history'})));
    const rows=[ ['12 Ιουν 2026','Μαθητής · 6 μήνες','€21.99','paid'],['12 Δεκ 2025','Μαθητής · 6 μήνες','€21.99','paid'],['12 Ιουν 2025','Μαθητής · 1 μήνας','€4.99','paid'] ];
    const tbl=el('div',{class:'sc-table sc-stagger has-accent', style:`--ca:${accent}`});
    tbl.appendChild(el('div',{class:'sc-tr sc-tr--h'},[ el('span',{},L({gr:'Ημ/νία',en:'Date'})), el('span',{},L({gr:'Πλάνο',en:'Plan'})), el('span',{},L({gr:'Ποσό',en:'Amount'})), el('span',{},L({gr:'Απόδειξη',en:'Receipt'})) ]));
    rows.forEach(r=> tbl.appendChild(el('div',{class:'sc-tr'},[
      el('span',{}, r[0]), el('span',{class:'sc-tr__task'}, r[1]), el('span',{}, r[2]),
      el('span',{class:'sc-tr__acts'},[ el('em',{class:'sc-badge2 sc-badge2--done'}, L({gr:'Πληρώθηκε',en:'Paid'})), el('button',{class:'sc-mini', onclick:()=>receipt(r)}, '⬇ PDF') ]),
    ])));
    body.appendChild(tbl);

    function receipt(r){
      const ov=el('div',{class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
      const box=el('div',{class:'acc-rcpt'});
      box.appendChild(el('div',{class:'acc-rcpt__hd'},[ brandMark('acc-rcpt__mark'), el('span',{class:'acc-rcpt__wm', html:'Symposi<span>ON</span>'}), el('button',{class:'pv-modal__x', style:'margin-left:auto', onclick:()=>ov.remove(), html:'&times;'}) ]));
      box.appendChild(el('div',{class:'acc-rcpt__ttl'}, L({gr:'Απόδειξη Πληρωμής',en:'Payment Receipt'})));
      box.appendChild(el('div',{class:'acc-rcpt__rows'}, [
        [L({gr:'Ημερομηνία',en:'Date'}), r[0]],
        [L({gr:'Πλάνο',en:'Plan'}), r[1]],
        [L({gr:'Μέθοδος',en:'Method'}), 'VISA •••• 4242'],
        [L({gr:'Αρ. απόδειξης',en:'Receipt no.'}), 'SYM-'+(1000+Math.floor(Math.random()*9000))],
      ].map(p=> el('div',{class:'acc-rcpt__row'},[ el('span',{}, p[0]), el('b',{}, p[1]) ]))));
      box.appendChild(el('div',{class:'acc-rcpt__total'},[ el('span',{}, L({gr:'Σύνολο',en:'Total'})), el('b',{}, r[2]) ]));
      box.appendChild(el('button',{class:'sc-cta sc-cta--solid', style:'width:100%;justify-content:center;margin-top:12px', onclick:()=>ov.remove()},[ '⬇ ', L({gr:'Λήψη PDF',en:'Download PDF'}) ]));
      ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
      if(window.injectIllus) injectIllus(ov);
      requestAnimationFrame(()=>ov.classList.add('in'));
      if(window.gsap) gsap.from(box,{y:20,scale:.97,autoAlpha:0,duration:.35,ease:'back.out(1.5)'});
    }
  };
  window.SYM_SCREENS.account = S.account;
  Object.assign(window.SYM_SCREENS, S);
})();
