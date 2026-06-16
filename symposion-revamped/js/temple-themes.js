// ============================================================
//  SymposiON — Temple of the Muses — theme library (window.RT)
//  Each theme is a complete named palette. Applied as inline CSS custom
//  properties on the Temple frame, so equipping a palette cosmetic
//  re-tints every Temple card/ornament instantly. Ported from the
//  prototype themes.js; data only, no framework.
//    window.RT = { THEMES, GROUPS, byId, get(id), swatch(t), apply(el,id) }
// ============================================================
(function () {
  'use strict';

  const T = (id, name, sub, group, season, light, tok, locked) =>
    ({ id, name, sub, group, season, light: !!light, locked: !!locked, tok });

  const GOLD = { gold: '#D2A24A', goldLt: '#F2CD78', goldDk: '#9E7322' };

  const THEMES = [
    /* OBSIDIAN family — black + gold */
    T('obsidian', 'Obsidian', 'black · gold', 'obsidian', '', false,
      { bg: '#0A0907', panel: '#15120D', fg: '#F1E9D6', muted: '#897A5A', ...GOLD, terra: '#E07A3C', accent: '#D2A24A', accent2: '#E07A3C' }),
    T('obsidian-katabasis', 'Katabasis', 'obsidian · Halloween', 'obsidian', 'halloween', false,
      { bg: '#0C0810', panel: '#181122', fg: '#F2E7D8', muted: '#8A7596', ...GOLD, terra: '#ED7A28', accent: '#ED7A28', accent2: '#8A63B6' }),
    T('obsidian-solstice', 'Solstice', 'obsidian · Christmas', 'obsidian', 'christmas', false,
      { bg: '#080B08', panel: '#121710', fg: '#EFEAD9', muted: '#7E876E', gold: '#D8B45A', goldLt: '#F0D688', goldDk: '#A6862A', terra: '#C23A2E', accent: '#C23A2E', accent2: '#3C8459' }),
    T('obsidian-bloom', 'Nocturne Bloom', 'obsidian · Easter', 'obsidian', 'easter', false,
      { bg: '#0A0F0A', panel: '#141C14', fg: '#EDEBD8', muted: '#7F8A72', gold: '#CBB44E', goldLt: '#E8D680', goldDk: '#93812A', terra: '#D98A6F', accent: '#84B86E', accent2: '#D98A6F' }),
    T('obsidian-revel', 'Gilded Revel', 'obsidian · Carnival', 'obsidian', 'carnival', false,
      { bg: '#0B0810', panel: '#171022', fg: '#F1E8DC', muted: '#8C7C96', gold: '#E3BB4B', goldLt: '#F6DC8C', goldDk: '#B68F22', terra: '#D4499A', accent: '#E3BB4B', accent2: '#D4499A' }),

    /* ALABASTER family — marble light */
    T('alabaster', 'Alabaster', 'Pentelic marble', 'alabaster', '', true,
      { bg: '#F1ECDF', panel: '#FBF8F0', fg: '#2A2117', muted: '#8C8170', gold: '#9A7C31', goldLt: '#C2A24E', goldDk: '#6F5820', terra: '#C2562C', accent: '#C2562C', accent2: '#9A7C31' }),
    T('alabaster-asphodel', 'Pale Asphodel', 'alabaster · Halloween', 'alabaster', 'halloween', true,
      { bg: '#EFEAE0', panel: '#FAF6EF', fg: '#2A2030', muted: '#897A92', gold: '#A6802E', goldLt: '#CDA64E', goldDk: '#6F5418', terra: '#C8631E', accent: '#C8631E', accent2: '#6E4E94' }),
    T('alabaster-noel', 'Marble Noël', 'alabaster · Christmas', 'alabaster', 'christmas', true,
      { bg: '#FAF5EE', panel: '#FFFFFF', fg: '#2A1713', muted: '#8A6F62', gold: '#BC9438', goldLt: '#DEBA5E', goldDk: '#8A6B1E', terra: '#B5302A', accent: '#B5302A', accent2: '#2F6B47' }),
    T('alabaster-anastasi', 'Anastasi', 'alabaster · Easter', 'alabaster', 'easter', true,
      { bg: '#F6F6EC', panel: '#FFFFFF', fg: '#243218', muted: '#7E8568', gold: '#C9A93F', goldLt: '#E4CC72', goldDk: '#94781E', terra: '#D9694F', accent: '#D9694F', accent2: '#5FA05A' }),
    T('alabaster-apokries', 'Marble Apokries', 'alabaster · Carnival', 'alabaster', 'carnival', true,
      { bg: '#F4EEF3', panel: '#FFFFFF', fg: '#241726', muted: '#917D94', gold: '#C9A93F', goldLt: '#E4CC72', goldDk: '#94781E', terra: '#C23A8C', accent: '#C23A8C', accent2: '#6E5AC8' }),

    /* CLASSIC */
    T('hearth', 'Hearth', 'warm dark · terra', 'classic', '', false,
      { bg: '#18120A', panel: '#261B12', fg: '#F0EBE0', muted: '#867660', gold: '#C4A448', goldLt: '#E2C868', goldDk: '#917722', terra: '#D97B5C', accent: '#C4A448', accent2: '#D97B5C' }),
    T('aegean', 'Aegean', 'midnight sea · copper', 'classic', '', false,
      { bg: '#0B1018', panel: '#142030', fg: '#E8E1D0', muted: '#7C8896', gold: '#D2B36A', goldLt: '#EAD08C', goldDk: '#9A8038', terra: '#E0894C', accent: '#D2B36A', accent2: '#5E8B96' }),
    T('amphora', 'Amphora', 'black-figure · Attic red', 'classic', '', false,
      { bg: '#15100A', panel: '#201810', fg: '#E8D9BA', muted: '#8A7958', gold: '#D49A2A', goldLt: '#EDBE52', goldDk: '#A0701A', terra: '#D14A1F', accent: '#D14A1F', accent2: '#D49A2A' }),

    /* VIVID */
    T('venetian', 'Venetian', 'purple · gold · magenta', 'vivid', 'carnival', false,
      { bg: '#160A1E', panel: '#241036', fg: '#F1E6F0', muted: '#9A7FA8', gold: '#E3BB4B', goldLt: '#F4D98A', goldDk: '#B68F22', terra: '#D4499A', accent: '#D4499A', accent2: '#5E73D6' }),
    T('olive', 'Olive Grove', 'green · gold', 'vivid', '', false,
      { bg: '#14180E', panel: '#1F2614', fg: '#ECE8D6', muted: '#8A916F', gold: '#C7B24A', goldLt: '#E6D77E', goldDk: '#93812A', terra: '#8AA84E', accent: '#8AA84E', accent2: '#C7B24A' }),
    T('rose', 'Rose Symposium', 'pink · amber', 'vivid', 'carnival', false,
      { bg: '#1B0F14', panel: '#2A1620', fg: '#F6E6EC', muted: '#B089A0', gold: '#E0A24A', goldLt: '#F4C97E', goldDk: '#A8731F', terra: '#E36A98', accent: '#E36A98', accent2: '#C97FB0' }),
    T('saffron', 'Saffron', 'orange · amber', 'vivid', '', false,
      { bg: '#1A1006', panel: '#271709', fg: '#F8E9D2', muted: '#B0906A', gold: '#E8A23A', goldLt: '#FBC97E', goldDk: '#B0701C', terra: '#E8732A', accent: '#E8862A', accent2: '#D6A93E' }),
    T('amethyst', 'Amethyst', 'violet · rose', 'vivid', 'carnival', false,
      { bg: '#120C1C', panel: '#1E1430', fg: '#ECE4F6', muted: '#9486AE', gold: '#C9A24A', goldLt: '#E6C878', goldDk: '#8E6E20', terra: '#9B6FD6', accent: '#9B6FD6', accent2: '#D46AA8' }),
    T('cyprus', 'Cyprus Teal', 'teal · brass', 'vivid', '', false,
      { bg: '#07181A', panel: '#0F2A2C', fg: '#DDEAE6', muted: '#6F9893', gold: '#C9B25A', goldLt: '#E6D484', goldDk: '#937F2E', terra: '#2FA89A', accent: '#2FA89A', accent2: '#C9B25A' }),
    T('coral', 'Coral Aegean', 'coral · sea blue', 'vivid', 'easter', false,
      { bg: '#0C1620', panel: '#152636', fg: '#E9E6DC', muted: '#7E8C96', gold: '#D8B86A', goldLt: '#EDD18C', goldDk: '#9E8038', terra: '#E37A5C', accent: '#E37A5C', accent2: '#5E97A8' }),
    T('porphyry', 'Porphyry', 'oxblood · plum', 'vivid', 'halloween', false,
      { bg: '#160A0E', panel: '#25121A', fg: '#F0E2E2', muted: '#A07F86', gold: '#C99A4A', goldLt: '#E6C078', goldDk: '#946C1E', terra: '#B0395A', accent: '#B0395A', accent2: '#7E4A86' }),

    /* UNLOCKABLE */
    T('tyrian', 'Tyrian Purple', 'the murex dye', 'locked', 'carnival', false,
      { bg: '#120816', panel: '#1F0F2A', fg: '#EFE2F2', muted: '#9A7FA8', gold: '#D9B24A', goldLt: '#F0D284', goldDk: '#A8861E', terra: '#7B2D86', accent: '#9C3D9E', accent2: '#C24A8C' }, true),
    T('golden-fleece', 'Golden Fleece', 'pure radiant gold', 'locked', '', false,
      { bg: '#1C1404', panel: '#2C2008', fg: '#FBEFCF', muted: '#BBA068', gold: '#F0C24A', goldLt: '#FFE08C', goldDk: '#BC8C1E', terra: '#E8A53A', accent: '#F0C24A', accent2: '#E8A53A' }, true),
    T('orphic', 'Orphic Night', 'black · iridescent', 'locked', 'halloween', false,
      { bg: '#06080C', panel: '#0F1422', fg: '#E6E8F0', muted: '#7C84A0', gold: '#B9A6E0', goldLt: '#D8CCF2', goldDk: '#7C6CA8', terra: '#6FA8C9', accent: '#8E7FD6', accent2: '#6FC9B0' }, true),
    T('elysium', 'Elysium', 'pastel · gold-green', 'locked', 'easter', true,
      { bg: '#F2F4E6', panel: '#FBFCF2', fg: '#2C3320', muted: '#82896E', gold: '#B2A23E', goldLt: '#D6C868', goldDk: '#827220', terra: '#C98A6A', accent: '#7FAE84', accent2: '#C9A93F' }, true),
  ];

  const GROUPS = [
    ['obsidian', 'Obsidian'],
    ['alabaster', 'Alabaster'],
    ['classic', 'Classic'],
    ['vivid', 'Vivid'],
    ['locked', 'Unlockable'],
  ];

  const byId = {}; THEMES.forEach(t => byId[t.id] = t);

  function swatch(t) {
    const k = t.tok;
    return `linear-gradient(135deg, ${k.bg} 0%, ${k.bg} 26%, ${k.panel} 27%, ${k.panel} 46%, ${k.accent2} 47%, ${k.accent2} 64%, ${k.gold} 65%, ${k.gold} 82%, ${k.accent} 83%)`;
  }

  function mix(c, pct, other) { return `color-mix(in srgb, ${c} ${pct}%, ${other})`; }

  // Apply a theme's tokens to a frame element as inline --sym-* custom
  // properties (scoped to the Temple frame, NOT the global body).
  function apply(el, id) {
    const t = byId[id]; if (!el || !t) return null;
    const k = t.tok, light = t.light, set = (p, v) => el.style.setProperty(p, v);
    set('--sym-bg', k.bg);
    set('--sym-bg-card', k.panel);
    set('--sym-bg-raise', light ? '#ffffff' : mix(k.panel, 86, k.fg));
    set('--sym-ink', light ? k.fg : k.bg);
    set('--sym-fg', k.fg);
    set('--sym-fg-muted', k.muted);
    set('--sym-gold', k.gold);
    set('--sym-gold-lt', k.goldLt);
    set('--sym-gold-dk', k.goldDk);
    set('--sym-terra', k.terra);
    set('--sym-accent', k.accent);
    set('--sym-accent2', k.accent2);
    set('--sym-hairline', mix(k.accent, light ? 16 : 18, 'transparent'));
    set('--gold-grad', `linear-gradient(135deg, ${k.goldLt} 0%, ${k.gold} 46%, ${k.goldDk} 100%)`);
    el.classList.toggle('is-light', !!light);
    return t;
  }

  window.RT = { THEMES, GROUPS, byId, get: id => byId[id], swatch, apply };
})();
