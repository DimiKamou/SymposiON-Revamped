# SymposiON — Visual Design Brief for a focused Claude design project
### Target screens: **Ναὸς τῶν Μουσῶν (Temple of the Muses)** and **ΑΝΟΔΟΣ (The Ascent)**

Paste this whole brief into a fresh Claude design project that works *solo* on these two surfaces. It encodes the production look so the result drops back into the live site's token system.

---

## 0 · What you are building
Two **immersive, ritualistic game-meta surfaces** for a Greek-classical educational game platform (students 12–18). These are NOT ordinary dashboards — they are the "sacred" reward layer. Treat them like the cosmetics/ascension screens of a premium roguelike (think *Slay the Spire* map + *Hades* mirror of night), rendered in an ancient-Greek temple aesthetic.

Deliver a single self-contained HTML file per screen (vanilla JS, no build), sized responsive, that consumes CSS custom properties named `--sym-bg, --sym-bg-card, --sym-fg, --sym-fg-muted, --sym-gold, --sym-gold-lt, --sym-gold-dk, --sym-terra, --sym-accent, --sym-accent2, --sym-hairline`. Never hard-code palette colors — read the tokens so equipping a palette re-tints everything.

---

## 1 · The house aesthetic (non-negotiable)
- **Palette (default "Obsidian"):** near-black volcanic ground `#0A0907`, panel `#15120D`, ivory text `#F1E9D6`, **candle-gold** `#D2A24A` (primary accent), **ember terra** `#E07A3C` (secondary). Everything glows faintly as if lit by oil lamps.
- **Type:** display in an engraved serif — **Cinzel** (or Cormorant Garamond) for titles, ALL-CAPS with wide letter-spacing (2px). Body in a clean sans (Inter/Montserrat). Greek polytonic accents are correct and intentional (Ἄνοδος, Ναὸς τῶν Μουσῶν, Κλέος).
- **Ornament:** thin gold hairlines, **Greek-key (meander) borders**, **corner ticks**, laurel and column motifs as line-art SVG (`stroke: currentColor`, 100×100 viewBox, 1.4 stroke). Restrained — gold is a seasoning, not a flood.
- **Light:** warm radial glows behind focal objects; soft inner shadows; a faint film-grain/parchment texture is welcome. No flat material-design cards.
- **Motion:** slow, ceremonial. Ease everything (power2/3). A **slowly rotating ritual circle** (concentric rings of ticks + zodiac-like glyphs, ~80–120s/rev) sits behind the hero of each screen. Use GSAP. Respect `prefers-reduced-motion`.

---

## 2 · TEMPLE OF THE MUSES — required pieces
Currency is **Kleos (Κλέος · Glory)**, shown top-right with a laurel glyph.

1. **The Altar (hero):** a centered ritual circle (rotating) with the player's **equipped loadout** composited live — the equipped *backdrop*, *palette* tint, *particle* effect (drifting embers/gold-dust/petals) and *sigil* all visible at once. This is the centrepiece; make it feel alive.
2. **Cosmetic slots (4):** **Παλέτα/Palette · Σκηνικό/Backdrop · Σπινθῆρες/Particles · Σῆμα/Sigil.** Each slot opens a picker; equipping instantly re-skins the Altar. Palettes carry 3-color swatches (e.g. Obsidian, *Katabasis* amethyst-ember, *Solstice* evergreen-gilt, *Orphic Night* iridescent). Owned vs locked (price in Kleos) vs saga-gated.
3. **Ἆθλοι / Quests:** Daily + Weekly cards with progress bars and a **Claim** button that pays Kleos. They rotate (a weighted pool).
4. **Εὐλογίες / Boons** & **Ἀναλώσιμα / Consumables:** purchasable buffs (Aristeia, Mnemosyne's Favor, Second Breath, Ariadne's Thread, The Oracle…) — small icon + effect line + price.
5. **Τὸ Ἔπος / The Saga:** a 5-chapter arc (Ἀναχώρησις → Κατάβασις → Δοκιμασία → Αἰθήρ → Νόστος). A horizontal progress spine; completing a chapter **unlocks** a flagship palette/backdrop. Show locked chapters dimmed with a seal.
6. **Τρόπαια / Achievements** across dimensions (Volume, Accuracy, Speed, Mastery, Collection) and **stat cards** (Lifetime Kleos, Sessions, Best Streak, Hours in Rite, Accuracy).
Tone of copy: reverent, mythic, second-person ("Lay this dedication at the altar.").

## 3 · ANODOS — required pieces
**ΑΝΟΔΟΣ · The Ascent** is a **Slay-the-Spire-style vertical climb** from **Τάρταρος (Tartarus)** up to **Ὄλυμπος (Olympus)**.
- **Backbar:** chrome-free, slim, ember-accent `#C87830` on `#181412`, Cinzel title "ΑΝΟΔΟΣ · *The Ascent*".
- **The Map:** a **branching node path** climbing upward (bottom = start, top = boss/Olympus). Node types with distinct iconography: **trial** (question volley), **elite**, **rest/altar**, **treasure** (Kleos/relic), **riddle** (γρῖφος), **boss**. Connect nodes with glowing thread; the current frontier pulses. Reachable nodes are lit gold; locked are dim stone.
- **A run is replayable & seeded:** show "Run #N · tier X/Y". Each tier is a named realm (Τάρταρος, Ἅιδης, Γῆ, Ἀγορά, Οὐρανός, Αἰθήρ, Ὄλυμπος) with a one-line challenge.
- **Riddle/Challenge banner:** a ritual-circle-backed card posing a γρῖφος ("Winged god, swift messenger — who?") with 3–4 answer choices; a correct answer advances the climb with a flourish.
- **Rewards on ascent:** Kleos, relics/boons, and theme/cosmetic unlocks — celebrated with a sparkle burst.
- Feel: tense, ascendant, ceremonial. Color shifts subtly **cooler/brighter as you climb** (underworld ember → Olympian gold-white).

---

## 4 · Interaction & state
- Everything equippable/buyable **persists** (localStorage in the prototype; Firestore `config/realm` + per-user progression in production).
- Equipping is **instant and visible** on the Altar / the climber.
- Provide hover, focus, disabled (locked), and "not enough Kleos" (shake) states.
- Custom cursor optional; if used, keep it visible above modals.

## 5 · What to avoid
- No generic SaaS cards, no Inter-only flat UI, no emoji-as-icons (use line-art SVG), no rainbow gradients. No literal stock "temple" photos. Keep it engraved, gilded, candle-lit, and **slow**.

## 6 · Deliverable
- `Temple.html` and `Anodos.html`, each self-contained, responsive, token-driven, GSAP-animated, reduced-motion-safe. Include a short note mapping each visual element to its data source (cosmetics, quests, saga, run/tiers) so engineering can wire it to `realm.js` / `progression.js` / `anodos-content.js`.
