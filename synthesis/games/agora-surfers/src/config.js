/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — config.js
   Palette (bright sunlit agora) + tunable game constants.
════════════════════════════════════════════════════════════════ */

/* Bright, saturated, cheerful — true Subway-Surfers energy
   but grounded in an ancient-Greek marble palette. */
export const PAL = {
  // sky / atmosphere
  skyTop:   0x2E8BD6,   // deep aegean blue
  skyMid:   0x83C7F0,   // bright daylight blue
  skyHorizon: 0xFBEFD6, // warm cream haze at the horizon
  sun:      0xFFF3D0,
  fog:      0xCDE6F5,   // pale blue daytime haze (matches sky low-band)

  // marble road
  marble:    0xF2ECDC,
  marbleLt:  0xFBF7EC,
  marbleDk:  0xD8CCB2,
  laneLine:  0xE8B23C,  // warm gold lane dividers
  roadEdge:  0xC97A4E,  // terracotta kerb

  // architecture
  column:    0xF4EEDD,
  columnDk:  0xD9CDB0,
  roofTile:  0xCB5E40,  // terracotta roofs
  roofTileDk:0xA8462C,
  pediment:  0xEFE6CE,

  // foliage / ground beyond road
  grass:     0x8AA94F,
  grassDk:   0x6E8B3C,
  olive:     0x7C9355,
  oliveDk:   0x566B39,
  trunk:     0x8A6A45,
  cypress:   0x4E6B3A,

  // citizen runner (chiton athlete)
  skin:      0xE0A878,
  skinDk:    0xC98A5C,
  chiton:    0xFBF6EA,   // white/cream tunic
  chitonSh:  0xDCD2BC,
  sash:      0x1E6FB8,   // aegean-blue sash
  hair:      0x4A3526,
  laurel:    0x6E8B3C,

  // Talos — bronze automaton chaser
  bronze:    0xB9813E,
  bronzeLt:  0xE0A94E,
  bronzeDk:  0x7E5523,
  verdigris: 0x4FB39A,   // oxidised copper-green accents
  talosEye:  0xFF7A2E,   // molten orange glow

  // collectibles
  drachma:   0xF4C64A,
  drachmaDk: 0xB98A22,
  drachmaEm: 0xFFE9A8,

  // power-ups
  hermes:    0xF0A830,   // magnet — golden Hermes winged sandals
  aegis:     0xC9A227,   // shield — gold aegis
  aegisRim:  0xEAD27A,
  dash:      0xE8553C,   // speed — terracotta-red
  terra:     0xD9573D,   // terracotta accent (female sash)
  multiplier:0x6FBF73,   // score — olive/sage green laurel
  chariot:   0xEAC44A,   // flying chariot (hoverboard)

  // UI feedback
  correct:   0x5BB85C,
  wrong:     0xD84B3A,
};

export const G = {
  // lanes (x positions)
  LANE_X: [-2.7, 0, 2.7],
  LANE_SWAP: 0.13,        // seconds to glide between lanes (snappy)

  // physics
  GRAVITY:   58,
  JUMP_VEL:  19.5,
  SLIDE_DUR: 0.7,         // seconds in a slide/roll

  // forward speed (units / sec)
  BASE_SPEED: 17,
  SPEED_RAMP: 0.32,       // added per second of running
  MAX_SPEED:  40,
  DASH_SPEED: 30,         // speed while dash power-up active
  Q_SLOWDOWN: 0.45,       // speed multiplier while a question is shown

  // scoring
  COIN_VAL:    10,
  DIST_VAL:    1,         // points per metre
  Q_CORRECT:   250,
  Q_STREAK:    80,

  // question pacing — questions are now your lifeline, so they come often
  Q_TIME:      10,        // seconds to answer
  Q_GAP_MIN:   11,        // seconds between questions (min)
  Q_GAP_MAX:   15,

  // ── Chaser (Talos). chaseGap: large = far behind, 0 = on your heels.
  //    Talos NEVER rests — he drains the gap continuously and the drain
  //    ramps up over the run, so survival depends on answering correctly
  //    and clean play. Mistakes hand him big chunks instantly.
  CHASE_START:    20,     // gap at the start of a run
  CHASE_MAX:      24,     // cap (best you can buy back)
  CHASE_CAUGHT:   1.0,    // gap at which he grabs you → game over
  CHASE_DRAIN:    0.5,    // base gap lost per second (always pressing)
  CHASE_DRAIN_RAMP: 1.4,  // extra drain/sec added across the difficulty curve
  CHASE_CORRECT:  9.0,    // gap bought back by a correct answer
  CHASE_STREAK:   1.0,    // extra push per streak step
  CHASE_WRONG:    5.0,    // gap lost on a wrong answer
  CHASE_HIT:      3.5,    // gap lost when you crash into an obstacle
  CHASE_COIN:     0.05,   // tiny gap bought back per coin (reward flow)
  CHASE_DODGE:    0.3,    // gap bought back per obstacle cleared in-lane
  CHASE_LUNGE:    0.9,    // brief extra surge tacked on after any mistake

  // world / recycling
  CHUNK:        14,       // spacing between content rows (m)
  DRAW_AHEAD:   210,      // how far ahead we keep populated
  RECYCLE_BEHIND: 18,     // recycle once this far behind camera

  // power-up durations (seconds)
  PU_MAGNET:    8,
  PU_SHIELD:    9,
  PU_DASH:      4.5,
  PU_MULT:      10,
  PU_CHARIOT:   8.5,
  MAGNET_RADIUS: 6,

  // camera — low & tight for the Subway-Surfers punch (runner reads big,
  // road fills the lower frame, horizon rides high)
  CAM_Y: 4.9,
  CAM_Z: 9.8,
  CAM_LOOK_Y: 1.35,
  CAM_LOOK_Z: -24,
};

/* obstacle action types */
export const ACT = { DODGE: 'dodge', JUMP: 'jump', SLIDE: 'slide' };

/* small util */
export const lerp = (a, b, t) => a + (b - a) * t;
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
/* frame-rate independent damping (Freya Holmer style) */
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt));
export const rand = (a, b) => a + Math.random() * (b - a);
export const choice = (arr) => arr[(Math.random() * arr.length) | 0];
