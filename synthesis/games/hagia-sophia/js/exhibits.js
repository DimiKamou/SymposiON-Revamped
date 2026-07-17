/* ============================================================
   Hagia Sophia 537 — exhibits.js
   The museum layer: 14 stations with curatorial text (EN/GR),
   glowing markers, proximity interaction, info panel, exhibit
   index with teleports, and the mini-map.
   ============================================================ */
HS.EXHIBITS = [
  {
    id: 'dome', n: 1, at: [0, 2.6], view: [0, 4, -Math.PI / 2, 0.85],
    title: { en: 'The Great Dome', gr: 'Ο Μέγας Τρούλος' },
    sub: { en: 'Ὁ τροῦλος · 31 m across, crown ≈ 49 m', gr: 'Διάμετρος 31 μ., κορυφή ≈ 49 μ.' },
    body: {
      en: 'Look up: this is the FIRST dome of 537 — about seven metres shallower than the one you would see today. A ring of forty windows makes its base dissolve into light, so that, in the words of the historian Procopius, it "seems not to rest upon solid masonry, but to hang from heaven by a golden chain." Earthquakes cracked this daring saucer and in 558 it fell; Isidore the Younger rebuilt it taller and safer in 562. You are standing under the boldest roof of antiquity: a hemisphere of brick, pumice and gold poised over a square of empty air.',
      gr: 'Κοιτάξτε ψηλά: αυτός είναι ο ΠΡΩΤΟΣ τρούλος του 537 — περίπου επτά μέτρα χαμηλότερος από τον σημερινό. Σαράντα παράθυρα στη βάση του τον κάνουν να «αιωρείται»· όπως έγραψε ο Προκόπιος, μοιάζει «να μην στηρίζεται σε στέρεα τοιχοποιία, αλλά να κρέμεται από τον ουρανό με χρυσή αλυσίδα». Οι σεισμοί ράγισαν το τολμηρό αυτό «πιάτο» και το 558 έπεσε· ο Ισίδωρος ο Νεότερος το ξανάχτισε ψηλότερο το 562. Στέκεστε κάτω από την πιο τολμηρή στέγη της αρχαιότητας.'
    }
  },
  {
    id: 'pendentives', n: 2, at: [10.5, 10.5], view: [7.5, 7.5, -Math.PI / 4 + Math.PI, 0.5],
    title: { en: 'Pendentives — a Circle on a Square', gr: 'Τα Σφαιρικά Τρίγωνα' },
    sub: { en: 'The invention that made the dome possible', gr: 'Η εφεύρεση που κράτησε τον τρούλο' },
    body: {
      en: 'Between the four great arches curve four spherical triangles — pendentives. They collect the round rim of the dome and deliver its immense weight to just four piers, leaving the corners of the square open to air and gold. Earlier builders set small domes on round or octagonal rooms; here, for the first time at colossal scale, a dome floats over a square hall. Every domed mosque, church and capitol building since is this room\'s descendant.',
      gr: 'Ανάμεσα στα τέσσερα μεγάλα τόξα καμπυλώνουν τέσσερα σφαιρικά τρίγωνα — τα λοφία. Παραλαμβάνουν τον κυκλικό δακτύλιο του τρούλου και οδηγούν το βάρος του σε τέσσερις μόνο πεσσούς. Για πρώτη φορά σε κολοσσιαία κλίμακα, ένας τρούλος «πλέει» πάνω από τετράγωνη αίθουσα. Κάθε μεταγενέστερος τρούλος — σε τζαμιά, ναούς, καπιτώλια — κατάγεται από αυτό το δωμάτιο.'
    }
  },
  {
    id: 'architects', n: 3, at: [-8, -2.6], view: [-8, -2.6, -Math.PI / 2],
    title: { en: 'Anthemius & Isidore — the Geometers', gr: 'Ανθέμιος και Ισίδωρος' },
    sub: { en: 'μηχανικοί — masters of geometry, 532–537', gr: 'Οι «μηχανικοί» του Ιουστινιανού, 532–537' },
    body: {
      en: 'After the Nika riot burned the old basilica in January 532, Justinian did not hire master masons — he hired two scientists: Anthemius of Tralles, a mathematician who wrote on burning-mirrors and conic sections, and Isidore of Miletus, editor of Archimedes. They raised this building in five years and ten months, an impossible schedule, with crews said to number ten thousand. It was consecrated on 27 December 537. Nothing of this size and daring had been attempted before; they were inventing the engineering as the walls went up.',
      gr: 'Μετά τη Στάση του Νίκα (532), ο Ιουστινιανός δεν προσέλαβε αρχιμάστορες — προσέλαβε δύο επιστήμονες: τον μαθηματικό Ανθέμιο από τις Τράλλεις και τον Ισίδωρο από τη Μίλητο, εκδότη του Αρχιμήδη. Ύψωσαν το κτίριο σε πέντε χρόνια και δέκα μήνες, με συνεργεία που λέγεται ότι έφταναν τους δέκα χιλιάδες τεχνίτες. Εγκαινιάστηκε στις 27 Δεκεμβρίου 537. Τίποτα τέτοιας κλίμακας δεν είχε τολμηθεί ξανά.'
    }
  },
  {
    id: 'solomon', n: 4, at: [-28.2, 0], view: [-26.5, 0, Math.PI / 2],
    title: { en: '“Solomon, I have outdone thee”', gr: '«Νενίκηκά σε, Σολομών»' },
    sub: { en: 'The Imperial Door, 27 December 537', gr: 'Η Ωραία Πύλη, 27 Δεκεμβρίου 537' },
    body: {
      en: 'You stand at the Imperial Door, the tallest of the nine doors from the narthex, reserved for the emperor and his procession; legend claimed its timbers came from Noah\'s Ark. Through it, on the day of consecration, Justinian is said to have walked to the centre of the nave, raised his hands toward the dome, and whispered: "Solomon, I have outdone thee" — claiming victory over the Temple of Jerusalem itself. For nearly a thousand years this remained the largest cathedral on earth.',
      gr: 'Βρίσκεστε στην Ωραία (Βασιλική) Πύλη — τη μεγαλύτερη από τις εννέα πύλες του νάρθηκα, προορισμένη μόνο για τον αυτοκράτορα· ο θρύλος έλεγε πως τα ξύλα της προέρχονταν από την Κιβωτό του Νώε. Από εδώ, την ημέρα των εγκαινίων, ο Ιουστινιανός λέγεται ότι προχώρησε στο κέντρο του ναού, ύψωσε τα χέρια και ψιθύρισε: «Νενίκηκά σε, Σολομών». Για σχεδόν χίλια χρόνια έμεινε ο μεγαλύτερος ναός της οικουμένης.'
    }
  },
  {
    id: 'mosaics', n: 5, at: [-4, 11.5], view: [-4, 9.5, Math.PI, 0.45],
    title: { en: 'Four Acres of Gold', gr: 'Τέσσερα Στρέμματα Χρυσού' },
    sub: { en: 'Justinianic mosaic: light made architecture', gr: 'Ιουστινιάνεια ψηφιδωτά' },
    body: {
      en: 'Every vault above the marble is skinned in glass tesserae backed with gold leaf — roughly four acres of them, each cube set at its own tiny angle so the surface glitters as you move. In Justinian\'s church the gold carried almost no figures: crosses, stars and scrolling ornament only. The famous images of Christ, the Virgin and the emperors belong to later centuries. In 537 the theology was light itself: a ceiling that behaves like slow fire.',
      gr: 'Κάθε θόλος πάνω από τα μάρμαρα είναι ντυμένος με γυάλινες ψηφίδες με φύλλο χρυσού — περίπου τέσσερα στρέμματα. Κάθε ψηφίδα πατά σε ελαφρώς διαφορετική γωνία, ώστε η επιφάνεια να σπινθηρίζει καθώς κινείστε. Στον ναό του Ιουστινιανού ο χρυσός δεν είχε σχεδόν καθόλου μορφές: σταυροί, αστέρια, φυτικά κοσμήματα. Οι περίφημες εικόνες ανήκουν σε μεταγενέστερους αιώνες. Το 537 η θεολογία ήταν το ίδιο το φως.'
    }
  },
  {
    id: 'marbles', n: 6, at: [5, -21.5], view: [5, -19, Math.PI],
    title: { en: 'Marble from Every Shore', gr: 'Μάρμαρα από Κάθε Ακτή' },
    sub: { en: 'Book-matched revetment — a stone meadow', gr: 'Ορθομαρμάρωση «ανοιχτού βιβλίου»' },
    body: {
      en: 'The walls wear thin slabs of veined marble, sawn and opened like the pages of a book so the veining mirrors itself — bookmatching. Paul the Silentiary, reciting his poem here in 563, catalogued the quarries like an empire in stone: white-grey Proconnesian from the Marmara, green from Karystos and Thessaly, rose-veined stone from Phrygia, gold-flecked Libyan, porphyry from Egypt. He said the church bloomed "like a meadow in full flower". Run your eye along the panels: the empire is the decoration.',
      gr: 'Οι τοίχοι φορούν λεπτές πλάκες φλεβωτού μαρμάρου, πριονισμένες και ανοιγμένες σαν σελίδες βιβλίου, ώστε τα «νερά» να καθρεφτίζονται. Ο Παύλος Σιλεντιάριος (563) απαρίθμησε τα λατομεία σαν αυτοκρατορία από πέτρα: Προκόννησος, Κάρυστος, Θεσσαλία, Φρυγία, Λιβύη, πορφυρίτης από την Αίγυπτο. Ο ναός, έγραψε, ανθίζει «σαν λιβάδι». Η ίδια η αυτοκρατορία είναι η διακόσμηση.'
    }
  },
  {
    id: 'columns', n: 7, at: [-23.2, 11.2], view: [-20.5, 9, Math.PI * 0.78],
    title: { en: 'Verd Antique & Imperial Porphyry', gr: 'Θεσσαλικό Πράσινο και Πορφυρίτης' },
    sub: { en: '104 columns; the exedrae hold the purple', gr: '104 κίονες· στις κόγχες το πορφυρό' },
    body: {
      en: 'A hundred and four columns carry the aisles, galleries and exedrae. The dark-green shafts are verd antique from Thessaly; the purple ones in these curved exedrae are Egyptian porphyry — the emperors\' own stone, quarried from a single mountain by the Red Sea. Later legend insisted they were trophies from the Temple of the Sun at Rome or from Baalbek; more likely Justinian simply commanded the best of every quarry. Their lace-like capitals were drilled, not carved, so the stone seems to froth.',
      gr: 'Εκατόν τέσσερις κίονες σηκώνουν κλίτη, υπερώα και κόγχες. Οι σκουροπράσινοι είναι θεσσαλικό «verd antique»· οι πορφυροί εδώ στις ημικυκλικές κόγχες είναι αιγυπτιακός πορφυρίτης — ο λίθος των αυτοκρατόρων. Ο θρύλος τους ήθελε λάφυρα από τον Ναό του Ηλίου της Ρώμης ή τον Ηλιούπολη· πιθανότερο είναι ο Ιουστινιανός απλώς να επέταξε ό,τι καλύτερο είχε κάθε λατομείο. Τα «δαντελωτά» κιονόκρανα τρυπήθηκαν με τρυπάνι, ώστε η πέτρα να αφρίζει.'
    }
  },
  {
    id: 'ambo', n: 8, at: [12.2, 2.2], view: [12.5, 3.2, Math.PI * 0.72],
    title: { en: 'The Ambo — Stage of the Word', gr: 'Ο Άμβωνας' },
    sub: { en: 'Where emperors were crowned', gr: 'Εδώ στέφονταν αυτοκράτορες' },
    body: {
      en: 'This raised oval platform under the eastern rim of the dome is the ambo. Deacons climbed its twin stairs to sing the Gospel; on Easter night the Exultet rolled down from here over ten thousand heads. Paul the Silentiary describes it sheathed in silver and precious stone, "an island in the swell of the sea". Because the whole city could see this spot, it became the coronation stage of Byzantium: centuries of emperors received the diadem standing where you stand now. Climb the steps.',
      gr: 'Η υπερυψωμένη ωοειδής εξέδρα κάτω από το ανατολικό χείλος του τρούλου είναι ο άμβωνας. Οι διάκονοι ανέβαιναν τις δίδυμες σκάλες για το Ευαγγέλιο. Ο Σιλεντιάριος τον περιγράφει ντυμένο ασήμι, «νησί μέσα στο κύμα της θάλασσας». Επειδή όλη η πόλη έβλεπε το σημείο αυτό, έγινε η σκηνή των στέψεων του Βυζαντίου: γενιές αυτοκρατόρων έλαβαν εδώ το διάδημα. Ανεβείτε τα σκαλιά.'
    }
  },
  {
    id: 'solea', n: 9, at: [18.5, 2.2], view: [17, 2.4, Math.PI * 0.62],
    title: { en: 'Solea & Templon — the Silver Frontier', gr: 'Σωλέας και Τέμπλο' },
    sub: { en: '40,000 lb of silver in the sanctuary', gr: 'Ασήμι «σαράντα χιλιάδων λιτρών»' },
    body: {
      en: 'A raised marble causeway — the solea — runs from the ambo to the sanctuary screen, a channel for processions through the crowd. The screen itself, the templon, carried twelve silver-clad columns and an architrave of solid silver stamped with medallions of Christ, angels and prophets, and the monograms of Justinian and Theodora. Contemporaries counted forty thousand pounds of silver in the sanctuary. It was not a wall but a shimmer: the holiest space showed through a fence of light.',
      gr: 'Ένας υπερυψωμένος διάδρομος — ο σωλέας — οδηγεί από τον άμβωνα στο φράγμα του ιερού, δρόμος των λιτανειών μέσα στο πλήθος. Το τέμπλο έφερε δώδεκα αργυρένδυτους κίονες και επιστύλιο από ατόφιο ασήμι με μετάλλια Χριστού, αγγέλων, προφητών και τα μονογράμματα Ιουστινιανού και Θεοδώρας. Οι σύγχρονοι μέτρησαν «σαράντα χιλιάδες λίτρες» ασημιού. Δεν ήταν τοίχος — ήταν μια λάμψη.'
    }
  },
  {
    id: 'altar', n: 10, at: [24.6, -3.4], view: [24.2, -2.8, Math.PI * 0.4],
    title: { en: 'The Holy Table & its Ciborium', gr: 'Η Αγία Τράπεζα και το Κιβώριο' },
    sub: { en: 'Gold fused with jewels; a silver tower above', gr: 'Χρυσός με ένθετους λίθους' },
    body: {
      en: 'The altar was famous even by this church\'s standards: a table of gold fused, the sources say, with a mash of precious stones, standing on golden columns under a ciborium — a silver canopy-tower crowned by an orb and cross weighing over a hundred pounds. Around it, curtains of silk and gold thread showed Christ between Peter and Paul. Almost none of this survived the sackings of 1204 and after; here it is restored to its place in the liturgy of 537.',
      gr: 'Η Αγία Τράπεζα ήταν θρυλική ακόμη και για τα μέτρα αυτού του ναού: τράπεζα από χρυσό συγχωνευμένο, λένε οι πηγές, με πολύτιμους λίθους, κάτω από κιβώριο — ασημένιο πυργωτό κουβούκλιο με σφαίρα και σταυρό στην κορυφή. Γύρω της, μεταξωτά παραπετάσματα με χρυσοκλωστή. Σχεδόν τίποτε δεν επέζησε από τις λεηλασίες του 1204 και μετά· εδώ αποκαθίσταται στη θέση του, όπως το 537.'
    }
  },
  {
    id: 'synthronon', n: 11, at: [27.6, 3.6], view: [26.8, 3.0, Math.PI * 0.32],
    title: { en: 'The Apse & Synthronon', gr: 'Η Αψίδα και το Σύνθρονο' },
    sub: { en: 'Seven tiers for the clergy of the Great Church', gr: 'Επτά βαθμίδες για τον κλήρο' },
    body: {
      en: 'The eastern apse holds the synthronon: seven marble tiers rising like a small theatre, seating the priests of the Great Church — a staff fixed by Justinian\'s own law at hundreds of clergy — with the patriarch\'s cathedra at the crown. Under the seats ran a hidden corridor. The three windows above poured the first morning light straight down the length of the nave to the Imperial Door: the building is a sunrise machine, aimed east.',
      gr: 'Η ανατολική αψίδα φιλοξενεί το σύνθρονο: επτά μαρμάρινες βαθμίδες σαν μικρό θέατρο για τους κληρικούς της Μεγάλης Εκκλησίας, με τον θρόνο του πατριάρχη στην κορυφή. Κάτω από τα έδρανα έτρεχε κρυφός διάδρομος. Τα τρία παράθυρα ψηλά ρίχνουν το πρώτο πρωινό φως κατά μήκος του ναού ώς την Ωραία Πύλη: το κτίριο είναι μια μηχανή ανατολής, στραμμένη στην ανατολή.'
    }
  },
  {
    id: 'gallery', n: 12, at: [-30.9, 0], atY: 13.2, view: [-30.6, 0, Math.PI / 2, 0.12], viewY: 13.2,
    title: { en: 'The Galleries & the Empress\'s Loge', gr: 'Τα Υπερώα και ο Χώρος της Αυγούστας' },
    sub: { en: 'Theodora\'s balcony over the nave', gr: 'Ο εξώστης της Θεοδώρας' },
    body: {
      en: 'An upper storey of galleries rings the nave on three sides, reached by spiral ramps in the corner towers — wide enough, it was said, to ride a donkey up. Tradition places the women\'s congregation here, and at this centre balcony over the Imperial Door, the empress\'s loge: from this rail Theodora — a circus performer\'s daughter wearing the purple — looked down the axis of the church her husband built. A porphyry disc marks the spot. Church councils later met in these same galleries.',
      gr: 'Ένας όροφος υπερώων περιβάλλει τον ναό από τρεις πλευρές· ανεβαίνει κανείς από κοχλιωτές ράμπες στους γωνιακούς πύργους — τόσο φαρδιές, έλεγαν, που ανέβαινες με υποζύγιο. Εδώ, στον κεντρικό εξώστη πάνω από την Ωραία Πύλη, ο χώρος της Αυγούστας: από αυτό το στηθαίο η Θεοδώρα κοίταζε τον άξονα του ναού που έχτισε ο σύζυγός της. Ένας πορφυρός δίσκος σημαδεύει τη θέση. Στα ίδια υπερώα συνήλθαν αργότερα σύνοδοι.'
    }
  },
  {
    id: 'light', n: 13, at: [4, 12.8], view: [4, 11, Math.PI + 0.4, 0.5],
    title: { en: 'The Second Sun — Polykandela', gr: 'Ο Δεύτερος Ήλιος — Πολυκάνδηλα' },
    sub: { en: 'Night lighting as a lighthouse for sailors', gr: 'Φάρος για τους ναυτικούς' },
    body: {
      en: 'By day, forty dome windows and tier upon tier of openings feed the gold. By night the church ignited: bronze rings — polykandela — hung on chains at head height, each carrying dozens of glass cups of olive oil, with single lamps strung between the columns like constellations. Paul the Silentiary says the glow poured through the windows so brightly that sailors on the Marmara steered by it: a lighthouse whose fire was a building. Try the dusk setting to see his poem happen.',
      gr: 'Τη μέρα, τα σαράντα παράθυρα του τρούλου τρέφουν τον χρυσό. Τη νύχτα ο ναός άναβε: μπρούτζινοι δίσκοι — πολυκάνδηλα — κρέμονταν σε αλυσίδες, γεμάτοι γυάλινα κύπελλα λαδιού, κι ανάμεσα στους κίονες μοναχικά καντήλια σαν αστερισμοί. Ο Σιλεντιάριος γράφει ότι η λάμψη ξεχυνόταν από τα παράθυρα τόσο δυνατά, που οι ναυτικοί του Μαρμαρά κυβερνούσαν με αυτήν: ένας φάρος που η φωτιά του ήταν κτίριο. Δοκιμάστε τη «Νύχτα» για να το δείτε.'
    }
  },
  {
    id: 'engineering', n: 14, at: [-11.5, -3], view: [-11.5, -2.5, -Math.PI / 2 + 0.35, 0.5],
    title: { en: 'Engineering the Impossible', gr: 'Η Μηχανική του Αδυνάτου' },
    sub: { en: 'How a 31-metre dome stands on empty air', gr: 'Πώς στέκεται τρούλος 31 μέτρων στο κενό' },
    body: {
      en: 'Follow the loads with your eye. The dome presses outward on its ring of forty windows; the pendentives gather that push and bend it into the four great arches; the arches drive it into four piers of dressed stone. East and west, the thrust rolls on into the half-domes, then the exedrae, then the outer walls — a cascade of shells, each buttressing the last, which is why the building feels weightless along its axis. North and south it is met bluntly: massive piers and the window-pierced tympana. The bricks are light, the mortar beds nearly as thick as the bricks — the whole structure flexes like a living thing. Built in under six years, shaken at once by the quakes of 553 and 557, the too-shallow first dome fell in 558; Isidore the Younger rebuilt it steeper — less outward push — and that geometry has ridden every earthquake since. No cathedral enclosed more space for nearly a thousand years.',
      gr: 'Ακολουθήστε τα φορτία με το βλέμμα. Ο τρούλος πιέζει προς τα έξω τον δακτύλιο των σαράντα παραθύρων· τα λοφία μαζεύουν την ώθηση και τη στέλνουν στα τέσσερα μεγάλα τόξα· τα τόξα στους τέσσερις πεσσούς. Ανατολικά και δυτικά η ώθηση κυλά στα ημιθόλια, στις κόγχες, στους εξωτερικούς τοίχους — καταρράκτης από κελύφη που αντιστηρίζουν το ένα το άλλο· γι\' αυτό ο άξονας μοιάζει αβαρής. Βόρεια και νότια τη συγκρατούν οι πεσσοί και τα τύμπανα. Τα τούβλα ελαφριά, τα αρμολογήματα παχιά σχεδόν όσο τα τούβλα — η κατασκευή «αναπνέει». Χτίστηκε σε λιγότερο από έξι χρόνια· οι σεισμοί του 553 και 557 ράγισαν τον πολύ ρηχό πρώτο τρούλο, που έπεσε το 558· ο Ισίδωρος ο Νεότερος τον ξανασήκωσε πιο κατακόρυφο — μικρότερη ώθηση — και αυτή η γεωμετρία άντεξε κάθε σεισμό έκτοτε. Κανένας καθεδρικός δεν έκλεισε περισσότερο χώρο για σχεδόν χίλια χρόνια.'
    }
  },
  {
    id: 'icons', n: 15, at: [13.5, -3.2], view: [12.5, -2.8, -Math.PI / 2 + 0.12, 0.3],
    title: { en: 'The Icons — a Later Skin', gr: 'Οι Εικόνες — Μεταγενέστερο Δέρμα' },
    sub: { en: 'Press I to strip back to 537', gr: 'Πατήστε I για να δείτε το 537' },
    body: {
      en: 'In 537 this gold held almost no faces — crosses, stars, ornament. After the century-long crisis of Iconoclasm ended in 843, the images returned in glory, and this reconstruction lets you wear that later skin over Justinian\'s church: the enthroned Mother of God in the apse — unveiled in 867, when Patriarch Photius preached that her silent lips seemed to speak; six-winged seraphim on the pendentives; Christ Pantokrator, "Ruler of All," in the crown of the dome; the great bishops — Chrysostom, Basil, Nicholas — standing in the tympana niches; Emperor Leo VI prostrate before Christ over the Imperial Door; and upstairs in the south gallery, the Deesis, set after 1261, whose gentleness has stunned visitors for centuries. Toggle the icon layer (I) to move between 537 and the church of later ages.',
      gr: 'Το 537 ο χρυσός αυτός δεν είχε σχεδόν κανένα πρόσωπο — σταυροί, αστέρια, κόσμημα. Όταν τελείωσε η Εικονομαχία (843), οι εικόνες γύρισαν με δόξα, και η αναπαράσταση σας αφήνει να φορέσετε αυτό το μεταγενέστερο «δέρμα» στον ναό του Ιουστινιανού: η ένθρονη Θεοτόκος στην αψίδα — αποκαλύφθηκε το 867, όταν ο πατριάρχης Φώτιος κήρυξε πως τα σιωπηλά χείλη της μοιάζουν να μιλούν· εξαπτέρυγα στα λοφία· ο Παντοκράτωρ στην κορυφή του τρούλου· οι ιεράρχες — Χρυσόστομος, Βασίλειος, Νικόλαος — όρθιοι στα τύμπανα· ο Λέων ΣΤ΄ γονατιστός μπροστά στον Χριστό πάνω από την Ωραία Πύλη· και πάνω, στο νότιο υπερώο, η Δέηση (μετά το 1261), που η γλυκύτητά της συγκλονίζει αιώνες τώρα. Εναλλάξτε το στρώμα των εικόνων (I) ανάμεσα στο 537 και στους κατοπινούς αιώνες.'
    }
  },
  {
    id: 'atrium', n: 16, at: [-62.5, 2.8], view: [-60.5, 2.2, Math.PI / 2 + 0.5],
    title: { en: 'The Atrium & the Phiale', gr: 'Το Αίθριο και η Φιάλη' },
    sub: { en: 'ΝΙΨΟΝ ΑΝΟΜΗΜΑΤΑ ΜΗ ΜΟΝΑΝ ΟΨΙΝ', gr: 'Το παλίνδρομο της φιάλης' },
    body: {
      en: 'The faithful reached the Great Church through this open courtyard, washing hands and face at the central fountain — the phiale — before entering. Tradition attaches to such fountains the famous palindrome that reads the same forwards and backwards: ΝΙΨΟΝ ΑΝΟΜΗΜΑΤΑ ΜΗ ΜΟΝΑΝ ΟΨΙΝ — "Wash your sins, not only your face." From here the building shows its outer body: plain brick and lead, a deliberately quiet shell around the golden interior — Byzantium\'s favourite metaphor for the soul.',
      gr: 'Οι πιστοί έφταναν στη Μεγάλη Εκκλησία μέσα από αυτή την ανοιχτή αυλή, πλένοντας χέρια και πρόσωπο στη φιάλη πριν μπουν. Με τέτοιες κρήνες συνδέθηκε το περίφημο παλίνδρομο: ΝΙΨΟΝ ΑΝΟΜΗΜΑΤΑ ΜΗ ΜΟΝΑΝ ΟΨΙΝ. Από εδώ το κτίριο δείχνει το εξωτερικό του σώμα: λιτό τούβλο και μόλυβδος, ένα επίτηδες σιωπηλό κέλυφος γύρω από το χρυσό εσωτερικό — η αγαπημένη μεταφορά του Βυζαντίου για την ψυχή.'
    }
  },
];

/* ---------------- runtime ---------------- */
HS.buildExhibits = function (world) {
  const group = new THREE.Group();
  world.add(group);
  HS.markerMeshes = [];

  HS.EXHIBITS.forEach(ex => {
    const y = ex.atY || 0;
    const g = new THREE.Group();
    g.position.set(ex.at[0], y, ex.at[1]);
    // light column
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.13, 2.6, 10, 1, true), HS.mats.marker);
    beam.position.y = 1.4;
    g.add(beam);
    // numbered medallion
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d');
    x.fillStyle = '#14100a'; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill();
    x.strokeStyle = '#d9b45c'; x.lineWidth = 6; x.beginPath(); x.arc(64, 64, 54, 0, 7); x.stroke();
    x.fillStyle = '#ecd9a0'; x.font = 'bold 58px Georgia,serif';
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(ex.n), 64, 68);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, depthTest: true, transparent: true }));
    spr.scale.set(0.62, 0.62, 1);
    spr.position.y = 2.05;
    g.add(spr);
    g.userData.ex = ex;
    group.add(g);
    HS.markerMeshes.push(g);
  });

  /* pulse + nearest-detection each frame; returns nearest in range */
  HS.tickExhibits = function (t, playerPos) {
    let best = null, bestD = 3.6 * 3.6;
    for (const g of HS.markerMeshes) {
      const s = 1 + 0.08 * Math.sin(t * 2.4 + g.position.x);
      g.children[0].scale.set(s, 1, s);
      const dx = g.position.x - playerPos.x, dz = g.position.z - playerPos.z,
            dy = (g.position.y + 1.2) - playerPos.y;
      const d2 = dx * dx + dz * dz + (Math.abs(dy) > 2.4 ? 99 : 0);
      if (d2 < bestD) { bestD = d2; best = g.userData.ex; }
    }
    return best;
  };
};

/* ---------------- mini-map ---------------- */
HS.drawMinimap = function (canvas, playerPos, yaw, activeId) {
  const x = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  x.clearRect(0, 0, W, H);
  // world → map: x −92…38 (130 m), z −33…33 (66 m)
  const sx = W / 130, sz = H / 66;
  const mx = wx => (wx + 92) * sx, mz = wz => (wz + 33) * sz;
  x.fillStyle = 'rgba(16,13,8,0.72)';
  x.fillRect(0, 0, W, H);
  x.strokeStyle = 'rgba(217,180,92,0.9)'; x.lineWidth = 1.1;
  x.fillStyle = 'rgba(217,180,92,0.13)';
  function rect(x0, x1, z0, z1, fill) {
    if (fill) x.fillRect(mx(x0), mz(z0), (x1 - x0) * sx, (z1 - z0) * sz);
    x.strokeRect(mx(x0), mz(z0), (x1 - x0) * sx, (z1 - z0) * sz);
  }
  rect(-88, -45.6, -24, 24, true);          // atrium
  rect(-44.2, -39.6, -28.6, 28.6, true);    // exonarthex
  rect(-38.2, -32.4, -28.6, 28.6, true);    // narthex
  rect(-31, 31, -30.6, 30.6, true);         // basilica block
  x.beginPath(); x.arc(mx(30.2), mz(0), 4.9 * sx, -Math.PI / 2, Math.PI / 2); x.stroke(); // apse
  // nave square + dome circle
  x.strokeRect(mx(-15.5), mz(-15.5), 31 * sx, 31 * sz);
  x.beginPath(); x.arc(mx(0), mz(0), 15.5 * sx, 0, 7); x.stroke();
  x.beginPath(); x.arc(mx(-66), mz(0), 3.4 * sx, 0, 7); x.stroke();  // phiale
  // exhibits
  HS.EXHIBITS.forEach(ex => {
    x.fillStyle = ex.id === activeId ? '#ffe9a8' : '#c9a24a';
    x.beginPath(); x.arc(mx(ex.at[0]), mz(ex.at[1]), ex.id === activeId ? 3.4 : 2.4, 0, 7); x.fill();
  });
  // player arrow (forward = (−sin yaw, −cos yaw))
  const px = mx(playerPos.x), pz = mz(playerPos.z);
  const fx = -Math.sin(yaw), fz = -Math.cos(yaw);
  x.fillStyle = '#fff3d0';
  x.beginPath();
  x.moveTo(px + fx * 7, pz + fz * 7);
  x.lineTo(px - fz * 3.2 - fx * 3, pz + fx * 3.2 - fz * 3);
  x.lineTo(px + fz * 3.2 - fx * 3, pz - fx * 3.2 - fz * 3);
  x.closePath(); x.fill();
};
