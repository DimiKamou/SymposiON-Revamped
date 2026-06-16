/* ============================================================
   Battle Royale — spectator.jsx
   "Watch from the Stands" — after you're eliminated, watch the
   remaining bouts play out, round by round, to the champion.
   Reads shared components/helpers off window.
   ============================================================ */
const { useState: useSp, useEffect: useEp, useRef: useRp } = React;

/* one auto-playing featured bout (no user input) */
function SpectatorBout({ a, b, winnerId, question, speed, onDone }) {
  const D = window.BR_DATA;
  const FX = window.BR_FX || { play(){}, shake(){} };
  const [stage, setStage] = useSp('intro'); // intro -> race -> reveal
  const [aLock, setALock] = useSp(null);
  const [bLock, setBLock] = useSp(null);
  const [tick, setTick] = useSp(0);
  const timers = useRp([]);

  // predetermined lock times consistent with winnerId
  const plan = useRp(null);
  if (!plan.current) {
    const baseT = (p) => Math.max(0.8, p.pace * (0.55 + Math.random() * 0.7) / 1.0);
    let ta = baseT(a), tb = baseT(b);
    // force the predetermined winner to be the faster correct one
    if (winnerId === a.id) { if (ta >= tb) ta = tb * (0.55 + Math.random() * 0.3); }
    else { if (tb >= ta) tb = ta * (0.55 + Math.random() * 0.3); }
    plan.current = {
      a: { t: +ta.toFixed(1), correct: winnerId === a.id },
      b: { t: +tb.toFixed(1), correct: winnerId === b.id },
    };
  }

  useEp(() => {
    const sp = speed || 1;
    const push = (fn, ms) => timers.current.push(setTimeout(fn, ms / sp));
    push(() => { setStage('race'); FX.play('go'); }, 700);
    // running clock
    const iv = setInterval(() => setTick((x) => x + 1), 90 / sp);
    timers.current.push({ _iv: iv });
    const pa = plan.current.a, pb = plan.current.b;
    push(() => { setALock(pa); }, 700 + pa.t * 1000);
    push(() => { setBLock(pb); }, 700 + pb.t * 1000);
    const slower = Math.max(pa.t, pb.t);
    push(() => {
      clearInterval(iv);
      setStage('reveal'); FX.play('clash'); FX.shake('sm');
    }, 700 + slower * 1000 + 250);
    push(() => onDone(), 700 + slower * 1000 + 1700);
    return () => { timers.current.forEach((x) => x && x._iv ? clearInterval(x._iv) : clearTimeout(x)); timers.current = []; };
  }, []);

  const elapsed = stage === 'race' ? (tick * 90) / 1000 : 0;
  const sideTime = (p, lock) => lock ? lock.t.toFixed(1) + 's' : stage === 'race' ? elapsed.toFixed(1) + 's' : '—';
  const winner = stage === 'reveal' ? winnerId : null;

  const side = (p, lock, who) => {
    const won = winner === p.id;
    const lost = winner && winner !== p.id;
    return (
      <div className={'sb-side ' + who + (won ? ' won' : '') + (lost ? ' lost' : '')}>
        <Avatar p={p} className="sb-ava" out={lost} />
        <div className="sb-name">{p.name}</div>
        <div className="sb-status">
          {lock ? (lock.correct ? `✓ ${lock.t.toFixed(1)}s` : `✗ ${lock.t.toFixed(1)}s`)
            : stage === 'race' ? sideTime(p, lock) : 'ready'}
        </div>
        {won && <div className="sb-victor">VICTOR</div>}
        {lost && <div className="sb-ko">KO</div>}
      </div>
    );
  };

  return (
    <div className="spec-bout">
      <div className="sb-arena">
        {side(a, aLock, 'side-you')}
        <div className="sb-vs"><VsBadge className={stage === 'race' ? '' : 'slam'} /></div>
        {side(b, bLock, 'side-foe')}
      </div>
      <div className="sb-qcard">
        <div className="sb-qlabel">{stage === 'intro' ? 'A bout begins…' : stage === 'reveal' ? 'Bout decided' : 'On the sand'}</div>
        <div className="sb-qtext">{question.q}</div>
      </div>
    </div>
  );
}

/* manages the whole spectator tournament */
function Spectatorium({ survivors, total, beaten, onChampion }) {
  const D = window.BR_DATA;
  const [pool, setPool] = useSp(survivors);
  const [phase, setPhase] = useSp('bout'); // bout -> board
  const [round, setRound] = useSp(null);   // {matches, byes, results, featuredIdx}
  const [revealed, setRevealed] = useSp(false);
  const [speed, setSpeed] = useSp(1);

  // build a round whenever the pool changes
  useEp(() => {
    if (pool.length <= 1) { onChampion(pool[0]); return; }
    const { matches, byes } = D.drawRound(pool);
    const results = matches.map((m) => D.simWinner(m[0], m[1]).id);
    const featuredIdx = Math.floor(Math.random() * matches.length);
    setRound({ matches, byes, results, featuredIdx });
    setPhase('bout');
    setRevealed(false);
  }, [pool]);

  if (!round) return null;
  const info = D.roundLabel(pool.length);
  const fm = round.matches[round.featuredIdx];
  const fWinner = round.results[round.featuredIdx];
  const question = D.QUESTION_POOL[Math.floor(Math.random() * D.QUESTION_POOL.length)];

  const toBoard = () => { setPhase('board'); setTimeout(() => setRevealed(true), 500); };
  const nextRound = () => {
    const winners = round.byes.slice();
    round.matches.forEach((m, i) => winners.push(round.results[i] === m[0].id ? m[0] : m[1]));
    setPool(winners);
  };
  const skipToResult = () => {
    // simulate the remaining tournament from the current pool
    let cur = pool.slice(); let guard = 0;
    while (cur.length > 1 && guard++ < 12) {
      const { matches, byes } = D.drawRound(cur);
      const w = byes.slice();
      matches.forEach((m) => w.push(D.simWinner(m[0], m[1])));
      cur = w;
    }
    onChampion(cur[0]);
  };

  return (
    <div className="stage stage-duel spectate">
      <ColosseumScene heat={0} />
      <div className="spec-wrap">
        <div className="spec-top">
          <div>
            <div className="eyebrow">From the Stands · {info.en}</div>
            <div className="spec-sub">{pool.length} warriors remain · you watch on</div>
          </div>
          <div className="spec-speed">
            {[1, 2, 4].map((s) => (
              <button key={s} className={'spec-spd' + (speed === s ? ' on' : '')} onClick={() => setSpeed(s)}>{s}×</button>
            ))}
          </div>
        </div>

        {phase === 'bout' && (
          <SpectatorBout key={round.featuredIdx + '-' + pool.length}
            a={fm[0]} b={fm[1]} winnerId={fWinner} question={question} speed={speed}
            onDone={toBoard} />
        )}

        {phase === 'board' && (
          <React.Fragment>
            <MatchBoard matches={round.matches} byes={round.byes} results={round.results}
              youMatchIdx={-1} revealed={revealed}
              title="The Round Settles" sub={revealed ? 'Winners advance' : 'Tallying…'} />
            <div className="spec-actions">
              {pool.length > 2
                ? <button className="btn btn-gold" onClick={nextRound}>Next Round — {D.roundLabel(D.nextBracketSize(pool.length)).en}</button>
                : <button className="btn btn-gold" onClick={nextRound}>Crown the Champion</button>}
              <button className="btn btn-ghost" onClick={skipToResult}>Skip to result</button>
            </div>
          </React.Fragment>
        )}

        {phase === 'bout' && (
          <div className="spec-actions">
            <button className="btn btn-ghost" onClick={toBoard}>Skip bout →</button>
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SpectatorBout, Spectatorium });
