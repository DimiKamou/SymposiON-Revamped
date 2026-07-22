/* ════════════════════════════════════════════════════════════════════
   functions/index.js — STUBS for the Cloud Functions referenced in
   "1 · DATA MODEL & INTEGRATION MAP.md" §J. Merge into your existing
   firebase/functions. `tts` already shipped in /firebase/functions/tts.js.
   Pseudocode-level: fill in the marked TODOs. Node 18, firebase-functions v4.
   ════════════════════════════════════════════════════════════════════ */
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();

/* ── mirror role/tier → custom claims so rules don't pay a get() ── */
exports.setUserClaims = functions.firestore
  .document('users/{uid}')
  .onWrite(async (chg, ctx) => {
    const after = chg.after.exists ? chg.after.data() : null;
    if (!after) return;
    const claims = { role: after.role || 'student', tier: after.tier || 'free' };
    await admin.auth().setCustomUserClaims(ctx.params.uid, claims).catch(()=>{});
  });

/* ── AI grade an exam (YOUR Anthropic key, larger model) ── */
exports.gradeExam = functions.runWith({ secrets: ['ANTHROPIC_KEY'], timeoutSeconds: 120 })
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated','sign in');
    const ref = db.doc(`exams/${data.eid}`);
    const snap = await ref.get();
    const ex = snap.data();
    if (!ex || ex.uid !== ctx.auth.uid) throw new functions.https.HttpsError('permission-denied','not yours');
    // TODO: call Anthropic Messages API with a rubric prompt over ex.paper + ex.answers.
    //   Build perQuestion[]: {no, score, max, note}. Keep open-answer grading conservative.
    const grade = { /* total, max, perQuestion[], model, disclaimer:true */ gradedAt: admin.firestore.FieldValue.serverTimestamp() };
    await ref.set({ status:'graded', grade }, { merge:true });   // Admin SDK bypasses rules
    return { ok:true };
  });

/* ── generate Γ1–Γ3 questions on a REAL corpus passage (cache on corpus) ── */
exports.generateExamQuestions = functions.runWith({ secrets:['ANTHROPIC_KEY'] })
  .https.onCall(async (data, ctx) => {
    if (!ctx.auth) throw new functions.https.HttpsError('unauthenticated','sign in');
    const cref = db.doc(`corpus/${data.corpusId}`);
    const c = (await cref.get()).data();
    if (c.cachedQs) return { qs: c.cachedQs };           // reuse
    // TODO: Anthropic call with the prototype's prompt over c.text. Do NOT alter the text.
    const qs = [/* {no,pts,txt,type} … */];
    await cref.set({ cachedQs: qs }, { merge:true });
    return { qs };
  });

/* ── hourly: aggregate kleos_events → leaderboards/{scope}/{grade_track} ── */
exports.aggregateLeaderboards = functions.pubsub.schedule('every 60 minutes').onRun(async () => {
  // TODO: for week|month|all, group kleos_events by grade+track, sum delta per uid,
  //   join users for name/title/streak, write top 500 rows to leaderboards/{scope}/{gradeKey}.
});

/* ── daily: roll up game_events → analytics_daily/{YYYY-MM-DD} ── */
exports.rollupAnalytics = functions.pubsub.schedule('every day 03:00').timeZone('Europe/Athens').onRun(async () => {
  // TODO: aggregate yesterday's game_events into perGame/perMode/totals.
});

/* ── evening: streak-risk reminders (respect notifPrefs + quiet hours) ── */
exports.streakReminders = functions.pubsub.schedule('every day 18:00').timeZone('Europe/Athens').onRun(async () => {
  // TODO: users with streak.current>0 and lastActive != today and notifPrefs.streak →
  //   write users/{uid}/notifications + FCM push to fcmTokens.
});

/* ── on assignment create → "νέα άσκηση / αδίδακτο" to recipients ── */
exports.onAssignmentCreate = functions.firestore.document('assignments/{aid}')
  .onCreate(async (snap) => {
    // TODO: for each studentEmail → resolve uid → notification + push, honoring prefs.
  });

/* ── Stripe webhook → users.tier (or use the Stripe Firebase Extension) ── */
exports.stripeWebhook = functions.runWith({ secrets:['STRIPE_WEBHOOK_SECRET'] })
  .https.onRequest(async (req, res) => {
    // TODO: verify signature; on customer.subscription.created/updated/deleted →
    //   map price → 'student'|'family'|'free', set users/{uid}.tier (setUserClaims mirrors).
    res.json({ received:true });
  });
