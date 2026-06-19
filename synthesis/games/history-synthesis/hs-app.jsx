/* ============================================================
   History Synthesis — APP ROOT
   Drafts per template · persistence · language · ΑΤΛΑΣ/ΑΓΩΝ
   theme · layout mode · Composer ↔ Hub preview.
   ============================================================ */

function seedDrafts() {
  const d = {};
  TEMPLATES.forEach((t) => { d[t.id] = cloneConfig(t.config); });
  return d;
}

function App() {
  const saved = Store.load();
  const [drafts, setDrafts] = useState(() => {
    if (saved && saved.drafts) return Object.assign(seedDrafts(), saved.drafts);
    return seedDrafts();
  });
  const [order, setOrder] = useState(() => {
    let o = (saved && saved.order) ? saved.order.slice() : TEMPLATES.map((t) => t.id);
    const dids = (saved && saved.drafts) ? Object.keys(saved.drafts) : TEMPLATES.map((t) => t.id);
    dids.forEach((id) => { if (!o.includes(id)) o.push(id); });
    return o;
  });
  const [names, setNames] = useState((saved && saved.names) || {});
  const [activeId, setActiveId] = useState((saved && saved.activeId) || "katefthynsi");
  const [editingId, setEditingId] = useState(null);
  const [lang, setLang] = useState((saved && saved.lang) || "gr");
  const [theme, setTheme] = useState((saved && saved.theme) || "atlas"); // atlas | agon
  const [mode, setMode] = useState((saved && saved.mode) || "split");    // split | compose | preview
  const [flash, setFlash] = useState(false);

  const ids = order.filter((id) => drafts[id]);
  useEffect(() => { Store.save({ drafts, order: ids, names, activeId, lang, theme, mode }); }, [drafts, order, names, activeId, lang, theme, mode]);

  const config = drafts[activeId] || drafts[ids[0]];
  const up = (producer) => {
    setDrafts((prev) => { const c = cloneConfig(prev[activeId]); producer(c); return { ...prev, [activeId]: c }; });
  };

  const nameOf = (id) => names[id] || (templateById(id) && templateById(id).name) || { gr: "Πρότυπο", en: "Template" };
  const setName = (id, v) => setNames((prev) => { const cur = prev[id] || nameOf(id); return { ...prev, [id]: { ...cur, [lang]: v } }; });
  const addTemplate = () => {
    const id = "tpl" + Date.now().toString(36);
    setDrafts((prev) => ({ ...prev, [id]: makeHistory({ units: [mkUnit("Ενότητα Α", "Unit A", "Σύντομη περιγραφή.", "Short description.", "0 όροι", "0 terms")] }) }));
    setOrder((prev) => [...prev, id]);
    setNames((prev) => ({ ...prev, [id]: { gr: "Νέο πρότυπο", en: "New template" } }));
    setActiveId(id); setEditingId(id);
  };
  const delTemplate = (id) => {
    if (templateById(id)) return;
    if (!window.confirm(T(lang, "Διαγραφή αυτού του προτύπου;", "Delete this template?"))) return;
    setOrder((prev) => prev.filter((x) => x !== id));
    setDrafts((prev) => { const n = { ...prev }; delete n[id]; return n; });
    setNames((prev) => { const n = { ...prev }; delete n[id]; return n; });
    if (activeId === id) { const rest = ids.filter((x) => x !== id); setActiveId(rest[0] || TEMPLATES[0].id); }
  };

  const resetTemplate = () => {
    const base = templateById(activeId) ? templateById(activeId).config : makeHistory({});
    if (!window.confirm(T(lang, "Επαναφορά αυτού του προτύπου στις αρχικές τιμές;", "Reset this template to its original values?"))) return;
    setDrafts((prev) => ({ ...prev, [activeId]: cloneConfig(base) }));
  };

  const exportJSON = () => {
    const text = JSON.stringify({ name: nameOf(activeId), config }, null, 2);
    const done = () => { setFlash(true); setTimeout(() => setFlash(false), 1400); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  };

  const workClass = "hx-work" + (mode === "preview" ? " preview-only" : mode === "compose" ? " compose-only" : "");

  return (
    <div className="hx-shell">
      <div className="hx-bar">
        <div className="hx-brand">
          <span className="hx-mark"><SymIcon name={config.emblem || "column"} /></span>
          <span className="hx-wm">SymposiON<small>{T(lang, "Σύνθεση Ιστορίας · Admin", "History Synthesis · Admin")}</small></span>
        </div>
        <div className="hx-actions">
          <div className="hx-seg" role="group" aria-label="layout">
            <button type="button" className={mode === "compose" ? "on" : ""} onClick={() => setMode("compose")}>{T(lang, "Σύνθεση", "Compose")}</button>
            <button type="button" className={mode === "split" ? "on" : ""} onClick={() => setMode("split")}>{T(lang, "Διπλό", "Split")}</button>
            <button type="button" className={mode === "preview" ? "on" : ""} onClick={() => setMode("preview")}>{T(lang, "Προεπισκόπηση", "Preview")}</button>
          </div>
          <div className="hx-seg" role="group" aria-label="theme">
            <button type="button" className={theme === "atlas" ? "on" : ""} onClick={() => setTheme("atlas")}>ΑΤΛΑΣ</button>
            <button type="button" className={theme === "agon" ? "on" : ""} onClick={() => setTheme("agon")}>ΑΓΩΝ</button>
          </div>
          <div className="hx-seg" role="group" aria-label="language">
            <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            <button type="button" className={lang === "gr" ? "on" : ""} onClick={() => setLang("gr")}>ΕΛ</button>
          </div>
          <button type="button" className="hx-ghost" onClick={resetTemplate}>{T(lang, "Επαναφορά", "Reset")}</button>
          <button type="button" className={"hx-ghost" + (flash ? " flash" : "")} onClick={exportJSON}>{flash ? T(lang, "Αντιγράφηκε", "Copied") : T(lang, "Εξαγωγή JSON", "Export JSON")}</button>
        </div>
      </div>

      <div className="hx-templates">
        <span className="hx-tlabel">{T(lang, "Πρότυπο", "Template")}</span>
        {ids.map((id) => {
          const nm = nameOf(id);
          const on = activeId === id;
          if (editingId === id) {
            return (
              <span key={id} className="hx-tchip on">
                <input className="hx-trename" autoFocus value={T(lang, nm.gr, nm.en)}
                  onChange={(e) => setName(id, e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingId(null); }}
                  onBlur={() => setEditingId(null)} />
              </span>
            );
          }
          return (
            <span key={id} className={"hx-tchip" + (on ? " on" : "")}>
              <button type="button" className="hx-tchip-lbl" onClick={() => setActiveId(id)} onDoubleClick={() => setEditingId(id)}>{T(lang, nm.gr, nm.en)}</button>
              {on && <span className="hx-tedit" title={T(lang, "Μετονομασία", "Rename")} onClick={() => setEditingId(id)}>✎</span>}
              {on && !templateById(id) && <span className="hx-tdel" title={T(lang, "Διαγραφή", "Delete")} onClick={() => delTemplate(id)}>✕</span>}
            </span>
          );
        })}
        <button type="button" className="hx-tnew" onClick={addTemplate} title={T(lang, "Νέο πρότυπο", "New template")}>＋ {T(lang, "Νέο", "New")}</button>
      </div>

      <div className={workClass}>
        {mode !== "preview" && (
          <div className="hx-compose-col"><ComposerPanel config={config} up={up} lang={lang} /></div>
        )}
        {mode !== "compose" && (
          <div className="hx-prev-col"><HubPreview config={config} lang={lang} theme={theme} /></div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
