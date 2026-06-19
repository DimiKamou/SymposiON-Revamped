/* ============================================================
   Trivia Synthesis — APP ROOT
   Editable drafts (one per template) · create / rename / delete
   templates · persistence · language / theme / layout-mode.
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
    const ids = (saved && saved.drafts) ? Object.keys(saved.drafts) : TEMPLATES.map((t) => t.id);
    ids.forEach((id) => { if (!o.includes(id)) o.push(id); });
    return o;
  });
  const [names, setNames] = useState((saved && saved.names) || {});
  const [activeId, setActiveId] = useState((saved && saved.activeId) || "epi");
  const [editingId, setEditingId] = useState(null);
  const [lang, setLang] = useState((saved && saved.lang) || "gr");
  const [theme, setTheme] = useState((saved && saved.theme) || "day");
  const [mode, setMode] = useState((saved && saved.mode) || "split");
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
    setDrafts((prev) => ({ ...prev, [id]: makeTemplate({}) }));
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
    const base = templateById(activeId) ? templateById(activeId).config : makeTemplate({});
    if (!window.confirm(T(lang, "Επαναφορά αυτού του προτύπου;", "Reset this template?"))) return;
    setDrafts((prev) => ({ ...prev, [activeId]: cloneConfig(base) }));
  };

  const exportJSON = () => {
    const text = JSON.stringify({ name: nameOf(activeId), config }, null, 2);
    const done = () => { setFlash(true); setTimeout(() => setFlash(false), 1400); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
    else done();
  };

  const workClass = "sy-work" + (mode === "preview" ? " preview-only" : mode === "compose" ? " compose-only" : "");

  return (
    <div className="sy-shell">
      <div className="sy-bar">
        <div className="sy-bar-brand">
          <span className="sy-mark"><PowerMark size={30} /></span>
          <span className="sy-wm">SymposiON<small>{T(lang, "Σύνθεση Trivia · Admin", "Trivia Synthesis · Admin")}</small></span>
        </div>
        <div className="sy-bar-actions">
          <div className="sy-seg" role="group" aria-label="layout">
            <button type="button" className={mode === "compose" ? "on" : ""} onClick={() => setMode("compose")}>{T(lang, "Σύνθεση", "Compose")}</button>
            <button type="button" className={mode === "split" ? "on" : ""} onClick={() => setMode("split")}>{T(lang, "Διπλό", "Split")}</button>
            <button type="button" className={mode === "preview" ? "on" : ""} onClick={() => setMode("preview")}>{T(lang, "Προεπισκόπηση", "Preview")}</button>
          </div>
          <div className="sy-seg" role="group" aria-label="theme">
            <button type="button" className={theme === "day" ? "on" : ""} onClick={() => setTheme("day")} title={T(lang, "Μέρα", "Day")}><Glyph name="sun" size={14} stroke={1.8} /></button>
            <button type="button" className={theme === "night" ? "on" : ""} onClick={() => setTheme("night")} title={T(lang, "Νύχτα", "Night")}><Glyph name="moon" size={14} stroke={1.8} /></button>
          </div>
          <div className="sy-seg" role="group" aria-label="language">
            <button type="button" className={lang === "en" ? "on" : ""} onClick={() => setLang("en")}>EN</button>
            <button type="button" className={lang === "gr" ? "on" : ""} onClick={() => setLang("gr")}>ΕΛ</button>
          </div>
          <button type="button" className="sy-ghost" onClick={resetTemplate} title={T(lang, "Επαναφορά", "Reset")}><Glyph name="copy" size={14} stroke={1.8} />{T(lang, "Επαναφορά", "Reset")}</button>
          <button type="button" className={"sy-ghost" + (flash ? " flash" : "")} onClick={exportJSON}><Glyph name={flash ? "check" : "pen"} size={14} stroke={1.8} />{flash ? T(lang, "Αντιγράφηκε", "Copied") : T(lang, "Εξαγωγή JSON", "Export JSON")}</button>
        </div>
      </div>

      {/* template switcher */}
      <div className="cx-templates" style={{ background: "var(--bg-raised)", border: "1px solid rgba(33,26,16,.14)", borderRadius: 14, marginBottom: 18 }}>
        <span className="cx-tlabel">{T(lang, "Πρότυπο", "Template")}</span>
        {ids.map((id) => {
          const nm = nameOf(id);
          const on = activeId === id;
          if (editingId === id) {
            return (
              <span key={id} className="cx-tchip on">
                <input className="cx-trename" autoFocus value={T(lang, nm.gr, nm.en)}
                  onChange={(e) => setName(id, e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === "Escape") setEditingId(null); }}
                  onBlur={() => setEditingId(null)} />
              </span>
            );
          }
          return (
            <span key={id} className={"cx-tchip" + (on ? " on" : "")}>
              <button type="button" className="cx-tchip-lbl" onClick={() => setActiveId(id)} onDoubleClick={() => setEditingId(id)}>{T(lang, nm.gr, nm.en)}</button>
              {on && <span className="cx-tedit" title={T(lang, "Μετονομασία", "Rename")} onClick={() => setEditingId(id)}>✎</span>}
              {on && !templateById(id) && <span className="cx-tdel" title={T(lang, "Διαγραφή", "Delete")} onClick={() => delTemplate(id)}>✕</span>}
            </span>
          );
        })}
        <button type="button" className="cx-tnew" onClick={addTemplate} title={T(lang, "Νέο πρότυπο", "New template")}>＋ {T(lang, "Νέο", "New")}</button>
      </div>

      <div className={workClass}>
        {mode !== "preview" && (
          <div className="sy-compose-col"><ComposerPanel config={config} up={up} lang={lang} /></div>
        )}
        {mode !== "compose" && (
          <div className="sy-preview-col"><PreviewPanel config={config} lang={lang} theme={theme} /></div>
        )}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
