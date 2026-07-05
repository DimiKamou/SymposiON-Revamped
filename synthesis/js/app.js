/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · CORE
   Prototype harness: state, illustration injector, theme picker, tweaks,
   language, and direction dispatch. Direction renderers live in
   js/dir-*.js and attach to window.SYM_DIR.
   ════════════════════════════════════════════════════════════════════ */

window.SYM_LANG = 'gr';
window.SYM_DIR = window.SYM_DIR || {};

const STATE = {
  direction: 'synthesis',
  screen: 'home',
  screenParam: null,
  classId: 'gym-b',
  theme: 'alabaster',
  season: null,
  lang: 'gr',
  density: 'airy',
  ornament: 'rich',
  accent: 'soft',
  cursor: 'laurel',
  cursorShape: 'circle',
  cursorIcon: 'none',
  display: 'grid',
  hero: 'monogram',
  role: 'student',
  adminEdit: false,
  unlocked: [],
};
window.STATE = STATE;

/* ── tiny DOM helper ─────────────────────────────────────────────── */
function el(tag, attrs, kids) {
  const n = document.createElement(tag);
  if (attrs) for (const k in attrs) {
    if (k === 'class') n.className = attrs[k];
    else if (k === 'html') n.innerHTML = attrs[k];
    else if (k === 'style') n.setAttribute('style', attrs[k]);
    else if (k.startsWith('on') && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
  }
  if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(c => {
    if (c == null) return;
    n.appendChild((typeof c === 'string' || typeof c === 'number') ? document.createTextNode(String(c)) : c);
  });
  return n;
}
window.el = el;
/* theme-class helpers — body-level popups (onboarding, consent, guide, cookie)
   live outside #sym-home, so they must carry the active theme class to inherit
   the --fg/--card/--terra tokens (which are scoped to [class*="theme-"]). */
window.symThemeClass = () => 'theme-' + ((window.STATE && window.STATE.theme) || 'alabaster');
window.symApplyThemeClass = (node) => {
  if (!node) return;
  [...node.classList].forEach(c => { if (c.indexOf('theme-') === 0) node.classList.remove(c); });
  node.classList.add(window.symThemeClass());
};
window.L = window.SYM.L;

/* brand mark SVG (the SymposiON Σ-circuit glyph) */
function brandMark(cls) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  s.setAttribute('viewBox', '0 0 100 100'); s.setAttribute('class', cls || '');
  s.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square">'
    + '<line x1="22" y1="20" x2="78" y2="20"/><line x1="22" y1="20" x2="48" y2="50"/>'
    + '<line x1="48" y1="50" x2="22" y2="80"/><line x1="22" y1="80" x2="78" y2="80"/></g>'
    + '<g fill="none" stroke="var(--terra)" stroke-width="3.2" stroke-linecap="round">'
    + '<circle cx="64" cy="50" r="12" stroke-dasharray="62 12" stroke-dashoffset="-7" transform="rotate(-90 64 50)"/>'
    + '<line x1="64" y1="39" x2="64" y2="49"/></g>';
  return s;
}
window.brandMark = brandMark;

/* ── Illustration injector — inlines currentColor SVGs ───────────── */
const _illuCache = new Map();
async function _loadSvg(dir, name) {
  const key = dir + '/' + name;
  if (window.__SYM_SVG && window.__SYM_SVG[key] != null) return window.__SYM_SVG[key];
  if (!_illuCache.has(key)) {
    _illuCache.set(key, fetch('images/' + dir + '/' + name + '.svg')
      .then(r => r.ok ? r.text() : '')
      .catch(() => ''));
  }
  return _illuCache.get(key);
}
async function injectIllus(scope) {
  const jobs = [];
  scope.querySelectorAll('[data-illu]:not([data-done]), [data-sym]:not([data-done])').forEach(node => {
    const isSym = node.hasAttribute('data-sym');
    const dir = isSym ? 'bg-symbols' : 'illustrations';
    const name = node.getAttribute(isSym ? 'data-sym' : 'data-illu');
    node.setAttribute('data-done', '1');
    jobs.push(_loadSvg(dir, name).then(svg => {
      if (svg) { node.innerHTML = svg; const s = node.firstElementChild; if (s) { s.removeAttribute('width'); s.removeAttribute('height'); } }
    }));
  });
  await Promise.all(jobs);
}
window.injectIllus = injectIllus;

/* ════════════════════════ RENDER ════════════════════════ */
function render() {
  const home = document.getElementById('sym-home');
  home.className = 'theme-' + STATE.theme + ' dir-' + STATE.direction
    + ' density-' + STATE.density + ' orn-' + STATE.ornament + ' accent-' + STATE.accent;
  document.querySelector('.stage').className = 'stage theme-' + STATE.theme;
  // Mirror the active theme onto <body> so body-level game overlays inherit the
  // --sym-* tokens (the shared overlay chrome adapts to the selected theme).
  [...document.body.classList].forEach(c => { if (c.indexOf('theme-') === 0) document.body.classList.remove(c); });
  document.body.classList.add('theme-' + STATE.theme);
  home.innerHTML = '';

  const ctx = {
    L: window.SYM.L,
    classes: window.SYM.CLASSES,
    groups: window.SYM.CLASS_GROUPS,
    byId: (id) => (window.SYM.classById ? window.SYM.classById(id) : window.SYM.CLASSES.find(c => c.id === id)),
    subjects: window.SYM.SUBJECTS,
    engines: window.SYM.ENGINES,
    STR: window.SYM.STR,
    classId: STATE.classId,
    setClass: (id) => { STATE.classId = id; render(); },
    activeClass: (window.SYM.classById && window.SYM.classById(STATE.classId)) || window.SYM.CLASSES.find(c => c.id === STATE.classId),
  };

  // Mirror the Ver1 global the leveled-game curriculum gate + iframe launchers
  // read, and warm the per-class curriculum cache so the grammar level pickers
  // can filter synchronously (replaces Ver1 nav.js's prefetch-on-grade-nav).
  // prefetch() self-dedupes per grade and no-ops until firebase is ready.
  window.currentGradeKey = STATE.classId;
  if (window.CurriculumGate) CurriculumGate.prefetch(STATE.classId);

  // Keep the admin-only dev harness in sync with the current `isAdmin` state
  // (cheap: each builder early-returns when admin gating fails).
  buildHarness(); buildTweaks();

  const fn = window.SYM_DIR[STATE.direction];
  ctx.screen = STATE.screen;
  ctx.param = STATE.screenParam;
  ctx.fresh = (window.__symPrevDir !== STATE.direction) || (window.__symPrevScreen !== STATE.screen);
  window.__symPrevDir = STATE.direction;
  window.__symPrevScreen = STATE.screen;
  if (fn) fn(home, ctx);

  injectIllus(home);
  if (window.SymGuide) SymGuide.sync();
  if (window.SymSeasons) SymSeasons.applyCosmetic(window.SymStore ? SymStore.get('cosm_particle', null) : null);
  requestAnimationFrame(() => home.querySelectorAll('[data-animate]').forEach((n, i) => {
    n.style.setProperty('--d', (i * 50) + 'ms');
    requestAnimationFrame(() => n.classList.add('in'));
  }));
}
window.symRender = render;

// Screens that take no params and are safe to deep-link / restore from the URL hash
const DEEPLINK = ['home','assignments','gamepanel','live','profile','levelup','temple','anodos','tartarus','anathesi','parent','settings','checkout','admin','login','subscribe','account','tutor'];
function symGo(screen, param){
  var _prevScreen = STATE.screen, _prevParam = STATE.screenParam;
  STATE.screen = screen || 'home';
  STATE.screenParam = param || null;
  if (STATE.direction !== 'synthesis') { STATE.direction = 'synthesis'; buildHarness(); }
  // History/URL is owned by SymNav (js/sym-nav.js): it pushes a real back-stack
  // entry per navigation so Back returns to the previous screen, not home.
  if (window.SymNav && typeof SymNav._sync === 'function') {
    SymNav._sync(_prevScreen, _prevParam);
  } else {
    // Fallback before SymNav loads: legacy hash sync (replaceState).
    try {
      if (STATE.screen === 'tag' && STATE.screenParam && STATE.screenParam.tag) {
        history.replaceState(null, '', '#tag-' + STATE.screenParam.tag);
      } else if (!STATE.screenParam && DEEPLINK.indexOf(STATE.screen) >= 0) {
        if (STATE.screen === 'home') history.replaceState(null, '', location.pathname + location.search);
        else history.replaceState(null, '', '#' + STATE.screen);
      }
    } catch (_) {}
  }
  render();
  window.scrollTo(0, 0);
}
window.symGo = symGo;

/* ════════════════════════ HARNESS ════════════════════════ */
const THEMES = [
  // ── light ──
  { id:'alabaster',   nm:'Alabaster',   ds:'Pentelic marble', a:'#FAF7F0', b:'#C5572F', light:1, group:'light' },
  { id:'aegeanlight', nm:'Aegean Mist', ds:'Cool marble',     a:'#F3F6F6', b:'#3E7E86', light:1, group:'light' },
  { id:'papyrus',     nm:'Papyrus',     ds:'Warm daylight',   a:'#EFE7D6', b:'#C25A33', light:1, group:'light' },
  { id:'cycladic',    nm:'Cycladic',    ds:'White · Aegean',   a:'#EAF1F5', b:'#2E7BB5', light:1, group:'light' },
  { id:'elysium',     nm:'Elysium',     ds:'Pastel meadow',   a:'#F1F4E6', b:'#6F9E6A', light:1, group:'light' },
  { id:'marble',      nm:'Marble',      ds:'Cool slate',      a:'#F2F4F7', b:'#4A6B8A', light:1, group:'light' },
  { id:'linen',       nm:'Linen',       ds:'Ivory · sage',     a:'#F4EFE3', b:'#5E7F52', light:1, group:'light' },
  { id:'pearl',       nm:'Pearl',       ds:'Rose-grey · mauve', a:'#F2EEF0', b:'#9C5E84', light:1, group:'light' },
  { id:'honey',       nm:'Honey',       ds:'Cream · amber',    a:'#F6EEDB', b:'#C8862E', light:1, group:'light' },
  // ── dark ──
  { id:'obsidian',    nm:'Obsidian',    ds:'Black · gold',     a:'#0A0907', b:'#D2A24A', group:'dark' },
  { id:'hearth',      nm:'Hearth',      ds:'Warm dark',       a:'#18120A', b:'#D97B5C', group:'dark' },
  { id:'aegean',      nm:'Aegean',      ds:'Midnight sea',    a:'#0B1018', b:'#E0894C', group:'dark' },
  { id:'amphora',     nm:'Amphora',     ds:'Black-figure',    a:'#14100A', b:'#D75321', group:'dark' },
  { id:'porphyry',    nm:'Porphyry',    ds:'Imperial purple', a:'#180A0E', b:'#C13B57', group:'dark' },
  { id:'bronze',      nm:'Bronze',      ds:'Patina · verdigris', a:'#12120E', b:'#B5894C', group:'dark' },
  { id:'emerald',     nm:'Emerald',     ds:'Deep green · gold', a:'#08130E', b:'#2FA36F', group:'dark' },
  { id:'midnight',    nm:'Midnight',    ds:'Indigo · silver', a:'#090B16', b:'#6E7BD6', group:'dark' },
  { id:'darkink',     nm:'Ink',         ds:'Black · steel',    a:'#0B0D12', b:'#9AA6BC', group:'dark' },
  { id:'wine',        nm:'Oxblood',     ds:'Wine · gold',      a:'#160A0C', b:'#9C3A3F', group:'dark' },
  { id:'forest',      nm:'Forest',      ds:'Green · copper',   a:'#0C140E', b:'#5E9B6E', group:'dark' },
  // ── vivid ──
  { id:'olive',       nm:'Olive Grove', ds:'Green · gold',     a:'#14180E', b:'#8AA84E', group:'vivid' },
  { id:'venetian',    nm:'Venetian',    ds:'Purple · magenta', a:'#160A1E', b:'#D4499A', group:'vivid' },
  { id:'saffron',     nm:'Saffron',     ds:'Orange · amber',   a:'#1A1006', b:'#E8732A', group:'vivid' },
  { id:'coral',       nm:'Coral',       ds:'Coral · teal',     a:'#1C0E10', b:'#F0674E', group:'vivid' },
  { id:'rose',        nm:'Rosewood',    ds:'Rose · blush',     a:'#1A0E12', b:'#E0617E', group:'vivid' },
  { id:'flamingo',    nm:'Flamingo',    ds:'Magenta · cyan',   a:'#1C0A14', b:'#E84C8A', group:'vivid' },
  { id:'electric',    nm:'Electric',    ds:'Blue · lime',      a:'#08101C', b:'#3E7BE0', group:'vivid' },
  { id:'ultraviolet', nm:'Ultraviolet', ds:'Violet · teal',    a:'#120A1E', b:'#7E3CE0', group:'vivid' },
  // ── unlockable ──
  { id:'acroterion',    nm:'Acroterion',    ds:'Gilded roofline', a:'#08110F', b:'#E0B24C', lock:1, group:'vivid' },
  { id:'tyrian',        nm:'Tyrian Purple', ds:'The murex dye',   a:'#140A18', b:'#CA64B2', lock:1, group:'vivid' },
  { id:'golden-fleece', nm:'Golden Fleece', ds:'Radiant gold',    a:'#161003', b:'#F2C44C', lock:1, group:'vivid' },
  { id:'orphic',        nm:'Orphic Night',  ds:'Iridescent',      a:'#07080C', b:'#8E7FD6', lock:1, group:'vivid' },
  // ── seasonal (drive a flourish + cursor touch) ──
  { id:'halloween', nm:'Katabasis', ds:'Halloween', a:'#120A18', b:'#ED7A28', season:'halloween', group:'season' },
  { id:'christmas', nm:'Solstice',  ds:'Christmas',  a:'#FAF5EE', b:'#B5302A', light:1, season:'christmas', group:'season' },
  { id:'easter',    nm:'Anastasi',  ds:'Easter',     a:'#F6F6EC', b:'#DE7E6A', light:1, season:'easter', group:'season' },
  { id:'carnival',  nm:'Apokries',  ds:'Carnival',   a:'#160A1E', b:'#D4499A', season:'carnival', group:'season' },
  { id:'spring',    nm:'Πρωτομαγιά', ds:'Spring',  a:'#EFF4E6', b:'#6FA85A', light:1, season:'spring',  group:'season' },
  { id:'summer',    nm:'Πανηγύρι',  ds:'Summer',  a:'#FBF6E6', b:'#2E94B5', light:1, season:'summer',  group:'season' },
  { id:'autumn',    nm:'Τρύγος',     ds:'Autumn',  a:'#1A1008', b:'#C86A2E', season:'autumn',  group:'season' },
  { id:'newyear',   nm:'Πρωτοχρονιά', ds:'New Year', a:'#0A0F1C', b:'#F2CD78', season:'newyear', group:'season' },
  { id:'epiphany',  nm:'Φώτα',        ds:'Epiphany',   a:'#EAF2F6', b:'#2E86B5', light:1, season:'epiphany',   group:'season' },
  { id:'assumption',nm:'Δεκαπενταύγουστος', ds:'Assumption', a:'#EFF4F7', b:'#2E7BB5', light:1, season:'assumption', group:'season' },
  { id:'lent',      nm:'Σαρακοστή',   ds:'Lent',       a:'#ECEAEF', b:'#7E6F9C', light:1, season:'lent',       group:'season' },
  { id:'fall',      nm:'Φθινόπωρο',   ds:'Autumn',     a:'#1A1206', b:'#C8641E', season:'autumn',    group:'season' },
  { id:'royalcourt', nm:'Royal Court', ds:'Purple · gold',  a:'#19102C', b:'#E0B24C', group:'combo' },
  { id:'parquet',    nm:'Parquet',    ds:'Green · black',   a:'#0B0F0B', b:'#3FA35E', group:'combo' },
  { id:'rosso',      nm:'Rosso Corsa', ds:'Racing red',      a:'#160A0A', b:'#E0322E', group:'combo' },
  { id:'petrol',     nm:'Petrol',     ds:'Teal · silver',   a:'#0A1416', b:'#2EC4B6', group:'combo' },
  { id:'papaya',     nm:'Papaya',     ds:'Orange · blue',   a:'#0B1020', b:'#F0701E', group:'combo' },
  { id:'onyxgold',   nm:'Onyx & Gold', ds:'Black · yellow', a:'#0C0C0A', b:'#F2C81E', group:'combo' },
  { id:'navygarnet', nm:'Navy & Garnet', ds:'Blue · garnet', a:'#0A1024', b:'#A6324C', group:'combo' },
  { id:'crimsononyx', nm:'Crimson Onyx', ds:'Black · red',  a:'#120A0C', b:'#D42C3A', group:'combo' },
  { id:'verdeoro',   nm:'Verde Oro',  ds:'Green · gold',    a:'#0A140C', b:'#2FA85E', group:'combo' },
  { id:'skynavy',    nm:'Sky & Navy', ds:'Sky · navy',      a:'#0A1420', b:'#3EA8E0', group:'combo' },
  { id:'whitewolf',  nm:'White Wolf', ds:'Silver · red',    a:'#0C0D0F', b:'#C8312A', group:'combo' },
  { id:'warforged',  nm:'Warforged',  ds:'Ember · bronze',  a:'#100A06', b:'#E0541E', group:'combo' },
  { id:'wallcrawler',nm:'Wall-Crawler', ds:'Red · blue',    a:'#0A0A12', b:'#E01E2E', group:'combo' },
  { id:'flux',       nm:'Flux',       ds:'Steel · flame',   a:'#0A0C10', b:'#FF7A1E', group:'combo' },
  { id:'hyrule',     nm:'Hero of Time', ds:'Green · gold',  a:'#0A1209', b:'#2F9E4F', group:'combo' },
  { id:'plumber',    nm:'Plumber',    ds:'Red · blue · gold', a:'#0E0A0A', b:'#E0301E', group:'combo' },
  { id:'parisian',   nm:'Parisian',   ds:'Navy · red',      a:'#08101C', b:'#C8313F', group:'combo' },
  { id:'royalblue',  nm:'Royal Blue', ds:'Blue · white',    a:'#0A1024', b:'#2E5AE0', group:'combo' },
  { id:'empire',     nm:'Empire',     ds:'Blue · orange',   a:'#0A1430', b:'#F57920', group:'combo' },
  { id:'neonpink',   nm:'Neon Pink',  ds:'Pink · cyan',     a:'#0B0610', b:'#FF2E88', group:'neon' },
  { id:'neoncyan',   nm:'Neon Cyan',  ds:'Cyan · pink',     a:'#04100F', b:'#00F0FF', group:'neon' },
  { id:'neonlime',   nm:'Acid Lime',  ds:'Lime · teal',     a:'#0A0F04', b:'#B6FF1A', group:'neon' },
  { id:'neonviolet', nm:'Neon Violet', ds:'Violet · cyan',  a:'#0A0614', b:'#9B5CFF', group:'neon' },
  { id:'neonmagenta',nm:'Hot Magenta', ds:'Magenta · cyan', a:'#100410', b:'#FF2EE6', group:'neon' },
  { id:'neonorange', nm:'Neon Orange', ds:'Orange · cyan',  a:'#100802', b:'#FF6A00', group:'neon' },
  { id:'synthwave',  nm:'Synthwave',  ds:'Pink · cyan · violet', a:'#0C0618', b:'#FF2E88', group:'neon' },
  { id:'vapor',      nm:'Vaporwave',  ds:'Pink · blue',     a:'#0A0A16', b:'#FF6AD5', group:'neon' },
  { id:'crimsonwhite', nm:'Crimson & White', ds:'Red · white', a:'#160C0D', b:'#E02230', group:'combo' },
  { id:'goldazure',  nm:'Gold & Azure', ds:'Gold · blue',   a:'#0A1020', b:'#E0B22E', group:'combo' },
  { id:'claretsky',  nm:'Claret & Sky', ds:'Claret · sky',  a:'#140A10', b:'#8E2A44', group:'combo' },
  { id:'onyxivory',  nm:'Onyx & Ivory', ds:'Black · white', a:'#0C0C0C', b:'#E6E6E6', group:'combo' },
  { id:'viola',      nm:'Viola',      ds:'Purple · white', a:'#140E20', b:'#8E5AC2', group:'combo' },
];
window.SYM_THEMES = THEMES;

const DIRS = [
  { id:'synthesis', k:'★',  n:'Σύνθεση',  hint:'★ Fusion' },
  { id:'stoa',      k:'Α',  n:'Stoa',     hint:'Editorial' },
  { id:'agora',     k:'Β',  n:'Agora',    hint:'Playful' },
  { id:'akropolis', k:'Γ',  n:'Akrópolis',hint:'Modern' },
];

// The prototype dev harness + tweaks are ADMIN-ONLY. `isAdmin` is a bare
// top-level binding from auth.js (a classic script loaded before this one);
// it lives in the shared global lexical scope, NOT on window — reference it
// directly. Guard for the case where auth.js hasn't defined it yet.
function harnessAllowed(){ return (typeof isAdmin !== 'undefined') && !!isAdmin; }

// Theme application, exposed for ALL users (not only admins). The dev harness
// early-returns for non-admins and used to be the only thing that defined
// window.symApplyTheme — but the nav theme picker (next to Ἀγορά) needs it for
// everyone. buildHarness re-assigns an identical fn for admins; harmless.
function symApplyThemeGlobal(id){
  STATE.theme = id; if (window.SymStore) SymStore.set('theme', id);
  const t = THEMES.find(x => x.id === id);
  STATE.season = (t && t.season) || null;
  if (window.SymSeasons) SymSeasons.apply(STATE.season);
  if (typeof buildHarness === 'function') buildHarness();
  render();
}
window.symApplyTheme = symApplyThemeGlobal;

function buildHarness() {
  const bar = document.getElementById('harness');
  if (!bar) return;
  // Hide the dev harness for non-admins; keep the node empty + collapsed so it
  // can never overlap the real nav or clip on mobile.
  if (!harnessAllowed()) { bar.innerHTML = ''; bar.style.display = 'none'; return; }
  bar.style.display = '';
  bar.innerHTML = '';

  const brand = el('div', { class:'harness__brand' });
  brand.appendChild(brandMark('hb-mark'));
  brand.appendChild(el('span', { html:'Symposi<b>ON</b>' }));
  bar.appendChild(brand);

  // Direction switcher removed: Synthesis is the one and only production
  // direction now, so the old prototype "Stoa / Agora / Akrópolis" tabs
  // (and the "Editorial / Playful / Modern" hints) no longer appear. The
  // harness keeps only the admin theme/cursor controls. STATE.direction is
  // pinned to 'synthesis' (see the guard in render()).

  bar.appendChild(el('div', { class:'harness__spacer' }));

  // theme picker
  const pop = el('div', { class:'hpop' });
  const cur = THEMES.find(t=>t.id===STATE.theme);
  const tbtn = el('button', { class:'hctl', onclick:(e)=>{ e.stopPropagation(); menu.classList.toggle('open'); } }, [
    el('span',{class:'hctl__dot', style:`background:linear-gradient(135deg,${cur.a} 48%,${cur.b} 48%)`}),
    cur.nm
  ]);
  const menu = el('div', { class:'theme-menu' });
  menu.appendChild(el('div',{class:'theme-menu__hd'},'Θέμα · Theme'));
  const inSeason = window.SymSeasons ? SymSeasons.seasonOf(new Date()) : null;
  const cols = el('div', { class:'theme-menu__cols' });
  [['light','Φως · Light'],['dark','Σκότος · Dark'],['vivid','Ζωντανά · Vivid'],['season','Εποχικά · Seasonal'],['combo','Θρύλοι · Icons'],['neon','Neon · Νέον']].forEach(([g,label])=>{
    const col = el('div',{class:'theme-menu__col'});
    const sec = el('div',{class:'theme-menu__sec'}, label);
    if(g==='season' && inSeason) sec.appendChild(el('span',{class:'theme-menu__now'}, '● '+L({gr:'τώρα',en:'in season'})));
    col.appendChild(sec);
    const grid = el('div',{class:'theme-menu__grid'+(g==='combo'?' theme-menu__grid--two':'')});
    THEMES.filter(t=>t.group===g).forEach(t=>grid.appendChild(themeOpt(t, inSeason)));
    col.appendChild(grid);
    cols.appendChild(col);
  });
  menu.appendChild(cols);
  // cursor picker — TWO selections: geometric SHAPE (frame) + inner ICON
  const CUR_PREMIUM = ['monsterball','invader','ghost','mushroom','pixelheart','joystick','skull','katana'];
  function cursorPrice(kind, id){ if(id==='none') return 0; if(kind==='shape' && id==='circle') return 0; if(kind==='icon' && CUR_PREMIUM.indexOf(id)>=0) return 1800; return 600; }
  function cursorOwned(kind, id){ if(cursorPrice(kind,id)===0) return true; const def = kind==='shape'?['none','circle']:['none']; return (SymStore.get('own_cursor_'+kind, def)||[]).indexOf(id)>=0; }
  function cursorRow(kind, opts){
    menu.appendChild(el('div',{class:'theme-menu__sec theme-menu__sec--cursor'}, kind==='shape'?'Δείκτης · Σχῆμα · Shape':'Δείκτης · Εικονίδιο · Icon'));
    const row = el('div',{class:'theme-menu__cursors'});
    const cur = ()=> kind==='shape' ? (window.SymCursor?SymCursor.shape:'circle') : (window.SymCursor?SymCursor.icon:'none');
    function applySel(id, btn){
      if(kind==='shape'){ STATE.cursorShape=id; SymStore.set('cursor_shape', id); if(window.SymCursor) SymCursor.setShape(id); }
      else { STATE.cursorIcon=id; SymStore.set('cursor_icon', id); if(window.SymCursor) SymCursor.setIcon(id); }
      row.querySelectorAll('.cursor-opt').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    }
    opts.forEach(([id,nm,kindHint])=>{
      let glm;
      if(id==='none'){ glm = el('span',{class:'cursor-opt__gl cursor-opt__gl--sys'}, '∅'); }
      else if(kind==='shape'){ glm = el('span',{class:'cursor-opt__gl'}); glm.innerHTML = (window.SymCursor&&SymCursor.shapeSVG)?SymCursor.shapeSVG(id):''; }
      else if(kindHint==='inline'){ glm = el('span',{class:'cursor-opt__gl'}); glm.innerHTML = (window.SymCursor&&SymCursor.iconSVG)?SymCursor.iconSVG(id):''; }
      else { glm = el('span',{class:'cursor-opt__gl'}); glm.setAttribute(kindHint==='sym'?'data-sym':'data-illu', kindHint==='sym'?'laurel-arc':id); }
      const price=cursorPrice(kind,id), owned=cursorOwned(kind,id), premium=price>=1800;
      const btn = el('button',{ class:'cursor-opt'+(cur()===id?' active':'')+(owned?'':' locked')+(premium?' premium':''), title:nm+(owned?'':' · ⌾ '+price.toLocaleString('en-US')),
        onclick:(e)=>{ e.stopPropagation();
          if(owned){ applySel(id, e.currentTarget); return; }
          const spend = (window.symSpendKleos) ? window.symSpendKleos(price) : (function(){ const k=SymStore.get('kleos',0); if(k>=price){ SymStore.set('kleos',k-price); return true; } return false; })();
          if(spend){ const key='own_cursor_'+kind, def=kind==='shape'?['none','circle']:['none']; const ow=SymStore.get(key,def).slice(); ow.push(id); SymStore.set(key,ow); const pr=e.currentTarget.querySelector('.cursor-opt__price'); if(pr) pr.remove(); e.currentTarget.classList.remove('locked'); applySel(id, e.currentTarget); }
          else { e.currentTarget.classList.add('shake'); setTimeout(()=>e.currentTarget.classList.remove('shake'),420); } } },
        [ glm, el('span',{class:'cursor-opt__nm'}, nm) ]);
      if(!owned) btn.appendChild(el('span',{class:'cursor-opt__price'}, '⌾'+price.toLocaleString('en-US')));
      row.appendChild(btn);
    });
    menu.appendChild(row);
  }
  cursorRow('shape', [['none','Κανένα'],['circle','Κύκλος'],['diamond','Ρόμβος'],['square','Τετράγωνο'],['hexagon','Εξάγωνο'],['triangle','Τρίγωνο'],['reticle','Στόχαστρο']]);
  cursorRow('icon', [['none','Κανένα'],['star','Αστέρι','inline'],['eye','Μάτι','inline'],['dot','Κουκκίδα','inline'],['arrow','Βέλος','inline'],['meander','Μαίανδρος','inline'],['bolt','Κεραυνός','inline'],['trident','Τρίαινα','illu'],['owl','Γλαύκα','illu'],['wreath','Στέφανος','illu'],['laurel','Δάφνη','sym'],['stylus','Γραφίδα','illu'],['monsterball','Σφαίρα','inline'],['invader','Invader','inline'],['ghost','Φάντασμα','inline'],['mushroom','Μανιτάρι','inline'],['pixelheart','8-bit Καρδιά','inline'],['joystick','Joystick','inline'],['skull','Κρανίο','inline'],['katana','Κατάνα','inline']]);
  pop.appendChild(tbtn); pop.appendChild(menu);
  bar.appendChild(pop);

  function applyTheme(id){
    STATE.theme=id; SymStore.set('theme', id);
    const t = THEMES.find(x=>x.id===id);
    STATE.season = (t && t.season) || null;
    if(window.SymSeasons) SymSeasons.apply(STATE.season);
    buildHarness(); render();
  }
  window.symApplyTheme = applyTheme;

  function themePrice(t){ return t.lock ? 2600 : (t.group==='neon' ? 2200 : (t.group==='combo' ? 1800 : (t.group==='vivid' ? 1400 : 0))); }
  function freeThemeIds(){ return THEMES.filter(t=>themePrice(t)===0).map(t=>t.id); }
  function themeOwned(id){ const t=THEMES.find(x=>x.id===id); if(!t || themePrice(t)===0) return true;
    // Member perk: themes granted to signed-up users live in STATE.unlocked.
    if (window.STATE && Array.isArray(STATE.unlocked) && STATE.unlocked.indexOf(id)>=0) return true;
    return (SymStore.get('own_theme', freeThemeIds())||[]).indexOf(id)>=0; }

  function themeOpt(t, inSeason){
    const price = themePrice(t);
    const locked = !themeOwned(t.id);
    const btn = el('button',{ class:'theme-opt'+(t.id===STATE.theme?' active':'')+(locked?' theme-opt--locked':''),
      onclick:(e)=>{ e.stopPropagation(); if(locked){ buyTheme(t, btn); } else { applyTheme(t.id); } } }, [
      el('span',{class:'theme-opt__sw', style:`background:linear-gradient(135deg,${t.a} 50%,${t.b} 50%)`}),
      el('span',{}, [ el('span',{class:'theme-opt__nm'}, t.nm), el('br'), el('span',{class:'theme-opt__ds'}, t.ds) ])
    ]);
    if(locked) btn.appendChild(el('span',{class:'theme-opt__price', title:L({gr:'Ξεκλείδωσε με Kleos',en:'Unlock with Kleos'})}, '⌾ '+price.toLocaleString('en-US')));
    if(t.season && t.season===inSeason) btn.appendChild(el('span',{class:'theme-opt__now', title:'In season'}));
    return btn;
  }

  function buyTheme(t, btn){
    const price = themePrice(t);
    const spend = (window.symSpendKleos) ? window.symSpendKleos(price) : (function(){ const k=SymStore.get('kleos',0); if(k>=price){ SymStore.set('kleos',k-price); return true; } return false; })();
    if(!spend){ btn.classList.add('shake'); setTimeout(()=>btn.classList.remove('shake'),440); return; }
    const own = SymStore.get('own_theme', freeThemeIds()); own.push(t.id); SymStore.set('own_theme', own);
    btn.classList.add('unlocking');
    const pr = btn.querySelector('.theme-opt__price'); if(pr) pr.remove();
    if(window.gsap){
      const r = btn.getBoundingClientRect();
      for(let i=0;i<14;i++){
        const sp=document.createElement('span');
        sp.style.cssText=`position:fixed;left:${r.left+18}px;top:${r.top+r.height/2}px;width:6px;height:6px;border-radius:50%;background:${t.b};z-index:9999;pointer-events:none`;
        document.body.appendChild(sp);
        const a=Math.random()*Math.PI*2, d=22+Math.random()*42;
        gsap.to(sp,{x:Math.cos(a)*d,y:Math.sin(a)*d,opacity:0,scale:0.2,duration:.6+Math.random()*.3,ease:'power2.out',onComplete:()=>sp.remove()});
      }
      gsap.fromTo(btn,{scale:.9},{scale:1,duration:.5,ease:'elastic.out(1,.4)'});
    }
    setTimeout(()=>applyTheme(t.id), 300);
  }

  // language
  const lang = el('div', { class:'hlang' });
  ['gr','en'].forEach(l=>lang.appendChild(el('button',{
    class:(STATE.lang===l?'active':''), onclick:()=>{ STATE.lang=l; window.SYM_LANG=l; buildHarness(); render(); }
  }, l.toUpperCase())));
  bar.appendChild(lang);

  // tweaks toggle
  bar.appendChild(el('button', { class:'hctl'+(tweaksOpen?' on':''), onclick:toggleTweaks }, [
    iconSliders(), 'Tweaks'
  ]));
  if (window.injectIllus) injectIllus(bar);
}

function iconSliders(){
  const s=document.createElementNS('http://www.w3.org/2000/svg','svg');
  s.setAttribute('viewBox','0 0 24 24'); s.setAttribute('fill','none'); s.setAttribute('stroke','currentColor');
  s.setAttribute('stroke-width','2'); s.setAttribute('stroke-linecap','round');
  s.innerHTML='<line x1="4" y1="8" x2="20" y2="8"/><circle cx="9" cy="8" r="2.4" fill="var(--bg,#14161b)"/><line x1="4" y1="16" x2="20" y2="16"/><circle cx="15" cy="16" r="2.4" fill="var(--bg,#14161b)"/>';
  return s;
}

document.addEventListener('click', ()=>document.querySelectorAll('.theme-menu.open').forEach(m=>m.classList.remove('open')));

/* ── Tweaks panel ───────────────────────────────────────────────── */
let tweaksOpen = false;
function toggleTweaks(){ tweaksOpen = !tweaksOpen; document.getElementById('tweaks').classList.toggle('open', tweaksOpen); buildHarness(); }
function buildTweaks(){
  const p = document.getElementById('tweaks');
  if (!p) return;
  // Tweaks panel is part of the dev harness — admin-only.
  if (!harnessAllowed()) { p.innerHTML=''; p.classList.remove('open'); p.style.display='none'; tweaksOpen=false; return; }
  p.style.display='';
  p.innerHTML='';
  p.appendChild(el('div',{class:'tweaks__hd'},[ el('span',{},'Tweaks'), el('button',{onclick:toggleTweaks, html:'&times;'}) ]));
  const body = el('div',{class:'tweaks__body'});
  body.appendChild(seg('Πυκνότητα · Density', [['airy','Airy'],['compact','Compact']], 'density'));
  body.appendChild(seg('Διάκοσμος · Ornament', [['rich','Rich'],['subtle','Subtle']], 'ornament'));
  body.appendChild(seg('Έμφαση · Accent', [['soft','Soft'],['bold','Bold']], 'accent'));
  body.appendChild(seg('Hero', [['monogram','Monogram'],['minimal','Minimal']], 'hero'));
  body.appendChild(roleSeg());
  p.appendChild(body);
}
function roleSeg(){
  const wrap = el('div',{class:'tweak'});
  wrap.appendChild(el('div',{class:'tweak__lbl'}, 'Ρόλος · Role'));
  const s = el('div',{class:'seg'});
  [['student','Μαθητής'],['admin','Admin']].forEach(([val,txt])=>s.appendChild(el('button',{
    class:(STATE.role===val?'active':''),
    onclick:()=>{ STATE.role=val; STATE.adminEdit=(val==='admin'); buildTweaks(); render(); }
  }, txt)));
  wrap.appendChild(s);
  return wrap;
}
function cursorTweak(){
  const wrap=el('div',{class:'tweak'});
  wrap.appendChild(el('div',{class:'tweak__lbl'},'Δείκτης · Cursor'));
  const grid=el('div',{class:'seg seg--wrap'});
  [['classic','Classic'],['laurel','Δάφνη'],['stylus','Γραφίδα'],['owl','Γλαύκα'],['crosshair','Σταυρόνημα'],['diamond','Ρόμβος']].forEach(([v,t])=>{
    grid.appendChild(el('button',{ class:(STATE.cursor===v?'active':''),
      onclick:()=>{ STATE.cursor=v; if(window.SymCursor) SymCursor.set(v); buildTweaks(); } }, t));
  });
  wrap.appendChild(grid);
  return wrap;
}
function seg(label, opts, key){
  const wrap = el('div',{class:'tweak'});
  wrap.appendChild(el('div',{class:'tweak__lbl'}, label));
  const s = el('div',{class:'seg'});
  opts.forEach(([val,txt])=>s.appendChild(el('button',{
    class:(STATE[key]===val?'active':''), onclick:()=>{ STATE[key]=val; buildTweaks(); render(); }
  }, txt)));
  wrap.appendChild(s);
  return wrap;
}

/* ── boot ───────────────────────────────────────────────────────── */
function boot(){
  try{ const u=JSON.parse(localStorage.getItem('sym_revamp_unlocked')||'[]'); if(Array.isArray(u)) STATE.unlocked=u; }catch(_){}
  // A brand-new user starts with 0 Kleos and earns it by playing — no demo
  // seed. (The old reviewer seed granted 1,000,000 Kleos, which made the Agora
  // look "completed" / everything already affordable for a fresh account.)
  // restore saved theme / cursor; else auto-detect season by date
  const savedTheme = window.SymStore && SymStore.get('theme', null);
  if(savedTheme && THEMES.find(t=>t.id===savedTheme)) STATE.theme = savedTheme;
  else if(window.SymSeasons){ const s = SymSeasons.seasonOf(new Date()); const st = THEMES.find(t=>t.season===s); if(st) STATE.theme = st.id; }
  const tObj = THEMES.find(t=>t.id===STATE.theme); STATE.season = (tObj && tObj.season) || null;
  const savedShape = window.SymStore && SymStore.get('cursor_shape', null);
  const savedIcon  = window.SymStore && SymStore.get('cursor_icon', null);
  if(savedShape) STATE.cursorShape = savedShape;
  if(savedIcon)  STATE.cursorIcon = savedIcon;
  if(window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  // deep-link: restore screen from the URL hash (#temple, #admin, …)
  try { const h = (location.hash || '').replace(/^#\/?/, ''); const segs = h.split('/'); const first = segs[0] || ''; if (first === 'tag' && segs[1]) { STATE.screen = 'tag'; STATE.screenParam = { tag: segs[1] }; } else if (first.indexOf('tag-') === 0) { STATE.screen = 'tag'; STATE.screenParam = { tag: first.slice(4) }; } else if (first && DEEPLINK.indexOf(first) >= 0) STATE.screen = first; } catch(_){}
  // PREVIEW bootstrap — only when ?preview params are present (used by the overview panel).
  // e.g. ?screen=admin&sec=tags&role=admin   ·   ?screen=tag&tag=tragedies
  try {
    const q = new URLSearchParams(location.search);
    if (q.has('screen')) {
      if (q.get('role') === 'admin') { STATE.role = 'admin'; STATE.adminEdit = true; }
      if (q.get('sec')) window.__adminSec = q.get('sec');
      const sc = q.get('screen');
      if (sc === 'tag') { STATE.screen = 'tag'; STATE.screenParam = { tag: q.get('tag') || 'tragedies' }; }
      else { STATE.screen = sc; STATE.screenParam = null; }
      if (q.get('chrome') === '0') document.documentElement.classList.add('preview-nochrome');
    }
  } catch(_){}
  // Live Arena invite deeplink (?join=PIN): the engine is lazy, so nothing reads
  // the PIN at boot. Lazy-load it (synLaunch injects la-overlay + the engine);
  // live-arena.js's own _checkUrlJoin then reads ?join= and opens the join screen.
  try {
    var _jpin = (new URLSearchParams(location.search)).get('join');
    if (_jpin && /^\d{4,8}$/.test(_jpin) && window.synLaunch) setTimeout(function () { try { window.synLaunch('openLiveArena'); } catch (_) {} }, 0);
  } catch (_) {}
  // Combined-content deep link (?game=<openFn>&ds=<dataset>&levels=<csv>): a
  // scanned QR from the engine setup screen opens the EXACT combined selection.
  // Build the merged bank via SymMix and launch the engine with it (same
  // injection path as the Start button → window.launchEngineWithBank). Guarded:
  // a malformed/absent param is a silent no-op (engines without a setup also
  // launch with whatever the launcher passes). Mirrors the ?join= handler.
  try {
    var _q = new URLSearchParams(location.search);
    var _g = _q.get('game'), _ds = _q.get('ds'), _lv = _q.get('levels');
    if (_g && _ds && _lv && window.SymMix && typeof window.launchEngineWithBank === 'function'
        && window.SYN_GAMES && window.SYN_GAMES[_g]) {
      var _ids = _lv.split(',').map(function (s) { var n = parseInt(s, 10); return isNaN(n) ? s.trim() : n; })
                    .filter(function (v) { return v !== '' && v != null; });
      if (_ids.length) {
        var _inj = (window.SymMix.ENGINE_INJECTION && window.SymMix.ENGINE_INJECTION[_g]) || null;
        setTimeout(function () { try { window.launchEngineWithBank(_g, _inj, _ds, _ids, ''); } catch (_) {} }, 0);
      }
    }
  } catch (_) {}
  // History/back-button navigation is owned by SymNav (js/sym-nav.js) via a
  // popstate-driven back-stack. The legacy hashchange restorer is retired so
  // the two don't double-handle the same Back press.
  // Agora auto-update: re-render the open Agora when new content is added,
  // in this tab (custom event) or another (native 'storage' event).
  function agoraSync(key){
    if (STATE.direction!=='synthesis' || STATE.screen!=='temple') return;
    if (key && !/^(custom_|admin_)/.test(key) && ['hero_slides','guides','level_rewards','game_tags','custom_tags'].indexOf(key)<0) return;
    clearTimeout(window.__agoraSync);
    window.__agoraSync = setTimeout(()=>{ if (STATE.screen==='temple') render(); }, 180);
  }
  window.addEventListener('sym-store', (e)=> agoraSync(e.detail && e.detail.key));
  window.addEventListener('storage', (e)=>{ if (e.key && e.key.indexOf('sym_revamp_')===0) agoraSync(e.key.replace('sym_revamp_','')); });
  buildHarness(); buildTweaks(); render();
  // The harness is built once here, before auth resolves — so for the default
  // (non-admin) state it stays hidden. Re-evaluate after auth flips `isAdmin`:
  // auth.js toggles `body.is-admin` when admin is confirmed, so observe that.
  window.symRefreshHarness = function(){ buildHarness(); buildTweaks(); };
  try {
    const _admObs = new MutationObserver(() => window.symRefreshHarness());
    _admObs.observe(document.body, { attributes:true, attributeFilter:['class'] });
  } catch(_){}
  // PREVIEW: optionally auto-open the theme/cursor picker (used by the overview panel)
  try { const q = new URLSearchParams(location.search); if (q.get('menu') === 'themes') setTimeout(()=>{ const m=document.querySelector('.theme-menu'); if(m) m.classList.add('open'); }, 60); } catch(_){}
  if(window.SymSeasons){ SymSeasons.apply(STATE.season); SymSeasons.applyCosmetic(SymStore.get('cosm_particle', null)); }
  if(window.SymCursor){ SymCursor.init(); SymCursor.setShape(STATE.cursorShape); SymCursor.setIcon(STATE.cursorIcon); }
  if(window.SymMouseFX){ SymMouseFX.init(); SymMouseFX.set(SymStore.get('mousefx','none')); }
  // STUDENT layer: mount the Guide FAB; run consent gate → first-visit onboarding (suppressed in ?screen= preview mode)
  if (window.SymGuide) SymGuide.mount();
  if (window.SymSys) SymSys.initOffline();
  // NOTE: No popups on boot. The cookie banner (SymConsent.start) and the
  // first-visit onboarding overlay (SymOnboard.maybeStart) are intentionally
  // NOT called here — a brand-new visitor sees zero popups. The GDPR age-gate
  // and the role/mode picker now run only inside the SIGN-UP flow (see
  // window.SymSignupFlow below + js/auth.js / js/dir-synthesis.js). Terms &
  // Privacy stay reachable from the footer. SymGuide stays mounted (above)
  // but never auto-pops the role picker.
  // click-to-throw burst over the design stage (ignore taps on controls)
  document.addEventListener('click', (e)=>{
    if(!window.SymSeasons || !window.SymSeasons.clickThrow) return;
    const inStage = e.target.closest && e.target.closest('.stage') && !e.target.closest('.harness') && !e.target.closest('.tweaks') && !e.target.closest('.theme-menu');
    if(!inStage) return;
    if(e.target.closest('a,button,input,select,textarea,[role=button],.acro-card,.lv-row,.sc-mode,.syn-tile,.sc-gcard,.sc-engc')) return;
    SymSeasons.clickThrow(e.clientX, e.clientY);
  });
}
if (document.readyState !== 'loading') boot(); else document.addEventListener('DOMContentLoaded', boot);

/* ── SymLoader · branded loading overlay (login / async) ─────────────── */
window.SymLoader = (function () {
  let ov;
  const SYM_VARIANTS = ['ignite', 'meander', 'kylix', 'laurel', 'inscribe'];
  function ensure() {
    if (ov) return ov;
    ov = document.createElement('div'); ov.className = 'sym-loader'; ov.setAttribute('aria-hidden', 'true');
    const box = document.createElement('div'); box.className = 'sym-loader__box';
    const mark = document.createElement('div'); mark.className = 'sym-loader__mark'; mark.appendChild(brandMark('sym-loader__svg'));
    const txt = document.createElement('div'); txt.className = 'sym-loader__txt';
    box.appendChild(mark); box.appendChild(txt); ov.appendChild(box);
    document.body.appendChild(ov); return ov;
  }
  // Render a freshly-randomised SymLoaders variant into .sym-loader__mark.
  // Falls back to the static brandMark if window.SymLoaders is unavailable.
  function renderMark(o) {
    const mark = o.querySelector('.sym-loader__mark');
    if (!mark) return;
    if (window.SymLoaders && typeof window.SymLoaders.mount === 'function') {
      mark.innerHTML = ''; // clear so variants don't stack
      // The variant brings its OWN spin; neutralise the host .sym-loader__mark's
      // sym-spin + fixed 60px box so the mark doesn't double-rotate or overflow.
      mark.style.animation = 'none';
      mark.style.width = 'auto'; mark.style.height = 'auto';
      const variant = SYM_VARIANTS[Math.floor(Math.random() * SYM_VARIANTS.length)];
      window.SymLoaders.mount(mark, { variant: variant, size: 56 });
    } else if (!mark.firstChild) {
      mark.appendChild(brandMark('sym-loader__svg'));
    }
  }
  let _safety = 0, _showTok = 0;
  function show(msg) {
    const o = ensure(); renderMark(o); o.querySelector('.sym-loader__txt').textContent = msg || (window.SYM_LANG === 'en' ? 'Loading…' : 'Φόρτωση…');
    // Token guards the deferred class-add: if hide() lands before this rAF
    // fires (instant cache-hit relaunches), the stale add must NOT run — it
    // would re-veil the UI with the safety timer already cleared.
    const tok = ++_showTok;
    requestAnimationFrame(() => { if (tok === _showTok) o.classList.add('on'); });
    // Safety net: the loader has pointer-events:auto while .on, so if a lazy-load
    // ever HANGS (e.g. a game engine + Firebase that never resolves), synLaunch's
    // finally→hide never runs and the loader silently blocks EVERY click. Force a
    // hide after 10s so the UI is never permanently frozen.
    clearTimeout(_safety); _safety = setTimeout(hide, 10000);
    return o;
  }
  function hide() { _showTok++; clearTimeout(_safety); if (ov) ov.classList.remove('on'); }
  return { show, hide };
})();
