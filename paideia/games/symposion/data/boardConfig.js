/* ════════════════════════════════════════════════════════════════════
   Συμπόσιον — Board Configuration
   The ONE place that defines the game's content. To add a subject:
     1. add an entry to `subjects`
     2. drop a few `subject` tiles into `tiles`
     3. add a matching key in data/questions.js
   Nothing in the engine code needs to change.
   ════════════════════════════════════════════════════════════════════ */
(function (root) {

  const subjects = {
    history:    { id: 'history',    label: 'Ἱστορία',    en: 'History',    color: 'var(--sym-gold)',   glyph: 'Ἱ', muse: 'Κλειώ' },
    iliad:      { id: 'iliad',      label: 'Ἰλιάς',      en: 'Epic',       color: 'var(--sym-terra)',  glyph: 'Ἰ', muse: 'Καλλιόπη' },
    verbs:      { id: 'verbs',      label: 'Ῥήματα',     en: 'Verbs',      color: 'var(--sym-sage)',   glyph: 'Ῥ', muse: 'Εὐτέρπη' },
    pronouns:   { id: 'pronouns',   label: 'Ἀντωνυμίαι', en: 'Pronouns',   color: 'var(--sym-aegean)', glyph: 'Ἀ', muse: 'Πολύμνια' },
    adjectives: { id: 'adjectives', label: 'Ἐπίθετα',    en: 'Adjectives', color: 'var(--sub-plum)',   glyph: 'Ἐ', muse: 'Θάλεια' },
    geography:  { id: 'geography',  label: 'Γεωγραφία',  en: 'Geography',  color: 'var(--sub-teal)',   glyph: 'Γ', muse: 'Οὐρανία' },
  };

  const tokens = [
    { id: 't1',  animal: 'eagle',    god: 'Ζεύς',      en: 'Zeus',       color: '#D7A93F' },
    { id: 't2',  animal: 'peacock',  god: 'Ἥρα',       en: 'Hera',       color: '#9B6FB2' },
    { id: 't3',  animal: 'horse',    god: 'Ποσειδῶν',  en: 'Poseidon',   color: '#4E8CA8' },
    { id: 't4',  animal: 'wheat',    god: 'Δημήτηρ',   en: 'Demeter',    color: '#8F9B4C' },
    { id: 't5',  animal: 'owl',      god: 'Ἀθηνᾶ',     en: 'Athena',     color: '#C9A24A' },
    { id: 't6',  animal: 'dolphin',  god: 'Ἀπόλλων',   en: 'Apollo',     color: '#E0934C' },
    { id: 't7',  animal: 'stag',     god: 'Ἄρτεμις',   en: 'Artemis',    color: '#84A6AE' },
    { id: 't8',  animal: 'helmet',   god: 'Ἄρης',      en: 'Ares',       color: '#BE4530' },
    { id: 't9',  animal: 'dove',     god: 'Ἀφροδίτη',  en: 'Aphrodite',  color: '#CE7C9C' },
    { id: 't10', animal: 'hammer',   god: 'Ἥφαιστος',  en: 'Hephaestus', color: '#C85A2C' },
    { id: 't11', animal: 'caduceus', god: 'Ἑρμῆς',     en: 'Hermes',     color: '#5FA288' },
    { id: 't12', animal: 'grapes',   god: 'Διόνυσος',  en: 'Dionysus',   color: '#7E4F96' },
  ];

  const events = [
    /* — gifts to yourself — */
    { id: 'muses',   icon: 'lyre',    title: 'Δῶρον Μουσῶν',    text: 'Οἱ Μοῦσες σὲ εὐνοοῦν — προχώρα 3 βήματα.',          tone: 'good', effect: { type: 'move',     value:  3 } },
    { id: 'hermes',  icon: 'wing',    title: 'Πτερὰ Ἑρμοῦ',     text: 'Ὁ Ἑρμῆς σὲ φτερώνει — προχώρα 2 βήματα.',           tone: 'good', effect: { type: 'move',     value:  2 } },
    { id: 'amphora', icon: 'amphora', title: 'Ἀμφορεὺς Δάφνης', text: 'Βραβεῖο νίκης — κέρδισε 50 δραχμές.',               tone: 'good', effect: { type: 'coins',    value: 50 } },
    { id: 'oracle',  icon: 'tripod',  title: 'Χρησμὸς Δελφῶν',  text: 'Τὸ μαντεῖο σὲ καλεῖ — ξανάριξε τὸ ζάρι.',           tone: 'good', effect: { type: 'reroll',   value:  0 } },

    /* — trials for yourself — */
    { id: 'sphinx',  icon: 'riddle',  title: 'Αἴνιγμα Σφιγγός', text: 'Ἡ Σφίγγα σὲ δοκιμάζει — λύσε τὸ αἴνιγμα!',      tone: 'warn', effect: { type: 'riddle', value:  0 } },
    { id: 'aiolos',  icon: 'wind',    title: 'Ἄνεμοι Αἰόλου',   text: 'Ἀντίθετος ἄνεμος — γύρισε 2 βήματα πίσω.',          tone: 'warn', effect: { type: 'move',     value: -2 } },
    { id: 'agora',   icon: 'coin',    title: 'Φόρος Ἀγορᾶς',    text: 'Πληρώνεις τέλη στὴν ἀγορά — χάνεις 20 δραχμές.',    tone: 'warn', effect: { type: 'coins',    value: -20 } },
    { id: 'kerveros',icon: 'skull',   title: 'Κέρβερος',        text: 'Σὲ πιάνει ὁ φύλακας τοῦ Ἅδη — μεῖνε 1 γύρο.',       tone: 'warn', effect: { type: 'skip',     value:  1 } },

    /* — strikes against your rivals — */
    { id: 'keraunos',icon: 'eagle',   title: 'Κεραυνὸς Διός',   text: 'Ὁ κεραυνὸς τοῦ Διὸς χτυπᾶ τὸν πρωτοπόρο — πάει 3 βήματα πίσω!',  tone: 'strike', effect: { type: 'lead_back',   value: -3 } },
    { id: 'eris',    icon: 'serpent', title: 'Ἔρις',            text: 'Ἡ θεὰ τῆς διχόνοιας σκορπᾶ χάος — ὅλοι οἱ ἀντίπαλοι 2 βήματα πίσω!', tone: 'strike', effect: { type: 'others_move', value: -2 } },
    { id: 'klopi',   icon: 'wing',    title: 'Ἑρμῆς ὁ Κλέπτης', text: 'Ληστεύεις τὸν πλουσιότερο ἀντίπαλο — κερδίζεις 30 δραχμές!',     tone: 'strike', effect: { type: 'steal',      value: 30 } },
    { id: 'hypnos',  icon: 'chains',  title: 'Ὕπνος',           text: 'Ὁ θεὸς τοῦ ὕπνου ναρκώνει τὸν πρωτοπόρο — χάνει 1 γύρο.',        tone: 'strike', effect: { type: 'other_skip',  value:  1 } },
    { id: 'sirens',  icon: 'lyre',    title: 'ᾨδὴ Σειρήνων',    text: 'Τὸ τραγούδι τῶν Σειρήνων ζαλίζει τοὺς ἀντιπάλους — λιγότερος χρόνος στὴν ἑπόμενη ἐρώτησή τους!', tone: 'strike', effect: { type: 'curse_time', value: 9 } },
    { id: 'nemesis', icon: 'laurel',  title: 'Νέμεσις',         text: 'Ἡ Νέμεσις ταπεινώνει τὸν πρωτοπόρο — χάνει 1 δάφνη!',           tone: 'strike', effect: { type: 'steal_laurel', value: 1 } },
    { id: 'medusa',  icon: 'serpent', title: 'Μέδουσα',         text: 'Τὸ βλέμμα της πετρώνει ἕναν τυχαῖο ἀντίπαλο — χάνει 1 γύρο.',    tone: 'strike', effect: { type: 'rand_skip',   value:  1 } },
    { id: 'harpies', icon: 'wing',    title: 'Ἅρπυιαι',         text: "Οἱ Ἅρπυιες ἁρπάζουν 15 δραχμές ἀπ' κάθε ἀντίπαλο!",             tone: 'strike', effect: { type: 'steal_all',   value: 15 } },
    { id: 'charybdis',icon:'wind',    title: 'Χάρυβδις',        text: 'Ἡ δίνη παρασύρει ἕναν τυχαῖο ἀντίπαλο 4 βήματα πίσω.',          tone: 'strike', effect: { type: 'rand_back',   value: -4 } },
    { id: 'typhon',  icon: 'skull',   title: 'Τυφών',           text: 'Τὸ τέρας τῶν τεράτων τρομάζει τοὺς πάντες — ὅλοι οἱ ἀντίπαλοι 3 βήματα πίσω!', tone: 'strike', effect: { type: 'others_move', value: -3 } },
    { id: 'labyrinth',icon:'riddle',  title: 'Λαβύρινθος',      text: 'Χάνεσαι στὸν λαβύρινθο — λύσε ἕνα αἴνιγμα ἢ πήγαινε 3 βήματα πίσω!', tone: 'warn', effect: { type: 'riddle_back', value: -3 } },
    { id: 'hekate',  icon: 'tripod',  title: 'Ἑκάτη',           text: 'Ἡ θεὰ τῆς μαγείας ρίχνει σκοτάδι — οἱ ἀντίπαλοι χάνουν χρόνο στὴν ἑπόμενη ἐρώτηση.', tone: 'strike', effect: { type: 'curse_time', value: 11 } },
    { id: 'erinyes', icon: 'chains',  title: 'Ἐρινύες',         text: 'Οἱ Ἐρινύες κυνηγοῦν τὸν πλουσιότερο — τοῦ ἁρπάζεις 40 δραχμές!', tone: 'strike', effect: { type: 'steal',      value: 40 } },

    /* — the portal — */
    { id: 'portal',  icon: 'caduceus', title: 'Πύλη Ἑρμοῦ',     text: 'Ὁ Ἑρμῆς ἀνοίγει πύλη — στεῖλε ΕΣΕΝΑ ἢ ἕναν ἀντίπαλο σὲ μάθημα τῆς ἐπιλογῆς σου, κι ἀπάντησε ἐκεῖ ἀμέσως!', tone: 'choice', effect: { type: 'teleport', value: 0 } },
  ];

  const tiles = [
    { i: 0,  type: 'start',  label: 'Ἀγορά',    sub: 'START' },
    { i: 1,  type: 'subject', subject: 'history' },
    { i: 2,  type: 'subject', subject: 'iliad' },
    { i: 3,  type: 'event' },
    { i: 4,  type: 'subject', subject: 'verbs' },
    { i: 5,  type: 'subject', subject: 'pronouns' },
    { i: 6,  type: 'subject', subject: 'adjectives' },
    { i: 7,  type: 'corner', label: 'Μοῦσαι',   sub: 'BONUS', icon: 'lyre' },
    { i: 8,  type: 'subject', subject: 'geography' },
    { i: 9,  type: 'subject', subject: 'history' },
    { i: 10, type: 'event' },
    { i: 11, type: 'subject', subject: 'iliad' },
    { i: 12, type: 'subject', subject: 'verbs' },
    { i: 13, type: 'subject', subject: 'pronouns' },
    { i: 14, type: 'jail',   label: 'Τάρταρος', sub: 'JAIL', icon: 'chains' },
    { i: 15, type: 'subject', subject: 'adjectives' },
    { i: 16, type: 'subject', subject: 'geography' },
    { i: 17, type: 'event' },
    { i: 18, type: 'subject', subject: 'history' },
    { i: 19, type: 'subject', subject: 'iliad' },
    { i: 20, type: 'subject', subject: 'verbs' },
    { i: 21, type: 'corner', label: 'Μαντεῖον', sub: 'ORACLE', icon: 'tripod' },
    { i: 22, type: 'subject', subject: 'pronouns' },
    { i: 23, type: 'subject', subject: 'adjectives' },
    { i: 24, type: 'event' },
    { i: 25, type: 'subject', subject: 'geography' },
    { i: 26, type: 'subject', subject: 'history' },
    { i: 27, type: 'subject', subject: 'iliad' },
  ];

  const rules = {
    gridSize: 8,
    startCoins: 100,
    lapBonus: 80,
    lapBonusGrowth: 10,
    maxPlayers: 8,
    jailTurns: 1,
    wrongCoins: 10,
    wrongBack: 2,
    timeoutBack: 1,
    questionCooldown: 12,
    winMode: 'laurels',
    winScore: 5, winCoins: 350, winLaps: 3,
  };

  const winModes = {
    laurels:  { id: 'laurels',  label: 'Δάφνες',     en: 'Laurel Race', icon: 'laurel',
                desc: 'Ὁ πρῶτος ποὺ θὰ μαζέψει τὶς δάφνες (σωστὲς ἀπαντήσεις) νικᾶ.', unit: 'δάφνες',
                targets: { short: 5, normal: 8, long: 12, epic: 20 }, custom: { min: 1, max: 40, step: 1, def: 10 } },
    wealth:   { id: 'wealth',   label: 'Πλοῦτος',    en: 'Wealth', icon: 'coin',
                desc: 'Ὁ πρῶτος ποὺ θὰ συγκεντρώσει τὶς δραχμὲς νικᾶ.', unit: 'δρ.',
                targets: { short: 300, normal: 550, long: 900, epic: 1500 }, custom: { min: 100, max: 5000, step: 50, def: 700 } },
    marathon: { id: 'marathon', label: 'Μαραθώνιος', en: 'Marathon', icon: 'column',
                desc: 'Ὁ πρῶτος ποὺ θὰ ὁλοκληρώσει τοὺς γύρους τοῦ ταμπλό νικᾶ· δάφνες = ἰσοπαλία.', unit: 'γύροι',
                targets: { short: 3, normal: 5, long: 8, epic: 12 }, custom: { min: 1, max: 25, step: 1, def: 6 } },
    polymath: { id: 'polymath', label: 'Πάνσοφος',   en: 'Polymath', icon: 'owl',
                desc: 'Κατάκτησε ΚΑΘΕ μάθημα — ὁ πρῶτος πολυμαθὴς νικᾶ (ἀριθμὸς σωστῶν ἀνὰ μάθημα).', unit: '×/μάθημα',
                targets: { short: 1, normal: 2, long: 3, epic: 4 }, custom: { min: 1, max: 10, step: 1, def: 3 } },
    streak:   { id: 'streak',   label: 'Ἀριστεία',   en: 'Streak', icon: 'wing',
                desc: 'Σερὶ σωστῶν ἀπαντήσεων χωρὶς λάθος — ἕνα σφάλμα τὸ μηδενίζει!', unit: 'σερί',
                targets: { short: 4, normal: 6, long: 9, epic: 12 }, custom: { min: 2, max: 25, step: 1, def: 7 } },
    glory:    { id: 'glory',    label: 'Δόξα',       en: 'Glory', icon: 'amphora',
                desc: 'Δόξα = δάφνες × 100 + δραχμές. Συνδυασμὸς γνώσης καὶ πλούτου.', unit: 'δόξα',
                targets: { short: 600, normal: 1000, long: 1800, epic: 3000 }, custom: { min: 200, max: 8000, step: 100, def: 1500 } },
  };

  const lengths = [
    { id: 'short',  label: 'Σύντομο',  en: 'Short' },
    { id: 'normal', label: 'Κανονικό', en: 'Normal' },
    { id: 'long',   label: 'Μακρύ',    en: 'Long' },
    { id: 'epic',   label: 'Ἔπος',     en: 'Epic' },
  ];

  root.BOARD_CONFIG = { subjects, tokens, events, tiles, rules, winModes, lengths,
    riddleMeta: { id: 'riddles', label: 'Αἴνιγμα', en: 'Riddle', color: 'var(--sym-gold)', glyph: ';', muse: 'Σφίγξ' } };
})(window);
