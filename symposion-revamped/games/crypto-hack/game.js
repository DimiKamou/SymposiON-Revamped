/*
  CryptoHack Engine — pluggable game mode for any question set.

  Usage:
    CryptoHack.open({
      questions : [ { q:'...', opts:['a','b','c','d'], ans:0 }, ... ],
      gameName  : 'Ιλιάδα Trivia',   // shown in topbar
      onClose   : () => {},           // called when player exits
    });

  Questions default to a built-in demo set if none are passed.
*/
const CryptoHack = (() => {

  /* ── Built-in demo questions (used when no questions are injected) ── */
  const DEMO_QUESTIONS = [
    { q:'What is the powerhouse of the cell?', opts:['Nucleus','Ribosome','Mitochondria','Golgi'], ans:2 },
    { q:'Which planet is closest to the Sun?', opts:['Venus','Earth','Mercury','Mars'], ans:2 },
    { q:'What is 7 × 8?', opts:['54','56','58','64'], ans:1 },
    { q:'Who wrote "Romeo and Juliet"?', opts:['Dickens','Chaucer','Marlowe','Shakespeare'], ans:3 },
    { q:'What is the chemical symbol for gold?', opts:['Go','Gd','Au','Ag'], ans:2 },
    { q:'How many sides does a hexagon have?', opts:['5','6','7','8'], ans:1 },
    { q:'Which ocean is the largest?', opts:['Atlantic','Indian','Arctic','Pacific'], ans:3 },
    { q:'What year did World War II end?', opts:['1943','1944','1945','1946'], ans:2 },
    { q:'Which element has atomic number 1?', opts:['Helium','Hydrogen','Lithium','Carbon'], ans:1 },
    { q:'What is the capital of France?', opts:['Rome','Berlin','Madrid','Paris'], ans:3 },
    { q:'How many bones are in the adult human body?', opts:['196','206','216','226'], ans:1 },
    { q:'Which planet has the most moons?', opts:['Jupiter','Saturn','Uranus','Neptune'], ans:1 },
  ];

  /* ── Simulated network players to hack ── */
  const NETWORK = [
    { name:'AGENT_77',   code:'XK9-4M2-PQ7', score:1840 },
    { name:'DARKNET_3',  code:'BR2-7YZ-J5N', score:2310 },
    { name:'SIGMA_X',    code:'MN5-1KQ-9TR', score:890  },
    { name:'PROX_4',     code:'ZL3-8WE-6GH', score:3050 },
    { name:'BYTE_WOLF',  code:'QP6-2NF-1XS', score:1220 },
    { name:'NULL_PTR',   code:'TS9-4MA-7BV', score:670  },
    { name:'GHOST_R',    code:'VK1-9ZL-3FP', score:2780 },
    { name:'NEO_C',      code:'JH7-5WB-8YQ', score:1590 },
    { name:'0xDEAD',     code:'RN4-8KH-2ZP', score:3400 },
    { name:'PHANTOM_9',  code:'WQ7-3XT-5MJ', score:980  },
  ];

  const HACK_LINES = [
    l => `> SCANNING TARGET: ${l.code}`,
    () => '> PROBING OPEN PORTS...',
    () => '> BYPASSING FIREWALL [██████████] DONE',
    () => '> INJECTING PAYLOAD...',
    l => `> ACCESSING ${l.name} DATA CLUSTER`,
    () => '> EXTRACTING ENCRYPTED FILES...',
    () => '> DECRYPTING... [████████░░] 80%',
    () => '> CORRUPTING SCORE ENTRIES...',
    () => '████████████████ 100%',
    () => '> BREACH COMPLETE',
  ];

  let cfg = { questions: [], gameName: 'CRYPTO HACK', onClose: () => {} };
  let st  = {};

  /* ─────────── Public API ─────────── */

  function open(config = {}) {
    cfg = { questions: DEMO_QUESTIONS, gameName: 'DEMO', onClose: () => {}, ...config };
    if (!cfg.questions || cfg.questions.length === 0) cfg.questions = DEMO_QUESTIONS;

    const ov = document.getElementById('ch-overlay');
    ov.style.display = 'flex';
    document.getElementById('ch-overlay-title').textContent =
      `CRYPTO_HACK // ${cfg.gameName.toUpperCase()}`;

    if (!document.getElementById('ch-screen-code')) _build();
    _showScreen('ch-screen-code');
    _renderCodeSelect();
  }

  function close() {
    document.getElementById('ch-overlay').style.display = 'none';
    _stopHackAnim();
    if (cfg.onClose) cfg.onClose();
  }

  /* ─────────── Build HTML ─────────── */

  function _build() {
    document.getElementById('ch-wrap').innerHTML = `

<!-- CODE SELECT -->
<div id="ch-screen-code" class="ch-screen active">
  <div class="ch-logo">CRYPTO_HACK<span class="ch-blink">_</span></div>
  <div class="ch-tagline">IDENTIFY YOURSELF TO ENTER THE NETWORK</div>
  <div class="ch-divider">── ◈ ──</div>
  <div class="ch-code-cards" id="ch-code-cards"></div>
</div>

<!-- MAIN GAME -->
<div id="ch-screen-game" class="ch-screen">
  <div class="ch-hud">
    <div class="ch-hud-id">
      <span class="ch-hud-label">IDENTITY</span>
      <span id="ch-my-code">???</span>
    </div>
    <div class="ch-hud-stats">
      <div class="ch-stat">
        <span class="ch-stat-label">SCORE</span>
        <span class="ch-stat-val" id="ch-score">0</span>
      </div>
      <div class="ch-stat">
        <span class="ch-stat-label">MULT</span>
        <span class="ch-stat-val" id="ch-mult">×1</span>
      </div>
      <div class="ch-stat">
        <span class="ch-stat-label">HACKS</span>
        <span class="ch-stat-val" id="ch-hacks">0</span>
      </div>
      <div class="ch-stat">
        <span class="ch-stat-label">LIVES</span>
        <span class="ch-stat-val ch-lives-val" id="ch-lives">■■■</span>
      </div>
    </div>
    <div class="ch-q-count" id="ch-q-count">Q 1</div>
  </div>
  <div class="ch-q-wrap">
    <div class="ch-q-num" id="ch-q-num">&gt; QUERY_001</div>
    <div class="ch-q-text" id="ch-q-text"></div>
  </div>
  <div class="ch-answers" id="ch-answers"></div>
  <div class="ch-feedback" id="ch-feedback"></div>
</div>

<!-- REWARD PICK -->
<div id="ch-screen-reward" class="ch-screen">
  <div class="ch-reward-header">ACCESS GRANTED</div>
  <div class="ch-reward-pts" id="ch-reward-pts"></div>
  <div class="ch-reward-sub">SELECT YOUR REWARD</div>
  <div class="ch-reward-cards" id="ch-reward-cards"></div>
</div>

<!-- HACK SCREEN -->
<div id="ch-screen-hack" class="ch-screen">
  <div class="ch-hack-target" id="ch-hack-target"></div>
  <div class="ch-hack-terminal" id="ch-hack-terminal"></div>
  <div class="ch-hack-bar-wrap"><div class="ch-hack-bar" id="ch-hack-bar"></div></div>
  <div class="ch-hack-result" id="ch-hack-result"></div>
  <button class="ch-hack-continue" id="ch-hack-continue" onclick="CryptoHack._continueAfterHack()">CONTINUE &gt;&gt;</button>
</div>

<!-- GAME OVER -->
<div id="ch-screen-gameover" class="ch-screen">
  <div class="ch-go-skull">💀</div>
  <div class="ch-go-title">SESSION TERMINATED</div>
  <div class="ch-go-code" id="ch-go-code"></div>
  <div class="ch-go-stats" id="ch-go-stats"></div>
  <button class="ch-go-btn" onclick="CryptoHack._restart()">NEW SESSION</button>
  <button class="ch-go-btn ch-go-exit" onclick="CryptoHack.close()">EXIT NETWORK</button>
</div>
    `;
  }

  function _showScreen(id) {
    document.querySelectorAll('#ch-wrap .ch-screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  /* ─────────── Code Selection ─────────── */

  function _genCode() {
    const C = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    const seg = () => Array.from({length:3}, () => C[Math.floor(Math.random()*C.length)]).join('');
    return `${seg()}-${seg()}-${seg()}`;
  }

  function _renderCodeSelect() {
    const wrap = document.getElementById('ch-code-cards');
    wrap.innerHTML = '';
    [_genCode(), _genCode(), _genCode()].forEach(code => {
      const card = document.createElement('div');
      card.className = 'ch-code-card';
      card.innerHTML = `
        <div class="ch-code-icon">◈</div>
        <div class="ch-code-val">${code}</div>
        <div class="ch-code-label">PERSONAL_IDENTITY_KEY</div>
        <button class="ch-code-select" onclick="CryptoHack._selectCode('${code}')">[ SELECT ]</button>
      `;
      wrap.appendChild(card);
    });
  }

  function _selectCode(code) {
    st = {
      code,
      score      : 0,
      multiplier : 1,
      hacks      : 0,
      lives      : 3,
      qNum       : 0,
      pool       : _shuffle([...cfg.questions]),
      used       : [],
      answered   : false,
      gameOver   : false,
      pendingReward: null,
      hackAnim   : null,
    };
    document.getElementById('ch-my-code').textContent = code;
    _showScreen('ch-screen-game');
    _nextQuestion();
  }

  /* ─────────── Game Loop ─────────── */

  function _shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function _getQ() {
    if (st.used.length >= st.pool.length) {
      st.pool = _shuffle([...cfg.questions]);
      st.used = [];
    }
    let idx = 0;
    while (st.used.includes(idx) && idx < st.pool.length) idx++;
    st.used.push(idx);
    return st.pool[idx];
  }

  function _updateHUD() {
    document.getElementById('ch-score').textContent = st.score;
    document.getElementById('ch-mult').textContent  = `×${st.multiplier}`;
    document.getElementById('ch-hacks').textContent = st.hacks;
    document.getElementById('ch-lives').textContent = '■'.repeat(Math.max(0, st.lives));
  }

  function _nextQuestion() {
    if (st.gameOver) return;
    st.answered  = false;
    st.currentQ  = _getQ();
    st.qNum++;

    document.getElementById('ch-q-num').textContent =
      `> QUERY_${String(st.qNum).padStart(3, '0')}`;
    document.getElementById('ch-q-text').textContent = st.currentQ.q;
    document.getElementById('ch-q-count').textContent = `Q ${st.qNum}`;

    const fb = document.getElementById('ch-feedback');
    fb.textContent = '';
    fb.className = 'ch-feedback';

    const ans = document.getElementById('ch-answers');
    ans.innerHTML = '';
    const L = ['A','B','C','D'];
    st.currentQ.opts.forEach((opt, i) => {
      const btn = document.createElement('button');
      btn.className = 'ch-ans-btn';
      btn.innerHTML = `<span class="ch-ans-letter">${L[i]}</span>${opt}`;
      btn.addEventListener('click', () => _handleAnswer(i, btn));
      ans.appendChild(btn);
    });
    _updateHUD();
  }

  function _handleAnswer(chosen, btn) {
    if (st.answered || st.gameOver) return;
    st.answered = true;

    const buttons = document.querySelectorAll('#ch-answers .ch-ans-btn');
    buttons.forEach((b, i) => {
      b.disabled = true;
      if (i === st.currentQ.ans) b.classList.add('correct');
    });

    const fb = document.getElementById('ch-feedback');

    if (chosen === st.currentQ.ans) {
      btn.classList.add('correct');
      const pts = 10 * st.multiplier * st.qNum;
      st.score += pts;
      fb.textContent = `ACCESS GRANTED  +${pts} pts`;
      fb.className = 'ch-feedback ch-fb-ok';
      _updateHUD();
      setTimeout(() => _showRewardPick(pts), 1400);

    } else {
      btn.classList.add('wrong');
      st.lives--;
      fb.textContent = `INTRUSION DETECTED — WRONG`;
      fb.className = 'ch-feedback ch-fb-bad';
      _updateHUD();
      if (st.lives <= 0) {
        setTimeout(_gameOver, 1800);
      } else {
        setTimeout(_nextQuestion, 2000);
      }
    }
  }

  /* ─────────── Reward System ─────────── */

  function _showRewardPick(earnedPts) {
    _showScreen('ch-screen-reward');
    document.getElementById('ch-reward-pts').textContent = `+${earnedPts} pts`;

    /* Multiplier card: 65% boost, 35% divide — hidden until picked */
    const multIsBoost  = Math.random() < 0.65;
    const hackTarget   = NETWORK[Math.floor(Math.random() * NETWORK.length)];
    const bonusPts     = Math.floor(earnedPts * 1.8);

    st.pendingReward = { multIsBoost, hackTarget, bonusPts };

    /* The 3 reward options */
    const rewards = _shuffle([
      {
        type   : 'points',
        icon   : '💰',
        label  : `+${bonusPts} BONUS`,
        sub    : 'Guaranteed score boost',
        danger : false,
      },
      {
        type   : 'mult',
        icon   : multIsBoost ? '⚡' : '⚠',
        label  : multIsBoost ? 'MULTIPLIER ×UP' : 'MULTIPLIER ???',
        sub    : 'Unknown outcome — risk it',
        danger : !multIsBoost,
      },
      {
        type   : 'hack',
        icon   : '🔓',
        label  : 'HACK',
        sub    : `Target: ${hackTarget.name}`,
        danger : false,
      },
    ]);

    const cards = document.getElementById('ch-reward-cards');
    cards.innerHTML = '';
    rewards.forEach(r => {
      const card = document.createElement('div');
      card.className = 'ch-reward-card' + (r.danger ? ' ch-danger' : '');
      card.setAttribute('data-type', r.type);
      card.innerHTML = `
        <div class="ch-rc-icon">${r.icon}</div>
        <div class="ch-rc-label ${r.danger ? 'ch-danger-label' : ''}">${r.label}</div>
        <div class="ch-rc-sub ${r.danger ? 'ch-danger-sub' : ''}">${r.sub}</div>
      `;
      card.addEventListener('click', () => _applyReward(r.type));
      cards.appendChild(card);
    });
  }

  function _applyReward(type) {
    document.querySelectorAll('.ch-reward-card').forEach(c => c.style.pointerEvents = 'none');
    const chosen = document.querySelector(`.ch-reward-card[data-type="${type}"]`);
    if (chosen) chosen.classList.add('ch-rc-chosen');

    const { multIsBoost, hackTarget, bonusPts } = st.pendingReward;

    setTimeout(() => {
      if (type === 'points') {
        st.score += bonusPts;
        _updateHUD();
        _showScreen('ch-screen-game');
        _nextQuestion();

      } else if (type === 'mult') {
        if (multIsBoost) {
          st.multiplier++;
        } else {
          st.multiplier = Math.max(1, Math.floor(st.multiplier / 2));
        }
        _updateHUD();
        _showScreen('ch-screen-game');
        _nextQuestion();

      } else if (type === 'hack') {
        _showHackScreen(hackTarget);
      }
    }, 650);
  }

  /* ─────────── Hack Screen ─────────── */

  let _hackTimer = null;

  function _stopHackAnim() {
    if (_hackTimer) { clearTimeout(_hackTimer); _hackTimer = null; }
  }

  function _showHackScreen(target) {
    _showScreen('ch-screen-hack');
    _stopHackAnim();

    document.getElementById('ch-hack-target').innerHTML = `
      <span class="ch-ht-label">▶ TARGET LOCKED</span>
      <span class="ch-ht-code">${target.code}</span>
      <span class="ch-ht-name">${target.name}</span>
      <span class="ch-ht-score">NETWORK SCORE: ${target.score}</span>
    `;

    const terminal = document.getElementById('ch-hack-terminal');
    const bar      = document.getElementById('ch-hack-bar');
    const result   = document.getElementById('ch-hack-result');
    const contBtn  = document.getElementById('ch-hack-continue');

    terminal.innerHTML = '';
    bar.style.width    = '0%';
    result.innerHTML   = '';
    contBtn.style.display = 'none';

    const stolen  = Math.floor(target.score * (0.2 + Math.random() * 0.15));
    const lines   = HACK_LINES.map(fn => fn(target));
    const total   = lines.length;
    let i = 0;

    const step = () => {
      if (i >= total) {
        st.hacks++;
        st.score += stolen;
        _updateHUD();
        result.innerHTML =
          `<span class="ch-hack-success">BREACH SUCCESSFUL</span>` +
          `Extracted <strong>+${stolen} pts</strong> from ${target.name}`;
        contBtn.style.display = 'block';
        return;
      }
      const line = document.createElement('div');
      line.className = 'ch-terminal-line' + (lines[i].startsWith('>') ? '' : ' ch-t-dim');
      line.textContent = lines[i];
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
      bar.style.width = `${Math.round(((i + 1) / total) * 100)}%`;
      i++;
      _hackTimer = setTimeout(step, i === total ? 300 : 210);
    };
    step();
  }

  function _continueAfterHack() {
    _stopHackAnim();
    _showScreen('ch-screen-game');
    _nextQuestion();
  }

  /* ─────────── Game Over ─────────── */

  function _gameOver() {
    st.gameOver = true;
    if(typeof awardGameRewards==='function' && st.score > 0){ awardGameRewards('crypto-hack', { score: st.score, perfect: st.lives === 3 }); }
    _showScreen('ch-screen-gameover');

    document.getElementById('ch-go-code').textContent = `ID: ${st.code}`;
    document.getElementById('ch-go-stats').innerHTML = `
      <div class="ch-go-row">
        <span class="ch-go-row-label">FINAL SCORE</span>
        <span class="ch-go-row-val">${st.score}</span>
      </div>
      <div class="ch-go-row">
        <span class="ch-go-row-label">QUESTIONS</span>
        <span class="ch-go-row-val">${st.qNum}</span>
      </div>
      <div class="ch-go-row">
        <span class="ch-go-row-label">PEAK MULTIPLIER</span>
        <span class="ch-go-row-val">×${st.multiplier}</span>
      </div>
      <div class="ch-go-row">
        <span class="ch-go-row-label">SUCCESSFUL HACKS</span>
        <span class="ch-go-row-val">${st.hacks}</span>
      </div>
    `;
  }

  function _restart() {
    _showScreen('ch-screen-code');
    _renderCodeSelect();
  }

  /* ─────────── Expose ─────────── */
  return {
    open, close,
    _selectCode, _continueAfterHack, _restart,
  };

})();
