/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — RITUAL BACKDROP (GSAP)
   An act-reactive ritual scene that re-stages itself as the climb rises:
     Act I  · Πεδίον    — the sacrificial pyre on the plain  (ember / ash)
     Act II · Τείχη      — the warded walls of Troy           (stone / cold mist)
     Act III· Ἀκρόπολις  — the citadel under the god-light    (apotheosis)
   Drives: counter-rotating sigil rings, breathing core, a pool of
   GSAP-tweened embers/sparks/dust, per-act light (pyre flicker · watch-
   beam sweep · descending god-rays) and a transition flare on act change.
   Exports: RitualScene (window)
   ════════════════════════════════════════════════════════════════════ */
const { useRef: useRefR, useEffect: useEffectR, useMemo: useMemoR } = React;

const RITUAL_GLYPHS_R = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split("");

// per-act ritual character ─ behaviour of the particle field + light rig
const ACT_RITES = {
  1: { kind: "ember",  count: 34, rise: true,  spread: 1.0, sizeMin: 2,  sizeMax: 5, durMin: 4.5, durMax: 8.5, label: "ΠΥΡ" },
  2: { kind: "spark",  count: 26, rise: true,  spread: 1.0, sizeMin: 1.5,sizeMax: 3, durMin: 8,   durMax: 15,  label: "ΦΥΛΑΞ" },
  3: { kind: "dust",   count: 30, rise: false, spread: 1.0, sizeMin: 2,  sizeMax: 4, durMin: 7,   durMax: 13,  label: "ΦΩΣ" },
};

function RitualScene({ act = 1, tone = "full" }) {
  const root = useRefR(null);
  const motes = useRefR(null);
  const tweens = useRefR([]);
  const spinTl = useRefR(null);
  const prevAct = useRefR(act);

  const N = 40; // particle pool — retuned per act, never re-created
  const seeds = useMemoR(() => Array.from({ length: N }, (_, i) => {
    const h = (i * 2654435761) >>> 0;
    return { x: (h % 1000) / 10, d1: ((h >> 8) % 1000) / 1000, d2: ((h >> 16) % 1000) / 1000, d3: ((h >> 4) % 1000) / 1000 };
  }), []);

  const reduce = useMemoR(() => window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);

  // ── persistent sigil rotation + core breathing (mount once) ─────────
  useEffectR(() => {
    const g = window.gsap;
    if (!g || reduce || !root.current) return;
    const q = g.utils.selector(root.current);
    spinTl.current = [];
    const add = (t) => spinTl.current.push(t);
    add(g.to(q(".rs-spin-a"), { rotation: 360, duration: 150, ease: "none", repeat: -1, transformOrigin: "50% 50%" }));
    add(g.to(q(".rs-spin-b"), { rotation: -360, duration: 95,  ease: "none", repeat: -1, transformOrigin: "50% 50%" }));
    add(g.to(q(".rs-spin-c"), { rotation: 360, duration: 220, ease: "none", repeat: -1, transformOrigin: "50% 50%" }));
    add(g.to(q(".rs-glyphring"), { rotation: -360, duration: 320, ease: "none", repeat: -1, transformOrigin: "50% 50%" }));
    add(g.to(q(".rs-breath"), { scale: 1.045, duration: 6, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 50%" }));
    add(g.to(q(".rs-core"), { opacity: 0.95, scale: 1.18, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 50%" }));
    add(g.fromTo(q(".rs-spoke"), { opacity: 0.15 }, { opacity: 0.6, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: { each: 0.25, from: "random" } }));
    return () => { spinTl.current.forEach((t) => t && t.kill()); spinTl.current = null; };
  }, [reduce]);

  // ── re-tune the particle field for the active act's rite ────────────
  useEffectR(() => {
    const g = window.gsap;
    if (!motes.current) return;
    const rite = ACT_RITES[act] || ACT_RITES[1];
    const nodes = Array.from(motes.current.children);
    // clear old motion
    tweens.current.forEach((t) => t && t.kill());
    tweens.current = [];

    if (!g || reduce) {
      nodes.forEach((el, i) => { el.style.opacity = i < rite.count ? 0.4 : 0; });
      return;
    }

    nodes.forEach((el, i) => {
      const s = seeds[i];
      if (i >= rite.count) { g.set(el, { opacity: 0 }); return; }
      el.className = "rs-mote rs-mote--" + rite.kind;
      const size = rite.sizeMin + s.d2 * (rite.sizeMax - rite.sizeMin);
      g.set(el, { left: s.x + "%", width: size, height: size, opacity: 0 });
      const dur = rite.durMin + s.d1 * (rite.durMax - rite.durMin);
      const delay = s.d3 * dur;
      const drift = (s.d2 - 0.5) * (rite.kind === "dust" ? 90 : 140);

      const run = () => {
        if (rite.rise) {
          // embers / sparks climb from the floor to the sky
          g.fromTo(el,
            { y: 0, x: 0, opacity: 0, scale: 0.6 },
            { keyframes: [{ opacity: 0.9, scale: 1, duration: dur * 0.25 }, { opacity: 0, scale: 0.4, duration: dur * 0.75 }],
              y: () => -(window.innerHeight * (0.55 + s.d1 * 0.5)), x: drift, duration: dur, ease: "power1.out",
              onComplete: () => { tweens.current[i] = g.delayedCall(s.d2 * 1.6, run); } });
        } else {
          // god-dust drifts down from the light
          g.fromTo(el,
            { y: -40, x: 0, opacity: 0, scale: 0.8 },
            { keyframes: [{ opacity: 0.8, duration: dur * 0.3 }, { opacity: 0, duration: dur * 0.7 }],
              y: () => window.innerHeight * (0.6 + s.d1 * 0.45), x: drift, duration: dur, ease: "sine.in",
              onComplete: () => { tweens.current[i] = g.delayedCall(s.d2 * 1.5, run); } });
        }
      };
      tweens.current[i] = g.delayedCall(delay, run);
    });

    return () => { tweens.current.forEach((t) => t && t.kill()); tweens.current = []; };
  }, [act, reduce, seeds]);

  // ── crossfade scene layers + a flare on every act change ────────────
  useEffectR(() => {
    const g = window.gsap;
    if (!root.current) return;
    const q = g ? g.utils.selector(root.current) : null;
    const changed = prevAct.current !== act;
    prevAct.current = act;

    if (!g || reduce) {
      [1, 2, 3].forEach((a) => { const el = root.current.querySelector(".rs-realm--" + a); if (el) el.style.opacity = a === act ? 1 : 0; });
      return;
    }
    const tl = g.timeline();
    [1, 2, 3].forEach((a) => {
      tl.to(q(".rs-realm--" + a), { opacity: a === act ? 1 : 0, duration: 1.4, ease: "power2.inOut" }, 0);
    });
    if (changed) {
      // ritual flare — the sigil drinks the light then settles
      tl.fromTo(q(".rs-flare"), { opacity: 0 }, { opacity: 0.55, duration: 0.5, ease: "power2.out" }, 0)
        .to(q(".rs-flare"), { opacity: 0, duration: 1.3, ease: "power2.in" }, 0.5);
      tl.fromTo(q(".rs-breath"), { scale: 0.82 }, { scale: 1, duration: 1.5, ease: "elastic.out(1,0.55)" }, 0.1);
      tl.fromTo(q(".rs-glyphring"), { opacity: 0.05 }, { opacity: 0.85, duration: 1.6, ease: "power2.out" }, 0.1);
    }
    return () => tl.kill();
  }, [act, reduce]);

  // ── per-act light rig (pyre flicker · beam sweep · god-rays) ─────────
  useEffectR(() => {
    const g = window.gsap;
    if (!g || reduce || !root.current) return;
    const q = g.utils.selector(root.current);
    const local = [];
    if (act === 1) {
      local.push(g.to(q(".rs-pyre"), { opacity: 0.85, scaleY: 1.12, duration: 0.5 + Math.random() * 0.4, ease: "rough({ template: none.out, strength: 2, points: 24, taper: none, randomize: true, clamp: false })", yoyo: true, repeat: -1, transformOrigin: "50% 100%" }));
    } else if (act === 2) {
      local.push(g.fromTo(q(".rs-beam"), { rotation: -22, opacity: 0.0 }, { rotation: 22, opacity: 0.5, duration: 7, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" }));
    } else if (act === 3) {
      local.push(g.to(q(".rs-rays"), { rotation: 8, duration: 14, ease: "sine.inOut", yoyo: true, repeat: -1, transformOrigin: "50% 0%" }));
      local.push(g.to(q(".rs-eye"), { opacity: 0.9, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    }
    return () => local.forEach((t) => t && t.kill());
  }, [act, reduce]);

  return (
    <div className="rscene" ref={root} data-rite={act} aria-hidden="true">
      {/* ─── ACT I · the pyre on the plain ─── */}
      <div className="rs-realm rs-realm--1">
        <div className="rs-wash"></div>
        <div className="rs-horizon"></div>
        <div className="rs-pyre"></div>
        <div className="rs-smoke rs-smoke--a"></div>
        <div className="rs-smoke rs-smoke--b"></div>
      </div>

      {/* ─── ACT II · the warded walls ─── */}
      <div className="rs-realm rs-realm--2">
        <div className="rs-wash"></div>
        <svg className="rs-walls" viewBox="0 0 100 60" preserveAspectRatio="xMidYMax slice">
          {Array.from({ length: 6 }).map((_, r) => (
            Array.from({ length: 9 }).map((_, c) => (
              <rect key={r + "-" + c} x={(c * 11.6) + (r % 2 ? 0 : -5.8)} y={60 - (r + 1) * 9} width="11" height="8.4" rx="0.6" />
            ))
          ))}
        </svg>
        <div className="rs-beam"></div>
        <div className="rs-mist"></div>
      </div>

      {/* ─── ACT III · the god-lit citadel ─── */}
      <div className="rs-realm rs-realm--3">
        <div className="rs-wash"></div>
        <div className="rs-rays">
          {Array.from({ length: 7 }).map((_, i) => <span key={i} style={{ "--i": i, left: (8 + i * 13) + "%" }}></span>)}
        </div>
        <svg className="rs-columns" viewBox="0 0 100 60" preserveAspectRatio="xMidYMax slice">
          {[14, 30, 50, 70, 86].map((x, i) => <rect key={i} x={x - 2.4} y="6" width="4.8" height="54" rx="0.6" />)}
        </svg>
        <div className="rs-eye"></div>
      </div>

      {/* ─── the persistent ritual sigil ─── */}
      <div className="rs-breath">
        <svg className="rs-sigil" viewBox="0 0 400 400">
          <defs><path id="rs-rimpath" d="M200,200 m-156,0 a156,156 0 1,1 312,0 a156,156 0 1,1 -312,0" /></defs>
          <g className="rs-spin-a">
            <circle cx="200" cy="200" r="188" className="rs-ring rs-ring--bold" />
            <circle cx="200" cy="200" r="150" className="rs-ring" />
            {Array.from({ length: 24 }).map((_, i) => {
              const a = (i / 24) * Math.PI * 2, r1 = 150, r2 = 188;
              return <line key={i} className="rs-spoke" x1={200 + Math.cos(a) * r1} y1={200 + Math.sin(a) * r1} x2={200 + Math.cos(a) * r2} y2={200 + Math.sin(a) * r2} />;
            })}
          </g>
          <g className="rs-spin-b">
            <circle cx="200" cy="200" r="116" className="rs-ring rs-ring--dash" />
            <path d="M200,78 L305,290 L95,290 Z" className="rs-tri" />
            <path d="M200,322 L95,110 L305,110 Z" className="rs-tri rs-tri--soft" />
          </g>
          <g className="rs-spin-c">
            <circle cx="200" cy="200" r="70" className="rs-ring" />
            <circle cx="200" cy="200" r="48" className="rs-ring rs-ring--dash" />
          </g>
          <text className="rs-glyphring"><textPath href="#rs-rimpath" startOffset="0">{RITUAL_GLYPHS_R.join("  ")}</textPath></text>
          <circle cx="200" cy="200" r="18" className="rs-core" />
          <circle cx="200" cy="200" r="5" className="rs-pupil" />
        </svg>
      </div>

      {/* ─── GSAP particle field (retuned per act) ─── */}
      <div className="rs-motes" ref={motes}>
        {Array.from({ length: N }).map((_, i) => <span key={i} className="rs-mote"></span>)}
      </div>

      {/* ─── transition flare ─── */}
      <div className="rs-flare"></div>
    </div>
  );
}

window.RitualScene = RitualScene;
