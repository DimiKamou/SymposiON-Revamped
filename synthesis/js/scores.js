// ============================================================
//  SymposiON — Score Tracker, Leaderboard & Share Utility
//
//  Firestore collection : global_leaderboards
//  configId format      : {gameId}_{timerSecs}s_{lives}lives
//                         e.g. "rapid-fire-iliada_6s_3lives"
//                              "iliada-trivia_20s_3lives"
//
//  Public API (window.ScoreTracker):
//    .submit({ gameId, gameTitle, score, timerSecs, lives,
//              containerEl, insertBefore, lang })
//    .loadLeaderboard(configId, containerEl, lang)
// ============================================================

const ScoreTracker = (() => {

  // ────────────────────────────────────────────────────────
  //  CONFETTI BURST  (golden / olive particles)
  // ────────────────────────────────────────────────────────
  function _burst() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText =
      'position:fixed;inset:0;z-index:9998;pointer-events:none;';
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx  = canvas.getContext('2d');
    const COLS = [
      '#C4A448','#D4B96A','#9C8238',   // golds
      '#6A8752','#8EAA78','#EAF0E3',   // olives / sage
      '#F6F2EB',                        // cream
    ];
    const pts = Array.from({ length: 150 }, () => ({
      x:   Math.random() * canvas.width,
      y:   Math.random() * canvas.height * 0.45 - 60,
      vx:  (Math.random() - 0.5) * 9,
      vy:  Math.random() * 5 + 1.5,
      r:   Math.random() * 5 + 3,
      col: COLS[Math.floor(Math.random() * COLS.length)],
      rot: Math.random() * Math.PI * 2,
      rv:  (Math.random() - 0.5) * 0.22,
      a:   1,
    }));

    let raf;
    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let live = false;
      for (const p of pts) {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.1;        // gravity
        p.rot += p.rv;
        p.a   = Math.max(0, p.a - 0.008);
        if (p.a <= 0) continue;
        live = true;
        ctx.save();
        ctx.globalAlpha = p.a;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.col;
        ctx.fillRect(-p.r, -p.r * 0.38, p.r * 2, p.r * 0.76);
        ctx.restore();
      }
      if (live) raf = requestAnimationFrame(tick);
      else canvas.remove();
    };
    raf = requestAnimationFrame(tick);
    setTimeout(() => { cancelAnimationFrame(raf); canvas.remove(); }, 5500);
  }

  // ────────────────────────────────────────────────────────
  //  FIRESTORE HELPERS
  // ────────────────────────────────────────────────────────
  const COL = 'global_leaderboards';

  function _db() { return firebase.firestore(); }

  async function _save(configId, score) {
    const user = currentUser;
    if (!user || !_firebaseReady) return;
    const username =
      user.displayName ||
      user.email?.split('@')[0] ||
      'Ανώνυμος';
    await _db().collection(COL).add({
      configId,
      uid:       user.uid,
      username,
      score,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
  }

  async function _personalBest(configId) {
    const user = currentUser;
    if (!user || !_firebaseReady) return null;
    const snap = await _db().collection(COL)
      .where('configId', '==', configId)
      .where('uid',      '==', user.uid)
      .orderBy('score', 'desc')
      .limit(1)
      .get();
    return snap.empty ? null : snap.docs[0].data().score;
  }

  async function _lastAttempts(configId) {
    const user = currentUser;
    if (!user || !_firebaseReady) return [];
    const snap = await _db().collection(COL)
      .where('configId', '==', configId)
      .where('uid',      '==', user.uid)
      .orderBy('timestamp', 'desc')
      .limit(5)
      .get();
    return snap.docs.map(d => d.data());
  }

  async function _top10(configId) {
    if (!_firebaseReady) return [];
    const snap = await _db().collection(COL)
      .where('configId', '==', configId)
      .orderBy('score', 'desc')
      .limit(10)
      .get();
    return snap.docs.map(d => d.data());
  }

  // ────────────────────────────────────────────────────────
  //  RENDER: PERSONAL COMPARISON + HISTORY
  // ────────────────────────────────────────────────────────
  function _renderComparison(parent, { score, prevBest, isNew, attempts, gr }) {
    // If this is the very first attempt and there's nothing to compare, skip
    if (prevBest === null && attempts.length <= 1) return;

    const block = document.createElement('div');
    block.className = 'sct-comp-block';

    // ── New Record Banner ──────────────────────────────────
    if (isNew) {
      block.insertAdjacentHTML('beforeend',
        `<div class="sct-record-banner">Νέο Ρεκόρ! 🎉</div>`);
    }

    // ── Score vs Personal Best ─────────────────────────────
    if (prevBest !== null) {
      block.insertAdjacentHTML('beforeend', `
        <div class="sct-vs">
          <div class="sct-vs-col">
            <div class="sct-vs-label">${gr ? 'Τρέχον Σκορ' : 'Current Score'}</div>
            <div class="sct-vs-val${isNew ? ' sct-vs-new' : ''}">${score}</div>
          </div>
          <div class="sct-vs-sep">vs</div>
          <div class="sct-vs-col">
            <div class="sct-vs-label">${gr ? 'Προσωπικό Ρεκόρ' : 'Personal Best'}</div>
            <div class="sct-vs-val">${prevBest}</div>
          </div>
        </div>`);
    }

    // ── Last ≤5 Attempts ───────────────────────────────────
    if (attempts.length > 1) {
      const rows = attempts.slice(0, 5).map((a, i) =>
        `<div class="sct-hist-row${i === 0 && isNew ? ' sct-hist-top' : ''}">
           <span class="sct-hist-idx">#${i + 1}</span>
           <span class="sct-hist-pts">${a.score}</span>
         </div>`
      ).join('');

      block.insertAdjacentHTML('beforeend', `
        <div class="sct-hist">
          <div class="sct-hist-label">
            ${gr ? 'Τελευταίες Απόπειρες' : 'Recent Attempts'}
          </div>
          <div class="sct-hist-rows">${rows}</div>
        </div>`);
    }

    parent.appendChild(block);
  }

  // ────────────────────────────────────────────────────────
  //  RENDER: GLOBAL TOP 10
  // ────────────────────────────────────────────────────────
  function _renderTop10(parent, entries, uid, gr) {
    const old = parent.querySelector('.sct-top10');
    if (old) old.remove();

    const MEDALS = ['gold-r', 'silver-r', 'bronze-r'];

    const rows = entries.length
      ? entries.map((e, i) => {
          const me       = uid && e.uid === uid;
          const medalCls = MEDALS[i] ? ' ' + MEDALS[i] : '';
          return `
            <div class="score-row${me ? ' sct-me' : ''}">
              <div class="score-left">
                <span class="score-rank${medalCls}">${i + 1}</span>
                <span class="score-name">${_esc(e.username)}${me ? ' ✦' : ''}</span>
              </div>
              <span class="score-pts">
                ${e.score}
                <span class="sct-pts-sfx">${gr ? 'πόντοι' : 'pts'}</span>
              </span>
            </div>`;
        }).join('')
      : `<p class="sct-empty">
           ${gr
             ? 'Κανένα σκορ ακόμα — γίνε ο πρώτος!'
             : 'No scores yet — be the first!'}
         </p>`;

    const block = document.createElement('div');
    block.className = 'sct-top10';
    block.innerHTML = `
      <div class="sct-top10-hd">
        <span class="sct-top10-icon">⚔</span>
        <span>${gr ? 'Παγκόσμιο Top 10' : 'Global Top 10'}</span>
      </div>
      <div class="sct-top10-list">${rows}</div>`;
    parent.appendChild(block);
  }

  function _esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // ────────────────────────────────────────────────────────
  //  RENDER: SHARE BUTTON
  // ────────────────────────────────────────────────────────
  function _renderShare(parent, { gameTitle, score, gr }) {
    const old = parent.querySelector('.sct-share-btn');
    if (old) old.remove();

    const shareText = gr
      ? `Μόλις σκόραρα ${score} πόντους στο ${gameTitle}! Μπορείς να με κερδίσεις; 🏺`
      : `I just scored ${score} points in ${gameTitle}! Can you beat me? 🏺`;
    const url = window.location.href;

    const btn = document.createElement('button');
    btn.className   = 'sct-share-btn';
    btn.textContent = `📢 ${gr ? 'Μοιράσου το σκορ' : 'Share Score'}`;

    btn.onclick = () => {
      if (navigator.share) {
        navigator.share({
          title: `SymposiON — ${gameTitle}`,
          text:  shareText,
          url,
        }).catch(() => {});
      } else {
        const payload = `${shareText}\n${url}`;
        if (navigator.clipboard) {
          navigator.clipboard
            .writeText(payload)
            .then(() => _toast('Αντιγράφηκε!', 'Copied!'))
            .catch(() => _clipFallback(payload));
        } else {
          _clipFallback(payload);
        }
      }
    };

    parent.appendChild(btn);
  }

  function _toast(gr, en) {
    if (typeof showToast === 'function') showToast(gr, en);
  }

  function _clipFallback(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0;';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); _toast('Αντιγράφηκε!', 'Copied!'); } catch (e) {}
    document.body.removeChild(ta);
  }

  // ────────────────────────────────────────────────────────
  //  RENDER: NOT-LOGGED-IN PROMPT
  // ────────────────────────────────────────────────────────
  function _renderAuthPrompt(parent, gr) {
    const block = document.createElement('div');
    block.className = 'sct-auth-prompt';
    block.innerHTML = `
      <span>
        ${gr
          ? 'Συνδέσου για να αποθηκεύσεις το σκορ σου.'
          : 'Sign in to save your score.'}
      </span>
      <button class="sct-auth-btn"
              onclick="typeof openAuthModal==='function'&&openAuthModal('login')">
        ${gr ? 'Είσοδος' : 'Sign In'}
      </button>`;
    parent.appendChild(block);
  }

  // ────────────────────────────────────────────────────────
  //  RENDER: SPINNER
  // ────────────────────────────────────────────────────────
  function _spinner(parent) {
    const el = document.createElement('div');
    el.className = 'sct-spinner';
    el.innerHTML = '<span></span>';
    parent.appendChild(el);
    return el;
  }

  // ────────────────────────────────────────────────────────
  //  WRAP MANAGEMENT
  //  Creates (or resets) the .sct-wrap container
  // ────────────────────────────────────────────────────────
  function _getWrap(containerEl, refEl) {
    const old = containerEl.querySelector(':scope > .sct-wrap');
    if (old) old.remove();
    const wrap = document.createElement('div');
    wrap.className = 'sct-wrap';
    refEl
      ? containerEl.insertBefore(wrap, refEl)
      : containerEl.appendChild(wrap);
    return wrap;
  }

  // ────────────────────────────────────────────────────────
  //  CONFIG ID  →  "gameId_Xs_Ylives"
  // ────────────────────────────────────────────────────────
  function _cid(gameId, timerSecs, lives) {
    return `${gameId}_${timerSecs}s_${lives === 1 ? '1life' : lives + 'lives'}`;
  }

  // ────────────────────────────────────────────────────────
  //  PUBLIC: submit()
  //  Called from each game's game-over handler.
  //
  //  opts: {
  //    gameId       string  — e.g. "rapid-fire-iliada"
  //    gameTitle    string  — display name for share text
  //    score        number
  //    timerSecs    number  — initial per-question timer
  //    lives        number  — initial lives count
  //    containerEl  Element — end-screen container element
  //    insertBefore Element — sibling before which wrap is inserted
  //    lang         string  — 'gr' | 'en'
  //  }
  // ────────────────────────────────────────────────────────
  async function submit({
    gameId, gameTitle, score, timerSecs, lives,
    containerEl, insertBefore, lang,
  }) {
    const configId = _cid(gameId, timerSecs, lives);
    const gr       = lang !== 'en';

    if (!containerEl) return;
    const wrap = _getWrap(containerEl, insertBefore || null);

    const loggedIn = !!(currentUser && _firebaseReady);

    // ── Guest path ─────────────────────────────────────────
    if (!loggedIn) {
      _renderAuthPrompt(wrap, gr);
      _renderShare(wrap, { gameTitle, score, gr });
      if (_firebaseReady) {
        const spin = _spinner(wrap);
        _top10(configId)
          .then(entries => { spin.remove(); _renderTop10(wrap, entries, null, gr); })
          .catch(() => spin.remove());
      }
      return;
    }

    // ── Logged-in path ─────────────────────────────────────
    let prevBest = null;
    let attempts = [];
    let isNew    = false;

    try {
      // Fetch previous best BEFORE writing the new score
      prevBest = await _personalBest(configId);
      isNew    = score > 0 && (prevBest === null || score > prevBest);

      await _save(configId, score);

      // Re-fetch history (now includes the score we just saved)
      attempts = await _lastAttempts(configId);
    } catch (e) {
      console.warn('[ScoreTracker]', e.message);
    }

    // Confetti for any new high score (first-time counts too)
    if (isNew) _burst();

    _renderComparison(wrap, { score, prevBest, isNew, attempts, gr });
    _renderShare(wrap, { gameTitle, score, gr });

    // Async leaderboard — show spinner, swap when ready
    const spin = _spinner(wrap);
    _top10(configId)
      .then(entries => {
        spin.remove();
        _renderTop10(wrap, entries, currentUser?.uid, gr);
      })
      .catch(() => spin.remove());
  }

  // ────────────────────────────────────────────────────────
  //  PUBLIC: loadLeaderboard()
  //  Used by #ttab-scores on the trivia details page
  // ────────────────────────────────────────────────────────
  async function loadLeaderboard(configId, containerEl, lang) {
    if (!containerEl) return;
    const gr = lang !== 'en';

    if (!_firebaseReady) {
      containerEl.innerHTML =
        `<p class="sct-empty">${gr ? 'Η βάση δεδομένων δεν είναι διαθέσιμη.' : 'Database unavailable.'}</p>`;
      return;
    }

    containerEl.innerHTML = '';
    const spin = _spinner(containerEl);
    try {
      const entries = await _top10(configId);
      spin.remove();
      // Render directly into containerEl (no extra .sct-wrap wrapper)
      _renderTop10(containerEl, entries, currentUser?.uid, gr);
    } catch (e) {
      spin.remove();
      containerEl.innerHTML =
        `<p class="sct-empty">${gr ? 'Σφάλμα φόρτωσης.' : 'Load error.'}</p>`;
    }
  }

  // ────────────────────────────────────────────────────────
  //  AUTO: watch #ttab-scores for visibility change
  //  Lazy-loads the leaderboard when the Scores tab opens
  // ────────────────────────────────────────────────────────
  function _watchTriviaTabs() {
    const tab   = document.getElementById('ttab-scores');
    const board = document.getElementById('ttab-scores-board');
    if (!tab || !board) return;

    let loaded = false;
    const obs = new MutationObserver(() => {
      if (tab.style.display !== 'none' && !loaded) {
        loaded = true;
        const lang =
          (typeof siteLang !== 'undefined' && siteLang === 'en') ? 'en' : 'gr';
        loadLeaderboard('iliada-trivia_20s_3lives', board, lang);
      }
    });
    obs.observe(tab, { attributes: true, attributeFilter: ['style'] });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', _watchTriviaTabs);
  } else {
    _watchTriviaTabs();
  }

  return { submit, loadLeaderboard };

})();
