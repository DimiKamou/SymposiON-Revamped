/* Symposion house line-art icons (viewBox 100, stroke 1.4, currentColor)
   lifted from the site's ornaments.js GEN set + a few mode glyphs.
   Exposes window.SYM = { icon(name), meanderURL }  */
(function(){
  const S = (inner,vb)=>`<svg viewBox="${vb||'0 0 100 100'}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" role="img">${inner}</svg>`;
  const I = {
    laurel:   S(`<path d="M50,86 Q34,80 30,58 Q28,40 40,30"/><path d="M50,86 Q66,80 70,58 Q72,40 60,30"/><path d="M38,46 Q30,44 28,36 M42,58 Q34,58 32,50 M46,70 Q38,72 36,64" opacity="0.7"/><path d="M62,46 Q70,44 72,36 M58,58 Q66,58 68,50 M54,70 Q62,72 64,64" opacity="0.7"/><circle class="lit" cx="50" cy="30" r="3" stroke="none"/>`),
    amphora:  S(`<ellipse cx="50" cy="24" rx="9" ry="3"/><path d="M42,25 Q28,28 34,48"/><path d="M58,25 Q72,28 66,48"/><path d="M40,38 Q28,52 31,72 Q34,90 50,92 Q66,90 69,72 Q72,52 60,38"/><path d="M40,38 Q50,34 60,38" opacity="0.5"/><path d="M40,60 Q50,64 60,60" opacity="0.4"/>`),
    column:   S(`<path d="M34,28 Q34,24 50,24 Q66,24 66,28 L62,30 L38,30 Z"/><path d="M38,30 L40,84 M62,30 L60,84 M46,30 L46,84 M54,30 L54,84" opacity="0.6"/><path d="M34,84 L66,84 M30,90 L70,90"/>`),
    owl:      S(`<path d="M34,40 Q34,26 50,26 Q66,26 66,40 Q66,62 50,68 Q34,62 34,40 Z"/><circle cx="42" cy="42" r="7"/><circle cx="58" cy="42" r="7"/><circle class="lit" cx="42" cy="42" r="2.4" stroke="none"/><circle class="lit" cx="58" cy="42" r="2.4" stroke="none"/><path d="M47,50 L50,54 L53,50" class="acc"/><path d="M36,30 L40,36 M64,30 L60,36" opacity="0.6"/>`),
    lyre:     S(`<path d="M34,80 Q26,50 34,28 Q40,18 48,24"/><path d="M66,80 Q74,50 66,28 Q60,18 52,24"/><path d="M32,80 L68,80"/><path d="M42,30 L42,76 M50,28 L50,76 M58,30 L58,76" opacity="0.55"/>`),
    sun:      S(`<circle cx="50" cy="50" r="16"/><path d="M50,18 L50,28 M50,72 L50,82 M18,50 L28,50 M72,50 L82,50 M28,28 L35,35 M72,72 L65,65 M72,28 L65,35 M28,72 L35,65" class="lit"/><circle class="acc" cx="50" cy="50" r="6" stroke="none"/>`),
    krater:   S(`<ellipse cx="50" cy="30" rx="20" ry="6"/><path d="M30,30 Q24,52 34,64 M70,30 Q76,52 66,64"/><path d="M34,64 Q50,72 66,64 Q70,80 50,84 Q30,80 34,64 Z"/><path d="M30,30 Q14,32 20,50 Q24,42 32,42"/><path d="M70,30 Q86,32 80,50 Q76,42 68,42"/><circle class="lit" cx="50" cy="48" r="3" stroke="none"/>`),
    scroll:   S(`<path d="M26,28 Q20,28 20,36 Q20,44 26,44 L74,44 Q80,44 80,36 Q80,28 74,28 Z"/><path d="M26,28 L26,72 M74,28 L74,72"/><path d="M26,72 Q20,72 20,64 M74,72 Q80,72 80,64"/><path d="M34,36 L66,36 M34,52 L62,52 M34,60 L58,60" opacity="0.5"/>`),
    coin:     S(`<circle cx="50" cy="50" r="28"/><circle cx="50" cy="50" r="21" opacity="0.4"/><path d="M40,52 Q50,40 60,52 Q50,62 40,52 Z"/><circle class="lit" cx="50" cy="51" r="3.4" stroke="none"/>`),
    mosaic:   S(`<rect x="22" y="22" width="22" height="22" rx="2"/><rect x="56" y="22" width="22" height="22" rx="2" class="acc" stroke="none" opacity="0.85"/><rect x="22" y="56" width="22" height="22" rx="2" class="lit" stroke="none" opacity="0.85"/><rect x="56" y="56" width="22" height="22" rx="2"/><path d="M44,33 L56,33 M67,44 L67,56 M33,56 L33,44 M44,67 L56,67" opacity="0.5"/>`),
    stele:    S(`<path d="M34,90 L34,34 Q34,18 50,14 Q66,18 66,34 L66,90 Z"/><path d="M40,44 L60,44 M40,54 L60,54 M40,64 L56,64" opacity="0.5"/><path d="M30,90 L70,90"/>`),
    chisel:   S(`<path d="M58,18 L78,38 L46,70 L30,74 L34,58 Z"/><path d="M30,74 L34,58 L46,70 Z" class="lit" stroke="none"/><path d="M58,18 L78,38" opacity="0.5"/>`),
    theatre:  S(`<path d="M28,38 Q26,22 44,20 Q52,19 56,32 Q60,56 46,72 Q30,66 28,38 Z"/><path d="M34,38 Q38,34 44,38"/><circle class="lit" cx="37" cy="44" r="2.2" stroke="none"/><circle class="lit" cx="47" cy="42" r="2.2" stroke="none"/><path d="M34,54 Q42,64 52,54 Q44,58 34,54 Z" class="acc" stroke="currentColor"/>`),
    flame:    S(`<path d="M50,16 Q66,36 60,54 Q72,50 68,34 Q82,52 74,72 Q66,90 50,90 Q30,90 26,70 Q23,54 34,44 Q33,56 42,58 Q34,40 50,16 Z"/><path class="lit" d="M50,52 Q58,62 54,74 Q50,82 44,76 Q40,68 50,52 Z" stroke="none"/>`),
  };
  // running meander (Greek key) tile, width 24 — black mask, currentColor tints
  const m = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="13" viewBox="0 0 24 13"><rect x="0" y="0.4" width="24" height="0.9" fill="#000"/><path d="M2,11 V3 H14 V11 H7 V6 H11" fill="none" stroke="#000" stroke-width="1.4" stroke-linecap="square" stroke-linejoin="miter"/><rect x="0" y="11.4" width="24" height="0.9" fill="#000"/></svg>`;
  window.SYM = {
    icon:(n)=> I[n] || I.laurel,
    meanderURL:`url("data:image/svg+xml,${encodeURIComponent(m)}")`,
    meanderBG:(c)=>{ const p=`<svg xmlns='http://www.w3.org/2000/svg' width='24' height='13' viewBox='0 0 24 13'><path d='M2,11 V3 H14 V11 H7 V6 H11' fill='none' stroke='${c}' stroke-width='1.4' stroke-linecap='square' stroke-linejoin='miter'/></svg>`; return `url("data:image/svg+xml,${encodeURIComponent(p)}")`; },
  };
})();
