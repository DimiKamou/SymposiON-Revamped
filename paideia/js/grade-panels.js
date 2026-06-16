/* ════════════════════════════════════════════════════════════════════
   grade-panels.js  —  SymposiON
   Monkey-patches navToGrade() so every grade overview renders its
   subjects as stacked .subject-panel sections (with per-game tiles)
   instead of the legacy .subject-card grid.

   Drop this file after nav.js in index.html:
     <script src="js/nav.js?v=7"></script>
     <script src="js/grade-panels.js"></script>
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────────────────────────
     1.  Subject → panel visual identity
         tint = value of data-subject (drives CSS accent colour)
         illu = SVG name for the header ornament + icon
     ───────────────────────────────────────────────────────────────── */
  const SUBJECT_META = {
    // ── Grammar categories ────────────────────────────────────────
    ousiastika:        { tint: 'grammar',        illu: 'column'       },
    antonymies:        { tint: 'grammar',        illu: 'cards'        },
    epitheta:          { tint: 'grammar',        illu: 'wreath'       },
    rimata:            { tint: 'grammar',        illu: 'helmet'       },
    // ── Texts / subjects ─────────────────────────────────────────
    iliada:            { tint: 'iliad',          illu: 'shield-spear' },
    odysseia:          { tint: 'odyssey',        illu: 'trireme'      },
    eleni:             { tint: 'tragedy',        illu: 'theatre'      },
    antigoni:          { tint: 'tragedy',        illu: 'theatre'      },
    'archaia-glossa':  { tint: 'ancient-greek',  illu: 'scroll'       },
    archaia:           { tint: 'ancient-greek',  illu: 'column'       },
    'archaia-thx':     { tint: 'ancient-greek',  illu: 'column'       },
    'archaia-th':      { tint: 'ancient-greek',  illu: 'column'       },
    'elliniki-glossa': { tint: 'modern-greek',   illu: 'owl'          },
    nea:               { tint: 'modern-greek',   illu: 'owl'          },
    'nea-ellinika':    { tint: 'modern-greek',   illu: 'owl'          },
    'glossa-log':      { tint: 'modern-greek',   illu: 'owl'          },
    logotexnia:        { tint: 'literature',     illu: 'lyre'         },
    'logotexnia-b':    { tint: 'literature',     illu: 'lyre'         },
    'logotexnia-c':    { tint: 'literature',     illu: 'lyre'         },
    latinika:          { tint: 'latin',          illu: 'walls'        },
    istoria:           { tint: 'history',        illu: 'acropolis'    },
    'istoria-gp':      { tint: 'history',        illu: 'acropolis'    },
    'istoria-kat':     { tint: 'history',        illu: 'acropolis'    },
    'istoria-g3':      { tint: 'history',        illu: 'acropolis'    },
  };

  /* ─────────────────────────────────────────────────────────────────
     2.  Game type → tile-banner illustration
     ───────────────────────────────────────────────────────────────── */
  const TYPE_ILLU = {
    // ── Grammar drills ────────────────────────────────────────────
    lyo:               'column',
    'klisi-rimaton':   'column',
    eimi:              'column',
    pathitiko:         'chariot',
    afwnolekta:        'helmet',
    'aoristos-b':      'sword',
    'rimata-mi':       'gear',
    synirimmena:       'wreath',
    'anwmala-rimata':  'cyclops-eye',
    paratheta:         'wreath',
    'klisi-epitheton': 'wreath',
    nouns:             'column',
    'noun-tow':        'rope',
    'noun-fill':       'quill',
    antonymies:        'cards',
    // ── Arcade / mechanics ────────────────────────────────────────
    'grammar-invaders':'invader',
    'rapid-fire':      'lightning',
    'iliada-arcade':   'shield-spear',
    'iliada-tow':      'rope',
    'temple-run':      'runner',
    'odyssey-journey': 'map',
    'odyssey-trivia':  'trireme',
    'myth-memory':     'cards',
    'epic-puzzle':     'timeline',
    'crypto-hack':     'cipher',
    labyrinth:         'labyrinth',
    phalanx:           'shield-round',
    naumachia:         'trident',
    dig:               'shovel',
    // ── Latin ─────────────────────────────────────────────────────
    'lat-nouns':       'walls',
    'lat-verbs':       'walls',
    'lat-anwmala':     'walls',
    'lat-anwmala-theory': 'scroll',
    'lat-epitheta':    'walls',
    'lat-antonymies':  'walls',
    'lat-antonymies-theory': 'scroll',
    'lat-kata':        'scroll',
    'lat-nouns-kata':  'scroll',
    'lat-nouns-kata-theory': 'scroll',
    'lat-epitheta-kata':'scroll',
    'lat-epitheta-kata-theory':'scroll',
    // ── History / study ───────────────────────────────────────────
    'history-game':    'acropolis',
    study:             'tablet',
  };

  /* ─────────────────────────────────────────────────────────────────
     2b. Game type → sx-tile category tag
     ───────────────────────────────────────────────────────────────── */
  const TYPE_TAG = {
    'lyo':               'Lesson',
    'klisi-rimaton':     'Lesson',
    'pathitiko':         'Lesson',
    'afwnolekta':        'Lesson',
    'rimata-mi':         'Lesson',
    'synirimmena':       'Lesson',
    'anwmala-rimata':    'Lesson',
    'eimi':              'Lesson',
    'klisi-epitheton':   'Lesson',
    'paratheta':         'Lesson',
    'nouns':             'Lesson',
    'antonymies':        'Lesson',
    'noun-tow':          'Tug of War',
    'iliada-tow':        'Tug of War',
    'noun-fill':         'Fill-in',
    'grammar-invaders':  'Arcade',
    'rapid-fire':        'Speed',
    'iliada-arcade':     'Arcade',
    'temple-run':        'Endless',
    'odyssey-journey':   'Journey',
    'myth-memory':       'Memory',
    'epic-puzzle':       'Timeline',
    'crypto-hack':       'Cipher',
    'history-game':      'Study',
    'odyssey-trivia':    'Trivia',
    'study':             'Flashcards',
    'trivia':            'Trivia',
    'lat-kata':          'Lesson',
    'lat-nouns-kata':    'Lesson',
    'lat-nouns':         'Lesson',
    'lat-verbs':         'Lesson',
    'lat-anwmala':       'Lesson',
    'lat-anwmala-theory': 'Theory',
    'lat-epitheta':      'Lesson',
    'lat-epitheta-kata': 'Lesson',
    'lat-antonymies':    'Lesson',
    'lat-antonymies-theory': 'Theory',
    'lat-nouns-kata-theory': 'Theory',
    'lat-epitheta-kata-theory': 'Theory',
    'labyrinth':         'Puzzle',
    'phalanx':           'Battle',
    'naumachia':         'Naval',
    'dig':               'Discovery',
    'istoria-g3':        'Study',
  };

  /* ─────────────────────────────────────────────────────────────────
     2c. Game type → Solo / Multiplayer / Theory zone
     ───────────────────────────────────────────────────────────────── */
  const TYPE_MODE = {
    // ── Theory (study drills & lesson games) ──────────────────────
    'study':            'theory',
    'lyo':              'theory',
    'klisi-rimaton':    'theory',
    'eimi':             'theory',
    'pathitiko':        'theory',
    'afwnolekta':       'theory',
    'aoristos-b':       'theory',
    'rimata-mi':        'theory',
    'synirimmena':      'theory',
    'anwmala-rimata':   'theory',
    'nouns':            'theory',
    'antonymies':       'theory',
    'paratheta':        'theory',
    'klisi-epitheton':  'theory',
    'lat-kata':         'theory',
    'lat-nouns-kata':   'theory',
    'lat-nouns':        'theory',
    'lat-verbs':        'theory',
    'lat-anwmala':      'theory',
    'lat-anwmala-theory': 'theory',
    'lat-epitheta':     'theory',
    'lat-epitheta-kata':'theory',
    'lat-antonymies':   'theory',
    'lat-antonymies-theory': 'theory',
    'lat-nouns-kata-theory': 'theory',
    'lat-epitheta-kata-theory': 'theory',
    'history-game':     'theory',
    'istoria-g3':       'theory',
    // ── Multiplayer (class / team games) ─────────────────────────
    'iliada-tow':       'multi',
    'noun-tow':         'multi',
    'naumachia':        'multi',
    'phalanx':          'multi',
    // ── Solo: everything else (default when not in this map) ──────
  };

  /* ─────────────────────────────────────────────────────────────────
     2d. Game type → emoji icon (all zones share the same icon system)
     ───────────────────────────────────────────────────────────────── */
  const TYPE_ALL_ICON = {
    // ── Theory / lesson ───────────────────────────────────────────
    'study':            '🃏',
    'lyo':              '🏛️',
    'klisi-rimaton':    '🏛️',
    'eimi':             '⚡',
    'pathitiko':        '🏺',
    'afwnolekta':       '🔇',
    'aoristos-b':       '⏳',
    'rimata-mi':        '⚙️',
    'synirimmena':      '🔗',
    'anwmala-rimata':   '🌀',
    'nouns':            '📜',
    'antonymies':       '👤',
    'paratheta':        '🔼',
    'klisi-epitheton':  '✨',
    'lat-kata':         '📖',
    'lat-nouns-kata':   '📜',
    'lat-nouns':        '🏺',
    'lat-verbs':        '🏺',
    'lat-epitheta':     '🏺',
    'lat-epitheta-kata':'📜',
    'lat-antonymies':   '🏺',
    'lat-antonymies-theory': '📖',
    'lat-anwmala-theory': '📖',
    'lat-nouns-kata-theory': '📖',
    'lat-epitheta-kata-theory': '📖',
    'history-game':     '📜',
    'istoria-g3':       '📜',
    // ── Multiplayer ────────────────────────────────────────────────
    'iliada-tow':       '🪢',
    'noun-tow':         '🪢',
    'naumachia':        '⚓',
    'phalanx':          '🛡️',
    // ── Solo arcade / games ────────────────────────────────────────
    'grammar-invaders': '👾',
    'rapid-fire':       '⚡',
    'iliada-arcade':    '🎮',
    'temple-run':       '🏃',
    'odyssey-journey':  '🗺️',
    'myth-memory':      '🃏',
    'epic-puzzle':      '🧩',
    'crypto-hack':      '🔐',
    'labyrinth':        '🌀',
    'dig':              '⛏️',
    'noun-fill':        '✏️',
    'odyssey-trivia':   '⛵',
    'trivia':           '🏆',
  };
  // Keep old name as alias so any external references still resolve
  const TYPE_THEORY_ICON = TYPE_ALL_ICON;

  /* ─────────────────────────────────────────────────────────────────
     3.  featuredGame type → human-readable label + meta
     ───────────────────────────────────────────────────────────────── */
  const FEAT_META = {
    'lyo':        { gr: 'Μαθαίνοντας το Λύω',  en: 'Learning Lyo',           meta: '32 επίπεδα' },
    'paratheta':  { gr: 'Παραθετικά Επιθέτων', en: 'Degrees of Adjectives',  meta: '10 επίπεδα' },
    'nouns':      { gr: 'Κλίση Ουσιαστικών',   en: 'Noun Declension',         meta: '200+'       },
    'antonymies': { gr: 'Κλίση Αντωνυμιών',    en: 'Pronoun Declension',      meta: '19 επίπεδα' },
  };

  /* ─────────────────────────────────────────────────────────────────
     4.  Roman numerals
     ───────────────────────────────────────────────────────────────── */
  const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];

  /* ─────────────────────────────────────────────────────────────────
     5.  Helper: resolve current language
     ───────────────────────────────────────────────────────────────── */
  function lang() {
    return (typeof siteLang !== 'undefined' ? siteLang : 'gr');
  }

  /* ─────────────────────────────────────────────────────────────────
     6.  Build the onclick for a tile
         Sets currentGradeKey / currentSubjectId so game launchers
         have the right context even when opened from the grade page.
     ───────────────────────────────────────────────────────────────── */
  function makeTileOpener(type, gradeKey, subjectId) {
    const openers = {
      'lyo':              () => openLyo(),
      'paratheta':        () => openParatheta(),
      'blade':            () => { if (typeof openBlade === 'function') openBlade(); },
      'nouns':            () => openOusiastika(),
      'antonymies':       () => openAntonymies(),
      'klisi-epitheton':  () => { if (typeof openEpitheta      === 'function') openEpitheta();      },
      'pathitiko':        () => openPathitiko(),
      'afwnolekta':       () => openAfwnolekta(),
      'aoristos-b':       () => openAoristosB(),
      'rimata-mi':        () => openRimataMi(),
      'synirimmena':      () => openSynirimmena(),
      'anwmala-rimata':   () => openAnwmalaRimata(),
      'klisi-rimaton':    () => openKlisiRimaton(),
      'eimi':             () => openEimi(),
      'iliada-arcade':    () => openIliadaArcade(),
      'iliada-tow':       () => openTow(),
      'noun-tow':         () => openNounTow(),
      'noun-fill':        () => openNounFill(),
      'odyssey-journey':  () => openOdysseyJourney(),
      'odyssey-trivia':   () => launchOdysseyTrivia(lang()),
      'istoria-g3':       () => openIstoria(),
      'history-game':     () => openHistoryGame(),
      'grammar-invaders': () => openInvaders(),
      'myth-memory':      () => { if (typeof openMythMemory    === 'function') openMythMemory();    },
      'rapid-fire':       () => { if (typeof openRapidFire     === 'function') openRapidFire();     },
      'epic-puzzle':      () => { if (typeof openEpicPuzzle    === 'function') openEpicPuzzle(subjectId); },
      'lat-kata':         () => { if (typeof openLatKata       === 'function') openLatKata();       },
      'lat-nouns-kata':   () => { if (typeof openLatNounsKata  === 'function') openLatNounsKata();  },
      'lat-nouns':        () => { if (typeof openLatNouns      === 'function') openLatNouns();      },
      'lat-verbs':        () => { if (typeof openLatVerbs      === 'function') openLatVerbs();      },
      'lat-anwmala':      () => { if (typeof openLatAnwmala    === 'function') openLatAnwmala();    },
      'lat-anwmala-theory': () => { if (typeof openLatAnwmalaTheory === 'function') openLatAnwmalaTheory(); },
      'lat-epitheta':     () => { if (typeof openLatEpitheta   === 'function') openLatEpitheta();   },
      'lat-epitheta-kata':() => { if (typeof openLatEpithetaKata === 'function') openLatEpithetaKata(); },
      'lat-antonymies':   () => { if (typeof openLatAntonymies === 'function') openLatAntonymies(); },
      'lat-antonymies-theory': () => { if (typeof openLatAntonymiesTheory === 'function') openLatAntonymiesTheory(); },
      'lat-nouns-kata-theory': () => { if (typeof openLatNounsKataTheory === 'function') openLatNounsKataTheory(); },
      'lat-epitheta-kata-theory': () => { if (typeof openLatEpithetaKataTheory === 'function') openLatEpithetaKataTheory(); },
      'temple-run':       () => { if (typeof openTempleRun     === 'function') openTempleRun({}); },
      'labyrinth':        () => { if (typeof openLabyrinth     === 'function') openLabyrinth();     },
      'phalanx':          () => { if (typeof openPhalanx       === 'function') openPhalanx();       },
      'naumachia':        () => { if (typeof openNaumachia     === 'function') openNaumachia();     },
      'dig':              () => { if (typeof openDig           === 'function') openDig();           },
    };

    const fn = openers[type];
    if (!fn) return null;

    return () => {
      // Ensure nav globals are set for game launchers that read them
      if (typeof currentGradeKey   !== 'undefined') currentGradeKey   = gradeKey;
      if (typeof currentSubjectId  !== 'undefined') currentSubjectId  = subjectId;
      fn();
    };
  }

  /* ─────────────────────────────────────────────────────────────────
     7.  Build one <a class="tile"> element
     ───────────────────────────────────────────────────────────────── */
  function buildTile(label, metaText, illu, onclick, featured) {
    const a = document.createElement('a');
    a.className = 'tile' + (featured ? ' tile--featured' : '');
    if (featured) a.dataset.featured = '1';
    a.setAttribute('role', 'button');
    a.setAttribute('tabindex', '0');
    a.onclick   = onclick;
    a.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onclick(); }
    };
    const playLabel = lang() === 'en' ? 'Play' : 'Παίξε';
    a.innerHTML = `
      <div class="tile-banner" data-illu="${illu}"></div>
      <div class="tile-body">
        <h3 class="tile-title">${label}</h3>
        <p  class="tile-meta">${metaText}</p>
        <span class="tile-cta"><span>${playLabel}</span><span>→</span></span>
      </div>`;
    return a;
  }

  /* ─────────────────────────────────────────────────────────────────
     8a. Build the "Όλα τα παιχνίδια / All games" overflow tile
         Shown as the 4th tile whenever a subject has > 3 games.
     ───────────────────────────────────────────────────────────────── */
  function buildAllGamesTile(overflow, gradeKey, subjectId, isEn) {
    const a = document.createElement('a');
    a.className = 'tile tile--all-games';
    a.setAttribute('role', 'button');
    a.setAttribute('tabindex', '0');
    const fn = () => navToSubject(gradeKey, subjectId);
    a.onclick   = fn;
    a.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); }
    };
    const moreLabel = isEn ? 'All games'  : 'Όλα τα παιχνίδια';
    const ctaLabel  = isEn ? 'See all'    : 'Δες όλα';
    a.innerHTML = `
      <div class="tile-banner tile-banner--count">
        <span class="tile-overflow-count">+${overflow}</span>
      </div>
      <div class="tile-body">
        <h3 class="tile-title">${moreLabel}</h3>
        <p  class="tile-meta">&nbsp;</p>
        <span class="tile-cta"><span>${ctaLabel}</span><span>→</span></span>
      </div>`;
    return a;
  }

  /* ─────────────────────────────────────────────────────────────────
     8.  Build one <section class="subject-panel"> for a subject
         Reads meta.tint → data-subject (CSS accent)
         Reads meta.illu → SVG ornament + icon + tile banners
     ───────────────────────────────────────────────────────────────── */
  function buildSubjectPanel(s, gradeKey, index) {
    const isEn = lang() === 'en';
    const title      = isEn ? (s.en?.title || s.title) : s.title;
    const desc       = isEn ? (s.en?.desc  || s.desc)  : s.desc;
    const gradeTitle = isEn
      ? (GRADES[gradeKey]?.titleEn || GRADES[gradeKey]?.title || '')
      : (GRADES[gradeKey]?.title   || '');

    const meta = SUBJECT_META[s.id] || { tint: 'ancient-greek', illu: 'column' };

    // Collect tiles we'll render (so we can display an accurate count)
    const tiles = [];

    // ── Featured game ───────────────────────────────────────────
    if (s.featuredGame) {
      const ft   = s.featuredGame.type;
      const fm   = FEAT_META[ft];
      const ftLbl  = fm ? (isEn ? fm.en : fm.gr) : title;
      const ftMeta = fm ? fm.meta : '';
      const illu   = TYPE_ILLU[ft] || meta.illu;
      const opener = makeTileOpener(ft, gradeKey, s.id);
      if (opener) tiles.push(buildTile(ftLbl, ftMeta, illu, opener, true));
    }

    // ── Extra games ──────────────────────────────────────────────
    if (s.extraGames) {
      s.extraGames.forEach(eg => {
        const egLabel  = isEn ? (eg.en?.label || eg.label) : eg.label;
        const egDesc   = isEn ? (eg.en?.desc  || eg.desc)  : eg.desc;
        const illu     = TYPE_ILLU[eg.type] || meta.illu;
        const opener   = makeTileOpener(eg.type, gradeKey, s.id);
        const onclick  = opener || (() => navToSubject(gradeKey, s.id));
        tiles.push(buildTile(egLabel, egDesc, illu, onclick, false));
      });
    }

    // ── No games yet — single "Explore" tile ─────────────────────
    if (tiles.length === 0) {
      const exploreLabel = isEn ? 'Explore' : 'Εξερεύνησε';
      const exploreMeta  = isEn ? 'All modes' : 'Όλοι οι τρόποι';
      tiles.push(buildTile(
        exploreLabel, exploreMeta, meta.illu,
        () => navToSubject(gradeKey, s.id),
        false
      ));
    }

    // ── Cap at 3 visible tiles + overflow tile ────────────────────
    const MAX_TILES  = 3;
    const totalTiles = tiles.length;        // real count for the side-bar meta
    if (tiles.length > MAX_TILES) {
      const overflow = tiles.length - MAX_TILES;
      tiles.splice(MAX_TILES);
      tiles.push(buildAllGamesTile(overflow, gradeKey, s.id, isEn));
    }

    // ── Assemble panel ───────────────────────────────────────────
    // Use the exact same DOM structure as the home-page panels so
    // subject-panel.css applies identically (aside.subject-side,
    // div.subject-roman, div.subject-tiles-wrap, etc.).
    const panel = document.createElement('section');
    panel.className       = 'subject-panel';
    panel.dataset.subject = meta.tint;

    const gamesWord = isEn
      ? (totalTiles === 1 ? 'game' : 'games')
      : 'παιχνίδια';
    const tagline   = isEn ? `Play now · ${title}` : `Παίξε τώρα · ${title}`;
    const allLabel  = isEn ? 'All games' : 'Όλα τα παιχνίδια';
    const shareLabel = isEn ? 'Share QR' : 'QR';

    panel.innerHTML = `
      <aside class="subject-side">
        <div class="subject-roman">${ROMAN[index] || (index + 1)}</div>
        <h2 class="subject-title">${title}</h2>
        <p class="subject-sub">${isEn ? (s.en?.title || s.title) : s.title}</p>
        <p class="subject-summary">${desc}</p>
        <div class="subject-ornament" aria-hidden="true"
             data-illu="${meta.illu}" data-size="210"></div>
        <div class="subject-icon"    aria-hidden="true"
             data-illu="${meta.illu}" data-size="64"></div>
        <div class="subject-meta">
          <span>${totalTiles} ${gamesWord}</span>
          <span class="dot">·</span>
          <span class="levels">${gradeTitle}</span>
        </div>
      </aside>
      <div class="subject-tiles-wrap">
        <div class="subject-tiles-header">
          <div class="subject-tagline">${tagline}</div>
          <div class="subject-header-actions">
            <button class="subject-qr-link" title="${isEn ? 'Share with class via QR' : 'Κοινοποίηση στην τάξη μέσω QR'}" aria-label="QR">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3" rx=".5"/>
                <rect x="19" y="14" width="2" height="2" rx=".5"/><rect x="14" y="19" width="2" height="2" rx=".5"/>
                <rect x="17" y="17" width="3" height="3" rx=".5"/>
              </svg>
              ${shareLabel}
            </button>
            <button class="subject-all-link">${allLabel} →</button>
          </div>
        </div>
        <div class="subject-tiles"></div>
      </div>`;

    // Wire "All games →" button to the subject page
    panel.querySelector('.subject-all-link').onclick = () => navToSubject(gradeKey, s.id);
    // Wire QR share button
    const qrBtn = panel.querySelector('.subject-qr-link');
    if (qrBtn) {
      qrBtn.onclick = () => {
        if (typeof showQR === 'function') {
          showQR(title, { nav: 'subject', grade: gradeKey, subject: s.id });
        }
      };
    }

    const tilesGrid = panel.querySelector('.subject-tiles');
    tiles.forEach(t => tilesGrid.appendChild(t));

    return panel;
  }

  /* ─────────────────────────────────────────────────────────────────
     9.  Replace grade-subjects-wrap content with panels
     ───────────────────────────────────────────────────────────────── */
  function renderGradePanels(gradeKey) {
    const g = GRADES[gradeKey];
    if (!g) return;

    const wrap = document.getElementById('grade-subjects-wrap');
    if (!wrap) return;

    wrap.innerHTML = '';
    // Preserve original classes; add our modifier
    wrap.classList.add('grade-subjects-wrap--panels');

    const isEn = lang() === 'en';

    if (g.tracks) {
      // Grades with multiple tracks (Β΄/Γ΄ Λυκείου)
      let panelIdx = 0;
      g.tracks.forEach(track => {
        const trackTitle = isEn ? (track.titleEn || track.title) : track.title;
        const lbl = document.createElement('div');
        lbl.className   = 'grade-track-label';
        lbl.textContent = trackTitle;
        wrap.appendChild(lbl);
        track.subjects.forEach(s => {
          wrap.appendChild(buildSubjectPanel(s, gradeKey, panelIdx++));
        });
      });
    } else {
      // Simple grades (Γυμνάσιο, Γραμματική, Λύκειο Α΄)
      g.subjects.forEach((s, i) => wrap.appendChild(buildSubjectPanel(s, gradeKey, i)));
    }

    // Inject illustrations into the newly-created [data-illu] elements
    if (typeof window._injectIllus === 'function') window._injectIllus(wrap);
  }

  /* ─────────────────────────────────────────────────────────────────
     10. Monkey-patch navToGrade
         The original handles: state, breadcrumbs, setTheme, goTo.
         We let it run, then swap the subject grid for panels.
     ───────────────────────────────────────────────────────────────── */
  const _origNavToGrade = window.navToGrade;
  window.navToGrade = function (gradeKey) {
    _origNavToGrade(gradeKey);   // ← handles state / nav / goTo
    renderGradePanels(gradeKey); // ← replaces the .subject-card grid
  };

  /* ─────────────────────────────────────────────────────────────────
     11. renderSubjectPage — builds the sx-tile layout on the
         #page-subject screen (replaces the old .g-card grid).
     ───────────────────────────────────────────────────────────────── */
  function renderSubjectPage(gradeKey, subjectId) {
    const g = GRADES[gradeKey];
    if (!g) return;

    let subject = null;
    if (g.subjects) subject = g.subjects.find(s => s.id === subjectId);
    if (!subject && g.tracks) g.tracks.forEach(tr => {
      const f = tr.subjects.find(s => s.id === subjectId);
      if (f) subject = f;
    });
    if (!subject) return;

    const isEn        = lang() === 'en';
    const subjectTitle = isEn ? (subject.en?.title || subject.title) : subject.title;
    const subjectDesc  = isEn ? (subject.en?.desc  || subject.desc)  : subject.desc;
    const gradeTitle   = isEn ? (g.titleEn || g.title) : g.title;
    const enTitle      = subject.en?.title || '';
    const meta         = SUBJECT_META[subjectId] || { tint: 'iliad', illu: 'scroll' };

    // ── Set page-level identity (drives --tint CSS var) ─────────────
    const root = document.getElementById('page-subject');
    if (!root) return;
    root.classList.add('subject-page');
    root.dataset.subject = meta.tint;

    // ── Opener map ───────────────────────────────────────────────────
    const openers = {
      'lyo':              () => openLyo(),
      'paratheta':        () => openParatheta(),
      'blade':            () => { if (typeof openBlade === 'function') openBlade(); },
      'nouns':            () => openOusiastika(),
      'antonymies':       () => openAntonymies(),
      'klisi-epitheton':  () => { if (typeof openEpitheta      === 'function') openEpitheta();      },
      'pathitiko':        () => openPathitiko(),
      'afwnolekta':       () => openAfwnolekta(),
      'aoristos-b':       () => openAoristosB(),
      'rimata-mi':        () => openRimataMi(),
      'synirimmena':      () => openSynirimmena(),
      'anwmala-rimata':   () => openAnwmalaRimata(),
      'klisi-rimaton':    () => openKlisiRimaton(),
      'eimi':             () => openEimi(),
      'iliada-arcade':    () => openIliadaArcade(),
      'temple-run':       () => openTempleRun(
        typeof buildTempleRunConfig === 'function' ? buildTempleRunConfig(subjectId) : {}
      ),
      'iliada-tow':       () => openTow(),
      'noun-tow':         () => openNounTow(),
      'noun-fill':        () => openNounFill(),
      'odyssey-journey':  () => openOdysseyJourney(),
      'odyssey-trivia':   () => launchOdysseyTrivia(lang()),
      'istoria-g3':       () => openIstoria(),
      'history-game':     () => openHistoryGame(),
      'grammar-invaders': () => openInvaders(),
      'myth-memory':      () => { if (typeof openMythMemory    === 'function') openMythMemory();    },
      'rapid-fire':       () => { if (typeof openRapidFire     === 'function') openRapidFire();     },
      'epic-puzzle':      () => { if (typeof openEpicPuzzle    === 'function') openEpicPuzzle(subjectId); },
      'lat-kata':         () => { if (typeof openLatKata       === 'function') openLatKata();       },
      'lat-nouns-kata':   () => { if (typeof openLatNounsKata  === 'function') openLatNounsKata();  },
      'lat-nouns':        () => { if (typeof openLatNouns      === 'function') openLatNouns();      },
      'lat-verbs':        () => { if (typeof openLatVerbs      === 'function') openLatVerbs();      },
      'lat-anwmala':      () => { if (typeof openLatAnwmala    === 'function') openLatAnwmala();    },
      'lat-anwmala-theory': () => { if (typeof openLatAnwmalaTheory === 'function') openLatAnwmalaTheory(); },
      'lat-epitheta':     () => { if (typeof openLatEpitheta   === 'function') openLatEpitheta();   },
      'lat-epitheta-kata':() => { if (typeof openLatEpithetaKata === 'function') openLatEpithetaKata(); },
      'lat-antonymies':   () => { if (typeof openLatAntonymies === 'function') openLatAntonymies(); },
      'lat-antonymies-theory': () => { if (typeof openLatAntonymiesTheory === 'function') openLatAntonymiesTheory(); },
      'lat-nouns-kata-theory': () => { if (typeof openLatNounsKataTheory === 'function') openLatNounsKataTheory(); },
      'lat-epitheta-kata-theory': () => { if (typeof openLatEpithetaKataTheory === 'function') openLatEpithetaKataTheory(); },
      'labyrinth':        () => { if (typeof openLabyrinth     === 'function') openLabyrinth();     },
      'phalanx':          () => { if (typeof openPhalanx       === 'function') openPhalanx();       },
      'naumachia':        () => { if (typeof openNaumachia     === 'function') openNaumachia();     },
      'dig':              () => { if (typeof openDig           === 'function') openDig();           },
    };

    // ── Collect all tiles ────────────────────────────────────────────
    const allTiles = [];

    // Featured game
    if (subject.featuredGame) {
      const ft = subject.featuredGame;
      const fm = FEAT_META[ft.type];
      const ftLabel = fm
        ? (isEn ? fm.en : fm.gr)
        : (isEn ? (ft.en?.label || ft.label || ft.type) : (ft.label || ft.type));
      const ftDesc = fm
        ? fm.meta
        : (isEn ? (ft.en?.desc || ft.desc || '') : (ft.desc || ''));
      allTiles.push({
        type: ft.type,
        label: ftLabel,
        enLabel: isEn ? null : (ft.en?.label || ''),
        desc: ftDesc,
        opener: openers[ft.type] || (() => navToSubject(gradeKey, subjectId)),
      });
    }

    // Mnemosyne study tiles (unshifted to front)
    {
      const studyTypeMap = {
        'eimi': 'eimi', 'lyo': 'lyo', 'afwnolekta': 'afwnolekta',
        'aoristos-b': 'aoristos-b', 'rimata-mi': 'rimata-mi',
        'synirimmena': 'synirimmena', 'anwmala-rimata': 'anwmala-rimata',
        'klisi-rimaton': 'klisi-rimaton', 'nouns': 'ousiastika', 'antonymies': 'antonymies',
        // Latin grammar — study tiles for gram-lat subjects
        'lat-nouns': 'lat-nouns', 'lat-verbs': 'lat-verbs',
        'lat-epitheta': 'lat-epitheta', 'lat-antonymies': 'lat-antonymies',
      };
      const studySubjectMap = { 'iliada': 'iliada-trivia', 'odysseia': 'odyssey-trivia' };
      const seenStudy = new Set();
      const addStudy = dsId => {
        if (!dsId || seenStudy.has(dsId)) return;
        const ds = (typeof GP_DATASETS !== 'undefined')
          ? GP_DATASETS.find(d => d.id === dsId) : null;
        if (!ds) return;
        seenStudy.add(dsId);
        allTiles.unshift({
          type: 'study',
          dsId: dsId,
          label: ds.label,
          enLabel: ds.label,
          desc: isEn
            ? 'Mnemosyne · Flashcards · Spaced repetition'
            : 'Μνημοσύνη · Κάρτες μελέτης · Spaced repetition',
          opener: () => { if (typeof navToStudy === 'function') navToStudy(dsId); },
        });
      };
      if (subject.extraGames) subject.extraGames.forEach(eg => addStudy(studyTypeMap[eg.type]));
      if (subject.featuredGame) addStudy(studyTypeMap[subject.featuredGame.type]);
      addStudy(studySubjectMap[subjectId]);
    }

    // Extra games
    if (subject.extraGames) {
      subject.extraGames.forEach(eg => {
        const egLabel = isEn ? (eg.en?.label || eg.label) : eg.label;
        const egDesc  = isEn ? (eg.en?.desc  || eg.desc)  : eg.desc;
        allTiles.push({
          type: eg.type,
          label: egLabel,
          enLabel: isEn ? null : (eg.en?.label || ''),
          desc: egDesc || '',
          opener: openers[eg.type] || (() => {}),
        });
      });
    }

    // DEFAULT_GAMES (trivia, etc.)
    if (typeof DEFAULT_GAMES !== 'undefined') {
      DEFAULT_GAMES.forEach(gm => {
        if (gm.isTrivia && subjectId !== 'iliada') return;
        const gmLabel  = isEn ? (gm.titleEn || gm.title) : gm.title;
        const gmDesc   = isEn ? (gm.descEn  || gm.desc)  : gm.desc;
        const gmOpener = gm.isTrivia
          ? () => launchGame('gr')
          : (openers[gm.type] || (() => {}));
        allTiles.push({
          type: gm.type || 'trivia',
          label: gmLabel,
          enLabel: isEn ? null : (gm.titleEn || ''),
          desc: gmDesc || '',
          opener: gmOpener,
        });
      });
    }

    // Deduplicate: keep the FIRST occurrence of each tile type (featured game wins over extras)
    // Study tiles are keyed by dsId so multiple distinct study decks can coexist.
    {
      const seenTypes = new Set();
      for (let i = 0; i < allTiles.length; i++) {
        const t = allTiles[i];
        const key = t.type === 'study' ? ('study:' + (t.dsId || i)) : t.type;
        if (seenTypes.has(key)) {
          allTiles.splice(i, 1);
          i--; // re-check current index after splice
        } else {
          seenTypes.add(key);
        }
      }
    }

    // Sort favorites to front
    if (typeof getFavorites === 'function') {
      const fIds = getFavorites();
      allTiles.sort((a, b) =>
        (fIds.includes(a.type) ? 0 : 1) - (fIds.includes(b.type) ? 0 : 1)
      );
    }

    // ── Classify tiles by interaction mode ──────────────────────────
    const _tileMode  = t => TYPE_MODE[t.type] || 'solo';
    const taggedTiles  = allTiles.map((t, i) => ({ ...t, _idx: i }));
    const soloTiles    = taggedTiles.filter(t => _tileMode(t) === 'solo');
    const multiTiles   = taggedTiles.filter(t => _tileMode(t) === 'multi');
    const theoryTiles  = taggedTiles.filter(t => _tileMode(t) === 'theory');

    const hasSolo   = soloTiles.length > 0;
    const hasMulti  = multiTiles.length > 0;
    const hasTheory = theoryTiles.length > 0;
    const zoneCount = (hasSolo ? 1 : 0) + (hasMulti ? 1 : 0) + (hasTheory ? 1 : 0);
    const showTabs  = zoneCount > 1;
    const defZone   = hasSolo ? 'solo' : (hasMulti ? 'multi' : 'theory');

    // ── Unified tile builder — honours SX_LAYOUT density ───────────
    // variant: 'card' (compact) | 'list' (dense row) | 'banner' (featured)
    // showMode: render a small mode dot (used by grid / chips=All)
    const buildSxTileHTML = (tile, variant, showMode) => {
      const mode = _tileMode(tile);
      const ds   = (typeof GP_DATASETS !== 'undefined')
        ? GP_DATASETS.find(d => d.id === tile.dsId || d.id === tile.type) : null;
      const tier  = ds?.tier || 'free';
      const ok    = (typeof _gpCanAccessTier === 'function') ? _gpCanAccessTier(tier) : true;
      const illu  = TYPE_ILLU[tile.type] || 'column';
      const tag   = TYPE_TAG[tile.type]
        || (mode === 'multi' ? 'Multiplayer' : mode === 'theory' ? 'Study' : 'Game');

      const proBadge    = (tier !== 'free') ? `<span class="sx-tile-pro">Pro</span>` : '';
      const lockedCls   = (!ok) ? ' sx-tile--locked' : '';
      const lockOverlay = (!ok) ? `<div class="sx-tile-lock">🔒</div>` : '';

      const ctaWord = mode === 'theory'
        ? (tile.type === 'study'
            ? (isEn ? 'STUDY'    : 'ΜΕΛΕΤΗ')
            : (isEn ? 'PRACTICE' : 'ΕΞΑΣΚΗΣΗ'))
        : (isEn ? 'PLAY' : 'ΠΑΙΞΕ');

      const isFav = (typeof isFavorite === 'function' && isFavorite(tile.type)) ? 1 : 0;
      const fav   = (typeof window.SX !== 'undefined') ? window.SX.favBtn(tile.type) : '';
      const dot   = (showMode && typeof window.SX !== 'undefined') ? window.SX.modeDot(mode) : '';
      const glyph = `<div class="glyph" data-illu="${illu}"></div>`;
      const attrs = `role="button" tabindex="0" data-tile-idx="${tile._idx}" `
        + `data-tier="${tier}" data-mode="${mode}" data-fav="${isFav}" `
        + `aria-label="${tile.label}" `
        + `onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"`;

      if (variant === 'list') {
        return `
        <div class="sx-tile sx-tile--row${lockedCls}" ${attrs}>
          <span class="sx-row-chip">${glyph}</span>
          ${proBadge}
          <div class="sx-row-main">
            <div class="sx-row-top">
              <h3>${tile.label}</h3>
              <span class="sx-tile-tag">${tag}</span>${dot}
            </div>
            ${tile.desc ? `<p class="sx-row-desc">${tile.desc}</p>` : ''}
          </div>
          ${fav}
          <span class="sx-row-play">→</span>
          ${lockOverlay}
        </div>`;
      }

      if (variant === 'banner') {
        return `
        <div class="sx-tile sx-tile--feat${lockedCls}" ${attrs}>
          ${fav}
          <div class="sx-tile-banner">
            <span class="tag">${tag}</span>
            ${proBadge}
            ${glyph}
          </div>
          ${lockOverlay}
          <div class="sx-tile-body">
            <h3>${tile.label}</h3>
            ${tile.enLabel ? `<p class="latin">${tile.enLabel}</p>` : ''}
            ${tile.desc ? `<p class="desc">${tile.desc}</p>` : ''}
          </div>
          <div class="sx-tile-cta">
            <span>${ctaWord}</span><span class="arrow">→</span>
          </div>
        </div>`;
      }

      // default: compact card
      return `
      <div class="sx-tile sx-tile--compact${lockedCls}" ${attrs}>
        ${fav}
        <div class="sx-tile-head">
          <span class="sx-glyph-chip">${glyph}</span>
          <div class="sx-head-tt">
            <h3>${tile.label}</h3>
            <div class="sx-tagrow"><span class="sx-tile-tag">${tag}</span>${dot}</div>
          </div>
        </div>
        ${tile.desc ? `<p class="sx-desc">${tile.desc}</p>` : ''}
        <div class="sx-tile-cta">
          <span>${ctaWord}</span><span class="arrow">→</span>
        </div>
        ${lockOverlay}
      </div>`;
    };

    // Render a set of tiles honouring the active density preference.
    const renderTileList = (list, showMode) => {
      if (!list.length) return '';
      const d = (window.SX_LAYOUT ? window.SX_LAYOUT.get().density : 'card');
      if (d === 'list') {
        return `<div class="sx-rows">${list.map(t => buildSxTileHTML(t, 'list', showMode)).join('')}</div>`;
      }
      if (d === 'featured') {
        const feat = list.slice(0, 3), rest = list.slice(3);
        let h = `<div class="sx-tiles sx-tiles--feat">${feat.map(t => buildSxTileHTML(t, 'banner', showMode)).join('')}</div>`;
        if (rest.length) h += `<div class="sx-rows">${rest.map(t => buildSxTileHTML(t, 'list', showMode)).join('')}</div>`;
        return h;
      }
      return `<div class="sx-tiles sx-tiles--card">${list.map(t => buildSxTileHTML(t, 'card', showMode)).join('')}</div>`;
    };

    // ── Layout switcher control (compact "⋯ Διάταξη" popover) ───────
    const buildSwitcher = () => {
      const p = window.SX_LAYOUT ? window.SX_LAYOUT.get() : { density: 'card', grouping: 'chips', favorites: 'heart' };
      const seg = (prop, opts) =>
        `<div class="sx-seg" data-sx-prop="${prop}">${opts.map(o =>
          `<button type="button" data-v="${o.v}" class="${p[prop] === o.v ? 'on' : ''}">${o.l}</button>`).join('')}</div>`;
      const L = isEn
        ? { title:'Layout', density:'Density', grouping:'Grouping', favorites:'Favourites',
            card:'Cards', list:'List', featured:'Featured', grid:'Grid', sections:'Sections', chips:'Filters',
            heart:'On cards', strip:'Pinned row', chip:'Filter chip' }
        : { title:'Διάταξη', density:'Πυκνότητα', grouping:'Οργάνωση', favorites:'Αγαπημένα',
            card:'Κάρτες', list:'Λίστα', featured:'Βιτρίνα', grid:'Πλέγμα', sections:'Ενότητες', chips:'Φίλτρα',
            heart:'Στις κάρτες', strip:'Σειρά', chip:'Φίλτρο' };
      return `
      <div class="sx-layout-ctl">
        <button class="sx-layout-btn" data-sx-ctl-toggle type="button" aria-expanded="false" aria-haspopup="true">
          <span class="dots">⋯</span><span>${L.title}</span>
        </button>
        <div class="sx-layout-menu" hidden>
          <div class="sx-layout-group"><span class="sx-layout-grouplabel">${L.density}</span>${seg('density', [{v:'card',l:L.card},{v:'list',l:L.list},{v:'featured',l:L.featured}])}</div>
          <div class="sx-layout-group"><span class="sx-layout-grouplabel">${L.grouping}</span>${seg('grouping', [{v:'grid',l:L.grid},{v:'sections',l:L.sections},{v:'chips',l:L.chips}])}</div>
          <div class="sx-layout-group"><span class="sx-layout-grouplabel">${L.favorites}</span>${seg('favorites', [{v:'heart',l:L.heart},{v:'strip',l:L.strip},{v:'chip',l:L.chip}])}</div>
        </div>
      </div>`;
    };

    // ── Inject into DOM ──────────────────────────────────────────────
    const contentEl = root.querySelector('.games-content');
    if (!contentEl) return;

    const gamesWord      = isEn ? 'games' : 'παιχνίδια';
    const playAllWord    = isEn ? 'PLAY ALL GAMES' : 'ΟΛΑ ΤΑ ΠΑΙΧΝΙΔΙΑ';
    const subjectWord    = isEn ? 'SUBJECT' : 'ΜΑΘΗΜΑ';
    const gamesCountWord = isEn ? 'Games' : 'Παιχνίδια';
    const shareWord      = isEn ? 'Share with class' : 'Κοινοποίηση στην τάξη';
    const shareQrCall    = `if(typeof showQR==='function')showQR('${subjectTitle}',{nav:'subject',grade:'${gradeKey}',subject:'${subjectId}'})`;
    const activitiesWord = isEn ? 'Games & Activities' : 'Παιχνίδια & Δραστηριότητες';
    const multiWord      = isEn ? 'Multiplayer Games' : 'Multiplayer Παιχνίδια';
    const theoryWord     = isEn ? 'Theory & Study'    : 'Θεωρία & Μελέτη';

    contentEl.innerHTML = `
      <section class="sx-hero">
        <div class="sx-hero-main">
          <div class="sx-hero-crumb">
            <span onclick="navToGrade('${gradeKey}')"
                  style="cursor:pointer;color:inherit;transition:color .2s"
                  onmouseover="this.style.color='var(--tint)'"
                  onmouseout="this.style.color='inherit'">
              ${gradeTitle}
            </span>
            <span class="sep">·</span>
            <span class="here">${subjectTitle}</span>
          </div>
          <div class="sx-hero-roman">${subjectWord} · I</div>
          <h1>${subjectTitle}</h1>
          ${enTitle ? `<p class="latin">${enTitle}</p>` : ''}
          <p class="summary">${subjectDesc}</p>
          <div class="sx-hero-stats">
            <div class="sx-hero-stat">
              <div class="n">${allTiles.length}</div>
              <div class="l">${gamesCountWord}</div>
            </div>
            <button class="sx-qr-btn" onclick="${shareQrCall}" title="${shareWord}" aria-label="${shareWord}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="3" height="3" rx=".5"/>
                <rect x="19" y="14" width="2" height="2" rx=".5"/><rect x="14" y="19" width="2" height="2" rx=".5"/>
                <rect x="17" y="17" width="3" height="3" rx=".5"/>
              </svg>
              <span>${shareWord}</span>
            </button>
          </div>
        </div>
        <div class="sx-hero-orn">
          <span class="tag">${enTitle || subjectTitle}</span>
          <div class="glyph-fg" data-illu="${meta.illu}"></div>
          <div class="glyph"    data-illu="${meta.illu}"></div>
          ${allTiles.length > 0 ? `
          <button class="play-all" data-sx-play-all>
            <span>${playAllWord}</span><span>→</span>
          </button>` : ''}
        </div>
      </section>

      ${allTiles.length > 0 ? `<div class="sx-toolbar">${buildSwitcher()}</div>` : ''}
      <div id="sx-subject-body" class="sx-subject-body"></div>
      ${allTiles.length === 0 ? `
      <div class="sx-empty-state">
        <div class="sx-empty-inner">
          <div class="sx-empty-icon">🏗️</div>
          <div class="sx-empty-title">${isEn ? 'Coming Soon' : 'Έρχεται Σύντομα'}</div>
          <div class="sx-empty-sub">${isEn
            ? 'Activities for this subject are being prepared. Check back soon!'
            : 'Οι δραστηριότητες για αυτό το μάθημα είναι υπό κατασκευή. Ελέγξτε ξανά σύντομα!'}</div>
        </div>
      </div>` : ''}`;

    // ── Re-insert hidden #games-grid so nav.js never gets null ──────
    let gGrid = document.getElementById('games-grid');
    if (!gGrid) {
      gGrid = document.createElement('div');
      gGrid.id = 'games-grid';
      contentEl.appendChild(gGrid);
    }
    gGrid.style.display = 'none';
    gGrid.innerHTML = '';

    // ── Render hero glyphs once ──────────────────────────────────────
    if (typeof window._injectIllus === 'function') window._injectIllus(contentEl);

    // ── Body painter — re-runs on layout / favourite changes ─────────
    const bodyEl = document.getElementById('sx-subject-body');
    const _isFav = t => (typeof isFavorite === 'function' && isFavorite(t.type));
    let chipFilter = (window.SX_LAYOUT && window.SX_LAYOUT.get().favorites === 'chip') ? 'fav' : 'all';

    const wireTiles = scope => {
      scope.querySelectorAll('.sx-tile[data-tile-idx]').forEach(el => {
        const tile   = allTiles[parseInt(el.dataset.tileIdx)];
        const locked = el.classList.contains('sx-tile--locked');
        el.onclick = locked
          ? () => { if (typeof openAuthModal === 'function') openAuthModal('signup'); }
          : (tile?.opener || null);
      });
    };

    const paintBody = () => {
      if (!bodyEl) return;
      const p = window.SX_LAYOUT ? window.SX_LAYOUT.get() : { grouping: 'chips', favorites: 'heart' };
      const grouping = (p.favorites === 'chip') ? 'chips' : p.grouping;
      const heart = (typeof window.SX !== 'undefined') ? window.SX.heartSVG : '';
      let html = '';

      // Pinned favourites strip (skipped when chips already expose a ♥ filter)
      if (p.favorites === 'strip' && grouping !== 'chips') {
        const favTiles = taggedTiles.filter(_isFav);
        if (favTiles.length) {
          html += `<div class="sx-fav-strip">
            <div class="sx-fav-strip-head">${heart}<h4>${isEn ? 'Your favourites' : 'Τα αγαπημένα σου'}</h4>
            <span class="c">${favTiles.length}</span></div>${renderTileList(favTiles, false)}</div>`;
        }
      }

      if (grouping === 'sections') {
        const zones = [
          ['solo',   soloTiles,   '⚔️', 'Solo'],
          ['multi',  multiTiles,  '🏆', 'Multiplayer'],
          ['theory', theoryTiles, '📚', isEn ? 'Theory' : 'Θεωρία'],
        ];
        zones.forEach(([z, list, icon, label]) => {
          if (!list.length) return;
          html += `<div class="sx-zone-head sx-zone-head--${z}"><span class="zi">${icon}</span>
            <h4>${label}</h4><span class="c">${list.length}</span></div>${renderTileList(list, false)}`;
        });
      } else if (grouping === 'chips') {
        const counts = {
          all: taggedTiles.length, solo: soloTiles.length, multi: multiTiles.length,
          theory: theoryTiles.length, fav: taggedTiles.filter(_isFav).length,
        };
        const chip = (id, label, cls) =>
          `<button type="button" class="sx-chip${cls || ''}${chipFilter === id ? ' on' : ''}" data-chip="${id}">${label} <span class="n">${counts[id]}</span></button>`;
        let bar = `<div class="sx-chips">`;
        bar += chip('all', isEn ? 'All' : 'Όλα');
        if (soloTiles.length)   bar += chip('solo',   'Solo');
        if (multiTiles.length)  bar += chip('multi',  'Multiplayer');
        if (theoryTiles.length) bar += chip('theory', isEn ? 'Theory' : 'Θεωρία');
        bar += chip('fav', heart, ' sx-chip--fav');
        bar += `</div>`;

        const shown = chipFilter === 'all' ? taggedTiles
          : chipFilter === 'fav' ? taggedTiles.filter(_isFav)
          : taggedTiles.filter(t => _tileMode(t) === chipFilter);
        html += bar + (shown.length
          ? renderTileList(shown, chipFilter === 'all')
          : `<div class="sx-empty-row">${isEn ? 'Nothing here yet.' : 'Κανένα παιχνίδι εδώ ακόμη.'}</div>`);
      } else {
        // grid — one set, mode dot per tile
        html += renderTileList(taggedTiles, true);
      }

      bodyEl.innerHTML = html;
      if (typeof window._injectIllus === 'function') window._injectIllus(bodyEl);
      wireTiles(bodyEl);

      bodyEl.querySelectorAll('.sx-chip[data-chip]').forEach(c => {
        c.onclick = () => { chipFilter = c.dataset.chip; paintBody(); };
      });
      // Favourite toggles that change which tiles are shown need a repaint
      bodyEl.querySelectorAll('.sx-fav').forEach(b => {
        b.addEventListener('click', () => {
          const pp = window.SX_LAYOUT ? window.SX_LAYOUT.get() : {};
          if (pp.favorites === 'strip' || chipFilter === 'fav') setTimeout(paintBody, 0);
        });
      });
    };

    paintBody();

    // Play-all hero button → first playable tile (prefer solo)
    const playAllBtn = contentEl.querySelector('[data-sx-play-all]');
    const firstTile  = soloTiles[0] || multiTiles[0] || theoryTiles[0];
    if (playAllBtn && firstTile) {
      playAllBtn.onclick = allTiles[firstTile._idx]?.opener || firstTile.opener;
    }

    // Layout switcher popover
    const ctl = contentEl.querySelector('.sx-layout-ctl');
    if (ctl) {
      const toggle = ctl.querySelector('[data-sx-ctl-toggle]');
      const menu   = ctl.querySelector('.sx-layout-menu');
      toggle.onclick = e => {
        e.stopPropagation();
        if (menu.hasAttribute('hidden')) {
          menu.removeAttribute('hidden');
          toggle.setAttribute('aria-expanded', 'true');
          setTimeout(() => document.addEventListener('click', function close(ev) {
            if (!ctl.contains(ev.target)) {
              menu.setAttribute('hidden', '');
              toggle.setAttribute('aria-expanded', 'false');
              document.removeEventListener('click', close);
            }
          }), 0);
        } else {
          menu.setAttribute('hidden', '');
          toggle.setAttribute('aria-expanded', 'false');
        }
      };
      ctl.querySelectorAll('.sx-seg [data-v]').forEach(btn => {
        btn.onclick = () => {
          const prop = btn.closest('[data-sx-prop]').dataset.sxProp;
          if (window.SX_LAYOUT) window.SX_LAYOUT.set({ [prop]: btn.dataset.v });
        };
      });
    }

    // React to layout / favourite-mode changes (single live handler)
    if (window._sxLayoutHandler) document.removeEventListener('sx-layout-change', window._sxLayoutHandler);
    window._sxLayoutHandler = () => {
      const pp = window.SX_LAYOUT ? window.SX_LAYOUT.get() : {};
      if (pp.favorites === 'chip') chipFilter = 'fav';
      contentEl.querySelectorAll('.sx-seg [data-v]').forEach(b => {
        const prop = b.closest('[data-sx-prop]').dataset.sxProp;
        b.classList.toggle('on', pp[prop] === b.dataset.v);
      });
      paintBody();
    };
    document.addEventListener('sx-layout-change', window._sxLayoutHandler);

    // Hero layout (two-column on wide screens)
    const heroGrid = contentEl.querySelector('.sx-hero');
    if (heroGrid) {
      const w = heroGrid.offsetWidth || 716;
      heroGrid.style.gridTemplateColumns = w >= 620 ? '1fr 320px' : '1fr';
    }
  }

  /* ─────────────────────────────────────────────────────────────────
     12. Monkey-patch navToSubject
         The original builds the old .g-card grid and calls goTo().
         We let it run (state, nav, goTo) then replace content with
         the new sx-tile layout.
     ───────────────────────────────────────────────────────────────── */
  const _origNavToSubject = window.navToSubject;
  window.navToSubject = function (gradeKey, subjectId) {
    _origNavToSubject(gradeKey, subjectId); // ← state / nav / goTo
    renderSubjectPage(gradeKey, subjectId); // ← sx-tile overlay
  };

  /* Expose maps globally so external code can reference them */
  window.SUBJECT_META    = SUBJECT_META;
  window.TYPE_ILLU       = TYPE_ILLU;
  window.TYPE_TAG        = TYPE_TAG;
  window.TYPE_MODE       = TYPE_MODE;
  window.TYPE_THEORY_ICON = TYPE_THEORY_ICON;

  /* ─────────────────────────────────────────────────────────────────
     Subject-page tab switcher — called by onclick in the tab bar
     injected by renderSubjectPage.
     ───────────────────────────────────────────────────────────────── */
  window.switchSubjectTab = function (zone) {
    ['solo', 'multi', 'theory'].forEach(z => {
      const btn = document.getElementById('sx-tab-btn-' + z);
      const zEl = document.getElementById('sx-zone-' + z);
      const active = (z === zone);
      if (btn) {
        btn.classList.toggle('home-tab--active', active);
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      }
      if (zEl) {
        zEl.classList.toggle('home-zone--active', active);
        zEl.setAttribute('aria-hidden', active ? 'false' : 'true');
      }
    });
  };

  /* ─────────────────────────────────────────────────────────────────
     13. Browse page — illustration + tag maps
     ───────────────────────────────────────────────────────────────── */
  const BROWSE_ILLU = {
    root:        'acropolis',
    dimotiko:    'owl',
    gymnasio:    'acropolis',
    lykeio:      'scroll',
    grammatiki:  'column',
    'gym-a':     'trireme',
    'gym-b':     'shield-spear',
    'gym-c':     'theatre',
    'lyk-a':     'lyre',
    'lyk-b':     'walls',
    'lyk-c':     'scroll',
    'gram-nea':  'owl',
    'gram-arch': 'column',
    'gram-lat':  'walls',
  };

  const BROWSE_TAG = {
    dimotiko:    'Δημοτικό',
    gymnasio:    'Βαθμίδα',
    lykeio:      'Βαθμίδα',
    grammatiki:  'Κατηγορία',
    'gym-a':     'Α΄ Γυμνασίου',
    'gym-b':     'Β΄ Γυμνασίου',
    'gym-c':     'Γ΄ Γυμνασίου',
    'lyk-a':     'Α΄ Λυκείου',
    'lyk-b':     'Β΄ Λυκείου',
    'lyk-c':     'Γ΄ Λυκείου',
    'gram-nea':  'Νέα Ελληνικά',
    'gram-arch': 'Αρχαία',
    'gram-lat':  'Λατινικά',
  };

  /* ─────────────────────────────────────────────────────────────────
     14. Games Panel — engine illustration map
     ───────────────────────────────────────────────────────────────── */
  const ENGINE_ILLU = {
    'naumachia':   'trident',
    'invaders':    'invader',
    'labyrinth':   'labyrinth',
    'myth-memory': 'cards',
    'phalanx':     'shield-round',
    'rapid-fire':  'lightning',
    'tow':         'rope',
    'epic-puzzle': 'timeline',
    'dig':         'shovel',
    'mnemosyne':   'tablet',
    'blade':       'sword',
  };

  /* Shared roman numeral array for browse + engine grids */
  const ROMAN_BX = ['i','ii','iii','iv','v','vi','vii','viii','ix','x'];

  /* ─────────────────────────────────────────────────────────────────
     15. renderBrowseSx — rebuilds #page-browse with sx-* design
     ───────────────────────────────────────────────────────────────── */
  function renderBrowseSx() {
    const root = document.getElementById('page-browse');
    if (!root) return;
    root.classList.add('browse-sx');

    const lvl    = (typeof browseLevel !== 'undefined') ? browseLevel : 'root';
    const isRoot = lvl === 'root';
    const isEn   = lang() === 'en';
    const items  = (typeof BROWSE_SECTIONS !== 'undefined')
      ? (BROWSE_SECTIONS[lvl] || BROWSE_SECTIONS.root) : [];

    // Drive --tint via data attr (matched by CSS)
    root.dataset.browse = lvl;

    // Hero title / sub per browse level
    const HERO_TITLES = {
      root:       isEn ? 'All Levels'    : 'SymposiON',
      gymnasio:   isEn ? 'Middle School' : 'Γυμνάσιο',
      lykeio:     isEn ? 'High School'   : 'Λύκειο',
      grammatiki: isEn ? 'Grammar'       : 'Γραμματική',
    };
    const HERO_SUBS = {
      root:       isEn ? 'Choose a level to start.' : 'Επίλεξε βαθμίδα για να ξεκινήσεις.',
      gymnasio:   isEn ? 'Choose your grade.'       : 'Επίλεξε τάξη.',
      lykeio:     isEn ? 'Choose your grade.'       : 'Επίλεξε τάξη.',
      grammatiki: isEn ? 'Choose a category.'       : 'Επίλεξε κατηγορία.',
    };
    const heroTitle = HERO_TITLES[lvl] || lvl;
    const heroSub   = HERO_SUBS[lvl]   || '';
    const heroIllu  = BROWSE_ILLU[lvl] || 'acropolis';
    const heroRoman = isEn ? 'OVERVIEW · I' : 'ΕΠΙΣΚΟΠΗΣΗ · I';
    const availCount = items.filter(it => !it.disabled).length;

    // Inject / update hero container before the grid
    const browseBody = root.querySelector('.browse-body');
    const gridEl     = document.getElementById('browse-grid');
    if (browseBody && gridEl) {
      let heroEl = browseBody.querySelector('.browse-sx-hero');
      if (!heroEl) {
        heroEl = document.createElement('div');
        heroEl.className = 'browse-sx-hero';
        browseBody.insertBefore(heroEl, gridEl);
      }
      heroEl.innerHTML = `
        <section class="sx-hero bx-hero">
          <div class="sx-hero-main">
            <div class="sx-hero-roman">${heroRoman}</div>
            <h1>${heroTitle}</h1>
            <p class="summary">${heroSub}</p>
            <div class="sx-hero-stats">
              <div class="sx-hero-stat">
                <div class="n">${availCount}</div>
                <div class="l">${isEn ? 'Available' : 'Διαθέσιμα'}</div>
              </div>
            </div>
          </div>
          <div class="sx-hero-orn">
            <span class="tag">SymposiON</span>
            <div class="glyph-fg" data-illu="${heroIllu}"></div>
            <div class="glyph"    data-illu="${heroIllu}"></div>
          </div>
        </section>`;

      // Apply hero grid columns via JS (avoids CSS auto-fill collapse)
      const heroGrid = heroEl.querySelector('.sx-hero');
      if (heroGrid) {
        const w = heroGrid.offsetWidth || 800;
        heroGrid.style.gridTemplateColumns = w >= 620 ? '1fr 320px' : '1fr';
      }
      if (typeof window._injectIllus === 'function') window._injectIllus(heroEl);
    }

    // Rebuild browse-grid tiles
    const grid = document.getElementById('browse-grid');
    if (!grid) return;

    grid.innerHTML = items.map((item, i) => {
      const rN      = ROMAN_BX[i] || String(i + 1);
      const label   = isEn ? (item.labelEn || item.label) : item.label;
      const desc    = isEn ? (item.descEn  || item.desc)  : item.desc;
      const dis     = !!item.disabled;
      const illu    = BROWSE_ILLU[item.key] || 'scroll';
      const tag     = dis
        ? (isEn ? 'Soon' : 'Σύντομα')
        : (BROWSE_TAG[item.key] || (isEn ? 'Level' : 'Βαθμίδα'));

      return `
        <div class="sx-tile bx-tile${dis ? ' bx-disabled' : ''}" data-bx-key="${item.key}">
          <div class="sx-tile-banner">
            <span class="num">${rN}</span>
            <span class="tag">${tag}</span>
            <div class="glyph" data-illu="${illu}"></div>
          </div>
          <div class="sx-tile-body">
            <h3>${label}</h3>
            <p class="desc">${desc}</p>
          </div>
          ${dis ? '' : `
          <div class="sx-tile-cta">
            <span>${isEn ? 'Explore' : 'Εξερεύνησε'}</span>
            <span class="arrow">→</span>
          </div>`}
        </div>`;
    }).join('');

    // Wire click handlers — use data-bx-key to avoid off-by-one when
    // disabled tiles are excluded from the querySelectorAll result
    grid.querySelectorAll('.bx-tile:not(.bx-disabled)').forEach(el => {
      const key  = el.dataset.bxKey;
      const item = items.find(it => it.key === key);
      if (!item || item.disabled) return;
      el.onclick = () => {
        if (typeof GRADES !== 'undefined' && GRADES[item.key]) {
          navToGrade(item.key);
        } else if (typeof browseTo === 'function') {
          browseTo(item.key);
        }
      };
      el.style.cursor = 'pointer';
    });

    // Apply grid columns via JS (honour SX_LAYOUT density)
    const dens = (window.SX_LAYOUT ? window.SX_LAYOUT.get().density : 'card');
    grid.dataset.sxDensity = (dens === 'list') ? 'list' : 'card';
    const w = grid.offsetWidth || 800;
    grid.style.gridTemplateColumns = (dens === 'list') ? '1fr' :
      w >= 900 ? 'repeat(3, 1fr)' :
      w >= 540 ? 'repeat(2, 1fr)' : '1fr';

    if (typeof window._injectIllus === 'function') window._injectIllus(grid);
  }

  /* ─────────────────────────────────────────────────────────────────
     16. Monkey-patch renderBrowse
     ───────────────────────────────────────────────────────────────── */
  const _origRenderBrowse = window.renderBrowse;
  window.renderBrowse = function () {
    _origRenderBrowse();   // updates title/subtitle/back-btn/nav
    renderBrowseSx();      // injects hero + sx-tiles
  };

  /* ─────────────────────────────────────────────────────────────────
     17. renderMechanicsGridSx — rebuilds mechanics-grid with sx-tiles
     ───────────────────────────────────────────────────────────────── */
  // ── Engine play-mode config (admin-overridable via config/game-modes) ──
  // Each engine can support Solo and/or Multiplayer. The default preserves the
  // legacy single `multiplayer` flag; admins can mark engines as BOTH in the
  // admin panel (writes config/game-modes → window.GAME_MODES).
  window.GAME_MODES = window.GAME_MODES || {};
  window.getEngineModes = window.getEngineModes || function (eng) {
    const m = eng && window.GAME_MODES[eng.id];
    return m ? { solo: !!m.solo, multi: !!m.multi }
             : { solo: !(eng && eng.multiplayer), multi: !!(eng && eng.multiplayer) };
  };
  let _gmLoaded = false;
  function _loadGameModes() {
    if (_gmLoaded) return;
    _gmLoaded = true;
    try {
      if (window.firebase && firebase.firestore) {
        firebase.firestore().collection('config').doc('game-modes').get()
          .then(d => {
            if (d.exists && d.data() && d.data().modes) {
              Object.assign(window.GAME_MODES, d.data().modes);
              if (document.getElementById('mechanics-grid')) renderMechanicsGridSx();
            }
          })
          .catch(() => {});
      }
    } catch (e) {}
  }

  let gpChipFilter = 'all';

  function renderMechanicsGridSx() {
    const grid = document.getElementById('mechanics-grid');
    if (!grid || typeof GP_ENGINES === 'undefined') return;

    const isEn    = lang() === 'en';
    const body    = grid.closest('.gp-body');
    const isFav   = (id) => (typeof isFavorite === 'function' ? isFavorite(id)
                           : (typeof window.isFavorite === 'function' ? window.isFavorite(id) : false));
    const modesOf = (e) => (window.getEngineModes ? window.getEngineModes(e) : { solo: !e.multiplayer, multi: !!e.multiplayer });
    const engMode = (e) => modesOf(e).multi ? 'multi' : 'solo';   // display tag/dot
    _loadGameModes();
    const SXfav   = (id) => (window.SX && window.SX.favBtn  ? window.SX.favBtn(id)  : '');
    const SXdot   = (m)  => (window.SX && window.SX.modeDot ? window.SX.modeDot(m)  : '');
    const heart   = (window.SX && window.SX.heartSVG) ? window.SX.heartSVG : '♥';

    if (body) body.style.setProperty('--tint', 'var(--sym-gold, #C4A448)');

    // ── One engine tile, in the requested density variant (mirrors the
    //    subject page's buildSxTileHTML: compact card / dense row / banner). ──
    const buildEngTile = (eng, variant, showMode) => {
      const mode  = engMode(eng);
      const illu  = ENGINE_ILLU[eng.id] || 'column';
      const tag   = mode === 'multi' ? (isEn ? 'Multiplayer' : 'Πολυπαίκτης') : ((eng.tags && eng.tags[0]) || 'Solo');
      const cta   = isEn ? 'PLAY' : 'ΠΑΙΞΕ';
      const fav   = SXfav(eng.id);
      const dot   = showMode ? SXdot(mode) : '';
      const glyph = `<div class="glyph" data-illu="${illu}"></div>`;
      const attrs = `role="button" tabindex="0" data-eng-id="${eng.id}" data-mode="${mode}" `
        + `style="cursor:pointer" aria-label="${eng.label}" `
        + `onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();this.click();}"`;

      if (variant === 'list') {
        return `
        <div class="sx-tile gp-sx-tile sx-tile--row" ${attrs}>
          <span class="sx-row-chip">${glyph}</span>
          <div class="sx-row-main">
            <div class="sx-row-top"><h3>${eng.label}</h3><span class="sx-tile-tag">${tag}</span>${dot}</div>
            ${eng.desc ? `<p class="sx-row-desc">${eng.desc}</p>` : ''}
          </div>
          ${fav}<span class="sx-row-play">→</span>
        </div>`;
      }
      if (variant === 'banner') {
        return `
        <div class="sx-tile gp-sx-tile sx-tile--feat" ${attrs}>
          ${fav}
          <div class="sx-tile-banner"><span class="tag">${tag}</span>${glyph}</div>
          <div class="sx-tile-body">
            <h3>${eng.label}</h3>
            ${eng.subtitle ? `<p class="latin">${eng.subtitle}</p>` : ''}
            ${eng.desc ? `<p class="desc">${eng.desc}</p>` : ''}
          </div>
          <div class="sx-tile-cta"><span>${cta}</span><span class="arrow">→</span></div>
        </div>`;
      }
      // compact card (default)
      return `
      <div class="sx-tile gp-sx-tile sx-tile--compact" ${attrs}>
        ${fav}
        <div class="sx-tile-head">
          <span class="sx-glyph-chip">${glyph}</span>
          <div class="sx-head-tt"><h3>${eng.label}</h3><div class="sx-tagrow"><span class="sx-tile-tag">${tag}</span>${dot}</div></div>
        </div>
        ${eng.desc ? `<p class="sx-desc">${eng.desc}</p>` : ''}
        <div class="sx-tile-cta"><span>${cta}</span><span class="arrow">→</span></div>
      </div>`;
    };

    // Render a set honouring the active density (card grid / list rows / featured).
    const renderEngList = (list, showMode) => {
      if (!list.length) return '';
      const d = (window.SX_LAYOUT ? window.SX_LAYOUT.get().density : 'card');
      if (d === 'list') return `<div class="sx-rows">${list.map(t => buildEngTile(t, 'list', showMode)).join('')}</div>`;
      if (d === 'featured') {
        const feat = list.slice(0, 3), rest = list.slice(3);
        let h = `<div class="sx-tiles sx-tiles--feat">${feat.map(t => buildEngTile(t, 'banner', showMode)).join('')}</div>`;
        if (rest.length) h += `<div class="sx-rows">${rest.map(t => buildEngTile(t, 'list', showMode)).join('')}</div>`;
        return h;
      }
      return `<div class="sx-tiles sx-tiles--card">${list.map(t => buildEngTile(t, 'card', showMode)).join('')}</div>`;
    };

    const wireEngTiles = () => {
      grid.querySelectorAll('.gp-sx-tile').forEach((el) => {
        const eng = GP_ENGINES.find(e => e.id === el.dataset.engId);
        if (!eng) return;
        // Self-contained engines (e.g. blade) ship their own mode-select screen.
        el.onclick = (eng.selfContained && typeof eng.opener === 'function')
          ? () => { if (typeof closeGamesPanel === 'function') closeGamesPanel(); eng.opener(); }
          : () => openEngineConfigurator(eng.id);
      });
    };

    // ── Body: grouping (grid / sections / chips) + favourites mode ──
    const paintBody = () => {
      const p = window.SX_LAYOUT ? window.SX_LAYOUT.get() : { density: 'card', grouping: 'chips', favorites: 'heart' };
      const all   = GP_ENGINES.slice();
      const solo  = all.filter(e => modesOf(e).solo);
      const multi = all.filter(e => modesOf(e).multi);
      let html = '';

      if (p.favorites === 'strip' && p.grouping !== 'chips') {
        const favT = all.filter(e => isFav(e.id));
        if (favT.length) html += `<div class="sx-fav-strip">
          <div class="sx-fav-strip-head">${heart}<h4>${isEn ? 'Your favourites' : 'Τα αγαπημένα σου'}</h4><span class="c">${favT.length}</span></div>${renderEngList(favT, false)}</div>`;
      }

      if (p.grouping === 'sections') {
        [['solo', solo, '⚔️', 'Solo'], ['multi', multi, '🏆', 'Multiplayer']].forEach(([z, list, icon, label]) => {
          if (!list.length) return;
          html += `<div class="sx-zone-head sx-zone-head--${z}"><span class="zi">${icon}</span><h4>${label}</h4><span class="c">${list.length}</span></div>${renderEngList(list, false)}`;
        });
      } else if (p.grouping === 'chips') {
        const counts = { all: all.length, solo: solo.length, multi: multi.length, fav: all.filter(e => isFav(e.id)).length };
        if (!counts[gpChipFilter]) gpChipFilter = 'all';
        const chip = (id, label, cls) =>
          `<button type="button" class="sx-chip${cls || ''}${gpChipFilter === id ? ' on' : ''}" data-chip="${id}">${label} <span class="n">${counts[id]}</span></button>`;
        let bar = `<div class="sx-chips">` + chip('all', isEn ? 'All' : 'Όλα');
        if (solo.length)  bar += chip('solo',  'Solo');
        if (multi.length) bar += chip('multi', 'Multiplayer');
        bar += chip('fav', heart, ' sx-chip--fav') + `</div>`;
        const shown = gpChipFilter === 'all' ? all
          : gpChipFilter === 'fav'  ? all.filter(e => isFav(e.id))
          : gpChipFilter === 'solo' ? all.filter(e => modesOf(e).solo)
          : all.filter(e => modesOf(e).multi);
        html += bar + (shown.length ? renderEngList(shown, gpChipFilter === 'all')
          : `<div class="sx-empty-row">${isEn ? 'Nothing here yet.' : 'Κανένα παιχνίδι εδώ ακόμη.'}</div>`);
      } else {
        html += renderEngList(all, true);
      }

      grid.style.display = 'block';
      grid.style.gridTemplateColumns = '';
      grid.dataset.sxDensity = p.density;
      grid.innerHTML = html;
      if (typeof window._injectIllus === 'function') window._injectIllus(grid);
      wireEngTiles();

      grid.querySelectorAll('.sx-chip[data-chip]').forEach(c => {
        c.onclick = () => { gpChipFilter = c.dataset.chip; paintBody(); };
      });
      grid.querySelectorAll('.sx-fav').forEach(b => {
        b.addEventListener('click', () => {
          const pp = window.SX_LAYOUT ? window.SX_LAYOUT.get() : {};
          if (pp.favorites === 'strip' || gpChipFilter === 'fav') setTimeout(paintBody, 0);
        });
      });
    };

    // ── Hero + full layout switcher (density / grouping / favourites) ──
    if (body) {
      const oldIntro = body.querySelector('.gp-section-intro');
      if (oldIntro) oldIntro.remove();
      const oldChips = body.querySelector('.gp-hub-chips');   // legacy fixed chip row → now in body
      if (oldChips) oldChips.remove();

      let head = body.querySelector('.gp-hub-head');
      if (!head) {
        head = document.createElement('div');
        head.className = 'gp-hub-head';
        body.insertBefore(head, grid);
      }

      const N = GP_ENGINES.length;
      const p = window.SX_LAYOUT ? window.SX_LAYOUT.get() : { density: 'card', grouping: 'chips', favorites: 'heart' };
      const seg = (prop, opts) =>
        `<div class="sx-seg" data-sx-prop="${prop}">${opts.map(o =>
          `<button type="button" data-v="${o.v}" class="${p[prop] === o.v ? 'on' : ''}">${o.l}</button>`).join('')}</div>`;
      const L = isEn
        ? { title:'Layout', density:'Density', grouping:'Grouping', favorites:'Favourites',
            card:'Cards', list:'List', featured:'Featured', grid:'Grid', sections:'Sections', chips:'Filters',
            hearts:'On cards', strip:'Pinned row', chip:'Filter chip' }
        : { title:'Διάταξη', density:'Πυκνότητα', grouping:'Οργάνωση', favorites:'Αγαπημένα',
            card:'Κάρτες', list:'Λίστα', featured:'Βιτρίνα', grid:'Πλέγμα', sections:'Ενότητες', chips:'Φίλτρα',
            hearts:'Στις κάρτες', strip:'Σειρά', chip:'Φίλτρο' };

      head.innerHTML = `
        <section class="sx-hero">
          <div class="sx-hero-main">
            <div class="sx-hero-roman">${isEn ? 'GAMES' : 'ΠΑΙΧΝΙΔΙΑ'}</div>
            <h1>${isEn ? 'Choose a Mode' : 'Επίλεξε Τρόπο'}</h1>
            <p class="latin">${isEn ? 'Game Modes' : 'Τρόποι Παιχνιδιού'}</p>
            <p class="summary">${isEn
              ? 'Every engine loads any content module — independent of grade or subject.'
              : 'Κάθε κινητήρας φορτώνει οποιαδήποτε ύλη — ανεξάρτητα από βαθμίδα ή μάθημα.'}</p>
            <div class="sx-hero-stats">
              <div class="sx-hero-stat"><div class="n">${N}</div><div class="l">${isEn ? 'Games' : 'Παιχνίδια'}</div></div>
            </div>
          </div>
          <div class="sx-hero-orn">
            <span class="tag">${isEn ? 'Games' : 'Παιχνίδια'}</span>
            <div class="glyph-fg" data-illu="column"></div>
            <div class="glyph"    data-illu="column"></div>
          </div>
        </section>
        <div class="sx-toolbar">
          <div class="sx-layout-ctl">
            <button class="sx-layout-btn" data-sx-ctl-toggle type="button" aria-expanded="false" aria-haspopup="true">
              <span class="dots">⋯</span><span>${L.title}</span>
            </button>
            <div class="sx-layout-menu" hidden>
              <div class="sx-layout-group"><span class="sx-layout-grouplabel">${L.density}</span>${seg('density', [{ v:'card', l:L.card }, { v:'list', l:L.list }, { v:'featured', l:L.featured }])}</div>
              <div class="sx-layout-group"><span class="sx-layout-grouplabel">${L.grouping}</span>${seg('grouping', [{ v:'grid', l:L.grid }, { v:'sections', l:L.sections }, { v:'chips', l:L.chips }])}</div>
              <div class="sx-layout-group"><span class="sx-layout-grouplabel">${L.favorites}</span>${seg('favorites', [{ v:'heart', l:L.hearts }, { v:'strip', l:L.strip }, { v:'chip', l:L.chip }])}</div>
            </div>
          </div>
        </div>`;

      const ctl = head.querySelector('.sx-layout-ctl');
      if (ctl) {
        const toggle = ctl.querySelector('[data-sx-ctl-toggle]');
        const menu   = ctl.querySelector('.sx-layout-menu');
        toggle.onclick = e => {
          e.stopPropagation();
          if (menu.hasAttribute('hidden')) {
            menu.removeAttribute('hidden'); toggle.setAttribute('aria-expanded', 'true');
            setTimeout(() => document.addEventListener('click', function close(ev) {
              if (!ctl.contains(ev.target)) { menu.setAttribute('hidden', ''); toggle.setAttribute('aria-expanded', 'false'); document.removeEventListener('click', close); }
            }), 0);
          } else { menu.setAttribute('hidden', ''); toggle.setAttribute('aria-expanded', 'false'); }
        };
        ctl.querySelectorAll('.sx-seg [data-v]').forEach(btn => {
          btn.onclick = () => { const prop = btn.closest('[data-sx-prop]').dataset.sxProp; if (window.SX_LAYOUT) window.SX_LAYOUT.set({ [prop]: btn.dataset.v }); };
        });
      }
      if (typeof window._injectIllus === 'function') window._injectIllus(head);
    }

    paintBody();

    // Reflect the favourites='chip' shortcut into the chip filter, like the subject page.
    const fp = window.SX_LAYOUT ? window.SX_LAYOUT.get() : {};
    if (fp.favorites === 'chip' && fp.grouping === 'chips' && gpChipFilter !== 'fav') {
      gpChipFilter = 'fav'; paintBody();
    }
  }

  /* ─────────────────────────────────────────────────────────────────
     18. Monkey-patch openGamesPanel
     ───────────────────────────────────────────────────────────────── */
  const _origOpenGamesPanel = window.openGamesPanel;
  window.openGamesPanel = function () {
    _origOpenGamesPanel();     // opens overlay + calls _renderMechanicsGrid
    renderMechanicsGridSx();   // replaces with sx-tile HTML
  };

  /* ─────────────────────────────────────────────────────────────────
     19. Monkey-patch goTo so "Εξερεύνησε παιχνίδια" → goTo('browse')
         also triggers renderBrowseSx (goTo alone does NOT call
         renderBrowse; only browseTo does).
     ───────────────────────────────────────────────────────────────── */
  const _origGoTo = window.goTo;
  window.goTo = function (page) {
    _origGoTo(page);
    if (page === 'browse') renderBrowseSx();
  };

  /* ─────────────────────────────────────────────────────────────────
     20. Fix the initial browse render that happened before this
         script loaded (nav.js calls renderBrowse() at parse time).
     ───────────────────────────────────────────────────────────────── */
  renderBrowseSx();

  /* ─────────────────────────────────────────────────────────────────
     21. Re-skin Browse / Mechanics / Theory grids when the user
         changes the layout density. (renderSubjectPage manages its
         own live handler.) These rebuilds are idempotent.
     ───────────────────────────────────────────────────────────────── */
  document.addEventListener('sx-layout-change', () => {
    try { renderBrowseSx(); } catch (e) {}
    try { if (document.getElementById('mechanics-grid')) renderMechanicsGridSx(); } catch (e) {}
    try { if (typeof window.refreshTheoryDeck === 'function') window.refreshTheoryDeck(); } catch (e) {}
  });

})();
