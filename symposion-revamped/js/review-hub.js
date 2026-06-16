// ============================================================
//  SymposiON — Tartarus Review Hub  (js/review-hub.js)
//  Το Αρχείο Σφαλμάτων — tracks, categorizes, and adaptively
//  re-tests student errors using Firestore persistence.
//
//  Global API:
//    logStudentMistake(gameId, subjectId, lessonType, questionObj, wrongAnswer)
//    navToReviewHub()
//    loadReviewDashboard(filterSubject)
//    clearMistakesArchive()
//    shareMistakesWithTeacher()
//    launchAdaptiveReview()
//    closeTartarusReview()
//    filterMistakes(subjectId, btnEl)
// ============================================================

// ── CONSTANTS ──
const RH_COL = 'mistakes_archive';

// ── STATE ──
let _rhDocs   = [];     // current fetched documents (all, unsorted)
let _rhFilter = 'all';  // active filter subjectId

// ── ADAPTIVE SESSION STATE ──
const _rhReview = {
  questions:   [],
  current:     0,
  score:       0,
  answered:    false,
  pendingTick: null,
};

// ══════════════════════════════════════════════════════════
//  UTILITIES
// ══════════════════════════════════════════════════════════

// Deterministic 8-char Firestore document ID from content
function _rhDocId(subjectId, lessonType, questionText) {
  const raw = `${subjectId}__${lessonType}__${questionText}`;
  let h = 5381;
  for (let i = 0; i < raw.length; i++) {
    h = ((h << 5) + h) ^ raw.charCodeAt(i);
    h = h >>> 0;
  }
  return h.toString(36).padStart(8, '0');
}

function _rhEsc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Human-readable label for a subjectId
function _rhSubjectLabel(sid) {
  const map = {
    'archaia':        'Αρχαία Γραμματική',
    'archaia-thx':    'Αρχαία Ελληνικά (Θεωρητική)',
    'ancient-greek':  'Αρχαία Ελληνικά',
    'history':        'Ιστορία',
    'istoria':        'Ιστορία',
    'lyo':            'Λύω — Ρήματα',
    'synirimmena':    'Συνηρημένα',
    'pathitiko':      'Παθητική Φωνή',
    'aoristos-b':     'Αόριστος Β΄',
    'rimata-mi':      'Ρήματα σε -μι',
    'anwmala-rimata': 'Ανώμαλα Ρήματα',
    'lat-anwmala':    'Ανώμαλα Ρήματα Λατινικών',
    'klisi-rimaton':  'Κλίση Ρημάτων',
    'eimi':           'Εἰμί',
    'afwnolekta':     'Αφωνόληκτα',
    'ousiastika':     'Κλίση Ουσιαστικών',
    'antonymies':     'Αντωνυμίες',
    'paratheta':      'Παραθετικά',
    'epitheta':       'Επίθετα',
    'odysseia':       'Οδύσσεια',
    'iliada':         'Ιλιάδα',
    'eleni':          'Ελένη',
    'nea-ellinika':   'Νέα Ελληνικά',
    'latinika':       'Λατινικά',
    'history-7':      'Ιστορία Α΄ Γυμνασίου',
    'history-8':      'Ιστορία Β΄ Γυμνασίου',
    'history-9':      'Ιστορία Γ΄ Γυμνασίου',
  };
  return map[sid] || sid || 'Μάθημα';
}

// Human-readable label for a lessonType
function _rhLessonLabel(lt) {
  if (!lt) return '';
  const map = {
    'gym-a-civilizations': 'Α΄ Γυμν. — Πολιτισμοί',
    'gym-b-history':       'Β΄ Γυμν. — Ιστορία',
    'gym-c-history':       'Γ΄ Γυμν. — Ιστορία',
    'verbs-lyo':           'Ρήματα — Λύω',
    'verbs-lyo-chrono':    'Χρονική Αντικατάσταση',
    'mc':                  'Πολλαπλή Επιλογή',
    'fi':                  'Συμπλήρωση Κενού',
    'fw':                  'Ολόκληρος Τύπος',
    'match':               'Αντιστοίχιση',
    'grammar':             'Γραμματική',
    'all':                 'Πλήρης Μορφολογία',
    'ft':                  'Ζητούμενος Τύπος',
    'ft_any':              'Τυχαίος Τύπος',
    'chrono':              'Χρονική Αντικατάσταση',
  };
  return map[lt] || lt;
}

function _rhSetState(state) {
  const states = { grid: false, empty: false, loading: false, unauthenticated: false };
  states[state] = true;
  const grid  = document.getElementById('rh-grid');
  const empty = document.getElementById('rh-empty');
  const spin  = document.getElementById('rh-loading');
  const unath = document.getElementById('rh-unauthenticated');
  if (grid)  grid.style.display  = states.grid   ? '' : 'none';
  if (empty) empty.style.display = states.empty  ? '' : 'none';
  if (spin)  spin.style.display  = states.loading ? '' : 'none';
  if (unath) unath.style.display = states.unauthenticated ? '' : 'none';

  // Stats bar visibility
  const stats = document.getElementById('rh-stats');
  if (stats) stats.style.display = (states.grid || states.empty) ? '' : 'none';
}

// ══════════════════════════════════════════════════════════
//  1. LOG STUDENT MISTAKE  (global utility — called by game engines)
// ══════════════════════════════════════════════════════════
async function logStudentMistake(gameId, subjectId, lessonType, questionObj, wrongAnswer) {
  if (typeof currentUser === 'undefined' || !currentUser) return;
  if (!questionObj || !questionObj.q || !questionObj.a) return;

  const docId = _rhDocId(
    String(subjectId  || 'unknown'),
    String(lessonType || 'unknown'),
    String(questionObj.q)
  );

  try {
    await firebase.firestore()
      .collection('users').doc(currentUser.uid)
      .collection(RH_COL).doc(docId)
      .set({
        gameId,
        subjectId,
        lessonType,
        questionText:     String(questionObj.q),
        correctAnswer:    String(questionObj.a),
        wrongAnswerGiven: String(wrongAnswer),
        errorCount:       firebase.firestore.FieldValue.increment(1),
        lastAttempted:    firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true });
  } catch (err) {
    console.warn('[TartarusHub] logStudentMistake failed:', err);
  }
}

// ══════════════════════════════════════════════════════════
//  2. ROUTER
// ══════════════════════════════════════════════════════════
function navToReviewHub() {
  if (typeof _navPush === 'function') _navPush({ page: 'review-hub' });
  document.body.dataset.theme = '';

  if (typeof buildNav === 'function') {
    buildNav('review-hub-nav-wrap', [
      { label: t('Αρχική', 'Home'), action: "goTo('home')" },
      { label: t('Τάρταρος — Αρχείο Σφαλμάτων', 'Tartarus — Error Archive') },
    ]);
  }

  // Pre-inject GE CSS so ge-* overlay classes are ready before quiz launch
  if (typeof GE_injectCSS === 'function') GE_injectCSS();

  if (typeof goTo === 'function') goTo('review-hub');
  loadReviewDashboard(_rhFilter);
}

// ══════════════════════════════════════════════════════════
//  3. LOAD DASHBOARD
// ══════════════════════════════════════════════════════════
async function loadReviewDashboard(filterSubject) {
  _rhFilter = filterSubject || 'all';
  _rhSetState('loading');

  // ── Auth guard ───────────────────────────────────────────
  if (typeof currentUser === 'undefined' || !currentUser) {
    _rhSetState('unauthenticated');
    _rhUpdateStats([], []);
    return;
  }

  const uid = currentUser.uid;

  try {
    const snap = await firebase.firestore()
      .collection('users').doc(uid)
      .collection(RH_COL)
      .orderBy('errorCount', 'desc')
      .get();

    _rhDocs = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.warn('[TartarusHub] loadReviewDashboard error:', err);
    _rhDocs = [];
  }

  _rhApplyFilter();
}

function _rhApplyFilter() {
  const filtered = _rhFilter === 'all'
    ? _rhDocs
    : _rhDocs.filter(d => d.subjectId === _rhFilter);

  _rhUpdateStats(_rhDocs, filtered);
  _rhBuildFilterPills();
  _rhRenderGrid(filtered);
  _rhSetState(filtered.length ? 'grid' : 'empty');
}

function _rhUpdateStats(allDocs, filtered) {
  const total      = filtered.length;
  const totalErrs  = filtered.reduce((s, d) => s + (d.errorCount || 0), 0);
  const totalEl    = document.getElementById('rh-total-count');
  const errorsEl   = document.getElementById('rh-total-errors');
  const startBtn   = document.getElementById('rh-btn-start');
  if (totalEl)  totalEl.textContent  = total;
  if (errorsEl) errorsEl.textContent = totalErrs;
  if (startBtn) startBtn.disabled    = total < 3;
}

// ── Filter pills ──
function _rhBuildFilterPills() {
  const wrap = document.getElementById('rh-filters');
  if (!wrap) return;
  const subjects = [...new Set(_rhDocs.map(d => d.subjectId).filter(Boolean))];
  const pills = [{ id: 'all', label: t('Όλα', 'All') },
    ...subjects.map(sid => ({ id: sid, label: _rhSubjectLabel(sid) }))];
  wrap.innerHTML = pills.map(p =>
    `<button class="rh-pill${_rhFilter === p.id ? ' active' : ''}"
             onclick="filterMistakes('${p.id}', this)">${_rhEsc(p.label)}</button>`
  ).join('');
}

function filterMistakes(subjectId, btn) {
  document.querySelectorAll('.rh-pill').forEach(p => p.classList.remove('active'));
  if (btn) btn.classList.add('active');
  _rhFilter = subjectId;
  _rhApplyFilter();
}

// ── Cards ──
function _rhRenderGrid(docs) {
  const grid = document.getElementById('rh-grid');
  if (!grid) return;
  grid.innerHTML = '';
  docs.forEach((doc, idx) => {
    const count = doc.errorCount || 1;
    const heat  = count >= 5 ? 'hot' : count >= 3 ? 'warm' : 'cool';
    const card  = document.createElement('div');
    card.className = 'rh-card';
    card.style.animationDelay = `${Math.min(idx, 12) * 45}ms`;
    card.innerHTML = `
      <div class="rh-card-top">
        <span class="rh-card-subject">${_rhEsc(_rhSubjectLabel(doc.subjectId))}</span>
        <span class="rh-card-badge rh-badge-${heat}">
          ${count} <span class="rh-badge-label">${t('αποτυχίες', 'failures')}</span>
        </span>
      </div>
      <div class="rh-card-question">${doc.questionText || '—'}</div>
      <div class="rh-card-footer">
        <div class="rh-card-answer">
          <span class="rh-answer-label">${t('Σωστό', 'Correct')}:</span>
          <span class="rh-answer-val">${_rhEsc(doc.correctAnswer || '—')}</span>
        </div>
        ${doc.lessonType ? `<span class="rh-card-lesson">${_rhEsc(_rhLessonLabel(doc.lessonType))}</span>` : ''}
      </div>
    `;
    grid.appendChild(card);
  });

  // Stagger-in animation
  requestAnimationFrame(() => {
    grid.querySelectorAll('.rh-card').forEach((c, i) => {
      setTimeout(() => c.classList.add('rh-card-visible'), i * 40);
    });
  });
}

// ══════════════════════════════════════════════════════════
//  4. CLEAR ARCHIVE
// ══════════════════════════════════════════════════════════
function confirmClearArchive() {
  if (typeof currentUser === 'undefined' || !currentUser) {
    if (typeof showToast === 'function')
      showToast('Απαιτείται σύνδεση για αυτή την ενέργεια.', 'Sign in required.');
    return;
  }
  _rhModal({
    title:        t('Εκκαθάριση Αρχείου;', 'Clear Archive?'),
    body:         t(
      'Αυτή η ενέργεια θα διαγράψει μόνιμα όλα τα καταγεγραμμένα σφάλματά σου. Δεν υπάρχει αναίρεση.',
      'This action will permanently delete all your recorded mistakes. It cannot be undone.'
    ),
    danger:       true,
    confirmLabel: t('🗑️ Διαγραφή Όλων', '🗑️ Delete All'),
    onConfirm:    clearMistakesArchive,
  });
}

async function clearMistakesArchive() {
  if (typeof currentUser === 'undefined' || !currentUser) return;
  try {
    const snap = await firebase.firestore()
      .collection('users').doc(currentUser.uid)
      .collection(RH_COL).get();

    if (snap.empty) {
      if (typeof showToast === 'function')
        showToast('Το αρχείο είναι ήδη άδειο.', 'Archive is already empty.');
      return;
    }

    // Batch delete — Firestore supports up to 500 ops per batch
    const batches = [];
    let batch = firebase.firestore().batch();
    let ops   = 0;
    snap.docs.forEach(d => {
      batch.delete(d.ref);
      ops++;
      if (ops === 499) { batches.push(batch.commit()); batch = firebase.firestore().batch(); ops = 0; }
    });
    if (ops > 0) batches.push(batch.commit());
    await Promise.all(batches);

    _rhDocs = [];
    if (typeof showToast === 'function')
      showToast('✓ Το αρχείο εκκαθαρίστηκε επιτυχώς.', '✓ Archive cleared successfully.');
    loadReviewDashboard('all');
  } catch (err) {
    console.error('[TartarusHub] clearMistakesArchive failed:', err);
    if (typeof showToast === 'function')
      showToast('Σφάλμα κατά τη διαγραφή. Δοκίμασε ξανά.', 'Delete failed. Try again.');
  }
}

// ══════════════════════════════════════════════════════════
//  5. SHARE WITH TEACHER
// ══════════════════════════════════════════════════════════
function openShareModal() {
  if (typeof currentUser === 'undefined' || !currentUser) {
    if (typeof showToast === 'function')
      showToast('Συνδέσου πρώτα για να μοιραστείς την αναφορά.', 'Sign in first to share the report.');
    return;
  }
  if (!_rhDocs.length) {
    if (typeof showToast === 'function')
      showToast('Δεν υπάρχουν σφάλματα για κοινή χρήση.', 'No mistakes to share yet.');
    return;
  }

  document.getElementById('rh-share-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id        = 'rh-share-overlay';
  overlay.className = 'rh-modal-overlay';
  overlay.innerHTML = `
    <div class="rh-modal" role="dialog" aria-modal="true">
      <div class="rh-modal-hd">
        <h3 class="rh-modal-title">${t('Κοινή Χρήση με Καθηγητή', 'Share with Teacher')}</h3>
        <button class="rh-modal-x" onclick="document.getElementById('rh-share-overlay').remove()" aria-label="Κλείσιμο">✕</button>
      </div>
      <p class="rh-modal-sub">
        ${t(
          'Εισήγαγε το email του καθηγητή σου. Θα λάβει αυτόματα μια λεπτομερή αναφορά με τα σφάλματά σου.',
          "Enter your teacher's registered email. They will receive a detailed report of your mistakes."
        )}
      </p>
      <div class="rh-field">
        <label class="rh-field-label">${t('Email Καθηγητή', "Teacher's Email")}</label>
        <input type="email" id="rh-teacher-email" class="rh-field-input"
               placeholder="teacher@school.gr" autocomplete="email" autocapitalize="none"/>
      </div>
      <div class="rh-modal-err" id="rh-share-err" style="display:none;"></div>
      <div class="rh-modal-actions">
        <button class="rh-btn rh-btn-ghost" onclick="document.getElementById('rh-share-overlay').remove()">
          ${t('Ακύρωση', 'Cancel')}
        </button>
        <button class="rh-btn rh-btn-secondary" id="rh-share-btn" onclick="shareMistakesWithTeacher()">
          📤 ${t('Αποστολή Αναφοράς', 'Send Report')}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));
  document.getElementById('rh-teacher-email')?.focus();
}

async function shareMistakesWithTeacher() {
  const emailEl = document.getElementById('rh-teacher-email');
  const errEl   = document.getElementById('rh-share-err');
  const btn     = document.getElementById('rh-share-btn');
  if (!emailEl) return;

  const email = emailEl.value.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    if (errEl) { errEl.textContent = t('Εισήγαγε έγκυρη διεύθυνση email.', 'Enter a valid email address.'); errEl.style.display = ''; }
    emailEl.focus();
    return;
  }
  if (errEl) errEl.style.display = 'none';
  const _btnLabel = `📤 ${t('Αποστολή Αναφοράς', 'Send Report')}`;
  if (btn)   { btn.disabled = true; btn.textContent = t('⏳ Αποστολή…', '⏳ Sending…'); }

  try {
    // Verify teacher exists in users collection
    const teacherSnap = await firebase.firestore()
      .collection('users')
      .where('email', '==', email)
      .limit(1)
      .get();

    if (teacherSnap.empty) {
      if (errEl) {
        errEl.textContent = t(
          'Ο καθηγητής δεν βρέθηκε στο σύστημα. Βεβαιώσου ότι έχει εγγραφεί στο SymposiON.',
          'Teacher not found in the system. Make sure they are registered on SymposiON.'
        );
        errEl.style.display = '';
      }
      if (btn) { btn.disabled = false; btn.textContent = _btnLabel; }
      return;
    }

    // Build summary from currently filtered docs
    const activeDocs = _rhFilter === 'all'
      ? _rhDocs
      : _rhDocs.filter(d => d.subjectId === _rhFilter);

    const errorSummary = [...activeDocs]
      .sort((a, b) => (b.errorCount || 0) - (a.errorCount || 0))
      .slice(0, 60)
      .map(d => ({
        subjectId:    d.subjectId   || '',
        lessonType:   d.lessonType  || '',
        questionText: d.questionText || '',
        correctAnswer: d.correctAnswer || '',
        errorCount:   d.errorCount  || 0,
      }));

    await firebase.firestore().collection('teacher_reports').add({
      teacherEmail:  email,
      studentUid:    currentUser.uid,
      studentName:   currentUser.displayName || t('Μαθητής', 'Student'),
      studentEmail:  currentUser.email  || '',
      generatedAt:   firebase.firestore.FieldValue.serverTimestamp(),
      totalMistakes: activeDocs.length,
      totalErrors:   activeDocs.reduce((s, d) => s + (d.errorCount || 0), 0),
      filterSubject: _rhFilter,
      errorSummary,
    });

    document.getElementById('rh-share-overlay')?.remove();
    if (typeof showToast === 'function')
      showToast('✓ Η αναφορά στάλθηκε επιτυχώς!', '✓ Report sent successfully!');
  } catch (err) {
    console.error('[TartarusHub] shareMistakesWithTeacher failed:', err);
    if (errEl) {
      errEl.textContent = t('Σφάλμα κατά την αποστολή. Δοκίμασε ξανά.', 'Send failed. Please try again.');
      errEl.style.display = '';
    }
    if (btn) { btn.disabled = false; btn.textContent = _btnLabel; }
  }
}

// ══════════════════════════════════════════════════════════
//  6. ADAPTIVE REVIEW ENGINE  (custom MC loop with Firestore hooks)
// ══════════════════════════════════════════════════════════
async function launchAdaptiveReview() {
  if (typeof currentUser === 'undefined' || !currentUser) return;

  const pool = _rhFilter === 'all'
    ? _rhDocs
    : _rhDocs.filter(d => d.subjectId === _rhFilter);

  if (pool.length < 3) {
    if (typeof showToast === 'function')
      showToast('Χρειάζονται τουλάχιστον 3 ερωτήσεις για αναθεώρηση.', 'Need at least 3 questions to launch review.');
    return;
  }

  // Top 20 by errorCount, then shuffle
  const top = [...pool]
    .sort((a, b) => (b.errorCount || 0) - (a.errorCount || 0))
    .slice(0, 20);

  for (let i = top.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [top[i], top[j]] = [top[j], top[i]];
  }

  // Build MC questions — distractors come from other correct answers in the pool
  const allAnswers = [...new Set(top.map(d => d.correctAnswer).filter(Boolean))];
  const questions  = top.map(doc => {
    const correct      = doc.correctAnswer;
    const distractors  = allAnswers.filter(a => a !== correct);
    const shuffled     = [...distractors].sort(() => Math.random() - 0.5);
    const wrong        = shuffled.slice(0, 3);
    while (wrong.length < 3) wrong.push('—');
    const opts = [correct, ...wrong].sort(() => Math.random() - 0.5);
    return {
      docId:         doc.id,
      subjectId:     doc.subjectId,
      lessonType:    doc.lessonType,
      questionText:  doc.questionText,
      correctAnswer: correct,
      errorCount:    doc.errorCount || 1,
      opts,
    };
  });

  Object.assign(_rhReview, {
    questions,
    current:     0,
    score:       0,
    answered:    false,
    pendingTick: null,
  });

  // Open overlay
  const overlay = document.getElementById('tartarus-overlay');
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  _rhShowQ(0);

  // Ensure GE CSS (for ge-opt etc.) is available
  if (typeof GE_injectCSS === 'function') GE_injectCSS();

  // Push history so back button works
  history.pushState({ _tartarusReview: true }, '');
}

function _rhShowQ(idx) {
  const q     = _rhReview.questions[idx];
  const total = _rhReview.questions.length;

  // Transition to end screen when done
  if (!q) { _rhEndReview(); return; }

  const progress = document.getElementById('rh-progress');
  const qText    = document.getElementById('rh-q-text');
  const qMeta    = document.getElementById('rh-q-meta');
  const fb       = document.getElementById('rh-q-fb');
  const opts     = document.getElementById('rh-opts');
  const scoreEl  = document.getElementById('rh-score-el');
  const counterEl = document.getElementById('rh-counter-el');

  if (progress)  progress.style.width = `${(idx / total) * 100}%`;
  if (qText)     qText.innerHTML      = q.questionText || '—';
  if (qMeta) {
    qMeta.innerHTML = `
      <span class="ge-tag">${_rhEsc(_rhSubjectLabel(q.subjectId))}</span>
      ${q.lessonType ? `<span class="ge-tag">${_rhEsc(_rhLessonLabel(q.lessonType))}</span>` : ''}
      <span class="ge-tag rh-heat-tag">🔥 ${q.errorCount}×</span>
    `;
  }
  if (fb)        { fb.textContent = ''; fb.className = 'ge-fb'; }
  if (scoreEl)   scoreEl.textContent = _rhReview.score;
  if (counterEl) counterEl.textContent = `${idx + 1} / ${total}`;

  if (opts) {
    opts.innerHTML = '';
    q.opts.forEach(opt => {
      const b = document.createElement('button');
      b.className   = 'ge-opt';
      b.textContent = opt;
      b.onclick     = () => _rhAnswer(opt, q);
      opts.appendChild(b);
    });
  }

  _rhReview.answered = false;

  // Show game screen
  document.querySelectorAll('#tartarus-overlay .trt-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('trt-screen-game')?.classList.add('active');
}

function _rhAnswer(chosen, q) {
  if (_rhReview.answered) return;
  _rhReview.answered = true;

  const correct = q.correctAnswer;
  const ok      = chosen === correct;

  document.querySelectorAll('#rh-opts .ge-opt').forEach(b => {
    b.disabled = true;
    if (b.textContent === correct) b.classList.add('ok');
    else if (b.textContent === chosen && !ok) b.classList.add('bad');
  });

  const fb = document.getElementById('rh-q-fb');
  if (ok) {
    if (fb) { fb.textContent = `✓ ${t('Σωστό!', 'Correct!')}`; fb.className = 'ge-fb ok'; }
    _rhReview.score++;
    const scoreEl = document.getElementById('rh-score-el');
    if (scoreEl) scoreEl.textContent = _rhReview.score;
    _rhDecrementMistake(q.docId);
  } else {
    if (fb) { fb.textContent = `✗ ${t('Λάθος', 'Wrong')} — ${t('σωστό', 'correct')}: ${correct}`; fb.className = 'ge-fb bad'; }
  }

  clearTimeout(_rhReview.pendingTick);
  _rhReview.pendingTick = setTimeout(() => {
    _rhReview.current++;
    _rhShowQ(_rhReview.current);
  }, 1600);
}

// Decrement errorCount in Firestore; delete if it reaches 0
async function _rhDecrementMistake(docId) {
  if (typeof currentUser === 'undefined' || !currentUser || !docId) return;
  try {
    const ref  = firebase.firestore()
      .collection('users').doc(currentUser.uid)
      .collection(RH_COL).doc(docId);
    const snap = await ref.get();
    if (!snap.exists) return;

    const current  = snap.data().errorCount || 1;
    const newCount = current - 1;

    if (newCount <= 0) {
      await ref.delete();
      _rhDocs = _rhDocs.filter(d => d.id !== docId);
    } else {
      await ref.update({ errorCount: newCount });
      const local = _rhDocs.find(d => d.id === docId);
      if (local) local.errorCount = newCount;
    }
  } catch (err) {
    console.warn('[TartarusHub] _rhDecrementMistake failed:', err);
  }
}

function _rhEndReview() {
  const total   = _rhReview.questions.length;
  const score   = _rhReview.score;
  const pct     = total > 0 ? Math.round((score / total) * 100) : 0;
  const endScore = document.getElementById('trt-end-score');
  const endMsg   = document.getElementById('trt-end-msg');
  const progress = document.getElementById('rh-progress');

  if (progress)  progress.style.width = '100%';
  if (endScore)  endScore.textContent = `${score} / ${total}`;
  if (endMsg) {
    endMsg.textContent = pct >= 80
      ? t('Εξαιρετική δουλειά! 🏆', 'Outstanding work! 🏆')
      : pct >= 50
      ? t('Καλή πρόοδος! Συνέχισε έτσι. 💪', 'Good progress! Keep it up. 💪')
      : t('Συνέχισε την εξάσκηση — θα τα καταφέρεις! 📚', 'Keep practicing — you will get there! 📚');
  }

  document.querySelectorAll('#tartarus-overlay .trt-screen').forEach(s => s.classList.remove('active'));
  document.getElementById('trt-screen-end')?.classList.add('active');

  // ── Temple rewards (config-driven per-game params — see realm.js gameRewards) ──
  if (typeof awardGameRewards === 'function' && total > 0) {
    awardGameRewards('review-hub', { score: score, perfect: pct >= 80 });
  } else if (typeof awardRewards === 'function' && total > 0) {
    awardRewards(Math.round(score * 10 + (pct >= 80 ? 20 : 0)), 2 + (pct >= 80 ? 3 : 0));
  }
}

function closeTartarusReview() {
  clearTimeout(_rhReview.pendingTick);
  const overlay = document.getElementById('tartarus-overlay');
  if (overlay) { overlay.classList.remove('active'); document.body.style.overflow = ''; }

  // Refresh dashboard if it's the active page
  const page = document.getElementById('page-review-hub');
  if (page && page.classList.contains('active')) loadReviewDashboard(_rhFilter);
}

// Capture-phase popstate guard — intercepts Back before nav.js sees it
(function _rhRegisterPopstate() {
  if (window._rhPopstateGuard) return;
  window._rhPopstateGuard = true;
  window.addEventListener('popstate', function _rhGuard(e) {
    const overlay = document.getElementById('tartarus-overlay');
    if (overlay && overlay.classList.contains('active')) {
      closeTartarusReview();
      history.pushState(e.state ?? {}, '');
      e.stopImmediatePropagation();
    }
  }, true /* capture */);
})();

// ══════════════════════════════════════════════════════════
//  7. GENERIC CONFIRM MODAL
// ══════════════════════════════════════════════════════════
function _rhModal({ title, body, danger, confirmLabel, onConfirm }) {
  document.getElementById('rh-confirm-overlay')?.remove();
  const overlay = document.createElement('div');
  overlay.id        = 'rh-confirm-overlay';
  overlay.className = 'rh-modal-overlay';
  overlay.innerHTML = `
    <div class="rh-modal${danger ? ' rh-modal-danger' : ''}" role="dialog" aria-modal="true">
      <div class="rh-modal-hd">
        <h3 class="rh-modal-title">${title}</h3>
        <button class="rh-modal-x" onclick="_rhCloseModal()" aria-label="${t('Κλείσιμο', 'Close')}">✕</button>
      </div>
      <p class="rh-modal-sub">${body}</p>
      <div class="rh-modal-actions">
        <button class="rh-btn rh-btn-ghost" onclick="_rhCloseModal()">${t('Ακύρωση', 'Cancel')}</button>
        <button class="rh-btn ${danger ? 'rh-btn-danger' : 'rh-btn-primary'}" id="rh-confirm-btn">
          ${confirmLabel}
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('open')));
  document.getElementById('rh-confirm-btn').onclick = () => { _rhCloseModal(); onConfirm(); };
}

function _rhCloseModal() {
  const el = document.getElementById('rh-confirm-overlay') || document.getElementById('rh-share-overlay');
  if (!el) return;
  el.classList.remove('open');
  setTimeout(() => el.remove(), 260);
}
