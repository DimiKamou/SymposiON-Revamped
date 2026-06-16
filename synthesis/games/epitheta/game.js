// ============================================================
//  ΕΠΊΘΕΤΑ — Κλίση Επιθέτων
//  Depends on: epitheta/data.js, shared-engine.js
// ============================================================

// ── LEVELS ──
const EPT_LEVELS = [
  {id:1,  group:"Τρικατάληκτα Α΄/Β΄ κλίση",      color:"lgreen",  desc:"Θηλ. -η: σοφός, ἀγαθός, καλός, δίκαιος",          sub:["kata1"]},
  {id:2,  group:"Τρικατάληκτα Α΄/Β΄ κλίση",      color:"lyellow", desc:"Θηλ. -α (ε/ι/ρ): ἄξιος, νέος, μικρός, ἐλεύθερος", sub:["kata2"]},
  {id:3,  group:"Τρικατάληκτα Α΄/Β΄ κλίση",      color:"lred",    desc:"Α΄/Β΄ κλίση — Όλα",                                  sub:["kata1","kata2"]},
  {id:4,  group:"Τρικατάληκτα Α΄/Γ΄ κλίση",      color:"lgreen",  desc:"-ύς, -εῖα, -ύ: ἡδύς, βαθύς, ταχύς, εὐθύς",          sub:["kata3"]},
  {id:5,  group:"Δικατάληκτα",                    color:"lyellow", desc:"Β΄ κλίση -ος/-ον: ἄδικος, βάρβαρος, ἔρημος",         sub:["d2b"]},
  {id:6,  group:"Δικατάληκτα",                    color:"lyellow", desc:"Γ΄ κλίση -ης/-ές: ἀληθής, εὐγενής, σαφής",           sub:["d2g"]},
  {id:7,  group:"Δικατάληκτα",                    color:"lred",    desc:"Δικατάληκτα — Όλα",                                   sub:["d2b","d2g"]},
  {id:8,  group:"Ανώμαλα",                        color:"lpurple", desc:"μέγας, μεγάλη, μέγα — πολύς, πολλή, πολύ",           sub:["anwm"]},
  {id:9,  group:"Master Challenge",              color:"lred",    desc:"Τρικατάληκτα + Δικατάληκτα + Ανώμαλα — Όλα",         sub:["all"]},
];

// ── FILTER ──
function _eptFilterAdj(subs) {
  if (subs.includes('all')) return EPT_DB;
  return EPT_DB.filter(adj => subs.includes(adj.sub));
}

// ── STATE ──
let _eptState = null;
let _eptMode  = 'mc';
let _eptLastSelIds = [];

// ── OPEN / CLOSE ──
function openEpitheta() {
  document.getElementById('ept-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('ept-screen-levels')) _eptBuild();
}
function closeEpitheta() {
  _eptToLevels();
  document.getElementById('ept-overlay').classList.remove('active');
  document.body.style.overflow = '';
}
function _eptToLevels() {
  if (_eptState) {
    clearInterval(_eptState.timerInterval);
    if (_eptState.pendingTimeout) clearTimeout(_eptState.pendingTimeout);
    _eptState.timerInterval = null;
    _eptState.pendingTimeout = null;
  }
  _eptShowScreen('ept-screen-levels');
}
function _eptShowScreen(id) {
  document.querySelectorAll('#ept-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

// ── BUILD HTML ──
function _eptBuild() {
  document.getElementById('ept-wrap').innerHTML = `
<div id="ept-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Κλίση Επιθέτων</h1>
    <p class="lsubtitle">Αρχαία Ελληνικά — Τρικατάληκτα · Δικατάληκτα · Ανώμαλα</p>
    <button class="game-share-btn" onclick="showQR('Κλίση Επιθέτων',{nav:'game',id:'ept'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="ept-level-grid"></div>
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:16px;">
      <div style="display:none;">
        <select id="ept-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option><option value="0">∞ χρόνος</option>
        </select>
        <select id="ept-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">∞ ζωές</option>
        </select>
        <select id="ept-sel-mode" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="" disabled selected>— τρόπος —</option>
          <option value="mc">Πολλ. Επιλογή</option>
          <option value="fi">Συμπλήρωση</option>
          <option value="match">🔗 Αντιστοίχιση</option>
        </select>
      </div>
      <button id="ept-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="eptOpenSettings()">✓ Διάλεξε επίπεδο →</button>
    </div>
  </div>
</div>
<div id="ept-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="ept-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="ept-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="ept-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_eptEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="ept-q"><div class="lq-main">Φόρτωση...</div></div>
    <div class="lfeedback" id="ept-fb"></div>
    <div id="ept-mc-area" class="lopts-grid" style="display:none;"></div>
    <div id="ept-fi-area" style="display:none;">
      <div style="text-align:center;margin-bottom:14px;">
        <input type="text" id="ept-fi-input" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="πληκτρολογήστε..."
          style="font-family:'Noto Serif',serif;font-size:1.8rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:8px;color:#e8c87a;width:100%;max-width:300px;outline:none;text-align:center;caret-color:#c9a44a;">
      </div>
      <button class="lfi-submit" id="ept-fi-submit" onclick="eptSubmitFI()">Υποβολή ↵</button>
      <div class="lpoly-kb" style="margin-top:10px;">
        <button class="lpoly-toggle" id="ept-poly-toggle" onclick="gramToggleKB('ept')">
          <span>Πολυτονικό Πληκτρολόγιο</span><span class="lpoly-arrow">▼</span>
        </button>
        <div class="lpoly-body" id="ept-poly-body">
          <div class="lpoly-diac-row" id="ept-diac-row"></div>
          <div id="ept-vowel-rows"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<div id="ept-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="ept-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="ept-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_eptRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_eptToLevels()">Επίπεδα</button>
    </div>
  </div>
</div>
<div id="ept-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="ept-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="ept-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('ept')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="ept-match-body"></div>
    <div class="lfeedback" id="ept-match-fb"></div>
  </div>
</div>`;

  // Build level grid
  gramBuildSubPicker('ept', EPT_LEVELS, { selClass: 'ept-sel', onToggle: _eptUpdateStartBtn });

  document.getElementById('ept-fi-input').onkeydown = e => { if (e.key === 'Enter') eptSubmitFI(); };
  document.getElementById('ept-sel-mode').addEventListener('change', _eptUpdateStartBtn);
  gramBuildKeyboard('ept');
}

function _eptUpdateStartBtn() {
  const sel = document.querySelectorAll('#ept-level-grid .lvl-card.ept-sel');
  const mode = document.getElementById('ept-sel-mode')?.value;
  const btn = document.getElementById('ept-start-btn');
  if (!btn) return;
  if (sel.length > 0) {
    btn.style.opacity = '1'; btn.style.pointerEvents = 'auto';
    btn.textContent = `Έναρξη (${sel.length} επ.) →`;
  } else {
    btn.style.opacity = '.5'; btn.style.pointerEvents = 'none';
    btn.textContent = '✓ Επίπεδο & τρόπος →';
  }
}

// ── LAUNCH ──
function eptOpenSettings(){
  if(!document.querySelectorAll('#ept-level-grid .lvl-card.ept-sel').length) return;
  gramOpenQuizSettings('ept', { title:'Κλίση Επιθέτων', datasetId:'epitheta',
    modes:[
      {id:'mc',    label:'Πολλαπλή Επιλογή', hint:'Επίλεξε από 4 επιλογές'},
      {id:'fi',    label:'Συμπλήρωση Κενού', hint:'Γράψε τον τύπο'},
      {id:'match', label:'Αντιστοίχιση',     hint:'Αντιστοίχισε τύπο με μορφή'},
    ],
    onLaunch: eptLaunch, onClose: closeEpitheta });
}
function eptLaunch() {
  const selCards = document.querySelectorAll('#ept-level-grid .lvl-card.ept-sel');
  const modeVal  = document.getElementById('ept-sel-mode')?.value;
  if (!selCards.length || !modeVal) return;
  _eptLastSelIds = [...selCards].map(c => +c.dataset.lvlId).filter(Boolean);

  const allSubs = [];
  selCards.forEach(c => {
    JSON.parse(c.dataset.subs || '[]').forEach(s => { if (!allSubs.includes(s)) allSubs.push(s); });
  });

  _eptMode = modeVal;
  const active = _eptFilterAdj(allSubs);
  if (!active.length) { alert('Δεν βρέθηκαν επίθετα.'); return; }

  if (modeVal === 'match') {
    if (_eptState) { clearInterval(_eptState.timerInterval); if (_eptState.pendingTimeout) clearTimeout(_eptState.pendingTimeout); }
    const matchG = {};
    const isEn = typeof siteLang !== 'undefined' && siteLang === 'en';
    active.forEach(adj => {
      const genders = adj.d2 ? ['m','n'] : ['m','f','n'];
      genders.forEach(gk => {
        const gLabel = isEn
          ? (gk==='m'?(adj.d2?'M/F':'Masc.'):gk==='f'?'Fem.':'Neut.')
          : (gk==='m'?(adj.d2?'Αρσ./Θηλ.':'αρσενικό'):gk==='f'?'θηλυκό':'ουδέτερο');
        [true, false].forEach(isSg => {
          for (let ci = 0; ci < 5; ci++) {
            const ans = isSg ? adj[gk].s[ci] : adj[gk].p[ci];
            if (!ans || ans === '-') continue;
            const key = `${adj.l}|${gk}|${isSg?'sg':'pl'}|${ci}`;
            const cL = (isEn ? EPT_CASES_EN : EPT_CASES)[ci];
            const nL = isEn ? (isSg ? 'Sg.' : 'Pl.') : (isSg ? 'Εν.' : 'Πλ.');
            matchG[key] = {
              endings: [ans], fi_endings: [ans],
              _qt: `<div class="lq-main">${adj.l} — ${cL} ${nL} <span style="color:#8a9ab0;font-size:.85em;">(${gLabel})</span></div>`
            };
          }
        });
      });
    });
    if (!Object.keys(matchG).length) { alert('Δεν βρέθηκαν επίθετα.'); return; }
    _gramMatchDoneHook['ept']=(st)=>{_eptLastSelIds.forEach(id=>{try{const pkey=`ept_prog_${id}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');const data={best:Math.max(st.total,prev.best||0),completed:true,ts:Date.now()};localStorage.setItem(pkey,JSON.stringify(data));const card=document.querySelector(`#ept-level-grid .lvl-card[data-lvl-id="${id}"]`);if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className='lvl-badge lvl-badge-done';b.textContent='✓ '+data.best+'πτ';}}catch(e){}});};
    gramStartMatch('ept', matchG, () => Object.keys(matchG), () => '', g => g._qt, null, 'ept-wrap');
    return;
  }

  const t = parseInt(document.getElementById('ept-sel-time').value);
  const l = parseInt(document.getElementById('ept-sel-lives').value);
  _eptState = {
    score: 0, lives: l === 0 ? Infinity : l,
    timer: t, timerRemaining: t,
    timerInterval: null, answering: false, pendingTimeout: null,
    active, curr: null, mistakes: []
  };

  document.getElementById('ept-mc-area').style.display = _eptMode === 'mc' ? 'grid' : 'none';
  document.getElementById('ept-fi-area').style.display  = _eptMode === 'fi' ? 'block' : 'none';
  _eptShowScreen('ept-screen-game');
  _eptHUD();
  if (t > 0) _eptStartTimer();
  eptNext();
}

// ── TIMER ──
function _eptStartTimer() {
  _eptState.timerInterval = setInterval(() => {
    _eptState.timerRemaining--;
    const tv = document.getElementById('ept-tv');
    if (tv) {
      tv.textContent = _gramFmtSec(_eptState.timerRemaining);
      tv.classList.toggle('ltimer-warn', _eptState.timerRemaining <= 10);
      tv.classList.toggle('ltimer-caut', _eptState.timerRemaining <= 20 && _eptState.timerRemaining > 10);
    }
    if (_eptState.timerRemaining <= 0) _eptEndGame();
  }, 1000);
}

function _eptHUD() {
  const sv = document.getElementById('ept-sv'); if (sv) sv.textContent = _eptState.score;
  const lv = document.getElementById('ept-lv');
  if (lv) {
    if (_eptState.lives === Infinity) { lv.textContent = '∞'; lv.style.fontSize = '1.4rem'; }
    else lv.innerHTML = Array(_eptState.lives).fill('❤️').join('') || '💀';
  }
  const tv = document.getElementById('ept-tv');
  if (tv) { if (_eptState.timer === 0) { tv.textContent = '∞'; tv.classList.remove('ltimer-warn','ltimer-caut'); }
  else { tv.textContent = _gramFmtSec(_eptState.timerRemaining); } }
}

// ── NEXT QUESTION ──
function eptNext() {
  _eptState.answering = false;
  const fb = document.getElementById('ept-fb'); if (fb) { fb.textContent = ''; fb.className = 'lfeedback'; }

  let adj, gk, isSg, cIdx, ans, tries = 0;
  do {
    adj  = _eptState.active[Math.floor(Math.random() * _eptState.active.length)];
    // For d2 adjectives only ask m or n (m = m/f combined)
    const genders = adj.d2 ? ['m','n'] : ['m','f','n'];
    gk   = genders[Math.floor(Math.random() * genders.length)];
    isSg = Math.random() > 0.5;
    cIdx = Math.floor(Math.random() * 5);
    ans  = isSg ? adj[gk].s[cIdx] : adj[gk].p[cIdx];
    tries++;
  } while ((!ans || ans === '-') && tries < 60);

  if (!ans || ans === '-') { eptNext(); return; }
  _eptState.curr = { adj, gk, isSg, cIdx, ans };

  const isEn = typeof siteLang !== 'undefined' && siteLang === 'en';
  const caseLabel   = (isEn ? EPT_CASES_EN : EPT_CASES)[cIdx];
  const numLabel    = isEn ? (isSg ? 'Singular' : 'Plural') : (isSg ? 'Ενικός' : 'Πληθυντικός');
  const genderLabel = isEn
    ? (gk==='m' ? (adj.d2?'Masc./Fem.':'Masc.') : gk==='f' ? 'Fem.' : 'Neut.')
    : (gk==='m' ? (adj.d2?'Αρσ./Θηλ.':'αρσενικό') : gk==='f' ? 'θηλυκό' : 'ουδέτερο');
  const subLabel    = EPT_SUBS[adj.sub] || adj.sub;

  const qt = `<div class="lq-main" style="font-size:1.15rem;text-align:center;margin-bottom:8px;"><em>${adj.l}</em></div>` +
    `<div class="lq-tags">` +
    `<span class="lq-tag voice">${caseLabel}</span>` +
    `<span class="lq-tag tense">${numLabel}</span>` +
    `<span class="lq-tag gender">${genderLabel}</span>` +
    `<span class="lq-tag mood" style="font-size:.72rem;">${subLabel}</span>` +
    `</div>`;
  document.getElementById('ept-q').innerHTML = qt;

  if (_eptMode === 'mc') {
    const grid = document.getElementById('ept-mc-area'); grid.innerHTML = '';
    _eptGenOptions(adj, gk, isSg, cIdx, ans).forEach(opt => {
      const b = document.createElement('button'); b.className = 'lopt-btn'; b.textContent = opt;
      b.onclick = () => eptAnswer(opt); grid.appendChild(b);
    });
  } else {
    const inp = document.getElementById('ept-fi-input');
    if (inp) { inp.value = ''; inp.disabled = false; inp.style.borderColor = '#7a6030'; inp.focus(); }
    document.getElementById('ept-fi-submit').disabled = false;
    // Reset diacritics state
    if (typeof _gramTonos !== 'undefined') { _gramTonos['ept'] = null; _gramPneuma['ept'] = null; _gramYpogr['ept'] = false; }
    document.querySelectorAll('#ept-diac-row .lpoly-dkey').forEach(b => b.classList.remove('ldkey-active'));
    if (typeof gramRenderVowels === 'function') gramRenderVowels('ept');
  }
}

// ── GENERATE MC OPTIONS ──
function _eptGenOptions(adj, gk, isSg, cIdx, correct) {
  const norm = s => s.trim().normalize("NFD").replace(/[̀-ͯ]/g, '').toLowerCase();
  const used = new Set([norm(correct)]);
  const opts = [correct];
  const _wMetaMap = Object.create(null);
  const CASE_NAMES = ['nominative','genitive','dative','accusative','vocative'];
  const GK_NAMES = {m:'masculine',f:'feminine',n:'neuter'};
  const push = (f, meta) => {
    if (f && f !== '-' && !used.has(norm(f)) && opts.length < 4) {
      opts.push(f); used.add(norm(f));
      if (meta) _wMetaMap[f] = meta;
    }
  };

  // 1. Same word, different case (same number + gender) — highest priority: case confusion
  for (const ci of _eptShuffle([0,1,2,3,4].filter(i => i !== cIdx))) {
    if (opts.length >= 4) break;
    push(isSg ? adj[gk].s[ci] : adj[gk].p[ci], {
      category:'adjective_morphology', mutation_type:'incorrect_case',
      details:{expected:CASE_NAMES[cIdx], selected:CASE_NAMES[ci]}
    });
  }

  // 2. Same word, different number (same case + gender)
  if (opts.length < 4) {
    const f = isSg ? adj[gk].p[cIdx] : adj[gk].s[cIdx];
    push(f, {
      category:'adjective_morphology', mutation_type:'incorrect_number',
      details:{expected:isSg?'singular':'plural', selected:isSg?'plural':'singular'}
    });
  }

  // 3. Same word, different gender (same case + number)
  if (opts.length < 4) {
    const otherGenders = ['m','f','n'].filter(g => g !== gk);
    for (const og of _eptShuffle(otherGenders)) {
      if (opts.length >= 4) break;
      if (adj[og]) push(isSg ? adj[og].s[cIdx] : adj[og].p[cIdx], {
        category:'adjective_morphology', mutation_type:'incorrect_gender',
        details:{expected:GK_NAMES[gk], selected:GK_NAMES[og]}
      });
    }
  }

  // 4. Different adjective, same case + number (cross-lemma last resort)
  if (opts.length < 4) {
    const sameSub = _eptState.active.filter(o => o !== adj && o.sub === adj.sub);
    for (const o of _eptShuffle(sameSub)) {
      if (opts.length >= 4) break;
      const genders = o.d2 ? ['m','n'] : ['m','f','n'];
      const g2 = genders.includes(gk) ? gk : genders[0];
      push(isSg ? o[g2].s[cIdx] : o[g2].p[cIdx], {
        category:'adjective_morphology', mutation_type:'cross_lemma_case',
        details:{expected:CASE_NAMES[cIdx], distractor_lemma:o.l}
      });
    }
  }

  // 5. Any active adjective, any slot (absolute last resort)
  if (opts.length < 4) {
    const pool = [];
    _eptState.active.forEach(o => {
      ['m','f','n'].forEach(g => {
        if (!o[g]) return;
        [...o[g].s, ...o[g].p].forEach(f => { if (f && f !== '-' && !used.has(norm(f))) pool.push({f,l:o.l}); });
      });
    });
    for (const {f,l} of _eptShuffle(pool)) {
      if (opts.length >= 4) break;
      push(f, {category:'adjective_morphology', mutation_type:'cross_lemma_fallback', details:{distractor_lemma:l}});
    }
  }

  if (_eptState.curr) _eptState.curr._wrongMetaMap = _wMetaMap;
  return _eptShuffle(opts);
}

function _eptShuffle(a) { const b = [...a]; for (let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];} return b; }
const _eptNorm = s => s.trim().normalize("NFD").replace(/[̀-ͯ]/g, '').toLowerCase();

// ── ANSWER HANDLERS ──
function eptAnswer(chosen) {
  if (_eptState.answering) return;
  _eptState.answering = true;
  const ok = _eptNorm(chosen) === _eptNorm(_eptState.curr.ans);
  document.querySelectorAll('#ept-mc-area .lopt-btn').forEach(b => {
    b.disabled = true;
    if (_eptNorm(b.textContent) === _eptNorm(_eptState.curr.ans)) b.classList.add('lcorrect');
    else if (b.textContent === chosen && !ok) b.classList.add('lwrong');
  });
  const fb = document.getElementById('ept-fb');
  if (ok) {
    _eptState.score++;
    if (fb) { fb.textContent = '✓ Σωστό!'; fb.className = 'lfeedback lok'; }
  } else {
    const c = _eptState.curr;
    const isEn = typeof siteLang !== 'undefined' && siteLang === 'en';
    _eptState.mistakes.push({
      lemma: c.adj.l,
      caseLabel: EPT_CASES[c.cIdx],
      num: c.isSg ? 'Ενικός' : 'Πληθυντικός',
      gender: c.gk === 'm' ? (c.adj.d2?'Αρσ./Θηλ.':'αρσ.') : c.gk==='f'?'θηλ.':'ουδ.',
      typed: chosen, correct: c.ans
    });
    if(typeof logStudentMistake==='function') logStudentMistake('epitheta','epitheta','mc',{q:`${c.adj.l} — ${EPT_CASES[c.cIdx]} ${c.isSg?'Ενικός':'Πληθυντικός'}`,a:c.ans},chosen);
    if (fb) { fb.innerHTML = `✗ Λάθος — σωστό: <strong>${c.ans}</strong>`; fb.className = 'lfeedback lerr'; }
    const _m = c._wrongMetaMap?.[chosen];
    if (window.GE_CERBERUS_QUEUE && _m) window.GE_CERBERUS_QUEUE.push({gameId:'epitheta',subjectId:'ancient-greek',qt:document.getElementById('ept-q')?.innerHTML,chosen,correct:c.ans,error_metadata:_m,ts:Date.now()});
    if (_eptState.lives !== Infinity) {
      _eptState.lives--; _eptHUD();
      if (_eptState.lives <= 0) { _eptState.pendingTimeout = setTimeout(() => _eptEndGame(), 1200); return; }
    }
  }
  _eptHUD();
  _eptState.pendingTimeout = setTimeout(() => eptNext(), 1500);
}

function eptSubmitFI() {
  if (_eptState.answering) return;
  const inp = document.getElementById('ept-fi-input');
  const typed = inp ? inp.value.trim() : '';
  if (!typed) { inp?.focus(); return; }
  _eptState.answering = true;
  if (inp) inp.disabled = true;
  document.getElementById('ept-fi-submit').disabled = true;
  const ok = _eptNorm(typed) === _eptNorm(_eptState.curr.ans);
  if (inp) inp.style.borderColor = ok ? '#27ae60' : '#c0392b';
  const fb = document.getElementById('ept-fb');
  const c = _eptState.curr;
  if (ok) {
    _eptState.score++;
    if (fb) { fb.textContent = '✓ Σωστό!'; fb.className = 'lfeedback lok'; }
  } else {
    _eptState.mistakes.push({
      lemma: c.adj.l, caseLabel: EPT_CASES[c.cIdx],
      num: c.isSg ? 'Ενικός' : 'Πληθυντικός',
      gender: c.gk === 'm' ? (c.adj.d2?'Αρσ./Θηλ.':'αρσ.') : c.gk==='f'?'θηλ.':'ουδ.',
      typed, correct: c.ans
    });
    if(typeof logStudentMistake==='function') logStudentMistake('epitheta','epitheta','fi',{q:`${c.adj.l} — ${EPT_CASES[c.cIdx]} ${c.isSg?'Ενικός':'Πληθυντικός'}`,a:c.ans},typed);
    if (fb) { fb.innerHTML = `✗ Λάθος — σωστό: <strong>${c.ans}</strong>`; fb.className = 'lfeedback lerr'; }
    const _m = c._wrongMetaMap?.[typed];
    if (window.GE_CERBERUS_QUEUE && _m) window.GE_CERBERUS_QUEUE.push({gameId:'epitheta',subjectId:'ancient-greek',qt:document.getElementById('ept-q')?.innerHTML,chosen:typed,correct:c.ans,error_metadata:_m,ts:Date.now()});
    if (_eptState.lives !== Infinity) {
      _eptState.lives--; _eptHUD();
      if (_eptState.lives <= 0) { _eptState.pendingTimeout = setTimeout(() => _eptEndGame(), 1400); return; }
    }
  }
  _eptHUD();
  _eptState.pendingTimeout = setTimeout(() => eptNext(), 1600);
}

// ── END ──
function _eptEndGame() {
  clearInterval(_eptState.timerInterval);
  if (_eptState.pendingTimeout) clearTimeout(_eptState.pendingTimeout);
  if (_eptLastSelIds.length) {
    try {
      const done = _eptState.mistakes.length === 0 && _eptState.score > 0;
      _eptLastSelIds.forEach(id => {
        const k = `ept_prog_${id}`;
        const pv = JSON.parse(localStorage.getItem(k) || '{}');
        localStorage.setItem(k, JSON.stringify({best: Math.max(_eptState.score, pv.best||0), completed: pv.completed||done, ts: Date.now()}));
      });
      document.querySelectorAll('#ept-level-grid .lvl-card[data-lvl-id]').forEach(card => {
        const p = JSON.parse(localStorage.getItem(`ept_prog_${card.dataset.lvlId}`) || 'null');
        const ob = card.querySelector('.lvl-badge'); if (ob) ob.remove();
        if (p) { const b = document.createElement('div'); b.className = 'lvl-badge'+(p.completed?' lvl-badge-done':''); b.textContent = (p.completed?'✓':'↗')+' '+p.best+'πτ'; card.appendChild(b); }
      });
    } catch(e) {}
  }
  document.getElementById('ept-es').textContent = _eptState.score;
  const log = document.getElementById('ept-mistakes-log');
  if (!_eptState.mistakes.length) {
    log.innerHTML = '<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! Κανένα λάθος! 🎉</p>';
  } else {
    let h = `<div class="lmistakes-hdr">Λάθη: ${_eptState.mistakes.length}</div><div class="lmistakes-list">`;
    _eptState.mistakes.forEach(m => {
      h += `<div class="lmistake-row">` +
           `<div class="lm-q">${m.lemma} — ${m.caseLabel} ${m.num} (${m.gender})</div>` +
           `<div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div>` +
           `</div>`;
    });
    h += '</div>'; log.innerHTML = h;
  }
  _eptShowScreen('ept-screen-end');
}

function _eptRetry() {
  if (_eptState) {
    _eptState.score = 0;
    _eptState.lives = _eptState.lives === Infinity ? Infinity : parseInt(document.getElementById('ept-sel-lives')?.value || 3);
    _eptState.timerRemaining = _eptState.timer;
    _eptState.mistakes = []; _eptState.answering = false;
    if (_eptState.pendingTimeout) clearTimeout(_eptState.pendingTimeout);
    clearInterval(_eptState.timerInterval);
    _eptShowScreen('ept-screen-game'); _eptHUD();
    if (_eptState.timer > 0) _eptStartTimer();
    eptNext();
  } else { _eptToLevels(); }
}
