/* ═══════════════════════════════════════════════════════════
   SymposiON · Cursor Engine   (window.setSymCursor)
   ───────────────────────────────────────────────────────────
   INDEPENDENT of the Theme & Season engines — it never calls
   setSymTheme / setSymSeason and never touches data-sym-theme.
   Per-theme colour is resolved entirely in css/cursors.css via
   body[data-sym-theme] selectors, so changing the theme recolours
   the laurel cursor automatically.

   Manages:
     • body[data-cursor]            ("laurel" | absent)
     • localStorage("symposion_cursor")  ("laurel" | "classic")
     • active state on .cursor-opt picker buttons
   Coarse-pointer (touch) devices are skipped — the system cursor
   is left untouched there, while the saved preference is preserved
   for when the same account is used on a pointer device.
═══════════════════════════════════════════════════════════ */
;(function _installCursorEngine() {
  'use strict';

  const KEY   = 'symposion_cursor';
  const VALID = ['classic', 'laurel'];

  // Fine pointer (mouse / trackpad) required. Touch → unaffected.
  const FINE = !!(window.matchMedia &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches);

  function _markActive(name) {
    document.querySelectorAll('.cursor-opt[data-cursor]').forEach(function (btn) {
      btn.classList.toggle('theme-opt--active', btn.dataset.cursor === name);
    });
  }

  function _apply(name) {
    if (name === 'laurel' && FINE) {
      document.body.dataset.cursor = 'laurel';
    } else {
      // classic, or touch device → restore the system cursor
      delete document.body.dataset.cursor;
    }
  }

  window.setSymCursor = function setSymCursor(name) {
    if (VALID.indexOf(name) === -1) name = 'classic';
    _apply(name);
    try { localStorage.setItem(KEY, name); } catch (e) {}
    _markActive(name);
    // Same UX as the theme / season buttons: close the panel
    const panel = document.getElementById('theme-panel');
    if (panel) panel.hidden = true;
  };

  // ── Restore saved choice (default: classic) ──────────────
  let saved = 'classic';
  try { saved = localStorage.getItem(KEY) || 'classic'; } catch (e) {}
  if (VALID.indexOf(saved) === -1) saved = 'classic';

  // On standalone pages (games, asset-studio) there is no theme engine, so
  // mirror the saved palette onto <body> — this lets cursors.css pick the
  // right per-theme colour (terra / violet) there too. Guarded so it NEVER
  // overrides a theme already set by the main theme engine on index.html.
  try {
    if (!document.body.dataset.symTheme) {
      const savedTheme = localStorage.getItem('sym:theme');
      if (savedTheme) document.body.dataset.symTheme = savedTheme;
    }
  } catch (e) {}

  // This script is loaded with `defer`, so <body> is already parsed.
  _apply(saved);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { _markActive(saved); }, { once: true });
  } else {
    _markActive(saved);
  }
})();
