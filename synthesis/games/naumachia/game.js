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

  <!-- ══ MENU ══ -->
  <div class="nau-phase" id="nau-ph-menu">
    <div class="nau-menu">
      <h1 class="nau-title">ΝΑΥΜΑΧΙΑ</h1>
      <p class="nau-subtitle">Ναυτική Σύγκρουση &middot; 5ος αι. π.Χ.</p>
      <div class="nau-hr"></div>
      <div class="nau-menu-btns">
        <button class="nau-btn nau-btn-primary" onclick="_nauMode('ai')">⚔ Εναντίον Υπολογιστή</button>
        <button class="nau-btn" onclick="_nauMode('pvp')">⚓ Εναντίον Παίκτη (PvP)</button>
      </div>
    </div>
  </div>

  <!-- ══ MATCHMAKING ══ -->
  <div class="nau-phase" id="nau-ph-mm">
    <div class="nau-matchmaking">
      <div class="nau-spinner"></div>
      <p id="nau-mm-msg" style="font-size:.88rem;color:var(--nau-txtm);letter-spacing:.06em;margin:0">Αναζήτηση αντιπάλου…</p>
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
        <h2>Τοποθέτηση Πλοίων</h2>
        <div class="nau-place-controls">
          <button class="nau-btn nau-btn-sm" onclick="_nauRotate()">↻ Περιστροφή</button>
          <button class="nau-btn nau-btn-sm" onclick="_nauRandPlace()">⚄ Τυχαία</button>
          <button class="nau-btn nau-btn-sm nau-btn-primary" id="nau-conf" onclick="_nauConfirmPlace()" disabled>→ Επίθεση!</button>
        </div>
      </div>
      <div class="nau-place-body">
        <div class="nau-dock" id="nau-dock">
          <div class="nau-dock-hd">Ο Στόλος Σου</div>
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
          <span class="me"  id="nau-my-alive">5 πλοία</span>
          <span class="vs">⚔</span>
          <span class="them" id="nau-en-alive">5 πλοία</span>
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
      <div class="nau-over-icon" id="nau-ov-icon">⚔</div>
      <h2 class="nau-over-title" id="nau-ov-title">—</h2>
      <p class="nau-over-msg" id="nau-ov-msg"></p>
      <div class="nau-over-btns">
        <button class="nau-btn nau-btn-primary nau-btn-sm" onclick="openNaumachia()">Νέα Ναυμαχία</button>
        <button class="nau-btn nau-btn-sm" onclick="closeNaumachia()">← Έξοδος</button>
      </div>
    </div>
  </div>

  <!-- ══ QUESTION MODAL ══ -->
  <div class="nau-q-overlay" id="nau-qov">
    <div class="nau-q-modal">
      <div class="nau-q-hd">⚡ Πριν Επιτεθείς…</div>
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
  if (!NAU.cv[id]) NAU.cv[id] = { el: cv, ctx: cv.getContext('2d'), particles: [] };
  else { NAU.cv[id].el = cv; NAU.cv[id].ctx = cv.getContext('2d'); }
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
  const ma = document.getElementById('nau-my-alive');
  const ea = document.getElementById('nau-en-alive');
  if (ma) ma.textContent = NAU.myAlive + ' πλοία';
  if (ea) ea.textContent = NAU.enAlive + ' πλοία';
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
    btn.className   = 'nau-q-opt';
    btn.textContent = opt;
    btn.addEventListener('click', () => _nauAnswer(i, q.ans, optsEl));
    optsEl.appendChild(btn);
  });
  document.getElementById('nau-qov').classList.add('active');
}

function _nauAnswer(chosen, correct, optsEl) {
  optsEl.querySelectorAll('.nau-q-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    if (i === chosen && chosen !== correct) btn.classList.add('wrong');
  });
  const won = chosen === correct;
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
  document.getElementById('nau-ov-icon').textContent  = iWon ? '🏆' : '💀';
  document.getElementById('nau-ov-title').textContent = iWon ? 'Νίκη!' : 'Ήττα';
  document.getElementById('nau-ov-msg').textContent   = iWon
    ? 'Ο εχθρικός στόλος βυθίστηκε. Η Αθήνα θριαμβεύει!'
    : 'Ο στόλος σου καταστράφηκε. Μεγάλη απώλεια για την Αθήνα.';
  _nauPhase('over');
}

// ── Canvas Particle System ─────────────────────────────────────
function _nauAnimLoop() {
  if (!NAU) return;
  for (const key in NAU.cv) {
    const state = NAU.cv[key];
    if (!state) continue;
    const { ctx, el, particles } = state;
    ctx.clearRect(0, 0, el.width, el.height);
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

// Trigger the right effect after a shot resolves
function _nauDoEffect(r, c, result, sunkShip, gid) {
  const { x, y } = _nauCellPx(gid, r, c);

  if (result === 'miss') {
    // Water splash — cyan/blue droplets
    _nauSpawn(gid, 18, x, y,
      ['#1A8AAA', '#2AAAC0', '#40B8CC', '#7ACCE0', '#AAE0EE'],
      3.8, 4.0, 5, 1.0, 0.20, 0.014);
  } else {
    // Hit explosion — oranges, reds, golds
    _nauSpawn(gid, 36, x, y,
      ['#C9A44A', '#C0391B', '#E06018', '#FF8020', '#FFD050', '#FF4428'],
      5.5, 5.0, 8, 1.0, 0.24, 0.010);
    _nauShake();
  }

  if (sunkShip?.cells?.length) {
    // Sunk ship burning embers — delayed
    setTimeout(() => { if (NAU) _nauEmbers(gid, sunkShip.cells); }, 260);
  }
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
