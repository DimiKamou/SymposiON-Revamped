// ============================================================
//  SymposiON — Ναὸς τῶν Μουσῶν (Temple of the Muses)
//  The player surface. Vanilla-JS port of the design-handoff prototype.
//
//  Renders the web "rail" layout into #page-temple as a pure function of
//  getRealm() (js/realm.js) + getProgression() (js/progression.js).
//  Currency is `drachmas`, surfaced as "Kleos · Glory".
//
//  Wrapped in an IIFE; exposes only:
//    window.navToTemple()      — nav entry / route + render
//    window.renderTemplePage() — (re)render the open Temple page
//    window.Temple             — action + UI handlers used by onclick=
//
//  Load order: AFTER realm.js, progression.js, temple-themes.js.
// ============================================================
(function () {
  'use strict';

  // ── glyph set (100×100 classical line-icons, stroke:currentColor) ──
  const G = {
    acropolis: '<path d="M 4 86 Q 22 78 50 78 Q 78 78 96 86" stroke-opacity="0.5"/><line x1="14" y1="78" x2="86" y2="78"/><line x1="16" y1="75" x2="84" y2="75"/><line x1="18" y1="72" x2="82" y2="72"/><line x1="22" y1="72" x2="22" y2="40"/><line x1="24" y1="72" x2="24" y2="40"/><rect x="21" y="38" width="4" height="2"/><line x1="30" y1="72" x2="30" y2="40"/><line x1="32" y1="72" x2="32" y2="40"/><rect x="29" y="38" width="4" height="2"/><line x1="38" y1="72" x2="38" y2="40"/><line x1="40" y1="72" x2="40" y2="40"/><rect x="37" y="38" width="4" height="2"/><line x1="46" y1="72" x2="46" y2="40"/><line x1="48" y1="72" x2="48" y2="40"/><rect x="45" y="38" width="4" height="2"/><line x1="54" y1="72" x2="54" y2="40"/><line x1="56" y1="72" x2="56" y2="40"/><rect x="53" y="38" width="4" height="2"/><line x1="62" y1="72" x2="62" y2="40"/><line x1="64" y1="72" x2="64" y2="40"/><rect x="61" y="38" width="4" height="2"/><line x1="70" y1="72" x2="70" y2="40"/><line x1="72" y1="72" x2="72" y2="40"/><rect x="69" y="38" width="4" height="2"/><line x1="78" y1="72" x2="78" y2="40"/><line x1="80" y1="72" x2="80" y2="40"/><rect x="77" y="38" width="4" height="2"/><line x1="18" y1="38" x2="84" y2="38"/><line x1="18" y1="34" x2="84" y2="34"/><line x1="18" y1="30" x2="84" y2="30"/><path d="M 16 30 L 50 14 L 86 30"/><circle cx="50" cy="12" r="1.5"/>',
    cards: '<rect x="14" y="32" width="32" height="48" rx="2" transform="rotate(-8 30 56)"/><rect x="36" y="22" width="32" height="48" rx="2"/><line x1="36" y1="32" x2="68" y2="32" stroke-opacity="0.5"/><line x1="42" y1="40" x2="62" y2="40" stroke-opacity="0.5"/><line x1="42" y1="46" x2="62" y2="46" stroke-opacity="0.5"/><line x1="42" y1="52" x2="56" y2="52" stroke-opacity="0.5"/><rect x="58" y="34" width="28" height="48" rx="2" transform="rotate(8 72 58)"/><path d="M 64 50 Q 72 44 80 50 Q 84 56 78 64 Q 72 70 64 66 Z" stroke-opacity="0.7" transform="rotate(8 72 58)"/>',
    chariot: '<path d="M 8 54 Q 10 48 18 48 L 26 48 Q 30 42 34 46 L 34 54 L 24 54 L 22 60 L 20 54 L 14 54 L 12 60 L 10 54 Z"/><line x1="34" y1="48" x2="38" y2="42" stroke-opacity="0.5"/><path d="M 26 58 Q 28 52 36 52 L 44 52 Q 48 46 52 50 L 52 58 L 42 58 L 40 64 L 38 58 L 32 58 L 30 64 L 28 58 Z" stroke-opacity="0.85"/><line x1="52" y1="54" x2="68" y2="62"/><line x1="34" y1="50" x2="60" y2="62" stroke-opacity="0.5"/><path d="M 64 56 L 90 56 L 90 70 L 64 70 Z"/><path d="M 64 56 Q 64 50 70 50 L 84 50 Q 90 50 90 56"/><circle cx="78" cy="74" r="10"/><line x1="68" y1="74" x2="88" y2="74"/><line x1="78" y1="64" x2="78" y2="84"/><line x1="71" y1="67" x2="85" y2="81"/><line x1="85" y1="67" x2="71" y2="81"/><circle cx="78" cy="74" r="1.2" fill="currentColor"/><line x1="4" y1="86" x2="96" y2="86" stroke-opacity="0.4"/>',
    column: '<rect x="28" y="12" width="44" height="5"/><path d="M 32 17 Q 32 22 36 22 L 64 22 Q 68 22 68 17"/><line x1="34" y1="24" x2="66" y2="24" stroke-opacity="0.5"/><line x1="36" y1="24" x2="34" y2="80"/><line x1="64" y1="24" x2="66" y2="80"/><line x1="42" y1="26" x2="41" y2="78" stroke-opacity="0.45"/><line x1="48" y1="26" x2="48" y2="78" stroke-opacity="0.45"/><line x1="54" y1="26" x2="54" y2="78" stroke-opacity="0.45"/><line x1="60" y1="26" x2="61" y2="78" stroke-opacity="0.45"/><path d="M 32 80 Q 32 86 36 86 L 64 86 Q 68 86 68 80"/><rect x="28" y="86" width="44" height="4"/><line x1="14" y1="92" x2="86" y2="92" stroke-opacity="0.4"/>',
    'cyclops-eye': '<line x1="86" y1="50" x2="94" y2="50"/><line x1="81.18" y1="68" x2="88.11" y2="72" stroke-opacity="0.5"/><line x1="68" y1="81.18" x2="72" y2="88.11"/><line x1="50" y1="86" x2="50" y2="94" stroke-opacity="0.5"/><line x1="32" y1="81.18" x2="28" y2="88.11"/><line x1="18.82" y1="68" x2="11.89" y2="72" stroke-opacity="0.5"/><line x1="14" y1="50" x2="6" y2="50"/><line x1="18.82" y1="32" x2="11.89" y2="28" stroke-opacity="0.5"/><line x1="32" y1="18.82" x2="28" y2="11.89"/><line x1="50" y1="14" x2="50" y2="6" stroke-opacity="0.5"/><line x1="68" y1="18.82" x2="72" y2="11.89"/><line x1="81.18" y1="32" x2="88.11" y2="28" stroke-opacity="0.5"/><path d="M 16 50 Q 50 26 84 50 Q 50 74 16 50 Z"/><circle cx="50" cy="50" r="12"/><circle cx="50" cy="50" r="4" fill="currentColor"/><path d="M 24 36 Q 50 24 76 36" stroke-width="2"/>',
    gear: '<circle cx="50" cy="50" r="18"/><circle cx="50" cy="50" r="6"/><rect x="46" y="14" width="8" height="10"/><rect x="46" y="76" width="8" height="10"/><rect x="14" y="46" width="10" height="8"/><rect x="76" y="46" width="10" height="8"/><rect x="23" y="23" width="10" height="8" transform="rotate(-45 28 27)"/><rect x="67" y="23" width="10" height="8" transform="rotate(45 72 27)"/><rect x="23" y="69" width="10" height="8" transform="rotate(45 28 73)"/><rect x="67" y="69" width="10" height="8" transform="rotate(-45 72 73)"/>',
    helmet: '<path d="M 22 24 Q 28 8 38 22 Q 44 8 54 22 Q 60 8 70 22 Q 76 8 82 24"/><path d="M 22 24 Q 50 30 82 24"/><path d="M 26 28 Q 24 56 32 70 L 70 70 Q 78 56 76 28"/><path d="M 38 44 L 38 58 Q 38 64 44 64 L 50 64 L 50 76 L 54 76 L 54 64 L 60 64 Q 62 64 62 58 L 62 44 Z"/><line x1="50" y1="44" x2="50" y2="62" stroke-opacity="0.4"/><path d="M 26 28 Q 50 32 76 28" stroke-opacity="0.5"/><path d="M 32 70 Q 34 80 40 82 L 60 82 Q 66 80 68 70" stroke-opacity="0.5"/>',
    labyrinth: '<rect x="14" y="14" width="72" height="72"/><path d="M 22 22 L 78 22 L 78 78 L 28 78 L 28 30 L 70 30 L 70 70 L 36 70 L 36 38 L 62 38 L 62 62 L 44 62 L 44 46 L 54 46 L 54 54 L 50 54"/><circle cx="50" cy="50" r="2" fill="currentColor"/>',
    lightning: '<path d="M 56 10 L 30 50 L 48 50 L 38 90 L 70 44 L 52 44 L 60 10 Z"/><path d="M 56 10 L 50 30" stroke-opacity="0.4"/><path d="M 38 90 L 50 70" stroke-opacity="0.4"/><line x1="20" y1="18" x2="14" y2="14" stroke-opacity="0.5"/><line x1="80" y1="22" x2="86" y2="18" stroke-opacity="0.5"/><line x1="18" y1="80" x2="12" y2="84" stroke-opacity="0.5"/><line x1="82" y1="78" x2="88" y2="82" stroke-opacity="0.5"/>',
    runner: '<circle cx="58" cy="22" r="7"/><path d="M 56 30 L 50 48 L 38 60"/><path d="M 50 48 L 62 56 L 56 74 L 44 86"/><path d="M 62 56 L 70 70 L 76 84"/><path d="M 56 30 L 42 36"/><path d="M 56 30 L 72 38"/><path d="M 72 38 L 80 32" stroke-opacity="0.7"/><path d="M 42 36 L 36 30" stroke-opacity="0.7"/><line x1="10" y1="92" x2="90" y2="92"/><line x1="6" y1="92" x2="14" y2="92" stroke-width="2"/><path d="M 10 70 L 22 74" stroke-opacity="0.45" stroke-dasharray="2 3"/><path d="M 8 80 L 24 84" stroke-opacity="0.45" stroke-dasharray="2 3"/>',
    scroll: '<ellipse cx="20" cy="50" rx="8" ry="22"/><ellipse cx="20" cy="50" rx="3" ry="22"/><ellipse cx="80" cy="50" rx="8" ry="22"/><ellipse cx="80" cy="50" rx="3" ry="22"/><path d="M 20 28 L 80 28"/><path d="M 20 72 L 80 72"/><path d="M 28 38 Q 32 36 36 38 T 44 38 T 52 38 T 60 38 T 68 38 T 76 38" stroke-opacity="0.65"/><path d="M 28 46 Q 32 44 36 46 T 44 46 T 52 46 T 60 46 T 68 46 T 76 46" stroke-opacity="0.65"/><path d="M 28 54 Q 32 52 36 54 T 44 54 T 52 54 T 60 54 T 68 54 T 72 54" stroke-opacity="0.65"/><path d="M 28 62 Q 32 60 36 62 T 44 62 T 52 62 T 60 62" stroke-opacity="0.65"/><line x1="20" y1="26" x2="20" y2="22" stroke-width="2"/><line x1="20" y1="74" x2="20" y2="78" stroke-width="2"/><line x1="80" y1="26" x2="80" y2="22" stroke-width="2"/><line x1="80" y1="74" x2="80" y2="78" stroke-width="2"/>',
    'shield-round': '<circle cx="50" cy="50" r="34"/><circle cx="50" cy="50" r="28" stroke-opacity="0.6"/><circle cx="50" cy="50" r="6"/><circle cx="50" cy="50" r="2" fill="currentColor"/><line x1="50" y1="22" x2="50" y2="34" stroke-opacity="0.5"/><line x1="50" y1="66" x2="50" y2="78" stroke-opacity="0.5"/><line x1="22" y1="50" x2="34" y2="50" stroke-opacity="0.5"/><line x1="66" y1="50" x2="78" y2="50" stroke-opacity="0.5"/><line x1="30" y1="30" x2="38" y2="38" stroke-opacity="0.4"/><line x1="62" y1="62" x2="70" y2="70" stroke-opacity="0.4"/><line x1="70" y1="30" x2="62" y2="38" stroke-opacity="0.4"/><line x1="30" y1="70" x2="38" y2="62" stroke-opacity="0.4"/>',
    sword: '<path d="M 50 8 L 46 60 L 50 66 L 54 60 Z"/><line x1="50" y1="8" x2="50" y2="60" stroke-opacity="0.4"/><rect x="36" y="60" width="28" height="4"/><rect x="46" y="64" width="8" height="18" stroke-opacity="0.85"/><circle cx="50" cy="86" r="4"/><line x1="46" y1="68" x2="54" y2="68" stroke-opacity="0.55"/><line x1="46" y1="74" x2="54" y2="74" stroke-opacity="0.55"/><path d="M 38 60 L 32 56 M 62 60 L 68 56" stroke-opacity="0.55"/>',
    tablet: '<rect x="14" y="18" width="72" height="64" rx="3"/><rect x="20" y="24" width="60" height="52" rx="1" stroke-opacity="0.55"/><line x1="50" y1="18" x2="50" y2="82" stroke-opacity="0.45"/><path d="M 26 34 L 44 34" stroke-opacity="0.55"/><path d="M 26 40 L 44 40" stroke-opacity="0.55"/><path d="M 26 46 L 40 46" stroke-opacity="0.55"/><path d="M 26 54 L 44 54" stroke-opacity="0.55"/><path d="M 26 60 L 42 60" stroke-opacity="0.55"/><path d="M 56 34 L 74 34" stroke-opacity="0.55"/><path d="M 56 40 L 74 40" stroke-opacity="0.55"/><path d="M 56 46 L 70 46" stroke-opacity="0.55"/><path d="M 56 56 L 76 64 L 70 70" stroke-opacity="0.8"/><circle cx="76" cy="64" r="1.5" fill="currentColor" stroke="none"/><line x1="14" y1="50" x2="11" y2="50"/><line x1="86" y1="50" x2="89" y2="50"/>',
    timeline: '<line x1="10" y1="50" x2="90" y2="50"/><path d="M 90 50 L 84 46 M 90 50 L 84 54"/><circle cx="22" cy="50" r="4" fill="currentColor" stroke="none"/><circle cx="40" cy="50" r="3.5"/><circle cx="58" cy="50" r="3.5"/><circle cx="76" cy="50" r="3.5"/><line x1="22" y1="46" x2="22" y2="32"/><line x1="40" y1="54" x2="40" y2="68"/><line x1="58" y1="46" x2="58" y2="32"/><line x1="76" y1="54" x2="76" y2="68"/><rect x="14" y="22" width="16" height="10"/><rect x="32" y="68" width="16" height="10"/><rect x="50" y="22" width="16" height="10"/><rect x="68" y="68" width="16" height="10"/>',
    trident: '<line x1="50" y1="20" x2="50" y2="86"/><path d="M 30 26 L 30 14"/><path d="M 70 26 L 70 14"/><path d="M 50 14 L 50 6"/><path d="M 26 28 Q 30 22 34 28"/><path d="M 66 28 Q 70 22 74 28"/><path d="M 46 8 Q 50 2 54 8"/><path d="M 30 26 Q 40 26 50 32 Q 60 26 70 26"/><line x1="44" y1="40" x2="56" y2="40" stroke-opacity="0.5"/><path d="M 44 86 L 56 86 L 54 92 L 46 92 Z"/><line x1="42" y1="92" x2="58" y2="92" stroke-width="1.8"/>',
    trophy: '<path d="M 32 18 L 68 18 L 66 44 Q 66 56 50 56 Q 34 56 34 44 Z"/><path d="M 32 24 Q 18 24 18 34 Q 18 44 34 42" stroke-opacity="0.7"/><path d="M 68 24 Q 82 24 82 34 Q 82 44 66 42" stroke-opacity="0.7"/><line x1="50" y1="56" x2="50" y2="68"/><path d="M 38 68 L 62 68 L 64 80 L 36 80 Z"/><line x1="32" y1="86" x2="68" y2="86" stroke-width="1.8"/><line x1="28" y1="90" x2="72" y2="90" stroke-opacity="0.5"/><path d="M 44 30 L 47 37 L 54 37 L 48 42 L 50 49 L 44 45" stroke-opacity="0.45"/>',
    wreath: '<path d="M 50 84 Q 18 70 18 38 Q 28 24 50 18" stroke-opacity="0.6"/><path d="M 50 84 Q 82 70 82 38 Q 72 24 50 18" stroke-opacity="0.6"/><path d="M 46 82 L 54 82 L 52 90 L 48 90 Z"/><g transform="translate(19.93 39.06) rotate(-120)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(24.11 31.19) rotate(-104)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(30.30 24.78) rotate(-88)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(38.01 20.33) rotate(-72)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(46.66 18.18) rotate(-56)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(55.56 18.49) rotate(-40)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(64.03 21.24) rotate(-24)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(71.41 26.22) rotate(-8)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(77.14 33.04) rotate(8)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(80.07 39.06) rotate(120)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(81.30 56.65) rotate(152)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(73.02 72.23) rotate(184)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(57.74 81.05) rotate(216)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g><g transform="translate(40.11 80.43) rotate(248)"><path d="M 0 0 Q 3 -5 0 -10 Q -3 -5 0 0 Z"/></g>',
  };
  function glyph(name) {
    const inner = G[name] || G.wreath;
    return `<span class="t-glyph"><svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:100%;height:100%;display:block">${inner}</svg></span>`;
  }

  // ── small helpers ────────────────────────────────────────────
  const fmtK = n => Number(n || 0).toLocaleString('en-US');
  const ROMAN = ['', 'Ⅰ', 'Ⅱ', 'Ⅲ', 'Ⅳ', 'Ⅴ', 'Ⅵ', 'Ⅶ', 'Ⅷ', 'Ⅸ', 'Ⅹ'];
  const romanize = n => ROMAN[n] || n;
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  const tr = (gr, en) => (typeof t === 'function') ? t(gr, en) : ((typeof siteLang !== 'undefined' && siteLang === 'en') ? en : gr);
  const isLogged = () => !!(typeof currentUser !== 'undefined' && currentUser);
  const _iconForSlot = slot => ({ palette: 'column', backdrop: 'acropolis', particle: 'lightning', sigil: 'wreath' })[slot] || 'wreath';

  // ── per-user state (real progression, or an ephemeral browse state) ──
  let _ephemeral = null;
  function _tp() {
    const p = (typeof getProgression === 'function') ? getProgression() : null;
    if (p) return p;
    if (!_ephemeral) {
      const base = (typeof _templeStateDefaults === 'function') ? _templeStateDefaults()
        : { owned: [], equipped: {}, loadout: [], consumables: {}, quests: {}, claimed: [],
            activeQuests: { daily: [], weekly: [] }, saga: { chapter: 0, progress: 0 }, stats: {} };
      _ephemeral = Object.assign({ drachmas: 0 }, base);
    }
    return _ephemeral;
  }
  function persist(patch) {
    if (isLogged() && typeof _progRef === 'function') {
      _progRef(currentUser.uid).update(patch).catch(e => console.warn('[temple] persist failed', e));
    }
  }
  function _needAuth() {
    if (isLogged()) return false;
    if (typeof openAuthModal === 'function') openAuthModal('login');
    return true;
  }
  function _toastPoor() {
    if (typeof showToast === 'function') showToast('Δεν έχεις αρκετές Δραχμές.', 'Not enough Drachmas.');
  }

  // ── selectors ────────────────────────────────────────────────
  function ownsCosmetic(p, id) { const it = realmItem(id); return p.owned.includes(id) || (it && it.price === 0); }
  function isEquipped(p, item) { return p.equipped[item.slot] === item.id; }
  function cosmeticLocked(p, item) { if (item.sagaGate == null) return false; return p.saga.chapter < item.sagaGate; }

  // ══════════════════ ORNAMENTS ══════════════════
  function ritualCircle(intensity, still) {
    let ticks = '';
    for (let i = 0; i < 48; i++) {
      const a = (i / 48) * Math.PI * 2, r1 = i % 4 === 0 ? 116 : 122, r2 = 130;
      ticks += `<line x1="${(150 + Math.cos(a) * r1).toFixed(2)}" y1="${(150 + Math.sin(a) * r1).toFixed(2)}" x2="${(150 + Math.cos(a) * r2).toFixed(2)}" y2="${(150 + Math.sin(a) * r2).toFixed(2)}" stroke="currentColor" stroke-width="${i % 4 === 0 ? 1.4 : 0.7}" stroke-opacity="${i % 4 === 0 ? 0.5 : 0.28}"/>`;
    }
    let glyphs = '';
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      glyphs += `<circle cx="${(150 + Math.cos(a) * 92).toFixed(2)}" cy="${(150 + Math.sin(a) * 92).toFixed(2)}" r="${i % 3 === 0 ? 2.6 : 1.5}" fill="currentColor" fill-opacity="${i % 3 === 0 ? 0.55 : 0.3}"/>`;
    }
    let star = '';
    for (let i = 0; i < 4; i++) {
      const a = (i / 4) * Math.PI;
      star += `<line x1="${(150 - Math.cos(a) * 54).toFixed(2)}" y1="${(150 - Math.sin(a) * 54).toFixed(2)}" x2="${(150 + Math.cos(a) * 54).toFixed(2)}" y2="${(150 + Math.sin(a) * 54).toFixed(2)}"/>`;
    }
    const dur = (still ? 0 : 1) * Math.max(40, 120 / Math.max(0.15, intensity));
    const spin = still ? 'none' : `t-spin ${dur}s linear infinite`;
    const spinRev = still ? 'none' : `t-spin-rev ${(dur * 1.6).toFixed(1)}s linear infinite`;
    return `<svg class="t-ritual" viewBox="0 0 300 300" aria-hidden="true" style="opacity:${(0.5 + 0.18 * intensity).toFixed(2)}">
      <g style="transform-origin:150px 150px;animation:${spin}">${ticks}<circle cx="150" cy="150" r="130" fill="none" stroke="currentColor" stroke-width="0.8" stroke-opacity="0.32"/><circle cx="150" cy="150" r="108" fill="none" stroke="currentColor" stroke-width="0.6" stroke-opacity="0.2"/></g>
      <g style="transform-origin:150px 150px;animation:${spinRev}"><circle cx="150" cy="150" r="92" fill="none" stroke="currentColor" stroke-width="0.7" stroke-opacity="0.22"/>${glyphs}<circle cx="150" cy="150" r="72" fill="none" stroke="currentColor" stroke-width="0.5" stroke-opacity="0.18" stroke-dasharray="2 6"/></g>
      <g stroke="currentColor" stroke-width="0.9" stroke-opacity="0.3" fill="none">${star}<circle cx="150" cy="150" r="30" stroke-opacity="0.22"/></g>
    </svg>`;
  }
  function emberField(intensity, still, count, tint) {
    const n = Math.round(count * Math.max(0.2, intensity));
    let out = '';
    for (let i = 0; i < n; i++) {
      const seed = (i * 2654435761) % 1000 / 1000, seed2 = (i * 40503) % 1000 / 1000;
      const left = (seed * 100).toFixed(1), size = (1.4 + seed2 * 2.6).toFixed(1), dur = (6 + seed * 7).toFixed(1),
        delay = (-seed2 * 12).toFixed(1), drift = ((seed - 0.5) * 40).toFixed(1), op = (0.25 + seed2 * 0.5).toFixed(2);
      const anim = still ? 'none' : `t-rise ${dur}s linear ${delay}s infinite`;
      const bottom = still ? `bottom:${10 + (i * 7) % 70}%;` : '';
      out += `<span style="left:${left}%;width:${size}px;height:${size}px;opacity:${still ? (op * 0.5).toFixed(2) : op};--drift:${drift}px;animation:${anim};${bottom}"></span>`;
    }
    return `<div class="t-embers" aria-hidden="true" style="color:${tint}">${out}</div>`;
  }
  function templeCrest(size) {
    const h = (size * 80 / 120).toFixed(1);
    let cols = '';
    [18, 36, 54, 72, 90, 102].forEach((x, i) => { cols += `<line x1="${x}" y1="46" x2="${x}" y2="72" stroke-opacity="${i === 0 || i === 5 ? 0.85 : 0.55}"/>`; });
    return `<svg class="crest" viewBox="0 0 120 80" width="${size}" height="${h}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 34 L60 8 L110 34 Z" stroke-opacity="0.85"/><line x1="6" y1="38" x2="114" y2="38"/><line x1="9" y1="44" x2="111" y2="44" stroke-opacity="0.6"/>${cols}<line x1="6" y1="74" x2="114" y2="74"/><line x1="2" y1="78" x2="118" y2="78" stroke-opacity="0.5"/><circle cx="60" cy="26" r="3.4" fill="currentColor" stroke="none" fill-opacity="0.7"/></svg>`;
  }
  function ambientLayer(intensity, still, pos, emberCount) {
    const p = _tp();
    const backdrop = realmItem(p.equipped.backdrop) || {};
    const particle = realmItem(p.equipped.particle) || {};
    const kind = backdrop.kind || 'circle';
    const tintMap = { gold: 'var(--sym-gold)', goldLt: 'var(--sym-gold-lt)', terra: 'var(--sym-terra)' };
    const emberTint = tintMap[particle.tint] || 'var(--tint)';
    const circlePos = pos === 'right' ? 'right:-22%;top:50%;transform:translateY(-50%);'
      : pos === 'top' ? 'left:50%;top:-6%;transform:translateX(-50%);'
      : 'left:50%;top:44%;transform:translate(-50%,-50%);';
    const showCircle = kind === 'circle' || kind === 'aether';
    const showEmbers = kind === 'embers' || kind === 'aether';
    let html = '<div class="t-amb">';
    if (kind === 'frieze') html += '<div class="amb-frieze"></div>';
    if (kind === 'aether') html += '<div class="amb-aether"></div>';
    if (showCircle || kind === 'frieze') {
      const w = pos === 'center' ? '128%' : '108%';
      html += `<div style="position:absolute;${circlePos}width:${w};aspect-ratio:1;opacity:${kind === 'frieze' ? 0.4 : 1}">${ritualCircle(intensity, still)}</div>`;
    }
    if (showEmbers) html += emberField(intensity, still, emberCount, emberTint);
    else if (intensity > 0.4) html += emberField(intensity * 0.5, still, Math.round(emberCount * 0.4), emberTint);
    // Equipped Acroteria — faint corner watermarks (left + right), so equipping
    // one gives instant feedback right here on the Temple surface.
    if (window.cornerSVG) {
      const cL = realmItem(p.equipped.corner), cR = realmItem(p.equipped.cornerRight);
      if (cL && cL.scene) html += `<div class="amb-corner amb-corner-left">${window.cornerSVG(cL.scene)}</div>`;
      if (cR && cR.scene) html += `<div class="amb-corner amb-corner-right">${window.cornerSVG(cR.scene)}</div>`;
    }
    html += '</div>';
    return html;
  }

  // ══════════════════ CARD VOCABULARY ══════════════════
  function kleosChip(size) {
    const p = _tp(); const sig = realmItem(p.equipped.sigil); const icon = (sig && sig.icon) || 'wreath';
    return `<div class="hud${size === 'lg' ? ' lg' : ''}"><span class="sig">${glyph(icon)}</span><span class="amt"><b>${fmtK(p.drachmas)}</b><span>Κλέος · Glory</span></span></div>`;
  }
  function progressBar(value, goal) {
    const pct = Math.min(100, Math.round((value / goal) * 100));
    return `<div class="pbar${pct >= 100 ? ' full' : ''}"><i style="width:${pct}%"></i></div>`;
  }
  function loadoutMeter() {
    const p = _tp(); const max = getRealm().LOADOUT_MAX || 3; let cells = '';
    for (let i = 0; i < max; i++) cells += `<i class="${i < p.loadout.length ? 'fill' : ''}"></i>`;
    return `<div class="loadout-meter"><span>Loadout</span><div class="loadout-slots">${cells}</div><span>${p.loadout.length}/${max}</span></div>`;
  }
  function secHead(icon, el, en, count) {
    return `<div class="sec-head">${icon ? `<span class="si">${glyph(icon)}</span>` : ''}<h3 class="gk">${esc(el)}</h3><span class="en">${esc(en)}</span>${count != null ? `<span class="cnt">${esc(count)}</span>` : ''}</div>`;
  }
  function cosmeticPreview(item) {
    if (item.slot === 'palette') {
      const s = item.swatch || ['#000', '#888', '#444'];
      return `<div class="cos-swatch" style="background:linear-gradient(135deg, ${s[0]} 0 38%, ${s[2]} 39% 64%, ${s[1]} 65%)"></div>`;
    }
    if (item.slot === 'backdrop') {
      const bg = item.kind === 'embers' ? 'radial-gradient(circle at 30% 90%, color-mix(in srgb,var(--tint) 30%,transparent), transparent 55%), var(--sym-bg)'
        : item.kind === 'frieze' ? 'repeating-linear-gradient(90deg, var(--sym-bg) 0 10px, color-mix(in srgb,var(--tint) 12%,transparent) 10px 11px)'
        : item.kind === 'aether' ? 'radial-gradient(circle at 35% 30%, color-mix(in srgb,var(--sym-accent2) 40%,transparent), transparent 50%), radial-gradient(circle at 75% 75%, color-mix(in srgb,var(--tint) 30%,transparent), transparent 55%), var(--sym-bg)'
        : 'radial-gradient(circle, transparent 38%, color-mix(in srgb,var(--tint) 18%,transparent) 39% 41%, transparent 42%), var(--sym-bg)';
      return `<div class="cos-swatch" style="background:${bg}"></div><span class="pv-glyph">${glyph(item.kind === 'frieze' ? 'tablet' : 'acropolis')}</span>`;
    }
    if (item.slot === 'sigil') {
      return `<div class="cos-swatch" style="background:radial-gradient(circle at 50% 45%, color-mix(in srgb,var(--tint) 16%,transparent), transparent 65%)"></div><span class="pv-glyph" style="color:var(--tint)">${glyph(item.icon)}</span>`;
    }
    if (item.slot === 'corner') {
      const svg = (window.cornerSVG ? window.cornerSVG(item.scene) : '');
      return `<div class="cos-swatch" style="background:radial-gradient(ellipse 80% 70% at 70% 80%, color-mix(in srgb,var(--tint) 10%,transparent), transparent 70%), var(--sym-bg)"></div><span class="cos-corner" style="color:var(--tint)">${svg}</span>`;
    }
    let dots = '';
    for (let i = 0; i < 5; i++) {
      const sz = 4 + i % 3;
      dots += `<span style="position:absolute;width:${sz}px;height:${sz}px;border-radius:50%;left:${12 + i * 19}%;top:${28 + (i * 37) % 50}%;background:var(--tint);box-shadow:0 0 6px 1px color-mix(in srgb,var(--tint) 60%,transparent);opacity:${(0.5 + (i % 3) * 0.2).toFixed(2)}"></span>`;
    }
    return `<div class="cos-swatch" style="background:var(--sym-bg)"></div>${dots}`;
  }
  function cosmeticCard(item) {
    const p = _tp(); const owned = ownsCosmetic(p, item.id); const equipped = isEquipped(p, item);
    const locked = cosmeticLocked(p, item); const slot = getRealm().COSMETIC_SLOTS.find(s => s.id === item.slot) || { en: '' };
    const afford = p.drachmas >= item.price;
    // Acroteria can sit on a LEFT and a RIGHT corner simultaneously.
    const isCorner = item.slot === 'corner';
    const eqL = isCorner && p.equipped.corner === item.id;
    const eqR = isCorner && p.equipped.cornerRight === item.id;
    let foot;
    if (locked) foot = `<div class="pill locked">${tr('Σφραγισμένο', 'Sealed')} · Saga ${romanize(item.sagaGate)}</div>`;
    else if (isCorner && owned) foot = `<div class="corner-eq"><button class="cnr-btn${eqL ? ' on' : ''}" onclick="Temple.equipCorner('${item.id}','left')">◧ ${tr('Αριστ.', 'Left')}</button><button class="cnr-btn${eqR ? ' on' : ''}" onclick="Temple.equipCorner('${item.id}','right')">${tr('Δεξιά', 'Right')} ◨</button></div>`;
    else if (equipped) foot = `<div class="pill equipped">${tr('Εξοπλισμένο', 'Equipped')}</div>`;
    else if (owned) foot = `<button class="btn" onclick="Temple.equipCosmetic('${item.id}')">${tr('Εξόπλισε', 'Equip')}</button>`;
    else if (item.price === 0) foot = `<button class="btn ghost" disabled>${tr('Δωρεάν', 'Bestowed')}</button>`;
    else foot = `<button class="btn solid"${afford ? '' : ' disabled'} onclick="Temple.buyCosmetic('${item.id}')"><span class="kx">${glyph('wreath')}</span>${fmtK(item.price)}</button>`;
    return `<div class="cos${equipped ? ' eq' : ''}"><div class="cos-preview">${cosmeticPreview(item)}<span class="slot-tag">${esc(slot.en)}</span></div><div class="cos-body"><h4 class="gk">${esc(item.el)}</h4><div class="en">${esc(item.en)}</div><p class="lore">${esc(item.lore || '')}</p></div><div class="cos-foot">${foot}</div></div>`;
  }
  function offeringCard(item, pillar) {
    const p = _tp(); const owned = p.owned.includes(item.id); const equipped = p.equipped[pillar.id] === item.id;
    const locked = cosmeticLocked(p, item); const canEquip = pillar.equipModel === 'single'; const afford = p.drachmas >= (item.price || 0);
    let foot;
    if (locked) foot = `<div class="pill locked">${tr('Σφραγισμένο', 'Sealed')} · Saga ${romanize(item.sagaGate)}</div>`;
    else if (equipped) foot = `<div class="pill equipped">${canEquip ? tr('Εξοπλισμένο', 'Equipped') : tr('Κτήμα', 'Owned')}</div>`;
    else if (owned) foot = canEquip ? `<button class="btn" onclick="Temple.equipOffering('${item.id}','${pillar.id}')">${tr('Εξόπλισε', 'Equip')}</button>` : `<div class="pill equipped">${tr('Κτήμα', 'Owned')}</div>`;
    else if (item.price) foot = `<button class="btn solid"${afford ? '' : ' disabled'} onclick="Temple.buyOffering('${item.id}','${pillar.id}')"><span class="kx">${glyph('wreath')}</span>${fmtK(item.price)}</button>`;
    else foot = `<button class="btn ghost" onclick="Temple.buyOffering('${item.id}','${pillar.id}')">${tr('Δωρεάν', 'Bestowed')}</button>`;
    return `<div class="cos${equipped ? ' eq' : ''}"><div class="cos-preview"><div class="cos-swatch" style="background:radial-gradient(circle at 50% 42%, color-mix(in srgb,var(--tint) 18%,transparent), transparent 66%)"></div><span class="pv-glyph" style="color:var(--tint)">${glyph(item.icon || pillar.icon)}</span><span class="slot-tag">${esc(pillar.en)}</span></div><div class="cos-body"><h4 class="gk">${esc(item.el)}</h4><div class="en">${esc(item.en)}</div>${item.lore ? `<p class="lore">${esc(item.lore)}</p>` : ''}</div><div class="cos-foot">${foot}</div></div>`;
  }
  function boonCard(item) {
    const p = _tp(); const owned = p.owned.includes(item.id); const slotted = p.loadout.includes(item.id);
    const full = p.loadout.length >= (getRealm().LOADOUT_MAX || 3); const afford = p.drachmas >= item.price;
    let foot;
    if (!owned) foot = `<button class="btn solid"${afford ? '' : ' disabled'} onclick="Temple.buyBoon('${item.id}')"><span class="kx">${glyph('wreath')}</span>${fmtK(item.price)}</button>`;
    else if (slotted) foot = `<button class="btn" onclick="Temple.toggleLoadout('${item.id}')">${tr('Αφαίρεσε', 'Unequip')}</button>`;
    else foot = `<button class="btn ghost"${full ? ' disabled' : ''} onclick="Temple.toggleLoadout('${item.id}')">${full ? tr('Γεμάτο', 'Loadout full') : tr('Εξόπλισε', 'Equip')}</button>`;
    return `<div class="boon${slotted ? ' slotted' : ''}"><div class="boon-top"><span class="boon-ic">${glyph(item.icon)}</span><div style="flex:1;min-width:0"><h4 class="gk">${esc(item.el)}</h4><div class="en">${esc(item.en)}</div></div></div><p class="eff">${esc(item.effect)}</p><div class="boon-foot">${foot}</div></div>`;
  }
  function consumableRow(item) {
    const p = _tp(); const have = p.consumables[item.id] || 0; const afford = p.drachmas >= item.price;
    return `<div class="charge"><span class="boon-ic">${glyph(item.icon)}</span><div class="charge-main"><h4 class="gk">${esc(item.el)} <span style="font-family:var(--t-serif);font-style:italic;font-size:12px;font-weight:400;color:color-mix(in srgb,var(--tint) 66%,var(--sym-fg) 34%)">· ${esc(item.en)}</span></h4><div class="eff">${esc(item.effect)}</div></div><div class="charge-have"><b>${have}</b></div><div class="charge-buy"><button class="mini-btn"${afford ? '' : ' disabled'} onclick="Temple.buyConsumable('${item.id}')">+${item.bundle} · ${fmtK(item.price)}</button><button class="mini-btn use"${have <= 0 ? ' disabled' : ''} onclick="Temple.useConsumable('${item.id}')">${tr('Χρήση', 'Use')}</button></div></div>`;
  }
  function questCard(quest) {
    const p = _tp(); const prog = p.quests[quest.id] || 0; const done = prog >= quest.goal; const claimed = p.claimed.includes(quest.id);
    return `<div class="quest${done ? ' done' : ''}${claimed ? ' claimed' : ''}"><span class="q-ic">${glyph(quest.icon)}</span><div class="q-main"><div class="q-top"><h4 class="gk">${esc(quest.el)}</h4><span class="q-rew"><span class="kx">${glyph('wreath')}</span><b>${quest.reward}</b></span></div><div class="en" style="font-family:var(--t-serif);font-style:italic;font-size:12px;margin-top:4px;line-height:1.3;color:color-mix(in srgb,var(--sym-fg) 58%,transparent)">${esc(quest.en)}</div>${progressBar(prog, quest.goal)}<div class="q-count"><b>${Math.min(prog, quest.goal)}</b> / ${quest.goal}</div></div><div class="q-claim">${claimed ? `<div class="pill equipped" style="width:auto;padding:8px 12px">${tr('Παρελήφθη', 'Claimed')}</div>` : `<button class="btn solid"${done ? '' : ' disabled'} style="width:auto;padding:10px 14px" onclick="Temple.claimQuest('${quest.id}')">${tr('Παραλαβή', 'Claim')}</button>`}</div></div>`;
  }
  function sagaTrack() {
    const p = _tp(); const saga = getRealm().SAGA; const cur = p.saga.chapter;
    const steps = saga.chapters.map((ch, i) => {
      const st = i < cur ? 'done' : i === cur ? 'cur' : 'locked';
      const unlockItem = ch.unlock ? realmItem(ch.unlock) : null;
      const meta = st === 'done' ? tr('Σφραγισμένο', 'Sealed') : st === 'cur' ? `${p.saga.progress} / ${ch.goal} ${tr('τελετές', 'rites')}` : `${ch.goal} ${tr('τελετές', 'rites')}`;
      return `<div class="saga-step ${st}"><div class="saga-node"><span class="saga-dot"></span>${i < saga.chapters.length - 1 ? '<span class="saga-line"></span>' : ''}</div><div class="saga-info"><h4 class="gk">${romanize(i + 1)} · ${esc(ch.el)}</h4><div class="en">${esc(ch.en)}</div><div class="meta"><span>${meta}</span><span class="q-rew" style="margin-left:0"><span class="kx">${glyph('wreath')}</span><b>${ch.reward}</b></span>${unlockItem ? `<span class="unl">unlocks · ${esc(unlockItem.en)}</span>` : ''}</div>${st === 'cur' ? `<div class="saga-cur-bar">${progressBar(p.saga.progress, ch.goal)}</div>` : ''}</div></div>`;
    }).join('');
    return `<div class="saga"><div class="saga-head"><span class="ti">${glyph('timeline')}</span><div><h3 class="gk">${esc(saga.el)}</h3><div class="en">${esc(saga.en)} · ${tr('ταξίδι πολλών συνεδριών', 'a journey across many sessions')}</div></div></div><div class="saga-track">${steps}</div><div class="saga-advance"><button class="btn" onclick="Temple.advanceSaga()">${tr('Τέλεσε μια τελετή', 'Perform a rite')} →</button></div></div>`;
  }
  function medal(ach) {
    const p = _tp(); const val = ach.stat === 'owned' ? p.owned.length : (p.stats[ach.stat] || 0);
    const pct = Math.min(100, (val / ach.goal) * 100); const earned = val >= ach.goal; const R = 21, C = 2 * Math.PI * R;
    return `<div class="medal${earned ? ' earned' : ''}"><div class="ring"><svg viewBox="0 0 50 50"><circle cx="25" cy="25" r="${R}" fill="none" stroke="color-mix(in srgb,var(--sym-fg) 10%,transparent)" stroke-width="3"/><circle cx="25" cy="25" r="${R}" fill="none" stroke="var(--tint)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${C.toFixed(2)}" stroke-dashoffset="${(C * (1 - pct / 100)).toFixed(2)}" style="transition:stroke-dashoffset .6s cubic-bezier(.16,1,.3,1);${earned ? 'filter:drop-shadow(0 0 3px var(--tint))' : ''}"/></svg><span class="rg-glyph">${glyph(ach.icon)}</span></div><div class="medal-main"><h4 class="gk">${esc(ach.el)}</h4><div class="en">${esc(ach.en)}</div><div class="note">${esc(ach.note)}</div><div class="medal-prog"><b>${fmtK(Math.min(val, ach.goal))}</b> / ${fmtK(ach.goal)}${earned ? ' · ' + tr('κερδήθηκε', 'won') : ''}</div></div></div>`;
  }
  function statDashboard() {
    const p = _tp();
    return `<div class="stats">${getRealm().STAT_CARDS.map(s => {
      const raw = p.stats[s.key] || 0; const v = s.fmt === 'kleos' ? fmtK(raw) : fmtK(raw) + (s.suffix || '');
      return `<div class="stat${s.fmt === 'kleos' ? ' gold' : ''}"><div class="v">${v}</div><div class="gk">${esc(s.el)}</div><div class="l">${esc(s.en)}</div></div>`;
    }).join('')}</div>`;
  }

  // ══════════════════ PANELS ══════════════════
  function cosmeticsPanel(cols) {
    const p = _tp(); const slots = getRealm().COSMETIC_SLOTS; const cos = getRealm().COSMETICS;
    return '<div class="panel">' + slots.map((slot, i) => {
      const items = cos.filter(c => c.slot === slot.id);
      const ownedN = items.filter(c => ownsCosmetic(p, c.id)).length;
      return `<div style="margin-top:${i ? 22 : 0}px">${secHead(slot.icon, slot.el, slot.en, ownedN + '/' + items.length)}<div class="grid c${cols}">${items.map(it => cosmeticCard(it)).join('')}</div></div>`;
    }).join('') + '</div>';
  }
  function boonsPanel(cols) {
    const realm = getRealm();
    return `<div class="panel"><div class="sec-head"><span class="si">${glyph('lightning')}</span><h3 class="gk">Εὐλογίες</h3><span class="en">Perks</span><span style="flex:none;margin-left:auto">${loadoutMeter()}</span></div><div style="margin-top:-6px;margin-bottom:12px"><p class="t-lore" style="margin:0">${tr('Εξόπλισε έως τρεις εύνοιες των θεών. Σε ακολουθούν σε κάθε συνεδρία.', 'Equip up to three favors of the gods. They follow you into every session.')}</p></div><div class="grid c${cols}">${realm.BOONS.map(it => boonCard(it)).join('')}</div><div style="margin-top:24px">${secHead('shield-round', 'Σωτηρίαι', 'Lifelines')}<p class="t-lore" style="margin:0 0 12px">${tr('Αναλώσιμα φυλαχτά που μεταφέρονται. Ξόδεψέ τα όταν η δοκιμασία στραφεί εναντίον σου.', 'Consumable charges, carried across sessions. Spend them when the trial turns against you.')}</p><div style="display:flex;flex-direction:column;gap:calc(10px * var(--d))">${realm.CONSUMABLES.map(it => consumableRow(it)).join('')}</div></div></div>`;
  }
  function questsPanel() {
    const p = _tp(); const realm = getRealm();
    const sections = [{ cadence: 'daily', el: 'Ἆθλοι τῆς Ἡμέρας', en: 'Daily Labors' }, { cadence: 'weekly', el: 'Ἆθλοι τῆς Ἑβδομάδος', en: 'Weekly Trials' }];
    let html = '<div class="panel">';
    sections.forEach((sec, si) => {
      const ids = (p.activeQuests && p.activeQuests[sec.cadence]) || [];
      const quests = ids.map(id => realm.QUESTS.find(q => q.id === id)).filter(Boolean);
      const claimable = quests.filter(q => (p.quests[q.id] || 0) >= q.goal && !p.claimed.includes(q.id)).length;
      html += `<div style="margin-top:${si ? 24 : 0}px"><div class="sec-head"><span class="si">${glyph('scroll')}</span><h3 class="gk">${sec.el}</h3><span class="en">${sec.en}</span>${claimable > 0 ? `<span class="cnt" style="color:var(--tint)">${claimable} ${tr('για παραλαβή', 'to claim')}</span>` : ''}<button class="reroll-btn" onclick="Temple.reroll('${sec.cadence}')">${glyph('gear')} ${tr('Ανανέωση', 'Reroll')}</button></div><div style="display:flex;flex-direction:column;gap:calc(10px * var(--d))">${quests.length ? quests.map(q => questCard(q)).join('') : `<div class="t-empty">${tr('Καμία αποστολή σε εξέλιξη. Ανανέωσε για νέες.', 'No labors in rotation. Reroll to post new ones.')}</div>`}</div></div>`;
    });
    html += `<div style="margin-top:24px">${sagaTrack()}</div></div>`;
    return html;
  }
  function customPanel(pillar, cols) {
    const p = _tp(); const items = pillar.offerings || []; const ownedN = items.filter(o => p.owned.includes(o.id)).length;
    return `<div class="panel"><div class="sec-head"><span class="si">${glyph(pillar.icon)}</span><h3 class="gk">${esc(pillar.el)}</h3><span class="en">${esc(pillar.en)}</span><span class="cnt">${ownedN}/${items.length}</span></div>${pillar.blurb ? `<p class="t-lore" style="margin:0 0 12px">${esc(pillar.blurb)}.${pillar.equipModel === 'single' ? tr(' Ένα μπορεί να κρατηθεί.', ' One may be kept at hand.') : ''}</p>` : ''}${items.length ? `<div class="grid c${cols}">${items.map(o => offeringCard(o, pillar)).join('')}</div>` : `<div class="t-empty">${tr('Αναμένει την πρώτη προσφορά.', 'This panel awaits its first offering.')}</div>`}</div>`;
  }
  function achievementsPanel(cols) {
    const realm = getRealm(); const dims = realm.ACH_DIMENSIONS; const dim = _dim;
    const list = realm.ACHIEVEMENTS.filter(a => dim === 'all' || a.dim === dim);
    return `<div class="panel">${secHead('trophy', 'Βίος ἐν Ἀριθμοῖς', 'A Life in Numbers')}${statDashboard()}<div class="sec-head" style="margin-top:20px"><span class="si">${glyph('trophy')}</span><h3 class="gk">Τρόπαια</h3><span class="en">Medals</span></div><div class="dim-row"><button class="dim${dim === 'all' ? ' on' : ''}" onclick="Temple.setDim('all')">All</button>${dims.map(d => `<button class="dim${dim === d.id ? ' on' : ''}" onclick="Temple.setDim('${d.id}')"><span class="di">${glyph(d.icon)}</span>${esc(d.en)}</button>`).join('')}</div><div class="ach-grid"${cols === 1 ? ' style="grid-template-columns:1fr"' : ''}>${list.map(a => medal(a)).join('')}</div></div>`;
  }
  function pillarById(id) { const ps = getRealm().PILLARS; return ps.find(p => p.id === id) || ps[0]; }
  function pillarPanel(tab, pillar, cols) {
    if (tab === 'cosmetics') return cosmeticsPanel(cols);
    if (tab === 'boons') return boonsPanel(cols);
    if (tab === 'quests') return questsPanel();
    if (tab === 'achievements') return achievementsPanel(cols);
    if (pillar && pillar.custom) return customPanel(pillar, cols);
    return '';
  }

  // ══════════════════ RAIL LAYOUT ══════════════════
  let _tab = 'cosmetics';
  let _dim = 'all';
  let _toastTimer = null;
  let _overlayOpen = false;
  let _pageSurface = 'rail';

  function _motion() {
    const reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    return { intensity: reduced ? 0 : 0.7, still: reduced };
  }
  function railTab(pl) {
    return `<button class="rail-tab${_tab === pl.id ? ' on' : ''}" data-tab="${pl.id}" onclick="Temple.tab('${pl.id}')"><span class="ti">${glyph(pl.icon)}</span><span class="lbl"><b class="gk">${esc(pl.el)}</b><span>${esc(pl.en)}</span></span></button>`;
  }
  function railLayout() {
    const realm = getRealm(); const m = _motion(); const pillar = pillarById(_tab);
    return `<div class="t-frame lay-rail" id="temple-frame">${ambientLayer(m.intensity, m.still, 'right', 16)}<nav class="rail-nav"><div class="rail-brand"><span style="color:var(--tint)">${templeCrest(46)}</span><h1 class="gk">Ναὸς τῶν Μουσῶν</h1><div class="en">The Temple of the Muses</div></div><div class="rail-hud temple-hud-slot">${kleosChip('lg')}</div><div class="rail-tabs">${realm.PILLARS.map(railTab).join('')}</div><div class="rail-foot"><button class="btn ghost" onclick="Temple.exit()">← ${tr('Επιστροφή', 'Back to site')}</button></div></nav><div class="rail-body"><div class="rail-topbar">${railTopbar(pillar)}</div><div class="t-scroll"><div class="t-pad temple-panel" data-cols="3">${pillarPanel(_tab, pillar, 3)}</div></div></div><div class="toast-host temple-toast" style="right:22px;bottom:22px"></div></div>`;
  }
  function railTopbar(pillar) {
    return `<span class="si">${glyph(pillar.icon)}</span><div class="tt"><h2 class="gk">${esc(pillar.el)}</h2><div class="en">${esc(pillar.en)} · ${esc(pillar.blurb || '')}</div></div>`;
  }
  function templeLayout() {
    const realm = getRealm(); const m = _motion(); const pillar = pillarById(_tab);
    return `<div class="t-frame lay-temple">${ambientLayer(m.intensity, m.still, 'center', 18)}<div class="temple-veil"></div><div class="temple-back"><button class="btn ghost" style="width:auto;padding:9px 13px" onclick="Temple.closeOverlay()">← ${tr('Επιστροφή στο παιχνίδι', 'Return to play')}</button></div><div class="temple-hud temple-hud-slot">${kleosChip('lg')}</div><div class="temple-inner"><div class="temple-head"><span style="color:var(--tint)">${templeCrest(62)}</span><h1 class="gk">Ναὸς τῶν Μουσῶν</h1><div class="en">${tr('Κάθε συνεδρία αφήνει σημάδι', 'Every session leaves a mark')}</div></div><div class="temple-tabs">${realm.PILLARS.map(pl => `<button class="tab${_tab === pl.id ? ' on' : ''}" data-tab="${pl.id}" onclick="Temple.tab('${pl.id}')"><span class="ti">${glyph(pl.icon)}</span><span class="tlabel gk">${esc(pl.el)}</span></button>`).join('')}</div><div class="temple-scroll"><div class="temple-panel" data-cols="2">${pillarPanel(_tab, pillar, 2)}</div></div></div><div class="toast-host temple-toast" style="left:50%;bottom:22px;transform:translateX(-50%)"></div></div>`;
  }
  function mobileLayout() {
    const realm = getRealm(); const m = _motion(); const pillar = pillarById(_tab);
    return `<div class="t-frame lay-mobile">${ambientLayer(m.intensity, m.still, 'top', 9)}<div class="mob-head"><span style="color:var(--tint)">${templeCrest(34)}</span><div class="tt"><h1 class="gk">Ναὸς τῶν Μουσῶν</h1><div class="en">Temple of the Muses</div></div></div><div class="mob-hud-bar temple-hud-slot">${kleosChip('')}</div><div class="t-scroll"><div style="padding:4px 16px 30px"><div class="mob-section-title gk">${esc(pillar.el)}</div><div class="mob-section-en">${esc(pillar.en)} · ${esc(pillar.blurb || '')}</div><div class="temple-panel" data-cols="1">${pillarPanel(_tab, pillar, 1)}</div></div></div><div class="mob-tabbar">${realm.PILLARS.map(pl => `<button class="mob-tab${_tab === pl.id ? ' on' : ''}" data-tab="${pl.id}" onclick="Temple.tab('${pl.id}')"><span class="ti">${glyph(pl.icon)}</span><span>${esc(pl.en)}</span></button>`).join('')}</div><div class="toast-host temple-toast" style="left:12px;right:12px;top:42px;display:flex;justify-content:center"></div></div>`;
  }

  function _ensureRotation(p) {
    const realm = getRealm(); let changed = false;
    if ((!p.activeQuests.daily || !p.activeQuests.daily.length) && realm.questsByCadence('daily').length) { p.activeQuests.daily = rollCadence('daily'); changed = true; }
    if ((!p.activeQuests.weekly || !p.activeQuests.weekly.length) && realm.questsByCadence('weekly').length) { p.activeQuests.weekly = rollCadence('weekly'); changed = true; }
    if (changed) {
      [].concat(p.activeQuests.daily, p.activeQuests.weekly).forEach(id => { if (p.quests[id] == null) p.quests[id] = 0; });
      persist({ activeQuests: p.activeQuests, quests: p.quests });
    }
  }

  // apply the equipped palette / realm theme to a surface's .t-frame
  function _applyTheme(rootEl) {
    const frame = rootEl && rootEl.querySelector('.t-frame');
    if (frame && window.RT) {
      const pal = realmItem(_tp().equipped.palette);
      window.RT.apply(frame, (pal && pal.theme) || getRealm().realmTheme || 'obsidian');
    }
  }
  // the surface the player is currently looking at (overlay wins if open)
  function activeRoot() {
    if (_overlayOpen) return document.getElementById('temple-overlay');
    const host = document.getElementById('temple-content'); return host ? host.querySelector('.t-root') : null;
  }

  function renderTemplePage() {
    const host = document.getElementById('temple-content');
    if (!host) return;
    _ensureRotation(_tp());
    _pageSurface = (window.innerWidth <= 560) ? 'mobile' : 'rail';
    host.innerHTML = '<div class="t-root">' + (_pageSurface === 'mobile' ? mobileLayout() : railLayout()) + '</div>';
    _applyTheme(host.querySelector('.t-root'));
    _updateNavChip();
  }

  // in-game ceremonial overlay (opened from a game; "← Return to play")
  function _buildOverlayBody() {
    const el = document.getElementById('temple-overlay'); if (!el) return;
    el.innerHTML = '<div class="t-root">' + templeLayout() + '</div>';
    _applyTheme(el.querySelector('.t-root'));
  }

  // re-paint the active surface's tabs + panel(s) + section labels in place
  function _paintActive() {
    const root = activeRoot(); if (!root) return;
    const pillar = pillarById(_tab);
    root.querySelectorAll('[data-tab]').forEach(b => b.classList.toggle('on', b.dataset.tab === _tab));
    root.querySelectorAll('.temple-panel').forEach(p => { p.innerHTML = pillarPanel(_tab, pillar, Number(p.dataset.cols) || 2); });
    const tb = root.querySelector('.rail-topbar'); if (tb) tb.innerHTML = railTopbar(pillar);
    const mt = root.querySelector('.mob-section-title'); if (mt) mt.textContent = pillar.el;
    const me = root.querySelector('.mob-section-en'); if (me) me.textContent = pillar.en + (pillar.blurb ? ' · ' + pillar.blurb : '');
  }
  function _syncKleos() {
    const root = activeRoot();
    if (root) root.querySelectorAll('.temple-hud-slot').forEach(h => { h.innerHTML = kleosChip((h.classList.contains('rail-hud') || h.classList.contains('temple-hud')) ? 'lg' : ''); });
    _updateNavChip();
  }
  // re-render just the active panel + Kleos chip (after an action)
  function _refresh() { _paintActive(); _syncKleos(); }
  // full re-render of the active surface (ambient / equipped palette changed)
  function _hardRepaint() { if (_overlayOpen) _buildOverlayBody(); else renderTemplePage(); }

  // ══════════════════ CELEBRATION TOAST ══════════════════
  function celebrate(evt) {
    const root = activeRoot();
    const host = root ? root.querySelector('.temple-toast') : null;
    if (!host) return;
    const eyebrowMap = { buy: 'Dedicated', equip: 'Equipped', claim: 'Labor sealed', charge: 'Charges gained', saga: 'Chapter sealed', session: 'Glory earned', reroll: 'New labors' };
    const eyebrow = eyebrowMap[evt.kind] || 'The Temple stirs';
    const gain = evt.gain ? '+' + fmtK(evt.gain) : evt.amount ? '+' + evt.amount : (evt.cost ? '−' + fmtK(evt.cost) : '');
    const showWreath = evt.kind !== 'charge';
    host.innerHTML = `<div class="toast style-medallion"><span class="toast-medal">${glyph(evt.icon || 'wreath')}</span><div class="toast-body"><div class="k">${esc(eyebrow)}</div><h5 class="gk">${esc(evt.el || '')}</h5><div class="en">${esc(evt.title || '')}${evt.unlock ? ' · unlocked ' + esc(evt.unlock.en) : ''}</div></div>${gain ? `<div class="toast-gain">${showWreath ? '<span class="kx">' + glyph('wreath') + '</span>' : ''}${gain}</div>` : ''}</div>`;
    clearTimeout(_toastTimer);
    _toastTimer = setTimeout(() => { if (host) host.innerHTML = ''; }, 3200);
  }

  // ══════════════════ ACTIONS ══════════════════
  function _commit(patch, evt) { persist(patch); if (evt) celebrate(evt); _refresh(); }

  const Temple = {
    tab(id) { _tab = id; _paintActive(); },
    setDim(id) { _dim = id; _paintActive(); },
    exit() { if (_overlayOpen) return this.closeOverlay(); if (typeof goTo === 'function') goTo('home'); },
    // in-game ceremonial overlay — open from a game, close with "Return to play"
    openOverlay() {
      let el = document.getElementById('temple-overlay');
      if (!el) { el = document.createElement('div'); el.id = 'temple-overlay'; document.body.appendChild(el); }
      _overlayOpen = true;
      if (isLogged() && typeof getProgression === 'function' && !getProgression() && typeof initProgression === 'function') {
        initProgression(currentUser.uid).then(() => _buildOverlayBody());
      } else { _buildOverlayBody(); }
      document.body.style.overflow = 'hidden';
    },
    closeOverlay() {
      _overlayOpen = false;
      const el = document.getElementById('temple-overlay'); if (el) el.remove();
      document.body.style.overflow = '';
    },

    buyCosmetic(id) {
      if (_needAuth()) return; const p = _tp(); const it = realmItem(id);
      if (!it || p.owned.includes(id) || it.price === 0) return;
      if (p.drachmas < it.price) return _toastPoor();
      p.drachmas -= it.price; p.owned.push(id);
      _commit({ drachmas: p.drachmas, owned: p.owned }, { kind: 'buy', el: it.el, title: it.en, icon: it.icon || _iconForSlot(it.slot), cost: it.price });
    },
    equipCosmetic(id) {
      if (_needAuth()) return; const p = _tp(); const it = realmItem(id);
      if (!it || !ownsCosmetic(p, id)) return;
      p.equipped = Object.assign({}, p.equipped, { [it.slot]: id });
      persist({ equipped: p.equipped });
      celebrate({ kind: 'equip', el: it.el, title: it.en, icon: it.icon || _iconForSlot(it.slot) });
      _hardRepaint(); // re-tint + refresh ambient/previews on the active surface
    },
    // Acroteria: equip a corner scene to the LEFT (equipped.corner) or RIGHT
    // (equipped.cornerRight) slot. Click the same side again to remove it.
    // Repaints the home-screen watermark + the Temple surface live.
    equipCorner(id, side) {
      if (_needAuth()) return; const p = _tp(); const it = realmItem(id);
      if (!it || !ownsCosmetic(p, id)) return;
      const slot = side === 'right' ? 'cornerRight' : 'corner';
      const next = (p.equipped[slot] === id) ? null : id; // toggle off if re-clicked
      p.equipped = Object.assign({}, p.equipped, { [slot]: next });
      persist({ equipped: p.equipped });
      celebrate({ kind: 'equip', el: it.el, title: it.en, icon: it.icon || _iconForSlot('corner') });
      if (window.renderAcroteria) window.renderAcroteria();
      _hardRepaint();
    },
    buyOffering(id, pid) {
      if (_needAuth()) return; const p = _tp(); const it = realmItem(id);
      if (!it || p.owned.includes(id)) return;
      const price = it.price || 0;
      if (price) { if (p.drachmas < price) return _toastPoor(); p.drachmas -= price; }
      p.owned.push(id);
      _commit({ drachmas: p.drachmas, owned: p.owned }, { kind: 'buy', el: it.el, title: it.en, icon: it.icon || 'wreath', cost: price || undefined });
    },
    equipOffering(id, pid) {
      if (_needAuth()) return; const p = _tp(); const it = realmItem(id);
      if (!it || !p.owned.includes(id)) return;
      p.equipped = Object.assign({}, p.equipped, { [pid]: id });
      persist({ equipped: p.equipped });
      celebrate({ kind: 'equip', el: it.el, title: it.en, icon: it.icon || 'wreath' });
      _refresh();
    },
    buyBoon(id) {
      if (_needAuth()) return; const p = _tp(); const it = realmItem(id);
      if (!it || p.owned.includes(id)) return;
      if (p.drachmas < it.price) return _toastPoor();
      p.drachmas -= it.price; p.owned.push(id);
      _commit({ drachmas: p.drachmas, owned: p.owned }, { kind: 'buy', el: it.el, title: it.en, icon: it.icon, cost: it.price });
    },
    toggleLoadout(id) {
      if (_needAuth()) return; const p = _tp(); if (!p.owned.includes(id)) return;
      const max = getRealm().LOADOUT_MAX || 3;
      if (p.loadout.includes(id)) p.loadout = p.loadout.filter(x => x !== id);
      else { if (p.loadout.length >= max) return; p.loadout = p.loadout.concat(id); }
      _commit({ loadout: p.loadout });
    },
    buyConsumable(id) {
      if (_needAuth()) return; const p = _tp(); const it = realmItem(id); if (!it) return;
      if (p.drachmas < it.price) return _toastPoor();
      p.drachmas -= it.price; p.consumables = Object.assign({}, p.consumables, { [id]: (p.consumables[id] || 0) + it.bundle });
      _commit({ drachmas: p.drachmas, consumables: p.consumables }, { kind: 'charge', el: it.el, title: it.en, icon: it.icon, amount: it.bundle });
    },
    useConsumable(id) {
      if (_needAuth()) return; const p = _tp();
      if ((p.consumables[id] || 0) <= 0) return;
      p.consumables = Object.assign({}, p.consumables, { [id]: p.consumables[id] - 1 });
      _commit({ consumables: p.consumables });
    },
    claimQuest(id) {
      if (_needAuth()) return; const p = _tp(); const q = getRealm().QUESTS.find(x => x.id === id); if (!q) return;
      if (p.claimed.includes(id) || (p.quests[id] || 0) < q.goal) return;
      p.drachmas += q.reward; p.claimed = p.claimed.concat(id);
      _commit({ drachmas: p.drachmas, claimed: p.claimed }, { kind: 'claim', el: q.el, title: q.en, icon: q.icon, gain: q.reward });
    },
    advanceSaga() {
      if (_needAuth()) return; const p = _tp(); const chs = getRealm().SAGA.chapters; const ch = chs[p.saga.chapter]; if (!ch) return;
      const next = p.saga.progress + 1;
      if (next < ch.goal) { p.saga = Object.assign({}, p.saga, { progress: next }); _commit({ saga: p.saga }); return; }
      const unlocked = ch.unlock && !p.owned.includes(ch.unlock) ? [ch.unlock] : [];
      const done = p.saga.chapter >= chs.length - 1;
      const nextCh = Math.min(p.saga.chapter + 1, chs.length - 1);
      p.drachmas += ch.reward;
      if (unlocked.length) p.owned = p.owned.concat(unlocked);
      p.saga = { chapter: done ? p.saga.chapter : nextCh, progress: done ? ch.goal : 0 };
      _commit({ drachmas: p.drachmas, owned: p.owned, saga: p.saga }, { kind: 'saga', el: ch.el, title: ch.en, icon: 'scroll', gain: ch.reward, unlock: ch.unlock ? realmItem(ch.unlock) : null });
    },
    reroll(cadence) {
      if (_needAuth()) return; const p = _tp(); const roll = rollQuests(); const QUESTS = getRealm().QUESTS;
      (cadence ? [cadence] : ['daily', 'weekly']).forEach(c => {
        p.activeQuests[c] = roll[c];
        roll[c].forEach(id => { if (p.quests[id] == null) p.quests[id] = 0; });
      });
      p.claimed = p.claimed.filter(id => { const q = QUESTS.find(x => x.id === id); return q && q.cadence !== (cadence || q.cadence); });
      _commit({ activeQuests: p.activeQuests, quests: p.quests, claimed: p.claimed }, { kind: 'reroll', el: 'Νέοι Ἆθλοι', title: 'New labors posted', icon: 'scroll' });
    },

    // shared glyph renderer (used by the Curator's Console pickers)
    glyph: function (name) { return glyph(name); },

    // render the rail layout (read-only-ish) into an arbitrary container —
    // the Curator's Console live preview. Scoped theme application via the
    // container's own .t-frame, so it reflects realm edits instantly.
    renderInto: function (containerId, themeId) {
      const host = document.getElementById(containerId);
      if (!host) return;
      _ensureRotation(_tp());
      host.innerHTML = '<div class="t-root">' + railLayout() + '</div>';
      const frame = host.querySelector('.t-frame');
      if (frame && window.RT) {
        const pal = realmItem(_tp().equipped.palette);
        window.RT.apply(frame, themeId || (pal && pal.theme) || getRealm().realmTheme || 'obsidian');
      }
    },
  };

  // ══════════════════ NAV / ROUTE ══════════════════
  function _updateNavChip() {
    const el = document.getElementById('nav-temple-kleos');
    if (el) el.textContent = fmtK(_tp().drachmas);
  }
  function navToTemple() {
    if (typeof goTo === 'function') goTo('temple');
    if (typeof _navPush === 'function') { try { _navPush({ page: 'temple' }); } catch (e) {} }
    if (isLogged() && typeof getProgression === 'function' && !getProgression() && typeof initProgression === 'function') {
      initProgression(currentUser.uid).then(() => renderTemplePage());
    } else {
      renderTemplePage();
    }
  }

  // re-render live when the admin publishes a new realm (Step 5/7)
  if (typeof onRealm === 'function') {
    onRealm(() => {
      if (_overlayOpen) _buildOverlayBody();
      const page = document.getElementById('page-temple');
      if (page && page.classList.contains('active')) renderTemplePage();
      _updateNavChip();
    });
  }

  // ── exports ──
  window.Temple = Temple;
  window.navToTemple = navToTemple;
  window.renderTemplePage = renderTemplePage;
  window._templeUpdateNavChip = _updateNavChip;
})();
