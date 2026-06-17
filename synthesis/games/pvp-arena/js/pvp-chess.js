/* ════════════════════════════════════════════════════════════════════
   SymposiON — PvP Arena · ΠΕΤΤΕΙΑ  (js/pvp-chess.js)
   The ancient-Greek strategy board. You must ANSWER A QUESTION CORRECTLY
   to earn the right to move. Pieces slide orthogonally (like a rook);
   you capture by FLANKING — bracketing an enemy piece between two of your
   own. First to TARGET captures (or reducing the rival to one piece) wins.
   Decoupled from the lobby: driven entirely by the ctx passed to start().
   ════════════════════════════════════════════════════════════════════ */
window.PvPChess = (function () {
  const N = 7, TARGET = 4, MOVE_CAP = 90;
  const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  const inb = (r, c) => r >= 0 && r < N && c >= 0 && c < N;

  let ctx, g, turn, caps, plies, sel, legal, awaiting, over, curQ, msg, msgKind, lastCaps;

  function start(c) {
    ctx = c;
    g = Array.from({ length: N }, () => Array(N).fill(null));
    for (let col = 0; col < N; col++) { g[0][col] = 'B'; g[N - 1][col] = 'A'; }
    turn = 'A'; caps = { A: 0, B: 0 }; plies = 0; over = false;
    sel = null; legal = []; awaiting = false; curQ = null; msg = ''; msgKind = ''; lastCaps = [];
    if (ctx.show) ctx.show();
    beginTurn();
  }
  function stop() { over = true; }

  /* ── rules ── */
  function count(side) { let n = 0; for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (g[r][c] === side) n++; return n; }
  function legalMoves(r, c) {
    const out = [];
    for (const [dr, dc] of DIRS) { let nr = r + dr, nc = c + dc; while (inb(nr, nc) && !g[nr][nc]) { out.push([nr, nc]); nr += dr; nc += dc; } }
    return out;
  }
  function captureCount(r, c, side) {  // captures if `side` lands at r,c
    const enemy = side === 'A' ? 'B' : 'A'; let n = 0;
    for (const [dr, dc] of DIRS) { const ar = r + dr, ac = c + dc, br = r + 2 * dr, bc = c + 2 * dc; if (inb(ar, ac) && g[ar][ac] === enemy && inb(br, bc) && g[br][bc] === side) n++; }
    return n;
  }
  function doMove(fr, fc, tr, tc, side) {
    g[tr][tc] = side; g[fr][fc] = null; plies++;
    const enemy = side === 'A' ? 'B' : 'A'; const captured = [];
    for (const [dr, dc] of DIRS) { const ar = tr + dr, ac = tc + dc, br = tr + 2 * dr, bc = tc + 2 * dc; if (inb(ar, ac) && g[ar][ac] === enemy && inb(br, bc) && g[br][bc] === side) { g[ar][ac] = null; captured.push([ar, ac]); } }
    caps[side] += captured.length;
    lastCaps = captured;
    return captured.length;
  }

  /* ── turn flow ── */
  function beginTurn() {
    if (over) return;
    if (checkEnd()) return;
    if (turn === 'A') { awaiting = false; sel = null; legal = []; curQ = ctx.nextQuestion(); setMsg('Απάντησε σωστά για να κινηθείς.', ''); render(); }
    else { render(); setTimeout(botTurn, 850); }
  }
  function answer(i) {
    if (over || turn !== 'A' || awaiting || !curQ) return;
    if (i === curQ.c) { awaiting = true; setMsg('Σωστά! Διάλεξε πέττα και προορισμό.', 'good'); }
    else { setMsg('Λάθος — χάνεις τη σειρά σου.', 'bad'); curQ = null; render(); if (checkEnd()) return; turn = 'B'; setTimeout(beginTurn, 950); return; }
    render();
  }
  function clickCell(r, c) {
    if (over || turn !== 'A' || !awaiting) return;
    if (g[r][c] === 'A') { sel = [r, c]; legal = legalMoves(r, c); render(); return; }
    if (sel && legal.some(([lr, lc]) => lr === r && lc === c)) {
      const got = doMove(sel[0], sel[1], r, c, 'A');
      sel = null; legal = []; awaiting = false; curQ = null;
      setMsg(got ? `Αιχμαλώτισες ${got} ${got === 1 ? 'πέττα' : 'πέττες'}!` : 'Κίνηση ολοκληρώθηκε.', got ? 'good' : '');
      render(); if (checkEnd()) return;
      turn = 'B'; setTimeout(beginTurn, 750);
    }
  }
  function botTurn() {
    if (over) return;
    const skill = Math.max(0.42, Math.min(0.92, (ctx.opp.rating - 900) / 1100));
    if (Math.random() < skill) {
      const mv = botBestMove();
      if (mv) { const got = doMove(mv[0], mv[1], mv[2], mv[3], 'B'); setMsg(`${ctx.opp.name}: σωστά — ${got ? 'αιχμαλωτίζει ' + got + '!' : 'κινείται.'}`, ''); }
      else setMsg(`${ctx.opp.name}: δεν έχει κίνηση.`, '');
    } else { setMsg(`${ctx.opp.name}: λάθος — χάνει τη σειρά.`, ''); }
    render(); if (checkEnd()) return;
    turn = 'A'; setTimeout(beginTurn, 700);
  }
  function botBestMove() {
    const moves = [];
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) if (g[r][c] === 'B') for (const [tr, tc] of legalMoves(r, c)) moves.push([r, c, tr, tc]);
    if (!moves.length) return null;
    let best = [], bestScore = -1e9;
    for (const mv of moves) {
      let sc = captureCount(mv[2], mv[3], 'B') * 12;
      sc += (3 - Math.abs(mv[2] - 3)) + (3 - Math.abs(mv[3] - 3));    // gravitate to center
      sc += (mv[2] - mv[0]);                                          // advance downward toward A
      sc += Math.random() * 1.5;
      if (sc > bestScore) { bestScore = sc; best = [mv]; } else if (sc === bestScore) best.push(mv);
    }
    return best[Math.floor(Math.random() * best.length)];
  }

  function checkEnd() {
    if (caps.A >= TARGET || count('B') <= 1) return finish(true);
    if (caps.B >= TARGET || count('A') <= 1) return finish(false);
    if (plies >= MOVE_CAP) return finish(caps.A >= caps.B);
    return false;
  }
  function finish(meWon) {
    over = true;
    setMsg(meWon ? 'ΝΙΚΗ — αιχμαλώτισες τις πέττες του αντιπάλου!' : 'Ήττα — ο αντίπαλος κυριάρχησε.', meWon ? 'good' : 'bad');
    render();
    const meScore = meWon ? 1000 + caps.A * 60 : caps.A * 60;
    const oppScore = meWon ? caps.B * 60 : 1000 + caps.B * 60;
    setTimeout(() => { if (ctx.onDone) ctx.onDone({ winner: meWon ? 'me' : 'opp', meScore, oppScore }); }, 1300);
    return true;
  }

  function setMsg(t, k) { msg = t; msgKind = k || ''; }

  /* ── render ── */
  function render() {
    const m = ctx.mode, acc = m.accent;
    const yourTurnQ = (turn === 'A' && !awaiting && !over && curQ);
    let cells = '';
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const v = g[r][c];
      const dark = (r + c) % 2 === 1;
      const isLegal = legal.some(([lr, lc]) => lr === r && lc === c);
      const seld = sel && sel[0] === r && sel[1] === c;
      const canClick = (turn === 'A' && awaiting && (v === 'A' || isLegal));
      const wasCap = lastCaps.some(([cr, cc]) => cr === r && cc === c);
      cells += `<button class="pet-cell ${dark ? 'dark' : 'light'} ${isLegal ? 'legal' : ''} ${canClick ? 'clickable' : ''} ${wasCap ? 'cap' : ''}" data-r="${r}" data-c="${c}">`
        + (v ? `<span class="pet-piece ${v === 'A' ? 'a' : 'b'} ${seld ? 'sel' : ''}">${v === 'A' ? ctx.me.seal : ctx.opp.seal}</span>` : '')
        + `</button>`;
    }
    ctx.screenEl.innerHTML = `
      <div class="pvp-wrap" style="max-width:920px">
        <div class="pvp-kicker"><b>ΠΕΤΤΕΙΑ /</b> ${ctx.subject.gr} · ${ctx.subject.en}</div>
        <h1 class="pvp-h1" style="font-size:clamp(24px,3.6vw,36px);margin-bottom:16px">ΠΕΤΤΕΙΑ<span class="en">Answer correctly to earn each move — flank to capture.</span></h1>
        <div class="pvp-petteia-wrap">
          <div class="pet-board" style="grid-template-columns:repeat(${N},1fr)">${cells}</div>
          <div class="pet-side">
            <div class="pet-caps">
              <div class="pet-cap me"><b>${caps.A}</b><span>ΕΣΥ · αιχμάλωτοι</span></div>
              <div class="pet-cap"><b>${caps.B}</b><span>${ctx.opp.name} · captures</span></div>
            </div>
            <div class="pet-turn"><span class="dot ${turn === 'A' ? 'a' : 'b'}"></span>${over ? 'ΤΕΛΟΣ' : (turn === 'A' ? 'Η ΣΕΙΡΑ ΣΟΥ · YOUR TURN' : 'Ο ΑΝΤΙΠΑΛΟΣ ΣΚΕΦΤΕΤΑΙ…')}</div>
            ${yourTurnQ ? `
              <div class="pvp-panel pvp-q" style="--accent:${cssvar(acc)};padding:18px 18px 20px">
                <div class="qsubj">Η ΥΛΗ ΣΟΥ · ${ctx.subject.gr}</div>
                <p class="qtext" id="pet-qtext" style="font-size:clamp(17px,2.2vw,21px);margin-bottom:16px">${curQ.q.gr}</p>
                <div class="pvp-ans" id="pet-ans" style="grid-template-columns:1fr">${curQ.a.map((a, i) => `<button data-i="${i}">${a}</button>`).join('')}</div>
              </div>` : `<div class="pet-msg ${msgKind}">${msg}</div>`}
            <div class="pet-rule">ΣΤΟΧΟΣ: ${TARGET} αιχμάλωτες πέττες. Κίνηση ευθεία (οριζόντια/κάθετα). Αιχμαλωσία = παγίδευσε εχθρική πέττα ανάμεσα σε δύο δικές σου.</div>
          </div>
        </div>
      </div>`;
    // wire
    ctx.screenEl.querySelectorAll('.pet-cell').forEach(b => b.addEventListener('click', () => clickCell(+b.dataset.r, +b.dataset.c)));
    const ans = ctx.screenEl.querySelector('#pet-ans');
    if (ans) ans.querySelectorAll('button').forEach(b => b.addEventListener('click', () => answer(+b.dataset.i)));
  }
  function cssvar(v) { return `var(${v})`; }

  return { start, stop };
})();
