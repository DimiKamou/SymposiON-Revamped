// ============================================================
//  SymposiON — Curator's Console (Ἱεροφάντης) — the Realm admin tab.
//  Authors config/realm: pillars · cosmetics · boons · quests · saga ·
//  achievements · the realm theme. Every edit applies to the live model
//  instantly (RealmStore.applyLocal → players re-render) and persists to
//  Firestore on a short debounce (RealmStore.save → no deploy).
//
//  Vanilla port of the design-handoff admin React. Gated by isAdmin.
//  Entry: window._adminRealmInit() (called from the admin tab button).
//  onclick handlers live on window.AdminRealm.
//  Requires: realm.js (RealmStore, getRealm), temple.js (Temple.glyph /
//  Temple.renderInto), temple-themes.js (window.RT).
// ============================================================
(function () {
  'use strict';

  let _RC = null;            // working realm catalog
  let _sec = 'realm';        // current section
  let _openId = null;        // open collapsible row
  let _iconOpen = null;      // "scope|id|key" of the open glyph popup
  let _saveTimer = null, _previewTimer = null, _resizeBound = false;

  // ── helpers ──
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function _uid(pfx) { return String(pfx).slice(0, 3) + '-' + Math.random().toString(36).slice(2, 7); }
  function _glyph(n) { return (window.Temple && Temple.glyph) ? Temple.glyph(n) : ''; }
  function _icons() { return (_RC && _RC.ICON_NAMES) || (window.getRealm && getRealm().ICON_NAMES) || []; }

  // ── option providers ──
  const themesOpts = () => window.RT.THEMES.map(t => ({ value: t.id, label: t.name + (t.locked ? ' · locked' : '') }));
  const backdropKinds = () => [{ value: 'circle', label: 'Ritual circle' }, { value: 'embers', label: 'Rising embers' }, { value: 'frieze', label: 'Marble frieze' }, { value: 'aether', label: 'Aether field' }];
  const tintsOpts = () => [{ value: 'gold', label: 'Gold' }, { value: 'goldLt', label: 'Pale gold' }, { value: 'terra', label: 'Terra' }];
  const cadenceOpts = () => [{ value: 'daily', label: 'Daily' }, { value: 'weekly', label: 'Weekly' }];
  const dimsOpts = () => (_RC.achDimensions || []).map(d => ({ value: d.id, label: d.en }));
  const statsOpts = () => ['wins', 'sessions', 'bestStreak', 'swift', 'mastered', 'accuracy', 'hours', 'owned'].map(s => ({ value: s, label: s }));
  const equipModelsOpts = () => [{ value: 'single', label: 'Equip one (active)' }, { value: 'none', label: 'Collect only' }];
  const unlockOpts = () => (_RC.cosmetics || []).map(c => ({ value: c.id, label: c.en }));

  // ── field schemas ──
  const boonFields = [{ key: 'el', type: 'text', label: 'Greek name' }, { key: 'en', type: 'text', label: 'English name' }, { key: 'icon', type: 'icon', label: 'Glyph' }, { key: 'effect', type: 'text', label: 'Effect', full: true }, { key: 'price', type: 'num', label: 'Price', min: 0, step: 50 }];
  const consumableFields = boonFields.concat([{ key: 'bundle', type: 'num', label: 'Charges / buy', min: 1 }]);
  const questFields = [{ key: 'el', type: 'text', label: 'Greek name' }, { key: 'en', type: 'text', label: 'Objective' }, { key: 'icon', type: 'icon', label: 'Glyph' }, { key: 'cadence', type: 'select', label: 'Cadence', options: cadenceOpts }, { key: 'weight', type: 'num', label: 'Spawn weight', hint: '1–5', min: 1, max: 5 }, { key: 'goal', type: 'num', label: 'Goal', min: 1 }, { key: 'reward', type: 'num', label: 'Reward', min: 0, step: 10 }];
  const achFields = [{ key: 'el', type: 'text', label: 'Greek name' }, { key: 'en', type: 'text', label: 'English name' }, { key: 'icon', type: 'icon', label: 'Medal glyph' }, { key: 'dim', type: 'select', label: 'Dimension', options: dimsOpts }, { key: 'stat', type: 'select', label: 'Tracks stat', options: statsOpts }, { key: 'goal', type: 'num', label: 'Goal', min: 1 }, { key: 'note', type: 'text', label: 'Inscription', full: true }];
  const offeringFields = [{ key: 'el', type: 'text', label: 'Greek name' }, { key: 'en', type: 'text', label: 'English name' }, { key: 'icon', type: 'icon', label: 'Glyph' }, { key: 'lore', type: 'text', label: 'Lore', full: true }, { key: 'price', type: 'num', label: 'Price', min: 0, step: 50 }, { key: 'sagaGate', type: 'num', label: 'Saga gate', hint: 'chapter # / blank', min: 0 }];
  const coreFields = [{ key: 'el', type: 'text', label: 'Greek name' }, { key: 'en', type: 'text', label: 'English name' }, { key: 'icon', type: 'icon', label: 'Tab glyph' }, { key: 'blurb', type: 'text', label: 'Subtitle', full: true }];
  const customFields = coreFields.concat([{ key: 'equipModel', type: 'select', label: 'Equip model', options: equipModelsOpts }]);
  const chFields = [{ key: 'el', type: 'text', label: 'Greek name' }, { key: 'en', type: 'text', label: 'English name' }, { key: 'goal', type: 'num', label: 'Rites to seal', min: 1 }, { key: 'reward', type: 'num', label: 'Reward', min: 0, step: 50 }, { key: 'unlock', type: 'select', label: 'Unlocks cosmetic', options: unlockOpts, allowEmpty: true, full: true }];
  const dimFields = [{ key: 'el', type: 'text', label: 'Greek name' }, { key: 'en', type: 'text', label: 'English name' }, { key: 'icon', type: 'icon', label: 'Glyph' }];
  // game-reward params (per-game XP/drachma economy)
  const grNumFields = [
    { key: 'baseXp', type: 'num', label: 'Base XP', min: 0 },
    { key: 'baseDrachmas', type: 'num', label: 'Base drachmas', min: 0 },
    { key: 'xpPerScore', type: 'num', label: 'XP / score', min: 0 },
    { key: 'drachmasPerScore', type: 'num', label: 'Drachmas / score', min: 0 },
    { key: 'xpPerStreak', type: 'num', label: 'XP / best-streak', min: 0 },
    { key: 'swiftXp', type: 'num', label: 'Swift bonus XP', min: 0 },
    { key: 'perfectXp', type: 'num', label: 'Perfect XP', min: 0 },
    { key: 'perfectDrachmas', type: 'num', label: 'Perfect drachmas', min: 0 },
    { key: 'weeklyBonusXp', type: 'num', label: 'Weekly 1st-clear XP', min: 0 },
    { key: 'weeklyBonusDrachmas', type: 'num', label: 'Weekly 1st-clear drachmas', min: 0 },
    { key: 'weeklyCapXp', type: 'num', label: 'Weekly XP cap', hint: '0 = none', min: 0 },
    { key: 'weeklyCapDrachmas', type: 'num', label: 'Weekly drachma cap', hint: '0 = none', min: 0 },
  ];
  const grDefaultFields = [{ key: 'el', type: 'text', label: 'Greek name' }, { key: 'en', type: 'text', label: 'English name' }].concat(grNumFields);
  const grOverrideFields = [{ key: 'id', type: 'text', label: 'Game ID', mono: true, placeholder: 'e.g. iliada-arcade', commitOnBlur: true }].concat(grDefaultFields);
  function cosmeticFields(item) {
    const head = [{ key: 'el', type: 'text', label: 'Greek name' }, { key: 'en', type: 'text', label: 'English name' }];
    const tail = [{ key: 'lore', type: 'text', label: 'Lore', full: true }, { key: 'price', type: 'num', label: 'Price (Kleos)', min: 0, step: 50 }, { key: 'sagaGate', type: 'num', label: 'Saga gate', hint: 'chapter # / blank', min: 0 }];
    const extra = item.slot === 'palette' ? [{ key: 'theme', type: 'select', label: 'Live theme', options: themesOpts }]
      : item.slot === 'backdrop' ? [{ key: 'kind', type: 'select', label: 'Ambient kind', options: backdropKinds }]
      : item.slot === 'particle' ? [{ key: 'tint', type: 'select', label: 'Spark tint', options: tintsOpts }]
      : [{ key: 'icon', type: 'icon', label: 'Sigil glyph' }];
    return head.concat(extra, tail);
  }

  // ── collection routing (scope → array / item) ──
  function _pillar(pid) { return (_RC.pillars || []).find(x => x.id === pid) || (_RC.customPillars || []).find(x => x.id === pid); }
  function _collFor(scope) {
    if (scope === 'saga') return _RC.saga.chapters;
    if (scope.indexOf('off:') === 0) { const p = _pillar(scope.slice(4)); return p ? (p.offerings = p.offerings || []) : null; }
    return _RC[scope];
  }
  function _item(scope, id) { const c = _collFor(scope); return c ? c.find(x => x.id === id) : null; }
  // unset a key so it's absent (inherits the default per-field merge), not 0
  function _unset(scope, id, key) { if (scope === 'realm') return; const it = _item(scope, id); if (it) delete it[key]; }

  function _set(scope, id, key, val) {
    if (scope === 'realm') {
      if (key === 'realmTheme') _RC.realmTheme = val;
      else if (key === 'loadoutMax') _RC.loadoutMax = val;
      else if (key === 'rot:daily') { _RC.questRotation = _RC.questRotation || {}; _RC.questRotation.daily = val; }
      else if (key === 'rot:weekly') { _RC.questRotation = _RC.questRotation || {}; _RC.questRotation.weekly = val; }
      return;
    }
    const it = _item(scope, id); if (!it) return;
    it[key] = val;
    if (scope === 'cosmetics' && key === 'theme') {
      const th = window.RT.get(val); if (th) it.swatch = [th.tok.bg, th.tok.accent, th.tok.terra];
    }
  }

  // ══════════════════ FIELD RENDERERS ══════════════════
  function afWrap(label, hint, full, inner) {
    return `<label class="af${full ? ' full' : ''}"><span class="af-l">${esc(label)}${hint ? '<em>' + esc(hint) + '</em>' : ''}</span>${inner}</label>`;
  }
  function afText(label, val, handler, full, mono, ph, evt) {
    const ev = evt || 'input';
    return afWrap(label, '', full, `<input class="af-in${mono ? ' mono' : ''}" value="${esc(val || '')}" ${ph ? 'placeholder="' + esc(ph) + '"' : ''} on${ev}="${handler}"/>`);
  }
  function afNum(label, val, oninput, min, max, step, full, hint) {
    return afWrap(label, hint, full, `<input class="af-in mono" type="number" value="${val == null ? '' : val}" ${min != null ? 'min="' + min + '"' : ''} ${max != null ? 'max="' + max + '"' : ''} step="${step || 1}" oninput="${oninput}"/>`);
  }
  function afSelect(label, val, options, onchange, full, allowEmpty) {
    let opts = allowEmpty ? '<option value="">— none —</option>' : '';
    opts += options.map(o => { const v = typeof o === 'object' ? o.value : o; const l = typeof o === 'object' ? o.label : o; return `<option value="${esc(v)}" ${String(v) === String(val == null ? '' : val) ? 'selected' : ''}>${esc(l)}</option>`; }).join('');
    return afWrap(label, '', full, `<div class="af-sel-wrap"><select class="af-in af-sel" onchange="${onchange}">${opts}</select></div>`);
  }
  function afIcon(label, val, base) {
    const open = _iconOpen === base;
    const pop = open ? '<div class="af-icon-pop">' + _icons().map(n => `<button type="button" class="af-icon-cell${n === val ? ' on' : ''}" title="${esc(n)}" onclick="AdminRealm.pickIcon('${base}','${n}')">${_glyph(n)}</button>`).join('') + '</div>' : '';
    return `<label class="af"><span class="af-l">${esc(label)}</span><button type="button" class="af-icon-btn" onclick="AdminRealm.toggleIcon('${base}')"><span class="af-icon-cur">${_glyph(val || 'wreath')}</span><span class="mono">${esc(val || '—')}</span><span class="af-caret">▾</span></button>${pop}</label>`;
  }
  function afTheme(label, val, base, hint) {
    const grid = window.RT.THEMES.map(th => `<button type="button" class="af-theme${th.id === val ? ' on' : ''}" title="${esc(th.name + ' · ' + th.sub)}" onclick="AdminRealm.pickTheme('${base}','${th.id}')"><span class="af-theme-sw" style="background:${window.RT.swatch(th)}"></span><span class="af-theme-nm">${esc(th.name)}</span></button>`).join('');
    return `<label class="af full"><span class="af-l">${esc(label)}${hint ? '<em>' + esc(hint) + '</em>' : ''}</span><div class="af-theme-grid">${grid}</div></label>`;
  }
  function renderField(scope, item, f) {
    const base = scope + '|' + (item.id || '') + '|' + f.key;
    const v = item[f.key];
    if (f.type === 'text') {
      const th = f.commitOnBlur ? `AdminRealm.fieldRerender('${scope}','${item.id}','${f.key}',this.value)` : `AdminRealm.field('${scope}','${item.id}','${f.key}',this.value)`;
      return afText(f.label, v, th, f.full, f.mono, f.placeholder, f.commitOnBlur ? 'change' : 'input');
    }
    if (f.type === 'num') return afNum(f.label, v, `AdminRealm.fieldNum('${scope}','${item.id}','${f.key}',this.value)`, f.min, f.max, f.step, f.full, f.hint);
    if (f.type === 'select') return afSelect(f.label, v, (typeof f.options === 'function' ? f.options() : f.options), `AdminRealm.field('${scope}','${item.id}','${f.key}',this.value)`, f.full, f.allowEmpty);
    if (f.type === 'icon') return afIcon(f.label, v, base);
    if (f.type === 'theme') return afTheme(f.label, v, base, f.hint);
    return '';
  }

  // ══════════════════ COLLECTION EDITOR ══════════════════
  function collection(opts) {
    const items = opts.items || [];
    let html = opts.groupNote ? `<p class="coll-note">${esc(opts.groupNote)}</p>` : '';
    html += '<div class="coll-list">' + items.map((item, i) => {
      const open = _openId === item.id;
      const flds = opts.fieldsFor ? opts.fieldsFor(item) : opts.fields;
      const g = opts.glyphOf ? opts.glyphOf(item) : (item.icon || 'wreath');
      const title = opts.titleOf ? opts.titleOf(item) : item.el;
      const sub = opts.subOf ? opts.subOf(item) : item.en;
      let tools = '';
      if (!opts.noTools) {
        tools += `<button class="coll-mini" title="Move up" ${i === 0 ? 'disabled' : ''} onclick="event.stopPropagation();AdminRealm.move('${opts.scope}','${item.id}',-1)">↑</button>`;
        tools += `<button class="coll-mini" title="Move down" ${i === items.length - 1 ? 'disabled' : ''} onclick="event.stopPropagation();AdminRealm.move('${opts.scope}','${item.id}',1)">↓</button>`;
        tools += `<button class="coll-mini danger" title="Delete" onclick="event.stopPropagation();AdminRealm.del('${opts.scope}','${item.id}')">✕</button>`;
      }
      tools += `<span class="coll-caret">${open ? '▾' : '▸'}</span>`;
      const form = open ? `<div class="coll-form">${flds.map(f => renderField(opts.scope, item, f)).join('')}</div>` : '';
      return `<div class="coll-row${open ? ' open' : ''}"><div class="coll-head" onclick="AdminRealm.toggle('${item.id}')"><span class="coll-glyph">${_glyph(g)}</span><div class="coll-titles"><b class="gk">${esc(title)}</b><span>${esc(sub)}</span></div><div class="coll-tools">${tools}</div></div>${form}</div>`;
    }).join('') + '</div>';
    if (opts.addHandler) html += `<button class="coll-add${opts.addLg ? ' lg' : ''}" onclick="${opts.addHandler}"><span>＋</span> ${esc(opts.addLabel || 'Add')}</button>`;
    return html;
  }

  // ══════════════════ SECTIONS ══════════════════
  function panelHead(el, en, blurb) { return `<div class="cur-sec-head"><h2 class="gk">${esc(el)}</h2><span class="cur-sec-en">${esc(en)}</span>${blurb ? '<p>' + esc(blurb) + '</p>' : ''}</div>`; }

  const SECTIONS = {
    realm() {
      return panelHead('Ὁ Ναός', 'The Realm', 'The realm theme tints every surface — this console, the preview, and the live player. Choose the house palette below.')
        + afTheme('Realm theme', _RC.realmTheme, 'realm||realmTheme', 'adapts all colors')
        + '<div class="cur-grid2" style="margin-top:18px">'
        + afNum('Loadout slots', _RC.loadoutMax, "AdminRealm.fieldNum('realm','','loadoutMax',this.value)", 1, 6, 1, false, 'equipped boons')
        + afNum('Daily quests in rotation', _RC.questRotation.daily, "AdminRealm.fieldNum('realm','','rot:daily',this.value)", 1, 6)
        + afNum('Weekly quests in rotation', _RC.questRotation.weekly, "AdminRealm.fieldNum('realm','','rot:weekly',this.value)", 1, 4)
        + '</div>';
    },
    pillars() {
      let h = panelHead('Κίονες', 'Pillars', 'The four core pillars are always present — edit their copy and glyph. Add your own side panels below; each holds offerings you define.');
      h += '<h3 class="cur-sub">Core pillars</h3>' + collection({ items: _RC.pillars, fields: coreFields, scope: 'pillars', noTools: true, glyphOf: p => p.icon });
      h += '<p class="coll-note" style="margin-top:6px">Core pillars cannot be removed or reordered.</p>';
      h += '<h3 class="cur-sub" style="margin-top:22px">Custom side panels</h3>';
      h += (_RC.customPillars || []).map(p => {
        const head = `<div class="cur-pillar-head"><span class="coll-glyph">${_glyph(p.icon)}</span><div class="coll-titles"><b class="gk">${esc(p.el)}</b><span>${esc(p.en)} · ${(p.offerings || []).length} offerings</span></div><div class="coll-tools"><button class="coll-mini danger" title="Delete panel" onclick="AdminRealm.del('customPillars','${p.id}')">✕</button></div></div>`;
        const form = `<div class="coll-form">${customFields.map(f => renderField('customPillars', p, f)).join('')}</div>`;
        const offs = `<div class="cur-offerings"><div class="cur-offerings-l">Offerings</div>${collection({ items: p.offerings || [], fields: offeringFields, scope: 'off:' + p.id, glyphOf: o => o.icon, addLabel: 'Add offering', addHandler: `AdminRealm.addOffering('${p.id}')` })}</div>`;
        return `<div class="cur-pillar">${head}${form}${offs}</div>`;
      }).join('');
      h += `<button class="coll-add lg" onclick="AdminRealm.add('customPillars')"><span>＋</span> New side panel</button>`;
      return h;
    },
    cosmetics() {
      let h = panelHead('Ἀφιερώματα', 'Cosmetics', 'Slot-based unlockables. Palettes drive the live theme; backdrops swap the ambience; sigils restyle the Kleos mark.');
      h += (_RC.cosmeticSlots || []).map(slot => {
        const items = _RC.cosmetics.filter(c => c.slot === slot.id);
        return `<div class="cur-slotgroup"><h3 class="cur-sub"><span class="cur-sub-gk">${esc(slot.el)}</span> ${esc(slot.en)}</h3>`
          + collection({ items, fieldsFor: cosmeticFields, scope: 'cosmetics', glyphOf: c => c.icon || (c.slot === 'palette' ? 'column' : c.slot === 'backdrop' ? 'acropolis' : c.slot === 'particle' ? 'lightning' : 'wreath'), addLabel: 'Add ' + slot.en.toLowerCase(), addHandler: `AdminRealm.addCosmetic('${slot.id}')` })
          + `</div>`;
      }).join('');
      return h;
    },
    boons() {
      return panelHead('Εὐλογίες', 'Boons & Lifelines', 'Perks are equipped into the loadout; lifelines are consumable charges carried across sessions.')
        + '<h3 class="cur-sub">Perks</h3>' + collection({ items: _RC.boons, fields: boonFields, scope: 'boons', glyphOf: b => b.icon, addLabel: 'Add perk', addHandler: "AdminRealm.add('boons')" })
        + '<h3 class="cur-sub" style="margin-top:22px">Lifelines</h3>' + collection({ items: _RC.consumables, fields: consumableFields, scope: 'consumables', glyphOf: c => c.icon, addLabel: 'Add lifeline', addHandler: "AdminRealm.add('consumables')" });
    },
    quests() {
      const daily = _RC.quests.filter(q => q.cadence === 'daily'), weekly = _RC.quests.filter(q => q.cadence === 'weekly');
      return panelHead('Ἆθλοι', 'Quests', 'A pool of objectives. Each period the realm rolls a weighted subset into rotation — higher weight, likelier to appear.')
        + '<div class="cur-grid2">'
        + afNum('Daily in rotation', _RC.questRotation.daily, "AdminRealm.fieldNum('realm','','rot:daily',this.value)", 1, 6)
        + afNum('Weekly in rotation', _RC.questRotation.weekly, "AdminRealm.fieldNum('realm','','rot:weekly',this.value)", 1, 4)
        + '</div>'
        + `<div class="cur-roll"><button class="cur-btn" onclick="AdminRealm.previewRoll()">${_glyph('gear')} Preview a roll</button><div id="cur-roll-out"></div></div>`
        + '<h3 class="cur-sub" style="margin-top:18px">Daily pool</h3>' + collection({ items: daily, fields: questFields, scope: 'quests', glyphOf: q => q.icon, subOf: q => q.en + ' · w' + (q.weight || 1), addLabel: 'Add daily quest', addHandler: "AdminRealm.addQuest('daily')" })
        + '<h3 class="cur-sub" style="margin-top:22px">Weekly pool</h3>' + collection({ items: weekly, fields: questFields, scope: 'quests', glyphOf: q => q.icon, subOf: q => q.en + ' · w' + (q.weight || 1), addLabel: 'Add weekly quest', addHandler: "AdminRealm.addQuest('weekly')" });
    },
    saga() {
      return panelHead('Τὸ Ἔπος', 'The Saga', 'One long sequential arc that advances across many sessions and gates premium cosmetics.')
        + collection({ items: _RC.saga.chapters, fields: chFields, scope: 'saga', glyphOf: () => 'timeline', addLabel: 'Add chapter', addHandler: 'AdminRealm.addChapter()' });
    },
    achievements() {
      return panelHead('Τρόπαια', 'Achievements', 'Milestone medals grouped by dimension. Each tracks a lifetime stat toward a goal.')
        + '<h3 class="cur-sub">Dimensions</h3>' + collection({ items: _RC.achDimensions, fields: dimFields, scope: 'achDimensions', glyphOf: d => d.icon, addLabel: 'Add dimension', addHandler: "AdminRealm.add('achDimensions')" })
        + '<h3 class="cur-sub" style="margin-top:22px">Medals</h3>' + collection({ items: _RC.achievements, fields: achFields, scope: 'achievements', glyphOf: a => a.icon, addLabel: 'Add medal', addHandler: "AdminRealm.add('achievements')" });
    },
    gameRewards() {
      const rows = _RC.gameRewards || [];
      const def = rows.find(g => g.id === 'default');
      const overrides = rows.filter(g => g.id !== 'default');
      let h = panelHead('Δῶρα Παιχνιδιῶν', 'Game Rewards', 'What each game pays out in XP and drachmas. The Default applies to every game; add an override to tune a specific one. Weekly caps refill — and the first-clear bonus re-arms — every Sunday.');
      h += '<h3 class="cur-sub">Default payout</h3>';
      h += def
        ? collection({ items: [def], fields: grDefaultFields, scope: 'gameRewards', noTools: true, glyphOf: () => 'trophy', titleOf: g => g.el, subOf: () => 'default · all games' })
        : '<p class="coll-note">No default entry — add one (id "default").</p>';
      h += '<h3 class="cur-sub" style="margin-top:22px">Per-game overrides</h3>';
      h += '<p class="coll-note">Set <b>Game ID</b> to the game’s id (its folder name, e.g. iliada-arcade). Any field left at its value still falls back to the Default per-field — overrides only replace the keys you set.</p>';
      h += collection({ items: overrides, fields: grOverrideFields, scope: 'gameRewards', glyphOf: () => 'cards', titleOf: g => g.el, subOf: g => g.en + ' · ' + (g.id || '—'), addLabel: 'Add game override', addHandler: 'AdminRealm.addGameReward()' });
      return h;
    },
  };

  const AD_SECTIONS = [
    { id: 'realm', el: 'Ὁ Ναός', en: 'Realm & Theme', icon: 'acropolis' },
    { id: 'pillars', el: 'Κίονες', en: 'Pillars', icon: 'column' },
    { id: 'cosmetics', el: 'Ἀφιερώματα', en: 'Cosmetics', icon: 'cards' },
    { id: 'boons', el: 'Εὐλογίες', en: 'Boons', icon: 'lightning' },
    { id: 'quests', el: 'Ἆθλοι', en: 'Quests', icon: 'scroll' },
    { id: 'saga', el: 'Τὸ Ἔπος', en: 'The Saga', icon: 'timeline' },
    { id: 'achievements', el: 'Τρόπαια', en: 'Achievements', icon: 'trophy' },
    { id: 'gameRewards', el: 'Δῶρα', en: 'Game Rewards', icon: 'gear' },
  ];

  // ══════════════════ SHELL / RENDER ══════════════════
  function shell() {
    return `<div class="cur-root" id="cur-root">
      <aside class="cur-nav">
        <div class="cur-brand"><span class="crest" style="width:34px;height:34px;color:var(--sym-accent)">${_glyph('acropolis')}</span><div><h1 class="gk">Ἱεροφάντης</h1><span class="cur-brand-en">Curator’s Console</span></div></div>
        <nav class="cur-nav-list" id="cur-nav-list"></nav>
        <div class="cur-nav-foot">
          <button class="cur-btn full" onclick="AdminRealm.openDrawer()">${_glyph('scroll')} Realm data / export</button>
          <button class="cur-btn ghost full" onclick="AdminRealm.reset()">Reset to default</button>
        </div>
      </aside>
      <main class="cur-main">
        <div class="cur-editor"><div class="cur-section" id="cur-editor"></div></div>
        <div class="cur-preview">
          <div class="cur-preview-bar"><span class="cur-preview-l">${_glyph('cyclops-eye')} Live preview</span><a class="cur-open" onclick="AdminRealm.openPlayer()">Open full player ↗</a></div>
          <div class="cur-preview-stage" id="cur-preview-stage"><div class="cur-preview-frame" id="cur-preview-frame"></div></div>
          <div class="cur-preview-foot">Edits on the left appear here instantly — and in any open player tab.</div>
        </div>
      </main>
      <div id="cur-drawer-host"></div>
    </div>`;
  }
  function renderNav() {
    const host = document.getElementById('cur-nav-list'); if (!host) return;
    host.innerHTML = AD_SECTIONS.map(s => `<button class="cur-nav-b${_sec === s.id ? ' on' : ''}" onclick="AdminRealm.section('${s.id}')"><span class="cur-nav-ic">${_glyph(s.icon)}</span><span class="cur-nav-l"><b class="gk">${esc(s.el)}</b><span>${esc(s.en)}</span></span></button>`).join('');
  }
  function renderEditor() {
    const host = document.getElementById('cur-editor'); if (!host) return;
    host.innerHTML = (SECTIONS[_sec] || SECTIONS.realm)();
  }
  function retint() {
    const root = document.getElementById('cur-root');
    if (root && window.RT) window.RT.apply(root, _RC.realmTheme || 'obsidian');
  }
  function renderPreview() {
    if (!window.Temple || !Temple.renderInto) return;
    Temple.renderInto('cur-preview-frame', _RC.realmTheme);
    const stage = document.getElementById('cur-preview-stage'), frame = document.getElementById('cur-preview-frame');
    if (stage && frame) {
      const s = Math.min((stage.clientWidth - 28) / 1180, (stage.clientHeight - 28) / 760);
      frame.style.transform = 'scale(' + Math.max(0.12, s) + ')';
    }
  }
  function _schedulePreview() { clearTimeout(_previewTimer); _previewTimer = setTimeout(renderPreview, 180); }

  // apply edits live + persist (debounced); optionally re-render the editor
  function _commit(rerender) {
    try { window.RealmStore.applyLocal(_RC); } catch (e) {}
    clearTimeout(_saveTimer);
    _saveTimer = setTimeout(() => { window.RealmStore.save(_RC).catch(e => console.warn('[realm-admin] save failed', e)); }, 600);
    _schedulePreview();
    if (rerender) renderEditor();
  }

  // ══════════════════ ADD DEFAULTS ══════════════════
  function _mkCosmetic(slotId) {
    const base = { id: _uid(slotId), slot: slotId, el: 'Νέον', en: 'New ' + slotId, lore: '', price: 500 };
    if (slotId === 'palette') { base.theme = 'obsidian'; const th = window.RT.get('obsidian'); base.swatch = [th.tok.bg, th.tok.accent, th.tok.terra]; }
    if (slotId === 'backdrop') base.kind = 'circle';
    if (slotId === 'particle') base.tint = 'gold';
    if (slotId === 'sigil') base.icon = 'wreath';
    return base;
  }
  function _mk(scope) {
    switch (scope) {
      case 'boons': return { id: _uid('bn'), el: 'Νέον', en: 'New Boon', icon: 'lightning', effect: 'Describe the favor.', price: 1000 };
      case 'consumables': return { id: _uid('cs'), el: 'Νέον', en: 'New Lifeline', icon: 'shield-round', effect: 'Describe the charge.', price: 250, bundle: 3 };
      case 'achievements': return { id: _uid('a'), dim: (_RC.achDimensions[0] || {}).id || 'volume', el: 'Νέον', en: 'New Medal', icon: 'shield-round', goal: 100, stat: 'wins', note: 'Describe the feat.' };
      case 'achDimensions': return { id: _uid('dim'), el: 'Νέον', en: 'New Dimension', icon: 'trophy' };
      case 'customPillars': return { id: _uid('pil'), el: 'Νέον', en: 'New Panel', icon: 'column', blurb: 'A new dedication', equipModel: 'single', offerings: [] };
      default: return { id: _uid('x'), el: 'Νέον', en: 'New', icon: 'wreath', price: 500 };
    }
  }

  // ══════════════════ PUBLIC HANDLERS ══════════════════
  const AdminRealm = {
    section(id) { _sec = id; _openId = null; _iconOpen = null; renderNav(); renderEditor(); },
    toggle(id) { _openId = (_openId === id ? null : id); _iconOpen = null; renderEditor(); },
    toggleIcon(base) { _iconOpen = (_iconOpen === base ? null : base); renderEditor(); },
    field(scope, id, key, val) { _set(scope, id, key, val); _commit(false); },
    fieldNum(scope, id, key, val) { if (val === '') _unset(scope, id, key); else _set(scope, id, key, Number(val)); _commit(false); },
    // commit-on-blur + re-render (used by the Game-ID field, whose value IS the row key)
    fieldRerender(scope, id, key, val) { _set(scope, id, key, val); if (key === 'id' && _openId === id) _openId = val; _commit(true); },
    pickIcon(base, name) { const p = base.split('|'); _set(p[0], p[1], p[2], name); _iconOpen = null; _commit(true); },
    pickTheme(base, themeId) {
      const p = base.split('|'); _set(p[0], p[1], p[2], themeId);
      if (p[0] === 'realm') retint();
      _commit(true);
    },
    add(scope) { const c = _collFor(scope); if (c) { c.push(_mk(scope)); _commit(true); } },
    addCosmetic(slotId) { _RC.cosmetics.push(_mkCosmetic(slotId)); _commit(true); },
    addOffering(pid) { const p = _pillar(pid); if (p) { (p.offerings = p.offerings || []).push({ id: _uid('of'), el: 'Νέον', en: 'New Offering', icon: 'wreath', price: 500, lore: '' }); _commit(true); } },
    addQuest(cadence) { _RC.quests.push({ id: _uid(cadence === 'weekly' ? 'w' : 'q'), cadence, weight: 3, el: 'Νέον', en: 'New ' + cadence, icon: 'scroll', goal: cadence === 'weekly' ? 20 : 3, reward: cadence === 'weekly' ? 600 : 120 }); _commit(true); },
    addChapter() { _RC.saga.chapters.push({ id: _uid('s'), el: 'Νέον', en: 'New Chapter', goal: 6, reward: 300 }); _commit(true); },
    addGameReward() {
      // seed only id/labels — every numeric field stays UNSET so it inherits
      // the Default per-field; the admin overrides only the keys they set.
      (_RC.gameRewards = _RC.gameRewards || []).push({ id: _uid('game'), el: 'Νέον', en: 'New Game' });
      _commit(true);
    },
    del(scope, id) {
      if (scope === 'customPillars') { _RC.customPillars = (_RC.customPillars || []).filter(x => x.id !== id); _commit(true); return; }
      const c = _collFor(scope); if (!c) return; const i = c.findIndex(x => x.id === id); if (i >= 0) c.splice(i, 1);
      if (_openId === id) _openId = null;
      _commit(true);
    },
    move(scope, id, dir) {
      const c = _collFor(scope); if (!c) return; const i = c.findIndex(x => x.id === id), j = i + dir;
      if (i < 0 || j < 0 || j >= c.length) return; const t = c[i]; c[i] = c[j]; c[j] = t; _commit(true);
    },
    previewRoll() {
      const r = window.RealmStore.rollQuests();
      const name = id => { const q = _RC.quests.find(x => x.id === id); return q ? q.en : id; };
      const out = document.getElementById('cur-roll-out');
      if (out) out.innerHTML = `<div class="cur-roll-out"><span><b>Daily:</b> ${r.daily.map(name).map(esc).join(' · ')}</span><span><b>Weekly:</b> ${r.weekly.map(name).map(esc).join(' · ')}</span></div>`;
    },
    openPlayer() { if (typeof navToTemple === 'function') navToTemple(); },

    openDrawer() {
      const host = document.getElementById('cur-drawer-host'); if (!host) return;
      const json = JSON.stringify(window.RealmStore.getCatalog(), null, 2);
      host.innerHTML = `<div class="cur-drawer-scrim" onclick="AdminRealm.closeDrawer(event)"><div class="cur-drawer" onclick="event.stopPropagation()"><div class="cur-drawer-head"><h3 class="gk">Realm data</h3><button class="coll-mini" onclick="AdminRealm.closeDrawer()">✕</button></div><p class="coll-note">The full realm config as JSON. Hand this to engineering to seed real accounts, or paste an edited realm and apply.</p><textarea class="cur-json" id="cur-json" spellcheck="false">${esc(json)}</textarea><div class="cur-drawer-foot"><span class="cur-msg" id="cur-drawer-msg"></span><button class="cur-btn" onclick="AdminRealm.downloadJson()">Download JSON</button><button class="cur-btn solid" onclick="AdminRealm.applyJson()">Apply realm</button></div></div></div>`;
    },
    closeDrawer(e) { if (e && e.target && !e.target.classList.contains('cur-drawer-scrim') && e.type === 'click' && e.target.id !== '') { /* noop */ } const host = document.getElementById('cur-drawer-host'); if (host) host.innerHTML = ''; },
    applyJson() {
      const ta = document.getElementById('cur-json'), msg = document.getElementById('cur-drawer-msg');
      try {
        const obj = JSON.parse(ta.value);
        window.RealmStore.applyLocal(obj);
        window.RealmStore.save(obj).catch(() => {});
        _RC = window.RealmStore.getCatalog();
        renderEditor(); retint(); renderPreview();
        if (msg) { msg.textContent = 'Realm applied.'; setTimeout(() => { if (msg) msg.textContent = ''; }, 1800); }
      } catch (err) { if (msg) msg.textContent = 'Invalid JSON — ' + err.message; }
    },
    downloadJson() {
      const ta = document.getElementById('cur-json');
      const blob = new Blob([ta.value], { type: 'application/json' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'temple-realm.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    },
    reset() {
      if (!confirm('Reset the whole realm to the factory default? This cannot be undone.')) return;
      const def = window.RealmStore.default();
      window.RealmStore.applyLocal(def);
      window.RealmStore.save(def).catch(() => {});
      _RC = window.RealmStore.getCatalog();
      renderNav(); renderEditor(); retint(); renderPreview();
    },
  };

  function _adminRealmInit() {
    if (typeof isAdmin === 'undefined' || !isAdmin) return;
    const pane = document.getElementById('admin-tab-realm'); if (!pane) return;
    if (!window.RealmStore) { pane.innerHTML = '<p style="padding:20px;color:#999">Realm store unavailable.</p>'; return; }
    _RC = window.RealmStore.getCatalog();
    if (!pane.querySelector('.cur-root')) {
      pane.innerHTML = shell();
      if (!_resizeBound) { window.addEventListener('resize', () => { if (document.getElementById('cur-preview-frame')) renderPreview(); }); _resizeBound = true; }
    }
    renderNav(); renderEditor(); retint(); renderPreview();
  }

  window.AdminRealm = AdminRealm;
  window._adminRealmInit = _adminRealmInit;
})();
