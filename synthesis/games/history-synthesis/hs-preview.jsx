/* ============================================================
   History Synthesis — PREVIEW
   The ΑΤΛΑΣ / ΑΓΩΝ hub, rendered entirely from `config`.
   Clicking a unit highlights it (as in the real hub).
   ============================================================ */

function HubPreview({ config, lang, theme }) {
  const C = config;
  const units = C.units || [];
  const modes = (C.modes || []).map(modeById).filter(Boolean);
  const [cur, setCur] = useState(units[0] ? units[0].id : null);

  useEffect(() => {
    if (!units.find((u) => u.id === cur)) setCur(units[0] ? units[0].id : null);
  }, [units.map((u) => u.id).join(",")]);

  const lbl = (o) => T(lang, o && o.gr, o && o.en);
  const goldHex = theme === "agon" ? "%239A8040" : "%2374601C";
  const meander = (window.SYM && window.SYM.meanderBG) ? window.SYM.meanderBG(goldHex) : "none";
  const uCols = Math.min(Math.max(units.length, 1), 5);
  const mCols = Math.min(Math.max(modes.length, 1), 4);
  const metaFor = (m) => (C.modeMeta && C.modeMeta[m.id]) ? C.modeMeta[m.id] : m.meta;

  return (
    <div className={"hub-root " + (theme === "agon" ? "t-agon" : "t-atlas")} lang={lang === "en" ? "en" : "el"} data-screen-label="History Hub">
      <div className="hub-wrap">
        <header className="hub-mast">
          <div className="kicker">{lbl(C.kicker)}</div>
          <h1>{lbl(C.title)}</h1>
          <div className="sub">{lbl(C.sub)}</div>
          <div className="cat">{lbl(C.cat)}</div>
        </header>
        <div className="mndr center" style={{ backgroundImage: meander, marginBottom: 18 }}></div>

        <div className="sec-h"><span className="n">§ Α</span><h2>{lbl(C.unitsHeading)}</h2><span className="ln"></span></div>
        {units.length ? (
          <div className="units" style={{ gridTemplateColumns: `repeat(${uCols}, 1fr)` }}>
            {units.map((u, i) => (
              <button key={u.id} type="button" className={"unit" + (cur === u.id ? " on" : "")} onClick={() => setCur(u.id)}>
                <div className="rn">{toRoman(i + 1)}</div>
                <h3>{lbl(u.t)}</h3>
                <p>{lbl(u.desc)}</p>
                <div className="cnt">{(T(lang, u.t.en, u.t.en) || u.t.gr || "").toUpperCase()} · {lbl(u.cnt)}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="units units-empty">{T(lang, "Δεν έχουν οριστεί ενότητες ακόμη.", "No units defined yet.")}</div>
        )}

        <div className="sec-h" style={{ marginTop: 32 }}><span className="n">§ Β</span><h2>{lbl(C.modesHeading)}</h2><span className="ln"></span></div>
        {modes.length ? (
          <div className="modes" style={{ gridTemplateColumns: `repeat(${mCols}, 1fr)` }}>
            {modes.map((m) => {
              const cCount = ((C.modeContent || {})[m.id] || []).length;
              return (
              <button key={m.id} type="button" className="mode">
                <span className="m-ico"><SymIcon name={m.ico} /></span>
                <div><div className="gr">{T(lang, m.gr, m.en)}</div><div className="en">{m.en}</div></div>
                <span className="m-kind">{T(lang, KIND_LABEL[m.kind].gr, KIND_LABEL[m.kind].en)}{cCount > 0 ? " · " + cCount : ""}</span>
                <div className="meta">{lbl(metaFor(m))}</div>
              </button>
            ); })}
          </div>
        ) : (
          <div className="units units-empty">{T(lang, "Δεν έχουν επιλεγεί τρόποι μελέτης.", "No study modes selected.")}</div>
        )}

        <div className="mndr center" style={{ backgroundImage: meander, margin: "34px auto 8px", maxWidth: 120 }}></div>
        <p className="hub-foot">{lbl(C.tagline)}</p>
      </div>
    </div>
  );
}

window.HubPreview = HubPreview;
