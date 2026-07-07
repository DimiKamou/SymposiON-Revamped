# Teacher Agent — AI Exam & Question Authoring

> Status: **design + co-build in progress** (branch `claude/teacher-agent-assignments`)
> Owner: the teacher (admin). This doc is our shared spec **and** the log of
> "how the teacher actually thinks" — we fill the Methodology Log as we build
> real examples together, and the prompts are derived from it.

## 1. Vision

An agent that analyses teaching material the way *this* teacher does and
drafts exam-ready content — so authoring θέματα stops being manual. It must
work across the Greek high-school exam ecosystem, respect two different exam
**formats**, and always produce a **draft for review**, never auto-publish to
students.

## 2. Subjects × Exam formats

| Subject | What the agent must do | Output |
|---|---|---|
| **Νεοελληνική Γλώσσα / Έκθεση** | Ingest a Τράπεζα-Θεμάτων PDF (reuse existing θέματα), or take the teacher's own text(s); generate new θέματα | κείμενο(-α) + θέματα: περίληψη/συμπύκνωση, ερωτήσεις κατανόησης & δομής, λεξιλογικά, **παραγωγή λόγου** |
| **Λογοτεχνία** | Take a literary text; build interpretive θέματα | ερωτήσεις ερμηνείας, μορφής/τεχνικής, παράλληλο κείμενο, παραγωγή λόγου |
| **Αρχαία** | Take an ancient text → **μετάφραση** → full **συντακτική ανάλυση** → **γραμματική αναγνώριση** → *then* build the exam from that analysis | translation + grammar/syntax analysis + θέματα (γραμματικής, συντακτικού, λεξιλογίου, ερμηνείας) |

**Two exam profiles (kept strictly separate):**
- **Τράπεζα Θεμάτων** — in-school exam structure (4-θεμα layout, its marking).
- **Πανελλήνιες** — university-entrance structure (διδαγμένο + αδίδακτο for
  Αρχαία; the Γλώσσα/Λογοτεχνία combined paper), its own marking & θέματα shape.

Each profile is a distinct template + rubric; the same source text can be run
through either profile to produce a different paper.

## 3. Input ingestion

- **Paste** — quickest; a passage/text/topic straight into the panel.
- **PDF upload** — Τράπεζα Θεμάτων banks or the teacher's own material, via
  Firebase Storage; parsed (text + vision for scans) server-side.
- **Google Drive** — pull material the teacher already keeps there (Drive MCP).
- **Existing bank** — "make more like these" from a game's current `gameContent`.

## 4. Output content model (proposed)

Extends the existing content schemas (`quiz`, `paradigm`) with a richer
**`exam`** schema so a whole mock paper is one reviewable, publishable doc:

```
examContent/{id} = {
  schema: 'exam',
  subject: 'archaia' | 'ekthesi' | 'logotexnia' | ...,
  profile: 'trapeza' | 'panellinies',
  source:   { title, text, meta },              // the κείμενο(-α)
  analysis: {                                    // Αρχαία only (else null)
    translation: '…',
    grammar: [ { token, parse } … ],            // γραμματική αναγνώριση
    syntax:  [ { token, role } … ],             // συντακτική ανάλυση
  },
  themata: [
    { code:'Α', prompt:'…', type:'open|mc|fill',
      modelAnswer:'…', points:['…'], rubric:'…', marks: 25 }
    …
  ],
  status: 'draft' | 'approved' | 'published',
  updatedBy, updatedAt,
}
```

`themata[].modelAnswer` + `points[]` feed the **existing `gradeAnswer`
function** directly → generate → assign → auto-grade closes the loop.

## 5. Architecture (reuses what already ships)

- **`generateExam` Cloud Function** — a mirror of `gradeAnswer`
  (`functions/index.js:1016`): Anthropic key held server-side, Greek persona,
  strict JSON contract, offline-safe. Same deploy path.
- **Style profile** — a short, editable per-teacher/per-subject profile
  (grade, tone, bilingual gloss on/off, marking conventions) **+ few-shot**
  examples pulled from the teacher's own past θέματα, so output mimics *their*
  voice. Seeded from the Methodology Log below.
- **Server-side validation + save** — like `adminSaveGameContent`
  (`functions/index.js:896`): structural checks, `writeAudit`, whole-doc set.
- **ANATHESI panel** — a "✨ Δημιουργία Θεμάτων / Μοκ Εξέτασης" entry in the
  teacher console (`js/anathesi.js`) → pick subject + profile + input →
  review/edit the draft → publish → attach to an assignment.
- **Review queue** — drafts land in `examContent` with `status:'draft'`; the
  teacher approves/edits before publish. Nothing is student-visible until then.

## 6. Build increments

1. **Calibrate the brain** (now, in chat) — run real examples, lock the
   per-subject methodology + marking into the Methodology Log.
2. **Backend** — `generateExam` + validation/save + `examContent` schema.
3. **UI** — ANATHESI generation panel + review/edit + publish + attach.
4. **Ingestion** — PDF (Storage) & Drive; then vision for scanned banks.
5. **Scale** — once methodology is stable, fan out to generate whole papers
   (per-θέμα in parallel) and batch-expand existing banks.

## 7. Methodology Log

*The heart of the agent — each entry is a real example we did together and the
rules extracted from it. The prompts are generated from this section.*

### 7.1 Αρχαία — pipeline shape (illustrative sample, to be replaced by the teacher's real conventions)

For an unseen (αδίδακτο) line, the agent produces, in order:
1. **Μετάφραση** (meaning-based, exam-register Greek).
2. **Γραμματική αναγνώριση** — each key token: part of speech, κλίση/συζυγία,
   πτώση/πρόσωπο/χρόνος/έγκλιση, lemma.
3. **Συντακτική ανάλυση** — ρήμα, υποκείμενο, κατηγορούμενο/αντικείμενο,
   προσδιορισμοί, ειδικές δοτικές/γενικές.
4. **Θέματα**, split by profile (Τράπεζα vs Πανελλήνιες) with marks.

*(Calibration pending: exact terminology, how exhaustive the συντακτικό should
be, the teacher's Τράπεζα marking split, and their preferred θέμα wording.)*

### 7.2 Έκθεση / Νεοελληνική Γλώσσα — pipeline template (calibrating FIRST)

Source material: **`materials/ekthesi/`** (repo-root, not deployed). The teacher
adds a Τράπεζα Θεμάτων PDF (or own text); the agent ingests it, reuses any
existing θέματα, and generates new ones.

Standard exam shape (as understood — the teacher confirms exact marks/word-limits
from their PDF):

**Πανελλήνιες — Νεοελληνική Γλώσσα & Λογοτεχνία**
- 2–3 μη-λογοτεχνικά κείμενα + 1 λογοτεχνικό.
- **Θέμα Α** — περίληψη / συμπύκνωση νοήματος (word-limit: `?`, μονάδες: `?`).
- **Θέμα Β** — κατανόηση / δομή / τρόποι & μέσα πειθούς / λεξιλογικά
  (Β1, Β2, Β3…; μονάδες: `?`).
- **Θέμα Γ** — ερμηνεία λογοτεχνικού κειμένου (word-limit: `?`, μονάδες: `?`).
- **Θέμα Δ** — παραγωγή λόγου, ορισμένο επικοινωνιακό πλαίσιο
  (άρθρο/ομιλία/επιστολή; word-limit: `?`, μονάδες: `?`).

**Τράπεζα Θεμάτων (Α΄/Β΄ Λυκείου)** — 4-θεμα δομή προσαρμοσμένη ανά τάξη; exact
θέματα/marks taken from the PDF.

**Calibration checklist (fill from the teacher's real PDF + corrections):**
- [ ] Exact θέματα layout + μονάδες split for each profile.
- [ ] Word-limits (περίληψη, παραγωγή λόγου).
- [ ] Preferred phrasing/register of θέμα prompts (the teacher's voice).
- [ ] What a **model answer** + **rubric points** look like (these feed
      `gradeAnswer` for auto-scoring).
- [ ] Difficulty targeting + how distractors/traps are chosen.
- [ ] Types of παραγωγή-λόγου prompts the teacher favours.

Output → `examContent` doc (schema `exam`, subject `ekthesi`, profile
`trapeza`|`panellinies`), `status:'draft'`.

## 8. Open questions (resolve with the teacher)

- Grades/tracks in scope first? (Γ΄ Λυκείου Πανελλήνιες vs Γυμνάσιο Τράπεζα?)
- Exact Τράπεζα marking split per subject.
- Bilingual (gr/en) output, or Greek only for exam material?
- Where should the teacher's own text library live? (Storage / Drive / repo)
