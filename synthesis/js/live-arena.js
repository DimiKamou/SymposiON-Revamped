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

  const Q_DURATION = 25; // seconds per question
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
  let _listeners    = [];    // [ unsubscribeFn, ... ]
  let _ansUnsub     = null;  // isolated answer-count listener slot

  /* ── Firestore helpers ──────────────────────────────────── */
  const db         = () => firebase.firestore();
  const arenaRef   = (pin) => db().collection('live_arenas').doc(String(pin));
  const playersCol = (pin) => arenaRef(pin).collection('players');
  const answersCol = (pin) => arenaRef(pin).collection('answers');
  const playerRef  = (pin, uid) => playersCol(pin).doc(uid);
  const answerRef  = (pin, uid, q) => answersCol(pin).doc(`${uid}_q${q}`);

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
    await _pushQuestion(0);
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
          chip.className   = 'la-player-chip';
          chip.dataset.uid = doc.id;
          chip.innerHTML =
            `<span class="la-player-av" style="background:${_laColorFor(name)}">${_esc(_laInitials(name))}</span>` +
            `<span class="la-player-name">${_esc(name)}</span>` +
            `<button class="la-player-kick" title="${t('Αφαίρεση', 'Remove')}" aria-label="${t('Αφαίρεση', 'Remove')}">✕</button>`;
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
    const q = _cfg.questions[idx];
    if (!q) { await _endArena(); return; }

    const timerEnd = Date.now() + Q_DURATION * 1000;

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
        arcEl.style.strokeDashoffset = circumference * (1 - rem / Q_DURATION);
        arcEl.style.stroke = rem > Q_DURATION * 0.5 ? '#4a9e5c'
                           : rem > Q_DURATION * 0.25 ? '#c9a44a'
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

    await _renderLeaderboard();

    const isLast = qIdx >= _cfg.questions.length - 1;
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
    if (!wrap) return;
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
    } catch (err) {
      console.error('[LiveArena] leaderboard:', err);
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
    _showScreen('la-host-dataset');
    _laNavRender();
    _laUpdateCombineBtn();
  }

  function navBack() {
    if (_laNav.level === 'grade') {
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
      } else if (level === 'section') {
        const sec = _LA_SECTIONS.find(s => s.key === sectionKey);
        title.textContent = sec ? t(sec.labelGr, sec.labelEn) : t('Επίλεξε Βαθμίδα', 'Choose Level');
      } else if (level === 'grade') {
        const g = _laGrade(gradeKey);
        title.textContent = g ? t(g.title, g.titleEn) : t('Επίλεξε Ύλη', 'Choose Content');
      }
    }

    if (level === 'root')    { _laNavRenderRoot(list);               }
    else if (level === 'section') { _laNavRenderSection(list, sectionKey); }
    else if (level === 'grade')   { _laNavRenderGrade(list, gradeKey);    }
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
    if (gpDs.length > 0 && typeof gpLoadQuestions === 'function') {
      clear();
      gpDs.forEach(ds => {
        const tier   = ds.tier || 'free';
        const locked = !_laCanAccess(tier);
        list.appendChild(_laToggleItem(
          '📚', ds.label, ds.meta || '',
          locked,
          { key: 'gp:' + ds.id, label: ds.label, get: async () => {
            const loaded = await gpLoadQuestions(ds.id, {});
            return (loaded && !loaded.denied) ? (loaded.questions || []).filter(q => q && q.opts) : [];
          } }
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
        list.appendChild(_laToggleItem(
          '📚', ds.label, ds.meta || '',
          locked,
          { key: 'gp:' + ds.id, label: ds.label, get: async () => {
            const loaded = typeof gpLoadQuestions === 'function' ? await gpLoadQuestions(ds.id, {}) : null;
            return (loaded && !loaded.denied) ? (loaded.questions || []).filter(q => q && q.opts) : [];
          } }
        ));
      });
    });
  }

  /* ════════════════════════════════════════════════════════
     PARTICLE ENGINE (correct answer celebration)
  ════════════════════════════════════════════════════════ */

  function _launchParticles() {
    const canvas = document.getElementById('la-particles');
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

  function _stopTimer() {
    if (_timerInt) { clearInterval(_timerInt); _timerInt = null; }
  }

  function _detachAll() {
    _listeners.forEach(fn => { try { fn(); } catch (_) {} });
    _listeners = [];
    if (_ansUnsub) { try { _ansUnsub(); } catch (_) {} _ansUnsub = null; }
    _stopTimer();
    const canvas = document.getElementById('la-particles');
    if (canvas && canvas._raf) { cancelAnimationFrame(canvas._raf); canvas._raf = null; }
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
  }

  /* ── INVITE HELPERS ──────────────────────────────────── */

  function _getJoinUrl(pin) {
    return `${location.origin}/?join=${pin}`;
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
      // Pass { join: pin } so showQR builds the correct URL
      showQR(name, { join: _pin }, _pin);
    } else {
      copyInviteLink();
    }
  }

  // Auto-join: if page loaded with ?join=PIN, prefill and open student screen
  function _checkUrlJoin() {
    const params = new URLSearchParams(window.location.search);
    const pin    = params.get('join');
    if (!pin || !/^\d{6}$/.test(pin)) return;
    // Remove param from URL without reload
    const clean = window.location.pathname + window.location.hash;
    history.replaceState(null, '', clean);
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
    // Invite
    copyInviteLink, copyPIN, showInviteQR,
    // Dataset registry
    registerDataset,
    // Lifecycle
    close,
  };

})();
