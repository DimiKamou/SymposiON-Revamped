/* ════════════════════════════════════════════════════════════════════
   Συμπόσιον — app.js  (host controller)
   Wires setup screen → BoardGameEngine hooks → quiz modal → card
   picker → teleport chooser → win screen. Persists theme + save.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const engine = new window.BoardGameEngine();

  // ── Setup state ───────────────────────────────────────────────
  let _players    = [];           // [{name, tokenIndex}]
  let _winMode    = 'laurels';
  let _length     = 'normal';
  let _customVal  = null;
  let _godPickFor = null;         // player index currently picking a token
  let _tpChoice   = null;         // {targetId, subjectId} for portal event
  let _tpResolve  = null;

  // ── Die state ─────────────────────────────────────────────────
  let _dieRotX = 0, _dieRotY = 0;

  // Die face layout: opposite faces sum to 7
  // front=1, right=2, top=3, bottom=4, left=5, back=6
  const _FACE_OFFSET = {
    1: [0,   0],   // front — no rotation needed
    2: [0,  -90],  // bring f-right (rotY+90) to front: rotate container -90
    3: [-90, 0],   // bring f-top (rotX+90) to front: rotate container -90
    4: [ 90, 0],   // bring f-bottom (rotX-90) to front: rotate container +90
    5: [0,  90],   // bring f-left (rotY-90) to front: rotate container +90
    6: [0, 180],   // bring f-back (rotY+180) to front: rotate container 180
  };
  const _PIP = {
    1: [4],
    2: [2, 6],
    3: [2, 4, 6],
    4: [0, 2, 6, 8],
    5: [0, 2, 4, 6, 8],
    6: [0, 3, 6, 2, 5, 8],
  };

  // ── Theme ─────────────────────────────────────────────────────
  window.setTheme = function (cls) {
    document.body.classList.remove('theme-hearth','theme-marble','theme-amphora','theme-aegean');
    document.body.classList.add(cls);
    engine.theme = cls;
    document.querySelectorAll('.theme-opt').forEach(b =>
      b.classList.toggle('theme-opt--active', b.dataset.theme === cls));
    try { localStorage.setItem('symposion.theme', cls); } catch (_) {}
  };

  // ── Sound button ──────────────────────────────────────────────
  function _initSoundBtn() {
    const btn = document.getElementById('btn-sound');
    if (!btn) return;
    const update = () => { btn.style.opacity = window.SYM_SOUND.on ? '1' : '.4'; };
    btn.onclick = () => { window.SYM_SOUND.toggle(); update(); };
    update();
  }

  // ── Theme picker toggle ───────────────────────────────────────
  document.getElementById('btn-theme').addEventListener('click', function (e) {
    e.stopPropagation();
    document.getElementById('theme-panel').classList.toggle('open');
  });
  document.addEventListener('click', () =>
    document.getElementById('theme-panel').classList.remove('open'));

  // ── Setup screen ──────────────────────────────────────────────
  window.showSetup = function () {
    document.getElementById('setup-scrim').classList.add('open');
    document.getElementById('btn-continue').style.display =
      window.BoardGameEngine.hasSave() ? '' : 'none';
    _renderSetup();
  };

  function _renderSetup() {
    const cfg = window.BOARD_CONFIG;
    const n   = _players.length || 2;

    // Sync player array length
    while (_players.length < n) {
      const i = _players.length;
      _players.push({ name: cfg.tokens[i % cfg.tokens.length].god, tokenIndex: i % cfg.tokens.length });
    }
    _players = _players.slice(0, n);

    // Player count buttons
    const countRow = document.getElementById('setup-count-row');
    countRow.innerHTML = '';
    [2,3,4,5,6,7,8].forEach(k => {
      const btn = document.createElement('button');
      btn.className = 'count-btn' + (k === n ? ' count-btn--active' : '');
      btn.textContent = k;
      btn.onclick = () => {
        _players = _players.slice(0, k);
        while (_players.length < k) {
          const i = _players.length;
          _players.push({ name: cfg.tokens[i % cfg.tokens.length].god, tokenIndex: i % cfg.tokens.length });
        }
        _renderSetup();
      };
      countRow.appendChild(btn);
    });

    // Player rows
    const rows = document.getElementById('setup-player-rows');
    rows.innerHTML = '';
    _players.forEach((p, idx) => {
      const tok = cfg.tokens[p.tokenIndex];
      const row = document.createElement('div');
      row.className = 'player-row';
      row.style.setProperty('--player', tok.color);
      row.innerHTML = `
        <div class="player-token-pick">
          <div class="pick-coin" style="--player:${tok.color}" onclick="openGodPicker(${idx})"
               title="Αλλαγή θεού">${window.symIcon(tok.animal)}</div>
        </div>
        <div class="player-name-block">
          <input class="player-name" type="text" value="${_esc(p.name)}" maxlength="24"
            style="background:none;border:none;outline:none;width:100%"
            oninput="_players[${idx}].name=this.value">
          <div class="player-god">${tok.god} · ${tok.en}</div>
        </div>
        <button class="player-cycle" onclick="cycleToken(${idx})">Ἄλλος →</button>`;
      rows.appendChild(row);
    });

    // Win mode buttons
    const wmRow = document.getElementById('setup-winmode-row');
    wmRow.innerHTML = '';
    Object.values(cfg.winModes).forEach(m => {
      const btn = document.createElement('button');
      btn.className = 'winmode-btn' + (m.id === _winMode ? ' winmode-btn--active' : '');
      btn.innerHTML = `
        <div class="winmode-ico">${window.symIcon(m.icon)}</div>
        <div class="winmode-name">${m.label}</div>
        <div class="winmode-en">${m.en}</div>`;
      btn.onclick = () => { _winMode = m.id; _renderSetup(); };
      wmRow.appendChild(btn);
    });

    // Length buttons
    const mode = cfg.winModes[_winMode];
    const lenRow = document.getElementById('setup-length-row');
    lenRow.innerHTML = '';
    cfg.lengths.forEach(len => {
      const btn = document.createElement('button');
      btn.className = 'count-btn lenbtn' + (len.id === _length ? ' count-btn--active' : '');
      btn.innerHTML = `<span class="lenbtn-name">${len.label}</span><span class="lenbtn-target">${mode.targets[len.id]} ${mode.unit}</span>`;
      btn.onclick = () => { _length = len.id; _customVal = null;
        document.getElementById('setup-custom-wrap').style.display = 'none'; _renderSetup(); };
      lenRow.appendChild(btn);
    });
    // Custom length button
    const custBtn = document.createElement('button');
    custBtn.className = 'count-btn lenbtn lenbtn--custom' + (_length === 'custom' ? ' count-btn--active' : '');
    custBtn.innerHTML = `<span class="lenbtn-name">Ἴδιο</span><span class="lenbtn-target">${_customVal ?? mode.custom.def} ${mode.unit}</span>`;
    custBtn.onclick = () => {
      _length = 'custom';
      if (_customVal == null) _customVal = mode.custom.def;
      const r = document.getElementById('setup-custom-range');
      r.min = mode.custom.min; r.max = mode.custom.max; r.step = mode.custom.step; r.value = _customVal;
      document.getElementById('setup-custom-val').textContent = _customVal;
      document.getElementById('setup-custom-unit').textContent = mode.unit;
      document.getElementById('setup-custom-wrap').style.display = '';
      _renderSetup();
    };
    lenRow.appendChild(custBtn);

    // Custom stepper sync
    if (_length === 'custom') {
      document.getElementById('setup-custom-wrap').style.display = '';
      document.getElementById('setup-custom-val').textContent = _customVal ?? mode.custom.def;
      document.getElementById('setup-custom-unit').textContent = mode.unit;
      const r = document.getElementById('setup-custom-range');
      r.min = mode.custom.min; r.max = mode.custom.max;
      r.step = mode.custom.step; r.value = _customVal ?? mode.custom.def;
    }

    // Goal banner
    const target = _resolveTarget();
    document.getElementById('setup-goal-icon').textContent = _modeEmoji(_winMode);
    document.getElementById('setup-goal-text').innerHTML = mode.desc.replace(
      mode.unit, `<b>${target} ${mode.unit}</b>`);
    document.getElementById('setup-goal-desc').textContent = '';
    document.getElementById('win-goal-badge').textContent = `${target} ${mode.unit}`;
  }

  function _resolveTarget() {
    const mode = window.BOARD_CONFIG.winModes[_winMode];
    return _length === 'custom' ? (_customVal ?? mode.custom.def) : mode.targets[_length];
  }

  function _modeEmoji(id) {
    return ({ laurels:'🏆', wealth:'🪙', marathon:'🏛', polymath:'🦉', streak:'⚡', glory:'⭐' })[id] || '🏆';
  }

  window.cycleToken = function (idx) {
    const cfg = window.BOARD_CONFIG;
    const used = _players.map((p, i) => i !== idx ? p.tokenIndex : -1).filter(x => x >= 0);
    let next = (_players[idx].tokenIndex + 1) % cfg.tokens.length;
    for (let t = 0; t < cfg.tokens.length && used.includes(next); t++)
      next = (next + 1) % cfg.tokens.length;
    _players[idx].tokenIndex = next;
    _players[idx].name = cfg.tokens[next].god;
    _renderSetup();
  };

  window.openGodPicker = function (idx) {
    _godPickFor = idx;
    const cfg = window.BOARD_CONFIG;
    const used = _players.map((p, i) => i !== idx ? p.tokenIndex : -1).filter(x => x >= 0);
    const grid = document.getElementById('god-grid');
    grid.innerHTML = '';
    cfg.tokens.forEach((tok, ti) => {
      const btn = document.createElement('button');
      btn.className = 'god-pick' + (ti === _players[idx].tokenIndex ? ' god-pick--current' : '');
      btn.style.setProperty('--player', tok.color);
      btn.disabled = used.includes(ti);
      btn.innerHTML = `
        <div class="god-pick-coin">${window.symIcon(tok.animal)}</div>
        <div class="god-pick-name">${tok.god}</div>
        <div class="god-pick-en">${tok.en}</div>`;
      btn.onclick = () => {
        _players[_godPickFor].tokenIndex = ti;
        _players[_godPickFor].name = tok.god;
        document.getElementById('scrim-gods').classList.remove('open');
        _renderSetup();
      };
      grid.appendChild(btn);
    });
    document.getElementById('scrim-gods').classList.add('open');
  };

  window.stepCustom = function (d) {
    const m = window.BOARD_CONFIG.winModes[_winMode].custom;
    _customVal = Math.max(m.min, Math.min(m.max, (_customVal ?? m.def) + d * m.step));
    _renderSetup();
  };
  window.syncCustom = function (v) {
    _customVal = Number(v);
    document.getElementById('setup-custom-val').textContent = v;
    _renderSetup();
  };

  // ── Start / Continue ──────────────────────────────────────────
  window.startGame = function () {
    document.getElementById('setup-scrim').classList.remove('open');
    window.BoardGameEngine.clearSave();
    _launch();
  };

  window.continueGame = function () {
    const snap = window.BoardGameEngine.loadSnapshot();
    if (!snap) { window.startGame(); return; }
    document.getElementById('setup-scrim').classList.remove('open');
    const mount = document.getElementById('board-wrap');
    mount.innerHTML = '';
    engine.deserialize(snap, mount);
    _injectHub();
    _wireHooks();
    _update(engine.pm.players, engine.pm.currentPlayer());
  };

  function _launch() {
    const cfg    = window.BOARD_CONFIG;
    const target = _resolveTarget();
    const mount  = document.getElementById('board-wrap');
    mount.innerHTML = '';
    engine.init(_players, cfg, mount, { mode: _winMode, target });
    _injectHub();
    _wireHooks();
  }

  // ── Hub / Die ─────────────────────────────────────────────────
  function _injectHub() {
    _dieRotX = 0; _dieRotY = 0;
    const hub = engine.boardGen.hubEl;
    hub.innerHTML = `
      <div class="hub-emblem">ΣΥΜΠΟΣΙΟΝ</div>
      <div class="hub-meander"></div>
      <div class="hub-turn" id="hub-turn">
        <b id="hub-player-name">—</b>
        <small id="hub-player-god"></small>
      </div>
      <div class="die-area">
        <div class="die-shadow"></div>
        <div class="die-stage ready" id="die-stage">
          <div class="die3d" id="die3d">${_buildDie()}</div>
        </div>
      </div>
      <div class="die-hint" id="die-hint">Ρίξε τὸ ζάρι</div>`;
    _initDiceInteraction();
  }

  function _buildDie() {
    return ['f-front','f-back','f-right','f-left','f-top','f-bottom'].map(cls => {
      const val = { 'f-front':1,'f-back':6,'f-right':2,'f-left':5,'f-top':3,'f-bottom':4 }[cls];
      const pips = Array.from({length:9}, (_,i) =>
        `<div class="pip${_PIP[val].includes(i)?' on':''}"></div>`).join('');
      return `<div class="die-face ${cls}">${pips}</div>`;
    }).join('');
  }

  function _showDieValue(v) {
    const die3d = document.getElementById('die3d');
    if (!die3d) return;
    const [offX, offY] = _FACE_OFFSET[v];
    // Add 2-3 full spins + target face offset
    const spinX = (2 + Math.floor(Math.random() * 2)) * 360 + offX;
    const spinY = (2 + Math.floor(Math.random() * 2)) * 360 + offY;
    _dieRotX += spinX;
    _dieRotY += spinY;
    die3d.style.transition = 'transform .9s cubic-bezier(.15,.7,.2,1)';
    die3d.style.transform  = `rotateX(${_dieRotX}deg) rotateY(${_dieRotY}deg)`;
  }

  function _initDiceInteraction() {
    const stage = document.getElementById('die-stage');
    if (!stage) return;
    let dragging = false, startX = 0, startY = 0;
    stage.addEventListener('pointerdown', e => {
      stage.classList.add('held');
      stage.setPointerCapture(e.pointerId);
      startX = e.clientX; startY = e.clientY; dragging = false;
    });
    stage.addEventListener('pointermove', e => {
      if (Math.abs(e.clientX - startX) > 6 || Math.abs(e.clientY - startY) > 6) dragging = true;
    });
    stage.addEventListener('pointerup', () => {
      stage.classList.remove('held');
      _tryRoll();
    });
  }

  function _tryRoll() {
    if (!engine.fsm || !engine.fsm.is('IDLE')) return;
    window.SYM_SOUND.dice();
    engine.rollDice();
  }

  // ── Engine hooks ──────────────────────────────────────────────
  function _wireHooks() {
    engine.hooks.onDice = async (value, _player) => {
      _showDieValue(value);
      _setHint(value + ' βήματα');
      await _wait(700);
    };

    engine.hooks.onLand = (tile, _player) => {
      if (tile.type === 'subject') window.SYM_SOUND.chime();
      else if (tile.type === 'event')  window.SYM_SOUND.event();
      else if (tile.type === 'jail')   window.SYM_SOUND.jail();
      else if (tile.type === 'corner') window.SYM_SOUND.bonus();
    };

    engine.hooks.onQuestion = (q, subject, player) => _showQuiz(q, subject, player);

    engine.hooks.onQuestionResult = (correct) => {
      if (correct) window.SYM_SOUND.correct();
      else         window.SYM_SOUND.wrong();
    };

    engine.hooks.onChooseCard = (choices, player) => _showCards(choices, player);

    engine.hooks.onChooseTeleport = (player, allPlayers, subjects) =>
      _showTeleport(player, allPlayers, subjects);

    engine.hooks.onLog = (html, kind) => _addLog(html, kind);

    engine.hooks.onUpdate = (players, cur) => _update(players, cur);

    engine.hooks.onTurn = (player, isReroll) => _onTurn(player, isReroll);

    engine.hooks.onState = (to) => {
      const stage = document.getElementById('die-stage');
      if (!stage) return;
      stage.classList.toggle('ready', to === 'IDLE');
      if (to === 'IDLE') _setHint('Ρίξε τὸ ζάρι');
      else if (to !== 'ROLLING') _setHint('');
    };

    engine.hooks.onWin = (player, quote) => _showWin(player, quote);

    engine.hooks.onSuddenDeath = (newTarget, leaders) => {
      const toast = document.getElementById('sd-toast');
      document.getElementById('sd-toast-title').textContent =
        'Ἰσοπαλία: ' + leaders.map(p => p.name).join(' & ');
      document.getElementById('sd-toast-sub').textContent = `Νέος στόχος: ${newTarget}`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 4000);
    };
  }

  function _setHint(txt) {
    const el = document.getElementById('die-hint');
    if (el) el.textContent = txt;
  }

  // ── Turn update ───────────────────────────────────────────────
  function _onTurn(player, isReroll) {
    const nameEl = document.getElementById('hub-player-name');
    const godEl  = document.getElementById('hub-player-god');
    if (nameEl) { nameEl.textContent = player.name; nameEl.style.color = player.color; }
    if (godEl)  godEl.textContent = isReroll ? 'ξαναρίχνει…' : player.god;
    document.getElementById('stage').style.setProperty('--turn-color', player.color);
  }

  // ── Scoreboard ────────────────────────────────────────────────
  function _update(players, cur) {
    const list = document.getElementById('score-list');
    if (!list) return;
    const cfg    = window.BOARD_CONFIG;
    const sorted = players.slice().sort((a, b) => b.score - a.score || b.coins - a.coins);
    list.innerHTML = sorted.map(p => {
      const tok     = cfg.tokens[p.tokenIndex];
      const active  = p === cur;
      const laurels = p.score > 0
        ? Array(Math.min(p.score, 12)).fill('⊛').join('')
        : '<span class="laurels-empty">—</span>';
      return `<div class="score-card${active ? ' score-card--active' : ''}" style="--player:${p.color}">
        <div class="score-coin">${window.symIcon(tok.animal)}</div>
        <div class="score-meta">
          <div class="score-name">${_esc(p.name)}</div>
          <div class="score-god">${tok.god}</div>
        </div>
        <div class="score-stats">
          <div class="score-laurels">${laurels}</div>
          <div class="score-primary"><span class="stat-coins">${p.coins}</span><span class="stat-unit">δρ.</span></div>
          ${p.laps  > 0 ? `<div><span class="stat-laps">${p.laps}</span><span class="stat-unit">γύρ.</span></div>` : ''}
          ${p.streak > 1 ? `<div><span class="stat-streak">${p.streak}×</span><span class="stat-unit">σερί</span></div>` : ''}
        </div>
      </div>`;
    }).join('');
  }

  // ── Log feed ──────────────────────────────────────────────────
  function _addLog(html, kind) {
    const feed = document.getElementById('log-feed');
    if (!feed) return;
    const item = document.createElement('div');
    item.className = `log-item log-item--${kind || 'info'}`;
    item.innerHTML = html;
    feed.appendChild(item);
    while (feed.children.length > 80) feed.removeChild(feed.firstChild);
    feed.scrollTop = feed.scrollHeight;
  }

  // ── Quiz modal ────────────────────────────────────────────────
  let _quizResolve = null, _quizTimer = null;

  function _showQuiz(q, subject, player) {
    return new Promise(resolve => {
      _quizResolve = resolve;
      document.getElementById('quiz-bar').style.background = subject.color;
      document.getElementById('quiz-glyph').textContent    = subject.glyph;
      document.getElementById('quiz-subject-label').textContent = `${subject.label} · ${subject.en}`;
      document.getElementById('quiz-question').textContent = q.q;
      document.getElementById('quiz-note').textContent     = '';

      const opts  = document.getElementById('quiz-options');
      opts.innerHTML = '';
      const keys  = ['Α','Β','Γ','Δ'];
      q.opts.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.className = 'option';
        btn.innerHTML = `<span class="option__key">${keys[i]}</span><span>${_esc(opt)}</span>`;
        btn.onclick = () => _answerQuiz(i, q);
        opts.appendChild(btn);
      });

      // Timer (30s minus any curse penalty)
      let secs = 30 - (player.timePenalty || 0);
      const timerEl   = document.getElementById('quiz-secs');
      const timerWrap = document.getElementById('quiz-timer-wrap');
      timerEl.textContent = secs;
      timerWrap.className = 'quiz-timer' + (player.timePenalty ? ' quiz-timer--cursed' : '');
      clearInterval(_quizTimer);
      _quizTimer = setInterval(() => {
        secs--;
        timerEl.textContent = Math.max(0, secs);
        if (secs <= 0) { clearInterval(_quizTimer); _answerQuiz(-1, q); }
      }, 1000);

      document.getElementById('modal-quiz').style.setProperty('--accent', subject.color);
      document.getElementById('scrim-quiz').classList.add('open');
    });
  }

  function _answerQuiz(choice, q) {
    if (!_quizResolve) return;
    clearInterval(_quizTimer);
    document.querySelectorAll('#quiz-options .option').forEach((btn, i) => {
      btn.disabled = true;
      if (i === q.ans) btn.classList.add('option--correct');
      else if (i === choice) btn.classList.add('option--wrong');
    });
    if (q.note) document.getElementById('quiz-note').textContent = q.note;
    const res = _quizResolve; _quizResolve = null;
    setTimeout(() => {
      document.getElementById('scrim-quiz').classList.remove('open');
      res(choice);
    }, choice === -1 ? 300 : 1200);
  }

  // ── Card picker ───────────────────────────────────────────────
  let _cardResolve = null;

  function _showCards(choices, player) {
    return new Promise(resolve => {
      _cardResolve = resolve;
      document.getElementById('card-pick-title').textContent = `${_esc(player.name)} — διάλεξε κάρτα`;
      const row  = document.getElementById('card-row');
      row.innerHTML = '';
      let picked = false;

      const toneColor = t => ({
        good:'var(--sym-sage)', warn:'var(--sym-terra)',
        strike:'var(--sym-terra-dk)', choice:'var(--sym-gold)'
      })[t] || 'var(--sym-gold)';

      const toneLabel = t => ({
        good:'Εὐτυχία', warn:'Δοκιμασία', strike:'Κτύπημα', choice:'Ἐπιλογή'
      })[t] || 'Τύχη';

      choices.forEach((ev, idx) => {
        const card = document.createElement('button');
        card.className = 'card3';
        card.style.setProperty('--tone', toneColor(ev.tone));
        card.innerHTML = `
          <div class="card3-inner">
            <div class="card3-face card3-back">
              <div class="card3-back-frame">
                <div class="card3-back-emblem">${window.symIcon('lyre')}</div>
                <div class="card3-back-label">ΤΥΧΗ</div>
              </div>
            </div>
            <div class="card3-face card3-front">
              <div class="card3-eyebrow">${toneLabel(ev.tone)}</div>
              <div class="card3-ico">${window.symIcon(ev.icon)}</div>
              <div class="card3-title">${_esc(ev.title)}</div>
              <div class="card3-text">${_esc(ev.text)}</div>
            </div>
          </div>`;
        card.addEventListener('mouseenter', () => { if (!picked) card.classList.add('card3--flipped'); });
        card.addEventListener('mouseleave', () => {
          if (!picked && !card.classList.contains('card3--chosen'))
            card.classList.remove('card3--flipped');
        });
        card.onclick = () => {
          if (picked) return; picked = true;
          card.classList.add('card3--flipped','card3--chosen');
          choices.forEach((_, i) => { if (i !== idx) row.children[i].classList.add('card3--faded'); });
          window.SYM_SOUND.event();
          const res = _cardResolve; _cardResolve = null;
          setTimeout(() => {
            document.getElementById('scrim-cards').classList.remove('open');
            res(ev);
          }, 900);
        };
        row.appendChild(card);
      });
      document.getElementById('scrim-cards').classList.add('open');
    });
  }

  // ── Teleport chooser ──────────────────────────────────────────
  function _showTeleport(player, allPlayers, subjects) {
    return new Promise(resolve => {
      _tpResolve = resolve;
      _tpChoice  = { targetId: player.id, subjectId: null };

      const targEl = document.getElementById('tp-targets');
      targEl.innerHTML = '';
      allPlayers.forEach(p => {
        const tok = window.BOARD_CONFIG.tokens[p.tokenIndex];
        const btn = document.createElement('button');
        btn.className = 'tp-target' + (p.id === player.id ? ' tp-target--on' : '');
        btn.style.setProperty('--player', p.color);
        btn.innerHTML = `
          <div class="tp-coin">${window.symIcon(tok.animal)}</div>
          <div class="tp-tname">${_esc(p.name)}</div>
          <div class="tp-trole">${p === player ? 'εσύ' : 'ἀντίπαλος'}</div>`;
        btn.onclick = () => {
          _tpChoice.targetId = p.id;
          targEl.querySelectorAll('.tp-target').forEach(b => b.classList.remove('tp-target--on'));
          btn.classList.add('tp-target--on');
          _updateTpBtn();
        };
        targEl.appendChild(btn);
      });

      const subjEl = document.getElementById('tp-subjects');
      subjEl.innerHTML = '';
      Object.values(subjects).forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'tp-subject';
        btn.style.setProperty('--accent', s.color);
        btn.innerHTML = `<span class="tp-glyph">${s.glyph}</span><span class="tp-sname">${s.label}</span>`;
        btn.onclick = () => {
          _tpChoice.subjectId = s.id;
          subjEl.querySelectorAll('.tp-subject').forEach(b => b.classList.remove('tp-subject--on'));
          btn.classList.add('tp-subject--on');
          _updateTpBtn();
        };
        subjEl.appendChild(btn);
      });

      document.getElementById('btn-tp-confirm').disabled = true;
      document.getElementById('scrim-teleport').classList.add('open');
    });
  }

  function _updateTpBtn() {
    document.getElementById('btn-tp-confirm').disabled = !_tpChoice || !_tpChoice.subjectId;
  }

  window.confirmTeleport = function () {
    if (!_tpResolve || !_tpChoice?.subjectId) return;
    const res = _tpResolve; _tpResolve = null;
    document.getElementById('scrim-teleport').classList.remove('open');
    res(_tpChoice);
  };

  // ── Win screen ────────────────────────────────────────────────
  function _showWin(player, quote) {
    window.SYM_SOUND.win();
    document.getElementById('win-laurel-icon').innerHTML = window.symIcon('laurel');
    document.getElementById('win-player-name').textContent = `${_esc(player.name)} νικᾶ!`;
    document.getElementById('win-quote').textContent  = quote || '';
    document.getElementById('win-stats').textContent  = `${player.score} δάφνες · ${player.coins} δρ.`;
    document.getElementById('scrim-win').classList.add('open');
  }

  // ── Utilities ─────────────────────────────────────────────────
  function _wait(ms) { return new Promise(r => setTimeout(r, ms)); }
  function _esc(s) {
    return String(s ?? '')
      .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── Bootstrap ─────────────────────────────────────────────────
  function _init() {
    // Restore saved theme
    try {
      const t = localStorage.getItem('symposion.theme');
      if (t) window.setTheme(t);
    } catch (_) {}

    _initSoundBtn();

    // Seed default players
    if (!_players.length) {
      const cfg = window.BOARD_CONFIG;
      _players = [0,1].map(i => ({ name: cfg.tokens[i].god, tokenIndex: i }));
    }

    window.showSetup();
  }

  if (document.readyState === 'loading')
    document.addEventListener('DOMContentLoaded', _init);
  else
    _init();

})();
