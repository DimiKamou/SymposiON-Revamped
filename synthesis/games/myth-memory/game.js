// ============================================================
//  Mythology Memory Match
//  Card-flip pairs game — mythology figures & their epithets
//  Visual language: black-figure lacquer × luxury tarot.
//  (Gameplay, rules, scoring and data are unchanged.)
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

// Presentation-only: honour the user's reduced-motion preference.
const _MM_REDUCE = (typeof window.matchMedia === 'function')
  ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;

// ── OPEN / CLOSE ──
window.openMythMemory = function () {
  const ov = document.getElementById('myth-memory-overlay');
  if (!ov) return;
  ov.style.display = 'flex';
  ov.classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('mm-screen-menu')) _mmBuild();
  _mmMotes();
  _mmShowScreen('menu');
};
window.closeMythMemory = function () {
  _mmStopTimer();
  const ov = document.getElementById('myth-memory-overlay');
  if (ov) { ov.classList.remove('active'); ov.style.display = 'none'; document.body.style.overflow = ''; }
};

// ── ORNAMENT HELPERS (pure SVG strings, no assets) ──
function _mmLaurelSVG(side) {
  // One hand-drawn laurel branch; the right branch is mirrored in CSS.
  return `
<svg class="mm-laurel mm-laurel-${side}" viewBox="0 0 60 110" aria-hidden="true">
  <path d="M52 105 C28 88 16 58 24 10" fill="none" stroke="currentColor" stroke-width="2" opacity=".85"/>
  <ellipse cx="45" cy="93" rx="12" ry="4.2" transform="rotate(-36 45 93)"  fill="currentColor" opacity=".9"/>
  <ellipse cx="33" cy="97" rx="10" ry="3.8" transform="rotate(-4 33 97)"   fill="currentColor" opacity=".7"/>
  <ellipse cx="36" cy="79" rx="12" ry="4.2" transform="rotate(-52 36 79)"  fill="currentColor" opacity=".9"/>
  <ellipse cx="24" cy="82" rx="10" ry="3.8" transform="rotate(-14 24 82)"  fill="currentColor" opacity=".7"/>
  <ellipse cx="29" cy="64" rx="12" ry="4.2" transform="rotate(-64 29 64)"  fill="currentColor" opacity=".9"/>
  <ellipse cx="17" cy="65" rx="10" ry="3.8" transform="rotate(-24 17 65)"  fill="currentColor" opacity=".7"/>
  <ellipse cx="25" cy="48" rx="12" ry="4.2" transform="rotate(-74 25 48)"  fill="currentColor" opacity=".9"/>
  <ellipse cx="13" cy="48" rx="10" ry="3.8" transform="rotate(-34 13 48)"  fill="currentColor" opacity=".7"/>
  <ellipse cx="23" cy="32" rx="11" ry="4"   transform="rotate(-84 23 32)"  fill="currentColor" opacity=".9"/>
  <ellipse cx="12" cy="31" rx="9"  ry="3.5" transform="rotate(-44 12 31)"  fill="currentColor" opacity=".7"/>
  <ellipse cx="24" cy="17" rx="10" ry="3.7" transform="rotate(-96 24 17)"  fill="currentColor" opacity=".9"/>
  <ellipse cx="15" cy="14" rx="8"  ry="3.2" transform="rotate(-56 15 14)"  fill="currentColor" opacity=".7"/>
</svg>`;
}

// ── BUILD UI ──
function _mmBuild() {
  const wrap = document.getElementById('myth-memory-wrap');
  if (!wrap) return;
  const lang = _mm.lang;
  const T = (gr, en) => (lang === 'en' ? en : gr);
  wrap.innerHTML = `
<div id="mm-screen-menu" class="mm-screen active">
  <div class="mm-hero">
    <div class="mm-eyebrow">${T('ΜΝΗΜΗ &nbsp;✦&nbsp; ΜΥΘΟΣ &nbsp;✦&nbsp; ΚΛΕΟΣ', 'MEMORY &nbsp;✦&nbsp; MYTH &nbsp;✦&nbsp; GLORY')}</div>
    <h1 class="mm-title" id="mm-menu-title">Mythology <em>Memory</em></h1>
    <div class="mm-divider" aria-hidden="true"><span>❖</span></div>
    <div class="mm-subtitle" id="mm-menu-sub">${T('ΕΠΕΛΕΞΕ ΠΑΚΕΤΟ ΚΑΙ ΔΥΣΚΟΛΙΑ', 'CHOOSE A DECK AND A DIFFICULTY')}</div>
  </div>
  <div class="mm-packs" id="mm-pack-grid"></div>
  <div class="mm-diff-row" id="mm-diff-row"></div>
  <button class="mm-start-btn" id="mm-start-btn" disabled onclick="_mmStart()"><span class="mm-start-inner">${T('ΠΑΙΞΕ', 'PLAY')}</span></button>
</div>
<div id="mm-screen-game" class="mm-screen">
  <div class="mm-hud" id="mm-hud">
    <div class="mm-hud-stat">
      <div class="mm-hud-val" id="mm-moves">0</div>
      <div class="mm-hud-lbl" id="mm-moves-lbl">${T('ΚΙΝΗΣΕΙΣ', 'MOVES')}</div>
    </div>
    <div class="mm-pack-badge" id="mm-pack-badge"></div>
    <div id="mm-timer-container"></div>
  </div>
  <div class="mm-progress-wrap"><div class="mm-progress-fill" id="mm-progress" style="width:0%"></div></div>
  <div class="mm-rail" id="mm-rail"></div>
  <div class="mm-grid" id="mm-card-grid"></div>
</div>
<div id="mm-screen-win" class="mm-screen">
  <div class="mm-win-wreath">
    ${_mmLaurelSVG('l')}
    <div class="mm-win-icon" id="mm-win-icon">🏆</div>
    ${_mmLaurelSVG('r')}
  </div>
  <div class="mm-win-title" id="mm-win-title">Ολοκληρώθηκε!</div>
  <div class="mm-win-quote" id="mm-win-quote"></div>
  <div class="mm-win-stats" id="mm-win-stats"></div>
  <div class="mm-btn-row">
    <button class="mm-btn primary" onclick="_mmStart()">▶ ${T('Ξανά', 'Again')}</button>
    <button class="mm-btn" onclick="_mmShowScreen('menu')">← ${T('Μενού', 'Menu')}</button>
  </div>
</div>`;
  _mmPopulatePacks();
  _mmPopulateDiff();
}

function _mmPopulatePacks() {
  const grid = document.getElementById('mm-pack-grid');
  const lang = _mm.lang;
  MM_PACKS.forEach((p, i) => {
    const el = document.createElement('div');
    el.className = 'mm-pack';
    el.dataset.id = p.id;
    el.style.setProperty('--i', i);
    el.innerHTML = `
      <div class="mm-pack-frame" aria-hidden="true"></div>
      <div class="mm-pack-icon"><span>${p.icon}</span></div>
      <div class="mm-pack-name">${lang === 'en' ? p.nameEn : p.name}</div>
      <div class="mm-pack-desc">${lang === 'en' ? p.descEn : p.desc}</div>
      <div class="mm-pack-count">${p.pairs.length} ${lang === 'en' ? 'pairs' : 'ζεύγη'}</div>`;
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
    const meta = `${d.pairs} ${lang === 'en' ? 'pairs' : 'ζεύγη'} · ${d.timer > 0 ? d.timer + '″' : '∞'}`;
    btn.innerHTML = `<span class="mm-diff-name">${lang === 'en' ? d.labelEn : d.label}</span><span class="mm-diff-meta">${meta}</span>`;
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
  _mm.cards.forEach((c, idx) => {
    const el = document.createElement('div');
    el.className = 'mm-card';
    el.dataset.cardId = c.id;
    el.style.setProperty('--i', idx);
    el.innerHTML = `
      <div class="mm-card-inner">
        <div class="mm-card-front">
          <div class="mm-card-frieze mm-frieze-top" aria-hidden="true"></div>
          <div class="mm-card-emblem" aria-hidden="true"></div>
          <div class="mm-card-frieze mm-frieze-bot" aria-hidden="true"></div>
          <div class="mm-shine" aria-hidden="true"></div>
        </div>
        <div class="mm-card-back">
          <div class="mm-card-icon"><span>${c.icon}</span></div>
          <div class="mm-card-greek">${c.gr}</div>
          <div class="mm-card-latin">${lang === 'en' ? c.en : ''}</div>
          <div class="mm-card-seal" aria-hidden="true">✓</div>
          <div class="mm-shine" aria-hidden="true"></div>
        </div>
      </div>`;
    el.onclick = () => _mmFlip(c.id);
    grid.appendChild(el);
  });

  // Trophy rail — one empty slot per pair, filled as pairs are won
  const rail = document.getElementById('mm-rail');
  if (rail) {
    rail.innerHTML = `<span class="mm-rail-lbl">${lang === 'en' ? 'TROPHIES' : 'ΤΡΟΠΑΙΑ'}</span><span class="mm-rail-slots">${
      Array.from({ length: pairCount }, () => '<span class="mm-rail-slot"></span>').join('')
    }</span>`;
  }

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
        const els = document.querySelectorAll(`[data-card-id="${a.id}"],[data-card-id="${b.id}"]`);
        els.forEach(x => x.classList.add('matched'));
        _mmCelebrate(els, a.icon);
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
        _mmGridNudge();
        setTimeout(() => {
          els.forEach(x => { x.classList.remove('flipped', 'wrong'); });
          _mm.flipped = [];
          _mm.locked = false;
        }, 600);
      }, 600);
    }
  }
}

// ── PRESENTATION FX (no gameplay effect) ──

/* Gold spark burst at a fixed-viewport point. WAAPI so it works even if rAF throttles. */
function _mmSparks(x, y, opts = {}) {
  if (_MM_REDUCE) return;
  const n = opts.count || 16;
  const palette = ['#F5DE9A', '#D9B45F', '#C98B3F', '#FFF3D6'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('div');
    p.className = 'mm-spark';
    const c = palette[(Math.random() * palette.length) | 0];
    const s = 3 + Math.random() * 5;
    p.style.cssText = `left:${x}px;top:${y}px;width:${s.toFixed(1)}px;height:${s.toFixed(1)}px;background:${c};box-shadow:0 0 ${(6 + s * 2).toFixed(0)}px ${c};`;
    document.body.appendChild(p);
    const ang = Math.random() * Math.PI * 2;
    const sp  = (opts.power || 64) * (0.35 + Math.random());
    const dx  = Math.cos(ang) * sp;
    const dy  = Math.sin(ang) * sp - 26;
    const dur = 650 + Math.random() * 500;
    p.animate([
      { transform: 'translate(-50%,-50%) rotate(45deg) scale(1)', opacity: 1 },
      { transform: `translate(calc(-50% + ${(dx * 0.7).toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px)) rotate(170deg) scale(.9)`, opacity: 1, offset: 0.5 },
      { transform: `translate(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${(dy + 90).toFixed(1)}px)) rotate(260deg) scale(.25)`, opacity: 0 },
    ], { duration: dur, easing: 'cubic-bezier(.22,.68,.4,1)', fill: 'forwards' });
    setTimeout(() => p.remove(), dur + 60);
  }
}

/* Match celebration: sparks on both cards + a medallion glides to the trophy rail. */
function _mmCelebrate(cardEls, icon) {
  let midX = 0, midY = 0, count = 0;
  cardEls.forEach(el => {
    const r = el.getBoundingClientRect();
    midX += r.left + r.width / 2; midY += r.top + r.height / 2; count++;
    _mmSparks(r.left + r.width / 2, r.top + r.height / 2, { count: 10, power: 46 });
  });
  if (count) { midX /= count; midY /= count; }
  _mmFlyToRail(icon, count ? { x: midX, y: midY } : null);
}

/* Fly a small gold medallion from the matched pair to the next empty rail slot. */
function _mmFlyToRail(icon, from) {
  const slot = document.querySelector('#mm-rail .mm-rail-slot:not(.filled)');
  if (!slot) return;
  const fill = () => { slot.classList.add('filled'); slot.textContent = icon; };
  if (_MM_REDUCE || !from) { fill(); return; }
  const r2 = slot.getBoundingClientRect();
  if (!r2.width) { fill(); return; }
  const fly = document.createElement('div');
  fly.className = 'mm-fly';
  fly.textContent = icon;
  fly.style.left = from.x + 'px';
  fly.style.top  = from.y + 'px';
  document.body.appendChild(fly);
  const dx = (r2.left + r2.width / 2) - from.x;
  const dy = (r2.top + r2.height / 2) - from.y;
  let landed = false;
  const land = () => {
    if (landed) return;
    landed = true;
    fly.remove();
    fill();
    const r = slot.getBoundingClientRect();
    _mmSparks(r.left + r.width / 2, r.top + r.height / 2, { count: 7, power: 30 });
    if (slot.animate) slot.animate(
      [{ transform: 'scale(1.6)' }, { transform: 'scale(1)' }],
      { duration: 280, easing: 'cubic-bezier(.2,.8,.3,1.4)' });
  };
  const anim = fly.animate([
    { transform: 'translate(-50%,-50%) scale(1.25) rotate(0deg)', opacity: 1 },
    { transform: `translate(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px)) scale(.6) rotate(360deg)`, opacity: 1 },
  ], { duration: 620, easing: 'cubic-bezier(.3,.7,.25,1)', fill: 'forwards' });
  anim.onfinish = land;
  setTimeout(land, 900); // failsafe if WAAPI stalls
}

/* Small grid shudder on a mismatch. */
function _mmGridNudge() {
  if (_MM_REDUCE) return;
  const grid = document.getElementById('mm-card-grid');
  if (!grid) return;
  grid.classList.remove('mm-nudge');
  void grid.offsetWidth;
  grid.classList.add('mm-nudge');
}

function _mmStreak() {
  const flash = document.createElement('div');
  flash.className = 'mm-streak-flash';
  flash.innerHTML = `<span class="mm-streak-main">${_mm.lang === 'en' ? 'BRAVO!' : 'ΕΥΓΕ!'}</span><span class="mm-streak-sub">🔥 COMBO</span>`;
  document.body.appendChild(flash);
  _mmSparks(window.innerWidth / 2, window.innerHeight / 2, { count: 14, power: 78 });
  setTimeout(() => flash.remove(), 900);
}

function _mmUpdateHUD() {
  const mv = document.getElementById('mm-moves');
  if (!mv) return;
  const next = String(_mm.moves);
  if (mv.textContent !== next) {
    mv.textContent = next;
    if (!_MM_REDUCE) { mv.classList.remove('mm-pop'); void mv.offsetWidth; mv.classList.add('mm-pop'); }
  } else {
    mv.textContent = next;
  }
}

function _mmUpdateProgress() {
  const bar = document.getElementById('mm-progress');
  const total = _mm.cards.length / 2;
  if (bar) bar.style.width = ((_mm.matched / total) * 100) + '%';
}

/* Count a number up inside an element (used on the win screen). */
function _mmCountUp(el, target, suffix = '') {
  if (!el) return;
  if (_MM_REDUCE || !target) { el.textContent = target + suffix; return; }
  const t0 = performance.now(), dur = 760;
  function step(now) {
    const t = Math.min(1, (now - t0) / dur);
    const e = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(target * e) + suffix;
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
  // failsafe: settle the final value even if rAF is throttled
  setTimeout(() => { el.textContent = target + suffix; }, dur + 300);
}

// ── WIN ──
function _mmShowWin(success) {
  const scr   = document.getElementById('mm-screen-win');
  const title = document.getElementById('mm-win-title');
  const quote = document.getElementById('mm-win-quote');
  const icon  = document.getElementById('mm-win-icon');
  const stats = document.getElementById('mm-win-stats');
  const lang = _mm.lang;
  if (scr) scr.classList.toggle('timeout', !success);
  if (icon) icon.textContent = success ? '🏆' : '⏳';
  if (title) title.textContent = success
    ? (lang === 'en' ? 'Completed!' : 'Ολοκληρώθηκε!')
    : (lang === 'en' ? 'Time\'s up!' : 'Έληξε ο χρόνος!');
  if (quote) quote.innerHTML = success
    ? `«Κλέος ἄφθιτον» <i>— ${lang === 'en' ? 'imperishable glory' : 'δόξα αιώνια'}</i>`
    : (lang === 'en' ? 'The Fates were faster — try again.' : 'Οι Μοίρες ήταν ταχύτερες — δοκίμασε ξανά.');
  if (stats) {
    const pairCount = _mm.cards.length / 2;
    const accuracy = _mm.moves > 0 ? Math.round((_mm.matched / _mm.moves) * 100) : 100;
    stats.innerHTML = `
      <div class="mm-win-stat"><div class="mm-win-val"><span class="mm-cu" data-v="${_mm.matched}">0</span><span class="mm-win-den">/${pairCount}</span></div><div class="mm-win-lbl">${lang === 'en' ? 'PAIRS' : 'ΖΕΥΓΗ'}</div></div>
      <div class="mm-win-stat"><div class="mm-win-val"><span class="mm-cu" data-v="${_mm.moves}">0</span></div><div class="mm-win-lbl">${lang === 'en' ? 'MOVES' : 'ΚΙΝΗΣΕΙΣ'}</div></div>
      <div class="mm-win-stat"><div class="mm-win-val"><span class="mm-cu" data-v="${accuracy}" data-sfx="%">0%</span></div><div class="mm-win-lbl">${lang === 'en' ? 'ACCURACY' : 'ΑΚΡΙΒΕΙΑ'}</div></div>`;
    stats.querySelectorAll('.mm-cu').forEach(el => _mmCountUp(el, parseInt(el.dataset.v, 10) || 0, el.dataset.sfx || ''));
  }
  if(typeof awardGameRewards==='function' && _mm.matched > 0){ awardGameRewards('myth-memory', { score: _mm.matched, perfect: success && _mm.moves === _mm.cards.length / 2 }); }
  _mmShowScreen('win');
  if (success && !_MM_REDUCE) {
    setTimeout(() => {
      const w = document.querySelector('.mm-win-wreath');
      if (!w) return;
      const r = w.getBoundingClientRect();
      _mmSparks(r.left + r.width / 2, r.top + r.height / 2, { count: 22, power: 92 });
      setTimeout(() => _mmSparks(r.left + r.width * 0.2, r.top + r.height * 0.4, { count: 9, power: 48 }), 220);
      setTimeout(() => _mmSparks(r.left + r.width * 0.8, r.top + r.height * 0.4, { count: 9, power: 48 }), 380);
    }, 260);
  }
}

// ── SCREENS ──
function _mmShowScreen(name) {
  document.querySelectorAll('.mm-screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById('mm-screen-' + name);
  if (el) el.classList.add('active');
}

// ── AMBIENT: floating gold dust in the overlay backdrop ──
function _mmMotes() {
  const amb = document.getElementById('mm-ambient');
  if (!amb || amb.dataset.done || _MM_REDUCE) return;
  amb.dataset.done = '1';
  for (let i = 0; i < 16; i++) {
    const m = document.createElement('span');
    m.className = 'mm-mote';
    m.style.left = (Math.random() * 100).toFixed(2) + '%';
    m.style.setProperty('--s',   (2 + Math.random() * 3.5).toFixed(1) + 'px');
    m.style.setProperty('--d',   (16 + Math.random() * 18).toFixed(1) + 's');
    m.style.setProperty('--del', (-Math.random() * 34).toFixed(1) + 's');
    m.style.setProperty('--x',   ((Math.random() - 0.5) * 140).toFixed(0) + 'px');
    m.style.setProperty('--o',   (0.2 + Math.random() * 0.45).toFixed(2));
    amb.appendChild(m);
  }
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
