// ============================================================
//  Μνημοσύνη (Mnemosyne) — Flashcards & Study Mode Engine
//  games/study/flashcards.js
//
//  Consumed by navToStudy(datasetId) in nav.js.
//  External dependencies (must load first):
//    firebase.firestore(), firebase.auth()
//    t(gr, en), siteLang, showToast
//    GP_DATASETS, _gpNormalizeQuestions, _gpCanAccessTier
// ============================================================

class MnemosyneEngine {
  constructor() {
    this.deck               = [];
    this.mastered           = [];
    this.mode               = 'forward';
    this.currentIdx         = 0;
    this.isFlipped          = false;
    this.datasetId          = null;
    this.datasetLabel       = null;
    this._totalCards        = 0;
    this._preloadedMastered = new Set();
    this._originalItems     = [];
  }

  // ── PUBLIC ─────────────────────────────────────────────────

  /**
   * Primary entry-point called by navToStudy() in nav.js.
   * @param {string} datasetId
   * @param {Array}  normalizedItems  — output of _gpNormalizeQuestions()
   * @param {string} datasetLabel     — human-readable name for the topbar
   */
  async startStudySession(datasetId, normalizedItems, datasetLabel = '') {
    if (!normalizedItems || normalizedItems.length === 0) {
      showToast(
        t('Δεν βρέθηκαν κάρτες για αυτή την ύλη.', 'No cards found for this dataset.'),
        ''
      );
      return;
    }

    this.datasetId          = datasetId;
    this.datasetLabel       = datasetLabel;
    this.mode               = 'forward';
    this.mastered           = [];
    this.isFlipped          = false;
    this._originalItems     = normalizedItems;

    // Convert normalised {q, a, hint} → internal card objects
    this.deck = normalizedItems.map((item, i) => ({
      id:    `${datasetId}::${i}`,
      front: String(item.q   || ''),
      back:  String(item.a   || ''),
      hint:  String(item.hint || ''),
    }));

    this._totalCards = this.deck.length;
    this._shuffle(this.deck);
    this.currentIdx = 0;

    // Pull previously mastered IDs from Firestore (best-effort, won't block)
    await this._loadMastered();

    // Filter out already-mastered cards so they don't repeat
    const prevSet = new Set(this._preloadedMastered);
    const already = this.deck.filter(c => prevSet.has(c.id));
    this.deck    = this.deck.filter(c => !prevSet.has(c.id));
    this.mastered = already.map(c => c.id);

    const workspace  = document.getElementById('study-workspace');
    const completeEl = document.getElementById('study-complete');
    if (workspace)  workspace.style.display  = '';
    if (completeEl) completeEl.style.display = 'none';

    if (this.deck.length === 0) {
      this._showAllMastered();
      this._openOverlay();
      return;
    }

    this._openOverlay();
    // Always start in flip mode; ensure fill area is hidden
    const cardArea = document.getElementById('study-card-area');
    const fillArea = document.getElementById('study-fill-area');
    const flipHint = document.getElementById('study-flip-hint');
    if (cardArea) cardArea.style.display = '';
    if (fillArea) fillArea.style.display = 'none';
    if (flipHint) flipHint.style.display = '';
    this._syncDirectionToggle();
    this._renderCard();
    this._updateProgress();
    this._resetActionBar(false);
    this._setFlipHint(false);
  }

  /** Flip the visible face of the current card. */
  flip() {
    if (this.deck.length === 0) return;
    this.isFlipped = !this.isFlipped;
    const inner = document.getElementById('study-card-inner');
    if (inner) inner.classList.toggle('flipped', this.isFlipped);
    this._resetActionBar(this.isFlipped);
    this._setFlipHint(this.isFlipped);
  }

  /** Keep card in rotation — reinsert it 3 positions ahead. */
  review() {
    if (!this.isFlipped || this.deck.length === 0) return;
    const card = this.deck[this.currentIdx];
    if (!card) return;

    this.deck.splice(this.currentIdx, 1);
    const insertAt = Math.min(this.currentIdx + 3, this.deck.length);
    this.deck.splice(insertAt, 0, card);

    if (this.currentIdx >= this.deck.length) this.currentIdx = 0;
    this._advance();
  }

  /** Remove card from rotation and push it into the mastered pile. */
  master() {
    if (!this.isFlipped || this.deck.length === 0) return;
    const card = this.deck[this.currentIdx];
    if (!card) return;

    this.mastered.push(card.id);
    this.deck.splice(this.currentIdx, 1);
    this._persistMastered(); // fire-and-forget

    if (this.deck.length === 0) {
      this._showComplete();
      return;
    }
    if (this.currentIdx >= this.deck.length) this.currentIdx = 0;
    this._advance();
  }

  /** Switch between forward (Q→A), backward (A→Q), and fill (type answer) modes. */
  setMode(mode) {
    if (mode === this.mode) return;
    const prevMode = this.mode;
    this.mode      = mode;
    this.isFlipped = false;

    const inner    = document.getElementById('study-card-inner');
    const cardArea = document.getElementById('study-card-area');
    const fillArea = document.getElementById('study-fill-area');
    const actions  = document.getElementById('study-actions');
    const flipHint = document.getElementById('study-flip-hint');

    if (inner) {
      inner.style.transition = 'none';
      inner.classList.remove('flipped');
      void inner.offsetHeight; // force reflow
      inner.style.transition = '';
    }

    if (mode === 'fill') {
      // Show fill area, hide flip card
      if (cardArea) cardArea.style.display = 'none';
      if (flipHint) flipHint.style.display = 'none';
      if (actions)  { actions.style.opacity = '0'; actions.style.pointerEvents = 'none'; }
      if (fillArea) fillArea.style.display  = '';
      this._syncDirectionToggle();
      this._renderFillCard();
    } else {
      // Show flip card, hide fill area
      if (fillArea) fillArea.style.display  = 'none';
      if (cardArea) cardArea.style.display  = '';
      if (flipHint) flipHint.style.display  = '';
      this._syncDirectionToggle();
      this._renderCard();
      this._resetActionBar(false);
      this._setFlipHint(false);
    }
  }

  /** Fill-in-gap: check typed answer, advance card, record mastery. */
  submitFill() {
    if (this.mode !== 'fill' || this.deck.length === 0) return;
    const card = this.deck[this.currentIdx];
    const inp  = document.getElementById('study-fill-input');
    const res  = document.getElementById('study-fill-result');
    if (!inp || !card) return;

    const guess    = inp.value.trim().toLowerCase();
    const expected = card.back.trim().toLowerCase();
    if (!guess) return; // empty — don't penalise

    const isCorrect = guess === expected ||
      // accept if the expected answer starts with the guess (for long answers)
      (expected.startsWith(guess) && guess.length >= Math.min(4, expected.length));

    inp.disabled = true;

    if (res) {
      res.className   = 'study-fill-result ' + (isCorrect ? 'correct' : 'wrong');
      res.textContent = isCorrect
        ? '✓ ' + t('Σωστά!', 'Correct!')
        : '✗ ' + t('Σωστό:', 'Correct:') + ' ' + card.back;
    }

    setTimeout(() => {
      if (isCorrect) {
        // Master the card (inline — no isFlipped guard needed here)
        this.mastered.push(card.id);
        this.deck.splice(this.currentIdx, 1);
        this._persistMastered();
        if (this.deck.length === 0) { this._showComplete(); return; }
        if (this.currentIdx >= this.deck.length) this.currentIdx = 0;
      } else {
        // Keep card in rotation 3 positions ahead
        this.deck.splice(this.currentIdx, 1);
        const insertAt = Math.min(this.currentIdx + 3, this.deck.length);
        this.deck.splice(insertAt, 0, card);
        if (this.currentIdx >= this.deck.length) this.currentIdx = 0;
      }
      this._updateProgress();
      this._renderFillCard();
    }, 1400);
  }

  /** Wipe local mastery progress for this dataset in Firestore then restart. */
  async resetMastery() {
    await this._persistMastered(true); // delete
    this._preloadedMastered.clear();
    // Re-build full deck
    this.deck = this._originalItems.map((item, i) => ({
      id:    `${this.datasetId}::${i}`,
      front: String(item.q   || ''),
      back:  String(item.a   || ''),
      hint:  String(item.hint || ''),
    }));
    this.mastered   = [];
    this._totalCards = this.deck.length;
    this._shuffle(this.deck);
    this.currentIdx  = 0;
    this.isFlipped   = false;
    this.mode        = 'forward';

    const workspace  = document.getElementById('study-workspace');
    const completeEl = document.getElementById('study-complete');
    if (workspace)  workspace.style.display  = '';
    if (completeEl) completeEl.style.display = 'none';

    // Ensure fill area is hidden; flip card is shown
    const cardArea = document.getElementById('study-card-area');
    const fillArea = document.getElementById('study-fill-area');
    const flipHint = document.getElementById('study-flip-hint');
    if (cardArea) cardArea.style.display = '';
    if (fillArea) fillArea.style.display = 'none';
    if (flipHint) flipHint.style.display = '';

    const inner = document.getElementById('study-card-inner');
    if (inner) {
      inner.style.transition = 'none';
      inner.classList.remove('flipped');
      void inner.offsetHeight;
      inner.style.transition = '';
    }
    this._syncDirectionToggle();
    this._renderCard();
    this._updateProgress();
    this._resetActionBar(false);
    this._setFlipHint(false);
    showToast(t('Η πρόοδος μηδενίστηκε.', 'Progress reset.'));
  }

  // ── PRIVATE: core card-cycle mechanics ─────────────────────

  _advance() {
    this.isFlipped = false;
    const inner = document.getElementById('study-card-inner');
    if (!inner) return;

    // Kill transition momentarily so the flip resets invisibly
    inner.style.transition = 'none';
    inner.classList.remove('flipped');
    void inner.offsetHeight; // sync reflow

    requestAnimationFrame(() => {
      inner.style.transition = '';
      this._renderCard();
      this._updateProgress();
      this._resetActionBar(false);
      this._setFlipHint(false);
    });
  }

  _renderCard() {
    const card = this.deck[this.currentIdx];
    if (!card) return;

    const fwd          = this.mode === 'forward';
    const frontContent = fwd ? card.front : card.back;
    const backContent  = fwd ? card.back  : card.front;
    const frontLabel   = fwd ? t('Ερώτηση','Question') : t('Απάντηση','Answer');
    const backLabel    = fwd ? t('Απάντηση','Answer')  : t('Ερώτηση','Question');

    const q = document.getElementById('study-front-content');
    const a = document.getElementById('study-back-content');
    const ql = document.getElementById('study-front-label');
    const al = document.getElementById('study-back-label');
    const hw = document.getElementById('study-hint-wrap');

    if (q)  q.innerHTML       = this._fmt(frontContent);
    if (a)  a.innerHTML       = this._fmt(backContent);
    if (ql) ql.textContent    = frontLabel;
    if (al) al.textContent    = backLabel;

    if (hw) {
      hw.style.display = card.hint ? '' : 'none';
      const ht = hw.querySelector('.study-hint-text');
      if (ht) ht.textContent = card.hint;
    }

    // Accessible label for screen-readers
    const cardEl = document.getElementById('study-card');
    if (cardEl) cardEl.setAttribute('aria-label', t('Κάρτα: ','Card: ') + frontContent);
  }

  _fmt(text) {
    if (!text) return '';
    // Allow HTML from game data (e.g. <em>, <div class="lq-*">)
    if (/<[a-zA-Z]/.test(text)) return text;
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>');
  }

  _updateProgress() {
    const remaining = this.deck.length;
    const mastN     = this.mastered.length;
    const total     = this._totalCards;
    const cardNum   = remaining > 0 ? this.currentIdx + 1 : 0;

    const progEl  = document.getElementById('study-progress-text');
    const mastEl  = document.getElementById('study-mastery-text');
    const fillEl  = document.getElementById('study-progress-fill');
    const lblEl   = document.getElementById('study-dataset-label');

    if (progEl) progEl.textContent =
      `${t('Κάρτα','Card')} ${cardNum} ${t('από','of')} ${remaining}`;
    if (mastEl) mastEl.textContent =
      `${mastN} ${t('μαθεύτηκαν','mastered')}`;

    const pct = total > 0 ? Math.round((mastN / total) * 100) : 0;
    if (fillEl) {
      fillEl.style.width = `${pct}%`;
      fillEl.setAttribute('aria-valuenow', pct);
    }
    if (lblEl) lblEl.textContent = this.datasetLabel || '';
  }

  _syncDirectionToggle() {
    const fw = document.getElementById('study-dir-forward');
    const bw = document.getElementById('study-dir-backward');
    const fl = document.getElementById('study-dir-fill');
    if (fw) fw.classList.toggle('active', this.mode === 'forward');
    if (bw) bw.classList.toggle('active', this.mode === 'backward');
    if (fl) fl.classList.toggle('active', this.mode === 'fill');
  }

  _renderFillCard() {
    const card = this.deck[this.currentIdx];
    if (!card) return;

    const fwd   = this.mode !== 'backward'; // forward and fill show Q on top
    const qText = fwd ? card.front : card.back;

    const qEl  = document.getElementById('study-fill-question');
    const inp  = document.getElementById('study-fill-input');
    const res  = document.getElementById('study-fill-result');

    if (qEl)  qEl.innerHTML     = this._fmt(qText);
    if (inp)  { inp.value = ''; inp.disabled = false; setTimeout(() => inp.focus(), 50); }
    if (res)  { res.textContent = ''; res.className = 'study-fill-result'; }
  }

  _resetActionBar(visible) {
    const el = document.getElementById('study-actions');
    if (!el) return;
    el.style.opacity       = visible ? '1' : '0';
    el.style.pointerEvents = visible ? 'auto' : 'none';
    el.style.transform     = visible ? 'translateY(0)' : 'translateY(10px)';
  }

  _setFlipHint(flipped) {
    const el = document.getElementById('study-flip-hint');
    if (!el) return;
    el.textContent = flipped
      ? t('Πάτα για να επιστρέψεις', 'Tap to flip back')
      : t('Πάτα για να δεις την απάντηση', 'Tap to reveal answer');
  }

  // ── PRIVATE: overlay visibility ────────────────────────────

  _openOverlay() {
    const ov = document.getElementById('study-overlay');
    if (!ov) return;
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    history.pushState({ _study: true, datasetId: this.datasetId }, '');
  }

  _showComplete() {
    const workspace  = document.getElementById('study-workspace');
    const completeEl = document.getElementById('study-complete');
    const subEl      = document.getElementById('study-complete-sub');
    if (workspace)  workspace.style.display  = 'none';
    if (completeEl) completeEl.style.display = '';
    if (subEl) subEl.textContent =
      `${t('Κατακτήθηκαν','Mastered')} ${this.mastered.length} ` +
      `${t('από','of')} ${this._totalCards} ${t('κάρτες!','cards!')}`;
    if(typeof awardGameRewards==='function' && this.mastered.length > 0){ awardGameRewards('study', { score: this.mastered.length, perfect: this.mastered.length === this._totalCards }); }
  }

  _showAllMastered() {
    const workspace  = document.getElementById('study-workspace');
    const completeEl = document.getElementById('study-complete');
    const titleEl    = completeEl?.querySelector('.study-complete-title');
    const subEl      = document.getElementById('study-complete-sub');
    if (workspace)  workspace.style.display  = 'none';
    if (completeEl) completeEl.style.display = '';
    if (titleEl)    titleEl.textContent = t('Όλα μαθεύτηκαν! 🏆', 'All Mastered! 🏆');
    if (subEl) subEl.textContent =
      t('Έχεις ήδη μαθευτεί όλες τις κάρτες αυτής της ύλης. Μπορείς να μηδενίσεις την πρόοδό σου παρακάτω.',
        'You have already mastered all cards in this deck. You can reset your progress below.');
  }

  // ── PRIVATE: utilities ─────────────────────────────────────

  _shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  _getUid() {
    try { return firebase.auth().currentUser?.uid || null; } catch (_) { return null; }
  }

  // ── PRIVATE: Firestore persistence ─────────────────────────

  async _persistMastered(deleteAll = false) {
    const uid = this._getUid();
    if (!uid || !this.datasetId) return;
    const ref = firebase.firestore()
      .collection('users').doc(uid)
      .collection('mastered_study').doc(this.datasetId);
    try {
      if (deleteAll) {
        await ref.delete();
      } else {
        await ref.set({
          masteredIds:  this.mastered,
          datasetLabel: this.datasetLabel || '',
          updatedAt:    firebase.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
      }
    } catch (err) {
      console.warn('[Mnemosyne] Firestore write error:', err);
    }
  }

  async _loadMastered() {
    this._preloadedMastered = new Set();
    const uid = this._getUid();
    if (!uid || !this.datasetId) return;
    try {
      const snap = await firebase.firestore()
        .collection('users').doc(uid)
        .collection('mastered_study').doc(this.datasetId)
        .get();
      if (snap.exists) {
        (snap.data().masteredIds || []).forEach(id => this._preloadedMastered.add(id));
      }
    } catch (err) {
      console.warn('[Mnemosyne] Firestore read error:', err);
    }
  }
}

// ── Singleton ───────────────────────────────────────────────
const Mnemosyne = new MnemosyneEngine();
