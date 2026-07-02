// ============================================================
//  PHALANX · Reimagined — engine  (window.openPhalanx / closePhalanx)
//
//  Two modes:
//   ⚔ REIMAGINED — unit-type matchups (Ὁπλίτης>Ἱππεύς>Τοξότης>Ὁπλίτης),
//     distinct movement & abilities (cavalry charge, archer ranged strike,
//     hoplite shield-wall, general command aura), and terrain (high ground,
//     mountain pass, river ford, impassable crag). A clash still hinges on
//     the quiz — answer right and you win — but a strong position (net edge)
//     lets a wrong answer end in a STANDOFF instead of a death.
//   ↔ CLASSIC — the original flat board: every unit steps one tile, every
//     clash is pure quiz (right = win, wrong = lose).
//
//  Opponent: vs AI (3 difficulties) or local hot-seat (two players).
//  Reads questions from the live global window.PH_Q.
//  Depends on: phalanx-arena.js, phalanx-audio.js (+ phalanx-data.js preview)
// ============================================================
(function () {
  const LS = 'phalanx_reimagined_v1';
  let S = null, arena = null, qTimer = null, keyH = null;
  let phChosen = null;   // { id, label, icon } of the picked subject/dataset

  /* ── unit defs & matchups ── */
  const DEFS = {
    hoplite: { lbl:'ΟΠΛ', gr:'Ὁπλίτης', en:'Hoplite' },
    archer:  { lbl:'ΤΟΞ', gr:'Τοξότης', en:'Archer' },
    cavalry: { lbl:'ΙΠΠ', gr:'Ἱππεύς',  en:'Cavalry' },
    general: { lbl:'ΣΤΡ', gr:'Στρατηγός', en:'General' },
  };
  const ROSTER = ['hoplite','hoplite','archer','cavalry','general'];
  // a beats b
  const BEATS = { hoplite:'cavalry', cavalry:'archer', archer:'hoplite' };
  function typeBeats(a, b) { return BEATS[a] === b; }

  /* ── curated symmetric terrain layouts (point-symmetry: mirror = 35-i) ── */
  const LAYOUTS = [
    { hill:[8,27], ford:[13,16,19,22], rock:[14,21], pass:[] },
    { hill:[9,26], pass:[14,15,20,21], rock:[12,17,18,23], ford:[] },
    { hill:[7,10,25,28], rock:[14,15,20,21], ford:[13,16,19,22], pass:[] },
  ];

  /* ── persistence ── */
  function load() { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } }
  function save(p) { try { localStorage.setItem(LS, JSON.stringify(p)); } catch (e) {} }
  const LANG = () => (typeof siteLang !== 'undefined' ? siteLang : 'gr');
  const T = (gr, en) => (LANG() === 'en' ? en : gr);
  const RMQ = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)')) || { matches: false };

  /* ── shared visual dressing (ambient dawn backdrop + shield crest) ── */
  // A living dawn sky with drifting embers, painted behind the menu screens.
  // Pure CSS/DOM — respects prefers-reduced-motion via the .ph-ember rules.
  function skyBg() {
    let embers = '';
    for (let i = 0; i < 14; i++) {
      const left = (7 + i * 6.4).toFixed(1);
      const dur = (7 + (i % 5) * 2.2).toFixed(1);
      const delay = (-(i * 1.37) % 9).toFixed(1);
      const drift = (((i * 37) % 30) - 15).toFixed(0);
      const sz = (2 + (i % 3)).toFixed(0);
      embers += `<span class="ph-ember" style="left:${left}%;width:${sz}px;height:${sz}px;--drift:${drift}px;animation-duration:${dur}s;animation-delay:${delay}s"></span>`;
    }
    return `<div class="ph-sky-bg" aria-hidden="true">${embers}</div>`;
  }
  // Bronze lambda shield emblem (the phalanx sigil) as inline SVG.
  // `extra` adds a size-variant class; the gradient id is unique per call so
  // several crests can live in the DOM (picker + lobby) without id clashes.
  let crestUid = 0;
  function shieldCrest(extra) {
    const gid = 'phCrestG' + (++crestUid);
    return `<div class="ph-pick-crest${extra ? ' ' + extra : ''}" aria-hidden="true">
      <svg viewBox="0 0 100 100">
        <defs>
          <radialGradient id="${gid}" cx="38%" cy="32%" r="75%">
            <stop offset="0" stop-color="#F0C878"/><stop offset="55%" stop-color="#C9A44A"/><stop offset="100%" stop-color="#6e5722"/>
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#${gid})" stroke="#3a2d12" stroke-width="2"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(20,14,6,.4)" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,238,190,.35)" stroke-width="1" stroke-dasharray="2 5"/>
        <path d="M34 72 L50 26 L66 72 L58 72 L50 48 L42 72 Z" fill="#0e0a05"/>
        <path d="M20 20 Q28 12 36 20" fill="none" stroke="rgba(255,238,190,.4)" stroke-width="2.5" stroke-linecap="round"/>
      </svg>
    </div>`;
  }
  // Procedural laurel wreath (victory crown) — two mirrored branches whose
  // leaves are placed along a quadratic arc. Pure SVG, no assets.
  function laurelSvg() {
    const P0 = { x: 100, y: 60 }, P1 = { x: 58, y: 62 }, P2 = { x: 14, y: 16 };
    let leaves = '';
    for (let k = 0; k <= 8; k++) {
      const t = k / 8;
      const mt = 1 - t;
      const x = mt * mt * P0.x + 2 * mt * t * P1.x + t * t * P2.x;
      const y = mt * mt * P0.y + 2 * mt * t * P1.y + t * t * P2.y;
      const dx = 2 * mt * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
      const dy = 2 * mt * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
      const ang = Math.atan2(dy, dx) * 180 / Math.PI + (k % 2 ? 34 : -34);
      const s = 10.5 - k * 0.55;
      leaves += `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="${s.toFixed(1)}" ry="${(s * 0.34).toFixed(1)}" transform="rotate(${ang.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)})"/>`;
    }
    return `<div class="ph-res-laurel" aria-hidden="true"><svg viewBox="0 0 200 72">
      <g fill="none" stroke="rgba(201,164,74,.65)" stroke-width="1.6" stroke-linecap="round">
        <path d="M100 60 Q58 62 14 16"/><path d="M100 60 Q142 62 186 16"/>
      </g>
      <g fill="rgba(201,164,74,.6)">${leaves}<g transform="translate(200,0) scale(-1,1)">${leaves}</g></g>
      <circle cx="100" cy="61" r="3.4" fill="rgba(240,200,120,.85)"/>
    </svg></div>`;
  }
  // eased count-up for the result stats — the numbers march to their post
  function countUp(el) {
    const target = +el.dataset.cnt || 0, suf = el.dataset.suf || '';
    if (RMQ.matches || target <= 0) { el.textContent = target + suf; return; }
    const t0 = performance.now(), dur = 950;
    (function step(now) {
      const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * e) + suf;
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  /* ── open / close ── */
  window.openPhalanx = function () {
    // Use the site's .active convention (CSS .game-overlay.active{display:flex})
    // so the floating home button and `body:has(.game-overlay.active)` styling
    // track Phalanx like every other game overlay.
    const ov = document.getElementById('phalanx-overlay');
    if (ov) ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('ph-wrap')) buildDOM();
    // The Games-Panel bridge (nav.js) pre-injects window.PH_Q; when content is
    // already chosen we jump straight to the options lobby. A standalone launch
    // (home card, favorites) opens the content picker first.
    if (Array.isArray(window.PH_Q) && window.PH_Q.length) renderLobby();
    else { phChosen = null; renderPicker(); }
  };
  window.closePhalanx = function () {
    const ov = document.getElementById('phalanx-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
    teardown();
  };
  function teardown() {
    if (qTimer) { clearInterval(qTimer); qTimer = null; }
    if (keyH) { window.removeEventListener('keydown', keyH); keyH = null; }
    if (arena) { arena.stop(); arena = null; }
    // Close the AudioContext too — without this, each open/close leaks a
    // suspended context and browsers cap them (~6), eventually killing SFX.
    if (window.PhalanxAudio) window.PhalanxAudio.stop();
  }

  /* ══════════════ DOM (built once) ══════════════ */
  function buildDOM() {
    document.getElementById('phalanx-wrap').innerHTML = `
    <div id="ph-wrap">
      <div id="ph-pick" class="ph-screen"></div>
      <div id="ph-lobby" class="ph-screen"></div>
      <div id="ph-play" class="ph-screen">
        <div class="ph-hud">
          <div class="ph-hud-side"><span class="ph-hud-lbl" id="ph-hud-blbl">Εχθρός</span><span class="ph-hud-name" id="ph-hud-bname">AI</span><div class="ph-hud-pips" id="ph-pips-a"></div></div>
          <div class="ph-hud-mid"><span class="ph-turn-tag p" id="ph-turn">—</span><button class="ph-exit-mini" id="ph-quit">✕ Εγκατάλειψη</button></div>
          <div class="ph-hud-side right"><span class="ph-hud-lbl">Παίκτης</span><span class="ph-hud-name" id="ph-hud-pname">Εσύ</span><div class="ph-hud-pips" id="ph-pips-p"></div></div>
        </div>
        <div class="ph-status" id="ph-status">—</div>
        <div class="ph-board-area">
          <canvas id="ph-canvas"></canvas>
          <div class="ph-curtain" id="ph-curtain">
            <div class="ph-curtain-glyph">⚔</div>
            <h2 id="ph-curtain-h">—</h2>
            <p id="ph-curtain-p">—</p>
            <button class="ph-mini-btn go" id="ph-curtain-btn">Έτοιμος →</button>
          </div>
          <div class="ph-quiz" id="ph-quiz">
            <div class="ph-quiz-box">
              <div class="ph-clash-row">
                <div class="ph-clash-side"><div class="ph-clash-emb" id="ph-qa-emb"></div><div class="ph-clash-nm" id="ph-qa-nm"></div><div class="ph-clash-edge" id="ph-qa-edge"></div></div>
                <div class="ph-clash-mid"><div class="ph-clash-vs">⚔</div><div class="ph-clash-fore" id="ph-fore"></div></div>
                <div class="ph-clash-side"><div class="ph-clash-emb" id="ph-qd-emb"></div><div class="ph-clash-nm" id="ph-qd-nm"></div><div class="ph-clash-edge" id="ph-qd-edge"></div></div>
              </div>
              <div class="ph-qlbl"><span id="ph-qlbl-t">ΓΛΩΣΣΙΚΟΣ ΑΓΩΝΑΣ</span><span class="ph-qtimer" id="ph-qtimer"></span></div>
              <div class="ph-qbar-track" id="ph-qbar-track"><i id="ph-qbar"></i></div>
              <div class="ph-qtxt" id="ph-qtxt"></div>
              <div class="ph-opts" id="ph-opts"></div>
              <div class="ph-clash-res" id="ph-res"></div>
            </div>
          </div>
        </div>
        <div class="ph-pbar" id="ph-pbar"></div>
      </div>
      <div id="ph-result" class="ph-screen"></div>
    </div>`;
    document.getElementById('ph-quit').addEventListener('click', () => { if (confirm(T('Εγκατάλειψη της μάχης;','Abandon the battle?'))) renderLobby(); });
  }

  function show(id) {
    ['ph-pick','ph-lobby','ph-play','ph-result'].forEach(s => document.getElementById(s).classList.toggle('active', s === id));
  }

  /* ══════════════ CONTENT PICKER (battleship-style) ══════════════ */
  // Self-contained subject chooser so Phalanx no longer depends on the
  // Games-Panel bridge. Reads the live GP_DATASETS registry and converts a
  // chosen dataset into window.PH_Q via the same pipeline the bridge uses
  // (loader → _gpNormalizeQuestions → _gpToMcItems).
  function phPickGroups() {
    const groups = [], idx = {};
    const list = (typeof GP_DATASETS !== 'undefined' && Array.isArray(GP_DATASETS)) ? GP_DATASETS : [];
    list.forEach(ds => {
      const cat = ds.category || 'Άλλα';
      if (!(cat in idx)) { idx[cat] = groups.length; groups.push({ cat, items: [] }); }
      groups[idx[cat]].items.push(ds);
    });
    return groups;
  }

  function phLoadDataset(ds) {
    let raw = null;
    try { raw = ds.loader ? ds.loader() : null; } catch (e) { raw = null; }
    const questions = (typeof _gpNormalizeQuestions === 'function')
      ? _gpNormalizeQuestions(raw, ds.id)
      : (Array.isArray(raw) ? raw : []);
    if (!Array.isArray(questions) || !questions.length) return [];
    if (typeof _gpToMcItems !== 'function') return [];
    return _gpToMcItems(questions).map(i => ({ q: i.q, a: i.a, c: i.c }));
  }

  function phCanAccess(tier) {
    return (typeof _gpCanAccessTier === 'function') ? _gpCanAccessTier(tier) : (!tier || tier === 'free');
  }

  function renderPicker() {
    teardown();
    const w = document.getElementById('ph-pick');
    if (!w) return;

    const groupsHtml = phPickGroups().map(g => `
      <div class="ph-pick-cat">
        <div class="ph-pick-cat-h">${g.cat}</div>
        <div class="ph-pick-list">
          ${g.items.map(ds => {
            const locked = !phCanAccess(ds.tier);
            return `<button class="ph-pick-btn${locked ? ' locked' : ''}" data-ds="${ds.id}">
              <span class="ph-pick-ic">${ds.icon || '📚'}</span>
              <span class="ph-pick-tx"><span class="ph-pick-nm">${ds.label}</span><span class="ph-pick-mt">${ds.meta || ''}</span></span>
              <span class="ph-pick-end">${locked ? '🔒' : '→'}</span>
            </button>`;
          }).join('')}
        </div>
      </div>`).join('');

    w.innerHTML = skyBg() + `
      <div class="ph-pick-root">
        <button class="ph-pick-exit" id="ph-pick-exit">← ${T('Έξοδος','Exit')}</button>
        <div class="ph-pick-menu">
          ${shieldCrest()}
          <h1 class="ph-pick-title">ΦΑΛΑΓΓΑ</h1>
          <p class="ph-pick-sub">${T('Διάλεξε την ύλη της μάχης','Choose your battle content')}</p>
          <div class="ph-pick-hr"></div>
          <div class="ph-pick-groups">${groupsHtml || `<p class="ph-pick-empty">${T('Δεν βρέθηκε διαθέσιμη ύλη.','No content available.')}</p>`}</div>
        </div>
      </div>`;

    document.getElementById('ph-pick-exit').addEventListener('click', () => { if (typeof closePhalanx === 'function') closePhalanx(); });

    w.querySelectorAll('.ph-pick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const list = (typeof GP_DATASETS !== 'undefined') ? GP_DATASETS : [];
        const ds = list.find(d => d.id === btn.dataset.ds);
        if (!ds) return;
        if (!phCanAccess(ds.tier)) {
          if (typeof showToast === 'function') showToast('Απαιτείται συνδρομή για αυτή την ύλη.', 'This content requires a subscription.');
          return;
        }
        const items = phLoadDataset(ds);
        if (!items.length) {
          if (typeof showToast === 'function') showToast('Δεν φορτώθηκαν ερωτήσεις. Δοκίμασε άλλη ύλη.', 'Could not load questions — try another subject.');
          return;
        }
        window.PH_Q = items;
        phChosen = { id: ds.id, label: ds.label, icon: ds.icon || '📚' };
        const p = load(); p.dataset = ds.id; save(p);
        renderLobby();
      });
    });

    show('ph-pick');
  }

  /* ══════════════ LOBBY ══════════════ */
  function renderLobby() {
    teardown();
    const p = load();
    const banks = window.PH_BANKS || {};
    const bankKeys = Object.keys(banks);
    S = {
      screen:'lobby',
      mode: p.mode || 'reimagined',     // 'reimagined' | 'classic'
      opponent: p.opponent || 'ai',     // 'ai' | 'hotseat'
      difficulty: p.difficulty || 'normal',
      bank: p.bank && banks[p.bank] ? p.bank : (bankKeys[0] || ''),
      answerSec: p.answerSec || 0,      // 0 = no timer
      muted: p.muted || false,
    };
    if (window.PhalanxAudio) window.PhalanxAudio.setMuted(S.muted);

    const w = document.getElementById('ph-lobby');
    w.innerHTML = skyBg() + `
    <div class="ph-lobby">
      <div class="ph-l-head">
        ${shieldCrest('sm')}
        <div class="ph-l-kicker">ΦΑΛΑΓΓΑ · REIMAGINED</div>
        <h1 class="ph-l-title">Φάλαγγα<em>.</em></h1>
        <p class="ph-l-sub">Παράταξε τη φάλαγγα, διάβασε το έδαφος, κέρδισε τους <strong>Γλωσσικούς Αγῶνες</strong> — και ρίξε τον εχθρικό Στρατηγό.</p>
        ${phChosen ? `<button class="ph-l-back" id="ph-l-back"><span class="ph-l-back-ic">${phChosen.icon}</span> ${phChosen.label} <span class="ph-l-back-chg">· ${T('άλλη ύλη','change')}</span></button>` : ''}
      </div>

      <div class="ph-modes">
        <button class="ph-mode" data-set="mode" data-v="reimagined">
          <div class="ph-mode-tag"><span class="ph-dot"></span>⚔ Reimagined</div>
          <div class="ph-mode-desc">Είδη μονάδων που αλληλοϋπερισχύουν, ειδικές κινήσεις & δεξιότητες, και έδαφος που κρίνει τη μάχη. Σωστή απάντηση = νίκη· καλή θέση = σώζεσαι κι όταν σφάλεις.</div>
        </button>
        <button class="ph-mode" data-set="mode" data-v="classic">
          <div class="ph-mode-tag"><span class="ph-dot"></span>↔ Classic</div>
          <div class="ph-mode-desc">Ο αρχικός κανόνας. Κάθε μονάδα κινείται ένα τετράγωνο, κάθε σύγκρουση κρίνεται καθαρά από την ερώτηση: σωστό = νίκη, λάθος = χάνεις τη μονάδα.</div>
        </button>
      </div>

      <div class="ph-card">
        <div class="ph-card-h">Αντίπαλος</div>
        <div class="ph-set-row">
          <div class="ph-seg" data-set="opponent">
            <button data-v="ai">🏛 Εναντίον AI</button>
            <button data-v="hotseat">👥 Δύο παίκτες</button>
          </div>
        </div>
        <div class="ph-set-grid" style="margin-top:12px">
          <div class="ph-set-row col" id="ph-diff-row">
            <label>Δυσκολία AI</label>
            <div class="ph-seg" data-set="difficulty">
              <button data-v="easy">Εύκολο</button><button data-v="normal">Μέτριο</button><button data-v="hard">Δύσκολο</button>
            </div>
          </div>
          <div class="ph-set-row col">
            <label>Χρόνος ερώτησης</label>
            <div class="ph-seg" data-set="answerSec">
              <button data-v="0">∞</button><button data-v="20">20s</button><button data-v="12">12s</button>
            </div>
          </div>
          ${bankKeys.length ? `<div class="ph-set-row col">
            <label>Ύλη</label>
            <div class="ph-seg wrap" data-set="bank">
              ${bankKeys.map(k => `<button data-v="${k}">${banks[k].label}</button>`).join('')}
            </div>
          </div>` : ''}
          <div class="ph-set-row col">
            <label>Ήχος</label>
            <div class="ph-seg" data-set="muted">
              <button data-v="false">🔊 Ναι</button><button data-v="true">🔇 Όχι</button>
            </div>
          </div>
        </div>
      </div>

      <div class="ph-card" id="ph-rules-card">
        <div class="ph-card-h">Μονάδες & Δεξιότητες</div>
        <div class="ph-legend">
          <div class="ph-unit-card"><div class="ph-unit-emb">ΟΠΛ</div><div class="ph-unit-body"><h4>Ὁπλίτης <span>×2</span></h4><p>Βῆμα 1. <b>Ασπίδων τεῖχος:</b> +άμυνα δίπλα σε σύμμαχο οπλίτη. Νικά τον Ἱππέα.</p></div></div>
          <div class="ph-unit-card"><div class="ph-unit-emb ar">ΤΟΞ</div><div class="ph-unit-body"><h4>Τοξότης</h4><p>Βῆμα 1 ή <b>βολή από 2 τετράγωνα</b> χωρίς να κινηθεί. Νικά τον Ὁπλίτη.</p></div></div>
          <div class="ph-unit-card"><div class="ph-unit-emb ca">ΙΠΠ</div><div class="ph-unit-body"><h4>Ἱππεύς</h4><p><b>Έφοδος:</b> ώς 2 τετράγωνα ευθεία — bonus όταν χτυπά μετά από έφοδο. Νικά τον Τοξότη.</p></div></div>
          <div class="ph-unit-card"><div class="ph-unit-emb ge">ΣΤΡ</div><div class="ph-unit-body"><h4>Στρατηγός</h4><p>Βῆμα 1. <b>Αύρα διοίκησης:</b> +δύναμη στους γειτονικούς συμμάχους. Προστάτεψέ τον!</p></div></div>
        </div>
        <div class="ph-terr" id="ph-terr-legend" style="margin-top:13px">
          <div class="ph-terr-chip"><span class="ph-terr-sw" style="background:#7a6028"></span><b>Λόφος</b> +πλεονέκτημα</div>
          <div class="ph-terr-chip"><span class="ph-terr-sw" style="background:#2E6F94"></span><b>Πόρος</b> −ευάλωτος, φράζει έφοδο</div>
          <div class="ph-terr-chip"><span class="ph-terr-sw" style="background:#3a2e1c"></span><b>Στενό</b> +άμυνα</div>
          <div class="ph-terr-chip"><span class="ph-terr-sw" style="background:#0a0805;border:1px solid #241a10"></span><b>Βράχος</b> αδιάβατος</div>
        </div>
      </div>

      <button class="ph-start-btn" id="ph-start">ΕΝΑΡΞΗ ΜΑΧΗΣ →</button>
    </div>`;

    // wire segmented + mode buttons
    w.querySelectorAll('[data-set]').forEach(el => {
      const key = el.dataset.set;
      if (el.classList.contains('ph-seg')) {
        el.querySelectorAll('button').forEach(b => {
          b.classList.toggle('on', String(S[key]) === b.dataset.v);
          b.addEventListener('click', () => { setPref(key, b.dataset.v); refreshLobbyActive(w); });
        });
      } else if (el.classList.contains('ph-mode')) {
        el.classList.toggle('on', String(S.mode) === el.dataset.v);
        el.addEventListener('click', () => { setPref('mode', el.dataset.v); refreshLobbyActive(w); });
      }
    });
    refreshLobbyActive(w);
    document.getElementById('ph-start').addEventListener('click', startGame);
    const backBtn = document.getElementById('ph-l-back');
    if (backBtn) backBtn.addEventListener('click', renderPicker);
    show('ph-lobby');
  }
  function setPref(key, v) {
    if (v === 'true') v = true; else if (v === 'false') v = false; else if (!isNaN(+v) && (key === 'answerSec')) v = +v;
    S[key] = v;
    const p = load(); p[key] = v; save(p);
    if (key === 'muted' && window.PhalanxAudio) window.PhalanxAudio.setMuted(v);
  }
  function refreshLobbyActive(w) {
    w.querySelectorAll('.ph-seg').forEach(seg => seg.querySelectorAll('button').forEach(b => b.classList.toggle('on', String(S[seg.dataset.set]) === b.dataset.v)));
    w.querySelectorAll('.ph-mode').forEach(m => m.classList.toggle('on', String(S.mode) === m.dataset.v));
    // difficulty only relevant vs AI; rules card only for reimagined
    const diff = document.getElementById('ph-diff-row'); if (diff) diff.style.opacity = S.opponent === 'ai' ? 1 : .4;
    const rc = document.getElementById('ph-rules-card'); if (rc) rc.style.display = S.mode === 'reimagined' ? '' : 'none';
  }

  /* ══════════════ GAME INIT ══════════════ */
  function startGame() {
    const reimagined = S.mode === 'reimagined';
    // questions
    const banks = window.PH_BANKS || {};
    if (!Array.isArray(window.PH_Q)) window.PH_Q = [];
    if (banks[S.bank]) { window.PH_Q.length = 0; window.PH_Q.push(...banks[S.bank].q); }
    const Q = window.PH_Q;
    if (!Q.length) {
      // No content selected — send the player to the in-game picker instead of
      // crashing on Q.map below.
      if (typeof showToast === 'function') showToast('Διάλεξε πρώτα ύλη.', 'Pick content first.');
      renderPicker();
      return;
    }
    S.qPool = shuffle(Q.map((_, i) => i)); S.qIdx = 0;

    S.cells = Array(36).fill(null);
    S.terrain = Array(36).fill('plain');
    if (reimagined) applyTerrain(LAYOUTS[(Math.random() * LAYOUTS.length) | 0]);

    S.selected = -1; S.validMoves = []; S.rangedTargets = []; S.moveInfo = {};
    S.phase = 'place'; S.turn = 'player'; S.clash = null; S.lastMove = null;
    S.stats = { q: 0, correct: 0, kills: 0 };

    // placement queues
    S.placeQueue = (S.opponent === 'hotseat') ? ['ai', 'player'] : ['player'];
    S.placeIdx = 0;

    // AI auto-places its army (and, in AI mode, hidden)
    if (S.opponent === 'ai') aiPlace();

    // arena
    if (!arena) arena = new window.PhalanxArena('ph-canvas', { onTileClick: onTile });
    arena.reset(); arena.start();

    show('ph-play');
    beginPlacementFor(S.placeQueue[S.placeIdx]);
  }

  function applyTerrain(L) {
    ['hill','ford','pass','rock'].forEach(k => (L[k] || []).forEach(i => { S.terrain[i] = k; }));
  }
  function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const row = i => (i / 6) | 0, col = i => i % 6;
  const homeRows = side => side === 'player' ? [3,4,5] : [0,1,2];

  /* ══════════════ PLACEMENT ══════════════ */
  function beginPlacementFor(side) {
    S.placeSide = side;
    S.toPlace = ROSTER.slice();
    S.selType = ROSTER[0];
    S.phase = 'place';
    if (S.opponent === 'hotseat') {
      // curtain between players
      showCurtain(
        side === 'ai' ? 'Ομάδα Β — Παράταξη' : 'Ομάδα Α — Παράταξη',
        side === 'ai' ? 'Τοποθέτησε τις μονάδες σου στο ΕΠΑΝΩ μισό. Η Ομάδα Α να μην κοιτάζει.' : 'Τοποθέτησε τις μονάδες σου στο ΚΑΤΩ μισό.',
        () => doPlacementUI(side)
      );
    } else doPlacementUI(side);
  }
  function doPlacementUI(side) {
    hideCurtain();
    const isTop = side === 'ai';
    setTurnTag(side, T('ΤΟΠΟΘΕΤΗΣΗ','PLACEMENT'));
    setStatus(T(`Επίλεξε μονάδα και τοποθέτησέ την στη ζώνη σου.`, `Pick a unit and place it in your zone.`));
    renderPbar();
    pushArena({ placement: true, placeSide: side });
  }
  function renderPbar() {
    const bar = document.getElementById('ph-pbar');
    bar.style.display = '';   // enterBattle hides it; restore for replays
    const counts = {}; ROSTER.forEach(t => counts[t] = (counts[t] || 0) + 1);
    const picks = Object.entries(counts).map(([type, total]) => {
      const left = S.toPlace.filter(t => t === type).length;
      const cls = (left === 0 ? ' done' : '') + (S.selType === type && left ? ' sel' : '');
      return `<div class="ph-pick${cls}" data-type="${type}"><span class="ph-pick-lbl">${DEFS[type].lbl}</span><span class="ph-pick-cnt">${total - left}/${total}</span></div>`;
    }).join('');
    bar.innerHTML = `<div style="display:flex;gap:8px;flex-wrap:wrap;justify-content:center">${picks}</div>
      <div class="ph-pbar-actions">
        <button class="ph-mini-btn" id="ph-auto">⚄ Τυχαία</button>
        <button class="ph-mini-btn go" id="ph-pdone" ${S.toPlace.length ? 'disabled' : ''}>${T('ΜΑΧΗ →','BATTLE →')}</button>
      </div>`;
    bar.querySelectorAll('.ph-pick:not(.done)').forEach(el => el.addEventListener('click', () => { S.selType = el.dataset.type; renderPbar(); }));
    document.getElementById('ph-auto').addEventListener('click', autoPlaceCurrent);
    document.getElementById('ph-pdone').addEventListener('click', finishPlacement);
  }
  function placeUnit(idx) {
    const r = row(idx);
    if (!homeRows(S.placeSide).includes(r)) return;
    if (S.terrain[idx] === 'rock' || S.cells[idx] || !S.selType || !S.toPlace.length) return;
    const ti = S.toPlace.indexOf(S.selType); if (ti === -1) return;
    S.toPlace.splice(ti, 1);
    // you always see your OWN units; hot-seat is open info; only the AI's army is hidden
    const revealed = (S.placeSide === 'player') || (S.opponent === 'hotseat');
    S.cells[idx] = { owner: S.placeSide, type: S.selType, revealed };
    S.selType = S.toPlace[0] || null;
    if (window.PhalanxAudio) window.PhalanxAudio.place();
    renderPbar();
    pushArena();
  }
  function autoPlaceCurrent() {
    const free = []; for (let i = 0; i < 36; i++) if (homeRows(S.placeSide).includes(row(i)) && !S.cells[i] && S.terrain[i] !== 'rock') free.push(i);
    const slots = shuffle(free);
    const rev = (S.placeSide === 'player') || (S.opponent === 'hotseat');
    S.toPlace.slice().forEach((type, k) => {
      const idx = slots[k]; if (idx == null) return;
      S.cells[idx] = { owner: S.placeSide, type, revealed: rev };
    });
    S.toPlace = []; S.selType = null;
    if (window.PhalanxAudio) window.PhalanxAudio.place();
    renderPbar(); pushArena();
  }
  function finishPlacement() {
    if (S.toPlace.length) return;
    S.placeIdx++;
    if (S.placeIdx < S.placeQueue.length) { beginPlacementFor(S.placeQueue[S.placeIdx]); return; }
    // all placed → battle
    if (S.opponent === 'hotseat') {
      showCurtain(T('Η μάχη αρχίζει','The battle begins'), T('Ομάδα Α παίζει πρώτη.','Team Α moves first.'), enterBattle);
    } else enterBattle();
  }

  /* ══════════════ BATTLE ══════════════ */
  function enterBattle() {
    hideCurtain();
    S.phase = 'battle'; S.turn = 'player';
    document.getElementById('ph-pbar').innerHTML = '';
    document.getElementById('ph-pbar').style.display = 'none';
    setupKeys();
    beginTurn();
  }

  function beginTurn() {
    S.selected = -1; S.validMoves = []; S.rangedTargets = []; S.moveInfo = {};
    setTurnTag(S.turn, turnLabel(S.turn));
    updateHUD();
    if (isHuman(S.turn)) {
      setStatus(S.opponent === 'hotseat'
        ? T(`<b>${S.turn === 'player' ? 'Ομάδα Α' : 'Ομάδα Β'}</b> — επίλεξε μονάδα.`, `<b>Team ${S.turn === 'player' ? 'Α' : 'Β'}</b> — pick a unit.`)
        : T('Επίλεξε μια μονάδα σου.', 'Select one of your units.'));
      pushArena();
    } else {
      setStatus(T('Ο εχθρός σχεδιάζει…', 'The enemy plans…'));
      pushArena();
      setTimeout(aiTurn, 720);
    }
  }
  function isHuman(side) { return S.opponent === 'hotseat' ? true : side === 'player'; }
  function turnLabel(side) {
    if (S.opponent === 'hotseat') return side === 'player' ? T('ΓΥΡΟΣ Α','TEAM Α') : T('ΓΥΡΟΣ Β','TEAM Β');
    return side === 'player' ? T('Ο ΓΥΡΟΣ ΣΟΥ','YOUR TURN') : T('ΓΥΡΟΣ AI','AI TURN');
  }
  const foe = side => side === 'player' ? 'ai' : 'player';

  /* ── click routing ── */
  function onTile(idx) {
    if (S.clash) return;
    if (S.phase === 'place') { if (isHuman(S.placeSide)) placeUnit(idx); return; }
    if (S.phase !== 'battle' || !isHuman(S.turn)) return;
    battleClick(idx);
  }

  function battleClick(idx) {
    const cell = S.cells[idx];
    if (S.selected === -1) {
      if (cell && cell.owner === S.turn) selectUnit(idx);
      return;
    }
    if (idx === S.selected) { deselect(); return; }
    const info = S.moveInfo[idx];
    if (info) { commitAction(S.selected, idx, info); return; }
    if (cell && cell.owner === S.turn) { selectUnit(idx); return; }
    deselect();
  }
  function selectUnit(idx) {
    S.selected = idx;
    const { moves, ranged } = computeMoves(idx, S.turn);
    S.moveInfo = {}; S.validMoves = []; S.rangedTargets = [];
    moves.forEach(m => { S.moveInfo[m.to] = m; S.validMoves.push(m.to); });
    ranged.forEach(t => { S.moveInfo[t] = { to: t, dist: 0, ranged: true }; S.rangedTargets.push(t); });
    if (!moves.length && !ranged.length) { S.selected = -1; setStatus(T('Η μονάδα δεν έχει κίνηση.', 'That unit cannot move.')); pushArena(); return; }
    if (window.PhalanxAudio) window.PhalanxAudio.select();
    setStatus(T('Επίλεξε προορισμό ή στόχο.', 'Choose a destination or target.'));
    pushArena();
  }
  function deselect() { S.selected = -1; S.validMoves = []; S.rangedTargets = []; S.moveInfo = {}; setStatus(T('Επίλεξε μια μονάδα σου.', 'Select a unit.')); pushArena(); }

  /* ── movement generation ── */
  function computeMoves(idx, side) {
    const reimagined = S.mode === 'reimagined';
    const moves = [], ranged = [];
    const r = row(idx), c = col(idx);
    const t = S.cells[idx].type;
    const enemy = foe(side);
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    const at = (rr, cc) => (rr < 0 || rr > 5 || cc < 0 || cc > 5) ? undefined : rr * 6 + cc;
    const blocked = i => i == null || S.terrain[i] === 'rock';
    // step 1 (all units)
    for (const [dr, dc] of dirs) {
      const i = at(r + dr, c + dc);
      if (i == null || blocked(i)) continue;
      const occ = S.cells[i];
      if (!occ) moves.push({ to: i, dist: 1, ranged: false });
      else if (occ.owner === enemy) moves.push({ to: i, dist: 1, ranged: false });
    }
    if (reimagined) {
      if (t === 'cavalry') {
        for (const [dr, dc] of dirs) {
          const mid = at(r + dr, c + dc), far = at(r + 2 * dr, c + 2 * dc);
          if (mid == null || far == null) continue;
          if (blocked(mid) || blocked(far) || S.cells[mid]) continue;          // path clear
          if (S.terrain[mid] === 'ford' || S.terrain[far] === 'ford') continue; // no charge through water
          const occ = S.cells[far];
          if (!occ) moves.push({ to: far, dist: 2, ranged: false });
          else if (occ.owner === enemy) moves.push({ to: far, dist: 2, ranged: false });
        }
      }
      if (t === 'archer') {
        for (const [dr, dc] of dirs) {
          const mid = at(r + dr, c + dc), far = at(r + 2 * dr, c + 2 * dc);
          if (far == null) continue;
          if (blocked(mid) || S.cells[mid]) continue;     // need clear line of sight
          const occ = S.cells[far];
          if (occ && occ.owner === enemy && S.terrain[far] !== 'rock') ranged.push(far);
        }
      }
    }
    return { moves, ranged };
  }

  /* ── execute an action ── */
  function commitAction(from, to, info) {
    deselectSilently();
    const atk = S.cells[from], def = S.cells[to];
    if (def && def.owner === foe(atk.owner)) {
      startClash(from, to, info.ranged, info.dist || 1, atk.owner);
    } else {
      // plain move
      S.cells[to] = atk; S.cells[from] = null; S.lastMove = { from, to };
      pushArena();
      arena.glide(from, to, { owner: atk.owner, type: atk.type, revealed: atk.revealed }, { gallop: (info.dist || 1) >= 2 }, () => {});
      setTimeout(endTurn, 360);
    }
  }
  function deselectSilently() { S.selected = -1; S.validMoves = []; S.rangedTargets = []; S.moveInfo = {}; }

  /* ── clash ── */
  function startClash(from, to, ranged, dist, atkOwner) {
    const atk = S.cells[from], def = S.cells[to];
    atk.revealed = true; def.revealed = true;
    const eAtk = edge(from, def.type, true, dist, atk.owner);
    const eDef = edge(to, atk.type, false, 0, def.owner);
    S.clash = { from, to, ranged, dist, atkOwner, eAtk, eDef };
    pushArena();
    arena.clashAt(ranged ? to : to, () => showQuiz());
    setStatus(T('⚔ Σύγκρουση!', '⚔ Clash!'));
  }

  // positional edge for the unit standing at idx, fighting `oppType`
  function edge(idx, oppType, isAttacker, dist, owner) {
    if (S.mode !== 'reimagined') return 0;
    const u = S.cells[idx]; let e = 0;
    if (typeBeats(u.type, oppType)) e += 1;
    if (typeBeats(oppType, u.type)) e -= 1;
    const terr = S.terrain[idx];
    if (terr === 'hill') e += 1;
    if (terr === 'ford') e -= 1;
    if (terr === 'pass' && !isAttacker) e += 1;
    if (isAttacker && u.type === 'cavalry' && dist >= 2) e += 1;          // charge
    if (!isAttacker && u.type === 'hoplite' && adjFriendly(idx, owner, 'hoplite')) e += 1; // shield-wall
    if (adjFriendly(idx, owner, 'general')) e += 1;                       // command aura
    return e;
  }
  function adjFriendly(idx, owner, type) {
    const r = row(idx), c = col(idx);
    return [[-1,0],[1,0],[0,-1],[0,1]].some(([dr, dc]) => {
      const rr = r + dr, cc = c + dc; if (rr < 0 || rr > 5 || cc < 0 || cc > 5) return false;
      const o = S.cells[rr * 6 + cc]; return o && o.owner === owner && o.type === type;
    });
  }

  /* ── quiz ── */
  function answeringInfo() {
    const cl = S.clash, attacker = cl.atkOwner, defender = foe(attacker);
    const ansSide = isHuman(attacker) ? attacker : defender;
    const ansIsAtk = ansSide === attacker;
    return { attacker, defender, ansSide, ansIsAtk,
      eAns: ansIsAtk ? cl.eAtk : cl.eDef, eOpp: ansIsAtk ? cl.eDef : cl.eAtk };
  }
  function showQuiz() {
    const cl = S.clash, Q = window.PH_Q;
    const a = answeringInfo();
    const atkU = S.cells[cl.from], defU = S.cells[cl.to];
    // embellish clash row (left = attacker)
    fillSide('a', atkU, cl.atkOwner, cl.eAtk);
    fillSide('d', defU, foe(cl.atkOwner), cl.eDef);
    // forecast text
    const net = a.eAns - a.eOpp;
    const fore = document.getElementById('ph-fore');
    if (S.mode === 'reimagined') {
      const whose = a.ansIsAtk ? T('επίθεση','attack') : T('άμυνα','defense');
      fore.innerHTML = net > 0 ? `<b>+${net}</b> ${T('υπέρ σου','edge')}<br>${T('λάθος = ισοπαλία','wrong = standoff')}`
        : net < 0 ? `<b>${net}</b> ${T('εις βάρος σου','against')}<br>${T('απάντησε σωστά!','answer right!')}`
        : `${T('ισόπαλο','even')}<br>${T('σωστό = νίκη','right = win')}`;
    } else fore.innerHTML = T('σωστό = νίκη<br>λάθος = χάνεις', 'right = win<br>wrong = lose');

    const qObj = Q[S.qPool[S.qIdx % S.qPool.length]]; S.qIdx++; S.curQ = qObj;
    document.getElementById('ph-qtxt').textContent = qObj.q[LANG() === 'en' ? 'en' : 'gr'] || qObj.q.gr;
    document.getElementById('ph-qlbl-t').textContent = a.ansSide === 'player' || S.opponent === 'hotseat'
      ? (S.opponent === 'hotseat' ? (T(`ΑΓΩΝΑΣ — ${a.ansSide === 'player' ? 'Α' : 'Β'}`, `CLASH — ${a.ansSide === 'player' ? 'Α' : 'Β'}`)) : T('ΓΛΩΣΣΙΚΟΣ ΑΓΩΝΑΣ', 'LANGUAGE CLASH'))
      : T('ΑΜΥΝΑ!', 'DEFEND!');
    const opts = document.getElementById('ph-opts');
    opts.innerHTML = qObj.a.map((o, i) => `<button class="ph-opt" data-i="${i}"><span class="ph-opt-key">${i + 1}</span><span class="ph-opt-tx">${o}</span></button>`).join('');
    opts.querySelectorAll('.ph-opt').forEach(b => b.addEventListener('click', () => answer(+b.dataset.i)));
    document.getElementById('ph-res').textContent = ''; document.getElementById('ph-res').className = 'ph-clash-res';
    const box = document.querySelector('#ph-quiz .ph-quiz-box');
    if (box) box.classList.remove('shake', 'glow');
    document.getElementById('ph-quiz').classList.add('active');
    startQTimer();
  }
  function fillSide(which, unit, owner, e) {
    const oc = owner === 'player' ? 'p' : 'a';
    const emb = document.getElementById('ph-q' + which + '-emb');
    emb.textContent = DEFS[unit.type].lbl; emb.className = 'ph-clash-emb ' + oc;
    document.getElementById('ph-q' + which + '-nm').textContent = T(DEFS[unit.type].gr, DEFS[unit.type].en);
    const edgeEl = document.getElementById('ph-q' + which + '-edge');
    const n = Math.abs(e), pip = e >= 0 ? oc : (oc === 'p' ? 'a' : 'p');
    edgeEl.innerHTML = e === 0 ? '' : Array.from({ length: n }).map(() => `<span class="ph-edge-pip ${e > 0 ? oc : ''}"></span>`).join('');
    // show negative edges as dimmed pips
    if (e < 0) edgeEl.innerHTML = Array.from({ length: n }).map(() => `<span class="ph-edge-pip"></span>`).join('');
  }
  function startQTimer() {
    if (qTimer) { clearInterval(qTimer); qTimer = null; }
    const el = document.getElementById('ph-qtimer');
    const track = document.getElementById('ph-qbar-track'), bar = document.getElementById('ph-qbar');
    el.classList.remove('low');
    if (!S.answerSec) { el.textContent = ''; if (track) track.classList.remove('on', 'low'); return; }
    let t = S.answerSec; el.textContent = t + 's';
    // depleting bronze fuse under the question label
    if (track && bar) {
      track.classList.add('on'); track.classList.remove('low');
      bar.style.transition = 'none'; bar.style.transform = 'scaleX(1)';
      void bar.offsetWidth;
      if (!RMQ.matches) { bar.style.transition = `transform ${S.answerSec}s linear`; bar.style.transform = 'scaleX(0)'; }
    }
    qTimer = setInterval(() => {
      t--; el.textContent = t + 's';
      const low = t > 0 && t <= 5;
      el.classList.toggle('low', low);
      if (track) track.classList.toggle('low', low);
      if (low && window.PhalanxAudio) window.PhalanxAudio.tick();
      if (t <= 0) { clearInterval(qTimer); qTimer = null; answer(-1); }
    }, 1000);
  }
  function answer(choice) {
    if (qTimer) { clearInterval(qTimer); qTimer = null; }
    const qObj = S.curQ, correct = choice === qObj.c;
    const a = answeringInfo();
    // freeze the fuse where it stopped
    const fbar = document.getElementById('ph-qbar');
    if (fbar) { const tf = getComputedStyle(fbar).transform; fbar.style.transition = 'none'; if (tf && tf !== 'none') fbar.style.transform = tf; }
    // war-drum feedback on the whole tablet: gold flare or a violent shake
    const box = document.querySelector('#ph-quiz .ph-quiz-box');
    if (box && !RMQ.matches) { box.classList.remove('shake', 'glow'); void box.offsetWidth; box.classList.add(correct ? 'glow' : 'shake'); }
    document.querySelectorAll('#ph-opts .ph-opt').forEach((b, i) => {
      b.disabled = true;
      if (i === qObj.c) b.classList.add('correct');
      else if (i === choice) b.classList.add('wrong');
    });
    S.stats.q++; if (correct) S.stats.correct++;
    const net = a.eAns - a.eOpp;
    const outcome = resolveOutcome(correct, net, a);   // 'win'|'lose'|'standoff' (from answering POV)
    showResult(outcome, correct, net, a);
    setTimeout(() => applyOutcome(outcome, a), 1500);
  }
  function resolveOutcome(correct, net, a) {
    if (correct) return 'win';
    if (S.clash.ranged && a.ansIsAtk) return 'standoff';   // a missed long shot never gets the archer killed
    if (S.mode === 'reimagined' && net > 0) return 'standoff';
    return 'lose';
  }
  function showResult(outcome, correct, net, a) {
    const res = document.getElementById('ph-res');
    let msg, cls;
    if (outcome === 'win') { cls = 'win'; msg = a.ansIsAtk
      ? T('<strong>Σωστό!</strong> Συντρίβεις τον εχθρό.', '<strong>Correct!</strong> You crush the foe.')
      : T('<strong>Σωστό!</strong> Αποκρούεις την επίθεση.', '<strong>Correct!</strong> You repel the attack.'); }
    else if (outcome === 'standoff') { cls = 'draw'; msg = S.clash.ranged && a.ansIsAtk
      ? T('<strong>Αστοχία.</strong> Η βολή χάνεται — κανείς δεν πέφτει.', '<strong>Missed.</strong> The shot goes wide — no one falls.')
      : T(`<strong>Λάθος — μα η θέση σε σώζει!</strong> Ισοπαλία.`, `<strong>Wrong — but your position holds!</strong> Standoff.`); }
    else { cls = 'lose'; msg = a.ansIsAtk
      ? T('<strong>Λάθος!</strong> Η μονάδα σου χάνεται.', '<strong>Wrong!</strong> Your unit is lost.')
      : T('<strong>Λάθος!</strong> Η γραμμή σπάει.', '<strong>Wrong!</strong> The line breaks.'); }
    res.className = 'ph-clash-res ' + cls; res.innerHTML = msg;
  }
  function applyOutcome(outcome, a) {
    document.getElementById('ph-quiz').classList.remove('active');
    const cl = S.clash; const { from, to, ranged } = cl;
    const attacker = cl.atkOwner;
    // determine winner/loser tiles
    if (outcome === 'win') {
      if (a.ansIsAtk) {           // attacker wins
        arena.burst(to, 'win'); S.stats.kills++;
        S.cells[to] = null;       // remove defender
        if (!ranged) { advance(from, to); } else { pushArena(); }
      } else {                    // defender wins → kill attacker
        arena.burst(from, 'win'); S.cells[from] = null; pushArena();
      }
    } else if (outcome === 'standoff') {
      arena.burst(ranged ? to : midTile(from, to), 'standoff'); pushArena();  // nobody dies
    } else { // lose
      if (a.ansIsAtk) { arena.burst(from, 'lose'); S.cells[from] = null; pushArena(); }
      else { arena.burst(to, 'lose'); S.cells[to] = null; advance(from, to); S.stats.kills++; }
    }
    S.lastMove = { from, to }; S.clash = null;
    setTimeout(() => { if (!checkWin()) endTurn(); }, 520);
  }
  function advance(from, to) {
    const u = S.cells[from]; if (!u) { pushArena(); return; }
    S.cells[to] = u; S.cells[from] = null; pushArena();
    arena.glide(from, to, { owner: u.owner, type: u.type, revealed: u.revealed }, {}, () => {});
  }
  function midTile(from, to) { return to; }

  /* ── turn management ── */
  function endTurn() {
    if (S.clash) return;
    S.turn = foe(S.turn);
    beginTurn();
  }

  /* ── AI ── */
  function aiTurn() {
    if (S.phase !== 'battle' || S.turn !== 'ai') return;
    const acts = [];
    for (let i = 0; i < 36; i++) {
      const u = S.cells[i]; if (!u || u.owner !== 'ai') continue;
      const { moves, ranged } = computeMoves(i, 'ai');
      moves.forEach(m => acts.push({ from: i, to: m.to, dist: m.dist, ranged: false }));
      ranged.forEach(t => acts.push({ from: i, to: t, dist: 0, ranged: true }));
    }
    if (!acts.length) { endTurn(); return; }
    acts.forEach(scoreAction);
    acts.sort((x, y) => y.score - x.score);
    // difficulty: how greedily it takes the best action
    let pick;
    if (S.difficulty === 'hard') pick = acts[0];
    else if (S.difficulty === 'easy') pick = acts[(Math.random() * acts.length) | 0];
    else pick = acts[Math.random() < 0.7 ? 0 : Math.min(acts.length - 1, (Math.random() * 3) | 0)];

    const info = { to: pick.to, dist: pick.dist, ranged: pick.ranged };
    // briefly show the AI's selection
    S.selected = pick.from; S.validMoves = pick.ranged ? [] : [pick.to]; S.rangedTargets = pick.ranged ? [pick.to] : [];
    pushArena();
    setTimeout(() => { deselectSilently(); commitAction(pick.from, pick.to, info); }, 460);
  }
  function scoreAction(a) {
    let s = 0;
    const tgt = S.cells[a.to];
    const me = S.cells[a.from];
    if (tgt && tgt.owner === 'player') {
      // attacking
      s += 30;
      if (tgt.revealed && tgt.type === 'general') s += 120;     // go for the king
      const eA = edge(a.from, tgt.type, true, a.dist, 'ai');
      const eD = edge(a.to, me.type, false, 0, 'player');
      s += (eA - eD) * 14;                                       // favourable matchups
      if (a.ranged) s += 16;                                     // safe poke
      if (S.mode === 'reimagined' && tgt.revealed && typeBeats(me.type, tgt.type)) s += 18;
    } else {
      // positional: advance toward nearest player unit / general
      let best = 99, gen = 99;
      for (let i = 0; i < 36; i++) {
        const c = S.cells[i]; if (!c || c.owner !== 'player') continue;
        const d = Math.abs(row(i) - row(a.to)) + Math.abs(col(i) - col(a.to));
        best = Math.min(best, d); if (c.type === 'general' && c.revealed) gen = Math.min(gen, d);
      }
      s += (12 - best);
      if (gen < 99) s += (12 - gen) * 0.6;
      if (S.terrain[a.to] === 'hill') s += 6;          // seize high ground
      if (S.terrain[a.to] === 'ford') s -= 8;          // avoid water
      if (S.terrain[a.to] === 'pass') s += 3;
    }
    s += Math.random() * 4;
    a.score = s;
  }

  /* ── win / end ── */
  function checkWin() {
    const ai = S.cells.filter(c => c && c.owner === 'ai');
    const pl = S.cells.filter(c => c && c.owner === 'player');
    const aiGen = ai.some(c => c.type === 'general');
    const plGen = pl.some(c => c.type === 'general');
    if (!aiGen || !ai.length) { endGame('player'); return true; }
    if (!plGen || !pl.length) { endGame('ai'); return true; }
    return false;
  }
  function endGame(winner) {
    S.phase = 'over';
    const playerWon = winner === 'player';
    const hot = S.opponent === 'hotseat';
    if(!hot && typeof awardGameRewards==='function' && S.stats.correct > 0){ awardGameRewards('phalanx', { score: S.stats.correct, perfect: playerWon && S.stats.q > 0 && S.stats.correct === S.stats.q }); }
    arena.victory(playerWon || hot, () => {
      arena.stop();
      const r = document.getElementById('ph-result');
      const win = hot ? true : playerWon;
      const title = hot ? (winner === 'player' ? T('ΝΙΚΑ Η Α','TEAM Α WINS') : T('ΝΙΚΑ Η Β','TEAM Β WINS')) : (playerWon ? T('ΝΙΚΗ','VICTORY') : T('ΗΤΤΑ','DEFEAT'));
      const detail = hot ? T('Ο εχθρικός Στρατηγός έπεσε.', 'The enemy General has fallen.')
        : playerWon ? T('Ο εχθρικός Στρατηγός έπεσε. Η φάλαγγά σου κράτησε τη γραμμή — η ιστορία ανταμείβει όσους απαντούν σωστά υπό πίεση.', 'The enemy General has fallen. Your phalanx held the line — history rewards those who answer well under pressure.')
        : T('Ο Στρατηγός σου έπεσε. Η φάλαγγα ραγίζει — μελέτησε και επέστρεψε στη μάχη.', 'Your General has fallen. The phalanx breaks — study and return to battle.');
      const acc = S.stats.q ? Math.round(100 * S.stats.correct / S.stats.q) : 0;
      r.innerHTML = `${skyBg()}<div class="ph-screen active ph-result">
        <div class="ph-res-kicker">${hot ? 'ΑΓΩΝΑΣ ΦΑΛΑΓΓΑΣ' : T('Η ΜΑΧΗ ΕΚΡΙΘΗ','THE BATTLE IS DECIDED')}</div>
        ${win ? laurelSvg() : ''}
        <div class="ph-res-title ${win ? 'win' : 'lose'}">${title}</div>
        <div class="ph-res-detail">${detail}</div>
        <div class="ph-res-stats">
          <div class="ph-res-stat"><span class="v" data-cnt="${S.stats.correct}" data-suf="/${S.stats.q}">0/${S.stats.q}</span><span class="k">${T('Σωστές','Correct')}</span></div>
          <div class="ph-res-stat"><span class="v" data-cnt="${acc}" data-suf="%">0%</span><span class="k">${T('Ακρίβεια','Accuracy')}</span></div>
          <div class="ph-res-stat"><span class="v" data-cnt="${S.stats.kills}">0</span><span class="k">${T('Νίκες','Routs')}</span></div>
        </div>
        <div class="ph-res-btns">
          <button class="ph-start-btn" id="ph-again" style="width:auto;padding:14px 30px">${T('ΝΕΟΣ ΑΓΩΝΑΣ','NEW BATTLE')}</button>
          <button class="ph-start-btn sec" id="ph-menu" style="width:auto;padding:14px 30px">${T('ΜΕΝΟΥ','MENU')}</button>
        </div>
      </div>`;
      r.querySelectorAll('.ph-res-stat .v[data-cnt]').forEach(countUp);
      document.getElementById('ph-again').addEventListener('click', startGame);
      document.getElementById('ph-menu').addEventListener('click', renderLobby);
      show('ph-result');
    });
  }

  /* ── HUD / arena sync / status ── */
  function pushArena(extra) {
    if (!arena) return;
    arena.setState(Object.assign({
      cells: S.cells, terrain: S.terrain, selected: S.selected,
      validMoves: S.validMoves, rangedTargets: S.rangedTargets,
      placement: S.phase === 'place', turn: S.turn, lastMove: S.lastMove,
    }, extra || {}));
    if (S.phase !== 'place') updateHUD();
  }
  function updateHUD() {
    const aiU = S.cells.filter(c => c && c.owner === 'ai');
    const plU = S.cells.filter(c => c && c.owner === 'player');
    pips('ph-pips-a', aiU, 'a'); pips('ph-pips-p', plU, 'p');
    document.getElementById('ph-hud-blbl').textContent = S.opponent === 'hotseat' ? T('Ομάδα Β','Team Β') : T('Εχθρός','Enemy');
    document.getElementById('ph-hud-bname').textContent = S.opponent === 'hotseat' ? '' : (S.difficulty === 'hard' ? 'AI · Δύσκολο' : S.difficulty === 'easy' ? 'AI · Εύκολο' : 'AI');
    document.getElementById('ph-hud-pname').textContent = S.opponent === 'hotseat' ? T('Ομάδα Α','Team Α') : T('Εσύ','You');
  }
  function pips(id, units, oc) {
    const el = document.getElementById(id); if (!el) return;
    el.innerHTML = units.map(u => `<span class="ph-pip ${oc} live${u.type === 'general' ? ' gen' : ''}"></span>`).join('') ||
      `<span class="ph-pip ${oc}"></span>`;
  }
  function setStatus(html) {
    const el = document.getElementById('ph-status'); if (!el) return;
    el.innerHTML = html;
    if (!RMQ.matches) { el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
  }
  function setTurnTag(side, label) {
    const el = document.getElementById('ph-turn'); if (!el) return;
    el.textContent = label; el.className = 'ph-turn-tag ' + (side === 'player' ? 'p' : 'a');
    if (!RMQ.matches) { void el.offsetWidth; el.classList.add('pop'); }
  }

  /* ── curtain (hot-seat) ── */
  function showCurtain(h, p, cb) {
    const c = document.getElementById('ph-curtain');
    document.getElementById('ph-curtain-h').textContent = h;
    document.getElementById('ph-curtain-p').textContent = p;
    c.classList.add('active');
    const btn = document.getElementById('ph-curtain-btn');
    btn.onclick = () => { c.classList.remove('active'); cb && cb(); };
  }
  function hideCurtain() { document.getElementById('ph-curtain').classList.remove('active'); }

  /* ── keyboard ── */
  function setupKeys() {
    if (keyH) window.removeEventListener('keydown', keyH);
    keyH = (e) => {
      if (document.getElementById('ph-quiz').classList.contains('active')) {
        if (e.key >= '1' && e.key <= '4') { const b = document.querySelector(`#ph-opts .ph-opt[data-i="${+e.key - 1}"]`); if (b && !b.disabled) b.click(); }
        return;
      }
      if (e.key === 'Escape' && S.selected >= 0) deselect();
    };
    window.addEventListener('keydown', keyH);
  }

  /* ── AI placement ── */
  function aiPlace() {
    const back = shuffle(rowCells(0)), mid = shuffle(rowCells(1)), front = shuffle(rowCells(2));
    const put = (type, pool) => { for (const i of pool) { if (!S.cells[i] && S.terrain[i] !== 'rock') { S.cells[i] = { owner: 'ai', type, revealed: false }; return; } } 
      // fallback anywhere in top half
      for (let i = 0; i < 18; i++) if (!S.cells[i] && S.terrain[i] !== 'rock') { S.cells[i] = { owner: 'ai', type, revealed: false }; return; } };
    put('general', back); put('hoplite', front); put('hoplite', front.concat(mid)); put('archer', mid.concat(back)); put('cavalry', mid.concat(front));
  }
  function rowCells(r) { const a = []; for (let c = 0; c < 6; c++) a.push(r * 6 + c); return a; }

})();
