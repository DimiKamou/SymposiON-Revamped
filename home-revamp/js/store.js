/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · STORE
   Tiny localStorage layer for prototype persistence: favorites, custom
   names, list order, and arbitrary prefs. All namespaced sym_revamp_*.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const NS = 'sym_revamp_';
  function get(key, def) {
    try { const v = localStorage.getItem(NS + key); return v == null ? def : JSON.parse(v); }
    catch (_) { return def; }
  }
  function set(key, val) {
    try { localStorage.setItem(NS + key, JSON.stringify(val)); } catch (_) {}
    // notify same-tab listeners (cross-tab uses the native 'storage' event)
    try { window.dispatchEvent(new CustomEvent('sym-store', { detail: { key: key, val: val } })); } catch (_) {}
  }

  // favorites — a set of ids
  function favs() { return get('favorites', []); }
  function isFav(id) { return favs().indexOf(id) >= 0; }
  function toggleFav(id) {
    const f = favs(); const i = f.indexOf(id);
    if (i >= 0) f.splice(i, 1); else f.unshift(id);
    set('favorites', f); return i < 0;
  }

  // editable names — keyed
  function name(key, def) { const n = get('names', {}); return (n && n[key] != null) ? n[key] : def; }
  function setName(key, val) { const n = get('names', {}); n[key] = val; set('names', n); }

  // list order — array of ids
  function order(listId, def) {
    const o = get('order', {}); const saved = o && o[listId];
    if (!saved) return def.slice();
    // keep saved order but append any new ids + drop missing
    const inSaved = saved.filter(id => def.indexOf(id) >= 0);
    const extra = def.filter(id => inSaved.indexOf(id) < 0);
    return inSaved.concat(extra);
  }
  function setOrder(listId, arr) { const o = get('order', {}); o[listId] = arr; set('order', o); }

  window.SymStore = { get, set, favs, isFav, toggleFav, name, setName, order, setOrder };
})();
