/* ============================================================
   Trivia Synthesis — PREVIEW
   The finished trivia panel, rendered entirely from `config`.
   Interactive (selection works) so the admin sees the real thing.
   lang + theme are driven by the app bar.
   ============================================================ */

function PreviewPanel({ config, lang, theme }) {
  const C = config;
  const SECTIONS = C.sections || [];
  const games = (C.games || []).map(gameById).filter(Boolean);

  const [secs, setSecs] = useState(() => new Set());
  const [all, setAll] = useState(false);
  const [game, setGame] = useState(games[0] ? games[0].id : null);
  const [gq, setGq] = useState("");
  const [fmts, setFmts] = useState([]);
  const [helps, setHelps] = useState([]);

  /* keep selection valid when the admin edits the config */
  useEffect(() => {
    const ids = new Set(SECTIONS.map((s) => s.id));
    setSecs((prev) => { const n = new Set([...prev].filter((x) => ids.has(x))); return n; });
  }, [SECTIONS.map((s) => s.id).join(",")]);

  useEffect(() => {
    if (!games.find((g) => g.id === game)) setGame(games[0] ? games[0].id : null);
  }, [(C.games || []).join(",")]);

  /* seed formats/helps from the selected game's authored defaults */
  const cfgFor = (id) => Object.assign(defGameCfg(id), (C.gameCfg || {})[id] || {});
  useEffect(() => {
    if (!game) return;
    const gc = cfgFor(game);
    setFmts(gc.formats || []);
    setHelps(gc.helps || []);
  }, [game, JSON.stringify((C.gameCfg || {})[game] || {})]);

  const tglSec = (id) => { setAll(false); setSecs((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; }); };
  const tglAll = () => { setAll((a) => !a); setSecs(new Set()); };
  const tglIn = (set, arr, id) => set(arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]);

  const sel = games.find((g) => g.id === game) || null;
  const gc = sel ? cfgFor(sel.id) : null;
  const hasContent = all || secs.size > 0;
  const nSel = all ? SECTIONS.length : secs.size;
  const lbl = (o) => T(lang, o && o.gr, o && o.en);
  const tokLabel = (tok) => T(lang, tok.gr, tok.en);

  const contentSummary = () => {
    if (all) return lbl(C.whole);
    if (secs.size === 0) return T(lang, "— διάλεξε " + (C.unit.gr || "ενότητα").toLowerCase() + " —", "— pick a " + (C.unit.en || "section").toLowerCase() + " —");
    if (secs.size === 1) {
      const tok = SECTIONS.find((s) => s.id === [...secs][0]);
      return lbl(C.unit) + " " + (tok ? tokLabel(tok) : "");
    }
    return secs.size + " " + lbl(C.units);
  };
  const selectedToks = SECTIONS.filter((s) => secs.has(s.id));
  const contentChips = all
    ? (SECTIONS.length ? [SECTIONS[0], { id: "ell", gr: "…", en: "…" }, SECTIONS[SECTIONS.length - 1]] : [])
    : selectedToks;

  const visGames = games.filter((g) => {
    const q = gq.trim().toLowerCase();
    return !q || `${g.gr} ${g.en}`.toLowerCase().includes(q);
  });

  const wordy = (tok) => tokLabel(tok).length > 3;
  const cols = Math.max(1, Math.min(8, C.cols || 8));

  const pLabel = (slot) => {
    if (!sel) return "";
    if (sel.id === "tow") return slot === 1 ? T(lang, "Ομάδα Α", "Team A") : T(lang, "Ομάδα Β", "Team B");
    if (sel.players === 1) return T(lang, "Παίκτης", "Player");
    return slot === 1 ? T(lang, "Παίκτης 1", "Player 1") : T(lang, "Παίκτης 2", "Player 2");
  };

  return (
    <div className={"ts-root" + (theme === "night" ? " ts-night" : "")} lang={lang === "en" ? "en" : "el"} data-screen-label="Trivia Preview">
      <div className="ts-ornbg"><Pegasus style={{ width: 460, height: 340 }} /></div>

      <div className="ts-top">
        <div className="ts-brand"><PowerMark size={22} /><span>SymposiON</span></div>
        <div className="ts-top-actions">
          <button className="ts-share" type="button"><Glyph name="qr" size={14} stroke={1.8} />{T(lang, "Μοιράσου στην τάξη", "Share with class")}</button>
        </div>
      </div>

      <header className="ts-head">
        <div className="ts-ornament">{lbl(C.eyebrow)}</div>
        <h1 className="ts-title">{lbl(C.titlePre)} {lbl(C.titleEm) ? <em>{lbl(C.titleEm)}</em> : null}</h1>
        <div className="ts-sub">{lbl(C.sub)}</div>
        <div className="ts-divider"><span></span><i></i><span></span></div>
      </header>

      <div className="ts-body">
        {/* A — content */}
        <section className="ts-card">
          <div className="ts-label"><em>Α</em>{lbl(C.heading)}</div>
          <div className="ts-note">{lbl(C.note)}</div>
          {SECTIONS.length ? (
            <div className="ts-grid" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
              {SECTIONS.map((tok) => (
                <button key={tok.id} type="button" className={"ts-rhap" + (wordy(tok) ? " wordy" : "") + (all || secs.has(tok.id) ? " on" : "")} onClick={() => tglSec(tok.id)}>{tokLabel(tok)}</button>
              ))}
            </div>
          ) : (
            <div className="ts-board-empty">{T(lang, "Δεν έχουν οριστεί ενότητες ακόμη.", "No sections defined yet.")}</div>
          )}
          <button type="button" className={"ts-all" + (all ? " on" : "")} onClick={tglAll}>{lbl(C.whole)}</button>
        </section>

        {/* B — games board */}
        <section className="ts-card">
          <div className="ts-label"><em>Β</em>{T(lang, "Πινακας Παιχνιδιων", "Game Panel")}</div>
          <div className="ts-note">{T(lang, "Διάλεξε παιχνίδι. Παίζεται με την ύλη που όρισες πάνω.", "Choose a game. It plays with the content you set above.")}</div>
          <div className="ts-gsearch">
            <span className="ts-gsearch-ico"><Glyph name="search" size={17} stroke={1.8} /></span>
            <input className="ts-input" value={gq} onChange={(e) => setGq(e.target.value)} placeholder={T(lang, "Αναζήτηση παιχνιδιού…", "Search a game…")} />
          </div>
          <div className="ts-board">
            {visGames.length ? visGames.map((g) => (
              <button key={g.id} type="button" className={"ts-gtile" + (game === g.id ? " on" : "")} onClick={() => setGame(g.id)}>
                <span className="ts-gtile-medal"><Glyph name={g.glyph} size={22} stroke={1.7} /></span>
                <span className="ts-gtile-txt">
                  <span className="ts-gtile-name">{T(lang, g.gr, g.en)}</span>
                  <span className="ts-gtile-desc">{T(lang, g.desc.gr, g.desc.en)}</span>
                </span>
                <span className="ts-gtile-tag">{T(lang, g.tag.gr, g.tag.en)}</span>
              </button>
            )) : <div className="ts-board-empty">{T(lang, "Κανένα παιχνίδι.", "No games yet.")}</div>}
          </div>
        </section>

        {/* C — setup for the selected game */}
        {sel && gc && (
          <section className="ts-card">
            <div className="ts-label"><em>Γ</em>{T(lang, "Ρυθμισεις", "Setup")} · {T(lang, sel.gr, sel.en)}</div>

            <div className="ts-carry">
              <span className="ts-carry-ico"><Glyph name={sel.glyph} size={18} stroke={1.7} /></span>
              <span className="ts-carry-txt">
                <b>{T(lang, sel.gr, sel.en)}</b> {T(lang, "θα φορτωθεί με", "will load with")} <b className="ts-carry-content">{contentSummary()}</b>
              </span>
              <span className="ts-carry-chips">{contentChips.map((c, i) => <em key={i}>{tokLabel(c)}</em>)}</span>
            </div>

            <div className="ts-players">
              {sel.players === 1 ? (
                <label className="ts-pfield"><span>{pLabel(1)}</span><input className="ts-input" defaultValue={lbl(gc.p1)} maxLength={20} /></label>
              ) : (
                <>
                  <label className="ts-pfield"><span>{pLabel(1)}</span><input className="ts-input" defaultValue={lbl(gc.p1)} maxLength={20} /></label>
                  <label className="ts-pfield"><span>{pLabel(2)}</span><input className="ts-input" defaultValue={lbl(gc.p2)} maxLength={20} /></label>
                </>
              )}
            </div>

            {(gc.formats && gc.formats.length > 0) && (
              <>
                <div className="ts-sublabel">{T(lang, "Τύποι ερωτήσεων", "Question types")}</div>
                <div className="ts-fmts">
                  {FORMATS.filter((f) => gc.formats.includes(f.id)).map((f) => (
                    <button key={f.id} type="button" className={"ts-fmt" + (fmts.includes(f.id) ? " on" : "")} onClick={() => tglIn(setFmts, fmts, f.id)}>
                      <span className="ts-fmt-ico"><Glyph name={f.glyph} size={20} stroke={1.7} /></span>
                      <span className="ts-fmt-txt"><span className="ts-fmt-name">{T(lang, f.gr, f.en)}</span><span className="ts-fmt-sub">{T(lang, f.sub.gr, f.sub.en)}</span></span>
                      <span className="ts-fmt-tick"><Glyph name="check" size={13} stroke={2.4} /></span>
                    </button>
                  ))}
                </div>
              </>
            )}

            {(gc.helps && gc.helps.length > 0) && (
              <>
                <div className="ts-sublabel">{T(lang, "Βοήθειες", "Lifelines")}</div>
                <div className="ts-helps">
                  {HELPS.filter((h) => gc.helps.includes(h.id)).map((h) => (
                    <button key={h.id} type="button" className={"ts-help" + (helps.includes(h.id) ? " on" : "")} onClick={() => tglIn(setHelps, helps, h.id)}>
                      <b>{h.label}</b><span>{T(lang, h.gr, h.en)}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </section>
        )}

        <div className="ts-startwrap">
          <div className="ts-startmeta">{contentSummary()}{hasContent ? " · " + nSel * 9 + " " + T(lang, "ερωτήσεις", "questions") : ""}{sel && fmts.length ? " · " + fmts.length + " " + T(lang, "τύποι", "types") : ""}</div>
          <button className="ts-start" type="button" disabled={!hasContent || !sel}>
            {T(lang, "Έναρξη", "Start")}{sel ? " — " + T(lang, sel.gr, sel.en) : ""}
          </button>
        </div>
      </div>

      <footer className="ts-foot">SymposiON · MMXXVI</footer>
    </div>
  );
}

window.PreviewPanel = PreviewPanel;
