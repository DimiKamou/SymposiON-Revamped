/* ════════════════════════════════════════════════════════════════════
   Εὐριπίδης — Ἡ Ζωφόρος (shared black-figure library for the tragedies:
   Ἑλένη · Ἄλκηστις · Τρῳάδες). Men in black slip, women in added white,
   incisions cut in the terracotta ground.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const INK = '#171009';
  const CREAM = '#ECDDBF';
  const S = ({ vb, w, h, children }) => (
    <svg className="bf" viewBox={vb} width={w} height={h} role="img" style={{ display: 'block', overflow: 'visible' }}>{children}</svg>
  );
  // a standing draped figure (origin = feet centre). col INK or CREAM.
  const body = (cx, { col = INK, top = 56, base = 158, w = 24 } = {}) =>
    <path d={`M${cx - w} ${base} q-2 ${-(base - top - 30)} ${w * 0.5} ${-(base - top - 24)} q${w * 0.5} -8 ${w} -8 q${w * 0.6} 0 ${w * 0.7} 10 q4 ${(base - top - 34)} 0 ${(base - top - 12)} q-${w} 6 -${w * 1.7} 0 Z`} fill={col} />;
  const head = (cx, cy, { col = INK, r = 12 } = {}) => <circle cx={cx} cy={cy} r={r} fill={col} />;

  /* ════════ EMBLEMS ════════ */

  // Teucer — the archer draws his bow
  const Archer = ({ size = 130, ground }) => (
    <S vb="0 0 140 130" w={size} h={size * 130 / 140}>
      <g fill={INK}>
        <path d="M40 124 q-6 -42 4 -60 q5 -10 16 -8 q4 22 2 68 q-12 4 -22 0 Z" />
        {head(52, 40, {})}
        <path d="M42 64 q-2 14 10 16 q12 -2 10 -16 Z" />
        <path d="M64 64 L104 50" stroke={INK} strokeWidth="8" strokeLinecap="round" fill="none" />
        <path d="M52 60 L96 70" stroke={INK} strokeWidth="7" strokeLinecap="round" fill="none" />
      </g>
      <path d="M104 18 Q124 64 104 110" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M104 18 L104 110" stroke={INK} strokeWidth="2.4" fill="none" />
      <path d="M52 64 L120 64" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      <path d="M120 64 L110 59 M120 64 L110 69" stroke={INK} strokeWidth="3" fill="none" strokeLinecap="round" />
    </S>
  );

  // Menelaus — the castaway, ragged, with a broken oar
  const Castaway = ({ size = 130, ground }) => (
    <S vb="0 0 140 130" w={size} h={size * 130 / 140}>
      <g fill={INK}>
        <path d="M52 112 q-8 -38 2 -56 q6 -12 18 -10 q12 2 14 16 q-2 26 -6 52 q-14 5 -28 -2 Z" />
        {head(64, 44, {})}
        <path d="M54 48 q12 -10 22 0" stroke={ground} strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M54 66 q-2 14 12 18 q14 -4 12 -18 Z" />
        <path d="M82 70 q14 0 18 -12" stroke={INK} strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
      {/* ragged hem */}
      <path d="M40 106 l6 8 l8 -8 l8 8 l8 -8 l8 8 l6 -8" stroke={ground} strokeWidth="2" fill="none" opacity="0.5" />
      {/* broken oar */}
      <path d="M96 58 L120 96" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M120 96 q8 6 6 16 q-10 -2 -12 -10 Z" fill={INK} />
      <path d="M6 120 Q24 114 42 120 T78 120 T118 120" stroke={ground} strokeWidth="2.4" fill="none" opacity="0.7" />
    </S>
  );

  // Helen's stratagem — libation poured over the tomb
  const Libation = ({ size = 130, ground }) => (
    <S vb="0 0 140 130" w={size} h={size * 130 / 140}>
      {/* tomb / altar */}
      <path d="M78 124 L122 124 L118 86 L82 86 Z" fill={INK} />
      <path d="M78 86 L122 86 L122 78 L78 78 Z" fill={INK} />
      <path d="M86 96 L114 96 M86 106 L114 106" stroke={ground} strokeWidth="2" opacity="0.5" />
      {/* woman pouring */}
      <g>
        <path d="M22 124 q-6 -42 6 -62 q6 -12 18 -10 q12 2 14 16 q-2 30 -8 56 q-16 6 -30 0 Z" fill={CREAM} />
        {head(38, 44, { col: CREAM })}
        <path d="M30 38 q12 -10 18 2 q3 -8 -2 -12 q-12 -2 -16 10 Z" fill={CREAM} />
        <circle cx="42" cy="43" r="2" fill={INK} />
        <path d="M52 70 q18 -2 24 -14" stroke={CREAM} strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
      {/* oinochoe + stream */}
      <path d="M72 52 q10 -2 12 6 q0 8 -8 10 q-8 0 -8 -8 Z" fill={INK} />
      <path d="M82 60 q6 8 0 20" stroke={ground} strokeWidth="2.2" fill="none" opacity="0.8" />
    </S>
  );

  // Theonoe — the prophetess, veiled, with a torch
  const Priestess = ({ size = 130, ground }) => (
    <S vb="0 0 130 130" w={size} h={size * 130 / 130}>
      <g>
        <path d="M34 124 q-6 -46 6 -68 q6 -12 20 -10 q12 2 14 18 q-2 32 -8 60 q-18 6 -32 0 Z" fill={CREAM} />
        {/* veil */}
        <path d="M36 56 q-2 -22 22 -22 q22 0 20 22 q-2 10 -8 14 q-18 6 -30 -4 q-4 -6 -4 -10 Z" fill={CREAM} />
        <circle cx="54" cy="54" r="2.1" fill={INK} />
        <path d="M70 70 q16 -2 22 -16" stroke={CREAM} strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
      {/* torch */}
      <path d="M92 56 L96 110" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M92 56 q-6 -14 0 -24 q8 12 14 6 q-2 12 -6 18 q-4 4 -8 0 Z" fill={ground} opacity="0.85" />
      <path d="M92 56 q-3 -8 0 -14" stroke={CREAM} strokeWidth="2" fill="none" opacity="0.6" />
    </S>
  );

  // chorus — mourners, hands raised to the head
  const Mourners = ({ size = 130, ground }) => (
    <S vb="0 0 150 130" w={size} h={size * 130 / 150}>
      {[{ x: 44, b: 124 }, { x: 96, b: 120 }].map((m, i) => (
        <g key={i}>
          <path d={`M${m.x - 18} ${m.b} q-6 -40 6 -58 q6 -12 18 -10 q12 2 14 16 q-2 28 -8 52 q-16 6 -30 0 Z`} fill={CREAM} />
          {head(m.x, m.b - 84, { col: CREAM, r: 11 })}
          {/* both arms up to head — lament */}
          <path d={`M${m.x - 10} ${m.b - 56} q-14 -10 -10 -28`} stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round" />
          <path d={`M${m.x + 10} ${m.b - 56} q14 -10 10 -28`} stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round" />
        </g>
      ))}
    </S>
  );

  // Heracles — club over shoulder, lion-skin, cup in hand
  const Heracles = ({ size = 130, ground }) => (
    <S vb="0 0 130 130" w={size} h={size * 130 / 130}>
      <g fill={INK}>
        <path d="M40 124 q-8 -44 4 -64 q6 -12 20 -10 q14 2 16 18 q-2 30 -2 56 q-18 6 -38 0 Z" />
        {/* lion-skin hooded head */}
        <path d="M44 40 q0 -16 16 -16 q16 0 16 16 q0 8 -4 12 q-4 -10 -12 -10 q-8 0 -12 10 q-4 -4 -4 -12 Z" />
        {head(60, 42, { r: 10 })}
        <path d="M44 30 q4 -8 -2 -14 M76 30 q-4 -8 2 -14" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        {/* club over shoulder */}
        <path d="M72 60 L104 22" stroke={INK} strokeWidth="8" strokeLinecap="round" />
        <path d="M104 22 q10 -8 8 -16 q-12 0 -16 8 Z" />
        {/* cup-arm */}
        <path d="M44 64 q-12 4 -14 16" stroke={INK} strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M22 78 q12 -2 14 4 q-2 8 -8 8 q-8 -2 -6 -12 Z" />
      </g>
    </S>
  );

  // Admetus & Pheres — the bitter quarrel (old father with staff)
  const Elders = ({ size = 140, ground }) => (
    <S vb="0 0 160 130" w={size} h={size * 130 / 160}>
      {/* Admetus, accusing */}
      <g fill={INK}>
        <path d="M40 124 q-6 -44 6 -62 q6 -12 18 -10 q12 2 14 16 q-2 30 -6 56 q-16 6 -32 0 Z" />
        {head(52, 44, {})}
        <path d="M64 66 q16 -4 26 -2" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      {/* Pheres, old, leaning on staff, turned away */}
      <g fill={INK}>
        <path d="M120 124 q6 -44 -6 -62 q-6 -12 -18 -10 q-12 2 -12 16 q4 30 4 56 q14 6 28 0 Z" />
        {head(108, 46, {})}
        <path d="M98 52 q22 -6 22 6" stroke={INK} strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M98 66 q-2 16 10 20 q12 -4 10 -20 Z" />
      </g>
      <path d="M132 30 L138 124" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
    </S>
  );

  // Helen on trial — the accused between accuser and judge
  const Trial = ({ size = 150, ground }) => (
    <S vb="0 0 170 130" w={size} h={size * 130 / 170}>
      {/* Hecuba accusing, left (white, aged) */}
      <g>
        <path d="M22 124 q-6 -42 6 -58 q6 -10 16 -8 q10 2 12 14 q-2 26 -6 52 q-14 5 -28 0 Z" fill={CREAM} />
        {head(34, 48, { col: CREAM, r: 10 })}
        <path d="M44 64 q14 -2 22 0" stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      {/* Helen, centre (white), drawing her veil */}
      <g>
        <path d="M70 124 q-6 -46 6 -68 q6 -12 18 -10 q12 2 14 18 q-2 32 -6 60 q-16 6 -32 0 Z" fill={CREAM} />
        <path d="M74 56 q-2 -20 18 -20 q20 0 18 20 q-2 10 -8 12 q-16 6 -26 -4 q-3 -4 -2 -8 Z" fill={CREAM} />
        <circle cx="90" cy="54" r="2.1" fill={INK} />
      </g>
      {/* Menelaus, right (black), sword half-raised */}
      <g fill={INK}>
        <path d="M140 124 q6 -44 -6 -62 q-6 -12 -18 -10 q-12 2 -12 16 q4 30 4 56 q14 6 28 0 Z" />
        {head(128, 46, {})}
        <path d="M116 66 q-14 4 -18 -8" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M98 58 L98 34" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </S>
  );

  // Hecuba — the fallen queen, prostrate in lament
  const Hecuba = ({ size = 140, ground }) => (
    <S vb="0 0 160 120" w={size} h={size * 120 / 160}>
      <g>
        {/* seated low on the ground, bowed */}
        <path d="M40 110 q-6 -8 0 -16 q-6 -18 8 -30 q10 -8 22 -2 q14 8 12 28 q-2 12 -8 20 q-18 6 -34 0 Z" fill={CREAM} />
        {/* bowed veiled head near the knees */}
        <path d="M52 70 q-2 -16 14 -16 q16 0 16 14 q0 10 -8 14 q-14 4 -22 -4 q-2 -4 0 -8 Z" fill={CREAM} />
        <circle cx="66" cy="68" r="2" fill={INK} />
        {/* one arm flung to the earth */}
        <path d="M44 96 q-16 4 -26 -2" stroke={CREAM} strokeWidth="8" fill="none" strokeLinecap="round" />
        {/* hem on the dust */}
        <path d="M30 108 q30 8 64 2" stroke={INK} strokeWidth="1.6" opacity="0.35" fill="none" />
      </g>
      <path d="M8 114 L150 114" stroke={ground} strokeWidth="2" opacity="0.4" />
    </S>
  );

  // Astyanax — buried on Hector's great round shield
  const ShieldBody = ({ size = 140, ground }) => (
    <S vb="0 0 160 120" w={size} h={size * 120 / 160}>
      {/* the round shield, laid flat */}
      <ellipse cx="86" cy="92" rx="56" ry="20" fill={INK} />
      <ellipse cx="86" cy="92" rx="56" ry="20" fill="none" stroke={ground} strokeWidth="2.2" opacity="0.6" />
      <ellipse cx="86" cy="92" rx="30" ry="10" fill="none" stroke={ground} strokeWidth="2" opacity="0.5" />
      {/* the small shrouded body upon it */}
      <path d="M58 90 q28 -8 56 -2 q4 4 -2 8 q-26 6 -54 0 q-4 -3 0 -6 Z" fill={CREAM} />
      <circle cx="60" cy="86" r="6" fill={CREAM} />
      {/* a mourner bending over */}
      <g>
        <path d="M118 96 q14 -34 -2 -54 q-8 -10 -18 -4 q-10 8 -4 24 q6 16 6 32 q8 6 18 2 Z" fill={CREAM} />
        {head(98, 30, { col: CREAM, r: 9 })}
        <path d="M104 46 q-14 6 -24 18" stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
    </S>
  );

  /* ════════ HERO SCENES ════════ */

  // Πρόλογος (Ελένη) — Helen at the tomb beside her phantom double (the εἴδωλον)
  const Eidolon = ({ size = 240, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* Proteus' tomb */}
      <path d="M150 158 L210 158 L204 96 L156 96 Z" fill={INK} />
      <path d="M150 96 L210 96 L210 86 L150 86 Z" fill={INK} />
      <path d="M162 112 L198 112 M162 128 L198 128 M162 144 L198 144" stroke={ground} strokeWidth="2" opacity="0.5" />
      {/* Helen (white), seated suppliant at the tomb */}
      <g>
        <path d="M58 158 q-8 -52 6 -78 q7 -16 22 -14 q13 2 16 18 q-2 36 -10 74 q-18 7 -34 0 Z" fill={CREAM} />
        <path d="M62 56 q-2 -22 24 -22 q24 0 22 22 q-2 12 -10 16 q-20 6 -32 -4 q-4 -6 -4 -12 Z" fill={CREAM} />
        <circle cx="84" cy="54" r="2.2" fill={INK} />
        <path d="M104 86 q22 -4 34 6" stroke={CREAM} strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M68 92 L72 156 M86 86 L90 156 M104 96 L106 150" stroke={INK} strokeWidth="1.5" opacity="0.4" fill="none" />
      </g>
      {/* the εἴδωλον — her phantom double, outline only, drifting */}
      <g fill="none" stroke={CREAM} strokeWidth="2" opacity="0.55" strokeLinejoin="round">
        <path d="M118 156 q-6 -50 6 -74 q7 -15 20 -13 q12 2 15 17 q-2 34 -9 70 q-16 6 -32 0 Z" />
        <path d="M122 58 q-2 -20 22 -20 q22 0 20 20 q-2 11 -9 15 q-18 5 -29 -4 q-4 -5 -4 -11 Z" />
        <path d="M120 150 q12 6 32 0" />
      </g>
    </S>
  );

  // Ο Αναγνωρισμός (Ελένη) — Helen (white) & Menelaus (black) reunite
  const Reunion = ({ size = 230, ground }) => (
    <S vb="0 0 220 170" w={size} h={size * 170 / 220}>
      {/* Menelaus (black), left, reaching */}
      <g fill={INK}>
        <path d="M54 158 q-8 -54 4 -80 q7 -16 22 -14 q12 2 16 16 q-4 32 -2 78 q-20 7 -40 0 Z" />
        {head(74, 56, { r: 13 })}
        <path d="M63 60 q-2 16 11 20 q13 -4 11 -20 Z" />
        <path d="M90 80 q24 -2 38 8" stroke={INK} strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
      {/* Helen (white), right, reaching back */}
      <g>
        <path d="M164 158 q8 -54 -4 -80 q-7 -16 -22 -14 q-12 2 -16 16 q4 32 2 78 q20 7 40 0 Z" fill={CREAM} />
        <path d="M146 56 q-2 -20 22 -20 q22 0 20 20 q-2 12 -10 15 q-18 5 -28 -4 q-5 -5 -4 -11 Z" fill={CREAM} />
        <circle cx="150" cy="54" r="2.2" fill={INK} />
        <path d="M128 80 q-22 -2 -34 8" stroke={CREAM} strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
      <path d="M96 70 q12 -4 24 0" stroke={ground} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
    </S>
  );

  // Η Φυγή & οι Διόσκουροι (Ελένη) — Castor & Pollux above, the ship flees
  const Dioscuri = ({ size = 240, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* the two divine youths (white), each crowned with a star */}
      {[{ x: 70 }, { x: 150 }].map((m, i) => (
        <g key={i}>
          <path d={`M${m.x - 16} 96 q-6 -34 6 -50 q6 -10 16 -8 q10 2 12 14 q-2 22 -8 44 q-14 5 -26 0 Z`} fill={CREAM} />
          {head(m.x, 30, { col: CREAM, r: 10 })}
          <path d={`M${m.x} 6 l2 6 l6 1 l-6 2 l-2 6 l-2 -6 l-6 -2 l6 -1 Z`} fill={CREAM} />
          <path d={`M${m.x + 12} 56 q12 0 16 -10`} stroke={CREAM} strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      ))}
      {/* the ship below, fleeing on the swell */}
      <path d="M210 78 L240 86 Q240 104 212 104 Z" fill={CREAM} />
      <path d="M210 76 L210 120" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M150 122 q4 12 56 12 q44 0 48 -10 q-4 8 -36 12 q-40 4 -68 -4 q-4 -10 0 -22 Z" fill={INK} />
      <path d="M160 140 L156 152 M178 142 L174 154 M196 142 L193 154 M214 140 L217 152" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M120 160 Q150 152 180 160 T240 160" stroke={ground} strokeWidth="2.6" fill="none" opacity="0.7" />
    </S>
  );

  // Πρόλογος (Ἄλκηστις) — Apollo (black) confronts winged Death (black) at the door
  const ApolloDeath = ({ size = 240, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* doorway of the house of Admetus */}
      <path d="M112 158 L112 40 L138 40 L138 158" stroke={INK} strokeWidth="4" fill="none" />
      {/* Apollo (black), left, laurelled, with bow lowered */}
      <g fill={INK}>
        <path d="M40 158 q-8 -52 4 -78 q7 -16 22 -14 q12 2 16 16 q-4 32 -2 76 q-20 7 -40 0 Z" />
        {head(60, 54, { r: 13 })}
        <path d="M48 46 q12 -10 24 0 q-4 -8 -12 -8 q-8 0 -12 8 Z" />
        <path d="M84 80 q14 0 18 16" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      <path d="M30 36 Q12 80 30 124" stroke={INK} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      <path d="M30 36 L30 124" stroke={INK} strokeWidth="2" fill="none" opacity="0.7" />
      {/* Thanatos (black, winged), right, sword raised */}
      <g fill={INK}>
        <path d="M210 158 q8 -52 -4 -78 q-7 -16 -22 -14 q-12 2 -16 16 q4 32 2 76 q20 7 40 0 Z" />
        {head(190, 54, { r: 12 })}
        {/* great dark wings */}
        <path d="M204 70 q34 -16 44 -2 q-22 4 -34 18 q18 -2 28 6 q-22 6 -40 -2 Z" />
        <path d="M176 86 q-22 6 -28 22 q18 -2 28 -8 Z" />
        {/* sword raised */}
        <path d="M176 78 L162 40" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M162 40 L155 50 M162 40 L169 50" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </S>
  );

  // Η Θυσία (Ἄλκηστις) — Alcestis (white) dying on the couch; Admetus (black) bends over her; the child
  const Bier = ({ size = 250, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* the kline (couch) */}
      <path d="M30 132 L210 132 L210 146 L30 146 Z" fill={INK} />
      <path d="M40 146 L40 162 M198 146 L198 162" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M30 132 q-6 -10 8 -14 L70 118" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* Alcestis (white), reclining */}
      <g>
        <path d="M44 130 q40 -16 110 -10 q14 2 12 10 q-2 6 -10 6 L60 130 q-10 0 -16 -6 Z" fill={CREAM} />
        <path d="M44 120 q4 -8 16 -8 q10 0 12 8" fill={CREAM} />
        {head(56, 112, { col: CREAM, r: 11 })}
        <circle cx="52" cy="110" r="2" fill={INK} />
        <path d="M150 126 q14 -2 22 4" stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
      {/* Admetus (black), bending over her in grief */}
      <g fill={INK}>
        <path d="M196 158 q10 -40 -6 -60 q-8 -10 -20 -4 q-12 8 -6 24 q8 18 6 40 q12 6 26 0 Z" />
        {head(178, 30, { r: 12 })}
        <path d="M184 48 q-18 6 -30 22" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {/* child (white) at the couch-foot */}
      <g>
        <path d="M214 158 q-4 -22 4 -32 q5 -7 12 -5 q8 3 7 14 q-2 14 -5 23 q-9 4 -18 0 Z" fill={CREAM} />
        {head(224, 116, { col: CREAM, r: 8 })}
      </g>
    </S>
  );

  // Η Πάλη (Ἄλκηστις) — Heracles (black) wrestles winged Death (black) at the tomb
  const Wrestle = ({ size = 230, ground }) => (
    <S vb="0 0 230 170" w={size} h={size * 170 / 230}>
      {/* Heracles, left, lunging to grapple */}
      <g fill={INK}>
        <path d="M40 160 q-4 -44 16 -64 q10 -10 24 -4 q12 6 8 22 q-6 18 -22 32 q-14 12 -38 22 q-6 -2 0 -8 Z" />
        {/* lion-hood */}
        <path d="M66 56 q0 -16 16 -16 q16 0 16 16 q0 8 -4 12 q-4 -10 -12 -10 q-8 0 -12 10 q-4 -4 -4 -12 Z" />
        {head(82, 56, { r: 10 })}
        {/* gripping arms reaching into Death */}
        <path d="M96 70 q24 4 38 22" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {/* dropped club */}
      <path d="M30 150 L60 132" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      {/* Thanatos, right, wings beating, recoiling in the lock */}
      <g fill={INK}>
        <path d="M188 158 q12 -44 -4 -66 q-8 -12 -22 -8 q-12 6 -10 24 q4 24 4 50 q12 6 32 0 Z" />
        {head(168, 52, { r: 11 })}
        <path d="M186 66 q30 -18 42 -4 q-20 4 -32 16 q16 0 26 8 q-22 6 -40 -4 Z" />
        <path d="M162 70 q-26 6 -32 26 q20 -2 32 -10 Z" />
        <path d="M160 74 q-22 2 -30 -10" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
    </S>
  );

  // Η Επιστροφή (Ἄλκηστις) — Heracles (black) returns the veiled woman (white) to Admetus (black)
  const VeilReturn = ({ size = 250, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* Heracles, left, club, presenting */}
      <g fill={INK}>
        <path d="M34 158 q-8 -50 4 -74 q7 -16 22 -14 q12 2 16 16 q-4 30 -2 72 q-20 7 -40 0 Z" />
        <path d="M44 44 q0 -16 16 -16 q16 0 16 16 q0 8 -4 12 q-4 -10 -12 -10 q-8 0 -12 10 q-4 -4 -4 -12 Z" />
        {head(60, 46, { r: 10 })}
        <path d="M74 76 q22 -2 34 6" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      <path d="M22 20 L30 150" stroke={INK} strokeWidth="6" strokeLinecap="round" />
      {/* the veiled woman (white), centre — Alcestis restored, silent */}
      <g>
        <path d="M112 158 q-6 -52 6 -74 q6 -14 20 -12 q14 2 16 16 q-2 32 -8 70 q-18 7 -34 0 Z" fill={CREAM} />
        {/* full veil drawn over the head and face */}
        <path d="M110 70 q-2 -28 26 -28 q28 0 26 28 q-2 14 -8 22 q-22 8 -38 -2 q-6 -8 -6 -20 Z" fill={CREAM} />
        <path d="M118 56 q18 -8 34 0" stroke={INK} strokeWidth="1.6" opacity="0.35" fill="none" />
      </g>
      {/* Admetus, right, reaching toward her in wonder */}
      <g fill={INK}>
        <path d="M214 158 q8 -50 -4 -74 q-7 -16 -22 -14 q-12 2 -16 16 q4 30 2 72 q20 7 40 0 Z" />
        {head(196, 52, { r: 12 })}
        <path d="M178 76 q-16 0 -22 10" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
    </S>
  );

  // Πρόλογος (Τρῳάδες) — Poseidon (black) & Athena (white) over fallen Troy
  const Gods = ({ size = 250, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* the smoking walls of Troy along the base */}
      <path d="M10 158 L10 132 L30 132 L30 120 L52 120 L52 134 L74 134 L74 118 L98 118 L98 136 L120 136 L120 124 L120 158 Z" fill={INK} opacity="0.85" />
      <path d="M150 158 L150 130 L172 130 L172 118 L196 118 L196 134 L220 134 L220 122 L240 122 L240 158 Z" fill={INK} opacity="0.85" />
      <path d="M40 120 q-4 -14 4 -22 M86 118 q4 -14 -4 -22 M180 118 q-4 -14 4 -22" stroke={ground} strokeWidth="2.5" fill="none" opacity="0.6" />
      {/* Poseidon (black), left, trident */}
      <g fill={INK}>
        <path d="M44 116 q-8 -46 4 -68 q7 -16 22 -14 q12 2 16 16 q-4 28 -2 66 q-20 7 -40 0 Z" />
        {head(64, 32, { r: 12 })}
        <path d="M54 36 q12 -10 22 0" stroke={ground} strokeWidth="2" fill="none" opacity="0.6" />
        <path d="M54 38 q-2 14 10 18 q12 -4 10 -18 Z" />
      </g>
      <path d="M30 8 L34 110" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M22 14 L30 8 L38 14 M30 8 L30 -2" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* Athena (white), right, helm, spear, owl */}
      <g>
        <path d="M196 116 q8 -46 -4 -68 q-7 -16 -22 -14 q-12 2 -16 16 q4 28 2 66 q20 7 40 0 Z" fill={CREAM} />
        <path d="M170 34 q-12 0 -12 -12 q0 -12 12 -13 q12 1 12 13 q0 12 -12 12 Z" fill={CREAM} />
        <path d="M158 18 q12 -12 24 0 q4 -10 -2 -16 q-12 -2 -22 6 q-4 6 0 10 Z" fill={CREAM} />
        <circle cx="166" cy="32" r="2" fill={INK} />
      </g>
      <path d="M222 8 L214 110" stroke={CREAM} strokeWidth="4" strokeLinecap="round" />
      <path d="M222 8 L216 18 L228 16 Z" fill={CREAM} />
    </S>
  );

  // Η Κασσάνδρα (Τρῳάδες) — the maddened prophetess, torch raised, hair streaming
  const Cassandra = ({ size = 220, ground }) => (
    <S vb="0 0 200 170" w={size} h={size * 170 / 200}>
      <g>
        {/* whirling body, head thrown back */}
        <path d="M70 158 q-12 -50 0 -78 q8 -18 26 -14 q16 4 16 22 q-2 34 -8 70 q-18 7 -34 0 Z" fill={CREAM} />
        {/* streaming wild hair */}
        <path d="M96 30 q18 -16 30 -6 q-10 2 -14 10 q12 -2 18 6 q-14 0 -22 6" fill={CREAM} />
        {head(86, 44, { col: CREAM, r: 13 })}
        <circle cx="90" cy="40" r="2.2" fill={INK} />
        {/* both arms — one lifting the torch high */}
        <path d="M104 70 q26 -10 34 -40" stroke={CREAM} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M70 76 q-16 6 -16 24" stroke={CREAM} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {/* the raised wedding-torch, flaming */}
      <path d="M138 30 L150 70" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M138 30 q-8 -18 0 -30 q10 14 18 6 q-2 16 -8 22 q-6 4 -10 2 Z" fill={ground} />
      <path d="M138 28 q-4 -10 0 -18" stroke={CREAM} strokeWidth="2" fill="none" opacity="0.6" />
    </S>
  );

  // Η Ανδρομάχη (Τρῳάδες) — the mother (white) clutches Astyanax (white) close
  const Child = ({ size = 220, ground }) => (
    <S vb="0 0 200 170" w={size} h={size * 170 / 200}>
      <g>
        <path d="M62 158 q-8 -54 6 -80 q7 -16 24 -14 q14 2 18 18 q-2 36 -10 76 q-22 7 -38 0 Z" fill={CREAM} />
        <path d="M66 56 q-2 -22 26 -22 q26 0 24 22 q-2 12 -10 16 q-22 6 -34 -4 q-4 -6 -6 -12 Z" fill={CREAM} />
        <circle cx="90" cy="54" r="2.2" fill={INK} />
        {/* both arms enfolding the child against her breast */}
        <path d="M112 86 q22 6 22 30" stroke={CREAM} strokeWidth="10" fill="none" strokeLinecap="round" />
        <path d="M74 90 q-6 18 12 28" stroke={CREAM} strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
      {/* Astyanax, held close, small face turned out */}
      <g>
        <path d="M104 138 q-4 -28 14 -30 q16 -2 16 18 q-2 14 -8 22 q-12 4 -22 -10 Z" fill={CREAM} />
        {head(116, 104, { col: CREAM, r: 9 })}
        <circle cx="113" cy="103" r="1.8" fill={INK} />
      </g>
    </S>
  );

  // Η Πτώση (Τρῳάδες) — Troy burns; a captive woman led, the ship waits
  const TroyFall = ({ size = 250, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* burning towers (black) with flame (ground) */}
      <path d="M26 158 L26 70 L40 70 L40 56 L56 56 L56 72 L70 72 L70 60 L84 60 L84 158 Z" fill={INK} />
      <path d="M30 56 q-8 -18 2 -30 q8 14 16 6 q-2 16 -10 22 q-6 4 -8 2 Z" fill={ground} opacity="0.9" />
      <path d="M62 60 q-6 -14 2 -24 q6 12 14 4 q-2 14 -8 20 Z" fill={ground} opacity="0.8" />
      <path d="M40 92 L70 92 M30 112 L84 112 M40 132 L80 132" stroke={ground} strokeWidth="2" opacity="0.4" />
      {/* captive woman (white), led away, looking back */}
      <g>
        <path d="M126 158 q-6 -50 6 -72 q6 -14 20 -12 q14 2 16 16 q-2 32 -8 68 q-18 7 -34 0 Z" fill={CREAM} />
        <path d="M128 60 q-2 -20 24 -20 q24 0 22 20 q-2 12 -10 15 q-20 6 -30 -4 q-5 -5 -6 -11 Z" fill={CREAM} />
        <circle cx="150" cy="58" r="2.1" fill={INK} />
        <path d="M124 88 q-14 4 -16 18" stroke={CREAM} strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
      {/* the waiting ship */}
      <path d="M210 92 L240 100 Q240 116 212 116 Z" fill={CREAM} />
      <path d="M210 90 L210 132" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M186 134 q4 12 30 12 q24 0 28 -10 q-4 8 -22 12 q-26 4 -42 -4 q-2 -10 6 -22 Z" fill={INK} />
      <path d="M214 158 Q230 152 246 158" stroke={ground} strokeWidth="2.4" fill="none" opacity="0.7" />
    </S>
  );

  // the travelling marker — a tragic mask gliding down the spine
  const Mask = ({ size = 90, ground }) => (
    <S vb="0 0 90 104" w={size} h={size * 104 / 90}>
      <path d="M16 14 Q45 4 74 14 Q80 44 70 78 Q62 98 45 100 Q28 98 20 78 Q10 44 16 14 Z" fill={INK} />
      <path d="M16 14 Q45 22 74 14" stroke={ground} strokeWidth="2.2" fill="none" opacity="0.5" />
      {/* hollow eyes */}
      <path d="M26 40 Q34 34 42 40 Q34 46 26 40 Z" fill={ground} />
      <path d="M48 40 Q56 34 64 40 Q56 46 48 40 Z" fill={ground} />
      {/* tragic open mouth, downturned */}
      <path d="M34 74 Q45 66 56 74 Q50 84 45 84 Q40 84 34 74 Z" fill={ground} />
      <path d="M45 50 L45 60" stroke={ground} strokeWidth="2" opacity="0.5" />
    </S>
  );

  const FIG = {
    mask: Mask,
    archer: Archer, castaway: Castaway, libation: Libation, priestess: Priestess,
    mourners: Mourners, heracles: Heracles, elders: Elders, trial: Trial, hecuba: Hecuba, shieldbody: ShieldBody,
    eidolon: Eidolon, reunion: Reunion, dioscuri: Dioscuri, apolloDeath: ApolloDeath, bier: Bier,
    wrestle: Wrestle, veilreturn: VeilReturn, gods: Gods, cassandra: Cassandra, child: Child, troyfall: TroyFall,
  };
  function BF({ name, size, ground = '#B45A30' }) { const C = FIG[name] || Archer; return <C size={size} ground={ground} />; }
  Object.assign(window, { BF, BF_FIG: FIG });
})();
