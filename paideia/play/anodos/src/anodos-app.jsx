/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — main app (state · HUD · map · end screens · tweaks)
   ════════════════════════════════════════════════════════════════════ */
const { useState, useEffect, useRef, useMemo, useCallback } = React;

const SAVE_KEY = "anodos-run-v3";
const DENSITY_FLOORS = { short: 7, normal: 10, tall: 13 };
const XP_GOAL = 120;

const FRAMINGS = {
  ascent:    { eyebrow: "Ἄνοδος · The Ascent",        title: "Ἡ Ἄνοδος στὴν Τροία",   gate: "Ἡ πύλη", boss: "Ἕκτωρ" },
  nostos:    { eyebrow: "Νόστος · The Homecoming",     title: "Ὁ Νόστος",              gate: "Ἡ ἀκτή", boss: "Ποσειδῶν" },
  katabasis: { eyebrow: "Κατάβασις · Into the Dark",   title: "Κατάβασις & Ἄνοδος",    gate: "Τὸ στόμιο", boss: "Ἅιδης" },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "framing": "ascent",
  "density": "normal",
  "tone": "full",
  "language": "gr",
  "hubLayout": "atlas",
  "sound": "off"
}/*EDITMODE-END*/;

// ── layout helpers ───────────────────────────────────────────────────
const TOP_PAD = 80, BOTTOM_PAD = 120, FLOOR_GAP = 116, ACT_GAP = 60;
function buildLayout(map) {
  const lay = {};
  const total = map.floors;
  // figure out which global floors are act bosses + act regions
  const regions = [];
  let gf = 0;
  for (let a = 0; a < map.actLens.length; a++) {
    const len = map.actLens[a];
    regions.push({ act: a + 1, climbBottom: gf, climbTop: gf + len - 1, bossFloor: gf + len });
    gf += len + 1;
  }
  const bossFloors = new Set(regions.map((r) => r.bossFloor));
  // add vertical breathing room above each boss floor (act seam)
  const extra = (floor) => {
    let e = 0;
    for (const r of regions) if (floor > r.bossFloor) e += ACT_GAP;
    if (bossFloors.has(floor)) e += ACT_GAP * 0.5;
    return e;
  };
  for (const n of map.nodes) {
    let x;
    if (n.type === "boss") x = 50;
    else {
      const base = 13 + (n.col / (map.cols - 1)) * 74;
      const h = (parseInt(n.id.replace(/\D/g, "")) || 0) * 9301 + map.seed;
      const jit = ((h % 89) / 89 - 0.5) * 6;
      x = Math.max(9, Math.min(91, base + jit));
    }
    const y = TOP_PAD + (total - n.floor) * FLOOR_GAP + (extra(total) - extra(n.floor));
    lay[n.id] = { x, y };
  }
  lay.__regions = regions.map((r) => ({
    act: r.act,
    midY: TOP_PAD + (total - (r.climbBottom + r.climbTop) / 2) * FLOOR_GAP + (extra(total) - extra(Math.round((r.climbBottom + r.climbTop) / 2))),
  }));
  lay.__height = TOP_PAD + total * FLOOR_GAP + extra(total) + BOTTOM_PAD;
  lay.__gateY = lay.__height - BOTTOM_PAD + 56;
  return lay;
}

function freshRun(seed, floors, opts) {
  opts = opts || {};
  return {
    seed, floors,
    menos: { cur: 80, max: 80 },
    drachmes: 30, xp: 0,
    relics: [], curses: [], visited: [], currentNodeId: null,
    status: "climbing", reviveUsed: false,
    patron: opts.patron || "none",
    anabasis: opts.anabasis || 0,
    daily: !!opts.daily,
    dailyDate: opts.dailyDate || null,
    startedAt: Date.now(),
  };
}

// ════════════════════════════════════════════════════════════════════
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [meta, metaApi] = useMeta();
  const [showHub, setShowHub] = useState(false);
  const [run, setRun] = useState(() => {
    try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.seed) return s; } catch (e) {}
    return null;
  });
  const [activeId, setActiveId] = useState(null);
  const [showIntro, setShowIntro] = useState(() => !localStorage.getItem(SAVE_KEY));
  const [pendingRun, setPendingRun] = useState(null);   // patron-select gate before a climb starts
  const [actBanner, setActBanner] = useState(null);
  const [toast, setToastRaw] = useState(null);
  const toastTimer = useRef(null);
  const setToast = useCallback((tv) => {
    setToastRaw(tv);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    if (tv) toastTimer.current = setTimeout(() => setToastRaw(null), 3200);
  }, []);
  const mapRef = useRef(null);

  // persist
  useEffect(() => { if (run) localStorage.setItem(SAVE_KEY, JSON.stringify(run)); }, [run]);

  // convert a finished run into κλέος (once per outcome)
  const endedRef = useRef(null);
  useEffect(() => {
    if (run && (run.status === "won" || run.status === "lost")) {
      const k = (run.startedAt || run.seed) + ":" + run.status;
      if (endedRef.current !== k) {
        endedRef.current = k;
        metaApi.endRun(run, run.status === "won");
        if (window.playSfx) window.playSfx(run.status === "won" ? "win" : "lose");
      }
    }
  }, [run && run.status, run && run.seed, metaApi]);

  // cosmetics → root attributes (palette · backdrop · particles · path)
  useEffect(() => {
    const pal = meta.palette || "obsidian";
    document.documentElement.setAttribute("data-theme", pal === "obsidian" ? "" : pal);
    document.documentElement.setAttribute("data-backdrop", meta.backdrop || "ritual");
    document.documentElement.setAttribute("data-particles", meta.particles || "embers");
    document.documentElement.setAttribute("data-path", meta.path || "gold");
  }, [meta.palette, meta.backdrop, meta.particles, meta.path]);
  useEffect(() => { document.documentElement.setAttribute("data-tone", t.tone); }, [t.tone]);

  // sound toggle (Web Audio cues)
  useEffect(() => {
    window.__sfxOn = (t.sound === "on");
    if (window.__sfxOn && window.primeSfx) window.primeSfx();
  }, [t.sound]);

  const map = useMemo(() => run ? generateMap(run.seed, run.floors) : null, [run && run.seed, run && run.floors]);
  const nodeById = useMemo(() => { const m = {}; if (map) map.nodes.forEach((n) => (m[n.id] = n)); return m; }, [map]);
  const layout = useMemo(() => map ? buildLayout(map) : null, [map]);
  const fr = FRAMINGS[t.framing] || FRAMINGS.ascent;
  const currentAct = (run && run.currentNodeId && nodeById[run.currentNodeId]) ? nodeById[run.currentNodeId].act : 1;
  const actDef = ACTS[currentAct - 1] || ACTS[0];

  // act backdrop tint
  useEffect(() => {
    document.documentElement.style.setProperty("--act-tint", actDef.tint);
    document.documentElement.setAttribute("data-act", String(currentAct));
  }, [currentAct, actDef.tint]);

  function newRun(opts) { setPendingRun(opts || {}); }   // open the patron gate first

  function startRun(extra) {
    const o = { ...(pendingRun || {}), ...(extra || {}) };
    const floors = DENSITY_FLOORS[t.density] || 10;
    const seed = (o.seed != null) ? (o.seed >>> 0) : ((Math.random() * 1e9) | 0);
    const anabasis = meta.anabasis || 0;
    const r = freshRun(seed, floors, { patron: o.patron || "none", anabasis, daily: o.daily, dailyDate: o.dailyDate });
    applyBoostsToRun(r, meta);
    const mods = anabasisMods(anabasis);
    if (mods.startMenosLoss) r.menos.cur = Math.max(1, r.menos.cur - mods.startMenosLoss);
    if (window.primeSfx) window.primeSfx();
    if (window.playSfx) window.playSfx("move");
    setRun(r);
    setActiveId(null);
    setShowIntro(false);
    setShowHub(false);
    setPendingRun(null);
    requestAnimationFrame(() => { if (mapRef.current) mapRef.current.scrollTop = mapRef.current.scrollHeight; });
  }

  // start at the gate (scroll to bottom) when a run loads
  useEffect(() => {
    if (run && mapRef.current && run.currentNodeId == null) mapRef.current.scrollTop = mapRef.current.scrollHeight;
  }, [run && run.seed]);

  // available node ids
  const available = useMemo(() => {
    if (!run || !map) return new Set();
    if (run.status !== "climbing") return new Set();
    if (run.currentNodeId == null) return new Set(map.startIds);
    const cur = nodeById[run.currentNodeId];
    return new Set((cur ? cur.next : []).filter((id) => !run.visited.includes(id)));
  }, [run, map, nodeById]);

  // ── ctx: mutators encounters call ──────────────────────────────────
  const ctx = useMemo(() => {
    const hasRelic = (id) => run && run.relics.includes(id);
    const hasCurse = (id) => run && run.curses && run.curses.some((c) => c.id === id);
    const mods = anabasisMods(run ? run.anabasis : 0);
    const sfx = (name) => { if (window.playSfx) window.playSfx(name); };
    const flashCurse = () => {
      const s = document.querySelector(".stage"); if (!s) return;
      s.classList.remove("fx-curse"); void s.offsetWidth; s.classList.add("fx-curse");
      setTimeout(() => s.classList.remove("fx-curse"), 900);
    };
    return {
      run, lang: t.language, hasRelic, hasCurse,
      hasPatron: (id) => run && run.patron === id,
      patron: run ? run.patron : "none",
      mods, sfx,
      // ── trivia source: respect the user-selected bank loaded by the host ──
      // Populate any of these from your question-loading code; falls back to the
      // built-in QUESTIONS / TF_BANK when none are provided:
      //   window.SELECTED_QUESTIONS  — array of MC questions {q,opts,a,hint,greek?}
      //   window.SELECTED_TF         — array of true/false  {s,t}
      //   window.getBattleQuestions(format, node) — function returning either shape
      questions: window.SELECTED_QUESTIONS || null,
      tfQuestions: window.SELECTED_TF || null,
      getQuestions: window.getBattleQuestions || null,
      track: metaApi.track,
      lifelines: meta.lifelines,
      useLifeline: (id) => metaApi.spendLifeline(id),
      hasBoost: (id) => !!(run && run.boosts && run.boosts.includes(id)),
      gainDrachmes: (n) => setRun((r) => ({ ...r, drachmes: Math.max(0, r.drachmes + n) })),
      spendDrachmes: (n) => setRun((r) => ({ ...r, drachmes: Math.max(0, r.drachmes - n) })),
      gainXp: (n) => setRun((r) => ({ ...r, xp: r.xp + n })),
      heal: (n) => setRun((r) => ({ ...r, menos: { ...r.menos, cur: Math.min(r.menos.max, r.menos.cur + n) } })),
      fortify: (n) => setRun((r) => ({ ...r, menos: { max: r.menos.max + n, cur: r.menos.cur + n } })),
      damage: (n) => setRun((r) => {
        let cur = r.menos.cur - n;
        if (cur <= 0) {
          if (r.relics.includes("shield2") && !r.reviveUsed) return { ...r, menos: { ...r.menos, cur: 30 }, reviveUsed: true };
          return { ...r, menos: { ...r.menos, cur: 0 }, status: "lost" };
        }
        return { ...r, menos: { ...r.menos, cur } };
      }),
      addRelic: (id) => { metaApi.track("relic", { id }); setRun((r) => {
        if (r.relics.includes(id)) return r;
        const relics = [...r.relics, id];
        if (id === "ambrosia") return { ...r, relics, menos: { max: r.menos.max + 25, cur: r.menos.cur + 25 } };
        return { ...r, relics };
      }); },
      peekRelic: () => {
        if (!run) return null;
        const avail = RELICS.filter((x) => !run.relics.includes(x.id));
        return avail.length ? avail[(Math.random() * avail.length) | 0] : null;
      },
      takeRelic: () => {
        if (!run) return null;
        const avail = RELICS.filter((x) => !run.relics.includes(x.id));
        if (!avail.length) { setRun((r) => ({ ...r, drachmes: r.drachmes + 30 })); return null; }
        const r = avail[(Math.random() * avail.length) | 0];
        metaApi.track("relic", { id: r.id });
        setRun((rr) => rr.relics.includes(r.id) ? rr : { ...rr, relics: [...rr.relics, r.id], ...(r.id === "ambrosia" ? { menos: { max: rr.menos.max + 25, cur: rr.menos.cur + 25 } } : {}) });
        return r;
      },
      // ── curses ──────────────────────────────────────────────────
      inflictCurse: (id) => {
        // Ἀλεξητήριον — the warding boost repels the first curse of a climb
        if (run && run.boosts && run.boosts.includes("ward") && !run.wardUsed) {
          setRun((r) => ({ ...r, wardUsed: true }));
          setToast({ icon: "🛡", title: "Ἀλεξητήριον", body: "Ἡ εὐλογία ἀπώθησε τὸ μίασμα.", bad: false });
          return null;
        }
        const cid = id || CURSE_POOL[(Math.random() * CURSE_POOL.length) | 0];
        const def = CURSES[cid]; if (!def) return null;
        const turns = def.turns + (mods.curseTurns || 0);   // ascension lengthens miasmata
        setRun((r) => {
          const curses = (r.curses || []).filter((c) => c.id !== cid);
          return { ...r, curses: [...curses, { id: cid, turns }] };
        });
        flashCurse();
        sfx("curse");
        metaApi.track("curse");
        setToast({ icon: def.icon, title: "Μίασμα · " + def.name, body: t.language === "en" ? def.enDesc : def.desc, bad: true });
        return def;
      },
      knockback: () => {
        let moved = false;
        setRun((r) => {
          const cur = nodeById[r.currentNodeId];
          if (!cur || !cur.prev || !cur.prev.length) return r;
          const back = cur.prev.filter((pid) => r.visited.includes(pid));
          const targets = back.length ? back : cur.prev;
          const target = targets[(Math.random() * targets.length) | 0];
          if (!target) return r;
          moved = true;
          const visited = r.visited.filter((vid) => vid !== r.currentNodeId);
          return { ...r, visited, currentNodeId: target };
        });
        setActiveId(null);
        setTimeout(() => {
          const r2 = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
          if (r2 && layout && layout[r2.currentNodeId] && mapRef.current) {
            mapRef.current.scrollTo({ top: Math.max(0, layout[r2.currentNodeId].y - mapRef.current.clientHeight * 0.5), behavior: "smooth" });
          }
        }, 60);
        if (moved !== false) setToast({ icon: "⛓", title: "Ὀπισθοχώρησις", body: "Σὲ ἔσπρωξαν πίσω στὴν πλαγιά. Πρέπει νὰ ἀνέβεις ξανά.", bad: true });
      },
      advanceTo: (id) => {
        const newNode = nodeById[id];
        const prevNode = run.currentNodeId ? nodeById[run.currentNodeId] : null;
        const isFinal = map && id === map.finalBossId;
        // bleed curse bites on each advance; tick all curses down
        const bleeding = run.curses && run.curses.some((c) => c.id === "bleed");
        setRun((r) => {
          let menos = r.menos;
          let status = isFinal ? "won" : r.status;
          if (bleeding) {
            const cur = Math.max(0, r.menos.cur - 4);
            menos = { ...r.menos, cur };
            if (cur <= 0 && !(r.relics.includes("shield2") && !r.reviveUsed)) status = "lost";
          }
          const curses = (r.curses || []).map((c) => ({ ...c, turns: c.turns - 1 })).filter((c) => c.turns > 0);
          return {
            ...r,
            menos,
            curses,
            visited: r.visited.includes(id) ? r.visited : [...r.visited, id],
            currentNodeId: id,
            status,
          };
        });
        setActiveId(null);
        metaApi.track("tile");
        if (newNode && (!prevNode || newNode.act > prevNode.act)) metaApi.track("act", { act: newNode.act });
        if (bleeding) setToast({ icon: "🩸", title: "Αἷμορραγία", body: "−4 μένος καθὼς προχωρᾷς.", bad: true });
        // act transition banner
        if (newNode && (!prevNode || newNode.act > prevNode.act) && !isFinal && newNode.act > 1) {
          setActBanner(newNode.act);
          setTimeout(() => setActBanner((a) => (a === newNode.act ? null : a)), 2600);
        }
        if (layout && mapRef.current && newNode && newNode.type !== "boss") {
          const y = layout[id].y;
          mapRef.current.scrollTo({ top: Math.max(0, y - mapRef.current.clientHeight * 0.55), behavior: "smooth" });
        }
      },
    };
  }, [run, t.language, layout, map, nodeById, setToast, meta.lifelines, metaApi]);

  const activeNode = activeId ? nodeById[activeId] : null;

  return (
    <div className={"stage stage--act" + currentAct + (run && run.curses && run.curses.length ? " stage--cursed" : "")}>
      <div className="stage__acttint" aria-hidden="true"></div>
      <Backdrop backdrop={meta.backdrop} particles={meta.particles} />
      <Watermark framing={t.framing} act={currentAct} />
      <Hud run={run} fr={fr} lang={t.language} meta={meta} onNew={newRun} onHelp={() => setShowIntro(true)} onTemple={() => setShowHub(true)} />

      <div className="mapwrap" ref={mapRef}>
        {map && layout ? (
          <div className="map" style={{ height: layout.__height }}>
            <Edges map={map} layout={layout} run={run} available={available} />
            {/* act region labels */}
            {layout.__regions.map((r) => {
              const ad = ACTS[r.act - 1];
              return (
                <div key={r.act} className={"actband actband--" + r.act + (r.act === currentAct ? " actband--here" : "")} style={{ top: r.midY }}>
                  <span className="actband__num">{["", "Α΄", "Β΄", "Γ΄"][r.act]}</span>
                  <span className="actband__name">{ad.name}</span>
                </div>
              );
            })}
            {/* gate */}
            <div className="gate" style={{ left: "50%", top: layout.__gateY }}>
              <div className="gate__dot"></div>{fr.gate}
            </div>
            {/* nodes */}
            {map.nodes.map((n) => (
              <NodeDot key={n.id} node={n} pos={layout[n.id]} fr={fr} lang={t.language} reveal={run && run.patron === "hermes"}
                state={n.id === run.currentNodeId ? "current" : run.visited.includes(n.id) ? "visited" : available.has(n.id) ? "available" : "locked"}
                onClick={() => { if (available.has(n.id)) { if (window.playSfx) window.playSfx("click"); setActiveId(n.id); } }} />
            ))}
          </div>
        ) : (
          <div style={{ height: "100%", display: "grid", placeItems: "center", color: "var(--sym-stone)", fontFamily: "var(--font-serif)", fontSize: 22, fontStyle: "italic" }}>
            Ξεκίνα μιὰ ἄνοδο…
          </div>
        )}
      </div>

      {/* encounter */}
      {activeNode && run.status === "climbing" ? (
        <div className="scrim" onClick={(e) => { if (e.target.classList.contains("scrim")) setActiveId(null); }}>
          <div className="modal">
            <Encounter node={activeNode} ctx={ctx} />
          </div>
        </div>
      ) : null}

      {/* end screens */}
      {run && run.status === "won" ? <EndScreen win run={run} fr={fr} meta={meta} onNew={newRun} onTemple={() => setShowHub(true)} /> : null}
      {run && run.status === "lost" ? <EndScreen run={run} fr={fr} meta={meta} onNew={newRun} onTemple={() => setShowHub(true)} /> : null}

      {/* act transition banner */}
      {actBanner ? <ActBanner act={actBanner} lang={t.language} /> : null}

      {/* toast (curses / knockback) */}
      {toast ? (
        <div className={"toast" + (toast.bad ? " toast--bad" : "")} onClick={() => setToast(null)}>
          <span className="toast__icon">{toast.icon}</span>
          <span className="toast__txt"><b>{toast.title}</b><span>{toast.body}</span></span>
        </div>
      ) : null}

      {/* intro */}
      {showIntro ? <Intro fr={fr} lang={t.language} hasRun={!!run} onStart={newRun} onClose={() => setShowIntro(false)} /> : null}

      {/* patron-select gate */}
      {pendingRun ? <PatronSelect pending={pendingRun} meta={meta} lang={t.language} onConfirm={(p) => startRun({ patron: p })} onCancel={() => setPendingRun(null)} /> : null}

      {/* Temple of the Muses — reward hub & home base between runs */}
      {(showHub || (!run && !showIntro)) ? (
        <TempleHub meta={meta} api={metaApi} lang={t.language} layout={t.hubLayout} hasRun={!!run}
          onBegin={newRun} onClose={() => setShowHub(false)} onRules={() => setShowIntro(true)}
          onDaily={() => newRun({ daily: true, dailyDate: todayKey(), seed: dailySeed() })}
          onReplay={(seed) => newRun({ seed })} />
      ) : null}

      {/* celebration notices */}
      <NoticeStack notices={metaApi.notices} dismiss={metaApi.dismissNotice} />

      {/* TWEAKS */}
      <TweaksPanel>
        <TweakSection label="Ὄψις · Look" />
        <TweakRadio label="Tone" value={t.tone} options={["full", "restrained"]} onChange={(v) => setTweak("tone", v)} />
        <TweakRadio label="Γλῶσσα · Lang" value={t.language} options={["gr", "en"]} onChange={(v) => setTweak("language", v)} />
        <TweakRadio label="Ἦχος · Sound" value={t.sound} options={["off", "on"]} onChange={(v) => setTweak("sound", v)} />
        <TweakSection label="Ναός · Reward hub" />
        <TweakRadio label="Hub layout" value={t.hubLayout} options={["atlas", "temple", "scroll"]} onChange={(v) => setTweak("hubLayout", v)} />
        <TweakButton label="Ἀνοιξε τὸν Ναό 🏛" onClick={() => setShowHub(true)} />
        <TweakButton label="Ξεκλείδωσε ὅλα (preview)" secondary onClick={metaApi.unlockAll} />
        <TweakButton label="+300 κλέος (preview)" secondary onClick={() => metaApi.grantKleos(300)} />
        <TweakSection label="Ἄνοδος · The climb" />
        <TweakSelect label="Fiction" value={t.framing}
          options={[{ value: "ascent", label: "Ἄνοδος — climb to Troy" }, { value: "nostos", label: "Νόστος — the voyage home" }, { value: "katabasis", label: "Κατάβασις — the underworld" }]}
          onChange={(v) => setTweak("framing", v)} />
        <TweakRadio label="Length" value={t.density} options={["short", "normal", "tall"]} onChange={(v) => setTweak("density", v)} />
        <TweakButton label="Apply · Νέα ἄνοδος ↻" onClick={newRun} />
      </TweaksPanel>
    </div>
  );
}

function romanize(n) {
  const map = [[10, "Χ"], [9, "ΙΧ"], [5, "Υ"], [4, "ΙΥ"], [1, "Ι"]];
  // simple Greek-ish numerals for flavor; fall back to number
  return String(n);
}

// ── Ritual backdrop (circle + embers + fog) ────────────────────────────
const RITUAL_GLYPHS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ";
function RitualBackdrop({ act }) {
  const embers = React.useMemo(() => Array.from({ length: 22 }).map((_, i) => ({
    left: (i * 4.5 + (i * i * 7) % 9) % 100,
    delay: (i * 0.7) % 9,
    dur: 7 + (i % 5) * 2,
    size: 2 + (i % 3),
    drift: (i % 2 ? 1 : -1) * (8 + (i % 4) * 6),
  })), []);
  const rim = React.useMemo(() => RITUAL_GLYPHS.split(""), []);
  return (
    <div className="ritual" aria-hidden="true">
      <div className="ritual__fog ritual__fog--a"></div>
      <div className="ritual__fog ritual__fog--b"></div>
      <div className="ritual__embers">
        {embers.map((e, i) => (
          <span key={i} className="ember" style={{ left: e.left + "%", animationDelay: e.delay + "s", animationDuration: e.dur + "s", width: e.size, height: e.size, "--drift": e.drift + "px" }}></span>
        ))}
      </div>
      <svg className="ritual__circle" viewBox="0 0 400 400">
        <defs>
          <path id="rimpath" d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0" />
        </defs>
        <circle cx="200" cy="200" r="186" className="ritual__ring ritual__ring--outer" />
        <circle cx="200" cy="200" r="150" className="ritual__ring" />
        <circle cx="200" cy="200" r="112" className="ritual__ring ritual__ring--dash" />
        <circle cx="200" cy="200" r="66" className="ritual__ring" />
        {/* triangle (no pagan pentagram — a delta, the climb) */}
        <path d="M200,70 L312,295 L88,295 Z" className="ritual__tri" />
        <path d="M200,330 L88,105 L312,105 Z" className="ritual__tri ritual__tri--soft" />
        <circle cx="200" cy="200" r="16" className="ritual__eye" />
        <circle cx="200" cy="200" r="4" className="ritual__pupil" />
        <text className="ritual__rim"><textPath href="#rimpath" startOffset="0">{rim.join("  ")}</textPath></text>
      </svg>
    </div>
  );
}

// ── Watermark (mountain / waves / gate) ──────────────────────────────
function Watermark({ framing, act }) {
  return (
    <div className="stage__watermark" aria-hidden="true">
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.8" strokeLinejoin="round" preserveAspectRatio="xMidYMax meet">
        {framing === "nostos" ? (
          <g>
            <path d="M0 70 Q 12 64 25 70 T 50 70 T 75 70 T 100 70" />
            <path d="M0 80 Q 12 74 25 80 T 50 80 T 75 80 T 100 80" />
            <path d="M0 90 Q 12 84 25 90 T 50 90 T 75 90 T 100 90" />
            <path d="M44 70 L50 30 L56 70 Z" /><path d="M50 30 L66 60 L50 60 Z" />
          </g>
        ) : framing === "katabasis" ? (
          <g><path d="M20 100 L20 40 Q50 10 80 40 L80 100" /><path d="M35 100 L35 55 Q50 38 65 55 L65 100" /><line x1="50" y1="55" x2="50" y2="100" /></g>
        ) : (
          <g>
            <path d="M2 98 L34 30 L46 52 L58 22 L98 98 Z" />
            <path d="M34 30 L40 41 L30 41 Z" /><path d="M58 22 L65 36 L52 36 Z" />
            <line x1="2" y1="98" x2="98" y2="98" />
          </g>
        )}
      </svg>
    </div>
  );
}

// ── HUD ──────────────────────────────────────────────────────────────
function Hud({ run, fr, lang, meta, onNew, onHelp, onTemple }) {
  const pct = run ? Math.round((run.menos.cur / run.menos.max) * 100) : 0;
  const xpPct = run ? Math.min(100, Math.round((run.xp / XP_GOAL) * 100)) : 0;
  const relicDefs = run ? run.relics.map((id) => RELICS.find((r) => r.id === id)).filter(Boolean) : [];
  const curseDefs = run && run.curses ? run.curses.map((c) => ({ ...CURSES[c.id], turns: c.turns })).filter((c) => c.id) : [];
  return (
    <header className="hud">
      <div className="hud__brand">
        <svg className="hud__mark" viewBox="0 0 100 100" aria-hidden="true">
          <g fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="square">
            <line x1="22" y1="20" x2="78" y2="20" /><line x1="22" y1="20" x2="48" y2="50" />
            <line x1="48" y1="50" x2="22" y2="80" /><line x1="22" y1="80" x2="78" y2="80" />
          </g>
          <g className="pivot" strokeWidth="3.6" fill="none" strokeLinecap="round">
            <circle cx="64" cy="50" r="12" strokeDasharray="62 12" strokeDashoffset="-7" transform="rotate(-90 64 50)" />
            <line x1="64" y1="39" x2="64" y2="49" />
          </g>
        </svg>
        <span className="hud__word">Symposi<span>ON</span></span>
      </div>
      <div className="hud__sep"></div>
      <div className="hud__run">
        <div className="hud__run-eyebrow">{fr.eyebrow}</div>
        <div className="hud__run-title">{fr.title}</div>
        {run && (run.patron !== "none" || (run.anabasis || 0) > 0 || run.daily) ? (
          <div className="hud__runbadges">
            {run.patron !== "none" && PATRON_BY_ID[run.patron] ? <span className="runbadge" style={{ "--pat": PATRON_BY_ID[run.patron].color }}>{PATRON_BY_ID[run.patron].icon} {PATRON_BY_ID[run.patron].name}</span> : null}
            {(run.anabasis || 0) > 0 ? <span className="runbadge runbadge--ana">⛰ Ἀνάβασις {run.anabasis}</span> : null}
            {run.daily ? <span className="runbadge runbadge--daily">📅 Ἡμερήσιος</span> : null}
          </div>
        ) : null}
      </div>

      <div className="hud__stats">
        {run ? (
          <>
            <div className="stat">
              <IcoSpirit />
              <div className="stat__col">
                <span className="stat__label">Μένος · Spirit</span>
                <div className="menos">
                  <div className="menos__track"><div className="menos__fill" style={{ width: pct + "%" }}></div></div>
                </div>
              </div>
              <span className="menos__num">{run.menos.cur}<span style={{ color: "var(--sym-stone)", fontSize: 11 }}>/{run.menos.max}</span></span>
            </div>

            <div className="stat">
              <IcoDrachma />
              <div className="stat__col"><span className="stat__label">Δραχμές</span><span className="stat__val drachma">{run.drachmes}</span></div>
            </div>

            <div className="stat xpwrap">
              <IcoXp />
              <div className="stat__col" style={{ flex: 1 }}>
                <span className="stat__label">Δόξα · XP {run.xp}/{XP_GOAL}</span>
                <div className="xp__track"><div className="xp__fill" style={{ width: xpPct + "%" }}></div></div>
              </div>
            </div>

            <div className="relics">
              {relicDefs.length ? relicDefs.map((r) => (
                <div key={r.id} className="relic">{r.icon}
                  <div className="relic__pop"><b>{r.name}</b><span>{lang === "en" ? r.en : r.desc}</span></div>
                </div>
              )) : <div className="relic relic--empty">∅</div>}
            </div>

            {curseDefs.length ? (
              <div className="curses">
                {curseDefs.map((c) => (
                  <div key={c.id} className="curse" title={c.name}>{c.icon}
                    <span className="curse__turns">{c.turns}</span>
                    <div className="relic__pop relic__pop--curse"><b>{c.name}</b><span>{lang === "en" ? c.enDesc : c.desc}</span><em>{c.turns} {c.turns === 1 ? "κόμβος" : "κόμβοι"} ἀκόμη</em></div>
                  </div>
                ))}
              </div>
            ) : null}
          </>
        ) : null}
        <div className="kleos" title="Κλέος · Glory">
          <KleosIcon size={20} />
          <div className="kleos__col"><span className="kleos__lbl">Κλέος</span><span className="kleos__val">{meta ? meta.kleos : 0}</span></div>
        </div>
        <button className="hud__btn hud__btn--temple" onClick={onTemple}>🏛 Ναός</button>
        <button className="hud__btn" onClick={onHelp}>?</button>
        <button className="hud__btn" onClick={onNew}>Νέα ἄνοδος ↻</button>
      </div>
    </header>
  );
}

// ── Edges (SVG) ──────────────────────────────────────────────────────
function Edges({ map, layout, run, available }) {
  const lines = [];
  for (const n of map.nodes) {
    for (const tid of n.next) {
      const a = layout[n.id], b = layout[tid];
      let cls = "edge";
      if (run.visited.includes(n.id) && run.visited.includes(tid)) cls += " edge--traversed";
      else if (run.currentNodeId === n.id && available.has(tid)) cls += " edge--open";
      lines.push(<line key={n.id + "-" + tid} className={cls} x1={a.x} y1={a.y} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" />);
    }
  }
  // gate -> start nodes
  if (run.currentNodeId == null) {
    for (const sid of map.startIds) {
      const b = layout[sid];
      lines.push(<line key={"gate-" + sid} className="edge edge--open" x1="50" y1={layout.__gateY} x2={b.x} y2={b.y} vectorEffect="non-scaling-stroke" />);
    }
  }
  return (
    <svg className="map__edges" viewBox={`0 0 100 ${layout.__height}`} preserveAspectRatio="none">{lines}</svg>
  );
}

// ── Node ─────────────────────────────────────────────────────────────
const FMT_INFO = {
  mc:     { ic: "📜", t: "Ἐρωτήσεις",   d: "Πολλαπλῆς ἐπιλογῆς" },
  volley: { ic: "⚡", t: "Ταχεῖα ριπή", d: "Ἀληθὲς/ψευδὲς μὲ χρονόμετρο" },
  duel:   { ic: "🎯", t: "Μονοθέσιον",  d: "Ἕνα λάθος → ὀπισθοχώρησις" },
};
const TYPE_DESC = {
  combat:   "Μάχη μὲ ἐχθρό τῆς πεδιάδος.",
  elite:    "Σκληρὴ μάχη · ἐγγυημένο περίαπτο.",
  boss:     "Ὁ ἄρχων τοῦ Μέρους — νίκησέ τον γιὰ νὰ ἀνέβεις.",
  mystery:  "Οἰωνός — μιὰ ἐπιλογὴ μὲ συνέπειες.",
  riddle:   "Αἴνιγμα — λῦσε το γιὰ πλούσια ἀμοιβή.",
  rest:     "Κρήνη — θεραπεία ἢ ὀχύρωση.",
  shop:     "Ἀγορά — ξόδεψε δραχμὲς σὲ περίαπτα.",
  treasure: "Δῶρον — ἕνα δωρεὰν περίαπτο.",
};
function NodeDot({ node, pos, state, onClick, fr, lang, reveal }) {
  const meta = NODE_TYPES[node.type];
  const foe = node.foe ? FOES[node.foe] : null;
  const isBoss = node.type === "boss";
  const label = isBoss ? (foe ? (lang === "en" ? foe.en : foe.name) : fr.boss) : meta.label;
  const icon = isBoss && foe ? foe.glyph : (foe && state !== "locked" ? foe.glyph : meta.icon);
  const fmt = node.format && (node.type === "combat" || node.type === "elite") ? node.format : null;
  const fmtBadge = fmt ? { mc: "", volley: "⚡", duel: "🎯" }[fmt] : "";
  const showDetail = reveal || state !== "locked";
  const mech = isBoss ? (BOSS_MECHANICS[node.foe] || null) : null;
  const intent = foe ? (INTENTS[foe.intent] || INTENTS.strike) : null;
  return (
    <div className={`node node--${state} node--${node.type}`} style={{ left: pos.x + "%", top: pos.y, "--node-accent": isBoss ? "var(--sym-terra)" : (foe ? foe.color : meta.accent) }} onClick={onClick} role={state === "available" ? "button" : undefined}>
      <div className="node__disc">{icon}{fmtBadge ? <span className="node__fmt">{fmtBadge}</span> : null}</div>
      <div className="node__label">{label}</div>
      <div className="node__preview" role="tooltip">
        <div className="node__preview-h">
          <span className="node__preview-ic">{isBoss && foe ? foe.glyph : meta.icon}</span>
          <span className="node__preview-tt"><b>{label}</b><span>{meta.en}</span></span>
          {state === "visited" ? <span className="node__preview-tag">✓</span> : state === "current" ? <span className="node__preview-tag">Ἐδῶ</span> : null}
        </div>
        {showDetail ? (
          <>
            {foe ? <div className="node__preview-row node__preview-foe"><span style={{ color: foe.color }}>◈</span> {lang === "en" ? foe.en : foe.name}<em>τάξις {foe.tier}</em></div> : null}
            {fmt ? <div className="node__preview-row">{FMT_INFO[fmt].ic} <b>{FMT_INFO[fmt].t}</b> — {FMT_INFO[fmt].d}</div> : null}
            {intent ? <div className="node__preview-row node__preview-intent">⚠ {intent.label} · −{foe.dmg} μένος ἂν χάσεις</div> : null}
            {mech ? <div className="node__preview-row node__preview-mech">{mech.icon} {lang === "en" ? mech.en : mech.name}</div> : null}
          </>
        ) : (
          <div className="node__preview-row node__preview-foe" style={{ opacity: .7 }}>Ἄγνωστος κόμβος — πλησίασε γιὰ νὰ δεῖς.</div>
        )}
        <div className="node__preview-d">{TYPE_DESC[node.type]}</div>
      </div>
    </div>
  );
}

// ── Encounter dispatcher ─────────────────────────────────────────────
function Encounter({ node, ctx }) {
  switch (node.type) {
    case "combat": case "elite": case "boss": return <Battle node={node} ctx={ctx} />;
    case "mystery": case "riddle": return <Mystery node={node} ctx={ctx} />;
    case "rest": return <Rest node={node} ctx={ctx} />;
    case "shop": return <Shop node={node} ctx={ctx} />;
    case "treasure": return <Treasure node={node} ctx={ctx} />;
    default: return null;
  }
}

// ── Act transition banner ────────────────────────────────────────────
function ActBanner({ act, lang }) {
  const ad = ACTS[act - 1]; if (!ad) return null;
  return (
    <div className="actbanner" style={{ "--act-tint": ad.tint }}>
      <div className="actbanner__inner">
        <div className="actbanner__num">{["", "Πρῶτον", "Δεύτερον", "Τρίτον"][act]} Μέρος</div>
        <div className="actbanner__name">{ad.name}</div>
        <div className="actbanner__sub">{lang === "en" ? ad.en : ad.sub}</div>
        <div className="actbanner__blurb">{ad.blurb}</div>
      </div>
    </div>
  );
}

// ── Patron-select gate (before every climb) ─────────────────────────
function PatronSelect({ pending, meta, lang, onConfirm, onCancel }) {
  const [sel, setSel] = useState("none");
  const ana = meta.anabasis || 0;
  const anaDef = ANABASIS[ana];
  const dailyMode = pending && pending.daily;
  const replay = pending && pending.seed != null && !dailyMode;
  return (
    <div className="scrim scrim--top" onClick={(e) => { if (e.target.classList.contains("scrim")) onCancel(); }}>
      <div className="modal" style={{ maxWidth: 620 }}>
        <div className="modal__pad">
          <div className="modal__eyebrow">Πρὸ τῆς ἀνόδου · Choose your Patron</div>
          <h2 className="modal__title">Ποιὸς θεὸς σὲ εὐλογεῖ;</h2>
          <p className="modal__sub">Διάλεξε προστάτη — ἡ χάρη του σὲ συνοδεύει σ' ὅλη τὴν ἄνοδο.</p>
          {(ana > 0 || dailyMode || replay) ? (
            <div className="patron-ctx">
              {ana > 0 ? <span className="patron-ctx__chip patron-ctx__chip--ana">⛰ Ἀνάβασις {ana} · {anaDef.name}</span> : null}
              {dailyMode ? <span className="patron-ctx__chip">📅 Ἡμερήσιος σπόρος</span> : null}
              {replay ? <span className="patron-ctx__chip">↺ Ἐπανάληψη σπόρου</span> : null}
            </div>
          ) : null}
          <div className="patrongrid">
            {PATRONS.map((p) => (
              <button key={p.id} className={"patron" + (sel === p.id ? " patron--on" : "")} style={{ "--pat": p.color }} onClick={() => { setSel(p.id); if (window.playSfx) window.playSfx("click"); }}>
                <span className="patron__glyph" aria-hidden="true">{p.glyph}</span>
                <span className="patron__ic">{p.icon}</span>
                <span className="patron__name">{p.name}</span>
                <span className="patron__en">{p.en} · {p.tag}</span>
                <span className="patron__desc">{lang === "en" ? p.enDesc : p.desc}</span>
              </button>
            ))}
          </div>
          <div className="btnrow">
            <button className="btn btn--gold" onClick={() => onConfirm(sel)}>Ξεκίνα τὴν ἄνοδο →</button>
            <button className="btn btn--ghost" onClick={onCancel}>Πίσω</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Intro ────────────────────────────────────────────────────────────
function Intro({ fr, lang, hasRun, onStart, onClose }) {
  const legend = [
    { t: "combat", d: "Απάντησε σε ερωτήσεις. Κάθε λάθος κοστίζει μένος." },
    { t: "elite", d: "Πιο δύσκολη μάχη — εγγυημένο περίαπτο." },
    { t: "riddle", d: "Λῦσε τὸ αἴνιγμα γιὰ πλούσια ἀμοιβή — ἢ πλήρωσε." },
    { t: "mystery", d: "Μια επιλογή με συνέπειες. Ρίσκαρε ή παίξε ασφαλές." },
    { t: "rest", d: "Θεραπεύσου ή ενίσχυσε το μένος σου." },
    { t: "shop", d: "Ξόδεψε δραχμές σε περίαπτα." },
    { t: "treasure", d: "Ένα δωρεάν περίαπτο από τους θεούς." },
    { t: "boss", d: "Ὁ ἄρχων κάθε Μέρους. Νίκησέ τον γιὰ νὰ ἀνέβεις." },
  ];
  return (
    <div className="scrim" onClick={(e) => { if (e.target.classList.contains("scrim") && hasRun) onClose(); }}>
      <div className="modal" style={{ maxWidth: 560 }}>
        <div className="modal__pad">
          <div className="modal__eyebrow">{fr.eyebrow}</div>
          <h2 className="modal__title">{fr.title}</h2>
          <p className="modal__sub">Ένα roguelike ταξίδι μέσα ἀπ' τὰ παιχνίδια τοῦ SymposiON.</p>
          <p className="modal__body" style={{ textAlign: "center" }}>
            Τρία Μέρη χωρίζουν τὴν ἄνοδο — <b style={{ color: "var(--sym-gold-lt)" }}>Πεδίον → Τείχη → Ἀκρόπολις</b> — καθένα μὲ τὸν ἄρχοντά του. Οἱ μάχες ἔρχονται σὲ τρεῖς μορφές: 📜 ἐρωτήσεις, ⚡ ταχεῖα ριπή, 🎯 μονοθέσιον. <b style={{ color: "#e07ba6" }}>Πρόσεχε:</b> τὰ λάθη φέρνουν <b style={{ color: "#e07ba6" }}>μιάσματα</b> (κατάρες) — κι ἂν χάσεις ἕνα μονοθέσιον, σὲ σπρώχνουν <b style={{ color: "#e07ba6" }}>πίσω</b> στὴν πλαγιά.
          </p>
          <div className="intro__panels">
            {legend.map((l) => (
              <div key={l.t} className="intro__card">
                <div className="intro__card-ic">{NODE_TYPES[l.t].icon}</div>
                <div className="intro__card-h">{NODE_TYPES[l.t].label} · {NODE_TYPES[l.t].en}</div>
                <div className="intro__card-p">{l.d}</div>
              </div>
            ))}
          </div>
          <div className="btnrow">
            <button className="btn btn--gold" onClick={onStart}>Ξεκίνα τὴν ἄνοδο →</button>
            {hasRun
              ? <button className="btn btn--ghost" onClick={onClose}>Συνέχισε τὴν τρέχουσα</button>
              : <button className="btn btn--ghost" onClick={onClose}>Ναὸς τῶν Μουσῶν →</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── End screen ───────────────────────────────────────────────────────
function EndScreen({ win, run, fr, meta, onNew, onTemple }) {
  const floorsClimbed = run.visited.length;
  return (
    <div className="end" style={{ "--accent-end": win ? "var(--sym-gold)" : "var(--sym-terra)" }}>
      <div className="end__inner">
        <div className="end__crest">{win ? "🏛" : "🜃"}</div>
        <div className="end__eyebrow">{win ? "Νίκη · Victory" : "Ἧττα · Defeat"}</div>
        <h1 className="end__title">{win ? <>Δόξα <span>αἰώνιος</span></> : <>Ἡ ἄνοδος <span>ἔληξε</span></>}</h1>
        <p className="end__sub">{win
          ? "Ἀνέβηκες Πεδίον, Τείχη καὶ Ἀκρόπολι — καὶ νίκησες τὸν Ἕκτορα. Τὸ ὄνομά σου χαράχτηκε στὸ μάρμαρο."
          : "Τὸ μένος σου ἐξαντλήθηκε στὴν ἀνάβαση. Ἀλλὰ κάθε ἄνοδος διδάσκει."}</p>

        {meta ? (
          <div className="end__unlock">
            <div className="end__unlock-swatch" style={{ display: "grid", placeItems: "center", background: "var(--sym-bg-panel)" }}><KleosIcon size={26} /></div>
            <div className="end__unlock-txt">
              <div className="end__unlock-lbl">✦ Κλέος ποὺ κέρδισες</div>
              <div className="end__unlock-name">+{meta.lastRunKleos} κλέος · σύνολο {meta.kleos}</div>
            </div>
          </div>
        ) : null}

        <div className="end__summary">
          <div className="end__stat"><b>{floorsClimbed}</b><span>Κόμβοι</span></div>
          <div className="end__stat"><b>{run.relics.length}</b><span>Περίαπτα</span></div>
          <div className="end__stat"><b>{run.drachmes}</b><span>Δραχμές</span></div>
          <div className="end__stat"><b>{run.xp}</b><span>Δόξα</span></div>
        </div>

        <div className="btnrow">
          <button className="btn btn--gold" onClick={onNew}>{win ? "Νέα ἄνοδος →" : "Δοκίμασε ξανά →"}</button>
          {onTemple ? <button className="btn btn--ghost" onClick={onTemple}>Ναὸς τῶν Μουσῶν 🏛</button> : null}
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
