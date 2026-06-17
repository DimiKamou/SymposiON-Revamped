/* ════════════════════════════════════════════════════════════════════
   Οδύσσεια — Η Ζωφόρος του Νόστου
   Black-figure silhouette library. Iconographic, archaic-vase style.
   · Male figures  → black slip  (INK), incisions cut in the terracotta GROUND
   · Female figures → added white (CREAM), incisions cut in INK
   Each figure reads as a single emblem or a 2–3 figure scene.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const INK = '#171009';
  const CREAM = '#ECDDBF';

  // svg wrapper — keeps aspect from viewBox, drop-shadow like fired slip
  function S({ vb, w, h, children, cls }) {
    return (
      <svg className={cls} viewBox={vb} width={w} height={h} role="img"
           style={{ display: 'block', overflow: 'visible' }}>
        {children}
      </svg>
    );
  }

  /* ════════════ EMBLEMS — single symbolic silhouettes ════════════ */

  // α–δ · Telemachy — a galley sets sail
  const Ship = ({ size = 130, ground }) => (
    <S vb="0 0 170 120" w={size} h={size * 120 / 170} cls="bf">
      {/* sail */}
      <path d="M86 16 L150 28 Q150 60 88 60 Z" fill={CREAM} />
      <path d="M100 24 L100 58 M116 27 L116 59 M132 30 L132 60" stroke={ground} strokeWidth="2" fill="none" opacity="0.55" />
      {/* mast + yard */}
      <path d="M86 14 L86 78 M70 24 L150 24" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
      {/* hull — high curved stern (left), ramming prow + eye (right) */}
      <path d="M10 78 Q8 60 20 64 Q24 70 34 72 L150 72 Q166 72 160 84 Q150 96 84 96 Q34 96 24 86 Q14 88 10 78 Z" fill={INK} />
      <path d="M150 72 L168 70 L160 80 Z" fill={INK} />
      {/* prow eye + rowers' bench incision */}
      <circle cx="150" cy="80" r="2.6" fill={ground} />
      <path d="M30 80 L150 80" stroke={ground} strokeWidth="2" opacity="0.5" fill="none" />
      {/* oars */}
      <path d="M40 96 L34 112 M58 97 L53 113 M76 97 L72 113 M94 97 L91 113 M112 97 L110 113"
            stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* wave */}
      <path d="M6 110 Q22 104 38 110 T70 110 T102 110 T134 110 T166 110" stroke={ground} strokeWidth="2.5" fill="none" opacity="0.7" />
    </S>
  );

  // ε · Calypso / Ogygia — Odysseus adrift on his raft
  const Raft = ({ size = 130, ground }) => (
    <S vb="0 0 160 120" w={size} h={size * 120 / 160} cls="bf">
      {/* little sail */}
      <path d="M80 26 L120 36 Q120 58 82 58 Z" fill={CREAM} />
      <path d="M80 22 L80 70" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      {/* seated longing figure */}
      <path d="M60 70 q4 -16 12 -16 q9 0 9 12 l-2 8 q-8 4 -19 -4 Z" fill={INK} />
      <circle cx="66" cy="50" r="6" fill={INK} />
      <path d="M62 70 q-10 0 -12 8" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* raft logs */}
      <path d="M34 80 L126 80 Q132 80 132 86 Q132 92 126 92 L34 92 Q28 92 28 86 Q28 80 34 80 Z" fill={INK} />
      <path d="M40 86 L122 86" stroke={ground} strokeWidth="2" opacity="0.5" />
      {/* waves */}
      <path d="M6 102 Q24 96 42 102 T78 102 T114 102 T150 102" stroke={ground} strokeWidth="2.6" fill="none" opacity="0.8" />
      <path d="M14 112 Q32 107 50 112 T86 112 T122 112 T154 112" stroke={ground} strokeWidth="2.2" fill="none" opacity="0.5" />
    </S>
  );

  // κ · Circe — the enchantress' kylix + wand
  const Kylix = ({ size = 120, ground }) => (
    <S vb="0 0 130 120" w={size} h={size * 120 / 130} cls="bf">
      {/* wand crossing behind */}
      <path d="M18 104 L104 22" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M104 22 q8 -6 4 -14" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
      {/* kylix bowl */}
      <path d="M30 52 Q65 52 100 52 Q94 78 65 78 Q36 78 30 52 Z" fill={INK} />
      {/* handles */}
      <path d="M28 54 Q14 58 22 70" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M102 54 Q116 58 108 70" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
      {/* stem + foot */}
      <path d="M65 78 L65 98 M48 100 L82 100" stroke={INK} strokeWidth="6" strokeLinecap="round" fill="none" />
      {/* eye-band incision on bowl */}
      <path d="M40 58 Q65 64 90 58" stroke={ground} strokeWidth="2.4" fill="none" opacity="0.6" />
      <circle cx="56" cy="60" r="2.4" fill={ground} /><circle cx="74" cy="60" r="2.4" fill={ground} />
    </S>
  );

  // λ · Nekuia — a shade rises above the blood-pit
  const Shade = ({ size = 120, ground }) => (
    <S vb="0 0 130 130" w={size} h={size * 130 / 130} cls="bf">
      {/* drinking-pit + sword */}
      <path d="M34 104 Q65 96 96 104 Q96 116 65 116 Q34 116 34 104 Z" fill={INK} />
      <path d="M96 60 L104 100" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M96 60 L88 66 M96 60 L104 66" stroke={INK} strokeWidth="4" fill="none" strokeLinecap="round" />
      {/* the shade — ghostly added-white, dissolving below */}
      <path d="M52 30 q0 -16 13 -16 q13 0 13 16 l0 30 q6 4 6 16 q-4 12 -10 22 q-3 8 -9 8 q-6 0 -9 -8 q-6 -10 -10 -22 q0 -12 6 -16 Z"
            fill={CREAM} opacity="0.92" />
      <circle cx="60" cy="26" r="2.2" fill={INK} /><circle cx="70" cy="26" r="2.2" fill={INK} />
      <path d="M58 84 q7 6 14 0 M54 94 q11 8 22 0" stroke={INK} strokeWidth="1.8" fill="none" opacity="0.5" />
    </S>
  );

  // μ · Sirens — bird-bodied singer on a rock
  const Siren = ({ size = 120, ground }) => (
    <S vb="0 0 120 130" w={size} h={size * 130 / 120} cls="bf">
      {/* rock */}
      <path d="M20 112 Q40 100 60 104 Q82 100 100 112 Z" fill={INK} />
      {/* tail / talons */}
      <path d="M60 70 q-18 14 -26 38 q22 -6 30 -10 q8 4 30 10 q-8 -24 -26 -38 Z" fill={INK} />
      {/* breast + neck */}
      <path d="M48 44 q0 -8 12 -8 q12 0 12 8 q0 18 -4 30 q-8 6 -16 0 q-4 -12 -4 -30 Z" fill={INK} />
      {/* woman's head, profile */}
      <circle cx="60" cy="28" r="13" fill={CREAM} />
      <path d="M60 16 q-13 -2 -14 12 q0 6 4 10" fill={CREAM} />
      <circle cx="64" cy="27" r="2.3" fill={INK} />
      <path d="M71 30 q4 1 6 4" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
      {/* wing incisions */}
      <path d="M44 58 q-6 6 -4 16 M76 58 q6 6 4 16" stroke={ground} strokeWidth="2" fill="none" opacity="0.55" />
    </S>
  );

  // χ · Mnesterophonia — the great bow strung, arrow through the axes
  const Bow = ({ size = 130, ground }) => (
    <S vb="0 0 170 120" w={size} h={size * 120 / 170} cls="bf">
      {/* row of twelve axe-heads (abbreviated to seven) */}
      <g fill={INK}>
        {[0,1,2,3,4,5,6].map(i => (
          <g key={i} transform={`translate(${64 + i*15} 40)`}>
            <path d="M0 0 L8 0 L8 40 L0 40 Z" />
            <path d="M0 4 q-7 6 0 12 Z" />
          </g>
        ))}
      </g>
      <path d="M64 84 L168 84" stroke={INK} strokeWidth="3" />
      {/* the bow — drawn */}
      <path d="M30 14 Q58 50 30 92" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M30 14 L30 92" stroke={INK} strokeWidth="2.5" fill="none" />
      {/* arrow flying right through the helves */}
      <path d="M30 52 L160 52" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <path d="M160 52 L150 46 M160 52 L150 58" stroke={INK} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      <path d="M30 52 L40 47 M30 52 L40 57" stroke={INK} strokeWidth="2.6" fill="none" strokeLinecap="round" />
    </S>
  );

  /* ════════════ HERO SCENES — figural compositions ════════════ */

  // α · Proem — the poet invokes the Muse at her lyre
  const Muse = ({ size = 230, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250} cls="bf">
      {/* —— the Muse (added white), seated, playing the kithara —— */}
      <g>
        {/* stool */}
        <path d="M150 132 L150 158 M214 132 L214 158 M146 158 L158 158 M210 158 L222 158" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        <path d="M148 130 L216 130 L216 138 L148 138 Z" fill={INK} />
        {/* seated body / chiton */}
        <path d="M160 132 q-2 -34 12 -52 q6 -6 16 -6 q16 0 22 16 q8 18 6 42 q-28 8 -56 0 Z" fill={CREAM} />
        <path d="M172 90 L168 130 M188 84 L190 130 M204 92 L210 130" stroke={INK} strokeWidth="1.6" opacity="0.45" fill="none" />
        {/* arms to the strings */}
        <path d="M170 96 q-16 8 -22 26" stroke={CREAM} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M196 92 q14 6 18 24" stroke={CREAM} strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* head + bound hair */}
        <circle cx="176" cy="58" r="13" fill={CREAM} />
        <path d="M176 45 q-15 0 -14 16 q0 5 3 9" fill={CREAM} />
        <circle cx="168" cy="48" r="5" fill={CREAM} />
        <circle cx="172" cy="57" r="2.2" fill={INK} />
        <path d="M163 60 q-4 1 -6 4" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* the kithara (black) cradled in her lap */}
        <path d="M120 78 Q116 110 132 128 Q150 132 156 110 L150 80 Q134 72 120 78 Z" fill={INK} />
        <path d="M126 84 L150 84 M124 96 L152 96 M124 108 L150 116" stroke={ground} strokeWidth="1.8" opacity="0.6" fill="none" />
        <path d="M120 78 L108 58 M150 80 L150 56 M108 58 L150 56" stroke={INK} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M114 60 L114 80 M122 58 L122 80 M132 57 L132 82 M142 56 L142 80"
              stroke={INK} strokeWidth="1.6" opacity="0.85" fill="none" />
      </g>
      {/* —— the singer (black), standing, hand raised in song —— */}
      <g fill={INK}>
        <path d="M58 158 q-4 -42 4 -64 q4 -12 16 -12 q14 0 18 14 q6 22 2 62 q-20 6 -40 0 Z" />
        <circle cx="74" cy="60" r="13" />
        <path d="M74 47 q14 0 14 14 q0 6 -3 9" />
      </g>
      {/* his raised arm + staff (rhapsode's rod) */}
      <path d="M82 78 q22 -6 30 -28" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M108 14 L92 96" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M60 84 q-12 6 -10 22" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      <path d="M70 62 q-4 1 -6 4" stroke={ground} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
    </S>
  );

  // ζ–θ · Nausicaa — the princess (white) meets the suppliant castaway (black)
  const Nausicaa = ({ size = 230, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250} cls="bf">
      {/* attendant with washing-basket (white), far left */}
      <g opacity="0.96">
        <path d="M14 158 q-3 -34 3 -52 q3 -9 12 -9 q11 0 14 11 q4 16 1 50 q-15 5 -30 0 Z" fill={CREAM} />
        <circle cx="29" cy="56" r="10" fill={CREAM} />
        <path d="M28 70 q-12 4 -16 16" stroke={CREAM} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M2 92 L24 92 L20 108 L6 108 Z" fill={CREAM} />
        <path d="M2 92 Q13 84 24 92" stroke={CREAM} strokeWidth="3" fill="none" />
      </g>
      {/* —— Nausicaa (white), centre-left, offering folded raiment —— */}
      <g>
        <path d="M70 158 q-5 -46 5 -68 q5 -14 18 -14 q16 0 20 16 q6 24 1 66 q-22 7 -44 0 Z" fill={CREAM} />
        <path d="M82 90 L78 156 M96 84 L98 156 M110 92 L112 150" stroke={INK} strokeWidth="1.6" opacity="0.4" fill="none" />
        {/* head, diadem, bound hair */}
        <circle cx="92" cy="52" r="14" fill={CREAM} />
        <path d="M92 38 q-16 0 -15 16 q0 6 4 10" fill={CREAM} />
        <circle cx="83" cy="42" r="6" fill={CREAM} />
        <path d="M79 44 Q92 36 105 44" stroke={INK} strokeWidth="2" fill="none" opacity="0.7" />
        <circle cx="96" cy="51" r="2.3" fill={INK} />
        <path d="M104 54 q4 1 6 4" stroke={INK} strokeWidth="2" fill="none" strokeLinecap="round" />
        {/* arm extending the folded cloth toward Odysseus */}
        <path d="M108 92 q24 -4 36 8" stroke={CREAM} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M138 88 L168 92 L164 110 L134 106 Z" fill={CREAM} />
        <path d="M138 96 L166 99 M136 102 L164 105" stroke={INK} strokeWidth="1.4" opacity="0.4" />
      </g>
      {/* —— Odysseus (black) — suppliant, kneeling from the thicket —— */}
      <g fill={INK}>
        {/* bush / thicket he rises from */}
        <path d="M214 150 q-18 -4 -24 -22 q-14 4 -22 -8 q-8 14 6 22 q-10 10 4 18 q24 6 56 0 q4 -8 -20 -10 Z" opacity="0.92" />
        {/* crouching body */}
        <path d="M176 150 q-6 -22 6 -34 q8 -8 20 -4 q14 6 12 22 q-2 14 -8 20 q-16 4 -30 -4 Z" />
        {/* reaching arm — suppliant gesture */}
        <path d="M186 120 q-16 -2 -24 -16" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
        {/* head + beard, turned to her */}
        <circle cx="196" cy="104" r="12" />
        <path d="M186 108 q-2 14 10 18 q12 -4 10 -18 Z" />
      </g>
      <path d="M160 110 q4 -2 8 0" stroke={ground} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    </S>
  );

  // ι · Polyphemus — Odysseus and his men drive the stake into the Cyclops' eye
  const Cyclops = ({ size = 230, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250} cls="bf">
      {/* —— the Cyclops (black), reclining giant, head thrown back —— */}
      <g fill={INK}>
        <path d="M150 150 q-16 -2 -18 -26 q-2 -30 22 -42 q26 -14 50 4 q22 18 18 48 q-2 16 -14 18 q-30 6 -58 -2 Z" />
        {/* thrown-back head */}
        <path d="M196 70 q22 -8 34 6 q12 14 2 30 q-12 14 -30 8 q-14 -6 -14 -24 q0 -14 8 -20 Z" />
        {/* sprawled arm + wine cup slipping */}
        <path d="M150 132 q-22 4 -34 -8" stroke={INK} strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M112 118 q-12 2 -16 -6 q10 -6 18 -2 Z" />
        {/* leg */}
        <path d="M168 150 q-2 12 -14 16" stroke={INK} strokeWidth="12" fill="none" strokeLinecap="round" />
      </g>
      {/* the single eye (added white, wide) + the burning stake plunged in */}
      <ellipse cx="212" cy="88" rx="11" ry="8" fill={CREAM} />
      <circle cx="210" cy="88" r="3.4" fill={INK} />
      <path d="M70 64 L208 86" stroke={INK} strokeWidth="7" strokeLinecap="round" />
      <path d="M208 86 q10 -6 16 0 q-4 8 -14 6 Z" fill={ground} opacity="0.9" />
      <path d="M62 60 q-10 -8 4 -14 q10 6 6 16 Z" fill={INK} />
      {/* —— three men (black) heaving on the stake —— */}
      <g fill={INK}>
        {[{x:34,y:96},{x:62,y:108},{x:90,y:118}].map((m,i) => (
          <g key={i} transform={`translate(${m.x} ${m.y})`}>
            <path d="M0 52 q-4 -22 4 -32 q5 -7 14 -5 q11 4 9 18 q-2 14 -6 20 q-12 4 -21 -1 Z" />
            <circle cx="9" cy="6" r="9" />
            {/* arms gripping the shaft (which runs up-right) */}
            <path d="M6 18 q14 -8 28 -16" stroke={INK} strokeWidth="7" fill="none" strokeLinecap="round" />
          </g>
        ))}
      </g>
    </S>
  );

  // ν–φ · Anagnorisis — Odysseus (black, bearded) and Telemachus (black, youth) embrace
  const Embrace = ({ size = 210, ground }) => (
    <S vb="0 0 220 170" w={size} h={size * 170 / 220} cls="bf">
      {/* leaning spear of the returned man */}
      <path d="M188 12 L172 158" stroke={INK} strokeWidth="4" strokeLinecap="round" />
      <path d="M188 12 L182 24 L194 22 Z" fill={INK} />
      {/* —— Odysseus (black, bearded, pilos cap), left, the taller —— */}
      <g fill={INK}>
        <path d="M52 158 q-8 -56 4 -84 q6 -16 22 -16 q10 0 16 8 q-2 30 -2 92 q-22 8 -40 0 Z" />
        {/* pilos cap + head */}
        <path d="M72 56 q-14 0 -14 -12 q0 -12 14 -14 q14 2 14 14 q0 12 -14 12 Z" />
        <path d="M58 40 q14 -10 28 0" stroke={ground} strokeWidth="2" fill="none" opacity="0.6" />
        {/* beard */}
        <path d="M62 60 q-2 16 10 20 q12 -4 10 -20 Z" />
        {/* enfolding arm across the youth's shoulders */}
        <path d="M88 78 q34 -2 54 16" stroke={INK} strokeWidth="11" fill="none" strokeLinecap="round" />
      </g>
      {/* —— Telemachus (black, youth, fillet), right, looking up —— */}
      <g fill={INK}>
        <path d="M150 158 q8 -50 -2 -74 q-6 -14 -20 -14 q-10 0 -15 8 q4 26 3 80 q18 7 34 0 Z" />
        {/* young head, fillet, curls */}
        <circle cx="138" cy="64" r="13" />
        <path d="M126 60 q12 -10 26 0" stroke={ground} strokeWidth="2.2" fill="none" opacity="0.7" />
        {/* his arm clasping Odysseus' waist */}
        <path d="M126 92 q-22 -2 -34 12" stroke={INK} strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
      {/* the two faces nearly touching — incised cheek lines */}
      <path d="M84 66 q4 -3 8 0 M146 70 q-4 -3 -8 0" stroke={ground} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7" />
    </S>
  );

  // ψ–ω · The Recognition — Penelope (white, the mourning pose) + Odysseus (black) by the loom
  const Penelope = ({ size = 230, ground }) => (
    <S vb="0 0 250 170" w={size} h={size * 170 / 250} cls="bf">
      {/* —— the loom (black), behind, half-woven web —— */}
      <g>
        <path d="M150 18 L150 150 M236 18 L236 150 M140 18 L246 18" stroke={INK} strokeWidth="5" strokeLinecap="round" fill="none" />
        <path d="M160 22 L160 130 M174 22 L174 130 M188 22 L188 130 M202 22 L202 130 M216 22 L216 130 M228 22 L228 130"
              stroke={INK} strokeWidth="1.8" opacity="0.7" fill="none" />
        {/* woven section */}
        <path d="M150 18 L236 18 L236 70 L150 70 Z" fill={INK} opacity="0.16" />
        <path d="M150 40 L236 40 M150 56 L236 56" stroke={INK} strokeWidth="2.4" opacity="0.5" />
        {/* hanging loom-weights */}
        <circle cx="160" cy="142" r="4" fill={INK} /><circle cx="188" cy="146" r="4" fill={INK} /><circle cx="216" cy="142" r="4" fill={INK} />
      </g>
      {/* —— Penelope (added white), seated, head on hand — the mourning pose —— */}
      <g>
        {/* klismos chair */}
        <path d="M96 96 L132 96 L130 150 L98 150 Z" fill={INK} />
        <path d="M132 96 Q146 80 138 64" stroke={INK} strokeWidth="5" fill="none" strokeLinecap="round" />
        <path d="M96 150 L92 164 M132 150 L136 164" stroke={INK} strokeWidth="4" strokeLinecap="round" />
        {/* draped seated body + veil */}
        <path d="M92 150 q-4 -40 8 -58 q8 -12 22 -10 q14 2 16 18 q2 30 -2 50 q-22 6 -44 0 Z" fill={CREAM} />
        <path d="M100 100 L96 148 M114 92 L116 146 M128 104 L126 142" stroke={INK} strokeWidth="1.5" opacity="0.4" fill="none" />
        {/* veil over bowed head */}
        <path d="M98 70 q0 -20 20 -20 q22 0 22 22 q0 10 -6 16 q-18 6 -36 -4 q-2 -8 0 -14 Z" fill={CREAM} />
        <circle cx="116" cy="68" r="2.2" fill={INK} />
        {/* the supporting arm — elbow to knee, hand to cheek */}
        <path d="M108 96 q-14 6 -12 24" stroke={CREAM} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M118 84 q14 2 12 -16" stroke={CREAM} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      {/* —— Odysseus (black), standing, leaning on staff, regarding her —— */}
      <g fill={INK}>
        <path d="M30 158 q-6 -48 4 -72 q6 -14 20 -14 q12 0 16 12 q-2 28 -2 74 q-20 7 -38 0 Z" />
        <path d="M52 60 q-14 0 -14 -12 q0 -12 14 -13 q13 1 13 13 q0 12 -13 12 Z" />
        <path d="M42 62 q-2 16 10 20 q12 -4 10 -20 Z" />
        {/* arm toward her */}
        <path d="M70 86 q12 0 18 8" stroke={INK} strokeWidth="9" fill="none" strokeLinecap="round" />
      </g>
      <path d="M26 30 L26 158" stroke={INK} strokeWidth="4" strokeLinecap="round" />
    </S>
  );

  const FIG = {
    ship: Ship, raft: Raft, kylix: Kylix, shade: Shade, siren: Siren, bow: Bow,
    muse: Muse, nausicaa: Nausicaa, cyclops: Cyclops, embrace: Embrace, penelope: Penelope,
  };

  function BF({ name, size, ground = '#B45A30' }) {
    const C = FIG[name] || Ship;
    return <C size={size} ground={ground} />;
  }

  Object.assign(window, { BF, BF_FIG: FIG });
})();
