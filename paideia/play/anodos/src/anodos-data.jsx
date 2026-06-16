/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — map generation + content (Ιλιάδα)
   Plain functions/data exported to window for app.jsx to consume.
   ════════════════════════════════════════════════════════════════════ */

// ── Node-type metadata ──────────────────────────────────────────────
const NODE_TYPES = {
  combat:   { icon: "⚔", label: "Μάχη",     en: "Battle",   accent: "var(--sym-gold)" },
  elite:    { icon: "☠", label: "Ἄριστος",  en: "Elite",    accent: "var(--sym-terra)" },
  mystery:  { icon: "❖", label: "Οἰωνός",   en: "Omen",     accent: "var(--sym-aegean)" },
  riddle:   { icon: "𓁹", label: "Αἴνιγμα",  en: "Riddle",   accent: "var(--sym-aegean)" },
  rest:     { icon: "♨", label: "Κρήνη",    en: "Spring",   accent: "var(--sym-sage)" },
  shop:     { icon: "⚖", label: "Ἀγορά",    en: "Market",   accent: "var(--sym-gold-lt)" },
  treasure: { icon: "❣", label: "Δῶρον",    en: "Gift",     accent: "var(--sym-gold)" },
  boss:     { icon: "♛", label: "Ἕκτωρ",    en: "Boss",     accent: "var(--sym-terra)" },
};

// ── Acts (regions) ───────────────────────────────────────────────────
const ACTS = [
  { id: 1, name: "Πεδίον", en: "The Plain", sub: "Ἡ πεδιάδα τοῦ Σκαμάνδρου",
    blurb: "Ξεκινάς στὴν πεδιάδα, ὅπου οἱ στρατοὶ συγκρούονται κάτω ἀπ' τὰ τείχη.",
    tint: "#C87830", bg: "plain", boss: "sarpidon" },
  { id: 2, name: "Τείχη", en: "The Walls", sub: "Τὰ τείχη τῆς Τροίας",
    blurb: "Φτάνεις στὰ τείχη — οἱ φρουροὶ εἶναι σκληρότεροι, ἡ μάχη πιὸ στενή.",
    tint: "#5E8B96", bg: "walls", boss: "aineias" },
  { id: 3, name: "Ἀκρόπολις", en: "The Citadel", sub: "Ἡ ἀκρόπολις τοῦ Πριάμου",
    blurb: "Ἡ τελευταία ἄνοδος πρὸς τὴν ἀκρόπολη, ὅπου περιμένει ὁ Ἕκτωρ.",
    tint: "#9C3D9E", bg: "citadel", boss: "ektor" },
];

// ── Foes — each combat/elite picks one fitting its tier ──────────────
// intent telegraphs what the foe does when YOU answer wrong.
const FOES = {
  // tier 1 (Act I) ──────────────────────────────
  spearman:  { sigil: "🜂", glyph: "Λ", name: "Τρώς Λογχοφόρος", en: "Trojan Spearman", tier: 1, hp: 3, dmg: 9,  intent: "strike", color: "#C87830" },
  archer:    { sigil: "🏹", glyph: "Τ", name: "Τοξότης τῶν Τειχῶν", en: "Wall Archer", tier: 1, hp: 3, dmg: 8,  intent: "volley", color: "#B0782E" },
  myrmidon:  { sigil: "🐜", glyph: "Μ", name: "Λιποτάκτης Μυρμιδών", en: "Deserter", tier: 1, hp: 3, dmg: 10, intent: "strike", color: "#9C5E1C" },
  // tier 2 (Act II) ─────────────────────────────
  charioteer:{ sigil: "🜨", glyph: "Δ", name: "Ἡνίοχος", en: "Charioteer", tier: 2, hp: 4, dmg: 12, intent: "charge", color: "#5E8B96" },
  priestess: { sigil: "🜍", glyph: "Θ", name: "Ἱέρεια τοῦ Ἀπόλλωνος", en: "Priestess of Apollo", tier: 2, hp: 4, dmg: 11, intent: "curse", color: "#6E9AA6" },
  captain:   { sigil: "⚔", glyph: "Κ", name: "Λοχαγὸς τῶν Δαρδάνων", en: "Dardanian Captain", tier: 2, hp: 4, dmg: 13, intent: "strike", color: "#4E7A86" },
  // tier 3 (Act III) ────────────────────────────
  royalguard:{ sigil: "🛡", glyph: "Φ", name: "Φρουρὸς τῆς Ἀκροπόλεως", en: "Citadel Guard", tier: 3, hp: 4, dmg: 14, intent: "strike", color: "#9C3D9E" },
  amazon:    { sigil: "🜹", glyph: "Π", name: "Πενθεσίλεια", en: "Penthesilea", tier: 3, hp: 5, dmg: 15, intent: "charge", color: "#8C3490" },
  // bosses ──────────────────────────────────────
  sarpidon:  { sigil: "♆", glyph: "Σ", name: "Σαρπηδών", en: "Sarpedon, son of Zeus", tier: 1, boss: true, hp: 5, dmg: 16, intent: "strike", color: "#C87830", quote: "«Υἱὸς τοῦ Διός — δὲν θὰ ὑποχωρήσω.»" },
  aineias:   { sigil: "♅", glyph: "Α", name: "Αἰνείας", en: "Aeneas, born of Aphrodite", tier: 2, boss: true, hp: 6, dmg: 18, intent: "charge", color: "#5E8B96", quote: "«Ἡ μοῖρα μὲ φυλάει γιὰ ἄλλη πόλη.»" },
  ektor:     { sigil: "♛", glyph: "Ε", name: "Ἕκτωρ", en: "Hector, breaker of horses", tier: 3, boss: true, hp: 7, dmg: 20, intent: "strike", color: "#D96B30", quote: "«Εἷς οἰωνὸς ἄριστος — ἀμύνεσθαι περὶ πάτρης.»" },
};

const INTENTS = {
  strike: { icon: "⚔", label: "Πλήττει", desc: (d) => `Θὰ σὲ χτυπήσει γιὰ ${d} μένος.` },
  volley: { icon: "🏹", label: "Ριπή",    desc: (d) => `Ρίχνει βέλη: ${d} μένος.` },
  charge: { icon: "🐎", label: "Ἐφορμᾷ",  desc: (d) => `Ἐφορμᾷ γιὰ ${d} μένος.` },
  curse:  { icon: "🜍", label: "Κατάρα",  desc: (d) => `Κατάρα τοῦ Ἀπόλλωνος: ${d} μένος.` },
};

// ── Curses (μιάσματα) — debuffs inflicted by wrong answers / bad fates ─
// turns = how many node-advances they linger.
const CURSES = {
  bleed:  { id: "bleed",  icon: "🩸", name: "Αἷμορραγία", en: "Bleeding", turns: 3,
            desc: "Χάνεις 4 μένος κάθε φορὰ ποὺ προχωρᾷς κόμβο.", enDesc: "Lose 4 spirit each time you advance a node." },
  dread:  { id: "dread",  icon: "🌑", name: "Δέος",       en: "Dread",    turns: 2,
            desc: "Ξεκινᾷς κάθε μάχη μὲ −6 μένος.", enDesc: "Begin every battle at −6 spirit." },
  skotos: { id: "skotos", icon: "👁", name: "Σκότος",     en: "Darkness", turns: 3,
            desc: "Καμία ὑπόδειξη· οἱ ριπὲς ἔχουν λιγότερο χρόνο.", enDesc: "No hints; volley timers are shorter." },
  burden: { id: "burden", icon: "⛓", name: "Βάρος",      en: "Burden",   turns: 2,
            desc: "Οἱ ἀμοιβὲς τῶν μαχῶν κόβονται στὴ μέση.", enDesc: "Battle rewards are halved." },
  mania:  { id: "mania",  icon: "🔥", name: "Μανία",      en: "Frenzy",   turns: 2,
            desc: "Οἱ ἐχθρικὲς ἐπιθέσεις κάνουν +50% ζημιά.", enDesc: "Enemy strikes deal +50% damage." },
};
const CURSE_POOL = ["bleed", "dread", "skotos", "burden", "mania"];

// ── True/False bank (Ἰλιάδα) — for ⚡ rapid volley ───────────────────
const TF_BANK = [
  { s: "Ὁ Ἀχιλλεὺς ἦταν βασιλιὰς τῶν Μυρμιδόνων.", t: true },
  { s: "Ἡ Ἰλιάδα ἀφηγεῖται ὅλα τὰ δέκα χρόνια τοῦ πολέμου.", t: false },
  { s: "Ὁ Πάτροκλος φόρεσε τὴν πανοπλία τοῦ Ἀχιλλέα.", t: true },
  { s: "Ὁ Ἕκτωρ ἦταν ἀδελφὸς τοῦ Ἀγαμέμνονος.", t: false },
  { s: "Ἡ Θέτις ἦταν ἡ μητέρα τοῦ Ἀχιλλέα.", t: true },
  { s: "Ὁ Πάρις σκότωσε τὸν Ἀχιλλέα μὲ βέλος στὴ φτέρνα.", t: true },
  { s: "Ἡ Ἀθηνᾶ ὑποστήριζε τοὺς Τρῶες.", t: false },
  { s: "Ὁ Ἀγαμέμνων ἦταν ἀρχιστράτηγος τῶν Ἀχαιῶν.", t: true },
  { s: "Τὸ ἔπος ξεκινᾷ μὲ τὴ λέξη «μῆνιν».", t: true },
  { s: "Ὁ Νέστωρ ἦταν ὁ νεότερος τῶν Ἀχαιῶν ἀρχηγῶν.", t: false },
  { s: "Ὁ Πρίαμος ἱκέτεψε τὸν Ἀχιλλέα γιὰ τὸ σῶμα τοῦ Ἕκτορα.", t: true },
  { s: "Ἡ Ἑλένη ἦταν σύζυγος τοῦ Ἀγαμέμνονος.", t: false },
  { s: "Ὁ Αἴας ὁ Τελαμώνιος ξεχώριζε γιὰ τὸ μέγεθος καὶ τὴ δύναμή του.", t: true },
  { s: "Ὁ Σκάμανδρος εἶναι ὄρος κοντὰ στὴν Τροία.", t: false },
];

// ── Relic pool (περίαπτα) ────────────────────────────────────────────
const RELICS = [
  { id: "aspis",    icon: "🛡", name: "Ἀσπὶς Ἀχιλλέως", desc: "Η πρώτη λάθος απάντηση κάθε μάχης δεν κοστίζει μένος.", en: "First wrong answer per battle costs no spirit." },
  { id: "laurel",   icon: "🌿", name: "Δάφνινο Στέφανι", desc: "+20% XP από κάθε νίκη.", en: "+20% XP from every victory." },
  { id: "sandals",  icon: "🪶", name: "Πτερόεντα Πέδιλα", desc: "Κάθε λάθος απάντηση κοστίζει 30% λιγότερο μένος.", en: "Wrong answers cost 30% less spirit." },
  { id: "ambrosia", icon: "🍯", name: "Ἀμβροσία", desc: "+25 ανώτατο μένος.", en: "+25 max spirit." },
  { id: "obol",     icon: "🪙", name: "Ὀβολὸς τοῦ Χάροντος", desc: "Κερδίζεις +5 δραχμές σε κάθε μάχη.", en: "+5 drachmas from each battle." },
  { id: "aegis",    icon: "🐍", name: "Αἰγὶς τῆς Ἀθηνᾶς", desc: "Ξεκινάς κάθε ελίτ μάχη με μία βοήθεια (50/50).", en: "Start each elite with a 50/50 lifeline." },
  { id: "muse",     icon: "🎼", name: "Φωνὴ τῆς Μούσης", desc: "Κάθε ερώτηση δείχνει μία μικρή υπόδειξη.", en: "Every question shows a small hint." },
  { id: "lyre",     icon: "🎻", name: "Λύρα τοῦ Ὀρφέως", desc: "Οι κρήνες θεραπεύουν +15 επιπλέον μένος.", en: "Springs heal +15 extra spirit." },
  { id: "shield2",  icon: "🏺", name: "Ἀμφορεὺς Νέκταρος", desc: "Μία φορά ανά άνοδο: ανάστησε με 30 μένος.", en: "Once per climb: revive with 30 spirit." },
  { id: "spear",    icon: "🗡", name: "Δόρυ τοῦ Πηλέως", desc: "Οι σωστές απαντήσεις δίνουν +50% δραχμές.", en: "Correct answers grant +50% drachmas." },
];

// ── Iliad question bank ──────────────────────────────────────────────
const QUESTIONS = [
  { q: "Με ποια λέξη ανοίγει η Ἰλιάδα;", greek: true,
    opts: ["Μῆνιν", "Ἄνδρα", "Ὄλβιος", "Ἔπος"], a: 0,
    hint: "Η «ὀργή» του Ἀχιλλέα." },
  { q: "Ποιος είναι ο βασιλιάς των Μυκηνών και αρχιστράτηγος των Αχαιών;",
    opts: ["Μενέλαος", "Ἀγαμέμνων", "Ὀδυσσεύς", "Νέστωρ"], a: 1,
    hint: "Ὁ ἀδελφὸς τοῦ Μενελάου." },
  { q: "Τίνος η αρπαγή ξεκίνησε τον Τρωικό πόλεμο;",
    opts: ["Ἀνδρομάχης", "Βρισηίδος", "Ἑλένης", "Χρυσηίδος"], a: 2,
    hint: "«Τὸ πρόσωπο ποὺ κίνησε χίλια πλοῖα.»" },
  { q: "Ποιος σκότωσε τον Ἕκτορα;",
    opts: ["Αἴας", "Ἀχιλλεύς", "Διομήδης", "Πάτροκλος"], a: 1,
    hint: "Ὁ ἥρωας μὲ τὴ θνητὴ φτέρνα." },
  { q: "Ποιο επίθετο συνοδεύει συχνά τον Ὀδυσσέα;",
    opts: ["ποδάρκης", "πολύτροπος", "κορυθαίολος", "ῥοδοδάκτυλος"], a: 1,
    hint: "«Πολυμήχανος», γεμάτος τεχνάσματα." },
  { q: "Ποιος φόρεσε την πανοπλία του Ἀχιλλέα και έπεσε από τον Ἕκτορα;",
    opts: ["Πάτροκλος", "Ἀντίλοχος", "Τεῦκρος", "Μηριόνης"], a: 0,
    hint: "Ὁ πιὸ ἀγαπημένος σύντροφος τοῦ Ἀχιλλέα." },
  { q: "Ποια θεά προστατεύει τους Αχαιούς και ιδίως τον Ὀδυσσέα;",
    opts: ["Ἀφροδίτη", "Ἥρα", "Ἀθηνᾶ", "Ἄρτεμις"], a: 2,
    hint: "Ἡ θεὰ τῆς σοφίας, γεννημένη ἀπ' τὸ κεφάλι τοῦ Διός." },
  { q: "«κορυθαίολος» — τι σημαίνει το επίθετο του Ἕκτορα;", greek: true,
    opts: ["ταχύπους", "μὲ τὴ λαμπερὴ περικεφαλαία", "μεγαλόψυχος", "θρασύς"], a: 1,
    hint: "κόρυς = περικεφαλαία." },
  { q: "Ποιος γέρος βασιλιάς ικετεύει τον Ἀχιλλέα για το σώμα του γιου του;",
    opts: ["Νέστωρ", "Πρίαμος", "Λαέρτης", "Πηλεύς"], a: 1,
    hint: "Ὁ βασιλιὰς τῆς Τροίας, πατέρας τοῦ Ἕκτορα." },
  { q: "Πόσα χρόνια κράτησε ο Τρωικός πόλεμος κατά την παράδοση;",
    opts: ["Ἑπτά", "Δέκα", "Δώδεκα", "Εἴκοσι"], a: 1,
    hint: "Ὁ ἴδιος ἀριθμὸς μὲ τὰ χρόνια τοῦ νόστου τοῦ Ὀδυσσέα." },
  { q: "Ποιος Τρώας πρίγκιπας ήταν ο πιο γενναίος υπερασπιστής της πόλης;",
    opts: ["Πάρις", "Αἰνείας", "Ἕκτωρ", "Δηίφοβος"], a: 2,
    hint: "Σύζυγος τῆς Ἀνδρομάχης." },
  { q: "«ῥοδοδάκτυλος Ἠώς» — τι περιγράφει η φράση;", greek: true,
    opts: ["τὸ ἡλιοβασίλεμα", "τὴ ροδίσια αὐγή", "τὴ θάλασσα", "τὴ μάχη"], a: 1,
    hint: "Ἠώς = ἡ θεὰ τῆς αὐγῆς." },
];

// ── Mystery events (Οἰωνός) ──────────────────────────────────────────
const EVENTS = [
  {
    title: "Ὁ μάντις Κάλχας", sub: "A seer blocks the path",
    body: "Ένας τυφλός μάντης σου προσφέρει μια προφητεία — αλλά οι θεοί ζητούν θυσία. Τι κάνεις;",
    choices: [
      { icon: "🔮", name: "Δέξου την προφητεία", desc: "Χάσε 12 μένος, κέρδισε ένα περίαπτο.", effect: { menos: -12, relic: true } },
      { icon: "🚶", name: "Προσπέρασε σιωπηλά", desc: "Τίποτα δεν αλλάζει. Συνέχισε την άνοδο.", effect: {} },
      { icon: "💰", name: "Πλήρωσε για ευλογία", desc: "Δώσε 35 δραχμές, κέρδισε +18 μένος.", effect: { drachmes: -35, menos: 18, needDrachmes: 35 } },
    ],
  },
  {
    title: "Ναυάγιο στην ακτή", sub: "A wreck on the shore",
    body: "Βρίσκεις τα συντρίμμια ενός πλοίου. Μέσα λάμπει κάτι — αλλά τα κύματα είναι επικίνδυνα.",
    choices: [
      { icon: "🌊", name: "Βούτα στα νερά", desc: "50% για περίαπτο, αλλιώς χάσε 10 μένος.", effect: { gamble: true } },
      { icon: "🪙", name: "Μάζεψε ό,τι ξεβράζει", desc: "Κέρδισε 40 δραχμές με ασφάλεια.", effect: { drachmes: 40 } },
      { icon: "🔥", name: "Κάψε τα ξύλα για ξεκούραση", desc: "Θεραπεύσου +20 μένος.", effect: { menos: 20 } },
    ],
  },
  {
    title: "Τὸ αἴνιγμα τῆς Σφιγγός", sub: "The Sphinx's riddle",
    body: "Μια Σφίγγα σου θέτει ένα γρίφο. Απάντησε σωστά για πλούσια ανταμοιβή — λάθος και θα πληρώσεις.",
    riddle: true,
    riddleQ: "«Τὸ πρωὶ τέσσερα, τὸ μεσημέρι δύο, τὸ βράδυ τρία.» Τι είναι;",
    riddleOpts: ["Ὁ ἥλιος", "Ὁ ἄνθρωπος", "Ὁ ποταμός", "Ὁ χρόνος"],
    riddleA: 1,
    winEffect: { drachmes: 50, relic: true },
    loseEffect: { menos: -15 },
  },
  {
    title: "Ὁ γρῖος Πρωτεύς", sub: "The riddle of Proteus",
    body: "Ὁ γέροντας τῆς θάλασσας ἀλλάζει μορφές — λῦσε τὸ αἴνιγμά του γιὰ νὰ σοῦ προφητέψει.",
    riddle: true,
    riddleQ: "«Ὅσο περισσότερο μοῦ παίρνεις, τόσο μεγαλώνω.» Τί εἶμαι;",
    riddleOpts: ["Ἡ σκιά", "Ὁ λάκκος", "Ὁ χρόνος", "Ἡ φωτιά"],
    riddleA: 1,
  },
  {
    title: "Αἴνιγμα τοῦ Ἅιδου", sub: "A riddle from the dark",
    body: "Μιὰ σκιὰ στὸ μονοπάτι ψιθυρίζει ἕνα γρίφο.",
    riddle: true,
    riddleQ: "«Δὲν ἔχω φωνή, μὰ μιλῶ· δὲν ἔχω φτερά, μὰ πετῶ.» Τί εἶμαι;",
    riddleOpts: ["Ὁ ἄνεμος", "Ἡ ἠχώ", "Τὸ ὄνειρο", "Ὁ καπνός"],
    riddleA: 1,
  },
  {
    title: "Ἡ κλήρωσις τῶν Μοιρῶν", sub: "The lots of the Fates",
    body: "Οἱ τρεῖς Μοῖρες κρατοῦν τὸ νῆμα σου καὶ θέτουν ἕνα αἴνιγμα.",
    riddle: true,
    riddleQ: "«Τρεῖς ἀδελφές: ἡ μία κλώθει, ἡ ἄλλη μετρᾷ, ἡ τρίτη κόβει.» Ποιά κόβει τὸ νῆμα;",
    riddleOpts: ["Κλωθώ", "Λάχεσις", "Ἄτροπος", "Νέμεσις"],
    riddleA: 2,
  },
];

// ── PATRON GODS (πάτρωνες) — chosen at the gate, a run-shaping passive ─
const PATRONS = [
  { id: "none",   icon: "—", glyph: "∅", name: "Ἄθεος",   en: "Godless",  color: "var(--sym-stone)",
    tag: "Καμία εὐλογία", desc: "Ἀνέβα μόνος σου — χωρὶς τὴ χάρη κανενὸς θεοῦ.", enDesc: "Climb alone, with no god's favour." },
  { id: "athena", icon: "🦉", glyph: "Α", name: "Ἀθηνᾶ",   en: "Athena",   color: "#5E8B96",
    tag: "Σοφία", desc: "Κάθε μάχη ξεκινᾷ μὲ δωρεὰν Δίχασιν (50/50) στὴν πρώτη ἐρώτηση.", enDesc: "Every battle opens with a free 50/50 on the first question." },
  { id: "ares",   icon: "⚔", glyph: "Ἄ", name: "Ἄρης",    en: "Ares",     color: "#D96B30",
    tag: "Πόλεμος", desc: "+60% δραχμὲς ἀπὸ σωστὲς ἀπαντήσεις — ὅμως οἱ ἐχθροὶ χτυποῦν +25% σκληρότερα.", enDesc: "+60% drachmas from correct answers — but foes strike +25% harder." },
  { id: "hermes", icon: "🪶", glyph: "Ἑ", name: "Ἑρμῆς",   en: "Hermes",   color: "#C9A24B",
    tag: "Ταχύτης", desc: "Οἱ ταχεῖες ριπὲς ἔχουν +2,5″ καί προβλέπεις πάντα κάθε κόμβο.", enDesc: "+2.5s on rapid volleys, and you always foresee every node." },
  { id: "apollo", icon: "🎼", glyph: "Ἀ", name: "Ἀπόλλων", en: "Apollo",   color: "#C0306A",
    tag: "Μαντεία", desc: "Κάθε ἐρώτηση δείχνει ὑπόδειξη, καὶ οἱ κρῆνες θεραπεύουν +12 ἐπιπλέον.", enDesc: "Every question shows a hint, and springs heal +12 more." },
];
const PATRON_BY_ID = Object.fromEntries(PATRONS.map((p) => [p.id, p]));

// ── ΑΝΑΒΑΣΙΣ (ascension) — difficulty ladder unlocked by winning ──────
// each tier ADDS one modifier; climbing at level N stacks tiers 1..N.
const ANABASIS = [
  { lvl: 0, name: "Θνητός",      en: "Mortal",      desc: "Ἡ κανονικὴ ἄνοδος." },
  { lvl: 1, name: "Ἥρως",        en: "Hero",        desc: "Οἱ ἐχθροὶ χτυποῦν +15% σκληρότερα.",            mod: { dmgMult: 1.15 } },
  { lvl: 2, name: "Ἡμίθεος",     en: "Demigod",     desc: "Τὰ μιάσματα διαρκοῦν ἕναν κόμβο παραπάνω.",      mod: { curseTurns: 1 } },
  { lvl: 3, name: "Ἐπώνυμος",    en: "Renowned",    desc: "Οἱ ἀγορὲς χρεώνουν +35%.",                      mod: { shopMult: 1.35 } },
  { lvl: 4, name: "Ἔνδοξος",     en: "Glorious",    desc: "Τὰ λάθη φέρνουν μίασμα συχνότερα (+18%).",        mod: { curseChanceAdd: 0.18 } },
  { lvl: 5, name: "Ἀρίστευτος",  en: "Champion",    desc: "Ξεκινᾷς κάθε ἄνοδο μὲ −15 μένος.",                mod: { startMenosLoss: 15 } },
  { lvl: 6, name: "Ἰσόθεος",     en: "Godlike",     desc: "Οἱ κρῆνες θεραπεύουν τὸ μισό.",                  mod: { restMult: 0.5 } },
  { lvl: 7, name: "Ὀλύμπιος",    en: "Olympian",    desc: "Οἱ ἄρχοντες ἔχουν +1 ζωή.",                      mod: { bossHpAdd: 1 } },
  { lvl: 8, name: "Τιτάν",       en: "Titan",       desc: "Οἱ ἐχθροὶ χτυποῦν ἀκόμη +15% (σύνολο).",         mod: { dmgMult: 1.15 } },
  { lvl: 9, name: "Πρωτόγονος",  en: "Primordial",  desc: "Οἱ ἀμοιβὲς τῶν μαχῶν κόβονται 20%.",             mod: { rewardMult: 0.8 } },
  { lvl: 10, name: "Μοῖρα",      en: "Fate",        desc: "Ὅλα μαζί, ἐντονότερα. Ἡ ἔσχατη δοκιμασία.",      mod: { dmgMult: 1.1, curseChanceAdd: 0.1, bossHpAdd: 1 } },
];
const ANABASIS_MAX = ANABASIS.length - 1;

// cumulative modifiers for climbing at a given level (folds tiers 1..lvl)
function anabasisMods(lvl) {
  const m = { dmgMult: 1, curseTurns: 0, shopMult: 1, curseChanceAdd: 0, startMenosLoss: 0, restMult: 1, bossHpAdd: 0, rewardMult: 1 };
  for (let i = 1; i <= Math.min(lvl, ANABASIS_MAX); i++) {
    const mod = ANABASIS[i] && ANABASIS[i].mod; if (!mod) continue;
    if (mod.dmgMult) m.dmgMult *= mod.dmgMult;
    if (mod.curseTurns) m.curseTurns += mod.curseTurns;
    if (mod.shopMult) m.shopMult *= mod.shopMult;
    if (mod.curseChanceAdd) m.curseChanceAdd += mod.curseChanceAdd;
    if (mod.startMenosLoss) m.startMenosLoss += mod.startMenosLoss;
    if (mod.restMult) m.restMult *= mod.restMult;
    if (mod.bossHpAdd) m.bossHpAdd += mod.bossHpAdd;
    if (mod.rewardMult) m.rewardMult *= mod.rewardMult;
  }
  return m;
}

// ── BOSS MECHANICS — each act-lord fights with a signature ────────────
const BOSS_MECHANICS = {
  sarpidon: { kind: "shield", icon: "🛡", name: "Αἰγὶς τοῦ Διός", en: "Aegis of Zeus",
    telegraph: "Θωρακισμένος — κάθε δεύτερη πληγὴ ἀναχαιτίζεται ὥσπου ὁ Ζεὺς νὰ κοιτάξει ἀλλοῦ.",
    enTel: "Shielded — every other wound is turned aside until Zeus looks away." },
  aineias:  { kind: "flee", icon: "🪽", name: "Φυγὴ τῆς Μοίρας", en: "Fated Escape",
    telegraph: "Ἡ μοῖρα τὸν φυλάει γι' ἄλλη πόλη — ἂν ἀργήσεις, δραπετεύει.",
    enTel: "Fate saves him for another city — stall and he slips away." },
  ektor:    { kind: "counter", icon: "⚔", name: "Ἀντίκρουσις", en: "Riposte",
    telegraph: "Κάθε δεύτερη πληγὴ ποὺ τοῦ δίνεις, ἀνταποδίδει χτύπημα.",
    enTel: "Every second wound you land, he strikes you back." },
};

// ── deterministic daily seed (same map for everyone, per calendar day) ─
function todayKey(d) { d = d || new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
function dailySeed(d) {
  const k = todayKey(d); let h = 2166136261 >>> 0;
  for (let i = 0; i < k.length; i++) { h ^= k.charCodeAt(i); h = Math.imul(h, 16777619); }
  return (h >>> 0) % 1e9;
}

// ── Deterministic RNG (mulberry32) ───────────────────────────────────
function makeRng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Weighted pick ────────────────────────────────────────────────────
function weightedType(rng, floorInAct, actLen) {
  const w = floorInAct === 0
    ? { combat: 6, mystery: 3 }
    : { combat: 4.5, mystery: 3, riddle: 1.6, elite: 2, shop: 1.3, rest: 1.1 };
  const entries = Object.entries(w);
  const sum = entries.reduce((s, [, v]) => s + v, 0);
  let r = rng() * sum;
  for (const [k, v] of entries) { if ((r -= v) < 0) return k; }
  return "combat";
}

// pick a combat format (verb) so fights aren't all the same
function pickFormat(rng, type) {
  if (type === "elite") {
    // elites lean harder/spicier
    const r = rng();
    return r < 0.45 ? "mc" : r < 0.8 ? "volley" : "duel";
  }
  const r = rng();
  return r < 0.55 ? "mc" : r < 0.85 ? "volley" : "duel";
}

// pick a foe id for a node by act/tier
function pickFoe(rng, act, type) {
  if (type === "boss") return ACTS[act - 1].boss;
  const pool = Object.entries(FOES).filter(([, f]) => f.tier === act && !f.boss);
  if (!pool.length) return Object.keys(FOES)[0];
  return pool[Math.floor(rng() * pool.length)][0];
}

// ── Map generator — 3 ACTS, each a branching DAG capped by a boss ────
function generateMap(seed, floorsHint) {
  const rng = makeRng(seed);
  const COLS = 6, PATHS = 6;
  // split the requested climb height across 3 acts
  const perAct = Math.max(3, Math.round(floorsHint / 3));
  const actLens = [perAct, perAct, perAct]; // climb floors per act (boss adds 1 each)

  let gf = 0;          // global floor counter (bottom = 0)
  let idc = 0;
  const nodes = [];
  const byId = {};
  const add = (n) => { nodes.push(n); byId[n.id] = n; return n; };
  const link = (a, b) => {
    if (!a.next.includes(b.id)) a.next.push(b.id);
    if (!b.prev.includes(a.id)) b.prev.push(a.id);
  };

  let startIds = [];
  let prevTopNodes = null;   // top climb-floor nodes of the previous act (or [boss])
  const bossIds = [];

  for (let act = 1; act <= 3; act++) {
    const len = actLens[act - 1];
    const grid = Array.from({ length: len }, () => ({}));
    const ensure = (fLocal, c) => {
      if (!grid[fLocal][c]) {
        grid[fLocal][c] = add({ id: "n" + idc++, floor: gf + fLocal, col: c, act, next: [], prev: [], type: null });
      }
      return grid[fLocal][c];
    };

    // walk routes upward within the act
    for (let p = 0; p < PATHS; p++) {
      let col = Math.floor(rng() * COLS);
      let node = ensure(0, col);
      for (let f = 1; f < len; f++) {
        let nc = Math.max(0, Math.min(COLS - 1, col + (Math.floor(rng() * 3) - 1)));
        const nn = ensure(f, nc);
        link(node, nn); col = nc; node = nn;
      }
    }

    // assign node types within the act
    const treasureF = Math.max(1, Math.round(len * 0.5));
    const restF = len - 1;
    for (let f = 0; f < len; f++) {
      for (const c in grid[f]) {
        const n = grid[f][c];
        if (act === 1 && f === 0) n.type = "combat";
        else if (f === treasureF && act > 1) n.type = "treasure";
        else if (f === restF) n.type = "rest";
        else n.type = weightedType(rng, f, len);
        // assign foe + format for fights
        if (n.type === "combat" || n.type === "elite") {
          n.foe = pickFoe(rng, act, n.type);
          n.format = pickFormat(rng, n.type);
        }
      }
    }

    const floorZero = Object.values(grid[0]);
    if (act === 1) startIds = floorZero.map((n) => n.id);
    else if (prevTopNodes) {
      // connect previous boss -> this act's first floor
      for (const pn of prevTopNodes) for (const fz of floorZero) link(pn, fz);
    }

    // boss node on top of the act
    const isFinal = act === 3;
    const boss = add({ id: "boss" + act, floor: gf + len, col: 2.5, act, next: [], prev: [], type: "boss", foe: ACTS[act - 1].boss, final: isFinal });
    bossIds.push(boss.id);
    for (const c in grid[len - 1]) link(grid[len - 1][c], boss);

    prevTopNodes = [boss];
    gf += len + 1; // climb floors + boss floor
  }

  const totalFloors = gf; // includes boss floors
  return { seed, floors: totalFloors, nodes, startIds, bossIds, finalBossId: "boss3", cols: COLS, actLens };
}

// expose
Object.assign(window, { NODE_TYPES, ACTS, FOES, INTENTS, CURSES, CURSE_POOL, RELICS, QUESTIONS, TF_BANK, EVENTS, generateMap, makeRng, pickFoe,
  PATRONS, PATRON_BY_ID, ANABASIS, ANABASIS_MAX, anabasisMods, BOSS_MECHANICS, dailySeed, todayKey });
