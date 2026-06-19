/* ============================================================
   History Synthesis — shared module
   Real ΑΤΛΑΣ/ΑΓΩΝ data model: identity, thematic units, study
   modes (7 exercises + AI-graded methods + timed). Icons come
   from window.SYM (sym-icons.js). Attached to window for Babel.
   ============================================================ */
const { useState, useEffect, useRef } = React;

const T = (lang, gr, en) => (lang === "en" ? (en || gr) : (gr || en));

/* ---- SYM line-art icon (two-tone, currentColor) ------------ */
function SymIcon({ name, style }) {
  const html = (window.SYM && window.SYM.icon) ? window.SYM.icon(name) : "";
  return <span className="ico" style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}

const EMBLEM_CHOICES = ["column", "lyre", "owl", "laurel", "amphora", "scroll", "sun", "krater", "stele", "coin", "mosaic", "chisel", "theatre", "flame"];

/* ---- the study-mode catalog (admin picks & orders these) ---
   kind: ex = interactive auto-graded · ai = AI free-response ·
   timed = timed mixed assessment.                              */
const MODE_LIBRARY = [
  { id: "mc",        kind: "ex",    ico: "stele",   gr: "Πολλαπλής Επιλογής", en: "Multiple Choice", meta: { gr: "Μία σωστή από τέσσερις.", en: "One correct of four." } },
  { id: "match",     kind: "ex",    ico: "mosaic",  gr: "Αντιστοίχιση",       en: "Matching",        meta: { gr: "Ένωσε όρο με ορισμό.", en: "Pair term with definition." } },
  { id: "fc",        kind: "ex",    ico: "amphora", gr: "Κάρτες Μνήμης",      en: "Flashcards",      meta: { gr: "Λήμμα κι ερμηνεία.", en: "Lemma and meaning." } },
  { id: "tl",        kind: "ex",    ico: "column",  gr: "Χρονολόγιο",         en: "Timeline",        meta: { gr: "Τοποθέτησε στον χρόνο.", en: "Place it in time." } },
  { id: "tf",        kind: "ex",    ico: "coin",    gr: "Σωστό / Λάθος",      en: "True / False",    meta: { gr: "Η κρίση σου, μία ψήφος.", en: "Your verdict, one vote." } },
  { id: "fib",       kind: "ex",    ico: "chisel",  gr: "Συμπλήρωση",         en: "Fill the gap",    meta: { gr: "Συμπλήρωσε το κενό.", en: "Fill the blank." } },
  { id: "vid",       kind: "ex",    ico: "theatre", gr: "Βίντεο + Ερωτήσεις", en: "Video",           meta: { gr: "Παρακολούθησε & απάντησε.", en: "Watch & answer." } },
  { id: "orismoi",   kind: "ai",    ico: "scroll",  gr: "Ορισμοί",            en: "Definitions",     meta: { gr: "Γράψε τον ορισμό· κρίνει ο AI.", en: "Write it; the AI grades." } },
  { id: "pigi",      kind: "ai",    ico: "krater",  gr: "Επεξεργασία Πηγής",  en: "Source Analysis", meta: { gr: "Συνδύασε πηγή & γνώση.", en: "Combine source & knowledge." } },
  { id: "sl",        kind: "ai",    ico: "owl",     gr: "Σ/Λ με τεκμηρίωση",  en: "T/F + Justify",   meta: { gr: "Κρίνε και τεκμηρίωσε.", en: "Judge and justify." } },
  { id: "sygkrisi",  kind: "ai",    ico: "laurel",  gr: "Σύγκριση εννοιών",   en: "Compare",         meta: { gr: "Ομοιότητες & διαφορές.", en: "Similarities & differences." } },
  { id: "diagonisma",kind: "timed", ico: "flame",   gr: "Διαγώνισμα",         en: "Mock Exam",       meta: { gr: "Μικτό, με χρόνο & βαθμό.", en: "Mixed, timed & scored." } },
  { id: "test",      kind: "timed", ico: "sun",     gr: "Test",               en: "Mixed Test",      meta: { gr: "Μικτό τεστ, AI βαθμολόγηση.", en: "Mixed test, AI graded." } },
];
const modeById = (id) => MODE_LIBRARY.find((m) => m.id === id);
const KIND_LABEL = {
  ex:    { gr: "Άσκηση", en: "Exercise" },
  ai:    { gr: "AI Ανάπτυξη", en: "AI Essay" },
  timed: { gr: "Με χρόνο", en: "Timed" },
};

/* ---- helpers ---------------------------------------------- */
let __uid = 0;
const newId = () => "u" + Date.now().toString(36) + (++__uid);
const ROMAN = [[1000,"M"],[900,"CM"],[500,"D"],[400,"CD"],[100,"C"],[90,"XC"],[50,"L"],[40,"XL"],[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
function toRoman(n) { let s = ""; for (const [v, sym] of ROMAN) while (n >= v) { s += sym; n -= v; } return s || "—"; }
const mkUnit = (tgr, ten, dgr, den, cgr, cen) => ({ id: newId(), t: { gr: tgr, en: ten }, desc: { gr: dgr, en: den }, cnt: { gr: cgr, en: cen } });

function makeHistory(over) {
  return Object.assign({
    emblem: "column",
    kicker:  { gr: "Θέματα Νεοελληνικής Ιστορίας", en: "Topics in Modern Greek History" },
    title:   { gr: "ΑΤΛΑΣ", en: "ATLAS" },
    sub:     { gr: "Ιστορία Γ΄ Λυκείου — Κατεύθυνσης", en: "History · 3rd Lyceum — Advanced" },
    cat:     { gr: "ΕΞΕΤΑΣΤΕΑ ΥΛΗ · ΠΑΝΕΛΛΑΔΙΚΕΣ · ΕΚΔΟΣΗ Α΄", en: "EXAM SYLLABUS · NATIONAL EXAMS · ED. I" },
    unitsHeading: { gr: "Θεματικές Ενότητες", en: "Thematic Units" },
    modesHeading: { gr: "Τρόποι Μελέτης", en: "Study Modes" },
    tagline: { gr: "Επτά τρόποι· μία ύλη. Διάλεξε ενότητα και μέθοδο.", en: "Seven modes; one syllabus. Pick a unit and a method." },
    units: [],
    modes: ["mc", "match", "fc", "tl", "tf", "fib", "vid"],
    modeMeta: {},
    modeContent: {},
  }, over);
}

const TEMPLATES = [
  {
    id: "geniki", name: { gr: "Ιστορία Γενικής", en: "General History" },
    config: makeHistory({
      emblem: "column",
      kicker: { gr: "Ιστορία Γενικής Παιδείας", en: "General Education History" },
      title: { gr: "ΑΤΛΑΣ", en: "ATLAS" },
      sub: { gr: "Ιστορία Γ΄ Λυκείου — Γενικής Παιδείας", en: "History · 3rd Lyceum — General" },
      cat: { gr: "ΕΞΕΤΑΣΤΕΑ ΥΛΗ · Ο 20ός ΑΙΩΝΑΣ", en: "SYLLABUS · THE 20th CENTURY" },
      units: [
        { id: "gh1", t: { gr: "Α΄ Παγκόσμιος Πόλεμος", en: "World War I" }, desc: { gr: "Αίτια, εξέλιξη και συνέπειες της σύρραξης 1914–1918.", en: "Causes, course and consequences of the 1914–1918 war." }, cnt: { gr: "18 όροι", en: "18 terms" } },
        { id: "gh2", t: { gr: "Ο Μεσοπόλεμος", en: "The Interwar" }, desc: { gr: "Κρίση 1929, ολοκληρωτισμός, διεθνείς σχέσεις.", en: "The 1929 crisis, totalitarianism, international relations." }, cnt: { gr: "16 όροι", en: "16 terms" } },
        { id: "gh3", t: { gr: "Β΄ Παγκόσμιος Πόλεμος", en: "World War II" }, desc: { gr: "1939–1945: μέτωπα, Κατοχή, Ολοκαύτωμα.", en: "1939–1945: fronts, Occupation, the Holocaust." }, cnt: { gr: "22 όροι", en: "22 terms" } },
        { id: "gh4", t: { gr: "Ο Ψυχρός Πόλεμος", en: "The Cold War" }, desc: { gr: "Διπολισμός, κρίσεις, αποαποικιοποίηση.", en: "Bipolarity, crises, decolonisation." }, cnt: { gr: "20 όροι", en: "20 terms" } },
        { id: "gh5", t: { gr: "Ευρωπαϊκή Ενοποίηση", en: "European Integration" }, desc: { gr: "Από την ΕΟΚ στην Ευρωπαϊκή Ένωση.", en: "From the EEC to the European Union." }, cnt: { gr: "12 όροι", en: "12 terms" } },
      ],
      modes: ["mc", "match", "fc", "tl", "tf", "fib", "vid"],
    }),
  },
  {
    id: "katefthynsi", name: { gr: "Ιστορία Κατεύθυνσης", en: "Advanced History" },
    config: makeHistory({
      emblem: "column",
      kicker: { gr: "Θέματα Νεοελληνικής Ιστορίας", en: "Topics in Modern Greek History" },
      title: { gr: "ΑΤΛΑΣ", en: "ATLAS" },
      sub: { gr: "Ιστορία Γ΄ Λυκείου — Προσανατολισμού", en: "History · 3rd Lyceum — Advanced" },
      cat: { gr: "ΕΞΕΤΑΣΤΕΑ ΥΛΗ · ΠΑΝΕΛΛΑΔΙΚΕΣ · ΕΚΔΟΣΗ Α΄", en: "EXAM SYLLABUS · NATIONAL EXAMS · ED. I" },
      units: [
        { id: "kt_oik", t: { gr: "Οικονομία", en: "Economy" }, desc: { gr: "Αγροτικό & εργατικό ζήτημα, πτώχευση, κρίση 1929.", en: "Agrarian & labour question, bankruptcy, the 1929 crisis." }, cnt: { gr: "27 όροι", en: "27 terms" } },
        { id: "kt_pol", t: { gr: "Πολιτικά", en: "Politics" }, desc: { gr: "Κόμματα, Διχασμός, Μεγάλη Ιδέα, κοινοβουλευτισμός.", en: "Parties, the Schism, the Great Idea, parliamentarism." }, cnt: { gr: "32 όροι", en: "32 terms" } },
        { id: "kt_pros", t: { gr: "Προσφυγικό", en: "Refugees" }, desc: { gr: "Ανταλλαγή πληθυσμών, ΕΑΠ, Λοζάνη, αποκατάσταση.", en: "Population exchange, RSC, Lausanne, resettlement." }, cnt: { gr: "20 όροι", en: "20 terms" } },
        { id: "kt_kri", t: { gr: "Κρητικό", en: "Cretan" }, desc: { gr: "Κρητική Πολιτεία, Θέρισο, ένωση με την Ελλάδα.", en: "Cretan State, Therisos, union with Greece." }, cnt: { gr: "14 όροι", en: "14 terms" } },
        { id: "kt_pont", t: { gr: "Ποντιακό", en: "Pontic" }, desc: { gr: "Ελληνισμός του Πόντου, εκτοπισμοί, γενοκτονία.", en: "Pontic Hellenism, deportations, genocide." }, cnt: { gr: "12 όροι", en: "12 terms" } },
      ],
      modes: ["mc", "match", "fc", "tl", "tf", "fib", "vid", "orismoi", "pigi", "sl", "sygkrisi", "diagonisma", "test"],
      modeContent: {
        orismoi: [
          { id: "c_or1", unitId: "kt_oik", prompt: "Αγροτική μεταρρύθμιση", model: "Η αλλαγή στο καθεστώς ιδιοκτησίας της γης (ολοκληρώθηκε το 1917 από τον Βενιζέλο): κατάργηση των μεγάλων ιδιοκτησιών και κατάτμηση σε μικρές παραγωγικές μονάδες οικογενειακού χαρακτήρα." },
          { id: "c_or2", unitId: "kt_pros", prompt: "ΕΑΠ — Επιτροπή Αποκαταστάσεως Προσφύγων", model: "Αυτόνομος οργανισμός (1923–1930) με πρωτοβουλία της ΚτΕ· σκοπός η παραγωγική απασχόληση και η οριστική στέγαση των προσφύγων." },
        ],
        pigi: [
          { id: "c_pg1", unitId: "kt_pol", prompt: "Πηγή + ερώτηση: Με βάση το κείμενο και τις ιστορικές σας γνώσεις, αναλύστε τα αίτια και τις συνέπειες του Εθνικού Διχασμού (1915–1917).", model: "Διαφωνία Κωνσταντίνου–Βενιζέλου για τη στάση στον Α΄ ΠΠ· δύο κυβερνήσεις (Αθήνα/Θεσσαλονίκη)· ουσιαστική διχοτόμηση του κράτους· επίδραση στη Μικρασιατική εκστρατεία." },
        ],
      },
    }),
  },
  {
    id: "blank", name: { gr: "Κενό πρότυπο", en: "Blank" },
    config: makeHistory({
      emblem: "scroll",
      kicker: { gr: "Νέο μάθημα", en: "New subject" },
      sub: { gr: "Τίτλος μαθήματος", en: "Subject title" },
      cat: { gr: "ΕΞΕΤΑΣΤΕΑ ΥΛΗ", en: "SYLLABUS" },
      tagline: { gr: "Διάλεξε ενότητα και μέθοδο.", en: "Pick a unit and a method." },
      units: [
        { id: "ub1", t: { gr: "Ενότητα Α", en: "Unit A" }, desc: { gr: "Σύντομη περιγραφή της ενότητας.", en: "A short description of the unit." }, cnt: { gr: "0 όροι", en: "0 terms" } },
        { id: "ub2", t: { gr: "Ενότητα Β", en: "Unit B" }, desc: { gr: "Σύντομη περιγραφή της ενότητας.", en: "A short description of the unit." }, cnt: { gr: "0 όροι", en: "0 terms" } },
      ],
      modes: ["mc", "match", "fc", "tf"],
    }),
  },
];
const templateById = (id) => TEMPLATES.find((t) => t.id === id);
const cloneConfig = (c) => JSON.parse(JSON.stringify(c));

/* ---- persistence ------------------------------------------- */
const STORE_KEY = "symposion.history.synthesis.v2";
const Store = {
  load() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || null; } catch (_) { return null; } },
  save(s) { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (_) {} },
};

/* ---- shared composer pieces -------------------------------- */
function BiField({ label, value, onGr, onEn, disp, area, phGr, phEn }) {
  const cls = "hx-input" + (disp ? " disp" : "") + (area ? " area" : "");
  const Tag = area ? "textarea" : "input";
  return (
    <div className="hx-field">
      {label && <label>{label}</label>}
      <div className="hx-bi">
        <span className="hx-inwrap"><span className="hx-tag">ΕΛ</span>
          <Tag className={cls} value={value.gr || ""} placeholder={phGr} onChange={(e) => onGr(e.target.value)} />
        </span>
        <span className="hx-inwrap"><span className="hx-tag">EN</span>
          <Tag className={cls} value={value.en || ""} placeholder={phEn} onChange={(e) => onEn(e.target.value)} />
        </span>
      </div>
    </div>
  );
}

function Section({ n, name, meta, open, onToggle, children }) {
  return (
    <div className={"hx-sec" + (open ? " open" : "")}>
      <button type="button" className="hx-sec-h" onClick={onToggle}>
        <span className="hx-sec-n">{n}</span>
        <span className="hx-sec-name">{name}</span>
        {meta != null && <span className="hx-sec-meta">{meta}</span>}
        <span className="hx-sec-chev">›</span>
      </button>
      <div className="hx-sec-body">{children}</div>
    </div>
  );
}

Object.assign(window, {
  T, SymIcon, EMBLEM_CHOICES, MODE_LIBRARY, modeById, KIND_LABEL,
  newId, toRoman, mkUnit, makeHistory, TEMPLATES, templateById, cloneConfig, Store,
  BiField, Section,
});
