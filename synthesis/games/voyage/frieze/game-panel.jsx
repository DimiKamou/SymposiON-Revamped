/* ════════════════════════════════════════════════════════════════════
   Η Ζωφόρος — game panel. Two modes (Διάλογος · Κουίζ) with five item
   types, student players + scoring, and a passcode-gated admin editor
   with Export/Import. Defines window.ZG.GamePanel.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const { useState, useEffect, useMemo, useRef } = React;
  const ZG = window.ZG;

  const TYPES = [
    { k: 'tf',    label: 'Σωστό–Λάθος' },
    { k: 'mc',    label: 'Πολλαπλής επιλογής' },
    { k: 'match', label: 'Αντιστοίχιση' },
    { k: 'order', label: 'Σειρά γεγονότων' },
    { k: 'open',  label: 'Ανοιχτή' },
  ];
  const typeLabel = (k) => (TYPES.find(t => t.k === k) || { label: k }).label;
  const Glyph = ({ r, big }) =>
    <span className={`fv-g ${String(r).length > 1 ? 'rng' : ''} ${big ? 'big' : ''}`}>{r}</span>;
  function shuffle(a) {
    const x = a.slice();
    for (let i = x.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [x[i], x[j]] = [x[j], x[i]]; }
    return x;
  }
  const Feedback = ({ ok, why, quote }) => (
    <div className={`fv-fb ${ok ? 'ok' : 'no'}`}>
      <div className="fv-fbhead">{ok ? '✓ Σωστά' : '✕ Όχι ακριβώς'}</div>
      {why && <p className="fv-why">{why}</p>}
      {quote && <div className="fv-quote">{quote}</div>}
    </div>
  );

  /* ════ PLAYERS ═══════════════════════════════════════════════════ */
  // choice-based (dialogue + multiple choice)
  function ChoicePlayer({ item, isDialogue, onResult }) {
    const [pick, setPick] = useState(null);
    const choose = (i) => { if (pick !== null) return; setPick(i); onResult(i === item.correct); };
    return (
      <div className="fv-play">
        {isDialogue && item.cue && <div className="fv-cue">{item.cue}</div>}
        <p className="fv-prompt">{item.prompt || item.q}</p>
        <div className="fv-opts">
          {(item.options || []).map((o, i) => {
            let st = '';
            if (pick !== null) { if (i === item.correct) st = 'correct'; else if (i === pick) st = 'wrong'; }
            return (
              <button key={i} className={`fv-opt ${st}`} disabled={pick !== null} onClick={() => choose(i)}>
                <span className="fv-optk">{String.fromCharCode(913 + i)}</span>{o}
              </button>
            );
          })}
        </div>
        {pick !== null && <Feedback ok={pick === item.correct} why={item.why} quote={isDialogue ? item.quote : ''} />}
        {pick !== null && <button className="fv-retry" onClick={() => setPick(null)}>↺ Ξανά</button>}
      </div>
    );
  }

  function TFPlayer({ item, onResult }) {
    const [pick, setPick] = useState(null);
    const choose = (v) => { if (pick !== null) return; setPick(v); onResult(v === !!item.answer); };
    return (
      <div className="fv-play">
        <p className="fv-prompt">{item.q}</p>
        <div className="fv-tf">
          {[{ v: true, t: 'Σωστό' }, { v: false, t: 'Λάθος' }].map(b => {
            let st = '';
            if (pick !== null) { if (b.v === !!item.answer) st = 'correct'; else if (b.v === pick) st = 'wrong'; }
            return <button key={String(b.v)} className={`fv-tfb ${st}`} disabled={pick !== null} onClick={() => choose(b.v)}>{b.t}</button>;
          })}
        </div>
        {pick !== null && <Feedback ok={pick === !!item.answer} why={item.why} />}
        {pick !== null && <button className="fv-retry" onClick={() => setPick(null)}>↺ Ξανά</button>}
      </div>
    );
  }

  function OpenPlayer({ item, onResult }) {
    const [show, setShow] = useState(false);
    const reveal = () => { setShow(true); onResult(true); };
    return (
      <div className="fv-play">
        <p className="fv-prompt">{item.q}</p>
        {item.a ? (show
          ? <div className="fv-a">{item.a}</div>
          : <button className="fv-reveal" onClick={reveal}>Αποκάλυψε την απάντηση</button>
        ) : <div className="fv-empty" style={{ textAlign: 'left', padding: '4px 0' }}>—</div>}
      </div>
    );
  }

  function MatchPlayer({ item, onResult }) {
    const pairs = item.pairs || [];
    const rights = useMemo(() => shuffle(pairs.map(p => p.r)), [item]);
    const [sel, setSel] = useState({});
    const [checked, setChecked] = useState(false);
    const set = (i, v) => setSel(s => ({ ...s, [i]: v }));
    const allOk = pairs.every((p, i) => sel[i] === p.r);
    const check = () => { setChecked(true); onResult(allOk); };
    return (
      <div className="fv-play">
        {item.q && <p className="fv-prompt">{item.q}</p>}
        <div className="fv-match">
          {pairs.map((p, i) => {
            const ok = checked && sel[i] === p.r;
            const bad = checked && sel[i] !== p.r;
            return (
              <div className={`fv-mrow ${ok ? 'ok' : ''} ${bad ? 'no' : ''}`} key={i}>
                <span className="fv-ml">{p.l}</span>
                <span className="fv-marrow">→</span>
                <select className="fv-msel" value={sel[i] || ''} disabled={checked} onChange={e => set(i, e.target.value)}>
                  <option value="" disabled>— διάλεξε —</option>
                  {rights.map((r, k) => <option key={k} value={r}>{r}</option>)}
                </select>
              </div>
            );
          })}
        </div>
        {!checked
          ? <button className="fv-check" disabled={Object.keys(sel).length < pairs.length} onClick={check}>Έλεγχος</button>
          : <>
              <Feedback ok={allOk} why={item.why} />
              <button className="fv-retry" onClick={() => { setSel({}); setChecked(false); }}>↺ Ξανά</button>
            </>}
      </div>
    );
  }

  function OrderPlayer({ item, onResult }) {
    const correct = item.items || [];
    const start = useMemo(() => {
      if (correct.length < 2) return correct.slice();
      let s = shuffle(correct);
      if (s.join('|') === correct.join('|')) s = shuffle(correct);
      return s;
    }, [item]);
    const [arr, setArr] = useState(start);
    const [checked, setChecked] = useState(false);
    useEffect(() => { setArr(start); setChecked(false); }, [start]);
    const move = (i, d) => {
      if (checked) return;
      const j = i + d; if (j < 0 || j >= arr.length) return;
      const n = arr.slice(); [n[i], n[j]] = [n[j], n[i]]; setArr(n);
    };
    const allOk = arr.join('|') === correct.join('|');
    const check = () => { setChecked(true); onResult(allOk); };
    return (
      <div className="fv-play">
        {item.q && <p className="fv-prompt">{item.q}</p>}
        <ol className="fv-order">
          {arr.map((it, i) => {
            const ok = checked && it === correct[i];
            const bad = checked && it !== correct[i];
            return (
              <li className={`fv-orow ${ok ? 'ok' : ''} ${bad ? 'no' : ''}`} key={it + i}>
                <span className="fv-onum">{i + 1}</span>
                <span className="fv-otext">{it}</span>
                <span className="fv-omove">
                  <button onClick={() => move(i, -1)} disabled={checked || i === 0} aria-label="πάνω">▲</button>
                  <button onClick={() => move(i, 1)} disabled={checked || i === arr.length - 1} aria-label="κάτω">▼</button>
                </span>
              </li>
            );
          })}
        </ol>
        {!checked
          ? <button className="fv-check" onClick={check}>Έλεγχος</button>
          : <>
              <Feedback ok={allOk} why={item.why || (allOk ? '' : 'Η σωστή σειρά: ' + correct.join(' · '))} />
              <button className="fv-retry" onClick={() => { setArr(start); setChecked(false); }}>↺ Ξανά</button>
            </>}
      </div>
    );
  }

  function PlayItem({ item, mode, onResult }) {
    if (mode === 'dialogue') return <ChoicePlayer item={item} isDialogue onResult={onResult} />;
    switch (item.type) {
      case 'tf': return <TFPlayer item={item} onResult={onResult} />;
      case 'mc': return <ChoicePlayer item={item} onResult={onResult} />;
      case 'match': return <MatchPlayer item={item} onResult={onResult} />;
      case 'order': return <OrderPlayer item={item} onResult={onResult} />;
      default: return <OpenPlayer item={item} onResult={onResult} />;
    }
  }

  /* ════ EDITOR FIELDS ═════════════════════════════════════════════ */
  const Field = ({ label, children }) => (
    <label className="fv-field"><span className="fv-fl">{label}</span>{children}</label>
  );
  const TA = (p) => <textarea className="fv-input" rows={p.rows || 2} {...p} />;

  // editable list of strings; optional radio to mark the correct one
  function ListEditor({ items, onChange, correct, onCorrect, placeholder }) {
    const set = (i, v) => { const n = items.slice(); n[i] = v; onChange(n); };
    const add = () => onChange([...items, '']);
    const del = (i) => { onChange(items.filter((_, k) => k !== i)); if (onCorrect && correct === i) onCorrect(0); };
    return (
      <div className="fv-listed">
        {items.map((v, i) => (
          <div className="fv-led" key={i}>
            {onCorrect && <input type="radio" className="fv-radio" checked={correct === i} onChange={() => onCorrect(i)} title="σωστή" />}
            <input className="fv-input fv-inl" value={v} placeholder={placeholder} onChange={e => set(i, e.target.value)} />
            <button className="fv-mini" onClick={() => del(i)} title="Διαγραφή">×</button>
          </div>
        ))}
        <button className="fv-addmini" onClick={add}>+ προσθήκη</button>
      </div>
    );
  }

  function PairEditor({ pairs, onChange }) {
    const set = (i, key, v) => { const n = pairs.map(p => ({ ...p })); n[i][key] = v; onChange(n); };
    const add = () => onChange([...pairs, { l: '', r: '' }]);
    const del = (i) => onChange(pairs.filter((_, k) => k !== i));
    return (
      <div className="fv-listed">
        {pairs.map((p, i) => (
          <div className="fv-led" key={i}>
            <input className="fv-input fv-inl" value={p.l} placeholder="στοιχείο" onChange={e => set(i, 'l', e.target.value)} />
            <span className="fv-marrow">→</span>
            <input className="fv-input fv-inl" value={p.r} placeholder="ταίρι" onChange={e => set(i, 'r', e.target.value)} />
            <button className="fv-mini" onClick={() => del(i)} title="Διαγραφή">×</button>
          </div>
        ))}
        <button className="fv-addmini" onClick={add}>+ ζεύγος</button>
      </div>
    );
  }

  // a blank item per (mode,type)
  function blank(mode, type) {
    if (mode === 'dialogue') return { cue: '', prompt: '', options: ['', ''], correct: 0, why: '', quote: '' };
    switch (type) {
      case 'tf': return { type: 'tf', q: '', answer: true, why: '' };
      case 'mc': return { type: 'mc', q: '', options: ['', ''], correct: 0, why: '' };
      case 'match': return { type: 'match', q: '', pairs: [{ l: '', r: '' }, { l: '', r: '' }], why: '' };
      case 'order': return { type: 'order', q: '', items: ['', ''], why: '' };
      default: return { type: 'open', q: '', a: '' };
    }
  }

  function ItemEditor({ mode, draft, setDraft, onSave, onCancel }) {
    const up = (patch) => setDraft({ ...draft, ...patch });
    const type = draft.type || 'open';
    return (
      <div className="fv-form">
        {mode === 'dialogue' ? (
          <>
            <Field label="Σκηνικό / αφορμή"><TA value={draft.cue} placeholder="Τι συμβαίνει τη στιγμή που μιλά ο ήρωας…" onChange={e => up({ cue: e.target.value })} /></Field>
            <Field label="Ερώτηση"><TA value={draft.prompt} placeholder="Πώς απαντά / τι σκέφτεται ο ήρωας;" onChange={e => up({ prompt: e.target.value })} /></Field>
            <Field label="Επιλογές (σημείωσε τη σωστή)">
              <ListEditor items={draft.options} onChange={v => up({ options: v })} correct={draft.correct} onCorrect={i => up({ correct: i })} placeholder="απάντηση…" />
            </Field>
            <Field label="Γιατί (η σκέψη του ήρωα)"><TA value={draft.why} placeholder="Τι αποκαλύπτει αυτή η επιλογή για τον τρόπο σκέψης του…" onChange={e => up({ why: e.target.value })} /></Field>
            <Field label="Αρχαίο κείμενο (προαιρετικό)"><TA value={draft.quote} placeholder="ο στίχος στον οποίο στηρίζεται…" onChange={e => up({ quote: e.target.value })} /></Field>
          </>
        ) : (
          <>
            <Field label="Τύπος">
              <div className="fv-typesel">
                {TYPES.map(t => (
                  <button key={t.k} className={`fv-tchip ${type === t.k ? 'on' : ''}`}
                          onClick={() => setDraft({ ...blank('trivia', t.k), q: draft.q || '', why: draft.why || '' })}>{t.label}</button>
                ))}
              </div>
            </Field>
            <Field label={type === 'tf' ? 'Πρόταση' : type === 'open' ? 'Ερώτηση' : 'Εκφώνηση'}>
              <TA value={draft.q} placeholder={type === 'tf' ? 'Δήλωση που κρίνεται…' : 'Η ερώτηση…'} onChange={e => up({ q: e.target.value })} />
            </Field>
            {type === 'tf' && (
              <Field label="Σωστή απάντηση">
                <div className="fv-tf fv-tfedit">
                  <button className={`fv-tfb ${draft.answer ? 'correct' : ''}`} onClick={() => up({ answer: true })}>Σωστό</button>
                  <button className={`fv-tfb ${!draft.answer ? 'correct' : ''}`} onClick={() => up({ answer: false })}>Λάθος</button>
                </div>
              </Field>
            )}
            {type === 'mc' && (
              <Field label="Επιλογές (σημείωσε τη σωστή)">
                <ListEditor items={draft.options} onChange={v => up({ options: v })} correct={draft.correct} onCorrect={i => up({ correct: i })} placeholder="επιλογή…" />
              </Field>
            )}
            {type === 'match' && (
              <Field label="Ζεύγη αντιστοίχισης"><PairEditor pairs={draft.pairs} onChange={v => up({ pairs: v })} /></Field>
            )}
            {type === 'order' && (
              <Field label="Γεγονότα (με τη σωστή σειρά)"><ListEditor items={draft.items} onChange={v => up({ items: v })} placeholder="γεγονός…" /></Field>
            )}
            {type === 'open' && (
              <Field label="Απάντηση"><TA value={draft.a} placeholder="η απάντηση…" onChange={e => up({ a: e.target.value })} /></Field>
            )}
            {type !== 'open' && (
              <Field label="Επεξήγηση (προαιρετικό)"><TA value={draft.why} placeholder="γιατί…" onChange={e => up({ why: e.target.value })} /></Field>
            )}
          </>
        )}
        <div className="fv-fbtns">
          <button className="fv-save" onClick={onSave}>Αποθήκευση</button>
          <button className="fv-cancel" onClick={onCancel}>Άκυρο</button>
        </div>
      </div>
    );
  }

  const summary = (mode, it) => {
    if (mode === 'dialogue') return it.prompt || it.cue || '(διάλογος)';
    return it.q || '(ερώτηση)';
  };

  /* ════ ADMIN EDITOR LIST ═════════════════════════════════════════ */
  function Editor({ index, station, mode, onChange }) {
    const [list, setList] = useState(() => ZG.getContent(index, station, mode));
    const [editing, setEditing] = useState(null);   // idx | -1 (new) | null
    const [draft, setDraft] = useState(null);

    const persist = (next) => { setList(next); ZG.setContent(index, mode, next); onChange && onChange(); };
    const startNew = () => { setDraft(blank(mode, 'tf')); setEditing(-1); };
    const startEdit = (i) => { setDraft({ ...list[i] }); setEditing(i); };
    const cancel = () => { setEditing(null); setDraft(null); };
    const saveItem = () => {
      const next = editing === -1 ? [...list, draft] : list.map((x, k) => k === editing ? draft : x);
      persist(next); cancel();
    };
    const del = (i) => persist(list.filter((_, k) => k !== i));
    const resetSeed = () => { ZG.resetContent(index, mode); const s = ZG.getContent(index, station, mode); setList(s); onChange && onChange(); };

    return (
      <div className="fv-edit">
        <div className="fv-qlist">
          {list.map((it, i) => (
            <div className="fv-qitem" key={i}>
              <div className="fv-qrow">
                <span className="fv-qnum">{i + 1}</span>
                <div className="fv-qbody">
                  {mode === 'trivia' && <span className="fv-typetag">{typeLabel(it.type)}</span>}
                  <p className="fv-q">{summary(mode, it)}</p>
                </div>
                <div className="fv-qtools">
                  <button onClick={() => startEdit(i)} title="Επεξεργασία">✎</button>
                  <button onClick={() => del(i)} title="Διαγραφή">×</button>
                </div>
              </div>
            </div>
          ))}
          {!list.length && editing === null && <div className="fv-empty">Καμία εγγραφή ακόμη.</div>}
        </div>
        {editing !== null
          ? <ItemEditor mode={mode} draft={draft} setDraft={setDraft} onSave={saveItem} onCancel={cancel} />
          : <div className="fv-editbtns">
              <button className="fv-add" onClick={startNew}>+ Προσθήκη {mode === 'dialogue' ? 'διαλόγου' : 'ερώτησης'}</button>
              <button className="fv-resetseed" onClick={resetSeed} title="Επαναφορά στο αρχικό περιεχόμενο">↺ Αρχικά</button>
            </div>}
      </div>
    );
  }

  /* ════ STUDENT MODE BODY ═════════════════════════════════════════ */
  function Player({ index, station, mode, onChange }) {
    const list = ZG.getContent(index, station, mode);
    const score = ZG.modeScore(index, station, mode);
    const result = (idx, ok) => { ZG.markCorrect(index, mode, idx, ok); onChange && onChange(); };
    if (!list.length) return <div className="fv-empty">Δεν υπάρχει ακόμη περιεχόμενο εδώ.</div>;
    return (
      <div className="fv-playlist">
        {list.map((it, i) => (
          <div className="fv-pcard" key={i}>
            <div className="fv-pcardhead">
              <span className="fv-qnum">{i + 1}</span>
              {mode === 'trivia' && <span className="fv-typetag">{typeLabel(it.type)}</span>}
            </div>
            <PlayItem item={it} mode={mode} onResult={(ok) => result(i, ok)} />
          </div>
        ))}
        <div className="fv-score">Σωστά: <b>{score.done}</b> / {score.total}</div>
      </div>
    );
  }

  /* ════ ADMIN BAR (auth + export/import) ══════════════════════════ */
  function AdminBar({ adminPass, admin, setAdmin, view, setView, stations }) {
    const [asking, setAsking] = useState(false);
    const [pass, setPass] = useState('');
    const [err, setErr] = useState(false);
    const fileRef = useRef(null);

    const tryLogin = () => { if (ZG.login(pass, adminPass)) { setAdmin(true); setView('edit'); setAsking(false); setPass(''); setErr(false); } else setErr(true); };
    const doExport = () => {
      const blob = new Blob([JSON.stringify(ZG.exportAll(stations), null, 2)], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
      a.download = 'zofatos-content.json'; a.click(); URL.revokeObjectURL(a.href);
    };
    const doImport = (e) => {
      const f = e.target.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { try { if (ZG.importAll(JSON.parse(rd.result))) location.reload(); else alert('Μη έγκυρο αρχείο.'); } catch (x) { alert('Σφάλμα ανάγνωσης.'); } };
      rd.readAsText(f); e.target.value = '';
    };

    if (!admin) {
      return (
        <div className="fv-adminzone">
          {!asking
            ? <button className="fv-keybtn" onClick={() => setAsking(true)} title="Διαχείριση εκπαιδευτικού">🔑 Διαχείριση</button>
            : <div className="fv-passrow">
                <input className="fv-input fv-passin" type="password" placeholder="Κωδικός" value={pass}
                       autoFocus onChange={e => { setPass(e.target.value); setErr(false); }}
                       onKeyDown={e => { if (e.key === 'Enter') tryLogin(); }} />
                <button className="fv-save" onClick={tryLogin}>Είσοδος</button>
                <button className="fv-cancel" onClick={() => { setAsking(false); setErr(false); }}>×</button>
                {err && <span className="fv-passerr">λάθος</span>}
              </div>}
        </div>
      );
    }
    return (
      <div className="fv-adminzone on">
        <div className="fv-adminview">
          <button className={`fv-vtab ${view === 'edit' ? 'on' : ''}`} onClick={() => setView('edit')}>✎ Επεξεργασία</button>
          <button className={`fv-vtab ${view === 'play' ? 'on' : ''}`} onClick={() => setView('play')}>▶ Δοκιμή</button>
        </div>
        <div className="fv-adminacts">
          <button className="fv-ghost" onClick={doExport} title="Κατέβασε όλο το περιεχόμενο">⤓ Εξαγωγή</button>
          <button className="fv-ghost" onClick={() => fileRef.current.click()} title="Φόρτωσε αρχείο περιεχομένου">⤒ Εισαγωγή</button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={doImport} />
          <button className="fv-ghost" onClick={() => { ZG.logout(); setAdmin(false); setView('play'); }}>Έξοδος</button>
        </div>
      </div>
    );
  }

  /* ════ PANEL SHELL ═══════════════════════════════════════════════ */
  function GamePanel({ index, station, unit, adminPass, onClose, onChange }) {
    const [mode, setMode] = useState('dialogue');
    const [admin, setAdmin] = useState(ZG.isAdmin());
    const [view, setView] = useState(ZG.isAdmin() ? 'edit' : 'play');
    const [tick, setTick] = useState(0);              // re-read counts/score
    const bump = () => { setTick(t => t + 1); onChange && onChange(); };
    const label = station.rlabel || `${unit} ${station.r}`;
    const nDlg = ZG.getContent(index, station, 'dialogue').length;
    const nTrv = ZG.getContent(index, station, 'trivia').length;

    useEffect(() => {
      const onKey = (e) => { if (e.key === 'Escape') onClose(); };
      window.addEventListener('keydown', onKey);
      const prev = document.body.style.overflow; document.body.style.overflow = 'hidden';
      return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
    }, [onClose]);

    const editMode = admin && view === 'edit';
    const Body = editMode ? Editor : Player;

    return (
      <div className="fv-modal" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
        <div className="fv-panel" role="dialog" aria-modal="true" aria-label={label}>
          <button className="fv-x" onClick={onClose} aria-label="Κλείσιμο">×</button>
          <div className="fv-pmedal"><Glyph r={station.r} big /></div>
          <div className="fv-phead">
            <div className="fv-ptag">{label}</div>
            <div className="fv-ptitle">{station.t}</div>
            <div className="fv-pmeta">{station.reg} · <b>{station.ch}</b></div>
          </div>

          <div className="fv-tabs">
            <button className={`fv-tab ${mode === 'dialogue' ? 'on' : ''}`} onClick={() => setMode('dialogue')}>
              Διάλογος<span className="fv-tcount">{nDlg}</span>
            </button>
            <button className={`fv-tab ${mode === 'trivia' ? 'on' : ''}`} onClick={() => setMode('trivia')}>
              Κουίζ<span className="fv-tcount">{nTrv}</span>
            </button>
          </div>

          <div className="fv-modehint">
            {mode === 'dialogue'
              ? 'Διάλεξε την ατάκα που θα έλεγε ο ήρωας — και δες τη σκέψη του.'
              : 'Σωστό–Λάθος · πολλαπλής · αντιστοίχιση · σειρά γεγονότων.'}
          </div>

          <Body key={mode + (editMode ? 'E' : 'P')} index={index} station={station} mode={mode} onChange={bump} />

          <AdminBar adminPass={adminPass} admin={admin} setAdmin={setAdmin}
                    view={view} setView={setView} stations={window.VOYAGE.stations} />

          <span hidden data-tick={tick} />
        </div>
      </div>
    );
  }

  ZG.GamePanel = GamePanel;
})();
