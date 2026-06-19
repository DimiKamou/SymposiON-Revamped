// ============================================================
//  SymposiON — Firebase Cloud Functions
//  Stripe Checkout · Webhook · Admin Grant Access
//
//  Setup:
//    firebase functions:config:set stripe.secret_key="sk_live_..."
//    firebase functions:config:set stripe.webhook_secret="whsec_..."
//    firebase functions:config:set app.url="https://your-project.web.app"
//
//  Deploy:
//    cd functions && npm install && cd .. && firebase deploy --only functions
// ============================================================

'use strict';

const functions  = require('firebase-functions');
const { onSchedule } = require('firebase-functions/v2/scheduler');
const admin      = require('firebase-admin');
const Stripe     = require('stripe');

admin.initializeApp();

const ADMIN_EMAIL = 'dimikamou@gmail.com';

// ── Lazy Stripe client (avoids init crash if config missing in dev) ──
function getStripe() {
  const key = functions.config().stripe?.secret_key;
  if (!key) throw new Error('Stripe secret key not configured. Run: firebase functions:config:set stripe.secret_key="sk_..."');
  return Stripe(key);
}

// ── Default pricing table (EUR) — overridden by Firestore /config/pricing ──
const DEFAULT_PRICING = {
  student: { 1: 4.99,  3: 12.99, 6: 21.99, 12: 35.99 },
  teacher: { 1: 7.99,  3: 19.99, 6: 34.99, 12: 59.99 },
};

async function getPricing() {
  try {
    const doc = await admin.firestore().collection('config').doc('pricing').get();
    if (doc.exists) {
      const d = doc.data();
      const result = {};
      // Collect all plan keys (built-in + custom), skip metadata fields
      const planKeys = Object.keys(d).filter(k => !k.startsWith('_') && k !== 'updatedAt' && k !== 'updatedBy');
      planKeys.forEach(key => {
        if (d[key] && typeof d[key] === 'object') {
          result[key] = { 1: +d[key][1], 3: +d[key][3], 6: +d[key][6], 12: +d[key][12] };
        }
      });
      if (Object.keys(result).length > 0) return result;
    }
  } catch (_) {}
  return DEFAULT_PRICING;
}

const CLASS_LABELS = {
  'all':       'All Grades (All Access)',
  'gym-a':     '7th Grade (Α΄ Γυμνασίου)',
  'gym-b':     '8th Grade (Β΄ Γυμνασίου)',
  'gym-c':     '9th Grade (Γ΄ Γυμνασίου)',
  'lyk-a':     '10th Grade (Α΄ Λυκείου)',
  'lyk-b':     '11th Grade (Β΄ Λυκείου)',
  'lyk-c':     '12th Grade (Γ΄ Λυκείου)',
  'gram-arch': 'Ancient Greek Grammar',
  'gram-nea':  'Modern Greek Grammar',
  'gram-lat':  'Latin',
};

const ALL_CLASSES = ['gym-a','gym-b','gym-c','lyk-a','lyk-b','lyk-c','gram-nea','gram-arch','gram-lat'];

// ============================================================
//  createStripeCheckout  (callable)
//  Called from subscribe.js → opens Stripe Checkout
// ============================================================
exports.createStripeCheckout = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to subscribe.');
  }

  const { userType, classKey, months } = data;

  if (![1, 3, 6, 12].includes(Number(months))) {
    throw new functions.https.HttpsError('invalid-argument', 'months must be 1, 3, 6 or 12.');
  }

  const stripeClient  = getStripe();
  const PRICING       = await getPricing();

  // Accept any plan type that exists in the pricing config (includes admin-added custom plans)
  if (!PRICING[userType] || PRICING[userType][Number(months)] == null) {
    throw new functions.https.HttpsError('invalid-argument', `Unknown plan type: ${userType}`);
  }

  const unitAmount    = Math.round(PRICING[userType][Number(months)] * 100); // convert EUR → cents for Stripe
  const classLabel    = CLASS_LABELS[classKey] || classKey;
  const appUrl        = functions.config().app?.url || 'https://your-project.web.app';
  const roleLabel     = userType.charAt(0).toUpperCase() + userType.slice(1);

  const session = await stripeClient.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    allow_promotion_codes: true,           // Enables Stripe-native promo code entry
    customer_email: context.auth.token.email,
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name:        `SymposiON Pro —${roleLabel} · ${months} ${months === 1 ? 'Month' : 'Months'}`,
          description: `Full access · ${classLabel}`,
          images:      [],
        },
        unit_amount: unitAmount,
      },
      quantity: 1,
    }],
    metadata: {
      uid:      context.auth.uid,
      email:    context.auth.token.email || '',
      userType,
      classKey: classKey || 'all',
      months:   String(months),
    },
    success_url: `${appUrl}?payment=success`,
    cancel_url:  `${appUrl}?payment=cancel`,
  });

  return { url: session.url };
});


// ── Shared helper: write pro access to Firestore ──────────
async function _grantProAccess({ uid, userType, classKey, months, source, sourceId }) {
  const monthsInt = parseInt(months, 10) || 1;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + monthsInt);
  const classes = classKey === 'all' ? ALL_CLASSES : [classKey];

  await admin.firestore().doc(`users/${uid}`).set({
    plan:      'pro',
    role:      userType || 'student',
    expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    classes,
    paymentSource: source,        // 'stripe_checkout' | 'stripe_intent' | 'paypal'
    paymentId:     sourceId,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  console.log(`[symposion] ✓ Pro granted uid=${uid} via ${source} | ${userType} ${monthsInt}mo class=${classKey}`);
}

// ============================================================
//  createPaymentIntent  (callable)
//  Called from checkout.js → initialises Stripe Payment Element
//  The price is looked up SERVER-SIDE — frontend cannot spoof it.
//  Dashboard → Webhooks → listen for: payment_intent.succeeded
// ============================================================
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to pay.');
  }

  const { userType, months, classKey } = data;

  if (![1, 3, 6, 12].includes(Number(months))) {
    throw new functions.https.HttpsError('invalid-argument', 'months must be 1, 3, 6 or 12.');
  }

  const stripeClient = getStripe();
  const PRICING      = await getPricing();

  if (!PRICING[userType]?.[Number(months)]) {
    throw new functions.https.HttpsError('invalid-argument', `Unknown plan: ${userType}`);
  }

  const unitAmount = Math.round(PRICING[userType][Number(months)] * 100); // EUR → cents
  const appUrl     = functions.config().app?.url || 'https://your-project.web.app';

  const intent = await stripeClient.paymentIntents.create({
    amount:   unitAmount,
    currency: 'eur',
    automatic_payment_methods: { enabled: true }, // enables Google Pay, Apple Pay, cards
    receipt_email: context.auth.token.email || undefined,
    metadata: {
      uid:      context.auth.uid,
      email:    context.auth.token.email || '',
      userType: userType || 'student',
      classKey: classKey || 'all',
      months:   String(months),
    },
  });

  return { clientSecret: intent.client_secret };
});


// ============================================================
//  stripeWebhook  (HTTP endpoint)
//  Handles checkout.session.completed  (Stripe Checkout redirect)
//         payment_intent.succeeded     (inline Payment Element)
//  Register in Stripe Dashboard → Webhooks
//    Events: checkout.session.completed, payment_intent.succeeded
// ============================================================
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const stripeClient  = getStripe();
  const webhookSecret = functions.config().stripe?.webhook_secret;
  const sig           = req.headers['stripe-signature'];

  if (!webhookSecret) {
    console.error('[symposion webhook] stripe.webhook_secret not configured');
    return res.status(500).send('Webhook secret not configured');
  }

  let event;
  try {
    event = stripeClient.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('[symposion webhook] Signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ── Stripe Checkout Session (redirect flow) ──
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { uid, userType, classKey, months } = session.metadata || {};
    if (!uid) {
      console.error('[symposion webhook] Missing uid in session metadata:', session.id);
      return res.json({ received: true });
    }
    await _grantProAccess({
      uid, userType, classKey, months,
      source:   'stripe_checkout',
      sourceId: session.id,
    });
  }

  // ── Stripe Payment Element (inline flow) ──
  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object;
    const { uid, userType, classKey, months } = intent.metadata || {};
    if (!uid) {
      console.error('[symposion webhook] Missing uid in intent metadata:', intent.id);
      return res.json({ received: true });
    }
    await _grantProAccess({
      uid, userType, classKey, months,
      source:   'stripe_intent',
      sourceId: intent.id,
    });
  }

  return res.json({ received: true });
});


// ============================================================
//  adminGrantAccess  (callable — ADMIN ONLY)
//  Grants pro access to any user by email, bypassing Stripe.
//  Called from admin.js → adminGrantAccess()
// ============================================================
exports.adminGrantAccess = functions.https.onCall(async (data, context) => {
  requireRole(context, ['users']);

  const { targetEmail, role, months, classKey } = data;

  if (!targetEmail || !role || !months) {
    throw new functions.https.HttpsError('invalid-argument', 'targetEmail, role and months are required.');
  }
  // Validate role dynamically — accepts built-in plans (student, teacher) + any admin-defined custom plans
  const PRICING_CHECK = await getPricing();
  if (!PRICING_CHECK[role]) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      `Unknown role: "${role}". Valid roles: ${Object.keys(PRICING_CHECK).join(', ')}`
    );
  }

  // Look up the Firebase Auth user by email (works even if no Firestore doc yet)
  let userRecord;
  try {
    userRecord = await admin.auth().getUserByEmail(targetEmail.trim().toLowerCase());
  } catch (err) {
    if (err.code === 'auth/user-not-found') {
      throw new functions.https.HttpsError('not-found', `No user found with email: ${targetEmail}`);
    }
    throw new functions.https.HttpsError('internal', err.message);
  }

  const monthsInt = parseInt(months, 10) || 1;
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + monthsInt);

  const classes = classKey === 'all' ? ALL_CLASSES : [classKey || 'all'];

  await admin.firestore().doc(`users/${userRecord.uid}`).set({
    plan:      'pro',
    role,
    expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
    classes,
    grantedBy: ADMIN_EMAIL,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    // Preserve email/displayName if doc already exists
    email:       userRecord.email       || '',
    displayName: userRecord.displayName || '',
  }, { merge: true });

  console.log(`[symposion admin] ✓ Granted ${role} access to uid=${userRecord.uid} (${targetEmail}) for ${monthsInt} month(s)`);
  return { success: true, uid: userRecord.uid, displayName: userRecord.displayName || '' };
});

// ============================================================
//  cleanupStaleArenas  (scheduled — every 30 minutes)
//  Deletes live_arenas documents (+ subcollections) older than 3 h.
//  Requires Blaze (pay-as-you-go) plan for scheduled functions.
// ============================================================
exports.cleanupStaleArenas = onSchedule(
  { schedule: 'every 30 minutes', timeZone: 'Europe/Athens' },
  async (_context) => {
    const db = admin.firestore();
    const cutoff = admin.firestore.Timestamp.fromMillis(Date.now() - 3 * 60 * 60 * 1000);

    const stale = await db.collection('live_arenas').where('createdAt', '<', cutoff).get();
    if (stale.empty) {
      console.log('[cleanupStaleArenas] Nothing to clean.');
      return null;
    }

    console.log(`[cleanupStaleArenas] Cleaning ${stale.size} stale arena(s)…`);

    for (const arenaDoc of stale.docs) {
      try {
        const [players, answers] = await Promise.all([
          arenaDoc.ref.collection('players').get(),
          arenaDoc.ref.collection('answers').get(),
        ]);

        const deletes = [
          ...players.docs.map(d => d.ref.delete()),
          ...answers.docs.map(d => d.ref.delete()),
        ];
        await Promise.all(deletes);
        await arenaDoc.ref.delete();

        console.log(`[cleanupStaleArenas] Deleted arena ${arenaDoc.id}`);
      } catch (err) {
        console.error(`[cleanupStaleArenas] Failed on arena ${arenaDoc.id}:`, err);
      }
    }

    return null;
  });


// ============================================================
//  PayPal helpers
//  Setup:
//    firebase functions:config:set \
//      paypal.client_id="AYour..."  \
//      paypal.client_secret="EYour..." \
//      paypal.mode="sandbox"    ← change to "live" in production
//  Deploy: firebase deploy --only functions
// ============================================================

// ── Get a PayPal OAuth2 access token (cached for 9 minutes) ─
let _ppAccessToken    = null;
let _ppTokenExpiresAt = 0;

async function _getPayPalToken() {
  if (_ppAccessToken && Date.now() < _ppTokenExpiresAt) return _ppAccessToken;

  const clientId     = functions.config().paypal?.client_id;
  const clientSecret = functions.config().paypal?.client_secret;
  const mode         = functions.config().paypal?.mode || 'sandbox';

  if (!clientId || !clientSecret) {
    throw new Error('PayPal credentials not configured. Run: firebase functions:config:set paypal.client_id="..." paypal.client_secret="..."');
  }

  const baseUrl  = mode === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

  const creds    = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method:  'POST',
    headers: {
      'Authorization': `Basic ${creds}`,
      'Content-Type':  'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`PayPal auth failed: ${err}`);
  }

  const body       = await response.json();
  _ppAccessToken   = body.access_token;
  // Expire 1 minute before the token actually expires
  _ppTokenExpiresAt = Date.now() + (body.expires_in - 60) * 1000;

  return _ppAccessToken;
}

function _getPayPalBaseUrl() {
  const mode = functions.config().paypal?.mode || 'sandbox';
  return mode === 'live' ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';
}


// ============================================================
//  createPayPalOrder  (callable)
//  Creates a PayPal order server-side with the verified price.
//  Returns the order ID to the frontend for approval.
// ============================================================
exports.createPayPalOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in to pay.');
  }

  const { userType, months, classKey } = data;

  if (![1, 3, 6, 12].includes(Number(months))) {
    throw new functions.https.HttpsError('invalid-argument', 'months must be 1, 3, 6 or 12.');
  }

  const PRICING = await getPricing();
  if (!PRICING[userType]?.[Number(months)]) {
    throw new functions.https.HttpsError('invalid-argument', `Unknown plan: ${userType}`);
  }

  const price   = PRICING[userType][Number(months)].toFixed(2); // EUR string e.g. "4.99"
  const token   = await _getPayPalToken();
  const baseUrl = _getPayPalBaseUrl();

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
      'PayPal-Request-Id': `${context.auth.uid}-${Date.now()}`, // idempotency
    },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id:  `${userType}_${months}mo`,
        description:   `SymposiON Pro —${userType} · ${months} month(s) · ${classKey || 'all'}`,
        amount: {
          currency_code: 'EUR',
          value:         price,
        },
        custom_id: JSON.stringify({
          uid:      context.auth.uid,
          email:    context.auth.token.email || '',
          userType: userType || 'student',
          classKey: classKey || 'all',
          months:   String(months),
        }),
      }],
      application_context: {
        brand_name:          'SymposiON',
        locale:              'el-GR',
        landing_page:        'NO_PREFERENCE',
        shipping_preference: 'NO_SHIPPING',
        user_action:         'PAY_NOW',
      },
    }),
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    console.error('[symposion PayPal] createOrder failed:', errBody);
    throw new functions.https.HttpsError('internal', 'Could not create PayPal order.');
  }

  const order = await response.json();
  return { orderId: order.id };
});


// ============================================================
//  capturePayPalOrder  (callable)
//  Captures a PayPal order after buyer approval.
//  Verifies the capture status before updating Firestore.
// ============================================================
exports.capturePayPalOrder = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'You must be signed in.');
  }

  const { orderId } = data;
  if (!orderId || typeof orderId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'orderId is required.');
  }

  const token   = await _getPayPalToken();
  const baseUrl = _getPayPalBaseUrl();

  // Capture the order
  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method:  'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type':  'application/json',
    },
  });

  if (!response.ok) {
    const errBody = await response.json().catch(() => ({}));
    console.error('[symposion PayPal] capture failed:', errBody);
    throw new functions.https.HttpsError('internal', 'PayPal capture failed.');
  }

  const capture = await response.json();
  const status  = capture.status; // 'COMPLETED' | 'PAYER_ACTION_REQUIRED' | etc.

  if (status !== 'COMPLETED') {
    console.warn('[symposion PayPal] Capture not COMPLETED:', status, orderId);
    return { status };
  }

  // ── Extract metadata we embedded in custom_id ──
  const unit      = capture.purchase_units?.[0];
  const captureId = unit?.payments?.captures?.[0]?.id || orderId;
  let   meta      = {};
  try { meta = JSON.parse(unit?.custom_id || '{}'); } catch (_) {}

  const { uid, userType, classKey, months } = meta;

  // ── Security: verify the caller is the buyer ──
  if (!uid || uid !== context.auth.uid) {
    console.error('[symposion PayPal] uid mismatch', { uid, caller: context.auth.uid, orderId });
    throw new functions.https.HttpsError('permission-denied', 'Order does not belong to this account.');
  }

  // ── Grant pro access ──
  await _grantProAccess({
    uid, userType, classKey, months,
    source:   'paypal',
    sourceId: captureId,
  });

  return { status: 'COMPLETED', captureId };
});


// ============================================================
//  GUARDRAILS — Roles · Audit · Dependency-safe Deletes · GDPR · Validated Config
//
//  Guardrail 2: RBAC via custom claims
//  Guardrail 1: Destructive-action guards (dependency scan + batch reassign/detach)
//  Guardrail 3: GDPR — portable export + right to erasure
//  Guardrail 4: Input validation (server-side price/coupon invariants)
// ============================================================

const ROLE_DOMAINS = {
  super:   '*',                               // all domains + privileged actions
  content: ['games', 'curriculum', 'content'],
  support: ['support', 'users'],
  finance: ['subs'],
};

// Caller's effective role: bootstrap email = super, else read custom claim.
function callerRole(context) {
  if (!context.auth) return null;
  if (context.auth.token.email === ADMIN_EMAIL) return 'super';
  return context.auth.token.role || null;
}

// Throws permission-denied unless caller has at least one of the required domains.
// `domains` is an array of domain strings OR '*' to require super only.
function requireRole(context, domains) {
  const r = callerRole(context);
  if (!r) throw new functions.https.HttpsError('permission-denied', 'Authentication required.');
  if (r === 'super') return r;               // super can always proceed
  const allowed = ROLE_DOMAINS[r];
  if (!allowed || allowed === '*') return r; // (shouldn't happen for non-super, but safe)
  const ok = Array.isArray(domains)
    ? domains.some(d => allowed.includes(d))
    : false;
  if (!ok) throw new functions.https.HttpsError('permission-denied', `Role "${r}" cannot access domain(s): ${domains}.`);
  return r;
}

// Write one immutable entry to adminAudit/. Admin SDK bypasses client rules
// (create/update/delete are all false for clients — see firestore.rules).
async function writeAudit(context, action, target, meta) {
  await admin.firestore().collection('adminAudit').add({
    action,
    target:     target  ?? null,
    meta:       meta    ?? {},
    actorUid:   context.auth?.uid              ?? null,
    actorEmail: context.auth?.token?.email     ?? null,
    role:       callerRole(context),
    at:         admin.firestore.FieldValue.serverTimestamp(),
  });
}


// ── Guardrail 2 · setAdminRole ────────────────────────────────
// Super-only. Sets a custom claim on the target Firebase Auth user.
// Writes a mirror to adminRoles/{uid} (for listing + counting supers).
// ⚠ Caller must force-refresh their own token after calling this:
//     await firebase.auth().currentUser.getIdToken(true)
exports.setAdminRole = functions.https.onCall(async (data, context) => {
  // Super-only: requireRole with null domains means only 'super' passes.
  if (callerRole(context) !== 'super') {
    throw new functions.https.HttpsError('permission-denied', 'Super-admin required.');
  }
  const { targetEmail, role } = data;        // role may be null = revoke
  if (role !== null && !ROLE_DOMAINS[role]) {
    throw new functions.https.HttpsError('invalid-argument', `Unknown role: "${role}". Valid: ${Object.keys(ROLE_DOMAINS).join(', ')}`);
  }

  const target = await admin.auth().getUserByEmail(String(targetEmail).trim().toLowerCase())
    .catch(() => { throw new functions.https.HttpsError('not-found', `No user: ${targetEmail}`); });

  // Last-super guard: never demote the final super-admin.
  if (role !== 'super') {
    const supers = await admin.firestore().collection('adminRoles').where('role', '==', 'super').get();
    const wasSuper = supers.docs.some(d => d.id === target.uid);
    if (wasSuper && supers.size <= 1) {
      throw new functions.https.HttpsError('failed-precondition', 'At least one Super-admin is required.');
    }
  }

  const existing = (await admin.auth().getUser(target.uid)).customClaims || {};
  await admin.auth().setCustomUserClaims(target.uid, {
    ...existing,
    role:  role || null,
    admin: !!role,
  });
  await admin.firestore().doc(`adminRoles/${target.uid}`).set(
    { email: target.email, role: role || null, updatedAt: admin.firestore.FieldValue.serverTimestamp() },
    { merge: true }
  );
  await writeAudit(context, 'role.set', target.email, { role });
  // mustRefreshToken reminds the client to call getIdToken(true) for the acting user.
  return { ok: true, uid: target.uid, mustRefreshToken: true };
});


// ── Guardrail 1 · adminDeleteGuarded ─────────────────────────
// Dependency-aware delete for tiers, datasets, and engines.
// Scans references, reassigns/detaches them in a batch, then deletes,
// and writes a full report to adminAudit/.
exports.adminDeleteGuarded = functions.https.onCall(async (data, context) => {
  requireRole(context, ['content', 'subs']);
  const db   = admin.firestore();
  const { type, id } = data;
  if (!type || !id) throw new functions.https.HttpsError('invalid-argument', 'type and id are required.');

  const batch  = db.batch();
  const report = {};

  if (type === 'tier') {
    // Reassign every engine/dataset whose tier === id back to 'free'.
    // Tiers live in config/game-tiers.tiers (the live gating doc).
    const tiersDoc = await db.collection('config').doc('game-tiers').get();
    const tiers    = tiersDoc.exists ? (tiersDoc.data().tiers || {}) : {};
    const affected = Object.keys(tiers).filter(k => tiers[k] === id);
    if (affected.length) {
      const patch = {};
      affected.forEach(k => { patch[`tiers.${k}`] = 'free'; });
      batch.update(tiersDoc.ref, patch);
    }
    // Also remove the tier from config/access grades if referenced.
    const accessDoc = await db.collection('config').doc('access').get();
    if (accessDoc.exists) {
      const grades    = accessDoc.data().grades || {};
      const affGrades = Object.keys(grades).filter(k => grades[k] === id);
      if (affGrades.length) {
        const gPatch = {};
        affGrades.forEach(k => { gPatch[`grades.${k}`] = 'free'; });
        batch.update(accessDoc.ref, gPatch);
      }
      report.grades = affGrades.length;
    }
    report.datasets = affected.length;

  } else if (type === 'dataset' || type === 'engine') {
    // Detach from every classes/{c}/curriculum/main.
    const classesSnap = await db.collection('classes').get();
    let classCount = 0;
    for (const classDoc of classesSnap.docs) {
      const currRef  = classDoc.ref.collection('curriculum').doc('main');
      const currSnap = await currRef.get();
      if (!currSnap.exists) continue;
      const currData = currSnap.data();
      if (type === 'dataset' && currData.datasets && currData.datasets[id] !== undefined) {
        batch.update(currRef, { [`datasets.${id}`]: admin.firestore.FieldValue.delete() });
        classCount++;
      }
      if (type === 'engine' && currData.engines && currData.engines[id] !== undefined) {
        batch.update(currRef, { [`engines.${id}`]: admin.firestore.FieldValue.delete() });
        classCount++;
      }
    }
    // Also detach from config/game-tiers.tiers (for datasets) or engineTiers (for engines).
    const tiersDoc = await db.collection('config').doc('game-tiers').get();
    if (tiersDoc.exists) {
      const key = type === 'dataset' ? `tiers.${id}` : `engineTiers.${id}`;
      batch.update(tiersDoc.ref, { [key]: admin.firestore.FieldValue.delete() });
    }
    report.classes = classCount;
  } else {
    throw new functions.https.HttpsError('invalid-argument', `Unknown type: "${type}"`);
  }

  await batch.commit();
  await writeAudit(context, `${type}.delete`, id, report);
  return { ok: true, report };
});


// ── Guardrail 3 · gdprExportUser ─────────────────────────────
// Assembles a portable JSON of the user's data. Support + super only.
exports.gdprExportUser = functions.https.onCall(async (data, context) => {
  requireRole(context, ['users']);           // support + super
  const { uid } = data;
  if (!uid) throw new functions.https.HttpsError('invalid-argument', 'uid required.');
  const db = admin.firestore();

  const [userDoc, progSnap, mistSnap, lbSnap, classroomSnap] = await Promise.all([
    db.doc(`users/${uid}`).get(),
    db.collection(`users/${uid}/progression`).get(),
    db.collection(`users/${uid}/mistakes_archive`).get(),
    db.collection('global_leaderboards').where('uid', '==', uid).get(),
    db.collection('classrooms').where('teacherUid', '==', uid).limit(1).get(),
  ]);

  await writeAudit(context, 'gdpr.export', uid, {});
  return {
    exportedAt:   new Date().toISOString(),
    profile:      userDoc.exists   ? userDoc.data()              : null,
    progression:  progSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    mistakes:     mistSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    leaderboards: lbSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    classroom:    classroomSnap.empty ? null : classroomSnap.docs[0].data(),
  };
});


// ── Guardrail 3 · gdprEraseUser ──────────────────────────────
// Right to erasure. Deletes subcollections, cross-collection PII,
// tombstones users/{uid}, then deletes the Auth account. Irreversible.
// NOTE: retain anonymised financial rows (transaction records) —
// legal requirement; erase PII but keep amount/date.
exports.gdprEraseUser = functions.https.onCall(async (data, context) => {
  requireRole(context, ['users']);           // support + super
  const { uid } = data;
  if (!uid) throw new functions.https.HttpsError('invalid-argument', 'uid required.');
  const db = admin.firestore();

  // Helper: delete all docs in a query in batches.
  const delQuery = async (q) => {
    const snap = await q.get();
    if (snap.empty) return;
    const b = db.batch();
    snap.forEach(d => b.delete(d.ref));
    await b.commit();
  };

  // Idempotency guard — skip if already erased.
  const userDoc = await db.doc(`users/${uid}`).get();
  if (userDoc.exists && userDoc.data().erased) return { ok: true, alreadyErased: true };

  await delQuery(db.collection(`users/${uid}/progression`));
  await delQuery(db.collection(`users/${uid}/mistakes_archive`));
  await delQuery(db.collection('global_leaderboards').where('uid', '==', uid));
  await delQuery(db.collection('teacher_reports').where('studentUid', '==', uid));
  await delQuery(db.collection('custom_games').where('creatorId', '==', uid));

  // Tombstone: scrub PII fields but keep the doc so analytics counts stay sane.
  await db.doc(`users/${uid}`).set({
    erased:      true,
    erasedAt:    admin.firestore.FieldValue.serverTimestamp(),
    email:       null,
    displayName: null,
    consent:     'n/a',
    // Keep non-PII fields (role, plan, classes) for aggregate stats.
  }, { merge: false });

  // Delete the Firebase Auth account (irreversible — do last).
  await admin.auth().deleteUser(uid).catch(err => {
    // If Auth account already deleted that's fine; everything else re-throw.
    if (err.code !== 'auth/user-not-found') throw err;
  });

  await writeAudit(context, 'gdpr.erase', uid, {});
  return { ok: true };
});


// ── Guardrail 4 · adminSaveConfig ────────────────────────────
// Validated server-side write for config docs (pricing, access, game-tiers).
// Rejects: negative prices, paid plans at €0, prices > €999 cap,
//          coupon % outside 1–100, maxUses < 0.
exports.adminSaveConfig = functions.https.onCall(async (data, context) => {
  requireRole(context, ['subs', 'content']);
  const { docId, payload } = data;
  if (!docId || typeof payload !== 'object') {
    throw new functions.https.HttpsError('invalid-argument', 'docId and payload required.');
  }

  if (docId === 'pricing') {
    for (const [plan, months] of Object.entries(payload)) {
      if (typeof plan !== 'string' || plan.startsWith('_')) continue; // skip meta keys
      for (const mo of [1, 3, 6, 12]) {
        const v = Number(months?.[mo]);
        if (!isFinite(v) || v < 0) {
          throw new functions.https.HttpsError('invalid-argument', `${plan}/${mo}mo must be ≥ 0.`);
        }
        if (plan !== 'free' && v === 0) {
          throw new functions.https.HttpsError('invalid-argument', `Paid plan "${plan}/${mo}mo" cannot be €0.`);
        }
        if (v > 999) {
          throw new functions.https.HttpsError('invalid-argument', `${plan}/${mo}mo exceeds €999 cap.`);
        }
      }
    }
  }

  if (docId === 'coupon') {
    const pct     = Number(payload.discount);
    const maxUses = Number(payload.maxUses ?? 0);
    if (!isFinite(pct) || pct < 1 || pct > 100) {
      throw new functions.https.HttpsError('invalid-argument', 'Coupon discount must be 1–100%.');
    }
    if (!isFinite(maxUses) || maxUses < 0) {
      throw new functions.https.HttpsError('invalid-argument', 'maxUses must be ≥ 0.');
    }
    // Validity WINDOW (validFrom / validUntil) — admin can set a real
    // date+time range. Each may be a Firestore Timestamp, an epoch-ms number,
    // or an ISO string; normalise to ms and require until > from when both set.
    const _ms = (v) => {
      if (v == null) return null;
      if (typeof v === 'number') return isFinite(v) ? v : NaN;
      if (typeof v.toMillis === 'function') return v.toMillis();
      if (typeof v._seconds === 'number') return v._seconds * 1000;
      const n = Date.parse(v);
      return isFinite(n) ? n : NaN;
    };
    const fromMs  = _ms(payload.validFrom);
    const untilMs = _ms(payload.validUntil);
    if (fromMs !== null && Number.isNaN(fromMs)) {
      throw new functions.https.HttpsError('invalid-argument', 'validFrom is not a valid date/time.');
    }
    if (untilMs !== null && Number.isNaN(untilMs)) {
      throw new functions.https.HttpsError('invalid-argument', 'validUntil is not a valid date/time.');
    }
    if (fromMs && untilMs && untilMs <= fromMs) {
      throw new functions.https.HttpsError('invalid-argument', 'validUntil must be after validFrom.');
    }
  }

  await admin.firestore().doc(`config/${docId}`).set({
    ...payload,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: context.auth.token.email,
  }, { merge: true });

  await writeAudit(context, `config.save.${docId}`, docId, {});
  return { ok: true };
});

// ── SITE STUDIO · adminSaveCatalog ───────────────────────────
// Validated server-side write for the whole catalog tree
// (grades → subjects → games). Copies the adminSaveConfig pattern:
// requireRole + structural validation + whole-doc set + writeAudit.
// Rules deny direct client writes to siteCatalog/* — this is the only path.
exports.adminSaveCatalog = functions.https.onCall(async (data, context) => {
  requireRole(context, ['content', 'curriculum']);     // super always allowed
  const { tree } = data || {};
  if (!tree || !Array.isArray(tree.grades)) {
    throw new functions.https.HttpsError('invalid-argument', 'tree.grades[] required.');
  }
  const TIERS = ['free', 'student', 'teacher'];
  for (const g of tree.grades) {
    if (!g || !g.key) {
      throw new functions.https.HttpsError('invalid-argument', 'grade.key required.');
    }
    for (const s of (g.subjects || [])) {
      if (!s || !s.id) {
        throw new functions.https.HttpsError('invalid-argument', `subject.id required in grade ${g.key}.`);
      }
      const seen = new Set();
      for (const gm of (s.games || [])) {
        if (!gm || !gm.id) {
          throw new functions.https.HttpsError('invalid-argument', `game.id required in ${g.key}/${s.id}.`);
        }
        if (seen.has(gm.id)) {
          throw new functions.https.HttpsError('invalid-argument', `duplicate game id "${gm.id}" in ${g.key}/${s.id}.`);
        }
        seen.add(gm.id);
        if (gm.tier && !TIERS.includes(gm.tier)) {
          throw new functions.https.HttpsError('invalid-argument', `bad tier "${gm.tier}" on game ${gm.id}.`);
        }
      }
    }
  }
  await admin.firestore().doc('siteCatalog/tree').set({
    grades:    tree.grades,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: context.auth.token.email,
  }, { merge: false });
  await writeAudit(context, 'studio.catalog.save', null, { grades: tree.grades.length });
  return { ok: true };
});


// ── SITE STUDIO · adminSaveGameContent ───────────────────────
// Validated server-side write for one game's content doc.
// Re-checks the invariants the client UI enforces (cannot be trusted):
//   quiz     → every question has opts.length ≥ 2 and 0 ≤ ans < opts.length
//   paradigm → every entry.cells is exactly rowAxis.length × colAxis.length
exports.adminSaveGameContent = functions.https.onCall(async (data, context) => {
  requireRole(context, ['content']);
  const { contentId, content } = data || {};
  if (!contentId || typeof contentId !== 'string') {
    throw new functions.https.HttpsError('invalid-argument', 'contentId required.');
  }
  if (!content || !Array.isArray(content.units)) {
    throw new functions.https.HttpsError('invalid-argument', 'content.units[] required.');
  }

  if (content.schema === 'quiz') {
    for (const u of content.units) {
      for (const q of (u.questions || [])) {
        if (!Array.isArray(q.opts) || q.opts.length < 2) {
          throw new functions.https.HttpsError('invalid-argument', `unit "${u.key}": a question needs ≥2 options.`);
        }
        if (!(Number.isInteger(q.ans) && q.ans >= 0 && q.ans < q.opts.length)) {
          throw new functions.https.HttpsError('invalid-argument', `unit "${u.key}": answer index out of range.`);
        }
      }
    }
  } else if (content.schema === 'paradigm') {
    for (const u of content.units) {
      const R = (u.rowAxis || []).length;
      const C = (u.colAxis || []).length;
      if (R < 1 || C < 1) {
        throw new functions.https.HttpsError('invalid-argument', `unit "${u.key}": rowAxis and colAxis required.`);
      }
      for (const e of (u.entries || [])) {
        if (!Array.isArray(e.cells) || e.cells.length !== R) {
          throw new functions.https.HttpsError('invalid-argument', `entry "${e.lemma}": cells rows ≠ ${R}.`);
        }
        for (const row of e.cells) {
          if (!Array.isArray(row) || row.length !== C) {
            throw new functions.https.HttpsError('invalid-argument', `entry "${e.lemma}": cells cols ≠ ${C}.`);
          }
        }
      }
    }
  } else {
    throw new functions.https.HttpsError('invalid-argument', `unknown schema "${content.schema}".`);
  }

  await admin.firestore().doc(`gameContent/${contentId}`).set({
    ...content,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: context.auth.token.email,
  }, { merge: false });
  await writeAudit(context, 'studio.content.save', contentId, {
    schema: content.schema, units: content.units.length,
  });
  return { ok: true };
});

// ============================================================
//  AI GRADING — subject-agnostic free-response grader
//
//  POST /api/gradeAnswer  { question, model, points[], answer, rubric?, subject? }
//   → { score, verdict, feedback, covered[], missed[], wrong[] }   (Greek)
//
//  `subject` sets the grader persona (e.g. "Αρχαίων Ελληνικών Γ΄ Λυκείου",
//  "Λογοτεχνίας Β΄ Λυκείου"); defaults to Ιστορία Προσανατολισμού so the
//  existing istoria panel works unchanged. Semantic comparison (by meaning,
//  NOT word-for-word). The API key never leaves the server. If the key is
//  unconfigured or the upstream call fails, responds with a non-2xx status
//  so the client uses its offline fallback.
//
//  Setup (firebase-functions v7 — use env vars, NOT functions.config()):
//    Put the key in functions/.env (gitignored), then deploy:
//      ANTHROPIC_KEY=sk-ant-...
//      ANTHROPIC_MODEL=claude-sonnet-4-6   (optional)
//    Or use Secret Manager: firebase functions:secrets:set ANTHROPIC_KEY
// ============================================================
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';

function buildGraderPrompt(p) {
  const rubric  = p.rubric ? (' ' + p.rubric) : '';
  const subject = (typeof p.subject === 'string' && p.subject.trim())
    ? p.subject.trim()
    : 'Ιστορίας Προσανατολισμού Γ΄ Λυκείου';
  return `Είσαι έμπειρος βαθμολογητής ${subject}. Σύγκρινε ΣΗΜΑΣΙΟΛΟΓΙΚΑ (με βάση το νόημα, ΟΧΙ λέξη προς λέξη) την απάντηση του μαθητή με την ενδεικτική απάντηση και τα βασικά σημεία.${rubric}

ΕΡΩΤΗΣΗ: ${p.question || ''}
ΕΝΔΕΙΚΤΙΚΗ ΑΠΑΝΤΗΣΗ: ${p.model || ''}
ΒΑΣΙΚΑ ΣΗΜΕΙΑ: ${(p.points || []).join(' | ')}
ΑΠΑΝΤΗΣΗ ΜΑΘΗΤΗ: ${p.answer || ''}

Επίστρεψε ΜΟΝΟ έγκυρο JSON χωρίς markdown, χωρίς σχόλια, με ΑΚΡΙΒΩΣ αυτή τη μορφή:
{"score": <ακέραιος 0-100>, "verdict": "<2-4 λέξεις>", "feedback": "<1-2 προτάσεις στα ελληνικά>", "covered": ["<σημείο που κάλυψε σωστά>"], "missed": ["<βασικό σημείο που έλειπε>"], "wrong": ["<ιστορική ανακρίβεια — [] αν καμία>"]}`;
}

function parseGraderJSON(raw) {
  let s = String(raw || '').replace(/```json/gi, '').replace(/```/g, '').trim();
  const a = s.indexOf('{'), b = s.lastIndexOf('}');
  if (a >= 0 && b >= 0) s = s.slice(a, b + 1);
  const r = JSON.parse(s);
  return {
    score:    Math.max(0, Math.min(100, parseInt(r.score, 10) || 0)),
    verdict:  String(r.verdict || ''),
    feedback: String(r.feedback || ''),
    covered:  Array.isArray(r.covered) ? r.covered.map(String) : [],
    missed:   Array.isArray(r.missed)  ? r.missed.map(String)  : [],
    wrong:    Array.isArray(r.wrong)   ? r.wrong.filter(Boolean).map(String) : [],
  };
}

// Read grader config robustly across firebase-functions versions:
//   1) environment variable (functions/.env or Secret Manager) — the modern way
//   2) legacy functions.config() — guarded, since it's removed in v7
function graderEnv(envName, legacyPath, fallback) {
  if (process.env[envName]) return process.env[envName];
  try {
    if (typeof functions.config === 'function') {
      const v = legacyPath.split('.').reduce((o, k) => (o == null ? undefined : o[k]), functions.config());
      if (v) return v;
    }
  } catch (_) { /* config() unavailable in this SDK version */ }
  return fallback;
}

exports.gradeAnswer = functions.https.onRequest(async (req, res) => {
  // Same-origin in production (Hosting rewrite); permissive CORS for safety.
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).send(''); return; }
  if (req.method !== 'POST')    { res.status(405).json({ error: 'POST only' }); return; }

  const key = graderEnv('ANTHROPIC_KEY', 'anthropic.key', null);
  if (!key) { res.status(503).json({ error: 'grader-unconfigured' }); return; } // → client offline fallback

  const p = req.body || {};
  if (typeof p.answer !== 'string' || p.answer.trim().length < 2) {
    res.status(400).json({ error: 'answer required' }); return;
  }

  try {
    const resp = await fetch(ANTHROPIC_URL, {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: graderEnv('ANTHROPIC_MODEL', 'anthropic.model', 'claude-sonnet-4-6'),
        max_tokens: 1024,
        messages: [{ role: 'user', content: buildGraderPrompt(p) }],
      }),
    });
    if (!resp.ok) {
      console.error('[gradeAnswer] upstream', resp.status, await resp.text().catch(() => ''));
      res.status(502).json({ error: 'grader-upstream' }); return;
    }
    const data = await resp.json();
    const text = (data.content || []).map(b => b.text || '').join('').trim();
    res.status(200).json(parseGraderJSON(text));
  } catch (err) {
    console.error('[gradeAnswer] failed', err);
    res.status(502).json({ error: 'grader-failed' });
  }
});
