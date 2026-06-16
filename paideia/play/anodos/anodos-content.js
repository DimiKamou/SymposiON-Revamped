/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — shared content bridge
   ────────────────────────────────────────────────────────────────────
   ONE implementation used by both entry points so behaviour can't diverge:
     · the games-panel overlay (SPA / nav.js openAnodos)         — same origin
     · the standalone /play/anodos/ page (wrapper index.html)    — same origin

   What it does, applied into a *booted* ΑΝΟΔΟΣ iframe window (`cw`):
     1. (optional) swap the trivia multiple-choice bank with chosen study material
     2. auto-generate the ⚡ true/false volley bank FROM the active trivia content
     3. append admin riddles  (config/anodos.riddles) → cw.EVENTS
     4. append admin rewards  (config/anodos.rewards) → cw.RELICS  (collectibles)

   The game exposes QUESTIONS / TF_BANK / EVENTS / RELICS as live window arrays
   (Object.assign in anodos-data.jsx). We mutate those arrays *in place*, so the
   game's lexical consts see the change. Riddles & rewards only ever ADD; the
   true/false bank is regenerated from whatever trivia is in play. Nothing here
   touches gameplay code — pure data.
   ════════════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  // Build {s, t} true/false items from MC questions {q, opts:[...], a:idx}.
  // For each question we emit one TRUE pairing (correct answer) and one FALSE
  // pairing (a random wrong answer), phrased as "«question» → candidate".
  function genTrueFalse(questions) {
    const out = [];
    (questions || []).forEach(q => {
      if (!q || !Array.isArray(q.opts) || q.opts.length < 2 || typeof q.a !== 'number') return;
      const correct = q.opts[q.a];
      if (correct === '' || correct == null) return;
      const stem = String(q.q || '').replace(/\s+/g, ' ').trim();
      if (!stem) return;
      out.push({ s: '«' + stem + '» → ' + correct, t: true });
      const wrongs = q.opts.filter((_, i) => i !== q.a && q.opts[i]);
      if (wrongs.length) out.push({ s: '«' + stem + '» → ' + wrongs[(Math.random() * wrongs.length) | 0], t: false });
    });
    return shuffle(out);
  }

  // Apply study material + admin config into a booted ΑΝΟΔΟΣ window.
  // opts = { studyQuestions?: [{q,opts,a,hint}], config?: { riddles:[], rewards:[] } }
  // Returns true if applied, false if the game globals weren't ready.
  function apply(cw, opts) {
    opts = opts || {};
    if (!cw || !Array.isArray(cw.QUESTIONS)) return false;
    try {
      // 1. study material swaps the trivia bank (panel launches only)
      if (Array.isArray(opts.studyQuestions) && opts.studyQuestions.length) {
        cw.QUESTIONS.length = 0;
        opts.studyQuestions.forEach(q => cw.QUESTIONS.push(q));
      }

      // 2. regenerate the true/false volley from whatever trivia is now in play
      if (Array.isArray(cw.TF_BANK) && cw.QUESTIONS.length) {
        const tf = genTrueFalse(cw.QUESTIONS);
        if (tf.length) { cw.TF_BANK.length = 0; tf.forEach(x => cw.TF_BANK.push(x)); }
      }

      const cfg = opts.config || {};

      // 3. append admin riddles → EVENTS (riddle encounters)
      if (Array.isArray(cfg.riddles) && Array.isArray(cw.EVENTS)) {
        cfg.riddles.forEach(r => {
          if (!r || !r.q || !Array.isArray(r.opts) || r.opts.length < 2 || typeof r.a !== 'number') return;
          const opts4 = r.opts.slice(0, 4).map(s => String(s));
          const ai = Math.max(0, Math.min(opts4.length - 1, r.a | 0));
          cw.EVENTS.push({
            title:      r.title || 'Αἴνιγμα',
            sub:        r.sub   || 'A riddle',
            body:       r.body  || 'Λῦσε τὸ αἴνιγμα γιὰ πλούσια ἀμοιβή — ἢ πλήρωσε.',
            riddle:     true,
            riddleQ:    String(r.q),
            riddleOpts: opts4,
            riddleA:    ai,
          });
        });
      }

      // 4. append admin rewards → RELICS (collectible περίαπτα; flavour only —
      //    coded effects are keyed by built-in relic id, so custom ids are inert)
      if (Array.isArray(cfg.rewards) && Array.isArray(cw.RELICS)) {
        cfg.rewards.forEach((rw, i) => {
          if (!rw || !rw.name) return;
          const id = 'cust-' + String(rw.id || (i + '-' + String(rw.name).replace(/[^\p{L}\p{N}]+/gu, '').slice(0, 14))).toLowerCase();
          if (cw.RELICS.some(x => x && x.id === id)) return;
          cw.RELICS.push({
            id,
            icon: rw.icon || '✦',
            name: String(rw.name),
            desc: String(rw.desc || ''),
            en:   String(rw.en || rw.desc || ''),
            custom: true,
          });
        });
      }
      // 5. Inject CSS improvements: more space between answers, brighter question text
      try {
        if (cw.document && !cw.document.getElementById('__an-enhance')) {
          const st = cw.document.createElement('style');
          st.id = '__an-enhance';
          st.textContent = [
            // Larger tap targets + breathing room between answer buttons
            'button { min-height: 44px !important; padding: 9px 18px !important; margin-bottom: 8px !important; }',
            // Make the last button not double-space at the bottom
            'button:last-child { margin-bottom: 0 !important; }',
            // Highlight question / prompt text so it reads quickly
            '[class*="question"],[class*="prompt"],[class*="riddle"],[class*="quiz"],[class*="stem"] { color: #FFDF80 !important; font-weight: 600 !important; line-height: 1.55 !important; }',
            // Give every vertical flex/grid container a little breathing room
            '[class*="panel"],[class*="card"],[class*="modal"],[class*="overlay"],[class*="combat"] { gap: 10px !important; }',
          ].join('\n');
          (cw.document.head || cw.document.body || cw.document.documentElement).appendChild(st);
        }
      } catch (_) {}

      // 6. Try to increase map tile/floor count (common variable names across game builds)
      try {
        const tileVars = ['NUM_FLOORS', 'MAP_FLOORS', 'PATH_LENGTH', 'NUM_NODES', 'FLOORS', 'numFloors'];
        for (const v of tileVars) {
          if (typeof cw[v] === 'number' && cw[v] < 14) { cw[v] = 14; }
        }
        if (cw.MAP_CONFIG && typeof cw.MAP_CONFIG === 'object') {
          if (typeof cw.MAP_CONFIG.floors === 'number' && cw.MAP_CONFIG.floors < 14) cw.MAP_CONFIG.floors = 14;
          if (typeof cw.MAP_CONFIG.nodes  === 'number' && cw.MAP_CONFIG.nodes  < 14) cw.MAP_CONFIG.nodes  = 14;
        }
      } catch (_) {}

      return true;
    } catch (_) { return false; }
  }

  // Poll a freshly-loaded iframe until its game globals are live, then apply().
  // Calls done(ok) once. Returns a cancel() function — call it before re-launching
  // to prevent a stale poll from injecting old opts into a new game window.
  function applyWhenReady(frame, opts, done) {
    let tries = 0, cancelled = false;
    (function tick() {
      if (cancelled) return;
      let cw = null;
      try { cw = frame.contentWindow; } catch (_) { if (done) done(false); return; }
      if (cw && Array.isArray(cw.QUESTIONS)) {
        const ok = apply(cw, opts || {});
        if (done) done(ok);
      } else if (tries++ < 80) {
        setTimeout(tick, 100);   // ~8s budget while the bundle boots + Babel runs
      } else if (done) { done(false); }
    })();
    return function cancel() { cancelled = true; };
  }

  /* ── Firestore REST decode + public fetch (for the SDK-less direct page) ──
     config docs are world-readable (firestore.rules: /config/{id} → read:true),
     so an unauthenticated REST GET with the public web apiKey works. */
  function decodeVal(v) {
    if (!v) return null;
    if ('nullValue'    in v) return null;
    if ('stringValue'  in v) return v.stringValue;
    if ('booleanValue' in v) return v.booleanValue;
    if ('integerValue' in v) return +v.integerValue;
    if ('doubleValue'  in v) return v.doubleValue;
    if ('arrayValue'   in v) return (v.arrayValue.values || []).map(decodeVal);
    if ('mapValue'     in v) {
      const o = {}, f = v.mapValue.fields || {};
      for (const k in f) o[k] = decodeVal(f[k]);
      return o;
    }
    return null;
  }
  function decodeDoc(doc) {
    const o = {}, f = (doc && doc.fields) || {};
    for (const k in f) o[k] = decodeVal(f[k]);
    return o;
  }
  // Returns a Promise resolving to the config object ({} if missing / on error).
  function fetchConfig(projectId, apiKey) {
    const url = 'https://firestore.googleapis.com/v1/projects/' + projectId +
                '/databases/(default)/documents/config/anodos?key=' + apiKey;
    return fetch(url)
      .then(r => r.ok ? r.json() : null)
      .then(doc => doc ? decodeDoc(doc) : {})
      .catch(() => ({}));
  }

  global.ANODOS_applyContent  = apply;
  global.ANODOS_applyWhenReady = applyWhenReady;
  global.ANODOS_genTrueFalse  = genTrueFalse;
  global.ANODOS_fetchConfig   = fetchConfig;
})(window);
