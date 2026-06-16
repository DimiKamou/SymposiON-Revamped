// ============================================================
//  TOW · Reimagined — Buzz-In engine  (window.openTow / closeTow)
//
//  Reimagined gameplay: no rigid alternation. Each question shows
//  to BOTH teams at once. Logged-in teams get a giant red BUZZ pad;
//  the team that presses first CLAIMS the right to answer.
//    · correct  → rope pulls to them (bonus = buzz speed + time left)
//    · wrong    → the question STEALS to the other team
//    · pre-buzz during the reading phase = locked out for that Q
//  Rope to either edge wins. Classic alternation kept as a mode.
//
//  Public API (drop-in compatible with the old game):
//    openTow(cfg)  / closeTow()      — Ιλιάδα overlay  (#tow-overlay / #tow-wrap)
//    openNounTow(cfg) / closeNounTow() — Ουσιαστικά overlay (#noun-tow-overlay / #noun-tow-wrap)
//  Questions are read live, in priority:
//    window._gpTowPool  (GP subject→game bridge, {q,opts,ans})  →
//    window.TOW_BANKS[bank]  (direct launches / lobby chips)    →
//    window.TOW_Q       (live mutable global, like LB_Q)
//  Depends on: tow-arena.js, tow-audio.js (+ tow-questions.js for banks)
// ============================================================
(function () {
  const LS = 'tow_reimagined_v1';
  let S = null;            // game state
  let arena = null;        // TowArena instance
  let keyHandler = null;

  // which overlay / wrap / default subject this run targets
  let OVERLAY_ID = 'tow-overlay';
  let WRAP_ID = 'tow-wrap';
  let DEFAULT_BANK = 'iliada';

  // ── persistence ──────────────────────────────────────────
  function loadPrefs() {
    try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; }
  }
  function savePrefs(p) { try { localStorage.setItem(LS, JSON.stringify(p)); } catch (e) {} }

  // ── open / close ─────────────────────────────────────────
  function show(id) {
    const ov = document.getElementById(id);
    if (ov) { ov.style.display = 'flex'; ov.classList.add('active'); }
    document.body.style.overflow = 'hidden';
  }
  function hide(id) {
    const ov = document.getElementById(id);
    if (ov) { ov.classList.remove('active'); if (ov.style.display === 'flex') ov.style.display = ''; }
    document.body.style.overflow = '';
  }

  function openWith(overlayId, wrapId, defaultBank) {
    teardown();
    OVERLAY_ID = overlayId; WRAP_ID = wrapId; DEFAULT_BANK = defaultBank;
    // clear BOTH wraps so the shared element ids (#tow-arena, #tow-stage, pads…)
    // never collide across the two overlays when both have been opened in a session.
    clearWrap('tow-wrap'); clearWrap('noun-tow-wrap');
    show(overlayId);
    renderLobby();
  }
  function clearWrap(id) { const w = document.getElementById(id); if (w) w.innerHTML = ''; }
  function closeCurrent() { hide(OVERLAY_ID); teardown(); clearWrap(WRAP_ID); }

  // Ιλιάδα entry point (and GP / engine-configurator launches)
  window.openTow = function (cfg) { openWith('tow-overlay', 'tow-wrap', 'iliada'); };
  window.closeTow = function () { if (OVERLAY_ID === 'tow-overlay') closeCurrent(); else hide('tow-overlay'); };

  // Ουσιαστικά entry point
  window.openNounTow = function (cfg) { openWith('noun-tow-overlay', 'noun-tow-wrap', 'ousiastika'); };
  window.closeNounTow = function () { if (OVERLAY_ID === 'noun-tow-overlay') closeCurrent(); else hide('noun-tow-overlay'); };

  function teardown() {
    if (S && S.timer) cancelAnimationFrame(S.timer);
    if (S && S._to) { clearTimeout(S._to); S._to = null; }  // kill any pending advance()/nextQuestion timer
    removeKeys();
    if (arena) { arena.stop(); arena = null; }
  }

  // ── LOBBY ────────────────────────────────────────────────
  function renderLobby() {
    teardown();
    const p = loadPrefs();
    const banks = window.TOW_BANKS || {};
    const bankKeys = Object.keys(banks);
    const wrap = document.getElementById(WRAP_ID);

    // launched from a GP subject? that pool is the source; chips hidden.
    const gpActive = !!(window._gpTowPool && window._gpTowPool.length);

    S = {
      screen: 'lobby',
      nameA: p.nameA || 'Ομάδα Α', nameB: p.nameB || 'Ομάδα Β',
      loggedA: false, loggedB: false,
      mode: p.mode || 'buzz',          // 'buzz' | 'classic'
      // the launched game's subject wins over any stale saved pref
      bank: banks[DEFAULT_BANK] ? DEFAULT_BANK : (p.bank && banks[p.bank] ? p.bank : (bankKeys[0] || '')),
      gpActive: gpActive,
      answerSec: p.answerSec || 8,
      buzzSec: p.buzzSec || 7,
      total: p.total || 14,
      muted: p.muted || false,
    };
    if (window.TowAudio) window.TowAudio.setMuted(S.muted);

    wrap.innerHTML = `
    <div class="tow-lobby">
      <div class="tow-l-head">
        <div class="tow-l-kicker">ΔΙΕΛΚΥΣΤΙΝΔΑ · REIMAGINED</div>
        <h1 class="tow-l-title">Η Μάχη του Σχοινιού</h1>
        <p class="tow-l-sub">Δύο ομάδες, ένα σχοινί. Όποια πατήσει <strong>πρώτη</strong> το κόκκινο κουμπί, απαντά πρώτη.</p>
      </div>

      <div class="tow-team-cards">
        ${teamCardHTML('A')}
        ${teamCardHTML('B')}
      </div>

      <div class="tow-settings">
        <div class="tow-set-row">
          <label>Λειτουργία</label>
          <div class="tow-seg" data-set="mode">
            <button data-v="buzz">⚡ Buzz-In</button>
            <button data-v="classic">↔ Εναλλάξ</button>
          </div>
        </div>
        ${(bankKeys.length && !S.gpActive) ? `
        <div class="tow-set-row">
          <label>Ύλη</label>
          <div class="tow-seg tow-seg-wrap" data-set="bank">
            ${bankKeys.map(k => `<button data-v="${k}">${banks[k].label}</button>`).join('')}
          </div>
        </div>` : ''}
        <div class="tow-set-grid">
          <div class="tow-set-row col">
            <label>Χρόνος buzz</label>
            <div class="tow-seg" data-set="buzzSec">
              <button data-v="5">5s</button><button data-v="7">7s</button><button data-v="10">10s</button>
            </div>
          </div>
          <div class="tow-set-row col">
            <label>Χρόνος απάντησης</label>
            <div class="tow-seg" data-set="answerSec">
              <button data-v="6">6s</button><button data-v="8">8s</button><button data-v="12">12s</button>
            </div>
          </div>
          <div class="tow-set-row col">
            <label>Ερωτήσεις</label>
            <div class="tow-seg" data-set="total">
              <button data-v="10">10</button><button data-v="14">14</button><button data-v="20">20</button>
            </div>
          </div>
          <div class="tow-set-row col">
            <label>Ήχος</label>
            <div class="tow-seg" data-set="muted">
              <button data-v="false">🔊 Ναι</button><button data-v="true">🔇 Όχι</button>
            </div>
          </div>
        </div>
      </div>

      <button class="tow-start-btn" id="tow-start" disabled>Συνδεθείτε και οι δύο ομάδες</button>
    </div>`;

    // wire login + name inputs
    ['A', 'B'].forEach(side => {
      const inp = document.getElementById('tow-name-' + side);
      inp.addEventListener('input', () => { S['name' + side] = inp.value || ('Ομάδα ' + (side === 'A' ? 'Α' : 'Β')); });
      document.getElementById('tow-login-' + side).addEventListener('click', () => toggleLogin(side));
    });

    // wire segmented settings
    wrap.querySelectorAll('.tow-seg').forEach(seg => {
      const key = seg.dataset.set;
      seg.querySelectorAll('button').forEach(b => {
        const v = b.dataset.v;
        const active = String(S[key]) === v;
        b.classList.toggle('on', active);
        b.addEventListener('click', () => {
          let val = v;
          if (key === 'muted') val = (v === 'true');
          else if (['buzzSec', 'answerSec', 'total'].includes(key)) val = parseInt(v);
          S[key] = val;
          seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
          if (key === 'muted' && window.TowAudio) window.TowAudio.setMuted(val);
        });
      });
    });

    document.getElementById('tow-start').addEventListener('click', startGame);
    refreshStart();
  }

  function teamCardHTML(side) {
    const isA = side === 'A';
    const name = isA ? (S.nameA) : (S.nameB);
    return `
    <div class="tow-team-card ${isA ? 'a' : 'b'}" id="tow-card-${side}">
      <div class="tow-card-tag">${isA ? '◆ Ομάδα Α' : 'Ομάδα Β ◆'}</div>
      <input id="tow-name-${side}" class="tow-name-input" value="${name}" maxlength="16" placeholder="Όνομα ομάδας"/>
      <button class="tow-login-btn" id="tow-login-${side}">Σύνδεση</button>
      <div class="tow-pad-mini" id="tow-mini-${side}">
        <span class="tow-mini-lock">🔒 Κλειδωμένο</span>
        <span class="tow-mini-live">● BUZZ έτοιμο</span>
      </div>
    </div>`;
  }

  function toggleLogin(side) {
    S['logged' + side] = !S['logged' + side];
    const card = document.getElementById('tow-card-' + side);
    const btn = document.getElementById('tow-login-' + side);
    const inp = document.getElementById('tow-name-' + side);
    const on = S['logged' + side];
    card.classList.toggle('live', on);
    btn.textContent = on ? '✓ Συνδεδεμένη — Αποσύνδεση' : 'Σύνδεση';
    inp.disabled = on;
    refreshStart();
  }

  function refreshStart() {
    const btn = document.getElementById('tow-start');
    if (!btn) return;
    const ready = S.loggedA && S.loggedB;
    btn.disabled = !ready;
    btn.textContent = ready ? '⚔ Έναρξη Μάχης →'
      : (S.loggedA || S.loggedB) ? 'Λείπει μία ομάδα…' : 'Συνδεθείτε και οι δύο ομάδες';
  }

  // ── build run ────────────────────────────────────────────
  function buildQuestions() {
    // priority: GP bridge pool → selected bank → live TOW_Q
    let pool = [];
    if (window._gpTowPool && window._gpTowPool.length) pool = window._gpTowPool.slice();
    else if (window.TOW_BANKS && window.TOW_BANKS[S.bank]) pool = window.TOW_BANKS[S.bank].q.slice();
    else if (window.TOW_Q && window.TOW_Q.length) pool = window.TOW_Q.slice();
    if (!pool.length) pool = [{ q: '—', opts: ['—'], ans: 0 }];
    // shuffle + clamp
    for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const out = [];
    for (let i = 0; i < S.total; i++) out.push(pool[i % pool.length]);
    return out;
  }

  function startGame() {
    savePrefs({ nameA: S.nameA, nameB: S.nameB, mode: S.mode, bank: S.bank,
      answerSec: S.answerSec, buzzSec: S.buzzSec, total: S.total, muted: S.muted });

    Object.assign(S, {
      screen: 'game',
      questions: buildQuestions(),
      idx: 0, rope: 50, scoreA: 0, scoreB: 0,
      phase: 'idle', claimer: null, lockout: { A: false, B: false },
      turn: 'A', timer: null, history: [],
    });
    renderGame();
    nextQuestion();
  }

  // ── GAME render ──────────────────────────────────────────
  function renderGame() {
    const wrap = document.getElementById(WRAP_ID);
    wrap.innerHTML = `
    <div class="tow-game">
      <div class="tow-hud">
        <div class="tow-score a" id="tow-hud-a">
          <span class="tow-score-name">${S.nameA}</span>
          <span class="tow-score-val" id="tow-sa">0</span>
        </div>
        <div class="tow-hud-mid">
          <div class="tow-qnum" id="tow-qnum">1 / ${S.total}</div>
          <div class="tow-mode-pill">${S.mode === 'buzz' ? '⚡ Buzz-In' : '↔ Εναλλάξ'}</div>
        </div>
        <div class="tow-score b" id="tow-hud-b">
          <span class="tow-score-name">${S.nameB}</span>
          <span class="tow-score-val" id="tow-sb">0</span>
        </div>
      </div>

      <div class="tow-arena-box">
        <canvas id="tow-arena"></canvas>
        <div class="tow-buzz-timer" id="tow-buzz-timer"><span></span></div>
      </div>

      <div class="tow-stage" id="tow-stage">—</div>

      <div class="tow-qcard">
        <div class="tow-qstem" id="tow-qstem"></div>
        <div class="tow-qsub" id="tow-qsub"></div>
      </div>

      <div class="tow-opts" id="tow-opts"></div>

      <div class="tow-pads">
        ${padHTML('A')}
        ${padHTML('B')}
      </div>
    </div>`;

    arena = new window.TowArena('tow-arena', { nameA: S.nameA, nameB: S.nameB });
    arena.start();
    arena.setRopePosition(S.rope);

    // pad interaction (pointer = low latency on touch + mouse)
    ['A', 'B'].forEach(side => {
      const pad = document.getElementById('tow-pad-' + side);
      const fire = (e) => { e.preventDefault(); onBuzz(side); };
      pad.addEventListener('pointerdown', fire);
    });
    addKeys();
  }

  function padHTML(side) {
    const isA = side === 'A';
    const name = isA ? S.nameA : S.nameB;
    const key = isA ? 'A' : 'L';
    return `
    <button class="tow-pad ${isA ? 'a' : 'b'}" id="tow-pad-${side}">
      <span class="tow-pad-ring"></span>
      <span class="tow-pad-core">
        <span class="tow-pad-label">BUZZ</span>
        <span class="tow-pad-team">${name}</span>
      </span>
      <span class="tow-pad-key">πλήκτρο ${key}</span>
      <span class="tow-pad-state"></span>
    </button>`;
  }

  // ── question cycle ───────────────────────────────────────
  function nextQuestion() {
    if (S.idx >= S.questions.length) return endGame();
    S.phase = 'reading';
    S.claimer = null;
    S.lockout = { A: false, B: false };
    S.answeredBy = null;

    const q = S.questions[S.idx];
    setText('tow-qnum', `${S.idx + 1} / ${S.total}`);
    setText('tow-qstem', q.q);
    setText('tow-qsub', q.sub || '');

    // options (disabled until claimed)
    const opts = document.getElementById('tow-opts');
    opts.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'tow-opt';
      b.disabled = true;
      b.innerHTML = `<span class="tow-opt-key">${i + 1}</span><span class="tow-opt-txt">${opt}</span>`;
      b.addEventListener('click', () => onAnswer(i, b));
      opts.appendChild(b);
    });

    if (S.mode === 'classic') return classicReading();

    stage(`Διαβάστε…`, 'read');
    setPads('reading');
    // brief read delay, then arm
    timeout(() => arm(), 1100);
  }

  function arm() {
    if (S.phase !== 'reading') return;
    S.phase = 'armed';
    S.armT = performance.now();
    stage('⚡ BUZZ! — Ποια ομάδα ξέρει;', 'go');
    setPads('armed');
    startBuzzTimer(S.buzzSec, () => noBuzz());
  }

  function noBuzz() {
    if (S.phase !== 'armed' && S.phase !== 'steal') return;
    stopTimer();
    const q = S.questions[S.idx];
    revealCorrect(q.ans, -1);
    stage(`Κανείς δεν χτύπησε — η σωστή ήταν «${q.opts[q.ans]}»`, 'neutral');
    S.history.push({ rope: S.rope, result: 'none' });
    setPads('off');
    advance(1700);
  }

  // ── classic (alternation) fallback ───────────────────────
  function classicReading() {
    S.phase = 'claimed';
    S.claimer = S.turn;
    const name = S.turn === 'A' ? S.nameA : S.nameB;
    stage(`🎯 Σειρά: ${name}`, S.turn === 'A' ? 'a' : 'b');
    setPads('off');
    enableOptions(true);
    if (arena) arena.triggerBuzz(S.turn);
    startBuzzTimer(S.answerSec, () => onTimeUp());
  }

  // ── buzz ─────────────────────────────────────────────────
  function onBuzz(side) {
    if (S.mode === 'classic') return;
    // pre-buzz during reading = lockout
    if (S.phase === 'reading') {
      if (S.lockout[side]) return;
      S.lockout[side] = true;
      if (window.TowAudio) window.TowAudio.deny();
      flashPad(side, 'out', 'Νωρίς! 🔒');
      if (S.lockout.A && S.lockout.B) { stopTimer(); noBuzz(); }
      return;
    }
    if (S.phase === 'armed') {
      if (S.lockout[side]) return;
      claim(side, false);
      return;
    }
    if (S.phase === 'steal') {
      if (side !== S.stealer) return;
      claim(side, true);
      return;
    }
  }

  function claim(side, isSteal) {
    stopTimer();
    S.phase = 'claimed';
    S.claimer = side;
    S.buzzMs = performance.now() - (S.armT || performance.now());
    const name = side === 'A' ? S.nameA : S.nameB;
    if (window.TowAudio) { window.TowAudio.buzz(side); window.TowAudio.claim(side); }
    if (arena) arena.triggerBuzz(side);
    stage(`${isSteal ? '🥷 Κλέψιμο! ' : '🔔 '}${name} απαντά!`, side === 'A' ? 'a' : 'b');
    setPads('claimed', side);
    enableOptions(true);
    startBuzzTimer(isSteal ? Math.max(5, S.answerSec - 2) : S.answerSec, () => onTimeUp());
  }

  // ── answer ───────────────────────────────────────────────
  function onAnswer(i, btn) {
    if (S.phase !== 'claimed') return;
    stopTimer();
    const q = S.questions[S.idx];
    const ok = i === q.ans;
    const side = S.claimer;
    enableOptions(false);
    const isSteal = S.answeredBy === 'firstWrong';

    if (ok) {
      revealCorrect(q.ans, i);
      const sp = clamp((S.remain || 0) / S.answerSec, 0, 1);
      const buzzSp = clamp(1 - (S.buzzMs || 0) / (S.buzzSec * 1000), 0, 1);
      const intensity = clamp(sp * 0.7 + buzzSp * 0.3, 0.1, 1);
      const factor = isSteal ? 0.6 : 1;
      const move = Math.round((8 + intensity * 14) * factor);
      applyPull(side, move);
      if (arena) arena.triggerPull(side, intensity);
      stage(`✓ Σωστό! ${side === 'A' ? S.nameA : S.nameB} τραβά +${move}`, side === 'A' ? 'a' : 'b');
      S.scoreA += side === 'A' ? 1 : 0; S.scoreB += side === 'B' ? 1 : 0;
      updateScores();
      S.history.push({ rope: S.rope, result: 'correct' });
      if (checkWin()) return;
      setPads('off');
      advance(1700);
    } else {
      if (window.TowAudio) window.TowAudio.deny();
      flashPad(side, 'out', 'Λάθος');
      if (S.mode === 'buzz' && !isSteal) {
        // first team wrong → STEAL. Do NOT reveal the answer yet;
        // only knock out the wrong pick so the other team races fairly.
        markEliminated(i);
        S.history.push({ rope: S.rope, result: 'wrong' });
        startSteal(side);
      } else {
        // both teams wrong (or classic) — question dies, rope untouched.
        revealCorrect(q.ans, i);
        stage(`✗ Καμία σωστή — το σχοινί μένει. Η σωστή: «${q.opts[q.ans]}»`, 'neutral');
        S.history.push({ rope: S.rope, result: 'wrong' });
        setPads('off');
        advance(1900);
      }
    }
  }

  function startSteal(wrongSide) {
    S.phase = 'steal';
    S.stealer = wrongSide === 'A' ? 'B' : 'A';
    S.answeredBy = 'firstWrong';
    const name = S.stealer === 'A' ? S.nameA : S.nameB;
    stage(`🥷 ${name}: χτύπησε για κλέψιμο!`, S.stealer === 'A' ? 'a' : 'b');
    enableOptions(false);
    setPads('steal', S.stealer);
    startBuzzTimer(Math.max(5, S.buzzSec - 2), () => {
      const q = S.questions[S.idx];
      revealCorrect(q.ans, -1);
      stage(`Χάθηκε το κλέψιμο — το σχοινί μένει. Η σωστή: «${q.opts[q.ans]}»`, 'neutral');
      setPads('off'); advance(1800);
    });
  }

  function onTimeUp() {
    if (S.phase === 'claimed') {
      const q = S.questions[S.idx];
      enableOptions(false);
      if (window.TowAudio) window.TowAudio.deny();
      if (S.mode === 'buzz' && S.answeredBy !== 'firstWrong') {
        // ran out of time → steal opens. Keep the answer hidden.
        S.history.push({ rope: S.rope, result: 'timeout' });
        startSteal(S.claimer);
      } else {
        revealCorrect(q.ans, -1);
        stage(`⏱ Έληξε! η σωστή ήταν «${q.opts[q.ans]}»`, 'neutral');
        S.history.push({ rope: S.rope, result: 'timeout' });
        setPads('off'); advance(1600);
        if (S.mode === 'classic') S.turn = S.turn === 'A' ? 'B' : 'A';
      }
    }
  }

  function applyPull(side, move) {
    if (side === 'A') S.rope = Math.max(0, S.rope - move);
    else S.rope = Math.min(100, S.rope + move);
    if (arena) {
      arena.setRopePosition(S.rope);
      if (Math.abs(S.rope - 50) > 30) arena.triggerDanger(S.rope < 50 ? 'B' : 'A');
    }
  }

  function checkWin() {
    if (S.rope <= 0 || S.rope >= 100) {
      const winSide = S.rope <= 0 ? 'A' : 'B';
      setPads('off');
      stage(`🏆 ${winSide === 'A' ? S.nameA : S.nameB} νικά!`, winSide === 'A' ? 'a' : 'b');
      if (arena) arena.triggerVictory(winSide, endGame); else timeout(endGame, 1200);
      return true;
    }
    return false;
  }

  function advance(ms) {
    if (S.mode === 'classic') S.turn = S.turn === 'A' ? 'B' : 'A';
    S.idx++;
    timeout(nextQuestion, ms);
  }

  // ── reveal / option helpers ──────────────────────────────
  function revealCorrect(correctIdx, chosenIdx) {
    document.querySelectorAll('#tow-opts .tow-opt').forEach((b, i) => {
      b.disabled = true;
      if (i === correctIdx) b.classList.add('correct');
      else if (i === chosenIdx) b.classList.add('wrong');
    });
  }
  // knock out one wrong pick WITHOUT revealing the answer (used before a steal)
  function markEliminated(i) {
    const b = document.querySelectorAll('#tow-opts .tow-opt')[i];
    if (b) { b.classList.add('wrong', 'eliminated'); b.disabled = true; }
  }
  function enableOptions(on) {
    document.querySelectorAll('#tow-opts .tow-opt').forEach(b => {
      if (b.classList.contains('eliminated') || b.classList.contains('correct')) { b.disabled = true; return; }
      b.disabled = !on;
      b.classList.toggle('armed', on);
    });
    const oc = document.getElementById('tow-opts');
    if (oc) oc.classList.toggle('live', on);
  }

  // ── pads visual state ────────────────────────────────────
  function setPads(mode, activeSide) {
    ['A', 'B'].forEach(side => {
      const pad = document.getElementById('tow-pad-' + side);
      if (!pad) return;
      pad.className = 'tow-pad ' + (side === 'A' ? 'a' : 'b');
      const st = pad.querySelector('.tow-pad-state');
      const logged = S['logged' + side];
      if (!logged) { pad.classList.add('locked'); st.textContent = '🔒 Συνδεθείτε'; pad.disabled = true; return; }
      pad.disabled = false;
      if (mode === 'reading') { pad.classList.add('reading'); st.textContent = 'Περιμένετε…'; }
      else if (mode === 'armed') { pad.classList.add('live'); st.textContent = 'ΧΤΥΠΑ!'; }
      else if (mode === 'claimed') {
        if (side === activeSide) { pad.classList.add('claimed'); st.textContent = 'Απαντά'; }
        else { pad.classList.add('dim'); st.textContent = '—'; pad.disabled = true; }
      } else if (mode === 'steal') {
        if (side === activeSide) { pad.classList.add('live', 'steal'); st.textContent = 'ΚΛΕΨΕ!'; }
        else { pad.classList.add('dim'); st.textContent = '—'; pad.disabled = true; }
      } else { pad.classList.add('dim'); st.textContent = ''; pad.disabled = true; }
    });
  }
  function flashPad(side, cls, msg) {
    const pad = document.getElementById('tow-pad-' + side);
    if (!pad) return;
    pad.classList.remove('live', 'claimed', 'reading');
    pad.classList.add(cls);
    pad.disabled = true;
    const st = pad.querySelector('.tow-pad-state');
    if (st && msg) st.textContent = msg;
  }

  // ── buzz / answer timer (rAF, drives the ring + arena) ──
  function startBuzzTimer(sec, onExpire) {
    stopTimer();
    S.remain = sec;
    const start = performance.now();
    const ring = document.querySelector('#tow-buzz-timer span');
    const box = document.getElementById('tow-buzz-timer');
    if (box) box.classList.add('on');
    let lastTick = Math.ceil(sec);
    const loop = (now) => {
      const elapsed = (now - start) / 1000;
      S.remain = Math.max(0, sec - elapsed);
      const pct = (S.remain / sec) * 100;
      if (ring) {
        ring.style.width = pct + '%';
        ring.style.background = pct > 50 ? 'linear-gradient(90deg,#27ae60,#c9a44a)' : pct > 22 ? '#e0922a' : '#d64545';
      }
      const c = Math.ceil(S.remain);
      if (c !== lastTick && c <= 3 && c > 0 && window.TowAudio) { window.TowAudio.tick(); lastTick = c; }
      if (S.remain <= 0) { stopTimer(); onExpire && onExpire(); return; }
      S.timer = requestAnimationFrame(loop);
    };
    S.timer = requestAnimationFrame(loop);
  }
  function stopTimer() {
    if (S && S.timer) { cancelAnimationFrame(S.timer); S.timer = null; }
    const box = document.getElementById('tow-buzz-timer');
    if (box) box.classList.remove('on');
  }

  // ── keyboard (A side / L side; 1–4 to answer) ───────────
  function addKeys() {
    removeKeys();
    keyHandler = (e) => {
      if (!S || S.screen !== 'game') return;
      const k = e.key.toLowerCase();
      if (k === 'a') { e.preventDefault(); onBuzz('A'); return; }
      if (k === 'l') { e.preventDefault(); onBuzz('B'); return; }
      if (S.phase === 'claimed' && '1234'.includes(k)) {
        e.preventDefault();
        const btns = document.querySelectorAll('#tow-opts .tow-opt');
        const b = btns[parseInt(k) - 1];
        if (b && !b.disabled) b.click();
      }
    };
    document.addEventListener('keydown', keyHandler);
  }
  function removeKeys() { if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; } }

  // ── END ──────────────────────────────────────────────────
  function endGame() {
    stopTimer(); removeKeys();
    if (arena) { arena.stop(); arena = null; }
    S.screen = 'end';
    const winner = S.rope < 50 ? S.nameA : S.rope > 50 ? S.nameB : null;
    const wc = S.rope < 50 ? 'a' : S.rope > 50 ? 'b' : 'tie';
    const wrap = document.getElementById(WRAP_ID);
    wrap.innerHTML = `
    <div class="tow-end">
      <div class="tow-end-crown ${wc}">${winner ? '🏆' : '⚖'}</div>
      <h1 class="tow-end-title ${wc}">${winner ? winner + ' νικά!' : 'Ισοπαλία!'}</h1>
      <p class="tow-end-sub">${winner ? 'Το σχοινί πέρασε το κατώφλι.' : 'Ισόρροπη μάχη — κανείς δεν λύγισε.'}</p>
      <div class="tow-end-scores">
        <div class="tow-end-score a"><span>${S.nameA}</span><b>${S.scoreA}</b></div>
        <div class="tow-end-rope"><canvas id="tow-replay"></canvas></div>
        <div class="tow-end-score b"><span>${S.nameB}</span><b>${S.scoreB}</b></div>
      </div>
      <div class="tow-end-btns">
        <button class="tow-start-btn slim" id="tow-rematch">↻ Ρεβάνς</button>
        <button class="tow-ghost-btn" id="tow-tolobby">Αλλαγή ομάδων</button>
      </div>
    </div>`;
    document.getElementById('tow-rematch').addEventListener('click', () => { startGame(); });
    document.getElementById('tow-tolobby').addEventListener('click', renderLobby);
    requestAnimationFrame(() => drawReplay('tow-replay', S.history));
  }

  function drawReplay(id, history) {
    const cvs = document.getElementById(id);
    if (!cvs || !history || !history.length) return;
    const ctx = cvs.getContext('2d');
    const W = cvs.offsetWidth || 360, H = 54;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    cvs.width = W * dpr; cvs.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#1a1610'; ctx.fillRect(0, 0, W, H);
    const zg = ctx.createLinearGradient(0, 0, W, 0);
    zg.addColorStop(0, 'rgba(94,168,216,0.18)'); zg.addColorStop(0.48, 'rgba(0,0,0,0)');
    zg.addColorStop(0.52, 'rgba(0,0,0,0)'); zg.addColorStop(1, 'rgba(217,105,74,0.18)');
    ctx.fillStyle = zg; ctx.fillRect(0, 0, W, H);
    ctx.save(); ctx.setLineDash([4, 5]); ctx.strokeStyle = 'rgba(201,164,74,0.25)';
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke(); ctx.restore();
    const n = history.length, PAD = 12;
    const xOf = i => PAD + (i / Math.max(n - 1, 1)) * (W - PAD * 2);
    const yOf = r => 6 + (r / 100) * (H - 12);
    if (n > 1) {
      ctx.beginPath();
      history.forEach((h, i) => i === 0 ? ctx.moveTo(xOf(i), yOf(h.rope)) : ctx.lineTo(xOf(i), yOf(h.rope)));
      ctx.strokeStyle = 'rgba(201,164,74,0.4)'; ctx.lineWidth = 1.6; ctx.stroke();
    }
    history.forEach((h, i) => {
      ctx.beginPath(); ctx.arc(xOf(i), yOf(h.rope), 3.4, 0, 6.283);
      ctx.fillStyle = h.result === 'correct' ? '#5dca8a' : h.result === 'wrong' ? '#e67e6a' : '#e0922a';
      ctx.fill();
    });
  }

  // ── small utils ──────────────────────────────────────────
  function stage(txt, kind) {
    const el = document.getElementById('tow-stage');
    if (!el) return;
    el.textContent = txt;
    el.className = 'tow-stage ' + (kind || '');
  }
  function setText(id, t) { const e = document.getElementById(id); if (e) e.textContent = t; }
  function updateScores() { setText('tow-sa', S.scoreA); setText('tow-sb', S.scoreB); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function timeout(fn, ms) { S._to = setTimeout(fn, ms); }
})();
