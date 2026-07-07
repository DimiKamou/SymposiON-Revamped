/* ════════════════════════════════════════════════════════════════════
   SymposiON — Reimagined cursor system  ·  SHAPE + ICON
   Two independent selections compose the cursor:
     · shape — the lagging geometric frame (none / circle / diamond / …)
     · icon  — the tight mark inside it (none / star / trident / eye / …)
   Native cursor stays on the harness; custom cursor lives over the stage.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  // ICON marks loaded from the illustration library (line-art, currentColor)
  const ICON_FILE = {
    laurel:  { dir: 'bg-symbols',    name: 'laurel-arc' },
    stylus:  { dir: 'illustrations', name: 'quill' },
    owl:     { dir: 'illustrations', name: 'owl' },
    trident: { dir: 'illustrations', name: 'trident' },
    wreath:  { dir: 'illustrations', name: 'wreath' },
  };
  // ICON marks drawn inline
  const ICON_INLINE = {
    dot:    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="4"/></svg>',
    star:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z"/></svg>',
    eye:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="2.8" fill="currentColor" stroke="none"/></svg>',
    arrow:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 2l16 9-7 1.4L9.6 20z"/></svg>',
    meander:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter"><path d="M4 20V5h15v15h-9v-9h6"/></svg>',
    bolt:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>',
    monsterball: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M3 12h5.5M15.5 12H21"/><circle cx="12" cy="12" r="2.7"/><circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none"/></svg>',
    invader: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 3h2v2H8zM14 3h2v2h-2zM6 5h2v2H6zM16 5h2v2h-2zM4 7h16v2H4zM4 9h2v2H4zM8 9h2v2H8zM14 9h2v2h-2zM18 9h2v2h-2zM4 11h16v2H4zM6 13h2v2H6zM16 13h2v2h-2zM8 15h2v2H8zM14 15h2v2h-2z"/></svg>',
    ghost: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M5 12a7 7 0 0 1 14 0v8l-2.3-2-2.3 2-2.4-2-2.3 2-2.4-2L5 20z"/><circle cx="9.5" cy="11.5" r="1" fill="currentColor" stroke="none"/><circle cx="14.5" cy="11.5" r="1" fill="currentColor" stroke="none"/></svg>',
    mushroom: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M4 12a8 8 0 0 1 16 0z"/><path d="M9 12v6a3 3 0 0 0 6 0v-6"/><circle cx="9" cy="9" r="1.1" fill="currentColor" stroke="none"/><circle cx="15" cy="9" r="1.1" fill="currentColor" stroke="none"/></svg>',
    pixelheart: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 6h4v2h2v2h4V8h2V6h4v6h-2v2h-2v2h-2v2h-2v2h-2v-2H8v-2H6v-2H4z"/></svg>',
    joystick: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round"><circle cx="12" cy="6" r="3"/><path d="M12 9v6"/><path d="M5 21l3-6h8l3 6z"/></svg>',
    skull: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M5 11a7 7 0 0 1 14 0v3l-1.5 1.5V18h-3v-2h-3v2H8v-2.5L6.5 14H5z"/><circle cx="9" cy="11" r="1.4" fill="currentColor" stroke="none"/><circle cx="15" cy="11" r="1.4" fill="currentColor" stroke="none"/></svg>',
    katana: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20L16 8"/><path d="M16 8l4-4"/><path d="M13 7l4 4"/></svg>',
  };
  // SHAPE frames drawn inline (outline), shown in the lagging ring
  const RING_SHAPE = {
    circle:   '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="20" cy="20" r="18"/></svg>',
    diamond:  '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M20 2 L38 20 L20 38 L2 20 Z"/></svg>',
    square:   '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><rect x="3" y="3" width="34" height="34" rx="5"/></svg>',
    hexagon:  '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M20 2 L35.6 11 V29 L20 38 L4.4 29 V11 Z"/></svg>',
    triangle: '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M20 3 L37 35 H3 Z"/></svg>',
    reticle:  '<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="20" cy="20" r="15"/><path d="M20 1v6M20 33v6M1 20h6M33 20h6"/></svg>',
  };
  // seasonal touch — replaces the icon while a season is active
  const SEASON_GLYPH = {
    halloween: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c-1 2-3 3-5 3 0 4 2 7 5 9 3-2 5-5 5-9-2 0-4-1-5-3z"/></svg>',
    christmas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"/></svg>',
    easter:    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="3"/><circle cx="7" cy="13" r="3"/><circle cx="17" cy="13" r="3"/><circle cx="12" cy="16" r="3"/></svg>',
    carnival:  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l2 5 5 .5-4 3.5 1.5 5-4.5-3-4.5 3 1.5-5-4-3.5 5-.5z"/></svg>',
    spring:    '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="3"/><circle cx="12" cy="5" r="2.4"/><circle cx="12" cy="19" r="2.4"/><circle cx="5" cy="12" r="2.4"/><circle cx="19" cy="12" r="2.4"/></svg>',
    summer:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/></svg>',
    autumn:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3c3 3 4 6 4 9a4 4 0 0 1-8 0c0-3 1-6 4-9z"/></svg>',
    newyear:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2 6 6 .5-4.5 4 1.5 6L12 15l-5 3.5 1.5-6L4 8.5 10 8z"/></svg>',
  };
  // map the legacy single-id cursors (Agora slot, saved prefs) → shape+icon
  const LEGACY = {
    classic:{s:'none',i:'none'}, circle:{s:'circle',i:'none'}, reticle:{s:'reticle',i:'none'},
    diamond:{s:'diamond',i:'none'}, square:{s:'square',i:'none'}, hexagon:{s:'hexagon',i:'none'}, triangle:{s:'triangle',i:'none'},
    dot:{s:'circle',i:'dot'}, crosshair:{s:'reticle',i:'none'}, orbit:{s:'circle',i:'dot'},
    star:{s:'none',i:'star'}, eye:{s:'none',i:'eye'}, arrow:{s:'none',i:'arrow'}, meander:{s:'none',i:'meander'},
    laurel:{s:'none',i:'laurel'}, stylus:{s:'none',i:'stylus'}, owl:{s:'none',i:'owl'}, wreath:{s:'none',i:'wreath'}, trident:{s:'none',i:'trident'},
  };

  const cache = new Map();
  // Default cursor is the CLASSIC system pointer (shape:'none' + icon:'none').
  // Users can still opt into the ring/glyph cursor from the theme·cursor panel.
  let ring, glyph, enabled = false, shape = 'none', icon = 'none', season = null;
  let qRx, qRy, qGx, qGy;

  function loadGlyph(g) {
    const key = g.dir + '/' + g.name;
    if (window.__SYM_SVG && window.__SYM_SVG[key] != null) return Promise.resolve(window.__SYM_SVG[key]);
    if (!cache.has(key)) cache.set(key, fetch('images/' + g.dir + '/' + g.name + '.svg')
      .then(r => r.ok ? r.text() : '').catch(() => ''));
    return cache.get(key);
  }

  function init() {
    const stage = document.querySelector('.stage');
    if (!stage || document.getElementById('symc-ring')) return;
    ring = document.createElement('div'); ring.id = 'symc-ring'; ring.innerHTML = '<i class="rc"></i>';
    glyph = document.createElement('div'); glyph.id = 'symc-glyph';
    stage.appendChild(ring); stage.appendChild(glyph);
    if (window.gsap) {
      gsap.set([ring, glyph], { xPercent: -50, yPercent: -50 });
      qRx = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3' });
      qRy = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3' });
      qGx = gsap.quickTo(glyph, 'x', { duration: 0.16, ease: 'power2' });
      qGy = gsap.quickTo(glyph, 'y', { duration: 0.16, ease: 'power2' });
    }
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', () => { if (enabled) pulse(); });
    document.addEventListener('mouseover', e => { if (enabled && hot(e.target)) ring.classList.add('hot'); }, true);
    document.addEventListener('mouseout',  e => { if (enabled && hot(e.target)) ring.classList.remove('hot'); }, true);
    initGameWatch();
  }

  // A launched Ver1 game owns the full viewport via a `.game-overlay`. While one
  // is visible we toggle `body.syn-game-open` so CSS hides the custom cursor /
  // mouse-FX and restores the native pointer. Robust to games that toggle their
  // own visibility (class `.active`, inline display, or attribute changes).
  let _gameOpen = false;
  function anyGameOpen() {
    var ovs = document.querySelectorAll('.game-overlay');
    for (var i = 0; i < ovs.length; i++) {
      var o = ovs[i];
      if (o.classList.contains('active')) return true;
      // NB: .game-overlay is position:fixed, so offsetParent is null even when
      // visible — never use it here. Check the computed box directly. Games may
      // reveal the overlay via .active OR by setting inline display:flex/block.
      var cs = getComputedStyle(o);
      if (cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0') return true;
    }
    return false;
  }
  function syncGameOpen() {
    var open = anyGameOpen();
    if (open === _gameOpen) return;
    _gameOpen = open;
    document.body.classList.toggle('syn-game-open', open);
    if (open) {
      document.body.classList.remove('symc-show');
      // Game overlays mount on <body>, outside the themed shell, so the site
      // theme tokens (--sym-*) don't reach them. Stamp the active theme class
      // on each open overlay so token-driven in-game UI (e.g. the alabaster
      // level-select skin) resolves + adapts to the selected theme. Harmless to
      // the legacy hardcoded-colour game screens (they don't read the tokens).
      if (window.symApplyThemeClass) {
        document.querySelectorAll('.game-overlay').forEach(function (o) { window.symApplyThemeClass(o); });
      }
    }
  }
  function initGameWatch() {
    if (window.__symGameWatch) return;
    window.__symGameWatch = true;
    var mo = new MutationObserver(function () {
      // coalesce bursts of mutations into one check
      if (mo._t) return;
      mo._t = requestAnimationFrame(function () { mo._t = 0; syncGameOpen(); });
    });
    mo.observe(document.body, { childList: true, subtree: true, attributes: true,
      attributeFilter: ['class', 'style'] });
    syncGameOpen();
  }

  function hot(t) {
    return t.closest && t.closest('a,button,input,[role=button],.interactive,.syn-tile,.syn-chip,.syn-eng,.syn-cta,.ag-chip,.st-toc,.ak-tab,.theme-opt');
  }

  function onMove(e) {
    if (!enabled || _gameOpen) return;
    const over = e.target.closest &&
      e.target.closest('.stage') &&
      !e.target.closest('.harness') && !e.target.closest('.tweaks') && !e.target.closest('.theme-menu');
    document.body.classList.toggle('symc-show', !!over);
    if (!over) return;
    const x = e.clientX, y = e.clientY;
    if (qRx) { qRx(x); qRy(y); qGx(x); qGy(y); }
    else { ring.style.left = glyph.style.left = x + 'px'; ring.style.top = glyph.style.top = y + 'px'; }
  }

  function pulse() {
    if (window.gsap && ring.querySelector('.rc')) gsap.fromTo(ring.querySelector('.rc'),
      { scale: 0.6 }, { scale: 1, duration: 0.5, ease: 'elastic.out(1,0.45)' });
  }

  async function paintShape() {
    if (!ring) return;
    const rc = ring.querySelector('.rc');
    const has = shape !== 'none' && RING_SHAPE[shape];
    document.body.classList.toggle('symc-noshape', !has);
    rc.innerHTML = has ? RING_SHAPE[shape] : '';
  }

  async function paintIcon() {
    if (!glyph) return;
    // season replaces the icon while active (and an icon is shown)
    if (season && SEASON_GLYPH[season] && icon !== 'none') {
      glyph.innerHTML = SEASON_GLYPH[season];
      document.body.classList.add('symc-season');
      const s = glyph.firstElementChild; if (s) { s.removeAttribute('width'); s.removeAttribute('height'); }
      return;
    }
    document.body.classList.remove('symc-season');
    document.body.classList.toggle('symc-noicon', icon === 'none');
    if (icon === 'none') { glyph.innerHTML = ''; return; }
    if (ICON_INLINE[icon]) { glyph.innerHTML = ICON_INLINE[icon]; }
    else { const svg = await loadGlyph(ICON_FILE[icon] || ICON_FILE.laurel); glyph.innerHTML = svg || ''; }
    const s = glyph.firstElementChild; if (s) { s.removeAttribute('width'); s.removeAttribute('height'); }
  }

  function refreshEnabled() {
    enabled = (shape !== 'none') || (icon !== 'none');
    document.body.classList.toggle('symc-on', enabled);
    if (!enabled) document.body.classList.remove('symc-show');
  }

  function setShape(s) { shape = (s === 'none' || RING_SHAPE[s]) ? s : 'circle'; refreshEnabled(); paintShape(); }
  function setIcon(i)  { icon  = (i === 'none' || ICON_INLINE[i] || ICON_FILE[i]) ? i : 'none'; refreshEnabled(); paintIcon(); }
  // back-compat: a single legacy id maps to a shape+icon pair
  function set(t) { const m = LEGACY[t] || { s: 'circle', i: 'laurel' }; shape = m.s; icon = m.i; refreshEnabled(); paintShape(); paintIcon(); }

  function setSeason(s) { season = s; if (enabled) paintIcon(); }

  window.SymCursor = {
    init, set, setShape, setIcon, setSeason,
    shapeSVG: (id) => RING_SHAPE[id] || '',
    iconSVG:  (id) => ICON_INLINE[id] || '',
    iconFile: (id) => ICON_FILE[id] || null,
    get shape() { return shape; }, get icon() { return icon; },
  };
})();
