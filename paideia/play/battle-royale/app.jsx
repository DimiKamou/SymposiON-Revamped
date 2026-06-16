/* ============================================================
   Battle Royale — app.jsx
   Tournament state machine + duel orchestration + Tweaks.
   ============================================================ */
const { useState: useS, useEffect: useE, useRef: useR, useMemo } = React;
const D = window.BR_DATA;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "questionTime": 10,
  "bestOf": "3",
  "opponent": "Even",
  "countdown": true,
  "sound": true,
  "youColor": "#6FB7C9"
}/*EDITMODE-END*/;

const POWER_TYPES = ['fifty', 'freeze', 'double'];
const FX = window.BR_FX || { play(){}, shake(){}, setEnabled(){}, resume(){} };

const SKILL_MULT = { Forgiving: 0.8, Even: 1.0, Ruthless: 1.25 };

/* Signal to the host frame that the app is ready to receive postMessage config. */
window.BR_APP_READY = false;

/* build a fresh 24-strong field with "you" slotted in at random */
function buildField() {
  const picks = D.shuffle(D.NAME_POOL).slice(0, 23).map((p, i) => ({ ...p, id: 'w' + i }));
  const you = { id: 'you', name: 'You', sigil: 'Σ', hue: 188, skill: 0.78, pace: 2.6, isYou: true };
  const slot = Math.floor(Math.random() * 24);
  picks.splice(slot, 0, you);
  return picks;
}

function simWinner(a, b) {
  const pa = a.skill / (a.skill + b.skill);
  return Math.random() < pa * 0.85 + 0.075 ? a : b;
}

/* resolve every other match in the round; return { winners, matchResults }.
   matchResults[i] = winning player's id for matches[i]. */
function resolveField(matches, byes, you, youWon, foe) {
  const winners = byes.slice();
  const matchResults = matches.map((m, i) => {
    const isYours = m[0].id === 'you' || m[1].id === 'you';
    const w = isYours ? (youWon ? you : foe) : simWinner(m[0], m[1]);
    winners.push(w);
    return w.id;
  });
  return { winners, matchResults };
}

function simulateToChampion(list) {
  let cur = list.slice();
  let guard = 0;
  while (cur.length > 1 && guard++ < 12) {
    const { matches, byes } = D.drawRound(cur);
    const w = byes.slice();
    matches.forEach((m) => w.push(simWinner(m[0], m[1])));
    cur = w;
  }
  return cur[0];
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const [phase, setPhase] = useS('lobby'); // lobby|draw|duel|result|finale
  const [field, setField] = useS(buildField);
  const [survivors, setSurvivors] = useS([]);
  const [draw, setDraw] = useS(null);       // { matches, byes }
  const [foe, setFoe] = useS(null);
  const [result, setResult] = useS(null);   // duel result
  const [champion, setChampion] = useS(null);
  const [youWon, setYouWon] = useS(false);
  const [matchResults, setMatchResults] = useS(null);  // winnerId per match this round
  const stats = useR({ duelsWon: 0, correct: 0, fastest: null });
  const seedRef = useR(Math.floor(Math.random() * 99));

  const [streak, setStreak] = useS(0);     // consecutive round wins (heat)
  const [powers, setPowers] = useS([]);    // earned power-up inventory
  const bestStreakRef = useR(0);

  /* PvP mode — injected by host frame via postMessage */
  const [pvp, setPvp] = useS(false);

  const you = useMemo(() => field.find((p) => p.id === 'you'), [field]);
  const total = field.length;

  /* apply combatant colour tweak */
  useE(() => { document.documentElement.style.setProperty('--you', t.youColor); }, [t.youColor]);

  /* sound on/off */
  useE(() => { FX.setEnabled(!!t.sound); }, [t.sound]);

  /* unlock WebAudio on first user gesture */
  useE(() => {
    const go = () => { FX.resume(); window.removeEventListener('pointerdown', go); };
    window.addEventListener('pointerdown', go);
    return () => window.removeEventListener('pointerdown', go);
  }, []);

  /* Receive config from the host frame (nav.js openBattleRoyale).
     Replaces the question pool and sets pvp mode before the first duel. */
  useE(() => {
    const handler = (e) => {
      if (!e.data || e.data.type !== 'BR_CONFIG') return;
      if (Array.isArray(e.data.questions) && e.data.questions.length) {
        D.QUESTION_POOL = e.data.questions;
      }
      setPvp(!!e.data.pvp);
    };
    window.addEventListener('message', handler);
    window.BR_APP_READY = true;
    return () => window.removeEventListener('message', handler);
  }, []);

  /* round outcome from the arena → drives the heat streak */
  const onRound = (winner) => {
    setStreak((s) => {
      const ns = winner === 'you' ? s + 1 : winner === 'foe' ? 0 : s;
      if (ns > bestStreakRef.current) bestStreakRef.current = ns;
      return ns;
    });
  };

  /* arena asks to spend a power; return true if it was in stock */
  const onUsePower = (type) => {
    let ok = false;
    setPowers((arr) => {
      const i = arr.indexOf(type);
      if (i < 0) return arr;
      ok = true;
      const copy = arr.slice(); copy.splice(i, 1); return copy;
    });
    return ok || powers.includes(type);
  };

  const settings = {
    questionTime: t.questionTime,
    bestOf: parseInt(t.bestOf, 10),
    botSkill: SKILL_MULT[t.opponent] || 1.0,
    countdown: !!t.countdown,
  };

  const remaining = phase === 'lobby' ? total : survivors.length;
  const roundInfo = D.roundLabel(phase === 'lobby' ? total : survivors.length);

  /* ── start tournament ── */
  const startTournament = () => {
    stats.current = { duelsWon: 0, correct: 0, fastest: null };
    bestStreakRef.current = 0;
    setStreak(0); setPowers([]);
    FX.resume();
    const surv = field.slice();
    setSurvivors(surv);
    const dr = D.drawRound(surv);
    const m0 = dr.matches[0];
    setDraw(dr);
    setFoe(m0[0].id === 'you' ? m0[1] : m0[0]);
    setPhase('draw');
  };

  /* ── duel finished ── */
  const onDuelComplete = (res) => {
    setResult(res);
    // tally stats
    stats.current.correct += res.correct;
    if (res.fastest != null && (stats.current.fastest == null || res.fastest < stats.current.fastest))
      stats.current.fastest = res.fastest;

    const won = res.winner === 'you';
    if (won) stats.current.duelsWon += 1;

    // award a random power-up for winning a duel
    if (won) {
      const reward = POWER_TYPES[Math.floor(Math.random() * POWER_TYPES.length)];
      setPowers((arr) => [...arr, reward]);
    } else {
      setStreak(0); // a lost duel breaks the streak
    }

    const newSurv = resolveField(draw.matches, draw.byes, you, won, foe);
    setSurvivors(newSurv.winners);
    setMatchResults(newSurv.matchResults);

    if (won && newSurv.winners.length === 1) {
      // you ARE the champion
      FX.play('victory');
      setChampion(you); setYouWon(true); setPhase('finale');
    } else if (won) {
      setPhase('result');
    } else {
      FX.play('defeat');
      // eliminated — crown whoever wins the rest
      const champ = simulateToChampion(newSurv.winners);
      setChampion(champ); setYouWon(false);
      setPhase('result');
    }
  };

  /* ── from result → next draw or finale ── */
  const onResultNext = () => {
    if (result.winner === 'you') {
      const dr = D.drawRound(survivors);
      const m0 = dr.matches[0];
      setDraw(dr);
      setFoe(m0[0].id === 'you' ? m0[1] : m0[0]);
      setPhase('draw');
    } else {
      // eliminated → straight to the final
      setPhase('finale');
    }
  };

  /* ── spectator: a champion emerges from the watched bracket ── */
  const onSpectateChampion = (champ) => {
    setChampion(champ || simulateToChampion(survivors));
    setYouWon(false);
    setPhase('finale');
  };

  const replay = () => {
    const f = buildField();
    seedRef.current = Math.floor(Math.random() * 99);
    stats.current = { duelsWon: 0, correct: 0, fastest: null };
    bestStreakRef.current = 0;
    setField(f); setSurvivors([]); setDraw(null); setFoe(null);
    setResult(null); setChampion(null); setYouWon(false);
    setStreak(0); setPowers([]);
    setPhase('lobby');
  };

  /* questions for a single duel */
  const duelQuestions = useMemo(() => {
    if (phase !== 'duel') return [];
    return D.shuffle(D.QUESTION_POOL).slice(0, 12);
  }, [phase, foe]);

  const advanced = result && result.winner === 'you';
  const nextInfo = advanced ? D.roundLabel(survivors.length) : null;

  return (
    <React.Fragment>
      <ArenaFX intensity={phase === 'duel' ? 'duel' : phase === 'finale' ? (youWon ? 'win' : 'idle') : 'idle'} />

      {phase === 'lobby' && <Lobby field={field} pvp={pvp} onStart={startTournament} />}

      {phase === 'draw' && foe && draw && (
        <DrawCeremony
          you={you} foe={foe} field={field} roundInfo={roundInfo}
          remaining={remaining} total={total}
          matches={draw.matches} byes={draw.byes} youMatchIdx={0}
          onBegin={() => setPhase('duel')} />
      )}

      {phase === 'duel' && foe && (
        <DuelArena
          key={foe.id + '-' + survivors.length}
          you={you} foe={foe} roundInfo={roundInfo}
          settings={settings} questions={duelQuestions}
          streak={streak} powers={powers}
          pvp={pvp}
          onRound={onRound} onUsePower={onUsePower}
          onComplete={onDuelComplete} />
      )}

      {phase === 'result' && result && (
        <RoundResult
          you={you} foe={foe} advanced={advanced} result={result}
          nextInfo={nextInfo} remaining={survivors.length} total={total}
          matches={draw && draw.matches} byes={draw && draw.byes}
          matchResults={matchResults} youMatchIdx={0}
          onNext={onResultNext} onSpectate={() => setPhase('spectate')} />
      )}

      {phase === 'spectate' && (
        <Spectatorium
          survivors={survivors} total={total}
          onChampion={onSpectateChampion} />
      )}

      {phase === 'finale' && champion && (
        <Finale
          champion={champion} youWon={youWon}
          stats={{ ...stats.current, bestStreak: bestStreakRef.current }} quoteSeed={seedRef.current}
          onReplay={replay} />
      )}

      <TweaksPanel>
        <TweakSection label="The Duel" />
        <TweakSlider label="Answer time" value={t.questionTime} min={6} max={16} step={1} unit="s"
          onChange={(v) => setTweak('questionTime', v)} />
        <TweakRadio label="Rounds" value={t.bestOf} options={['1', '3', '5']}
          onChange={(v) => setTweak('bestOf', v)} />
        {!pvp && <TweakRadio label="Opponent" value={t.opponent} options={['Forgiving', 'Even', 'Ruthless']}
          onChange={(v) => setTweak('opponent', v)} />}
        <TweakToggle label="3·2·1 countdown" value={t.countdown}
          onChange={(v) => setTweak('countdown', v)} />
        <TweakToggle label="Sound &amp; haptics" value={t.sound}
          onChange={(v) => setTweak('sound', v)} />
        <TweakSection label="Your colours" />
        <TweakColor label="Sigil accent" value={t.youColor}
          options={['#6FB7C9', '#C9A84C', '#8FB36A', '#B58AD6']}
          onChange={(v) => setTweak('youColor', v)} />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

/* Entrance animations start from opacity:0 — only enable them once the page
   is actually visible, so a hidden/backgrounded iframe (frozen timeline) still
   shows content at its resting state. */
function enableAnim() {
  if (document.visibilityState === 'visible') {
    const r = document.getElementById('root');
    if (r) r.classList.add('animate');
  }
}
document.addEventListener('visibilitychange', enableAnim);
enableAnim();
