// ============================================================
//  SymposiON — Synthesis: Unity WebGL launcher + bridge (parent side)
//
//  Mirrors the iframe-game launchers in js/trivia-iframe-launchers.js
//  (openIstoria / openSymposion): opens a full-screen overlay whose
//  iframe hosts games/unity/index.html. Loaded EAGERLY from index.html
//  so the tile's openFn (window.openUnity) exists before any click.
//
//  Manifest fragment js/manifest/unity.js registers SYN_GAMES.openUnity
//  (overlay:'unity-overlay') + SYN_LAUNCH_MAP so a data.js tile
//  { launch:{fn:'openUnity'} } resolves and launches via synLaunch.
//
//  Bridge (window.UnityBridge) — same-origin postMessage to/from the
//  iframe. See games/unity/README.md for the full protocol.
//    UnityBridge.send(gameObject, method, value)   parent → Unity
//    UnityBridge.on(type, fn) / off(type, fn)      Unity  → parent
//    window 'unity:message' CustomEvent            Unity  → parent (DOM)
// ============================================================
(function () {
  'use strict';

  function _appBase() {
    return window.APP_BASE || (new URL('./', location.href).href);
  }
  var IFRAME_ORIGIN = (function(){
    try { return window.location.origin; } catch(_) { return '*'; }
  })();

  var _iframe   = null;   // the live Unity host iframe
  var _ready    = false;  // iframe host bridge has announced itself
  var _queue    = [];     // parent→Unity messages buffered until ready
  var _handlers = {};     // type -> [fn]

  // Inject the host iframe into the overlay's #unity-wrap on first open
  // (defers the heavy WebGL load until the game is actually launched).
  function _ensureIframe() {
    var wrap = document.getElementById('unity-wrap');
    if (!wrap) return null;
    var existing = wrap.querySelector('iframe');
    if (existing) { _iframe = existing; return _iframe; }
    var f = document.createElement('iframe');
    f.src = _appBase() + 'games/unity/index.html';
    f.title = 'SymposiON Unity';
    f.setAttribute('allow', 'autoplay; fullscreen; gamepad; xr-spatial-tracking; accelerometer; gyroscope');
    f.setAttribute('referrerpolicy', 'no-referrer-when-downgrade');
    f.style.cssText = 'width:100%;height:100%;border:0;display:block';
    wrap.appendChild(f);
    _iframe = f;
    return _iframe;
  }

  // ── parent → Unity ──────────────────────────────────────────────────
  // Posts { source:'symposion', type:'unity-call', gameObject, method, value }.
  // The host forwards it to unityInstance.SendMessage(gameObject, method, value).
  function send(gameObject, method, value) {
    var msg = { source: 'symposion', type: 'unity-call',
                gameObject: gameObject, method: method, value: value };
    if (_ready && _iframe && _iframe.contentWindow) {
      _iframe.contentWindow.postMessage(msg, IFRAME_ORIGIN);
    } else {
      _queue.push(msg);
    }
  }
  function _flush() {
    if (!_iframe || !_iframe.contentWindow) return;
    while (_queue.length) _iframe.contentWindow.postMessage(_queue.shift(), IFRAME_ORIGIN);
  }

  // ── Unity → parent ──────────────────────────────────────────────────
  function on(type, fn)  { (_handlers[type] = _handlers[type] || []).push(fn); }
  function off(type, fn) { if (_handlers[type]) _handlers[type] = _handlers[type].filter(function (h) { return h !== fn; }); }
  function _dispatch(type, data) {
    (_handlers[type] || []).forEach(function (h) { try { h(data); } catch (e) { console.error(e); } });
    (_handlers['*']   || []).forEach(function (h) { try { h(type, data); } catch (e) { console.error(e); } });
    try { window.dispatchEvent(new CustomEvent('unity:message', { detail: { type: type, data: data } })); } catch (_) {}
  }

  window.addEventListener('message', function (ev) {
    if (IFRAME_ORIGIN !== '*' && ev.origin !== IFRAME_ORIGIN) return;
    var d = ev.data;
    if (!d || d.source !== 'unity') return;
    // The host announces 'ready' when its bridge is up — start flushing then.
    if (d.type === 'ready' && !_ready) { _ready = true; _flush(); }
    _dispatch(d.type, d.data);
  });

  // ── overlay open / close ────────────────────────────────────────────
  function openUnity() {
    var f = _ensureIframe();
    var ov = document.getElementById('unity-overlay');
    if (ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
    // Nudge the host with a handshake in case its 'ready' fired before this
    // iframe existed (it replies with { source:'unity', type:'ready' }).
    if (f) {
      var tries = 0;
      var tick = setInterval(function () {
        if (_ready || tries++ > 20) { clearInterval(tick); return; }
        if (f.contentWindow) f.contentWindow.postMessage({ source: 'symposion', type: 'handshake' }, IFRAME_ORIGIN);
      }, 120);
    }
  }
  function closeUnity() {
    var ov = document.getElementById('unity-overlay');
    if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
  }

  // Default lifecycle wiring: let a Unity build ask to close itself.
  on('request-close', function () { closeUnity(); });

  window.UnityBridge = { send: send, on: on, off: off };
  window.openUnity   = openUnity;
  window.closeUnity  = closeUnity;
})();
