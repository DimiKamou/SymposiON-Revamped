// ============================================================
//  Χρονολόγιο — Epic Sequence Puzzle
//  Click Iliad / Odyssey events in chronological order
//  Presentation: "Night Gallery of the Epics" — museum-exhibit
//  plaques on a bronze timeline spine. Game logic unchanged.
// ============================================================

// ── DATA ──
const EP_PACKS = [
  {
    id: 'iliada', icon: '⚔️', name: 'Ιλιάδα', nameEn: 'Iliad',
    desc: 'Βάλε τα γεγονότα στη σωστή χρονολογική σειρά.',
    descEn: 'Place the events in the correct chronological order.',
    rounds: [
      {
        title: { gr: 'Ραψωδία Α — Η Μήνις', en: 'Book I — The Wrath' },
        events: [
          { gr: 'Ο ιερέας Χρύσης φτάνει με λύτρα για να εξαγοράσει την κόρη του.', en: 'The priest Chryses arrives with ransom to buy back his daughter.' },
          { gr: 'Ο Αγαμέμνων αρνείται τα λύτρα και διώχνει τον ιερέα με απειλές.', en: 'Agamemnon refuses the ransom and drives the priest away with threats.' },
          { gr: 'Ο Απόλλωνας στέλνει φοβερό λοιμό που θερίζει τους Αχαιούς.', en: 'Apollo sends a terrible plague that ravages the Achaean army.' },
          { gr: 'Ο Αχιλλέας καλεί συνέλευση και κατηγορεί τον Αγαμέμνωνα.', en: 'Achilles calls an assembly and accuses Agamemnon before the army.' },
          { gr: 'Ο Αγαμέμνων αφαιρεί τη Βρισηίδα από τον Αχιλλέα.', en: 'Agamemnon takes Briseis away from Achilles as compensation.' },
        ]
      },
      {
        title: { gr: 'Ραψωδίες Α–Β — Θεϊκή Βουλή', en: 'Books I–II — Divine Counsel' },
        events: [
          { gr: 'Η Θέτιδα ζητά από τον Δία να τιμήσει τον Αχιλλέα τιμωρώντας τους Αχαιούς.', en: 'Thetis asks Zeus to honour Achilles by punishing the Achaeans.' },
          { gr: 'Ο Δίας στέλνει ψεύτικο όνειρο στον Αγαμέμνωνα, υπόσχεση νίκης.', en: 'Zeus sends Agamemnon a deceptive dream promising imminent victory.' },
          { gr: 'Ο Αγαμέμνων δοκιμάζει το ηθικό του στρατού — εκείνοι τρέπονται σε φυγή.', en: 'Agamemnon tests troop morale — they rush headlong toward the ships.' },
          { gr: 'Ο Θερσίτης κατηγορεί τον Αγαμέμνωνα δημοσίως και τιμωρείται από τον Οδυσσέα.', en: 'Thersites publicly reproaches Agamemnon and is beaten by Odysseus.' },
          { gr: 'Ο Κατάλογος των Νηών παρουσιάζει όλες τις αχαϊκές δυνάμεις.', en: 'The Catalogue of Ships presents all the Achaean allied forces.' },
        ]
      },
      {
        title: { gr: 'Ραψωδία ΙΣΤ — Ο Πάτροκλος στη Μάχη', en: 'Book XVI — Patroclus in Battle' },
        events: [
          { gr: 'Ο Πάτροκλος παρακαλεί τον Αχιλλέα να τον αφήσει να πολεμήσει με την πανοπλία του.', en: 'Patroclus begs Achilles to let him fight wearing his famous armour.' },
          { gr: 'Ο Αχιλλέας συμφωνεί, αλλά τον προειδοποιεί να μη φτάσει ως τα τείχη.', en: 'Achilles agrees but sternly warns him not to advance to the walls.' },
          { gr: 'Ο Πάτροκλος σκορπά πανικό στους Τρώες και σκοτώνει τον Σαρπηδόνα.', en: 'Patroclus scatters the Trojans and kills the mighty Sarpedon.' },
          { gr: 'Ο Δίας ρίχνει αιματηρά δάκρυα για τον πεσόντα γιο του Σαρπηδόνα.', en: 'Zeus sheds tears of blood for his fallen son Sarpedon.' },
          { gr: 'Ο Έκτορας, βοηθούμενος από τον Απόλλωνα, σκοτώνει τον Πάτροκλο.', en: 'Hector, aided by Apollo, delivers the killing blow to Patroclus.' },
        ]
      },
      {
        title: { gr: 'Ραψωδίες ΙΗ–ΚΒ — Η Εκδίκηση', en: 'Books XVIII–XXII — The Revenge' },
        events: [
          { gr: 'Ο Αχιλλέας μαθαίνει τον θάνατο του Πάτροκλου και κλαίει απαρηγόρητα.', en: 'Achilles learns of Patroclus\'s death and weeps inconsolably.' },
          { gr: 'Η Θέτιδα πηγαίνει στον Ήφαιστο για να φτιάξει νέα θεϊκή πανοπλία.', en: 'Thetis travels to Hephaestus to commission new divine armour.' },
          { gr: 'Ο Ήφαιστος δημιουργεί την περίφημη ασπίδα του Αχιλλέα.', en: 'Hephaestus forges the magnificent shield of Achilles.' },
          { gr: 'Ο Αχιλλέας επιστρέφει στη μάχη σκορπώντας τρόμο στους Τρώες.', en: 'Achilles returns to battle, spreading terror among the Trojans.' },
          { gr: 'Ο Αχιλλέας σκοτώνει τον Έκτορα έξω από τα τείχη της Τροίας.', en: 'Achilles kills Hector in single combat outside the walls of Troy.' },
        ]
      },
      {
        title: { gr: 'Ραψωδία ΚΔ — Τα Λύτρα', en: 'Book XXIV — The Ransom' },
        events: [
          { gr: 'Ο Αχιλλέας σέρνει το σώμα του Έκτορα γύρω από τον τύμβο του Πάτροκλου.', en: 'Achilles drags Hector\'s body around the tomb of Patroclus.' },
          { gr: 'Ο Απόλλωνας προστατεύει θαυματουργά το σώμα από τη φθορά.', en: 'Apollo miraculously preserves the body from decay and disfigurement.' },
          { gr: 'Ο Δίας αποφασίζει ότι το σώμα πρέπει να επιστραφεί στον Πρίαμο.', en: 'Zeus decrees that the body must be returned to Priam with honour.' },
          { gr: 'Ο Ερμής οδηγεί κρυφά τον Πρίαμο με λύτρα στη σκηνή του Αχιλλέα.', en: 'Hermes secretly guides Priam with his ransom to Achilles\'s tent.' },
          { gr: 'Ο Πρίαμος γονατίζει μπροστά στον Αχιλλέα — εκείνος συγκινείται και αποδέχεται.', en: 'Priam kneels before Achilles — he is moved to tears and accepts the ransom.' },
        ]
      },
    ]
  },
  {
    id: 'odysseia', icon: '🌊', name: 'Οδύσσεια', nameEn: 'Odyssey',
    desc: 'Βάλε τα γεγονότα στη σωστή χρονολογική σειρά.',
    descEn: 'Place the events in the correct chronological order.',
    rounds: [
      {
        title: { gr: 'Ραψωδίες Α–Δ — Η Τηλεμάχεια', en: 'Books I–IV — The Telemachy' },
        events: [
          { gr: 'Η Αθηνά εμφανίζεται στον Τηλέμαχο ως Μέντης για να τον παρακινήσει.', en: 'Athena appears to Telemachus disguised as Mentes to encourage him.' },
          { gr: 'Ο Τηλέμαχος ζητά δημοσίως από τους μνηστήρες να φύγουν από το παλάτι.', en: 'Telemachus publicly demands the suitors leave the palace.' },
          { gr: 'Ο Τηλέμαχος ταξιδεύει στην Πύλο να ρωτήσει τον Νέστορα για τον Οδυσσέα.', en: 'Telemachus sails to Pylos to ask Nestor about his father.' },
          { gr: 'Ο Μενέλαος αφηγείται ότι ο Οδυσσέας βρίσκεται στο νησί της Καλυψούς.', en: 'Menelaus reveals that Odysseus is stranded on Calypso\'s island.' },
          { gr: 'Η Αθηνά πείθει τον Δία να στείλει τον Ερμή και να απελευθερώσει τον Οδυσσέα.', en: 'Athena persuades Zeus to send Hermes to free Odysseus at last.' },
        ]
      },
      {
        title: { gr: 'Ραψωδία Θ — Ο Κύκλωψ', en: 'Book IX — The Cyclops' },
        events: [
          { gr: 'Ο Οδυσσέας και οι σύντροφοί του εξερευνούν τη σπηλιά του Πολύφημου.', en: 'Odysseus and his men explore Polyphemus\'s enormous cave.' },
          { gr: 'Ο Πολύφημος επιστρέφει και σφραγίζει τους Έλληνες με έναν τεράστιο βράχο.', en: 'Polyphemus returns and seals the Greeks inside with a massive boulder.' },
          { gr: 'Ο Οδυσσέας λέει στον Κύκλωπα ότι τον λένε «Κανένας».', en: 'Odysseus cleverly tells the Cyclops his name is "Nobody."' },
          { gr: 'Ο Οδυσσέας μεθά τον Πολύφημο χαρίζοντάς του κρασί.', en: 'Odysseus intoxicates Polyphemus by offering him potent wine.' },
          { gr: 'Οι Έλληνες τυφλώνουν τον Κύκλωπα και δρα­πετεύουν κρεμαστοί στα πρόβατα.', en: 'The Greeks blind the Cyclops and escape clinging beneath the sheep.' },
        ]
      },
      {
        title: { gr: 'Ραψωδίες Κ–ΙΑ — Κίρκη & Νέκυια', en: 'Books X–XI — Circe & the Underworld' },
        events: [
          { gr: 'Η Κίρκη μεταμορφώνει τους συντρόφους του Οδυσσέα σε χοίρους.', en: 'Circe transforms Odysseus\'s companions into swine.' },
          { gr: 'Ο Ερμής δίνει στον Οδυσσέα το βότανο μώλυ για προστασία από τη μαγεία.', en: 'Hermes gives Odysseus the herb moly to protect him from Circe\'s magic.' },
          { gr: 'Ο Οδυσσέας αναγκάζει την Κίρκη να αποκαταστήσει τους φίλους του.', en: 'Odysseus forces Circe to restore his companions to human form.' },
          { gr: 'Η Κίρκη συμβουλεύει τον Οδυσσέα να κατεβεί στον Άδη να ρωτήσει τον Τειρεσία.', en: 'Circe advises Odysseus to descend to Hades to consult Tiresias.' },
          { gr: 'Ο Τειρεσίας αποκαλύπτει τη μοίρα και τα εμπόδια που τον περιμένουν.', en: 'Tiresias reveals the fate and trials that await Odysseus on his journey.' },
        ]
      },
      {
        title: { gr: 'Ραψωδία ΙΒ — Σειρήνες & Τέρατα', en: 'Book XII — Sirens & Monsters' },
        events: [
          { gr: 'Η Κίρκη προειδοποιεί τον Οδυσσέα για Σειρήνες, Σκύλλα και Χάρυβδη.', en: 'Circe warns Odysseus about the Sirens, Scylla and Charybdis.' },
          { gr: 'Ο Οδυσσέας βουλώνει τα αυτιά των συντρόφων με κερί μελισσών.', en: 'Odysseus seals his men\'s ears with beeswax.' },
          { gr: 'Ο Οδυσσέας δένεται στον ιστό για να ακούσει τη μαγική φωνή των Σειρήνων.', en: 'Odysseus ties himself to the mast so he can hear the Sirens\' enchanting song.' },
          { gr: 'Το πλοίο πλέει ανάμεσα από τη Σκύλλα και τη Χάρυβδη.', en: 'The ship navigates the narrow strait between Scylla and Charybdis.' },
          { gr: 'Η εξαπλόκεφαλη Σκύλλα αρπάζει έξι από τους συντρόφους.', en: 'The six-headed Scylla snatches six of Odysseus\'s men from the ship.' },
        ]
      },
      {
        title: { gr: 'Ραψωδίες ΙΖ–ΚΒ — Η Επιστροφή', en: 'Books XVII–XXII — The Return' },
        events: [
          { gr: 'Ο Οδυσσέας φτάνει στο παλάτι της Ιθάκης μεταμφιεσμένος ως ζητιάνος.', en: 'Odysseus arrives at his own palace disguised as a beggar.' },
          { gr: 'Ο γηραιός σκύλος Άργος αναγνωρίζει τον αφέντη του και ξεψυχά από χαρά.', en: 'The aged dog Argos recognizes his master and dies of joy.' },
          { gr: 'Ο Οδυσσέας αποκαλύπτει την ταυτότητά του στον γιο του Τηλέμαχο.', en: 'Odysseus reveals his true identity to his son Telemachus.' },
          { gr: 'Η Πηνελόπη ανακοινώνει τον διαγωνισμό: όποιος τεντώσει το τόξο θα τη νυμφευθεί.', en: 'Penelope announces the contest: whoever strings the bow shall marry her.' },
          { gr: 'Ο Οδυσσέας τεντώνει το τόξο μόνος και σκοτώνει όλους τους μνηστήρες.', en: 'Odysseus alone strings the bow and slaughters all the suitors.' },
        ]
      },
    ]
  },
];

// ── STATE ──
let _ep = { pack: null, packIdx: 0, round: 0, shuffled: [], placed: [], score: 0, phase: 'play', lang: 'gr' };

// ── OPEN / CLOSE ──
window.openEpicPuzzle = function (packId) {
  const ov = document.getElementById('epic-puzzle-overlay');
  if (!ov) return;
  ov.classList.add('active');
  document.body.style.overflow = 'hidden';
  _ep.lang = window.siteLang || 'gr';
  if (!document.getElementById('ep-screen-menu')) _epBuild();
  _epAmbientStart();
  _ep.score = 0; _ep.round = 0; _ep.pack = null; _ep.phase = 'play';
  if (packId) {
    const idx = EP_PACKS.findIndex(p => p.id === packId);
    if (idx !== -1) {
      _ep.pack = EP_PACKS[idx];
      _ep.packIdx = idx;
      _epStartRound();
      return;
    }
  }
  _epPopulateMenu();
  _epShowScreen('menu');
};

window.closeEpicPuzzle = function () {
  const ov = document.getElementById('epic-puzzle-overlay');
  if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
  _epAmbientStop();
};

// ── BUILD SHELL ──
function _epBuild() {
  const wrap = document.getElementById('ep-wrap');
  if (!wrap) return;
  wrap.innerHTML = `
<div id="ep-screen-menu" class="ep-screen">
  <div class="ep-kicker" id="ep-menu-kicker">ΑΙΘΟΥΣΑ ΤΩΝ ΕΠΩΝ</div>
  <div class="ep-title" aria-label="Χρονολόγιο"><span aria-hidden="true">${_epKinetic('Χρονολόγιο')}</span></div>
  <div class="ep-meander" aria-hidden="true">${_epMeander(7)}</div>
  <div class="ep-subtitle" id="ep-menu-sub">ΕΠΙΛΕΞΕ ΕΚΘΕΜΑ</div>
  <div class="ep-pack-grid" id="ep-pack-grid"></div>
</div>
<div id="ep-screen-game" class="ep-screen">
  <div class="ep-game-top">
    <div class="ep-round-badge" id="ep-round-badge"></div>
    <div class="ep-round-title" id="ep-round-title"></div>
    <div class="ep-score-badge" id="ep-score-badge"></div>
  </div>
  <div class="ep-progress-row" id="ep-progress-row"></div>
  <div class="ep-instruction" id="ep-instruction"></div>
  <div class="ep-slot-rail" id="ep-slot-rail" aria-hidden="true"></div>
  <div class="ep-cards" id="ep-cards"></div>
  <div class="ep-actions" id="ep-actions"></div>
</div>
<div id="ep-screen-end" class="ep-screen">
  <div class="ep-end-plaque">
    <div class="ep-end-kicker" id="ep-end-kicker"></div>
    <div class="ep-end-medal">
      <div class="ep-end-icon" id="ep-end-icon"></div>
      <div class="ep-end-score" id="ep-end-score"></div>
    </div>
    <div class="ep-end-title" id="ep-end-title"></div>
    <div class="ep-end-stars" id="ep-end-stars"></div>
    <div class="ep-meander ep-meander-sm" aria-hidden="true">${_epMeander(5)}</div>
    <div class="ep-end-btns" id="ep-end-btns"></div>
  </div>
</div>`;
  _epBindFx(wrap);
  _epPopulateMenu();
}

// ── MENU ──
function _epPopulateMenu() {
  const grid = document.getElementById('ep-pack-grid');
  if (!grid) return;
  const l = _ep.lang;
  const kicker = document.getElementById('ep-menu-kicker');
  if (kicker) kicker.textContent = l === 'en' ? 'HALL OF THE EPICS' : 'ΑΙΘΟΥΣΑ ΤΩΝ ΕΠΩΝ';
  const sub = document.getElementById('ep-menu-sub');
  if (sub) sub.textContent = l === 'en' ? 'CHOOSE AN EXHIBIT' : 'ΕΠΙΛΕΞΕ ΕΚΘΕΜΑ';
  const tags = l === 'en' ? ['I', 'II', 'III', 'IV'] : ['Α', 'Β', 'Γ', 'Δ'];
  grid.innerHTML = EP_PACKS.map((p, i) => `
    <div class="ep-pack-card" onclick="_epSelectPack(${i})" style="--ep-d:${i * 120}ms">
      <div class="ep-pack-tag">${l === 'en' ? 'Exhibit' : 'Έκθεμα'} ${tags[i] || (i + 1)}</div>
      <div class="ep-pack-icon">${_epPackIcon(p.id)}</div>
      <div class="ep-pack-name">${l === 'en' ? p.nameEn : p.name}</div>
      <div class="ep-pack-desc">${l === 'en' ? p.descEn : p.desc}</div>
      <div class="ep-pack-meta">${p.rounds.length} ${l === 'en' ? 'rounds · 5 events each' : 'γύροι · 5 γεγονότα'}</div>
    </div>`).join('');
}

window._epSelectPack = function (idx) {
  _ep.pack = EP_PACKS[idx];
  _ep.packIdx = idx;
  _ep.score = 0;
  _ep.round = 0;
  _epStartRound();
};

// ── ROUND START ──
function _epStartRound() {
  const pack = _ep.pack;
  const round = pack.rounds[_ep.round];
  const l = _ep.lang;

  // Fisher-Yates shuffle of indices [0,1,2,3,4]
  // shuffled[displayIdx] = correctIdx
  const indices = [0, 1, 2, 3, 4];
  _ep.shuffled = _epShuffle(indices);
  _ep.placed = [];
  _ep.phase = 'play';

  // Scroll to top
  const wrap = document.getElementById('ep-wrap');
  if (wrap) wrap.scrollTop = 0;

  // Header
  document.getElementById('ep-round-badge').textContent =
    (l === 'en' ? 'Round ' : 'Γύρος ') + (_ep.round + 1) + '/' + pack.rounds.length;
  document.getElementById('ep-round-title').textContent =
    l === 'en' ? round.title.en : round.title.gr;
  document.getElementById('ep-score-badge').textContent = _ep.score + ' pts';

  // Progress dots
  _epRenderDots();

  // Timeline slot frieze (presentation only)
  _epRenderSlots();

  // Instruction
  document.getElementById('ep-instruction').textContent =
    l === 'en'
      ? 'Click events in chronological order — 1st to 5th'
      : 'Κλίκαρε τα γεγονότα από το 1ο έως το 5ο κατά χρονολογική σειρά';

  _epRenderCards(round.events);
  _epRenderActions();
  _epShowScreen('game');
}

// ── PROGRESS DOTS ──
function _epRenderDots() {
  const row = document.getElementById('ep-progress-row');
  if (!row) return;
  const n = _ep.pack.rounds.length;
  row.innerHTML = Array.from({ length: n }, (_, i) => {
    const cls = i < _ep.round ? 'ep-dot ep-dot-done'
               : i === _ep.round ? 'ep-dot ep-dot-active'
               : 'ep-dot';
    return `<span class="${cls}"></span>`;
  }).join('');
}

// ── CARDS ──
function _epRenderCards(events) {
  const grid = document.getElementById('ep-cards');
  if (!grid) return;
  const l = _ep.lang;
  grid.innerHTML = _ep.shuffled.map((correctIdx, displayIdx) => {
    const ev = events[correctIdx];
    const text = l === 'en' ? ev.en : ev.gr;
    return `
      <div class="ep-card" id="ep-card-${displayIdx}" onclick="_epClickCard(${displayIdx})">
        <div class="ep-card-num" id="ep-card-num-${displayIdx}">?</div>
        <div class="ep-card-text">${text}</div>
      </div>`;
  }).join('');
}

window._epClickCard = function (displayIdx) {
  if (_ep.phase === 'result') return;
  const pos = _ep.placed.indexOf(displayIdx);
  const placing = pos === -1;
  if (!placing) {
    _ep.placed.splice(pos, 1); // deselect
  } else {
    _ep.placed.push(displayIdx); // select next slot
  }
  _epUpdateNums();
  _epRenderActions();
  // Presentation only: seal-stamp pop + spark burst on placement
  if (placing) {
    const num = document.getElementById('ep-card-num-' + displayIdx);
    if (num) {
      num.classList.remove('ep-stamp');
      void num.offsetWidth;
      num.classList.add('ep-stamp');
      _epBurst(num, ['#E8C97A', '#C9A44A', '#9C7433'], 8);
    }
    // stamp the matching frieze slot
    const slot = document.getElementById('ep-slot-' + (_ep.placed.length - 1));
    if (slot) {
      slot.classList.remove('ep-slot-stamp');
      void slot.offsetWidth;
      slot.classList.add('ep-slot-stamp');
    }
  } else {
    // deselected while pointer still hovers → restore the ghost preview
    const card = document.getElementById('ep-card-' + displayIdx);
    const num = document.getElementById('ep-card-num-' + displayIdx);
    if (card && num && card.matches && card.matches(':hover')) {
      num.textContent = _ep.placed.length + 1;
      num.classList.add('ep-num-ghost');
    }
  }
};

function _epUpdateNums() {
  for (let d = 0; d < 5; d++) {
    const numEl = document.getElementById('ep-card-num-' + d);
    const card  = document.getElementById('ep-card-' + d);
    if (!numEl || !card) continue;
    numEl.classList.remove('ep-num-ghost');
    const pos = _ep.placed.indexOf(d);
    if (pos !== -1) {
      numEl.textContent = pos + 1;
      numEl.classList.add('ep-num-placed');
      card.classList.add('ep-card-placed');
    } else {
      numEl.textContent = '?';
      numEl.classList.remove('ep-num-placed');
      card.classList.remove('ep-card-placed');
    }
  }
  // frieze slots fill in step with placements
  for (let i = 0; i < 5; i++) {
    const slot = document.getElementById('ep-slot-' + i);
    if (!slot) continue;
    slot.classList.toggle('ep-slot-filled', i < _ep.placed.length);
  }
}

function _epRenderActions() {
  const actions = document.getElementById('ep-actions');
  if (!actions) return;
  const l = _ep.lang;
  const allPlaced = _ep.placed.length === 5;
  if (allPlaced) {
    actions.innerHTML = `<button class="ep-check-btn" onclick="_epCheck()"><span>${l === 'en' ? '✓ Check Order' : '✓ Ελέγξτε τη Σειρά'}</span></button>`;
  } else {
    const rem = 5 - _ep.placed.length;
    actions.innerHTML = `<div class="ep-hint">${rem === 5 ? (l === 'en' ? 'Click the first event' : 'Κλίκαρε το πρώτο γεγονός') : rem + ' ' + (l === 'en' ? 'more' : 'ακόμα')}</div>`;
  }
}

// ── CHECK ──
window._epCheck = function () {
  _ep.phase = 'result';
  const pack  = _ep.pack;
  const round = pack.rounds[_ep.round];
  const l = _ep.lang;

  let correct = 0;
  const results = _ep.placed.map((displayIdx, position) => {
    const correctIdx = _ep.shuffled[displayIdx];
    const ok = correctIdx === position;
    if (ok) correct++;
    return { displayIdx, correctIdx, position, ok };
  });

  const pts = correct * 2 + (correct === 5 ? 4 : 0);
  _ep.score += pts;

  // Rebuild cards sorted by player's order, with ✓/✗
  const grid = document.getElementById('ep-cards');
  grid.innerHTML = results.map(r => {
    const ev   = round.events[_ep.shuffled[r.displayIdx]];
    const text = l === 'en' ? ev.en : ev.gr;
    const correctPos = r.correctIdx + 1;
    const wrongNote  = r.ok ? '' : `<div class="ep-card-note">${l === 'en' ? 'Correct: ' + _epOrdinal(correctPos, 'en') : 'Σωστά: ' + correctPos + 'ο'}</div>`;
    return `
      <div class="ep-card ${r.ok ? 'ep-card-correct' : 'ep-card-wrong'}">
        <div class="ep-card-num ${r.ok ? 'ep-num-correct' : 'ep-num-wrong'}">${r.position + 1}</div>
        <div class="ep-card-body">
          <div class="ep-card-text">${text}</div>
          ${wrongNote}
        </div>
        <div class="ep-card-verdict">${r.ok ? '✓' : '✗'}</div>
      </div>`;
  }).join('');

  // Actions
  const isLast = _ep.round + 1 >= pack.rounds.length;
  const nextLabel = isLast
    ? (l === 'en' ? 'See Results →' : 'Αποτελέσματα →')
    : (l === 'en' ? 'Next Round →' : 'Επόμενος Γύρος →');
  const ptsTail = l === 'en'
    ? ` / 14 pts this round`
    : ` / 14 πόντοι σε αυτόν τον γύρο`;

  document.getElementById('ep-actions').innerHTML = `
    <div class="ep-round-pts"><span class="ep-pts-num" id="ep-pts-num">0</span>${ptsTail} <span class="ep-total-sep">·</span> <span class="ep-total-pts">${l === 'en' ? 'Total' : 'Σύνολο'}: <span id="ep-total-num">${_ep.score - pts}</span></span></div>
    <button class="ep-next-btn" onclick="_epNext()">${nextLabel}</button>`;

  // Presentation only: frieze verdicts, curator light-sweep, count-ups + celebration
  results.forEach(r => {
    const s = document.getElementById('ep-slot-' + r.position);
    if (!s) return;
    s.style.transitionDelay = (0.08 + r.position * 0.11).toFixed(2) + 's';
    s.classList.remove('ep-slot-filled');
    s.classList.add(r.ok ? 'ep-slot-ok' : 'ep-slot-bad');
  });
  _epSweep();
  _epCountUp(document.getElementById('ep-pts-num'), 0, pts, '', 700);
  _epCountUp(document.getElementById('ep-total-num'), _ep.score - pts, _ep.score, '', 900);
  _epCountUp(document.getElementById('ep-score-badge'), _ep.score - pts, _ep.score, ' pts', 900);
  if (correct === 5) {
    _epConfetti(26);
    const title = document.getElementById('ep-round-title');
    if (title) { title.classList.remove('ep-flash'); void title.offsetWidth; title.classList.add('ep-flash'); }
  }
};

function _epOrdinal(n, lang) {
  if (lang !== 'en') return n + 'ο';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

// ── NEXT ROUND ──
window._epNext = function () {
  _ep.round++;
  _ep.phase = 'play';
  if (_ep.round >= _ep.pack.rounds.length) {
    _epShowEnd();
  } else {
    _epStartRound();
  }
};

// ── END SCREEN ──
function _epShowEnd() {
  const l = _ep.lang;
  const maxScore = _ep.pack.rounds.length * 14;
  const pct   = _ep.score / maxScore;
  const stars = pct >= 0.8 ? 3 : pct >= 0.5 ? 2 : pct >= 0.2 ? 1 : 0;

  document.getElementById('ep-end-icon').innerHTML = _epWreath(stars);

  const endKicker = document.getElementById('ep-end-kicker');
  if (endKicker) endKicker.textContent = l === 'en' ? 'THE TOUR IS COMPLETE' : 'Η ΠΕΡΙΗΓΗΣΗ ΟΛΟΚΛΗΡΩΘΗΚΕ';

  const endTitleText =
    pct >= 0.8 ? (l === 'en' ? 'Excellent!' : 'Εξαιρετικό!') :
    pct >= 0.5 ? (l === 'en' ? 'Well done!'  : 'Μπράβο!') :
                 (l === 'en' ? 'Keep practicing!' : 'Συνέχισε την εξάσκηση!');
  const endTitleEl = document.getElementById('ep-end-title');
  endTitleEl.setAttribute('aria-label', endTitleText);
  endTitleEl.innerHTML = `<span aria-hidden="true">${_epKinetic(endTitleText)}</span>`;

  document.getElementById('ep-end-score').innerHTML =
    `<span class="ep-final-num" id="ep-final-num">0</span><span class="ep-final-max"> / ${maxScore}</span>`;

  document.getElementById('ep-end-stars').innerHTML =
    Array.from({ length: 3 }, (_, i) =>
      `<span class="ep-star ${i < stars ? '' : 'ep-star-empty'}" style="--ep-d:${400 + i * 220}ms">✦</span>`
    ).join('');

  document.getElementById('ep-end-btns').innerHTML = `
    <button class="ep-btn ep-btn-primary" onclick="_epSelectPack(${_ep.packIdx})">${l === 'en' ? '▶ Play Again' : '▶ Παίξε Ξανά'}</button>
    <button class="ep-btn" onclick="_epShowScreen('menu')">${l === 'en' ? '← Menu' : '← Μενού'}</button>`;

  const wrap = document.getElementById('ep-wrap');
  if (wrap) wrap.scrollTop = 0;
  if(typeof awardGameRewards==='function' && _ep.score > 0){ awardGameRewards('epic-puzzle', { score: _ep.score, perfect: _ep.score === maxScore }); }
  _epShowScreen('end');
  _epCountUp(document.getElementById('ep-final-num'), 0, _ep.score, '', 1200);
  if (stars === 3) _epConfetti(34);
}

// ── SCREENS ──
function _epShowScreen(name) {
  document.querySelectorAll('.ep-screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('ep-screen-' + name);
  if (el) el.classList.add('active');
}

// ── LANG SYNC ──
window._epSetLang = function (l) { _ep.lang = l; };

// ── UTILITY ──
function _epShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ════════════════════════════════════════════════════════════
//  PRESENTATION LAYER — decorative SVG, ambience, particles.
//  Nothing below affects game rules, scoring or data.
// ════════════════════════════════════════════════════════════

function _epReduced() {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch (_) { return false; }
}

// Low-power heuristic (mid/low-end phones): fewer dust motes + a lower DPR cap
// for the ambient canvas. Presentation only — never touches puzzle content.
function _epLite() {
  try {
    return (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) ||
           window.innerWidth < 720 || (navigator.deviceMemory || 8) <= 4;
  } catch (_) { return false; }
}

// Kinetic typography — staggered letter spans grouped in non-wrapping words.
function _epKinetic(text) {
  let i = 0;
  return String(text).split(' ').map(word =>
    `<span class="ep-t-w">${word.split('').map(c =>
      `<span class="ep-t-ch" style="--ep-i:${i++}">${c}</span>`).join('')}</span>`
  ).join(' ');
}

// Timeline frieze — five numbered marble slots that fill as events are sequenced.
function _epRenderSlots() {
  const rail = document.getElementById('ep-slot-rail');
  if (!rail) return;
  const nums = _ep.lang === 'en' ? ['I', 'II', 'III', 'IV', 'V'] : ['Α', 'Β', 'Γ', 'Δ', 'Ε'];
  rail.innerHTML = nums.map((n, i) =>
    `<span class="ep-slot" id="ep-slot-${i}" style="--ep-sd:${i * 60}ms"><span class="ep-slot-num">${n}</span></span>`
  ).join('<span class="ep-slot-link"></span>');
}

// Pointer-driven plaque tilt + ghost "next seal" preview (event delegation,
// survives every innerHTML re-render; presentation only).
function _epBindFx(wrap) {
  if (wrap._epFxBound) return;
  wrap._epFxBound = true;

  wrap.addEventListener('pointermove', (e) => {
    if (_epReduced()) return;
    const card = e.target.closest && e.target.closest('.ep-card, .ep-pack-card');
    if (!card || card.classList.contains('ep-card-correct') || card.classList.contains('ep-card-wrong')) return;
    const big = card.classList.contains('ep-pack-card');
    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    card.classList.add('ep-tilt');
    card.style.setProperty('--ep-rx', (-ny * (big ? 5 : 2.4)).toFixed(2) + 'deg');
    card.style.setProperty('--ep-ry', (nx * (big ? 6 : 2.0)).toFixed(2) + 'deg');
  });

  wrap.addEventListener('pointerover', (e) => {
    if (_ep.phase !== 'play') return;
    const card = e.target.closest && e.target.closest('.ep-card');
    if (!card || !card.id || card.id.indexOf('ep-card-') !== 0) return;
    const d = parseInt(card.id.slice(8), 10);
    if (isNaN(d) || _ep.placed.indexOf(d) !== -1) return;
    const num = document.getElementById('ep-card-num-' + d);
    if (num) { num.textContent = _ep.placed.length + 1; num.classList.add('ep-num-ghost'); }
  });

  wrap.addEventListener('pointerout', (e) => {
    const card = e.target.closest && e.target.closest('.ep-card, .ep-pack-card');
    if (!card || (e.relatedTarget && card.contains(e.relatedTarget))) return;
    card.classList.remove('ep-tilt');
    card.style.removeProperty('--ep-rx');
    card.style.removeProperty('--ep-ry');
    if (card.id && card.id.indexOf('ep-card-') === 0) {
      const d = parseInt(card.id.slice(8), 10);
      if (!isNaN(d) && _ep.placed.indexOf(d) === -1) {
        const num = document.getElementById('ep-card-num-' + d);
        if (num) { num.textContent = '?'; num.classList.remove('ep-num-ghost'); }
      }
    }
  });
}

// Curator light-sweep down the plaques on the reveal cascade.
function _epSweep() {
  if (_epReduced()) return;
  const fx = document.getElementById('ep-fx');
  const stage = document.getElementById('ep-stage');
  const cards = document.getElementById('ep-cards');
  if (!fx || !stage || !cards) return;
  const s = stage.getBoundingClientRect();
  const c = cards.getBoundingClientRect();
  const bar = document.createElement('div');
  bar.className = 'ep-sweepline';
  bar.style.left = (c.left - s.left) + 'px';
  bar.style.width = c.width + 'px';
  bar.style.top = (c.top - s.top) + 'px';
  fx.appendChild(bar);
  if (!bar.animate) { bar.remove(); return; }
  const anim = bar.animate([
    { transform: 'translateY(-14px)', opacity: 0 },
    { opacity: 0.85, offset: 0.22 },
    { transform: `translateY(${Math.max(60, c.height).toFixed(0)}px)`, opacity: 0 }
  ], { duration: 720, easing: 'cubic-bezier(.3,.1,.3,1)' });
  anim.onfinish = () => bar.remove();
  setTimeout(() => { if (bar.parentNode) bar.remove(); }, 1400);
}

// Greek-key (meander) divider — n key units, stroked gold.
function _epMeander(n) {
  let d = '';
  for (let i = 0; i < n; i++) {
    const x = i * 19;
    d += `M${x} 15 V1 H${x + 14} V10 H${x + 5} V6 H${x + 10} `;
  }
  const w = n * 19 - 5;
  return `<svg viewBox="0 0 ${w} 16" width="${w}" height="16" xmlns="http://www.w3.org/2000/svg"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>`;
}

// Black-figure pottery medallions for the pack cards.
function _epPackIcon(id) {
  const disc = `
    <defs>
      <radialGradient id="ep-terra-${id}" cx="42%" cy="36%" r="75%">
        <stop offset="0%" stop-color="#B85A32"/>
        <stop offset="55%" stop-color="#9C4526"/>
        <stop offset="100%" stop-color="#6E2E18"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="47" fill="url(#ep-terra-${id})"/>
    <circle cx="50" cy="50" r="47" fill="none" stroke="#E0B25F" stroke-width="1.6" opacity="0.85"/>
    <circle cx="50" cy="50" r="41.5" fill="none" stroke="#20150C" stroke-width="1.4" opacity="0.7"/>`;
  if (id === 'iliada') {
    // Corinthian helmet, front-facing, black-figure silhouette + crossed spears
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${disc}
      <g stroke="#20150C" stroke-width="2.4" stroke-linecap="round" opacity="0.9">
        <line x1="24" y1="76" x2="76" y2="24"/><line x1="24" y1="24" x2="76" y2="76"/>
      </g>
      <path d="M76 24 l6 -6 l-2 8 l-6 0 z M24 76 l-6 6 l2 -8 z" fill="#20150C"/>
      <path d="M50 20 C36 20 29 30 29 42 L29 70 C29 73 31.5 74 33.5 72.5 L41 66.5 L41 48 C41 45.6 43.4 45 44.4 47 L47 53.5 L48.6 53.5 L48.6 42.5 C48.6 40.8 51.4 40.8 51.4 42.5 L51.4 53.5 L53 53.5 L55.6 47 C56.6 45 59 45.6 59 48 L59 66.5 L66.5 72.5 C68.5 74 71 73 71 70 L71 42 C71 30 64 20 50 20 Z" fill="#20150C"/>
      <path d="M50 14 C41 14 35 17.5 32.5 21.5 C38 18.5 43.5 17.4 50 17.4 C56.5 17.4 62 18.5 67.5 21.5 C65 17.5 59 14 50 14 Z" fill="#20150C" opacity="0.85"/>
    </svg>`;
  }
  // Odyssey: black-figure ship with sail and oars over a wave band
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${disc}
    <g fill="#20150C">
      <path d="M24 60 C32 66 68 66 78 58 L74 66 C66 72 36 72 28 66 Z"/>
      <path d="M24 60 L20 52 C22 56 26 58 30 59 Z"/>
      <path d="M78 58 L84 46 C82 52 80 55 76 57 Z"/>
      <rect x="49" y="26" width="2.6" height="34" rx="1"/>
      <path d="M52 28 C63 30 68 36 69 44 L52 44 Z"/>
      <path d="M48 28 C39 30 34 35 33 43 L48 43 Z" opacity="0.92"/>
    </g>
    <g stroke="#20150C" stroke-width="2" stroke-linecap="round">
      <line x1="34" y1="63" x2="30" y2="72"/><line x1="44" y1="65" x2="41" y2="74"/>
      <line x1="56" y1="65" x2="54" y2="74"/><line x1="66" y1="63" x2="65" y2="72"/>
    </g>
    <path d="M22 79 q4 -4 8 0 t8 0 t8 0 t8 0 t8 0 t8 0 t8 0" fill="none" stroke="#20150C" stroke-width="2" opacity="0.8"/>
  </svg>`;
}

// Laurel wreath for the end screen; fuller + brighter with more stars.
function _epWreath(stars) {
  const cx = 100, cy = 92, R = 74;
  const tone = stars >= 3 ? '#E3C06A' : stars >= 2 ? '#C9A44A' : '#96803F';
  let leaves = '';
  let li = 0;
  [-1, 1].forEach(side => {
    for (let i = 0; i < 10; i++) {
      const t = i / 9;
      const aDeg = 90 + side * (26 + 122 * t);
      const a = aDeg * Math.PI / 180;
      const lx = cx + R * Math.cos(a);
      const ly = cy + R * Math.sin(a);
      const rot = aDeg + 90 + side * 28;
      const len = 15 - 5 * t;
      const wid = 5.2 - 1.6 * t;
      const op = 0.55 + 0.45 * (1 - t * 0.5);
      leaves += `<ellipse class="ep-leaf" style="animation-delay:${120 + li * 46}ms" cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" rx="${len.toFixed(1)}" ry="${wid.toFixed(1)}" transform="rotate(${rot.toFixed(1)} ${lx.toFixed(1)} ${ly.toFixed(1)})" fill="${tone}" opacity="${op.toFixed(2)}"/>`;
      if (i % 3 === 1) {
        const bx = cx + (R - 9) * Math.cos(a), by = cy + (R - 9) * Math.sin(a);
        leaves += `<circle class="ep-leaf" style="animation-delay:${160 + li * 46}ms" cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="2.1" fill="${tone}" opacity="0.75"/>`;
      }
      li++;
    }
  });
  return `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M ${cx - R * Math.sin(0.45)} ${cy + R * Math.cos(0.45)} A ${R} ${R} 0 1 1 ${cx + R * Math.sin(0.45)} ${cy + R * Math.cos(0.45)}"
          fill="none" stroke="${tone}" stroke-width="2" opacity="0.45"/>
    ${leaves}
  </svg>`;
}

// ── Ambient dust motes + hall parallax (canvas, reduced-motion aware) ──
const _epAmb = { on: false, raf: 0, motes: [], resize: null, parallax: null };

function _epAmbientStart() {
  if (_epAmb.on) return;
  const cv = document.getElementById('ep-dust');
  const stage = document.getElementById('ep-stage');
  if (!cv || !stage || _epReduced()) return;
  const ctx = cv.getContext('2d');
  if (!ctx) return;
  _epAmb.on = true;

  const _lite = _epLite();
  function size() {
    const d = Math.min(window.devicePixelRatio || 1, _lite ? 1.5 : 2);
    cv.width = Math.max(1, stage.clientWidth * d);
    cv.height = Math.max(1, stage.clientHeight * d);
    ctx.setTransform(d, 0, 0, d, 0, 0);
  }
  size();
  _epAmb.resize = size;
  window.addEventListener('resize', size);

  // gentle spotlight parallax following the pointer
  const parallax = (e) => {
    const r = stage.getBoundingClientRect();
    if (!r.width || !r.height) return;
    stage.style.setProperty('--ep-px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
    stage.style.setProperty('--ep-py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
  };
  stage.addEventListener('pointermove', parallax);
  _epAmb.parallax = parallax;

  if (!_epAmb.motes.length) {
    const _moteN = _lite ? 24 : 46;
    for (let i = 0; i < _moteN; i++) {
      _epAmb.motes.push({
        x: Math.random(), y: Math.random(),
        r: 0.5 + Math.random() * 1.5,
        vx: (Math.random() - 0.5) * 0.045,
        vy: -(0.015 + Math.random() * 0.05),
        p: Math.random() * Math.PI * 2,
        ps: 0.4 + Math.random() * 0.9
      });
    }
  }

  function frame(t) {
    if (!_epAmb.on) return;
    const w = stage.clientWidth, h = stage.clientHeight;
    ctx.clearRect(0, 0, w, h);
    for (const m of _epAmb.motes) {
      m.x += m.vx / 100; m.y += m.vy / 100;
      if (m.y < -0.02) { m.y = 1.02; m.x = Math.random(); }
      if (m.x < -0.02) m.x = 1.02;
      if (m.x > 1.02) m.x = -0.02;
      const tw = 0.5 + 0.5 * Math.sin(m.p + t * 0.001 * m.ps);
      // brighter inside the central spotlight pool
      const cxd = Math.abs(m.x - 0.5) * 2;
      const a = (0.05 + 0.16 * tw) * (1 - cxd * 0.55) * (1 - m.y * 0.35);
      if (a <= 0.005) continue;
      ctx.beginPath();
      ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(236, 213, 158,' + a.toFixed(3) + ')';
      ctx.fill();
    }
    _epAmb.raf = requestAnimationFrame(frame);
  }
  _epAmb.raf = requestAnimationFrame(frame);
}

function _epAmbientStop() {
  _epAmb.on = false;
  if (_epAmb.raf) cancelAnimationFrame(_epAmb.raf);
  _epAmb.raf = 0;
  if (_epAmb.resize) { window.removeEventListener('resize', _epAmb.resize); _epAmb.resize = null; }
  const stage = document.getElementById('ep-stage');
  if (_epAmb.parallax) {
    if (stage) stage.removeEventListener('pointermove', _epAmb.parallax);
    _epAmb.parallax = null;
  }
  if (stage) { stage.style.removeProperty('--ep-px'); stage.style.removeProperty('--ep-py'); }
  const cv = document.getElementById('ep-dust');
  if (cv) { const c = cv.getContext('2d'); if (c) c.clearRect(0, 0, cv.width, cv.height); }
}

// ── Spark burst at an element (Web Animations API) ──
function _epBurst(el, colors, count) {
  if (_epReduced()) return;
  const fx = document.getElementById('ep-fx');
  const stage = document.getElementById('ep-stage');
  if (!fx || !stage || !el || !el.getBoundingClientRect) return;
  const r = el.getBoundingClientRect();
  const s = stage.getBoundingClientRect();
  const cx = r.left + r.width / 2 - s.left;
  const cy = r.top + r.height / 2 - s.top;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'ep-spark';
    p.style.left = cx + 'px';
    p.style.top = cy + 'px';
    p.style.background = colors[i % colors.length];
    fx.appendChild(p);
    if (!p.animate) { p.remove(); continue; }
    const ang = Math.random() * Math.PI * 2;
    const dist = 16 + Math.random() * 32;
    const anim = p.animate([
      { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${(Math.cos(ang) * dist).toFixed(1)}px), calc(-50% + ${(Math.sin(ang) * dist - 8).toFixed(1)}px)) scale(0.15)`, opacity: 0 }
    ], { duration: 420 + Math.random() * 280, easing: 'cubic-bezier(.15,.85,.4,1)' });
    anim.onfinish = () => p.remove();
    setTimeout(() => { if (p.parentNode) p.remove(); }, 900);
  }
}

// ── Gold-leaf confetti fall across the stage ──
function _epConfetti(count) {
  if (_epReduced()) return;
  const fx = document.getElementById('ep-fx');
  const stage = document.getElementById('ep-stage');
  if (!fx || !stage) return;
  const w = stage.clientWidth, h = stage.clientHeight;
  const colors = ['#E8C97A', '#C9A44A', '#7C9A62', '#B85A32', '#EFE6D4'];
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'ep-confetti';
    const x = Math.random() * w;
    p.style.left = x + 'px';
    p.style.top = '-14px';
    p.style.background = colors[i % colors.length];
    if (i % 3 === 0) p.style.borderRadius = '50% 0 50% 50%'; // leaf-ish
    fx.appendChild(p);
    if (!p.animate) { p.remove(); continue; }
    const drift = (Math.random() - 0.5) * 120;
    const fall = h * (0.55 + Math.random() * 0.45);
    const rot = (Math.random() - 0.5) * 720;
    const dur = 1300 + Math.random() * 900;
    const anim = p.animate([
      { transform: 'translate(0,0) rotate(0deg)', opacity: 1 },
      { transform: `translate(${drift.toFixed(0)}px, ${fall.toFixed(0)}px) rotate(${rot.toFixed(0)}deg)`, opacity: 0 }
    ], { duration: dur, delay: Math.random() * 240, easing: 'cubic-bezier(.3,.05,.6,1)', fill: 'forwards' });
    anim.onfinish = () => p.remove();
    setTimeout(() => { if (p.parentNode) p.remove(); }, 2800);
  }
}

// ── Numeric count-up (falls back to instant when reduced motion) ──
function _epCountUp(el, from, to, suffix, dur) {
  if (!el) return;
  if (_epReduced() || !window.requestAnimationFrame || from === to) {
    el.textContent = to + suffix;
    return;
  }
  const t0 = performance.now();
  function tick(t) {
    const k = Math.min(1, (t - t0) / dur);
    const eased = 1 - Math.pow(1 - k, 3);
    el.textContent = Math.round(from + (to - from) * eased) + suffix;
    if (k < 1 && el.isConnected) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
