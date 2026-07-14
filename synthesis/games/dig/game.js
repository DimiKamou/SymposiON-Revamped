// ============================================================
//  ARCHAEOLOGICAL DIG (Ανασκαφή) — Discovery Grid Game
//  8×8 covered grid · 4 hidden artifacts · Quiz to scan/clean
//  Presentation: lantern-lit trench, earth strata, coordinate
//  rails around the pit, museum-card artifact reveals, and a
//  typed particle system (dust / rock chips / gold sparks).
//  Gameplay, rules, scoring and data are unchanged.
// ============================================================

// Language-picking normalizer: the host/picker bank may deliver `q` as a
// bilingual object ({gr,en}), a bare string, or a {q:{gr,en}} wrapper — resolve
// it to a string so the card never renders "[object Object]" / "undefined".
function _digQT(q) {
  var lg = (typeof siteLang !== 'undefined' && siteLang === 'en') ? 'en' : 'gr';
  if (q == null) return '';
  if (typeof q === 'string') return q;
  if (typeof q === 'object') {
    var v = q[lg] != null ? q[lg] : (q.gr != null ? q.gr : q.en);
    if (typeof v === 'string') return v;
    if (v && typeof v === 'object') return _digQT(v);
    if (q.q !== undefined) return _digQT(q.q);
  }
  return String(q);
}

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
    color: '#96660F', colorLight: '#D4A431',
    fact: {
      gr: '<strong>Χρυσή Μάσκα του Αγαμέμνονα</strong> — Ανακαλύφθηκε από τον Ερρίκο Σλήμαν στις Μυκήνες το 1876. Αν και ο Σλήμαν πίστευε ότι ανήκε στον βασιλιά Αγαμέμνονα, σύγχρονες έρευνες χρονολογούν τη μάσκα 300 χρόνια νωρίτερα από τον υπολογιζόμενο χρόνο του Αγαμέμνονα. Αποτελεί σύμβολο του Μυκηναϊκού πολιτισμού.',
      en: '<strong>Mask of Agamemnon</strong> — Discovered by Heinrich Schliemann at Mycenae in 1876. Though Schliemann believed it belonged to King Agamemnon, modern dating places it 300 years earlier than the legendary king. It remains a symbol of Mycenaean civilization.',
    },
  },
  {
    id: 'amphora', name: 'Αμφορέας', nameEn: 'Amphora',
    icon: '🏺', era: '500 π.Χ.', eraEn: '500 BC',
    shape: [[0,0],[1,0],[2,0]], // 3-tile vertical
    color: '#7A3E1E', colorLight: '#B25E30',
    fact: {
      gr: '<strong>Αμφορέας</strong> — Το βασικό αγγείο αποθήκευσης και μεταφοράς του αρχαίου ελληνικού κόσμου. Χρησιμοποιούνταν για λάδι, κρασί και σιτηρά. Διακοσμημένοι Παναθηναϊκοί αμφορείς γεμάτοι με ελαιόλαδο χρησίμευαν ως βραβεία στους Παναθηναϊκούς Αγώνες (530–410 π.Χ.).',
      en: '<strong>Amphora</strong> — The principal storage and transport vessel of the ancient Greek world, used for oil, wine, and grain. Decorated Panathenaic amphorae filled with olive oil served as prizes at the Panathenaic Games (530–410 BC).',
    },
  },
  {
    id: 'tablet', name: 'Γραπτή Πλάκα', nameEn: 'Inscribed Tablet',
    icon: '📜', era: '1450 π.Χ.', eraEn: '1450 BC',
    shape: [[0,0],[0,1],[1,0],[1,1]], // 4-tile 2×2
    color: '#45521E', colorLight: '#6D7A35',
    fact: {
      gr: '<strong>Πλάκα Γραμμικής Β</strong> — Τα αρχαιότερα γραπτά στοιχεία της ελληνικής γλώσσας. Βρέθηκαν στην Κνωσό και τις Μυκήνες (περ. 1450 π.Χ.) και αποκρυπτογραφήθηκαν από τον αρχιτέκτονα <strong>Μάικλ Βέντρις</strong> το 1952. Περιέχουν κυρίως διοικητικές καταγραφές: αποθέματα, φόρους, ζώα.',
      en: '<strong>Linear B Tablet</strong> — The earliest written records of the Greek language, found at Knossos and Mycenae (c. 1450 BC). Deciphered by architect <strong>Michael Ventris</strong> in 1952, they contain mainly administrative records: inventories, taxes, livestock.',
    },
  },
  {
    id: 'shield', name: 'Χάλκινη Ασπίδα', nameEn: 'Bronze Shield',
    icon: '🛡️', era: '700 π.Χ.', eraEn: '700 BC',
    shape: [[0,0],[0,1],[1,0]], // 3-tile L-shape
    color: '#58461C', colorLight: '#8A6F33',
    fact: {
      gr: '<strong>Χάλκινη Ασπίδα</strong> — Η ασπίδα τύπου «Άργος» ήταν ο βασικός αμυντικός εξοπλισμός του Έλληνα οπλίτη. Ζύγιζε περίπου 8 κιλά. Οι Σπαρτιάτισσες μητέρες έλεγαν στους γιους τους: <em>«ἢ τὰν ἢ ἐπὶ τᾶς»</em> — με αυτήν (νικητής) ή επί αυτής (νεκρός).',
      en: '<strong>Bronze Shield</strong> — The Argive round shield was the core defensive equipment of the Greek hoplite, weighing ~8 kg. Spartan mothers famously told their sons: <em>"ἢ τὰν ἢ ἐπὶ τᾶς"</em> — with it (victorious) or on it (carried dead).',
    },
  },
];

/* Column letters for the coordinate rail (archaeological grid notation) */
const DG_COLS = ['Α','Β','Γ','Δ','Ε','Ζ','Η','Θ'];

/* Per-row soil tones — four real strata: humus topsoil, red clay,
   grey volcanic ash, and deep bedrock loam (presentation only) */
const DG_SOIL = ['#5C3F24','#563A20','#5E351D','#552F18','#4C3D2E','#443527','#362614','#2C1D0E'];
/* Stratum band class per row — drives per-layer soil texture in CSS */
const DG_STRATA_CLS = ['st-top','st-top','st-clay','st-clay','st-ash','st-ash','st-rock','st-rock'];

/* ── State ── */
let _dig = null;
let _digDustAF = null;
let _digDustPts = [];

/* Reduced-motion preference (big ambient effects are gated on this) */
var _digRMQ = (typeof window !== 'undefined' && window.matchMedia)
  ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
function _digRM() { return !!(_digRMQ && _digRMQ.matches); }

/* Low-power heuristic (mid/low-end phones): thin out the particle field so
   the trowel-dust canvas stays smooth. Presentation only — dig/scan logic and
   the artifact grid are untouched. Cached once (pointer class won't change). */
var _digLiteV = null;
function _digLite() {
  if (_digLiteV === null) {
    try {
      _digLiteV = (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) ||
                  window.innerWidth < 720 || (navigator.deviceMemory || 8) <= 4;
    } catch (_) { _digLiteV = false; }
  }
  return _digLiteV;
}

/* ══════════════════════════════════════════
   PUBLIC API
══════════════════════════════════════════ */
function openDig() {
  document.getElementById('dig-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('dg-menu-scr')) _digBuild();
  _digShowScr('dg-menu-scr');
  _digStartDust(); // lantern-lit motes drift over the menu too
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
  // Coordinate rails around the pit: columns = Greek letters, rows = numbers
  const colBtns = DG_COLS.map((L, i) =>
    `<button class="dg-scan-btn" onclick="_digScanAsk('col',${i})" onmouseenter="_digScanHover('col',${i},1)" onmouseleave="_digScanHover('col',${i},0)" title="Σάρωση στήλης ${L} / Scan column ${L}">${L}</button>`
  ).join('');
  const rowBtns = Array.from({length:8},(_,i) =>
    `<button class="dg-scan-btn" onclick="_digScanAsk('row',${i})" onmouseenter="_digScanHover('row',${i},1)" onmouseleave="_digScanHover('row',${i},0)" title="Σάρωση γραμμής ${i+1} / Scan row ${i+1}">${i+1}</button>`
  ).join('');

  const relicStrip = DG_ARTIFACTS.map(a =>
    `<div class="dg-relic"><span class="dg-relic-ico">${a.icon}</span><span class="dg-relic-nm">${a.name}</span><span class="dg-relic-era">${a.era}</span></div>`
  ).join('');

  const foundSlots = DG_ARTIFACTS.map(a =>
    `<span class="dg-found-slot" data-art="${a.id}" title="${a.name}">${a.icon}</span>`
  ).join('');

  const gallery = DG_ARTIFACTS.map((a, i) =>
    `<div class="dg-gal-item" style="--gi:${i}"><span class="dg-gal-ico">${a.icon}</span><span class="dg-gal-nm">${a.name}</span></div>`
  ).join('');

  document.getElementById('dig-wrap').innerHTML = `
<div class="dg-strata" aria-hidden="true"></div>
<canvas id="dg-dust-cnv" class="dg-canvas-ovl" aria-hidden="true"></canvas>

<!-- MENU -->
<div id="dg-menu-scr" class="dg-screen active">
  <svg class="dg-scene" viewBox="0 0 900 230" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
    <defs>
      <radialGradient id="dg-glow-g" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stop-color="#FFC873" stop-opacity=".5"/>
        <stop offset="45%" stop-color="#E79A3C" stop-opacity=".2"/>
        <stop offset="100%" stop-color="#E79A3C" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <g class="dg-sc-far">
      <path d="M0 72 Q150 52 300 68 T600 62 T900 74 L900 230 L0 230 Z" fill="#26170A" opacity=".85"/>
    </g>
    <g class="dg-sc-mid">
      <path d="M0 118 Q180 98 360 110 T720 106 T900 114 L900 230 L0 230 Z" fill="#1E1207" opacity=".95"/>
      <g stroke="#3A2712" stroke-width="1" opacity=".5" fill="none">
        <path d="M0 90 Q200 74 420 84 T900 88"/>
        <path d="M0 138 Q240 122 480 132 T900 134"/>
      </g>
      <g fill="#0C0702" opacity=".9">
        <path d="M652 128 c-20 0 -32 16 -29 40 c3 22 15 36 29 36 c14 0 26 -14 29 -36 c3 -24 -9 -40 -29 -40 z"/>
        <rect x="642" y="118" width="20" height="12"/>
        <path d="M640 124 q-12 6 -6 18 l6 2 q-6 -10 4 -16 z"/>
        <path d="M664 124 q12 6 6 18 l-6 2 q6 -10 -4 -16 z"/>
        <ellipse cx="230" cy="176" rx="34" ry="8"/>
        <ellipse cx="230" cy="168" rx="30" ry="7"/>
        <path d="M430 190 a18 18 0 0 1 36 0 z"/>
      </g>
      <g opacity=".85">
        <path d="M96 156 q48 -15 96 0 l-7 36 q-41 11 -82 0 z" fill="#0E0803"/>
        <g stroke="#2B1B0C" stroke-width="2" opacity=".8" fill="none">
          <path d="M112 152 l-4 36"/><path d="M130 149 l-2 40"/><path d="M146 148 l0 42"/><path d="M162 149 l2 40"/><path d="M180 152 l4 36"/>
        </g>
      </g>
    </g>
    <g class="dg-sc-near">
      <path d="M0 162 Q220 146 440 156 T900 158 L900 230 L0 230 Z" fill="#130B04"/>
      <g class="dg-sc-twine">
        <path d="M40 178 L860 168" stroke="#C89A46" stroke-width="1" opacity=".38" stroke-dasharray="1 7"/>
        <g fill="#C89A46" opacity=".5">
          <rect x="38" y="173" width="3" height="13" rx="1"/>
          <rect x="446" y="168" width="3" height="13" rx="1"/>
          <rect x="855" y="163" width="3" height="13" rx="1"/>
        </g>
      </g>
      <g class="dg-sc-lantern">
        <circle class="dg-sc-glow" cx="784" cy="118" r="92" fill="url(#dg-glow-g)"/>
        <rect x="781" y="130" width="5" height="70" fill="#0A0501"/>
        <path d="M769 130 h29 l-4 -28 h-21 z" fill="#0A0501"/>
        <rect x="773" y="100" width="21" height="4" fill="#0A0501"/>
        <path d="M779 124 q4.5 -13 9 0 q-4.5 7 -9 0 z" fill="#FFD98A" class="dg-sc-flame"/>
      </g>
      <g opacity=".92" fill="none">
        <path d="M60 216 L128 184" stroke="#0A0501" stroke-width="6" stroke-linecap="round"/>
        <path d="M114 170 q28 -5 42 18" stroke="#0A0501" stroke-width="9" stroke-linecap="round"/>
        <path d="M86 192 L140 214" stroke="#0A0501" stroke-width="5" stroke-linecap="round"/>
        <path d="M140 214 l24 7 -9 -19 z" fill="#0A0501" stroke="none"/>
      </g>
    </g>
  </svg>
  <div class="dg-menu-wrap">
    <div class="dg-kicker dg-up" style="--d:0">ΑΡΧΑΙΟΛΟΓΙΚΗ ΑΠΟΣΤΟΛΗ · FIELD EXPEDITION</div>
    <div class="dg-logo dg-up" style="--d:1">${'Ανασκαφή'.split('').map((ch, i) => `<span class="dg-lg" style="--li:${i}">${ch}</span>`).join('')}<em>.</em></div>
    <div class="dg-logo-sub dg-up" style="--d:2">Archaeological Dig — Ιστορική Αποκάλυψη</div>
    <div class="dg-meander dg-up" style="--d:3" aria-hidden="true"></div>
    <div class="dg-rule dg-up" style="--d:4">
      <div class="dg-rule-hd">ΗΜΕΡΟΛΟΓΙΟ ΑΝΑΣΚΑΦΗΣ · FIELD JOURNAL</div>
      <strong>Κανόνες:</strong> Κάνε κλικ σε τετράγωνα για να σκάψεις. Αν βρεις τμήμα αρχαίου ευρήματος, πρέπει να <strong>απαντήσεις σωστά</strong> για να το καθαρίσεις. Χρησιμοποίησε τα κουμπιά <strong>Σάρωση Γραμμής/Στήλης</strong> για να εντοπίσεις τα κρυμμένα αντικείμενα — αλλά κάθε σάρωση απαιτεί απάντηση ερώτησης! Στόχος: Εντόπισε και καθάρισε <strong>και τα 4 αρχαιολογικά ευρήματα.</strong>
    </div>
    <div class="dg-relics dg-up" style="--d:5">${relicStrip}</div>
    <button class="dg-btn dg-up" style="--d:6" onclick="_digStartGame()"><span>ΕΝΑΡΞΗ ΑΝΑΣΚΑΦΗΣ</span></button>
  </div>
</div>

<!-- MAIN GAME -->
<div id="dg-game-scr" class="dg-screen">
  <!-- Excavation-site environment: stratigraphic section walls, a standing
       work lantern and field-tool silhouettes framing the pit (decor only) -->
  <div class="dg-env" aria-hidden="true">
    <div class="dg-env-wall dg-env-wall-l">
      <span class="dg-env-tag" style="--ty:10%">I</span>
      <span class="dg-env-tag" style="--ty:33%">II</span>
      <span class="dg-env-tag" style="--ty:56%">III</span>
      <span class="dg-env-tag" style="--ty:80%">IV</span>
    </div>
    <div class="dg-env-wall dg-env-wall-r"></div>
    <div class="dg-env-lantern">
      <div class="dg-env-glow"></div>
      <svg viewBox="0 0 60 260" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="30" cy="253" rx="17" ry="4" fill="rgba(0,0,0,.55)"/>
        <rect x="28" y="64" width="4" height="186" fill="#0A0501"/>
        <path d="M17 64 h26 l-4 -32 h-18 z" fill="#0A0501"/>
        <rect x="21" y="28" width="18" height="4" fill="#0A0501"/>
        <path d="M27 24 q3 -7 6 0" fill="none" stroke="#0A0501" stroke-width="2.5"/>
        <rect x="24" y="38" width="1.5" height="22" fill="#1E1207"/>
        <rect x="34.5" y="38" width="1.5" height="22" fill="#1E1207"/>
        <path class="dg-sc-flame" d="M26.5 56 q3.5 -11 7 0 q-3.5 6 -7 0 z" fill="#FFD98A"/>
        <rect x="14" y="246" width="32" height="5" rx="1" fill="#0C0703"/>
      </svg>
    </div>
    <svg class="dg-env-props dg-env-props-l" viewBox="0 0 240 150" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 150 Q70 122 150 140 Q205 150 240 150 L0 150 Z" fill="#150C05"/>
      <rect x="10" y="86" width="4" height="46" fill="#0C0703"/>
      <rect x="226" y="94" width="4" height="42" fill="#0C0703"/>
      <path d="M12 92 L228 100" stroke="#C89A46" stroke-width="1" stroke-dasharray="1 7" opacity=".3" fill="none"/>
      <g transform="rotate(-18 96 120)">
        <path d="M70 118 l30 -10 l-2 24 l-22 2 z" fill="#0B0603"/>
        <rect x="99" y="106" width="30" height="6" rx="3" fill="#160D05"/>
      </g>
      <g transform="rotate(12 170 128)">
        <rect x="148" y="122" width="28" height="6" rx="3" fill="#160D05"/>
        <path d="M176 119 h16 v12 h-16 z" fill="#0B0603"/>
        <g stroke="#241305" stroke-width="2" stroke-linecap="round">
          <path d="M192 121 l9 2"/><path d="M192 125 l10 0"/><path d="M192 129 l9 -2"/>
        </g>
      </g>
      <ellipse cx="52" cy="142" rx="7" ry="3" fill="#120A04"/>
      <ellipse cx="130" cy="146" rx="5" ry="2.4" fill="#120A04"/>
    </svg>
    <svg class="dg-env-props dg-env-props-r" viewBox="0 0 260 160" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 160 Q80 132 170 148 Q225 158 260 160 Z" fill="#150C05"/>
      <g transform="rotate(14 150 110)">
        <path d="M150 74 c-14 0 -22 12 -20 30 c2 16 10 26 20 26 c10 0 18 -10 20 -26 c2 -18 -6 -30 -20 -30 z" fill="#0D0703"/>
        <rect x="143" y="66" width="14" height="9" fill="#0D0703"/>
        <path d="M133 98 q17 -8 34 -2" stroke="#2B1B0C" stroke-width="1.4" opacity=".7" fill="none"/>
      </g>
      <path d="M60 142 q14 -18 34 -12 l-6 16 q-14 6 -28 -4 z" fill="#100904" stroke="#2B1B0C" stroke-width="1"/>
      <path d="M212 134 q-16 -10 -28 2 l10 12 q12 2 18 -14 z" fill="#100904"/>
      <ellipse cx="96" cy="152" rx="6" ry="2.6" fill="#120A04"/>
      <ellipse cx="230" cy="154" rx="8" ry="3" fill="#120A04"/>
    </svg>
  </div>
  <div class="dg-game-inner">
    <div class="dg-hud">
      <div class="dg-hud-item">
        <span class="dg-hud-lbl">ΕΥΡΗΜΑΤΑ</span>
        <span class="dg-hud-found"><span class="dg-found-row" id="dg-found-icons">${foundSlots}</span><span class="dg-hud-val" id="dg-found-cnt">0/4</span></span>
      </div>
      <div class="dg-hud-item mid">
        <span class="dg-hud-lbl">ΑΝΕΣΚΑΜΜΕΝΑ</span>
        <span class="dg-hud-val" id="dg-dug-cnt">0/64</span>
      </div>
      <div class="dg-hud-item end">
        <span class="dg-hud-lbl">ΣΑΡΩΣΕΙΣ</span>
        <span class="dg-hud-val" id="dg-scan-cnt">0</span>
      </div>
    </div>
    <div class="dg-progress" aria-hidden="true"><div class="dg-progress-fill" id="dg-prog-fill"></div></div>
    <div class="dg-status-msg" id="dg-status">Κλικ σε τετράγωνο για να σκάψεις. Σάρωσε γραμμή/στήλη για ανίχνευση.</div>
    <div class="dg-grid-outer">
      <div class="dg-site">
        <div class="dg-site-corner" aria-hidden="true">⌖</div>
        <div class="dg-rail dg-rail-cols">${colBtns}</div>
        <div class="dg-rail dg-rail-rows">${rowBtns}</div>
        <div class="dg-pit"><div class="dg-grid" id="dg-grid"></div></div>
      </div>
    </div>
    <div class="dg-site-hint">📡 Τα κουμπιά του πλέγματος σαρώνουν γραμμή/στήλη — κάθε σάρωση απαιτεί σωστή απάντηση.</div>
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
      <div class="dg-art-stamp" aria-hidden="true">ΕΥΡΕΘΗ · RECOVERED</div>
      <div class="dg-art-spot" aria-hidden="true"></div>
      <div class="dg-art-shine" aria-hidden="true"></div>
      <div class="dg-art-stage">
        <div class="dg-art-rays" aria-hidden="true"></div>
        <div class="dg-art-icon" id="dg-art-icon"></div>
        <div class="dg-art-plinth" aria-hidden="true"></div>
      </div>
      <div class="dg-art-name"  id="dg-art-name"></div>
      <div class="dg-art-era"   id="dg-art-era"></div>
      <div class="dg-art-divider dg-meander" aria-hidden="true"></div>
      <div class="dg-art-fact"  id="dg-art-fact"></div>
      <button class="dg-btn" onclick="_digCloseArtModal()"><span>ΣΥΝΕΧΕΙΑ ΑΝΑΣΚΑΦΗΣ →</span></button>
    </div>
  </div>
</div>

<!-- RESULT -->
<div id="dg-result-scr" class="dg-screen">
  <div class="dg-result-wrap">
    <div class="dg-res-kicker dg-up" style="--d:0">Η ΑΝΑΣΚΑΦΗ ΟΛΟΚΛΗΡΩΘΗΚΕ · EXCAVATION COMPLETE</div>
    <div class="dg-res-title dg-up" style="--d:1">ΑΝΑΚΑΛΥΨΗ!</div>
    <div class="dg-res-sub dg-up" style="--d:2">Η ανασκαφή ολοκληρώθηκε.</div>
    <div class="dg-res-gallery dg-up" style="--d:3">${gallery}</div>
    <div class="dg-res-stats dg-up" style="--d:4">
      <div class="dg-res-stat"><span class="dg-res-num" id="dg-res-dug">0</span><span class="dg-res-stat-lbl">ΤΕΤΡΑΓΩΝΑ</span></div>
      <div class="dg-res-stat-div"></div>
      <div class="dg-res-stat"><span class="dg-res-num" id="dg-res-scans">0</span><span class="dg-res-stat-lbl">ΣΑΡΩΣΕΙΣ</span></div>
    </div>
    <div class="dg-res-detail dg-up" id="dg-res-detail" style="--d:5"></div>
    <div class="dg-res-btns dg-up" style="--d:6">
      <button class="dg-btn"     onclick="_digStartGame()"><span>ΝΕΑ ΑΝΑΣΚΑΦΗ</span></button>
      <button class="dg-btn sec" onclick="_digShowScr('dg-menu-scr')"><span>ΜΕΝΟΥ</span></button>
    </div>
  </div>
</div>

<div class="dg-lantern" aria-hidden="true"></div>
<div class="dg-vignette" aria-hidden="true"></div>`;

  _digInitDustCanvas();
  _digInitParallax();
}

/* Pointer-driven ambience (presentation only):
   · --px/--py on #dig-wrap drive a gentle parallax of the menu scene layers
     and the lantern glow (skipped entirely under reduced motion).
   · --lx/--ly on .dg-pit position a warm hand-held-lantern light that follows
     the cursor over the trench (pure light, no motion — always on). */
function _digInitParallax() {
  const wrap = document.getElementById('dig-wrap');
  if (!wrap || wrap._digParallax) return;
  wrap._digParallax = true;

  wrap.addEventListener('pointermove', (e) => {
    if (_digRM()) return;
    const r = wrap.getBoundingClientRect();
    if (!r.width || !r.height) return;
    const px = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
    wrap.style.setProperty('--px', px.toFixed(3));
    wrap.style.setProperty('--py', py.toFixed(3));
  });

  const pit = wrap.querySelector('.dg-pit');
  if (pit) {
    pit.addEventListener('pointermove', (e) => {
      const r = pit.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pit.style.setProperty('--lx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      pit.style.setProperty('--ly', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    });
  }
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

  // Artifacts already fully cleaned show their glyph on the tiles
  const doneIds = new Set(
    _dig.artifacts
      .filter(a => a.cellIndices.every(i => _dig.tiles[i].state === 'artifact-clean'))
      .map(a => a.id)
  );

  let html = '';
  for (let i = 0; i < 64; i++) {
    const tile = _dig.tiles[i];
    const r = Math.floor(i / 8);
    let cls = 'dg-cell ' + DG_STRATA_CLS[r];
    // Deterministic per-cell jitter for organic soil texture (+ patchwork shade)
    let style = `--soil:${DG_SOIL[r]};--jx:${(i * 37) % 14};--jy:${(i * 53) % 14};--rt:${((i * 29) % 9) - 4}deg;--sh:${(((i * 13) % 9) * 0.014).toFixed(3)};`;
    let inner = '';

    if (tile.state === 'covered') {
      cls += ' covered';
    } else if (tile.state === 'empty') {
      cls += ' empty';
    } else if (tile.state === 'artifact-dirty') {
      const art = _dig.artifacts.find(a => a.id === tile.artId);
      cls += ' artifact-dirty';
      if (art) style += `--art-col:${art.color};--art-lt:${art.colorLight};`;
    } else if (tile.state === 'artifact-clean') {
      const art = _dig.artifacts.find(a => a.id === tile.artId);
      cls += ' artifact-clean';
      if (art) {
        style += `--art-col:${art.color};--art-lt:${art.colorLight};`;
        if (doneIds.has(art.id)) inner = `<span class="dg-cell-icon">${art.icon}</span>`;
      }
    }

    html += `<div class="${cls}" style="${style}" data-idx="${i}" onclick="_digClickTile(${i})">${inner}</div>`;
  }
  grid.innerHTML = html;
}

/* Add a one-shot animation class to a freshly changed cell (post-render) */
function _digFlashCell(idx, cls) {
  const grid = document.getElementById('dg-grid');
  const cell = grid && grid.children[idx];
  if (cell) cell.classList.add(cls);
}

function _digUpdateHUD() {
  _digSetVal(document.getElementById('dg-found-cnt'), `${_dig.foundCount}/4`);
  _digSetVal(document.getElementById('dg-dug-cnt'),   `${_dig.dugCount}/64`);
  _digSetVal(document.getElementById('dg-scan-cnt'),  String(_dig.scanCount));

  // Excavation progress strata-bar under the HUD
  const pf = document.getElementById('dg-prog-fill');
  if (pf) pf.style.width = ((_dig.dugCount / 64) * 100).toFixed(1) + '%';

  // Ignite the relic glyphs for fully recovered artifacts
  const row = document.getElementById('dg-found-icons');
  if (row && _dig) {
    DG_ARTIFACTS.forEach(def => {
      const slot = row.querySelector(`[data-art="${def.id}"]`);
      if (!slot) return;
      const live = _dig.artifacts.find(a => a.id === def.id);
      const done = !!(live && live.cellIndices.every(i => _dig.tiles[i].state === 'artifact-clean'));
      slot.classList.toggle('lit', done);
    });
  }
}

/* Set text + play a small "bump" pop when the value actually changed */
function _digSetVal(el, txt) {
  if (!el) return;
  if (el.textContent !== txt) {
    el.textContent = txt;
    el.classList.remove('bump');
    void el.offsetWidth; // restart animation
    el.classList.add('bump');
  }
}

function _digStatus(msg) {
  const el = document.getElementById('dg-status');
  if (!el) return;
  el.textContent = msg;
  el.classList.remove('flash');
  void el.offsetWidth;
  if (msg) el.classList.add('flash');
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

  // Presentation: the pick lands — the whole trench takes the blow
  // (a deeper jolt when the strike rings on something buried)
  const pitEl = document.querySelector('#dig-wrap .dg-pit');
  if (pitEl && !_digRM()) {
    pitEl.classList.remove('dg-thud', 'dg-thud-deep');
    void pitEl.offsetWidth; // restart the one-shot animation
    pitEl.classList.add(tile.artId ? 'dg-thud-deep' : 'dg-thud');
  }

  _digRenderGrid();
  _digFlashCell(idx, tile.artId ? 'just-found' : 'just-revealed');
  if (tile.artId) {
    _digBurstSparksAtCell(idx, 8);
    _digFlashAtCell(idx, '#FFD98A'); // warm light blooms off the buried metal
  }
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
    : (lang === 'en' ? `Column ${DG_COLS[index]}` : `Στήλη ${DG_COLS[index]}`);
  _digShowQuiz('scan', null, label);
}

/* Hover preview: outline the row/column a rail button would scan */
function _digScanHover(axis, index, on) {
  const grid = document.getElementById('dg-grid');
  if (!grid) return;
  for (let i = 0; i < 64; i++) {
    const r = Math.floor(i / 8), c = i % 8;
    if ((axis === 'row' && r === index) || (axis === 'col' && c === index)) {
      const cell = grid.children[i];
      if (cell) cell.classList.toggle('scan-peek', !!on);
    }
  }
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

  // Radar sweep: a light beam races along the row/col ahead of a staggered
  // per-cell ping, then a hold glow — amber when something is buried there,
  // olive when clear.
  const pit = document.querySelector('#dig-wrap .dg-pit');
  if (pit && !_digRM()) {
    const beam = document.createElement('div');
    beam.className = 'dg-beam ' + (axis === 'row' ? 'dg-beam-row' : 'dg-beam-col') + (hasArtifact ? ' hit' : '');
    if (axis === 'row') {
      beam.style.top    = `calc(6px + (100% - 12px) * ${index / 8})`;
      beam.style.height = 'calc((100% - 12px) / 8)';
    } else {
      beam.style.left  = `calc(6px + (100% - 12px) * ${index / 8})`;
      beam.style.width = 'calc((100% - 12px) / 8)';
    }
    pit.appendChild(beam);
    setTimeout(() => beam.remove(), 1900); // beam + lingering afterglow band
  }

  // Instrument feedback: sonar rings pulse off the pressed rail key
  if (!_digRM()) {
    const rail = document.querySelectorAll(axis === 'row'
      ? '#dig-wrap .dg-rail-rows .dg-scan-btn'
      : '#dig-wrap .dg-rail-cols .dg-scan-btn');
    const bc = rail && rail[index] ? _digElCenter(rail[index]) : null;
    if (bc) {
      _digPushPt({ type: 'ring', x: bc.x, y: bc.y, vx: 0, vy: 0, age: 0, tot: 30, size: 4, color: '#E9CB80' });
      setTimeout(() => _digPushPt({ type: 'ring', x: bc.x, y: bc.y, vx: 0, vy: 0, age: 0, tot: 34, size: 4, color: '#C89A46' }), 150);
    }
  }

  const grid = document.getElementById('dg-grid');
  if (grid) {
    const stag = _digRM() ? 0 : 45;
    indices.forEach((i, k) => {
      const cell = grid.children[i];
      if (!cell) return;
      const axisCls = axis === 'row' ? 'scan-row' : 'scan-col';
      const hitCls  = hasArtifact ? 'scan-hit' : 'scan-clear';
      setTimeout(() => { cell.classList.add(axisCls, hitCls, 'scan-ping'); _digScanPuff(i, hasArtifact); }, k * stag);
      setTimeout(() => cell.classList.remove('scan-row', 'scan-col', 'scan-hit', 'scan-clear', 'scan-ping'), 2500);
    });
  }

  const axisLabel = axis === 'row'
    ? (lang === 'en' ? `Row ${index + 1}` : `Γραμμή ${index + 1}`)
    : (lang === 'en' ? `Column ${DG_COLS[index]}` : `Στήλη ${DG_COLS[index]}`);

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

/* A tiny breath of dust as the radar ping passes each square — colour is
   lane-level only (the same hit/clear tint every cell in the lane shows) */
function _digScanPuff(tileIdx, hit) {
  if (_digRM()) return;
  const c = _digCellCenter(tileIdx);
  if (!c) return;
  for (let i = 0; i < 2; i++) {
    _digPushPt({
      type: 'dust',
      x: c.x + (Math.random() - 0.5) * 12,
      y: c.y + (Math.random() - 0.5) * 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 0.5 + 0.25),
      age: 0, tot: 30 + Math.random() * 16,
      size: Math.random() * 2 + 0.9,
      color: hit ? '#C98B3A' : '#8A8462',
    });
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

  const keys = ['α΄','β΄','γ΄','δ΄'];
  document.getElementById('dg-qtxt').textContent = _digQT(qObj.q);
  document.getElementById('dg-opts').innerHTML = qObj.a.map((opt, i) =>
    `<button class="dg-opt" style="--oi:${i}" onclick="_digAnswer(${i})"><span class="dg-opt-key">${keys[i] || ''}</span><span class="dg-opt-txt">${opt}</span></button>`
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

  // Juice: gold sparks on success, a dusty shake on failure
  const box = document.querySelector('#dg-quiz-wrap .dg-quiz-box');
  if (box) {
    if (correct) {
      _digBurstSparksAtEl(box, 14);
    } else {
      box.classList.remove('dg-shake');
      void box.offsetWidth;
      box.classList.add('dg-shake');
    }
  }

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
  resEl.className = 'dg-quiz-result ' + (correct ? 'ok' : 'bad');
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
  _digBurstSparksAtCell(idx, 10);
  _digFlashAtCell(idx, '#FFE6A6'); // conservator's wipe reveals the shine
  _digRenderGrid();
  _digFlashCell(idx, 'just-cleaned');

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

  // Celebration burst over the museum card
  const box = document.querySelector('#dg-art-modal .dg-art-box');
  if (box) setTimeout(() => _digBurstSparksAtEl(box, 26), 220);
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
  if(typeof awardGameRewards==='function' && _dig.foundCount > 0){ awardGameRewards('dig', { score: _dig.foundCount, perfect: false }); }
  setTimeout(() => {
    _digShowScr('dg-result-scr');
    _digCountUp('dg-res-dug',   _dig.dugCount);
    _digCountUp('dg-res-scans', _dig.scanCount);
    // Celebration: keep the lantern motes drifting and let off a few
    // staggered fountains of gold sparks over the trophy wall.
    const cnv = document.getElementById('dg-dust-cnv');
    if (cnv && !_digRM()) {
      for (let k = 0; k < 5; k++) {
        setTimeout(() => _digBurstSparks(
          cnv.width  * (0.18 + Math.random() * 0.64),
          cnv.height * (0.16 + Math.random() * 0.34),
          16
        ), 260 + k * 340);
      }
    }
  }, 400);
}

/* Animated numeral count-up for the result plaques */
function _digCountUp(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  target = Math.max(0, target | 0);
  if (_digRM() || target === 0) { el.textContent = String(target); return; }
  const dur = 950;
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = String(Math.round(target * e));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ══════════════════════════════════════════
   PARTICLES — dust motes · rock chips · gold sparks
══════════════════════════════════════════ */
function _digInitDustCanvas() {
  const wrap = document.getElementById('dig-wrap');
  const cnv  = document.getElementById('dg-dust-cnv');
  if (!wrap || !cnv) return;
  const resize = () => { cnv.width = wrap.offsetWidth; cnv.height = wrap.offsetHeight; };
  resize();
  window.addEventListener('resize', resize);
}

function _digPushPt(p) {
  if (_digDustPts.length > (_digLite() ? 120 : 260)) return; // hard cap (lighter on weak GPUs)
  _digDustPts.push(p);
}

function _digCellCenter(tileIdx) {
  const grid = document.getElementById('dg-grid');
  const wrap = document.getElementById('dig-wrap');
  if (!grid || !wrap) return null;
  const cellEl = grid.children[tileIdx];
  if (!cellEl) return null;
  const wr = wrap.getBoundingClientRect();
  const cr = cellEl.getBoundingClientRect();
  return { x: cr.left - wr.left + cr.width / 2, y: cr.top - wr.top + cr.height / 2 };
}

function _digElCenter(el) {
  const wrap = document.getElementById('dig-wrap');
  if (!el || !wrap) return null;
  const wr = wrap.getBoundingClientRect();
  const er = el.getBoundingClientRect();
  return { x: er.left - wr.left + er.width / 2, y: er.top - wr.top + er.height / 2 };
}

/* Dig burst: dust cloud + tumbling rock chips + smoke-plume puffs,
   an eased shock ring at the strike point, and grains raining back in */
function _digSpawnDust(tileIdx, color) {
  const c = _digCellCenter(tileIdx);
  if (!c) return;
  const rm = _digRM();
  const nDust = rm ? 4 : 18;
  const nChip = rm ? 0 : 6;
  if (!rm) {
    // soft expanding plume discs behind the sharper dust
    for (let i = 0; i < 3; i++) {
      _digPushPt({
        type: 'puff',
        x: c.x + (Math.random() - 0.5) * 10,
        y: c.y + (Math.random() - 0.5) * 8,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -(Math.random() * 0.5 + 0.18),
        age: 0, tot: 52 + Math.random() * 26,
        size: Math.random() * 7 + 6,
        color,
      });
    }
    // shockwave ring at the pick-strike point (ease-out expansion)
    _digPushPt({ type: 'ring', x: c.x, y: c.y, vx: 0, vy: 0, age: 0, tot: 30, size: 4, color, rad: 30 });
    // loosened grains kicked up, falling back into the trench
    for (let i = 0; i < 5; i++) {
      const ga = -Math.PI / 2 + (Math.random() - 0.5) * 2.2;
      const gs = Math.random() * 2.6 + 1.2;
      _digPushPt({
        type: 'grain', x: c.x, y: c.y,
        vx: Math.cos(ga) * gs, vy: Math.sin(ga) * gs,
        age: 0, tot: 34 + Math.random() * 18,
        size: Math.random() * 1.6 + 0.7,
        color: Math.random() < 0.5 ? '#1E1206' : '#3A2712',
      });
    }
    // fast soil streaks — the spray thrown by the pick blade
    for (let i = 0; i < 4; i++) {
      const sa = -Math.PI / 2 + (Math.random() - 0.5) * 2.4;
      const ss = Math.random() * 3.6 + 2.2;
      _digPushPt({
        type: 'streak', x: c.x, y: c.y,
        vx: Math.cos(sa) * ss, vy: Math.sin(sa) * ss,
        age: 0, tot: 24 + Math.random() * 14,
        size: Math.random() * 1.3 + 0.8,
        color: Math.random() < 0.5 ? '#7A5326' : '#4A3018',
      });
    }
    // heavy clods torn loose — they tumble up, thump back onto the spoil
    // and take one dull bounce before settling (weight, not confetti)
    for (let i = 0; i < 3; i++) {
      const ca = -Math.PI / 2 + (Math.random() - 0.5) * 1.1;
      const cs = Math.random() * 2.2 + 1.6;
      _digPushPt({
        type: 'clod', x: c.x, y: c.y,
        vx: Math.cos(ca) * cs, vy: Math.sin(ca) * cs - 0.6,
        age: 0, tot: 58 + Math.random() * 22,
        size: Math.random() * 4 + 3.4,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.3,
        floor: c.y + 14 + Math.random() * 26, bounced: false,
        color: Math.random() < 0.5 ? '#33200E' : '#4A2F16',
      });
    }
  }
  for (let i = 0; i < nDust; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.4 + 0.5;
    _digPushPt({
      type: 'dust', x: c.x, y: c.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1.4,
      age: 0, tot: 46 + Math.random() * 26,
      size: Math.random() * 3.4 + 1.2,
      color,
    });
  }
  for (let i = 0; i < nChip; i++) {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.6;
    const speed = Math.random() * 3.2 + 1.6;
    _digPushPt({
      type: 'chip', x: c.x, y: c.y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      age: 0, tot: 50 + Math.random() * 30,
      size: Math.random() * 3 + 2,
      rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.4,
      color: Math.random() < 0.5 ? '#2E1D0C' : '#5A3B1B',
    });
  }
}

function _digBurstSparks(x, y, n) {
  const count = _digRM() ? Math.min(4, n) : n;
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2.8 + 0.7;
    _digPushPt({
      type: 'spark', x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 0.8,
      age: 0, tot: 42 + Math.random() * 34,
      size: Math.random() * 2 + 0.9,
      tw: Math.random() * Math.PI * 2,
      color: Math.random() < 0.5 ? '#FFD98A' : '#E8C96A',
    });
  }
}

function _digBurstSparksAtCell(tileIdx, n) {
  const c = _digCellCenter(tileIdx);
  if (c) _digBurstSparks(c.x, c.y, n);
}

/* A single soft light bloom at a cell — the lantern catching fresh metal */
function _digFlashAtCell(tileIdx, color) {
  if (_digRM()) return;
  const c = _digCellCenter(tileIdx);
  if (!c) return;
  _digPushPt({ type: 'flash', x: c.x, y: c.y, vx: 0, vy: 0, age: 0, tot: 18, size: 30, color: color || '#FFD98A' });
}

function _digBurstSparksAtEl(el, n) {
  const c = _digElCenter(el);
  if (c) _digBurstSparks(c.x, c.y, n);
}

function _digStartDust() {
  if (_digDustAF) { cancelAnimationFrame(_digDustAF); _digDustAF = null; }
  const wrap = document.getElementById('dig-wrap');
  if (!wrap) return;
  // Ambient life (all skipped entirely under reduced motion): drifting
  // lantern motes, sand trickling off the trench lip, moths at the lantern
  const addAmbient = () => {
    if (_digRM()) return;
    const cnv = document.getElementById('dg-dust-cnv');
    if (!cnv) return;
    if (Math.random() <= (_digLite() ? 0.09 : 0.16)) {
      const warm = Math.random() < 0.4;
      _digPushPt({
        type: 'mote',
        x: Math.random() * cnv.width,
        y: cnv.height + 6,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.45 + 0.12),
        age: 0, tot: 260 + Math.random() * 200,
        size: Math.random() * 1.8 + 0.5,
        sw: Math.random() * Math.PI * 2,
        color: warm ? '#D9A85C' : '#8A6435',
      });
    }
    _digAmbientTrickle();
    if (!_digLite()) _digAmbientMoths();   // skip the lantern moths on weak GPUs
  };
  _digDustLoop(addAmbient);
}

/* Every couple of seconds a pinch of sand sifts off the trench lip and
   rains a short way down into the pit (game screen only, decor) */
function _digAmbientTrickle() {
  if (Math.random() > 0.014) return;
  const scr = document.getElementById('dg-game-scr');
  if (!scr || !scr.classList.contains('active')) return;
  const wrap = document.getElementById('dig-wrap');
  const pit  = wrap && wrap.querySelector('.dg-pit');
  if (!pit) return;
  const wr = wrap.getBoundingClientRect();
  const pr = pit.getBoundingClientRect();
  if (!pr.width) return;
  const x = pr.left - wr.left + 8 + Math.random() * (pr.width - 16);
  const y = pr.top - wr.top + 3;
  const n = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    _digPushPt({
      type: 'grain',
      x: x + (Math.random() - 0.5) * 3,
      y: y + Math.random() * 4,
      vx: (Math.random() - 0.5) * 0.2,
      vy: Math.random() * 0.7 + 0.5,
      age: 0, tot: 26 + Math.random() * 20,
      size: Math.random() * 1.2 + 0.6,
      color: Math.random() < 0.5 ? '#4A3018' : '#2E1D0C',
    });
  }
}

/* Keep at most two moths flittering around the standing work lantern */
function _digAmbientMoths() {
  if (Math.random() > 0.02) return;
  const scr = document.getElementById('dg-game-scr');
  if (!scr || !scr.classList.contains('active')) return;
  let alive = 0;
  for (const p of _digDustPts) if (p.type === 'moth') alive++;
  if (alive >= 2) return;
  const wrap = document.getElementById('dig-wrap');
  const el   = wrap && wrap.querySelector('.dg-env-lantern');
  if (!el) return;
  const er = el.getBoundingClientRect();
  if (!er.width) return; // lantern hidden at narrow widths
  const wr = wrap.getBoundingClientRect();
  _digPushPt({
    type: 'moth',
    ax: er.left - wr.left + er.width / 2,
    ay: er.top - wr.top + er.height * 0.2,
    x: 0, y: 0, vx: 0, vy: 0,
    age: 0, tot: 420 + Math.random() * 240,
    size: Math.random() * 0.8 + 0.7,
    ph:  Math.random() * Math.PI * 2,
    ph2: Math.random() * Math.PI * 2,
    color: '#FFD98A',
  });
}

function _digDustLoop(addAmbient) {
  const cnv = document.getElementById('dg-dust-cnv');
  if (!cnv) return;
  const ctx = cnv.getContext('2d');
  ctx.clearRect(0, 0, cnv.width, cnv.height);

  if (addAmbient) addAmbient();

  _digDustPts = _digDustPts.filter(p => p.age < p.tot);
  for (const p of _digDustPts) {
    const prog  = p.age / p.tot;
    const env   = Math.sin(Math.PI * Math.min(1, prog)); // fade in + out

    if (p.type === 'spark') {
      p.tw = (p.tw || 0) + 0.45;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.max(0, env * (0.55 + 0.45 * Math.sin(p.tw)));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
      p.vy += 0.015;
    } else if (p.type === 'chip') {
      ctx.globalAlpha = Math.max(0, Math.min(1, (1 - prog) * 1.4));
      ctx.fillStyle = p.color;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
      p.rot += p.vr;
      p.vy  += 0.16; // gravity: chips fall
    } else if (p.type === 'clod') {
      // heavy earth chunk: dark body, lantern-lit top edge, one dull bounce
      ctx.globalAlpha = Math.max(0, Math.min(1, (1 - prog) * 1.5));
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.82);
      ctx.fillStyle = 'rgba(255,214,150,.30)';
      ctx.fillRect(-p.size / 2, -p.size / 2, p.size, 1.1);
      ctx.restore();
      p.rot += p.vr;
      p.vy  += 0.17;
      if (!p.bounced && p.vy > 0 && p.y >= p.floor) {
        p.bounced = true; p.vy *= -0.42; p.vx *= 0.6; p.vr *= 0.5;
      }
    } else if (p.type === 'moth') {
      // a moth wobbling around the work lantern's flame (anchored orbit)
      p.ph  += 0.055 + Math.sin(p.age * 0.013) * 0.01;
      p.ph2 += 0.031;
      const mr = 10 + Math.sin(p.ph2) * 7;
      p.x = p.ax + Math.cos(p.ph) * mr * 1.5;
      p.y = p.ay + Math.sin(p.ph * 1.7 + p.ph2) * mr * 0.8;
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = env * (0.35 + 0.5 * Math.abs(Math.sin(p.age * 0.32)));
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    } else if (p.type === 'mote') {
      p.sw = (p.sw || 0) + 0.02;
      ctx.globalAlpha = env * 0.34;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x + Math.sin(p.sw) * 6, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    } else if (p.type === 'puff') {
      // smoke plume: a soft disc swelling as it thins out
      ctx.globalAlpha = Math.max(0, (1 - prog) * 0.16);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 + prog * 2.6), 0, Math.PI * 2);
      ctx.fill();
      p.vy -= 0.008;
    } else if (p.type === 'ring') {
      // shockwave: ease-out radius, thinning stroke
      const rr = 3 + (p.rad || 22) * (1 - Math.pow(1 - prog, 2));
      ctx.globalAlpha = Math.max(0, (1 - prog) * 0.55);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(0.6, 2.4 * (1 - prog));
      ctx.beginPath();
      ctx.arc(p.x, p.y, rr, 0, Math.PI * 2);
      ctx.stroke();
    } else if (p.type === 'grain') {
      ctx.globalAlpha = Math.max(0, 1 - prog);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.vy += 0.22; // heavy grains drop fast
    } else if (p.type === 'streak') {
      // soil spray: short motion-blurred slivers trailing their velocity
      ctx.globalAlpha = Math.max(0, (1 - prog) * 0.85);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2);
      ctx.stroke();
      p.vy += 0.2;
    } else if (p.type === 'flash') {
      // light bloom: an eased-out soft disc, additive, gone in a blink
      const fe = 1 - Math.pow(1 - prog, 3);
      const fr = p.size * (0.4 + fe * 1.6);
      const fg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, fr);
      fg.addColorStop(0, p.color);
      fg.addColorStop(1, 'transparent');
      ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = Math.max(0, (1 - prog) * 0.5);
      ctx.fillStyle = fg;
      ctx.beginPath();
      ctx.arc(p.x, p.y, fr, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    } else { // dust
      ctx.globalAlpha = Math.max(0, env * 0.65);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * (1 + prog * 0.9), 0, Math.PI * 2);
      ctx.fill();
      p.vy -= 0.02; // dust drifts upward
    }

    p.x += p.vx;
    p.y += p.vy;
    p.age++;
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
