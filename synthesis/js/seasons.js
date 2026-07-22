/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · FX (seasons + cosmetics + click-throw)
   GSAP-driven ambient effects over the stage + an interactive
   click-to-throw burst (pumpkin / snowflake / egg / ember…).
     SymSeasons.seasonOf(date) → season id | null
     SymSeasons.apply(season)         → mount/replace/remove season field
     SymSeasons.applyCosmetic(partId) → mount/replace equipped-particle field
     SymSeasons.clickThrow(x, y)      → user-initiated burst at a point
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const CFG = {
    halloween: { n: 14, glyphs: ['🎃','🦇','🎃','🕸'], spin: 60, sway: 60 },
    christmas: { n: 24, glyphs: ['❄','❅','❆','✦'],     spin: 140, sway: 44 },
    easter:    { n: 14, glyphs: ['🥚','🌸','🐰','🌷'], spin: 40, sway: 70 },
    carnival:  { n: 18, glyphs: ['🎭','◆','★','▲'],     spin: 130, sway: 50 },
    spring:    { n: 14, glyphs: ['🌷','🌸','❀','✿'],     spin: 40, sway: 70 },
    summer:    { n: 16, glyphs: ['☀','✦','★','▲'],      spin: 90, sway: 40 },
    autumn:    { n: 16, glyphs: ['🍂','🍁','✦','•'],     spin: 80, sway: 60 },
    newyear:   { n: 22, glyphs: ['✦','✧','★','❉'],      spin: 120, sway: 44 },
    epiphany:  { n: 18, glyphs: ['❉','✦','◇','❅'],      spin: 60, sway: 40 },
    assumption:{ n: 16, glyphs: ['✦','✧','★','▲'],      spin: 80, sway: 36 },
    lent:      { n: 12, glyphs: ['◇','✦','·'],          spin: 30, sway: 30 },
  };
  // equipped Temple "particle" cosmetics → an ambient drift on the main page
  const COSMETIC = {
    'pt-hearth':   { n: 12, glyphs: ['•','●','✦'], color: 'var(--gold)',    rise: true, spin: 30, sway: 30 },
    'pt-golddust': { n: 16, glyphs: ['✦','✧','·'], color: 'var(--gold-lt, #F2CD78)', spin: 30, sway: 36 },
    'pt-petals':   { n: 11, glyphs: ['❀','✿','❁'], color: 'var(--terra)', spin: 40, sway: 60 },
  };
  let curSeason = null, curCosmetic = null;
  const tweens = [];

  function seasonOf(d) {
    d = d || new Date();
    const m = d.getMonth(), day = d.getDate();
    if (m === 9 || (m === 10 && day <= 2)) return 'halloween';
    if (m === 11) return 'christmas';
    if (m === 1 || (m === 2 && day <= 5)) return 'carnival';
    if (m === 3) return 'easter';
    return null;
  }

  function stage() { return document.querySelector('.stage'); }
  function reduceMotion() { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }

  function buildField(id, cls, cfg, color) {
    const st = stage(); if (!st) return;
    const old = document.getElementById(id);
    if (old) {
      // Kill the old field's tweens BEFORE detaching it. Each particle's fall
      // tween re-spawns itself in onComplete, so without this the chain keeps
      // firing on detached nodes forever — every theme/season switch leaked a
      // perpetual set of tweens (CPU climbs, never reaches idle, screenshots
      // time out). killTweensOf stops them without firing onComplete → no respawn.
      if (window.gsap) { try { gsap.killTweensOf(old.querySelectorAll('.season-p')); } catch (_) {} }
      old.remove();
    }
    if (!cfg) return;
    const layer = document.createElement('div');
    layer.id = id; layer.className = 'season-fx ' + cls; layer.setAttribute('aria-hidden', 'true');
    if (color) layer.style.color = color;
    st.appendChild(layer);
    if (reduceMotion() || !window.gsap) return;
    const W = () => st.clientWidth || window.innerWidth;
    const H = () => st.clientHeight || window.innerHeight;
    for (let i = 0; i < cfg.n; i++) {
      const p = document.createElement('span'); p.className = 'season-p';
      p.textContent = cfg.glyphs[i % cfg.glyphs.length];
      const scale = 0.55 + Math.random() * 0.7;
      p.style.fontSize = (12 * scale) + 'px';
      p.style.opacity = (0.18 + Math.random() * 0.28).toFixed(2);
      layer.appendChild(p);
      spawn(p, cfg, true);
    }
    function spawn(p, cfg, first) {
      const startX = Math.random() * W();
      const dur = 11 + Math.random() * 10;
      const drift = (Math.random() * 2 - 1) * (cfg.sway || 50);
      const up = cfg.rise;
      const startY = up ? (H() + 30) : (first ? -Math.random() * H() : -40);
      const endY = up ? -40 : (H() + 50);
      gsap.set(p, { x: startX, y: startY, rotation: Math.random() * 360 });
      const swayT = gsap.to(p, { x: '+=' + drift, duration: dur / 2, ease: 'sine.inOut', yoyo: true, repeat: 1 });
      const fall = gsap.to(p, { y: endY, rotation: '+=' + (Math.random() * 2 - 1) * (cfg.spin || 120), duration: dur, ease: 'none', delay: first ? 0 : Math.random() * 2, onComplete: () => { swayT.kill(); spawn(p, cfg, false); } });
      tweens.push(fall, swayT);
    }
  }

  function applySeason(season) {
    curSeason = season && CFG[season] ? season : null;
    buildField('season-fx', 'season-fx--' + (season || 'none'), curSeason ? CFG[season] : null);
    if (window.SymCursor) SymCursor.setSeason(curSeason);
  }
  function applyCosmetic(partId) {
    if (partId === curCosmetic) return;
    curCosmetic = (partId && COSMETIC[partId]) ? partId : null;
    const c = curCosmetic ? COSMETIC[partId] : null;
    buildField('cosmetic-fx', 'cosmetic-fx', c, c ? c.color : null);
  }

  // user-initiated burst — throws the active glyph set at a point
  function clickThrow(x, y) {
    const st = stage(); if (!st || !window.gsap) return;
    const r = st.getBoundingClientRect();
    const px = x - r.left, py = y - r.top;
    const set = curSeason ? CFG[curSeason].glyphs
      : curCosmetic ? COSMETIC[curCosmetic].glyphs
      : ['✦','★','✧']; // default: gold sparkle
    let layer = document.getElementById('throw-fx');
    if (!layer) { layer = document.createElement('div'); layer.id = 'throw-fx'; layer.className = 'season-fx'; st.appendChild(layer); }
    const count = 5 + Math.floor(Math.random() * 3);
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span'); p.className = 'season-p throw-p';
      p.textContent = set[i % set.length];
      p.style.fontSize = (i === 0 ? 30 : 14 + Math.random() * 12) + 'px';
      if (!curSeason && !curCosmetic) p.style.color = 'var(--gold, #D2A24A)';
      layer.appendChild(p);
      const ang = (-Math.PI / 2) + (Math.random() * 2 - 1) * 1.1;
      const power = 120 + Math.random() * 180;
      gsap.set(p, { x: px, y: py, opacity: 1, rotation: Math.random() * 90 });
      const tl = gsap.timeline({ onComplete: () => p.remove() });
      tl.to(p, { x: px + Math.cos(ang) * power, y: py + Math.sin(ang) * power, rotation: '+=' + (Math.random() * 2 - 1) * 360, duration: 0.5 + Math.random() * 0.2, ease: 'power2.out' })
        .to(p, { y: (st.clientHeight) + 60, rotation: '+=' + (Math.random() * 2 - 1) * 360, duration: 0.7 + Math.random() * 0.4, ease: 'power1.in' }, '>-0.05')
        .to(p, { opacity: 0, duration: 0.3 }, '>-0.3');
    }
  }

  window.SymSeasons = { seasonOf, apply: applySeason, applyCosmetic, clickThrow,
    get current() { return curSeason; }, get cosmetic() { return curCosmetic; }, CFG };
})();
