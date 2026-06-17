/* ════════════════════════════════════════════════════════════════════
   SymposiON — PvP Arena · ΣΚΑΚΙ (real chess)   (js/pvp-skaki.js)
   Standard chess. The SymposiON twist: you may only move when you ANSWER
   A QUESTION CORRECTLY. Answer wrong and you FORFEIT THE TURN — your rival
   moves instead. Full rules: legal move generation, check / checkmate /
   stalemate, castling, promotion (auto-queen), en passant. The rival is a
   2-ply alpha-beta engine whose strength scales with its rating, and who
   also occasionally "blunders a turn" so the answer-to-move feels fair.
   Decoupled from the lobby — driven entirely by the ctx passed to start().
   ════════════════════════════════════════════════════════════════════ */
window.PvPSkaki = (function () {
  const GLYPH = { p:'♟', n:'♞', b:'♝', r:'♜', q:'♛', k:'♚' };
  const VAL   = { p:1, n:3, b:3.2, r:5, q:9, k:0 };
  const inb = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const other = (col) => col === 'w' ? 'b' : 'w';

  // piece-square tables (white perspective, row 0 = black back rank … row 7 = white)
  const PST_P = [[0,0,0,0,0,0,0,0],[5,5,5,5,5,5,5,5],[1,1,2,3,3,2,1,1],[0.5,0.5,1,2.5,2.5,1,0.5,0.5],[0,0,0,2,2,0,0,0],[0.5,-0.5,-1,0,0,-1,-0.5,0.5],[0.5,1,1,-2,-2,1,1,0.5],[0,0,0,0,0,0,0,0]];
  const PST_N = [[-5,-4,-3,-3,-3,-3,-4,-5],[-4,-2,0,0,0,0,-2,-4],[-3,0,1,1.5,1.5,1,0,-3],[-3,0.5,1.5,2,2,1.5,0.5,-3],[-3,0,1.5,2,2,1.5,0,-3],[-3,0.5,1,1.5,1.5,1,0.5,-3],[-4,-2,0,0.5,0.5,0,-2,-4],[-5,-4,-3,-3,-3,-3,-4,-5]];
  const PST_C = [[-2,-1,-1,-1,-1,-1,-1,-2],[-1,0,0,0,0,0,0,-1],[-1,0,0.5,1,1,0.5,0,-1],[-1,0.5,0.5,1,1,0.5,0.5,-1],[-1,0,1,1,1,1,0,-1],[-1,1,1,1,1,1,1,-1],[-1,0.5,0,0,0,0,0.5,-1],[-2,-1,-1,-1,-1,-1,-1,-2]];

  let ctx, st, turn, sel, legalSel, over, msg, msgKind, lastMove, capW, capB, awaiting, curQ;

  /* ── setup ── */
  function start(c) {
    ctx = c;
    st = freshBoard();
    turn = 'w';                       // player is white, at the bottom, moves up
    sel = null; legalSel = []; over = false; awaiting = false; curQ = null;
    msg = ''; msgKind = ''; lastMove = null; capW = []; capB = [];
    if (ctx.show) ctx.show();
    beginTurn();
  }
  function stop() { over = true; }

  function freshBoard() {
    const b = Array.from({ length: 8 }, () => Array(8).fill(null));
    const back = ['r','n','b','q','k','b','n','r'];
    for (let c = 0; c < 8; c++) {
      b[0][c] = { t: back[c], c: 'b' };
      b[1][c] = { t: 'p', c: 'b' };
      b[6][c] = { t: 'p', c: 'w' };
      b[7][c] = { t: back[c], c: 'w' };
    }
    return { b, ep: null, cr: { wK:true, wQ:true, bK:true, bQ:true } };
  }
  function clone(s) {
    return { b: s.b.map(row => row.map(x => x ? { ...x } : null)), ep: s.ep ? [...s.ep] : null, cr: { ...s.cr } };
  }

  /* ── attack / check detection ── */
  function attacked(s, r, c, by) {
    const b = s.b;
    // pawns
    const pr = by === 'w' ? r + 1 : r - 1;
    for (const pc of [c - 1, c + 1]) if (inb(pr, pc)) { const p = b[pr][pc]; if (p && p.c === by && p.t === 'p') return true; }
    // knights
    for (const [dr, dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) { const nr=r+dr, nc=c+dc; if (inb(nr,nc)) { const p=b[nr][nc]; if (p && p.c===by && p.t==='n') return true; } }
    // king
    for (let dr=-1; dr<=1; dr++) for (let dc=-1; dc<=1; dc++) { if (!dr&&!dc) continue; const nr=r+dr, nc=c+dc; if (inb(nr,nc)) { const p=b[nr][nc]; if (p && p.c===by && p.t==='k') return true; } }
    // sliding — rook/queen
    for (const [dr,dc] of [[-1,0],[1,0],[0,-1],[0,1]]) { let nr=r+dr, nc=c+dc; while (inb(nr,nc)) { const p=b[nr][nc]; if (p) { if (p.c===by && (p.t==='r'||p.t==='q')) return true; break; } nr+=dr; nc+=dc; } }
    // sliding — bishop/queen
    for (const [dr,dc] of [[-1,-1],[-1,1],[1,-1],[1,1]]) { let nr=r+dr, nc=c+dc; while (inb(nr,nc)) { const p=b[nr][nc]; if (p) { if (p.c===by && (p.t==='b'||p.t==='q')) return true; break; } nr+=dr; nc+=dc; } }
    return false;
  }
  function kingPos(s, col) { for (let r=0;r<8;r++) for (let c=0;c<8;c++){ const p=s.b[r][c]; if (p && p.c===col && p.t==='k') return [r,c]; } return null; }
  function inCheck(s, col) { const k = kingPos(s, col); return k ? attacked(s, k[0], k[1], other(col)) : false; }

  /* ── pseudo-legal move generation ── */
  function pseudo(s, col) {
    const b = s.b, out = [];
    const add = (fr,fc,tr,tc,extra) => out.push(Object.assign({ from:[fr,fc], to:[tr,tc] }, extra || {}));
    for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
      const p = b[r][c]; if (!p || p.c !== col) continue;
      if (p.t === 'p') {
        const dir = col === 'w' ? -1 : 1, startRow = col === 'w' ? 6 : 1, lastRow = col === 'w' ? 0 : 7;
        const one = r + dir;
        if (inb(one, c) && !b[one][c]) {
          if (one === lastRow) add(r,c,one,c,{ promo:true }); else add(r,c,one,c);
          const two = r + 2*dir;
          if (r === startRow && !b[two][c]) add(r,c,two,c,{ dbl:true });
        }
        for (const dc of [-1,1]) {
          const nr=r+dir, nc=c+dc; if (!inb(nr,nc)) continue;
          const tgt=b[nr][nc];
          if (tgt && tgt.c !== col) { if (nr===lastRow) add(r,c,nr,nc,{ promo:true }); else add(r,c,nr,nc); }
          else if (s.ep && s.ep[0]===nr && s.ep[1]===nc) add(r,c,nr,nc,{ ep:true });
        }
      } else if (p.t === 'n') {
        for (const [dr,dc] of [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]) { const nr=r+dr,nc=c+dc; if (!inb(nr,nc)) continue; const t=b[nr][nc]; if (!t||t.c!==col) add(r,c,nr,nc); }
      } else if (p.t === 'k') {
        for (let dr=-1;dr<=1;dr++) for (let dc=-1;dc<=1;dc++){ if(!dr&&!dc)continue; const nr=r+dr,nc=c+dc; if(!inb(nr,nc))continue; const t=b[nr][nc]; if(!t||t.c!==col) add(r,c,nr,nc); }
        // castling
        const rights = s.cr, opp = other(col);
        if (col==='w' && r===7 && c===4 && !inCheck(s,'w')) {
          if (rights.wK && b[7][5]==null && b[7][6]==null && b[7][7] && b[7][7].t==='r' && !attacked(s,7,5,opp) && !attacked(s,7,6,opp)) add(7,4,7,6,{ castle:'K' });
          if (rights.wQ && b[7][3]==null && b[7][2]==null && b[7][1]==null && b[7][0] && b[7][0].t==='r' && !attacked(s,7,3,opp) && !attacked(s,7,2,opp)) add(7,4,7,2,{ castle:'Q' });
        }
        if (col==='b' && r===0 && c===4 && !inCheck(s,'b')) {
          if (rights.bK && b[0][5]==null && b[0][6]==null && b[0][7] && b[0][7].t==='r' && !attacked(s,0,5,opp) && !attacked(s,0,6,opp)) add(0,4,0,6,{ castle:'K' });
          if (rights.bQ && b[0][3]==null && b[0][2]==null && b[0][1]==null && b[0][0] && b[0][0].t==='r' && !attacked(s,0,3,opp) && !attacked(s,0,2,opp)) add(0,4,0,2,{ castle:'Q' });
        }
      } else {
        const rays = p.t==='r' ? [[-1,0],[1,0],[0,-1],[0,1]]
                   : p.t==='b' ? [[-1,-1],[-1,1],[1,-1],[1,1]]
                   : [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]];
        for (const [dr,dc] of rays) { let nr=r+dr,nc=c+dc; while(inb(nr,nc)){ const t=b[nr][nc]; if(!t){ add(r,c,nr,nc); } else { if(t.c!==col) add(r,c,nr,nc); break; } nr+=dr; nc+=dc; } }
      }
    }
    return out;
  }

  function apply(s, m) {
    const n = clone(s);
    const b = n.b, [fr,fc] = m.from, [tr,tc] = m.to;
    const pc = b[fr][fc];
    n.ep = null;
    // en passant capture
    if (m.ep) { b[fr][tc] = null; }
    // move
    b[tr][tc] = pc; b[fr][fc] = null;
    if (m.promo) pc.t = 'q';
    if (m.dbl) n.ep = [(fr+tr)/2, fc];
    // castle rook
    if (m.castle === 'K') { b[tr][5] = b[tr][7]; b[tr][7] = null; }
    if (m.castle === 'Q') { b[tr][3] = b[tr][0]; b[tr][0] = null; }
    // castling rights
    if (pc.t === 'k') { if (pc.c==='w'){ n.cr.wK=false; n.cr.wQ=false; } else { n.cr.bK=false; n.cr.bQ=false; } }
    const touch = (r,c) => {
      if (r===7&&c===7) n.cr.wK=false; if (r===7&&c===0) n.cr.wQ=false;
      if (r===0&&c===7) n.cr.bK=false; if (r===0&&c===0) n.cr.bQ=false;
    };
    touch(fr,fc); touch(tr,tc);
    return n;
  }

  function legal(s, col) {
    return pseudo(s, col).filter(m => { const n = apply(s, m); return !inCheck(n, col); });
  }

  /* ── AI: 2-ply alpha-beta ── */
  function evaluate(s, col) {
    let sc = 0;
    for (let r=0;r<8;r++) for (let c=0;c<8;c++){ const p=s.b[r][c]; if(!p) continue;
      let v = VAL[p.t];
      const rr = p.c==='w' ? r : 7-r;          // mirror table for black
      if (p.t==='p') v += PST_P[rr][c]*0.1;
      else if (p.t==='n') v += PST_N[rr][c]*0.1;
      else if (p.t==='b'||p.t==='q'||p.t==='k') v += PST_C[rr][c]*0.06;
      sc += (p.c===col ? v : -v);
    }
    return sc;
  }
  function negamax(s, col, depth, alpha, beta) {
    const moves = legal(s, col);
    if (!moves.length) return inCheck(s, col) ? -9999 + (3-depth) : 0;
    if (depth === 0) return evaluate(s, col);
    // order: captures first
    moves.sort((a,b) => capVal(s,b) - capVal(s,a));
    let best = -1e9;
    for (const m of moves) {
      const sc = -negamax(apply(s,m), other(col), depth-1, -beta, -alpha);
      if (sc > best) best = sc;
      if (best > alpha) alpha = best;
      if (alpha >= beta) break;
    }
    return best;
  }
  function capVal(s, m) { const t = s.b[m.to[0]][m.to[1]]; return t ? VAL[t.t] : 0; }
  function bestMove(s, col, depth) {
    const moves = legal(s, col);
    if (!moves.length) return null;
    moves.sort((a,b) => capVal(s,b) - capVal(s,a));
    let best = [], bestSc = -1e9;
    for (const m of moves) {
      const sc = -negamax(apply(s,m), other(col), depth-1, -1e9, 1e9) + Math.random()*0.15;
      if (sc > bestSc) { bestSc = sc; best = [m]; } else if (sc > bestSc - 0.12) best.push(m);
    }
    return best[Math.floor(Math.random()*best.length)];
  }

  /* ── turn flow ── */
  function beginTurn() {
    if (over) return;
    sel = null; legalSel = [];
    if (turn === 'w') {
      if (!legal(st,'w').length) return endByMate('w');
      awaiting = false; curQ = ctx.nextQuestion();
      setMsg(inCheck(st,'w') ? 'Ρουά! Απάντησε σωστά και άμυνα.' : 'Απάντησε σωστά για να κινηθείς.', inCheck(st,'w') ? 'bad' : '');
      render();
    } else {
      render();
      setTimeout(botTurn, 720);
    }
  }
  function answer(i) {
    if (over || turn !== 'w' || awaiting || !curQ) return;
    if (i === curQ.c) { awaiting = true; setMsg('Σωστά! Διάλεξε κομμάτι και κίνηση.', 'good'); render(); }
    else { setMsg('Λάθος — χάνεις τη σειρά σου.', 'bad'); curQ = null; awaiting = false; render(); turn = 'b'; setTimeout(beginTurn, 1050); }
  }
  function clickCell(r, c) {
    if (over || turn !== 'w' || !awaiting) return;
    const p = st.b[r][c];
    if (p && p.c === 'w') { sel = [r,c]; legalSel = legal(st,'w').filter(m => m.from[0]===r && m.from[1]===c); render(); return; }
    if (sel) {
      const m = legalSel.find(x => x.to[0]===r && x.to[1]===c);
      if (m) { playMove(m, 'w'); }
    }
  }
  function playMove(m, col) {
    const captured = m.ep ? { t:'p', c: other(col) } : st.b[m.to[0]][m.to[1]];
    if (captured) (col === 'w' ? capW : capB).push(GLYPH[captured.t]);
    st = apply(st, m);
    lastMove = { from:m.from, to:m.to };
    sel = null; legalSel = []; awaiting = false; curQ = null;
    const opp = other(col);
    const check = inCheck(st, opp);
    if (col === 'w') setMsg(check ? 'Ρουά στον αντίπαλο!' : (captured ? `Αιχμαλώτισες ${pieceName(captured.t)}.` : 'Κίνηση ολοκληρώθηκε.'), check ? 'good' : '');
    render();
    if (!legal(st, opp).length) return endByMate(opp);
    turn = opp;
    setTimeout(beginTurn, col === 'w' ? 650 : 600);
  }
  function botTurn() {
    if (over) return;
    const skill = Math.max(0.35, Math.min(0.95, (ctx.opp.rating - 850) / 1150));
    if (Math.random() > skill && !inCheck(st,'b')) {     // "blunders the turn" — forfeits, never while in check
      setMsg(`${ctx.opp.name}: λάθος — χάνει τη σειρά.`, '');
      render(); turn = 'w'; setTimeout(beginTurn, 950); return;
    }
    const depth = 2;
    const m = bestMove(st, 'b', depth);
    if (!m) return endByMate('b');
    const captured = m.ep ? { t:'p', c:'w' } : st.b[m.to[0]][m.to[1]];
    if (captured) capB.push(GLYPH[captured.t]);
    st = apply(st, m);
    lastMove = { from:m.from, to:m.to };
    setMsg(`${ctx.opp.name} κινήθηκε${captured ? ' — αιχμαλώτισε ' + pieceName(captured.t) : ''}${inCheck(st,'w') ? ' · Ρουά!' : ''}.`, inCheck(st,'w') ? 'bad' : '');
    render();
    if (!legal(st, 'w').length) return endByMate('w');
    turn = 'w'; setTimeout(beginTurn, 650);
  }

  function pieceName(t) { return ({ p:'πιόνι', n:'ίππο', b:'αξιωματικό', r:'πύργο', q:'βασίλισσα', k:'βασιλιά' })[t] || t; }

  function endByMate(loser) {
    over = true;
    const meWon = (loser === 'b');
    const mate = inCheck(st, loser);
    const meMat = material('w'), oppMat = material('b');
    if (mate) setMsg(meWon ? 'ΡΟΥΑ-ΜΑΤ — Νίκη!' : 'Ρουά-ματ — Ήττα.', meWon ? 'good' : 'bad');
    else setMsg('Πατ — ισοπαλία.', '');
    render();
    const base = meWon ? 1000 : (mate ? 0 : 500);
    const meScore = base + Math.round(meMat * 18);
    const oppScore = (meWon ? (mate ? 0 : 500) : 1000) + Math.round(oppMat * 18);
    setTimeout(() => { if (ctx.onDone) ctx.onDone({ winner: meWon ? 'me' : (mate ? 'opp' : 'draw'), meScore, oppScore }); }, 1500);
  }
  function material(col) { let s=0; for (let r=0;r<8;r++) for (let c=0;c<8;c++){ const p=st.b[r][c]; if(p&&p.c===col) s+=VAL[p.t]; } return s; }
  function setMsg(t,k){ msg=t; msgKind=k||''; }

  /* ── render ── */
  function render() {
    const m = ctx.mode, acc = m.accent;
    const showQ = (turn === 'w' && !awaiting && !over && curQ);
    const kCheck = inCheck(st, turn) && !over ? kingPos(st, turn) : null;
    let cells = '';
    for (let r=0;r<8;r++) for (let c=0;c<8;c++) {
      const p = st.b[r][c];
      const dark = (r+c)%2===1;
      const isSel = sel && sel[0]===r && sel[1]===c;
      const isLegal = legalSel.some(x => x.to[0]===r && x.to[1]===c);
      const isCap = isLegal && (st.b[r][c] || (legalSel.find(x=>x.to[0]===r&&x.to[1]===c)||{}).ep);
      const lm = lastMove && ((lastMove.from[0]===r&&lastMove.from[1]===c)||(lastMove.to[0]===r&&lastMove.to[1]===c));
      const inChk = kCheck && kCheck[0]===r && kCheck[1]===c;
      const clickable = (turn==='w' && awaiting && ((p&&p.c==='w') || isLegal));
      cells += `<button class="sk-cell ${dark?'dark':'light'} ${isLegal?(isCap?'cap':'legal'):''} ${lm?'last':''} ${inChk?'chk':''} ${clickable?'click':''}" data-r="${r}" data-c="${c}">`
        + (p ? `<span class="sk-piece ${p.c} ${isSel?'sel':''}">${GLYPH[p.t]}</span>` : '')
        + `</button>`;
    }
    ctx.screenEl.innerHTML = `
      <div class="pvp-wrap" style="max-width:940px">
        <div class="pvp-kicker"><b>ΣΚΑΚΙ /</b> ${ctx.subject.gr} · ${ctx.subject.en}</div>
        <h1 class="pvp-h1" style="font-size:clamp(24px,3.6vw,36px);margin-bottom:14px">ΣΚΑΚΙ<span class="en">Answer correctly to earn each move — answer wrong and you forfeit the turn.</span></h1>
        <div class="pvp-skaki-wrap">
          <div class="sk-board-wrap">
            <div class="sk-cap-row">${capW.length ? capW.join(' ') : '<span class="dim">—</span>'}</div>
            <div class="sk-board">${cells}</div>
          </div>
          <div class="sk-side">
            <div class="sk-players">
              <div class="sk-pl ${turn==='b'&&!over?'act':''}"><span class="sk-seal b">${ctx.opp.seal}</span><span class="sk-nm">${ctx.opp.name}${ctx.opp.isBot?' ·bot':''}</span><span class="sk-mat">${(material('b')-material('w'))>0?'+'+ (material('b')-material('w')).toFixed(1):''}</span></div>
              <div class="sk-pl ${turn==='w'&&!over?'act':''}"><span class="sk-seal w">${ctx.me.seal}</span><span class="sk-nm">ΕΣΥ · YOU</span><span class="sk-mat">${(material('w')-material('b'))>0?'+'+ (material('w')-material('b')).toFixed(1):''}</span></div>
            </div>
            ${showQ ? `
              <div class="pvp-panel pvp-q" style="--accent:${cssvar(acc)};padding:18px 18px 20px">
                <div class="qsubj">Η ΥΛΗ ΣΟΥ · ${ctx.subject.gr}</div>
                <p class="qtext" id="sk-qtext" style="font-size:clamp(16px,2.1vw,20px);margin-bottom:14px">${curQ.q.gr}</p>
                <div class="pvp-ans" id="sk-ans" style="grid-template-columns:1fr">${curQ.a.map((a,i)=>`<button data-i="${i}">${a}</button>`).join('')}</div>
              </div>`
            : `<div class="sk-msg ${msgKind}">${msg}</div>${turn==='w'&&awaiting&&!over?'<div class="sk-hint">Διάλεξε λευκό κομμάτι, μετά τον προορισμό.</div>':''}`}
            <div class="sk-cap-black">${capB.length ? '<span class="dim">Αιχμάλωτα:</span> '+capB.join(' ') : ''}</div>
            <div class="pet-rule">Κανονικό σκάκι: ρουά, ροκέ, προαγωγή, αn passant. Σωστή απάντηση = δικαίωμα κίνησης· λάθος = χάνεις τη σειρά.</div>
          </div>
        </div>
      </div>`;
    ctx.screenEl.querySelectorAll('.sk-cell').forEach(b => b.addEventListener('click', () => clickCell(+b.dataset.r, +b.dataset.c)));
    const ans = ctx.screenEl.querySelector('#sk-ans');
    if (ans) ans.querySelectorAll('button').forEach(b => b.addEventListener('click', () => answer(+b.dataset.i)));
  }
  function cssvar(v){ return `var(${v})`; }

  return { start, stop };
})();
