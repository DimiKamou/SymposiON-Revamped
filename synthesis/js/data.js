/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · CONTENT MODEL
   One source of truth. Each direction renders from this. Mirrors the
   production home: 6 class tabs (Γυμνάσιο Α–Γ, Λύκειο Α–Γ), each with
   subject panels of game tiles. Class identity = roman numeral + accent.
   ════════════════════════════════════════════════════════════════════ */

window.SYM_DIR = window.SYM_DIR || {};

// Bilingual helper text
const STR = {
  eyebrow:   { gr: 'Εκπαιδευτική Πλατφόρμα', en: 'Educational Platform' },
  lede:      { gr: 'Αρχαία Ελληνικά, Τραγωδίες, Ομηρικά Έπη, Λογοτεχνία, Γραμματική, Γλώσσα, Έκθεση, Ιστορία και Λατινικά — μέσα από παιχνίδια.',
               en: 'Ancient Greek, Tragedies, Homeric Epics, Literature, Grammar, Language, Composition, History and Latin — learned through play.' },
  startFree: { gr: 'Ξεκίνα δωρεάν', en: 'Start for free' },
  browse:    { gr: 'Κατάλογος Παιχνιδιών', en: 'Game Catalogue' },
  pickClass: { gr: 'ή διάλεξε την τάξη σου', en: 'or choose your class' },
  signin:    { gr: 'Είσοδος', en: 'Sign in' },
  signup:    { gr: 'Εγγραφή', en: 'Sign up' },
  play:      { gr: 'Παίξε', en: 'Play' },
  allGames:  { gr: 'Όλα τα παιχνίδια', en: 'All games' },
  playNow:   { gr: 'Παίξε τώρα', en: 'Play now' },
  engines:   { gr: 'Μηχανές Παιχνιδιών', en: 'Game Engines' },
  enginesSub:{ gr: 'Ένα παιχνίδι, κάθε ύλη — οι μηχανές προσαρμόζονται στο μάθημα.',
               en: 'One game, any material — engines adapt to every subject.' },
  explore:   { gr: 'Εξερεύνησε τα μαθήματα', en: 'Explore the subjects' },
  exploreSub:{ gr: 'Κάθε τάξη, ο δικός της κόσμος.', en: 'Every class, its own world.' },
  joinTitle: { gr: 'Μπες στην τάξη', en: 'Join a classroom' },
  joinSub:   { gr: 'Πληκτρολόγησε τον 6ψήφιο κωδικό που έδωσε ο καθηγητής σου.',
               en: 'Enter the 6-character PIN your teacher gave you.' },
  joinBtn:   { gr: 'Είσοδος', en: 'Join' },
  games:     { gr: 'παιχνίδια', en: 'games' },
  live:      { gr: 'Live', en: 'Live' },
  tagline:   { gr: 'Game On | Classics Gamified', en: 'Game On | Classics Gamified' },
};

function L(o){ return o && (o[window.SYM_LANG] || o.gr) || ''; }

// ── Per-class identity. Accent is fixed per class (subject tint layered
//    on theme neutrals) so a class is recognisable across every theme. ──
const CLASSES = [
  { id:'gym-a', roman:'I',  accent:'#D2693F', gr:'Α΄ Γυμνασίου', en:'7th Grade',
    blurb:{ gr:'Οδύσσεια & πρώτα βήματα στα Αρχαία', en:'Odyssey & first steps in Ancient Greek' } },
  { id:'gym-b', roman:'II', accent:'#2F6F8E', gr:'Β΄ Γυμνασίου', en:'8th Grade',
    blurb:{ gr:'Ιλιάδα, Αρχαία & Ιστορία', en:'Iliad, Ancient Greek & History' } },
  { id:'gym-c', roman:'III',accent:'#6E8B3D', gr:'Γ΄ Γυμνασίου', en:'9th Grade',
    blurb:{ gr:'Ελένη, δράμα & σύνταξη', en:'Helen, drama & syntax' } },
  { id:'lyk-a', roman:'IV', accent:'#7C5AC2', gr:'Α΄ Λυκείου', en:'10th Grade',
    blurb:{ gr:'Θουκυδίδης, Έκφραση & Λατινικά', en:'Thucydides, Composition & Latin' } },
  { id:'lyk-b', roman:'V',  accent:'#C18A2C', gr:'Β΄ Λυκείου', en:'11th Grade',
    blurb:{ gr:'Ρητορική, Αρχαία & Λατινικά', en:'Rhetoric, Ancient Greek & Latin' } },
  { id:'lyk-c', roman:'VI', accent:'#B0395A', gr:'Γ΄ Λυκείου', en:'12th Grade',
    blurb:{ gr:'Κατεύθυνση — Ιστορία & Λατινικά', en:'Advanced — History & Latin' } },
];

// helper to build a game tile. `launch` (optional) = { fn:'openX', args:[] }
// threaded to screens.js so a tile can dispatch to a real Ver1 opener via
// synLaunch (else falls back to SymPreview). Existing tiles omit it (undefined).
// `launch.soon:true` (or the gSoon() shorthand) flags a revamp-only tile that
// has NO backing game yet → rendered with a "ΣΥΝΤΟΜΑ / Coming soon" badge and a
// friendly notice on click instead of pretending it is a playable game.
const g = (gr, en, meta, illu, launch) => {
  const tile = { gr, en, meta, illu, launch };
  if (launch && launch.soon) tile.soon = true;
  return tile;
};
// shorthand for a coming-soon tile (no real game behind it yet)
const gSoon = (gr, en, meta, illu) => g(gr, en, meta, illu, { soon: true });

// ── Subjects per class. illu = line-art name from images/illustrations ──
const SUBJECTS = {
  'gym-a': [
    { id:'odysseia', roman:'I', illu:'trireme', gr:'Οδύσσεια', en:'Odyssey', sub:'Odyssey',
      summary:{ gr:'Ο νόστος του Οδυσσέα — νησιά, τέρατα, θεοί.', en:'Odysseus\u2019 homecoming — islands, monsters, gods.' },
      games:[ g('Ζωφόρος Οδύσσειας','Odyssey Frieze','Καμπάνια · 11 ραψωδίες · διάλογοι','trireme',{fn:'openOdysseiaVoyage'}),
              g('Οδύσσεια Arcade','Odyssea Arcade','5 ραψωδίες · waves','trireme'),
              g('Odyssey Trivia','Odyssey Trivia','MC · Tug of War','trireme'),
              g('Οδύσσεια 3D','Odyssey 3D','8 νησιά · Μεσόγειος','trojan-horse'),
              g('Χρονολόγιο','Chronicle','Timeline · γεγονότα','walls'),
              g('Mythology Memory','Mythology Memory','Ζεύγη · ήρωες & θεοί','masks'),
              g('Rapid Fire','Rapid Fire','Speed quiz · 3 ζωές','cyclops-eye'),
              g('Agora Surfers','Agora Surfers','Endless runner','agora') ] },
    { id:'archaia', roman:'III', illu:'scroll', gr:'Αρχαία Ελληνικά', en:'Ancient Greek', sub:'Ancient Greek',
      summary:{ gr:'Ρήματα, ονόματα και πρώτο συντακτικό.', en:'Verbs, nouns and first syntax.' },
      games:[ g('Κείμενα · Μεταφράσεις','Texts · Translations','Παράλληλο κείμενο · σύνταξη','scroll',{fn:'openParallelLesson',args:['texts-gym-a']}),
              g('Κλίσις Ρημάτων','Verb Forms','εἶμι · φημί · οἶδα','column',{fn:'openKlisiRimaton'}),
              g('Κλίση εἰμί','Conjugation of εἰμί','«είμαι» · 3 χρόνοι','amphora',{fn:'openEimi'}),
              g('Συνηρημένα','Contract Verbs','τιμῶ · ποιῶ · δηλῶ','scroll',{fn:'openSynirimmena'}),
              g('Ανώμαλα Ρήματα','Irregular Verbs','Match · κλίση','wreath',{fn:'openAnwmalaRimata'}) ] },
  ],
  'gym-b': [
    { id:'iliada', roman:'II', illu:'helmet', gr:'Ιλιάδα', en:'Iliad', sub:'Iliad',
      summary:{ gr:'Η μῆνις, οι μάχες, τα τείχη της Τροίας.', en:'The wrath, the battles, the walls of Troy.' },
      games:[ g('Ζωφόρος Ιλιάδας','Iliad Frieze','Καμπάνια · 8 ραψωδίες · διάλογοι','shield-spear',{fn:'openIliadaVoyage'}),
              g('Ιλιάδα Arcade','Iliad Arcade','5 ραψωδίες · waves','shield-spear'),
              g('Χρονολόγιο','Chronicle','Timeline · γεγονότα','walls'),
              g('Mythology Memory','Mythology Memory','Ζεύγη · ήρωες & θεοί','masks'),
              g('Rapid Fire','Rapid Fire','Speed quiz · 3 ζωές','cyclops-eye'),
              g('Agora Surfers','Agora Surfers','Endless runner','agora'),
              g('Trivia Ιλιάδας','Iliad Trivia','Quiz · 5 επίπεδα','chariot') ] },
    { id:'archaia-b', roman:'III', illu:'column', gr:'Αρχαία Ελληνικά', en:'Ancient Greek', sub:'Ancient Greek',
      summary:{ gr:'Αρχαία κείμενα, μετάφραση και γραμματική.', en:'Ancient texts, translation and grammar.' },
      games:[ g('Κείμενα · Μεταφράσεις','Texts · Translations','Παράλληλο κείμενο · σύνταξη','scroll',{fn:'openParallelLesson',args:['texts-gym-b']}),
              g('Κλίσις Ρημάτων','Verb Forms','εἶμι · φημί · οἶδα','column',{fn:'openKlisiRimaton'}),
              g('Συνηρημένα','Contract Verbs','τιμῶ · ποιῶ · δηλῶ','scroll',{fn:'openSynirimmena'}),
              g('Αόριστος Β΄','2nd Aorist','ἔλαβον · εἶδον','wreath',{fn:'openAoristosB'}),
              g('Grammar Invaders','Grammar Invaders','Arcade · ουσιαστικά','helmet'),
              g('Ανώμαλα Ρήματα','Irregular Verbs','Match · κλίση','wreath',{fn:'openAnwmalaRimata'}),
              g('Φάλαγγα','Phalanx','Strategy · turn-based','shield-round') ] },
    { id:'istoria', roman:'V', illu:'acropolis', gr:'Ιστορία', en:'History', sub:'History',
      summary:{ gr:'Εξάσκηση με 7 τρόπους — flashcards έως timeline.', en:'Practice 7 ways — flashcards to timeline.' },
      games:[ g('Πολλαπλής Επιλογής','Multiple Choice','Quiz · 4 επιλογές','scroll'),
              g('Αντιστοίχιση','Matching','Match · pairs','trireme'),
              g('Κάρτες Μνήμης','Flashcards','Spaced repetition','amphora'),
              g('Χρονολόγιο','Timeline','Σύρε · σειρά','acropolis') ] },
  ],
  'gym-c': [
    { id:'eleni', roman:'III', illu:'masks', gr:'Ελένη', en:'Helen', sub:'Euripides · Helen',
      summary:{ gr:'Ευριπίδης — χαρακτήρες, δομή, θέματα τραγωδίας.', en:'Euripides — characters, structure, tragedy.' },
      games:[ g('Ζωφόρος Ελένης','Helen Frieze','Καμπάνια · 7 επεισόδια · διάλογοι','masks',{fn:'openEleniVoyage'}),
              g('Mythology Memory','Mythology Memory','Ζεύγη · δράμα','cards'),
              g('Rapid Fire','Rapid Fire','Speed quiz','cyclops-eye') ] },
    // ── Τραγωδίες/έπη Ευριπίδη as the black-figure "Ζωφόρος" voyage games:
    //    full campaign + dialogue-quizzes + content (window.VOYAGE), launched
    //    via open*Voyage (games/voyage/<slug>.html). Replaces the old
    //    coming-soon quiz tiles now that real content exists. ──
    { id:'troades', roman:'III', illu:'masks', gr:'Τρωάδες', en:'Trojan Women', sub:'Euripides · Trojan Women',
      summary:{ gr:'Ευριπίδης — ο θρήνος των αιχμαλώτων της Τροίας.', en:'Euripides — the lament of the captives of Troy.' },
      games:[ g('Ζωφόρος Τρωάδων','Trojan Women Frieze','Καμπάνια · 7 επεισόδια · διάλογοι','masks',{fn:'openTroadesVoyage'}),
              g('Mythology Memory','Mythology Memory','Ζεύγη · δράμα','cards'),
              g('Rapid Fire','Rapid Fire','Speed quiz','cyclops-eye') ] },
    { id:'alkistis', roman:'III', illu:'masks', gr:'Άλκηστις', en:'Alcestis', sub:'Euripides · Alcestis',
      summary:{ gr:'Ευριπίδης — η θυσία της Άλκηστης για τον Άδμητο.', en:'Euripides — Alcestis’ sacrifice for Admetus.' },
      games:[ g('Ζωφόρος Αλκήστιδος','Alcestis Frieze','Καμπάνια · 7 επεισόδια · διάλογοι','masks',{fn:'openAlkistisVoyage'}),
              g('Mythology Memory','Mythology Memory','Ζεύγη · δράμα','cards'),
              g('Rapid Fire','Rapid Fire','Speed quiz','cyclops-eye') ] },
    { id:'archaia-c', roman:'III', illu:'scroll', gr:'Αρχαία Ελληνικά', en:'Ancient Greek', sub:'Ancient Greek',
      summary:{ gr:'Σύνταξη, μετοχές και ανώμαλα ρήματα.', en:'Syntax, participles and irregular verbs.' },
      games:[ g('Κείμενα · Μεταφράσεις','Texts · Translations','Παράλληλο κείμενο · σύνταξη','scroll',{fn:'openParallelLesson',args:['texts-gym-c']}),
              g('Κλίση Ουσιαστικών','Noun Declension','200+ λέξεις','column',{fn:'openOusiastika'}),
              g('Επίθετα','Adjectives','Κλίση & συμφωνία','scroll',{fn:'openEpitheta'}),
              g('Παραθετικά','Adjective Degrees','10 επίπεδα','wreath',{fn:'openParatheta'}),
              g('Ξίφος Γραμματικού','Grammarian\u2019s Blade','Slice · τύποι','shield-spear') ] },
  ],
  'lyk-a': [
    { id:'archaia-thx', roman:'III', illu:'column', gr:'Αρχαία Ελληνικά', en:'Ancient Greek', sub:'Thucydides & prose',
      summary:{ gr:'Αττικός πεζός λόγος, σύνταξη και λεξιλόγιο.', en:'Attic prose, syntax and vocabulary.' },
      games:[ g('Κείμενα · Μεταφράσεις','Texts · Translations','Παράλληλο κείμενο · σύνταξη','scroll',{fn:'openParallelLesson',args:['texts-lyk-a']}),
              g('Κλίση Ουσιαστικών','Noun Declension','3 κλίσεις','column',{fn:'openOusiastika'}),
              g('Λύω','Learning to Decline','32 επίπεδα','scroll',{fn:'openLyo'}),
              g('Grammar Invaders','Grammar Invaders','Arcade','helmet'),
              g('Λαβύρινθος','Labyrinth','Maze · σύνταξη','labyrinth') ] },
    { id:'ekfrasi', roman:'IV', illu:'quill', gr:'Έκφραση · Έκθεση', en:'Composition', sub:'Modern Greek',
      summary:{ gr:'Κειμενικά είδη, επιχειρηματολογία και λεξιλόγιο.', en:'Text types, argumentation and vocabulary.' },
      games:[ gSoon('Λεξιλόγιο','Vocabulary','Κάρτες μνήμης · όροι','book'),
              g('Rapid Fire','Rapid Fire','Speed quiz','lightning-bolt') ] },
  ],
  'lyk-b': [
    { id:'rhetoric', roman:'IV', illu:'owl', gr:'Ρητορικά Κείμενα', en:'Rhetoric', sub:'Isocrates · Lysias',
      summary:{ gr:'Ρητορική τέχνη, δομή λόγου και ύφος.', en:'The art of rhetoric, structure and style.' },
      games:[ g('Κείμενα · Μεταφράσεις','Texts · Translations','Παράλληλο κείμενο · σύνταξη','scroll',{fn:'openParallelLesson',args:['texts-lyk-b']}),
              gSoon('Ανάλυση Λόγου','Speech Analysis','MC · δομή','owl'),
              g('Mythology Memory','Memory','Ζεύγη','cards'),
              g('Rapid Fire','Rapid Fire','Speed quiz','cyclops-eye') ] },
    { id:'latinika-b', roman:'VI', illu:'walls', gr:'Λατινικά', en:'Latin', sub:'Latin',
      summary:{ gr:'Κλίσεις, ρήματα και πρώτα κείμενα.', en:'Declensions, verbs and first texts.' },
      games:[ g('Κλίση Ουσιαστικών','Noun Declension','5 κλίσεις','column',{fn:'openLatNouns'}),
              g('Ανώμαλα Ρήματα','Irregular Verbs','possum · eo · fero','helmet',{fn:'openLatAnwmala'}),
              g('Επίθετα','Adjectives','Κλίση & βαθμοί','wreath',{fn:'openLatEpitheta'}) ] },
  ],
  'lyk-c': [
    { id:'archaia-kat', roman:'III', illu:'scroll', gr:'Αρχαία Κατεύθυνσης', en:'Ancient Greek (Advanced)', sub:'Authored corpus',
      summary:{ gr:'Διδαγμένο κείμενο, παράλληλη μετάφραση και σύνταξη.', en:'Seen text, parallel translation and syntax.' },
      games:[ g('Κείμενα · Μεταφράσεις','Texts · Translations','Παράλληλο κείμενο · σύνταξη','scroll',{fn:'openParallelLesson',args:['texts-lyk-c']}) ] },
    { id:'istoria-kat', roman:'V', illu:'acropolis', gr:'Ιστορία Κατεύθυνσης', en:'History (Advanced)', sub:'History',
      summary:{ gr:'Πανελλήνιες — πηγές, χρονολόγιο και ανάλυση.', en:'National exams — sources, timeline, analysis.' },
      games:[ g('Πολλαπλής Επιλογής','Multiple Choice','Quiz','scroll'),
              g('Κάρτες Μνήμης','Flashcards','Spaced repetition','amphora'),
              g('Χρονολόγιο','Timeline','Σύρε · σειρά','acropolis'),
              gSoon('Πηγές','Sources','Ανάλυση πηγών','book') ] },
    { id:'latinika-c', roman:'VI', illu:'walls', gr:'Λατινικά', en:'Latin', sub:'Latin · Advanced',
      summary:{ gr:'Κατεύθυνση — σύνταξη, κατάταξη και θεωρία.', en:'Advanced — syntax, classification and theory.' },
      games:[ g('Ανώμαλα Ρήματα','Irregular Verbs','possum · eo · fero','helmet',{fn:'openLatAnwmala'}),
              g('Κατάταξη Κειμένων','Text Sorting','Συντακτικό','scroll',{fn:'openLatKata'}),
              g('Επίθετα ανά Κείμενο','Adjectives by Text','Κλίση & βαθμοί','wreath',{fn:'openLatEpithetaKata'}),
              g('Θεωρία','Theory','Σημειώσεις · κανόνες','book',{fn:'openLatAnwmalaTheory'}) ] },
  ],
};

// ── Game-engine carousel (shared, bottom of page) ──
const ENGINES = [
  { gr:'Ιλιάδα Arcade', en:'Iliad Arcade', meta:{gr:'2D Arcade · Ιλιάδα',en:'2D Arcade · Iliad'}, illu:'sword' },
  { gr:'Οδύσσεια Arcade', en:'Odyssea Arcade', meta:{gr:'2D Arcade · Οδύσσεια',en:'2D Arcade · Odyssey'}, illu:'trireme' },
  { gr:'Agora Surfers', en:'Agora Surfers', meta:{gr:'Runner · Ιλιάδα / Οδύσσεια',en:'Runner · Iliad / Odyssey'}, illu:'runner' },
  { gr:'Rapid Fire', en:'Rapid Fire', meta:{gr:'Speed quiz · όλες οι ύλες',en:'Speed quiz · any material'}, illu:'lightning-bolt' },
  { gr:'Mythology Memory', en:'Mythology Memory', meta:{gr:'Ζεύγη καρτών · Μυθολογία',en:'Card pairs · Mythology'}, illu:'cards' },
  { gr:'Odyssey Journey 3D', en:'Odyssey Journey 3D', meta:{gr:'3D Adventure · Οδύσσεια',en:'3D Adventure · Odyssey'}, illu:'map' },
  { gr:'Χρονολόγιο', en:'Chronicle', meta:{gr:'Χρονική σειρά · γεγονότα',en:'Event ordering · timeline'}, illu:'timeline' },
  { gr:'Grammar Invaders', en:'Grammar Invaders', meta:{gr:'Action · Γραμματική',en:'Action · Grammar'}, illu:'invader' },
  { gr:'Φάλαγγα', en:'Phalanx', meta:{gr:'Strategy · turn-based',en:'Strategy · turn-based'}, illu:'shield-round' },
  { gr:'Ναυμαχία', en:'Naumachia', meta:{gr:'Naval · PvP',en:'Naval · PvP'}, illu:'trident' },
  { gr:'Ἑπτάπυλος', en:'Heptapylos', meta:{gr:'Connect Four · Στρατηγική',en:'Connect Four · Strategy'}, illu:'walls' },
  { gr:'Λαβύρινθος', en:'Labyrinth', meta:{gr:'Maze · Μυθολογία',en:'Maze · Mythology'}, illu:'labyrinth' },
  { gr:'Συμπόσιον', en:'Symposion', meta:{gr:'Επιτραπέζιο · 2–8 παίκτες',en:'Board game · 2–8 players'}, illu:'amphora' },
];

window.SYM = { STR, CLASSES, SUBJECTS, ENGINES, L };

/* ── GRAMMAR · THEORY tracks — a category alongside the grade tiers.
   Selected from the third class-chip row; each drills into subject blocks
   of grammar/theory games (verb tables, declensions, syntax). ── */
const GRAMMAR = [
  { id:'gram-archaia', glyph:'scroll', accent:'#C18A2C', gr:'Αρχαία', en:'Ancient Greek',
    blurb:{ gr:'Ρήματα, ονόματα και συντακτικό', en:'Verbs, nouns and syntax' } },
  { id:'gram-latin',   glyph:'column', accent:'#C96A45', gr:'Λατινικά', en:'Latin',
    blurb:{ gr:'Κλίσεις, ρήματα και θεωρία', en:'Declensions, verbs and theory' } },
  { id:'gram-neo',     glyph:'book',   accent:'#3E7E86', gr:'Έκθεση', en:'Composition',
    blurb:{ gr:'Γραμματική, έκφραση και ορθογραφία', en:'Grammar, composition and spelling' } },
];

Object.assign(SUBJECTS, {
  'gram-archaia': [
    // ── Ρήματα — every wired Greek verb game, explicit {fn} launches.
    //    Mirrors Ver1's gram-arch › Ρήματα (lyo featured + synirimmena,
    //    anwmala-rimata, klisi-rimaton, eimi, aoristos-b, rimata-mi,
    //    afwnolekta, pathitiko). ──
    { id:'ga-verbs', roman:'I', illu:'scroll', gr:'Ρήματα', en:'Verbs', sub:'Ancient Greek',
      summary:{ gr:'Κλίση, χρόνοι, εγκλίσεις και φωνές.', en:'Conjugation, tenses, moods and voices.' },
      games:[ g('Λύω','Learning to Decline','32 επίπεδα · ομαλό ρήμα','scroll',{fn:'openLyo'}),
              g('Κλίσις Ρημάτων','Verb Forms','εἶμι · φημί · οἶδα','column',{fn:'openKlisiRimaton'}),
              g('Κλίση εἰμί','Conjugation of εἰμί','«είμαι» · 3 χρόνοι','amphora',{fn:'openEimi'}),
              g('Συνηρημένα','Contract Verbs','τιμῶ · ποιῶ · δηλῶ','scroll',{fn:'openSynirimmena'}),
              g('Αόριστος Β΄','2nd Aorist','ἔλαβον · εἶδον','wreath',{fn:'openAoristosB'}),
              g('Ρήματα σε -μι','-mi Verbs','δίδωμι · τίθημι · ἵστημι','column',{fn:'openRimataMi'}),
              g('Αφωνόληκτα','Mute-ending Verbs','Μέλλ. · Αόρ. · Παρακ.','scroll',{fn:'openAfwnolekta'}),
              g('Παθητικό','Passive Future','Παθ. Μέλλ. & Αόριστος','amphora',{fn:'openPathitiko'}),
              g('Ανώμαλα Ρήματα','Irregular Verbs','Match · κλίση','wreath',{fn:'openAnwmalaRimata'}) ] },
    { id:'ga-nouns', roman:'II', illu:'column', gr:'Ονόματα & Επίθετα', en:'Nouns & Adjectives', sub:'Ancient Greek',
      summary:{ gr:'Οι τρεις κλίσεις, επίθετα και παραθετικά.', en:'The three declensions, adjectives and degrees.' },
      games:[ g('Κλίση Ουσιαστικών','Noun Declension','3 κλίσεις · 200+ λέξεις','column',{fn:'openOusiastika'}),
              g('Συμπλήρωση Κατάληξης','Noun Fill-in','Α΄ & Β΄ κλίση · καταλήξεις','column',{fn:'openNounFill'}),
              g('Επίθετα','Adjectives','Κλίση & συμφωνία','scroll',{fn:'openEpitheta'}),
              g('Παραθετικά','Adjective Degrees','10 επίπεδα','wreath',{fn:'openParatheta'}),
              g('Αντωνυμίες','Pronouns','Match · τύποι','amphora',{fn:'openAntonymies'}) ] },
    { id:'ga-syntax', roman:'III', illu:'labyrinth', gr:'Συντακτικό', en:'Syntax', sub:'Ancient Greek',
      summary:{ gr:'Πτώσεις, μετοχές και δευτερεύουσες προτάσεις.', en:'Cases, participles and subordinate clauses.' },
      games:[ gSoon('Πτώσεις & Λειτουργίες','Cases & Functions','Σύνταξη · ρόλοι','scroll'),
              gSoon('Μετοχές','Participles','Επιθετική / επιρρηματική','column'),
              gSoon('Δευτερεύουσες Προτάσεις','Clauses','Maze · σύνταξη','labyrinth') ] },
  ],
  'gram-latin': [
    // ── Latin grammar — explicit {fn} launches for every wired Latin game.
    //    Mirrors Ver1's gram-lat (lat-nouns/-epitheta/-antonymies/-verbs/
    //    -anwmala + per-text -kata variants). ──
    { id:'gl-decl', roman:'I', illu:'column', gr:'Κλίσεις', en:'Declensions', sub:'Latin',
      summary:{ gr:'Πέντε κλίσεις ουσιαστικών, επίθετα, αντωνυμίες.', en:'Five noun declensions, adjectives, pronouns.' },
      games:[ g('Κλίση Ουσιαστικών','Noun Declension','5 κλίσεις · rosa, dominus','column',{fn:'openLatNouns'}),
              g('Επίθετα','Adjectives','Κλίση & βαθμοί','wreath',{fn:'openLatEpitheta'}),
              g('Αντωνυμίες','Pronouns','hic · ille · is','scroll',{fn:'openLatAntonymies'}) ] },
    { id:'gl-verbs', roman:'II', illu:'helmet', gr:'Ρήματα', en:'Verbs', sub:'Latin',
      summary:{ gr:'Συζυγίες, ανώμαλα ρήματα και χρόνοι.', en:'Conjugations, irregular verbs and tenses.' },
      games:[ g('Κλίση Ρημάτων','Verb Forms','4 συζυγίες · ενεργ. & παθ.','column',{fn:'openLatVerbs'}),
              g('Ανώμαλα Ρήματα','Irregular Verbs','possum · eo · fero','helmet',{fn:'openLatAnwmala'}) ] },
    { id:'gl-theory', roman:'III', illu:'book', gr:'Θεωρία & Κείμενα', en:'Theory & Texts', sub:'Latin',
      summary:{ gr:'Κατάταξη ανά κείμενο, ουσιαστικά, επίθετα και θεωρία.', en:'Per-text sorting, nouns, adjectives and theory.' },
      games:[ g('Κατάταξη Κειμένων','Text Sorting','Ρήματα ανά κείμενο','scroll',{fn:'openLatKata'}),
              g('Ουσιαστικά ανά Κείμενο','Nouns by Text','Κλίση ανά κείμενο','column',{fn:'openLatNounsKata'}),
              g('Επίθετα ανά Κείμενο','Adjectives by Text','Κλίση & βαθμοί ανά κείμενο','wreath',{fn:'openLatEpithetaKata'}),
              g('Θεωρία','Theory','Σημειώσεις · κανόνες','book',{fn:'openLatAnwmalaTheory'}) ] },
  ],
  'gram-neo': [
    { id:'gn-gram', roman:'I', illu:'book', gr:'Γραμματική', en:'Grammar', sub:'Modern Greek',
      summary:{ gr:'Μέρη του λόγου, κλίσεις και ρήματα.', en:'Parts of speech, declension and verbs.' },
      games:[ gSoon('Μέρη του Λόγου','Parts of Speech','Match · κατηγορίες','scroll'),
              gSoon('Κλίσεις','Declensions','Ουσιαστικά & επίθετα','column'),
              gSoon('Ρήματα & Χρόνοι','Verbs & Tenses','Φωνές · εγκλίσεις','wreath') ] },
    { id:'gn-express', roman:'II', illu:'owl', gr:'Έκφραση · Έκθεση', en:'Composition', sub:'Modern Greek',
      summary:{ gr:'Λεξιλόγιο, κειμενικά είδη και επιχειρηματολογία.', en:'Vocabulary, text types and argumentation.' },
      games:[ gSoon('Λεξιλόγιο','Vocabulary','Match · όροι','book'),
              gSoon('Κειμενικά Είδη','Text Types','Άρθρο · δοκίμιο · επιστολή','scroll'),
              gSoon('Επιχειρηματολογία','Argumentation','Δομή · θέση','owl') ] },
    { id:'gn-spell', roman:'III', illu:'cipher', gr:'Ορθογραφία', en:'Spelling', sub:'Modern Greek',
      summary:{ gr:'Τόνοι, ομόηχα, παραγωγή και σύνθεση.', en:'Accents, homophones, derivation and compounds.' },
      games:[ gSoon('Τόνοι & Σημεία','Accents & Marks','Cipher · κανόνες','cipher'),
              gSoon('Ομόηχα','Homophones','Match · ζεύγη','amphora'),
              gSoon('Παραγωγή & Σύνθεση','Derivation','Maze · λέξεις','labyrinth') ] },
  ],
});

window.SYM.GRAMMAR = GRAMMAR;
window.SYM.CLASS_GROUPS = [
  { id:'gym',  label:{ gr:'Γυμνάσιο', en:'Gymnasio' }, ids:['gym-a','gym-b','gym-c'] },
  { id:'lyk',  label:{ gr:'Λύκειο',   en:'Lykeio'   }, ids:['lyk-a','lyk-b','lyk-c'] },
  { id:'gram', label:{ gr:'Γραμματική · Θεωρία', en:'Grammar · Theory' }, ids:['gram-archaia','gram-latin','gram-neo'], grammar:true },
];
// short labels for grouped grade chips (group header carries Γυμνάσιο/Λύκειο)
CLASSES.forEach(c => { c.short = { 'gym-a':'Α΄','gym-b':'Β΄','gym-c':'Γ΄','lyk-a':'Α΄','lyk-b':'Β΄','lyk-c':'Γ΄' }[c.id] || L(c); });
window.SYM.classById = (id) => CLASSES.concat(GRAMMAR).find(c => c.id === id);

/* ── Hero avatars — level-gated profile seals (mirrors hero-avatars.js).
   3 categories · classical line-art icon as the seal. ── */
window.SYM.AVATARS = [
  // Μυθολογία
  { id:'av-athena',   cat:'myth', illu:'owl',            gr:'Αθηνά',     en:'Athena',    lv:1 },
  { id:'av-apollo',   cat:'myth', illu:'lyre',           gr:'Απόλλων',   en:'Apollo',    lv:2 },
  { id:'av-artemis',  cat:'myth', illu:'bow',            gr:'Άρτεμις',   en:'Artemis',   lv:3 },
  { id:'av-hermes',   cat:'myth', illu:'crown-laurel',   gr:'Ερμής',     en:'Hermes',    lv:4 },
  { id:'av-poseidon', cat:'myth', illu:'trident',        gr:'Ποσειδών',  en:'Poseidon',  lv:6 },
  { id:'av-medusa',   cat:'myth', illu:'snake',          gr:'Μέδουσα',   en:'Medusa',    lv:10 },
  { id:'av-pegasus',  cat:'myth', illu:'horse',          gr:'Πήγασος',   en:'Pegasus',   lv:14 },
  { id:'av-zeus',     cat:'myth', illu:'lightning-bolt', gr:'Δίας',      en:'Zeus',      lv:25 },
  // Ιστορία
  { id:'av-socrates', cat:'history', illu:'goddess',     gr:'Σωκράτης',  en:'Socrates',  lv:1 },
  { id:'av-homer',    cat:'history', illu:'scroll',      gr:'Όμηρος',    en:'Homer',     lv:2 },
  { id:'av-plato',    cat:'history', illu:'book',        gr:'Πλάτων',    en:'Plato',     lv:3 },
  { id:'av-pythagoras',cat:'history',illu:'puzzle',      gr:'Πυθαγόρας', en:'Pythagoras',lv:6 },
  { id:'av-sappho',   cat:'history', illu:'quill-feather',gr:'Σαπφώ',    en:'Sappho',    lv:8 },
  { id:'av-archimedes',cat:'history',illu:'scales',      gr:'Αρχιμήδης', en:'Archimedes',lv:16 },
  { id:'av-leonidas', cat:'history', illu:'shield-lion', gr:'Λεωνίδας',  en:'Leonidas',  lv:20 },
  { id:'av-alexander',cat:'history', illu:'crown',       gr:'Αλέξανδρος',en:'Alexander', lv:25 },
  // Ρωμαϊκά
  { id:'av-legionary',cat:'roman', illu:'shield-round',  gr:'Λεγεωνάριος',en:'Legionary',lv:1 },
  { id:'av-wolf',     cat:'roman', illu:'eagle',         gr:'Λύκαινα',   en:'She-Wolf',  lv:2 },
  { id:'av-centurion',cat:'roman', illu:'helmet',        gr:'Εκατόνταρχος',en:'Centurion',lv:6 },
  { id:'av-colosseum',cat:'roman', illu:'building',      gr:'Κολοσσαίο', en:'Colosseum', lv:10 },
  { id:'av-mars',     cat:'roman', illu:'crossed-spears',gr:'Άρης',      en:'Mars',      lv:12 },
  { id:'av-aquila',   cat:'roman', illu:'eagle',         gr:'Αετός SPQR',en:'Aquila',    lv:16 },
  { id:'av-caesar',   cat:'roman', illu:'wreath-laurel', gr:'Καίσαρ',    en:'Caesar',    lv:25 },
  // ── expanded roster ──────────────────────────────────────────────
  // Μυθολογία
  { id:'av-hera',       cat:'myth', illu:'crown',         gr:'Ήρα',        en:'Hera',        lv:5 },
  { id:'av-aphrodite',  cat:'myth', illu:'olive-branch',  gr:'Αφροδίτη',   en:'Aphrodite',   lv:4 },
  { id:'av-hephaestus', cat:'myth', illu:'flame',         gr:'Ήφαιστος',   en:'Hephaestus',  lv:7 },
  { id:'av-ares',       cat:'myth', illu:'crossed-spears',gr:'Άρης',       en:'Ares',        lv:8 },
  { id:'av-demeter',    cat:'myth', illu:'olive-tree',    gr:'Δήμητρα',    en:'Demeter',     lv:6 },
  { id:'av-dionysus',   cat:'myth', illu:'amphora',       gr:'Διόνυσος',   en:'Dionysus',    lv:5 },
  { id:'av-hestia',     cat:'myth', illu:'torch',         gr:'Εστία',      en:'Hestia',      lv:3 },
  { id:'av-hades',      cat:'myth', illu:'labyrinth',     gr:'Άδης',       en:'Hades',       lv:15 },
  { id:'av-persephone', cat:'myth', illu:'wreath',        gr:'Περσεφόνη',  en:'Persephone',  lv:9 },
  { id:'av-atlas',      cat:'myth', illu:'world',         gr:'Άτλας',      en:'Atlas',       lv:11 },
  { id:'av-heracles',   cat:'myth', illu:'shield-lion',   gr:'Ηρακλής',    en:'Heracles',    lv:16 },
  { id:'av-perseus',    cat:'myth', illu:'sword',         gr:'Περσέας',    en:'Perseus',     lv:10 },
  { id:'av-theseus',    cat:'myth', illu:'labyrinth',     gr:'Θησέας',     en:'Theseus',     lv:12 },
  { id:'av-odysseus',   cat:'myth', illu:'trireme',       gr:'Οδυσσέας',   en:'Odysseus',    lv:9 },
  { id:'av-achilles',   cat:'myth', illu:'shield-round',  gr:'Αχιλλέας',   en:'Achilles',    lv:14 },
  { id:'av-hector',     cat:'myth', illu:'helmet',        gr:'Έκτωρ',      en:'Hector',      lv:13 },
  // Ιστορία
  { id:'av-aristotle',  cat:'history', illu:'brain',        gr:'Αριστοτέλης',  en:'Aristotle',   lv:4 },
  { id:'av-herodotus',  cat:'history', illu:'map',          gr:'Ηρόδοτος',     en:'Herodotus',   lv:5 },
  { id:'av-thucydides', cat:'history', illu:'scroll',       gr:'Θουκυδίδης',   en:'Thucydides',  lv:6 },
  { id:'av-pericles',   cat:'history', illu:'acropolis',    gr:'Περικλής',     en:'Pericles',    lv:8 },
  { id:'av-solon',      cat:'history', illu:'tablet',       gr:'Σόλων',        en:'Solon',       lv:6 },
  { id:'av-demosthenes',cat:'history', illu:'speech',       gr:'Δημοσθένης',   en:'Demosthenes', lv:7 },
  { id:'av-euclid',     cat:'history', illu:'compass',      gr:'Ευκλείδης',    en:'Euclid',      lv:6 },
  { id:'av-hippocrates',cat:'history', illu:'olive-branch', gr:'Ιπποκράτης',   en:'Hippocrates', lv:7 },
  { id:'av-diogenes',   cat:'history', illu:'amphora',      gr:'Διογένης',     en:'Diogenes',    lv:5 },
  { id:'av-cleopatra',  cat:'history', illu:'crown',        gr:'Κλεοπάτρα',    en:'Cleopatra',   lv:10 },
  { id:'av-aspasia',    cat:'history', illu:'quill-feather',gr:'Ασπασία',      en:'Aspasia',     lv:6 },
  { id:'av-xenophon',   cat:'history', illu:'horse',        gr:'Ξενοφών',      en:'Xenophon',    lv:7 },
  { id:'av-thales',     cat:'history', illu:'scales',       gr:'Θαλής',        en:'Thales',      lv:5 },
  { id:'av-pindar',     cat:'history', illu:'lyre',         gr:'Πίνδαρος',     en:'Pindar',      lv:6 },
  // Ρωμαϊκά
  { id:'av-romulus',    cat:'roman', illu:'sword',          gr:'Ρωμύλος',      en:'Romulus',     lv:8 },
  { id:'av-augustus',   cat:'roman', illu:'wreath-laurel',  gr:'Αύγουστος',    en:'Augustus',    lv:12 },
  { id:'av-cicero',     cat:'roman', illu:'speech',         gr:'Κικέρων',      en:'Cicero',      lv:7 },
  { id:'av-virgil',     cat:'roman', illu:'book',           gr:'Βιργίλιος',    en:'Virgil',      lv:6 },
  { id:'av-trajan',     cat:'roman', illu:'crossed-spears', gr:'Τραϊανός',     en:'Trajan',      lv:14 },
  { id:'av-spartacus',  cat:'roman', illu:'sword',          gr:'Σπάρτακος',    en:'Spartacus',   lv:10 },
  { id:'av-horace',     cat:'roman', illu:'scroll',         gr:'Οράτιος',      en:'Horace',      lv:5 },
  { id:'av-constantine',cat:'roman', illu:'shield-round',   gr:'Κωνσταντίνος', en:'Constantine', lv:16 },
  { id:'av-hannibal',   cat:'roman', illu:'shield-lion',    gr:'Αννίβας',      en:'Hannibal',    lv:13 },
  { id:'av-nero',       cat:'roman', illu:'flame',          gr:'Νέρων',        en:'Nero',        lv:12 },
  { id:'av-marcus',     cat:'roman', illu:'book',           gr:'Μάρκος Αυρήλιος', en:'Marcus Aurelius', lv:15 },
  { id:'av-cincinnatus',cat:'roman', illu:'olive-tree',     gr:'Κιγκιννάτος',  en:'Cincinnatus', lv:9 },
];
window.SYM.AVATAR_CATS = [ {k:'myth',t:{gr:'Μυθολογία',en:'Myth'}}, {k:'history',t:{gr:'Ιστορία',en:'History'}}, {k:'roman',t:{gr:'Ρωμαϊκά',en:'Roman'}} ];

/* ── Hero titles — level-earned ranks (mirrors progression titles) ── */
window.SYM.TITLES = [
  { id:'t-neophyte', gr:'Νεόφυτος',          en:'Neophyte',           lv:1 },
  { id:'t-student',  gr:'Μαθητὴς τῆς Ἀγορᾶς',en:'Student of the Agora',lv:3 },
  { id:'t-rhetor',   gr:'Ρήτωρ τῆς Ἀγορᾶς',  en:'Orator of the Agora', lv:6 },
  { id:'t-scholar',  gr:'Φιλόλογος',         en:'Philologist',         lv:10 },
  { id:'t-strategos',gr:'Στρατηγός',         en:'Strategos',           lv:14 },
  { id:'t-sophos',   gr:'Σοφός',             en:'The Wise',            lv:18 },
  { id:'t-mythhero', gr:'Ἥρως τῶν Μύθων',    en:'Hero of Myth',        lv:22 },
  { id:'t-olympian', gr:'Ὀλύμπιος',          en:'Olympian',            lv:30 },
];

/* ── Rolling subject marquee (from carousel.js CAROUSEL_SUBJECTS) ── */
window.SYM.CAROUSEL = [
  { gr:'Ιλιάδα',        en:'Iliad · Ομήρου Ιλιάς',        illu:'sword',         accent:'#D97B5C', meta:'Β΄ ΓΥΜΝΑΣΙΟΥ · 8 ΠΑΙΧΝΙΔΙΑ', cls:'gym-b' },
  { gr:'Οδύσσεια',      en:'Odyssey · Ομήρου Οδύσσεια',   illu:'ship-prow',     accent:'#4E8A99', meta:'Α΄ ΓΥΜΝΑΣΙΟΥ · 6 ΠΑΙΧΝΙΔΙΑ', cls:'gym-a' },
  { gr:'Ελένη',         en:'Helen · Ευριπίδη Ελένη',      illu:'theatre',       accent:'#7A2E33', meta:'Γ΄ ΓΥΜΝΑΣΙΟΥ · 8 ΠΑΙΧΝΙΔΙΑ', cls:'gym-c' },
  { gr:'Αντιγόνη',      en:'Antigone · Σοφοκλή',          illu:'crown-laurel',  accent:'#7A2E33', meta:'Β΄ ΛΥΚΕΙΟΥ · 6 ΠΑΙΧΝΙΔΙΑ',  cls:'lyk-b' },
  { gr:'Αρχαία Α΄',     en:'Ancient Greek · Α΄ Γυμνασίου',illu:'tablet',        accent:'#C4A448', meta:'Α΄ ΓΥΜΝΑΣΙΟΥ · 5 ΠΑΙΧΝΙΔΙΑ', cls:'gym-a' },
  { gr:'Αρχαία Γ΄',     en:'Ancient Greek · Γ΄ Γυμνασίου',illu:'quill-feather', accent:'#C4A448', meta:'Γ΄ ΓΥΜΝΑΣΙΟΥ · 5 ΠΑΙΧΝΙΔΙΑ', cls:'gym-c' },
  { gr:'Λατινικά Β΄',   en:'Latin · Β΄ Λυκείου',          illu:'trident',       accent:'#C96A45', meta:'Β΄ ΛΥΚΕΙΟΥ · 5 ΠΑΙΧΝΙΔΙΑ',  cls:'lyk-b' },
  { gr:'Λατινικά Γ΄',   en:'Latin · Γ΄ Λυκείου',          illu:'trident',       accent:'#C96A45', meta:'Γ΄ ΛΥΚΕΙΟΥ · 5 ΠΑΙΧΝΙΔΙΑ',  cls:'lyk-c' },
  { gr:'Γραμματική',    en:'Grammar · Αρχαία Ελληνικά',   illu:'column',        accent:'#C4A448', meta:'ΓΡΑΜΜΑΤΙΚΗ · 12 ΑΣΚΗΣΕΙΣ',  cls:'gym-b' },
  { gr:'Ιστορία',       en:'History · Γυμνάσιο',          illu:'coin',          accent:'#7E8C4A', meta:'ΓΥΜΝΑΣΙΟ · 4 ΠΑΙΧΝΙΔΙΑ',    cls:'gym-a' },
  { gr:'Νέα Ελληνικά',  en:'Modern Greek · Grammar',      illu:'owl',           accent:'#6FB0BE', meta:'ΓΡΑΜΜΑΤΙΚΗ · 6 ΑΣΚΗΣΕΙΣ',   cls:'lyk-a' },
];

/* ── Multiplayer / Live-Arena games (loaded "from the Game Panel") ── */
window.SYM.MPGAMES = [
  { id:'krypteia',     illu:'cyclops-eye',  gr:'Κρυπτεία',           en:'Krypteia' },
  { id:'halieia',      illu:'fish',         gr:'Αλιεία',             en:'Halieia' },
  { id:'hegemonia',    illu:'crossed-spears', gr:'Ηγεμονία',         en:'Hegemonia' },
  { id:'battle-royale',illu:'crossed-spears', gr:'Battle Royale',    en:'Battle Royale' },
  { id:'golden-fleece',illu:'trophy',       gr:'Χρυσόμαλλο Δέρας',   en:'Golden Fleece' },
  { id:'tow',          illu:'rope',         gr:'Διελκυστίνδα',       en:'Tug of War' },
];

/* ── Rotating classical-studies trivia (hero spec card ticker) ──
   Only facts — sciences · drama & arts · history (no live counts). */
window.SYM.TRIVIA = [
  { tag:{gr:'Επιστήμη',en:'Science'}, gr:'Ο Ερατοσθένης μέτρησε την περίμετρο της Γης γύρω στο 240 π.Χ.', en:'Eratosthenes measured Earth’s circumference around 240 BC.' },
  { tag:{gr:'Επιστήμη',en:'Science'}, gr:'Ο Αρίσταρχος πρότεινε ηλιοκεντρικό σύστημα 18 αιώνες πριν τον Κοπέρνικο.', en:'Aristarchus proposed a heliocentric system 18 centuries before Copernicus.' },
  { tag:{gr:'Επιστήμη',en:'Science'}, gr:'Ο Αρχιμήδης όρισε την άνωση — «εὕρηκα!».', en:'Archimedes defined buoyancy — “Eureka!”.' },
  { tag:{gr:'Επιστήμη',en:'Science'}, gr:'Ο Ιπποκράτης θεωρείται πατέρας της ιατρικής.', en:'Hippocrates is considered the father of medicine.' },
  { tag:{gr:'Δράμα',en:'Drama'}, gr:'Το Θέατρο του Διονύσου χωρούσε ως 17.000 θεατές.', en:'The Theatre of Dionysus seated up to 17,000.' },
  { tag:{gr:'Δράμα',en:'Drama'}, gr:'Στην τραγωδία έπαιζαν το πολύ τρεις ηθοποιοί — όλοι άντρες.', en:'Greek tragedy used at most three actors — all men.' },
  { tag:{gr:'Δράμα',en:'Drama'}, gr:'Ο Αισχύλος πρόσθεσε τον δεύτερο ηθοποιό· ο Σοφοκλής τον τρίτο.', en:'Aeschylus added the second actor; Sophocles the third.' },
  { tag:{gr:'Τέχνες',en:'Arts'}, gr:'Οι κίονες του Παρθενώνα καμπυλώνουν ελαφρά (έντασις) για οπτική τελειότητα.', en:'The Parthenon’s columns curve slightly (entasis) for visual perfection.' },
  { tag:{gr:'Τέχνες',en:'Arts'}, gr:'Ο Πολύκλειτος έγραψε τον «Κανόνα» των ιδανικών αναλογιών.', en:'Polykleitos wrote the “Canon” of ideal proportions.' },
  { tag:{gr:'Ιστορία',en:'History'}, gr:'Η δημοκρατία γεννήθηκε στην Αθήνα γύρω στο 508 π.Χ.', en:'Democracy was born in Athens around 508 BC.' },
  { tag:{gr:'Ιστορία',en:'History'}, gr:'Οι Ολυμπιακοί Αγώνες ξεκίνησαν το 776 π.Χ.', en:'The Olympic Games began in 776 BC.' },
  { tag:{gr:'Ιστορία',en:'History'}, gr:'Η Βιβλιοθήκη της Αλεξάνδρειας φιλοδοξούσε να συγκεντρώσει κάθε βιβλίο.', en:'The Library of Alexandria aimed to hold every book ever written.' },
];

/* ── Hero showcase feed — game modes & news, slow rotation, Try-now ── */
window.SYM.SHOWCASE = [
  { kind:'mode', illu:'lightning-bolt', t:{gr:'Rapid Fire',en:'Rapid Fire'}, d:{gr:'Γρήγορες ερωτήσεις, τρεις ζωές — όλη η ύλη.',en:'Fast questions, three lives — any material.'} },
  { kind:'mode', illu:'rope',          t:{gr:'Διελκυστίνδα',en:'Tug of War'}, d:{gr:'1v1 ή ομάδες — τράβα τη γραμμή με σωστές απαντήσεις.',en:'1v1 or teams — pull the line with right answers.'} },
  { kind:'mode', illu:'trireme',       t:{gr:'Odyssey 3D',en:'Odyssey 3D'}, d:{gr:'Ταξίδεψε στα νησιά της Μεσογείου του Οδυσσέα.',en:'Sail the Mediterranean islands of Odysseus.'} },
  { kind:'news', illu:'shield-round',  t:{gr:'Νέο: Φάλαγγα',en:'New: Phalanx'}, d:{gr:'Στρατηγικό, βήμα-βήμα επιτραπέζιο — τώρα live.',en:'Turn-based strategy board game — now live.'} },
  { kind:'mode', illu:'cards',         t:{gr:'Mythology Memory',en:'Mythology Memory'}, d:{gr:'Ταίριαξε ήρωες, θεούς και σύμβολα.',en:'Match heroes, gods and symbols.'} },
  { kind:'news', illu:'crown-laurel',  t:{gr:'Εποχιακό event',en:'Seasonal event'}, d:{gr:'Διπλό Kleos στον Ναό των Μουσών αυτή την εβδομάδα.',en:'Double Kleos in the Temple this week.'} },
];

/* ── Honorary Titles · Τίτλοι — earned epithets you wear; the worn one
   shows on your altar, profile and beside your avatar in the nav. ── */
window.SYM.TITLES = window.SYM_TITLES = [
  { id:'t-neophyte',  rank:'I',    gr:'Νεόφυτος',   en:'Neophyte',   price:0,    note:{gr:'Κάθε ταξίδι ξεκινά εδώ.',en:'Every journey starts here.'} },
  { id:'t-athlete',   rank:'II',   gr:'Ἀθλητής',    en:'Athlete',    price:600,  note:{gr:'Για τους ακούραστους παίκτες.',en:'For the tireless competitor.'} },
  { id:'t-rhapsode',  rank:'III',  gr:'Ῥαψῳδός',    en:'Rhapsode',   price:1000, note:{gr:'Ξέρεις τα έπη απ’ έξω.',en:'You know the epics by heart.'} },
  { id:'t-sage',      rank:'IV',   gr:'Σοφός',      en:'Sage',       price:1400, note:{gr:'Η γνώση είναι το έπαθλό σου.',en:'Knowledge is your prize.'} },
  { id:'t-strategos', rank:'V',    gr:'Στρατηγός',  en:'Strategist', price:1800, note:{gr:'Νικάς με σχέδιο, όχι τύχη.',en:'You win by plan, not luck.'} },
  { id:'t-victor',    rank:'VI',   gr:'Νικητής',    en:'Victor',     price:2400, note:{gr:'Στεφανωμένος με δάφνη.',en:'Crowned with laurel.'} },
  { id:'t-hero',      rank:'VII',  gr:'Ἥρως',       en:'Hero',       price:3000, note:{gr:'Τα κατορθώματά σου τραγουδιούνται.',en:'Your deeds are sung.'} },
  { id:'t-olympian',  rank:'VIII', gr:'Ὀλύμπιος',   en:'Olympian',   price:4000, note:{gr:'Ανάμεσα στους αθανάτους.',en:'Among the immortals.'} },
  /* — Μυθολογία — */
  { id:'t-titan',     rank:'IX',   gr:'Τιτάν',          en:'Titan',            price:4400, note:{gr:'Πρωτόγονη δύναμη.',en:'Primordial might.'} },
  { id:'t-mystes',    rank:'X',    gr:'Μύστης',         en:'The Initiate',     price:4600, note:{gr:'Μυημένος στα μυστήρια.',en:'Initiate of the mysteries.'} },
  { id:'t-hemitheos', rank:'XI',   gr:'Ἡμίθεος',        en:'Demigod',          price:4800, note:{gr:'Μισός θνητός, μισός θεός.',en:'Half mortal, half god.'} },
  { id:'t-argonaut',  rank:'XII',  gr:'Ἀργοναύτης',     en:'Argonaut',         price:5000, note:{gr:'Κυνηγός του χρυσόμαλλου δέρατος.',en:'Seeker of the Golden Fleece.'} },
  { id:'t-mousagetes',rank:'XIII', gr:'Μουσαγέτης',     en:'Leader of Muses',  price:5200, note:{gr:'Οδηγός των εννέα Μουσών.',en:'Guide of the nine Muses.'} },
  { id:'t-promachos', rank:'XIV',  gr:'Πρόμαχος',       en:'Champion-at-Arms', price:5400, note:{gr:'Πρώτος στη μάχη.',en:'First into battle.'} },
  { id:'t-aigiochos', rank:'XV',   gr:'Αἰγίοχος',       en:'Aegis-Bearer',     price:5600, note:{gr:'Κρατά την ασπίδα της Αθηνάς.',en:'Wielder of Athena\u2019s aegis.'} },
  { id:'t-keraunios', rank:'XVI',  gr:'Κεραύνιος',      en:'The Thunderer',    price:5800, note:{gr:'Ρίχνει κεραυνούς σαν τον Δία.',en:'Hurls bolts like Zeus.'} },
  /* — Ἀρχαία Ἑλλάς — */
  { id:'t-polites',   rank:'XVII', gr:'Πολίτης',        en:'Citizen',          price:4400, note:{gr:'Μέλος της πόλεως.',en:'Member of the polis.'} },
  { id:'t-strathenon',rank:'XVIII',gr:'Στρατηγός Ἀθηνῶν',en:'Strategos of Athens',price:4700, note:{gr:'Διοικητής του στρατού.',en:'Commander of the host.'} },
  { id:'t-archon',    rank:'XIX',  gr:'Ἄρχων',          en:'Archon',           price:5000, note:{gr:'Άρχοντας της πόλης.',en:'Ruler of the city.'} },
  { id:'t-rhetor',    rank:'XX',   gr:'Ῥήτωρ',          en:'Orator',           price:5200, note:{gr:'Κυρίαρχος του λόγου.',en:'Master of the word.'} },
  { id:'t-philosophos',rank:'XXI', gr:'Φιλόσοφος',      en:'Philosopher',      price:5400, note:{gr:'Εραστής της σοφίας.',en:'Lover of wisdom.'} },
  { id:'t-olympionikis',rank:'XXII',gr:'Ὀλυμπιονίκης',  en:'Olympic Victor',   price:5600, note:{gr:'Στεφανωμένος στην Ολυμπία.',en:'Crowned at Olympia.'} },
  { id:'t-nomothetes',rank:'XXIII',gr:'Νομοθέτης',      en:'Lawgiver',         price:5800, note:{gr:'Σαν τον Σόλωνα.',en:'In the manner of Solon.'} },
  { id:'t-stratelates',rank:'XXIV',gr:'Στρατηλάτης',    en:'Warlord',          price:6000, note:{gr:'Οδηγεί στρατιές στη νίκη.',en:'Leads armies to victory.'} },
  /* — Βυζάντιο — */
  { id:'t-porphyro',  rank:'XXV',  gr:'Πορφυρογέννητος',en:'Born to the Purple',price:6200, note:{gr:'Γεννημένος στην πορφύρα.',en:'Born in the purple chamber.'} },
  { id:'t-despotes',  rank:'XXVI', gr:'Δεσπότης',       en:'Despot',           price:6400, note:{gr:'Άρχοντας επαρχίας.',en:'Lord of a province.'} },
  { id:'t-sebastos',  rank:'XXVII',gr:'Σεβαστός',       en:'Sebastos',         price:6600, note:{gr:'Τιμημένος αξιωματούχος.',en:'An honoured dignitary.'} },
  { id:'t-protospath',rank:'XXVIII',gr:'Πρωτοσπαθάριος',en:'Protospatharios', price:6800, note:{gr:'Πρώτος των σπαθαρίων.',en:'First of the guard.'} },
  { id:'t-megasdoux', rank:'XXIX', gr:'Μέγας Δούξ',     en:'Grand Duke',       price:7000, note:{gr:'Ναύαρχος του στόλου.',en:'Admiral of the fleet.'} },
  { id:'t-basileus',  rank:'XXX',  gr:'Βασιλεύς',       en:'Basileus',         price:7400, note:{gr:'Αυτοκράτωρ Ρωμαίων.',en:'Emperor of the Romans.'} },
  { id:'t-isapostolos',rank:'XXXI',gr:'Ἰσαπόστολος',    en:'Equal-to-Apostles',price:7600, note:{gr:'Σαν τον Μέγα Κωνσταντίνο.',en:'Like Constantine the Great.'} },
  { id:'t-autokrator',rank:'XXXII',gr:'Αὐτοκράτωρ',     en:'Autokrator',       price:8000, note:{gr:'Απόλυτος μονάρχης.',en:'Sovereign of all.'} },
  /* — Νεωτέρα Ἑλλάς — */
  { id:'t-klephtis',  rank:'XXXIII',gr:'Κλέφτης',       en:'Klepht',           price:4400, note:{gr:'Ελεύθερος των βουνών.',en:'Free man of the mountains.'} },
  { id:'t-armatolos', rank:'XXXIV',gr:'Ἀρματολός',      en:'Armatolos',        price:4600, note:{gr:'Φύλακας των περασμάτων.',en:'Warden of the passes.'} },
  { id:'t-agonistis', rank:'XXXV', gr:'Ἀγωνιστής',      en:'Freedom Fighter',  price:4800, note:{gr:'Του ’21.',en:'Of 1821.'} },
  { id:'t-ethnarchis',rank:'XXXVI',gr:'Ἐθνάρχης',       en:'Ethnarch',         price:5200, note:{gr:'Ηγέτης του έθνους.',en:'Leader of the nation.'} },
  { id:'t-navarchos', rank:'XXXVII',gr:'Ναύαρχος',      en:'Admiral',          price:5400, note:{gr:'Σαν τον Μιαούλη.',en:'In the wake of Miaoulis.'} },
  { id:'t-didaskalos',rank:'XXXVIII',gr:'Διδάσκαλος τοῦ Γένους',en:'Teacher of the Nation',price:5600, note:{gr:'Κράτησε ζωντανή τη γλώσσα.',en:'Kept the language alive.'} },
  { id:'t-protathlitis',rank:'XXXIX',gr:'Πρωταθλητής',  en:'Champion',         price:5800, note:{gr:'Πρώτος ανάμεσα στους πρώτους.',en:'First among the first.'} },
  { id:'t-athanatos', rank:'XL',   gr:'Ἀθάνατος',       en:'The Immortal',     price:9000, note:{gr:'Το όνομά σου δεν θα σβήσει ποτέ.',en:'Your name shall never fade.'} },
];

/* ── ACHIEVEMENTS · Τρόπαια — generated across every class, subject and
   game mode (100+). cat groups them for the medals filter. ── */
window.SYM.ACHIEVEMENTS = (function () {
  const out = [];
  const slug = s => String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  // Real per-user achievement progress. A brand-new user has earned nothing,
  // so every medal starts at val:0 (no "lived-in" demo progress). Saved
  // progress is read back from SymStore('ach_progress') keyed by achievement id
  // as real tracking accrues; absent an entry the value is 0.
  function prog(id){
    try { var m = (window.SymStore && SymStore.get('ach_progress', null)) || {}; return Math.max(0, Number(m[id]) || 0); }
    catch(e){ return 0; }
  }
  function add(cat, id, gr, en, icon, goal, note){ var aid=cat+'-'+id; out.push({ id:aid, cat, gr, en, icon, goal, val:Math.min(goal, prog(aid)), note }); }
  // ── milestones ──
  [ ['centurion','Ἑκατοντάρχης','Centurion','shield-round',100,{gr:'Εκατό νίκες.',en:'One hundred victories.'}],
    ['myriad','Μυριάς','The Myriad','acropolis',500,{gr:'500 επιστροφές.',en:'Five hundred returns.'}],
    ['unbroken','Ἄθραυστος','Unbroken','lightning-bolt',25,{gr:'Σερί 25.',en:'A streak of 25.'}],
    ['swift','Ἑρμῆς','Swift as Hermes','runner',50,{gr:'50 νίκες κόντρα στον χρόνο.',en:'Fifty trials against the clock.'}],
    ['polymath','Πολυμαθής','Polymath','tablet',12,{gr:'Άγγιξε κάθε μάθημα.',en:'Touch every discipline.'}],
    ['connoisseur','Φιλόκαλος','Connoisseur','cards',10,{gr:'Μάζεψε 10 αφιερώματα.',en:'Gather ten dedications.'}],
    ['nightowl','Γλαυκώπις','Night Owl','owl',30,{gr:'30 βραδινές συνεδρίες.',en:'Thirty night sessions.'}],
    ['marathoner','Μαραθωνοδρόμος','Marathoner','runner',42,{gr:'42 ώρες παιχνιδιού.',en:'Forty-two hours played.'}],
    ['perfectionist','Τέλειος','Perfectionist','wreath-laurel',20,{gr:'20 τέλεια παιχνίδια.',en:'Twenty flawless games.'}],
    ['scholar','Λόγιος','Scholar','scroll',1000,{gr:'1.000 σωστές απαντήσεις.',en:'A thousand correct answers.'}],
    ['collector','Συλλέκτης','Collector','amphora',40,{gr:'40 ακρωτήρια.',en:'Forty acroteria.'}],
    ['benefactor','Εὐεργέτης','Benefactor','coin',50000,{gr:'50.000 Kleos κερδισμένα.',en:'50,000 Kleos earned.'}],
    ['oracle','Χρησμός','The Oracle','flame',7,{gr:'7 μαντεία ξεκλειδωμένα.',en:'Seven oracles unlocked.'}],
    ['founder','Θεμελιωτής','Founder','column',1,{gr:'Στήσε τον πρώτο σου βωμό.',en:'Raise your first altar.'}],
  ].forEach(m=> add('milestone', m[0], m[1], m[2], m[3], m[4], m[5]));
  // ── per class ──
  (window.SYM.CLASSES||[]).concat(window.SYM.GRAMMAR||[]).forEach(c=>{
    add('class', 'master-'+c.id, 'Ἄρχων · '+(c.gr||''), 'Master · '+(c.en||''), c.glyph||'crown-laurel', 100, {gr:'Κατάκτησε όλα τα μαθήματα της τάξης.',en:'Master every subject of the class.'});
    add('class', 'champ-'+c.id, 'Πρωταθλητής · '+(c.gr||''), 'Champion · '+(c.en||''), 'shield-round', 50, {gr:'50 νίκες σε αυτή την τάξη.',en:'Fifty wins in this class.'});
  });
  // ── per subject (unique by english name) ──
  (function(){ const seen={}; const SUBJ=window.SYM.SUBJECTS||{};
    Object.keys(SUBJ).forEach(cid=> (SUBJ[cid]||[]).forEach(s=>{ const k=slug(s.en||s.gr); if(seen[k]) return; seen[k]=1;
      add('subject', k, 'Δεξιοτέχνης · '+(s.gr||''), 'Adept · '+(s.en||''), s.illu||'scroll', 100, {gr:'Ολοκλήρωσε όλα τα παιχνίδια του μαθήματος.',en:'Clear every game in this subject.'}); })); })();
  // ── per mode / engine ──
  (window.SYM.ENGINES||[]).forEach(e=>{ const k=slug(e.en||e.gr);
    add('mode', 'play-'+k, 'Παίκτης · '+(e.gr||''), 'Player · '+(e.en||''), e.illu||'play-button', 50, {gr:'Παίξε 50 φορές.',en:'Play 50 times.'});
    add('mode', 'streak-'+k, 'Σερί · '+(e.gr||''), 'Streak · '+(e.en||''), 'lightning-bolt', 15, {gr:'Σερί 15.',en:'A 15 streak.'});
    add('mode', 'perfect-'+k, 'Ἄριστα · '+(e.gr||''), 'Flawless · '+(e.en||''), 'wreath-laurel', 10, {gr:'10 τέλεια παιχνίδια.',en:'Ten flawless runs.'});
    add('mode', 'win-'+k, 'Νικητής · '+(e.gr||''), 'Victor · '+(e.en||''), 'trophy', 100, {gr:'100 νίκες.',en:'One hundred wins.'});
  });
  // ── per multiplayer game ──
  (window.SYM.MPGAMES||[]).forEach(m=> add('mode', 'mp-'+m.id, 'Μονομάχος · '+(m.gr||''), 'Duelist · '+(m.en||''), m.illu||'crossed-spears', 20, {gr:'20 νίκες στην αρένα.',en:'Twenty arena wins.'}));
  return out;
})();
window.SYM.ACH_CATS = [
  { id:'all',       gr:'Όλα',        en:'All' },
  { id:'milestone', gr:'Ορόσημα',    en:'Milestones' },
  { id:'class',     gr:'Τάξεις',     en:'Classes' },
  { id:'subject',   gr:'Μαθήματα',   en:'Subjects' },
  { id:'mode',      gr:'Λειτουργίες',en:'Modes' },
];

/* ── Acroteria · Ἀκρωτήρια — the sculpture that crowns the altar.
   The heart of the Emporion collection: dozens of scenes drawn from
   Greek myth, the epics, daily life, Byzantium and the wider world.
   `cat` groups them in the shop; equip sets the altar centrepiece. ── */
window.SYM.ACROTERIA = [
  /* — Θεμέλια · Founding (free + cheap starters) — */
  { id:'parthenon', cat:'found', illu:'parthenon',    gr:'Παρθενών',       en:'The Parthenon',    cost:0,    owned:1, lore:{gr:'Ο ναός της Αθηνάς στον βράχο της Ακρόπολης.',en:'Athena’s temple upon the Acropolis rock.'} },
  { id:'trireme',   cat:'found', illu:'trireme',      gr:'Τριήρης',        en:'The Trireme',      cost:0,    owned:1, lore:{gr:'Το ταχύ πολεμικό πλοίο της Αθήνας.',en:'The swift warship of Athens.'} },
  { id:'owl',       cat:'found', illu:'owl',          gr:'Γλαύκα',         en:'Owl of Athena',    cost:0,    owned:1, lore:{gr:'Το πουλί της σοφίας, σύμβολο της Αθηνάς.',en:'The bird of wisdom, symbol of Athena.'} },
  { id:'stoa',      cat:'found', illu:'agora',       gr:'Στοά',           en:'The Stoa',         cost:400,  owned:0, lore:{gr:'Η κιονοστοιχία όπου περπατούσαν οι φιλόσοφοι.',en:'The colonnade where philosophers walked.'} },
  { id:'amphora',   cat:'found', illu:'amphora',      gr:'Ἀμφορεύς',       en:'The Amphora',      cost:500,  owned:0, lore:{gr:'Μελανόμορφο αγγείο, ψημένο κόκκινο.',en:'Black-figure ware, fired red.'} },
  { id:'olive',     cat:'found', illu:'olive-branch', gr:'Ἱερὰ Ἐλαία',     en:'The Sacred Olive', cost:300,  owned:0, lore:{gr:'Το δώρο της Αθηνάς στην πόλη.',en:'Athena’s gift to the city.'} },

  /* — Ἑορταί · Seasonal (the festive year) — */
  { id:'gateofhades', cat:'season', illu:'labyrinth',   gr:'Πύλη τοῦ Ἅιδου', en:'Gate of Hades',    cost:1200, owned:0, lore:{gr:'Ο Χάροντας περνά τη Στύγα. Halloween.',en:'Charon poles the Styx. Worn at Halloween.'} },
  { id:'karavaki',  cat:'season', illu:'ship-prow',    gr:'Καραβάκι',       en:'The Karavaki',     cost:1200, owned:0, lore:{gr:'Το φωτισμένο καράβι των Χριστουγέννων.',en:'The lit boat of a Greek Christmas.'} },
  { id:'noel',      cat:'season', illu:'wreath',       gr:'Δένδρον',        en:'Modern Noël',      cost:1200, owned:0, lore:{gr:'Αστέρι, στολίδια και δώρα.',en:'Star, baubles and gifts.'} },
  { id:'chapel',    cat:'season', illu:'building',     gr:'Ἐξωκλήσιον',     en:'Hilltop Chapel',   cost:1200, owned:0, lore:{gr:'Εκκλησάκι και χελιδόνια. Πάσχα.',en:'Chapel and returning swallows. Easter.'} },
  { id:'theatreD',  cat:'season', illu:'masks',      gr:'Ἀποκριές',       en:'Carnival Stage',   cost:1200, owned:0, lore:{gr:'Κωμωδία και τραγωδία της Αποκριάς.',en:'Comedy and tragedy of Carnival.'} },
  { id:'fireworks', cat:'season', illu:'star-streak',  gr:'Πρωτοχρονιά',    en:'New Year',         cost:1200, owned:0, lore:{gr:'Πυροτεχνήματα πάνω απ’ τις στέγες.',en:'Fireworks burst over the rooftops.'} },
  { id:'theophania',cat:'season', illu:'wave',         gr:'Θεοφάνεια',      en:'Epiphany',         cost:1400, owned:0, lore:{gr:'Ο σταυρός στα κύματα, το περιστέρι. Φῶτα.',en:'The cross cast to the waves, the dove descending.'} },
  { id:'kite',      cat:'season', illu:'kite',      gr:'Χαρταετός',      en:'Clean Monday',     cost:1200, owned:0, lore:{gr:'Ένας αετός ανεβαίνει τον σαρακοστιανό ουρανό.',en:'A kite climbs the Lenten sky.'} },
  { id:'maywreath', cat:'season', illu:'wreath-laurel',gr:'Πρωτομαγιά',     en:'May Wreath',       cost:1200, owned:0, lore:{gr:'Στεφάνι ανοιξιάτικων λουλουδιών.',en:'A wreath of spring flowers.'} },
  { id:'swallows',  cat:'season', illu:'swallows', gr:'Χελιδόνια',      en:'The Swallows',     cost:1200, owned:0, lore:{gr:'Τα χελιδόνια γυρίζουν. Άνοιξη.',en:'The swallows return. Spring.'} },
  { id:'vintage',   cat:'season', illu:'olive-tree',   gr:'Τρύγος',         en:'The Vintage',      cost:1200, owned:0, lore:{gr:'Κλήματα φορτωμένα καρπό. Φθινόπωρο.',en:'Vines heavy with fruit. Autumn.'} },
  { id:'festival',  cat:'season', illu:'flame',        gr:'Πανηγύρι',       en:'The Festival',     cost:1200, owned:0, lore:{gr:'Σημαιάκια και φαναράκια του καλοκαιριού.',en:'Bunting and lanterns of the summer feast.'} },
  { id:'independence',cat:'season', illu:'greek-flag',     gr:'25η Μαρτίου',    en:'Independence Day', cost:1400, owned:0, lore:{gr:'Η γαλανόλευκη ψηλά, με δάφνη.',en:'The blue-and-white raised high, crowned with laurel.'} },

  /* — Μυθολογία · Myth — */
  { id:'trident',   cat:'myth', illu:'poseidon-trident',       gr:'Τρίαινα',        en:'Poseidon’s Trident', cost:1200, owned:0, lore:{gr:'Το τρίαινο όπλο του κοσμοσείστη.',en:'The three-pronged mark of the earth-shaker.'} },
  { id:'pegasus',   cat:'myth', illu:'pegasus',         gr:'Πήγασος',        en:'Pegasus',          cost:2400, owned:0, lore:{gr:'Το φτερωτό άλογο, γέννημα της Μέδουσας.',en:'The winged horse, sprung from Medusa.'} },
  { id:'medusa',    cat:'myth', illu:'gorgoneion',        gr:'Μέδουσα',        en:'The Gorgoneion',   cost:2000, owned:0, lore:{gr:'Το φιδομάλλο κεφάλι που πετρώνει.',en:'The serpent-crowned head that turns to stone.'} },
  { id:'hydra',     cat:'myth', illu:'hydra',         gr:'Λερναία Ὕδρα',   en:'The Hydra',        cost:2000, owned:0, lore:{gr:'Κόψε ένα κεφάλι, φυτρώνουν δύο.',en:'Cut one head, and two more rise.'} },
  { id:'phoenix',   cat:'myth', illu:'phoenix',         gr:'Φοῖνιξ',         en:'The Phoenix',      cost:2200, owned:0, lore:{gr:'Ξαναγεννιέται από τη στάχτη του.',en:'Reborn from its own ash, again and again.'} },
  { id:'nike',      cat:'myth', illu:'nike-victory', gr:'Νίκη',           en:'Winged Victory',   cost:1800, owned:0, lore:{gr:'Κατεβαίνει με το στεφάνι του θριάμβου.',en:'She alights bearing the victor’s wreath.'} },
  { id:'prometheus',cat:'myth', illu:'torch',         gr:'Προμηθεύς',      en:'Prometheus',       cost:2000, owned:0, lore:{gr:'Ο πυρφόρος, δαυλός υψωμένος στο σκοτάδι.',en:'The fire-bringer, torch lifted against the dark.'} },
  { id:'icarus',    cat:'myth', illu:'sun',           gr:'Ἴκαρος',         en:'Icarus',           cost:1600, owned:0, lore:{gr:'Κέρινα φτερά κι ο ήλιος που πλησίασε.',en:'Wax wings, and the sun he flew too near.'} },
  { id:'starrynight',cat:'myth', illu:'star-streak',  gr:'Ἔναστρος Νύξ',   en:'Starry Night',     cost:1400, owned:0, lore:{gr:'Φεγγαρόλουστη ράχη κι ένα κυπαρίσσι.',en:'A moonlit ridge and a lone cypress.'} },
  { id:'cerberus',  cat:'myth', illu:'cerberus',   gr:'Κέρβερος',       en:'Cerberus',         cost:1800, owned:0, lore:{gr:'Ο τρικέφαλος σκύλος των νεκρών.',en:'The three-headed hound of the dead.'} },
  { id:'titanomachy',cat:'myth', illu:'lightning-bolt',gr:'Τιτανομαχία',   en:'Titanomachy',      cost:2200, owned:0, lore:{gr:'Κεραυνοί πάνω στους πεσμένους Τιτάνες.',en:'Thunderbolts hurled upon the falling titans.'} },
  { id:'centaur',   cat:'myth', illu:'bow',           gr:'Κένταυρος',      en:'The Centaur',      cost:1600, owned:0, lore:{gr:'Ο τοξότης κένταυρος, μισός ίππος.',en:'The archer centaur, half horse, half man.'} },
  { id:'sphinx',    cat:'myth', illu:'sphinx',   gr:'Σφίγξ',          en:'The Sphinx',       cost:2000, owned:0, lore:{gr:'Η φτερωτή αινιγματίστρια των Θηβών.',en:'The winged riddler at the gates of Thebes.'} },
  { id:'chimera',   cat:'myth', illu:'flame',         gr:'Χίμαιρα',        en:'The Chimera',      cost:2200, owned:0, lore:{gr:'Λιοντάρι, κατσίκα και φίδι σε μια ανάσα φωτιάς.',en:'Lion, goat and serpent in one breath of fire.'} },
  { id:'goldenfleece',cat:'myth', illu:'trophy',gr:'Χρυσόμαλλον Δέρας', en:'The Golden Fleece', cost:2400, owned:0, lore:{gr:'Το χρυσό δέρας που τράβηξε τους Αργοναύτες.',en:'The gilt hide that drew the Argonauts.'} },

  /* — Ἔπη · The Epics — */
  { id:'trojan',    cat:'epic', illu:'trojan-horse',  gr:'Δούρειος Ἵππος', en:'The Trojan Horse', cost:2000, owned:0, lore:{gr:'Το κοίλο άλογο στις πύλες της Τροίας.',en:'The hollow horse wheeled to Ilion’s gates.'} },
  { id:'shield',    cat:'epic', illu:'shield-round',  gr:'Ἀσπὶς Ἀχιλλέως', en:'Shield of Achilles', cost:2600, owned:0, lore:{gr:'Όλος ο κόσμος σφυρηλατημένος σε χαλκό.',en:'The whole world forged in bronze.'} },
  { id:'cyclops',   cat:'epic', illu:'cyclops-eye',   gr:'Πολύφημος',      en:'The Cyclops',      cost:2000, owned:0, lore:{gr:'Ο μονόφθαλμος, νικημένος από τον «Οὖτιν».',en:'One-eyed Polyphemus, outwitted by “No-man”.'} },
  { id:'sirens',    cat:'epic', illu:'wave',          gr:'Σειρῆνες',       en:'The Sirens',       cost:2400, owned:0, lore:{gr:'Δεμένος στο κατάρτι, άκουσε και έζησε.',en:'Bound to the mast, he heard and lived.'} },

  /* — Βίος · Daily Life — */
  { id:'vase',      cat:'life', illu:'amphora',       gr:'Ἀγγειογράφος',   en:'The Vase Painter', cost:1000, owned:0, lore:{gr:'Τεχνίτης που ζωγραφίζει μύθο σε αμφορέα.',en:'An artisan brushing myth onto an amphora.'} },
  { id:'ekklesia',  cat:'life', illu:'speech',        gr:'Ἐκκλησία τοῦ Δήμου', en:'The Ekklesia', cost:1000, owned:0, lore:{gr:'Ένας ρήτορας στο βήμα. Δημοκρατία.',en:'An orator on the bema. Democracy.'} },
  { id:'discus',    cat:'life', illu:'discus',        gr:'Δισκοβόλος',     en:'The Discobolus',   cost:1200, owned:0, lore:{gr:'Ο δισκοβόλος στην ακμή των αγώνων.',en:'The discus-thrower at the height of the games.'} },
  { id:'philosopher',cat:'life',illu:'scroll',        gr:'Φιλόσοφος',      en:'The Philosopher',  cost:1200, owned:0, lore:{gr:'Καθιστός στοχαστής μ’ ανοιχτό κύλινδρο.',en:'A seated thinker, an open scroll in hand.'} },
  { id:'theatre',   cat:'life', illu:'theatre',       gr:'Θέατρον Διονύσου', en:'Theatre of Dionysus', cost:1400, owned:0, lore:{gr:'Το κοίλον στεφανωμένο με κωμωδία και τραγωδία.',en:'The tiered koilon, crowned by comedy and tragedy.'} },
  { id:'lyre',      cat:'life', illu:'lyre',          gr:'Λύρα',           en:'The Lyre',         cost:600,  owned:0, lore:{gr:'Το όργανο του Απόλλωνα και των Μουσών.',en:'The instrument of Apollo and the Muses.'} },

  /* — Βυζάντιο · Byzantium — */
  { id:'hagiasophia',cat:'byz', illu:'building',      gr:'Ἁγία Σοφία',     en:'Hagia Sophia',     cost:2400, owned:0, lore:{gr:'Ο μέγας τρούλος — σοφία σε πέτρα.',en:'The great dome — wisdom in stone.'} },
  { id:'eagle',     cat:'byz', illu:'eagle',          gr:'Δικέφαλος Ἀετός', en:'The Double Eagle', cost:2600, owned:0, lore:{gr:'Δύο κεφάλια, Ανατολή και Δύση.',en:'Two heads — East and West.'} },
  { id:'pantocrator',cat:'byz', illu:'goddess',       gr:'Παντοκράτωρ',    en:'Pantocrator',      cost:2800, owned:0, lore:{gr:'Η εικόνα στην αψίδα, χρυσή και παντοδύναμη.',en:'The icon in the apse, gold-ground and all-ruling.'} },
  { id:'justinian', cat:'byz', illu:'crown',          gr:'Ἰουστινιανός',   en:'Justinian',        cost:2400, owned:0, lore:{gr:'Ο αυτοκράτορας στο ψηφιδωτό της Ραβέννας.',en:'The emperor in the mosaic of Ravenna.'} },
  { id:'theotokos', cat:'byz', illu:'goddess',         gr:'Θεοτόκος',       en:'The Theotokos',    cost:2200, owned:0, lore:{gr:'Η Μητέρα και το Βρέφος, η εικόνα της αψίδας.',en:'The Mother and Child, the icon of the apse.'} },
  { id:'chirho',    cat:'byz', illu:'cipher',         gr:'Χριστόγραμμα',   en:'The Chi-Rho',      cost:1800, owned:0, lore:{gr:'Το μονόγραμμα της Μουλβίας Γέφυρας.',en:'The monogram borne to the Milvian Bridge.'} },
  { id:'meteora',   cat:'byz', illu:'building',          gr:'Μετέωρα',        en:'Meteora',          cost:2200, owned:0, lore:{gr:'Το μοναστήρι κρεμασμένο στον βράχο.',en:'The monastery suspended on its rock.'} },
  { id:'peacock',   cat:'byz', illu:'peacock',           gr:'Ταὼς',           en:'The Peacock',      cost:2000, owned:0, lore:{gr:'Πουλί του παραδείσου σε ψηφίδες.',en:'Bird of paradise, glittering in tesserae.'} },
  { id:'walls',     cat:'byz', illu:'walls',          gr:'Τείχη τῆς Πόλεως', en:'The City Walls',  cost:2600, owned:0, lore:{gr:'Τα τείχη που κράτησαν χίλια χρόνια.',en:'The walls that held a thousand years.'} },

  /* — Νεωτέρα Ἑλλάς · Modern Greece — */
  { id:'revolution',cat:'modern', illu:'banner-1821',       gr:'1821',           en:'The Revolution',   cost:1600, owned:0, lore:{gr:'Το λάβαρο του ’21 — δάφνη, σταυρός, λευτεριά.',en:'The banner of 1821 — laurel, cross and liberty.'} },
  { id:'flag',      cat:'modern', illu:'greek-flag',      gr:'Γαλανόλευκη',    en:'The Blue & White', cost:1400, owned:0, lore:{gr:'Η σημαία της Ελληνικής Δημοκρατίας.',en:'The ensign of the Hellenic Republic.'} },
  { id:'evzone',    cat:'modern', illu:'evzone',      gr:'Εὔζωνας',        en:'The Evzone',       cost:1800, owned:0, lore:{gr:'Ο φρουρός στο Μνημείο του Ἀγνώστου Στρατιώτη.',en:'The guard at the Tomb of the Unknown Soldier.'} },
  { id:'windmill',  cat:'modern', illu:'windmill',         gr:'Ἀνεμόμυλος',     en:'The Windmill',     cost:1400, owned:0, lore:{gr:'Λευκά πανιά στο κυκλαδίτικο γαλάζιο.',en:'White sails over the Cycladic blue.'} },
  { id:'bouzouki',  cat:'modern', illu:'bouzouki',        gr:'Μπουζούκι',      en:'The Bouzouki',     cost:1600, owned:0, lore:{gr:'Το όργανο των ρεμπέτικων νυχτών.',en:'The lute of the rebetiko nights.'} },
  { id:'bluedome',  cat:'modern', illu:'building',    gr:'Γαλάζιος Τροῦλος', en:'The Blue Dome',  cost:1600, owned:0, lore:{gr:'Το ασβεστωμένο εκκλησάκι πάνω απ’ την καλντέρα.',en:'The whitewashed chapel above the caldera.'} },
  { id:'oliveharvest',cat:'modern', illu:'olive-tree',gr:'Ἐλαιοσυλλογή',   en:'The Olive Harvest',cost:1400, owned:0, lore:{gr:'Δίχτυα κάτω από τα ασημένια φύλλα.',en:'Nets beneath the silver leaves.'} },
  { id:'panathenaic',cat:'modern', illu:'runner',     gr:'Καλλιμάρμαρον',  en:'The Kallimarmaro', cost:1800, owned:0, lore:{gr:'Το μαρμάρινο στάδιο των πρώτων Αγώνων.',en:'The marble stadium of the first modern Games.'} },
  { id:'lighthouse',cat:'modern', illu:'lighthouse',       gr:'Φάρος',          en:'The Lighthouse',   cost:1400, owned:0, lore:{gr:'Φως αναμμένο για τα καράβια που γυρίζουν.',en:'A lamp kept for the boats coming home.'} },
  { id:'caique',    cat:'modern', illu:'caique',   gr:'Καΐκι',          en:'The Caïque',       cost:1600, owned:0, lore:{gr:'Το ζωγραφισμένο ψαρόβαρκο με το μάτι.',en:'The painted fishing boat with its eye.'} },

  /* — Κόσμος · The Wider World — */
  { id:'pyramids',  cat:'world', illu:'pyramids',        gr:'Πυραμίδες',      en:'The Pyramids',     cost:2200, owned:0, lore:{gr:'Οι τάφοι της Γκίζας, παλιοί πριν τον Όμηρο.',en:'The tombs of Giza, old before Homer sang.'} },
  { id:'greatsphinx',cat:'world', illu:'sphinx',      gr:'Μεγάλη Σφίγξ',   en:'The Great Sphinx', cost:2200, owned:0, lore:{gr:'Ο λεοντόμορφος βασιλιάς στην άμμο.',en:'The lion-king couchant in the sand.'} },
  { id:'lamassu',   cat:'world', illu:'shield-lion',  gr:'Λαμασσού',       en:'The Lamassu',      cost:2000, owned:0, lore:{gr:'Ο φτερωτός ταύρος των ασσυριακών πυλών.',en:'The winged bull of Assyria’s gates.'} },
  { id:'greatwall', cat:'world', illu:'walls',        gr:'Σινικὸν Τεῖχος', en:'The Great Wall',   cost:2600, owned:0, lore:{gr:'Ο πέτρινος δράκος των βόρειων λόφων.',en:'The stone dragon of the northern hills.'} },
  { id:'taj',       cat:'world', illu:'building',     gr:'Ταζ Μαχάλ',      en:'The Taj Mahal',    cost:2400, owned:0, lore:{gr:'Τρούλος από λευκό μάρμαρο, για αγάπη.',en:'A dome of white marble raised for love.'} },
  { id:'colosseum', cat:'world', illu:'building',     gr:'Κολοσσαῖον',     en:'The Colosseum',    cost:2200, owned:0, lore:{gr:'Η μεγάλη αρένα της Ρώμης, σειρά τη σειρά.',en:'The great arena of Rome, tier upon tier.'} },
  { id:'aqueduct',  cat:'world', illu:'column',       gr:'Ὑδραγωγεῖον',    en:'The Aqueduct',     cost:1800, owned:0, lore:{gr:'Καμάρες που φέρνουν νερό στην πεδιάδα.',en:'Arches carrying water across the plain.'} },
  { id:'longship',  cat:'world', illu:'ship-prow',    gr:'Δρακοκάραβο',    en:'The Longship',     cost:2000, owned:0, lore:{gr:'Το δρακόπλωρο καράβι των βορείων.',en:'The dragon-prowed ship of the northmen.'} },

  /* — Ἀριστουργήματα · Premium masterworks — gilded art, higher Kleos (≈3×) — */
  { id:'p-athena-parthenos', cat:'myth', illu:'goddess',        premium:1, gr:'Ἀθηνᾶ Παρθένος',   en:'Athena Parthenos',   cost:5200, owned:0, lore:{gr:'Το χρυσελεφάντινο άγαλμα του Φειδία.',en:'Pheidias\u2019 chryselephantine colossus.'} },
  { id:'p-zeus-olympios',    cat:'myth', illu:'lightning-bolt',  premium:1, gr:'Ζεὺς Ὀλύμπιος',    en:'Zeus Olympios',      cost:6000, owned:0, lore:{gr:'Ο κεραυνοφόρος άναξ των θεών.',en:'The thunder-wielding king of the gods.'} },
  { id:'p-apollo-kithara',   cat:'myth', illu:'lyre',            premium:1, gr:'Ἀπόλλων Κιθαρῳδός', en:'Apollo Kitharoidos', cost:4800, owned:0, lore:{gr:'Ο θεός του φωτός με την κιθάρα.',en:'The god of light at his kithara.'} },
  { id:'p-artemis-bow',      cat:'myth', illu:'bow',             premium:1, gr:'Ἄρτεμις Τοξότις',  en:'Artemis the Archer', cost:4600, owned:0, lore:{gr:'Η κυρά του κυνηγιού και της σελήνης.',en:'Lady of the hunt and the moon.'} },
  { id:'p-poseidon',         cat:'myth', illu:'poseidon-trident',         premium:1, gr:'Ποσειδῶν Ἐνοσίχθων', en:'Poseidon Earthshaker', cost:5400, owned:0, lore:{gr:'Σείει τη γη και τη θάλασσα.',en:'He shakes both earth and sea.'} },
  { id:'p-hermes',           cat:'myth', illu:'snake',           premium:1, gr:'Ἑρμῆς Ψυχοπομπός',  en:'Hermes Psychopompos', cost:4400, owned:0, lore:{gr:'Το κηρύκειο με τα δύο φίδια.',en:'The caduceus twined with serpents.'} },
  { id:'p-helios',           cat:'myth', illu:'helmet',          premium:1, gr:'Ἥλιος Ἁρματηλάτης', en:'Helios\u2019 Chariot', cost:5600, owned:0, lore:{gr:'Το πύρινο άρμα διασχίζει τον ουρανό.',en:'The fiery chariot crosses the sky.'} },
  { id:'p-athena-nike',      cat:'myth', illu:'wreath-laurel',   premium:1, gr:'Ἀθηνᾶ Νίκη',       en:'Athena Nike',        cost:4800, owned:0, lore:{gr:'Η ἄπτερη νίκη του ναΐσκου.',en:'The wingless victory of the little temple.'} },

  { id:'p-achilles-wrath',   cat:'epic', illu:'sword',           premium:1, gr:'Μῆνις Ἀχιλλέως',   en:'Wrath of Achilles',  cost:5200, owned:0, lore:{gr:'«Μῆνιν ἄειδε, θεά…»',en:'\u201cSing, goddess, of the wrath\u2026\u201d'} },
  { id:'p-hector',           cat:'epic', illu:'walls',           premium:1, gr:'Ἕκτωρ πρὸ τῶν Τειχῶν', en:'Hector at the Walls', cost:5000, owned:0, lore:{gr:'Ο υπερασπιστής της Τροίας.',en:'The lone defender of Troy.'} },
  { id:'p-aeolus',           cat:'epic', illu:'cyclone',         premium:1, gr:'Αἴολος',           en:'Aeolus\u2019 Winds',  cost:4600, owned:0, lore:{gr:'Ο ασκός με τους ανέμους.',en:'The bag that held the winds.'} },
  { id:'p-scylla',           cat:'epic', illu:'wave',            premium:1, gr:'Σκύλλα & Χάρυβδις', en:'Scylla & Charybdis', cost:5000, owned:0, lore:{gr:'Ανάμεσα σε δύο θανάτους.',en:'Steering between two deaths.'} },

  { id:'p-pantokrator',      cat:'byz', illu:'goddess',          premium:1, gr:'Χριστὸς Παντοκράτωρ', en:'Christ Pantokrator', cost:6200, owned:0, lore:{gr:'Η χρυσή εικόνα του τρούλου.',en:'The gold-ground icon of the dome.'} },
  { id:'p-michael',          cat:'byz', illu:'sword',            premium:1, gr:'Ἀρχάγγελος Μιχαήλ', en:'Archangel Michael',  cost:5400, owned:0, lore:{gr:'Ο ταξιάρχης με τη φλογερή ρομφαία.',en:'The captain with the flaming sword.'} },
  { id:'p-imperial-eagle',   cat:'byz', illu:'eagle',            premium:1, gr:'Αὐτοκρατορικὸς Ἀετός', en:'Imperial Eagle',  cost:5600, owned:0, lore:{gr:'Ο χρυσός δικέφαλος της πορφύρας.',en:'The gold double eagle of the purple.'} },
  { id:'p-theodora',         cat:'byz', illu:'crown',            premium:1, gr:'Θεοδώρα Αὐγούστα',  en:'Empress Theodora',   cost:5200, owned:0, lore:{gr:'Η αυτοκράτειρα στο ψηφιδωτό.',en:'The empress in the Ravenna mosaic.'} },
  { id:'p-great-dome',       cat:'byz', illu:'building',         premium:1, gr:'Ὁ Μέγας Τροῦλος',   en:'The Great Dome',     cost:4800, owned:0, lore:{gr:'Σαν να κρέμεται από χρυσή αλυσίδα.',en:'As if hung from heaven by a golden chain.'} },

  { id:'p-colossus',         cat:'world', illu:'sun',            premium:1, gr:'Κολοσσὸς τῆς Ῥόδου', en:'Colossus of Rhodes', cost:6000, owned:0, lore:{gr:'Ο ηλιακός γίγας στο λιμάνι.',en:'The sun-god giant over the harbour.'} },
  { id:'p-hanging-gardens',  cat:'world', illu:'olive-tree',     premium:1, gr:'Κρεμαστοὶ Κῆποι',   en:'Hanging Gardens',    cost:5400, owned:0, lore:{gr:'Πράσινες βεράντες της Βαβυλώνας.',en:'The green terraces of Babylon.'} },
  { id:'p-pharos',           cat:'world', illu:'torch',          premium:1, gr:'Φάρος τῆς Ἀλεξανδρείας', en:'Pharos of Alexandria', cost:5600, owned:0, lore:{gr:'Το φως που οδηγούσε τα πλοία.',en:'The flame that guided every ship.'} },
  { id:'p-mausoleum',        cat:'world', illu:'building',        premium:1, gr:'Μαυσωλεῖον',        en:'The Mausoleum',      cost:5000, owned:0, lore:{gr:'Ο τάφος-θαύμα της Ἁλικαρνασσοῦ.',en:'The wonder-tomb of Halicarnassus.'} },
  { id:'p-zeus-statue',      cat:'world', illu:'crown-laurel',    premium:1, gr:'Ζεὺς τῆς Ὀλυμπίας', en:'Statue of Zeus',     cost:6200, owned:0, lore:{gr:'Το χρυσελεφάντινο μεγαλείο της Ὀλυμπίας.',en:'Pheidias\u2019 seated colossus at Olympia.'} },

  { id:'p-charioteer',       cat:'life', illu:'helmet',           premium:1, gr:'Ἡνίοχος τῶν Δελφῶν', en:'Charioteer of Delphi', cost:5200, owned:0, lore:{gr:'Ο χάλκινος νικητής των αγώνων.',en:'The bronze victor of the games.'} },
  { id:'p-discobolus',       cat:'life', illu:'discus',           premium:1, gr:'Δισκοβόλος τοῦ Μύρωνος', en:'Myron\u2019s Discobolus', cost:4600, owned:0, lore:{gr:'Η στιγμή πριν τη ρίψη.',en:'The instant before the throw.'} },
  { id:'p-venus-milo',       cat:'life', illu:'goddess',          premium:1, gr:'Ἀφροδίτη τῆς Μήλου', en:'Venus de Milo',      cost:5400, owned:0, lore:{gr:'Η ομορφιά χωρίς χέρια.',en:'Beauty, even without her arms.'} },
  { id:'p-samothrace',       cat:'life', illu:'nike-victory',    premium:1, gr:'Νίκη τῆς Σαμοθράκης', en:'Winged Victory',    cost:5800, owned:0, lore:{gr:'Η φτερωτή νίκη στην πλώρη.',en:'Winged victory alighting on a prow.'} },
  { id:'p-laocoon',          cat:'life', illu:'snake',            premium:1, gr:'Λαοκόων',           en:'Laoco\u00f6n',        cost:5000, owned:0, lore:{gr:'Πάλη με τα φίδια της θάλασσας.',en:'Wrestling the serpents of the sea.'} },

  { id:'p-pheidippides',     cat:'modern', illu:'runner',         premium:1, gr:'Φειδιππίδης',       en:'Pheidippides',       cost:4400, owned:0, lore:{gr:'«Νενικήκαμεν!» — Μαραθών.',en:'\u201cWe have won!\u201d \u2014 Marathon.'} },
  { id:'p-olympic-flame',    cat:'modern', illu:'flame',          premium:1, gr:'Ὀλυμπιακὴ Φλόγα',   en:'Olympic Flame',      cost:4800, owned:0, lore:{gr:'Αναμμένη στην αρχαία Ολυμπία.',en:'Kindled at ancient Olympia.'} },
  { id:'p-golden-laurel',    cat:'modern', illu:'crown-laurel',   premium:1, gr:'Χρυσοῦς Στέφανος',  en:'The Golden Laurel',  cost:4600, owned:0, lore:{gr:'Το έπαθλο των πρώτων νικητών.',en:'The prize of the first champions.'} },
];

/* ════════════════════════════════════════════════════════════════════
   GAME TAGS · Ἐτικέτες — the "extra pages" of SymposiON.
   Each tag is its own browsable page (symposion/<tag>) that gathers every
   game carrying it. The hero strip exposes them; Admin → Game Tags lets a
   curator tag games and add new tags. Defaults below are derived from the
   subject each game lives under (SUBJECT_TAGS) — no hand-kept duplicate
   list to drift. Admin overrides (SymStore 'game_tags') win when present.
   ════════════════════════════════════════════════════════════════════ */
window.SYM.TAGS = [
  { id:'ancient',     illu:'scroll',   gr:'Αρχαία',      en:'Ancient Greek' },
  { id:'epics',       illu:'trireme',  gr:'Έπη',         en:'Epics' },
  { id:'tragedies',   illu:'masks',    gr:'Τραγωδίες',   en:'Tragedies' },
  { id:'history',     illu:'acropolis',gr:'Ιστορία',     en:'History' },
  { id:'literature',  illu:'book',     gr:'Λογοτεχνία',  en:'Literature' },
  { id:'language',    illu:'quill',    gr:'Γλώσσα',      en:'Language' },
  { id:'composition', illu:'owl',      gr:'Έκθεση',      en:'Composition' },
  { id:'grammar',     illu:'column',   gr:'Γραμματική',  en:'Grammar' },
  { id:'latin',       illu:'helmet',   gr:'Λατινικά',    en:'Latin' },
];

// subject-id → default tag ids. Every game inherits the union of the tags
// of the subjects it appears in.
window.SYM.SUBJECT_TAGS = {
  'odysseia':['epics'],          'archaia':['ancient'],
  'iliada':['epics'],            'archaia-b':['ancient'],   'istoria':['history'],
  'eleni':['tragedies'],         'archaia-c':['ancient'],
  'archaia-thx':['ancient'],     'ekfrasi':['composition','language'],
  'rhetoric':['literature'],     'latinika-b':['latin'],
  'istoria-kat':['history'],     'latinika-c':['latin'],
  'ga-verbs':['grammar','ancient'],  'ga-nouns':['grammar','ancient'],  'ga-syntax':['grammar','ancient'],
  'gl-decl':['grammar','latin'],     'gl-verbs':['grammar','latin'],    'gl-theory':['latin'],
  'gn-gram':['grammar','language'],  'gn-express':['composition','language'], 'gn-spell':['language'],
};

/* ════════════════════════════════════════════════════════════════════
   LEVEL-UP REWARDS · defined here, surfaced in Admin → Level Rewards.
   The Level-Up screen reads its rewards from this ladder via
   SYM.rewardsForLevel(level). A reward = { ic, type, t }. Admin edits are
   stored in SymStore('level_rewards') and override the defaults.
   ════════════════════════════════════════════════════════════════════ */
window.SYM.LEVEL_REWARDS = [
  { lv:2,  title:{gr:'Ἀθλητής',en:'Athlete'}, rewards:[
      {ic:'⌾', type:'kleos',  t:{gr:'+200 Kleos',en:'+200 Kleos'}},
      {ic:'❧', type:'cursor', t:{gr:'Δείκτης: Δάφνη',en:'Cursor: Laurel'}} ] },
  { lv:3,  title:{gr:'Ῥαψῳδός',en:'Rhapsode'}, rewards:[
      {ic:'◆', type:'avatar', t:{gr:'Avatar: Απόλλων',en:'Avatar: Apollo'}},
      {ic:'⌾', type:'kleos',  t:{gr:'+300 Kleos',en:'+300 Kleos'}} ] },
  { lv:6,  title:{gr:'Ῥήτωρ τῆς Ἀγορᾶς',en:'Orator of the Agora'}, rewards:[
      {ic:'⛩', type:'acro',   t:{gr:'Ακρωτήριο: Στοά',en:'Acroterion: The Stoa'}},
      {ic:'✦', type:'avatar', t:{gr:'Avatar: Ποσειδών',en:'Avatar: Poseidon'}} ] },
  { lv:10, title:{gr:'Φιλόλογος',en:'Philologist'}, rewards:[
      {ic:'◆', type:'theme',  t:{gr:'Θέμα: Tyrian Purple',en:'Theme: Tyrian Purple'}},
      {ic:'⌾', type:'kleos',  t:{gr:'+500 Kleos',en:'+500 Kleos'}} ] },
  { lv:13, title:{gr:'Ἥρως τῆς Ἰλιάδος',en:'Hero of the Iliad'}, rewards:[
      {ic:'◆', type:'theme',  t:{gr:'Θέμα: Acroterion',en:'Theme: Acroterion'}},
      {ic:'❧', type:'cursor', t:{gr:'Δείκτης: Δάφνη',en:'Cursor: Laurel'}},
      {ic:'⛩', type:'acro',   t:{gr:'Ακρωτήριο: Νίκη',en:'Acroterion: Winged Victory'}} ] },
  { lv:18, title:{gr:'Σοφός',en:'The Wise'}, rewards:[
      {ic:'◆', type:'theme',  t:{gr:'Θέμα: Golden Fleece',en:'Theme: Golden Fleece'}},
      {ic:'⛩', type:'acro',   t:{gr:'Ακρωτήριο: Πήγασος',en:'Acroterion: Pegasus'}} ] },
  { lv:22, title:{gr:'Ἥρως τῶν Μύθων',en:'Hero of Myth'}, rewards:[
      {ic:'✦', type:'avatar', t:{gr:'Avatar: Δίας',en:'Avatar: Zeus'}},
      {ic:'⌾', type:'kleos',  t:{gr:'+1.000 Kleos',en:'+1,000 Kleos'}} ] },
  { lv:30, title:{gr:'Ὀλύμπιος',en:'Olympian'}, rewards:[
      {ic:'◆', type:'theme',  t:{gr:'Θέμα: Orphic Night',en:'Theme: Orphic Night'}},
      {ic:'⛩', type:'acro',   t:{gr:'Ακρωτήριο: Χρυσόμαλλο Δέρας',en:'Acroterion: Golden Fleece'}} ] },
];
// current ladder (admin override or defaults), and the rewards for a level
window.SYM.levelLadder = function(){
  const ov = (window.SymStore && SymStore.get('level_rewards', null));
  return (Array.isArray(ov) && ov.length) ? ov : window.SYM.LEVEL_REWARDS;
};
window.SYM.rewardsForLevel = function(lv){
  const ladder = window.SYM.levelLadder();
  let best = ladder[0];
  ladder.forEach(e => { if (e.lv === lv) best = e; else if (e.lv <= lv && e.lv >= best.lv) best = e; });
  const exact = ladder.find(e => e.lv === lv);
  return exact || best || ladder[0];
};

/* ════════════════════════════════════════════════════════════════════
   LEVEL BANK — Ver1-style subject→level→Mix selector metadata.
   Maps each content-bank game's openFn → the real level data in
   window.GP_LEVEL_PROVIDERS (gp-levels.js, loaded eagerly) plus the
   per-game localStorage progress-key prefix the live game writes.

   Only games listed here have genuine, selectable levels → they route
   through S.level (the bank selector). Every other game (arcade engines,
   trivia, the GP_ENGINES, single-shot quizzes) launches DIRECTLY.

   ds      — key into window.GP_LEVEL_PROVIDERS (its `levels` array drives
             the selector: {id, group, section, color, desc}). "Συνδυαστικό"
             groups already present there ARE the Mix option.
   prog    — localStorage prefix the live game writes as `<prog><id>` →
             {completed:bool, best:num}. Absent → that game keeps no
             per-level progress yet, so the selector shows an honest 0.
   ════════════════════════════════════════════════════════════════════ */
window.SYM.LEVEL_BANK = {
  openLyo:          { ds: 'lyo',          prog: 'lyo_prog_'  },
  openOusiastika:   { ds: 'ousiastika',   prog: 'ous_prog_'  },
  openLatNouns:     { ds: 'lat-nouns',    prog: 'latn_prog_' },
  openAntonymies:   { ds: 'antonymies',   prog: 'ant_prog_'  },
  openAoristosB:    { ds: 'aoristos-b'    /* live game keeps no per-level progress yet → honest 0 */ },
  openSynirimmena:  { ds: 'synirimmena' },
  openAfwnolekta:   { ds: 'afwnolekta'  },
  openRimataMi:     { ds: 'rimata-mi'   },
  // ── added: every remaining level-based grammar game with a real provider ──
  openEpitheta:     { ds: 'epitheta',     prog: 'ept_prog_'  },
  openParatheta:    { ds: 'paratheta',    prog: 'par_prog_'  },
  openPathitiko:    { ds: 'pathitiko',    prog: 'path_prog_' },
  openNounFill:     { ds: 'noun-fill'     /* legacy chip screen keeps no per-level progress → honest 0 */ },
  openLatEpitheta:  { ds: 'lat-epitheta', prog: 'late_prog_' },
  openLatAntonymies:{ ds: 'lat-antonymies', prog: 'latp_prog_' },
  openLatVerbs:     { ds: 'lat-verbs',    prog: 'latv_prog_' }
};
// Resolve a revamp tile → its level-bank entry (or null = launch directly).
// Uses the same openFn resolution synLaunch uses, then checks both the bank
// map AND that the live provider data actually exists.
window.SYM.levelBankFor = function (tile) {
  var fn = (window.synResolveLaunch && window.synResolveLaunch(tile)) || null;
  if (!fn) return null;
  var entry = window.SYM.LEVEL_BANK[fn];
  if (!entry) return null;
  var prov = window.GP_LEVEL_PROVIDERS && window.GP_LEVEL_PROVIDERS[entry.ds];
  if (!prov || !prov.levels || !prov.levels.length) return null;
  return { fn: fn, ds: entry.ds, prog: entry.prog || null, levels: prov.levels };
};
