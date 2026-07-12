/* ============================================================
   Ακρόπολη των Αθηνών, 432 π.Χ. — app config. 1 unit = 1 m.
   +x = east. Parthenon on the south side, Erechtheion north.
   ============================================================ */
window.XP_APP = {
  id: 'acropolis',
  title: 'ΑΚΡΟΠΟΛΙΣ · 432 π.Χ.',
  subtitle: { en: 'The sacred rock in the year the Parthenon was finished', gr: 'Ο ιερός βράχος τη χρονιά που τελείωσε ο Παρθενώνας' },
  intro: [
    { en: 'Climb the rock the year the scaffolding came down. Pericles\' building programme — paid for, his enemies grumbled, with the allies\' tribute — has just crowned Athens: the Propylaia gateway, the little temple of Wingless Victory, the bronze colossus of Athena Promachos, and the Parthenon itself, still holding Phidias\' gold-and-ivory Athena. Everything is new, painted, and blindingly bright.',
      gr: 'Ανεβείτε στον βράχο τη χρονιά που κατέβηκαν οι σκαλωσιές. Το οικοδομικό πρόγραμμα του Περικλή — πληρωμένο, όπως γκρίνιαζαν οι αντίπαλοί του, με τον φόρο των συμμάχων — μόλις στεφάνωσε την Αθήνα: τα Προπύλαια, ο ναΐσκος της Απτέρου Νίκης, ο χάλκινος κολοσσός της Αθηνάς Προμάχου και ο ίδιος ο Παρθενώνας, με τη χρυσελεφάντινη Αθηνά του Φειδία ακόμη μέσα του. Όλα καινούργια, βαμμένα, εκτυφλωτικά.' },
    { en: 'Eight numbered stations for your Γυμνάσιο history course; approach a marker and press E. Enter from the west, as every ancient visitor did.',
      gr: 'Οκτώ αριθμημένοι σταθμοί για το μάθημα Ιστορίας του Γυμνασίου· πλησιάστε έναν σημαδευτή και πατήστε E. Μπείτε από τα δυτικά, όπως κάθε αρχαίος προσκυνητής.' }
  ],
  enter: { en: 'Climb the Rock', gr: 'Άνοδος στον Βράχο' },
  credit: { en: 'Stylised reconstruction (447–432 BC state) after the standard surveys; sculpture simplified. Colours follow the polychromy evidence.', gr: 'Σχηματική αναπαράσταση (κατάσταση 447–432 π.Χ.)· τα γλυπτά απλοποιημένα. Τα χρώματα κατά τα ευρήματα της πολυχρωμίας.' },
  listTitle: { en: 'THE EIGHT STATIONS', gr: 'ΟΙ ΟΚΤΩ ΣΤΑΘΜΟΙ' },
  theme: { gold: '#d8c26a', halo: 'rgba(40,80,140,.45)', btn1: '#e8d488', btn2: '#b09a3e', sub: '#a8c4e0' },
  sky: { top: '#1e5fae', mid: '#74adde', horizon: '#e8ddc2', sun: { u: 0.32, v: 0.2 } },
  fog: { color: 0xc2d2e0, density: 0.0028 },
  sun: { color: 0xfff6dc, intensity: 3.2, pos: [180, 260, 120] },
  hemi: { sky: 0xd6e4f4, ground: 0x8a7c5c, intensity: 0.85 },
  fills: [{ x: 62, y: 8, z: 8, color: 0xffe2a8, intensity: 60, range: 40 }],
  exposure: 1.02,
  spawn: { x: -150, z: 2, yaw: -Math.PI / 2, pitch: 0 },
  eye: 1.7, walkSpeed: 4.2, runSpeed: 9,
  bounds: { x0: -175, x1: 150, z0: -75, z1: 78 },
  interactR: 4.5, markerScale: 1.15, labels: true, climb: 1.2,
  ambience: { freqs: [[196, 0.014], [293.7, 0.01], [392, 0.006]], verb: 1.6, air: 2200 },
  map: {
    x0: -175, x1: 150, z0: -80, z1: 80, w: 240, h: 120,
    draw(x, m) {
      x.fillStyle = '#8c8060';
      x.beginPath();
      const pts = [[-170, 0], [-130, -45], [-60, -60], [60, -58], [120, -40], [140, 0], [120, 42], [40, 58], [-70, 55], [-140, 40]];
      pts.forEach((p, i) => i ? x.lineTo(m.x(p[0]), m.z(p[1])) : x.moveTo(m.x(p[0]), m.z(p[1])));
      x.closePath(); x.fill();
      x.strokeStyle = '#e8d9a8'; x.lineWidth = 1;
      x.strokeRect(m.x(28), m.z(4), m.x(98) - m.x(28), m.z(35) - m.z(4));       // Parthenon
      x.strokeRect(m.x(8), m.z(-38) , m.x(32) - m.x(8), m.z(-22) - m.z(-38));   // Erechtheion
      x.strokeRect(m.x(-140), m.z(-14), m.x(-108) - m.x(-140), m.z(14) - m.z(-14)); // Propylaia
    }
  },
  exhibits: [
    { id: 'panathenaia', n: 1, at: [-96, 0], view: [-104, 0, -Math.PI / 2, 0.08],
      title: { en: 'The Sacred Way & the Panathenaia', gr: 'Η Ιερά Οδός και τα Παναθήναια' },
      sub: { en: 'Every four years, the whole city climbs', gr: 'Κάθε τέσσερα χρόνια ανεβαίνει όλη η πόλη' },
      body: { en: 'You are walking the last stretch of the Panathenaic Way, the route of Athens\'s greatest festival. Every four years the whole city — girls carrying the new robe for the goddess, elders with olive branches, cavalry, sacrificial oxen — wound up from the lower town through the Propylaia to Athena\'s altar. The procession you can see carved on the Parthenon frieze is this very climb. Walk it east, as they did.',
        gr: 'Περπατάτε το τελευταίο κομμάτι της Παναθηναϊκής οδού, τη διαδρομή της μεγαλύτερης γιορτής της Αθήνας. Κάθε τέσσερα χρόνια όλη η πόλη — κόρες με τον καινούργιο πέπλο της θεάς, γέροντες με κλαδιά ελιάς, ιππείς, βόδια για θυσία — ανηφόριζε από την κάτω πόλη, μέσα από τα Προπύλαια, ώς τον βωμό της Αθηνάς. Η πομπή που είναι σκαλισμένη στη ζωφόρο του Παρθενώνα είναι αυτή ακριβώς η ανάβαση. Διαβείτε την προς τα ανατολικά, όπως εκείνοι.' } },
    { id: 'propylaia', n: 2, at: [-118, 8], view: [-144, 4, -Math.PI / 2, 0.1],
      title: { en: 'The Propylaia', gr: 'Τα Προπύλαια' },
      sub: { en: 'Mnesikles\' marble gateway, 437–432 BC', gr: 'Η μαρμάρινη πύλη του Μνησικλή, 437–432 π.Χ.' },
      body: { en: 'A gate grand as a temple: five doorways behind a Doric porch, with an inner ceiling of coffered marble painted blue and starred with gold that ancient travellers rated among the wonders of Greece. Mnesikles fitted it to a crooked, sloping rock without breaking its symmetry — then the Peloponnesian War stopped the work; look for the lifting-bosses never chiselled off. The north wing held a picture gallery for pilgrims to rest in.',
        gr: 'Πύλη μεγαλόπρεπη σαν ναός: πέντε θυραία ανοίγματα πίσω από δωρική πρόσταση, με φατνωματική μαρμάρινη οροφή βαμμένη μπλε με χρυσά αστέρια, που οι αρχαίοι ταξιδιώτες λογάριαζαν στα θαύματα της Ελλάδας. Ο Μνησικλής το προσάρμοσε σε στραβό, κατηφορικό βράχο χωρίς να χαλάσει τη συμμετρία — ώσπου ο Πελοποννησιακός πόλεμος σταμάτησε το έργο· ψάξτε τους αδούλευτους «μαστούς» ανύψωσης στις πέτρες. Η βόρεια πτέρυγα είχε πινακοθήκη για να ξαποσταίνουν οι προσκυνητές.' } },
    { id: 'nike', n: 3, at: [-138, 34], view: [-130, 28, 2.4, 0.1],
      title: { en: 'Athena Nike — Victory Without Wings', gr: 'Αθηνά Νίκη — η Απτερος' },
      sub: { en: 'A jewel-box on the bastion', gr: 'Κομψοτέχνημα πάνω στον προμαχώνα' },
      body: { en: 'On the old Mycenaean bastion, where defenders once rained javelins on attackers\' unshielded sides, stands the smallest gem of the programme: an Ionic temple of Victory, four slender columns at each end. The Athenians made their Victory wingless — so she could never fly away from the city. From this parapet legend says old king Aegeus watched for Theseus\'s sails, saw black, and leapt: the sea below is still the Aegean.',
        gr: 'Πάνω στον παλιό μυκηναϊκό προμαχώνα, απ\' όπου κάποτε χτυπούσαν το απροστάτευτο πλευρό των επιτιθέμενων, στέκει το μικρότερο στολίδι του προγράμματος: ιωνικός ναΐσκος της Νίκης, με τέσσερις λεπτούς κίονες σε κάθε όψη. Οι Αθηναίοι έφτιαξαν τη Νίκη τους άπτερη — για να μην μπορέσει ποτέ να πετάξει μακριά από την πόλη. Από αυτό το στηθαίο, λέει ο θρύλος, ο γέρος Αιγέας αγνάντευε τα πανιά του Θησέα, είδε μαύρα, και ρίχτηκε: η θάλασσα από κάτω λέγεται ακόμη Αιγαίο.' } },
    { id: 'promachos', n: 4, at: [-72, -14], view: [-82, -8, -Math.PI / 2 + 0.5, 0.35],
      title: { en: 'Athena Promachos', gr: 'Αθηνά Πρόμαχος' },
      sub: { en: 'Nine metres of Marathon bronze', gr: 'Εννιά μέτρα χαλκού από τον Μαραθώνα' },
      body: { en: 'Phidias\'s first great Athena: a bronze colossus cast, they said, from the spoils of Marathon, spear upright, helmet crested. Sailors rounding Cape Sounion — forty kilometres away — caught the sun flashing on the spear-tip and helmet and knew they were home. She stood guard here for a thousand years before being carried off to Constantinople, where a superstitious crowd destroyed her in 1203, blaming her hand for "beckoning the crusaders".',
        gr: 'Η πρώτη μεγάλη Αθηνά του Φειδία: χάλκινος κολοσσός, χυμένος —έλεγαν— από τα λάφυρα του Μαραθώνα, με όρθιο δόρυ και λοφίο. Οι ναυτικοί που έκαμπταν το Σούνιο — σαράντα χιλιόμετρα μακριά — έπιαναν τη λάμψη του ήλιου στην αιχμή και στο κράνος και ήξεραν πως έφτασαν σπίτι. Φύλαγε εδώ χίλια χρόνια, ώσπου μεταφέρθηκε στην Κωνσταντινούπολη· εκεί, το 1203, δεισιδαίμον πλήθος την κατέστρεψε, λέγοντας πως το χέρι της «καλούσε τους σταυροφόρους».' } },
    { id: 'parthenon', n: 5, at: [24, 20], view: [-2, 34, -Math.PI / 2 + 0.6, 0.14],
      title: { en: 'The Parthenon', gr: 'Ο Παρθενώνας' },
      sub: { en: 'Iktinos & Kallikrates, 447–432 BC', gr: 'Ικτίνος και Καλλικράτης, 447–432 π.Χ.' },
      body: { en: 'Fifteen years, 20,000 tons of Pentelic marble, and not one straight line: the platform swells upward, the 46 columns lean inward and bulge gently (entasis), the corners thicken — dozens of "optical refinements" so the eye reads perfect straightness. It is Doric outside but slips Ionic grace inside, including a 160-metre frieze of the Panathenaic procession where citizens — mortals! — ride on a temple for the first time. Democracy, carved.',
        gr: 'Δεκαπέντε χρόνια, 20.000 τόνοι πεντελικό μάρμαρο, και ούτε μία ευθεία γραμμή: ο στυλοβάτης καμπυλώνει προς τα πάνω, οι 46 κίονες γέρνουν προς τα μέσα και φουσκώνουν απαλά (ένταση), οι γωνιακοί παχαίνουν — δεκάδες «οπτικές εκλεπτύνσεις» ώστε το μάτι να διαβάζει τέλεια ευθύτητα. Δωρικός απ\' έξω, με ιωνική χάρη μέσα: και μια ζωφόρος 160 μέτρων με την παναθηναϊκή πομπή, όπου για πρώτη φορά πολίτες — θνητοί! — ανεβαίνουν πάνω σε ναό. Η δημοκρατία, σκαλισμένη.' } },
    { id: 'athena', n: 6, at: [55, 20], view: [46, 20, -Math.PI / 2, 0.18],
      title: { en: 'Athena Parthenos', gr: 'Η Αθηνά Παρθένος' },
      sub: { en: 'Phidias, gold and ivory, 12 metres', gr: 'Φειδίας, χρυσός και ελεφαντόδοντο, 12 μέτρα' },
      body: { en: 'Inside the dim cella, behind a shallow pool of water that kept the air moist and doubled the light, towered the goddess: face, arms and feet of ivory, robe of gold plates — over a ton of it, removable, since it was also the state reserve. On her outstretched hand a two-metre Victory; serpent by the shield; sphinx on the helmet. The temple was, in truth, built as this statue\'s jewel case — and its treasury.',
        gr: 'Μέσα στον μισοσκότεινο σηκό, πίσω από μια ρηχή δεξαμενή νερού που κρατούσε την υγρασία και διπλασίαζε το φως, υψωνόταν η θεά: πρόσωπο, χέρια και πόδια από ελεφαντόδοντο, ένδυμα από χρυσές πλάκες — πάνω από έναν τόνο, αποσπώμενες, γιατί ήταν και το αποθεματικό της πόλης. Στο τεντωμένο χέρι της μια Νίκη δύο μέτρων· φίδι πλάι στην ασπίδα· σφίγγα στο κράνος. Ο ναός, στην ουσία, χτίστηκε ως κοσμηματοθήκη — και θησαυροφυλάκιο — αυτού του αγάλματος.' } },
    { id: 'erechtheion', n: 7, at: [20, -18], view: [22, -14, 0, 0.1],
      title: { en: 'Erechtheion & the Caryatids', gr: 'Το Ερέχθειο και οι Καρυάτιδες' },
      sub: { en: 'The oldest myths under one crooked roof', gr: 'Οι πιο παλιοί μύθοι κάτω από μια «στραβή» στέγη' },
      body: { en: 'This is the rock\'s holiest ground, so the temple had to bend around it: the trident-mark of Poseidon, the tomb of the serpent-king Erechtheus, and Athena\'s olive — the gift that won her the city — regrown here after the Persians burned it. Hence a building on two levels with three porches, one carried by six marble maidens, the Caryatids, calm under the weight. The oldest wooden statue of Athena lived here, dressed in the Panathenaic robe.',
        gr: 'Εδώ είναι το πιο ιερό σημείο του βράχου, γι\' αυτό ο ναός λύγισε γύρω του: το σημάδι της τρίαινας του Ποσειδώνα, ο τάφος του φιδόμορφου βασιλιά Ερεχθέα, και η ελιά της Αθηνάς — το δώρο που της χάρισε την πόλη — ξαναβλαστημένη αφού την έκαψαν οι Πέρσες. Έτσι προέκυψε κτίριο σε δύο επίπεδα με τρεις προστάσεις, η μία στηριγμένη σε έξι μαρμάρινες κόρες, τις Καρυάτιδες, γαλήνιες κάτω από το βάρος. Εδώ ζούσε το πανάρχαιο ξόανο της Αθηνάς, ντυμένο με τον πέπλο των Παναθηναίων.' } },
    { id: 'colour', n: 8, at: [98, 20], view: [108, 20, Math.PI / 2, 0.2],
      title: { en: 'It Was All Painted', gr: 'Ήταν Όλα Βαμμένα' },
      sub: { en: 'Polychromy — and what came after 432', gr: 'Πολυχρωμία — και τα μετέπειτα' },
      body: { en: 'Forget white marble: triglyphs blue, backgrounds of pediments red, mouldings gold and green — traces of all of it survive under the microscope. The gleaming "classical white" is a modern myth born when the paint had weathered away. As for the building: it later served as church of the Virgin, then mosque, until 1687, when a Venetian shell hit the Ottoman powder store inside and blew the roof and half the columns into the air. What you walk through here is the year 432 BC — whole, loud with colour, and new.',
        gr: 'Ξεχάστε το λευκό μάρμαρο: τρίγλυφα μπλε, βάθη αετωμάτων κόκκινα, κοσμήματα χρυσά και πράσινα — ίχνη όλων σώζονται στο μικροσκόπιο. Το «κλασικό λευκό» είναι νεότερος μύθος, γεννημένος όταν τα χρώματα είχαν πια ξεθωριάσει. Όσο για το κτίριο: έγινε αργότερα ναός της Παναγίας, μετά τζαμί, ώσπου το 1687 βενετσιάνικη οβίδα χτύπησε την οθωμανική πυριτιδαποθήκη στο εσωτερικό του και τίναξε στέγη και μισούς κίονες στον αέρα. Εδώ περπατάτε στο 432 π.Χ. — ακέραιο, γεμάτο χρώμα, καινούργιο.' } }
  ]
};
