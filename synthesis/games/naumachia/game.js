// ============================================================
//  NAUMACHIA — Ναυμαχία  |  game.js
//  Battleship-style naval combat · VS AI & VS Player (Firestore)
//  Educational gate: correct question required before each shot.
// ============================================================
'use strict';

// ── Fleet definition ──────────────────────────────────────────
const NAU_FLEET = [
  { id: 0, name: 'Πεντήρης',  len: 5 },
  { id: 1, name: 'Τετρήρης',  len: 4 },
  { id: 2, name: 'Τριήρης Α', len: 3 },
  { id: 3, name: 'Τριήρης Β', len: 3 },
  { id: 4, name: 'Διήρης',    len: 2 },
];
const NAU_SIZE = 10;

// ── Presentation helpers (visual layer only) ─────────────────
const NAU_RM = (typeof matchMedia === 'function')
  ? matchMedia('(prefers-reduced-motion: reduce)')
  : { matches: false };

// ── WebAudio flourish kit (synthesized, no assets; presentation only) ──
// One-shots only — nothing persistent, so open/close teardown is untouched.
const NAU_SFX = {
  muted: (function () {
    try { return localStorage.getItem('nau_muted') === '1'; } catch (_) { return false; }
  })(),
  _ctx: null,
  _noise: null,
  _init() {
    if (this._ctx) {
      if (this._ctx.state === 'suspended') this._ctx.resume().catch(() => {});
      return this._ctx.state === 'running' || this._ctx.state === 'suspended';
    }
    try {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)();
      const len = Math.floor(this._ctx.sampleRate * 0.6);
      this._noise = this._ctx.createBuffer(1, len, this._ctx.sampleRate);
      const d = this._noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return true;
    } catch (_) { this._ctx = null; return false; }
  },
  _env(node, t, peak, a, r) {          // fast attack, exp release
    const g = this._ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, peak), t + a);
    g.gain.exponentialRampToValueAtTime(0.0001, t + a + r);
    node.connect(g);
    g.connect(this._ctx.destination);
    return g;
  },
  _hiss(t, peak, dur, f0, f1, type) {  // filtered noise sweep
    const src = this._ctx.createBufferSource();
    src.buffer = this._noise; src.loop = true;
    const fl = this._ctx.createBiquadFilter();
    fl.type = type || 'bandpass'; fl.Q.value = 0.9;
    fl.frequency.setValueAtTime(f0, t);
    fl.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
    src.connect(fl);
    this._env(fl, t, peak, 0.02, dur);
    src.start(t); src.stop(t + dur + 0.1);
  },
  _tone(t, peak, dur, f0, f1, type, a) {
    const o = this._ctx.createOscillator();
    o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(20, f1), t + dur);
    this._env(o, t, peak, a || 0.012, dur);
    o.start(t); o.stop(t + dur + 0.15);
  },
  _go() { return !this.muted && this._init() && this._ctx; },
  fire(incoming) {                     // ballista release: thunk + rising whoosh
    if (!this._go()) return;
    const t = this._ctx.currentTime;
    this._tone(t, 0.16, 0.13, incoming ? 78 : 96, 44, 'sine');
    this._hiss(t + 0.02, 0.10, 0.42, 320, 1500, 'bandpass');
  },
  splash(big) {                        // miss: plop + foamy wash
    if (!this._go()) return;
    const t = this._ctx.currentTime;
    this._tone(t, 0.17, 0.16, 300, 82, 'sine');
    this._hiss(t + 0.03, big ? 0.14 : 0.10, 0.55, 1600, 420, 'lowpass');
  },
  boom(big) {                          // hit: concussion + burning crackle
    if (!this._go()) return;
    const t = this._ctx.currentTime;
    this._tone(t, big ? 0.34 : 0.26, big ? 0.6 : 0.4, 120, 34, 'triangle');
    this._hiss(t, big ? 0.20 : 0.15, big ? 0.5 : 0.34, 2400, 180, 'lowpass');
    for (let i = 0; i < (big ? 7 : 4); i++)             // ember crackles
      this._hiss(t + 0.10 + Math.random() * (big ? 0.55 : 0.35),
                 0.05 + Math.random() * 0.04, 0.05, 2600 + Math.random() * 2200, 900, 'bandpass');
  },
  sunk() {                             // hull groan sliding under + late bubbles
    if (!this._go()) return;
    const t = this._ctx.currentTime;
    this._tone(t + 0.22, 0.20, 1.35, 130, 36, 'sawtooth', 0.10);
    this._tone(t + 0.30, 0.12, 1.0, 96, 30, 'triangle', 0.14);
    for (let i = 0; i < 5; i++)
      this._tone(t + 0.7 + i * 0.16 + Math.random() * 0.06,
                 0.045, 0.09, 340 + Math.random() * 260, 700, 'sine');
  },
  correct() {
    if (!this._go()) return;
    const t = this._ctx.currentTime;
    this._tone(t, 0.10, 0.16, 523.25, 523.25, 'triangle');
    this._tone(t + 0.09, 0.11, 0.24, 783.99, 783.99, 'triangle');
  },
  wrong() {
    if (!this._go()) return;
    const t = this._ctx.currentTime;
    this._tone(t, 0.11, 0.28, 138, 92, 'square');
  },
  gameOver(won) {
    if (!this._go()) return;
    const t = this._ctx.currentTime;
    const seq = won ? [392, 523.25, 659.25, 783.99] : [220, 174.61, 146.83, 110];
    seq.forEach((f, i) => this._tone(t + i * 0.16, 0.10, 0.34, f, f, 'triangle'));
    if (won) this._hiss(t + 0.5, 0.06, 0.7, 900, 2600, 'bandpass');
    else     this._tone(t + 0.55, 0.14, 1.1, 70, 30, 'triangle', 0.1);
  },
};

function _nauToggleMute() {
  NAU_SFX.muted = !NAU_SFX.muted;
  try { localStorage.setItem('nau_muted', NAU_SFX.muted ? '1' : '0'); } catch (_) {}
  const btn = document.getElementById('nau-mute');
  if (btn) {
    btn.classList.toggle('muted', NAU_SFX.muted);
    btn.title = NAU_SFX.muted ? 'Ήχος: σίγαση' : 'Ήχος: ενεργός';
  }
  if (!NAU_SFX.muted) NAU_SFX.correct();
}

// Procedural trireme silhouette (bow-left, ram, mast, billowed sail, oars)
function _nauTriremeSVG(cls) {
  return `<svg class="${cls || 'nau-trireme'}" viewBox="0 0 140 70" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="currentColor">
      <path d="M6 40 L20 36 Q24 35 30 35 L112 35 Q124 35 132 24 Q134 22 137 21 Q133 38 118 46 Q112 49 104 49 L30 49 Q16 49 8 43 Z"/>
      <path d="M2 37 L20 33 L20 41 Z"/>
      <rect x="68" y="6" width="2.6" height="30" rx="1"/>
      <path d="M46 8 Q69 0 92 8 L92 26 Q69 19 46 26 Z" opacity=".85"/>
      <path d="M118 20 Q126 12 124 4 Q132 10 128 22 Z" opacity=".9"/>
      <circle cx="22" cy="38" r="1.6" opacity=".55"/>
    </g>
    <g stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".75">
      <line x1="34" y1="49" x2="28" y2="60"/>
      <line x1="46" y1="49" x2="40" y2="60"/>
      <line x1="58" y1="49" x2="52" y2="60"/>
      <line x1="70" y1="49" x2="64" y2="60"/>
      <line x1="82" y1="49" x2="76" y2="60"/>
      <line x1="94" y1="49" x2="88" y2="60"/>
    </g>
  </svg>`;
}

// Tiny hull glyph used for the fleet-strength pips
const NAU_PIP_SVG = '<svg viewBox="0 0 24 12" aria-hidden="true"><path fill="currentColor" d="M1 6 L5 4.6 L19 4.6 Q22.4 4.6 23.4 2.2 Q22.8 8.2 17.6 10.6 L5.4 10.6 Q2.4 9.6 1 6 Z"/><rect fill="currentColor" x="11" y="0.5" width="1.4" height="5" rx="0.7"/></svg>';

// Victory laurel (with trireme heart) / defeat sinking-ship emblems
function _nauLaurelSVG() {
  let leaves = '';
  for (let i = 0; i < 8; i++) {
    const aL = -152 + i * 17.5;
    const aR = 152 - i * 17.5;
    leaves += `<g transform="rotate(${aL} 60 60)"><ellipse cx="60" cy="15" rx="4.6" ry="12" transform="rotate(24 60 15)" /></g>`;
    leaves += `<g transform="rotate(${aR} 60 60)"><ellipse cx="60" cy="15" rx="4.6" ry="12" transform="rotate(-24 60 15)" /></g>`;
  }
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <g fill="currentColor" opacity=".92">${leaves}</g>
    <path d="M60 108 A48 48 0 0 1 15 46" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M60 108 A48 48 0 0 0 105 46" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>
    <g transform="translate(24 42) scale(0.52)">
      <path fill="currentColor" d="M6 40 L20 36 Q24 35 30 35 L112 35 Q124 35 132 24 Q134 22 137 21 Q133 38 118 46 Q112 49 104 49 L30 49 Q16 49 8 43 Z"/>
      <path fill="currentColor" d="M2 37 L20 33 L20 41 Z"/>
      <rect fill="currentColor" x="68" y="6" width="2.6" height="30" rx="1"/>
      <path fill="currentColor" d="M46 8 Q69 0 92 8 L92 26 Q69 19 46 26 Z" opacity=".85"/>
    </g>
  </svg>`;
}

function _nauSunkSVG() {
  return `<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs><clipPath id="nau-sunk-clip"><rect x="0" y="0" width="120" height="76"/></clipPath></defs>
    <g clip-path="url(#nau-sunk-clip)">
      <g transform="rotate(-22 60 66) translate(14 34) scale(0.66)">
        <path fill="currentColor" d="M6 40 L20 36 Q24 35 30 35 L112 35 Q124 35 132 24 Q134 22 137 21 Q133 38 118 46 Q112 49 104 49 L30 49 Q16 49 8 43 Z"/>
        <path fill="currentColor" d="M2 37 L20 33 L20 41 Z"/>
        <rect fill="currentColor" x="68" y="-4" width="2.6" height="40" rx="1"/>
        <path fill="currentColor" d="M46 0 Q69 -8 92 0 L92 20 Q69 13 46 20 Z" opacity=".8"/>
      </g>
    </g>
    <path d="M4 78 Q14 70 24 78 T44 78 T64 78 T84 78 T104 78 T124 78" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M4 90 Q14 83 24 90 T44 90 T64 90 T84 90 T104 90 T124 90" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity=".55"/>
    <circle cx="78" cy="62" r="2.6" fill="none" stroke="currentColor" stroke-width="1.4" opacity=".7"/>
    <circle cx="86" cy="52" r="1.8" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".55"/>
    <circle cx="82" cy="42" r="1.2" fill="none" stroke="currentColor" stroke-width="1" opacity=".4"/>
  </svg>`;
}

// ── Question bank (naval history) ─────────────────────────────
const NAU_QB = [
  { q:'Σε ποια ναυμαχία νίκησαν οι Αθηναίοι τον Περσικό στόλο;',          opts:['Θερμοπύλες','Σαλαμίς','Μαραθώνας','Πλαταιές'],             ans:1 },
  { q:'Πώς ονομαζόταν το κύριο πολεμικό πλοίο της Αρχαίας Ελλάδας;',      opts:['Δίκροτο','Τριήρης','Πεντακόντορος','Τριακόντορος'],         ans:1 },
  { q:'Ποιος Αθηναίος στρατηγός σχεδίασε την τακτική της Σαλαμίνας;',     opts:['Αριστείδης','Κίμων','Θεμιστοκλής','Μιλτιάδης'],            ans:2 },
  { q:'Τι είναι το «έμβολο» σε αρχαίο πολεμικό πλοίο;',                   opts:['Πανί','Κουπί','Μεταλλικός ακίδας εμβολισμού','Πύργος'],     ans:2 },
  { q:'Πόσες σειρές κωπηλατών είχε μια τριήρης;',                         opts:['1','2','3','4'],                                             ans:2 },
  { q:'Ποιος ήταν ο ρόλος του «κελευστή» στην τριήρη;',                   opts:['Κυβερνήτης','Ρυθμιστής κωπηλασίας','Αρχηγός','Ταμίας'],    ans:1 },
  { q:'Σε ποια ναυμαχία νίκησαν οι Σπαρτιάτες τους Αθηναίους (405 π.Χ.);', opts:['Πύλος','Αργινούσαι','Αιγός Ποταμοί','Σύμη'],              ans:2 },
  { q:'Τι σημαίνει η λέξη «ναύαρχος»;',                                   opts:['Αρχηγός στρατού','Αρχηγός στόλου','Πλοίαρχος','Ταμίας'],   ans:1 },
  { q:'Ποιος Σπαρτιάτης ναύαρχος νίκησε στους Αιγός Ποταμούς;',           opts:['Λύσανδρος','Βρασίδας','Γύλιππος','Αγησίλαος'],             ans:0 },
  { q:'Πόσοι κωπηλάτες είχε μια τριήρης κατά προσέγγιση;',                opts:['54','100','170','220'],                                       ans:2 },
  { q:'Ποιος ποιητής περιέγραψε τη Ναυμαχία της Σαλαμίνας στους Πέρσες;', opts:['Σοφοκλής','Αισχύλος','Ευριπίδης','Αριστοφάνης'],           ans:1 },
  { q:'Πού διεξήχθη η ναυμαχία της Αρτεμισίου;',                          opts:['Σαλαμίνα','Εύβοια','Ρόδος','Ναύπακτος'],                    ans:1 },
  { q:'Τι ονομαζόταν ο χρηματοδότης πολεμικού πλοίου στην Αθήνα;',        opts:['Στρατηγός','Ναύαρχος','Τριήραρχος','Κυβερνήτης'],           ans:2 },
  { q:'Ποια πόλη-κράτος είχε τον ισχυρότερο στόλο τον 5ο αι. π.Χ.;',     opts:['Σπάρτη','Κόρινθος','Αθήνα','Ρόδος'],                        ans:2 },
  { q:'Σε ποια ναυμαχία ηττήθηκαν οι Αθηναίοι στη Σικελία;',              opts:['Ασσίναρος','Σαλαμίς Κύπρου','Αιγός Ποταμοί','Σύβοτα'],     ans:0 },
  { q:'Τι σημαίνει «τριακόντορος»;',                                       opts:['Πλοίο 30 κωπηλατών','30 πήχεων','3 καταστρωμάτων','3 ιστών'], ans:0 },
  { q:'Ποιον κατέστρεψαν οι Αθηναίοι στον Ευρυμέδοντα;',                  opts:['Σπαρτιάτες','Μακεδόνες','Πέρσες','Κορινθίους'],             ans:2 },
  { q:'Ποιο αξίωμα είχε ο επικεφαλής του αρχαίου ελληνικού στόλου;',      opts:['Στρατηγός','Ναύαρχος','Βασιλεύς','Πολέμαρχος'],             ans:1 },
  { q:'Ποια πόλη έχτισε τον «Μακρό Τείχος» για να προστατέψει τον Πειραιά;', opts:['Σπάρτη','Αθήνα','Κόρινθος','Θήβα'],                    ans:1 },
  { q:'Τι ήταν η «διέκπλους» τακτική;',                                    opts:['Εμβολισμός από μπροστά','Διάσχιση της εχθρικής γραμμής','Φυγή','Απόβαση'], ans:1 },
];

// Normalise any injected item to this game's {q, opts, ans} shape. Accepts the
// native {q, opts, ans}, the app-wide Game-Panel bank {q:{gr,en}|str, a:[…], c}
// (window.SYM_QUESTIONS — the "Διάλεξε ύλη" picker), and {q, a, correct}.
function _nauNorm(it) {
  if (!it) return null;
  const q = (it.q && typeof it.q === 'object') ? (it.q.gr || it.q.en || '') : (it.q || '');
  const opts = Array.isArray(it.opts) ? it.opts : (Array.isArray(it.a) ? it.a : []);
  let ans = typeof it.ans === 'number' ? it.ans
          : typeof it.c === 'number' ? it.c
          : typeof it.correct === 'number' ? it.correct : 0;
  if (ans < 0 || ans >= opts.length) ans = 0;
  return (q && opts.length >= 2) ? { q: String(q), opts: opts.map(String), ans } : null;
}
function _nauGetQuestion() {
  // Content-picker bank, in priority: nav.js level pool → the mode:'sym' picker
  // bank (window.SYM_QUESTIONS) → built-in naval questions. Normalise so the
  // picked ύλη actually plays (previously SYM_QUESTIONS was ignored).
  const injected = (window._gpNauPool && window._gpNauPool.length) ? window._gpNauPool
                 : (Array.isArray(window.SYM_QUESTIONS) && window.SYM_QUESTIONS.length ? window.SYM_QUESTIONS : null);
  if (injected) {
    const idx = ((window._gpNauIdx || 0)) % injected.length;
    window._gpNauIdx = idx + 1;
    const norm = _nauNorm(injected[idx]);
    if (norm) return norm;
  }
  // Merge with QUESTIONS.gr.all if the trivia game is loaded
  const extra = (typeof QUESTIONS !== 'undefined' && QUESTIONS?.gr?.all) || [];
  const pool  = [...NAU_QB, ...extra];
  return pool[Math.floor(Math.random() * pool.length)];
}

// ── State ─────────────────────────────────────────────────────
let NAU = null;

function _nauMk2D() {
  return Array.from({ length: NAU_SIZE }, () => Array(NAU_SIZE).fill(null));
}

// ── Open / Close ──────────────────────────────────────────────
function openNaumachia(cfg) {
  const ov = document.getElementById('naumachia-overlay');
  if (!ov) return;
  _nauCleanup();
  NAU = {
    mode:   null,
    phase:  null,
    // My fleet
    myBoard:  _nauMk2D(),        // null | shipId (0-4)
    myHits:   _nauMk2D(),        // null | 'hit' | 'miss'  ← enemy fires here
    myShips:  NAU_FLEET.map(s => ({ ...s, cells: [], hits: new Set(), sunk: false })),
    myAlive:  5,
    // Enemy fleet
    enemyBoard:  _nauMk2D(),     // null | shipId (AI only; PvP kept local)
    myShots:     _nauMk2D(),     // null | 'hit' | 'miss'  ← I fire here
    enemyShips:  NAU_FLEET.map(s => ({ ...s, cells: [], hits: new Set(), sunk: false })),
    enAlive:  5,
    // Placement state
    placing: null,               // shipId currently in hand
    rot:     'h',                // 'h' | 'v'
    // Turn
    myTurn:  true,
    // AI
    ai: { mode: 'hunt', queue: [] },
    // PvP
    pvp: { matchId: null, myRole: null, myId: null, unsub: null,
           _gotShot: null, _gotResult: null },
    // Shot pending question answer
    pendingFire: null,
    // Canvas / Particles
    cv:  {},
    raf: null,
  };
  _nauBuild();
  ov.classList.add('active');
  // When launched via GP: skip the internal mode-selector menu
  if (cfg && cfg.pvp === false) { _nauMode('ai'); }
  else if (cfg && cfg.pvp === true) { _nauMode('pvp'); }
  else { _nauPhase('menu'); }
}

function closeNaumachia() {
  if (window.SymFlappy) SymFlappy.unmount();
  _nauCleanup();
  document.getElementById('naumachia-overlay')?.classList.remove('active');
}

function _nauCleanup() {
  if (!NAU) return;
  NAU.pvp?.unsub?.();
  if (NAU.raf) cancelAnimationFrame(NAU.raf);
  NAU = null;
}

// ── HTML skeleton ─────────────────────────────────────────────
function _nauBuild() {
  const ov = document.getElementById('naumachia-overlay');
  if (!ov) return;
  const frame = ov.querySelector('.overlay-frame') || ov;

  const dockHTML = NAU_FLEET.map(s => `
    <div class="nau-dock-ship" id="nau-ds-${s.id}" onclick="_nauPickShip(${s.id})">
      <span class="nau-dock-name">${s.name}</span>
      <div class="nau-dock-blocks">${'<div class="nau-dock-block"></div>'.repeat(s.len)}</div>
    </div>`).join('');

  frame.innerHTML = `<div class="nau-root" id="nau-root">

  <!-- ══ AMBIENT AEGEAN CHART (decorative) ══ -->
  <div class="nau-sea" aria-hidden="true">
    <div class="nau-sea-chart"></div>
    <div class="nau-sea-glow"></div>
    <div class="nau-sea-ships">
      ${_nauTriremeSVG('nau-trireme s1')}
      ${_nauTriremeSVG('nau-trireme s2')}
      ${_nauTriremeSVG('nau-trireme s3')}
    </div>
    <div class="nau-sea-waves"><i></i><i></i><i></i></div>
  </div>

  <!-- ══ MENU ══ -->
  <div class="nau-phase" id="nau-ph-menu">
    <div class="nau-menu">
      ${_nauTriremeSVG('nau-emblem')}
      <p class="nau-kicker">Σαλαμίς &middot; 480 π.Χ.</p>
      <h1 class="nau-title">ΝΑΥΜΑΧΙΑ</h1>
      <p class="nau-subtitle">Ναυτική Σύγκρουση &middot; 5ος αι. π.Χ.</p>
      <div class="nau-hr"></div>
      <div class="nau-menu-btns">
        <button class="nau-btn nau-btn-primary nau-mode-btn" onclick="_nauMode('ai')">
          <span class="nau-mode-ico">⚔</span>
          <span class="nau-mode-txt"><strong>Εναντίον Υπολογιστή</strong><small>Αντιμετώπισε τον Πέρση ναύαρχο</small></span>
        </button>
        <button class="nau-btn nau-mode-btn" onclick="_nauMode('pvp')">
          <span class="nau-mode-ico">⚓</span>
          <span class="nau-mode-txt"><strong>Εναντίον Παίκτη (PvP)</strong><small>Ναυμαχία με άλλον παίκτη</small></span>
        </button>
      </div>
    </div>
  </div>

  <!-- ══ MATCHMAKING ══ -->
  <div class="nau-phase" id="nau-ph-mm">
    <div class="nau-matchmaking">
      <div class="nau-wait">
        ${_nauTriremeSVG('nau-trireme')}
        <div class="nau-wait-sea"></div>
      </div>
      <p id="nau-mm-msg">Αναζήτηση αντιπάλου…</p>
      <div id="nau-code-wrap" style="display:none;text-align:center">
        <div style="font-size:.6rem;color:var(--nau-txtm);letter-spacing:.2em;text-transform:uppercase;margin-bottom:6px">Κωδικός Παρτίδας</div>
        <div class="nau-code-box" id="nau-code-box"></div>
      </div>
      <button class="nau-btn nau-btn-sm nau-btn-danger" onclick="_nauCancelMM()">✕ Ακύρωση</button>
      <!-- "while you wait" mini-game (matchmaking) -->
      <div class="nau-flappy-slot" id="nau-flappy"></div>
    </div>
  </div>

  <!-- ══ PLACEMENT ══ -->
  <div class="nau-phase" id="nau-ph-place">
    <div class="nau-place-wrap">
      <div class="nau-place-header">
        <h2>Τοποθέτηση Πλοίων
          <span class="nau-place-hint">Επίλεξε πλοίο από τον ναύσταθμο και τοποθέτησέ το στον χάρτη</span>
        </h2>
        <div class="nau-place-controls">
          <button class="nau-btn nau-btn-sm" onclick="_nauRotate()">↻ Περιστροφή</button>
          <button class="nau-btn nau-btn-sm" onclick="_nauRandPlace()">⚄ Τυχαία</button>
          <button class="nau-btn nau-btn-sm nau-btn-primary" id="nau-conf" onclick="_nauConfirmPlace()" disabled>→ Επίθεση!</button>
        </div>
      </div>
      <div class="nau-place-body">
        <div class="nau-dock" id="nau-dock">
          <div class="nau-dock-hd">Ναύσταθμος</div>
          ${dockHTML}
        </div>
        <div class="nau-board-sec">
          <div class="nau-board-lbl">Ο ΣΤΟΛΟΣ ΜΟΥ</div>
          ${_nauGridHTML('nau-pg')}
        </div>
      </div>
    </div>
  </div>

  <!-- ══ COMBAT ══ -->
  <div class="nau-phase" id="nau-ph-combat">
    <div class="nau-combat-wrap">
      <div class="nau-status-bar">
        <span class="nau-status-txt" id="nau-stat">Ετοιμαστείτε…</span>
        <div class="nau-status-right">
          <div class="nau-ships-rem">
            <span class="me"  id="nau-my-alive"></span>
            <span class="vs">⚔</span>
            <span class="them" id="nau-en-alive"></span>
          </div>
          <button class="nau-mute${NAU_SFX.muted ? ' muted' : ''}" id="nau-mute" type="button"
            onclick="_nauToggleMute()" aria-label="Ήχος"
            title="${NAU_SFX.muted ? 'Ήχος: σίγαση' : 'Ήχος: ενεργός'}"></button>
        </div>
      </div>
      <div class="nau-boards-wrap" id="nau-boards">
        <canvas class="nau-fx-canvas" id="nau-fx" aria-hidden="true"></canvas>
        <div class="nau-board-sec">
          <div class="nau-board-lbl">Ο ΣΤΟΛΟΣ ΜΟΥ</div>
          ${_nauGridHTML('nau-mg')}
        </div>
        <div class="nau-board-sec">
          <div class="nau-board-lbl">ΕΧΘΡΙΚΟΣ ΣΤΟΛΟΣ</div>
          ${_nauGridHTML('nau-eg')}
        </div>
      </div>
    </div>
  </div>

  <!-- ══ GAME OVER ══ -->
  <div class="nau-phase" id="nau-ph-over">
    <div class="nau-over">
      <div class="nau-over-icon" id="nau-ov-icon"></div>
      <h2 class="nau-over-title" id="nau-ov-title">—</h2>
      <p class="nau-over-msg" id="nau-ov-msg"></p>
      <div class="nau-over-stats" id="nau-ov-stats"></div>
      <div class="nau-over-btns">
        <button class="nau-btn nau-btn-primary nau-btn-sm" onclick="openNaumachia()">Νέα Ναυμαχία</button>
        <button class="nau-btn nau-btn-sm" onclick="closeNaumachia()">← Έξοδος</button>
      </div>
    </div>
  </div>

  <!-- ══ QUESTION MODAL ══ -->
  <div class="nau-q-overlay" id="nau-qov">
    <div class="nau-q-modal">
      <div class="nau-q-hd">Πριν Επιτεθείς</div>
      <p class="nau-q-sub">Απάντησε σωστά για να ρίξεις τη βολή σου</p>
      <div class="nau-q-text" id="nau-qt"></div>
      <div class="nau-q-opts" id="nau-qo"></div>
    </div>
  </div>

</div>`;

  // Populate grids after DOM is ready
  _nauInitGrid('nau-pg', _nauPlaceClick, _nauPlaceHover, _nauClearHover);
  _nauInitGrid('nau-mg', null, null, null);
  _nauInitGrid('nau-eg', _nauEnemyClick, null, null);
}

// Returns the outer HTML wrapper for a labeled grid
// (water shimmer, compass rose and fleet-piece layers are visual only)
function _nauGridHTML(id) {
  const cols = 'ΑΒΓΔΕΖΗΘΙΚ'.split('');
  const rows  = [...Array(10)].map((_, i) => i + 1);
  return `<div class="nau-grid-outer">
    <div class="nau-col-labels">${cols.map(c => `<div class="nau-ax-lbl">${c}</div>`).join('')}</div>
    <div class="nau-row-labels">${rows.map(r => `<div class="nau-ax-lbl">${r}</div>`).join('')}</div>
    <div class="nau-grid-wrap">
      <div class="nau-grid" id="${id}"></div>
      <div class="nau-grid-water" aria-hidden="true"></div>
      <div class="nau-grid-rose" aria-hidden="true"></div>
      <div class="nau-ships-layer" id="${id}-ships" aria-hidden="true"></div>
      <canvas class="nau-canvas" id="${id}-c"></canvas>
    </div>
  </div>`;
}

// ── Fleet pieces (visual layer): top-down trireme tokens ──────
// Parametric deck-view trireme spanning `len` cells: bronze ram,
// planked hull, oar banks, shield row, mast + yard, steering oars.
function _nauShipPieceSVG(len, uid) {
  const W = len * 36, H = 36, mid = H / 2;
  const gHull = 'nphull-' + uid, gDeck = 'npdeck-' + uid;
  let oars = '';
  for (let x = 16; x <= W - 18; x += 8.5) {
    oars += `<line x1="${x}" y1="7.4" x2="${x - 3.2}" y2="1.8"/>`;
    oars += `<line x1="${x}" y1="${H - 7.4}" x2="${x - 3.2}" y2="${H - 1.8}"/>`;
  }
  let shields = '';
  if (len >= 3) {
    for (let x = 18; x <= W - 20; x += 8.5)
      shields += `<circle cx="${x}" cy="10" r="1.2"/><circle cx="${x}" cy="${H - 10}" r="1.2"/>`;
  }
  let beams = '';
  for (let i = 1; i < len; i++)
    beams += `<line x1="${i * 36 - 1}" y1="9" x2="${i * 36 - 1}" y2="${H - 9}"/>`;
  return `<svg class="nau-piece-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <defs>
      <linearGradient id="${gHull}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#8E6832"/><stop offset="0.45" stop-color="#6E4C24"/><stop offset="1" stop-color="#3F2810"/>
      </linearGradient>
      <linearGradient id="${gDeck}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#54371A"/><stop offset="0.5" stop-color="#7E5829"/><stop offset="1" stop-color="#54371A"/>
      </linearGradient>
    </defs>
    <g stroke="rgba(201,164,74,0.55)" stroke-width="1.1" stroke-linecap="round">${oars}</g>
    <path d="M2.5 ${mid} Q7 9.5 21 7.6 L${W - 16} 7.6 Q${W - 5} 9.4 ${W - 3.5} ${mid} Q${W - 5} ${H - 9.4} ${W - 16} ${H - 7.6} L21 ${H - 7.6} Q7 ${H - 9.5} 2.5 ${mid} Z"
      fill="url(#${gHull})" stroke="rgba(20,10,2,0.85)" stroke-width="1"/>
    <path d="M6.5 ${mid} Q10.5 12 22 10.4 L${W - 17} 10.4 Q${W - 8} 11.8 ${W - 6.6} ${mid} Q${W - 8} ${H - 11.8} ${W - 17} ${H - 10.4} L22 ${H - 10.4} Q10.5 ${H - 12} 6.5 ${mid} Z"
      fill="url(#${gDeck})" opacity="0.92"/>
    <g stroke="rgba(20,10,2,0.4)" stroke-width="1">${beams}</g>
    <line x1="11" y1="${mid}" x2="${W - 9}" y2="${mid}" stroke="rgba(255,226,160,0.22)" stroke-width="1.6"/>
    <g fill="rgba(201,164,74,0.5)">${shields}</g>
    <path d="M0 ${mid} L9.5 ${mid - 3.8} L9.5 ${mid + 3.8} Z" fill="#C9A44A" opacity="0.95"/>
    <line x1="${W / 2}" y1="6.6" x2="${W / 2}" y2="${H - 6.6}" stroke="rgba(233,224,200,0.42)" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="${W / 2}" cy="${mid}" r="3" fill="#2E1C0C" stroke="rgba(201,164,74,0.8)" stroke-width="1.1"/>
    <line x1="${W - 7}" y1="12.5" x2="${W - 1.5}" y2="8.6" stroke="rgba(140,90,40,0.9)" stroke-width="1.6" stroke-linecap="round"/>
    <line x1="${W - 7}" y1="${H - 12.5}" x2="${W - 1.5}" y2="${H - 8.6}" stroke="rgba(140,90,40,0.9)" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`;
}

// Positions one persistent trireme token per placed ship over grid `gid`.
// Purely presentational — reads ship state, never writes it. Pieces keep
// their DOM identity across calls so the sink animation runs exactly once.
function _nauSyncPieces(gid, ships, wreckOnly) {
  const layer = document.getElementById(gid + '-ships');
  const grid  = document.getElementById(gid);
  if (!layer || !grid) return;
  const gr = grid.getBoundingClientRect();
  if (!gr.width) return;
  const seen = new Set();
  for (const s of ships) {
    if (!s || !s.cells || !s.cells.length) continue;
    if (wreckOnly && !s.sunk) continue;
    let minR = 99, minC = 99, maxR = -1, maxC = -1;
    for (const [r, c] of s.cells) {
      if (r < minR) minR = r; if (r > maxR) maxR = r;
      if (c < minC) minC = c; if (c > maxC) maxC = c;
    }
    const c1 = grid.children[minR * NAU_SIZE + minC];
    const c2 = grid.children[maxR * NAU_SIZE + maxC];
    if (!c1 || !c2) continue;
    const r1 = c1.getBoundingClientRect(), r2 = c2.getBoundingClientRect();
    const x = r1.left - gr.left, y = r1.top - gr.top;
    const w = r2.right - r1.left, h = r2.bottom - r1.top;
    const vert = maxR > minR;
    const pid  = gid + '-piece-' + s.id;
    seen.add(pid);
    let el = document.getElementById(pid);
    if (!el) {
      el = document.createElement('div');
      el.id = pid;
      el.className = 'nau-piece' + (wreckOnly ? ' wreck' : '');
      el.innerHTML = `<div class="nau-piece-in">${_nauShipPieceSVG(s.cells.length, pid)}</div>`;
      layer.appendChild(el);
    }
    const L = vert ? h : w, S = vert ? w : h;
    el.style.width  = L + 'px';
    el.style.height = S + 'px';
    if (vert) {
      el.style.left = (x + S / 2 - L / 2) + 'px';
      el.style.top  = (y + L / 2 - S / 2) + 'px';
      el.style.transform = 'rotate(90deg)';
    } else {
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      el.style.transform = '';
    }
    el.classList.toggle('sunk', !!s.sunk);
  }
  Array.prototype.forEach.call(Array.from(layer.children), ch => {
    if (!seen.has(ch.id)) ch.remove();
  });
}

// Builds cell divs inside a grid and wires up events
function _nauInitGrid(id, onClick, onEnter, onLeave) {
  const grid = document.getElementById(id);
  if (!grid) return;
  grid.innerHTML = '';
  for (let r = 0; r < NAU_SIZE; r++) {
    for (let c = 0; c < NAU_SIZE; c++) {
      const cell = document.createElement('div');
      cell.className   = 'nau-cell';
      cell.dataset.r   = r;
      cell.dataset.c   = c;
      if (onClick)  cell.addEventListener('click',      () => onClick(r, c));
      if (onEnter)  cell.addEventListener('mouseenter', () => onEnter(r, c));
      if (onLeave)  cell.addEventListener('mouseleave', () => onLeave());
      grid.appendChild(cell);
    }
  }
  requestAnimationFrame(() => _nauSizeCanvas(id));
}

// Returns a single cell element
function _nauCell(gid, r, c) {
  return document.getElementById(gid)?.children[r * NAU_SIZE + c] || null;
}

// Sizes canvas to exactly cover its companion grid, starts anim loop
function _nauSizeCanvas(id) {
  const grid = document.getElementById(id);
  const cv   = document.getElementById(id + '-c');
  if (!grid || !cv || !NAU) return;
  cv.width  = grid.offsetWidth;
  cv.height = grid.offsetHeight;
  if (!NAU.cv[id]) NAU.cv[id] = { el: cv, ctx: cv.getContext('2d'), particles: [], shots: [], rings: [] };
  else {
    NAU.cv[id].el  = cv;
    NAU.cv[id].ctx = cv.getContext('2d');
    NAU.cv[id].shots = NAU.cv[id].shots || [];
    NAU.cv[id].rings = NAU.cv[id].rings || [];
  }
  if (!NAU.raf) _nauAnimLoop();
}

// ── Phase control ─────────────────────────────────────────────
function _nauPhase(name) {
  NAU.phase = name;
  document.querySelectorAll('#nau-root .nau-phase').forEach(p => p.classList.remove('active'));
  document.getElementById('nau-ph-' + name)?.classList.add('active');

  // "While you wait" Flappy mini-game: only during matchmaking; one shared
  // instance, stopped on every other phase.
  if (window.SymFlappy) {
    if (name === 'mm') SymFlappy.mount(document.getElementById('nau-flappy'));
    else SymFlappy.unmount();
  }
}

// ── Menu ──────────────────────────────────────────────────────
function _nauMode(mode) {
  if (!NAU) return;
  NAU.mode = mode;
  if (mode === 'ai') {
    _nauPhase('place');
  } else {
    _nauPhase('mm');
    _nauMatchmake();
  }
}

// ── Matchmaking (PvP / Firestore) ─────────────────────────────
async function _nauMatchmake() {
  if (!NAU) return;

  // Firestore rules require request.auth != null for naumachia_matches
  // (read + create + update). A signed-out client would silently fail with a
  // permission error, so prompt sign-in instead and bail back to the menu.
  const _authed = (typeof currentUser !== 'undefined' && currentUser)
    || (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser);
  if (!_authed) {
    const msgEl = document.getElementById('nau-mm-msg');
    if (msgEl) msgEl.textContent = 'Απαιτείται σύνδεση για PvP.';
    if (typeof openAuthModal === 'function') openAuthModal('login');
    // Return to the menu so the spinner doesn't hang forever.
    setTimeout(() => { if (NAU && NAU.phase === 'mm') _nauPhase('menu'); }, 1200);
    return;
  }

  const db   = firebase.firestore();
  const col  = db.collection('naumachia_matches');
  const myId = 'nau_' + Math.random().toString(36).slice(2, 10);
  NAU.pvp.myId = myId;

  try {
    const snap = await col
      .where('status', '==', 'waiting')
      .orderBy('createdAt')
      .limit(1)
      .get();

    if (!snap.empty) {
      // Join as player 2
      const doc = snap.docs[0];
      NAU.pvp.matchId = doc.id;
      NAU.pvp.myRole  = 'p2';
      await doc.ref.update({ p2Id: myId, p2Uid: _authed.uid, status: 'placement', p2Ready: false });
      _nauPvPListen();
      _nauPhase('place');
    } else {
      // Create new match as player 1
      const ref = await col.add({
        status:    'waiting',
        p1Id:      myId,
        p1Uid:     _authed.uid,
        p2Id:      null,
        p2Uid:     null,
        p1Ready:   false,
        p2Ready:   false,
        turn:      'p1',
        currentShot: null,
        p1Sunk:    [],
        p2Sunk:    [],
        winner:    null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      NAU.pvp.matchId = ref.id;
      NAU.pvp.myRole  = 'p1';
      const code = ref.id.slice(-6).toUpperCase();
      document.getElementById('nau-mm-msg').textContent     = 'Αναμονή αντιπάλου…';
      document.getElementById('nau-code-wrap').style.display = 'block';
      document.getElementById('nau-code-box').textContent    = code;
      _nauPvPListen();
    }
  } catch (e) {
    console.error('[Naumachia] matchmaking error:', e);
    if (document.getElementById('nau-mm-msg'))
      document.getElementById('nau-mm-msg').textContent = 'Σφάλμα σύνδεσης. Δοκιμάστε ξανά.';
  }
}

function _nauCancelMM() {
  if (NAU?.pvp?.unsub) NAU.pvp.unsub();
  if (NAU?.pvp?.matchId && NAU?.pvp?.myRole === 'p1') {
    firebase.firestore().collection('naumachia_matches')
      .doc(NAU.pvp.matchId).delete().catch(() => {});
  }
  if (NAU) { NAU.pvp.matchId = null; NAU.pvp.myRole = null; }
  _nauPhase('menu');
}

function _nauPvPListen() {
  if (!NAU?.pvp?.matchId) return;
  const ref = firebase.firestore()
    .collection('naumachia_matches')
    .doc(NAU.pvp.matchId);
  NAU.pvp.unsub = ref.onSnapshot(snap => {
    if (!snap.exists || !NAU) return;
    _nauPvPHandle(snap.data());
  }, err => console.error('[Naumachia] snapshot error:', err));
}

function _nauPvPHandle(data) {
  if (!NAU) return;
  const me = NAU.pvp.myRole;           // 'p1' | 'p2'
  const op = me === 'p1' ? 'p2' : 'p1';

  // Opponent joined → we can start placement (p1 sees this)
  if (data.status === 'placement' && NAU.phase === 'mm') {
    _nauPhase('place');
    return;
  }

  // Game over
  if (data.winner) {
    _nauGameOver(data.winner === me);
    return;
  }

  // Both ready → start combat
  if (data.p1Ready && data.p2Ready && NAU.phase !== 'combat') {
    _nauStartCombat();
    const mine = data.turn === me;
    NAU.myTurn = mine;
    _nauSetStatus(mine ? 'Η σειρά σου — Επίτεθου!' : 'Αναμονή αντιπάλου…',
                  mine ? 'myturn' : 'waiting');
    return;
  }

  if (NAU.phase !== 'combat') return;

  const shot = data.currentShot;
  if (!shot) return;

  // ── Opponent shot at me (result still null) ──
  const incomingKey = `${shot.by}:${shot.r},${shot.c}`;
  if (shot.by === op && shot.result === null && NAU.pvp._gotShot !== incomingKey) {
    NAU.pvp._gotShot = incomingKey;
    const { r, c } = shot;
    const result    = _nauProcessIncoming(r, c);
    const sunkShip  = result === 'hit'
      ? NAU.myShips.find(s => s.sunk && !s._pvpDeclared)
      : null;
    if (sunkShip) sunkShip._pvpDeclared = true;

    _nauRenderMyGrid();
    _nauDoEffect(r, c, result, sunkShip, 'nau-mg');
    _nauUpdateCounts();

    const updates = {
      currentShot: { ...shot, result, sunkShip: sunkShip
        ? { id: sunkShip.id, cells: sunkShip.cells } : null },
      turn: result === 'hit' ? op : me,
    };
    if (NAU.myAlive <= 0) updates.winner = op;

    firebase.firestore().collection('naumachia_matches')
      .doc(NAU.pvp.matchId).update(updates).catch(() => {});
    return;
  }

  // ── My shot result came back ──
  const resultKey = `${shot.by}:${shot.r},${shot.c}:${shot.result}`;
  if (shot.by === me && shot.result !== null && NAU.pvp._gotResult !== resultKey) {
    NAU.pvp._gotResult = resultKey;
    const { r, c, result, sunkShip } = shot;
    NAU.myShots[r][c] = result;
    if (sunkShip) {
      const es = NAU.enemyShips.find(s => s.id === sunkShip.id);
      if (es) { es.cells = sunkShip.cells; es.sunk = true; }
    }
    _nauRenderEnemyGrid();
    _nauDoEffect(r, c, result, sunkShip ? { cells: sunkShip.cells } : null, 'nau-eg');
    _nauUpdateCounts();
    if (NAU.enAlive <= 0) { _nauGameOver(true); return; }

    const mine = data.turn === me;
    NAU.myTurn = mine;
    _nauSetStatus(mine ? 'Η σειρά σου — Επίτεθου!' : 'Αναμονή αντιπάλου…',
                  mine ? 'myturn' : 'waiting');
    _nauRenderEnemyGrid();
  }
}

// ── Placement ─────────────────────────────────────────────────
function _nauPickShip(id) {
  if (!NAU) return;
  NAU.placing = id;
  document.querySelectorAll('.nau-dock-ship').forEach(el => el.classList.remove('nau-selected'));
  document.getElementById('nau-ds-' + id)?.classList.add('nau-selected');
}

function _nauRotate() {
  if (!NAU) return;
  NAU.rot = NAU.rot === 'h' ? 'v' : 'h';
}

// Returns the cells a ship would occupy at (r,c) with current rotation
function _nauShipCells(shipId, r, c) {
  const len = NAU_FLEET[shipId].len;
  return NAU.rot === 'h'
    ? Array.from({ length: len }, (_, i) => [r, c + i])
    : Array.from({ length: len }, (_, i) => [r + i, c]);
}

// Checks if cells are all in-bounds and not already occupied (excluding own prior cells)
function _nauCanPlace(cells, ownOldCells = []) {
  const oldSet = new Set(ownOldCells.map(([r, c]) => `${r},${c}`));
  for (const [r, c] of cells) {
    if (r < 0 || r >= NAU_SIZE || c < 0 || c >= NAU_SIZE) return false;
    if (NAU.myBoard[r][c] !== null && !oldSet.has(`${r},${c}`)) return false;
  }
  return true;
}

function _nauPlaceHover(r, c) {
  if (!NAU || NAU.placing === null) return;
  _nauClearHover();
  const cells = _nauShipCells(NAU.placing, r, c);
  const cls   = _nauCanPlace(cells, NAU.myShips[NAU.placing].cells) ? 'prev-ok' : 'prev-bad';
  for (const [pr, pc] of cells) {
    if (pr >= 0 && pr < NAU_SIZE && pc >= 0 && pc < NAU_SIZE)
      _nauCell('nau-pg', pr, pc)?.classList.add(cls);
  }
}

function _nauClearHover() {
  document.querySelectorAll('#nau-pg .nau-cell')
    .forEach(el => el.classList.remove('prev-ok', 'prev-bad'));
}

function _nauPlaceClick(r, c) {
  if (!NAU || NAU.placing === null) return;
  const id    = NAU.placing;
  const ship  = NAU.myShips[id];
  const cells = _nauShipCells(id, r, c);
  if (!_nauCanPlace(cells, ship.cells)) return;

  // Remove old cells from board
  ship.cells.forEach(([pr, pc]) => { NAU.myBoard[pr][pc] = null; });

  // Place new cells
  cells.forEach(([pr, pc]) => { NAU.myBoard[pr][pc] = id; });
  ship.cells = cells;

  document.getElementById('nau-ds-' + id)?.classList.add('nau-placed');
  NAU.placing = null;
  document.querySelectorAll('.nau-dock-ship').forEach(el => el.classList.remove('nau-selected'));
  _nauClearHover();
  _nauRenderPlaceGrid();

  const allPlaced = NAU.myShips.every(s => s.cells.length > 0);
  const conf = document.getElementById('nau-conf');
  if (conf) conf.disabled = !allPlaced;
}

// Generate a valid random fleet into a blank board
function _nauRandomFleet() {
  const board = _nauMk2D();
  const ships = [];
  for (const { id, len } of NAU_FLEET) {
    let placed = false, tries = 0;
    while (!placed && tries++ < 600) {
      const rot = Math.random() < 0.5 ? 'h' : 'v';
      const r   = Math.floor(Math.random() * NAU_SIZE);
      const c   = Math.floor(Math.random() * NAU_SIZE);
      const cells = rot === 'h'
        ? Array.from({ length: len }, (_, i) => [r, c + i])
        : Array.from({ length: len }, (_, i) => [r + i, c]);
      if (cells.every(([pr, pc]) =>
            pr >= 0 && pr < NAU_SIZE && pc >= 0 && pc < NAU_SIZE && board[pr][pc] === null)) {
        cells.forEach(([pr, pc]) => { board[pr][pc] = id; });
        ships.push({ id, cells });
        placed = true;
      }
    }
  }
  return { board, ships };
}

function _nauRandPlace() {
  if (!NAU) return;
  const { board, ships } = _nauRandomFleet();
  NAU.myBoard = board;
  NAU.myShips.forEach(s => {
    const found = ships.find(x => x.id === s.id);
    s.cells = found ? found.cells : [];
    s.hits  = new Set();
    s.sunk  = false;
  });
  NAU.placing = null;
  document.querySelectorAll('.nau-dock-ship')
    .forEach(el => el.classList.remove('nau-placed', 'nau-selected'));
  NAU.myShips.forEach(s => {
    if (s.cells.length) document.getElementById('nau-ds-' + s.id)?.classList.add('nau-placed');
  });
  _nauRenderPlaceGrid();
  const conf = document.getElementById('nau-conf');
  if (conf) conf.disabled = false;
}

function _nauRenderPlaceGrid() {
  for (let r = 0; r < NAU_SIZE; r++) {
    for (let c = 0; c < NAU_SIZE; c++) {
      const el = _nauCell('nau-pg', r, c);
      if (el) el.className = 'nau-cell' + (NAU.myBoard[r][c] !== null ? ' ship' : '');
    }
  }
  _nauSyncPieces('nau-pg', NAU.myShips, false);
}

function _nauConfirmPlace() {
  if (!NAU || !NAU.myShips.every(s => s.cells.length)) return;
  if (NAU.mode === 'ai') {
    _nauPlaceEnemyAI();
    _nauStartCombat();
    _nauSetStatus('Η σειρά σου — Επίτεθου!', 'myturn');
  } else {
    // PvP: signal ready, wait for opponent
    firebase.firestore().collection('naumachia_matches')
      .doc(NAU.pvp.matchId)
      .update({ [`${NAU.pvp.myRole}Ready`]: true, status: 'active' })
      .catch(() => {});
    document.getElementById('nau-mm-msg').textContent     = 'Αναμονή αντιπάλου να τοποθετήσει πλοία…';
    document.getElementById('nau-code-wrap').style.display = 'none';
    _nauPhase('mm');
  }
}

function _nauPlaceEnemyAI() {
  const { board, ships } = _nauRandomFleet();
  NAU.enemyBoard = board;
  NAU.enemyShips.forEach(s => {
    const found = ships.find(x => x.id === s.id);
    s.cells = found ? found.cells : [];
    s.hits  = new Set();
    s.sunk  = false;
  });
}

// ── Combat Phase ──────────────────────────────────────────────
function _nauStartCombat() {
  if (!NAU) return;
  NAU.myTurn = true;
  _nauPhase('combat');
  requestAnimationFrame(() => {
    _nauSizeCanvas('nau-mg');
    _nauSizeCanvas('nau-eg');
    _nauFxReady();
    _nauRenderMyGrid();
    _nauRenderEnemyGrid();
    _nauUpdateCounts();
  });
}

// Cross-board FX canvas (ballista lobs travel board → board over it).
// Lazily (re)sized; registered in NAU.cv so the shared loop drives it.
function _nauFxReady() {
  if (!NAU) return null;
  const el = document.getElementById('nau-fx');
  if (!el) return null;
  const w = el.offsetWidth, h = el.offsetHeight;
  if (!w || !h) return null;
  if (el.width !== w)  el.width  = w;
  if (el.height !== h) el.height = h;
  if (!NAU.cv['nau-fx']) {
    NAU.cv['nau-fx'] = { el, ctx: el.getContext('2d'), particles: [], shots: [], rings: [] };
  } else {
    NAU.cv['nau-fx'].el  = el;
    NAU.cv['nau-fx'].ctx = el.getContext('2d');
  }
  if (!NAU.raf) _nauAnimLoop();
  return NAU.cv['nau-fx'];
}

// Pixel center of cell (r,c) of grid `gid`, in fx-canvas coordinates
function _nauFxPt(gid, r, c) {
  const el   = document.getElementById('nau-fx');
  const grid = document.getElementById(gid);
  const cell = grid?.children[r * NAU_SIZE + c];
  if (!el || !cell) return null;
  const er = el.getBoundingClientRect(), cr = cell.getBoundingClientRect();
  return { x: cr.left - er.left + cr.width * 0.5, y: cr.top - er.top + cr.height * 0.5 };
}

function _nauRenderMyGrid() {
  for (let r = 0; r < NAU_SIZE; r++) {
    for (let c = 0; c < NAU_SIZE; c++) {
      const el  = _nauCell('nau-mg', r, c);
      if (!el) continue;
      const hit = NAU.myHits[r][c];
      const sid = NAU.myBoard[r][c];
      let cls   = '';
      if      (hit === 'miss') cls = 'miss';
      else if (hit === 'hit')  cls = (sid !== null && NAU.myShips[sid]?.sunk) ? 'sunk' : 'hit';
      else if (sid !== null)   cls = 'ship';
      el.className = 'nau-cell' + (cls ? ' ' + cls : '');
    }
  }
  _nauSyncPieces('nau-mg', NAU.myShips, false);
}

function _nauRenderEnemyGrid() {
  const canFire = NAU.myTurn && NAU.phase === 'combat';
  for (let r = 0; r < NAU_SIZE; r++) {
    for (let c = 0; c < NAU_SIZE; c++) {
      const el   = _nauCell('nau-eg', r, c);
      if (!el) continue;
      const shot = NAU.myShots[r][c];
      let cls    = '';
      if (shot === 'miss') {
        cls = 'miss';
      } else if (shot === 'hit') {
        const wasSunk = NAU.enemyShips.some(
          s => s.sunk && s.cells.some(([sr, sc]) => sr === r && sc === c));
        cls = wasSunk ? 'sunk' : 'hit';
      } else if (canFire) {
        cls = 'fire';
      }
      el.className = 'nau-cell' + (cls ? ' ' + cls : '');
    }
  }
  // Wreck reveals: sunk enemy ships surface as charred trireme tokens
  _nauSyncPieces('nau-eg', NAU.enemyShips, true);
}

function _nauSetStatus(msg, cls) {
  const el = document.getElementById('nau-stat');
  if (!el) return;
  el.textContent = msg;
  el.className   = 'nau-status-txt' + (cls ? ' ' + cls : '');
  // Visual only: spotlight whichever board is "hot" this turn
  const boards = document.getElementById('nau-boards');
  if (boards) boards.classList.toggle('mine', cls === 'myturn');
}

function _nauUpdateCounts() {
  if (!NAU) return;
  NAU.myAlive = NAU.myShips.filter(s => !s.sunk).length;
  NAU.enAlive = NAU.enemyShips.filter(s => !s.sunk).length;
  _nauRenderPips(document.getElementById('nau-my-alive'), NAU.myAlive);
  _nauRenderPips(document.getElementById('nau-en-alive'), NAU.enAlive);
}

// Fleet strength as little hull pips (sunk ones keel over) — visual only
function _nauRenderPips(el, alive) {
  if (!el) return;
  if (el.childElementCount !== NAU_FLEET.length) {
    el.innerHTML = NAU_FLEET
      .map(() => `<span class="nau-pip">${NAU_PIP_SVG}</span>`).join('');
  }
  el.title = alive + ' πλοία';
  Array.prototype.forEach.call(el.children,
    (pip, i) => pip.classList.toggle('dead', i >= alive));
}

// ── Fire + Educational Gate ────────────────────────────────────
function _nauEnemyClick(r, c) {
  if (!NAU || !NAU.myTurn || NAU.phase !== 'combat') return;
  if (NAU.myShots[r][c] !== null) return;
  NAU.pendingFire = { r, c };
  _nauShowQuestion();
}

function _nauShowQuestion() {
  const q     = _nauGetQuestion();
  const textEl = document.getElementById('nau-qt');
  const optsEl = document.getElementById('nau-qo');
  if (!textEl || !optsEl) return;
  textEl.textContent = q.q;
  optsEl.innerHTML   = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'nau-q-opt';
    const key = document.createElement('span');
    key.className   = 'nau-q-key';
    key.textContent = 'ΑΒΓΔΕ'[i] || '';
    const lbl = document.createElement('span');
    lbl.className   = 'nau-q-lbl';
    lbl.textContent = opt;
    btn.appendChild(key);
    btn.appendChild(lbl);
    btn.addEventListener('click', () => _nauAnswer(i, q.ans, optsEl, q));
    optsEl.appendChild(btn);
  });
  document.getElementById('nau-qov').classList.add('active');
}

function _nauAnswer(chosen, correct, optsEl, q) {
  optsEl.querySelectorAll('.nau-q-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    if (i === chosen && chosen !== correct) btn.classList.add('wrong');
  });
  const won = chosen === correct;
  if (won) NAU_SFX.correct(); else NAU_SFX.wrong();
  if (!won && q && window.symLogMistake) {
    try { window.symLogMistake({ q: q.q, wrong: (q.opts && q.opts[chosen]) || '', right: (q.opts && q.opts[correct]) || '', cat: 'Ναυμαχία', gameId: 'naumachia' }); } catch (_) {}
  }
  setTimeout(() => {
    document.getElementById('nau-qov').classList.remove('active');
    const pf = NAU?.pendingFire;
    if (!pf) return;
    NAU.pendingFire = null;
    if (won) {
      _nauDoFire(pf.r, pf.c);
    } else {
      _nauSetStatus('Λάθος! Χάνεις τη σειρά σου.', 'wrong');
      _nauEndTurn(false);
    }
  }, 1100);
}

// ── Core shot resolution ──────────────────────────────────────
function _nauDoFire(r, c) {
  if (!NAU) return;
  if (NAU.mode === 'ai') {
    // Resolve locally
    const result = _nauHitEnemyAI(r, c);
    const sunkShip = result === 'hit'
      ? NAU.enemyShips.find(s => s.sunk && s.cells.some(([sr, sc]) => sr === r && sc === c))
      : null;
    NAU.myShots[r][c] = result;
    _nauRenderEnemyGrid();
    _nauDoEffect(r, c, result, sunkShip, 'nau-eg');
    _nauUpdateCounts();
    if (NAU.enAlive <= 0) { _nauGameOver(true); return; }
    _nauEndTurn(result === 'hit');
  } else {
    // PvP: push shot to Firestore, await opponent's evaluation
    NAU.myTurn = false;
    _nauSetStatus('Αναμονή αποτελέσματος…', 'waiting');
    _nauRenderEnemyGrid();
    firebase.firestore().collection('naumachia_matches')
      .doc(NAU.pvp.matchId)
      .update({
        currentShot: {
          by: NAU.pvp.myRole, r, c,
          result: null, sunkShip: null,
          seq: Date.now(),
        },
        turn: NAU.pvp.myRole === 'p1' ? 'p2' : 'p1',
      }).catch(() => {});
  }
}

// Hit enemy (AI mode) — checks enemyBoard, updates enemyShips
function _nauHitEnemyAI(r, c) {
  const sid = NAU.enemyBoard[r][c];
  if (sid === null) return 'miss';
  const ship = NAU.enemyShips[sid];
  ship.hits.add(`${r},${c}`);
  if (ship.hits.size >= ship.len) ship.sunk = true;
  return 'hit';
}

// Process an incoming opponent shot on MY board (PvP)
function _nauProcessIncoming(r, c) {
  const sid    = NAU.myBoard[r][c];
  const result = sid !== null ? 'hit' : 'miss';
  NAU.myHits[r][c] = result;
  if (result === 'hit') {
    const ship = NAU.myShips[sid];
    ship.hits.add(`${r},${c}`);
    if (ship.hits.size >= ship.len) ship.sunk = true;
  }
  NAU.myAlive = NAU.myShips.filter(s => !s.sunk).length;
  return result;
}

// End of player's turn — hand off to AI or wait for opponent
function _nauEndTurn(wasHit) {
  if (!NAU) return;
  NAU.myTurn = false;
  _nauSetStatus('Σειρά αντιπάλου…', 'waiting');
  _nauRenderEnemyGrid();
  if (NAU.mode !== 'ai') {
    // PvP: wrong answer — pass turn to opponent via Firestore (no shot fired)
    if (NAU.pvp && NAU.pvp.matchId) {
      const op = NAU.pvp.myRole === 'p1' ? 'p2' : 'p1';
      firebase.firestore().collection('naumachia_matches')
        .doc(NAU.pvp.matchId).update({ turn: op }).catch(() => {});
    }
    return;
  }
  setTimeout(_nauAITurn, wasHit ? 900 : 700);
}

// ── AI Turn ───────────────────────────────────────────────────
function _nauAITurn() {
  if (!NAU || NAU.phase !== 'combat') return;
  const pos = _nauAIChoose();
  if (!pos) return;
  const [r, c] = pos;

  const sid    = NAU.myBoard[r][c];
  const result = sid !== null ? 'hit' : 'miss';
  NAU.myHits[r][c] = result;

  let sunkShip = null;
  if (result === 'hit') {
    const ship = NAU.myShips[sid];
    ship.hits.add(`${r},${c}`);
    if (ship.hits.size >= ship.len) {
      ship.sunk = true;
      sunkShip  = ship;
      NAU.ai.queue = [];
      NAU.ai.mode  = 'hunt';
    } else {
      _nauAIOnHit(r, c);
    }
  }

  _nauRenderMyGrid();
  _nauDoEffect(r, c, result, sunkShip, 'nau-mg');
  _nauUpdateCounts();

  if (NAU.myAlive <= 0) { _nauGameOver(false); return; }

  NAU.myTurn = true;
  _nauSetStatus('Η σειρά σου — Επίτεθου!', 'myturn');
  _nauRenderEnemyGrid();
}

function _nauAIChoose() {
  const ai = NAU.ai;
  // Drain target queue
  while (ai.queue.length) {
    const pos = ai.queue.shift();
    const [r, c] = pos;
    if (NAU.myHits[r][c] === null) return pos;
  }
  // Hunt: pick random un-shot cell
  ai.mode = 'hunt';
  const cands = [];
  for (let r = 0; r < NAU_SIZE; r++)
    for (let c = 0; c < NAU_SIZE; c++)
      if (NAU.myHits[r][c] === null) cands.push([r, c]);
  return cands.length ? cands[Math.floor(Math.random() * cands.length)] : null;
}

function _nauAIOnHit(r, c) {
  const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc;
    if (nr >= 0 && nr < NAU_SIZE && nc >= 0 && nc < NAU_SIZE
        && NAU.myHits[nr][nc] === null
        && !NAU.ai.queue.some(([qr, qc]) => qr === nr && qc === nc)) {
      NAU.ai.queue.unshift([nr, nc]);
    }
  }
  NAU.ai.mode = 'target';
}

// ── Game Over ─────────────────────────────────────────────────
function _nauGameOver(iWon) {
  if (!NAU) return;
  if (NAU.pvp?.unsub) { NAU.pvp.unsub(); NAU.pvp.unsub = null; }
  const shipsSunk = 5 - (NAU.enAlive ?? 5);
  if (typeof awardGameRewards === 'function' && shipsSunk > 0) {
    awardGameRewards('naumachia', { score: shipsSunk, perfect: iWon });
  }
  const shipsLost = 5 - (NAU.myAlive ?? 5);
  const root = document.getElementById('nau-root');
  if (root) root.classList.add(iWon ? 'nau-victory' : 'nau-defeat');
  NAU_SFX.gameOver(iWon);
  const icon = document.getElementById('nau-ov-icon');
  if (icon) icon.innerHTML = iWon ? _nauLaurelSVG() : _nauSunkSVG();
  document.getElementById('nau-ov-title').textContent = iWon ? 'Νίκη!' : 'Ήττα';
  document.getElementById('nau-ov-msg').textContent   = iWon
    ? 'Ο εχθρικός στόλος βυθίστηκε. Η Αθήνα θριαμβεύει!'
    : 'Ο στόλος σου καταστράφηκε. Μεγάλη απώλεια για την Αθήνα.';
  const stats = document.getElementById('nau-ov-stats');
  if (stats) {
    stats.innerHTML =
      `<div class="nau-over-stat gold"><b id="nau-st-sunk">0</b><span>Βυθίσεις</span></div>` +
      `<div class="nau-over-stat red"><b id="nau-st-lost">0</b><span>Απώλειες</span></div>`;
    _nauCountUp(document.getElementById('nau-st-sunk'), shipsSunk);
    _nauCountUp(document.getElementById('nau-st-lost'), shipsLost);
  }
  _nauPhase('over');
}

// Presentational count-up for the game-over tallies
function _nauCountUp(el, target) {
  if (!el) return;
  if (NAU_RM.matches || target <= 0) { el.textContent = String(target); return; }
  const t0 = performance.now(), dur = 700;
  (function tick(now) {
    const k = Math.min(1, (now - t0) / dur);
    el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
    if (k < 1 && document.body.contains(el)) requestAnimationFrame(tick);
  })(t0);
}

// ── Canvas FX system: shot arcs → rings → particles ───────────
function _nauAnimLoop() {
  if (!NAU) return;
  for (const key in NAU.cv) {
    const state = NAU.cv[key];
    if (!state) continue;
    const { ctx, el, particles } = state;
    const shots = state.shots || (state.shots = []);
    const rings = state.rings || (state.rings = []);
    ctx.clearRect(0, 0, el.width, el.height);

    // Ballista shots — flaming bolt on a parabolic arc, nose along the
    // flight path, smoke-and-ember trail streaming behind (visual only)
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      s.t += s.dt;
      if (s.t >= 1) {
        shots.splice(i, 1);
        try { s.land(); } catch (_) {}
        continue;
      }
      const arcPt = tt => ({
        x: s.x0 + (s.x1 - s.x0) * tt,
        y: s.y0 + (s.y1 - s.y0) * tt - s.h * Math.sin(Math.PI * tt),
      });
      const hd  = arcPt(s.t);
      const bk  = arcPt(Math.max(0, s.t - 0.03));
      const ang = Math.atan2(hd.y - bk.y, hd.x - bk.x);
      // aiming mark converging on the target while the bolt is inbound
      const tm = Math.min(1, s.t / 0.85);
      ctx.save();
      ctx.globalAlpha = 0.22 + 0.55 * tm;
      ctx.strokeStyle = s.tcol || s.color;
      ctx.lineWidth   = 1.2;
      ctx.setLineDash([4, 3.2]);
      ctx.lineDashOffset = -s.t * 46;
      ctx.beginPath();
      ctx.arc(s.x1, s.y1, 16.5 - 10.5 * tm, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.globalAlpha = 0.5 * tm;
      ctx.fillStyle = s.tcol || s.color;
      ctx.beginPath(); ctx.arc(s.x1, s.y1, 1.7, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      // bolt shadow racing across the water beneath the arc
      const lift = Math.sin(Math.PI * s.t);
      ctx.save();
      ctx.globalAlpha = 0.05 + 0.11 * lift;
      ctx.fillStyle   = '#010609';
      ctx.beginPath();
      ctx.ellipse(s.x0 + (s.x1 - s.x0) * s.t, s.y0 + (s.y1 - s.y0) * s.t + 5,
                  6.5 + s.h * lift * 0.055, 2.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      // faded tracer of the flight path just travelled
      ctx.save();
      ctx.globalAlpha = 0.11;
      ctx.strokeStyle = s.color;
      ctx.lineWidth   = 1;
      ctx.beginPath();
      let mvd = false;
      for (let tt = Math.max(0, s.t - 0.36); tt < s.t; tt += 0.045) {
        const p = arcPt(tt);
        if (mvd) ctx.lineTo(p.x, p.y);
        else { ctx.moveTo(p.x, p.y); mvd = true; }
      }
      ctx.stroke();
      ctx.restore();
      // trail: recent flame → older smoke, drooping as it cools
      for (let k = 8; k >= 1; k--) {
        const p = arcPt(Math.max(0, s.t - k * 0.042));
        ctx.save();
        ctx.globalAlpha = 0.58 * (1 - k / 9.5);
        ctx.fillStyle   = k > 3 ? 'rgba(120,116,110,0.8)' : s.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y + k * 1.05, Math.max(0.8, 3.8 - k * 0.38), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
      // stray sparks shed along the flight
      if (Math.random() < 0.4) {
        particles.push({
          x: hd.x, y: hd.y,
          vx: (Math.random() - 0.5) * 0.9,
          vy: (Math.random() - 0.4) * 0.7,
          color: Math.random() < 0.5 ? s.color : '#FFF3D6',
          size: 1.6, life: 0.55, d: 0.05, g: 0.03,
        });
      }
      ctx.save();
      // fire-light halo around the head
      const halo = ctx.createRadialGradient(hd.x, hd.y, 0, hd.x, hd.y, 18);
      halo.addColorStop(0, s.glow);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath(); ctx.arc(hd.x, hd.y, 18, 0, Math.PI * 2); ctx.fill();
      // bolt: iron tip + burning shaft, rotated into the velocity vector
      ctx.translate(hd.x, hd.y);
      ctx.rotate(ang);
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.moveTo(11, 0); ctx.lineTo(-8, -3.3); ctx.lineTo(-12.5, 0); ctx.lineTo(-8, 3.3);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#FFF3D6';
      ctx.beginPath(); ctx.arc(3.2, 0, 2.7, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    // Expanding shock / ripple rings
    for (let i = rings.length - 1; i >= 0; i--) {
      const g = rings[i];
      g.r    += g.v;
      g.life -= g.d;
      if (g.life <= 0) { rings.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.max(0, g.life) * 0.85;
      ctx.strokeStyle = g.color;
      ctx.lineWidth   = g.w * g.life;
      ctx.beginPath();
      ctx.arc(g.x, g.y, g.r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Smouldering hulls: lazy smoke wisps + stray embers rising off burning
    // cells until the battle ends (registered on hit, visual only)
    const burns = state.burns;
    if (burns && burns.length && NAU.phase === 'combat' && !NAU_RM.matches) {
      for (let bi = 0; bi < burns.length; bi++) {
        const b = burns[bi];
        if (Math.random() < 0.06) {
          const pt = _nauCellPx(key, b.r, b.c);
          particles.push({
            x: pt.x + (Math.random() - 0.5) * 10, y: pt.y - 2,
            vx: (Math.random() - 0.5) * 0.22 + 0.07,
            vy: -0.26 - Math.random() * 0.3,
            color: ['rgba(104,100,96,0.8)', 'rgba(76,74,72,0.72)', 'rgba(128,122,114,0.62)'][Math.floor(Math.random() * 3)],
            size: 3.2 + Math.random() * 2.2, life: 1.3, d: 0.012, g: -0.004,
          });
        }
        if (Math.random() < 0.022) {
          const pt = _nauCellPx(key, b.r, b.c);
          particles.push({
            x: pt.x + (Math.random() - 0.5) * 8, y: pt.y,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -0.5 - Math.random() * 0.55,
            color: Math.random() < 0.5 ? '#FFB050' : '#E06018',
            size: 1.3, life: 0.8, d: 0.03, g: -0.01,
          });
        }
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += p.g;
      p.life -= p.d;
      if (p.life <= 0) { particles.splice(i, 1); continue; }
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0.5, p.size * Math.sqrt(p.life)), 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  NAU.raf = requestAnimationFrame(_nauAnimLoop);
}

// Returns pixel center of cell (r,c) relative to the grid's canvas
function _nauCellPx(gid, r, c) {
  const grid = document.getElementById(gid);
  if (!grid) return { x: 0, y: 0 };
  const cell = grid.children[r * NAU_SIZE + c];
  if (!cell) return { x: 0, y: 0 };
  const gr = grid.getBoundingClientRect();
  const cr = cell.getBoundingClientRect();
  return {
    x: cr.left - gr.left + cr.width  * 0.5,
    y: cr.top  - gr.top  + cr.height * 0.5,
  };
}

// Spawn n particles on canvas gid
function _nauSpawn(gid, n, x, y, colors, speed, upBias, size, startLife, gravity, decay) {
  const cv = NAU.cv[gid];
  if (!cv) return;
  for (let i = 0; i < n; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd   = speed * (0.4 + Math.random() * 0.9);
    cv.particles.push({
      x, y,
      vx:   Math.cos(angle) * spd,
      vy:   Math.sin(angle) * spd - upBias * Math.random(),
      color: colors[Math.floor(Math.random() * colors.length)],
      size:  size  * (0.5 + Math.random() * 0.8),
      life:  startLife,
      d:     decay + Math.random() * 0.015,
      g:     gravity,
    });
  }
}

// Push an expanding ring onto a grid's canvas
function _nauRing(gid, x, y, color, speed, width, startR) {
  const cv = NAU?.cv?.[gid];
  if (!cv) return;
  (cv.rings || (cv.rings = [])).push({
    x, y,
    r:     startR || 2,
    v:     speed,
    w:     width,
    life:  1,
    d:     0.045,
    color,
  });
}

// Registers a burning cell so the anim loop keeps smoke rising from it.
// Purely presentational; the list dies with NAU on close/restart.
function _nauAddBurn(gid, r, c) {
  const cv = NAU?.cv?.[gid];
  if (!cv) return;
  const burns = cv.burns || (cv.burns = []);
  if (burns.some(b => b.r === r && b.c === c)) return;
  if (burns.length >= 24) burns.shift();
  burns.push({ r, c });
}

// Impact burst once a bolt lands (or immediately under reduced motion)
function _nauImpact(gid, x, y, result, incoming) {
  if (result === 'miss') {
    // Water splash — radial spray + tall plume column + foam rings
    _nauSpawn(gid, 16, x, y,
      ['#1A8AAA', '#2AAAC0', '#40B8CC', '#7ACCE0', '#AAE0EE'],
      3.8, 4.0, 5, 1.0, 0.20, 0.014);
    _nauSpawn(gid, 7, x, y,
      ['#DFF3FA', '#AAE0EE'],
      1.6, 5.4, 3, 1.0, 0.16, 0.020);
    // plume: narrow column of droplets thrown straight up, raining back
    const cvp = NAU.cv[gid];
    if (cvp) {
      for (let i = 0; i < 10; i++) {
        cvp.particles.push({
          x: x + (Math.random() - 0.5) * 7, y,
          vx: (Math.random() - 0.5) * 0.9,
          vy: -(2.6 + Math.random() * 2.6),
          color: ['#DFF3FA', '#AAE0EE', '#7ACCE0'][Math.floor(Math.random() * 3)],
          size: 2.2 + Math.random() * 2.2, life: 1.0,
          d: 0.016 + Math.random() * 0.012, g: 0.15,
        });
      }
    }
    _nauRing(gid, x, y, 'rgba(140,210,235,0.9)', 1.5, 2.4);
    setTimeout(() => { if (NAU) _nauRing(gid, x, y, 'rgba(90,170,200,0.7)', 1.2, 1.8); }, 160);
    setTimeout(() => { if (NAU) _nauRing(gid, x, y, 'rgba(190,235,250,0.4)', 0.9, 1.2); }, 340);
  } else {
    // Burning hit — white-hot core flash, fire burst, splinters, smoke
    _nauRing(gid, x, y, 'rgba(255,242,214,0.95)', 3.4, 2.6);
    _nauSpawn(gid, 36, x, y,
      ['#C9A44A', '#C0391B', '#E06018', '#FF8020', '#FFD050', '#FF4428'],
      5.5, 5.0, 8, 1.0, 0.24, 0.010);
    // splinters: shattered hull timber tumbling out under gravity
    _nauSpawn(gid, 9, x, y,
      ['#3A2414', '#57381C', '#2A180C'],
      3.4, 2.6, 3, 0.9, 0.13, 0.018);
    _nauSpawn(gid, 10, x, y,
      ['#4A4A4A', '#5E5E5E', '#333333'],
      2.0, 3.2, 6, 1.4, -0.02, 0.008);
    _nauRing(gid, x, y, incoming ? 'rgba(255,110,70,0.9)' : 'rgba(255,208,80,0.9)', 2.4, 3);
    // late black smoke belch once the flash has cleared
    setTimeout(() => {
      if (!NAU) return;
      _nauSpawn(gid, 6, x, y - 4,
        ['rgba(70,66,62,0.7)', 'rgba(96,90,86,0.6)'],
        0.8, 2.6, 5, 1.3, -0.015, 0.010);
    }, 300);
  }
}

// Trigger the right effect after a shot resolves: ballista bolt arcs
// onto the board, then splashes (miss) or bursts into flame (hit).
// Purely presentational — game state is already resolved by the caller.
function _nauDoEffect(r, c, result, sunkShip, gid) {
  const { x, y } = _nauCellPx(gid, r, c);
  const incoming = gid === 'nau-mg';        // enemy firing at MY board

  const land = () => {
    if (!NAU) return;
    _nauImpact(gid, x, y, result, incoming);
    if (result === 'miss') {
      NAU_SFX.splash(false);
    } else {
      NAU_SFX.boom(!!sunkShip);
      _nauShake(!!sunkShip);
      _nauAddBurn(gid, r, c);
    }
    if (sunkShip?.cells?.length) {
      NAU_SFX.sunk();
      setTimeout(() => { if (NAU) _nauEmbers(gid, sunkShip.cells); },  240);
      setTimeout(() => { if (NAU) _nauBubbles(gid, sunkShip.cells); }, 430);
      _nauSunkBanner(sunkShip, incoming);
    }
  };

  if (NAU_RM.matches) { land(); return; }

  // Preferred: ballista lob crossing from the opposing board
  const fx = _nauFxReady();
  if (fx) {
    const from = document.getElementById(incoming ? 'nau-eg' : 'nau-mg');
    const tgt  = _nauFxPt(gid, r, c);
    if (from && tgt) {
      const fr = from.getBoundingClientRect();
      const er = fx.el.getBoundingClientRect();
      if (fr.width && er.width) {
        const x0 = fr.left - er.left + fr.width  * (0.5 + (Math.random() * 0.36 - 0.18));
        const y0 = fr.top  - er.top  + fr.height * (0.40 + Math.random() * 0.24);
        const dist = Math.hypot(tgt.x - x0, tgt.y - y0);
        (fx.shots || (fx.shots = [])).push({
          x0, y0, x1: tgt.x, y1: tgt.y,
          t: 0, dt: Math.max(1 / 46, 1 / (16 + dist / 30)),
          h: Math.max(48, dist * 0.22) + Math.random() * 30,
          color: incoming ? '#FF6A42' : '#FFC96A',
          glow:  incoming ? 'rgba(255,90,50,0.45)' : 'rgba(255,200,100,0.45)',
          tcol:  incoming ? 'rgba(255,120,80,0.9)' : 'rgba(255,214,140,0.9)',
          land,
        });
        NAU_SFX.fire(incoming);
        // Launch flash + sparks at the firing board
        _nauRing('nau-fx', x0, y0,
          incoming ? 'rgba(255,120,70,0.55)' : 'rgba(255,214,140,0.6)', 2.0, 2);
        _nauSpawn('nau-fx', 6, x0, y0,
          ['#FFD98A', '#E8B25A', '#FFF3D6'], 1.7, 1.4, 2.6, 0.7, 0.05, 0.05);
        return;
      }
    }
  }

  // Fallback: original same-board arc
  const cv = NAU.cv[gid];
  if (!cv || !cv.el) { land(); return; }

  const W = cv.el.width, H = cv.el.height;
  const fromTop = incoming;
  const y0 = fromTop ? -12 : H + 12;
  const x0 = Math.max(10, Math.min(W - 10, x + (Math.random() * 140 - 70)));
  (cv.shots || (cv.shots = [])).push({
    x0, y0, x1: x, y1: y,
    t: 0, dt: 1 / 22,                       // ≈ 0.37 s at 60 fps
    h: (fromTop ? 30 : 50) + Math.random() * 36,
    color: incoming ? '#FF6A42' : '#FFC96A',
    glow:  incoming ? 'rgba(255,90,50,0.45)' : 'rgba(255,200,100,0.45)',
    tcol:  incoming ? 'rgba(255,120,80,0.9)' : 'rgba(255,214,140,0.9)',
    land,
  });
  NAU_SFX.fire(incoming);
}

// Kinetic "ship sunk" banner — gold for enemy losses, red for ours
function _nauSunkBanner(sunkShip, incoming) {
  const root = document.getElementById('nau-root');
  if (!root) return;
  const name = sunkShip.name
    || (sunkShip.id != null && NAU_FLEET[sunkShip.id]?.name) || '';
  const b = document.createElement('div');
  b.className = 'nau-banner ' + (incoming ? 'mine' : 'foe');
  const t = document.createElement('div');
  t.className   = 'nau-banner-t';
  t.textContent = incoming ? 'ΑΠΩΛΕΙΑ!' : 'ΒΥΘΙΣΤΗΚΕ!';
  b.appendChild(t);
  if (name) {
    const n = document.createElement('div');
    n.className   = 'nau-banner-n';
    n.textContent = name;
    b.appendChild(n);
  }
  root.appendChild(b);
  setTimeout(() => b.remove(), 2300);
}

// Floating embers across all cells of a sunk ship
function _nauEmbers(gid, cells) {
  if (!NAU) return;
  for (const [r, c] of cells) {
    const { x, y } = _nauCellPx(gid, r, c);
    _nauSpawn(gid, 8, x, y,
      ['#C9A44A', '#E07020', '#803010', '#D05830'],
      1.0, 2.5, 4, 1.6, -0.04, 0.008);
  }
}

// Air bubbles rising along the hull as the wreck settles (visual only)
function _nauBubbles(gid, cells) {
  if (!NAU) return;
  for (const [r, c] of cells) {
    const { x, y } = _nauCellPx(gid, r, c);
    _nauSpawn(gid, 5, x, y + 4,
      ['#9FD8EC', '#C9EFF9', '#6FB8D8'],
      0.5, 1.4, 2.4, 1.3, -0.03, 0.012);
  }
}

// CSS screen shake on the boards wrapper — heavier when a ship goes down
function _nauShake(big) {
  const el = document.getElementById('nau-boards') || document.getElementById('nau-root');
  if (!el) return;
  const cls = big ? 'nau-shake-big' : 'nau-shake';
  el.classList.remove('nau-shake', 'nau-shake-big');
  void el.offsetWidth;   // force reflow to restart animation
  el.classList.add(cls);
  setTimeout(() => el.classList.remove(cls), big ? 640 : 420);
}
