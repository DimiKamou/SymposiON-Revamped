/**
 * touch-controls.js  —  SymposiON · Shared Virtual Gamepad
 * ─────────────────────────────────────────────────────────────────
 * One reusable touch layout for every game that needs movement:
 *   • LEFT  — an analog joystick (fixed or finger-anchored).
 *   • RIGHT — a cluster of 1–4 action buttons; each game declares how
 *             many and what they do.
 *
 * Two bridge modes (a game picks whichever its engine already speaks):
 *   • joystick.output:'keys'   → synthesises KeyboardEvents on window
 *     (ArrowLeft/Right/Up/Down), so an engine that polls a KEYS{} map
 *     needs zero changes.  Side-scrollers set `jumpThreshold` so the
 *     up-axis only ever fires "jump" (never a down key).
 *   • joystick.output:'vector' → calls onMove(vx, vy) with a normalised
 *     vector in [-1,1]; onMove(0,0) on release.
 *
 *   Buttons likewise bridge either way, per button:
 *     • { key:'KeyZ' }                 → synthetic KeyboardEvent
 *     • { onPress, onRelease }         → direct callbacks
 *   (both may be set; both fire.)
 *
 * Multitouch is real: the joystick and every button track their own
 * pointerId via pointer-event capture, so you can hold a direction and
 * mash a button at once.
 *
 * Theming: pass `accent` (and optional `glow`) — they become CSS custom
 * properties on the root, so each game keeps its own palette.
 *
 * Public API:
 *   const pad = SymTouch.mount(config) → handle
 *   pad.show() / pad.hide() / pad.destroy()
 *   pad.setButtonActive(id, on)   // glow/ready state (e.g. ult charged)
 *   pad.isVisible()  pad.el
 *
 * config = {
 *   container:   HTMLElement (default document.body),
 *   accent:      css colour (default '#C9A84C'),
 *   glow:        css colour (default derived translucent accent),
 *   zIndex:      number (default 200),
 *   rotateHint:  bool | string  — show "rotate device" overlay in portrait,
 *   onlyTouch:   bool (default true) — mount only on touch/coarse devices,
 *   joystick: {
 *     output:    'keys' | 'vector'   (default 'keys'),
 *     anchor:    'fixed' | 'float'   (default 'fixed'),
 *     deadzone:  number              (default 0.15),
 *     jumpThreshold: number|null     (keys+platformer; e.g. -0.45),
 *     keys:      { left, right, up, down }  (codes; up/down optional),
 *     onMove:    (vx, vy) => {}       (vector mode),
 *   },
 *   buttons: [
 *     { id, icon, label, slot?, tone?, key?, accent?, onPress?, onRelease? },
 *     ...                                            // 1–4 entries
 *   ],
 * }
 *
 * slot ∈ 'primary'(big, bottom-right) | 'left'(bottom-left) |
 *        'top'(top-centre) | 'topleft'.  Omit and slots auto-assign
 *        by index in that same order.
 * tone ∈ 'primary'(solid accent) | 'ghost'(outline) | 'special'.
 */
(function () {
  'use strict';

  const DEFAULT_ACCENT = '#C9A84C';
  const AUTO_SLOTS = ['primary', 'left', 'top', 'topleft'];

  function isTouchDevice() {
    return navigator.maxTouchPoints > 0 ||
           'ontouchstart' in window ||
           (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
  }

  /* Synthetic keyboard bridge — an engine polling KEYS{} picks these up. */
  function fireKey(code, down) {
    if (!code) return;
    window.dispatchEvent(new KeyboardEvent(down ? 'keydown' : 'keyup', {
      code, key: code, bubbles: true, cancelable: true,
    }));
  }

  function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  /* ════════════════════════════════════════════════════════════════
     Pad instance
     ════════════════════════════════════════════════════════════════ */
  function mount(config) {
    config = config || {};
    const onlyTouch = config.onlyTouch !== false;
    if (onlyTouch && !isTouchDevice()) {
      return _noopHandle();
    }

    const container = config.container || document.body;
    const joyCfg = Object.assign({
      output: 'keys',
      anchor: 'fixed',
      deadzone: 0.15,
      jumpThreshold: null,
      keys: { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp', down: 'ArrowDown' },
      onMove: null,
    }, config.joystick || {});
    const buttons = (config.buttons || []).slice(0, 4);

    /* ── Root ── */
    const root = el('div', 'symtc-root symtc-anchor-' + joyCfg.anchor);
    root.setAttribute('aria-hidden', 'true');
    root.style.setProperty('--symtc-accent', config.accent || DEFAULT_ACCENT);
    if (config.glow) root.style.setProperty('--symtc-glow', config.glow);
    root.style.zIndex = (config.zIndex != null ? config.zIndex : 200);
    if (container === document.body) root.classList.add('symtc-fixed');

    /* ── Rotate-device hint (portrait) ── */
    if (config.rotateHint) {
      const hint = el('div', 'symtc-rotate-hint');
      const txt = typeof config.rotateHint === 'string'
        ? config.rotateHint
        : 'Στρέψε τη συσκευή για παιχνίδι · Rotate device to play';
      hint.innerHTML =
        '<span class="symtc-rotate-ic">⟳</span>' +
        '<span class="symtc-rotate-txt">' + txt + '</span>';
      root.appendChild(hint);
    }

    /* ── LEFT zone + joystick ── */
    const leftZone = el('div', 'symtc-zone symtc-zone-left');
    const joy = el('div', 'symtc-joy');
    const base = el('div', 'symtc-joy-base');
    const knob = el('div', 'symtc-joy-knob');
    base.appendChild(knob);
    joy.appendChild(base);
    leftZone.appendChild(joy);
    root.appendChild(leftZone);

    /* ── RIGHT zone + button cluster ── */
    const rightZone = el('div', 'symtc-zone symtc-zone-right');
    const cluster = el('div', 'symtc-cluster');
    const btnEls = {};                       // id → button element
    buttons.forEach(function (b, i) {
      const slot = b.slot || AUTO_SLOTS[i] || 'primary';
      const tone = b.tone || (slot === 'primary' ? 'primary' : 'ghost');
      const btn = el('button', 'symtc-btn symtc-tone-' + tone + ' symtc-slot-' + slot);
      btn.type = 'button';
      btn.dataset.id = b.id;
      btn.setAttribute('aria-label', b.label || b.id || 'button');
      if (b.accent) btn.style.setProperty('--symtc-accent', b.accent);
      btn.innerHTML =
        '<span class="symtc-btn-ic">' + (b.icon || '') + '</span>' +
        (b.label ? '<span class="symtc-btn-lbl">' + b.label + '</span>' : '');
      cluster.appendChild(btn);
      btnEls[b.id] = btn;
    });
    rightZone.appendChild(cluster);
    root.appendChild(rightZone);

    container.appendChild(root);

    /* ════════════════════════════════════════════════════════════
       Joystick input
       ════════════════════════════════════════════════════════════ */
    let joyPointer = null;          // active pointerId
    let cx = 0, cy = 0, R = 50;     // base centre + travel radius
    const prevKey = { left: false, right: false, up: false, down: false };

    function syncKey(name, down) {
      if (down === prevKey[name]) return;
      prevKey[name] = down;
      fireKey(joyCfg.keys[name], down);
    }

    function emit(vx, vy) {
      if (joyCfg.output === 'vector') {
        if (typeof joyCfg.onMove === 'function') joyCfg.onMove(vx, vy);
        return;
      }
      // keys mode
      const dz = joyCfg.deadzone;
      syncKey('left',  vx < -dz);
      syncKey('right', vx >  dz);
      if (joyCfg.jumpThreshold != null) {
        // platformer: up-axis only fires "up"/jump, never down
        syncKey('up', vy < joyCfg.jumpThreshold);
      } else {
        syncKey('up',   vy < -dz);
        syncKey('down', vy >  dz);
      }
    }

    function setCentreFromBase() {
      const r = base.getBoundingClientRect();
      cx = r.left + r.width / 2;
      cy = r.top + r.height / 2;
      R = (r.width / 2) || 50;
    }

    function joyStart(e) {
      if (joyPointer !== null) return;
      joyPointer = e.pointerId;

      if (joyCfg.anchor === 'float') {
        // Drop the base wherever the finger landed inside the left zone.
        const zr = leftZone.getBoundingClientRect();
        base.style.left = (e.clientX - zr.left) + 'px';
        base.style.top  = (e.clientY - zr.top) + 'px';
        base.classList.add('symtc-joy-base--active');
        cx = e.clientX; cy = e.clientY;
        R = (base.getBoundingClientRect().width / 2) || 50;
      } else {
        setCentreFromBase();
        base.classList.add('symtc-joy-base--active');
      }
      try { joy.setPointerCapture(e.pointerId); } catch (_) {}
      joyMove(e);
      e.preventDefault();
    }

    function joyMove(e) {
      if (e.pointerId !== joyPointer) return;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      let nx = 0, ny = 0;
      if (dist > 0) {
        const cl = Math.min(dist, R);
        knob.style.transform =
          'translate(calc(-50% + ' + (dx / dist * cl) + 'px), calc(-50% + ' + (dy / dist * cl) + 'px))';
        nx = (dx / R); ny = (dy / R);
        const mag = Math.hypot(nx, ny);
        if (mag > 1) { nx /= mag; ny /= mag; }
        // dead-zone re-map so the inner ring reads as true zero
        const m2 = Math.hypot(nx, ny);
        if (m2 < joyCfg.deadzone) { nx = 0; ny = 0; }
      }
      emit(nx, ny);
      e.preventDefault();
    }

    function joyEnd(e) {
      if (e.pointerId !== joyPointer) return;
      joyPointer = null;
      knob.style.transform = 'translate(-50%, -50%)';
      base.classList.remove('symtc-joy-base--active');
      emit(0, 0);
    }

    joy.addEventListener('pointerdown', joyStart);
    joy.addEventListener('pointermove', joyMove);
    joy.addEventListener('pointerup', joyEnd);
    joy.addEventListener('pointercancel', joyEnd);
    joy.addEventListener('lostpointercapture', joyEnd);

    /* ════════════════════════════════════════════════════════════
       Button input  (each button captures its own pointer)
       ════════════════════════════════════════════════════════════ */
    function pressBtn(cfg, btn, down) {
      btn.classList.toggle('symtc-btn--pressed', down);
      if (cfg.key) fireKey(cfg.key, down);
      if (down && typeof cfg.onPress === 'function') cfg.onPress();
      if (!down && typeof cfg.onRelease === 'function') cfg.onRelease();
    }

    buttons.forEach(function (cfg) {
      const btn = btnEls[cfg.id];
      if (!btn) return;
      let pid = null;
      btn.addEventListener('pointerdown', function (e) {
        pid = e.pointerId;
        try { btn.setPointerCapture(pid); } catch (_) {}
        pressBtn(cfg, btn, true);
        e.preventDefault();
      });
      const up = function (e) {
        if (e.pointerId !== pid) return;
        pid = null;
        pressBtn(cfg, btn, false);
        e.preventDefault();
      };
      btn.addEventListener('pointerup', up);
      btn.addEventListener('pointercancel', up);
      btn.addEventListener('lostpointercapture', up);
    });

    /* ════════════════════════════════════════════════════════════
       Handle
       ════════════════════════════════════════════════════════════ */
    let visible = false;

    function releaseAll() {
      // joystick
      ['left', 'right', 'up', 'down'].forEach(function (n) { syncKey(n, false); });
      if (joyCfg.output === 'vector' && typeof joyCfg.onMove === 'function') joyCfg.onMove(0, 0);
      knob.style.transform = 'translate(-50%, -50%)';
      base.classList.remove('symtc-joy-base--active');
      joyPointer = null;
      // buttons
      buttons.forEach(function (cfg) {
        const btn = btnEls[cfg.id];
        if (btn && btn.classList.contains('symtc-btn--pressed')) pressBtn(cfg, btn, false);
      });
    }

    const handle = {
      el: root,
      show: function () {
        if (visible) return;
        visible = true;
        root.classList.add('symtc-visible');
      },
      hide: function () {
        if (!visible) return;
        visible = false;
        root.classList.remove('symtc-visible');
        releaseAll();
      },
      isVisible: function () { return visible; },
      setButtonActive: function (id, on) {
        const btn = btnEls[id];
        if (btn) btn.classList.toggle('symtc-btn--active', !!on);
      },
      destroy: function () {
        releaseAll();
        if (root.parentNode) root.parentNode.removeChild(root);
      },
    };
    return handle;
  }

  function _noopHandle() {
    return {
      el: null,
      show: function () {}, hide: function () {},
      isVisible: function () { return false; },
      setButtonActive: function () {}, destroy: function () {},
    };
  }

  window.SymTouch = { mount: mount, isTouchDevice: isTouchDevice };
})();
