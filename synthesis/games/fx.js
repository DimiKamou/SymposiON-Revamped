/* ══════════════════════════════════════════════════════════════════════
   SymposiON — shared cinematic FX engine  (games/fx.js)
   window.SymFX: ambient mounts (CSS-driven) + GSAP-driven set-pieces.
   Robust: GSAP optional; particles use the Web Animations API so they fire
   even where requestAnimationFrame is throttled. Reduced-motion aware.
   ════════════════════════════════════════════════════════════════════════ */
window.SymFX = (function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = () => !!window.gsap;
  const GREEK = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ';
  const CODE  = 'ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ0123456789/\\<>=+*';

  let cfg = {};
  let ambientEl = null, flashEl = null, shakeEl = null;

  function mount(opts = {}) {
    cfg = Object.assign({
      rain: true, rainChars: CODE, rainCount: 22, rainColor: null,
      particles: null, fieldCount: 30,
      scanlines: true, sweep: true, vignette: true, grain: true,
      shakeSelector: null,
    }, opts);

    const root = document.body;
    root.classList.add('fx-root');
    if (cfg.accent)   root.style.setProperty('--fx-accent', cfg.accent);
    if (cfg.accent2)  root.style.setProperty('--fx-accent-2', cfg.accent2);
    if (cfg.rainColor)root.style.setProperty('--fx-rain', cfg.rainColor);
    if (cfg.glow)     root.style.setProperty('--fx-glow', cfg.glow);

    // ambient container
    ambientEl = document.createElement('div');
    ambientEl.className = 'fx-ambient';
    const kind = cfg.particles || (cfg.rain ? 'rain' : null);
    if (kind === 'rain')         ambientEl.appendChild(buildRain());
    else if (kind === 'bubbles') ambientEl.appendChild(buildField('bubble'));
    else if (kind === 'embers')  ambientEl.appendChild(buildField('ember'));
    else if (kind === 'motes')   ambientEl.appendChild(buildField('mote'));
    if (cfg.sweep)     ambientEl.appendChild(div('fx-sweep'));
    if (cfg.scanlines) ambientEl.appendChild(div('fx-scanlines'));
    if (cfg.grain)     ambientEl.appendChild(div('fx-grain'));
    if (cfg.vignette)  ambientEl.appendChild(div('fx-vignette'));
    root.appendChild(ambientEl);

    // flash plate
    flashEl = div('fx-flash');
    root.appendChild(flashEl);

    if (cfg.shakeSelector) shakeEl = document.querySelector(cfg.shakeSelector);
    return SymFX;
  }

  function div(cls){ const d=document.createElement('div'); d.className=cls; return d; }

  function buildRain() {
    const wrap = div('fx-rain');
    if (reduce) { return wrap; }
    const n = cfg.rainCount;
    for (let i = 0; i < n; i++) {
      const col = div('fx-rain-col');
      col.style.left = (i / n * 100 + Math.random() * (100 / n) * 0.5) + '%';
      const fs = 12 + Math.random() * 12;
      col.style.fontSize = fs.toFixed(0) + 'px';
      col.style.animationDuration = (6 + Math.random() * 9).toFixed(1) + 's';
      col.style.animationDelay = (-Math.random() * 12).toFixed(1) + 's';
      col.style.opacity = (0.35 + Math.random() * 0.5).toFixed(2);
      const len = 8 + ((Math.random() * 14) | 0);
      let html = '';
      for (let j = 0; j < len; j++) {
        const ch = cfg.rainChars[(Math.random() * cfg.rainChars.length) | 0];
        html += `<span${j === 0 ? ' class="lead"' : ''}>${ch}</span>`;
      }
      col.innerHTML = html;
      wrap.appendChild(col);
    }
    return wrap;
  }

  /* rising/floating field: bubbles (sea), embers (war), motes (gold dust) */
  function buildField(type) {
    const wrap = div('fx-' + type + 's');
    if (reduce) return wrap;
    const n = cfg.fieldCount;
    for (let i = 0; i < n; i++) {
      const e = div('fx-' + type);
      const sz = type === 'bubble' ? (4 + Math.random() * 16)
               : type === 'ember'  ? (2 + Math.random() * 4)
               :                     (2 + Math.random() * 3);
      e.style.width = e.style.height = sz.toFixed(1) + 'px';
      e.style.left = (Math.random() * 100).toFixed(2) + '%';
      e.style.setProperty('--fx-drift', ((Math.random() - 0.5) * 80).toFixed(0) + 'px');
      e.style.animationDuration = (type === 'mote' ? 11 + Math.random() * 12 : 6 + Math.random() * 9).toFixed(1) + 's';
      e.style.animationDelay = (-Math.random() * 14).toFixed(1) + 's';
      wrap.appendChild(e);
    }
    return wrap;
  }
  function shake(intensity = 10, duration = 0.45, el) {
    const target = el || shakeEl;
    if (!target || reduce) return;
    if (hasGSAP()) {
      const tl = gsap.timeline();
      const steps = Math.max(4, Math.round(duration / 0.045));
      for (let i = 0; i < steps; i++) {
        const damp = 1 - i / steps;
        tl.to(target, {
          x: (Math.random() - 0.5) * intensity * 2 * damp,
          y: (Math.random() - 0.5) * intensity * 2 * damp,
          rotation: (Math.random() - 0.5) * 1.4 * damp,
          duration: duration / steps, ease: 'power1.inOut',
        });
      }
      tl.to(target, { x: 0, y: 0, rotation: 0, duration: duration / steps });
    } else {
      // WAAPI fallback
      const kf = [{ transform: 'translate(0,0)' }];
      const steps = 8;
      for (let i = 0; i < steps; i++) {
        const damp = 1 - i / steps;
        kf.push({ transform: `translate(${(Math.random()-0.5)*intensity*2*damp}px,${(Math.random()-0.5)*intensity*2*damp}px)` });
      }
      kf.push({ transform: 'translate(0,0)' });
      target.animate(kf, { duration: duration * 1000, easing: 'ease-out' });
    }
  }

  /* ── full screen flash ── */
  function flash(color = '#fff', peak = 0.5, dur = 0.5) {
    if (!flashEl || reduce) return;
    flashEl.style.setProperty('--fx-flash-color', color);
    flashEl.animate(
      [{ opacity: 0 }, { opacity: peak, offset: 0.12 }, { opacity: 0 }],
      { duration: dur * 1000, easing: 'ease-out' }
    );
  }

  /* ── particle burst (emoji or sparks). WAAPI-driven for robustness ── */
  function burst(x, y, opts = {}) {
    if (reduce) return;
    const o = Object.assign({
      count: 18, emoji: null, colors: ['#E3C766', '#D97B5C', '#fff'],
      power: 9, gravity: 0.45, spread: Math.PI * 2, up: 0, size: 18, life: 1100,
    }, opts);
    for (let i = 0; i < o.count; i++) {
      const isEmoji = o.emoji && o.emoji.length;
      const p = document.createElement('div');
      p.className = isEmoji ? 'fx-particle' : 'fx-spark';
      if (isEmoji) {
        p.textContent = o.emoji[(Math.random() * o.emoji.length) | 0];
        p.style.fontSize = (o.size * (0.7 + Math.random() * 0.7)).toFixed(0) + 'px';
      } else {
        const c = o.colors[(Math.random() * o.colors.length) | 0];
        const s = (4 + Math.random() * 7);
        p.style.width = p.style.height = s.toFixed(1) + 'px';
        p.style.background = c;
        p.style.boxShadow = `0 0 10px ${c}`;
      }
      p.style.left = x + 'px'; p.style.top = y + 'px';
      document.body.appendChild(p);

      const ang = -Math.PI / 2 + (Math.random() - 0.5) * o.spread - o.up;
      const sp = o.power * (0.5 + Math.random());
      const dx = Math.cos(ang) * sp * 26;
      const dyUp = Math.sin(ang) * sp * 26;
      const dyDown = dyUp + o.gravity * 360;
      const rot = (Math.random() - 0.5) * 720;
      const dur = o.life * (0.7 + Math.random() * 0.6);
      p.animate([
        { transform: 'translate(0,0) rotate(0deg) scale(1)', opacity: 1 },
        { transform: `translate(${dx*0.6}px,${dyUp}px) rotate(${rot*0.5}deg) scale(1)`, opacity: 1, offset: 0.45 },
        { transform: `translate(${dx}px,${dyDown}px) rotate(${rot}deg) scale(0.5)`, opacity: 0 },
      ], { duration: dur, easing: 'cubic-bezier(.25,.7,.4,1)', fill: 'forwards' });
      setTimeout(() => p.remove(), dur + 50);
    }
  }

  function burstAt(el, opts) {
    if (!el) return;
    const r = el.getBoundingClientRect();
    burst(r.left + r.width / 2, r.top + r.height / 2, opts);
  }

  /* ── floating combo / streak text ── */
  function combo(text, x, y, opts = {}) {
    if (reduce) return;
    const o = Object.assign({ size: 40, color: null, rise: 90 }, opts);
    const el = document.createElement('div');
    el.className = 'fx-combo';
    el.textContent = text;
    el.style.left = x + 'px'; el.style.top = y + 'px';
    el.style.fontSize = o.size + 'px';
    if (o.color) el.style.color = o.color;
    el.style.transform = 'translate(-50%,-50%)';
    document.body.appendChild(el);
    el.animate([
      { transform: 'translate(-50%,-50%) scale(0.4)', opacity: 0 },
      { transform: 'translate(-50%,-70%) scale(1.15)', opacity: 1, offset: 0.3 },
      { transform: 'translate(-50%,-90%) scale(1)', opacity: 1, offset: 0.7 },
      { transform: `translate(-50%,calc(-50% - ${o.rise}px)) scale(0.9)`, opacity: 0 },
    ], { duration: 1400, easing: 'cubic-bezier(.2,.8,.3,1)', fill: 'forwards' });
    setTimeout(() => el.remove(), 1450);
  }

  /* ── glyph-scramble reveal: text decodes from random glyphs to final ── */
  function scramble(el, finalText, opts = {}) {
    if (!el) return;
    const o = Object.assign({ duration: 900, chars: GREEK, settleStagger: true }, opts);
    if (reduce) { el.textContent = finalText; return; }
    const chars = finalText.split('');
    const start = performance.now();
    // settle index advances over time; each char locks once reached
    const lockAt = chars.map((_, i) => o.settleStagger ? (i + 1) / chars.length : 1);
    let raf;
    function frame(now) {
      const t = Math.min(1, (now - start) / o.duration);
      el.textContent = chars.map((c, i) =>
        c === ' ' ? ' ' : (t >= lockAt[i] ? c : o.chars[(Math.random() * o.chars.length) | 0])
      ).join('');
      if (t < 1) raf = requestAnimationFrame(frame);
      else el.textContent = finalText;
    }
    raf = requestAnimationFrame(frame);
    // failsafe: if rAF stalls, settle the text
    setTimeout(() => { if (el.textContent !== finalText) el.textContent = finalText; }, o.duration + 400);
  }

  /* ── GSAP screen transition: slide+fade a screen in (failsafe-revealed) ── */
  function enterScreen(el, opts = {}) {
    if (!el || reduce || !hasGSAP()) return;
    const o = Object.assign({ y: 24, dur: 0.55, stagger: 0.06, childSel: null }, opts);
    const kids = o.childSel ? Array.from(el.querySelectorAll(o.childSel)) : [];
    gsap.fromTo(el, { autoAlpha: 0, y: o.y }, { autoAlpha: 1, y: 0, duration: o.dur, ease: 'power3.out', clearProps: 'transform,opacity,visibility' });
    if (kids.length) gsap.from(kids, { autoAlpha: 0, y: 18, duration: o.dur * 0.8, stagger: o.stagger, ease: 'power3.out', delay: 0.12, clearProps: 'all' });
    // failsafe: if the ticker is throttled (offscreen iframe), force content visible
    const reveal = () => {
      [el, ...kids].forEach(n => { n.style.opacity = ''; n.style.visibility = ''; n.style.transform = ''; });
    };
    setTimeout(() => { if (getComputedStyle(el).opacity !== '1') reveal(); }, (o.dur + 0.5) * 1000);
  }

  /* ── pop an element (scale punch) ── */
  function pop(el, scale = 1.18) {
    if (!el || reduce) return;
    if (hasGSAP()) {
      gsap.fromTo(el, { scale: 1 }, { scale, duration: 0.12, yoyo: true, repeat: 1, ease: 'power2.inOut', transformOrigin: '50% 50%' });
    } else {
      el.animate([{ transform: 'scale(1)' }, { transform: `scale(${scale})` }, { transform: 'scale(1)' }], { duration: 240, easing: 'ease-in-out' });
    }
  }

  return { mount, shake, flash, burst, burstAt, combo, scramble, enterScreen, pop,
           get reduce(){ return reduce; }, GREEK, CODE };
})();
