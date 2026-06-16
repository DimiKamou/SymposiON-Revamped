/* ════════════════════════════════════════════════════════════════════
   SymposiON · Temple of the Muses — corners.js
   THE ACROTERION LIBRARY (Ἀκρωτήρια).
   Each entry is the INNER markup of a 100×100 line-art scene, drawn in the
   house idiom: fill:none, stroke:currentColor, stroke-width 1.4, round caps.
   They tint to the live --sym theme and render both as a cosmetic card
   preview and as the giant faint corner watermark behind every surface.

   window.CORNERS         — { sceneKey: '<inner svg markup>' }
   window.cornerSVG(key, extra) — full <svg> string ready to inject
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const C = {

    /* ═══════════════ SEASONAL ═══════════════ */

    parthenon: `
      <path d="M 4 86 Q 22 78 50 78 Q 78 78 96 86" stroke-opacity="0.5"/>
      <line x1="14" y1="78" x2="86" y2="78"/><line x1="16" y1="75" x2="84" y2="75"/><line x1="18" y1="72" x2="82" y2="72"/>
      <line x1="22" y1="72" x2="22" y2="40"/><line x1="24" y1="72" x2="24" y2="40"/><rect x="21" y="38" width="4" height="2"/>
      <line x1="30" y1="72" x2="30" y2="40"/><line x1="32" y1="72" x2="32" y2="40"/><rect x="29" y="38" width="4" height="2"/>
      <line x1="38" y1="72" x2="38" y2="40"/><line x1="40" y1="72" x2="40" y2="40"/><rect x="37" y="38" width="4" height="2"/>
      <line x1="46" y1="72" x2="46" y2="40"/><line x1="48" y1="72" x2="48" y2="40"/><rect x="45" y="38" width="4" height="2"/>
      <line x1="54" y1="72" x2="54" y2="40"/><line x1="56" y1="72" x2="56" y2="40"/><rect x="53" y="38" width="4" height="2"/>
      <line x1="62" y1="72" x2="62" y2="40"/><line x1="64" y1="72" x2="64" y2="40"/><rect x="61" y="38" width="4" height="2"/>
      <line x1="70" y1="72" x2="70" y2="40"/><line x1="72" y1="72" x2="72" y2="40"/><rect x="69" y="38" width="4" height="2"/>
      <line x1="78" y1="72" x2="78" y2="40"/><line x1="80" y1="72" x2="80" y2="40"/><rect x="77" y="38" width="4" height="2"/>
      <line x1="18" y1="38" x2="84" y2="38"/><line x1="18" y1="34" x2="84" y2="34"/><line x1="18" y1="30" x2="84" y2="30"/>
      <path d="M 16 30 L 50 14 L 86 30"/><circle cx="50" cy="12" r="1.5"/>`,

    gateOfHades: `
      <path d="M4,89 Q22,85 40,89 T76,89 T112,89" stroke-opacity="0.45"/>
      <path d="M4,94 Q22,90 40,94 T76,94" stroke-opacity="0.3"/>
      <path d="M22,84 L22,38"/><path d="M22,38 Q13,56 22,74 Q31,56 22,38 Z"/>
      <path d="M84,84 L84,48"/><path d="M84,48 Q77,62 84,76 Q91,62 84,48 Z" stroke-opacity="0.8"/>
      <path d="M40,82 L40,46 Q40,28 52,28 Q64,28 64,46 L64,82"/>
      <path d="M40,46 Q52,40 64,46" stroke-opacity="0.5"/>
      <line x1="46" y1="82" x2="46" y2="42" stroke-opacity="0.3"/><line x1="52" y1="82" x2="52" y2="40" stroke-opacity="0.3"/><line x1="58" y1="82" x2="58" y2="42" stroke-opacity="0.3"/>
      <rect x="49" y="23.5" width="6" height="4.5"/>
      <path d="M38,86 Q52,92 66,86 L62,90 Q52,93 42,90 Z"/>
      <line x1="55" y1="86" x2="60" y2="72"/>
      <path d="M49,86 Q48,77 51,75"/><circle cx="51" cy="73" r="2.2"/>`,

    karavaki: `
      <circle cx="70" cy="29" r="9"/>
      <path d="M70,13 L70,18 M70,40 L70,45 M54,29 L59,29 M81,29 L86,29 M58,17 L62,21 M58,41 L62,37 M82,17 L78,21 M82,41 L78,37" stroke-opacity="0.55"/>
      <path d="M4,86 Q20,82 36,86 T68,86 T100,86" stroke-opacity="0.45"/>
      <path d="M4,92 Q20,88 36,92 T68,92" stroke-opacity="0.3"/>
      <path d="M24,80 L60,80 L54,90 Q42,94 30,90 Z"/>
      <path d="M24,80 Q42,84 60,80" stroke-opacity="0.4"/>
      <line x1="42" y1="80" x2="42" y2="34"/>
      <path d="M42,38 L62,72 L42,72 Z" stroke-opacity="0.85"/>
      <path d="M42,44 L26,72 L42,72 Z" stroke-opacity="0.5"/>
      <path d="M42,34 L50,36 L42,39"/>
      <circle cx="34" cy="76" r="1.4" fill="currentColor" stroke="none"/><circle cx="42" cy="76" r="1.4" fill="currentColor" stroke="none"/><circle cx="50" cy="76" r="1.4" fill="currentColor" stroke="none"/>`,

    noelTree: `
      <path d="M8,86 Q50,82 92,86" stroke-opacity="0.4"/>
      <path d="M50,6 L52.5,13 L60,13 L54,17.5 L56,25 L50,20.5 L44,25 L46,17.5 L40,13 L47.5,13 Z"/>
      <path d="M50,18 L40,36 L60,36 Z"/>
      <path d="M50,32 L34,54 L66,54 Z"/>
      <path d="M50,48 L26,74 L74,74 Z"/>
      <path d="M46,74 L46,82 L54,82 L54,74"/>
      <circle cx="50" cy="29" r="1.5" fill="currentColor" stroke="none"/>
      <circle cx="44" cy="49" r="1.8" fill="currentColor" stroke="none"/>
      <circle cx="57" cy="47" r="1.8" fill="currentColor" stroke="none"/>
      <circle cx="39" cy="67" r="2" fill="currentColor" stroke="none"/>
      <circle cx="61" cy="69" r="2" fill="currentColor" stroke="none"/>
      <circle cx="50" cy="65" r="2" fill="currentColor" stroke="none"/>
      <rect x="20" y="78" width="13" height="8"/>
      <path d="M26.5,78 L26.5,86 M20,81.5 L33,81.5" stroke-opacity="0.6"/>
      <rect x="66" y="80" width="11" height="6"/>
      <path d="M71.5,80 L71.5,86 M66,83 L77,83" stroke-opacity="0.6"/>
      <path d="M14,22 l0,5 M11.5,24.5 l5,0 M12.3,22.8 l3.4,3.4 M15.7,22.8 l-3.4,3.4" stroke-opacity="0.4"/>
      <path d="M84,30 l0,4 M82,32 l4,0 M82.6,30.6 l2.8,2.8 M85.4,30.6 l-2.8,2.8" stroke-opacity="0.4"/>`,

    chapel: `
      <path d="M4,86 Q34,80 64,84 Q86,86 100,83" stroke-opacity="0.45"/>
      <path d="M42,84 L42,58 L62,58 L62,84"/>
      <path d="M42,58 Q52,44 62,58"/>
      <line x1="52" y1="38" x2="52" y2="44"/><line x1="49" y1="41" x2="55" y2="41"/>
      <path d="M48,84 L48,70 Q48,66 52,66 Q56,66 56,70 L56,84"/>
      <path d="M28,84 L28,50"/><path d="M28,50 Q21,66 28,80 Q35,66 28,50 Z"/>
      <circle cx="79" cy="62" r="9"/><line x1="79" y1="71" x2="79" y2="84"/>
      <path d="M74,60 Q79,56 84,60" stroke-opacity="0.4"/>
      <path d="M14,28 Q18,24.5 22,28 Q26,24.5 30,28" stroke-opacity="0.6"/>
      <path d="M30,19 Q33,16.5 36,19 Q39,16.5 42,19" stroke-opacity="0.45"/>
      <circle cx="76" cy="34" r="6"/>
      <path d="M76,24 L76,27 M76,41 L76,44 M66,34 L69,34 M83,34 L86,34 M69,27 L71,29 M81,39 L83,41" stroke-opacity="0.5"/>`,

    theatre: `
      <path d="M36,86 Q52,80 68,86" stroke-opacity="0.6"/>
      <path d="M16,86 Q52,46 88,86"/>
      <path d="M22,86 Q52,52 82,86" stroke-opacity="0.7"/>
      <path d="M28,86 Q52,58 76,86" stroke-opacity="0.55"/>
      <path d="M34,86 Q52,64 70,86" stroke-opacity="0.4"/>
      <line x1="52" y1="48" x2="52" y2="86" stroke-opacity="0.4"/>
      <line x1="40" y1="54" x2="30" y2="86" stroke-opacity="0.35"/>
      <line x1="64" y1="54" x2="74" y2="86" stroke-opacity="0.35"/>
      <path d="M34,22 Q30,38 42,42 Q50,38 48,22 Q41,18 34,22 Z"/>
      <circle cx="38" cy="28" r="1.6"/><circle cx="44" cy="28" r="1.6"/>
      <path d="M37,33 Q41,37 45,33" stroke-opacity="0.7"/>
      <path d="M54,22 Q52,38 60,42 Q72,38 68,22 Q61,18 54,22 Z"/>
      <circle cx="59" cy="28" r="1.6"/><circle cx="64" cy="28" r="1.6"/>
      <path d="M58,35 Q62,31 66,35" stroke-opacity="0.7"/>`,

    /* ═══════════════ GREEK MYTHOLOGY ═══════════════ */

    starryNight: `
      <circle cx="72" cy="24" r="11"/>
      <circle cx="68" cy="21" r="2" stroke-opacity="0.35"/><circle cx="75" cy="27" r="1.4" stroke-opacity="0.35"/><circle cx="74" cy="20" r="1" stroke-opacity="0.35"/>
      <path d="M2,84 L18,60 L28,71 L42,48 L54,67 L68,53 L82,73 L98,62" stroke-opacity="0.75"/>
      <path d="M2,90 Q28,80 52,84 Q78,90 98,82"/>
      <path d="M40,86 L40,68"/><path d="M40,68 Q35,77 40,87 Q45,77 40,68 Z"/>
      <circle cx="14" cy="20" r="1" fill="currentColor" stroke="none"/><circle cx="26" cy="30" r="0.8" fill="currentColor" stroke="none"/><circle cx="34" cy="16" r="0.9" fill="currentColor" stroke="none"/><circle cx="46" cy="26" r="0.7" fill="currentColor" stroke="none"/><circle cx="20" cy="40" r="0.7" fill="currentColor" stroke="none"/><circle cx="90" cy="40" r="0.9" fill="currentColor" stroke="none"/><circle cx="58" cy="16" r="0.8" fill="currentColor" stroke="none"/>
      <path d="M16,46 L7,49 M11.5,43.5 L11.5,51.5" stroke-opacity="0.4"/>`,

    cerberus: `
      <path d="M16,84 Q50,80 84,84" stroke-opacity="0.4"/>
      <path d="M38,82 Q34,64 44,58 Q50,55 56,58 Q66,64 62,82"/>
      <path d="M44,62 Q50,68 56,62" stroke-opacity="0.5"/>
      <line x1="45" y1="74" x2="44" y2="82"/><line x1="55" y1="74" x2="56" y2="82"/>
      <path d="M40,82 L48,82 M52,82 L60,82" stroke-opacity="0.6"/>
      <path d="M50,56 L50,52"/>
      <path d="M44,44 Q44,38 50,38 Q56,38 56,44 Q56,50 50,52 Q44,50 44,44 Z"/>
      <path d="M45,40 L43,34 L48,39 M55,40 L57,34 L52,39"/>
      <circle cx="47" cy="44" r="1" fill="currentColor" stroke="none"/><circle cx="53" cy="44" r="1" fill="currentColor" stroke="none"/>
      <path d="M48,48 L50,51 L52,48" stroke-opacity="0.7"/>
      <path d="M44,58 Q36,52 32,47"/>
      <path d="M26,47 Q26,41 32,41 Q37,42 37,48 Q36,52 30,52 Q26,51 26,47 Z"/>
      <path d="M28,43 L26,38 L31,42"/><circle cx="31" cy="46" r="0.9" fill="currentColor" stroke="none"/>
      <path d="M56,58 Q64,52 68,47"/>
      <path d="M63,47 Q63,41 69,41 Q74,42 74,48 Q73,52 67,52 Q63,51 63,47 Z"/>
      <path d="M72,43 L74,38 L69,42"/><circle cx="69" cy="46" r="0.9" fill="currentColor" stroke="none"/>
      <path d="M62,76 Q72,74 74,66 Q75,60 70,60 Q66,60 67,64"/>
      <path d="M67,64 L65,62 M67,64 L69,62" stroke-opacity="0.7"/>`,

    titanomachy: `
      <path d="M4,88 L26,56 L38,69 L52,42 L66,65 L80,52 L96,88" stroke-opacity="0.7"/>
      <path d="M58,10 L50,38 L58,38 L46,64"/>
      <path d="M80,16 L74,36 L80,36 L72,52" stroke-opacity="0.6"/>
      <circle cx="52" cy="36" r="2.6"/><path d="M52,38.6 L52,48"/>
      <path d="M52,41 L59,35"/><path d="M52,41 L47,46"/><path d="M52,48 L49,55 M52,48 L55,55"/>
      <circle cx="28" cy="70" r="2.4"/><path d="M28,72.4 L26,79"/><path d="M28,74 L22,73 M28,74 L33,76"/><path d="M26,79 L22,83 M26,79 L30,83"/>
      <circle cx="40" cy="26" r="3"/><circle cx="70" cy="22" r="2.3"/><circle cx="34" cy="46" r="2" stroke-opacity="0.55"/>`,

    centaurLyre: `
      <path d="M18,84 Q50,80 86,84" stroke-opacity="0.4"/>
      <path d="M26,72 Q26,58 40,56 L58,56 Q64,56 66,50"/>
      <path d="M30,74 Q46,80 60,72"/>
      <line x1="32" y1="72" x2="30" y2="84"/><line x1="40" y1="74" x2="40" y2="84"/><line x1="56" y1="73" x2="58" y2="84"/><line x1="62" y1="70" x2="64" y2="84"/>
      <path d="M26,60 Q19,64 22,76"/>
      <path d="M64,50 Q62,42 66,37"/><circle cx="67" cy="34" r="3"/>
      <path d="M65,44 Q72,44 77,48"/><path d="M65,47 Q71,50 76,53"/>
      <path d="M74,58 Q69,47 78,42 Q87,47 82,58"/><path d="M74,58 L82,58"/>
      <path d="M77,45 L77,57 M80,45 L80,57" stroke-opacity="0.6"/>`,

    medusa: `
      <circle cx="50" cy="55" r="15"/>
      <circle cx="44" cy="53" r="1.4" fill="currentColor" stroke="none"/><circle cx="56" cy="53" r="1.4" fill="currentColor" stroke="none"/>
      <path d="M50,57 L48,61 L52,61 Z"/>
      <path d="M44,65 Q50,68 56,65"/>
      <path d="M40,43 Q34,37 36,31 Q40,33 39,39" stroke-opacity="0.85"/>
      <path d="M50,40 Q50,31 46,27 Q44,32 48,37" stroke-opacity="0.85"/>
      <path d="M60,43 Q66,37 64,31 Q60,33 61,39" stroke-opacity="0.85"/>
      <path d="M36,51 Q28,49 26,43 Q31,43 33,48" stroke-opacity="0.7"/>
      <path d="M64,51 Q72,49 74,43 Q69,43 67,48" stroke-opacity="0.7"/>
      <path d="M38,63 Q30,65 28,71 Q34,69 40,67" stroke-opacity="0.7"/>
      <path d="M62,63 Q70,65 72,71 Q66,69 60,67" stroke-opacity="0.7"/>
      <path d="M50,70 Q50,79 54,83 Q56,77 52,73" stroke-opacity="0.7"/>`,

    pegasus: `
      <path d="M22,84 Q50,80 80,84" stroke-opacity="0.4"/>
      <path d="M28,68 Q28,56 42,55 L56,55"/>
      <path d="M28,70 Q44,77 58,68"/>
      <line x1="30" y1="68" x2="28" y2="82"/><line x1="40" y1="72" x2="40" y2="83"/><line x1="52" y1="70" x2="54" y2="83"/><line x1="58" y1="66" x2="62" y2="82"/>
      <path d="M56,55 Q63,49 64,42"/>
      <path d="M64,42 L73,38 L70,45 L63,46 Z"/>
      <path d="M65,40 L62,34 L67,37" stroke-opacity="0.6"/>
      <path d="M28,60 Q19,64 22,76"/>
      <path d="M40,55 Q44,38 58,33 Q53,47 48,55"/>
      <path d="M45,50 Q52,42 58,38" stroke-opacity="0.5"/>
      <path d="M42,52 Q50,46 55,43" stroke-opacity="0.4"/>`,

    trident: `
      <line x1="50" y1="30" x2="50" y2="80"/>
      <path d="M40,40 L40,26 M50,38 L50,22 M60,40 L60,26"/>
      <path d="M40,26 Q40,21 45,22 M60,26 Q60,21 55,22"/>
      <path d="M40,32 L60,32"/>
      <path d="M50,22 L47,17 L53,17 Z"/>
      <path d="M22,72 Q30,66 38,72 T54,72 T74,72" stroke-opacity="0.6"/>
      <path d="M22,80 Q32,74 42,80 T62,80" stroke-opacity="0.4"/>`,

    /* ═══════════════ HOMER'S EPICS ═══════════════ */

    trojanHorse: `
      <path d="M30,64 Q28,50 44,48 L62,48 Q70,48 70,58 L70,66"/>
      <path d="M30,66 L70,66"/>
      <circle cx="38" cy="74" r="6"/><circle cx="62" cy="74" r="6"/>
      <line x1="34" y1="66" x2="34" y2="70"/><line x1="66" y1="66" x2="66" y2="70"/>
      <path d="M44,48 Q42,36 50,30"/>
      <path d="M50,30 L61,26 L58,35 L50,36 Z"/>
      <path d="M50,30 L48,23 L53,26" stroke-opacity="0.7"/>
      <path d="M70,52 Q77,54 75,63"/>
      <path d="M38,70 L38,78 M34,74 L42,74" stroke-opacity="0.4"/>
      <path d="M62,70 L62,78 M58,74 L66,74" stroke-opacity="0.4"/>
      <line x1="40" y1="52" x2="40" y2="66" stroke-opacity="0.3"/><line x1="50" y1="50" x2="50" y2="66" stroke-opacity="0.3"/><line x1="60" y1="52" x2="60" y2="66" stroke-opacity="0.3"/>`,

    odysseusSirens: `
      <path d="M10,80 Q32,74 54,80 T98,80" stroke-opacity="0.45"/>
      <path d="M10,86 Q32,80 54,86 T98,86" stroke-opacity="0.3"/>
      <path d="M26,74 L64,74 L58,84 Q44,88 32,84 Z"/>
      <path d="M26,74 Q44,78 64,74" stroke-opacity="0.4"/>
      <line x1="44" y1="74" x2="44" y2="32"/>
      <path d="M44,36 L64,60 L44,60 Z" stroke-opacity="0.7"/>
      <path d="M44,42 L28,60 L44,60 Z" stroke-opacity="0.45"/>
      <circle cx="44" cy="66" r="2.4"/>
      <path d="M41,66 L47,66 M40,70 L48,70" stroke-opacity="0.6"/>
      <circle cx="82" cy="60" r="2.6"/>
      <path d="M82,62.6 Q77,69 84,74 Q89,68 82,62.6"/>
      <path d="M79,58 Q82,53 85,58" stroke-opacity="0.5"/>`,

    achillesShield: `
      <circle cx="50" cy="50" r="26"/>
      <circle cx="50" cy="50" r="19" stroke-opacity="0.6"/>
      <circle cx="50" cy="50" r="12" stroke-opacity="0.5"/>
      <circle cx="50" cy="50" r="4"/>
      <path d="M50,24 L50,30 M50,70 L50,76 M24,50 L30,50 M70,50 L76,50" stroke-opacity="0.5"/>
      <path d="M32,32 L36,36 M68,32 L64,36 M32,68 L36,64 M68,68 L64,64" stroke-opacity="0.35"/>
      <line x1="76" y1="20" x2="28" y2="82" stroke-opacity="0.4"/>
      <path d="M76,20 L71,22 L74,26" stroke-opacity="0.4"/>`,

    cyclops: `
      <path d="M20,82 Q50,78 80,82" stroke-opacity="0.4"/>
      <path d="M34,80 Q30,52 40,40 Q50,30 60,40 Q70,52 66,80"/>
      <path d="M40,40 Q50,46 60,40" stroke-opacity="0.4"/>
      <circle cx="50" cy="44" r="5"/><circle cx="50" cy="44" r="1.6" fill="currentColor" stroke="none"/>
      <path d="M43,38 Q50,35 57,38" stroke-opacity="0.6"/>
      <path d="M44,58 Q50,62 56,58" stroke-opacity="0.6"/>
      <path d="M40,68 L60,68" stroke-opacity="0.4"/>
      <path d="M78,30 L70,46" stroke-opacity="0.55"/><path d="M78,30 L73,29 L75,34" stroke-opacity="0.55"/>`,

    /* ═══════════════ ANCIENT GREEK LIFE ═══════════════ */

    vasePainter: `
      <path d="M14,84 Q50,80 86,84" stroke-opacity="0.4"/>
      <ellipse cx="58" cy="34" rx="7" ry="2.4"/>
      <path d="M51,35 Q41,42 47,60 Q49,72 58,74 Q67,72 69,60 Q75,42 65,35"/>
      <path d="M51,38 Q45,38 47,46"/><path d="M65,38 Q71,38 69,46"/>
      <path d="M48,56 Q58,60 68,56" stroke-opacity="0.5"/>
      <path d="M52,50 Q58,53 64,50" stroke-opacity="0.35"/>
      <path d="M50,74 L48,82 L68,82 L66,74"/>
      <circle cx="24" cy="42" r="3.6"/>
      <path d="M24,45.6 L25,60"/>
      <path d="M25,60 L19,65 L19,72"/><path d="M25,60 L31,63"/>
      <path d="M16,72 L24,72 M17,72 L17,80 M23,72 L23,80"/>
      <path d="M25,50 Q37,47 45,50"/><line x1="45" y1="50" x2="49" y2="48"/>`,

    ekklesia: `
      <path d="M8,82 Q50,79 92,82" stroke-opacity="0.4"/>
      <path d="M60,74 L60,62 L84,62 L84,74"/>
      <path d="M56,74 L88,74 L88,78 L56,78 Z" stroke-opacity="0.7"/>
      <path d="M60,68 L84,68" stroke-opacity="0.35"/>
      <circle cx="72" cy="50" r="3"/><path d="M72,53 L72,62"/>
      <path d="M72,55 L79,49"/><path d="M72,56 L66,60"/>
      <circle cx="14" cy="64" r="2.4"/><path d="M14,66.4 L14,76"/><path d="M14,69 L9,63"/><path d="M14,69 L18,73"/>
      <circle cx="26" cy="66" r="2.4"/><path d="M26,68.4 L26,77"/><path d="M26,70 L31,65"/><path d="M26,71 L22,75"/>
      <circle cx="38" cy="64" r="2.4"/><path d="M38,66.4 L38,76"/><path d="M38,69 L33,72"/><path d="M38,68 L43,64"/>
      <circle cx="20" cy="54" r="1.8" stroke-opacity="0.6"/><path d="M20,55.8 L20,62" stroke-opacity="0.6"/>
      <circle cx="34" cy="53" r="1.8" stroke-opacity="0.6"/><path d="M34,54.8 L34,61" stroke-opacity="0.6"/>
      <path d="M30,44 L34,47 L30,50" stroke-opacity="0.4"/><path d="M58,42 L54,45 L58,48" stroke-opacity="0.4"/>`,

    discobolus: `
      <path d="M18,82 Q50,78 82,82" stroke-opacity="0.4"/>
      <circle cx="52" cy="28" r="4"/>
      <path d="M52,32 Q51,42 45,49"/>
      <path d="M51,36 Q62,38 70,32"/>
      <circle cx="74" cy="30" r="5"/><path d="M70,32 L77,27" stroke-opacity="0.4"/>
      <path d="M50,38 Q42,42 38,51"/>
      <path d="M45,49 L40,66 L33,77"/>
      <path d="M45,49 L53,60 L51,76"/>
      <path d="M40,66 L36,68 M33,77 L38,78" stroke-opacity="0.5"/>`,

    trireme: `
      <path d="M10,78 Q30,72 50,78 T90,78" stroke-opacity="0.45"/>
      <path d="M16,66 L78,66 Q74,76 60,78 L30,78 Q20,74 16,66 Z"/>
      <path d="M16,66 L7,70 L16,72"/>
      <line x1="24" y1="68" x2="20" y2="80" stroke-opacity="0.5"/><line x1="32" y1="68" x2="28" y2="80" stroke-opacity="0.5"/><line x1="40" y1="68" x2="36" y2="80" stroke-opacity="0.5"/><line x1="48" y1="68" x2="44" y2="80" stroke-opacity="0.5"/><line x1="56" y1="68" x2="52" y2="80" stroke-opacity="0.5"/><line x1="64" y1="68" x2="60" y2="80" stroke-opacity="0.5"/>
      <line x1="48" y1="66" x2="48" y2="34"/>
      <path d="M30,38 L66,38 L66,56 L30,56 Z" stroke-opacity="0.6"/>
      <line x1="48" y1="38" x2="48" y2="56" stroke-opacity="0.3"/>
      <circle cx="23" cy="62" r="2"/><circle cx="23" cy="62" r="0.8" fill="currentColor" stroke="none"/>`,

    philosopher: `
      <path d="M28,78 Q50,74 70,78" stroke-opacity="0.4"/>
      <line x1="72" y1="34" x2="72" y2="74"/><line x1="76" y1="34" x2="76" y2="74"/>
      <rect x="69" y="30" width="10" height="3"/><rect x="68" y="74" width="12" height="3"/>
      <path d="M70,34 L78,34" stroke-opacity="0.4"/>
      <circle cx="40" cy="36" r="5"/>
      <path d="M40,41 Q34,46 36,60"/>
      <path d="M40,45 Q48,46 50,55"/>
      <path d="M48,53 L59,53 M48,57 L59,57"/><circle cx="48" cy="55" r="2"/><circle cx="59" cy="55" r="2"/>
      <path d="M36,60 L52,60 L52,64 L40,64"/>
      <line x1="37" y1="64" x2="35" y2="74"/><line x1="50" y1="64" x2="52" y2="74"/>`,

    /* ═══════════════ BYZANTIUM ═══════════════ */

    hagiaSophia: `
      <path d="M10,82 Q50,79 90,82" stroke-opacity="0.4"/>
      <path d="M24,80 L24,56 L76,56 L76,80"/>
      <path d="M24,56 Q24,44 33,44 Q42,44 42,56" stroke-opacity="0.85"/>
      <path d="M58,56 Q58,44 67,44 Q76,44 76,56" stroke-opacity="0.85"/>
      <path d="M34,44 Q34,24 50,24 Q66,24 66,44"/>
      <path d="M34,44 L66,44" stroke-opacity="0.5"/>
      <line x1="50" y1="24" x2="50" y2="18"/><path d="M47,21 L53,21" stroke-opacity="0.7"/>
      <line x1="42" y1="40" x2="42" y2="44" stroke-opacity="0.4"/><line x1="50" y1="38" x2="50" y2="44" stroke-opacity="0.4"/><line x1="58" y1="40" x2="58" y2="44" stroke-opacity="0.4"/>
      <path d="M32,80 L32,66 Q32,60 38,60 Q44,60 44,66 L44,80" stroke-opacity="0.5"/>
      <path d="M56,80 L56,66 Q56,60 62,60 Q68,60 68,66 L68,80" stroke-opacity="0.5"/>
      <path d="M29,54 L37,54 M63,54 L71,54" stroke-opacity="0.4"/>`,

    doubleEagle: `
      <path d="M50,30 L50,72"/>
      <path d="M50,36 Q38,30 30,34 Q40,38 46,42 Q34,40 26,46 Q40,46 48,48 Q36,50 30,58 Q42,52 50,54"/>
      <path d="M50,36 Q62,30 70,34 Q60,38 54,42 Q66,40 74,46 Q60,46 52,48 Q64,50 70,58 Q58,52 50,54"/>
      <circle cx="42" cy="26" r="4"/><path d="M39,23 L42,26 M45,23 L42,26 M40,21 L42,23 L44,21" stroke-opacity="0.7"/>
      <path d="M42,30 L40,33 L44,33 Z"/>
      <circle cx="58" cy="26" r="4"/><path d="M55,23 L58,26 M61,23 L58,26 M56,21 L58,23 L60,21" stroke-opacity="0.7"/>
      <path d="M58,30 L56,33 L60,33 Z"/>
      <path d="M40,62 L40,72 L46,72 M60,62 L60,72 L54,72" stroke-opacity="0.6"/>
      <path d="M44,72 L56,72 L53,78 L47,78 Z"/>`,

    christPantocrator: `
      <path d="M50,18 L72,30 L72,58 Q72,74 50,84 Q28,74 28,58 L28,30 Z"/>
      <circle cx="50" cy="42" r="13"/>
      <path d="M50,29 L50,55 M37,42 L63,42" stroke-opacity="0.45"/>
      <circle cx="45" cy="40" r="1" fill="currentColor" stroke="none"/><circle cx="55" cy="40" r="1" fill="currentColor" stroke="none"/>
      <path d="M44,47 Q50,50 56,47" stroke-opacity="0.6"/>
      <line x1="50" y1="50" x2="50" y2="46" stroke-opacity="0.5"/>
      <path d="M40,60 L60,60 M40,66 L60,66 M40,72 L56,72" stroke-opacity="0.4"/>
      <path d="M34,24 L34,20 L38,20 M66,24 L66,20 L62,20" stroke-opacity="0.5"/>`,

    /* ═══════════════ MODERN GREEK HISTORY ═══════════════ */

    // 1821 · the banner of the revolution, laurel & cross.
    revolution1821: `
      <line x1="30" y1="20" x2="30" y2="84"/>
      <path d="M30,24 L70,24 L70,48 L30,48"/>
      <path d="M30,30 L70,30 M30,36 L70,36 M30,42 L70,42" stroke-opacity="0.35"/>
      <line x1="44" y1="24" x2="44" y2="20" stroke-opacity="0.6"/><line x1="40" y1="22" x2="48" y2="22" stroke-opacity="0.6"/>
      <path d="M30,20 L26,16 L30,14" stroke-opacity="0.6"/>
      <path d="M40,70 Q50,60 60,70" stroke-opacity="0.7"/>
      <path d="M40,70 Q38,66 41,64 M44,73 Q42,69 45,67 M50,74 Q48,70 51,68 M56,73 Q54,69 57,67 M60,70 Q58,66 61,64" stroke-opacity="0.6"/>
      <path d="M50,84 L50,76"/>`,

    // The blue-and-white ensign of the Hellenic Republic.
    hellenicFlag: `
      <line x1="22" y1="18" x2="22" y2="84"/>
      <rect x="22" y="24" width="56" height="40"/>
      <path d="M22,29 L78,29 M22,34 L78,34 M22,39 L78,39 M22,44 L78,44 M22,49 L78,49 M22,54 L78,54 M22,59 L78,59" stroke-opacity="0.3"/>
      <rect x="22" y="24" width="20" height="20"/>
      <line x1="32" y1="24" x2="32" y2="44"/><line x1="22" y1="34" x2="42" y2="34"/>
      <circle cx="22" cy="18" r="1.6"/>`,

    // The Tomb of the Unknown Soldier — the evzone on guard.
    evzone: `
      <path d="M30,84 Q50,80 70,84" stroke-opacity="0.4"/>
      <circle cx="50" cy="26" r="4.5"/>
      <path d="M46,24 Q44,18 50,16 Q56,18 54,24"/>
      <path d="M54,20 Q60,18 60,24" stroke-opacity="0.6"/>
      <line x1="50" y1="30.5" x2="50" y2="44"/>
      <path d="M50,33 L40,38 L40,30 L37,30"/>
      <path d="M50,34 L60,40"/>
      <path d="M44,44 L42,62 L40,72"/><path d="M56,44 L58,62 L60,72"/>
      <path d="M42,72 L38,76 L42,76 M58,72 L62,76 L58,76"/>
      <path d="M42,52 Q50,56 58,52" stroke-opacity="0.45"/>
      <line x1="37" y1="30" x2="33" y2="22" stroke-opacity="0.6"/>`,
  };

  /* full <svg> wrapper, matching the house attrs */
  function cornerSVG(key, extra) {
    const inner = C[key] || C.parthenon;
    return '<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.4" ' +
           'stroke-linecap="round" stroke-linejoin="round" ' + (extra || '') + '>' + inner + '</svg>';
  }

  window.CORNERS = C;
  window.cornerSVG = cornerSVG;

  // ── MAIN-SCREEN WATERMARK ───────────────────────────────────────────
  // Paint the equipped Acroteria into the home-screen corner layer. Reads the
  // live progression (equipped.corner = LEFT, equipped.cornerRight = RIGHT);
  // re-tints with the theme for free via currentColor. No-op if the layer or
  // progression isn't present yet.
  function _acroScene(id) {
    if (!id || typeof id !== 'string') return null;
    const scene = id.indexOf('cor-') === 0 ? id.slice(4) : id;
    return C[scene] ? scene : null;
  }
  function renderAcroteria() {
    // The hero ornament(s) ARE the Acroteria: the prominent bottom-right scene
    // (default Parthenon, so it always appears) + an optional mirrored bottom-left.
    // Equipping Right/Left in the Temple swaps each side live.
    const hr = document.getElementById('acro-hero-right');
    const hl = document.getElementById('acro-hero-left');
    if (!hr && !hl) return;
    let eq = {};
    try { if (typeof getProgression === 'function') eq = (getProgression() || {}).equipped || {}; } catch (e) {}
    const sR = _acroScene(eq.cornerRight) || 'parthenon';  // right: founding mark by default
    const sL = _acroScene(eq.corner);                      // left: only when equipped
    if (hr) hr.innerHTML = sR ? cornerSVG(sR) : '';
    if (hl) hl.innerHTML = sL ? cornerSVG(sL) : '';
  }
  window.renderAcroteria = renderAcroteria;
  document.addEventListener('DOMContentLoaded', renderAcroteria);
})();
