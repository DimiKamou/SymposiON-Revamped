/* =============================================================================
 * SymFlappy — "while you wait" mini-game slot manager
 * -----------------------------------------------------------------------------
 * A tiny manager around the global <flappy-waiting-game> custom element
 * (registered eagerly by games/flappy/flappy-waiting-game.js, exposed as
 * window.FlappyWaiting).
 *
 * It owns a SINGLE shared collapsible card + a SINGLE game instance and moves
 * that one card between whichever multiplayer waiting screen is currently
 * active. Only one rAF/AudioContext loop ever runs; leaving a waiting screen
 * detaches the card from the DOM so its loop stops.
 *
 *   SymFlappy.mount(slotEl)  → build (once) + append the card into slotEl,
 *                              embed the game (once), resume it. Expanded by
 *                              default; collapse pauses, expand resumes.
 *   SymFlappy.unmount()      → pause the game + detach the card from the DOM.
 *
 * Defensive: if window.FlappyWaiting is missing, every method is a safe no-op.
 * The game itself is Shadow-DOM isolated, so only the outer card needs styling
 * (kept theme-neutral / dark / unobtrusive).
 * ========================================================================== */
(function () {
  "use strict";
  if (window.SymFlappy) return; // already loaded

  var card = null;   // the collapsible <div> card (header + body)
  var body = null;   // inner container the game is embedded into
  var game = null;   // the <flappy-waiting-game> element (the single instance)
  var collapsed = false;

  function _available() {
    return !!(window.FlappyWaiting && typeof window.FlappyWaiting.embed === "function");
  }

  // Bilingual label helper: matches the codebase convention (siteLang === 'en').
  function _t(gr, en) {
    return (typeof window.siteLang !== "undefined" && window.siteLang === "en") ? en : gr;
  }

  function _build() {
    if (card) return;

    card = document.createElement("div");
    card.className = "sym-flappy-card";

    var header = document.createElement("div");
    header.className = "sym-flappy-head";

    var titleEl = document.createElement("span");
    titleEl.className = "sym-flappy-title";
    titleEl.textContent = "🐤 " + _t("Όσο περιμένεις…", "While you wait…");

    var toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.className = "sym-flappy-toggle";
    toggleBtn.setAttribute("aria-label", _t("Σύμπτυξη/Ανάπτυξη", "Collapse/Expand"));
    toggleBtn.textContent = "▾";
    toggleBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      _setCollapsed(!collapsed);
    });
    // Let the whole header act as a collapse/expand affordance.
    header.addEventListener("click", function () { _setCollapsed(!collapsed); });

    header.appendChild(titleEl);
    header.appendChild(toggleBtn);

    body = document.createElement("div");
    body.className = "sym-flappy-body";

    card.appendChild(header);
    card.appendChild(body);

    card._toggleBtn = toggleBtn;
  }

  function _setCollapsed(next) {
    collapsed = !!next;
    if (!card) return;
    card.classList.toggle("is-collapsed", collapsed);
    if (card._toggleBtn) card._toggleBtn.textContent = collapsed ? "▸" : "▾";
    if (!game) return;
    if (collapsed) {
      try { game.pause(); } catch (_) {}
    } else {
      try { game.resume(); } catch (_) {}
    }
  }

  var SymFlappy = {
    /**
     * Mount the shared card into slotEl and start (or resume) the game.
     * @param {Element} slotEl  container the card is appended into
     * @param {Object}  [opts]  reserved for future options
     */
    mount: function (slotEl, opts) {
      if (!slotEl || !_available()) return;
      _build();

      // Follow whichever waiting screen is active: move the one card here.
      if (card.parentNode !== slotEl) slotEl.appendChild(card);

      // Embed the game exactly once; reuse the element across mounts.
      if (!game) {
        game = window.FlappyWaiting.embed(body);
      } else if (game.parentNode !== body) {
        body.appendChild(game);
      }

      // Default to expanded; honour an existing collapsed state otherwise.
      _setCollapsed(collapsed);
      if (!collapsed && game) { try { game.resume(); } catch (_) {} }
    },

    /**
     * Pause the game and detach the card from the DOM so no loop keeps running.
     * The instance is preserved for a fast re-mount.
     */
    unmount: function () {
      if (game) { try { game.pause(); } catch (_) {} }
      if (card && card.parentNode) card.parentNode.removeChild(card);
    }
  };

  window.SymFlappy = SymFlappy;
})();
