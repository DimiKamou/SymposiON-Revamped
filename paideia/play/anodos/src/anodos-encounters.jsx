/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — encounter modals (duels with foes · 3 formats · juice)
   ════════════════════════════════════════════════════════════════════ */
const { useState, useMemo, useEffect, useRef } = React;

// ── mini icons ───────────────────────────────────────────────────────
const IcoDrachma = () => (
  <svg className="ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sym-gold-lt)" strokeWidth="1.8"><circle cx="12" cy="12" r="9"/><path d="M9 9.5a3 3 0 1 1 0 5M8.5 12H13" strokeLinecap="round"/></svg>
);
const IcoXp = () => (
  <svg className="ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sym-gold)" strokeWidth="1.8" strokeLinejoin="round"><path d="M12 3l2.4 5.5L20 9l-4 4 1 6-5-3-5 3 1-6-4-4 5.6-.5z"/></svg>
);
const IcoSpirit = () => (
  <svg className="ico" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--sym-terra)" strokeWidth="1.8" strokeLinecap="round"><path d="M12 21s-7-4.6-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.4-7 10-7 10z"/></svg>
);

const LETTERS = ["Α", "Β", "Γ", "Δ"];
const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ── juice (imperative, purely visual) ───────────────────────────────
function fxShake() {
  if (reduceMotion) return;
  const s = document.querySelector(".stage"); if (!s) return;
  s.classList.remove("fx-shake"); void s.offsetWidth; s.classList.add("fx-shake");
  setTimeout(() => s.classList.remove("fx-shake"), 480);
}
function fxFlash(color) {
  let el = document.querySelector(".fx-flash");
  if (!el) { el = document.createElement("div"); el.className = "fx-flash"; document.body.appendChild(el); }
  el.style.setProperty("--flash", color || "rgba(217,107,48,.5)");
  el.classList.remove("on"); void el.offsetWidth; el.classList.add("on");
  setTimeout(() => el.classList.remove("on"), 420);
}
function fxFloat(text, color, sel) {
  const host = document.querySelector(sel || ".foe__medallion") || document.querySelector(".modal");
  if (!host) return;
  const r = host.getBoundingClientRect();
  const span = document.createElement("div");
  span.className = "fx-float"; span.textContent = text; span.style.color = color || "var(--sym-gold-lt)";
  span.style.left = (r.left + r.width / 2 + (Math.random() * 28 - 14)) + "px";
  span.style.top = (r.top + r.height * 0.4) + "px";
  document.body.appendChild(span);
  setTimeout(() => span.remove(), 1050);
}
function fxRecoil(sel) {
  if (reduceMotion) return;
  const el = document.querySelector(sel); if (!el) return;
  el.classList.remove("hit"); void el.offsetWidth; el.classList.add("hit");
  setTimeout(() => el.classList.remove("hit"), 420);
}

// ── reward count-up chip ─────────────────────────────────────────────
function CountChip({ icon, to, suffix }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf, start;
    const dur = 700;
    const step = (ts) => { if (!start) start = ts; const p = Math.min(1, (ts - start) / dur);
      setN(Math.round(to * (1 - Math.pow(1 - p, 3)))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step); return () => cancelAnimationFrame(raf);
  }, [to]);
  return <span className="rchip rchip--pop">{icon} +{n}{suffix || ""}</span>;
}
function RewardChips({ drachmes, xp, menos }) {
  return (
    <div className="rewards">
      {drachmes ? <CountChip icon={<IcoDrachma />} to={drachmes} /> : null}
      {xp ? <CountChip icon={<IcoXp />} to={xp} suffix=" XP" /> : null}
      {menos ? <span className="rchip"><IcoSpirit /> {menos > 0 ? "+" : ""}{menos}</span> : null}
    </div>
  );
}

// ── foe medallion (sigil + glyph + HP pips + intent) ─────────────────
function FoeBanner({ foe, foeHp, maxHp, lang, intentVisible, shielded }) {
  const intent = INTENTS[foe.intent] || INTENTS.strike;
  return (
    <div className={"foe" + (shielded ? " foe--shielded" : "")} style={{ "--foe": foe.color }}>
      {shielded ? <div className="foe__aegis" aria-hidden="true"></div> : null}
      {intentVisible ? (
        <div className="foe__intent" title={intent.desc(foe.dmg)}>
          <span className="foe__intent-ic">{intent.icon}</span>
          <span className="foe__intent-txt">{intent.label} · {foe.dmg}</span>
        </div>
      ) : <div className="foe__intent foe__intent--ghost">—</div>}
      <div className="foe__medallion">
        <span className="foe__glyph">{foe.glyph}</span>
        <span className="foe__sigil">{foe.sigil}</span>
      </div>
      <div className="foe__name">{lang === "en" ? foe.en : foe.name}</div>
      <div className="foe__hp">
        {Array.from({ length: maxHp }).map((_, i) => (
          <span key={i} className={"hp-pip" + (i < foeHp ? " hp-pip--full" : "")}></span>
        ))}
      </div>
    </div>
  );
}

// ── timer ring for ⚡ volley ─────────────────────────────────────────
function TimerRing({ left, total }) {
  const R = 16, C = 2 * Math.PI * R;
  const frac = Math.max(0, left / total);
  const danger = left <= total * 0.34;
  return (
    <svg className={"timering" + (danger ? " timering--danger" : "")} width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r={R} fill="none" stroke="var(--sym-hairline)" strokeWidth="3" />
      <circle cx="22" cy="22" r={R} fill="none" stroke={danger ? "var(--sym-terra)" : "var(--sym-gold)"} strokeWidth="3"
        strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C * (1 - frac)} transform="rotate(-90 22 22)"
        style={{ transition: "stroke-dashoffset .25s linear" }} />
      <text x="22" y="27" textAnchor="middle" fontFamily="var(--font-display)" fontSize="15" fill="var(--sym-cream)">{Math.ceil(left)}</text>
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════
// DUEL — combat / elite / boss with formats: mc · volley · duel
// ═════════════════════════════════════════════════════════════════════
const FORMAT_META = {
  mc:     { eyebrow: "Μονομαχία · Duel of Wits", tag: "Ἐρώτησις", chip: "📜 Ἐρωτήσεις" },
  volley: { eyebrow: "Ριπή · Rapid Volley",      tag: "Ἀληθὲς ἢ Ψευδές", chip: "⚡ Ταχύτης" },
  duel:   { eyebrow: "Μονοθέσιον · Sudden Death", tag: "Μία ζωή", chip: "🎯 Διπλὴ ἀμοιβή" },
};

function Battle({ node, ctx }) {
  const isBoss = node.type === "boss";
  const isElite = node.type === "elite";
  const foe = FOES[node.foe] || FOES.spearman;
  const format = node.format || "mc";
  const fm = FORMAT_META[format];
  const maxHp = foe.hp + (isBoss ? ((ctx.mods && ctx.mods.bossHpAdd) || 0) : 0);
  const accent = isBoss ? "var(--sym-terra)" : foe.color;
  const cursedDark = ctx.hasCurse("skotos");
  const mech = isBoss ? (BOSS_MECHANICS[node.foe] || null) : null;
  const hasPatron = (id) => ctx.hasPatron && ctx.hasPatron(id);
  let VOLLEY_T = cursedDark ? 4 : 6; // σκότος shortens the volley
  if (hasPatron("hermes")) VOLLEY_T += 2.5; // Ἑρμῆς — swift

  // build queue — prefer a user-selected bank from the host, else the built-in pools.
  //   ctx.getQuestions(format, node)  → array (overrides everything), OR
  //   ctx.questions / ctx.tfQuestions → arrays the host has loaded per user choice.
  const queue = useMemo(() => {
    const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
    const custom = ctx.getQuestions ? ctx.getQuestions(format, node) : null;
    if (custom && custom.length) {
      const p = shuffle([...custom]);
      return format === "volley" ? p.slice(0, maxHp + 6) : [...p, ...p].slice(0, maxHp + 8);
    }
    if (format === "volley") {
      const bank = (ctx.tfQuestions && ctx.tfQuestions.length) ? ctx.tfQuestions : TF_BANK;
      return shuffle([...bank]).slice(0, maxHp + 6);
    }
    const bank = (ctx.questions && ctx.questions.length) ? ctx.questions : QUESTIONS;
    const p = shuffle([...bank]);
    return [...p, ...p].slice(0, maxHp + 8);
  }, [node.id]);

  const [foeHp, setFoeHp] = useState(maxHp);
  const [qi, setQi] = useState(0);
  const [picked, setPicked] = useState(null);   // index (mc/duel) or boolean (volley)
  const [misses, setMisses] = useState(0);
  const [corrects, setCorrects] = useState(0);
  const [gold, setGold] = useState(0);
  const [usedFreebie, setUsedFreebie] = useState(false);
  const [phase, setPhase] = useState("fight");   // fight | won | failed | fled
  const [award, setAward] = useState(null);
  const [timeLeft, setTimeLeft] = useState(VOLLEY_T);
  const resolvedRef = useRef(false);
  // ── streak surge (feature: μένος strike) ──
  const [surge, setSurge] = useState(0);          // 0..3 building meter
  const [surging, setSurging] = useState(false);  // brief charged glow
  // ── boss mechanics state ──
  const [shielded, setShielded] = useState(mech && mech.kind === "shield"); // Sarpedon
  const woundsRef = useRef(0);                    // Hector counter cadence
  const [flee, setFlee] = useState(0);            // Aeneas slip gauge (0..2)

  const cur = queue[qi % queue.length];
  let perCorrect = ctx.hasRelic("spear") ? 9 : 6;
  if (hasPatron("ares")) perCorrect = Math.round(perCorrect * 1.6); // Ἄρης — spoils of war
  const showHint = (ctx.hasRelic("muse") || hasPatron("apollo")) && format !== "volley" && !cursedDark;
  const [hint, setHint] = useState(false);
  const [removed, setRemoved] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const qStartRef = useRef(Date.now());
  useEffect(() => { setHint(false); setRemoved(null); setRevealed(false); qStartRef.current = Date.now(); }, [qi]);
  function useLifelineNow(id) {
    if (picked !== null) return;
    if (id === "oracle") { if (hint) return; setHint(true); }
    else if (id === "halving") { if (removed) return; const wrong = [0, 1, 2, 3].filter((x) => x !== cur.a); for (let i = wrong.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [wrong[i], wrong[j]] = [wrong[j], wrong[i]]; } setRemoved(new Set(wrong.slice(0, 2))); }
    else if (id === "mnemosyne") { if (revealed) return; setRevealed(true); }
    if (ctx.useLifeline) ctx.useLifeline(id);
  }

  // aegis 50/50 on first elite question · Athena grants it on EVERY battle
  const fifty = useMemo(() => {
    const grant = (isElite && ctx.hasRelic("aegis")) || hasPatron("athena");
    if (!grant || format === "volley" || qi !== 0) return null;
    const wrong = [0, 1, 2, 3].filter((i) => i !== cur.a);
    for (let i = wrong.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [wrong[i], wrong[j]] = [wrong[j], wrong[i]]; }
    return new Set(wrong.slice(0, 2));
  }, [qi]);

  // volley timer
  useEffect(() => {
    if (format !== "volley" || phase !== "fight" || picked !== null) return;
    setTimeLeft(VOLLEY_T);
    const t0 = Date.now();
    const iv = setInterval(() => {
      const left = VOLLEY_T - (Date.now() - t0) / 1000;
      if (left <= 0) { clearInterval(iv); onAnswer(null); }
      else setTimeLeft(left);
    }, 100);
    return () => clearInterval(iv);
  }, [qi, phase, picked]);

  function woundFoe(big) {
    setGold((g) => g + perCorrect); ctx.gainDrachmes(perCorrect);
    setCorrects((c) => c + 1);
    if (ctx.sfx) ctx.sfx(big ? "surge" : "correct");
    fxFloat("✦ +" + perCorrect, "var(--sym-gold-lt)", ".foe");
    // Sarpedon's aegis turns aside every other wound
    if (mech && mech.kind === "shield" && shielded) {
      setShielded(false);
      fxFloat("κλαγγή!", "var(--sym-aegean)"); fxRecoil(".foe__medallion");
      return;
    }
    const dmg = big ? 2 : 1;
    if (big) fxFloat("ΜΕΝΟΣ! −" + dmg, "var(--sym-gold-lt)");
    else fxFloat("−" + dmg, "var(--sym-sage)");
    fxRecoil(".foe__medallion");
    if (mech && mech.kind === "shield") setShielded(true);   // re-raise for next
    woundsRef.current += 1;
    const hectorCounter = mech && mech.kind === "counter" && woundsRef.current % 2 === 0;
    setFoeHp((h) => {
      const nh = Math.max(0, h - dmg);
      if (nh <= 0 && !resolvedRef.current) { resolvedRef.current = true; setTimeout(() => win(), 520); }
      return nh;
    });
    if (hectorCounter) setTimeout(() => { if (!resolvedRef.current) counterStrike(); }, 380);
  }
  // shared damage calc (relics · curses · patron · ascension)
  function computeStrikeDmg(freebieOk) {
    let dmg = foe.dmg;
    if (freebieOk && ctx.hasRelic("aspis") && !usedFreebie) { setUsedFreebie(true); return 0; }
    if (ctx.hasRelic("sandals")) dmg = Math.round(dmg * 0.7);
    if (ctx.hasCurse("mania")) dmg = Math.round(dmg * 1.5);          // μανία
    if (hasPatron("ares")) dmg = Math.round(dmg * 1.25);            // Ἄρης risk
    if (ctx.mods && ctx.mods.dmgMult) dmg = Math.round(dmg * ctx.mods.dmgMult); // ἀνάβασις
    return dmg;
  }
  function counterStrike() {  // Hector's riposte — no miss tally
    const dmg = computeStrikeDmg(false);
    if (dmg > 0) { fxShake(); fxFlash("rgba(217,107,48,.55)"); fxFloat("⚔ −" + dmg, "var(--sym-terra)", ".hud"); if (ctx.sfx) ctx.sfx("hit"); ctx.damage(dmg); }
  }
  function strikePlayer() {
    setMisses((m) => m + 1);
    setSurge(0); setSurging(false);   // a miss breaks the streak
    const dmg = computeStrikeDmg(true);
    if (dmg > 0) { fxShake(); fxFlash("rgba(217,107,48,.5)"); fxFloat("−" + dmg, "var(--sym-terra)", ".hud"); if (ctx.sfx) ctx.sfx("hit"); ctx.damage(dmg); }
    else fxFloat("ἀσπίς!", "var(--sym-aegean)", ".hud");
    // Aeneas slips free on hesitation — every 2nd miss he regains a life
    if (mech && mech.kind === "flee") {
      setFlee((f) => {
        const nf = f + 1;
        if (nf >= 2) { setFoeHp((h) => Math.min(maxHp, h + 1)); fxFloat("↺ ξεγλιστρᾶ", "var(--foe)", ".foe"); return 0; }
        return nf;
      });
    }
    // wrong answers can inflict a μίασμα (curse). harsher for elites/bosses + ascension.
    const curseChance = (isBoss ? 1 : isElite ? 0.6 : 0.32) + ((ctx.mods && ctx.mods.curseChanceAdd) || 0);
    if (Math.random() < curseChance) setTimeout(() => ctx.inflictCurse(), 320);
    return dmg;
  }

  // mc / duel answer
  function onAnswer(i) {
    if (picked !== null || phase !== "fight") return;
    const correct = format === "volley" ? (i !== null && i === cur.t) : (i === cur.a);
    const fast = correct && (Date.now() - qStartRef.current) < 2500;
    if (ctx.track) ctx.track("answer", { correct, fast, format });
    setPicked(format === "volley" ? (i === null ? "timeout" : i) : i);
    if (correct) {
      const newSurge = surge + 1;
      const big = newSurge >= 3;       // every third correct lands a μένος strike
      if (big) { setSurge(0); setSurging(true); setTimeout(() => setSurging(false), 720); }
      else setSurge(newSurge);
      woundFoe(big);
      if (format === "volley") setTimeout(() => nextRound(), 700);
    } else {
      if (ctx.sfx) ctx.sfx("wrong");
      strikePlayer();
      if (format === "duel") { resolvedRef.current = true; setTimeout(() => { ctx.inflictCurse(); setPhase("failed"); }, 700); return; }
      if (format === "volley") setTimeout(() => nextRound(), 850);
    }
  }
  function nextRound() {
    if (resolvedRef.current) return;
    setPicked(null); setQi((q) => q + 1);
  }

  function win() {
    let xp = isBoss ? 70 : isElite ? 36 : 18;
    let bonus = isBoss ? 32 : isElite ? 22 : 14;
    if (format === "duel") { xp *= 2; bonus *= 2; }
    if (ctx.hasRelic("laurel")) xp = Math.round(xp * 1.2);
    if (ctx.hasBoost && ctx.hasBoost("scholar")) xp = Math.round(xp * 1.25);
    if (ctx.hasRelic("obol")) bonus += 5;
    if (ctx.hasCurse("burden")) { xp = Math.round(xp * 0.5); bonus = Math.round(bonus * 0.5); } // βάρος
    const rm = (ctx.mods && ctx.mods.rewardMult) || 1;
    if (rm !== 1) { xp = Math.round(xp * rm); bonus = Math.round(bonus * rm); }   // ἀνάβασις
    ctx.gainDrachmes(bonus); ctx.gainXp(xp);
    if (ctx.sfx) ctx.sfx(isBoss ? "boss" : "reward");
    setGold((g) => g + bonus);
    const relicChance = isBoss || isElite ? 1 : format === "duel" ? 0.6 : 0.28;
    setAward(Math.random() < relicChance ? ctx.takeRelic() : null);
    setRewardXp(xp);
    setPhase("won");
    if (ctx.track) ctx.track("battleWin", { kind: isBoss ? "boss" : isElite ? "elite" : "combat", flawless: misses === 0, format });
    if (!reduceMotion) fxFlash("rgba(200,120,48,.4)");
  }
  const [rewardXp, setRewardXp] = useState(0);
  const dreadApplied = useRef(false);

  // δέος (dread): begin the battle already wounded
  useEffect(() => {
    if (dreadApplied.current) return;
    dreadApplied.current = true;
    if (ctx.hasCurse("dread")) { ctx.damage(6); fxShake(); fxFlash("rgba(120,40,160,.45)"); fxFloat("−6 δέος", "#b76fd0", ".hud"); }
  }, []);

  // ── WON / FAILED screens ───────────────────────────────────────────
  if (phase === "won") {
    return (
      <div className="modal__pad" style={{ "--node-accent": accent }}>
        <div className="modal__crest" style={{ fontSize: 34 }}>{foe.sigil}</div>
        <div className="modal__eyebrow">{misses === 0 ? "Ἄψογος · Flawless" : "Νίκη · Victory"}{format === "duel" ? " · ×2" : ""}</div>
        <h2 className="modal__title">{isBoss ? (node.final ? "Ἡ Τροία ἔπεσε" : "Ὁ φύλαξ ἔπεσε") : "Ὁ ἐχθρὸς ἔπεσε"}</h2>
        <p className="modal__sub">{misses === 0 ? "Καμία πληγή — οἱ Μοῦσες χαμογελοῦν." : `${misses} ${misses === 1 ? "πληγὴ" : "πληγὲς"} στὴ μάχη.`}</p>
        <RewardChips drachmes={gold} xp={rewardXp} />
        {award ? (
          <>
            <hr className="modal__rule" />
            <div className="relicbig">{award.icon}</div>
            <div className="modal__eyebrow">Περίαπτον λαμβάνεται</div>
            <h3 className="modal__title" style={{ fontSize: 22 }}>{award.name}</h3>
            <p className="modal__sub" style={{ fontSize: 15 }}>{ctx.lang === "en" ? award.en : award.desc}</p>
          </>
        ) : null}
        <div className="btnrow">
          <button className="btn btn--gold" onClick={() => ctx.advanceTo(node.id)}>{node.final ? "Δες τὴ νίκη →" : "Συνέχισε τὴν ἄνοδο →"}</button>
        </div>
      </div>
    );
  }
  if (phase === "failed") {
    return (
      <div className="modal__pad" style={{ "--node-accent": "var(--sym-terra)" }}>
        <div className="modal__crest" style={{ fontSize: 34 }}>🩸</div>
        <div className="modal__eyebrow">Σφάλμα · The duel is lost</div>
        <h2 className="modal__title">Μιὰ πληγὴ ἀρκεῖ</h2>
        <p className="modal__sub">Στὸ μονοθέσιον δὲν χωράει λάθος. Ὁ {ctx.lang === "en" ? foe.en : foe.name} σὲ ἔσπρωξε πίσω — καὶ ένα μίασμα σὲ βαραίνει.</p>
        <div className="btnrow">
          <button className="btn btn--ghost" onClick={() => ctx.knockback()}>Ὀπισθοχώρησις ↓</button>
        </div>
      </div>
    );
  }

  // ── FIGHT ──────────────────────────────────────────────────────────
  const totalRounds = format === "duel" ? maxHp : maxHp;
  return (
    <div className="modal__pad modal__pad--battle" style={{ "--node-accent": accent }}>
      <div className="modal__eyebrow">{fm.eyebrow}</div>
      <FoeBanner foe={foe} foeHp={foeHp} maxHp={maxHp} lang={ctx.lang} intentVisible={picked === null} shielded={!!shielded} />
      {isBoss && foe.quote ? <p className="foe__quote">{foe.quote}</p> : null}
      {mech ? (
        <div className={"mechbar mechbar--" + mech.kind}>
          <span className="mechbar__ic">{mech.icon}</span>
          <span className="mechbar__tx"><b>{ctx.lang === "en" ? mech.en : mech.name}</b> · {ctx.lang === "en" ? mech.enTel : mech.telegraph}</span>
          {mech.kind === "flee" ? (
            <span className="mechbar__gauge">{[0, 1].map((i) => <i key={i} className={i < flee ? "on" : ""}></i>)}</span>
          ) : (
            <span className={"mechbar__state" + ((mech.kind === "shield" ? shielded : woundsRef.current % 2 === 1) ? " mechbar__state--on" : "")}>
              {mech.kind === "shield" ? (shielded ? "🛡" : "⚔") : (woundsRef.current % 2 === 1 ? "⚠" : "⚔")}
            </span>
          )}
        </div>
      ) : null}

      <div className="battlebar">
        <span className="battlebar__chip">{fm.chip}</span>
        <span className="battlebar__chip battlebar__chip--ghost">Πληγὲς {corrects}/{maxHp}</span>
        <span className={"surge" + (surging ? " surge--burst" : "")} title="Σερὶ ὀρθῶν — γέμισέ το γιὰ διπλὴ πληγή">
          {[0, 1, 2].map((i) => <i key={i} className={"surge__pip" + (i < surge ? " surge__pip--on" : "")}></i>)}
        </span>
        {format === "volley" && picked === null ? <TimerRing left={timeLeft} total={VOLLEY_T} /> : null}
      </div>

      {format !== "volley" && phase === "fight" ? (
        <div className="lifelines">
          <span className="lifelines__lbl">Βοήθειες</span>
          {(window.LIFELINES || []).map((l) => {
            const cnt = (ctx.lifelines && ctx.lifelines[l.id]) || 0;
            const used = (l.id === "oracle" && hint) || (l.id === "halving" && removed) || (l.id === "mnemosyne" && revealed);
            return (
              <button key={l.id} className={"lifeline" + (l.kind === "cheat" ? " lifeline--cheat" : "") + (used ? " lifeline--spent" : "")}
                disabled={picked !== null || cnt <= 0 || used} onClick={() => useLifelineNow(l.id)} title={ctx.lang === "en" ? l.enDesc : l.desc}>
                <span className="lifeline__ic">{l.icon}</span>{l.name}<span className="lifeline__cnt">{cnt}</span>
              </button>
            );
          })}
        </div>
      ) : null}

      {format === "volley" ? (
        <>
          <p className="q q__greek tf">{cur.s}</p>
          <div className="tfrow">
            {[true, false].map((v) => {
              let cls = "tfbtn";
              if (picked !== null && picked !== "timeout") { if (v === cur.t) cls += " opt--right"; else if (v === picked) cls += " opt--wrong"; }
              else if (picked === "timeout" && v === cur.t) cls += " opt--right";
              return (
                <button key={String(v)} className={cls} disabled={picked !== null} onClick={() => onAnswer(v)}>
                  <span className="tfbtn__ic">{v ? "✓" : "✗"}</span>{v ? "Ἀληθές" : "Ψευδές"}
                </button>
              );
            })}
          </div>
          {picked !== null ? (
            <p className={"feedback " + (picked !== "timeout" && picked === cur.t ? "feedback--good" : "feedback--bad")}>
              {picked === "timeout" ? "Ἄργησες! Ὁ ἐχθρὸς χτυπᾷ." : picked === cur.t ? "Ὀρθῶς!" : "Ἐσφαλμένο!"}
            </p>
          ) : null}
        </>
      ) : (
        <>
          <p className={"q" + (cur.greek ? " q__greek" : "")}>{cur.q}</p>
          <div className="opts">
            {cur.opts.map((o, i) => {
              const struck = (fifty && fifty.has(i)) || (removed && removed.has(i));
              if (struck && picked === null) return (
                <button key={i} className="opt" disabled style={{ opacity: .3 }}><span className="opt__key">{LETTERS[i]}</span><span style={{ textDecoration: "line-through" }}>{o}</span></button>
              );
              let cls = "opt";
              if (picked !== null) { if (i === cur.a) cls += " opt--right"; else if (i === picked) cls += " opt--wrong"; }
              else if (revealed && i === cur.a) cls += " opt--right";
              return (
                <button key={i} className={cls} disabled={picked !== null} onClick={() => onAnswer(i)}>
                  <span className="opt__key">{LETTERS[i]}</span><span className="q__greek">{o}</span>
                </button>
              );
            })}
          </div>
          {(showHint || hint) && picked === null ? <p className="hintline">{hint ? "🔮" : "🎼"} {cur.hint}</p> : null}
          {picked !== null ? (
            <>
              <p className={"feedback " + (picked === cur.a ? "feedback--good" : "feedback--bad")}>
                {picked === cur.a ? `Ὀρθῶς! ✦ +${perCorrect} δρ` : (ctx.hasRelic("aspis") && usedFreebie ? "Ἡ Ἀσπὶς σὲ προστάτεψε." : `Ἐσφαλμένο — «${cur.opts[cur.a]}».`)}
              </p>
              {foeHp > 0 ? <div className="btnrow"><button className="btn btn--gold" onClick={nextRound}>Συνέχισε τὴ μάχη →</button></div> : null}
            </>
          ) : null}
        </>
      )}

      <div className="stubrow">
        <code>{isElite ? "openIliadaArcade()" : isBoss ? "openIstoria()" : "openRapidFire()"}</code>
        <button className="stublink" onClick={() => { setCorrects(maxHp); setFoeHp(0); resolvedRef.current = true; win(); }}>▶ Παίξε τὸ πλῆρες παιχνίδι</button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════
// MYSTERY (Οἰωνός) + RIDDLE (Αἴνιγμα)
// ═════════════════════════════════════════════════════════════════════
function Mystery({ node, ctx }) {
  const ev = useMemo(() => {
    const riddles = EVENTS.filter((e) => e.riddle);
    const others = EVENTS.filter((e) => !e.riddle);
    const pool = node.type === "riddle" ? riddles : (Math.random() < 0.4 ? riddles : others);
    return pool[Math.floor(Math.random() * pool.length)];
  }, [node.id]);
  const [resolved, setResolved] = useState(null);
  const [riddlePick, setRiddlePick] = useState(null);
  const accent = node.type === "riddle" ? "var(--sym-aegean)" : "var(--sym-aegean)";

  function applyEffect(e) {
    let msg = [], good = true;
    if (e.gamble) {
      if (Math.random() < 0.5) { const r = ctx.takeRelic(); msg.push(r ? `Βρήκες: ${r.name}` : "+30 δραχμές"); if (!r) ctx.gainDrachmes(30); fxFloat("✦", "var(--sym-gold-lt)", ".modal__crest"); }
      else { ctx.damage(10); fxShake(); fxFlash(); msg.push("Τὰ κύματα σὲ χτύπησαν: −10 μένος"); good = false; }
    } else {
      if (e.drachmes) { ctx.gainDrachmes(e.drachmes); msg.push(`${e.drachmes > 0 ? "+" : ""}${e.drachmes} δραχμές`); if (e.drachmes < 0) good = false; }
      if (e.menos) { if (e.menos > 0) ctx.heal(e.menos); else { ctx.damage(-e.menos); fxShake(); } msg.push(`${e.menos > 0 ? "+" : ""}${e.menos} μένος`); if (e.menos < 0) good = false; }
      if (e.relic) { const r = ctx.takeRelic(); if (r) msg.push(`Περίαπτον: ${r.name}`); }
    }
    setResolved({ msg: msg.join(" · ") || "Τίποτα δὲν συνέβη.", good });
  }
  function riddleAnswer(i) {
    if (riddlePick !== null) return;
    setRiddlePick(i);
    if (ctx.track) ctx.track("riddle", { solved: i === ev.riddleA });
    if (i === ev.riddleA) { ctx.gainDrachmes(50); const r = ctx.takeRelic(); fxFloat("✦ +50", "var(--sym-gold-lt)", ".modal__crest"); setResolved({ msg: r ? `Ὀρθῶς! +50 δραχμές · ${r.name}` : "Ὀρθῶς! +50 δραχμές", good: true }); }
    else { ctx.damage(15); fxShake(); fxFlash(); setResolved({ msg: `Λάθος — «${ev.riddleOpts[ev.riddleA]}». −15 μένος`, good: false }); }
  }

  return (
    <div className="modal__pad" style={{ "--node-accent": accent }}>
      <div className="modal__crest">{node.type === "riddle" ? "𓁹" : "❖"}</div>
      <div className="modal__eyebrow">{node.type === "riddle" ? "Αἴνιγμα · Riddle" : "Οἰωνός · Omen"}</div>
      <h2 className="modal__title">{ev.title}</h2>
      <p className="modal__sub">{ev.sub}</p>
      <p className="modal__body" style={{ textAlign: "center", marginBottom: 6 }}>{ev.body}</p>

      {resolved ? (
        <>
          <p className={"feedback " + (resolved.good ? "feedback--good" : "feedback--bad")}>{resolved.msg}</p>
          <div className="btnrow"><button className="btn btn--gold" onClick={() => ctx.advanceTo(node.id)}>Συνέχισε →</button></div>
        </>
      ) : ev.riddle ? (
        <>
          <p className="q" style={{ marginTop: 14 }}>{ev.riddleQ}</p>
          <div className="opts">
            {ev.riddleOpts.map((o, i) => (
              <button key={i} className="opt" onClick={() => riddleAnswer(i)}><span className="opt__key">{LETTERS[i]}</span><span className="q__greek">{o}</span></button>
            ))}
          </div>
        </>
      ) : (
        <div className="choices">
          {ev.choices.map((c, i) => {
            const blocked = c.effect.needDrachmes && ctx.run.drachmes < c.effect.needDrachmes;
            return (
              <button key={i} className="choice" disabled={blocked} onClick={() => applyEffect(c.effect)}>
                <span className="choice__icon">{c.icon}</span>
                <span className="choice__txt"><div className="choice__name">{c.name}</div><div className="choice__desc">{c.desc}{blocked ? " (όχι αρκετές δραχμές)" : ""}</div></span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── REST (Κρήνη) ─────────────────────────────────────────────────────
function Rest({ node, ctx }) {
  const [done, setDone] = useState(null);
  let healAmt = Math.round(ctx.run.menos.max * 0.3) + (ctx.hasRelic("lyre") ? 15 : 0) + (ctx.hasPatron && ctx.hasPatron("apollo") ? 12 : 0);
  if (ctx.mods && ctx.mods.restMult) healAmt = Math.max(4, Math.round(healAmt * ctx.mods.restMult));
  return (
    <div className="modal__pad" style={{ "--node-accent": "var(--sym-sage)" }}>
      <div className="modal__crest">♨</div>
      <div className="modal__eyebrow">Κρήνη · Spring</div>
      <h2 className="modal__title">Στάση στὴν κρήνη</h2>
      <p className="modal__sub">Νερό, σκιά, καὶ μιὰ στιγμὴ ἀνάσας πρὶν τὴν κορυφή.</p>
      {done ? (
        <>
          <p className="feedback feedback--good">{done}</p>
          <div className="btnrow"><button className="btn btn--gold" onClick={() => ctx.advanceTo(node.id)}>Συνέχισε →</button></div>
        </>
      ) : (
        <div className="choices">
          <button className="choice" onClick={() => { ctx.heal(healAmt); fxFloat("+" + healAmt, "var(--sym-sage)", ".modal__crest"); setDone(`Θεραπεύτηκες +${healAmt} μένος.`); }}>
            <span className="choice__icon">💧</span>
            <span className="choice__txt"><div className="choice__name">Ἀναπαύσου</div><div className="choice__desc">Ανάκτησε +{healAmt} μένος{ctx.hasRelic("lyre") ? " (Λύρα +15)" : ""}.</div></span>
          </button>
          <button className="choice" onClick={() => { ctx.fortify(15); fxFloat("+15 max", "var(--sym-gold-lt)", ".modal__crest"); setDone("Τὸ ἀνώτατο μένος σου αὐξήθηκε κατὰ 15."); }}>
            <span className="choice__icon">🔥</span>
            <span className="choice__txt"><div className="choice__name">Ὀχύρωσε</div><div className="choice__desc">+15 ανώτατο μένος μόνιμα (και γέμισέ το).</div></span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── SHOP (Ἀγορά) ─────────────────────────────────────────────────────
function Shop({ node, ctx }) {
  const stock = useMemo(() => {
    const avail = RELICS.filter((r) => !ctx.run.relics.includes(r.id));
    const pool = [...avail];
    for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
    const prices = [42, 56, 72];
    const mult = (ctx.mods && ctx.mods.shopMult) || 1;
    return pool.slice(0, 3).map((r, i) => ({ ...r, price: Math.round(prices[i] * mult) }));
  }, [node.id]);
  const [bought, setBought] = useState([]);
  return (
    <div className="modal__pad" style={{ "--node-accent": "var(--sym-gold-lt)" }}>
      <div className="modal__crest">⚖</div>
      <div className="modal__eyebrow">Ἀγορά · Market</div>
      <h2 className="modal__title">Τὸ ἐμπόριο</h2>
      <p className="modal__sub">Ἔχεις {ctx.run.drachmes} δραχμές. Ξόδεψέ τες σοφά.</p>
      <div className="choices">
        {stock.map((r) => {
          const owned = bought.includes(r.id);
          const cant = ctx.run.drachmes < r.price;
          return (
            <button key={r.id} className="choice" disabled={owned || cant}
              onClick={() => { ctx.spendDrachmes(r.price); ctx.addRelic(r.id); fxFloat("✦", "var(--sym-gold-lt)", ".modal__crest"); setBought((b) => [...b, r.id]); }}>
              <span className="choice__icon">{r.icon}</span>
              <span className="choice__txt"><div className="choice__name">{r.name}</div><div className="choice__desc">{ctx.lang === "en" ? r.en : r.desc}</div></span>
              <span className="choice__cost">{owned ? "✓" : r.price + " δρ"}</span>
            </button>
          );
        })}
      </div>
      <div className="btnrow"><button className="btn btn--ghost" onClick={() => ctx.advanceTo(node.id)}>Ἄφησε τὴν ἀγορά →</button></div>
    </div>
  );
}

// ── TREASURE (Δῶρον) ─────────────────────────────────────────────────
function Treasure({ node, ctx }) {
  const relic = useMemo(() => ctx.peekRelic(), [node.id]);
  const [taken, setTaken] = useState(false);
  return (
    <div className="modal__pad" style={{ "--node-accent": "var(--sym-gold)" }}>
      <div className="modal__crest">❣</div>
      <div className="modal__eyebrow">Δῶρον · Gift of the Gods</div>
      <h2 className="modal__title">Θησαυρὸς</h2>
      {relic ? (
        <>
          <div className="relicbig">{relic.icon}</div>
          <h3 className="modal__title" style={{ fontSize: 23 }}>{relic.name}</h3>
          <p className="modal__sub" style={{ fontSize: 15 }}>{ctx.lang === "en" ? relic.en : relic.desc}</p>
          <div className="btnrow">
            <button className="btn btn--gold" disabled={taken} onClick={() => { ctx.addRelic(relic.id); setTaken(true); setTimeout(() => ctx.advanceTo(node.id), 350); }}>Πάρε τὸ περίαπτο →</button>
          </div>
        </>
      ) : (
        <>
          <p className="modal__sub">Ἔχεις ἤδη ὅλα τὰ περίαπτα — πάρε 60 δραχμές.</p>
          <div className="btnrow"><button className="btn btn--gold" onClick={() => { ctx.gainDrachmes(60); ctx.advanceTo(node.id); }}>+60 δραχμές →</button></div>
        </>
      )}
    </div>
  );
}

Object.assign(window, { Battle, Mystery, Rest, Shop, Treasure, RewardChips, IcoDrachma, IcoXp, IcoSpirit });
