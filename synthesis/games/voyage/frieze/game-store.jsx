/* ════════════════════════════════════════════════════════════════════
   Η Ζωφόρος — game store. Content (admin-authored), student progress,
   admin auth, and export/import. Pure logic; sets window.ZG.
   Content model per station:
     dialogue: [ { cue, prompt, options:[…], correct:Int, why, quote } ]
     trivia:   [ { type:'tf',    q, answer:Bool, why }
                 { type:'mc',    q, options:[…], correct:Int, why }
                 { type:'match', q, pairs:[{l,r}…], why }
                 { type:'order', q, items:[…in correct order], why }
                 { type:'open',  q, a } ]          ← legacy free Q&A
   Seeds live on the station object (dialogue/trivia/quiz). Admin edits are
   stored as overrides in localStorage and shadow the seed for that mode.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const DOC  = document.title || location.pathname;
  const CKEY = 'zofatos:content:' + DOC;   // admin content overrides {i:{dialogue,trivia}}
  const PKEY = 'zofatos:progress:' + DOC;   // student progress {i:{'mode:idx':true}}
  const AKEY = 'zofatos:admin';             // admin session flag (shared across works)

  function load(k) { try { const r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch (e) { return null; } }
  function save(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }

  /* ── seeds ─────────────────────────────────────────────────────── */
  function seedTrivia(station) {
    const t = (station.trivia || []).map(x => ({ ...x }));
    (station.quiz || []).forEach(x => t.push({ type: 'open', q: x.q, a: x.a || '' }));
    return t;
  }
  const seedDialogue = (station) => (station.dialogue || []).map(x => ({ ...x }));

  /* ── content (seed ⊕ override) ─────────────────────────────────── */
  function getContent(i, station, mode) {
    const store = load(CKEY) || {};
    if (store[i] && store[i][mode]) return store[i][mode];
    return mode === 'dialogue' ? seedDialogue(station) : seedTrivia(station);
  }
  function setContent(i, mode, list) {
    const store = load(CKEY) || {};
    store[i] = store[i] || {};
    store[i][mode] = list;
    save(CKEY, store);
  }
  function resetContent(i, mode) {
    const store = load(CKEY) || {};
    if (store[i]) { delete store[i][mode]; if (!Object.keys(store[i]).length) delete store[i]; save(CKEY, store); }
  }
  const count = (i, station) =>
    getContent(i, station, 'dialogue').length + getContent(i, station, 'trivia').length;

  /* ── progress + scoring ────────────────────────────────────────── */
  const getProgress = (i) => { const p = load(PKEY) || {}; return p[i] || {}; };
  function markCorrect(i, mode, idx, ok) {
    const p = load(PKEY) || {}; p[i] = p[i] || {}; const k = mode + ':' + idx;
    if (ok) p[i][k] = true; else delete p[i][k];
    if (!Object.keys(p[i]).length) delete p[i];
    save(PKEY, p);
  }
  function modeScore(i, station, mode) {
    const prog = getProgress(i), total = getContent(i, station, mode).length;
    let done = 0;
    for (let k = 0; k < total; k++) if (prog[mode + ':' + k]) done++;
    return { done, total };
  }
  function stationDots(i, station) {
    const total = count(i, station);
    if (!total) return station.done || 0;
    const prog = getProgress(i);
    const done = Object.keys(prog).filter(k => {
      const [m, idx] = k.split(':');
      return Number(idx) < getContent(i, station, m).length;
    }).length;
    return Math.round(Math.min(1, done / total) * 3);
  }

  /* ── admin auth ────────────────────────────────────────────────── */
  const isAdmin = () => load(AKEY) === true;
  function login(pass, expected) { if (String(pass) === String(expected)) { save(AKEY, true); return true; } return false; }
  const logout = () => save(AKEY, false);

  /* ── export / import (effective content, all stations) ─────────── */
  function exportAll(stations) {
    const out = { doc: DOC, kind: 'zofatos-content', version: 1, stations: {} };
    stations.forEach((s, i) => { out.stations[i] = { dialogue: getContent(i, s, 'dialogue'), trivia: getContent(i, s, 'trivia') }; });
    return out;
  }
  function importAll(data) {
    if (!data || !data.stations) return false;
    const store = load(CKEY) || {};
    Object.keys(data.stations).forEach(i => { store[i] = data.stations[i]; });
    save(CKEY, store);
    return true;
  }

  window.ZG = {
    getContent, setContent, resetContent, count,
    getProgress, markCorrect, modeScore, stationDots,
    isAdmin, login, logout, exportAll, importAll,
  };
})();
