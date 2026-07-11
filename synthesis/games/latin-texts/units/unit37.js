// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 37
//  Lectio XXXVII — «Η κατάρα των εμφυλίων πολέμων» (Cicero, Epist. ad Fam.)
//  Δομή ίδια με το template (unit16.js): periods -> kids (λέξεις/προτάσεις),
//  alignment, nouns, adjectives, comparatives, pronouns, verbs, sos.
//  + προαιρετικά πεδία `transforms` (Μέρος VIII) & `etymology` (Μέρος IX).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 37,
  title: "Η κατάρα των εμφυλίων πολέμων",
  latinTitle: "Lectio XXXVII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"In eum locum", k:"locus", r:"Εμπρόθετος προσδ. της εισόδου σε κατάσταση", to:"στο deducta est", g:"in (πρόθ. + αιτ.) + eum locum (αιτ. ενικ., αρσ.)", d:"in — σε· locus, -i (αρσ. β΄) — ο τόπος, το σημείο", note:"eum (is, ea, id): επιθ. προσδ. στο locum· δεικτική που προεξαγγέλλει τη συμπερασματική ut-πρόταση." },
        { l:"res", r:"Υποκείμενο", to:"στο deducta est", g:"ονομ. ενικ., θηλ. — ουσιαστικό ε΄ κλ.", d:"res, rei (θηλ. ε΄) — το πράγμα" },
        { l:"deducta est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής", d:"deduco, deduxi, deductum, deducĕre (3) (< de + duco) — οδηγώ, καταντώ", note:"in eum locum res deducta est = τα πράγματα έχουν φτάσει σε τέτοιο σημείο.", a:"," }
      ]},
      { type:"sub", key:"symperasmatiki", label:"Συμπερασματική", note:"Δευτ. επιρρ. συμπερασματική (αποτελέσματος) στο deducta est· εισάγεται με ut (αρνητική: nequeamus), προεξαγγέλλεται από το eum. Υποτακτική ενεστώτα (nequeamus) — ιδιομορφία στην ακολουθία των χρόνων (συγχρονισμός).", kids:[
        { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός συμπερασματικός σύνδεσμος", d:"ut — ώστε", a:"," },
        { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"Δευτ. επιρρ. υποθετική (υπόθεση)· εξαρτημένος υποθετικός λόγος — α΄ είδος (ανοιχτή για το μέλλον). nisi + υποτ. παρακειμένου (subvenerit)· απόδοση η συμπερασματική.", kids:[
          { l:"nisi", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός (αποφατικός) σύνδεσμος", d:"nisi — αν δεν" },
          { l:"qui", r:"Επιθετικός προσδ.", to:"στο deus", g:"ονομ. ενικ., αρσ. — αόριστη επιθετική αντωνυμία", d:"qui, qua (quae), quod — κάποιος, -α, -ο (= aliqui)" },
          { l:"deus", r:"Υποκείμενο", to:"στο subvenerit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"deus, -i (αρσ. β΄) — ο θεός" },
          { l:"vel", r:"Σύνδεσμος", g:"παρατακτικός διαζευκτικός σύνδεσμος", d:"vel — ή, είτε" },
          { l:"casus", r:"Υποκείμενο", to:"στο subvenerit", g:"ονομ. ενικ., αρσ. — ουσιαστικό δ΄ κλ.", d:"casus, -us (αρσ. δ΄) — η τύχη, το τυχαίο περιστατικό" },
          { l:"aliqui", r:"Επιθετικός προσδ.", to:"στο casus", g:"ονομ. ενικ., αρσ. — αόριστη επιθετική αντωνυμία", d:"aliqui, aliqua, aliquod — κάποιος, -α, -ο" },
          { l:"subvenerit", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρακειμένου ενεργ. φωνής", d:"subvenio, subveni, subventum, subvenīre (4) (< sub + venio) — βοηθώ", a:"," }
        ]},
        { l:"salvi", r:"Κατηγορούμενο", to:"στο εννοούμενο υποκ. nos (μέσω esse)", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ.", d:"salvus, -a, -um — σώος, -α, -ο" },
        { l:"esse", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο nequeamus", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι" },
        { l:"nequeamus", r:"Ρήμα", g:"α΄ πληθ. υποτ. ενεστ. — ανώμαλο (ελλειπτικό)", d:"nequeo, nequivi (nequii), —, nequīre (< ne + queo) — δεν μπορώ", note:"Εννοούμενο υποκ.: (nos)· ταυτοπροσωπία με το esse.", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Equidem", r:"Επιρρ. προσδ. του τρόπου", to:"στο non destiti", g:"τροπικό βεβαιωτικό επίρρημα", d:"equidem — (εγώ) βέβαια", a:"," },
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική στο non destiti· εισάγεται με χρονικό ut, οριστική (μόνο χρόνος), παρακειμένου (veni) — προτερόχρονο.", kids:[
          { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός χρονικός σύνδεσμος", d:"ut — μόλις, όταν" },
          { l:"veni", r:"Ρήμα", g:"α΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"venio, veni, ventum, venīre (4) — έρχομαι", note:"Εννοούμενο υποκ.: (ego)." },
          { l:"ad urbem", k:"urbs", r:"Εμπρόθετος προσδ. της κατεύθυνσης σε τόπο", to:"στο veni", g:"ad (πρόθ. + αιτ.) + urbem (αιτ. ενικ., θηλ.)", d:"ad — σε, προς· urbs, urbis (θηλ. γ΄) — η πόλη (= η Ρώμη)", a:"," }
        ]},
        { l:"non destiti", r:"Ρήμα", g:"α΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής (+ non)", d:"desisto, destiti, —, desistĕre (3) (< de + sisto) — σταματώ", note:"Εννοούμενο υποκ.: (ego)." },
        { l:"omnia", r:"Αντικείμενο", to:"στα sentire, dicere, facere", g:"αιτ. πληθ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"omnis, -is, -e — όλος, καθένας" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"sentire", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο non destiti", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"sentio, sensi, sensum, sentīre (4) — αισθάνομαι, πιστεύω, κρίνω" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"dicere", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο non destiti", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέω" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"facere", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο non destiti", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"facio, feci, factum, facĕre (3, σε -io) — κάνω", note:"Ταυτοπροσωπία: εννοούμενο υποκ. (ego) στα τρία τελικά απαρέμφατα.", a:"," }
      ]},
      { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο omnia· υποτακτική (πλάγιος λόγος, δυνητική), παρατατικού (pertinerent) — σύγχρονο στο παρελθόν.", kids:[
        { l:"quae", r:"Υποκείμενο", to:"στο pertinerent", g:"ονομ. πληθ., ουδ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος, η οποία, το οποίο" },
        { l:"ad concordiam", k:"concordia", r:"Εμπρόθετος προσδ. του σκοπού", to:"στο pertinerent", g:"ad (πρόθ. + αιτ.) + concordiam (αιτ. ενικ., θηλ.)", d:"ad — προς· concordia, -ae (θηλ. α΄) — η ομόνοια" },
        { l:"pertinerent", r:"Ρήμα", g:"γ΄ πληθ. υποτ. παρατατικού ενεργ. φωνής", d:"pertineo, pertinui, pertentum, pertinēre (2) (< per + teneo) — στοχεύω, αφορώ", a:";" }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"sed", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"sed — αλλά" },
        { l:"tantus", r:"Επιθετικός προσδ.", to:"στο furor", g:"ονομ. ενικ., αρσ. — δεικτική αντωνυμία", d:"tantus, tanta, tantum — τόσος, -η, -ο", note:"Προεξαγγέλλει τη συμπερασματική ut-πρόταση." },
        { l:"furor", r:"Υποκείμενο", to:"στο invaserat", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"furor, furoris (αρσ. γ΄) — η μανία" },
        { l:"omnes", r:"Αντικείμενο", to:"στο invaserat", g:"αιτ. πληθ., αρσ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"omnis, -is, -e — όλος, καθένας" },
        { l:"invaserat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσυντελίκου ενεργ. φωνής", d:"invado, invasi, invasum, invadĕre (3) (< in + vado) — καταλαμβάνω, πιάνω", a:"," }
      ]},
      { type:"sub", key:"symperasmatiki", label:"Συμπερασματική", note:"Δευτ. επιρρ. συμπερασματική στο invaserat· ut (καταφατική), προεξαγγέλλεται από tantus. Υποτακτική παρατατικού (cuperent) — ιδιομορφία (συγχρονισμός).", kids:[
        { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός συμπερασματικός σύνδεσμος", d:"ut — ώστε" },
        { l:"pugnare", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο cuperent", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"pugno, pugnāvi, pugnatum, pugnāre (1) — μάχομαι, πολεμώ" },
        { l:"cuperent", r:"Ρήμα", g:"γ΄ πληθ. υποτ. παρατατικού ενεργ. φωνής", d:"cupio, cupivi (cupii), cupitum, cupĕre (3, σε -io) — επιθυμώ", note:"Εννοούμενο υποκ.: (omnes)· ταυτοπροσωπία με το pugnare.", a:"," }
      ]},
      { type:"sub", key:"enantiomatiki", label:"Εναντιωματική", note:"Δευτ. επιρρ. εναντιωματική στο invaserat· εισάγεται με etsi, οριστική (πραγματική κατάσταση), παρατατικού (clamabam).", kids:[
        { l:"etsi", r:"Σύνδεσμος", g:"υποτακτικός εναντιωματικός σύνδεσμος", d:"etsi — αν και" },
        { l:"ego", r:"Υποκείμενο", to:"στο clamabam", g:"ονομ. ενικ. — προσωπική αντωνυμία α΄ προσ.", d:"ego — εγώ" },
        { l:"clamabam", r:"Ρήμα", g:"α΄ ενικ. οριστ. παρατατικού ενεργ. φωνής", d:"clamo, clamāvi, clamatum, clamāre (1) — φωνάζω" },
        { l:"nihil", r:"Υποκείμενο απαρεμφάτου & α΄ όρος σύγκρισης", to:"στο esse (ετεροπροσωπία)", g:"αιτ. ενικ., ουδ. — αόριστη ουσιαστική αντωνυμία", d:"nihil — τίποτα" },
        { l:"esse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο clamabam", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι" },
        { l:"bello", r:"Β΄ όρος σύγκρισης (αφαιρετική συγκριτική)", to:"στο miserius", g:"αφαιρ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"bellum, -i (ουδ. β΄) — ο πόλεμος", note:"bello = quam bellum (αιτ.)· απλή (συγκριτική) αφαιρετική." },
        { l:"civili", r:"Επιθετικός προσδ.", to:"στο bello", g:"αφαιρ. ενικ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"civilis, -is, -e — εμφύλιος, -α, -ο" },
        { l:"miserius", r:"Κατηγορούμενο", to:"στο nihil (μέσω esse)", g:"αιτ. ενικ., ουδ. — επίθ. β΄ κλ., συγκριτικού βαθμού", d:"miserior, -ior, -ius (< miser, misera, miserum) — πιο άθλιος, αξιοθρήνητος", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Omnia", r:"Υποκείμενο", to:"στο sunt", g:"ονομ. πληθ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"omnis, -is, -e — όλος, καθένας" },
        { l:"sunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. — συνδετικό", d:"sum, fui, —, esse — είμαι" },
        { l:"misera", r:"Κατηγορούμενο", to:"στο Omnia (μέσω sunt)", g:"ονομ. πληθ., ουδ. — επίθ. β΄ κλ.", d:"miser, misera, miserum — άθλιος, δυστυχής, αξιοθρήνητος" },
        { l:"in bellis", k:"bellum", r:"Εμπρόθετος προσδ. του χρόνου", to:"στο sunt", g:"in (πρόθ. + αφαιρ.) + bellis (αφαιρ. πληθ., ουδ.)", d:"in — σε· bellum, -i (ουδ. β΄) — ο πόλεμος" },
        { l:"civilibus", r:"Επιθετικός προσδ.", to:"στο bellis", g:"αφαιρ. πληθ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"civilis, -is, -e — εμφύλιος, -α, -ο", a:"," }
      ]},
      { l:"sed", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"sed — αλλά", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Συνδέεται παρατακτικά αντιθετικά (sed) με την προηγούμενη κύρια· εννοείται το ρήμα est.", kids:[
        { l:"nihil", r:"Υποκείμενο & α΄ όρος σύγκρισης", to:"στο εννοούμενο est", g:"ονομ. ενικ., ουδ. — αόριστη ουσιαστική αντωνυμία", d:"nihil — τίποτα" },
        { l:"miserius", r:"Κατηγορούμενο", to:"στο nihil (μέσω est)", g:"ονομ. ενικ., ουδ. — επίθ. β΄ κλ., συγκριτικού βαθμού", d:"miserior, -ior, -ius (< miser) — πιο αξιοθρήνητος" },
        { l:"quam", r:"Β΄ όρος σύγκρισης (μόριο)", to:"στο miserius", g:"παραβολικό επίρρημα (εισάγει β΄ όρο σύγκρισης)", d:"quam — παρά, από" },
        { l:"ipsa", r:"Κατηγορηματικός προσδ.", to:"στο victoria", g:"ονομ. ενικ., θηλ. — δεικτική/οριστική αντωνυμία", d:"ipse, ipsa, ipsum — ο ίδιος, η ίδια, το ίδιο" },
        { l:"victoria", r:"Β΄ όρος σύγκρισης (ομοιόπτωτα με quam)", to:"στο miserius", g:"ονομ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"victoria, -ae (θηλ. α΄) — η νίκη", note:"quam ipsa victoria = ομοιόπτωτος β΄ όρος (ονομ.)· ισοδύναμα με απλή αφαιρετική (ipsa victoria).", a:":" }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"ea", r:"Υποκείμενο", to:"στο reddit", g:"ονομ. ενικ., θηλ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό", note:"ea = victoria." },
        { l:"victores", r:"Αντικείμενο", to:"στο reddit", g:"αιτ. πληθ., αρσ. — ουσιαστικό γ΄ κλ.", d:"victor, victoris (αρσ. γ΄) — ο νικητής" },
        { l:"ferociores", r:"Κατηγορούμενο (του αντικειμένου)", to:"στο victores", g:"αιτ. πληθ., αρσ. — επίθ. γ΄ κλ., συγκριτικού βαθμού", d:"ferocior, -ior, -ius (< ferox, ferocis) — αγριότερος" },
        { l:"impotentioresque", r:"Κατηγορούμενο (του αντικειμένου)", to:"στο victores", g:"αιτ. πληθ., αρσ. — επίθ. γ΄ κλ., συγκριτικού βαθμού (+ -que)", d:"impotentior, -ior, -ius (< impotens, impotentis) — πιο αχαλίνωτος· -que — και", note:"ferociores impotentioresque = αγριότερους και πιο αχαλίνωτους (απ' ό,τι συνήθως)." },
        { l:"reddit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"reddo, reddidi, redditum, reddĕre (3) (red + do) — καθιστώ, κάνω", note:"Σύνταξη με διπλή αιτιατική (αντικ. + κατηγορούμενο του αντικειμένου).", a:"," }
      ]},
      { type:"sub", key:"symperasmatiki", label:"Συμπερασματική", note:"Δευτ. επιρρ. συμπερασματική στο reddit· ut (καταφατική), υποτακτική ενεστώτα (cogantur) — ιδιομορφία (συγχρονισμός).", kids:[
        { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός συμπερασματικός σύνδεσμος", d:"ut — ώστε", a:"," },
        { type:"sub", key:"paraxoritiki", label:"Παραχωρητική", note:"Δευτ. επιρρ. παραχωρητική στο cogantur· etiamsi + υποτακτική (υποθετική κατάσταση), ενεστώτα (non sint) — σύγχρονο στο παρόν.", kids:[
          { l:"etiamsi", r:"Σύνδεσμος", g:"υποτακτικός παραχωρητικός σύνδεσμος", d:"etiamsi — ακόμη κι αν" },
          { l:"natura", r:"Αφαιρετική (οργανική) του τρόπου", to:"στο non sint", g:"αφαιρ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"natura, -ae (θηλ. α΄) — η φύση", note:"natura = από τη φύση (τους)." },
          { l:"tales", r:"Κατηγορούμενο", to:"στο εννοούμενο υποκ. victores (μέσω sint)", g:"ονομ. πληθ., αρσ. — δεικτική αντωνυμία", d:"talis, talis, tale — τέτοιος, -α, -ο" },
          { l:"non", r:"Άρνηση", g:"αρνητικό μόριο", d:"non — δεν, όχι" },
          { l:"sint", r:"Ρήμα", g:"γ΄ πληθ. υποτ. ενεστ. — συνδετικό", d:"sum, fui, —, esse — είμαι", note:"Εννοούμενο υποκ.: (victores).", a:"," }
        ]},
        { l:"necessitate", r:"Αφαιρετική της αιτίας", to:"στο cogantur", g:"αφαιρ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"necessitas, necessitatis (θηλ. γ΄) — η ανάγκη", note:"Εξωτερικό αναγκαστικό αίτιο." },
        { l:"esse", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο cogantur", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι", note:"Εννοούμενο κατηγορούμενο (tales) στο εννοούμενο υποκ. victores." },
        { l:"cogantur", r:"Ρήμα", g:"γ΄ πληθ. υποτ. ενεστ. παθ. φωνής", d:"cogo, coegi, coactum, cogĕre (3) (< cum + ago) — εξαναγκάζω", note:"Εννοούμενο υποκ.: (victores)· ταυτοπροσωπία με το esse.", a:"." }
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Bellorum", r:"Γενική υποκειμενική", to:"στο exitus", g:"γεν. πληθ., ουδ. — ουσιαστικό β΄ κλ.", d:"bellum, -i (ουδ. β΄) — ο πόλεμος" },
        { l:"enim", r:"Σύνδεσμος", g:"παρατακτικός αιτιολογικός σύνδεσμος", d:"enim — γιατί, πράγματι" },
        { l:"civilium", r:"Επιθετικός προσδ.", to:"στο Bellorum", g:"γεν. πληθ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"civilis, -is, -e — εμφύλιος, -α, -ο" },
        { l:"exitus", r:"Υποκείμενο", to:"στο sunt", g:"ονομ. πληθ., αρσ. — ουσιαστικό δ΄ κλ.", d:"exitus, -us (αρσ. δ΄) — η έκβαση" },
        { l:"tales", r:"Κατηγορούμενο", to:"στο exitus (μέσω sunt)", g:"ονομ. πληθ., αρσ. — δεικτική αντωνυμία", d:"talis, talis, tale — τέτοιος, -α, -ο", note:"Προεξαγγέλλει τις συμπερασματικές ut-προτάσεις." },
        { l:"sunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. — συνδετικό", d:"sum, fui, —, esse — είμαι" },
        { l:"semper", r:"Επιρρ. προσδ. του χρόνου", to:"στο sunt", g:"χρονικό επίρρημα", d:"semper — πάντα", a:"," }
      ]},
      { type:"sub", key:"symperasmatiki", label:"Συμπερασματική", note:"Δευτ. επιρρ. συμπερασματική στο sunt· ut (με non — επιμεριστική), προεξαγγέλλεται από tales. Υποτακτική ενεστώτα (fiant) — ιδιομορφία (συγχρονισμός).", kids:[
        { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός συμπερασματικός σύνδεσμος", d:"ut — ώστε" },
        { l:"non", r:"Άρνηση", g:"αρνητικό μόριο (non solum … sed etiam)", d:"non solum — όχι μόνο" },
        { l:"solum", r:"Επιρρ. προσδ. του ποσού", to:"στο fiant", g:"ποσοτικό επίρρημα", d:"solum — μόνο" },
        { l:"ea", r:"Υποκείμενο", to:"στο fiant", g:"ονομ. πληθ., ουδ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό" },
        { l:"fiant", r:"Ρήμα", g:"γ΄ πληθ. υποτ. ενεστ. — ανώμαλο", d:"fio, factus sum, —, fieri — γίνομαι", note:"Χρησιμεύει ως παθητικό του facio.", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο ea· υποτακτική λόγω έλξης (από fiant), ενεστώτα (velit) — σύγχρονο στο παρόν.", kids:[
          { l:"quae", r:"Αντικείμενο", to:"στο velit", g:"αιτ. πληθ., ουδ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος, η οποία, το οποίο" },
          { l:"velit", r:"Ρήμα", g:"γ΄ ενικ. υποτ. ενεστ. — ανώμαλο", d:"volo, volui, —, velle — θέλω" },
          { l:"victor", r:"Υποκείμενο", to:"στο velit", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"victor, victoris (αρσ. γ΄) — ο νικητής", a:"," }
        ]}
      ]},
      { l:"sed", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος (non solum … sed etiam)", d:"sed — αλλά", conn:true },
      { l:"etiam", r:"Σύνδεσμος", g:"παρατακτικός (επιδοτικός) σύνδεσμος", d:"etiam — και, ακόμη", conn:true },
      { type:"sub", key:"symperasmatiki", label:"Συμπερασματική", note:"Δευτ. επιρρ. συμπερασματική στο sunt, συνδεόμενη παρατακτικά (non solum … sed etiam) με την προηγούμενη· ut (καταφατική), υποτακτική ενεστώτα (obsequatur).", kids:[
        { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός συμπερασματικός σύνδεσμος", d:"ut — ώστε" },
        { l:"victor", r:"Υποκείμενο", to:"στο obsequatur", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"victor, victoris (αρσ. γ΄) — ο νικητής" },
        { l:"obsequatur", r:"Ρήμα", g:"γ΄ ενικ. υποτ. ενεστ. — αποθετικό", d:"obsequor, obsecutus sum, (obsecutum), obsequi (3, αποθετικό) (< ob + sequor) — κάνω το χατίρι (+ δοτ.)" },
        { l:"iis", r:"Αντικείμενο", to:"στο obsequatur", g:"δοτ. πληθ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο iis· υποτακτική λόγω έλξης (από obsequatur), παρακειμένου (parta sit) — προτερόχρονο στο παρόν.", kids:[
          { l:"quorum", r:"Γενική υποκειμενική", to:"στο auxilio", g:"γεν. πληθ., αρσ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος", note:"quorum auxilio = per quos (ισοδύναμος τρόπος εκφοράς του μέσου)." },
          { l:"auxilio", r:"Αφαιρετική (οργανική) του μέσου", to:"στο parta sit", g:"αφαιρ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"auxilium, -ii (-i) (ουδ. β΄) — η βοήθεια", note:"auxilio + γεν. = με τη βοήθεια κάποιου. (πληθ. auxilia = επικουρικό στράτευμα)." },
          { l:"victoria", r:"Υποκείμενο", to:"στο parta sit", g:"ονομ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"victoria, -ae (θηλ. α΄) — η νίκη" },
          { l:"parta sit", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρακειμένου παθ. φωνής", d:"pario, peperi, partum, parĕre (3, σε -io) — κερδίζω, αποκτώ", a:"." }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"In eum locum res deducta est, ut, nisi qui deus vel casus aliqui subvenerit, salvi esse nequeāmus.", el:"Σε τέτοιο σημείο έχουν οδηγηθεί τα πράγματα, ώστε, αν δεν βοηθήσει κάποιος θεός ή κάποιο τυχαίο περιστατικό, να μην μπορούμε να είμαστε σώοι (= να σωθούμε)." },
    { la:"Equidem, ut vēni ad urbem, non destiti omnia et sentīre et dicere et facere, quae ad concordiam pertinērent;", el:"Εγώ βέβαια, μόλις ήρθα στην πόλη, δεν σταμάτησα και να πιστεύω και να λέω και να κάνω όλα όσα στόχευαν στην ομόνοια·" },
    { la:"sed tantus furor omnes invaserat, ut pugnāre cuperent, etsi ego clamābam nihil esse bello civili miserius.", el:"αλλά τόσο μεγάλη μανία τους είχε πιάσει όλους, ώστε να επιθυμούν να πολεμούν, αν και εγώ φώναζα ότι τίποτε δεν είναι πιο αξιοθρήνητο από τον εμφύλιο πόλεμο." },
    { la:"Omnia sunt misera in bellis civilibus, sed nihil miserius quam ipsa victoria:", el:"Όλα είναι αξιοθρήνητα στους εμφύλιους πολέμους, αλλά τίποτα (δεν είναι) πιο αξιοθρήνητο από την ίδια τη νίκη·" },
    { la:"ea victōres ferociōres impotentioresque reddit, ut, etiamsi natūrā tales non sint, necessitāte esse cogantur.", el:"αυτή κάνει τους νικητές αγριότερους και πιο αχαλίνωτους (απ' ό,τι συνήθως), ώστε, ακόμη κι αν δεν είναι τέτοιοι από τη φύση τους, να εξαναγκάζονται από ανάγκη να γίνουν." },
    { la:"Bellōrum enim civilium exitus tales sunt semper, ut non solum ea fiant, quae velit victor, sed etiam ut victor obsequātur iis, quorum auxilio victoria parta sit.", el:"Γιατί οι εκβάσεις των εμφύλιων πολέμων είναι πάντα τέτοιες, ώστε όχι μόνο να γίνονται αυτά τα οποία θέλει ο νικητής, αλλά ακόμη ο νικητής να κάνει το χατίρι εκείνων, με τη βοήθεια των οποίων κερδήθηκε η νίκη." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"concordia, -ae", note:"αφηρημένη έννοια — μόνο ενικ." },
        { form:"victoria, -ae" },
        { form:"natura, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"locus, -i", note:"ετερογενές/ετερόσημο: πληθ. loci (χωρία βιβλίου), loca (τόποι)" },
        { form:"deus, -i", note:"κλητ. dive/deus· πληθ. dei/dii/di, deorum/deum, deis/diis/dis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"bellum, -i" },
        { form:"auxilium, -ii (-i)", note:"ετερόσημο: πληθ. auxilia = επικουρικό στράτευμα" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"furor, furoris" },
        { form:"victor, victoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"urbs, urbis", note:"γεν. πληθ. -ium (urbium)· αιτ. πληθ. -es/-is" },
        { form:"necessitas, necessitatis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"casus, -us" },
        { form:"exitus, -us" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"res, rei", note:"res & dies: τα μόνα της ε΄ κλ. με πλήρη πληθυντικό" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"salvus, -a, -um", note:"δεν σχηματίζει παραθετικά (απόλυτη έννοια)" },
      { form:"miser, misera, miserum" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"omnis, -is, -e", note:"δικατάληκτο· δεν σχηματίζει παραθετικά (απόλυτη έννοια)" },
      { form:"civilis, -is, -e", note:"δικατάληκτο· δεν σχηματίζει παραθετικά (απόλυτη έννοια)" },
      { form:"ferox, ferox, ferox (ferocis)", note:"μονοκατάληκτο" },
      { form:"impotens, impotens, impotens (impotentis)", note:"μονοκατάληκτο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ ──────────────────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"miser, misera, miserum", comp:"miserior, -ior, -ius", sup:"miserrimus, -a, -um", note:"επίρρ.: misere → miserius → miserrime" },
      { pos:"salvus, -a, -um", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά (απόλυτη έννοια)" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"ferox, ferox, ferox", comp:"ferocior, -ior, -ius", sup:"ferocissimus, -a, -um", note:"επίρρ.: ferociter → ferocius → ferocissime" },
      { pos:"impotens, impotens, impotens", comp:"impotentior, -ior, -ius", sup:"impotentissimus, -a, -um", note:"επίρρ.: impotenter → impotentius → impotentissime" },
      { pos:"omnis, -is, -e / civilis, -is, -e", comp:"—", sup:"—", note:"δεν σχηματίζουν παραθετικά (απόλυτη έννοια)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική-οριστική", extra:"& ως επαναληπτική (eum, ea, iis)" },
    { form:"qui, qua (quae), quod", kind:"Αόριστη επιθετική", extra:"= aliqui (qui deus)" },
    { form:"aliqui, aliqua, aliquod", kind:"Αόριστη επιθετική", extra:"κάποιος (casus aliqui)" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"quae, quorum" },
    { form:"tantus, tanta, tantum", kind:"Δεικτική", extra:"προεξαγγέλλει τη συμπερασματική" },
    { form:"talis, talis, tale", kind:"Δεικτική", extra:"προεξαγγέλλει τη συμπερασματική" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική-οριστική", extra:"δηλώνει ταυτότητα (ipsa)" },
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσώπου" },
    { form:"nihil", kind:"Αόριστη ουσιαστική", extra:"μόνο ονομ./αιτ. ενικ. ουδ." }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"pugno", perf:"pugnāvi", sup:"pugnatum", inf:"pugnāre", note:"" },
      { pres:"clamo", perf:"clamāvi", sup:"clamatum", inf:"clamāre", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"pertineo", perf:"pertinui", sup:"pertentum", inf:"pertinēre", note:"< per + teneo" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"deduco", perf:"deduxi", sup:"deductum", inf:"deducĕre", note:"< de + duco· προστ. deduc" },
      { pres:"desisto", perf:"destiti", sup:"—", inf:"desistĕre", note:"< de + sisto" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicĕre", note:"προστ. dic" },
      { pres:"facio", perf:"feci", sup:"factum", inf:"facĕre", note:"3, σε -io· προστ. fac· παθ. fio" },
      { pres:"invado", perf:"invasi", sup:"invasum", inf:"invadĕre", note:"< in + vado" },
      { pres:"cupio", perf:"cupivi (cupii)", sup:"cupitum", inf:"cupĕre", note:"3, σε -io" },
      { pres:"reddo", perf:"reddidi", sup:"redditum", inf:"reddĕre", note:"red + do" },
      { pres:"cogo", perf:"coegi", sup:"coactum", inf:"cogĕre", note:"< cum + ago" },
      { pres:"obsequor", perf:"obsecutus sum", sup:"(obsecutum)", inf:"obsequi", note:"αποθετικό (< ob + sequor)" },
      { pres:"pario", perf:"peperi", sup:"partum", inf:"parĕre", note:"3, σε -io· μτχ. μέλλ. pariturus" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"subvenio", perf:"subveni", sup:"subventum", inf:"subvenīre", note:"< sub + venio" },
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venīre", note:"" },
      { pres:"sentio", perf:"sensi", sup:"sensum", inf:"sentīre", note:"" }
    ]},
    { syz:"Ανώμαλα ρήματα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"nequeo", perf:"nequivi (nequii)", sup:"—", inf:"nequīre", note:"< ne + queo· ελλειπτικό (χωρίς σουπίνο)" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"παθητικό του facio" },
      { pres:"volo", perf:"volui", sup:"—", inf:"velle", note:"" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Δευτ. πρόταση", title:"Συμπερασματικές ut & ιδιομορφία ακολουθίας", body:"Το κείμενο βρίθει συμπερασματικών προτάσεων (ut … nequeamus, ut … cuperent, ut … cogantur, ut … fiant, ut … obsequatur), που προεξαγγέλλονται από τις δεικτικές eum / tantus / tales. Εκφέρονται με υποτακτική (δυνητική) και παρουσιάζουν ιδιομορφία στην ακολουθία των χρόνων: συγχρονισμός κύριας–δευτερεύουσας (το αποτέλεσμα ιδωμένο τη στιγμή που εμφανίζεται στο μυαλό του ομιλητή, όχι της πραγματοποίησης)." },
    { tag:"Υποθετικός λόγος", title:"Εξαρτημένος υποθετικός λόγος", body:"«nisi qui deus vel casus aliqui subvenerit … (ut) … nequeamus»: υπόθεση nisi + υποτ. παρακ. (subvenerit), απόδοση η συμπερασματική (nequeamus). Α΄ είδος — υπόθεση ανοιχτή για το μέλλον. Στον ανεξάρτητο/ευθύ: nisi … subvenerit (οριστ. συντ. μέλλ.) → salvi esse nequimus (οριστ. ενεστ.), γιατί το nequeo (ελλειπτικό) δεν σχηματίζει μέλλοντα." },
    { tag:"Σύγκριση", title:"Δύο τρόποι για τον β΄ όρο σύγκρισης", body:"Το κείμενο έχει και τους δύο τρόπους: «nihil miserius quam ipsa victoria» = quam + ομοιόπτωτα προς τον α΄ όρο (nihil, ονομ.)· «nihil … miserius bello civili» = απλή (συγκριτική) αφαιρετική. Ισοδύναμα: quam ipsa victoria = ipsa victoria (αφαιρ.)." },
    { tag:"Σύνταξη", title:"reddo + διπλή αιτιατική", body:"«ea victores ferociores impotentioresque reddit»: το reddo συντάσσεται με διπλή αιτιατική — αντικείμενο (victores) + κατηγορούμενο του αντικειμένου (ferociores, impotentiores). Στην παθητική: ea victores (ονομ.) ferociores (ονομ.) … redduntur (ea = ποιητικό αίτιο σε απλή αφαιρετική, γιατί άψυχο)." },
    { tag:"Απαρέμφατο", title:"Ταυτοπροσωπία στα τελικά απαρέμφατα", body:"Τα τελικά απαρέμφατα εμφανίζουν ταυτοπροσωπία: nequeamus esse (nos), destiti sentire/dicere/facere (ego), cuperent pugnare (omnes), cogantur esse (victores). Αντίθετα, στο «clamabam nihil esse … miserius» το esse είναι ειδικό απαρέμφατο με ετεροπροσωπία (υποκ. nihil σε αιτ.)." },
    { tag:"Ουσιαστικά", title:"locus, deus, auxilium — ιδιαιτερότητες", body:"locus: ετερογενές/ετερόσημο — πληθ. loci (χωρία βιβλίου), loca (τόποι). deus: ανώμαλη κλίση — κλητ. dive/deus, πολλαπλοί τύποι πληθ. (dei/dii/di, deorum/deum, deis/diis/dis). auxilium: ετερόσημο — πληθ. auxilia = επικουρικό στράτευμα· γεν. ενικ. -ii/-i." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Μετατροπή δευτ. προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Equidem, ut veni ad urbem, non destiti omnia et sentire et dicere et facere, quae ad concordiam pertinerent",
        to:"Equidem, ut veni ad urbem, non destiti omnia ad concordiam pertinentia et sentire et dicere et facere",
        note:"Μετατροπή της δευτ. αναφορικής πρότασης σε επιθετική μετοχή, με υποκείμενο το omnia." },
      { from:"Sed tantus furor omnes invaserat, ut pugnare cuperent, etsi ego clamabam nihil esse bello civili miserius",
        to:"Sed tantus furor omnes invaserat, ut pugnare cuperent, me clamante nihil esse bello civili miserius",
        note:"Μετατροπή της δευτ. εναντιωματικής πρότασης σε εναντιωματική μετοχή (αφαιρ. απόλυτη), με υποκείμενο το me." }
    ]},
    { id:"Β", label:"Μετατροπή του εξαρτημένου υποθετικού λόγου σε ανεξάρτητο & τροπή στα άλλα είδη", items:[
      { from:"Εξαρτημένος: In eum locum …, ut, nisi qui deus vel casus aliqui subvenerit, salvi esse nequeamus",
        to:["Ανεξάρτητος / Ευθύς: nisi … subvenerit, salvi esse nequimus",
            "Α΄ είδος (ανοιχτή, μέλλον): nisi subvenerit (οριστ. συντ. μέλλ.) → nequimus (οριστ. ενεστ.)",
            "Α΄ είδος (ανοιχτή, παρόν): nisi subvenit (οριστ. ενεστ.) → nequimus (οριστ. ενεστ.)",
            "Β΄ είδος (αντίθετη, παρόν): nisi subveniret (υποτ. παρατ.) → nequiremus (υποτ. παρατ.)",
            "Γ΄ είδος (δυνατή/πιθανή, παρόν-μέλλον): nisi subveniat (υποτ. ενεστ.) → nequeamus (υποτ. ενεστ.)"],
        note:"Το nequeo, ως ελλειπτικό ρήμα, δεν σχηματίζει τύπους στον μέλλοντα, στον παρακείμενο και στην υποτ. υπερσυντελίκου· γι' αυτό δεν είναι δυνατές οι μετατροπές που αναφέρονται στο παρελθόν." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Sed tantus furor omnes invaserat",
        to:"Sed tanto furore omnes invasi erant",
        note:"Το ποιητικό αίτιο (furore) εκφέρεται με απλή αφαιρετική, γιατί είναι άψυχο." },
      { from:"ea victores ferociores impotentioresque reddit",
        to:"ea victores (ονομ.) ferociores (ονομ.) impotentioresque (ονομ.) redduntur",
        note:"Το ποιητικό αίτιο ea (= victoria) με απλή αφαιρετική, γιατί είναι άψυχο." }
    ]},
    { id:"Δ", label:"Ισοδύναμος τρόπος εκφοράς του β΄ όρου σύγκρισης", items:[
      { from:"Omnia sunt misera in bellis civilibus, sed nihil miserius quam ipsa victoria",
        to:"Omnia sunt misera … miserius ipsa victoria (αφαιρ.)",
        note:"Ο β΄ όρος από «quam + ομοιόπτωτα» τρέπεται σε απλή (συγκριτική) αφαιρετική." }
    ]},
    { id:"Ε", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"(εξάρτηση: Cicero putat / putavit) In eum locum res deducta est, ut … nequeamus",
        to:"in eum locum rem deductam esse, ut, nisi … subvenerit / subvenisset, ipsi salvi esse nequeant / nequirent.",
        note:"Η κύρια κρίσης γίνεται ειδικό απαρέμφατο (deductam esse, υποκ. rem σε αιτ.)· τα ρήματα των δευτ. προτάσεων σε υποτακτική (αρκτικός/ιστορικός χρόνος εξάρτησης)." },
      { from:"(εξάρτηση: Cicero dicit / dixit) Equidem, ut veni ad urbem, non destiti …; sed tantus furor …",
        to:"se, ut venerit / venisset ad urbem, non destitisse omnia …, quae … pertinerent; sed tantum furorem omnes invasisse, ut pugnare cuperent, etsi ipse clamaret nihil … miserius.",
        note:"ego → se (πλάγια αυτοπάθεια)· οι κύριες σε ειδικά απαρέμφατα (destitisse, invasisse) με υποκ. σε αιτ. (se, furorem)." },
      { from:"(εξάρτηση: Cicero putat / putabat) Omnia sunt misera …; Bellorum … exitus tales sunt …",
        to:"omnia (αιτ.) esse misera …, sed nihil (αιτ.) miserius … ipsam victoriam: eam … reddere, ut … cogantur / cogerentur; bellorum … exitus (αιτ.) tales esse semper, ut … fiant / fierent …, sed etiam ut victor obsequatur / obsequeretur iis, quorum auxilio victoria parta sit / parta esset.",
        note:"Οι κύριες κρίσης σε ειδικά απαρέμφατα με υποκ. σε αιτ. (omnia, nihil, exitus)· τα ρήματα των δευτ. προτάσεων σε υποτακτική." }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"Sed tantus furor omnes invaserat, ut pugnare cuperent, etsi ego clamabam nihil esse bello civili miserius",
        to:"Sed tantus furor … nihil est bello civili miserius.",
        note:"Το ειδικό απαρέμφατο esse (πλάγιος) γίνεται ρήμα οριστικής est (ευθύς)." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"locum", el:"(γαλλ.) locale (= τοπικός) // (αγγλ.) location (= τοποθεσία)" },
    { la:"res", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός)" },
    { la:"de-ducta [< de-duco]", el:"(γαλλ.) déductif (= επαγωγικός), con-ducteur (= οδηγός) // (αγγλ.) ad-ductor (= προσαγωγός μυς)" },
    { la:"est, esse, sint, sunt", el:"εἰμί" },
    { la:"deus", el:"Ζεύς, (γεν.) Διός" },
    { la:"casus", el:"κάζο [< ιταλ. caso (= συμβάν)]" },
    { la:"sub-venerit [< sub-venio], vēni", el:"βαίνω // (γαλλ.) subvention (= επιχορήγηση)" },
    { la:"salvi", el:"σάος = σῶς // (γαλλ.) salvation (= λύτρωση) // (αγγλ.) salve (= ανακουφίζω)" },
    { la:"urbem", el:"(γαλλ.) urbain (= αστικός)" },
    { la:"de-stiti [< de-sisto]", el:"ἵστημι, στάσις // (αγγλ.) desist (= παύω) // (γαλλ.) destitution (= καθαίρεση)" },
    { la:"sentīre", el:"(γαλλ.) sentir (= αισθάνομαι, νιώθω), sensible (= ευαίσθητος)" },
    { la:"dicere", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= υπαγόρευση)" },
    { la:"facere", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο)" },
    { la:"con-cordiam", el:"καρδία // (γαλλ.) concorde (= ομόνοια, συμφωνία) // (ισπαν.) corazón (= καρδιά)" },
    { la:"per-tinērent", el:"τείνω // (γαλλ.) tenir (= κρατώ), pertinent (= σχετικός, συναφής)" },
    { la:"furor", el:"(αγγλ.) furor, (γαλλ.) furie" },
    { la:"in-vaserat [< in-vado]", el:"βάδην, βαίνω" },
    { la:"pugnāre", el:"πύξ (= με γροθιά)· πυγμή" },
    { la:"cuperent [< cupio]", el:"(γαλλ.) cupide (= άπληστος)" },
    { la:"ego", el:"ἐγώ" },
    { la:"clamābam [< clamo]", el:"ρεκλάμα [< γαλλ. réclame (= διαφήμιση)]" },
    { la:"civīli, civilibus, civilium", el:"κοίτη· (αγγλ.) city (= πόλη) // (γαλλ.) civilisation (= πολιτισμός)" },
    { la:"miserius, misera", el:"μιζέρια, μίζερος (< ιταλ.)" },
    { la:"victoria, victōres, victor", el:"βικτοριανός (< αγγλ.) // (γαλλ.) victoire (= νίκη), (αγγλ.) victory" },
    { la:"fe-rociōres", el:"θήρ· θηρίο, πάν-θηρας" },
    { la:"im-potentiores [< possum]", el:"πόσις, δεσ-πότης // (αγγλ.) impotent (= ανίκανος, αδύναμος)" },
    { la:"red-dit", el:"δίδωμι // (γαλλ.) donner (= δίνω), reddition (= απόδοση, παράδοση)" },
    { la:"natūrā", el:"γί-γνο-μαι, γνήσιος // (γαλλ.) nature, naturel· νατουραλισμός (< γαλλ.)" },
    { la:"necessitāte", el:"νεσεσέρ (< γαλλ. nécessaire) // (αγγλ.) necessity (= αναγκαιότητα)" },
    { la:"cogantur [< cogo < cum + ago]", el:"ἄγω" },
    { la:"ex-itus [< ex-eo]", el:"εἶμι // (αγγλ.) exit (= έξοδος)" },
    { la:"semper", el:"(ισπαν.) siempre (= πάντα)" },
    { la:"solum", el:"σόλο (< ιταλ.), σολίστ(ας)" },
    { la:"fiant", el:"φύω, φύσις" },
    { la:"velit [< volo]", el:"βούλομαι // (αγγλ.) volunteer (= εθελοντής)" },
    { la:"ob-sequătur", el:"ἕπομαι // (αγγλ.) sequent (= ακόλουθος) // (γαλλ.) obséquieux (= δουλοπρεπής), seconde (= δευτερόλεπτο) // σεκόντο (< ιταλ.)" },
    { la:"auxilio", el:"(γαλλ.) auxiliaire (= βοηθός)" }
  ]
};

export default UNIT;
