# SymposiON — "Synthesis" Design System & Build Approach
### A portable brief for continuing the redesign in any project

Paste this whole file into a new project to carry over the exact design language, architecture, and conventions we've established for the SymposiON home + app redesign. It is self-contained: it does not link to other projects.

---

## 0 · What "Synthesis" is
A reimagined front-end for **SymposiON**, a Greek-classical educational **game platform** (students 12–18, plus teachers & admins). "Synthesis" is the chosen direction: it **fuses** three explored looks —
- **Akrópolis** (monumental: Oswald condensed caps, architectural grids, meander rails, corner ticks),
- **Agora** (playful: rounded pill nav, color-coded chips, soft cards, energy),
- **Stoa** (editorial: Alegreya serif reading text, museum restraint).

The result: a **monumental hero + playful chrome + editorial body**, theme-driven, bilingual (GR/EN), animated with GSAP, never touching the actual game code — only the surrounding app shell.

---

## 1 · Visual language (the rules)

**Type**
- Display / titles: **Oswald** (condensed), weight 500–600, UPPERCASE, letter-spacing ~.02em. Variable `--disp`.
- UI / labels / buttons: **Montserrat**, 600–800. Variable `--sans`.
- Reading text, ledes, lore, trivia: **Alegreya** serif (italic for flavor). Variable `--serif`.
- Greek polytonic accents are correct and intentional (Ἄνοδος, Ναὸς τῶν Μουσῶν, Κλέος, Ὀδυσσεύς).

**Color = tokens, never hardcoded.** Everything reads CSS custom properties so a theme swap re-tints the whole app. Core `--sym-*` tokens (set per theme) and derived semantic tokens:
```
--sym-bg --sym-bg-card --sym-fg --sym-fg-muted
--sym-terra --sym-terra-dk --sym-gold --sym-sage --sym-ink
/* derived (computed once): */
--bg --card --fg --muted --terra --gold --sage --stone
--line (fg @13%) --line-soft (7%) --line-bold (24%)
--raise --sink --gold-soft --terra-soft --fg-70 --fg-50 --shadow
```
Per-element accent: set `--ca` on a `.has-accent` element → get `--ca-soft/--ca-mid/--ca-ink/--ca-tint` automatically. **Each school class has a fixed accent color** (roman numeral + hue) so a class is recognisable across every theme.

**Themes** (light-first default = *Alabaster*). Grouped in the picker: **Light · Dark · Vivid · Unlockable · Seasonal.** ~17 curated palettes ported from the deployed `temple-themes.js` (Obsidian, Alabaster, Hearth, Aegean, Amphora, Olive, Venetian, Saffron + unlockables Acroterion/Tyrian/Golden-Fleece/Orphic). **Unlockable** themes show 🔒 and play a sparkle-burst unlock that persists.

**Seasonal** themes (Halloween/Katabasis, Christmas/Solstice, Easter/Anastasi, Carnival/Apokries): **auto-detected by date** with manual override, and each drives a **GSAP particle effect** over the stage (❄ snow, 🎃🦇 pumpkins, 🥚🌸 eggs/blossoms, 🎭◆ masks/confetti) + a seasonal cursor glyph. Always respect `prefers-reduced-motion`.

**Ornament** — restrained. Thin gold hairlines, **Greek-key (meander) rails** (tiling SVG data-URI mask), corner ticks, line-art SVG icons (`stroke: currentColor`, 100×100 viewBox). Gold is seasoning, not a flood. A `orn-subtle` body class strips ornament for a quieter mode.

**Motion (GSAP)** — orchestrated page-load timelines, magnetic primary buttons (lean toward cursor), ScrollTrigger reveals on sections, slow ceremonial easing on the meta screens (Temple/Anodos rotating ritual circle). Entrance end-state must be the base style; animate *from* hidden so reduced-motion/print show content.

**Cursor** — optional custom cursor: a lagging accent ring + themed glyph (laurel/owl/circle/none). Must render **above modals** (z-index above overlays). Native cursor stays on control chrome.

**Avoid:** generic SaaS flatness, Inter-only, emoji-as-icons (use line-art), rainbow gradients, stock-photo temples. Keep it engraved, gilded, classical, confident.

---

## 2 · Architecture (how it's built)

Plain **vanilla JS + token CSS**, no build step. A tiny `el(tag, attrs, kids)` hyperscript helper builds all DOM (numbers coerce to text; `on*` keys bind listeners; `html` sets innerHTML). Files:

- `css/tokens.css` — all theme classes + derived tokens. **The contract.**
- `css/shell.css` — the prototype harness (dark control bar, theme picker, tweaks, cursor, seasonal layer). NOT part of the design — it's the comparison shell.
- `css/synthesis.css` + `css/screens.css` + `css/previews.css` — the actual design.
- `js/app.js` — state, render loop, theme/cursor/season wiring, harness, tweaks.
- `js/data.js` — single content model (classes, subjects, games, engines, trivia, acroteria, multiplayer games). One source of truth; every screen renders from it.
- `js/dir-synthesis.js` — the flagship direction: persistent nav + a **"Screens" launcher** that routes to every panel + the home screen.
- `js/screens.js` / `js/screens-2.js` — every inner screen, attached to `window.SYM_SCREENS[id]`.
- `js/previews.js` — **faithful mock game "screenshots"** (MC quiz, Lyo verb paradigm, Latin declension, tug-of-war, flashcard, runner, memory). Used wherever we show a game "in action" — **never embed/touch real game code.**
- `js/seasons.js`, `js/cursors.js`, `js/store.js` — seasonal FX, cursor engine, localStorage persistence.

**Routing:** `symGo(screenId, param)` sets state + re-renders + scrolls top. Screens read `ctx.param`. `ctx.fresh` gates one-time entrance animations.

**Persistence:** `SymStore` (namespaced `sym_revamp_*`) saves favorites, custom names, list order, Kleos, unlocks, equipped cosmetics, admin custom sections, teacher classes/students. Every user edit persists.

**Roles:** a Tweak toggles **Student / Admin**. Admin reveals edit/reorder/add affordances (drag-reorder cards, rename, ＋ add section/class/category, content-QA previews).

---

## 3 · The screens (what exists, the bar to match)

Every screen is reachable via the nav **"Οθόνες / Screens"** launcher. Bilingual, theme-aware, animated.

- **Home** — monumental hero with a **slow rotating game-modes/news showcase** (Try-now → Game Panel), an **interactive spec card** (click the column → acroteria gallery; rows rotate Ancient-Greek **science/drama/arts/history trivia**), class chips, subject blocks, engines scroller, join, footer (with Instagram/YouTube/TikTok).
- **Subject** — Games / Results / Students tabs; grid⇄list, favorites, admin edit+reorder, per-card preview. CTA = "Browse Game Panel" (never "start game"; games shown are mock/demo data).
- **Level select** — matches the **deployed look**: left **category rail** (Οριστική/Υποτακτική…) + numbered **level list** + share-to-class + progress bar. Admin can edit categories. Rows open a static **mock preview** (Lyo / Latin-noun / quiz), they don't launch a game.
- **Game Panel** — game-mode bar + all engines, grid/list, favorites (prioritised), admin edit, upload-your-own, QA preview.
- **Live Arena** — Host/Join → **config** (pick a real multiplayer game or "select another" via Game-Panel popup; **content navigator Τάξη→Μάθημα→Άσκηση→Επίπεδο** or upload; Solo/Teams+count; time slider 1–60 min; multi-select scoring) → **lobby** (PIN, QR, players).
- **Hero Profile / Level Up** — XP ring, badges; level-up = GSAP sparkle celebration.
- **Temple of the Muses** — Kleos currency, rotating **ritual circle altar**, real **cosmetic slots** (palette/backdrop/particle/sigil, equip changes the altar), quests (daily/weekly + claim), saga chapters. (Flagged for solo deep-dive — see the Temple/Anodos design brief.)
- **Anodos** — Slay-the-Spire-style ritualistic climb (Τάρταρος→Ὄλυμπος), riddle challenge, replayable run, editable tier names (admin).
- **Tartarus Review** — spaced-repetition: stats, categorization, **most-common-mistakes** (✗/✓), share-to-teacher, clear history, **review-schedule forecast**, card-sets by topic.
- **Ανάθεση (Teacher)** — class selector (+ new class), seats bar, tabs (Overview/Assignments/Students/**Weak-spot heatmap**), add/invite students, **assignment wizard**.
- **Admin** — fully interactive rail (Grant Access · Access Control · Pricing · Discount Codes · Subscriptions · Studio · Curator's Realm · Games QA · Tartarus · Banners · Atlas/Emergency · Settings) + ＋add/✎edit custom sections.
- **Login** — Google + Outlook SSO + forgot-password flow.

---

## 4 · Non-negotiables when extending
1. **Never modify the actual games or their level logic** — only appearance/shell. Show games via mock previews.
2. **Read tokens, never hardcode colors.** New screens must theme-swap and class-accent cleanly.
3. **Bilingual everything** via the `{gr, en}` + `L()` pattern.
4. **Persist user edits** (`SymStore`).
5. **Admin/role-gate** edit affordances.
6. **GSAP entrances animate from hidden; reduced-motion safe.**
7. Mirror the **deployed data shapes** (engines, classes, content catalog, realm economy, assignments) so the prototype maps 1:1 to the build.
8. Match the established **type scale & spacing**: slide/section titles in Oswald caps, ledes in Alegreya, never below 12–13px body.

---

## 5 · Deliverable expectations
Single self-contained HTML per artifact (or the modular css/js split above), responsive, token-driven, GSAP-animated, reduced-motion-safe, GR/EN. Include a short note mapping each new screen's elements to their deployed data source so engineering can wire it without guessing.
