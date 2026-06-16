# SymposiON — Revamped (v2 · "Synthesis")

A full redesign of the SymposiON educational gaming platform for classical studies
(Αρχαία Ελληνικά, Ομηρικά Έπη, Τραγωδίες, Λογοτεχνία, Γραμματική, Έκθεση, Ιστορία &
Λατινικά — learned through play).

This repo holds the **revamped "Synthesis" build** as a clean, modular, **separate-file**
project (no build step — plain HTML/CSS/JS). It is intentionally kept apart from the
old SymposiON code so the two never get mixed again.

## Run it

No install, no bundler. Serve the folder and open the home:

```bash
# from the repo root
python3 -m http.server 8000
# then visit:  http://localhost:8000/            (redirects to the home)
#        or:  http://localhost:8000/home-revamp/Home%20Revamp.html
```

> Opening the HTML straight off disk (`file://`) mostly works, but a local server is
> recommended so the runtime `fetch()` of optional illustration SVGs resolves cleanly.

## Structure

```
index.html                      → redirect into the app (handy for GitHub Pages)
home-revamp/
  Home Revamp.html              → the app entry point (loads the modules below)
  Agora.html                    → Agora surface (standalone preview)
  Olympia.html                  → Olympia / Άνοδος climb preview
  Season & Temple FX Preview.html
  Change Overview.html
  SymposiON - Home Revamp (standalone).html   → fully self-contained snapshot
  SymposiON - Agora (standalone).html         → fully self-contained snapshot
  css/   tokens · shell · synthesis · screens · previews · stoa · agora · akropolis · olympia · student · system
  js/    app · data · screens · screens-2 · dir-synthesis · dir-agora · dir-stoa · dir-akropolis ·
         previews · info-panels · tags · cursors · seasons · mouse-fx · store ·
         student · consent · system · settings
images/illustrations/           line-art SVG assets (currentColor)
email-automation/               standalone email-template artifact (not part of the app)
docs/                           design approach, temple/Άνοδος brief, change handoff
```

### The "old" content is included
`home-revamp/js/data.js` is the single source of truth and **mirrors the production home** —
all of it is here, not stubbed:

- **9 class tracks** — Γυμνάσιο Α–Γ, Λύκειο Α–Γ, plus the Γραμματική · Θεωρία tracks
  (Αρχαία / Λατινικά / Έκθεση).
- **Subject panels & game tiles** per class (Οδύσσεια, Ιλιάδα, Ελένη, Αρχαία, Ιστορία,
  Λατινικά, …), the **game-engine carousel**, **level/Άνοδος** progression, hero **avatars**
  & **titles**, multiplayer/Live-Arena games, and the trivia ticker.

### What the latest session added (the "Additions" layer)
Overlaid on the base, newest-wins (see `docs/HANDOFF.md` for the full list):

1. **Mobile responsiveness** — nav collapses to a hamburger drawer ≤940px; hero/chips reflow.
2. **First-visit onboarding** + **Guide (assistant) mode** (`student.js`, philosopher avatar).
3. **Student homework inbox**, **Parent role + dashboard**.
4. **Consent / cookies / age-gate** (`consent.js`).
5. **System layer** — notifications, global search, offline banner, 404/error screens.
6. **Settings** + **checkout / redeem-code** flow.
7. **Seasonal cursor FX** + cursor-cosmetic sync.
8. **Theme-token fix** so body-level popups inherit the classical type/colours.

## Known gaps / follow-ups
- **Decorative illustration SVGs**: only `images/illustrations/philosopher.svg` shipped in the
  handoff. The other line-art names referenced in `data.js` load from `images/illustrations/*.svg`
  and **fall back to empty gracefully** when absent (no broken images). Drop in the full
  `images/illustrations/` (and `images/bg-symbols/`) set to restore every glyph.
- **Legal / consent copy** in the consent modals and email templates is placeholder — replace
  with counsel-approved text.
- See `docs/HANDOFF.md` → "Open items" for the GDPR guardian-consent decision and unrendered
  email templates.
