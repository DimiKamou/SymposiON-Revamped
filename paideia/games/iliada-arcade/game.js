/* ============================================================
   ΙΛΙΑΔΑ Arcade — game.js
   Single-file canvas arcade with quiz system.
   ============================================================ */

(function () {
'use strict';

/* ════════════════════════════════════════════════════════════
   TRANSLATIONS
   ════════════════════════════════════════════════════════════ */
const TR = {
  en: {
    title: 'ILIAD', subtitle: 'The Epic Arcade',
    play: 'PLAY', dashboard: 'PROGRESS', back: '← Back',
    chooseDiff: 'Choose Difficulty', chooseCtrl: 'Control Mode',
    chooseBook: 'Choose Your Battle', bookSubtitle: 'Select a Rhapsody to fight through',
    mortal: 'MORTAL', hero: 'HERO', god: 'GOD-TIER',
    mortalStats: 'No timer · ×1 score\nNormal speed · 4 dmg\nArrows on wave 2+',
    heroStats: '30 sec timer · ×2 score\nFaster enemies · 8 dmg\n↓ Arrow rain from wave 2',
    godStats:  '15 sec timer · ×3 score\nSwift enemies · 14 dmg\n↓↓ Heavy arrow barrage',
    keyboard: 'Keyboard', touch: 'Touch',
    kbDesc: 'Arrow keys / WASD', touchDesc: 'On-screen D-pad',
    wave: 'Wave', of: 'of', waveCleared: 'WAVE CLEARED!', quizTime: 'Quiz Time — Answer to Continue',
    score: 'SCORE', hp: 'HP', combo: 'COMBO',
    continue: 'CONTINUE BATTLE',
    correct: 'Correct!', wrong: 'Wrong!', timeout: "Time's up!",
    results: 'BATTLE COMPLETE', playAgain: 'PLAY AGAIN', changeBook: 'CHANGE BOOK', home: 'HOME',
    totalScore: 'SCORE', correctQ: 'CORRECT', maxCombo: 'COMBO', kills: 'KILLS',
    missed: 'Missed Questions', correct_ans: 'Correct answer: ',
    dashTitle: 'PROGRESS', globalScore: 'TOTAL SCORE', perfectQ: 'PERFECT Q',
    bestScore: 'Best', plays: 'plays',
    blockText: 'BLOCK!', hero_achilles: 'Achilles', hero_hector: 'Hector', hero_patroclus: 'Patroclus',
  },
  gr: {
    title: 'ΙΛΙΑΔΑ', subtitle: 'Η Επική Αρκάντα',
    play: 'ΠΑΙΞΕ', dashboard: 'ΠΡΟΟΔΟΣ', back: '← Πίσω',
    chooseDiff: 'Επίλεξε Δυσκολία', chooseCtrl: 'Τρόπος Ελέγχου',
    chooseBook: 'Επίλεξε τη Μάχη σου', bookSubtitle: 'Επίλεξε μια Ραψωδία',
    mortal: 'ΘΝΗΤΟΣ', hero: 'ΗΡΩΑΣ', god: 'ΘΕΟΣ',
    mortalStats: 'Χωρίς χρόνο · ×1 σκορ\nΚανονική ταχύτητα · 4 ζημιά\nΒέλη από κύμα 2+',
    heroStats: '30 δευτ. · ×2 σκορ\nΠιο γρήγοροι εχθροί · 8 ζημιά\n↓ Βέλη από κύμα 2',
    godStats:  '15 δευτ. · ×3 σκορ\nΤαχύτατοι εχθροί · 14 ζημιά\n↓↓ Καταιγισμός βελών',
    keyboard: 'Πληκτρολόγιο', touch: 'Αφή',
    kbDesc: 'Βέλη / WASD', touchDesc: 'Εικονικό D-pad',
    wave: 'Κύμα', of: 'από', waveCleared: 'ΚΥΜΑ ΤΕΛΕΙΩΣΕ!', quizTime: 'Απάντησε για να Συνεχίσεις',
    score: 'ΣΚΟΡ', hp: 'ΖΩΗ', combo: 'COMBO',
    continue: 'ΣΥΝΕΧΙΣΕ ΤΗ ΜΑΧΗ',
    correct: 'Σωστό!', wrong: 'Λάθος!', timeout: 'Έληξε!',
    results: 'Η ΜΑΧΗ ΤΕΛΕΙΩΣΕ', playAgain: 'ΠΑΙΞε ΞΑΝΑ', changeBook: 'ΑΛΛΑΞΕ ΒΙΒΛΙΟ', home: 'ΑΡΧΗ',
    totalScore: 'ΣΚΟΡ', correctQ: 'ΣΩΣΤΕΣ', maxCombo: 'COMBO', kills: 'ΝΙΚΕΣ',
    missed: 'Χαμένες Ερωτήσεις', correct_ans: 'Σωστή απάντηση: ',
    dashTitle: 'ΠΡΟΟΔΟΣ', globalScore: 'ΣΥΝΟΛΙΚΟ ΣΚΟΡ', perfectQ: 'ΤΕΛΕΙΑ ΕΡΩΤ.',
    bestScore: 'Καλύτερο', plays: 'παρτίδες',
    blockText: 'ΜΠΛΟΚ!', hero_achilles: 'Αχιλλέας', hero_hector: 'Έκτωρ', hero_patroclus: 'Πάτροκλος',
  }
};

/* ════════════════════════════════════════════════════════════
   BOOK DATA
   ════════════════════════════════════════════════════════════ */
const BOOKS = [
  {
    id: 1, roman: 'I', heroKey: 'achilles', heroColor: '#4A8FD4',
    en: { name: 'Book I', title: 'The Wrath', tagline: "The quarrel with Agamemnon", hero: 'Achilles' },
    gr: { name: 'Ραψωδία Α', title: 'Η Μήνις', tagline: 'Η έρις με τον Αγαμέμνονα', hero: 'Αχιλλέας' },
    questions: [
      { en: { q: "What causes Achilles to withdraw from battle?", opts: ["A spear wound", "Agamemnon takes Briseis", "A divine command", "His armor is stolen"], ans: 1, exp: "Agamemnon threatens to take Briseis, Achilles's prize of honor, as compensation for returning Chryseis. This dishonor enrages Achilles and causes him to withdraw from the fighting." }, gr: { q: "Τι προκαλεί την αποχώρηση του Αχιλλέα;", opts: ["Ένα τραύμα από δόρυ", "Ο Αγαμέμνων παίρνει τη Βρισηίδα", "Θεία εντολή", "Του κλέβουν την πανοπλία"], ans: 1, exp: "Ο Αγαμέμνων απειλεί να πάρει τη Βρισηίδα, το έπαθλο τιμής του Αχιλλέα. Αυτή η ύβρις εξοργίζει τον Αχιλλέα." } },
      { en: { q: "Who does Achilles pray to for revenge against the Greeks?", opts: ["Zeus", "Apollo", "Thetis", "Athena"], ans: 2, exp: "Achilles prays to his mother Thetis, a sea-nymph, asking her to intercede with Zeus so the Greeks will suffer without him." }, gr: { q: "Σε ποιον προσεύχεται ο Αχιλλέας για εκδίκηση;", opts: ["Στον Δία", "Στον Απόλλωνα", "Στη Θέτιδα", "Στην Αθηνά"], ans: 2, exp: "Ο Αχιλλέας προσεύχεται στη μητέρα του Θέτιδα, ζητώντας της να μεσολαβήσει στον Δία." } },
      { en: { q: "What does the priest Chryses ask the Greeks to return?", opts: ["Gold ransom", "His daughter Chryseis", "Sacred weapons", "A holy ox"], ans: 1, exp: "Chryses, a priest of Apollo, comes to ransom his daughter Chryseis. When Agamemnon refuses, Apollo sends a plague upon the Greek camp." }, gr: { q: "Τι ζητά ο ιερέας Χρύσης να επιστρέψουν οι Έλληνες;", opts: ["Χρυσά λύτρα", "Την κόρη του Χρυσηίδα", "Ιερά όπλα", "Έναν ιερό βόδι"], ans: 1, exp: "Ο Χρύσης, ιερέας του Απόλλωνα, έρχεται να λυτρώσει την κόρη του. Ο Αγαμέμνων αρνείται και ο Απόλλων στέλνει λοιμό." } },
      { en: { q: "Who stops Achilles from drawing his sword against Agamemnon?", opts: ["Hera", "Athena", "Zeus", "Odysseus"], ans: 1, exp: "Athena, sent by Hera, appears only to Achilles, grabs his hair, and urges him to use words instead. She promises triple honor in the future." }, gr: { q: "Ποιος σταματά τον Αχιλλέα να βγάλει το ξίφος του;", opts: ["Η Ήρα", "Η Αθηνά", "Ο Δίας", "Ο Οδυσσέας"], ans: 1, exp: "Η Αθηνά, σταλμένη από την Ήρα, εμφανίζεται μόνο στον Αχιλλέα και τον αρπάζει από τα μαλλιά, παρακινώντας τον να χρησιμοποιήσει λόγια." } }
    ]
  },
  {
    id: 6, roman: 'VI', heroKey: 'hector', heroColor: '#4AA870',
    en: { name: 'Book VI', title: 'Hector & Andromache', tagline: "Love and duty at Troy's gates", hero: 'Hector' },
    gr: { name: 'Ραψωδία Ζ', title: 'Έκτωρ & Ανδρομάχη', tagline: 'Αγάπη και καθήκον στις πύλες', hero: 'Έκτωρ' },
    questions: [
      { en: { q: "Where does Hector find Andromache in Book VI?", opts: ["In the temple of Athena", "In their bedroom", "On the walls of Troy", "At the Scaean Gate"], ans: 3, exp: "Hector finds Andromache at the Scaean Gate, the main gate of Troy, watching the battle with their infant son Astyanax and a nurse." }, gr: { q: "Πού βρίσκει ο Έκτωρ την Ανδρομάχη;", opts: ["Στον ναό της Αθηνάς", "Στην κρεβατοκάμαρά τους", "Στα τείχη της Τροίας", "Στη Σκαιά Πύλη"], ans: 3, exp: "Ο Έκτωρ βρίσκει την Ανδρομάχη στη Σκαιά Πύλη, παρακολουθώντας τη μάχη με τον βρέφος γιο τους Αστυάνακτα." } },
      { en: { q: "What does Andromache ask Hector NOT to do?", opts: ["Pray to Apollo", "Fight in the front lines", "Surrender to the Greeks", "Leave Troy forever"], ans: 1, exp: "Andromache begs Hector not to fight in the front lines, knowing he will die there. She tells him he is her father, mother, brother, and husband — her everything." }, gr: { q: "Τι ζητά η Ανδρομάχη από τον Έκτορα να ΜΗΝ κάνει;", opts: ["Να προσευχηθεί στον Απόλλωνα", "Να πολεμά στην πρώτη γραμμή", "Να παραδοθεί στους Έλληνες", "Να φύγει από την Τροία"], ans: 1, exp: "Η Ανδρομάχη παρακαλεί τον Έκτορα να μην πολεμά στην πρώτη γραμμή, γνωρίζοντας ότι εκεί θα πεθάνει." } },
      { en: { q: "Why does baby Astyanax cry when Hector reaches for him?", opts: ["He is hungry", "He is frightened by Hector's plumed helmet", "He doesn't recognize his father", "He wants his mother"], ans: 1, exp: "The infant cries and shrinks back from his father's gleaming bronze helmet with its horsehair plume. Hector laughs and removes his helmet before taking his son." }, gr: { q: "Γιατί ο μικρός Αστυάνακτας κλαίει;", opts: ["Πεινάει", "Τρομάζει από το λοφίο του κράνους", "Δεν αναγνωρίζει τον πατέρα του", "Θέλει τη μητέρα του"], ans: 1, exp: "Ο βρέφος τρομάζει από το λαμπερό κράνος με το λοφίο. Ο Έκτωρ γελά και βγάζει το κράνος πριν πάρει τον γιο του." } },
      { en: { q: "What prayer does Hector make for Astyanax?", opts: ["That he become a great musician", "That he surpass his father in glory", "That the gods make him immortal", "That he return safely to Troy"], ans: 1, exp: "Hector prays that Astyanax will one day be even greater than his father, that people will say 'this man is far better than his father.'" }, gr: { q: "Τι προσευχή κάνει ο Έκτωρ για τον Αστυάνακτα;", opts: ["Να γίνει μέγας μουσικός", "Να ξεπεράσει τον πατέρα του σε δόξα", "Να γίνει αθάνατος", "Να επιστρέψει σώος"], ans: 1, exp: "Ο Έκτωρ προσεύχεται ο Αστυάνακτας να γίνει ακόμα μεγαλύτερος από τον πατέρα του." } }
    ]
  },
  {
    id: 16, roman: 'XVI', heroKey: 'patroclus', heroColor: '#D4884A',
    en: { name: 'Book XVI', title: 'Death of Patroclus', tagline: "Hubris punished", hero: 'Patroclus' },
    gr: { name: 'Ραψωδία Π', title: 'Ο Θάνατος του Πατρόκλου', tagline: 'Η ύβρις τιμωρείται', hero: 'Πάτροκλος' },
    questions: [
      { en: { q: "Why does Patroclus borrow Achilles's armor?", opts: ["His own is broken", "To make the Trojans think Achilles returned", "To win a bet", "Achilles commands him"], ans: 1, exp: "Patroclus wears Achilles's distinctive armor so the Trojans, thinking Achilles has returned, will be terrified and fall back, giving the hard-pressed Greeks relief." }, gr: { q: "Γιατί ο Πάτροκλος δανείζεται την πανοπλία του Αχιλλέα;", opts: ["Η δική του έχει σπάσει", "Για να νομίσουν οι Τρώες ότι επέστρεψε ο Αχιλλέας", "Για να κερδίσει στοίχημα", "Επειδή ο Αχιλλέας τον διατάζει"], ans: 1, exp: "Ο Πάτροκλος φοράει την πανοπλία του Αχιλλέα ώστε οι Τρώες να τρομάξουν νομίζοντας ότι ο Αχιλλέας επέστρεψε." } },
      { en: { q: "What does Achilles warn Patroclus NOT to do?", opts: ["Fight near the ships", "Chase the Trojans back to Troy", "Use the heavy spear", "Challenge Hector"], ans: 1, exp: "Achilles warns Patroclus to drive back the Trojans but NOT to pursue them all the way to the walls of Troy. Patroclus ignores this — driven by hubris — and pays with his life." }, gr: { q: "Τι προειδοποιεί ο Αχιλλέας τον Πάτροκλο να ΜΗΝ κάνει;", opts: ["Να πολεμήσει κοντά στα πλοία", "Να κυνηγήσει τους Τρώες ως την Τροία", "Να χρησιμοποιήσει το βαρύ δόρυ", "Να προκαλέσει τον Έκτορα"], ans: 1, exp: "Ο Αχιλλέας προειδοποιεί τον Πάτροκλο να μην κυνηγήσει τους Τρώες ως τα τείχη. Ο Πάτροκλος αγνοεί την προειδοποίηση και πληρώνει με τη ζωή του." } },
      { en: { q: "Who strikes Patroclus first before Hector delivers the fatal blow?", opts: ["Sarpedon", "Apollo", "Glaucus", "Aeneas"], ans: 1, exp: "The god Apollo strikes Patroclus from behind, knocking off his helmet and breaking his spear. This stuns him and allows Euphorbus to spear him first, then Hector finishes him." }, gr: { q: "Ποιος χτυπά πρώτος τον Πάτροκλο;", opts: ["Ο Σαρπηδόνας", "Ο Απόλλων", "Ο Γλαύκος", "Ο Αινείας"], ans: 1, exp: "Ο θεός Απόλλων χτυπά τον Πάτροκλο από πίσω, αφαιρώντας του το κράνος. Έτσι ο Εύφορβος τον τρυπά πρώτος και ο Έκτωρ τον τελειώνει." } },
      { en: { q: "What does Patroclus prophesy to Hector as he dies?", opts: ["He curses him", "That Achilles will kill Hector", "He asks for mercy", "He thanks the gods"], ans: 1, exp: "With his dying breath, Patroclus prophesies that Hector does not have long to live — that Achilles will return and kill him: 'Death and strong fate are standing close beside you.'" }, gr: { q: "Τι προφητεύει ο Πάτροκλος στον Έκτορα καθώς πεθαίνει;", opts: ["Τον καταριέται", "Ότι ο Αχιλλέας θα σκοτώσει τον Έκτορα", "Ζητά έλεος", "Ευχαριστεί τους θεούς"], ans: 1, exp: "Με την τελευταία του πνοή, ο Πάτροκλος προφητεύει ότι ο Αχιλλέας θα επιστρέψει στη μάχη και θα σκοτώσει τον Έκτορα." } }
    ]
  },
  {
    id: 22, roman: 'XXII', heroKey: 'achilles', heroColor: '#4A8FD4',
    en: { name: 'Book XXII', title: 'Death of Hector', tagline: "Three circuits of Troy", hero: 'Achilles' },
    gr: { name: 'Ραψωδία Χ', title: 'Ο Θάνατος του Έκτορα', tagline: 'Τρεις περίδρομοι της Τροίας', hero: 'Αχιλλέας' },
    questions: [
      { en: { q: "How many times does Hector run around the walls of Troy?", opts: ["Once", "Twice", "Three times", "Four times"], ans: 2, exp: "Hector runs three times around the walls of Troy chased by Achilles. Zeus holds up the golden scales of fate, and Hector's fate sinks down, signaling his doom." }, gr: { q: "Πόσες φορές τρέχει ο Έκτωρ γύρω από τα τείχη;", opts: ["Μία φορά", "Δύο φορές", "Τρεις φορές", "Τέσσερις φορές"], ans: 2, exp: "Ο Έκτωρ τρέχει τρεις φορές γύρω από τα τείχη κυνηγημένος από τον Αχιλλέα, ενώ ο Δίας ζυγίζει τις μοίρες τους." } },
      { en: { q: "How does Athena trick Hector into stopping his flight?", opts: ["She disguises as Priam", "She appears as Deiphobus and promises support", "She creates a phantom spear", "She blinds him"], ans: 1, exp: "Athena disguises herself as Hector's brother Deiphobus, promising to fight by his side. When Hector turns to get another spear, Deiphobus has vanished — Hector realizes he has been deceived." }, gr: { q: "Πώς ξεγελά η Αθηνά τον Έκτορα;", opts: ["Μεταμορφώνεται σε Πρίαμο", "Εμφανίζεται ως Δηίφοβος", "Δημιουργεί φάντασμα δόρατος", "Τον τυφλώνει"], ans: 1, exp: "Η Αθηνά μεταμορφώνεται στον Δηίφοβο και υπόσχεται στον Έκτορα να πολεμήσει δίπλα του. Ο Δηίφοβος εξαφανίζεται και ο Έκτωρ καταλαβαίνει ότι εξαπατήθηκε." } },
      { en: { q: "What does Achilles do with Hector's body after killing him?", opts: ["Buries it with honors", "Drags it behind his chariot around Troy", "Burns it on a pyre", "Sends it to the Greek ships"], ans: 1, exp: "Achilles ties Hector's body to his chariot and drags it around the walls of Troy before the eyes of Hector's parents on the walls." }, gr: { q: "Τι κάνει ο Αχιλλέας με το σώμα του Έκτορα;", opts: ["Το θάβει με τιμές", "Το σέρνει πίσω από το άρμα του γύρω από την Τροία", "Το καίει σε πυρά", "Το στέλνει στα πλοία"], ans: 1, exp: "Ο Αχιλλέας δένει το σώμα του Έκτορα στο άρμα του και το σέρνει γύρω από τα τείχη μπροστά στα μάτια των γονιών του." } },
      { en: { q: "Where does Achilles's spear strike Hector?", opts: ["Through the chest", "In the back", "At the throat — the gap in his armor", "Through the helmet"], ans: 2, exp: "Achilles finds the gap in Hector's armor at the throat — left exposed when Hector stripped Patroclus's armor — and drives his spear through Hector's neck." }, gr: { q: "Πού χτυπά ο Αχιλλέας τον Έκτορα;", opts: ["Στο στήθος", "Στην πλάτη", "Στον λαιμό — στο κενό της πανοπλίας", "Μέσα από το κράνος"], ans: 2, exp: "Ο Αχιλλέας βρίσκει το κενό στον λαιμό — το μέρος που αφέθηκε ακάλυπτο όταν ο Έκτωρ έβγαλε την πανοπλία του Πατρόκλου." } }
    ]
  },
  {
    id: 24, roman: 'XXIV', heroKey: 'achilles', heroColor: '#4A8FD4',
    en: { name: 'Book XXIV', title: 'Priam & Achilles', tagline: "Ransom, grief, shared humanity", hero: 'Achilles' },
    gr: { name: 'Ραψωδία Ω', title: 'Πρίαμος & Αχιλλέας', tagline: 'Λύτρα, θρήνος, ανθρωπιά', hero: 'Αχιλλέας' },
    questions: [
      { en: { q: "How does Priam reach Achilles's tent without being stopped?", opts: ["He bribes the guards", "Hermes guides him through the camp", "He disguises as a soldier", "He walks in during a feast"], ans: 1, exp: "Zeus sends Hermes to guide the elderly Priam safely through the Greek camp at night, past the sentinels, directly to Achilles's tent." }, gr: { q: "Πώς φτάνει ο Πρίαμος στη σκηνή του Αχιλλέα;", opts: ["Δωροδοκεί τους φρουρούς", "Ο Ερμής τον οδηγεί μέσα από το στρατόπεδο", "Μεταμφιέζεται σε στρατιώτη", "Μπαίνει κατά τη διάρκεια συμποσίου"], ans: 1, exp: "Ο Δίας στέλνει τον Ερμή να οδηγήσει τον Πρίαμο με ασφάλεια μέσα από το ελληνικό στρατόπεδο τη νύχτα." } },
      { en: { q: "What does Priam do when he first enters Achilles's tent?", opts: ["He offers gifts", "He clasps Achilles's knees and kisses his hands", "He challenges Achilles to combat", "He weeps silently"], ans: 1, exp: "In a shocking act of supplication, King Priam kneels before his son's killer, clasps Achilles's knees, and kisses the terrible, man-slaying hands. He begs Achilles to remember his own father." }, gr: { q: "Τι κάνει ο Πρίαμος μόλις μπει στη σκηνή;", opts: ["Προσφέρει δώρα", "Αγκαλιάζει τα γόνατα του Αχιλλέα και φιλά τα χέρια του", "Τον προκαλεί σε μονομαχία", "Κλαίει αθόρυβα"], ans: 1, exp: "Ο μέγας βασιλιάς Πρίαμος γονατίζει μπροστά στον φονιά του γιου του, αγκαλιάζει τα γόνατα του Αχιλλέα και φιλά τα ανθρωποκτόνα χέρια του." } },
      { en: { q: "What do Achilles and Priam both do when they meet?", opts: ["Fight each other", "Weep together", "Pray to Zeus", "Negotiate in silence"], ans: 1, exp: "In one of literature's most moving scenes, Achilles weeps for Patroclus while Priam weeps for Hector. They weep together, and Achilles is moved to compassion." }, gr: { q: "Τι κάνουν μαζί ο Αχιλλέας και ο Πρίαμος;", opts: ["Πολεμούν", "Κλαίνε μαζί", "Προσεύχονται στον Δία", "Διαπραγματεύονται σιωπηλά"], ans: 1, exp: "Ο Αχιλλέας κλαίει για τον Πάτροκλο και ο Πρίαμος για τον Έκτορα. Κλαίνε μαζί και ο Αχιλλέας συγκινείται." } },
      { en: { q: "For how many days does Achilles agree to pause the fighting?", opts: ["3 days", "9 days", "11 days", "12 days"], ans: 2, exp: "Achilles agrees to hold off the Greeks for 11 days — nine for mourning, the tenth for the funeral pyre, the eleventh for building the tomb." }, gr: { q: "Για πόσες μέρες σταματά τις μάχες ο Αχιλλέας;", opts: ["3 μέρες", "9 μέρες", "11 μέρες", "12 μέρες"], ans: 2, exp: "Ο Αχιλλέας συμφωνεί για 11 μέρες: εννέα για πένθος, η δέκατη για την κηδεία, η ενδέκατη για τον τάφο." } }
    ]
  }
];

const HERO_COLORS = {
  achilles:  { body: '#3A70B8', armor: '#C9A84C', cape: '#1A4080', helm: '#C9A84C' },
  hector:    { body: '#2E7048', armor: '#8AAA70', cape: '#1A4028', helm: '#8AAA70' },
  patroclus: { body: '#B06828', armor: '#C9A84C', cape: '#7A3818', helm: '#B08040' }
};

/* ════════════════════════════════════════════════════════════
   GAME STATE
   ════════════════════════════════════════════════════════════ */
let lang = 'gr';
let difficulty = 'hero';
let ctrlMode = 'keyboard';
let currentBook = null;
let quizQueue = [];
let missedQ = [];

const DIFF_CFG = {
  mortal: { timer: 0,  mult: 1, eSpd: 1.0, eDmg: 4  },
  hero:   { timer: 30, mult: 2, eSpd: 1.4, eDmg: 8  },
  god:    { timer: 15, mult: 3, eSpd: 1.9, eDmg: 14 }
};

// Game runtime
let gc, ctx, gameArea;
let raf = null;
let gameActive = false;

let CAM = { x: 0 };
const LEVEL_W = 2800;
let GROUND_Y = 260;

let P = {}; // player
let ENM = []; // enemies
let PROJ = []; // projectiles (player's)
let EPROJ = []; // enemy projectiles
let FLOATS = []; // floating text
let SPARKS = []; // particles
let ARROWS = []; // falling arrow rain (wave 2+)
let PICKUPS = []; // life packs and dmg vials
let pickupSpawnTimer = 0;
let pickupSpawnInterval = 350;

let screenShake = 0;
let arrowRainActive = false;
let arrowRainTimer = 0;
let impactFlashes = []; // hit impact flashes

let waveNum = 0;
let totalWaves = 5;
let isBossWave = false;
let isMiniBossWave = false;
let playerDmgMult = 1.0; // grows +5% per correct quiz answer

// ── Ultimate: "Μήνις Ἀχιλλέως" ──────────────────────────────
const ULTIMATE_MAX = 100;
let ultimateCharge = 0;        // 0–100
let ultimateFreezeTimer = 0;   // frames player is frozen during ult
let ultimateActive = false;
let score = 0;
let combo = 0;
let comboTimer = 0;
let maxCombo = 0;
let totalKills = 0;
let quizCorrect = 0;
let quizTotal = 0;
let quizAnswered = false;
let quizTimerVal = 0;
let quizTimerInt = null;
let waveActive = false;

/* ════════════════════════════════════════════════════════════
   ROOT / SCREEN MANAGEMENT
   ════════════════════════════════════════════════════════════ */
function t(key) { return (TR[lang] && TR[lang][key]) || TR.en[key] || key; }
function bd(book) { return book[lang] || book.en; }

let rootEl = null;

function initArcadeRoot() {
  rootEl = document.getElementById('ia-root');
  if (!rootEl) return;
  gc = document.getElementById('ia-gc');
  ctx = gc.getContext('2d');
  gameArea = document.getElementById('ia-game-area');
  bindInput();
  bindTouch();
  showScreen('title');
}

function showScreen(id) {
  rootEl.querySelectorAll('.ia-screen').forEach(s => s.classList.remove('ia-active'));
  const el = document.getElementById('ia-s-' + id);
  if (el) el.classList.add('ia-active');

  if (id === 'game') {
    stopGame();
  }
  if (id === 'title')   renderTitle();
  if (id === 'diff')    renderDiff();
  if (id === 'books')   renderBooks();
  if (id === 'results') renderResults();
  if (id === 'dash')    renderDash();
}

/* ════════════════════════════════════════════════════════════
   TITLE SCREEN
   ════════════════════════════════════════════════════════════ */
function renderTitle() {
  const s = document.getElementById('ia-s-title');
  s.innerHTML = `
    <div class="ia-title-ornament">HOMER · ΟΜΗΡΟΣ</div>
    <div class="ia-title-hero">${t('title')}</div>
    <div class="ia-title-sub">${t('subtitle')}</div>
    <div class="ia-title-lang">
      <button class="ia-lang-btn${lang==='gr'?' ia-active':''}" onclick="window._ia_setLang('gr')">GR</button>
      <button class="ia-lang-btn${lang==='en'?' ia-active':''}" onclick="window._ia_setLang('en')">EN</button>
    </div>
    <div class="ia-title-btns">
      <button class="ia-btn-primary" onclick="window._ia_showScreen('diff')">${t('play')}</button>
      <button class="ia-btn-secondary" onclick="window._ia_showScreen('dash')">${t('dashboard')}</button>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   DIFFICULTY SCREEN
   ════════════════════════════════════════════════════════════ */
function renderDiff() {
  const diffs = [
    { key: 'mortal', icon: '⚔️', nameKey: 'mortal', statsKey: 'mortalStats' },
    { key: 'hero',   icon: '🛡️', nameKey: 'hero',   statsKey: 'heroStats' },
    { key: 'god',    icon: '⚡', nameKey: 'god',    statsKey: 'godStats' }
  ];
  const ctrls = [
    { key: 'keyboard', icon: '⌨️', nameKey: 'keyboard', descKey: 'kbDesc' },
    { key: 'touch',    icon: '👆', nameKey: 'touch',     descKey: 'touchDesc' }
  ];

  document.getElementById('ia-s-diff').innerHTML = `
    <button class="ia-back-btn" onclick="window._ia_showScreen('title')">${t('back')}</button>
    <div class="ia-screen-title">${t('chooseDiff')}</div>
    <div class="ia-diff-grid">
      ${diffs.map(d => `
        <div class="ia-diff-card${difficulty===d.key?' ia-selected':''}" onclick="window._ia_setDiff('${d.key}')">
          <div class="ia-diff-icon">${d.icon}</div>
          <div class="ia-diff-name">${t(d.nameKey)}</div>
          <div class="ia-diff-stats">${t(d.statsKey).replace(/\n/g,'<br>')}</div>
        </div>`).join('')}
    </div>
    <div class="ia-screen-title" style="font-size:1.1rem;margin-top:.5rem">${t('chooseCtrl')}</div>
    <div class="ia-ctrl-row">
      ${ctrls.map(c => `
        <div class="ia-ctrl-card${ctrlMode===c.key?' ia-selected':''}" onclick="window._ia_setCtrl('${c.key}')">
          <div class="ia-ctrl-icon">${c.icon}</div>
          <div class="ia-ctrl-name">${t(c.nameKey)}</div>
          <div class="ia-ctrl-desc">${t(c.descKey)}</div>
        </div>`).join('')}
    </div>
    <button class="ia-btn-primary" style="width:100%;max-width:340px" onclick="window._ia_showScreen('books')">${t('chooseBook')} →</button>`;
}

/* ════════════════════════════════════════════════════════════
   BOOK SELECT SCREEN
   ════════════════════════════════════════════════════════════ */
function renderBooks() {
  const data = getStoredData();
  document.getElementById('ia-s-books').innerHTML = `
    <button class="ia-back-btn" onclick="window._ia_showScreen('diff')">${t('back')}</button>
    <div class="ia-screen-title">${t('chooseBook')}</div>
    <div class="ia-screen-sub">${t('bookSubtitle')}</div>
    <div class="ia-book-grid">
      ${BOOKS.map(b => {
        const bd_ = bd(b);
        const bData = data.books[b.id] || {};
        return `
          <div class="ia-book-card" onclick="window._ia_startGame(${b.id})">
            <div class="ia-book-roman">${b.roman}</div>
            <div class="ia-book-num">${bd_.name}</div>
            <div class="ia-book-title">${bd_.title}</div>
            <div class="ia-book-tagline">${bd_.tagline}</div>
            <div class="ia-book-hero">
              <div class="ia-book-hero-dot" style="background:${b.heroColor}"></div>
              <div class="ia-book-hero-name">${bd_.hero}</div>
            </div>
            ${bData.best ? `<div class="ia-book-score">⭐ ${t('bestScore')}: ${bData.best}</div>` : ''}
          </div>`;
      }).join('')}
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   CANVAS SIZING
   ════════════════════════════════════════════════════════════ */
function resizeGameCanvas() {
  const overlayFrame = document.querySelector('#iliada-arcade-overlay .overlay-frame');
  if (!overlayFrame || !gc || !gameArea) return;

  const frameH = overlayFrame.clientHeight || window.innerHeight - 52;
  const hudH = document.getElementById('ia-hud') ? (document.getElementById('ia-hud').offsetHeight || 44) : 44;
  const tcH = (ctrlMode === 'touch') ? 88 : 0;
  const quizH = 0; // quiz closed at start
  const available = frameH - hudH - tcH - quizH;
  const canH = Math.max(160, Math.floor(available * 0.98));

  gc.width = overlayFrame.clientWidth || window.innerWidth;
  gc.height = canH;
  gc.style.height = canH + 'px';
  gameArea.style.height = canH + 'px';
  GROUND_Y = Math.floor(canH * 0.72);
}

/* ════════════════════════════════════════════════════════════
   QUIZ QUEUE — shared with iliada-trivia questions.js
   ════════════════════════════════════════════════════════════ */
function buildQuizQueue() {
  // Use the shared trivia question pool (ILIADA_QUESTIONS from questions.js)
  // which is loaded before this script in index.html
  if (typeof ILIADA_QUESTIONS !== 'undefined') {
    const rhapMap = { 1:'Α', 6:'Ζ', 16:'Π', 22:'Χ', 24:'Ω' };
    const rhapKey = rhapMap[currentBook.id];

    function getArr(lk) {
      const lqs = ILIADA_QUESTIONS[lk] || ILIADA_QUESTIONS.gr;
      const rArr = (rhapKey && lqs[rhapKey] && lqs[rhapKey].length > 0) ? lqs[rhapKey] : [];
      const aArr = lqs['all'] || [];
      return [...rArr, ...aArr];
    }

    const grArr = getArr('gr');
    const enArr = getArr('en');
    const maxLen = Math.min(grArr.length, enArr.length);
    // Shuffle indices and pick up to 4 questions
    const idxPool = Array.from({ length: maxLen }, (_, i) => i).sort(() => Math.random() - 0.5);
    const picked  = idxPool.slice(0, Math.min(totalWaves, maxLen));

    return picked.map((pi, i) => ({
      gr: { q: grArr[pi].q, opts: grArr[pi].opts, ans: grArr[pi].ans, exp: '' },
      en: { q: enArr[pi].q, opts: enArr[pi].opts, ans: enArr[pi].ans, exp: '' },
      idx: i
    }));
  }
  // Fallback: use the book-specific questions bundled in BOOKS[] (shuffled)
  const shuffled = [...currentBook.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, totalWaves).map((q, i) => ({ ...q, idx: i }));
}

/* ════════════════════════════════════════════════════════════
   GAME START
   ════════════════════════════════════════════════════════════ */
function startGame(bookId) {
  currentBook = BOOKS.find(b => b.id === bookId);
  if (!currentBook) return;

  showScreen('game');

  // Scroll overlay-frame to top so canvas is fully visible
  const overlayFrame = document.querySelector('#iliada-arcade-overlay .overlay-frame');
  if (overlayFrame) overlayFrame.scrollTop = 0;

  // Set touch controls visibility
  const tcEl = document.getElementById('ia-touch');
  if (tcEl) {
    tcEl.classList.toggle('ia-show', ctrlMode === 'touch');
  }

  resizeGameCanvas();

  P = {}; // guarantee fresh HP — no bleed-over from a previous session
  score = 0;
  combo = 0;
  comboTimer = 0;
  maxCombo = 0;
  totalKills = 0;
  quizCorrect = 0;
  quizTotal = 0;
  waveNum = 0;
  isBossWave = false;
  isMiniBossWave = false;
  playerDmgMult = 1.0;
  ultimateCharge = 0;

  // Build quiz queue — use shared trivia questions when available
  quizQueue = buildQuizQueue();
  quizTotal = quizQueue.length;
  missedQ = [];

  updateHUD();
  spawnNextWave();
}

/* ════════════════════════════════════════════════════════════
   PLAYER
   ════════════════════════════════════════════════════════════ */
function spawnPlayer() {
  const cfg = DIFF_CFG[difficulty];
  P = {
    x: 120, y: GROUND_Y,
    vx: 0, vy: 0,
    w: 28, h: 60,
    onGround: false,
    facing: 1,     // 1=right, -1=left
    hp: 125, maxHp: 125,
    invFrames: 0,
    attackTimer: 0,
    attackCD: 0,
    swingTimer: 0,
    shielding: false,
    alive: true,
    dmgMult: playerDmgMult,
    cfg
  };
}

const KEYS = {};
function bindInput() {
  window.addEventListener('keydown', e => {
    KEYS[e.code] = true;
    if (['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)) {
      if (gameActive) e.preventDefault();
    }
  });
  window.addEventListener('keyup', e => { KEYS[e.code] = false; });
}

/* ════════════════════════════════════════════════════════════
   TOUCH CONTROLS
   ════════════════════════════════════════════════════════════ */
const TOUCH_STATE = { left: false, right: false, up: false, atk: false, shield: false, ult: false };

function bindTouch() {
  function addHold(el, key) {
    if (!el) return;
    el.addEventListener('touchstart', e => { e.preventDefault(); TOUCH_STATE[key] = true; }, { passive: false });
    el.addEventListener('touchend',   e => { e.preventDefault(); TOUCH_STATE[key] = false; }, { passive: false });
    el.addEventListener('touchcancel',e => { TOUCH_STATE[key] = false; });
    el.addEventListener('mousedown',  () => TOUCH_STATE[key] = true);
    el.addEventListener('mouseup',    () => TOUCH_STATE[key] = false);
  }
  // buttons are rendered dynamically, so we use event delegation on ia-touch
  const tc = document.getElementById('ia-touch');
  if (!tc) return;
  tc.addEventListener('touchstart', handleTouchDelegate, { passive: false });
  tc.addEventListener('touchend',   handleTouchDelegate, { passive: false });
  tc.addEventListener('mousedown',  handleTouchDelegate);
  tc.addEventListener('mouseup',    handleTouchDelegate);
}

function handleTouchDelegate(e) {
  const el = e.target.closest('[data-tc]');
  if (!el) return;
  if (gameActive) e.preventDefault();
  const key = el.dataset.tc;
  const down = e.type === 'touchstart' || e.type === 'mousedown';
  if (key === 'left')   TOUCH_STATE.left   = down;
  if (key === 'right')  TOUCH_STATE.right  = down;
  if (key === 'up')     TOUCH_STATE.up     = down;
  if (key === 'atk')    TOUCH_STATE.atk    = down;
  if (key === 'shield') TOUCH_STATE.shield = down;
  if (key === 'ult')    TOUCH_STATE.ult    = down;
}

function renderTouchControls() {
  const tc = document.getElementById('ia-touch');
  if (!tc) return;
  tc.innerHTML = `
    <div class="ia-dpad">
      <div class="ia-dpad-btn ia-dpad-left"  data-tc="left">◀</div>
      <div class="ia-dpad-btn ia-dpad-up"    data-tc="up">▲</div>
      <div class="ia-dpad-btn ia-dpad-space"></div>
      <div class="ia-dpad-btn ia-dpad-right" data-tc="right">▶</div>
    </div>
    <div class="ia-action-btns">
      <div class="ia-act-btn" data-tc="shield">🛡<div class="ia-act-lbl">Q</div></div>
      <div class="ia-act-btn" data-tc="atk">⚔<div class="ia-act-lbl">ATK</div></div>
      <div class="ia-act-btn ia-ult-btn" data-tc="ult" id="ia-ult-touch-btn">⚡<div class="ia-act-lbl">F</div></div>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   WAVE SYSTEM
   ════════════════════════════════════════════════════════════ */
function spawnNextWave() {
  // Save HP so it carries over between waves (clamped to at least 1)
  const prevHp = P.hp != null ? P.hp : null;

  waveNum++;
  isBossWave = waveNum === totalWaves;
  isMiniBossWave = waveNum === 3;
  ENM = [];
  PROJ = [];
  EPROJ = [];
  FLOATS = [];
  SPARKS = [];
  ARROWS = [];
  PICKUPS = [];
  impactFlashes = [];
  arrowRainActive = false;
  arrowRainTimer = 0;
  pickupSpawnTimer = 0;
  pickupSpawnInterval = 350;
  screenShake = 0;
  CAM.x = 0;

  spawnPlayer();
  // Restore HP from previous wave (first wave starts full)
  if (prevHp != null) {
    P.hp = Math.min(Math.max(1, prevHp), P.maxHp);
  }
  if (ctrlMode === 'touch') renderTouchControls();

  const cfg = DIFF_CFG[difficulty];
  if (isBossWave) {
    ENM.push(spawnBoss(cfg));
    // Boss wave — 3 minions attacking from both flanks
    const minionCount = 3;
    for (let i = 0; i < minionCount; i++) {
      ENM.push(spawnEnemy(i, minionCount, cfg));
    }
  } else if (isMiniBossWave) {
    // Wave 3: mini-boss fight
    const miniBoss = spawnBoss(cfg);
    miniBoss.isMiniBoss = true;
    miniBoss.hp = Math.round(miniBoss.hp * 0.5);
    miniBoss.maxHp = miniBoss.hp;
    miniBoss.w = 36; miniBoss.h = 76;
    ENM.push(miniBoss);
    // 2 regular minions flanking
    for (let i = 0; i < 2; i++) ENM.push(spawnEnemy(i, 2, cfg));
  } else {
    const count = Math.min(3 + waveNum * 3, 12); // cap at 12 enemies
    for (let i = 0; i < count; i++) {
      ENM.push(spawnEnemy(i, count, cfg));
    }
  }
  // Arrow rain starts on wave 2+
  if (waveNum >= 2) {
    arrowRainActive = true;
  }

  updateHUD();
  waveActive = true;
  gameActive = true;
  if (raf) cancelAnimationFrame(raf);
  raf = requestAnimationFrame(gameLoop);
}

function spawnEnemy(i, total, cfg) {
  // Odd-indexed enemies always flank from the right; even from the left
  let x, facing;
  if (i % 2 === 1) {
    x = LEVEL_W - 80 - Math.random() * 400;
    facing = -1; // walking left toward player
  } else {
    const spacing = LEVEL_W / (total + 1);
    x = 380 + spacing * Math.floor(i / 2) + Math.random() * 80;
    facing = -1;
  }
  const waveHp = 30 + waveNum * 15; // much tougher — takes multiple hits
  return {
    x, y: GROUND_Y,
    vx: 0, vy: 0,
    w: 24, h: 56,
    hp: waveHp,
    maxHp: waveHp,
    facing,
    speed: (1.4 + Math.random() * 0.7) * cfg.eSpd,
    attackCD: 0,
    shotCD: 20 + Math.floor(Math.random() * 40),
    invFrames: 0,
    alive: true,
    isBoss: false,
    colorVariant: i % 3,
    animTick: Math.floor(Math.random() * 60)
  };
}
function spawnBoss(cfg) {
  const bossHp = Math.round((3 + waveNum) * 150 * 0.7); // 30% lower HP
  return {
    x: LEVEL_W * 0.58, y: GROUND_Y,
    vx: 0, vy: 0,
    w: 44, h: 88,
    hp: bossHp, maxHp: bossHp,
    facing: -1,
    speed: (1.2 + Math.random() * 0.5) * cfg.eSpd,
    attackCD: 0,
    shotCD: 18 + Math.floor(Math.random() * 15),
    chargeCD: 90 + Math.floor(Math.random() * 60),
    burstCD:  110 + Math.floor(Math.random() * 60),
    bossSpearCD: 120 + Math.floor(Math.random() * 60), // telegraphed spear throw
    chargeVx: 0,
    invFrames: 0,
    alive: true,
    isBoss: true,
    rageMode: false,
    rageTriggered: false,
    animTick: 0
  };
}

/* ════════════════════════════════════════════════════════════
   GAME LOOP
   ════════════════════════════════════════════════════════════ */
function gameLoop() {
  if (!gameActive) return;
  raf = requestAnimationFrame(gameLoop);
  update();
  draw();
}

function stopGame() {
  gameActive = false;
  if (raf) { cancelAnimationFrame(raf); raf = null; }
  clearTimeout(window._ia_waveTimeout);
}

/* ════════════════════════════════════════════════════════════
   UPDATE
   ════════════════════════════════════════════════════════════ */
function update() {
  if (!P.alive) return;

  updatePlayer();
  if (!ultimateActive) updateEnemies();
  updateProjectiles();
  updateArrowRain();
  updatePickups();
  spawnPickupsTimer();
  updateFloats();
  updateSparks();
  updateImpactFlashes();
  updateCombo();
  if (screenShake > 0) screenShake = Math.max(0, screenShake - 0.7);
  checkWaveClear();
}

function updatePlayer() {
  // Handle ultimate freeze — player locked in place briefly
  if (ultimateFreezeTimer > 0) {
    ultimateFreezeTimer--;
    P.vx = 0;
    return; // skip all other input while frozen
  }

  const left   = KEYS['ArrowLeft']  || KEYS['KeyA'] || TOUCH_STATE.left;
  const right  = KEYS['ArrowRight'] || KEYS['KeyD'] || TOUCH_STATE.right;
  const jump   = KEYS['ArrowUp']    || KEYS['KeyW'] || KEYS['Space'] || TOUCH_STATE.up;
  const shield = KEYS['KeyQ'] || KEYS['ShiftLeft'] || KEYS['ShiftRight'] || TOUCH_STATE.shield;
  const atk    = KEYS['KeyZ'] || KEYS['KeyJ'] || KEYS['Enter'] || TOUCH_STATE.atk;
  const ult    = KEYS['KeyF'] || TOUCH_STATE.ult;

  // Trigger ultimate when fully charged
  if (ult && ultimateCharge >= ULTIMATE_MAX && !ultimateActive) {
    triggerUltimate();
    return;
  }

  // 50% speed reduction while blocking (shield up)
  const spd = shield ? 1.6 : 3.2;

  // Movement
  if (left)  { P.vx = -spd; P.facing = -1; }
  else if (right) { P.vx = spd; P.facing = 1; }
  else P.vx *= 0.7;

  // Jump
  if (jump && P.onGround) { P.vy = -13; P.onGround = false; }

  // Gravity
  P.vy += 0.55;
  P.y += P.vy;
  P.x += P.vx;

  // Ground clamp
  if (P.y >= GROUND_Y) { P.y = GROUND_Y; P.vy = 0; P.onGround = true; }

  // Level bounds
  P.x = Math.max(20, Math.min(LEVEL_W - 20, P.x));

  // Shield
  P.shielding = shield && P.onGround;

  // Attack
  if (P.attackCD > 0) P.attackCD--;
  if (P.swingTimer > 0) P.swingTimer--;
  if (P.invFrames > 0) P.invFrames--;

  if (atk && P.attackCD === 0) {
    P.attackCD = 20;
    P.swingTimer = 12;
    // Decide melee vs ranged
    const nearest = nearestEnemy();
    if (nearest && Math.abs(nearest.x - P.x) < 95) {
      doMeleeAttack();
    } else {
      throwSpear(P.x, P.y - 30, P.facing);
      if (difficulty === 'god') {
        setTimeout(() => { if (gameActive) throwSpear(P.x, P.y - 20, P.facing); }, 80);
      }
    }
  }

  // Camera
  const targetCamX = P.x - gc.width / 3;
  CAM.x += (targetCamX - CAM.x) * 0.1;
  CAM.x = Math.max(0, Math.min(LEVEL_W - gc.width, CAM.x));

  // Update HUD
  updateHUD();
}

function nearestEnemy() {
  let best = null, bestDist = Infinity;
  for (const e of ENM) {
    if (!e.alive) continue;
    const d = Math.abs(e.x - P.x);
    if (d < bestDist) { bestDist = d; best = e; }
  }
  return best;
}

// 5% global damage reduction on all incoming player damage
function applyDmg(raw) { return Math.max(1, Math.round(raw * 0.95)); }

/* ── MELEE ATTACK — backwards loop ── */
function doMeleeAttack() {
  for (let i = ENM.length - 1; i >= 0; i--) {
    const e = ENM[i];
    if (!e.alive) continue;
    const ex = e.x - P.x;
    const ey = e.y - P.y;
    // Direction check with small backward tolerance
    const inArc = P.facing > 0 ? (ex > -20 && ex < 100) : (ex > -100 && ex < 20);
    if (inArc && Math.abs(ey) < 60) {
      hitEnemy(e, Math.round(35 * P.dmgMult), i);
    }
  }
}

function hitEnemy(e, dmg, idx) {
  if (e.invFrames > 0) return;
  e.hp -= dmg;
  e.invFrames = 18;
  // Each hit charges the ultimate by 8 points
  ultimateCharge = Math.min(ULTIMATE_MAX, ultimateCharge + 8);
  addFloat('+' + dmg, e.x, e.y - 60, '#E8C96A');
  addImpactFlash(e.x, e.y - 30, e.isBoss ? 28 : 16, e.isBoss ? '#FF6020' : '#E8C96A');
  if (e.isBoss) screenShake = Math.max(screenShake, 7);
  if (e.hp <= 0) {
    e.alive = false;
    killEnemy(e);
  }
}

function killEnemy(e) {
  totalKills++;
  combo++;
  comboTimer = 140;
  // Kill charges ultimate more (15 pts for a kill)
  ultimateCharge = Math.min(ULTIMATE_MAX, ultimateCharge + 15);
  if (combo > maxCombo) maxCombo = combo;
  const pts = Math.round((100 + combo * 15) * DIFF_CFG[difficulty].mult);
  score += pts;
  addFloat('+' + pts, e.x, e.y - 80, '#C9A84C');
  spawnDeathSparks(e.x, e.y - 28, e.isBoss);
  if (e.isBoss) screenShake = 22;
  // Drop pickup on kill
  const dropRoll = Math.random();
  const dropChance = e.isBoss ? 1.0 : e.isMiniBoss ? 0.7 : 0.22;
  if (dropRoll < dropChance) {
    const type = Math.random() < 0.6 ? 'hp' : 'dmg';
    spawnPickup(e.x, type);
  }
}

function throwSpear(ox, oy, dir) {
  PROJ.push({ x: ox + dir * 20, y: oy, vx: dir * 12, vy: -1, w: 20, h: 4, alive: true, dmg: Math.round(30 * P.dmgMult) });
}

/* ════════════════════════════════════════════════════════════
   PICKUPS — life packs & damage vials
   ════════════════════════════════════════════════════════════ */
function spawnPickup(x, type) {
  PICKUPS.push({
    x: Math.max(60, Math.min(LEVEL_W - 60, x)),
    y: GROUND_Y,
    type,          // 'hp' or 'dmg'
    life: 540,     // ~9 seconds at 60fps before it disappears
    bobOffset: Math.random() * Math.PI * 2,
    alive: true
  });
}

function updatePickups() {
  for (let i = PICKUPS.length - 1; i >= 0; i--) {
    const pk = PICKUPS[i];
    if (!pk.alive) { PICKUPS.splice(i, 1); continue; }
    pk.life--;
    if (pk.life <= 0) { PICKUPS.splice(i, 1); continue; }

    // Player collection radius
    if (Math.abs(pk.x - P.x) < 30 && Math.abs((pk.y - 14) - (P.y - 30)) < 38) {
      pk.alive = false;
      if (pk.type === 'hp') {
        const heal = Math.round(P.maxHp * 0.25);
        P.hp = Math.min(P.maxHp, P.hp + heal);
        addFloat('❤ +' + heal + ' HP', pk.x, pk.y - 50, '#4AC96A');
        addImpactFlash(pk.x, pk.y - 20, 18, '#4AC96A');
        updateHUD();
      } else {
        playerDmgMult = Math.round((playerDmgMult + 0.05) * 100) / 100;
        P.dmgMult = playerDmgMult;
        const boostPct = Math.round((playerDmgMult - 1) * 100);
        addFloat('⚔ +5% DMG', pk.x, pk.y - 50, '#FFD020');
        addImpactFlash(pk.x, pk.y - 20, 18, '#FFD020');
        updateHUD();
      }
    }
  }
}

function spawnPickupsTimer() {
  if (!waveActive) return;
  pickupSpawnTimer++;
  if (pickupSpawnTimer >= pickupSpawnInterval) {
    pickupSpawnTimer = 0;
    pickupSpawnInterval = 280 + Math.floor(Math.random() * 140);
    const x = 200 + Math.random() * (LEVEL_W - 400);
    // 65% chance HP, 35% chance DMG vial
    const type = Math.random() < 0.65 ? 'hp' : 'dmg';
    spawnPickup(x, type);
  }
}

/* ── ENEMY UPDATE ── */
function updateEnemies() {
  for (const e of ENM) {
    if (!e.alive) continue;
    e.animTick++;
    if (e.invFrames > 0) e.invFrames--;
    if (e.attackCD > 0) e.attackCD--;
    if (e.shotCD > 0)   e.shotCD--;

    const dx = P.x - e.x;
    const dist = Math.abs(dx);
    e.facing = dx > 0 ? 1 : -1;

    // ── BOSS-SPECIFIC BEHAVIOUR ──
    if (e.isBoss) {
      // Enter rage mode at 50% HP — triggers much earlier now
      if (!e.rageTriggered && e.hp < e.maxHp * 0.5) {
        e.rageTriggered = true;
        e.rageMode = true;
        e.speed *= 2.0;
        e.shotCD = Math.max(12, Math.floor(e.shotCD * 0.35));
        e.chargeCD = Math.max(40, Math.floor(e.chargeCD * 0.4));
        e.burstCD  = Math.max(50, Math.floor(e.burstCD  * 0.4));
        addFloat('⚡ RAGE ⚡', e.x, e.y - 115, '#FF2222');
        addImpactFlash(e.x, e.y - 50, 44, '#FF0000');
        screenShake = 18;
      }

      // Charge attack timer
      if (e.chargeCD > 0) e.chargeCD--;
      if (e.chargeCD === 0 && dist < 500 && e.chargeVx === 0) {
        e.chargeCD = e.rageMode ? 60 : 100;
        e.chargeVx = e.facing * (e.rageMode ? 22 : 16);
        addFloat('CHARGE!', e.x, e.y - 100, '#FF8800');
        screenShake = Math.max(screenShake, 9);
      }

      // Burst shot (3-way / 5-way in rage)
      if (e.burstCD > 0) e.burstCD--;
      if (e.burstCD === 0 && dist < 460) {
        e.burstCD = e.rageMode ? 70 : 130;
        const spreadAngles = e.rageMode ? [-0.45, -0.22, 0, 0.22, 0.45] : [-0.30, 0, 0.30];
        for (const ang of spreadAngles) {
          const speed = e.rageMode ? 13 : 10;
          EPROJ.push({
            x: e.x, y: e.y - 38,
            vx: e.facing * speed * Math.cos(ang),
            vy: Math.sin(ang) * 3 - 0.4,
            w: 16, h: 4, alive: true, isBossProj: true
          });
        }
        screenShake = Math.max(screenShake, 5);
      }

      // Telegraphed spear throw — slow-moving, blockable by shield
      if (e.bossSpearCD > 0) e.bossSpearCD--;
      if (e.bossSpearCD === 0 && dist > 80 && dist < 500 && e.chargeVx === 0) {
        e.bossSpearCD = e.rageMode ? 75 : 155;
        addFloat('🗡 SPEAR!', e.x, e.y - 130, '#FF8800');
        screenShake = Math.max(screenShake, 3);
        EPROJ.push({
          x: e.x, y: e.y - 48,
          vx: e.facing * 5, vy: -0.2,
          w: 28, h: 6, alive: true,
          isBossProj: true, isBossSpear: true
        });
      }
    }

    // Movement: charge overrides normal pathing (boss only)
    if (e.isBoss && e.chargeVx) {
      e.vx = e.chargeVx;
      e.chargeVx *= 0.86;
      if (Math.abs(e.chargeVx) < 0.5) e.chargeVx = 0;
    } else if (dist > (e.isBoss ? 60 : 50)) {
      e.vx = e.facing * e.speed;
    } else {
      e.vx = 0;
    }
    e.x += e.vx;
    e.x = Math.max(10, Math.min(LEVEL_W - 10, e.x));

    // Gravity
    e.vy += 0.55;
    e.y += e.vy;
    if (e.y >= GROUND_Y) { e.y = GROUND_Y; e.vy = 0; }

    // Melee hit on player
    const meleeDist = e.isBoss ? 52 : 36;
    if (dist < meleeDist && P.invFrames === 0 && !P.shielding) {
      const tickDmg = applyDmg(DIFF_CFG[difficulty].eDmg * (e.isBoss ? 0.03 : 0.015) * (e.rageMode ? 1.6 : 1));
      P.hp -= tickDmg;
      P.invFrames = 3;
      if (e.isBoss && Math.random() < 0.04) screenShake = Math.max(screenShake, 5);
    }
    if (dist < meleeDist && P.shielding) {
      if (Math.random() < 0.04) {
        addFloat(t('blockText'), P.x, P.y - 70, '#C9A84C');
        spawnClankSparks(P.x, P.y - 30);
      }
    }

    // Regular ranged attack
    const shotRange = e.isBoss ? 420 : 380;
    const shotMinDist = e.isBoss ? 90 : 80;
    if (e.shotCD === 0 && dist < shotRange && dist > shotMinDist) {
      e.shotCD = e.isBoss
        ? (e.rageMode ? 20 : 35) + Math.floor(Math.random() * 20)
        : 40 + Math.floor(Math.random() * 35);
      const projSpeed = e.isBoss ? 9 : 7;
      EPROJ.push({ x: e.x, y: e.y - 30, vx: e.facing * projSpeed, vy: -0.5, w: e.isBoss ? 20 : 16, h: 4, alive: true });
    }

    // Check if player is dead
    if (P.hp <= 0) {
      P.alive = false;
      P.hp = 0;
      gameActive = false;
      setTimeout(() => { if (rootEl) showScreen('results'); }, 1200);
      return;
    }
  }
}

function updateProjectiles() {
  // Player spears
  for (const p of PROJ) {
    if (!p.alive) continue;
    p.x += p.vx;
    p.vy += 0.18; // slight arc
    p.y += p.vy;
    if (p.x < 0 || p.x > LEVEL_W || p.y > GROUND_Y + 40) { p.alive = false; continue; }
    for (let i = ENM.length - 1; i >= 0; i--) {
      const e = ENM[i];
      if (!e.alive) continue;
      if (Math.abs(p.x - e.x) < 20 && Math.abs(p.y - (e.y - 28)) < 30) {
        p.alive = false;
        hitEnemy(e, p.dmg || 30, i);
        break;
      }
    }
  }

  // Enemy projectiles
  for (const ep of EPROJ) {
    if (!ep.alive) continue;
    ep.x += ep.vx;
    ep.vy += 0.18;
    ep.y += ep.vy;
    if (ep.x < 0 || ep.x > LEVEL_W || ep.y > GROUND_Y + 40) { ep.alive = false; continue; }
    if (Math.abs(ep.x - P.x) < 18 && Math.abs(ep.y - (P.y - 30)) < 28) {
      ep.alive = false;
      if (P.shielding) {
        addFloat(t('blockText'), P.x, P.y - 70, '#C9A84C');
        spawnClankSparks(P.x, P.y - 30);
      } else if (P.invFrames === 0) {
        const dmg = applyDmg(Math.round(DIFF_CFG[difficulty].eDmg * (ep.isBossProj ? 1.5 : 1)));
        P.hp -= dmg;
        P.invFrames = 30;
        screenShake = Math.max(screenShake, ep.isBossProj ? 8 : 3);
        addFloat('-' + dmg, P.x, P.y - 70, '#C96B6B');
        addImpactFlash(P.x, P.y - 30, ep.isBossProj ? 22 : 14, '#C96B6B');
      }
    }
  }
}

/* ════════════════════════════════════════════════════════════
   ULTIMATE — Μήνις Ἀχιλλέως
   ════════════════════════════════════════════════════════════ */
function triggerUltimate() {
  ultimateActive = true;
  ultimateCharge = 0;
  ultimateFreezeTimer = 28; // ~0.46 s freeze

  // Massive screen shake for 28 frames
  screenShake = 30;

  // Floating war-cry text
  addFloat('⚡ ΜΗΝΙΣ ΑΧΙΛΛΕΩΣ ⚡', P.x, P.y - 100, '#FFD020');
  addImpactFlash(P.x, P.y - 40, 80, '#C9A44A');

  // Radial shockwave: 60 golden/crimson particles
  const cx = P.x, cy = P.y - 30;
  for (let i = 0; i < 60; i++) {
    const angle = (Math.PI * 2 * i) / 60 + Math.random() * 0.2;
    const spd   = 5 + Math.random() * 12;
    const colors = ['#C9A44A', '#C0392B', '#FFD020', '#FF6020', '#FFFFFF'];
    SPARKS.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - 3,
      life: 55 + Math.random() * 30, maxLife: 85,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 2 + Math.random() * 5
    });
  }

  // Destroy all enemies and enemy projectiles
  for (const e of ENM) {
    if (!e.alive) continue;
    e.alive = false;
    spawnDeathSparks(e.x, e.y - 28, e.isBoss);
    totalKills++;
    score += Math.round((100 + combo * 15) * DIFF_CFG[difficulty].mult);
  }
  EPROJ.forEach(ep => { ep.alive = false; });
  ARROWS.forEach(a  => { a.alive = false; });

  setTimeout(() => { ultimateActive = false; }, 500);
  updateHUD();
}

/* ── METALLIC CLANK SPARKS (block) ── */
function spawnClankSparks(x, y) {
  const colors = ['#C9A84C', '#E8C96A', '#D4A040', '#FFFFFF'];
  for (let i = 0; i < 14; i++) {
    const angle = Math.PI * (0.5 + Math.random() * 1.0);
    SPARKS.push({
      x, y,
      vx: Math.cos(angle) * (2.5 + Math.random() * 4),
      vy: Math.sin(angle) * 2.5 - 1.5,
      life: 22, maxLife: 22,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 1.5 + Math.random() * 2
    });
  }
  addImpactFlash(x, y, 18, '#C9A84C');
}

function updateCombo() {
  if (comboTimer > 0) {
    comboTimer--;
    if (comboTimer === 0) combo = 0;
  }
  const comboHud = document.getElementById('ia-combo-hud');
  if (comboHud) {
    if (combo >= 2) {
      comboHud.textContent = combo + 'x ' + t('combo');
      comboHud.classList.add('ia-show');
    } else {
      comboHud.classList.remove('ia-show');
    }
  }
}

function checkWaveClear() {
  if (!waveActive) return;
  const alive = ENM.some(e => e.alive);
  if (!alive) {
    waveActive = false;
    gameActive = false;
    showWaveBanner();
  }
}

/* ════════════════════════════════════════════════════════════
   FLOATING TEXT & PARTICLES
   ════════════════════════════════════════════════════════════ */
function addFloat(txt, x, y, color) {
  FLOATS.push({ txt, x, y, vy: -1.2, alpha: 1, color, life: 70 });
}

function updateFloats() {
  for (let i = FLOATS.length - 1; i >= 0; i--) {
    const f = FLOATS[i];
    f.y += f.vy;
    f.life--;
    f.alpha = f.life / 70;
    if (f.life <= 0) FLOATS.splice(i, 1);
  }
}

function spawnDeathSparks(x, y, isBoss) {
  const count = isBoss ? 30 : 14;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const spd = isBoss ? (3 + Math.random() * 7) : (2 + Math.random() * 4);
    const colors = isBoss
      ? ['#FF4020', '#FF8020', '#FFD020', '#C9A84C']
      : ['#C9A84C', '#E8C96A', '#FF8020'];
    SPARKS.push({
      x, y,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd - (isBoss ? 3 : 1),
      life: isBoss ? (40 + Math.random() * 20) : (25 + Math.random() * 12),
      maxLife: isBoss ? 60 : 37,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: isBoss ? (2 + Math.random() * 4) : (1 + Math.random() * 2.5)
    });
  }
  if (isBoss) addImpactFlash(x, y, 50, '#FF6020');
}

function spawnBlockSparks(x, y) {
  for (let i = 0; i < 8; i++) {
    const angle = Math.PI * (0.7 + Math.random() * 0.6);
    SPARKS.push({ x, y, vx: Math.cos(angle) * (2 + Math.random() * 3), vy: Math.sin(angle) * 2.5 - 1, life: 20, maxLife: 20, color: '#4A8FD4', size: 1.5 + Math.random() * 1.5 });
  }
}

function updateSparks() {
  for (let i = SPARKS.length - 1; i >= 0; i--) {
    const s = SPARKS[i];
    s.x += s.vx; s.y += s.vy; s.vy += 0.32; s.vx *= 0.97; s.life--;
    if (s.life <= 0) SPARKS.splice(i, 1);
  }
}

/* ── IMPACT FLASHES ── */
function addImpactFlash(x, y, radius, color) {
  impactFlashes.push({ x, y, radius, color, life: 8, maxLife: 8 });
}

function updateImpactFlashes() {
  for (let i = impactFlashes.length - 1; i >= 0; i--) {
    impactFlashes[i].life--;
    if (impactFlashes[i].life <= 0) impactFlashes.splice(i, 1);
  }
}

/* ── ARROW RAIN ── */
function updateArrowRain() {
  if (!arrowRainActive || !waveActive) return;
  arrowRainTimer++;

  // Spawn interval: faster on higher waves & harder difficulties
  const baseInterval = difficulty === 'god' ? 18 : difficulty === 'hero' ? 28 : 45;
  const interval = Math.max(10, baseInterval - waveNum * 3);
  if (arrowRainTimer % interval === 0) {
    const count = difficulty === 'god' ? 3 : difficulty === 'hero' ? 2 : 1;
    for (let c = 0; c < count; c++) {
      const ax = CAM.x + 40 + Math.random() * (gc.width - 80);
      ARROWS.push({
        x: ax, y: -25,
        vx: (Math.random() - 0.5) * 2,
        vy: 5 + Math.random() * 3.5,
        alive: true
      });
    }
  }

  for (let i = ARROWS.length - 1; i >= 0; i--) {
    const a = ARROWS[i];
    if (!a.alive) { ARROWS.splice(i, 1); continue; }
    a.x += a.vx; a.y += a.vy;
    if (a.y > GROUND_Y + 10) {
      a.alive = false;
      spawnBlockSparks(a.x, GROUND_Y);
      continue;
    }
    // Hit player
    if (Math.abs(a.x - P.x) < 18 && a.y > P.y - 65 && a.y < P.y + 5) {
      a.alive = false;
      if (P.shielding) {
        addFloat(t('blockText'), P.x, P.y - 70, '#C9A84C');
        spawnClankSparks(P.x, P.y - 30);
      } else if (P.invFrames === 0) {
        const dmg = applyDmg(Math.round(DIFF_CFG[difficulty].eDmg * 0.65));
        P.hp -= dmg;
        P.invFrames = 28;
        screenShake = Math.max(screenShake, 4);
        addFloat('↓ -' + dmg, P.x, P.y - 70, '#C96B6B');
        addImpactFlash(P.x, P.y - 35, 14, '#C96B6B');
      }
    }
  }
}

/* ════════════════════════════════════════════════════════════
   DRAWING
   ════════════════════════════════════════════════════════════ */
function draw() {
  const W = gc.width, H = gc.height;
  ctx.clearRect(0, 0, W, H);
  ctx.save();

  // Screen shake
  const shk = screenShake;
  if (shk > 0) {
    ctx.translate(
      (Math.random() - 0.5) * shk * 1.1,
      (Math.random() - 0.5) * shk * 0.7
    );
  }
  ctx.translate(-CAM.x, 0);

  drawBackground(W, H);
  drawGround(W, H);

  // Pickups on the ground (drawn before characters so they appear beneath)
  drawPickups();

  // Impact flashes (behind sprites)
  for (const f of impactFlashes) {
    const alpha = f.life / f.maxLife;
    ctx.globalAlpha = alpha * 0.75;
    const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius);
    grad.addColorStop(0, f.color);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = 1;
  }

  // Enemy projectiles
  for (const ep of EPROJ) {
    if (!ep.alive) continue;
    if (ep.isBossSpear) {
      drawSpear(ep.x, ep.y, ep.vx > 0 ? 1 : -1, '#FF8000', '#8B4010');
    } else {
      const col = ep.isBossProj ? '#FF6030' : '#C96B6B';
      drawSpear(ep.x, ep.y, ep.vx > 0 ? 1 : -1, col, '#8B1A1A');
    }
  }

  // Player projectiles
  for (const p of PROJ) {
    if (!p.alive) continue;
    drawSpear(p.x, p.y, p.vx > 0 ? 1 : -1, '#E8C96A', '#8B6A1A');
  }

  // Falling arrows
  for (const a of ARROWS) {
    if (!a.alive) continue;
    drawArrow(a.x, a.y, a.vx, a.vy);
  }

  // Enemies
  for (const e of ENM) {
    if (!e.alive) continue;
    drawEnemySprite(e);
    drawEnemyHPBar(e);
  }

  // Sparks
  for (const s of SPARKS) {
    ctx.globalAlpha = Math.max(0, s.life / (s.maxLife || 25));
    ctx.fillStyle = s.color;
    const sz = s.size || 2;
    ctx.beginPath(); ctx.arc(s.x, s.y, sz, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Player
  if (P.alive) drawHeroSprite(P);

  // Floating text
  for (const f of FLOATS) {
    ctx.save();
    ctx.globalAlpha = f.alpha;
    ctx.fillStyle = f.color;
    ctx.font = 'bold 14px Cinzel, serif';
    ctx.textAlign = 'center';
    // Drop shadow for readability
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(f.txt, f.x, f.y);
    ctx.restore();
  }

  ctx.restore();

  // Boss HP overlay bar (fixed, outside camera translate)
  if ((isBossWave || isMiniBossWave) && ENM.length) {
    const boss = ENM.find(e => e.isBoss && e.alive);
    if (boss) drawBossHPOverlay(boss, W);
  }

  // Arrow rain warning (top flash)
  if (arrowRainActive && waveActive && ARROWS.length > 0) {
    ctx.save();
    ctx.globalAlpha = 0.12 + Math.sin(Date.now() * 0.012) * 0.06;
    ctx.fillStyle = '#FFD020';
    ctx.fillRect(0, 0, W, 3);
    ctx.restore();
  }
}

/* ── BACKGROUND ── */
function drawBackground(W, H) {
  // More dramatic Tekken-style night sky
  const sky = ctx.createLinearGradient(CAM.x, 0, CAM.x, H * 0.7);
  sky.addColorStop(0,   '#050208');
  sky.addColorStop(0.25,'#0E0616');
  sky.addColorStop(0.6, '#180808');
  sky.addColorStop(1,   '#281006');
  ctx.fillStyle = sky;
  ctx.fillRect(CAM.x, 0, W, H * 0.7);

  // Atmospheric blood-moon glow if boss or mini-boss wave
  if (isBossWave || isMiniBossWave) {
    const bossAlive = ENM.some(e => e.isBoss && e.alive);
    if (bossAlive) {
      ctx.save();
      ctx.globalAlpha = 0.07 + Math.sin(Date.now() * 0.0015) * 0.03;
      const grd = ctx.createRadialGradient(CAM.x + W * 0.6, H * 0.15, 0, CAM.x + W * 0.6, H * 0.15, H * 0.5);
      grd.addColorStop(0, '#FF2200');
      grd.addColorStop(1, 'transparent');
      ctx.fillStyle = grd;
      ctx.fillRect(CAM.x, 0, W, H);
      ctx.restore();
    }
  }

  // Troy walls on right side
  drawTroyWalls(H);
  // Greek ships on left side
  drawGreekShips(H);
  // Background fighters
  drawBgFighters(H);
}

function drawTroyWalls(H) {
  const wallX = LEVEL_W * 0.55;
  const wallTop = H * 0.08;
  const wallH = GROUND_Y - wallTop;
  // Main wall
  ctx.fillStyle = '#4A3820';
  ctx.fillRect(wallX, wallTop, LEVEL_W * 0.5, wallH);
  // Stone texture rows
  ctx.fillStyle = '#3A2A14';
  for (let row = 0; row < 8; row++) {
    const rowY = wallTop + row * (wallH / 8);
    for (let col = 0; col < 20; col++) {
      if ((row + col) % 2 === 0) {
        ctx.fillRect(wallX + col * 60, rowY, 58, wallH / 8 - 2);
      }
    }
  }
  // Crenellations
  ctx.fillStyle = '#5A4828';
  for (let c = 0; c < 18; c++) {
    ctx.fillRect(wallX + c * 55, wallTop - 18, 38, 20);
  }
  // Tower
  ctx.fillStyle = '#5A4828';
  ctx.fillRect(wallX - 30, wallTop - 40, 80, wallH + 40);
  ctx.fillStyle = '#3A2A14';
  for (let tc = 0; tc < 4; tc++) {
    ctx.fillRect(wallX - 28 + tc * 22, wallTop - 55, 16, 20);
  }
  // Torches
  for (let t = 0; t < 3; t++) {
    const tx = wallX + t * 200 + 40;
    ctx.fillStyle = '#8B5A10';
    ctx.fillRect(tx, wallTop + 10, 6, 24);
    ctx.fillStyle = `rgba(255,160,40,${0.6 + Math.sin(Date.now() * 0.008 + t) * 0.3})`;
    ctx.beginPath();
    ctx.arc(tx + 3, wallTop + 6, 7, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawGreekShips(H) {
  const shipX = -100;
  // Hull
  ctx.fillStyle = '#4A2A0A';
  ctx.beginPath();
  ctx.moveTo(shipX + 20, GROUND_Y - 10);
  ctx.lineTo(shipX + 180, GROUND_Y - 10);
  ctx.lineTo(shipX + 200, GROUND_Y + 20);
  ctx.lineTo(shipX, GROUND_Y + 20);
  ctx.closePath();
  ctx.fill();
  // Mast
  ctx.fillStyle = '#7A5020';
  ctx.fillRect(shipX + 90, GROUND_Y - 80, 6, 72);
  // Sail
  ctx.fillStyle = 'rgba(200,170,100,0.85)';
  ctx.beginPath();
  ctx.moveTo(shipX + 93, GROUND_Y - 78);
  ctx.lineTo(shipX + 140, GROUND_Y - 50);
  ctx.lineTo(shipX + 93, GROUND_Y - 20);
  ctx.closePath();
  ctx.fill();
  // Oars
  ctx.strokeStyle = '#6A4010';
  ctx.lineWidth = 2;
  for (let i = 0; i < 5; i++) {
    ctx.beginPath();
    ctx.moveTo(shipX + 30 + i * 28, GROUND_Y + 5);
    ctx.lineTo(shipX + 10 + i * 28, GROUND_Y + 30);
    ctx.stroke();
  }
}

function drawBgFighters(H) {
  // A few tiny silhouette fighters mid-ground
  const midY = GROUND_Y - 10;
  ctx.fillStyle = 'rgba(80,40,20,0.4)';
  const positions = [500, 900, 1400, 1800, 2200];
  for (const px of positions) {
    // Silhouette body
    ctx.fillRect(px - 5, midY - 32, 10, 24);
    ctx.beginPath(); ctx.arc(px, midY - 40, 7, 0, Math.PI * 2); ctx.fill();
    // Sword
    ctx.fillRect(px + 4, midY - 38, 3, 18);
  }
}

function drawGround(W, H) {
  // Sandy ground
  const grd = ctx.createLinearGradient(0, GROUND_Y, 0, GROUND_Y + 50);
  grd.addColorStop(0, '#8B6030');
  grd.addColorStop(1, '#4A3018');
  ctx.fillStyle = grd;
  ctx.fillRect(CAM.x, GROUND_Y, W + CAM.x, H - GROUND_Y + 10);

  // Debris / ground detail
  ctx.fillStyle = '#7A5028';
  for (let i = 0; i < 30; i++) {
    const dx = (i * 97 + 40) % LEVEL_W;
    ctx.fillRect(dx, GROUND_Y + 1, 8 + (i % 5) * 4, 3);
  }
}

/* ── SPRITES ── */
function drawHeroSprite(p) {
  const hc = HERO_COLORS[currentBook ? currentBook.heroKey : 'achilles'];
  const x = Math.round(p.x);
  const y = Math.round(p.y);
  const f = p.facing;
  const bob = Math.sin(Date.now() * 0.006) * (p.onGround ? 1.5 : 0);
  const walkCycle = Math.sin(Date.now() * 0.02) * (Math.abs(p.vx) > 0.5 ? 5 : 0);
  const flash = p.invFrames > 0 && Math.floor(Date.now() / 55) % 2 === 0;
  const attacking = p.swingTimer > 0;
  const atkSwing = attacking ? (12 - p.swingTimer) * 5 : 0;

  ctx.save();
  ctx.translate(x, y + bob);
  if (f < 0) ctx.scale(-1, 1);
  if (flash) ctx.globalAlpha = 0.35;

  // Aura glow when attacking
  if (attacking) {
    ctx.save();
    ctx.globalAlpha = (flash ? 0.35 : 1) * 0.18;
    ctx.fillStyle = hc.armor;
    ctx.beginPath(); ctx.arc(0, -40, 28, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }

  // Cape (flowing)
  ctx.fillStyle = hc.cape;
  ctx.beginPath();
  ctx.moveTo(-5, -54);
  ctx.lineTo(-20 + walkCycle * 0.5, -8);
  ctx.lineTo(-8, -6);
  ctx.closePath();
  ctx.fill();
  // Cape highlight
  ctx.globalAlpha = (flash ? 0.15 : 0.25);
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.moveTo(-5, -54);
  ctx.lineTo(-12, -20);
  ctx.lineTo(-8, -20);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = flash ? 0.35 : 1;

  // Legs
  ctx.fillStyle = '#1C1414';
  ctx.fillRect(-9, -24, 8, 24);
  ctx.fillRect(1,  -24, 8, 24 - walkCycle);
  // Greaves (bronze)
  ctx.fillStyle = hc.armor;
  ctx.fillRect(-10, -6, 10, 7);
  ctx.fillRect(0,   -6 - walkCycle, 10, 7);

  // Body armor
  ctx.fillStyle = hc.body;
  ctx.fillRect(-13, -54, 26, 32);
  // Armor plates with highlight
  ctx.fillStyle = hc.armor;
  ctx.fillRect(-11, -52, 22, 5);
  ctx.fillRect(-11, -44, 22, 5);
  ctx.fillRect(-11, -36, 22, 5);
  // Armor rim highlight
  ctx.globalAlpha = (flash ? 0.14 : 0.35);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-11, -52, 22, 2);
  ctx.fillRect(-11, -44, 22, 2);
  ctx.globalAlpha = flash ? 0.35 : 1;

  // Shield when blocking — bronze aspis arc with glow
  if (p.shielding) {
    const shieldX = -24, shieldY = -38, shieldR = 17;
    // Outer glow
    ctx.globalAlpha = flash ? 0.15 : 0.35;
    ctx.shadowColor = '#C9A84C'; ctx.shadowBlur = 18;
    ctx.strokeStyle = '#FFD060'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(shieldX, shieldY, shieldR + 4, -Math.PI * 0.75, Math.PI * 0.35); ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.globalAlpha = flash ? 0.35 : 1;
    // Shield body
    ctx.fillStyle = '#8B6020';
    ctx.beginPath(); ctx.arc(shieldX, shieldY, shieldR, 0, Math.PI * 2); ctx.fill();
    // Bronze rim
    ctx.strokeStyle = '#C9A84C'; ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.arc(shieldX, shieldY, shieldR, 0, Math.PI * 2); ctx.stroke();
    // Inner boss
    ctx.fillStyle = '#C9A84C';
    ctx.beginPath(); ctx.arc(shieldX, shieldY, 5, 0, Math.PI * 2); ctx.fill();
    // Highlight
    ctx.globalAlpha = flash ? 0.08 : 0.28;
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath(); ctx.arc(shieldX - 5, shieldY - 6, 6, 0, Math.PI * 2); ctx.fill();
    ctx.globalAlpha = flash ? 0.35 : 1;
  } else {
    ctx.fillStyle = hc.body;
    ctx.fillRect(-20, -52, 9, 24);
  }

  // Weapon arm
  ctx.fillStyle = hc.body;
  ctx.fillRect(11, -52, 9, 24);

  if (attacking) {
    ctx.save();
    ctx.translate(15, -42);
    ctx.rotate((-0.6 + atkSwing / 36) * Math.PI);
    // Sword blade
    const swordGrad = ctx.createLinearGradient(-2, -30, 2, 0);
    swordGrad.addColorStop(0, '#E8E8F8');
    swordGrad.addColorStop(1, '#A0A0B8');
    ctx.fillStyle = swordGrad;
    ctx.fillRect(-2, -32, 4, 32);
    // Cross-guard
    ctx.fillStyle = hc.armor;
    ctx.fillRect(-7, -2, 14, 5);
    // Swing arc (motion blur effect)
    ctx.globalAlpha = (flash ? 0.1 : 0.2);
    ctx.fillStyle = '#E8C96A';
    ctx.beginPath();
    ctx.arc(0, 0, 24, -Math.PI * 0.8, -Math.PI * 0.3);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#E8C96A';
    ctx.stroke();
    ctx.restore();
  } else {
    // Spear at rest
    ctx.fillStyle = '#8B6A1A';
    ctx.fillRect(13, -65, 4, 40);
    ctx.fillStyle = '#C8C8D8';
    ctx.fillRect(12, -74, 6, 13);
    // Spearhead highlight
    ctx.globalAlpha = (flash ? 0.14 : 0.5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(12, -74, 2, 8);
    ctx.globalAlpha = flash ? 0.35 : 1;
  }

  // Neck
  ctx.fillStyle = '#C8906A';
  ctx.fillRect(-4, -60, 8, 8);

  // Head
  ctx.fillStyle = '#D4A87A';
  ctx.beginPath(); ctx.arc(0, -64, 11, 0, Math.PI * 2); ctx.fill();

  // Helmet
  ctx.fillStyle = hc.helm;
  ctx.fillRect(-13, -75, 26, 13);
  ctx.fillRect(-10, -80, 20, 7);
  // Helmet highlight
  ctx.globalAlpha = (flash ? 0.1 : 0.3);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-13, -75, 26, 3);
  ctx.globalAlpha = flash ? 0.35 : 1;
  // Plume
  ctx.fillStyle = '#C03040';
  ctx.fillRect(-3, -92, 6, 16);
  ctx.fillStyle = '#E05060';
  ctx.fillRect(-2, -92, 3, 12);

  ctx.restore();
}

function drawEnemySprite(e) {
  if (e.isBoss) { drawBossSprite(e); return; }
  const x = Math.round(e.x);
  const y = Math.round(e.y);
  const f = e.facing;
  const bob = Math.sin(e.animTick * 0.08) * (Math.abs(e.vx) > 0.2 ? 3 : 1);
  const flash = e.invFrames > 0 && Math.floor(Date.now() / 50) % 2 === 0;

  // Color variants: standard red, dark purple, bronze-dark
  const bodyColors = [
    { body: '#8B1A1A', armor: '#6B1010', helm: '#7A1010', plume: '#4A0808' },
    { body: '#5A1A5A', armor: '#3A1040', helm: '#5A1050', plume: '#800080' },
    { body: '#6A4010', armor: '#4A2808', helm: '#7A5010', plume: '#3A1808' }
  ];
  const ec = bodyColors[e.colorVariant || 0];

  ctx.save();
  ctx.translate(x, y + bob);
  if (f < 0) ctx.scale(-1, 1);
  if (flash) ctx.globalAlpha = 0.3;

  const walkCycle = Math.sin(e.animTick * 0.18) * (Math.abs(e.vx) > 0.2 ? 4 : 0);

  // Legs
  ctx.fillStyle = '#2A0A0A';
  ctx.fillRect(-8, -20, 7, 20);
  ctx.fillRect(1,  -20, 7, 20 - walkCycle);
  // Boots
  ctx.fillStyle = ec.armor;
  ctx.fillRect(-10, -4, 10, 5);
  ctx.fillRect(0,   -4 - walkCycle, 10, 5);

  // Body
  ctx.fillStyle = ec.body;
  ctx.fillRect(-11, -48, 22, 30);
  ctx.fillStyle = ec.armor;
  ctx.fillRect(-9,  -46, 18, 4);
  ctx.fillRect(-9,  -39, 18, 4);
  ctx.fillRect(-9,  -32, 18, 4);
  // Armor edge highlight
  ctx.globalAlpha = flash ? 0.1 : 0.2;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-9, -46, 18, 2);
  ctx.globalAlpha = flash ? 0.3 : 1;

  // Arms
  ctx.fillStyle = ec.body;
  ctx.fillRect(-18, -46, 8, 20);
  ctx.fillRect(10,  -46, 8, 20);

  // Spear
  ctx.fillStyle = '#7A5020';
  ctx.fillRect(15, -60, 3, 34);
  ctx.fillStyle = '#C0C0C8';
  ctx.fillRect(14, -68, 5, 11);
  ctx.globalAlpha = flash ? 0.1 : 0.4;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(14, -68, 2, 7);
  ctx.globalAlpha = flash ? 0.3 : 1;

  // Head
  ctx.fillStyle = '#C8A070';
  ctx.beginPath(); ctx.arc(0, -54, 9, 0, Math.PI * 2); ctx.fill();

  // Helmet
  ctx.fillStyle = ec.helm;
  ctx.fillRect(-11, -64, 22, 12);
  ctx.fillRect(-8,  -68, 16, 6);
  ctx.globalAlpha = flash ? 0.1 : 0.25;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-11, -64, 22, 3);
  ctx.globalAlpha = flash ? 0.3 : 1;
  // Plume
  ctx.fillStyle = ec.plume;
  ctx.fillRect(-2, -78, 4, 12);

  ctx.restore();
}

function drawBossSprite(e) {
  const x = Math.round(e.x);
  const y = Math.round(e.y);
  const f = e.facing;
  const bob = Math.sin(e.animTick * 0.06) * 2.5;
  const flash = e.invFrames > 0 && Math.floor(Date.now() / 45) % 2 === 0;
  const s = 1.75;
  const rage = e.rageMode;
  const charging = Math.abs(e.chargeVx) > 2;

  ctx.save();
  ctx.translate(x, y + bob);
  if (f < 0) ctx.scale(-s, s); else ctx.scale(s, s);
  if (flash) ctx.globalAlpha = 0.3;

  // Pulsing aura — larger and more dramatic in rage
  const auraPulse = 0.12 + Math.sin(Date.now() * 0.007) * 0.06;
  ctx.globalAlpha = (flash ? 0.12 : auraPulse);
  const auraColor = rage ? '#FF2200' : '#8B0000';
  const auraRad = rage ? 44 : 36;
  const auraGrd = ctx.createRadialGradient(0, -46, 0, 0, -46, auraRad);
  auraGrd.addColorStop(0, auraColor);
  auraGrd.addColorStop(1, 'transparent');
  ctx.fillStyle = auraGrd;
  ctx.beginPath(); ctx.arc(0, -46, auraRad, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = flash ? 0.3 : 1;

  // Charging motion blur
  if (charging) {
    ctx.globalAlpha = flash ? 0.12 : 0.15;
    ctx.fillStyle = rage ? '#FF4400' : '#C9A84C';
    ctx.fillRect(-14, -56, 28, 56);
    ctx.globalAlpha = flash ? 0.3 : 1;
  }

  const walkCycle = Math.sin(e.animTick * 0.14) * (Math.abs(e.vx) > 0.2 ? 5 : 0);

  // Legs — heavier, darker
  ctx.fillStyle = '#1A0606';
  ctx.fillRect(-10, -24, 9, 24);
  ctx.fillRect(1,   -24, 9, 24 - walkCycle);
  // Heavy greaves
  ctx.fillStyle = rage ? '#8B2010' : '#7A5810';
  ctx.fillRect(-12, -7, 12, 8);
  ctx.fillRect(0,   -7 - walkCycle, 12, 8);

  // Flowing dark cloak (behind body)
  ctx.fillStyle = rage ? '#400808' : '#2A0808';
  ctx.beginPath();
  ctx.moveTo(-12, -52);
  ctx.lineTo(-28 + walkCycle * 0.6, -6);
  ctx.lineTo(-14, -4);
  ctx.closePath();
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(12, -52);
  ctx.lineTo(28 - walkCycle * 0.6, -6);
  ctx.lineTo(14, -4);
  ctx.closePath();
  ctx.fill();

  // Body armor
  const bodyCol = rage ? '#7A2810' : '#7A4A10';
  ctx.fillStyle = bodyCol;
  ctx.fillRect(-13, -56, 26, 36);

  // Armor bands
  const bandCol = rage ? '#E04020' : '#C9A84C';
  ctx.fillStyle = bandCol;
  ctx.fillRect(-11, -54, 22, 6);
  ctx.fillRect(-11, -44, 22, 6);
  ctx.fillRect(-11, -34, 22, 6);
  // Highlight edges
  ctx.globalAlpha = flash ? 0.1 : 0.35;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-11, -54, 22, 2);
  ctx.fillRect(-11, -44, 22, 2);
  ctx.globalAlpha = flash ? 0.3 : 1;

  // Pauldrons (shoulder armor)
  ctx.fillStyle = bandCol;
  ctx.beginPath(); ctx.arc(-14, -52, 7, Math.PI, 0); ctx.fill();
  ctx.beginPath(); ctx.arc( 14, -52, 7, Math.PI, 0); ctx.fill();

  // Arms
  ctx.fillStyle = bodyCol;
  ctx.fillRect(-22, -54, 10, 24);
  ctx.fillRect(12,  -54, 10, 24);

  // Massive sword (greatsword with glow)
  const swordGrd = ctx.createLinearGradient(16, -92, 20, -26);
  swordGrd.addColorStop(0, '#E0E0F0');
  swordGrd.addColorStop(0.5, '#C0A060');
  swordGrd.addColorStop(1, '#606030');
  ctx.fillStyle = swordGrd;
  ctx.fillRect(16, -92, 7, 66);
  // Cross-guard
  ctx.fillStyle = bandCol;
  ctx.fillRect(10, -30, 18, 6);
  ctx.fillRect(14, -92, 9, 14);
  // Sword glow
  ctx.globalAlpha = flash ? 0.1 : (rage ? 0.3 : 0.15);
  ctx.fillStyle = rage ? '#FF4020' : '#E8C96A';
  ctx.fillRect(14, -92, 11, 66);
  ctx.globalAlpha = flash ? 0.3 : 1;

  // Head
  ctx.fillStyle = '#C09060';
  ctx.beginPath(); ctx.arc(0, -66, 13, 0, Math.PI * 2); ctx.fill();

  // Heavy war helmet
  ctx.fillStyle = rage ? '#8B1A10' : '#C9A84C';
  ctx.fillRect(-15, -78, 30, 15);
  ctx.fillRect(-12, -84, 24, 8);
  // Crown spikes
  ctx.fillRect(-11, -91, 5, 9);
  ctx.fillRect(-3,  -95, 6, 12);
  ctx.fillRect(6,   -91, 5, 9);
  // Helmet highlight
  ctx.globalAlpha = flash ? 0.08 : 0.3;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(-15, -78, 30, 4);
  ctx.globalAlpha = flash ? 0.3 : 1;
  // Red/rage plume
  ctx.fillStyle = rage ? '#FF1010' : '#C92020';
  ctx.fillRect(-3, -106, 6, 18);
  ctx.fillStyle = rage ? '#FF5050' : '#E04040';
  ctx.fillRect(-2, -106, 3, 14);

  // Glowing eyes
  const eyeColor = rage ? '#FF2020' : '#FF5050';
  ctx.fillStyle = eyeColor;
  ctx.beginPath(); ctx.arc(-5, -68, 3, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc( 5, -68, 3, 0, Math.PI * 2); ctx.fill();
  // Eye inner glow
  ctx.globalAlpha = flash ? 0.2 : 0.8;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.arc(-5, -68, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc( 5, -68, 1.2, 0, Math.PI * 2); ctx.fill();
  ctx.globalAlpha = flash ? 0.3 : 1;

  ctx.restore();
}

function drawEnemyHPBar(e) {
  const barW = e.isBoss ? 80 : 36;
  const x = e.x - barW / 2;
  const y = e.y - (e.isBoss ? 140 : 72);
  ctx.fillStyle = 'rgba(0,0,0,0.6)';
  ctx.fillRect(x - 1, y - 1, barW + 2, e.isBoss ? 12 : 8);
  const pct = Math.max(0, e.hp / e.maxHp);
  ctx.fillStyle = e.isBoss
    ? (pct > 0.5 ? '#C92020' : pct > 0.25 ? '#E07020' : '#FFD700')
    : (pct > 0.5 ? '#5A9E6F' : pct > 0.25 ? '#C9A84C' : '#C96B6B');
  ctx.fillRect(x, y, barW * pct, e.isBoss ? 10 : 6);
  if (e.isBoss) {
    ctx.fillStyle = '#C9A84C';
    ctx.font = 'bold 9px Cinzel, serif';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS', e.x, y - 4);
  }
}

/* ── PICKUPS ── */
function drawPickups() {
  for (const pk of PICKUPS) {
    if (!pk.alive) continue;
    const alpha = pk.life < 120 ? pk.life / 120 : 1; // fade out in last 2s
    const bob = Math.sin(Date.now() * 0.006 + pk.bobOffset) * 4;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (pk.type === 'hp') {
      drawHPPack(pk.x, pk.y - 14 + bob);
    } else {
      drawDmgVial(pk.x, pk.y - 14 + bob);
    }
    ctx.restore();
  }
}

function drawHPPack(x, y) {
  ctx.save();
  // Glow halo
  ctx.shadowColor = '#FF4444';
  ctx.shadowBlur = 12;
  // Body: red cross
  ctx.fillStyle = '#CC1010';
  ctx.fillRect(x - 4, y - 12, 8, 20);   // vertical bar
  ctx.fillRect(x - 10, y - 6, 20, 8);   // horizontal bar
  // Highlight stripe
  ctx.fillStyle = 'rgba(255,180,180,0.55)';
  ctx.fillRect(x - 2, y - 10, 3, 8);
  // Bright border outline
  ctx.strokeStyle = '#FF6666';
  ctx.lineWidth = 1;
  ctx.strokeRect(x - 4, y - 12, 8, 20);
  ctx.strokeRect(x - 10, y - 6, 20, 8);
  ctx.restore();
}

function drawDmgVial(x, y) {
  ctx.save();
  // Glow
  ctx.shadowColor = '#FFD020';
  ctx.shadowBlur = 14;
  // Flask body
  ctx.fillStyle = '#C9891A';
  ctx.beginPath();
  ctx.ellipse(x, y, 7, 9, 0, 0, Math.PI * 2);
  ctx.fill();
  // Inner liquid shimmer
  ctx.fillStyle = '#FFD020';
  ctx.globalAlpha *= 0.55;
  ctx.beginPath();
  ctx.ellipse(x, y + 1, 5, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha *= (1 / 0.55); // restore proportion
  // Neck
  ctx.fillStyle = '#7A5010';
  ctx.fillRect(x - 3, y - 11, 6, 5);
  // Cork
  ctx.fillStyle = '#5A3808';
  ctx.fillRect(x - 2.5, y - 14, 5, 4);
  // Shine spot
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.beginPath();
  ctx.ellipse(x - 2, y - 2, 2, 3, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawSpear(x, y, dir, tipColor, shaftColor) {
  ctx.save();
  ctx.translate(x, y);
  const angle = Math.atan2(0.18, dir * 12);
  ctx.rotate(angle);
  ctx.fillStyle = shaftColor;
  ctx.fillRect(-14 * dir, -2, 28, 3);
  ctx.fillStyle = tipColor;
  ctx.beginPath();
  ctx.moveTo(14 * dir, -4);
  ctx.lineTo(14 * dir + 8 * dir, 0);
  ctx.lineTo(14 * dir, 4);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawArrow(x, y, vx, vy) {
  const angle = Math.atan2(vy, vx === 0 ? 0.01 : vx);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  // Shaft
  ctx.fillStyle = '#7A5010';
  ctx.fillRect(-15, -1.5, 30, 3);
  // Head
  ctx.fillStyle = '#B0B8C0';
  ctx.beginPath();
  ctx.moveTo(15, -4);
  ctx.lineTo(24, 0);
  ctx.lineTo(15, 4);
  ctx.closePath();
  ctx.fill();
  // Fletching
  ctx.fillStyle = '#A04020';
  ctx.beginPath(); ctx.moveTo(-15, -1); ctx.lineTo(-22, -6); ctx.lineTo(-19, -1); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-15,  1); ctx.lineTo(-22,  6); ctx.lineTo(-19,  1); ctx.closePath(); ctx.fill();
  ctx.restore();
}

function drawBossHPOverlay(boss, W) {
  ctx.save();
  const barW = Math.min(W * 0.55, 360);
  const barX = (W - barW) / 2;
  const barY = 4;
  const pct  = Math.max(0, boss.hp / boss.maxHp);
  const rage = boss.rageMode;

  // Outer glow when in rage
  if (rage) {
    ctx.globalAlpha = 0.22 + Math.sin(Date.now() * 0.012) * 0.09;
    ctx.fillStyle = '#FF2200';
    ctx.fillRect(barX - 5, barY - 5, barW + 10, 28);
    ctx.globalAlpha = 1;
  }

  // Track background
  ctx.fillStyle = 'rgba(0,0,0,0.78)';
  ctx.fillRect(barX - 1, barY - 1, barW + 2, 16);

  // HP fill
  const col = rage ? '#FF1010' : (pct > 0.5 ? '#B81818' : pct > 0.25 ? '#D05010' : '#FFB800');
  ctx.fillStyle = col;
  ctx.fillRect(barX, barY, barW * pct, 14);

  // Shine stripe
  ctx.globalAlpha = 0.25;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(barX, barY, barW * pct, 4);
  ctx.globalAlpha = 1;

  // Segment lines every 25%
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  for (let i = 1; i < 4; i++) {
    ctx.fillRect(barX + barW * (i / 4) - 1, barY, 2, 14);
  }

  // Label above
  ctx.fillStyle = rage ? '#FF4444' : '#C9A84C';
  ctx.font = `bold ${rage ? 10 : 9}px Cinzel, serif`;
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(0,0,0,0.95)';
  ctx.shadowBlur = 5;
  const bossLabel = boss.isMiniBoss
    ? (rage ? '⚡ MINI BOSS — RAGE ⚡' : '⚔ MINI BOSS ⚔')
    : (rage ? '⚡ BOSS — RAGE MODE ⚡' : '⚔ BOSS ⚔');
  ctx.fillText(bossLabel, W / 2, barY - 1);
  ctx.restore();
}

/* ════════════════════════════════════════════════════════════
   HUD
   ════════════════════════════════════════════════════════════ */
function updateHUD() {
  const hp    = document.getElementById('ia-hp-bar');
  const hpNum = document.getElementById('ia-hp-num');
  const scoreEl = document.getElementById('ia-score-val');
  const waveEl  = document.getElementById('ia-wave-val');
  const bookEl  = document.getElementById('ia-book-hud');
  const dmgEl   = document.getElementById('ia-dmg-boost');
  const ultFill = document.getElementById('ia-ult-fill');
  const ultNum  = document.getElementById('ia-ult-num');

  if (!hp || !P) return;
  const pct = Math.max(0, (P.hp || 0) / (P.maxHp || 125));
  hp.style.width = (pct * 100) + '%';
  // Dynamic colour: >50% green, 20-50% orange, <20% critical red
  if (pct > 0.5)       hp.className = 'ia-hp-bar ia-full';
  else if (pct > 0.20) hp.className = 'ia-hp-bar ia-mid';
  else                 hp.className = 'ia-hp-bar';

  if (hpNum) hpNum.textContent = Math.ceil(Math.max(0, P.hp || 0));
  if (scoreEl) scoreEl.textContent = score;
  if (waveEl) waveEl.textContent = `${t('wave')} ${waveNum} ${t('of')} ${totalWaves}`;
  if (bookEl && currentBook) bookEl.textContent = bd(currentBook).name;
  if (dmgEl) {
    const boostPct = Math.round((playerDmgMult - 1) * 100);
    dmgEl.textContent = boostPct > 0 ? `⚔ +${boostPct}%` : '';
    dmgEl.style.display = boostPct > 0 ? '' : 'none';
  }
  // Ultimate gauge
  if (ultFill) {
    const ultPct = ultimateCharge / ULTIMATE_MAX;
    ultFill.style.width = (ultPct * 100) + '%';
    const ready = ultimateCharge >= ULTIMATE_MAX;
    ultFill.className = 'ia-ult-fill' + (ready ? ' ia-ult-ready' : '');
  }
  if (ultNum) {
    const ready = ultimateCharge >= ULTIMATE_MAX;
    ultNum.textContent = ready ? 'READY' : Math.floor(ultimateCharge) + '%';
    ultNum.className = 'ia-ult-num' + (ready ? ' ia-ult-ready' : '');
    const touchUlt = document.getElementById('ia-ult-touch-btn');
    if (touchUlt) touchUlt.className = 'ia-act-btn ia-ult-btn' + (ready ? ' ia-ult-ready' : '');
  }
}

/* ════════════════════════════════════════════════════════════
   WAVE BANNER & QUIZ
   ════════════════════════════════════════════════════════════ */
function showWaveBanner() {
  const banner = document.getElementById('ia-wave-banner');
  if (!banner) return;
  const isLast = waveNum >= totalWaves;
  banner.querySelector('.ia-wb-line1').textContent = t('waveCleared');
  banner.querySelector('.ia-wb-line2').textContent = isLast ? bd(currentBook).title : t('quizTime');
  banner.classList.add('ia-show');

  window._ia_waveTimeout = setTimeout(() => {
    banner.classList.remove('ia-show');
    if (quizQueue.length > 0) {
      openQuiz(quizQueue.shift());
    } else if (isLast) {
      finishGame();
    } else {
      spawnNextWave();
    }
  }, 900);
}

function openQuiz(qData) {
  const qObj = qData[lang] || qData.en;
  const cfg = DIFF_CFG[difficulty];
  quizAnswered = false;

  const quizEl = document.getElementById('ia-quiz');
  const inner = document.getElementById('ia-quiz-inner');
  if (!quizEl || !inner) return;

  // Render content
  const timerHTML = cfg.timer > 0
    ? `<div class="ia-quiz-timer-wrap">
        <div class="ia-quiz-timer-bg"><div class="ia-quiz-timer-bar" id="ia-qtbar" style="width:100%"></div></div>
        <div class="ia-quiz-timer-num" id="ia-qtnum">${cfg.timer}</div>
       </div>`
    : '';

  const bossLabel = isBossWave ? `<div class="ia-quiz-boss-label">⚔ BOSS WAVE ⚔</div>` : '';
  inner.innerHTML = `
    <div class="ia-quiz-header">
      <div class="ia-quiz-title">${t('wave')} ${waveNum} — ${bd(currentBook).title}</div>
      ${timerHTML}
    </div>
    ${bossLabel}
    <div class="ia-quiz-q">${qObj.q}</div>
    <div class="ia-quiz-opts" id="ia-qopts">
      ${qObj.opts.map((o, i) => `
        <button class="ia-quiz-opt" id="ia-qopt-${i}" onclick="window._ia_quizAnswer(${i}, ${qObj.ans}, ${JSON.stringify(qObj.opts[qObj.ans]).replace(/"/g, '&quot;')}, ${JSON.stringify(qObj.exp).replace(/"/g, '&quot;')})">
          <span class="ia-quiz-opt-letter">${'ABCD'[i]}.</span>${o}
        </button>`).join('')}
    </div>
    <div class="ia-quiz-exp" id="ia-qexp"></div>
    <button class="ia-quiz-continue" id="ia-qcont" onclick="window._ia_quizContinue()">${t('continue')}</button>`;

  // Open as full-screen overlay
  quizEl.classList.toggle('ia-boss-wave', isBossWave);
  quizEl.classList.add('ia-open');

  // Start timer
  if (cfg.timer > 0) {
    quizTimerVal = cfg.timer;
    clearInterval(quizTimerInt);
    quizTimerInt = setInterval(() => {
      quizTimerVal--;
      const bar = document.getElementById('ia-qtbar');
      const num = document.getElementById('ia-qtnum');
      if (bar) bar.style.width = (quizTimerVal / cfg.timer * 100) + '%';
      if (bar) bar.style.background = quizTimerVal > cfg.timer * 0.4 ? '#C9A84C' : quizTimerVal > cfg.timer * 0.2 ? '#E8A030' : '#C96B6B';
      if (num) num.textContent = quizTimerVal;
      if (quizTimerVal <= 0) {
        clearInterval(quizTimerInt);
        if (!quizAnswered) quizTimeout(qObj.opts[qObj.ans], qObj.exp, qData);
      }
    }, 1000);
  }
}

function quizAnswer(chosen, correct, correctText, exp) {
  if (quizAnswered) return;
  quizAnswered = true;
  clearInterval(quizTimerInt);

  const opts = document.querySelectorAll('.ia-quiz-opt');
  opts.forEach(o => o.disabled = true);
  document.getElementById(`ia-qopt-${correct}`).classList.add('ia-correct');

  const expEl = document.getElementById('ia-qexp');
  const contEl = document.getElementById('ia-qcont');

  if (chosen === correct) {
    document.getElementById(`ia-qopt-${chosen}`).classList.add('ia-correct');
    score += Math.round(200 * DIFF_CFG[difficulty].mult);
    quizCorrect++;
    // +5% damage boost per correct answer
    playerDmgMult = Math.round((playerDmgMult + 0.05) * 100) / 100;
    P.dmgMult = playerDmgMult;
    // +25% max HP heal for correct answer
    const healAmt = Math.round(P.maxHp * 0.25);
    P.hp = Math.min(P.maxHp, P.hp + healAmt);
    updateHUD();
    if (isBossWave || isMiniBossWave) {
      const boss = ENM.find(e => e.isBoss && e.alive);
      if (boss) {
        const bonusDmg = Math.ceil(boss.maxHp * 0.15);
        boss.hp = Math.max(0, boss.hp - bonusDmg);
        addFloat(`⚡ -${bonusDmg}`, boss.x, boss.y - 40, '#E8C96A');
        if (boss.hp <= 0) boss.alive = false;
      }
    }
    const boostPct = Math.round((playerDmgMult - 1) * 100);
    if (expEl) {
      expEl.textContent = (isBossWave ? '⚡ ' : '✓ ') + t('correct') + ` — ❤ +${healAmt} HP · ⚔ +5% DMG (total: +${boostPct}%)` + (exp ? ' — ' + exp : '');
      expEl.className = 'ia-quiz-exp ia-ok ia-show';
    }
  } else {
    document.getElementById(`ia-qopt-${chosen}`).classList.add('ia-wrong');
    missedQ.push({ q: document.querySelector('.ia-quiz-q').textContent, ans: correctText });
    // -25% max HP penalty for wrong answer (subject to 5% dmg reduction)
    const hpLoss = applyDmg(Math.round(P.maxHp * 0.25));
    P.hp = Math.max(0, P.hp - hpLoss);
    updateHUD();
    if (expEl) {
      expEl.textContent = `✗ ${t('wrong')} — ❤ -${hpLoss} HP! ${t('correct_ans')}${correctText}` + (exp ? ' — ' + exp : '');
      expEl.className = 'ia-quiz-exp ia-bad ia-show';
    }
  }

  if (contEl) contEl.classList.add('ia-show');
}

function quizTimeout(correctText, exp, qData) {
  if (quizAnswered) return;
  quizAnswered = true;
  const qObj = qData[lang] || qData.en;
  const correct = qObj.ans;
  const opts = document.querySelectorAll('.ia-quiz-opt');
  opts.forEach(o => o.disabled = true);
  document.getElementById(`ia-qopt-${correct}`).classList.add('ia-correct');
  missedQ.push({ q: document.querySelector('.ia-quiz-q')?.textContent || '', ans: correctText });
  const hpLoss = applyDmg(Math.round(P.maxHp * 0.25));
  P.hp = Math.max(0, P.hp - hpLoss);
  updateHUD();

  const expEl = document.getElementById('ia-qexp');
  const contEl = document.getElementById('ia-qcont');
  if (expEl) {
    expEl.textContent = `⏱ ${t('timeout')} — ❤ -${hpLoss} HP! ${t('correct_ans')}${correctText}` + (exp ? ' — ' + exp : '');
    expEl.className = 'ia-quiz-exp ia-bad ia-show';
  }
  if (contEl) contEl.classList.add('ia-show');
}

function quizContinue() {
  clearInterval(quizTimerInt);
  const quizEl = document.getElementById('ia-quiz');
  if (quizEl) quizEl.classList.remove('ia-open');

  // Player could have died from -25% HP wrong-answer penalty
  if (P.hp <= 0) {
    P.alive = false;
    setTimeout(() => { if (rootEl) showScreen('results'); }, 300);
    return;
  }

  const isLast = waveNum >= totalWaves;
  if (isLast) {
    setTimeout(finishGame, 300);
  } else {
    setTimeout(spawnNextWave, 300);
  }
}

/* ════════════════════════════════════════════════════════════
   GAME FINISH
   ════════════════════════════════════════════════════════════ */
function finishGame() {
  stopGame();
  // Save score
  const data = getStoredData();
  data.gs = (data.gs || 0) + score;
  data.pq = (data.pq || 0) + quizCorrect;
  const bid = currentBook.id;
  if (!data.books[bid]) data.books[bid] = { best: 0, plays: 0, ok: 0, tot: quizTotal };
  data.books[bid].tot = quizTotal;
  data.books[bid].plays++;
  data.books[bid].ok = Math.max(data.books[bid].ok, quizCorrect);
  data.books[bid].best = Math.max(data.books[bid].best, score);
  saveData(data);

  // ── Temple rewards (config-driven per-game params — see realm.js gameRewards) ──
  if (typeof awardGameRewards === 'function') {
    awardGameRewards('iliada-arcade', { score: quizCorrect, perfect: quizCorrect === quizTotal && quizTotal > 0 });
  } else if (typeof awardRewards === 'function') {
    const diffMult = (DIFF_CFG[difficulty] || DIFF_CFG.mortal).mult;
    awardRewards(Math.round((quizCorrect * 20 * diffMult) + Math.floor(score / 100) * 2),
      5 + quizCorrect + (quizCorrect === quizTotal && quizTotal > 0 ? 5 : 0));
  }

  showScreen('results');
}

/* ════════════════════════════════════════════════════════════
   RESULTS SCREEN
   ════════════════════════════════════════════════════════════ */
function renderResults() {
  const total = quizTotal || 1;
  const isGood = quizCorrect >= Math.ceil(total * 0.6);
  const isPerfect = quizCorrect === total;
  const crown = isPerfect ? '🏆' : quizCorrect >= Math.ceil(total * 0.4) ? '⚔️' : '💀';
  const title = isPerfect
    ? (lang === 'gr' ? 'ΤΕΛΕΙΑ ΝΙΚΗ!' : 'PERFECT VICTORY!')
    : isGood ? t('results') : (lang === 'gr' ? 'ΑΞΙΟΤΙΜΗ ΠΡΟΣΠΑΘΕΙΑ' : 'HONORABLE EFFORT');

  const quotes = {
    en: ["\"Sing, goddess, the anger of Achilles.\"", "\"The gods are not to blame — men choose their own doom.\"", "\"Even the bravest know fear.\""],
    gr: ["«Μῆνιν ἄειδε, θεά, Πηληϊάδεω Ἀχιλῆος.»", "«Οι θεοί δεν φταίνε — οι άνθρωποι διαλέγουν την τύχη τους.»", "«Ακόμα και οι γενναιότεροι γνωρίζουν τον φόβο.»"]
  };
  const quote = quotes[lang][Math.floor(Math.random() * 3)];

  const missedHTML = missedQ.length ? `
    <div class="ia-missed-wrap">
      <div class="ia-missed-title">${t('missed')}</div>
      ${missedQ.map(m => `
        <div class="ia-missed-q">
          <div class="ia-missed-q-text">${m.q}</div>
          <div class="ia-missed-q-ans">${t('correct_ans')}${m.ans}</div>
        </div>`).join('')}
    </div>` : '';

  document.getElementById('ia-s-results').innerHTML = `
    <div class="ia-results-crown">${crown}</div>
    <div class="ia-results-title">${title}</div>
    <div class="ia-results-quote">${quote}</div>
    <div class="ia-results-stats">
      <div class="ia-res-stat"><div class="ia-res-stat-label">${t('totalScore')}</div><div class="ia-res-stat-val">${score}</div></div>
      <div class="ia-res-stat"><div class="ia-res-stat-label">${t('correctQ')}</div><div class="ia-res-stat-val">${quizCorrect}/${quizTotal}</div></div>
      <div class="ia-res-stat"><div class="ia-res-stat-label">${t('maxCombo')}</div><div class="ia-res-stat-val">${maxCombo}x</div></div>
      <div class="ia-res-stat"><div class="ia-res-stat-label">${t('kills')}</div><div class="ia-res-stat-val">${totalKills}</div></div>
    </div>
    ${missedHTML}
    <div class="ia-results-btns">
      <button class="ia-btn-primary" onclick="window._ia_startGame(${currentBook.id})">${t('playAgain')}</button>
      <button class="ia-btn-secondary" onclick="window._ia_showScreen('books')">${t('changeBook')}</button>
      <button class="ia-btn-secondary" onclick="window._ia_showScreen('title')">${t('home')}</button>
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   DASHBOARD SCREEN
   ════════════════════════════════════════════════════════════ */
function renderDash() {
  const data = getStoredData();
  document.getElementById('ia-s-dash').innerHTML = `
    <button class="ia-back-btn" onclick="window._ia_showScreen('title')">${t('back')}</button>
    <div class="ia-screen-title">${t('dashTitle')}</div>
    <div class="ia-dash-global">
      <div class="ia-dash-stat"><div class="ia-dash-stat-label">${t('globalScore')}</div><div class="ia-dash-stat-val">${data.gs || 0}</div></div>
      <div class="ia-dash-stat"><div class="ia-dash-stat-label">${t('perfectQ')}</div><div class="ia-dash-stat-val">${data.pq || 0}</div></div>
    </div>
    <div class="ia-dash-books">
      ${BOOKS.map(b => {
        const bd_ = bd(b);
        const bData = data.books[b.id] || {};
        const progPct = bData.ok ? Math.round((bData.ok / (bData.tot || totalWaves)) * 100) : 0;
        return `
          <div class="ia-dash-book-row">
            <div class="ia-dash-book-roman">${b.roman}</div>
            <div class="ia-dash-book-info">
              <div class="ia-dash-book-name">${bd_.title}</div>
              <div class="ia-dash-book-sub">${bd_.name} · ${bd_.hero}</div>
              <div class="ia-dash-book-prog"><div class="ia-dash-book-prog-fill" style="width:${progPct}%"></div></div>
            </div>
            <div class="ia-dash-book-right">
              <div class="ia-dash-book-best">${bData.best ? bData.best : '—'}</div>
              <div class="ia-dash-book-plays">${bData.plays ? bData.plays + ' ' + t('plays') : '—'}</div>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

/* ════════════════════════════════════════════════════════════
   LOCAL STORAGE
   ════════════════════════════════════════════════════════════ */
function getStoredData() {
  try {
    const raw = localStorage.getItem('iliad_arcade');
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return { gs: 0, pq: 0, books: {} };
}
function saveData(d) {
  try { localStorage.setItem('iliad_arcade', JSON.stringify(d)); } catch (_) {}
}

/* ════════════════════════════════════════════════════════════
   WINDOW-EXPOSED CALLBACKS (for inline onclick)
   ════════════════════════════════════════════════════════════ */
window._ia_showScreen  = s => showScreen(s);
window._ia_setLang     = l => { lang = l; showScreen('title'); };
window._ia_setDiff     = d => { difficulty = d; renderDiff(); };
window._ia_setCtrl     = c => { ctrlMode = c; renderDiff(); };
window._ia_startGame   = id => startGame(id);
window._ia_quizAnswer  = (chosen, correct, correctText, exp) => quizAnswer(chosen, correct, correctText, exp);
window._ia_quizContinue = () => quizContinue();

/* ════════════════════════════════════════════════════════════
   ENTRY POINT — called by openIliadaArcade()
   ════════════════════════════════════════════════════════════ */
window.openIliadaArcade = function () {
  const overlay = document.getElementById('iliada-arcade-overlay');
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  // Inject HTML if not already present
  if (!document.getElementById('ia-root')) {
    const frame = overlay.querySelector('.overlay-frame');
    frame.innerHTML = `
      <div id="ia-root">
        <!-- TITLE -->
        <div class="ia-screen" id="ia-s-title"></div>
        <!-- DIFFICULTY -->
        <div class="ia-screen" id="ia-s-diff"></div>
        <!-- BOOKS -->
        <div class="ia-screen" id="ia-s-books"></div>
        <!-- GAME -->
        <div class="ia-screen" id="ia-s-game">
          <div id="ia-hud">
            <div class="ia-hud-left">
              <div class="ia-hp-wrap">
                <span class="ia-hp-label">${TR.gr.hp}</span>
                <div class="ia-hp-bar-bg"><div class="ia-hp-bar ia-full" id="ia-hp-bar" style="width:100%"></div></div>
                <span class="ia-hp-num" id="ia-hp-num">125</span>
              </div>
              <span id="ia-dmg-boost" style="font-size:11px;color:#4AC96A;font-weight:700;letter-spacing:.5px;display:none"></span>
              <div class="ia-ult-wrap">
                <span class="ia-ult-label">⚡ F</span>
                <div class="ia-ult-bar-bg"><div class="ia-ult-fill" id="ia-ult-fill" style="width:0%"></div></div>
                <span class="ia-ult-num" id="ia-ult-num">0%</span>
              </div>
            </div>
            <div class="ia-hud-center">
              <span class="ia-wave-label" id="ia-wave-val">—</span>
              <span class="ia-book-hud" id="ia-book-hud"></span>
            </div>
            <div class="ia-hud-right">
              <span class="ia-combo-hud" id="ia-combo-hud"></span>
              <div class="ia-score-wrap">
                <span class="ia-score-label">ΣΚΟΡ</span>
                <span class="ia-score-val" id="ia-score-val">0</span>
              </div>
            </div>
          </div>
          <div id="ia-game-area">
            <canvas id="ia-gc"></canvas>
            <div id="ia-wave-banner">
              <div class="ia-wb-line1"></div>
              <div class="ia-wb-line2"></div>
            </div>
          </div>
          <div id="ia-quiz">
            <div class="ia-quiz-inner" id="ia-quiz-inner"></div>
          </div>
          <div id="ia-touch"></div>
        </div>
        <!-- RESULTS -->
        <div class="ia-screen" id="ia-s-results"></div>
        <!-- DASHBOARD -->
        <div class="ia-screen" id="ia-s-dash"></div>
      </div>`;
  }

  rootEl = document.getElementById('ia-root');
  gc = document.getElementById('ia-gc');
  ctx = gc.getContext('2d');
  gameArea = document.getElementById('ia-game-area');

  bindInput();
  bindTouch();
  showScreen('title');
  window.addEventListener('resize', resizeGameCanvas);
  // Ask for landscape orientation on phones
  if (typeof orientHint !== 'undefined') orientHint.request();
};

window.closeIliadaArcade = function () {
  stopGame();
  clearInterval(quizTimerInt);
  const overlay = document.getElementById('iliada-arcade-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  window.removeEventListener('resize', resizeGameCanvas);
  if (typeof orientHint !== 'undefined') orientHint.release();
};

})();
