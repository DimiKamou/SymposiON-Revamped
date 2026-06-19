/* ============================================================
   Trivia Synthesis — COMPOSER (admin author pane)
   Edits every field of `config` in both languages and writes
   back through `up(producer)`. Drives the live preview.
   ============================================================ */

/* bilingual two-input field */
function BiField({ label, value, onGr, onEn, serif, phGr, phEn }) {
  return (
    <div className="cx-field">
      {label && <label>{label}</label>}
      <div className="cx-bi">
        <span className="cx-inwrap"><span className="cx-tag">ΕΛ</span>
          <input className={"cx-input" + (serif ? " serif" : "")} value={value.gr || ""} placeholder={phGr} onChange={(e) => onGr(e.target.value)} />
        </span>
        <span className="cx-inwrap"><span className="cx-tag">EN</span>
          <input className={"cx-input" + (serif ? " serif" : "")} value={value.en || ""} placeholder={phEn} onChange={(e) => onEn(e.target.value)} />
        </span>
      </div>
    </div>
  );
}

function Section({ id, badge, name, meta, open, onToggle, children }) {
  return (
    <div className={"cx-sec" + (open ? " open" : "")}>
      <button type="button" className="cx-sec-h" onClick={onToggle}>
        <span className="cx-sec-badge">{badge}</span>
        <span className="cx-sec-name">{name}</span>
        {meta != null && <span className="cx-sec-meta">{meta}</span>}
        <span className="cx-sec-chev"><Glyph name="chevron" size={16} stroke={2} /></span>
      </button>
      <div className="cx-sec-body">{children}</div>
    </div>
  );
}

function ComposerPanel({ config, up, lang }) {
  const C = config;
  const [open, setOpen] = useState({ id: true, unit: false, secs: true, games: false });
  const tog = (k) => setOpen((o) => ({ ...o, [k]: !o[k] }));

  /* ---- token drag reorder ---- */
  const dragId = useRef(null);
  const [dragOver, setDragOver] = useState(null);
  const reorder = (arrKey, fromId, toId) => {
    up((c) => {
      const arr = c[arrKey];
      const fi = arr.findIndex((x) => (x.id || x) === fromId);
      const ti = arr.findIndex((x) => (x.id || x) === toId);
      if (fi < 0 || ti < 0 || fi === ti) return;
      const [m] = arr.splice(fi, 1); arr.splice(ti, 0, m);
    });
  };

  /* ---- section token ops ---- */
  const addTok = () => up((c) => c.sections.push(mkTok("", "")));
  const delTok = (id) => up((c) => { c.sections = c.sections.filter((t) => t.id !== id); });
  const setTok = (id, k, v) => up((c) => { const t = c.sections.find((x) => x.id === id); if (t) t[k] = v; });
  const applyPreset = (kind) => up((c) => {
    if (kind === "caps") c.sections = lettersToTokens(GREEK_CAPS), c.cols = 8;
    else if (kind === "lower") c.sections = lettersToTokens(GREEK_LOWER), c.cols = 8;
    else if (kind === "num12") c.sections = numbersToTokens(12), c.cols = 6;
    else if (kind === "num8") c.sections = numbersToTokens(8), c.cols = 8;
    else if (kind === "clear") c.sections = [];
  });

  /* ---- games ops ---- */
  const enabled = C.games || [];
  const ordered = [
    ...enabled.map(gameById).filter(Boolean),
    ...GAME_LIBRARY.filter((g) => !enabled.includes(g.id)),
  ];
  const isOn = (gid) => enabled.includes(gid);
  const fits = (g) => compatEngine(g, C.category || "");
  const toggleGame = (gid) => up((c) => {
    if (c.games.includes(gid)) c.games = c.games.filter((x) => x !== gid);
    else if (compatEngine(gameById(gid), c.category || "")) c.games = [...c.games, gid];
  });
  const setCategory = (v) => up((c) => { c.category = v; c.games = c.games.filter((id) => compatEngine(gameById(id), v)); });
  const [openGame, setOpenGame] = useState(null);
  const gcOf = (gid) => Object.assign(defGameCfg(gid), (C.gameCfg || {})[gid] || {});
  const setGc = (gid, producer) => up((c) => {
    if (!c.gameCfg) c.gameCfg = {};
    const base = Object.assign(defGameCfg(gid), c.gameCfg[gid] || {});
    producer(base);
    c.gameCfg[gid] = base;
  });
  const toggleIn = (arr, id) => arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id];

  const colsVal = C.cols || 8;

  return (
    <div className="cx">
      <div className="cx-head">
        <div className="cx-head-medal"><Glyph name={C.glyph || "amphora"} size={26} stroke={1.7} /></div>
        <div className="cx-head-txt">
          <h2>{T(lang, "Σύνθεση Trivia", "Trivia Synthesis")}</h2>
          <p>{T(lang, "Φτιάξε & επεξεργάσου το πρότυπο — όλα ζωντανά στην προεπισκόπηση.", "Author & edit the template — everything updates the live preview.")}</p>
        </div>
      </div>

      <div className="cx-body">
        {/* ── IDENTITY ── */}
        <Section id="id" badge="Α" open={open.id} onToggle={() => tog("id")}
          name={T(lang, "Ταυτότητα", "Identity")}
          meta={T(lang, C.titlePre.gr, C.titlePre.en) + " " + T(lang, C.titleEm.gr, C.titleEm.en)}>
          <div className="cx-field">
            <label>{T(lang, "Σύμβολο", "Emblem")}</label>
            <div className="cx-glyphs">
              {GLYPH_CHOICES.map((g) => (
                <button key={g} type="button" className={"cx-glyph" + (C.glyph === g ? " on" : "")} onClick={() => up((c) => c.glyph = g)} title={g}>
                  <Glyph name={g} size={24} stroke={1.7} />
                </button>
              ))}
            </div>
          </div>
          <BiField label={T(lang, "Eyebrow (μικρός τίτλος)", "Eyebrow (kicker)")} value={C.eyebrow}
            phGr="ΟΜΗΡΙΚΟ ΕΠΟΣ" phEn="HOMERIC EPIC"
            onGr={(v) => up((c) => c.eyebrow.gr = v)} onEn={(v) => up((c) => c.eyebrow.en = v)} />
          <div className="cx-row2">
            <BiField label={T(lang, "Τίτλος — πρόθεμα", "Title — prefix")} value={C.titlePre} serif
              onGr={(v) => up((c) => c.titlePre.gr = v)} onEn={(v) => up((c) => c.titlePre.en = v)} />
            <BiField label={T(lang, "Τίτλος — έμφαση", "Title — emphasis")} value={C.titleEm} serif phGr="Ἰλιάδας" phEn="Iliad"
              onGr={(v) => up((c) => c.titleEm.gr = v)} onEn={(v) => up((c) => c.titleEm.en = v)} />
          </div>
          <BiField label={T(lang, "Υπότιτλος", "Subtitle")} value={C.sub}
            onGr={(v) => up((c) => c.sub.gr = v)} onEn={(v) => up((c) => c.sub.en = v)} />
          <div className="cx-field">
            <label>{T(lang, "Κατηγορία ύλης · καθορίζει τα συμβατά παιχνίδια", "Content category · gates compatible games")}</label>
            <div className="cx-presets" style={{ marginBottom: 0 }}>
              {CATEGORIES.map((cat) => (
                <button key={cat.id || "gen"} type="button" className="cx-preset" style={(C.category || "") === cat.id ? { borderStyle: "solid", borderColor: "var(--gold-dk)", color: "var(--gold-dk)", background: "rgba(196,164,72,.1)" } : null} onClick={() => setCategory(cat.id)}>{T(lang, cat.gr, cat.en)}</button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── UNIT LANGUAGE ── */}
        <Section id="unit" badge="Β" open={open.unit} onToggle={() => tog("unit")}
          name={T(lang, "Ορολογία ύλης", "Content wording")}
          meta={T(lang, C.unit.gr, C.unit.en)}>
          <BiField label={T(lang, "Τίτλος βήματος επιλογής", "Selection heading")} value={C.heading}
            phGr="Επιλογή Ραψωδιών" phEn="Select Rhapsodies"
            onGr={(v) => up((c) => c.heading.gr = v)} onEn={(v) => up((c) => c.heading.en = v)} />
          <BiField label={T(lang, "Οδηγία", "Helper note")} value={C.note}
            onGr={(v) => up((c) => c.note.gr = v)} onEn={(v) => up((c) => c.note.en = v)} />
          <div className="cx-row2">
            <BiField label={T(lang, "Μονάδα — ενικός", "Unit — singular")} value={C.unit} phGr="Ραψωδία" phEn="Rhapsody"
              onGr={(v) => up((c) => c.unit.gr = v)} onEn={(v) => up((c) => c.unit.en = v)} />
            <BiField label={T(lang, "Μονάδα — πληθυντικός", "Unit — plural")} value={C.units} phGr="ραψωδίες" phEn="rhapsodies"
              onGr={(v) => up((c) => c.units.gr = v)} onEn={(v) => up((c) => c.units.en = v)} />
          </div>
          <BiField label={T(lang, "Κουμπί «όλη η ύλη»", "“Whole work” button")} value={C.whole}
            phGr="Ολόκληρη η Ιλιάδα" phEn="The whole Iliad"
            onGr={(v) => up((c) => c.whole.gr = v)} onEn={(v) => up((c) => c.whole.en = v)} />
        </Section>

        {/* ── SECTIONS ── */}
        <Section id="secs" badge="Γ" open={open.secs} onToggle={() => tog("secs")}
          name={T(lang, "Ενότητες", "Sections")}
          meta={(C.sections.length) + " " + T(lang, "τεμ.", "items")}>
          <div className="cx-hint">{T(lang, "Πρόσθεσε, μετονόμασε, ξαναδιάταξε ή σβήσε. Μπορεί να είναι γράμματα (Α–Ω), αριθμοί, ή ονόματα (Πρόλογος, θεματική ενότητα…).", "Add, rename, reorder or delete. Tokens can be letters (Α–Ω), numbers, or names (Prologue, a thematic unit…).")}</div>
          <div className="cx-presets">
            <button type="button" className="cx-preset" onClick={() => applyPreset("caps")}>Α–Ω</button>
            <button type="button" className="cx-preset" onClick={() => applyPreset("lower")}>α–ω</button>
            <button type="button" className="cx-preset" onClick={() => applyPreset("num12")}>1–12</button>
            <button type="button" className="cx-preset" onClick={() => applyPreset("num8")}>1–8</button>
            <button type="button" className="cx-preset" onClick={() => applyPreset("clear")}>{T(lang, "Καθάρισμα", "Clear")}</button>
          </div>

          <div className="cx-field">
            <label>{T(lang, "Στήλες πλέγματος", "Grid columns")}</label>
            <div className="cx-presets" style={{ marginBottom: 0 }}>
              {[2, 3, 4, 5, 6, 7, 8].map((n) => (
                <button key={n} type="button" className={"cx-preset" + (colsVal === n ? " on-col" : "")} style={colsVal === n ? { borderStyle: "solid", borderColor: "var(--gold-dk)", color: "var(--gold-dk)", background: "rgba(196,164,72,.1)" } : null} onClick={() => up((c) => c.cols = n)}>{n}</button>
              ))}
            </div>
          </div>

          <div className="cx-tokens">
            {C.sections.map((tok, i) => (
              <div key={tok.id}
                className={"cx-token" + (dragOver === tok.id ? " dragover" : "")}
                onDragOver={(e) => { e.preventDefault(); setDragOver(tok.id); }}
                onDragLeave={() => setDragOver((d) => d === tok.id ? null : d)}
                onDrop={(e) => { e.preventDefault(); if (dragId.current) reorder("sections", dragId.current, tok.id); dragId.current = null; setDragOver(null); }}>
                <span className="cx-grip" draggable
                  onDragStart={(e) => { dragId.current = tok.id; e.dataTransfer.effectAllowed = "move"; }}
                  onDragEnd={() => { dragId.current = null; setDragOver(null); }}>
                  <Glyph name="grip" size={16} stroke={1.6} />
                </span>
                <span className="cx-tnum">{i + 1}</span>
                <span className="cx-inwrap" style={{ flex: 1 }}><span className="cx-tag">ΕΛ</span>
                  <input className="cx-input cx-tin-gr" value={tok.gr} placeholder="Α" onChange={(e) => setTok(tok.id, "gr", e.target.value)} />
                </span>
                <span className="cx-inwrap" style={{ flex: 1 }}><span className="cx-tag">EN</span>
                  <input className="cx-input cx-tin-en" value={tok.en} placeholder="A" onChange={(e) => setTok(tok.id, "en", e.target.value)} />
                </span>
                <button type="button" className="cx-iconbtn" title={T(lang, "Διαγραφή", "Delete")} onClick={() => delTok(tok.id)}><Glyph name="trash" size={16} stroke={1.7} /></button>
              </div>
            ))}
          </div>
          <button type="button" className="cx-add" onClick={addTok}><Glyph name="plus" size={15} stroke={2} />{T(lang, "Προσθήκη ενότητας", "Add a section")}</button>
        </Section>

        {/* ── GAMES ── */}
        <Section id="games" badge="Δ" open={open.games} onToggle={() => tog("games")}
          name={T(lang, "Προτεινόμενα παιχνίδια", "Suggested games")}
          meta={enabled.length + "/" + GAME_LIBRARY.length}>
          <div className="cx-hint">{T(lang, "Άναψε όσα παιχνίδια προτείνεις. Σύρε για σειρά· πάτα το βελάκι για ρυθμίσεις (παίκτες, τύποι, βοήθειες).", "Switch on the games you suggest. Drag to order; open the arrow for settings (players, types, lifelines).")}</div>
          <div className="cx-games">
            {ordered.map((g) => {
              const on = isOn(g.id);
              const ok = fits(g);
              const gc = gcOf(g.id);
              const exp = openGame === g.id;
              return (
                <div key={g.id}
                  className={"cx-game" + (on ? " on" : "") + (exp ? " expanded" : "") + (!ok ? " locked" : "") + (dragOver === ("g:" + g.id) ? " dragover" : "")}
                  onDragOver={(e) => { if (!on) return; e.preventDefault(); setDragOver("g:" + g.id); }}
                  onDragLeave={() => setDragOver((d) => d === ("g:" + g.id) ? null : d)}
                  onDrop={(e) => { e.preventDefault(); if (dragId.current && on) reorder("games", dragId.current, g.id); dragId.current = null; setDragOver(null); }}>
                  <div className="cx-game-row">
                    {on && (
                      <span className="cx-grip" draggable
                        onDragStart={(e) => { dragId.current = g.id; e.dataTransfer.effectAllowed = "move"; }}
                        onDragEnd={() => { dragId.current = null; setDragOver(null); }}>
                        <Glyph name="grip" size={16} stroke={1.6} />
                      </span>
                    )}
                    <span className="cx-game-medal"><Glyph name={g.glyph} size={20} stroke={1.7} /></span>
                    <span className="cx-game-txt">
                      <span className="cx-game-name">{T(lang, g.gr, g.en)}</span>
                      <span className="cx-game-desc">{!ok ? T(lang, "Δεν ταιριάζει με την κατηγορία · " + (g.cats || []).join(" / "), "Not available for this category · " + (g.cats || []).join(" / ")) : T(lang, g.desc.gr, g.desc.en)}</span>
                    </span>
                    <span className="cx-game-tag">{T(lang, g.tag.gr, g.tag.en)}</span>
                    {on && <button type="button" className="cx-game-expand" onClick={() => setOpenGame(exp ? null : g.id)} title={T(lang, "Ρυθμίσεις", "Settings")}><Glyph name="chevron" size={16} stroke={2} /></button>}
                    <button type="button" className={"cx-switch" + (on ? " on" : "")} disabled={!ok && !on} onClick={() => toggleGame(g.id)} aria-label="toggle"></button>
                  </div>

                  {on && (
                    <div className="cx-game-cfg">
                      <div className="cx-cfg-label">{g.id === "tow" ? T(lang, "Ονόματα ομάδων", "Team names") : T(lang, g.players === 1 ? "Όνομα παίκτη" : "Ονόματα παικτών", g.players === 1 ? "Player name" : "Player names")}</div>
                      <BiField value={gc.p1} onGr={(v) => setGc(g.id, (b) => b.p1.gr = v)} onEn={(v) => setGc(g.id, (b) => b.p1.en = v)} />
                      {g.players === 2 && <BiField value={gc.p2} onGr={(v) => setGc(g.id, (b) => b.p2.gr = v)} onEn={(v) => setGc(g.id, (b) => b.p2.en = v)} />}

                      <div className="cx-cfg-label">{T(lang, "Τύποι ερωτήσεων", "Question types")}</div>
                      <div className="cx-chips">
                        {FORMATS.map((f) => (
                          <button key={f.id} type="button" className={"cx-chip" + (gc.formats.includes(f.id) ? " on" : "")} onClick={() => setGc(g.id, (b) => b.formats = toggleIn(b.formats, f.id))}>
                            <span className="cx-chip-ico"><Glyph name={f.glyph} size={16} stroke={1.7} /></span>{T(lang, f.gr, f.en)}
                          </button>
                        ))}
                      </div>

                      <div className="cx-cfg-label">{T(lang, "Βοήθειες", "Lifelines")}</div>
                      <div className="cx-chips">
                        {HELPS.map((h) => (
                          <button key={h.id} type="button" className={"cx-chip" + (gc.helps.includes(h.id) ? " on" : "")} onClick={() => setGc(g.id, (b) => b.helps = toggleIn(b.helps, h.id))}>
                            <b style={{ fontSize: 11, letterSpacing: ".03em" }}>{h.label}</b>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}

window.ComposerPanel = ComposerPanel;
window.BiField = BiField;
