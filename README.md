# SymposiON — Revamped

The SymposiON platform: the **"Synthesis" revamp front-end** (applied as designed) powered
natively by the original app's full engine — login, ~50+ games, modes, trivia, admin,
all merged into one app.

## The app lives in `synthesis/`

```
synthesis/
  index.html          ← open this (Live Server) — the app entry
  css/  js/           ← revamp shell + merged engine + the game-launch manifest (js/manifest/*)
  games/              ← the real games (each launched on demand via synLaunch)
  overlays/           ← game/panel overlay partials, injected on launch
  images/             ← brand, illustrations, cursors, badges
  docs/               ← INTEGRATION-SPEC.md (how the merge works)
  firebase.json, .firebaserc, *.rules, functions/   ← Firebase backend (hosting + Firestore/Storage rules + Cloud Functions)
```

The repo root `index.html` just redirects into `synthesis/`.

## Run locally

No build step. Serve and open:

```bash
python3 -m http.server 8000
# → http://localhost:8000/synthesis/    (or http://localhost:8000/ which redirects there)
```
or right-click `synthesis/index.html` → **Open with Live Server**.

> If you ever see an *old* screen, it's browser cache / a stale service worker from a previous
> visit — hard-refresh (Ctrl/Cmd+Shift+R), or DevTools → Application → unregister service workers
> + clear site data, or use an Incognito window.

## Deploy (Firebase Hosting + Functions)

```bash
cd synthesis
firebase deploy          # hosting (public ".") + Firestore/Storage rules + Cloud Functions
```
Firebase config is the project's public client config (`js/firebase-config.js`) — safe to commit.

## What's inside

- **Revamp shell** (the "Synthesis" design): home, Agora/Akropolis/Stoa screens, onboarding,
  guide, consent/cookies, notifications/search, settings.
- **~51 game folders / 56 wired launchers** — Greek & Latin grammar, canvas/arcade, trivia,
  iframe games (istoria, symposion board), study/Mnemosyne, multiplayer/Firebase (live-arena,
  golden-fleece, halieia), plus the PvP pack (krypteia, hegemonia, discus, toxotes, agora).
- **«Αγία Σοφία 537» interactive 3D museum** (`games/hagia-sophia/`) — a walkable first-person
  reconstruction of Justinian's Hagia Sophia as consecrated in 537 (original shallow dome,
  silver templon, great ambo, atrium & phiale; 16 bilingual exhibit stations, day/dusk,
  a toggleable Orthodox icon-layer of later centuries — apse Theotokos, Pantokrator,
  seraphim, Deesis — and generative ambience). Self-contained Three.js, no assets/build;
  also runs standalone — see its `README.md` and `UNREAL-PORT.md`.
- **Auth/login** (Firebase) and the **admin Command Center** (gated to the admin account).
- Game-launch system: `js/syn-launch.js` + `js/manifest/*.js` (`SYN_GAMES` / `SYN_LAUNCH_MAP`)
  → `synLaunch(openFn)` injects the overlay + css + lazy-loads the game, then calls it.

See `synthesis/docs/INTEGRATION-SPEC.md` for the full merge architecture.
