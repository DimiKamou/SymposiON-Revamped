/* ════════════════════════════════════════════════════════════════════
   SymposiON — PvP Arena · data tables   (js/pvp-data.js)
   Pure data + tiny helpers. No DOM. Greek-primary, English secondary.
   ════════════════════════════════════════════════════════════════════ */
window.PVP = window.PVP || {};

/* ── Game modes eligible for online PvP (score-comparable, timed) ──
   `weight` biases which modes surface in Quick / Vote pools.
   The four the user prioritised (Krypteia, Gold Quest, Halieia, Moirai)
   carry the heaviest weight so they appear most often. */
PVP.MODES = [
  { id:'krypteia',  gr:'ΚΡΥΠΤΕΙΑ',            en:'Crypto Hack',     glyph:'Λ', accent:'--sym-terra',  weight:5,
    blurb:{gr:'Σπάσε τις σκυτάλες των αντιπάλων.', en:'Crack rivals\u2019 ciphers.'} },
  { id:'fleece',    gr:'ΧΡΥΣΟΜΑΛΛΟΝ ΔΕΡΑΣ',    en:'Gold Quest',      glyph:'☉', accent:'--sym-gold',   weight:5,
    blurb:{gr:'Άνοιξε πίθους — απόφυγε την Πανδώρα.', en:'Open jars \u2014 dodge Pandora.'} },
  { id:'halieia',   gr:'ΑΛΙΕΙΑ',               en:'Fishing Frenzy',  glyph:'Ψ', accent:'--sym-sage',   weight:5,
    blurb:{gr:'Ρίξε τα δίχτυα στο Αιγαίο.', en:'Cast nets in the Aegean.'} },
  { id:'moirai',    gr:'ΜΟΙΡΑΙ',               en:'Wheel of Fates',  glyph:'⊛', accent:'--sym-blood',  weight:5,
    blurb:{gr:'Γύρισε τον τροχό των Μοιρών.', en:'Spin the wheel of fate.'} },
  { id:'hegemonia', gr:'ΗΓΕΜΟΝΙΑ',             en:'Color Kingdom',   glyph:'▦', accent:'--sym-blood',  weight:2,
    blurb:{gr:'Κατάκτησε τα τετράγωνα.', en:'Conquer the squares.'} },
  { id:'anabasis',  gr:'ΑΝΑΒΑΣΙΣ',             en:'Millionaire',     glyph:'⛰', accent:'--sym-gold',   weight:3,
    blurb:{gr:'Ανέβα τις βαθμίδες του Ολύμπου.', en:'Climb Olympus.'} },
  { id:'hippodrome',gr:'ΑΡΜΑΤΟΔΡΟΜΙΑ',         en:'Race',            glyph:'⊚', accent:'--sym-terra',  weight:3,
    blurb:{gr:'Οδήγησε το άρμα στον τέρμα.', en:'Drive your chariot home.'} },
  { id:'manteion',  gr:'ΜΑΝΤΕΙΟΝ',             en:'Wager Quiz',      glyph:'◬', accent:'--sym-aegean', weight:3,
    blurb:{gr:'Πόνταρε τη σοφία σου.', en:'Wager your wisdom.'} },
  { id:'akropolis', gr:'ΑΚΡΟΠΟΛΙΣ',            en:'Builder',         glyph:'⊓', accent:'--sym-gold',   weight:2,
    blurb:{gr:'Ύψωσε τους κίονες του ναού.', en:'Raise the temple columns.'} },
  { id:'discus',    gr:'ΔΙΣΚΟΣ',               en:'Plinko',          glyph:'◯', accent:'--sym-sage',   weight:2,
    blurb:{gr:'Άφησε τον δίσκο να κατρακυλήσει.', en:'Let the discus fall.'} },
  { id:'agora',     gr:'ΑΓΟΡΑ',                en:'Auction',         glyph:'⚖', accent:'--sym-gold',   weight:2,
    blurb:{gr:'Πλειοδότησε για την απάντηση.', en:'Bid for the answer.'} },
  { id:'toxotes',   gr:'ΤΟΞΟΤΗΣ',              en:'Duck Hunt',       glyph:'➶', accent:'--sym-terra',  weight:2,
    blurb:{gr:'Τόξευσε τους πετούμενους πίθους.', en:'Shoot the flying jars.'} },
];

/* ── 1v1 DUEL modes — head-to-head games. `engine` routes the match:
   'petteia' = answer-to-move strategy board, 'tug' = tug of war,
   'quiz' (default) = the standard timed point duel.  ── */
PVP.DUEL_MODES = [
  { id:'skaki',    gr:'ΣΚΑΚΙ',         en:'Chess',          glyph:'♛', accent:'--sym-blood',  weight:5, engine:'chess',
    blurb:{gr:'Κανονικό σκάκι — απάντησε σωστά, αλλιώς χάνεις τη σειρά.', en:'Real chess — answer right or forfeit your move.'} },
  { id:'petteia',  gr:'ΠΕΤΤΕΙΑ',       en:'Strategy Chess', glyph:'♟', accent:'--sym-terra',  weight:4, engine:'petteia',
    blurb:{gr:'Απάντησε σωστά για να κινηθείς — αιχμαλώτισε τις πέττες.', en:'Answer right to move; flank to capture.'} },
  { id:'tug',      gr:'ΔΙΕΛΚΥΣΤΙΝΔΑ',  en:'Tug of War',     glyph:'⇄', accent:'--sym-gold',   weight:4, engine:'tug',
    blurb:{gr:'Τράβα το σχοινί με σωστές απαντήσεις.', en:'Pull the rope with right answers.'} },
  { id:'diogmos',  gr:'ΔΙΩΓΜΟΣ',        en:'The Pursuit',    glyph:'🔥', accent:'--sym-blood',  weight:5, engine:'erinyes',
    blurb:{gr:'Οι Ερινύες κυνηγούν — τρέξε στο άσυλο ή άρπαξέ τον.', en:'The Furies give chase — flee to asylum or seize him.'} },
  { id:'naumachia',gr:'ΝΑΥΜΑΧΙΑ',      en:'Battleship',     glyph:'⚓', accent:'--sym-aegean', weight:3, engine:'quiz',
    blurb:{gr:'Βύθισε τον στόλο του αντιπάλου.', en:'Sink the rival fleet.'} },
  { id:'akropolis_d',gr:'ΑΚΡΟΠΟΛΙΣ',   en:'Builder Duel',   glyph:'⊓', accent:'--sym-gold',   weight:3, engine:'quiz',
    blurb:{gr:'Ύψωσε τον ναό πριν τον αντίπαλο.', en:'Raise the temple first.'} },
  { id:'ekklisia_d',gr:'ΕΚΚΛΗΣΙΑ',     en:'Buzzer Duel',    glyph:'◉', accent:'--sym-aegean', weight:3, engine:'quiz',
    blurb:{gr:'Πάτα πρώτος — πάρε τον λόγο.', en:'Buzz first, take the floor.'} },
  { id:'pankration',gr:'ΠΑΓΚΡΑΤΙΟΝ',   en:'Duel',           glyph:'⚡', accent:'--sym-blood',  weight:3, engine:'quiz',
    blurb:{gr:'Καθαρή μονομαχία πόντων.', en:'Pure point duel.'} },
];

/* ── Subjects ("your theory") — each player drills their own deck ── */
PVP.SUBJECTS = [
  { id:'myth',   gr:'ΜΥΘΟΛΟΓΙΑ',     en:'Mythology',      glyph:'Μ', accent:'--sym-gold'   },
  { id:'homer',  gr:'ΟΜΗΡΙΚΑ ΕΠΗ',   en:'Homeric Epics',  glyph:'Ω', accent:'--sym-terra'  },
  { id:'gram',   gr:'ΓΡΑΜΜΑΤΙΚΗ',    en:'Greek Grammar',  glyph:'Γ', accent:'--sym-aegean' },
  { id:'hist',   gr:'ΙΣΤΟΡΙΑ',       en:'History',        glyph:'Ι', accent:'--sym-blood'  },
  { id:'phil',   gr:'ΦΙΛΟΣΟΦΙΑ',     en:'Philosophy',     glyph:'Φ', accent:'--sym-sage'   },
  { id:'gods',   gr:'ΘΕΟΙ & ΗΡΩΕΣ',  en:'Gods & Heroes',  glyph:'Θ', accent:'--sym-gold'   },
  { id:'lex',    gr:'ΛΕΞΙΛΟΓΙΟ',     en:'Vocabulary',     glyph:'Λ', accent:'--sym-aegean' },
  { id:'geo',    gr:'ΓΕΩΓΡΑΦΙΑ',     en:'Geography',      glyph:'Ξ', accent:'--sym-sage'   },
];

/* ── Seals / glyph avatars the player may choose ── */
PVP.SEALS = [
  { glyph:'Σ', name:'ΣΦΗΞ',   en:'Sphinx'  },
  { glyph:'Φ', name:'ΦΟΒΟΣ',  en:'Dread'   },
  { glyph:'Δ', name:'ΔΡΑΚΩΝ',  en:'Dragon'  },
  { glyph:'Λ', name:'ΛΕΩΝ',   en:'Lion'    },
  { glyph:'Θ', name:'ΘΥΕΛΛΑ', en:'Storm'   },
  { glyph:'Ψ', name:'ΨΥΧΗ',   en:'Soul'    },
  { glyph:'Ω', name:'ΩΡΙΩΝ',  en:'Orion'   },
  { glyph:'Ξ', name:'ΞΙΦΟΣ',  en:'Blade'   },
  { glyph:'Π', name:'ΠΥΡΓΟΣ', en:'Tower'   },
  { glyph:'Μ', name:'ΜΟΙΡΑ',  en:'Fate'    },
  { glyph:'Γ', name:'ΓΡΥΨ',   en:'Griffin' },
  { glyph:'Α', name:'ΑΕΤΟΣ',  en:'Eagle'   },
];

/* ── Opponent name pool (Greek strategists, mixed) ── */
PVP.NAMES = [
  'ΛΥΣΑΝΔΡΟΣ','ΒΡΑΣΙΔΑΣ','ΓΥΛΙΠΠΟΣ','ΑΛΚΙΒΙΑΔΗΣ','ΑΡΧΙΔΑΜΟΣ','ΚΛΕΟΜΒΡΟΤΟΣ',
  'ΘΕΜΙΣΤΟΚΛΗΣ','ΠΕΡΙΚΛΗΣ','ΛΕΩΝΙΔΑΣ','ΜΙΛΤΙΑΔΗΣ','ΚΙΜΩΝ','ΝΙΚΙΑΣ',
  'ΔΗΜΟΣΘΕΝΗΣ','ΕΠΑΜΕΙΝΩΝΔΑΣ','ΠΕΛΟΠΙΔΑΣ','ΑΓΗΣΙΛΑΟΣ','ΞΕΝΟΦΩΝ','ΑΡΙΣΤΕΙΔΗΣ',
  'ΚΛΕΩΝ','ΑΣΠΑΣΙΑ','ΣΑΠΦΩ','ΑΡΤΕΜΙΣΙΑ','ΓΟΡΓΩ','ΑΝΤΙΓΟΝΗ','ΗΛΕΚΤΡΑ','ΚΑΣΣΑΝΔΡΑ',
];

/* ── Ranked tiers by rating ── */
PVP.TIERS = [
  { min:0,    gr:'ΙΔΙΩΤΗΣ',   en:'Novice',   glyph:'·' },
  { min:1000, gr:'ΟΠΛΙΤΗΣ',   en:'Hoplite',  glyph:'⊓' },
  { min:1200, gr:'ΛΟΧΑΓΟΣ',   en:'Captain',  glyph:'⊠' },
  { min:1400, gr:'ΣΤΡΑΤΗΓΟΣ', en:'General',  glyph:'✦' },
  { min:1600, gr:'ΗΡΩΣ',      en:'Hero',     glyph:'✸' },
  { min:1800, gr:'ΗΜΙΘΕΟΣ',   en:'Demigod',  glyph:'❂' },
  { min:2000, gr:'ΟΛΥΜΠΙΟΣ',  en:'Olympian', glyph:'⚡' },
];

PVP.tierFor = function (rating) {
  let t = PVP.TIERS[0];
  for (const x of PVP.TIERS) if (rating >= x.min) t = x;
  return t;
};

/* ── Lobby emotes (the brand already uses emoji on game cards) ── */
PVP.EMOTES = ['⚡','🔥','👑','🏛️','🤝','😤','✦','🛡️'];

/* ── Helpers ─────────────────────────────────────────────────── */
PVP.rand  = (a, b) => a + Math.random() * (b - a);
PVP.randi = (a, b) => Math.floor(PVP.rand(a, b + 1));
PVP.pick  = (arr) => arr[Math.floor(Math.random() * arr.length)];
PVP.shuffle = (arr) => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* weighted mode pick (for Quick / random) — pool defaults to MODES */
PVP.weightedMode = function (exclude, pool) {
  pool = (pool || PVP.MODES).filter(m => !exclude || !exclude.includes(m.id));
  const total = pool.reduce((s, m) => s + m.weight, 0);
  let r = Math.random() * total;
  for (const m of pool) { r -= m.weight; if (r <= 0) return m; }
  return pool[0];
};
/* N distinct modes weighted (for the vote board) */
PVP.weightedModes = function (n, pool) {
  pool = pool || PVP.MODES;
  const out = [];
  while (out.length < n && out.length < pool.length) {
    const m = PVP.weightedMode(out.map(x => x.id), pool);
    if (m && !out.find(x => x.id === m.id)) out.push(m);
  }
  return out;
};

/* persisted player profile */
PVP.loadProfile = function () {
  let p = null;
  try { p = JSON.parse(localStorage.getItem('sym-pvp-profile') || 'null'); } catch (_) {}
  if (!p || !p.name) {
    p = { name: 'ΕΣΥ', seal: PVP.SEALS[0].glyph, rating: 1200, wins: 0, played: 0 };
  }
  return p;
};
PVP.saveProfile = function (p) {
  try { localStorage.setItem('sym-pvp-profile', JSON.stringify(p)); } catch (_) {}
};
