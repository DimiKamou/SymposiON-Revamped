/* ══════════════════ TRIVIA SETUP PANEL — engine (synthesis port) ══════════════════
   Universal, subject-configurable trivia launcher. Ported 1:1 from Ver1
   paideia/games/trivia-panel/panel.js (vanilla port of the
   design_handoff_trivia_panel React prototype). Standalone entry:
     window.openTriviaPanel(subjectId)   window.closeTriviaPanel()

   Pick content (rhapsodies/units) once → pick a game from the board → tune
   setup → launch the chosen game scoped to that content. In the SYNTHESIS app
   there is no Ver1 `initGameWithData` / engine configurator, so _start() routes
   the chosen board game through the synthesis launch framework
   (window.synLaunch + window.SYN_LAUNCH_MAP). The selected content is stashed on
   window._gpPendingConfig (read by any engine that wants it) before launch.

   This is the synthesis "create-a-trivia" admin tool: the SUBJECTS map below is
   the only thing an admin edits to add a new trivia (History / epics / tragedies
   / theory). Coming-soon subjects (no engine dataset yet) launch the trivia
   engine with their generic question pool — never fake content.
═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const T = (lang, gr, en) => (lang === 'en' ? en : gr);
  const clone = o => (typeof structuredClone === 'function') ? structuredClone(o) : JSON.parse(JSON.stringify(o));

  /* ── SUBJECT presets — the only thing an admin edits for a new trivia ── */
  const SUBJECTS = {
    iliada: {
      glyph:'amphora', engineDataset:'iliada',
      eyebrow:{gr:'ΟΜΗΡΙΚΟ ΕΠΟΣ',en:'HOMERIC EPIC'},
      titlePre:'Trivia', titleEm:{gr:'Ἰλιάδας',en:'Iliad'},
      sub:{gr:'Ένα παιχνίδι επικής γνώσης',en:'A game of epic knowledge'},
      heading:{gr:'Επιλογή Ραψωδιών',en:'Select Rhapsodies'},
      unit:{gr:'Ραψωδία',en:'Rhapsody'}, units:{gr:'ραψωδίες',en:'rhapsodies'},
      whole:{gr:'Ολόκληρη η Ιλιάδα',en:'The whole Iliad'},
      pickOne:{gr:'— διάλεξε ραψωδία —',en:'— pick a rhapsody —'},
      sections:['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω'],
      initial:['Ω'], cols:8,
    },
    odysseia: {
      glyph:'compass', engineDataset:'odyssey',
      eyebrow:{gr:'ΟΜΗΡΙΚΟ ΕΠΟΣ',en:'HOMERIC EPIC'},
      titlePre:'Trivia', titleEm:{gr:'Ὀδυσσείας',en:'Odyssey'},
      sub:{gr:'Το ταξίδι του νόστου',en:'The journey home'},
      heading:{gr:'Επιλογή Ραψωδιών',en:'Select Rhapsodies'},
      unit:{gr:'Ραψωδία',en:'Rhapsody'}, units:{gr:'ραψωδίες',en:'rhapsodies'},
      whole:{gr:'Ολόκληρη η Οδύσσεια',en:'The whole Odyssey'},
      pickOne:{gr:'— διάλεξε ραψωδία —',en:'— pick a rhapsody —'},
      sections:['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω'],
      initial:['α'], cols:8,
    },
    history: {
      glyph:'column', engineDataset:'istoria',
      eyebrow:{gr:'ΑΡΧΑΙΑ ΙΣΤΟΡΙΑ',en:'ANCIENT HISTORY'},
      titlePre:'Trivia', titleEm:{gr:'Ἱστορίας',en:'History'},
      sub:{gr:'Από τους Πέρσες στους Μακεδόνες',en:'From the Persians to the Macedonians'},
      heading:{gr:'Επιλογή Ενοτήτων',en:'Select Units'},
      unit:{gr:'Ενότητα',en:'Unit'}, units:{gr:'ενότητες',en:'units'},
      whole:{gr:'Όλη η ύλη',en:'The whole syllabus'},
      pickOne:{gr:'— διάλεξε ενότητα —',en:'— pick a unit —'},
      sections:['1','2','3','4','5','6','7','8','9','10','11','12'],
      initial:['1'], cols:6,
    },
    // ── Euripidean tragedies (Γ΄ Γυμνασίου). No dedicated trivia engine dataset
    //    yet → engineDataset is empty so _start() falls back to the generic
    //    trivia engine pool rather than faking tragedy-specific content. ──
    eleni: {
      glyph:'masks', engineDataset:'',
      eyebrow:{gr:'ΕΥΡΙΠΙΔΗΣ',en:'EURIPIDES'},
      titlePre:'Trivia', titleEm:{gr:'Ἑλένης',en:'Helen'},
      sub:{gr:'Η τραγωδία της φαντασματικής Ελένης',en:'The tragedy of the phantom Helen'},
      heading:{gr:'Επιλογή Επεισοδίων',en:'Select Episodes'},
      unit:{gr:'Επεισόδιο',en:'Episode'}, units:{gr:'επεισόδια',en:'episodes'},
      whole:{gr:'Όλη η τραγωδία',en:'The whole play'},
      pickOne:{gr:'— διάλεξε επεισόδιο —',en:'— pick an episode —'},
      sections:['Πρόλογος','Πάροδος','Α','Β','Γ','Έξοδος'],
      initial:['Πρόλογος'], cols:3,
    },
    troades: {
      glyph:'masks', engineDataset:'',
      eyebrow:{gr:'ΕΥΡΙΠΙΔΗΣ',en:'EURIPIDES'},
      titlePre:'Trivia', titleEm:{gr:'Τρωάδων',en:'Trojan Women'},
      sub:{gr:'Ο θρήνος των αιχμαλώτων της Τροίας',en:'The lament of the captives of Troy'},
      heading:{gr:'Επιλογή Επεισοδίων',en:'Select Episodes'},
      unit:{gr:'Επεισόδιο',en:'Episode'}, units:{gr:'επεισόδια',en:'episodes'},
      whole:{gr:'Όλη η τραγωδία',en:'The whole play'},
      pickOne:{gr:'— διάλεξε επεισόδιο —',en:'— pick an episode —'},
      sections:['Πρόλογος','Πάροδος','Α','Β','Γ','Έξοδος'],
      initial:['Πρόλογος'], cols:3,
    },
    alkistis: {
      glyph:'masks', engineDataset:'',
      eyebrow:{gr:'ΕΥΡΙΠΙΔΗΣ',en:'EURIPIDES'},
      titlePre:'Trivia', titleEm:{gr:'Ἀλκήστιδος',en:'Alcestis'},
      sub:{gr:'Η θυσία της Άλκηστης για τον Άδμητο',en:"Alcestis' sacrifice for Admetus"},
      heading:{gr:'Επιλογή Επεισοδίων',en:'Select Episodes'},
      unit:{gr:'Επεισόδιο',en:'Episode'}, units:{gr:'επεισόδια',en:'episodes'},
      whole:{gr:'Όλη η τραγωδία',en:'The whole play'},
      pickOne:{gr:'— διάλεξε επεισόδιο —',en:'— pick an episode —'},
      sections:['Πρόλογος','Πάροδος','Α','Β','Γ','Έξοδος'],
      initial:['Πρόλογος'], cols:3,
    },
  };

  // Pristine snapshot of the code defaults.
  const SUBJECTS_BASE = clone(SUBJECTS);

  /* ── board games → synthesis launch keys (window.SYN_LAUNCH_MAP) ──
     `launchName` is looked up in SYN_LAUNCH_MAP at _start() so the panel always
     reaches a real synthesis opener. Engines that don't exist in synthesis
     (e.g. Ver1 trilliza) are omitted; every board game here is launchable. ── */
  const GAMES = [
    { id:'solo',    engine:'rapid-fire', launchName:'Rapid Fire',         glyph:'laurel',  players:1, tag:{gr:'ΣΟΛΟ',en:'SOLO'},        gr:'Σόλο Αποστολή', en:'Solo Quest',  desc:{gr:'Απάντησε μία-μία, με χρόνο και βοήθειες.',en:'Answer one by one, against the clock.'} },
    { id:'trivia',  engine:'iliada-trivia', launchName:'Iliad Trivia',    glyph:'amphora', players:1, tag:{gr:'TRIVIA',en:'TRIVIA'},    gr:'Trivia Quiz',   en:'Trivia Quiz', desc:{gr:'Κλασικό quiz επιπέδων με βαθμολογία.',en:'Classic levelled quiz with scoring.'} },
    { id:'tow',     engine:'tow',        launchName:'Tug of War',         glyph:'rope',    players:2, tag:{gr:'2 ΟΜΑΔΕΣ',en:'2 TEAMS'},   gr:'Tug of War',    en:'Tug of War',  desc:{gr:'Το σχοινί κινείται με κάθε σωστή απάντηση.',en:'The rope moves with each correct answer.'} },
    { id:'laby',    engine:'labyrinth',  launchName:'Labyrinth',          glyph:'compass', players:1, tag:{gr:'ARCADE',en:'ARCADE'},      gr:'Λαβύρινθος',    en:'Labyrinth',   desc:{gr:'Βρες τον δρόμο απαντώντας σωστά.',en:'Find the way by answering correctly.'} },
    { id:'naum',    engine:'naumachia',  launchName:'Naumachia',          glyph:'amphora', players:2, tag:{gr:'ARCADE',en:'ARCADE'},      gr:'Ναυμαχία',      en:'Naumachia',   desc:{gr:'Βύθισε τον στόλο με τη γνώση σου.',en:'Sink the fleet with your knowledge.'} },
    { id:'phalanx', engine:'phalanx',    launchName:'Phalanx',            glyph:'swords',  players:1, tag:{gr:'STRATEGY',en:'STRATEGY'},  gr:'Φάλαγγα',       en:'Phalanx',     desc:{gr:'Κράτα τον σχηματισμό απαντώντας σωστά.',en:'Hold the formation by answering correctly.'} },
    { id:'invaders',engine:'invaders',   launchName:'Grammar Invaders',   glyph:'bolt',    players:1, tag:{gr:'ARCADE',en:'ARCADE'},      gr:'Invaders',      en:'Invaders',    desc:{gr:'Απόκρουσε τα ερωτήματα πριν προσγειωθούν.',en:'Repel the questions before they land.'} },
    { id:'memory',  engine:'myth-memory',launchName:'Mythology Memory',   glyph:'dice',    players:1, tag:{gr:'MEMORY',en:'MEMORY'},      gr:'Μνήμη',         en:'Memory',      desc:{gr:'Βρες τα ζεύγη — έννοιες & ορισμοί.',en:'Match the pairs — concepts & definitions.'} },
  ];

  const FORMATS = [
    { id:'mc', glyph:'mc', gr:'Πολλαπλής επιλογής', en:'Multiple choice', sub:{gr:'4 επιλογές',en:'4 options'} },
    { id:'tf', glyph:'tf', gr:'Σωστό ή Λάθος', en:'True or False', sub:{gr:'Δυαδική κρίση',en:'Binary judgement'} },
    { id:'match', glyph:'match', gr:'Αντιστοίχιση', en:'Cross-matching', sub:{gr:'Δύο στήλες',en:'Two columns'} },
    { id:'fill', glyph:'fill', gr:'Συμπλήρωση κενού', en:'Fill the blank', sub:{gr:'Πληκτρολόγησε',en:'Type the answer'} },
    { id:'order', glyph:'order', gr:'Σειρά γεγονότων', en:'Ordering', sub:{gr:'Βάλε σε ακολουθία',en:'Put in sequence'} },
    { id:'identify', glyph:'eye', gr:'Αναγνώριση', en:'Identify', sub:{gr:'Ρήση ή εικόνα',en:'Quote or image'} },
  ];
  const HELPS = [
    { id:'5050', label:'50 / 50', gr:'Σβήνει 2 λάθος', en:'Removes 2 wrong' },
    { id:'skip', label:'SKIP', gr:'Προσπέρασε ερώτηση', en:'Skip the question' },
    { id:'time', label:'+10s', gr:'Πρόσθεσε χρόνο', en:'Add time' },
    { id:'reveal', label:'HINT', gr:'Μικρή υπόδειξη', en:'Small hint' },
  ];

  /* ── inline line-art icons (currentColor) ── */
  const ICONS = {
    amphora:'<ellipse cx="50" cy="14" rx="10" ry="2.5"/><line x1="40" y1="14" x2="38" y2="28"/><line x1="60" y1="14" x2="62" y2="28"/><path d="M 38 28 Q 22 32 22 50 Q 22 70 36 80 L 64 80 Q 78 70 78 50 Q 78 32 62 28"/><path d="M 40 22 Q 30 22 28 36"/><path d="M 60 22 Q 70 22 72 36"/><path d="M 36 80 L 38 88 L 62 88 L 64 80"/><line x1="34" y1="88" x2="66" y2="88" stroke-width="2"/><path d="M 26 44 L 74 44" stroke-opacity="0.45"/><path d="M 26 50 L 74 50" stroke-opacity="0.45"/>',
    column:'<rect x="28" y="12" width="44" height="5"/><path d="M 32 17 Q 32 22 36 22 L 64 22 Q 68 22 68 17"/><line x1="36" y1="24" x2="34" y2="80"/><line x1="64" y1="24" x2="66" y2="80"/><line x1="42" y1="26" x2="41" y2="78" stroke-opacity="0.45"/><line x1="48" y1="26" x2="48" y2="78" stroke-opacity="0.45"/><line x1="54" y1="26" x2="54" y2="78" stroke-opacity="0.45"/><line x1="60" y1="26" x2="61" y2="78" stroke-opacity="0.45"/><path d="M 32 80 Q 32 86 36 86 L 64 86 Q 68 86 68 80"/><rect x="28" y="86" width="44" height="4"/>',
    compass:'<circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="28" stroke-opacity="0.4"/><path d="M 50 22 L 56 50 L 50 56 L 44 50 Z" fill="currentColor" stroke="none" opacity="0.85"/><path d="M 50 78 L 56 50 L 50 44 L 44 50 Z"/><circle cx="50" cy="50" r="3" fill="currentColor" stroke="none"/>',
    laurel:'<path d="M 18 64 L 24 34 L 38 50 L 50 26 L 62 50 L 76 34 L 82 64 Z"/><line x1="18" y1="64" x2="82" y2="64" stroke-width="1.8"/><circle cx="24" cy="32" r="2.4"/><circle cx="50" cy="24" r="2.8"/><circle cx="76" cy="32" r="2.4"/>',
    masks:'<path d="M 24 30 Q 24 26 30 26 L 46 26 Q 50 26 50 32 Q 50 56 38 66 Q 24 56 24 32 Z"/><circle cx="33" cy="40" r="2" fill="currentColor" stroke="none"/><circle cx="42" cy="40" r="2" fill="currentColor" stroke="none"/><path d="M 33 50 Q 38 54 43 50" /><path d="M 50 30 Q 52 26 58 26 L 74 26 Q 78 26 76 34 Q 74 58 62 68 Q 52 58 50 36 Z" stroke-opacity="0.7"/><circle cx="59" cy="42" r="2" fill="currentColor" stroke="none" opacity="0.7"/><circle cx="68" cy="42" r="2" fill="currentColor" stroke="none" opacity="0.7"/>',
    swords:'<path d="M3 3 L13 13 M3 3 L5 6 M3 3 L6 5"/><path d="M21 3 L11 13 M21 3 L19 6 M21 3 L18 5"/><path d="M9 17 L4 22 M4 19 L7 22"/><path d="M15 17 L20 22 M20 19 L17 22"/>',
    bolt:'<path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 Z"/>',
    rope:'<path d="M2 12 Q6 8 10 12 T18 12 Q20 12 22 10"/><line x1="12" y1="4" x2="12" y2="20" stroke-opacity="0.5"/>',
    dice:'<rect x="22" y="30" width="40" height="40" rx="3"/><path d="M 22 30 L 38 18 L 78 18 L 62 30"/><path d="M 62 30 L 78 18 L 78 58 L 62 70"/><circle cx="34" cy="42" r="2.4" fill="currentColor" stroke="none"/><circle cx="50" cy="50" r="2.4" fill="currentColor" stroke="none"/><circle cx="34" cy="58" r="2.4" fill="currentColor" stroke="none"/>',
    mc:'<circle cx="6" cy="7" r="2.4"/><line x1="11" y1="7" x2="20" y2="7"/><rect x="4" y="14.5" width="4" height="4"/><path d="M4.6 16.5l1 1 1.6-1.8"/><line x1="11" y1="16.5" x2="20" y2="16.5" stroke-opacity="0.55"/>',
    tf:'<path d="M3 8.5l2 2 3.5-4"/><line x1="13" y1="7.5" x2="21" y2="7.5" stroke-opacity="0.55"/><path d="M4 15l4 4 M8 15l-4 4"/><line x1="13" y1="17" x2="21" y2="17" stroke-opacity="0.55"/>',
    match:'<rect x="2.5" y="4" width="6" height="4.5"/><rect x="2.5" y="13.5" width="6" height="4.5"/><rect x="15.5" y="4" width="6" height="4.5"/><rect x="15.5" y="13.5" width="6" height="4.5"/><path d="M8.5 6.2 L15.5 15.7" stroke-opacity="0.7"/><path d="M8.5 15.7 L15.5 6.2" stroke-opacity="0.7"/>',
    fill:'<line x1="3" y1="8" x2="8" y2="8"/><rect x="9.5" y="5.5" width="5" height="5"/><line x1="16" y1="8" x2="21" y2="8"/><line x1="3" y1="16" x2="21" y2="16" stroke-opacity="0.5"/>',
    order:'<path d="M4 6 L5.5 5 L5.5 9"/><line x1="9" y1="7" x2="20" y2="7"/><path d="M4 14.5h2.6 M4 18h2.6 M6.6 14.5v3.5" stroke-opacity="0.8"/><line x1="9" y1="16.2" x2="20" y2="16.2" stroke-opacity="0.55"/>',
    eye:'<path d="M2.5 12 Q12 4 21.5 12 Q12 20 2.5 12 Z"/><circle cx="12" cy="12" r="3"/>',
    search:'<circle cx="10.5" cy="10.5" r="6.5"/><line x1="15.5" y1="15.5" x2="21" y2="21"/>',
    qr:'<rect x="3" y="3" width="6" height="6"/><rect x="15" y="3" width="6" height="6"/><rect x="3" y="15" width="6" height="6"/><rect x="15" y="15" width="2.5" height="2.5"/><rect x="18.5" y="18.5" width="2.5" height="2.5"/>',
    check:'<path d="M4 12.5 L9.5 18 L20 6"/>',
    sun:'<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8"/>',
    moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4 6.3 6.3 0 0 0 20 14.5Z"/>',
  };
  const SQUARE = new Set(['mc','tf','match','fill','order','eye','search','qr','check','sun','moon','bolt','rope','swords']);
  function glyph(name, size, stroke) {
    size = size || 22; stroke = stroke || 1.7;
    const vb = SQUARE.has(name) ? '0 0 24 24' : '0 0 100 100';
    const body = ICONS[name] || '';
    return `<svg width="${size}" height="${size}" viewBox="${vb}" fill="none" stroke="currentColor" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  }
  function powerMark(size) {
    size = size || 22;
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter"><line x1="22" y1="20" x2="78" y2="20"/><line x1="22" y1="20" x2="48" y2="50"/><line x1="48" y1="50" x2="22" y2="80"/><line x1="22" y1="80" x2="78" y2="80"/></g>
      <g stroke="var(--terra)" stroke-width="3.2" fill="none" stroke-linecap="round"><circle cx="64" cy="50" r="12" stroke-dasharray="62 12" stroke-dashoffset="-7" transform="rotate(-90 64 50)"/><line x1="64" y1="39" x2="64" y2="49"/></g></svg>`;
  }
  const PEGASUS =
    '<svg viewBox="0 0 240 180" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<path d="M 70 120 Q 60 100 72 90 Q 96 80 130 86 Q 150 90 158 104 L 156 120"/>' +
    '<path d="M 80 118 Q 74 134 80 150 M 96 120 Q 102 136 94 152" opacity="0.85"/>' +
    '<path d="M 138 118 Q 132 134 140 150 M 150 116 Q 158 132 150 148" opacity="0.85"/>' +
    '<path d="M 130 86 Q 150 74 158 56 Q 162 46 174 44 L 184 36 Q 190 40 186 48 L 178 54 Q 180 62 172 66 Q 164 78 152 80"/>' +
    '<path d="M 110 88 Q 90 50 50 36 Q 70 44 86 60 Q 70 38 44 28 Q 66 40 84 56 Q 72 36 56 22 Q 80 40 100 64 Q 96 74 110 88" opacity="0.9"/>' +
    '<path d="M 70 110 Q 50 112 42 132 Q 38 144 48 148 Q 44 134 58 128" opacity="0.7"/></svg>';

  const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  /* ── state ── */
  let st = null;

  function open(subjectId) {
    const S = SUBJECTS[subjectId] || SUBJECTS.iliada || SUBJECTS[Object.keys(SUBJECTS)[0]];
    if (!S) return;                         // no presets at all — nothing to open
    const _id = SUBJECTS[subjectId] ? subjectId : (SUBJECTS.iliada ? 'iliada' : Object.keys(SUBJECTS)[0]);
    st = {
      subjectId: _id, S,
      lang: (window.siteLang === 'en' || (window.STATE && window.STATE.lang === 'en')) ? 'en' : 'gr',
      theme: 'day',
      secs: new Set(S.initial),
      all: false,
      game: 'solo',
      fmts: ['mc','tf','match'],
      helps: ['5050','skip'],
      gq: '',
      p1: 'Α', p2: 'Β',
    };
    let ov = document.getElementById('trivia-panel-overlay');
    if (!ov) {
      ov = document.createElement('div');
      ov.id = 'trivia-panel-overlay';
      ov.className = 'game-overlay';
      ov.innerHTML =
        '<button class="tp-back" onclick="closeTriviaPanel()">‹ ' +
          '<span>' + T(st.lang,'ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="tp-scroll"><div class="ts-root" id="ts-root"></div></div>';
      document.body.appendChild(ov);
    }
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    render();
  }
  function close() {
    const ov = document.getElementById('trivia-panel-overlay');
    if (ov) ov.classList.remove('active');
    if (!document.querySelector('.game-overlay.active, #engine-cfg-modal.active, #auth-modal.active')) {
      document.body.style.overflow = '';
    }
  }

  /* ── derived ── */
  const sel = () => GAMES.find(g => g.id === st.game) || GAMES[0];
  const hasContent = () => st.all || st.secs.size > 0;
  const nSel = () => st.all ? st.S.sections.length : st.secs.size;
  function contentSummary() {
    const S = st.S, L = st.lang;
    if (st.all) return T(L, S.whole.gr, S.whole.en);
    if (st.secs.size === 0) return T(L, S.pickOne.gr, S.pickOne.en);
    if (st.secs.size === 1) return T(L, S.unit.gr + ' ', S.unit.en + ' ') + [...st.secs][0];
    return st.secs.size + ' ' + T(L, S.units.gr, S.units.en);
  }
  function contentChips() {
    const S = st.S;
    return st.all ? [S.sections[0], '…', S.sections[S.sections.length - 1]]
                  : S.sections.filter(r => st.secs.has(r));
  }

  /* ── render ── */
  function render() {
    const root = document.getElementById('ts-root'); if (!root) return;
    const ov = document.getElementById('trivia-panel-overlay');
    const S = st.S, L = st.lang, g = sel();
    root.className = 'ts-root' + (st.theme === 'night' ? ' ts-night' : '');
    if (ov) ov.classList.toggle('ts-host-night', st.theme === 'night');

    const games = GAMES.filter(x => {
      const q = st.gq.trim().toLowerCase();
      return !q || (x.gr + ' ' + x.en).toLowerCase().includes(q);
    });

    root.innerHTML =
      '<div class="ts-ornbg">' + PEGASUS + '</div>' +

      '<div class="ts-top">' +
        '<div class="ts-brand">' + powerMark(22) + '<span>SymposiON</span></div>' +
        '<div class="ts-top-actions">' +
          '<div class="ts-theme" role="group" aria-label="theme">' +
            '<button class="' + (st.theme==='day'?'on':'') + '" data-act="theme" data-v="day" title="' + T(L,'Μέρα','Day') + '">' + glyph('sun',14,1.8) + '</button>' +
            '<button class="' + (st.theme==='night'?'on':'') + '" data-act="theme" data-v="night" title="' + T(L,'Νύχτα','Night') + '">' + glyph('moon',14,1.8) + '</button>' +
          '</div>' +
          '<button class="ts-share" data-act="share">' + glyph('qr',14,1.8) + T(L,'Μοιράσου στην τάξη','Share with class') + '</button>' +
          '<div class="ts-lang">' +
            '<button class="' + (L==='en'?'on':'') + '" data-act="lang" data-v="en">EN</button>' +
            '<button class="' + (L==='gr'?'on':'') + '" data-act="lang" data-v="gr">ΕΛ</button>' +
          '</div>' +
        '</div>' +
      '</div>' +

      '<header class="ts-head">' +
        '<div class="ts-ornament">' + esc(T(L,S.eyebrow.gr,S.eyebrow.en)) + '</div>' +
        '<h1 class="ts-title">' + esc(S.titlePre) + ' <em>' + esc(T(L,S.titleEm.gr,S.titleEm.en)) + '</em></h1>' +
        '<div class="ts-sub">' + esc(T(L,S.sub.gr,S.sub.en)) + '</div>' +
        '<div class="ts-divider"><span></span><i></i><span></span></div>' +
      '</header>' +

      '<div class="ts-body">' +

        // STEP A — content
        '<section class="ts-card">' +
          '<div class="ts-label"><em>Α</em>' + esc(T(L,S.heading.gr,S.heading.en)) + '</div>' +
          '<div class="ts-note">' + T(L,'Διάλεξε την ύλη μία φορά — ισχύει για κάθε παιχνίδι.','Pick the content once — it applies to every game.') + '</div>' +
          '<div class="ts-grid" style="grid-template-columns:repeat(' + S.cols + ',1fr)">' +
            S.sections.map(r => '<button class="ts-rhap' + ((st.all||st.secs.has(r))?' on':'') + '" data-act="sec" data-v="' + esc(r) + '">' + esc(r) + '</button>').join('') +
          '</div>' +
          '<button class="ts-all' + (st.all?' on':'') + '" data-act="all">' + esc(T(L,S.whole.gr,S.whole.en)) + '</button>' +
        '</section>' +

        // STEP B — game board
        '<section class="ts-card">' +
          '<div class="ts-label"><em>Β</em>' + T(L,'Πίνακας Παιχνιδιών','Game Panel') + '</div>' +
          '<div class="ts-note">' + T(L,'Διάλεξε παιχνίδι. Παίζεται με την ύλη που όρισες πάνω.','Choose a game. It plays with the content you set above.') + '</div>' +
          '<div class="ts-gsearch"><span class="ts-gsearch-ico">' + glyph('search',17,1.8) + '</span>' +
            '<input class="ts-input" id="ts-gq" value="' + esc(st.gq) + '" placeholder="' + T(L,'Αναζήτηση παιχνιδιού…','Search a game…') + '"></div>' +
          '<div class="ts-board">' +
            games.map(x => '<button class="ts-gtile' + (st.game===x.id?' on':'') + '" data-act="game" data-v="' + x.id + '">' +
              '<span class="ts-gtile-medal">' + glyph(x.glyph,22,1.7) + '</span>' +
              '<span class="ts-gtile-txt"><span class="ts-gtile-name">' + esc(T(L,x.gr,x.en)) + '</span>' +
              '<span class="ts-gtile-desc">' + esc(T(L,x.desc.gr,x.desc.en)) + '</span></span>' +
              '<span class="ts-gtile-tag">' + esc(T(L,x.tag.gr,x.tag.en)) + '</span></button>').join('') +
          '</div>' +
        '</section>' +

        // STEP C — setup
        '<section class="ts-card">' +
          '<div class="ts-label"><em>Γ</em>' + T(L,'Ρυθμίσεις','Setup') + ' · ' + esc(T(L,g.gr,g.en)) + '</div>' +
          '<div class="ts-carry"><span class="ts-carry-ico">' + glyph(g.glyph,18,1.7) + '</span>' +
            '<span class="ts-carry-txt"><b>' + esc(T(L,g.gr,g.en)) + '</b> ' + T(L,'θα φορτωθεί με','will load with') + ' <b class="ts-carry-content">' + esc(contentSummary()) + '</b></span>' +
            '<span class="ts-carry-chips">' + contentChips().map(c => '<em>' + esc(c) + '</em>').join('') + '</span></div>' +
          '<div class="ts-players">' +
            (g.players === 1
              ? '<label class="ts-pfield"><span>' + T(L,'Παίκτης','Player') + '</span><input class="ts-input" id="ts-p1" value="' + esc(st.p1) + '" maxlength="20"></label>'
              : '<label class="ts-pfield"><span>' + (st.game==='tow'?T(L,'Ομάδα Α','Team A'):T(L,'Παίκτης 1','Player 1')) + '</span><input class="ts-input" id="ts-p1" value="' + esc(st.p1) + '" maxlength="20"></label>' +
                '<label class="ts-pfield"><span>' + (st.game==='tow'?T(L,'Ομάδα Β','Team B'):T(L,'Παίκτης 2','Player 2')) + '</span><input class="ts-input" id="ts-p2" value="' + esc(st.p2) + '" maxlength="20"></label>'
            ) +
          '</div>' +
          (st.game === 'solo'
            ? '<div class="ts-sublabel">' + T(L,'Τύποι ερωτήσεων','Question types') + '</div>' +
              '<div class="ts-fmts">' + FORMATS.map(f => '<button class="ts-fmt' + (st.fmts.includes(f.id)?' on':'') + '" data-act="fmt" data-v="' + f.id + '">' +
                '<span class="ts-fmt-ico">' + glyph(f.glyph,20,1.7) + '</span>' +
                '<span class="ts-fmt-txt"><span class="ts-fmt-name">' + esc(T(L,f.gr,f.en)) + '</span><span class="ts-fmt-sub">' + esc(T(L,f.sub.gr,f.sub.en)) + '</span></span>' +
                '<span class="ts-fmt-tick">' + glyph('check',13,2.4) + '</span></button>').join('') + '</div>'
            : '') +
          '<div class="ts-sublabel">' + T(L,'Βοήθειες','Lifelines') + '</div>' +
          '<div class="ts-helps">' + HELPS.map(h => '<button class="ts-help' + (st.helps.includes(h.id)?' on':'') + '" data-act="help" data-v="' + h.id + '"><b>' + esc(h.label) + '</b><span>' + esc(T(L,h.gr,h.en)) + '</span></button>').join('') + '</div>' +
        '</section>' +

        // START
        '<div class="ts-startwrap">' +
          '<div class="ts-startmeta">' + esc(contentSummary()) + ' · ' + (nSel()*9) + ' ' + T(L,'ερωτήσεις','questions') + (st.game==='solo' ? ' · ' + st.fmts.length + ' ' + T(L,'τύποι','types') : '') + '</div>' +
          '<button class="ts-start" data-act="start"' + (hasContent()?'':' disabled') + '>' + T(L,'Έναρξη','Start') + ' — ' + esc(T(L,g.gr,g.en)) + '</button>' +
        '</div>' +

      '</div>' +
      '<footer class="ts-foot">SymposiON · MMXXVI</footer>';

    wire(root);
  }

  function wire(root) {
    root.querySelectorAll('[data-act]').forEach(el => {
      el.addEventListener('click', () => {
        const act = el.dataset.act, v = el.dataset.v;
        if (act === 'theme') st.theme = v;
        else if (act === 'lang') { st.lang = v; window.siteLang = v; }
        else if (act === 'sec') { st.all = false; if (st.secs.has(v)) st.secs.delete(v); else st.secs.add(v); }
        else if (act === 'all') { st.all = !st.all; st.secs = new Set(); }
        else if (act === 'game') { _syncInputs(); st.game = v; }
        else if (act === 'fmt') { st.fmts = st.fmts.includes(v) ? st.fmts.filter(x=>x!==v) : st.fmts.concat(v); }
        else if (act === 'help') { st.helps = st.helps.includes(v) ? st.helps.filter(x=>x!==v) : st.helps.concat(v); }
        else if (act === 'share') { _share(); return; }
        else if (act === 'start') { _start(); return; }
        render();
      });
    });
    const gq = root.querySelector('#ts-gq');
    if (gq) gq.addEventListener('input', () => {
      st.gq = gq.value;
      const board = root.querySelector('.ts-board');
      const games = GAMES.filter(x => { const q = st.gq.trim().toLowerCase(); return !q || (x.gr+' '+x.en).toLowerCase().includes(q); });
      const L = st.lang;
      if (board) { board.innerHTML = games.map(x => '<button class="ts-gtile' + (st.game===x.id?' on':'') + '" data-act="game" data-v="' + x.id + '">' +
        '<span class="ts-gtile-medal">' + glyph(x.glyph,22,1.7) + '</span>' +
        '<span class="ts-gtile-txt"><span class="ts-gtile-name">' + esc(T(L,x.gr,x.en)) + '</span>' +
        '<span class="ts-gtile-desc">' + esc(T(L,x.desc.gr,x.desc.en)) + '</span></span>' +
        '<span class="ts-gtile-tag">' + esc(T(L,x.tag.gr,x.tag.en)) + '</span></button>').join('');
        board.querySelectorAll('[data-act="game"]').forEach(b => b.addEventListener('click', () => { st.game = b.dataset.v; render(); }));
      }
    });
  }
  function _syncInputs() {
    const p1 = document.getElementById('ts-p1'), p2 = document.getElementById('ts-p2');
    if (p1) st.p1 = p1.value; if (p2) st.p2 = p2.value;
  }

  function _share() {
    try {
      const url = location.href;
      if (navigator.clipboard) navigator.clipboard.writeText(url);
      const btn = document.querySelector('.ts-share');
      if (btn) { const o = btn.innerHTML; btn.innerHTML = T(st.lang,'Αντιγράφηκε!','Copied!'); setTimeout(()=>{ btn.innerHTML = o; }, 1400); }
    } catch (_) {}
  }

  /* ── launch the chosen game scoped to the selected content (synthesis) ──
     Resolve the board game to a synthesis opener key via SYN_LAUNCH_MAP, stash
     the selected content on window._gpPendingConfig (so any engine that wants it
     can read it), then hand off to window.synLaunch. ── */
  function _start() {
    if (!hasContent()) return;
    _syncInputs();
    const g = sel();
    const datasetId = st.S.engineDataset;
    const sections = st.all ? st.S.sections.slice() : [...st.secs];
    const modeConfig = {
      lang: st.lang,
      triviaSections: sections,
      triviaWhole: st.all,
      players: [st.p1, st.p2].filter(Boolean),
      formats: st.game === 'solo' ? st.fmts.slice() : null,
      helps: st.helps.slice(),
    };
    // expose for engines that read a pending config
    window._gpPendingConfig = Object.assign({ engineId: g.engine, datasetId, datasetLabel: contentSummary() }, modeConfig);

    const map = window.SYN_LAUNCH_MAP || {};
    const openFn = map[g.launchName] || map[g.engine] || null;

    close(); // leave the panel before launching over the shell

    setTimeout(() => {
      try {
        if (openFn && typeof window.synLaunch === 'function') {
          window.synLaunch(openFn);
          return;
        }
      } catch (e) { /* fall through */ }
      // last-resort fallback: a friendly note via the home preview, if available
      if (window.SymPreview && typeof window.SymPreview.open === 'function') {
        window.SymPreview.open('mc', {
          title: T(st.lang, g.gr, g.en),
          note: T(st.lang, 'Αυτό το παιχνίδι θα είναι σύντομα διαθέσιμο για αυτή την ύλη.',
                            'This game will be available for this content soon.'),
        });
      }
    }, 60);
  }

  /* ══════════════════════════════════════════════════════════════════════
     LIVE OVERRIDE — admin-edited subject presets (guarded). In synthesis the
     create-a-trivia presets can be persisted locally via SymStore (no Firestore
     dependency in the sandbox). A missing / malformed payload leaves the bundled
     presets intact.
  ══════════════════════════════════════════════════════════════════════════ */
  function _mergeSubject(base, ov) {
    const out = clone(base || {});
    ov = (ov && typeof ov === 'object') ? ov : {};
    if (ov.glyph != null)         out.glyph = String(ov.glyph);
    if (ov.engineDataset != null) out.engineDataset = String(ov.engineDataset);
    if (ov.titlePre != null)      out.titlePre = String(ov.titlePre);
    ['eyebrow','titleEm','sub','heading','unit','units','whole','pickOne'].forEach(k => {
      const b = out[k], o = ov[k];
      out[k] = {
        gr: (o && o.gr != null) ? String(o.gr) : ((b && b.gr) || ''),
        en: (o && o.en != null) ? String(o.en) : ((b && b.en) || ''),
      };
    });
    if (Array.isArray(ov.sections)) out.sections = ov.sections.map(String);
    if (Array.isArray(ov.initial))  out.initial  = ov.initial.map(String);
    if (ov.cols != null && +ov.cols > 0) out.cols = +ov.cols;
    out.glyph         = out.glyph || 'amphora';
    out.engineDataset = out.engineDataset || '';
    out.titlePre      = (out.titlePre != null) ? out.titlePre : 'Trivia';
    out.sections      = Array.isArray(out.sections) ? out.sections : [];
    out.initial       = (Array.isArray(out.initial) ? out.initial : []).filter(x => out.sections.includes(x));
    out.cols          = (+out.cols > 0) ? +out.cols : 8;
    return out;
  }
  function _applyOverride(doc) {
    try {
      const src = (doc && typeof doc === 'object' && doc.subjects && typeof doc.subjects === 'object') ? doc.subjects : null;
      if (!src) return false;
      let keys = (Array.isArray(doc.order) && doc.order.length) ? doc.order.slice() : Object.keys(src);
      keys = keys.filter(k => src[k] && typeof src[k] === 'object');
      if (!keys.length) return false;
      const next = {};
      keys.forEach(k => { next[k] = _mergeSubject(SUBJECTS_BASE[k], src[k]); });
      Object.keys(SUBJECTS).forEach(k => delete SUBJECTS[k]);
      keys.forEach(k => { SUBJECTS[k] = next[k]; });
      return true;
    } catch (e) { return false; }
  }
  function _rerenderIfOpen() {
    if (!st) return;
    const S2 = SUBJECTS[st.subjectId];
    if (!S2) { close(); return; }
    st.S = S2;
    st.secs = new Set([...st.secs].filter(x => S2.sections.includes(x)));
    if (st.all && !S2.sections.length) st.all = false;
    render();
  }
  // Load any locally-persisted admin presets (SymStore), guarded.
  (function _bootLocalOverride() {
    try {
      if (window.SymStore && typeof window.SymStore.get === 'function') {
        const doc = window.SymStore.get('triviaSubjects', null);
        if (doc) _applyOverride(doc);
      }
    } catch (_) {}
  })();

  window.openTriviaPanel = function (subjectId) { open(subjectId || 'iliada'); };
  window.closeTriviaPanel = function () { close(); };
  window.TRIVIA_SUBJECTS = SUBJECTS;
  // Editor bridge for an admin "create-a-trivia" panel: apply live edits,
  // persist them via SymStore, read the pristine code defaults / live presets.
  window.TriviaSubjects = {
    apply:  doc => { const ok = _applyOverride(doc); if (ok) _rerenderIfOpen(); return ok; },
    save:   doc => { try { if (window.SymStore) window.SymStore.set('triviaSubjects', doc); } catch(_){}
                     const ok = _applyOverride(doc); if (ok) _rerenderIfOpen(); return ok; },
    base:   () => clone(SUBJECTS_BASE),
    live:   () => SUBJECTS,
    glyph:  (name, size) => glyph(name, size),
  };
})();
