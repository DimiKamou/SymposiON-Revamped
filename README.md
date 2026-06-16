# SymposiON — Revamped

The full **SymposiON** platform (the real app — login, ~47 games, trivia, Live Arena /
Battle Royale / Άνοδος modes, teacher/admin/parent panels) being **re-skinned to the v2
"Synthesis" design**.

> Goal: keep the original site's functionality exactly as it is, and make it **look like**
> the Synthesis redesign (warm-dark classical theme, Oswald/Alegreya/Montserrat type).

## Layout

```
paideia/                     ← THE APP (ported from DimiKamou/SymposiON-Ver1, as-is)
  index.html                 ← entry shell (home + all panels + game overlays)
  css/                       ← 29 stylesheets …
    synthesis-skin.css       ← ★ the re-skin layer (loaded last; additive; reversible)
  js/                        ← app core, nav, router, auth, progression, scores …
  games/                     ← 47 playable games (each = data.js + game.js [+ css])
  images/                    ← brand, illustrations (104 SVGs), cursors, badges, bg-symbols
  functions/                 ← Firebase Cloud Functions (Stripe/PayPal, gradeAnswer)
  firebase.json, *.rules     ← Firebase Hosting / Firestore / Storage config
design-reference/            ← the v2 "Synthesis" prototype (the design source of truth)
  home-revamp/               ← token-driven design system (tokens.css = the palette/type)
  email-automation/
docs/                        ← migration plans + design approach/brief
index.html                   ← redirect → paideia/index.html
```

## Run it locally

The app is a **no-build static site** (Firebase 9 compat SDK from CDN). Serve and open:

```bash
python3 -m http.server 8000
# http://localhost:8000/            → redirects into the app
# http://localhost:8000/paideia/    → the app directly
```

Login and game data come from the project's existing Firebase backend (the web API key in
`paideia/js/firebase-config.js` is a public client identifier, not a secret).

Deploy (unchanged from the original): `cd paideia && firebase deploy`.

## The re-skin — `paideia/css/synthesis-skin.css`

Loaded **last**, so it overrides the original `theme-obsidian` styles. It is **additive and
fully reversible** (delete the one `<link>` in `paideia/index.html` to restore the original
look). This first pass establishes the foundation:

- **Type system** — Oswald (display/headings), Montserrat (body/UI), Alegreya (lede/editorial).
- **Palette** — Synthesis "Theme 4" warm-dark tokens (`#18120A` base, `#241A11` panels,
  `#D97B5C` terra, `#C9A44A` gold, `#F0EBE0` text), remapped onto the OG app's existing
  CSS variables (`--terra`, `--gold`, `--dark-base`, `--bg-card`, `--sym-*`, …).
- **Accent harmonisation** — links, primary buttons/CTAs, selection, scrollbars.

### Still to do (component-level fidelity)
Matching the prototype screen-for-screen — the film-strip nav, the hero spec card, the
class-chip rows, the Άνοδος / Rapid-Fire feature cards — is the next phase. Those need
visual iteration against the running app.
