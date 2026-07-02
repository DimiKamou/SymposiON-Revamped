/* ══════════════════ ΕΠΤΑΠΥΛΟΣ — engine ══════════════════
   Connect Four, set at the siege of seven-gated Thebes. The board's 7
   columns are the seven gates. Quiz-to-move (triliza) core:
     • A question opens YOUR turn. Answer right → cast a bronze seal into
       any gate (column). Answer wrong / time out → you forfeit the cast and
       the rival champion presses forward.
     • The rival must "answer" too (skill roll); a stumble hands tempo back.
     • Align FOUR seals in a row — across, up, or slanting — to breach the
       wall and win. Fill all 42 holes with no line → the siege is a draw.
   Three earned twists, deployable on the move you won:
     • ΔΙΠΛΟ  (Double) — cast two seals this move        [answer FAST]
     • ΠΥΡ    (Pyre)   — burn out one enemy seal, gravity pulls the stack
                          down                            [3 correct in a row]
     • ΑΣΠΙΣ  (Aegis)  — wedge a neutral war-stone to wall off a line
                                                          [5 correct in a row]
   API:  Heptapylos.open(cfg)  Heptapylos.close()
   Reads window.HEP_Q if a launcher seeds it; otherwise the shared
   window.SYM_QUESTIONS bank — the current synthesis launch path uses the
   fallback (no per-engine HEP_Q bridge is wired yet). Also window.siteLang
   ('gr'|'en').
═══════════════════════════════════════════════════════════════════════════ */
const Heptapylos = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');
  // presentation-only: honor prefers-reduced-motion for particles/shakes
  const REDUCE = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Pick the language string from a question's `q`, tolerating {gr,en},
  // bare strings, {q:{gr,en}} wrappers and object-valued langs — so the
  // card never renders the literal "[object Object]" (host/picker banks may
  // deliver q as a bilingual object rather than a plain string).
  const QT = (q) => {
    if (q == null) return '';
    if (typeof q === 'string') return q;
    if (typeof q === 'object') {
      const v = q[L()] != null ? q[L()] : (q.gr != null ? q.gr : q.en);
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object') return QT(v);
      if (q.q !== undefined) return QT(q.q);
    }
    return String(q);
  };

  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _pool = () => {
    const g = window.HEP_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  // Board geometry & timing are configurable on the cover (see cfg / VARIANTS).
  let COLS = 7, ROWS = 6, N = 42, NEED = 4, DUR = 18000;
  const FAST = 0.62;            // ≥ this fraction of clock left ⇒ "fast" ⇒ Double charge
  const KEYS = ['Α', 'Β', 'Γ', 'Δ'];

  // ── Setup options (the "various games" beyond difficulty) ──
  const VARIANTS = {
    triliza: { cols: 6, rows: 5, need: 3 },
    tetras:  { cols: 7, rows: 6, need: 4 },
    pentas:  { cols: 9, rows: 7, need: 5 },
  };
  const TEMPOS = { relaxed: 28000, std: 18000, blitz: 10000 };
  let cfg = { variant: 'tetras', tempo: 'std', powers: 'on', first: 'me' };

  const ME = { name: 'ΕΣΥ', mono: 'Σ' };
  const CHAMPS = [
    { id: 'l', name: 'ΙΣΜΗΝΗ',     tier: { gr: 'ΦΥΛΑΚΑΣ', en: 'WARDEN' },   mono: 'Ι', skill: 0.55, smart: 0.45 },
    { id: 'm', name: 'ΕΤΕΟΚΛΗΣ',   tier: { gr: 'ΠΟΛΕΜΑΡΧΟΣ', en: 'WARLORD' }, mono: 'Ε', skill: 0.74, smart: 0.78 },
    { id: 'h', name: 'ΚΑΠΑΝΕΥΣ',   tier: { gr: 'ΗΜΙΘΕΟΣ', en: 'DEMIGOD' },  mono: 'Κ', skill: 0.9,  smart: 1.0 },
  ];

  let chosenChamp = 1;
  let st = {};

  function _setOpt(key, val) { cfg[key] = val; renderSetup(); }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const t = document.querySelector('#hep-overlay .overlay-title'); if (t) t.textContent = gp.title; }
    document.getElementById('hep-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('hep-screen-intro')) build();
    syncLang();
    show('hep-screen-intro');
  }
  function close() {
    stopTimer();
    document.getElementById('hep-overlay').classList.remove('active');
    document.body.style.overflow = '';
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('hep-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'hep-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeHeptapylos()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9', 'BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u0395\u03a0\u03a4\u0391\u03a0\u03a5\u039b\u039f\u03a3') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L() === 'en' ? '' : 'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L() === 'en' ? 'on' : '') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="hep-wrap"></div></div>';
    document.body.appendChild(ov);
    ov.querySelectorAll('.ov-lang button').forEach(b => {
      b.addEventListener('click', () => {
        window.siteLang = b.dataset.lang;
        ov.querySelectorAll('.ov-lang button').forEach(x => x.classList.toggle('on', x === b));
        syncLang();
      });
    });
  }

  /* ───────── build markup ───────── */
  function build() {
    document.getElementById('hep-wrap').innerHTML = `
<div class="hep-ambient" id="hep-ambient" aria-hidden="true"></div>
<!-- INTRO -->
<div id="hep-screen-intro" class="hep-screen">
  ${crestSVG('hep-crest')}
  <div class="hep-logo">ΕΠΤΑΠΥΛΟΣ</div>
  <div class="hep-logo-en" data-i18n="subtitle"></div>
  <div class="hep-meander" aria-hidden="true"></div>
  <div class="hep-intro-txt" data-i18n="intro"></div>
  <div class="hep-powers-legend">
    <div class="hep-pl"><span class="hep-pl-glyph" style="background:rgba(196,164,72,0.25);color:var(--sym-gold-lt)">⛀</span><span class="hep-pl-txt"><span class="hep-pl-name" data-i18n="pDouble"></span><span class="hep-pl-how" data-i18n="pDoubleHow"></span></span></div>
    <div class="hep-pl"><span class="hep-pl-glyph" style="background:rgba(217,123,92,0.25);color:var(--sym-terra-lt)">🜂</span><span class="hep-pl-txt"><span class="hep-pl-name" data-i18n="pBurn"></span><span class="hep-pl-how" data-i18n="pBurnHow"></span></span></div>
    <div class="hep-pl"><span class="hep-pl-glyph" style="background:rgba(142,130,112,0.3);color:#D8CCB7">⬡</span><span class="hep-pl-txt"><span class="hep-pl-name" data-i18n="pBlock"></span><span class="hep-pl-how" data-i18n="pBlockHow"></span></span></div>
  </div>
  <div class="hep-pick-lbl" data-i18n="setupLbl"></div>
  <div class="hep-setup" id="hep-setup"></div>
  <div class="hep-pick-lbl" data-i18n="pick"></div>
  <div class="hep-champs" id="hep-champs"></div>
  <button class="sym-btn" onclick="Heptapylos._start()" data-i18n="begin"></button>
</div>

<!-- GAME -->
<div id="hep-screen-game" class="hep-screen">
  <div class="hep-hud">
    <div class="hep-side me" id="hep-side-me">
      <div class="hep-side-seal">Σ</div>
      <div class="hep-side-txt"><span class="hep-side-name">ΕΣΥ</span><span class="hep-side-sub" data-i18n="youSub"></span></div>
    </div>
    <div class="hep-vs">VS</div>
    <div class="hep-side op" id="hep-side-op">
      <div class="hep-side-seal" id="hep-op-seal">Ε</div>
      <div class="hep-side-txt"><span class="hep-side-name" id="hep-op-name">—</span><span class="hep-side-sub" id="hep-op-sub">—</span></div>
    </div>
  </div>
  <div class="hep-turn-banner" id="hep-turn-banner"></div>

  <div class="hep-board-wrap">
    <div class="hep-board">
      <div class="hep-gates" id="hep-gates"></div>
      <div class="hep-grid" id="hep-grid"></div>
    </div>
  </div>

  <div class="hep-powerbar" id="hep-powerbar"></div>

  <div class="hep-qbody" id="hep-qbody">
    <div class="hep-q-meta">
      <span class="hep-qcount" id="hep-qcount"></span>
      <span class="hep-streak" id="hep-streak"></span>
    </div>
    <div class="hep-q-card"><div class="hep-q-text" id="hep-qtext"></div></div>
    <div class="hep-timer"><div class="hep-timer-fill" id="hep-timer-fill"></div></div>
    <div class="hep-answers" id="hep-answers"></div>
    <div class="hep-feedback" id="hep-feedback"></div>
  </div>
</div>

<!-- END -->
<div id="hep-screen-end" class="hep-screen">
  ${crestSVG('hep-end-crest')}
  <div class="hep-end-title" id="hep-end-title"></div>
  <div class="hep-end-sub" id="hep-end-sub"></div>
  <div class="hep-end-stats" id="hep-end-stats"></div>
  <div class="hep-end-btns">
    <button class="sym-btn" onclick="Heptapylos._toIntro()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Heptapylos.close()" data-i18n="exit"></button>
  </div>
</div>`;
    renderChamps();
    renderSetup();
    fxAmbient();
  }

  function renderSetup() {
    const w = document.getElementById('hep-setup'); if (!w) return;
    const seg = (key, label, items) =>
      `<div class="hep-opt-group"><div class="hep-opt-label">${label}</div><div class="hep-seg">` +
      items.map(it => `<button class="${cfg[key] === it.val ? 'on' : ''}" onclick="Heptapylos._setOpt('${key}','${it.val}')">${it.main}${it.sub ? `<small>${it.sub}</small>` : ''}</button>`).join('') +
      `</div></div>`;
    w.innerHTML =
      seg('variant', T('ΠΑΡΑΛΛΑΓΗ', 'VARIANT'), [
        { val: 'triliza', main: T('ΤΡΙΛΙΖΑ', 'TRILIZA'), sub: T('3 σε σειρά', 'line 3') },
        { val: 'tetras',  main: T('ΤΕΤΡΑΣ', 'TETRAS'),   sub: T('4 σε σειρά', 'line 4') },
        { val: 'pentas',  main: T('ΠΕΝΤΑΣ', 'PENTAS'),   sub: T('5 σε σειρά', 'line 5') },
      ]) +
      seg('tempo', T('ΧΡΟΝΟΣ', 'TEMPO'), [
        { val: 'relaxed', main: T('ΑΝΕΤΟΣ', 'RELAXED'),    sub: '28s' },
        { val: 'std',     main: T('ΚΑΝΟΝΙΚΟΣ', 'STANDARD'), sub: '18s' },
        { val: 'blitz',   main: T('ΑΣΤΡΑΠΗ', 'BLITZ'),     sub: '10s' },
      ]) +
      seg('powers', T('ΔΥΝΑΜΕΙΣ', 'POWERS'), [
        { val: 'on',  main: T('ΜΕ', 'ON'),    sub: T('διπλό·πυρ·ασπίς', '3 twists') },
        { val: 'off', main: T('ΧΩΡΙΣ', 'OFF'), sub: T('καθαρό', 'pure') },
      ]) +
      seg('first', T('ΠΡΩΤΗ ΚΙΝΗΣΗ', 'FIRST'), [
        { val: 'me',   main: T('ΕΣΥ', 'YOU') },
        { val: 'op',   main: T('ΑΝΤΙΠΑΛΟΣ', 'RIVAL') },
        { val: 'toss', main: T('ΚΛΗΡΟΣ', 'TOSS') },
      ]);
    const legend = document.querySelector('.hep-powers-legend');
    if (legend) legend.classList.toggle('dim', cfg.powers === 'off');
  }

  const I18N = {
    subtitle:   { gr: 'Connect Four · Οι Επτά Πύλες των Θηβών', en: 'Connect Four · The Seven Gates of Thebes' },
    intro:      { gr: 'Οι <b>επτά στήλες</b> είναι οι επτά πύλες. Απάντησε <b>σωστά</b> για να ρίξεις χάλκινη σφραγίδα σε μια πύλη· <b>λάθος</b> και χάνεις τη ρίψη — ο αντίπαλος προελαύνει. Παράταξε <b>τέσσερις στη σειρά</b> και ράγισε το τείχος.', en: 'The <b>seven columns</b> are the seven gates. Answer <b>correctly</b> to cast a bronze seal into a gate; answer <b>wrong</b> and you forfeit the cast — the rival presses on. Align <b>four in a row</b> to breach the wall.' },
    pDouble:    { gr: 'ΔΙΠΛΟ', en: 'DOUBLE' },
    pDoubleHow: { gr: 'Γρήγορη απάντηση · ρίξε 2', en: 'Fast answer · cast 2' },
    pBurn:      { gr: 'ΠΥΡ', en: 'PYRE' },
    pBurnHow:   { gr: '3 στη σειρά · κάψε σφραγίδα', en: '3-streak · burn a seal' },
    pBlock:     { gr: 'ΑΣΠΙΣ', en: 'AEGIS' },
    pBlockHow:  { gr: '5 στη σειρά · πέτρα-φραγμός', en: '5-streak · wall-stone' },
    pick:       { gr: 'ΔΙΑΛΕΞΕ ΑΝΤΙΠΑΛΟ', en: 'CHOOSE YOUR RIVAL' },
    setupLbl:   { gr: 'ΣΤΗΣΕ ΤΟ ΠΑΙΧΝΙΔΙ', en: 'SET UP THE GAME' },
    begin:      { gr: 'ΣΤΗΣΕ ΤΗΝ ΠΟΛΙΟΡΚΙΑ', en: 'LAY THE SIEGE' },
    youSub:     { gr: 'χάλκινη σφραγίδα', en: 'bronze seal' },
    again:      { gr: 'ΝΕΑ ΠΟΛΙΟΡΚΙΑ', en: 'NEW SIEGE' },
    exit:       { gr: 'ΕΞΟΔΟΣ', en: 'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#hep-wrap [data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n'); if (I18N[k]) el.innerHTML = I18N[k][L()];
    });
    renderChamps();
    renderSetup();
    if (st && st.cur && document.getElementById('hep-screen-game').classList.contains('active')) {
      document.getElementById('hep-qtext').textContent = QT(st.cur.q);
      renderPowerbar(); renderHUD();
    }
  }
  function show(id) {
    document.querySelectorAll('#hep-wrap .hep-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  function _toIntro() { show('hep-screen-intro'); }

  function renderChamps() {
    const wrap = document.getElementById('hep-champs'); if (!wrap) return;
    wrap.innerHTML = CHAMPS.map((c, i) => `
      <div class="hep-champ${i === chosenChamp ? ' on' : ''}" onclick="Heptapylos._pickChamp(${i})">
        <div class="hep-champ-seal">${c.mono}</div>
        <div class="hep-champ-name">${c.name}</div>
        <div class="hep-champ-tier">${c.tier[L()]}</div>
      </div>`).join('');
  }
  function _pickChamp(i) { chosenChamp = i; renderChamps(); }

  /* ───────── start ───────── */
  function _start() {
    stopTimer();
    // apply setup options
    const V = VARIANTS[cfg.variant] || VARIANTS.tetras;
    COLS = V.cols; ROWS = V.rows; N = COLS * ROWS; NEED = V.need;
    DUR = TEMPOS[cfg.tempo] || 18000;
    const powersOn = cfg.powers === 'on';
    let first = cfg.first === 'toss' ? (Math.random() < 0.5 ? 'me' : 'op') : cfg.first;

    const champ = CHAMPS[chosenChamp];
    st = {
      grid: new Array(N).fill(null),   // null | 'me' | 'op' | 'block'
      turn: 'me',
      phase: 'q',                      // q | drop | burn | block | anim | over
      cur: null, qNum: 0, answered: false,
      pool: shuffle([..._pool()]), idx: 0,
      streak: 0, correct: 0, asked: 0, seals: 0,
      powers: { double: 0, burn: 0, block: 0 },
      powersOn, need: NEED, variant: cfg.variant,
      armed: null,                     // 'double' | 'block' | null
      dropsLeft: 1,
      champ,
      winLine: null, winner: null,
    };
    document.getElementById('hep-op-name').textContent = champ.name;
    document.getElementById('hep-op-sub').textContent = champ.tier[L()];
    document.getElementById('hep-op-seal').textContent = champ.mono;
    buildBoard();
    show('hep-screen-game');
    renderHUD(); renderPowerbar();
    if (first === 'op') {
      setTurn('op');
      banner(T('Ο ΚΛΗΡΟΣ ΟΡΙΣΕ — ξεκινά ο αντίπαλος', 'THE LOT IS CAST — the rival opens'), 'var(--hep-op)');
      document.getElementById('hep-qbody').style.display = 'none';
      setTimeout(opTurn, 1100);
    } else {
      setTurn('me');
      nextQ();
    }
  }

  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
  function getQ() { if (st.idx >= st.pool.length) { st.pool = shuffle([..._pool()]); st.idx = 0; } return st.pool[st.idx++]; }

  /* ───────── board grid helpers ───────── */
  const rc = i => [(i / COLS) | 0, i % COLS];
  const idx = (r, c) => r * COLS + c;
  function lowestEmpty(col) { for (let r = ROWS - 1; r >= 0; r--) { if (st.grid[idx(r, col)] === null) return r; } return -1; }
  function colFull(col) { return lowestEmpty(col) < 0; }
  function boardFull() { return st.grid.every(v => v !== null); }

  function buildBoard() {
    const colsCSS = `repeat(${COLS},1fr)`;
    const gates = document.getElementById('hep-gates');
    gates.innerHTML = Array.from({ length: COLS }, (_, c) =>
      `<div class="hep-gate-no"><span class="hep-arch"></span><span class="hep-gate-num">${c + 1}</span></div>`).join('');
    gates.style.gridTemplateColumns = colsCSS;
    const g = document.getElementById('hep-grid');
    let html = '';
    for (let i = 0; i < N; i++) {
      const [, c] = rc(i);
      html += `<div class="hep-cell" data-i="${i}" data-c="${c}"><div class="hep-hole"></div></div>`;
    }
    html += '<div class="hep-col-ghost" id="hep-col-ghost"><div class="arrow">▼</div></div>';
    g.innerHTML = html;
    g.style.gridTemplateColumns = colsCSS;
    const board = g.closest('.hep-board');
    if (board) {
      board.style.width = `min(${COLS * 64}px, 92vw)`;
      // clear any victory FX left over from the previous siege
      board.querySelectorAll('.hep-crack, .hep-stamp').forEach(el => el.remove());
    }
    const ghost = document.getElementById('hep-col-ghost');
    if (ghost) ghost.style.width = (100 / COLS) + '%';
    g.onclick = onBoardClick;
    g.onmousemove = onBoardHover;
    g.onmouseleave = clearColHL;
  }

  function onBoardHover(e) {
    if (st.phase !== 'drop' && st.phase !== 'block') return;
    const cell = e.target.closest('.hep-cell'); if (!cell) { clearColHL(); return; }
    highlightCol(+cell.dataset.c);
  }
  function highlightCol(col) {
    const g = document.getElementById('hep-grid');
    g.classList.add('col-hl-on');
    g.querySelectorAll('.hep-cell').forEach(el => el.classList.toggle('colhl', +el.dataset.c === col && !colFull(col)));
    const ghost = document.getElementById('hep-col-ghost');
    if (!colFull(col)) {
      ghost.style.left = (col * (100 / COLS)) + '%';
      ghost.querySelector('.arrow').style.color = st.armed === 'block' ? '#D8CCB7' : 'var(--sym-terra-lt)';
      ghost.classList.add('show');
    } else ghost.classList.remove('show');
  }
  function clearColHL() {
    const g = document.getElementById('hep-grid'); if (!g) return;
    g.classList.remove('col-hl-on');
    g.querySelectorAll('.colhl').forEach(el => el.classList.remove('colhl'));
    const ghost = document.getElementById('hep-col-ghost'); if (ghost) ghost.classList.remove('show');
  }

  function onBoardClick(e) {
    if (st.phase === 'burn') {
      const disc = e.target.closest('.hep-disc.op');
      if (disc) burnSeal(+disc.parentElement.dataset.i);
      return;
    }
    if (st.phase !== 'drop' && st.phase !== 'block') return;
    const cell = e.target.closest('.hep-cell'); if (!cell) return;
    const col = +cell.dataset.c;
    if (colFull(col)) return;
    const kind = st.phase === 'block' ? 'block' : 'me';
    dropInto(col, kind, 'me');
  }

  /* ───────── place a seal with falling animation ───────── */
  function dropInto(col, kind, who, cb) {
    const r = lowestEmpty(col); if (r < 0) { if (cb) cb(); return; }
    const i = idx(r, col);
    st.grid[i] = kind;
    clearColHL();
    st.phase = 'anim';
    const cell = document.querySelector(`.hep-cell[data-i="${i}"]`);
    const disc = document.createElement('div');
    disc.className = 'hep-disc ' + kind + ' drop';
    disc.style.setProperty('--fall', (r + 1));
    if (kind !== 'block') disc.innerHTML = `<span class="hep-disc-mk">${kind === 'me' ? ME.mono : st.champ.mono}</span>`;
    cell.appendChild(disc);
    if (kind === 'me' && who === 'me') { st.seals++; }
    // presentational: dust puff + gate-plaque pop + tiny thud shake at landing
    if (!REDUCE()) setTimeout(() => { fxLand(cell, kind, col, r); }, 300);
    setTimeout(() => {
      const result = checkWin(kind === 'me' ? 'me' : kind === 'op' ? 'op' : null);
      if (kind !== 'block' && result) { return finishWin(who, result); }
      if (cb) cb(); else postDrop(who);
    }, 440);
  }

  /* after a drop resolves (no win): continue double, or pass turn */
  function postDrop(who) {
    if (who === 'me' && st.dropsLeft > 1) {
      st.dropsLeft--;
      st.phase = 'drop';
      banner(T('ΔΙΠΛΟ — ρίξε ακόμη μία σφραγίδα', 'DOUBLE — cast one more seal'), 'var(--sym-gold-lt)');
      enableDrop();
      return;
    }
    st.dropsLeft = 1; st.armed = null; renderPowerbar();
    if (boardFull()) return endDraw();
    if (who === 'me') opTurn(); else { setTurn('me'); nextQ(); }
  }

  /* ───────── PYRE: burn an enemy seal, gravity collapses the column ───────── */
  function burnSeal(i) {
    if (st.powers.burn < 1) return;
    st.powers.burn--; st.phase = 'anim';
    document.getElementById('hep-grid').classList.remove('burnmode');
    const disc = document.querySelector(`.hep-cell[data-i="${i}"] .hep-disc`);
    if (disc) {
      disc.classList.add('removing');
      fxBurstAt(disc, { colors: ['#FFD9A0', '#E8A15A', '#D97B5C', '#9E3B2E'], count: 16, power: 5, life: 800 });
    }
    banner(T('ΠΥΡ! Η σφραγίδα κάηκε', 'PYRE! The seal is burned'), 'var(--sym-terra-lt)');
    setTimeout(() => {
      const [r, c] = rc(i);
      // collapse: pull everything above down by one
      for (let rr = r; rr > 0; rr--) st.grid[idx(rr, c)] = st.grid[idx(rr - 1, c)];
      st.grid[idx(0, c)] = null;
      repaintColumn(c);
      renderPowerbar();
      // a collapse can complete a line for EITHER side — re-scan whole board
      const w = checkWin('me') || checkWin('op');
      if (w) return finishWin(w.who === 'me' ? 'me' : 'op', w);
      st.armed = null; st.dropsLeft = 1;
      if (boardFull()) return endDraw();
      opTurn();
    }, 520);
  }
  function repaintColumn(c) {
    for (let r = 0; r < ROWS; r++) {
      const i = idx(r, c);
      const cell = document.querySelector(`.hep-cell[data-i="${i}"]`);
      const old = cell.querySelector('.hep-disc'); if (old) old.remove();
      const kind = st.grid[i];
      if (kind) {
        const disc = document.createElement('div');
        disc.className = 'hep-disc ' + kind + ' settle';
        if (kind !== 'block') disc.innerHTML = `<span class="hep-disc-mk">${kind === 'me' ? ME.mono : st.champ.mono}</span>`;
        cell.appendChild(disc);
      }
    }
  }

  /* ───────── win detection ───────── */
  const DIRS = [[0, 1], [1, 0], [1, 1], [1, -1]];
  function checkWin(who) {
    if (!who) return null;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (st.grid[idx(r, c)] !== who) continue;
        for (const [dr, dc] of DIRS) {
          const line = [idx(r, c)];
          let rr = r + dr, cc = c + dc;
          while (rr >= 0 && rr < ROWS && cc >= 0 && cc < COLS && st.grid[idx(rr, cc)] === who) {
            line.push(idx(rr, cc)); rr += dr; cc += dc;
            if (line.length === NEED) return { who, line };
          }
        }
      }
    }
    return null;
  }

  function finishWin(mover, result) {
    st.phase = 'over';
    st.winLine = result.line;
    st.winner = result.who;
    result.line.forEach(i => { const d = document.querySelector(`.hep-cell[data-i="${i}"] .hep-disc`); if (d) d.classList.add('win'); });
    stopTimer();
    // ── presentational victory set-piece: wall-crack + rubble + seal stamp ──
    fxCrack(result.line);
    fxStamp(result.who === 'me' ? T('ΡΗΓΜΑ!', 'BREACH!') : T('ΟΙ ΠΥΛΕΣ ΚΡΑΤΟΥΝ', 'THE GATES HOLD'),
            result.who === 'me' ? '' : 'op');
    if (!REDUCE()) {
      fxFlash(result.who === 'me' ? 'rgba(232,161,90,0.28)' : 'rgba(94,139,150,0.26)');
      fxShake(document.querySelector('.hep-board'), 9, 500);
      fxShake(document.getElementById('hep-wrap'), 4, 420);
      const rubble = result.who === 'me'
        ? ['#FFD9A0', '#E8A985', '#C4A448', '#8E8270', '#6B5D49']
        : ['#9FCAD4', '#7FB0BC', '#8E8270', '#6B5D49'];
      result.line.forEach((i, k) => {
        setTimeout(() => {
          const d = document.querySelector(`.hep-cell[data-i="${i}"]`);
          fxBurstAt(d, { colors: rubble, count: 12, power: 6, life: 950 });
        }, 120 + k * 90);
      });
    }
    setTimeout(() => end(result.who), 1100);
  }

  /* ───────── turn / banner ───────── */
  function setTurn(who) {
    st.turn = who;
    document.getElementById('hep-side-me').classList.toggle('active', who === 'me');
    document.getElementById('hep-side-op').classList.toggle('active', who === 'op');
  }
  function banner(txt, color) {
    const b = document.getElementById('hep-turn-banner');
    b.textContent = txt; b.style.color = color || 'var(--sym-stone)';
    // kinetic re-entry (CSS keeps this inert under prefers-reduced-motion)
    b.classList.remove('flip'); void b.offsetWidth; b.classList.add('flip');
  }

  /* ───────── YOUR turn: question ───────── */
  function nextQ() {
    if (boardFull()) return endDraw();
    st.phase = 'q'; st.answered = false; st.cur = getQ(); st.qNum++; st.asked++;
    setTurn('me');
    banner(T('Η ΣΕΙΡΑ ΣΟΥ — απάντησε για να ρίξεις', 'YOUR TURN — answer to cast'), 'var(--hep-me)');
    document.getElementById('hep-qbody').style.display = '';
    document.getElementById('hep-qcount').textContent = T('ΕΡΩΤΗΣΗ ', 'QUESTION ') + st.qNum;
    renderStreak();
    document.getElementById('hep-qtext').textContent = QT(st.cur.q);
    const card = document.querySelector('.hep-q-card');
    if (card) { card.classList.remove('fresh'); void card.offsetWidth; card.classList.add('fresh'); }
    const fb = document.getElementById('hep-feedback'); fb.textContent = ''; fb.className = 'hep-feedback';
    const wrap = document.getElementById('hep-answers'); wrap.innerHTML = '';
    st.cur.a.forEach((opt, i) => {
      const b = document.createElement('button'); b.className = 'hep-ans'; b.disabled = false;
      b.innerHTML = `<span class="hep-ans-key">${KEYS[i]}</span><span class="hep-ans-txt">${opt}</span>`;
      b.onclick = () => answer(i); wrap.appendChild(b);
    });
    renderPowerbar();
    document.getElementById('hep-timer-fill').style.width = '100%';
    startTimer();
  }

  function answer(choice) {
    if (st.answered) return; st.answered = true; stopTimer();
    const correct = choice === st.cur.c;
    if (!correct && window.symLogMistake) {
      try { window.symLogMistake({ q: st.cur.q, wrong: (st.cur.a && st.cur.a[choice]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Επτάπυλος', gameId: 'heptapylos' }); } catch (_) {}
    }
    const speed = frac();
    document.querySelectorAll('#hep-answers .hep-ans').forEach((b, i) => {
      b.disabled = true;
      if (i === st.cur.c) { b.classList.add('correct'); b.insertAdjacentHTML('beforeend', '<span class="hep-ans-mark">✓</span>'); }
      else if (i === choice) { b.classList.add('wrong'); b.insertAdjacentHTML('beforeend', '<span class="hep-ans-mark">✕</span>'); }
      else b.classList.add('dim');
    });
    const fb = document.getElementById('hep-feedback');
    if (correct) {
      st.correct++; st.streak++;
      let earned = [];
      if (st.powersOn) {
        if (speed >= FAST) { st.powers.double++; earned.push(T('ΔΙΠΛΟ', 'DOUBLE')); }
        if (st.streak === 3) { st.powers.burn++; earned.push(T('ΠΥΡ', 'PYRE')); }
        if (st.streak === 5) { st.powers.block++; earned.push(T('ΑΣΠΙΣ', 'AEGIS')); }
      }
      fb.className = 'hep-feedback ok';
      fb.textContent = earned.length
        ? T('ΣΩΣΤΑ! Κέρδισες: ' + earned.join(' + '), 'CORRECT! Earned: ' + earned.join(' + '))
        : T('ΣΩΣΤΑ — διάλεξε πύλη και ρίξε', 'CORRECT — pick a gate and cast');
      const okBtn = document.querySelectorAll('#hep-answers .hep-ans')[st.cur.c];
      fxBurstAt(okBtn, { colors: ['#E3C766', '#F4D9B0', '#D97B5C'], count: 12, power: 4.5, life: 750 });
      earned.forEach((name, k) => setTimeout(() => fxFloatAt(okBtn, '+' + name, '#E3C766'), 180 + k * 260));
      renderStreak(); renderPowerbar();
      st.dropsLeft = 1; st.armed = null;
      enterDrop();
    } else {
      st.streak = 0; renderStreak();
      fb.className = 'hep-feedback bad';
      fb.textContent = choice === -1
        ? T('Ο ΧΡΟΝΟΣ ΤΕΛΕΙΩΣΕ — ο αντίπαλος προελαύνει', 'TIME UP — the rival presses on')
        : T('ΛΑΘΟΣ — χάνεις τη ρίψη', 'WRONG — you forfeit the cast');
      fxShake(document.querySelector('.hep-q-card'), 6, 320);
      renderPowerbar();
      setTimeout(opTurn, 850);
    }
  }

  function enterDrop() {
    st.phase = 'drop';
    banner(st.powersOn
      ? T('ΔΙΑΛΕΞΕ ΠΥΛΗ — ή χρησιμοποίησε δύναμη', 'CHOOSE A GATE — or spend a power')
      : T('ΔΙΑΛΕΞΕ ΠΥΛΗ', 'CHOOSE A GATE'), 'var(--hep-me)');
    enableDrop();
  }
  function enableDrop() {
    document.getElementById('hep-grid').classList.add('droppable');
    document.getElementById('hep-grid').classList.remove('burnmode');
    renderPowerbar();
  }

  /* ───────── power bar ───────── */
  function renderPowerbar() {
    const bar = document.getElementById('hep-powerbar'); if (!bar) return;
    if (st && st.powersOn === false) { bar.style.display = 'none'; bar.innerHTML = ''; return; }
    bar.style.display = '';
    const usable = st.phase === 'drop';
    const defs = [
      { k: 'double', cls: 'double', ico: '⛀', label: T('ΔΙΠΛΟ', 'DOUBLE') },
      { k: 'burn',   cls: 'burn',   ico: '🜂', label: T('ΠΥΡ', 'PYRE') },
      { k: 'block',  cls: 'block',  ico: '⬡', label: T('ΑΣΠΙΣ', 'AEGIS') },
    ];
    bar.innerHTML = defs.map(d => {
      const n = st.powers[d.k];
      const ready = usable && n > 0 && !(d.k === 'double' && st.dropsLeft > 1);
      const armed = (d.k === 'double' && st.dropsLeft > 1) || (st.armed === d.k);
      return `<div class="hep-power ${d.cls}${ready ? ' ready' : ''}${armed ? ' armed' : ''}" ${ready ? `onclick="Heptapylos._power('${d.k}')"` : ''}>
        <span class="hep-power-ico">${d.ico}</span>${d.label}<span class="hep-power-n">×${n}</span></div>`;
    }).join('');
  }
  function _power(k) {
    if (st.phase !== 'drop' || st.powers[k] < 1) return;
    if (k === 'double') {
      st.powers.double--; st.dropsLeft = 2;
      banner(T('ΔΙΠΛΟ ΕΝΕΡΓΟ — ρίξε δύο σφραγίδες', 'DOUBLE ARMED — cast two seals'), 'var(--sym-gold-lt)');
      renderPowerbar();
    } else if (k === 'block') {
      st.armed = (st.armed === 'block') ? null : 'block';
      st.phase = st.armed === 'block' ? 'block' : 'drop';
      banner(st.armed === 'block'
        ? T('ΑΣΠΙΣ — διάλεξε πύλη για πέτρα-φραγμό', 'AEGIS — pick a gate for the wall-stone')
        : T('ΔΙΑΛΕΞΕ ΠΥΛΗ', 'CHOOSE A GATE'), '#D8CCB7');
      renderPowerbar();
    } else if (k === 'burn') {
      // need at least one enemy seal on the board
      if (!st.grid.includes('op')) { banner(T('Καμία εχθρική σφραγίδα για κάψιμο', 'No enemy seal to burn'), 'var(--sym-stone)'); return; }
      st.phase = 'burn'; st.armed = 'burn';
      document.getElementById('hep-grid').classList.add('burnmode');
      clearColHL();
      banner(T('ΠΥΡ — διάλεξε εχθρική σφραγίδα', 'PYRE — pick an enemy seal'), 'var(--sym-terra-lt)');
      renderPowerbar();
    }
  }

  /* ───────── RIVAL turn ───────── */
  function opTurn() {
    st.phase = 'anim';
    document.getElementById('hep-grid').classList.remove('droppable', 'burnmode');
    document.getElementById('hep-qbody').style.display = 'none';
    setTurn('op');
    banner(st.champ.name + T(' σκέφτεται…', ' is thinking…'), 'var(--hep-op)');
    setTimeout(() => {
      // rival must "answer" — a stumble forfeits the move
      if (Math.random() > st.champ.skill) {
        banner(st.champ.name + T(' δίστασε — η σειρά ξανά σε σένα', ' faltered — your turn again'), 'var(--hep-op)');
        setTimeout(() => { document.getElementById('hep-qbody').style.display = ''; setTurn('me'); nextQ(); }, 900);
        return;
      }
      const col = aiPick();
      banner(st.champ.name + T(' ρίχνει στην πύλη ', ' casts into gate ') + (col + 1), 'var(--hep-op)');
      dropInto(col, 'op', 'op');
    }, 950);
  }

  /* AI: win > block your win > prefer center (smarter champs look ahead more) */
  function aiPick() {
    const avail = [];
    for (let c = 0; c < COLS; c++) if (!colFull(c)) avail.push(c);
    // 1. winning move
    for (const c of avail) if (wouldWin(c, 'op')) return c;
    // 2. block player's winning move (skill-gated awareness)
    if (Math.random() < st.champ.smart) {
      for (const c of avail) if (wouldWin(c, 'me')) return c;
    }
    // 3. avoid handing player a win directly above (smart champs only)
    let safe = avail.slice();
    if (Math.random() < st.champ.smart) {
      const filtered = avail.filter(c => {
        const r = lowestEmpty(c); if (r <= 0) return true;
        // simulate our drop, then check if player could win on top
        st.grid[idx(r, c)] = 'op';
        const bad = wouldWin(c, 'me');
        st.grid[idx(r, c)] = null;
        return !bad;
      });
      if (filtered.length) safe = filtered;
    }
    // 4. center-weighted choice
    const center = (COLS - 1) / 2;
    const weight = c => COLS - Math.abs(c - center);
    const tot = safe.reduce((s, c) => s + weight(c), 0);
    let roll = Math.random() * tot;
    for (const c of safe) { roll -= weight(c); if (roll <= 0) return c; }
    return safe[0];
  }
  function wouldWin(col, who) {
    const r = lowestEmpty(col); if (r < 0) return false;
    const i = idx(r, col); st.grid[i] = who;
    const win = !!checkWin(who); st.grid[i] = null; return win;
  }

  /* ───────── timer ───────── */
  function startTimer() {
    stopTimer(); st.tStart = performance.now();
    const fill = document.getElementById('hep-timer-fill');
    st.timer = setInterval(() => {
      const el = performance.now() - st.tStart, f = Math.max(0, 1 - el / DUR);
      fill.style.width = (f * 100) + '%'; fill.classList.toggle('warn', f < 0.32);
      if (el >= DUR) { stopTimer(); if (!st.answered) answer(-1); }
    }, 50);
  }
  function stopTimer() { if (st.timer) { clearInterval(st.timer); st.timer = null; } }
  function frac() { return Math.max(0, 1 - (performance.now() - st.tStart) / DUR); }

  /* ───────── HUD / streak ───────── */
  function renderHUD() {
    if (!st.champ) return;
    document.getElementById('hep-op-name').textContent = st.champ.name;
    document.getElementById('hep-op-sub').textContent = st.champ.tier[L()];
    document.getElementById('hep-op-seal').textContent = st.champ.mono;
  }
  function renderStreak() {
    const s = document.getElementById('hep-streak');
    s.innerHTML = st.streak > 0
      ? T('ΣΕΡΙ <b>', 'STREAK <b>') + st.streak + '</b>'
      : T('ΣΕΡΙ 0', 'STREAK 0');
  }

  /* ───────── end ───────── */
  function end(winner) {
    st.phase = 'over'; stopTimer();
    show('hep-screen-end');
    const title = document.getElementById('hep-end-title');
    const sub = document.getElementById('hep-end-sub');
    if (winner === 'me') {
      title.textContent = T('ΤΟ ΤΕΙΧΟΣ ΕΠΕΣΕ', 'THE WALL IS BREACHED'); title.className = 'hep-end-title win';
      sub.textContent = T(`Παρέταξες ${NEED} σφραγίδες στη σειρά και ράγισες τις πύλες πριν την ${st.champ.name}.`,
        `You aligned ${NEED} seals in a row and breached the gates before ${st.champ.name}.`);
      setTimeout(() => fxBurstAt(title, { colors: ['#E3C766', '#F4D9B0', '#E8A985', '#D97B5C'], count: 26, power: 8, life: 1200 }), 350);
    } else {
      title.textContent = T('ΟΙ ΠΥΛΕΣ ΑΝΤΕΞΑΝ', 'THE GATES HELD'); title.className = 'hep-end-title lose';
      sub.textContent = T(`Η ${st.champ.name} παρέταξε πρώτη ${NEED} στη σειρά. Οι Θήβες έμειναν αλώβητες.`,
        `${st.champ.name} aligned ${NEED} first. Thebes stands unbroken.`);
    }
    renderEndStats();
  }
  function endDraw() {
    st.phase = 'over'; stopTimer();
    show('hep-screen-end');
    const title = document.getElementById('hep-end-title');
    title.textContent = T('ΑΤΕΛΕΙΩΤΗ ΠΟΛΙΟΡΚΙΑ', 'ENDLESS SIEGE'); title.className = 'hep-end-title draw';
    document.getElementById('hep-end-sub').textContent = T(`Και οι ${N} θέσεις γέμισαν χωρίς ρωγμή. Ισοπαλία.`, `All ${N} holes filled with no breach. A draw.`);
    renderEndStats();
  }
  function renderEndStats() {
    const acc = st.asked ? Math.round(st.correct / st.asked * 100) : 0;
    document.getElementById('hep-end-stats').innerHTML = `
      <div class="hep-stat"><span class="hep-stat-val" id="hep-st-c">${st.correct}/${st.asked}</span><span class="hep-stat-lbl">${T('ΣΩΣΤΑ', 'CORRECT')}</span></div>
      <div class="hep-stat"><span class="hep-stat-val" id="hep-st-a">${acc}%</span><span class="hep-stat-lbl">${T('ΕΥΣΤΟΧΙΑ', 'ACCURACY')}</span></div>
      <div class="hep-stat"><span class="hep-stat-val" id="hep-st-s">${st.seals}</span><span class="hep-stat-lbl">${T('ΣΦΡΑΓΙΔΕΣ', 'SEALS CAST')}</span></div>`;
    // presentational count-up (skipped under reduced motion — final values above stand)
    fxCountUp(document.getElementById('hep-st-c'), st.correct, v => v + '/' + st.asked);
    fxCountUp(document.getElementById('hep-st-a'), acc, v => v + '%');
    fxCountUp(document.getElementById('hep-st-s'), st.seals, v => '' + v);
  }

  /* ───────── art ───────── */
  function crestSVG(cls) {
    const u = 'hepcr-' + cls;   // unique gradient ids per placement
    return `<svg class="${cls}" viewBox="0 0 120 120" fill="none">
      <defs>
        <linearGradient id="${u}-br" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#E8A985"/><stop offset="0.5" stop-color="#C05535"/><stop offset="1" stop-color="#8C3A1E"/>
        </linearGradient>
        <linearGradient id="${u}-st" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#4A4034"/><stop offset="1" stop-color="#28211A"/>
        </linearGradient>
      </defs>
      <!-- bronze shield -->
      <path d="M60 9l40 14v28c0 30-20 50-40 58-20-8-40-28-40-58V23z" fill="url(#${u}-br)" stroke="#5A2415" stroke-width="2.5"/>
      <!-- carved stone field -->
      <path d="M60 21l28 10v22c0 22-14 37-28 43-14-6-28-21-28-43V31z" fill="url(#${u}-st)" stroke="#F4D9B0" stroke-opacity="0.35" stroke-width="1.5"/>
      <!-- seven merlons: the seven-gated wall crown -->
      <g fill="#F4D9B0" fill-opacity="0.85">
        <rect x="36" y="31" width="4" height="6" rx="0.8"/><rect x="43" y="30" width="4" height="7" rx="0.8"/>
        <rect x="50" y="29" width="4" height="8" rx="0.8"/><rect x="58" y="28.5" width="4" height="8.5" rx="0.8"/>
        <rect x="66" y="29" width="4" height="8" rx="0.8"/><rect x="73" y="30" width="4" height="7" rx="0.8"/>
        <rect x="80" y="31" width="4" height="6" rx="0.8"/>
      </g>
      <!-- wall courses -->
      <g stroke="#0A0907" stroke-opacity="0.4" stroke-width="1">
        <path d="M33 44h54"/><path d="M33.5 53h53"/><path d="M35 62h50"/>
      </g>
      <g stroke="#F4D9B0" stroke-opacity="0.08" stroke-width="1">
        <path d="M33 45h54"/><path d="M33.5 54h53"/><path d="M35 63h50"/>
      </g>
      <!-- central arch gate -->
      <path d="M53 93.5v-9a7 7 0 0 1 14 0v9" fill="#12100C" stroke="#F4D9B0" stroke-opacity="0.4" stroke-width="1.5"/>
      <!-- four seals rising in a diagonal: the winning line -->
      <g stroke="#5A2415" stroke-width="1">
        <circle cx="42" cy="68" r="5" fill="#C4A448"/>
        <circle cx="51" cy="59" r="5" fill="#C4A448"/>
        <circle cx="60" cy="50" r="5" fill="#E3C766"/>
        <circle cx="69" cy="41" r="5" fill="#F4D9B0"/>
      </g>
    </svg>`;
  }

  /* ═══════ presentational FX layer — visual only, zero gameplay impact ═══════
     Self-contained (SymFX is not loaded on the heptapylos manifest path).
     Sparks/floats use the Web Animations API; everything honors REDUCE(). */
  function fxLayer() {
    let l = document.getElementById('hep-fx-layer');
    if (!l) { l = document.createElement('div'); l.id = 'hep-fx-layer'; document.body.appendChild(l); }
    return l;
  }
  /* rising torch embers behind the screens */
  function fxAmbient() {
    const host = document.getElementById('hep-ambient');
    if (!host || REDUCE()) return;
    host.querySelectorAll('.hep-ember').forEach(e => e.remove());
    for (let i = 0; i < 16; i++) {
      const e = document.createElement('div');
      e.className = 'hep-ember';
      const sz = 2 + Math.random() * 3.5;
      e.style.width = e.style.height = sz.toFixed(1) + 'px';
      e.style.left = (Math.random() * 100).toFixed(2) + '%';
      e.style.setProperty('--dx', ((Math.random() - 0.5) * 90).toFixed(0) + 'px');
      e.style.setProperty('--glow', (0.4 + Math.random() * 0.5).toFixed(2));
      e.style.animationDuration = (7 + Math.random() * 9).toFixed(1) + 's';
      e.style.animationDelay = (-Math.random() * 16).toFixed(1) + 's';
      host.appendChild(e);
    }
  }
  /* particle burst at page coords */
  function fxBurst(x, y, opts) {
    if (REDUCE()) return;
    const o = Object.assign({ count: 12, colors: ['#E3C766', '#D97B5C', '#F4D9B0'], power: 5, life: 800 }, opts || {});
    const layer = fxLayer();
    for (let i = 0; i < o.count; i++) {
      const p = document.createElement('div');
      p.className = 'hep-spark';
      const c = o.colors[(Math.random() * o.colors.length) | 0];
      const s = 3 + Math.random() * 5;
      p.style.width = p.style.height = s.toFixed(1) + 'px';
      p.style.background = c;
      p.style.boxShadow = '0 0 8px ' + c;
      p.style.left = x + 'px'; p.style.top = y + 'px';
      layer.appendChild(p);
      const ang = Math.random() * Math.PI * 2;
      const sp = o.power * (0.5 + Math.random());
      const dx = Math.cos(ang) * sp * 22;
      const dyUp = Math.sin(ang) * sp * 22 - 30;
      const dur = o.life * (0.7 + Math.random() * 0.6);
      p.animate([
        { transform: 'translate(0,0) scale(1)', opacity: 1 },
        { transform: `translate(${dx * 0.7}px,${dyUp}px) scale(0.9)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${dx}px,${dyUp + 120}px) scale(0.3)`, opacity: 0 },
      ], { duration: dur, easing: 'cubic-bezier(.25,.7,.4,1)', fill: 'forwards' });
      setTimeout(() => p.remove(), dur + 60);
    }
  }
  function fxBurstAt(el, opts) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    fxBurst(r.left + r.width / 2, r.top + r.height / 2, opts);
  }
  /* floating "+POWER" text */
  function fxFloatAt(el, txt, color) {
    if (!el || REDUCE()) return;
    const r = el.getBoundingClientRect();
    const f = document.createElement('div');
    f.className = 'hep-float';
    f.textContent = txt;
    f.style.left = (r.left + r.width / 2) + 'px';
    f.style.top = (r.top) + 'px';
    f.style.color = color || '#E3C766';
    f.style.fontSize = '20px';
    fxLayer().appendChild(f);
    f.animate([
      { transform: 'translate(-50%,0) scale(0.5)', opacity: 0 },
      { transform: 'translate(-50%,-26px) scale(1.1)', opacity: 1, offset: 0.3 },
      { transform: 'translate(-50%,-64px) scale(1)', opacity: 0 },
    ], { duration: 1100, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
    setTimeout(() => f.remove(), 1150);
  }
  /* damped shake (Web Animations API) */
  function fxShake(el, px, ms) {
    if (!el || REDUCE()) return;
    const kf = [{ transform: 'translate(0,0)' }];
    const steps = 9;
    for (let i = 0; i < steps; i++) {
      const damp = 1 - i / steps;
      kf.push({ transform: `translate(${((Math.random() - 0.5) * 2 * px * damp).toFixed(1)}px,${((Math.random() - 0.5) * 2 * px * damp).toFixed(1)}px)` });
    }
    kf.push({ transform: 'translate(0,0)' });
    el.animate(kf, { duration: ms, easing: 'ease-out' });
  }
  /* quick full-screen tinted flash */
  function fxFlash(color) {
    if (REDUCE()) return;
    const f = document.createElement('div');
    f.className = 'hep-flashplate';
    f.style.background = color;
    fxLayer().appendChild(f);
    f.animate([{ opacity: 0 }, { opacity: 1, offset: 0.15 }, { opacity: 0 }], { duration: 520, easing: 'ease-out' });
    setTimeout(() => f.remove(), 560);
  }
  /* landing FX: dust puff at the hole, gate plaque pop, tiny thud shake */
  function fxLand(cell, kind, col, row) {
    if (!cell || REDUCE()) return;
    const colors = kind === 'me' ? ['#FFC98A', '#E8A985', '#D97B5C']
                 : kind === 'op' ? ['#9FCAD4', '#7FB0BC', '#CDE3E8']
                 :                 ['#C7BBA4', '#8E8270', '#6B5D49'];
    const r = cell.getBoundingClientRect();
    fxBurst(r.left + r.width / 2, r.top + r.height * 0.82, { colors, count: 7, power: 2.6, life: 520 });
    const plaque = document.querySelectorAll('#hep-gates .hep-gate-no')[col];
    if (plaque) {
      plaque.classList.remove('hit'); void plaque.offsetWidth; plaque.classList.add('hit');
      setTimeout(() => plaque.classList.remove('hit'), 520);
    }
    fxShake(document.querySelector('.hep-board'), Math.min(1.5 + row * 0.6, 4.5), 170);
  }
  /* victory wall-crack drawn along the winning line */
  function fxCrack(line) {
    const board = document.querySelector('.hep-board');
    if (!board || !line || !line.length) return;
    board.querySelectorAll('.hep-crack').forEach(el => el.remove());
    const br = board.getBoundingClientRect();
    const centers = line.map(i => {
      const el = document.querySelector(`.hep-cell[data-i="${i}"]`);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return [r.left + r.width / 2 - br.left, r.top + r.height / 2 - br.top];
    }).filter(Boolean);
    if (centers.length < 2) return;
    // extend past both ends, add jagged jitter between centers
    const ext = (a, b, f) => [a[0] + (a[0] - b[0]) * f, a[1] + (a[1] - b[1]) * f];
    const pts = [ext(centers[0], centers[1], 0.55)];
    for (let i = 0; i < centers.length; i++) {
      pts.push(centers[i]);
      if (i < centers.length - 1) {
        const mx = (centers[i][0] + centers[i + 1][0]) / 2, my = (centers[i][1] + centers[i + 1][1]) / 2;
        const dx = centers[i + 1][0] - centers[i][0], dy = centers[i + 1][1] - centers[i][1];
        const len = Math.hypot(dx, dy) || 1;
        const j = (Math.random() - 0.5) * 14;
        pts.push([mx + (-dy / len) * j, my + (dx / len) * j]);
      }
    }
    pts.push(ext(centers[centers.length - 1], centers[centers.length - 2], 0.55));
    const d = 'M' + pts.map(p => p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' L');
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'hep-crack');
    svg.setAttribute('viewBox', `0 0 ${br.width.toFixed(0)} ${br.height.toFixed(0)}`);
    const under = document.createElementNS(svgNS, 'path');
    under.setAttribute('d', d); under.setAttribute('class', 'crack-under'); under.setAttribute('stroke-width', '5');
    const hot = document.createElementNS(svgNS, 'path');
    hot.setAttribute('d', d); hot.setAttribute('class', 'crack-hot'); hot.setAttribute('stroke-width', '1.8');
    svg.appendChild(under); svg.appendChild(hot);
    board.appendChild(svg);
    if (!REDUCE()) {
      [under, hot].forEach((p, k) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = String(len);
        p.animate([{ strokeDashoffset: len }, { strokeDashoffset: 0 }],
          { duration: 420, delay: k * 60, easing: 'cubic-bezier(.3,.7,.3,1)', fill: 'forwards' });
        setTimeout(() => { p.style.strokeDashoffset = '0'; }, 420 + k * 60 + 40);
      });
    }
  }
  /* seal-stamp slammed over the board (auto-removes before the end screen) */
  function fxStamp(txt, cls) {
    const host = document.querySelector('.hep-board');
    if (!host) return;
    host.querySelectorAll('.hep-stamp').forEach(el => el.remove());
    const s = document.createElement('div');
    s.className = 'hep-stamp' + (cls ? ' ' + cls : '');
    s.textContent = txt;
    host.appendChild(s);
    setTimeout(() => s.remove(), 1040);
  }
  /* eased count-up for end-screen stats */
  function fxCountUp(el, target, fmt) {
    if (!el) return;
    if (REDUCE() || !target) { el.textContent = fmt(target); return; }
    const t0 = performance.now(), dur = 850;
    function step(now) {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = fmt(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  return { open, close, _start, _pickChamp, _setOpt, _power, _toIntro, syncLang };
})();
window.Heptapylos = Heptapylos;

/* ── Games-Panel entry points ── */
window.openHeptapylos  = function (gp) { Heptapylos.open(gp || {}); };
window.closeHeptapylos = function () { Heptapylos.close(); };
