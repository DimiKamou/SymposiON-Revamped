# SymposiON — Level & Content Selection: Redesign Brief

> A designer-ready brief for redesigning SymposiON's universal **«Διάλεξε ύλη»** ("Choose content") picker. You do **not** need access to the codebase. Everything you need — the product, the component, its current anatomy, data shapes, goals, and constraints — is in this document.

---

## 1. TL;DR

«Διάλεξε ύλη» is SymposiON's **universal content + level-selection surface**: a teacher or host picks *which curriculum material* (ύλη) to play and, for leveled datasets, *exactly which levels* — and can mix several sources into one combined question pool. It already works, but it reads as a functional list, not a confident, premium ritual. We want it elevated to a **fast, museum-grade selection experience** — Kahoot/Quizizz/Blooket polish wearing a classical chiton — where a teacher under classroom pressure can mix and launch in under ~15 seconds. Keep every capability (multi-select mix, per-level granularity, search/tags, hide-collapse, difficulty colour, dual-theme), redesign only the expression.

---

## 2. The Product & The Component

**SymposiON** is a Greek-first (fully bilingual gr/en) educational game platform with a classical visual identity — terracotta, gold, aegean blue, cream parchment. Teachers assign and host; students practise and compete.

The «Διάλεξε ύλη» picker is the **one universal component that does three jobs.** The same render — search box, tag chips, dataset cards, per-level lists, and a confirm bar — is reused in three places; only the leaf action on "Start" differs:

| Entry point | Context | On confirm / "Start" |
|---|---|---|
| **Game Panel** (browse-by-curriculum) | A student/teacher drills στάδιο → τάξη → μάθημα → παιχνίδι and launches a game directly. *(Note: this entry uses a separate drill-down render, not the mix picker described here.)* | Launches a game directly. |
| **PvP Arena · «Ο Ἀγών»** | Staging a 1-v-1 duel. | Saves the selection, launches the PvP Arena. |
| **Live Arena · Host** | A teacher hosts a live class match. | Advances to a **second setup screen** (game-mode + match config) before opening the lobby. |

The **mix picker this brief covers** (search + tag chips + dataset cards + level lists + bottom action bar) is the **shared render used by PvP and Live-host**. Titles and subtitles swap per entry point; the body is identical. A teacher can pick **one source or combine several** ("μείξη" / mix); on confirm the platform builds a single merged question bank.

The picker renders inside a page shell that provides an eyebrow (e.g. "Ο Ἀγών · PvP"), a large title (e.g. "Διάλεξε ύλη για τον Αγώνα"), a subtitle, and a back chip. The catalog of available content (grammar + class content + published packs) is supplied to the component as data.

---

## 3. Who Uses It & When

- **Teacher, live, under pressure.** Mid-class, projector on, students waiting. Wants to pick a subject, mix in a second dataset, confirm levels, and launch a match in **under ~15 seconds**. Interruptions are constant; the picker must survive a glance-away-and-return.
- **Student, self-directed.** Choosing practice content solo. Lower stakes but lower patience — needs an "obvious good default" path plus the freedom to narrow by topic or difficulty.
- **Devices.** Desktop (teacher laptop → projector) **and tablet** (classroom iPad, student device) are both first-class. Touch targets, two-pane behaviour, and reachability must hold on tablet — this is not a desktop design with a tablet apology.
- **Language.** **Greek-first**, fully bilingual (gr/en). Greek labels run **longer** than English; layout must breathe with longer strings without truncating meaning or breaking the grid.

---

## 4. Current State (As-Built)

This section documents what exists today so nothing load-bearing is lost. The current build is light-first ("Alabaster / Pentelic marble" theme), one terracotta accent, Greek-first labels.

### 4.1 Anatomy (top → bottom)

The picker is one vertical flex column (`gap: 10px`):

1. **Page header** — eyebrow + large title + subtitle + back chip.
2. **Section label** — "Διάλεξε ύλη / Choose content" (uppercase, letter-spaced, muted).
3. **Caption** — "Αυτόματη λίστα: γραμματική + ύλη τάξεων + δημοσιευμένα πακέτα."
4. **Search box** — full-width input, placeholder "Αναζήτηση ύλης…"; filters by label + meta, lowercased. Value persists across re-renders.
5. **Tag-filter chips** — a row of chips. First is "Όλα / All"; then one chip per catalog group that has items. **Single-select.**
6. **Category sections** — for each group: an uppercase group header, then a card grid (`auto-fill, minmax(280px, 1fr)`).
7. **Dataset cards** — icon + name + meta + a MIX toggle (or a 🔒 Pro flag).
8. **Level list** — injected **into the grid, full-width**, directly under a card, **only when that card is selected AND is `leveled` AND has levels**. Contains: collapse header → "select all levels" pill → per-category group rows → colour-coded level rows.
9. **Empty state** — "Καμία ύλη δεν ταιριάζει. / No content matches."
10. **Sticky bottom action bar** — selection count + spacer + Start button. Sticky at `bottom: 10px`.

### 4.2 Markup skeletons (for reference — do not treat as required output structure)

**Dataset card:**

```
<div class="syn-ds [on] [locked]">
  <span class="syn-ds__ic">◆</span>              <!-- icon, fallback ◆ -->
  <span class="syn-ds__info">
    <span class="syn-ds__name">Label •</span>     <!-- "•" appended if isNew -->
    <span class="syn-ds__meta">all levels</span>  <!-- meta logic below -->
  </span>
  <!-- if locked: -->
  <span class="syn-ds__flag">🔒 Pro</span>
  <!-- else: -->
  <button class="syn-ds__mix [on]">+ MIX</button>  <!-- "✓ Στη μείξη" when on -->
</div>
```

*Meta-text logic:* if the card is not selected, or not leveled → show `meta`. If selected + leveled → "όλα τα επίπεδα" when all levels chosen, else "`<n>` / `<total>` επίπεδα".

**Level row:**

```
<button class="syn-lvrowpill [on] [--lgreen|--lyellow|--lred|--lpurple]">
  <span class="syn-lvpill__box">✓</span>          <!-- ✓ only when selected -->
  <span class="syn-lvpill__n">01</span>           <!-- running index, padStart(2,'0') -->
  <span class="syn-lvpill__t">
    <span class="syn-lvpill__sec">Ενότητα · </span> <!-- only if section exists -->
    Description text                                 <!-- desc, fallback "Επίπεδο <id>" -->
  </span>
</button>
```

**Level-list internal structure (top → bottom):**
- **Header** — left: "Επίπεδα" + a count badge ("3/8", turns green when ≥1 selected); right: a collapse toggle ("Κρύψε ▾" / "Δείξε ▾", chevron rotates).
- If the whole list is collapsed, only the header renders.
- **Select-all pill** — "Επιλογή όλων των επιπέδων"; when all on → "✓ Όλα επιλεγμένα — καθάρισε".
- **Per-category group rows** — levels are grouped by their `group` field (insertion order). Each group emits: a small square chevron (folds the group), the uppercase group label (fallback "Επίπεδα"), and a per-group select-all ("Όλα" → "Καμία" when full).
- **Level rows** for each level in the group. The running number increments even across folded groups, so numbering stays stable.

### 4.3 States

| Element | State | Treatment |
|---|---|---|
| **Dataset card** | Default | 1px line border on white card, radius 14px |
| | Hover | Stronger ("bold") border |
| | Selected | Accent-mid border, faint terracotta wash background, inset 1px terracotta ring; level panel appears below |
| | Locked / Pro | `opacity: .5`; MIX replaced by a static "🔒 Pro" pill (no toggle) |
| **MIX button** | Off | Dashed terracotta border, sink bg, terracotta text, "+ MIX" |
| | On | **Solid green `#2e9e4f`**, white text, "✓ Στη μείξη" |
| **Tag chip** | Default / Hover / Active | Muted pill → bold border + full text → **white on green `#2e9e4f`** |
| **Search** | Active | Matching cards/categories only; non-matches skipped; zero results → empty hint. Focus = accent border + inset terracotta ring |
| **Level list** | List collapsed | Header only; toggle reads "Δείξε ▾", chevron rotated |
| | Group collapsed | Group rows hidden; chevron rotates, label dims |
| | All levels selected | Select-all pill, header badge, and full per-group buttons all go **green** |
| **Level row** | Selected | Stronger terracotta tint bg, accent border, inset terracotta ring; checkbox fills **green `#2e9e4f`** with white ✓; number → accent-ink; description → weight 600 |
| | Hover (unselected) | Bold border + sink bg |
| **Empty** | No match | "Καμία ύλη δεν ταιριάζει." |
| **Start button** | Disabled (0 sources) | Sink bg, muted text, no shadow, `not-allowed`; label "Διάλεξε ύλη" |
| | Enabled | Solid terracotta, white uppercase label ("Έναρξη Αγώνα" / "Ξεκίνα τη Ζωντανή Μάχη"); hover lifts `-1px`. Count shows "N πηγές / sources" |

### 4.4 Current look — colour tokens (default Alabaster theme)

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#F7F3EA` (parchment) | page background |
| `--card` | `#FFFFFF` | card / chip backgrounds |
| `--fg` | `#1E1810` (near-black ink) | primary text |
| `--muted` / `--fg-muted` | `#8C7F6B` (warm stone) | meta, labels |
| `--ca` (accent) | `#C5572F` (terracotta) | selected tints, Start button, left borders |
| `--terra` | `#C5572F` | difficulty "lred" border |
| `--terra-dk` | `#9C3F1F` | accent-ink text on selected |
| `--gold` | `#A2862F` | difficulty "lyellow" border |
| `--sage` | `#5B7544` | difficulty "lgreen" border |
| `--line` | ~13% ink alpha | default 1px borders |
| `--line-bold` | ~24% ink alpha | hover borders |
| `--sink` | ~5% ink over bg | off-state pill fill |
| **selected green** | **`#2e9e4f`** (hardcoded, not a token) | every "on" toggle / check / chip / pill |

**Typography:** display font **Oswald** for names, numbers, and labels; **Montserrat** for body/meta. Numbers are zero-padded two-digit ("01", "02") in the display font.

### 4.5 Current look — key dimensions

- **Dataset card:** `border-radius: 14px; padding: 12px 14px; gap: 12px;` 1px line border. Icon tile `42×42px, radius 11px`, `font-size 21px` on an accent tint.
- **Card grid:** `repeat(auto-fill, minmax(280px, 1fr)); gap: 10px`.
- **Level container:** `radius 14px; padding 14px; border: 2px solid accent-mid; background: faint terracotta wash; soft drop shadow`. Spans full grid width.
- **Level row:** `radius 10px; padding 9px 12px; gap 11px; 1.5px line border; border-left: 4px difficulty colour; font-size 13px`. Selected → stronger terracotta tint + accent border + inset terracotta ring.
- **Level checkbox:** `21×21px, radius 6px, 2px border`. On → fills green `#2e9e4f` with white ✓.
- **Difficulty left-border (4px) colours:** `lgreen → sage #5B7544`, `lyellow → gold #A2862F`, `lred → terra #C5572F`, `lpurple → #7C5AC2` (literal).
- **Pills/chips:** `radius 999px`. **Search/cards:** `radius 12–14px`. **Sticky bar:** `radius 16px` with `backdrop-filter: blur(8px)`.
- **Start button:** `radius 11px; padding 11px 20px;` uppercase Oswald, soft accent shadow, hover `translateY(-1px)`.
- **Responsive:** at `≤560px` the grouped level grid collapses to one column and the bottom bar wraps; cards already reflow via `auto-fill`.

> ⚠️ **Known tension to resolve, not preserve:** the build mixes **two accents** — the row *selection tint* is terracotta (`--ca`), but the *check inside it* is a hardcoded green (`#2e9e4f`), chosen because the per-engine accent could be too light for white text. The redesign should make a deliberate, tokenised decision here rather than inherit the inconsistency.

---

## 5. Data Model

The design must accommodate these field shapes. **Catalog** is an array of groups; each group has a name and a list of dataset items.

**Dataset item** — what each card binds to:

| Field | Type | Drives |
|---|---|---|
| `id` | string | Unique key (selection + collapse memory) |
| `label` | string | Card name |
| `icon` | string | Card icon glyph (fallback "◆") |
| `meta` | string | Card subtitle (e.g. "120 ερωτήσεις") |
| `leveled` | boolean | If true + selected → the level panel renders |
| `locked` | boolean | "🔒 Pro" flag, dimmed, no toggle |
| `isNew` | boolean | Appends a " •" new-marker to the name |
| `levels` | array | Present only when leveled |

**Level** — what each level row binds to:

| Field | Type | Drives |
|---|---|---|
| `id` | string \| number | Unique within the dataset |
| `group` | string | Category bucket → group rows (`""` allowed) |
| `section` | string | Optional prefix on the row (e.g. "Ενότητα 1") |
| `desc` | string | Main description (fallback "Επίπεδο `<id>`") |
| `color` | `lgreen` \| `lyellow` \| `lred` \| `lpurple` | Difficulty → left-border colour |

**Selection model (survives re-render):** selection is a map of `datasetId → { set of selected levelIds }`. Collapse memory is held per-dataset (whole list) and per-group. **Selecting a card via MIX pre-selects all of its levels by default** — an important behaviour to honour or deliberately reconsider.

---

## 6. Goals & Success Criteria

Elevate the picker from "functional list" to a **fast, confident, museum-grade selection ritual.** A teacher should assemble a match in seconds; a student should find practice content without thinking. The classical identity should feel *intentional and premium* — polish wearing a chiton, not a generic SaaS skin.

A redesign succeeds when:

- **Scanning is fast.** A 30+ level list is legible at a glance — eyes land on the right row without reading every word. Tune vertical rhythm and density for skimming, not whitespace.
- **Difficulty reads instantly.** Easy/medium/hard is decoded pre-attentively (colour **plus** a second, non-colour cue), never requiring a label read or a legend hunt.
- **Multi-select is obvious.** It is immediately clear that you can mix several datasets, *how many* you've picked, and *what's in the mix*. Selection state is never ambiguous.
- **Level granularity is effortless.** Select-all, per-category select, and individual toggles coexist without confusion; the user always knows the blast radius of a click.
- **Delight without clutter.** Motion, texture, and ornament reward the eye but never slow the task or crowd the data. Restraint is the flex.
- **Zero theme regressions.** Identical clarity and beauty in both the **light home theme** and the **dark arena theme**.

> **North star:** a teacher glances, mixes, and launches before the class has finished sitting down — and the screen looks like it belongs in a museum, not a worksheet.

---

## 7. What to Keep (Non-Negotiable)

These are load-bearing. Redesign the *expression*, not the *capability*.

- **One universal component, three contexts.** The same picker serves game / live / PvP. No forking into three bespoke screens — variation is by configuration, not by clone.
- **Multi-select "mix" of datasets.** Combining several content sources into one pool is core, not edge.
- **Per-level selection with full granularity.** Select-all, per-category (per-group) select/deselect, and individual level toggles all remain.
- **The hide/unhide collapse.** The collapsing of long lists stays — it is the pressure valve for 30+ level sets.
- **Difficulty colour coding.** Keep the difficulty signal and *strengthen* it (see §6) — do not remove it.
- **Search + tag filtering.** Live text search and tag/topic filters both remain, and should be *faster* to reach, not buried.
- **Dual-theme parity.** Fully native in **both** the light home theme and the dark arena theme — themed by CSS variables, not two hand-painted skins.

---

## 8. Constraints

- **No build step. Vanilla JS + plain CSS.** No Tailwind, no React, no component framework. The dev hand-authors CSS using **custom properties**. Deliver a *visual spec the dev reimplements*, not a framework component.
- **Theme exclusively via CSS variables.** Every colour, radius, shadow, and spacing value must map to a variable so light/dark and the Greek palette swap cleanly. **No hard-coded hex in component rules** — including resolving the green-vs-terracotta tension noted in §4.5.
- **Performance-light.** Lists hit 30–50 rows. Avoid heavy per-row shadows, large blurs, expensive filters, or per-item JS animation loops. Smooth on a mid-range classroom tablet is the bar.
- **Robust to long Greek strings.** Greek runs longer than English. No fixed-width labels that clip; specify wrapping/ellipsis behaviour explicitly.
- **Bilingual (gr/en).** Greek primary, English fallback. Layout must hold for both.
- **Accessible.** Difficulty is never colour-*only*; focus states, keyboard navigation of the list, and **≥ WCAG AA contrast in both themes** are required, not optional.

---

## 9. Directions to Explore *(inspiration, not prescriptions)*

Pick, combine, or reject — the goals frame the work, not these.

- **Compact two-pane layout.** Categories/datasets on the left, levels on the right. Picking a category scopes the level pane; "mix" accumulates across categories. Collapses to stacked/sheet on tablet.
- **Denser level rows.** Tighter rows with a clear hit area, a difficulty marker, a name, and a checkbox — optimised for vertical skim over generous cards.
- **Difficulty as a glyph or ribbon.** A left-edge colour ribbon, a pip/dot scale (`●○○ / ●●○ / ●●●`), or a small glyph — colour *plus* shape, so it survives colourblindness and projector washout.
- **Chips vs rows for levels.** Level "chips" in a wrap grid for compact sets, rows for long/detailed sets — or a toggle between the two.
- **Sticky selection summary.** A persistent "mix" tray (count, dataset pills, total levels, a Clear, and the primary Start) that stays put while the list scrolls — the teacher's anchor.
- **Progressive disclosure.** Categories collapsed by default; difficulty/tag filters tucked into a quiet control bar that expands on demand; the hide/unhide collapse as the long-list default.
- **Pre-attentive search/filter.** Promote search and tag filters to a sticky control bar at the top of the level pane — always one motion away.
- **Texture with restraint.** A whisper of Greek-key fret, terracotta grain, or gilt edge on key surfaces (tray, headers) — ornament as accent, never as carpet.

---

## 10. Deliverables & Format

In priority order:

1. **Annotated visual spec** — Figma frames **or** an annotated HTML/CSS prototype (HTML/CSS preferred, since the dev reimplements in vanilla and a working reference de-risks handoff).
2. **All key states, per device, per theme** — for **desktop and tablet**, in **both light and dark**:
   - Empty / initial
   - Browsing a long (30+) level list
   - Mid-selection (multi-dataset mix + partial level selection; select-all and per-category states visible)
   - Search active / filtered by tag
   - Collapsed (hide/unhide) long list
   - Sticky selection summary populated, ready to launch
   - Focus / keyboard and touch-pressed states
3. **Design tokens** — a documented set of CSS custom properties for **colour** (light + dark + difficulty scale), **spacing**, **radii**, **shadow/elevation**, and **typography** (Greek + Latin in mind) — named so the dev can paste them straight into the variable layer.
4. **Redlines** — spacing, sizing, touch-target minimums, and wrap/ellipsis rules for long Greek strings.
5. **Motion notes** — the two or three micro-interactions worth having (select, add-to-mix, collapse), specified as *light* CSS transitions: duration, easing, what moves, with a performance budget.
6. **A single annotated "anatomy" frame** mapping every retained capability from §7 to its new home, so nothing load-bearing is lost in the glow-up.

---

## 11. Open Questions

- **Tray placement across contexts.** Does the sticky selection summary live in the same spot for game, live, and PvP — or adapt (e.g. host controls in live, opponent stakes in PvP)?
- **Tablet two-pane.** Side-by-side, or collapse to a stacked/drawer flow? Where's the breakpoint, and what's the transition?
- **"Mix" mental model.** Is a separate summary tray enough, or do selected datasets also need a persistent marker back in the list? How do we show *"3 datasets, 12 levels"* without making the user do math?
- **Difficulty as primary sort/filter?** Should difficulty be a first-class filter/sort axis, or stay a per-row signal only?
- **Chips vs rows — who decides?** Auto by list length, a user toggle, or a fixed choice per context?
- **Default collapse state.** For 30+ levels, open collapsed (fast scan, more clicks) or expanded (more scroll, fewer clicks)? Does the answer differ for teacher vs student?
- **Greek-key / ornament dosage.** How much classical texture is "premium" before it tips into "busy" — especially in the dark arena theme where it can glow?
- **Bilingual switch.** Is gr/en a global app setting only, or should the picker expose an inline language affordance?
- **Two-accent resolution.** Selection today mixes terracotta tint with a green check (see §4.5). Should "selected/on" be a single tokenised accent, a deliberate two-colour system (tint vs confirm), or something new?
- **MIX pre-selects all levels.** Selecting a dataset currently auto-selects all its levels. Keep this default, or make it an explicit, lighter-weight first choice?