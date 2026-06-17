/* ════════════════════════════════════════════════════════════════════
   Ἰλιάς — Ἡ Ζωφόρος τῆς Μήνιδος
   Black-figure library for the Iliad. Men in black slip, women in added
   white, incisions cut in the terracotta ground. Iconic war scenes.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const INK = '#171009';
  const CREAM = '#ECDDBF';
  const S = ({ vb, w, h, children }) => (
    <svg className="bf" viewBox={vb} width={w} height={h} role="img" style={{ display: 'block', overflow: 'visible' }}>{children}</svg>
  );

  /* ════════ EMBLEMS ════════ */

  // Β–Δ · the fleet — beached war-galley with shields along the rail
  const Ship = ({ size = 130, ground }) => (
    <S vb="0 0 170 120" w={size} h={size * 120 / 170}>
      <path d="M86 16 L150 28 Q150 60 88 60 Z" fill={CREAM} />
      <path d="M86 14 L86 78 M70 24 L150 24" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
      <path d="M10 78 Q8 60 20 64 Q24 70 34 72 L150 72 Q166 72 160 84 Q150 96 84 96 Q34 96 24 86 Q14 88 10 78 Z" fill={INK} />
      <path d="M150 72 L168 70 L160 80 Z" fill={INK} />
      <circle cx="150" cy="80" r="2.6" fill={ground} />
      <g fill={ground} opacity="0.7">{[40,62,84,106,128].map(x => <circle key={x} cx={x} cy="79" r="4.5" />)}</g>
      <path d="M40 96 L34 112 M58 97 L53 113 M76 97 L72 113 M94 97 L91 113 M112 97 L110 113" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <path d="M6 110 Q22 104 38 110 T70 110 T102 110 T134 110 T166 110" stroke={ground} strokeWidth="2.5" fill="none" opacity="0.7" />
    </S>
  );

  // Β–Δ alt · clash of two hoplites — shields & spears
  const Clash = ({ size = 140, ground }) => (
    <S vb="0 0 170 130" w={size} h={size * 130 / 170}>
      {/* left hoplite */}
      <g fill={INK}>
        <path d="M30 124 q-6 -40 4 -58 q5 -10 16 -8 q4 22 2 66 q-12 4 -22 0 Z" />
        <path d="M44 50 q-12 0 -12 -12 q0 -13 14 -13 l4 2 q3 10 -2 22 q-2 1 -4 1 Z" />
        <path d="M30 24 q14 -12 22 4" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M52 70 L96 40" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="58" cy="84" r="22" fill={INK} /><circle cx="58" cy="84" r="22" fill="none" stroke={ground} strokeWidth="2.5" opacity="0.6" /><circle cx="58" cy="84" r="6" fill={ground} opacity="0.6" />
      {/* right hoplite */}
      <g fill={INK}>
        <path d="M140 124 q6 -40 -4 -58 q-5 -10 -16 -8 q-4 22 -2 66 q12 4 22 0 Z" />
        <path d="M126 50 q12 0 12 -12 q0 -13 -14 -13 l-4 2 q-3 10 2 22 q2 1 4 1 Z" />
        <path d="M140 24 q-14 -12 -22 4" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
        <path d="M118 70 L74 40" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      </g>
      <circle cx="112" cy="84" r="22" fill={INK} /><circle cx="112" cy="84" r="22" fill="none" stroke={ground} strokeWidth="2.5" opacity="0.6" /><circle cx="112" cy="84" r="6" fill={ground} opacity="0.6" />
    </S>
  );

  // Ι · the embassy — Achilles sits playing the phorminx (and refuses)
  const Lyre = ({ size = 130, ground }) => (
    <S vb="0 0 140 130" w={size} h={size * 130 / 140}>
      {/* stool */}
      <path d="M30 120 L30 100 L78 100 L78 120 M26 122 L34 122 M74 122 L82 122" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      <path d="M30 98 L80 98 L80 104 L30 104 Z" fill={INK} />
      {/* seated body */}
      <path d="M40 100 q-2 -34 12 -48 q8 -8 18 -4 q10 6 8 22 l-4 30 q-18 6 -34 0 Z" fill={INK} />
      {/* head + fillet */}
      <circle cx="54" cy="40" r="12" fill={INK} />
      <path d="M44 64 q-2 14 10 16 q12 -2 10 -16 Z" fill={INK} />
      {/* arm to strings */}
      <path d="M70 70 q18 0 24 -16" stroke={INK} strokeWidth="8" fill="none" strokeLinecap="round" />
      {/* phorminx */}
      <path d="M92 36 Q86 60 100 72 Q116 72 118 52 L110 38 Q100 32 92 36 Z" fill={INK} />
      <path d="M96 44 L110 70 M104 40 L116 60" stroke={ground} strokeWidth="1.8" opacity="0.6" />
      <path d="M92 36 L84 20 M110 38 L114 18 M84 20 L114 18" stroke={INK} strokeWidth="3.5" strokeLinecap="round" fill="none" />
      <path d="M90 22 L90 38 M98 20 L98 38 M106 20 L106 38" stroke={INK} strokeWidth="1.6" opacity="0.85" />
    </S>
  );

  // Π · Patroclus falls — a slain warrior, upright spear & helm
  const Patroclus = ({ size = 140, ground }) => (
    <S vb="0 0 170 120" w={size} h={size * 120 / 170}>
      {/* fallen body */}
      <path d="M18 92 q30 -10 60 -6 q40 4 70 2 q6 6 -2 12 q-66 12 -126 2 q-6 -4 -2 -10 Z" fill={INK} />
      <circle cx="22" cy="84" r="11" fill={INK} />
      <path d="M30 90 q-2 -10 6 -12" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
      {/* round shield slipped aside */}
      <circle cx="120" cy="92" r="20" fill={INK} /><circle cx="120" cy="92" r="6" fill={ground} opacity="0.6" />
      {/* upright spear + crested helm above the dead */}
      <path d="M150 8 L150 100" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M150 8 L144 20 L156 18 Z" fill={INK} />
      <path d="M70 44 q0 -12 14 -12 q14 0 14 12 q0 8 -6 12 q-8 4 -16 0 q-6 -4 -6 -12 Z" fill={INK} />
      <path d="M84 30 q12 -10 22 2 q-10 2 -22 -2" fill={INK} />
    </S>
  );

  // Σ · the Shield of Achilles — the forged cosmos
  const Shield = ({ size = 130, ground }) => (
    <S vb="0 0 130 130" w={size} h={size * 130 / 130}>
      <circle cx="65" cy="62" r="52" fill={INK} />
      <g fill="none" stroke={ground} strokeWidth="2.4" opacity="0.7">
        <circle cx="65" cy="62" r="44" /><circle cx="65" cy="62" r="32" /><circle cx="65" cy="62" r="19" />
      </g>
      <circle cx="65" cy="62" r="7" fill={ground} opacity="0.8" />
      {/* spokes / cosmos marks */}
      <g stroke={ground} strokeWidth="2" opacity="0.5">{[0,45,90,135,180,225,270,315].map(a => {
        const r1=19,r2=44,rad=a*Math.PI/180; return <line key={a} x1={65+r1*Math.cos(rad)} y1={62+r1*Math.sin(rad)} x2={65+r2*Math.cos(rad)} y2={62+r2*Math.sin(rad)} />;
      })}</g>
      {/* smith's hammer leaning */}
      <path d="M106 96 L120 118" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M100 90 L114 102 L108 110 L96 98 Z" fill={INK} />
    </S>
  );

  // the travelling marker — a war-chariot (biga) rolling down the frieze
  const Chariot = ({ size = 130, ground }) => (
    <S vb="0 0 176 116" w={size} h={size * 116 / 176}>
      {/* horse, galloping left */}
      <g fill={INK}>
        <path d="M44 60 q2 -15 22 -17 q14 -1 24 3 q5 1 5 6 q0 5 -6 6 q-18 3 -33 2 q-10 0 -12 1 Z" />
        <path d="M44 60 q-15 -3 -23 -15 q-3 -6 2 -9 q5 7 13 9 q4 -3 7 1 q-2 8 1 13 Z" />
        <path d="M14 38 q-9 -2 -11 5 q0 5 6 6 q5 0 9 -4 Z" />
        <path d="M22 33 l3 -8 l4 8 Z" />
        <path d="M88 50 q15 1 20 17 q-9 -2 -13 -2" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
      <path d="M44 62 L36 100 M56 63 L52 102 M74 62 L82 100 M84 60 L90 102" stroke={INK} strokeWidth="4.5" strokeLinecap="round" />
      {/* draught-pole to the car */}
      <path d="M92 64 L120 72" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {/* the car */}
      <path d="M118 92 L118 62 Q118 56 126 56 L150 56 Q156 56 156 64 L156 92 Z" fill={INK} />
      <path d="M124 66 L150 66" stroke={ground} strokeWidth="2" opacity="0.5" />
      {/* charioteer */}
      <circle cx="136" cy="44" r="9" fill={INK} />
      <path d="M128 56 q0 -13 9 -14 q10 0 10 14 Z" fill={INK} />
      {/* spoked wheel */}
      <circle cx="134" cy="96" r="18" fill="none" stroke={INK} strokeWidth="5" />
      <g stroke={INK} strokeWidth="2.4">{[0,45,90,135].map(a => { const r=a*Math.PI/180; return <line key={a} x1={134-16*Math.cos(r)} y1={96-16*Math.sin(r)} x2={134+16*Math.cos(r)} y2={96+16*Math.sin(r)} />; })}</g>
      <circle cx="134" cy="96" r="4" fill={INK} />
    </S>
  );

  /* ════════ HERO SCENES ════════ */
  // Α · The Wrath — Athena (white) seizes Achilles' (black) hair as he draws his sword
  const Wrath = ({ size = 240, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* Agamemnon (black), right, sceptred, turning away */}
      <g fill={INK} opacity="0.92">
        <path d="M206 158 q6 -50 -4 -74 q-6 -14 -20 -12 q-8 24 -4 86 q14 5 28 0 Z" />
        <circle cx="190" cy="62" r="12" />
        <path d="M180 66 q-2 14 10 18 q12 -4 10 -18 Z" />
      </g>
      <path d="M214 18 L196 150" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="214" cy="16" r="4" fill={INK} />
      {/* Achilles (black), centre — lunging, half-drawn sword */}
      <g fill={INK}>
        <path d="M96 158 q-8 -52 4 -78 q7 -16 22 -14 q12 2 16 16 q-4 30 -2 78 q-20 7 -40 -2 Z" />
        <circle cx="108" cy="56" r="13" />
        <path d="M97 60 q-2 16 11 20 q13 -4 11 -20 Z" />
        {/* sword arm reaching back-down to hilt */}
        <path d="M124 84 q18 6 22 24" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      <path d="M146 108 L150 150" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M138 112 L162 112" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {/* Athena (white), behind-left, gripping his hair, spear & helm */}
      <g>
        <path d="M34 158 q-6 -54 6 -80 q7 -16 22 -14 q10 2 14 14 q-4 32 -4 80 q-18 7 -38 0 Z" fill={CREAM} />
        <path d="M52 60 q-13 0 -13 -12 q0 -13 13 -14 q13 1 13 14 q0 12 -13 12 Z" fill={CREAM} />
        <path d="M40 40 q12 -12 24 0 q4 -10 -2 -16 q-12 -4 -22 4 q-4 6 0 12 Z" fill={CREAM} />
        {/* reaching arm grabbing Achilles' hair */}
        <path d="M64 70 q26 -6 44 -12" stroke={CREAM} strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="55" cy="58" r="2.2" fill={INK} />
      </g>
      <path d="M22 14 L30 150" stroke={CREAM} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M22 14 L17 26 L28 24 Z" fill={CREAM} />
    </S>
  );

  // Ζ · Hector & Andromache — the farewell at the Scaean gate; the child fears the crest
  const HectorAndromache = ({ size = 250, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* Hector (black), left, great crested helm, reaching */}
      <g fill={INK}>
        <path d="M50 158 q-8 -54 4 -80 q7 -16 22 -14 q12 2 16 16 q-4 32 -2 78 q-20 7 -40 0 Z" />
        {/* round shield on his back arm */}
        <path d="M52 70 q-20 4 -24 22" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
        <circle cx="26" cy="98" r="17" />
        {/* helmeted head */}
        <path d="M74 58 q-13 0 -13 -13 q0 -13 13 -14 q13 1 13 14 q0 13 -13 13 Z" />
        {/* tall horsehair crest */}
        <path d="M70 32 q-6 -16 4 -24 q14 -6 22 6 q-10 0 -14 8 q8 -2 14 4 q-12 2 -18 8 q4 -6 -2 -10 q-4 4 -6 2 Z" />
        {/* arm reaching to the child */}
        <path d="M90 78 q22 -2 34 8" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {/* Andromache (white), right, holding baby Astyanax who recoils */}
      <g>
        <path d="M196 158 q8 -50 -4 -74 q-7 -15 -22 -13 q-12 2 -16 16 q4 30 2 71 q18 7 40 0 Z" fill={CREAM} />
        <path d="M184 58 q13 0 13 -13 q0 -13 -13 -14 q-13 1 -13 14 q0 13 13 13 Z" fill={CREAM} />
        <path d="M194 46 q14 -8 12 -22 q-14 -4 -20 8 q-2 8 8 14 Z" fill={CREAM} />
        <circle cx="180" cy="55" r="2.2" fill={INK} />
        {/* her arms cradling the baby toward Hector */}
        <path d="M170 80 q-22 -2 -32 8" stroke={CREAM} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {/* baby Astyanax (white), turning back from the crest */}
      <g>
        <path d="M132 104 q-2 -16 12 -16 q12 0 12 14 q-2 10 -12 12 q-10 0 -12 -10 Z" fill={CREAM} />
        <circle cx="140" cy="86" r="8" fill={CREAM} />
        <path d="M134 84 q-6 -2 -8 2" stroke={CREAM} strokeWidth="4" fill="none" strokeLinecap="round" />
      </g>
    </S>
  );

  // Χ · The duel — Achilles drives his spear; Hector falls
  const Duel = ({ size = 250, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* Achilles (black), left, lunging */}
      <g fill={INK}>
        <path d="M28 160 q14 -8 30 -36 q8 -14 24 -10 q10 4 8 18 q-6 16 -20 30 q-18 12 -42 8 q-6 -2 0 -10 Z" />
        <path d="M70 56 q-12 -2 -10 -14 q2 -12 16 -11 q12 2 10 16 q-2 9 -16 9 Z" />
        <path d="M64 30 q-4 -14 6 -20 q12 -2 16 8 q-10 0 -12 8 q6 0 10 6 q-12 0 -16 6 q2 -6 -4 -8 Z" />
        {/* spear arm thrust */}
        <path d="M84 60 q28 6 60 24" stroke={INK} strokeWidth="8" fill="none" strokeLinecap="round" />
      </g>
      <path d="M70 58 L210 96" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M210 96 L198 90 M210 96 L200 102" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <circle cx="150" cy="84" r="20" fill={INK} /><circle cx="150" cy="84" r="6" fill={ground} opacity="0.6" />
      {/* Hector (black), right, struck, falling back */}
      <g fill={INK}>
        <path d="M214 158 q18 -6 18 -34 q0 -20 -16 -24 q-16 -4 -24 6 q4 -18 -2 -24 q-6 28 -2 76 q12 6 28 0 Z" />
        <path d="M218 60 q12 -4 14 -16 q2 -12 -12 -14 q-12 0 -12 12 q0 12 10 18 Z" />
        <path d="M214 32 q12 -10 22 2 q-10 2 -22 -2" />
        {/* dropped spear */}
        <path d="M236 100 L246 150" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </g>
    </S>
  );

  // Ω · Priam supplicates — the aged king (white) kneels upright and clasps
  //     the extended hand of the enthroned Achilles (black); Hector lies shrouded.
  const Priam = ({ size = 250, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250}>
      {/* throne + enthroned Achilles (black), right, upright */}
      <g fill={INK}>
        <path d="M176 150 L216 150 L214 102 Q196 96 178 102 Z" />
        <path d="M216 102 Q230 84 222 64 M176 150 L172 164 M214 150 L218 164" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M178 104 q-2 -38 16 -54 q9 -8 17 -3 q11 6 9 24 l-2 38 q-20 6 -40 -5 Z" />
        <circle cx="194" cy="48" r="12" />
        <path d="M184 52 q-2 14 10 18 q12 -4 10 -18 Z" />
        {/* arm extended out, level, offering his hand into open space */}
        <path d="M178 84 q-26 0 -46 4" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {/* Hector's shrouded body (white), flat in the foreground, set apart */}
      <path d="M24 154 q42 -11 90 -4 q8 5 -2 9 q-44 8 -88 2 q-6 -3 0 -7 Z" fill={CREAM} opacity="0.88" />
      <circle cx="30" cy="150" r="6" fill={CREAM} opacity="0.88" />
      {/* Priam (white), kneeling upright at a respectful distance */}
      <g>
        {/* folded kneeling drapery */}
        <path d="M82 150 q-6 -8 -2 -22 q4 -16 16 -16 L112 96 q8 2 6 22 q-2 16 -6 30 q-16 6 -34 2 Z" fill={CREAM} />
        {/* upright torso, leaning the faintest bit forward */}
        <path d="M96 118 q-4 -20 6 -34 q6 -8 16 -5 q9 4 8 18 l-2 22 q-14 5 -32 -1 Z" fill={CREAM} />
        {/* head — raised toward Achilles, not bowed down */}
        <circle cx="110" cy="74" r="11" fill={CREAM} />
        <path d="M101 78 q-2 12 9 15 q11 -3 9 -15 Z" fill={CREAM} />
        <circle cx="114" cy="73" r="2" fill={INK} />
        {/* both hands raised forward to clasp the offered hand in mid-air */}
        <path d="M118 88 q12 -3 22 -1" stroke={CREAM} strokeWidth="8" fill="none" strokeLinecap="round" />
        <path d="M116 96 q12 -2 20 -3" stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round" />
      </g>
    </S>
  );

  const FIG = {
    ship: Ship, clash: Clash, lyre: Lyre, patroclus: Patroclus, shield: Shield,
    wrath: Wrath, hectorAndromache: HectorAndromache, duel: Duel, priam: Priam,
    chariot: Chariot,
  };
  function BF({ name, size, ground = '#B45A30' }) { const C = FIG[name] || Ship; return <C size={size} ground={ground} />; }
  Object.assign(window, { BF, BF_FIG: FIG });
})();
