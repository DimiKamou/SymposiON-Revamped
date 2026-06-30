# Handoff — Live Arena Lobby: host setup redesign (mode picker + match config)

Repo: `C:\Dev\SymposiON-Revamped` · app in `synthesis/` · no-build vanilla-JS SPA, Firebase compat.
**NEVER `firebase deploy`** — push to git only; the owner batches the deploy. js/css are served no-cache (no `?v=` bump needed).

## Goal
Redesign the **Live Arena HOST** setup so the teacher, before the lobby opens, can:
1. **Pick a game mode** from the 20 competitive modes, in **two categories** (like the PvP arena), and
2. **Configure the match**: per-question **time (slider 5–30s)**, **or** a target **score**, **or** number of **rounds/questions**, plus **shuffle** and **open/locked**.

It must look like the new **light synthesis** "Διάλεξε ύλη" picker + the polished dark lobby. The current footer settings bar (3 cramped pills: Χρόνος / Ανάμειξη / Ανοιχτό) is the "terrible bar" to replace.

## Current state
- **Live Arena** = Kahoot-style realtime MC quiz over Firestore `live_arenas/<PIN>`. Engine: `synthesis/js/live-arena.js` (a `const LiveArena` IIFE — NOT on `window`). Lobby markup: `synthesis/overlays/la-overlay.html` (`#la-host-lobby`). Lobby helpers (settings pills, avatar/banner upload) = `synthesis/js/live-arena-lobby.js` → `window.LAX`. Lobby CSS: `games/live-arena/game.css` + `games/live-arena/live-arena-lobby.css`.
- **Host entry**: `LiveArena.launchHost({ questions, gameName })` → creates arena, shows `#la-host-lobby`. Question shape the engine consumes: `{ q:<string>, opts:[…], ans:<index> }`. **`const Q_DURATION = 25`** (hardcoded seconds/question in live-arena.js — see `_pushQuestion`, `_startHostTimer`).
- **Content is already chosen before the lobby** via the new light picker: `SymCurriculum.openForLiveHost()` (`synthesis/js/curriculum-picker.js`, the `_live` mode) → `SymMix.bankMulti(picks)` → maps SymMix `{q,a,c}` → `{q,opts,ans}` → `synLaunch('openLiveArena', { questions })` → `LiveArena.launchHost`. So the lobby ALREADY receives the selected ύλη. This redesign adds **mode + config** on top.
- **The bar to replace**: `#la-host-lobby .la-lobby-footer .la-settings` — 3 `.la-pill` buttons → `LAX.cycleTimer()` (cycles 15/20/25/30/45), `LAX.toggleShuffle()`, `LAX.toggleLock()`. Start = `#la-start-btn` → `LiveArena.startBattle()`.

## The 20 modes (source of truth: `synthesis/games/pvp-arena/js/pvp-data.js`)
Each entry: `{ id, gr, en, glyph, accent:'--sym-*', weight, … }` (duel modes also carry `engine:`).

**`PVP.MODES` — 12 multiplayer / score-comparable** (timed, everyone plays the SAME game, scores compared):
κρυπτεία `krypteia` (Crypto Hack), χρυσόμαλλον δέρας `fleece` (Gold Quest), αλιεία `halieia` (Fishing Frenzy), μοίραι `moirai` (Wheel of Fates), ανάβασις `anabasis` (Millionaire), αρματοδρομία `hippodrome` (Race), μαντείον `manteion` (Wager Quiz), ηγεμονία `hegemonia` (Color Kingdom), ακρόπολις `akropolis` (Builder), δίσκος `discus` (Plinko), αγορά `agora` (Auction), τοξότης `toxotes` (Duck Hunt).

**`PVP.DUEL_MODES` — 8 1v1 head-to-head** (`engine:` in parens):
σκάκι `skaki` (chess), πεττεία `petteia` (petteia), διελκυστίνδα `tug` (tug), διωγμός `diogmos` (erinyes), ναυμαχία `naumachia` (quiz), ακρόπολις `akropolis_d` (quiz), εκκλησία `ekklisia_d` (quiz), παγκράτιον `pankration` (quiz).

⚠️ These are **different games**, living in the PvP arena (`games/pvp-arena/`) and standalone folders (`games/halieia`, `games/golden-fleece`, `games/toxotes`, `games/agora`, `games/hegemonia`, `games/discus`, `games/naumachia`, …). The Live Arena currently runs only the MC-quiz engine, so wiring all 20 into the realtime multiplayer host is the hard part — phase it.

## Requirements
### A. New "ΣΤΗΣΙΜΟ ΜΑΧΗΣ" host-setup step (light synthesis style; reuse `syn-*` classes)
Shown after content selection, before the dark lobby:
1. **Mode picker** — two labelled sections: "Ομαδικά · Σύγκριση Σκορ" (the 12 `PVP.MODES`) and "Μονομαχία · 1v1" (the 8 `PVP.DUEL_MODES`). Each mode = a card (glyph + gr + en, accent from its `--sym-*`). Selecting highlights it (green active, `#2e9e4f`). Badge not-yet-wired engines "σύντομα".
2. **Match config** (replaces the pill bar):
   - **Χρόνος/Time** — slider **5–30s** per question (default 25), value shown live.
   - **Σκορ/Target score** — number input (first to N points).
   - **Γύροι/Rounds** — number of questions (cap to bank length).
   - Win-condition = pick one of {time-limited, score, rounds}; keep **Ανάμειξη/Shuffle** + **Ανοιχτό/Κλειδωμένο** as toggles.
3. **Ξεκίνα** → opens the lobby (or the chosen game) with `{ content bank, mode, config }`.

### B. Wire mode → launch
- Extend `_cfg` from `{ questions, gameName }` → `{ questions, gameName, mode, config:{ timePerQ, targetScore, rounds, shuffle, locked } }`.
- **Parameterize `Q_DURATION`** → read `_cfg.config.timePerQ`. Honor `targetScore`/`rounds` as the match-end condition; `shuffle` on the bank; `locked` for join.
- `engine:'quiz'` + quiz-driven `PVP.MODES` → run via the live quiz host with the bank + config.
- Non-quiz duel engines (chess/petteia/tug/erinyes) → for **Phase 1, badge "σύντομα"** and keep out of the live-host flow (they're real-time 1v1, separate engines). Phase 2 wires them.

### C. Visual
- Setup step = light synthesis (`syn-mix`, `syn-ds-grid`, cards). Dark lobby (QR/PIN/players/flappy) stays the approved handoff design — just feed it config and **fix the footer**: turn the 3 pills into a clean config strip (or move config to the setup step and leave the footer = timer readout + Start).

## Integration map / gotchas
- `PVP.MODES`/`PVP.DUEL_MODES` are plain data on the pvp-arena page; in the main app, **copy them into a shared module** `synthesis/js/pvp-modes.js` (or import) so both the live setup and the PvP arena share one source.
- `SymMix.bankMulti()` already provides the content bank — don't re-implement; just add mode+config.
- Live engine is **Firebase-gated** → can't run headless. Verify with `node --check` + driving the lobby DOM (the SETUP step is light/non-Firebase and IS previewable). To preview-test the live overlay, `currentUserRole='teacher'` and drive `LiveArena.*` after the engine lazy-loads (it's a const, not on window — force-show DOM).
- Keep `LAX` semantics or replace them; the start button is `#la-start-btn`.

## Scope to ship
- **Phase 1**: light setup screen (mode grid — all 20, non-quiz badged "σύντομα") + time/score/rounds config; wire the quiz modes through `launchHost` with `config` honored (parameterize `Q_DURATION`); fix the footer. Previewable end-to-end for the setup step.
- **Phase 2**: wire the remaining game engines (halieia, fleece, toxotes, agora, hegemonia, discus, naumachia, …) into the live multiplayer host.
