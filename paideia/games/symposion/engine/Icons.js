/* ════════════════════════════════════════════════════════════════════
   Συμπόσιον — Icon library
   Line-art SVGs (viewBox 0 0 100 100, currentColor stroke) for the
   god-animal player tokens and the thematic tile / event glyphs.
   Exposed as SYM_ICONS.<name> → returns an <svg> string.
   ════════════════════════════════════════════════════════════════════ */
(function (root) {
  // helper: wrap inner markup in a styled svg
  const S = (inner, opts) => {
    const o = opts || {};
    const sw = o.sw || 5;
    const fill = o.fill || 'none';
    return `<svg viewBox="0 0 100 100" fill="${fill}" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${inner}</svg>`;
  };

  const ICONS = {

    /* ─── God-animal tokens ─────────────────────────────────────── */

    owl: S(`
      <path d="M50 24 C30 24 24 42 26 58 C28 76 38 86 50 86 C62 86 72 76 74 58 C76 42 70 24 50 24 Z"/>
      <path d="M33 28 L38 16 M67 28 L62 16"/>
      <circle cx="40" cy="48" r="8"/><circle cx="60" cy="48" r="8"/>
      <circle cx="40" cy="48" r="1.5" fill="currentColor"/><circle cx="60" cy="48" r="1.5" fill="currentColor"/>
      <path d="M50 54 L45 62 L50 64 L55 62 Z" fill="currentColor" stroke="none"/>
      <path d="M40 70 Q50 76 60 70"/>
    `),

    eagle: S(`
      <path d="M40 84 C33 62 33 44 46 34 C52 29 61 29 66 35 L88 38 L70 48 L63 45 C60 60 57 72 53 84"/>
      <circle cx="55" cy="41" r="2.6" fill="currentColor" stroke="none"/>
      <path d="M70 48 L62 50"/>
      <path d="M44 50 C40 58 39 68 41 78"/>
    `, { sw: 4.5 }),

    dolphin: S(`
      <path d="M14 76 C34 36 60 20 88 26 C76 30 68 38 64 50 C60 61 47 71 30 73"/>
      <path d="M30 73 C44 71 56 62 62 52 C68 56 76 60 84 68 C74 66 66 66 60 56"/>
      <path d="M50 27 L57 13 L61 30"/>
      <circle cx="79" cy="31" r="2.2" fill="currentColor" stroke="none"/>
      <path d="M14 76 L6 69 M14 76 L9 85"/>
    `, { sw: 4.5 }),

    stag: S(`
      <path d="M42 86 C36 70 36 56 44 50 C40 44 40 36 46 34 C52 32 58 36 56 44 C64 50 64 70 58 86"/>
      <circle cx="50" cy="40" r="1.8" fill="currentColor" stroke="none"/>
      <path d="M46 34 C44 26 40 22 34 22 M44 28 L36 26 M42 24 L38 18"/>
      <path d="M54 34 C56 26 60 22 66 22 M56 28 L64 26 M58 24 L62 18"/>
      <path d="M46 50 L54 50"/>
    `),

    horse: S(`
      <path d="M34 86 C30 70 30 56 40 50 C34 46 30 40 34 30 C38 20 50 16 58 22 C54 24 52 28 54 30 C62 30 70 38 70 52 C70 66 66 78 64 86"/>
      <path d="M34 30 L28 28 L33 34"/>
      <circle cx="46" cy="34" r="1.8" fill="currentColor" stroke="none"/>
      <path d="M44 24 C48 26 52 30 52 30"/>
    `),

    serpent: S(`
      <path d="M50 14 L50 88"/>
      <path d="M50 20 C36 24 36 34 50 38 C64 42 64 52 50 56 C36 60 36 70 50 74"/>
      <path d="M50 20 C56 18 62 20 62 16 C58 14 52 16 50 18"/>
      <circle cx="59" cy="17" r="1.6" fill="currentColor" stroke="none"/>
    `),

    peacock: S(`
      <path d="M40 84 C34 66 35 48 46 40"/>
      <circle cx="50" cy="34" r="5.5"/>
      <path d="M50 28 L50 20 M46 29 L42 22 M54 29 L58 22"/>
      <path d="M55 34 L62 33"/>
      <path d="M47 44 C56 34 68 30 82 32"/><circle cx="85" cy="32" r="4"/>
      <path d="M47 50 C60 46 74 48 86 54"/><circle cx="88" cy="55" r="4"/>
      <path d="M47 56 C58 58 70 66 78 78"/><circle cx="80" cy="80" r="4"/>
    `, { sw: 4 }),

    wheat: S(`
      <path d="M50 88 L50 30"/>
      <path d="M50 30 C46 24 46 18 50 12 C54 18 54 24 50 30"/>
      <path d="M50 40 L39 31 M50 40 L61 31"/>
      <path d="M50 50 L40 42 M50 50 L60 42"/>
      <path d="M50 60 L41 53 M50 60 L59 53"/>
      <path d="M50 70 C40 66 35 74 37 82 M50 70 C60 66 65 74 63 82"/>
    `, { sw: 4 }),

    helmet: S(`
      <path d="M30 60 C28 40 42 26 60 26 C74 26 82 36 82 46 C82 52 78 56 72 56 L72 76 L64 76 L64 56 C58 56 54 58 52 62"/>
      <path d="M30 60 C30 68 35 74 42 74"/>
      <path d="M52 46 C58 42 66 42 72 46 C66 50 58 50 52 46 Z" fill="currentColor" stroke="none"/>
      <path d="M46 26 C48 14 66 8 80 14 C72 18 66 22 62 27"/>
    `, { sw: 4 }),

    dove: S(`
      <path d="M22 60 C30 48 44 44 58 48 C62 40 70 36 80 38 C75 42 73 45 73 48 C80 50 84 56 84 62 C77 58 70 58 64 60 C56 68 42 70 30 65"/>
      <path d="M45 52 C49 60 50 66 47 73"/>
      <path d="M84 38 L90 37"/>
      <circle cx="77" cy="44" r="1.6" fill="currentColor" stroke="none"/>
      <path d="M22 60 L13 57 M22 60 L15 66"/>
    `, { sw: 4 }),

    hammer: S(`
      <path d="M28 26 L60 26 L60 42 L28 42 Z"/>
      <path d="M60 30 L72 35 L72 37 L60 38 Z" fill="currentColor" stroke="none"/>
      <path d="M44 42 L44 84"/>
      <path d="M38 84 L50 84"/>
      <path d="M22 34 L28 34 M22 34 L26 30 M22 34 L26 38" />
    `, { sw: 4 }),

    caduceus: S(`
      <path d="M50 18 L50 88"/>
      <circle cx="50" cy="15" r="3"/>
      <path d="M50 26 C42 20 32 20 25 24 C34 24 41 28 45 33"/>
      <path d="M50 26 C58 20 68 20 75 24 C66 24 59 28 55 33"/>
      <path d="M50 38 C40 42 40 50 50 54 C60 58 60 66 50 70"/>
      <path d="M50 38 C60 42 60 50 50 54 C40 58 40 66 50 70"/>
    `, { sw: 4 }),

    grapes: S(`
      <path d="M50 16 L50 28"/>
      <path d="M50 22 C42 16 34 19 32 26 C39 29 46 28 50 25"/>
      <circle cx="42" cy="38" r="5.5"/><circle cx="54" cy="37" r="5.5"/>
      <circle cx="36" cy="48" r="5.5"/><circle cx="48" cy="49" r="5.5"/><circle cx="60" cy="47" r="5.5"/>
      <circle cx="42" cy="59" r="5.5"/><circle cx="54" cy="60" r="5.5"/>
      <circle cx="48" cy="71" r="5.5"/>
    `, { sw: 3.4 }),

    /* ─── Tile / corner glyphs ──────────────────────────────────── */

    column: S(`
      <path d="M30 30 L30 78 M40 30 L40 78 M50 30 L50 78 M60 30 L60 78 M70 30 L70 78"/>
      <path d="M24 30 C24 22 76 22 76 30 M22 24 C22 18 78 18 78 24"/>
      <path d="M24 78 L76 78 M20 86 L80 86"/>
    `, { sw: 4 }),

    lyre: S(`
      <path d="M34 78 C26 60 24 38 34 22 C40 30 44 30 50 30 C56 30 60 30 66 22 C76 38 74 60 66 78"/>
      <path d="M40 26 L40 70 M50 24 L50 72 M60 26 L60 70"/>
      <path d="M34 36 L66 32 M34 60 L66 58"/>
    `, { sw: 4 }),

    tripod: S(`
      <path d="M34 34 L26 84 M66 34 L74 84 M50 36 L50 84"/>
      <ellipse cx="50" cy="30" rx="24" ry="8"/>
      <path d="M30 24 C30 14 70 14 70 24"/>
      <path d="M26 84 L40 84 M60 84 L74 84 M44 84 L56 84"/>
    `, { sw: 4 }),

    chains: S(`
      <ellipse cx="34" cy="34" rx="11" ry="14"/>
      <ellipse cx="54" cy="54" rx="11" ry="14"/>
      <ellipse cx="72" cy="72" rx="9" ry="12"/>
      <path d="M20 60 L36 76 M64 22 L80 38"/>
    `, { sw: 4 }),

    /* ─── Event glyphs ──────────────────────────────────────────── */

    wing: S(`
      <path d="M22 40 C40 36 64 40 80 56 C66 54 60 56 60 56 C60 56 70 62 72 72 C58 64 48 64 40 66 C30 56 24 48 22 40 Z"/>
      <path d="M30 70 L26 84 M40 72 L38 86"/>
    `, { sw: 4 }),

    wind: S(`
      <path d="M18 40 L62 40 C72 40 72 26 62 26 C56 26 54 30 54 32"/>
      <path d="M14 54 L74 54 C84 54 84 68 74 68 C68 68 66 64 66 62"/>
      <path d="M22 68 L48 68 C56 68 56 78 48 78 C44 78 42 76 42 74"/>
    `, { sw: 4 }),

    riddle: S(`
      <rect x="22" y="22" width="56" height="56"/>
      <path d="M34 22 L34 66 L66 66 L66 34 L42 34 L42 58 L58 58 L58 42 L50 42 L50 50"/>
    `, { sw: 4 }),

    skull: S(`
      <path d="M50 18 C32 18 22 32 22 48 C22 58 28 64 30 70 L30 78 L70 78 L70 70 C72 64 78 58 78 48 C78 32 68 18 50 18 Z"/>
      <circle cx="38" cy="48" r="7" fill="currentColor" stroke="none"/>
      <circle cx="62" cy="48" r="7" fill="currentColor" stroke="none"/>
      <path d="M50 58 L46 66 L54 66 Z" fill="currentColor" stroke="none"/>
      <path d="M40 78 L40 86 M50 78 L50 86 M60 78 L60 86"/>
    `, { sw: 4 }),

    amphora: S(`
      <path d="M38 24 C30 24 30 34 38 36 M62 24 C70 24 70 34 62 36"/>
      <path d="M40 24 L60 24"/>
      <path d="M38 34 C28 44 26 64 38 80 C46 88 54 88 62 80 C74 64 72 44 62 34"/>
      <path d="M42 84 L58 84 M40 50 L60 50"/>
    `, { sw: 4 }),

    coin: S(`
      <circle cx="50" cy="50" r="30"/>
      <circle cx="50" cy="50" r="22"/>
      <path d="M50 38 C42 38 40 48 44 52 C40 56 42 64 50 64"/>
    `, { sw: 4 }),

    laurel: S(`
      <path d="M50 86 C30 80 20 60 22 36 M50 86 C70 80 80 60 78 36"/>
      <path d="M28 44 L20 40 M30 56 L22 54 M36 68 L29 68 M44 78 L38 80"/>
      <path d="M72 44 L80 40 M70 56 L78 54 M64 68 L71 68 M56 78 L62 80"/>
      <path d="M40 22 C44 18 56 18 60 22 C56 26 44 26 40 22 Z" fill="currentColor" stroke="none"/>
    `, { sw: 4 }),
  };

  root.SYM_ICONS = ICONS;
  root.symIcon = (name) => ICONS[name] || '';
})(window);
