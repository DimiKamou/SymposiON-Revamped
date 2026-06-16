/* ════════════════════════════════════════════════════════════════════
   SymposiON — Mouse FX  ·  cursor trail effects
   Spawns decaying particles that follow the pointer over the design
   stage. Selectable from the Agora → Adornments → "Mouse FX" slot and
   persisted in SymStore('mousefx'). 'none' disables it entirely.
   GSAP-driven when available; CSS-keyframe fallback otherwise.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const KINDS = {
    none:   null,
    snow:   { glyph: ['❄','❅','❆'], colors:['#dcecff','#bcd8ff','#ffffff'], size:[9,17],  life:[1.3,2.4], spin:true,  gravity:34,  sway:26, rate:38, blur:.3 },
    sparks: { dot:true,              colors:['#FFD86B','#FFB23E','#FF8A3C'], size:[3,6],   life:[.5,.95], burst:true, gravity:-10, sway:14, rate:26, glow:true },
    embers: { dot:true,              colors:['#FF7A3C','#E0531F','#FFAE5B'], size:[3,7],   life:[.8,1.5], burst:false,gravity:-46, sway:18, rate:30, glow:true },
    petals: { glyph: ['❀','✿','❁'],  colors:['#F6B8C6','#EFA9BE','#F8D2DC'], size:[10,18], life:[1.6,2.8],spin:true,  gravity:24,  sway:40, rate:30, blur:.2 },
    stars:  { glyph: ['✦','✧','⋆'],  colors:['#FFE9A8','#FFD86B','#FFF4D6'], size:[9,16],  life:[.7,1.3], pop:true,   gravity:4,   sway:10, rate:30, glow:true },
    bubbles:{ ring:true,             colors:['#9FE7D8','#6FC9B0','#CFF3EA'], size:[8,20],  life:[1.1,2.0],spin:false, gravity:-30, sway:22, rate:26 },
    laurel: { glyph: ['❧','☘','✣'],  colors:['#C7D8A8','#9FBF7A','#E3ECCF'], size:[11,18], life:[1.4,2.4],spin:true,  gravity:22,  sway:34, rate:28, blur:.2 },
    comet:  { dot:true, trail:true,  colors:['#BFA9F0','#8E7FD6','#E7DEFF'], size:[4,8],   life:[.6,1.1], gravity:0,  sway:6,  rate:40, glow:true },
    runes:  { glyph: ['Α','Ω','Σ','Δ','Φ','Ψ'], colors:['#E0C26B','#CBA85A','#F2E0A8'], size:[11,17], life:[1.0,1.8], gravity:18, sway:30, rate:24, glow:true },
    confetti:{ glyph: ['▰','◆','▪','✦'], colors:['#E0617E','#4DA3C7','#E0A52E','#6FA85A','#8E7FD6'], size:[8,14], life:[1.0,1.8], pop:true, gravity:34, sway:34, rate:32 },
    /* seasonal pointer trails */
    eggs:    { glyph: ['🥚','🌸','🐣'], colors:['#F6D7E0'], size:[14,21], life:[1.6,2.8], spin:true, gravity:22, sway:36, rate:26 },
    pumpkins:{ glyph: ['🎃','🦇'],       colors:['#E0712E'], size:[14,21], life:[1.4,2.4], spin:true, gravity:26, sway:30, rate:24 },
    masks:   { glyph: ['🎭','◆','✦'],    colors:['#D4499A','#5E73D6','#E0B24C'], size:[13,20], life:[1.2,2.0], pop:true, gravity:30, sway:34, rate:28 },
    leaves:  { glyph: ['🍂','🍁'],        colors:['#C8641E'], size:[13,20], life:[1.6,2.8], spin:true, gravity:24, sway:44, rate:24 },
    fireflies:{ dot:true, colors:['#FFE9A8','#D8F0A0','#FFF4D6'], size:[3,6], life:[1.4,2.6], gravity:-6, sway:46, rate:20, glow:true },
    ink:    { dot:true, colors:['#2A1C10','#4A3320','#1C120A'], size:[3,7], life:[.8,1.6], gravity:40, sway:8, rate:30 },
    gold:   { dot:true, colors:['#F2CD78','#E0B24C','#FFF0C0'], size:[2,5], life:[1.0,1.9], gravity:-28, sway:16, rate:32, glow:true },
    ripple: { ring:true, colors:['#9FD8E7','#6FB0C9','#CFEAF3'], size:[10,22], life:[1.0,1.8], pop:true, gravity:0, sway:4, rate:22 },
  };

  let layer = null, kind = 'none', last = 0, rafOk = false;

  function ensureLayer() {
    const stage = document.querySelector('.stage');
    if (!stage) return null;
    if (layer && stage.contains(layer)) return layer;
    layer = document.createElement('div');
    layer.id = 'sym-mousefx';
    layer.setAttribute('aria-hidden', 'true');
    stage.appendChild(layer);
    return layer;
  }

  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(arr) { return arr[(Math.random() * arr.length) | 0]; }

  function spawn(x, y) {
    const k = KINDS[kind]; if (!k) return;
    const L = ensureLayer(); if (!L) return;
    const n = k.burst ? 3 : 1;
    for (let i = 0; i < n; i++) {
      const p = document.createElement('span');
      p.className = 'mfx';
      const sz = rnd(k.size[0], k.size[1]);
      const col = pick(k.colors);
      const life = rnd(k.life[0], k.life[1]);
      const jx = rnd(-8, 8), jy = rnd(-8, 8);
      p.style.left = (x + jx) + 'px';
      p.style.top  = (y + jy) + 'px';
      if (k.ring) {
        p.style.width = sz + 'px'; p.style.height = sz + 'px';
        p.style.border = '1.5px solid ' + col; p.style.borderRadius = '50%';
      } else if (k.dot) {
        p.style.width = sz + 'px'; p.style.height = sz + 'px';
        p.style.background = col; p.style.borderRadius = '50%';
        if (k.glow) p.style.boxShadow = '0 0 ' + (sz * 1.6) + 'px ' + col;
      } else {
        p.textContent = pick(k.glyph);
        p.style.fontSize = sz + 'px'; p.style.color = col; p.style.lineHeight = '1';
        if (k.glow) p.style.textShadow = '0 0 ' + (sz * .7) + 'px ' + col;
        if (k.blur) p.style.filter = 'drop-shadow(0 1px 1px rgba(0,0,0,.25))';
      }
      L.appendChild(p);

      const dx = jx + rnd(-k.sway, k.sway);
      const dy = jy + k.gravity + rnd(-10, 10);
      const rot = k.spin ? rnd(-200, 200) : 0;
      if (window.gsap) {
        const tl = gsap.timeline({ onComplete: () => p.remove() });
        if (k.pop) tl.fromTo(p, { scale: 0, autoAlpha: 1 }, { scale: 1, duration: .18, ease: 'back.out(2)' });
        else gsap.set(p, { autoAlpha: 1, scale: k.burst ? rnd(.7, 1.1) : 1 });
        tl.to(p, { x: dx, y: dy, rotation: rot, autoAlpha: 0, scale: k.pop ? 0 : '+=.1',
                   duration: life, ease: 'power1.out' }, k.pop ? '-=.02' : 0);
      } else {
        p.style.transition = 'transform ' + life + 's linear, opacity ' + life + 's ease-in';
        requestAnimationFrame(() => {
          p.style.transform = 'translate(' + dx + 'px,' + dy + 'px) rotate(' + rot + 'deg)';
          p.style.opacity = '0';
        });
        setTimeout(() => p.remove(), life * 1000 + 60);
      }
    }
  }

  function onMove(e) {
    if (kind === 'none') return;
    const t = e.target;
    const over = t && t.closest && t.closest('.stage')
      && !t.closest('.harness') && !t.closest('.tweaks')
      && !t.closest('.theme-menu') && !t.closest('.acro-ov') && !t.closest('.oly-switch');
    if (!over) return;
    const now = performance.now();
    const gap = KINDS[kind] ? (1000 / KINDS[kind].rate) : 40;
    if (now - last < gap) return;
    last = now;
    spawn(e.clientX, e.clientY);
  }

  function set(id) {
    kind = KINDS[id] ? id : 'none';
    if (kind === 'none' && layer) layer.innerHTML = '';
    if (window.SymStore) SymStore.set('mousefx', kind);
  }

  function init() {
    if (rafOk) return; rafOk = true;
    window.addEventListener('mousemove', onMove, { passive: true });
    const saved = (window.SymStore && SymStore.get('mousefx', 'none')) || 'none';
    set(saved);
  }

  window.SymMouseFX = {
    init, set,
    get: () => kind,
    kinds: () => Object.keys(KINDS),
  };
  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();
