/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · CONSENT layer
   GDPR-minded age-gate + consent + parental-consent for minors, a cookie
   banner, and Terms / Privacy / Cookie modals. Runs BEFORE onboarding.
   NOTE: placeholder legal copy — replace with counsel-approved text.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const SS = () => window.SymStore;
  // Greek GDPR digital-consent age is 15; under it we require a guardian.
  const CONSENT_AGE = 15;
  const THIS_YEAR = new Date().getFullYear();   // auto-updates each year

  window.SymConsent = (function () {
    let ov, year, guardianSent, pendingDone;

    function consented(){ return !!SS().get('consent', 0); }

    // boot only shows the cookie bar now; the GDPR age-gate runs on SIGN-UP
    function start(){ cookieBanner(); }
    // called by the Sign-up flow: gate first-time users, then continue
    function requireConsent(onDone){
      if (consented()) { onDone && onDone(); return; }
      pendingDone = onDone || null;
      openGate();
    }

    function open(card){
      ov = el('div',{class:'ob-ov', role:'dialog','aria-modal':'true'});
      window.symApplyThemeClass(ov);
      ov.appendChild(card); ov._card = card;
      document.body.appendChild(ov);
      // reveal: rAF is throttled when the tab/iframe is backgrounded, so add a timeout fallback
      requestAnimationFrame(()=>ov.classList.add('in'));
      setTimeout(()=>{ if(ov) ov.classList.add('in'); }, 60);
    }
    function close(){ if(!ov) return; ov.classList.remove('in'); const o=ov; ov=null; setTimeout(()=>o.remove(),300); }

    function shell(){
      const card = el('div',{class:'ob-card'});
      const mark = el('div',{class:'ob-mark'}); mark.appendChild(brandMark()); card.appendChild(mark);
      return card;
    }

    function openGate(){ year=null; guardianSent=false; const c=shell(); ov?close():0; open(paintAge(c)); }

    function paintAge(card){
      card.innerHTML=''; const mark=el('div',{class:'ob-mark'}); mark.appendChild(brandMark()); card.appendChild(mark);
      card.appendChild(el('p',{class:'ob-eyebrow'}, L({gr:'Πριν ξεκινήσουμε',en:'Before we begin'})));
      card.appendChild(el('h2',{class:'ob-ttl', html:L({gr:'Πόσων <em>χρονών</em> είσαι;',en:'How <em>old</em> are you?'})}));
      card.appendChild(el('p',{class:'ob-sub'}, L({gr:'Το ζητάμε για να προστατεύσουμε τους νεότερους χρήστες, όπως ορίζει ο GDPR.',
        en:'We ask to protect younger users, as required by GDPR.'})));
      const sel = el('select',{class:'cg-year', onchange:(e)=>{ year=+e.target.value; cont.disabled=!year; }});
      sel.appendChild(el('option',{value:''}, L({gr:'Έτος γέννησης…',en:'Year of birth…'})));
      for(let y=THIS_YEAR-7; y>=THIS_YEAR-20; y--) sel.appendChild(el('option',{value:String(y)}, String(y)+'  ·  '+(THIS_YEAR-y)+' '+L({gr:'ετών',en:'yrs'})));
      card.appendChild(sel);
      const cont = el('button',{class:'syn-cta syn-cta--solid', disabled:'', onclick:()=>{
        const age = THIS_YEAR - year;
        SS().set('age_bracket', age < CONSENT_AGE ? 'minor' : (age<18?'teen':'adult'));
        paintConsent(card, false);                    // straight to Terms (no parental-consent step)
      }}, [ L({gr:'Συνέχεια',en:'Continue'}), el('span',{html:'&rarr;'}) ]);
      card.appendChild(el('div',{class:'ob-foot'}, [ cont ]));
      return card;
    }

    function paintGuardian(card){
      card.innerHTML=''; const mark=el('div',{class:'ob-mark'}); mark.appendChild(brandMark()); card.appendChild(mark);
      card.appendChild(el('p',{class:'ob-eyebrow'}, L({gr:'Συγκατάθεση γονέα',en:'Parental consent'})));
      card.appendChild(el('h2',{class:'ob-ttl', html:L({gr:'Χρειαζόμαστε έναν <em>γονέα</em>',en:'We need a <em>parent</em>'})}));
      card.appendChild(el('p',{class:'ob-sub'}, L({gr:'Είσαι κάτω των 15 — θα στείλουμε ένα email στον γονέα/κηδεμόνα σου για να εγκρίνει τον λογαριασμό.',
        en:'You’re under 15 — we’ll email your parent/guardian to approve the account.'})));
      const email = el('input',{class:'cg-year', type:'email', placeholder:L({gr:'Email γονέα/κηδεμόνα',en:'Parent/guardian email'})});
      card.appendChild(email);
      const status = el('p',{class:'cg-sent', style:'display:none'}, L({gr:'✓ Στείλαμε email επιβεβαίωσης. Μπορείς να συνεχίσεις την περιήγηση.',en:'✓ Confirmation email sent. You can keep exploring.'}));
      card.appendChild(status);
      const send = el('button',{class:'syn-cta syn-cta--ghost', onclick:()=>{
        if(!/.+@.+\..+/.test(email.value)){ email.classList.add('cg-err'); return; }
        email.classList.remove('cg-err'); guardianSent=true; status.style.display='block'; send.textContent=L({gr:'Στάλθηκε ✓',en:'Sent ✓'}); send.disabled=true;
      }}, L({gr:'Στείλε αίτημα',en:'Send request'}));
      card.appendChild(el('div',{class:'ob-foot'},[
        el('button',{class:'ob-back', onclick:()=>paintAge(card)}, '← '+L({gr:'Πίσω',en:'Back'})),
        send,
        el('button',{class:'syn-cta syn-cta--solid', onclick:()=>paintConsent(card, true)}, [ L({gr:'Συνέχεια',en:'Continue'}), el('span',{html:'&rarr;'}) ]),
      ]));
      return card;
    }

    function paintConsent(card, minor){
      card.innerHTML=''; const mark=el('div',{class:'ob-mark'}); mark.appendChild(brandMark()); card.appendChild(mark);
      card.appendChild(el('p',{class:'ob-eyebrow'}, L({gr:'Όροι & Απόρρητο',en:'Terms & Privacy'})));
      card.appendChild(el('h2',{class:'ob-ttl', html:L({gr:'Λίγα <em>νομικά</em>',en:'A little <em>legal</em>'})}));
      card.appendChild(el('p',{class:'ob-sub'}, minor
        ? L({gr:'Ο γονέας/κηδεμόνας σου αποδέχεται εκ μέρους σου. Ρίξε κι εσύ μια ματιά.',en:'Your parent/guardian accepts on your behalf. Have a look too.'})
        : L({gr:'Διάβασε και αποδέξου για να συνεχίσεις.',en:'Read and accept to continue.'})));

      const cTerms = check(L({gr:'Αποδέχομαι τους ',en:'I accept the '}), {gr:'Όρους Χρήσης',en:'Terms of Use'}, ()=>terms());
      const cPriv  = check(L({gr:'Διάβασα την ',en:'I’ve read the '}), {gr:'Πολιτική Απορρήτου',en:'Privacy Policy'}, ()=>privacy());
      const cMkt   = check(L({gr:'(Προαιρετικό) Θέλω ενημερώσεις & νέα.',en:'(Optional) Send me updates & news.'}, true), null, null);
      [cTerms, cPriv, cMkt].forEach(c=>card.appendChild(c.node));

      const go2 = el('button',{class:'syn-cta syn-cta--solid', disabled:'', onclick:()=>{
        SS().set('consent_marketing', cMkt.input.checked ? 1 : 0);
        SS().set('consent', 1);
        close(); var d=pendingDone; pendingDone=null; if(d) d();
      }}, [ L({gr:'Αποδοχή & συνέχεια',en:'Accept & continue'}), el('span',{html:'&rarr;'}) ]);
      function refresh(){ go2.disabled = !(cTerms.input.checked && cPriv.input.checked); }
      [cTerms,cPriv].forEach(c=>c.input.addEventListener('change', refresh));
      card.appendChild(el('div',{class:'ob-foot'},[
        el('button',{class:'ob-back', onclick:()=> paintAge(card)}, '← '+L({gr:'Πίσω',en:'Back'})),
        go2,
      ]));
      return card;
    }

    function check(pre, linkLabel, onlink, optional){
      const input = el('input',{type:'checkbox'});
      const lab = el('label',{class:'cg-check'},[ input, el('span',{}, [ pre,
        linkLabel ? el('a',{href:'javascript:void 0', class:'cg-link', onclick:(e)=>{ e.preventDefault(); onlink&&onlink(); }}, L(linkLabel)) : null ]) ]);
      return { node:lab, input };
    }

    /* ── legal modals ── */
    function legal(title, blocks){
      const m = el('div',{class:'ob-ov in', style:'z-index:9200'});
      window.symApplyThemeClass(m);
      const card = el('div',{class:'ob-card', style:'max-width:600px'});
      card.appendChild(el('button',{class:'ob-skip', html:'&times;', onclick:()=>m.remove()}));
      card.appendChild(el('h2',{class:'ob-ttl', style:'font-size:26px;margin-bottom:14px'}, L(title)));
      const body = el('div',{class:'cg-legal'});
      blocks.forEach(b=>{ body.appendChild(el('h4',{}, L(b.h))); body.appendChild(el('p',{}, L(b.p))); });
      body.appendChild(el('p',{class:'cg-legal__note'}, L({gr:'— Δείγμα κειμένου για το πρωτότυπο. Αντικαταστήστε με εγκεκριμένο νομικό κείμενο.',
        en:'— Placeholder copy for the prototype. Replace with counsel-approved text.'})));
      card.appendChild(body);
      card.appendChild(el('div',{class:'ob-foot'},[ el('button',{class:'syn-cta syn-cta--solid', onclick:()=>m.remove()}, L({gr:'Κλείσιμο',en:'Close'})) ]));
      m.appendChild(card); document.body.appendChild(m);
    }
    function terms(){ legal({gr:'Όροι Χρήσης',en:'Terms of Use'},[
      { h:{gr:'Η υπηρεσία',en:'The service'}, p:{gr:'Το SymposiON είναι εκπαιδευτική πλατφόρμα παιχνιδιών για μαθητές, καθηγητές και γονείς.',en:'SymposiON is an educational game platform for students, teachers and parents.'} },
      { h:{gr:'Λογαριασμοί',en:'Accounts'}, p:{gr:'Οι χρήστες κάτω των 15 χρειάζονται συγκατάθεση γονέα/κηδεμόνα.',en:'Users under 15 require parent/guardian consent.'} },
      { h:{gr:'Ορθή χρήση',en:'Acceptable use'}, p:{gr:'Παίξε τίμια — απαγορεύονται κατάχρηση, παρενόχληση και παράκαμψη ασφαλείας.',en:'Play fair — abuse, harassment and security circumvention are prohibited.'} },
    ]); }
    function privacy(){ legal({gr:'Πολιτική Απορρήτου',en:'Privacy Policy'},[
      { h:{gr:'Τι συλλέγουμε',en:'What we collect'}, p:{gr:'Στοιχεία λογαριασμού, πρόοδο μάθησης και βασικά αναλυτικά χρήσης.',en:'Account details, learning progress and basic usage analytics.'} },
      { h:{gr:'Ανήλικοι',en:'Minors'}, p:{gr:'Για παιδιά κάτω των 15 επεξεργαζόμαστε δεδομένα μόνο με γονική συγκατάθεση.',en:'For children under 15 we process data only with parental consent.'} },
      { h:{gr:'Τα δικαιώματά σου',en:'Your rights'}, p:{gr:'Πρόσβαση, διόρθωση και διαγραφή δεδομένων ανά πάσα στιγμή από τις Ρυθμίσεις.',en:'Access, correct and delete your data anytime from Settings.'} },
    ]); }

    /* ── cookie banner ── */
    function cookieBanner(){
      if (SS().get('cookie_consent', null) !== null) return;
      if (document.querySelector('.ck-bar')) return;
      const bar = el('div',{class:'ck-bar'});
      window.symApplyThemeClass(bar);
      bar.appendChild(el('div',{class:'ck-bar__t'}, [
        el('b',{}, L({gr:'Cookies 🍪',en:'Cookies 🍪'})), ' ',
        L({gr:'Χρησιμοποιούμε απαραίτητα cookies και — με τη συγκατάθεσή σου — αναλυτικά. ',
           en:'We use essential cookies and — with your consent — analytics. '}),
        el('a',{class:'cg-link', href:'javascript:void 0', onclick:(e)=>{ e.preventDefault(); privacy(); }}, L({gr:'Μάθε περισσότερα',en:'Learn more'})),
      ]));
      const set = (v)=>{ SS().set('cookie_consent', v); bar.classList.remove('in'); document.body.classList.remove('ck-bar-open'); setTimeout(()=>bar.remove(),250); };
      bar.appendChild(el('div',{class:'ck-bar__btns'},[
        el('button',{class:'ck-btn ck-btn--ghost', onclick:()=>set('necessary')}, L({gr:'Μόνο απαραίτητα',en:'Necessary only'})),
        el('button',{class:'ck-btn ck-btn--solid', onclick:()=>set('all')}, L({gr:'Αποδοχή όλων',en:'Accept all'})),
      ]));
      document.body.appendChild(bar);
      document.body.classList.add('ck-bar-open');   // reserve page space so the fixed bar never covers content
      requestAnimationFrame(()=>bar.classList.add('in'));
      setTimeout(()=>bar.classList.add('in'), 60);
    }

    return { start, requireConsent, terms, privacy, cookieBanner, reset:()=>{ SS().set('consent',0); openGate(); } };
  })();
})();
