// ══════════════════════════════════════
// ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ — OVERLAY OPEN/CLOSE
// ══════════════════════════════════════
function openParatheta(levelId, mode) {
  document.getElementById('par-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('par-screen-levels')) parBuild();
  // Auto-navigate to a specific level+mode when QR-scanned
  if (levelId) {
    const lvl = PAR_LVL.find(l => l.id === +levelId);
    if (lvl) {
      parSelLvl(lvl);
      if (mode) setTimeout(() => parSelMode(mode), 60);
    }
  }
}
function closeParatheta() {
  parGoLevels();
  document.getElementById('par-overlay').classList.remove('active');
  document.body.style.overflow = '';
}
function parGoLevels() {
  clearInterval(parState.timerInterval);
  if (parState.pendingTimeout) clearTimeout(parState.pendingTimeout);
  parState.timerInterval = null;
  parState.pendingTimeout = null;
  document.querySelectorAll('#par-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('par-screen-levels')?.classList.add('active');
}

// ── inject HTML ──
function parBuild() {
  document.getElementById('par-wrap').innerHTML = `
<div id="par-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels">
    <h1>Παραθετικά Επιθέτων</h1>
    <p class="lsubtitle">Αρχαία Ελληνική Γραμματική — Σχηματισμός Παραθετικών</p>
    <button class="game-share-btn" onclick="showQR('Παραθετικά Επιθέτων',{nav:'game',id:'paratheta'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="par-level-grid"></div>
  </div>
</div>
<div id="par-screen-settings" class="lyo-screen">
  <div class="lcard">
    <button class="lback-link" id="par-sett-back">← Επιστροφή</button>
    <h2 id="par-sett-title">Ρυθμίσεις</h2>
    <h3>Τρόπος Παιχνιδιού</h3>
    <div class="lmode-sel" style="grid-template-columns:repeat(4,1fr);">
      <div class="lmode-btn" id="par-mode-mc" onclick="parSelMode('mc')">
        <span class="lm-icon">🔲</span>
        <span>Πολλαπλή Επιλογή</span>
        <span class="lm-hint">Επίλεξε από 4 επιθετικούς τύπους</span>
      </div>
      <div class="lmode-btn" id="par-mode-fi" onclick="parSelMode('fi')">
        <span class="lm-icon">✏️</span>
        <span>Συμπλήρωση Κενού</span>
        <span class="lm-hint">Γράψε τη μορφή μόνος σου</span>
      </div>
      <div class="lmode-btn" id="par-mode-fw" onclick="parSelMode('fw')">
        <span class="lm-icon">📝</span>
        <span>Ολόκληρος Τύπος</span>
        <span class="lm-hint">Γράψε ολόκληρη τη λέξη</span>
      </div>
      <div class="lmode-btn" id="par-mode-match" onclick="parSelMode('match')">
        <span class="lm-icon">🔗</span>
        <span>Αντιστοίχιση</span>
        <span class="lm-hint">Αντίστοιχισε τύπο με μορφή</span>
      </div>
    </div>
    <div class="lsett-row">
      <div class="lfield"><label>Χρόνος</label>
        <select id="par-sel-time">
          <option value="60">60 δευτερόλεπτα</option>
          <option value="90" selected>90 δευτερόλεπτα</option>
          <option value="120">120 δευτερόλεπτα</option>
          <option value="180">180 δευτερόλεπτα</option>
          <option value="300">300 δευτερόλεπτα</option>
          <option value="0">Απεριόριστο</option>
        </select>
      </div>
      <div class="lfield"><label>Ζωές</label>
        <select id="par-sel-lives">
          <option value="1">1 ζωή</option>
          <option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option>
          <option value="0">Απεριόριστο</option>
        </select>
      </div>
    </div>
    <button class="lsett-qr-btn" id="par-sett-qr" style="opacity:0.38;pointer-events:none;">📱 <span>Μοιράσου αυτή τη ρύθμιση</span></button>
    <button class="lbtn lbtn-primary" id="par-launch-btn" onclick="parLaunch()" style="opacity:.5;pointer-events:none;">Έναρξη Κουίζ →</button>
  </div>
</div>
<div id="par-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="par-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="par-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="par-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="parEnd()" style="padding:7px 13px;font-size:0.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="par-q"><div class="lq-main">Φόρτωση...</div></div>
    <div id="par-mc-area"><div class="lopts-grid" id="par-opts"></div></div>
    <div id="par-fi-area" class="lfi-wrap">
      <div class="lstem-display">
        <div class="lstem-part" id="par-stem"></div>
        <div class="lfi-inp-wrap">
          <input type="text" id="par-fi-input" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="κατάληξη">
        </div>
      </div>
      <button class="lfi-submit" id="par-fi-submit" onclick="parSubmitFI()">Υποβολή ↵</button>
      <div class="lpoly-kb">
        <button class="lpoly-toggle" id="par-poly-toggle" onclick="parToggleKB()">
          <span>Πολυτονικό Πληκτρολόγιο</span>
          <span class="lpoly-arrow">▼</span>
        </button>
        <div class="lpoly-body" id="par-poly-body">
          <div class="lpoly-diac-row" id="par-diac-row"></div>
          <div id="par-vowel-rows"></div>
        </div>
      </div>
    </div>
    <div class="lfeedback" id="par-fb"></div>
  </div>
</div>
<div id="par-screen-end" class="lyo-screen">
  <div class="lcard lend-screen">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="par-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;" id="par-ed"></div>
    <hr class="ldivider">
    <div id="par-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="parRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="parGoLevels()">Επίπεδα</button>
    </div>
  </div>
</div>
<div id="par-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="par-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="par-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('par')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="par-match-body"></div>
    <div class="lfeedback" id="par-match-fb"></div>
  </div>
</div>`;
  parBuildGrid();
  parBuildKeyboard();
}

function parShow(id) {
  document.querySelectorAll('#par-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ══════════════════════════════════════
// POLYTONIC KEYBOARD (reuses LYO_ data constants)
// ══════════════════════════════════════
let parActiveDiacritic = null;

function parBuildKeyboard() {
  const diacRow = document.getElementById('par-diac-row');
  const vowelRows = document.getElementById('par-vowel-rows');
  if (!diacRow || !vowelRows) return;
  diacRow.innerHTML = '';
  LYO_DIACRITICS.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'lpoly-dkey';
    btn.id = 'par-dkey-' + d.id;
    btn.innerHTML = `<span style="font-size:1.1rem;">${d.label}</span><span class="ldkey-label">${d.hint}</span>`;
    btn.onclick = () => parToggleDiacritic(d.id);
    diacRow.appendChild(btn);
  });
  const vowels = ['α','ε','η','ι','ο','υ','ω'];
  vowelRows.innerHTML = '';
  vowels.forEach(v => {
    const row = document.createElement('div');
    row.className = 'lpoly-vowel-row';
    const label = document.createElement('div');
    label.className = 'lpoly-vlabel';
    label.textContent = v;
    row.appendChild(label);
    const keys = document.createElement('div');
    keys.className = 'lpoly-vkeys';
    keys.id = 'par-vkeys-' + v;
    const plain = document.createElement('button');
    plain.className = 'lpoly-vkey';
    plain.textContent = v;
    plain.title = v;
    plain.onclick = () => parVowelClick(v);
    keys.appendChild(plain);
    row.appendChild(keys);
    vowelRows.appendChild(row);
  });
  parRenderVowelKeys();
}

function parToggleDiacritic(id) {
  parActiveDiacritic = parActiveDiacritic === id ? null : id;
  document.querySelectorAll('#par-diac-row .lpoly-dkey').forEach(b => b.classList.remove('ldkey-active'));
  if (parActiveDiacritic) { const btn = document.getElementById('par-dkey-' + parActiveDiacritic); if (btn) btn.classList.add('ldkey-active'); }
  parRenderVowelKeys();
}

function parRenderVowelKeys() {
  ['α','ε','η','ι','ο','υ','ω'].forEach(v => {
    const container = document.getElementById('par-vkeys-' + v);
    if (!container) return;
    while (container.children.length > 1) container.removeChild(container.lastChild);
    if (!parActiveDiacritic) return;
    const combo = LYO_COMBO[parActiveDiacritic];
    if (!combo) return;
    const combined = combo[v];
    if (!combined) return;
    const btn = document.createElement('button');
    btn.className = 'lpoly-vkey';
    btn.style.borderColor = '#c9a44a';
    btn.style.color = '#e8c87a';
    btn.textContent = combined;
    btn.title = combined;
    btn.onclick = () => parInsertChar(combined);
    container.appendChild(btn);
  });
}

function parVowelClick(v) {
  if (parActiveDiacritic) {
    const combo = LYO_COMBO[parActiveDiacritic];
    const combined = combo && combo[v];
    parInsertChar(combined || v);
    parActiveDiacritic = null;
    document.querySelectorAll('#par-diac-row .lpoly-dkey').forEach(b => b.classList.remove('ldkey-active'));
    parRenderVowelKeys();
  } else {
    parInsertChar(v);
  }
}

function parInsertChar(ch) {
  const inp = document.getElementById('par-fi-input');
  if (!inp) return;
  const s = inp.selectionStart, e = inp.selectionEnd;
  inp.value = inp.value.slice(0, s) + ch + inp.value.slice(e);
  inp.selectionStart = inp.selectionEnd = s + ch.length;
  inp.focus();
}

function parToggleKB() {
  document.getElementById('par-poly-toggle').classList.toggle('open');
  document.getElementById('par-poly-body').classList.toggle('open');
}

// ══════════════════════════════════════
// GRAMMAR DATA
// ══════════════════════════════════════
const PAR_G = {};

function padd(positive, degree, category, mc, fi, stem) {
  PAR_G[`${positive}|${degree}`] = { positive, degree, category, endings: mc, fi_endings: fi || mc, stem: stem || '' };
}

// ── ΟΜΑΛΑ ΣΕ -ΟΣ ──
padd('σοφός','συγκριτικός','os',['σοφώτερος'],['ώτερος'],'σοφ-');
padd('σοφός','υπερθετικός','os',['σοφώτατος'],['ώτατος'],'σοφ-');
padd('νέος','συγκριτικός','os',['νεώτερος'],['ώτερος'],'νε-');
padd('νέος','υπερθετικός','os',['νεώτατος'],['ώτατος'],'νε-');
padd('πτωχός','συγκριτικός','os',['πτωχότερος'],['ότερος'],'πτωχ-');
padd('πτωχός','υπερθετικός','os',['πτωχότατος'],['ότατος'],'πτωχ-');
padd('δεινός','συγκριτικός','os',['δεινότερος'],['ότερος'],'δειν-');
padd('δεινός','υπερθετικός','os',['δεινότατος'],['ότατος'],'δειν-');
padd('ξηρός','συγκριτικός','os',['ξηρότερος'],['ότερος'],'ξηρ-');
padd('ξηρός','υπερθετικός','os',['ξηρότατος'],['ότατος'],'ξηρ-');
padd('ἐχθρός','συγκριτικός','os',['ἐχθρότερος'],['ότερος'],'ἐχθρ-');
padd('ἐχθρός','υπερθετικός','os',['ἐχθρότατος'],['ότατος'],'ἐχθρ-');
padd('ἰσχυρός','συγκριτικός','os',['ἰσχυρότερος'],['ότερος'],'ἰσχυρ-');
padd('ἰσχυρός','υπερθετικός','os',['ἰσχυρότατος'],['ότατος'],'ἰσχυρ-');
padd('δίκαιος','συγκριτικός','os',['δικαιότερος'],['ότερος'],'δικαι-');
padd('δίκαιος','υπερθετικός','os',['δικαιότατος'],['ότατος'],'δικαι-');
padd('πικρός','συγκριτικός','os',['πικρότερος'],['ότερος'],'πικρ-');
padd('πικρός','υπερθετικός','os',['πικρότατος'],['ότατος'],'πικρ-');
padd('ἄξιος','συγκριτικός','os',['ἀξιώτερος'],['ώτερος'],'ἀξι-');
padd('ἄξιος','υπερθετικός','os',['ἀξιώτατος'],['ώτατος'],'ἀξι-');
padd('ἀνδρεῖος','συγκριτικός','os',['ἀνδρειότερος'],['ότερος'],'ἀνδρει-');
padd('ἀνδρεῖος','υπερθετικός','os',['ἀνδρειότατος'],['ότατος'],'ἀνδρει-');
padd('ἐλεύθερος','συγκριτικός','os',['ἐλευθερώτερος'],['ώτερος'],'ἐλευθερ-');
padd('ἐλεύθερος','υπερθετικός','os',['ἐλευθερώτατος'],['ώτατος'],'ἐλευθερ-');

// ── ΟΜΑΛΑ ΣΕ -ΗΣ ──
padd('ἀληθής','συγκριτικός','is',['ἀληθέστερος'],['έστερος'],'ἀληθ-');
padd('ἀληθής','υπερθετικός','is',['ἀληθέστατος'],['έστατος'],'ἀληθ-');
padd('εὐγενής','συγκριτικός','is',['εὐγενέστερος'],['έστερος'],'εὐγεν-');
padd('εὐγενής','υπερθετικός','is',['εὐγενέστατος'],['έστατος'],'εὐγεν-');
padd('ἀσθενής','συγκριτικός','is',['ἀσθενέστερος'],['έστερος'],'ἀσθεν-');
padd('ἀσθενής','υπερθετικός','is',['ἀσθενέστατος'],['έστατος'],'ἀσθεν-');
padd('ἀκριβής','συγκριτικός','is',['ἀκριβέστερος'],['έστερος'],'ἀκριβ-');
padd('ἀκριβής','υπερθετικός','is',['ἀκριβέστατος'],['έστατος'],'ἀκριβ-');
padd('εὐτυχής','συγκριτικός','is',['εὐτυχέστερος'],['έστερος'],'εὐτυχ-');
padd('εὐτυχής','υπερθετικός','is',['εὐτυχέστατος'],['έστατος'],'εὐτυχ-');
padd('ἀτυχής','συγκριτικός','is',['ἀτυχέστερος'],['έστερος'],'ἀτυχ-');
padd('ἀτυχής','υπερθετικός','is',['ἀτυχέστατος'],['έστατος'],'ἀτυχ-');
padd('ἐπιμελής','συγκριτικός','is',['ἐπιμελέστερος'],['έστερος'],'ἐπιμελ-');
padd('ἐπιμελής','υπερθετικός','is',['ἐπιμελέστατος'],['έστατος'],'ἐπιμελ-');
padd('εὐσεβής','συγκριτικός','is',['εὐσεβέστερος'],['έστερος'],'εὐσεβ-');
padd('εὐσεβής','υπερθετικός','is',['εὐσεβέστατος'],['έστατος'],'εὐσεβ-');
padd('ἀσεβής','συγκριτικός','is',['ἀσεβέστερος'],['έστερος'],'ἀσεβ-');
padd('ἀσεβής','υπερθετικός','is',['ἀσεβέστατος'],['έστατος'],'ἀσεβ-');
padd('συνήθης','συγκριτικός','is',['συνηθέστερος'],['έστερος'],'συνηθ-');
padd('συνήθης','υπερθετικός','is',['συνηθέστατος'],['έστατος'],'συνηθ-');

// ── ΑΝΩΜΑΛΑ ──
padd('ἀγαθός','συγκριτικός','irregular',['ἀμείνων','βελτίων','κρείττων'],['ἀμείνων','βελτίων','κρείττων'],'');
padd('ἀγαθός','υπερθετικός','irregular',['ἄριστος','βέλτιστος','κράτιστος'],['ἄριστος','βέλτιστος','κράτιστος'],'');
padd('κακός','συγκριτικός','irregular',['κακίων','χείρων'],['κακίων','χείρων'],'');
padd('κακός','υπερθετικός','irregular',['κάκιστος','χείριστος'],['κάκιστος','χείριστος'],'');
padd('καλός','συγκριτικός','irregular',['καλλίων'],['καλλίων'],'');
padd('καλός','υπερθετικός','irregular',['κάλλιστος'],['κάλλιστος'],'');
padd('μέγας','συγκριτικός','irregular',['μείζων'],['μείζων'],'');
padd('μέγας','υπερθετικός','irregular',['μέγιστος'],['μέγιστος'],'');
padd('μικρός','συγκριτικός','irregular',['ἐλάττων','ἥττων'],['ἐλάττων','ἥττων'],'');
padd('μικρός','υπερθετικός','irregular',['ἐλάχιστος'],['ἐλάχιστος'],'');
padd('πολύς','συγκριτικός','irregular',['πλείων','πλέων'],['πλείων','πλέων'],'');
padd('πολύς','υπερθετικός','irregular',['πλεῖστος'],['πλεῖστος'],'');
padd('ὀλίγος','συγκριτικός','irregular',['μείων'],['μείων'],'');
padd('ὀλίγος','υπερθετικός','irregular',['ὀλίγιστος'],['ὀλίγιστος'],'');
padd('ῥᾴδιος','συγκριτικός','irregular',['ῥᾷων'],['ῥᾷων'],'');
padd('ῥᾴδιος','υπερθετικός','irregular',['ῥᾷστος'],['ῥᾷστος'],'');

// ══════════════════════════════════════
// LEVELS
// ══════════════════════════════════════
const PAR_LVL = [
  {id:1, group:'Επίθετα σε -ος', color:'lgreen',  desc:'Συγκριτικός βαθμός',              filter:{categories:['os'],              degrees:['συγκριτικός']}},
  {id:2, group:'Επίθετα σε -ος', color:'lyellow', desc:'Υπερθετικός βαθμός',              filter:{categories:['os'],              degrees:['υπερθετικός']}},
  {id:3, group:'Επίθετα σε -ος', color:'lred',    desc:'Συγκριτικός & Υπερθετικός',       filter:{categories:['os'],              degrees:['συγκριτικός','υπερθετικός']}},
  {id:4, group:'Επίθετα σε -ης', color:'lgreen',  desc:'Συγκριτικός βαθμός',              filter:{categories:['is'],              degrees:['συγκριτικός']}},
  {id:5, group:'Επίθετα σε -ης', color:'lyellow', desc:'Υπερθετικός βαθμός',              filter:{categories:['is'],              degrees:['υπερθετικός']}},
  {id:6, group:'Επίθετα σε -ης', color:'lred',    desc:'Συγκριτικός & Υπερθετικός',       filter:{categories:['is'],              degrees:['συγκριτικός','υπερθετικός']}},
  {id:7, group:'Ανώμαλα Επίθετα',color:'lgreen',  desc:'Συγκριτικός βαθμός',              filter:{categories:['irregular'],       degrees:['συγκριτικός']}},
  {id:8, group:'Ανώμαλα Επίθετα',color:'lyellow', desc:'Υπερθετικός βαθμός',              filter:{categories:['irregular'],       degrees:['υπερθετικός']}},
  {id:9, group:'Ανώμαλα Επίθετα',color:'lred',    desc:'Συγκριτικός & Υπερθετικός',       filter:{categories:['irregular'],       degrees:['συγκριτικός','υπερθετικός']}},
  {id:10,group:'Συνδυαστικό',    color:'lred',    desc:'Ομαλά (-ος & -ης) + Ανώμαλα — Όλοι οι βαθμοί', filter:{categories:['os','is','irregular'],degrees:['συγκριτικός','υπερθετικός']}},
];

// ══════════════════════════════════════
// STATE
// ══════════════════════════════════════
let parState = {filter:null, lives:3, score:0, timer:90, timerRemaining:90, timerInterval:null, activeKeys:[], answering:false, pendingTimeout:null, lastPositive:null, lastDegree:null, lastCategory:null, mistakes:[]};
let parCurrentQ = null;
let parGameMode = null;
let parCurrentLevelId = null;

// ── helpers ──
function parShuf(a) { for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a; }

function parKeys(f) {
  return Object.keys(PAR_G).filter(k => {
    const g = PAR_G[k];
    return f.categories.includes(g.category) && f.degrees.includes(g.degree);
  });
}

function parGenQ(keys) {
  if (!keys.length) return null;
  const mDeg = [...new Set(keys.map(k=>PAR_G[k].degree))].length > 1;
  const mCat = [...new Set(keys.map(k=>PAR_G[k].category))].length > 1;
  let key;
  for (let a = 0; a < 12; a++) {
    const c = keys[Math.floor(Math.random()*keys.length)];
    const g = PAR_G[c];
    if (g.positive !== parState.lastPositive && (!mDeg || g.degree !== parState.lastDegree) && (!mCat || g.category !== parState.lastCategory)) { key = c; break; }
    if (a === 11) key = c;
  }
  const g = PAR_G[key];
  parState.lastPositive = g.positive;
  parState.lastDegree = g.degree;
  parState.lastCategory = g.category;

  const correct = g.endings[0];
  // Smart distractor pool — waterfall by grammatical proximity
  // sp=samePositive (same base adjective), sc=sameCategory (-ος/-ης/irregular), sd=sameDegree
  function poolFn(sp,sc,sd){const p=[];for(const k of Object.keys(PAR_G)){if(k===key)continue;const c=PAR_G[k];if(sp&&c.positive!==g.positive)continue;if(sc&&c.category!==g.category)continue;if(sd&&c.degree!==g.degree)continue;const e=c.endings[0];if(!g.endings.includes(e)&&!p.includes(e))p.push(e);}return p;}
  // 1. Same adjective, different degree (comparative ↔ superlative of the same word)
  let pool=poolFn(true,false,false);
  // 2. Same category + same degree, different adjective
  if(pool.length<3)pool=[...new Set([...pool,...poolFn(false,true,true)])];
  // 3. Same degree, any category
  if(pool.length<3)pool=[...new Set([...pool,...poolFn(false,false,true)])];
  // 4. Anything
  if(pool.length<3)pool=[...new Set([...pool,...poolFn(false,false,false)])];
  parShuf(pool);
  const wrong = pool.slice(0, 3);
  while (wrong.length < 3) wrong.push('—');
  const _base = g.stem.endsWith('-') ? g.stem.slice(0,-1) : g.stem;
  const fw_correct = g.stem.endsWith('-') ? _base+(g.fi_endings[0]||'') : g.endings[0];
  const fw_ends = g.fi_endings.map(e => g.stem.endsWith('-') ? _base+e : e);
  return { qt: parBuildQText(g), opts: parShuf([correct, ...wrong]), correct, endings: g.endings, fi_endings: g.fi_endings, fi_correct: g.fi_endings[0], stem: g.stem, positive: g.positive, fw_correct, fw_ends };
}

function parBuildQText(g) {
  const degLabel = g.degree === 'συγκριτικός' ? 'συγκριτικό' : 'υπερθετικό';
  const catLabel = g.category === 'os' ? 'ομαλό (-ος)' : g.category === 'is' ? 'ομαλό (-ης)' : 'ανώμαλο';
  const catCls   = g.category === 'irregular' ? 'mood' : 'tense';
  return `<div class="lq-main">Σχημάτισε τον <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;">${degLabel} βαθμό</span> του <em>${g.positive}</em>:</div>`
    + `<div class="lq-tags"><span class="lq-tag voice">${g.degree}</span><span class="lq-tag ${catCls}">${catLabel}</span></div>`;
}

// ── level grid ──
function parBuildGrid() {
  const c = document.getElementById('par-level-grid');
  if (!c) return;
  gramBuildLevelGrid('par', PAR_LVL, parSelLvl);
}

function parSelLvl(lvl) {
  parState.filter = lvl.filter;
  parCurrentLevelId = lvl.id;
  parGameMode = null;
  document.getElementById('par-sett-title').textContent = `Επίπεδο ${lvl.id}`;
  document.getElementById('par-sett-back').onclick = parGoLevels;
  // reset mode buttons
  ['mc','fi','fw','match'].forEach(x => document.getElementById('par-mode-'+x)?.classList.remove('selected'));
  // reset launch + QR buttons
  const lb = document.getElementById('par-launch-btn'); if(lb){lb.style.opacity='.5';lb.style.pointerEvents='none';}
  const qb = document.getElementById('par-sett-qr'); if(qb){qb.style.opacity='0.38';qb.style.pointerEvents='none';}
  parShow('par-screen-settings');
}

function parSelMode(m) {
  parGameMode = m;
  ['mc','fi','fw','match'].forEach(x => document.getElementById('par-mode-'+x)?.classList.toggle('selected', m === x));
  const btn = document.getElementById('par-launch-btn');
  if (btn) { btn.style.opacity = '1'; btn.style.pointerEvents = 'auto'; }
  // Enable config-specific QR share
  const qb = document.getElementById('par-sett-qr');
  if (qb && parCurrentLevelId) {
    qb.style.opacity = '1'; qb.style.pointerEvents = 'auto';
    const modeNames = {'mc':'Πολλαπλή Επιλογή','fi':'Συμπλήρωση Κενού','fw':'Ολόκληρος Τύπος','match':'Αντιστοίχιση'};
    qb.onclick = () => showQR(`Παραθετικά — Επίπεδο ${parCurrentLevelId} — ${modeNames[m]||m}`, {nav:'game', id:'paratheta', level:parCurrentLevelId, mode:m});
  }
}

// ── launch ──
function parLaunch() {
  if (!parGameMode) return;
  // Match mode: delegate entirely to shared match engine
  if (parGameMode === 'match') {
    clearInterval(parState.timerInterval);
    if (parState.pendingTimeout) clearTimeout(parState.pendingTimeout);
    _gramCurrentLvlId['par'] = parCurrentLevelId;
    _gramLevelRefresh['par'] = parBuildGrid;
    gramStartMatch('par', PAR_G, parKeys, g => g.stem,
      g => `<div class="lq-main">${g.positive} — ${g.degree}</div>`,
      parState.filter, 'par-wrap');
    return;
  }
  const t = parseInt(document.getElementById('par-sel-time').value);
  const l = parseInt(document.getElementById('par-sel-lives').value);
  parState.timer = t; parState.timerRemaining = t;
  parState.lives = l === 0 ? Infinity : l;
  parState.score = 0; parState.answering = false;
  parState.lastPositive = null; parState.lastDegree = null; parState.lastCategory = null;
  parState.mistakes = [];
  clearInterval(parState.timerInterval);
  if (parState.pendingTimeout) clearTimeout(parState.pendingTimeout);
  parState.activeKeys = parKeys(parState.filter);
  if (!parState.activeKeys.length) { alert('Δεν βρέθηκαν ερωτήσεις.'); return; }

  const mcArea = document.getElementById('par-mc-area');
  const fiArea = document.getElementById('par-fi-area');
  if (mcArea) mcArea.style.display = parGameMode === 'mc' ? '' : 'none';
  if (fiArea) { (parGameMode === 'fi' || parGameMode === 'fw') ? fiArea.classList.add('active') : fiArea.classList.remove('active'); }

  const inp = document.getElementById('par-fi-input');
  if (inp) inp.onkeydown = e => { if (e.key === 'Enter') parSubmitFI(); };

  parActiveDiacritic = null;
  parShow('par-screen-game');
  parHUD();
  if (t > 0) parTimer();
  parNextQ();
}

function parTimer() {
  parState.timerInterval = setInterval(() => {
    parState.timerRemaining--;
    const tv = document.getElementById('par-tv');
    if (tv) { tv.textContent = _gramFmtSec(parState.timerRemaining); tv.classList.toggle('ltimer-warn', parState.timerRemaining <= 10); tv.classList.toggle('ltimer-caut', parState.timerRemaining <= 20 && parState.timerRemaining > 10); }
    if (parState.timerRemaining <= 0) parEnd();
  }, 1000);
}

function parHUD() {
  const sv = document.getElementById('par-sv'); if (sv) sv.textContent = parState.score;
  const lv = document.getElementById('par-lv');
  if (lv) { if (parState.lives === Infinity) { lv.textContent = '∞'; lv.style.fontSize = '1.4rem'; } else { lv.innerHTML = Array(parState.lives).fill('❤️').join('') || '💀'; } }
  const tv = document.getElementById('par-tv');
  if (tv && parState.timer === 0) { tv.textContent = '∞'; tv.classList.remove('ltimer-warn','ltimer-caut'); }
}

function parNextQ() {
  parCurrentQ = parGenQ(parState.activeKeys);
  if (!parCurrentQ) { parEnd(); return; }
  parState.answering = false;

  const qel = document.getElementById('par-q'); if (qel) qel.innerHTML = parCurrentQ.qt;
  const fb  = document.getElementById('par-fb'); if (fb) { fb.textContent = ''; fb.className = 'lfeedback'; }

  if (parGameMode === 'mc') {
    const grid = document.getElementById('par-opts'); if (!grid) return;
    grid.innerHTML = '';
    parCurrentQ.opts.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'lopt-btn'; btn.textContent = opt;
      btn.onclick = () => parAnswer(opt);
      grid.appendChild(btn);
    });
  } else {
    // fw mode: override fi_endings with full-word versions
    if (parGameMode === 'fw') {
      parCurrentQ.fi_endings = parCurrentQ.fw_ends;
      parCurrentQ.fi_correct = parCurrentQ.fw_correct;
    }
    const stemEl = document.getElementById('par-stem');
    const inp    = document.getElementById('par-fi-input');
    const hideStem = parGameMode === 'fw' || parCurrentQ.stem === '';
    if (stemEl) { stemEl.style.display = hideStem ? 'none' : ''; if (!hideStem) stemEl.textContent = parCurrentQ.stem; }
    if (inp) {
      inp.style.borderRadius = hideStem ? '8px' : '';
      inp.style.minWidth = hideStem ? '220px' : '';
      inp.placeholder = hideStem ? 'Γράψε ολόκληρη τη λέξη' : 'κατάληξη';
      inp.value = ''; inp.disabled = false; inp.className = ''; inp.focus();
    }
    const sub = document.getElementById('par-fi-submit'); if (sub) sub.disabled = false;
    parActiveDiacritic = null;
    document.querySelectorAll('#par-diac-row .lpoly-dkey').forEach(b => b.classList.remove('ldkey-active'));
    parRenderVowelKeys();
  }
}

function parAnswer(chosen) {
  if (parState.answering) return; parState.answering = true;
  const acc = parCurrentQ.endings, ok = acc.includes(chosen);
  document.querySelectorAll('#par-opts .lopt-btn').forEach(b => { b.disabled = true; if (acc.includes(b.textContent)) b.classList.add('lcorrect'); else if (b.textContent === chosen && !ok) b.classList.add('lwrong'); });
  const fb = document.getElementById('par-fb');
  if (ok) { parState.score++; if (fb) { fb.textContent = '✓ Σωστό!'; fb.className = 'lfeedback lok'; } }
  else {
    const allCorrect = parCurrentQ.endings.join(' / ');
    if (fb) { fb.textContent = `✗ Λάθος — σωστό: ${allCorrect}`; fb.className = 'lfeedback lerr'; }
    parState.mistakes.push({ qt: parCurrentQ.qt, typed: chosen, correct: allCorrect, stem: parCurrentQ.stem });
    if(typeof logStudentMistake==='function') logStudentMistake('par','paratheta','mc',{q:parCurrentQ.qt,a:allCorrect},chosen);
    if (parState.lives !== Infinity) { parState.lives--; parHUD(); if (parState.lives <= 0) { parState.pendingTimeout = setTimeout(() => parEnd(), 1200); return; } }
  }
  parHUD(); parState.pendingTimeout = setTimeout(() => parNextQ(), 1500);
}

function parSubmitFI() {
  if (parState.answering) return;
  const inp = document.getElementById('par-fi-input'); if (!inp) return;
  const typed = inp.value.trim(); if (!typed) { inp.focus(); return; }
  parState.answering = true;
  const acc = parCurrentQ.fi_endings, ok = acc.includes(typed);
  inp.disabled = true;
  const sub = document.getElementById('par-fi-submit'); if (sub) sub.disabled = true;
  inp.classList.add(ok ? 'lcorrect' : 'lwrong');
  const fb = document.getElementById('par-fb');
  if (ok) { parState.score++; if (fb) { fb.textContent = '✓ Σωστό!'; fb.className = 'lfeedback lok'; } }
  else {
    const allCorrect = parCurrentQ.fi_endings.join(' / ');
    if (fb) { fb.innerHTML = `✗ Λάθος — σωστό: <strong>${allCorrect}</strong>`; fb.className = 'lfeedback lerr'; }
    parState.mistakes.push({ qt: parCurrentQ.qt, typed, correct: allCorrect, stem: (parGameMode === 'fw' ? '' : parCurrentQ.stem) });
    if(typeof logStudentMistake==='function') logStudentMistake('par','paratheta',parGameMode,{q:parCurrentQ.qt,a:allCorrect},typed);
    if (parState.lives !== Infinity) { parState.lives--; parHUD(); if (parState.lives <= 0) { parState.pendingTimeout = setTimeout(() => parEnd(), 1400); return; } }
  }
  parHUD(); parState.pendingTimeout = setTimeout(() => parNextQ(), 1600);
}

function parRetry() { parShow('par-screen-settings'); }

function parEnd() {
  clearInterval(parState.timerInterval);
  if (parState.pendingTimeout) clearTimeout(parState.pendingTimeout);
  // Save progress
  if (parCurrentLevelId) {
    try {
      const pkey = `par_prog_${parCurrentLevelId}`;
      const prev = JSON.parse(localStorage.getItem(pkey) || '{}');
      const completed = parState.mistakes.length === 0 && parState.score > 0;
      localStorage.setItem(pkey, JSON.stringify({best: Math.max(parState.score, prev.best||0), completed: prev.completed||completed, ts: Date.now()}));
      parBuildGrid();
    } catch(e) {}
  }
  const es = document.getElementById('par-es'); if (es) es.textContent = parState.score;
  const ed = document.getElementById('par-ed'); if (ed) ed.textContent = 'Τελική βαθμολογία';
  const log = document.getElementById('par-mistakes-log');
  if (log) {
    if (!parState.mistakes.length) {
      log.innerHTML = '<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>';
    } else {
      let h = `<div class="lmistakes-hdr">Λάθη: ${parState.mistakes.length}</div><div class="lmistakes-list">`;
      parState.mistakes.forEach(m => {
        const tmp = document.createElement('div'); tmp.innerHTML = m.qt;
        const main = tmp.querySelector('.lq-main');
        const qtxt = main ? main.textContent : m.qt.replace(/<[^>]+>/g,' ');
        const tags = [...tmp.querySelectorAll('.lq-tag')].map(el => el.textContent).join(' · ');
        const stemDisp = m.stem || '';
        h += `<div class="lmistake-row"><div class="lm-q">${qtxt}</div><div style="font-size:0.72rem;color:#8a7a60;margin:2px 0 5px;">${tags}</div><div class="lm-ans"><span class="lm-wrong">${stemDisp}${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${stemDisp}${m.correct}</span></div></div>`;
      });
      h += '</div>'; log.innerHTML = h;
    }
  }
  parShow('par-screen-end');
}
