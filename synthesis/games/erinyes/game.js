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
    syncLang();
    show('er-screen-intro');
  }
  function close() {
    document.getElementById('er-overlay').classList.remove('active');
    document.body.style.overflow = '';
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
      <div class="er-trackline"></div>
      <div class="er-start" data-i18n="start"></div>
      <div class="er-gapfill" id="er-gapfill"></div>
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
      document.getElementById('er-qtext').textContent = st.cur.q[L()];
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
  function updateLane() {
    document.getElementById('er-fugitive').style.left = pctOf(st.fp) + '%';
    document.getElementById('er-pursuer').style.left = pctOf(st.pp) + '%';
    const gap = Math.max(0, st.fp - st.pp);
    document.getElementById('er-gapfill').style.left = pctOf(st.pp) + '%';
    document.getElementById('er-gapfill').style.width = Math.max(0, (st.fp - st.pp) / TILES * 78) + '%';
    const gv = document.getElementById('er-gapval');
    gv.textContent = gap; gv.classList.toggle('danger', gap <= 2);
    document.getElementById('er-lane').classList.toggle('danger', gap <= 2);
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
    document.getElementById('er-qtext').textContent = st.cur.q[L()];
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
    _fx(correct ? 'step' : 'stall', { el: btn });

    const caught = st.pp >= st.fp, escaped = st.fp >= TILES, timeout = st.round >= MAXR;
    if (caught) return setTimeout(() => endLeg('caught'), 1150);
    if (escaped || timeout) return setTimeout(() => endLeg('escape'), 1150);
    setTimeout(() => { if (!st.legDone) nextQ(); }, 1050);
  }

  function endLeg(outcome) {
    st.legDone = true;
    const leg = st.legs[st.leg];
    _fx(outcome === 'escape' ? 'win' : 'lose');
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

  /* ───────── art ───────── */
  function templeSVG(cls) {
    return `<svg class="${cls || ''}" viewBox="0 0 64 52" fill="none" aria-hidden="true">
      <path d="M5 22L32 7 59 22Z" fill="#E8E0CE" stroke="#9C8E72" stroke-width="1.4"/>
      <rect x="8" y="22" width="48" height="4" fill="#DCD2BA"/>
      <g fill="#E8E0CE" stroke="#9C8E72" stroke-width=".8"><rect x="12" y="26" width="6" height="18"/><rect x="22" y="26" width="6" height="18"/><rect x="36" y="26" width="6" height="18"/><rect x="46" y="26" width="6" height="18"/></g>
      <rect x="7" y="44" width="50" height="4.5" fill="#CFC4AA" stroke="#9C8E72" stroke-width=".8"/>
    </svg>`;
  }
  function fugitiveSVG() { return `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="url(#er-fug-g)"/><defs><radialGradient id="er-fug-g" cx="38%" cy="32%"><stop offset="0" stop-color="#7FB0BC"/><stop offset="1" stop-color="#2E4A50"/></radialGradient></defs></svg>`; }
  function furySVG() { return `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="url(#er-fur-g)"/><defs><radialGradient id="er-fur-g" cx="38%" cy="32%"><stop offset="0" stop-color="#C7553A"/><stop offset="1" stop-color="#5E1B14"/></radialGradient></defs></svg>`; }
  function furyCrestSVG(cls) {
    return `<svg class="${cls || ''}" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <defs><radialGradient id="er-crest-g" cx="42%" cy="34%"><stop offset="0" stop-color="#C7553A"/><stop offset=".7" stop-color="#8E2D22"/><stop offset="1" stop-color="#5E1B14"/></radialGradient></defs>
      <circle cx="60" cy="60" r="46" fill="url(#er-crest-g)" stroke="#3A140E" stroke-width="2"/>
      <circle cx="60" cy="60" r="37" fill="none" stroke="#F4D9B0" stroke-opacity=".3" stroke-width="2" stroke-dasharray="3 5"/>
      <!-- three torch flames for the three Furies -->
      <g fill="#E3A14A" stroke="#9E3B2E" stroke-width="1.4">
        <path d="M60 34c-9-5-12-15-5-23 1 6 6 8 8 4 3-7-2-12-2-12 12 4 17 14 12 24-4 8-9 9-13 7z"/>
        <path d="M40 64c-7-4-9-12-4-19 1 5 5 6 6 3 2-6-1-9-1-9 9 3 13 11 9 18-3 6-12 9-16 6z" opacity=".82"/>
        <path d="M80 64c7-4 9-12 4-19-1 5-5 6-6 3-2-6 1-9 1-9-9 3-13 11-9 18 3 6 12 9 16 6z" opacity=".82"/>
      </g>
    </svg>`;
  }

  return { open, close, _start, _again, syncLang };
})();
window.Erinyes = Erinyes;

/* ── Games-Panel entry points ── */
window.openErinyes = function (gp) { Erinyes.open(gp || {}); };
window.closeErinyes = function () { Erinyes.close(); };
