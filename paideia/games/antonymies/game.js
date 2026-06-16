// ============================================================
//  ΑΝΤΩΝΥΜΙΕΣ — Game Controller
//  Depends on: antonymies/data.js, shared-engine.js
// ============================================================

function openAntonymies() {
  document.getElementById('ant-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('ant-screen-levels')) _antBuild();
}
function closeAntonymies() {
  _antToLevels();
  document.getElementById('ant-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// ── Level definitions ─────────────────────────────────────────
const ANT_LEVELS = [
  // Προσωπικές
  {id:1,  group:'Προσωπικές',      color:'lgreen',  desc:'ἐγώ / σύ — 1ο & 2ο πρόσ. ενικός',      sub:['egw_sy']},
  {id:2,  group:'Προσωπικές',      color:'lyellow', desc:'ἡμεῖς / ὑμεῖς — 1ο & 2ο πρόσ. πληθ.', sub:['imeis_ymeis']},
  {id:3,  group:'Προσωπικές',      color:'lyellow', desc:'αὐτός — 3ο πρόσωπο / εμφατική',         sub:['aytos_pr']},
  {id:4,  group:'Προσωπικές',      color:'lred',    desc:'Προσωπικές — Όλες',                     sub:['prosopiki']},
  // Δεικτικές
  {id:5,  group:'Δεικτικές',       color:'lgreen',  desc:'οὗτος — αὕτη — τοῦτο',                 sub:['oytos']},
  {id:6,  group:'Δεικτικές',       color:'lyellow', desc:'ἐκεῖνος — ἐκείνη — ἐκεῖνο',            sub:['ekeinos']},
  {id:7,  group:'Δεικτικές',       color:'lyellow', desc:'ὅδε — ἥδε — τόδε',                      sub:['ode']},
  {id:8,  group:'Δεικτικές',       color:'lred',    desc:'Δεικτικές — Όλες',                      sub:['deiktiki']},
  // Αυτοπαθείς
  {id:9,  group:'Αυτοπαθείς',      color:'lgreen',  desc:'ἐμαυτοῦ / σεαυτοῦ — 1ο & 2ο πρόσ.',   sub:['emaut_seaut']},
  {id:10, group:'Αυτοπαθείς',      color:'lyellow', desc:'ἑαυτοῦ — 3ο πρόσωπο',                  sub:['eautou']},
  {id:11, group:'Αυτοπαθείς',      color:'lred',    desc:'Αυτοπαθείς — Όλες',                    sub:['aytopathitiki']},
  // Αναφορικές / Ερωτηματικές / Αόριστες
  {id:12, group:'Αναφορικές & Λοιπές', section:'Αναφορικές',      color:'lgreen',  desc:'ὅς — ἥ — ὅ (αναφορική αντωνυμία)',     sub:['anaforiki']},
  {id:13, group:'Αναφορικές & Λοιπές', section:'Ερωτηματικές',    color:'lyellow', desc:'τίς — τί (ερωτηματική αντωνυμία)',      sub:['erotim']},
  {id:14, group:'Αναφορικές & Λοιπές', section:'Αόριστες',        color:'lyellow', desc:'τις — τι (αόριστη αντωνυμία)',          sub:['aoristologi']},
  // Κτητικές
  {id:15, group:'Κτητικές',        color:'lgreen',  desc:'ἐμός / σός — κτητικές 1ου & 2ου προσ.',sub:['emos_sos']},
  {id:16, group:'Κτητικές',        color:'lyellow', desc:'ἡμέτερος / ὑμέτερος — κτητικές πληθ.', sub:['imetr_ymetr']},
  {id:17, group:'Κτητικές',        color:'lred',    desc:'Κτητικές — Όλες',                      sub:['ktitiki']},
  // Special
  {id:18, group:'Σύνθετα', section:'Μεταφραστικό',    color:'lpurple', desc:'Βρες την αρχαία ελληνική λέξη',         sub:['transl']},
  {id:19, group:'Συνδυαστικό',color:'lred',    desc:'Όλες οι Αντωνυμίες μαζί',              sub:['all']},
];

// ── Filter ANT_DB entries by sub codes ───────────────────────
function _antFilterEntries(subs) {
  if (subs.includes('all')) return Object.values(ANT_DB);
  const result = [];
  const seen = new Set();
  const all = Object.values(ANT_DB);
  const add = arr => arr.forEach(e => { if (!seen.has(e.id)) { seen.add(e.id); result.push(e); } });

  for (const s of subs) {
    switch (s) {
      case 'egw_sy':        add(all.filter(e=>e.type==='prosopiki'&&(e.lemma==='ἐγώ'||e.lemma==='σύ'))); break;
      case 'imeis_ymeis':   add(all.filter(e=>e.type==='prosopiki'&&(e.lemma==='ἡμεῖς'||e.lemma==='ὑμεῖς'))); break;
      case 'aytos_pr':      add(all.filter(e=>e.type==='prosopiki'&&e.lemma==='αὐτός')); break;
      case 'prosopiki':     add(all.filter(e=>e.type==='prosopiki')); break;
      case 'oytos':         add(all.filter(e=>e.type==='deiktiki'&&e.lemma==='οὗτος')); break;
      case 'ekeinos':       add(all.filter(e=>e.type==='deiktiki'&&e.lemma==='ἐκεῖνος')); break;
      case 'ode':           add(all.filter(e=>e.type==='deiktiki'&&e.lemma==='ὅδε')); break;
      case 'deiktiki':      add(all.filter(e=>e.type==='deiktiki')); break;
      case 'emaut_seaut':   add(all.filter(e=>e.type==='aytopathitiki'&&(e.lemma==='ἐμαυτοῦ'||e.lemma==='σεαυτοῦ'))); break;
      case 'eautou':        add(all.filter(e=>e.type==='aytopathitiki'&&e.lemma==='ἑαυτοῦ')); break;
      case 'aytopathitiki': add(all.filter(e=>e.type==='aytopathitiki')); break;
      case 'anaforiki':     add(all.filter(e=>e.type==='anaforiki')); break;
      case 'erotim':        add(all.filter(e=>e.type==='erotim')); break;
      case 'aoristologi':   add(all.filter(e=>e.type==='aoristologi')); break;
      case 'emos_sos':      add(all.filter(e=>e.type==='ktitiki'&&(e.lemma==='ἐμός'||e.lemma==='σός'))); break;
      case 'imetr_ymetr':   add(all.filter(e=>e.type==='ktitiki'&&(e.lemma==='ἡμέτερος'||e.lemma==='ὑμέτερος'))); break;
      case 'ktitiki':       add(all.filter(e=>e.type==='ktitiki')); break;
      case 'transl': break; // handled separately
      default: break;
    }
  }
  return result;
}

// ── State ─────────────────────────────────────────────────────
let _antMode = 'mc';
let _antState = null;
let _antLastSelIds = [];

// ── Build all screens ─────────────────────────────────────────
function _antBuild() {
  document.getElementById('ant-wrap').innerHTML = `
<div id="ant-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Αντωνυμίες</h1>
    <p class="lsubtitle">Αρχαία Ελληνικά — Προσωπικές, Δεικτικές, Αυτοπαθείς, Αναφορικές, Κτητικές κ.ά.</p>
    <button class="game-share-btn" onclick="showQR('Αντωνυμίες',{nav:'game',id:'ant'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="ant-level-grid"></div>
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:16px;">
      <div style="display:none;">
        <select id="ant-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option>
          <option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option>
          <option value="0">∞ χρόνος</option>
        </select>
        <select id="ant-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option>
          <option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option>
          <option value="0">∞ ζωές</option>
        </select>
        <select id="ant-sel-mode" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="" disabled selected>— τρόπος —</option>
          <option value="mc">Πολλ. Επιλογή</option>
          <option value="fi">Συμπλήρωση</option>
          <option value="match">🔗 Αντιστοίχιση</option>
          <option value="transl">🌐 Μεταφραστικό</option>
        </select>
      </div>
      <button id="ant-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="antOpenSettings()">✓ Διάλεξε επίπεδο →</button>
    </div>
  </div>
</div>

<div id="ant-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="ant-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="ant-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="ant-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_antEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="ant-q"><div class="lq-main">Φόρτωση...</div></div>
    <div class="lfeedback" id="ant-fb"></div>
    <div id="ant-mc-area" class="lopts-grid" style="display:none;"></div>
    <div id="ant-fi-area" style="display:none;">
      <div style="text-align:center;margin-bottom:14px;">
        <input type="text" id="ant-fi-input" autocomplete="off" autocorrect="off" spellcheck="false"
          placeholder="πληκτρολογήστε..."
          style="font-family:'Noto Serif',serif;font-size:1.8rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:8px;color:#e8c87a;width:100%;max-width:300px;outline:none;text-align:center;caret-color:#c9a44a;">
      </div>
      <button class="lfi-submit" id="ant-fi-submit" onclick="antSubmitFI()">Υποβολή ↵</button>
      <div class="lpoly-kb" style="margin-top:10px;">
        <button class="lpoly-toggle" id="ant-poly-toggle" onclick="gramToggleKB('ant')">
          <span>Πολυτονικό Πληκτρολόγιο</span><span class="lpoly-arrow">▼</span>
        </button>
        <div class="lpoly-body" id="ant-poly-body">
          <div class="lpoly-diac-row" id="ant-diac-row"></div>
          <div id="ant-vowel-rows"></div>
        </div>
      </div>
    </div>
  </div>
</div>

<div id="ant-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="ant-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="ant-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_antRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_antToLevels()">Επίπεδα</button>
    </div>
  </div>
</div>

<div id="ant-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="ant-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="ant-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('ant')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="ant-match-body"></div>
    <div class="lfeedback" id="ant-match-fb"></div>
  </div>
</div>`;

  // ── Build level grid ────────────────────────────────────────
  gramBuildSubPicker('ant', ANT_LEVELS, { selClass: 'ant-sel', onToggle: d => {
    // Auto-switch mode to transl when Μεταφραστικό is toggled on
    if (JSON.parse(d.dataset.subs || '[]').includes('transl')) {
      const mSel = document.getElementById('ant-sel-mode');
      if (mSel && d.classList.contains('ant-sel')) { mSel.value = 'transl'; mSel.dispatchEvent(new Event('change', { bubbles: true })); }
    }
    _antUpdateStartBtn();
  }});

  document.getElementById('ant-fi-input').onkeydown = e => { if (e.key === 'Enter') antSubmitFI(); };
  document.getElementById('ant-sel-mode').addEventListener('change', _antUpdateStartBtn);
  gramBuildKeyboard('ant');
}

function _antUpdateStartBtn() {
  const sel = document.querySelectorAll('#ant-level-grid .lvl-card.ant-sel');
  const mode = document.getElementById('ant-sel-mode')?.value;
  const btn = document.getElementById('ant-start-btn');
  if (!btn) return;
  if (sel.length > 0) {
    btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
    btn.textContent = siteLang === 'en' ? `Start (${sel.length} lvl) →` : `Έναρξη (${sel.length} επ.) →`;
  } else {
    btn.style.opacity = '.5'; btn.style.pointerEvents = 'none';
    btn.textContent = siteLang === 'en' ? '✓ Select level & mode →' : '✓ Επίπεδο & τρόπος →';
  }
}

// ── Screen navigation ─────────────────────────────────────────
function _antShowScreen(id) {
  document.querySelectorAll('#ant-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}
function _antToLevels() {
  if (_antState) {
    clearInterval(_antState.timerInterval);
    if (_antState.pendingTimeout) clearTimeout(_antState.pendingTimeout);
    _antState.timerInterval = null; _antState.pendingTimeout = null;
  }
  _antShowScreen('ant-screen-levels');
}
function _antRetry() {
  if (_antState) {
    _antState.score = 0;
    _antState.lives = _antState.lives === Infinity ? Infinity : parseInt(document.getElementById('ant-sel-lives')?.value || 3);
    _antState.timerRemaining = _antState.timer;
    _antState.mistakes = []; _antState.answering = false;
    if (_antState.pendingTimeout) clearTimeout(_antState.pendingTimeout);
    clearInterval(_antState.timerInterval);
    if (_antState.mode === 'transl') _antState.translPool = _antShuffle([...ANT_TRANSL]);
    _antShowScreen('ant-screen-game'); _antHUD();
    if (_antState.timer > 0) _antStartTimer();
    antNext();
  } else { _antToLevels(); }
}

// ── Launch ────────────────────────────────────────────────────
function antOpenSettings(){
  if(!document.querySelectorAll('#ant-level-grid .lvl-card.ant-sel').length) return;
  gramOpenQuizSettings('ant', { title:'Κλίση Αντωνυμιών', datasetId:'antonymies',
    modes:[
      {id:'mc',     label:'Πολλαπλή Επιλογή', hint:'Επίλεξε από 4 επιλογές'},
      {id:'fi',     label:'Συμπλήρωση Κενού', hint:'Γράψε τον τύπο'},
      {id:'match',  label:'Αντιστοίχιση',     hint:'Αντιστοίχισε τύπο με μορφή'},
      {id:'transl', label:'Μεταφραστικό',     hint:'Βρες την αρχαία λέξη'},
    ],
    onLaunch: antLaunch, onClose: closeAntonymies });
}
function antLaunch() {
  const selCards = document.querySelectorAll('#ant-level-grid .lvl-card.ant-sel');
  if (!selCards.length) return;
  _antLastSelIds = [...selCards].map(c => +c.dataset.lvlId).filter(Boolean);

  const allSubs = [];
  selCards.forEach(c => {
    JSON.parse(c.dataset.subs || '[]').forEach(s => { if (!allSubs.includes(s)) allSubs.push(s); });
  });

  const m = document.getElementById('ant-sel-mode').value;
  _antMode = m;

  // ── Match mode ────────────────────────────────────────────
  if (m === 'match') {
    if (_antState) { clearInterval(_antState.timerInterval); if (_antState.pendingTimeout) clearTimeout(_antState.pendingTimeout); }
    const active = _antFilterEntries(allSubs);
    if (!active.length) { alert('Δεν βρέθηκαν αντωνυμίες.'); return; }
    const isEn = siteLang === 'en';
    const matchG = {};
    active.forEach(e => {
      const typeL  = isEn ? e.type : (ANT_TYPE_LABELS[e.type] || e.type);
      const caseI  = ANT_CASES.indexOf(e.ptosi);
      const caseLbl = isEn ? (ANT_CASES_EN[caseI] || e.ptosi) : e.ptosi;
      const numLbl  = isEn ? (e.arithmos === 'ενικός' ? 'Sg' : 'Pl') : (e.arithmos === 'ενικός' ? 'Εν.' : 'Πληθ.');
      const genMap  = {αρσενικό:'m', θηλυκό:'f', ουδέτερο:'n'};
      const genLbl  = e.genos ? (isEn ? genMap[e.genos] || e.genos : e.genos) : '';
      matchG[e.id] = {
        endings: e.endings, fi_endings: e.fi_endings,
        _qt: `<div class="lq-main">${e.lemma}</div><div class="lq-tags"><span class="lq-tag voice">${caseLbl}</span><span class="lq-tag tense">${numLbl}</span>${genLbl ? `<span class="lq-tag mood">${genLbl}</span>` : ''}<span class="lq-tag person">${typeL}</span></div>`
      };
    });
    if (!Object.keys(matchG).length) { alert('Δεν βρέθηκαν αντωνυμίες.'); return; }
    _gramMatchDoneHook['ant']=(st)=>{_antLastSelIds.forEach(id=>{try{const pkey=`ant_prog_${id}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');const data={best:Math.max(st.total,prev.best||0),completed:true,ts:Date.now()};localStorage.setItem(pkey,JSON.stringify(data));const card=document.querySelector(`#ant-level-grid .lvl-card[data-lvl-id="${id}"]`);if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className='lvl-badge lvl-badge-done';b.textContent='✓ '+data.best+'πτ';}}catch(e){}});};
    gramStartMatch('ant', matchG, () => Object.keys(matchG), () => '', g => g._qt, null, 'ant-wrap');
    return;
  }

  const t = parseInt(document.getElementById('ant-sel-time').value);
  const l = parseInt(document.getElementById('ant-sel-lives').value);

  // ── Translation mode ──────────────────────────────────────
  if (m === 'transl') {
    _antState = {
      score: 0, lives: l === 0 ? Infinity : l,
      timer: t, timerRemaining: t, timerInterval: null,
      answering: false, pendingTimeout: null,
      active: null, curr: null, mistakes: [],
      mode: 'transl', translPool: _antShuffle([...ANT_TRANSL])
    };
    document.getElementById('ant-mc-area').style.display = 'grid';
    document.getElementById('ant-fi-area').style.display = 'none';
    _antShowScreen('ant-screen-game'); _antHUD();
    if (t > 0) _antStartTimer();
    antNext();
    return;
  }

  // ── Standard mc / fi ─────────────────────────────────────
  const active = _antFilterEntries(allSubs);
  if (!active.length) { alert('Δεν βρέθηκαν αντωνυμίες.'); return; }
  _antState = {
    score: 0, lives: l === 0 ? Infinity : l,
    timer: t, timerRemaining: t, timerInterval: null,
    answering: false, pendingTimeout: null,
    active, curr: null, mistakes: [], mode: m
  };
  document.getElementById('ant-mc-area').style.display = m === 'mc' ? 'grid' : 'none';
  document.getElementById('ant-fi-area').style.display  = m === 'fi'  ? 'block' : 'none';
  _antShowScreen('ant-screen-game'); _antHUD();
  if (t > 0) _antStartTimer();
  antNext();
}

// ── Timer ─────────────────────────────────────────────────────
function _antStartTimer() {
  _antState.timerInterval = setInterval(() => {
    _antState.timerRemaining--;
    const tv = document.getElementById('ant-tv');
    if (tv) {
      tv.textContent = _gramFmtSec(_antState.timerRemaining);
      tv.classList.toggle('ltimer-warn',  _antState.timerRemaining <= 10);
      tv.classList.toggle('ltimer-caut',  _antState.timerRemaining <= 20 && _antState.timerRemaining > 10);
    }
    if (_antState.timerRemaining <= 0) _antEndGame();
  }, 1000);
}

// ── HUD ───────────────────────────────────────────────────────
function _antHUD() {
  const sv = document.getElementById('ant-sv'); if (sv) sv.textContent = _antState.score;
  const lv = document.getElementById('ant-lv');
  if (lv) {
    if (_antState.lives === Infinity) { lv.textContent = '∞'; lv.style.fontSize = '1.4rem'; }
    else lv.innerHTML = Array(_antState.lives).fill('❤️').join('') || '💀';
  }
  const tv = document.getElementById('ant-tv');
  if (tv) { if (_antState.timer === 0) { tv.textContent = '∞'; tv.classList.remove('ltimer-warn', 'ltimer-caut'); }
  else { tv.textContent = _gramFmtSec(_antState.timerRemaining); } }
}

// ── Next question ─────────────────────────────────────────────
function antNext() {
  _antState.answering = false;
  const fb = document.getElementById('ant-fb');
  if (fb) { fb.textContent = ''; fb.className = 'lfeedback'; }

  // Translation mode — show Ancient Greek form, pick the modern Greek meaning
  if (_antState.mode === 'transl') {
    if (!_antState.translPool.length) _antState.translPool = _antShuffle([...ANT_TRANSL]);
    const entry = _antState.translPool.pop();
    _antState.curr = { transl: entry };
    const [, greek, ctxLabel, , , correctGr, wrongGr = []] = entry;
    const fallbackWrong = wrongGr.length < 3
      ? _antShuffle(ANT_TRANSL.filter(e => e[0] !== entry[0] && e[5]).map(e => e[5])).slice(0, 3 - wrongGr.length)
      : [];
    const opts = _antShuffle([correctGr, ...[...wrongGr, ...fallbackWrong].slice(0, 3)]);
    document.getElementById('ant-q').innerHTML =
      `<div class="lq-main" style="font-size:2rem;">${greek}</div>` +
      `<div class="lq-tags"><span class="lq-tag voice">${ctxLabel}</span><span class="lq-tag tense" style="opacity:.7;">→ νέα ελληνικά</span></div>`;
    const grid = document.getElementById('ant-mc-area'); grid.innerHTML = '';
    opts.forEach(opt => {
      const b = document.createElement('button'); b.className = 'lopt-btn'; b.textContent = opt;
      b.onclick = () => antAnswer(opt);
      grid.appendChild(b);
    });
    return;
  }

  // Standard modes
  const e = _antState.active[Math.floor(Math.random() * _antState.active.length)];
  _antState.curr = { entry: e };
  const isEn   = siteLang === 'en';
  const typeL  = isEn ? e.type : (ANT_TYPE_LABELS[e.type] || e.type);
  const caseI  = ANT_CASES.indexOf(e.ptosi);
  const caseLbl = isEn ? (ANT_CASES_EN[caseI] || e.ptosi) : e.ptosi;
  const numLbl  = isEn ? (e.arithmos === 'ενικός' ? 'Ενικός' : 'Πληθυντικός') : e.arithmos;
  const genLbl  = e.genos || '';

  document.getElementById('ant-q').innerHTML =
    `<div class="lq-main" style="font-size:1.25rem;text-align:center;margin-bottom:8px;"><em>${e.lemma}</em></div>` +
    `<div class="lq-tags">` +
    `<span class="lq-tag voice">${caseLbl}</span>` +
    `<span class="lq-tag tense">${numLbl}</span>` +
    (genLbl ? `<span class="lq-tag mood">${genLbl}</span>` : '') +
    `<span class="lq-tag person">${typeL}</span>` +
    `</div>`;

  if (_antState.mode === 'mc') {
    const grid = document.getElementById('ant-mc-area'); grid.innerHTML = '';
    _antGenOptions(e).forEach(opt => {
      const b = document.createElement('button'); b.className = 'lopt-btn'; b.textContent = opt;
      b.onclick = () => antAnswer(opt);
      grid.appendChild(b);
    });
  } else {
    const inp = document.getElementById('ant-fi-input');
    if (inp) { inp.value = ''; inp.disabled = false; inp.style.borderColor = '#7a6030'; inp.focus(); }
    document.getElementById('ant-fi-submit').disabled = false;
    if (typeof _gramDiac !== 'undefined') _gramDiac['ant'] = null;
    document.querySelectorAll('#ant-diac-row .lpoly-dkey').forEach(b => b.classList.remove('ldkey-active'));
    gramRenderVowels('ant');
  }
}

// ── Distractor generation ─────────────────────────────────────
function _antGenOptions(e) {
  const norm = s => s.trim().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const correctForm = e.form;
  const used = new Set([norm(correctForm)]);
  const opts = [correctForm];
  const _wMetaMap = Object.create(null);
  const push = (f, meta) => {
    if (f && !used.has(norm(f)) && opts.length < 4) {
      opts.push(f); used.add(norm(f));
      if (meta) _wMetaMap[f] = meta;
    }
  };
  const all = Object.values(ANT_DB);

  // 1. Same lemma, different case — best same-lemma trap
  for (const o of _antShuffle(all.filter(o => o.id !== e.id && o.lemma === e.lemma)))
    { if (opts.length >= 4) break; push(o.form, {category:'noun_morphology', mutation_type:'incorrect_case', details:{expected:e.ptosi, selected:o.ptosi, number:e.arithmos}}); }

  // 2. Same type + same case + different lemma
  if (opts.length < 4)
    for (const o of _antShuffle(all.filter(o => o.id !== e.id && o.type === e.type && o.ptosi === e.ptosi && o.arithmos === e.arithmos)))
      { if (opts.length >= 4) break; push(o.form, {category:'noun_morphology', mutation_type:'cross_lemma_case', details:{expected:e.ptosi, distractor_lemma:o.lemma}}); }

  // 3. Same case, any type
  if (opts.length < 4)
    for (const o of _antShuffle(all.filter(o => o.id !== e.id && o.ptosi === e.ptosi)))
      { if (opts.length >= 4) break; push(o.form, {category:'noun_morphology', mutation_type:'cross_lemma_case', details:{expected:e.ptosi, distractor_lemma:o.lemma}}); }

  // 4. Anything from active pool
  if (opts.length < 4)
    for (const o of _antShuffle(_antState.active.filter(o => o.id !== e.id)))
      { if (opts.length >= 4) break; push(o.form, {category:'noun_morphology', mutation_type:'cross_lemma_fallback', details:{distractor_lemma:o.lemma}}); }

  // 5. Absolute fallback — any form
  if (opts.length < 4)
    for (const o of _antShuffle(all.filter(o => o.id !== e.id)))
      { if (opts.length >= 4) break; push(o.form, {category:'noun_morphology', mutation_type:'cross_lemma_fallback', details:{distractor_lemma:o.lemma}}); }

  if (_antState.curr) _antState.curr._wrongMetaMap = _wMetaMap;
  return _antShuffle(opts);
}

function _antShuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const _antNorm = s => s.trim().normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// ── Answer handlers ───────────────────────────────────────────
function antAnswer(chosen) {
  if (_antState.answering) return;
  _antState.answering = true;
  let ok, correctDisplay, qLabel;

  if (_antState.mode === 'transl') {
    const [, greek, ctxLabel, , , correctGr] = _antState.curr.transl;
    ok = chosen.trim() === correctGr.trim();
    correctDisplay = correctGr;
    qLabel = `${greek} (${ctxLabel})`;
  } else {
    const e = _antState.curr.entry;
    ok = e.fi_endings.some(f => _antNorm(chosen) === _antNorm(f));
    correctDisplay = e.form;
    qLabel = `${e.lemma} — ${e.ptosi} ${e.arithmos}`;
  }

  document.querySelectorAll('#ant-mc-area .lopt-btn').forEach(b => {
    b.disabled = true;
    const isCorrect = _antState.mode === 'transl'
      ? b.textContent.trim() === correctDisplay.trim()
      : _antState.curr.entry.fi_endings.some(f => _antNorm(b.textContent) === _antNorm(f));
    if (isCorrect) b.classList.add('lcorrect');
    else if (b.textContent === chosen && !ok) b.classList.add('lwrong');
  });

  const fb = document.getElementById('ant-fb');
  if (ok) {
    _antState.score++;
    if (fb) { fb.textContent = siteLang === 'en' ? '✓ Correct!' : '✓ Σωστό!'; fb.className = 'lfeedback lok'; }
  } else {
    _antState.mistakes.push({ q: qLabel, typed: chosen, correct: correctDisplay });
    if(typeof logStudentMistake==='function') logStudentMistake('antonymies','antonymies','mc',{q:qLabel,a:correctDisplay},chosen);
    if (fb) { fb.innerHTML = (siteLang === 'en' ? `✗ Wrong — correct: <strong>${correctDisplay}</strong>` : `✗ Λάθος — σωστό: <strong>${correctDisplay}</strong>`); fb.className = 'lfeedback lerr'; }
    const _m = _antState.curr?._wrongMetaMap?.[chosen];
    if (window.GE_CERBERUS_QUEUE && _m) window.GE_CERBERUS_QUEUE.push({gameId:'antonymies',subjectId:'ancient-greek',qt:qLabel,chosen,correct:correctDisplay,error_metadata:_m,ts:Date.now()});
    if (_antState.lives !== Infinity) {
      _antState.lives--; _antHUD();
      if (_antState.lives <= 0) { _antState.pendingTimeout = setTimeout(() => _antEndGame(), 1200); return; }
    }
  }
  _antHUD();
  _antState.pendingTimeout = setTimeout(() => antNext(), 1500);
}

function antSubmitFI() {
  if (_antState.answering) return;
  const inp = document.getElementById('ant-fi-input');
  const typed = inp ? inp.value.trim() : '';
  if (!typed) { inp?.focus(); return; }
  _antState.answering = true;
  if (inp) inp.disabled = true;
  document.getElementById('ant-fi-submit').disabled = true;

  const e = _antState.curr.entry;
  // Accept primary form or any documented alt form
  const ok = e.fi_endings.some(f => _antNorm(typed) === _antNorm(f));
  if (inp) inp.style.borderColor = ok ? '#27ae60' : '#c0392b';
  const fb = document.getElementById('ant-fb');
  if (ok) {
    _antState.score++;
    if (fb) { fb.textContent = siteLang === 'en' ? '✓ Correct!' : '✓ Σωστό!'; fb.className = 'lfeedback lok'; }
  } else {
    _antState.mistakes.push({ q: `${e.lemma} — ${e.ptosi} ${e.arithmos}`, typed, correct: e.form });
    if(typeof logStudentMistake==='function') logStudentMistake('antonymies','antonymies','fi',{q:`${e.lemma} — ${e.ptosi} ${e.arithmos}`,a:e.form},typed);
    if (fb) { fb.innerHTML = (siteLang === 'en' ? `✗ Wrong — correct: <strong>${e.form}</strong>` : `✗ Λάθος — σωστό: <strong>${e.form}</strong>`); fb.className = 'lfeedback lerr'; }
    const _m = _antState.curr?._wrongMetaMap?.[typed];
    if (window.GE_CERBERUS_QUEUE && _m) window.GE_CERBERUS_QUEUE.push({gameId:'antonymies',subjectId:'ancient-greek',qt:`${e.lemma} — ${e.ptosi} ${e.arithmos}`,chosen:typed,correct:e.form,error_metadata:_m,ts:Date.now()});
    if (_antState.lives !== Infinity) {
      _antState.lives--; _antHUD();
      if (_antState.lives <= 0) { _antState.pendingTimeout = setTimeout(() => _antEndGame(), 1400); return; }
    }
  }
  _antHUD();
  _antState.pendingTimeout = setTimeout(() => antNext(), 1600);
}

// ── End game ──────────────────────────────────────────────────
function _antEndGame() {
  clearInterval(_antState.timerInterval);
  if (_antState.pendingTimeout) clearTimeout(_antState.pendingTimeout);
  // Save progress per selected level
  if (_antLastSelIds.length) {
    try {
      const completed = _antState.mistakes.length === 0 && _antState.score > 0;
      _antLastSelIds.forEach(id => {
        const k = `ant_prog_${id}`;
        const prev = JSON.parse(localStorage.getItem(k) || '{}');
        localStorage.setItem(k, JSON.stringify({best: Math.max(_antState.score, prev.best||0), completed: prev.completed||completed, ts: Date.now()}));
      });
      // Refresh badges on visible cards
      document.querySelectorAll('#ant-level-grid .lvl-card[data-lvl-id]').forEach(card => {
        const prog = JSON.parse(localStorage.getItem(`ant_prog_${card.dataset.lvlId}`) || 'null');
        const old = card.querySelector('.lvl-badge'); if (old) old.remove();
        if (prog) { const b = document.createElement('div'); b.className = 'lvl-badge'+(prog.completed?' lvl-badge-done':''); b.textContent = (prog.completed?'✓':'↗')+' '+prog.best+'πτ'; card.appendChild(b); }
      });
    } catch(e) {}
  }
  document.getElementById('ant-es').textContent = _antState.score;
  const log = document.getElementById('ant-mistakes-log');
  if (!_antState.mistakes.length) {
    log.innerHTML = `<p style="color:#27ae60;text-align:center;font-style:italic;">${siteLang === 'en' ? 'Perfect! No mistakes! 🎉' : 'Τέλειο! Κανένα λάθος! 🎉'}</p>`;
  } else {
    let h = `<div class="lmistakes-hdr">${siteLang === 'en' ? 'Mistakes' : 'Λάθη'}: ${_antState.mistakes.length}</div><div class="lmistakes-list">`;
    _antState.mistakes.forEach(m => {
      h += `<div class="lmistake-row"><div class="lm-q">${m.q}</div><div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div></div>`;
    });
    h += '</div>';
    log.innerHTML = h;
  }
  _antShowScreen('ant-screen-end');
}
window.ANT_LEVELS = ANT_LEVELS;
