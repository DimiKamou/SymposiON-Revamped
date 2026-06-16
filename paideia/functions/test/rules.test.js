/**
 * Firestore Rules unit tests — SymposiON Command Center Guardrails
 *
 * Run:
 *   cd functions
 *   npm install --save-dev @firebase/rules-unit-testing mocha
 *   npx mocha test/rules.test.js
 *
 * Requires the Firestore emulator:
 *   firebase emulators:start --only firestore
 */

'use strict';

const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds,
} = require('@firebase/rules-unit-testing');
const { readFileSync } = require('fs');
const { resolve }      = require('path');

const RULES_PATH = resolve(__dirname, '../../firestore.rules');
const PROJECT_ID = 'symposion-rules-test';

let env;

// ── helpers ──
const asUser   = (uid, opts = {}) => env.authenticatedContext(uid, opts);
const asAnon   = ()               => env.unauthenticatedContext();
const withRole = (uid, role)      => asUser(uid, { role, admin: true });
const asSuper  = uid              => asUser(uid, { email: 'dimikamou@gmail.com' });

async function setup() {
  env = await initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(RULES_PATH, 'utf8'),
      host:  'localhost',
      port:  8080,
    },
  });
}

async function teardown() {
  await env.cleanup();
}

// ── seed helpers ──
async function seedDoc(path, data) {
  await env.withSecurityRulesDisabled(async ctx => {
    await ctx.firestore().doc(path).set(data);
  });
}

// ─────────────────────────────────────────────────────────────
//  Test suites
// ─────────────────────────────────────────────────────────────

describe('Guardrail 2 — RBAC', () => {
  before(setup);
  after(teardown);
  afterEach(() => env.clearFirestore());

  it('content role CANNOT write /coupons', async () => {
    const db = withRole('editor1', 'content').firestore();
    await assertFails(db.collection('coupons').doc('TEST10').set({ discount: 10, maxUses: 0 }));
  });

  it('support role CANNOT write /config', async () => {
    const db = withRole('support1', 'support').firestore();
    await assertFails(db.collection('config').doc('pricing').set({ student: { 1: 5 } }));
  });

  it('finance role CAN write /coupons with valid data', async () => {
    const db = withRole('finance1', 'finance').firestore();
    await assertSucceeds(
      db.collection('coupons').doc('VALID10').set({ discount: 10, maxUses: 0, active: true })
    );
  });

  it('support role CAN read /users', async () => {
    await seedDoc('users/u1', { role: 'free', email: 'test@example.com' });
    const db = withRole('support1', 'support').firestore();
    await assertSucceeds(db.doc('users/u1').get());
  });

  it('content role CANNOT delete a user', async () => {
    await seedDoc('users/u1', { role: 'free' });
    const db = withRole('editor1', 'content').firestore();
    await assertFails(db.doc('users/u1').delete());
  });

  it('super (bootstrap email) CAN delete a user', async () => {
    await seedDoc('users/u1', { role: 'free' });
    const db = asSuper('super1').firestore();
    await assertSucceeds(db.doc('users/u1').delete());
  });

  it('only super can READ /adminRoles', async () => {
    await seedDoc('adminRoles/u1', { email: 'a@b.com', role: 'content' });
    const superDb   = asSuper('super1').firestore();
    const contentDb = withRole('editor1', 'content').firestore();
    await assertSucceeds(superDb.collection('adminRoles').get());
    await assertFails(contentDb.collection('adminRoles').get());
  });

  it('no client can WRITE /adminRoles', async () => {
    const db = asSuper('super1').firestore();
    await assertFails(db.collection('adminRoles').doc('u99').set({ role: 'content' }));
  });
});


describe('Guardrail 1 — adminAudit is append-only (client side)', () => {
  before(setup);
  after(teardown);
  afterEach(() => env.clearFirestore());

  it('no client can CREATE /adminAudit', async () => {
    const db = asSuper('super1').firestore();
    await assertFails(
      db.collection('adminAudit').add({ action: 'fake', at: new Date() })
    );
  });

  it('no client can UPDATE /adminAudit', async () => {
    await seedDoc('adminAudit/log1', { action: 'role.set', actorEmail: 'a@b.com' });
    const db = asSuper('super1').firestore();
    await assertFails(db.doc('adminAudit/log1').update({ action: 'tampered' }));
  });

  it('no client can DELETE /adminAudit', async () => {
    await seedDoc('adminAudit/log1', { action: 'role.set', actorEmail: 'a@b.com' });
    const db = asSuper('super1').firestore();
    await assertFails(db.doc('adminAudit/log1').delete());
  });

  it('super CAN read /adminAudit', async () => {
    await seedDoc('adminAudit/log1', { action: 'role.set' });
    const db = asSuper('super1').firestore();
    await assertSucceeds(db.collection('adminAudit').get());
  });

  it('content role CANNOT read /adminAudit', async () => {
    await seedDoc('adminAudit/log1', { action: 'role.set' });
    const db = withRole('editor1', 'content').firestore();
    await assertFails(db.collection('adminAudit').get());
  });
});


describe('Guardrail 4 — Input validation on /coupons', () => {
  before(setup);
  after(teardown);
  afterEach(() => env.clearFirestore());

  it('REJECTS coupon with discount < 1', async () => {
    const db = withRole('finance1', 'finance').firestore();
    await assertFails(
      db.collection('coupons').doc('BAD').set({ discount: 0, maxUses: 0, active: true })
    );
  });

  it('REJECTS coupon with discount > 100', async () => {
    const db = withRole('finance1', 'finance').firestore();
    await assertFails(
      db.collection('coupons').doc('BAD').set({ discount: 101, maxUses: 0, active: true })
    );
  });

  it('REJECTS coupon with maxUses < 0', async () => {
    const db = withRole('finance1', 'finance').firestore();
    await assertFails(
      db.collection('coupons').doc('BAD').set({ discount: 20, maxUses: -1, active: true })
    );
  });

  it('ACCEPTS valid coupon (discount 1–100, maxUses 0)', async () => {
    const db = withRole('finance1', 'finance').firestore();
    await assertSucceeds(
      db.collection('coupons').doc('GOOD20').set({ discount: 20, maxUses: 0, active: true })
    );
  });

  it('ACCEPTS valid coupon at boundary (discount 100)', async () => {
    const db = withRole('finance1', 'finance').firestore();
    await assertSucceeds(
      db.collection('coupons').doc('FREE').set({ discount: 100, maxUses: 50, active: true })
    );
  });
});


describe('Guardrail 3 — GDPR consent field + user PII', () => {
  before(setup);
  after(teardown);
  afterEach(() => env.clearFirestore());

  it('users can update their own doc (not role field)', async () => {
    await seedDoc('users/u1', { role: 'student', consent: 'pending', email: 'a@b.com' });
    const db = asUser('u1').firestore();
    await assertSucceeds(db.doc('users/u1').update({ consent: 'granted' }));
  });

  it('users CANNOT change their own role', async () => {
    await seedDoc('users/u1', { role: 'free', consent: 'n/a' });
    const db = asUser('u1').firestore();
    await assertFails(db.doc('users/u1').update({ role: 'teacher' }));
  });

  it('support CAN read any user doc', async () => {
    await seedDoc('users/u2', { role: 'student', email: 'b@c.com' });
    const db = withRole('support1', 'support').firestore();
    await assertSucceeds(db.doc('users/u2').get());
  });

  it('anonymous user CANNOT read /users', async () => {
    await seedDoc('users/u1', { role: 'free' });
    const db = asAnon().firestore();
    await assertFails(db.doc('users/u1').get());
  });
});


describe('Site Studio — siteCatalog & gameContent are read-only to clients', () => {
  before(setup);
  after(teardown);
  afterEach(() => env.clearFirestore());

  it('siteCatalog/tree is world-readable', async () => {
    await seedDoc('siteCatalog/tree', { grades: [] });
    await assertSucceeds(asAnon().firestore().doc('siteCatalog/tree').get());
  });

  it('gameContent/{id} is world-readable', async () => {
    await seedDoc('gameContent/iliada-trivia', { schema: 'quiz', units: [] });
    await assertSucceeds(asAnon().firestore().doc('gameContent/iliada-trivia').get());
  });

  it('content role CANNOT write siteCatalog directly (only the Cloud Function may)', async () => {
    const db = withRole('content1', 'content').firestore();
    await assertFails(db.doc('siteCatalog/tree').set({ grades: [] }));
  });

  it('content role CANNOT write gameContent directly (only the Cloud Function may)', async () => {
    const db = withRole('content1', 'content').firestore();
    await assertFails(db.doc('gameContent/iliada-trivia').set({ schema: 'quiz', units: [] }));
  });

  it('super CANNOT write siteCatalog directly either (Admin SDK bypasses rules; clients never write)', async () => {
    const db = asSuper('boss').firestore();
    await assertFails(db.doc('siteCatalog/tree').set({ grades: [] }));
  });

  it('anonymous user CANNOT write gameContent', async () => {
    const db = asAnon().firestore();
    await assertFails(db.doc('gameContent/x').set({ schema: 'quiz', units: [] }));
  });
});
