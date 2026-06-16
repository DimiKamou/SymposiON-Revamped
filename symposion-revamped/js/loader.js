/* ════════════════════════════════════════════════════════════════════
   SymposiON · loader.js
   ── Exports:
      window._injectIllus(scope)          — inline-SVG injector
      window.SymLoader.show() / .hide()   — full-screen loading overlay
      window.SymLoader.mount(sel, opts)   — inline spinner
   Honours prefers-reduced-motion.
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── 1. Illustration injector ─────────────────────────────────────
     Replaces every <div data-illu="name"> placeholder with the
     corresponding SVG fetched from images/illustrations/.
     Uses a module-level cache so each SVG is fetched once only.
  ─────────────────────────────────────────────────────────────────── */
  async function injectIllustrations(scope) {
    const cache = injectIllustrations._c || (injectIllustrations._c = new Map());
    const els = scope.querySelectorAll('[data-illu]:not([data-illu-done])');
    for (const el of els) {
      const n = el.dataset.illu;
      if (!n) continue;
      if (!cache.has(n)) {
        cache.set(n, fetch((window.APP_BASE || '') + 'images/illustrations/' + n + '.svg')
          .then(function (r) { return r.ok ? r.text() : Promise.reject(r.status); }));
      }
      try {
        let svg = await cache.get(n);
        const sz = el.dataset.size;
        svg = svg.replace(/<svg([^>]*?)>/, function (_, attrs) {
          var cleaned = attrs.replace(/\s(?:width|height)="[^"]*"/g, '');
          var style   = 'display:block;width:100%;height:100%;color:inherit';
          if (sz) style += ';max-width:' + sz + 'px;max-height:' + sz + 'px';
          return '<svg' + cleaned + ' style="' + style + '">';
        });
        el.innerHTML = svg;
        el.setAttribute('data-illu-done', '1');
      } catch (_) { /* silently skip missing SVGs */ }
    }
  }

  window._injectIllus = injectIllustrations;

  /* ─── 2. Styles (injected once) ────────────────────────────────────
  ─────────────────────────────────────────────────────────────────── */
  var LOADER_CSS = [
    '#sym-loader-overlay{',
      'position:fixed;inset:0;z-index:9999;',
      'display:flex;flex-direction:column;align-items:center;justify-content:center;gap:0;',
      'background:radial-gradient(ellipse 70% 55% at 50% 40%,rgba(200,120,48,.08),transparent 65%),var(--sym-bg,#0D0A06);',
      'transition:opacity .45s ease,visibility .45s;',
    '}',
    '#sym-loader-overlay.sym-loader--hidden{opacity:0;visibility:hidden;pointer-events:none;}',
    '.sym-loader-mark{display:flex;flex-direction:column;align-items:center;gap:22px;}',
    /* Brand mark SVG */
    '.sym-loader-brand-mark{',
      'width:56px;height:56px;',
      'color:var(--sym-gold,#C87830);',
      'animation:sym-brand-pulse 2.4s ease-in-out infinite;',
    '}',
    '@keyframes sym-brand-pulse{0%,100%{opacity:.7;transform:scale(1);}50%{opacity:1;transform:scale(1.06);}}',
    /* Ring under logo */
    '.sym-loader-spin{',
      'width:52px;height:52px;',
      'border:1.5px solid color-mix(in srgb,var(--sym-gold,#C4A448) 15%,transparent);',
      'border-top-color:var(--sym-gold,#C4A448);',
      'border-radius:50%;',
      'animation:sym-spin .9s linear infinite;',
      'position:absolute;',
    '}',
    '.sym-loader-logo-wrap{position:relative;width:56px;height:56px;display:flex;align-items:center;justify-content:center;}',
    '.sym-loader-wordmark{',
      'font-family:var(--sym-font-serif,"Cinzel",serif);',
      'font-size:13px;letter-spacing:5px;text-transform:uppercase;',
      'color:var(--sym-fg-muted,#7C6F58);',
      'margin-top:-4px;',
    '}',
    '.sym-loader-tagline{',
      'font-family:"Inter",sans-serif;',
      'font-size:10px;letter-spacing:2px;text-transform:uppercase;',
      'color:color-mix(in srgb,var(--sym-gold,#C4A448) 45%,transparent);',
      'margin-top:-14px;',
    '}',
    '@keyframes sym-spin{to{transform:rotate(360deg);}}',
    /* reduced-motion */
    '@media(prefers-reduced-motion:reduce){',
      '.sym-loader-spin,.sym-loader-brand-mark{animation:none;opacity:.55;}',
      '#sym-loader-overlay{transition:none;}',
    '}',
    /* inline variant */
    '.sym-inline-loader{display:flex;align-items:center;justify-content:center;}',
    '.sym-inline-loader .sym-loader-spin{width:var(--sml-size,36px);height:var(--sml-size,36px);position:relative;}',
  ].join('');

  if (!document.getElementById('sym-loader-styles')) {
    var s = document.createElement('style');
    s.id = 'sym-loader-styles';
    s.textContent = LOADER_CSS;
    document.head.appendChild(s);
  }

  /* ─── 3. SymLoader API ─────────────────────────────────────────────
  ─────────────────────────────────────────────────────────────────── */
  var _overlay = null;

  function _ensureOverlay() {
    if (_overlay) return _overlay;
    _overlay = document.createElement('div');
    _overlay.id = 'sym-loader-overlay';
    _overlay.setAttribute('role', 'status');
    _overlay.setAttribute('aria-live', 'polite');
    _overlay.setAttribute('aria-label', 'Loading');
    _overlay.innerHTML =
      '<div class="sym-loader-mark">' +
        '<div class="sym-loader-logo-wrap">' +
          '<div class="sym-loader-spin" aria-hidden="true"></div>' +
          '<svg class="sym-loader-brand-mark" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">' +
            '<line x1="22" y1="20" x2="78" y2="20"/>' +
            '<line x1="22" y1="20" x2="48" y2="50"/>' +
            '<line x1="48" y1="50" x2="22" y2="80"/>' +
            '<line x1="22" y1="80" x2="78" y2="80"/>' +
            '<g stroke="currentColor" stroke-width="3.2" fill="none" stroke-linecap="round">' +
              '<circle cx="64" cy="50" r="12" stroke-dasharray="62 12" stroke-dashoffset="-7" transform="rotate(-90 64 50)"/>' +
              '<line x1="64" y1="39" x2="64" y2="49"/>' +
            '</g>' +
          '</svg>' +
        '</div>' +
        '<div class="sym-loader-wordmark">Symposi<span style="color:var(--sym-terra,#D97B5C)">ON</span></div>' +
        '<div class="sym-loader-tagline">loading…</div>' +
      '</div>';
    document.body.appendChild(_overlay);
    // Start hidden; show() reveals it
    _overlay.classList.add('sym-loader--hidden');
    return _overlay;
  }

  window.SymLoader = {
    /**
     * Show the full-screen loading overlay.
     * Call before navigating or starting a heavy load.
     */
    show: function () {
      var el = _ensureOverlay();
      el.classList.remove('sym-loader--hidden');
    },

    /**
     * Hide the overlay (fades out).
     * Call when content is ready.
     */
    hide: function () {
      if (!_overlay) return;
      _overlay.classList.add('sym-loader--hidden');
    },

    /**
     * Mount an inline spinner inside a container.
     * @param {string|Element} selector  CSS selector or DOM element
     * @param {Object}         opts      { size: 120 } (px)
     * @returns {Element}  the mounted spinner element
     */
    mount: function (selector, opts) {
      var target = (typeof selector === 'string')
        ? document.querySelector(selector) : selector;
      if (!target) return null;
      opts = opts || {};
      var size = opts.size || 40;
      var el   = document.createElement('div');
      el.className = 'sym-inline-loader';
      el.style.setProperty('--sml-size', size + 'px');
      el.innerHTML = '<div class="sym-loader-spin" aria-hidden="true"></div>';
      target.appendChild(el);
      return el;
    }
  };

})();

/* ─── Season restore — apply saved season before paint ──────────────── */
(function () {
  var saved = localStorage.getItem('symposion_season');
  if (saved) document.body.classList.add('season-' + saved);
})();
