# SymposiON — Monolith → Modular SPA Migration Plan

> Author: architectural audit, 2026-06-02. Constraint: **No build tooling** (pure static site, Firebase Hosting).

---

## ★ FINAL STATUS (branch `refactor/modular-spa`)

**Shipped & verified — the initial JS bundle is ~1.5 MB lighter:**
- **Phase 0** — removed 4 dead files (~195 KB).
- **Phase 1a/1b** — admin panel (4,480 lines) + subscribe/checkout (~760 lines) lazy-loaded.
- **Phase 2a** — 13 heavy canvas/3D games lazy-loaded (~1 MB).
- **Path robustness** — `js/lazy.js` exposes `window.APP_BASE` (derived from its own `<script src>`); lazy scripts, the inline + `loader.js` illustration injectors, and the istoria/history-game iframes all resolve via it, so the app works whether served at the web root (production) **or** a subfolder (local Live Server). This fixed a string of sub-route 404s.

**Tried and reverted (do not retry as-is):**
- **Phase 2b** (lazy-load grammar games) — reverted: their data globals (`OUS_DB`, `LAT_V_DB`, …) must be eager for the Games Panel `GP_DATASETS` loaders and level grids. Grammar games + odyssey-trivia stay eager; heavy engines stay lazy.
- **Phase 3** (extract sections to `components/*.html`, fetched at boot) — reverted: the runtime `fetch()` of partials returned `ERR_CONNECTION_RESET` on the user's local Live Server (OneDrive / new-folder quirk). Mechanism worked on a plain static server + would work in production, but local dev is the gate. **A proper God-File split needs a build step (inline at build time, no runtime fetch)** — deferred.

**Deferred / not done:** live-arena, crypto-hack, iliada-arcade lazy-loading (IIFE-object / `DOMContentLoaded`-init games); admin "back to front page" button.

---

## 0. Guiding principles

1. **One concern per PR/commit.** Every phase below is independently shippable and revertible.
2. **Behaviour-preserving.** The site must look and act identically after each step. We are moving code, not changing features.
3. **Verify before moving on.** Each step has an explicit check. Do not start step N+1 until step N is green.
4. **Global-namespace reality.** There is no module system — scripts publish `openX()`, `ScoreTracker`, etc. to `window` and depend on **load order** in `index.html`. The plan never breaks an ordering dependency without first proving the consumer guards against a missing global (most already do: `if (typeof openX === 'function')`).
5. **Rollback = `git revert <commit>`.** Each phase is a single focused commit. Keep them small enough that revert is trivial.

---

## ✅ Phase 0 — Dead-code removal (DONE)

Deleted (recoverable via git history):
- `js/GrammarEngine.js` (81 KB, ES-module, never loaded/imported)
- `js/grammar-engine.js` (19 KB, never loaded, never sets `window.GE`)
- `js/nav-SYSTEM.js` (37 KB, stale twin of `nav.js`)
- `index-SYSTEM.html` (63 KB, stale twin of `index.html`)

**Follow-ups still open (NOT yet done):**
- Stale comment at `index.html:80` (`rendered by nav-SYSTEM.js`) — update or remove; confirm what actually renders banners (likely `nav.js`).
- Inert `if (window.GE){…}` blocks in `games/epitheta/game.js:35` and `games/ousiastika/game.js:10` — dead branches now that no grammar engine loads. Decide: revive engine, or strip the hooks.

**Verify:** `grep -rn "nav-SYSTEM\|GrammarEngine\|grammar-engine\|index-SYSTEM" --include=*.html --include=*.js .` returns only the two known stale references above. Site boots, home renders, a grammar game (epitheta) opens and plays.

---

## Progress log

- **Phase 0 ✅ committed** — 4 dead files removed, plan added.
- **Phase 1a ✅ committed** — admin (×3, ~4,480 lines) lazy-loaded via `js/lazy.js`. Verified in preview.
- **Phase 1b ✅ committed** — subscribe + checkout (~760 lines) lazy-loaded with a `?payment=`/`?redirect_status=` boot guard. Verified in preview.
- **Phase 2a ✅ committed** — 13 heavy self-contained games lazy-loaded via `GAME_MANIFEST`. Verified in preview (temple-run, tow ordered load, odyssey-trivia, naumachia configurator).
- **Phase 2b ✅ committed** — 19 grammar games lazy-loaded via `GRAMMAR_MANIFEST`; `shared-engine.js` kept eager (shared with teacher homework). Verified in preview (epitheta/eimi/lat-kata).
- **Still eager by design** — iliada-arcade (controls `DOMContentLoaded` init), crypto-hack (`CryptoHack` IIFE), study/flashcards, teacher adapter/builder, iliada-trivia, shared-engine, review-hub, live-arena (1c).
- **Phase 1c ⏸ DEFERRED (live-arena stays eager)** — Rationale: `LiveArena` is a top-level `const` IIFE (not `window.LiveArena`) invoked through *un-guarded* inline `onclick` handlers, with three interdependent files (`LiveArena`/`LAX`/`LAQ`), realtime Firestore listeners, and a `?join=NNNNNN` URL auto-join. Safe deferral needs a Proxy stub + `const`-shadow semantics + all-three-together load + URL-join boot guard + realtime join verification — high risk for only ~50 KB (1,212 lines). Revisit after Phase 2/3 if still desired; the clean approach is to first refactor the trio to expose `window.LiveArena` and guard the overlay onclicks.
- **review-hub stays eager** — defines `logStudentMistake()` called by 15 game files during gameplay; gating it would silently stop populating the Tartarus mistake archive (hidden regression).

## Phase 1 — Lazy-load route-gated panels (HIGHEST VALUE, LOWEST RISK)

**Goal:** stop shipping admin/checkout/live-arena/review-hub code to every anonymous visitor.

**Target scripts** (currently eager in `index.html` ~lines 4392–4399):
- `admin.js` + `admin-subs.js` + `admin-atlas.js` — **4,480 lines**, admin-only.
- `subscribe.js` + `checkout.js` — only needed on `#subscribe`.
- `live-arena.js` + `live-arena-lobby.js` + `live-arena-quiz-builder.js` — only on `#live-arena`.
- `review-hub.js` — only on `#review-hub`.

**Mechanism:** a tiny loader utility (add to a new `js/lazy.js`, loaded eagerly):
```js
window.lazyLoad = function (srcs) {            // srcs: string[]
  return Promise.all(srcs.map(src => new Promise((res, rej) => {
    if (document.querySelector(`script[data-lazy="${src}"]`)) return res();
    const s = document.createElement('script');
    s.src = src; s.dataset.lazy = src;
    s.onload = res; s.onerror = rej;
    document.head.appendChild(s);
  })));
};
```

**Wiring:** in `router.js` / `nav.js`, before showing a gated page, `await lazyLoad([...])` then call the existing init. Show `SymLoader.show()` (already exists in `loader.js`) during fetch.

**Ordering note:** these panels read globals like `db`, `currentUser`, `ScoreTracker` — all still eager, so no dependency inversion. Verify each panel's init is idempotent or guard re-entry.

**Verify per script:** (1) Network tab shows the file is NOT requested on home load. (2) Navigating to the route fetches it once. (3) Panel renders & functions (admin grant form submits; checkout opens Stripe zone; live-arena lobby creates a PIN; review-hub lists mistakes). (4) Second navigation does not re-fetch (dedup works).

**Rollback:** restore the `<script src>` lines, remove the `await lazyLoad` calls.

---

## Phase 2 — Lazy-load games (BIGGEST BYTE WIN: ~1.6 MB)

**Goal:** games download only when launched. Today all 61 game files (~1.6 MB) load on first paint.

**Why safe:** games launch exclusively via global `openX()` from `nav.js` dispatch tables, already guarded with `if (typeof openX === 'function')`.

**Mechanism — lazy shim per game.** Replace each eager `<script>` with a pre-registered stub that loads-then-runs. Build a manifest:
```js
// js/game-manifest.js  (eager)
window.GAME_MANIFEST = {
  openTempleRun:  ['games/temple-run/game.js'],
  openNaumachia:  ['games/naumachia/game.js'],
  openIliadaTow:  ['games/tow-canvas-engine.js?v=3','games/iliada-tow/game.js?v=3'],
  openEpitheta:   ['games/epitheta/data.js','games/epitheta/game.js'],
  // …one entry per game, listing its data.js + game.js (+ shared engine) in order
};
// For each key, if the real fn isn't defined yet, install a loader stub:
Object.keys(window.GAME_MANIFEST).forEach(fn => {
  if (typeof window[fn] === 'function') return;
  window[fn] = async function (...args) {
    SymLoader.show();
    await lazyLoad(window.GAME_MANIFEST[fn]);   // defines the real window[fn]
    SymLoader.hide();
    return window[fn](...args);                 // now the real one
  };
});
```
First call swaps the stub for the real function the script defines.

**Overlay-DOM dependency:** each game's overlay markup currently lives in `index.html` (lines 1498–2280). Two options:
- **2a (simplest):** keep overlay HTML in `index.html` for now; lazy-load only the JS. Ship this first.
- **2b (with Phase 3):** move each overlay to `components/overlays/*.html` and have the shim inject the overlay markup alongside the script. Do this only after Phase 3's include system is proven.

**Tiering (ship in this order, verify each tier):**
- Tier A — heavy canvas/3D: `temple-run, naumachia, blade, invaders, iliada-arcade, odyssey-journey, tow-canvas-engine+iliada-tow/noun-tow, crypto-hack, phalanx, dig, labyrinth, epic-puzzle, myth-memory, rapid-fire` (~1.0 MB).
- Tier B — grammar/quiz pairs: `lyo, pathitiko, afwnolekta, epitheta, ousiastika, aoristos-b, rimata-mi, anwmala-rimata, klisi-rimaton, eimi, synirimmena, paratheta, antonymies, noun-fill, lat-*` (~0.4 MB).

**Verify per game:** Network tab — file not loaded on home; clicking the game card fetches it once, overlay opens, game is fully playable (input, scoring, exit). Re-open does not re-fetch.

**Rollback:** restore that game's `<script>` line; the shim no-ops because the real fn already exists.

**Keep eager (do NOT lazy-load):** `firebase-config, auth, app, nav, router, loader, lazy, data, progression, scores, favorites, ornaments, carousel, grade-panels, sym-blocks, hero-avatars` — all on the home render path.

---

## Phase 3 — Extract static HTML into `components/`

**Goal:** shrink `index.html` (5,191 lines) toward a thin shell; make sections individually editable.

**Mechanism — runtime include pass** (precedent: `loader.js` already fetches SVG partials; nav-wraps are already JS-injected). Add to boot:
```js
// runs BEFORE nav/router wiring
async function hydrateIncludes() {
  const slots = document.querySelectorAll('[data-include]');
  await Promise.all([...slots].map(async el => {
    const html = await fetch(el.dataset.include).then(r => r.text());
    el.outerHTML = html;        // replace placeholder with partial
  }));
}
await hydrateIncludes();        // MUST complete before openX()/router run
```

**Proposed structure:**
```
components/
├── head-meta.html      ← index.html 1–79
├── auth-modal.html     ← 4127–4277   ★ pilot: pure static, no inline JS
├── footer.html         ← 1175 footer block
├── pages/
│   ├── home.html       ← 84–1220   (1,137 lines — largest block)
│   ├── subject.html    ← 1247–1291
│   ├── trivia.html     ← 1293–1386
│   ├── teacher.html    ← 1388–1497 (incl. template + builder modals)
│   ├── subscribe.html  ← 2282–2524 (incl. checkout zone)
│   ├── admin.html      ← 2526–3676 (1,150 lines)
│   ├── favorites.html  ← 3678–3699
│   ├── profile.html    ← 3701–3728
│   ├── about.html / contact.html / feedback.html ← 3730–3792
│   └── review-hub.html ← 3794–4126
└── overlays/*.html     ← 1498–2280 (~50 game overlay shells)
```

**Extraction order (safest first):**
1. `auth-modal.html` — static, no inline script, no JS depends on it existing at parse time (auth wires by ID at runtime). **Pilot step.**
2. `footer.html`, `head-meta.html` — trivial static.
3. `admin.html` — biggest single deduction; pairs naturally with Phase 1 lazy admin JS (inject HTML + JS together on `#admin`).
4. Remaining `pages/*`.
5. `overlays/*` — **last**, and only after confirming overlays exist in DOM before any `openX()` fires (await `hydrateIncludes()` before router init), OR fold overlay injection into the Phase 2 game shim.

**Critical ordering rule:** any inline `<script>` in `index.html` (8 blocks) that references a DOM node now living in a partial must run AFTER `hydrateIncludes()`. Audit each of the 8 inline blocks for `getElementById`/`querySelector` against moved IDs before extracting that section.

**Verify per extraction:** page renders identically (visual diff/screenshot before vs after), all buttons/handlers in that section work, no console errors, no "null is not an object" from a handler that ran before its DOM existed.

**Rollback:** paste the partial's contents back inline, remove the `data-include` placeholder.

---

## Phase 4 — Cleanup & guardrails (optional, after 1–3)

- Remove now-unused eager `<script>` lines fully; collapse `index.html` head.
- Resolve the inert `window.GE` hooks (Phase 0 follow-up): either restore a single grammar engine file and load it, or delete the two dead branches.
- Add a one-line build-free "smoke test" doc: list of routes + games to click through after any change.
- Consider versioning lazy chunks (`?v=`) consistently — today versions are ad hoc (`auth.js?v=10`, `app.js?v=4`, many unversioned), which interacts with the service-worker cache.

---

## Dependency / load-order facts (reference)

**Must-stay-eager core (home render path):**
`firebase-config → auth → app → ornaments → friezes-init(defer) → data → nav → loader → grade-panels → carousel → sym-blocks → progression → hero-avatars → scores → favorites → … → pages → router`

**No circular deps** — coupling is via `window` globals + script order, not imports. Consumers in `nav.js` already guard missing globals, which is what makes Phases 1–2 safe.

**External CDN (keep in `<head>`):** SheetJS, qrcodejs, Firebase 9.23 compat SDK (app/auth/firestore/functions/storage).

---

## Security notes (from audit — no action required, tracked here)

- Only `js/firebase-config.js` holds Firebase config; the web API key is a public client identifier, not a secret. No `sk_live`/private keys in client code (Stripe/PayPal secrets are server-side in `functions/`).
- Firestore/Storage rules are sound: `isAdmin()` email-pinned, user `role` immutable on self-update, storage default-deny with size/MIME caps.
- **Design caveat:** the `free/student/teacher` tiering is enforced **client-side** (`config`/`subscriptions`/`classes` are `read: if true`). Acceptable for public content; anything that must be truly paywalled needs server-side (Cloud Function) delivery.
