/* ══════════════════════════════════════════════════════════════════════
   ΗΓΕΜΟΝΙΑ — FX hooks  (fx-hegemonia.js)
   Mounts SymFX with the war theme (rising embers) and maps hg:fx events to
   set-pieces: banner-plant burst + momentum trail at the tile, glory pops,
   raid shakes when a rival takes your land, winner-tinted conquest finale.
   (game.css lifts .fx-* plates above the overlay via body.hg-live.)
   ════════════════════════════════════════════════════════════════════════ */
window.HG_FX = (function () {
  const cx = () => window.innerWidth / 2;
  const rectOf = el => el && el.getBoundingClientRect();
  const tileEl = i => document.querySelector(`#hg-tiles .hg-tile[data-i="${i}"]`);
  let started = false;

  function start() {
    if (started || !window.SymFX) return;
    started = true;
    SymFX.mount({
      accent: '#D97B5C', accent2: '#9E3B2E',
      glow: 'rgba(217,123,92,0.5)',
      rain: false, particles: 'embers', fieldCount: 30,
      scanlines: true, sweep: false, grain: true, vignette: true,
      shakeSelector: '#hg-wrap',
    });
  }

  /* momentum trail: a glowing streak from the land you marched from to the
     freshly-planted banner (chains tile-to-tile on multi-flag turns);
     at full momentum (3 flags) the streak burns gold */
  function trail(fromEl, toEl, tint) {
    if (!fromEl || !toEl || !window.SymFX || SymFX.reduce) return;
    const a = fromEl.getBoundingClientRect(), b = toEl.getBoundingClientRect();
    const x1 = a.left + a.width / 2,  y1 = a.top + a.height / 2;
    const dx = (b.left + b.width / 2) - x1, dy = (b.top + b.height / 2) - y1;
    const len = Math.hypot(dx, dy);
    if (len < 6) return;
    const ang = Math.atan2(dy, dx);
    const el = document.createElement('div');
    el.className = 'hgx-trail';
    el.style.cssText = `left:${x1}px;top:${y1}px;width:${len}px;transform:rotate(${ang}rad) scaleX(0)` + (tint ? `;--tc:${tint}` : '');
    document.body.appendChild(el);
    el.animate([
      { transform: `rotate(${ang}rad) scaleX(0)`,  opacity: 0.95 },
      { transform: `rotate(${ang}rad) scaleX(1)`,  opacity: 0.9, offset: 0.5 },
      { transform: `rotate(${ang}rad) scaleX(1)`,  opacity: 0 },
    ], { duration: 460, easing: 'cubic-bezier(.25,.8,.3,1)', fill: 'forwards' });
    setTimeout(() => el.remove(), 500);
  }

  /* banner-plant shockwave: a ring of the faction colour kicked outward */
  function ring(x, y, size, col) {
    if (!window.SymFX || SymFX.reduce) return;
    const el = document.createElement('div');
    el.className = 'hgx-ring';
    el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;--rc:${col || '#E59A7E'}`;
    document.body.appendChild(el);
    el.animate([
      { transform: 'translate(-50%,-50%) scale(.22)', opacity: 0.95 },
      { transform: 'translate(-50%,-50%) scale(1)',   opacity: 0 },
    ], { duration: 560, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
    setTimeout(() => el.remove(), 610);
  }

  /* current combo momentum (1–3 flags this turn), read off the board attr */
  function momentum() {
    const te = document.getElementById('hg-tiles');
    return te ? Math.max(1, +(te.getAttribute('data-momentum') || 1) || 1) : 1;
  }

  window.addEventListener('hg:fx', (e) => {
    if (!window.SymFX) return;
    const d = e.detail || {};
    switch (d.type) {
      case 'correct': {
        const r = rectOf(d.el);
        if (r) SymFX.burst(r.right - 14, r.top + r.height / 2,
          { colors: ['#E3C766', '#D97B5C', '#fff'], count: 12, power: 6, life: 850 });
        SymFX.pop(d.el, 1.04);
        SymFX.flash('rgba(217,123,92,0.16)', 0.4, 0.4);
        const g = document.getElementById('hg-glory');
        if (g) SymFX.pop(g, 1.25);
        const sb = document.querySelector('#hg-screen-game .hg-score');
        const sr = rectOf(sb);
        if (sr && d.gain) SymFX.combo('+' + d.gain, sr.right + 44, sr.top + sr.height / 2, { size: 21, color: '#E3C766', rise: 44 });
        if (d.flags === 2)      SymFX.combo('×2 ΣΗΜΑΙΕΣ', cx(), window.innerHeight * 0.30, { size: 30, color: '#E59A7E' });
        else if (d.flags >= 3)  SymFX.combo('×3 ΣΗΜΑΙΕΣ', cx(), window.innerHeight * 0.28, { size: 40, color: '#E3C766' });
        break;
      }
      case 'wrong':
        SymFX.shake(12, 0.5);
        SymFX.flash('rgba(158,59,46,0.45)', 0.5, 0.45);
        break;
      case 'plant': {
        // banner-plant beat: shockwave ring + streak of momentum + ember burst
        const tile = tileEl(d.i);
        const mom = momentum();
        if (d.from != null && d.from !== d.i)
          trail(tileEl(d.from), tile, mom >= 3 ? '#FFD98A' : null);
        const r = rectOf(tile);
        if (r) {
          const cx2 = r.left + r.width / 2, cy2 = r.top + r.height / 2;
          ring(cx2, cy2, r.width * (d.conquest ? 2.3 : 1.9), mom >= 3 ? '#FFD98A' : '#E59A7E');
          SymFX.burst(cx2, cy2, { colors: ['#FFE2B8', '#E59A7E', '#D97B5C', '#fff'], count: (d.conquest ? 16 : 10) + (mom - 1) * 3, power: (d.conquest ? 7 : 5.5) + (mom - 1), up: 0.35, life: 800 });
          if (d.conquest) SymFX.burst(cx2, cy2, { emoji: ['⚑'], count: 3, power: 5, up: 0.5, size: 14, life: 900 });
        }
        if (d.conquest) { SymFX.shake(6, 0.3); SymFX.flash('rgba(217,123,92,0.14)', 0.3, 0.35); }
        else SymFX.flash('rgba(217,123,92,0.1)', 0.25, 0.3);
        break;
      }
      case 'march': {
        // rival empires advance: marching dust kicks up along their new front,
        // timed to the sweep wave; raids on OUR land make the ground tremble
        (d.tiles || []).slice(0, 6).forEach((ti, k) => {
          const r = rectOf(tileEl(ti));
          if (!r) return;
          setTimeout(() => {
            SymFX.burst(r.left + r.width / 2, r.top + r.height * 0.72,
              { colors: ['#8A6248', '#5E4632', '#C9A16B'], count: 4, power: 2.6, up: 0.2, life: 520 });
          }, 90 + k * 70);
        });
        if (d.raided) { SymFX.shake(7, 0.35); SymFX.flash('rgba(158,59,46,0.22)', 0.3, 0.4); }
        break;
      }
      case 'win': {
        const wc = d.color || '#E3C766';
        SymFX.flash('rgba(217,123,92,0.4)', 0.5, 0.7);
        SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['⚑', '👑', '✦', '🏛'], count: 30, power: 13, up: 0.5, life: 1700 });
        SymFX.burst(cx(), window.innerHeight * 0.45,
          { colors: [wc, '#E3C766', '#fff'], count: 22, power: 10, up: 0.4, life: 1400 });
        setTimeout(() => SymFX.burst(cx(), window.innerHeight * 0.5,
          { emoji: ['⚑', '✦'], count: 18, power: 10, up: 0.5, life: 1500 }), 400);
        break;
      }
      case 'lose':
        if (d.color) SymFX.flash('rgba(0,0,0,0.28)', 0.35, 0.6);
        break;
    }
  });

  if (document.readyState !== 'loading') start();
  else window.addEventListener('DOMContentLoaded', start);

  return { start };
})();
