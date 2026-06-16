// ============================================================
//  ARCHAEOLOGICAL DIG (Ανασκαφή) — Discovery Grid Game
//  8×8 covered grid · 4 hidden artifacts · Quiz to scan/clean
// ============================================================

/* ── Question bank ── */
const DG_Q = [
  {q:{gr:'Ποιος ανακάλυψε τις Μυκήνες τον 19ο αιώνα;',en:'Who excavated Mycenae in the 19th century?'},a:['Αρθουρ Έβανς','Ερρίκος Σλήμαν','Πωλ Φαρ','Χάρολντ Άρθουρ'],c:1},
  {q:{gr:'Τι σύστημα γραφής χρησιμοποιούσαν οι Μυκηναίοι;',en:'What writing system did the Mycenaeans use?'},a:['Ιερογλυφικά','Γραμμική Α','Γραμμική Β','Κυπριακό Συλλαβάριο'],c:2},
  {q:{gr:'Πού βρέθηκε η «Χρυσή Μάσκα του Αγαμέμνονα»;',en:'Where was the "Mask of Agamemnon" found?'},a:['Κνωσός','Δελφοί','Μυκήνες','Άργος'],c:2},
  {q:{gr:'Ποια ήταν η βασική χρήση του αμφορέα στην αρχαιότητα;',en:'What was the primary use of the amphora in antiquity?'},a:['Ταφή','Αποθήκευση & μεταφορά','Λατρεία','Διακόσμηση'],c:1},
  {q:{gr:'Πότε αποκρυπτογραφήθηκε η Γραμμική Β;',en:'When was Linear B deciphered?'},a:['1922','1940','1952','1968'],c:2},
  {q:{gr:'Ποια αρχαία πόλη εξερεύνησε κυρίως ο Αρθουρ Έβανς;',en:'Which ancient city did Arthur Evans primarily excavate?'},a:['Θήρα','Κνωσός','Πύλος','Ολυμπία'],c:1},
  {q:{gr:'Ποια είναι η γ΄ εν. ενεστ. ενεργ. του «λύω»;',en:'3rd singular present active of "λύω"?'},a:['λύεις','λύει','λύομεν','λύουσι'],c:1},
  {q:{gr:'Ποια πτώση δηλώνει το αντικείμενο;',en:'Which case marks the direct object?'},a:['Ονομαστική','Γενική','Αιτιατική','Δοτική'],c:2},
  {q:{gr:'Πόσο διήρκεσε ο Τρωικός Πόλεμος κατά τη μυθολογία;',en:'How long did the Trojan War last according to mythology?'},a:['7 χρόνια','10 χρόνια','12 χρόνια','20 χρόνια'],c:1},
  {q:{gr:'Ποιος ήρωας αποκαλείται «πόδας ὠκύς» στην Ιλιάδα;',en:'Which hero is called "swift-footed" in the Iliad?'},a:['Αἴας','Ἕκτωρ','Ἀχιλλεύς','Ὀδυσσεύς'],c:2},
  {q:{gr:'Τι είναι η «εὐκτική»;',en:'What is the optative mood?'},a:['Χρόνος ρήματος','Φωνή ρήματος','Έγκλιση ρήματος','Πτώση ονόματος'],c:2},
  {q:{gr:'Σε ποια κλίση ανήκει το «ἡ ἀρετή»;',en:'Which declension does "ἡ ἀρετή" belong to?'},a:['Α΄','Β΄','Γ΄','Δ΄'],c:0},
  {q:{gr:'Ποιος θεός προστατεύει την Αθήνα κατά τη μυθολογία;',en:'Which god/goddess protects Athens in mythology?'},a:['Άρης','Ποσειδώνας','Αθηνά','Ζεύς'],c:2},
  {q:{gr:'Ποιος σκοτώνει τον Πάτροκλο στην Ιλιάδα;',en:'Who kills Patroclus in the Iliad?'},a:['Ἀχιλλεύς','Ἕκτωρ','Αἴας','Διομήδης'],c:1},
  {q:{gr:'Τι ζητά ο Πρίαμος από τον Αχιλλέα;',en:'What does Priam ask of Achilles?'},a:['Ανακωχή','Σώμα του Έκτορα','Λύτρα','Ειρήνη'],c:1},
  {q:{gr:'Ποιος Κύκλωπας τυφλώνει ο Οδυσσέας;',en:'Which Cyclops does Odysseus blind?'},a:['Βρόντης','Στερόπης','Πολύφημος','Άργης'],c:2},
  {q:{gr:'Ποια νύμφη κρατά τον Οδυσσέα 7 χρόνια;',en:'Which nymph keeps Odysseus for 7 years?'},a:['Κίρκη','Καλυψώ','Σκύλλα','Ναυσικά'],c:1},
  {q:{gr:'Ποιο είναι ο αόρ. α΄ εν. ενεργ. του «λύω»;',en:'Aorist active 1st singular of "λύω"?'},a:['ἔλυον','ἔλυσα','λέλυκα','λύσω'],c:1},
  {q:{gr:'Ποια ήταν η κύρια τροφή της Κλασικής Αθήνας;',en:'What was the staple food of Classical Athens?'},a:['Κρέας','Σιτάρι & κριθάρι','Ψάρι','Φρούτα'],c:1},
  {q:{gr:'Πού βρίσκεται η Ακρόπολη των Αθηνών;',en:'Where is the Athenian Acropolis located?'},a:['Στην Αγορά','Στο Λόφο Ερεχθείου','Στον κεντρικό λόφο','Στον Κεραμεικό'],c:2},
];

/* ── Artifact definitions ── */
const DG_ARTIFACTS = [
  {
    id: 'mask', name: 'Χρυσή Μάσκα', nameEn: 'Gold Mask',
    icon: '🎭', era: '1600–1100 π.Χ.', eraEn: '1600–1100 BC',
    shape: [[0,0],[0,1]], // 2-tile horizontal
    color: '#8B6018', colorLight: '#C4922E',
    fact: {
      gr: '<strong>Χρυσή Μάσκα του Αγαμέμνονα</strong> — Ανακαλύφθηκε από τον Ερρίκο Σλήμαν στις Μυκήνες το 1876. Αν και ο Σλήμαν πίστευε ότι ανήκε στον βασιλιά Αγαμέμνονα, σύγχρονες έρευνες χρονολογούν τη μάσκα 300 χρόνια νωρίτερα από τον υπολογιζόμενο χρόνο του Αγαμέμνονα. Αποτελεί σύμβολο του Μυκηναϊκού πολιτισμού.',
      en: '<strong>Mask of Agamemnon</strong> — Discovered by Heinrich Schliemann at Mycenae in 1876. Though Schliemann believed it belonged to King Agamemnon, modern dating places it 300 years earlier than the legendary king. It remains a symbol of Mycenaean civilization.',
    },
  },
  {
    id: 'amphora', name: 'Αμφορέας', nameEn: 'Amphora',
    icon: '🏺', era: '500 π.Χ.', eraEn: '500 BC',
    shape: [[0,0],[1,0],[2,0]], // 3-tile vertical
    color: '#6B3820', colorLight: '#9B5432',
    fact: {
      gr: '<strong>Αμφορέας</strong> — Το βασικό αγγείο αποθήκευσης και μεταφοράς του αρχαίου ελληνικού κόσμου. Χρησιμοποιούνταν για λάδι, κρασί και σιτηρά. Διακοσμημένοι Παναθηναϊκοί αμφορείς γεμάτοι με ελαιόλαδο χρησίμευαν ως βραβεία στους Παναθηναϊκούς Αγώνες (530–410 π.Χ.).',
      en: '<strong>Amphora</strong> — The principal storage and transport vessel of the ancient Greek world, used for oil, wine, and grain. Decorated Panathenaic amphorae filled with olive oil served as prizes at the Panathenaic Games (530–410 BC).',
    },
  },
  {
    id: 'tablet', name: 'Γραπτή Πλάκα', nameEn: 'Inscribed Tablet',
    icon: '📜', era: '1450 π.Χ.', eraEn: '1450 BC',
    shape: [[0,0],[0,1],[1,0],[1,1]], // 4-tile 2×2
    color: '#3E4E1A', colorLight: '#607030',
    fact: {
      gr: '<strong>Πλάκα Γραμμικής Β</strong> — Τα αρχαιότερα γραπτά στοιχεία της ελληνικής γλώσσας. Βρέθηκαν στην Κνωσό και τις Μυκήνες (περ. 1450 π.Χ.) και αποκρυπτογραφήθηκαν από τον αρχιτέκτονα <strong>Μάικλ Βέντρις</strong> το 1952. Περιέχουν κυρίως διοικητικές καταγραφές: αποθέματα, φόρους, ζώα.',
      en: '<strong>Linear B Tablet</strong> — The earliest written records of the Greek language, found at Knossos and Mycenae (c. 1450 BC). Deciphered by architect <strong>Michael Ventris</strong> in 1952, they contain mainly administrative records: inventories, taxes, livestock.',
    },
  },
  {
    id: 'shield', name: 'Χάλκινη Ασπίδα', nameEn: 'Bronze Shield',
    icon: '🛡️', era: '700 π.Χ.', eraEn: '700 BC',
    shape: [[0,0],[0,1],[1,0]], // 3-tile L-shape
    color: '#4A3C18', colorLight: '#7A6030',
    fact: {
      gr: '<strong>Χάλκινη Ασπίδα</strong> — Η ασπίδα τύπου «Άργος» ήταν ο βασικός αμυντικός εξοπλισμός του Έλληνα οπλίτη. Ζύγιζε περίπου 8 κιλά. Οι Σπαρτιάτισσες μητέρες έλεγαν στους γιους τους: <em>«ἢ τὰν ἢ ἐπὶ τᾶς»</em> — με αυτήν (νικητής) ή επί αυτής (νεκρός).',
      en: '<strong>Bronze Shield</strong> — The Argive round shield was the core defensive equipment of the Greek hoplite, weighing ~8 kg. Spartan mothers famously told their sons: <em>"ἢ τὰν ἢ ἐπὶ τᾶς"</em> — with it (victorious) or on it (carried dead).',
    },
  },
];

/* ── State ── */
let _dig = null;
let _digDustAF = null;
let _digDustPts = [];

/* ══════════════════════════════════════════
   PUBLIC API
══════════════════════════════════════════ */
function openDig() {
  document.getElementById('dig-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('dg-menu-scr')) _digBuild();
  _digShowScr('dg-menu-scr');
}

function closeDig() {
  _digStopDust();
  document.getElementById('dig-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

/* ══════════════════════════════════════════
   BUILD HTML (once)
══════════════════════════════════════════ */
function _digBuild() {
  // Build scan row buttons (0-7)
  const rowBtns = Array.from({length:8},(_,i) =>
    `<button class="dg-scan-btn" onclick="_digScanAsk('row',${i})">Γ${i+1}</button>`
  ).join('');
  const colBtns = Array.from({length:8},(_,i) =>
    `<button class="dg-scan-btn" onclick="_digScanAsk('col',${i})">Σ${i+1}</button>`
  ).join('');

  document.getElementById('dig-wrap').innerHTML = `
<canvas id="dg-dust-cnv" class="dg-canvas-ovl" aria-hidden="true"></canvas>

<!-- MENU -->
<div id="dg-menu-scr" class="dg-screen active">
  <div class="dg-menu-wrap">
    <div class="dg-logo">Ανασκαφή<em>.</em></div>
    <div class="dg-logo-sub">Archaeological Dig — Ιστορική Αποκάλυψη</div>
    <div class="dg-rule">
      <strong>Κανόνες:</strong> Κάνε κλικ σε τετράγωνα για να σκάψεις. Αν βρεις τμήμα αρχαίου ευρήματος, πρέπει να <strong>απαντήσεις σωστά</strong> για να το καθαρίσεις. Χρησιμοποίησε τα κουμπιά <strong>Σάρωση Γραμμής/Στήλης</strong> για να εντοπίσεις τα κρυμμένα αντικείμενα — αλλά κάθε σάρωση απαιτεί απάντηση ερώτησης! Στόχος: Εντόπισε και καθάρισε <strong>και τα 4 αρχαιολογικά ευρήματα.</strong>
    </div>
    <button class="dg-btn" onclick="_digStartGame()">ΕΝΑΡΞΗ ΑΝΑΣΚΑΦΗΣ</button>
  </div>
</div>

<!-- MAIN GAME -->
<div id="dg-game-scr" class="dg-screen">
  <div class="dg-game-inner">
    <div class="dg-hud">
      <div class="dg-hud-item">
        <span class="dg-hud-lbl">ΕΥΡΗΜΑΤΑ</span>
        <span class="dg-hud-val" id="dg-found-cnt">0/4</span>
      </div>
      <div class="dg-hud-item" style="align-items:center;">
        <span class="dg-hud-lbl">ΑΝΕΣΚΑΜΜΕΝΑ</span>
        <span class="dg-hud-val" id="dg-dug-cnt">0/64</span>
      </div>
      <div class="dg-hud-item" style="align-items:flex-end;">
        <span class="dg-hud-lbl">ΣΑΡΩΣΕΙΣ</span>
        <span class="dg-hud-val" id="dg-scan-cnt">0</span>
      </div>
    </div>
    <div class="dg-status-msg" id="dg-status">Κλικ σε τετράγωνο για να σκάψεις. Σάρωσε γραμμή/στήλη για ανίχνευση.</div>
    <div class="dg-scan-panel">
      <span class="dg-scan-lbl">ΣΑΡΩΣΗ ΓΡΑΜΜΗΣ:</span>
      ${rowBtns}
      <div class="dg-scan-divider"></div>
      <span class="dg-scan-lbl">ΣΑΡΩΣΗ ΣΤΗΛΗΣ:</span>
      ${colBtns}
    </div>
    <div class="dg-grid-outer">
      <div class="dg-grid" id="dg-grid"></div>
    </div>
  </div>

  <!-- Quiz modal -->
  <div id="dg-quiz-wrap" class="dg-quiz-wrap">
    <div class="dg-quiz-box">
      <div class="dg-quiz-header">
        <div class="dg-quiz-icon" id="dg-q-icon">⛏</div>
        <div>
          <div class="dg-quiz-type" id="dg-q-type">ΣΑΡΩΣΗ ΠΕΡΙΟΧΗΣ</div>
          <div class="dg-quiz-subtitle" id="dg-q-sub"></div>
        </div>
      </div>
      <div class="dg-qlbl">ΑΡΧΑΙΟΛΟΓΙΚΗ ΔΟΚΙΜΑΣΙΑ</div>
      <div class="dg-qtxt" id="dg-qtxt"></div>
      <div class="dg-opts" id="dg-opts"></div>
      <div class="dg-quiz-result" id="dg-quiz-res" style="display:none;"></div>
    </div>
  </div>

  <!-- Artifact discovery modal -->
  <div id="dg-art-modal" class="dg-art-modal">
    <div class="dg-art-box">
      <div class="dg-art-icon" id="dg-art-icon"></div>
      <div class="dg-art-name"  id="dg-art-name"></div>
      <div class="dg-art-era"   id="dg-art-era"></div>
      <div class="dg-art-divider"></div>
      <div class="dg-art-fact"  id="dg-art-fact"></div>
      <button class="dg-btn" onclick="_digCloseArtModal()">ΣΥΝΕΧΕΙΑ ΑΝΑΣΚΑΦΗΣ →</button>
    </div>
  </div>
</div>

<!-- RESULT -->
<div id="dg-result-scr" class="dg-screen">
  <div class="dg-result-wrap">
    <div class="dg-res-title">ΑΝΑΚΑΛΥΨΗ!</div>
    <div class="dg-res-sub">Η ανασκαφή ολοκληρώθηκε.</div>
    <div class="dg-res-detail" id="dg-res-detail"></div>
    <div class="dg-res-btns">
      <button class="dg-btn"     onclick="_digStartGame()">ΝΕΑ ΑΝΑΣΚΑΦΗ</button>
      <button class="dg-btn sec" onclick="_digShowScr('dg-menu-scr')">ΜΕΝΟΥ</button>
    </div>
  </div>
</div>`;

  _digInitDustCanvas();
}

function _digShowScr(id) {
  document.querySelectorAll('#dig-wrap .dg-screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

/* ══════════════════════════════════════════
   INIT GAME
══════════════════════════════════════════ */
function _digStartGame() {
  _dig = {
    tiles: Array(64).fill(null).map(() => ({ state: 'covered', artId: null })),
    artifacts: [],
    scanCount: 0,
    foundCount: 0,
    dugCount: 0,
    pending: null, // { type:'scan'|'clean', artId, tileIdx, row, col }
    qPool: _digShuffle(Array.from({length: DG_Q.length}, (_, i) => i)),
    qIdx: 0,
  };

  _digPlaceArtifacts();
  _digRenderGrid();
  _digUpdateHUD();
  _digShowScr('dg-game-scr');
  _digStatus('Κλικ σε τετράγωνο για να σκάψεις. Σάρωσε γραμμή/στήλη για ανίχνευση.');
  _digStartDust();
}

function _digShuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function _digPlaceArtifacts() {
  // Place each artifact randomly, no overlap
  const occupied = new Set();

  for (const art of DG_ARTIFACTS) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 200) {
      attempts++;
      const anchorR = Math.floor(Math.random() * 7);
      const anchorC = Math.floor(Math.random() * 7);
      const cells = art.shape.map(([dr, dc]) => {
        const r = anchorR + dr, c = anchorC + dc;
        return { r, c, idx: r * 8 + c };
      });
      // Check bounds + no overlap
      if (cells.some(({r, c}) => r < 0 || r > 7 || c < 0 || c > 7)) continue;
      if (cells.some(({idx}) => occupied.has(idx))) continue;
      // Place
      cells.forEach(({idx}) => {
        occupied.add(idx);
        _dig.tiles[idx] = { state: 'covered', artId: art.id };
      });
      _dig.artifacts.push({ ...art, cellIndices: cells.map(({idx}) => idx), cleaned: 0 });
      placed = true;
    }
  }
}

/* ══════════════════════════════════════════
   RENDERING
══════════════════════════════════════════ */
function _digRenderGrid() {
  const grid = document.getElementById('dg-grid');
  if (!grid) return;
  let html = '';
  for (let i = 0; i < 64; i++) {
    const tile = _dig.tiles[i];
    let cls = 'dg-cell';
    let style = '';
    let inner = '';

    if (tile.state === 'covered') {
      cls += ' covered';
    } else if (tile.state === 'empty') {
      cls += ' empty just-revealed';
    } else if (tile.state === 'artifact-dirty') {
      const art = _dig.artifacts.find(a => a.id === tile.artId);
      cls += ' artifact-dirty';
      if (art) style = `--art-col:${art.color};`;
    } else if (tile.state === 'artifact-clean') {
      const art = _dig.artifacts.find(a => a.id === tile.artId);
      cls += ' artifact-clean';
      if (art) style = `--art-col:${art.colorLight};`;
    }

    html += `<div class="${cls}" style="${style}" data-idx="${i}" onclick="_digClickTile(${i})">${inner}</div>`;
  }
  grid.innerHTML = html;
}

function _digUpdateHUD() {
  const f = document.getElementById('dg-found-cnt');
  const d = document.getElementById('dg-dug-cnt');
  const s = document.getElementById('dg-scan-cnt');
  if (f) f.textContent = `${_dig.foundCount}/4`;
  if (d) d.textContent = `${_dig.dugCount}/64`;
  if (s) s.textContent = _dig.scanCount;
}

function _digStatus(msg) {
  const el = document.getElementById('dg-status');
  if (el) el.textContent = msg;
}

/* ══════════════════════════════════════════
   TILE INTERACTION
══════════════════════════════════════════ */
function _digClickTile(idx) {
  if (!_dig) return;
  const tile = _dig.tiles[idx];
  if (!tile || tile.state === 'empty' || tile.state === 'artifact-clean') return;

  const row = Math.floor(idx / 8), col = idx % 8;

  if (tile.state === 'covered') {
    // Uncover it (no quiz required)
    _digRevealTile(idx);
  } else if (tile.state === 'artifact-dirty') {
    // Quiz to clean it
    _dig.pending = { type: 'clean', tileIdx: idx, artId: tile.artId };
    _digShowQuiz('clean', tile.artId);
  }
}

function _digRevealTile(idx) {
  const tile = _dig.tiles[idx];
  _dig.dugCount++;

  if (tile.artId) {
    tile.state = 'artifact-dirty';
    _digStatus('Βρέθηκε αρχαίο εύρημα! Κλικ ξανά για να το καθαρίσεις.');
    _digSpawnDust(idx, '#B87A25');
  } else {
    tile.state = 'empty';
    _digSpawnDust(idx, '#6B4A28');
  }

  _digRenderGrid();
  _digUpdateHUD();
}

/* ══════════════════════════════════════════
   SCAN MECHANIC
══════════════════════════════════════════ */
function _digScanAsk(axis, index) {
  if (!_dig) return;
  _dig.pending = { type: 'scan', axis, index };
  const lang = typeof siteLang !== 'undefined' ? siteLang : 'gr';
  const label = axis === 'row'
    ? (lang === 'en' ? `Row ${index + 1}` : `Γραμμή ${index + 1}`)
    : (lang === 'en' ? `Column ${index + 1}` : `Στήλη ${index + 1}`);
  _digShowQuiz('scan', null, label);
}

function _digDoScan(axis, index) {
  const lang = typeof siteLang !== 'undefined' ? siteLang : 'gr';
  _dig.scanCount++;
  _digUpdateHUD();

  // Find which tiles are in this row/col
  let hasArtifact = false;
  const indices = [];
  for (let i = 0; i < 64; i++) {
    const r = Math.floor(i / 8), c = i % 8;
    if ((axis === 'row' && r === index) || (axis === 'col' && c === index)) {
      indices.push(i);
      if (_dig.tiles[i].artId) hasArtifact = true;
    }
  }

  // Highlight scanned row/col
  const grid = document.getElementById('dg-grid');
  if (grid) {
    indices.forEach(i => {
      const cell = grid.children[i];
      if (cell) {
        cell.classList.add(axis === 'row' ? 'scan-row' : 'scan-col');
        setTimeout(() => cell.classList.remove('scan-row', 'scan-col'), 2500);
      }
    });
  }

  const axisLabel = axis === 'row'
    ? (lang === 'en' ? `Row ${index + 1}` : `Γραμμή ${index + 1}`)
    : (lang === 'en' ? `Column ${index + 1}` : `Στήλη ${index + 1}`);

  if (hasArtifact) {
    _digStatus(lang === 'en'
      ? `📡 ${axisLabel}: ARTIFACT DETECTED! Dig carefully!`
      : `📡 ${axisLabel}: ΕΥΡΗΜΑ ΑΝΙΧΝΕΥΘΗΚΕ! Σκάψε προσεκτικά!`);
  } else {
    _digStatus(lang === 'en'
      ? `📡 ${axisLabel}: Nothing detected here.`
      : `📡 ${axisLabel}: Δεν ανιχνεύθηκε τίποτα.`);
  }
}

/* ══════════════════════════════════════════
   QUIZ
══════════════════════════════════════════ */
function _digShowQuiz(type, artId, label) {
  const lang = typeof siteLang !== 'undefined' ? siteLang : 'gr';
  const qObj = DG_Q[_dig.qPool[_dig.qIdx % _dig.qPool.length]];
  _dig.qIdx++;

  const typeEl = document.getElementById('dg-q-type');
  const subEl  = document.getElementById('dg-q-sub');
  const iconEl = document.getElementById('dg-q-icon');

  if (type === 'scan') {
    iconEl.textContent = '📡';
    typeEl.textContent = lang === 'en' ? 'AREA SCAN'   : 'ΣΑΡΩΣΗ ΠΕΡΙΟΧΗΣ';
    subEl.textContent  = label || '';
  } else {
    const art = DG_ARTIFACTS.find(a => a.id === artId);
    iconEl.textContent = art ? art.icon : '⛏';
    typeEl.textContent = lang === 'en' ? 'ARTIFACT CLEANING' : 'ΚΑΘΑΡΙΣΜΟΣ ΕΥΡΗΜΑΤΟΣ';
    subEl.textContent  = art ? (lang === 'en' ? art.nameEn : art.name) : '';
  }

  document.getElementById('dg-qtxt').textContent = qObj.q[lang] || qObj.q.gr;
  document.getElementById('dg-opts').innerHTML = qObj.a.map((opt, i) =>
    `<button class="dg-opt" onclick="_digAnswer(${i})">${opt}</button>`
  ).join('');
  document.getElementById('dg-quiz-res').style.display = 'none';
  document.getElementById('dg-quiz-wrap').classList.add('active');
}

function _digAnswer(idx) {
  const qObj   = DG_Q[_dig.qPool[(_dig.qIdx - 1) % _dig.qPool.length]];
  const correct = idx === qObj.c;
  const lang    = typeof siteLang !== 'undefined' ? siteLang : 'gr';
  const pending = _dig.pending;

  document.querySelectorAll('#dg-opts .dg-opt').forEach((btn, i) => {
    btn.disabled = true;
    if (i === qObj.c)  btn.classList.add('correct');
    else if (i === idx) btn.classList.add('wrong');
  });

  let msg = '';
  if (correct) {
    msg = lang === 'en' ? '<strong>Correct!</strong>' : '<strong>Σωστό!</strong>';
    if (pending.type === 'scan') {
      msg += lang === 'en' ? ' Scanning now…' : ' Σαρώνω…';
    } else {
      msg += lang === 'en' ? ' Artifact piece preserved!' : ' Τμήμα ευρήματος διατηρήθηκε!';
    }
  } else {
    msg = lang === 'en'
      ? '<strong>Wrong!</strong> The technique failed.'
      : '<strong>Λάθος!</strong> Η τεχνική απέτυχε.';
  }

  const resEl = document.getElementById('dg-quiz-res');
  resEl.innerHTML = msg;
  resEl.style.display = 'block';

  setTimeout(() => {
    document.getElementById('dg-quiz-wrap').classList.remove('active');
    _dig.pending = null;

    if (pending.type === 'scan') {
      if (correct) _digDoScan(pending.axis, pending.index);
      else _digStatus(lang === 'en' ? 'Scan failed. Try again.' : 'Αποτυχία σάρωσης. Δοκίμασε ξανά.');
    } else if (pending.type === 'clean') {
      if (correct) {
        _digCleanTile(pending.tileIdx);
      } else {
        _digStatus(lang === 'en'
          ? 'Cleaning failed — answer correctly to preserve the artifact.'
          : 'Αποτυχία καθαρισμού — απάντησε σωστά για να διατηρήσεις το εύρημα.');
      }
    }
  }, 1600);
}

function _digCleanTile(idx) {
  const tile = _dig.tiles[idx];
  if (!tile || tile.state !== 'artifact-dirty') return;
  tile.state = 'artifact-clean';

  _digSpawnDust(idx, '#C8962A');
  _digRenderGrid();

  // Check if full artifact is cleaned
  const artId = tile.artId;
  const artDef = _dig.artifacts.find(a => a.id === artId);
  if (!artDef) return;

  const allClean = artDef.cellIndices.every(i => _dig.tiles[i].state === 'artifact-clean');
  if (allClean) {
    _dig.foundCount++;
    _digUpdateHUD();
    _digStatus('');
    setTimeout(() => _digShowArtModal(artId), 400);
  } else {
    const remaining = artDef.cellIndices.filter(i => _dig.tiles[i].state !== 'artifact-clean').length;
    const lang = typeof siteLang !== 'undefined' ? siteLang : 'gr';
    _digStatus(lang === 'en'
      ? `${remaining} tile(s) remaining to clean on this artifact.`
      : `Απομένουν ${remaining} τμήματα για καθαρισμό σε αυτό το εύρημα.`);
  }
}

/* ══════════════════════════════════════════
   ARTIFACT MODAL
══════════════════════════════════════════ */
function _digShowArtModal(artId) {
  const lang   = typeof siteLang !== 'undefined' ? siteLang : 'gr';
  const artDef = DG_ARTIFACTS.find(a => a.id === artId);
  if (!artDef) return;

  document.getElementById('dg-art-icon').textContent  = artDef.icon;
  document.getElementById('dg-art-name').textContent  = lang === 'en' ? artDef.nameEn : artDef.name;
  document.getElementById('dg-art-era').textContent   = lang === 'en' ? artDef.eraEn  : artDef.era;
  document.getElementById('dg-art-fact').innerHTML    = artDef.fact[lang] || artDef.fact.gr;
  document.getElementById('dg-art-modal').classList.add('active');
}

function _digCloseArtModal() {
  document.getElementById('dg-art-modal').classList.remove('active');
  if (_dig.foundCount >= 4) {
    _digEndGame();
  }
}

function _digEndGame() {
  const lang = typeof siteLang !== 'undefined' ? siteLang : 'gr';
  const detEl = document.getElementById('dg-res-detail');
  if (detEl) {
    detEl.textContent = lang === 'en'
      ? `You uncovered ${_dig.dugCount} tiles, used ${_dig.scanCount} radar scans, and retrieved all 4 ancient artifacts. The museum thanks you.`
      : `Ανέσκαψες ${_dig.dugCount} τετράγωνα, χρησιμοποίησες ${_dig.scanCount} σαρώσεις ραντάρ και ανέσυρες και τα 4 αρχαία ευρήματα. Το μουσείο σε ευχαριστεί.`;
  }
  _digStopDust();
  if(typeof awardGameRewards==='function' && _dig.foundCount > 0){ awardGameRewards('dig', { score: _dig.foundCount, perfect: false }); }
  setTimeout(() => _digShowScr('dg-result-scr'), 400);
}

/* ══════════════════════════════════════════
   DUST PARTICLE CANVAS
══════════════════════════════════════════ */
function _digInitDustCanvas() {
  const wrap = document.getElementById('dig-wrap');
  const cnv  = document.getElementById('dg-dust-cnv');
  if (!wrap || !cnv) return;
  const resize = () => { cnv.width = wrap.offsetWidth; cnv.height = wrap.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);
}

function _digSpawnDust(tileIdx, color) {
  const grid = document.getElementById('dg-grid');
  const wrap = document.getElementById('dig-wrap');
  if (!grid || !wrap) return;
  const cellEl = grid.children[tileIdx];
  if (!cellEl) return;
  const wr = wrap.getBoundingClientRect();
  const cr = cellEl.getBoundingClientRect();
  const cx = cr.left - wr.left + cr.width  / 2;
  const cy = cr.top  - wr.top  + cr.height / 2;
  for (let i = 0; i < 12; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.5 + 0.5;
    _digDustPts.push({
      x: cx, y: cy,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.5,
      life: 1.0,
      size: Math.random() * 3.5 + 1,
      color,
    });
  }
}

function _digStartDust() {
  // Ambient dust
  const wrap = document.getElementById('dig-wrap');
  if (!wrap) return;
  const addAmbient = () => {
    const cnv = document.getElementById('dg-dust-cnv');
    if (!cnv) return;
    for (let i = 0; i < 2; i++) {
      _digDustPts.push({
        x: Math.random() * cnv.width,
        y: cnv.height + 5,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.2),
        life: 0.5,
        size: Math.random() * 2 + 0.5,
        color: '#6B4A28',
      });
    }
  };
  _digDustLoop(addAmbient);
}

function _digDustLoop(addAmbient) {
  const cnv = document.getElementById('dg-dust-cnv');
  if (!cnv) return;
  const ctx = cnv.getContext('2d');
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  if (addAmbient) addAmbient();

  _digDustPts = _digDustPts.filter(p => p.life > 0.01);
  for (const p of _digDustPts) {
    ctx.globalAlpha = Math.max(0, p.life * 0.7);
    ctx.fillStyle   = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    p.x    += p.vx;
    p.y    += p.vy;
    p.vy   -= 0.02;
    p.life -= 0.018;
  }
  ctx.globalAlpha = 1;
  _digDustAF = requestAnimationFrame(() => _digDustLoop(addAmbient));
}

function _digStopDust() {
  if (_digDustAF) { cancelAnimationFrame(_digDustAF); _digDustAF = null; }
  _digDustPts = [];
  const cnv = document.getElementById('dg-dust-cnv');
  if (cnv) cnv.getContext('2d').clearRect(0, 0, cnv.width, cnv.height);
}
