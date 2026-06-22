# Handoff: Ιλιάδα / Οδύσσεια Arcade — Playable Combat-Quiz Game

## Overview
A 2D side-scrolling **beat-'em-up + quiz** educational game for Greek students studying Homer.
Two campaigns — **Ιλιάδα (Iliad)** and **Οδύσσεια (Odyssey)** — each with five rhapsodies
(ραψωδίες). In each battle the player (Achilles / Odysseus) clears waves of enemies, fights a
unique boss, and between waves answers 2–3 multiple-choice questions drawn from that rhapsody.
Correct answers grant buffs; wrong answers inflict debuffs and an arrow-rain hazard.

The whole thing is rendered on a single full-screen HTML5 `<canvas>` (1600×900, letterboxed to
any viewport) with an HTML/CSS HUD layered on top and an animated CSS/SVG parallax backdrop behind.

## About the Design Files
The files in this bundle are a **fully working reference implementation written in vanilla
HTML/Canvas/JS** — they show the intended look, feel, and complete game logic. They are a
**design + behaviour reference**, not a drop-in production module. The task is to **recreate this
game in the target codebase's environment** (e.g. React + canvas, a game engine like Phaser, a
native runtime, etc.) following that project's established patterns. If there is no existing
environment, the vanilla files here run as-is (just open the HTML), and can also serve as the base
to port from. All gameplay constants, palettes, quiz content, and draw routines are spelled out in
the code and summarised below so the logic can be reproduced exactly.

## Fidelity
**High-fidelity and functional.** This is not a static mock — it is the actual game with final art
direction, palette, typography, animation, audio, balance numbers, and interactions. Recreate it
faithfully; the numbers in `data.js`/`engine.js` are tuned and should be preserved unless the team
intends to rebalance.

---

## Architecture / File Map

The game is split into small single-responsibility scripts loaded in order by the HTML shell:

| File | Role |
|---|---|
| `Iliada Arcade — Play.html` | Shell: fonts, all CSS (HUD, controls, overlays, top bar), DOM scaffold, script load order. |
| `play/data.js` | **Content/config**: `GAME_DATA` (two campaigns → rhapsodies → palette, hero, enemy, boss, quiz) + `RHAP_ORDER`. No logic. |
| `play/quiz.js` | `GAME_MODS` = the buff/debuff pools applied after quizzes. |
| `play/draw.js` | All **canvas rendering**: parallax `drawScene`, `drawWarrior` (hero/soldier/spearman), `drawBoss` (melee/giant/caster), `drawProjectile`, `drawItem`. Pure draw, no state. Exposes `window.DRAW`, `GROUND_Y` (760), `WORLD_W` (3400). |
| `play/sfx.js` | `window.SFX` — WebAudio synth (no asset files): `slash/ranged/block/parry/hurt/ult`, `init`, `setMuted`. |
| `play/bg-scenes.css` | Styles for the animated HTML/SVG backdrops (Troy beach, palace, cave, sea, etc.). |
| `battle-bg/bg.js` | Builds + animates the per-rhapsody backdrop DOM behind the canvas. Exposes `window.BG.troy(scene,key)` / `window.BG.palace(scene,key)`. |
| `play/engine.js` | **The game**: fixed-step loop, input, entities, combat, waves, AI, quiz flow, HUD, pause/mute/help, best-score, boss banner. Boots on load. |

**Load order (critical):** data → quiz → draw → bg → sfx → engine.

Coordinate system: a fixed **1600×900** world-canvas. `GROUND_Y = 760` (actors' feet). The level is
`WORLD_W = 3400` wide; the camera follows the player and the HTML backdrop parallax-scrolls via a
CSS transform driven from `engine.render()`.

---

## Core Game Loop

1. **Wave spawns** — `buildWaveDefs(totalWaves)` lays out N waves; the last is the **boss wave**.
   Each non-boss wave mixes `soldier` + `archer` + `spearman` (+ occasional `champion` mini-boss).
   Wave 0 is soldiers-only (gentle intro).
2. **Fight** — enemies walk in from screen edges; player clears them with sword/ranged/ult while
   dodging (jump), blocking, and parrying.
3. **Wave clear → Quiz** — when no *live* enemies remain, a **2–3 question quiz** opens (each
   question on a 12s countdown that resets per question).
4. **Result applied** — all correct → strong buff + HP potion + ult; some right → small buff;
   zero → debuff + arrow-rain. Then the next wave starts.
5. **Boss wave** — cinematic banner, then the rhapsody's unique boss. Defeat → **ΝΙΚΗ** end card;
   death any time → **ΗΤΤΑ** end card. Both show score, kills, quiz accuracy, and best score.

Every new game (play-again, or changing campaign/rhapsody/wave-count/difficulty) does a **full reset**
of HP, potions, ult, score, combo, mods, and quiz state via `setup()`.

---

## Screens / Views

There is one screen (the gameplay canvas) with several overlays. All overlays are centered on the
1600×900 stage.

### 1. Top bar (always visible, fixed, top-center)
- **Campaign toggle** (`.camp-row`): `ΙΛΙΑΔΑ` / `ΟΔΥΣΣΕΙΑ` pills.
- **Rhapsody selector** (`.rhap-bar`): 5 round buttons showing the Greek numeral (Α Ζ Π Χ Ω for
  Iliad; Α Ι Κ Μ Χ for Odyssey).
- **Wave-count + difficulty** (`.wave-row`): `ΚΥΜΑΤΑ 3/5/8/12` and `ΕΠΙΠΕΔΟ Εύκολο/Μέτριο/Δύσκολο`.
- Selected pills use a gold gradient `linear-gradient(180deg,#E8C96A,#C8a23c)` with `#1c1208` text.

### 2. System buttons (fixed, top-right) `.sys-row`
Three 40px round buttons: **?** (help), **♪/♫** (mute toggle, struck-through when muted), **Ⅱ** (pause).

### 3. HUD (overlaid on canvas, `#hud`)
- **Top-left** `.hero-hud`: circular portrait (Α / Ο), hero name, **HP bar** (terracotta gradient),
  **ΟΡΓΗ/ΜΗΝΙΣ ult bar** (terra→gold, pulses when full), and **ammo pips** (➶ for arrows, ╱ for spears).
- **Top-center** `.boss-bar` (hidden until boss): boss name + EN subtitle + segmented red health track.
- **Top-right** `.score-hud`: `Κύμα n/total`, `Σκορ`, and a combo counter that fades in (`×N COMBO`).
- **Left, below HP** `.mod-chip`: current buff/debuff with **live countdown** `12s` + a depleting bar
  (green for buffs, red for debuffs).

### 4. Controls (overlaid, bottom)
- **Analog joystick** `.joy` (bottom-left): drag knob L/R; push distance = walk speed.
- **Action cluster** (bottom-right), each round with a key-badge:
  - `Ξίφος` ⚔ (Q) — large terracotta button
  - `Τόξο/Δόρυ` ➶ (E)
  - `Ασπίδα` ⛉ (R) — steel blue
  - `Άλμα` ⤒ (↑)
  - `ΟΡΓΗ/ΜΗΝΙΣ` Ϟ (F) — glows gold when ready
- **Potions** `.pots` (bottom-center): `+` HP (G/1) and `Ϟ` Rage (2), each with a count badge.
- Desktop also shows a keyboard hint line; hidden on touch devices.

### 5. Quiz overlay `.quiz`
Centered card: progress line `ΕΡΩΤΗΣΗ n/total · ΚΥΜΑ w/total ΤΕΛΕΙΩΣΕ`, a **timer bar + seconds**
(turns red < 4s), the question (italic Cardo), and a 2×2 option grid (Α/Β/Γ/Δ). Correct flashes
green, wrong flashes red and reveals the correct one.

### 6. Boss banner `#bossBanner`
Full-stage cinematic: letterbox bars, a red ◆, the boss name in huge letter-spaced Anton that
tightens in, EN subtitle, `BOSS` tag. Auto-hides after ~2.2s. Triggers a screen shake.

### 7. Help card `#helpCard` (shown on first load + via ?)
Title `Πώς παίζεται`, subtitle, a 2-column grid of all controls with colored icon tiles, and a
`▶ Αρχίστε` button. Freezes the game while open (does not show the pause overlay).

### 8. Pause overlay `#pauseOverlay`
Title `ΠΑΥΣΗ`, `▶ Συνέχεια` button, `Esc / P` hint.

### 9. End card `#endcard`
Title `ΝΙΚΗ` (gold) or `ΗΤΤΑ` (red), an italic flavor line, a stat row
(`ΣΚΟΡ`, `ΦΟΝΟΙ`, `ΣΩΣΤΕΣ` quiz accuracy, `ΡΕΚΟΡ` best), a pulsing `★ ΝΕΟ ΡΕΚΟΡ ★` badge when beaten,
and `▶ Παίξε Ξανά`. Click anywhere / Space / Enter to restart.

---

## Entities & Combat

### Player
- Two weapon classes from `GAME_DATA[campaign]`:
  - **Iliad**: `sword{dmg:14, range:128, cd:0.36}` + `ranged{type:'spear', ammo:2, recharge:5.0, speed:15, dmg:34}`, ult `ΜΗΝΙΣ`.
  - **Odyssey**: `sword{dmg:13, range:120, cd:0.34}` + `ranged{type:'arrow', ammo:5, recharge:2.6, speed:19, dmg:22}`, ult `ΟΡΓΗ`.
- Move speed base 6.6 px/step (×mod). Jump `vy:-15.5`, gravity in the loop. Block ⇒ ×0.22 damage
  taken; **parry** if blockT < 0.22s ⇒ negates hit, stuns attacker, +ult, refunds nothing but rewards.
- **Sword swings cycle 4 types** (`engine.swordAttack`): horizontal sweep → overhead chop → uppercut →
  thrust (thrust reaches ×1.28). Each has its own slash-FX arc and a fixed-length **rotating** arm
  (`drawWarrior` weapon-arm block) — the arm pivots at the shoulder, it does **not** stretch.
- Hero look: **Iliad Achilles** = bronze armour (cuirass, pauldrons, greaves, crested helmet) over
  a warm body `#2E1C12`. **Odyssey Odysseus** = ragged castaway (`#6E4A30` body, torn hem, baldric,
  shoulder rag, head wrap); the **bow only appears while firing** (E), drawn string + nocked arrow.

### Enemies (each a distinct fixed palette for readability)
| Type | HP | Scale | Palette (tint / crest / shield / emblem) | Behaviour |
|---|---|---|---|---|
| `soldier` | 32 | 1.42 | rhapsody tint / `#C8542B` / `#5E2C18` / `#E2A867` | walks to reach 96, melee |
| `archer` | 20 | 1.30 | `#3E5A30` / `#B7D27A` | keeps 360–520 range, shoots torso-height arrows |
| `spearman`| 30 | 1.50 | `#33506B` / `#A8C4DA` | keeps 230–470, hurls a **fast low spear you must JUMP over** (0.32s telegraph) |
| `champion`| 75 | 1.78 | `#5A2E5E` / `#F0D89A` / `#3A1E3E` | mini-boss, melee + ranged, has a mini health bar |

### Bosses (`drawBoss`, kind-specific)
- `melee` (Hector/Sarpedon/Antinous/Eurymachus/Shade) — broad armoured figure, tall crest, big emblem shield.
- `archer` (Paris) — same body, fires arrows.
- `giant` (Polyphemus) — huge, single glowing eye, throws boulders.
- `caster` (Circe/Scylla) — robed, fires 3-way magic bolts; Scylla has extra arms.

### Corpses & drops
- Defeated enemies **collapse and lie on the ground** (tilt over via rotation in `render`), persist
  ~6s, then fade over 2s and despawn (`updateDying` + the `corpseT>8` filter). The wave-clear check
  counts only **live** enemies.
- ~13% drop chance per regular enemy (champion 55%, boss guaranteed). Five drop kinds (`randDrop`):
  `hp` phial, `rage` phial, `ammo` quiver (refill), `ult` gold orb (+35 ult), `coin` (+300 score) —
  each with its own glyph/colour in `drawItem`.

### Difficulty
`DMG_SCALE = { easy:0.5, med:0.78, hard:1.1 }` multiplies **incoming** player damage only.

---

## Buffs / Debuffs (`play/quiz.js → GAME_MODS`)
Applied after a quiz, shown in the mod chip with a countdown (buffs ~22s, debuffs ~15s). Each mod is
a multiplier object read by `engine.mul(key)`:
- Keys: `sword`, `ranged`, `move`, `taken` (damage taken), `ultGain`, `swordCd` (lower = faster),
  `ammoBonus`, `bleed` (HP/s drain).
- 6 buffs (e.g. ΜΕΝΟΣ +60% sword, ΑΕΤΟΣ +1 ammo, ΩΚΥΠΟΥΣ +35% move, ΑΙΓΙΣ −50% taken, ΟΡΓΗ ×2 ult,
  ΑΣΤΡΑΠΗ +45% swing speed) and 10 debuffs (ΑΜΒΛΥ, ΒΑΡΥ, ΕΚΤΕΘΕΙΜΕΝΟΣ, ΑΙΜΟΡΡΑΓΙΑ, ΣΚΟΤΟΣ, ΛΗΘΗ,
  ΑΦΟΠΛΙΣΜΟΣ, ΝΩΘΡΟΣ, ΑΣΘΕΝΕΙΑ, ΚΑΤΑΡΑ).

---

## Interactions & Controls

| Action | Keyboard | Touch |
|---|---|---|
| Move L/R | ←→ or A/D | analog joystick (variable speed) |
| Jump | ↑ / W / Space | ⤒ Άλμα |
| Sword (cycling swings) | Q (or J) | ⚔ Ξίφος |
| Ranged (bow/spear) | E (or K) | ➶ Τόξο/Δόρυ |
| Block / Parry (hold) | R (or L) | ⛉ Ασπίδα |
| Ult | F (or U) | Ϟ ΟΡΓΗ/ΜΗΝΙΣ |
| HP potion | G / 1 | + pot |
| Rage potion | 2 | Ϟ pot |
| Pause | Esc / P | Ⅱ button |
| Restart (on end card) | Space / Enter / click | tap |

**Mobile:** portrait shows a "ΓΥΡΙΣΕ ΤΗ ΣΥΣΚΕΥΗ" rotate prompt; the game is landscape-first and the
fixed 1600×900 stage letterboxes to fit. First load shows the help card.

---

## State Management
Single module-scoped state in `engine.js` (port to your framework's store/refs):
- **Session/config**: `campaignKey`, `rhapKey`, `totalWaves`, `difficulty`, `paused`, `state`
  (`play|quiz|paused|won|lost`).
- **Run**: `score`, `combo`, `comboTimer`, `kills`, `wave`, `waveDefs`, `spawnQueue`.
- **Player object**: `x,y,vx,vy,onGround,facing,hp,ult,ammo,swordCd,swing,swingIdx,swingArm,blocking,
  blockT,shoot,inv,pots{hp,rage},mod`.
- **Collections**: `enemies[]`, `projectiles[]`, `items[]`, `fx[]`, `boss`.
- **Quiz**: `quizQueue`, `quizCur`, `quizTimer`, `quizCorrect/Total`, `quizCorrectAll/TotalAll`.
- **Camera**: `camX` (lerps to follow player; drives backdrop parallax).
- **Persistence (localStorage)**: `ia_best_<campaign>_<rhap>` (best score), `ia_helpSeen`, `ia_muted`.

Fixed-step loop: accumulate real dt, step `update(1/60)` up to 4×/frame, then `render()`. `update`
early-returns when `paused`; handles `quiz` state by ticking only the quiz timer.

---

## Design Tokens

### Core palette (CSS vars in the HTML `:root`)
| Token | Hex | Use |
|---|---|---|
| `--slip` | `#17110C` | deepest background |
| `--terra` | `#C8542B` | primary terracotta accent |
| `--terraLt` | `#DD7A45` | lighter terracotta |
| `--clay` | `#E2A867` | warm tan (icons, text) |
| `--bone` | `#ECDAB4` | light text |
| `--gold` | `#E8C96A` | highlight / selected / ult |
| `--ok` | `#9DB46A` | success / buff green |
| `--bad` | `#D2452E` | danger / debuff / boss red |
| `--fog` | `#6E5C44` | muted labels |
| `--boneDim` | `#A99572` | secondary text |
| `--line` | `rgba(200,84,43,.30)` | borders |

Selected-pill gradient: `linear-gradient(180deg,#E8C96A,#C8a23c)` on `#1c1208`.
Per-rhapsody sky/ground/accent palettes live in `GAME_DATA[...].rhaps[...].pal` (see `data.js`).

### Typography (Google Fonts)
- **Anton** — big numeric/display (titles, scores, boss name).
- **Oswald** (400–700) — UI labels, buttons.
- **Cardo** (incl. italic) — Greek body, quiz questions, flavor text.
- **JetBrains Mono** — small mono labels, counters, hints.

### Geometry
- Stage 1600×900, `GROUND_Y` 760, `WORLD_W` 3400.
- Round buttons 40px (sys), 60–112px (actions); joystick 148px; potions 60px.
- Border-radius: pills 999px, cards 8–14px. Shadows: soft dark `0 …px rgba(0,0,0,.5–.7)`.
- Hit targets ≥ 40px (mobile-safe).

---

## Audio
`play/sfx.js` synthesises all sound at runtime with WebAudio (no files). Must be `SFX.init()`-ed on a
user gesture (autoplay policy) — the engine calls it on first key/tap. Sounds: `slash`, `ranged`
(arrow/spear), `block`, `parry`, `hurt`, `ult`. `SFX.setMuted(bool)` for the mute toggle.

## Assets
**None external.** All visuals are procedural canvas/SVG draws; all audio is synthesised. Only
dependency is the Google Fonts listed above. No images, sprites, or sound files to ship.

## Files in this bundle
- `Iliada Arcade — Play.html` — shell + all CSS + DOM
- `play/data.js`, `play/quiz.js`, `play/draw.js`, `play/sfx.js`, `play/engine.js`, `play/bg-scenes.css`
- `battle-bg/bg.js`

To run the reference as-is: open `Iliada Arcade — Play.html` in a browser (served over http for
fonts; a static file server is enough). No build step.

## Suggested port plan
1. Reproduce `data.js` as typed config and `quiz.js` as the mod table (pure data — copy verbatim).
2. Port `draw.js` to your render target (HTML canvas ports 1:1; for React keep a single `<canvas>` +
   a `requestAnimationFrame` controller; for a game engine, map the draw routines to its primitives).
3. Port `engine.js` state + fixed-step loop into your store; keep the exact balance numbers.
4. Rebuild the HUD/overlays as components from the CSS in the HTML (tokens above).
5. Keep `bg.js` backdrops as a layer behind the canvas (or re-implement as engine background layers).
6. Wire localStorage (or your persistence) for best-score / help-seen / mute.
