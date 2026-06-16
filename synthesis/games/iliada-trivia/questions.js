// ============================================================
//  Ιλιάδα Trivia — Questions
//  Edit this file to add/fix/remove questions.
//
//  Structure:
//    QUESTIONS.gr  — Greek questions
//    QUESTIONS.en  — English questions
//
//  Each rhapsody key (e.g. 'Ω', 'Α') holds an array of questions.
//  'all' is the general pool used when no specific rhapsody is selected.
//
//  Each question:
//    q:    the question text
//    opts: array of 4 answer strings
//    ans:  index (0-3) of the correct answer
// ============================================================

const RHAPSODIES = ['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ','Ι','Κ','Λ','Μ','Ν','Ξ','Ο','Π','Ρ','Σ','Τ','Υ','Φ','Χ','Ψ','Ω'];

const QUESTIONS = {

  // ── ΕΛΛΗΝΙΚΑ ──────────────────────────────────────────────
  gr: {

    // Ραψωδία Ω — Πρίαμος & Αχιλλέας
    'Ω': [
      { q: 'Τι ζητά ο Πρίαμος να θυμηθεί ο Αχιλλέας;', opts: ['Δόξα Τροίας','Τον πατέρα του Πηλέα','Βούληση θεών','Τον Πάτροκλο'], ans: 1 },
      { q: 'Ποια πράξη κάνει ο Πρίαμος μπροστά στον Αχιλλέα;', opts: ['Φιλά τα χέρια του φονιά','Προσφέρει στέμμα','Γονατίζει σιωπηλά','Απειλεί'], ans: 0 },
      { q: 'Τι κάνει ο Αχιλλέας μετά την παράκληση του Πριάμου;', opts: ['Τον διώχνει','Κλαίει για πατέρα και Πάτροκλο','Καλεί τους άνδρες','Συμβουλεύεται θεούς'], ans: 1 },
      { q: 'Ποιος οδήγησε τον Πρίαμο στο στρατόπεδο των Αχαιών;', opts: ['Θέτις','Ήρα','Ερμής που έστειλε ο Δίας','Γιος του Πριάμου'], ans: 2 },
      { q: 'Σε ποιον απολογείται ο Αχιλλέας για την απόδοση του σώματος;', opts: ['Στον Πάτροκλο','Στη Θέτιδα','Στον Δία','Στον Αγαμέμνονα'], ans: 0 },
    ],

    // Γενική Ιλιάδα — όλες οι ραψωδίες
    'all': [
      { q: 'Ποιος είναι ο ανώτατος βασιλιάς των θεών;', opts: ['Ποσειδών','Άρης','Δίας','Ερμής'], ans: 2 },
      { q: 'Ποια είναι η αρχική αιτία του Τρωικού Πολέμου;', opts: ['Διαμάχη για εδάφη','Αρπαγή της Ελένης','Εμπορική αντιπαλότητα','Δολοφονία ηγέτη'], ans: 1 },
      { q: 'Ποιος είναι ο πιο αγαπημένος σύντροφος του Αχιλλέα που σκοτώνεται;', opts: ['Αίας','Διομήδης','Πάτροκλος','Οδυσσέας'], ans: 2 },
      { q: 'Ποιος σκοτώνει τον Έκτορα;', opts: ['Αγαμέμνων','Αίας','Μενέλαος','Αχιλλέας'], ans: 3 },
      { q: 'Ποια είναι η μητέρα του Αχιλλέα;', opts: ['Ήρα','Θέτις','Αθηνά','Αφροδίτη'], ans: 1 },
      { q: 'Ποιος είναι ο βασιλιάς της Τροίας;', opts: ['Πάρις','Έκτορας','Πρίαμος','Αινείας'], ans: 2 },
      { q: 'Ποια είναι η γυναίκα του Έκτορα;', opts: ['Ελένη','Κασσάνδρα','Ανδρομάχη','Βρισηίδα'], ans: 2 },
      { q: 'Γιατί ο Αχιλλέας αρνείται να πολεμήσει;', opts: ['Είναι τραυματισμένος','Ο Αγαμέμνων πήρε τη Βρισηίδα','Φοβάται τον θάνατο','Οι θεοί τον εμποδίζουν'], ans: 1 },
      { q: 'Ποιος θεός προστατεύει τους Τρώες;', opts: ['Δίας','Ερμής','Απόλλων','Ήφαιστος'], ans: 2 },
      { q: 'Ποιος κατασκευάζει την πανοπλία του Αχιλλέα;', opts: ['Άρης','Δίας','Ερμής','Ήφαιστος'], ans: 3 },
      { q: 'Σε πόσα βιβλία (ραψωδίες) χωρίζεται η Ιλιάδα;', opts: ['12','24','36','48'], ans: 1 },
      { q: 'Τι κάνει ο Αχιλλέας με το σώμα του Έκτορα αρχικά;', opts: ['Το θάβει με τιμές','Το προσφέρει στους θεούς','Το δίνει στον Πρίαμο','Το σέρνει γύρω από τα τείχη'], ans: 3 },
      { q: 'Πόσα χρόνια διάρκεσε ο Τρωικός Πόλεμος;', opts: ['5','7','10','20'], ans: 2 },
      { q: 'Σε ποια πόλη διαδραματίζεται η Ιλιάδα;', opts: ['Μυκήνες','Σπάρτη','Τροία','Ιθάκη'], ans: 2 },
      { q: 'Ποιος Αχαιός ηγέτης κρατά τη Βρισηίδα;', opts: ['Αχιλλέας','Αγαμέμνων','Μενέλαος','Οδυσσέας'], ans: 1 },
      { q: 'Ποιος θεός βοηθά τους Αχαιούς;', opts: ['Άρης','Απόλλων','Αθηνά','Ποσειδών'], ans: 2 },
      { q: 'Πώς αρχίζει η Ιλιάδα;', opts: ['Με την κρίση του Πάρη','Με τη μήνιν του Αχιλλέα','Με την αρπαγή της Ελένης','Με συνέλευση θεών'], ans: 1 },
      { q: 'Ποιος Τρώας σκοτώνει τον Πάτροκλο;', opts: ['Αινείας','Έκτορας','Πάρης','Πρίαμος'], ans: 1 },
    ],

  },

  // ── ENGLISH ───────────────────────────────────────────────
  en: {

    // Rhapsody Ω — Priam & Achilles
    'Ω': [
      { q: "What does Priam ask Achilles to remember?", opts: ["Troy's glory","His own father Peleus","The gods' will","Patroclus"], ans: 1 },
      { q: "What extraordinary act does Priam perform before Achilles?", opts: ["Kisses the hands of his son's killer","Offers his crown","Kneels silently","Threatens Achilles"], ans: 0 },
      { q: "What does Achilles do after Priam's plea?", opts: ["Refuses angrily","Weeps for his father and Patroclus","Calls his men","Consults the gods"], ans: 1 },
      { q: "Who guided Priam safely to the Greek camp?", opts: ["Thetis","Hera","Hermes, sent by Zeus","A son of Priam"], ans: 2 },
      { q: "To whose spirit does Achilles quietly apologize?", opts: ["Patroclus","Thetis","Zeus","Agamemnon"], ans: 0 },
    ],

    // General Iliad pool
    'all': [
      { q: "Who is the supreme king of the gods?", opts: ["Poseidon","Ares","Zeus","Hermes"], ans: 2 },
      { q: "What is the root cause of the Trojan War?", opts: ["A land dispute","The abduction of Helen","A trade rivalry","A murder"], ans: 1 },
      { q: "Who is Achilles' closest companion who dies in battle?", opts: ["Ajax","Diomedes","Patroclus","Odysseus"], ans: 2 },
      { q: "Who kills Hector?", opts: ["Agamemnon","Ajax","Menelaus","Achilles"], ans: 3 },
      { q: "Who is Achilles' mother?", opts: ["Hera","Thetis","Athena","Aphrodite"], ans: 1 },
      { q: "Who is the king of Troy?", opts: ["Paris","Hector","Priam","Aeneas"], ans: 2 },
      { q: "Who is Hector's wife?", opts: ["Helen","Cassandra","Andromache","Briseis"], ans: 2 },
      { q: "Why does Achilles refuse to fight?", opts: ["He is wounded","Agamemnon took Briseis","He fears death","The gods command it"], ans: 1 },
      { q: "Which god is the chief protector of the Trojans?", opts: ["Zeus","Hermes","Apollo","Hephaestus"], ans: 2 },
      { q: "Who forges the new armor for Achilles?", opts: ["Ares","Zeus","Hermes","Hephaestus"], ans: 3 },
      { q: "How many books (rhapsodies) does the Iliad have?", opts: ["12","24","36","48"], ans: 1 },
      { q: "What does Achilles initially do with Hector's body?", opts: ["Buries it with honors","Offers it to the gods","Returns it to Priam","Drags it around the walls of Troy"], ans: 3 },
      { q: "How many years did the Trojan War last?", opts: ["5","7","10","20"], ans: 2 },
      { q: "In which city does the Iliad take place?", opts: ["Mycenae","Sparta","Troy","Ithaca"], ans: 2 },
      { q: "Which Greek leader holds Briseis captive?", opts: ["Achilles","Agamemnon","Menelaus","Odysseus"], ans: 1 },
      { q: "Which goddess consistently aids the Greeks?", opts: ["Ares","Apollo","Athena","Poseidon"], ans: 2 },
      { q: "How does the Iliad open?", opts: ["With the Judgment of Paris","With the wrath of Achilles","With the abduction of Helen","With an assembly of gods"], ans: 1 },
      { q: "Who delivers the fatal blow to Patroclus?", opts: ["Aeneas","Hector","Paris","Priam"], ans: 1 },
    ],

  },
};

// Quotes shown on win/game-over screen
const QUOTES_EN = [
  '"Glory comes to those who seize it." — Homer',
  '"Even the bravest must face their fate." — Homer',
  '"A man who has good thoughts cannot ever be ugly." — Homer',
];
const QUOTES_GR = [
  '"Η δόξα έρχεται σε αυτούς που την αρπάζουν." — Όμηρος',
  '"Ακόμα και ο πιο γενναίος πρέπει να αντιμετωπίσει τη μοίρα του." — Όμηρος',
  '"Πολέμα για την τιμή, ζήσε για τη δόξα." — Όμηρος',
];

// Stable aliases so Odyssey Trivia can swap questions without losing the Iliad set
const ILIADA_QUESTIONS  = QUESTIONS;
const ILIADA_RHAPSODIES = RHAPSODIES;
