# SymposiON-Revamped — Architecture & File Map

> Canonical architecture document for the **synthesis/** SPA + Firebase backend.
> This is a faithful description of the codebase as it actually exists — including the
> "why it is written like that" rationale and the load-bearing gotchas — not an idealized design.

---

## 1. Big picture

### What the app is

SymposiON-Revamped (`synthesis/`) is a **classics-education platform** for Greek schools: a bilingual
(Greek/English) catalogue of grammar/declension games, trivia, canvas/arcade engines, real-time
multiplayer quizzes, a gamified "Hero's Journey" economy, AI grading/tutoring, and a teacher/admin
command center. It is a **light, revamp-native UI shell mocked over a real-but-mostly-unwired Ver1
backend** — the presentation layer was rebuilt, while the heavy game engines and much of the data layer
were ported from "Ver1" and lazy-loaded unchanged.

### The tech: no-build vanilla JS + Firebase compat SDK

There is **no app server, no bundler, no module system**. `index.html` eagerly loads ~80 classic
`<script>` tags (plus CSS) in a strict, hand-tuned order; every script communicates through globals on
`window` (and a few bare lexical globals). The backend is entirely **Firebase**: Cloud Functions
(Node 22) for anything a client can't be trusted with, Firestore Security Rules + Storage Rules as the
runtime authorization boundary, Firebase Hosting for the static SPA, and Firebase Auth (compat SDK) for
identity.

> **LOAD ORDER IS THE DEPENDENCY GRAPH.** With no imports, reordering `<script>` tags silently breaks
> things. Comments throughout `index.html` encode *why* each ordering exists. This single fact recurs in
> nearly every subsystem below.

### Core globals & contracts

| Contract | Owner | What it is |
| --- | --- | --- |
| `window.STATE` | app.js | Canonical app state `{direction, screen, screenParam, theme, classId, …}`. `direction` is pinned to `'synthesis'`. |
| `render()` / `window.symRender` | app.js | Synchronous **full-rebuild** render: wipes `#sym-home`, re-runs the active direction renderer. No diffing. |
| `window.symGo(screen, param)` | app.js | The sole navigation primitive; syncs hash for param-less `DEEPLINK` screens, forces direction back to synthesis, calls `render()`. |
| `window.SYM_DIR` | dir-*.js | Direction renderers. `SYM_DIR.synthesis` (dir-synthesis.js) is the only live one. |
| `window.SYM_SCREENS` | screens*.js | Flat `{screenId: fn(home, ctx)}` registry, populated additively by three files. |
| `window.SYM.*` | data.js | The single content model (CLASSES/SUBJECTS/GRAMMAR/ENGINES/SHOWCASE/… + `levelBankFor`). |
| `window.SYN_GAMES` / `window.SYN_LAUNCH_MAP` | manifest/*.js | Append-only registries: `openFn → {js,css,overlay,eager,fb}` and `display-name → openFn`. |
| `window.synLaunch(openFn,…)` | syn-launch.js | Lazy game dispatcher: ensures fb→css→overlay→js, then calls `window[openFn]`. |
| `window.SymStore` | store.js | Synchronous localStorage prefs layer (`sym_revamp_` namespace), dispatches `sym-store` events. |
| `isAdmin` / `currentUserRole` (+ `currentUser`, `adminRole`) | auth.js | **Bare lexical globals** (NOT on `window`, also mirrored to window for some). Read by nav, gate, admin. |
| `_gpCanAccessTier(requiredTier)` | auth.js | The runtime access gate (bare global so it closes over live `currentUserRole`/`isAdmin`). |
| `--sym-*` tokens | css/tokens.css | ~80 `.theme-*` classes set the raw palette; components read only the **derived** semantic tokens. |

### Boot → render → launch flow

1. **Boot** is owned by an inline **"HYDRATED BOOT LOADER GATEWAY" IIFE at the end of `index.html`** —
   *not* by `boot()` in app.js. It shows `SymLoader`, polls `firebase.apps.length && _firebaseReady`
   every 50ms, hides the loader on `onAuthStateChanged`, and is **fail-OPEN** (~3s poll giveup + 4s
   absolute setTimeout fail-safe) so a blocked Firebase CDN never bricks the paint.
2. `js/app.js` `boot()` restores state from `SymStore`, applies deep-link/preview params, wires
   `hashchange`/`storage` listeners, and inits subsystems (SymCursor, SymSeasons, SymMouseFX, etc.).
   It pops **zero modals** (consent + onboarding moved into sign-up).
3. **Render**: `render()` clears `#sym-home`, builds a `ctx` from `window.SYM.*`, sets
   `window.currentGradeKey` + `CurriculumGate.prefetch`, then dispatches to `SYM_DIR.synthesis`, which
   paints the persistent nav (`synNav`) and either `synHome()` (when `screen==='home'`) or a
   `SYM_SCREENS[screen]` builder + footer.
4. **Launch**: a tile resolves to an `openFn` via `synResolveLaunch(tile)`, then `synLaunch(openFn,…)`
   lazily injects the game's fb→css→overlay→js per its `SYN_GAMES` manifest entry and calls the real
   Ver1 opener `window[openFn](…)`.

---

## 2. Subsystems

### 2.1 Boot, render & loaders

**Overview.** The foundation layer. It owns: BOOT (static shell → painted, deep-link-restored,
auth-aware home), RENDER (synchronous full-rebuild model), LAZY-LOAD (manifest-driven on-demand
game/overlay loader), and chrome polish (branded loading overlay + custom cursor that bridges theme
tokens onto body-mounted game overlays). `js/app.js` is the conductor; everything else is data/behavior
that `render()` and `synLaunch()` dispatch into. The home is **eager + synchronous**; games/overlays/admin
are **lazy**.

| File | Role | Why written this way | Key gotchas |
| --- | --- | --- | --- |
| `index.html` | Single HTML entry point. DOM skeleton (`.harness`, `.stage > #sym-home`, `.tweaks`, `#page-admin`, `#auth-modal`, `#signout-modal`) + ~80 ordered scripts/CSS + the boot-gateway IIFE. | Everything is a classic script via window globals, so load order *is* the dependency graph. Comments encode each ordering (firebase+auth first; store/seasons/data before renderers; syn-lazy→loader→syn-launch→manifests; app.js near END to SHADOW loader.js's `SymLoader`; admin-synthesis after syn-admin to win `SYM_SCREENS.admin`; anathesi after screens-2 to win). | Boot gateway is the real reveal gate, fail-OPEN. Inline `<style id=syn-admin-host-css>` self-positions `#page-admin` (z 9600) because synthesis has no Ver1 `.page` system. Some game CSS (lyo, heptapylos) linked **eagerly** — safe ONLY because those sheets are overlay-scoped and never touch home. |
| `js/app.js` | Render core + boot conductor. STATE, `el()`/`render()`/`symGo()`, THEMES/DIRS, admin dev harness + theme/cursor pickers (Kleos pricing), `symApplyTheme`, `boot()`, the **real** `window.SymLoader`. | Render is deliberately dumb/synchronous (`home.innerHTML=''` then rebuild) — no vDOM, guaranteed consistency with STATE. `STATE.direction` pinned to `'synthesis'`; old Stoa/Agora/Akropolis directions are dead. Harness is admin-only, gated on the **bare** `isAdmin`, rebuilt by a MutationObserver on `body.class` after auth flips `body.is-admin`. | `window.SymLoader` here **shadows** loader.js's. `render()` is a full rebuild — any listener/interval outside the render tree is wiped. `DEEPLINK` whitelists only param-less screens. |
| `js/store.js` | Synchronous localStorage prefs: `SymStore.{get,set,favs,isFav,toggleFav,name,setName,order,setOrder}`. | Zero-latency prefs before/around `render()` without awaiting Firebase. JSON-in-localStorage with try/catch keeps boot synchronous. `set()` fires a same-tab `sym-store` CustomEvent; cross-tab relies on native `storage`. | NS=`sym_revamp_`. `get` returns default on any parse error. `order()` self-heals. Loaded early so later scripts read prefs synchronously. |
| `js/syn-launch.js` | Lazy game launcher/dispatcher: `synLaunch`, `synResolveLaunch`, `synEnsureCss/Overlay/Firebase`. | Heart of eager-vs-lazy: home paints fast, games load only on click. Manifest-driven so game-batch agents only append entries + drop overlay partials. `synEnsureFirebase` is a **no-op** (FB eager); `synEnsureOverlay` is fault-tolerant (404 → warn + resolve). | Load order inside `synLaunch` is fixed: fb→css→overlay→js→call. Resolution precedence: `tile.launch.fn` > `SYN_LAUNCH_MAP[en]` > `[gr]`. Needs `lazyLoad` + `SymLoader`. |
| `js/syn-lazy.js` | Low-level dedup script injector: `lazyLoad(srcs)→Promise` (series, deduped) + `window.APP_BASE`. | Ported from Ver1. `APP_BASE` derived from its OWN `document.currentScript.src` (not `location.href`) so manifest-relative paths resolve regardless of SPA sub-route — critical because the preview server has no SPA fallback. `async=false` + reduce-chain preserves order. | `_cache` Map dedups + is race-safe; failed loads delete their cache entry for retry. Must load before syn-launch + manifests. |
| `js/sym-loaders.js` | Branded loading-MARK library (no deps): 5 animated SVG monogram variants (ignite/meander/kylix/laurel/inscribe). Self-injects CSS. | Decouples loading artwork from overlay plumbing. Pure SVG+CSS keyframes (no GSAP). Loaded before app.js so the boot gateway's first `SymLoader.show()` has variants. | `app.js`'s `SymLoader.show()` delegates the MARK here; the OVERLAY chrome is app.js's. Honors `prefers-reduced-motion`. |
| `js/loader.js` | **DEAD/SHADOWED** dual loader (Ver1 port): `window._injectIllus`, a different `window.SymLoader` (overlay + inline spinner), CSS injection, and a season-restore IIFE. | Still included for SIDE EFFECTS — its loader CSS and the season-restore-before-paint IIFE. Its `SymLoader` is overwritten by app.js (loads later). | `SymLoader.mount` (inline spinner) is **dead** — never rely on it. Season restore reads a DIFFERENT key (`symposion_season`) than store.js's `sym_revamp_`. |
| `js/cursors.js` | Custom cursor system + **game-overlay theme bridge**: `SymCursor.{init,set,setShape,setIcon,setSeason,…}`. Lagging ring + inner glyph via GSAP `quickTo`; watches `.game-overlay` and stamps theme class. | Two selections (shape + icon) give the Agora cosmetic economy a richer cursor catalog. A launched Ver1 game owns the viewport via a body-level overlay OUTSIDE the themed shell, so cursors.js MutationObserver detects it and (a) hides the custom cursor, (b) calls `symApplyThemeClass` on each overlay so `--sym-*` tokens reach the game UI. | `anyGameOpen()` must NOT use `offsetParent` (null for `position:fixed`) — checks computed display/visibility/opacity. This is the **only** thing bridging theme tokens into body-mounted game overlays. |

**Dependencies.** Consumes: auth.js globals + firebase, data.js → `SYM.*`, seasons.js → `SymSeasons`,
dir-*.js → `SYM_DIR`, screen registries, `CurriculumGate`, GSAP+ScrollTrigger. Internally:
`render()→SYM_DIR`; `SymLoader→SymLoaders`; `syn-launch→syn-lazy + app.js + SYN_GAMES`;
`cursors→app.js + GSAP + SymStore`. Consumed by: every renderer (`symGo`/`symRender`/`el`/`injectIllus`/
`symApplyThemeClass`), all tiles (`synResolveLaunch`+`synLaunch`), all prefs (`SymStore`), the boot
gateway (app.js `SymLoader`), and lazy game overlays (cursors theme stamp).

---

### 2.2 Screens, navigation & home

**Overview.** The entire client-side screen/route/render subsystem. **No router library, no server
routing** — one `render()` wipes `#sym-home` and rebuilds the active screen from `window.SYM` using a
hyperscript `el()` and a bilingual `L()` resolver. `app.js` owns STATE + the render loop; `SYM_DIR.synthesis`
(dir-synthesis.js) always paints the nav then dispatches to either `synHome()` or a `SYM_SCREENS[screen]`
builder. `SYM_SCREENS` is populated additively by three files. Navigation goes exclusively through
`symGo(screen, param)`. `data.js` is the single content source of truth — adding a class/subject/game is a
**data edit, not a code edit**.

| File | Role | Why written this way | Key gotchas |
| --- | --- | --- | --- |
| `js/app.js` | Render loop, STATE, `symGo()`, `DEEPLINK` table, hash↔STATE sync, THEMES/DIRS. Builds `ctx`, computes `ctx.fresh`, dispatches to `SYM_DIR[direction]`. | Full-rebuild render chosen over vDOM for simplicity (small app, no stale DOM). Hash routing because served as a static SPA with no server fallback; only param-less screens deep-linkable (param screens need a JS object). | Param screens NOT in `DEEPLINK` — refreshing a `subject` deep link is impossible by design. `render()` wipes DOM every call → intervals/listeners must self-clear via `document.body.contains`. |
| `js/dir-synthesis.js` | `SYM_DIR.synthesis` dispatcher, persistent nav (`synNav`, mega-menu + theme/lang picker + auth chip + guide), `synPage()` scaffold, `synHome()`, `synFooter()`, `tile()` factory, "coming soon" helpers. | Direction indirection is legacy of a multi-direction prototype; synthesis is the only live one. Home lives here (not in `SYM_SCREENS`) as the dispatcher's default branch. `synPage` centralizes header/back chrome. Carousels are setInterval + DOM-presence-guarded. | Mega-menu `NAV_GROUPS` is a HARD-CODED array separate from `SYM_SCREENS` — adding a navigable screen needs an entry here. Home is special-cased (`screen!=='home'` guard) — a screen named `home` in the registry is dead. Class auto-rotate/showcase/promo are window-level interval handles. |
| `js/screens.js` | Registers batch 1 onto `SYM_SCREENS`: `subject`, `mode`, `level`, `gamepanel`, `live`, `profile`, `levelup`. Defines `launchTile`/`gameNeedsLevelPicker` + `SYM_SCREENS_HELPERS`. | Split from dir-synthesis to separate shell from deep screens. **SETS** `window.SYM_SCREENS = S` via `'='` — so this must load first. `launchTile` encodes the central rule: level selector only for real content-bank games; else `synLaunch`; else fallback to `S.level` so no tile is unlaunchable. `S.live` boots the real Firestore LiveArena. | `SYM_SCREENS_HELPERS = {glyph,pill,stat,chip,favBtn,viewBar,editable,attachReorder,defaults,SITE,isAdmin}`. `S.live` deliberately does NOT forward lobby cfg (teams/time/scoring) — the engine owns its host picker. |
| `js/screens-2.js` | Adds economy + management screens: `temple` (Agora shop), `anodos`, `tartarus`, `anathesi`, `admin`, `login`, parent, etc. (~1250 lines). Consumes `SYM_SCREENS_HELPERS`. | Separated purely for size/domain grouping. Reads helpers via `const H = window.SYM_SCREENS_HELPERS` rather than re-implementing → identical visual primitives. Agora persists everything via SymStore keys (kleos, acro_owned, …) so cosmetics are worn platform-wide; quests show honest 0 for fresh users. | `const H = …` at module scope → **DEPENDS on screens.js loading first**, else every screen throws. Quest cycle rolls at 03:00 LOCAL. `temple` re-renders on an external agora-sync debounce in app.js. |
| `js/screens-learn.js` | Adds hierarchical learning nav: `gym`/`lyk`/`grade`, `classpage`, `gramhub`, `gramtrack`. Bridges to THEORY (`openTheory→openTheoryLesson`), renders tier locks on theory cards. | Additive via `Object.assign(SYM_SCREENS, S)` so it extends without touching screens.js. `renderSubjectBlocks()` shared between classpage/gramtrack. Theory datasets lazy-loaded before opening; degrade to a friendly notice if missing. | Exports `synOpenTheory`, `SYN_THEORY_TRACKS`. `THEORY_TRACKS` keyed by grammar trackId — only `gram-archaia` has lessons today (latin/neo games-only by design). Tier lock via `_datasetTier`/`_tierLocked` + `_gpCanAccessTier`. |
| `js/data.js` | The single content model (`window.SYM.*`): `L`/`STR`, `CLASSES`, `SUBJECTS`, `GRAMMAR`, `CLASS_GROUPS`, `ENGINES`, `CAROUSEL`, `MPGAMES`, `SHOWCASE`, `TRIVIA`, `ACROTERIA`/`TITLES`/`AVATARS`, `LEVEL_BANK`+`levelBankFor()`. | One source of truth so every screen renders from the same data. The `g(gr,en,meta,illu,launch)` tile factory threads optional `{fn,args}` so a tile dispatches to a real opener; `gSoon()` flags revamp-only tiles. `LEVEL_BANK` maps openFn→`{ds,prog}`; `levelBankFor()` only returns an entry when `GP_LEVEL_PROVIDERS` has live levels. | `SUBJECTS` keyed by BOTH grade ids AND grammar track ids (second `Object.assign`). `window.SYM.TITLES` assigned twice — line 434 (`=SYM_TITLES`) is canonical; read `window.SYM_TITLES`. |
| `js/syn-launch.js` | The tile→game launch contract (see 2.1 / 2.4). | (see 2.1) | (see 2.1) |

**Dependencies.** Needs: `SYM.*` (data.js), the launch layer (syn-launch + manifests + gp-engines +
gp-levels), and global helpers `el()`/`L()`/`SymStore`/`injectIllus()`. Optional/degrade-gracefully:
GSAP, SymTags, SymPreview, SymGuide/SymSys/SymSeasons/SymCursor/SymMouseFX, auth globals, LiveArena,
`getProgression()`, SymVoyage, CurriculumGate, SymTiers/`_gpCanAccessTier`.
**Critical load order:** data.js → dir-synthesis.js → screens.js (SETS registry) → screens-2.js +
screens-learn.js. Depended on by: app.js `render()`, every `symGo()` caller, game manifests (call back
into `synLaunch`), and admin/teacher tooling.

**Three nav source lists must be kept in sync manually:** (a) app.js `DEEPLINK` (hash routing), (b)
dir-synthesis.js `NAV_GROUPS` (mega-menu), (c) the legacy `SCREENS` const in dir-synthesis.js. Adding to
`SYM_SCREENS` alone does **not** make a screen navigable or deep-linkable.

---

### 2.3 Auth, monetization & entitlement

**Overview.** Decides WHO a user is (Firebase Auth), WHAT role/plan/tier they hold, and WHETHER they may
open content. Deliberately split: a thin client (auth.js, syn-tiers.js, progression.js) that establishes
identity + renders entitlement UI + does best-effort client gating, and a Cloud Functions surface
(functions/index.js) that is the **only authority** allowed to write entitlement fields, pinned by
firestore.rules.

**Three overlapping, NON-unified dimensions:**
1. **App role** — `users/{uid}.role ∈ {free, student, teacher}` → bare global `currentUserRole`. *This is
   what the runtime gate reads.*
2. **Admin role** — a Firebase custom CLAIM `role ∈ {super, content, support, finance}` (on the ID token,
   NOT Firestore) → `adminRole`; any claim sets `isAdmin=true`. Orthogonal to app role.
3. **Access tier** — the ranked ladder Free<Student<Teacher<Pro (+admin custom tiers) in syn-tiers.js;
   content is tagged `requiredTier` and rank-compared.

**The plan/expiry gap.** Paid access is written by Cloud Functions as `users/{uid}.plan='pro'` + `role` +
`expiresAt` + `classes`. But the runtime gate (`_gpCanAccessTier`) reads ONLY `currentUserRole` (the
`role` field) — never `plan`/`expiresAt`. Entitlement effectively rides on `role`, which
`adminGrantAccess`/`_grantProAccess` co-write alongside `plan`. There is **no Pro-tier resolution from
`plan`** in the gate, and **no job that downgrades expired users** — `demoteExpiredSubscriptions` is named
in intent but is **not implemented anywhere**. Expiry surfaces only as a cosmetic 14-day warning banner.

**Why client gate + deferred server gate.** `_gpCanAccessTier` is a bare global inside auth.js so it
shares lexical scope with live `currentUserRole`/`isAdmin`. Before it existed, the `typeof
_gpCanAccessTier === 'function'` consumer guards were skipped (fail-OPEN); defining it activated real
gating. It is fail-CLOSED on tier mismatch but **fail-OPEN on infra error** (missing SymTiers → returns
true) so a transient load failure never bricks the site. It is **purely a visibility gate** — bypassable
with devtools because content (theory text, quiz JSON) is world-readable in Rules. The genuine paywall (a
server-side content gate) is **deferred/unbuilt**; today the only hard control is that Rules forbid users
self-writing entitlement fields.

**Stripe-deferred state.** Stripe (createStripeCheckout/createPaymentIntent/stripeWebhook) is fully coded
but inert until `functions.config().stripe.*` is set. PayPal exists in parallel. The **only live grant
path is `adminGrantAccess`**.

| File | Role | Why written this way | Key gotchas |
| --- | --- | --- | --- |
| `js/auth.js` | Firebase Auth bootstrap + identity/role loader + runtime gate + all auth UI. Declares `currentUser`, `currentUserRole`, `isAdmin`, `adminRole`. | Gate is a bare global so it closes over live role/admin lets — the only way the typeof-guarded callers get real values without a Firestore re-read per check. Fail-open-on-registry-error is a deliberate availability choice. Bootstrap-email-as-super is the lockout escape hatch. | `symCurrentTier()` maps admin/teacher→'teacher' else `currentUserRole`. `_loadUserRole` reads `users/{uid}.role` AND token claim in parallel; `dimikamou@gmail.com` is FORCED isAdmin+super+role='teacher'. `refreshAdminClaims()` MUST be awaited after `setAdminRole`. `initializeApp` MUST stay synchronous. |
| `js/syn-tiers.js` | Access-tier REGISTRY (`window.SymTiers`): Free(0)<Student(1)<Teacher(2)<Pro(3) + admin custom tiers. | Centralised so a new tier propagates to gate/grant/pricing/matrix at once. Array-order-as-rank keeps `meets()` a cheap int compare. Custom tiers default rank 1 so they can NEVER auto-outrank Pro. | `meets(u,r) = rank(u||'free') >= rank(r)`. Custom tiers persist in SymStore `access_tiers` + mirror to `config/tiers`. Built-ins can't be removed. An admin minting a "premium" tier above Pro must explicitly set its rank. |
| `js/progression.js` | Hero's Journey RPG layer, but OWNS the user-facing billing READ. `_hjLoadBillingSection()` renders "My Plan"; `hjToggleAutoRenew()`. | Billing UI bolted onto the profile page where identity already shows. No expiry enforcement — only a cosmetic warning. | **Reads plan from `classrooms/{uid}.subscriptionType` + `classrooms/{uid}.expiresAt`** — a DIFFERENT doc than where grants WRITE (`users/{uid}.plan`+`expiresAt`). Likely source of "my plan shows free after grant". Exposes `window.teacherFeatures`. |
| `functions/index.js` | Server-side billing + admin-grant + role provisioning. `createStripeCheckout/PaymentIntent/Webhook`, `adminGrantAccess`, `setAdminRole`, PayPal, GDPR. Only Admin SDK writes entitlement. | Price + entitlement server-side so the client can't forge. Single `_grantProAccess` keeps Stripe/PayPal/admin paths consistent. `requireRole` default-DENY + `setAdminRole` last-super-guard are explicit hardening. Throw-on-missing-config = the deferred-monetization tell. | `getStripe()` THROWS without `secret_key`. Pricing server-authoritative via `getPricing()`. `_grantProAccess` is the single writer (plan:'pro', role, expiresAt, classes). `requireRole`/`callerRole`: bootstrap email→super; default-deny unknown claims. **No `demoteExpiredSubscriptions` exists.** |
| `firestore.rules` | The actual enforcement boundary. Pins entitlement fields; defines admin domain access. | Rules can't validate nested invariants → those writes go through Functions; Rules lock field-level invariants. "Self-update may not change entitlement fields" is the load-bearing anti-fraud control. | `users/{uid}` self-update allowed only if role/plan/tier/classes/expiresAt/grantedBy/grantedAt UNCHANGED. `create` requires `role=='free'`. `config`/`siteCatalog`/`gameContent` world-READABLE, `write:false` — **this is WHY the client gate is only cosmetic**. `coupons` readable only by `can('subs')`. |

**Dependencies.** Needs Firebase compat SDK + firebase-config.js, SymStore, SymTiers, `functions.config().stripe.*`,
`config/pricing`+`config/tiers`. auth.js init must be synchronous (favorites.js/scores.js call
`firebase.auth()` immediately). Depended on by: nav rendering, admin.js, progression.js, live-arena.js
(`teacherFeatures`+gate), and gate consumers (theory-lesson, trivia-iframe-launchers, screens-learn,
study/flashcards, rapid-fire/phalanx). **`firestore.rules` `can()` mirrors `ROLE_DOMAINS` — must stay in
sync.**

---

### 2.4 Games: manifest & launch

**Overview.** Turns a panel "tile" into a running game by: (1) resolving tile→`openFn`, (2) deciding
level-picker vs direct launch, (3) lazily injecting JS/CSS/overlay per the manifest, (4) invoking the
self-registered `window[openFn](…)`. A faithful port of Ver1's lazy-loader, re-driven by two append-only
registries (`SYN_GAMES`, `SYN_LAUNCH_MAP`) so game-batch agents only append manifest fragments + drop
overlay partials.

**Three content models behind one launcher:** (a) leveled grammar games reading bespoke per-game `data.js`
globals + a `(levelId, group)` arg from the picker fed by `GP_LEVEL_PROVIDERS`; (b) trivia games whose
banks are editable via Site Studio and hydrated from Firestore via content-source.js; (c) self-contained
"engine" games (heptapylos, naumachia, PvP/engines packs) that build their own overlay and read a live
`window.<XX>_Q` bank with a hard fallback to the eagerly-seeded `window.SYM_QUESTIONS` — so they ALWAYS
open with real content even though the GP-content→`*_Q` bridge is **not yet wired**.

| File | Role | Why written this way | Key gotchas |
| --- | --- | --- | --- |
| `js/syn-launch.js` | Dispatcher: `synLaunch`/`synResolveLaunch`/`synEnsureCss/Overlay/Firebase`. | Mirrors Ver1's contract so ported openers run unchanged, but data-driven by per-batch fragments. Overlay fetch is tolerant (404→warn+resolve). | Initializes `SYN_GAMES`/`SYN_LAUNCH_MAP` as `{}`. `synLaunch` only acts if entry exists AND `window[openFn]` is a function after load. Resolution: en BEFORE gr. |
| `js/syn-lazy.js` | Core lazy loader: `lazyLoad(srcs)` (series, deduped) + `APP_BASE`. | Manifest paths relative → resolved against `APP_BASE` (from `currentScript`, not `location.href`). `async=false`+series so later files rely on earlier. | Dedup by RESOLVED url; failed load deletes cache entry. Loaded very early (line 232). |
| `js/manifest/canvas-arcade.js` | Manifest for canvas/arcade/engine games (invaders, iliada-arcade, agora-surfers, myth-memory, epic-puzzle, odyssey-3d, blade, dig, labyrinth, phalanx, naumachia, rapid-fire, tow, noun-tow, heptapylos). Contains the iliada-arcade eager-boot trap. | Shows the full range of shapes: multi-file js arrays, overlay-partial vs `overlay:null`, `eager:true`. heptapylos uses `overlay:null`+`eager:true`+`pvp-shell.css` because its IIFE builds its own `.sym-overlay` shell needing dark tokens. | iliada-arcade boot trap wraps `openIliadaArcade` (defineProperty) to dispatch a synthetic `DOMContentLoaded` on first launch. `tow-*` reused by `openTow`+`openNounTow` with different overlay ids. |
| `js/manifest/grammar-greek.js` | Manifest for Greek grammar games (lyo, eimi, ousiastika, antonymies, epitheta, paratheta, klisi-rimaton, synirimmena, anwmala-rimata, afwnolekta, aoristos-b, rimata-mi, pathitiko, noun-fill). | Keep Ver1's structure: a `data.js` global + a `game.js` that assumes its overlay element exists → each entry names a real `overlays/<id>.html` partial. paratheta reuses lyo's `LYO_DIACRITICS` → loads `lyo/game.js` FIRST (deduped). | overlay ids map 1:1 to `overlays/*.html`. Bilingual map keys (Greek + English both → openFn). |
| `js/manifest/engines-pack.js` | Manifest (IIFE) for Gold-Quest engines: moirai, ekklisia, oracle, parthenon, olympus, hippodrome, mnemosyne(memory), erinyes. All `overlay:null`. Patches invaders/blade coverage. | Each engine self-registers open/close + builds its own `.sym-overlay`, reads `<XX>_Q` w/ `SYM_QUESTIONS` fallback. `pvp-shell.css` loaded first for dark Hearth tokens. Coverage fixups because `GP_ENGINES` keys by id/label, not carousel name. | `'mnemosyne-memory'` deliberately distinct from the `'mnemosyne'` flashcard study mode. |
| `js/screens.js` | UI that builds + routes tiles: `launchTile`/`gameNeedsLevelPicker`, `S.level` picker, `S.gamepanel` merge. | Single dispatch funnel guarantees launchability (final `go('level')` is a safety net). Picker only for tiles whose openFn has a `LEVEL_BANK` entry AND a live provider. Game Panel de-dupes by resolved openFn. | `_ALL_ENGINES` maps each `GP_ENGINES` record → tile via `SYN_LAUNCH_MAP[g.id]||[g.label]`. Per-level done state read honestly from localStorage. |
| `js/data.js` | `SYM.LEVEL_BANK` (openFn→`{ds,prog}`) + `SYM.levelBankFor(tile)`. | Decouples "is leveled" from "live level data exists" — a bank row alone isn't enough; provider data must be present, else direct launch (no empty picker). | **GOTCHA ~line 775: a stray backslash line inside the object literal** where a `//` comment was intended — confirm it parses, else leveled games silently lose pickers. Levels come from `GP_LEVEL_PROVIDERS`. |
| `js/gp-levels.js` | `GP_LEVEL_PROVIDERS`: per-dataset level lists + raw-data filters, used by configurator AND runtime picker. | Picker opens BEFORE lazy game files load → level metadata must be eagerly loaded. Filters preserve `rawDB` shape so the engine's `_gpNormalizeQuestions` still recognizes it. Missing/empty → fall back to whole DB. | `dictProvider`/`subArrayProvider`; lyo is generator-leveled. Level lists must be kept in sync with each game's source file. |
| `js/gp-engines.js` | `GP_ENGINES`: single source of truth for admin-toggleable engines (id/label/subtitle/icon/tier/allowedCategories/type) + categories. | Ported 1:1 from pre-merge nav.js so admin reads it unchanged. Exposed as both bare global AND `window.GP_ENGINES`. Game Panel consumes it to surface EVERY engine. | An engine record has NO launch wiring — its id/label must be a key in `SYN_LAUNCH_MAP` (engines-pack/canvas-arcade add fixups). type auto-classified by tag. |
| `js/gp-content.js` | `GP_CONTENT`: dataset registry for the Engine Configurator. Merges in-code datasets + GRADES curriculum + Firestore packs. | Replaces a hand-maintained array. `window.GP_DATASETS` kept as a LIVE view for legacy callers. Cloud sources merged on configurator open, not at boot. | `registerDataset` re-register `Object.assign`s. `loader` returns the live global or null. `levelsGlobal` names the per-game level array var. Teacher quizzes register as `cg:`+docId. |
| `js/content-source.js` | `ContentSource`: Site Studio read/write/apply for catalog + per-game content (quiz\|paradigm). Also defines `CurriculumGate`. | Adapts Ver1's Firestore-only studio to SYM + SymStore. All FS access guarded so the sandbox degrades local-only. Authoritative writes go through validated CALLABLES; a validation rejection must surface, NOT silently raw-write. boot hydrates for EVERY visitor. | **PARADIGM content intentionally NOT delivered** (shapes don't match Studio doc) — paradigm tiles surfaced non-editable. `applyLiveGameOverride` reads override SYNCHRONOUSLY from SymStore. CurriculumGate was dropped in the rewrite and restored here. |
| `games/heptapylos/game.js` | Representative self-contained engine. `Heptapylos.open/close`, builds `#hep-overlay.sym-overlay` on demand, `_pool()` reads `HEP_Q` else `SYM_QUESTIONS`. | Demonstrates `overlay:null`+`eager:true`+`SYM_QUESTIONS` fallback: builds its own dark shell, never opens empty. | **`window.HEP_Q` is the intended bridge but is NOT set anywhere** — so every engine falls through to `SYM_QUESTIONS`. Wiring the GP-content→`<XX>_Q` bridge is the open integration point. |
| `js/syn-questions.js` | Seeds `window.SYM_QUESTIONS` — the universal bilingual question floor (`{q:{gr,en}, a:[4], c:index}`). Eager. | Provides the content floor so every self-building engine opens with real questions. Loaded eagerly (line 244) before any manifest fragment. | Format matches the live engine. screens.js also mirrors it to `localStorage['SYM_QUESTIONS']` for trivia-panel hydration. |

**Dependencies.** syn-lazy.js must load first. **Eager order is load-bearing:** data.js → syn-lazy →
gp-levels → gp-content → gp-engines → syn-questions → syn-launch → manifest/* → content-source →
syn-hydrate. Also: shared-engine.js (`gramRunGame`), firebase-config + auth, SymLoader, callables
`adminSaveCatalog`/`adminSaveGameContent`, Firestore docs (siteCatalog/tree, gameContent/<id>,
config/datasets, custom_games, config/game-tiers). Game-batch agents depend ONLY on the
`SYN_GAMES`/`SYN_LAUNCH_MAP` registry contract + `overlays/` convention.

> **Hard contract:** `overlay:null` for self-building engines vs a real `overlays/*.html` id for
> partial-based games. Mismatch either fetches a pointless partial (tolerated) or makes `game.js` throw
> (e.g. `openLyo` does `getElementById('lyo-overlay').classList.add('active')` with no null guard).

---

### 2.5 Admin panel

**Overview.** The "Command Center" surface, reachable only when bare `isAdmin` is truthy (true only for
`dimikamou@gmail.com`). Registered as `window.SYM_SCREENS.admin`, rendered into `#sym-home`.

**Two competing registrations, resolved by SCRIPT LOAD ORDER:**
1. `js/syn-admin.js` (line 288) — the Ver1 BRIDGE. Registers an admin screen showing the legacy
   `#page-admin` overlay (`_renderAdminPage` in admin-cc.js), installs a `window.goTo('admin')` shim,
   ESC-to-close, and monkey-patches `symGo` so navigating away calls `synHideAdmin()`.
2. `js/admin-synthesis.js` (line 299, with `setTimeout(register,0)`) — the revamp-native LIGHT admin
   (`sc-admin2`). Loads after, so it **WINS**. First act: `synHideAdmin()`. Renders an alabaster page via
   `synPage` with a 4-stat band + left RAIL (21 built-in + custom sections + live search) and a right PANE
   repainted in-place by a `paint()` dispatcher keyed on `activeSec`.

**Design intent.** Keep the REAL Ver1 engines wired while replacing the dark chrome with a light inline
panel. Heavy sub-tools are NOT reimplemented — they are mounted in-pane from existing modules
(AdminCC.classPlan, AdminStudio, BannerAdmin, SymTags, ccOpenAtlas, synOpenAcroteria). The mounting trick:
those sub-modules' CSS is scoped to `#page-admin`, so admin-synthesis wraps them in
`<div id="page-admin-embed" class="syn-cc-embed">` with the fullscreen/hidden layout neutralised inline.

**Three-layered, offline-first persistence.** SymStore (always-available source of truth) → guarded
Firestore mirror (`fsReady()` + try/catch + `.catch(noop)`, silent degrade) → Cloud Functions callables
(only where server trust is required: `aiGraderStatus`, `askTutor`, and the shared `adminGrantAccess`/
`adminSaveCatalog`/`adminSaveGameContent`). Stats are honest — games count from authored data;
users/subs/MRR/churn start at 0 and are patched via `statSet()` when guarded queries return.

| File | Role | Why written this way | Key gotchas |
| --- | --- | --- | --- |
| `js/admin-synthesis.js` | The live admin. Registers `SYM_SCREENS.admin`, gates on `isAdmin`, hides Ver1 overlay, drives `paint()` over ~22 sections (overview, grant, users, access, pricing, discounts, subs, studio, aisources, voyage/Templates, realm, games, tags, tartarus/settings, banners, messaging, hero, about, feedback, guides, atlas). | Replaces dark CC with a light inline panel WITHOUT reimplementing engines — mounts them in-pane + reuses their data layer. Loaded last so its registration wins. Offline-first. Honest stats was explicit. | Helpers are **lazy thunks** (`SS()`,`el()`,`L()`,`SYM()`) — never cache at module top. Access MATRIX is AUTHOR-only (runtime gate NOT wired). `gameKey(tile)` keys by openFn — must stay stable or toggles orphan. `ai_corpus` chunks split by UTF-8 BYTE length (900000) not chars. In-pane mounts depend on the `page-admin-embed` neutralisation wrapper. |
| `js/syn-admin.js` | Bridge wiring Ver1's `#page-admin` overlay into the shell. Registers a (now-overridden) admin screen, `window.goTo` shim, ESC handler, `synHideAdmin()`, `symGo` monkey-patch. | Synthesis routes through `SYM_SCREENS`; Ver1's admin expects a `goTo` page-router synthesis lacks. Minimal adapter. Loaded BEFORE admin-synthesis so the light admin overrides while reusing `synHideAdmin`/`goTo`. | Its own `SYM_SCREENS.admin` is DEAD, but its side effects are LIVE and load-bearing — don't delete thinking it's superseded. |
| `js/admin-cc.js` | Ver1 Command Center engine: DOMAINS sidebar + `VIEWS` registry incl. Class Plan (`classplan`) used by admin-synthesis's Access Control. | Pre-existing full-featured admin kept intact; admin-synthesis cherry-picks the Class Plan instead of duplicating it. CSS scoped to `#page-admin` → why it's mounted in the neutralised embed host. | `AdminCC.classPlanHTML()`/`classPlanInit()` wrapped in try/catch returning `''` — admin-synthesis falls back to its own `renderAccessControl` matrix on throw. |
| `js/admin-studio.js` | Site Studio: edit the whole catalog (Grades→Subjects→Games→content→Paradigm) via `ContentSource`, persisted through validated callables. Mounted in-pane. | Authoring must enforce RBAC + quiz/paradigm invariants → NO direct Firestore writes, only function calls. Reusable view/init pair for both CC and light admin. | `AdminStudio.view()`/`init()`. Depends on `ContentSource` + the save callables. On throw shows a "try Sync/reload" hint. |
| `js/admin.js` | Backend handlers shared by both admins: `adminGrantAccess`, coupon CRUD, pricing (`config/pricing`), access (`config/access`), full banner CRUD, stats, Class Plan persistence (`classes/{key}/curriculum/main`). | Centralises privileged writes so UI modules stay presentation-only + share one definition of each config doc. Guarded + SymStore-mirrored to work offline. | `config/pricing` is the contract point — admin-synthesis adds editor-only meta keys (`_kinds`/`_unlocks`/`_bundles`/…) that `adminSavePricing` must not clobber. **`access` here = `config/access`, but admin-synthesis writes its richer matrix to `config/accessControl` — different docs.** |
| `js/banner-admin.js` | Self-contained banner editor: `BannerAdmin.render(pane)` — bilingual create form, live preview, seed-6 button, list with inline edit + activate/deactivate. | Dependency-light (own el/L/esc fallback), presentation-only — calls the admin.js banner backend, not Firestore. | SEED = 6 banners inlined (no fetch). The sticky bar (banner-bar.js) self-re-renders after changes. |

**Dependencies.** Needs synthesis core (`symGo`/`symRender`/`SYM_SCREENS`, `synPage`+`synHideAdmin`, `el`/
`L`/`SYM`, `SymStore`), the bare `isAdmin`, registries (`SymTiers`, `SymTags`, `SYN_GAMES`/`SYM.SUBJECTS`,
`SymVoyage`/`SymPreview`/`SymInfoPanel`/`SymSys.notify`, `ContentSource`/`RealmStore`), the sub-engines
(`AdminCC`, `AdminStudio`, `BannerAdmin`, `ccOpenAtlas`), optionally firebase, and CDN libs for AI Sources
(pdf.js, mammoth, JSZip, tesseract.js). Depended on by: the router, the profile→admin entry, runtime code
reading switches via `window.adminFlag(key,def)`, syn-assignments.js (`template_assignments`), and the
banner bar.

> **Access Control caveat:** the MATRIX (`renderAccessControl`, `access_control` / `config/accessControl`)
> only AUTHORS config — the runtime tier/level GATE is explicitly NOT wired (future work). And the `access`
> rail button prefers `AdminCC.classPlanHTML` (`config/access`), falling back to the matrix on error —
> **two different access models behind one button.**

---

### 2.6 AI subsystem

**Overview.** LLM/cloud-AI features over the otherwise-deterministic platform. Three server endpoints
(Cloud Functions in functions/index.js + functions/tts.js) and three client touchpoints:
- **gradeAnswer** — subject-agnostic free-response GRADER → structured Greek JSON
  `{score,verdict,feedback,covered,missed,wrong}`. Powers the istoria study-kit's AI-graded methods.
- **askTutor** — free-form student TUTOR callable, scope-locked by a hard system-prompt guardrail to the
  platform's classics subjects.
- **tts** — neural Greek/English read-aloud (Iris / Narration Studio) via Google Cloud TTS.

Grader + tutor ground answers in admin-uploaded books (`ai_corpus`) by **cheap KEYWORD matching — no
embeddings, no vector DB** (a deliberate cost decision). The AI-Sources admin panel ingests
PDF/txt/md/docx/epub (OCR fallback for scans), byte-chunks under Firestore's 1 MiB cap, and writes
`ai_corpus`. The whole subsystem **fails soft**: no `ANTHROPIC_KEY` or upstream failure → non-2xx, and the
client silently degrades (offline token-overlap heuristic / friendly error / browser SpeechSynthesis).

| File | Role | Why written this way | Key gotchas |
| --- | --- | --- | --- |
| `functions/index.js` | `gradeAnswer` (HTTP fn), `askTutor` (callable) + shared helpers (buildGraderPrompt, parseGraderJSON, buildTutorPrompt, getAiCorpus, graderEnv, `_graderRateOk`, aiGraderStatus, `TUTOR_SYSTEM`). | `gradeAnswer` is HTTP because the istoria grader runs in a same-origin iframe POSTing to `/api/gradeAnswer` via a Hosting rewrite; `askTutor` is a callable (main shell). Key held server-side only. Both return non-2xx on failure so the client falls back. `graderEnv` reads `process.env` first (v7/Secret Manager) then legacy `functions.config()`. | CORS is wide-open (`Allow-Origin:*`) — **the real guard is `verifyIdToken`**, not CORS. `parseGraderJSON` strips fences + slices `{…}` → brittle on prose. `getAiCorpus` returns `''` on ANY error → grader runs ungrounded. Rate: grader 80/h, tutor 60/h. |
| `functions/tts.js` | Standalone HTTPS fn for neural TTS. POST `{text,lang,voice,rate}` → `{audioContent}`. Served at `/api/tts`. | Split out to isolate `@google-cloud/text-to-speech` + its runWith config. Bills per char → requires verified ID token + per-user cap. 24h Cache-Control so identical lines don't re-bill. | `_ttsRateOk` 120/h, counter at `grader_usage/tts_{uid}`. text>600 → 413; rate clamped 0.5–1.5. **Uses Google Cloud ADC, NOT ANTHROPIC_KEY** — so TTS can be silently broken while the admin pill shows "AI active". |
| `js/ai-tutor.js` | Student AI Tutor screen (`SYM_SCREENS.tutor`): chat UI, subject picker, history, "grounded vs general" tag. Calls `askTutor`. | Self-contained IIFE re-asserting its screen via `setTimeout(…,0)`. Mirrors the server scope guardrail in an intro card. Handles signed-out + missing `firebase.functions`. | History is module-level, **not persisted** (cleared on reload). `friendlyError()` maps HttpsError codes to bilingual messages. Reads `window.currentUser`/`window.openAuthModal`. |
| `js/admin-synthesis.js` | AI-Sources panel (`renderAiSources`): upload + client-side extract (pdf.js/mammoth/JSZip/Tesseract OCR) + byte-chunk + write `ai_corpus`. Shows AI status pill via `aiGraderStatus`. | Extraction in-browser via lazily-loaded CDN libs to keep parsing off Functions. Chunking by UTF-8 BYTE length (~900000) because Greek chars are 2 bytes — a char-stride silently produces >1 MiB docs. Storing in Firestore survives redeploys + reaches the grader on any device. | Writes `{sourceId,title,subject,part,parts,text,chars,filename,enabled,uploadedAt}`. `AI_SUBJ` keys MUST match the server's `AI_SUBJECT_MATCH`. Subject matching is asymmetric (key stored vs regex tested against free-text subject string). |
| `games/istoria/js/study-kit.js` | `window.SK` — AI grading service + review renderer. `SK.grade(p)` POSTs to `/api/gradeAnswer` with the parent user's ID token; degrades to offline `SK.local` on failure. | Runs inside the same-origin istoria iframe → reads the token from `window.parent.firebase` to satisfy the auth requirement. Signed-out → no token → 401 → offline demo (`demo=true`) with a "⚠ offline demo" note. | JSON contract `{score,verdict,feedback,covered[],missed[],wrong[]}`. **Cross-frame token read only works because istoria is same-origin** — served cross-origin, every grade silently becomes the offline heuristic. Requires sym-icons.js. |

**Dependencies.** Needs `ANTHROPIC_KEY` (via `graderEnv` from `process.env`/Secret Manager, legacy
`functions.config().anthropic.key` fallback; optional `ANTHROPIC_MODEL`, default `claude-sonnet-4-6`),
the Anthropic Messages API, Firebase Auth (`verifyIdToken`/`context.auth` on every paid call), Firestore
`ai_corpus` + `grader_usage/*`, and for tts: `@google-cloud/text-to-speech` + Cloud TTS API + ADC, plus
`firebase.json` rewrites `/api/gradeAnswer`→gradeAnswer and `/api/tts`→tts. Consumed by study-kit.js,
ai-tutor.js, the AI-Sources panel, and Iris/Narration Studio.

> **Grounding is best-effort and silent.** `getAiCorpus` is keyword overlap only, caps at 7000 chars, and
> returns `''` on any error — a misconfigured `ai_corpus` query degrades to general-knowledge answers with
> no visible error. The tutor scope guardrail is **prompt-only** (`TUTOR_SYSTEM`), not a hard filter.

---

### 2.7 Persistence & multiplayer

**Overview.** Everything needing Firestore at runtime for cross-device persistence or real-time
multiplayer, plus the shared "while you wait" mini-game. Three concerns:

1. **Persistence/hydration.** The light admin writes content to SymStore (per-browser). `syn-hydrate.js`
   closes the gap generically: it listens to `sym-store`, mirrors a whitelist of admin-content keys up to
   one Firestore doc (`config/adminMirror`), and hydrates them back for every visitor at boot.
   `banner-bar.js` and `syn-assignments.js` are the consuming surfaces.
2. **Real-time multiplayer.** **LiveArena** (Kahoot-style host-driven classroom quiz, `live-arena.js` +
   `live-arena-lobby.js`, registered by `manifest/multiplayer-fb.js`) and **Naumachia** (1v1 Battleship,
   `games/naumachia/game.js`). Both gate writes behind Firebase Auth (rules require `request.auth != null`).
3. **Waiting-game lifecycle.** `flappy-waiting-game.js` is a Shadow-DOM-isolated Flappy custom element;
   `flappy-slot.js` (`window.SymFlappy`) owns ONE shared card + ONE instance shuttled between waiting
   screens so only one rAF/AudioContext loop ever runs.

| File | Role | Why written this way | Key gotchas |
| --- | --- | --- | --- |
| `js/syn-hydrate.js` | Admin-content bridge: `config/adminMirror` ↔ SymStore. Hydrates a whitelist for every visitor at boot; mirrors admin edits back (debounced, admin-only). | The light admin writes to SymStore, so without this, owner content is per-browser + invisible to students. Avoids touching every admin handler by hooking the single `sym-store` event. Mirror survives Hosting redeploys. | `_hydrating` flag guards against hydration writes echoing back out. `_isAdmin()` reads the bare `let isAdmin` (NOT `window.isAdmin`) with `body.is-admin` fallback. Only admins publish. Debounced 800ms `{merge:true}`. NOT mirrored: per-user state, feedback, access_tiers, banners, siteCatalog/gameContent. |
| `js/syn-assignments.js` | Builds extra tile objects for admin-assigned TEMPLATE tiles (Trivia or Istoria/History to a class+subject). Pure read/transform. | Admins assign via admin-synthesis → persisted in SymStore (`template_assignments`) + mirrored by syn-hydrate. This shapes each into the same `g()`-tile object so `renderSubjectBlocks` merges them transparently. | `synAssignedTiles(classId, subjectId)`. history→`{fn:'openIstoria',args:[course\|\|'g3']}`; trivia→`{fn:'openTriviaPanel',…}`. Depends on `gameTile` forwarding `launch.args`. |
| `js/banner-bar.js` | Sticky announcement strip from live banner data, per-device dismissal + expiry filtering. | Ver1 had this inline in nav.js; synthesis has no nav.js → self-contained eager module. Three-tier priority (Firestore `banners` active → SymStore → bundled SEED) so it works offline/seeded/first-run. | `toMillis()` normalizes bare `YYYY-MM-DD` to `+T23:59:59` so the SymStore path doesn't hide a banner a day early. **CTA actions run via `new Function(action)()` — safe only because admins author them** (XSS vector if opened to other roles). Re-renders on `sym-lang-change`. |
| `js/live-arena.js` | Agora Live Arena engine: host flow (create/lobby/push/timer/results/leaderboard) + student flow (join by PIN/answer/score). Hierarchical dataset picker. | Real-time without a server: the arena state doc is the single source of truth; host+students subscribe via `onSnapshot`. `correctAns` is deliberately withheld from the pushed question and only written at `status='results'` so clients can't see answers early. A `const LiveArena` IIFE (NOT on window). | Both join + host require `currentUser` (rules need auth) → open auth modal if signed out. Host lobby diffs player chips ADDITIVELY (never clears) to avoid flicker. `?join=PIN` deep-link auto-opens the student screen. `_showScreen()` mounts/unmounts SymFlappy on lobbies only. |
| `js/live-arena-lobby.js` | Additive lobby extras: inline QR (redraws on PIN change via MutationObserver), avatar/banner upload, visual setting pills. | Separate + loaded AFTER core so the engine stays untouched. QR redraws via observer rather than push so it stays in sync regardless of how the PIN got set. | `window.LAX`. **Setting pills are visual-only** — they set `LAX.*` flags but the engine's `Q_DURATION` stays hardcoded at 25s. |
| `js/manifest/multiplayer-fb.js` | Manifest fragment registering `openLiveArena`, `openGoldenFleece`, `openHalieia`, `launchCustomHomework` (all `fb:true`). | LiveArena is a `const` not on window → `window.openLiveArena` is a wrapper that dereferences `LiveArena` only at CALL time. golden-fleece/halieia need the LA engine → its scripts PREPENDED to their js[]. `la-overlay` injected BEFORE the engine so inline onclicks + `_checkUrlJoin()` find their DOM. | `openLiveArena.eager:true` recorded for the `?join=` deep-link (collision note). golden-fleece/halieia self-register openers at game.js tail. |
| `games/naumachia/game.js` | Naumachia (Battleship) with an educational gate (answer before each shot). VS AI (local) + VS Player (Firestore via `naumachia_matches`). | PvP is serverless + **defender-authoritative**: each shot is written with `result:null`, and the DEFENDER's client evaluates the hit against its own private board + writes back result + next turn → keeps boards private while resolving deterministically. uid-gating added because rules require auth. | `_nauMatchmake` bails to menu + opens auth modal if not authed. Idempotency keys `_gotShot`/`_gotResult` dedupe snapshot re-deliveries. Matchmaking mounts SymFlappy. **Stale `waiting` docs aren't GC'd** (only `_nauCancelMM`, p1-only, deletes). |
| `js/flappy-slot.js` | `SymFlappy` — slot manager owning ONE shared card + ONE `<flappy-waiting-game>`, moved between active waiting screens. | Multiple waiting screens want the same mini-game, but only ONE rAF/AudioContext loop should run. Relocates the single card; leaving detaches it (`disconnectedCallback`→pause). No-op if `FlappyWaiting` missing. | `mount(slotEl)`/`unmount()`. Single instance is module-scoped — **callers MUST `unmount` on leave** (live-arena `_showScreen`, naumachia `_nauPhase`/`closeNaumachia` do). |
| `games/flappy/flappy-waiting-game.js` | Self-contained Flappy: Shadow-DOM `<flappy-waiting-game>` (canvas loop, WebAudio, particles, best-score) + overlay wrapper + `FlappyWaiting` API. | Style-isolated via Shadow DOM (no CSS bleed) + dependency-free (any framework). Self-pauses when detached + tears down (cancels rAF, removes keydown, closes AudioContext) so SymFlappy reclaims resources. Storage wrapped (sandboxed iframes throw). | Window-level keydown handler only acts while `self._active`. Loop schedules next rAF FIRST so a thrown frame can't freeze. `dt` clamped to 0.05s. Best/sound persisted via safe storage shim. |

**Dependencies.** Needs Firebase compat SDK initialized first (syn-hydrate polls up to 25×/400ms,
banner-bar guards on `firebase.apps.length`, live-arena/naumachia gate writes on `currentUser`), SymStore,
auth globals, bilingual `t()`/`siteLang`, the lazy-load shell, question/content sources
(QUESTIONS/OD_QUESTIONS/GRADES/GP_DATASETS + `_gpCanAccessTier`, `_gpNauPool`), optional QRCode +
`awardGameRewards`, and `window.FlappyWaiting` (prerequisite for SymFlappy). Depended on by: every
visitor's content view (syn-hydrate → SymStore at boot, then `symRender()` + `BannerBar.reload()`),
`renderSubjectBlocks` (merges `synAssignedTiles`), golden-fleece/halieia (reuse the LA engine), and the
`?join=PIN` / ⚡ Live entry points. Firestore collections: `config/adminMirror`, `banners`, `live_arenas`
(+players/answers), `naumachia_matches`.

---

### 2.8 Backend, rules & CSS (server + security + theming spine)

**Overview.** No app server — the entire backend is Firebase: Cloud Functions (Node 22) for anything a
client can't be trusted with (payments, role/claim management, validated config writes, GDPR, AI),
Firestore + Storage Rules as the runtime authorization layer (the app talks directly to Firestore for most
reads/writes, so **the Rules ARE the access-control boundary**), and a CSS design-token system driving the
~80-theme engine + seasonal FX. Unifying philosophy: anything granting entitlement, mutating other users,
validating cross-document invariants, or spending money/credits is funneled through an Admin-SDK Cloud
Function (which bypasses Rules), while Rules deny those same writes to clients (`write:false`) and the
public app reads world-readable docs.

| File | Role | Why written this way | Key gotchas |
| --- | --- | --- | --- |
| `functions/index.js` | All functions except TTS: PAYMENTS (Stripe/PayPal + `_grantProAccess` + `getPricing`), GUARDRAILS/ADMIN (RBAC claims, immutable audit, `setAdminRole`, `adminDeleteGuarded`, GDPR, `adminSaveConfig`/`Catalog`/`GameContent`/`HistoryContent`, scheduled `cleanupStaleArenas`), AI (gradeAnswer/askTutor/aiGraderStatus). | Server-side is the only place price/entitlement/nested invariants can be trusted. Prices looked up server-side so clients can't spoof. Entitlement written exclusively via `_grantProAccess`. `requireRole` default-DENIES unknown roles (fix for `if(!allowed\|\|allowed==='*')` falling OPEN). gradeAnswer/askTutor made auth-required as a denial-of-wallet guard. | **`_grantProAccess` is NOT idempotent** + `stripeWebhook` never dedupes → a webhook re-delivery re-grants pro + RE-EXTENDS `expiresAt` (double-extension on retry). `createStripeCheckout` uses `mode:'payment'` — NOT a recurring subscription. `config/{docId}` Rules only gate the domain — value invariants live ONLY in `adminSaveConfig`. |
| `functions/tts.js` | Standalone HTTPS `tts` (re-exported). Neural TTS at `/api/tts` → base64 mp3. | Same denial-of-wallet concern → verified ID token + per-user cap. Own file to deploy independently + isolate the heavy dep. 24h cache. | `runWith` 256MB/20s. `_ttsRateOk` 120/h on `grader_usage/tts_{uid}`. VOICE_MAP whitelist; text capped 600 chars; rate 0.5–1.5. Uses Google Cloud ADC, not ANTHROPIC_KEY. |
| `firestore.rules` | Runtime authorization for all client Firestore access. Role helpers + per-collection rules. | The app is a static SPA hitting Firestore directly → Rules are the real ACL. World-readable content so the student app renders Firestore-first w/ static fallback; sensitive infra (adminRoles/adminAudit/grader_usage) read-restricted + `write:false`. | Entitlement PIN: users self-update must keep role/plan/tier/classes/expiresAt/grantedBy/grantedAt UNCHANGED. `coupons` read finance-only (was public). `ai_corpus` text capped 480000 CHARS (Rules `.size()` counts chars, Greek = 2 bytes → 480k×2=960k < 1 MiB). `live_arenas` answersSubmitted bounded +1. `naumachia` requires auth. `custom_games` create forbids self-publish. **`can()` mirrors functions `ROLE_DOMAINS` — keep in lockstep.** |
| `storage.rules` | Cloud Storage auth: `/system_icons/{file}` (admin) + `/user_profiles/{uid}/{file}` (own avatar). Else deny. | Tiny typed CDN surface: admin-only brand icons vs self-only avatars. Public read because nav/leaderboards/cards display them. | `isAdmin()` = bootstrap email ONLY (Storage has no custom-claim plumbing). system_icons <2MB png/webp/svg; user_profiles <5MB png/webp (no svg). |
| `firestore.indexes.json` | Composite indexes: custom_games(creatorId,createdAt desc), three global_leaderboards combos, naumachia_matches(status,createdAt). | The exact multi-field queries the app issues that single-field indexes can't serve. Without them those queries throw FAILED_PRECONDITION at runtime. | naumachia matchmaking relies on `status==waiting` ordered by `createdAt asc`. |
| `firebase.json` | The deploy surface: firestore (rules+indexes), storage (rules), functions (source, nodejs22, predeploy npm install), hosting (public='.', SPA rewrite, `/api` rewrites, security + cache headers). | Single source of truth for deploy + routing. Rewrites map clean paths to functions then catch-all `**` → `/index.html`. JS/CSS/HTML get no-cache/must-revalidate so a deploy is instantly visible (this repo's cache-busting model — contrast the legacy `?v=N`/sw.js approach). | **Rewrite ORDER matters** — specific function rewrites must precede the `**` SPA catch-all or get swallowed. `hosting.ignore` excludes functions/node_modules/dotfiles/*.bat/etc. `runtime nodejs22` must match `functions/package.json` engines. |
| `css/tokens.css` | The theme-token system: ~80 `.theme-*` classes each set raw `--sym-*`; one `[class*='theme-']` block derives the semantic tokens (`--bg`/`--card`/`--fg`/`--terra`/`--gold`/…) + font tokens. `.has-accent` derives `--ca-*`. | Light-first, drop-in compatible with the prod theme engine: one class on `#sym-home` swaps the whole token tree; components read only DERIVED tokens (never raw `--sym-*`) → adding a theme = ~14 vars. Hairlines/tints via `color-mix` so they self-adapt light↔dark. | Every theme MUST set raw `--sym-*` (derived layer assumes they exist). `.theme-amphora` has a duplicate `--sym-terra` line (first overridden). Font tokens live in `[class*='theme-']` so body-level popups carrying only a theme class still get classical type. **There is NO `seasons.css`** — seasonal FX live in shell.css + js/seasons.js. |
| `css/shell.css` | Prototype harness chrome + cross-cutting overlays: `.stage` wrapper, custom cursor (`#symc-ring`/`#symc-glyph`), SymLoader overlay, theme-menu locked/seasonal styling, seasonal-FX layer (`.season-fx`/`.season-p`/keyframes). | `.harness` is `display:none` in prod (theme/colour moved into nav) but still BUILDS for admins so `symApplyTheme` stays defined. `.stage` transitions background .35s so theme switches animate. Cursor/FX force-suppressed under `body.syn-game-open` so a game overlay's controls stay usable. | **GOTCHA line 190: a corrupted rule** — `…color:var(--terra);}8s cubic-bezier(…)` has stray text after a closing brace. Malformed but inert; clean when next editing the cursor block. `prefers-reduced-motion` disables season-fx. |

**Dependencies.** Needs a Firebase project on **Blaze** (scheduled `cleanupStaleArenas` + outbound fetch to
Stripe/PayPal/Anthropic/Google TTS), Node 22 (firebase.json + package.json must agree), secrets
(stripe.secret_key/webhook_secret + app.url, paypal.*, `ANTHROPIC_KEY`/`ANTHROPIC_MODEL` via `.env`/Secret
Manager), Cloud TTS API + dep, a registered Stripe webhook → `/stripeWebhook`, provisioned custom claims
via `setAdminRole` (acting admin must force-refresh their token), and deployed composite indexes. The
entire static front-end depends on it; the CSS token system is consumed by every component CSS (reading
`--bg`/`--fg`/`--terra`/… never raw `--sym-*`) and by js/seasons.js + js/cursors.js. Deploy is driven
entirely by `firebase.json`.

---

## 3. Cross-cutting concerns

### Persistence model
Three coexisting layers, offline-first:
- **SymStore (localStorage, `sym_revamp_` ns)** — the always-available source of truth in the sandbox.
  `set()` dispatches a same-tab `sym-store` CustomEvent; cross-tab uses the native `storage` event.
- **Guarded Firestore mirror** — every admin save also attempts a `{merge:true}` write behind `fsReady()`
  + try/catch + `.catch(noop)`. Failures are **silent** — a "successful" UI save may have hit only
  localStorage. `syn-hydrate.js` consolidates the public admin-content keys into `config/adminMirror`
  (hydrated for every visitor at boot); `content-source.js` hydrates catalog/game content; `SymTiers`
  hydrates custom tiers; banners use their own collection.
- **Cloud Functions callables** — the only path for entitlement, validated config/catalog/content writes,
  AI, and money. The Admin SDK bypasses Rules.

> **Known seams:** plan/expiry is WRITTEN to `users/{uid}` by Functions but READ from `classrooms/{uid}`
> by the billing card; `access` is written to `config/access` (admin.js/Class Plan) vs `config/accessControl`
> (admin-synthesis matrix). Two season-persistence keys exist (`symposion_season` vs `sym_revamp_`).

### Security / rules model
The app talks directly to Firestore, so **Rules ARE the ACL**. Pattern: world-readable content (so the
student app renders Firestore-first with static fallback) + entitlement/admin-infra fields locked
(`write:false`, written only via Admin-SDK callables that validate invariants Rules can't express). The
load-bearing anti-fraud control is the users self-update PIN forbidding clients from changing
role/plan/tier/classes/expiresAt/grantedBy/grantedAt. **Two role systems share the word "role":** app role
(`users/{uid}.role` ∈ free/student/teacher) vs admin custom claim (`role` ∈ super/content/support/finance).
Bootstrap super `dimikamou@gmail.com` is hard-coded in **four places** (auth.js, functions, firestore.rules,
storage.rules) — changing the owner means editing all four. `ROLE_DOMAINS` (functions) and `can()` (rules)
are duplicated definitions that can drift. The client gate (`_gpCanAccessTier`) is **purely cosmetic** —
the genuine server-side content paywall is deferred.

### Theming
One class on `#sym-home` swaps the entire `--sym-*` token tree (css/tokens.css). Components read only the
**derived** semantic tokens, so adding a theme is ~14 vars. Body-mounted game overlays live OUTSIDE the
themed shell, so **js/cursors.js is the only thing bridging theme tokens into them** (via
`symApplyThemeClass`). Seasonal FX is split across tokens.css (`.theme-<season>` palettes) + shell.css
(`.season-fx` layer) + js/seasons.js (particle engine) — there is **no seasons.css**.

### Cache-busting (`?v=N`)
Per project memory: changed JS/CSS MUST bump `?v=N` or the service worker / HTTP cache serves stale forever.
Several files carry `?v=` in index.html. **Note the divergence:** `firebase.json` hosting headers set
no-cache/must-revalidate on js|css|html so a deploy is instantly visible — the modern model — while the
legacy `?v=N` + sw.js approach is also present. New edits should follow the cache strategy active for that
file.

### Deploy surface
Everything ships via `firebase.json`: `firebase deploy` or scoped `--only hosting|functions|firestore`.
Hosting serves the static SPA (`public='.'`), rewrites `/stripeWebhook`/`/api/gradeAnswer`/`/api/tts` to
functions (BEFORE the `**`→`/index.html` catch-all), and applies security headers. Functions deploy from
`functions/` on Node 22 with a `npm --prefix functions install` predeploy. Requires the Blaze plan.

---

## 4. Known design debts / deferred

- **No expiry enforcement.** `demoteExpiredSubscriptions` is named in intent but **not implemented
  anywhere**. An expired user keeps their elevated `role` (hence access) until an admin manually changes it.
- **Runtime gate ignores `plan`/`expiresAt`.** `_gpCanAccessTier` reads only `currentUserRole`. Paid access
  works only because `_grantProAccess` co-writes `role` alongside `plan`. A grant setting `plan:'pro'` but
  leaving `role` unchanged would NOT unlock content.
- **Client gate is cosmetic.** `config`/`siteCatalog`/`gameContent` are world-readable in Rules, so paid
  content bytes are downloadable with devtools. The genuine **server-side content paywall is deferred**.
- **Stripe/PayPal inert.** Fully coded but switched off until config is set; `mode:'payment'` is one-time,
  not a recurring subscription. **`adminGrantAccess` is the only live grant path.** `_grantProAccess` is not
  idempotent → webhook re-delivery double-extends expiry.
- **GP-content → `window.<XX>_Q` bridge not wired.** Self-contained engine games (heptapylos, naumachia,
  pvp/engines packs) de-facto run on the shared `SYM_QUESTIONS` fallback regardless of which GP dataset an
  admin selects. Choosing a dataset doesn't yet change the questions.
- **Paradigm content non-deliverable through Site Studio.** Per-game `data.js` shapes don't match the
  Studio paradigm doc, so paradigm tiles are surfaced non-editable; editing one saves a doc that never
  reaches the game.
- **Access Control matrix authors but doesn't gate.** The per-class/game/level config is persisted
  (`config/accessControl`) but the runtime tier/level gate is explicitly NOT wired (future work). Two
  access models sit behind one rail button (`config/access` Class Plan vs the matrix).
- **Live Arena lobby setting pills are visual-only** — `LAX.timerSeconds` etc. don't drive the engine's
  hardcoded `Q_DURATION` (25s).
- **Stale multiplayer docs aren't garbage-collected.** Naumachia leaves orphan `status=='waiting'` docs if
  a host abandons matchmaking without Cancel; only the p1-only `_nauCancelMM` deletes them.
- **Dead/shadowed code retained for side effects.** `js/loader.js`'s `SymLoader` (inline spinner) and
  `js/syn-admin.js`'s own `SYM_SCREENS.admin` are dead, but their other side effects are load-bearing —
  don't delete them.
- **Duplicated definitions that can drift.** `ROLE_DOMAINS` (functions) vs `can()` (rules); the three nav
  source lists (`DEEPLINK` / `NAV_GROUPS` / legacy `SCREENS`); the bootstrap email in four files.
- **Known malformed-but-inert artifacts.** shell.css line 190 corrupted rule; data.js ~line 775 stray
  backslash inside the `LEVEL_BANK` object literal — verify both parse when next editing.
