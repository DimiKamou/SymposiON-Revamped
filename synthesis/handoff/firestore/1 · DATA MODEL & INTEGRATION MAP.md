════════════════════════════════════════════════════════════════════
 SymposiON — FIRESTORE / STORAGE / AUTH · Production Handoff
 Wires every prototype built this cycle to live data.
 Apply files in numbered order. Est. 3–5 days (data layer + rules +
 a handful of Cloud Functions; the UIs already exist as approved
 prototypes in the project root).
════════════════════════════════════════════════════════════════════

WHAT THIS IS
------------
The new student / parent / admin / system screens currently run on
localStorage + in-memory mock data so they demo standalone. This
handoff maps each one to Firestore, Cloud Storage and Firebase Auth,
REUSING the collections the app already has (`users`, `classrooms`,
`teacher_reports`, `custom_games`, `assignments`) and adding only what
is genuinely new.

  Screens covered (root .html files):
   • Mastery & Daily Practice          → mastery map + adaptive queue
   • Daily Streak & Goal               → streak + daily goal
   • Αδίδακτο Workspace                 → corpus read + attempts
   • Panhellenic Exam Simulator        → exams + AI grading
   • Admin · Unseen Corpus             → corpus (global, admin)
   • Admin · Narration Studio          → narration manifest + Storage
   • Polytonic Keyboard & Audio / Iris → user a11y prefs + narration
   • Global Leaderboards               → aggregated kleos (Function)
   • Notifications & Reminders         → notifications + FCM triggers
   • Admin · Game Analytics            → telemetry rollups
   • Parent View Profile               → derived reads (no new writes)
   • Subscriptions / pricing           → Stripe → users.tier

FILES, IN ORDER
---------------
 1 · DATA MODEL & INTEGRATION MAP.md   ← READ FIRST (this folder).
 2 · firestore.rules.additions.txt     — security-rule blocks to merge.
 3 · firestore.indexes.additions.json  — composite indexes to merge.
 4 · functions/                        — Cloud Functions (tts already
     shipped in /firebase/functions; add reminders, leaderboard,
     gradeExam, stripeWebhook).
 5 · Claude Code Prompt.txt            — paste-ready wiring prompt.

PRINCIPLE
---------
Do NOT ship the mock data. Every `localStorage` key and every in-file
`const SEED/MOCK` array exists only so the prototype runs offline.
Each is listed below with its live replacement.

────────────────────────────────────────────────────────────────────
 A. AUTH & THE `users` DOC (the spine)
────────────────────────────────────────────────────────────────────
Firebase Auth (email/password + Google) already gates the app. Extend
the existing `users/{uid}` doc — most new screens read from it:

```js
users/{uid} = {
  // —— existing ——
  email, displayName, role: 'student'|'teacher'|'admin',
  tier: 'free'|'student'|'family',        // ← Stripe-driven (§K)

  // —— add for the new screens ——
  grade:    'lyk-b',        // GRADES key — leaderboard & exam scoping
  track:    'theoretical',  // κατεύθυνση — leaderboard fairness filter
  locale:   'el'|'en',
  guardianEmail: 'g@x.gr',  // parent reports / account recovery

  kleos:       6840,        // lifetime score (economy)
  level:       10,
  dailyGoalXp: 30,          // Daily Streak picker
  fcmTokens:   ['…'],       // push targets (one per device)

  streak: { current: 12, best: 21, lastActive: 'YYYY-MM-DD',
            freezes: 2, freezePeriod: 'YYYY-MM' },

  a11y: { /* Iris — mirror of localStorage 'symposion.a11y.v2' */
          scale:1, contrast:false, dyslexia:false, guide:false,
          cursor:false, links:false, motion:false, focus:false },
}
```

Role/tier gating reuses the existing helpers (`_gpCanAccessTier()`,
nav.js role logic). Prefer **custom claims** (`role`, `tier`) set by a
Function on user write, so rules don't pay a `get()` per check.

────────────────────────────────────────────────────────────────────
 B. PROTOTYPE → LIVE MAPPING (per screen)
────────────────────────────────────────────────────────────────────
| Prototype (mock)                         | Live source | Notes |
|------------------------------------------|-------------|-------|
| **Iris** `localStorage['symposion.a11y.v2']` | `users/{uid}.a11y` | Read on login, write debounced on change. localStorage stays as the offline cache/source of truth; sync up when online. |
| **Daily Streak** in-file `WEEK`,`MILES`  | `users/{uid}.streak` + derived | `current/best/lastActive/freezes` live on the user doc. Streak increments via the game-end hook (§E), not the client. Milestones are static config. |
| **Mastery** in-file `MASTERY`,`MIS`,`SREP` | `users/{uid}/mastery/{conceptId}` subcollection | One doc per concept: `{score, attempts, lastSeen, due}`. The map view reads the subcollection; the "weak spots" + Tartarus strip are a `where('score','<',55)` query. Reuses `teacher_reports` mistake data (don't double-store). |
| **Adaptive queue** in-file `QUEUE`       | Derived (Function or client) | Build daily from: mastery docs `score<55` (weakest first) + spaced-rep `due<=today` + open `assignments`. Cache the day's queue in `users/{uid}/daily/{YYYY-MM-DD}` so it's stable across reloads. |
| **Spaced repetition** `SREP`             | `users/{uid}/srs/{cardId}` | SM-2 style: `{ease, interval, due, reps}`. Due cards feed the queue. |
| **Unseen Corpus** `localStorage['sym_corpus_v1']` + `SEED` | `corpus/{id}` (global, admin-write) | Schema §C. Admin Studio writes; student Αδίδακτο + Exam read. |
| **Αδίδακτο attempts** (textarea values)  | `users/{uid}/adidaktoAttempts/{id}` | `{corpusId, translation, selfRating, comprehension[], at}`. Optional — only if you want to grade/track unseen practice. |
| **Exam** `localStorage['sym_exam_v1']`, `PAPER` | `exams/{eid}` (§D) | Answers, timer, AI grade. |
| **Narration** `localStorage['symposion.narration.v1']` | `narration/{id}` + Storage (§F) | Audio in Storage, metadata in Firestore. |
| **Leaderboards** in-file `GREEKNAMES`/`genData` | `leaderboards/{scope}/{grade_track}` (§G) | Aggregated by a scheduled Function — never client-computed. |
| **Notifications** in-file `NOTIFS`       | `users/{uid}/notifications/{nid}` (§H) | Written by triggers; client only reads + marks read. |
| **Game Analytics** in-file `GAMES`/`MODES` | `analytics_daily/{YYYY-MM-DD}` rollups (§I) | Raw events → daily aggregate via Function. Admin reads aggregates only. |
| **Parent View Profile** all mock         | Derived reads — NO new collection | Parent (guardianEmail match or `guardians/{uid}` link) reads child's `users` doc + `assignments` progress + `analytics`. Read-only rules. |

────────────────────────────────────────────────────────────────────
 C. NEW collection: `corpus` (unseen texts — global, admin-managed)
────────────────────────────────────────────────────────────────────
```js
corpus/{id} = {
  author:  'Λυσίας',
  work:    'Ὑπὲρ Μαντιθέου',
  genre:   'Ρητορική',
  diff:    3,                       // 1–5
  text:    'ἐγὼ γὰρ οὕτω…',          // polytonic, NFC
  words:   28,
  source:  { type:'link'|'upload', ref:'perseus.tufts.edu'|'file.pdf' },
  uploadPath: 'corpus/{id}/source.pdf' | null,   // Storage, if uploaded
  usedInExams: 6,                   // increment when an exam picks it
  createdBy: '<adminUid>', createdAt: serverTimestamp(),
}
```
Replaces `localStorage['sym_corpus_v1']`. The Exam generator picks from
here (was `CORPUS_SEED`); the Narration Studio merges these in (was
`mergeCorpus()`). Keep the exact field names — both prototypes already
use them.

────────────────────────────────────────────────────────────────────
 D. NEW collection: `exams`
────────────────────────────────────────────────────────────────────
```js
exams/{eid} = {
  uid:        '<student>',
  createdAt:  serverTimestamp(),
  status:     'in-progress'|'submitted'|'graded',
  durationSec: 10800,            // 3h
  timeLeftSec: 7402,             // replaces localStorage __time
  corpusId:   '<corpus id>',     // the αδίδακτο used
  paper: {                       // generated structure (didagmeno + adidakto)
    didagmeno: { src, cap, qs:[…] },
    adidakto:  { author, src, cap, qs:[…] },   // qs from gradeExam Fn / cache
  },
  answers:    { 'q0':'…', 'q5-…':'…' },   // replaces sym_exam_v1 keys
  flags:      ['q3'],
  grade: {                       // written by gradeExam Function (§J)
    total: 78, max: 100,
    perQuestion: [{ no:'Α1.', score:8, max:10, note:'…' }],
    model: 'claude-…', gradedAt: serverTimestamp(),
    disclaimer: true,            // AI-grading caveat shown in UI
  },
}
```
The αδίδακτο question generation + grading run server-side (§J) with
YOUR key — the prototype's `window.claude.complete` is demo-only.

────────────────────────────────────────────────────────────────────
 E. Game-end hook (one helper, many screens)
────────────────────────────────────────────────────────────────────
On every game/quiz completion the existing end-of-game path already
fires once. Extend it to a single transaction that updates:
  • `users/{uid}.kleos += earned`, `level` recompute
  • `users/{uid}.streak` (if first play today → current++, set
    lastActive; if a day was missed → consume a freeze or reset)
  • `users/{uid}/mastery/{concept}` for each concept touched
    (score EMA, attempts++, lastSeen) — derived from the question bank
  • `assignments/{aid}.progress[email]` IF launched from `?assign=`
    (already specified in handoff-anathesi §B)
  • append a `kleos_events` row for leaderboard aggregation (§G)
Keep it ONE batched write so a closed tab can't half-update.

────────────────────────────────────────────────────────────────────
 F. Narration → Cloud Storage  (Admin · Narration Studio)
────────────────────────────────────────────────────────────────────
Audio must NOT live in Firestore (the prototype's data-URLs are a
localStorage stopgap — `symposion.narration.v1`). Use Storage:

```
Storage:  narration/{id}/{source}.mp3      // source: prerender|record|upload
Firestore: narration/{id} = {
  corpusId | seedKey,       // links to corpus/{id} or a fixed lesson key
  textHash,                 // NFC-normalized text hash → Iris match key
  audio: { type:'prerender'|'record'|'upload',
           path:'narration/{id}/prerender.mp3',
           url:'<download URL>', voice:'el-GR-Wavenet-A', durSec:12 },
  createdBy, createdAt,
}
```
• **Pre-render** → calls the `tts` Function (already in
  /firebase/functions/tts.js), uploads the returned MP3 to Storage,
  writes the doc.
• **Record** → MediaRecorder Blob → `uploadBytes` → doc.
• **Upload** → file → `uploadBytes` → doc.
• **Iris read-aloud** consults `narration` by `textHash` FIRST
  (perfect, cached clip) before the live `tts` Function before the
  browser voice — the 3-tier chain the prototype already implements;
  swap its localStorage lookup for a `where('textHash','==',h)` query
  (or cache the manifest doc-set on load).

Storage rules: narration read = any signed-in user; write = admin only.

────────────────────────────────────────────────────────────────────
 G. Leaderboards — aggregated, never client-computed
────────────────────────────────────────────────────────────────────
```
kleos_events/{auto} = { uid, grade, track, delta, at }   // append-only (§E)
leaderboards/{scope}/{grade_track} = {                    // scope: week|month|all
  updatedAt, rows: [{ uid, name, title, pts, streak }... top 500 ],
}
```
A **scheduled Function** (hourly) sums `kleos_events` per
`grade+track`, writes the ranked `rows`. The client reads the single
`leaderboards/{scope}/{gradeKey}` doc and finds "you" by uid (the
prototype's fairness filters = which `grade_track` doc it reads).
Weekly resets: partition events by ISO week, or zero a `weekKey`.
This keeps reads at O(1) and prevents score spoofing.

────────────────────────────────────────────────────────────────────
 H. Notifications + reminder triggers (FCM)
────────────────────────────────────────────────────────────────────
```js
users/{uid}/notifications/{nid} = {
  type:'streak'|'hw'|'adidakto'|'social'|'reward',
  title, body, ctaRoute:'/games'|…, read:false, createdAt,
}
users/{uid}.notifPrefs = { streak,hw,adidakto,social,reward,weekly: bool,
                           channels:{push,email}, quiet:{from,to} }
```
Writers (Cloud Functions, respecting `notifPrefs` + quiet hours):
  • **streak risk** — scheduled, evening: users with `streak.current>0`
    and no play today → push "σερί λήγει".
  • **homework due** — on `assignments` create → recipients; scheduled
    day-before for `due` dates.
  • **new αδίδακτο** — on `assignments` create whose games include an
    αδίδακτο, OR on a teacher "assign text" action.
  • **social** — when leaderboard aggregation detects a rank drop
    (optional, throttle hard).
  • **reward** — on title/milestone unlock (from §E).
Push via FCM to `users.fcmTokens`; email via the existing transactional
mailer (or a `mail` collection + Firebase "Trigger Email" extension).
Client only: list, mark-read, edit prefs. The "▶ Demo" button is mock —
drop it.

────────────────────────────────────────────────────────────────────
 I. Admin Game Analytics — rollups, not raw
────────────────────────────────────────────────────────────────────
```
game_events/{auto} = { game, mode, event:'start'|'complete'|'exit',
                       uid, stage, durSec, at }          // append-only
analytics_daily/{YYYY-MM-DD} = {                          // Function rollup
  perGame: { '<game>': {starts,completes,exits,avgSec} },
  perMode: { … }, totals:{…},
}
```
A scheduled Function aggregates `game_events` → `analytics_daily`. The
admin screen reads the daily docs for its range (replaces the in-file
`GAMES`/`MODES`/`RANGE_MULT`). Never query raw events from the client.
The end-of-game hook (§E) and a game-start/exit hook emit `game_events`.

────────────────────────────────────────────────────────────────────
 J. Cloud Functions to add (beyond the shipped `tts`)
────────────────────────────────────────────────────────────────────
  • `gradeExam(eid)`          — callable. Pulls `exams/{eid}`, runs the
    Anthropic API (YOUR key, larger model) to grade open answers vs a
    rubric, writes `grade{}`. Keep the AI-grading disclaimer flag.
  • `generateExamQuestions`   — callable. Given a `corpusId`, produce
    Γ1–Γ3 on the REAL passage (the prototype's prompt is ready). Cache
    on the corpus doc so the same text reuses questions.
  • `aggregateLeaderboards`   — scheduled hourly (§G).
  • `rollupAnalytics`         — scheduled daily (§I).
  • `streakReminders` / `dueReminders` — scheduled (§H).
  • `onAssignmentCreate`      — push "νέα άσκηση / αδίδακτο" (§H).
  • `stripeWebhook`           — §K.
  • `setUserClaims`           — on users write, mirror role/tier to
    custom claims.
Anthropic key via `firebase functions:config:set anthropic.key="…"`,
never in client code.

────────────────────────────────────────────────────────────────────
 K. Subscriptions (Stripe) → `users.tier`
────────────────────────────────────────────────────────────────────
Use the **"Run Subscriptions with Stripe" Firebase Extension** (or
plain Stripe Billing + a webhook). Flow:
  1. Pricing page → Checkout Session (extension creates it).
  2. `stripeWebhook` on `customer.subscription.*` → set
     `users/{uid}.tier` = mapped plan ('student'|'family'), mirror to
     custom claims (`setUserClaims`).
  3. Tier gates (`_gpCanAccessTier`) already read `tier` — no UI change.
  4. **Receipts/τιμολόγια:** enable Stripe's automatic invoice emails
     (Billing → email receipts). Greek VAT (ΦΠΑ) shown on the Stripe
     invoice; if your private-education service is VAT-exempt, set the
     product tax behaviour accordingly with your accountant.
  5. φροντιστήριο / school = manual deals (contact form → no self-serve
     checkout). Add a `b2bLeads/{id}` collection for the contact form;
     admins grant seats via the existing `classrooms.seatLimit` flow.
Manage-subscription screen → Stripe Billing Portal (extension provides
a portal-link callable). Don't build card UI yourself.

────────────────────────────────────────────────────────────────────
 L. localStorage keys to REMOVE on cutover
────────────────────────────────────────────────────────────────────
  symposion.a11y.v2      → users/{uid}.a11y   (keep as offline cache)
  symposion.narration.v1 → narration/ + Storage
  sym_corpus_v1          → corpus/
  sym_exam_v1            → exams/{eid}
Keep a11y in localStorage as the offline-first cache; the rest become
pure server state.

(Rules, indexes and Function stubs in files 2–4 of this folder.)
