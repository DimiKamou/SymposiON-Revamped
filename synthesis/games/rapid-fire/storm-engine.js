// ============================================================
//  ΚΑΤΑΙΓΙΣΜΟΣ (Kataigismos) · Reimagined — engine
//  Drop-in for the old Rapid Fire. Public globals kept intact:
//      window.openRapidFire(cfg) / window.closeRapidFire()
//      window.RF_PACKS  (GP bridge still pushes a `_gp` pack)
//      window._rf       / window._rfBegin() / window._rfSetLang(lang)
//
//  Spine — "The Gathering Storm":
//   · ONE storm clock (the player CHOOSES its length, up to 60 s) drains
//     in real time; questions are INFINITE. Correct answers strike
//     lightning and add time; wrong answers / stalling bleed the clock.
//   · Streaks build CHARGE → ΚΑΤΑΙΓΙΔΑ (Overdrive): ×2 + half-speed drain.
//   · Content loads from ANY class via StormContent (live GP_DATASETS).
//   · Question FORMAT is randomised each round: πολλαπλή επιλογή /
//     Σωστό-Λάθος / Αντιστοίχιση / Σωστή σειρά — for more intensity.
//
//  Depends on: storm-arena.js, storm-audio.js, storm-content.js
//  (+ storm-data.js providing RF_SOURCES/RF_PACKS in the preview).
// ============================================================
(function () {
  const LS = 'kataigismos_v2';
  // The Games-Panel `_gp` bridge in nav.js pushes onto window.RF_PACKS and bails
  // if it's undefined — guarantee it exists so one-click GP launches still feed in.
  window.RF_PACKS = window.RF_PACKS || [];

  // intensity profiles — drain/s, time-gift, penalty, speed-ref (clock comes from the timer picker)
  const DIFF = {
    mild:   { drain: 1.00, add: 2.6, pen: 3.0, ref: 4.2, label: 'Ήπια' },
    normal: { drain: 1.05, add: 2.2, pen: 3.5, ref: 3.6, label: 'Κανονική' },
    fierce: { drain: 1.20, add: 1.9, pen: 4.0, ref: 3.0, label: 'Σφοδρή' },
  };
  const TIMERS = [20, 30, 45, 60];
  const OD_DURATION = 9, OD_DRAIN_MUL = 0.5;

  const _rf = window._rf || (window._rf = {});
  Object.assign(_rf, { pack: _rf.pack || null, lang: _rf.lang || 'gr' });

  let arena = null, cdArena = null, keyHandler = null;

  const loadPrefs = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } };
  const savePrefs = p => { try { localStorage.setItem(LS, JSON.stringify(p)); } catch (e) {} };
  const T = (gr, en) => (_rf.lang === 'en' ? en : gr);

  // ── open / close (drop-in) ───────────────────────────────
  window.openRapidFire = function (cfg) {
    const ov = document.getElementById('rf-overlay');
    if (ov) { ov.style.display = 'flex'; ov.classList.add('active'); }
    document.body.style.overflow = 'hidden';

    // Games-Panel "Launch with data": a normalised bank arrives via cfg.G
    // (or window._gpPendingConfig). Skip the lobby and play it directly.
    const gp = (cfg && Array.isArray(cfg.G) && cfg.G.length) ? cfg
      : (window._gpPendingConfig && window._gpPendingConfig.engineId === 'rapid-fire'
         && Array.isArray(window._gpPendingConfig.G) && window._gpPendingConfig.G.length ? window._gpPendingConfig : null);
    if (gp) {
      const p = loadPrefs();
      _rf.lang = gp.lang || _rf.lang;
      _rf.diff = DIFF[p.diff] ? p.diff : 'normal';
      _rf.timer = TIMERS.includes(p.timer) ? p.timer : 30;
      _rf.muted = !!p.muted;
      if (window.StormAudio) window.StormAudio.setMuted(_rf.muted);
      _rf.source = { id: gp.datasetId || '_gp', label: gp.datasetLabel || gp.title || 'GP', _src: { kind: 'gpbank', items: gp.G } };
      _rf.level = null;
      return _rfBegin();
    }
    renderLobby();
  };
  window.closeRapidFire = function () {
    const ov = document.getElementById('rf-overlay');
    if (ov) { ov.style.display = 'none'; ov.classList.remove('active'); }
    document.body.style.overflow = '';
    teardown();
  };
  window._rfSetLang = function (l) { _rf.lang = l; };

  function teardown() {
    // invalidate any in-flight async pool load (Firestore fetch) so a stale
    // result can't resume into a closed/replaced screen
    _rf._loadToken = (_rf._loadToken || 0) + 1;
    if (_rf.raf) cancelAnimationFrame(_rf.raf), (_rf.raf = null);
    if (_rf._to) clearTimeout(_rf._to);
    removeKeys();
    if (arena) { arena.stop(); arena = null; }
    if (cdArena) { cdArena.stop(); cdArena = null; }
    if (window.StormAudio) { window.StormAudio.overdriveEnd(); window.StormAudio.stopRain(); }
  }

  // ── LOBBY ────────────────────────────────────────────────
  function renderLobby() {
    teardown();
    const p = loadPrefs();
    _rf.diff = DIFF[p.diff] ? p.diff : 'normal';
    _rf.timer = TIMERS.includes(p.timer) ? p.timer : 30;
    _rf.muted = !!p.muted;
    if (window.StormAudio) window.StormAudio.setMuted(_rf.muted);

    const groups = window.StormContent ? window.StormContent.getSourceGroups(_rf.lang) : [];
    const keepId = _rf.source && _rf.source.id;  // preserve selection when returning from level select

    const wrap = document.getElementById('rf-wrap');
    wrap.innerHTML = `
    <div class="sf-screen sf-lobby active" id="rf-screen-menu">
      <div class="sf-l-inner">
        <div class="sf-l-kicker">RAPID FIRE · REIMAGINED</div>
        <h1 class="sf-l-title">Καταιγισμός</h1>
        <div class="sf-l-en">The Gathering Storm</div>
        <p class="sf-l-sub">Διάλεξε ύλη από <strong>οποιαδήποτε τάξη</strong>, όρισε τον χρόνο και κράτα την καταιγίδα ζωντανή. Άπειρες ερωτήσεις — εναλλασσόμενοι τύποι.</p>

        <div class="sf-l-label">Διάλεξε ύλη <span class="sf-l-label-hint">— όλες οι τάξεις &amp; η θεωρία</span></div>
        <div class="sf-src-search">
          <input id="sf-src-q" type="text" placeholder="${T('Αναζήτηση ύλης…', 'Search content…')}" autocomplete="off"/>
        </div>
        <div class="sf-sources" id="sf-sources">${renderGroups(groups)}</div>

        <div class="sf-set-grid2">
          <div class="sf-set-row">
            <div class="sf-l-label">Χρόνος καταιγίδας</div>
            <div class="sf-seg" data-set="timer">
              ${TIMERS.map(s => `<button data-v="${s}">${s}s</button>`).join('')}
            </div>
          </div>
          <div class="sf-set-row">
            <div class="sf-l-label">Ένταση</div>
            <div class="sf-seg" data-set="diff">
              ${Object.keys(DIFF).map(k => `<button data-v="${k}">${DIFF[k].label}</button>`).join('')}
            </div>
          </div>
        </div>
        <div class="sf-set-row">
          <div class="sf-l-label">Ήχος</div>
          <div class="sf-seg" data-set="muted">
            <button data-v="false">🔊 Ναι</button><button data-v="true">🔇 Όχι</button>
          </div>
        </div>

        <button class="sf-start-btn" id="sf-start" disabled>Διάλεξε ύλη για να ξεκινήσεις</button>
      </div>
    </div>`;

    wireSources(wrap, groups);
    wireSettings(wrap);

    document.getElementById('sf-start').addEventListener('click', onStartClicked);
    // restore a previously chosen source (e.g. back from level select)
    if (keepId) { const el = wrap.querySelector(`.sf-source[data-id="${keepId}"]`); if (el) el.click(); }
    // GP path: a pack was pre-set — surface + select it automatically
    if (_rf.pack && _rf.pack.id) {
      const el = wrap.querySelector(`.sf-source[data-id="${_rf.pack.id}"]`);
      if (el) el.click();
    }
    refreshStart();
  }

  // Start → if the source has levels, go to the level-select screen (like the Games Panel);
  // otherwise drop straight into the countdown.
  function onStartClicked() {
    if (!_rf.source) return;
    const levels = window.StormContent ? window.StormContent.getLevels(_rf.source, _rf.lang) : null;
    if (levels && levels.length) renderLevelSelect(levels);
    else { _rf.level = null; _rfBegin(); }
  }

  function renderGroups(groups) {
    if (!groups.length) return `<div class="sf-src-empty">${T('Δεν βρέθηκε ύλη.', 'No content found.')}</div>`;
    return groups.map(g => `
      <div class="sf-src-group" data-cat="${esc(g.cat)}">
        <div class="sf-src-cat">${g.cat}</div>
        <div class="sf-src-list">
          ${g.items.map(it => `
            <button class="sf-source${it.locked ? ' locked' : ''}" data-id="${esc(it.id)}"${it.locked ? ' data-locked="1"' : ''} data-search="${esc((it.label + ' ' + (it.meta || '') + ' ' + g.cat).toLowerCase())}">
              <span class="sf-source-icon">${it.icon}</span>
              <span class="sf-source-text"><span class="sf-source-name">${it.label}</span><span class="sf-source-meta">${it.meta || ''}</span></span>
              ${it.locked ? '<span class="sf-source-lock">🔒 Pro</span>' : ''}
            </button>`).join('')}
        </div>
      </div>`).join('');
  }

  function wireSources(wrap, groups) {
    const flat = [];
    groups.forEach(g => g.items.forEach(it => flat.push(it)));
    wrap.querySelectorAll('.sf-source').forEach(el => {
      el.addEventListener('click', () => {
        const item = flat.find(it => String(it.id) === el.dataset.id) || null;
        // Pro content the user can't access → route to subscribe (matches the Games
        // Panel); never select it. Belt-and-braces: loadPool also hard-blocks it.
        if (item && item.locked) {
          if (typeof navToSubscribe === 'function') { closeRapidFire(); navToSubscribe(); }
          return;
        }
        wrap.querySelectorAll('.sf-source').forEach(x => x.classList.remove('selected'));
        el.classList.add('selected');
        _rf.source = item;
        refreshStart();
      });
    });
    // search filter
    const q = document.getElementById('sf-src-q');
    if (q) q.addEventListener('input', () => {
      const term = q.value.trim().toLowerCase();
      wrap.querySelectorAll('.sf-source').forEach(el => {
        el.style.display = !term || el.dataset.search.includes(term) ? '' : 'none';
      });
      wrap.querySelectorAll('.sf-src-group').forEach(g => {
        const any = [...g.querySelectorAll('.sf-source')].some(e => e.style.display !== 'none');
        g.style.display = any ? '' : 'none';
      });
    });
  }

  function wireSettings(wrap) {
    wrap.querySelectorAll('.sf-seg').forEach(seg => {
      const key = seg.dataset.set;
      seg.querySelectorAll('button').forEach(b => {
        const v = b.dataset.v;
        const cur = key === 'muted' ? String(_rf.muted) : key === 'timer' ? String(_rf.timer) : _rf.diff;
        b.classList.toggle('on', cur === v);
        b.addEventListener('click', () => {
          if (key === 'muted') { _rf.muted = (v === 'true'); if (window.StormAudio) window.StormAudio.setMuted(_rf.muted); }
          else if (key === 'timer') _rf.timer = parseInt(v);
          else _rf.diff = v;
          seg.querySelectorAll('button').forEach(x => x.classList.toggle('on', x === b));
        });
      });
    });
  }

  function refreshStart() {
    const btn = document.getElementById('sf-start');
    if (!btn) return;
    const ready = !!_rf.source;
    btn.disabled = !ready;
    btn.textContent = ready ? '⚡ Ξεκίνα την καταιγίδα →' : 'Διάλεξε ύλη για να ξεκινήσεις';
  }

  // ── LEVEL SELECT (screen 2 — mirrors the Games-Panel level picker) ──
  const TIER = { lgreen: 'green', lyellow: 'gold', lred: 'red', green: 'green', gold: 'gold', red: 'red' };
  function renderLevelSelect(levels) {
    teardown();
    _rf.level = null; // default = all levels
    const grouped = {};
    levels.forEach(l => { (grouped[l.group || ''] = grouped[l.group || ''] || []).push(l); });
    const srcName = (_rf.source && _rf.source.label) || '';

    const wrap = document.getElementById('rf-wrap');
    wrap.innerHTML = `
    <div class="sf-screen sf-lobby sf-levels active" id="rf-screen-levels">
      <div class="sf-l-inner">
        <button class="sf-lv-back" id="sf-lv-back">← ${T('Πίσω', 'Back')}</button>
        <div class="sf-l-kicker">${esc(srcName)}</div>
        <h2 class="sf-lv-title">${T('Διάλεξε επίπεδο', 'Choose a level')}</h2>
        <p class="sf-lv-sub">${T('Όπως στον Πίνακα Παιχνιδιών — επίλεξε ένα επίπεδο ή όλα.', 'Just like the Games Panel — pick a level or play them all.')}</p>
        <div class="sf-lv-groups">
          <button class="sf-lv-chip all selected" data-all="1">★ ${T('Όλα τα επίπεδα', 'All levels')}</button>
          ${Object.keys(grouped).map(g => `
            <div class="sf-lv-group">
              ${g ? `<div class="sf-lv-group-hd">${esc(g)}</div>` : ''}
              <div class="sf-lv-row">
                ${grouped[g].map(l => `<button class="sf-lv-chip tier-${TIER[l.color] || 'gold'}" data-id="${esc(l.id)}" title="${esc(l.desc)}">${esc(l.id)}</button>`).join('')}
              </div>
            </div>`).join('')}
        </div>
        <div class="sf-lv-desc" id="sf-lv-desc">${T('Όλα τα επίπεδα — τυχαία ανάμειξη ερωτήσεων.', 'All levels — a random mix of questions.')}</div>
        <button class="sf-start-btn" id="sf-lv-start">⚡ ${T('Ξεκίνα την καταιγίδα', 'Start the storm')} →</button>
      </div>
    </div>`;

    const descEl = document.getElementById('sf-lv-desc');
    const allTxt = T('Όλα τα επίπεδα — τυχαία ανάμειξη ερωτήσεων.', 'All levels — a random mix of questions.');
    const chips = wrap.querySelectorAll('.sf-lv-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        if (chip.dataset.all) { _rf.level = null; descEl.textContent = allTxt; }
        else {
          _rf.level = levels.find(l => String(l.id) === chip.dataset.id) || null;
          descEl.textContent = (_rf.level ? (T('Επίπεδο ', 'Level ') + _rf.level.id + (_rf.level.desc ? ' — ' + _rf.level.desc : '')) : allTxt);
        }
      });
      chip.addEventListener('mouseenter', () => {
        if (chip.dataset.all) return;
        const l = levels.find(x => String(x.id) === chip.dataset.id);
        if (l && l.desc) descEl.textContent = T('Επίπεδο ', 'Level ') + l.id + ' — ' + l.desc;
      });
    });
    document.getElementById('sf-lv-back').addEventListener('click', renderLobby);
    document.getElementById('sf-lv-start').addEventListener('click', () => _rfBegin());
  }

  // ── COUNTDOWN (drop-in name _rfBegin) ────────────────────
  window._rfBegin = async function () {
    // resolve the active source — from the lobby pick, or a GP-set pack
    let srcMeta = _rf.source;
    if (!srcMeta && _rf.pack) srcMeta = { id: _rf.pack.id, label: _rf.pack.name, _src: { kind: 'pack', pack: _rf.pack } };
    if (!srcMeta || !window.StormContent) return;

    // Bring up the storm + a loading label immediately, THEN await the pool. Most
    // sources resolve instantly; remote (Firestore) ones show feedback while loading.
    teardown();                       // (also bumps _rf._loadToken)
    const token = _rf._loadToken;     // this load's identity; teardown invalidates it
    const wrap = document.getElementById('rf-wrap');
    wrap.innerHTML = `
    <div class="sf-screen sf-countdown active" id="rf-screen-countdown">
      <canvas class="sf-cd-canvas" id="storm-cd-canvas"></canvas>
      <div class="sf-cd-num" id="sf-cd-num" style="display:none;">3</div>
      <div class="sf-cd-label" id="sf-cd-label">${T('Φόρτωση ύλης…', 'Loading content…')}</div>
    </div>`;
    if (window.StormArena) { cdArena = new window.StormArena('storm-cd-canvas', {}); cdArena.start(); cdArena.setIntensity(0.6); }
    if (window.StormAudio) window.StormAudio.startRain();

    let pool;
    try { pool = await window.StormContent.loadPool(srcMeta, _rf.level); }
    catch (e) { pool = { items: [] }; }
    if (token !== _rf._loadToken) return;   // superseded by close / restart — abort silently

    if (pool.denied) {  // Pro content reached without entitlement — route to subscribe
      alert(T('Απαιτείται Pro συνδρομή για αυτή την ύλη.', 'A Pro subscription is required for this content.'));
      if (typeof navToSubscribe === 'function') { closeRapidFire(); navToSubscribe(); return; }
      return renderLobby();
    }
    if (!pool.items.length) { alert(T('Δεν βρέθηκαν ερωτήσεις για αυτή την ύλη.', 'No questions found for this content.')); return renderLobby(); }
    _rf._pool = pool; _rf._srcLabel = srcMeta.label || '';

    // content ready → reveal the counter and run the 3-2-1 (storm already on screen)
    const cdLabel = document.getElementById('sf-cd-label');
    if (cdLabel) cdLabel.textContent = T('Μαζεύονται τα σύννεφα…', 'The clouds gather…');
    const cdNum = document.getElementById('sf-cd-num');
    if (cdNum) cdNum.style.display = '';

    let n = 3;
    const tick = () => {
      const el = document.getElementById('sf-cd-num');
      if (!el) return;
      if (n === 0) { startRun(); return; }
      el.textContent = n; el.style.animation = 'none'; void el.offsetWidth; el.style.animation = '';
      if (cdArena) cdArena.strike(0.6);
      if (window.StormAudio) window.StormAudio.thunder(0.6);
      n--; _rf._to = setTimeout(tick, 850);
    };
    tick();
  };

  // ── RUN ──────────────────────────────────────────────────
  function startRun() {
    if (cdArena) { cdArena.stop(); cdArena = null; }
    savePrefs({ diff: _rf.diff, timer: _rf.timer, muted: _rf.muted });

    Object.assign(_rf, {
      screen: 'game',
      clock: _rf.timer, clockCap: _rf.timer,
      score: 0, streak: 0, maxStreak: 0, correct: 0, answered: 0,
      charge: 0, mult: 1, overdrive: false, odRemain: 0,
      lastFormat: null, locked: false, running: true, qStart: 0, lastLowTick: 99,
    });

    renderGame();
    nextQuestion();
    startClock();
  }

  function renderGame() {
    const wrap = document.getElementById('rf-wrap');
    wrap.innerHTML = `
    <div class="sf-screen sf-game active" id="rf-screen-game">
      <canvas id="storm-canvas"></canvas>
      <div class="sf-game-scrim"></div>
      <div class="sf-game-inner">
        <div class="sf-hud">
          <div class="sf-score-box">
            <div class="sf-score-val" id="sf-score">0</div>
            <div class="sf-score-lbl">${T('Σκορ', 'Score')}</div>
          </div>
          <div class="sf-mult" id="sf-mult">⚡ ×1</div>
          <div class="sf-clock-num" id="sf-clock">${Math.ceil(_rf.clock)}<span class="sf-clock-unit">s</span></div>
        </div>
        <div class="sf-gauges">
          <div class="sf-gauge">
            <div class="sf-gauge-head"><span class="sf-gauge-name charge">⚡ ${T('Φόρτιση', 'Charge')}</span></div>
            <div class="sf-gauge-track"><div class="sf-charge-fill" id="sf-charge"></div></div>
          </div>
          <div class="sf-gauge">
            <div class="sf-gauge-head"><span class="sf-gauge-name storm">${T('Καταιγίδα', 'Storm')}</span></div>
            <div class="sf-gauge-track sf-storm-track"><div class="sf-storm-fill" id="sf-storm"></div></div>
          </div>
        </div>
        <div class="sf-od-banner" id="sf-od"></div>
        <div class="sf-q-zone">
          <div class="sf-q-num" id="sf-qnum"></div>
          <div class="sf-q-stem" id="sf-qstem"></div>
        </div>
        <div class="sf-answers" id="sf-answers"></div>
      </div>
    </div>`;

    if (window.StormArena) { arena = new window.StormArena('storm-canvas', {}); arena.start(); arena.setIntensity(0.45); }
    if (window.StormAudio) window.StormAudio.startRain();
    addKeys();
  }

  // ── question cycle (randomised formats via StormContent) ──
  function nextQuestion() {
    if (!_rf.running) return;
    const round = window.StormContent.buildRound(_rf._pool, {
      lang: _rf.lang, qIndex: _rf.answered, lastFormat: _rf.lastFormat, overdrive: _rf.overdrive,
    });
    if (!round) { return gameOver(); }
    _rf._round = round; _rf.lastFormat = round.format; _rf.locked = false;

    setText('sf-qnum', `${round.badge} · ${_rf.answered + 1}`);
    const stem = document.getElementById('sf-qstem');
    if (stem) { stem.innerHTML = round.stem || ''; stem.classList.remove('in'); void stem.offsetWidth; stem.classList.add('in'); }

    const host = document.getElementById('sf-answers');
    host.innerHTML = ''; host.className = 'sf-answers';

    const api = { done: false, lang: _rf.lang, mistake: null, resolve: (ok) => onResolve(ok, api) };
    _rf._api = api;
    _rf.qStart = performance.now();
    round.mount(host, api);
  }

  function onResolve(ok, api) {
    if (_rf.locked || !_rf.running) return;
    _rf.locked = true;
    _rf.answered++;
    const d = DIFF[_rf.diff];
    const elapsed = (performance.now() - _rf.qStart) / 1000;
    const speed = clamp(1 - elapsed / d.ref, 0, 1);

    if (ok) {
      _rf.streak++; _rf.correct++;
      _rf.maxStreak = Math.max(_rf.maxStreak, _rf.streak);
      _rf.mult = multFor(_rf.streak);
      const ramp = Math.max(0.55, 1 - _rf.correct * 0.012);
      const gift = (d.add * (0.55 + 0.45 * speed)) * ramp;
      _rf.clock += gift;
      const pts = Math.round(100 * _rf.mult * (_rf.overdrive ? 2 : 1) * (0.6 + 0.4 * speed));
      _rf.score += pts;
      if (!_rf.overdrive) { _rf.charge += 0.13 + 0.05 * speed + (_rf.streak >= 3 ? 0.03 : 0); if (_rf.charge >= 1) startOverdrive(); }
      const inten = clamp(0.45 + speed * 0.35 + (_rf.overdrive ? 0.2 : 0), 0.3, 1);
      if (arena) arena.strike(inten);
      if (window.StormAudio) { window.StormAudio.strike(inten); window.StormAudio.gust(gift); if (_rf.mult >= 2) window.StormAudio.combo(_rf.mult); }
      pop('+' + pts, 'pos');
      pop('+' + gift.toFixed(1) + 's', 'time', 120);
    } else {
      _rf.streak = 0; _rf.mult = 1;
      _rf.clock -= d.pen;
      _rf.charge = Math.max(0, _rf.charge * 0.4);
      if (_rf.overdrive) endOverdrive();
      if (arena) arena.flashWrong();
      if (window.StormAudio) window.StormAudio.wrong();
      pop('−' + d.pen.toFixed(1) + 's', 'neg');
      if (api && api.mistake) logMistake(api.mistake);
    }

    updateHUD();
    _rf._to = setTimeout(() => { if (_rf.running) nextQuestion(); }, _rf.overdrive ? 720 : 900);
  }

  const multFor = s => (s >= 9 ? 4 : s >= 6 ? 3 : s >= 3 ? 2 : 1);

  // ── overdrive ────────────────────────────────────────────
  function startOverdrive() {
    _rf.overdrive = true; _rf.odRemain = OD_DURATION; _rf.charge = 1;
    if (arena) arena.setOverdrive(true);
    if (window.StormAudio) window.StormAudio.overdrive();
    const od = document.getElementById('sf-od');
    if (od) { od.textContent = '⚡ ΚΑΤΑΙΓΙΔΑ! ×2 ⚡'; od.classList.add('on'); }
  }
  function endOverdrive() {
    _rf.overdrive = false; _rf.odRemain = 0; _rf.charge = 0;
    if (arena) arena.setOverdrive(false);
    if (window.StormAudio) window.StormAudio.overdriveEnd();
    const od = document.getElementById('sf-od'); if (od) od.classList.remove('on');
    updateGauges();
  }

  // ── storm clock loop ─────────────────────────────────────
  function startClock() {
    let last = performance.now();
    const loop = (now) => {
      if (!_rf.running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const d = DIFF[_rf.diff];
      const ramp = 1 + Math.min(0.6, _rf.correct * 0.012);
      const drain = d.drain * ramp * (_rf.overdrive ? OD_DRAIN_MUL : 1);
      _rf.clock -= drain * dt;
      if (_rf.overdrive) { _rf.odRemain -= dt; if (_rf.odRemain <= 0) endOverdrive(); }

      const sec = Math.ceil(Math.max(0, _rf.clock));
      if (_rf.clock <= 5 && sec !== _rf.lastLowTick && sec > 0) { _rf.lastLowTick = sec; if (window.StormAudio) window.StormAudio.tick(true); }
      else if (_rf.clock > 5) _rf.lastLowTick = 99;

      const health = clamp(_rf.clock / _rf.clockCap, 0, 1);
      if (arena) { arena.setCharge(_rf.charge); arena.setIntensity(clamp(0.35 + _rf.charge * 0.3 + (1 - health) * 0.35, 0, 1)); }
      if (window.StormAudio) window.StormAudio.setRain(clamp(0.4 + (1 - health) * 0.5 + (_rf.overdrive ? 0.3 : 0), 0, 1));

      updateClock();
      if (_rf.clock <= 0) { _rf.clock = 0; updateClock(); return gameOver(); }
      _rf.raf = requestAnimationFrame(loop);
    };
    _rf.raf = requestAnimationFrame(loop);
  }

  // ── HUD ──────────────────────────────────────────────────
  function updateHUD() { setText('sf-score', _rf.score); updateMult(); updateGauges(); }
  function updateMult() {
    const el = document.getElementById('sf-mult'); if (!el) return;
    el.textContent = '⚡ ×' + _rf.mult;
    el.classList.toggle('show', _rf.mult >= 2);
    el.classList.toggle('big', _rf.mult >= 3);
  }
  function updateGauges() {
    const cf = document.getElementById('sf-charge');
    if (cf) { cf.style.width = (clamp(_rf.charge, 0, 1) * 100) + '%'; cf.classList.toggle('full', _rf.charge >= 1 && !_rf.overdrive); }
    updateClock();
  }
  function updateClock() {
    const sec = Math.max(0, _rf.clock);
    const num = document.getElementById('sf-clock');
    if (num) { num.innerHTML = Math.ceil(sec) + '<span class="sf-clock-unit">s</span>'; num.classList.toggle('low', sec <= 5); }
    const bar = document.getElementById('sf-storm');
    if (bar) { bar.style.width = clamp(sec / _rf.clockCap, 0, 1) * 100 + '%'; bar.className = 'sf-storm-fill' + (sec <= 4 ? ' danger' : sec <= 8 ? ' warn' : ''); }
  }

  // ── END ──────────────────────────────────────────────────
  function gameOver() {
    _rf.running = false;
    if (_rf.raf) cancelAnimationFrame(_rf.raf), (_rf.raf = null);
    removeKeys();
    if (_rf.overdrive) endOverdrive();
    if (arena) arena.calm();
    if (window.StormAudio) { window.StormAudio.stopRain(); window.StormAudio.end(); }
    setTimeout(() => { if (arena) { arena.stop(); arena = null; } }, 900);

    const acc = _rf.answered > 0 ? Math.round((_rf.correct / _rf.answered) * 100) : 0;
    if(typeof awardGameRewards==='function' && _rf.score > 0){ awardGameRewards('rapid-fire', { score: _rf.score, perfect: _rf.answered > 0 && _rf.correct === _rf.answered }); }
    const wrap = document.getElementById('rf-wrap');
    wrap.innerHTML = `
    <div class="sf-screen sf-end active" id="rf-screen-over">
      <div class="sf-end-inner">
        <div class="sf-end-glyph">⛈</div>
        <h1 class="sf-end-title">${T('Η καταιγίδα πέρασε', 'The storm has passed')}</h1>
        <p class="sf-end-sub">${T('Άντεξες ' + _rf.correct + ' κεραυνούς.', 'You summoned ' + _rf.correct + ' bolts.')}</p>
        <div class="sf-end-score">${_rf.score}</div>
        <div class="sf-end-score-lbl">${T('Τελικό σκορ', 'Final score')}</div>
        <div class="sf-end-stats">
          <div class="sf-end-stat"><b>${_rf.correct}</b><span>${T('Σωστές', 'Correct')}</span></div>
          <div class="sf-end-stat"><b>${acc}%</b><span>${T('Ακρίβεια', 'Accuracy')}</span></div>
          <div class="sf-end-stat best"><b>×${multFor(_rf.maxStreak)}</b><span>${T('Καλύτερη σειρά', 'Best streak')}</span></div>
        </div>
        <div class="sf-end-btns">
          <button class="sf-start-btn slim" id="sf-again">⚡ ${T('Ξανά', 'Again')}</button>
          <button class="sf-ghost-btn" id="sf-menu">← ${T('Μενού', 'Menu')}</button>
        </div>
      </div>
    </div>`;
    document.getElementById('sf-again').addEventListener('click', () => _rfBegin());
    document.getElementById('sf-menu').addEventListener('click', renderLobby);

    // ScoreTracker (leaderboard / share) — preserved
    const screen = document.getElementById('rf-screen-over');
    const srcId = (_rf.source && _rf.source.id) || (_rf.pack && _rf.pack.id);
    if (screen && typeof ScoreTracker !== 'undefined' && srcId && srcId !== '_gp') {
      try {
        ScoreTracker.submit({
          gameId: 'rapid-fire-' + srcId,
          gameTitle: 'Καταιγισμός — ' + (_rf._srcLabel || srcId),
          score: _rf.score, timerSecs: _rf.timer, lives: 0,
          containerEl: screen, insertBefore: screen.querySelector('.sf-end-btns'), lang: _rf.lang,
        });
      } catch (e) {}
    }
  }

  function logMistake(m) {
    if (typeof logStudentMistake !== 'function' || !m) return;
    try {
      const gid = 'rapid-fire-' + ((_rf.source && _rf.source.id) || (_rf.pack && _rf.pack.id) || 'unknown');
      logStudentMistake(gid, 'mythos', 'rapid-fire', { q: m.q, a: m.correct }, m.chosen);
    } catch (e) {}
  }

  // ── pops ─────────────────────────────────────────────────
  function pop(txt, cls, delay) {
    const host = document.querySelector('.sf-game-inner'); if (!host) return;
    const go = () => { const el = document.createElement('div'); el.className = 'sf-pop ' + cls; el.textContent = txt; host.appendChild(el); setTimeout(() => el.remove(), 820); };
    delay ? setTimeout(go, delay) : go();
  }

  // ── keyboard (MC / TF only — 1-4 / A-D) ──────────────────
  function addKeys() {
    removeKeys();
    keyHandler = (e) => {
      if (!_rf.running || _rf.locked) return;
      const map = { '1': 1, '2': 2, '3': 3, '4': 4, a: 1, b: 2, c: 3, d: 4 };
      const k = e.key.toLowerCase();
      if (k in map) {
        const host = document.getElementById('sf-answers');
        const b = host && host.querySelector(`[data-k="${map[k]}"]`);
        if (b && !b.classList.contains('disabled')) { e.preventDefault(); b.click(); }
      }
    };
    document.addEventListener('keydown', keyHandler);
  }
  function removeKeys() { if (keyHandler) { document.removeEventListener('keydown', keyHandler); keyHandler = null; } }

  // ── utils ────────────────────────────────────────────────
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function setText(id, t) { const e = document.getElementById(id); if (e) e.textContent = t; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
})();
