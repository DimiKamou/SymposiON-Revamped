// ============================================================
//  LABYRINTH · REIMAGINED — questions.js
//  The live, mutable global question bank + the LabQ helper the
//  engine reads at the start of every run.
//
//  • window.LB_Q  — same name & shape the old game.js exposed
//    ({q:{gr,en}, a:[...], c:correctIndex}), but now a standalone
//    global array. The site's GP subject bridge in nav.js mutates
//    this array IN PLACE (LB_Q.length = 0; LB_Q.push(...)) and
//    restores it on close, so subject launches feed their own
//    questions to the braziers untouched.
//  • window.LabQ  — { shuffled(), get(i), load(list) } reads LB_Q
//    LIVE, so whatever the bridge (or openLabyrinth(cfg.questions))
//    last wrote is what the run uses.
// ============================================================
(function () {
  'use strict';

  // Default bank (Minotaur myth + Ancient Greek grammar/epic) — carried
  // over verbatim from the original turn-based engine. Only seeded if the
  // bridge hasn't already populated LB_Q before this module loaded.
  const DEFAULTS = [
    {q:{gr:'Ποιος ήρωας σκοτώνει τον Μινώταυρο;',en:'Which hero slays the Minotaur?'},a:['Ηρακλής','Ορφέας','Θησέας','Αίας'],c:2},
    {q:{gr:'Ποια του δίνει το κουβάρι (κλωστή);',en:'Who gives him the ball of thread?'},a:['Μήδεια','Περσεφόνη','Αριάδνη','Κίρκη'],c:2},
    {q:{gr:'Σε ποιο νησί υπήρχε ο Λαβύρινθος;',en:'On which island was the Labyrinth located?'},a:['Θήρα','Κρήτη','Ρόδος','Σάμος'],c:1},
    {q:{gr:'Ποιος κατασκεύασε τον Λαβύρινθο;',en:'Who built the Labyrinth?'},a:['Ήφαιστος','Δαίδαλος','Τεχνίτης','Ίκαρος'],c:1},
    {q:{gr:'Τι ήταν ο Μινώταυρος;',en:'What was the Minotaur?'},a:['Ανθρωποτίγρης','Ανθρωπολέοντας','Ανθρωπόταυρος','Ανθρωπόλυκος'],c:2},
    {q:{gr:'Ποιος βασιλιάς ήταν πατέρας του Μινώταυρου;',en:'Which king was the stepfather of the Minotaur?'},a:['Αιγέας','Μίνωας','Μίνως','Κρέοντας'],c:2},
    {q:{gr:'Ποια είναι η γ΄ εν. ενεστ. ενεργ. του «λύω»;',en:'3rd singular present active of "λύω"?'},a:['λύεις','λύει','λύομεν','λύουσι'],c:1},
    {q:{gr:'Ποια πτώση δηλώνει το αντικείμενο;',en:'Which case marks the direct object?'},a:['Ονομαστική','Γενική','Αιτιατική','Δοτική'],c:2},
    {q:{gr:'Τι είναι η «εὐκτική»;',en:'What is the optative mood?'},a:['Χρόνος ρήματος','Φωνή ρήματος','Έγκλιση ρήματος','Πτώση'],c:2},
    {q:{gr:'Σε ποια κλίση ανήκει το «λόγος»;',en:'Which declension does "λόγος" belong to?'},a:['Α΄','Β΄','Γ΄','Δ΄'],c:1},
    {q:{gr:'Ποιος σκοτώνει τον Πάτροκλο στην Ιλιάδα;',en:'Who kills Patroclus in the Iliad?'},a:['Ἀχιλλεύς','Ἕκτωρ','Αἴας','Διομήδης'],c:1},
    {q:{gr:'Ποια θεά προστατεύει τους Αχαιούς;',en:'Which goddess protects the Achaeans?'},a:['Ἀφροδίτη','Ἥρα','Ἀθηνᾶ','Ἄρτεμις'],c:2},
    {q:{gr:'Ποιον Κύκλωπα τυφλώνει ο Οδυσσέας;',en:'Which Cyclops does Odysseus blind?'},a:['Βρόντης','Στερόπης','Πολύφημος','Άργης'],c:2},
    {q:{gr:'Ποια νύμφη κρατά τον Οδυσσέα 7 χρόνια;',en:'Which nymph keeps Odysseus for 7 years?'},a:['Κίρκη','Καλυψώ','Σκύλλα','Ναυσικά'],c:1},
    {q:{gr:'Ποιο είναι ο αόρ. α΄ εν. ενεργ. του «λύω»;',en:'Aorist active 1st sing. of "λύω"?'},a:['ἔλυον','ἔλυσα','λέλυκα','λύσω'],c:1},
    {q:{gr:'Πόσα χρόνια διαρκεί ο Τρωικός Πόλεμος;',en:'How many years did the Trojan War last?'},a:['5','7','10','12'],c:2},
    {q:{gr:'Ποια είναι η δοτική εν. του «ὁ ἄνθρωπος»;',en:'Dative singular of "ὁ ἄνθρωπος"?'},a:['ἄνθρωπον','ἀνθρώπου','ἀνθρώπῳ','ἄνθρωπε'],c:2},
    {q:{gr:'Τι σημαίνει «ἱπποδάμας»;',en:'What does "ἱπποδάμας" mean?'},a:['Πολεμιστής','Δαμαστής αλόγων','Αρχηγός','Ταχύπους'],c:1},
    {q:{gr:'Πού βρέθηκε η «Χρυσή Μάσκα του Αγαμέμνονα»;',en:'Where was the "Mask of Agamemnon" found?'},a:['Κνωσός','Δελφοί','Μυκήνες','Άργος'],c:2},
    {q:{gr:'Ποιος αποκρυπτογράφησε τη Γραμμική Β;',en:'Who deciphered Linear B?'},a:['Σλήμαν','Έβανς','Βέντρις','Ρόουλινσον'],c:2},
  ];

  // Seed the global only if nothing valid is already there. We mutate the
  // EXISTING array in place when one is present, so any reference the GP
  // bridge captured (snapshot/restore) stays the same object.
  if (!Array.isArray(window.LB_Q)) {
    window.LB_Q = DEFAULTS.slice();
  } else if (window.LB_Q.length === 0) {
    window.LB_Q.push.apply(window.LB_Q, DEFAULTS);
  }

  // Normalize one item to the engine's {q:{gr,en}, a:[...], c} shape.
  // Tolerates a plain-string q (defensive — GP bridge already emits {gr,en}).
  function norm(o) {
    if (!o) return { q: { gr: '', en: '' }, a: [], c: 0 };
    const q = (o.q && typeof o.q === 'object') ? o.q : { gr: String(o.q || ''), en: String(o.q || '') };
    const c = (typeof o.c === 'number') ? o.c : (typeof o.correct === 'number' ? o.correct : 0);
    return { q, a: Array.isArray(o.a) ? o.a : [], c };
  }

  // Shuffled index list over the LIVE bank (Fisher–Yates).
  function shuffled() {
    const n = (window.LB_Q && window.LB_Q.length) || 0;
    const idx = Array.from({ length: n }, function (_, i) { return i; });
    for (let i = n - 1; i > 0; i--) {
      const j = (Math.random() * (i + 1)) | 0;
      const tmp = idx[i]; idx[i] = idx[j]; idx[j] = tmp;
    }
    return idx;
  }

  // Fetch a normalized question by index (wraps + tolerates stale indices).
  function get(i) {
    const arr = window.LB_Q || [];
    if (!arr.length) return norm(null);
    const n = arr.length;
    const k = ((i % n) + n) % n;
    return norm(arr[k]);
  }

  // Replace the bank with an explicit set (openLabyrinth(cfg.questions)).
  // Mutates in place to preserve the array identity the bridge relies on.
  function load(list) {
    if (!Array.isArray(list) || !list.length) return;
    if (!Array.isArray(window.LB_Q)) window.LB_Q = [];
    window.LB_Q.length = 0;
    window.LB_Q.push.apply(window.LB_Q, list);
  }

  window.LabQ = {
    shuffled: shuffled,
    get: get,
    load: load,
    get length() { return (window.LB_Q || []).length; },
  };
})();
