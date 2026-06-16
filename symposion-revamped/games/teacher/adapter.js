// ============================================================
//  SymposiON — Teacher Mode: Homework Game Adapter
//
//  Translates a custom_games Firestore document into the cfg
//  object expected by gramRunGame() in shared-engine.js.
//
//  G-Object design (MC distractor strategy):
//    Each question i maps to a "question entry" G["q_i"] and three
//    "phantom entries" G["q_i_d0..2"] that share verb="q_i".
//    The shared-engine's distractor pool uses the same-verb group
//    (pickPool sv=true) first, so it picks exactly the teacher-
//    defined wrong answers — not random answers from other questions.
//
//  Requires:  gramRunGame()  (shared-engine.js)
// ============================================================

// Per-template engine config (mirrors _TEMPLATES in builder.js).
const _HWK_CONFIGS = {
  'mc-trivia':  { mode: 'mc', timer: 30, lives: 3 },
  'rapid-fire': { mode: 'mc', timer: 8,  lives: 3 },
  'fill-in':    { mode: 'fi', timer: 30, lives: 3 },
};
const _HWK_DEFAULT = { mode: 'mc', timer: 30, lives: 3 };

// Stores the last game data so the retry button can relaunch.
let _hwkLastGame = null;

// ── PUBLIC ENTRY POINT ──
// Called by the router when ?nav=homework&id=DOC_ID is scanned,
// and by the teacher's own "▶ Play (Preview)" button.
function launchCustomHomework(gameData) {
  if (!gameData || !Array.isArray(gameData.questions) || !gameData.questions.length) {
    alert('This quiz has no questions yet.');
    return;
  }

  _hwkLastGame = gameData;

  const cfg = _HWK_CONFIGS[gameData.gameType] || _HWK_DEFAULT;

  // ── Build G object ──
  const G = _buildG(gameData.questions);

  // ── Inject game HTML into the overlay wrapper ──
  const wrap = document.getElementById('hwk-wrap');
  if (!wrap) { console.error('[adapter] #hwk-wrap not found'); return; }
  wrap.innerHTML = _buildGameHTML(gameData.title || 'Quiz');

  // ── Show overlay ──
  const overlay = document.getElementById('hwk-overlay');
  if (overlay) {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  // Set overlay title
  const titleEl = document.getElementById('hwk-overlay-title');
  if (titleEl) titleEl.textContent = gameData.title || 'Quiz';

  // ── Launch engine ──
  gramRunGame({
    prefix: 'hwk',
    G,
    keysFn: () => gameData.questions.map((_, i) => `q_${i}`),
    stemFn: () => '',
    qtFn:   g => `<div class="lq-main">${_escHtml(g.question)}</div>`,
    filter: null,
    mode:   cfg.mode,
    timer:  cfg.timer,
    lives:  cfg.lives,
    wrapId: 'hwk-wrap',
  });

  // Re-wire the retry button AFTER gramRunGame (which overwrites it to a
  // non-existent settings screen).  Retry simply relaunches the same game.
  const retryBtn = document.getElementById('hwk-retry');
  if (retryBtn) retryBtn.onclick = () => launchCustomHomework(gameData);
}

// ── CLOSE ──
function closeHomework() {
  const ov = document.getElementById('hwk-overlay');
  if (ov) ov.classList.remove('active');
  document.body.style.overflow = '';
  // Kill any running timer/timeout registered by the engine.
  if (typeof _gramCleanup !== 'undefined' && _gramCleanup['hwk']) {
    _gramCleanup['hwk']();
  }
}

// ── G OBJECT BUILDER ──
// For each question index i:
//   G["q_i"]      = { question, endings:[correct], fi_endings:[correct], verb:"q_i" }
//   G["q_i_d0"]   = { endings:[distractor0], verb:"q_i" }   ← phantom for distractor pool
//   G["q_i_d1"]   = { endings:[distractor1], verb:"q_i" }
//   G["q_i_d2"]   = { endings:[distractor2], verb:"q_i" }
//
// The engine's pickPool(sv=true) finds all G entries with the same verb.
// For question q_i it finds q_i_d0..2 → pool = [d0, d1, d2] (teacher's exact distractors).
// Pool has 3 items immediately so the waterfall stops without touching other questions.
function _buildG(questions) {
  const G = {};
  questions.forEach((q, i) => {
    const key = `q_${i}`;
    G[key] = {
      question:   q.q,
      endings:    [q.correct],
      fi_endings: [q.correct],
      verb:       key,          // unique "verb" group per question
    };
    // Pad to 3 distractors — fill blanks with '—' so the engine always has a full pool.
    const distractors = [...(q.distractors || [])];
    while (distractors.length < 3) distractors.push('—');

    distractors.slice(0, 3).forEach((d, j) => {
      G[`${key}_d${j}`] = {
        endings: [d],
        fi_endings: [d],
        verb: key,              // same group → picked as wrong answers for key
      };
    });
  });
  return G;
}

// ── GAME HTML ──
// Generates the minimal DOM the shared-engine needs for MC mode.
// The engine expects:  #hwk-screen-game, #hwk-screen-end (class="lyo-screen")
//                      #hwk-q, #hwk-opts, #hwk-fb, #hwk-sv, #hwk-lv, #hwk-tv
//                      #hwk-mc-area, #hwk-fi-area (toggled by engine per mode)
//                      #hwk-es, #hwk-mistakes-log  (end screen)
//                      #hwk-retry, #hwk-end-btn     (optional wired buttons)
function _buildGameHTML(title) {
  return `
  <div class="lyo-screen active" id="hwk-screen-game">
    <div class="lhud">
      <div class="lhud-cell">
        <span class="lhud-label">Score</span>
        <span class="lhud-val" id="hwk-sv">0</span>
      </div>
      <div class="lhud-cell lhud-center">
        <span class="lhud-title">${_escHtml(title)}</span>
      </div>
      <div class="lhud-cell" style="text-align:right;">
        <span class="lhud-label">Lives</span>
        <span class="lhud-val" id="hwk-lv">∞</span>
      </div>
    </div>

    <!-- Timer (hidden when cfg.timer = 0; engine sets content to ∞ symbol) -->
    <div id="hwk-tv" class="ltimer" style="display:none;"></div>

    <!-- Question -->
    <div id="hwk-q" class="lq" style="min-height:5rem;"></div>

    <!-- MC answer grid — shown in 'mc' mode -->
    <div id="hwk-mc-area">
      <div id="hwk-opts" class="lopts-grid"></div>
    </div>

    <!-- FI area — not used in mc mode but engine references it -->
    <div id="hwk-fi-area">
      <span id="hwk-stem" class="lstem"></span>
      <input id="hwk-fi-input" class="lfi-input" type="text" placeholder="answer…"/>
      <button id="hwk-fi-submit" class="lfi-btn">OK</button>
    </div>

    <!-- Feedback line -->
    <div id="hwk-fb" class="lfeedback"></div>

    <!-- Hidden "End Game" button — wired by engine to trigger end() -->
    <button id="hwk-end-btn" class="lend-game-btn" style="display:none;">End</button>
  </div>

  <!-- ── END SCREEN ── -->
  <div class="lyo-screen" id="hwk-screen-end">
    <div class="hwk-end-panel">
      <div class="hwk-end-title">Quiz Complete!</div>
      <div class="hwk-end-score">
        Score
        <span id="hwk-es">0</span>
      </div>

      <!-- Mistakes review — populated by engine -->
      <div id="hwk-mistakes-log" class="lmistakes-wrap"></div>

      <div class="hwk-end-btns">
        <button id="hwk-retry" class="hwk-end-btn hwk-end-btn-primary">
          ↺ Play Again
        </button>
        <button class="hwk-end-btn hwk-end-btn-secondary" onclick="closeHomework()">
          ✕ Close
        </button>
      </div>
    </div>
  </div>`;
}

// ── UTIL ──
function _escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
