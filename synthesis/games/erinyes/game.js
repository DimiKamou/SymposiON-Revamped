/* ══════════════════ ΔΙΩΓΜΟΣ — engine ══════════════════
   The Pursuit of the Furies. The ΕΡΙΝΥΕΣ hunt a ΦΥΓΑΣ (Orestes) who races
   to the ΑΣΥΛΟ — the altar-sanctuary of Athena. You only move when you
   answer correctly; a 3-streak sprints two tiles.

   Two modes:
     • ΟΜΑΔΕΣ (Teams) — two teams each take a turn fleeing the same Furies;
       whoever reaches asylum (or gets furthest, fastest) wins.
     • ΜΟΝΟΜΑΧΙΑ (1v1) — you flee in leg one and hunt in leg two against a
       rival; best aggregate wins.

   API:  Erinyes.open()   Erinyes.close()
   Reads window.ER_Q (panel bridge) → falls back to window.SYM_QUESTIONS.
═══════════════════════════════════════════════════════════════════ */
const Erinyes = (() => {
  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');

  // Pick the language string from a question's `q`, tolerating {gr,en},
  // bare strings, {q:{gr,en}} wrappers and object-valued langs — so the
  // card never renders the literal "[object Object]" (host/picker banks may
  // deliver q as a bilingual object rather than a plain string).
  const QT = (q) => {
    if (q == null) return '';
    if (typeof q === 'string') return q;
    if (typeof q === 'object') {
      const v = q[L()] != null ? q[L()] : (q.gr != null ? q.gr : q.en);
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object') return QT(v);
      if (q.q !== undefined) return QT(q.q);
    }
    return String(q);
  };

  const T = (gr, en) => (L() === 'en' ? en : gr);

  const _gpPool = () => {
    const g = window.ER_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const TILES = 12, FP0 = 6, PP0 = 2, MAXR = 16;
  const FURY_NAMES = ['ΑΛΗΚΤΩ', 'ΤΙΣΙΦΟΝΗ', 'ΜΕΓΑΙΡΑ'];        // the three Furies
  const RIVAL_NAMES = ['ΟΡΕΣΤΗΣ', 'ΑΛΚΜΑΙΩΝ', 'ΕΥΜΕΝΗΣ', 'ΚΛΥΤΟΣ'];

  let st = {};

  function _fx(type, detail) { try { window.dispatchEvent(new CustomEvent('er:fx', { detail: Object.assign({ type }, detail || {}) })); } catch (_) {} }

  /* ───────── public ───────── */
  function open(gp) {
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t = document.querySelector('#er-overlay .overlay-title'); if (_t) _t.textContent = gp.title; }
    document.getElementById('er-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('er-screen-intro')) build();
    try { FX.start(); } catch (_) {}
    syncLang();
    show('er-screen-intro');
  }
  function close() {
    document.getElementById('er-overlay').classList.remove('active');
    document.body.style.overflow = '';
    try { FX.stop(); } catch (_) {}
  }

  function _ensureOverlay(gp) {
    if (document.getElementById('er-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'er-overlay';
    ov.className = 'sym-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="closeErinyes()">\u2039 <span>' + T('\u03a0\u0399\u03a3\u03a9', 'BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || '\u0394\u0399\u03a9\u0393\u039c\u039f\u03a3') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L() === 'en' ? '' : 'on') + '">\u0395\u039b</button>' +
          '<button data-lang="en" class="' + (L() === 'en' ? 'on' : '') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="er-wrap"></div></div>';
    document.body.appendChild(ov);
    ov.querySelectorAll('.ov-lang button').forEach(b => {
      b.addEventListener('click', () => {
        window.siteLang = b.dataset.lang;
        ov.querySelectorAll('.ov-lang button').forEach(x => x.classList.toggle('on', x === b));
        syncLang();
      });
    });
  }

  /* ───────── build ───────── */
  function build() {
    document.getElementById('er-wrap').innerHTML = `
<!-- INTRO -->
<div id="er-screen-intro" class="er-screen">
  ${furyCrestSVG('er-crest')}
  <div class="er-logo">ΔΙΩΓΜΟΣ</div>
  <div class="er-logo-en" data-i18n="subtitle"></div>
  <div class="er-meander" aria-hidden="true">${meanderSVG()}</div>
  <div class="er-furies" aria-hidden="true"><span>ΑΛΗΚΤΩ</span><i>✦</i><span>ΤΙΣΙΦΟΝΗ</span><i>✦</i><span>ΜΕΓΑΙΡΑ</span></div>
  <div class="er-intro-txt" data-i18n="intro"></div>
  <div class="er-mode-pick">
    <button class="er-mode" data-mode="teams">
      <span class="er-mode-ico">🏛️</span>
      <span class="er-mode-name" data-i18n="m_teams"></span>
      <span class="er-mode-desc" data-i18n="m_teams_d"></span>
    </button>
    <button class="er-mode" data-mode="1v1">
      <span class="er-mode-ico">⚔️</span>
      <span class="er-mode-name" data-i18n="m_duel"></span>
      <span class="er-mode-desc" data-i18n="m_duel_d"></span>
    </button>
  </div>
</div>

<!-- GAME -->
<div id="er-screen-game" class="er-screen">
  <div class="er-legbar">
    <span class="er-leg" id="er-leg">—</span>
    <span class="er-role" id="er-role">—</span>
    <span class="er-tally" id="er-tally"></span>
  </div>
  <div class="er-stage">
    <div class="er-lane" id="er-lane">
      <div class="er-lane-scape" aria-hidden="true">${laneScapeSVG()}</div>
      <div class="er-lane-frieze" aria-hidden="true"></div>
      <div class="er-mist m1" aria-hidden="true"></div>
      <div class="er-mist m2" aria-hidden="true"></div>
      <div class="er-lane-road" aria-hidden="true"></div>
      <div class="er-ticks" aria-hidden="true">${laneTicksHTML()}</div>
      <div class="er-pool asyl" id="er-apool" aria-hidden="true"></div>
      <div class="er-pool fury" id="er-fpool" aria-hidden="true"></div>
      <div class="er-trackline"></div>
      <div class="er-start" data-i18n="start"></div>
      <div class="er-gapfill" id="er-gapfill"></div>
      <div class="er-rays" aria-hidden="true"></div>
      <div class="er-runner pursuer" id="er-pursuer">
        <span class="er-token">${furySVG()}<span class="er-seal" id="er-pseal">Ε</span></span>
        <span class="er-rname" id="er-pname">ΕΡΙΝΥΕΣ</span>
        <span class="er-rrole" data-i18n="r_fury"></span>
      </div>
      <div class="er-runner fugitive" id="er-fugitive">
        <span class="er-token">${fugitiveSVG()}<span class="er-seal" id="er-fseal">Φ</span></span>
        <span class="er-rname" id="er-fname">ΦΥΓΑΣ</span>
        <span class="er-rrole" data-i18n="r_fug"></span>
      </div>
      <div class="er-sanctuary" id="er-sanctuary">${templeSVG()}<span data-i18n="asylum"></span></div>
    </div>
    <div class="er-gapmeter">
      <span class="er-gaplabel" data-i18n="gap"></span>
      <span class="er-gapval" id="er-gapval">4</span>
      <span class="er-gaphint" id="er-gaphint"></span>
    </div>
  </div>
  <div class="er-qbody">
    <div class="er-q-meta"><span class="er-q-num" id="er-qnum"></span><span class="er-q-line"></span></div>
    <div class="er-q-card"><div class="er-q-text" id="er-qtext"></div></div>
    <div class="er-answers" id="er-answers"></div>
    <div class="er-feedback" id="er-feedback"></div>
  </div>
</div>

<!-- END -->
<div id="er-screen-end" class="er-screen">
  <div id="er-end-art"></div>
  <div class="er-end-title" id="er-end-title"></div>
  <div class="er-end-sub" id="er-end-sub"></div>
  <div class="er-end-legs" id="er-end-legs"></div>
  <div class="er-end-btns">
    <button class="sym-btn" onclick="Erinyes._again()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="Erinyes.close()" data-i18n="exit"></button>
  </div>
</div>`;
    document.querySelectorAll('#er-wrap .er-mode').forEach(b =>
      b.addEventListener('click', () => _start(b.dataset.mode)));
  }

  const I18N = {
    subtitle: { gr: 'Η Καταδίωξη των Ερινύων', en: 'The Pursuit of the Furies' },
    intro: { gr: 'Οι <b>Ερινύες</b> καταδιώκουν τον φυγά προς το <b>Άσυλο</b> — τον βωμό της Αθηνάς. Απάντησε σωστά για να τρέξεις· τρεις σωστές στη σειρά = <b>σπριντ</b>. Ο φυγάς σώζεται φτάνοντας στον βωμό· οι Ερινύες νικούν μηδενίζοντας την απόσταση.', en: 'The <b>Furies</b> hunt the fugitive toward the <b>Asylum</b> — the altar of Athena. Answer correctly to run; three in a row = a <b>sprint</b>. The fugitive is saved by reaching the altar; the Furies win by closing the gap to zero.' },
    m_teams: { gr: 'ΟΜΑΔΕΣ', en: 'TEAMS' },
    m_teams_d: { gr: 'Δύο ομάδες — ποια ξεφεύγει πιο μακριά από τις Ερινύες;', en: 'Two teams — which flees furthest from the Furies?' },
    m_duel: { gr: 'ΜΟΝΟΜΑΧΙΑ', en: 'DUEL · 1v1' },
    m_duel_d: { gr: 'Ξέφυγε στο πρώτο σκέλος, κυνήγησε στο δεύτερο.', en: 'Flee in leg one, hunt in leg two.' },
    start: { gr: 'ΑΦΕΤΗΡΙΑ', en: 'START' },
    asylum: { gr: 'ΑΣΥΛΟ', en: 'ASYLUM' },
    gap: { gr: 'ΑΠΟΣΤΑΣΗ · GAP', en: 'GAP' },
    r_fury: { gr: 'ΕΡΙΝΥΕΣ', en: 'FURIES' },
    r_fug: { gr: 'ΦΥΓΑΣ', en: 'FUGITIVE' },
    again: { gr: 'ΝΕΟΣ ΔΙΩΓΜΟΣ', en: 'NEW PURSUIT' },
    exit: { gr: 'ΕΞΟΔΟΣ', en: 'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#er-wrap [data-i18n]').forEach(el => {
      const k = el.getAttribute('data-i18n'); if (I18N[k]) el.innerHTML = I18N[k][L()];
    });
    if (st && st.cur && document.getElementById('er-screen-game').classList.contains('active')) {
      document.getElementById('er-qtext').textContent = QT(st.cur.q);
      labelLeg();
    }
  }
  function show(id) { document.querySelectorAll('#er-wrap .er-screen').forEach(s => s.classList.remove('active')); document.getElementById(id).classList.add('active'); _fx('screen', { id }); }

  /* ───────── start ───────── */
  function _start(mode) {
    const legs = mode === 'teams'
      ? [{ role: 'fugitive', team: 'Α' }, { role: 'fugitive', team: 'Β' }]
      : [{ role: 'fugitive' }, { role: 'pursuer' }];
    st = {
      mode, legs, leg: 0, results: [],
      pool: shuffle([..._gpPool()]), idx: 0,
      furyName: pick(FURY_NAMES),
      rival: pick(RIVAL_NAMES),
      oppSkill: 0.6,
    };
    show('er-screen-game');
    beginLeg();
  }
  function _again() { show('er-screen-intro'); }

  function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0;[a[i], a[j]] = [a[j], a[i]]; } return a; }
  function pick(a) { return a[(Math.random() * a.length) | 0]; }
  function getQ() { if (st.idx >= st.pool.length) { st.pool = shuffle([..._gpPool()]); st.idx = 0; } return st.pool[st.idx++]; }

  function beginLeg() {
    const leg = st.legs[st.leg];
    st.fp = FP0; st.pp = PP0; st.streak = 0; st.oppStreak = 0; st.round = 0; st.legDone = false; st.cur = null;
    labelLeg();
    paintRunners();
    updateLane();
    const fb = document.getElementById('er-feedback');
    fb.className = 'er-feedback er-fb-intro';
    fb.innerHTML = legIntroText();
    const wrap = document.getElementById('er-answers'); wrap.innerHTML = '';
    document.getElementById('er-qtext').textContent = '';
    document.getElementById('er-qnum').textContent = '';
    setTimeout(() => { if (document.getElementById('er-screen-game').classList.contains('active')) nextQ(); }, 1600);
  }

  function legIntroText() {
    const leg = st.legs[st.leg];
    if (st.mode === 'teams') return T(`ΟΜΑΔΑ ${leg.team} — τρέξτε στο Άσυλο πριν σας φτάσουν οι Ερινύες.`, `TEAM ${leg.team} — run to the Asylum before the Furies reach you.`);
    return leg.role === 'fugitive'
      ? T('Είσαι ο ΦΥΓΑΣ — τρέξε στο Άσυλο.', 'You are the FUGITIVE — run to the Asylum.')
      : T(`Είσαι οι ΕΡΙΝΥΕΣ — κυνήγησε τον/την ${st.rival}.`, `You are the FURIES — hunt down ${st.rival}.`);
  }

  function labelLeg() {
    const leg = st.legs[st.leg];
    const n = st.legs.length;
    document.getElementById('er-leg').textContent = T(`ΣΚΕΛΟΣ ${['Α', 'Β'][st.leg]} / ${n}`, `LEG ${st.leg + 1} / ${n}`);
    const roleEl = document.getElementById('er-role');
    if (st.mode === 'teams') {
      roleEl.textContent = T(`🏃 ΟΜΑΔΑ ${leg.team}`, `🏃 TEAM ${leg.team}`);
      roleEl.className = 'er-role flee';
    } else if (leg.role === 'fugitive') {
      roleEl.textContent = T('🏃 ΦΥΓΑΣ · ΕΣΥ', '🏃 FUGITIVE · YOU');
      roleEl.className = 'er-role flee';
    } else {
      roleEl.textContent = T('🔥 ΕΡΙΝΥΕΣ · ΕΣΥ', '🔥 FURIES · YOU');
      roleEl.className = 'er-role hunt';
    }
    document.getElementById('er-tally').innerHTML = tallyText();
  }

  function tallyText() {
    if (st.mode === 'teams') {
      const done = st.results.map(r => `Ομ.${r.team}: ${r.escaped ? T('ΑΣΥΛΟ', 'ASYLUM') : 'x' + r.round}`).join(' · ');
      return done || T('Δύο σκέλη', 'Two legs');
    }
    return T(`ΣΚΕΛΗ <b>${st.leg}</b>/2`, `LEGS <b>${st.leg}</b>/2`);
  }

  function paintRunners() {
    const leg = st.legs[st.leg];
    const fugMine = leg.role === 'fugitive';
    // names + seals
    if (st.mode === 'teams') {
      document.getElementById('er-fname').textContent = T('ΟΜΑΔΑ ' + leg.team, 'TEAM ' + leg.team);
      document.getElementById('er-fseal').textContent = leg.team;
      document.getElementById('er-pname').textContent = T('ΕΡΙΝΥΕΣ', 'FURIES');
      document.getElementById('er-pseal').textContent = 'Ε';
    } else if (fugMine) {
      document.getElementById('er-fname').textContent = T('ΕΣΥ', 'YOU');
      document.getElementById('er-fseal').textContent = 'Φ';
      document.getElementById('er-pname').textContent = st.furyName;
      document.getElementById('er-pseal').textContent = 'Ε';
    } else {
      document.getElementById('er-fname').textContent = st.rival;
      document.getElementById('er-fseal').textContent = 'Φ';
      document.getElementById('er-pname').textContent = T('ΕΣΥ', 'YOU');
      document.getElementById('er-pseal').textContent = 'Ε';
    }
    document.getElementById('er-fugitive').classList.toggle('mine', fugMine);
    document.getElementById('er-pursuer').classList.toggle('mine', !fugMine && st.mode !== 'teams');
  }

  function pctOf(pos) { return (6 + (pos / TILES) * 78); }
  function laneTicksHTML() {
    let h = '';
    for (let i = 1; i < TILES; i++) h += `<i class="${i % 3 === 0 ? 'maj' : ''}" style="left:${pctOf(i)}%"></i>`;
    return h;
  }
  let _gapPrev = null;
  function updateLane() {
    document.getElementById('er-fugitive').style.left = pctOf(st.fp) + '%';
    document.getElementById('er-pursuer').style.left = pctOf(st.pp) + '%';
    const gap = Math.max(0, st.fp - st.pp);
    document.getElementById('er-gapfill').style.left = pctOf(st.pp) + '%';
    document.getElementById('er-gapfill').style.width = Math.max(0, (st.fp - st.pp) / TILES * 78) + '%';
    const gv = document.getElementById('er-gapval');
    if (_gapPrev !== null && _gapPrev !== gap) { gv.classList.remove('tick'); void gv.offsetWidth; gv.classList.add('tick'); }
    _gapPrev = gap;
    gv.textContent = gap; gv.classList.toggle('danger', gap <= 2);
    gv.classList.toggle('warn', gap > 2 && gap <= 4);
    const laneEl = document.getElementById('er-lane');
    laneEl.classList.toggle('danger', gap <= 2);
    laneEl.style.setProperty('--asyl', Math.min(1, Math.max(0, st.fp / TILES)).toFixed(3));
    const fpool = document.getElementById('er-fpool'); if (fpool) fpool.style.left = pctOf(st.pp) + '%';
    const ovl = document.getElementById('er-overlay'); if (ovl) ovl.classList.toggle('er-dread', gap <= 2);
    document.getElementById('er-sanctuary').classList.toggle('reached', st.fp >= TILES);
    const leg = st.legs[st.leg];
    const huntMode = (st.mode !== 'teams' && leg.role === 'pursuer');
    document.getElementById('er-gaphint').textContent = huntMode
      ? T('Μηδένισε την απόσταση για να πιάσεις.', 'Close the gap to seize them.')
      : T('Φτάσε το άσυλο πριν μηδενιστεί.', 'Reach asylum before it hits zero.');
  }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.legDone) return;
    st.cur = getQ(); st.answered = false;
    document.getElementById('er-qnum').textContent = T('ΓΥΡΟΣ ', 'ROUND ') + (st.round + 1);
    document.getElementById('er-qtext').textContent = QT(st.cur.q);
    const qc = document.querySelector('#er-screen-game .er-q-card');
    if (qc) { qc.classList.remove('deal'); void qc.offsetWidth; qc.classList.add('deal'); }
    const fb = document.getElementById('er-feedback'); fb.textContent = ''; fb.className = 'er-feedback';
    const wrap = document.getElementById('er-answers'); wrap.innerHTML = '';
    const keys = ['Α', 'Β', 'Γ', 'Δ'];
    st.cur.a.forEach((opt, i) => {
      const b = document.createElement('button'); b.className = 'er-ans';
      b.innerHTML = `<span class="er-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick = () => answer(i, b); wrap.appendChild(b);
    });
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered = true;
    const correct = chosen === st.cur.c;
    document.querySelectorAll('#er-answers .er-ans').forEach((b, i) => { b.disabled = true; if (i === st.cur.c) b.classList.add('correct'); });
    if (!correct) btn.classList.add('wrong');

    // human step
    let humanStep = 0;
    if (correct) { st.streak++; humanStep = (st.streak % 3 === 0) ? 2 : 1; }
    else st.streak = 0;
    // AI step
    const aiCorrect = Math.random() < st.oppSkill;
    let aiStep = 0;
    if (aiCorrect) { st.oppStreak++; aiStep = (st.oppStreak % 3 === 0) ? 2 : 1; }
    else st.oppStreak = 0;

    const leg = st.legs[st.leg];
    const humanIsFugitive = (st.mode === 'teams') || (leg.role === 'fugitive');
    let fugStep, purStep;
    if (humanIsFugitive) { fugStep = humanStep; purStep = aiStep; }
    else { purStep = humanStep; fugStep = aiStep; }

    st.fp = Math.min(TILES, st.fp + fugStep);
    st.pp = Math.min(st.fp, st.pp + purStep);
    st.round++;
    updateLane();

    const fb = document.getElementById('er-feedback');
    let parts = [correct ? (humanStep === 2 ? T('ΣΩΣΤΟ! Σπριντ +2.', 'CORRECT! Sprint +2.') : T('ΣΩΣΤΟ! +1.', 'CORRECT! +1.')) : T('ΛΑΘΟΣ — δεν κινήθηκες.', 'WRONG — you did not move.')];
    if (humanIsFugitive && aiStep) parts.push(aiStep === 2 ? T('Οι Ερινύες όρμησαν +2!', 'The Furies surged +2!') : T('Οι Ερινύες πλησιάζουν +1.', 'The Furies close +1.'));
    if (!humanIsFugitive && aiStep) parts.push(aiStep === 2 ? T('Ο φυγάς εκτοξεύτηκε +2!', 'The fugitive bolted +2!') : T('Ο φυγάς κερδίζει έδαφος +1.', 'The fugitive gains +1.'));
    fb.innerHTML = parts.join(' ');
    fb.className = 'er-feedback ' + (correct ? 'er-fb-ok' : 'er-fb-bad');
    _fx(correct ? 'step' : 'stall', { el: btn, correct, humanStep, aiStep, fugStep, purStep, humanIsFugitive, gap: Math.max(0, st.fp - st.pp), streak: st.streak });

    const caught = st.pp >= st.fp, escaped = st.fp >= TILES, timeout = st.round >= MAXR;
    if (caught) return setTimeout(() => endLeg('caught'), 1150);
    if (escaped || timeout) return setTimeout(() => endLeg('escape'), 1150);
    setTimeout(() => { if (!st.legDone) nextQ(); }, 1050);
  }

  function endLeg(outcome) {
    st.legDone = true;
    const leg = st.legs[st.leg];
    _fx(outcome === 'escape' ? 'win' : 'lose', { outcome });
    if (st.mode === 'teams') {
      st.results.push({ team: leg.team, escaped: outcome === 'escape', round: st.round, fp: st.fp });
    } else {
      const humanWon = (leg.role === 'fugitive' && outcome === 'escape') || (leg.role === 'pursuer' && outcome === 'caught');
      st.results.push({ role: leg.role, outcome, won: humanWon, round: st.round, fp: st.fp, pp: st.pp });
    }
    const fb = document.getElementById('er-feedback');
    fb.className = 'er-feedback ' + (outcome === 'escape' ? 'er-fb-win' : 'er-fb-lose');
    fb.innerHTML = legEndText(outcome, leg);
    document.getElementById('er-lane').classList.add(outcome === 'escape' ? 'flash-win' : 'flash-lose');
    document.getElementById('er-tally').innerHTML = tallyText();

    st.leg++;
    if (st.leg < st.legs.length) setTimeout(() => { document.getElementById('er-lane').classList.remove('flash-win', 'flash-lose'); beginLeg(); }, 2100);
    else setTimeout(end, 2100);
  }

  function legEndText(outcome, leg) {
    if (st.mode === 'teams') {
      return outcome === 'escape'
        ? T(`🏛️ ΟΜΑΔΑ ${leg.team} ΕΦΤΑΣΕ ΣΤΟ ΑΣΥΛΟ σε ${st.round} γύρους!`, `🏛️ TEAM ${leg.team} REACHED ASYLUM in ${st.round} rounds!`)
        : T(`🔥 ΟΜΑΔΑ ${leg.team} ΑΡΠΑΧΤΗΚΕ — έφτασε ${st.fp}/${TILES}.`, `🔥 TEAM ${leg.team} WAS SEIZED — reached ${st.fp}/${TILES}.`);
    }
    if (outcome === 'caught') return leg.role === 'pursuer' ? T('ΑΙΧΜΑΛΩΣΙΑ! Τον έπιασες.', 'CAPTURE! You seized him.') : T('Σε ΑΡΠΑΞΑΝ οι Ερινύες!', 'The Furies SEIZED you!');
    return leg.role === 'fugitive' ? T('ΑΣΥΛΟ! Σώθηκες στον βωμό.', 'ASYLUM! Saved at the altar.') : T('Ο φυγάς ΞΕΦΥΓΕ.', 'The fugitive ESCAPED.');
  }

  /* ───────── end ───────── */
  function end() {
    show('er-screen-end');
    let won, title, sub;
    if (st.mode === 'teams') {
      const [a, b] = st.results;
      const winner = teamWinner(a, b);
      won = true;
      document.getElementById('er-end-art').innerHTML = templeSVG('er-end-temple');
      if (winner === 'tie') { title = T('ΙΣΟΠΑΛΙΑ', 'A DEAD HEAT'); sub = T('Και οι δύο ομάδες πάλεψαν εξίσου με τις Ερινύες.', 'Both teams matched the Furies stride for stride.'); }
      else { title = T(`ΝΙΚΑ Η ΟΜΑΔΑ ${winner}`, `TEAM ${winner} WINS`); sub = teamReason(a, b, winner); }
    } else {
      const wins = st.results.filter(r => r.won).length;
      won = wins >= 1 && (wins === 2 || tiebreakDuel());
      document.getElementById('er-end-art').innerHTML = won ? templeSVG('er-end-temple') : furyCrestSVG('er-end-crest');
      if (wins === 2) { title = T('ΘΡΙΑΜΒΟΣ', 'TRIUMPH'); sub = T('Ξέφυγες στο άσυλο ΚΑΙ έπιασες τον φυγά. Κυριάρχησες και στους δύο ρόλους.', 'You escaped to asylum AND caught the fugitive. You mastered both roles.'); }
      else if (wins === 0) { title = T('Η ΚΑΤΑΡΑ ΣΕ ΒΡΗΚΕ', 'THE CURSE FOUND YOU'); sub = T('Έχασες και τα δύο σκέλη. Οι Ερινύες θριαμβεύουν.', 'You lost both legs. The Furies triumph.'); won = false; }
      else { title = won ? T('ΝΙΚΗ ΣΤΗ ΜΟΝΟΜΑΧΙΑ', 'DUEL WON') : T('ΗΤΤΑ ΣΤΗ ΜΟΝΟΜΑΧΙΑ', 'DUEL LOST'); sub = T('Μοιραστήκατε από ένα σκέλος — η διαφορά απόστασης έκρινε τη μονομαχία.', 'You split the legs — the margin of distance decided the duel.'); }
    }
    document.getElementById('er-screen-end').classList.toggle('er-won', !!won);
    const tEl = document.getElementById('er-end-title');
    tEl.textContent = title; tEl.className = 'er-end-title ' + (won ? 'win' : 'lose');
    document.getElementById('er-end-sub').textContent = sub;
    document.getElementById('er-end-legs').innerHTML = st.results.map((r, i) => legSummaryRow(r, i)).join('');
  }

  function teamWinner(a, b) {
    if (a.escaped && !b.escaped) return 'Α';
    if (b.escaped && !a.escaped) return 'Β';
    if (a.escaped && b.escaped) return a.round < b.round ? 'Α' : b.round < a.round ? 'Β' : 'tie';
    return a.fp > b.fp ? 'Α' : b.fp > a.fp ? 'Β' : 'tie';
  }
  function teamReason(a, b, w) {
    const win = w === 'Α' ? a : b;
    if (win.escaped) return T(`Έφτασε στο Άσυλο σε ${win.round} γύρους — πιο γρήγορα από την αντίπαλη ομάδα.`, `Reached Asylum in ${win.round} rounds — faster than the rival team.`);
    return T(`Ξέφυγε πιο μακριά (${win.fp}/${TILES}) πριν τις Ερινύες.`, `Fled furthest (${win.fp}/${TILES}) from the Furies.`);
  }
  function tiebreakDuel() {
    // 1-1 split: compare human margins — fled distance + gap closed while hunting
    const flee = st.results.find(r => r.role === 'fugitive');
    const hunt = st.results.find(r => r.role === 'pursuer');
    const myMargin = (flee ? flee.fp : 0) + (hunt ? (TILES - (hunt.fp - hunt.pp)) : 0);
    const oppMargin = (flee ? flee.pp : 0) + (hunt ? hunt.fp : 0);
    return myMargin >= oppMargin;
  }

  function legSummaryRow(r, i) {
    const label = st.mode === 'teams'
      ? T('ΟΜΑΔΑ ' + r.team, 'TEAM ' + r.team)
      : (r.role === 'fugitive' ? T('ΕΣΥ · ΦΥΓΑΣ', 'YOU · FUGITIVE') : T('ΕΣΥ · ΕΡΙΝΥΕΣ', 'YOU · FURIES'));
    const ok = st.mode === 'teams' ? r.escaped : r.won;
    const res = st.mode === 'teams'
      ? (r.escaped ? T(`Άσυλο · ${r.round} γύροι`, `Asylum · ${r.round} rounds`) : T(`Άρπαγμα · ${r.fp}/${TILES}`, `Seized · ${r.fp}/${TILES}`))
      : (r.outcome === 'escape' ? T('Άσυλο', 'Asylum') : T('Άρπαγμα', 'Capture'));
    return `<div class="er-leg-row ${ok ? 'good' : 'bad'}"><span class="er-leg-i">${['Α', 'Β'][i]}</span><span class="er-leg-l">${label}</span><span class="er-leg-r">${res}</span><span class="er-leg-mark">${ok ? '✓' : '✕'}</span></div>`;
  }

  /* ───────── art ─────────
     Black-figure identity: dark silhouettes on clay medallions, bronze rims,
     a lit altar-temple. Duplicate gradient ids are intentional & identical,
     so double injection (lane + end screen) stays visually stable. */
  function templeSVG(cls) {
    return `<svg class="${cls || ''}" viewBox="0 0 64 56" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="er-tmp-st" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0E6D0"/><stop offset="1" stop-color="#C6B896"/></linearGradient>
        <linearGradient id="er-tmp-col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#AE9D77"/><stop offset=".45" stop-color="#EFE5CD"/><stop offset="1" stop-color="#9C8B65"/></linearGradient>
        <radialGradient id="er-tmp-hg" cx="50%" cy="55%"><stop offset="0" stop-color="#F4A23C" stop-opacity=".9"/><stop offset=".55" stop-color="#E3C766" stop-opacity=".3"/><stop offset="1" stop-color="#E3C766" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse class="er-tmp-halo" cx="32" cy="30" rx="30" ry="22" fill="url(#er-tmp-hg)"/>
      <path d="M4 22.5L32 7l28 15.5z" fill="url(#er-tmp-st)" stroke="#8A7A58" stroke-width="1.2"/>
      <path d="M9 20.6L32 9.6l23 11z" fill="none" stroke="#8A7A58" stroke-opacity=".45" stroke-width=".7"/>
      <rect x="7.5" y="22.5" width="49" height="3.6" fill="#DACDB0" stroke="#8A7A58" stroke-width=".7"/>
      <g fill="url(#er-tmp-col)" stroke="#8A7A58" stroke-width=".7">
        <rect x="11" y="26.1" width="5.6" height="19"/><rect x="21.4" y="26.1" width="5.6" height="19"/>
        <rect x="37" y="26.1" width="5.6" height="19"/><rect x="47.4" y="26.1" width="5.6" height="19"/>
      </g>
      <g class="er-tmp-fire">
        <path class="er-tmp-flame f2" d="M32 26.6c-2.4 3.4-2 6.1 0 8.1 2-2 2.4-4.7 0-8.1z" fill="#E86A3C"/>
        <path class="er-tmp-flame" d="M32 29.2c-1.3 2.1-1.1 3.7 0 4.9 1.1-1.2 1.3-2.8 0-4.9z" fill="#F4D9B0"/>
        <rect x="28.4" y="34.5" width="7.2" height="2.8" rx=".7" fill="#B7A47C" stroke="#8A7A58" stroke-width=".6"/>
        <rect x="27.3" y="37.3" width="9.4" height="7.8" rx=".7" fill="url(#er-tmp-col)" stroke="#8A7A58" stroke-width=".6"/>
      </g>
      <rect x="6" y="45.1" width="52" height="3.4" fill="#DACDB0" stroke="#8A7A58" stroke-width=".7"/>
      <rect x="3.5" y="48.5" width="57" height="3.6" fill="#BFB08E" stroke="#8A7A58" stroke-width=".7"/>
    </svg>`;
  }
  function fugitiveSVG() {
    return `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="er-fug-g" cx="36%" cy="28%"><stop offset="0" stop-color="#8FB9C4"/><stop offset=".6" stop-color="#48707B"/><stop offset="1" stop-color="#1E363C"/></radialGradient>
        <linearGradient id="er-tok-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFD9AE"/><stop offset=".5" stop-color="#B08D52"/><stop offset="1" stop-color="#7A5E33"/></linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18.9" fill="url(#er-fug-g)" stroke="url(#er-tok-rim)" stroke-width="1.7"/>
      <circle cx="20" cy="20" r="16.3" fill="none" stroke="#0C171B" stroke-opacity=".55" stroke-width=".9"/>
      <g class="er-fg-run">
        <path d="M22.4 14.2C17.6 12 12.9 12.8 10 15.6c3.3.1 6.2 1 8.7 2.9z" fill="#10181B" opacity=".85"/>
        <circle cx="25.3" cy="11.6" r="2.6" fill="#10181B"/>
        <path d="M26.6 13.4c1 2.8.3 5.7-1.7 8.4l-4-1.2c.5-3.3 2.3-5.9 5.7-7.2z" fill="#10181B"/>
        <path class="er-fg-arm" d="M24.6 15.2l5 1.8-1.6 4.1" stroke="#10181B" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="er-fg-arm b" d="M22.8 15.6l-4.5 1.6.7 4" stroke="#10181B" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="er-fg-leg" d="M21.4 21.6l5.8 3.2-2.2 5.8" stroke="#10181B" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path class="er-fg-leg b" d="M20.8 22l-4.6 4-4.4-2" stroke="#10181B" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M25.9 10l1.9-1" stroke="#10181B" stroke-width="1.3" stroke-linecap="round"/>
      </g>
    </svg>`;
  }
  function furySVG() {
    return `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="er-fur-g" cx="36%" cy="28%"><stop offset="0" stop-color="#C05535"/><stop offset=".55" stop-color="#7E2418"/><stop offset="1" stop-color="#400F0A"/></radialGradient>
        <linearGradient id="er-tok-rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFD9AE"/><stop offset=".5" stop-color="#B08D52"/><stop offset="1" stop-color="#7A5E33"/></linearGradient>
      </defs>
      <circle cx="20" cy="20" r="18.9" fill="url(#er-fur-g)" stroke="url(#er-tok-rim)" stroke-width="1.7"/>
      <circle cx="20" cy="20" r="16.3" fill="none" stroke="#2B0B06" stroke-opacity=".7" stroke-width=".9"/>
      <g class="er-fy">
        <path class="er-fy-wing" d="M17.6 16.4C13.6 7.9 7.6 4.9 3.9 6.3c4.7 1.7 7.6 4.8 9.1 9.5z" fill="#140A08"/>
        <path class="er-fy-wing w2" d="M18.6 18.2C13 12.4 6.6 11 3.2 13.2c4.9.6 8.6 2.7 11.3 6.4z" fill="#140A08"/>
        <circle cx="23.9" cy="12.9" r="2.5" fill="#140A08"/>
        <path d="M22.6 10.9l-1.8-1.6M24.2 10.2l-.4-2.2M25.7 10.7l1.6-1.7" stroke="#140A08" stroke-width="1.1" stroke-linecap="round"/>
        <path d="M25.5 14.7c1.3 2.6.8 5.4-1.2 8.2l-4.2-1c.2-3.2 2-5.8 5.4-7.2z" fill="#140A08"/>
        <path class="er-fy-arm" d="M24.8 16.2l5.4-1.4" stroke="#140A08" stroke-width="2" stroke-linecap="round"/>
        <path d="M29.6 15.2l1.7-3.2" stroke="#140A08" stroke-width="1.4" stroke-linecap="round"/>
        <path class="er-torch-fl" d="M31.6 11.6c-1.6-1.9-1.5-3.6-.2-5 .3 1.4 1.5 1.8 1.9.7.6-1.5-.3-2.6-.3-2.6 2.4 1.2 3.3 3.4 2 5.6-1 1.7-2.5 2.1-3.4 1.3z" fill="#F4A23C"/>
        <path d="M20.4 21.9c-2.9 2.6-4.4 5.3-4.6 8.2l5.5-1.6 1.7-6z" fill="#140A08" opacity=".92"/>
        <path class="er-fy-leg" d="M21.8 22.4l4.6 4.2-1 4.6" stroke="#140A08" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </g>
    </svg>`;
  }
  function furyCrestSVG(cls) {
    return `<svg class="${cls || ''}" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs><radialGradient id="er-crest-g" cx="42%" cy="34%"><stop offset="0" stop-color="#C7553A"/><stop offset=".7" stop-color="#8E2D22"/><stop offset="1" stop-color="#5E1B14"/></radialGradient></defs>
      <circle cx="60" cy="60" r="46" fill="url(#er-crest-g)" stroke="#3A140E" stroke-width="2"/>
      <circle class="er-crest-ring" cx="60" cy="60" r="37" fill="none" stroke="#F4D9B0" stroke-opacity=".3" stroke-width="2" stroke-dasharray="3 5"/>
      <!-- three torch flames for the three Furies -->
      <g fill="#E3A14A" stroke="#9E3B2E" stroke-width="1.4">
        <path class="er-fl" d="M60 34c-9-5-12-15-5-23 1 6 6 8 8 4 3-7-2-12-2-12 12 4 17 14 12 24-4 8-9 9-13 7z"/>
        <path class="er-fl f2" d="M40 64c-7-4-9-12-4-19 1 5 5 6 6 3 2-6-1-9-1-9 9 3 13 11 9 18-3 6-12 9-16 6z" opacity=".82"/>
        <path class="er-fl f3" d="M80 64c7-4 9-12 4-19-1 5-5 6-6 3-2-6 1-9 1-9-9 3-13 11-9 18 3 6 12 9 16 6z" opacity=".82"/>
      </g>
    </svg>`;
  }
  function laneScapeSVG() {
    // Distant sacred way filling the lane's sky band — silhouette scenery only:
    // ruined stoa groups on the horizon, layered hills, a bone moon (that bleeds
    // when the Furies close in), far stars, the Furies' storm-glow on the left
    // and the asylum dawn on the right (driven by --asyl). Pure decoration.
    const col = (x, h, cap) => {
      let s = `<rect x="${x - 6.5}" y="${96 - h}" width="13" height="${h}" rx="1.2"/>`;
      if (cap) s += `<rect x="${x - 9.5}" y="${91 - h}" width="19" height="5.4" rx="1"/>`;
      return s;
    };
    const stoaA = [46, 92, 138].map(x => col(x, 56, true)).join('') +
      `<rect x="30" y="30.6" width="124" height="6.4" rx="1.4"/>`;
    const ruins = col(318, 26, false) + col(362, 42, false) +
      `<rect x="330" y="88.4" width="17" height="7.6" rx="2" transform="rotate(-7 338 92)"/>`;
    const stoaB = [548, 594, 640, 686].map(x => col(x, 56, true)).join('') +
      `<rect x="532" y="30.6" width="170" height="6.4" rx="1.4"/>`;
    const stoaC = [872, 918, 964].map(x => col(x, 56, true)).join('') +
      `<rect x="856" y="30.6" width="124" height="6.4" rx="1.4"/>` +
      `<path d="M853 30.6L918 9l65 21.6" fill="none" stroke="#2A150C" stroke-width="5" stroke-linejoin="round"/>`;
    const stars = [[64, 14, 1.1], [180, 26, .8], [238, 9, 1.3], [420, 18, .9], [502, 8, 1.2], [610, 22, .8], [758, 12, 1.1], [806, 30, .7], [930, 16, .9]]
      .map((s, i) => `<circle class="er-tw${i % 2 ? ' b' : ''}" cx="${s[0]}" cy="${s[1]}" r="${s[2]}"/>`).join('');
    return `<svg viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <radialGradient id="er-scape-storm-g" cx="50%" cy="50%"><stop offset="0" stop-color="#B4462F" stop-opacity=".5"/><stop offset=".55" stop-color="#7E2418" stop-opacity=".24"/><stop offset="1" stop-color="#7E2418" stop-opacity="0"/></radialGradient>
        <radialGradient id="er-scape-dawn-g" cx="50%" cy="50%"><stop offset="0" stop-color="#E3C766" stop-opacity=".55"/><stop offset=".55" stop-color="#C4A448" stop-opacity=".2"/><stop offset="1" stop-color="#C4A448" stop-opacity="0"/></radialGradient>
        <radialGradient id="er-scape-moon-g" cx="36%" cy="32%"><stop offset="0" stop-color="#F3EADB"/><stop offset=".72" stop-color="#D9C8A4"/><stop offset="1" stop-color="#AE9A72"/></radialGradient>
        <radialGradient id="er-scape-halo-g" cx="50%" cy="50%"><stop offset="0" stop-color="#E8DCC2" stop-opacity=".3"/><stop offset="1" stop-color="#E8DCC2" stop-opacity="0"/></radialGradient>
      </defs>
      <ellipse class="er-scape-storm" cx="24" cy="88" rx="310" ry="74" fill="url(#er-scape-storm-g)"/>
      <ellipse class="er-scape-dawn" cx="988" cy="90" rx="330" ry="82" fill="url(#er-scape-dawn-g)"/>
      <g fill="#E8DCC2" opacity=".7">${stars}</g>
      <circle class="er-scape-halo" cx="292" cy="26" r="27" fill="url(#er-scape-halo-g)"/>
      <circle cx="292" cy="26" r="11.5" fill="url(#er-scape-moon-g)" opacity=".92"/>
      <circle class="er-scape-moonblood" cx="292" cy="26" r="11.5" fill="#B4462F" opacity="0"/>
      <g class="er-scape-birds" fill="none" stroke="#341009" stroke-width="2.3" stroke-linecap="round" opacity=".85">
        <path d="M118 34q5-6 10 0q5-6 10 0"/>
        <path d="M158 47q4-5 8 0q4-5 8 0"/>
        <path d="M96 56q3.5-4 7 0q3.5-4 7 0"/>
      </g>
      <path d="M0 76Q140 58 300 72T640 66Q780 58 1000 70v30H0Z" fill="#150B07"/>
      <path d="M0 88Q220 76 460 86T1000 82v18H0Z" fill="#1C0E09"/>
      <g fill="#26120A">${stoaA}${ruins}${stoaB}${stoaC}</g>
      <g fill="#0E0604" opacity=".92">
        <path d="M226 96c-4-22 4-38 10-46 6 8 14 24 10 46z"/>
        <path d="M762 96c-3-18 4-32 9-39 5 7 12 21 9 39z"/>
      </g>
    </svg>`;
  }
  function meanderSVG() {
    let d = '';
    for (let i = 0; i < 11; i++) { const x = i * 21; d += `M${x + 1} 10V2H${x + 16}V7H${x + 6}V5H${x + 11}`; }
    return `<svg viewBox="0 0 232 12" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><path d="${d}" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>`;
  }
  function wingSVG() {
    return `<svg viewBox="0 0 340 160" fill="none" aria-hidden="true">
      <g fill="#070302" fill-opacity=".85">
        <path d="M170 84C120 44 60 30 8 46c38 6 64 18 84 40-26-10-56-12-84-2 36 8 62 22 80 44 8-22 26-38 82-44z"/>
        <path d="M170 84c50-40 110-54 162-38-38 6-64 18-84 40 26-10 56-12 84-2-36 8-62 22-80 44-8-22-26-38-82-44z"/>
        <ellipse cx="170" cy="92" rx="20" ry="11"/>
      </g>
    </svg>`;
  }

  /* ───────── FX runtime — presentation only ─────────
     Builds the ambient layers game.css styles (embers, dread veil, wing
     shadows, spark/dust/wind/float particles, capture-iris, escape-flood)
     and reacts to the er:fx events the engine dispatches. It never reads or
     writes game state — only element positions — and close() tears down
     every timer, rAF and particle it owns. */
  const FX = (() => {
    let built = false, raf = 0, lastT = 0, parts = [], live = [];
    let emberT = 0, trailT = 0, wingT = 0, oneShots = [];
    const EMBERC = ['#F4A23C', '#E86A3C', '#C7553A'];
    const GOLD = ['#F7EBC8', '#E3C766', '#C4A448'];
    const BLOOD = ['#E86A3C', '#B4462F', '#9E3B2E'];
    const ASH = ['#B9A88F', '#867660', '#5A4E3C'];
    const RM = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } };
    const rr = (a, b) => a + Math.random() * (b - a);
    const ovEl = () => document.getElementById('er-overlay');
    const ovOn = () => { const o = ovEl(); return !!(o && o.classList.contains('active')); };
    const gameOn = () => { const s = document.getElementById('er-screen-game'); return ovOn() && !!(s && s.classList.contains('active')); };
    const center = (sel) => { const el = document.querySelector(sel); if (!el) return null; const r = el.getBoundingClientRect(); return r.width ? { x: r.left + r.width / 2, y: r.top + r.height / 2, r } : null; };
    const later = (fn, ms) => { const t = setTimeout(() => { oneShots = oneShots.filter(x => x !== t); try { fn(); } catch (_) {} }, ms); oneShots.push(t); return t; };

    function buildLayers() {
      const o = ovEl(); if (!o || built) return; built = true;
      const mk = (cls, html) => { const d = document.createElement('div'); d.className = cls; if (html) d.innerHTML = html; d.setAttribute('aria-hidden', 'true'); o.appendChild(d); return d; };
      mk('erfx-embers'); mk('erfx-dread'); mk('erfx-hit'); mk('erfx-glory'); mk('erfx-wing', wingSVG());
    }
    const layer = (cls) => { buildLayers(); const o = ovEl(); return o ? o.querySelector('.' + cls) : null; };

    /* ── ambient ── */
    function ember() {
      if (!ovOn() || document.hidden) return;
      const box = layer('erfx-embers'); if (!box || box.childElementCount > 15) return;
      const d = document.createElement('div'); d.className = 'fx-ember';
      const s = 2 + Math.random() * 3.2, warm = Math.random() < .8;
      d.style.cssText = 'left:' + (Math.random() * 100).toFixed(1) + '%;width:' + s.toFixed(1) + 'px;height:' + s.toFixed(1) + 'px;' +
        'background:radial-gradient(circle,' + (warm ? '#F4A23C,#E86A3C' : '#F3E9D5,#E3C766') + ' 60%,transparent);' +
        '--eo:' + (.22 + Math.random() * .5).toFixed(2) + ';--sw:' + (Math.random() * 70 - 35).toFixed(0) + 'px;' +
        'animation:erEmberUp ' + (5.5 + Math.random() * 5).toFixed(2) + 's linear forwards;';
      box.appendChild(d);
      d.addEventListener('animationend', () => d.remove());
      later(() => d.remove(), 12000);
    }
    function trail() {                       // ember wake behind the Erinyes
      if (!gameOn() || document.hidden || RM()) return;
      const c = center('#er-pursuer .er-token'); if (!c) return;
      spark(c.x - 10, c.y + rr(-8, 10), Math.random() < .5 ? 3 : 2, EMBERC, { vx: [-54, -14], vy: [-44, -10], g: 8, life: [.9, 1.7], size: [1.6, 3.4] });
      // grace motes rise from the altar as the fugitive nears asylum
      const lane = document.getElementById('er-lane');
      const asyl = lane ? parseFloat(lane.style.getPropertyValue('--asyl')) || 0 : 0;
      if (asyl > .55 && Math.random() < .55) {
        const s = center('#er-sanctuary svg');
        if (s) spark(s.x + rr(-20, 14), s.y + rr(0, 18), 1, GOLD, { vx: [-7, 7], vy: [-26, -10], g: -16, life: [1, 1.9], size: [1.2, 2.6] });
      }
    }
    function wingLoop() {
      wingT = setTimeout(wingLoop, 9000 + Math.random() * 8000);
      if (gameOn() && !document.hidden) wingPass(true);
    }
    function wingPass(slow) {
      if (RM()) return;
      const w = layer('erfx-wing'); if (!w) return;
      w.classList.remove('fly', 'slow'); void w.offsetWidth;
      if (slow) w.classList.add('slow');
      w.style.top = (2 + Math.random() * 24).toFixed(0) + '%';
      w.classList.add('fly');
    }

    /* ── particles ── */
    function spark(x, y, n, colors, o) {
      if (RM() || !ovOn()) return;
      o = o || {};
      const vx = o.vx || [-70, 70], vy = o.vy || [-130, -20], sz = o.size || [2, 4.6], lf = o.life || [.55, 1.1];
      for (let i = 0; i < n; i++) {
        if (parts.length > 90) break;
        const el = document.createElement('div'); el.className = 'erfx-spark';
        const s = rr(sz[0], sz[1]), c = colors[(Math.random() * colors.length) | 0];
        const px = x + rr(-4, 4), py = y + rr(-4, 4);
        el.style.cssText = 'left:0;top:0;width:' + s.toFixed(1) + 'px;height:' + s.toFixed(1) + 'px;background:' + c +
          ';box-shadow:0 0 ' + (s * 2.4).toFixed(1) + 'px ' + c + ';transform:translate3d(' + px + 'px,' + py + 'px,0);';
        (ovEl() || document.body).appendChild(el);
        parts.push({ el, x: px, y: py, vx: rr(vx[0], vx[1]), vy: rr(vy[0], vy[1]), g: o.g != null ? o.g : 220, life: rr(lf[0], lf[1]), age: 0 });
      }
      if (parts.length && !raf) { lastT = performance.now(); raf = requestAnimationFrame(step); }
    }
    function step(t) {
      raf = 0;
      const dt = Math.min(.05, (t - lastT) / 1000); lastT = t;
      parts = parts.filter(p => {
        p.age += dt;
        if (p.age >= p.life || !p.el.isConnected) { p.el.remove(); return false; }
        p.vy += p.g * dt; p.x += p.vx * dt; p.y += p.vy * dt;
        const k = 1 - p.age / p.life;
        p.el.style.transform = 'translate3d(' + p.x.toFixed(1) + 'px,' + p.y.toFixed(1) + 'px,0) scale(' + (.5 + k * .5).toFixed(3) + ')';
        p.el.style.opacity = (k < .6 ? k / .6 : 1).toFixed(3);
        return true;
      });
      if (parts.length) raf = requestAnimationFrame(step);
    }
    function float(x, y, txt, color, size) {
      if (RM() || !ovOn()) return;
      const el = document.createElement('div'); el.className = 'erfx-float';
      el.textContent = txt;
      el.style.cssText = 'left:' + x.toFixed(0) + 'px;top:' + y.toFixed(0) + 'px;color:' + (color || '#E3C766') + ';font-size:' + (size || 15) + 'px;';
      (ovEl() || document.body).appendChild(el); live.push(el);
      later(() => { el.remove(); live = live.filter(e => e !== el); }, 1400);
    }
    function dust(x, y, tint) {
      if (RM() || !ovOn()) return;
      for (let i = 0; i < 3; i++) {
        const el = document.createElement('div'); el.className = 'erfx-dust' + (tint ? ' ' + tint : '');
        el.style.left = (x + rr(-9, 9)).toFixed(0) + 'px'; el.style.top = (y + rr(-3, 3)).toFixed(0) + 'px';
        el.style.animationDelay = (i * 60) + 'ms';
        (ovEl() || document.body).appendChild(el); live.push(el);
        later(() => { el.remove(); live = live.filter(e => e !== el); }, 950 + i * 70);
      }
    }
    function wind(tint) {
      if (RM()) return;
      const lane = document.getElementById('er-lane'); if (!lane) return;
      for (let i = 0; i < 5; i++) {
        const el = document.createElement('i'); el.className = 'erfx-wind' + (tint ? ' ' + tint : '');
        el.style.top = (12 + Math.random() * 74).toFixed(0) + '%';
        el.style.width = (46 + Math.random() * 90).toFixed(0) + 'px';
        el.style.animationDelay = (i * 45) + 'ms';
        lane.appendChild(el); live.push(el);
        later(() => { el.remove(); live = live.filter(e => e !== el); }, 850 + i * 50);
      }
    }
    function dash(id) {
      if (RM()) return;
      const r = document.getElementById(id); if (!r) return;
      r.classList.remove('dash'); void r.offsetWidth; r.classList.add('dash');
      later(() => r.classList.remove('dash'), 700);
    }
    function shake(big) {
      if (RM()) return;
      const s = document.querySelector('#er-screen-game .er-stage'); if (!s) return;
      const cls = big ? 'er-shake' : 'er-shake-sm';
      s.classList.remove('er-shake', 'er-shake-sm'); void s.offsetWidth; s.classList.add(cls);
      later(() => s.classList.remove(cls), 640);
    }
    function iris(x, y) {
      if (RM()) return;
      const h = layer('erfx-hit'); if (!h) return;
      h.style.setProperty('--ix', x.toFixed(0) + 'px'); h.style.setProperty('--iy', y.toFixed(0) + 'px');
      h.classList.remove('on'); void h.offsetWidth; h.classList.add('on');
      later(() => h.classList.remove('on'), 2050);
    }
    function glory(x, y) {
      if (RM()) return;
      const g = layer('erfx-glory'); if (!g) return;
      g.style.setProperty('--gx', (x / window.innerWidth * 100).toFixed(1) + '%');
      g.style.setProperty('--gy', (y / window.innerHeight * 100).toFixed(1) + '%');
      g.classList.remove('on'); void g.offsetWidth; g.classList.add('on');
      later(() => g.classList.remove('on'), 2050);
    }

    /* ── event choreography ── */
    function oppFx(d) {
      const oppStep = d.humanIsFugitive ? d.purStep : d.fugStep;
      if (!oppStep) return;
      const opSel = d.humanIsFugitive ? '#er-pursuer .er-token' : '#er-fugitive .er-token';
      const c = center(opSel);
      if (c) {
        dust(c.x - 14, c.y + 20, d.humanIsFugitive ? 'crimson' : '');
        if (oppStep === 2) float(c.x, c.y - 34, d.humanIsFugitive ? T('ΟΡΜΗ +2', 'SURGE +2') : '+2', '#C7553A', 15);
      }
      dash(d.humanIsFugitive ? 'er-pursuer' : 'er-fugitive');
      if (oppStep === 2 && d.humanIsFugitive) { wingPass(false); shake(false); }
    }
    function onStep(d) {
      const b = d.el && d.el.getBoundingClientRect ? d.el.getBoundingClientRect() : null;
      if (b) spark(b.left + 30, b.top + b.height / 2, d.humanStep === 2 ? 15 : 8, GOLD, { vy: [-150, -40], vx: [-90, 90] });
      const meSel = d.humanIsFugitive ? '#er-fugitive .er-token' : '#er-pursuer .er-token';
      const c = center(meSel);
      if (c) {
        float(c.x, c.y - 36, d.humanStep === 2 ? T('ΣΠΡΙΝΤ +2', 'SPRINT +2') : '+1', d.humanIsFugitive ? '#E3C766' : '#E86A3C', d.humanStep === 2 ? 17 : 14);
        dust(c.x - 16, c.y + 20);
        spark(c.x - 10, c.y + 14, d.humanStep === 2 ? 10 : 5, d.humanIsFugitive ? GOLD : EMBERC, { vx: [-130, -30], vy: [-60, -6], g: 50, size: [1.5, 3.2] });
      }
      dash(d.humanIsFugitive ? 'er-fugitive' : 'er-pursuer');
      if (d.humanStep === 2) wind(d.humanIsFugitive ? '' : 'crimson');
      oppFx(d);
    }
    function onStall(d) {
      const b = d.el && d.el.getBoundingClientRect ? d.el.getBoundingClientRect() : null;
      if (b) spark(b.left + 30, b.top + b.height / 2, 6, ASH, { vy: [-42, -8], vx: [-40, 40], g: -22, size: [2.4, 5], life: [.7, 1.2] });
      oppFx(d);
    }
    function onWin() {
      const c = center('#er-sanctuary svg') || center('#er-sanctuary');
      if (c) {
        glory(c.x, c.y);
        spark(c.x, c.y - 6, 26, GOLD, { vx: [-130, 130], vy: [-200, -30], g: 150, life: [.8, 1.6] });
        later(() => spark(c.x, c.y - 4, 16, GOLD, { vx: [-90, 90], vy: [-160, -20], g: 130 }), 260);
      }
      wind('');
    }
    function onLose() {
      const c = center('#er-fugitive .er-token');
      if (c) { iris(c.x, c.y); spark(c.x, c.y, 22, BLOOD, { vx: [-150, 150], vy: [-170, 40], g: 180, life: [.7, 1.4] }); }
      shake(true); wingPass(false);
    }
    function onFx(e) {
      const d = (e && e.detail) || {};
      switch (d.type) {
        case 'screen': {
          const o = ovEl();
          if (o && d.id !== 'er-screen-game') o.classList.remove('er-dread');
          if (ovOn()) start();
          break;
        }
        case 'step': onStep(d); break;
        case 'stall': onStall(d); break;
        case 'win': onWin(d); break;
        case 'lose': onLose(d); break;
      }
    }

    /* ── lifecycle ── */
    function start() {
      buildLayers();
      if (RM()) return;                       // static veil only — no timers
      if (!emberT) emberT = setInterval(ember, 430);
      if (!trailT) trailT = setInterval(trail, 400);
      if (!wingT) wingT = setTimeout(wingLoop, 5000 + Math.random() * 6000);
    }
    function stop() {
      clearInterval(emberT); emberT = 0;
      clearInterval(trailT); trailT = 0;
      clearTimeout(wingT); wingT = 0;
      oneShots.forEach(clearTimeout); oneShots = [];
      if (raf) { cancelAnimationFrame(raf); raf = 0; }
      parts.forEach(p => p.el.remove()); parts = [];
      live.forEach(el => el.remove()); live = [];
      const o = ovEl();
      if (o) {
        o.classList.remove('er-dread');
        const eb = o.querySelector('.erfx-embers'); if (eb) eb.innerHTML = '';
        const h = o.querySelector('.erfx-hit'); if (h) h.classList.remove('on');
        const g = o.querySelector('.erfx-glory'); if (g) g.classList.remove('on');
        const w = o.querySelector('.erfx-wing'); if (w) w.classList.remove('fly', 'slow');
      }
    }
    return { start, stop, onFx };
  })();
  if (!window.__erFxHook) {
    window.__erFxHook = true;
    window.addEventListener('er:fx', (e) => { try { FX.onFx(e); } catch (_) {} });
  }

  return { open, close, _start, _again, syncLang };
})();
window.Erinyes = Erinyes;

/* ── Games-Panel entry points ── */
window.openErinyes = function (gp) { Erinyes.open(gp || {}); };
window.closeErinyes = function () { Erinyes.close(); };
