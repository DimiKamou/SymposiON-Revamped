/* Paideia line-icon set — emoji-free, stroke:currentColor, keyed by name & emoji. */
(function (root) {
  'use strict';
  var P = {
    temple:'<path d="M3 9l9-5 9 5"/><path d="M4 9h16"/><path d="M6 9v8M10 9v8M14 9v8M18 9v8"/><path d="M3 20h18"/>',
    bolt:'<path d="M13 2L5 13.5h5L9 22l9-12.5h-5L14 2Z"/>',
    hourglass:'<path d="M6 3h12M6 21h12"/><path d="M8 3v3.4l4 4 4-4V3"/><path d="M8 21v-3.4l4-4 4 4V21"/>',
    shuffle:'<path d="M16 4h4v4"/><path d="M4 20 20 4"/><path d="M16 20h4v-4"/><path d="M14.5 14.5 20 20"/><path d="M4 4l5 5"/>',
    spiral:'<path d="M12 12a2 2 0 1 0 2 2"/><path d="M14 14a4 4 0 1 0-4-4"/><path d="M10 10a6 6 0 1 0 6 6"/>',
    type:'<path d="M4 18 9 6l5 12"/><path d="M5.6 14h6.8"/><path d="M20 12.5v5.5"/><path d="M20 18a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z"/>',
    scroll:'<path d="M7 5h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H8"/><path d="M7 5a2 2 0 0 0-2 2 2 2 0 0 0 2 2h2"/><path d="M16 19a2 2 0 0 0 2-2"/><path d="M10 9h5M10 13h5"/>',
    person:'<circle cx="12" cy="8" r="3.3"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>',
    swords:'<path d="M6 4l12 12"/><path d="M18 4 6 16"/><path d="M4 16l4 4M20 16l-4 4"/>',
    anchor:'<circle cx="12" cy="5" r="2"/><path d="M12 7v13"/><path d="M5 13a7 7 0 0 0 14 0"/><path d="M5 13H3.2M19 13h1.8"/><path d="M8.5 10h7"/>',
    waves:'<path d="M3 8c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 13c2-2 4-2 6 0s4 2 6 0 4-2 6 0M3 18c2-2 4-2 6 0s4 2 6 0 4-2 6 0"/>',
    amphora:'<path d="M9 3h6"/><path d="M10 3c0 2.2 2 2.2 2 4.2M14 3c0 2.2-2 2.2-2 4.2"/><path d="M8.2 9a4 5 0 0 0 7.6 0"/><path d="M9 16.5h6l-1 4.5h-4Z"/>',
    note:'<path d="M14 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M16.2 3.6a2 2 0 0 1 2.8 2.8L13 12.4l-3.5 1 1-3.5Z"/>',
    /* chrome */
    user:'<circle cx="12" cy="8" r="3.3"/><path d="M5.5 20a6.5 6.5 0 0 1 13 0"/>',
    users:'<circle cx="9" cy="8" r="3.1"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 5.3a3 3 0 0 1 0 5.4"/><path d="M17.5 20a6 6 0 0 0-3-5.3"/>',
    cpu:'<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 3v3M15 3v3M9 18v3M15 18v3M3 9h3M3 15h3M18 9h3M18 15h3"/>',
    gamepad:'<rect x="3" y="8" width="18" height="9" rx="4.2"/><path d="M7.5 11v3M6 12.5h3"/><circle cx="15.5" cy="12" r="1"/><circle cx="18" cy="14" r="1"/>',
    lock:'<rect x="5" y="11" width="14" height="9" rx="1.6"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    scan:'<path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M20 16v2a2 2 0 0 1-2 2h-2"/><path d="M8 20H6a2 2 0 0 1-2-2v-2"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
    phone:'<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>',
    check:'<path d="M5 12.5l4.5 4.5L19 7"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>',
    edit:'<path d="M12 20h9"/><path d="M16.4 3.6a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.4-12.4Z"/>',
    'file-text':'<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9l-6-6Z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h8M8 9h1.5"/>',
    sparkles:'<path d="M12 3l1.5 4.6L18 9l-4.5 1.4L12 15l-1.5-4.6L6 9l4.5-1.4Z"/><path d="M18.5 14l.8 2.3 2.2.7-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.7Z"/>',
    flask:'<path d="M9 4v5.5L4.8 18A2 2 0 0 0 6.6 21h10.8a2 2 0 0 0 1.8-3L15 9.5V4"/><path d="M8 4h8M7.5 15h9"/>',
    star:'<path d="M12 3l2.5 6 6.5.5-5 4.2 1.6 6.3L12 16.8 6.4 20l1.6-6.3-5-4.2 6.5-.5Z"/>',
    target:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/>',
    map:'<path d="M9 4 3 6.5v13.5l6-2.5 6 2.5 6-2.5V3l-6 2.5L9 3Z"/><path d="M9 4v13.5M15 5.5V19"/>',
    sliders:'<path d="M4 7h10M18 7h2M4 17h2M10 17h10"/><circle cx="16" cy="7" r="2"/><circle cx="8" cy="17" r="2"/>',
    arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
    _fallback:'<rect x="6" y="6" width="12" height="12" rx="2" transform="rotate(45 12 12)"/>'
  };
  var E = {
    '🏛️':'temple','⚡':'bolt','⏳':'hourglass','⌛':'hourglass','🔀':'shuffle','🌀':'spiral',
    '🔤':'type','📜':'scroll','👤':'person','⚔️':'swords','⚓':'anchor','🌊':'waves','🏺':'amphora',
    '📝':'note','📊':'sliders','🔧':'flask','🎨':'sparkles','🚀':'bolt','🛡️':'swords','🗺️':'map',
    '⛏️':'target','📋':'file-text','🃏':'star','🗡️':'swords'
  };
  function svg(name, size, cls) {
    var s = size || 24;
    return '<svg class="p-ico ' + (cls||'') + '" viewBox="0 0 24 24" width="'+s+'" height="'+s+
      '" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      (P[name]||P._fallback) + '</svg>';
  }
  root.pIcon = function (name, size, cls) { return svg(name, size, cls); };
  root.pEmojiIcon = function (emoji, size, cls) { var k=(emoji||'').trim(); return svg(E[k]||(P[k]?k:'_fallback'), size, cls); };
})(window);
