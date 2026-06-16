// ============================================================
//  ΚΑΤΑΙΓΙΣΜΟΣ · Reimagined — content & question-format engine
//  window.StormContent
//
//  Two jobs:
//   1) SOURCES — surface every class's content as a grouped picker.
//      On the live site it reads window.GP_DATASETS (all subjects /
//      classes / grammar-theory drills) and normalises each via the
//      site's _gpToMcItems(). In the standalone preview it falls back to
//      window.RF_SOURCES. Any GP-injected `_gp` pack on window.RF_PACKS
//      is surfaced too, so the existing Games-Panel launch still works.
//
//   2) ROUNDS — turn a flat MC pool into RANDOMISED question formats so
//      play feels more intense:
//        · 'mc'    — πολλαπλή επιλογή (4 options)
//        · 'tf'    — Σωστό / Λάθος (judge a proposed answer)
//        · 'match' — Αντιστοίχιση (pair 3 stems with 3 answers)
//        · 'order' — Βάλε στη σωστή σειρά (sequence 4 items)
//      Each round renders its own UI + reveal and reports a single
//      correct/incorrect outcome back to the engine.
// ============================================================
(function () {
  const T = (lang, gr, en) => (lang === 'en' ? en : gr);
  const rnd = arr => arr.slice().sort(() => Math.random() - 0.5);
  const pick = arr => arr[(Math.random() * arr.length) | 0];

  // text of a normalised item's stem (handles {gr,en} or plain string)
  function stemText(q, lang) {
    const o = q.q !== undefined ? q.q : q;
    if (typeof o === 'string') return o;
    if (o && typeof o === 'object') return lang === 'en' ? (o.en || o.gr) : (o.gr || o.en);
    return '';
  }
  const ansOf = it => it.a[it.correct];

  // Tier gate — reuse the site's subscription check (_gpCanAccessTier). If it's
  // absent (standalone preview) or the dataset has no tier, allow. This keeps the
  // lobby's access rules identical to the Games Panel — no paywall back-door.
  function _srcAccessible(ds) {
    if (!ds || ds.tier === undefined || ds.tier === 'free') return true;
    return (typeof _gpCanAccessTier === 'function') ? !!_gpCanAccessTier(ds.tier) : true;
  }

  // ── SOURCES ────────────────────────────────────────────────
  // Returns: [{ cat, items:[{ id, icon, label, meta, _src }] }]
  function getSourceGroups(lang) {
    const groups = [];

    // GP-injected upload pack (from the Games Panel) — show it first
    const packs = window.RF_PACKS || [];
    const gp = packs.find(p => p.id === '_gp');
    if (gp) {
      groups.push({ cat: T(lang, 'Δικές μου ερωτήσεις', 'My questions'),
        items: [{ id: '_gp', icon: gp.icon || '📚', label: gp.name || 'GP', meta: (gp.questions || []).length + ' ' + T(lang, 'ερωτήσεις', 'questions'), _src: { kind: 'pack', pack: gp } }] });
    }

    // Live site registry — every class / subject / theory drill
    if (typeof GP_DATASETS !== 'undefined' && Array.isArray(GP_DATASETS) && GP_DATASETS.length) {
      const byCat = {};
      GP_DATASETS.forEach(ds => {
        (byCat[ds.category] = byCat[ds.category] || []).push({
          id: ds.id, icon: ds.icon || '⚡',
          label: typeof ds.label === 'object' ? (ds.label[lang] || ds.label.gr) : ds.label,
          meta: ds.meta || ds.category,
          tier: ds.tier || 'free',
          locked: !_srcAccessible(ds),   // Pro content the current user can't access
          _src: { kind: 'gp', ds },
        });
      });
      Object.keys(byCat).forEach(cat => groups.push({ cat, items: byCat[cat] }));
      return groups;
    }

    // Preview / fallback registry
    const srcs = window.RF_SOURCES || [];
    srcs.forEach(g => groups.push({
      cat: typeof g.cat === 'object' ? (g.cat[lang] || g.cat.gr) : g.cat,
      items: g.items.map(it => ({
        id: it.id, icon: it.icon || '⚡',
        label: typeof it.label === 'object' ? (it.label[lang] || it.label.gr) : it.label,
        meta: typeof it.meta === 'object' ? (it.meta[lang] || it.meta.gr) : (it.meta || ''),
        _src: { kind: 'rf', item: it },
      })),
    }));
    return groups;
  }

  // Normalise a chosen source into a usable pool: { items:[{q,a,correct}], orderSets:[...] }
  // Async: GP datasets resolve through the site's shared gpLoadQuestions(), which may
  // fetch from Firestore for remote datasets (e.g. iliada-deep).
  async function loadPool(meta, level) {
    const src = meta._src || meta;
    let raw = null, orderSets = null;
    const lvRaw = level && level._raw ? level._raw : null;
    if (src.kind === 'gpbank') raw = src.items;        // GP "Launch with data" — cfg.G (GP-normalised)
    else if (src.kind === 'pack') raw = src.pack.questions;
    else if (src.kind === 'rf') {
      const it = src.item;
      raw = it.getQuestions ? it.getQuestions(lvRaw) : it.questions;
      orderSets = it.orderSets || null;
    } else if (src.kind === 'gp') {
      const ds = src.ds;
      // tier gate (hard block) — never load Pro content for an unentitled user,
      // even if the picker UI is bypassed. Mirrors the Games Panel's launch gate.
      if (!_srcAccessible(ds)) return { items: [], orderSets: [], denied: true };
      if (typeof gpLoadQuestions === 'function') {
        // Single source of truth: gate + sync→Firestore (cached) + per-level
        // filter + dataset-aware normalisation — identical to the Games Panel.
        const r = await gpLoadQuestions(ds.id, { levelId: level ? level.id : null });
        if (r && r.denied) return { items: [], orderSets: [], denied: true };
        raw = r ? r.questions : null;
      } else {
        // fallback (standalone preview / older nav.js without the shared loader)
        try { raw = ds.loader ? ds.loader(level ? level.id : undefined) : null; } catch (e) { raw = null; }
        if (lvRaw) raw = filterByLevel(raw, lvRaw, ds);
        if (raw && typeof _gpNormalizeQuestions === 'function') raw = _gpNormalizeQuestions(raw, ds.id);
      }
    }
    if (!raw) return { items: [], orderSets: orderSets || [] };

    let items = raw;
    // If items aren't already {a:[…], correct}, run the site normaliser.
    const looksMc = Array.isArray(raw) && raw[0] && Array.isArray(raw[0].a) && (raw[0].correct !== undefined || raw[0].c !== undefined);
    if (!looksMc && typeof _gpToMcItems === 'function') items = _gpToMcItems(raw);
    // unify the correct-index field
    items = (items || []).filter(it => it && Array.isArray(it.a) && it.a.length >= 2).map(it => ({
      q: it.q, a: it.a, correct: it.correct !== undefined ? it.correct : (it.c || 0),
    }));
    return { items, orderSets: orderSets || synthOrderSets(items) };
  }

  // Levels for a source (mirrors the Games-Panel level picker), or null.
  function getLevels(meta, lang) {
    const src = meta._src || meta;
    if (src.kind === 'gp') {
      const ds = src.ds;
      // Level arrays (OUS_LEVELS, ANT_LEVELS, …) are top-level `const` globals on the
      // live site — NOT window properties — so window[name] misses them. Resolve by
      // name: window first, then indirect eval (which can see const/let globals).
      const arr = (function () {
        if (!ds.leveled || !ds.levelsGlobal) return null;
        const n = ds.levelsGlobal;
        try { if (typeof window[n] !== 'undefined') return window[n]; } catch (e) {}
        try { const v = (0, eval)(n); return (typeof v !== 'undefined') ? v : null; } catch (e) { return null; }
      })();
      if (!Array.isArray(arr) || !arr.length) return null;
      return arr.map(l => ({ id: l.id, group: l.group || '', color: l.color || 'lyellow', desc: l.desc || '', _raw: l }));
    }
    if (src.kind === 'rf') {
      const lv = src.item.levels;
      if (!lv || !lv.length) return null;
      return lv.map(l => ({
        id: l.id,
        group: typeof l.group === 'object' ? (l.group[lang] || l.group.gr) : (l.group || ''),
        color: l.color || 'lyellow',
        desc: typeof l.desc === 'object' ? (l.desc[lang] || l.desc.gr) : (l.desc || ''),
        _raw: l,
      }));
    }
    return null;
  }

  // Level filtering for the live site. lyo-style loaders already filter by id,
  // so this only runs for sub/filter datasets — plug your real filter via the hook.
  function filterByLevel(raw, lvl, ds) {
    if (typeof window.RF_LEVEL_FILTER === 'function') {
      try { const r = window.RF_LEVEL_FILTER(raw, lvl, ds); if (r) return r; } catch (e) {}
    }
    return raw; // graceful: unfiltered rather than empty
  }

  // Build order-sets from numeric-answer items: "which came first / smallest"
  function synthOrderSets(items) {
    const nums = items.map(it => ({ it, v: parseFloat(String(ansOf(it)).replace(/[^\d.,-]/g, '').replace(',', '.')) }))
      .filter(x => isFinite(x.v));
    // dedupe by value
    const seen = new Set(); const uniq = [];
    rnd(nums).forEach(x => { if (!seen.has(x.v)) { seen.add(x.v); uniq.push(x); } });
    if (uniq.length < 4) return [];
    return [{ _numeric: true, pool: uniq }];
  }

  // ── ROUND BUILDER ──────────────────────────────────────────
  // ctx: { lang, qIndex, lastFormat, overdrive }
  function buildRound(pool, ctx) {
    const items = pool.items || [];
    if (!items.length) return null;
    const lang = ctx.lang;
    const formats = supportedFormats(pool, ctx);
    const fmt = chooseFormat(formats, ctx);
    if (fmt === 'tf') return buildTF(items, lang);
    if (fmt === 'match') return buildMatch(items, lang);
    if (fmt === 'order') return buildOrder(pool, lang);
    return buildMC(items, lang);
  }

  function supportedFormats(pool, ctx) {
    const items = pool.items;
    const distinctAns = new Set(items.map(ansOf)).size;
    const f = ['mc'];
    if (items.length >= 2) f.push('tf');
    if (distinctAns >= 3 && items.length >= 3) f.push('match');
    if ((pool.orderSets && pool.orderSets.length) || false) f.push('order');
    return f;
  }

  function chooseFormat(formats, ctx) {
    // ease-in: first two questions are plain MC
    if (ctx.qIndex < 2) return 'mc';
    const weights = { mc: 0.40, tf: 0.24, match: 0.20, order: 0.16 };
    let pool = formats.filter(f => f !== ctx.lastFormat || f === 'mc'); // avoid repeating a special format back-to-back
    if (!pool.length) pool = formats;
    const total = pool.reduce((s, f) => s + (weights[f] || 0.1), 0);
    let r = Math.random() * total;
    for (const f of pool) { r -= (weights[f] || 0.1); if (r <= 0) return f; }
    return 'mc';
  }

  // ── FORMAT: multiple choice ────────────────────────────────
  function buildMC(items, lang) {
    const it = pick(items);
    const opts = rnd(it.a.map((txt, i) => ({ txt, ok: i === it.correct })));
    return {
      format: 'mc',
      badge: T(lang, 'ΠΟΛΛΑΠΛΗ ΕΠΙΛΟΓΗ', 'MULTIPLE CHOICE'),
      stem: stemText(it, lang),
      mount(host, api) {
        host.className = 'sf-answers';
        const keys = ['A', 'B', 'Γ', 'Δ'];
        opts.forEach((o, i) => {
          const b = document.createElement('button');
          b.className = 'sf-answer'; b.dataset.k = i + 1;
          b.innerHTML = `<span class="sf-answer-key">${keys[i] || i + 1}</span><span class="sf-answer-txt">${o.txt}</span>`;
          b.addEventListener('click', () => {
            if (api.done) return; api.done = true;
            host.querySelectorAll('.sf-answer').forEach((x, j) => {
              x.classList.add('disabled');
              if (opts[j].ok) x.classList.add('correct');
              else if (j === i) x.classList.add('wrong');
            });
            api.resolve(o.ok);
          });
          host.appendChild(b);
        });
      },
    };
  }

  // ── FORMAT: Σωστό / Λάθος ──────────────────────────────────
  function buildTF(items, lang) {
    const it = pick(items);
    const showTrue = Math.random() < 0.5;
    let candidate = ansOf(it);
    if (!showTrue) {
      const wrong = it.a.filter((_, i) => i !== it.correct);
      candidate = wrong.length ? pick(wrong) : candidate;
    }
    const isTrue = candidate === ansOf(it);
    return {
      format: 'tf',
      badge: T(lang, 'ΣΩΣΤΟ ή ΛΑΘΟΣ', 'TRUE or FALSE'),
      stem: stemText(it, lang),
      mount(host, api) {
        host.className = 'sf-tf';
        host.innerHTML = `
          <div class="sf-tf-claim"><span class="sf-tf-arrow">→</span> ${candidate}</div>
          <div class="sf-tf-btns">
            <button class="sf-tf-btn yes" data-k="1"><span class="sf-tf-ic">✓</span> ${T(lang, 'ΣΩΣΤΟ', 'TRUE')}</button>
            <button class="sf-tf-btn no" data-k="2"><span class="sf-tf-ic">✕</span> ${T(lang, 'ΛΑΘΟΣ', 'FALSE')}</button>
          </div>`;
        const claim = host.querySelector('.sf-tf-claim');
        host.querySelectorAll('.sf-tf-btn').forEach(btn => {
          btn.addEventListener('click', () => {
            if (api.done) return; api.done = true;
            const said = btn.classList.contains('yes');
            const ok = said === isTrue;
            host.querySelectorAll('.sf-tf-btn').forEach(b => b.classList.add('disabled'));
            btn.classList.add(ok ? 'correct' : 'wrong');
            claim.classList.add(isTrue ? 'was-true' : 'was-false');
            claim.insertAdjacentHTML('beforeend',
              `<span class="sf-tf-verdict">${isTrue ? T(lang, '✓ ήταν σωστό', '✓ was correct') : T(lang, '✕ ήταν λάθος', '✕ was wrong')}</span>`);
            api.resolve(ok);
          });
        });
      },
    };
  }

  // ── FORMAT: Αντιστοίχιση (3 pairs) ─────────────────────────
  function buildMatch(items, lang) {
    // 3 items with distinct stems AND distinct answers
    const seenA = new Set(), seenQ = new Set(), chosen = [];
    for (const it of rnd(items)) {
      const a = ansOf(it), q = stemText(it, lang);
      if (seenA.has(a) || seenQ.has(q)) continue;
      seenA.add(a); seenQ.add(q); chosen.push(it);
      if (chosen.length === 3) break;
    }
    // supportedFormats() gates on distinct ANSWERS, but here we also dedupe by
    // stem — a pool with 3 distinct answers but colliding stems can leave us
    // with < 3 pairs, and the win check needs exactly 3. Fall back to MC rather
    // than render an unwinnable board.
    if (chosen.length < 3) return buildMC(items, lang);
    const lefts = chosen.map((it, i) => ({ i, txt: stemText(it, lang) }));
    const rights = rnd(chosen.map((it, i) => ({ i, txt: ansOf(it) })));
    return {
      format: 'match',
      badge: T(lang, 'ΑΝΤΙΣΤΟΙΧΙΣΗ', 'MATCHING'),
      stem: T(lang, 'Αντιστοίχισε την ερώτηση με τη σωστή απάντηση.', 'Match each question to its correct answer.'),
      mount(host, api) {
        host.className = 'sf-match';
        host.innerHTML = `
          <div class="sf-match-col" data-side="L">${lefts.map(l => `<button class="sf-match-tile" data-i="${l.i}"><span class="sf-match-dot"></span><span>${l.txt}</span></button>`).join('')}</div>
          <div class="sf-match-col" data-side="R">${rights.map(r => `<button class="sf-match-tile r" data-i="${r.i}"><span>${r.txt}</span><span class="sf-match-dot"></span></button>`).join('')}</div>`;
        let selL = null, locked = 0;
        const tiles = host.querySelectorAll('.sf-match-tile');
        const colors = ['m1', 'm2', 'm3'];
        function fail() {
          if (api.done) return; api.done = true;
          // reveal correct pairings
          host.querySelectorAll('.sf-match-tile').forEach(t => {
            t.classList.add('disabled');
            if (!t.classList.contains('done')) { t.classList.add('miss'); t.classList.add('c-' + colors[+t.dataset.i % 3]); }
          });
          api.resolve(false);
        }
        function win() { if (api.done) return; api.done = true; api.resolve(true); }
        tiles.forEach(t => t.addEventListener('click', () => {
          if (api.done || t.classList.contains('done')) return;
          const side = t.parentElement.dataset.side;
          if (side === 'L') {
            host.querySelectorAll('[data-side="L"] .sf-match-tile').forEach(x => x.classList.remove('sel'));
            selL = t; t.classList.add('sel');
          } else if (selL) {
            const li = selL.dataset.i, ri = t.dataset.i;
            if (li === ri) {
              const c = 'c-' + colors[locked % 3];
              selL.classList.add('done', c); t.classList.add('done', c);
              selL.classList.remove('sel'); selL = null; locked++;
              if (locked === 3) win();
            } else { selL.classList.remove('sel'); selL = null; t.classList.add('shake'); setTimeout(() => t.classList.remove('shake'), 350); fail(); }
          }
        }));
      },
    };
  }

  // ── FORMAT: Βάλε στη σωστή σειρά (4 items) ──────────────────
  function buildOrder(pool, lang) {
    const set = pick(pool.orderSets);
    let tiles, prompt;
    if (set._numeric) {
      const four = rnd(set.pool).slice(0, 4);
      const sorted = four.slice().sort((a, b) => a.v - b.v);
      tiles = four.map(x => ({ label: stemText(x.it, lang), rank: sorted.indexOf(x), reveal: ansOf(x.it) }));
      prompt = T(lang, 'Βάλε σε αύξουσα σειρά (από το μικρότερο).', 'Put in ascending order (smallest first).');
    } else {
      const arr = set.items.slice();
      tiles = arr.map((x, i) => ({ label: typeof x.label === 'object' ? (x.label[lang] || x.label.gr) : x.label, rank: x.rank, reveal: x.reveal }));
      prompt = typeof set.prompt === 'object' ? (set.prompt[lang] || set.prompt.gr) : (set.prompt || T(lang, 'Βάλε στη σωστή σειρά.', 'Put in the correct order.'));
    }
    const shown = rnd(tiles);
    return {
      format: 'order',
      badge: T(lang, 'ΣΩΣΤΗ ΣΕΙΡΑ', 'ORDERING'),
      stem: prompt,
      mount(host, api) {
        host.className = 'sf-order';
        host.innerHTML = `
          <div class="sf-order-list">${shown.map((t, i) => `<button class="sf-order-tile" data-idx="${i}"><span class="sf-order-badge"></span><span class="sf-order-label">${t.label}</span><span class="sf-order-reveal"></span></button>`).join('')}</div>
          <div class="sf-order-hint">${T(lang, 'Πάτησε με τη σειρά · ↺ μηδενισμός', 'Tap in order · ↺ to reset')}</div>`;
        let seq = [];
        const tileEls = host.querySelectorAll('.sf-order-tile');
        function refresh() {
          tileEls.forEach((el, i) => {
            const pos = seq.indexOf(i);
            el.querySelector('.sf-order-badge').textContent = pos >= 0 ? (pos + 1) : '';
            el.classList.toggle('chosen', pos >= 0);
          });
        }
        function commit() {
          if (api.done) return; api.done = true;
          let ok = true;
          shown.forEach((t, i) => { if (seq.indexOf(i) !== t.rank) ok = false; });
          // reveal correct order + values
          tileEls.forEach((el, i) => {
            el.classList.add('disabled');
            el.querySelector('.sf-order-badge').textContent = shown[i].rank + 1;
            el.classList.add(seq.indexOf(i) === shown[i].rank ? 'right' : 'wrong');
            if (shown[i].reveal) el.querySelector('.sf-order-reveal').textContent = shown[i].reveal;
          });
          api.resolve(ok);
        }
        tileEls.forEach(el => el.addEventListener('click', () => {
          if (api.done) return;
          const i = +el.dataset.idx;
          const at = seq.indexOf(i);
          if (at >= 0) seq.splice(at, 1); else seq.push(i);
          refresh();
          if (seq.length === shown.length) setTimeout(commit, 160);
        }));
        const hint = host.querySelector('.sf-order-hint');
        hint.style.cursor = 'pointer';
        hint.addEventListener('click', () => { if (!api.done) { seq = []; refresh(); } });
      },
    };
  }

  window.StormContent = { getSourceGroups, getLevels, loadPool, buildRound, stemText };
})();
