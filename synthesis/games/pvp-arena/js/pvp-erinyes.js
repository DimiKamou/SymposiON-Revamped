/* ════════════════════════════════════════════════════════════════════
   SymposiON — PvP Arena · ΔΙΩΓΜΟΣ (The Pursuit of the Furies)
   (js/pvp-erinyes.js)
   An ASYMMETRIC chase. One side are the ΕΡΙΝΥΕΣ (Furies / Pursuers), the
   other are the ΦΥΓΑΔΕΣ (Fugitive / Orestes) racing to the ΑΣΥΛΟ — the
   altar-sanctuary of Athena. SymposiON twist: you only advance when you
   ANSWER CORRECTLY. A correct answer steps your runner; a 3-streak sprints
   two tiles. Best-of-2: you flee in leg one, you hunt in leg two — so both
   roles are tested. Fugitive reaches sanctuary = escape; pursuer closes the
   gap to zero = caught. Decoupled from the lobby: driven entirely by ctx.
   ════════════════════════════════════════════════════════════════════ */
window.PvPErinyes = (function () {
  const T = 12;                 // tiles from start to sanctuary
  const FP0 = 6, PP0 = 2;       // fugitive / pursuer start tiles
  const MAXR = 16;              // round cap → fugitive outlasts
  const cssvar = (v) => `var(${v})`;

  let ctx, st, over, oppSkill, answered, curQ, msg, msgKind, legIdx, legs, meTotal, oppTotal, lastFx;

  /* ── lifecycle ── */
  function start(c) {
    ctx = c; over = false;
    legIdx = 0; meTotal = 0; oppTotal = 0;
    legs = [{ role: 'fugitive' }, { role: 'pursuer' }];   // the human's role per leg
    oppSkill = Math.max(0.34, Math.min(0.9, (ctx.opp.rating - 850) / 1150));
    if (ctx.show) ctx.show();
    beginLeg();
  }
  function stop() { over = true; }

  function beginLeg() {
    if (over) return;
    const role = legs[legIdx].role;
    st = { fp: FP0, pp: PP0, role, streak: 0, oppStreak: 0, round: 0, done: false, intro: true };
    msg = role === 'fugitive'
      ? 'ΣΚΕΛΟΣ ' + greekLeg() + ' — Είσαι ο ΦΥΓΑΣ. Τρέξε στο Άσυλο πριν σε φτάσουν.'
      : 'ΣΚΕΛΟΣ ' + greekLeg() + ' — Είσαι οι ΕΡΙΝΥΕΣ. Κλείσε την απόσταση και άρπαξέ τον.';
    msgKind = 'intro';
    render();
    setTimeout(() => { if (!over) { st.intro = false; ask(); } }, 1500);
  }
  function greekLeg() { return ['Α', 'Β', 'Γ'][legIdx] || (legIdx + 1); }

  function ask() {
    if (over || st.done) return;
    answered = false;
    curQ = ctx.nextQuestion();
    render();
  }

  function answer(i) {
    if (over || st.done || answered || !curQ) return;
    answered = true;
    const humanCorrect = (i === curQ.c);
    resolveRound(humanCorrect, i);
  }

  function resolveRound(humanCorrect, picked) {
    // human marker step
    let humanStep = 0;
    if (humanCorrect) { st.streak++; humanStep = (st.streak % 3 === 0) ? 2 : 1; }
    else st.streak = 0;
    // AI marker step (skill roll, with its own streak for sprints)
    const aiCorrect = Math.random() < oppSkill;
    let aiStep = 0;
    if (aiCorrect) { st.oppStreak++; aiStep = (st.oppStreak % 3 === 0) ? 2 : 1; }
    else st.oppStreak = 0;

    // map steps to fugitive / pursuer
    let fugStep, purStep;
    if (st.role === 'fugitive') { fugStep = humanStep; purStep = aiStep; }
    else { purStep = humanStep; fugStep = aiStep; }

    st.fp = Math.min(T, st.fp + fugStep);
    st.pp = Math.min(st.fp, st.pp + purStep);
    st.round++;

    // feedback
    const gap = st.fp - st.pp;
    let parts = [];
    parts.push(humanCorrect ? (humanStep === 2 ? 'ΣΩΣΤΟ! Σπριντ +2.' : 'ΣΩΣΤΟ! +1.') : 'ΛΑΘΟΣ — δεν κινήθηκες.');
    if (st.role === 'fugitive') {
      if (aiStep) parts.push(aiStep === 2 ? 'Οι Ερινύες όρμησαν +2.' : 'Οι Ερινύες πλησιάζουν +1.');
    } else {
      if (aiStep) parts.push(aiStep === 2 ? 'Ο φυγάς εκτοξεύτηκε +2.' : 'Ο φυγάς κερδίζει έδαφος +1.');
    }
    msg = parts.join(' ');
    msgKind = humanCorrect ? 'good' : 'bad';
    lastFx = humanCorrect ? 'step' : 'stall';

    // resolve end states
    const caught = st.pp >= st.fp;
    const escaped = st.fp >= T;
    const timeout = st.round >= MAXR;
    render(picked);

    if (caught) return setTimeout(() => endLeg('caught'), 1100);
    if (escaped) return setTimeout(() => endLeg('escape'), 1100);
    if (timeout) return setTimeout(() => endLeg('escape'), 1100);   // outlasted → fugitive escapes
    setTimeout(() => { if (!over) ask(); }, 1050);
  }

  function endLeg(outcome) {
    if (over) return;
    st.done = true;
    const humanFled = st.role === 'fugitive';
    const humanWon = (humanFled && outcome === 'escape') || (!humanFled && outcome === 'caught');
    // performance points (tiebreak): how the human's own marker fared
    const myPerf = (humanFled ? st.fp : st.pp) * 18;
    const oppPerf = (humanFled ? st.pp : st.fp) * 18;
    meTotal += (humanWon ? 1000 : 0) + myPerf;
    oppTotal += (humanWon ? 0 : 1000) + oppPerf;

    msg = outcome === 'caught'
      ? (humanWon ? 'ΑΙΧΜΑΛΩΣΙΑ! Έπιασες τον φυγά.' : 'Σε ΑΡΠΑΞΑΝ οι Ερινύες!')
      : (humanWon ? 'ΑΣΥΛΟ! Έφτασες τον βωμό — σώθηκες.' : 'Ο φυγάς ΞΕΦΥΓΕ στο άσυλο.');
    msgKind = humanWon ? 'good' : 'bad';
    lastFx = humanWon ? 'win' : 'lose';
    render();

    legIdx++;
    if (legIdx < legs.length) setTimeout(() => { if (!over) beginLeg(); }, 1900);
    else setTimeout(finishDuel, 1900);
  }

  function finishDuel() {
    if (over) return;
    over = true;
    const meWon = meTotal > oppTotal;
    if (ctx.onDone) ctx.onDone({ winner: meWon ? 'me' : 'opp', meScore: Math.round(meTotal), oppScore: Math.round(oppTotal) });
  }

  /* ── render ── */
  function pct(pos) { return (6 + (pos / T) * 78).toFixed(2); }   // 6%..84% of lane
  function runner(role) {
    // who controls this role this leg: human or opp
    const mine = (st.role === role);
    const who = mine ? ctx.me : ctx.opp;
    const pos = role === 'fugitive' ? st.fp : st.pp;
    const name = mine ? 'ΕΣΥ' : (ctx.opp.name + (ctx.opp.isBot ? ' ·bot' : ''));
    const label = role === 'fugitive' ? 'ΦΥΓΑΣ' : 'ΕΡΙΝΥΕΣ';
    return `<div class="er-runner ${role} ${mine ? 'mine' : ''}" style="left:${pct(pos)}%">
      <span class="er-token">${role === 'fugitive' ? fugitiveSVG() : furySVG()}<span class="er-seal">${who.seal}</span></span>
      <span class="er-rname">${name}</span>
      <span class="er-rrole">${label}</span>
    </div>`;
  }

  function render(picked) {
    const m = ctx.mode, acc = m.accent;
    const showQ = (!st.intro && !st.done && !over && curQ && answered === false);
    const gap = st.fp - st.pp;
    const danger = gap <= 2;
    const sc = ctx.screenEl;
    sc.innerHTML = `
      <div class="pvp-wrap" style="max-width:940px">
        <div class="pvp-kicker"><b>ΔΙΩΓΜΟΣ /</b> ${ctx.subject.gr} · ${ctx.subject.en}</div>
        <h1 class="pvp-h1" style="font-size:clamp(24px,3.6vw,36px);margin-bottom:12px">ΔΙΩΓΜΟΣ<span class="en">Answer right to run — the Furies hunt Orestes to the altar of asylum.</span></h1>

        <div class="er-legbar">
          <span class="er-leg">ΣΚΕΛΟΣ ${greekLeg()} / Β</span>
          <span class="er-role ${st.role === 'fugitive' ? 'flee' : 'hunt'}">${st.role === 'fugitive' ? '🏃 ΦΥΓΑΣ · YOU FLEE' : '🔥 ΕΡΙΝΥΕΣ · YOU HUNT'}</span>
          <span class="er-tally">ΣΚΕΛΗ <b>${legIdx}</b>/2 ολοκληρωμένα</span>
        </div>

        <div class="er-stage" style="--accent:${cssvar(acc)}">
          <div class="er-lane ${danger ? 'danger' : ''} ${lastFx === 'win' ? 'flash-win' : ''} ${lastFx === 'lose' ? 'flash-lose' : ''}">
            <div class="er-trackline"></div>
            <div class="er-start">ΑΦΕΤΗΡΙΑ</div>
            <div class="er-gapfill" style="left:${pct(st.pp)}%;width:${Math.max(0, (st.fp - st.pp) / T * 78).toFixed(2)}%"></div>
            ${runner('pursuer')}
            ${runner('fugitive')}
            <div class="er-sanctuary ${st.fp >= T ? 'reached' : ''}">${templeSVG()}<span>ΑΣΥΛΟ</span></div>
          </div>
          <div class="er-gapmeter">
            <span class="er-gaplabel">ΑΠΟΣΤΑΣΗ · GAP</span>
            <span class="er-gapval ${danger ? 'danger' : ''}">${Math.max(0, gap)}</span>
            <span class="er-gaphint">${st.role === 'fugitive' ? 'Φτάσε το άσυλο πριν μηδενιστεί.' : 'Μηδένισε την απόσταση για να πιάσεις.'}</span>
          </div>
        </div>

        ${showQ ? `
          <div class="pvp-panel pvp-q er-q" style="--accent:${cssvar(acc)};max-width:680px;margin:18px auto 0">
            <div class="qsubj">Η ΥΛΗ ΣΟΥ · ${ctx.subject.gr} / ${ctx.subject.en}</div>
            <p class="qtext" id="er-qtext">${curQ.q.gr}</p>
            <div class="pvp-ans" id="er-ans" style="grid-template-columns:1fr 1fr">${curQ.a.map((a, i) => `<button data-i="${i}">${a}</button>`).join('')}</div>
          </div>`
        : `<div class="er-msg ${msgKind}">${msg}</div>`}

        <div class="pet-rule" style="max-width:680px;margin:14px auto 0">Σωστή απάντηση = ένα βήμα· τρία στη σειρά = σπριντ (+2). Ο φυγάς νικά φτάνοντας στο Άσυλο· οι Ερινύες νικούν μηδενίζοντας την απόσταση. Παίζεις και τους δύο ρόλους — ο καλύτερος συνολικά κερδίζει τη μονομαχία.</div>
      </div>`;
    const ans = sc.querySelector('#er-ans');
    if (ans) ans.querySelectorAll('button').forEach(b => {
      b.addEventListener('click', () => answer(+b.dataset.i));
      if (picked != null && +b.dataset.i === picked) b.classList.add(picked === curQ.c ? 'correct' : 'wrong');
    });
  }

  /* ── art ── */
  function templeSVG() {
    return `<svg viewBox="0 0 48 40" fill="none" aria-hidden="true">
      <path d="M4 16L24 5 44 16Z" fill="#E8E0CE" stroke="#9C8E72" stroke-width="1.4"/>
      <rect x="6" y="16" width="36" height="3" fill="#DCD2BA"/>
      <g fill="#E8E0CE" stroke="#9C8E72" stroke-width=".8"><rect x="9" y="19" width="4" height="15"/><rect x="17" y="19" width="4" height="15"/><rect x="27" y="19" width="4" height="15"/><rect x="35" y="19" width="4" height="15"/></g>
      <rect x="5" y="34" width="38" height="3.5" fill="#CFC4AA" stroke="#9C8E72" stroke-width=".8"/>
    </svg>`;
  }
  function fugitiveSVG() {
    return `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="url(#er-fug-g)"/><defs><radialGradient id="er-fug-g" cx="38%" cy="32%"><stop offset="0" stop-color="#7FB0BC"/><stop offset="1" stop-color="#2E4A50"/></radialGradient></defs></svg>`;
  }
  function furySVG() {
    return `<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="20" fill="url(#er-fur-g)"/><defs><radialGradient id="er-fur-g" cx="38%" cy="32%"><stop offset="0" stop-color="#C7553A"/><stop offset="1" stop-color="#5E1B14"/></radialGradient></defs></svg>`;
  }

  return { start, stop };
})();
