/* ════════════════════════════════════════════════════════════════════
   anathesi.js — ΑΝΑΘΕΣΗ Teacher Console (synthesis port)
   --------------------------------------------------------------------
   Re-registers window.SYM_SCREENS.anathesi with a RICHER teacher console
   whose "Νέα Ανάθεση" wizard lets a teacher pick ANY available game
   mode/engine. Ported from Ver1 paideia/js/anathesi.js +
   anathesi-wizard.js, but rebuilt synthesis-native:

     • the mode list is driven by window.GP_ENGINES (every engine that
       ships in synthesis), NOT a 6-item carousel slice, so EVERY mode is
       selectable;
     • engineAcceptsCat() is RELAXED — category chips only re-rank/soft-hint
       engines, they never hard-filter a mode out;
     • persistence is via window.SymStore (no Firestore dependency in the
       sandbox) — firebase is guarded with typeof checks;
     • alabaster shell via window.synPage + the shared sc-* dashboard styles.

   Loaded AFTER js/screens-2.js (which registers a simpler S.anathesi), so
   this assignment WINS via window.SYM_SCREENS.anathesi = …
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // NOTE: this file loads BEFORE js/app.js (which defines window.el / window.L),
  // so helpers MUST be resolved lazily at call time — never captured at load.
  const el = (...a) => window.el(...a);
  const L  = (o) => (window.L ? window.L(o) : ((o && (o.gr || o.en)) || o));
  const go = (s, p) => window.symGo(s, p);
  const SS = () => window.SymStore || { get:(k,d)=>d, set:()=>{} };
  const esc = s => String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  /* ── live-data adapters (all guarded) ──────────────────────────── */
  const engines = () => (Array.isArray(window.GP_ENGINES) ? window.GP_ENGINES : []);
  const engineById = id => engines().find(e => e.id === id) || null;
  const engineCats = () => (Array.isArray(window.GP_ENGINE_CATEGORIES) ? window.GP_ENGINE_CATEGORIES : []);

  // RELAXED filter: a category chip never hides a mode. It returns true for
  // every engine so ALL modes stay selectable; "unusual for this category"
  // engines are only soft-hinted (see engineHinted) and sorted to the back.
  function engineAcceptsCat(/* e, catId */) { return true; }

  // Soft hint: is this engine OUTSIDE the chosen category group? (drives the
  // muted "uncommon here" affordance, never a hard filter).
  function engineHinted(e, catId) {
    if (!catId || catId === 'all') return false;
    const grp = engineCats().find(c => c.id === catId);
    if (!grp || !Array.isArray(grp.ids)) return false;
    return grp.ids.indexOf(e.id) < 0;
  }

  // Ordered engine list for a category: in-group first, then the rest. Nothing
  // is dropped — every engine appears, so the teacher can pick ANY mode.
  function enginesForCat(catId) {
    const all = engines().filter(e => engineAcceptsCat(e, catId));
    if (!catId || catId === 'all') return all.slice();
    return all.slice().sort((a, b) => {
      const ha = engineHinted(a, catId) ? 1 : 0, hb = engineHinted(b, catId) ? 1 : 0;
      return ha - hb;
    });
  }

  function tierLabel(t) {
    if (t === 'teacher') return L({gr:'Καθηγητής',en:'Teacher'});
    if (t === 'student') return 'Pro';
    return L({gr:'Δωρεάν',en:'Free'});
  }

  /* ── default content options per engine (synthesis has no GP_DATASETS tree;
        we offer sensible scoping presets so the wizard stays usable). ──── */
  function contentOptions() {
    return [
      { id:'whole',  gr:'Όλη η ύλη',        en:'Whole syllabus' },
      { id:'iliada', gr:'Ιλιάδα',           en:'Iliad' },
      { id:'odyssey',gr:'Οδύσσεια',         en:'Odyssey' },
      { id:'history',gr:'Ιστορία',          en:'History' },
      { id:'grammar',gr:'Γραμματική',       en:'Grammar' },
      { id:'latin',  gr:'Λατινικά',         en:'Latin' },
      { id:'custom', gr:'Προσαρμοσμένο κουίζ', en:'Custom quiz' },
    ];
  }

  function genPin() {
    const C = 'ΑΒΓΔΕΖΗΘ23456789';
    let p = ''; for (let i = 0; i < 6; i++) p += C[Math.floor(Math.random() * C.length)];
    return p;
  }
  function defaultDue() {
    const d = new Date(Date.now() + 7 * 86400000);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }

  /* ════════════════════════════════════════════════════════════════
     WIZARD — 3 steps. Step 1's mode grid lists ALL GP_ENGINES.
     ════════════════════════════════════════════════════════════════ */
  function openWizard(klass, onSent) {
    const stage = document.querySelector('.stage') || document.body;
    const wz = {
      step: 1,
      cat: 'all',
      picks: [],          // [{ engineId, content }]
      title: '',
      due: defaultDue(),
      attempts: '2',
      pinOn: true,
      pin: genPin(),
      pinLimit: 10,
      students: SS().get('teacher_students', []).slice(),
      selStudents: [],
      gq: '',
    };

    const ov = el('div', { class:'pv-overlay', onclick:(e)=>{ if (e.target === ov) ov.remove(); } });
    window.symApplyThemeClass && window.symApplyThemeClass(ov);
    const box = el('div', { class:'an-wiz' });
    ov.appendChild(box);
    stage.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('in'));
    if (window.gsap) try { window.gsap.from(box, { y:20, scale:.97, autoAlpha:0, duration:.32, ease:'back.out(1.5)' }); } catch (_) {}

    paint();

    function close() { ov.remove(); }

    function paint() {
      box.innerHTML = '';
      box.appendChild(rail());
      if (wz.step === 1) box.appendChild(step1());
      else if (wz.step === 2) box.appendChild(step2());
      else box.appendChild(step3());
      if (window.injectIllus) try { window.injectIllus(box); } catch (_) {}
    }

    function rail() {
      const labels = [L({gr:'Παιχνίδια',en:'Games'}), L({gr:'Παραλήπτες',en:'Recipients'}), L({gr:'Λεπτομέρειες',en:'Details'})];
      const bar = el('div', { class:'an-wiz__bar' });
      const steps = el('div', { class:'an-wiz__steps' });
      labels.forEach((lab, i) => {
        if (i > 0) steps.appendChild(el('span', { class:'an-wiz__sep' }));
        steps.appendChild(el('span', { class:'an-wiz__step' + (wz.step === i+1 ? ' on' : wz.step > i+1 ? ' past' : '') }, [
          el('span', { class:'an-wiz__n' }, wz.step > i+1 ? '✓' : String(i+1)), lab,
        ]));
      });
      bar.appendChild(steps);
      bar.appendChild(el('button', { class:'pv-modal__x', onclick:close, html:'&times;' }));
      return bar;
    }

    /* ── STEP 1 · pick ANY game mode ── */
    function step1() {
      const wrap = el('div', { class:'an-wiz__pane' });

      // category chips (soft re-rank only — never hard-filter)
      const chipsRow = el('div', { class:'an-chips' });
      const cats = [{ id:'all', label:L({gr:'Όλα',en:'All'}) }].concat(
        engineCats().map(c => ({ id:c.id, label:(typeof c.label==='string'?c.label:L(c.label)) }))
      );
      cats.forEach(c => chipsRow.appendChild(el('button', {
        class:'an-chip' + (wz.cat === c.id ? ' on' : ''),
        onclick:()=>{ wz.cat = c.id; paint(); },
      }, c.label)));
      wrap.appendChild(chipsRow);

      // search
      const search = el('input', { class:'an-search', placeholder:L({gr:'Αναζήτηση παιχνιδιού…',en:'Search a game…'}), value:wz.gq });
      search.addEventListener('input', () => { wz.gq = search.value; paintGrid(); });
      wrap.appendChild(search);

      // hint that ALL modes are available
      wrap.appendChild(el('div', { class:'an-note' }, L({
        gr:'Διάλεξε ένα ή περισσότερα από ΟΛΑ τα διαθέσιμα παιχνίδια. Οι κατηγορίες απλώς ταξινομούν — δεν κρύβουν κανένα mode.',
        en:'Pick one or more from ALL available games. Categories only re-order — they never hide a mode.',
      })));

      const grid = el('div', { class:'an-game-grid' });
      wrap.appendChild(grid);
      paintGrid();

      function paintGrid() {
        grid.innerHTML = '';
        const q = wz.gq.trim().toLowerCase();
        const list = enginesForCat(wz.cat).filter(e => {
          if (!q) return true;
          const hay = ((e.label||'') + ' ' + (e.subtitle||'') + ' ' + (e.tags||[]).join(' ')).toLowerCase();
          return hay.indexOf(q) > -1;
        });
        if (!list.length) { grid.appendChild(el('div', { class:'an-empty' }, L({gr:'Κανένα παιχνίδι.',en:'No games.'}))); return; }
        list.forEach(e => {
          const picked = wz.picks.some(p => p.engineId === e.id);
          const hinted = engineHinted(e, wz.cat);
          const card = el('button', { class:'an-game-card' + (picked ? ' sel' : '') + (hinted ? ' hint' : ''),
            onclick:()=>togglePick(e.id) }, [
            el('span', { class:'an-game-card__tier' }, tierLabel(e.tier)),
            el('span', { class:'an-game-card__icon', style:'background:'+(e.bg||'#2a2a2a') }, e.icon || '🎮'),
            el('span', { class:'an-game-card__name' }, e.label || e.id),
            el('span', { class:'an-game-card__tags' }, (e.subtitle || (e.tags||[]).join(' · '))),
            hinted ? el('span', { class:'an-game-card__hint' }, L({gr:'ασυνήθιστο εδώ',en:'uncommon here'})) : null,
            el('span', { class:'an-game-card__check' }, '✓'),
          ]);
          grid.appendChild(card);
        });
      }

      // selection tray
      const tray = el('div', { class:'an-tray' });
      wrap.appendChild(tray);
      paintTray();

      function paintTray() {
        tray.innerHTML = '';
        if (!wz.picks.length) {
          tray.appendChild(el('div', { class:'an-tray__empty' }, L({gr:'Δεν έχεις διαλέξει παιχνίδι ακόμη.',en:'No game selected yet.'})));
          return;
        }
        tray.appendChild(el('div', { class:'an-tray__hd' },
          L({gr:'Επιλεγμένα',en:'Selected'}) + ' (' + wz.picks.length + ') — ' + L({gr:'ύλη ανά παιχνίδι',en:'content per game'})));
        wz.picks.forEach((p, i) => {
          const e = engineById(p.engineId);
          const opts = contentOptions();
          const sel = el('select', { class:'an-content-sel' },
            opts.map(o => el('option', { value:o.id, selected: o.id === p.content ? 'selected' : null }, L(o))));
          sel.addEventListener('change', () => { p.content = sel.value; });
          tray.appendChild(el('div', { class:'an-tray__row' }, [
            el('span', { class:'an-tray__icon', style:'background:'+((e&&e.bg)||'#2a2a2a') }, (e && e.icon) || '🎮'),
            el('div', { class:'an-tray__meta' }, [
              el('div', { class:'an-tray__name' }, (e && e.label) || p.engineId),
              el('div', { class:'an-tray__sub' }, (e && e.subtitle) || (e && (e.tags||[]).join(' · ')) || ''),
            ]),
            sel,
            el('button', { class:'an-tray__x', onclick:()=>{ togglePick(p.engineId); } }, '✕'),
          ]));
        });
        const nav = el('div', { class:'an-wiz__nav' });
        nav.appendChild(el('span', {}));
        nav.appendChild(el('button', { class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{ wz.step = 2; paint(); } },
          [ L({gr:'Συνέχεια — Παραλήπτες',en:'Next — Recipients'}), ' →' ]));
        tray.appendChild(nav);
      }

      function togglePick(id) {
        const idx = wz.picks.findIndex(p => p.engineId === id);
        if (idx > -1) wz.picks.splice(idx, 1);
        else wz.picks.push({ engineId:id, content:'whole' });
        paintGrid(); paintTray();
      }

      return wrap;
    }

    /* ── STEP 2 · recipients (roster + PIN), persisted via SymStore ── */
    function step2() {
      const wrap = el('div', { class:'an-wiz__pane' });
      wrap.appendChild(el('div', { class:'an-wiz__ttl' }, L({gr:'Παραλήπτες',en:'Recipients'})));

      // roster
      const rosterBar = el('div', { class:'an-row-between' }, [
        el('div', { class:'an-card__title' }, '👥 ' + L({gr:'Μαθητές',en:'Students'})),
        el('button', { class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>{
          const nm = prompt(L({gr:'Όνομα μαθητή:',en:'Student name:'}), '');
          if (nm) { wz.students.push(nm); const cur = SS().get('teacher_students', []); cur.push(nm); SS().set('teacher_students', cur); paint(); }
        } }, [ '＋ ', L({gr:'Προσθήκη',en:'Add'}) ]),
      ]);
      wrap.appendChild(rosterBar);

      const roster = el('div', { class:'an-roster' });
      if (!wz.students.length) roster.appendChild(el('div', { class:'an-tray__empty' },
        L({gr:'Το μητρώο είναι άδειο — πρόσθεσε μαθητές ή χρησιμοποίησε PIN.',en:'Roster empty — add students or use a PIN.'})));
      wz.students.forEach((n, i) => {
        const on = wz.selStudents.indexOf(i) > -1;
        roster.appendChild(el('div', { class:'an-roster__row' + (on ? ' on' : ''),
          onclick:()=>{ const k = wz.selStudents.indexOf(i); if (k > -1) wz.selStudents.splice(k,1); else wz.selStudents.push(i); paint(); } }, [
          el('span', { class:'an-roster__cb' }, '✓'),
          el('span', { class:'an-roster__av' }, String(n)[0] || '?'),
          el('span', { class:'an-roster__nm' }, n),
        ]));
      });
      wrap.appendChild(roster);

      // PIN
      const pinCard = el('div', { class:'an-card' });
      pinCard.appendChild(el('div', { class:'an-card__title' }, '🔑 ' + L({gr:'Πρόσβαση με PIN',en:'PIN access'})));
      const pinToggle = el('label', { class:'an-roster__row', onclick:()=>{ wz.pinOn = !wz.pinOn; paint(); } }, [
        el('span', { class:'an-roster__cb' + (wz.pinOn ? ' on' : '') }, '✓'),
        el('span', {}, L({gr:'Ενεργοποίηση PIN συμμετοχής',en:'Enable join PIN'})),
      ]);
      pinCard.appendChild(pinToggle);
      if (wz.pinOn) {
        pinCard.appendChild(el('div', { class:'an-pin' }, wz.pin));
        const lim = el('input', { class:'an-uses', type:'number', min:'1', value:String(wz.pinLimit) });
        lim.addEventListener('input', () => { wz.pinLimit = Number(lim.value) || 0; });
        pinCard.appendChild(el('div', { class:'an-note' }, [ L({gr:'Όριο χρήσεων: ',en:'Use limit: '}), lim,
          ' ', L({gr:'μαθητές με αυτό το PIN',en:'students may join'}) ]));
      }
      wrap.appendChild(pinCard);

      const nav = el('div', { class:'an-wiz__nav' });
      nav.appendChild(el('button', { class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>{ wz.step = 1; paint(); } },
        [ '← ', L({gr:'Πίσω',en:'Back'}) ]));
      const canNext = wz.selStudents.length > 0 || wz.pinOn;
      nav.appendChild(el('button', { class:'sc-cta sc-cta--solid sc-cta--sm', disabled: canNext ? null : 'disabled',
        onclick:()=>{ if (canNext) { wz.step = 3; paint(); } } }, [ L({gr:'Συνέχεια — Λεπτομέρειες',en:'Next — Details'}), ' →' ]));
      wrap.appendChild(nav);
      return wrap;
    }

    /* ── STEP 3 · details + send ── */
    function step3() {
      const wrap = el('div', { class:'an-wiz__pane' });
      wrap.appendChild(el('div', { class:'an-wiz__ttl' }, L({gr:'Λεπτομέρειες',en:'Details'})));

      const titleI = el('input', { class:'an-field__i', type:'text', value:wz.title,
        placeholder:L({gr:'π.χ. Ιλιάδα — Trivia Ραψ. Α',en:'e.g. Iliad — Trivia Rhap. A'}) });
      titleI.addEventListener('input', () => { wz.title = titleI.value; });
      wrap.appendChild(el('label', { class:'an-field' }, [ el('span', {}, L({gr:'Τίτλος ανάθεσης',en:'Assignment title'})), titleI ]));

      const dueI = el('input', { class:'an-field__i', type:'date', value:wz.due });
      dueI.addEventListener('input', () => { wz.due = dueI.value; });
      const attI = el('select', { class:'an-field__i' }, [
        ['1','1'],['2','2'],['3','3'],['inf',L({gr:'Απεριόριστες',en:'Unlimited'})],
      ].map(([v,lab]) => el('option', { value:v, selected: v === wz.attempts ? 'selected' : null }, lab)));
      attI.addEventListener('change', () => { wz.attempts = attI.value; });
      wrap.appendChild(el('div', { class:'an-field-2' }, [
        el('label', { class:'an-field' }, [ el('span', {}, L({gr:'Προθεσμία',en:'Due date'})), dueI ]),
        el('label', { class:'an-field' }, [ el('span', {}, L({gr:'Προσπάθειες',en:'Attempts'})), attI ]),
      ]));

      // summary
      const gamesTxt = wz.picks.map(p => { const e = engineById(p.engineId); return ((e && e.icon)||'🎮') + ' ' + ((e && e.label) || p.engineId); }).join(' · ');
      const sum = el('div', { class:'an-card' });
      sum.appendChild(el('div', { class:'an-card__title' }, '📦 ' + L({gr:'Σύνοψη',en:'Summary'})));
      [ [L({gr:'Παιχνίδια',en:'Games'}), gamesTxt || '—'],
        [L({gr:'Μαθητές',en:'Students'}), (wz.selStudents.length + (wz.pinOn ? ' + PIN ' + wz.pin + ' (' + wz.pinLimit + ')' : ''))],
        [L({gr:'Προθεσμία',en:'Due'}), wz.due] ].forEach(r => {
        sum.appendChild(el('div', { class:'an-sum__row' }, [ el('span', { class:'an-sum__k' }, r[0]), el('span', { class:'an-sum__v' }, r[1]) ]));
      });
      wrap.appendChild(sum);

      const nav = el('div', { class:'an-wiz__nav' });
      nav.appendChild(el('button', { class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>{ wz.step = 2; paint(); } },
        [ '← ', L({gr:'Πίσω',en:'Back'}) ]));
      nav.appendChild(el('button', { class:'sc-cta sc-cta--solid sc-cta--sm', onclick:send }, [ '📤 ', L({gr:'Αποστολή Ανάθεσης',en:'Send Assignment'}) ]));
      wrap.appendChild(nav);
      return wrap;
    }

    function send() {
      if (!wz.picks.length) { alert(L({gr:'Διάλεξε τουλάχιστον ένα παιχνίδι.',en:'Pick at least one game.'})); wz.step = 1; paint(); return; }
      const record = {
        id: 'a_' + Date.now(),
        klass: klass,
        title: wz.title.trim() || L({gr:'Νέα Ανάθεση',en:'New Assignment'}),
        due: wz.due,
        attempts: wz.attempts === 'inf' ? 0 : Number(wz.attempts),
        games: wz.picks.map(p => { const e = engineById(p.engineId); return { engineId:p.engineId, content:p.content, label:(e&&e.label)||p.engineId }; }),
        students: wz.selStudents.map(i => wz.students[i]),
        pin: wz.pinOn ? wz.pin : null,
        pinLimit: wz.pinOn ? wz.pinLimit : 0,
        created: Date.now(),
      };
      // Persist via SymStore (firebase is intentionally NOT required in the sandbox).
      try {
        const all = SS().get('teacher_assignments', []);
        all.unshift(record);
        SS().set('teacher_assignments', all);
      } catch (_) {}
      // best-effort firebase mirror, fully guarded
      try {
        if (typeof window.firebase !== 'undefined' && window.firebase.firestore) {
          window.firebase.firestore().collection('assignments').add(record).catch(()=>{});
        }
      } catch (_) {}

      box.innerHTML = '';
      box.appendChild(el('div', { class:'an-done' }, [ el('span', { class:'an-done__check' }, '✓'),
        L({gr:'Η ανάθεση στάλθηκε!',en:'Assignment sent!'}) ]));
      setTimeout(() => { close(); if (typeof onSent === 'function') onSent(); }, 1000);
    }
  }

  /* ════════════════════════════════════════════════════════════════
     SCREEN — dashboard shell (alabaster) + tabs, reusing sc-* styles.
     ════════════════════════════════════════════════════════════════ */
  window.SYM_SCREENS = window.SYM_SCREENS || {};
  window.SYM_SCREENS.anathesi = function (home, ctx) {
    const P = window.synPage;
    const accent = '#2F6F8E';
    const tab = (ctx && ctx.param && ctx.param.tab) || 'overview';
    const klass = (ctx && ctx.param && ctx.param.klass) || 'Β1 Γυμνασίου';

    const classes = ['Β1 Γυμνασίου','Β2 Γυμνασίου','Γ2 Γυμνασίου','Γ Λυκείου'].concat(SS().get('teacher_classes', []));

    const body = P(home, {
      back:'home', accent,
      eyebrow:L({gr:'Κονσόλα Καθηγητή · Ανάθεση',en:'Teacher Console · Anathesi'}),
      title:L({gr:'Πίνακας Τάξης',en:'Class Dashboard'}),
      sub:L({gr:'Δημιούργησε εργασίες με ΟΛΑ τα modes, δες αδυναμίες, παρακολούθησε πρόοδο.',en:'Create assignments with EVERY mode, spot weak spots, track progress.'}),
      actions:[
        el('div', { class:'sc-classsel' }, [
          el('span', { class:'sc-classsel__l' }, L({gr:'Τμήμα',en:'Class'})),
          el('select', { class:'sc-field__i sc-select sc-classsel__s', onchange:(e)=>{
            if (e.target.value === '__new') {
              const nm = prompt(L({gr:'Όνομα νέας τάξης:',en:'New class name:'}), 'Α1 Γυμνασίου');
              if (nm) { const cur = SS().get('teacher_classes', []); cur.push(nm); SS().set('teacher_classes', cur); go('anathesi', { tab, klass:nm }); }
              else go('anathesi', { tab, klass });
            } else go('anathesi', { tab, klass:e.target.value });
          } }, classes.map(c => el('option', { selected: c === klass ? 'selected' : null }, c))
            .concat([ el('option', { value:'__new' }, '＋ ' + L({gr:'Νέα τάξη…',en:'New class…'})) ])),
        ]),
        el('button', { class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>launchTriviaPanel() },
          [ '✚ ', L({gr:'Δημιουργία Trivia',en:'Create Trivia'}) ]),
        el('button', { class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>openWizard(klass, ()=>go('anathesi', { tab:'assign', klass })) },
          [ '＋ ', L({gr:'Νέα Ανάθεση',en:'New assignment'}) ]),
      ],
    });

    // seats bar
    body.appendChild(el('div', { class:'sc-seats sc-stagger has-accent', style:`--ca:${accent}` }, [
      el('div', { class:'sc-seats__b' }, [ el('span', { class:'sc-seats__l' }, L({gr:'Θέσεις τάξης',en:'Class seats'})),
        el('div', { class:'sc-seats__bar' }, [ el('span', { class:'sc-seats__fill', style:'width:75%' }) ]) ]),
      el('span', { class:'sc-seats__t' }, '18 / 24 ' + L({gr:'σε χρήση',en:'used'})),
    ]));

    // tabs
    const tabs = [['overview',{gr:'Επισκόπηση',en:'Overview'}],['assign',{gr:'Αναθέσεις',en:'Assignments'}],['students',{gr:'Μαθητές',en:'Students'}],['reports',{gr:'Αδυναμίες',en:'Weak spots'}]];
    body.appendChild(el('div', { class:'sc-subtabs sc-stagger' }, tabs.map(([id,lab]) =>
      el('button', { class:'sc-subtab' + (id === tab ? ' active' : ''), onclick:()=>go('anathesi', { tab:id, klass }) }, L(lab)))));

    if (tab === 'overview') {
      body.appendChild(el('div', { class:'sc-stats sc-stagger' }, [
        H_stat('24', L({gr:'Μαθητές',en:'Students'}), accent),
        H_stat(String((SS().get('teacher_assignments', []) || []).length || 5), L({gr:'Αναθέσεις',en:'Assignments'}), accent),
        H_stat('78%', L({gr:'Παράδοση',en:'Turn-in'}), accent),
        H_stat(String(engines().length), L({gr:'Διαθέσιμα modes',en:'Available modes'}), accent),
      ]));
      body.appendChild(el('div', { class:'sc-sec-lbl sc-stagger' }, L({gr:'Πρόσφατη δραστηριότητα',en:'Recent activity'})));
      [['✓','Μαρία Κ. ολοκλήρωσε «Ιλιάδα Trivia»','5′'],['⚡','Live Arena: 22 παίκτες','1ω'],['⚠','Νίκος Δ. — χαμηλό σκορ στα Ρήματα','2ω'],['＋','Νέα ανάθεση: Λατινικά Κλίσεις','3ω']].forEach(a =>
        body.appendChild(el('div', { class:'sc-act sc-stagger' }, [ el('span', { class:'sc-act__ic' }, a[0]), el('span', { class:'sc-act__t' }, a[1]), el('span', { class:'sc-act__tm' }, a[2]) ])));
    }
    else if (tab === 'assign') {
      const saved = SS().get('teacher_assignments', []) || [];
      const tbl = el('div', { class:'sc-table sc-stagger has-accent', style:`--ca:${accent}` });
      tbl.appendChild(el('div', { class:'sc-tr sc-tr--h' }, [ el('span', {}, L({gr:'Εργασία',en:'Task'})), el('span', {}, L({gr:'Παιχνίδια',en:'Games'})), el('span', {}, L({gr:'Παράδοση',en:'Due'})), el('span', {}, '') ]));
      const rows = saved.length
        ? saved.map(a => [a.title, (a.games||[]).map(g=>g.label).join(', '), a.due, a])
        : [['Ιλιάδα — Trivia Επ.3','Iliad Trivia','—',null],['Ρήματα — Κλίση','Rapid Fire','—',null]];
      rows.forEach(r => tbl.appendChild(el('div', { class:'sc-tr' }, [
        el('span', { class:'sc-tr__task' }, r[0]), el('span', {}, r[1]), el('span', {}, r[2]),
        el('span', { class:'sc-tr__acts' }, [ el('button', { class:'sc-mini', onclick:()=>{ if (window.SymPreview) SymPreview.open('mc', { title:r[0] }); } }, L({gr:'Προβολή',en:'View'})) ]),
      ])));
      body.appendChild(tbl);
    }
    else if (tab === 'students') {
      const names = ['Αλέξης Π.','Μαρία Κ.','Νίκος Δ.','Ελένη Σ.','Γιώργος Μ.','Σοφία Ρ.'].concat(SS().get('teacher_students', []));
      body.appendChild(el('div', { class:'sc-students__bar sc-stagger' }, [
        el('input', { class:'sc-search', placeholder:L({gr:'Αναζήτηση μαθητή…',en:'Search student…'}) }),
        el('button', { class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>{ const nm = prompt(L({gr:'Όνομα μαθητή:',en:'Student name:'}), ''); if (nm) { const cur = SS().get('teacher_students', []); cur.push(nm); SS().set('teacher_students', cur); if (window.symRender) window.symRender(); } } }, [ '＋ ', L({gr:'Προσθήκη μαθητή',en:'Add student'}) ]),
      ]));
      const grid = el('div', { class:'sc-roster sc-stagger' });
      names.forEach((n, i) => { const acc = [88,76,93,71,64,82][i%6];
        grid.appendChild(el('div', { class:'sc-rcard' }, [ el('span', { class:'sc-rcard__av', style:`--ca:${accent}` }, n[0]),
          el('div', { class:'sc-rcard__b' }, [ el('span', { class:'sc-rcard__n' }, n), el('span', { class:'sc-rcard__m' }, L({gr:'Ακρίβεια',en:'Accuracy'}) + ' ' + acc + '%') ]),
          el('span', { class:'sc-rcard__badge' + (acc < 70 ? ' low' : '') }, acc < 70 ? '⚠' : '✓') ])); });
      body.appendChild(grid);
    }
    else if (tab === 'reports') {
      body.appendChild(el('div', { class:'sc-sec-lbl sc-stagger' }, L({gr:'Θερμικός χάρτης αδυναμιών',en:'Weak-spot heatmap'})));
      const topics = ['Ρήματα','Συντακτικό','Ιλιάδα','Ιστορία','Λατ. κλίση','Λεξιλόγιο'];
      const names = ['Αλέξης','Μαρία','Νίκος','Ελένη','Γιώργος'];
      const heat = el('div', { class:'sc-heat sc-stagger has-accent', style:`--ca:${accent}` });
      heat.appendChild(el('div', { class:'sc-heat__row sc-heat__row--h' }, [ el('span', {}) ].concat(topics.map(t => el('span', { class:'sc-heat__th' }, t)))));
      names.forEach((n, ri) => { const row = el('div', { class:'sc-heat__row' }, [ el('span', { class:'sc-heat__name' }, n) ]);
        topics.forEach((_, ci) => { const v = (ri*7+ci*13+5)%100; row.appendChild(el('span', { class:'sc-heat__c', title:v+'%', style:`background:color-mix(in srgb, ${v<40?'#c2553a':v<70?'var(--gold)':'var(--sage)'} ${30+v*0.5}%, transparent)` }, v)); });
        heat.appendChild(row); });
      body.appendChild(heat);
    }

    function launchTriviaPanel() {
      const map = window.SYN_LAUNCH_MAP || {};
      const fn = map['Trivia Panel'] || 'openTriviaPanel';
      if (typeof window.synLaunch === 'function' && window.SYN_GAMES && window.SYN_GAMES[fn]) window.synLaunch(fn);
      else if (typeof window.openTriviaPanel === 'function') window.openTriviaPanel();
    }
  };

  function H_stat(v, label, accent) {
    return el('div', { class:'sc-stat has-accent', style:`--ca:${accent || '#2F6F8E'}` }, [
      el('div', { class:'sc-stat__v' }, v), el('div', { class:'sc-stat__l' }, label) ]);
  }
})();
