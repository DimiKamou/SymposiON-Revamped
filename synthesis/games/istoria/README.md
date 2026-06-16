# Ιστορία — reimagined practice panel

A reusable, grade-parameterised History practice module, built from the
`design_handoff_istoria_reimagined` spec and matching the paideia site
(vanilla HTML/CSS/JS, loaded in an overlay iframe — no build step).

One module serves **all six history classes**. It opens as
`games/istoria/index.html?course=<id>`; the admin studio is
`games/istoria/admin.html`.

---

## Two directions, one token set

`ΑΤΛΑΣ` (light / museum) and `ΑΓΩΝ` (dark / arena) are the **same component
set** restyled by a single `<body>` class — `dir-atlas` ⇄ `dir-agon`. Both
define the **same CSS custom-property names**; only the values differ
(`css/istoria.css`, exact hex from the handoff README). The choice is
persisted in `localStorage['istoria-dir']`. The arena HUD (XP/streak/lives)
is dark-only chrome.

The top-right toggle reskins the whole panel — hub, all 7 modes, the AI
methods, and the timed exams — live.

---

## What's inside

| Area | Where | Notes |
|---|---|---|
| Hub + 7 modes | `js/hub.js` | MC, matching, 3D flashcards, timeline frieze, true/false, fill-the-gap, video+questions. One data-driven engine. |
| AI written methods | `js/methods.js` | Ανάπτυξη, Ορισμοί, Επεξεργασία Πηγής, Σ/Λ με τεκμηρίωση, Σύγκριση. |
| Timed exams | `js/test.js` | Τεστ (shuffled, length-pick) + Διαγώνισμα (fixed). Σ/Λ auto-graded; written via AI. |
| AI grading service | `js/study-kit.js` (`SK`) | Calls the backend, offline fallback, review renderer. |
| Data layer | `js/data-layer.js` (`ISTORIA`) | Content packs + localStorage overlay + JSON import/export + Firestore seam. |
| Admin studio | `admin.html` + `js/admin.js` | CRUD per class · unit · type. |
| Icons | `js/sym-icons.js` (`SYM`) | Line-art SVG + meander generator. |
| Content | `js/content/*.js` | `g3.js` (real exam content) · `scaffolds.js` (other classes). |

Accessibility: `prefers-reduced-motion` is honoured (the prototypes lacked
it). Grids collapse per the README's responsive rules.

---

## Courses (the registry)

`ISTORIA.COURSES` in `data-layer.js` maps each site history entry to a pack:

| course id | class | content |
|---|---|---|
| `g3` | Β΄ & Γ΄ Λυκείου Κατεύθυνσης | **real** (5 units × 7 modes + AI banks) |
| `gym-a` / `gym-b` / `gym-c` | Α/Β/Γ Γυμνασίου | topic scaffold, fill via admin |
| `lyk-a` | Α΄ Λυκείου | topic scaffold, fill via admin |

`nav.js` opens `?course=g3` for `istoria-g3`, and `?course=<gym-a|…>` for the
`history-game` classes. `?grade=gymA/gymB/gymC` is accepted as an alias.

---

## Data model

A pack (`window.ISTORIA_CONTENT[id]`):

```js
{
  meta:  { course, kicker, title, subtitle, category, hasAI },
  units: [ { id, rn, t, en, p, cnt } ],          // hub cards
  data:  { [unitId]: { mc:[], fc:[], match:[], tl:[], tf:[], fib:[], vid:{…} } },
  methods: { anaptyxi:[], orismoi:[], pigi:[], sl:[], sygkrisi:[],
             diagonisma:{duration,items}, test:{duration,bank} }   // AI; g3 only
}
```

Each written item carries `model` (model answer) + `points[]` (key points for
grading). `meta.hasAI` gates the §Γ/§Δ sections.

### Adding content
- **Per class, no code:** open `admin.html`, pick class → unit → type, edit.
  Edits live in `localStorage['istoria-content:<course>']`; Export/Import
  round-trips them as JSON.
- **In code:** extend the arrays in `js/content/g3.js`, or add a new pack file
  registering `window.ISTORIA_CONTENT['<id>']` and a `COURSES` entry.

### Swapping localStorage → backend
`data-layer.js` ships a Firestore adapter (`ISTORIA.remote`) writing the
editable slice to `game_data/istoria:<course>`. It's **off by default**; set
`ISTORIA.useRemote = true` after a Firebase app is initialised. The UI is
unchanged either way.

---

## AI Grading Contract

`SK.grade({ question, model, points[], answer, rubric?, subject? })` POSTs to
**`/api/gradeAnswer`** (a Hosting rewrite → the `gradeAnswer` Firebase
Function in `functions/index.js`). The Function holds the API key
server-side, builds the README's exact Greek prompt, and returns:

```json
{ "score": 0, "verdict": "", "feedback": "", "covered": [], "missed": [], "wrong": [] }
```

Comparison is **semantic** (by meaning, not word-for-word). On any failure
(key unconfigured → 503, upstream error, offline) the client degrades to a
token-overlap heuristic, flagged in the UI as *Λειτουργία επίδειξης*.

The endpoint is **subject-agnostic**: pass `subject` (e.g. `"Αρχαίων
Ελληνικών Γ΄ Λυκείου"`, `"Λογοτεχνίας Β΄ Λυκείου"`) to set the grader
persona; omitted → defaults to Ιστορία Προσανατολισμού. `SK` + the data
layer are designed to be reused by future subject panels (αρχαία,
λογοτεχνία, …) — same contract, different content packs.

**To enable live grading** (firebase-functions v7 — env vars, not `functions.config()`):
```
# paideia/functions/.env   (gitignored)
ANTHROPIC_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-sonnet-4-6   # optional
```
```
firebase deploy --only functions:gradeAnswer   # then: --only hosting
```
The key is read server-side only and is never exposed client-side. The
grader also accepts Secret Manager (`firebase functions:secrets:set
ANTHROPIC_KEY`) and, for back-compat, a legacy `functions.config()` value.

---

## Files

```
games/istoria/
├─ index.html            ← panel host (hub + 7 modes + AI methods + exams)
├─ admin.html            ← content studio (gated; demo password: admin)
├─ css/istoria.css       ← both palettes (one token set) + all components + reduced-motion
└─ js/
   ├─ sym-icons.js        SYM   — line-art icons + meander
   ├─ data-layer.js       ISTORIA — content store / overlay / import-export / Firestore seam
   ├─ study-kit.js        SK    — AI grader (→ Function) + offline fallback + review
   ├─ hub.js              HUB   — hub + 7 exercise modes
   ├─ methods.js          MT    — 5 AI-graded written methods
   ├─ test.js             TT    — Τεστ + Διαγώνισμα
   ├─ app.js                    — bootstrap: course + theme + init
   └─ content/ g3.js · scaffolds.js
```

Out of scope (per the brief): «Τα λάθη μου» / spaced repetition — handled by
the site's Τάρταρος.
