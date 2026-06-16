// ============================================================
//  ΑΦΩΝΟΛΗΚΤΑ — Game Controller
//  Depends on: afwnolekta/data.js, shared-engine.js
// ============================================================

const AFW_PREFIX = 'afw';
let _afwFilter = null;

// Modes for this game: match & chrono removed.
// match → confusing long-label vs single-letter pairs.
// chrono → fails on single-tense levels (no multi-tense groups exist).
const AFW_MODES = [
  {id:'mc',  icon:'🔲', label:'Πολλαπλή Επιλογή',    hint:'Επίλεξε από 4 καταλήξεις'},
  {id:'fi',  icon:'✏️',  label:'Συμπλήρωση Κενού',    hint:'Γράψε τον τύπο μόνος σου'},
  {id:'fw',  icon:'📝',  label:'Ολόκληρος Τύπος',     hint:'Γράψε ολόκληρη τη λέξη'},
  {id:'eq',  icon:'∑',   label:'Φωνητικές Μεταβολές', hint:'κ + σ = ? — Εξάσκηση κανόνων'},
];

// Consonant change rules: stem-final-consonant + suffix → result
const AFW_EQ_RULES = [
  {cat:'ουρανικό', consonants:['κ','γ','χ'], suffix:'σ', result:'ξ'},
  {cat:'χειλικό',  consonants:['π','β','φ'], suffix:'σ', result:'ψ'},
  {cat:'οδοντικό', consonants:['τ','δ','θ','ζ'], suffix:'σ', result:'σ'},
];

// Temporal augment rules: initial vowel → augmented form + example verb
const AFW_AUG_RULES = [
  {initial:'α',  augmented:'η',  verb:'ἀκούω',   impf:'ἤκουον'},
  {initial:'ε',  augmented:'η',  verb:'ἐλπίζω',  impf:'ἤλπιζον'},
  {initial:'αι', augmented:'ῃ',  verb:'αἱρῶ',    impf:'ᾕρουν'},
  {initial:'ει', augmented:'ῃ',  verb:'εἰκάζω',  impf:'ᾔκαζον'},
  {initial:'ο',  augmented:'ω',  verb:'ὁδεύω',   impf:'ὥδευον'},
  {initial:'οι', augmented:'ῳ',  verb:'οἰκτίρω', impf:'ᾤκτιρον'},
  {initial:'αυ', augmented:'ηυ', verb:'αὔξω',    impf:'ηὖξον'},
  {initial:'ευ', augmented:'ηυ', verb:'εὔχομαι', impf:'ηὐχόμην'},
  {initial:'ι',  augmented:'ῑ',  verb:'ἱδρύω',   impf:'ἵδρυον'},
  {initial:'υ',  augmented:'ῡ',  verb:'ὑβρίζω',  impf:'ὕβριζον'},
];
// Reverse lookup: augmented → all valid initials (for Type B questions)
const AFW_AUG_REV = {};
AFW_AUG_RULES.forEach(r => {
  if (!AFW_AUG_REV[r.augmented]) AFW_AUG_REV[r.augmented] = [];
  AFW_AUG_REV[r.augmented].push(r.initial);
});

// Tenses where the stem's final character is the "changed consonant"
// that students should apply themselves in fi mode.
//   Active: μέλλοντας (πράξ), αόριστος (ἔπραξ), παρακείμενος (πέπραχ), υπερσυντέλικος
//   Middle: μέλλοντας, αόριστος (consonant in stem, not endings)
//   NOT middle perfect — its consonant lives in the endings, not the stem.
function _afwShouldTrimStem(g) {
  const t = g.tense;
  if (t === 'μέλλοντας' || t === 'αόριστος') return true;
  if ((t === 'παρακείμενος' || t === 'υπερσυντέλικος') && g.voice === 'ενεργητική') return true;
  return false;
}

// ── Build a fi-mode copy of AFW_G where the changed consonant is
//    removed from the stem and prepended to each fi_ending instead.
function _afwMakeFIData() {
  const G_fi = {};
  for (const [k, g] of Object.entries(AFW_G)) {
    if (_afwShouldTrimStem(g)) {
      const stem = afwGetStem(g);
      if (stem && stem.length > 1) {
        const lastCh = stem.slice(-1);
        G_fi[k] = { ...g, fi_endings: (g.fi_endings || g.endings).map(e => lastCh + e) };
        continue;
      }
    }
    G_fi[k] = g;
  }
  return G_fi;
}
// Trimmed stemFn for fi mode — drops the last character on tenses that have
// the changed consonant at the end of the stem.
function _afwStemFI(g) {
  const stem = afwGetStem(g);
  if (_afwShouldTrimStem(g) && stem && stem.length > 1) return stem.slice(0, -1);
  return stem;
}

// ─────────────────────────────────────────────────────────────────────────────

function openAfwnolekta(levelId, mode) {
  document.getElementById('afw-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('afw-screen-levels')) _afwBuild();
  // Auto-navigate to a specific level+mode when QR-scanned
  if (levelId) {
    setTimeout(() => {
      const card = document.querySelector(`#afw-level-grid .lvl-card[data-lvl-id="${levelId}"]`);
      if (card) card.click();
      if (mode) setTimeout(() => gramSetMode('afw', mode), 60);
    }, 60);
  }
}
function closeAfwnolekta() {
  (_gramCleanup['afw']||function(){})();
  document.getElementById('afw-overlay').classList.remove('active');
  document.body.style.overflow = '';
  const wrap = document.getElementById('afw-wrap');
  if (wrap) {
    wrap.querySelectorAll('.lyo-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('afw-screen-levels')?.classList.add('active');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
function _afwBuild() {
  const wrap = document.getElementById('afw-wrap');

  // Extra screens: equation mode + augment mode
  const extraScreens = `
<div id="afw-screen-eq" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="afw-eq-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="afw-eq-lv"></div></div>
      <button class="lbtn lbtn-secondary" id="afw-eq-end-btn" style="padding:7px 13px;font-size:0.77rem;">Τέλος</button>
    </div>
    <div id="afw-eq-container" style="text-align:center;padding:28px 0 16px;"></div>
    <div class="lfeedback" id="afw-eq-fb"></div>
  </div>
</div>
<div id="afw-screen-aug" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="afw-aug-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="afw-aug-lv"></div></div>
      <button class="lbtn lbtn-secondary" id="afw-aug-end-btn" style="padding:7px 13px;font-size:0.77rem;">Τέλος</button>
    </div>
    <div id="afw-aug-container" style="text-align:center;padding:28px 0 16px;"></div>
    <div class="lfeedback" id="afw-aug-fb"></div>
  </div>
</div>`;

  wrap.innerHTML = gramBuildScreens(
    AFW_PREFIX,
    'Αφωνόληκτα Ρήματα',
    'Μέλλοντας · Αόριστος · Παρακείμενος — Ενεργητική & Μέση',
    {modes: AFW_MODES, extraScreens}
  );

  // Style selects
  wrap.querySelectorAll('select').forEach(s => {
    s.style.cssText = 'width:100%;padding:9px 12px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:0.93rem;cursor:pointer;font-family:inherit;';
  });

  // ── Verb selector (grouped by consonant category) ──────────────────────────
  const vsel = document.getElementById('afw-verb-selector');
  if (vsel) {
    const groups = {};
    AFW_VERBS.forEach(v => {
      if (!groups[v.cat]) groups[v.cat] = [];
      groups[v.cat].push(v);
    });
    const catLabel = {ουρανικό:'Ουρανικόληκτα (κ/γ/χ)', χειλικό:'Χειλικόληκτα (π/β/φ)', οδοντικό:'Οδοντικόληκτα (τ/δ/θ)'};
    let html = '<h3 style="margin-bottom:10px;">Επίλεξε Ρήματα</h3>';
    for (const [cat, verbs] of Object.entries(groups)) {
      html += `<div style="font-size:.72rem;color:#c9a44a;font-family:'Cinzel',serif;letter-spacing:.08em;text-transform:uppercase;margin:10px 0 5px;">${catLabel[cat]||cat}</div>`;
      html += `<div class="lcheck-grid" style="margin-bottom:6px;">`;
      verbs.forEach(v => {
        html += `<label class="lcheck-pill checked"><input type="checkbox" value="${v.verb}" checked style="display:none;"><span>${v.verb}</span></label>`;
      });
      html += '</div>';
    }
    vsel.innerHTML = html;
    vsel.querySelectorAll('.lcheck-pill').forEach(l => {
      l.querySelector('input').addEventListener('change', function() {
        l.classList.toggle('checked', this.checked);
      });
    });
  }

  // ── Level grid ────────────────────────────────────────────────────────────
  gramBuildLevelGrid(AFW_PREFIX, AFW_LEVELS, lvl => {
    // Special levels — skip settings, launch directly
    if (lvl.isEq)  { _afwStartEq();  return; }
    if (lvl.isAug) { _afwStartAug(); return; }

    _afwFilter = lvl.filter;
    document.getElementById('afw-sett-title').textContent = `Επίπεδο ${lvl.id} — ${lvl.desc}`;
    document.getElementById('afw-sett-back').onclick = () => {
      document.querySelectorAll('#afw-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
      document.getElementById('afw-screen-levels').classList.add('active');
    };
    document.querySelectorAll('#afw-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('afw-screen-settings').classList.add('active');
  });

  document.getElementById('afw-launch-btn').onclick = _afwLaunch;
  gramBuildKeyboard(AFW_PREFIX);
  gramSetMode(AFW_PREFIX, 'mc');
}

// ─────────────────────────────────────────────────────────────────────────────
function _afwLaunch() {
  const mode = gramGetMode(AFW_PREFIX);

  // Equation mode: runs its own screen, ignores verb/level filters
  if (mode === 'eq') { _afwStartEq(); return; }
  if (!_afwFilter) return;

  const time  = parseInt(document.getElementById('afw-sel-time').value);
  const lives = parseInt(document.getElementById('afw-sel-lives').value);

  // Apply verb pill selection on top of the level filter
  const selectedVerbs = Array.from(
    document.querySelectorAll('#afw-verb-selector input:checked')
  ).map(i => i.value);
  const filter = selectedVerbs.length
    ? {..._afwFilter, verbs: selectedVerbs}
    : _afwFilter;

  // For fi mode: use trimmed stems + consonant-prefixed endings so students
  // must apply the consonant change themselves (κ → ξ before ω etc.)
  const useFIData = (mode === 'fi');

  gramRunGame({
    prefix: AFW_PREFIX,
    G:      useFIData ? _afwMakeFIData() : AFW_G,
    keysFn: afwKeys,
    stemFn: useFIData ? _afwStemFI : afwGetStem,
    qtFn:   afwBuildQText,
    filter,
    mode,
    lives,
    timer:  time,
    wrapId: 'afw-wrap',
  });
}

// ══════════════════════════════════════════════════════════════════════════════
//  ΦΩΝΗΤΙΚΕΣ ΜΕΤΑΒΟΛΕΣ — Equation Mode
//  κ + σ = ?    or    ? + σ = ξ
// ══════════════════════════════════════════════════════════════════════════════
function _afwStartEq() {
  if (_gramCleanup['afw']) _gramCleanup['afw']();

  // Use settings values if available (settings may or may not have been visited)
  const livesEl = document.getElementById('afw-sel-lives');
  const timeEl  = document.getElementById('afw-sel-time');
  const lives   = livesEl ? parseInt(livesEl.value) : 3;
  const timer   = timeEl  ? parseInt(timeEl.value)  : 90;

  const state = {
    score: 0,
    lives: lives === 0 ? Infinity : lives,
    timer,
    timerRemaining: timer,
    timerInterval:  null,
    pendingTimeout: null,
  };

  const $ = id => document.getElementById(id);
  const show = id => {
    document.querySelectorAll('#afw-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
    $(id)?.classList.add('active');
  };

  const hud = () => {
    const sv = $('afw-eq-sv'); if (sv) sv.textContent = state.score;
    const lv = $('afw-eq-lv');
    if (lv) {
      if (state.lives === Infinity) { lv.textContent = '∞'; lv.style.fontSize = '1.4rem'; }
      else lv.innerHTML = Array(state.lives).fill('❤️').join('') || '💀';
    }
  };

  const stopGame = () => {
    clearInterval(state.timerInterval);
    if (state.pendingTimeout) clearTimeout(state.pendingTimeout);
    state.timerInterval  = null;
    state.pendingTimeout = null;
  };
  _gramCleanup['afw'] = stopGame;

  const end = () => {
    stopGame();
    const es  = $('afw-es');           if (es)  es.textContent  = state.score;
    const log = $('afw-mistakes-log'); if (log) log.innerHTML   = '';
    show('afw-screen-end');
    const retry    = $('afw-retry');    if (retry)    retry.onclick    = () => show('afw-screen-settings');
    const toLevels = $('afw-to-levels'); if (toLevels) toLevels.onclick = () => { stopGame(); show('afw-screen-levels'); };
  };

  $('afw-eq-end-btn').onclick = end;

  if (timer > 0) {
    state.timerInterval = setInterval(() => {
      if (--state.timerRemaining <= 0) end();
    }, 1000);
  }

  const nextQ = () => {
    state.pendingTimeout = null;

    const rule      = AFW_EQ_RULES[Math.floor(Math.random() * AFW_EQ_RULES.length)];
    const consonant = rule.consonants[Math.floor(Math.random() * rule.consonants.length)];
    // typeB → ? + σ = ξ  (find the consonant)
    // !typeB → κ + σ = ? (find the result)
    const typeB = Math.random() < 0.5;

    const fb = $('afw-eq-fb');
    if (fb) { fb.textContent = ''; fb.className = 'lfeedback'; }

    const container = $('afw-eq-container');
    if (!container) return;

    const partSt = "font-family:'Noto Serif',serif;font-size:2.4rem;color:#e8c87a;font-weight:600;"
                 + "min-width:56px;display:inline-block;text-align:center;";
    const opSt   = "font-size:2rem;color:#8a7a60;padding:0 10px;user-select:none;";
    const inpSt  = "font-family:'Noto Serif',serif;font-size:2.2rem;width:72px;text-align:center;"
                 + "background:#241e16;border:2px solid #7a6030;border-radius:8px;"
                 + "color:#e8c87a;outline:none;caret-color:#c9a44a;padding:8px 4px;";
    const resSt  = partSt + "color:#c9a44a;";

    const blank = `<input id="afw-eq-inp" type="text" maxlength="2" style="${inpSt}" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="?">`;
    const parts  = typeB
      ? `${blank}<span style="${opSt}">+</span><span style="${partSt}">${rule.suffix}</span><span style="${opSt}">=</span><span style="${resSt}">${rule.result}</span>`
      : `<span style="${partSt}">${consonant}</span><span style="${opSt}">+</span><span style="${partSt}">${rule.suffix}</span><span style="${opSt}">=</span>${blank}`;

    const hint = typeB ? 'Βρες το σύμφωνο' : 'Βρες το αποτέλεσμα';

    container.innerHTML =
      `<div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;margin-bottom:20px;">${parts}</div>`
      + `<p style="color:#8a7a60;font-size:0.85rem;letter-spacing:.03em;margin-bottom:20px;">`
      + `${hint} — <span style="color:#c9a44a;">${rule.cat}ληκτο</span></p>`
      + `<button class="lbtn lbtn-primary" id="afw-eq-sub-btn" style="width:auto;padding:11px 28px;">Υποβολή →</button>`;

    const inp = $('afw-eq-inp');
    const sub = $('afw-eq-sub-btn');

    const submit = () => {
      const typed = inp ? inp.value.trim() : '';
      if (!typed) { inp && inp.focus(); return; }
      if (inp) inp.disabled = true;
      if (sub) sub.disabled = true;

      const ok             = typeB ? rule.consonants.includes(typed) : typed === rule.result;
      const correctDisplay = typeB ? rule.consonants.join(' / ')     : rule.result;

      const fb2 = $('afw-eq-fb');
      if (ok) {
        state.score++;
        hud();
        if (fb2) { fb2.textContent = '✓ Σωστό!'; fb2.className = 'lfeedback lok'; }
        if (inp)  inp.style.borderColor = '#27ae60';
      } else {
        if (fb2) { fb2.innerHTML = `✗ Λάθος — σωστό: <strong>${correctDisplay}</strong>`; fb2.className = 'lfeedback lerr'; }
        if (inp)  inp.style.borderColor = '#c0392b';
        if (state.lives !== Infinity) {
          state.lives--;
          hud();
          if (state.lives <= 0) { state.pendingTimeout = setTimeout(() => end(), 1400); return; }
        }
      }
      state.pendingTimeout = setTimeout(() => nextQ(), 1600);
    };

    if (inp) { inp.focus(); inp.onkeydown = e => { if (e.key === 'Enter') submit(); }; }
    if (sub)   sub.onclick = submit;
  };

  show('afw-screen-eq');
  hud();
  nextQ();
}

// ══════════════════════════════════════════════════════════════════════════════
//  ΧΡΟΝΙΚΗ ΑΥΞΗΣΗ — Augment Equation Mode
//  α + αύξ = ?    or    ? + αύξ = η
// ══════════════════════════════════════════════════════════════════════════════

// Global helper — called by inline onclick on vowel-helper buttons
function _afwAugInsert(v) {
  const inp = document.getElementById('afw-aug-inp');
  if (inp && !inp.disabled) { inp.value += v; inp.focus(); }
}

function _afwStartAug() {
  if (_gramCleanup['afw']) _gramCleanup['afw']();

  const livesEl = document.getElementById('afw-sel-lives');
  const timeEl  = document.getElementById('afw-sel-time');
  const lives   = livesEl ? parseInt(livesEl.value) : 3;
  const timer   = timeEl  ? parseInt(timeEl.value)  : 90;

  const state = {
    score: 0,
    lives: lives === 0 ? Infinity : lives,
    timer,
    timerRemaining: timer,
    timerInterval:  null,
    pendingTimeout: null,
  };

  const $ = id => document.getElementById(id);
  const show = id => {
    document.querySelectorAll('#afw-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
    $(id)?.classList.add('active');
  };

  const hud = () => {
    const sv = $('afw-aug-sv'); if (sv) sv.textContent = state.score;
    const lv = $('afw-aug-lv');
    if (lv) {
      if (state.lives === Infinity) { lv.textContent = '∞'; lv.style.fontSize = '1.4rem'; }
      else lv.innerHTML = Array(state.lives).fill('❤️').join('') || '💀';
    }
  };

  const stopGame = () => {
    clearInterval(state.timerInterval);
    if (state.pendingTimeout) clearTimeout(state.pendingTimeout);
    state.timerInterval  = null;
    state.pendingTimeout = null;
  };
  _gramCleanup['afw'] = stopGame;

  const end = () => {
    stopGame();
    const es  = $('afw-es');           if (es)  es.textContent = state.score;
    const log = $('afw-mistakes-log'); if (log) log.innerHTML  = '';
    show('afw-screen-end');
    const retry    = $('afw-retry');    if (retry)    retry.onclick    = () => show('afw-screen-settings');
    const toLevels = $('afw-to-levels'); if (toLevels) toLevels.onclick = () => { stopGame(); show('afw-screen-levels'); };
  };

  $('afw-aug-end-btn').onclick = end;

  if (timer > 0) {
    state.timerInterval = setInterval(() => {
      if (--state.timerRemaining <= 0) end();
    }, 1000);
  }

  const nextQ = () => {
    state.pendingTimeout = null;

    const rule  = AFW_AUG_RULES[Math.floor(Math.random() * AFW_AUG_RULES.length)];
    // typeB → ? + αύξ = augmented  (find initial vowel)
    // !typeB → initial + αύξ = ?   (find augmented vowel)
    const typeB = Math.random() < 0.5;

    const fb = $('afw-aug-fb');
    if (fb) { fb.textContent = ''; fb.className = 'lfeedback'; }

    const container = $('afw-aug-container');
    if (!container) return;

    const partSt = "font-family:'Noto Serif',serif;font-size:2.4rem;color:#e8c87a;font-weight:600;"
                 + "min-width:56px;display:inline-block;text-align:center;vertical-align:middle;";
    const opSt   = "font-size:2rem;color:#8a7a60;padding:0 10px;user-select:none;vertical-align:middle;";
    const lblSt  = "font-size:1.3rem;color:#8a7a60;padding:0 6px;user-select:none;vertical-align:middle;"
                 + "font-family:'Cinzel',serif;";
    const inpSt  = "font-family:'Noto Serif',serif;font-size:2.2rem;width:90px;text-align:center;"
                 + "background:#241e16;border:2px solid #7a6030;border-radius:8px;"
                 + "color:#e8c87a;outline:none;caret-color:#c9a44a;padding:8px 4px;vertical-align:middle;";
    const resSt  = partSt + "color:#c9a44a;";

    const blank = `<input id="afw-aug-inp" type="text" maxlength="4" style="${inpSt}" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="?">`;
    const parts = typeB
      ? `${blank}<span style="${opSt}">+</span><span style="${lblSt}">αύξ</span><span style="${opSt}">=</span><span style="${resSt}">${rule.augmented}</span>`
      : `<span style="${partSt}">${rule.initial}</span><span style="${opSt}">+</span><span style="${lblSt}">αύξ</span><span style="${opSt}">=</span>${blank}`;

    const hint = typeB ? 'Βρες το αρχικό φωνήεν' : 'Βρες το αυξημένο φωνήεν';

    // Context-sensitive vowel helper buttons
    const helpers = typeB
      ? ['α','ε','αι','ει','ο','οι','αυ','ευ','ι','υ']
      : ['η','ῃ','ω','ῳ','ηυ','ῑ','ῡ'];
    const btnSt = "font-family:'Noto Serif',serif;font-size:1.1rem;padding:7px 14px;"
                + "background:#2e2618;border:1px solid #5a4a28;border-radius:6px;"
                + "color:#e8c87a;cursor:pointer;margin:3px;";
    const helperBtns = helpers.map(v =>
      `<button onclick="_afwAugInsert('${v}')" style="${btnSt}">${v}</button>`
    ).join('');

    container.innerHTML =
      `<div style="display:flex;align-items:center;justify-content:center;flex-wrap:wrap;margin-bottom:18px;">${parts}</div>`
      + `<p style="color:#8a7a60;font-size:0.85rem;letter-spacing:.03em;margin-bottom:6px;">${hint}</p>`
      + `<p style="color:#6a9a6a;font-size:0.82rem;font-family:'Noto Serif',serif;margin-bottom:18px;">π.χ. <em>${rule.verb}</em> → <em>${rule.impf}</em></p>`
      + `<div style="margin-bottom:18px;">${helperBtns}</div>`
      + `<button class="lbtn lbtn-primary" id="afw-aug-sub-btn" style="width:auto;padding:11px 28px;">Υποβολή →</button>`;

    const inp = $('afw-aug-inp');
    const sub = $('afw-aug-sub-btn');

    const submit = () => {
      const typed = inp ? inp.value.trim() : '';
      if (!typed) { inp && inp.focus(); return; }
      if (inp) inp.disabled = true;
      if (sub) sub.disabled = true;

      let ok, correctDisplay;
      if (typeB) {
        // Find initial: accept any valid initial that maps to this augmented form
        const validInitials = AFW_AUG_REV[rule.augmented] || [rule.initial];
        ok = validInitials.includes(typed);
        correctDisplay = validInitials.join(' / ');
      } else {
        // Find augmented
        ok = (typed === rule.augmented);
        // Also accept plain ι/υ as equivalents to ῑ/ῡ (macrons hard to type)
        if (!ok && rule.augmented === 'ῑ' && typed === 'ι') ok = true;
        if (!ok && rule.augmented === 'ῡ' && typed === 'υ') ok = true;
        correctDisplay = rule.augmented;
      }

      const fb2 = $('afw-aug-fb');
      if (ok) {
        state.score++;
        hud();
        if (fb2) { fb2.textContent = '✓ Σωστό!'; fb2.className = 'lfeedback lok'; }
        if (inp)  inp.style.borderColor = '#27ae60';
      } else {
        if (fb2) { fb2.innerHTML = `✗ Λάθος — σωστό: <strong>${correctDisplay}</strong>`; fb2.className = 'lfeedback lerr'; }
        if (inp)  inp.style.borderColor = '#c0392b';
        if (state.lives !== Infinity) {
          state.lives--;
          hud();
          if (state.lives <= 0) { state.pendingTimeout = setTimeout(() => end(), 1400); return; }
        }
      }
      state.pendingTimeout = setTimeout(() => nextQ(), 1600);
    };

    if (inp) { inp.focus(); inp.onkeydown = e => { if (e.key === 'Enter') submit(); }; }
    if (sub)   sub.onclick = submit;
  };

  show('afw-screen-aug');
  hud();
  nextQ();
}
