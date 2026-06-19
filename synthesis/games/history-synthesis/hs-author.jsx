/* ============================================================
   History Synthesis — COMPOSER (admin author pane)
   Edits identity, section labels, thematic units, and study
   modes in both languages; writes back through up(producer).
   ============================================================ */

function ComposerPanel({ config, up, lang }) {
  const C = config;
  const [open, setOpen] = useState({ id: true, lbl: false, units: true, modes: false });
  const tog = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  const dragId = useRef(null);
  const [dragOver, setDragOver] = useState(null);

  /* ---- units ---- */
  const addUnit = () => up((c) => c.units.push(mkUnit("Νέα ενότητα", "New unit", "", "", "0 όροι", "0 terms")));
  const delUnit = (id) => up((c) => { c.units = c.units.filter((u) => u.id !== id); });
  const setU = (id, path, v) => up((c) => { const u = c.units.find((x) => x.id === id); if (u) u[path[0]][path[1]] = v; });
  const reorderUnits = (fromId, toId) => up((c) => {
    const fi = c.units.findIndex((u) => u.id === fromId), ti = c.units.findIndex((u) => u.id === toId);
    if (fi < 0 || ti < 0 || fi === ti) return;
    const [m] = c.units.splice(fi, 1); c.units.splice(ti, 0, m);
  });

  /* ---- modes ---- */
  const enabled = C.modes || [];
  const ordered = [
    ...enabled.map(modeById).filter(Boolean),
    ...MODE_LIBRARY.filter((m) => !enabled.includes(m.id)),
  ];
  const isOn = (id) => enabled.includes(id);
  const toggleMode = (id) => up((c) => {
    if (c.modes.includes(id)) c.modes = c.modes.filter((x) => x !== id);
    else c.modes = [...c.modes, id];
  });
  const reorderModes = (fromId, toId) => up((c) => {
    const fi = c.modes.indexOf(fromId), ti = c.modes.indexOf(toId);
    if (fi < 0 || ti < 0 || fi === ti) return;
    const [m] = c.modes.splice(fi, 1); c.modes.splice(ti, 0, m);
  });
  const [openMode, setOpenMode] = useState(null);
  const metaOf = (id) => Object.assign({}, modeById(id).meta, (C.modeMeta || {})[id] || {});
  const setMeta = (id, k, v) => up((c) => {
    if (!c.modeMeta) c.modeMeta = {};
    const base = Object.assign({}, modeById(id).meta, c.modeMeta[id] || {});
    base[k] = v; c.modeMeta[id] = base;
  });

  /* ---- AI content items (categorised by thematic unit) ---- */
  const contentOf = (id) => (C.modeContent || {})[id] || [];
  const addItem = (id) => up((c) => {
    if (!c.modeContent) c.modeContent = {};
    const arr = (c.modeContent[id] || []).slice();
    arr.push({ id: newId(), unitId: (c.units[0] && c.units[0].id) || "", prompt: "", model: "" });
    c.modeContent[id] = arr;
  });
  const setItem = (id, itemId, k, v) => up((c) => {
    const arr = (c.modeContent && c.modeContent[id]) || [];
    const it = arr.find((x) => x.id === itemId); if (it) it[k] = v;
  });
  const delItem = (id, itemId) => up((c) => {
    if (c.modeContent && c.modeContent[id]) c.modeContent[id] = c.modeContent[id].filter((x) => x.id !== itemId);
  });
  const readFileInto = (id, itemId, file) => {
    if (!file) return; const r = new FileReader();
    r.onload = () => setItem(id, itemId, "prompt", String(r.result || ""));
    r.readAsText(file);
  };

  return (
    <div className="hx">
      <div className="hx-head">
        <div className="hx-head-badge"><SymIcon name={C.emblem || "column"} /></div>
        <div>
          <h2>{T(lang, "Σύνθεση Ιστορίας", "History Synthesis")}</h2>
          <p>{T(lang, "Στήσε το πρότυπο μελέτης — όλα ζωντανά στην προεπισκόπηση.", "Author the study template — everything updates the live hub.")}</p>
        </div>
      </div>

      {/* Α — identity */}
      <Section n="Α" name={T(lang, "Ταυτότητα", "Identity")} open={open.id} onToggle={() => tog("id")}
        meta={T(lang, C.title.gr, C.title.en)}>
        <div className="hx-field">
          <label>{T(lang, "Έμβλημα", "Emblem")}</label>
          <div className="hx-glyphs">
            {EMBLEM_CHOICES.map((g) => (
              <button key={g} type="button" className={"hx-glyph" + (C.emblem === g ? " on" : "")} onClick={() => up((c) => c.emblem = g)} title={g}><SymIcon name={g} /></button>
            ))}
          </div>
        </div>
        <BiField label={T(lang, "Eyebrow (μικρός τίτλος)", "Eyebrow (kicker)")} value={C.kicker}
          phGr="Θέματα Νεοελληνικής Ιστορίας" phEn="Topics in Modern Greek History"
          onGr={(v) => up((c) => c.kicker.gr = v)} onEn={(v) => up((c) => c.kicker.en = v)} />
        <BiField label={T(lang, "Τίτλος (Cinzel)", "Title (Cinzel)")} value={C.title} disp phGr="ΑΤΛΑΣ" phEn="ATLAS"
          onGr={(v) => up((c) => c.title.gr = v)} onEn={(v) => up((c) => c.title.en = v)} />
        <BiField label={T(lang, "Υπότιτλος", "Subtitle")} value={C.sub}
          onGr={(v) => up((c) => c.sub.gr = v)} onEn={(v) => up((c) => c.sub.en = v)} />
        <BiField label={T(lang, "Γραμμή ύλης (mono)", "Syllabus line (mono)")} value={C.cat}
          onGr={(v) => up((c) => c.cat.gr = v)} onEn={(v) => up((c) => c.cat.en = v)} />
      </Section>

      {/* Β — section labels */}
      <Section n="Β" name={T(lang, "Επικεφαλίδες", "Section labels")} open={open.lbl} onToggle={() => tog("lbl")}>
        <BiField label={T(lang, "§ Α — επικεφαλίδα ενοτήτων", "§ Α — units heading")} value={C.unitsHeading}
          onGr={(v) => up((c) => c.unitsHeading.gr = v)} onEn={(v) => up((c) => c.unitsHeading.en = v)} />
        <BiField label={T(lang, "§ Β — επικεφαλίδα μεθόδων", "§ Β — modes heading")} value={C.modesHeading}
          onGr={(v) => up((c) => c.modesHeading.gr = v)} onEn={(v) => up((c) => c.modesHeading.en = v)} />
        <BiField label={T(lang, "Κλείσιμο (italic)", "Footer line (italic)")} value={C.tagline} area
          onGr={(v) => up((c) => c.tagline.gr = v)} onEn={(v) => up((c) => c.tagline.en = v)} />
      </Section>

      {/* Γ — units */}
      <Section n="Γ" name={T(lang, "Θεματικές Ενότητες", "Thematic Units")} open={open.units} onToggle={() => tog("units")}
        meta={C.units.length + ""}>
        <div className="hx-hint">{T(lang, "Οι λατινικοί αριθμοί (I, II…) μπαίνουν αυτόματα κατά σειρά. Σύρε για αναδιάταξη.", "Roman numerals (I, II…) are assigned automatically by order. Drag to reorder.")}</div>
        <div className="hx-units">
          {C.units.map((u, i) => (
            <div key={u.id}
              className={"hx-unit" + (dragOver === u.id ? " dragover" : "")}
              onDragOver={(e) => { e.preventDefault(); setDragOver(u.id); }}
              onDragLeave={() => setDragOver((d) => d === u.id ? null : d)}
              onDrop={(e) => { e.preventDefault(); if (dragId.current) reorderUnits(dragId.current, u.id); dragId.current = null; setDragOver(null); }}>
              <span className="hx-grip" draggable
                onDragStart={(e) => { dragId.current = u.id; e.dataTransfer.effectAllowed = "move"; }}
                onDragEnd={() => { dragId.current = null; setDragOver(null); }}>⠿</span>
              <span className="hx-unit-rn">{toRoman(i + 1)}</span>
              <div className="hx-unit-body">
                <BiField label={T(lang, "Τίτλος", "Title")} value={u.t} disp
                  onGr={(v) => setU(u.id, ["t", "gr"], v)} onEn={(v) => setU(u.id, ["t", "en"], v)} />
                <BiField label={T(lang, "Περιγραφή", "Description")} value={u.desc} area
                  onGr={(v) => setU(u.id, ["desc", "gr"], v)} onEn={(v) => setU(u.id, ["desc", "en"], v)} />
                <BiField label={T(lang, "Ετικέτα πλήθους", "Count label")} value={u.cnt}
                  phGr="27 όροι" phEn="27 terms"
                  onGr={(v) => setU(u.id, ["cnt", "gr"], v)} onEn={(v) => setU(u.id, ["cnt", "en"], v)} />
              </div>
              <button type="button" className="hx-iconbtn" title={T(lang, "Διαγραφή", "Delete")} onClick={() => delUnit(u.id)}>✕</button>
            </div>
          ))}
        </div>
        <button type="button" className="hx-add" onClick={addUnit}>＋ {T(lang, "Προσθήκη ενότητας", "Add a unit")}</button>
      </Section>

      {/* Δ — study modes */}
      <Section n="Δ" name={T(lang, "Τρόποι Μελέτης", "Study Modes")} open={open.modes} onToggle={() => tog("modes")}
        meta={enabled.length + "/" + MODE_LIBRARY.length}>
        <div className="hx-hint">{T(lang, "Άναψε τους τρόπους που προσφέρει αυτό το μάθημα. Σύρε για σειρά· άνοιξε το βελάκι για να αλλάξεις την περιγραφή.", "Switch on the modes this subject offers. Drag to order; open the arrow to edit the caption.")}</div>
        <div className="hx-modes">
          {ordered.map((m) => {
            const on = isOn(m.id);
            const exp = openMode === m.id;
            const meta = metaOf(m.id);
            return (
              <div key={m.id}
                className={"hx-mode" + (on ? " on" : "") + (exp ? " expanded" : "") + (dragOver === ("m:" + m.id) ? " dragover" : "")}
                onDragOver={(e) => { if (!on) return; e.preventDefault(); setDragOver("m:" + m.id); }}
                onDragLeave={() => setDragOver((d) => d === ("m:" + m.id) ? null : d)}
                onDrop={(e) => { e.preventDefault(); if (dragId.current && on) reorderModes(dragId.current, m.id); dragId.current = null; setDragOver(null); }}>
                <div className="hx-mode-row">
                  {on && (
                    <span className="hx-grip" draggable
                      onDragStart={(e) => { dragId.current = m.id; e.dataTransfer.effectAllowed = "move"; }}
                      onDragEnd={() => { dragId.current = null; setDragOver(null); }}>⠿</span>
                  )}
                  <span className="hx-mode-ico"><SymIcon name={m.ico} /></span>
                  <span className="hx-mode-txt">
                    <span className="hx-mode-gr">{T(lang, m.gr, m.en)}</span>
                    <span className="hx-mode-en">{m.en}</span>
                  </span>
                  <span className={"hx-kind " + m.kind}>{T(lang, KIND_LABEL[m.kind].gr, KIND_LABEL[m.kind].en)}</span>
                  {m.kind === "ai" && contentOf(m.id).length > 0 && <span className="hx-citem-n">{contentOf(m.id).length}</span>}
                  {on && <button type="button" className="hx-mode-expand" onClick={() => setOpenMode(exp ? null : m.id)} title={T(lang, "Ρυθμίσεις", "Settings")}>›</button>}
                  <button type="button" className={"hx-switch" + (on ? " on" : "")} onClick={() => toggleMode(m.id)} aria-label="toggle"></button>
                </div>
                {on && (
                  <div className="hx-mode-cfg">
                    <div className="hx-cfg-label">{T(lang, "Περιγραφή (italic στην κάρτα)", "Caption (card italic)")}</div>
                    <BiField value={meta} onGr={(v) => setMeta(m.id, "gr", v)} onEn={(v) => setMeta(m.id, "en", v)} />
                    {m.kind === "ai" && (
                      <>
                        <div className="hx-cfg-label">{T(lang, "Περιεχόμενο · ανά θεματική ενότητα", "Content · by thematic unit")}</div>
                        <div className="hx-content">
                          {contentOf(m.id).map((it) => (
                            <div className="hx-citem" key={it.id}>
                              <div className="hx-citem-top">
                                <select className="hx-select" value={it.unitId} onChange={(e) => setItem(m.id, it.id, "unitId", e.target.value)}>
                                  {C.units.length ? C.units.map((u) => <option key={u.id} value={u.id}>{T(lang, u.t.gr, u.t.en)}</option>) : <option value="">{T(lang, "— καμία ενότητα —", "— no units —")}</option>}
                                </select>
                                <label className="hx-upload" title={T(lang, "Εισαγωγή .txt", "Import .txt")}>
                                  <input type="file" accept=".txt,text/plain" onChange={(e) => { readFileInto(m.id, it.id, e.target.files[0]); e.target.value = ""; }} />
                                  ↑ {T(lang, "Αρχείο", "Upload")}
                                </label>
                                <button type="button" className="hx-iconbtn" title={T(lang, "Διαγραφή", "Delete")} onClick={() => delItem(m.id, it.id)}>✕</button>
                              </div>
                              <textarea className="hx-input area" value={it.prompt} placeholder={T(lang, "Ερώτηση / πηγή / έννοια…", "Question / source / concept…")} onChange={(e) => setItem(m.id, it.id, "prompt", e.target.value)} />
                              <textarea className="hx-input area" value={it.model} placeholder={T(lang, "Ενδεικτική απάντηση (προαιρετικό)", "Model answer (optional)")} onChange={(e) => setItem(m.id, it.id, "model", e.target.value)} />
                            </div>
                          ))}
                        </div>
                        <button type="button" className="hx-add" onClick={() => addItem(m.id)}>＋ {T(lang, "Προσθήκη στοιχείου", "Add an item")}</button>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

window.ComposerPanel = ComposerPanel;
