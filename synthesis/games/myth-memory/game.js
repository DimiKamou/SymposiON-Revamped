// ============================================================
//  Mythology Memory Match
//  Card-flip pairs game — mythology figures & their epithets
// ============================================================

// ── DATA ──
const MM_PACKS = [
  {
    id: 'iliada',
    icon: '⚔️',
    name: 'Ιλιάδα',
    nameEn: 'Iliad',
    desc: 'Ήρωες & επίθετα της Ιλιάδας.',
    descEn: 'Heroes & epithets of the Iliad.',
    pairs: [
      { a: { gr: 'Ἀχιλλεύς', en: 'Achilles' },          b: { gr: 'πόδας ὠκύς', en: 'swift-footed' },           icon: '⚔️' },
      { a: { gr: 'Ἕκτωρ', en: 'Hector' },                b: { gr: 'ἱπποδάμας', en: 'horse-tamer' },             icon: '🐴' },
      { a: { gr: 'Ἑλένη', en: 'Helen' },                  b: { gr: 'λευκώλενος', en: 'white-armed' },            icon: '👑' },
      { a: { gr: 'Ἀγαμέμνων', en: 'Agamemnon' },          b: { gr: 'ἄναξ ἀνδρῶν', en: 'king of men' },          icon: '🦁' },
      { a: { gr: 'Πάτροκλος', en: 'Patroclus' },          b: { gr: 'φίλτατος ἑταῖρος', en: 'dearest companion' }, icon: '🛡️' },
      { a: { gr: 'Θέτις', en: 'Thetis' },                  b: { gr: 'ἀργυρόπεζα', en: 'silver-footed' },         icon: '🌊' },
      { a: { gr: 'Πρίαμος', en: 'Priam' },                 b: { gr: 'γέρων βασιλεύς', en: 'aged king' },         icon: '👴' },
      { a: { gr: 'Ἀνδρομάχη', en: 'Andromache' },          b: { gr: 'ἄλοχος Ἕκτορος', en: 'wife of Hector' },    icon: '💔' },
      { a: { gr: 'Διομήδης', en: 'Diomedes' },             b: { gr: 'βοὴν ἀγαθός', en: 'good at the war-cry' },  icon: '🗡️' },
      { a: { gr: 'Αἴας', en: 'Ajax' },                     b: { gr: 'μέγας', en: 'the Great' },                  icon: '🏔️' },
    ]
  },
  {
    id: 'odysseia',
    icon: '🌊',
    name: 'Οδύσσεια',
    nameEn: 'Odyssey',
    desc: 'Πρόσωπα & γεγονότα της Οδύσσειας.',
    descEn: 'Characters & events of the Odyssey.',
    pairs: [
      { a: { gr: 'Ὀδυσσεύς', en: 'Odysseus' },            b: { gr: 'πολύμητις', en: 'much-cunning' },            icon: '🧠' },
      { a: { gr: 'Πηνελόπη', en: 'Penelope' },             b: { gr: 'ἡ πιστή', en: 'the faithful' },             icon: '🧵' },
      { a: { gr: 'Τηλέμαχος', en: 'Telemachus' },          b: { gr: 'υἱὸς Ὀδυσσέως', en: 'son of Odysseus' },   icon: '🏹' },
      { a: { gr: 'Κίρκη', en: 'Circe' },                   b: { gr: 'ἡ φαρμακίς', en: 'the sorceress' },         icon: '🔮' },
      { a: { gr: 'Κάλυψω', en: 'Calypso' },                b: { gr: 'ἡ δεινὴ νύμφη', en: 'the dread nymph' },    icon: '🏝️' },
      { a: { gr: 'Πολύφημος', en: 'Polyphemus' },          b: { gr: 'ὁ Κύκλωψ', en: 'the Cyclops' },             icon: '👁️' },
      { a: { gr: 'Σειρῆνες', en: 'Sirens' },               b: { gr: 'μολπαί θελκτήριαι', en: 'enchanting song' }, icon: '🎵' },
      { a: { gr: 'Αἴολος', en: 'Aeolus' },                 b: { gr: 'ταμίης ἀνέμων', en: 'keeper of winds' },    icon: '💨' },
      { a: { gr: 'Σκύλλα', en: 'Scylla' },                 b: { gr: 'δεινὸν τέρας', en: 'dreadful monster' },    icon: '🐙' },
      { a: { gr: 'Χάρυβδις', en: 'Charybdis' },            b: { gr: 'ἡ δίνη', en: 'the whirlpool' },             icon: '🌀' },
    ]
  },
  {
    id: 'theoi',
    icon: '⚡',
    name: 'Θεοί',
    nameEn: 'Gods',
    desc: 'Οι Ολύμπιοι θεοί και τα σύμβολά τους.',
    descEn: 'The Olympian gods and their symbols.',
    pairs: [
      { a: { gr: 'Ζεύς', en: 'Zeus' },                     b: { gr: 'νεφεληγερέτα', en: 'cloud-gatherer' },      icon: '⚡' },
      { a: { gr: 'Ἥρα', en: 'Hera' },                      b: { gr: 'βοῶπις', en: 'ox-eyed' },                   icon: '👑' },
      { a: { gr: 'Ἀθηνᾶ', en: 'Athena' },                  b: { gr: 'γλαυκῶπις', en: 'bright-eyed' },            icon: '🦉' },
      { a: { gr: 'Ἀπόλλων', en: 'Apollo' },                b: { gr: 'ἀργυρότοξος', en: 'silverbow' },            icon: '🏹' },
      { a: { gr: 'Ἄρτεμις', en: 'Artemis' },               b: { gr: 'ἡ κυνηγός', en: 'the huntress' },           icon: '🌙' },
      { a: { gr: 'Ποσειδῶν', en: 'Poseidon' },             b: { gr: 'γαιήοχος', en: 'earth-shaker' },            icon: '🔱' },
      { a: { gr: 'Ἄρης', en: 'Ares' },                     b: { gr: 'θεὸς πολέμου', en: 'god of war' },          icon: '⚔️' },
      { a: { gr: 'Ἥφαιστος', en: 'Hephaestus' },           b: { gr: 'ὁ χωλός', en: 'the lame one' },             icon: '🔨' },
      { a: { gr: 'Ἀφροδίτη', en: 'Aphrodite' },            b: { gr: 'χρυσῆ', en: 'golden' },                     icon: '🌹' },
      { a: { gr: 'Ἑρμῆς', en: 'Hermes' },                  b: { gr: 'ἀγγελίαρχος', en: 'herald of gods' },       icon: '🪶' },
    ]
  },
];

const MM_DIFF = [
  { id: 'easy',   label: 'Εύκολο',   labelEn: 'Easy',   pairs: 4,  timer: 0  },
  { id: 'medium', label: 'Μεσαίο',   labelEn: 'Medium', pairs: 6,  timer: 90 },
  { id: 'hard',   label: 'Δύσκολο',  labelEn: 'Hard',   pairs: 10, timer: 60 },
];

// ── STATE ──
let _mm = {
  pack: null, diff: null, cards: [], flipped: [], matched: 0,
  locked: false, moves: 0, timer: 0, timerInterval: null, lang: 'gr'
};

// ── OPEN / CLOSE ──
window.openMythMemory = function () {
  const ov = document.getElementById('myth-memory-overlay');
  if (!ov) return;
  ov.style.display = 'flex';
  ov.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('mm-screen-menu')) _mmBuild();
  _mmShowScreen('menu');
};
window.closeMythMemory = function () {
  _mmStopTimer();
  const ov = document.getElementById('myth-memory-overlay');
  if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
};

// ── BUILD UI ──
function _mmBuild() {
  const wrap = document.getElementById('myth-memory-wrap');
  if (!wrap) return;
  wrap.innerHTML = `
<div id="mm-screen-menu" class="mm-screen active">
  <div class="mm-title" id="mm-menu-title">Mythology Memory</div>
  <div class="mm-subtitle" id="mm-menu-sub">ΕΠΕΛΕΞΕ ΠΑΚΕΤΟ ΚΑΙ ΔΥΣΚΟΛΙΑ</div>
  <div class="mm-packs" id="mm-pack-grid"></div>
  <div class="mm-diff-row" id="mm-diff-row"></div>
  <button class="mm-start-btn" id="mm-start-btn" disabled onclick="_mmStart()">▶ ΠΑΙΞΕ</button>
</div>
<div id="mm-screen-game" class="mm-screen">
  <div class="mm-hud" id="mm-hud">
    <div class="mm-hud-stat">
      <div class="mm-hud-val" id="mm-moves">0</div>
      <div class="mm-hud-lbl" id="mm-moves-lbl">ΚΙΝΗΣΕΙΣ</div>
    </div>
    <div class="mm-pack-badge" id="mm-pack-badge"></div>
    <div id="mm-timer-container"></div>
  </div>
  <div class="mm-progress-wrap"><div class="mm-progress-fill" id="mm-progress" style="width:0%"></div></div>
  <div class="mm-grid" id="mm-card-grid"></div>
</div>
<div id="mm-screen-win" class="mm-screen">
  <div class="mm-win-icon">🏆</div>
  <div class="mm-win-title" id="mm-win-title">Ολοκληρώθηκε!</div>
  <div class="mm-win-stats" id="mm-win-stats"></div>
  <div class="mm-btn-row">
    <button class="mm-btn primary" onclick="_mmStart()">▶ Ξανά</button>
    <button class="mm-btn" onclick="_mmShowScreen('menu')">← Μενού</button>
  </div>
</div>`;
  _mmPopulatePacks();
  _mmPopulateDiff();
}

function _mmPopulatePacks() {
  const grid = document.getElementById('mm-pack-grid');
  const lang = _mm.lang;
  MM_PACKS.forEach(p => {
    const el = document.createElement('div');
    el.className = 'mm-pack';
    el.dataset.id = p.id;
    el.innerHTML = `
      <div class="mm-pack-icon">${p.icon}</div>
      <div class="mm-pack-name">${lang === 'en' ? p.nameEn : p.name}</div>
      <div class="mm-pack-desc">${lang === 'en' ? p.descEn : p.desc}</div>
      <div class="mm-pack-count">${p.pairs.length} ζεύγη</div>`;
    el.onclick = () => {
      document.querySelectorAll('.mm-pack').forEach(x => x.classList.remove('selected'));
      el.classList.add('selected');
      _mm.pack = p;
      _mmCheckStart();
    };
    grid.appendChild(el);
  });
}

function _mmPopulateDiff() {
  const row = document.getElementById('mm-diff-row');
  const lang = _mm.lang;
  MM_DIFF.forEach((d, i) => {
    const btn = document.createElement('button');
    btn.className = 'mm-diff-btn' + (i === 1 ? ' active' : '');
    btn.textContent = lang === 'en' ? d.labelEn : d.label;
    if (i === 1) _mm.diff = d;
    btn.onclick = () => {
      document.querySelectorAll('.mm-diff-btn').forEach(x => x.classList.remove('active'));
      btn.classList.add('active');
      _mm.diff = d;
      _mmCheckStart();
    };
    row.appendChild(btn);
  });
}

function _mmCheckStart() {
  const btn = document.getElementById('mm-start-btn');
  if (btn) btn.disabled = !(_mm.pack && _mm.diff);
}

// ── GAME START ──
function _mmStart() {
  if (!_mm.pack || !_mm.diff) return;
  _mmStopTimer();
  const lang = _mm.lang;
  const pairCount = Math.min(_mm.diff.pairs, _mm.pack.pairs.length);
  const selected = _shuffle([..._mm.pack.pairs]).slice(0, pairCount);

  // Build card objects — each pair becomes two cards
  _mm.cards = [];
  let id = 0;
  selected.forEach((pair, pi) => {
    _mm.cards.push({ id: id++, pairId: pi, side: 'a', gr: pair.a.gr, en: pair.a.en, icon: pair.icon });
    _mm.cards.push({ id: id++, pairId: pi, side: 'b', gr: pair.b.gr, en: pair.b.en, icon: pair.icon });
  });
  _mm.cards = _shuffle(_mm.cards);
  _mm.flipped = []; _mm.matched = 0; _mm.moves = 0; _mm.locked = false;

  // Render grid
  const grid = document.getElementById('mm-card-grid');
  const cols = pairCount <= 4 ? 4 : pairCount <= 6 ? 6 : 8;
  grid.setAttribute('data-cols', cols);
  grid.innerHTML = '';
  _mm.cards.forEach(c => {
    const el = document.createElement('div');
    el.className = 'mm-card';
    el.dataset.cardId = c.id;
    el.innerHTML = `
      <div class="mm-card-inner">
        <div class="mm-card-front"><div class="mm-card-front-inner">?</div></div>
        <div class="mm-card-back">
          <div class="mm-card-icon">${c.icon}</div>
          <div class="mm-card-greek">${c.gr}</div>
          <div class="mm-card-latin">${lang === 'en' ? c.en : ''}</div>
        </div>
      </div>`;
    el.onclick = () => _mmFlip(c.id);
    grid.appendChild(el);
  });

  // HUD
  const badge = document.getElementById('mm-pack-badge');
  if (badge) badge.textContent = lang === 'en' ? _mm.pack.nameEn : _mm.pack.name;
  _mmUpdateHUD();
  _mmUpdateProgress();

  // Timer
  const timerCont = document.getElementById('mm-timer-container');
  if (_mm.diff.timer > 0) {
    _mm.timer = _mm.diff.timer;
    timerCont.innerHTML = `
      <div class="mm-timer-wrap">
        <svg class="mm-timer-svg" viewBox="0 0 44 44">
          <circle class="mm-timer-bg" cx="22" cy="22" r="22"/>
          <circle id="mm-timer-arc" class="mm-timer-arc" cx="22" cy="22" r="22"/>
        </svg>
        <div class="mm-timer-text" id="mm-timer-text">${_mm.timer}</div>
      </div>`;
    _mmTickTimer();
    _mm.timerInterval = setInterval(_mmTickTimer, 1000);
  } else {
    timerCont.innerHTML = '';
  }

  _mmShowScreen('game');
}

function _mmTickTimer() {
  const arc  = document.getElementById('mm-timer-arc');
  const text = document.getElementById('mm-timer-text');
  if (!arc || !text) { _mmStopTimer(); return; }
  const total = _mm.diff.timer;
  const ratio = _mm.timer / total;
  const circ  = 2 * Math.PI * 22;
  arc.style.strokeDashoffset = circ * (1 - ratio);
  text.textContent = _mm.timer;
  const cls = _mm.timer <= 10 ? 'danger' : _mm.timer <= 20 ? 'warning' : '';
  arc.className = 'mm-timer-arc' + (cls ? ' ' + cls : '');
  text.className = 'mm-timer-text' + (cls ? ' ' + cls : '');
  if (_mm.timer <= 0) { _mmStopTimer(); _mmTimeOut(); return; }
  _mm.timer--;
}

function _mmStopTimer() {
  if (_mm.timerInterval) { clearInterval(_mm.timerInterval); _mm.timerInterval = null; }
}

function _mmTimeOut() {
  _mm.locked = true;
  // Reveal all unmatched
  document.querySelectorAll('.mm-card:not(.matched)').forEach(el => el.classList.add('flipped'));
  setTimeout(() => _mmShowWin(false), 1200);
}

// ── FLIP LOGIC ──
function _mmFlip(cardId) {
  if (_mm.locked) return;
  const card = _mm.cards.find(c => c.id === cardId);
  if (!card) return;
  const el = document.querySelector(`[data-card-id="${cardId}"]`);
  if (!el || el.classList.contains('flipped') || el.classList.contains('matched')) return;

  el.classList.add('flipped');
  _mm.flipped.push(card);

  if (_mm.flipped.length === 2) {
    _mm.locked = true;
    _mm.moves++;
    _mmUpdateHUD();
    const [a, b] = _mm.flipped;
    if (a.pairId === b.pairId && a.side !== b.side) {
      // Match!
      setTimeout(() => {
        document.querySelectorAll(`[data-card-id="${a.id}"],[data-card-id="${b.id}"]`)
          .forEach(x => x.classList.add('matched'));
        _mm.matched++;
        _mm.flipped = [];
        _mm.locked = false;
        _mmUpdateProgress();
        if (_mm.matched >= _mm.cards.length / 2) {
          _mmStopTimer(); setTimeout(() => _mmShowWin(true), 500);
        } else if (_mm.matched % 3 === 0) {
          _mmStreak();
        }
      }, 400);
    } else {
      // No match
      setTimeout(() => {
        const els = document.querySelectorAll(`[data-card-id="${a.id}"],[data-card-id="${b.id}"]`);
        els.forEach(x => { x.classList.add('wrong'); });
        setTimeout(() => {
          els.forEach(x => { x.classList.remove('flipped', 'wrong'); });
          _mm.flipped = [];
          _mm.locked = false;
        }, 600);
      }, 600);
    }
  }
}

function _mmStreak() {
  const flash = document.createElement('div');
  flash.className = 'mm-streak-flash';
  flash.textContent = '🔥 COMBO!';
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 700);
}

function _mmUpdateHUD() {
  const mv = document.getElementById('mm-moves');
  if (mv) mv.textContent = _mm.moves;
}

function _mmUpdateProgress() {
  const bar = document.getElementById('mm-progress');
  const total = _mm.cards.length / 2;
  if (bar) bar.style.width = ((_mm.matched / total) * 100) + '%';
}

// ── WIN ──
function _mmShowWin(success) {
  const title = document.getElementById('mm-win-title');
  const stats = document.getElementById('mm-win-stats');
  const lang = _mm.lang;
  if (title) title.textContent = success
    ? (lang === 'en' ? 'Completed!' : 'Ολοκληρώθηκε!')
    : (lang === 'en' ? 'Time\'s up!' : 'Έληξε ο χρόνος!');
  if (stats) {
    const pairCount = _mm.cards.length / 2;
    const accuracy = _mm.moves > 0 ? Math.round((_mm.matched / _mm.moves) * 100) : 100;
    stats.innerHTML = `
      <div class="mm-win-stat"><div class="mm-win-val">${_mm.matched}/${pairCount}</div><div class="mm-win-lbl">${lang === 'en' ? 'PAIRS' : 'ΖΕΥΓΗ'}</div></div>
      <div class="mm-win-stat"><div class="mm-win-val">${_mm.moves}</div><div class="mm-win-lbl">${lang === 'en' ? 'MOVES' : 'ΚΙΝΗΣΕΙΣ'}</div></div>
      <div class="mm-win-stat"><div class="mm-win-val">${accuracy}%</div><div class="mm-win-lbl">${lang === 'en' ? 'ACCURACY' : 'ΑΚΡΙΒΕΙΑ'}</div></div>`;
  }
  if(typeof awardGameRewards==='function' && _mm.matched > 0){ awardGameRewards('myth-memory', { score: _mm.matched, perfect: success && _mm.moves === _mm.cards.length / 2 }); }
  _mmShowScreen('win');
}

// ── SCREENS ──
function _mmShowScreen(name) {
  document.querySelectorAll('.mm-screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('mm-screen-' + name);
  if (el) el.classList.add('active');
}

// ── LANGUAGE SYNC ──
window._mmSetLang = function (l) {
  _mm.lang = l;
};

// ── UTILITY ──
function _shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
