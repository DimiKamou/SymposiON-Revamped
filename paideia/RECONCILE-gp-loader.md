# GP content-loader reconciliation — status & remaining steps

_Context: the Καταιγισμός (rapid-fire) install + a paywall/loader hardening pass landed
at the same time as a parallel GP refactor (`gp-content.js`, `gp-levels.js`). This note
captures the merged state and the one remaining gap, so the lobby alignment can be
finished without re-deriving the analysis._

## Architecture (current, working tree)

- **`js/gp-content.js`** — `window.GP_CONTENT`: the single registry. Replaces the
  hand-maintained `GP_DATASETS` array (now a **live view**: `window.GP_DATASETS = _reg`).
  Sources: in-code (grammar/Homer/Latin, ported 1:1 with loader/tier/leveled/levelsGlobal),
  curriculum from `GRADES`, and **Firestore** published packs via `GP_CONTENT.loadCloud()`
  (`config/datasets` manifest + `custom_games` where `published==true`). Cloud datasets use
  `loader:()=>null` and rely on the `game_data/{id}` Firestore fallback.
- **`js/gp-levels.js`** — `window.GP_LEVEL_PROVIDERS[datasetId]`: the level system for all
  8 leveled datasets. `{ levels:[{id,group,color,desc}], filterRaw(rawDB, selectedIds),
  generator(id) }`. Multi-select, shape-preserving (dict→dict, array→array), correct
  predicates inlined. **Note:** the level arrays (`OUS_LEVELS`, `AOB_LEVELS`, `LATN_LEVELS`,
  …) live *inside* the IIFE — they are **not** globals.
- **`js/nav.js` `gpLoadQuestions(datasetId, {levelId, levelIds})`** — the single loader.
  Order: tier gate (`_gpCanAccessTier`) → sync `loader()` → Firestore fallback
  (`_gpFetchFirestore`, session-cached) → **GP_LEVEL_PROVIDERS union** (providers-first,
  `generator`/`filterRaw` over `levelIds`) → `RF_LEVEL_FILTER` *fallback* if no provider
  applied → `_gpNormalizeQuestions`. `initGameWithData` delegates to it.

## Done & verified

- **Paywall gate (Phase 1).** `storm-content.getSourceGroups` marks `locked: !_srcAccessible(ds)`
  (🔒 Pro, click → subscribe); `loadPool` hard-blocks (`denied:true`) for un-entitled tiers;
  `_rfBegin` routes denied → subscribe. Verified: free user sees the 6 student datasets locked,
  cannot load them; entitled student can.
- **Shared loader (Phase 2) + provider merge.** `nav.js` `gpLoadQuestions` already merges the
  Phase-2 gate/Firestore/cache/normalize with the `GP_LEVEL_PROVIDERS` multi-select system.
  Verified live: Panel launch builds correct cfg; `ousiastika` level-1 → 250 Qs (both Panel and
  lobby); `lat-nouns` denied for free user; lobby plays MC/TF/Match with real content.

## Remaining gap: the **lobby** (`games/rapid-fire/storm-content.js`) is not provider-aligned

It still uses the interim approach:
- `getLevels` resolves level arrays by eval-ing `const` globals (`ds.levelsGlobal`) — which
  **cannot find** the new arrays (they're IIFE-local in gp-levels.js). So the lobby only shows
  levels for the 2–3 datasets whose arrays are still game-file globals; the Panel shows all 8.
- `loadPool` passes single `{levelId}` → hits the `RF_LEVEL_FILTER` *fallback*, not the
  provider path the Panel uses.

### Finish (3 steps)
1. **`getLevels`** (kind `gp`): return `GP_LEVEL_PROVIDERS[ds.id].levels` mapped to
   `{id, group, color, desc, _raw:l}` instead of the eval/const-global resolution.
2. **`loadPool`** (kind `gp`): pass `levelIds: level ? [level.id] : null` to `gpLoadQuestions`
   (single chip → 1-element array). Optionally adopt multi-select in the lobby UI later
   (providers already support it).
3. **Retire dead code** once 1–2 land: `window.RF_LEVEL_FILTER` (nav.js tail), `_gpResolveLevel`
   (nav.js), and the `!_multiApplied` fallback branch in `gpLoadQuestions`. Confirm no other
   callers first (`grep -rn RF_LEVEL_FILTER paideia/`).

## Also worth doing (lobby ↔ Panel parity)
- **Cloud content in the lobby.** `getSourceGroups` reads `GP_DATASETS` but never calls
  `GP_CONTENT.loadCloud()`, so Firestore-published / teacher datasets don't appear in
  Καταιγισμός. Have the lobby `await GP_CONTENT.loadCloud()` before building its list (this
  makes the lobby source list async — fits the already-async `_rfBegin`/`loadPool`).
- **`iliada-deep`** loads from `game_data/iliada-deep` for a **logged-in entitled student**;
  Firestore rules block anonymous reads (confirmed locally), so it can only be verified in an
  authenticated session. Mechanism is correct (gate passes, fetch runs, graceful on denial).

## Files touched in this pass (for reference)
- `games/rapid-fire/storm-content.js` — tier gate (getSourceGroups + loadPool), async loadPool
  → gpLoadQuestions, getLevels const-resolver (interim).
- `games/rapid-fire/storm-engine.js` — locked-source UI + subscribe routing, async `_rfBegin`
  with loading state + load-token.
- `games/rapid-fire/kataigismos.css` — `.sf-source.locked` / `.sf-source-lock`.
- `js/nav.js` — `gpLoadQuestions`, `_gpFetchFirestore`, `_gpResolveLevel`, `RF_LEVEL_FILTER`
  (interim), `initGameWithData` delegates to the shared loader. (Provider merge added by the
  parallel GP refactor.)
- Install: `js/lazy.js` manifest, `index.html` stylesheet link, `js/data.js` tile blurbs.
