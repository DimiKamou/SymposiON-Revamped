/* ============================================================
   Μινωικά Ανάκτορα — Κνωσός (~1600 π.Χ.) — app config.
   1 unit = 1 m. Central court along +x; west wing at z<0.
   ============================================================ */
window.XP_APP = {
  id: 'knossos',
  title: 'ΚΝΩΣΟΣ · ΜΙΝΩΙΚΟ ΑΝΑΚΤΟΡΟ',
  subtitle: { en: 'The palace-labyrinth of Minos, c. 1600 BC', gr: 'Το ανάκτορο-λαβύρινθος του Μίνωα, περ. 1600 π.Χ.' },
  intro: [
    { en: 'A thousand years before the Parthenon, Europe\'s first civilisation raised palaces without walls. Knossos — a maze of 1,300 rooms on five levels, storerooms of giant jars, light-wells, frescoes of bulls and dolphins — was remembered by the later Greeks as the Labyrinth. Walk its central court, sit before the oldest throne in Europe, and meet the Minoans through eight stations.',
      gr: 'Χίλια χρόνια πριν από τον Παρθενώνα, ο πρώτος πολιτισμός της Ευρώπης ύψωσε ανάκτορα χωρίς τείχη. Η Κνωσός — λαβύρινθος 1.300 δωματίων σε πέντε επίπεδα, αποθήκες με πελώρια πιθάρια, φωταγωγοί, τοιχογραφίες με ταύρους και δελφίνια — έμεινε στη μνήμη των Ελλήνων ως ο Λαβύρινθος. Περπατήστε στην κεντρική αυλή, σταθείτε μπροστά στον αρχαιότερο θρόνο της Ευρώπης και γνωρίστε τους Μινωίτες σε οκτώ σταθμούς.' },
    { en: 'Eight numbered markers; approach and press E. For your Γυμνάσιο history course.',
      gr: 'Οκτώ αριθμημένοι σταθμοί· πλησιάστε και πατήστε E. Για το μάθημα Ιστορίας του Γυμνασίου.' }
  ],
  enter: { en: 'Enter the Labyrinth', gr: 'Είσοδος στον Λαβύρινθο' },
  credit: { en: 'Stylised reconstruction after Evans\'s excavations — whose concrete "reconstitutions" are themselves part of the story (station 7).', gr: 'Σχηματική αναπαράσταση κατά τις ανασκαφές του Έβανς — του οποίου οι τσιμεντένιες «αναστηλώσεις» είναι κι αυτές μέρος της ιστορίας (σταθμός 7).' },
  listTitle: { en: 'THE EIGHT STATIONS', gr: 'ΟΙ ΟΚΤΩ ΣΤΑΘΜΟΙ' },
  theme: { gold: '#e0a34c', halo: 'rgba(140,60,30,.5)', btn1: '#e8b874', btn2: '#b7742e', sub: '#e0b898' },
  sky: { top: '#2e6bb4', mid: '#7fb2e0', horizon: '#e9dcc0', sun: { u: 0.68, v: 0.22 } },
  fog: { color: 0xc9d4d8, density: 0.004 },
  sun: { color: 0xfff3d6, intensity: 3.0, pos: [-120, 200, 140] },
  hemi: { sky: 0xcfe2f0, ground: 0x8a6b4a, intensity: 0.8 },
  fills: [{ x: -8, y: 3, z: -17, color: 0xffd9a0, intensity: 26, range: 22 },
          { x: 4, y: 4, z: -25, color: 0xffe2b0, intensity: 20, range: 20 },
          { x: 16, y: 4, z: 22, color: 0xffe2b0, intensity: 22, range: 24 }],
  exposure: 1.02,
  spawn: { x: -34, z: 0, yaw: -Math.PI / 2, pitch: 0 },
  eye: 1.65, walkSpeed: 3.4, runSpeed: 7,
  bounds: { x0: -60, x1: 60, z0: -50, z1: 52 },
  interactR: 3.8, markerScale: 1,
  ambience: { freqs: [[220, 0.012], [329.6, 0.01], [440, 0.006]], verb: 1.2, air: 2600 },
  map: {
    x0: -60, x1: 60, z0: -52, z1: 54, w: 230, h: 200,
    draw(x, m) {
      x.fillStyle = '#7c5c3a';
      x.fillRect(m.x(-45), m.z(-38), m.x(45) - m.x(-45), m.z(40) - m.z(-38));
      x.fillStyle = '#c9a97c';                          // central court
      x.fillRect(m.x(-25), m.z(-12.5), m.x(25) - m.x(-25), m.z(12.5) - m.z(-12.5));
      x.strokeStyle = '#e8d9a8'; x.lineWidth = 1;
      x.strokeRect(m.x(-45), m.z(-38), m.x(45) - m.x(-45), m.z(40) - m.z(-38));
    }
  },
  exhibits: [
    { id: 'labyrinth', n: 1, at: [0, 0], view: [-6, 4, -1.9, 0.06],
      title: { en: 'Palace or Labyrinth?', gr: 'Ανάκτορο ή Λαβύρινθος;' },
      sub: { en: 'Minos, the Minotaur and the myth', gr: 'Ο Μίνωας, ο Μινώταυρος και ο μύθος' },
      body: { en: 'You stand in the central court — the heart every Minoan palace beats around. Around you: 1,300 rooms on up to five floors, connected by stairs, corridors and light-wells. To later Greeks, who found its ruins bewildering, this became the Labyrinth where Theseus fought the Minotaur; the very word may come from labrys, the double axe carved all over these walls. Myth, as often, remembered something true: a palace like a maze, and a power that once ruled the sea.',
        gr: 'Βρίσκεστε στην κεντρική αυλή — την καρδιά κάθε μινωικού ανακτόρου. Γύρω σας: 1.300 δωμάτια σε έως πέντε ορόφους, δεμένα με σκάλες, διαδρόμους και φωταγωγούς. Για τους μεταγενέστερους Έλληνες, που έβρισκαν τα ερείπιά του αξεδιάλυτα, έγινε ο Λαβύρινθος του Θησέα και του Μινώταυρου· ίσως κι η ίδια η λέξη να βγαίνει από τον λάβρυ, τον διπλό πέλεκυ που είναι χαραγμένος παντού εδώ. Ο μύθος, όπως συχνά, θυμήθηκε κάτι αληθινό: ένα παλάτι-λαβύρινθο και μια δύναμη που κάποτε όριζε τη θάλασσα.' } },
    { id: 'throne', n: 2, at: [-9, -15.5], view: [-8, -16.5, 0.12, 0.05],
      title: { en: 'The Throne Room', gr: 'Η Αίθουσα του Θρόνου' },
      sub: { en: 'The oldest throne in Europe, guarded by griffins', gr: 'Ο αρχαιότερος θρόνος της Ευρώπης, με φύλακες γρύπες' },
      body: { en: 'A gypsum chair with a high wavy back stands against the wall, benches around it, wingless griffins painted on red ground at its sides, and a sunken "lustral basin" opposite. Was this the seat of a king — or of a priestess enacting the goddess? The room held perhaps thirty people, in half-darkness: whatever happened here was ritual before it was politics. The throne is where Evans found it, 3,500 years old.',
        gr: 'Ένα γύψινο κάθισμα με ψηλή κυματιστή ράχη ακουμπά στον τοίχο· γύρω πάγκοι, στα πλάγια ζωγραφιστοί γρύπες χωρίς φτερά σε κόκκινο βάθος, απέναντι μια βυθισμένη «δεξαμενή καθαρμών». Ήταν έδρα βασιλιά — ή ιέρειας που ενσάρκωνε τη θεά; Η αίθουσα χωρούσε ίσως τριάντα ανθρώπους, στο μισοσκόταδο: ό,τι γινόταν εδώ ήταν τελετουργία πριν γίνει πολιτική. Ο θρόνος στέκει όπου τον βρήκε ο Έβανς, 3.500 χρόνια τώρα.' } },
    { id: 'magazines', n: 3, at: [-8, -26], view: [-8, -23, 0, 0.05],
      title: { en: 'Storerooms: the Palace as Bank', gr: 'Αποθήκες: το Ανάκτορο ως Τράπεζα' },
      sub: { en: 'Pithoi, oil, grain — and Linear B receipts', gr: 'Πιθάρια, λάδι, σιτάρι — και αποδείξεις σε Γραμμική Β' },
      body: { en: 'Eighteen long magazines line the west wing, packed with man-high pithoi — some 400 jars holding perhaps 250,000 litres of oil, wine and grain. This is what a Minoan palace was: a collection point that gathered the harvests of the countryside and redistributed them to craftsmen, sailors and feasts. Every jar was counted: clay tablets in Linear A and later Linear B — the first written Greek — are the receipts of this warehouse-state.',
        gr: 'Δεκαοκτώ μακριές αποθήκες γεμίζουν τη δυτική πτέρυγα, στοιβαγμένες με πιθάρια στο μπόι ανθρώπου — περίπου 400 αγγεία με ίσως 250.000 λίτρα λάδι, κρασί και σιτάρι. Αυτό ήταν το μινωικό ανάκτορο: κέντρο συγκέντρωσης που μάζευε τη σοδειά της υπαίθρου και την αναδιένειμε σε τεχνίτες, ναυτικούς και γιορτές. Κάθε πιθάρι μετρημένο: οι πήλινες πινακίδες σε Γραμμική Α και αργότερα Γραμμική Β — τα πρώτα γραπτά ελληνικά — είναι οι αποδείξεις αυτού του κράτους-αποθήκης.' } },
    { id: 'bull', n: 4, at: [14, -14.5], view: [14, -10.5, 0, 0.1],
      title: { en: 'The Bull-Leapers', gr: 'Τα Ταυροκαθάψια' },
      sub: { en: 'Sport, rite, or impossible art?', gr: 'Άθλημα, τελετή ή ακατόρθωτη τέχνη;' },
      body: { en: 'The most famous image of Crete: a charging bull, one athlete gripping its horns, another somersaulting along its back, a third landing behind — girls painted white, boys red, as Egyptian convention required. Rodeo riders say the vault as painted is impossible; perhaps the fresco compresses a whole sequence into one frame, like a comic strip. Whatever it shows, the bull was sacred here — and the games were deadly serious.',
        gr: 'Η διασημότερη εικόνα της Κρήτης: ταύρος που ορμά, ένας αθλητής πιασμένος από τα κέρατα, άλλος να κάνει τούμπα στη ράχη του, τρίτος να προσγειώνεται πίσω — τα κορίτσια ζωγραφισμένα λευκά, τα αγόρια κόκκινα, κατά την αιγυπτιακή σύμβαση. Οι σημερινοί καβαλάρηδες ροντέο λένε πως το άλμα, όπως ζωγραφίζεται, είναι αδύνατο· ίσως η τοιχογραφία συμπιέζει μια ολόκληρη ακολουθία σε ένα καρέ. Ό,τι κι αν δείχνει, ο ταύρος εδώ ήταν ιερός — και τα παιχνίδια θανάσιμα σοβαρά.' } },
    { id: 'columns', n: 5, at: [-14, 8], view: [-11, 10, 1.05, 0.12],
      title: { en: 'Upside-Down Columns & Light-Wells', gr: 'Ανάποδοι Κίονες και Φωταγωγοί' },
      sub: { en: 'Architecture for a bright, hot island', gr: 'Αρχιτεκτονική για ένα φωτεινό, ζεστό νησί' },
      body: { en: 'Minoan columns are cypress trunks set upside-down — wider at the top — so rainwater runs off and new shoots don\'t sprout; painted red with black cushion capitals. There are no outer defensive walls at all: the fleet was the wall. Instead of windows, shafts called light-wells drop daylight and cool air deep into the building — five floors ventilated like a modern atrium, 3,500 years early. Even the drains, stone channels with parabolic bends, still work after rain.',
        gr: 'Οι μινωικοί κίονες είναι κορμοί κυπαρισσιού τοποθετημένοι ανάποδα — φαρδύτεροι επάνω — για να κυλά το νερό και να μην ξαναβλασταίνουν· βαμμένοι κόκκινοι, με μαύρα «μαξιλαρωτά» κιονόκρανα. Εξωτερικά τείχη δεν υπάρχουν καθόλου: τείχος ήταν ο στόλος. Αντί για παράθυρα, φωταγωγοί ρίχνουν φως και δροσιά βαθιά στο κτίριο — πέντε όροφοι αεριζόμενοι σαν σύγχρονο αίθριο, 3.500 χρόνια νωρίτερα. Ακόμη και οι πέτρινοι αγωγοί αποχέτευσης δουλεύουν μετά τη βροχή.' } },
    { id: 'staircase', n: 6, at: [16, 16], view: [14, 13, -0.5, 0.1],
      title: { en: 'The Grand Staircase', gr: 'Η Μεγάλη Κλίμακα' },
      sub: { en: 'Five storeys around a well of light', gr: 'Πέντε όροφοι γύρω από ένα πηγάδι φωτός' },
      body: { en: 'On the slope toward the river, the palace stacked five floors, tied together by a monumental stair winding around an open light-well ringed with red columns. Evans\'s engineers found the upper flights hanging in the earth almost in place and propped them with concrete — which is why you can still climb where princes walked. The residential quarters below had folding doors to tune light and breeze, bathrooms, and clay pipes: comfort not seen again in Europe for millennia.',
        gr: 'Στην πλαγιά προς το ποτάμι το ανάκτορο στοίβαξε πέντε ορόφους, δεμένους με μια μνημειακή σκάλα που στριφογυρίζει γύρω από ανοιχτό φωταγωγό ζωσμένο με κόκκινους κίονες. Οι μηχανικοί του Έβανς βρήκαν τα πάνω σκαλοπάτια να κρέμονται στο χώμα σχεδόν στη θέση τους και τα στήριξαν με μπετόν — γι\' αυτό ανεβαίνετε ακόμη εκεί όπου περπατούσαν πρίγκιπες. Τα διαμερίσματα από κάτω είχαν πτυσσόμενες πόρτες για να ρυθμίζουν φως και αεράκι, λουτρά και πήλινους σωλήνες: άνεση που η Ευρώπη ξαναείδε μετά από χιλιετίες.' } },
    { id: 'prince', n: 7, at: [-2, 24], view: [-2, 20, 3.12, 0.12],
      title: { en: 'The "Prince of the Lilies" & Mr Evans', gr: 'Ο «Πρίγκιπας με τα Κρίνα» και ο κ. Έβανς' },
      sub: { en: 'How much of Knossos is 1900 AD?', gr: 'Πόση Κνωσός είναι του 1900 μ.Χ.;' },
      body: { en: 'This elegant youth with the lily crown is the palace\'s poster — yet he is assembled from fragments that may belong to three different figures, completed by Evans\'s painters. Much of "Minoan" Knossos is like that: Arthur Evans, digging from 1900, rebuilt columns and frescoes in concrete and named everything — palace, throne, prince — through the lens of myth. Real and restored stand side by side here: learning to ask "which is which?" is itself the lesson.',
        gr: 'Ο κομψός νέος με το στέμμα από κρίνα είναι η αφίσα του ανακτόρου — κι όμως συναρμολογήθηκε από θραύσματα που ίσως ανήκουν σε τρεις διαφορετικές μορφές, συμπληρωμένος από τους ζωγράφους του Έβανς. Έτσι είναι πολλή από τη «μινωική» Κνωσό: ο Άρθουρ Έβανς, σκάβοντας από το 1900, ξανάχτισε κίονες και τοιχογραφίες με μπετόν και ονομάτισε τα πάντα — ανάκτορο, θρόνο, πρίγκιπα — μέσα από τον μύθο. Το αυθεντικό και το αναστηλωμένο στέκουν εδώ πλάι-πλάι: να ρωτάς «ποιο είναι ποιο;» είναι το ίδιο το μάθημα.' } },
    { id: 'end', n: 8, at: [24, -2], view: [20, 0, -1.6, 0.08],
      title: { en: 'Thera, Fire and the Greeks', gr: 'Η Θήρα, η Φωτιά και οι Έλληνες' },
      sub: { en: 'The end of the Minoan world, c. 1450 BC', gr: 'Το τέλος του μινωικού κόσμου, περ. 1450 π.Χ.' },
      body: { en: 'Around 1600 BC the volcano of Thera exploded — one of the largest eruptions in human history — burying Minoan Akrotiri and battering Crete\'s coasts and fleets. The palaces recovered, then burned one by one around 1450; only Knossos lived on, now run by Greek-speaking Mycenaeans keeping their accounts in Linear B. The Labyrinth\'s last stores burned with the palace around 1350 BC — and Crete\'s power passed into legend, waiting for Evans\'s spade.',
        gr: 'Γύρω στο 1600 π.Χ. το ηφαίστειο της Θήρας εξερράγη — από τις μεγαλύτερες εκρήξεις στην ανθρώπινη ιστορία — θάβοντας το μινωικό Ακρωτήρι και χτυπώντας ακτές και στόλους της Κρήτης. Τα ανάκτορα συνήλθαν, μετά κάηκαν ένα-ένα γύρω στο 1450· μόνο η Κνωσός συνέχισε, τώρα με ελληνόφωνους Μυκηναίους που κρατούσαν τα κατάστιχά τους σε Γραμμική Β. Οι τελευταίες αποθήκες του Λαβυρίνθου κάηκαν μαζί του γύρω στο 1350 π.Χ. — και η δύναμη της Κρήτης πέρασε στον θρύλο, περιμένοντας τη σκαπάνη του Έβανς.' } }
  ]
};
