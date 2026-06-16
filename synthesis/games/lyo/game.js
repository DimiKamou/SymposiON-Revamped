// ══════════════════════════════════════
// LYO OVERLAY OPEN / CLOSE
// ══════════════════════════════════════
function openLyo(levelId, mode) {
  document.getElementById('lyo-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('lyo-screen-levels')) lyoBuild();
  // Auto-navigate to a specific level+mode when QR-scanned
  if (levelId) {
    const lvl = LYO_LVL.find(l => l.id === +levelId);
    if (lvl) {
      lyoSelLvl(lvl);
      if (mode) setTimeout(() => lyoSelMode(mode), 60);
    }
  }
}
function closeLyo() {
  lyoGoLevels(); // stop timer + reset to levels screen
  document.getElementById('lyo-overlay').classList.remove('active');
  document.body.style.overflow = '';
}
// Central "go to levels" — stops any running game and returns to the level picker
function lyoGoLevels() {
  clearInterval(lyoState.timerInterval);
  if (lyoState.pendingTimeout) clearTimeout(lyoState.pendingTimeout);
  lyoState.timerInterval = null;
  lyoState.pendingTimeout = null;
  document.querySelectorAll('#lyo-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('lyo-screen-levels')?.classList.add('active');
}

// ── inject HTML ──
function lyoBuild() {
  document.getElementById('lyo-wrap').innerHTML = `
<div id="lyo-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels">
    <h1>Μαθαίνοντας το Λύω</h1>
    <p class="lsubtitle">Αρχαία Ελληνική Γραμματική — Κλίση Ρημάτων</p>
    <button class="game-share-btn" onclick="showQR('Μαθαίνοντας το Λύω',{nav:'game',id:'lyo'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="lyo-level-grid"></div>
  </div>
</div>
<div id="lyo-screen-custom" class="lyo-screen">
  <div class="lcard">
    <button class="lback-link" onclick="lyoShow('lyo-screen-levels')">← Επιστροφή</button>
    <h2>Προσαρμοσμένο Κουίζ</h2>
    <h3>Φωνή</h3><div class="lcheck-grid" id="lyo-chk-voices"></div>
    <h3>Τύποι</h3><div class="lcheck-grid" id="lyo-chk-forms"></div>
    <div id="lyo-moods-sec">
      <h3>Εγκλίσεις <span style="font-size:0.7rem;color:#8a7a60;text-transform:none;letter-spacing:0;font-family:'Noto Serif',serif;font-style:italic;">(για Ρηματικά Πρόσωπα)</span></h3>
      <div class="lcheck-grid" id="lyo-chk-moods"></div>
    </div>
    <h3>Χρόνοι</h3><div class="lcheck-grid" id="lyo-chk-tenses"></div>
    <p class="lerr-msg" id="lyo-cerr" style="visibility:hidden;"></p>
    <button class="lbtn lbtn-primary" onclick="lyoStartCustom()">Έναρξη Προσαρμοσμένου →</button>
  </div>
</div>
<div id="lyo-screen-settings" class="lyo-screen">
  <div class="lcard">
    <button class="lback-link" id="lyo-sett-back">← Επιστροφή</button>
    <h2 id="lyo-sett-title">Ρυθμίσεις</h2>
    <h3>Τρόπος Παιχνιδιού</h3>
    <div class="lmode-sel" style="grid-template-columns:repeat(3,1fr);">
      <div class="lmode-btn" id="lyo-mode-mc" onclick="lyoSelMode('mc')">
        <span class="lm-icon">🔲</span>
        <span>Πολλαπλή Επιλογή</span>
        <span class="lm-hint">Επίλεξε από 4 καταλήξεις</span>
      </div>
      <div class="lmode-btn" id="lyo-mode-fi" onclick="lyoSelMode('fi')">
        <span class="lm-icon">✏️</span>
        <span>Συμπλήρωση Κενού</span>
        <span class="lm-hint">Γράψε την κατάληξη μόνος σου</span>
      </div>
      <div class="lmode-btn" id="lyo-mode-fw" onclick="lyoSelMode('fw')">
        <span class="lm-icon">📝</span>
        <span>Ολόκληρος Τύπος</span>
        <span class="lm-hint">Γράψε ολόκληρη τη λέξη</span>
      </div>
      <div class="lmode-btn" id="lyo-mode-match" onclick="lyoSelMode('match')">
        <span class="lm-icon">🔗</span>
        <span>Αντιστοίχιση</span>
        <span class="lm-hint">Αντίστοιχισε τύπο με μορφή</span>
      </div>
      <div class="lmode-btn" id="lyo-mode-chrono" onclick="lyoSelMode('chrono')">
        <span class="lm-icon">⏱️</span>
        <span>Χρονική Αντικατάσταση</span>
        <span class="lm-hint">Δίνεται ένας χρόνος — συμπλήρωσε τους υπόλοιπους</span>
      </div>
    </div>
    <div class="lsett-row">
      <div class="lfield"><label>Χρόνος</label>
        <select id="lyo-sel-time">
          <option value="60">60 δευτερόλεπτα</option>
          <option value="90" selected>90 δευτερόλεπτα</option>
          <option value="120">120 δευτερόλεπτα</option>
          <option value="180">180 δευτερόλεπτα</option>
          <option value="300">300 δευτερόλεπτα</option>
          <option value="0">Απεριόριστο</option>
        </select>
      </div>
      <div class="lfield"><label>Ζωές</label>
        <select id="lyo-sel-lives">
          <option value="1">1 ζωή</option>
          <option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option>
          <option value="0">Απεριόριστο</option>
        </select>
      </div>
    </div>
    <button class="lsett-qr-btn" id="lyo-sett-qr" style="opacity:0.38;pointer-events:none;">📱 <span>Μοιράσου αυτή τη ρύθμιση</span></button>
    <button class="lbtn lbtn-primary" id="lyo-launch-btn" onclick="lyoLaunch()" style="opacity:.5;pointer-events:none;">Έναρξη Κουίζ →</button>
  </div>
</div>
<div id="lyo-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="lyo-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="lyo-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="lyo-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="lyoEnd()" style="padding:7px 13px;font-size:0.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="lyo-q"><div class="lq-main">Φόρτωση...</div></div>
    <div id="lyo-mc-area"><div class="lopts-grid" id="lyo-opts"></div></div>
    <div id="lyo-fi-area" class="lfi-wrap">
      <div class="lstem-display">
        <div class="lstem-part" id="lyo-stem">λυ-</div>
        <div class="lfi-inp-wrap">
          <input type="text" id="lyo-fi-input" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="κατάληξη">
        </div>
      </div>
      <button class="lfi-submit" id="lyo-fi-submit" onclick="lyoSubmitFI()">Υποβολή ↵</button>
      <div class="lpoly-kb">
        <button class="lpoly-toggle" id="lyo-poly-toggle" onclick="lyoToggleKB()">
          <span>Πολυτονικό Πληκτρολόγιο</span>
          <span class="lpoly-arrow">▼</span>
        </button>
        <div class="lpoly-body" id="lyo-poly-body">
          <!-- diacritics row -->
          <div class="lpoly-diac-row" id="lyo-diac-row"></div>
          <!-- vowel rows -->
          <div id="lyo-vowel-rows"></div>
        </div>
      </div>
    </div>
    <div class="lfeedback" id="lyo-fb"></div>
  </div>
</div>
<div id="lyo-screen-end" class="lyo-screen">
  <div class="lcard lend-screen">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="lyo-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;" id="lyo-ed"></div>
    <hr class="ldivider">
    <div id="lyo-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="lyoRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="lyoGoLevels()">Επίπεδα</button>
    </div>
  </div>
</div>
<div id="lyo-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="lyo-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="lyo-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('lyo')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="lyo-match-body"></div>
    <div class="lfeedback" id="lyo-match-fb"></div>
  </div>
</div>
<div id="lyo-screen-chrono" class="lyo-screen">
  <div class="lcard" style="max-height:88vh;overflow-y:auto;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="lyo-csv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="lyo-ctv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="lyo-clv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="lyoEnd()" style="padding:7px 13px;font-size:0.77rem;">Τέλος</button>
    </div>
    <div id="lyo-chrono-container"></div>
    <div class="lpoly-kb" style="margin-top:16px;">
      <button class="lpoly-toggle" id="lyo-cpoly-toggle" onclick="lyoToggleCKB()">
        <span>Πολυτονικό Πληκτρολόγιο</span>
        <span class="lpoly-arrow">▼</span>
      </button>
      <div class="lpoly-body" id="lyo-cpoly-body">
        <div class="lpoly-diac-row" id="lyo-cdiac-row"></div>
        <div id="lyo-cvowel-rows"></div>
      </div>
    </div>
  </div>
</div>`;
  lyoBuildGrid();
  lyoInitCustomChecks();
  lyoBuildKeyboard();
}

function lyoShow(id) {
  document.querySelectorAll('.lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ══════════════════════════════════════
// POLYTONIC DEAD-KEY KEYBOARD
// ══════════════════════════════════════

// 11 diacritics the user asked for:
// 2 tones: οξεία, περισπωμένη
// 1 υπογεγραμμένη
// 2 plain pneumata: δασεία, ψιλή
// 6 combos: δασεία+οξεία, δασεία+περισπωμένη, δασεία+υπογ+περισπ,
//           ψιλή+οξεία, ψιλή+περισπωμένη, ψιλή+υπογ+περισπ
// (Note: δασεία+υπογ+περισπ and ψιλή+υπογ+περισπ are the complex combos)

const LYO_DIACRITICS = [
  { id:'ox',   label:'´',     hint:'Οξεία' },
  { id:'per',  label:'͂',      hint:'Περισπωμένη' },
  { id:'ypogr',label:'ͅ',     hint:'Υπογεγραμμένη' },
  { id:'das',  label:'῾',     hint:'Δασεία' },
  { id:'psi',  label:'᾿',     hint:'Ψιλή' },
  { id:'das_ox',  label:'῾´',  hint:'Δασεία+Οξεία' },
  { id:'das_per', label:'῟',  hint:'Δασεία+Περισπ.' },
  { id:'das_yp_per', label:'῟ͅ', hint:'Δασεία+Υπογ+Περισπ.' },
  { id:'psi_ox',  label:'᾿´',  hint:'Ψιλή+Οξεία' },
  { id:'psi_per', label:'῏',  hint:'Ψιλή+Περισπ.' },
  { id:'psi_yp_per', label:'῏ͅ', hint:'Ψιλή+Υπογ+Περισπ.' },
];

// Map: diacritic_id → { vowel → combined_char }
const LYO_COMBO = {
  ox:   { α:'ά', ε:'έ', η:'ή', ι:'ί', ο:'ό', υ:'ύ', ω:'ώ', Α:'Ά', Ε:'Έ', Η:'Ή', Ι:'Ί', Ο:'Ό', Υ:'Ύ', Ω:'Ώ' },
  per:  { α:'ᾶ', η:'ῆ', ι:'ῖ', υ:'ῦ', ω:'ῶ' },
  ypogr:{ α:'ᾳ', η:'ῃ', ω:'ῳ' },
  das:  { α:'ἁ', ε:'ἑ', η:'ἡ', ι:'ἱ', ο:'ὁ', υ:'ὑ', ω:'ὡ' },
  psi:  { α:'ἀ', ε:'ἐ', η:'ἠ', ι:'ἰ', ο:'ὀ', υ:'ὐ', ω:'ὠ' },
  das_ox:   { α:'ἅ', ε:'ἕ', η:'ἥ', ι:'ἵ', ο:'ὅ', υ:'ὕ', ω:'ὥ' },
  das_per:  { α:'ἇ', η:'ἧ', ι:'ἷ', υ:'ὗ', ω:'ὧ' },
  das_yp_per: { α:'ᾇ', η:'ᾗ', ω:'ᾧ' },
  psi_ox:   { α:'ἄ', ε:'ἔ', η:'ἤ', ι:'ἴ', ο:'ὄ', υ:'ὔ', ω:'ὤ' },
  psi_per:  { α:'ἆ', η:'ἦ', ι:'ἶ', υ:'ὖ', ω:'ὦ' },
  psi_yp_per: { α:'ᾆ', η:'ᾖ', ω:'ᾦ' },
};

// For each vowel, which diacritics apply
const LYO_VOWEL_DIACRITICS = {
  α: ['ox','per','ypogr','das','psi','das_ox','das_per','das_yp_per','psi_ox','psi_per','psi_yp_per'],
  ε: ['ox','das','psi','das_ox','psi_ox'],
  η: ['ox','per','ypogr','das','psi','das_ox','das_per','das_yp_per','psi_ox','psi_per','psi_yp_per'],
  ι: ['ox','per','das','psi','das_ox','das_per','psi_ox','psi_per'],
  ο: ['ox','das','psi','das_ox','psi_ox'],
  υ: ['ox','per','das','psi','das_ox','das_per','psi_ox','psi_per'],
  ω: ['ox','per','ypogr','das','psi','das_ox','das_per','das_yp_per','psi_ox','psi_per','psi_yp_per'],
};

let lyoActiveDiacritic = null;
let lyoLastInput = null;

function lyoBuildKeyboard() {
  const diacRow = document.getElementById('lyo-diac-row');
  const vowelRows = document.getElementById('lyo-vowel-rows');
  if (!diacRow || !vowelRows) return;

  // Build diacritic dead keys
  diacRow.innerHTML = '';
  LYO_DIACRITICS.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'lpoly-dkey';
    btn.id = 'lyo-dkey-' + d.id;
    btn.innerHTML = `<span style="font-size:1.1rem;">${d.label}</span><span class="ldkey-label">${d.hint}</span>`;
    btn.onclick = () => lyoToggleDiacritic(d.id);
    diacRow.appendChild(btn);
  });

  // Build vowel rows
  const vowels = ['α','ε','η','ι','ο','υ','ω'];
  vowelRows.innerHTML = '';
  vowels.forEach(v => {
    const row = document.createElement('div');
    row.className = 'lpoly-vowel-row';
    row.id = 'lyo-vrow-' + v;

    const label = document.createElement('div');
    label.className = 'lpoly-vlabel';
    label.textContent = v;
    row.appendChild(label);

    const keys = document.createElement('div');
    keys.className = 'lpoly-vkeys';
    keys.id = 'lyo-vkeys-' + v;

    // Plain vowel key
    const plain = document.createElement('button');
    plain.className = 'lpoly-vkey';
    plain.textContent = v;
    plain.title = v;
    plain.onclick = () => lyoVowelClick(v);
    keys.appendChild(plain);

    row.appendChild(keys);
    vowelRows.appendChild(row);
  });

  // Initial render with no diacritic active
  lyoRenderVowelKeys();
}

function lyoToggleDiacritic(id) {
  if (lyoActiveDiacritic === id) {
    lyoActiveDiacritic = null;
  } else {
    lyoActiveDiacritic = id;
  }
  // Update dead key active state in both keyboards
  document.querySelectorAll('.lpoly-dkey').forEach(b => b.classList.remove('ldkey-active'));
  if (lyoActiveDiacritic) {
    ['lyo-dkey-','lyo-cdkey-'].forEach(p=>{
      document.getElementById(p + lyoActiveDiacritic)?.classList.add('ldkey-active');
    });
  }
  lyoRenderVowelKeys();
}

function lyoRenderVowelKeys() {
  const vowels = ['α','ε','η','ι','ο','υ','ω'];
  vowels.forEach(v => {
    // Render into both keyboards (regular + chrono)
    ['lyo-vkeys-','lyo-cvkeys-'].forEach(pfx => {
      const container = document.getElementById(pfx + v);
      if (!container) return;
      // Keep first child (plain vowel)
      while (container.children.length > 1) container.removeChild(container.lastChild);
      if (!lyoActiveDiacritic) return;
      const combo = LYO_COMBO[lyoActiveDiacritic];
      if (!combo) return;
      const combined = combo[v];
      if (!combined) return;
      // Show combined vowel
      const btn = document.createElement('button');
      btn.className = 'lpoly-vkey';
      btn.style.borderColor = '#c9a44a';
      btn.style.color = '#e8c87a';
      btn.textContent = combined;
      btn.title = combined;
      btn.onclick = () => lyoInsertChar(combined);
      container.appendChild(btn);
    });
  });
}

function lyoVowelClick(v) {
  if (lyoActiveDiacritic) {
    const combo = LYO_COMBO[lyoActiveDiacritic];
    const combined = combo && combo[v];
    if (combined) {
      lyoInsertChar(combined);
    } else {
      lyoInsertChar(v); // no combo available, insert plain
    }
    // Clear diacritic after use
    lyoActiveDiacritic = null;
    document.querySelectorAll('.lpoly-dkey').forEach(b => b.classList.remove('ldkey-active'));
    lyoRenderVowelKeys();
  } else {
    lyoInsertChar(v);
  }
}

function lyoInsertChar(ch) {
  const inp = (lyoLastInput && document.contains(lyoLastInput)) ? lyoLastInput : document.getElementById('lyo-fi-input');
  if (!inp) return;
  const s = inp.selectionStart, e = inp.selectionEnd;
  inp.value = inp.value.slice(0, s) + ch + inp.value.slice(e);
  inp.selectionStart = inp.selectionEnd = s + ch.length;
  inp.focus();
}

function lyoToggleKB() {
  const tog = document.getElementById('lyo-poly-toggle');
  const body = document.getElementById('lyo-poly-body');
  if (!tog || !body) return;
  tog.classList.toggle('open');
  body.classList.toggle('open');
}

// ══════════════════════════════════════
// LYO GRAMMAR DATA
// ══════════════════════════════════════
const LYO_G = {};
const LP = ["α ενικό","β ενικό","γ ενικό","α πληθυντικό","β πληθυντικό","γ πληθυντικό"];
const LIP = ["β ενικό","γ ενικό","β πληθυντικό","γ πληθυντικό"];

function ladd(form,voice,mood,tense,mc,fi,gender){
  const k=gender?`${form}|${voice}|${mood}|${tense}|${gender}`:`${form}|${voice}|${mood}|${tense}`;
  LYO_G[k]={form,voice,mood,tense,gender:gender||null,endings:mc,fi_endings:fi||mc};
}

// ΟΡΙΣΤΙΚΗ ΕΝΕΡΓΗΤΙΚΗ
{const mc=[["ω","εις","ει","ομεν","ετε","ουσιν"],["ον","ες","ε","ομεν","ετε","ον"],["σω","σεις","σει","σομεν","σετε","σουσιν"],["σα","σας","σε","σαμεν","σατε","σαν"],["κα","κας","κε","καμεν","κατε","κασιν"],["κειν","κεις","κει","κεμεν","κετε","κεσαν"]];const fi=[["ω","εις","ει","ομεν","ετε","ουσιν"],["ον","ες","ε","ομεν","ετε","ον"],["ω","εις","ει","ομεν","ετε","ουσιν"],["α","ας","ε","αμεν","ατε","αν"],["α","ας","ε","αμεν","ατε","ασιν"],["ειν","εις","ει","εμεν","ετε","εσαν"]];const T=["ενεστώτας","παρατατικός","μέλλοντας","αόριστος","παρακείμενος","υπερσυντέλικος"];T.forEach((t,ti)=>LP.forEach((p,pi)=>ladd(p,"ενεργητική","οριστική",t,[mc[ti][pi]],[fi[ti][pi]])));}

// ΟΡΙΣΤΙΚΗ ΜΕΣΗ
{const rows=[{t:"ενεστώτας",mc:[["ομαι"],["ῃ","ει"],["εται"],["ομεθα"],["εσθε"],["ονται"]],fi:[["ομαι"],["ῃ","ει"],["εται"],["ομεθα"],["εσθε"],["ονται"]]},{t:"παρατατικός",mc:[["ομην"],["ου"],["ετο"],["ομεθα"],["εσθε"],["οντο"]],fi:[["ομην"],["ου"],["ετο"],["ομεθα"],["εσθε"],["οντο"]]},{t:"μέλλοντας",mc:[["σομαι"],["σῃ","σει"],["σεται"],["σομεθα"],["σεσθε"],["σονται"]],fi:[["ομαι"],["ῃ","ει"],["εται"],["ομεθα"],["εσθε"],["ονται"]]},{t:"αόριστος",mc:[["σαμην"],["σω"],["σατο"],["σαμεθα"],["σασθε"],["σαντο"]],fi:[["αμην"],["ω"],["ατο"],["αμεθα"],["ασθε"],["αντο"]]},{t:"παρακείμενος",mc:[["μαι"],["σαι"],["ται"],["μεθα"],["σθε"],["νται"]],fi:[["μαι"],["σαι"],["ται"],["μεθα"],["σθε"],["νται"]]},{t:"υπερσυντέλικος",mc:[["μην"],["σο"],["το"],["μεθα"],["σθε"],["ντο"]],fi:[["μην"],["σο"],["το"],["μεθα"],["σθε"],["ντο"]]}];rows.forEach(r=>LP.forEach((p,i)=>ladd(p,"μέση","οριστική",r.t,r.mc[i],r.fi[i])));}

// ΥΠΟΤΑΚΤΙΚΗ ΕΝΕΡΓΗΤΙΚΗ
{const e=[["ω"],["ῃς"],["ῃ"],["ωμεν"],["ητε"],["ωσιν"]];const ma=[["σω"],["σῃς"],["σῃ"],["σωμεν"],["σητε"],["σωσιν"]];LP.forEach((p,i)=>{ladd(p,"ενεργητική","υποτακτική","ενεστώτας",e[i],e[i]);ladd(p,"ενεργητική","υποτακτική","αόριστος",ma[i],e[i]);});}

// ΥΠΟΤΑΚΤΙΚΗ ΜΕΣΗ
{const ep=[["ωμαι"],["ῃ"],["ηται"],["ωμεθα"],["ησθε"],["ωνται"]];const ma=[["σωμαι"],["σῃ"],["σηται"],["σωμεθα"],["σησθε"],["σωνται"]];LP.forEach((p,i)=>{ladd(p,"μέση","υποτακτική","ενεστώτας",ep[i],ep[i]);ladd(p,"μέση","υποτακτική","αόριστος",ma[i],ep[i]);});}

// ΕΥΚΤΙΚΗ ΕΝΕΡΓΗΤΙΚΗ
{const pr=[["οιμι"],["οις"],["οι"],["οιμεν"],["οιτε"],["οιεν"]];const mf=[["σοιμι"],["σοις"],["σοι"],["σοιμεν"],["σοιτε"],["σοιεν"]];const ma=[["σαιμι"],["σαις"],["σαι"],["σαιμεν"],["σαιτε"],["σαιεν"]];const fa=[["αιμι"],["αις"],["αι"],["αιμεν"],["αιτε"],["αιεν"]];LP.forEach((p,i)=>{ladd(p,"ενεργητική","ευκτική","ενεστώτας",pr[i],pr[i]);ladd(p,"ενεργητική","ευκτική","μέλλοντας",mf[i],pr[i]);ladd(p,"ενεργητική","ευκτική","αόριστος",ma[i],fa[i]);});}

// ΕΥΚΤΙΚΗ ΜΕΣΗ
{const pr=[["οιμην"],["οιο"],["οιτο"],["οιμεθα"],["οισθε"],["οιντο"]];const mf=[["σοιμην"],["σοιο"],["σοιτο"],["σοιμεθα"],["σοισθε"],["σοιντο"]];const ma=[["σαιμην"],["σαιο"],["σαιτο"],["σαιμεθα"],["σαισθε"],["σαιντο"]];const fa=[["αιμην"],["αιο"],["αιτο"],["αιμεθα"],["αισθε"],["αιντο"]];LP.forEach((p,i)=>{ladd(p,"μέση","ευκτική","ενεστώτας",pr[i],pr[i]);ladd(p,"μέση","ευκτική","μέλλοντας",mf[i],pr[i]);ladd(p,"μέση","ευκτική","αόριστος",ma[i],fa[i]);});}

// ΠΡΟΣΤΑΚΤΙΚΗ ΕΝΕΡΓΗΤΙΚΗ
{const ip={"β ενικό":["ε"],"γ ενικό":["έτω"],"β πληθυντικό":["ετε"],"γ πληθυντικό":["όντων","έτωσαν"]};const ma={"β ενικό":["σον"],"γ ενικό":["σάτω"],"β πληθυντικό":["σατε"],"γ πληθυντικό":["σάντων","σάτωσαν"]};const fa={"β ενικό":["ον"],"γ ενικό":["άτω"],"β πληθυντικό":["ατε"],"γ πληθυντικό":["άντων","άτωσαν"]};LIP.forEach(p=>{ladd(p,"ενεργητική","προστακτική","ενεστώτας",ip[p],ip[p]);ladd(p,"ενεργητική","προστακτική","αόριστος",ma[p],fa[p]);});}

// ΠΡΟΣΤΑΚΤΙΚΗ ΜΕΣΗ
{const ip={"β ενικό":["ου"],"γ ενικό":["έσθω"],"β πληθυντικό":["εσθε"],"γ πληθυντικό":["έσθων","έσθωσαν"]};const ma={"β ενικό":["σαι"],"γ ενικό":["σάσθω"],"β πληθυντικό":["σασθε"],"γ πληθυντικό":["σάσθων","σάσθωσαν"]};const fa={"β ενικό":["αι"],"γ ενικό":["άσθω"],"β πληθυντικό":["ασθε"],"γ πληθυντικό":["άσθων","άσθωσαν"]};LIP.forEach(p=>{ladd(p,"μέση","προστακτική","ενεστώτας",ip[p],ip[p]);ladd(p,"μέση","προστακτική","αόριστος",ma[p],fa[p]);});}

// ΑΠΑΡΕΜΦΑΤΟ
ladd("απαρέμφατο","ενεργητική","—","ενεστώτας",["ειν"],["ειν"]);
ladd("απαρέμφατο","ενεργητική","—","μέλλοντας",["σειν"],["ειν"]);
ladd("απαρέμφατο","ενεργητική","—","αόριστος",["σαι"],["αι"]);
ladd("απαρέμφατο","ενεργητική","—","παρακείμενος",["κέναι"],["έναι"]);
ladd("απαρέμφατο","μέση","—","ενεστώτας",["εσθαι"],["εσθαι"]);
ladd("απαρέμφατο","μέση","—","μέλλοντας",["σεσθαι"],["εσθαι"]);
ladd("απαρέμφατο","μέση","—","αόριστος",["σασθαι"],["ασθαι"]);
ladd("απαρέμφατο","μέση","—","παρακείμενος",["σθαι"],["σθαι"]);

// ΜΕΤΟΧΕΣ
[["ενεργητική","ενεστώτας","αρσενικό","ων","ων"],["ενεργητική","ενεστώτας","θηλυκό","ουσα","ουσα"],["ενεργητική","ενεστώτας","ουδέτερο","ον","ον"],["ενεργητική","μέλλοντας","αρσενικό","σων","ων"],["ενεργητική","μέλλοντας","θηλυκό","σουσα","ουσα"],["ενεργητική","μέλλοντας","ουδέτερο","σον","ον"],["ενεργητική","αόριστος","αρσενικό","σας","ας"],["ενεργητική","αόριστος","θηλυκό","σασα","ασα"],["ενεργητική","αόριστος","ουδέτερο","σαν","αν"],["ενεργητική","παρακείμενος","αρσενικό","κώς","ώς"],["ενεργητική","παρακείμενος","θηλυκό","κυῖα","υῖα"],["ενεργητική","παρακείμενος","ουδέτερο","κός","ός"],["μέση","ενεστώτας","αρσενικό","ομενος","ομενος"],["μέση","ενεστώτας","θηλυκό","ομένη","ομένη"],["μέση","ενεστώτας","ουδέτερο","ομενον","ομενον"],["μέση","μέλλοντας","αρσενικό","σόμενος","ομενος"],["μέση","μέλλοντας","θηλυκό","σομένη","ομένη"],["μέση","μέλλοντας","ουδέτερο","σόμενον","ομενον"],["μέση","αόριστος","αρσενικό","σάμενος","αμενος"],["μέση","αόριστος","θηλυκό","σαμένη","αμένη"],["μέση","αόριστος","ουδέτερο","σάμενον","αμενον"],["μέση","παρακείμενος","αρσενικό","μένος","μένος"],["μέση","παρακείμενος","θηλυκό","μένη","μένη"],["μέση","παρακείμενος","ουδέτερο","μένον","μένον"]].forEach(([v,t,g,mc,fi])=>ladd("μετοχή",v,"—",t,[mc],[fi],g));

// ΠΑΡΑΚΕΙΜΕΝΟΣ ΥΠΟΤΑΚΤΙΚΗ (periph.)
{const fi=[["ὦ"],["ᾖς"],["ᾖ"],["ὦμεν"],["ἦτε"],["ὦσιν"]];const ma=[["λελυκὼς/υῖα/ὸς ὦ"],["λελυκὼς/υῖα/ὸς ᾖς"],["λελυκὼς/υῖα/ὸς ᾖ"],["λελυκότες/υῖαι/ότα ὦμεν"],["λελυκότες/υῖαι/ότα ἦτε"],["λελυκότες/υῖαι/ότα ὦσιν"]];const mm=[["λελυμένος/η/ον ὦ"],["λελυμένος/η/ον ᾖς"],["λελυμένος/η/ον ᾖ"],["λελυμένοι/αι/α ὦμεν"],["λελυμένοι/αι/α ἦτε"],["λελυμένοι/αι/α ὦσιν"]];LP.forEach((p,i)=>{ladd(p,"ενεργητική","υποτακτική","παρακείμενος",ma[i],fi[i]);ladd(p,"μέση","υποτακτική","παρακείμενος",mm[i],fi[i]);});}

// ΠΑΡΑΚΕΙΜΕΝΟΣ ΕΥΚΤΙΚΗ
{const fi=[["εἴην"],["εἴης"],["εἴη"],["εἴημεν","εἶμεν"],["εἴητε","εἶτε"],["εἴησαν","εἶεν"]];const ma=[["λελυκὼς εἴην"],["λελυκὼς εἴης"],["λελυκὼς εἴη"],["λελυκότες εἴημεν"],["λελυκότες εἴητε"],["λελυκότες εἴησαν"]];const mm=[["λελυμένος εἴην"],["λελυμένος εἴης"],["λελυμένος εἴη"],["λελυμένοι εἴημεν"],["λελυμένοι εἴητε"],["λελυμένοι εἴησαν"]];LP.forEach((p,i)=>{ladd(p,"ενεργητική","ευκτική","παρακείμενος",ma[i],fi[i]);ladd(p,"μέση","ευκτική","παρακείμενος",mm[i],fi[i]);});}

// ΠΑΡΑΚΕΙΜΕΝΟΣ ΠΡΟΣΤΑΚΤΙΚΗ
{const ei={"β ενικό":["ἴσθι"],"γ ενικό":["ἔστω"],"β πληθυντικό":["ἔστε"],"γ πληθυντικό":["ἔστων","ἔστωσαν"]};const ma={"β ενικό":["λελυκὼς ἴσθι"],"γ ενικό":["λελυκὼς ἔστω"],"β πληθυντικό":["λελυκότες ἔστε"],"γ πληθυντικό":["λελυκότες ἔστων"]};const mm={"β ενικό":["λέλυσο"],"γ ενικό":["λελύσθω"],"β πληθυντικό":["λέλυσθε"],"γ πληθυντικό":["λελύσθων","λελύσθωσαν"]};const fm={"β ενικό":["σο"],"γ ενικό":["σθω"],"β πληθυντικό":["σθε"],"γ πληθυντικό":["σθων","σθωσαν"]};LIP.forEach(p=>{ladd(p,"ενεργητική","προστακτική","παρακείμενος",[ma[p]],ei[p]);ladd(p,"μέση","προστακτική","παρακείμενος",mm[p],fm[p]);});}

// STEMS
const LYO_STEMS={
  "ενεργητική|οριστική|ενεστώτας":"λυ-","ενεργητική|οριστική|παρατατικός":"ἐλυ-","ενεργητική|οριστική|μέλλοντας":"λυσ-","ενεργητική|οριστική|αόριστος":"ἐλυσ-","ενεργητική|οριστική|παρακείμενος":"λελυκ-","ενεργητική|οριστική|υπερσυντέλικος":"ἐλελυκ-",
  "ενεργητική|υποτακτική|ενεστώτας":"λυ-","ενεργητική|υποτακτική|αόριστος":"λυσ-","ενεργητική|υποτακτική|παρακείμενος":"λελυκώς/κυῖα/κός",
  "ενεργητική|ευκτική|ενεστώτας":"λυ-","ενεργητική|ευκτική|μέλλοντας":"λυσ-","ενεργητική|ευκτική|αόριστος":"λυσ-","ενεργητική|ευκτική|παρακείμενος":"λελυκώς/κυῖα/κός",
  "ενεργητική|προστακτική|ενεστώτας":"λυ-","ενεργητική|προστακτική|αόριστος":"λυσ-","ενεργητική|προστακτική|παρακείμενος":"λελυκώς/κυῖα/κός",
  "ενεργητική|—|ενεστώτας":"λυ-","ενεργητική|—|μέλλοντας":"λυσ-","ενεργητική|—|αόριστος":"λυσ-","ενεργητική|—|παρακείμενος":"λελυκ-",
  "μέση|οριστική|ενεστώτας":"λυ-","μέση|οριστική|παρατατικός":"ἐλυ-","μέση|οριστική|μέλλοντας":"λυσ-","μέση|οριστική|αόριστος":"ἐλυσ-","μέση|οριστική|παρακείμενος":"λελυ-","μέση|οριστική|υπερσυντέλικος":"ἐλελυ-",
  "μέση|υποτακτική|ενεστώτας":"λυ-","μέση|υποτακτική|αόριστος":"λυσ-","μέση|υποτακτική|παρακείμενος":"λελυμένος/η/ον",
  "μέση|ευκτική|ενεστώτας":"λυ-","μέση|ευκτική|μέλλοντας":"λυσ-","μέση|ευκτική|αόριστος":"λυσ-","μέση|ευκτική|παρακείμενος":"λελυμένος/η/ον",
  "μέση|προστακτική|ενεστώτας":"λυ-","μέση|προστακτική|αόριστος":"λυσ-","μέση|προστακτική|παρακείμενος":"λελυ-",
  "μέση|—|ενεστώτας":"λυ-","μέση|—|μέλλοντας":"λυσ-","μέση|—|αόριστος":"λυσ-","μέση|—|παρακείμενος":"λελυ-",
};
function lyoGetStem(g){return LYO_STEMS[`${g.voice}|${g.mood}|${g.tense}`]||"λυ-";}

// ── LEVELS ──
const LYO_LVL=[
  {id:1,group:"Οριστική",color:"lgreen",desc:"Ενεστώτας, Μέλλοντας — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["οριστική"],tenses:["ενεστώτας","μέλλοντας"],forms:LP}},
  {id:2,group:"Οριστική",color:"lgreen",desc:"Παρατατικός, Αόριστος — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["οριστική"],tenses:["παρατατικός","αόριστος"],forms:LP}},
  {id:3,group:"Οριστική",color:"lyellow",desc:"Παρακείμενος, Υπερσυντέλικος — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["οριστική"],tenses:["παρακείμενος","υπερσυντέλικος"],forms:LP}},
  {id:4,group:"Οριστική",color:"lyellow",desc:"Όλοι οι χρόνοι — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["οριστική"],tenses:["ενεστώτας","παρατατικός","μέλλοντας","αόριστος","παρακείμενος","υπερσυντέλικος"],forms:LP}},
  {id:5,group:"Οριστική",color:"lyellow",desc:"Ενεστώτας, Μέλλοντας — Μέση Φωνή",filter:{voices:["μέση"],moods:["οριστική"],tenses:["ενεστώτας","μέλλοντας"],forms:LP}},
  {id:6,group:"Οριστική",color:"lyellow",desc:"Παρατατικός, Αόριστος — Μέση Φωνή",filter:{voices:["μέση"],moods:["οριστική"],tenses:["παρατατικός","αόριστος"],forms:LP}},
  {id:7,group:"Οριστική",color:"lred",desc:"Όλοι οι χρόνοι — Μέση Φωνή",filter:{voices:["μέση"],moods:["οριστική"],tenses:["ενεστώτας","παρατατικός","μέλλοντας","αόριστος","παρακείμενος","υπερσυντέλικος"],forms:LP}},
  {id:8,group:"Οριστική",color:"lred",desc:"Όλοι οι χρόνοι — Ενεργητική & Μέση Φωνή",filter:{voices:["ενεργητική","μέση"],moods:["οριστική"],tenses:["ενεστώτας","παρατατικός","μέλλοντας","αόριστος","παρακείμενος","υπερσυντέλικος"],forms:LP}},
  {id:9,group:"Υποτακτική",color:"lgreen",desc:"Ενεστώτας, Αόριστος — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["υποτακτική"],tenses:["ενεστώτας","αόριστος"],forms:LP}},
  {id:10,group:"Υποτακτική",color:"lyellow",desc:"Ενεστώτας, Αόριστος — Μέση Φωνή",filter:{voices:["μέση"],moods:["υποτακτική"],tenses:["ενεστώτας","αόριστος"],forms:LP}},
  {id:11,group:"Υποτακτική",color:"lred",desc:"Ενεστώτας, Αόριστος — Ενεργητική & Μέση Φωνή",filter:{voices:["ενεργητική","μέση"],moods:["υποτακτική"],tenses:["ενεστώτας","αόριστος"],forms:LP}},
  {id:24,group:"Υποτακτική",color:"lgreen",desc:"Παρακείμενος — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["υποτακτική"],tenses:["παρακείμενος"],forms:LP}},
  {id:25,group:"Υποτακτική",color:"lyellow",desc:"Παρακείμενος — Μέση Φωνή",filter:{voices:["μέση"],moods:["υποτακτική"],tenses:["παρακείμενος"],forms:LP}},
  {id:26,group:"Υποτακτική",color:"lred",desc:"Παρακείμενος — Ενεργητική & Μέση Φωνή",filter:{voices:["ενεργητική","μέση"],moods:["υποτακτική"],tenses:["παρακείμενος"],forms:LP}},
  {id:12,group:"Ευκτική",color:"lgreen",desc:"Ενεστώτας, Μέλλοντας, Αόριστος — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["ευκτική"],tenses:["ενεστώτας","μέλλοντας","αόριστος"],forms:LP}},
  {id:13,group:"Ευκτική",color:"lyellow",desc:"Ενεστώτας, Μέλλοντας, Αόριστος — Μέση Φωνή",filter:{voices:["μέση"],moods:["ευκτική"],tenses:["ενεστώτας","μέλλοντας","αόριστος"],forms:LP}},
  {id:14,group:"Ευκτική",color:"lred",desc:"Ενεστώτας, Μέλλοντας, Αόριστος — Ενεργητική & Μέση Φωνή",filter:{voices:["ενεργητική","μέση"],moods:["ευκτική"],tenses:["ενεστώτας","μέλλοντας","αόριστος"],forms:LP}},
  {id:27,group:"Ευκτική",color:"lgreen",desc:"Παρακείμενος — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["ευκτική"],tenses:["παρακείμενος"],forms:LP}},
  {id:28,group:"Ευκτική",color:"lyellow",desc:"Παρακείμενος — Μέση Φωνή",filter:{voices:["μέση"],moods:["ευκτική"],tenses:["παρακείμενος"],forms:LP}},
  {id:29,group:"Ευκτική",color:"lred",desc:"Παρακείμενος — Ενεργητική & Μέση Φωνή",filter:{voices:["ενεργητική","μέση"],moods:["ευκτική"],tenses:["παρακείμενος"],forms:LP}},
  {id:15,group:"Προστακτική",color:"lgreen",desc:"Ενεστώτας, Αόριστος — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["προστακτική"],tenses:["ενεστώτας","αόριστος"],forms:LIP}},
  {id:16,group:"Προστακτική",color:"lyellow",desc:"Ενεστώτας, Αόριστος — Μέση Φωνή",filter:{voices:["μέση"],moods:["προστακτική"],tenses:["ενεστώτας","αόριστος"],forms:LIP}},
  {id:17,group:"Προστακτική",color:"lred",desc:"Ενεστώτας, Αόριστος — Ενεργητική & Μέση Φωνή",filter:{voices:["ενεργητική","μέση"],moods:["προστακτική"],tenses:["ενεστώτας","αόριστος"],forms:LIP}},
  {id:30,group:"Προστακτική",color:"lgreen",desc:"Παρακείμενος — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["προστακτική"],tenses:["παρακείμενος"],forms:LIP}},
  {id:31,group:"Προστακτική",color:"lyellow",desc:"Παρακείμενος — Μέση Φωνή",filter:{voices:["μέση"],moods:["προστακτική"],tenses:["παρακείμενος"],forms:LIP}},
  {id:32,group:"Προστακτική",color:"lred",desc:"Παρακείμενος — Ενεργητική & Μέση Φωνή",filter:{voices:["ενεργητική","μέση"],moods:["προστακτική"],tenses:["παρακείμενος"],forms:LIP}},
  {id:18,group:"Ονοματικοί Τύποι",color:"lpurple",desc:"Απαρέμφατο — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["—"],tenses:["ενεστώτας","μέλλοντας","αόριστος","παρακείμενος"],forms:["απαρέμφατο"]}},
  {id:19,group:"Ονοματικοί Τύποι",color:"lpurple",desc:"Απαρέμφατο — Μέση Φωνή",filter:{voices:["μέση"],moods:["—"],tenses:["ενεστώτας","μέλλοντας","αόριστος","παρακείμενος"],forms:["απαρέμφατο"]}},
  {id:20,group:"Ονοματικοί Τύποι",color:"lpurple",desc:"Μετοχή — Ενεργητική Φωνή",filter:{voices:["ενεργητική"],moods:["—"],tenses:["ενεστώτας","μέλλοντας","αόριστος","παρακείμενος"],forms:["μετοχή"]}},
  {id:21,group:"Ονοματικοί Τύποι",color:"lpurple",desc:"Μετοχή — Μέση Φωνή",filter:{voices:["μέση"],moods:["—"],tenses:["ενεστώτας","μέλλοντας","αόριστος","παρακείμενος"],forms:["μετοχή"]}},
  {id:22,group:"Ονοματικοί Τύποι",color:"lred",desc:"Απαρέμφατο & Μετοχή — Ενεργητική & Μέση Φωνή",filter:{voices:["ενεργητική","μέση"],moods:["—"],tenses:["ενεστώτας","μέλλοντας","αόριστος","παρακείμενος"],forms:["απαρέμφατο","μετοχή"]}},
  {id:23,group:"Συνδυαστικό",color:"lred",desc:"Όλες οι εγκλίσεις + απαρέμφατο + μετοχή — Ενεργητική & Μέση Φωνή",filter:{voices:["ενεργητική","μέση"],moods:["οριστική","υποτακτική","ευκτική","προστακτική","—"],tenses:["ενεστώτας","παρατατικός","μέλλοντας","αόριστος","παρακείμενος","υπερσυντέλικος"],forms:[...LP,...LIP.filter(x=>!LP.includes(x)),"απαρέμφατο","μετοχή"]}},
];

// ── STATE ──
let lyoState={filter:null,lives:3,score:0,timer:90,timerRemaining:90,timerInterval:null,activeKeys:[],answering:false,pendingTimeout:null,lastMood:null,lastVoice:null,lastForm:null,mistakes:[]};
let lyoCurrentQ=null;
let lyoGameMode=null;
let lyoCurrentLevelId=null;

// ── HELPERS ──
function lyoShuf(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function lyoKeys(f){return Object.keys(LYO_G).filter(k=>{const g=LYO_G[k];return f.voices.includes(g.voice)&&f.moods.includes(g.mood)&&f.tenses.includes(g.tense)&&f.forms.includes(g.form);});}

function lyoGenQ(keys){
  if(!keys.length)return null;
  const moods=[...new Set(keys.map(k=>LYO_G[k].mood))],voices=[...new Set(keys.map(k=>LYO_G[k].voice))],forms=[...new Set(keys.map(k=>LYO_G[k].form))];
  const mm=moods.length>1,mv=voices.length>1,mf=forms.length>1;
  let key;
  for(let a=0;a<12;a++){const c=keys[Math.floor(Math.random()*keys.length)];const g=LYO_G[c];if((!mm||g.mood!==lyoState.lastMood)&&(!mv||g.voice!==lyoState.lastVoice)&&(!mf||g.form!==lyoState.lastForm)){key=c;break;}if(a===11)key=c;}
  const g=LYO_G[key];lyoState.lastMood=g.mood;lyoState.lastVoice=g.voice;lyoState.lastForm=g.form;
  const correct=g.endings[0];
  // Same-lemma distractor pool (all LYO_G entries are λύω forms)
  // mt=matchTense, mm=matchMood, mv=matchVoice, df=differentForm(person/number)
  function pool(mt,mm,mv,df){const p=[];const seen=new Set();for(const k of Object.keys(LYO_G)){if(k===key)continue;const c=LYO_G[k];if(mt&&c.tense!==g.tense)continue;if(mm&&c.mood!==g.mood)continue;if(mv&&c.voice!==g.voice)continue;if(df&&c.form===g.form)continue;const e=c.endings[0];if(!g.endings.includes(e)&&!seen.has(e)){seen.add(e);p.push({form:e,entry:c});}}return p;}
  // 1. Same tense+mood+voice, different person/number — ideal paradigm mates
  let rawP=pool(true,true,true,true);
  // 2. Same tense+voice, any mood, different form
  if(rawP.length<3){const s=new Set(rawP.map(x=>x.form));pool(true,false,true,true).forEach(x=>{if(!s.has(x.form)){s.add(x.form);rawP.push(x);}});}
  // 3. Same voice, any tense/mood
  if(rawP.length<3){const s=new Set(rawP.map(x=>x.form));pool(false,false,true,false).forEach(x=>{if(!s.has(x.form)){s.add(x.form);rawP.push(x);}});}
  // 4. Anything
  if(rawP.length<3){const s=new Set(rawP.map(x=>x.form));pool(false,false,false,false).forEach(x=>{if(!s.has(x.form)){s.add(x.form);rawP.push(x);}});}
  lyoShuf(rawP);const wrongItems=rawP.slice(0,3);
  const _wMeta=window.GE?.classifyGDictDistractors(g,wrongItems.map(x=>x.entry).filter(Boolean),'verb')||[];
  const _wrongMetaMap=Object.create(null);wrongItems.forEach((x,i)=>{if(x.form!=='—'&&_wMeta[i])_wrongMetaMap[x.form]=_wMeta[i];});
  const wrong=wrongItems.map(x=>x.form);while(wrong.length<3)wrong.push("—");
  const opts=lyoShuf([correct,...wrong]);
  const stem=lyoGetStem(g);
  const fi_endings=g.fi_endings||g.endings;
  const _base=stem.endsWith('-')?stem.slice(0,-1):stem;
  const fw_correct=stem.endsWith('-')?_base+(fi_endings[0]||''):g.endings[0];
  const fw_ends=fi_endings.map(e=>stem.endsWith('-')?_base+e:e);
  const qt=lyoBuildQText(g);
  return{qt,opts,correct,endings:g.endings,fi_endings,fi_correct:fi_endings[0],stem,fw_correct,fw_ends,_wrongMetaMap};
}

function lyoBuildQText(g){
  const v=`<em>λύω</em>`;
  function tags(...items){return '<div class="lq-tags">'+items.map(([cls,txt])=>`<span class="lq-tag ${cls}">${txt}</span>`).join('')+'</div>';}
  if(g.form==="απαρέμφατο")return`<div class="lq-main">Ποια είναι η κατάληξη του <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;">απαρεμφάτου</span> του ${v};</div>`+tags(['voice',g.voice+' Φωνή'],['tense',g.tense]);
  if(g.form==="μετοχή")return`<div class="lq-main">Ποια είναι η κατάληξη της <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;">μετοχής</span> του ${v};</div>`+tags(['voice',g.voice+' Φωνή'],['tense',g.tense],['gender',g.gender]);
  return`<div class="lq-main">Ποια είναι η κατάληξη του ${v} στο <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;vertical-align:middle;">${g.form}</span>;</div>`+tags(['voice',g.voice+' Φωνή'],['tense',g.tense],['mood',g.mood]);
}

// ── LEVEL GRID ──
function lyoBuildGrid(){
  gramBuildLevelGrid('lyo', LYO_LVL, lyoSelLvl, {
    extraLabel: 'Προσαρμοσμένο',
    extraHint: 'Φωνή, Εγκλίσεις, Χρόνοι & Τύποι',
    onExtra: () => lyoShow('lyo-screen-custom'),
  });
}

function lyoSelLvl(lvl){
  lyoState.filter=lvl.filter;
  lyoCurrentLevelId=lvl.id;
  lyoGameMode=null;
  document.getElementById('lyo-sett-title').textContent=`Επίπεδο ${lvl.id}`;
  document.getElementById('lyo-sett-back').onclick=lyoGoLevels;
  // reset mode buttons
  ['mc','fi','fw','match','chrono'].forEach(x=>document.getElementById('lyo-mode-'+x)?.classList.remove('selected'));
  // reset launch + QR buttons
  const lb=document.getElementById('lyo-launch-btn');if(lb){lb.style.opacity='.5';lb.style.pointerEvents='none';}
  const qb=document.getElementById('lyo-sett-qr');if(qb){qb.style.opacity='0.38';qb.style.pointerEvents='none';}
  lyoShow('lyo-screen-settings');
}

function lyoSelMode(m){
  lyoGameMode=m;
  ['mc','fi','fw','match','chrono'].forEach(x=>document.getElementById('lyo-mode-'+x)?.classList.toggle('selected',m===x));
  const btn=document.getElementById('lyo-launch-btn');
  if(btn){btn.style.opacity='1';btn.style.pointerEvents='auto';}
  // Enable config-specific QR share when a level is selected
  const qb=document.getElementById('lyo-sett-qr');
  if(qb&&lyoCurrentLevelId){
    qb.style.opacity='1';qb.style.pointerEvents='auto';
    const modeNames={'mc':'Πολλαπλή Επιλογή','fi':'Συμπλήρωση Κενού','fw':'Ολόκληρος Τύπος','match':'Αντιστοίχιση','chrono':'Χρονική Αντικατάσταση'};
    qb.onclick=()=>showQR(`Λύω — Επίπεδο ${lyoCurrentLevelId} — ${modeNames[m]||m}`,{nav:'game',id:'lyo',level:lyoCurrentLevelId,mode:m});
  }
}

// ── CUSTOM CHECKBOXES ──
const LYO_V=["ενεργητική Φωνή","μέση Φωνή"],LYO_VM={"ενεργητική Φωνή":"ενεργητική","μέση Φωνή":"μέση"};
const LYO_M=["οριστική","υποτακτική","ευκτική","προστακτική"];
const LYO_T=["ενεστώτας","παρατατικός","μέλλοντας","αόριστος","παρακείμενος","υπερσυντέλικος"];
const LYO_F=["Ρηματικά Πρόσωπα","απαρέμφατο","μετοχή"];
function lyoInitCustomChecks(){
  [[LYO_V,'lyo-chk-voices'],[LYO_M,'lyo-chk-moods'],[LYO_T,'lyo-chk-tenses'],[LYO_F,'lyo-chk-forms']].forEach(([items,cid])=>{
    const c=document.getElementById(cid);if(!c)return;c.innerHTML='';
    items.forEach(item=>{const l=document.createElement('label');l.className='lcheck-pill';l.innerHTML=`<input type="checkbox" value="${item}"><span>${item}</span>`;l.querySelector('input').addEventListener('change',function(){l.classList.toggle('checked',this.checked);if(cid==='lyo-chk-forms')lyoUpdMoods();});c.appendChild(l);});
  });
  lyoUpdMoods();
}
function lyoUpdMoods(){const has=Array.from(document.querySelectorAll('#lyo-chk-forms input:checked')).some(i=>i.value==="Ρηματικά Πρόσωπα");const sec=document.getElementById('lyo-moods-sec');if(sec){sec.style.opacity=has?'1':'0.35';sec.style.pointerEvents=has?'':'none';}}
function lyoChk(cid){return Array.from(document.querySelectorAll(`#${cid} input:checked`)).map(i=>i.value);}
function lyoStartCustom(){
  const rv=lyoChk('lyo-chk-voices'),rf=lyoChk('lyo-chk-forms'),t=lyoChk('lyo-chk-tenses'),m=lyoChk('lyo-chk-moods');
  const err=document.getElementById('lyo-cerr');
  if(!rv.length){err.textContent='Επιλέξτε τουλάχιστον μία Φωνή.';err.style.visibility='visible';return;}
  if(!rf.length){err.textContent='Επιλέξτε τουλάχιστον έναν Τύπο.';err.style.visibility='visible';return;}
  if(!t.length){err.textContent='Επιλέξτε τουλάχιστον έναν Χρόνο.';err.style.visibility='visible';return;}
  const hp=rf.includes("Ρηματικά Πρόσωπα");
  if(hp&&!m.length){err.textContent='Επιλέξτε τουλάχιστον μία Έγκλιση.';err.style.visibility='visible';return;}
  err.style.visibility='hidden';
  const voices=rv.map(v=>LYO_VM[v]);let forms=[];rf.forEach(f=>{if(f==="Ρηματικά Πρόσωπα")forms.push(...LP);else forms.push(f);});
  const em=new Set();if(hp)m.forEach(x=>em.add(x));if(rf.includes("απαρέμφατο")||rf.includes("μετοχή"))em.add("—");
  lyoState.filter={voices,moods:[...em],tenses:t,forms};
  lyoCurrentLevelId=null;
  lyoGameMode=null;
  ['mc','fi','fw','match','chrono'].forEach(x=>document.getElementById('lyo-mode-'+x)?.classList.remove('selected'));
  const lb=document.getElementById('lyo-launch-btn');if(lb){lb.style.opacity='.5';lb.style.pointerEvents='none';}
  const qb=document.getElementById('lyo-sett-qr');if(qb){qb.style.opacity='0.38';qb.style.pointerEvents='none';}
  document.getElementById('lyo-sett-title').textContent="Προσαρμοσμένο";
  document.getElementById('lyo-sett-back').onclick=lyoGoLevels;
  lyoShow('lyo-screen-settings');
}

// ── LAUNCH ──
function lyoLaunch(){
  if(!lyoGameMode)return;
  // Match mode: delegate entirely to shared match engine
  if(lyoGameMode==='match'){
    clearInterval(lyoState.timerInterval);if(lyoState.pendingTimeout)clearTimeout(lyoState.pendingTimeout);
    _gramCurrentLvlId['lyo']=lyoCurrentLevelId;
    _gramLevelRefresh['lyo']=lyoBuildGrid;
    gramStartMatch('lyo',LYO_G,lyoKeys,lyoGetStem,lyoBuildQText,lyoState.filter,'lyo-wrap');
    return;
  }
  const t=parseInt(document.getElementById('lyo-sel-time').value);
  const l=parseInt(document.getElementById('lyo-sel-lives').value);
  lyoState.timer=t;lyoState.timerRemaining=t;lyoState.lives=l===0?Infinity:l;
  lyoState.score=0;lyoState.answering=false;lyoState.lastMood=null;lyoState.lastVoice=null;lyoState.lastForm=null;lyoState.mistakes=[];
  clearInterval(lyoState.timerInterval);if(lyoState.pendingTimeout)clearTimeout(lyoState.pendingTimeout);
  lyoState.activeKeys=lyoKeys(lyoState.filter);
  if(!lyoState.activeKeys.length){alert("Δεν βρέθηκαν ερωτήσεις.");return;}
  // reset dead key state
  lyoActiveDiacritic=null; lyoLastInput=null;
  // chrono mode — separate screen
  if(lyoGameMode==='chrono'){
    lyoShow('lyo-screen-chrono');
    lyoHUD();
    if(t>0)lyoTimer();
    lyoChronoBuildKB();
    lyoChronoNextQ();
    return;
  }
  // show/hide mc vs fi/fw
  const mcArea=document.getElementById('lyo-mc-area');
  const fiArea=document.getElementById('lyo-fi-area');
  if(mcArea)mcArea.style.display=lyoGameMode==='mc'?'':'none';
  if(fiArea){(lyoGameMode==='fi'||lyoGameMode==='fw')?fiArea.classList.add('active'):fiArea.classList.remove('active');}
  // wire enter key
  const inp=document.getElementById('lyo-fi-input');
  if(inp)inp.onkeydown=e=>{if(e.key==='Enter')lyoSubmitFI();};
  lyoShow('lyo-screen-game');lyoHUD();
  if(t>0)lyoTimer();
  lyoNextQ();
}
function lyoTimer(){lyoState.timerInterval=setInterval(()=>{lyoState.timerRemaining--;['lyo-tv','lyo-ctv'].forEach(id=>{const tv=document.getElementById(id);if(tv){tv.textContent=_gramFmtSec(lyoState.timerRemaining);tv.classList.toggle('ltimer-warn',lyoState.timerRemaining<=10);tv.classList.toggle('ltimer-caut',lyoState.timerRemaining<=20&&lyoState.timerRemaining>10);}});if(lyoState.timerRemaining<=0)lyoEnd();},1000);}
function lyoHUD(){
  ['lyo-sv','lyo-csv'].forEach(id=>{const el=document.getElementById(id);if(el)el.textContent=lyoState.score;});
  ['lyo-lv','lyo-clv'].forEach(id=>{const el=document.getElementById(id);if(!el)return;if(lyoState.lives===Infinity){el.textContent='∞';el.style.fontSize='1.4rem';}else{el.innerHTML=Array(lyoState.lives).fill('❤️').join('')||'💀';}});
  if(lyoState.timer===0){['lyo-tv','lyo-ctv'].forEach(id=>{const el=document.getElementById(id);if(el){el.textContent='∞';el.classList.remove('ltimer-warn','ltimer-caut');}});}
}
function lyoNextQ(){
  lyoCurrentQ=lyoGenQ(lyoState.activeKeys);if(!lyoCurrentQ){lyoEnd();return;}lyoState.answering=false;
  const qel=document.getElementById('lyo-q');if(qel)qel.innerHTML=lyoCurrentQ.qt;
  const fb=document.getElementById('lyo-fb');if(fb){fb.textContent='';fb.className='lfeedback';}
  if(lyoGameMode==='mc'){
    const grid=document.getElementById('lyo-opts');if(!grid)return;grid.innerHTML='';
    lyoCurrentQ.opts.forEach(opt=>{const btn=document.createElement('button');btn.className='lopt-btn';btn.textContent=opt;btn.onclick=()=>lyoAnswer(opt);grid.appendChild(btn);});
  }else{
    // fw: override fi_endings with full-word versions
    if(lyoGameMode==='fw'){
      lyoCurrentQ.fi_endings=lyoCurrentQ.fw_ends;
      lyoCurrentQ.fi_correct=lyoCurrentQ.fw_correct;
    }
    const stemEl=document.getElementById('lyo-stem');
    if(stemEl){
      if(lyoGameMode==='fw'){stemEl.style.display='none';}
      else{stemEl.style.display='';stemEl.textContent=lyoCurrentQ.stem;}
    }
    const inp=document.getElementById('lyo-fi-input');
    if(inp){
      inp.value='';inp.disabled=false;inp.className='';
      if(lyoGameMode==='fw'){
        inp.style.borderRadius='8px';inp.style.minWidth='220px';inp.placeholder='Γράψε ολόκληρο τον τύπο';
      }else{
        inp.style.borderRadius='';inp.style.minWidth='';inp.placeholder='κατάληξη';
      }
      inp.focus();
    }
    const sub=document.getElementById('lyo-fi-submit');if(sub)sub.disabled=false;
    // reset dead key
    lyoActiveDiacritic=null;
    document.querySelectorAll('.lpoly-dkey').forEach(b=>b.classList.remove('ldkey-active'));
    lyoRenderVowelKeys();
  }
}
function lyoAnswer(chosen){
  if(lyoState.answering)return;lyoState.answering=true;
  const acc=lyoCurrentQ.endings,ok=acc.includes(chosen);
  document.querySelectorAll('#lyo-opts .lopt-btn').forEach(b=>{b.disabled=true;if(acc.includes(b.textContent))b.classList.add('lcorrect');else if(b.textContent===chosen&&!ok)b.classList.add('lwrong');});
  const fb=document.getElementById('lyo-fb');
  if(ok){lyoState.score++;if(fb){fb.textContent='✓ Σωστό!';fb.className='lfeedback lok';}}
  else{if(fb){fb.textContent=`✗ Λάθος — σωστή κατάληξη: ${lyoCurrentQ.correct}`;fb.className='lfeedback lerr';}lyoState.mistakes.push({qt:lyoCurrentQ.qt,typed:chosen,correct:lyoCurrentQ.correct,stem:lyoCurrentQ.stem});if(typeof logStudentMistake==='function')logStudentMistake('lyo','archaia','verbs-lyo',{q:lyoCurrentQ.qt,a:lyoCurrentQ.correct},chosen);const _m=lyoCurrentQ._wrongMetaMap?.[chosen];if(window.GE_CERBERUS_QUEUE&&_m)window.GE_CERBERUS_QUEUE.push({gameId:'lyo',subjectId:'ancient-greek',qt:lyoCurrentQ.qt,chosen,correct:lyoCurrentQ.correct,error_metadata:_m,ts:Date.now()});if(lyoState.lives!==Infinity){lyoState.lives--;lyoHUD();if(lyoState.lives<=0){lyoState.pendingTimeout=setTimeout(()=>lyoEnd(),1200);return;}}}
  lyoHUD();lyoState.pendingTimeout=setTimeout(()=>lyoNextQ(),1500);
}
function lyoSubmitFI(){
  if(lyoState.answering)return;
  const inp=document.getElementById('lyo-fi-input');if(!inp)return;
  const typed=inp.value.trim();if(!typed){inp.focus();return;}
  lyoState.answering=true;
  const acc=lyoCurrentQ.fi_endings,ok=acc.includes(typed);
  inp.disabled=true;const sub=document.getElementById('lyo-fi-submit');if(sub)sub.disabled=true;
  inp.classList.add(ok?'lcorrect':'lwrong');
  const fb=document.getElementById('lyo-fb');
  if(ok){lyoState.score++;if(fb){fb.textContent='✓ Σωστό!';fb.className='lfeedback lok';}}
  else{
    const lbl=lyoGameMode==='fw'?'σωστός τύπος':'σωστή κατάληξη';
    if(fb){fb.innerHTML=`✗ Λάθος — ${lbl}: <strong>${lyoCurrentQ.fi_correct}</strong>`;fb.className='lfeedback lerr';}
    lyoState.mistakes.push({qt:lyoCurrentQ.qt,typed,correct:lyoCurrentQ.fi_correct,stem:lyoGameMode==='fw'?'':lyoCurrentQ.stem});
    if(typeof logStudentMistake==='function')logStudentMistake('lyo','archaia','verbs-lyo',{q:lyoCurrentQ.qt,a:lyoCurrentQ.fi_correct},typed);
    const _m=lyoCurrentQ._wrongMetaMap?.[typed];if(window.GE_CERBERUS_QUEUE&&_m)window.GE_CERBERUS_QUEUE.push({gameId:'lyo',subjectId:'ancient-greek',qt:lyoCurrentQ.qt,chosen:typed,correct:lyoCurrentQ.fi_correct,error_metadata:_m,ts:Date.now()});
    if(lyoState.lives!==Infinity){lyoState.lives--;lyoHUD();if(lyoState.lives<=0){lyoState.pendingTimeout=setTimeout(()=>lyoEnd(),1400);return;}}
  }
  lyoHUD();lyoState.pendingTimeout=setTimeout(()=>lyoNextQ(),1600);
}
function lyoRetry() { lyoShow('lyo-screen-settings'); }

// ══════════════════════════════════════
// CHRONO MODE (Χρονική Αντικατάσταση)
// ══════════════════════════════════════
let lyoChronoSubmitted = false;

function lyoChronoBuildKB(){
  // Build a second keyboard instance targeting the chrono inputs
  const diacRow = document.getElementById('lyo-cdiac-row');
  const vowelRows = document.getElementById('lyo-cvowel-rows');
  if (!diacRow || !vowelRows) return;
  diacRow.innerHTML = '';
  LYO_DIACRITICS.forEach(d => {
    const btn = document.createElement('button');
    btn.className = 'lpoly-dkey'; btn.id = 'lyo-cdkey-' + d.id;
    btn.innerHTML = `<span style="font-size:1.1rem;">${d.label}</span><span class="ldkey-label">${d.hint}</span>`;
    btn.onclick = () => lyoToggleDiacritic(d.id);
    diacRow.appendChild(btn);
  });
  const vowels = ['α','ε','η','ι','ο','υ','ω'];
  vowelRows.innerHTML = '';
  vowels.forEach(v => {
    const row = document.createElement('div'); row.className = 'lpoly-vowel-row';
    const label = document.createElement('div'); label.className = 'lpoly-vlabel'; label.textContent = v; row.appendChild(label);
    const keys = document.createElement('div'); keys.className = 'lpoly-vkeys'; keys.id = 'lyo-cvkeys-' + v;
    const plain = document.createElement('button'); plain.className = 'lpoly-vkey';
    plain.textContent = v; plain.title = v; plain.onclick = () => lyoVowelClick(v);
    keys.appendChild(plain); row.appendChild(keys); vowelRows.appendChild(row);
  });
}

function lyoToggleCKB(){
  document.getElementById('lyo-cpoly-toggle')?.classList.toggle('open');
  document.getElementById('lyo-cpoly-body')?.classList.toggle('open');
}

const LYO_TENSE_ORDER=['ενεστώτας','παρατατικός','μέλλοντας','αόριστος','παρακείμενος','υπερσυντέλικος'];

function lyoChronoNextQ(){
  lyoChronoSubmitted = false;
  const filter = lyoState.filter;
  // Restrict to indicative for meaningful tense comparison; fall back to whatever moods exist
  const availMoods = filter.moods.includes('οριστική') ? ['οριστική'] : filter.moods;
  const availVoices = filter.voices;
  const availForms = filter.forms.filter(f => LP.includes(f));
  if (!availForms.length || !availVoices.length || !availMoods.length) { lyoEnd(); return; }

  let combo = null, comboTenseKeys = [];
  for (let attempt = 0; attempt < 30; attempt++) {
    const voice = availVoices[Math.floor(Math.random() * availVoices.length)];
    const mood  = availMoods[Math.floor(Math.random() * availMoods.length)];
    const form  = availForms[Math.floor(Math.random() * availForms.length)];
    const tenseKeys = filter.tenses.map(tense => {
      const k = `${form}|${voice}|${mood}|${tense}`;
      return LYO_G[k] ? k : null;
    }).filter(Boolean);
    if (tenseKeys.length >= 2) { combo = {voice, mood, form}; comboTenseKeys = tenseKeys; break; }
  }
  if (!combo) { lyoEnd(); return; }

  // Sort keys by standard tense order
  const sortedKeys = [...comboTenseKeys].sort((a,b)=>{
    const ta=LYO_G[a].tense, tb=LYO_G[b].tense;
    const ia=LYO_TENSE_ORDER.indexOf(ta), ib=LYO_TENSE_ORDER.indexOf(tb);
    return (ia<0?99:ia)-(ib<0?99:ib);
  });
  const givenIdx = Math.floor(Math.random() * comboTenseKeys.length);
  const givenKey = comboTenseKeys[givenIdx];
  const givenG = LYO_G[givenKey];
  const toFillKeys = sortedKeys.filter(k => k !== givenKey);
  lyoState.currChrono = {combo, givenG, toFillKeys};

  const container = document.getElementById('lyo-chrono-container');
  if (!container) return;

  // Build unified table — given tense in-place, highlighted
  let fillIdx = 0;
  const rowsHTML = sortedKeys.map(k => {
    const g = LYO_G[k];
    const stem = lyoGetStem(g);
    const hasStem = stem.endsWith('-');
    if (k === givenKey) {
      return `<div class="lyo-chrono-row lyo-chrono-given-row">
        <div class="lyo-chrono-tense">${g.tense}</div>
        <div class="lyo-chrono-input-wrap">
          ${hasStem ? `<span class="lyo-chrono-stem lyo-chrono-given-stem">${stem}</span>` : ''}
          <span class="lyo-chrono-given-val${hasStem ? '' : ' no-stem'}">${g.endings[0]}</span>
        </div>
      </div>`;
    } else {
      const idx = fillIdx++;
      return `<div class="lyo-chrono-row" data-idx="${idx}">
        <div class="lyo-chrono-tense">${g.tense}</div>
        <div class="lyo-chrono-input-wrap">
          ${hasStem ? `<span class="lyo-chrono-stem">${stem}</span>` : ''}
          <input class="lyo-chrono-inp${hasStem ? '' : ' no-stem'}" data-idx="${idx}" data-key="${k}"
            autocomplete="off" autocorrect="off" spellcheck="false"
            placeholder="${hasStem ? 'κατάληξη' : 'τύπος'}">
        </div>
      </div>`;
    }
  }).join('');

  container.innerHTML = `
    <div class="lq-tags" style="justify-content:flex-start;margin-bottom:12px;">
      <span class="lq-tag voice">${combo.voice} Φωνή</span>
      <span class="lq-tag mood">${combo.mood}</span>
      <span class="lq-tag form">${combo.form}</span>
    </div>
    <div class="lyo-chrono-table">${rowsHTML}</div>
    <button class="lbtn lbtn-primary" id="lyo-chrono-submit-btn">Υποβολή →</button>
    <div class="lfeedback" id="lyo-chrono-fb"></div>`;

  container.querySelectorAll('.lyo-chrono-inp').forEach((inp, i) => {
    inp.addEventListener('focus', () => { lyoLastInput = inp; lyoActiveDiacritic = null; lyoRenderVowelKeys(); });
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        const next = container.querySelector(`.lyo-chrono-inp[data-idx="${i+1}"]`);
        if (next) next.focus(); else lyoChronoSubmit();
      }
    });
  });
  document.getElementById('lyo-chrono-submit-btn').onclick = lyoChronoSubmit;
  setTimeout(() => { const first = container.querySelector('.lyo-chrono-inp'); if(first){lyoLastInput=first;first.focus();} }, 80);
}

function lyoChronoSubmit(){
  if (lyoChronoSubmitted) return; lyoChronoSubmitted = true;
  const {combo, toFillKeys} = lyoState.currChrono;
  let correct = 0;
  const container = document.getElementById('lyo-chrono-container');
  container.querySelectorAll('.lyo-chrono-inp').forEach((inp, i) => {
    inp.disabled = true;
    const key = inp.dataset.key;
    const g = LYO_G[key];
    const typed = inp.value.trim();
    const accepted = g.fi_endings || g.endings;
    const ok = accepted.includes(typed);
    if (ok) {
      correct++; inp.classList.add('lcorrect');
    } else {
      inp.classList.add('lwrong');
      const row = inp.closest('.lyo-chrono-row');
      if (row) {
        const hint = document.createElement('div'); hint.className = 'lyo-chrono-hint';
        hint.innerHTML = `<span style="color:#e67e6a">${typed || '—'}</span> → <span style="color:#5dca8a">${accepted[0]}</span>`;
        row.appendChild(hint);
      }
      const stem = lyoGetStem(g);
      lyoState.mistakes.push({qt:`Χρονική — ${combo.voice} / ${combo.mood} / ${combo.form}`, typed, correct:accepted[0], stem:stem.endsWith('-')?stem:''});
      if(typeof logStudentMistake==='function')logStudentMistake('lyo','archaia','verbs-lyo-chrono',{q:`Χρονική Αντικατάσταση — ${combo.voice} / ${combo.mood} / ${combo.form}: ${stem}?`,a:accepted[0]},typed||'—');
    }
  });
  lyoState.score += correct;
  if (lyoState.lives !== Infinity && correct < toFillKeys.length)
    lyoState.lives = Math.max(0, lyoState.lives - (toFillKeys.length - correct));
  lyoHUD();
  const fb = document.getElementById('lyo-chrono-fb');
  if (fb) { const all = correct === toFillKeys.length; fb.textContent = all ? '✓ Τέλεια! Όλα σωστά!' : `${correct}/${toFillKeys.length} σωστά`; fb.className = 'lfeedback ' + (all ? 'lok' : 'lerr'); }
  const btn = document.getElementById('lyo-chrono-submit-btn');
  if (btn) { btn.textContent = 'Επόμενο ρήμα →'; btn.onclick = () => { if(lyoState.lives <= 0){lyoEnd();return;} lyoChronoNextQ(); }; }
  if (lyoState.lives <= 0) lyoState.pendingTimeout = setTimeout(() => lyoEnd(), 1800);
}

function lyoEnd(){
  clearInterval(lyoState.timerInterval);if(lyoState.pendingTimeout)clearTimeout(lyoState.pendingTimeout);
  // Save progress to localStorage
  if(lyoCurrentLevelId){
    try{
      const pkey=`lyo_prog_${lyoCurrentLevelId}`;
      const prev=JSON.parse(localStorage.getItem(pkey)||'{}');
      const completed=lyoState.mistakes.length===0&&lyoState.score>0;
      localStorage.setItem(pkey,JSON.stringify({best:Math.max(lyoState.score,prev.best||0),completed:prev.completed||completed,ts:Date.now()}));
      lyoBuildGrid();
    }catch(e){}
  }
  const es=document.getElementById('lyo-es');if(es)es.textContent=lyoState.score;
  const ed=document.getElementById('lyo-ed');if(ed)ed.textContent='Τελική βαθμολογία';
  const log=document.getElementById('lyo-mistakes-log');
  if(log){
    if(!lyoState.mistakes.length){log.innerHTML='<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>';}
    else{let h=`<div class="lmistakes-hdr">Λάθη: ${lyoState.mistakes.length}</div><div class="lmistakes-list">`;lyoState.mistakes.forEach(m=>{const tmp=document.createElement('div');tmp.innerHTML=m.qt;const main=tmp.querySelector('.lq-main');const qtxt=main?main.textContent:m.qt.replace(/<[^>]+>/g,' ');const tags=[...tmp.querySelectorAll('.lq-tag')].map(el=>el.textContent).join(' · ');h+=`<div class="lmistake-row"><div class="lm-q">${qtxt}</div><div style="font-size:0.72rem;color:#8a7a60;margin:2px 0 5px;">${tags}</div><div class="lm-ans"><span class="lm-wrong">${m.stem||''}${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.stem||''}${m.correct}</span></div></div>`;});h+='</div>';log.innerHTML=h;}
  }
  lyoShow('lyo-screen-end');
}
window.LYO_LVL = LYO_LVL;
