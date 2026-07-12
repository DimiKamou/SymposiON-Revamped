/* ============================================================
   Κωνσταντινούπολις 330–1453 — app config (exhibits, eras, map).
   Scale: 1 unit ≈ 10 m. +x = east (the point), z− = Golden Horn,
   z+ = Marmara. The engine (chronos-engine.js) reads XP_APP.
   ============================================================ */
window.XP_APP = {
  id: 'constantinople',
  title: 'ΚΩΝΣΤΑΝΤΙΝΟΥΠΟΛΙΣ · 330–1453',
  subtitle: { en: 'A city through eleven centuries — fly through its growth', gr: 'Μια πόλη μέσα σε έντεκα αιώνες — πετάξτε πάνω από την εξέλιξή της' },
  intro: [
    { en: 'In 330 Constantine the Great refounded the old Greek town of Byzantion as New Rome. This living diorama lets you watch the City grow: press the year buttons (or ← →) to move between six moments — the founding, the Theodosian walls, Justinian\'s golden age, the medieval apogee, the catastrophe of 1204, and the last siege of 1453.',
      gr: 'Το 330 ο Μέγας Κωνσταντίνος ξαναθεμελίωσε το αρχαίο Βυζάντιο ως Νέα Ρώμη. Σε αυτό το ζωντανό διόραμα βλέπετε την Πόλη να μεγαλώνει: πατήστε τα κουμπιά των χρονολογιών (ή ← →) για να ταξιδέψετε σε έξι στιγμές — ίδρυση, Θεοδοσιανά τείχη, χρυσός αιώνας του Ιουστινιανού, μεσαιωνική ακμή, καταστροφή του 1204 και τελευταία πολιορκία του 1453.' },
    { en: 'Fly like a bird (F toggles walking on the ground). Eleven numbered markers hover over the monuments — approach one and press E. The texts lean on the eyewitnesses: Prokopios, Villehardouin, Niketas Choniates, Doukas, Kritoboulos.',
      gr: 'Πετάξτε σαν πουλί (με F περπατάτε στο έδαφος). Έντεκα αριθμημένοι σταθμοί αιωρούνται πάνω από τα μνημεία — πλησιάστε και πατήστε E. Τα κείμενα ακουμπούν στους αυτόπτες: Προκόπιο, Βιλλεαρδουίνο, Νικήτα Χωνιάτη, Δούκα, Κριτόβουλο.' }
  ],
  enter: { en: 'Fly to the City', gr: 'Πτήση προς την Πόλη' },
  credit: { en: 'Stylised reconstruction for the SymposiON history course. Topography and monuments simplified after the standard city plans (Müller-Wiener).', gr: 'Σχηματική αναπαράσταση για το μάθημα Ιστορίας του SymposiON. Τοπογραφία και μνημεία απλοποιημένα κατά τα καθιερωμένα σχέδια (Müller-Wiener).' },
  listTitle: { en: 'THE ELEVEN STATIONS', gr: 'ΟΙ ΕΝΤΕΚΑ ΣΤΑΘΜΟΙ' },
  theme: { gold: '#d9b45c', halo: 'rgba(74,44,88,.55)', btn1: '#e8c874', btn2: '#b78d34', sub: '#c9b0d8' },
  sky: { top: '#3f6fae', mid: '#8fb6dd', horizon: '#e8d9b8', sun: { u: 0.3, v: 0.28 } },
  fog: { color: 0x9fb4c8, density: 0.00095 },
  sun: { color: 0xfff2d0, intensity: 2.6, pos: [300, 500, 380] },
  hemi: { sky: 0xcfe0f0, ground: 0x6b5f48, intensity: 0.75 },
  fills: [],
  exposure: 1.0,
  spawn: { x: -120, z: 160, yaw: -0.95, pitch: -0.32, y: 130 },
  eye: 2.0, walkSpeed: 14, runSpeed: 30,
  fly: { speed: 65, minY: 3, maxY: 320, start: true },
  bounds: { x0: -340, x1: 340, z0: -260, z1: 260 },
  interactR: 42, markerScale: 9, labels: true, climb: 3,
  ambience: { freqs: [[98, 0.035], [98.7, 0.028], [147, 0.016], [196, 0.008]], verb: 2.2, air: 700 },

  eras: [
    { year: '330',  title: { en: 'The Founding', gr: 'Η Ίδρυση' },
      blurb: { en: 'Constantine walls in New Rome: Hippodrome, palace, forum, the Mese.', gr: 'Ο Κωνσταντίνος τειχίζει τη Νέα Ρώμη: Ιππόδρομος, παλάτι, φόρουμ, Μέση οδός.' } },
    { year: '413',  title: { en: 'Theodosian Walls', gr: 'Θεοδοσιανά Τείχη' },
      blurb: { en: 'The city doubles; the mightiest land walls of antiquity rise further west, and sea walls seal both shores.', gr: 'Η πόλη διπλασιάζεται· τα ισχυρότερα χερσαία τείχη της αρχαιότητας υψώνονται δυτικότερα και παράλια τείχη σφραγίζουν τις δύο ακτές.' } },
    { year: '537',  title: { en: 'Justinian', gr: 'Ιουστινιανός' },
      blurb: { en: 'Half a million people; Hagia Sophia\'s dome crowns the skyline.', gr: 'Μισό εκατομμύριο κάτοικοι· ο τρούλος της Αγίας Σοφίας στεφανώνει τον ορίζοντα.' } },
    { year: '1000', title: { en: 'The Apogee', gr: 'Η Ακμή' },
      blurb: { en: 'Queen of Cities: markets, monasteries, the suburb of Galata across the Horn.', gr: 'Βασιλεύουσα: αγορές, μοναστήρια, το προάστιο του Γαλατά απέναντι στον Κεράτιο.' } },
    { year: '1204', title: { en: 'The Sack', gr: 'Η Άλωση των Σταυροφόρων' },
      blurb: { en: 'The Fourth Crusade breaks the chain, burns and loots the City for three days.', gr: 'Η Δ΄ Σταυροφορία σπάει την αλυσίδα, καίει και λεηλατεί την Πόλη επί τρεις ημέρες.' } },
    { year: '1453', title: { en: 'The Last Siege', gr: 'Η Τελευταία Πολιορκία' },
      blurb: { en: 'A shrunken city of 50,000 faces Mehmed II, his great bombard, and ships hauled overland.', gr: 'Μια συρρικνωμένη πόλη 50.000 ψυχών αντικρίζει τον Μωάμεθ Β΄, τη μεγάλη βομβάρδα και τα καράβια που σύρθηκαν από τη στεριά.' } }
  ],
  startEra: 0,

  map: {
    x0: -340, x1: 340, z0: -260, z1: 260, w: 260, h: 200,
    draw(x, m) {
      x.fillStyle = '#20415c';                     // sea
      x.fillRect(0, 0, 260, 200);
      x.fillStyle = '#8c7c5c';                     // peninsula (rough)
      x.beginPath();
      m.p = (wx, wz, mv) => x[mv ? 'moveTo' : 'lineTo'](m.x(wx), m.z(wz));
      m.p(-255, -155, 1); m.p(60, -120); m.p(160, -95); m.p(255, -35);
      m.p(212, 56); m.p(140, 85); m.p(20, 110); m.p(-150, 150); m.p(-255, 165);
      x.closePath(); x.fill();
      x.fillStyle = '#7c6c50';                     // Galata
      x.beginPath();
      m.p(120, -200, 1); m.p(230, -195); m.p(235, -125); m.p(150, -120);
      x.closePath(); x.fill();
      x.strokeStyle = '#e8d9a8'; x.lineWidth = 1.6; // walls
      x.beginPath(); m.p(-235, -152, 1); m.p(-242, 162); x.stroke();
      x.strokeStyle = 'rgba(232,217,168,0.5)';
      x.beginPath(); m.p(-52, -128, 1); m.p(-70, 140); x.stroke();
    }
  },

  exhibits: [
    { id: 'founding', n: 1, at: [232, -32], view: [180, -70, 2.55, -0.2], viewY: 60, era: 0,
      title: { en: 'From Byzantion to New Rome', gr: 'Από το Βυζάντιο στη Νέα Ρώμη' },
      sub: { en: '11 May 330 — the dedication', gr: '11 Μαΐου 330 — τα εγκαίνια' },
      body: { en: 'On this headland between two seas stood Byzantion, a Greek colony of the 7th century BC. Constantine saw what its founders saw — a harbour on the Golden Horn, currents guarding three sides, one narrow neck to defend — and in 330 dedicated New Rome here, four times the old town\'s size. He stripped the empire\'s cities of statues to furnish it and promised bread, games and palaces: a capital born fully grown.',
        gr: 'Σε αυτό το ακρωτήρι ανάμεσα σε δύο θάλασσες βρισκόταν το Βυζάντιο, ελληνική αποικία του 7ου αι. π.Χ. Ο Κωνσταντίνος είδε ό,τι και οι πρώτοι οικιστές — λιμάνι στον Κεράτιο, ρεύματα να φυλούν τις τρεις πλευρές, ένας στενός λαιμός για άμυνα — και το 330 εγκαινίασε εδώ τη Νέα Ρώμη, τετραπλάσια από την παλιά πόλη. Γύμνωσε τις πόλεις της αυτοκρατορίας από αγάλματα για να τη στολίσει: μια πρωτεύουσα γεννημένη ώριμη.' } },
    { id: 'hippodrome', n: 2, at: [172, 20], view: [150, 55, 0.6, -0.25], viewY: 50, era: 0,
      title: { en: 'Hippodrome & Great Palace', gr: 'Ιππόδρομος και Μέγα Παλάτιον' },
      sub: { en: '100,000 seats; Blues and Greens', gr: '100.000 θέσεις· Βένετοι και Πράσινοι' },
      body: { en: 'The U-shaped Hippodrome was the city\'s heart: chariot races, imperial proclamations, riots — the Nika revolt of 532 began and ended here, in blood. Its spina carried trophies of the whole Greek world: the Serpent Column the Greek cities dedicated at Delphi after Plataia (479 BC), the obelisk of Thutmose III that Theodosius raised in 390 on a base carved with his own court watching the races, and four gilded bronze horses above the starting-gates — the team that has stood over the door of San Marco in Venice since crusaders carried it off in 1204 (flip to that year and they are gone). Next door sprawled the Great Palace, golden halls descending in terraces toward the sea, joined to the imperial box by a private spiral stair.',
        gr: 'Ο πεταλόσχημος Ιππόδρομος ήταν η καρδιά της πόλης: αρματοδρομίες, αναγορεύσεις αυτοκρατόρων, στάσεις — η Στάση του Νίκα (532) άρχισε και τελείωσε εδώ, στο αίμα. Η σπίνα του σήκωνε τρόπαια όλου του ελληνισμού: τον Τρικάρηνο Όφι που αφιέρωσαν οι ελληνικές πόλεις στους Δελφούς μετά τις Πλαταιές (479 π.Χ.), τον οβελίσκο του Τουθμώσιδος Γ΄ που έστησε ο Θεοδόσιος το 390 σε βάθρο με ανάγλυφη την αυλή του να παρακολουθεί τους αγώνες, και τέσσερα επίχρυσα χάλκινα άλογα πάνω από τις αφετηρίες — αυτά που από το 1204, όταν τα άρπαξαν οι σταυροφόροι, στέκουν πάνω από την πύλη του Αγίου Μάρκου στη Βενετία (γυρίστε σε εκείνη τη χρονιά: έχουν χαθεί). Δίπλα απλωνόταν το Μέγα Παλάτιον, χρυσές αίθουσες σε άνδηρα ώς τη θάλασσα.' } },
    { id: 'walls', n: 3, at: [-235, 40], view: [-290, 60, -1.35, -0.12], viewY: 35, era: 1,
      title: { en: 'The Theodosian Walls', gr: 'Τα Θεοδοσιανά Τείχη' },
      sub: { en: '413 AD — unbreached for 1,040 years', gr: '413 μ.Χ. — απόρθητα για 1.040 χρόνια' },
      body: { en: 'Six kilometres of double wall and moat: an outer wall, a killing terrace, then the great inner wall with 96 towers, 12 m high and 5 m thick. Built under Theodosius II when the city outgrew Constantine\'s circuit, they threw back Huns, Avars, Arabs, Bulgars and Rus for a thousand years. At the south end the marble Golden Gate received triumphant emperors. And they were only one side of the ring — from 439 sea walls closed the rest of the coast (station 11). Only gunpowder — in 1453 — ever solved them.',
        gr: 'Έξι χιλιόμετρα διπλού τείχους με τάφρο: εξωτερικό τείχος, περίβολος, και το μέγα εσωτερικό τείχος με 96 πύργους, ύψους 12 μ. και πάχους 5 μ. Χτισμένα επί Θεοδοσίου Β΄, όταν η πόλη ξεπέρασε τον κωνσταντίνειο περίβολο, απέκρουσαν Ούννους, Αβάρους, Άραβες, Βουλγάρους και Ρως επί χίλια χρόνια. Στο νότιο άκρο η μαρμάρινη Χρυσή Πύλη υποδεχόταν θριαμβευτές αυτοκράτορες. Κι ήταν μόνο η μία πλευρά του δακτυλίου — από το 439 παράλια τείχη έκλεισαν την υπόλοιπη ακτή (σταθμός 11). Μόνο το μπαρούτι — το 1453 — τα λύγισε.' } },
    { id: 'aqueduct', n: 4, at: [10, -10], view: [30, 30, 0.45, -0.18], viewY: 40, era: 1,
      title: { en: 'Water for a Capital', gr: 'Νερό για μια Πρωτεύουσα' },
      sub: { en: 'The Aqueduct of Valens & the cisterns', gr: 'Το Υδραγωγείο του Ουάλη και οι κινστέρνες' },
      body: { en: 'A capital on a dry ridge drinks from far away. The Aqueduct of Valens strode across the valley between the hills, the visible end of channels reaching 120 km into Thrace — the longest water system of the ancient world. Because a besieged city cannot rely on aqueducts, emperors dug vast covered cisterns — like the "Sunken Palace" of 336 columns near Hagia Sophia — and open reservoirs like lakes.',
        gr: 'Μια πρωτεύουσα πάνω σε ξερή ράχη πίνει νερό από μακριά. Το Υδραγωγείο του Ουάλη διέσχιζε την κοιλάδα ανάμεσα στους λόφους, ορατή απόληξη αγωγών που έφταναν 120 χλμ. μέσα στη Θράκη — το μακρύτερο υδρευτικό σύστημα του αρχαίου κόσμου. Κι επειδή η πολιορκημένη πόλη δεν βασίζεται σε υδραγωγεία, οι αυτοκράτορες έσκαψαν πελώριες σκεπαστές κινστέρνες — όπως η «Βασιλική» με τους 336 κίονες — και ανοιχτές δεξαμενές σαν λίμνες.' } },
    { id: 'hagiasophia', n: 5, at: [195, -8], view: [165, -45, 2.7, -0.15], viewY: 45, era: 2,
      title: { en: 'Hagia Sophia Crowns the City', gr: 'Η Αγία Σοφία στεφανώνει την Πόλη' },
      sub: { en: '537 — walk inside it in the SymposiON museum', gr: '537 — περπατήστε στο εσωτερικό της στο μουσείο του SymposiON' },
      body: { en: 'Watch the skyline change between 413 and 537: the long gabled basilica burns in the Nika riot and Justinian answers with the impossible — a 31-metre dome floating over the city. For nine hundred years travellers coming up the Marmara saw this silhouette first and understood what the City claimed to be. To stand under that dome, open the separate Hagia Sophia 537 experience in SymposiON.',
        gr: 'Δείτε τον ορίζοντα να αλλάζει από το 413 στο 537: η μακριά ξυλόστεγη βασιλική καίγεται στη Στάση του Νίκα και ο Ιουστινιανός απαντά με το αδύνατο — έναν τρούλο 31 μέτρων να πλέει πάνω από την πόλη. Επί εννιακόσια χρόνια οι ταξιδιώτες που ανέβαιναν τον Μαρμαρά έβλεπαν πρώτη αυτή τη σιλουέτα. Για να σταθείτε κάτω από τον τρούλο, ανοίξτε την εμπειρία «Αγία Σοφία 537» στο SymposiON.' } },
    { id: 'harbours', n: 6, at: [20, 100], view: [60, 150, 0.35, -0.2], viewY: 45, era: 2,
      title: { en: 'Harbours & the Grain of Egypt', gr: 'Λιμάνια και το Σιτάρι της Αιγύπτου' },
      sub: { en: 'Feeding half a million mouths', gr: 'Τροφή για μισό εκατομμύριο στόματα' },
      body: { en: 'The City could never feed itself. Every summer the grain fleet from Alexandria crossed to these artificial harbours on the Marmara shore — Julian\'s and the huge Theodosian harbour — behind moles, watched by officials who weighed, stored and doled out free bread. When Egypt fell to the Arabs in 641, the dole ended and the City learned to be smaller.',
        gr: 'Η Πόλη δεν μπορούσε ποτέ να θραφεί μόνη. Κάθε καλοκαίρι ο σιτοστόλος της Αλεξάνδρειας έδενε σε αυτά τα τεχνητά λιμάνια της ακτής του Μαρμαρά — του Ιουλιανού και το πελώριο Θεοδοσιανό — πίσω από κυματοθραύστες, κάτω από το βλέμμα αξιωματούχων που ζύγιζαν, αποθήκευαν και μοίραζαν δωρεάν ψωμί. Όταν η Αίγυπτος έπεσε στους Άραβες (641), η δωρεάν διανομή τελείωσε και η Πόλη έμαθε να ζει μικρότερη.' } },
    { id: 'chain', n: 7, at: [227, -52], view: [263, -98, 1.72, -0.55], viewY: 42, era: 3,
      title: { en: 'The Golden Horn & the Chain', gr: 'Ο Κεράτιος και η Αλυσίδα' },
      sub: { en: 'The best harbour in Europe, lockable', gr: 'Το καλύτερο λιμάνι της Ευρώπης — που κλείδωνε' },
      body: { en: 'The Golden Horn is a drowned river valley — calm, current-free, the finest natural harbour of the medieval world, and the one soft flank of the sea defences. So its mouth locked: a great iron chain on wooden floats, winched taut between the tower of Eugenios below the acropolis point and the Kastellion fort on the Galata shore. It is first recorded stopping the Arab fleet in 717. In July 1203 the crusader fleet solved it by brute force: their biggest transport, the Eagle, ran it down under full sail and the galleys poured through — the marshal Villehardouin, who was there, tells how tower and chain fell and the port was won (see 1204). In 1453 the chain held to the end, so Mehmed II went around it — seventy ships hauled over the Galata ridge on greased timbers; his historian Kritoboulos marvels at a fleet "carried across dry land as if sailing". Flip the years to watch it stretched, broken, and bypassed.',
        gr: 'Ο Κεράτιος είναι μια πνιγμένη κοιλάδα ποταμού — ήρεμος, χωρίς ρεύματα, το καλύτερο φυσικό λιμάνι του μεσαιωνικού κόσμου και το μόνο μαλακό πλευρό της θαλάσσιας άμυνας. Γι\' αυτό το στόμιό του κλείδωνε: βαριά σιδερένια αλυσίδα σε ξύλινους πλωτήρες, τεντωμένη από τον πύργο του Ευγενίου, κάτω από το ακρωτήρι, ώς το Καστέλλιον στην ακτή του Γαλατά. Πρωτοκαταγράφεται να φρενάρει τον αραβικό στόλο το 717. Τον Ιούλιο του 1203 οι σταυροφόροι τη «έλυσαν» με ωμή βία: το μεγαλύτερο μεταγωγικό τους, ο Αετός, την πάτησε με φουσκωμένα πανιά και οι γαλέρες ξεχύθηκαν μέσα — ο στρατάρχης Βιλλεαρδουίνος, αυτόπτης, γράφει πώς έπεσαν πύργος και αλυσίδα και «κερδήθηκε το λιμάνι» (δείτε το 1204). Το 1453 η αλυσίδα κράτησε ώς το τέλος, κι ο Μωάμεθ Β΄ την παρέκαμψε — εβδομήντα πλοία σύρθηκαν πάνω από τη ράχη του Γαλατά σε λαδωμένα δοκάρια· ο ιστορικός του Κριτόβουλος θαυμάζει στόλο που «ταξίδεψε πάνω στη στεριά». Αλλάξτε χρονιές για να τη δείτε τεντωμένη, σπασμένη και παρακαμμένη.' } },
    { id: 'mese', n: 8, at: [148, 10], view: [120, 40, 1.05, -0.22], viewY: 40, era: 3,
      title: { en: 'The Mese & the Forums', gr: 'Η Μέση Οδός και τα Φόρουμ' },
      sub: { en: 'A porticoed spine from palace to gate', gr: 'Σπονδυλική στήλη με στοές, από το παλάτι ώς την πύλη' },
      body: { en: 'One colonnaded avenue — the Mese, "Middle Street" — ran from the palace square through a string of round and square forums, each with its monument: Constantine\'s porphyry column carried the founder as sun-god. Under its porticoes were the silk shops, perfumers and money-changers of the richest market in Christendom; along it rolled triumphs, icons and funerals for eleven centuries.',
        gr: 'Μία λεωφόρος με κιονοστοιχίες — η Μέση Οδός — έτρεχε από την πλατεία του παλατιού μέσα από μια αλυσίδα φόρουμ, καθένα με το μνημείο του: ο πορφυρός κίονας του Κωνσταντίνου έφερε τον ιδρυτή ως θεό-Ήλιο. Στις στοές της βρίσκονταν τα μεταξωτά, οι αρωματοπώλες και οι αργυραμοιβοί της πλουσιότερης αγοράς της χριστιανοσύνης· πάνω της κύλησαν θρίαμβοι, εικόνες και κηδείες έντεκα αιώνων.' } },
    { id: 'sack1204', n: 9, at: [100, -60], view: [140, -130, 2.85, -0.22], viewY: 55, era: 4,
      title: { en: '1204 — Christians Sack the City', gr: '1204 — Χριστιανοί λεηλατούν την Πόλη' },
      sub: { en: 'The Fourth Crusade turns aside', gr: 'Η Δ΄ Σταυροφορία αλλάζει ρότα' },
      body: { en: 'Bound for Egypt, the Fourth Crusade was diverted by debts and dynastic promises to the walls of Christian Constantinople. The chain fell first (station 7); then Venetian galleys stormed the low Horn-side walls from flying bridges rigged to their masts — blind old Doge Dandolo had his own ship run ashore beneath them. For three days in April 1204 the crusaders burned, killed and stripped the City, melting statues that had survived since classical Greece and carrying the bronze horses to Venice. The eyewitness Niketas Choniates wrote that even the Saracens would have been more merciful; Villehardouin answered for the other side that "never, since the world was made, was so much booty won in any city". Byzantium survived in exile and returned in 1261, but the Queen of Cities never truly recovered.',
        gr: 'Με προορισμό την Αίγυπτο, η Δ΄ Σταυροφορία εκτράπηκε — από χρέη και δυναστικές υποσχέσεις — στα τείχη της χριστιανικής Κωνσταντινούπολης. Πρώτα έπεσε η αλυσίδα (σταθμός 7)· μετά οι βενετικές γαλέρες πάτησαν τα χαμηλά τείχη του Κερατίου από κρεμαστές γέφυρες στα κατάρτια — ο γέρος τυφλός δόγης Δάνδολος έριξε τη δική του γαλέρα στα ρηχά από κάτω τους. Επί τρεις μέρες τον Απρίλιο του 1204 οι σταυροφόροι έκαιγαν, σκότωναν και ξεγύμνωναν την Πόλη — έλιωσαν αγάλματα που ζούσαν από την κλασική Ελλάδα, πήραν τα χάλκινα άλογα στη Βενετία. Ο αυτόπτης Νικήτας Χωνιάτης έγραψε πως κι οι Σαρακηνοί θα ήταν πιο σπλαχνικοί· ο Βιλλεαρδουίνος απάντησε για την άλλη πλευρά ότι «από καταβολής κόσμου δεν κερδήθηκε τόση λεία σε καμία πόλη». Το Βυζάντιο επέζησε στην εξορία και γύρισε το 1261, αλλά η Βασιλεύουσα δεν συνήλθε ποτέ πραγματικά.' } },
    { id: 'siege1453', n: 10, at: [-262, 10], view: [-310, 40, -1.2, -0.15], viewY: 45, era: 5,
      title: { en: '29 May 1453', gr: '29 Μαΐου 1453' },
      sub: { en: 'Η Πόλις εάλω', gr: 'Η Πόλις εάλω' },
      body: { en: 'Fifty-three days of siege: Mehmed II\'s great bombard — firing a 600-kilo stone ball a few times a day — did what a thousand years of enemies could not. Some 7,000 defenders under Constantine XI held six kilometres of wall against 80,000. Before dawn on 29 May the janissaries broke through at the battered Gate of St Romanus; the last emperor died fighting, and the Middle Ages, by one old convention, ended here.',
        gr: 'Πενήντα τρεις μέρες πολιορκίας: η μεγάλη βομβάρδα του Μωάμεθ Β΄ — που έριχνε πέτρινη μπάλα 600 κιλών λίγες φορές τη μέρα — έκανε ό,τι δεν μπόρεσαν χίλια χρόνια εχθρών. Περίπου 7.000 υπερασπιστές με τον Κωνσταντίνο ΙΑ΄ Παλαιολόγο κράτησαν έξι χιλιόμετρα τείχους απέναντι σε 80.000. Πριν το χάραμα της 29ης Μαΐου οι γενίτσαροι πέρασαν από τη ρημαγμένη Πύλη του Αγίου Ρωμανού· ο τελευταίος αυτοκράτορας έπεσε μαχόμενος — «Η Πόλις εάλω».' } },
    { id: 'seawalls', n: 11, at: [30, 96], view: [30, 148, 0, -0.5], viewY: 32, era: 1,
      title: { en: 'The Sea Walls', gr: 'Τα Παράλια Τείχη' },
      sub: { en: '439 — the ring closes', gr: '439 — ο δακτύλιος κλείνει' },
      body: { en: 'The land walls were only one side of the ring. From 439 the prefect Cyrus of Panopolis closed the rest: a single wall with towers hugging every metre of coast — along the Marmara, around the acropolis point, up the Golden Horn — nearly 14 km of sea defences on top of the 6 on land. The Marmara side hardly needed defending; its racing current and shoals wrecked landings by Arab fleets (674, 717) and the Rus (860, 941). The only gentle water was the Horn — which is exactly why it was chained (station 7), and why in 1204 the Venetians attacked there and nowhere else. By 1453 the sea walls had to be stripped almost bare to feed the land front: a handful of ships and a few hundred men watching fourteen kilometres of water. The City was a fortress with a single lock, and every enemy knew where it hung.',
        gr: 'Τα χερσαία τείχη ήταν μόνο η μία πλευρά του δακτυλίου. Από το 439 ο έπαρχος Κύρος ο Πανοπολίτης έκλεισε τα υπόλοιπα: μονό τείχος με πύργους που ακολουθούσε κάθε μέτρο ακτής — κατά μήκος του Μαρμαρά, γύρω από το ακρωτήρι, μέσα στον Κεράτιο — σχεδόν 14 χλμ. θαλάσσιας οχύρωσης πάνω στα 6 της στεριάς. Η πλευρά του Μαρμαρά σχεδόν δεν χρειαζόταν υπεράσπιση· το ορμητικό ρεύμα και οι ξέρες τσάκιζαν τις αποβάσεις Αράβων (674, 717) και Ρως (860, 941). Το μόνο ήμερο νερό ήταν ο Κεράτιος — γι\' αυτό ακριβώς αλυσοδενόταν (σταθμός 7), και γι\' αυτό το 1204 οι Βενετοί χτύπησαν εκεί και πουθενά αλλού. Ώς το 1453 τα παράλια τείχη γυμνώθηκαν σχεδόν τελείως για να κρατηθεί το χερσαίο μέτωπο: μια χούφτα πλοία και λίγες εκατοντάδες άντρες για δεκατέσσερα χιλιόμετρα νερού. Η Πόλη ήταν φρούριο με μία κλειδαριά — και κάθε εχθρός ήξερε πού κρεμόταν.' } }
  ]
};
