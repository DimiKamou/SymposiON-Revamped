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

function _nauGetQuestion() {
  // GP pool injected by nav.js _gpInjectEngineData for selected-level questions
  if (window._gpNauPool && window._gpNauPool.length) {
    const idx = ((window._gpNauIdx || 0)) % window._gpNauPool.length;
    window._gpNauIdx = idx + 1;
    return window._gpNauPool[idx];
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
        <div class="nau-ships-rem">
          <span class="me"  id="nau-my-alive"></span>
          <span class="vs">⚔</span>
          <span class="them" id="nau-en-alive"></span>
        </div>
      </div>
      <div class="nau-boards-wrap" id="nau-boards">
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
function _nauGridHTML(id) {
  const cols = 'ΑΒΓΔΕΖΗΘΙΚ'.split('');
  const rows  = [...Array(10)].map((_, i) => i + 1);
  return `<div class="nau-grid-outer">
    <div class="nau-col-labels">${cols.map(c => `<div class="nau-ax-lbl">${c}</div>`).join('')}</div>
    <div class="nau-row-labels">${rows.map(r => `<div class="nau-ax-lbl">${r}</div>`).join('')}</div>
    <div class="nau-grid-wrap">
      <div class="nau-grid" id="${id}"></div>
      <canvas class="nau-canvas" id="${id}-c"></canvas>
    </div>
  </div>`;
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
    _nauRenderMyGrid();
    _nauRenderEnemyGrid();
    _nauUpdateCounts();
  });
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
}

function _nauSetStatus(msg, cls) {
  const el = document.getElementById('nau-stat');
  if (!el) return;
  el.textContent = msg;
  el.className   = 'nau-status-txt' + (cls ? ' ' + cls : '');
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

    // Ballista shots — flaming bolt on a parabolic arc, with trail
    for (let i = shots.length - 1; i >= 0; i--) {
      const s = shots[i];
      s.t += s.dt;
      if (s.t >= 1) {
        shots.splice(i, 1);
        try { s.land(); } catch (_) {}
        continue;
      }
      for (let k = 3; k >= 0; k--) {              // trail (older → fainter)
        const tt = Math.max(0, s.t - k * 0.05);
        const x  = s.x0 + (s.x1 - s.x0) * tt;
        const y  = s.y0 + (s.y1 - s.y0) * tt - s.h * Math.sin(Math.PI * tt);
        ctx.save();
        ctx.globalAlpha = 0.85 * (1 - k * 0.24);
        if (k === 0) {                            // glowing head
          ctx.fillStyle = s.glow;
          ctx.beginPath(); ctx.arc(x, y, 6.5, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = 1;
          ctx.fillStyle = '#FFF3D6';
          ctx.beginPath(); ctx.arc(x, y, 2.6, 0, Math.PI * 2); ctx.fill();
        } else {
          ctx.fillStyle = s.color;
          ctx.beginPath(); ctx.arc(x, y, 3.4 - k * 0.6, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
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

// Impact burst once a bolt lands (or immediately under reduced motion)
function _nauImpact(gid, x, y, result, incoming) {
  if (result === 'miss') {
    // Water splash — spray column + double ripple
    _nauSpawn(gid, 18, x, y,
      ['#1A8AAA', '#2AAAC0', '#40B8CC', '#7ACCE0', '#AAE0EE'],
      3.8, 4.0, 5, 1.0, 0.20, 0.014);
    _nauSpawn(gid, 7, x, y,
      ['#DFF3FA', '#AAE0EE'],
      1.6, 5.4, 3, 1.0, 0.16, 0.020);
    _nauRing(gid, x, y, 'rgba(140,210,235,0.9)', 1.5, 2.4);
    setTimeout(() => { if (NAU) _nauRing(gid, x, y, 'rgba(90,170,200,0.7)', 1.2, 1.8); }, 160);
  } else {
    // Burning hit — fire burst + smoke + shockwave
    _nauSpawn(gid, 36, x, y,
      ['#C9A44A', '#C0391B', '#E06018', '#FF8020', '#FFD050', '#FF4428'],
      5.5, 5.0, 8, 1.0, 0.24, 0.010);
    _nauSpawn(gid, 10, x, y,
      ['#4A4A4A', '#5E5E5E', '#333333'],
      2.0, 3.2, 6, 1.4, -0.02, 0.008);
    _nauRing(gid, x, y, incoming ? 'rgba(255,110,70,0.9)' : 'rgba(255,208,80,0.9)', 2.4, 3);
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
    if (result !== 'miss') _nauShake();
    if (sunkShip?.cells?.length) {
      setTimeout(() => { if (NAU) _nauEmbers(gid, sunkShip.cells); }, 240);
      _nauSunkBanner(sunkShip, incoming);
    }
  };

  const cv = NAU.cv[gid];
  if (NAU_RM.matches || !cv || !cv.el) { land(); return; }

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
    land,
  });
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
  setTimeout(() => b.remove(), 1750);
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

// CSS screen shake on the boards wrapper
function _nauShake() {
  const el = document.getElementById('nau-boards') || document.getElementById('nau-root');
  if (!el) return;
  el.classList.remove('nau-shake');
  void el.offsetWidth;   // force reflow to restart animation
  el.classList.add('nau-shake');
  setTimeout(() => el.classList.remove('nau-shake'), 420);
}
