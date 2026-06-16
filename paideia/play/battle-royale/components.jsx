/* ============================================================
   Battle Royale — components.jsx
   Presentational pieces + the stateful DuelArena.
   All exported to window for the app script.
   ============================================================ */
const { useState, useEffect, useRef, useCallback } = React;

/* ── Avatar medallion ─────────────────────────────────────── */
function Avatar({ p, className = '', out = false }) {
  const cls = ['ava'];
  if (p.isYou) cls.push('ava--you');
  if (out) cls.push('ava--out');
  if (className) cls.push(className);
  return (
    <div className={cls.join(' ')} style={{ '--ava-c': `hsl(${p.hue} 46% 50%)` }}>
      {p.sigil}
    </div>
  );
}

/* ── Crossed-swords VS lockup ─────────────────────────────── */
function VsBadge({ className = '' }) {
  return (
    <div className={className}>
      <svg viewBox="0 0 100 100" fill="none">
        <g stroke="#C9A84C" strokeWidth="3.2" strokeLinecap="round">
          <line x1="18" y1="20" x2="74" y2="80" stroke="#E8C96A" />
          <line x1="82" y1="20" x2="26" y2="80" />
          <line x1="70" y1="16" x2="80" y2="26" strokeWidth="5" />
          <line x1="14" y1="16" x2="24" y2="26" strokeWidth="5" stroke="#E8C96A" />
        </g>
        <circle cx="50" cy="50" r="15" fill="#0C0905" stroke="#C9A84C" strokeWidth="2" />
        <text x="50" y="56" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="900"
              fontSize="15" fill="#E8C96A" letterSpacing="0.5">VS</text>
      </svg>
    </div>
  );
}

/* ── Laurel wreath (champion) ─────────────────────────────── */
function Laurel({ className = 'laurel' }) {
  const leaf = (cx, cy, rot) => (
    <ellipse className="leaf" cx={cx} cy={cy} rx="7" ry="3.4"
      transform={`rotate(${rot} ${cx} ${cy})`} />
  );
  const side = (mirror) => {
    const t = mirror ? 'scale(-1,1) translate(-200,0)' : '';
    const arr = [];
    for (let i = 0; i < 8; i++) {
      const a = -70 + i * 17;
      const rad = (a * Math.PI) / 180;
      const cx = 100 - Math.cos(rad) * 74;
      const cy = 100 - Math.sin(rad) * 74;
      arr.push(<g key={i}>{leaf(cx, cy, a - 90)}</g>);
    }
    return <g transform={t}>{arr}</g>;
  };
  return (
    <svg className={className} viewBox="0 0 200 180" fill="none">
      {side(false)}
      {side(true)}
    </svg>
  );
}

/* ── Field tracker dots ───────────────────────────────────── */
function FieldTrack({ total, alive, youAlive }) {
  const dots = [];
  for (let i = 0; i < total; i++) {
    const cls = ['field-dot'];
    if (i === 0 && youAlive) cls.push('alive', 'you');
    else if (i < alive) cls.push('alive');
    dots.push(<span key={i} className={cls.join(' ')} />);
  }
  return (
    <div className="field-track">
      <div className="field-dots">{dots}</div>
      <div className="field-caption"><b>{alive}</b> of {total} warriors remain</div>
    </div>
  );
}

/* ── Animated arena background — embers + godrays + dust ───── */
function ArenaFX({ intensity = 'idle' }) {
  // Build a stable set of embers once.
  const embers = useRef(null);
  if (!embers.current) {
    embers.current = Array.from({ length: 26 }).map((_, i) => ({
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      dur: 7 + Math.random() * 9,
      delay: -Math.random() * 16,
      drift: (Math.random() * 2 - 1) * 40,
      hue: 18 + Math.random() * 26,
      bright: 0.4 + Math.random() * 0.5,
    }));
  }
  const dust = useRef(null);
  if (!dust.current) {
    dust.current = Array.from({ length: 16 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 1 + Math.random() * 2,
      dur: 9 + Math.random() * 10,
      delay: -Math.random() * 12,
    }));
  }
  return (
    <div className={'arena-fx fx-' + intensity} aria-hidden="true">
      <div className="fx-rays" />
      <div className="fx-glow-floor" />
      <div className="fx-dust">
        {dust.current.map((d, i) => (
          <span key={i} style={{
            left: d.left + '%', top: d.top + '%', width: d.size, height: d.size,
            animationDuration: d.dur + 's', animationDelay: d.delay + 's',
          }} />
        ))}
      </div>
      <div className="fx-embers">
        {embers.current.map((e, i) => (
          <span key={i} style={{
            left: e.left + '%', width: e.size, height: e.size,
            animationDuration: e.dur + 's', animationDelay: e.delay + 's',
            '--drift': e.drift + 'px',
            background: `hsl(${e.hue} 90% ${48 + e.bright * 20}%)`,
            boxShadow: `0 0 ${e.size * 2.5}px hsl(${e.hue} 95% 60% / ${e.bright})`,
          }} />
        ))}
      </div>
    </div>
  );
}

/* ── One match-up card (used in the full draw board) ──────── */
function MatchCard({ a, b, winnerId, isYours, revealed, idx }) {
  const decided = revealed && winnerId != null;
  const aWon = decided && winnerId === a.id;
  const bWon = decided && winnerId === b.id;
  const sideCls = (p, won, lost) => {
    const c = ['mc-side'];
    if (p.isYou) c.push('is-you');
    if (decided) c.push(won ? 'won' : 'lost');
    return c.join(' ');
  };
  return (
    <div className={'match-card' + (isYours ? ' yours' : '') + (decided ? ' decided' : '')}
         style={{ animationDelay: (idx * 0.07) + 's' }}>
      {isYours && <div className="mc-flag">YOUR DUEL</div>}
      <div className={sideCls(a, aWon)}>
        <Avatar p={a} className="mc-ava" out={decided && !aWon} />
        <span className="mc-name">{a.isYou ? 'You' : a.name}</span>
        {decided && !aWon && <span className="mc-ko">KO</span>}
      </div>
      <div className="mc-vs">
        {decided
          ? <span className="mc-vs-dot" />
          : <span className="mc-vs-txt">vs</span>}
      </div>
      <div className={sideCls(b, bWon)}>
        <Avatar p={b} className="mc-ava" out={decided && !bWon} />
        <span className="mc-name">{b.isYou ? 'You' : b.name}</span>
        {decided && !bWon && <span className="mc-ko">KO</span>}
      </div>
    </div>
  );
}

/* ── Gladiator colosseum scene (CSS-built arena backdrop) ──── */
function ColosseumScene({ heat = 0 }) {
  // crowd dots once
  const crowd = useRef(null);
  if (!crowd.current) {
    crowd.current = Array.from({ length: 7 }).map(() =>
      Array.from({ length: 5 }).map(() => ({
        hue: [18, 32, 200, 350, 140, 264][Math.floor(Math.random() * 6)],
        on: Math.random() < 0.7,
      }))
    );
  }
  return (
    <div className={'colosseum' + (heat >= 3 ? ' col-blaze' : heat >= 1 ? ' col-hot' : '')} aria-hidden="true">
      <div className="col-stands">
        {crowd.current.map((arch, i) => (
          <div className="col-arch" key={i}>
            <div className="col-crowd">
              {arch.map((c, j) => (
                <span key={j} style={{ background: c.on ? `hsl(${c.hue} 35% 38%)` : 'transparent' }} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="col-banner col-banner-l" />
      <div className="col-banner col-banner-r" />
      <div className="col-wall" />
      <div className="col-sand">
        <div className="col-sand-glow" />
        <div className="col-rake" />
      </div>
      <div className="torch torch-l"><i className="t-flame" /><i className="t-flame t-flame2" /></div>
      <div className="torch torch-r"><i className="t-flame" /><i className="t-flame t-flame2" /></div>
      <div className="col-scrim" />
    </div>
  );
}

/* ── The full round board — every pairing this round ──────── */
function MatchBoard({ matches, byes, results, youMatchIdx, revealed, title, sub }) {
  return (
    <div className="board">
      {title && <div className="board-title">{title}</div>}
      {sub && <div className="board-sub">{sub}</div>}
      <div className="board-grid">
        {matches.map((m, i) => (
          <MatchCard key={i} a={m[0]} b={m[1]} idx={i}
            isYours={i === youMatchIdx}
            winnerId={results ? results[i] : null}
            revealed={revealed} />
        ))}
      </div>
      {byes && byes.length > 0 && (
        <div className="board-byes">
          <span className="byes-label">Byes — advance</span>
          <div className="byes-row">
            {byes.map((p) => (
              <div key={p.id} className={'bye-chip' + (p.isYou ? ' is-you' : '')}>
                <Avatar p={p} className="bye-ava" />
                <span>{p.isYou ? 'You' : p.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   LOBBY
   ════════════════════════════════════════════════════════════ */
function Lobby({ field, pvp, onStart }) {
  return (
    <div className="stage">
      <div className="lobby">
        <div className="eyebrow rise rise-1">Symposi&middot;ON &nbsp;·&nbsp; The Arena</div>
        <h1 className="lobby-title rise rise-2">BATTLE <b>ROYALE</b></h1>
        <p className="lobby-sub rise rise-2">Four-and-twenty enter. One is crowned.</p>
        <div className="divider rise rise-3" style={{ marginBottom: 18 }}><span /><i /><span /></div>
        <div className="lobby-count rise rise-3">⚔ Fastest correct answer takes the duel · Single elimination</div>
        {pvp && <div className="lobby-count rise rise-3" style={{ color: '#C9A84C', marginTop: 6 }}>
          🎮 Player 1: click · Player 2: keys 1 – 4
        </div>}
        <div className="roster">
          {field.map((p, i) => (
            <div key={p.id} className={'roster-cell' + (p.isYou ? ' is-you' : '')} style={{ animationDelay: `${i * 28}ms` }}>
              <Avatar p={p} />
              <div className="roster-name">{p.name}</div>
              {p.isYou && <div className="you-tag">YOU</div>}
            </div>
          ))}
        </div>
        <button className="btn btn-gold rise rise-4" onClick={onStart}>Enter the Arena</button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DRAW CEREMONY — random matchmaking reveal
   ════════════════════════════════════════════════════════════ */
function DrawCeremony({ you, foe, field, roundInfo, remaining, total, matches, byes, youMatchIdx, onBegin }) {
  const [phase, setPhase] = useState('shuffle'); // shuffle -> reveal -> ready
  const [rollName, setRollName] = useState(field[0].name);
  const [showBoard, setShowBoard] = useState(false);

  useEffect(() => {
    const pool = field.filter((p) => p.id !== 'you');
    // timer-based (works even when the tab is backgrounded, unlike rAF)
    const roll = setInterval(() => {
      setRollName(pool[Math.floor(Math.random() * pool.length)].name);
    }, 70);
    const t1 = setTimeout(() => {
      clearInterval(roll);
      setRollName(foe.name);
      setPhase('reveal');
    }, 1500);
    const t2 = setTimeout(() => setPhase('ready'), 2200);
    const t3 = setTimeout(() => setShowBoard(true), 2500);
    return () => { clearInterval(roll); clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const shuffling = phase === 'shuffle';
  return (
    <div className="stage">
      <div className="draw">
        <div className="eyebrow" style={{ marginBottom: 10 }}>{roundInfo.en}</div>
        <div className="draw-round-gr">{roundInfo.gr}</div>
        <div className="draw-status">
          {shuffling ? 'Drawing your opponent from the field…'
            : phase === 'reveal' ? 'Your fates are sealed.'
            : 'Steel yourself.'}
        </div>

        <div className={'vs-wrap' + (shuffling ? ' shuffling' : '')}>
          <div className={'combatant side-you' + (!shuffling ? ' in' : '')}>
            <Avatar p={you} />
            <div className="combatant-name">{you.name}</div>
            <div className="combatant-tag">You · Challenger</div>
          </div>
          <div className="vs-badge"><VsBadge className={phase === 'reveal' ? 'slam' : ''} /></div>
          <div className={'combatant side-foe' + (!shuffling ? ' in' : '')}>
            <Avatar p={shuffling ? { ...foe, sigil: '?', hue: 40 } : foe} />
            <div className="combatant-name">{shuffling ? rollName : foe.name}</div>
            <div className="combatant-tag">{shuffling ? 'Selecting…' : 'Opponent'}</div>
          </div>
        </div>

        {showBoard && matches && (
          <MatchBoard matches={matches} byes={byes} youMatchIdx={youMatchIdx}
            revealed={false} title="The Full Draw"
            sub={`${matches.length} duels · ${remaining} warriors standing`} />
        )}

        <div style={{ height: 22 }} />
        <button className="btn btn-gold" disabled={phase !== 'ready'}
          style={{ opacity: phase === 'ready' ? 1 : 0.3, pointerEvents: phase === 'ready' ? 'auto' : 'none' }}
          onClick={onBegin}>
          Begin Duel
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   DUEL ARENA — the race
   ════════════════════════════════════════════════════════════ */
function DuelArena({ you, foe, roundInfo, settings, questions, streak, powers, pvp, onRound, onUsePower, onComplete }) {
  const needed = Math.floor(settings.bestOf / 2) + 1;
  const QT = settings.questionTime; // seconds

  const [count, setCount] = useState(settings.countdown ? 3 : 0);
  const [phase, setPhase] = useState(settings.countdown ? 'count' : 'play'); // count|play|reveal
  const [qIdx, setQIdx] = useState(0);
  const [youScore, setYouScore] = useState(0);
  const [foeScore, setFoeScore] = useState(0);
  const [elapsed, setElapsed] = useState(0);     // ms since question start
  const [youLock, setYouLock] = useState(null);  // {t, correct, idx}
  const [foeLock, setFoeLock] = useState(null);  // {t, correct}
  const [verdict, setVerdict] = useState(null);  // {kind, text}

  const [stamp, setStamp] = useState(null);    // {tier, word, sub}
  const [removed, setRemoved] = useState([]);   // 50/50 removed answer indices
  const [frozen, setFrozen] = useState(false);  // opponent frozen this round
  const [dbl, setDbl] = useState(false);        // double-or-nothing this round

  const fastestRef = useRef(99);
  const correctRef = useRef(0);
  const startRef = useRef(0);
  const youLockRef = useRef(null);
  const foeLockRef = useRef(null);
  const resolvedRef = useRef(false);
  const timersRef = useRef([]);
  const botTimerRef = useRef(null);
  const botPlanRef = useRef(null);   // {t, correct, timeout}
  const stampTimerRef = useRef(null);

  const q = questions[qIdx % questions.length];

  const FX = window.BR_FX || { play(){}, shake(){}, buzz(){} };

  /* ── countdown ── */
  useEffect(() => {
    if (phase !== 'count') return;
    if (count <= 0) { FX.play('go'); FX.shake('sm'); setPhase('play'); return; }
    FX.play('tick');
    const id = setTimeout(() => setCount((c) => c - 1), 850);
    return () => clearTimeout(id);
  }, [phase, count]);

  /* schedule (or re-schedule) the bot's lock-in for this round */
  const scheduleBot = (extraMs) => {
    if (botTimerRef.current) clearTimeout(botTimerRef.current);
    const plan = botPlanRef.current;
    const elapsed = performance.now() - startRef.current;
    const fireAt = plan.fireMs + (extraMs || 0);
    const delay = Math.max(120, fireAt - elapsed);
    botPlanRef.current = { ...plan, fireMs: fireAt };
    botTimerRef.current = setTimeout(() => {
      const within = plan.t <= QT;
      foeLockRef.current = { t: within ? plan.t : QT, correct: within ? plan.correct : false, timeout: !within };
      setFoeLock(foeLockRef.current);
      maybeResolve();
    }, delay);
  };

  /* ── start a question ── */
  useEffect(() => {
    if (phase !== 'play') return;
    resolvedRef.current = false;
    youLockRef.current = null; foeLockRef.current = null;
    setYouLock(null); setFoeLock(null); setVerdict(null); setElapsed(0);
    setRemoved([]); setFrozen(false); setDbl(false);
    startRef.current = performance.now();

    // plan the bot lock (solo only — in pvp Player 2 answers via keyboard)
    if (!pvp) {
      const botCorrect = Math.random() < Math.max(0.05, Math.min(0.97, foe.skill * settings.botSkill));
      let botT = foe.pace * (0.6 + Math.random() * 0.85) / settings.botSkill;
      if (!botCorrect) botT *= (Math.random() < 0.5 ? 0.7 : 1.5);
      botT = Math.min(botT, QT + 0.4);
      botPlanRef.current = { t: botT, correct: botCorrect, fireMs: Math.max(700, botT * 1000) };
      scheduleBot(0);
    }

    // master ticker
    const iv = setInterval(() => {
      const e = performance.now() - startRef.current;
      setElapsed(e);
      if (e >= QT * 1000) {
        clearInterval(iv);
        if (!youLockRef.current) {
          youLockRef.current = { t: QT, correct: false, idx: -1, timeout: true };
          setYouLock(youLockRef.current);
        }
        if (!foeLockRef.current) {
          foeLockRef.current = { t: QT, correct: false, timeout: true };
          setFoeLock(foeLockRef.current);
        }
        maybeResolve();
      }
    }, 50);
    timersRef.current.push({ _iv: iv });

    return () => { _clearAll(); clearInterval(iv); };
  }, [phase, qIdx]);

  const _clearAll = () => {
    timersRef.current.forEach((x) => { if (x && x._iv) clearInterval(x._iv); else clearTimeout(x); });
    timersRef.current = [];
    if (botTimerRef.current) { clearTimeout(botTimerRef.current); botTimerRef.current = null; }
  };

  /* ── power-up activation (only while you haven't locked) ── */
  const usePower = (type) => {
    if (phase !== 'play' || youLockRef.current || !onUsePower) return;
    if (!onUsePower(type)) return; // app says you don't have it
    FX.play('power');
    if (type === 'fifty') {
      const wrong = q.opts.map((_, i) => i).filter((i) => i !== q.ans);
      const drop = window.BR_DATA.shuffle(wrong).slice(0, 2);
      setRemoved(drop);
    } else if (type === 'freeze') {
      if (!foeLockRef.current) { setFrozen(true); FX.play('freeze'); scheduleBot(2500); }
    } else if (type === 'double') {
      setDbl(true);
    }
  };

  const pickAnswer = (idx) => {
    if (phase !== 'play' || youLockRef.current || removed.includes(idx)) return;
    const t = (performance.now() - startRef.current) / 1000;
    FX.play('select');
    youLockRef.current = { t, correct: idx === q.ans, idx };
    setYouLock(youLockRef.current);
    maybeResolve();
  };

  /* Player 2 keyboard input (pvp mode only) — keys 1/2/3/4 map to options A/B/C/D */
  useEffect(() => {
    if (!pvp || phase !== 'play') return;
    const onKey = (e) => {
      if (foeLockRef.current) return;
      const map = { '1': 0, '2': 1, '3': 2, '4': 3 };
      const idx = map[e.key];
      if (idx === undefined || removed.includes(idx)) return;
      const t = (performance.now() - startRef.current) / 1000;
      FX.play('select');
      foeLockRef.current = { t, correct: idx === q.ans, idx };
      setFoeLock(foeLockRef.current);
      maybeResolve();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [pvp, phase, qIdx]);

  function maybeResolve() {
    if (resolvedRef.current) return;
    const y = youLockRef.current, f = foeLockRef.current;
    if (!y || !f) return;
    resolvedRef.current = true;
    _clearAll();

    if (y.correct) { correctRef.current += 1; if (y.t < fastestRef.current) fastestRef.current = y.t; }

    // decide winner: fastest correct
    let winner = 'draw';
    if (y.correct && f.correct) winner = y.t <= f.t ? 'you' : 'foe';
    else if (y.correct) winner = 'you';
    else if (f.correct) winner = 'foe';

    const pts = dbl ? 2 : 1;
    let nYou = youScore, nFoe = foeScore;
    if (winner === 'you') nYou += pts;
    if (winner === 'foe') nFoe += pts;

    // speed-tier stamp + sound for YOUR result
    if (winner === 'you' && y.correct) {
      let tier = null;
      if (y.t < 2.0) tier = { tier: 'tier-blaze', word: 'BLAZING!', sub: `${y.t.toFixed(1)}s` };
      else if (y.t < 3.6) tier = { tier: 'tier-fast', word: 'FAST!', sub: `${y.t.toFixed(1)}s` };
      else if (QT - y.t < 1.6) tier = { tier: 'tier-clutch', word: 'CLUTCH!', sub: `${y.t.toFixed(1)}s` };
      if (tier) {
        setStamp(tier);
        FX.play(tier.tier === 'tier-blaze' ? 'blaze' : 'correct');
        clearTimeout(stampTimerRef.current);
        stampTimerRef.current = setTimeout(() => setStamp(null), 1300);
      } else { FX.play('correct'); }
      FX.play('clash'); FX.shake(y.t < 2.0 ? 'big' : 'sm'); FX.buzz(40);
    } else if (winner === 'foe') {
      FX.play(y.correct ? 'roundLose' : 'wrong'); FX.shake('sm'); FX.buzz([30, 40, 30]);
    } else {
      FX.play('wrong');
    }

    // notify app of round outcome (heat streak)
    if (onRound) onRound(winner);

    // verdict text
    let v;
    const dblTag = dbl ? <b style={{ color: '#FF9A4C' }}> ×2</b> : null;
    if (winner === 'you') {
      v = { kind: 'win', text: f.correct
        ? <span>Correct &mdash; and faster! <b>{y.t.toFixed(1)}s vs {f.t.toFixed(1)}s</b>{dblTag}</span>
        : <span>Correct! {foeName} {f.timeout ? 'ran out of time' : 'answered wrong'}.{dblTag}</span> };
    } else if (winner === 'foe') {
      v = { kind: 'lose', text: y.correct
        ? <span>Correct &mdash; but {foeName} was faster. <b>{f.t.toFixed(1)}s vs {y.t.toFixed(1)}s</b>{dblTag}</span>
        : <span>{y.timeout ? 'Out of time.' : 'Wrong answer.'} {foeName} takes it.{dblTag}</span> };
    } else {
      v = { kind: 'draw', text: 'Both falter — no point. Next question!' };
    }
    setVerdict(v);
    setYouScore(nYou); setFoeScore(nFoe);
    setPhase('reveal');

    const done = nYou >= needed || nFoe >= needed;
    const wait = winner === 'draw' ? 1500 : 1950;
    setTimeout(() => {
      if (done) {
        onComplete({
          winner: nYou >= needed ? 'you' : 'foe',
          youWins: nYou, foeWins: nFoe,
          fastest: fastestRef.current === 99 ? null : fastestRef.current,
          correct: correctRef.current,
        });
      } else {
        setQIdx((i) => i + 1);
        setPhase('play');
      }
    }, wait);
  }

  useEffect(() => () => { _clearAll(); clearTimeout(stampTimerRef.current); }, []);

  // In pvp mode the "foe" slot is Player 2 (human on keyboard)
  const foeName = pvp ? 'Player 2' : foe.name;

  // derived UI
  const revealing = phase === 'reveal';
  const youElapsedSec = youLock ? youLock.t : Math.min(elapsed / 1000, QT);
  const timeLeft = Math.max(0, QT - elapsed / 1000);
  const pct = Math.max(0, Math.min(100, (timeLeft / QT) * 100));
  const warn = timeLeft <= QT * 0.33;

  const ansClass = (i) => {
    const c = ['ans'];
    if (removed.includes(i)) c.push('removed');
    if (!revealing) { if (youLock && youLock.idx === i) c.push('picked'); }
    else {
      if (i === q.ans) c.push('correct');
      else if (youLock && youLock.idx === i) c.push('wrong');
      else c.push('dim-out');
    }
    return c.join(' ');
  };

  // heat meter
  const heatLvl = streak >= 5 ? 3 : streak >= 3 ? 2 : streak >= 1 ? 1 : 0;
  const heatPct = Math.min(100, (streak / 6) * 100);
  const heatWord = streak >= 5 ? 'INFERNO' : streak >= 3 ? 'ON FIRE' : streak >= 1 ? `${streak}× STREAK` : 'NO STREAK';

  const POWER_META = {
    fifty:  { icon: '½', label: '50 / 50' },
    freeze: { icon: '❄', label: 'Freeze' },
    double: { icon: '✕2', label: 'Double' },
  };
  // collapse the inventory into counts
  const powerCounts = (powers || []).reduce((m, p) => { m[p] = (m[p] || 0) + 1; return m; }, {});
  const canUse = phase === 'play' && !youLock;

  return (
    <div className="stage stage-duel">
      <ColosseumScene heat={streak >= 5 ? 3 : streak >= 3 ? 1 : 0} />
      {stamp && (
        <div className={'speed-stamp ' + stamp.tier}>
          <span className="big">{stamp.word}</span>
          <span className="sub">{stamp.sub}</span>
        </div>
      )}
      {phase === 'count' && (
        <div className="countdown">
          <div key={count} className={'count-num' + (count === 0 ? ' count-go' : '')}>
            {count === 0 ? 'FIGHT' : count}
          </div>
        </div>
      )}

      <div className="duel">
        <div className="duel-top">
          <div className="duel-round-label">{roundInfo.en}</div>
          <div className="duel-bo">Best of {settings.bestOf} · first to {needed}</div>
        </div>

        <div className="score-row">
          <div className={'score-card you' + (youLock ? ' lit' : '')}>
            <Avatar p={you} />
            <div className="sc-info">
              <div className="sc-name">{you.name}</div>
              <div className={'sc-status' + (youLock ? ' locked' : '')}>
                {youLock ? `LOCKED · ${youLock.t.toFixed(1)}s`
                  : phase === 'play' ? `▸ ${youElapsedSec.toFixed(1)}s` : 'ready'}
              </div>
              <div className="pips">
                {Array.from({ length: needed }).map((_, i) =>
                  <span key={i} className={'pip' + (i < youScore ? ' on' : '')} />)}
              </div>
            </div>
          </div>

          <div className="vs-mini"><VsBadge /></div>

          <div className={'score-card foe' + (foeLock ? ' lit' : '')}>
            <Avatar p={foe} />
            <div className="sc-info">
              <div className="sc-name">{foeName}{pvp && <span style={{ fontSize: 10, opacity: 0.6, marginLeft: 6 }}>· {foe.name}</span>}</div>
              <div className={'sc-status' + (foeLock ? ' locked' : '')}>
                {foeLock ? `LOCKED · ${foeLock.t.toFixed(1)}s`
                  : phase === 'play' ? (pvp ? 'keys 1–4 ↓' : 'answering…') : 'ready'}
              </div>
              <div className="pips">
                {Array.from({ length: needed }).map((_, i) =>
                  <span key={i} className={'pip' + (i < foeScore ? ' on' : '')} />)}
              </div>
            </div>
          </div>
        </div>

        <div className={'heat lvl-' + heatLvl}>
          <div className="heat-label">{heatLvl >= 2 ? <span className="heat-flame">🔥</span> : null} Streak</div>
          <div className="heat-track"><div className="heat-fill" style={{ width: heatPct + '%' }} /></div>
          <div className="heat-streak">{heatWord}</div>
        </div>

        <div className={'timer' + (frozen ? ' frozen' : '')}>
          <div className="timer-label">{frozen ? <span className="frost-tag">❄ Foe frozen</span> : 'Time'}</div>
          <div className="timer-track"><div className={'timer-fill' + (warn ? ' warn' : '')} style={{ width: pct + '%' }} /></div>
          <div className="timer-clock">{timeLeft.toFixed(1)}s</div>
        </div>

        <div className={'q-card' + (dbl ? ' don' : '')}>
          {dbl && <div className="don-flag">✕2 · Double or nothing</div>}
          <div className="q-num">Question {qIdx + 1}</div>
          <div className="q-text">{q.q}</div>
        </div>

        <div className="answers">
          {q.opts.map((o, i) => (
            <button key={i} className={ansClass(i)} disabled={!!youLock || revealing || removed.includes(i)} onClick={() => pickAnswer(i)}>
              <span className="ans-letter">{'ABCD'[i]}</span>
              <span>{o}</span>
            </button>
          ))}
        </div>

        <div className="powers">
          <span className="powers-label">Power-ups</span>
          {['fifty', 'freeze', 'double'].map((type) => {
            const n = powerCounts[type] || 0;
            const meta = POWER_META[type];
            const usedThis = (type === 'fifty' && removed.length) || (type === 'freeze' && frozen) || (type === 'double' && dbl);
            return (
              <button key={type} className="power" disabled={!canUse || n === 0 || usedThis}
                onClick={() => usePower(type)} title={meta.label}>
                <span className="pw-icon">{meta.icon}</span>
                <span>{meta.label}</span>
                {n > 1 && <span style={{ color: 'var(--gold)', fontFamily: 'var(--f-mono)', fontSize: 11 }}>×{n}</span>}
              </button>
            );
          })}
          {(!powers || powers.length === 0) && <span className="powers-label" style={{ opacity: 0.6 }}>— win duels to earn —</span>}
        </div>

        {verdict && <div className={'verdict ' + verdict.kind}>{verdict.text}</div>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   ROUND RESULT interstitial (advance / eliminated)
   ════════════════════════════════════════════════════════════ */
function RoundResult({ you, foe, advanced, result, nextInfo, remaining, total, matches, byes, matchResults, youMatchIdx, onNext, onSpectate }) {
  const [revealed, setRevealed] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setRevealed(true), 600);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="stage">
      <div className="result">
        <Avatar p={advanced ? you : foe} className="rise rise-1" />
        <div className={'result-verdict rise rise-1 ' + (advanced ? 'adv' : 'out')}>
          {advanced ? 'YOU ADVANCE' : 'ELIMINATED'}
        </div>
        <div className="result-line rise rise-2">
          {advanced
            ? <span>You bested <b style={{ color: 'var(--foe)' }}>{foe.name}</b> {result.youWins}&ndash;{result.foeWins}. The field thins.</span>
            : <span><b style={{ color: 'var(--foe)' }}>{foe.name}</b> took the duel {result.foeWins}&ndash;{result.youWins}. Your arena ends here.</span>}
        </div>

        {matches && (
          <MatchBoard matches={matches} byes={byes} results={matchResults} youMatchIdx={youMatchIdx}
            revealed={revealed} title="The Field Falls"
            sub={revealed ? `${remaining} of ${total} warriors remain` : 'Tallying the duels…'} />
        )}
        {!matches && <FieldTrack total={total} alive={remaining} youAlive={advanced} />}

        <div style={{ height: 10 }} />
        {advanced
          ? <button className="btn btn-gold rise rise-3" onClick={onNext}>
              {nextInfo ? `On to the ${nextInfo.en}` : 'Continue'}
            </button>
          : <div className="result-btns rise rise-3">
              <button className="btn btn-gold" onClick={onSpectate}>Watch from the Stands</button>
              <button className="btn btn-ghost" onClick={onNext}>Skip to the Final</button>
            </div>}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   FINALE — champion or defeat
   ════════════════════════════════════════════════════════════ */
const QUOTES_WIN = [
  '"Glory comes to those who seize it." — Homer',
  '"Fortune favours the swift of mind." — Pindar',
  '"The laurel is earned, never given." — Hesiod',
];
const QUOTES_LOSE = [
  '"Even the bravest must face their fate." — Homer',
  '"Defeat is the whetstone of the wise." — Solon',
  '"Rise, and return to the sand." — Epictetus',
];

function Finale({ champion, youWon, stats, onReplay, quoteSeed }) {
  const quotes = youWon ? QUOTES_WIN : QUOTES_LOSE;
  const quote = quotes[quoteSeed % quotes.length];
  return (
    <div className="stage">
      <div className={'finale' + (youWon ? '' : ' defeat')}>
        <Laurel className="laurel rise rise-1" />
        <div className="champ-eyebrow rise rise-1">{youWon ? 'Champion of the Arena' : 'The Laurel Goes to Another'}</div>
        <div className="champ-name rise rise-2">{youWon ? 'You' : champion.name}</div>
        <div className="champ-quote rise rise-2">{quote}</div>
        <div className="finale-note rise rise-3">
          {youWon
            ? <span>Four-and-twenty entered the sand. You alone are crowned.</span>
            : stats.duelsWon === 0
              ? <span>You fell in your first duel — <b className="gl">{champion.name}</b> took the crown.</span>
              : <span>You won <b>{stats.duelsWon}</b> {stats.duelsWon === 1 ? 'duel' : 'duels'} before falling — <b className="gl">{champion.name}</b> took the crown.</span>}
        </div>
        <div className="champ-stats rise rise-3">
          <div className="champ-stat"><div className="v">{stats.duelsWon}</div><div className="l">Duels Won</div></div>
          <div className="champ-stat"><div className="v">{stats.correct}</div><div className="l">Correct</div></div>
          <div className="champ-stat"><div className="v">{stats.fastest != null ? stats.fastest.toFixed(1) + 's' : '—'}</div><div className="l">Fastest</div></div>
          <div className="champ-stat"><div className="v">{stats.bestStreak || 0}🔥</div><div className="l">Best Streak</div></div>
        </div>
        <div className="finale-btns rise rise-4">
          <button className="btn btn-gold" onClick={onReplay}>Enter Again</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, {
  Avatar, VsBadge, Laurel, FieldTrack, ArenaFX, ColosseumScene, MatchCard, MatchBoard,
  Lobby, DrawCeremony, DuelArena, RoundResult, Finale,
});
