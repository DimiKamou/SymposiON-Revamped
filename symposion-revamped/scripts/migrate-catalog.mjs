/* ────────────────────────────────────────────────────────────
   migrate-catalog.mjs — seed siteCatalog/tree from js/data.js GRADES.
   One-time: makes Firestore match the deployed static catalog, after
   which the app reads Firestore first (js/content-source.js) and the
   Studio edits go live with no redeploy.

   Run against the emulator:
     cd functions && npm install          # provides firebase-admin
     FIRESTORE_EMULATOR_HOST=localhost:8080 GCLOUD_PROJECT=symposion \
       node ../scripts/migrate-catalog.mjs
   Or against prod with a service account:
     GOOGLE_APPLICATION_CREDENTIALS=sa.json node scripts/migrate-catalog.mjs

   The projection here is byte-identical to
   ContentSource.buildCatalogFromData() in js/content-source.js — keep them
   in sync if you change one.
   ──────────────────────────────────────────────────────────── */
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';
import { loadGlobals } from './_loadStatic.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAIDEIA   = resolve(__dirname, '..');
const require   = createRequire(resolve(PAIDEIA, 'functions/package.json'));
const admin     = require('firebase-admin');

const { GRADES } = loadGlobals(resolve(PAIDEIA, 'js/data.js'), ['GRADES']);
if (!GRADES) { console.error('Could not load GRADES from js/data.js'); process.exit(1); }

// Editable content ids by game type (must match content-source.js).
const CONTENT_BY_TYPE = { 'odyssey-trivia': 'odyssey-trivia', 'lat-nouns': 'lat-nouns' };
const contentIdFor = type => CONTENT_BY_TYPE[type] || null;

function projectCatalog(GRADES) {
  const grades = Object.keys(GRADES).map(key => {
    const g = GRADES[key];
    const containers = g.subjects
      ? [{ subjects: g.subjects }]
      : (g.tracks || []).map(tr => ({ track: tr.title, subjects: tr.subjects || [] }));
    const subjects = [];
    containers.forEach(c => (c.subjects || []).forEach(s => {
      const games = [];
      if (s.featuredGame) {
        const ft = s.featuredGame.type;
        games.push({ id: `${s.id}~feat~${ft}`, sys: true, type: ft,
          label: (s.title || '') + ' (featured)', labelEn: (s.en && s.en.title) || '',
          ic: s.icon || '⭐', tier: 'free', content: contentIdFor(ft) });
      }
      (s.extraGames || []).forEach((eg, i) => games.push({
        id: `${s.id}~x${i}~${eg.type}`, srcType: eg.type, type: eg.type,
        label: eg.label || eg.type, labelEn: (eg.en && eg.en.label) || '',
        ic: eg.icon || '🎮', tier: 'free', content: contentIdFor(eg.type),
      }));
      if (s.id === 'iliada') games.push({ id: `${s.id}~trivia`, sys: true, type: 'trivia',
        label: 'Ιλιάδα Trivia', labelEn: 'Iliad Trivia', ic: '🏆', tier: 'free', content: 'iliada-trivia' });
      subjects.push({ id: s.id, icon: s.icon || '📘', label: s.title || s.id,
        labelEn: (s.en && s.en.title) || '', track: c.track || null, games });
    }));
    return { key, label: g.title || g.label || key, cycle: g.parent || '',
      hasTracks: !!g.tracks, subjects };
  });
  return { grades };
}

const tree = projectCatalog(GRADES);

admin.initializeApp();
const db = admin.firestore();
await db.doc('siteCatalog/tree').set({
  grades:    tree.grades,
  updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  updatedBy: 'migration:catalog',
}, { merge: false });

const subj = tree.grades.reduce((n, g) => n + g.subjects.length, 0);
const games = tree.grades.reduce((n, g) => n + g.subjects.reduce((m, s) => m + s.games.length, 0), 0);
console.log(`✓ siteCatalog/tree written — ${tree.grades.length} grades · ${subj} subjects · ${games} games.`);
process.exit(0);
