# Λατινικά · Κείμενα — Text Analysis Panels

Per-Ενότητα Latin text-analysis panels for Λατινικά Προσανατολισμού (Γ΄ Λυκείου).
A self-contained **React 18** app (isolated in an overlay iframe, no build step to
serve, no CDN) that renders **7 parts** from one data file per text:

1. **Κείμενο** — the Latin text; hover/tap a word for full syntactic + grammatical
   analysis. "Ανάλυση σύνταξης" overlays clause brackets `[ κύριες ]` / `( δευτ. )`,
   per-word role chips, connection colours, annotation marks; "Βελάκια εξάρτησης"
   draws rectilinear dependency connectors; "Πλήρης ανάλυση" lists the numbered
   syntactic analysis. **"Άσκηση σύνταξης"** is a guided practice mode generated
   from the same data: per clause, first *βρες το ρήμα* (click the verb in the
   highlighted clause), then three-option role quizzes for υποκείμενο → αντικείμενο
   → the remaining terms, with progress, feedback and a final score.
2. **Μετάφραση** — Latin ↔ Greek aligned columns, with a hide-and-reveal practice mode.
3. **Ουσιαστικά & Επίθετα** — nouns/adjectives grouped by κλίση (declension) & γένος.
4. **Παραθετικά** — adjective degrees (θετικός/συγκριτικός/υπερθετικός) by κλίση.
5. **Αντωνυμίες** — pronouns.
6. **Ρήματα** — principal parts grouped by συζυγία (conjugation).
7. **SOS** — syntax "gotchas".
8. **Μετατροπές** — *(optional)* syntactic transformations (ανάλυση/μετατροπή
   μετοχών ↔ προτάσεων, ενεργητική ↔ παθητική σύνταξη, ευθύς ↔ πλάγιος λόγος),
   grouped into lettered sub-sections (Α, Β, Γ…). The tab **only appears** for a
   unit whose data file provides a non-empty `transforms` array — units without it
   are unaffected.

Two visual **directions** (Α · Κώδικας / Β · Εφαρμογή), each with a **dark** variant.
Teacher (admin) mode enables in-place editing + PDF/print; students get read-only.

## Files

```
games/latin-texts/
  enotita.html         ← shell (opened as ?unit=NN); loads vendor libs + panel.js + fonts.css
  app/panel.jsx        ← SOURCE of the React component (edit this)
  app/panel.js         ← COMPILED output (served) — regenerate after editing panel.jsx
  app/build.md         ← how to recompile panel.jsx → panel.js
  fonts.css, fonts/    ← vendored web fonts (Commissioner, EB Garamond, IBM Plex *)
  vendor/              ← react + react-dom (UMD, production)
  units/unitNN.js      ← ONE data module per text (the work)
```

## Adding a text (per Ενότητα)

1. Copy `units/unit16.js` → `units/unit17.js`; keep `dataVersion`. Fill `periods`
   (the text as the clause/word tree), `alignment` (phrase pairs), and the five word
   tables + `sos`. Every field is documented in `unit16.js`.
2. Register the unit in **`../../js/latin-texts-launchers.js`** → the `UNITS` map
   (`17: 'Λατινικά · Ενότητα 17 — …'`). This auto-creates `openLatinText17` and its
   manifest/launch-map entries.
3. Add a tile in **`../../js/data.js`** (subsection `gl-texts`, subject `gram-latin`):
   `g('Ενότητα 17','Unit 17','…','scroll',{fn:'openLatinText17'})`.

The data schema is the reusable core — the same categorised fields (nouns / verbs /
adjectives / pronouns / comparatives) feed the grammar exercise games.

### Optional: `transforms` (Μετατροπές)

Add a `transforms` array to a unit to surface the **Part VIII · Μετατροπές** tab
(sourced from the «Συντακτική επεξεργασία κειμένου» pages). Each entry is one
lettered sub-section; omit the field entirely and the tab never renders.

```js
transforms: [
  { id:"Α", label:"Ανάλυση μετοχών σε δευτ. προτάσεις", items:[
    { from:"aere collato",                       // original construction (Latin)
      to:["postquam aes collatum est",           // one or more results (string | string[])
          "cum aes collatum esset"],
      note:"Επιρρ. χρονική μετοχή παρακ.· …" }   // Greek explanation (optional)
  ]},
  { id:"Γ", label:"Ενεργητική → Παθητική σύνταξη", items:[
    { from:"Scipionis filiae … dotem acceperunt", to:"A filiis Scipionis … dos accepta est", note:"…" }
  ]}
]
```
