# Handoff: ΑΝΟΔΟΣ (Anōdos) — "Synthesis" build (Anodos 2)

> **Ἄνοδος / Anōdos** — "The Ascent." A *Slay-the-Spire*–style roguelike study game for the **SymposiON** Greek-classics learning platform. The player climbs a branching map through three Acts (Πεδίον → Τείχη → Ἀκρόπολις), fighting node encounters by **answering questions** drawn from a chosen syllabus. This package documents **Anodos 2**, the **"Synthesis" skinned** version (`Anodos_2.html`).

---

## Overview

Anodos is a single-page React app (in-browser Babel, no build step). The player:

1. Opens the **Temple of the Muses** hub (home base / reward shop between runs).
2. Starts a climb → picks a **syllabus** (which units feed the questions) → picks a **patron god** + optional **trials** → climbs.
3. Each map **node** is an encounter: a battle (answer questions), a market, a spring (heal), a treasure, a mystery/riddle, or an act boss.
4. Wrong answers cost **μένος** (spirit/HP) and can inflict **curses**; running out of spirit ends the run.
5. Finishing nodes/runs earns **κλέος** (meta-currency) spent in the hub on cosmetics, boosts, and lifelines. Winning unlocks the next **Ἀνάβασις** (ascension difficulty tier).

The whole thing is **localStorage-persisted** — run state, meta-progression, and syllabus selection all survive reload.

---

## About the design files

The files in this bundle are a **working HTML/React prototype** — they run as-is in a browser via CDN React + Babel. They are a **design + behavior reference**, not a production drop-in. The task for the target codebase is to **re-implement this experience using that project's existing stack** (a real React/Vite/Next build, a component library, a state manager, a proper question/content API), lifting the **exact** visual tokens, layout, copy, and game logic documented here and present in the source.

If there is no existing codebase yet, build it as a bundled React app (Vite + React 18). The logic files (`anodos-data.jsx`, `anodos-meta.jsx`, `anodos-encounters.jsx`, etc.) are framework-agnostic enough to port nearly verbatim — they are plain functions + React function components that currently attach to `window`. In a real build, convert the `Object.assign(window, …)` exports into ES module `export`s.

## Fidelity

**High-fidelity.** Final colors, typography, spacing, copy (Greek + English), animations, sounds, and complete game logic are all present and intended to ship. Recreate pixel-for-pixel. The Greek polytonic text is content, not lorem — preserve it exactly (including diacritics).

---

## What "Anodos 2 / Synthesis" is, vs. Anodos 1

There are several HTML entry points in the parent project. **This handoff is `Anodos_2.html`.** The difference is **purely a cosmetic skin layer** — the gameplay JSX is identical and shared.

| | **Anodos 1** (`Anodos.html`) | **Anodos 2** (`Anodos_2.html`) — this build |
|---|---|---|
| `<html>` attr | _(none)_ | **`data-skin="synth"`** |
| Extra stylesheet | — | **`anodos-synthesis.css`** (loaded last) |
| Display font | Cinzel (serif caps) | **Oswald** (condensed monumental caps) |
| Serif / reading | Cormorant Garamond | **Alegreya** |
| UI / labels | Inter | **Montserrat** |
| Mono / eyebrows | JetBrains Mono | **Montserrat** (no mono) |
| Corners | engraved / squared | **rounded** — pill nav & chips, soft 14–18px cards |
| Google Fonts link | Cinzel/Cormorant/Inter/JetBrains | Oswald/Montserrat/Alegreya/Alegreya Sans/Cormorant |

**How the skin works:** `anodos-synthesis.css` is scoped entirely under `[data-skin="synth"]` and loaded **on top of** `anodos.css` + `anodos-meta.css`. It overrides only **type + chrome radii + weights** — it never touches the obsidian color palette or any gameplay. So to build Anodos 2 you implement the base design system **and** apply the Synthesis type/shape overrides documented in §"Design Tokens → Synthesis skin".

The "Synthesis" concept fuses three house languages: **Akrópolis** (monumental Oswald caps + architectural corner ticks + meander rails), **Agora** (playful rounded pill chrome, soft cards), and **Stoa** (editorial Alegreya reading text).

---

## ⚙️ "Making it work" — the platform integration (most important section)

The prototype ships with a **built-in demo syllabus** (Homer's *Iliad*, 10 units in `anodos-subjects.jsx` → `DEMO_SYLLABUS`) and a fallback question bank (`QUESTIONS` / `TF_BANK` in `anodos-data.jsx`). For the game to be "working" against **real platform content**, the host must feed it questions. There are two contracts, both designed to **degrade gracefully** (no host data → built-in demo content):

### 1. Inject a syllabus (preferred)
Before the scripts load, set a global:
```js
window.SYMPOSION_SYLLABUS = {
  id, name, en, sub,
  units: [
    {
      id, name, en,
      d: 1 | 2 | 3,          // difficulty (1 easy … 3 hard); used to weight by Act
      ch: "Ραψ. Α 1–7",      // optional chapter/source label
      locked: false,          // true → shown locked behind a subscription upgrade
      mc: [ { q, opts:[a,b,c,d], a: <correctIndex>, hint, greek?: bool, d?: 1|2|3 } ],
      tf: [ { s: "<statement>", t: <bool>, d?: 1|2|3 } ]
    }
  ]
}
```
- `getSyllabus()` returns `window.SYMPOSION_SYLLABUS || DEMO_SYLLABUS`.
- The pre-climb **SubjectSelect** modal lets the student pick **≥ `MIN_LEVELS` (6)** unlocked units. Selection is persisted (`localStorage["anodos-syllabus-v1"]`).
- `window.getBattleQuestions(format, node)` (defined in `anodos-subjects.jsx`) pulls from the selected units, returns the right shape per format (`mc` for multiple-choice/sudden-death, `tf` for rapid volley), and **weights ordering by difficulty fit to the current Act** (Act I favors `d:1`, Act III favors `d:3`).

### 2. Or inject question banks directly (lower-level)
The engine (`Battle` in `anodos-encounters.jsx`) reads, in priority order, via `ctx`:
- `ctx.getQuestions(format, node)` → `window.getBattleQuestions` (overrides everything)
- `ctx.questions` → `window.SELECTED_QUESTIONS` (MC array)
- `ctx.tfQuestions` → `window.SELECTED_TF` (T/F array)
- else built-in `QUESTIONS` / `TF_BANK`.

**Question shapes:**
- **MC** (`mc` / sudden-death `duel`): `{ q: string, opts: [4 strings], a: correctIndex, hint: string, greek?: bool }`
- **T/F** (`volley`): `{ s: string, t: boolean }`

> In a real platform integration, replace the `localStorage`/`window` plumbing with your content API + auth (locked units = subscription gating) and your question service, keeping the exact `mc`/`tf` shapes and the difficulty-by-Act weighting.

---

## Screens / Views

All screens render inside one fixed full-viewport `.stage` (obsidian background, gold-dust vignette, animated backdrop layer, faint mountain watermark). Modals appear over a `.scrim` overlay. The app is responsive/fluid (not a fixed canvas); the HUD wraps on narrow widths.

### 1. HUD (persistent top bar) — `Hud` in `anodos-app.jsx`
- **Layout:** horizontal flex bar, `z-index:30`, `border-bottom: 1px hairline`, `backdrop-filter: blur(10px)`, padding `14px clamp(16px,3vw,34px)`, `flex-wrap`.
- **Left:** brand mark (SVG ladder + rotating "ON" pivot) + wordmark `Symposi**ON**` (the "ON" in ember terra with glow).
- **Center:** run framing eyebrow + title; run badges (patron, ascension level, trials, daily).
- **Right (stats):** **Μένος** spirit bar (cur/max, terra fill), **Δραχμές** count (gold), **Δόξα/XP** bar (goal 120), **relics** row (hover popover), **curses** row (turn counters), **Κλέος** total, and buttons: `🏛 Ναός` (temple), `?` (rules), `Νέα ἄνοδος ↻` (new climb).

### 2. Map / climb — main view in `anodos-app.jsx`
- **Layout:** vertical scroll region `.mapwrap`; nodes absolutely positioned by `buildLayout(map)`. Player starts at the **gate** (bottom) and climbs **up**. Three Acts stacked, each capped by a boss, with vertical "act seam" gaps. Act region labels (`Α΄ Πεδίον`, etc.) float at each act's mid-height.
- **Constants:** `TOP_PAD 80, BOTTOM_PAD 120, FLOOR_GAP 116, ACT_GAP 60`. Node x is `13 + col/(cols-1)*74` (%) plus deterministic seed jitter; bosses centered at 50%.
- **Edges:** SVG lines between nodes; states `edge` / `edge--traversed` (visited→visited) / `edge--open` (reachable now). Gate→start lines when un-started.
- **Nodes** (`NodeDot`): disc + icon + label + format badge (⚡/🎯). States: `current` / `visited` / `available` / `locked`. Hover shows a `.node__preview` tooltip with foe, format, intent, boss mechanic, and type description (hidden detail when locked unless Hermes/torch reveal is active).
- On reaching a new Act: a transient **ActBanner** drops in (`Πρῶτον/Δεύτερον/Τρίτον Μέρος`).

### 3. Temple of the Muses — hub — `TempleHub` in `anodos-hub.jsx`
Home base shown between runs (and via `🏛 Ναός`). Has **3 layout variants** (Tweak `hubLayout`: `atlas` / `temple` / `scroll`) and **tabs**:
- **Cosmetics** (`CosmeticsTab`): buy/equip palette, backdrop, particles, map-path skins with κλέος.
- **Boosts** (`BoostsTab`): buy permanent start-of-run perks; equip up to **2** (loadout). Also lifeline shop.
- **Quests** (`QuestsTab`): 3 rotating daily quests (claim κλέος) + reroll.
- **Achievements** (`AchievementsTab`): threshold ladders grouped by theme, progress bars.
- **Chronicle** (`ChronicleTab`): last ~24 runs ledger, **Ἀνάβασις** ascension selector, **daily challenge** (deterministic seed) + seed replay.

### 4. Pre-climb gates (modals, in order)
1. **SubjectSelect** (`anodos-subjects.jsx`) — pick ≥6 syllabus units; shows difficulty pips, question counts, locked units.
2. **PatronSelect** (`anodos-app.jsx`) — pick a patron god (or godless) + toggle **Trials** (hardship → κλέος multiplier shown live).
3. **ConfirmNew** — discard-in-progress confirmation if a climb is mid-flight.

### 5. Encounter modals — `anodos-encounters.jsx`
Dispatched by node type via `Encounter`:
- **Battle** (`combat`/`elite`/`boss`): foe medallion + HP pips + intent telegraph; one of **3 formats** — `mc` (📜 multiple choice, lifelines available), `volley` (⚡ true/false on a timer ring), `duel` (🎯 sudden death, one wrong = knockback). Streak "surge" meter (3 correct = double wound). Boss **mechanics**: Sarpedon shield, Aeneas flee, Hector riposte. Win → reward chips (count-up) + possible relic.
- **Mystery / Riddle** (`Mystery`): event with choices, or a multiple-choice riddle, or a **Luck** (Τύχη) 50/50 boon-vs-bane gamble.
- **Rest** (`Rest`): heal or fortify max spirit.
- **Shop** (`Shop`): buy up to 3 relics with drachmas.
- **Treasure** (`Treasure`): one free relic (or +60 drachmas if all owned).

### 6. End screen — `EndScreen` in `anodos-app.jsx`
Victory (🏛) or defeat (🜃) crest, κλέος earned + total, run summary stats (nodes / relics / drachmas / XP), buttons to new climb or temple.

### 7. Intro / rules — `Intro` in `anodos-app.jsx`
Framing title + node-type legend cards + how-to copy. Shown on first load (no save) and via `?`.

---

## Interactions & Behavior

- **Navigation:** click an `available` node → encounter modal → on resolve, `ctx.advanceTo(id)` marks visited, smooth-scrolls the map, ticks curses, may show act banner.
- **Spirit (μένος) = HP.** Wrong answers call `ctx.damage(n)` (modified by relics/curses/patron/ascension). Reaching 0 → `status:"lost"` unless a revive relic/boost fires.
- **Curses (μιάσματα):** `bleed` (−4/advance), `dread` (−6 at battle start), `skotos` (no hints, shorter timers), `burden` (halved rewards), `mania` (+50% enemy dmg). Last N node-advances.
- **Knockback:** losing a `duel` pushes the player back to a previous node (`ctx.knockback()`).
- **Animations / juice** (`anodos-encounters.jsx`): `fxShake` (screen), `fxFlash` (color overlay), `fxFloat` (floating damage/reward text), `fxRecoil` (medallion hit), CountChip reward count-up. All gated on `prefers-reduced-motion`.
- **Backdrops** (`anodos-hub.jsx`): animated CSS/SVG layers — ritual circle, constellations, aurora, marble, sea, olympus, storm, eclipse, arrow volley — plus particle layer (embers/petals/ash/motes/rain/snow/falling-glyphs) and a per-act tint.
- **Sound** (`anodos-sfx.jsx`): synthesized Web Audio "lyre" SFX (`correct/wrong/hit/reward/surge/boss/win/lose/curse/click/move`) + an ambient Dorian drone. Toggled by `sound`/`music` tweaks; primed on first gesture.
- **Tweaks panel** (toolbar-toggled): Tone (full/restrained), Realm backdrop preview, Corners, Language (gr/en), Sound, Music, Hub layout, Fiction framing (ascent/nostos/katabasis), Length (short/normal/tall), plus dev buttons (unlock all, +300 κλέος).

## State Management

Three persisted stores (all `localStorage`):
| Key | Owner | Holds |
|---|---|---|
| `anodos-run-v3` | `App` (`run` state) | active climb: seed, floors, menos, drachmes, xp, relics, curses, visited, currentNodeId, status, patron, anabasis, trials, daily, boosts |
| `anodos-meta-v1` | `useMeta()` | κλέος, owned cosmetics, boosts, loadout, lifelines, stats, achievements, quests, questline, ascension, ledger, daily bests |
| `anodos-syllabus-v1` | `anodos-subjects.jsx` | selected unit ids |

- **Map is deterministic** from `(seed, floors)` via `generateMap` (mulberry32 RNG) — same seed = same map (enables daily challenge + replay).
- **Meta is a pure reducer:** `applyEvent(meta, ev, payload)` folds gameplay events (`tile`, `answer`, `battleWin`, `riddle`, `relic`, `curse`, `luck`, `spend`, `runEnd`, …) into stats and auto-grants achievements/questline rewards, returning celebration `notices`.
- **Encounters never mutate state directly** — they call the `ctx` object built in `App` (`damage/heal/fortify/gainXp/gainDrachmes/addRelic/takeRelic/inflictCurse/advanceTo/knockback/track/…`).

---

## Design Tokens

### Base palette — obsidian (in `anodos.css :root`)
| Token | Hex | Use |
|---|---|---|
| `--sym-bg-dark` | `#0A0907` | page background |
| `--sym-bg-panel` | `#15120D` | panels |
| `--sym-bg-raise` | `#211C13` | raised cards |
| `--sym-cream` | `#F1E9D6` | primary text |
| `--sym-stone` | `#897A5A` | muted text |
| `--sym-gold` | `#D2A24A` | **primary accent** |
| `--sym-gold-dk` | `#9E7322` | gold shade |
| `--sym-gold-lt` | `#F2CD78` | gold highlight |
| `--sym-gold-deep` | `#6E4E18` | deep gold |
| `--sym-terra` | `#E07A3C` | **secondary** (the "ON" ember, spirit/danger) |
| `--sym-terra-dk` | `#B05A22` | terra shade |
| `--sym-sage` | `#7E9560` | rest/heal green |
| `--sym-aegean` | `#5E8B96` | mystery/cool blue |

Derived: `--sym-gold-grad` (135° gold gradient), `--sym-hairline` = gold @16% alpha, `--sym-glow-gold`. Alt theme palettes (`[data-theme="aegean"]`, `["amphora"]`) re-tint the same tokens; cosmetic palettes (tyrian, bronze, dawn, nyx, frost, ember, verdant) do likewise. Per-act tint set at runtime via `--act-tint` (Act I `#C87830`, II `#5E8B96`, III `#9C3D9E`).

### Typography
**Base (Anodos 1):** display `Cinzel`, serif `Cormorant Garamond`, ui `Inter`, mono `JetBrains Mono`.

**Synthesis skin (Anodos 2)** — override `--font-*` under `[data-skin="synth"]`:
```css
--font-display: 'Oswald', 'Alegreya Sans', sans-serif;   /* monumental caps */
--font-serif:   'Alegreya', 'Cormorant Garamond', serif; /* editorial reading */
--font-ui:      'Montserrat', 'Alegreya Sans', sans-serif;/* labels/eyebrows */
--font-mono:    'Montserrat', 'Alegreya Sans', sans-serif;
```
Synthesis specifics (see `anodos-synthesis.css`, all `[data-skin="synth"]`-scoped):
- **Force display titles to UPPERCASE** (`.modal__title, .end__title, .hub__title, .hub__section-h b, .actbanner__name`) — Oswald lacks polytonic glyphs, but uppercasing strips diacritics so caps render clean.
- **Italic serif surfaces forced to weight 500** (Alegreya italic-400 has Greek-Extended gaps).
- **Eyebrows/labels weight 600** (Montserrat needs it to read as wide-tracked "selection-code").
- **Editorial body sizing:** `.q` 21px/1.45, `.modal__sub` 18px, `.modal__body` 15.5px/1.68, etc.
- **Rounded chrome:** pills (`999px`) for nav buttons, chips, badges, lifelines; soft surfaces 18px (modals/toasts/notices); cards 14px; icon tiles 10px; bars 6px — re-asserted `!important` so they hold regardless of the Corners tweak.

### Spacing / radii / shadow
- HUD padding `14px clamp(16px,3vw,34px)`; gaps `22px`. Map constants above. Hairline borders `1px var(--sym-hairline)`. Blur `10px` on HUD/modals. Glow shadows use `color-mix(... var(--sym-gold/terra) N%, transparent)`.
- **Min text size:** body/labels read down to ~9.5px for mono eyebrows (uppercase, wide-tracked) — keep these as small caps labels, not body copy.

---

## Assets

**No external image/font assets beyond Google Fonts.** Everything is drawn with CSS, inline SVG, and Unicode glyphs/emoji:
- Brand mark, foe medallions, node icons, kleos wreath, watermark, ritual circle, backdrops = inline SVG / CSS.
- Foe & node icons, relics, patrons, curses use **emoji + Greek-letter glyphs** (e.g. foes carry a `glyph` like `Λ/Τ/Μ` and a `sigil` emoji). These are content in the data files.
- Sounds are **synthesized at runtime** (no audio files).
- Fonts via Google Fonts CDN (`<link>` in the HTML head). For a real build, self-host: **Oswald, Montserrat, Alegreya, Alegreya Sans** (Anodos 2).

> The `<template id="__bundler_thumbnail">` in the HTML is only a splash/preview icon for the prototype bundler — drop it in a real build.

---

## Files in this bundle

**Entry point:** `Anodos_2.html` — sets `data-skin="synth"`, loads the Synthesis fonts + 3 stylesheets, then the JSX modules in dependency order.

| File | Role |
|---|---|
| `Anodos_2.html` | entry — script/style load order, font links, `data-skin="synth"` |
| `anodos.css` | base design system: tokens, HUD, map, nodes, modals, encounters, end screen |
| `anodos-meta.css` | hub / cosmetics / quests / achievements / backdrops / particles styling |
| `anodos-synthesis.css` | **the Anodos-2 skin** — type + rounded chrome overrides, syllabus picker styles |
| `tweaks-panel.jsx` | Tweaks panel host component (`TweaksPanel`, `useTweaks`, `Tweak*` controls) |
| `anodos-data.jsx` | map generator + content: node types, Acts, foes, intents, curses, relics, question/TF banks, events, patrons, trials, ascension ladder, boss mechanics, daily seed |
| `anodos-subjects.jsx` | **syllabus/platform integration**: `DEMO_SYLLABUS`, `SubjectSelect`, `getBattleQuestions`, selection persistence |
| `anodos-sfx.jsx` | Web Audio SFX + ambient drone (synthesized) |
| `anodos-meta.jsx` | meta-progression: cosmetics, boosts, lifelines, achievements, quests, questline, `useMeta()` hook + `applyEvent` reducer |
| `anodos-encounters.jsx` | encounter modals: `Battle` (3 formats + boss mechanics), `Mystery`, `Rest`, `Shop`, `Treasure`, juice fx |
| `anodos-hub.jsx` | `Backdrop`, `Particles`, `KleosIcon`, `NoticeStack`, `TempleHub` (+ all hub tabs) |
| `anodos-ritual.jsx` | GSAP-driven ritual-circle scene (`RitualScene`) |
| `anodos-app.jsx` | **root**: `App` state machine, HUD, map/edges/nodes, gates, end screen, intro, Tweaks wiring; mounts to `#root` |

### Load order (matters — modules export to `window`)
`tweaks-panel → anodos-data → anodos-subjects → anodos-sfx → anodos-meta → anodos-encounters → anodos-hub → anodos-ritual → anodos-app`. Dependencies: React 18.3.1 + ReactDOM + Babel standalone (pinned) + GSAP 3.12.5.

### Porting notes
- Each module currently ends with `Object.assign(window, { … })`. In a bundled app, convert to ES `export`/`import`.
- **Watch for global name collisions:** several files re-`const { useState } = React` and define module-scoped helpers — namespacing differs per file (`useStateH`, `useStateS`, etc.) because Babel script scopes are shared on `window`. A real bundler removes this hazard, but don't blindly merge two `styles`-style globals.
- Replace `localStorage` persistence with your platform's save service + auth; replace the demo syllabus with the content API (`locked` units = subscription gating).
- Keep the **graceful-degradation contract**: missing host data must fall back to built-in content so the game always runs.
