/* ────────────────────────────────────────────────────────────
   migrate-content.mjs — seed gameContent/{id} from the bundled
   per-game data files. After this runs, the Studio edits those docs
   and (for quiz banks) the change is live with no redeploy.

   Run (emulator):
     cd functions && npm install
     FIRESTORE_EMULATOR_HOST=localhost:8080 GCLOUD_PROJECT=symposion \
       node ../scripts/migrate-content.mjs

   Handles automatically:
     • QUIZ        iliada-trivia, odyssey-trivia  (questions.js → units[])
     • DECLENSION  lat-nouns                       (LAT_N_DB → paradigm cells)

   Does NOT auto-convert GENERATOR-based games (their forms are computed
   from stems + ending tables, not stored). It lists them and stops — you
   decide per game: (a) materialise the generated tables into gameContent,
   or (b) edit the stems instead. See the printout at the end.
   ──────────────────────────────────────────────────────────── */
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { createRequire } from 'module';
import { loadGlobals } from './_loadStatic.mjs';
import { materializeAll } from './_materialize.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PAIDEIA   = resolve(__dirname, '..');
const require   = createRequire(resolve(PAIDEIA, 'functions/package.json'));
const admin     = require('firebase-admin');

admin.initializeApp();
const db = admin.firestore();

const docs = {};   // contentId → content doc

// ── QUIZ banks ──────────────────────────────────────────────
function quizDoc(absPath, Qname, Rname, unitWord) {
  const g = loadGlobals(absPath, [Qname, Rname]);
  const Q = g[Qname], R = g[Rname];
  if (!Q || !Q.gr) return null;
  const order = (R && R.length) ? R.slice() : [];
  Object.keys(Q.gr).forEach(k => { if (!order.includes(k)) order.push(k); });
  const units = order
    .filter(k => Q.gr[k] && Q.gr[k].length)
    .map(k => ({ key: k, label: k, questions: Q.gr[k].map(q => ({ q: q.q, opts: q.opts, ans: q.ans })), texts: [] }));
  return { schema: 'quiz', unitWord, unitWordEn: 'Rhapsody', units };
}
docs['iliada-trivia']  = quizDoc(resolve(PAIDEIA, 'games/iliada-trivia/questions.js'),  'QUESTIONS',    'RHAPSODIES',    'Ραψωδία');
docs['odyssey-trivia'] = quizDoc(resolve(PAIDEIA, 'games/odyssey-trivia/questions.js'), 'OD_QUESTIONS', 'OD_RHAPSODIES', 'Ραψωδία');

// ── DECLENSION: lat-nouns (materialised — forms are stored, not generated) ──
(function latNouns() {
  const g = loadGlobals(resolve(PAIDEIA, 'games/lat-nouns/data.js'), ['LAT_N_DB', 'LAT_N_CASES']);
  const DB = g.LAT_N_DB, CASES = g.LAT_N_CASES;
  if (!DB || !CASES) return;
  const byDecl = new Map();
  DB.forEach(r => { const d = r.d || 1; if (!byDecl.has(d)) byDecl.set(d, []); byDecl.get(d).push(r); });
  const ord = ['', 'Α΄', 'Β΄', 'Γ΄', 'Δ΄', 'Ε΄'];
  const units = [...byDecl.keys()].sort((a, b) => a - b).map(d => ({
    key: String(d), label: `${ord[d] || d} Κλίση`,
    rowAxis: CASES.slice(), colAxis: ['Ενικός', 'Πληθυντικός'],
    entries: byDecl.get(d).map(r => ({ lemma: r.l, meta: r.t || '',
      cells: CASES.map((_, i) => [r.s[i] || '', r.p[i] || '']) })),
  }));
  docs['lat-nouns'] = { schema: 'paradigm', unitWord: 'Κλίση', unitWordEn: 'Declension', units };
})();

// ── MATERIALISED generator games (option (a) — see _materialize.mjs) ──
// Their generators' output is reshaped into editable tables, faithfully.
Object.assign(docs, materializeAll(PAIDEIA));

// ── write ───────────────────────────────────────────────────
let wrote = 0;
for (const [id, content] of Object.entries(docs)) {
  if (!content || !content.units || !content.units.length) { console.warn(`· skip ${id} (no content)`); continue; }
  await db.doc(`gameContent/${id}`).set({
    ...content,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedBy: 'migration:content',
  }, { merge: false });
  const items = content.units.reduce((n, u) => n + (u.questions ? u.questions.length : u.entries.length), 0);
  console.log(`✓ gameContent/${id} — ${content.schema} · ${content.units.length} units · ${items} items`);
  wrote++;
}
console.log(`\nDone — ${wrote} content doc(s) written.`);

// ── GENERATOR-based games — manual decision required ────────
console.log(`
Decision: MATERIALISE all generator games (option (a)). Adapters live in
scripts/_materialize.mjs — each reshapes the game's own generated forms into
editable tables (faithful by construction). Done so far (9 generator games + lat-nouns declension + the quiz banks):
    • verbs:      aoristos-b, afwnolekta, rimata-mi, synirimmena  ✓
    • principal:  anwmala-rimata  ✓        εἰμί: eimi  ✓
    • nouns:      ousiastika  ✓            adjectives: epitheta, lat-epitheta  ✓

    • pronouns:   antonymies  ✓ (varying dims handled per lemma)
    • passive:    pathitiko  ✓ (stem+ending)   degrees: paratheta  ✓
    • latin:      lat-nouns, lat-epitheta, lat-verbs, lat-antonymies  ✓

Remaining — 1 game:
    • lyo — LYO_G stores ENDING-ONLY forms and applies the augment in the
      generator (aorist ending "σα" → ἔλυσα, not λυσα), so a faithful table
      can't be reconstructed from the data alone. Options: extract its stem/
      augment table, or use approach (b) edit-stems for this one game.
Add each to ADAPTERS in _materialize.mjs and map its game type in
content-source.js (_CONTENT_BY_TYPE) so the Studio opens it.`);
process.exit(0);
