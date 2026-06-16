# SymposiON — Handoff (changes from this session)

**Date:** 2026-06-16
**Base app:** `home-revamp/Home Revamp.html` (vanilla JS, token-driven "Synthesis" design system)

This package contains every file created or modified in this work session, at the **same relative paths** they live in the project. Copy them over the existing tree (or apply as a patch) to reproduce the work. Nothing here depends on a build step — they're plain JS/CSS/HTML loaded by `Home Revamp.html`.

---

## How to apply

1. Copy the contents of `files/` into the project root, preserving paths:
   - `files/home-revamp/...` → `home-revamp/...`
   - `files/images/...` → `images/...`
   - `files/email-automation/...` → `email-automation/...`
2. No dependency install needed. Open `home-revamp/Home Revamp.html`.
3. Reset local state to see first-run flows: in DevTools console run
   `Object.keys(localStorage).filter(k=>k.startsWith('sym_revamp_')).forEach(k=>localStorage.removeItem(k))` then reload.

---

## What changed — by feature

### 1. Mobile responsiveness (was desktop-only, overflowed site-wide)
- **`home-revamp/css/synthesis.css`** — nav now collapses to a hamburger **drawer** ≤940px (links/launcher/actions move into it); Home hero columns stack and fit (`min-width:0` to stop grid blow-out); the "Screens" mega-menu becomes an in-drawer 2-col sheet instead of running off-screen; class-chip groups no longer force horizontal scroll; tap-target + min-font bumps.
- **`home-revamp/js/dir-synthesis.js`** — nav markup refactored into a `.syn-nav__cluster` + animated `.syn-burger` toggle (`display:contents` on desktop keeps the original bar untouched).
- **`home-revamp/Home Revamp.html`** — cleared a stray `<style id="__om-edit-overrides">` block that hardcoded `.syn-spec`/`.syn-cgroups` pixel widths and broke mobile.

### 2. First-visit onboarding + Guide (assistant) mode  — NEW `home-revamp/js/student.js`, `home-revamp/css/student.css`
- **Onboarding overlay** (`SymOnboard`): role pick (Student / Teacher / Parent) → grade placement (Γυμνάσιο/Λύκειο, real class accents) or link-child → finish. Persisted (`onboarded`), shows once, has Skip. Routes student→home, teacher→`anathesi`, parent→`parent`.
- **Guide mode** (`SymGuide`): per-screen contextual tips; off by default; toggle persists (`guide_mode`). Surfaced as the **nav philosopher avatar** (see #6) + a mobile FAB.

### 3. Student homework inbox — `SYM_SCREENS.assignments` (in `student.js`)
- Mirrors the teacher Ανάθεση data from the student side: due-soon/completed/streak stats, filter chips, per-assignment cards with progress + relative due dates, "Ξεκίνα →" opens the matching game preview & awards Kleos, empty state. Registered in the nav launcher + deeplinks.

### 4. Parent role + dashboard — `SYM_SCREENS.parent` (in `student.js`)
- Linked-child header, stats, color-coded mastery bars, read-only homework list with "Remind" nudge, recent activity, billing/subscription card. Registered in launcher + deeplinks.

### 5. Consent / age-gate / cookies — NEW `home-revamp/js/consent.js`
- `SymConsent`: cookie banner on boot; **GDPR age-gate now runs on Sign-up only** (`SymConsent.requireConsent(cb)`), not on every first visit. Age question → Terms/Privacy acceptance.
- **Parental-consent (guardian) step REMOVED** per request — all ages go straight to Terms acceptance. ⚠️ See "Open items" below.
- Terms / Privacy / Cookie modals; linked from a new footer "Legal" column (in `dir-synthesis.js`). Legal copy is **placeholder** — replace with counsel-approved text.

### 6. Instructor / Guide avatar in nav  (`dir-synthesis.js` + `student.js` + `student.css`)
- Distinct **philosopher** avatar (NEW `images/illustrations/philosopher.svg`) with status dot.
- **Hover** = popover with the current screen's detailed instructions **and** a "what is this?" orientation over the site's 5 main parts. **Click** = toggle Guide on/off (glows + pulses when on). Floating FAB hidden on desktop (avatar is the toggle), kept on mobile.

### 7. System layer — NEW `home-revamp/js/system.js`, `home-revamp/css/system.css`
- **Notifications**: nav bell + unread badge + dropdown (deep-links, mark-read, mark-all; persists `notif_read`).
- **Global search**: nav icon + overlay across games / tags / screens, accent-insensitive.
- **Offline banner** (online/offline events), **404** (`SYM_SCREENS.notfound`, also the dispatcher fallback for unknown screens), **error** screen, and a reusable `window.symEmptyState({...})` helper.

### 8. Settings + checkout/redeem — NEW `home-revamp/js/settings.js` (styles in `system.css`)
- `SYM_SCREENS.settings`: language, larger-text/high-contrast, notification toggles, reduce-motion + sound/music, account/data links. Persisted under `pref_*`.
- `SYM_SCREENS.checkout`: monthly/yearly cycle, **redeem-code** field (`ΠΑΙΔΕΙΑ50`, `SCHOOL25`, `WELCOME`), mock card form, live order-summary with discount math, "Welcome to Pro!" success that sets `plan=pro`.

### 9. Seasonal cursor effects + cursor-cosmetic sync  (`mouse-fx.js`, `screens-2.js`)
- **Mouse FX**: added Easter eggs, Pumpkins, Carnival masks, Autumn leaves alongside snow/confetti.
- **Agora cursor slot** split into **Shape** + **Icon**, sharing the theme-panel cursor system's keys (`cursor_shape/icon`, `own_cursor_*`) so unlocks/equips sync across both surfaces; renders real cursor SVG previews.

### 10. Theme-token fix  (`home-revamp/css/tokens.css`)
- Font tokens (`--disp` Oswald, `--serif` Alegreya, `--sans` Montserrat) now defined on `[class*="theme-"]` so body-level popups (onboarding, consent, guide, search, notifications, banners) inherit the classical type instead of falling back to Montserrat. `.dir-*` still overrides for the main app.
- `app.js` adds `window.symThemeClass()` / `symApplyThemeClass(node)` helpers; all body-level popups stamp the active theme class so color tokens resolve.

### 11. Email automation spec — NEW `email-automation/Email Automation.html`
- Standalone artifact (not part of the app). Trigger map (account / subscription / engagement) + 5 branded 600px templates (Welcome, Parental consent, Pro+receipt, Cancellation, Newsletter) with `{{merge}}` tags.
- **Admin mode** (top-right toggle): inline-edit **all** banner + subject + body + footer text (persists `symEmailBannerText`, with Reset), and a per-letter **routing dropdown** to choose which trigger fires each letter (persists `symEmailRouting`).

---

## Files in this package
```
home-revamp/Home Revamp.html        (modified)
home-revamp/css/synthesis.css       (modified)
home-revamp/css/tokens.css          (modified)
home-revamp/css/student.css         (new)
home-revamp/css/system.css          (new)
home-revamp/js/app.js               (modified)
home-revamp/js/dir-synthesis.js     (modified)
home-revamp/js/screens-2.js         (modified)
home-revamp/js/mouse-fx.js          (modified)
home-revamp/js/student.js           (new)
home-revamp/js/consent.js           (new)
home-revamp/js/system.js            (new)
home-revamp/js/settings.js          (new)
images/illustrations/philosopher.svg (new)
email-automation/Email Automation.html (new)
```

## Open items / decisions for the team
- **GDPR:** guardian-consent step was removed, but Terms/Privacy copy + the M2 "Parental consent" email still reference under-15 parental consent. Reconcile these (re-add the step, or update copy + retire M2).
- **Legal copy** in consent modals + emails is placeholder — replace with approved text.
- **Email templates** not yet rendered in full: payment-failed (dunning), verify-email, password-reset (present in the trigger map only).
- Dimitris's comment "modify this only when the AI is purchased/unlocked" is unresolved — no AI add-on exists in the build yet.
