/**
 * IliadaControls.js  —  SymposiON · Iliada Arcade
 * ─────────────────────────────────────────────────────────────────
 * Thin adapter that wires the Iliada Arcade into the SHARED virtual
 * gamepad (games/shared/touch-controls.js · window.SymTouch).
 *
 * The shared module builds the joystick-left + buttons-right layout and
 * bridges into game.js exactly as the old bespoke overlay did — by
 * dispatching synthetic KeyboardEvents that game.js's KEYS{} map reads.
 * game.js is NOT modified.
 *
 *   Joystick → ArrowLeft / ArrowRight / ArrowUp (jump)
 *   ATTACK   → KeyZ      BLOCK → KeyQ      ULT → KeyF
 *
 * Lifecycle (unchanged from before):
 *   • Shows the pad while #ia-s-game is .ia-active (MutationObserver).
 *   • Mirrors the ult-ready glow off #ia-hud's .ia-ult-ready marker.
 *   • Hides the legacy #ia-touch strip so it can't double-fire.
 *   • Wraps openIliadaArcade / closeIliadaArcade to attach/detach the
 *     observers once game.js has injected #ia-root.
 */
(function () {
  'use strict';

  function isTouchDevice() {
    return navigator.maxTouchPoints > 0 || 'ontouchstart' in window;
  }
  if (!isTouchDevice() || !window.SymTouch) return;

  let pad = null;               // SymTouch handle
  let ultObserver = null;
  let screenObserver = null;

  /* ── Build the shared pad (once) ──────────────────────────────── */
  function buildPad() {
    if (pad) return;
    pad = SymTouch.mount({
      container: document.body,
      accent: '#C9A84C',
      glow: 'rgba(201,168,76,.4)',
      zIndex: 200,                 // above wave-banner (20), below quiz (9000)
      rotateHint: true,
      joystick: {
        output: 'keys',
        anchor: 'float',           // base drops where the thumb lands
        deadzone: 0.15,
        jumpThreshold: -0.45,      // up-axis only ever fires jump
        keys: { left: 'ArrowLeft', right: 'ArrowRight', up: 'ArrowUp' },
      },
      buttons: [
        { id: 'atk',    icon: '⚔️', label: 'ATTACK', slot: 'primary', tone: 'primary', key: 'KeyZ' },
        { id: 'shield', icon: '🛡',  label: 'BLOCK',  slot: 'left',    tone: 'ghost',   key: 'KeyQ' },
        { id: 'ult',    icon: '⚡',  label: 'ULT',    slot: 'top',     tone: 'special', key: 'KeyF' },
      ],
    });
  }

  /* ── Show / hide ──────────────────────────────────────────────── */
  function show() {
    if (!pad) return;
    pad.show();
    // Hide the legacy D-pad strip so it doesn't double-fire.
    const oldTouch = document.getElementById('ia-touch');
    if (oldTouch) oldTouch.style.display = 'none';
    // game.js subtracts a fixed touch-strip height on resize; nudge it now
    // that the strip is gone from layout so the canvas height is correct.
    window.dispatchEvent(new Event('resize'));
  }
  function hide() {
    if (!pad) return;
    pad.hide();
    const oldTouch = document.getElementById('ia-touch');
    if (oldTouch) oldTouch.style.display = '';
  }

  /* ── Ult-ready mirror ─────────────────────────────────────────── */
  function startUltimateWatcher() {
    const hud = document.getElementById('ia-hud');
    if (!hud || !pad) return;
    ultObserver = new MutationObserver(function () {
      pad.setButtonActive('ult', Boolean(hud.querySelector('.ia-ult-ready')));
    });
    ultObserver.observe(hud, { subtree: true, attributes: true, attributeFilter: ['class'] });
  }

  /* ── Watch the active gameplay screen ─────────────────────────── */
  function watchGameScreen() {
    const gameScreen = document.getElementById('ia-s-game');
    if (!gameScreen) return;
    screenObserver = new MutationObserver(function () {
      if (gameScreen.classList.contains('ia-active')) show();
      else hide();
    });
    screenObserver.observe(gameScreen, { attributes: true, attributeFilter: ['class'] });
    if (gameScreen.classList.contains('ia-active')) show();
  }

  /* ── Wrap open/close so observers attach after #ia-root exists ── */
  function hookArcadeLifecycle() {
    const _open = window.openIliadaArcade;
    if (typeof _open === 'function') {
      window.openIliadaArcade = function () {
        _open.apply(this, arguments);
        if (!screenObserver) watchGameScreen();
        if (!ultObserver)    startUltimateWatcher();
      };
    }
    const _close = window.closeIliadaArcade;
    if (typeof _close === 'function') {
      window.closeIliadaArcade = function () {
        hide();
        if (ultObserver)    { ultObserver.disconnect();    ultObserver = null; }
        if (screenObserver) { screenObserver.disconnect(); screenObserver = null; }
        _close.apply(this, arguments);
      };
    }
  }

  /* ── Boot ─────────────────────────────────────────────────────── */
  function init() {
    buildPad();
    // Block pull-to-refresh while playing, but allow scroll inside the quiz.
    document.addEventListener('touchmove', function (e) {
      if (!pad || !pad.isVisible()) return;
      const quiz = document.getElementById('ia-quiz');
      if (quiz && quiz.classList.contains('ia-open') && quiz.contains(e.target)) return;
      e.preventDefault();
    }, { passive: false });
  }

  hookArcadeLifecycle();   // game.js loaded before us → globals already defined
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { setTimeout(init, 0); });
  } else {
    setTimeout(init, 0);
  }

  /* ── Public API (parity with the old overlay) ─────────────────── */
  window.IliadaControls = {
    show: show,
    hide: hide,
    isVisible: function () { return !!pad && pad.isVisible(); },
    getInput: function () { return { x: 0, y: 0 }; },   // keys-mode: no raw axis
  };
})();
