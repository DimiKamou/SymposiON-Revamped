/* ════════════════════════════════════════════════════════════════════
   theory-syntax-mastery.js — the cross-lesson mastery + interleaving
   store for the Συντακτικό course. 100% client-side (localStorage) — no
   Firestore, no cost. Tracks a mastery level (0–5) per CONFUSABLE PAIR
   (the γεν↔δοτ, ειδική↔αιτιολογική… discriminations the curriculum's
   commonErrors name), so the «Μονομαχία συγχύσεων» drill (theory-syntax.js)
   can re-surface the exact pairs a student personally fails.

   Pair keys are authored on exercises (`pair`) + lessons (`confusableWith`)
   in theory-syntax-data.js. Exposes window.SyntaxMastery.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var KEY = 'syx-mastery-v1';

  // the confusable pairs this course drills (label + the disambiguating cue)
  var PAIRS = {
    'kat-vs-epith':          { label: 'κατηγορούμενο ↔ επιθετικός', cue: 'υπάρχει συνδετικό ρήμα;' },
    'eid-vs-ait':            { label: 'ειδική ↔ αιτιολογική ὅτι',   cue: 'τι ρήμα εξάρτησης;' },
    'gov-gen-vs-dot':        { label: 'γενική ↔ δοτική αντικείμενο', cue: 'σημασιολογική ομάδα ρήματος' },
    'gov-dot-vs-ait':        { label: 'δοτική ↔ αιτιατική αντικείμενο', cue: 'ποια πτώση κυβερνά το ρήμα;' },
    'plagios-eukt-vs-orist': { label: 'ευκτική πλαγίου ↔ οριστική', cue: 'ιστορικός ή αρκτικός χρόνος;' },
    'dyo-aitiat-vs-katigor-antik': { label: '2 αιτιατικές vs κατηγορούμενο του αντικειμένου', cue: 'Η δεύτερη αιτιατική είναι ξεχωριστό πράγμα (αντικείμενο) ή χαρακτηρίζει το πρώτο (κατηγ. του αντικ.); ποιῶ/καλῶ/αἱροῦμαι → κατηγ. του αντικ.' },
    'steriseos-gen-vs-ait': { label: 'γενική στέρησης vs αιτιατική', cue: 'Στο στερῶ/πληρῶ το πρόσωπο μπαίνει σε αιτιατική, το πράγμα σε γενική στέρησης/πλήρωσης.' },
    'systoicho-vs-koino-antik': { label: 'σύστοιχο vs κοινό αντικείμενο', cue: 'Είναι ομόρριζο/συγγενικό με το ρήμα (σύστοιχο) ή εξωτερικό άσχετο πράγμα (κοινό αντικείμενο);' },
    'systoicho-ptosi': { label: 'πτώση συστοίχου', cue: 'Το σύστοιχο αντικείμενο και ο προσδιορισμός του πάντα σε αιτιατική.' },
    'epirr-relation': { label: 'Ποια επιρρηματική σχέση;', cue: 'Ρώτα το ρήμα: πού; πότε; πώς; γιατί; → ονόμασε τη σχέση, όχι το μέσο εκφοράς.' },
    'meta-gen-vs-ait': { label: 'μετά + γενική (συνοδεία) vs μετά + αιτιατική (χρόνος)', cue: 'Κοίτα την πτώση: γενική → μαζί με (συνοδεία)· αιτιατική → ύστερα από (χρόνος).' },
    'dia-gen-vs-ait': { label: 'διά + γενική (μέσο) vs διά + αιτιατική (αιτία)', cue: 'Κοίτα την πτώση: γενική → διά μέσου / με (μέσο)· αιτιατική → εξαιτίας (αιτία).' },
    'eukt-eyx-vs-dyn': { label: 'Ευχετική vs Δυνητική ευκτική', cue: 'Υπάρχει ἄν; Ναι → δυνητική (πιθανό). Όχι (συχνά με εἴθε/εἰ γάρ) → ευχετική.' },
    'arn-ou-vs-mi': { label: 'Άρνηση οὐ vs μή', cue: 'οὐ αρνείται το πραγματικό (οριστική, δυνητικές). μή αρνείται το επιθυμητό (προτρεπτ. υποτ., ευχετ. ευκτ., προστακτ.).' },
    'an-dyn-vs-aor': { label: 'Δυνητικό vs Αοριστολογικό ἄν', cue: 'Κύρια + οριστ./ευκτ. → δυνητικό («θα»). Δευτερεύουσα + υποτακτική (ὅταν/ἐάν) → αοριστολογικό.' },
    'men-de-vs-ara': { label: 'μέν…δέ vs ἄρα', cue: 'μέν…δέ = αντιθετική σύνδεση δύο όρων. ἄρα = συμπερασματικό («άρα, λοιπόν»).' },
    'epith-vs-katigorim': { label: 'επιθετικός ↔ κατηγορηματικός', cue: 'θέση ως προς το άρθρο (μέσα/έξω)' },
    'parathesi-vs-epexigisi': { label: 'παράθεση ↔ επεξήγηση', cue: 'δοκίμασε το «δηλαδή»' },
    'gen-ypok-vs-antik': { label: 'γενική υποκειμενική ↔ αντικειμενική', cue: 'κάνε το ουσιαστικό ρήμα' },
    'epei-xron-vs-ait': { label: 'ἐπεί χρονικό ↔ αιτιολογικό', cue: 'χρονική ακολουθία ή λόγος;' },
    'tel-vs-apotel': { label: 'τελική ↔ αποτελεσματική', cue: 'σκοπός (ἵνα) ή αποτέλεσμα (ὥστε);' },
    'ypoth-eidos': { label: 'είδος υποθετικού λόγου', cue: 'κρίνε από την απόδοση' },
    'eidiko-vs-teliko-apar': { label: 'ειδικό ↔ τελικό απαρέμφατο', cue: 'λεκτικό/γνωστικό ή βουλητικό ρήμα;' },
    'tauto-vs-etero': { label: 'ταυτοπροσωπία ↔ ετεροπροσωπία', cue: 'πτώση κατηγορουμένου: ονομ. ή αιτ.;' },
    'metoxi-eidos': { label: 'είδος μετοχής', cue: 'έναρθρη / ζητείται από ρήμα / περίσταση;' },
    'synimmeni-vs-apolyti': { label: 'συνημμένη ↔ απόλυτη μετοχή', cue: 'έχει το υποκ. της άλλη θέση;' },
  };

  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (_) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (_) {} }
  function st(s, k) { if (!s[k]) s[k] = { right: 0, wrong: 0, streak: 0, level: 0, seen: 0 }; return s[k]; }

  // record one attempt's outcome; 2-in-a-row climbs a level, a miss drops one
  function record(pairKey, ok) {
    if (!pairKey || !PAIRS[pairKey]) return;
    var s = load(), c = st(s, pairKey);
    c.seen++;
    if (ok) { c.right++; c.streak++; if (c.streak >= 2 && c.level < 5) { c.level++; c.streak = 0; } }
    else { c.wrong++; c.streak = 0; if (c.level > 0) c.level--; }
    save(s);
  }
  function level(pairKey) { var c = load()[pairKey]; return c ? c.level : 0; }
  function board() {
    var s = load();
    return Object.keys(PAIRS).map(function (k) {
      var c = s[k] || { level: 0, seen: 0, wrong: 0 };
      return { key: k, label: PAIRS[k].label, cue: PAIRS[k].cue, level: c.level || 0, seen: c.seen || 0, wrong: c.wrong || 0 };
    });
  }
  // pairs worth drilling: not yet mastered, or with any past miss
  function weakPairs() { return board().filter(function (b) { return b.level < 3 || b.wrong > 0; }).map(function (b) { return b.key; }); }
  function allPairs() { return Object.keys(PAIRS); }
  function pairLabel(k) { return PAIRS[k] ? PAIRS[k].label : k; }
  function reset() { save({}); }

  window.SyntaxMastery = {
    record: record, level: level, board: board,
    weakPairs: weakPairs, allPairs: allPairs, pairLabel: pairLabel, reset: reset,
  };
})();
