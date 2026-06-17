/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · STUDENT layer
   • window.SYM_SCREENS.assignments — student homework inbox
   • window.SymOnboard — first-visit onboarding (role → grade → guide)
   • window.SymGuide  — toggleable assistant / coach-tip mode
   Vanilla, token-driven, bilingual, persisted via SymStore.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const go = (s, p) => window.symGo(s, p);
  const P  = window.synPage;
  const SS = () => window.SymStore;
  const glyph = (name, cls) => el('span', { class:(cls||'sc-gl'), 'data-illu':name });
  const stat = (v, label, accent) => el('div', { class:'sc-stat has-accent', style:`--ca:${accent||'#C18A2C'}` },
    [ el('div',{class:'sc-stat__v'}, v), el('div',{class:'sc-stat__l'}, label) ]);

  /* ───────────────────────── HOMEWORK DATA ─────────────────────────
     Mirrors the teacher "Assignments" tab shape (task · turn-in · status)
     from the student's side. due = days from today (negative = overdue). */
  const HW = [
    { id:'hw-iliad',  subj:{gr:'Αρχαία',en:'Ancient Greek'}, ac:'#2F6F8E', illu:'scroll',
      ttl:{gr:'Ιλιάδα — Trivia, Ραψωδία Γ',en:'Iliad — Trivia, Rhapsody III'},
      teacher:'κ. Καραγιάννη', klass:'Β1', due:1, prog:0, type:'mc' },
    { id:'hw-verbs',  subj:{gr:'Γραμματική',en:'Grammar'}, ac:'#6E8B3D', illu:'quill',
      ttl:{gr:'Ρήματα — Κλίση Ενεστώτα',en:'Verbs — Present tense conjugation'},
      teacher:'κ. Καραγιάννη', klass:'Β1', due:3, prog:40, type:'lyo' },
    { id:'hw-latin',  subj:{gr:'Λατινικά',en:'Latin'}, ac:'#7C5AC2', illu:'column',
      ttl:{gr:'Β΄ Κλίση — Κατάταξη ουσιαστικών',en:'2nd Declension — Noun sorting'},
      teacher:'κ. Δημητρίου', klass:'Β1', due:-1, prog:15, type:'latin' },
    { id:'hw-history',subj:{gr:'Ιστορία',en:'History'}, ac:'#C18A2C', illu:'amphora',
      ttl:{gr:'Περσικοί Πόλεμοι — Quiz',en:'Persian Wars — Quiz'},
      teacher:'κ. Παππά', klass:'Β1', due:5, prog:0, type:'mc' },
    { id:'hw-vocab',  subj:{gr:'Λεξιλόγιο',en:'Vocabulary'}, ac:'#B0395A', illu:'book',
      ttl:{gr:'Ομηρικό λεξιλόγιο — Κάρτες',en:'Homeric vocabulary — Flashcards'},
      teacher:'κ. Καραγιάννη', klass:'Β1', due:7, prog:60, type:'flash' },
  ];

  function hwDone(){ return SS().get('hw_done', []); }
  function isDone(id){ return hwDone().indexOf(id) >= 0; }
  function setDone(id, on){
    const d = hwDone(); const i = d.indexOf(id);
    if(on && i<0) d.push(id); else if(!on && i>=0) d.splice(i,1);
    SS().set('hw_done', d);
  }
  function statusOf(h){ return isDone(h.id) ? 'done' : (h.due < 0 ? 'over' : 'todo'); }
  function dueLabel(h){
    if(isDone(h.id)) return L({gr:'Παραδόθηκε',en:'Turned in'});
    if(h.due < 0)  return L({gr:'Εκπρόθεσμη',en:'Overdue'});
    if(h.due === 0) return L({gr:'Λήγει σήμερα',en:'Due today'});
    if(h.due === 1) return L({gr:'Λήγει αύριο',en:'Due tomorrow'});
    return L({gr:'Λήγει σε '+h.due+' μέρες',en:'Due in '+h.due+' days'});
  }

  window.SYM_SCREENS = window.SYM_SCREENS || {};
  window.SYM_SCREENS.assignments = function (home, ctx) {
    const accent = '#2F6F8E';
    const filter = (ctx.param && ctx.param.filter) || 'all';
    const body = P(home, { back:'home', accent,
      eyebrow:L({gr:'Οι εργασίες μου',en:'My homework'}),
      title:L({gr:'Εργασίες',en:'Assignments'}),
      sub:L({gr:'Ό,τι σου ανέθεσαν οι καθηγητές σου — με προθεσμίες και πρόοδο.',
             en:'Everything your teachers assigned — with deadlines and progress.'}) });

    const todo = HW.filter(h=>statusOf(h)==='todo' || statusOf(h)==='over');
    const doneN = HW.filter(h=>statusOf(h)==='done').length;
    const soon = todo.filter(h=>h.due>=0 && h.due<=7).length + HW.filter(h=>statusOf(h)==='over').length;
    body.appendChild(el('div',{class:'sc-stats sc-stagger'},[
      stat(String(soon), L({gr:'Λήγουν σύντομα',en:'Due soon'}), accent),
      stat(String(doneN)+'/'+HW.length, L({gr:'Ολοκληρωμένες',en:'Completed'}), accent),
      stat('7', L({gr:'Μέρες σερί',en:'Day streak'}), accent),
    ]));

    // filter chips
    const FILTERS = [['all',{gr:'Όλες',en:'All'}],['todo',{gr:'Προς παράδοση',en:'To do'}],
      ['done',{gr:'Ολοκληρωμένες',en:'Done'}],['over',{gr:'Εκπρόθεσμες',en:'Overdue'}]];
    body.appendChild(el('div',{class:'hw-fil sc-stagger'}, FILTERS.map(([id,lab])=>
      el('button',{ class:'sc-fil'+(id===filter?' active':''), onclick:()=>go('assignments',{filter:id}) },
        L(lab)) )));

    const shown = HW.filter(h=>{
      const st = statusOf(h);
      if(filter==='all') return true;
      if(filter==='todo') return st==='todo' || st==='over';
      return st===filter;
    });

    if(!shown.length){
      body.appendChild(el('div',{class:'hw-empty sc-stagger'},[
        el('div',{class:'hw-empty__ic','data-illu':'wreath-laurel'}),
        el('h3',{class:'hw-empty__t'}, filter==='done'
          ? L({gr:'Τίποτα ολοκληρωμένο ακόμη',en:'Nothing completed yet'})
          : L({gr:'Καθαρά! Καμία εκκρεμότητα',en:'All clear! Nothing due'})),
        el('p',{class:'hw-empty__d'}, L({gr:'Όταν ο καθηγητής σου αναθέσει μια εργασία, θα εμφανιστεί εδώ.',
          en:'When your teacher assigns work, it will show up here.'})),
      ]));
      if(window.injectIllus) injectIllus(body);
      return;
    }

    const list = el('div',{class:'hw-list sc-stagger'});
    shown.forEach(h=>{
      const st = statusOf(h);
      const card = el('div',{ class:'hw-card'+(st==='done'?' done':''), 'data-illu':null, style:`--ca:${h.ac}` });
      card.appendChild(el('div',{class:'hw-card__ic'},[ glyph(h.illu) ]));
      card.appendChild(el('div',{class:'hw-card__b'},[
        el('div',{class:'hw-card__meta'},[
          el('span',{class:'hw-card__subj'}, L(h.subj)),
          el('span',{class:'hw-card__from'}, h.teacher+' · '+h.klass),
        ]),
        el('h3',{class:'hw-card__ttl'}, L(h.ttl)),
        el('div',{class:'hw-card__bar'},[ el('span',{class:'hw-card__barf', style:`width:${st==='done'?100:h.prog}%`}) ]),
      ]));
      const dueCls = st==='over' ? ' hw-due--over' : (h.due<=1 ? ' hw-due--soon' : '');
      const badge = el('span',{class:'hw-badge hw-badge--'+(st==='done'?'done':st==='over'?'over':'todo')},
        st==='done'?L({gr:'Έτοιμη',en:'Done'}):st==='over'?L({gr:'Εκπρόθεσμη',en:'Late'}):L({gr:'Εκκρεμεί',en:'To do'}));
      let action;
      if(st==='done'){
        action = el('button',{class:'hw-go hw-go--undo', onclick:()=>{ setDone(h.id,false); symRender(); }},
          L({gr:'Αναίρεση',en:'Undo'}));
      } else {
        action = el('button',{class:'hw-go', onclick:()=>startHw(h)}, [ L({gr:'Ξεκίνα',en:'Start'}), ' →' ]);
      }
      card.appendChild(el('div',{class:'hw-card__r'},[
        el('span',{class:'hw-due'+dueCls}, dueLabel(h)), badge, action ]));
      list.appendChild(card);
    });
    body.appendChild(list);

    body.appendChild(el('p',{class:'sc-hint sc-stagger', style:'margin-top:18px'},
      L({gr:'Ολοκλήρωσε μια εργασία για να κερδίσεις Kleos και να ανεβάσεις το σερί σου.',
         en:'Complete an assignment to earn Kleos and keep your streak alive.'})));

    if(window.injectIllus) injectIllus(body);
  };

  /* ───────────────────────── PARENT DASHBOARD ──────────────────── */
  const CHILD = { name:'Αλέξης', en:'Alex', klass:'Β1 Γυμνασίου', clsId:'gym-b',
    illu:'owl', level:13, streak:7, acc:84, hours:'5,4' };
  const SUBJ_MASTERY = [
    { s:{gr:'Αρχαία',en:'Ancient Greek'}, v:78, ac:'#2F6F8E' },
    { s:{gr:'Γραμματική',en:'Grammar'},   v:64, ac:'#6E8B3D' },
    { s:{gr:'Ιστορία',en:'History'},      v:88, ac:'#C18A2C' },
    { s:{gr:'Λατινικά',en:'Latin'},       v:41, ac:'#7C5AC2' },
  ];

  function linkChildPrompt(){
    try { window.prompt(L({gr:'Βάλε τον 6ψήφιο κωδικό που έδωσε το παιδί σου:',
      en:'Enter the 6-character code your child shared:'}), 'ΑΛΕΞ24'); } catch(_){}
  }

  window.SYM_SCREENS.parent = function (home, ctx) {
    const accent = '#B0395A';
    const child = L({gr:CHILD.name, en:CHILD.en});
    const body = P(home, { back:'home', accent,
      eyebrow:L({gr:'Γονικός Πίνακας',en:'Parent dashboard'}),
      title:L({gr:'Η πρόοδος του παιδιού σου',en:'Your child’s progress'}),
      sub:L({gr:'Παρακολούθησε μάθηση, εργασίες και συνδρομή — όλα σε μία οθόνη.',
             en:'Follow learning, homework and billing — all in one place.'}),
      actions:[ el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:linkChildPrompt },
        [ '＋ ', L({gr:'Σύνδεση παιδιού',en:'Link a child'}) ]) ] });

    // child header
    body.appendChild(el('div',{class:'par-child sc-stagger has-accent', style:`--ca:${accent}`},[
      el('span',{class:'par-child__av','data-illu':CHILD.illu}),
      el('div',{class:'par-child__b'},[
        el('div',{class:'par-child__n'}, child),
        el('div',{class:'par-child__m'}, CHILD.klass+' · '+L({gr:'Επίπεδο',en:'Level'})+' '+CHILD.level),
      ]),
      el('button',{class:'par-switch', onclick:linkChildPrompt}, L({gr:'Αλλαγή',en:'Switch'})),
    ]));

    // stats
    const doneN = HW.filter(h=>statusOf(h)==='done').length;
    body.appendChild(el('div',{class:'sc-stats sc-stagger'},[
      stat(String(CHILD.streak), L({gr:'Μέρες σερί',en:'Day streak'}), accent),
      stat(CHILD.acc+'%', L({gr:'Ακρίβεια',en:'Accuracy'}), accent),
      stat(CHILD.hours+'ω', L({gr:'Ώρες/εβδ.',en:'Hrs/week'}), accent),
      stat(doneN+'/'+HW.length, L({gr:'Εργασίες',en:'Homework'}), accent),
    ]));

    // mastery by subject
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Επίδοση ανά μάθημα',en:'Mastery by subject'})));
    const mast = el('div',{class:'par-mastery sc-stagger'});
    SUBJ_MASTERY.forEach(m=> mast.appendChild(el('div',{class:'par-mrow'},[
      el('span',{class:'par-mrow__s'}, L(m.s)),
      el('div',{class:'par-mrow__bar'},[ el('span',{class:'par-mrow__f', style:`width:${m.v}%;background:${m.ac}`}) ]),
      el('span',{class:'par-mrow__v'}, m.v+'%'),
    ])));
    body.appendChild(mast);

    // homework status (read-only for the parent + a nudge)
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Εργασίες',en:'Homework'})));
    const hwl = el('div',{class:'par-hw sc-stagger'});
    HW.slice(0,4).forEach(h=>{ const st=statusOf(h);
      hwl.appendChild(el('div',{class:'par-hwrow'},[
        el('span',{class:'par-hwrow__dot', style:`background:${h.ac}`}),
        el('span',{class:'par-hwrow__t'}, L(h.ttl)),
        el('span',{class:'hw-badge hw-badge--'+(st==='done'?'done':st==='over'?'over':'todo')},
          st==='done'?L({gr:'Έτοιμη',en:'Done'}):st==='over'?L({gr:'Εκπρόθεσμη',en:'Late'}):L({gr:'Εκκρεμεί',en:'To do'})),
        st!=='done'
          ? el('button',{class:'par-remind', onclick:(e)=>{ e.currentTarget.textContent=L({gr:'Στάλθηκε ✓',en:'Sent ✓'}); e.currentTarget.disabled=true; }}, L({gr:'Υπενθύμιση',en:'Remind'}))
          : el('span',{class:'par-remind par-remind--ok'}, '✓'),
      ])); });
    body.appendChild(hwl);

    // recent activity
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Πρόσφατη δραστηριότητα',en:'Recent activity'})));
    [['✓',{gr:'Ολοκλήρωσε «Ιλιάδα Trivia» — 92%',en:'Finished “Iliad Trivia” — 92%'},'5′'],
     ['⚡',{gr:'Έπαιξε Live Arena με την τάξη',en:'Played Live Arena with the class'},'2ω'],
     ['◆',{gr:'Ανέβηκε στο Επίπεδο 13',en:'Reached Level 13'},'1μ'],
     ['❂',{gr:'Επανάληψη Tartarus — 18 κάρτες',en:'Tartarus review — 18 cards'},'2μ']].forEach(a=>
      body.appendChild(el('div',{class:'sc-act sc-stagger'},[ el('span',{class:'sc-act__ic'}, a[0]),
        el('span',{class:'sc-act__t'}, L(a[1])), el('span',{class:'sc-act__tm'}, a[2]) ])));

    // billing
    const plan = SS().get('plan','free');
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Συνδρομή & χρέωση',en:'Subscription & billing'})));
    body.appendChild(el('div',{class:'par-bill sc-stagger has-accent', style:`--ca:${accent}`},[
      el('div',{class:'par-bill__b'},[
        el('div',{class:'par-bill__plan'}, plan==='pro'?'SymposiON Pro':L({gr:'Δωρεάν πλάνο',en:'Free plan'})),
        el('div',{class:'par-bill__m'}, plan==='pro'
          ? L({gr:'Ανανεώνεται 15 Ιουλ 2026 · €4,99/μήνα',en:'Renews Jul 15 2026 · €4.99/mo'})
          : L({gr:'Ξεκλείδωσε όλα τα παιχνίδια, την Άνοδο & απεριόριστο Live.',en:'Unlock every game, the Ascent & unlimited Live.'})),
      ]),
      el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>go(plan==='pro'?'account':'checkout')},
        plan==='pro'?L({gr:'Διαχείριση',en:'Manage'}):L({gr:'Αναβάθμιση',en:'Upgrade'})),
    ]));

    if(window.injectIllus) injectIllus(body);
  };

  // start → open the matching game preview, then offer to mark done
  function startHw(h){
    if(window.SymPreview && SymPreview.open){
      SymPreview.open(h.type, { title:L(h.ttl), note:L({gr:'Demo — η πραγματική εργασία ανοίγει το παιχνίδι.',
        en:'Demo — the real assignment launches the game.'}) });
    }
    // mark complete + small reward (prototype)
    setDone(h.id, true);
    const k = SS().get('kleos', 0); SS().set('kleos', k + 40);
    setTimeout(()=>{ if(window.STATE && STATE.screen==='assignments') symRender(); }, 350);
  }

  /* ───────────────────────── ONBOARDING ─────────────────────────── */
  window.SymOnboard = (function(){
    let ov, step, role, classId, guideOn;
    function isDoneOb(){ return !!SS().get('onboarded', 0); }

    function maybeStart(){ if(!isDoneOb()) open(); }
    function reset(){ SS().set('onboarded', 0); open(); }

    function open(){
      step = 0; role = null; classId = window.STATE ? STATE.classId : 'gym-b'; guideOn = true;
      ov = el('div',{class:'ob-ov', role:'dialog', 'aria-modal':'true'});
      window.symApplyThemeClass(ov);
      const card = el('div',{class:'ob-card'});
      ov.appendChild(card);
      ov._card = card;
      document.body.appendChild(ov);
      paint();
      requestAnimationFrame(()=>ov.classList.add('in'));
      setTimeout(()=>{ if(ov) ov.classList.add('in'); }, 60);
    }
    function close(){ if(!ov) return; ov.classList.remove('in'); const o=ov; ov=null; setTimeout(()=>o.remove(),300); }

    function finish(){
      SS().set('onboarded', 1);
      SS().set('guide_mode', guideOn ? 1 : 0);
      if(window.STATE){
        STATE.role = role || 'student';                     // keep the chosen role (teacher/parent/student)
        if(role==='student' && classId) STATE.classId = classId;
      }
      close();
      if(window.SymGuide) SymGuide.sync();
      go(role==='teacher' ? 'anathesi' : role==='parent' ? 'parent' : 'home');
    }

    function dots(n){
      const total = role==='teacher' ? 2 : 3;
      return el('div',{class:'ob-dots'}, Array.from({length:total},(_,i)=>el('span',{class:i<=n?'on':''})));
    }

    function paint(){
      const card = ov._card; card.innerHTML='';
      card.appendChild(el('button',{class:'ob-skip', onclick:()=>{ SS().set('onboarded',1); close(); }},
        L({gr:'Παράλειψη',en:'Skip'})));
      const mark = el('div',{class:'ob-mark'}); mark.appendChild(brandMark()); card.appendChild(mark);

      if(step===0){ stepRole(card); }
      else if(step===1 && role==='student'){ stepGrade(card); }
      else if(step===1 && role==='parent'){ stepLinkChild(card); }
      else { stepFinish(card); }
      if(window.injectIllus) injectIllus(card);
    }

    function stepRole(card){
      card.appendChild(dots(0));
      card.appendChild(el('p',{class:'ob-eyebrow'}, 'SymposiON'));
      card.appendChild(el('h2',{class:'ob-ttl', html:L({gr:'Καλωσήρθες στο <em>Συμπόσιο</em>',en:'Welcome to the <em>Symposion</em>'})}));
      card.appendChild(el('p',{class:'ob-sub'}, L({gr:'Πες μας ποιος είσαι — θα στήσουμε τα πάντα στα μέτρα σου.',
        en:'Tell us who you are — we’ll set everything up for you.'})));
      const roles = el('div',{class:'ob-roles'});
      const mk = (id, ic, nm, ds) => { const c = el('button',{class:'ob-role'+(role===id?' sel':''),
        onclick:()=>{ role=id; step=1; paint(); }},[
        el('span',{class:'ob-role__ic','data-illu':ic}),
        el('span',{class:'ob-role__nm'}, L(nm)), el('span',{class:'ob-role__ds'}, L(ds)) ]); return c; };
      roles.appendChild(mk('student','owl', {gr:'Μαθητής',en:'Student'}, {gr:'Παίξε, μάθε, ανέβα επίπεδα.',en:'Play, learn, level up.'}));
      roles.appendChild(mk('teacher','quill', {gr:'Καθηγητής',en:'Teacher'}, {gr:'Φτιάξε τάξη & ανάθεσε εργασίες.',en:'Build a class & assign work.'}));
      card.appendChild(roles);
      const parent = el('button',{class:'ob-role'+(role==='parent'?' sel':''), style:'margin-top:12px;width:100%;flex-direction:row;align-items:center;gap:14px',
        onclick:()=>{ role='parent'; step=1; paint(); }},[
        el('span',{class:'ob-role__ic','data-illu':'wreath-laurel'}),
        el('span',{},[ el('span',{class:'ob-role__nm', style:'display:block'}, L({gr:'Γονέας',en:'Parent'})),
          el('span',{class:'ob-role__ds'}, L({gr:'Δες την πρόοδο του παιδιού σου.',en:'Follow your child’s progress.'})) ]) ]);
      card.appendChild(parent);
    }

    function stepGrade(card){
      card.appendChild(dots(1));
      card.appendChild(el('p',{class:'ob-eyebrow'}, L({gr:'Βήμα 2',en:'Step 2'})));
      card.appendChild(el('h2',{class:'ob-ttl', html:L({gr:'Σε ποια <em>τάξη</em> είσαι;',en:'Which <em>class</em> are you in?'})}));
      card.appendChild(el('p',{class:'ob-sub'}, L({gr:'Θα σου δείξουμε την ύλη και τα παιχνίδια της τάξης σου.',
        en:'We’ll show the right material and games for your class.'})));
      const classes = (window.SYM && SYM.CLASSES) || [];
      const groups = [['gym',{gr:'Γυμνάσιο',en:'Gymnasio'}],['lyk',{gr:'Λύκειο',en:'Lykeio'}]];
      groups.forEach(([pre,lab])=>{
        const grp = el('div',{class:'ob-gradegrp'});
        grp.appendChild(el('div',{class:'ob-gradegrp__h'}, L(lab)));
        const row = el('div',{class:'ob-grades'});
        classes.filter(c=>c.id.indexOf(pre)===0).forEach(c=>{
          const sel = classId===c.id;
          row.appendChild(el('button',{ class:'ob-grade'+(sel?' sel':''),
            style: sel?`background:${c.accent};border-color:${c.accent}`:`border-color:${c.accent}`,
            onclick:()=>{ classId=c.id; paint(); }},[
            el('span',{class:'ob-grade__rom', style:`background:${c.accent}`}, c.roman),
            L(c) ]));
        });
        grp.appendChild(row);
        card.appendChild(grp);
      });
      card.appendChild(el('div',{class:'ob-foot'},[
        el('button',{class:'ob-back', onclick:()=>{ step=0; paint(); }}, '← '+L({gr:'Πίσω',en:'Back'})),
        el('button',{class:'syn-cta syn-cta--solid', onclick:()=>{ step=2; paint(); }},
          [ L({gr:'Συνέχεια',en:'Continue'}), el('span',{html:'&rarr;'}) ]),
      ]));
    }

    function stepLinkChild(card){
      card.appendChild(dots(1));
      card.appendChild(el('p',{class:'ob-eyebrow'}, L({gr:'Βήμα 2',en:'Step 2'})));
      card.appendChild(el('h2',{class:'ob-ttl', html:L({gr:'Σύνδεσε το <em>παιδί</em> σου',en:'Link your <em>child</em>'})}));
      card.appendChild(el('p',{class:'ob-sub'}, L({gr:'Βάλε τον 6ψήφιο κωδικό από τον λογαριασμό του παιδιού σου. Μπορείς και αργότερα.',
        en:'Enter the 6-character code from your child’s account. You can do this later too.'})));
      const inp = el('input',{class:'syn-join__pin', type:'text', maxlength:'6', placeholder:'ΑΛΕΞ24',
        style:'width:100%;font-family:var(--disp);font-size:20px;letter-spacing:.3em;text-align:center;text-transform:uppercase;padding:14px;border-radius:14px;border:1.5px solid var(--line-bold);background:var(--bg);color:var(--fg);margin-bottom:20px'});
      card.appendChild(inp);
      card.appendChild(el('div',{class:'ob-foot'},[
        el('button',{class:'ob-back', onclick:()=>{ step=0; paint(); }}, '← '+L({gr:'Πίσω',en:'Back'})),
        el('button',{class:'syn-cta syn-cta--ghost', onclick:()=>{ step=2; paint(); }}, L({gr:'Παράλειψη',en:'Skip'})),
        el('button',{class:'syn-cta syn-cta--solid', onclick:()=>{ step=2; paint(); }},
          [ L({gr:'Σύνδεση',en:'Link'}), el('span',{html:'&rarr;'}) ]),
      ]));
    }

    function stepFinish(card){
      card.appendChild(dots(role==='teacher'?1:2));
      card.appendChild(el('p',{class:'ob-eyebrow'}, L({gr:'Έτοιμοι',en:'All set'})));
      card.appendChild(el('h2',{class:'ob-ttl', html:L({gr:'Είσαι <em>έτοιμος</em>',en:'You’re <em>ready</em>'})}));
      card.appendChild(el('p',{class:'ob-sub'}, role==='teacher'
        ? L({gr:'Θα σε πάμε στην Κονσόλα Καθηγητή για να φτιάξεις την πρώτη σου τάξη.',
             en:'We’ll take you to the Teacher Console to build your first class.'})
        : role==='parent'
        ? L({gr:'Θα σε πάμε στον Γονικό Πίνακα για να δεις την πρόοδο του παιδιού σου. Θες έναν οδηγό;',
             en:'We’ll take you to the Parent dashboard to see your child’s progress. Want a guide?'})
        : L({gr:'Θα σε πάμε στην αρχική. Θες έναν οδηγό να σε ξεναγεί στην αρχή;',
             en:'We’ll drop you on the home screen. Want a guide to show you around?'})));
      const sw = el('button',{class:'ob-switch'+(guideOn?' on':''), 'aria-label':'guide',
        onclick:(e)=>{ guideOn=!guideOn; e.currentTarget.classList.toggle('on',guideOn); }});
      card.appendChild(el('div',{class:'ob-guide-row'},[
        el('span',{class:'ob-role__ic', style:'width:30px;height:30px','data-illu':'philosopher'}),
        el('div',{class:'ob-guide-row__b'},[
          el('div',{class:'ob-guide-row__t'}, L({gr:'Λειτουργία Οδηγού',en:'Guide mode'})),
          el('div',{class:'ob-guide-row__d'}, L({gr:'Σύντομες συμβουλές σε κάθε οθόνη. Σβήνει όποτε θες.',
            en:'Short tips on each screen. Turn it off anytime.'})),
        ]),
        sw,
      ]));
      card.appendChild(el('div',{class:'ob-foot'},[
        el('button',{class:'ob-back', onclick:()=>{ step = role==='teacher'?0:1; paint(); }}, '← '+L({gr:'Πίσω',en:'Back'})),
        el('button',{class:'syn-cta syn-cta--solid', onclick:finish},
          [ role==='teacher'?L({gr:'Στην Κονσόλα',en:'To the Console'}):role==='parent'?L({gr:'Στον Πίνακα',en:'To the dashboard'}):L({gr:'Μπες',en:'Enter'}), el('span',{html:'&rarr;'}) ]),
      ]));
    }

    return { maybeStart, open, reset };
  })();

  /* ───────────────────────── GUIDE MODE ─────────────────────────── */
  window.SymGuide = (function(){
    let fab, tip, dismissed = {};
    const TIPS = {
      home:        { w:{gr:'Αρχική',en:'Home'}, t:{gr:'Από εδώ ξεκινούν όλα',en:'Everything starts here'},
        d:{gr:'Διάλεξε την τάξη σου από τα κουμπιά, ή πάτα «Πίνακας» για όλα τα παιχνίδια.',en:'Pick your class from the chips, or open the Panel for every game.'},
        more:[ {gr:'Τα χρωματιστά κουμπιά είναι οι τάξεις σου.',en:'The coloured chips are your classes.'},
          {gr:'«Δοκίμασέ το» ανοίγει ένα παιχνίδι αμέσως.',en:'“Try now” opens a game instantly.'},
          {gr:'Το ⚡ Live μπαίνει σε ζωντανό παιχνίδι με την τάξη.',en:'⚡ Live joins a real-time class match.'} ] },
      assignments: { w:{gr:'Εργασίες',en:'Homework'}, t:{gr:'Οι εργασίες σου',en:'Your homework'},
        d:{gr:'Δες τι λήγει σύντομα, πάτα «Ξεκίνα» και κέρδισε Kleos ολοκληρώνοντας.',en:'See what’s due soon, hit Start, and earn Kleos by finishing.'},
        more:[ {gr:'Φίλτραρε: Όλες · Προς παράδοση · Έτοιμες · Εκπρόθεσμες.',en:'Filter: All · To-do · Done · Overdue.'},
          {gr:'Η μπάρα δείχνει πόσο έχεις προχωρήσει.',en:'The bar shows how far you’ve got.'},
          {gr:'«Ξεκίνα» ανοίγει το παιχνίδι της εργασίας.',en:'“Start” opens the assignment’s game.'} ] },
      gamepanel:   { w:{gr:'Πίνακας',en:'Game Panel'}, t:{gr:'Όλες οι μηχανές',en:'Every engine'},
        d:{gr:'Διάλεξε μηχανή παιχνιδιού και ταίριαξέ τη με την ύλη σου.',en:'Choose a game engine and pair it with your material.'} },
      temple:      { w:{gr:'Ἀγορά',en:'Agora'}, t:{gr:'Ξόδεψε το Kleos σου',en:'Spend your Kleos'},
        d:{gr:'Ξεκλείδωσε θέματα, ακρωτήρια και εφέ για την αρχική σου.',en:'Unlock themes, acroteria and effects for your home.'} },
      anodos:      { w:{gr:'Άνοδος',en:'Anodos'}, t:{gr:'Σκαρφάλωσε στον Όλυμπο',en:'Climb to Olympus'},
        d:{gr:'Ανέβα σκαλί-σκαλί απαντώντας γρίφους — κάθε run είναι διαφορετικό.',en:'Rise tier by tier solving riddles — every run is different.'} },
      live:        { w:{gr:'Live Arena',en:'Live Arena'}, t:{gr:'Παίξε ζωντανά',en:'Play live'},
        d:{gr:'Φιλοξένησε ή μπες σε παιχνίδι με συμμαθητές σε πραγματικό χρόνο.',en:'Host or join a real-time match with classmates.'} },
      tartarus:    { w:{gr:'Tartarus',en:'Tartarus'}, t:{gr:'Διόρθωσε τα λάθη σου',en:'Fix your mistakes'},
        d:{gr:'Επανάληψη με κάρτες στα σημεία που δυσκολεύεσαι πιο πολύ.',en:'Spaced-repetition review on whatever trips you up most.'} },
      profile:     { w:{gr:'Προφίλ',en:'Profile'}, t:{gr:'Ο ήρωάς σου',en:'Your hero'},
        d:{gr:'Δες XP, παράσημα και άλλαξε τη σφραγίδα / avatar σου.',en:'See XP, badges and change your seal / avatar.'} },
      anathesi:    { w:{gr:'Καθηγητής',en:'Teacher'}, t:{gr:'Η κονσόλα σου',en:'Your console'},
        d:{gr:'Φτιάξε τάξη, κάλεσε μαθητές και ανάθεσε εργασίες με τον οδηγό.',en:'Build a class, invite students and assign work with the wizard.'},
        more:[ {gr:'Καρτέλες: Επισκόπηση · Αναθέσεις · Μαθητές · Αδυναμίες.',en:'Tabs: Overview · Assignments · Students · Weak-spots.'},
          {gr:'«Νέα Ανάθεση» ανοίγει τον οδηγό βημάτων.',en:'“New assignment” opens the step wizard.'},
          {gr:'Ο θερμικός χάρτης δείχνει πού δυσκολεύονται.',en:'The heatmap shows where they struggle.'} ] },
      parent:      { w:{gr:'Γονέας',en:'Parent'}, t:{gr:'Ο πίνακας του γονέα',en:'Parent dashboard'},
        d:{gr:'Δες πρόοδο, εργασίες και συνδρομή του παιδιού σου — και στείλε υπενθύμιση.',en:'See your child’s progress, homework and plan — and send a nudge.'},
        more:[ {gr:'Οι μπάρες δείχνουν επίδοση ανά μάθημα.',en:'The bars show mastery per subject.'},
          {gr:'«Υπενθύμιση» σπρώχνει ευγενικά μια εκκρεμή εργασία.',en:'“Remind” nudges a pending assignment.'},
          {gr:'Σύνδεσε κι άλλο παιδί με τον κωδικό του.',en:'Link another child with their code.'} ] },
      subscribe:   { w:{gr:'Συνδρομές',en:'Plans'}, t:{gr:'Ξεκλείδωσε τα πάντα',en:'Unlock everything'},
        d:{gr:'Το Pro ανοίγει όλα τα παιχνίδια, την Άνοδο και απεριόριστο Live.',en:'Pro opens every game, the Ascent and unlimited Live.'} },
    };

    function on(){ return !!SS().get('guide_mode', 0); }

    // the main "parts" of the site the philosopher can orient you on (hover → what is this)
    const PARTS = [
      { id:'home',        nm:{gr:'Παιχνίδια',en:'Games'},     d:{gr:'Μάθε με παιχνίδια ανά τάξη & μάθημα.',en:'Learn through games, by class & subject.'} },
      { id:'assignments', nm:{gr:'Εργασίες',en:'Homework'},    d:{gr:'Ό,τι σου ανέθεσαν, με προθεσμίες.',en:'What your teachers set, with deadlines.'} },
      { id:'temple',      nm:{gr:'Ἀγορά',en:'Agora'},          d:{gr:'Ξόδεψε Kleos σε θέματα & στολίδια.',en:'Spend Kleos on themes & adornments.'} },
      { id:'live',        nm:{gr:'Live Arena',en:'Live Arena'}, d:{gr:'Παίξε ζωντανά με την τάξη σου.',en:'Play live with your class.'} },
      { id:'anodos',      nm:{gr:'Άνοδος',en:'Anodos'},         d:{gr:'Σκαρφάλωσε σκαλί-σκαλί στον Όλυμπο.',en:'Climb tier by tier to Olympus.'} },
    ];

    function mount(){
      if(fab) return;
      fab = el('button',{class:'guide-fab', onclick:toggle},[
        el('span',{class:'guide-fab__q'}, '?'),
        el('span',{class:'guide-fab__lbl'}, L({gr:'Οδηγός',en:'Guide'})) ]);
      tip = el('div',{class:'guide-tip'});
      window.symApplyThemeClass(fab); window.symApplyThemeClass(tip);
      document.body.appendChild(fab);
      document.body.appendChild(tip);
      sync();
    }

    function toggle(){
      SS().set('guide_mode', on()?0:1);
      dismissed = {};
      sync();
    }

    // re-evaluate label + which tip to show (call on every render)
    function sync(){
      if(!fab) return;
      window.symApplyThemeClass(fab); window.symApplyThemeClass(tip);
      const isOn = on();
      fab.classList.toggle('on', isOn);
      const lbl = fab.querySelector('.guide-fab__lbl'); if(lbl) lbl.textContent = L({gr:'Οδηγός',en:'Guide'});
      renderTip();
    }
    window.addEventListener('sym-store', (e)=>{ if(e.detail && e.detail.key==='guide_mode') sync(); });

    function renderTip(){
      if(!tip) return;
      const screen = (window.STATE && STATE.screen) || 'home';
      const info = TIPS[screen];
      if(!on() || !info || dismissed[screen]){ tip.classList.remove('show'); return; }
      tip.innerHTML='';
      tip.appendChild(el('div',{class:'guide-tip__hd'},[
        el('span',{class:'guide-tip__dot'}),
        el('span',{class:'guide-tip__where'}, L(info.w)),
        el('button',{class:'guide-tip__x', title:L({gr:'Κλείσιμο',en:'Close'}), html:'&times;',
          onclick:()=>{ dismissed[screen]=1; tip.classList.remove('show'); }}),
      ]));
      tip.appendChild(el('div',{class:'guide-tip__t'}, L(info.t)));
      tip.appendChild(el('div',{class:'guide-tip__d'}, L(info.d)));
      tip.appendChild(el('div',{class:'guide-tip__foot'},[
        el('button',{class:'guide-tip__off', onclick:()=>{ SS().set('guide_mode',0); sync(); }},
          L({gr:'Σβήσε τον οδηγό',en:'Turn off guide'})),
      ]));
      requestAnimationFrame(()=>tip.classList.add('show'));
    }

    return { mount, sync, toggle, refresh:renderTip, isOn:on, tipFor:(s)=>TIPS[s], parts:()=>PARTS };
  })();
})();
