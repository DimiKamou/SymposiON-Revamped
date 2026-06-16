// ============================================================
//  SymposiON — SX Layout prefs + shared tile helpers
//  One place for the user-selectable subject-page layout:
//    density   : 'card' | 'list' | 'featured'
//    grouping  : 'grid' | 'sections' | 'chips'
//    favorites : 'heart' | 'strip' | 'chip'
//  Persisted in localStorage('sx-layout-prefs'); every change
//  fires a 'sx-layout-change' event so renderers can refresh.
//
//  Everything visual resolves to the live --sym-* / --tint theme
//  tokens, so all layouts re-skin with the front-page theme.
// ============================================================
(function () {
  'use strict';

  var KEY = 'sx-layout-prefs';
  var DEF = { density: 'card', grouping: 'chips', favorites: 'heart' };

  var DENSITIES  = ['card', 'list', 'featured'];
  var GROUPINGS  = ['grid', 'sections', 'chips'];
  var FAVMODES   = ['heart', 'strip', 'chip'];

  function _read() {
    try { return JSON.parse(localStorage.getItem(KEY) || '{}') || {}; }
    catch (e) { return {}; }
  }
  function _clamp(p) {
    return {
      density:   DENSITIES.indexOf(p.density)  !== -1 ? p.density   : DEF.density,
      grouping:  GROUPINGS.indexOf(p.grouping)  !== -1 ? p.grouping  : DEF.grouping,
      favorites: FAVMODES.indexOf(p.favorites) !== -1 ? p.favorites : DEF.favorites,
    };
  }

  var prefs = _clamp(Object.assign({}, DEF, _read()));

  window.SX_LAYOUT = {
    DEF: DEF,
    DENSITIES: DENSITIES,
    GROUPINGS: GROUPINGS,
    FAVMODES: FAVMODES,
    get: function () { return Object.assign({}, prefs); },
    set: function (patch) {
      prefs = _clamp(Object.assign({}, prefs, patch || {}));
      try { localStorage.setItem(KEY, JSON.stringify(prefs)); } catch (e) {}
      document.dispatchEvent(new CustomEvent('sx-layout-change', { detail: Object.assign({}, prefs) }));
      return Object.assign({}, prefs);
    },
  };

  // ── Shared markup helpers (used by every renderer) ──────────
  var HEART = '<svg viewBox="0 0 24 24" aria-hidden="true">'
    + '<path d="M12 21l-1.45-1.32C5.4 15.05 2 11.97 2 8.2 2 5.42 4.42 3 7.5 3'
    + 'c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.2'
    + 'c0 3.77-3.4 6.85-8.55 11.49L12 21z"/></svg>';

  // Favourite button — reuses the site favourites store (.fav-btn /
  // data-game-id / .fav-active) so _syncHearts & refreshAllHearts keep
  // it in sync. `id` is the canonical game id (tile.type).
  function favBtn(id) {
    var on = (typeof isFavorite === 'function' && isFavorite(id)) ? ' fav-active' : '';
    return '<button class="fav-btn sx-fav' + on + '" data-game-id="' + id + '" '
      + 'type="button" tabindex="-1" aria-label="favourite" '
      + 'onclick="event.stopPropagation();if(typeof toggleFavorite===\'function\')toggleFavorite(\'' + id + '\')">'
      + HEART + '</button>';
  }

  var MODE_LABEL = { solo: 'Solo', multi: 'Multiplayer', theory: 'Θεωρία' };
  function modeDot(mode, label) {
    var lbl = label || MODE_LABEL[mode] || mode;
    return '<span class="sx-mode sx-mode--' + mode + '">' + lbl + '</span>';
  }

  window.SX = {
    heartSVG: HEART,
    favBtn: favBtn,
    modeDot: modeDot,
    MODE_LABEL: MODE_LABEL,
  };
})();
