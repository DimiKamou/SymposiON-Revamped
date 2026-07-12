# SymposiON — Additions Handoff (reference only)

This directory holds **design prototypes and a future-build spec** carried over
from the "SymposiON Additions Handoff" package. Nothing here is wired into the
running app — it is kept so the designs and specs aren't lost.

## screens/
15 **standalone HTML prototypes** (open any in a browser). They are *designs*,
not drop-in code: they share demo state via `localStorage` so they run offline.
Start with `Design System.html`, which links to every other screen.
Covered: Mastery & Daily Practice, Daily Streak & Goal, Αδίδακτο Workspace,
Panhellenic Exam Simulator, Polytonic Keyboard & Audio, Iris Accessibility,
Global Leaderboards, Notifications & Reminders, Parent View Profile,
Privacy & Parental Consent, Admin Game Analytics, Admin Unseen Corpus,
Admin Narration Studio, and the Error Pages gallery.

## firestore/
The **future-build spec** to take the above live on Firebase (data model,
rules/index additions, function stubs, wiring brief). Read
`0 · README - apply in order.txt` first. **Not implemented here** — this is a
plan for a larger future build, intentionally left unbuilt in this pass.

## What *was* applied from the handoff (live, outside this dir)
- The 9 deploy-ready error pages → `synthesis/error-pages/` (+ root `404.html`).
- The neural TTS Cloud Function → `synthesis/functions/tts.js`, re-exported from
  `functions/index.js`, served at `/api/tts` via the `firebase.json` rewrite.

These prototypes and the Firestore spec remain **reference only** until someone
chooses to build them.
