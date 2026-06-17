/* ============================================================
   gp-engines.js  —  Game-Panel ENGINE registry  (window.GP_ENGINES)
   ------------------------------------------------------------
   SINGLE source of truth for the Game-Panel "engine" games/modes that
   admins toggle on/off site-wide and tier-gate from the admin Command
   Center (Games → Engines, Subscriptions → Lock & Unlock, Tier Control,
   Class Plan, Engine↔Content matrix).

   This array was the original `const GP_ENGINES = […]` that lived in the
   pre-merge symposion-revamped/js/nav.js. It is ported here 1:1 (label /
   subtitle / icon / tags / tier / allowedCategories / multiplayer kept
   byte-identical), restricted to the engine games that actually ship in
   the merged synthesis app (synthesis/games/*), and EXTENDED with the
   PvP-pack engines that were integrated afterwards (krypteia, hegemonia,
   toxotes, agora, discus).

   Loaded EAGERLY (right after js/gp-content.js) so it is defined before
   admin.js / admin-cc.js / admin-studio.js / shared-engine.js read it.
   Exposed BOTH as a top-level `GP_ENGINES` lexical global (so the
   `typeof GP_ENGINES !== 'undefined'` checks in admin.js / admin-cc.js
   pass) AND on `window.GP_ENGINES` (the admin-studio fallback).

   An engine object:
     { id, label, subtitle?, icon, bg?, desc?, tags[], multiplayer?,
       maxPlayers?, tier:'free'|'student'|'teacher',
       allowedCategories?:[…], type:'practice'|'theory' }
   ============================================================ */
(function () {
  'use strict';

  var GP_ENGINES = [
    {
      id: 'naumachia',
      label: 'Ναυμαχία',
      subtitle: 'Naval Battleship',
      icon: '⚓',
      bg: 'linear-gradient(135deg,#030D1C,#083050)',
      desc: 'Ναυτική σύγκρουση — βύθισε τον στόλο του αντιπάλου απαντώντας σωστά.',
      tags: ['Στρατηγική', 'PvP'],
      multiplayer: true,
      maxPlayers: 2,
      tier: 'free'
    },
    {
      id: 'invaders',
      label: 'Space Invaders',
      subtitle: 'Γραμματική Invaders',
      icon: '🚀',
      bg: 'linear-gradient(135deg,#04001A,#18083C)',
      desc: 'Αποκρούσε τα ερωτήματα — κάθε λάθος απάντηση φέρνει τους εισβολείς πιο κοντά!',
      tags: ['Action', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'labyrinth',
      label: 'Λαβύρινθος',
      subtitle: 'Maze Explorer',
      icon: '🌀',
      bg: 'linear-gradient(135deg,#0A1A06,#1C3010)',
      desc: 'Βρες τον δρόμο σου μέσα από τον λαβύρινθο απαντώντας σωστά σε κάθε σταυροδρόμι.',
      tags: ['Puzzle', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'myth-memory',
      label: 'Mythology Memory',
      subtitle: 'Ζεύγη Μυθολογίας',
      icon: '🃏',
      bg: 'linear-gradient(135deg,#160A22,#321658)',
      desc: 'Βρες τα ζεύγη καρτών — αντιστοίχισε έννοιες, ήρωες και ορισμούς.',
      tags: ['Memory', 'Solo'],
      multiplayer: false,
      tier: 'free',
      allowedCategories: ['Ομηρική Ποίηση']
    },
    {
      id: 'phalanx',
      label: 'Φάλαγγα',
      subtitle: 'Phalanx Formation',
      icon: '🛡️',
      bg: 'linear-gradient(135deg,#1C0A06,#44180C)',
      desc: 'Κράτα τον σχηματισμό! Κάθε σωστή απάντηση ενισχύει τη γραμμή, κάθε λάθος τη σπάει.',
      tags: ['Strategy', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'rapid-fire',
      label: 'Καταιγισμός',
      subtitle: 'Rapid Fire — The Gathering Storm',
      icon: '⚡',
      bg: 'linear-gradient(135deg,#1A1206,#342800)',
      desc: 'Κράτα την καταιγίδα ζωντανή — εναλλασσόμενοι τύποι, επιλογή χρόνου, άπειρες ερωτήσεις!',
      tags: ['Speed', 'Solo'],
      multiplayer: false,
      maxPlayers: 8,
      tier: 'free'
    },
    {
      id: 'tow',
      label: 'Tug of War',
      subtitle: 'Αγώνας Διελκυστίνδας',
      icon: '⚔️',
      bg: 'linear-gradient(135deg,#1E0806,#440E08)',
      desc: 'Παιχνίδι διελκυστίνδας — απάντα σωστά για να σπρώξεις τον αντίπαλο!',
      tags: ['PvP', 'Competitive'],
      multiplayer: true,
      maxPlayers: 8,
      tier: 'free'
    },
    {
      id: 'epic-puzzle',
      label: 'Χρονολόγιο',
      subtitle: 'Chronicle Sequencer',
      icon: '📋',
      bg: 'linear-gradient(135deg,#060C1A,#102236)',
      desc: 'Βάλε τα γεγονότα και έννοιες στη σωστή χρονολογική σειρά.',
      tags: ['Puzzle', 'Solo'],
      multiplayer: false,
      tier: 'free',
      allowedCategories: ['Ομηρική Ποίηση', 'Ιστορία']
    },
    {
      id: 'dig',
      label: 'Ανασκαφή',
      subtitle: 'Archaeological Dig',
      icon: '⛏️',
      bg: 'linear-gradient(135deg,#1A1006,#382808)',
      desc: 'Σκάψε και ανακάλυψε — κάθε σωστή απάντηση αποκαλύπτει ένα αρχαίο εύρημα.',
      tags: ['Discovery', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'mnemosyne',
      label: 'Μνημοσύνη',
      subtitle: 'Flashcard Study Mode',
      icon: '🃏',
      bg: 'linear-gradient(135deg,#0D0F0A,#1E2E14)',
      desc: 'Κάρτες μελέτης με spaced repetition — μάθε οποιαδήποτε ύλη με 3D flip & mastery tracking.',
      tags: ['Μελέτη', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'blade',
      label: 'Ξίφος του Γραμματικού',
      subtitle: "Grammarian's Blade",
      icon: '🗡️',
      bg: 'linear-gradient(135deg,#1A0E06,#3A1E0A)',
      desc: 'Κόψε τον σωστό γραμματικό τύπο — Fruit-Ninja στυλ με Κλίση & Παραθετικά.',
      tags: ['Action', 'Solo'],
      multiplayer: false,
      tier: 'free',
      allowedCategories: ['Γραμματική', 'Λατινικά']
    },
    {
      id: 'temple-run',
      label: 'Agora Surfers',
      subtitle: '3D Endless Runner',
      icon: '🏃',
      bg: 'linear-gradient(135deg,#0a0400,#241006)',
      desc: 'Τρέξε στην αρχαία αγορά — μάζεψε δραχμές, πήδα εμπόδια και απάντα σωστά για να κρατήσεις τον χάλκινο Τάλω μακριά!',
      tags: ['Runner', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'golden-fleece',
      label: 'Χρυσόμαλλον Δέρας',
      subtitle: 'Gold Quest — Το ταξίδι της Αργούς',
      icon: '⛵',
      bg: 'linear-gradient(135deg,#0A1014,#13303A)',
      desc: 'Άνοιξε πίθους για χρυσό — πρόσεχε όμως τον πίθο της Πανδώρας. Νίκησε τους Αργοναύτες.',
      tags: ['Τύχη', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'halieia',
      label: 'Αλιεία',
      subtitle: 'Fishing Frenzy — Τα δίχτυα του Ποσειδώνα',
      icon: '🎣',
      bg: 'linear-gradient(135deg,#06100C,#143A30)',
      desc: 'Ρίξε το καλάμι στο Αιγαίο — ψάρια, χρυσό ή θησαυρό. Χτίσε σερί φρενίτιδας για τη μεγαλύτερη ψαριά.',
      tags: ['Φρενίτιδα', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    /* ── PvP-pack engines integrated into synthesis (commit 2a0a324) ── */
    {
      id: 'krypteia',
      label: 'Κρυπτεία',
      subtitle: 'Crypto Hack — Σπαρτιατική Κρυπτογραφία',
      icon: '🗝️',
      bg: 'linear-gradient(135deg,#1A0E08,#3A1810)',
      desc: 'Λύσε τους γρίφους, σπάσε τις σκυτάλες των αντιπάλων και άρπαξε τον θησαυρό τους.',
      tags: ['Κώδικας', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'hegemonia',
      label: 'Ηγεμονία',
      subtitle: 'Color Kingdom — Η βασιλεία των χρωμάτων',
      icon: '🏛️',
      bg: 'linear-gradient(135deg,#140A08,#3A140E)',
      desc: 'Απάντησε γρήγορα και κατάκτησε τα τετράγωνα του βασιλείου — οι ηγεμόνες προελαύνουν από τους τέσσερις ανέμους.',
      tags: ['Ταχύτητα', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'toxotes',
      label: 'Τοξότης',
      subtitle: 'Archer — Τα βέλη της Αρτέμιδος',
      icon: '🏹',
      bg: 'linear-gradient(135deg,#140A06,#3A1E0A)',
      desc: 'Τέντωσε το τόξο της Αρτέμιδος και τόξευσε τους πετούμενους πίθους.',
      tags: ['Στόχος', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'agora',
      label: 'Αγορά',
      subtitle: 'Auction — Το σφυρί της Αγοράς',
      icon: '⚖️',
      bg: 'linear-gradient(135deg,#0E0A05,#33260C)',
      desc: 'Πλειοδότησε με δραχμές για κάθε θησαυρό — νίκησε τους εμπόρους στο σφυρί.',
      tags: ['Στρατηγική', 'Solo'],
      multiplayer: false,
      tier: 'free'
    },
    {
      id: 'discus',
      label: 'Δίσκος',
      subtitle: 'Plinko — Η ρίψη του δίσκου',
      icon: '🥏',
      bg: 'linear-gradient(135deg,#08100C,#1E3A2A)',
      desc: 'Κάθε σωστή απάντηση σου χαρίζει μια ρίψη — άσε τον δίσκο να κατρακυλήσει.',
      tags: ['Τύχη', 'Solo'],
      multiplayer: false,
      tier: 'free'
    }
  ];

  // Auto-classify: anything tagged 'Μελέτη' is theory; everything else practice.
  GP_ENGINES.forEach(function (e) {
    if (!e.type) e.type = (e.tags || []).includes('Μελέτη') ? 'theory' : 'practice';
  });

  // ── ENGINE CATEGORY GROUPS ───────────────────────────────────
  // Used by admin.js _cpEcRender() (Engine ↔ Content matrix) to group
  // engines under headings. Only ids present in GP_ENGINES are rendered.
  var GP_ENGINE_CATEGORIES = [
    {
      id: 'pvp',
      label: 'Ανταγωνισμός',
      sublabel: 'PvP · Multiplayer',
      icon: '⚔️',
      accent: '#B03A1E',
      ids: ['naumachia', 'tow']
    },
    {
      id: 'action',
      label: 'Action & Ταχύτητα',
      sublabel: 'Arcade · Speed',
      icon: '🚀',
      accent: '#2B4FAA',
      ids: ['invaders', 'rapid-fire', 'blade', 'hegemonia']
    },
    {
      id: 'strategy',
      label: 'Στρατηγική',
      sublabel: 'Turn-based · Formation',
      icon: '🛡️',
      accent: '#4A6B28',
      ids: ['phalanx', 'agora']
    },
    {
      id: 'puzzle',
      label: 'Εξερεύνηση & Puzzle',
      sublabel: 'Discovery · Sequencing · Maze',
      icon: '🧩',
      accent: '#9A6B10',
      ids: ['labyrinth', 'epic-puzzle', 'dig', 'krypteia', 'toxotes']
    },
    {
      id: 'memory',
      label: 'Μνήμη & Μελέτη',
      sublabel: 'Memory · Flashcards',
      icon: '🃏',
      accent: '#5B3A8A',
      ids: ['myth-memory', 'mnemosyne']
    },
    {
      id: 'fortune',
      label: 'Τύχη & Φρενίτιδα',
      sublabel: 'Fortune · Frenzy',
      icon: '⛵',
      accent: '#C4A448',
      ids: ['golden-fleece', 'halieia', 'discus', 'temple-run']
    }
  ];

  // Expose on window. In a classic (non-module) script, a `window.X`
  // property is ALSO readable as a bare global `X` and passes
  // `typeof X !== 'undefined'` — this is exactly how the sibling
  // window.GP_DATASETS (js/gp-content.js) satisfies the same checks in
  // admin.js / admin-cc.js, so no eval / extra binding is needed.
  window.GP_ENGINES = GP_ENGINES;
  window.GP_ENGINE_CATEGORIES = GP_ENGINE_CATEGORIES;
})();
