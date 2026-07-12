# Audit — Latin PR #72 (Λατινικά · Κείμενα) + recent-PR application review

**Scope:** how the last 15 PRs were applied to the site, and a deep debug / mock-test /
security pass on the "Latin one" — PR #72.
**Method:** static + schema validation · headless-Chromium mock tests · a 34-agent
adversarial review (25 raw findings → 18 confirmed, 7 rejected), each finding re-verified
against source. Latin-grammar (content) findings are flagged for subject-expert sign-off;
code, wiring and security findings were reproduced.

**Verdict:** the Latin panel is functionally sound and secure client-side, but **PR #72 is
still an open draft merged into no branch** — as are the six other newest PRs. The two
findings that matter most are outside the panel: a Firestore rule that lets any signed-in
user self-grant "Pro", and one content bug — Ενότητα 26 ships the text of Ενότητα 27.

---

## 1 · How the last 15 PRs were applied

Default branch = `claude/chat-remote-disconnect-uedp66` (integration, HEAD 19 Jun).
`main` is a strict superset — **162 commits ahead**, containing everything the default
branch has. Merged content PRs land on `main`; the newest game PRs target the integration
branch and have **not** been merged anywhere. Last real deploy of new work: PRs #70/#71 →
`main`, 7 Jul.

| PR | Title | State | Base | Applied |
|----|-------|-------|------|---------|
| #77 | Mobile-usability fixes | open | integration | no |
| #76 | Αγία Σοφία 537 — 3D museum | open | main | no |
| #75 | Ιστορία Άτλας — history units | open | integration | no |
| #74 | Έκθεση & Λογοτεχνία theory enrich | open | main | no |
| **#72** | **Λατινικά · Κείμενα (the Latin one) — draft** | **open** | **integration** | **no** |
| #73 | Greek Chronicles trilogy | open | main | no |
| #69 | Teacher Agent — AI authoring | open | integration | no |
| #71 | Admin edit coverage + mobile | merged | main | ✅ main |
| #70 | Home UI polish | merged | main | ✅ main |
| #68 | Gitignore functions/.env (secret) | closed | main | ✗ unmerged |
| #67 | Διδαγμένο + Συντακτικό + Αδίδακτο | merged | main | ✅ main |
| #66 | Γραμματική — admins add lessons | merged | main | ✅ main |
| #65 | Διδαγμένο port (supersedes #59) | closed | main | ✗ unmerged |
| #61 | Backfill 2020/2021 past exams | merged | main | ✅ main |
| #59 | Διδαγμένο module (superseded) | closed | main | ✗ unmerged |

**5 merged · 7 open · 3 closed-unmerged.** #68 (gitignore the ANTHROPIC-key `.env`) was
closed unmerged — the `.gitignore` still has no `.env` rule (§4).

---

## 2 · The Latin panel — mock tests

PR #72 grew well past its title: a self-contained React 18 panel (vendored React & fonts,
precompiled JSX, overlay iframe) covering **Ενότητες 16–50 + Εισαγωγή**, 108 files,
+16,524 lines. Each unit regenerates 7–9 parts.

| Check | Result |
|-------|--------|
| Unit files `node --check` | 35/35 ✓ |
| Schema validation | 0 err · 10 warn |
| Published units mount (headless) | 33/33 ✓, **0 real console errors** |
| Parts render / practice mode | 7–9 each ✓ / all start ✓ |
| Εισαγωγή chapter | renders ✓ |
| XSS via poisoned cache | escaped, no execution |
| Malformed cache JSON | graceful fallback |
| HTML sinks / `eval` in `panel.js` | 0 / 0 |
| Dynamic unit import | `parseInt`-guarded |
| Compiled `panel.js` vs source | matches |

`unit28.js` / `unit30.js` are empty stubs, but wired to no tile/opener → unreachable
(blank panel, no crash). Dead weight, not a defect.

---

## 3 · Findings — the panel & its content

### HIGH — Ενότητα 26 ships the text of Ενότητα 27  · `units/unit26.js` · content
`unit26.js` ("Lectio XXVI") carries the same Accius/Pacuvius passage as `unit27.js` — both
tiles even titled *"Το πνεύμα ωριμάζει όπως… οι καρποί."* The two files then disagree on
identical tokens (`quidem`: "βεβαιωτικό μόριο" vs "τροπικό επίρρημα"; lemma of `multo`).
Students opening Ενότητα 26 get Lectio 27; the real Lectio XXVI is absent.
**Fix:** replace `unit26.js` with the real Lectio XXVI (or drop the tile) and reconcile the analyses.

### MED — Εισαγωγή tile is dead (opener never registered)  · `js/manifest/latin-texts.js:14` · functional, in-scope
The manifest registers `SYN_GAMES['openLatinText'+n]` for every unit but never
`openLatinIntro`. Both `screens.js:70` and `synLaunch()` bail when `SYN_GAMES[fn]` is
missing, so the "Εισαγωγή" tile does nothing (console: *"no manifest entry"*). Verified
against the launch path. **Fix (1 line):** `G['openLatinIntro'] = entry;`

### MED — one missing array field blanks the whole panel  · `app/panel.jsx:383–413` · robustness
`renderVals()` reads seven parts as `(ready?u.nouns:[]).map(…)` — the ternary only guards a
null `u`. A unit missing `verbs`/`nouns`/`alignment` throws inside `render()` (no error
boundary) → white screen. Current data is clean; latent. **Fix:** `Array.isArray(...)?...:[]`
(mirror the existing `transforms`/`etymology` guard) and default nested arrays.

### LOW — admin mode restores from a plain localStorage flag  · `app/panel.jsx:124,200` · client-security (known)
`localStorage.latinAdmin='1'` unlocks teacher/edit mode on reload with no PIN prompt
(confirmed live). Impact contained: edits persist only to the local browser + export a
`.js` file — nothing server-side. PR already flags the PIN as a placeholder.
**Fix:** swap for the authenticated teacher session before launch (as planned).

### LOW — pinned word-popup doesn't follow text on scroll  · `app/panel.jsx:285,443` · UX
A click-pinned analysis card is `position:fixed` at captured coordinates; scrolling strands
it over unrelated text. **Fix:** reposition on scroll or auto-unpin.

### Content nits flagged for the teacher (7 more, low)
Grammar judgments for a subject expert to confirm — the PR is explicitly "awaiting teacher
sign-off," so treat as a punch-list, not gospel:
`deprensi`→`deprendi` (u19) · `quodam`/`nocte` gender mismatch (u38) · wrong SOS period ref
(u43) · `stabilis` attachment (u44) · `nolo` derivation shown two ways (u47) ·
`introrumpo` prefix (u48) · `pater` lemma (u50). The highest-confidence are the ones where
a unit contradicts *itself* across two tabs.

---

## 4 · Security — where the real risk lives

The Latin PR adds no backend; its own surface is clean. These are **pre-existing** in the
surrounding app, surfaced because a security pass was requested.

### HIGH — any signed-in user can self-grant "Pro"  · `firestore.rules:75`
The `users/{uid}` self-update rule pins only `role`, leaving `plan`, `expiresAt`, `classes`
(the fields the Stripe webhook writes) unconstrained. A free user can `setDoc(merge)` their
doc `plan:'pro'` + all classes + future expiry and be treated as paid. *Mitigant:* paid
content is world-readable anyway, so this forges client-trusted entitlement/billing UI, not
protected data. **Fix:** pin the entitlement fields (or Admin-SDK-only) and gate Pro off a
custom claim.

### MED — `config/*` (incl. pricing) directly client-writable  · `firestore.rules:179`
`allow write: if can('subs') || can('content')` lets those roles write `config/pricing`
from the client, bypassing `adminSaveConfig` validation (€0 plans, price caps, coupon
bounds). **Fix:** `allow write: if false`; route through the Cloud Function (as
`siteCatalog`/`gameContent` already do).

### MED — `gradeAnswer` is an open, unauthenticated Anthropic proxy  · `functions/index.js:1016`
`onRequest` + `Access-Control-Allow-Origin:*` + no auth/App Check/rate-limit forwards any
POST to Claude using the server `ANTHROPIC_KEY`. Anyone with the URL can burn token quota.
**Fix:** require Auth/App Check, tighten CORS to the site origin, add rate limiting.

### Secrets
No real secret committed (`functions/.env.example` is a placeholder; `firebase-config.js`
apiKey is public-by-design). **Gap:** `.gitignore` has no `.env` rule (what closed PR #68
meant to add) — nothing prevents a future accidental commit of the real key.

Backend that checks out: super-admin email gate ✓ · Stripe callables auth-gated ✓ ·
webhook signature verified ✓ · `adminGrantAccess` server-checked ✓.

---

## 5 · Recommendations

1. **Before merging #72:** apply the 1-line Εισαγωγή-tile fix, add the `renderVals` array
   guards, remove the two empty stub units.
2. **Fix Ενότητα 26** — the duplicate-of-27 is the one content issue students will notice.
3. **Prioritise the Firestore rules** (§4) — independent of this PR, affects live billing
   now. Pin entitlement fields; lock `config/*`.
4. **Close PR #68's gaps** — gitignore `.env`; put `gradeAnswer` behind auth + tight CORS.
5. **Branch hygiene** — `main` is 162 commits ahead of the default branch yet PRs still
   target the older integration branch; decide which is canonical.
