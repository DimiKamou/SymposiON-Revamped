/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — META visuals: animated backdrops · particles · the Temple hub
   Exports: Backdrop, Particles, KleosIcon, NoticeStack, TempleHub
   ════════════════════════════════════════════════════════════════════ */
const { useState: useStateH, useMemo: useMemoH, useEffect: useEffectH } = React;

/* ── Κλέος sigil (a laurel wreath enclosing a star) ──────────────────── */
function KleosIcon({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 4.2l1.7 3.8 4.1.4-3.1 2.7.95 4-3.65-2.2-3.65 2.2.95-4-3.1-2.7 4.1-.4z"
        fill="var(--sym-gold-lt)" stroke="var(--sym-gold)" strokeWidth="0.6" strokeLinejoin="round" />
      <path d="M5 12c-1.4 2.2-1.2 5 .6 7.2M5 12c1.7.2 3 1 3.6 2.6M5 12c-.3 1.7 0 3.2.8 4.4" stroke="var(--sym-gold)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
      <path d="M19 12c1.4 2.2 1.2 5-.6 7.2M19 12c-1.7.2-3 1-3.6 2.6M19 12c.3 1.7 0 3.2-.8 4.4" stroke="var(--sym-gold)" strokeWidth="1.1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ════════════════════════════════════════════════════════════════════
   BACKDROPS
   ════════════════════════════════════════════════════════════════════ */
const RITUAL_RIM = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split("");
function RitualCircle() {
  return (
    <svg className="ritual__circle" viewBox="0 0 400 400">
      <defs><path id="rimpath" d="M200,200 m-150,0 a150,150 0 1,1 300,0 a150,150 0 1,1 -300,0" /></defs>
      <circle cx="200" cy="200" r="186" className="ritual__ring ritual__ring--outer" />
      <circle cx="200" cy="200" r="150" className="ritual__ring" />
      <circle cx="200" cy="200" r="112" className="ritual__ring ritual__ring--dash" />
      <circle cx="200" cy="200" r="66" className="ritual__ring" />
      <path d="M200,70 L312,295 L88,295 Z" className="ritual__tri" />
      <path d="M200,330 L88,105 L312,105 Z" className="ritual__tri ritual__tri--soft" />
      <circle cx="200" cy="200" r="16" className="ritual__eye" />
      <circle cx="200" cy="200" r="4" className="ritual__pupil" />
      <text className="ritual__rim"><textPath href="#rimpath" startOffset="0">{RITUAL_RIM.join("  ")}</textPath></text>
    </svg>
  );
}

function Constellations() {
  const stars = useMemoH(() => Array.from({ length: 64 }).map((_, i) => {
    const h = (i * 2654435761) >>> 0;
    return { x: (h % 1000) / 10, y: ((h >> 10) % 1000) / 10, s: 1 + ((h >> 4) % 3), tw: 3 + ((h >> 7) % 5) };
  }), []);
  // a few constellation polylines among bright stars
  const lines = useMemoH(() => {
    const pts = [[18, 22], [26, 30], [34, 24], [44, 33], [52, 26],
                 [70, 18], [78, 28], [86, 22],
                 [22, 70], [30, 78], [40, 74], [48, 82],
                 [64, 70], [72, 80], [82, 74]];
    const segs = [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7], [8, 9], [9, 10], [10, 11], [12, 13], [13, 14]];
    return { pts, segs };
  }, []);
  return (
    <div className="bk bk-constellations">
      <div className="bk-stars">
        {stars.map((st, i) => (
          <span key={i} className="bk-star" style={{ left: st.x + "%", top: st.y + "%", width: st.s, height: st.s, "--tw": st.tw + "s", animationDelay: (i % 7) * 0.4 + "s" }}></span>
        ))}
      </div>
      <svg className="bk-lines" viewBox="0 0 100 100" preserveAspectRatio="none">
        {lines.segs.map((sg, i) => {
          const a = lines.pts[sg[0]], b = lines.pts[sg[1]];
          return <line key={i} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />;
        })}
        {lines.pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="0.6" />)}
      </svg>
    </div>
  );
}

function Aurora() {
  return (
    <div className="bk bk-aurora">
      <div className="curtain c1"></div>
      <div className="curtain c2"></div>
      <div className="curtain c3"></div>
    </div>
  );
}

function Marble() {
  return (
    <div className="bk bk-marble">
      <svg className="bk-veins" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M-2 18 C 20 26, 38 8, 58 20 S 92 14, 104 26" />
        <path d="M-2 44 C 24 50, 40 34, 64 46 S 90 40, 104 50" />
        <path d="M-2 70 C 18 64, 44 82, 66 70 S 92 78, 104 68" />
        <path d="M14 -2 C 20 22, 8 44, 22 66 S 16 92, 24 104" />
        <path d="M62 -2 C 70 20, 56 46, 72 66 S 64 90, 74 104" />
      </svg>
      <div className="bk-marble-sheen"></div>
    </div>
  );
}

function Sea() {
  const wave = (h) => `M0 ${40 + h} Q 25 ${20 + h} 50 ${40 + h} T 100 ${40 + h} V 100 H 0 Z`;
  return (
    <div className="bk bk-sea">
      <div className="bk-glimmer"></div>
      <div className="bk-wave w1"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d={wave(0)} /></svg></div>
      <div className="bk-wave w2"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d={wave(8)} /></svg></div>
      <div className="bk-wave w3"><svg viewBox="0 0 100 100" preserveAspectRatio="none"><path d={wave(16)} /></svg></div>
    </div>
  );
}

function Olympus() {
  return (
    <div className="bk bk-olympus">
      <div className="bk-beam b1"></div>
      <div className="bk-beam b2"></div>
      <div className="bk-beam b3"></div>
      <div className="bk-cloud cl1"></div>
      <div className="bk-cloud cl2"></div>
      <div className="bk-cloud cl3"></div>
    </div>
  );
}

function Storm() {
  const drops = useMemoH(() => Array.from({ length: 40 }).map((_, i) => ({
    left: (i * 2.6 + (i * i * 5) % 7) % 100, delay: ((i * 0.37) % 4).toFixed(2), dur: (0.5 + (i % 4) * 0.18).toFixed(2),
  })), []);
  return (
    <div className="bk bk-storm">
      <div className="bk-cloudbank"></div>
      <div className="bk-bolt bolt1"></div>
      <div className="bk-bolt bolt2"></div>
      <div className="bk-stormrain">
        {drops.map((d, i) => <span key={i} style={{ left: d.left + "%", animationDelay: d.delay + "s", animationDuration: d.dur + "s" }}></span>)}
      </div>
      <div className="bk-flash"></div>
    </div>
  );
}

function Eclipse() {
  return (
    <div className="bk bk-eclipse">
      <div className="bk-corona"></div>
      <div className="bk-disc"></div>
      <div className="bk-rays"></div>
    </div>
  );
}

function VolleyBackdrop() {
  const arrows = useMemoH(() => Array.from({ length: 26 }).map((_, i) => ({
    left: (i * 4.1 + (i * i * 3) % 9) % 100, top: (i * 7) % 90, delay: ((i * 0.6) % 7).toFixed(2),
    dur: (3.4 + (i % 5) * 0.7).toFixed(2), len: 26 + (i % 4) * 10,
  })), []);
  return (
    <div className="bk bk-volley">
      {arrows.map((a, i) => (
        <span key={i} className="bk-arrow" style={{ left: a.left + "%", top: a.top + "%", animationDelay: a.delay + "s", animationDuration: a.dur + "s", "--len": a.len + "px" }}></span>
      ))}
    </div>
  );
}

/* ── particle layer ──────────────────────────────────────────────────── */
const GLYPH_CHARS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split("");
function Particles({ type }) {
  const items = useMemoH(() => Array.from({ length: 24 }).map((_, i) => ({
    left: (i * 4.3 + (i * i * 7) % 11) % 100,
    top: (i * 6.7 + (i * 3) % 13) % 100,
    delay: (i * 0.6) % 11,
    dur: 8 + (i % 6) * 2,
    size: 2 + (i % 3),
    drift: (i % 2 ? 1 : -1) * (10 + (i % 5) * 8),
    dx: (i % 2 ? 1 : -1) * (14 + (i % 4) * 7),
    dy: -(18 + (i % 5) * 8),
    rot: (i % 360),
  })), []);
  if (type === "none") return null;
  if (type === "embers") {
    return (
      <div className="ritual__embers">
        {items.map((e, i) => (
          <span key={i} className="ember" style={{ left: e.left + "%", animationDelay: e.delay + "s", animationDuration: e.dur + "s", width: e.size, height: e.size, "--drift": e.drift + "px" }}></span>
        ))}
      </div>
    );
  }
  if (type === "rain") {
    return (
      <div className="pfx">
        {items.map((e, i) => (
          <span key={i} className="pfx-rain" style={{ left: e.left + "%", animationDelay: e.delay + "s", animationDuration: (3.2 + (i % 4) * 0.4) + "s" }}></span>
        ))}
      </div>
    );
  }
  if (type === "snow") {
    return (
      <div className="pfx">
        {items.map((e, i) => (
          <span key={i} className="pfx-snow" style={{ left: e.left + "%", animationDelay: e.delay + "s", animationDuration: e.dur + "s", width: e.size + 2, height: e.size + 2, "--drift": e.drift + "px" }}></span>
        ))}
      </div>
    );
  }
  if (type === "glyphs") {
    return (
      <div className="pfx">
        {items.map((e, i) => (
          <span key={i} className="pfx-glyph" style={{ left: e.left + "%", animationDelay: e.delay + "s", animationDuration: (e.dur + 4) + "s", "--drift": e.drift + "px" }}>{GLYPH_CHARS[i % GLYPH_CHARS.length]}</span>
        ))}
      </div>
    );
  }
  const cls = type === "petals" ? "pfx-petal" : type === "ash" ? "pfx-ash" : "pfx-mote";
  return (
    <div className="pfx">
      {items.map((e, i) => (
        <span key={i} className={cls} style={{
          left: e.left + "%", top: type === "motes" ? e.top + "%" : undefined,
          animationDelay: e.delay + "s", animationDuration: e.dur + "s",
          "--drift": e.drift + "px", "--dx": e.dx + "px", "--dy": e.dy + "px",
          transform: type === "petals" ? `rotate(${e.rot}deg)` : undefined,
        }}></span>
      ))}
    </div>
  );
}

/* ── the whole backdrop host (fog + feature + particles) ─────────────── */
function Backdrop({ backdrop, particles, act = 1, tone = "full" }) {
  const isRitual = !backdrop || backdrop === "ritual";
  return (
    <div className="ritual" aria-hidden="true">
      <div className="ritual__fog ritual__fog--a"></div>
      <div className="ritual__fog ritual__fog--b"></div>
      {backdrop === "constellations" ? <Constellations />
        : backdrop === "aurora" ? <Aurora />
        : backdrop === "marble" ? <Marble />
        : backdrop === "sea" ? <Sea />
        : backdrop === "olympus" ? <Olympus />
        : backdrop === "storm" ? <Storm />
        : backdrop === "eclipse" ? <Eclipse />
        : backdrop === "volley" ? <VolleyBackdrop />
        : (window.RitualScene ? <RitualScene act={act} tone={tone} /> : <RitualCircle />)}
      {/* the act-reactive ritual scene carries its own particle field */}
      {isRitual ? null : <Particles type={particles} />}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   CELEBRATION NOTICES
   ════════════════════════════════════════════════════════════════════ */
function NoticeStack({ notices, dismiss }) {
  useEffectH(() => {
    if (!notices.length) return;
    const timers = notices.map((n) => setTimeout(() => dismiss(n.key), 5200));
    return () => timers.forEach(clearTimeout);
  }, [notices, dismiss]);
  if (!notices.length) return null;
  const kindLabel = { ach: "Τρόπαιον · Achievement", quest: "Ἆθλος · Quest", ql: "Ἔπος · Saga" };
  return (
    <div className="notices">
      {notices.slice(-4).map((n) => (
        <div key={n.key} className={"notice" + (n.type === "quest" ? " notice--quest" : "")} onClick={() => dismiss(n.key)}>
          <div className="notice__medal">{n.icon}</div>
          <div className="notice__txt">
            <span className="notice__kind">{kindLabel[n.type] || "Ξεκλείδωμα"}</span>
            <span className="notice__name">{n.title}</span>
            <span className="notice__reward"><b style={{ color: "var(--sym-gold-lt)" }}>+{n.reward}</b> κλέος{n.unlock ? " · ξεκλείδωσες ὄψη" : ""}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   small reusable bits
   ════════════════════════════════════════════════════════════════════ */
function Price({ n }) { return (<span className="price"><KleosIcon size={15} /> {n}</span>); }

function CosmeticCard({ c, meta, api, lang }) {
  const owned = isOwned(meta, c.id);
  const equipped = meta[c.slot] === c.id;
  const canAfford = meta.kleos >= c.price;
  return (
    <div className={"card" + (equipped ? " card--on" : "") + (owned ? "" : " card--locked")}>
      {equipped ? <span className="card__pill">Ἐνεργό</span> : null}
      <div className="card__top">
        <div className="card__ic">{c.icon}</div>
        <div className="card__tt">
          <div className="card__name">{c.name}</div>
          <div className="card__en">{c.en}</div>
        </div>
      </div>
      {c.swatch ? (
        <div className="card__swatch">{c.swatch.map((s, i) => <i key={i} style={{ background: s }}></i>)}</div>
      ) : null}
      <div className="card__note">{c.note}</div>
      <div className="card__foot">
        {owned ? (
          equipped ? <button className="card__btn card__btn--on" disabled>✓ Φοριέται</button>
            : <button className="card__btn card__btn--equip" onClick={() => api.equipCosmetic(c.slot, c.id)}>Φόρεσε</button>
        ) : (
          <>
            <Price n={c.price} />
            <button className="card__btn card__btn--buy" disabled={!canAfford} onClick={() => api.buyCosmetic(c.id)}>{canAfford ? "Ξεκλείδωσε" : "Λίγο κλέος"}</button>
          </>
        )}
      </div>
    </div>
  );
}

function CosmeticsTab({ meta, api, lang }) {
  return (
    <>
      <p className="hub__lead">Κάθε ἄνοδος ἀφήνει κλέος. Ξόδεψέ το γιὰ νὰ ἀλλάξεις τὴν ὄψη τοῦ ταξιδιοῦ — χρώματα, φόντα, σωματίδια καὶ τὸ μονοπάτι τῆς ἀνάβασης.</p>
      {COSMETIC_SLOTS.map((sl) => {
        const items = COSMETICS.filter((c) => c.slot === sl.slot);
        return (
          <div key={sl.slot}>
            <div className="hub__subhead"><b>{sl.label}</b><span>{sl.en}</span><div className="rule"></div></div>
            <div className="hub__grid">
              {items.map((c) => <CosmeticCard key={c.id} c={c} meta={meta} api={api} lang={lang} />)}
            </div>
          </div>
        );
      })}
    </>
  );
}

function AnabasisPanel({ meta, api, lang }) {
  const maxU = meta.anabasisMax || 0;
  const lvl = meta.anabasis || 0;
  const cur = ANABASIS[lvl];
  const activeMods = ANABASIS.slice(1, lvl + 1);   // modifiers in force at this level
  return (
    <div className="anabasis">
      <div className="anabasis__head">
        <div className="anabasis__title"><b>Ἀνάβασις</b><span>Ascension · κάθε νίκη ξεκλειδώνει τὸ ἑπόμενο σκαλί</span></div>
        <div className="anabasis__badge"><span className="anabasis__num">{lvl}</span><span className="anabasis__nm">{cur.name}</span></div>
      </div>
      {maxU === 0 ? (
        <p className="anabasis__locked">🔒 Ὁλοκλήρωσε μιὰ πλήρη ἄνοδο γιὰ νὰ ξεκλειδώσεις τὴν Ἀνάβασιν — τότε ἀρχίζει ἡ ἀληθινὴ δοκιμασία.</p>
      ) : (
        <>
          <div className="anabasis__ladder">
            {ANABASIS.map((a) => {
              const unlocked = a.lvl <= maxU;
              const active = a.lvl === lvl;
              return (
                <button key={a.lvl} className={"anastep" + (active ? " anastep--on" : "") + (unlocked ? "" : " anastep--locked")}
                  disabled={!unlocked} title={a.name + (a.desc ? " — " + a.desc : "")} onClick={() => api.selectAnabasis(a.lvl)}>
                  {unlocked ? a.lvl : "🔒"}
                </button>
              );
            })}
          </div>
          <div className="anabasis__mods">
            {lvl === 0 ? <div className="anamod anamod--none">Καμία πρόσθετη δυσκολία — ἡ κανονικὴ ἄνοδος.</div>
              : activeMods.map((a) => (
                <div key={a.lvl} className="anamod"><span className="anamod__lvl">{a.lvl}</span><span>{lang === "en" ? a.en + " — " + (a.desc || "") : a.desc}</span></div>
              ))}
          </div>
        </>
      )}
    </div>
  );
}

function BoostsTab({ meta, api, lang }) {
  const loadFull = (i) => meta.loadout[i] ? BOOSTS.find((b) => b.id === meta.loadout[i]) : null;
  return (
    <>
      <p className="hub__lead">Εὐλογίες ποὺ ἀλλάζουν τὴν ἑπόμενη ἄνοδο. Ξεκλείδωσέ τες μιὰ φορά — μετὰ ἐξόπλισε ἕως <b style={{ color: "var(--sym-gold-lt)" }}>δύο</b>. Οἱ βοήθειες (lifelines) εἶναι ἀναλώσιμες χρεώσεις ποὺ ξοδεύεις μέσα στὴ μάχη.</p>

      <AnabasisPanel meta={meta} api={api} lang={lang} />

      <div className="loadout">
        <span className="loadout__lbl">Ἐξοπλισμός</span>
        <div className="loadout__slots">
          {[0, 1].map((i) => { const b = loadFull(i); return (
            <div key={i} className={"loadout__slot" + (b ? " loadout__slot--full" : "")} title={b ? b.name : "Κενό"}>{b ? b.icon : "+"}</div>
          ); })}
        </div>
        <span className="loadout__hint">{meta.loadout.length}/2 ἐνεργές εὐλογίες</span>
      </div>

      <div className="hub__subhead"><b>Εὐλογίες ἀρχῆς</b><span>Start-of-climb boons</span><div className="rule"></div></div>
      <div className="hub__grid hub__grid--wide">
        {BOOSTS.map((b) => {
          const owned = meta.boostsOwned[b.id];
          const equipped = meta.loadout.includes(b.id);
          const canAfford = meta.kleos >= b.price;
          const full = meta.loadout.length >= 2 && !equipped;
          return (
            <div key={b.id} className={"card" + (equipped ? " card--on" : "") + (owned ? "" : " card--locked")}>
              {equipped ? <span className="card__pill">Ἐξοπλισμένο</span> : null}
              <div className="card__top">
                <div className="card__ic">{b.icon}</div>
                <div className="card__tt"><div className="card__name">{b.name}</div><div className="card__en">{b.en}</div></div>
              </div>
              <div className="card__note">{lang === "en" ? b.enDesc : b.desc}</div>
              <div className="card__foot">
                {owned ? (
                  equipped ? <button className="card__btn card__btn--equip" onClick={() => api.toggleLoadout(b.id)}>Ἀφαίρεσε</button>
                    : <button className="card__btn card__btn--buy" disabled={full} title={full ? "Γέμισαν οἱ θέσεις" : ""} onClick={() => api.toggleLoadout(b.id)}>{full ? "Θέσεις γεμᾶτες" : "Ἐξόπλισε"}</button>
                ) : (
                  <>
                    <Price n={b.price} />
                    <button className="card__btn card__btn--buy" disabled={!canAfford} onClick={() => api.buyBoost(b.id)}>{canAfford ? "Ξεκλείδωσε" : "Λίγο κλέος"}</button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hub__subhead"><b>Βοήθειες & Τεχνάσματα</b><span>Lifelines & cheats · consumable</span><div className="rule"></div></div>
      <div className="hub__grid hub__grid--wide">
        {LIFELINES.map((l) => {
          const cnt = meta.lifelines[l.id] || 0;
          const canAfford = meta.kleos >= l.price;
          return (
            <div key={l.id} className="card">
              <div className="card__top">
                <div className="card__ic">{l.icon}</div>
                <div className="card__tt"><div className="card__name">{l.name}</div><div className="card__en">{l.en}{l.kind === "cheat" ? " · τέχνασμα" : ""}</div></div>
              </div>
              <div className="card__note">{lang === "en" ? l.enDesc : l.desc}</div>
              <div className="card__foot">
                <span className="card__cnt">{cnt}<small> στὸ σακίδιο</small></span>
                <button className="card__btn card__btn--buy" disabled={!canAfford} onClick={() => api.buyLifeline(l.id)}>
                  +1 · <Price n={l.price} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function QuestsTab({ meta, api, lang }) {
  const active = meta.quests.active;
  return (
    <>
      <div className="quests__head">
        <p className="hub__lead" style={{ margin: 0 }}>Ἀνανεώνονται κάθε μέρα. Ὁλοκλήρωσέ τους κατὰ τὴν ἄνοδο, μετὰ λάβε τὴν ἀμοιβή ἐδῶ.</p>
        <button className="quests__reroll" onClick={api.rerollQuests}>↻ Ἀλλαγή</button>
      </div>
      <div className="hub__grid" style={{ gridTemplateColumns: "1fr" }}>
        {active.map((q) => {
          const def = QUESTS[q.id]; if (!def) return null;
          const pct = Math.round((q.prog / def.goal) * 100);
          return (
            <div key={q.id} className={"quest" + (q.done ? " quest--done" : "") + (q.claimed ? " quest--claimed" : "")}>
              <div className="quest__ic">{def.icon}</div>
              <div className="quest__body">
                <div className="quest__name">{def.name}</div>
                <div className="quest__desc">{def.desc}</div>
                <div className="quest__bar"><div className="quest__fill" style={{ width: pct + "%" }}></div></div>
                <div className="quest__prog">{Math.min(q.prog, def.goal)} / {def.goal}</div>
              </div>
              <div className="quest__side">
                <Price n={def.reward} />
                {q.claimed ? <span className="quest__claimed-tag">✓ Ἐλήφθη</span>
                  : q.done ? <button className="quest__claim" onClick={() => api.claimQuest(q.id)}>Λάβε</button>
                  : <span className="quest__claimed-tag" style={{ color: "var(--sym-stone)" }}>σὲ ἐξέλιξη</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="hub__subhead" style={{ marginTop: 32 }}><b>Τὸ Ἔπος</b><span>The saga · advances across runs</span><div className="rule"></div></div>
      <div className="qline">
        {QUESTLINE.map((st, i) => {
          const done = i < meta.ql;
          const cur = i === meta.ql;
          const val = statVal(meta.stats, st.stat);
          const pct = Math.min(100, Math.round((val / st.goal) * 100));
          return (
            <div key={st.id} className={"qstage" + (done ? " qstage--done" : cur ? " qstage--cur" : " qstage--locked")}>
              <div className="qstage__dot">{done ? "✓" : st.icon}</div>
              <div className="qstage__card">
                <div className="qstage__top">
                  <span className="qstage__name">{st.name}</span>
                  <span className="qstage__en">{st.en}</span>
                  <span className="qstage__reward"><Price n={st.reward} /></span>
                </div>
                <div className="qstage__desc">{st.desc}{st.unlock ? " · ξεκλειδώνει νέα ὄψη" : ""}</div>
                {cur ? (
                  <div className="qstage__prog">
                    <div className="quest__bar"><div className="quest__fill" style={{ width: pct + "%" }}></div></div>
                    <div className="quest__prog">{Math.min(val, st.goal)} / {st.goal}</div>
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function AchievementsTab({ meta, api, lang }) {
  const s = meta.stats;
  const groups = [];
  ACHIEVEMENTS.forEach((a) => { const g = groups.find((x) => x.name === a.group); (g || groups[groups.push({ name: a.group, items: [] }) - 1]).items.push(a); });
  const stats = [
    { v: s.tiles, l: "Κόμβοι" }, { v: s.correct, l: "Σωστές" }, { v: s.riddles, l: "Αἰνίγματα" },
    { v: s.bosses, l: "Ἄρχοντες" }, { v: s.flawless, l: "Ἄψογες" }, { v: s.bestStreak, l: "Καλύτερο σερί" },
    { v: s.wins, l: "Ἀνόδοι" }, { v: (s.relicIds || []).length, l: "Περίαπτα" },
  ];
  return (
    <>
      <div className="statstrip">
        {stats.map((st, i) => <div key={i} className="statcell"><b>{st.v}</b><span>{st.l}</span></div>)}
      </div>
      {groups.map((g) => (
        <div key={g.name}>
          <div className="ach__group">{g.name}<div className="rule"></div></div>
          <div className="hub__grid hub__grid--wide">
            {g.items.map((a) => {
              const val = statVal(s, a.stat);
              const done = !!meta.ach[a.id] || val >= a.goal;
              const pct = Math.min(100, Math.round((val / a.goal) * 100));
              return (
                <div key={a.id} className={"ach" + (done ? " ach--done" : " ach--locked")}>
                  <div className="ach__medal">{a.icon}{done ? <span className="ach__check">✓</span> : null}</div>
                  <div className="ach__body">
                    <div className="ach__name">{a.name}</div>
                    <div className="ach__desc">{a.desc}</div>
                    <div className="ach__bar"><div className="ach__fill" style={{ width: pct + "%" }}></div></div>
                    <div className="ach__meta">
                      <span className="ach__prog">{Math.min(val, a.goal)} / {a.goal}</span>
                      <Price n={a.reward} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}

function ChronicleTab({ meta, api, lang, onDaily, onReplay }) {
  const s = meta.stats;
  const today = todayKey();
  const dly = (meta.daily && meta.daily.date === today) ? meta.daily : null;
  const ledger = meta.ledger || [];
  const bestXp = ledger.reduce((m, e) => Math.max(m, e.xp || 0), 0);
  return (
    <>
      <div className="statstrip">
        <div className="statcell"><b>{s.wins || 0}</b><span>Ἀνόδοι</span></div>
        <div className="statcell"><b>{meta.winStreak || 0}</b><span>Σερὶ νικῶν</span></div>
        <div className="statcell"><b>{meta.bestWinStreak || 0}</b><span>Κάλλιστο σερί</span></div>
        <div className="statcell"><b>{bestXp}</b><span>Κάλλιστη δόξα</span></div>
        <div className="statcell"><b>{meta.anabasisMax || 0}</b><span>Ἀνάβασις</span></div>
      </div>

      <div className="hub__subhead"><b>Ἡμερήσιος Ἆθλος</b><span>Daily seed · same climb for all</span><div className="rule"></div></div>
      <div className="daily">
        <div className="daily__ic">📅</div>
        <div className="daily__body">
          <div className="daily__name">Ὁ σπόρος τῆς ἡμέρας</div>
          <div className="daily__desc">Ἴδιος χάρτης γιὰ ὅλους σήμερα — κυνήγησε τὴν κάλλιστη δόξα σου.</div>
          {dly ? (
            <div className="daily__stats"><span>✦ {dly.bestXp} δόξα</span><span>⛰ {dly.bestTiles} κόμβοι</span><span>↻ {dly.attempts} προσπ.</span>{dly.won ? <span className="daily__won">✓ Νίκη</span> : null}</div>
          ) : <div className="daily__stats"><span style={{ color: "var(--sym-stone)" }}>Καμία προσπάθεια ἀκόμη σήμερα.</span></div>}
        </div>
        <button className="daily__btn" onClick={onDaily}>Παῖξε →</button>
      </div>

      <div className="hub__subhead"><b>Τὸ Χρονικόν</b><span>{ledger.length ? "Τελευταῖες ἀνόδοι" : "—"}</span><div className="rule"></div></div>
      {ledger.length === 0 ? (
        <p className="hub__lead" style={{ fontSize: 16 }}>Δὲν ἔχεις ἀνέβει ἀκόμη. Κάθε ἄνοδος — νίκη ἢ ἧττα — γράφεται ἐδῶ.</p>
      ) : (
        <div className="ledger">
          {ledger.map((e, i) => {
            const pat = PATRON_BY_ID[e.patron];
            return (
              <div key={i} className={"ledrow" + (e.won ? " ledrow--won" : " ledrow--lost")}>
                <span className="ledrow__out">{e.won ? "🏛" : "🜃"}</span>
                <span className="ledrow__stats"><b>{e.tiles}</b> κόμβ · <b>{e.xp}</b> δόξα · <b>{e.drachmes}</b> δρ · <b>{e.relics}</b> περ</span>
                <span className="ledrow__tags">
                  {e.anabasis > 0 ? <span className="ledtag ledtag--ana">⛰{e.anabasis}</span> : null}
                  {pat && e.patron !== "none" ? <span className="ledtag" style={{ "--pat": pat.color }}>{pat.icon}</span> : null}
                  {e.daily ? <span className="ledtag ledtag--daily">📅</span> : null}
                </span>
                <span className="ledrow__kleos"><KleosIcon size={13} /> +{e.kleos}</span>
                <button className="ledrow__replay" title="Ἐπανάληψη αὐτοῦ τοῦ σπόρου" onClick={() => onReplay(e.seed)}>↺</button>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════
   THE TEMPLE HUB
   ════════════════════════════════════════════════════════════════════ */
const HUB_TABS = [
  { id: "cosmetics",    icon: "🏛", label: "Ἀφιερώματα", en: "Cosmetics" },
  { id: "boosts",       icon: "🜂", label: "Εὐλογίες",   en: "Boosts" },
  { id: "quests",       icon: "𓁹", label: "Ἆθλοι",      en: "Quests" },
  { id: "achievements", icon: "🏆", label: "Τρόπαια",    en: "Achievements" },
  { id: "chronicle",    icon: "📜", label: "Χρονικόν",   en: "Chronicle" },
];

function TempleHub({ meta, api, lang, layout, hasRun, onBegin, onClose, onRules, onDaily, onReplay }) {
  const [tab, setTab] = useStateH("cosmetics");
  const claimable = meta.quests.active.filter((q) => q.done && !q.claimed).length;
  const lay = layout || "atlas";

  const renderTab = (id) => {
    if (id === "cosmetics") return <CosmeticsTab meta={meta} api={api} lang={lang} />;
    if (id === "boosts") return <BoostsTab meta={meta} api={api} lang={lang} />;
    if (id === "quests") return <QuestsTab meta={meta} api={api} lang={lang} />;
    if (id === "chronicle") return <ChronicleTab meta={meta} api={api} lang={lang} onDaily={onDaily} onReplay={onReplay} />;
    return <AchievementsTab meta={meta} api={api} lang={lang} />;
  };

  const TabBtn = ({ t }) => (
    <button className={"hub__tab" + (tab === t.id ? " hub__tab--on" : "")} onClick={() => setTab(t.id)}>
      <span className="hub__tab-ic">{t.icon}</span>
      <span className="hub__tab-tx"><b>{t.label}</b><span>{t.en}</span></span>
      {t.id === "quests" && claimable ? <span className="hub__tab-badge">{claimable}</span> : null}
    </button>
  );

  return (
    <div className={"hub hub--" + lay}>
      <div className="hub__veil"></div>

      <div className="hub__top">
        <svg className="hub__crest" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
          <path d="M50 12 L86 32 L14 32 Z" strokeLinejoin="round" />
          <line x1="20" y1="40" x2="20" y2="78" /><line x1="35" y1="40" x2="35" y2="78" />
          <line x1="50" y1="40" x2="50" y2="78" /><line x1="65" y1="40" x2="65" y2="78" /><line x1="80" y1="40" x2="80" y2="78" />
          <line x1="12" y1="40" x2="88" y2="40" /><line x1="10" y1="86" x2="90" y2="86" />
        </svg>
        <div className="hub__heading">
          <div className="hub__eyebrow">Μετὰ τὴν Ἄνοδο · The Sanctuary</div>
          <div className="hub__title">Ναὸς τῶν Μουσῶν</div>
        </div>
        <div className="hub__bal">
          <div className="hub__kleos"><KleosIcon size={26} /><div><b>{meta.kleos}</b><span>Κλέος · Glory</span></div></div>
          <button className="hub__begin" onClick={onBegin}>{hasRun ? "Νέα ἄνοδος ↻" : "Ξεκίνα τὴν ἄνοδο →"}</button>
          {hasRun ? <button className="hub__x" onClick={onClose}>Πίσω στὴν κλίμακα</button> : (onRules ? <button className="hub__x" onClick={onRules}>Κανόνες</button> : null)}
        </div>
      </div>

      {lay === "temple" ? (
        <div className="hub__shell">
          <div className="hub__nav">{HUB_TABS.map((t) => <TabBtn key={t.id} t={t} />)}</div>
          <div className="hub__frieze"><span>{HUB_TABS.find((t) => t.id === tab).en}</span></div>
          <div className="hub__content">{renderTab(tab)}</div>
        </div>
      ) : lay === "scroll" ? (
        <div className="hub__shell">
          <div className="hub__content">
            {HUB_TABS.map((t) => (
              <div key={t.id} className="hub__section">
                <div className="hub__section-h"><span className="ic">{t.icon}</span><b>{t.label}</b><span>{t.en}</span></div>
                {renderTab(t.id)}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="hub__shell">
          <div className="hub__nav">{HUB_TABS.map((t) => <TabBtn key={t.id} t={t} />)}</div>
          <div className="hub__content">{renderTab(tab)}</div>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { Backdrop, Particles, KleosIcon, NoticeStack, TempleHub });
