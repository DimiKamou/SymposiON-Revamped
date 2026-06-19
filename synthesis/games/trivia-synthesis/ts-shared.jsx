/* ============================================================
   Trivia Synthesis — shared module
   Bilingual helper · line-art glyphs · power-mark · pegasus ·
   game library · formats · lifelines · starter templates · store
   Everything attached to window for cross-file (Babel) use.
   ============================================================ */
const { useState, useEffect, useRef } = React;

/* ---- bilingual helper -------------------------------------- */
const T = (lang, gr, en) => (lang === "en" ? (en || gr) : (gr || en));

/* ---- line-art icons (currentColor) ------------------------- */
function Glyph({ name, size = 26, stroke = 1.6, style }) {
  const common = {
    width: size, height: size, viewBox: "0 0 100 100", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round",
    strokeLinejoin: "round", style, "aria-hidden": true,
  };
  switch (name) {
    case "amphora": return (
      <svg {...common}>
        <ellipse cx="50" cy="14" rx="10" ry="2.5" /><line x1="40" y1="14" x2="38" y2="28" /><line x1="60" y1="14" x2="62" y2="28" />
        <path d="M 38 28 Q 22 32 22 50 Q 22 70 36 80 L 64 80 Q 78 70 78 50 Q 78 32 62 28" />
        <path d="M 40 22 Q 30 22 28 36" /><path d="M 60 22 Q 70 22 72 36" />
        <path d="M 36 80 L 38 88 L 62 88 L 64 80" /><line x1="34" y1="88" x2="66" y2="88" strokeWidth="2" />
        <path d="M 26 44 L 74 44" strokeOpacity="0.45" /><path d="M 26 50 L 74 50" strokeOpacity="0.45" />
      </svg>);
    case "column": return (
      <svg {...common}>
        <rect x="28" y="12" width="44" height="5" /><path d="M 32 17 Q 32 22 36 22 L 64 22 Q 68 22 68 17" />
        <line x1="36" y1="24" x2="34" y2="80" /><line x1="64" y1="24" x2="66" y2="80" />
        <line x1="42" y1="26" x2="41" y2="78" strokeOpacity="0.45" /><line x1="48" y1="26" x2="48" y2="78" strokeOpacity="0.45" />
        <line x1="54" y1="26" x2="54" y2="78" strokeOpacity="0.45" /><line x1="60" y1="26" x2="61" y2="78" strokeOpacity="0.45" />
        <path d="M 32 80 Q 32 86 36 86 L 64 86 Q 68 86 68 80" /><rect x="28" y="86" width="44" height="4" />
      </svg>);
    case "book": return (
      <svg {...common}>
        <path d="M 14 22 Q 30 18 50 24 Q 70 18 86 22 L 86 78 Q 70 74 50 80 Q 30 74 14 78 Z" />
        <line x1="50" y1="24" x2="50" y2="80" strokeOpacity="0.55" />
        <path d="M 20 34 Q 32 32 44 36" strokeOpacity="0.5" /><path d="M 20 46 Q 32 44 44 48" strokeOpacity="0.5" /><path d="M 20 58 Q 32 56 42 60" strokeOpacity="0.5" />
        <path d="M 56 36 Q 68 32 80 34" strokeOpacity="0.5" /><path d="M 56 48 Q 68 44 80 46" strokeOpacity="0.5" /><path d="M 56 60 Q 68 56 80 58" strokeOpacity="0.5" />
      </svg>);
    case "scroll": return (
      <svg {...common}>
        <ellipse cx="20" cy="50" rx="8" ry="22" /><ellipse cx="20" cy="50" rx="3" ry="22" />
        <ellipse cx="80" cy="50" rx="8" ry="22" /><ellipse cx="80" cy="50" rx="3" ry="22" />
        <path d="M 20 28 L 80 28" /><path d="M 20 72 L 80 72" />
        <path d="M 28 40 Q 32 38 36 40 T 44 40 T 52 40 T 60 40 T 68 40 T 76 40" strokeOpacity="0.6" />
        <path d="M 28 50 Q 32 48 36 50 T 44 50 T 52 50 T 60 50 T 68 50 T 76 50" strokeOpacity="0.6" />
        <path d="M 28 60 Q 32 58 36 60 T 44 60 T 52 60 T 60 60" strokeOpacity="0.6" />
      </svg>);
    case "owl": return (
      <svg {...common}>
        <path d="M 28 30 Q 26 18 36 16 L 42 22" /><path d="M 72 30 Q 74 18 64 16 L 58 22" />
        <path d="M 22 44 Q 22 22 50 22 Q 78 22 78 44 L 78 64 Q 78 84 50 84 Q 22 84 22 64 Z" />
        <circle cx="38" cy="44" r="8" /><circle cx="62" cy="44" r="8" />
        <circle cx="38" cy="44" r="3" fill="currentColor" /><circle cx="62" cy="44" r="3" fill="currentColor" />
        <path d="M 46 54 L 50 60 L 54 54 Z" />
      </svg>);
    case "compass": return (
      <svg {...common}>
        <circle cx="50" cy="50" r="34" /><circle cx="50" cy="50" r="28" strokeOpacity="0.4" />
        <path d="M 50 22 L 56 50 L 50 56 L 44 50 Z" fill="currentColor" stroke="none" opacity="0.85" />
        <path d="M 50 78 L 56 50 L 50 44 L 44 50 Z" /><circle cx="50" cy="50" r="3" fill="currentColor" stroke="none" />
      </svg>);
    case "laurel": return (
      <svg {...common}>
        <path d="M 18 64 L 24 34 L 38 50 L 50 26 L 62 50 L 76 34 L 82 64 Z" /><line x1="18" y1="64" x2="82" y2="64" strokeWidth="1.8" />
        <circle cx="24" cy="32" r="2.4" /><circle cx="50" cy="24" r="2.8" /><circle cx="76" cy="32" r="2.4" />
      </svg>);
    case "lyre": return (
      <svg {...common}>
        <path d="M 30 78 Q 20 60 24 36 Q 26 22 36 22" /><path d="M 70 78 Q 80 60 76 36 Q 74 22 64 22" />
        <path d="M 36 22 Q 50 18 64 22" /><line x1="30" y1="78" x2="70" y2="78" strokeWidth="2" />
        <line x1="42" y1="30" x2="42" y2="74" strokeOpacity="0.55" /><line x1="50" y1="28" x2="50" y2="74" strokeOpacity="0.55" /><line x1="58" y1="30" x2="58" y2="74" strokeOpacity="0.55" />
      </svg>);
    /* ---- UI / format glyphs (24-grid) ---- */
    case "mc": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}>
        <circle cx="6" cy="7" r="2.4" /><line x1="11" y1="7" x2="20" y2="7" /><rect x="4" y="14.5" width="4" height="4" /><path d="M4.6 16.5l1 1 1.6-1.8" /><line x1="11" y1="16.5" x2="20" y2="16.5" strokeOpacity="0.55" />
      </svg>);
    case "tf": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}>
        <path d="M3 8.5l2 2 3.5-4" /><line x1="13" y1="7.5" x2="21" y2="7.5" strokeOpacity="0.55" />
        <path d="M4 15l4 4 M8 15l-4 4" /><line x1="13" y1="17" x2="21" y2="17" strokeOpacity="0.55" />
      </svg>);
    case "match": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}>
        <rect x="2.5" y="4" width="6" height="4.5" /><rect x="2.5" y="13.5" width="6" height="4.5" />
        <rect x="15.5" y="4" width="6" height="4.5" /><rect x="15.5" y="13.5" width="6" height="4.5" />
        <path d="M8.5 6.2 L15.5 15.7" strokeOpacity="0.7" /><path d="M8.5 15.7 L15.5 6.2" strokeOpacity="0.7" />
      </svg>);
    case "fill": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}>
        <line x1="3" y1="8" x2="8" y2="8" /><rect x="9.5" y="5.5" width="5" height="5" /><line x1="16" y1="8" x2="21" y2="8" />
        <line x1="3" y1="16" x2="21" y2="16" strokeOpacity="0.5" />
      </svg>);
    case "order": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}>
        <path d="M4 6 L5.5 5 L5.5 9" /><line x1="9" y1="7" x2="20" y2="7" />
        <path d="M4 14.5h2.6 M4 18h2.6 M6.6 14.5v3.5" strokeOpacity="0.8" /><line x1="9" y1="16.2" x2="20" y2="16.2" strokeOpacity="0.55" />
      </svg>);
    case "eye": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}>
        <path d="M2.5 12 Q12 4 21.5 12 Q12 20 2.5 12 Z" /><circle cx="12" cy="12" r="3" />
      </svg>);
    case "search": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}>
        <circle cx="10.5" cy="10.5" r="6.5" /><line x1="15.5" y1="15.5" x2="21" y2="21" />
      </svg>);
    case "qr": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}>
        <rect x="3" y="3" width="6" height="6" /><rect x="15" y="3" width="6" height="6" /><rect x="3" y="15" width="6" height="6" />
        <rect x="15" y="15" width="2.5" height="2.5" /><rect x="18.5" y="18.5" width="2.5" height="2.5" />
      </svg>);
    case "chevron": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><path d="M8 5 L15 12 L8 19" /></svg>);
    case "check": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke + 0.4}><path d="M4 12.5 L9.5 18 L20 6" /></svg>);
    case "plus": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>);
    case "trash": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><path d="M4 7h16 M9 7V4h6v3 M6 7l1 13h10l1-13" /></svg>);
    case "grip": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><circle cx="9" cy="6" r="1.3" fill="currentColor" stroke="none" /><circle cx="15" cy="6" r="1.3" fill="currentColor" stroke="none" /><circle cx="9" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="15" cy="12" r="1.3" fill="currentColor" stroke="none" /><circle cx="9" cy="18" r="1.3" fill="currentColor" stroke="none" /><circle cx="15" cy="18" r="1.3" fill="currentColor" stroke="none" /></svg>);
    case "bolt": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><path d="M13 2 L4 14 L11 14 L9 22 L20 9 L13 9 Z" /></svg>);
    case "sun": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><circle cx="12" cy="12" r="4.5" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" /></svg>);
    case "moon": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><path d="M20 14.5A8 8 0 1 1 9.5 4 6.3 6.3 0 0 0 20 14.5Z" /></svg>);
    case "rope": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><path d="M2 12 Q6 8 10 12 T18 12 Q20 12 22 10" /><line x1="12" y1="4" x2="12" y2="20" strokeOpacity="0.5" /></svg>);
    case "swords": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><path d="M3 3 L13 13 M3 3 L5 6 M3 3 L6 5" /><path d="M21 3 L11 13 M21 3 L19 6 M21 3 L18 5" /><path d="M9 17 L4 22 M4 19 L7 22" /><path d="M15 17 L20 22 M20 19 L17 22" /></svg>);
    case "pen": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><path d="M4 20l1-4L16 5l3 3L8 19l-4 1Z" /><line x1="14" y1="7" x2="17" y2="10" /></svg>);
    case "copy": return (
      <svg {...common} viewBox="0 0 24 24" strokeWidth={stroke}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M4 16V5a1 1 0 0 1 1-1h11" /></svg>);
    /* ---- game-panel engine glyphs (100-grid, line-art, no emoji) ---- */
    case "anchor": return (
      <svg {...common}><circle cx="50" cy="24" r="8" /><line x1="50" y1="32" x2="50" y2="80" /><path d="M28 68 Q50 94 72 68" /><line x1="34" y1="44" x2="66" y2="44" /></svg>);
    case "maze": return (
      <svg {...common}><path d="M22 22 H78 V78 H32 V32 H68 V68 H42 V42 H58 V58 H50" /></svg>);
    case "cards": return (
      <svg {...common}><rect x="22" y="32" width="34" height="46" rx="4" transform="rotate(-8 39 55)" /><rect x="44" y="26" width="34" height="46" rx="4" transform="rotate(8 61 49)" /></svg>);
    case "shield": return (
      <svg {...common}><path d="M50 16 L80 28 V52 Q80 78 50 88 Q20 78 20 52 V28 Z" /><line x1="50" y1="30" x2="50" y2="74" strokeOpacity="0.5" /><line x1="32" y1="44" x2="68" y2="44" strokeOpacity="0.5" /></svg>);
    case "target": return (
      <svg {...common}><circle cx="50" cy="50" r="28" /><circle cx="50" cy="50" r="16" strokeOpacity="0.6" /><circle cx="50" cy="50" r="4" fill="currentColor" stroke="none" /></svg>);
    case "pickaxe": return (
      <svg {...common}><line x1="24" y1="78" x2="72" y2="30" /><path d="M50 20 Q72 24 82 46" /><path d="M26 34 Q40 24 56 30" strokeOpacity="0.7" /></svg>);
    case "mountain": return (
      <svg {...common}><path d="M18 78 L42 36 L56 58 L66 42 L84 78 Z" /><path d="M36 47 L42 36 L48 47" strokeOpacity="0.55" /></svg>);
    case "crown": return (
      <svg {...common}><path d="M26 70 L26 38 L40 52 L50 30 L60 52 L74 38 L74 70 Z" /><line x1="26" y1="76" x2="74" y2="76" /></svg>);
    case "dash": return (
      <svg {...common}><path d="M30 34 L46 50 L30 66" /><path d="M48 34 L64 50 L48 66" strokeOpacity="0.7" /><path d="M66 34 L82 50 L66 66" strokeOpacity="0.42" /></svg>);
    case "sail": return (
      <svg {...common}><path d="M22 70 Q50 86 78 70" /><line x1="50" y1="18" x2="50" y2="68" /><path d="M50 22 L74 62 L50 62 Z" /></svg>);
    case "fish": return (
      <svg {...common}><path d="M20 50 Q44 28 66 50 Q44 72 20 50 Z" /><path d="M66 50 L84 38 L81 50 L84 62 Z" /><circle cx="34" cy="46" r="2.2" fill="currentColor" stroke="none" /></svg>);
    default: return null;
  }
}

/* ---- the Σ power-mark --------------------------------------- */
function PowerMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square" strokeLinejoin="miter">
        <line x1="22" y1="20" x2="78" y2="20" /><line x1="22" y1="20" x2="48" y2="50" />
        <line x1="48" y1="50" x2="22" y2="80" /><line x1="22" y1="80" x2="78" y2="80" />
      </g>
      <g stroke="var(--terra)" strokeWidth="3.2" fill="none" strokeLinecap="round">
        <circle cx="64" cy="50" r="12" strokeDasharray="62 12" strokeDashoffset="-7" transform="rotate(-90 64 50)" />
        <line x1="64" y1="39" x2="64" y2="49" />
      </g>
    </svg>
  );
}

function Pegasus({ style }) {
  return (
    <svg viewBox="0 0 240 180" fill="none" stroke="currentColor" strokeWidth="1.6"
      strokeLinecap="round" strokeLinejoin="round" style={style} aria-hidden="true">
      <path d="M 70 120 Q 60 100 72 90 Q 96 80 130 86 Q 150 90 158 104 L 156 120" />
      <path d="M 80 118 Q 74 134 80 150 M 96 120 Q 102 136 94 152" opacity="0.85" />
      <path d="M 138 118 Q 132 134 140 150 M 150 116 Q 158 132 150 148" opacity="0.85" />
      <path d="M 130 86 Q 150 74 158 56 Q 162 46 174 44 L 184 36 Q 190 40 186 48 L 178 54 Q 180 62 172 66 Q 164 78 152 80" />
      <path d="M 110 88 Q 90 50 50 36 Q 70 44 86 60 Q 70 38 44 28 Q 66 40 84 56 Q 72 36 56 22 Q 80 40 100 64 Q 96 74 110 88" opacity="0.9" />
      <path d="M 70 110 Q 50 112 42 132 Q 38 144 48 148 Q 44 134 58 128" opacity="0.7" />
    </svg>
  );
}

/* ---- choosable masthead glyphs ----------------------------- */
const GLYPH_CHOICES = ["amphora", "column", "book", "scroll", "owl", "compass", "laurel", "lyre"];

/* ---- the Game Panel (Πίνακας Παιχνιδιών) — the real engine ---
   registry the platform exposes. The admin suggests a subset of
   these for a trivia; each consumes the chosen content. Glyphs are
   line-art (no emoji). `cats` mirrors an engine's allowedCategories
   on the platform — empty = plays with any content.            */
const GAME_LIBRARY = [
  { id: "rapid-fire", glyph: "bolt",    players: 1, multiplayer: false, tag: { gr: "ΤΑΧΥΤΗΤΑ", en: "SPEED" },     gr: "Καταιγισμός",         en: "Rapid Fire",       desc: { gr: "Κράτα την καταιγίδα ζωντανή — άπειρες ερωτήσεις στον χρόνο.", en: "Keep the storm alive — endless timed questions." } },
  { id: "tow",        glyph: "rope",    players: 2, multiplayer: true,  tag: { gr: "2 ΟΜΑΔΕΣ", en: "2 TEAMS" },    gr: "Αγώνας Διελκυστίνδας", en: "Tug of War",       desc: { gr: "Απάντα σωστά για να σπρώξεις τον αντίπαλο πέρα απ' τη γραμμή.", en: "Answer right to pull the rope past your rivals." } },
  { id: "naumachia",  glyph: "anchor",  players: 2, multiplayer: true,  tag: { gr: "2 ΠΑΙΚΤΕΣ", en: "2 PLAYERS" }, gr: "Ναυμαχία",            en: "Naumachia",        desc: { gr: "Βύθισε τον στόλο του αντιπάλου με σωστές απαντήσεις.", en: "Sink the enemy fleet with correct answers." } },
  { id: "labyrinth",  glyph: "maze",    players: 1, multiplayer: false, tag: { gr: "ΓΡΙΦΟΣ", en: "PUZZLE" },       gr: "Λαβύρινθος",          en: "Labyrinth",        desc: { gr: "Βρες τον δρόμο απαντώντας σωστά σε κάθε σταυροδρόμι.", en: "Find the way by answering at every crossroad." } },
  { id: "phalanx",    glyph: "shield",  players: 1, multiplayer: false, tag: { gr: "ΣΤΡΑΤΗΓΙΚΗ", en: "STRATEGY" }, gr: "Φάλαγγα",             en: "Phalanx",          desc: { gr: "Κράτα τον σχηματισμό· κάθε σωστή απάντηση ενισχύει τη γραμμή.", en: "Hold the line — each correct answer strengthens it." } },
  { id: "myth-memory",glyph: "cards",   players: 1, multiplayer: false, tag: { gr: "ΜΝΗΜΗ", en: "MEMORY" },        gr: "Ζεύγη Μυθολογίας",     en: "Mythology Memory", desc: { gr: "Βρες τα ζεύγη — έννοιες, ήρωες και ορισμούς.", en: "Match the pairs — concepts, heroes and definitions." }, cats: ["Ομηρική Ποίηση"] },
  { id: "epic-puzzle",glyph: "order",   players: 1, multiplayer: false, tag: { gr: "ΓΡΙΦΟΣ", en: "PUZZLE" },       gr: "Χρονολόγιο",          en: "Chronicle",       desc: { gr: "Βάλε γεγονότα κι έννοιες στη σωστή χρονολογική σειρά.", en: "Put events and concepts in the right order." }, cats: ["Ομηρική Ποίηση", "Ιστορία"] },
  { id: "dig",        glyph: "pickaxe", players: 1, multiplayer: false, tag: { gr: "ΕΞΕΡΕΥΝΗΣΗ", en: "DISCOVERY" },gr: "Ανασκαφή",            en: "Archaeological Dig",desc: { gr: "Σκάψε — κάθε σωστή απάντηση αποκαλύπτει ένα εύρημα.", en: "Dig — each correct answer reveals an artifact." } },
  { id: "mnemosyne",  glyph: "book",    players: 1, multiplayer: false, tag: { gr: "ΜΕΛΕΤΗ", en: "STUDY" },        gr: "Μνημοσύνη",           en: "Mnemosyne",       desc: { gr: "Κάρτες μελέτης με spaced repetition & 3D flip.", en: "Study cards with spaced repetition & 3D flip." } },
  { id: "blade",      glyph: "swords",  players: 1, multiplayer: false, tag: { gr: "ΔΡΑΣΗ", en: "ACTION" },        gr: "Ξίφος του Γραμματικού", en: "Grammarian's Blade",desc: { gr: "Κόψε τον σωστό τύπο — Fruit-Ninja με γραμματική.", en: "Slice the right form — Fruit-Ninja with grammar." }, cats: ["Γραμματική", "Λατινικά"] },
  { id: "invaders",   glyph: "target",  players: 1, multiplayer: false, tag: { gr: "ΔΡΑΣΗ", en: "ACTION" },        gr: "Γραμματική Invaders",  en: "Grammar Invaders", desc: { gr: "Απόκρουσε τους εισβολείς — κάθε λάθος τους φέρνει πιο κοντά.", en: "Repel the invaders — every miss brings them closer." } },
  { id: "anodos",     glyph: "mountain",players: 1, multiplayer: false, tag: { gr: "ROGUELIKE", en: "ROGUELIKE" }, gr: "Ἄνοδος",              en: "The Ascent",      desc: { gr: "Roguelike άνοδος στην Τροία — μάχες, αινίγματα, άρχοντες.", en: "Roguelike ascent to Troy — battles, riddles, bosses." } },
  { id: "battle-royale",glyph: "crown", players: 1, multiplayer: false, tag: { gr: "ΤΟΥΡΝΟΥΑ", en: "TOURNAMENT" }, gr: "Μονομαχία Αρένας",      en: "Battle Royale",   desc: { gr: "Τουρνουά 24 μαχητών — νίκησε διαδοχικούς αντιπάλους.", en: "24-fighter tournament — beat opponents in a row." } },
  { id: "temple-run", glyph: "dash",    players: 1, multiplayer: false, tag: { gr: "RUNNER", en: "RUNNER" },       gr: "Δρομέας Αγοράς",       en: "Agora Surfers",   desc: { gr: "Τρέξε στην αγορά — μάζεψε δραχμές κι απάντα σωστά.", en: "Run the agora — grab drachmas and answer right." } },
  { id: "golden-fleece",glyph: "sail",  players: 1, multiplayer: false, tag: { gr: "ΤΥΧΗ", en: "LUCK" },          gr: "Χρυσόμαλλον Δέρας",    en: "Golden Fleece",   desc: { gr: "Άνοιξε πίθους για χρυσό — απόφυγε της Πανδώρας.", en: "Open jars for gold — avoid Pandora's." } },
  { id: "halieia",    glyph: "fish",    players: 1, multiplayer: false, tag: { gr: "ΦΡΕΝΙΤΙΔΑ", en: "FRENZY" },   gr: "Αλιεία",              en: "Fishing Frenzy",  desc: { gr: "Ρίξε το καλάμι στο Αιγαίο — χτίσε σερί φρενίτιδας.", en: "Cast into the Aegean — build a frenzy streak." } },
];
const gameById = (id) => GAME_LIBRARY.find((g) => g.id === id);

/* ---- content categories (gate which engines fit a trivia) -- */
const CATEGORIES = [
  { id: "", gr: "— Γενική —", en: "— General —" },
  { id: "Ομηρική Ποίηση", gr: "Ομηρική Ποίηση", en: "Epic Poetry" },
  { id: "Ιστορία", gr: "Ιστορία", en: "History" },
  { id: "Λογοτεχνία", gr: "Λογοτεχνία", en: "Literature" },
  { id: "Νεοελληνική Γλώσσα", gr: "Νεοελληνική Γλώσσα", en: "Modern Greek" },
  { id: "Αρχαία Ελληνικά", gr: "Αρχαία Ελληνικά", en: "Ancient Greek" },
  { id: "Γραμματική", gr: "Γραμματική", en: "Grammar" },
  { id: "Λατινικά", gr: "Λατινικά", en: "Latin" },
];
/* an engine fits if it has no category lock, or the trivia is general,
   or the trivia's category is among the engine's allowed ones. */
const compatEngine = (g, cat) => !g.cats || !cat || g.cats.includes(cat);

/* ---- Solo question formats --------------------------------- */
const FORMATS = [
  { id: "mc", glyph: "mc", gr: "Πολλαπλής επιλογής", en: "Multiple choice", sub: { gr: "4 επιλογές", en: "4 options" } },
  { id: "tf", glyph: "tf", gr: "Σωστό ή Λάθος", en: "True or False", sub: { gr: "Δυαδική κρίση", en: "Binary judgement" } },
  { id: "match", glyph: "match", gr: "Αντιστοίχιση", en: "Cross-matching", sub: { gr: "Δύο στήλες", en: "Two columns" } },
  { id: "fill", glyph: "fill", gr: "Συμπλήρωση κενού", en: "Fill the blank", sub: { gr: "Πληκτρολόγησε", en: "Type the answer" } },
  { id: "order", glyph: "order", gr: "Σειρά γεγονότων", en: "Ordering", sub: { gr: "Βάλε σε ακολουθία", en: "Put in sequence" } },
  { id: "identify", glyph: "eye", gr: "Αναγνώριση", en: "Identify", sub: { gr: "Ρήση ή εικόνα", en: "Quote or image" } },
];
const formatById = (id) => FORMATS.find((f) => f.id === id);

/* ---- lifelines --------------------------------------------- */
const HELPS = [
  { id: "5050", label: "50 / 50", gr: "Σβήνει 2 λάθος", en: "Removes 2 wrong" },
  { id: "skip", label: "SKIP", gr: "Προσπέρασε ερώτηση", en: "Skip the question" },
  { id: "time", label: "+10s", gr: "Πρόσθεσε χρόνο", en: "Add time" },
  { id: "reveal", label: "HINT", gr: "Μικρή υπόδειξη", en: "Small hint" },
];

/* ---- token builders ---------------------------------------- */
let __tid = 0;
const newTokenId = () => "t" + (Date.now().toString(36)) + (++__tid);
const mkTok = (gr, en) => ({ id: newTokenId(), gr, en: en == null ? gr : en });
const GREEK_CAPS = "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ".split("");
const GREEK_LOWER = "αβγδεζηθικλμνξοπρστυφχψω".split("");
const lettersToTokens = (arr) => arr.map((c) => mkTok(c, c));
const numbersToTokens = (n) => Array.from({ length: n }, (_, i) => mkTok(String(i + 1), String(i + 1)));

/* default per-game settings */
const defGameCfg = (id) => {
  const g = gameById(id);
  const tow = id === "tow";
  return {
    formats: ["mc", "tf", "match"],
    helps: ["5050", "skip"],
    p1: tow ? { gr: "Ομάδα Α", en: "Team A" } : (g && g.players === 1 ? { gr: "Παίκτης", en: "Player" } : { gr: "Παίκτης 1", en: "Player 1" }),
    p2: tow ? { gr: "Ομάδα Β", en: "Team B" } : { gr: "Παίκτης 2", en: "Player 2" },
  };
};

/* ============================================================
   STARTER TEMPLATES — each is a fully-editable trivia config.
   They demonstrate different unit kinds: Greek letters, numbered
   units, named episodes, and teacher-defined thematic sections.
   ============================================================ */
function makeTemplate(over) {
  return Object.assign({
    glyph: "amphora",
    eyebrow: { gr: "", en: "" },
    titlePre: { gr: "Trivia", en: "Trivia" },
    titleEm: { gr: "", en: "" },
    sub: { gr: "", en: "" },
    heading: { gr: "Επιλογή Ενοτήτων", en: "Select Sections" },
    note: { gr: "Διάλεξε την ύλη μία φορά — ισχύει για κάθε παιχνίδι.", en: "Pick the content once — it applies to every game." },
    category: "",
    unit: { gr: "Ενότητα", en: "Section" },
    units: { gr: "ενότητες", en: "sections" },
    whole: { gr: "Όλη η ύλη", en: "The whole syllabus" },
    cols: 8,
    sections: [],
    games: ["rapid-fire", "tow", "labyrinth"],
    gameCfg: {},
  }, over);
}

const TEMPLATES = [
  {
    id: "epi", name: { gr: "Έπη", en: "Epics" },
    config: makeTemplate({
      glyph: "amphora",
      eyebrow: { gr: "ΟΜΗΡΙΚΟ ΕΠΟΣ", en: "HOMERIC EPIC" },
      titleEm: { gr: "Ἐπῶν", en: "Epics" },
      sub: { gr: "Ιλιάδα & Οδύσσεια — επική γνώση", en: "Iliad & Odyssey — epic knowledge" },
      heading: { gr: "Επιλογή Ραψωδιών", en: "Select Rhapsodies" },
      unit: { gr: "Ραψωδία", en: "Rhapsody" }, units: { gr: "ραψωδίες", en: "rhapsodies" },
      whole: { gr: "Ολόκληρο το έπος", en: "The whole epic" },
      category: "Ομηρική Ποίηση",
      cols: 8, sections: lettersToTokens(GREEK_CAPS),
      games: ["rapid-fire", "tow", "naumachia", "labyrinth", "myth-memory", "epic-puzzle", "anodos", "battle-royale"],
    }),
  },
  {
    id: "tragodies", name: { gr: "Τραγωδίες", en: "Tragedies" },
    config: makeTemplate({
      glyph: "lyre",
      eyebrow: { gr: "ΑΡΧΑΙΟ ΔΡΑΜΑ", en: "ANCIENT DRAMA" },
      titleEm: { gr: "Τραγωδίας", en: "Tragedy" },
      sub: { gr: "Σοφοκλής · Ευριπίδης · Αισχύλος", en: "Sophocles · Euripides · Aeschylus" },
      heading: { gr: "Επιλογή Επεισοδίων", en: "Select Episodes" },
      unit: { gr: "Επεισόδιο", en: "Episode" }, units: { gr: "επεισόδια", en: "episodes" },
      whole: { gr: "Ολόκληρο το έργο", en: "The whole play" },
      category: "Λογοτεχνία",
      cols: 4,
      sections: [
        mkTok("Πρόλογος", "Prologue"), mkTok("Πάροδος", "Parodos"),
        mkTok("Α΄ Επεισ.", "Episode 1"), mkTok("Β΄ Επεισ.", "Episode 2"),
        mkTok("Γ΄ Επεισ.", "Episode 3"), mkTok("Δ΄ Επεισ.", "Episode 4"),
        mkTok("Ε΄ Επεισ.", "Episode 5"), mkTok("Έξοδος", "Exodos"),
      ],
      games: ["rapid-fire", "tow", "labyrinth", "phalanx", "battle-royale"],
    }),
  },
  {
    id: "ekthesi", name: { gr: "Έκθεση", en: "Essay" },
    config: makeTemplate({
      glyph: "scroll",
      eyebrow: { gr: "ΝΕΟΕΛΛΗΝΙΚΗ ΓΛΩΣΣΑ", en: "MODERN GREEK" },
      titleEm: { gr: "Έκθεσης", en: "Essay Writing" },
      sub: { gr: "Θεωρία & θεματικές ενότητες", en: "Theory & thematic units" },
      heading: { gr: "Επιλογή Θεματικής", en: "Select a Topic" },
      unit: { gr: "Θεματική", en: "Topic" }, units: { gr: "θεματικές", en: "topics" },
      whole: { gr: "Όλες οι θεματικές", en: "All topics" },
      category: "Νεοελληνική Γλώσσα",
      cols: 2,
      sections: [
        mkTok("Γλώσσα & Επικοινωνία", "Language & Communication"),
        mkTok("Παιδεία & Σχολείο", "Education & School"),
        mkTok("Τεχνολογία", "Technology"),
        mkTok("Περιβάλλον", "Environment"),
        mkTok("Δημοκρατία & Πολίτης", "Democracy & Citizen"),
        mkTok("Τέχνη & Πολιτισμός", "Art & Culture"),
      ],
      games: ["rapid-fire", "tow", "labyrinth", "dig", "golden-fleece", "temple-run"],
    }),
  },
  {
    id: "logotechnia", name: { gr: "Λογοτεχνία", en: "Literature" },
    config: makeTemplate({
      glyph: "book",
      eyebrow: { gr: "ΝΕΟΕΛΛΗΝΙΚΗ ΛΟΓΟΤΕΧΝΙΑ", en: "MODERN GREEK LITERATURE" },
      titleEm: { gr: "Λογοτεχνίας", en: "Literature" },
      sub: { gr: "Ποίηση & πεζογραφία", en: "Poetry & prose" },
      heading: { gr: "Επιλογή Κειμένων", en: "Select Texts" },
      unit: { gr: "Κείμενο", en: "Text" }, units: { gr: "κείμενα", en: "texts" },
      whole: { gr: "Όλα τα κείμενα", en: "All texts" },
      category: "Λογοτεχνία",
      cols: 2,
      sections: [
        mkTok("Σολωμός — Ύμνος", "Solomos — Hymn"),
        mkTok("Κάλβος — Ωδαί", "Kalvos — Odes"),
        mkTok("Παλαμάς — Δωδεκάλογος", "Palamas — Twelve Words"),
        mkTok("Καβάφης — Ποιήματα", "Cavafy — Poems"),
        mkTok("Σεφέρης — Μυθιστόρημα", "Seferis — Mythistorema"),
        mkTok("Ελύτης — Άξιον Εστί", "Elytis — Axion Esti"),
        mkTok("Βιζυηνός — Διηγήματα", "Vizyinos — Stories"),
        mkTok("Παπαδιαμάντης — Φόνισσα", "Papadiamantis — Murderess"),
      ],
      games: ["rapid-fire", "tow", "labyrinth", "battle-royale"],
    }),
  },
];
const templateById = (id) => TEMPLATES.find((t) => t.id === id);

/* deep clone so editing a draft never mutates the template */
const cloneConfig = (c) => JSON.parse(JSON.stringify(c));

/* ---- persistence ------------------------------------------- */
const STORE_KEY = "symposion.trivia.synthesis.v3";
const Store = {
  load() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; }
    catch (_) { return null; }
  },
  save(state) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (_) {}
  },
};

Object.assign(window, {
  T, Glyph, PowerMark, Pegasus, GLYPH_CHOICES,
  GAME_LIBRARY, gameById, CATEGORIES, compatEngine, FORMATS, formatById, HELPS,
  mkTok, newTokenId, GREEK_CAPS, GREEK_LOWER, lettersToTokens, numbersToTokens,
  defGameCfg, TEMPLATES, templateById, makeTemplate, cloneConfig, Store,
});
