// ============================================================
//  LABYRINTH · REIMAGINED — ui.js
//  All DOM chrome for the canvas engine, built inside #labyrinth-wrap
//  on first open: the <canvas>, HUD, start menu (difficulty +
//  leaderboard), depth banner, brazier quiz, pause + result panes,
//  and the touch joystick / door button.
//
//  Exposes window.LabUI. The engine (game.js) drives it through:
//    build · showMenu · enterGame · onDepth · hideDepth · onQuiz ·
//    onHud · onResult · onPause · syncMute
//  and the UI calls back into window.LabEngine (startRun, answerQuiz,
//  resumeFromQuiz, togglePause, quitToMenu, setMoveVector, doAction,
//  hasNearDoor, DIFF) + global closeLabyrinth().
//
//  gr/en: static text carries data-gr/data-en (and data-*-html) so the
//  site's setSiteLang() swaps it live; dynamic text is set from the
//  live `siteLang` each render.
// ============================================================
(function () {
  'use strict';

  let wrap = null;
  const D = {};                 // cached DOM refs
  let pad = null;               // shared SymTouch handle (joystick + door)
  let built = false;
  let maxLives = 3, lastLives = -1, lastMax = -1;
  let quizLock = false, quizTimer = null, depthTimer = null;
  let resDiffKey = 'normal';

  function curLang() { return (typeof siteLang !== 'undefined' && siteLang) ? siteLang : 'gr'; }
  function E(tag, cls) { const e = document.createElement(tag); if (cls) e.className = cls; return e; }
  function toRoman(n) {
    const m = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
    n = n | 0; return m[n] || ('' + n);
  }
  function fmtTime(s) {
    s = Math.max(0, Math.floor(s || 0));
    const mm = (s / 60) | 0, ss = s % 60;
    return mm + ':' + (ss < 10 ? '0' : '') + ss;
  }
  // bilingual textContent + data-gr/data-en so setSiteLang keeps it synced
  function setBi(node, gr, en) {
    if (!node) return;
    node.setAttribute('data-gr', gr);
    node.setAttribute('data-en', en == null ? gr : en);
    node.textContent = curLang() === 'en' ? (en || gr) : gr;
  }
  // apply current language across a freshly-built subtree
  function applyLangIn(root) {
    if (!root) return;
    const l = curLang();
    root.querySelectorAll('[data-gr]').forEach(function (e) {
      e.textContent = l === 'en' ? (e.dataset.en || e.dataset.gr) : e.dataset.gr;
    });
    root.querySelectorAll('[data-gr-html]').forEach(function (e) {
      e.innerHTML = l === 'en' ? (e.dataset.enHtml || e.dataset.grHtml) : e.dataset.grHtml;
    });
  }

  const HOWTO_GR =
    'Κράτα τον <b>πυρσό</b> αναμμένο — σβήνει με τον χρόνο και το φως μικραίνει. ' +
    'Άναψε <b>βωμούς</b> 🔥 (απάντησε σωστά) για να γεμίσεις φως και να <b>παγώσεις</b> τον Μινώταυρο. ' +
    'Κλείσε <b>πόρτες</b> (E/F) για να τον μπλοκάρεις. Βρες την <b>αιγαιακή πύλη</b> για να κατέβεις βαθύτερα.';
  const HOWTO_EN =
    'Keep your <b>torch</b> lit — it burns down and the light shrinks. ' +
    'Light <b>altars</b> 🔥 (answer correctly) to refuel and <b>freeze</b> the Minotaur. ' +
    'Slam <b>doors</b> (E/F) to block it. Reach the <b>aegean gate</b> to descend deeper.';

  // ── full chrome template (menu inner + result stats filled dynamically) ──
  const TEMPLATE =
    '<canvas id="lb-canvas"></canvas>' +

    '<div id="lb-hud">' +
      '<div class="lb-hud-left">' +
        '<div class="lb-hud-block">' +
          '<div class="lb-hud-k" data-gr="ΖΩΕΣ" data-en="LIVES">ΖΩΕΣ</div>' +
          '<div class="lb-lives" id="lb-lives"></div>' +
        '</div>' +
        '<div class="lb-torch-wrap" id="lb-torch">' +
          '<span class="lb-torch-ic">🔥</span>' +
          '<div class="lb-torch-track"><div class="lb-torch-fill" id="lb-torch-fill"></div></div>' +
        '</div>' +
      '</div>' +
      '<div class="lb-hud-center">' +
        '<div class="lb-hud-depth" id="lb-depth-val">I / VII</div>' +
        '<div class="lb-hunt" id="lb-hunt" data-gr="ΚΥΝΗΓΑΕΙ" data-en="HUNTING">ΚΥΝΗΓΑΕΙ</div>' +
      '</div>' +
      '<div class="lb-hud-right">' +
        '<div class="lb-hud-block ar">' +
          '<div class="lb-hud-time" id="lb-time">0:00</div>' +
          '<div class="lb-hud-score" id="lb-score">0</div>' +
        '</div>' +
        '<div class="lb-hud-btns">' +
          '<button class="lb-icon-btn" id="lb-mute" type="button" title="Mute (M)">🔊</button>' +
          '<button class="lb-icon-btn" id="lb-pausebtn" type="button" title="Pause (Esc)">⏸</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="lb-pane lb-dim" id="lb-menu"><div class="lb-menu-inner" id="lb-menu-inner"></div></div>' +

    '<div class="lb-depth-banner" id="lb-depthbanner">' +
      '<div class="lb-depth-k" id="lb-db-k"></div>' +
      '<div class="lb-depth-big" id="lb-db-big"></div>' +
      '<div class="lb-depth-sub" id="lb-db-sub"></div>' +
    '</div>' +

    '<div class="lb-pane lb-quiz" id="lb-quiz">' +
      '<div class="lb-quiz-box">' +
        '<div class="lb-quiz-head">' +
          '<span class="lb-quiz-brz">🔥</span>' +
          '<div>' +
            '<div class="lb-quiz-ctx" id="lb-q-ctx">ΒΩΜΟΣ ΓΝΩΣΗΣ</div>' +
            '<div class="lb-quiz-sub" id="lb-q-sub"></div>' +
          '</div>' +
        '</div>' +
        '<div class="lb-q" id="lb-q-text"></div>' +
        '<div class="lb-opts" id="lb-q-opts"></div>' +
        '<div class="lb-q-res" id="lb-q-res"></div>' +
      '</div>' +
    '</div>' +

    '<div class="lb-pane lb-dim" id="lb-pause">' +
      '<div class="lb-pause-inner">' +
        '<div class="lb-pause-t" data-gr="Παύση" data-en="Paused">Παύση</div>' +
        '<div class="lb-btn-row">' +
          '<button class="lb-btn" id="lb-pause-resume" type="button" data-gr="Συνέχεια" data-en="Resume">Συνέχεια</button>' +
          '<button class="lb-btn ghost" id="lb-pause-menu" type="button" data-gr="Μενού" data-en="Menu">Μενού</button>' +
          '<button class="lb-btn ghost" id="lb-pause-exit" type="button" data-gr="Έξοδος" data-en="Exit">Έξοδος</button>' +
        '</div>' +
      '</div>' +
    '</div>' +

    '<div class="lb-pane lb-dim" id="lb-result">' +
      '<div class="lb-res-inner">' +
        '<div class="lb-res-title" id="lb-res-title"></div>' +
        '<div class="lb-res-sub" id="lb-res-sub"></div>' +
        '<div class="lb-res-stats" id="lb-res-stats"></div>' +
        '<div class="lb-res-best" id="lb-res-best"></div>' +
        '<div class="lb-btn-row">' +
          '<button class="lb-btn" id="lb-res-retry" type="button" data-gr="Ξανά" data-en="Retry">Ξανά</button>' +
          '<button class="lb-btn ghost" id="lb-res-menu" type="button" data-gr="Μενού" data-en="Menu">Μενού</button>' +
          '<button class="lb-btn ghost" id="lb-res-exit" type="button" data-gr="Έξοδος" data-en="Exit">Έξοδος</button>' +
        '</div>' +
      '</div>' +
    '</div>';
    // Touch controls (joystick + door button) come from the shared
    // SymTouch gamepad — see wireTouch() below.

  // ── build (once) ──────────────────────────────────────────
  function build() {
    wrap = document.getElementById('labyrinth-wrap');
    if (!wrap || built) return;
    const coarse = (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || ('ontouchstart' in window);
    if (coarse) wrap.classList.add('touch');

    wrap.insertAdjacentHTML('beforeend', TEMPLATE);

    D.hud         = wrap.querySelector('#lb-hud');
    D.lives       = wrap.querySelector('#lb-lives');
    D.torch       = wrap.querySelector('#lb-torch');
    D.torchFill   = wrap.querySelector('#lb-torch-fill');
    D.depthVal    = wrap.querySelector('#lb-depth-val');
    D.hunt        = wrap.querySelector('#lb-hunt');
    D.time        = wrap.querySelector('#lb-time');
    D.score       = wrap.querySelector('#lb-score');
    D.mute        = wrap.querySelector('#lb-mute');
    D.menu        = wrap.querySelector('#lb-menu');
    D.menuInner   = wrap.querySelector('#lb-menu-inner');
    D.depthBanner = wrap.querySelector('#lb-depthbanner');
    D.dbK         = wrap.querySelector('#lb-db-k');
    D.dbBig       = wrap.querySelector('#lb-db-big');
    D.dbSub       = wrap.querySelector('#lb-db-sub');
    D.quiz        = wrap.querySelector('#lb-quiz');
    D.qCtx        = wrap.querySelector('#lb-q-ctx');
    D.qSub        = wrap.querySelector('#lb-q-sub');
    D.qText       = wrap.querySelector('#lb-q-text');
    D.qOpts       = wrap.querySelector('#lb-q-opts');
    D.qRes        = wrap.querySelector('#lb-q-res');
    D.pause       = wrap.querySelector('#lb-pause');
    D.result      = wrap.querySelector('#lb-result');
    D.resTitle    = wrap.querySelector('#lb-res-title');
    D.resSub      = wrap.querySelector('#lb-res-sub');
    D.resStats    = wrap.querySelector('#lb-res-stats');
    D.resBest     = wrap.querySelector('#lb-res-best');

    // HUD buttons
    D.mute.addEventListener('click', function () {
      if (window.LabAudio && LabAudio.setMuted) LabAudio.setMuted(!LabAudio.isMuted());
      syncMute();
    });
    wrap.querySelector('#lb-pausebtn').addEventListener('click', function () {
      if (window.LabEngine && LabEngine.togglePause) LabEngine.togglePause();
    });

    // pause buttons
    wrap.querySelector('#lb-pause-resume').addEventListener('click', function () {
      if (window.LabEngine && LabEngine.togglePause) LabEngine.togglePause();
    });
    wrap.querySelector('#lb-pause-menu').addEventListener('click', function () {
      if (window.LabEngine && LabEngine.quitToMenu) LabEngine.quitToMenu();
    });
    wrap.querySelector('#lb-pause-exit').addEventListener('click', function () {
      if (typeof window.closeLabyrinth === 'function') window.closeLabyrinth();
    });

    // result buttons
    wrap.querySelector('#lb-res-retry').addEventListener('click', function () {
      if (window.LabEngine && LabEngine.startRun) LabEngine.startRun(resDiffKey);
    });
    wrap.querySelector('#lb-res-menu').addEventListener('click', function () {
      if (window.LabEngine && LabEngine.quitToMenu) LabEngine.quitToMenu();
    });
    wrap.querySelector('#lb-res-exit').addEventListener('click', function () {
      if (typeof window.closeLabyrinth === 'function') window.closeLabyrinth();
    });

    wireTouch();
    applyLangIn(wrap);
    built = true;
  }

  // ── start menu ────────────────────────────────────────────
  function showMenu(scores) {
    if (!built) build();
    if (!wrap) return;
    scores = scores || {};
    renderMenu(scores);
    D.hud.classList.remove('on');
    D.depthBanner.classList.remove('on');
    wrap.classList.remove('playing');
    if (pad) pad.hide();
    clearTimeout(depthTimer);
    clearTimeout(quizTimer);
    showPane('#lb-menu');
    syncMute();
  }

  function renderMenu(scores) {
    const inner = D.menuInner;
    inner.innerHTML = '';

    const title = E('div', 'lb-title'); setBi(title, 'Λαβύρινθος', 'Labyrinth'); inner.appendChild(title);
    const ten = E('div', 'lb-title-en'); ten.textContent = 'LABYRINTH · REIMAGINED'; inner.appendChild(ten);

    const howto = E('div', 'lb-howto');
    howto.setAttribute('data-gr-html', HOWTO_GR);
    howto.setAttribute('data-en-html', HOWTO_EN);
    howto.innerHTML = curLang() === 'en' ? HOWTO_EN : HOWTO_GR;
    inner.appendChild(howto);

    renderSubjects(inner);

    const DIFF = (window.LabEngine && LabEngine.DIFF) || {};
    const row = E('div', 'lb-diff-row');
    ['calm', 'normal', 'nightmare'].forEach(function (key) {
      const d = DIFF[key]; if (!d) return;
      const card = E('button', 'lb-diff lb-diff-' + key); card.type = 'button';

      const nm = E('div', 'lb-diff-name'); setBi(nm, d.label, d.en); card.appendChild(nm);
      const meta = E('div', 'lb-diff-meta');
      const metaGr = d.baseCols + '×' + d.baseRows + ' · ' + d.lives + '♥ · ' + d.maxDepth + ' κύκλοι';
      const metaEn = d.baseCols + '×' + d.baseRows + ' · ' + d.lives + '♥ · ' + d.maxDepth + ' circles';
      setBi(meta, metaGr, metaEn); card.appendChild(meta);

      const sc = scores[key];
      if (sc && (sc.score || sc.depth)) {
        const best = E('div', 'lb-diff-best');
        const tail = sc.escaped ? ' · ' + fmtTime(sc.time) : '';
        setBi(best, 'Άριστο ' + (sc.score || 0) + ' · ' + toRoman(sc.depth || 0) + tail,
                    'Best ' + (sc.score || 0) + ' · ' + toRoman(sc.depth || 0) + tail);
        card.appendChild(best);
      }
      card.addEventListener('click', function () {
        if (window.LabEngine && LabEngine.startRun) LabEngine.startRun(key);
      });
      row.appendChild(card);
    });
    inner.appendChild(row);

    inner.appendChild(buildBoard(scores, DIFF));

    const foot = E('div', 'lb-foot');
    setBi(foot, 'WASD/βέλη κίνηση · E πόρτα · M ήχος · Esc παύση',
                'WASD/arrows move · E door · M sound · Esc pause');
    inner.appendChild(foot);
  }

  // optional in-menu subject switcher (only if subjects.js was copied in)
  function renderSubjects(inner) {
    const subs = window.LAB_SUBJECTS;
    if (!Array.isArray(subs) || !subs.length) return;
    const wrapEl = E('div', 'lb-subj-wrap');
    const lbl = E('div', 'lb-subj-lbl'); setBi(lbl, 'ΥΛΗ', 'SUBJECT'); wrapEl.appendChild(lbl);
    const row = E('div', 'lb-subj-row');
    subs.forEach(function (s) {
      const chip = E('button', 'lb-subj'); chip.type = 'button';
      chip.textContent = s.label || s.id || '—';
      chip.addEventListener('click', function () {
        if (window.LabQ && LabQ.load && Array.isArray(s.questions)) LabQ.load(s.questions);
        window._lbSubjectLabel = s.label || null;
        row.querySelectorAll('.lb-subj').forEach(function (c) { c.classList.remove('on'); });
        chip.classList.add('on');
      });
      row.appendChild(chip);
    });
    wrapEl.appendChild(row);
    inner.appendChild(wrapEl);
  }

  function buildBoard(scores, DIFF) {
    const board = E('div', 'lb-board');
    const head = E('div', 'lb-brow lb-bhead');
    [['ΕΠΙΠΕΔΟ', 'LEVEL', 'lb-bk'], ['ΣΚΟΡ', 'SCORE', 'lb-bv'], ['ΒΑΘΟΣ', 'DEPTH', 'lb-bv'], ['ΧΡΟΝΟΣ', 'TIME', 'lb-bv']]
      .forEach(function (cell) { const d = E('div', cell[2]); setBi(d, cell[0], cell[1]); head.appendChild(d); });
    board.appendChild(head);

    ['calm', 'normal', 'nightmare'].forEach(function (key) {
      const d = DIFF[key]; if (!d) return;
      const sc = scores[key] || {};
      const r = E('div', 'lb-brow');
      const k = E('div', 'lb-bk'); setBi(k, d.label, d.en); r.appendChild(k);
      const s1 = E('div', 'lb-bv'); s1.textContent = sc.score || 0; r.appendChild(s1);
      const s2 = E('div', 'lb-bv'); s2.textContent = sc.depth ? toRoman(sc.depth) : '—'; r.appendChild(s2);
      const s3 = E('div', 'lb-bv'); s3.textContent = sc.escaped && sc.time ? fmtTime(sc.time) : '—'; r.appendChild(s3);
      board.appendChild(r);
    });
    return board;
  }

  // ── pane helpers ──────────────────────────────────────────
  function hideAllPanes() {
    if (!wrap) return;
    wrap.querySelectorAll('.lb-pane').forEach(function (p) { p.classList.remove('on'); });
  }
  function showPane(sel) {
    hideAllPanes();
    const p = wrap.querySelector(sel);
    if (p) p.classList.add('on');
  }

  // ── enter gameplay ────────────────────────────────────────
  function enterGame() {
    if (!wrap) return;
    hideAllPanes();
    clearTimeout(quizTimer);
    D.depthBanner.classList.remove('on');
    D.hud.classList.add('on');
    wrap.classList.add('playing');
    lastLives = -1; lastMax = -1;   // force lives pips re-render
    if (pad) pad.show();
    syncMute();
  }

  // ── HUD (every frame) ─────────────────────────────────────
  function renderLives(n) {
    D.lives.innerHTML = '';
    for (let i = 0; i < maxLives; i++) {
      const s = E('span', 'lb-life' + (i < n ? '' : ' off'));
      s.textContent = '♥';
      D.lives.appendChild(s);
    }
  }
  function onHud(s) {
    if (!D.hud || !s) return;
    if (s.lives !== lastLives || maxLives !== lastMax) {
      renderLives(s.lives); lastLives = s.lives; lastMax = maxLives;
    }
    const f = Math.max(0, Math.min(1, s.fuel || 0));
    D.torchFill.style.width = (f * 100) + '%';
    D.torchFill.style.background = f < 0.2 ? 'var(--lb-terra)' : (f < 0.45 ? 'var(--lb-gold-lt)' : 'var(--lb-gold)');
    D.torch.classList.toggle('low', f < 0.34);
    D.depthVal.textContent = toRoman(s.depth) + ' / ' + toRoman(s.maxDepth);
    D.time.textContent = fmtTime(s.time);
    D.score.textContent = (s.score | 0);
    D.hunt.classList.toggle('on', !!s.hunting);
    if (pad) {
      const near = window.LabEngine && LabEngine.hasNearDoor && LabEngine.hasNearDoor();
      pad.setButtonActive('door', !!near);
    }
  }

  // ── depth banner ──────────────────────────────────────────
  function onDepth(depth, d, isDescend) {
    if (!wrap) return;
    if (d && d.lives) maxLives = d.lives;
    clearTimeout(depthTimer);
    setBi(D.dbK, isDescend ? 'ΚΑΤΑΒΑΣΗ' : 'Ο ΛΑΒΥΡΙΝΘΟΣ', isDescend ? 'DESCENDING' : 'THE LABYRINTH');
    setBi(D.dbBig, 'Κύκλος ' + toRoman(depth), 'Circle ' + toRoman(depth));
    const total = (d && d.maxDepth) || depth;
    setBi(D.dbSub,
      depth >= total ? 'Η τελευταία πύλη — βρες την έξοδο' : 'Βρες την αιγαιακή πύλη και κατέβα',
      depth >= total ? 'The final gate — find the exit' : 'Find the aegean gate and descend');
    D.depthBanner.classList.add('on');
    if (!isDescend) {
      depthTimer = setTimeout(function () { D.depthBanner.classList.remove('on'); }, 1150);
    }
  }
  function hideDepth() { clearTimeout(depthTimer); if (D.depthBanner) D.depthBanner.classList.remove('on'); }

  // ── brazier quiz ──────────────────────────────────────────
  function onQuiz(obj, lang) {
    if (!wrap || !obj) return;
    lang = lang || curLang();
    quizLock = false;
    clearTimeout(quizTimer);

    const ctx = window._lbSubjectLabel;
    setBi(D.qCtx, ctx || 'ΒΩΜΟΣ ΓΝΩΣΗΣ', ctx || 'ALTAR OF KNOWLEDGE');
    setBi(D.qSub, 'Σωστό → φως & ο Μινώταυρος παγώνει', 'Correct → refuel & the Minotaur freezes');

    const q = obj.q || { gr: '', en: '' };
    D.qText.setAttribute('data-gr', q.gr || '');
    D.qText.setAttribute('data-en', q.en || q.gr || '');
    D.qText.textContent = (lang === 'en' ? (q.en || q.gr) : q.gr) || '';

    D.qOpts.innerHTML = '';
    (obj.a || []).forEach(function (ans, i) {
      const b = E('button', 'lb-opt'); b.type = 'button'; b.textContent = ans;
      b.addEventListener('click', function () { chooseAnswer(i, b, obj); });
      D.qOpts.appendChild(b);
    });

    D.qRes.textContent = ''; D.qRes.className = 'lb-q-res';
    showPane('#lb-quiz');
  }

  function chooseAnswer(i, btn, obj) {
    if (quizLock) return;
    quizLock = true;
    const correct = (window.LabEngine && LabEngine.answerQuiz) ? LabEngine.answerQuiz(i) : (i === obj.c);
    const opts = D.qOpts.querySelectorAll('.lb-opt');
    opts.forEach(function (b, j) { b.disabled = true; if (j === obj.c) b.classList.add('correct'); });
    if (!correct) btn.classList.add('wrong');
    D.qRes.className = 'lb-q-res ' + (correct ? 'ok' : 'no');
    setBi(D.qRes,
      correct ? 'Σωστά! Ο πυρσός αναζωπυρώνεται.' : 'Λάθος. Το σκοτάδι πυκνώνει.',
      correct ? 'Correct! The torch flares back to life.' : 'Wrong. The dark closes in.');
    quizTimer = setTimeout(function () {
      D.quiz.classList.remove('on');
      if (window.LabEngine && LabEngine.resumeFromQuiz) LabEngine.resumeFromQuiz();
    }, correct ? 1100 : 1500);
  }

  // ── pause ─────────────────────────────────────────────────
  function onPause(paused) {
    if (!wrap) return;
    if (paused) showPane('#lb-pause');
    else D.pause.classList.remove('on');
  }

  // ── result ────────────────────────────────────────────────
  function addStat(parent, gr, en, val) {
    const d = E('div');
    const s = E('span'); setBi(s, gr, en);
    const b = E('b'); b.textContent = val;
    d.appendChild(s); d.appendChild(b); parent.appendChild(d);
  }
  function onResult(res, lang) {
    if (!wrap || !res) return;
    resDiffKey = res.diffKey || 'normal';
    wrap.classList.remove('playing');
    D.hud.classList.remove('on');
    if (pad) pad.hide();
    hideDepth();

    D.resTitle.className = 'lb-res-title ' + (res.win ? 'win' : 'lose');
    setBi(D.resTitle, res.win ? 'ΕΞΟΔΟΣ' : 'ΧΑΘΗΚΕΣ', res.win ? 'ESCAPED' : 'LOST');
    setBi(D.resSub,
      res.win ? 'Δραπέτευσες από τον Λαβύρινθο' : 'Ο Μινώταυρος σε βρήκε στο σκοτάδι',
      res.win ? 'You escaped the Labyrinth' : 'The Minotaur found you in the dark');

    D.resStats.innerHTML = '';
    addStat(D.resStats, 'ΒΑΘΟΣ', 'DEPTH', toRoman(res.depth) + '/' + toRoman(res.maxDepth));
    addStat(D.resStats, 'ΣΚΟΡ', 'SCORE', res.score | 0);
    addStat(D.resStats, 'ΧΡΟΝΟΣ', 'TIME', fmtTime(res.time));
    addStat(D.resStats, 'ΒΩΜΟΙ', 'ALTARS', res.braz | 0);

    const b = res.best || {};
    const tail = b.escaped && b.time ? (' · ' + fmtTime(b.time)) : '';
    setBi(D.resBest,
      'Άριστο: ' + (b.score || 0) + ' · βάθος ' + toRoman(b.depth || 0) + tail,
      'Best: ' + (b.score || 0) + ' · depth ' + toRoman(b.depth || 0) + tail);

    showPane('#lb-result');
  }

  // ── mute button sync ──────────────────────────────────────
  function syncMute() {
    if (!D.mute) return;
    const m = window.LabAudio && LabAudio.isMuted && LabAudio.isMuted();
    D.mute.classList.toggle('off', !!m);
    D.mute.textContent = m ? '🔇' : '🔊';
    D.mute.setAttribute('title', m ? 'Unmute (M)' : 'Mute (M)');
  }

  // ── touch joystick + door button (shared SymTouch gamepad) ────
  //  Left  → analog joystick, fed to the engine as a move vector.
  //  Right → one door button (🚪 / E) calling LabEngine.doAction().
  //  The pad lives inside #labyrinth-wrap (z under the menu/quiz/pause
  //  panes), shown only while playing. Door-near glow is mirrored from
  //  onHud() via pad.setButtonActive('door', …).
  function wireTouch() {
    if (!window.SymTouch || pad) return;
    pad = SymTouch.mount({
      container: wrap,
      accent: '#C49028',                 // labyrinth gold
      glow: 'rgba(196,144,40,.45)',
      zIndex: 32,                        // below .lb-pane (z 40)
      joystick: {
        output: 'vector',
        anchor: 'fixed',
        deadzone: 0.1,
        onMove: function (vx, vy) {
          if (window.LabEngine && LabEngine.setMoveVector) LabEngine.setMoveVector(vx, vy);
        },
      },
      buttons: [
        {
          id: 'door', icon: '🚪', label: 'E', slot: 'primary', tone: 'ghost',
          onPress: function () {
            if (window.LabEngine && LabEngine.doAction) LabEngine.doAction();
          },
        },
      ],
    });
  }

  window.LabUI = {
    build: build,
    showMenu: showMenu,
    enterGame: enterGame,
    onDepth: onDepth,
    hideDepth: hideDepth,
    onQuiz: onQuiz,
    onHud: onHud,
    onResult: onResult,
    onPause: onPause,
    syncMute: syncMute,
  };
})();
