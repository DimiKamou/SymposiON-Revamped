════════════════════════════════════════════════════════════════════
 SymposiON — FIRESTORE / STORAGE / AUTH · Apply in order
════════════════════════════════════════════════════════════════════

WHAT THIS IS
------------
Takes the new prototype screens (root .html, built this cycle) off
localStorage/mock and onto live Firebase. It EXTENDS the app's
existing data model (users, classrooms, teacher_reports, custom_games,
assignments) — it does not replace it. Pair with handoff-anathesi
(teacher console) which already defined `assignments`.

FILES, IN ORDER
---------------
 1 · DATA MODEL & INTEGRATION MAP.md   ← READ FIRST. Per-screen
     prototype→live mapping, every new collection schema, the
     game-end hook, Storage layout, Stripe flow.
 2 · firestore.rules.additions.txt     — merge into firestore.rules.
 3 · firestore.indexes.additions.json  — merge into firestore.indexes.json.
 4 · functions/index.stubs.js          — Cloud Function stubs (fill TODOs);
     `tts` already shipped in /firebase/functions/tts.js.
 5 · Claude Code Prompt.txt            — paste-ready wiring prompt.

ORDER OF WORK (suggested)
-------------------------
 1. users doc extension + setUserClaims  (everything keys off this).
 2. corpus collection  → unblocks Exam picker + Narration Studio.
 3. narration + Storage → unblocks Iris perfect-clip playback.
 4. game-end hook (§E)  → streak, mastery, kleos_events in one txn.
 5. leaderboard + analytics rollup Functions (read-only screens).
 6. notifications + reminder Functions (+ FCM tokens on login).
 7. exams + gradeExam/generateExamQuestions Functions.
 8. Stripe extension + webhook → tier (pricing/sub).

REUSED, NOT REBUILT
-------------------
• users / classrooms / teacher_reports / custom_games / assignments.
• _gpCanAccessTier() + role logic (tier now Stripe-driven).
• /firebase/functions/tts.js (neural TTS — already wired in Iris +
  Narration Studio).
• teacher_reports mistake data backs the Mastery "weak spots" + the
  Tartarus strip — do NOT duplicate mistakes into a new collection.

DO NOT SHIP THE MOCK DATA
-------------------------
Remove on cutover: localStorage keys symposion.a11y.v2 (keep as
offline cache), symposion.narration.v1, sym_corpus_v1, sym_exam_v1,
and every in-file SEED/MOCK/genData array. They exist only so the
prototypes run standalone.

QA CHECKLIST
------------
□ New user → users doc created; role/tier land in custom claims;
  free-tier gates hold.
□ Admin adds a corpus text → appears in Exam picker AND Narration
  Studio (shared `corpus` collection), no reload hack.
□ Narration: pre-render hits tts Fn, MP3 lands in Storage, Iris plays
  the stored clip before live TTS before browser voice.
□ Finish a game → ONE transaction bumps kleos + streak + mastery +
  emits kleos_event; closing the tab mid-write leaves no half-state.
□ Leaderboard reads one aggregated doc for your grade+track; "you"
  row resolves by uid; weekly doc resets Monday.
□ Streak-risk reminder fires only for at-risk users, respects quiet
  hours + notifPrefs; arrives as FCM push + in-app notification.
□ Exam submit → gradeExam writes grade{} with disclaimer flag; client
  cannot write grade{} directly (rules).
□ Stripe test sub → users.tier flips → Pro content unlocks; receipt
  email arrives; Billing Portal link opens.
□ Parent (guardianEmail) opens child profile read-only; cannot write.
□ Rules deny: student writing kleos/tier/streak; client reading raw
  game_events/kleos_events; non-admin writing corpus/narration.
□ No console errors logged out, free-role, or with empty collections.
