# Task 4 — Level Migration Mapping (for approval)

**Goal:** restructure each dataset's levels into broad **umbrellas** (`group`) + optional
**subsections** (`sub`), drop the `color` tier, and add the high-score display — **while
preserving every real `id` and every `filter` / `sub` / `f` selection code** (gp-levels.js and
the game engines key on those). No `id` is renumbered, no selection code is changed.

> ⚠️ **Key finding:** the prototype `design/data.js` is **not** id-faithful. For several datasets
> it renumbers and reduces the level set (e.g. synirimmena **10** prototype vs **22** real;
> afwnolekta **21** vs **26**; pathitiko **17** vs **23**). Per the hard requirement, the migration
> is driven by the **real arrays**; the prototype is used only for the *grouping concept*
> (umbrella names + which stem-types become `sub`). Where the prototype renumbered, we keep real
> ids and re-apply the umbrella/sub idea on top of them.

Each dataset's levels live in **two synced copies** (your decision: update both, keep separate):
1. the game file's `*_LEVELS` (window global named by `levelsGlobal`) — drives the game's own
   screen + admin;
2. the inline copy inside `js/gp-levels.js` `GP_LEVEL_PROVIDERS` — drives the configurator picker.

---

## Status legend
- ✅ **Wired** = registered `leveled:true` **and** has a `GP_LEVEL_PROVIDERS` entry → works in the
  configurator picker today.
- 🟡 **Provider-gap** = `leveled:true` but **no provider** → picker currently shows nothing.
- 🔵 **Game-only** = has in-game level UI but **not** in the configurator (not registered / not
  leveled / different model).
- 🆕 **New** = no level array yet.

| Dataset | id | levelsGlobal | Status | Migration complexity |
|---|---|---|---|---|
| Λύω | `lyo` | `LYO_LVL`* | ✅ | Low — cosmetic group renames |
| Ουσιαστικά | `ousiastika` | `OUS_LEVELS` | ✅ | **Med** — 11 rail groups → 5 umbrellas + `sub` |
| Αντωνυμίες | `antonymies` | `ANT_LEVELS` | ✅ | Low–Med — merge singleton groups + `sub` |
| Αόριστος Β΄ | `aoristos-b` | `AOB_LEVELS` | ✅ | Low — group renames |
| Συνηρημένα | `synirimmena` | `SYN_LEVELS` | ✅ | **Med** — keep 22 ids, re-umbrella (see below) |
| Αφωνόληκτα | `afwnolekta` | `AFW_LEVELS` | ✅ | **Med** — keep 26 ids, add voice `sub` |
| Ρήματα -μι | `rimata-mi` | `RMI_LEVELS` | ✅ | Low — group renames |
| Λατ. Ουσιαστικά | `lat-nouns` | `LATN_LEVELS` | ✅ | Low–Med — Γ΄ stem-types → `sub` |
| Λατ. Επίθετα | `lat-epitheta` | `LATE_LEVELS` | 🟡 | Low + **add provider** |
| Επίθετα | `epitheta` | `EPT_LEVELS` | 🔵 | Low + **register + provider** |
| Παραθετικά | `paratheta` | `PAR_LVL` | 🔵 | Low + **register + provider** |
| Παθητικός | `pathitiko` | `PATH_LVL` | 🔵 | Med + **register + provider** |
| Εἰμί | `eimi` | 🆕 `EIMI_LEVELS` | 🆕 | **High** — build levels + provider + flip leveled |
| Ανώμαλα Ρήματα | `anwmala-rimata` | 🆕 (from `ARV_DB.letter`) | 🔵🆕 | **High** — alpha model + provider + flip |
| Λατ. Ρήματα | `lat-verbs` | `LATV_LEVEL_GROUPS` (packs) | 🔵 | **High** — pack model → id-levels |
| Λατ. Αντωνυμίες | `lat-antonymies` | `LAT_P_PACKS` | 🔵 | **High** — pack model → id-levels |

\* `lyo` is generator-leveled; its provider exposes `LYO_LVL` for the UI only.

---

## A. The 8 wired datasets — faithful regroup (no id/filter change)

### lyo — εγκλίσεις already broad
Real groups: Οριστική / Υποτακτική / Ευκτική / Προστακτική / **Απαρέμφατο & Μετοχή** / Συνδυαστικό.
- Change: rename `Απαρέμφατο & Μετοχή` → **`Ονοματικοί Τύποι`** (prototype name). No `sub`.
- Drop `color`. All 32 ids unchanged.

### ousiastika — the big one (11 → 5 umbrellas)
Real rail groups today: `Α΄ Κλίση`, `Β΄ Κλίση`, `Γ΄ Κλίση — Φωνηεντόληκτα`, `Γ΄ Κλίση — Συμφωνόληκτα`,
`Γ΄ Κλίση — Οδοντικόληκτα -ντ`, `Γ΄ Κλίση — Ενρινόληκτα`, `Γ΄ Κλίση — Υγρόληκτα`,
`Γ΄ Κλίση — Σιγμόληκτα`, `Ανώμαλα`, `Γ΄ Κλίση — Όλα`, `Master Challenge`.

New structure:
| New umbrella | `sub` (subsection) | ids |
|---|---|---|
| Α΄ Κλίση | — | 1,2,3 |
| Β΄ Κλίση | — | 4,5,6 |
| **Γ΄ Κλίση** | Φωνηεντόληκτα | 7–12 |
| | Αφωνόληκτα (Ουρανικά/Χειλικά/Οδοντικά) | 13,14,15 |
| | Οδοντικόληκτα -ντ | 16,17,18 |
| | Ενρινόληκτα | 19,20 |
| | Υγρόληκτα | 21,22 |
| | Σιγμόληκτα | 23–26 |
| | (Όλα) | 30 |
| Ανώμαλα | — | 27,28,29 |
| Master Challenge | — | 31 |

All `sub:[...]` selection codes (`'1_αρσ'`, `'φων_ως'`, …) and ids **unchanged**. Only the display
`group`/`sub` strings change. (Note: real id 30 = "Γ΄ — Όλα", id 31 = Master — kept.)

### antonymies — merge singletons
Real groups: Προσωπικές / Δεικτικές / Αυτοπαθείς / **Αναφορικές** / **Ερωτηματικές** / **Αόριστες** /
Κτητικές / Master.
- Merge `Αναφορικές` + `Ερωτηματικές` + `Αόριστες` → umbrella **`Αναφορικές & Λοιπές`** with
  `sub` = Αναφορικές / Ερωτηματικές / Αόριστες (ids 12,13,14).
- id 18 (Μεταφραστικό, `sub:'transl'`) is translate-only → stays out of the provider bank (as
  today), but I'll surface it under a **`Σύνθετα`** umbrella in the picker as a non-quiz entry, per
  prototype. id 19 (Master) kept. All ids/subs unchanged.

### aoristos-b
- Rename `Προστακτική & Απαρέμφατο` → **`Προστακτική & Ονοματικοί`**; `Master Challenge` →
  **`Συνδυαστικό`** (cosmetic). 6 ids, `f` filters unchanged.

### synirimmena — keep 22 ids (prototype's 10 rejected)
Real groups are **per verb**: `τιμῶ (τιμάω)` / `ποιῶ (ποιέω)` / `δηλῶ (δηλόω)` / `Συνδυαστικό`
(6+6+6+4 = 22 levels). The prototype collapses to 10 `-άω/-έω/-όω` levels — **not adoptable**
without breaking ids/filters.
- **Proposed:** keep the per-verb umbrellas (they're already broad: 4 rails), drop `color`, done.
  Optionally rename to `τιμῶ — Ρήματα σε -άω` etc. for parity with the prototype's vocabulary.
  All 22 ids + `f` filters unchanged.

### afwnolekta — keep 26 ids, add voice `sub`
Real groups: Μέλλοντας / Αόριστος / Παρακείμενος / Συνδυαστικό (ids 1–26).
- Keep the 4 χρόνος umbrellas; add `sub` = **Ενεργητική / Μέση** within each (the prototype's idea),
  derived from each level's existing `f.voices`. Combined/“Όλα” levels get no `sub`.
- All 26 ids + `f` unchanged. (Real special levels 27/28 isEq/isAug already excluded from provider —
  unchanged.)

### rimata-mi
- Rename `Master Challenge` → **`Συνδυαστικό`** (optional). 11 ids + `f` unchanged.

### lat-nouns — Γ΄ stem-types → sub
Real groups: Α΄ / Β΄ / Γ΄ / Δ΄ / Ε΄ / Master (ids 1–16). Γ΄ already one umbrella (ids 7–11).
- Add `sub` inside Γ΄ (Συμφωνόληκτα / Φωνηεντόληκτα (i-stem) / Ουδέτερα) per prototype. ids/subs
  unchanged.

---

## B. Provider-gap & game-only (regroup + wire into configurator)

These have real `{id,group,color,desc,sub|filter}` arrays but are **not usable in the configurator**
today. Migration = regroup (drop color, add sub) **and** add the missing wiring. **Decision needed:
do we bring these into the configurator now, or only restyle their own in-game screens?**

- **lat-epitheta** (`LATE_LEVELS`, ids 1–10) — registered leveled but no provider. Groups
  Β΄/Γ΄/Παραθετικά/Master already broad. Add `GP_LEVEL_PROVIDERS['lat-epitheta']` using its `sub`
  codes + `_lateFilter`. id 9 (`degrees`) is a special recognition mode.
- **epitheta** (`EPT_LEVELS`, ids 1–9) — merge the two `Τρικατάληκτα …` groups into one umbrella +
  `sub` (Α΄/Β΄ vs Α΄/Γ΄), per prototype. Register + provider via `_eptFilterAdj`.
- **paratheta** (`PAR_LVL`, ids 1–10) — groups -ος / -ης / Ανώμαλα / Συνδυαστικό already broad.
  Register + provider via its `filter:{categories,degrees}` model.
- **pathitiko** (`PATH_LVL`, ids 1–23) — real groups: Παθ. Μέλλοντας (βασικά) / Παθ. Αόριστος
  (βασικά) / Συνδυαστικό (βασικά) / Αφωνόληκτα — Χειλικά/Ουρανικά/Οδοντικά / Αφωνόληκτα Συνδυαστικό.
  New: umbrellas **Παθ. Μέλλοντας / Παθ. Αόριστος / Αφωνόληκτα (sub: φθ/χθ/σθ) / Συνδυαστικό**,
  keeping all 23 ids + `filter`. Register + provider.

---

## C. Structural / new (largest work)

- **eimi** 🆕 — currently `leveled:false`, data = `EIMI_PARADIGM` (tenses → groups[mood] → forms).
  Build a new **`EIMI_LEVELS`**: umbrella = **χρόνος** (Ενεστώτας / Παρατατικός / Μέλλοντας +
  Συνδυαστικό), levels = **έγκλιση** per tense (Οριστική/Υποτακτική/Ευκτική/Προστακτική/Ονοματικοί/
  Όλα), each with a `filter` keyed on `{tense, mood}`. Add provider + flip `leveled:true`. The
  prototype `EIMI_LEVELS` (11 levels) is a good target shape; ids are free (new array).
- **anwmala-rimata** 🔵🆕 — `leveled:false`; `ARV_DB` entries carry `letter` (Α–Ω). Build levels =
  one per **letter present** (group = letter), provider filters `ARV_DB` by `letter`. Flip
  `leveled:true` + set `alpha:true` so the picker renders the Α–Ω index bar. ids = letter order.
- **lat-verbs** 🔵 — model is **packs** (`LATV_LEVEL_GROUPS` → `LAT_V_PACKS`), no `{id}` levels.
  Bringing it into the picker means generating an id-level array from the packs (group = συζυγία,
  level = pack) + a pack-union provider. **Bigger change** — confirm scope.
- **lat-antonymies** 🔵 — same pack model (`LAT_P_PACKS`). Same treatment as lat-verbs.

`klisi-rimaton` is `leveled:false` and stays a non-leveled “full conjugation” tool (out of scope).

---

## Locked decisions
1. **Scope:** migrate **only the 8 wired datasets** this pass. (B & C deferred to a later pass.)
2. **synirimmena:** keep the real **per-verb** umbrellas (22 ids preserved). No change needed.
3. **Group renames:** apply the prototype's vocabulary (Master Challenge → Συνδυαστικό on the
   *Greek* sets; Latin keeps "Master Challenge" per the prototype's own usage; Απαρέμφατο & Μετοχή →
   Ονοματικοί Τύποι).
4. **`color`:** retained in the data arrays (legacy in-game screens still render it); the new picker
   ignores it.
5. **Subsection field:** the additive field is **`section`** (string|null), NOT `sub` — because
   `sub` already holds the question-selection codes in the real data.

## Status — DONE (verified in-browser, both copies, all ids/filters preserved)
| Dataset | Change | ids |
|---|---|---|
| ousiastika | 11→5 umbrellas; Γ΄ stem-types → `section` ×5 | 1–31 ✓ |
| lyo | Απαρέμφατο & Μετοχή → Ονοματικοί Τύποι | 1–32 ✓ |
| aoristos-b | Προστακτική & Ονοματικοί; Master → Συνδυαστικό | 1–6 ✓ |
| rimata-mi | Master → Συνδυαστικό | 1–11 ✓ |
| lat-nouns | Γ΄ stem-types → `section` ×3 | 1–16 ✓ |
| antonymies | merge → Αναφορικές & Λοιπές (3 `section`s); Μεταφραστικό → Σύνθετα; Master → Συνδυαστικό | 1–19 ✓ |
| synirimmena | already conformant (per-verb umbrellas) — no change | 1–22 ✓ |
| afwnolekta | already broad umbrellas — no change | 1–26 ✓ |

**Deferred (optional, low-risk to add later):** afwnolekta voice (`Ενεργητική`/`Μέση`) `section`s
inside its χρόνος umbrellas — skipped to avoid rewriting its 26 complex `f`-filter lines; its
umbrellas are already broad so this is purely cosmetic.
