/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · GAME PREVIEWS
   Faithful, lightweight mock "screenshots" of each engine — a framed
   game screen with a real sample question. No game logic; pure look.
   Used by: Play-now CTA, level grammar showcase, Game Panel, admin QA.
     window.SymPreview.scene(type, opts)  → DOM node (embeddable)
     window.SymPreview.open(type, opts)   → modal overlay
     window.SymPreview.SCENES             → list for pickers
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const E = function () { return window.el.apply(null, arguments); };
  const L = function (o) { return window.SYM.L(o); };
  const lang = () => window.SYM_LANG;

  function hud(title, sub, opts) {
    opts = opts || {};
    return E('div', { class:'pv-hud' }, [
      E('div', { class:'pv-hud__l' }, [
        E('span', { class:'pv-hud__dot' }), E('span', { class:'pv-hud__t' }, title),
        sub ? E('span', { class:'pv-hud__sub' }, sub) : null,
      ]),
      E('div', { class:'pv-hud__r' }, [
        E('span', { class:'pv-hud__lives' }, (opts.lives||'♥♥♥')),
        E('span', { class:'pv-hud__score' }, (opts.score!=null?opts.score:'1240')),
      ]),
    ]);
  }
  function chips(items, correctIdx) {
    return E('div', { class:'pv-choices' }, items.map((t,i)=>E('button', {
      class:'pv-choice'+(i===correctIdx?' pv-choice--ok':''), tabindex:'-1'
    }, [ E('span',{class:'pv-choice__k'}, String.fromCharCode(65+i)), t,
         i===correctIdx?E('span',{class:'pv-choice__tick',html:'&#10003;'}):null ])));
  }
  function illu(name){ return E('span', { class:'pv-illu', 'data-illu':name }); }

  // ── SCENES ───────────────────────────────────────────────────────
  const make = {
    /* multiple-choice trivia */
    mc(o){
      o = o || {};
      const q = o.q || { gr:'Ποιος σκότωσε τον Έκτορα στην Ιλιάδα;', en:'Who slew Hector in the Iliad?',
        a:['Αχιλλέας','Οδυσσέας','Αίας','Διομήδης'], ai:['Achilles','Odysseus','Ajax','Diomedes'], correct:0 };
      return E('div',{class:'pv-scene pv-scene--mc'},[
        hud(o.title||'Iliad Trivia', o.sub||(lang()==='en'?'Question 4 / 10':'Ερώτηση 4 / 10')),
        E('div',{class:'pv-stage'},[
          illu(o.illu||'helmet'),
          E('div',{class:'pv-q'}, lang()==='en'?q.en:q.gr),
          chips(lang()==='en'?q.ai:q.a, q.correct),
        ]),
        E('div',{class:'pv-foot'},[ E('span',{},lang()==='en'?'Tap the correct answer':'Πάτα τη σωστή απάντηση'), E('span',{class:'pv-timer'},'00:12') ]),
      ]);
    },
    /* Lyo — Greek verb paradigm (λύω) */
    'grammar-verb'(o){
      o = o || {};
      const forms = ['λύω','λύεις','λύει','λύομεν','λύετε','λύουσι(ν)'];
      const persons = lang()==='en'
        ? ['1st sg','2nd sg','3rd sg','1st pl','2nd pl','3rd pl']
        : ['α΄ εν.','β΄ εν.','γ΄ εν.','α΄ πλ.','β΄ πλ.','γ΄ πλ.'];
      const blank = 3; // λύομεν is the prompt
      return E('div',{class:'pv-scene pv-scene--grammar'},[
        hud('Λύω', lang()==='en'?'Present · Active · Indicative':'Ενεστώτας · Ενεργητική · Οριστική', {lives:'♥♥♥', score:'860'}),
        E('div',{class:'pv-stage'},[
          E('div',{class:'pv-para'},[
            E('div',{class:'pv-para__hd'}, lang()==='en'?'Conjugate λύω':'Κλίνε το ρήμα λύω'),
            E('table',{class:'pv-table'}, forms.map((f,i)=>E('tr',{class:i===blank?'pv-row--ask':''},[
              E('td',{class:'pv-table__p'}, persons[i]),
              E('td',{class:'pv-table__f'}, i===blank? E('span',{class:'pv-blank'}, '? ? ?') : f),
            ]))),
          ]),
          chips(['λύομεν','λύομαι','ἐλύομεν','λύωμεν'], 0),
        ]),
        E('div',{class:'pv-foot'},[ E('span',{},lang()==='en'?'Fill the missing form':'Συμπλήρωσε τον τύπο που λείπει'), E('span',{class:'pv-timer'},'00:20') ]),
      ]);
    },
    /* Latin noun declension (rosa) */
    'grammar-noun'(o){
      o = o || {};
      const cases = lang()==='en'?['Nom','Gen','Dat','Acc','Abl']:['Ονομ.','Γεν.','Δοτ.','Αιτ.','Αφαιρ.'];
      const sing = ['rosa','rosae','rosae','rosam','rosā'];
      const plur = ['rosae','rosārum','rosīs','rosās','rosīs'];
      const askR = 1; // genitive sing rosae
      return E('div',{class:'pv-scene pv-scene--grammar'},[
        hud('Latin · Noun', lang()==='en'?'1st declension · rosa, -ae':'Α΄ κλίση · rosa, -ae', {lives:'♥♥♥', score:'540'}),
        E('div',{class:'pv-stage'},[
          E('div',{class:'pv-para'},[
            E('div',{class:'pv-para__hd'}, lang()==='en'?'Decline “rosa” (f.)':'Κλίνε το «rosa» (θηλ.)'),
            E('table',{class:'pv-table pv-table--3'},[
              E('tr',{class:'pv-table__head'},[ E('td',{},''), E('td',{}, lang()==='en'?'Singular':'Ενικός'), E('td',{}, lang()==='en'?'Plural':'Πληθ.') ]),
              ...cases.map((c,i)=>E('tr',{class:i===askR?'pv-row--ask':''},[
                E('td',{class:'pv-table__p'}, c),
                E('td',{class:'pv-table__f'}, i===askR? E('span',{class:'pv-blank'},'? ?') : sing[i]),
                E('td',{class:'pv-table__f'}, plur[i]),
              ])),
            ]),
          ]),
          chips(['rosae','rosā','rosam','rosārum'], 0),
        ]),
        E('div',{class:'pv-foot'},[ E('span',{},lang()==='en'?'Type or pick the case form':'Διάλεξε τον σωστό τύπο'), E('span',{class:'pv-timer'},'00:18') ]),
      ]);
    },
    /* Tug of War */
    tow(o){
      o = o || {};
      return E('div',{class:'pv-scene pv-scene--tow'},[
        hud(o.title||'Tug of War', lang()==='en'?'1 vs 1 · best of 7':'1 vs 1 · στο 7', {lives:'⚔', score:'4–3'}),
        E('div',{class:'pv-stage'},[
          E('div',{class:'pv-tow'},[
            E('span',{class:'pv-tow__av pv-tow__av--a'},'Σ'),
            E('div',{class:'pv-tow__rope'},[ E('span',{class:'pv-tow__flag',style:'left:58%'}) ]),
            E('span',{class:'pv-tow__av pv-tow__av--b'},'Μ'),
          ]),
          E('div',{class:'pv-q pv-q--sm'}, lang()==='en'?'“μῆνις” means…':'Τι σημαίνει «μῆνις»;'),
          chips(lang()==='en'?['wrath','ship','shield','glory']:['μανία/οργή','πλοίο','ασπίδα','δόξα'], 0),
        ]),
        E('div',{class:'pv-foot'},[ E('span',{},lang()==='en'?'Answer fast to pull the rope':'Απάντα γρήγορα για να τραβήξεις'), E('span',{class:'pv-timer'},'00:05') ]),
      ]);
    },
    /* Flashcard */
    flash(o){
      o = o || {};
      return E('div',{class:'pv-scene pv-scene--flash'},[
        hud(o.title||'Flashcards', lang()==='en'?'Spaced repetition · 12 due':'Επανάληψη · 12 κάρτες', {lives:'↻', score:'92%'}),
        E('div',{class:'pv-stage'},[
          E('div',{class:'pv-card3d'},[
            E('span',{class:'pv-card3d__lbl'}, lang()==='en'?'TERM':'ΟΡΟΣ'),
            E('div',{class:'pv-card3d__term'}, 'ὕβρις'),
            E('div',{class:'pv-card3d__hint'}, lang()==='en'?'tap to flip':'πάτα για αναστροφή'),
          ]),
          E('div',{class:'pv-flash__rate'},[
            E('button',{class:'pv-rate pv-rate--bad', tabindex:'-1'}, lang()==='en'?'Again':'Ξανά'),
            E('button',{class:'pv-rate pv-rate--ok', tabindex:'-1'}, lang()==='en'?'Good':'Καλά'),
            E('button',{class:'pv-rate pv-rate--easy', tabindex:'-1'}, lang()==='en'?'Easy':'Εύκολο'),
          ]),
        ]),
        E('div',{class:'pv-foot'},[ E('span',{},lang()==='en'?'Rate your recall':'Βαθμολόγησε την ανάκληση'), E('span',{class:'pv-timer'},'—') ]),
      ]);
    },
    /* Endless runner */
    runner(o){
      o = o || {};
      return E('div',{class:'pv-scene pv-scene--runner'},[
        hud(o.title||'Agora Surfers', lang()==='en'?'Endless runner':'Ατέρμον τρέξιμο', {lives:'♥♥', score:'3380'}),
        E('div',{class:'pv-stage pv-stage--runner'},[
          E('div',{class:'pv-run'},[
            E('span',{class:'pv-run__col pv-run__col--1'}), E('span',{class:'pv-run__col pv-run__col--2'}), E('span',{class:'pv-run__col pv-run__col--3'}),
            E('span',{class:'pv-run__hero','data-illu':'runner'}),
            E('span',{class:'pv-run__gate'},[ E('b',{},'ναῦς'), E('b',{class:'wrong'},'νᾶς') ]),
          ]),
          E('div',{class:'pv-q pv-q--sm'}, lang()==='en'?'Run through the correct spelling':'Πέρνα από τη σωστή γραφή'),
        ]),
        E('div',{class:'pv-foot'},[ E('span',{},'← → '+(lang()==='en'?'swipe to choose lane':'σύρε για λωρίδα')), E('span',{class:'pv-timer'},'∞') ]),
      ]);
    },
    /* Memory pairs */
    memory(o){
      o = o || {};
      const faces = ['Ζεύς','⚡','Ἀθηνᾶ','🦉','Ποσειδῶν','🔱','?','?'];
      return E('div',{class:'pv-scene pv-scene--memory'},[
        hud(o.title||'Mythology Memory', lang()==='en'?'Match the pairs':'Ταίριαξε τα ζεύγη', {lives:'⏱', score:'6/12'}),
        E('div',{class:'pv-stage'},[
          E('div',{class:'pv-mem'}, faces.map((f,i)=>E('span',{class:'pv-mem__c'+(f==='?'?' pv-mem__c--down':'')}, f==='?'?'':f))),
        ]),
        E('div',{class:'pv-foot'},[ E('span',{},lang()==='en'?'Flip two cards to match':'Γύρνα δύο κάρτες'), E('span',{class:'pv-timer'},'00:42') ]),
      ]);
    },
  };

  const SCENES = [
    { type:'mc',           gr:'Πολλαπλής Επιλογής', en:'Multiple Choice' },
    { type:'grammar-verb', gr:'Λύω · Ρήματα',       en:'Lyo · Verbs' },
    { type:'grammar-noun', gr:'Λατινικά · Κλίση',   en:'Latin · Nouns' },
    { type:'tow',          gr:'Διελκυστίνδα',        en:'Tug of War' },
    { type:'flash',        gr:'Κάρτες Μνήμης',       en:'Flashcards' },
    { type:'runner',       gr:'Runner',              en:'Runner' },
    { type:'memory',       gr:'Μνήμη',               en:'Memory' },
  ];

  function scene(type, opts) {
    const fn = make[type] || make.mc;
    const node = fn(opts || {});
    if (window.injectIllus) window.injectIllus(node);
    return node;
  }

  // pick a scene type from a game name/illu heuristically
  function typeFor(g){
    const n = (L(g)||'').toLowerCase(), illu = (g.illu||'');
    if (/λύω|lyo|κλίσ|ρήμ|verb|συνηρ|ανώμαλ/.test(n)) return 'grammar-verb';
    if (/latin|λατιν|noun|ουσιαστ|declens|κλίση ουσ/.test(n)) return 'grammar-noun';
    if (/tug|διελκ|tow/.test(n)) return 'tow';
    if (/memory|μνήμη|μνημ/.test(n)) return 'memory';
    if (/flash|κάρτ|spaced/.test(n)) return 'flash';
    if (/runner|surfers|τρέξ|temple run/.test(n) || illu==='runner') return 'runner';
    return 'mc';
  }

  // ── modal ───────────────────────────────────────────────────────
  function open(type, opts) {
    opts = opts || {};
    close();
    const ov = E('div', { class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) close(); } });
    const box = E('div', { class:'pv-modal' });
    box.appendChild(E('div',{class:'pv-modal__bar'},[
      E('div',{class:'pv-modal__title'},[ E('span',{class:'pv-modal__dot'}), opts.title || (lang()==='en'?'Preview':'Προεπισκόπηση') ]),
      E('div',{class:'pv-modal__tools'},[
        opts.tools || null,
        E('button',{class:'pv-modal__x', onclick:close, html:'&times;'}),
      ]),
    ]));
    // Short description of the game, shown under the title bar (opts.desc).
    if (opts.desc) box.appendChild(E('div',{class:'pv-modal__desc'}, opts.desc));
    const frame = E('div',{class:'pv-frame'}, scene(type, opts));
    box.appendChild(frame);
    box.appendChild(E('div',{class:'pv-modal__cta'},[
      opts.note ? E('span',{class:'pv-modal__note'}, opts.note) : E('span',{class:'pv-modal__note'}, lang()==='en'?'Static preview — the live game is fully playable.':'Στατική προεπισκόπηση — το παιχνίδι παίζεται κανονικά.'),
      E('button',{class:'pv-modal__play', onclick:close},[ E('span',{class:'pv-illu','data-illu':'play-button'}), lang()==='en'?'Play the real game':'Παίξε το παιχνίδι' ]),
    ]));
    ov.appendChild(box);
    document.querySelector('.stage').appendChild(ov);
    if (window.injectIllus) window.injectIllus(ov);
    requestAnimationFrame(()=>ov.classList.add('in'));
    if (window.gsap) gsap.from(box, { y: 24, scale: .96, autoAlpha: 0, duration: .4, ease: 'back.out(1.5)' });
    document.addEventListener('keydown', escClose);
  }
  function escClose(e){ if(e.key==='Escape') close(); }
  function close(){ const ov=document.querySelector('.pv-overlay'); if(ov) ov.remove(); document.removeEventListener('keydown', escClose); }

  window.SymPreview = { scene, open, close, typeFor, SCENES };
})();
