/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · SETTINGS + CHECKOUT
   • window.SYM_SCREENS.settings — preferences (language, notifications,
     accessibility, sound, data) persisted via SymStore.
   • window.SYM_SCREENS.checkout — upgrade to Pro: cycle, redeem code, card.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const go = (s, p) => window.symGo(s, p);
  const P  = window.synPage;
  const SS = () => window.SymStore;

  function pref(key, def){ return SS().get('pref_'+key, def); }
  function setPref(key, val){ SS().set('pref_'+key, val); }

  function toggleRow(key, label, desc, def){
    const on = !!pref(key, def);
    const sw = el('button',{class:'set-sw'+(on?' on':''), role:'switch', 'aria-checked':on?'true':'false',
      onclick:(e)=>{ const now=!(pref(key,def)); setPref(key, now); e.currentTarget.classList.toggle('on',now); e.currentTarget.setAttribute('aria-checked', now?'true':'false'); }});
    return el('div',{class:'set-row'},[
      el('div',{class:'set-row__b'},[ el('div',{class:'set-row__t'}, L(label)),
        desc?el('div',{class:'set-row__d'}, L(desc)):null ]),
      sw,
    ]);
  }
  function selectRow(label, desc, options, cur, onchange){
    const sel = el('select',{class:'set-select', onchange:(e)=>onchange(e.target.value)},
      options.map(([v,t])=>el('option',{value:v, selected:v===cur?'selected':null}, L(t))));
    return el('div',{class:'set-row'},[
      el('div',{class:'set-row__b'},[ el('div',{class:'set-row__t'}, L(label)),
        desc?el('div',{class:'set-row__d'}, L(desc)):null ]),
      sel,
    ]);
  }
  const sec = (label) => el('div',{class:'set-seclbl sc-stagger'}, L(label));

  /* ───────────────────────── SETTINGS ──────────────────────────── */
  window.SYM_SCREENS = window.SYM_SCREENS || {};
  window.SYM_SCREENS.settings = function (home, ctx) {
    const accent = '#6E8B3D';
    const body = P(home, { back:'home', accent,
      eyebrow:L({gr:'Προτιμήσεις',en:'Preferences'}), title:L({gr:'Ρυθμίσεις',en:'Settings'}),
      sub:L({gr:'Προσάρμοσε γλώσσα, ειδοποιήσεις, προσβασιμότητα και ήχο.',en:'Tune language, notifications, accessibility and sound.'}) });

    body.appendChild(sec({gr:'Γλώσσα & εμφάνιση',en:'Language & display'}));
    const grp1 = el('div',{class:'set-grp sc-stagger'});
    grp1.appendChild(selectRow({gr:'Γλώσσα',en:'Language'}, {gr:'Η γλώσσα όλης της πλατφόρμας.',en:'Language across the whole platform.'},
      [['gr','Ελληνικά'],['en',{gr:'Αγγλικά',en:'English'}]], window.SYM_LANG,
      (v)=>{ window.SYM_LANG=v; if(window.STATE) STATE.lang=v; if(window.buildHarness) buildHarness(); symRender(); }));
    grp1.appendChild(toggleRow('bigtext', {gr:'Μεγαλύτερα γράμματα',en:'Larger text'}, {gr:'Αυξάνει το μέγεθος κειμένου.',en:'Bumps up text size.'}, false));
    grp1.appendChild(toggleRow('contrast', {gr:'Υψηλή αντίθεση',en:'High contrast'}, {gr:'Πιο έντονα περιγράμματα & κείμενο.',en:'Stronger outlines & text.'}, false));
    body.appendChild(grp1);

    body.appendChild(sec({gr:'Ειδοποιήσεις',en:'Notifications'}));
    const grp2 = el('div',{class:'set-grp sc-stagger'});
    grp2.appendChild(toggleRow('notif_hw', {gr:'Εργασίες & προθεσμίες',en:'Homework & deadlines'}, null, true));
    grp2.appendChild(toggleRow('notif_live', {gr:'Προσκλήσεις Live Arena',en:'Live Arena invites'}, null, true));
    grp2.appendChild(toggleRow('notif_news', {gr:'Newsletter & νέα',en:'Newsletter & news'}, {gr:'Περιοδικά email με νέα παιχνίδια.',en:'Occasional emails about new games.'}, false));
    body.appendChild(grp2);

    body.appendChild(sec({gr:'Προσβασιμότητα & ήχος',en:'Accessibility & sound'}));
    const grp3 = el('div',{class:'set-grp sc-stagger'});
    grp3.appendChild(toggleRow('reduce_motion', {gr:'Λιγότερη κίνηση',en:'Reduce motion'}, {gr:'Απενεργοποιεί έντονα εφέ & κινήσεις.',en:'Turns off heavy effects & animation.'}, false));
    grp3.appendChild(toggleRow('sound_fx', {gr:'Ηχητικά εφέ',en:'Sound effects'}, null, true));
    grp3.appendChild(toggleRow('music', {gr:'Μουσική υπόκρουση',en:'Background music'}, null, false));
    body.appendChild(grp3);

    body.appendChild(sec({gr:'Λογαριασμός & δεδομένα',en:'Account & data'}));
    const grp4 = el('div',{class:'set-grp sc-stagger'});
    [['account',{gr:'Ο λογαριασμός μου',en:'My account'},'◷'],['subscribe',{gr:'Συνδρομή',en:'Subscription'},'€'],
     ['checkout',{gr:'Αναβάθμιση σε Pro',en:'Upgrade to Pro'},'↑']].forEach(([id,lab,ic])=>
      grp4.appendChild(el('button',{class:'set-link', onclick:()=>go(id)},[
        el('span',{class:'set-link__ic'}, ic), el('span',{class:'set-link__t'}, L(lab)), el('span',{class:'set-link__ar', html:'&rsaquo;'}) ])));
    grp4.appendChild(el('button',{class:'set-link', onclick:()=>window.SymConsent&&SymConsent.privacy()},[
      el('span',{class:'set-link__ic'}, '⛉'), el('span',{class:'set-link__t'}, L({gr:'Απόρρητο & δεδομένα',en:'Privacy & data'})), el('span',{class:'set-link__ar', html:'&rsaquo;'}) ]));
    grp4.appendChild(el('button',{class:'set-link set-link--danger', onclick:(e)=>{
      const b=e.currentTarget; if(b.dataset.armed){ try{ Object.keys(localStorage).filter(k=>k.indexOf('sym_revamp_')===0).forEach(k=>localStorage.removeItem(k)); }catch(_){}
        b.textContent=L({gr:'✓ Καθαρίστηκε',en:'✓ Cleared'}); b.disabled=true; }
      else { b.dataset.armed='1'; b.querySelector('.set-link__t').textContent=L({gr:'Σίγουρα; Πάτα ξανά',en:'Sure? Tap again'}); } }},[
      el('span',{class:'set-link__ic'}, '⌫'), el('span',{class:'set-link__t'}, L({gr:'Καθαρισμός τοπικών δεδομένων',en:'Clear local data'})), el('span',{class:'set-link__ar', html:'&rsaquo;'}) ]));
    body.appendChild(grp4);
  };

  /* ───────────────────────── CHECKOUT ──────────────────────────── */
  const CODES = {
    'ΠΑΙΔΕΙΑ50': { off:0.50, label:{gr:'−50% έκπτωση',en:'−50% off'} },
    'PAIDEIA50': { off:0.50, label:{gr:'−50% έκπτωση',en:'−50% off'} },
    'SCHOOL25':  { off:0.25, label:{gr:'−25% σχολική έκπτωση',en:'−25% school discount'} },
    'WELCOME':   { off:1.00, first:true, label:{gr:'Πρώτος μήνας δωρεάν',en:'First month free'} },
  };
  const PRICE = { monthly:4.99, yearly:49.00 };
  const money = n => '€'+n.toFixed(2).replace('.', ',');

  window.SYM_SCREENS.checkout = function (home, ctx) {
    const accent = '#C18A2C';
    const body = P(home, { back:'subscribe', backLabel:L({gr:'Συνδρομές',en:'Plans'}), accent,
      eyebrow:L({gr:'Αναβάθμιση',en:'Upgrade'}), title:L({gr:'SymposiON Pro',en:'SymposiON Pro'}),
      sub:L({gr:'Όλα τα παιχνίδια, η Άνοδος και απεριόριστο Live — για όλη την οικογένεια.',en:'Every game, the Ascent and unlimited Live — for the whole family.'}) });

    let cycle = 'monthly', code = null;
    const grid = el('div',{class:'co-grid sc-stagger'});

    // ── left: cycle + code + card ──
    const left = el('div',{class:'co-col'});
    // billing cycle
    left.appendChild(el('div',{class:'co-seclbl'}, L({gr:'Κύκλος χρέωσης',en:'Billing cycle'})));
    const cyc = el('div',{class:'co-cycle'});
    [['monthly',{gr:'Μηνιαία',en:'Monthly'},money(PRICE.monthly)+L({gr:'/μήνα',en:'/mo'}),null],
     ['yearly',{gr:'Ετήσια',en:'Yearly'},money(PRICE.yearly)+L({gr:'/έτος',en:'/yr'}),{gr:'2 μήνες δώρο',en:'2 months free'}]].forEach(([v,lab,price,save])=>{
      const opt = el('button',{class:'co-cyc'+(v===cycle?' on':''), onclick:()=>{ cycle=v; cyc.querySelectorAll('.co-cyc').forEach(x=>x.classList.remove('on')); opt.classList.add('on'); paintSummary(); }},[
        el('span',{class:'co-cyc__nm'}, L(lab)), el('span',{class:'co-cyc__pr'}, price),
        save?el('span',{class:'co-cyc__save'}, L(save)):null ]);
      cyc.appendChild(opt);
    });
    left.appendChild(cyc);
    // redeem code
    left.appendChild(el('div',{class:'co-seclbl'}, L({gr:'Κωδικός έκπτωσης',en:'Discount code'})));
    const codeMsg = el('div',{class:'co-codemsg'});
    const codeIn = el('input',{class:'co-in', type:'text', placeholder:L({gr:'π.χ. ΠΑΙΔΕΙΑ50',en:'e.g. PAIDEIA50'}), style:'text-transform:uppercase'});
    const codeBtn = el('button',{class:'co-apply', onclick:()=>{
      const v = (codeIn.value||'').trim().toUpperCase();
      if(CODES[v]){ code = CODES[v]; codeMsg.className='co-codemsg ok'; codeMsg.textContent='✓ '+L(code.label); }
      else { code = null; codeMsg.className='co-codemsg err'; codeMsg.textContent=L({gr:'Άκυρος κωδικός',en:'Invalid code'}); }
      paintSummary();
    }}, L({gr:'Εφαρμογή',en:'Apply'}));
    left.appendChild(el('div',{class:'co-coderow'},[ codeIn, codeBtn ]));
    left.appendChild(codeMsg);
    // card (mock)
    left.appendChild(el('div',{class:'co-seclbl'}, L({gr:'Στοιχεία πληρωμής',en:'Payment details'})));
    left.appendChild(el('input',{class:'co-in', placeholder:L({gr:'Όνομα στην κάρτα',en:'Name on card'})}));
    left.appendChild(el('input',{class:'co-in', placeholder:'4242 4242 4242 4242', inputmode:'numeric'}));
    left.appendChild(el('div',{class:'co-cardrow'},[
      el('input',{class:'co-in', placeholder:L({gr:'ΜΜ/ΕΕ',en:'MM/YY'})}),
      el('input',{class:'co-in', placeholder:'CVC', inputmode:'numeric'}),
    ]));
    grid.appendChild(left);

    // ── right: order summary ──
    const right = el('div',{class:'co-col'});
    const sumCard = el('div',{class:'co-sum has-accent', style:`--ca:${accent}`});
    right.appendChild(sumCard);
    grid.appendChild(right);
    body.appendChild(grid);

    function totals(){
      let base = PRICE[cycle];
      let disc = 0;
      if(code){ disc = code.first ? (cycle==='monthly'?base:PRICE.monthly) : base*code.off; }
      const total = Math.max(0, base - disc);
      return { base, disc, total };
    }
    function paintSummary(){
      const { base, disc, total } = totals();
      sumCard.innerHTML='';
      sumCard.appendChild(el('div',{class:'co-sum__h'}, L({gr:'Σύνοψη παραγγελίας',en:'Order summary'})));
      const line = (a,b,cls)=>el('div',{class:'co-sum__line'+(cls?' '+cls:'')},[ el('span',{}, a), el('span',{}, b) ]);
      sumCard.appendChild(line('SymposiON Pro · '+L(cycle==='monthly'?{gr:'Μηνιαία',en:'Monthly'}:{gr:'Ετήσια',en:'Yearly'}), money(base)));
      if(disc>0) sumCard.appendChild(line(L(code.label), '−'+money(disc), 'disc'));
      sumCard.appendChild(el('div',{class:'co-sum__rule'}));
      sumCard.appendChild(line(el('b',{}, L({gr:'Σύνολο σήμερα',en:'Total today'})), el('b',{}, money(total)), 'total'));
      sumCard.appendChild(el('p',{class:'co-sum__fine'}, cycle==='monthly'
        ? L({gr:'Χρέωση κάθε μήνα. Ακύρωση όποτε θες.',en:'Billed monthly. Cancel anytime.'})
        : L({gr:'Χρέωση κάθε έτος. Ακύρωση όποτε θες.',en:'Billed yearly. Cancel anytime.'})));
      const pay = el('button',{class:'co-pay', onclick:()=>doPay(total)}, [ '🔒 ', L({gr:'Πλήρωσε',en:'Pay'})+' '+money(total) ]);
      sumCard.appendChild(pay);
      sumCard.appendChild(el('div',{class:'co-trust'}, L({gr:'Ασφαλής πληρωμή · Δοκιμαστικό περιβάλλον',en:'Secure payment · Demo environment'})));
    }
    function doPay(total){
      sumCard.innerHTML='';
      sumCard.appendChild(el('div',{class:'co-done'},[
        el('div',{class:'co-done__check'}, '✓'),
        el('div',{class:'co-done__t'}, L({gr:'Καλώς ήρθες στο Pro!',en:'Welcome to Pro!'})),
        el('div',{class:'co-done__d'}, L({gr:'Ξεκλειδώθηκαν όλα τα παιχνίδια, η Άνοδος & το απεριόριστο Live.',en:'Every game, the Ascent & unlimited Live are unlocked.'})),
        el('button',{class:'syn-cta syn-cta--solid', onclick:()=>go('account')}, L({gr:'Στον λογαριασμό μου',en:'Go to my account'})),
      ]));
      SS().set('plan','pro');
      if(window.gsap){ const r=sumCard.getBoundingClientRect();
        for(let i=0;i<18;i++){ const sp=document.createElement('span'); sp.style.cssText=`position:fixed;left:${r.left+r.width/2}px;top:${r.top+60}px;width:7px;height:7px;border-radius:50%;background:${accent};z-index:9999;pointer-events:none`; document.body.appendChild(sp);
          const a=Math.random()*Math.PI*2, d=40+Math.random()*70; gsap.to(sp,{x:Math.cos(a)*d,y:Math.sin(a)*d,opacity:0,scale:.3,duration:.7+Math.random()*.4,ease:'power2.out',onComplete:()=>sp.remove()}); } }
    }
    paintSummary();
  };
})();
