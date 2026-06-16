/* ════════════════════════════════════════════════════════════════════
   SymposiON · ornaments.js
   Reimagined ancient-Greek seasonal decorations, drawn in the house
   line-art vocabulary (viewBox 100, stroke 1.4, currentColor).
   Two tint channels:
     · main strokes  → currentColor (the active --sym-accent)
     · .acc fills    → secondary accent (--sym-accent2)
     · .lit fills    → primary accent (glow / ember / yolk)
   window.ORN exposes:  icon(name) · render helpers · friezeSVG() · sets
   ════════════════════════════════════════════════════════════════════ */
(function () {
  // wrap inner markup as a styled svg
  function S(inner, vb) {
    return `<svg viewBox="${vb || '0 0 100 100'}" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" role="img">${inner}</svg>`;
  }

  /* ──────────────────────────────────────────────────────────────────
     HALLOWEEN · Katabasis — the descent to the underworld
  ────────────────────────────────────────────────────────────────── */
  const HALLO = {
    // HERO — black-figure amphora carved as a jack-o'-lantern
    hero: S(`
      <ellipse cx="50" cy="22" rx="13" ry="5"/>
      <path d="M39,23 L42,31 Q50,35 58,31 L61,23"/>
      <path d="M44,28 Q24,30 31,56" /><path d="M56,28 Q76,30 69,56"/>
      <path d="M37,40 Q20,54 23,80 Q26,104 50,107 Q74,104 77,80 Q80,54 63,40"/>
      <path d="M37,40 Q50,35 63,40" opacity="0.5"/>
      <path d="M44,52 Q42,78 47,100 M56,52 Q58,78 53,100" opacity="0.3"/>
      <path class="lit" d="M38,66 L48,73 L38,76 Z" stroke="none"/>
      <path class="lit" d="M62,66 L52,73 L62,76 Z" stroke="none"/>
      <path class="lit" d="M47,78 L50,73 L53,78 Z" stroke="none"/>
      <path class="lit" d="M36,86 L43,83 L46,90 L50,83 L54,90 L57,83 L64,86 Q50,98 36,86 Z" stroke="none"/>
      <path d="M43,107 L40,116 L60,116 L57,107"/>`, '0 0 100 122'),
    icons: [
      ['amphora-o-lantern', S(`<ellipse cx="50" cy="22" rx="11" ry="4"/><path d="M40,23 Q26,26 32,48"/><path d="M60,23 Q74,26 68,48"/><path d="M38,36 Q24,50 27,72 Q30,90 50,92 Q70,90 73,72 Q76,50 62,36"/><path d="M38,36 Q50,32 62,36" opacity="0.5"/><path class="lit" d="M40,58 L48,64 L40,66Z" stroke="none"/><path class="lit" d="M60,58 L52,64 L60,66Z" stroke="none"/><path class="lit" d="M39,76 L45,73 L48,79 L52,73 L55,79 L61,76 Q50,86 39,76Z" stroke="none"/>`)],
      ['obol-of-charon', S(`<circle cx="50" cy="50" r="27"/><circle cx="50" cy="50" r="21" opacity="0.45"/><path d="M36,50 Q50,40 64,50 Q50,60 36,50 Z"/><circle class="lit" cx="50" cy="50" r="4" stroke="none"/><path d="M44,68 Q50,64 56,68" opacity="0.6"/>`)],
      ['asphodel', S(`<path d="M50,90 L50,42"/><path d="M50,70 Q36,64 32,50"/><path d="M50,60 Q64,55 68,42"/><path class="lit" d="M50,30 m-7,0 a7,7 0 1,0 14,0 a7,7 0 1,0 -14,0" stroke="none" opacity="0.9"/><path d="M50,23 L50,37 M43,30 L57,30 M45,25 L55,35 M55,25 L45,35"/><circle cx="40" cy="42" r="4"/><circle cx="60" cy="42" r="4"/>`)],
      ['pomegranate', S(`<path d="M50,28 Q73,36 71,62 Q67,88 50,90 Q33,88 29,62 Q27,36 50,28 Z"/><path d="M44,27 L45,18 L50,25 L55,18 L56,27" /><circle class="lit" cx="44" cy="56" r="2.4" stroke="none"/><circle class="lit" cx="56" cy="56" r="2.4" stroke="none"/><circle class="lit" cx="50" cy="66" r="2.4" stroke="none"/><circle class="lit" cx="50" cy="46" r="2.4" stroke="none"/>`)],
      ['skull-of-hades', S(`<path d="M34,52 Q34,30 50,30 Q66,30 66,52 Q66,60 60,64 L60,72 Q50,77 40,72 L40,64 Q34,60 34,52 Z"/><circle class="lit" cx="43" cy="52" r="4.5" stroke="none"/><circle class="lit" cx="57" cy="52" r="4.5" stroke="none"/><path d="M50,58 L47,66 L53,66 Z"/><path d="M43,72 L43,77 M50,73 L50,78 M57,72 L57,77"/><path d="M30,40 Q24,34 28,28 M70,40 Q76,34 72,28" opacity="0.6"/>`)],
      ['raven-of-night', S(`<path d="M26,58 Q42,46 56,50 Q72,54 78,42 Q74,60 60,64 L68,74 M56,50 L50,66 Q42,72 34,66"/><path d="M22,56 L28,57" /><circle class="lit" cx="70" cy="48" r="2" stroke="none"/>`)],
    ],
  };

  /* ──────────────────────────────────────────────────────────────────
     CHRISTMAS · Heliogennesis — the sun reborn (Greek winter customs)
  ────────────────────────────────────────────────────────────────── */
  const XMAS = {
    // HERO — a cypress-laurel topiary "tree" in a volute krater, crowned
    // by a Vergina star (the authentic Greek alternative to a fir tree)
    hero: S(`
      <path class="lit" d="M50,6 L53,16 L63,13 L57,22 L67,26 L56,28 L60,38 L50,31 L40,38 L44,28 L33,26 L43,22 L37,13 L47,16 Z" stroke="none"/>
      <path d="M50,40 L38,58 L46,58 L34,74 L44,74 L32,88 L68,88 L56,74 L66,74 L54,58 L62,58 Z"/>
      <path d="M44,52 Q50,48 56,52 M40,66 Q50,60 60,66 M37,80 Q50,73 63,80" opacity="0.45"/>
      <circle class="acc" cx="44" cy="60" r="2.4" stroke="none"/><circle class="acc" cx="58" cy="60" r="2.4" stroke="none"/><circle class="acc" cx="42" cy="80" r="2.4" stroke="none"/><circle class="acc" cx="58" cy="80" r="2.4" stroke="none"/><circle class="acc" cx="50" cy="70" r="2.4" stroke="none"/>
      <path d="M42,88 L40,96 L60,96 L58,88"/>
      <path d="M34,96 Q28,100 31,110 L69,110 Q72,100 66,96 Z"/>
      <path d="M31,104 Q50,100 69,104" opacity="0.5"/>
      <path d="M31,108 Q24,103 27,98 M69,108 Q76,103 73,98"/>`, '0 0 100 118'),
    icons: [
      ['karavaki', S(`<path d="M50,18 L50,52"/><path d="M50,24 L70,40 L50,40 Z" class="acc" stroke="none" opacity="0.85"/><path d="M50,24 L70,40 L50,40 Z"/><path d="M26,56 L74,56 L66,74 Q50,80 34,74 Z"/><path d="M26,56 Q50,62 74,56" opacity="0.5"/><circle class="lit" cx="38" cy="64" r="2" stroke="none"/><circle class="lit" cx="50" cy="66" r="2" stroke="none"/><circle class="lit" cx="62" cy="64" r="2" stroke="none"/><path d="M20,84 Q50,90 80,84" opacity="0.6"/>`)],
      ['vergina-star', S(`<circle cx="50" cy="50" r="9"/><g><path class="lit" d="M50,12 L54,40 L46,40 Z" stroke="none"/></g><path class="lit" d="M50,12 L54,40 L46,40Z M50,88 L46,60 L54,60Z M12,50 L40,46 L40,54Z M88,50 L60,54 L60,46Z M23,23 L44,40 L40,44Z M77,77 L56,60 L60,56Z M77,23 L60,40 L56,44Z M23,77 L44,60 L40,56Z" stroke="none"/>`)],
      ['krater-tree', S(`<path d="M50,16 L40,34 L46,34 L36,50 L44,50 L34,64 L66,64 L56,50 L64,50 L54,34 L60,34 Z"/><path class="lit" d="M50,8 L52,14 L58,13 L54,18 L60,21 L53,22 L50,16 L47,22 L40,21 L46,18 L42,13 L48,14Z" stroke="none"/><circle class="acc" cx="44" cy="46" r="2" stroke="none"/><circle class="acc" cx="56" cy="46" r="2" stroke="none"/><circle class="acc" cx="50" cy="58" r="2" stroke="none"/><path d="M40,64 L37,74 L63,74 L60,64 M37,74 Q31,78 34,86 L66,86 Q69,78 63,74"/><path d="M34,80 Q50,84 66,80" opacity="0.5"/>`)],
      ['lychnos', S(`<path d="M24,62 Q20,50 34,48 L66,48 Q80,50 74,62 Q70,70 50,70 Q30,70 24,62 Z"/><path d="M66,48 Q86,42 84,30"/><path class="lit" d="M84,30 Q88,24 84,18 Q80,24 84,30 Z" stroke="none"/><path d="M40,48 Q50,40 60,48" opacity="0.5"/><path d="M50,70 L50,80 M40,80 L60,80"/>`)],
      ['laurel-bauble', S(`<circle cx="50" cy="56" r="22"/><circle cx="50" cy="56" r="14" opacity="0.4"/><path d="M50,34 Q44,28 50,22 Q56,28 50,34"/><path d="M50,16 L50,22"/><circle class="acc" cx="34" cy="50" r="2.2" stroke="none"/><circle class="acc" cx="64" cy="64" r="2.2" stroke="none"/><circle class="acc" cx="58" cy="40" r="2.2" stroke="none"/>`)],
      ['pomegranate-gouri', S(`<path d="M50,30 Q72,38 70,62 Q66,86 50,88 Q34,86 30,62 Q28,38 50,30 Z"/><path d="M44,29 L45,20 L50,27 L55,20 L56,29"/><path class="lit" d="M42,64 L46,72 L38,72 Z" stroke="none"/><path class="lit" d="M58,64 L62,72 L54,72 Z" stroke="none"/><path class="lit" d="M50,68 L54,78 L46,78 Z" stroke="none"/>`)],
    ],
  };

  /* ──────────────────────────────────────────────────────────────────
     EASTER · Anastasi — spring, the Holy Light, red eggs
  ────────────────────────────────────────────────────────────────── */
  const EAST = {
    // HERO — a red meander egg cradled in olive & laurel, swallow above
    hero: S(`
      <path d="M22,30 Q34,18 42,24" /><path d="M30,24 L34,30 M38,22 L40,28" opacity="0.6"/>
      <path d="M78,30 Q66,18 58,24" /><path d="M70,24 L66,30 M62,22 L60,28" opacity="0.6"/>
      <path d="M28,40 Q40,28 50,30 Q60,28 72,40" opacity="0.5"/>
      <path d="M50,38 Q30,42 28,66 Q27,92 50,96 Q73,92 72,66 Q70,42 50,38 Z"/>
      <path d="M30,58 L70,58 M30,58 L34,54 L34,62 L38,54 L38,62 L42,54 L42,62 L46,54 L46,62 L50,54 L50,62 L54,54 L54,62 L58,54 L58,62 L62,54 L62,62 L66,54 L66,62 L70,58" class="lit" stroke-width="1.2"/>
      <path d="M30,72 L70,72" opacity="0.4"/>
      <path d="M26,98 Q40,104 50,102 Q60,104 74,98" opacity="0.5"/>
      <path d="M22,100 Q34,96 30,108 M78,100 Q66,96 70,108" class="acc"/>`, '0 0 100 118'),
    icons: [
      ['red-egg', S(`<path d="M50,22 Q28,28 26,56 Q25,84 50,88 Q75,84 74,56 Q72,28 50,22 Z" class="lit" stroke="currentColor"/><path d="M30,50 L34,46 L34,54 L38,46 L38,54 L42,46 L42,54 L46,46 L46,54 L50,46 L50,54 L54,46 L54,54 L58,46 L58,54 L62,46 L62,54 L66,46 L66,54 L70,50"/><path d="M28,62 Q50,66 72,62" opacity="0.4"/>`)],
      ['paschal-lamb', S(`<path d="M30,60 Q26,46 38,44 Q40,36 50,38 Q60,36 62,44 Q74,46 70,60 Q72,70 62,70 L60,80 M40,70 L38,80 M60,70 L62,80 M40,70 Q50,76 60,70"/><path d="M38,44 Q34,40 36,34" /><circle class="lit" cx="44" cy="52" r="1.8" stroke="none"/><path d="M40,82 L40,86 M62,82 L62,86" opacity="0.6"/><path d="M30,40 L24,36 L30,46" class="acc"/>`)],
      ['olive-sprout', S(`<path d="M50,90 L50,34 Q50,20 60,16"/><path class="acc" d="M50,60 Q34,58 30,44 Q44,42 50,56 Z" stroke="currentColor"/><path class="acc" d="M50,48 Q66,46 70,32 Q56,30 50,44 Z" stroke="currentColor"/><circle class="lit" cx="44" cy="70" r="3" stroke="none"/><circle class="lit" cx="56" cy="78" r="3" stroke="none"/>`)],
      ['swallow', S(`<path d="M16,42 Q40,32 50,46 Q60,32 84,42 Q66,46 56,56 L62,68 L50,58 L38,68 L44,56 Q34,46 16,42 Z"/><circle class="lit" cx="50" cy="48" r="1.8" stroke="none"/>`)],
      ['lambada', S(`<path d="M44,40 L44,86 L56,86 L56,40"/><path d="M40,86 L60,86" /><path d="M50,40 L50,30" /><path class="lit" d="M50,12 Q44,20 50,28 Q56,20 50,12 Z" stroke="none"/><path d="M50,18 Q47,23 50,27 Q53,23 50,18 Z"/><path d="M44,56 L56,56 M44,68 L56,68" opacity="0.4"/>`)],
      ['tsoureki', S(`<circle cx="50" cy="56" r="22"/><circle cx="50" cy="56" r="11" opacity="0.45"/><path d="M34,42 L40,50 M42,34 L48,42 M52,34 L58,42 M60,42 L66,50 M68,56 L60,60 M64,70 L56,68 M50,76 L50,68 M36,70 L44,68 M32,56 L40,60" opacity="0.6"/><circle class="lit" cx="50" cy="36" r="4" stroke="none"/>`)],
    ],
  };

  /* ──────────────────────────────────────────────────────────────────
     CARNIVAL · Dionysia — masks, the thyrsus, the vine
  ────────────────────────────────────────────────────────────────── */
  const CARN = {
    // HERO — comedy & tragedy masks crossed over a thyrsus, grapes & ivy
    hero: S(`
      <path d="M50,8 L50,112" opacity="0.55"/>
      <path class="acc" d="M50,10 Q44,16 46,22 Q50,18 54,22 Q56,16 50,10 Z" stroke="currentColor"/>
      <path d="M22,42 Q20,26 36,24 Q44,22 46,34 Q48,52 38,64 Q26,60 22,42 Z"/>
      <path d="M28,40 Q32,36 38,40" /><circle class="lit" cx="31" cy="46" r="2" stroke="none"/><circle class="lit" cx="40" cy="44" r="2" stroke="none"/>
      <path d="M30,56 Q34,60 40,56" />
      <path d="M78,42 Q80,26 64,24 Q56,22 54,34 Q52,52 62,64 Q74,60 78,42 Z"/>
      <path d="M62,40 Q66,44 72,40" /><circle class="lit" cx="60" cy="44" r="2" stroke="none"/><circle class="lit" cx="69" cy="46" r="2" stroke="none"/>
      <path d="M60,58 Q66,52 72,58" />
      <path d="M46,78 a4,4 0 1,0 8,0 a4,4 0 1,0 -8,0" class="acc" stroke="none"/>
      <circle class="acc" cx="44" cy="86" r="3.4" stroke="none"/><circle class="acc" cx="52" cy="88" r="3.4" stroke="none"/><circle class="acc" cx="48" cy="94" r="3.4" stroke="none"/><circle class="acc" cx="56" cy="96" r="3.4" stroke="none"/>
      <path d="M34,80 Q24,84 26,96 M66,80 Q76,84 74,96" opacity="0.6"/>`, '0 0 100 118'),
    icons: [
      ['comedy-mask', S(`<path d="M28,38 Q26,22 44,20 Q52,19 56,32 Q60,56 46,72 Q30,66 28,38 Z"/><path d="M34,38 Q38,34 44,38" /><circle class="lit" cx="37" cy="44" r="2.2" stroke="none"/><circle class="lit" cx="47" cy="42" r="2.2" stroke="none"/><path d="M34,54 Q42,64 52,54 Q44,58 34,54 Z" class="acc" stroke="currentColor"/>`)],
      ['tragedy-mask', S(`<path d="M72,38 Q74,22 56,20 Q48,19 44,32 Q40,56 54,72 Q70,66 72,38 Z"/><path d="M56,36 Q60,40 66,36" /><circle class="lit" cx="53" cy="42" r="2.2" stroke="none"/><circle class="lit" cx="63" cy="44" r="2.2" stroke="none"/><path d="M52,60 Q58,52 66,60 Q58,57 52,60 Z" class="acc" stroke="currentColor"/>`)],
      ['thyrsus', S(`<path d="M40,88 L60,24"/><path class="acc" d="M58,26 Q50,14 60,8 Q70,16 64,26 Q62,30 58,26 Z" stroke="currentColor"/><path d="M58,12 L60,20 M54,18 L62,24 M64,16 L58,22" opacity="0.6"/><path class="acc" d="M48,56 Q36,52 34,42 Q46,42 50,52 Z" stroke="currentColor"/><path class="acc" d="M54,68 Q66,66 70,56 Q58,54 52,64 Z" stroke="currentColor"/>`)],
      ['grapes', S(`<path d="M50,24 L50,32"/><path d="M44,28 Q40,22 46,18" class="acc"/><circle class="acc" cx="50" cy="40" r="6" stroke="none"/><circle class="acc" cx="40" cy="48" r="6" stroke="none"/><circle class="acc" cx="60" cy="48" r="6" stroke="none"/><circle class="acc" cx="45" cy="58" r="6" stroke="none"/><circle class="acc" cx="55" cy="58" r="6" stroke="none"/><circle class="acc" cx="50" cy="68" r="6" stroke="none"/>`)],
      ['lyre', S(`<path d="M34,80 Q26,50 34,28 Q40,18 48,24"/><path d="M66,80 Q74,50 66,28 Q60,18 52,24"/><path d="M32,80 L68,80"/><path d="M40,30 L40,76 M50,28 L50,76 M60,30 L60,76" opacity="0.55"/><path d="M30,34 L70,34" class="acc"/>`)],
      ['domino-mask', S(`<path d="M22,46 Q22,38 32,38 L44,38 Q50,34 56,38 L68,38 Q78,38 78,46 Q78,58 66,58 Q58,58 54,50 Q50,46 46,50 Q42,58 34,58 Q22,58 22,46 Z"/><circle class="lit" cx="34" cy="48" r="3" stroke="none"/><circle class="lit" cx="66" cy="48" r="3" stroke="none"/><path d="M28,34 L30,28 M50,30 L50,24 M72,34 L70,28" class="acc"/>`)],
    ],
  };

  /* ──────────────────────────────────────────────────────────────────
     GENERAL · no-season classical motifs (the default frame decor)
  ────────────────────────────────────────────────────────────────── */
  const GEN = {
    hero: S(`
      <ellipse cx="50" cy="30" rx="20" ry="6"/>
      <path d="M30,30 Q24,52 34,64 M70,30 Q76,52 66,64"/>
      <path d="M34,64 Q50,72 66,64 L66,64 Q70,80 50,84 Q30,80 34,64 Z"/>
      <path d="M30,30 Q14,32 20,50 Q24,42 32,42" /><path d="M70,30 Q86,32 80,50 Q76,42 68,42"/>
      <path d="M40,30 Q50,38 60,30" opacity="0.4"/>
      <path class="acc" d="M50,84 L50,98 M50,98 Q40,96 36,88 M50,98 Q60,96 64,88"/>
      <circle class="lit" cx="50" cy="48" r="3" stroke="none"/>
      <path d="M40,44 Q50,40 60,44 M40,54 Q50,50 60,54" opacity="0.45"/>`, '0 0 100 110'),
    icons: [
      ['laurel', S(`<path d="M50,86 Q34,80 30,58 Q28,40 40,30"/><path d="M50,86 Q66,80 70,58 Q72,40 60,30"/><path d="M38,46 Q30,44 28,36 M42,58 Q34,58 32,50 M46,70 Q38,72 36,64" opacity="0.7"/><path d="M62,46 Q70,44 72,36 M58,58 Q66,58 68,50 M54,70 Q62,72 64,64" opacity="0.7"/><circle class="lit" cx="50" cy="30" r="3" stroke="none"/>`)],
      ['amphora', S(`<ellipse cx="50" cy="24" rx="9" ry="3"/><path d="M42,25 Q28,28 34,48"/><path d="M58,25 Q72,28 66,48"/><path d="M40,38 Q28,52 31,72 Q34,90 50,92 Q66,90 69,72 Q72,52 60,38"/><path d="M40,38 Q50,34 60,38" opacity="0.5"/><path d="M40,60 Q50,64 60,60" opacity="0.4"/>`)],
      ['column', S(`<path d="M34,28 Q34,24 50,24 Q66,24 66,28 L62,30 L38,30 Z"/><path d="M38,30 L40,84 M62,30 L60,84 M46,30 L46,84 M54,30 L54,84" opacity="0.6"/><path d="M34,84 L66,84 M30,90 L70,90"/>`)],
      ['owl', S(`<path d="M34,40 Q34,26 50,26 Q66,26 66,40 Q66,62 50,68 Q34,62 34,40 Z"/><circle cx="42" cy="42" r="7"/><circle cx="58" cy="42" r="7"/><circle class="lit" cx="42" cy="42" r="2.4" stroke="none"/><circle class="lit" cx="58" cy="42" r="2.4" stroke="none"/><path d="M47,50 L50,54 L53,50" class="acc"/><path d="M36,30 L40,36 M64,30 L60,36" opacity="0.6"/>`)],
      ['lyre', S(`<path d="M34,80 Q26,50 34,28 Q40,18 48,24"/><path d="M66,80 Q74,50 66,28 Q60,18 52,24"/><path d="M32,80 L68,80"/><path d="M42,30 L42,76 M50,28 L50,76 M58,30 L58,76" opacity="0.55"/>`)],
      ['sun-disc', S(`<circle cx="50" cy="50" r="16"/><path d="M50,18 L50,28 M50,72 L50,82 M18,50 L28,50 M72,50 L82,50 M28,28 L35,35 M72,72 L65,65 M72,28 L65,35 M28,72 L35,65" class="lit"/><circle class="acc" cx="50" cy="50" r="6" stroke="none"/>`)],
    ],
  };

  const SEASON = { '': GEN, halloween: HALLO, christmas: XMAS, easter: EAST, carnival: CARN };
  const TITLES = {
    '':          ['Symposion', 'Gather at the krater', 'The table is set — pour the wine, light the lamps, and let the contest of wits begin.'],
    halloween:   ['Katabasis', 'Descent of souls', 'The veil thins over the asphodel meadow. Pay Charon his obol and the underworld opens.'],
    christmas:   ['Heliogennesis', 'The sun reborn', 'Greeks crown a krater-cypress with the Vergina star and set lit karavakia to sea.'],
    easter:      ['Anastasi', 'Spring & the Holy Light', 'Red eggs are cracked, the lambada is lit, and the swallow returns over olive groves.'],
    carnival:    ['Dionysia', 'Revel of masks', 'Comedy and tragedy take the stage; raise the thyrsus and follow the vine.'],
  };

  /* ── Greek-key & seasonal frieze motifs (tiling pattern) ─────────── */
  const MOTIF = {
    // classic running meander (Greek key) — tiles on width 24
    '':          { w: 24, h: 13, p: `<path d="M2,11 V3 H14 V11 H7 V6 H11" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="square" stroke-linejoin="miter"/>` },
    halloween:   { w: 20, h: 13, p: `<path d="M1,9 L6,3 L11,9 L16,3 L21,9" fill="none" stroke="currentColor" stroke-width="1.4"/><circle cx="10.5" cy="11" r="1" fill="currentColor"/>` },
    christmas:   { w: 22, h: 13, p: `<path d="M1,7 Q6,2 11,7 Q16,12 21,7" fill="none" stroke="currentColor" stroke-width="1.3"/><path d="M11,5 L11,2 M9,3.5 L13,3.5" stroke="currentColor" stroke-width="1.1"/>` },
    easter:      { w: 22, h: 13, p: `<path d="M1,8 Q6,3 11,8 Q16,13 21,8" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M6,6 Q4,3 7,2 M16,6 Q18,3 15,2" stroke="currentColor" stroke-width="1.1" fill="none"/>` },
    carnival:    { w: 18, h: 13, p: `<path d="M1,6.5 L5,1.5 L9,6.5 L5,11.5 Z M9,6.5 L13,1.5 L17,6.5 L13,11.5 Z" fill="none" stroke="currentColor" stroke-width="1.2"/>` },
  };

  function friezeMask(season) {
    const m = MOTIF[season] || MOTIF[''];
    const inner = m.p.replace(/currentColor/g, '#000');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${m.w}" height="${m.h}" viewBox="0 0 ${m.w} ${m.h}">`
      + `<rect x="0" y="0.4" width="${m.w}" height="0.9" fill="#000"/>`
      + inner
      + `<rect x="0" y="${m.h - 1.3}" width="${m.w}" height="0.9" fill="#000"/></svg>`;
    return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
  }
  // apply a frieze mask to a DOM element (background-color carries the tint)
  function applyFrieze(el, season) {
    if (!el) return;
    const u = friezeMask(season);
    el.style.webkitMaskImage = u; el.style.maskImage = u;
  }

  window.ORN = {
    S, friezeMask, applyFrieze, SEASON, TITLES,
    seasons: ['', 'halloween', 'christmas', 'easter', 'carnival'],
    heroFor: (s) => (SEASON[s] || GEN).hero,
    iconsFor: (s) => (SEASON[s] || GEN).icons,
  };
})();
