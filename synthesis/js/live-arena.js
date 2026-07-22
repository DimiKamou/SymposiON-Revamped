/*
  LiveArena — Agora Live Arena
  Real-time synchronous classroom quiz engine.

  Host entry:    LiveArena.launchHost({ questions, gameName })
  Student entry: LiveArena.launchStudent()

  Dataset shape:
    { q: 'Question text', opts: ['A','B','C','D'], ans: 0 }

  Firestore layout:
    live_arenas/{pin}                      — arena state doc
    live_arenas/{pin}/players/{uid}        — player record + score
    live_arenas/{pin}/answers/{uid}_q{n}   — per-question answer

  Required Firestore rules (add to firestore.rules):
    match /live_arenas/{pin} {
      allow read:   if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null;
      match /players/{uid} {
        allow read:  if request.auth != null;
        allow write: if request.auth != null;
      }
      match /answers/{answerId} {
        allow read:   if request.auth != null;
        allow create: if request.auth != null;
      }
    }
*/
const LiveArena = (() => {

  const Q_DURATION = 25; // default seconds per question (host setup can override)
  // Per-question duration: the host setup screen passes config.timePerQ (5–30);
  // fall back to the default. Clamped so a bad value can't break the timer.
  function _qDur() {
    const v = _cfg && _cfg.config && +_cfg.config.timePerQ;
    return (v && v >= 3 && v <= 120) ? v : Q_DURATION;
  }
  const MEDALS     = ['🥇', '🥈', '🥉', '4.', '5.'];

  /* ── Dataset registry ───────────────────────────────────
     Each entry: { id, icon, label:{gr,en}, getQuestions:()=>[] }
     External callers add entries via LiveArena.registerDataset(…)    ─────────────────────────────────────────────────────── */
  const _DATASETS = [
    {
      id:   'iliada',
      icon: '⚔️',
      label: { gr: 'Ιλιάδα Trivia', en: 'Iliad Trivia' },
      getQuestions() {
        if (typeof QUESTIONS === 'undefined') return null;
        const lang = (typeof siteLang !== 'undefined' && siteLang === 'en') ? 'en' : 'gr';
        const pool = QUESTIONS[lang] || QUESTIONS.gr;
        return pool ? Object.values(pool).flat() : null;
      },
    },
    {
      id:   'odyssey',
      icon: '🌊',
      label: { gr: 'Οδύσσεια Trivia', en: 'Odyssey Trivia' },
      getQuestions() {
        if (typeof OD_QUESTIONS === 'undefined') return null;
        const lang = (typeof siteLang !== 'undefined' && siteLang === 'en') ? 'en' : 'gr';
        const pool = OD_QUESTIONS[lang] || OD_QUESTIONS.gr;
        return pool ? Object.values(pool).flat() : null;
      },
    },
  ];

  /* ── Role helper ────────────────────────────────────────
     Returns true for teacher or admin — the only roles that
     may host a Live Arena session.                         */
  function _isTeacher() {
    return (typeof isAdmin        !== 'undefined' && isAdmin)
        || (typeof currentUserRole !== 'undefined'
            && (currentUserRole === 'teacher' || currentUserRole === 'admin'));
  }

  /* ── Module state ───────────────────────────────────────── */
  let _mode         = null;  // 'host' | 'student'
  let _pin          = null;
  let _cfg          = {};    // { questions[], gameName }
  let _arenaState   = {};    // mirror of last arena snapshot
  let _qIdx         = 0;
  let _answered     = false;
  let _uid          = null;
  let _totalPlayers = 0;
  let _timerInt     = null;
  let _matchInt     = null;   // match-level wall-clock interval (total game duration)
  let _matchEnd     = 0;      // epoch ms when the match must end (winBy==='time')
  let _listeners    = [];    // [ unsubscribeFn, ... ]
  let _ansUnsub     = null;  // isolated answer-count listener slot

  /* ── DUEL (Friendly Battle · 1v1) state ─────────────────────
     A parallel, 2-seat real-time room (Firestore duels/{pin}). Head-to-head:
     both players answer the SAME shared bank at their own pace; the room ends
     by rounds (best-of-N questions) or target score. Reuses PIN mint, invite
     links (?join=PIN&duel=1) and reward/mistake hooks; scoring mirrors
     pvp.js answer() (streak × 100, capped ×5). */
  let _isDuel     = false;   // true when this session is a duel (not a class arena)
  let _duelSeat   = null;    // 'host' | 'guest'
  let _duelState  = {};      // mirror of the last duel doc snapshot
  let _duelStarted= false;   // guards double-start when status flips to 'active'
  let _duelScore  = 0;       // my running score
  let _duelStreak = 0;       // my running streak (drives the ×multiplier)
  let _duelDone   = false;   // I have finished my side of the bank / hit a limit
  let _duelMode   = null;    // the chosen PVP_DUEL_MODES entry (accent/glyph theming)
  let _duelOppUnsub = null;  // onSnapshot of the opponent's player doc

  /* ── Firestore helpers ──────────────────────────────────── */
  const db         = () => firebase.firestore();
  const arenaRef   = (pin) => db().collection('live_arenas').doc(String(pin));
  const playersCol = (pin) => arenaRef(pin).collection('players');
  const answersCol = (pin) => arenaRef(pin).collection('answers');
  const playerRef  = (pin, uid) => playersCol(pin).doc(uid);
  const answerRef  = (pin, uid, q) => answersCol(pin).doc(`${uid}_q${q}`);

  /* ── Duel Firestore helpers (parallel collection: duels/{pin}) ── */
  const duelRef       = (pin) => db().collection('duels').doc(String(pin));
  const duelPlayersCol= (pin) => duelRef(pin).collection('players');
  const duelPlayerRef = (pin, uid) => duelPlayersCol(pin).doc(uid);

  /* ════════════════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════════════════ */

  // Smart entry point for the ⚡ Live nav button.
  // Teachers see the Host / Join picker; students go straight to Join.
  function launchPicker() {
    _reset();
    _showOverlay();
    if (_isTeacher()) {
      _showScreen('la-picker');
    } else {
      _mode = 'student';
      _showScreen('la-join');
      const inp = document.getElementById('la-pin-input');
      if (inp) inp.value = '';
      _joinError('');
      _resetJoinBtn();
    }
  }

  // Navigate back to the picker screen (used by back buttons).
  function showPicker() { _showScreen('la-picker'); }

  // Render the dataset list and show the host dataset picker screen.
  function pickDataset() { _showDatasetPicker(); }

  // Select a dataset by registry index and launch hosting.
  function selectDataset(idx) {
    const ds = _DATASETS[idx];
    if (!ds) return;
    const qs = ds.getQuestions();
    if (!qs || !qs.length) return;
    const label = typeof ds.label === 'object' ? t(ds.label.gr, ds.label.en) : ds.label;
    launchHost({ questions: qs, gameName: label });
  }

  // Register a custom dataset so it appears in the host picker.
  // Usage: LiveArena.registerDataset({ id, icon, label:{gr,en}, getQuestions:()=>[] })
  function registerDataset(dataset) {
    if (dataset && typeof dataset.getQuestions === 'function') _DATASETS.push(dataset);
  }

  function launchHost(config = {}) {
    _reset();
    _mode = 'host';
    _cfg  = { questions: [], gameName: 'Live Arena', ...config };
    _showOverlay();
    _showScreen('la-host-lobby');
    // Fresh session: clear any leftover chips and show the empty state up-front
    // (before the first players snapshot lands).
    const grid = document.getElementById('la-player-grid');
    if (grid) grid.innerHTML = '';
    _laUpdatePlayersEmpty();
    _createArena();
  }

  function launchStudent() {
    _reset();
    _mode = 'student';
    _showOverlay();
    _showScreen('la-join');
    const inp = document.getElementById('la-pin-input');
    if (inp) inp.value = '';
    _joinError('');
    _resetJoinBtn();
  }

  async function close() {
    _detachAll();
    if (window.SymFlappy) SymFlappy.unmount();
    const ov = document.getElementById('la-overlay');
    if (ov) ov.style.display = 'none';
    _reset();
  }

  async function startBattle() {
    if (!_pin || !_cfg.questions.length) return;
    const btn = document.getElementById('la-start-btn');
    if (btn) { btn.disabled = true; btn.textContent = t('Εκκίνηση…', 'Starting…'); }
    _qIdx = 0;
    _startMatchClock();
    await _pushQuestion(0);
  }

  // Total game-duration match-end (only when win-by = "Με χρόνο"). A single
  // low-frequency interval; on expiry the match ends after the current
  // question resolves (also guarded in _pushQuestion / _showHostResults).
  function _startMatchClock() {
    _stopMatchClock();
    const cfg = (_cfg && _cfg.config) || {};
    if (cfg.winBy !== 'time') return;
    const mins = +cfg.gameDurationMin;
    if (!(mins > 0)) return;
    _matchEnd = Date.now() + mins * 60 * 1000;
    _matchInt = setInterval(() => {
      if (Date.now() >= _matchEnd) { _stopMatchClock(); _endArena(); }
    }, 1000);
  }
  function _stopMatchClock() {
    if (_matchInt) { clearInterval(_matchInt); _matchInt = null; }
    _matchEnd = 0;
  }

  async function submitJoin() {
    // Guard: Firestore rules require authentication for all writes
    if (typeof currentUser === 'undefined' || !currentUser) {
      _joinError(t('Απαιτείται σύνδεση για συμμετοχή', 'Login required to join'));
      if (typeof openAuthModal === 'function') openAuthModal('login');
      return;
    }

    const inp = document.getElementById('la-pin-input');
    const raw = inp ? inp.value.trim() : '';
    if (!/^\d{6}$/.test(raw)) {
      _joinError(t('Εισάγετε 6-ψήφιο κωδικό', 'Enter a 6-digit PIN'));
      return;
    }
    _joinError('');
    const btn = document.getElementById('la-join-btn');
    if (btn) { btn.disabled = true; btn.textContent = '…'; }

    try {
      const snap = await arenaRef(raw).get();
      if (!snap.exists) {
        _joinError(t('Το Arena δεν βρέθηκε', 'Arena not found'));
        _resetJoinBtn(); return;
      }
      const data = snap.data();
      if (data.status === 'closed') {
        _joinError(t('Το Arena έκλεισε', 'This Arena has ended'));
        _resetJoinBtn(); return;
      }

      _pin        = raw;
      _arenaState = data;
      _uid        = (typeof currentUser !== 'undefined' && currentUser)
                      ? currentUser.uid
                      : ('anon_' + Math.random().toString(36).slice(2, 9));
      const name  = (typeof currentUser !== 'undefined' && currentUser)
                      ? (currentUser.displayName || currentUser.email || 'Μαθητής')
                      : 'Μαθητής';

      await playerRef(_pin, _uid).set({
        name,
        uid:      _uid,
        score:    0,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      _listenAsStudent();
    } catch (err) {
      console.error('[LiveArena] join:', err);
      _joinError(t('Σφάλμα σύνδεσης', 'Connection error'));
      _resetJoinBtn();
    }
  }

  /* ════════════════════════════════════════════════════════
     HOST FLOW
  ════════════════════════════════════════════════════════ */

  async function _createArena() {
    _pin = _genPin();
    _setEl('la-pin-display',   _pin);
    _setEl('la-game-title',    _cfg.gameName);
    _setEl('la-player-count',  '0');
    _setEl('la-lobby-q-count', _cfg.questions.length + ' ' + t('ερωτήσεις', 'questions'));
    _paintLobbyConfig();

    try {
      await arenaRef(_pin).set({
        status:           'lobby',
        activeQuestion:   0,
        answersSubmitted: 0,
        totalPlayers:     0,
        hostUid:          (typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : 'anon',
        gameName:         _cfg.gameName,
        createdAt:        firebase.firestore.FieldValue.serverTimestamp(),
      });
      _listenHostLobby();
    } catch (err) {
      console.error('[LiveArena] create:', err);
      if (typeof showToast === 'function') showToast('Σφάλμα δημιουργίας', 'Failed to create arena');
    }
  }

  function _listenHostLobby() {
    const unsub = playersCol(_pin)
      .orderBy('joinedAt', 'asc')
      .onSnapshot(snap => {
        _totalPlayers = snap.size;
        _setEl('la-player-count', _totalPlayers);

        const grid = document.getElementById('la-player-grid');
        if (!grid) return;

        // Reconcile: drop chips for players who left / were kicked …
        const ids = new Set(snap.docs.map(d => d.id));
        Array.from(grid.querySelectorAll('.la-player-chip')).forEach(el => {
          if (!ids.has(el.dataset.uid)) el.remove();
        });
        // … then add chips for new joiners (avatar + name + hover kick).
        const existing = new Set(
          Array.from(grid.querySelectorAll('.la-player-chip')).map(el => el.dataset.uid)
        );
        snap.docs.forEach(doc => {
          if (existing.has(doc.id)) return;
          const name = doc.data().name || t('Παίκτης', 'Player');
          const chip = document.createElement('div');
          chip.className   = 'la-player-chip la-seat';
          chip.dataset.uid = doc.id;
          chip.innerHTML =
            `<button class="la-player-kick" title="${t('Αφαίρεση', 'Remove')}" aria-label="${t('Αφαίρεση', 'Remove')}">✕</button>` +
            `<span class="la-player-av la-seat-av" style="background:${_laColorFor(name)}">${_esc(_laInitials(name))}</span>` +
            `<span class="la-player-name la-seat-name">${_esc(name)}</span>` +
            `<span class="la-seat-sub">${t('μπήκε', 'joined')}</span>`;
          const kb = chip.querySelector('.la-player-kick');
          if (kb) kb.onclick = () => _kickPlayer(doc.id, chip);
          grid.appendChild(chip);
          requestAnimationFrame(() => chip.classList.add('la-chip-visible', 'la-chip-pop'));
        });
        _laUpdatePlayersEmpty();

        arenaRef(_pin).update({ totalPlayers: _totalPlayers }).catch(() => {});
      }, err => console.error('[LiveArena] lobby listener:', err));
    _listeners.push(unsub);
  }

  async function _pushQuestion(idx) {
    const cfg = (_cfg && _cfg.config) || {};
    // total-duration match-end: if the wall-clock has run out, stop here.
    if (cfg.winBy === 'time' && _matchEnd && Date.now() >= _matchEnd) { await _endArena(); return; }
    // rounds match-end: make the engine authoritative (picker also pre-slices).
    if (cfg.winBy === 'rounds' && cfg.rounds && idx >= cfg.rounds) { await _endArena(); return; }
    const q = _cfg.questions[idx];
    if (!q) { await _endArena(); return; }

    const timerEnd = Date.now() + _qDur() * 1000;

    await arenaRef(_pin).update({
      status:           'question',
      activeQuestion:   idx,
      answersSubmitted: 0,
      totalPlayers:     _totalPlayers,
      questionData:     { q: q.q, opts: q.opts }, // correctAns deliberately omitted
      timerEnd,
    });

    _showHostQuestion(q, idx, timerEnd);
    _attachAnswerCountListener();
  }

  function _showHostQuestion(q, idx, timerEnd) {
    _showScreen('la-host-question');
    _setEl('la-hq-game',      _cfg.gameName);
    _setEl('la-hq-qnum',      t('Ερώτηση', 'Question') + ' ' + (idx + 1) + ' / ' + _cfg.questions.length);
    _setEl('la-hq-text',      q.q);
    _setEl('la-hq-ans-count', '0');
    _setEl('la-hq-total',     String(_totalPlayers));

    const opts = document.getElementById('la-hq-opts');
    if (opts) {
      const L = ['A', 'B', 'C', 'D'];
      opts.innerHTML = (q.opts || []).map((o, i) =>
        `<div class="la-hq-opt">` +
          `<span class="la-opt-ltr">${L[i]}</span>` +
          `<span>${_esc(o)}</span>` +
        `</div>`
      ).join('');
    }

    _startHostTimer(timerEnd, q.ans, idx);
  }

  function _attachAnswerCountListener() {
    if (_ansUnsub) { _ansUnsub(); _ansUnsub = null; }
    _ansUnsub = arenaRef(_pin).onSnapshot(snap => {
      const d = snap.data() || {};
      _setEl('la-hq-ans-count', d.answersSubmitted || 0);
      _setEl('la-hq-total',     d.totalPlayers     || _totalPlayers);
    }, err => console.error('[LiveArena] ans-count:', err));
  }

  function _startHostTimer(timerEnd, correctAns, qIdx) {
    _stopTimer();
    const circumference = 2 * Math.PI * 44; // SVG r = 44
    const arcEl = document.getElementById('la-timer-arc');
    const numEl = document.getElementById('la-hq-timer');
    if (arcEl) {
      arcEl.style.strokeDasharray  = circumference;
      arcEl.style.strokeDashoffset = 0;
    }

    const tick = () => {
      const rem = Math.max(0, (timerEnd - Date.now()) / 1000);
      if (numEl) numEl.textContent = Math.ceil(rem);
      if (arcEl) {
        const dur = _qDur();
        arcEl.style.strokeDashoffset = circumference * (1 - rem / dur);
        arcEl.style.stroke = rem > dur * 0.5 ? '#4a9e5c'
                           : rem > dur * 0.25 ? '#c9a44a'
                           : '#c0392b';
      }
      if (rem <= 0) { _stopTimer(); _showHostResults(correctAns, qIdx); }
    };
    tick();
    _timerInt = setInterval(tick, 300);
  }

  async function _showHostResults(correctAns, qIdx) {
    if (_ansUnsub) { _ansUnsub(); _ansUnsub = null; }

    await arenaRef(_pin).update({ status: 'results', correctAns });
    _showScreen('la-host-results');

    // Tally answer counts from subcollection
    try {
      const snap   = await answersCol(_pin).where('questionIndex', '==', qIdx).get();
      const counts = [0, 0, 0, 0];
      snap.forEach(doc => {
        const c = doc.data().choice;
        if (c >= 0 && c < 4) counts[c]++;
      });
      _renderBarChart(counts, correctAns, _cfg.questions[qIdx]);
    } catch (err) {
      console.error('[LiveArena] tally:', err);
      _renderBarChart([0, 0, 0, 0], correctAns, _cfg.questions[qIdx]);
    }

    const topScore = await _renderLeaderboard();

    const cfg = (_cfg && _cfg.config) || {};
    let isLast = qIdx >= _cfg.questions.length - 1;
    // rounds: end on the configured round even if more questions remain.
    if (cfg.winBy === 'rounds' && cfg.rounds) isLast = isLast || (qIdx >= cfg.rounds - 1);
    // target-score: end as soon as the leader reaches it.
    if (cfg.winBy === 'score' && cfg.targetScore && topScore >= cfg.targetScore) isLast = true;
    // total duration: if the match wall-clock has expired, this is the last screen.
    if (cfg.winBy === 'time' && _matchEnd && Date.now() >= _matchEnd) isLast = true;

    const nextBtn = document.getElementById('la-hr-next-btn');
    if (nextBtn) {
      nextBtn.textContent = isLast
        ? t('🏁 Τέλος Παιχνιδιού', '🏁 End Game')
        : t('▶ Επόμενη Ερώτηση', '▶ Next Question');
      nextBtn.onclick = isLast
        ? () => _endArena()
        : () => { _qIdx++; _pushQuestion(_qIdx); };
    }
  }

  function _renderBarChart(counts, correctAns, q) {
    _setEl('la-hr-qtext', q ? q.q : '');
    const chart = document.getElementById('la-hr-chart');
    if (!chart) return;

    const max  = Math.max(...counts, 1);
    const L    = ['A', 'B', 'C', 'D'];
    chart.innerHTML = counts.map((c, i) =>
      `<div class="la-bar-row${i === correctAns ? ' la-bar-correct' : ''}">` +
        `<span class="la-bar-ltr">${L[i]}</span>` +
        `<div class="la-bar-track">` +
          `<div class="la-bar-fill" data-w="${Math.round(c / max * 100)}%" style="width:0"></div>` +
        `</div>` +
        `<span class="la-bar-cnt">${c}</span>` +
      `</div>`
    ).join('');

    // Two rAF passes so CSS transition fires after paint
    requestAnimationFrame(() => requestAnimationFrame(() => {
      chart.querySelectorAll('.la-bar-fill').forEach(el => {
        el.style.width = el.dataset.w;
      });
    }));
  }

  async function _renderLeaderboard() {
    const wrap = document.getElementById('la-hr-lb');
    if (!wrap) return 0;
    try {
      const snap    = await playersCol(_pin).get();
      const players = snap.docs
        .map(d => d.data())
        .sort((a, b) => (b.score || 0) - (a.score || 0))
        .slice(0, 5);

      wrap.innerHTML =
        `<div class="la-lb-title">🏆 ${t('Κατάταξη', 'Leaderboard')}</div>` +
        players.map((p, i) =>
          `<div class="la-lb-row">` +
            `<span class="la-lb-medal">${MEDALS[i]}</span>` +
            `<span class="la-lb-name">${_esc(p.name || 'Player')}</span>` +
            `<span class="la-lb-score">${p.score || 0}</span>` +
          `</div>`
        ).join('');
      return players.length ? (players[0].score || 0) : 0;
    } catch (err) {
      console.error('[LiveArena] leaderboard:', err);
      return 0;
    }
  }

  async function _endArena() {
    try { await arenaRef(_pin).update({ status: 'closed' }); } catch (_) {}
    close();
  }

  /* ════════════════════════════════════════════════════════
     STUDENT FLOW
  ════════════════════════════════════════════════════════ */

  function _listenAsStudent() {
    const unsub = arenaRef(_pin).onSnapshot(snap => {
      if (!snap.exists) return;
      const data     = snap.data();
      const prevStat = _arenaState.status;
      const prevQ    = _arenaState.activeQuestion;
      _arenaState    = data;

      if (data.status === 'lobby') {
        _showScreen('la-student-lobby');
        _setEl('la-sl-game', data.gameName || 'Live Arena');

      } else if (data.status === 'question') {
        // Only re-render when the question actually changes
        if (prevStat !== 'question' || prevQ !== data.activeQuestion) {
          _answered = false;
          _showStudentQuestion(data);
        }

      } else if (data.status === 'results') {
        _stopTimer();
        _showStudentResult(data);

      } else if (data.status === 'closed') {
        _detachAll();
        _showScreen('la-student-lobby');
        _setEl('la-sl-game',   t('Τέλος παιχνιδιού', 'Game over'));
        _setEl('la-sl-status', t('Η συνεδρία ολοκληρώθηκε', 'Session complete'));
      }
    }, err => console.error('[LiveArena] student listener:', err));
    _listeners.push(unsub);

    // Immediately honour current state (student joined mid-lobby)
    if (_arenaState.status === 'lobby') {
      _showScreen('la-student-lobby');
      _setEl('la-sl-game', _arenaState.gameName || 'Live Arena');
    }
  }

  function _showStudentQuestion(data) {
    _showScreen('la-student-question');
    const q = data.questionData;
    if (!q) return;

    _setEl('la-sq-text', q.q);

    const grid = document.getElementById('la-sq-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const BG     = ['#1e4d35', '#1a3a5c', '#5c2010', '#3a1a5c'];
    const LABELS = ['A', 'B', 'C', 'D'];

    (q.opts || []).forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'la-sq-btn';
      btn.style.setProperty('--la-btn-bg', BG[i]);
      btn.innerHTML =
        `<span class="la-sq-ltr">${LABELS[i]}</span>` +
        `<span class="la-sq-opt">${_esc(opt)}</span>`;
      btn.addEventListener('click', () => _submitStudentAnswer(i, data.activeQuestion));
      grid.appendChild(btn);
    });

    _startStudentTimer(data.timerEnd);
  }

  function _startStudentTimer(timerEnd) {
    _stopTimer();
    const el = document.getElementById('la-sq-timer');
    const tick = () => {
      const rem = Math.max(0, Math.ceil((timerEnd - Date.now()) / 1000));
      if (el) {
        el.textContent = rem;
        el.classList.toggle('la-timer-urgent', rem <= 5 && rem > 0);
      }
      if (rem <= 0) {
        _stopTimer();
        if (!_answered) {
          _showScreen('la-student-waiting');
          _setEl('la-sw-msg', t('Ο χρόνος τελείωσε!', "Time's up!"));
        }
      }
    };
    tick();
    _timerInt = setInterval(tick, 500);
  }

  async function _submitStudentAnswer(choice, qIdx) {
    if (_answered) return;
    _answered = true;

    // Visual: highlight chosen, dim others
    const btns = document.querySelectorAll('.la-sq-btn');
    btns.forEach((b, i) => {
      b.disabled = true;
      if (i === choice) b.classList.add('la-ans-chosen');
      else              b.style.opacity = '0.4';
    });

    try {
      await answerRef(_pin, _uid, qIdx).set({
        questionIndex: qIdx,
        choice,
        uid:           _uid,
        submittedAt:   firebase.firestore.FieldValue.serverTimestamp(),
      });
      await arenaRef(_pin).update({
        answersSubmitted: firebase.firestore.FieldValue.increment(1),
      });
    } catch (err) {
      console.error('[LiveArena] answer submit:', err);
    }

    _showScreen('la-student-waiting');
    _setEl('la-sw-msg', t('Αναμονή συμμαθητών…', 'Waiting for classmates…'));
  }

  async function _showStudentResult(data) {
    // Student never answered (timed out or joined late) — always wrong
    if (!_answered) { _flashResult(false); return; }

    try {
      const doc     = await answerRef(_pin, _uid, data.activeQuestion).get();
      const correct = doc.exists && doc.data().choice === data.correctAns;

      // Tartarus capture: log the learner's wrong pick to the mistake archive.
      if (!correct && typeof window.symLogMistake === 'function') {
        try {
          const q    = (_cfg.questions && _cfg.questions[data.activeQuestion]) || {};
          const opts = q.opts || q.a || [];
          const ch   = doc.exists ? doc.data().choice : null;
          window.symLogMistake({
            q: q.q,
            wrong: (ch != null && opts[ch]) || '',
            right: opts[data.correctAns] || '',
            cat: 'Live Arena', gameId: 'live-arena',
          });
        } catch (_) {}
      }

      if (correct) {
        await playerRef(_pin, _uid).update({
          score: firebase.firestore.FieldValue.increment(100),
        }).catch(() => {});
      }

      _flashResult(correct);
    } catch (err) {
      console.error('[LiveArena] result:', err);
      _flashResult(false);
    }
  }

  function _flashResult(correct) {
    _showScreen('la-student-result');
    const screen = document.getElementById('la-student-result');
    screen.classList.remove('la-result-correct', 'la-result-wrong');
    void screen.offsetWidth; // force reflow so animation restarts cleanly

    if (correct) {
      screen.classList.add('la-result-correct');
      _setEl('la-sr-icon',  '✓');
      _setEl('la-sr-label', t('Σωστό!', 'Correct!'));
      _setEl('la-sr-pts',   '+100');
      _launchParticles();
      // ── Temple: award per correct answer in the arena (config-driven) ──
      if (typeof awardGameRewards === 'function') awardGameRewards('live-arena', {});
      else if (typeof awardRewards === 'function') awardRewards(15, 1);
    } else {
      screen.classList.add('la-result-wrong');
      _setEl('la-sr-icon',  '✗');
      _setEl('la-sr-label', t('Λάθος', 'Wrong'));
      _setEl('la-sr-pts',   '');
    }
  }

  /* ════════════════════════════════════════════════════════
     DATASET PICKER (host step 2) — hierarchical navigation
     Root → Section (Γυμνάσιο/Λύκειο/Γραμματική) → Grade → Datasets
  ════════════════════════════════════════════════════════ */

  let _laNav = { level: 'root', sectionKey: null, gradeKey: null };

  // Section definitions drive the top-level tiles
  const _LA_SECTIONS = [
    { key: 'gymnasio',   icon: '🏛️', labelGr: 'Γυμνάσιο',   labelEn: 'Middle School',
      grades: ['gym-a','gym-b','gym-c'] },
    { key: 'lykeio',     icon: '📜', labelGr: 'Λύκειο',     labelEn: 'High School',
      grades: ['lyk-a','lyk-b','lyk-c'] },
    { key: 'grammatiki', icon: '📖', labelGr: 'Γραμματική', labelEn: 'Grammar',
      grades: ['gram-nea','gram-arch','gram-lat'] },
  ];

  // Returns true if the teacher can host content at this tier
  function _laCanAccess(tier) {
    if (typeof isAdmin !== 'undefined' && isAdmin) return true;
    if (typeof _gpCanAccessTier === 'function') return _gpCanAccessTier(tier || 'free');
    const role = (typeof currentUserRole !== 'undefined') ? currentUserRole : 'free';
    if (!tier || tier === 'free') return true;
    if (tier === 'student') return role === 'student' || role === 'teacher';
    if (tier === 'teacher') return role === 'teacher';
    return false;
  }

  /* ── Multi-select accumulator ──────────────────────────────
     Leaves (trivia sets, grammar/GP datasets) toggle into _laSel
     instead of launching immediately; the footer button combines
     every picked source into one bank and hosts it. Each entry:
     { key, label, get:()=>Promise<Array>|Array }                */
  let _laSel = [];

  function _laIsSel(key) { return _laSel.some(s => s.key === key); }

  function _laToggle(entry, btn) {
    const i = _laSel.findIndex(s => s.key === entry.key);
    const on = i < 0;
    if (i >= 0) _laSel.splice(i, 1); else _laSel.push(entry);
    if (btn) {
      btn.classList.toggle('la-ds-selected', on);
      const arrow = btn.querySelector('.la-ds-arrow');
      if (arrow) arrow.textContent = on ? '✓' : '+';
    }
    _laUpdateCombineBtn();
  }

  function _laUpdateCombineBtn() {
    const btn = document.getElementById('la-combine-btn');
    if (!btn) return;
    const n = _laSel.length;
    const c = document.getElementById('la-sel-count');
    if (c) c.textContent = n;
    btn.disabled = n === 0;
    btn.style.display = n > 0 ? '' : 'none';
  }

  // A selectable leaf item (toggles into _laSel; ✓ when picked).
  function _laToggleItem(icon, name, sub, locked, entry) {
    const on = _laIsSel(entry.key);
    const btn = document.createElement('button');
    btn.className = 'la-ds-item' + (locked ? ' la-ds-locked' : '') + (on ? ' la-ds-selected' : '');
    btn.innerHTML =
      `<span class="la-ds-icon">${locked ? '🔒' : icon}</span>` +
      `<span class="la-ds-info">` +
        `<span class="la-ds-name">${_esc(name)}</span>` +
        `<span class="la-ds-count">${_esc(sub)}</span>` +
      `</span>` +
      `<span class="la-ds-arrow">${locked ? '' : (on ? '✓' : '+')}</span>`;
    if (!locked) btn.addEventListener('click', () => _laToggle(entry, btn));
    return btn;
  }

  // Combine every picked source into one bank and host it.
  async function _laLaunchCombined() {
    if (!_laSel.length) return;
    const sel  = _laSel.slice();
    const list = document.getElementById('la-dataset-list');
    if (list) list.innerHTML = `<p class="la-ds-empty" style="color:#C9A44A">⏳ ${t('Συνδυασμός…', 'Combining…')}</p>`;
    let combined = [];
    try {
      const arrs = await Promise.all(sel.map(s => Promise.resolve(s.get()).catch(() => [])));
      arrs.forEach(a => { if (Array.isArray(a)) combined = combined.concat(a); });
    } catch (_) {}
    combined = combined.filter(q => q && q.opts && q.opts.length >= 2);
    if (!combined.length) {
      if (list) list.innerHTML = `<p class="la-ds-empty">${t('Δεν βρέθηκαν ερωτήσεις.', 'No questions found.')}</p>`;
      return;
    }
    // shuffle so mixed sources interleave
    for (let i = combined.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [combined[i], combined[j]] = [combined[j], combined[i]]; }
    const gameName = sel.length === 1 ? sel[0].label : (sel[0].label + ' +' + (sel.length - 1));
    _laSel = [];
    launchHost({ questions: combined, gameName });
  }

  function _showDatasetPicker() {
    // Make the overlay visible. pickDataset() is reachable DIRECTLY from the
    // home "Φιλοξένησε/Host" button (openLiveArena({host:true})), not only from
    // the already-open la-picker screen — without this the host content picker
    // renders into a display:none overlay and the user just sees the loader
    // spin then "nothing happens".
    _showOverlay();
    _laNav = { level: 'root', sectionKey: null, gradeKey: null };
    _laSel = [];
    _laCatalog = null;
    _showScreen('la-host-dataset');
    _laNavRender();
    _laUpdateCombineBtn();
    // Warm the universal catalog (merges Firestore published packs) in the
    // background so "Όλη η ύλη" is populated the moment the host opens it.
    if (window.GP_CONTENT && typeof GP_CONTENT.loadCloud === 'function') {
      Promise.resolve(GP_CONTENT.loadCloud()).then(() => {
        _laCatalog = (window.SymMix && typeof SymMix.catalog === 'function') ? SymMix.catalog() : null;
        if (_laNav.level === 'universal') _laNavRender();
      }).catch(() => {});
    }
  }

  function navBack() {
    if (_laNav.level === 'umlevels') {
      // Universal-view level drill → back to the universal "Όλη η ύλη" list.
      _laNav = { level: 'universal', sectionKey: null, gradeKey: null };
      _laNavRender();
    } else if (_laNav.level === 'universal') {
      _laNav = { level: 'root', sectionKey: null, gradeKey: null };
      _laNavRender();
    } else if (_laNav.level === 'gplevels') {
      _laNav = { level: 'section', sectionKey: _laNav.sectionKey || 'grammatiki', gradeKey: null };
      _laNavRender();
    } else if (_laNav.level === 'grade') {
      _laNav = { level: 'section', sectionKey: _laNav.sectionKey, gradeKey: null };
      _laNavRender();
    } else if (_laNav.level === 'section') {
      _laNav = { level: 'root', sectionKey: null, gradeKey: null };
      _laNavRender();
    } else {
      showPicker();
    }
  }

  // Curriculum adapter. The host picker was written against a `GRADES` global
  // that does NOT exist in this codebase — the real curriculum lives in the
  // `CLASSES` grade list + `SUBJECTS` (grade-key → subject[]) map (mirrored onto
  // SYM.CLASSES/SYM.SUBJECTS, which carry live admin-catalog edits). Without this
  // every section/grade drill-down looked up GRADES[key] → undefined → rendered
  // an empty list. Returns { title, titleEn, subjects } or null.
  function _laGrade(gradeKey) {
    const subjMap = (typeof SYM !== 'undefined' && SYM.SUBJECTS) ? SYM.SUBJECTS
                  : (typeof SUBJECTS !== 'undefined' ? SUBJECTS : null);
    if (!subjMap) return null;
    const subs = subjMap[gradeKey];
    if (!Array.isArray(subs)) return null;
    const clsList = (typeof SYM !== 'undefined' && SYM.CLASSES) ? SYM.CLASSES
                  : (typeof CLASSES !== 'undefined' ? CLASSES : null);
    const cls = clsList ? clsList.find(c => c.id === gradeKey) : null;
    return { title: cls ? cls.gr : gradeKey, titleEn: cls ? (cls.en || cls.gr) : gradeKey, subjects: subs };
  }

  function _laNavRender() {
    const list  = document.getElementById('la-dataset-list');
    const title = document.getElementById('la-ds-title');
    if (!list) return;
    list.innerHTML = '';

    const { level, sectionKey, gradeKey } = _laNav;

    // Update back button and title
    if (title) {
      if (level === 'root') {
        title.textContent = t('Επίλεξε Ερωτηματολόγιο', 'Choose Question Set');
      } else if (level === 'universal') {
        title.textContent = t('Όλη η ύλη', 'All content');
      } else if (level === 'umlevels') {
        title.textContent = _laNav.dsLabel || t('Επίλεξε Επίπεδο', 'Choose Level');
      } else if (level === 'section') {
        const sec = _LA_SECTIONS.find(s => s.key === sectionKey);
        title.textContent = sec ? t(sec.labelGr, sec.labelEn) : t('Επίλεξε Βαθμίδα', 'Choose Level');
      } else if (level === 'grade') {
        const g = _laGrade(gradeKey);
        title.textContent = g ? t(g.title, g.titleEn) : t('Επίλεξε Ύλη', 'Choose Content');
      } else if (level === 'gplevels') {
        title.textContent = _laNav.dsLabel || t('Επίλεξε Επίπεδο', 'Choose Level');
      }
    }

    if (level === 'root')    { _laNavRenderRoot(list);               }
    else if (level === 'universal') { _laNavRenderUniversal(list);    }
    else if (level === 'umlevels')  { _laNavRenderUniversalLevels(list, _laNav.dsId); }
    else if (level === 'section') { _laNavRenderSection(list, sectionKey); }
    else if (level === 'grade')   { _laNavRenderGrade(list, gradeKey);    }
    else if (level === 'gplevels'){ _laNavRenderGpLevels(list, _laNav.dsId, _laNav.fn); }
  }

  function _laItem(icon, name, sub, locked, onClick) {
    const btn = document.createElement('button');
    btn.className = 'la-ds-item' + (locked ? ' la-ds-locked' : '');
    btn.innerHTML =
      `<span class="la-ds-icon">${locked ? '🔒' : icon}</span>` +
      `<span class="la-ds-info">` +
        `<span class="la-ds-name">${_esc(name)}</span>` +
        `<span class="la-ds-count">${_esc(sub)}</span>` +
      `</span>` +
      `<span class="la-ds-arrow">${locked ? '' : '→'}</span>`;
    if (!locked && onClick) btn.addEventListener('click', onClick);
    return btn;
  }

  function _laNavRenderRoot(list) {
    // ── Universal "Όλη η ύλη" — the SAME catalog the game panel offers ──
    // One tap into a flat, grouped list of ALL admin content (grammar + Homer
    // trivia + Latin + published packs) via SymMix.catalog(); a host can pick
    // any dataset(s), choose levels, and combine — identical universal ύλη.
    list.appendChild(_laItem(
      '🌐',
      t('Όλη η ύλη', 'All content'),
      t('Γραμματική + τρίβια + λατινικά + πακέτα', 'Grammar + trivia + Latin + packs'),
      false,
      () => { _laNav = { level: 'universal', sectionKey: null, gradeKey: null }; _laNavRender(); _laRefreshUniversal(); }
    ));

    // Divider
    const udiv = document.createElement('div');
    udiv.style.cssText = 'border-top:1px solid rgba(200,160,48,.18);margin:10px 0 6px';
    list.appendChild(udiv);

    // ── Section tiles ────────────────────────────────────
    _LA_SECTIONS.forEach(sec => {
      const gradeCount = sec.grades.length;
      list.appendChild(_laItem(
        sec.icon,
        t(sec.labelGr, sec.labelEn),
        t(`${gradeCount} τάξεις`, `${gradeCount} grades`),
        false,
        () => { _laNav = { level: 'section', sectionKey: sec.key, gradeKey: null }; _laNavRender(); }
      ));
    });

    // Divider
    const div = document.createElement('div');
    div.style.cssText = 'border-top:1px solid rgba(200,160,48,.18);margin:10px 0 6px';
    list.appendChild(div);

    // ── Built-in trivia datasets ─────────────────────────
    let shown = 0;
    _DATASETS.forEach((ds, idx) => {
      const qs = ds.getQuestions();
      if (!qs || !qs.length) return;
      shown++;
      const label = typeof ds.label === 'object' ? t(ds.label.gr, ds.label.en) : ds.label;
      list.appendChild(_laToggleItem(
        ds.icon, label,
        `${qs.length} ${t('ερωτήσεις', 'questions')}`,
        false,
        { key: 'ds:' + ds.id, label, get: () => ds.getQuestions() }
      ));
    });

    // ── Custom quiz ──────────────────────────────────────
    const hasCustomQuiz = (typeof isAdmin !== 'undefined' && isAdmin)
      || (Array.isArray(window.teacherFeatures) && window.teacherFeatures.includes('custom_quiz'));
    list.appendChild(_laItem(
      '✏️',
      t('Δικό μου Ερωτηματολόγιο', 'My Custom Quiz'),
      hasCustomQuiz
        ? t('Δημιούργησε ή ανέβασε ερωτήσεις', 'Build or upload questions')
        : t('Απαιτείται συνδρομή καθηγητή', 'Requires teacher subscription'),
      !hasCustomQuiz,
      () => _showScreen('la-custom-quiz')
    ));
  }

  /* ── Universal "Όλη η ύλη" view (mirrors the game-panel SymMix picker) ──
     Lists window.SymMix.catalog() grouped by category. Each dataset is a
     toggle into _laSel (defaults to ALL levels); leveled datasets ALSO get a
     "→" drill into a per-level multi-select. Every toggle's get() maps SymMix's
     {q,a,c} → the live-arena {q,opts,ans} shape. Tier-locked items render with
     the 🔒 (la-ds-locked) style and are non-selectable.                       */
  let _laCatalog = null;            // cached SymMix.catalog() (per picker session)

  // How many of a universal dataset's sources are currently in _laSel — used to
  // annotate the drill row ("2 / 9 επίπεδα"). Counts both per-level leaves
  // (key "umlv:<ds>:<lv>") and the whole-set toggle (key "um:<ds>").
  function _laUmSelCount(dsId) {
    return _laSel.filter(s =>
      s.key === 'um:' + dsId || s.key.indexOf('umlv:' + dsId + ':') === 0).length;
  }

  // SymMix {q:{gr,en}|str, a:[…], c:idx} → live-arena {q:<text>, opts:[…], ans:idx}.
  function _laMixToLive(arr) {
    return (Array.isArray(arr) ? arr : []).map(it => ({
      q:    (it.q && (it.q.gr || it.q.en)) || it.q || '',
      opts: it.a || [],
      ans:  (typeof it.c === 'number') ? it.c : 0,
    })).filter(x => x.q && x.opts && x.opts.length >= 2);
  }

  // Build a get() that hosts a universal dataset (optionally a level subset).
  function _laMixGet(id, levelIds) {
    return () => {
      if (!(window.SymMix && typeof SymMix.bankMulti === 'function')) return Promise.resolve([]);
      const ids = (levelIds && levelIds.length) ? levelIds : [];
      return SymMix.bankMulti([{ id, levelIds: ids }])
        .then(_laMixToLive).catch(() => []);
    };
  }

  // Merge Firestore published packs once, then re-render the universal list.
  function _laRefreshUniversal() {
    const apply = () => {
      _laCatalog = (window.SymMix && typeof SymMix.catalog === 'function') ? SymMix.catalog() : [];
      if (_laNav.level === 'universal') _laNavRender();
    };
    apply(); // paint immediately from the synchronous catalog
    if (window.GP_CONTENT && typeof GP_CONTENT.loadCloud === 'function') {
      Promise.resolve(GP_CONTENT.loadCloud()).then(apply).catch(() => {});
    }
  }

  function _laNavRenderUniversal(list) {
    const cat = _laCatalog
      || (window.SymMix && typeof SymMix.catalog === 'function' ? SymMix.catalog() : []);
    _laCatalog = cat;
    if (!cat.length) {
      list.innerHTML = `<p class="la-ds-empty" style="color:#C9A44A">⏳ ${t('Φόρτωση ύλης…', 'Loading content…')}</p>`;
      return;
    }
    let shown = 0;
    cat.forEach(group => {
      const items = group.items || [];
      if (!items.length) return;
      // Category header (same inline style as the grammar/level groupings)
      const hdr = document.createElement('div');
      hdr.style.cssText = 'padding:8px 14px 4px;font:700 10px/1 Inter,sans-serif;letter-spacing:1px;color:#8A7258;text-transform:uppercase;';
      hdr.textContent = group.group || '';
      list.appendChild(hdr);

      items.forEach(it => {
        shown++;
        const meta = it.meta || (it.leveled && it.levels
          ? `${it.levels.length} ${t('επίπεδα', 'levels')}` : '');
        if (it.leveled && it.levels && it.levels.length && !it.locked) {
          // Leveled + accessible: drill into a per-level multi-select. (The
          // whole set, all levels, is still reachable via "Όλα" inside the drill.)
          const picked = _laUmSelCount(it.id);
          const sub = picked
            ? `${t('✓ Επιλεγμένα', '✓ Selected')}: ${picked}`
            : meta;
          list.appendChild(_laItem(it.icon || '◆', it.label, sub, false, () => {
            _laNav = { level: 'umlevels', sectionKey: null, gradeKey: null,
                       dsId: it.id, dsLabel: it.label };
            _laNavRender();
          }));
        } else {
          // Non-leveled (or locked): a single toggle hosting ALL levels.
          list.appendChild(_laToggleItem(
            it.icon || '◆', it.label + (it.isNew ? ' •' : ''), meta, !!it.locked,
            { key: 'um:' + it.id, label: it.label, get: _laMixGet(it.id) }
          ));
        }
      });
    });
    if (!shown) list.innerHTML = `<p class="la-ds-empty">${t('Δεν βρέθηκε ύλη.', 'No content found.')}</p>`;
  }

  // Per-level multi-select for a universal leveled dataset. Each level toggles
  // an individual {q,opts,ans} bank into _laSel (key includes the level id), and
  // there is an "Όλα" leaf that hosts the whole set (all levels) in one toggle.
  function _laNavRenderUniversalLevels(list, dsId) {
    const cat = _laCatalog || [];
    let item = null;
    cat.some(g => (g.items || []).some(i => { if (i.id === dsId) { item = i; return true; } return false; }));
    if (!item || !item.levels || !item.levels.length) {
      list.innerHTML = `<p class="la-ds-empty">${t('Δεν βρέθηκαν επίπεδα.', 'No levels found.')}</p>`;
      return;
    }

    // "Όλα τα επίπεδα" — host the whole dataset (every level) as one source.
    list.appendChild(_laToggleItem(
      '📚', t('Όλα τα επίπεδα', 'All levels'),
      `${item.levels.length} ${t('επίπεδα', 'levels')}`, false,
      { key: 'um:' + dsId, label: item.label, get: _laMixGet(dsId) }
    ));

    const div = document.createElement('div');
    div.style.cssText = 'border-top:1px solid rgba(200,160,48,.18);margin:10px 0 6px';
    list.appendChild(div);

    // Group levels like the game panel (lv.group), then a leaf per level.
    const order = [], byGroup = {};
    item.levels.forEach(lv => {
      const g = lv.group || t('Επίπεδα', 'Levels');
      if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
      byGroup[g].push(lv);
    });
    let n = 0;
    order.forEach(g => {
      const hdr = document.createElement('div');
      hdr.style.cssText = 'padding:8px 14px 4px;font:700 10px/1 Inter,sans-serif;letter-spacing:1px;color:#8A7258;text-transform:uppercase;';
      hdr.textContent = g;
      list.appendChild(hdr);
      byGroup[g].forEach(lv => {
        n++;
        const label = lv.desc || (t('Επίπεδο', 'Level') + ' ' + n);
        list.appendChild(_laToggleItem(
          '📕', label, '', false,
          { key: 'umlv:' + dsId + ':' + lv.id,
            label: item.label + ' · ' + (lv.desc || ('#' + lv.id)),
            get: _laMixGet(dsId, [lv.id]) }
        ));
      });
    });
  }

  function _laNavRenderSection(list, sectionKey) {
    const sec = _LA_SECTIONS.find(s => s.key === sectionKey);
    if (!sec) return;

    // Grammatiki → show grammar datasets grouped by category directly
    if (sectionKey === 'grammatiki') {
      _laNavRenderGrammarDatasets(list);
      return;
    }

    let any = false;
    sec.grades.forEach(gradeKey => {
      const g = _laGrade(gradeKey);
      if (!g) return;
      any = true;
      const title  = t(g.title, g.titleEn);
      const sub    = `${g.subjects.length} ${t('μαθήματα', 'subjects')}`;
      const tier   = (typeof _siteAccess !== 'undefined') ? (_siteAccess[gradeKey] || 'student') : 'student';
      const locked = !_laCanAccess(tier);
      list.appendChild(_laItem(
        '📚', title, locked ? t('Απαιτεί αναβάθμιση', 'Requires upgrade') : sub,
        locked,
        () => { _laNav = { level: 'grade', sectionKey, gradeKey }; _laNavRender(); }
      ));
    });
    if (!any) list.innerHTML = `<p class="la-ds-empty">${t('Δεν φορτώθηκε η ύλη.', 'Curriculum not loaded.')}</p>`;
  }

  function _laNavRenderGrade(list, gradeKey) {
    const g = _laGrade(gradeKey);
    if (!g) { list.innerHTML = `<p class="la-ds-empty">${t('Δεν φορτώθηκε η ύλη.', 'Curriculum not loaded.')}</p>`; return; }

    g.subjects.forEach(subj => {
      const subTitle = t(subj.gr, subj.en || subj.gr);
      const summary  = subj.summary ? t(subj.summary.gr || '', subj.summary.en || subj.summary.gr || '') : '';
      list.appendChild(_laItem(
        subj.illu ? '📚' : (subj.icon || '📚'), subTitle,
        summary ? summary.slice(0, 60) + (summary.length > 60 ? '…' : '') : '',
        false,
        () => _laLoadSubjectQuestions(gradeKey, subj)
      ));
    });
  }

  // List every hostable question source for a subject as toggle leaves (pick
  // several here and/or across subjects, then "Combine & Start"). Sources, in
  // priority order: (1) admin-authored Site-Studio template content for this
  // subject's games — the "files from the admin panel template" the teacher
  // wants; (2) grammar/vocabulary GP_DATASETS; (3) a built-in trivia set keyed
  // by subject id. Maps every authored question to the LA shape {q,opts,ans}.
  async function _laLoadSubjectQuestions(gradeKey, subj) {
    const list = document.getElementById('la-dataset-list');
    if (list) list.innerHTML = `<p class="la-ds-empty" style="color:#C9A44A">⏳ ${t('Φόρτωση…','Loading…')}</p>`;
    let added = 0;
    const clear = () => { if (list && added === 0) list.innerHTML = ''; };

    // ── 1. Admin-authored template content (trivia/quiz authored in Site Studio) ──
    try {
      if (window.ContentSource && typeof ContentSource.loadCatalog === 'function') {
        const cat   = await ContentSource.loadCatalog();
        const gNode = ((cat && cat.grades) || []).find(x => x.key === gradeKey);
        const sNode = gNode && (gNode.subjects || []).find(x => x.id === subj.id);
        const cGames = (sNode && sNode.games || []).filter(gm => gm && gm.content);
        for (const gm of cGames) {
          let authored = false;
          try { authored = await ContentSource.hasAuthored(gm.content); } catch (_) {}
          if (!authored) continue;
          clear();
          const label = (gm.label && typeof gm.label === 'object')
            ? t(gm.label.gr || gm.label, gm.label.en || gm.label)
            : (gm.label || gm.type || 'Quiz');
          list.appendChild(_laToggleItem(
            gm.ic || '📝', label, t('Πρότυπο καθηγητή', 'Teacher template'),
            false,
            { key: 'authored:' + gm.content, label, get: async () => {
              const doc = await ContentSource.loadGameContent(gm.content);
              const u = doc || {};
              return (u.questions || u.items || []).map(q => {
                const opts = q.opts || q.o || q.a || [];
                return { q: q.q, opts: (opts.slice ? opts.slice() : opts),
                         ans: (typeof q.ans === 'number' ? q.ans : (typeof q.c === 'number' ? q.c : 0)) };
              }).filter(x => x.q && x.opts && x.opts.length >= 2);
            } }
          ));
          added++;
        }
      }
    } catch (e) { try { console.warn('[la] authored content load failed', e); } catch (_) {} }

    // ── 2. Grammar / vocabulary datasets (GP_DATASETS) ──
    const gpDs = (typeof GP_DATASETS !== 'undefined')
      ? GP_DATASETS.filter(d => d.subject === subj.id || d.classKey === gradeKey)
      : [];
    if (gpDs.length > 0) {
      clear();
      gpDs.forEach(ds => {
        const tier   = ds.tier || 'free';
        const locked = !_laCanAccess(tier);
        // Whole-dataset toggle, hosted via the game's own loader (lazy-loaded);
        // per-level drill lives in the Γραμματική section (_laNavRenderGpLevels).
        list.appendChild(_laToggleItem(
          '📚', ds.label, ds.meta || '',
          locked,
          { key: 'gp:' + ds.id, label: ds.label, get: () => _laLoadDsQuestions(ds) }
        ));
        added++;
      });
    }

    // ── 3. Built-in trivia dataset matched by subject id ──
    const builtIn = (typeof _DATASETS !== 'undefined')
      ? _DATASETS.find(d => d.id === subj.id || d.id === subj.id + '-trivia')
      : null;
    if (builtIn) {
      const qs = builtIn.getQuestions();
      if (qs && qs.length) {
        clear();
        const blabel = typeof builtIn.label === 'object' ? t(builtIn.label.gr, builtIn.label.en) : builtIn.label;
        list.appendChild(_laToggleItem(
          builtIn.icon, blabel, `${qs.length} ${t('ερωτήσεις', 'questions')}`,
          false,
          { key: 'ds:' + builtIn.id, label: blabel, get: () => builtIn.getQuestions() }
        ));
        added++;
      }
    }

    // ── Nothing hostable for this subject ──
    if (added === 0 && list) {
      const canUpload = (typeof isAdmin !== 'undefined' && isAdmin)
        || (Array.isArray(window.teacherFeatures) && window.teacherFeatures.includes('custom_quiz'));
      list.innerHTML =
        `<p class="la-ds-empty">${t('Δεν υπάρχει ακόμη ύλη από τα Πρότυπα για αυτό το μάθημα.', 'No template content yet for this subject.')}</p>` +
        (canUpload
          ? `<p class="la-ds-empty" style="color:#C9A44A">${t('Δημιούργησέ την: Διαχείριση → Πρότυπα.', 'Create it: Admin → Templates.')}</p>`
          : '');
    }
    _laUpdateCombineBtn();
  }

  function _laNavRenderGrammarDatasets(list) {
    if (typeof GP_DATASETS === 'undefined') {
      list.innerHTML = `<p class="la-ds-empty">${t('Δεν φορτώθηκαν τα δεδομένα.', 'Data not loaded.')}</p>`;
      return;
    }

    // Group by category
    const grouped = {};
    GP_DATASETS.forEach(ds => {
      const cat = ds.category || t('Άλλα', 'Other');
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(ds);
    });

    Object.entries(grouped).forEach(([cat, datasets]) => {
      // Category header
      const hdr = document.createElement('div');
      hdr.style.cssText = 'padding:8px 14px 4px;font:700 10px/1 Inter,sans-serif;letter-spacing:1px;color:#8A7258;text-transform:uppercase;';
      hdr.textContent = cat;
      list.appendChild(hdr);

      datasets.forEach(ds => {
        const tier   = ds.tier || 'free';
        const locked = !_laCanAccess(tier);
        const prov   = (typeof GP_LEVEL_PROVIDERS !== 'undefined') ? GP_LEVEL_PROVIDERS[ds.id] : null;
        // Only offer the per-level drill for games whose headless generator
        // actually produces hostable MC questions. The rest (their generators
        // aren't ported yet) stay a single toggle so we never show a level
        // picker that would host nothing. See _LA_GEN_OK.
        const leveled = !!(ds.leveled && prov && prov.levels && prov.levels.length && _LA_GEN_OK.indexOf(ds.id) >= 0);
        if (leveled && !locked) {
          // Like the game panel: drill into this game's levels, multi-select
          // some, then "Combine & Start" hosts exactly those levels' questions.
          list.appendChild(_laItem('📚', ds.label, ds.meta || '', false, () => {
            _laNav = { level: 'gplevels', sectionKey: 'grammatiki', gradeKey: null,
                       dsId: ds.id, fn: _laFnForDs(ds.id), dsLabel: ds.label };
            _laNavRender();
          }));
        } else {
          // Non-leveled (or locked): one toggle hosting the whole set via its
          // own loader (the game's data is lazy-loaded first).
          list.appendChild(_laToggleItem(
            '📚', ds.label, ds.meta || '', locked,
            { key: 'gp:' + ds.id, label: ds.label, get: () => _laLoadDsQuestions(ds) }
          ));
        }
      });
    });
  }

  // GP_DATASETS id → its launch openFn (inverting SYM.LEVEL_BANK), so we can
  // lazy-load the game's JS (which defines its question generator) before
  // calling the dataset loader.
  function _laFnForDs(dsId) {
    const LB = (window.SYM && SYM.LEVEL_BANK) || {};
    for (const fn in LB) { if (LB[fn] && LB[fn].ds === dsId) return fn; }
    return null;
  }
  async function _laEnsureGameLoaded(fn) {
    if (!fn || !window.SYN_GAMES || !window.SYN_GAMES[fn] || !window.lazyLoad) return;
    try { await window.lazyLoad(window.SYN_GAMES[fn].js || []); } catch (_) {}
  }
  // Normalise any loader output to the arena's {q,opts,ans} (handles both the
  // {q,opts,ans} and the games' raw {qt,opts,correct} shapes; strips markup).
  function _laNormalizeQs(qs) {
    return (Array.isArray(qs) ? qs : []).map(x => {
      const opts = x.opts || x.o || x.a || [];
      let ans = (typeof x.ans === 'number') ? x.ans
              : (typeof x.c === 'number') ? x.c
              : (x.correct != null ? opts.indexOf(x.correct) : 0);
      const qtext = String(x.q || x.qt || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      return { q: qtext, opts: (opts.slice ? opts.slice() : opts), ans };
    }).filter(x => x.q && x.opts && x.opts.length >= 2 && x.ans >= 0 && x.ans < x.opts.length);
  }
  // Load a grammar dataset's questions (optionally a single level) via its own
  // loader, lazy-loading the backing game first. Falls back to [] gracefully
  // (e.g. games whose generator isn't ported yet).
  async function _laLoadDsQuestions(ds, levelId) {
    if (!ds) return [];
    await _laEnsureGameLoaded(_laFnForDs(ds.id));
    let qs = [];
    try { qs = await Promise.resolve(typeof ds.loader === 'function' ? ds.loader(levelId) : []); } catch (_) {}
    return _laNormalizeQs(qs);
  }

  // Level picker for a leveled grammar game — grouped like the game panel; each
  // level is a multi-select leaf that hosts that level's generated questions.
  function _laNavRenderGpLevels(list, dsId) {
    const prov = (typeof GP_LEVEL_PROVIDERS !== 'undefined') ? GP_LEVEL_PROVIDERS[dsId] : null;
    const ds   = (typeof GP_DATASETS !== 'undefined') ? GP_DATASETS.find(d => d.id === dsId) : null;
    if (!prov || !prov.levels || !prov.levels.length || !ds) {
      list.innerHTML = `<p class="la-ds-empty">${t('Δεν βρέθηκαν επίπεδα.', 'No levels found.')}</p>`;
      return;
    }
    const order = [], byGroup = {};
    prov.levels.forEach(lv => {
      const g = lv.group || t('Επίπεδα', 'Levels');
      if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
      byGroup[g].push(lv);
    });
    order.forEach(g => {
      const hdr = document.createElement('div');
      hdr.style.cssText = 'padding:8px 14px 4px;font:700 10px/1 Inter,sans-serif;letter-spacing:1px;color:#8A7258;text-transform:uppercase;';
      hdr.textContent = g;
      list.appendChild(hdr);
      byGroup[g].forEach((lv, i) => {
        const label = lv.desc || (t('Επίπεδο', 'Level') + ' ' + (i + 1));
        list.appendChild(_laToggleItem(
          '📕', label, '',
          false,
          { key: 'gplv:' + dsId + ':' + lv.id,
            label: ds.label + ' · ' + (lv.desc || ('#' + lv.id)),
            get: () => _laLoadDsQuestions(ds, lv.id) }
        ));
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     PARTICLE ENGINE (correct answer celebration)
  ════════════════════════════════════════════════════════ */

  function _launchParticles(canvasId) {
    const canvas = document.getElementById(canvasId || 'la-particles');
    if (!canvas) return;

    canvas.width  = canvas.offsetWidth  || 360;
    canvas.height = canvas.offsetHeight || 640;
    const ctx = canvas.getContext('2d');

    if (canvas._raf) { cancelAnimationFrame(canvas._raf); canvas._raf = null; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const PALETTE = ['#c9a44a', '#e8c87a', '#fff0a0', '#a07c2a', '#f0d898', '#ffe480'];
    const cx = canvas.width  / 2;
    const cy = canvas.height * 0.38;
    const N  = 90;

    const pts = Array.from({ length: N }, () => ({
      x:     cx,
      y:     cy,
      vx:    (Math.random() - 0.5) * 18,
      vy:    (Math.random() - 1.8) * 14,
      r:     2.5 + Math.random() * 4.5,
      alpha: 1,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let live = false;
      pts.forEach(p => {
        p.vy    += 0.42;
        p.vx    *= 0.99;
        p.x     += p.vx;
        p.y     += p.vy;
        p.alpha -= 0.016;
        if (p.alpha > 0) {
          live = true;
          ctx.globalAlpha = Math.max(0, p.alpha);
          ctx.fillStyle   = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1;
      if (live) canvas._raf = requestAnimationFrame(draw);
    };
    canvas._raf = requestAnimationFrame(draw);
  }

  /* ════════════════════════════════════════════════════════
     UTILITIES
  ════════════════════════════════════════════════════════ */

  function _genPin() {
    return String(Math.floor(100000 + Math.random() * 900000));
  }

  function _showOverlay() {
    const ov = document.getElementById('la-overlay');
    if (ov) ov.style.display = 'flex';
  }

  function _showScreen(id) {
    document.querySelectorAll('#la-wrap .la-screen').forEach(s => s.classList.remove('la-active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('la-active');

    // "While you wait" Flappy mini-game: one shared instance that follows the
    // active waiting screen, and stops everywhere else.
    if (window.SymFlappy) {
      if (id === 'la-host-lobby') {
        SymFlappy.mount(document.getElementById('la-flappy-host'));
      } else if (id === 'la-student-lobby') {
        SymFlappy.mount(document.getElementById('la-flappy-student'));
      } else {
        SymFlappy.unmount();
      }
    }
  }

  function _setEl(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  }

  function _joinError(msg) {
    const el = document.getElementById('la-join-error');
    if (el) el.textContent = msg;
  }

  function _resetJoinBtn() {
    const btn = document.getElementById('la-join-btn');
    if (btn) { btn.disabled = false; btn.textContent = t('Είσοδος →', 'Join →'); }
  }

  // Minimal HTML escape to prevent XSS from dataset content
  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Host-lobby player chips (avatar + name + kick) ──────────
     The roster chips used to be plain name text. The redesign shows a
     colour-hashed avatar with initials, the name, and a hover kick ✕,
     plus an empty state while nobody has joined. Pure presentation —
     fed by the same Firestore players listener. */
  const _LA_AV_COLORS = ['#c9a44a','#8eba72','#cd8b5a','#7fa9c4','#c47fa9','#b0a04a','#6fae8e','#cf9b6b'];

  // Leveled grammar datasets whose headless question generator is implemented
  // (verified to produce hostable MC questions for the Live Arena). These get
  // the game-panel-style per-level drill in the host picker. The remaining
  // leveled games (aoristos-b, synirimmena, afwnolekta, antonymies, rimata-mi)
  // still need their gen ported, so they stay a single whole-set toggle.
  const _LA_GEN_OK = ['lyo', 'ousiastika', 'lat-nouns', 'lat-epitheta'];
  function _laInitials(name) {
    const p = String(name || '').trim().split(/\s+/);
    return (((p[0] || '')[0] || '') + (p.length > 1 ? (p[1][0] || '') : '')).toUpperCase() || '•';
  }
  function _laColorFor(name) {
    let h = 0; const s = String(name || '');
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    return _LA_AV_COLORS[h % _LA_AV_COLORS.length];
  }
  // Show the "players will appear here" empty state when the roster is empty,
  // and swap the grid out of the layout so the message can center.
  function _laUpdatePlayersEmpty() {
    const grid  = document.getElementById('la-player-grid');
    const empty = document.getElementById('la-players-empty');
    if (!grid) return;
    const has = grid.children.length > 0;
    grid.style.display = has ? 'grid' : 'none';
    if (empty) empty.style.display = has ? 'none' : 'flex';
  }
  // Host removes a waiting player: drop the Firestore doc (the lobby listener
  // reconciles the grid) and animate the chip out immediately for snappiness.
  function _kickPlayer(uid, chip) {
    if (!uid) return;
    if (chip) { chip.style.opacity = '0'; chip.style.transform = 'scale(.8)'; }
    try { playerRef(_pin, uid).delete().catch(() => {}); } catch (_) {}
    setTimeout(() => { if (chip && chip.parentNode) chip.remove(); _laUpdatePlayersEmpty(); }, 220);
  }

  // Paint the mode header (modebar) + footer config summary from _cfg.
  // Pure presentation; reads _cfg.config + the chosen mode (window.PVP_MODES).
  function _paintLobbyConfig() {
    const cfg  = (_cfg && _cfg.config) || {};
    const mode = ((window.PVP_MODES || []).filter(m => m.id === _cfg.mode)[0]) || null;
    const qd   = _qDur();

    // win-condition readout (label + headline value), shared by modebar + footer.
    let winTop, winVal;
    if (cfg.winBy === 'score')       { winTop = t('ΣΚΟΡ-ΣΤΟΧΟΣ', 'TARGET SCORE'); winVal = String(cfg.targetScore || 1000); }
    else if (cfg.winBy === 'rounds') { winTop = t('ΓΥΡΟΙ', 'ROUNDS');            winVal = String(cfg.rounds || _cfg.questions.length); }
    else                             { winTop = t('ΣΤΑΘΕΡΟΣ ΧΡΟΝΟΣ', 'FIXED TIME'); winVal = (cfg.gameDurationMin || 8) + '′'; }

    // ── modebar ──
    const bar = document.getElementById('la-modebar');
    if (bar) bar.style.setProperty('--accent', (mode && mode.accent) || 'var(--la-gold)');
    _setEl('la-mb-glyph',  (mode && mode.glyph) || 'Λ');
    _setEl('la-mb-kicker', t('ΖΩΝΤΑΝΗ ΜΑΧΗ', 'LIVE MATCH'));
    _setEl('la-mb-title',  (mode && mode.gr) || _cfg.gameName || t('ΖΩΝΤΑΝΗ ΜΑΧΗ', 'LIVE MATCH'));
    _setEl('la-mb-sub',    (mode && mode.en) || '');
    const fmt = document.getElementById('la-mb-fmt');
    if (fmt) fmt.innerHTML = `${_esc(winTop)}<br><b>${_esc(winVal)}</b> · ${qd}${t('ς/ερώτηση', 's/q')}`;

    // ── footer summary ──
    _setEl('la-cfg-mode',  (mode && mode.gr) || _cfg.gameName || '—');
    _setEl('la-cfg-qtime', qd + 'ς / ' + t('ερώτηση', 'question'));
    _setEl('la-cfg-win',   winTop + ' ' + winVal);
  }

  function _stopTimer() {
    if (_timerInt) { clearInterval(_timerInt); _timerInt = null; }
  }

  function _detachAll() {
    _listeners.forEach(fn => { try { fn(); } catch (_) {} });
    _listeners = [];
    if (_ansUnsub) { try { _ansUnsub(); } catch (_) {} _ansUnsub = null; }
    if (_duelOppUnsub) { try { _duelOppUnsub(); } catch (_) {} _duelOppUnsub = null; }
    _stopTimer();
    _stopMatchClock();
    ['la-particles', 'la-duel-particles'].forEach(id => {
      const canvas = document.getElementById(id);
      if (canvas && canvas._raf) { cancelAnimationFrame(canvas._raf); canvas._raf = null; }
    });
  }

  function _reset() {
    _detachAll();
    _mode         = null;
    _pin          = null;
    _cfg          = {};
    _arenaState   = {};
    _qIdx         = 0;
    _answered     = false;
    _uid          = null;
    _totalPlayers = 0;
    _laSel        = [];
    _isDuel       = false;
    _duelSeat     = null;
    _duelState    = {};
    _duelStarted  = false;
    _duelScore    = 0;
    _duelStreak   = 0;
    _duelDone     = false;
    _duelMode     = null;
  }

  /* ════════════════════════════════════════════════════════
     DUEL FLOW — Friendly Battle · 1v1 (duels/{pin})
     A 2-seat real-time room. Both players answer the SAME shared bank at
     their own pace; head-to-head by rounds (best-of-N) or target score.
  ════════════════════════════════════════════════════════ */

  // Resolve the current user's uid + display name (mirrors submitJoin).
  function _duelIdentity() {
    const u = (typeof currentUser !== 'undefined' && currentUser) ? currentUser : null;
    return {
      uid:  u ? u.uid : ('anon_' + Math.random().toString(36).slice(2, 9)),
      name: u ? (u.displayName || u.email || t('Παίκτης', 'Player')) : t('Παίκτης', 'Player'),
    };
  }

  function _duelModeFor(id) {
    return ((window.PVP_DUEL_MODES || []).filter(m => m.id === id)[0]) || null;
  }

  // Host: mint a duel room and wait for one friend to join.
  function launchDuelHost(cfg = {}) {
    if (typeof currentUser === 'undefined' || !currentUser) {
      if (typeof showToast === 'function') showToast('Απαιτείται σύνδεση', 'Login required');
      if (typeof openAuthModal === 'function') openAuthModal('login');
      return;
    }
    _reset();
    _mode      = 'host';
    _isDuel    = true;
    _duelSeat  = 'host';
    _cfg       = { questions: [], gameName: 'Μονομαχία', ...cfg };
    _duelMode  = _duelModeFor(_cfg.mode);
    _showOverlay();
    _showScreen('la-duel-lobby');
    _createDuel();
  }

  async function _createDuel() {
    _pin = _genPin();
    const id = _duelIdentity();
    _uid = id.uid;
    const accent = (_duelMode && _duelMode.accent) || 'var(--la-gold)';
    const glyph  = (_duelMode && _duelMode.glyph)  || '⚔';

    // Paint the lobby chrome (PIN, mode header, my seat, invite hints).
    _setEl('la-duel-pin-display', _pin);
    _setEl('la-duel-game-title',  _cfg.gameName);
    _setEl('la-duel-mb-glyph',    glyph);
    _setEl('la-duel-mb-title',    (_duelMode && _duelMode.gr) || _cfg.gameName);
    _setEl('la-duel-mb-sub',      (_duelMode && _duelMode.en) || '');
    const bar = document.getElementById('la-duel-modebar');
    if (bar) bar.style.setProperty('--accent', accent);
    _paintDuelWinReadout();
    _renderDuelSeats(id.name, null);
    _duelSetStartGate(false);

    try {
      await duelRef(_pin).set({
        status:    'lobby',
        hostUid:   id.uid,
        guestUid:  null,
        mode:      _cfg.mode || 'pankration',
        gameName:  _cfg.gameName,
        bank:      (_cfg.questions || []).map(q => ({ q: q.q, opts: q.opts, ans: q.ans })),
        config:    _cfg.config || {},
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      await duelPlayerRef(_pin, id.uid).set({
        name: id.name, uid: id.uid, seat: 'host',
        score: 0, streak: 0, qIdx: 0, done: false,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      _listenDuelRoom();      // host listens for guest + status flips
    } catch (err) {
      console.error('[LiveArena] duel create:', err);
      if (typeof showToast === 'function') showToast('Σφάλμα δημιουργίας', 'Failed to create duel');
    }
  }

  // Friend: join an existing duel as the guest (2nd seat).
  async function joinDuel(pin) {
    pin = String(pin || '').replace(/\D/g, '').slice(0, 6);
    if (!/^\d{6}$/.test(pin)) return;
    if (typeof currentUser === 'undefined' || !currentUser) {
      if (typeof showToast === 'function') showToast('Απαιτείται σύνδεση για συμμετοχή', 'Login required to join');
      if (typeof openAuthModal === 'function') openAuthModal('login');
      return;
    }
    _reset();
    _mode     = 'student';
    _isDuel   = true;
    _duelSeat = 'guest';
    _showOverlay();
    _showScreen('la-duel-lobby');

    try {
      const snap = await duelRef(pin).get();
      if (!snap.exists) { if (typeof showToast === 'function') showToast('Η μονομαχία δεν βρέθηκε', 'Duel not found'); close(); return; }
      const data = snap.data();
      if (data.status === 'closed')      { if (typeof showToast === 'function') showToast('Η μονομαχία έκλεισε', 'This duel has ended'); close(); return; }
      if (data.guestUid && data.guestUid !== (currentUser && currentUser.uid)) {
        if (typeof showToast === 'function') showToast('Η μονομαχία είναι γεμάτη', 'This duel is full'); close(); return;
      }

      _pin       = pin;
      _duelState = data;
      _cfg       = {
        questions: data.bank || [],
        gameName:  data.gameName || 'Μονομαχία',
        mode:      data.mode,
        config:    data.config || {},
      };
      _duelMode  = _duelModeFor(data.mode);
      const id   = _duelIdentity();
      _uid = id.uid;

      // Paint lobby chrome from the room doc.
      _setEl('la-duel-pin-display', _pin);
      _setEl('la-duel-game-title',  _cfg.gameName);
      _setEl('la-duel-mb-glyph',    (_duelMode && _duelMode.glyph) || '⚔');
      _setEl('la-duel-mb-title',    (_duelMode && _duelMode.gr) || _cfg.gameName);
      _setEl('la-duel-mb-sub',      (_duelMode && _duelMode.en) || '');
      const bar = document.getElementById('la-duel-modebar');
      if (bar) bar.style.setProperty('--accent', (_duelMode && _duelMode.accent) || 'var(--la-gold)');
      _paintDuelWinReadout();
      _duelSetStartGate(false); // guest never starts; host does

      await duelRef(pin).update({ guestUid: id.uid });
      await duelPlayerRef(pin, id.uid).set({
        name: id.name, uid: id.uid, seat: 'guest',
        score: 0, streak: 0, qIdx: 0, done: false,
        joinedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
      _listenDuelRoom();
    } catch (err) {
      console.error('[LiveArena] duel join:', err);
      if (typeof showToast === 'function') showToast('Σφάλμα σύνδεσης', 'Connection error');
      close();
    }
  }

  // Both seats listen to the room doc + the two player docs. The room doc
  // drives lobby→active→closed; the player docs drive the live 2-seat score bar.
  function _listenDuelRoom() {
    const roomUnsub = duelRef(_pin).onSnapshot(snap => {
      if (!snap.exists) return;
      const data = snap.data();
      _duelState = data;
      if (data.status === 'active' && !_duelStarted) { _startDuel(); }
      else if (data.status === 'closed') { /* handled by _showDuelResult when both done */ }
    }, err => console.error('[LiveArena] duel room:', err));
    _listeners.push(roomUnsub);

    // Player roster: repaint the 2 seats (names) + live scores + enable Start
    // once both seats are filled (host only).
    const rosterUnsub = duelPlayersCol(_pin).onSnapshot(snap => {
      let me = null, opp = null;
      snap.forEach(d => {
        const p = d.data();
        if (p.uid === _uid) me = p; else opp = p;
      });
      _renderDuelSeats(me ? me.name : null, opp ? opp.name : null, me, opp);
      if (_duelSeat === 'host') _duelSetStartGate(!!opp);
    }, err => console.error('[LiveArena] duel roster:', err));
    _listeners.push(rosterUnsub);
  }

  // Host presses "Έναρξη" → flip room status to active (both clients start).
  async function startDuel() {
    if (_duelSeat !== 'host' || !_pin) return;
    if (!(_duelState && _duelState.guestUid)) return; // need a friend first
    const btn = document.getElementById('la-duel-start-btn');
    if (btn) { btn.disabled = true; btn.textContent = t('Εκκίνηση…', 'Starting…'); }
    try { await duelRef(_pin).update({ status: 'active', startedAt: firebase.firestore.FieldValue.serverTimestamp() }); }
    catch (err) { console.error('[LiveArena] duel start:', err); }
  }

  function _startDuel() {
    if (_duelStarted) return;
    _duelStarted = true;
    _duelScore = 0; _duelStreak = 0; _duelDone = false; _qIdx = 0;
    // Live-score listener on the sibling player doc.
    _duelListenOpponent();
    _showDuelQuestion(0);
  }

  function _duelListenOpponent() {
    if (_duelOppUnsub) { try { _duelOppUnsub(); } catch (_) {} _duelOppUnsub = null; }
    _duelOppUnsub = duelPlayersCol(_pin).onSnapshot(snap => {
      let me = null, opp = null;
      snap.forEach(d => { const p = d.data(); if (p.uid === _uid) me = p; else opp = p; });
      _paintDuelScoreBar(me, opp);
      // End when both players are done (or the win condition already tripped).
      if (me && opp && me.done && opp.done) _showDuelResult(me, opp);
    }, err => console.error('[LiveArena] duel opp:', err));
  }

  function _duelBankLen() {
    const cfg = (_cfg && _cfg.config) || {};
    const total = (_cfg.questions || []).length;
    if (cfg.winBy === 'rounds' && cfg.rounds) return Math.min(cfg.rounds, total);
    return total;
  }

  function _showDuelQuestion(idx) {
    const cfg = (_cfg && _cfg.config) || {};
    const total = _duelBankLen();
    // Win-by-score: if I already hit the target, I'm done.
    if (cfg.winBy === 'score' && cfg.targetScore && _duelScore >= cfg.targetScore) { _finishDuelSide(); return; }
    if (idx >= total) { _finishDuelSide(); return; }
    const q = _cfg.questions[idx];
    if (!q) { _finishDuelSide(); return; }
    _qIdx = idx;

    _showScreen('la-duel-match');
    const accent = (_duelMode && _duelMode.accent) || 'var(--la-gold)';
    const wrap = document.getElementById('la-duel-match');
    if (wrap) wrap.style.setProperty('--accent', accent);
    _setEl('la-duel-mq-glyph', (_duelMode && _duelMode.glyph) || '⚔');
    _setEl('la-duel-mq-qnum', t('Ερώτηση', 'Question') + ' ' + (idx + 1) + ' / ' + total);
    _setEl('la-duel-mq-text', q.q);
    _setEl('la-duel-mq-fb', '');
    const fb = document.getElementById('la-duel-mq-fb');
    if (fb) fb.className = 'la-duel-fb';

    const grid = document.getElementById('la-duel-mq-opts');
    if (grid) {
      grid.innerHTML = '';
      const LABELS = ['A', 'B', 'C', 'D'];
      const BG = ['#1e4d35', '#1a3a5c', '#5c2010', '#3a1a5c'];
      (q.opts || []).forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'la-duel-opt';
        btn.style.setProperty('--la-btn-bg', BG[i % 4]);
        btn.innerHTML =
          `<span class="la-duel-opt__ltr">${LABELS[i]}</span>` +
          `<span class="la-duel-opt__t">${_esc(opt)}</span>`;
        btn.addEventListener('click', () => _answerDuel(i, q, idx, btn));
        grid.appendChild(btn);
      });
    }
  }

  async function _answerDuel(choice, q, idx, btn) {
    const cfg = (_cfg && _cfg.config) || {};
    // lock the options
    const btns = document.querySelectorAll('#la-duel-mq-opts .la-duel-opt');
    btns.forEach(b => { b.disabled = true; });
    const correct = choice === q.ans;
    const fb = document.getElementById('la-duel-mq-fb');

    if (correct) {
      _duelStreak++;
      const gain = 100 * Math.min(_duelStreak, 5);
      _duelScore += gain;
      if (btn) btn.classList.add('la-duel-opt--right');
      if (fb) { fb.textContent = t('ΣΩΣΤΟ!', 'CORRECT!') + ' +' + gain + (_duelStreak > 1 ? '  ×' + Math.min(_duelStreak, 5) : ''); fb.className = 'la-duel-fb la-duel-fb--good'; }
      if (typeof awardGameRewards === 'function') awardGameRewards('live-arena', {});
      else if (typeof awardRewards === 'function') awardRewards(15, 1);
    } else {
      _duelStreak = 0;
      if (btn) btn.classList.add('la-duel-opt--wrong');
      if (btns[q.ans]) btns[q.ans].classList.add('la-duel-opt--right');
      if (fb) { fb.textContent = t('ΛΑΘΟΣ', 'WRONG'); fb.className = 'la-duel-fb la-duel-fb--bad'; }
      // Tartarus mistake capture.
      if (typeof window.symLogMistake === 'function') {
        try {
          const opts = q.opts || [];
          window.symLogMistake({
            q: q.q, wrong: opts[choice] || '', right: opts[q.ans] || '',
            cat: 'Live Arena', gameId: 'live-arena',
          });
        } catch (_) {}
      }
    }

    // Persist my running score/streak/qIdx so the opponent's client sees it live.
    try {
      await duelPlayerRef(_pin, _uid).update({ score: _duelScore, streak: _duelStreak, qIdx: idx + 1 });
    } catch (_) {}

    // Advance after a short beat. Win-by-score ends the moment the target is hit.
    setTimeout(() => {
      if (cfg.winBy === 'score' && cfg.targetScore && _duelScore >= cfg.targetScore) { _finishDuelSide(); return; }
      _showDuelQuestion(idx + 1);
    }, 850);
  }

  // I have finished my side (ran out of rounds, or hit the target score). Mark
  // done + wait for the opponent; when both are done the result screen shows.
  async function _finishDuelSide() {
    if (_duelDone) return;
    _duelDone = true;
    _showScreen('la-duel-wait');
    _setEl('la-duel-wait-msg', t('Ολοκλήρωσες! Αναμονή αντιπάλου…', 'You finished! Waiting for your rival…'));
    try { await duelPlayerRef(_pin, _uid).update({ done: true, score: _duelScore }); } catch (_) {}
  }

  // 2-seat score bar during the match (me vs opponent, live scores).
  function _paintDuelScoreBar(me, opp) {
    if (me)  { _setEl('la-duel-me-name', me.name || t('Εσύ', 'You')); _setEl('la-duel-me-score', me.score || 0); }
    if (opp) { _setEl('la-duel-opp-name', opp.name || t('Αντίπαλος', 'Rival')); _setEl('la-duel-opp-score', opp.score || 0); }
    const meAv = document.getElementById('la-duel-me-av');
    if (meAv && me) { meAv.textContent = _laInitials(me.name); meAv.style.background = _laColorFor(me.name); }
    const oppAv = document.getElementById('la-duel-opp-av');
    if (oppAv && opp) { oppAv.textContent = _laInitials(opp.name); oppAv.style.background = _laColorFor(opp.name); }
  }

  // Lobby seats (host + guest slot). Also seeds the match score-bar names.
  function _renderDuelSeats(meName, oppName, me, opp) {
    const wrap = document.getElementById('la-duel-seats');
    if (!wrap) return;
    const seat = (nm, roleGr, roleEn, waiting) => {
      const av = waiting ? '…' : _esc(_laInitials(nm));
      const bg = waiting ? 'rgba(255,255,255,.08)' : _laColorFor(nm);
      return `<div class="la-duel-seat${waiting ? ' la-duel-seat--wait' : ''}">` +
        `<span class="la-duel-seat__av" style="background:${bg}">${av}</span>` +
        `<span class="la-duel-seat__name">${waiting ? t('Αναμονή φίλου…', 'Waiting for a friend…') : _esc(nm)}</span>` +
        `<span class="la-duel-seat__role">${t(roleGr, roleEn)}</span>` +
      `</div>`;
    };
    const hostName  = _duelSeat === 'host'  ? meName : oppName;
    const guestName = _duelSeat === 'guest' ? meName : oppName;
    wrap.innerHTML =
      seat(hostName || t('Οικοδεσπότης', 'Host'), 'Οικοδεσπότης', 'Host', !hostName) +
      `<div class="la-duel-vs">VS</div>` +
      seat(guestName, 'Καλεσμένος', 'Guest', !guestName);
    _paintDuelScoreBar(me, opp); // keep the match bar names in sync if present
  }

  function _paintDuelWinReadout() {
    const cfg = (_cfg && _cfg.config) || {};
    let top, val;
    if (cfg.winBy === 'score') { top = t('ΣΚΟΡ-ΣΤΟΧΟΣ', 'TARGET SCORE'); val = String(cfg.targetScore || 1000); }
    else                       { top = t('ΓΥΡΟΙ', 'ROUNDS');           val = String(_duelBankLen()); }
    _setEl('la-duel-mb-fmt-top', top);
    _setEl('la-duel-mb-fmt-val', val);
  }

  // Enable / disable the host's Start button (needs a guest present).
  // The guest never starts: they see a passive hint instead of the button.
  function _duelSetStartGate(ready) {
    const btn  = document.getElementById('la-duel-start-btn');
    const hint = document.getElementById('la-duel-guest-hint');
    if (_duelSeat !== 'host') {
      if (btn)  btn.style.display  = 'none';
      if (hint) hint.style.display = '';   // guest: show "the host will start…"
      return;
    }
    if (hint) hint.style.display = 'none'; // host: hide the guest hint
    if (!btn) return;
    btn.style.display = '';
    btn.disabled = !ready;
    btn.textContent = ready
      ? t('🚀 Έναρξη Μονομαχίας', '🚀 Start Duel')
      : t('Αναμονή φίλου…', 'Waiting for a friend…');
  }

  async function _showDuelResult(me, opp) {
    // Show once (guard: both listeners could fire).
    if (document.getElementById('la-duel-result') && document.getElementById('la-duel-result').classList.contains('la-active')) return;
    _showScreen('la-duel-result');
    const myScore  = (me  && me.score)  || 0;
    const oppScore = (opp && opp.score) || 0;
    const iWon  = myScore > oppScore;
    const tie   = myScore === oppScore;

    const res = document.getElementById('la-duel-result');
    if (res) res.classList.remove('la-duel-win', 'la-duel-lose', 'la-duel-tie');
    if (res) res.classList.add(tie ? 'la-duel-tie' : (iWon ? 'la-duel-win' : 'la-duel-lose'));

    _setEl('la-duel-res-title', tie ? t('Ισοπαλία!', 'Draw!') : (iWon ? t('Νίκη!', 'Victory!') : t('Ήττα', 'Defeat')));
    _setEl('la-duel-res-icon',  tie ? '🤝' : (iWon ? '🏆' : '⚔'));
    _setEl('la-duel-res-me-name',  (me  && me.name)  || t('Εσύ', 'You'));
    _setEl('la-duel-res-me-score', myScore);
    _setEl('la-duel-res-opp-name', (opp && opp.name) || t('Αντίπαλος', 'Rival'));
    _setEl('la-duel-res-opp-score', oppScore);
    if (iWon && !tie) { try { _launchParticles('la-duel-particles'); } catch (_) {} }

    // Host tidies the room.
    if (_duelSeat === 'host') { try { await duelRef(_pin).update({ status: 'closed' }); } catch (_) {} }
  }

  /* ── INVITE HELPERS ──────────────────────────────────── */

  function _getJoinUrl(pin) {
    // In a duel, carry &duel=1 so the friend's client routes into the 2-seat
    // duel-join flow (_checkUrlJoin) instead of the class-broadcast student join.
    return `${location.origin}/?join=${pin}` + (_isDuel ? '&duel=1' : '');
  }

  function copyInviteLink() {
    if (!_pin) return;
    const url = _getJoinUrl(_pin);
    navigator.clipboard?.writeText(url).then(() => {
      if (typeof showToast === 'function') showToast('Σύνδεσμος αντιγράφηκε!', 'Link copied!');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = url; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); if (typeof showToast === 'function') showToast('Σύνδεσμος αντιγράφηκε!', 'Link copied!'); }
      catch (_) {}
      document.body.removeChild(ta);
    });
  }

  function copyPIN() {
    if (!_pin) return;
    navigator.clipboard?.writeText(_pin).then(() => {
      if (typeof showToast === 'function') showToast('PIN αντιγράφηκε!', 'PIN copied!');
    }).catch(() => {
      if (typeof showToast === 'function') showToast('PIN: ' + _pin, 'PIN: ' + _pin);
    });
  }

  function showInviteQR() {
    if (!_pin) return;
    const name = _cfg.gameName || 'Live Arena';
    if (typeof showQR === 'function') {
      // In a duel, pass a pre-built { url } (carries &duel=1); otherwise the
      // { join } shape lets showQR build the class-join URL.
      showQR(name, _isDuel ? { url: _getJoinUrl(_pin) } : { join: _pin }, _pin);
    } else {
      copyInviteLink();
    }
  }

  // Auto-join: if page loaded with ?join=PIN, prefill and open student screen.
  // ?join=PIN&duel=1 routes into the 2-seat Friendly Battle join flow instead.
  function _checkUrlJoin() {
    const params = new URLSearchParams(window.location.search);
    const pin    = params.get('join');
    if (!pin || !/^\d{6}$/.test(pin)) return;
    const isDuel = params.get('duel') === '1';
    // Remove params from URL without reload
    const clean = window.location.pathname + window.location.hash;
    history.replaceState(null, '', clean);

    if (isDuel) { joinDuel(pin); return; }

    // Open join screen with pre-filled PIN
    _reset();
    _mode = 'student';
    _showOverlay();
    _showScreen('la-join');
    const inp = document.getElementById('la-pin-input');
    if (inp) inp.value = pin;
    _joinError('');
    _resetJoinBtn();
  }

  // Run URL check after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _checkUrlJoin);
  } else {
    setTimeout(_checkUrlJoin, 500); // slight delay to let auth resolve
  }

  /* ── Public surface ─────────────────────────────────── */
  return {
    // Entry points
    launchPicker, launchHost, launchStudent,
    // Host flow
    showPicker, pickDataset, selectDataset, startBattle, navBack,
    launchCombined: _laLaunchCombined,
    // Student flow
    submitJoin,
    // Duel (Friendly Battle · 1v1)
    launchDuelHost, joinDuel, startDuel,
    // Invite
    copyInviteLink, copyPIN, showInviteQR,
    // Dataset registry
    registerDataset,
    // Lifecycle
    close,
  };

})();
