// Επίθετα ανά Κείμενο — δύο ασκήσεις: (1) Κλίση επιθέτων  (2) Παραθετικά
// Depends on: lat-epitheta-kata/data.js, shared-engine.js (for _gramFmtSec, logStudentMistake)

function openLatEpithetaKata() {
  document.getElementById('latek-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('latek-screen-levels')) _latekBuild();
}
function closeLatEpithetaKata() {
  _latekToLevels();
  document.getElementById('latek-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

let _latekState = null;

// ── normalise / compare Latin forms ─────────────────────────────────────────
function _latekNorm(s) {
  return (s || '').trim().toLowerCase()
    .replace(/ā/g,'a').replace(/ē/g,'e').replace(/ī/g,'i').replace(/ō/g,'o').replace(/ū/g,'u')
    .replace(/ĕ/g,'e').replace(/ŏ/g,'o');
}
const _LATEK_DASHES = ['-','–','—'];
function _latekIsDash(s) { return _LATEK_DASHES.includes((s || '').trim()) || _latekNorm(s) === 'δεν σχηματιζει'; }
function _latekMatch(input, expected) {
  if (expected === '-' || expected == null) return _latekIsDash(input);
  if (Array.isArray(expected)) return expected.some(e => _latekMatch(input, e));
  return _latekNorm(input) === _latekNorm(expected);
}
function _latekShow1(v) { return Array.isArray(v) ? v[0] : v; }   // canonical display

// ── build overlay HTML ──────────────────────────────────────────────────────
function _latekBuild() {
  document.getElementById('latek-wrap').innerHTML = `
<div id="latek-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Επίθετα ανά Κείμενο</h1>
    <p class="lsubtitle">Λατινικά — Κλίση Επιθέτων &amp; Παραθετικά, ανά κείμενο (3–45)</p>
    <button class="game-share-btn" onclick="showQR('Επίθετα ανά Κείμενο',{nav:'game',id:'lat-epitheta-kata'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div style="margin-bottom:10px;font-size:.82rem;color:#8a7a60;">Επίλεξε ένα ή περισσότερα κείμενα:</div>
    <div id="latek-text-grid" style="margin-bottom:16px;"></div>
    <hr class="ldivider">
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:8px;">
      <div style="display:none;">Άσκηση:</div>
      <div style="display:none;">
        <select id="latek-sel-ex" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="klisi" selected>① Κλίση επιθέτων</option>
          <option value="paratheta">② Παραθετικά</option>
        </select>
        <select id="latek-sel-ans" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="fi" selected>Συμπλήρωση</option>
          <option value="mc">Πολλαπλή επιλογή</option>
        </select>
      </div>
      <div style="display:none;">
        <select id="latek-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option><option value="0">∞ χρόνος</option>
        </select>
        <select id="latek-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">∞ ζωές</option>
        </select>
      </div>
      <div id="latek-sel-info" style="font-size:.78rem;color:#8a7a60;margin-bottom:8px;text-align:center;"></div>
      <button id="latek-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="latekOpenSettings()">✓ Διάλεξε κείμενα →</button>
    </div>
  </div>
</div>

<div id="latek-screen-game" class="lyo-screen">
  <div class="lcard" style="max-width:600px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="latek-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="latek-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="latek-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_latekEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="latek-q"><div class="lq-main">Φόρτωση...</div></div>
    <div class="lfeedback" id="latek-fb"></div>
    <div id="latek-mc-area" class="lopts-grid" style="display:none;"></div>
    <div id="latek-fi-area" style="display:none;">
      <div style="text-align:center;margin-bottom:14px;">
        <input type="text" id="latek-fi-input" autocomplete="off" autocorrect="off" spellcheck="false"
          placeholder="πληκτρολογήστε... (— αν δεν σχηματίζεται)"
          style="font-size:1.5rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:8px;color:#e8c87a;width:100%;max-width:360px;outline:none;text-align:center;caret-color:#c9a44a;">
      </div>
      <button class="lfi-submit" id="latek-fi-submit" onclick="latekSubmitFI()">Υποβολή ↵</button>
    </div>
  </div>
</div>

<div id="latek-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="latek-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="latek-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_latekRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_latekToLevels()">Επιλογή Κειμένων</button>
    </div>
  </div>
</div>`;

  _latekBuildTextGrid();
  document.getElementById('latek-fi-input').onkeydown = e => { if (e.key === 'Enter') latekSubmitFI(); };
  document.addEventListener('keydown', _latekKeyHandler);
}

function _latekKeyHandler(e) {
  if (e.key === 'Enter') {
    const g = document.getElementById('latek-screen-game');
    if (g && g.classList.contains('active') && _latekState && _latekState.ansMode === 'fi') latekSubmitFI();
  }
}

function _latekTextGroup(t){ const lo = Math.floor((t - 1) / 10) * 10 + 1; return 'Κείμενα ' + lo + '–' + (lo + 9); }
function _latekBuildTextGrid() {
  const lvls = LATEK_TEXTS.map(t => ({ id: t, group: _latekTextGroup(t), desc: 'Κείμενο ' + t + ' · ' + ((LATEK_BY_TEXT[t] || []).length) + ' επίθετα' }));
  gramBuildSubPicker('latek', lvls, { containerId:'latek-text-grid', selClass:'latek-sel', railLabel:'Κείμενα', dataAttrs:l=>({text:l.id}), onToggle:_latekUpdateStart });
}

function _latekUpdateStart() {
  const sel  = [...document.querySelectorAll('#latek-text-grid .latek-sel')];
  const btn  = document.getElementById('latek-start-btn');
  const info = document.getElementById('latek-sel-info');
  if (!btn) return;
  if (sel.length > 0) {
    const adjs = _latekFilter(sel.map(b => parseInt(b.dataset.text)));
    if (info) info.textContent = `${adjs.length} επίθετα στα επιλεγμένα κείμενα`;
    btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
    btn.textContent = `Έναρξη (${sel.length} κειμ.) →`;
  } else {
    if (info) info.textContent = '';
    btn.style.opacity = '.5'; btn.style.pointerEvents = 'none';
    btn.textContent = '✓ Επιλέξτε κείμενο →';
  }
}

function _latekFilter(texts) {
  const seen = new Set(), result = [];
  texts.forEach(t => {
    (LATEK_BY_TEXT[t] || []).forEach(a => {
      if (!seen.has(a.l)) { seen.add(a.l); result.push(a); }
    });
  });
  return result;
}

function _latekShowScreen(id) {
  document.querySelectorAll('#latek-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}
function _latekToLevels() {
  if (_latekState) {
    clearInterval(_latekState.timerInterval);
    if (_latekState.pendingTimeout) clearTimeout(_latekState.pendingTimeout);
    _latekState = null;
  }
  _latekShowScreen('latek-screen-levels');
}
function _latekRetry() {
  if (_latekState?._lastTexts) {
    _latekStart(_latekState._lastTexts, _latekState._lastTimer, _latekState._lastLives, _latekState.exMode, _latekState.ansMode);
  } else { _latekToLevels(); }
}

// ── launch ────────────────────────────────────────────────────────────────────
function latekOpenSettings(){
  if(!document.querySelectorAll('#latek-text-grid .latek-sel').length) return;
  gramOpenQuizSettings('latek', { title:'Επίθετα ανά Κείμενο', datasetId:'lat-epitheta-kata',
    modeSelId:'latek-sel-ans',
    modes:[
      {id:'fi', label:'Συμπλήρωση Κενού', hint:'Γράψε τον τύπο'},
      {id:'mc', label:'Πολλαπλή Επιλογή', hint:'Επίλεξε από επιλογές'},
    ],
    extras:[{ selId:'latek-sel-ex', label:'Άσκηση', options:[['klisi','Κλίση επιθέτων'],['paratheta','Παραθετικά']], default:'klisi' }],
    onLaunch: latekLaunch, onClose: closeLatEpithetaKata });
}
function latekLaunch() {
  const sel = [...document.querySelectorAll('#latek-text-grid .latek-sel')];
  if (!sel.length) return;
  const texts   = sel.map(b => parseInt(b.dataset.text));
  const timer   = parseInt(document.getElementById('latek-sel-time').value);
  const lives   = parseInt(document.getElementById('latek-sel-lives').value);
  const exMode  = document.getElementById('latek-sel-ex').value;
  const ansMode = document.getElementById('latek-sel-ans').value;
  _latekStart(texts, timer, lives, exMode, ansMode);
}

function _latekStart(texts, timer, livesVal, exMode, ansMode) {
  const adjs = _latekFilter(texts);
  if (!adjs.length) { alert('Δεν βρέθηκαν επίθετα.'); return; }
  _latekState = {
    adjs, score: 0,
    lives: livesVal === 0 ? Infinity : livesVal,
    timer, timerRemaining: timer, timerInterval: null,
    answering: false, pendingTimeout: null, mistakes: [],
    exMode, ansMode, curr: null,
    _lastTexts: texts, _lastTimer: timer, _lastLives: livesVal,
  };
  document.getElementById('latek-mc-area').style.display = ansMode === 'mc' ? 'grid' : 'none';
  document.getElementById('latek-fi-area').style.display = ansMode === 'fi' ? 'block' : 'none';
  _latekShowScreen('latek-screen-game');
  _latekHUD();
  if (timer > 0) _latekStartTimer();
  latekNext();
}

function _latekStartTimer() {
  _latekState.timerInterval = setInterval(() => {
    _latekState.timerRemaining--;
    const tv = document.getElementById('latek-tv');
    if (tv) {
      tv.textContent = _gramFmtSec(_latekState.timerRemaining);
      tv.classList.toggle('ltimer-warn', _latekState.timerRemaining <= 10);
      tv.classList.toggle('ltimer-caut', _latekState.timerRemaining <= 20 && _latekState.timerRemaining > 10);
    }
    if (_latekState.timerRemaining <= 0) _latekEndGame();
  }, 1000);
}

function _latekHUD() {
  const sv = document.getElementById('latek-sv'); if (sv) sv.textContent = _latekState.score;
  const lv = document.getElementById('latek-lv');
  if (lv) {
    if (_latekState.lives === Infinity) { lv.textContent = '∞'; lv.style.fontSize = '1.4rem'; }
    else lv.innerHTML = Array(_latekState.lives).fill('❤️').join('') || '💀';
  }
  const tv = document.getElementById('latek-tv');
  if (tv && _latekState.timer === 0) { tv.textContent = '∞'; tv.classList.remove('ltimer-warn','ltimer-caut'); }
}

// ── question helpers ─────────────────────────────────────────────────────────
function _latekShuffle(a) { for (let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
const _LATEK_DEG_LBL = { comp:'Συγκριτικός', superl:'Υπερθετικός' };

// generic 4-option builder: correct + distractors drawn from candidates
function _latekOpts(correct, candidates) {
  const norm = _latekNorm, used = new Set([norm(correct)]), opts = [correct];
  for (const c of _latekShuffle(candidates.slice())) {
    if (opts.length >= 4) break;
    const v = _latekShow1(c);
    if (v && v !== '-' && !used.has(norm(v))) { opts.push(v); used.add(norm(v)); }
  }
  return _latekShuffle(opts);
}

function latekNext() {
  if (!_latekState) return;
  _latekState.answering = false;
  const fb = document.getElementById('latek-fb');
  if (fb) { fb.textContent = ''; fb.className = 'lfeedback'; }
  if (_latekState.exMode === 'paratheta') _latekNextParatheta();
  else _latekNextKlisi();
}

// ════════ EXERCISE 1: ΚΛΙΣΗ ΕΠΙΘΕΤΩΝ ════════
function _latekNextKlisi() {
  const GEN = ['m','f','n'], GENL = { m:'αρσενικό', f:'θηλυκό', n:'ουδέτερο' };
  let a, g, isSg, cIdx, ans, tries = 0;
  do {
    a = _latekState.adjs[Math.floor(Math.random() * _latekState.adjs.length)];
    g = GEN[Math.floor(Math.random()*3)];
    isSg = Math.random() > .5;
    cIdx = Math.floor(Math.random()*6);
    ans = (isSg ? a.decl[g].s : a.decl[g].p)[cIdx];
    tries++;
  } while ((!ans || ans === '-') && tries < 120);
  if (!ans || ans === '-') { _latekNextKlisi(); return; }
  _latekState.curr = { kind:'klisi', a, g, isSg, cIdx, ans };

  const qt = `<div class="lq-main" style="font-size:1.15rem;text-align:center;margin-bottom:8px;"><em>${a.l}</em> <span style="color:#8a7a60;font-size:.8em;">${a.m}</span></div>`
    + `<div class="lq-tags"><span class="lq-tag voice">${LATEK_CASES[cIdx]}</span><span class="lq-tag tense">${isSg?'Ενικός':'Πληθυντικός'}</span><span class="lq-tag mood">${GENL[g]}</span></div>`;
  document.getElementById('latek-q').innerHTML = qt;

  if (_latekState.ansMode === 'mc') {
    // candidates: same case, other genders/number of same adj + same slot of other adjs
    const cands = [];
    GEN.forEach(gg => { cands.push(a.decl[gg].s[cIdx], a.decl[gg].p[cIdx]); });
    _latekShuffle(_latekState.adjs.filter(x => x !== a)).forEach(x => {
      GEN.forEach(gg => { cands.push((isSg?x.decl[gg].s:x.decl[gg].p)[cIdx]); });
    });
    _latekRenderMC(_latekOpts(_latekShow1(ans), cands));
  } else _latekRenderFI();
}

// ════════ EXERCISE 2: ΠΑΡΑΘΕΤΙΚΑ ════════
function _latekNextParatheta() {
  const st = _latekState;
  const gradable = st.adjs.filter(a => a.comp || a.superl);
  // 50% formation, 50% declension-of-degree (only if there is a gradable adj)
  const wantDecl = gradable.length && Math.random() < 0.5;
  if (wantDecl) { _latekNextParDecl(gradable); return; }

  // ── (a) σχηματισμός: ονομαστική αρσ. εν. συγκρ./υπερθ. (ή «—») ──
  const a = st.adjs[Math.floor(Math.random() * st.adjs.length)];
  const which = Math.random() < .5 ? 'comp' : 'superl';
  const ans = which === 'comp' ? a.comp : a.superl;       // string or null
  _latekState.curr = { kind:'form', a, which, ans: ans || '-' };

  const qt = `<div class="lq-main" style="font-size:1.15rem;text-align:center;margin-bottom:8px;">Θετικός: <em>${a.l}</em> <span style="color:#8a7a60;font-size:.8em;">${a.m}</span></div>`
    + `<div class="lq-tags"><span class="lq-tag voice">${_LATEK_DEG_LBL[which]}</span><span class="lq-tag tense">ονομ. αρσ. εν.</span></div>`
    + `<div style="text-align:center;font-size:.72rem;color:#8a7a60;margin-top:4px;">(γράψε «—» αν δεν σχηματίζεται)</div>`;
  document.getElementById('latek-q').innerHTML = qt;

  if (_latekState.ansMode === 'mc') {
    const cands = ['—'];
    _latekShuffle(st.adjs.filter(x => x !== a)).forEach(x => { cands.push(x[which]); });
    // a plausible "regularly-formed" trap when the answer is «—» or irregular
    cands.push(which === 'comp' ? a.stem + 'ior' : a.stem + 'issimus');
    _latekRenderMC(_latekOpts(ans ? _latekShow1(ans) : '—', cands.filter(Boolean)));
  } else _latekRenderFI();
}

function _latekNextParDecl(gradable) {
  const GEN = ['m','f','n'], GENL = { m:'αρσενικό', f:'θηλυκό', n:'ουδέτερο' };
  let a, deg, paradigm, g, isSg, cIdx, ans, tries = 0;
  do {
    a = gradable[Math.floor(Math.random()*gradable.length)];
    const choices = [];
    if (a.comp)   choices.push(['comp', a.compDecl, a.comp]);
    if (a.superl) choices.push(['superl', a.superlDecl, a.superl]);
    const ch = choices[Math.floor(Math.random()*choices.length)];
    deg = ch[0]; paradigm = ch[1];
    g = GEN[Math.floor(Math.random()*3)];
    isSg = Math.random() > .5;
    cIdx = Math.floor(Math.random()*6);
    ans = (isSg ? paradigm[g].s : paradigm[g].p)[cIdx];
    tries++;
  } while ((!ans || ans === '-') && tries < 150);
  if (!ans || ans === '-') { _latekNextParatheta(); return; }
  const degNom = deg === 'comp' ? a.comp : a.superl;
  _latekState.curr = { kind:'pardecl', a, deg, degNom, paradigm, g, isSg, cIdx, ans };

  const qt = `<div class="lq-main" style="font-size:1.1rem;text-align:center;margin-bottom:6px;">${_LATEK_DEG_LBL[deg]} του <em>${a.l}</em></div>`
    + `<div style="text-align:center;font-size:1rem;color:#c9a44a;margin-bottom:6px;">${_latekShow1(degNom)}</div>`
    + `<div class="lq-tags"><span class="lq-tag voice">${LATEK_CASES[cIdx]}</span><span class="lq-tag tense">${isSg?'Ενικός':'Πληθυντικός'}</span><span class="lq-tag mood">${GENL[g]}</span><span class="lq-tag gender">${_LATEK_DEG_LBL[deg]}</span></div>`;
  document.getElementById('latek-q').innerHTML = qt;

  if (_latekState.ansMode === 'mc') {
    const cands = [];
    GEN.forEach(gg => { cands.push(paradigm[gg].s[cIdx], paradigm[gg].p[cIdx]); });
    GEN.forEach(gg => { cands.push((isSg?paradigm[gg].s:paradigm[gg].p)[cIdx]); });
    _latekShuffle(gradable.filter(x => x !== a && x[deg+'Decl'])).forEach(x => {
      const pd = x[deg+'Decl']; GEN.forEach(gg => cands.push((isSg?pd[gg].s:pd[gg].p)[cIdx]));
    });
    _latekRenderMC(_latekOpts(_latekShow1(ans), cands));
  } else _latekRenderFI();
}

// ── render answer widgets ────────────────────────────────────────────────────
function _latekRenderMC(opts) {
  const grid = document.getElementById('latek-mc-area');
  grid.style.display = 'grid'; grid.innerHTML = '';
  opts.forEach(opt => {
    const b = document.createElement('button');
    b.className = 'lopt-btn'; b.textContent = opt;
    b.onclick = () => latekAnswer(opt);
    grid.appendChild(b);
  });
}
function _latekRenderFI() {
  const inp = document.getElementById('latek-fi-input');
  if (inp) { inp.value=''; inp.disabled=false; inp.style.borderColor='#7a6030'; inp.focus(); }
  document.getElementById('latek-fi-submit').disabled = false;
}

// ── grading ──────────────────────────────────────────────────────────────────
function _latekQDesc(c) {
  const GENL = { m:'αρσ.', f:'θηλ.', n:'ουδ.' };
  if (c.kind === 'klisi')  return `${c.a.l} — ${LATEK_CASES[c.cIdx]} ${c.isSg?'εν.':'πληθ.'} ${GENL[c.g]}`;
  if (c.kind === 'form')   return `${c.a.l} — ${_LATEK_DEG_LBL[c.which]} (ονομ. αρσ. εν.)`;
  return `${c.a.l} — ${_LATEK_DEG_LBL[c.deg]} ${_latekShow1(c.degNom)} · ${LATEK_CASES[c.cIdx]} ${c.isSg?'εν.':'πληθ.'} ${GENL[c.g]}`;
}
function _latekGrade(typed) {
  const c = _latekState.curr;
  const ok = _latekMatch(typed, c.ans);
  const correctDisp = c.ans === '-' ? '— (δεν σχηματίζεται)' : _latekShow1(c.ans);
  const fb = document.getElementById('latek-fb');
  if (ok) {
    _latekState.score++;
    if (fb) { fb.textContent = '✓ Σωστό!'; fb.className = 'lfeedback lok'; }
  } else {
    const q = _latekQDesc(c);
    _latekState.mistakes.push({ q, typed: typed || '—', correct: correctDisp, note: c.a.degNote });
    if (typeof logStudentMistake === 'function')
      logStudentMistake('lat-epitheta-kata','latinika',_latekState.ansMode,{q,a:correctDisp},typed||'—');
    if (fb) { fb.innerHTML = `✗ Λάθος — σωστό: <strong>${correctDisp}</strong>`; fb.className = 'lfeedback lerr'; }
    if (_latekState.lives !== Infinity) {
      _latekState.lives--; _latekHUD();
      if (_latekState.lives <= 0) { _latekState.pendingTimeout = setTimeout(() => _latekEndGame(), 1300); return; }
    }
  }
  _latekHUD();
  _latekState.pendingTimeout = setTimeout(() => latekNext(), 1600);
}

function latekAnswer(chosen) {
  if (!_latekState || _latekState.answering) return;
  _latekState.answering = true;
  const ans = _latekState.curr.ans;
  document.querySelectorAll('#latek-mc-area .lopt-btn').forEach(b => {
    b.disabled = true;
    if (_latekMatch(b.textContent, ans)) b.classList.add('lcorrect');
    else if (b.textContent === chosen) b.classList.add('lwrong');
  });
  _latekGrade(chosen);
}
function latekSubmitFI() {
  if (!_latekState || _latekState.answering) return;
  const inp = document.getElementById('latek-fi-input');
  const typed = inp ? inp.value.trim() : '';
  if (!typed) { inp?.focus(); return; }
  _latekState.answering = true;
  if (inp) inp.disabled = true;
  document.getElementById('latek-fi-submit').disabled = true;
  const ok = _latekMatch(typed, _latekState.curr.ans);
  if (inp) inp.style.borderColor = ok ? '#27ae60' : '#c0392b';
  _latekGrade(typed);
}

// ── end ───────────────────────────────────────────────────────────────────────
function _latekEndGame() {
  if (!_latekState) return;
  clearInterval(_latekState.timerInterval);
  if (_latekState.pendingTimeout) clearTimeout(_latekState.pendingTimeout);

  document.getElementById('latek-es').textContent = _latekState.score;
  const log = document.getElementById('latek-mistakes-log');
  if (!_latekState.mistakes.length) {
    log.innerHTML = `<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>`;
  } else {
    let h = `<div class="lmistakes-hdr">Λάθη: ${_latekState.mistakes.length}</div><div class="lmistakes-list">`;
    _latekState.mistakes.forEach(m => {
      h += `<div class="lmistake-row"><div class="lm-q">${m.q}${m.note?` <span style="color:#8a7a60;font-size:.72rem;">(${m.note})</span>`:''}</div>`
        + `<div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div></div>`;
    });
    h += '</div>';
    log.innerHTML = h;
  }
  // save progress per selected text
  (_latekState._lastTexts || []).forEach(t => { try {
    const pkey = `latek_prog_${t}`;
    const prev = JSON.parse(localStorage.getItem(pkey) || '{}');
    const completed = _latekState.mistakes.length === 0 && _latekState.score > 0;
    localStorage.setItem(pkey, JSON.stringify({ best: Math.max(_latekState.score, prev.best||0), completed: prev.completed||completed, ts: Date.now() }));
    const btn = document.querySelector(`#latek-text-grid [data-text="${t}"]`);
    if (btn && completed) { btn.style.borderColor = '#27ae60'; btn.style.color = '#5dca8a'; }
  } catch(e){} });
  _latekShowScreen('latek-screen-end');
}
