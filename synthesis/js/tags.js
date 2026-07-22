/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · GAME TAGS
   The "extra pages" system. A tag (Έπη, Τραγωδίες, Έκθεση…) is a browsable
   page that gathers every game carrying it. The hero strip links here; the
   Admin → Game Tags panel tags games and adds new tags.
     · catalogue()      — one flat, de-duplicated list of every game
     · gameTags(key)    — a game's effective tags (admin override or default)
     · gamesForTag(id)  — games shown on a tag page
   Defaults come from SYM.SUBJECT_TAGS; admin overrides live in SymStore.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const slug = s => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  function customTags() { return (window.SymStore && SymStore.get('custom_tags', [])) || []; }
  function tagsAll() { return (window.SYM.TAGS || []).concat(customTags()); }
  function tagById(id) { return tagsAll().find(t => t.id === id); }

  // Build once: every game across all subjects (+ standalone engines),
  // de-duplicated by english name, with its default (subject-derived) tags.
  let _cat = null;
  function catalogue() {
    if (_cat) return _cat;
    const ST = window.SYM.SUBJECT_TAGS || {};
    const SUBJ = window.SYM.SUBJECTS || {};
    const map = new Map();
    Object.keys(SUBJ).forEach(cid => (SUBJ[cid] || []).forEach(s => (s.games || []).forEach(gm => {
      const key = slug(gm.en || gm.gr);
      if (!key) return;
      if (!map.has(key)) map.set(key, { key, gr: gm.gr, en: gm.en, illu: gm.illu, meta: gm.meta || '', dtags: new Set(), sample: { clsId: cid, subjectId: s.id } });
      (ST[s.id] || []).forEach(t => map.get(key).dtags.add(t));
    })));
    // standalone engines (Phalanx, Naumachia, Symposion…) — untagged by default
    (window.SYM.ENGINES || []).forEach(e => {
      const key = slug(e.en || e.gr);
      if (key && !map.has(key)) map.set(key, { key, gr: e.gr, en: e.en, illu: e.illu, meta: (e.meta && window.L(e.meta)) || '', dtags: new Set(), sample: null });
    });
    const _nm = gameNames();
    _cat = [...map.values()].map(g => {
      const ov = _nm[g.key];   // admin display-name override (keyed by original english slug)
      return { key: g.key, gr: (ov && ov.gr) || g.gr, en: (ov && ov.en) || g.en, illu: g.illu, meta: g.meta, dtags: [...g.dtags], sample: g.sample };
    });
    _cat.sort((a, b) => String(window.L(a)).localeCompare(String(window.L(b)), 'el'));
    return _cat;
  }

  function overrides() { return (window.SymStore && SymStore.get('game_tags', {})) || {}; }
  function refresh() { _cat = null; return catalogue(); }

  /* ── Display-name overrides (admin rename). Keyed by the ORIGINAL english
     slug so launch wiring (synResolveLaunch / SYN_LAUNCH_MAP) and tag
     associations never change — only the visible label moves. ── */
  function gameNames() { return (window.SymStore && SymStore.get('game_names', {})) || {}; }
  function setGameName(key, nameObj) {
    const o = gameNames();
    if (!nameObj || (!String(nameObj.gr || '').trim() && !String(nameObj.en || '').trim())) delete o[key];
    else o[key] = { gr: String(nameObj.gr || '').trim(), en: String(nameObj.en || '').trim() };
    if (window.SymStore) SymStore.set('game_names', o);
    _cat = null;                 // bust the catalogue so the new name re-applies everywhere
  }
  // Pass a tile/engine object → returns its {gr,en} with any override merged in
  // (safe for window.L()); pass a key string → returns the override obj or null.
  function displayName(tileOrKey) {
    const o = gameNames();
    if (typeof tileOrKey === 'string') return o[tileOrKey] || null;
    if (!tileOrKey) return tileOrKey;
    const ov = o[slug(tileOrKey.en || tileOrKey.gr)];
    return ov ? { gr: ov.gr || tileOrKey.gr, en: ov.en || tileOrKey.en } : tileOrKey;
  }
  function gameTags(key) {
    const o = overrides();
    if (o[key]) return o[key].slice();
    const g = catalogue().find(x => x.key === key);
    return g ? g.dtags.slice() : [];
  }
  function setGameTags(key, arr) { const o = overrides(); o[key] = arr; SymStore.set('game_tags', o); }
  function toggleGameTag(key, tagId) {
    const cur = gameTags(key);
    const i = cur.indexOf(tagId);
    if (i >= 0) cur.splice(i, 1); else cur.push(tagId);
    setGameTags(key, cur);
    return cur;
  }
  function gamesForTag(tagId) { return catalogue().filter(g => gameTags(g.key).indexOf(tagId) >= 0); }
  function tagCount(tagId) { return gamesForTag(tagId).length; }

  function addCustomTag(label) {
    const nm = String(label || '').trim();
    if (!nm) return null;
    let id = slug(nm) || ('tag-' + Date.now());
    while (tagById(id)) id += '-x';
    const cur = customTags(); cur.push({ id, gr: nm, en: nm, illu: 'wreath-laurel' });
    SymStore.set('custom_tags', cur);
    return id;
  }
  function removeCustomTag(id) {
    SymStore.set('custom_tags', customTags().filter(t => t.id !== id));
    // strip it off any games that carried it
    const o = overrides(); let touched = false;
    Object.keys(o).forEach(k => { const n = o[k].filter(t => t !== id); if (n.length !== o[k].length) { o[k] = n; touched = true; } });
    if (touched) SymStore.set('game_tags', o);
  }

  // a per-tag accent so each page feels distinct (cycles a classical palette)
  const PAL = ['#C5572F', '#2F6F8E', '#7A2E33', '#6E8B3D', '#3E7E86', '#7C5AC2', '#C18A2C', '#B0395A', '#8AA84E'];
  function accentFor(tagId) { const i = tagsAll().findIndex(t => t.id === tagId); return PAL[(i < 0 ? 0 : i) % PAL.length]; }

  function openGame(g) {
    if (g.sample) {
      const cls = window.SYM.classById(g.sample.clsId);
      const subj = (window.SYM.SUBJECTS[g.sample.clsId] || []).find(s => s.id === g.sample.subjectId);
      const game = subj && (subj.games || []).find(x => slug(x.en || x.gr) === g.key);
      if (cls && subj && game) {
        if (window.symTileLaunch) window.symTileLaunch(game, { subject: subj, game, cls });
        else window.symGo('mode', { subject: subj, game, cls });
        return;
      }
    }
    window.symGo('gamepanel');
  }

  /* ── TAG PAGE — symposion/<tag> ── */
  function tagScreen(home, ctx) {
    const all = tagsAll();
    const tagId = (ctx.param && ctx.param.tag) || (all[0] && all[0].id);
    const tag = tagById(tagId) || all[0];
    const accent = accentFor(tagId);
    const games = gamesForTag(tagId);
    const isAdmin = window.STATE && window.STATE.role === 'admin';

    const actions = [];
    if (isAdmin) actions.push(window.el('button', { class: 'sc-cta sc-cta--ghost sc-cta--sm', onclick: () => { window.__adminSec = 'tags'; window.symGo('admin'); } }, [window.el('span', { html: '&#9998; ' }), window.L({ gr: 'Διαχείριση ετικετών', en: 'Manage tags' })]));

    const body = window.synPage(home, {
      back: 'home', accent,
      eyebrow: window.L({ gr: 'Παιχνίδια ανά ετικέτα', en: 'Games by tag' }),
      title: window.L(tag),
      sub: window.L(games.length === 1 ? { gr: '1 παιχνίδι με αυτή την ετικέτα.', en: '1 game with this tag.' }
        : { gr: games.length + ' παιχνίδια με αυτή την ετικέτα.', en: games.length + ' games with this tag.' }),
      actions: actions.length ? actions : null,
    });

    // tag switcher — every page reachable from every page
    const tabs = window.el('div', { class: 'tagpg__tabs sc-stagger' }, all.map(t =>
      window.el('button', {
        class: 'syn-chiplet syn-chiplet--tag' + (t.id === tagId ? ' on' : ''),
        style: t.id === tagId ? `--ca:${accent}` : null,
        onclick: () => window.symGo('tag', { tag: t.id })
      }, [window.L(t), window.el('span', { class: 'syn-chiplet__n' }, String(tagCount(t.id)))])));
    body.appendChild(tabs);

    if (!games.length) {
      body.appendChild(window.el('div', { class: 'tagpg__empty sc-stagger' }, [
        window.el('span', { class: 'tagpg__empty-ic', 'data-illu': tag.illu || 'amphora' }),
        window.el('p', {}, window.L({ gr: 'Κανένα παιχνίδι ακόμη με αυτή την ετικέτα.', en: 'No games carry this tag yet.' })),
        isAdmin ? window.el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: () => { window.__adminSec = 'tags'; window.symGo('admin'); } }, window.L({ gr: 'Πρόσθεσε από το Admin', en: 'Tag games in Admin' })) : null,
      ]));
    } else {
      const grid = window.el('div', { class: 'tagpg__grid has-accent sc-stagger', style: `--ca:${accent}` },
        games.map(g => window.synTile({ gr: g.gr, en: g.en, meta: g.meta, illu: g.illu }, accent, () => openGame(g))));
      body.appendChild(grid);
    }
    if (window.injectIllus) window.injectIllus(home);
  }

  /* ── ADMIN · Game Tags panel ── */
  function renderAdmin(pane, o) {
    o = o || {};
    const glyph = (window.SYM_SCREENS_HELPERS && window.SYM_SCREENS_HELPERS.glyph) || ((n, c) => window.el('span', { class: c, 'data-illu': n }));

    pane.appendChild(window.el('div', { class: 'sc-panel__h' }, window.L({ gr: 'Ετικέτες Παιχνιδιών', en: 'Game Tags' })));
    pane.appendChild(window.el('p', { class: 'sc-hint', style: 'margin:0 0 14px' }, window.L({
      gr: 'Κάθε ετικέτα είναι μια σελίδα της αρχικής. Διάλεξε ετικέτες ανά παιχνίδι — εμφανίζονται αυτόματα στη σελίδα της ετικέτας.',
      en: 'Each tag is its own home-page. Toggle tags per game — they appear on that tag\u2019s page automatically.'
    })));

    // tag manager — chips + add + (custom) remove
    pane.appendChild(window.el('div', { class: 'sc-sec-lbl', style: 'margin:0 0 8px' }, window.L({ gr: 'Ετικέτες', en: 'Tags' })));
    const tagWrap = window.el('div', { class: 'sc-tagmgr' });
    function paintTags() {
      tagWrap.innerHTML = '';
      tagsAll().forEach(t => {
        const isCustom = customTags().some(c => c.id === t.id);
        const chip = window.el('span', { class: 'sc-tagchip' + (isCustom ? ' sc-tagchip--custom' : '') }, [
          window.L(t),
          window.el('span', { class: 'sc-tagchip__n' }, String(tagCount(t.id))),
          isCustom ? window.el('button', { class: 'sc-tagchip__x', title: window.L({ gr: 'Διαγραφή', en: 'Delete' }), onclick: () => { removeCustomTag(t.id); paintTags(); paintGames(); }, html: '&times;' }) : null,
        ]);
        tagWrap.appendChild(chip);
      });
      const add = window.el('button', { class: 'sc-tagchip sc-tagchip--add', onclick: () => {
        const nm = prompt(window.L({ gr: 'Όνομα νέας ετικέτας:', en: 'New tag name:' }), '');
        if (nm) { addCustomTag(nm); paintTags(); paintGames(); }
      } }, [window.el('span', { html: '&#43; ' }), window.L({ gr: 'Νέα ετικέτα', en: 'New tag' })]);
      tagWrap.appendChild(add);
    }
    paintTags();
    pane.appendChild(tagWrap);

    // games × tags grid
    const gamesHd = window.el('div', { class: 'sc-tagrow__bar' }, [
      window.el('div', { class: 'sc-sec-lbl', style: 'margin:0' }, window.L({ gr: 'Παιχνίδια', en: 'Games' })),
      window.el('button', { class: 'sc-refresh', title: window.L({ gr: 'Ανανέωση για νέα παιχνίδια', en: 'Refresh for new games' }), onclick: () => { refresh(); paintGames(); paintTags(); } }, [window.el('span', { class: 'sc-refresh__ic', html: '↻' }), window.L({ gr: 'Ανανέωση', en: 'Refresh' })]),
    ]);
    pane.appendChild(gamesHd);
    const search = window.el('input', { class: 'sc-search', placeholder: window.L({ gr: 'Αναζήτηση παιχνιδιού…', en: 'Search game…' }) });
    pane.appendChild(search);
    const list = window.el('div', { class: 'sc-tagrows' });
    pane.appendChild(list);

    function paintGames() {
      list.innerHTML = '';
      const q = (search.value || '').toLowerCase();
      catalogue().forEach(g => {
        const name = String(window.L(g)).toLowerCase();
        if (q && name.indexOf(q) < 0 && (g.en || '').toLowerCase().indexOf(q) < 0) return;
        const cur = gameTags(g.key);
        const chips = window.el('div', { class: 'sc-tagrow__tags' }, tagsAll().map(t =>
          window.el('button', {
            class: 'sc-tagtoggle' + (cur.indexOf(t.id) >= 0 ? ' on' : ''),
            onclick: () => { toggleGameTag(g.key, t.id); paintGames(); paintTags(); }
          }, window.L(t))));
        list.appendChild(window.el('div', { class: 'sc-tagrow' }, [
          window.el('div', { class: 'sc-tagrow__g' }, [
            glyph(g.illu, 'sc-tagrow__ic'),
            window.el('span', { class: 'sc-tagrow__nm' }, window.L(g)),
            window.el('button', {
              class: 'sc-tagrow__rename', title: window.L({ gr: 'Μετονομασία', en: 'Rename' }),
              style: 'margin-left:8px;border:none;background:none;cursor:pointer;opacity:.45;font-size:13px;line-height:1',
              onmouseenter: function (e) { e.currentTarget.style.opacity = '1'; },
              onmouseleave: function (e) { e.currentTarget.style.opacity = '.45'; },
              onclick: function () {
                const ngr = prompt(window.L({ gr: 'Νέο όνομα (Ελληνικά) — κενό = επαναφορά στο αρχικό:', en: 'New name (Greek) — empty = reset to original:' }), g.gr);
                if (ngr === null) return;
                const nen = prompt(window.L({ gr: 'Νέο όνομα (Αγγλικά):', en: 'New name (English):' }), g.en);
                if (nen === null) return;
                setGameName(g.key, { gr: ngr, en: nen });
                refresh(); paintGames(); if (typeof paintTags === 'function') paintTags();
              }, html: '&#9998;'
            }),
          ]),
          chips,
        ]));
      });
      if (window.injectIllus) window.injectIllus(list);
    }
    search.addEventListener('input', paintGames);
    paintGames();
  }

  window.SymTags = { slug, tagsAll, tagById, catalogue, refresh, gameTags, setGameTags, toggleGameTag, gamesForTag, tagCount, addCustomTag, removeCustomTag, accentFor, renderAdmin, tagScreen, gameNames, setGameName, displayName };

  // register the tag page on the screen router (screens.js / screens-2.js ran first)
  if (window.SYM_SCREENS) window.SYM_SCREENS.tag = tagScreen;
})();
