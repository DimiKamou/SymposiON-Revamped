# SymposiON — Full Merge Integration Spec (Ver1 → Revamp)

> Research/spec doc. **No app code is changed by this document.** It is the blueprint that
> implementation agents follow to wire the real Ver1 games into the revamp shell.
>
> - **`synthesis/`** = the NEW merged app (revamp shell; vanilla-JS SPA).
> - **`symposion-revamped/`** = the original **Ver1** app (real games live here).
> - Goal: a revamp catalogue tile click launches the correct Ver1 `openX()` game,
>   loading that game's JS/CSS/overlay on demand, mirroring Ver1's `js/lazy.js`
>   `GAME_MANIFEST` / `_lazyRoute` lazy-loader.
>
> Author: integration audit, 2026-06-16.

---

## 0. Executive summary (read first)

- **~46 game folders** under `symposion-revamped/games/`; ~40 are launchable games, the rest
  are shared/support folders (`shared`, `shared-engine.js`, `study`, `teacher`).
- **Ver1 already has a proven lazy-loader**: `symposion-revamped/js/lazy.js` exposes
  `window.lazyLoad(srcs)` and `window._lazyRoute(name, srcs)` + a `GAME_MANIFEST` map.
  **Reuse this verbatim.** The revamp should ship a single `syn-game-manifest.js` of the
  same shape and an injector that adds the overlay HTML + CSS before calling `openX`.
- **CRITICAL revamp gap (COLLISION below):** revamp catalogue tiles currently carry **no
  launch id** — a tile is just `{gr, en, meta, illu}` and clicking it opens a *static*
  `SymPreview` mock. A `launch`/`slug` key must be added to each tile and threaded through
  `symGo('mode', {game})` → `screens.js` so it can dispatch to a real `openX`.
- **Global-collision check:** the revamp defines `STATE`, `el`, `L` (and `render` as
  `window.symRender`). **No Ver1 shared engine file redefines these** at SPA scope.
  The only `const el =` hits are inside standalone `theory-study.html` documents (separate
  pages, never loaded into the SPA) — safe. See §2.

---

## 1. GAME CATALOG TABLE

Columns:
- **slug** — folder under `symposion-revamped/games/`.
- **openFn** — the global launch function the revamp tile must call (this is the manifest key).
- **JS files (load order)** — per-game files; shared engines/data globals that must already be
  loaded are listed in §2 (do NOT duplicate them per game).
- **overlay id** — the DOM container in Ver1 `index.html` the game renders into (line refs from Ver1 `index.html`).
- **CSS** — game stylesheet(s).
- **deps** — hard dependencies (FB=Firebase, SC=scores/ScoreTracker, RH=review-hub `logStudentMistake`, SE=shared-engine.js, DG=a data global must be eager, IFR=iframe, LA=LiveArena, GP=GP_DATASETS bridge).

> All openFns confirmed by source grep. "→ Obj.open()" means a thin global wrapper over an IIFE object.

| slug | openFn | JS files (load order, per-game) | overlay id | CSS | deps |
|---|---|---|---|---|---|
| afwnolekta | `openAfwnolekta(levelId,mode)` | data.js, game.js | `afw-overlay` (1606) | — | SE, DG(`AFW_G`,`AFW_VERBS`,`AFW_LEVELS`), SC, RH |
| agora-surfers | `openAgoraSurfers(config)` (alias `openTempleRun`) | adapter.js (+ src/*) | `temple-run-overlay` (2140) | (src bundled) | SC |
| antonymies | `openAntonymies()` | data.js, game.js | `ant-overlay` (2176) | — | DG(`ANT_DB`,`ANT_RAW`,`ANT_CASES`), SC, RH |
| anwmala-rimata | `openAnwmalaRimata()` → `ARV.open()` | data.js, game.js | `arv-overlay` (2150) | game.css | DG(`ARV_DB`), SC, RH |
| aoristos-b | `openAoristosB(levelId,mode)` | data.js, game.js | `aob-overlay` (1632) | — | SE, DG(`AOB_G`,`AOB_VERBS`,`AOB_LEVELS`), SC, RH |
| blade | `openBlade(arg,mode)` | game.js | `blade-overlay` (2441) | game.css | SC (data via cfg) |
| dig | `openDig()` (nav entry `openEngineConfigurator('dig')`) | game.js | `dig-overlay` (2992) | game.css | SC, GP |
| eimi | `openEimi()` → `EIMI.open()` | data.js, game.js | `eimi-overlay` (2127) | game.css | DG(`EIMI_PARADIGM`), SC, RH |
| epic-puzzle | `openEpicPuzzle(packId)` | game.js | `epic-puzzle-overlay` (2244) | — | SC |
| epitheta | `openEpitheta()` | data.js, game.js | `ept-overlay` (1619) | — | DG(`EPT_DB`,`EPT_CASES`,`EPT_SUBS`), SC, RH |
| golden-fleece | `openGoldenFleece(gp)` → `GoldenFleece.open()` | game.js | *(uses live-arena overlay)* | game.css | LA, FB, SC |
| halieia | `openHalieia(gp)` → `Halieia.open()` | game.js | *(uses live-arena overlay)* | game.css | LA, FB, SC |
| iliada-arcade | `openIliadaArcade()` | game.js, IliadaControls.js | `iliada-arcade-overlay` (1684) | game.css | SC — **eager-only (DOMContentLoaded init)** |
| iliada-trivia | internal `startGame()`; nav launches via generic `launchGame('gr')` | questions.js, game.js | `trivia-overlay` (1564) | game.css | DG(`QUESTIONS`,`QUOTES_GR`), SC |
| invaders | `openInvaders()` | data.js, game.js | `invaders-overlay` (2189) | game.css | DG(`INVADERS_DB`), SC |
| istoria | `openIstoria()` *(defined in Ver1 nav.js; iframe loader)* | *(iframe → games/istoria/index.html?course=g3)* | `istoria-overlay` (2091) | css/istoria.css (in iframe) | IFR |
| (history-game) | `openHistoryGame()` *(nav.js; iframe)* | *(iframe)* | `history-game-overlay` (2081) | — | IFR |
| klisi-rimaton | `openKlisiRimaton()` → `KR.open()` | data.js, game.js | `kr-overlay` (2114) | game.css | DG(`KR_DB`), SC, RH |
| labyrinth | `openLabyrinth()` (nav `openEngineConfigurator('labyrinth')`) | maze.js, questions.js, audio.js, ui.js, game.js | `labyrinth-overlay` (3002) | game.css | SC, GP |
| lat-antonymies | `openLatAntonymies()` (+`openLatAntonymiesTheory`) | data.js, game.js, theory.js | `latanwt-overlay`† | — | DG(`LAT_P_DB`,`LAT_P_PACKS`,`LAT_P_CASES`), SC, RH |
| lat-anwmala | `openLatAnwmala()` → `LIV.open()` (+theory) | data.js, game.js, theory.js | `latanw-overlay` (2318) | game.css | DG(`LIV_DB`), SC, RH |
| lat-epitheta | `openLatEpitheta()` | data.js, game.js | `late-overlay` (2331) | — | DG(`LAT_A_DB`,`LAT_A_DEGREES`,`LAT_A_SUBS`), SC, RH |
| lat-epitheta-kata | `openLatEpithetaKata()` (+theory) | data.js, game.js, theory.js | `latek-overlay` (2344) | — | DG(`LATEK_*`), SC, RH |
| lat-kata | `openLatKata()` | data.js, game.js | `latk-overlay` (2254) | — | DG(`LAT_KATA_*`), SC, RH |
| lat-nouns | `openLatNouns()` | data.js, game.js | `latn-overlay` (2292) | — | DG(`LAT_N_DB`,`LAT_N_CASES`,`LAT_N_SUBS`), SC, RH |
| lat-nouns-kata | `openLatNounsKata()` (+theory) | data.js, game.js, theory.js | `latnk-overlay` (2267) | — | DG(`LATNK_*`), SC, RH |
| lat-verbs | `openLatVerbs()` | data.js, game.js | `latv-overlay` (2305) | — | DG(`LAT_V_DB`,`LAT_V_PACKS`,`LAT_V_TENSES`), SC, RH |
| live-arena | `LiveArena.launchHost({...})` / `_gpLaunchLiveArena(cfg)` *(engine at js/live-arena.js, no folder JS)* | js/live-arena.js, js/live-arena-lobby.js, js/live-arena-quiz-builder.js | `la-overlay` (1753) | game.css, live-arena-lobby.css | FB, LA — **eager-only (const IIFE, unguarded onclicks)** |
| lyo | `openLyo(levelId,mode)` | game.js | `lyo-overlay` (1593) | game.css | DG(`LYO_G` in game.js), SC, RH |
| myth-memory | `openMythMemory()` | game.js | `myth-memory-overlay` (2224) | game.css | SC |
| naumachia | `openNaumachia(cfg)` (nav `openEngineConfigurator('naumachia')`) | game.js | `naumachia-overlay` (2429) | game.css | SC, GP |
| noun-fill | `openNounFill()` | game.js | `noun-fill-overlay` (2163) | — | DG(`DECL_LEVELS` in game.js), SC, RH |
| odyssey-journey | `initOdysseyJourney(lang)` (+`destroyOdysseyJourney`) | data.js, game.js | `odyssey-journey-overlay` (1733) | game.css | DG(`ODYSSEY_LOCATIONS`), SC |
| odyssey-trivia | `launchOdysseyTrivia(lang)` | questions.js, game.js | *(reuses trivia overlay)* | — | DG(`OD_QUESTIONS`→GP), SC |
| ousiastika | `openOusiastika()` | data.js, game.js | `ous-overlay` (1658) | — | DG(`OUS_DB`,`OUS_SUBS`,`OUS_CASES`,`NOUN_RAW_*`,`NOUN_ANOM`), SC, RH |
| paratheta | `openParatheta(levelId,mode)` | game.js | `par-overlay` (2101) | — | DG(`PAR_G` in game.js), SC, RH |
| pathitiko | `openPathitiko(levelId,mode)` | game.js | `path-overlay` (1580) | game.css | SE, SC, RH |
| phalanx | `openPhalanx()` (nav `openEngineConfigurator('phalanx')`) | phalanx-audio.js, phalanx-arena.js, phalanx-engine.js | `phalanx-overlay` (2982) | phalanx.css | SC, GP |
| rapid-fire | `openRapidFire(cfg)` | storm-audio.js, storm-arena.js, storm-content.js, storm-engine.js | `rf-overlay` (2234) | kataigismos.css | SC, GP |
| rimata-mi | `openRimataMi(levelId,mode)` | data.js, game.js | `rmi-overlay` (1645) | — | SE, DG(`RMI_G`,`RMI_VERBS`,`RMI_LEVELS`,…), SC, RH |
| study | `Mnemosyne.startStudySession(...)` via `navToStudy(datasetId)` | flashcards.js | `study-overlay` (3021) | — | SC |
| symposion | `openSymposion()` *(defined in Ver1 nav.js; board engine)* | symposion/app.js, engine/*, data/* | `symposion-overlay` (3258) | styles/board.css | — |
| synirimmena | `openSynirimmena(levelId,mode)` | data.js, game.js | `syn-overlay` (2068) | game.css | SE, DG(`SYN_G`,`SYN_LEVELS`,`SYN_VERB_LABELS`), SC, RH |
| teacher | `launchCustomHomework(gameData)` (+`openTemplatePicker`,`openBuilderModal`) | adapter.js, builder.js | `hwk-overlay` (2417), `hwk-loading-overlay` (2407) | teacher.css | SE, FB, SC |
| tow | `openTow(cfg)` | tow-audio.js, tow-arena.js, tow-questions.js, game.js | `tow-overlay` (1710) | tow.css | SC, GP |
| (noun-tow) | `openNounTow(cfg)` *(same files as tow)* | (same as tow) | `noun-tow-overlay` (1723) | tow.css | SC, GP |

† `lat-antonymies` overlay id needs in-DOM confirmation at wire time — `latanwt-overlay` (2382) and
`latp-overlay`/`latpt-overlay` (2357/2370) cluster around the latin section; verify the exact pairing
by reading the overlay's heading text. **COLLISION: latin overlay id ↔ slug pairing** (see §5).

Other overlays present in Ver1 `index.html` but **not** plain catalogue games:
`gv-overlay` (1671, grammar-verbs alias `openGrammarVerbs`→`openKlisiRimaton`),
`gn-overlay` (1697, grammar-nouns alias `openGrammarNouns`→`openOusiastika`),
`lekt-overlay` (2394), `games-panel-overlay` (3596, the GP launcher),
`tartarus-overlay` (2915, review-hub UI).

---

## 2. SHARED ENGINE — load once vs per-game

### 2.1 MUST be loaded once (eager, before any game launches)

These are read **synchronously** by the Games-Panel dataset bridge and by game launchers, and
several games share them. Load them once in the revamp shell, in this order:

```
firebase-config.js        ← FB init (only if any FB game is wired: live-arena/golden-fleece/halieia/teacher)
auth.js                   ← currentUser, db (FB games + scores persistence)
loader.js                 ← window.SymLoader.show/hide (lazy-loader calls it)
scores.js                 ← const ScoreTracker (IIFE) — used by ~every game for scoring
progression.js            ← XP/levels (gp-levels feeds it)
favorites.js              ← favourites
review-hub.js             ← logStudentMistake() — called by 15 game files DURING play; eager by design
gp-levels.js              ← level definitions for grammar games' grids
gp-content.js             ← window.GP_DATASETS (loaders that read game data globals synchronously)
games/shared-engine.js    ← gramRunGame/gramBuildScreens — grammar runner (see 2.3)
games/shared/touch-controls.js ← mobile controls for canvas games
```

> **Only 6 game files actually call `shared-engine.js`** (`gramRunGame`/`gramBuildScreens`):
> `afwnolekta`, `aoristos-b`, `rimata-mi`, `synirimmena`, `pathitiko`, and `teacher/adapter.js`.
> But because it is tiny and shared, keep it eager rather than per-game.

> **`review-hub.js` must stay eager** (do NOT lazy-load): it defines `logStudentMistake()` that 15
> game files call during gameplay; gating it silently stops populating the Tartarus mistake archive.

### 2.2 Data globals that must be EAGER (Phase-2b lesson learned)

Ver1 tried to lazy-load grammar games and **reverted** it: the Games-Panel `GP_DATASETS` loaders and
level grids read these globals synchronously at panel-render time, before the game is launched. If the
revamp surfaces a Games-Panel / level grid for a grammar game, that game's `data.js` (its `*_DB` /
`*_G` / `*_LEVELS` global) **must be eager**. If the revamp launches grammar games *directly* from a
tile (no level-grid preview), they CAN be lazy — verify per game which path the revamp uses.

Eager data globals (per game, see §1 `DG(...)`): `OUS_DB, LAT_V_DB, EIMI_PARADIGM, AOB_G, AFW_G,
RMI_G, SYN_G, EPT_DB, ANT_DB, ARV_DB, KR_DB, LIV_DB, LAT_*_DB, INVADERS_DB, LYO_G, PAR_G, DECL_LEVELS,
ODYSSEY_LOCATIONS, QUESTIONS/QUOTES_GR, OD_QUESTIONS`.

### 2.3 Per-game files (lazy-loadable)

`game.js` (+ `data.js`, multi-file engines like labyrinth/phalanx/tow/rapid-fire, theory.js) and
`game.css`. These load on first launch via the manifest (§4). Heavy canvas engines
(`temple-run/agora-surfers, naumachia, invaders, myth-memory, dig, labyrinth, epic-puzzle,
odyssey-journey, phalanx, rapid-fire, tow`) are the prime lazy candidates and are already lazy in
Ver1's `GAME_MANIFEST`.

### 2.4 Global-collision audit (revamp `STATE`/`render`/`el`/`L`)

The revamp shell defines (in `synthesis/js/`):
- `STATE` → `app.js:11` (also `window.STATE`)
- `el(tag,attrs,kids)` → `app.js:34` (`window.el`) — DOM builder that wires `on*` function handlers
- `render()` → `app.js:103`, exported as **`window.symRender`** (NOT `window.render`)
- `L(o)` → `data.js:37`, re-exported `window.L`

**Result: NO Ver1 shared-engine / scores / progression / nav file redefines `STATE`, `render`, `el`,
or `L` at SPA scope.** The only `const el =` matches are inside the four standalone
`games/lat-*/theory-study.html` documents, which are separate HTML pages (opened in their own context,
not script-injected into the SPA) — **no collision**. Ver1's per-game files use namespaced globals
(`ARV`, `EIMI`, `KR`, `LIV`, `Halieia`, `GoldenFleece`, `LiveArena`, `Mnemosyne`) and
`open*`/`*_DB` names that don't intersect the revamp's. **COLLISION risk is LOW** — but see §5 for
`data.js` filename clash and the `window.SYM` vs Ver1 data namespace note.

---

## 3. DATA MAPPING — revamp tiles → Ver1 openX

### 3.1 Revamp content model (source: `synthesis/js/data.js`)

- Everything hangs off **`window.SYM`** (`data.js:172`): `{ STR, CLASSES, SUBJECTS, ENGINES, L, GRAMMAR, … }`.
- `CLASSES` (`data.js:41`): `gym-a, gym-b, gym-c, lyk-a, lyk-b, lyk-c`. `GRAMMAR` pseudo-classes
  (`data.js:177`): `gram-archaia, gram-latin, gram-neo`.
- `SUBJECTS` is a map `classId → [ {id, name, games:[…]} ]`.
- **A tile is `g(gr, en, meta, illu)` = `{gr, en, meta, illu}` — NO id/slug/launch field.**
  Clicking a tile calls **`symGo('mode', { subject, game, cls })`** (`dir-synthesis.js:578`),
  which routes to `screens.js` `S.mode` → `S.level` → **`SymPreview.open(...)`** — a *static mock*,
  not a real game (`screens.js:258`).

### 3.2 Mapping table (revamp tile display name → Ver1 openFn)

The merge must add a launch key to tiles. Map by display name (Greek/English) → openFn:

| Revamp tile (gr / en) | Ver1 openFn | Notes |
|---|---|---|
| Οδύσσεια / Odyssey Trivia | `launchOdysseyTrivia('gr')` | |
| Οδύσσεια 3D / Odyssey 3D | `initOdysseyJourney('gr')` | needs `destroyOdysseyJourney` on close |
| Χρονολόγιο / Chronicle, Timeline | `openIstoria()` *(or `openHistoryGame()`)* | iframe; pick per class — see §5 |
| Mythology Memory | `openMythMemory()` | |
| Rapid Fire | `openRapidFire(cfg)` | cfg from GP bridge |
| Agora Surfers | `openAgoraSurfers(config)` (= `openTempleRun`) | |
| Ιλιάδα Arcade / Iliad Arcade | `openIliadaArcade()` | eager-only |
| Trivia Ιλιάδας / Iliad Trivia | `launchGame('gr')`→iliada-trivia `startGame()` | |
| Ελένη Quiz / Helen Quiz | *(no Ver1 game)* | **MISMATCH — revamp-only** |
| Ανάλυση Λόγου / Speech Analysis | *(no Ver1 game)* | **MISMATCH — revamp-only** |
| Κλίσις/Κλίση Ρημάτων / Verb Forms | `openKlisiRimaton()` (alias `openGrammarVerbs`) | |
| Συνηρημένα / Contract Verbs | `openSynirimmena(levelId,mode)` | |
| Ανώμαλα Ρήματα / Irregular Verbs (Greek) | `openAnwmalaRimata()` | |
| Ανώμαλα Ρήματα / Irregular Verbs (Latin) | `openLatAnwmala()` | latin context |
| Κλίση Ουσιαστικών / Noun Declension (Greek) | `openOusiastika()` (alias `openGrammarNouns`) | |
| Κλίση Ουσιαστικών / Noun Declension (Latin) | `openLatNouns()` | latin context |
| Επίθετα / Adjectives (Greek) | `openEpitheta()` | |
| Επίθετα / Adjectives (Latin) | `openLatEpitheta()` | |
| Επίθετα ανά Κείμενο / Adjectives by Text | `openLatEpithetaKata()` | |
| Παραθετικά / Adjective Degrees | `openParatheta(levelId,mode)` | |
| Αντωνυμίες / Pronouns | `openAntonymies()` | (lat: `openLatAntonymies()`) |
| Grammar Invaders | `openInvaders()` | |
| Φάλαγγα / Phalanx | `openPhalanx()` | via `openEngineConfigurator('phalanx')` |
| Ξίφος Γραμματικού / Grammarian's Blade | `openBlade(arg,mode)` | |
| Λύω / Learning to Decline | `openLyo(levelId,mode)` | |
| Λαβύρινθος / Labyrinth | `openLabyrinth()` | via `openEngineConfigurator('labyrinth')` |
| Λεξιλόγιο / Vocabulary | *(no clear Ver1 game)* | **MISMATCH — likely `study`/`navToStudy`** |
| Κατάταξη Κειμένων / Text Sorting | `openLatKata()` *(or `openLatNounsKata()`)* | latin; disambiguate by subject |
| Θεωρία / Theory | `openLat*Theory()` (theory.js openers) | per-game theory opener |
| Πολλαπλής Επιλογής / Multiple Choice | `openIstoria()` (istoria MC module) | iframe |
| Κάρτες Μνήμης / Flashcards | `navToStudy(datasetId)` → `Mnemosyne` | |
| Πηγές / Sources | *(no Ver1 game)* | **MISMATCH — revamp-only** |
| Αντιστοίχιση / Matching | istoria matching module (iframe) | |
| Συντακτικό, Μετοχές, Δευτ. Προτάσεις, Πτώσεις, Χρόνοι & Εγκλίσεις, Μέρη του Λόγου, Κειμενικά Είδη, Επιχειρηματολογία, Τόνοι & Σημεία, Ομόηχα, Παραγωγή & Σύνθεση | *(no dedicated Ver1 game)* | **MISMATCH — revamp-only placeholders** (route to nearest existing game or keep as `SymPreview`) |

### 3.3 Games in Ver1 but with NO revamp tile (orphans to surface or drop)

`golden-fleece, halieia, naumachia, dig, tow/noun-tow, epic-puzzle, eimi, klisi-rimaton (as standalone),
afwnolekta, aoristos-b, rimata-mi, pathitiko, lat-verbs, lat-kata, lat-nouns-kata, lat-anwmala,
noun-fill, symposion, live-arena (+ MPGAMES: krypteia/hegemonia/battle-royale)`. Many are reachable via
the Games-Panel/multiplayer (`window.SYM.MPGAMES` has ids `krypteia, halieia, hegemonia, battle-royale,
golden-fleece, tow`) rather than subject tiles. **Decide per game** whether to add a tile or route
through a GP/multiplayer screen.

---

## 4. RECOMMENDED LAUNCH MECHANISM (low-conflict, multi-agent-safe)

Mirror Ver1's `js/lazy.js` exactly. Add three new files under `synthesis/` and copy game folders in.

### 4.1 Files

1. **`synthesis/js/syn-lazy.js`** — copy of Ver1 `js/lazy.js` core (`lazyLoad`, `_lazyRoute`,
   `window.APP_BASE`). Load it EARLY in `synthesis/index.html` (before app.js wires clicks). It already
   resolves paths from its own `<script src>`, so it works at web-root or sub-folder.

2. **`synthesis/js/syn-game-manifest.js`** — the single shared registry. Shape per entry:
   ```js
   window.SYN_GAMES = {
     openInvaders: {
       js:      ['games/invaders/data.js', 'games/invaders/game.js'], // load order
       css:     ['games/invaders/game.css'],
       overlay: 'invaders-overlay',          // id to ensure-injected before launch
       eager:   false,                        // true → never lazy (iliada-arcade, live-arena)
       fb:      false                         // true → require firebase-config+auth first
     },
     // …one entry per game…
   };
   ```
   **Each game's `js` paths are RELATIVE to the copied Ver1 `games/` tree** (see 4.4).

3. **`synthesis/js/syn-launch.js`** — the injector + dispatcher:
   ```js
   async function synLaunch(openFn, ...args) {
     const m = window.SYN_GAMES[openFn];
     if (!m) return console.warn('no manifest entry', openFn);
     SymLoader && SymLoader.show && SymLoader.show();
     if (m.fb) await synEnsureFirebase();          // load firebase-config+auth once
     synEnsureCss(m.css);                            // inject <link> once (idempotent)
     synEnsureOverlay(m.overlay);                    // inject overlay HTML once (see 4.3)
     await lazyLoad(m.js);                            // dedup'd by syn-lazy
     SymLoader && SymLoader.hide && SymLoader.hide();
     return window[openFn](...args);                 // call the real Ver1 opener
   }
   window.synLaunch = synLaunch;
   ```
   Overlay HTML is injected from a small `synthesis/overlays/<id>.html` partial (one file per overlay,
   extracted from Ver1 `index.html`) OR from an `overlayHtml` string embedded in the manifest entry.
   `synEnsureOverlay` is a no-op if `document.getElementById(id)` already exists.

### 4.2 Wiring a revamp tile click

In the revamp, add a launch key to the tile factory and thread it to the mode/level screen:
- `synthesis/js/data.js`: extend `g(gr,en,meta,illu,launch)` → add `launch:{ fn:'openInvaders', args:[] }`
  (or a bare `slug` resolved via the mapping table in §3).
- `synthesis/js/screens.js` `S.mode`/`S.level`: where it currently calls `SymPreview.open(...)`, branch:
  `if (game.launch) return synLaunch(game.launch.fn, ...(game.launch.args||[]));` else keep `SymPreview`.

This is the **only** edit to shared revamp files; do it once, then game batches only touch the manifest.

### 4.3 Overlay injection

Two options (pick one project-wide):
- **(A) Extract partials** — copy each overlay `<div id="…-overlay">…</div>` from Ver1 `index.html`
  into `synthesis/overlays/<id>.html`. `synEnsureOverlay` fetches+injects on first launch. Cleanest;
  each agent extracts only its batch's overlays → no merge conflicts.
- **(B) Inline in manifest** — put the overlay markup as `overlayHtml` in the manifest entry. Simpler,
  no fetch, but bloats the manifest file → higher chance of two agents editing the same file region.

**Recommendation: (A)** — one partial file per overlay, named by id; agents never touch each other's files.
Note: `live-arena` uses its overlay specially (`la-overlay`, eager).

### 4.4 Game-folder copy (parallel-safe)

Copy `symposion-revamped/games/<slug>/` → `synthesis/games/<slug>/` (preserve relative `games/…` paths
so manifest entries match). Each agent copies ONLY its batch's folders. Shared deps copied once into
`synthesis/games/` (`shared/`, `shared-engine.js`) and `synthesis/js/` (`scores.js, progression.js,
favorites.js, review-hub.js, gp-levels.js, gp-content.js, loader.js`, and `firebase-config.js, auth.js`
if FB games included). These shared copies are a **single up-front commit** by one agent before batches start.

### 4.5 Batching plan (no conflicts)

- **Batch 0 (foundation, one agent first):** add `syn-lazy.js`, `syn-launch.js`, empty
  `syn-game-manifest.js`, copy shared deps, edit `data.js` `g()` factory + `screens.js` dispatch. Commit.
- **Batches 1..N (parallel):** each agent (a) copies its game folders, (b) appends its entries to a
  **dedicated manifest fragment** `synthesis/js/manifest/<batch>.js` (merged into `SYN_GAMES` —
  avoids two agents editing one file), (c) extracts its overlay partials, (d) sets each tile's `launch`
  key in its subjects. Suggested batches: grammar-greek, grammar-latin, canvas-arcade, trivia/iframe,
  multiplayer/firebase.

> Using one manifest **fragment file per batch** (loaded via multiple `<script>` tags or a glob) is the
> key to letting agents run fully in parallel without touching the same lines.

---

## 5. RISK / COLLISION LIST (human decisions flagged)

- **COLLISION: tiles have no launch id.** Revamp `g()` tiles are `{gr,en,meta,illu}` only and currently
  open a static `SymPreview`. A `launch`/`slug` key must be added and `screens.js` `S.mode`/`S.level`
  re-pointed from `SymPreview.open` to `synLaunch`. This is a shared-file edit — do it in Batch 0 only.

- **COLLISION: revamp-only tiles with no Ver1 game.** Helen Quiz, Speech Analysis, Sources, and most
  Συντακτικό/Modern-Greek grammar tiles (Μετοχές, Δευτ. Προτάσεις, Πτώσεις, Μέρη του Λόγου, Κειμενικά
  Είδη, Επιχειρηματολογία, Τόνοι & Σημεία, Ομόηχα, Παραγωγή & Σύνθεση) have no Ver1 implementation.
  **Human decision:** route each to the nearest existing game, or keep `SymPreview` as a "coming soon".

- **COLLISION: `data.js` filename clash.** Revamp has `synthesis/js/data.js` (defines `window.SYM`);
  Ver1 has `js/data.js` (different content) and many `games/*/data.js`. The Ver1 *engine* `js/data.js`
  is NOT needed (revamp replaces it). Only the **per-game** `games/*/data.js` are copied. Do NOT copy
  Ver1 `js/data.js` over the revamp's. Confirm no game `game.js` depends on Ver1 `js/data.js` globals
  (e.g. catalog arrays) vs its own folder data — spot-check the grammar games' data-global sources.

- **COLLISION: Chronicle/Timeline/Multiple-Choice/Matching all map to `istoria` (iframe).** The revamp
  has several distinct history tiles (Χρονολόγιο, Πολλαπλής Επιλογής, Αντιστοίχιση, Πηγές across gym-b /
  lyk-c). Ver1 serves these as **modules inside one iframe** (`games/istoria/index.html?course=…`).
  **Human decision:** which `course=`/module each revamp tile opens, and whether `openHistoryGame()`
  (separate iframe at `history-game-overlay`) vs `openIstoria()` is the target.

- **COLLISION: latin overlay id ↔ slug pairing.** The latin overlays cluster (`latanw/late/latek/
  latk/latn/latnk/latv/latanwt/latp/latpt`) around Ver1 `index.html` 2254–2394; the exact id for
  `lat-antonymies` vs `lat-epitheta` etc. must be confirmed by reading each overlay's heading before
  wiring. Listed §1 values are best-match; verify at wire time.

- **COLLISION: eager-only games can't be lazy.** `iliada-arcade` inits on `DOMContentLoaded`;
  `live-arena` is a top-level `const LiveArena` IIFE invoked from **un-guarded inline onclicks** with
  realtime Firestore + `?join=NNNNNN` auto-join. Ver1 explicitly **deferred** lazy-loading both.
  **Decision:** load these eagerly in the revamp (`eager:true` in manifest), or refactor live-arena to
  `window.LiveArena` + guarded handlers first.

- **COLLISION: Firebase coupling.** `live-arena, golden-fleece, halieia, teacher` need
  `firebase-config.js` + `auth.js` (and Firestore rules/`db`). If the revamp does not init Firebase,
  these games fail. **Decision:** include Firebase init in the shell (and confirm `firebase-config.js`
  project matches) or exclude these games from the first merge.

- **COLLISION: GP_DATASETS bridge for canvas games.** `dig, labyrinth, phalanx, naumachia, rapid-fire,
  tow` receive their questions from the Ver1 Games-Panel bridge (`openEngineConfigurator(id)` /
  `window.GP_DATASETS` / `_gpTowPool` / `PH_Q` / `RF_PACKS`). Launching them directly from a revamp tile
  must supply an equivalent `cfg`/content pool, or wire `openEngineConfigurator` + `gp-content.js`.
  **Decision:** port the GP content bridge, or pass a minimal cfg per launch.

- **COLLISION: grammar data globals must stay eager if a level grid is shown.** Ver1 reverted lazy
  grammar games because `GP_DATASETS`/level grids read `*_DB`/`*_G` synchronously. If the revamp shows a
  level/preview grid before launch, keep those `data.js` eager; if it launches straight to the game, they
  may be lazy. **Decide per game** based on the revamp's mode/level screen behaviour.

- **Note (not a collision):** `STATE`/`el`/`L`/`render` do NOT collide (revamp's `render` is exported as
  `symRender`; Ver1 game globals are namespaced). Standalone `theory-study.html` `const el` is page-local.

---

## Appendix A — Source references (absolute paths)

- Ver1 lazy-loader & existing manifest: `/home/user/SymposiON-Revamped/symposion-revamped/js/lazy.js`
- Ver1 migration history (Phase 2a/2b lessons): `/home/user/SymposiON-Revamped/symposion-revamped/MIGRATION-PLAN.md`
- Ver1 overlay shells + eager script order: `/home/user/SymposiON-Revamped/symposion-revamped/index.html`
- Ver1 nav dispatch (`openSymposion`/`openIstoria`/`openEngineConfigurator`/`launchGame`/`navToStudy`):
  `/home/user/SymposiON-Revamped/symposion-revamped/js/nav.js`
- Ver1 shared grammar engine: `/home/user/SymposiON-Revamped/symposion-revamped/games/shared-engine.js`
- Ver1 scores/progression/favorites/review-hub/gp-*: `/home/user/SymposiON-Revamped/symposion-revamped/js/`
- Revamp content model (`window.SYM`, `g()` factory): `/home/user/SymposiON-Revamped/synthesis/js/data.js`
- Revamp tile render + click dispatch (`symGo('mode',…)`, `synTile`): `/home/user/SymposiON-Revamped/synthesis/js/dir-synthesis.js`
- Revamp shell globals (`STATE`,`el`,`render`/`symRender`,`L`,`symGo`): `/home/user/SymposiON-Revamped/synthesis/js/app.js`
- Revamp mode/level screens + `SymPreview`: `/home/user/SymposiON-Revamped/synthesis/js/screens.js`
