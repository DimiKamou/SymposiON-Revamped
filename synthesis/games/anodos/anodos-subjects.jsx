/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — ΥΛΗ · subject / level selection (platform integration)
   ────────────────────────────────────────────────────────────────────
   The SymposiON platform unlocks a "class" (μάθημα) per subscription.
   Before each climb the student picks ≥ MIN_LEVELS units (ἑνότητες) from
   what they've unlocked; those units feed the battle question pool, and
   the difficulty scales by ACT (Α΄ easier → Γ΄ harder).

   ── PLATFORM CONTRACT ────────────────────────────────────────────────
   The host can override the demo syllabus by setting, before this loads:
     window.SYMPOSION_SYLLABUS = {
       id, name, en, sub,
       units: [
         { id, name, en, d:1|2|3, locked?:bool,
           mc:[{q,opts:[4],a:idx,hint,greek?,d?}],
           tf:[{s,t:bool,d?}] }, …
       ]
     }
   Everything below degrades gracefully: with no selection the battle
   system falls back to the built-in QUESTIONS / TF_BANK.
   ════════════════════════════════════════════════════════════════════ */
const { useState: useStateS, useMemo: useMemoS } = React;

const SYL_KEY = "anodos-syllabus-v1";
const MIN_LEVELS = 6;

/* ── DEMO SYLLABUS — Ὁμήρου Ἰλιάς (stands in for platform content) ───── */
const DEMO_SYLLABUS = {
  id: "iliada",
  name: "Ὁμήρου Ἰλιάς",
  en: "Homer · The Iliad",
  sub: "Ἀρχαία Ἑλληνικὴ Γραμματεία — μετάφραση & κείμενο",
  units: [
    { id: "u1", name: "Προοίμιον · Μῆνις", en: "Proem · The Wrath", d: 1, ch: "Ραψ. Α 1–7",
      mc: [
        { q: "Με ποιά λέξη ανοίγει η Ἰλιάδα;", greek: true, d: 1, opts: ["Μῆνιν", "Ἄνδρα", "Θεά", "Ὄλβιον"], a: 0, hint: "Ἡ «ὀργὴ» τοῦ Ἀχιλλέα." },
        { q: "Σὲ ποιάν ἀπευθύνεται ὁ ποιητὴς στὸ προοίμιο;", d: 1, opts: ["Στὴ Μοῦσα", "Στὸν Δία", "Στὸν Ἀπόλλωνα", "Στὴν Ἥρα"], a: 0, hint: "«ἄειδε, θεά…»" },
        { q: "Τίνος ἡ ὀργὴ εἶναι τὸ θέμα τοῦ ἔπους;", d: 1, opts: ["Τοῦ Ἀγαμέμνονος", "Τοῦ Ἀχιλλέως", "Τοῦ Ἕκτορος", "Τοῦ Διός"], a: 1, hint: "Ὁ Πηλεΐδης." },
      ],
      tf: [
        { s: "Τὸ προοίμιο ζητᾶ ἀπ' τὴ Μοῦσα νὰ τραγουδήσει τὴν ὀργὴ τοῦ Ἀχιλλέα.", t: true, d: 1 },
        { s: "Ἡ Ἰλιάδα ξεκινᾶ μὲ τὴν ἅλωση τῆς Τροίας.", t: false, d: 1 },
      ] },

    { id: "u2", name: "Χρύσης · ὁ λοιμός", en: "Chryses · The Plague", d: 1, ch: "Ραψ. Α 8–100",
      mc: [
        { q: "Ποιός ἱερέας ζήτησε πίσω τὴν κόρη του ἀπ' τὸν Ἀγαμέμνονα;", d: 1, opts: ["Κάλχας", "Χρύσης", "Λαοκόων", "Τειρεσίας"], a: 1, hint: "Ἱερέας τοῦ Ἀπόλλωνος." },
        { q: "Ποιός θεὸς ἔστειλε λοιμὸ στὸ στρατόπεδο τῶν Ἀχαιῶν;", d: 1, opts: ["Ἄρης", "Ποσειδῶν", "Ἀπόλλων", "Ἑρμῆς"], a: 2, hint: "Ὁ τοξότης θεός, μὲ τὰ βέλη του." },
        { q: "Ποιός μάντις ἀποκάλυψε τὴν αἰτία τοῦ λοιμοῦ;", d: 2, opts: ["Κάλχας", "Νέστωρ", "Χρύσης", "Ἕλενος"], a: 0, hint: "Ὁ μάντις τῶν Ἀχαιῶν." },
      ],
      tf: [
        { s: "Ὁ λοιμὸς ἔπεσε ἐπειδὴ ὁ Ἀγαμέμνων ἀτίμασε τὸν Χρύση.", t: true, d: 1 },
        { s: "Ὁ Ἀπόλλων ἔριξε τὰ βέλη του γιὰ ἐννέα ἡμέρες.", t: true, d: 2 },
      ] },

    { id: "u3", name: "Ἔρις Ἀχιλλέως–Ἀγαμέμνονος", en: "The Quarrel", d: 2, ch: "Ραψ. Α 101–305",
      mc: [
        { q: "Ποιάν αἰχμάλωτη πῆρε ὁ Ἀγαμέμνων ἀπ' τὸν Ἀχιλλέα;", d: 2, opts: ["Χρυσηίδα", "Βρισηίδα", "Ἀνδρομάχη", "Κασσάνδρα"], a: 1, hint: "Τὸ γέρας τοῦ Ἀχιλλέα." },
        { q: "Ποιά θεὰ συγκράτησε τὸν Ἀχιλλέα ἀπ' τὸ νὰ τραβήξει τὸ ξίφος;", d: 2, opts: ["Ἥρα", "Ἀθηνᾶ", "Ἀφροδίτη", "Θέτις"], a: 1, hint: "Τὸν ἅρπαξε ἀπ' τὰ μαλλιά." },
        { q: "Τί ἔκανε ὁ Ἀχιλλεὺς μετὰ τὴν προσβολή;", d: 2, opts: ["Λιποτάκτησε στὴν Τροία", "Ἀποσύρθηκε ἀπ' τὴ μάχη", "Σκότωσε τὸν Ἀγαμέμνονα", "Ἔκαψε τὰ πλοῖα"], a: 1, hint: "Μήνις — ἀποχὴ ἀπ' τὸν πόλεμο." },
      ],
      tf: [
        { s: "Ὁ Ἀχιλλεὺς παρέδωσε τὴ Βρισηίδα χωρὶς ἀντίρρηση.", t: false, d: 2 },
        { s: "Ἡ Ἀθηνᾶ ἐμφανίστηκε μόνο στὸν Ἀχιλλέα, ἀόρατη στοὺς ἄλλους.", t: true, d: 2 },
      ] },

    { id: "u4", name: "Ἑλένη & τὰ Τείχη", en: "Helen on the Walls", d: 2, ch: "Ραψ. Γ — Τειχοσκοπία",
      mc: [
        { q: "Πῶς ὀνομάζεται ἡ σκηνὴ ὅπου ἡ Ἑλένη δείχνει τοὺς Ἀχαιοὺς στὸν Πρίαμο;", d: 2, opts: ["Νέκυια", "Τειχοσκοπία", "Ἀριστεία", "Λιταί"], a: 1, hint: "«Θέα ἀπ' τὰ τείχη»." },
        { q: "Ποιοί δύο ἥρωες μονομάχησαν γιὰ τὴν Ἑλένη στὴ ραψωδία Γ;", d: 2, opts: ["Ἕκτωρ & Αἴας", "Πάρις & Μενέλαος", "Ἀχιλλεὺς & Ἕκτωρ", "Διομήδης & Αἰνείας"], a: 1, hint: "Ὁ σύζυγος κι ὁ ἁρπαγέας." },
        { q: "Ποιά θεὰ ἔσωσε τὸν Πάρι ἀπ' τὴ μονομαχία;", d: 3, opts: ["Ἀθηνᾶ", "Ἀφροδίτη", "Ἥρα", "Ἄρτεμις"], a: 1, hint: "Ἡ προστάτιδά του, τὸν τύλιξε σὲ ὁμίχλη." },
      ],
      tf: [
        { s: "Ὁ Μενέλαος νίκησε τὸν Πάρι στὴ μονομαχία.", t: true, d: 2 },
        { s: "Ἡ Ἑλένη κατονόμασε τοὺς Ἀχαιοὺς ἀρχηγοὺς στὸν Πρίαμο.", t: true, d: 2 },
      ] },

    { id: "u5", name: "Διομήδους Ἀριστεία", en: "Diomedes' Aristeia", d: 2, ch: "Ραψ. Ε",
      mc: [
        { q: "Ποιός ἥρωας τραυμάτισε ἀκόμη καὶ θεοὺς στὴν ἀριστεία του;", d: 2, opts: ["Αἴας", "Διομήδης", "Ὀδυσσεύς", "Ἰδομενεύς"], a: 1, hint: "Ὁ γιὸς τοῦ Τυδέως." },
        { q: "Ποιάν θεὰ τραυμάτισε ὁ Διομήδης στὸ χέρι;", d: 3, opts: ["Ἥρα", "Ἀφροδίτη", "Ἀθηνᾶ", "Ἄρτεμις"], a: 1, hint: "Καθὼς ἔσωζε τὸν Αἰνεία." },
        { q: "Ποιός θεὸς βοήθησε τὸν Διομήδη νὰ διακρίνει θεοὺς ἀπὸ θνητούς;", d: 2, opts: ["Ἀθηνᾶ", "Ἀπόλλων", "Ἄρης", "Ἑρμῆς"], a: 0, hint: "Τοῦ ἀφαίρεσε τὴν ἀχλὺ ἀπ' τὰ μάτια." },
      ],
      tf: [
        { s: "Ὁ Διομήδης τραυμάτισε τὸν Ἄρη μὲ τὴ βοήθεια τῆς Ἀθηνᾶς.", t: true, d: 3 },
        { s: "Ὁ Διομήδης σκότωσε τὸν Αἰνεία στὴ ραψωδία Ε.", t: false, d: 2 },
      ] },

    { id: "u6", name: "Ἕκτωρ & Ἀνδρομάχη", en: "Hector & Andromache", d: 2, ch: "Ραψ. Ζ",
      mc: [
        { q: "Ποιά ἦταν ἡ σύζυγος τοῦ Ἕκτορος;", d: 1, opts: ["Ἑκάβη", "Ἀνδρομάχη", "Κασσάνδρα", "Πολυξένη"], a: 1, hint: "Κόρη τοῦ Ἠετίωνος." },
        { q: "Πῶς λεγόταν ὁ μικρὸς γιὸς τοῦ Ἕκτορος;", d: 2, opts: ["Ἀστυάναξ", "Τηλέμαχος", "Νεοπτόλεμος", "Ὀρέστης"], a: 0, hint: "«Ἄναξ τῆς πόλεως»· τὸν λέγανε καὶ Σκαμάνδριο." },
        { q: "Γιατί φοβήθηκε τὸ παιδὶ τὸν Ἕκτορα στὸ ἀποχαιρετισμό;", d: 2, opts: ["Ἀπ' τὴ φωνή του", "Ἀπ' τὴ λαμπερὴ περικεφαλαία", "Ἀπ' τὸ δόρυ", "Ἀπ' τὰ ἄλογα"], a: 1, hint: "Ὁ λοφίον τῆς κόρυθος." },
      ],
      tf: [
        { s: "Ὁ Ἕκτωρ ἔβγαλε τὴν περικεφαλαία του γιὰ νὰ μὴν τρομάξει τὸ παιδί.", t: true, d: 2 },
        { s: "Ἡ Ἀνδρομάχη παρότρυνε τὸν Ἕκτορα νὰ ἐπιστρέψει στὴ μάχη.", t: false, d: 2 },
      ] },

    { id: "u7", name: "Πρεσβεία πρὸς Ἀχιλλέα", en: "Embassy to Achilles", d: 3, ch: "Ραψ. Ι — Λιταί",
      mc: [
        { q: "Ποιοί τρεῖς ἀπεσταλμένοι πῆγαν νὰ πείσουν τὸν Ἀχιλλέα;", d: 3, opts: ["Νέστωρ, Αἴας, Πάτροκλος", "Ὀδυσσεύς, Αἴας, Φοῖνιξ", "Διομήδης, Ὀδυσσεύς, Νέστωρ", "Μενέλαος, Ὀδυσσεύς, Αἴας"], a: 1, hint: "Ὁ πολύτροπος, ὁ Τελαμώνιος, κι ὁ γέρο-δάσκαλος." },
        { q: "Δέχτηκε ὁ Ἀχιλλεὺς τὰ δῶρα τοῦ Ἀγαμέμνονος;", d: 2, opts: ["Ναί, ἀμέσως", "Ὄχι, τὰ ἀπέρριψε", "Μόνο τὰ μισά", "Ζήτησε περισσότερα"], a: 1, hint: "Ἡ ὀργή του δὲν εἶχε σβήσει." },
        { q: "Ποιός γέροντας θύμισε στὸν Ἀχιλλέα τὰ παιδικά του χρόνια;", d: 3, opts: ["Νέστωρ", "Φοῖνιξ", "Πρίαμος", "Πηλεύς"], a: 1, hint: "Ὁ παιδαγωγός του." },
      ],
      tf: [
        { s: "Ὁ Ἀχιλλεὺς δέχτηκε νὰ ἐπιστρέψει στὴ μάχη μετὰ τὴν πρεσβεία.", t: false, d: 3 },
        { s: "Ἡ ραψωδία Ι ὀνομάζεται «Λιταί» (ἱκεσίες).", t: true, d: 2 },
      ] },

    { id: "u8", name: "Πάτροκλος · Πατρόκλεια", en: "Patroclus", d: 3, ch: "Ραψ. Π", locked: true,
      mc: [
        { q: "Τίνος τὴν πανοπλία φόρεσε ὁ Πάτροκλος;", d: 2, opts: ["Τοῦ Αἴαντος", "Τοῦ Ἀχιλλέως", "Τοῦ Διομήδους", "Τοῦ Ἀγαμέμνονος"], a: 1, hint: "Γιὰ νὰ τρομάξει τοὺς Τρῶες." },
        { q: "Ποιός σκότωσε τελικὰ τὸν Πάτροκλο;", d: 3, opts: ["Αἰνείας", "Ἕκτωρ", "Σαρπηδών", "Πάρις"], a: 1, hint: "Μὲ τὴ βοήθεια τοῦ Ἀπόλλωνος κι ἑνὸς Εὔφορβου." },
        { q: "Ποιόν γιὸ τοῦ Διὸς σκότωσε ὁ Πάτροκλος;", d: 3, opts: ["Σαρπηδόνα", "Μέμνονα", "Ραδάμανθυ", "Μίνωα"], a: 0, hint: "Βασιλιὰς τῶν Λυκίων." },
      ],
      tf: [
        { s: "Ὁ Πάτροκλος ξεπέρασε τὴν ἐντολὴ τοῦ Ἀχιλλέα καὶ κυνήγησε ὣς τὰ τείχη.", t: true, d: 3 },
        { s: "Ὁ Ἕκτωρ πῆρε τὴν πανοπλία τοῦ Ἀχιλλέα ἀπ' τὸν νεκρὸ Πάτροκλο.", t: true, d: 3 },
      ] },

    { id: "u9", name: "Μονομαχία Ἀχιλλέως–Ἕκτορος", en: "Achilles vs Hector", d: 3, ch: "Ραψ. Χ", locked: true,
      mc: [
        { q: "Ποιά θεὰ ξεγέλασε τὸν Ἕκτορα παίρνοντας τὴ μορφὴ τοῦ Δηιφόβου;", d: 3, opts: ["Ἥρα", "Ἀθηνᾶ", "Ἀφροδίτη", "Ἶρις"], a: 1, hint: "Ἡ προστάτιδα τοῦ Ἀχιλλέα." },
        { q: "Τί ἔκανε ὁ Ἀχιλλεὺς μὲ τὸ σῶμα τοῦ Ἕκτορος;", d: 2, opts: ["Τὸ ἔθαψε μὲ τιμές", "Τὸ ἔσυρε γύρω ἀπ' τὰ τείχη", "Τὸ ἔκαψε ἀμέσως", "Τὸ πῆγε στὸν Πρίαμο"], a: 1, hint: "Δεμένο στὸ ἅρμα του." },
        { q: "Τί ζύγισε ὁ Ζεὺς πρὶν τὴ μονομαχία;", d: 3, opts: ["Τὰ ὅπλα", "Τὶς μοῖρες (κῆρες) τῶν δύο", "Τὸ χρυσάφι", "Τὶς ψυχὲς τῶν νεκρῶν"], a: 1, hint: "Στὴ χρυσὴ ζυγαριά." },
      ],
      tf: [
        { s: "Ὁ Ἕκτωρ ἔτρεξε τρεῖς φορὲς γύρω ἀπ' τὰ τείχη πρὶν σταθεῖ.", t: true, d: 3 },
        { s: "Ὁ Ἀχιλλεὺς λυπήθηκε καὶ ἄφησε ἐλεύθερο τὸν Ἕκτορα.", t: false, d: 2 },
      ] },

    { id: "u10", name: "Λύτρα Ἕκτορος", en: "The Ransom of Hector", d: 3, ch: "Ραψ. Ω", locked: true,
      mc: [
        { q: "Ποιός γέρος βασιλιὰς ἱκέτεψε τὸν Ἀχιλλέα γιὰ τὸ σῶμα τοῦ γιοῦ του;", d: 1, opts: ["Νέστωρ", "Πρίαμος", "Λαέρτης", "Πηλεύς"], a: 1, hint: "Ὁ βασιλιὰς τῆς Τροίας." },
        { q: "Ποιός θεὸς συνόδευσε κρυφὰ τὸν Πρίαμο στὴ σκηνὴ τοῦ Ἀχιλλέα;", d: 3, opts: ["Ἀπόλλων", "Ἑρμῆς", "Ἄρης", "Ποσειδῶν"], a: 1, hint: "Ὁ ψυχοπομπός." },
        { q: "Πῶς κλείνει ἡ Ἰλιάδα;", d: 2, opts: ["Μὲ τὴν ἅλωση τῆς Τροίας", "Μὲ τὴν ταφὴ τοῦ Ἕκτορος", "Μὲ τὸ θάνατο τοῦ Ἀχιλλέα", "Μὲ τὸ νόστο τῶν Ἀχαιῶν"], a: 1, hint: "«Ὣς οἵ γ' ἀμφίεπον τάφον Ἕκτορος…»" },
      ],
      tf: [
        { s: "Ὁ Ἀχιλλεὺς δέχτηκε τὰ λύτρα κι ἔδωσε πίσω τὸ σῶμα τοῦ Ἕκτορος.", t: true, d: 2 },
        { s: "Ἡ Ἰλιάδα τελειώνει μὲ τὴν πτώση τῆς Τροίας ἀπ' τὸν Δούρειο Ἵππο.", t: false, d: 1 },
      ] },
  ],
};

/* ── syllabus + selection state (module-level, persisted) ───────────── */
function getSyllabus() { return window.SYMPOSION_SYLLABUS || DEMO_SYLLABUS; }
function unlockedUnits() { return getSyllabus().units.filter((u) => !u.locked); }

let _selection = (function () {
  try {
    const s = JSON.parse(localStorage.getItem(SYL_KEY));
    if (Array.isArray(s) && s.length) return s;
  } catch (e) {}
  return null;
})();

function defaultSelection() {
  return unlockedUnits().slice(0, Math.max(MIN_LEVELS, 6)).map((u) => u.id);
}
function getSelection() {
  if (_selection && _selection.length) return _selection;
  return defaultSelection();
}
function setSelection(ids) {
  _selection = [...ids];
  try { localStorage.setItem(SYL_KEY, JSON.stringify(_selection)); } catch (e) {}
}

/* ── the battle hook the engine already calls ───────────────────────── *
   ctx.getQuestions = window.getBattleQuestions(format, node)
   Returns questions in the right SHAPE for the format, ordered so that
   act-appropriate difficulty comes first. null → engine uses built-ins. */
function weightFor(d, act) {
  d = d || 1;
  if (d === act) return 4;
  if (Math.abs(d - act) === 1) return 2;
  return 1;
}
window.getBattleQuestions = function (format, node) {
  const syl = getSyllabus();
  const sel = new Set(getSelection());
  const units = syl.units.filter((u) => sel.has(u.id) && !u.locked);
  if (!units.length) return null;
  const key = format === "volley" ? "tf" : "mc";
  const all = [];
  units.forEach((u) => (u[key] || []).forEach((q) => all.push(q)));
  if (!all.length) return null;
  const act = (node && node.act) || 1;
  // weighted-random ordering by difficulty fit for this act (no duplicates)
  return all
    .map((q) => ({ q, k: Math.random() / weightFor(q.d, act) }))
    .sort((a, b) => a.k - b.k)
    .map((o) => o.q);
};

/* ── a compact summary the HUD / patron gate can show ───────────────── */
function selectionSummary() {
  const sel = new Set(getSelection());
  const units = getSyllabus().units.filter((u) => sel.has(u.id) && !u.locked);
  let mc = 0, tf = 0;
  units.forEach((u) => { mc += (u.mc || []).length; tf += (u.tf || []).length; });
  return { count: units.length, mc, tf, units };
}

/* ════════════════════════════════════════════════════════════════════
   SubjectSelect — the pre-climb syllabus picker
   ════════════════════════════════════════════════════════════════════ */
const DIFF = {
  1: { gr: "Εὔκολο", en: "Foundational", cls: "d1" },
  2: { gr: "Μέτριο", en: "Intermediate", cls: "d2" },
  3: { gr: "Δύσκολο", en: "Advanced", cls: "d3" },
};
function DiffPips({ d }) {
  return (
    <span className={"sylpips sylpips--" + (DIFF[d] ? DIFF[d].cls : "d1")} title={DIFF[d] ? DIFF[d].gr : ""}>
      {[1, 2, 3].map((i) => <i key={i} className={i <= d ? "on" : ""}></i>)}
    </span>
  );
}

function SubjectSelect({ pending, lang, onConfirm, onCancel }) {
  const syl = getSyllabus();
  const en = lang === "en";
  const [sel, setSel] = useStateS(() => {
    const cur = new Set(getSelection());
    // keep only still-unlocked ids; if empty, fall back to default
    const valid = syl.units.filter((u) => !u.locked && cur.has(u.id)).map((u) => u.id);
    return new Set(valid.length ? valid : defaultSelection());
  });
  const dailyMode = pending && pending.daily;
  const replay = pending && pending.seed != null && !dailyMode;

  const unlocked = syl.units.filter((u) => !u.locked);
  const locked = syl.units.filter((u) => u.locked);
  const enough = sel.size >= MIN_LEVELS;
  const pool = useMemoS(() => {
    let mc = 0, tf = 0;
    syl.units.forEach((u) => { if (sel.has(u.id)) { mc += (u.mc || []).length; tf += (u.tf || []).length; } });
    return { mc, tf };
  }, [sel]);

  const toggle = (u) => {
    if (u.locked) return;
    setSel((s) => {
      const n = new Set(s);
      n.has(u.id) ? n.delete(u.id) : n.add(u.id);
      return n;
    });
    if (window.playSfx) window.playSfx("click");
  };
  const selectAll = () => setSel(new Set(unlocked.map((u) => u.id)));
  const clearAll = () => setSel(new Set());

  function confirm() {
    if (!enough) return;
    // preserve syllabus order
    const ordered = syl.units.filter((u) => sel.has(u.id) && !u.locked).map((u) => u.id);
    setSelection(ordered);
    onConfirm(ordered);
  }

  return (
    <div className="scrim scrim--top" onClick={(e) => { if (e.target.classList.contains("scrim")) onCancel(); }}>
      <div className="modal modal--syl">
        <div className="modal__pad">
          <div className="modal__eyebrow">Ἡ ὕλη σου · Choose your syllabus</div>
          <h2 className="modal__title">{syl.name}</h2>
          <p className="modal__sub">{en ? syl.en : syl.sub}</p>

          <div className="syl__hint">
            <span className="syl__hint-ic">📚</span>
            <span>{en
              ? <>Pick at least <b>{MIN_LEVELS}</b> units to study this climb. Battles draw questions from your choices, and the difficulty rises with each Act — Α΄ easier, Γ΄ harder.</>
              : <>Διάλεξε τοὐλάχιστον <b>{MIN_LEVELS}</b> ἑνότητες γιὰ τούτη τὴν ἄνοδο. Οἱ μάχες ἀντλοῦν ἐρωτήσεις ἀπ' τὶς ἐπιλογές σου, κι ἡ δυσκολία ἀνεβαίνει μὲ κάθε Μέρος — Α΄ εὐκολότερο, Γ΄ δυσκολότερο.</>}</span>
          </div>

          {(dailyMode || replay) ? (
            <div className="patron-ctx">
              {dailyMode ? <span className="patron-ctx__chip">📅 {en ? "Daily seed" : "Ἡμερήσιος σπόρος"}</span> : null}
              {replay ? <span className="patron-ctx__chip">↺ {en ? "Seed replay" : "Ἐπανάληψη σπόρου"}</span> : null}
            </div>
          ) : null}

          <div className="syl__toolbar">
            <span className="syl__lbl">{en ? "Units" : "Ἑνότητες"}</span>
            <div className="syl__tools">
              <button className="syl__tool" onClick={selectAll}>{en ? "All" : "Ὅλες"}</button>
              <button className="syl__tool" onClick={clearAll}>{en ? "Clear" : "Καμία"}</button>
            </div>
          </div>

          <div className="sylgrid">
            {unlocked.map((u) => {
              const on = sel.has(u.id);
              const n = (u.mc || []).length + (u.tf || []).length;
              return (
                <button key={u.id} className={"sylcard" + (on ? " sylcard--on" : "")} onClick={() => toggle(u)} aria-pressed={on}>
                  <span className="sylcard__check">{on ? "✓" : ""}</span>
                  <span className="sylcard__body">
                    <span className="sylcard__name">{en ? u.en : u.name}</span>
                    <span className="sylcard__meta">
                      {u.ch ? <span className="sylcard__ch">{u.ch}</span> : null}
                      <DiffPips d={u.d} />
                    </span>
                  </span>
                  <span className="sylcard__count">{n} <small>{en ? "Q" : "ἐρ"}</small></span>
                </button>
              );
            })}
          </div>

          {locked.length ? (
            <>
              <div className="syl__toolbar syl__toolbar--locked">
                <span className="syl__lbl">🔒 {en ? "Locked — upgrade your subscription" : "Κλειδωμένες — ἀναβάθμισε τὴ συνδρομή"}</span>
              </div>
              <div className="sylgrid sylgrid--locked">
                {locked.map((u) => (
                  <div key={u.id} className="sylcard sylcard--locked" title={en ? "Locked content" : "Κλειδωμένο περιεχόμενο"}>
                    <span className="sylcard__check">🔒</span>
                    <span className="sylcard__body">
                      <span className="sylcard__name">{en ? u.en : u.name}</span>
                      <span className="sylcard__meta">{u.ch ? <span className="sylcard__ch">{u.ch}</span> : null}<DiffPips d={u.d} /></span>
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          <div className="syl__footer">
            <div className={"syl__count" + (enough ? " syl__count--ok" : "")}>
              <b>{sel.size}</b> / {MIN_LEVELS}+ {en ? "units" : "ἑνότητες"}
              <span className="syl__poolnote">· {pool.mc} 📜 · {pool.tf} ⚡</span>
            </div>
            <div className="btnrow" style={{ margin: 0 }}>
              <button className="btn btn--ghost" onClick={onCancel}>{en ? "Back" : "Πίσω"}</button>
              <button className="btn btn--gold" disabled={!enough} onClick={confirm}>
                {enough ? (en ? "Choose patron →" : "Διάλεξε προστάτη →") : (en ? `Pick ${MIN_LEVELS - sel.size} more` : `Ἀκόμη ${MIN_LEVELS - sel.size}`)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { SubjectSelect, getSyllabus, getSelection, setSelection, selectionSummary, MIN_LEVELS });
