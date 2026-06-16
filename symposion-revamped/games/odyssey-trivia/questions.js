// ============================================================
//  Odyssey Trivia — Questions
//  Edit this file to add questions for each rhapsody.
//
//  OD_RHAPSODIES: the 24 books of the Odyssey (lowercase Greek letters)
//  OD_QUESTIONS.gr / OD_QUESTIONS.en — same structure as Iliad Trivia
//
//  Each question:
//    q:    question text
//    opts: array of 4 answer strings
//    ans:  index (0–3) of the correct answer
// ============================================================

const OD_RHAPSODIES = ['α','β','γ','δ','ε','ζ','η','θ','ι','κ','λ','μ','ν','ξ','ο','π','ρ','σ','τ','υ','φ','χ','ψ','ω'];

const OD_QUESTIONS = {

  // ── ΕΛΛΗΝΙΚΑ ─────────────────────────────────────────────
  gr: {

    // Γενική Οδύσσεια — ερωτήσεις για όλες τις ραψωδίες
    'all': [
      { q: 'Ποιος είναι ο κεντρικός ήρωας της Οδύσσειας;', opts: ['Αχιλλέας','Οδυσσέας','Τηλέμαχος','Αγαμέμνων'], ans: 1 },
      { q: 'Από ποια πόλη επιστρέφει ο Οδυσσέας;', opts: ['Σπάρτη','Μυκήνες','Τροία','Ιθάκη'], ans: 2 },
      { q: 'Πού βρίσκεται το βασίλειο του Οδυσσέα;', opts: ['Κρήτη','Ιθάκη','Κόρινθος','Άργος'], ans: 1 },
      { q: 'Ποιος είναι ο γιος του Οδυσσέα;', opts: ['Νεοπτόλεμος','Πυλάδης','Τηλέμαχος','Ορέστης'], ans: 2 },
      { q: 'Ποια είναι η σύζυγος του Οδυσσέα που τον περιμένει πιστά;', opts: ['Ελένη','Κλυταιμνήστρα','Πηνελόπη','Κίρκη'], ans: 2 },
      { q: 'Σε πόσες ραψωδίες χωρίζεται η Οδύσσεια;', opts: ['12','18','24','36'], ans: 2 },
      { q: 'Ποια νύμφη κρατά τον Οδυσσέα αιχμάλωτο στο νησί της Ωγυγίας;', opts: ['Κίρκη','Καλυψώ','Σειρήνες','Νύμφη Τηθύς'], ans: 1 },
      { q: 'Ποιος θεός είναι εχθρός του Οδυσσέα;', opts: ['Δίας','Άρης','Ποσειδών','Ήφαιστος'], ans: 2 },
      { q: 'Ποια θεά βοηθά τον Οδυσσέα σε όλη τη διαδρομή;', opts: ['Αφροδίτη','Ήρα','Άρτεμις','Αθηνά'], ans: 3 },
      { q: 'Πώς ονομάζεται το τόξο που χρησιμοποιεί ο Οδυσσέας στο τέλος;', opts: ['Τόξο Ηρακλή','Τόξο Ιφίτου','Τόξο Απόλλωνα','Τόξο Αχιλλέα'], ans: 1 },
    ],

    // ── Ραψωδία α — Θεϊκή Σύνοδος & Τηλέμαχος ──
    'α': [
      // TODO: Προσθέστε ερωτήσεις για τη ραψωδία α
    ],

    // ── Ραψωδία β ──
    'β': [],

    // ── Ραψωδία γ ──
    'γ': [],

    // ── Ραψωδία δ — Στη Σπάρτη ──
    'δ': [],

    // ── Ραψωδία ε — Οδυσσέας & Καλυψώ ──
    'ε': [],

    // ── Ραψωδία ζ — Ναυσικάα ──
    'ζ': [],

    // ── Ραψωδία η — Στη χώρα των Φαιάκων ──
    'η': [],

    // ── Ραψωδία θ — Αθλήματα Φαιάκων ──
    'θ': [],

    // ── Ραψωδία ι — Κύκλωπας ──
    'ι': [
      { q: 'Πώς λέγεται ο Κύκλωπας που τυφλώνει ο Οδυσσέας;', opts: ['Τρίτων','Πολύφημος','Κύκλωψ Τυφλός','Αντίφατης'], ans: 1 },
      { q: 'Τι ψευδώνυμο δίνει ο Οδυσσέας στον Κύκλωπα;', opts: ['Κανείς / Κανείς','Πολλοί','Άνθρωπος','Ξένος'], ans: 0 },
    ],

    // ── Ραψωδία κ — Κίρκη ──
    'κ': [
      { q: 'Σε τι μεταμορφώνει η Κίρκη τους συντρόφους του Οδυσσέα;', opts: ['Λέοντες','Χοίρους','Πρόβατα','Ελάφια'], ans: 1 },
    ],

    // ── Ραψωδία λ — Κάθοδος στον Άδη ──
    'λ': [
      { q: 'Ποιον νεκρό συναντά πρώτος ο Οδυσσέας στον Άδη;', opts: ['Αγαμέμνων','Τειρεσίας','Ελπήνωρ','Αχιλλέας'], ans: 2 },
    ],

    // ── Ραψωδίες μ–ω (κενές — προσθέστε ερωτήσεις) ──
    'μ': [], 'ν': [], 'ξ': [], 'ο': [], 'π': [],
    'ρ': [], 'σ': [], 'τ': [], 'υ': [], 'φ': [],
    'χ': [], 'ψ': [],

    // ── Ραψωδία ω — Τελική Ανακωχή ──
    'ω': [],
  },

  // ── ENGLISH ───────────────────────────────────────────────
  en: {

    'all': [
      { q: 'Who is the main hero of the Odyssey?', opts: ['Achilles','Odysseus','Telemachus','Agamemnon'], ans: 1 },
      { q: 'From which city is Odysseus returning?', opts: ['Sparta','Mycenae','Troy','Ithaca'], ans: 2 },
      { q: 'Where is Odysseus\' kingdom?', opts: ['Crete','Ithaca','Corinth','Argos'], ans: 1 },
      { q: 'Who is Odysseus\' son?', opts: ['Neoptolemus','Pylades','Telemachus','Orestes'], ans: 2 },
      { q: 'Who is Odysseus\' faithful wife?', opts: ['Helen','Clytemnestra','Penelope','Circe'], ans: 2 },
      { q: 'Into how many books is the Odyssey divided?', opts: ['12','18','24','36'], ans: 2 },
      { q: 'Which nymph keeps Odysseus captive on the island of Ogygia?', opts: ['Circe','Calypso','Sirens','Thetis'], ans: 1 },
      { q: 'Which god is Odysseus\' enemy?', opts: ['Zeus','Ares','Poseidon','Hephaestus'], ans: 2 },
      { q: 'Which goddess helps Odysseus throughout his journey?', opts: ['Aphrodite','Hera','Artemis','Athena'], ans: 3 },
      { q: 'What name does Odysseus give himself to the Cyclops?', opts: ['Nobody','Many','Stranger','Man'], ans: 0 },
    ],

    'α': [], 'β': [], 'γ': [], 'δ': [], 'ε': [], 'ζ': [],
    'η': [], 'θ': [],
    'ι': [
      { q: 'What is the name of the Cyclops Odysseus blinds?', opts: ['Triton','Polyphemus','Blind Cyclops','Antiphates'], ans: 1 },
    ],
    'κ': [
      { q: 'Into what does Circe transform Odysseus\' men?', opts: ['Lions','Pigs','Sheep','Deer'], ans: 1 },
    ],
    'λ': [
      { q: 'Who is the first shade Odysseus meets in the Underworld?', opts: ['Agamemnon','Tiresias','Elpenor','Achilles'], ans: 2 },
    ],
    'μ': [], 'ν': [], 'ξ': [], 'ο': [], 'π': [],
    'ρ': [], 'σ': [], 'τ': [], 'υ': [], 'φ': [],
    'χ': [], 'ψ': [], 'ω': [],
  },

};

// Quotes for win/game-over screen
const OD_QUOTES_EN = [
  '"A man who has good thoughts cannot ever be ugly." — Homer',
  '"There is nothing more admirable than when two people who see eye to eye keep house." — Homer',
  '"Even his griefs are a joy long after to one that remembers all that he wrought and endured." — Homer',
];
const OD_QUOTES_GR = [
  '"Δεν υπάρχει τίποτα πιο γλυκό από το σπίτι κανενός." — Όμηρος',
  '"Ο νους του ανθρώπου κρατά αυτόν που ταξιδεύει όρθιο." — Όμηρος',
  '"Ακόμα και στην απελπισία, η επιμονή βρίσκει τη διέξοδο." — Όμηρος',
];
