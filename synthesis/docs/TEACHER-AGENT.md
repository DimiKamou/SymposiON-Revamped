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

1. **Calibrate the brain** — ✅ done for Έκθεση ΘΕΜΑ 1 (Β΄ Λυκείου Τράπεζα).
2. **Backend** — ✅ `generateExam` + `adminSaveExamContent` (validated + audited)
   in `functions/index.js`; `exam` content model in `examContent/{id}`.
3. **UI** — ✅ `js/exam-agent.js` panel + "✨ Δημιουργία Θεμάτων (AI)" button in
   the ANATHESI console (`js/anathesi.js`); review/edit/select → save draft.
4. **Ingestion** — ✅ PDF/image upload → native model extraction (digital text
   *and* scanned pages via vision, no client-side PDF lib) via `ingestExamSource`;
   auto-fills ΚΕΙΜΕΝΟ 1 + captures existing θέματα. ⏳ Google Drive (needs
   app-side OAuth — deferred).
5. **Publish/attach** — ⏳ approve a draft → publish → attach to an assignment.
6. **Scale & subjects** — ⏳ Αρχαία/Λογοτεχνία pipelines; fan out whole papers.

### Deploy & try it (teacher)

1. **Key** (already set for `gradeAnswer`): `functions/.env` → `ANTHROPIC_KEY=sk-ant-…`.
2. **Deploy** the two new functions + hosting:
   ```bash
   cd synthesis
   firebase deploy --only functions:generateExam,functions:adminSaveExamContent,functions:ingestExamSource,hosting
   ```
3. *(optional)* Seed the live θεωρία so the agent uses your exact wording:
   Firestore → `config/ekthesi-theory` doc, field **`text`** = your θεωρία
   (else it falls back to the standard θεωρία baked into the function).
4. In the app: **Κονσόλα Καθηγητή → Ανάθεση → ✨ Δημιουργία Θεμάτων (AI)** →
   paste ΚΕΙΜΕΝΟ 1 → *Δημιουργία ΘΕΜΑ 1* → review/edit → *Αποθήκευση ως πρόχειρο*.

> Access: `generateExam`/`adminSaveExamContent` require the admin account or the
> `content` role (RBAC via `requireRole`). Drafts also save to local SymStore as
> a fallback, so the panel works even before the functions are deployed (it just
> can't call the model until then).

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

### 7.2 Έκθεση / Νεοελληνική Γλώσσα — **CALIBRATED** (Β΄ Λυκείου · Τράπεζα Θεμάτων)

Calibrated from 3 real teacher papers → `materials/ekthesi/sample-papers/`.
Generation menu → `materials/ekthesi/THEMA1-TOOLKIT.md`.

**Confirmed exam structure (100 μονάδες):**
- **Κείμενο 1** (μη λογοτεχνικό, με πηγή) + **Κείμενο 2** (λογοτεχνικό, με πηγή).
- **ΘΕΜΑ 1 — 35 μον** on Κ1: 3 υποερωτήματα **(10 + 10 + 15)** →
  Α κατανόηση/πύκνωση · Β οργάνωση/δομή/πειθώ · Γ γλώσσα/ύφος/λεξιλόγιο.
- **ΘΕΜΑ 2 — 30 μον** on Κ1: παραγωγή λόγου 350–400 λ. (επιστολή/άρθρο/ομιλία,
  με 1–2 ζητούμενα). *Teacher-made.*
- **ΘΕΜΑ 3 — 20 μον** on Κ2: θεωρία λογοτεχνίας (αφηγηματικοί τρόποι, αφηγητής
  ως προς συμμετοχή/γνώση, ρηματικά πρόσωπα, εικόνες). *Teacher-made.*
- **ΘΕΜΑ 4 — 15 μον** on Κ2: ερμηνεία 100–150 λ.

**The teacher's ask:** ΘΕΜΑ 1 & 4 are usually premade; ΘΕΜΑ 2 & 3 the teacher
authors. **Primary job of the agent: explore the given κείμενα and _enrich
ΘΕΜΑ 1_** with a rich bank of υποερωτήματα across the θεωρία-έκθεσης toolkit
(τρόποι ανάπτυξης, συνώνυμα/αντώνυμα, τρόποι πειθούς, κειμενικά είδη,
συνοχή/συνεκτικότητα, σημεία στίξης, ανάλυση τίτλου, δομή παραγράφου, πρόθεση
συγγραφέα, ύφος…). Secondary: draft ΘΕΜΑ 2/3/4 in the same style.

**Confirmed style rules (see toolkit for full list):**
- ΘΕΜΑ 1 & 4 → **β΄ ενικό**; ΘΕΜΑ 2 → **β΄ πληθυντικό**.
- Explicit word-limits; μονάδες split inside multi-part υποερωτήματα.
- Every answer **text-grounded** (παράδειγμα / γλωσσικές επιλογές / παραπομπή σε παράγραφο).

**▶ RESUMED — grounded on `materials/ekthesi/theory/THEORIA-EKTHESIS.md`.**
The teacher confirmed the app's θεωρία έκθεσης is essentially complete and gave
the go-ahead. Since this session can't read the live Firestore θεωρία, the agent
is grounded on the **standard-curriculum θεωρία** (the same framework), written
to `materials/ekthesi/theory/THEORIA-EKTHESIS.md`. The teacher can paste the
app's exact wording into that file anytime and it overrides. The two flagged
items — **ανάλυση τίτλου** and **τρόποι ανάπτυξης** — are now re-grounded on §6
and §1 of that theory.

**Still to confirm:**
- [x] Re-ground **ανάλυση τίτλου** (§6) + **τρόποι ανάπτυξης** (§1) on the θεωρία.
- [ ] Swap in SymposiON's exact θεωρία wording where it differs from the standard.
- [ ] Model-answer depth + exact rubric split for auto-grading.
- [ ] Any Πανελλήνιες-profile version (this calibration is Τράπεζα, Β΄ Λυκείου).
- [ ] Preferred difficulty and how many alternatives per slot to offer.

Output → `examContent` doc (schema `exam`, subject `ekthesi`, profile
`trapeza`), `status:'draft'`.

## 8. Open questions (resolve with the teacher)

- Grades/tracks in scope first? (Γ΄ Λυκείου Πανελλήνιες vs Γυμνάσιο Τράπεζα?)
- Exact Τράπεζα marking split per subject.
- Bilingual (gr/en) output, or Greek only for exam material?
- Where should the teacher's own text library live? (Storage / Drive / repo)
