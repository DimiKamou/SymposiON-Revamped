// ============================================================
//  SymposiON — Ναὸς τῶν Μουσῶν (Temple of the Muses)
//  REALM LOADER — the shared, admin-authored economy catalog for the
//  Synthesis app. Adapted from the Ver1 (paideia) RealmStore, re-homed
//  onto SymStore persistence (localStorage, namespaced sym_revamp_) with
//  an OPTIONAL Firestore mirror (config/realm) that degrades to
//  SymStore-only whenever Firebase is absent — so it never throws in the
//  sandbox.
//
//  The editable "Temple economy" catalog is SOURCED FROM window.SYM:
//    • cosmetics  ← SYM.ACROTERIA  (the altar sculptures / sigils)
//    • achievements / dimensions ← SYM.ACHIEVEMENTS / SYM.ACH_CATS
//  …and falls back to a bundled factory seed for the parts SYM does not
//  model directly (palettes/backdrops/particles, boons, consumables,
//  quests pool, saga chapters, custom pillars, per-game rewards).
//  A SymStore override ('realm_catalog'), if present, is merged on top.
//
//  This module exposes (consumed by js/admin-realm.js — the Curator's
//  Console — and, where feasible, the player Temple/Agora screen):
//    window.RealmStore = {
//      getCatalog()  → clone of the effective, editable catalog
//      default()     → clone of the factory seed (for "Reset to default")
//      applyLocal(o) → apply edits in-memory + re-render live (symRender)
//      save(o)       → Promise: persist to SymStore + mirror to Firestore
//      rollQuests()  → { daily:[ids…], weekly:[ids…] } weighted spawn
//      rollCadence(c)
//      seed()        → publish the factory seed (admin / Firestore)
//    }
//    window.getRealm()        → the live, built read-model (override⊕seed)
//    window.realmItem(id)     → any catalog item by id
//    window.questsByCadence(c)
//    window.onRealm(fn)/offRealm(fn) — subscribe to live changes
//    window.RT     — Temple theme library (THEMES/get/swatch/apply)
//    window.Temple — minimal helpers the Curator's Console needs:
//                    Temple.glyph(name)  → inline SVG line-icon
//                    Temple.renderInto(containerId, themeId) → preview
//
//  Load order: include BEFORE js/admin-realm.js (the orchestrator wires
//  the <script> tag in index.html).
// ============================================================
(function () {
  'use strict';

  // ── small helpers ────────────────────────────────────────────
  const clone = o => (window.structuredClone ? structuredClone(o) : JSON.parse(JSON.stringify(o)));
  const _SY = () => window.SYM || {};
  const _L = o => {
    if (o == null) return '';
    if (typeof o === 'string') return o;
    if (typeof window.L === 'function') return window.L(o);
    return o.gr || o.en || '';
  };
  const _SS = () => window.SymStore || null;
  const STORE_KEY = 'realm_catalog';     // SymStore namespaced key
  const REALM_DOC = ['config', 'realm']; // Firestore mirror

  // ══════════════════════════════════════════════════════════════
  //  ICON / THEME library (window.RT) — a complete named-palette set.
  //  Ported from the Ver1 temple-themes.js so the Curator's Console can
  //  tint its surfaces and the palette cosmetics can drive a live theme.
  //  Provided here because Synthesis ships no separate temple-themes.js.
  // ══════════════════════════════════════════════════════════════
  if (!window.RT) {
    const RTM = (function () {
      const T = (id, name, sub, group, season, light, tok, locked) =>
        ({ id, name, sub, group, season, light: !!light, locked: !!locked, tok });
      const GOLD = { gold: '#D2A24A', goldLt: '#F2CD78', goldDk: '#9E7322' };
      const THEMES = [
        T('obsidian', 'Obsidian', 'black · gold', 'obsidian', '', false,
          { bg: '#0A0907', panel: '#15120D', fg: '#F1E9D6', muted: '#897A5A', ...GOLD, terra: '#E07A3C', accent: '#D2A24A', accent2: '#E07A3C' }),
        T('obsidian-katabasis', 'Katabasis', 'obsidian · Halloween', 'obsidian', 'halloween', false,
          { bg: '#0C0810', panel: '#181122', fg: '#F2E7D8', muted: '#8A7596', ...GOLD, terra: '#ED7A28', accent: '#ED7A28', accent2: '#8A63B6' }),
        T('obsidian-solstice', 'Solstice', 'obsidian · Christmas', 'obsidian', 'christmas', false,
          { bg: '#080B08', panel: '#121710', fg: '#EFEAD9', muted: '#7E876E', gold: '#D8B45A', goldLt: '#F0D688', goldDk: '#A6862A', terra: '#C23A2E', accent: '#C23A2E', accent2: '#3C8459' }),
        T('orphic', 'Orphic Night', 'black · iridescent', 'locked', 'halloween', false,
          { bg: '#06080C', panel: '#0F1422', fg: '#E6E8F0', muted: '#7C84A0', gold: '#B9A6E0', goldLt: '#D8CCF2', goldDk: '#7C6CA8', terra: '#6FA8C9', accent: '#8E7FD6', accent2: '#6FC9B0' }, true),
        T('hearth', 'Hearth', 'warm dark · terra', 'classic', '', false,
          { bg: '#18120A', panel: '#261B12', fg: '#F0EBE0', muted: '#867660', gold: '#C4A448', goldLt: '#E2C868', goldDk: '#917722', terra: '#D97B5C', accent: '#C4A448', accent2: '#D97B5C' }),
        T('aegean', 'Aegean', 'midnight sea · copper', 'classic', '', false,
          { bg: '#0B1018', panel: '#142030', fg: '#E8E1D0', muted: '#7C8896', gold: '#D2B36A', goldLt: '#EAD08C', goldDk: '#9A8038', terra: '#E0894C', accent: '#D2B36A', accent2: '#5E8B96' }),
        T('amphora', 'Amphora', 'black-figure · Attic red', 'classic', '', false,
          { bg: '#15100A', panel: '#201810', fg: '#E8D9BA', muted: '#8A7958', gold: '#D49A2A', goldLt: '#EDBE52', goldDk: '#A0701A', terra: '#D14A1F', accent: '#D14A1F', accent2: '#D49A2A' }),
        T('olive', 'Olive Grove', 'green · gold', 'vivid', '', false,
          { bg: '#14180E', panel: '#1F2614', fg: '#ECE8D6', muted: '#8A916F', gold: '#C7B24A', goldLt: '#E6D77E', goldDk: '#93812A', terra: '#8AA84E', accent: '#8AA84E', accent2: '#C7B24A' }),
        T('saffron', 'Saffron', 'orange · amber', 'vivid', '', false,
          { bg: '#1A1006', panel: '#271709', fg: '#F8E9D2', muted: '#B0906A', gold: '#E8A23A', goldLt: '#FBC97E', goldDk: '#B0701C', terra: '#E8732A', accent: '#E8862A', accent2: '#D6A93E' }),
        T('amethyst', 'Amethyst', 'violet · rose', 'vivid', '', false,
          { bg: '#120C1C', panel: '#1E1430', fg: '#ECE4F6', muted: '#9486AE', gold: '#C9A24A', goldLt: '#E6C878', goldDk: '#8E6E20', terra: '#9B6FD6', accent: '#9B6FD6', accent2: '#D46AA8' }),
        T('cyprus', 'Cyprus Teal', 'teal · brass', 'vivid', '', false,
          { bg: '#07181A', panel: '#0F2A2C', fg: '#DDEAE6', muted: '#6F9893', gold: '#C9B25A', goldLt: '#E6D484', goldDk: '#937F2E', terra: '#2FA89A', accent: '#2FA89A', accent2: '#C9B25A' }),
        T('alabaster', 'Alabaster', 'Pentelic marble', 'alabaster', '', true,
          { bg: '#F1ECDF', panel: '#FBF8F0', fg: '#2A2117', muted: '#8C8170', gold: '#9A7C31', goldLt: '#C2A24E', goldDk: '#6F5820', terra: '#C2562C', accent: '#C2562C', accent2: '#9A7C31' }),
        T('golden-fleece', 'Golden Fleece', 'pure radiant gold', 'locked', '', false,
          { bg: '#1C1404', panel: '#2C2008', fg: '#FBEFCF', muted: '#BBA068', gold: '#F0C24A', goldLt: '#FFE08C', goldDk: '#BC8C1E', terra: '#E8A53A', accent: '#F0C24A', accent2: '#E8A53A' }, true),
      ];
      const GROUPS = [['obsidian', 'Obsidian'], ['alabaster', 'Alabaster'], ['classic', 'Classic'], ['vivid', 'Vivid'], ['locked', 'Unlockable']];
      const byId = {}; THEMES.forEach(t => byId[t.id] = t);
      function swatch(t) {
        const k = t.tok;
        return `linear-gradient(135deg, ${k.bg} 0%, ${k.bg} 26%, ${k.panel} 27%, ${k.panel} 46%, ${k.accent2} 47%, ${k.accent2} 64%, ${k.gold} 65%, ${k.gold} 82%, ${k.accent} 83%)`;
      }
      const mix = (c, pct, other) => `color-mix(in srgb, ${c} ${pct}%, ${other})`;
      function apply(el, id) {
        const t = byId[id] || byId.obsidian; if (!el || !t) return null;
        const k = t.tok, light = t.light, set = (p, v) => el.style.setProperty(p, v);
        set('--sym-bg', k.bg); set('--sym-bg-card', k.panel);
        set('--sym-bg-raise', light ? '#ffffff' : mix(k.panel, 86, k.fg));
        set('--sym-ink', light ? k.fg : k.bg);
        set('--sym-fg', k.fg); set('--sym-fg-muted', k.muted);
        set('--sym-gold', k.gold); set('--sym-gold-lt', k.goldLt); set('--sym-gold-dk', k.goldDk);
        set('--sym-terra', k.terra); set('--sym-accent', k.accent); set('--sym-accent2', k.accent2);
        set('--sym-hairline', mix(k.accent, light ? 16 : 18, 'transparent'));
        set('--gold-grad', `linear-gradient(135deg, ${k.goldLt} 0%, ${k.gold} 46%, ${k.goldDk} 100%)`);
        el.classList.toggle('is-light', !!light);
        return t;
      }
      return { THEMES, GROUPS, byId, get: id => byId[id], swatch, apply };
    })();
    window.RT = RTM;
  }

  // ══════════════════════════════════════════════════════════════
  //  Temple — minimal helpers required by the Curator's Console:
  //  glyph(name)  → a classical SVG line-icon (the icon picker grid);
  //  renderInto() → a lightweight Temple preview into a container.
  //  (Provided here because Synthesis ships no separate temple.js.)
  // ══════════════════════════════════════════════════════════════
  if (!window.Temple) {
    const G = {
      acropolis: '<path d="M 16 30 L 50 14 L 86 30"/><line x1="18" y1="38" x2="84" y2="38"/><line x1="18" y1="34" x2="84" y2="34"/><line x1="22" y1="72" x2="22" y2="40"/><line x1="32" y1="72" x2="32" y2="40"/><line x1="42" y1="72" x2="42" y2="40"/><line x1="52" y1="72" x2="52" y2="40"/><line x1="62" y1="72" x2="62" y2="40"/><line x1="72" y1="72" x2="72" y2="40"/><line x1="16" y1="78" x2="84" y2="78"/><path d="M 4 86 Q 22 80 50 80 Q 78 80 96 86" stroke-opacity="0.5"/>',
      cards: '<rect x="14" y="32" width="32" height="48" rx="2" transform="rotate(-8 30 56)"/><rect x="36" y="22" width="32" height="48" rx="2"/><rect x="58" y="34" width="28" height="48" rx="2" transform="rotate(8 72 58)"/>',
      chariot: '<circle cx="78" cy="74" r="10"/><line x1="68" y1="74" x2="88" y2="74"/><line x1="78" y1="64" x2="78" y2="84"/><path d="M 64 56 L 90 56 L 90 70 L 64 70 Z"/><line x1="34" y1="50" x2="64" y2="64"/><path d="M 8 54 L 34 54 L 32 64 L 10 64 Z" stroke-opacity="0.7"/>',
      column: '<rect x="28" y="12" width="44" height="5"/><path d="M 32 17 Q 32 22 36 22 L 64 22 Q 68 22 68 17"/><line x1="36" y1="24" x2="34" y2="80"/><line x1="64" y1="24" x2="66" y2="80"/><line x1="48" y1="26" x2="48" y2="78" stroke-opacity="0.45"/><path d="M 32 80 Q 32 86 36 86 L 64 86 Q 68 86 68 80"/><rect x="28" y="86" width="44" height="4"/>',
      'cyclops-eye': '<path d="M 16 50 Q 50 26 84 50 Q 50 74 16 50 Z"/><circle cx="50" cy="50" r="12"/><circle cx="50" cy="50" r="4" fill="currentColor"/>',
      gear: '<circle cx="50" cy="50" r="18"/><circle cx="50" cy="50" r="6"/><rect x="46" y="14" width="8" height="10"/><rect x="46" y="76" width="8" height="10"/><rect x="14" y="46" width="10" height="8"/><rect x="76" y="46" width="10" height="8"/><rect x="23" y="23" width="10" height="8" transform="rotate(-45 28 27)"/><rect x="67" y="23" width="10" height="8" transform="rotate(45 72 27)"/><rect x="23" y="69" width="10" height="8" transform="rotate(45 28 73)"/><rect x="67" y="69" width="10" height="8" transform="rotate(-45 72 73)"/>',
      helmet: '<path d="M 22 24 Q 28 8 38 22 Q 44 8 54 22 Q 60 8 70 22 Q 76 8 82 24"/><path d="M 22 24 Q 50 30 82 24"/><path d="M 26 28 Q 24 56 32 70 L 70 70 Q 78 56 76 28"/><path d="M 38 44 L 38 58 Q 38 64 44 64 L 50 64 L 50 76 L 54 76 L 54 64 L 60 64 Q 62 64 62 58 L 62 44 Z"/>',
      labyrinth: '<rect x="14" y="14" width="72" height="72"/><path d="M 22 22 L 78 22 L 78 78 L 28 78 L 28 30 L 70 30 L 70 70 L 36 70 L 36 38 L 62 38 L 62 62 L 44 62 L 44 46 L 54 46 L 54 54 L 50 54"/><circle cx="50" cy="50" r="2" fill="currentColor"/>',
      lightning: '<path d="M 56 10 L 30 50 L 48 50 L 38 90 L 70 44 L 52 44 L 60 10 Z"/>',
      runner: '<circle cx="58" cy="22" r="7"/><path d="M 56 30 L 50 48 L 38 60"/><path d="M 50 48 L 62 56 L 56 74 L 44 86"/><path d="M 62 56 L 70 70 L 76 84"/><path d="M 56 30 L 42 36"/><path d="M 56 30 L 72 38"/><line x1="10" y1="92" x2="90" y2="92"/>',
      scroll: '<ellipse cx="20" cy="50" rx="8" ry="22"/><ellipse cx="20" cy="50" rx="3" ry="22"/><ellipse cx="80" cy="50" rx="8" ry="22"/><ellipse cx="80" cy="50" rx="3" ry="22"/><path d="M 20 28 L 80 28"/><path d="M 20 72 L 80 72"/><path d="M 28 42 L 72 42" stroke-opacity="0.6"/><path d="M 28 52 L 72 52" stroke-opacity="0.6"/><path d="M 28 62 L 60 62" stroke-opacity="0.6"/>',
      'shield-round': '<circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="28" stroke-opacity="0.6"/><circle cx="50" cy="50" r="6"/><circle cx="50" cy="50" r="2" fill="currentColor"/><line x1="50" y1="22" x2="50" y2="34" stroke-opacity="0.5"/><line x1="50" y1="66" x2="50" y2="78" stroke-opacity="0.5"/><line x1="22" y1="50" x2="34" y2="50" stroke-opacity="0.5"/><line x1="66" y1="50" x2="78" y2="50" stroke-opacity="0.5"/>',
      sword: '<path d="M 50 8 L 46 60 L 50 66 L 54 60 Z"/><rect x="36" y="60" width="28" height="4"/><rect x="46" y="64" width="8" height="18" stroke-opacity="0.85"/><circle cx="50" cy="86" r="4"/>',
      tablet: '<rect x="14" y="18" width="72" height="64" rx="3"/><rect x="20" y="24" width="60" height="52" rx="1" stroke-opacity="0.55"/><line x1="50" y1="18" x2="50" y2="82" stroke-opacity="0.45"/><path d="M 26 36 L 44 36" stroke-opacity="0.55"/><path d="M 26 44 L 44 44" stroke-opacity="0.55"/><path d="M 26 52 L 40 52" stroke-opacity="0.55"/><path d="M 56 36 L 74 36" stroke-opacity="0.55"/><path d="M 56 44 L 74 44" stroke-opacity="0.55"/>',
      timeline: '<line x1="10" y1="50" x2="90" y2="50"/><path d="M 90 50 L 84 46 M 90 50 L 84 54"/><circle cx="22" cy="50" r="4" fill="currentColor" stroke="none"/><circle cx="40" cy="50" r="3.5"/><circle cx="58" cy="50" r="3.5"/><circle cx="76" cy="50" r="3.5"/><rect x="14" y="22" width="16" height="10"/><rect x="50" y="22" width="16" height="10"/>',
      trident: '<line x1="50" y1="20" x2="50" y2="86"/><path d="M 30 26 L 30 14"/><path d="M 70 26 L 70 14"/><path d="M 50 14 L 50 6"/><path d="M 30 26 Q 40 26 50 32 Q 60 26 70 26"/><path d="M 44 86 L 56 86 L 54 92 L 46 92 Z"/>',
      trophy: '<path d="M 32 18 L 68 18 L 66 44 Q 66 56 50 56 Q 34 56 34 44 Z"/><path d="M 32 24 Q 18 24 18 34 Q 18 44 34 42" stroke-opacity="0.7"/><path d="M 68 24 Q 82 24 82 34 Q 82 44 66 42" stroke-opacity="0.7"/><line x1="50" y1="56" x2="50" y2="68"/><path d="M 38 68 L 62 68 L 64 80 L 36 80 Z"/><line x1="32" y1="86" x2="68" y2="86" stroke-width="1.8"/>',
      wreath: '<path d="M 50 84 Q 18 70 18 38 Q 28 24 50 18" stroke-opacity="0.7"/><path d="M 50 84 Q 82 70 82 38 Q 72 24 50 18" stroke-opacity="0.7"/><path d="M 46 82 L 54 82 L 52 90 L 48 90 Z"/><circle cx="32" cy="34" r="3" stroke-opacity="0.5"/><circle cx="26" cy="50" r="3" stroke-opacity="0.5"/><circle cx="32" cy="66" r="3" stroke-opacity="0.5"/><circle cx="68" cy="34" r="3" stroke-opacity="0.5"/><circle cx="74" cy="50" r="3" stroke-opacity="0.5"/><circle cx="68" cy="66" r="3" stroke-opacity="0.5"/>',
    };
    function glyph(name) {
      const inner = G[name] || G.wreath;
      return `<span class="t-glyph"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:100%;height:100%;display:block">${inner}</svg></span>`;
    }
    const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const fmtK = n => Number(n || 0).toLocaleString('en-US');

    // A self-contained, read-only Temple preview built straight from the
    // current realm read-model. Mirrors the Curator's Console "live preview":
    // tabs (pillars), cosmetics, boons, quests — themed via window.RT.
    function renderInto(containerId, themeId) {
      const host = document.getElementById(containerId);
      if (!host) return;
      const realm = (typeof window.getRealm === 'function') ? window.getRealm() : null;
      if (!realm) { host.innerHTML = ''; return; }
      const pillars = realm.PILLARS || [];
      const cos = (realm.COSMETICS || []).slice(0, 6);
      const boons = (realm.BOONS || []).slice(0, 4);
      const quests = (realm.questsByCadence ? realm.questsByCadence('daily') : (realm.QUESTS || [])).slice(0, 4);
      const tabs = pillars.map((p, i) =>
        `<button class="t-tab${i === 0 ? ' on' : ''}"><span class="t-tab-ic">${glyph(p.icon)}</span><span class="t-tab-l"><b class="gk">${esc(p.el)}</b><span>${esc(p.en)}</span></span></button>`).join('');
      const cosCards = cos.map(c =>
        `<div class="t-card"><span class="t-card-ic">${glyph(c.icon || 'wreath')}</span><div class="t-card-b"><b class="gk">${esc(c.el)}</b><span>${esc(c.en)}</span></div><span class="t-card-px">${c.price ? fmtK(c.price) : '—'}</span></div>`).join('');
      const boonCards = boons.map(b =>
        `<div class="t-card"><span class="t-card-ic">${glyph(b.icon || 'lightning')}</span><div class="t-card-b"><b class="gk">${esc(b.el)}</b><span>${esc(b.effect || b.en)}</span></div><span class="t-card-px">${fmtK(b.price)}</span></div>`).join('');
      const questCards = quests.map(q =>
        `<div class="t-quest"><span class="t-card-ic">${glyph(q.icon || 'scroll')}</span><div class="t-card-b"><b class="gk">${esc(q.el)}</b><span>${esc(q.en)}</span></div><span class="t-card-px">+${q.reward}</span></div>`).join('');
      host.innerHTML =
        `<div class="t-frame" style="width:1180px;background:var(--sym-bg);color:var(--sym-fg);border-radius:18px;padding:26px 30px;font-family:inherit">
          <div class="t-head" style="display:flex;align-items:center;gap:14px;margin-bottom:18px">
            <span style="width:46px;height:46px;color:var(--sym-accent)">${glyph('acropolis')}</span>
            <div><h1 class="gk" style="margin:0;font-size:30px;color:var(--sym-fg)">Ναὸς τῶν Μουσῶν</h1>
            <div style="color:var(--sym-fg-muted);font-size:14px">Temple of the Muses · live preview</div></div>
          </div>
          <div class="t-tabs" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:20px">${tabs}</div>
          <div class="t-sec gk" style="color:var(--sym-gold);font-size:18px;margin:6px 0 10px">Ἀφιερώματα · Cosmetics</div>
          <div class="t-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:18px">${cosCards}</div>
          <div class="t-sec gk" style="color:var(--sym-gold);font-size:18px;margin:6px 0 10px">Εὐλογίες · Boons</div>
          <div class="t-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-bottom:18px">${boonCards}</div>
          <div class="t-sec gk" style="color:var(--sym-gold);font-size:18px;margin:6px 0 10px">Ἆθλοι · Quests</div>
          <div class="t-grid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">${questCards}</div>
        </div>`;
      const frame = host.querySelector('.t-frame');
      if (frame && window.RT) window.RT.apply(frame, themeId || realm.realmTheme || 'obsidian');
      // tiny inline card styling so the preview reads cleanly under any theme
      if (!document.getElementById('t-preview-style')) {
        const st = document.createElement('style'); st.id = 't-preview-style';
        st.textContent =
          '.t-frame .t-tab,.t-frame .t-card,.t-frame .t-quest{background:var(--sym-bg-card);border:1px solid var(--sym-hairline);border-radius:12px}' +
          '.t-frame .t-tab{display:flex;align-items:center;gap:10px;padding:10px 14px;color:var(--sym-fg);cursor:default}' +
          '.t-frame .t-tab.on{border-color:var(--sym-accent);color:var(--sym-accent)}' +
          '.t-frame .t-tab-ic,.t-frame .t-card-ic{width:26px;height:26px;flex:none;color:var(--sym-accent)}' +
          '.t-frame .t-tab-l b{display:block;font-size:15px}.t-frame .t-tab-l span{font-size:12px;color:var(--sym-fg-muted)}' +
          '.t-frame .t-card,.t-frame .t-quest{display:flex;align-items:center;gap:12px;padding:12px 14px}' +
          '.t-frame .t-card-b{flex:1;min-width:0}.t-frame .t-card-b b{display:block;font-size:15px;color:var(--sym-fg)}' +
          '.t-frame .t-card-b span{font-size:12px;color:var(--sym-fg-muted);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
          '.t-frame .t-card-px{flex:none;color:var(--sym-gold);font-weight:600;font-size:14px}';
        document.head.appendChild(st);
      }
    }
    window.Temple = { glyph: glyph, renderInto: renderInto };
  }

  // ══════════════════════════════════════════════════════════════
  //  REALM_DEFAULT — the factory catalog (the immutable seed). The
  //  catalog SHAPE is exactly what js/admin-realm.js authors. SYM data
  //  is folded in by buildSeed() below.
  // ══════════════════════════════════════════════════════════════
  const ICON_NAMES = [
    'wreath', 'column', 'lightning', 'scroll', 'trophy', 'gear',
    'shield-round', 'helmet', 'labyrinth', 'trident', 'sword', 'runner',
    'timeline', 'cyclops-eye', 'acropolis', 'chariot', 'tablet', 'cards',
  ];
  const PILLARS = [
    { id: 'cosmetics', el: 'Ἀφιερώματα', en: 'Cosmetics', icon: 'column', blurb: 'Dedications laid at the altar', core: true },
    { id: 'boons', el: 'Εὐλογίες', en: 'Boons', icon: 'lightning', blurb: 'Favors of the gods', core: true },
    { id: 'quests', el: 'Ἆθλοι', en: 'Quests', icon: 'scroll', blurb: 'Labors set before you', core: true },
    { id: 'achievements', el: 'Τρόπαια', en: 'Achievements', icon: 'trophy', blurb: 'Trophies of a lifetime', core: true },
  ];
  const COSMETIC_SLOTS = [
    { id: 'palette', el: 'Χρώματα', en: 'Palette', icon: 'column' },
    { id: 'backdrop', el: 'Φόντο', en: 'Backdrop', icon: 'acropolis' },
    { id: 'particle', el: 'Σπινθῆρες', en: 'Particles', icon: 'lightning' },
    { id: 'sigil', el: 'Σῆμα', en: 'Sigil', icon: 'wreath' },
  ];
  // palette / backdrop / particle cosmetics drive RT themes & ambience, which
  // SYM does not model — keep the curated seed for these three slots.
  const COSMETICS_SEED = [
    { id: 'pal-obsidian', slot: 'palette', theme: 'obsidian', el: 'Ὀψιδιανός', en: 'Obsidian', price: 0, lore: 'Volcanic glass, candle-gold. The founding rite.', swatch: ['#0A0907', '#D2A24A', '#E07A3C'] },
    { id: 'pal-katabasis', slot: 'palette', theme: 'obsidian-katabasis', el: 'Κατάβασις', en: 'Katabasis', price: 1400, lore: 'The descent — amethyst dusk over ember.', swatch: ['#0C0810', '#ED7A28', '#8A63B6'] },
    { id: 'pal-solstice', slot: 'palette', theme: 'obsidian-solstice', el: 'Ἡλιοτρόπιον', en: 'Solstice', price: 1400, lore: 'Evergreen and gilt — the turning of the year.', swatch: ['#080B08', '#D8B45A', '#3C8459'] },
    { id: 'pal-orphic', slot: 'palette', theme: 'orphic', el: 'Ὀρφικὴ Νύξ', en: 'Orphic Night', price: 3200, sagaGate: 3, lore: 'Iridescence on black water. Sung into being.', swatch: ['#06080C', '#8E7FD6', '#6FC9B0'] },
    { id: 'bd-circle', slot: 'backdrop', el: 'Τελετουργικὸς Κύκλος', en: 'Ritual Circle', price: 0, kind: 'circle', lore: 'The slow-turning wheel of the rite.' },
    { id: 'bd-embers', slot: 'backdrop', el: 'Ἀνερχόμεναι Σπίθαι', en: 'Rising Embers', price: 900, kind: 'embers', lore: 'Sparks ascend from the altar fire.' },
    { id: 'bd-frieze', slot: 'backdrop', el: 'Μαρμάρινη Ζωφόρος', en: 'Marble Frieze', price: 900, kind: 'frieze', lore: 'A carved procession in pentelic stone.' },
    { id: 'bd-aether', slot: 'backdrop', el: 'Αἰθήρ', en: 'Aether Field', price: 2400, sagaGate: 4, kind: 'aether', lore: 'The upper air where the gods breathe.' },
    { id: 'pt-hearth', slot: 'particle', el: 'Σπινθῆρες Ἑστίας', en: 'Hearth Sparks', price: 0, tint: 'gold', lore: 'Warm sparks of the household fire.' },
    { id: 'pt-golddust', slot: 'particle', el: 'Χρυσόκονις', en: 'Gold Dust', price: 700, tint: 'goldLt', lore: 'Drifting motes of beaten gold.' },
    { id: 'pt-petals', slot: 'particle', el: 'Πέταλα', en: 'Falling Petals', price: 700, tint: 'terra', lore: 'Petals shaken from a votive garland.' },
  ];
  const LOADOUT_MAX = 3;
  const BOONS = [
    { id: 'bn-aristeia', el: 'Ἀριστεία', en: 'Aristeia', icon: 'sword', price: 1200, effect: 'Win streaks compound your Kleos yield.' },
    { id: 'bn-mnemosyne', el: 'Μνημοσύνη', en: 'Mnemosyne’s Favor', icon: 'tablet', price: 1500, effect: 'Keep half your streak through a single loss.' },
    { id: 'bn-momentum', el: 'Ὁρμή', en: 'Momentum', icon: 'chariot', price: 1000, effect: 'Combos build a quarter faster.' },
    { id: 'bn-foresight', el: 'Πρόνοια', en: 'Foresight', icon: 'cyclops-eye', price: 1800, effect: 'Glimpse the next trial before it begins.' },
    { id: 'bn-nemesis', el: 'Νέμεσις', en: 'Nemesis', icon: 'helmet', price: 1600, effect: 'Greater foes surrender greater glory.' },
  ];
  const CONSUMABLES = [
    { id: 'cs-breath', el: 'Δευτέρα Πνοή', en: 'Second Breath', icon: 'shield-round', price: 300, bundle: 3, effect: 'Rise once from a defeat.' },
    { id: 'cs-thread', el: 'Νῆμα Ἀριάδνης', en: 'Ariadne’s Thread', icon: 'labyrinth', price: 250, bundle: 3, effect: 'Escape a trial without penalty.' },
    { id: 'cs-oracle', el: 'Χρησμός', en: 'The Oracle', icon: 'cyclops-eye', price: 200, bundle: 5, effect: 'Reveal one hidden truth.' },
  ];
  const QUESTS = [
    { id: 'q-duels', cadence: 'daily', weight: 4, el: 'Τρεῖς Μονομαχίαι', en: 'Win three duels', icon: 'sword', goal: 3, reward: 120 },
    { id: 'q-streak', cadence: 'daily', weight: 3, el: 'Σειρὰ Δέκα', en: 'Reach a streak of ten', icon: 'lightning', goal: 10, reward: 200 },
    { id: 'q-drills', cadence: 'daily', weight: 5, el: 'Πέντε Ἀσκήσεις', en: 'Finish five drills', icon: 'tablet', goal: 5, reward: 150 },
    { id: 'q-modes', cadence: 'daily', weight: 3, el: 'Δύο Τρόποι', en: 'Play in two modes', icon: 'cards', goal: 2, reward: 100 },
    { id: 'q-flawless', cadence: 'daily', weight: 2, el: 'Ἄπταιστος', en: 'Win without a mistake', icon: 'shield-round', goal: 1, reward: 180 },
    { id: 'q-swift', cadence: 'daily', weight: 2, el: 'Ταχύτης', en: 'Three swift victories', icon: 'runner', goal: 3, reward: 160 },
    { id: 'w-marathon', cadence: 'weekly', weight: 4, el: 'Μαραθών', en: 'Win twenty-five duels', icon: 'runner', goal: 25, reward: 600 },
    { id: 'w-pantheon', cadence: 'weekly', weight: 3, el: 'Πάνθεον', en: 'Play every discipline', icon: 'acropolis', goal: 6, reward: 750 },
    { id: 'w-hecatomb', cadence: 'weekly', weight: 2, el: 'Ἑκατόμβη', en: 'Offer a hundred drills', icon: 'column', goal: 100, reward: 900 },
    { id: 'w-unbroken', cadence: 'weekly', weight: 2, el: 'Ἄθραυστος', en: 'Hold a streak of thirty', icon: 'lightning', goal: 30, reward: 1000 },
  ];
  const QUEST_ROTATION = { daily: 5, weekly: 5 };
  const SAGA = {
    el: 'Τὸ Ἔπος', en: 'The Epic',
    chapters: [
      { id: 's1', el: 'Χάος', en: 'Chaos', goal: 4, reward: 200 },
      { id: 's2', el: 'Τιτᾶνες', en: 'The Titans', goal: 6, reward: 350, unlock: 'pal-katabasis' },
      { id: 's3', el: 'Ὀλύμπιοι', en: 'The Olympians', goal: 8, reward: 500, unlock: 'pal-orphic' },
      { id: 's4', el: 'Ἥρωες', en: 'The Heroes', goal: 10, reward: 700, unlock: 'bd-aether' },
      { id: 's5', el: 'Νόστος', en: 'The Return', goal: 12, reward: 1000 },
      { id: 's6', el: 'Ἀπόλυσις', en: 'The Release', goal: 14, reward: 1400 },
    ],
  };
  const ACH_DIMENSIONS = [
    { id: 'milestone', el: 'Ὁρόσημα', en: 'Milestones', icon: 'acropolis' },
    { id: 'class', el: 'Τάξεις', en: 'Classes', icon: 'column' },
    { id: 'subject', el: 'Μαθήματα', en: 'Subjects', icon: 'tablet' },
    { id: 'mode', el: 'Λειτουργίες', en: 'Modes', icon: 'cards' },
  ];
  const ACHIEVEMENTS = [
    { id: 'a-centurion', dim: 'milestone', el: 'Ἑκατοντάρχης', en: 'Centurion', icon: 'shield-round', goal: 100, stat: 'wins', note: 'One hundred victories.' },
    { id: 'a-myriad', dim: 'milestone', el: 'Μυριάς', en: 'The Myriad', icon: 'acropolis', goal: 500, stat: 'sessions', note: 'Five hundred returns to the Temple.' },
    { id: 'a-unbroken', dim: 'milestone', el: 'Ἄθραυστος', en: 'Unbroken', icon: 'lightning', goal: 25, stat: 'bestStreak', note: 'A streak of twenty-five.' },
    { id: 'a-hermes', dim: 'mode', el: 'Ἑρμῆς', en: 'Swift as Hermes', icon: 'runner', goal: 50, stat: 'swift', note: 'Fifty trials won against the clock.' },
    { id: 'a-polymath', dim: 'subject', el: 'Πολυμαθής', en: 'Polymath', icon: 'tablet', goal: 12, stat: 'mastered', note: 'Master every discipline.' },
    { id: 'a-connoisseur', dim: 'milestone', el: 'Φιλόκαλος', en: 'Connoisseur', icon: 'cards', goal: 10, stat: 'owned', note: 'Gather ten dedications.' },
  ];
  const CUSTOM_PILLARS = [
    { id: 'oracles', el: 'Μαντεῖα', en: 'Oracles', icon: 'cyclops-eye', blurb: 'Voices that read the future', equipModel: 'single',
      offerings: [
        { id: 'or-delphi', el: 'Δελφοί', en: 'Oracle of Delphi', icon: 'acropolis', price: 0, lore: 'The Pythia’s smoke-wreathed verses.' },
        { id: 'or-dodona', el: 'Δωδώνη', en: 'Whispering Oaks', icon: 'column', price: 1200, lore: 'Zeus speaks through rustling leaves.' },
        { id: 'or-trophonius', el: 'Τροφώνιος', en: 'Cave of Trophonius', icon: 'labyrinth', price: 2600, sagaGate: 3, lore: 'None who descend return unchanged.' },
      ] },
  ];
  const STAT_CARDS = [
    { key: 'kleosLifetime', el: 'Κλέος αἰώνιον', en: 'Lifetime Glory', fmt: 'kleos' },
    { key: 'sessions', el: 'Ἐπιστροφαί', en: 'Sessions' },
    { key: 'bestStreak', el: 'Μεγίστη Σειρά', en: 'Best Streak' },
    { key: 'hours', el: 'Ὧραι', en: 'Hours in Rite', suffix: 'h' },
    { key: 'accuracy', el: 'Ἀκρίβεια', en: 'Accuracy', suffix: '%' },
  ];
  const REALM_THEME = 'obsidian';
  const GAME_REWARDS = [
    { id: 'default', el: 'Προεπιλογή', en: 'Default (all games)',
      baseXp: 0, xpPerScore: 15, xpPerStreak: 5, swiftXp: 10, perfectXp: 10,
      baseDrachmas: 3, drachmasPerScore: 0, perfectDrachmas: 3,
      weeklyBonusXp: 25, weeklyBonusDrachmas: 10, weeklyCapXp: 0, weeklyCapDrachmas: 0 },
    { id: 'live-arena', el: 'Ζωντανή Ἀρένα', en: 'Live Arena',
      baseXp: 15, xpPerScore: 0, xpPerStreak: 0, swiftXp: 0, perfectXp: 0,
      baseDrachmas: 1, drachmasPerScore: 0, perfectDrachmas: 0,
      weeklyBonusXp: 0, weeklyBonusDrachmas: 0, weeklyCapXp: 0, weeklyCapDrachmas: 0 },
    { id: 'review-hub', el: 'Τάρταρος', en: 'Tartarus Review',
      xpPerScore: 10, perfectXp: 20, baseDrachmas: 2, perfectDrachmas: 3,
      weeklyBonusXp: 0, weeklyBonusDrachmas: 0 },
    { id: 'study', el: 'Μελέτη', en: 'Flashcards',
      xpPerScore: 2, baseDrachmas: 0, weeklyBonusXp: 0, weeklyBonusDrachmas: 0,
      weeklyCapXp: 120, weeklyCapDrachmas: 20 },
  ];

  // ── source the cosmetics' SIGIL slot from SYM.ACROTERIA ──────────
  // Each altar sculpture becomes a "sigil" cosmetic; SYM fields map:
  //   gr→el · en→en · illu→icon · cost→price · L(lore)→lore.
  function sigilsFromSYM() {
    const list = (_SY().ACROTERIA || []);
    return list.map(a => {
      const c = {
        id: 'acro-' + a.id, slot: 'sigil',
        el: a.gr || a.en || a.id, en: a.en || a.gr || a.id,
        icon: a.illu || 'wreath',
        lore: _L(a.lore) || '', price: Number(a.cost) || 0,
      };
      if (a.cat) c.cat = a.cat;
      return c;
    });
  }

  // ── source achievement dimensions + medals from SYM ──────────────
  function achDimensionsFromSYM() {
    const cats = (_SY().ACH_CATS || []).filter(c => c.id !== 'all');
    if (!cats.length) return clone(ACH_DIMENSIONS);
    const icon = { milestone: 'acropolis', class: 'column', subject: 'tablet', mode: 'cards' };
    return cats.map(c => ({ id: c.id, el: c.gr || c.en || c.id, en: c.en || c.gr || c.id, icon: icon[c.id] || 'trophy' }));
  }
  function achievementsFromSYM() {
    const list = (_SY().ACHIEVEMENTS || []);
    if (!list.length) return clone(ACHIEVEMENTS);
    // The full SYM list is 100+ entries; keep the curated milestones plus a
    // sample per dimension so the editor stays legible without losing breadth.
    const byCat = {};
    list.forEach(a => { (byCat[a.cat] = byCat[a.cat] || []).push(a); });
    const picked = [];
    Object.keys(byCat).forEach(cat => {
      const take = cat === 'milestone' ? byCat[cat] : byCat[cat].slice(0, 6);
      take.forEach(a => picked.push({
        id: a.id, dim: a.cat,
        el: a.gr || a.en || a.id, en: a.en || a.gr || a.id,
        icon: a.icon || 'trophy', goal: Number(a.goal) || 1,
        stat: 'wins', note: _L(a.note) || '',
      }));
    });
    return picked.length ? picked : clone(ACHIEVEMENTS);
  }

  // ── assemble the factory seed, folding SYM in ──
  function buildSeed() {
    const sigils = sigilsFromSYM();
    const cosmetics = COSMETICS_SEED.concat(sigils.length ? sigils : [
      { id: 'sg-olive', slot: 'sigil', el: 'Στέφανος Ἐλαίας', en: 'Olive Wreath', price: 0, icon: 'wreath', lore: 'The victor’s crown of Olympia.' },
    ]);
    return {
      ICON_NAMES: clone(ICON_NAMES),
      pillars: clone(PILLARS),
      cosmeticSlots: clone(COSMETIC_SLOTS),
      cosmetics: cosmetics,
      loadoutMax: LOADOUT_MAX,
      boons: clone(BOONS),
      consumables: clone(CONSUMABLES),
      quests: clone(QUESTS),
      questRotation: clone(QUEST_ROTATION),
      saga: clone(SAGA),
      achDimensions: achDimensionsFromSYM(),
      achievements: achievementsFromSYM(),
      customPillars: clone(CUSTOM_PILLARS),
      statCards: clone(STAT_CARDS),
      gameRewards: clone(GAME_REWARDS),
      realmTheme: REALM_THEME,
    };
  }

  // The seed is rebuilt lazily once SYM is present (data.js loads before us,
  // but guard anyway). Cached so default()/reset are stable.
  let _seedCache = null;
  function REALM_DEFAULT() { return _seedCache || (_seedCache = buildSeed()); }

  // ── merge a stored catalog over the factory default so new keys survive ──
  function hydrate(stored) {
    const d = clone(REALM_DEFAULT());
    if (!stored || typeof stored !== 'object') return d;
    const out = { ...d, ...stored };
    ['pillars', 'cosmeticSlots', 'cosmetics', 'boons', 'consumables', 'quests',
      'achDimensions', 'achievements', 'customPillars', 'statCards', 'gameRewards', 'ICON_NAMES'].forEach(k => {
      if (!Array.isArray(out[k])) out[k] = d[k];
    });
    if (!out.saga || typeof out.saga !== 'object') out.saga = d.saga;
    if (!out.questRotation || typeof out.questRotation !== 'object') out.questRotation = d.questRotation;
    if (out.loadoutMax == null) out.loadoutMax = d.loadoutMax;
    if (!out.realmTheme) out.realmTheme = d.realmTheme;
    if (Array.isArray(out.gameRewards) && Array.isArray(d.gameRewards)) {
      const storedIds = new Set(out.gameRewards.map(g => g && g.id));
      d.gameRewards.forEach(g => { if (g && g.id && !storedIds.has(g.id)) out.gameRewards.push(g); });
    }
    return out;
  }

  // ── build the LIVE read-model from an editable catalog ──
  function build(cat) {
    const byId = {};
    const reg = arr => (arr || []).forEach(x => { if (x && x.id) byId[x.id] = x; });
    reg(cat.cosmetics); reg(cat.boons); reg(cat.consumables);
    (cat.customPillars || []).forEach(p => reg(p.offerings));

    const corePillars = (cat.pillars || []).map(p => ({ ...p, core: true }));
    const customPillars = (cat.customPillars || []).map(p => ({ ...p, custom: true }));
    const PILLARS_LIVE = [...corePillars, ...customPillars];
    const questsByCadence = c => (cat.quests || []).filter(q => q.cadence === c);

    const grById = {};
    (cat.gameRewards || []).forEach(g => { if (g && g.id) grById[g.id] = g; });
    const gameReward = gid => Object.assign({}, grById.default || {}, grById[gid] || {});

    return {
      ...cat,
      PILLARS: PILLARS_LIVE,
      COSMETIC_SLOTS: cat.cosmeticSlots,
      COSMETICS: cat.cosmetics,
      BOONS: cat.boons,
      CONSUMABLES: cat.consumables,
      SAGA: cat.saga,
      ACH_DIMENSIONS: cat.achDimensions,
      ACHIEVEMENTS: cat.achievements,
      STAT_CARDS: cat.statCards,
      LOADOUT_MAX: cat.loadoutMax,
      QUESTS: cat.quests,
      corePillars, customPillars,
      questsByCadence, gameReward,
      customPillar: id => (cat.customPillars || []).find(p => p.id === id),
      byId, item: id => byId[id],
    };
  }

  // ── live state — start from SymStore override, else the seed ──
  function _loadStored() {
    const ss = _SS();
    if (!ss) return null;
    try { return ss.get(STORE_KEY, null); } catch (e) { return null; }
  }
  let _catalog = hydrate(_loadStored());
  let _realm = build(_catalog);
  const _subs = new Set();

  function _emit() {
    _realm = build(_catalog);
    _subs.forEach(fn => { try { fn(_realm, _catalog); } catch (e) {} });
    // Re-render the live Synthesis screens so admin edits show immediately.
    if (typeof window.symRender === 'function') { try { window.symRender(); } catch (e) {} }
  }

  // ── weighted quest rotation (random daily/weekly spawn) ──
  function rollCadence(cadence) {
    const pool = (_catalog.quests || []).filter(q => q.cadence === cadence && q.enabled !== false);
    const want = Math.min((_catalog.questRotation && _catalog.questRotation[cadence]) || 0, pool.length);
    const picked = [];
    const bag = pool.map(q => ({ id: q.id, w: Math.max(0.0001, q.weight || 1) }));
    let total = bag.reduce((s, b) => s + b.w, 0);
    while (picked.length < want && bag.length) {
      let r = Math.random() * total, i = 0;
      while (i < bag.length - 1 && (r -= bag[i].w) > 0) i++;
      picked.push(bag[i].id); total -= bag[i].w; bag.splice(i, 1);
    }
    return picked;
  }
  function rollQuests() { return { daily: rollCadence('daily'), weekly: rollCadence('weekly') }; }

  // ── persistence — SymStore (always) + Firestore mirror (guarded) ──
  function _persistLocal(cat) {
    const ss = _SS();
    if (ss) { try { ss.set(STORE_KEY, cat); } catch (e) {} }
  }
  function _firebaseReady() {
    return typeof firebase !== 'undefined' && firebase && typeof firebase.firestore === 'function';
  }
  function _realmRef() { return firebase.firestore().collection(REALM_DOC[0]).doc(REALM_DOC[1]); }

  // Persist an edited catalog. ALWAYS resolves once SymStore is written; the
  // Firestore mirror is best-effort and degrades silently in the sandbox.
  function saveRealm(next) {
    const cat = hydrate(next);
    _persistLocal(cat);
    if (!_firebaseReady()) return Promise.resolve({ local: true });
    try {
      return _realmRef().set(cat)
        .then(() => ({ local: true, remote: true }))
        .catch(err => { console.warn('[realm] Firestore mirror failed — kept local', err); return { local: true, remote: false }; });
    } catch (e) {
      console.warn('[realm] Firestore mirror threw — kept local', e);
      return Promise.resolve({ local: true, remote: false });
    }
  }

  // Apply an edited catalog to the LIVE model immediately (no persistence) —
  // the Curator's Console calls this for an instant local preview; a debounced
  // saveRealm() then persists it.
  function applyLocal(next) { _catalog = hydrate(next); _emit(); }

  // Admin-only: (re)publish the factory seed to the override + Firestore.
  function seedRealm() {
    const cat = clone(REALM_DEFAULT());
    _persistLocal(cat);
    if (_firebaseReady()) { try { _realmRef().set(cat).catch(() => {}); } catch (e) {} }
    return cat;
  }

  // ── optional Firestore listener — attaches only if Firebase is present ──
  let _listening = false;
  function initRealm() {
    if (_listening || !_firebaseReady()) return;
    _listening = true;
    try {
      _realmRef().onSnapshot(snap => {
        if (snap && snap.exists) { _catalog = hydrate(snap.data()); _persistLocal(_catalog); _emit(); }
      }, err => { console.warn('[realm] snapshot failed — using local/seed', err); });
    } catch (e) { _listening = false; console.warn('[realm] listener attach failed', e); }
  }

  // ── public API ───────────────────────────────────────────────
  window.getRealm = () => _realm;
  window.realmItem = id => _realm.byId[id];
  window.questsByCadence = c => _realm.questsByCadence(c);
  window.rollCadence = rollCadence;
  window.rollQuests = rollQuests;
  window.onRealm = fn => { _subs.add(fn); return () => _subs.delete(fn); };
  window.offRealm = fn => _subs.delete(fn);
  window.initRealm = initRealm;
  window.REALM_DEFAULT = REALM_DEFAULT();

  window.RealmStore = {
    getCatalog: () => clone(_catalog),
    default: () => clone(REALM_DEFAULT()),
    save: saveRealm,
    applyLocal: applyLocal,
    seed: seedRealm,
    rollQuests, rollCadence,
  };

  // Attach the Firestore listener as soon as Firebase is ready (best-effort).
  (function _autoInit(tries) {
    if (_firebaseReady()) { initRealm(); return; }
    if (tries <= 0) return;
    setTimeout(() => _autoInit(tries - 1), 120);
  })(40);
})();
