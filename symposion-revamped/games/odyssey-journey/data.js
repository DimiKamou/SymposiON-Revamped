// Odyssey Journey — Location Data & Questions
// 8 locations · 3 questions each · bilingual (GR/EN)

const ODYSSEY_LOCATIONS = [
  {
    id: 'ithaca',
    icon: '🏛️',
    nameGr: 'Ιθάκη',
    nameEn: 'Ithaca',
    rhapsody: 'α–β',
    height: 4.5, baseRadius: 3.5,
    color: 0x4a7a3a,
    pos: [16, 0, 2],
    descGr: 'Η πατρίδα του Οδυσσέα. Ο Τηλέμαχος μεγαλώνει χωρίς τον πατέρα του, οι μνηστήρες αδειάζουν τα αποθέματα του παλατιού, και η Αθηνά παρεμβαίνει.',
    descEn: 'The homeland of Odysseus. Telemachus grows up without his father, suitors deplete the palace stores, and Athena intervenes.',
    questions: [
      {
        gr: 'Ποια θεά παρεμβαίνει πρώτη για να βοηθήσει τον Οδυσσέα στη ραψωδία α΄;',
        en: 'Which goddess first intervenes to help Odysseus in rhapsody α?',
        answersGr: ['Η Αθηνά', 'Η Αφροδίτη', 'Η Ήρα', 'Η Άρτεμις'],
        answersEn: ['Athena', 'Aphrodite', 'Hera', 'Artemis'],
        correctIndex: 0
      },
      {
        gr: 'Με ποια μορφή μεταμφιέζεται η Αθηνά όταν επισκέπτεται τον Τηλέμαχο;',
        en: 'In what disguise does Athena visit Telemachus?',
        answersGr: ['Ως Μέντης, άρχοντας των Ταφίων', 'Ως γερόντισσα χωρικός', 'Ως έμπορος από Κρήτη', 'Ως μαντεία της Δήμητρας'],
        answersEn: ['As Mentes, lord of the Taphians', 'As an old countrywoman', 'As a merchant from Crete', 'As an oracle of Demeter'],
        correctIndex: 0
      },
      {
        gr: 'Ποιοι ζουν στο παλάτι του Οδυσσέα αδειάζοντας τα αποθέματά του;',
        en: 'Who lives in Odysseus\'s palace depleting his stores?',
        answersGr: ['Οι μνηστήρες της Πηνελόπης', 'Οι Φαίακες εμπορευτές', 'Οι ναύτες του Οδυσσέα', 'Οι φύλακες της Αθηνάς'],
        answersEn: ['The suitors of Penelope', 'Phaeacian merchants', 'Odysseus\'s sailors', 'Guardians of Athena'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'ogygia',
    icon: '🌺',
    nameGr: 'Ωγυγία',
    nameEn: 'Ogygia',
    rhapsody: 'ε',
    height: 3.2, baseRadius: 2.8,
    color: 0x2d8040,
    pos: [-16, 0, 0],
    descGr: 'Η νύμφη Καλυψώ κρατά τον Οδυσσέα επί επτά χρόνια στο νησί της. Τελικά ο Δίας στέλνει τον Ερμή για να τον ελευθερώσει.',
    descEn: 'The nymph Calypso holds Odysseus for seven years on her island. Zeus finally sends Hermes to free him.',
    questions: [
      {
        gr: 'Πόσα χρόνια κράτησε η Καλυψώ τον Οδυσσέα στη νήσο της;',
        en: 'How many years did Calypso hold Odysseus on her island?',
        answersGr: ['7 χρόνια', '3 χρόνια', '10 χρόνια', '5 χρόνια'],
        answersEn: ['7 years', '3 years', '10 years', '5 years'],
        correctIndex: 0
      },
      {
        gr: 'Ποιος θεός φέρνει στην Καλυψώ την εντολή να αφήσει τον Οδυσσέα ελεύθερο;',
        en: 'Which god delivers to Calypso the order to free Odysseus?',
        answersGr: ['Ο Ερμής', 'Η Αθηνά', 'Ο Ποσειδώνας', 'Ο Απόλλωνας'],
        answersEn: ['Hermes', 'Athena', 'Poseidon', 'Apollo'],
        correctIndex: 0
      },
      {
        gr: 'Τι προσφέρει η Καλυψώ στον Οδυσσέα για να τον πείσει να μείνει;',
        en: 'What does Calypso offer Odysseus to persuade him to stay?',
        answersGr: ['Αθανασία και αιώνια νεότητα', 'Βασίλειο και πλούτη', 'Μαγική δύναμη', 'Γνώση του μέλλοντος'],
        answersEn: ['Immortality and eternal youth', 'A kingdom and riches', 'Magical powers', 'Knowledge of the future'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'phaeacia',
    icon: '🏟️',
    nameGr: 'Σχερία — Φαιακία',
    nameEn: 'Scheria — Phaeacia',
    rhapsody: 'ζ–θ',
    height: 3.5, baseRadius: 3.2,
    color: 0x3a6e8a,
    pos: [-10, 0, -10],
    descGr: 'Ο Οδυσσέας φθάνει στη Σχερία, βρίσκεται από τη Ναυσικά και φιλοξενείται στο παλάτι του Αλκίνοου. Εκεί αφηγείται τις περιπέτειές του.',
    descEn: 'Odysseus reaches Scheria, is found by Nausicaa and welcomed at Alcinous\'s palace. There he recounts his adventures.',
    questions: [
      {
        gr: 'Ποια πριγκίπισσα βρίσκει τον Οδυσσέα ναυαγισμένο στην παραλία;',
        en: 'Which princess finds the shipwrecked Odysseus on the beach?',
        answersGr: ['Η Ναυσικά', 'Η Αρέτη', 'Η Κίρκη', 'Η Καλυψώ'],
        answersEn: ['Nausicaa', 'Arete', 'Circe', 'Calypso'],
        correctIndex: 0
      },
      {
        gr: 'Ποιος είναι ο βασιλιάς της Φαιακίας που φιλοξενεί τον Οδυσσέα;',
        en: 'Who is the king of Phaeacia who hosts Odysseus?',
        answersGr: ['Ο Αλκίνοος', 'Ο Ναυσίθοος', 'Ο Ρήξηνορας', 'Ο Λαέρτης'],
        answersEn: ['Alcinous', 'Nausithous', 'Rhexenor', 'Laertes'],
        correctIndex: 0
      },
      {
        gr: 'Πώς αποκαλύπτεται η ταυτότητα του Οδυσσέα στη Φαιακία;',
        en: 'How is Odysseus\'s identity revealed in Phaeacia?',
        answersGr: ['Κλαίει ακούγοντας τον αοιδό να τραγουδά για την Τροία', 'Αποκαλύπτεται μόνος του αμέσως', 'Τον αναγνωρίζει η Ναυσικά από σημάδι', 'Τον προδίδει ο αοιδός Δημόδοκος'],
        answersEn: ['He weeps hearing the bard sing of Troy', 'He reveals himself immediately', 'Nausicaa recognizes him by a mark', 'The bard Demodocus betrays him'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'cyclops',
    icon: '👁️',
    nameGr: 'Νήσος Κυκλώπων',
    nameEn: 'Island of the Cyclopes',
    rhapsody: 'ι',
    height: 5.5, baseRadius: 3.0,
    color: 0x7a5530,
    pos: [4, 0, 12],
    descGr: 'Ο Οδυσσέας και οι σύντροφοί του παγιδεύονται στη σπηλιά του Κύκλωπα Πολύφημου. Με πανουργία τον τυφλώνει και δραπετεύει.',
    descEn: 'Odysseus and his companions are trapped in the cave of Cyclops Polyphemus. With cunning he blinds him and escapes.',
    questions: [
      {
        gr: 'Τι ψεύτικο όνομα δίνει ο Οδυσσέας στον Κύκλωπα Πολύφημο;',
        en: 'What false name does Odysseus give the Cyclops Polyphemus?',
        answersGr: ['"Κανείς" (Ούτις)', '"Ξένος"', '"Ήρωας"', '"Ταξιδευτής"'],
        answersEn: ['"Nobody" (Outis)', '"Stranger"', '"Hero"', '"Traveler"'],
        correctIndex: 0
      },
      {
        gr: 'Με τι τυφλώνει ο Οδυσσέας τον Πολύφημο;',
        en: 'With what does Odysseus blind Polyphemus?',
        answersGr: ['Αιχμηρό πάσσαλο από ελιά', 'Ξίφος χαλκού', 'Φλεγόμενο δαυλό', 'Βέλος από τόξο'],
        answersEn: ['A sharpened olive-wood stake', 'A bronze sword', 'A burning brand', 'An arrow from a bow'],
        correctIndex: 0
      },
      {
        gr: 'Γιατί ο Ποσειδώνας τιμωρεί τον Οδυσσέα μετά τον Κύκλωπα;',
        en: 'Why does Poseidon punish Odysseus after the Cyclops episode?',
        answersGr: ['Τύφλωσε τον γιο του, τον Πολύφημο', 'Ταξίδεψε χωρίς θυσία στη θάλασσα', 'Δεν τον σεβάστηκε ως θεό', 'Ναυάγησε στην ακτή του'],
        answersEn: ['He blinded his son Polyphemus', 'He sailed without a sea-sacrifice', 'He showed no respect to the god', 'He shipwrecked on his shore'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'circe',
    icon: '🧙',
    nameGr: 'Αιαία — Νήσος Κίρκης',
    nameEn: 'Aeaea — Island of Circe',
    rhapsody: 'κ',
    height: 3.5, baseRadius: 2.8,
    color: 0x6a3a7a,
    pos: [12, 0, -10],
    descGr: 'Η μάγισσα Κίρκη μεταμορφώνει τους συντρόφους του Οδυσσέα σε χοίρους. Με τη βοήθεια του Ερμή ο Οδυσσέας αντιστέκεται στα μάγια της.',
    descEn: 'The sorceress Circe transforms Odysseus\'s companions into pigs. With Hermes\'s aid, Odysseus resists her spells.',
    questions: [
      {
        gr: 'Σε τι μεταμόρφωσε η Κίρκη τους συντρόφους του Οδυσσέα;',
        en: 'Into what did Circe transform Odysseus\'s companions?',
        answersGr: ['Χοίρους (γουρούνια)', 'Λιοντάρια', 'Ελάφια', 'Λύκοι'],
        answersEn: ['Pigs', 'Lions', 'Deer', 'Wolves'],
        correctIndex: 0
      },
      {
        gr: 'Ποιο μαγικό βότανο δίνει ο Ερμής στον Οδυσσέα για προστασία;',
        en: 'What magical herb does Hermes give Odysseus for protection?',
        answersGr: ['Μώλυ', 'Αμβροσία', 'Νέκταρ', 'Δάφνη'],
        answersEn: ['Moly', 'Ambrosia', 'Nectar', 'Laurel'],
        correctIndex: 0
      },
      {
        gr: 'Πόσο χρόνο παρέμεινε ο Οδυσσέας στο νησί της Κίρκης;',
        en: 'How long did Odysseus remain on Circe\'s island?',
        answersGr: ['Ένα χρόνο', 'Έξι μήνες', 'Δύο χρόνια', 'Τρεις μήνες'],
        answersEn: ['One year', 'Six months', 'Two years', 'Three months'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'underworld',
    icon: '💀',
    nameGr: 'Κάτω Κόσμος — Νέκυια',
    nameEn: 'Underworld — Nekuia',
    rhapsody: 'λ',
    height: 2.8, baseRadius: 2.5,
    color: 0x2a1a4a,
    pos: [0, 0, -18],
    descGr: 'Ο Οδυσσέας κατεβαίνει στον Άδη για να ρωτήσει τον μάντη Τειρεσία. Συναντά ψυχές ηρώων, συντρόφων και τη μητέρα του Αντίκλεια.',
    descEn: 'Odysseus descends to Hades to consult the seer Tiresias. He meets the souls of heroes, companions and his mother Anticleia.',
    questions: [
      {
        gr: 'Ποιον μάντη επισκέπτεται ο Οδυσσέας στον κάτω κόσμο;',
        en: 'Which seer does Odysseus consult in the underworld?',
        answersGr: ['Τον Τειρεσία', 'Τον Κάλχαντα', 'Τον Ελενό', 'Τον Θεοκλύμενο'],
        answersEn: ['Tiresias', 'Calchas', 'Helenus', 'Theoclymenus'],
        correctIndex: 0
      },
      {
        gr: 'Ποια είναι η μητέρα του Οδυσσέα που συναντά στον κάτω κόσμο;',
        en: 'Who is Odysseus\'s mother he meets in the underworld?',
        answersGr: ['Η Αντίκλεια', 'Η Πηνελόπη', 'Η Εκάβη', 'Η Ελένη'],
        answersEn: ['Anticleia', 'Penelope', 'Hecuba', 'Helen'],
        correctIndex: 0
      },
      {
        gr: 'Τι χρειάζεται για να μπορέσουν οι ψυχές να μιλήσουν;',
        en: 'What do the souls need in order to speak?',
        answersGr: ['Να πιουν αίμα από θυσία', 'Να πιουν νερό από τη Λήθη', 'Να αγγίξουν χρυσό νόμισμα', 'Να ακούσουν επική ποίηση'],
        answersEn: ['To drink blood from a sacrifice', 'To drink water from the Lethe', 'To touch a golden coin', 'To hear epic poetry'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'sirens',
    icon: '🎵',
    nameGr: 'Σειρήνες & Σκύλλα',
    nameEn: 'Sirens & Scylla',
    rhapsody: 'μ',
    height: 2.5, baseRadius: 2.6,
    color: 0x1a4a6a,
    pos: [-6, 0, 10],
    descGr: 'Ο Οδυσσέας πλέει ανάμεσα στις θανάσιμες Σειρήνες και τη Σκύλλα. Επινοεί στρατηγική επιβίωσης, χάνοντας έξι συντρόφους.',
    descEn: 'Odysseus sails between the deadly Sirens and Scylla. He devises a survival strategy, losing six companions.',
    questions: [
      {
        gr: 'Πώς αποφεύγει ο Οδυσσέας τη γοητεία των Σειρήνων;',
        en: 'How does Odysseus avoid the Sirens\' enchantment?',
        answersGr: ['Βουλώνει τα αυτιά των ναυτών και δένεται στον ιστό', 'Πλέει γρήγορα κωπηλατώντας', 'Φοράει κράνος που βουλώνει τα αυτιά', 'Κοιμάται σε ολόκληρη τη διαδρομή'],
        answersEn: ['Blocks sailors\' ears and ties himself to the mast', 'Rows quickly past them', 'Wears a helmet that seals his ears', 'Sleeps throughout the passage'],
        correctIndex: 0
      },
      {
        gr: 'Πόσοι σύντροφοι χάνονται από τη Σκύλλα;',
        en: 'How many companions are lost to Scylla?',
        answersGr: ['6', '4', '8', '12'],
        answersEn: ['6', '4', '8', '12'],
        correctIndex: 0
      },
      {
        gr: 'Τι τιμωρία επιφέρει ο Δίας στους συντρόφους που τρώνε τα βόδια του Ήλιου;',
        en: 'What punishment does Zeus send on the companions who eat Helios\'s cattle?',
        answersGr: ['Κεραυνοβολεί το πλοίο τους και πνίγονται', 'Μεταμορφώνονται σε ζώα', 'Τυφλώνονται από τον Ήλιο', 'Ζουν σε αιώνια αρρώστια'],
        answersEn: ['He thunderbolts their ship and they drown', 'They are transformed into animals', 'They are blinded by Helios', 'They suffer eternal illness'],
        correctIndex: 0
      }
    ]
  },
  {
    id: 'ithaca-return',
    icon: '⚔️',
    nameGr: 'Ιθάκη — Η Επιστροφή',
    nameEn: 'Ithaca — The Return',
    rhapsody: 'ν–ω',
    height: 4.0, baseRadius: 3.0,
    color: 0x8a4a1a,
    pos: [16, 0, 8],
    descGr: 'Ο Οδυσσέας επιστρέφει μεταμφιεσμένος ως ζητιάνος. Αποκαλύπτει τον εαυτό του, εξολοθρεύει τους μνηστήρες και επανενώνεται με την Πηνελόπη.',
    descEn: 'Odysseus returns disguised as a beggar. He reveals himself, slaughters the suitors and reunites with Penelope.',
    questions: [
      {
        gr: 'Με ποια μεταμφίεση επιστρέφει ο Οδυσσέας στην Ιθάκη;',
        en: 'In what disguise does Odysseus return to Ithaca?',
        answersGr: ['Ως ζητιάνος', 'Ως ξένος πολεμιστής', 'Ως ιερέας του Απόλλωνα', 'Ως Κρητικός έμπορος'],
        answersEn: ['As a beggar', 'As a foreign warrior', 'As a priest of Apollo', 'As a Cretan merchant'],
        correctIndex: 0
      },
      {
        gr: 'Ποια ήταν η δοκιμασία του τόξου που έθεσε η Πηνελόπη;',
        en: 'What was the trial of the bow that Penelope set?',
        answersGr: ['Να περάσει βέλος μέσα από 12 διπλά τσεκούρια', 'Να σηκώσει βαρύ βράχο', 'Να νικήσει στη ξιφομαχία', 'Να λύσει αίνιγμα'],
        answersEn: ['To shoot an arrow through 12 double axes', 'To lift a heavy boulder', 'To win in swordfight', 'To solve a riddle'],
        correctIndex: 0
      },
      {
        gr: 'Ποιος σκύλος αναγνωρίζει αμέσως τον Οδυσσέα κατά την επιστροφή;',
        en: 'Which dog immediately recognizes Odysseus on his return?',
        answersGr: ['Ο Άργος', 'Ο Κέρβερος', 'Ο Αργύρης', 'Ο Εύμαιος'],
        answersEn: ['Argos', 'Cerberus', 'Argyres', 'Eumaeus'],
        correctIndex: 0
      }
    ]
  }
];
