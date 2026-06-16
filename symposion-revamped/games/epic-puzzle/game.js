// ============================================================
//  Χρονολόγιο — Epic Sequence Puzzle
//  Click Iliad / Odyssey events in chronological order
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
};

// ── BUILD SHELL ──
function _epBuild() {
  const wrap = document.getElementById('ep-wrap');
  if (!wrap) return;
  wrap.innerHTML = `
<div id="ep-screen-menu" class="ep-screen">
  <div class="ep-title">Χρονολόγιο</div>
  <div class="ep-subtitle">ΕΠΙΛΕΞΕ ΕΠΙΚΟ ΠΟΙΗΜΑ</div>
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
  <div class="ep-cards" id="ep-cards"></div>
  <div class="ep-actions" id="ep-actions"></div>
</div>
<div id="ep-screen-end" class="ep-screen">
  <div class="ep-end-icon" id="ep-end-icon"></div>
  <div class="ep-end-title" id="ep-end-title"></div>
  <div class="ep-end-score" id="ep-end-score"></div>
  <div class="ep-end-stars" id="ep-end-stars"></div>
  <div class="ep-end-btns" id="ep-end-btns"></div>
</div>`;
  _epPopulateMenu();
}

// ── MENU ──
function _epPopulateMenu() {
  const grid = document.getElementById('ep-pack-grid');
  if (!grid) return;
  const l = _ep.lang;
  grid.innerHTML = EP_PACKS.map((p, i) => `
    <div class="ep-pack-card" onclick="_epSelectPack(${i})">
      <div class="ep-pack-icon">${p.icon}</div>
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
  if (pos !== -1) {
    _ep.placed.splice(pos, 1); // deselect
  } else {
    _ep.placed.push(displayIdx); // select next slot
  }
  _epUpdateNums();
  _epRenderActions();
};

function _epUpdateNums() {
  for (let d = 0; d < 5; d++) {
    const numEl = document.getElementById('ep-card-num-' + d);
    const card  = document.getElementById('ep-card-' + d);
    if (!numEl || !card) continue;
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
}

function _epRenderActions() {
  const actions = document.getElementById('ep-actions');
  if (!actions) return;
  const l = _ep.lang;
  const allPlaced = _ep.placed.length === 5;
  if (allPlaced) {
    actions.innerHTML = `<button class="ep-check-btn" onclick="_epCheck()">${l === 'en' ? '✓ Check Order' : '✓ Ελέγξτε τη Σειρά'}</button>`;
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
  const ptsLabel = l === 'en'
    ? `${pts} / 14 pts this round`
    : `${pts} / 14 πόντοι σε αυτόν τον γύρο`;

  document.getElementById('ep-actions').innerHTML = `
    <div class="ep-round-pts">${ptsLabel} <span class="ep-total-sep">·</span> <span class="ep-total-pts">${l === 'en' ? 'Total' : 'Σύνολο'}: ${_ep.score}</span></div>
    <button class="ep-next-btn" onclick="_epNext()">${nextLabel}</button>`;

  document.getElementById('ep-score-badge').textContent = _ep.score + ' pts';
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

  document.getElementById('ep-end-icon').textContent =
    pct >= 0.8 ? '🏆' : pct >= 0.5 ? '⭐' : '📜';

  document.getElementById('ep-end-title').textContent =
    pct >= 0.8 ? (l === 'en' ? 'Excellent!' : 'Εξαιρετικό!') :
    pct >= 0.5 ? (l === 'en' ? 'Well done!'  : 'Μπράβο!') :
                 (l === 'en' ? 'Keep practicing!' : 'Συνέχισε την εξάσκηση!');

  document.getElementById('ep-end-score').innerHTML =
    `<span class="ep-final-num">${_ep.score}</span><span class="ep-final-max"> / ${maxScore}</span>`;

  document.getElementById('ep-end-stars').innerHTML =
    '⭐'.repeat(stars) + '<span class="ep-star-empty">☆</span>'.repeat(3 - stars);

  document.getElementById('ep-end-btns').innerHTML = `
    <button class="ep-btn ep-btn-primary" onclick="_epSelectPack(${_ep.packIdx})">${l === 'en' ? '▶ Play Again' : '▶ Παίξε Ξανά'}</button>
    <button class="ep-btn" onclick="_epShowScreen('menu')">${l === 'en' ? '← Menu' : '← Μενού'}</button>`;

  const wrap = document.getElementById('ep-wrap');
  if (wrap) wrap.scrollTop = 0;
  if(typeof awardGameRewards==='function' && _ep.score > 0){ awardGameRewards('epic-puzzle', { score: _ep.score, perfect: _ep.score === maxScore }); }
  _epShowScreen('end');
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
