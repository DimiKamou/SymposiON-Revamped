// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 46
//  Lectio XLVI — «Το γενικό συμφέρον μπαίνει πριν από το ατομικό» (Cicero,
//  De finibus bonorum et malorum III, 64)
//  periods, alignment, nouns, adjectives, comparatives, pronouns, verbs, sos
//  + προαιρετικά transforms (Μέρος VIII) & etymology (Μέρος IX).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 46,
  title: "Το γενικό συμφέρον μπαίνει πριν από το ατομικό",
  latinTitle: "Lectio XLVI",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Philosophi", r:"Υποκείμενο", to:"στο censent", g:"ονομ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"philosophus, -i (αρσ. β΄) — ο φιλόσοφος" },
        { l:"mundum", k:"mundus", r:"Υποκείμενο απαρεμφάτου", to:"στο regi (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"mundus, -i (αρσ. β΄) — ο κόσμος" },
        { l:"censent", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. ενεργ. φωνής", d:"censeo, censui, censum, censēre (2) — πιστεύω, νομίζω" },
        { l:"regi", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο censent", g:"απαρέμφατο ενεστ. παθ. φωνής", d:"rego, rexi, rectum, regĕre (3) — κυβερνώ" },
        { l:"numine", k:"numen", r:"Αφαιρετική του ποιητικού αιτίου (απρόθετη)", to:"στο regi", g:"αφαιρ. ενικ., ουδ. — ουσιαστικό γ΄ κλ.", d:"numen, numinis (ουδ. γ΄) — η βούληση της θεότητας", note:"Απρόθετο ποιητικό αίτιο, γιατί είναι άψυχο." },
        { l:"deorum", k:"deus", r:"Γενική υποκειμενική", to:"στο numine", g:"γεν. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"deus, -i (αρσ. β΄) — ο θεός· numen deorum = η θεία βούληση", a:";" }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Εννοούμενο υποκ.: (philosophi). Δύο ειδικά απαρέμφατα (esse) ως αντικείμενα στο putant.", kids:[
        { l:"eum", k:"is", r:"Υποκείμενο απαρεμφάτου", to:"στο esse (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός (eum = mundum)" },
        { l:"esse", k:"sum", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο putant", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι" },
        { l:"putant", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. ενεργ. φωνής", d:"puto, putavi, putatum, putāre (1) — νομίζω" },
        { l:"quasi", r:"Παραβολικός σύνδεσμος (υποθετική παραβολή)", g:"υποτακτικός υποθετικός-παραβολικός σύνδεσμος", d:"quasi — (κάτι) σαν", note:"Εισάγει λανθάνουσα υποθ. παραβολική: quasi (communis urbs et civitas … sit)." },
        { l:"communem", k:"communis", r:"Επιθετικός προσδ.", to:"στα urbem, civitatem", g:"αιτ. ενικ., θηλ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"communis, -is, -e — κοινός, -ή, -ό" },
        { l:"urbem", k:"urbs", r:"Κατηγορούμενο", to:"στο eum (μέσω esse)", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"urbs, urbis (θηλ. γ΄) — η πόλη" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"civitatem", k:"civitas", r:"Κατηγορούμενο", to:"στο eum (μέσω esse)", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"civitas, civitatis (θηλ. γ΄) — η πολιτεία" },
        { l:"hominum", k:"homo", r:"Γενική αντικειμενική", to:"στο communem", g:"γεν. πληθ. — ουσιαστικό γ΄ κλ.", d:"homo, hominis (αρσ./θηλ. γ΄) — ο άνθρωπος" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"deorum", k:"deus", r:"Γενική αντικειμενική", to:"στο communem", g:"γεν. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"deus, -i (αρσ. β΄) — ο θεός", a:"," },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"unum quemque", k:"unusquisque", r:"Υποκείμενο απαρεμφάτου", to:"στο esse (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — αόριστη ουσιαστική αντωνυμία", d:"unusqui(s)que, unaquaeque, unumquidque — ο καθένας ξεχωριστά" },
        { l:"nostrum", k:"ego", r:"Γενική διαιρετική", to:"στο unum quemque", g:"γεν. πληθ. — προσωπική αντωνυμία α΄ προσ.", d:"ego — εγώ (nostrum = από εμάς)" },
        { l:"eius", k:"is", r:"Επιθετικός προσδ.", to:"στο mundi", g:"γεν. ενικ., αρσ. — δεικτική (ως οριστική) αντωνυμία", d:"is, ea, id — αυτός" },
        { l:"mundi", k:"mundus", r:"Γενική διαιρετική", to:"στο partem", g:"γεν. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"mundus, -i (αρσ. β΄) — ο κόσμος" },
        { l:"esse", k:"sum", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο putant", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι" },
        { l:"partem", k:"pars", r:"Κατηγορούμενο", to:"στο unum quemque (μέσω esse)", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"pars, partis (θηλ. γ΄) — το μέρος", a:";" }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"ex quo στην αρχή περιόδου = δεικτική (quo = eo).", kids:[
        { l:"ex quo", k:"qui", r:"Εμπρόθετος προσδ. της αιτίας (εσωτ. αναγκαστικό αίτιο)", to:"στο consequitur", g:"ex (πρόθ. + αφαιρ.) + quo (αφαιρ. ενικ., ουδ.)", d:"ex — από· qui, quae, quod — ο οποίος (ex quo = από αυτό)" },
        { l:"illud", k:"ille", r:"Υποκείμενο", to:"στο consequitur", g:"ονομ. ενικ., ουδ. — δεικτική αντωνυμία", d:"ille, illa, illud — εκείνος, -η, -ο" },
        { l:"natura", r:"Αφαιρετική (οργανική) του τρόπου", to:"στο consequitur", g:"αφαιρ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"natura, -ae (θηλ. α΄) — η φύση (natura = από τη φύση)" },
        { l:"consequitur", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. — αποθετικό (εδώ απρόσωπο)", d:"consequor, consecutus sum, (consecutum), consequi (3) — προκύπτω, συνεπάγομαι", a:"," },
        { type:"sub", key:"symperasmatiki", label:"Συμπερασματική (ουσιαστική)", note:"Δευτ. ουσιαστική συμπερασματική, επεξήγηση στο illud· ut + υποτακτική (δυνητική) ενεστ. (anteponamus) — ιδιομορφία ακολουθίας (συγχρονισμός).", kids:[
          { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός συμπερασματικός σύνδεσμος", d:"ut — ώστε" },
          { l:"communem", k:"communis", r:"Επιθετικός προσδ.", to:"στο utilitatem", g:"αιτ. ενικ., θηλ. — επίθ. γ΄ κλ.", d:"communis, -is, -e — κοινός" },
          { l:"utilitatem", k:"utilitas", r:"Άμεσο αντικείμενο", to:"στο anteponamus", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"utilitas, utilitatis (θηλ. γ΄) — η ωφέλεια, το καλό" },
          { l:"nostrae", k:"noster", r:"Επιθετικός προσδ.", to:"στο (εννοούμενο) utilitati", g:"δοτ. ενικ., θηλ. — κτητική αντωνυμία α΄ προσ. (πολλών κτητόρων)", d:"noster, nostra, nostrum — δικός μας", note:"Εννοείται έμμεσο αντικ.: (utilitati) nostrae." },
          { l:"anteponamus", r:"Ρήμα", g:"α΄ πληθ. υποτ. ενεστ. ενεργ. φωνής", d:"antepono, anteposui, antepositum, anteponĕre (3) (< ante + pono) — προκρίνω (+ αιτ. + δοτ.)", note:"Εννοούμενο υποκ.: (nos).", a:"." }
        ]}
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { type:"sub", key:"paravoliki", label:"Παραβολική (του τρόπου)", note:"Δευτ. επιρρ. απλή παραβολική (β΄ όρος σύγκρισης· παραβολικό ζεύγος sic … ut)· ut + οριστική (πραγματικό), ενεστ. (anteponunt).", kids:[
          { l:"Ut", r:"Σύνδεσμος", g:"υποτακτικός παραβολικός σύνδεσμος", d:"ut — όπως" },
          { l:"enim", r:"Σύνδεσμος", g:"παρατακτικός αιτιολογικός σύνδεσμος", d:"enim — γιατί" },
          { l:"leges", k:"lex", r:"Υποκείμενο", to:"στο anteponunt", g:"ονομ. πληθ., θηλ. — ουσιαστικό γ΄ κλ.", d:"lex, legis (θηλ. γ΄) — ο νόμος" },
          { l:"omnium", k:"omnis", r:"Γενική υποκειμενική", to:"στο salutem", g:"γεν. πληθ. — επίθ. γ΄ κλ.", d:"omnis, -is, -e — όλος, -η, -ο" },
          { l:"salutem", k:"salus", r:"Άμεσο αντικείμενο", to:"στο anteponunt", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"salus, salutis (θηλ. γ΄) — η σωτηρία, η ευημερία" },
          { l:"singulorum", k:"singuli", r:"Γενική υποκειμενική", to:"στο saluti", g:"γεν. πληθ., αρσ. — διανεμητικό αριθμ. επίθ. (μόνο πληθ.)", d:"singuli, -ae, -a — ο καθένας ξεχωριστά" },
          { l:"saluti", k:"salus", r:"Έμμεσο αντικείμενο", to:"στο anteponunt", g:"δοτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"salus, salutis (θηλ. γ΄) — η σωτηρία" },
          { l:"anteponunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. ενεργ. φωνής", d:"antepono, anteposui, antepositum, anteponĕre (3) — προκρίνω", a:"," }
        ]},
        { l:"sic", r:"Επιρρ. προσδ. του τρόπου", to:"στο consulit", g:"τροπικό επίρρημα", d:"sic — έτσι" },
        { l:"vir", r:"Υποκείμενο", to:"στο consulit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"vir, viri (αρσ. β΄) — ο άνδρας" },
        { l:"bonus", r:"Επιθετικός προσδ.", to:"στο vir", g:"ονομ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"bonus, -a, -um — καλός (ανώμ. παραθ.: melior, optimus)" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"sapiens", r:"Επιθετικός προσδ.", to:"στο vir", g:"ονομ. ενικ., αρσ. — επίθ. γ΄ κλ. (μονοκατάληκτο, επιθετοπ. μτχ.)", d:"sapiens, -entis — σοφός" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"legibus", k:"lex", r:"Αντικείμενο", to:"στη μετοχή parens", g:"δοτ. πληθ., θηλ. — ουσιαστικό γ΄ κλ.", d:"lex, legis (θηλ. γ΄) — ο νόμος (pareo + δοτ.)" },
        { l:"parens", r:"Επιθετική μετοχή", to:"στο vir", g:"ονομ. ενικ., αρσ. — μτχ. ενεστ. (επιθετοπ.)", d:"pareo, parui, paritum, parēre (2) — υπακούω", note:"vir = υποκ. της μετοχής." },
        { l:"consulit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"consulo, consului, consultum, consulĕre (3) — φροντίζω (+ δοτ.)" },
        { l:"utilitati", k:"utilitas", r:"Δοτική προσωπική χαριστική (α΄ όρος σύγκρισης)", to:"στο consulit", g:"δοτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"utilitas, utilitatis (θηλ. γ΄) — η ωφέλεια" },
        { l:"omnium", k:"omnis", r:"Γενική υποκειμενική", to:"στο utilitati", g:"γεν. πληθ. — επίθ. γ΄ κλ.", d:"omnis, -is, -e — όλος" },
        { l:"plus", r:"Επιρρ. προσδ. του ποσού (συγκριτική λέξη)", to:"στο consulit", g:"ποσοτικό επίρρημα, συγκρ. βαθμού (< multum)", d:"plus — περισσότερο" },
        { l:"quam", r:"Σύνδεσμος (β΄ όρος σύγκρισης)", g:"επίρρημα που εισάγει β΄ όρο σύγκρισης", d:"quam — παρά" },
        { l:"unius alicuius", k:"unusaliquis", r:"Γενική υποκειμενική", to:"στο (εννοούμενο) utilitati", g:"γεν. ενικ., αρσ. — αόριστη ουσιαστική αντωνυμία", d:"unus aliquis — ένας οποιοσδήποτε", note:"quam (utilitati) unius alicuius: β΄ όρος, ομοιόπτωτα (δοτ.)." },
        { l:"aut", r:"Σύνδεσμος", g:"παρατακτικός διαζευκτικός σύνδεσμος", d:"aut — ή" },
        { l:"suae", k:"suus", r:"Επιθετικός προσδ.", to:"στο (εννοούμενο) utilitati", g:"δοτ. ενικ., θηλ. — κτητική αντωνυμία γ΄ προσ.", d:"suus, sua, suum — δικός του", note:"Άμεση αυτοπάθεια (στο vir)· aut (utilitati) suae.", a:"." }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Nec", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός (αρνητικός) σύνδεσμος", d:"nec — ούτε, και δεν" },
        { l:"magis", r:"Επιρρ. προσδ. του ποσού (συγκριτική λέξη)", to:"στο vituperandus est", g:"ποσοτικό επίρρημα, συγκρ. βαθμού (< magnopere)", d:"magis — πιο πολύ" },
        { l:"vituperandus est", r:"Ρήμα (παθ. περιφραστική συζυγία)", g:"γ΄ ενικ. οριστ. ενεστ. — γερουνδιακό + est", d:"vitupero, vituperavi, vituperatum, vituperāre (1) — επικρίνω", note:"Προσωπική σύνταξη γερουνδιακού (vitupero μεταβατικό)." },
        { l:"proditor", k:"proditor", r:"Υποκείμενο (α΄ όρος σύγκρισης)", to:"στο vituperandus est", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"proditor, proditoris (αρσ. γ΄) — ο προδότης", note:"vituperandus: κατηγορούμενο στο proditor. Εννοείται δοτ. ποιητικού αιτίου (nobis)." },
        { l:"patriae", k:"patria", r:"Γενική αντικειμενική", to:"στο proditor", g:"γεν. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"patria, -ae (θηλ. α΄) — η πατρίδα" },
        { l:"quam", r:"Σύνδεσμος (β΄ όρος σύγκρισης)", g:"επίρρημα που εισάγει β΄ όρο σύγκρισης", d:"quam — παρά" },
        { l:"proditor", k:"proditor", r:"Υποκείμενο (β΄ όρος σύγκρισης)", to:"στο vituperandus est", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"proditor, proditoris (αρσ. γ΄) — ο προδότης", note:"quam proditor: β΄ όρος, ομοιόπτωτα (ονομ.)." },
        { l:"communis", k:"communis", r:"Επιθετικός προσδ.", to:"στο utilitatis", g:"γεν. ενικ., θηλ. — επίθ. γ΄ κλ.", d:"communis, -is, -e — κοινός" },
        { l:"utilitatis", k:"utilitas", r:"Γενική αντικειμενική", to:"στο proditor", g:"γεν. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"utilitas, utilitatis (θηλ. γ΄) — η ωφέλεια, το συμφέρον", a:"," },
        { l:"aut", r:"Σύνδεσμος", g:"παρατακτικός διαζευκτικός σύνδεσμος", d:"aut — ή" },
        { l:"communis", k:"communis", r:"Επιθετικός προσδ.", to:"στο salutis", g:"γεν. ενικ., θηλ. — επίθ. γ΄ κλ.", d:"communis, -is, -e — κοινός" },
        { l:"salutis", k:"salus", r:"Γενική αντικειμενική", to:"στο desertor", g:"γεν. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"salus, salutis (θηλ. γ΄) — η σωτηρία, η ευημερία" },
        { l:"desertor", k:"desertor", r:"Υποκείμενο (β΄ όρος σύγκρισης)", to:"στο vituperandus est", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"desertor, desertoris (αρσ. γ΄) — ο λιποτάκτης" },
        { l:"propter", r:"Πρόθεση", g:"πρόθεση + αιτιατική", d:"propter — εξαιτίας" },
        { l:"suam", k:"suus", r:"Επιθετικός προσδ.", to:"στα utilitatem, salutem", g:"αιτ. ενικ., θηλ. — κτητική αντωνυμία γ΄ προσ.", d:"suus, sua, suum — δικός του", note:"Άμεση αυτοπάθεια (στα proditor, desertor)." },
        { l:"utilitatem", k:"utilitas", r:"Εμπρόθετος προσδ. της αιτίας (εξωτ. αναγκ. αίτιο)", to:"στο desertor", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"utilitas, utilitatis (θηλ. γ΄) — η ωφέλεια" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"salutem", k:"salus", r:"Εμπρόθετος προσδ. της αιτίας (εξωτ. αναγκ. αίτιο)", to:"στο desertor", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"salus, salutis (θηλ. γ΄) — η σωτηρία", a:"." }
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Ex quo στην αρχή περιόδου = δεικτική (quo = eo). Απρόσωπο fit + ουσιαστική συμπερασματική ως υποκείμενο.", kids:[
        { l:"Ex quo", k:"qui", r:"Εμπρόθετος προσδ. της αιτίας (εξωτ. αναγκ. αίτιο)", to:"στο fit", g:"ex (πρόθ. + αφαιρ.) + quo (αφαιρ. ενικ., ουδ.)", d:"ex — από· qui, quae, quod — ο οποίος (ex quo = από αυτό)" },
        { l:"fit", k:"fio", r:"Ρήμα (απρόσωπο)", g:"γ΄ ενικ. οριστ. ενεστ. — ανώμαλο", d:"fio, factus sum, fieri — γίνομαι· (απρόσ.) συμβαίνει", a:"," },
        { type:"sub", key:"symperasmatiki", label:"Συμπερασματική (ουσιαστική, υποκείμενο)", note:"Δευτ. ουσιαστική συμπερασματική, υποκείμενο στο απρόσωπο fit· ut + υποτακτική (δυνητική) ενεστ. (laudandus sit) — ιδιομορφία ακολουθίας.", kids:[
          { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός συμπερασματικός σύνδεσμος", d:"ut — ώστε" },
          { l:"laudandus", r:"Κατηγορούμενο (γερουνδιακό)", to:"στο is (μέσω sit)", g:"ονομ. ενικ., αρσ. — γερουνδιακό (παθ. περιφραστική)", d:"laudo, laudavi, laudatum, laudāre (1) — επαινώ", note:"laudandus sit = παθ. περιφραστική (πρέπει να επαινείται)." },
          { l:"is", k:"is", r:"Υποκείμενο", to:"στο sit", g:"ονομ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός" },
          { l:"sit", k:"sum", r:"Ρήμα (συνδετικό)", g:"γ΄ ενικ. υποτ. ενεστ. — βοηθητικό", d:"sum, fui, —, esse — είμαι", a:"," },
          { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο is· υποτακτική (έλξη προς laudandus sit) ενεστ. (cadat).", kids:[
            { l:"qui", k:"qui", r:"Υποκείμενο", to:"στο cadat", g:"ονομ. ενικ., αρσ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
            { l:"pro re publica", k:"respublica", r:"Εμπρόθετος προσδ. της υπεράσπισης", to:"στο cadat", g:"pro (πρόθ. + αφαιρ.) + re publica (αφαιρ. ενικ.)", d:"pro — για χάρη· res publica, rei publicae — η πολιτεία" },
            { l:"cadat", r:"Ρήμα", g:"γ΄ ενικ. υποτ. ενεστ. ενεργ. φωνής", d:"cado, cecidi, casum, cadĕre (3) — πέφτω", a:"," }
          ]},
          { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρ. αιτιολογική στο laudandus sit· quod + οριστική (αντικειμενικά αποδεκτή αιτία) ενεστ. (decet).", kids:[
            { l:"quod", r:"Σύνδεσμος", g:"υποτακτικός αιτιολογικός σύνδεσμος", d:"quod — επειδή" },
            { l:"decet", r:"Ρήμα (απρόσωπο)", g:"γ΄ ενικ. οριστ. ενεστ. — απρόσωπο (2)", d:"decet, decuit, —, decēre — αρμόζει (+ απαρέμφατο)" },
            { l:"cariorem", k:"carus", r:"Κατηγορούμενο", to:"στο patriam (μέσω esse)", g:"αιτ. ενικ., θηλ. — επίθ. β΄ κλ., συγκρ. βαθμού", d:"carior, -ius (< carus) — αγαπητότερος" },
            { l:"nobis", k:"ego", r:"Δοτική αντικειμενική", to:"στο cariorem", g:"δοτ. πληθ. — προσωπική αντωνυμία α΄ προσ.", d:"ego — εγώ (nobis = σε εμάς)" },
            { l:"esse", k:"sum", r:"Τελικό απαρέμφατο (υποκείμενο)", to:"στο decet", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι" },
            { l:"patriam", k:"patria", r:"Υποκείμενο απαρεμφάτου (α΄ όρος σύγκρισης)", to:"στο esse (ετεροπροσωπία)", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"patria, -ae (θηλ. α΄) — η πατρίδα" },
            { l:"quam", r:"Σύνδεσμος (β΄ όρος σύγκρισης)", g:"επίρρημα που εισάγει β΄ όρο σύγκρισης", d:"quam — παρά" },
            { l:"nosmet", k:"ego", r:"Υποκείμενο απαρεμφάτου (β΄ όρος σύγκρισης)", to:"στο esse", g:"αιτ. πληθ. — προσωπική αντωνυμία α΄ προσ. (+ -met)", d:"ego — εγώ· -met (επιτατικό)· quam nosmet, ομοιόπτωτα (αιτ.)" },
            { l:"ipsos", k:"ipse", r:"Επιθετικός προσδ.", to:"στο nosmet", g:"αιτ. πληθ., αρσ. — δεικτική-οριστική αντωνυμία", d:"ipse, ipsa, ipsum — ο ίδιος (nosmet ipsos = εμείς οι ίδιοι)", a:"." }
          ]}
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Philosophi mundum censent regi numine deorum;", el:"Οι φιλόσοφοι πιστεύουν ότι ο κόσμος κυβερνιέται από τη θεία βούληση·" },
    { la:"eum esse putant quasi communem urbem et civitatem hominum et deorum, et unum quemque nostrum eius mundi esse partem;", el:"νομίζουν ότι αυτός είναι (κάτι) σαν κοινή πόλη και πολιτεία ανθρώπων και θεών, και ότι ο καθένας μας ξεχωριστά είναι μέρος αυτού του κόσμου·" },
    { la:"ex quo illud natura consequitur, ut communem utilitatem nostrae anteponamus.", el:"απ' αυτό προκύπτει από τη φύση εκείνο, να βάζουμε δηλαδή το γενικό συμφέρον πάνω από το ατομικό μας." },
    { la:"Ut enim leges omnium salutem singulorum saluti anteponunt, sic vir bonus et sapiens et legibus parens consulit utilitati omnium plus quam unius alicuius aut suae.", el:"Γιατί όπως οι νόμοι βάζουν τη σωτηρία όλων πάνω από τη σωτηρία του καθενός ξεχωριστά, έτσι ο άνθρωπος ο καλός και σοφός και υπάκουος στους νόμους φροντίζει για την ευημερία όλων περισσότερο παρά ενός οποιουδήποτε ή τη δική του." },
    { la:"Nec magis vituperandus est proditor patriae quam proditor communis utilitatis, aut communis salutis desertor propter suam utilitatem et salutem.", el:"Και δεν πρέπει να επικρίνεται πιο πολύ ο προδότης της πατρίδας παρά ο προδότης του κοινού συμφέροντος ή ο λιποτάκτης της κοινής ευημερίας για χάρη της ατομικής του ωφέλειας και ευημερίας." },
    { la:"Ex quo fit, ut laudandus is sit, qui pro re publica cadat, quod decet cariorem nobis esse patriam quam nosmet ipsos.", el:"Απ' αυτό συμβαίνει να είναι αξιέπαινος αυτός που πέφτει για την πατρίδα, επειδή αρμόζει να είναι πιο αγαπητή σε εμάς η πατρίδα παρά εμείς οι ίδιοι." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"natura, -ae" },
        { form:"patria, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"philosophus, -i" },
        { form:"mundus, -i" },
        { form:"deus, -i", note:"διπλοί/τριπλοί τύποι: dei/dii/di, deorum/deum, deis/diis/dis· κλητ. dive/deus" },
        { form:"vir, viri" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"homo, hominis" },
        { form:"proditor, proditoris" },
        { form:"desertor, desertoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"urbs, urbis" },
        { form:"civitas, civitatis" },
        { form:"pars, partis", note:"ετερόσημο: εν. = μέρος· πληθ. partes, partium = πολιτική παράταξη" },
        { form:"utilitas, utilitatis" },
        { form:"lex, legis" },
        { form:"salus, salutis", note:"αφηρημ. — χωρίς πληθυντικό" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"numen, numinis" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"res, rei", note:"res publica, rei publicae (σύνθετο ουσιαστικό)" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"bonus, -a, -um", note:"ανώμαλα παραθετικά (melior, optimus)" },
      { form:"carus, -a, -um" },
      { form:"publicus, -a, -um", note:"απόλυτο — χωρίς παραθετικά (res publica)" },
      { form:"singuli, -ae, -a", note:"διανεμητικό αριθμ. — μόνο πληθ., χωρίς κλητική" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"communis, communis, commune", note:"δικατάληκτο" },
      { form:"omnis, omnis, omne", note:"δικατάληκτο — χωρίς παραθετικά" },
      { form:"sapiens, sapiens, sapiens (sapientis)", note:"μονοκατάληκτο· επιθετοποιημένη μετοχή" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (& επιρρημάτων) ──────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"bonus, -a, -um", comp:"melior, -ior, -ius", sup:"optimus, -a, -um", note:"ανώμαλα· επίρρ.: bene → melius → optime" },
      { pos:"carus, -a, -um", comp:"carior, -ior, -ius", sup:"carissimus, -a, -um", note:"επίρρ.: care → carius → carissime" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"communis, -is, -e", comp:"communior, -ior, -ius", sup:"communissimus, -a, -um", note:"επίρρ.: communiter → communius → communissime" }
    ]},
    { kl:"Ανώμαλα επιρρήματα", rows:[
      { pos:"multum", comp:"plus", sup:"plurimum", note:"ποσοτικό (plus quam)" },
      { pos:"magnopere", comp:"magis", sup:"maxime", note:"ποσοτικό (magis … quam)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική (επαναληπτική/οριστική)", extra:"eum, is, eius" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"illud" },
    { form:"noster, nostra, nostrum", kind:"Κτητική", extra:"α΄ προσ., πολλών κτητόρων (nostrae)" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ενός κτήτορα (suae, suam)" },
    { form:"unusqui(s)que, unaquaeque, unumquidque", kind:"Αόριστη ουσιαστική", extra:"unum quemque· κλίνονται χωριστά unus + quisque" },
    { form:"unus aliquis, una aliqua, unum aliquid", kind:"Αόριστη ουσιαστική", extra:"unius alicuius" },
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσ. (nostrum, nobis, nosmet)" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"quo· ex quo (στην αρχή περιόδου) = δεικτική" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική-οριστική", extra:"ipsos (nosmet ipsos)" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"puto", perf:"putavi", sup:"putatum", inf:"putāre", note:"" },
      { pres:"vitupero", perf:"vituperavi", sup:"vituperatum", inf:"vituperāre", note:"" },
      { pres:"laudo", perf:"laudavi", sup:"laudatum", inf:"laudāre", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"censeo", perf:"censui", sup:"censum", inf:"censēre", note:"+ ειδικό απαρέμφατο" },
      { pres:"pareo", perf:"parui", sup:"paritum", inf:"parēre", note:"+ δοτ." },
      { pres:"decet", perf:"decuit", sup:"—", inf:"decēre", note:"απρόσωπο· + απαρέμφατο" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"rego", perf:"rexi", sup:"rectum", inf:"regĕre", note:"" },
      { pres:"consequor", perf:"consecutus sum", sup:"(consecutum)", inf:"consequi", note:"αποθετικό (< cum + sequor)" },
      { pres:"antepono", perf:"anteposui", sup:"antepositum", inf:"anteponĕre", note:"< ante + pono" },
      { pres:"consulo", perf:"consului", sup:"consultum", inf:"consulĕre", note:"" },
      { pres:"cado", perf:"cecidi", sup:"casum", inf:"cadĕre", note:"" }
    ]},
    { syz:"Ανώμαλα ρήματα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"= γίνομαι· (απρόσ.) fit" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Απαρέμφατα", title:"Δύο ειδικά απαρέμφατα & ετεροπροσωπία", body:"Στην περίοδο 2 το putant έχει ΔΥΟ ειδικά απαρέμφατα (esse), με υποκείμενα σε αιτιατική (eum· unum quemque) διαφορετικά από το υποκ. του ρήματος — ετεροπροσωπία. Το ίδιο και το censent + regi (υποκ. mundum) στην περίοδο 1." },
    { tag:"Λανθάνουσα", title:"quasi + υποθετική παραβολή", body:"Το «quasi communem urbem et civitatem …» είναι λανθάνουσα δευτ. υποθετική παραβολική (= quasi communis urbs et civitas … sit)· λειτουργεί ως β΄ όρος σύγκρισης και ισοδυναμεί με υποτακτική (υποθετική σύγκριση)." },
    { tag:"Αναφορικά", title:"ex quo = δεικτική στην αρχή περιόδου", body:"Στις περιόδους 3 και 6 το «ex quo» μετά από ισχυρό σημείο στίξης ισοδυναμεί με δεικτική (quo = eo) και εισάγει ΚΥΡΙΑ πρόταση· δηλώνει εσωτερικό (περ. 3) ή εξωτερικό (περ. 6) αναγκαστικό αίτιο." },
    { tag:"Συμπερασματικές", title:"Ουσιαστικές συμπερασματικές (ut …)", body:"«ut … anteponamus» (περ. 3) = επεξήγηση στο illud· «ut laudandus is sit» (περ. 6) = υποκείμενο στο απρόσωπο fit. Εκφέρονται με υποτακτική (δυνητική) και έχουν ιδιομορφία στην ακολουθία των χρόνων (συγχρονισμός κύριας–δευτ.)." },
    { tag:"Παθ. περιφραστική", title:"Γερουνδιακό + sum (προσωπική σύνταξη)", body:"«vituperandus est» (περ. 5) και «laudandus … sit» (περ. 6): παθητική περιφραστική συζυγία (γερουνδιακό + sum) που δηλώνει το δέον. Προσωπική σύνταξη, γιατί τα vitupero/laudo είναι μεταβατικά· το γερουνδιακό = κατηγορούμενο, υποκ. σε ονομαστική· ποιητικό αίτιο σε δοτική (nobis)." },
    { tag:"Σύγκριση", title:"β΄ όρος με quam (ομοιόπτωτα)", body:"Πολλαπλές συγκρίσεις: plus quam unius alicuius aut suae (περ. 4)· magis … quam proditor … aut desertor (περ. 5)· cariorem … quam nosmet ipsos (περ. 6). Ο β΄ όρος εκφέρεται με quam + ομοιόπτωτα προς τον α΄ όρο (ή, εναλλακτικά, με αφαιρετική συγκριτική)." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"legibus parens",
        to:"legibus qui paret",
        note:"parens: επιθετική μετοχή στο vir, ενεστώτα (σύγχρονο)· αναλύεται σε αναφορική πρόταση (qui + οριστ. ενεστ., εξάρτηση από αρκτικό χρόνο consulit)." }
    ]},
    { id:"Β", label:"Μετατροπή δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"…, qui pro re publica cadat",
        to:"…, pro re publica cadens",
        note:"Η αναφορική → επιθετική μετοχή, που προσδιορίζει τον όρο is της συμπερασματικής «ut laudandus is sit»." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Philosophi mundum censent regi numine deorum; eum esse putant …",
        to:[
        "Απρόσωπη: a philosophis censetur regi mundum numine deorum (censetur απρόσωπο· regi απαρέμφατο υποκείμενο· mundum υποκ. στο regi)",
        "Προσωπική: Mundus a philosophis censetur regi numine deorum· is esse a philosophis putatur …"] },
      { from:"…, ut communem utilitatem nostrae anteponamus", to:"…, ut communis utilitas nostrae anteponatur a nobis" },
      { from:"Ut enim leges omnium salutem singulorum saluti anteponunt, sic vir bonus … consulit utilitati omnium plus quam unius alicuius aut suae",
        to:"Ut enim omnium salus anteponitur legibus singulorum saluti, sic a viro bono et sapienti et legibus parenti consulitur utilitas omnium plus quam unius alicuius aut suae",
        note:"legibus: απρόθετο ποιητικό αίτιο (ως άψυχο)." }
    ]},
    { id:"Δ", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"Philosophi mundum censent regi numine deorum",
        to:"Philosophi censent numen deorum mundum regere",
        note:"mundum: αντικείμενο στο regere." }
    ]},
    { id:"Ε", label:"Μετατροπή της παθ. περιφραστικής συζυγίας σε debeo + απαρέμφατο (προσωπική σύνταξη)", items:[
      { from:"Nec magis vituperandus est proditor patriae …", to:"Nec magis debemus vituperare proditorem patriae …" },
      { from:"…, ut laudandus is sit", to:"…, ut eum laudare debeamus" }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"(εξάρτηση: Cicero tradit / tradidit) Philosophi mundum censent regi numine deorum; eum esse putant … eius mundi esse partem", to:"philosophos mundum censere regi numine deorum, eum esse eos putare quasi communem urbem et civitatem hominum et deorum, et unumquemque nostrum eius mundi esse partem" },
      { from:"(εξάρτηση: Cicero putat / putabat) ex quo illud natura consequitur … quam nosmet ipsos", to:"ex eo illud natura consequi, ut communem utilitatem suae anteponant / anteponerent; ut leges … anteponant / anteponerent, sic virum bonum et sapientem et legibus parentem consulere … aut suae; nec magis vituperandum esse proditorem patriae quam … desertorem propter … salutem; ex eo fieri, ut laudandus is sit / esset, qui … cadat / caderet, quod deceat / deceret cariorem sibi esse patriam quam sese ipsos" }
    ]},
    { id:"Ζ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"Philosophi mundum censent regi numine deorum; …", to:"Mundus regitur numine deorum; …" },
      { from:"eum esse putant quasi communem urbem et civitatem hominum et deorum, et unum quemque nostrum eius mundi esse partem", to:"is est quasi communis urbs et civitas hominum et deorum, et unus qui(s)que nostrum eius mundi est pars" }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"philosophi", el:"φιλόσοφος, φιλοσοφία // (αγγλ.) philosophy (= φιλοσοφία) // (γαλλ.) philosophie (= φιλοσοφία)." },
    { la:"mundum, mundi", el:"μουντιάλ (ισπαν.) // (γαλλ.) monde (= κόσμος) // (αγγλ.) mundane (= εγκόσμιος, πεζός) // (ιταλ.) mondo (= κόσμος) // (ισπαν.) mundo (= κόσμος)." },
    { la:"censent [< censeo]", el:"(γαλλ.) censeur (= λογοκριτής) // (αγγλ.) censure (= επίκριση), census (= απογραφή), censor (= τιμητής, λογοκριτής)." },
    { la:"regi [< rego]", el:"ρήγας // (αγγλ.) regent (= αντιβασιλέας) // (γαλλ.) régime (= καθεστώς)." },
    { la:"numine", el:"νεύω, νεύμα // (αγγλ.) numinous (= ιερός, θεϊκός (όρος R. Otto))." },
    { la:"deorum", el:"Ζεύς, (γενική) Διός // (αγγλ.) deity (= θεότητα) // (γαλλ.) dieu (= θεός) // (ιταλ.) dio (= θεός) // (ισπαν.) dios (= θεός)." },
    { la:"esse, est, sit", el:"εἰμί, ἐστί // (αγγλ.) essence (= ουσία), essential (= ουσιώδης) // (γαλλ.) essence (= ουσία)." },
    { la:"putant", el:"(αγγλ.) dis-putation (= συζήτηση, λογομαχία), putative (= υποτιθέμενος), compute (= υπολογίζω), reputation (= φήμη, υπόληψη) // (γαλλ.) compter (= μετρώ)." },
    { la:"commūnem, commūnis", el:"(γαλλ.) commune // κομμουνισμός (< γαλλ. communisme) // (αγγλ.) common (= κοινός), community (= κοινότητα), communal (= κοινοτικός)." },
    { la:"urbem", el:"(γαλλ.) urbain (= αστικός) // (αγγλ.) urban (= αστικός), suburb (= προάστιο) // (ιταλ.) urbano (= αστικός)." },
    { la:"civitatem", el:"κοίτη // (αγγλ.) city (= πόλη) // (γαλλ.) civilisation (= πολιτισμός) // (ιταλ.) città (= πόλη) // (ισπαν.) ciudad (= πόλη)." },
    { la:"hominum", el:"ουμανισμός (< γαλλ.) // (αγγλ.) human (= ανθρώπινος) // (ιταλ.) uomo (= άνθρωπος) // (ισπαν.) hombre (= άνθρωπος)." },
    { la:"unum, unius", el:"ένας // (γαλλ.) un (= ένας), unique (= μοναδικός), unité (= ενότητα) // (αγγλ.) union (= ένωση) // (ιταλ.) uno (= ένα) // (ισπαν.) uno (= ένα)." },
    { la:"partem", el:"πάρτη, παρτίδα // (γαλλ.) partie // (αγγλ.) partition (= διαμέρισμα, χώρισμα), particle (= σωματίδιο) // (ιταλ.) parte (= μέρος)." },
    { la:"ante-ponamus, ante-ponunt [< ante + pono]", el:"(γαλλ.) positionner (= τοποθετώ), position (= θέση) // (αγγλ.) component (= συστατικό), opponent (= αντίπαλος), postpone (= αναβάλλω), deposit (= κατάθεση, παρακαταθήκη)." },
    { la:"leges, legibus", el:"λέγω // (αγγλ.) legal (= νομικός), legislation (= νομοθεσία), legitimate (= νόμιμος) // (γαλλ.) loi (= νόμος) // (ιταλ.) legge (= νόμος) // (ισπαν.) ley (= νόμος)." },
    { la:"salutem, saluti, salutis", el:"(γαλλ.) salutation (= χαιρετισμός) // (αγγλ.) salute (= χαιρετώ), salutary (= σωτήριος, ωφέλιμος) // (ιταλ.) salute (= υγεία) // (ισπαν.) salud (= υγεία)." },
    { la:"singulorum", el:"(αγγλ.) single (= μοναδικός) // (γαλλ.) singularité (= μοναδικότητα), singulier (= ενικός, παράξενος) // (ιταλ.) singolo (= μεμονωμένος)." },
    { la:"vir", el:"βιρτουόζος (< ιταλ. virtuoso) // (αγγλ.) virile (= ανδρικός, αρρενωπός), virility (= ανδρισμός), virtue (= αρετή) // (γαλλ.) viril (= ανδρικός), vertu (= αρετή)." },
    { la:"bonus", el:"μποναμάς [< ιταλ. bona mano (= καλό χέρι)], μπουνάτσα (< βενετ.), μπόνους // (αγγλ.) bounty (= γενναιοδωρία, αμοιβή) // (γαλλ.) bonté (= καλοσύνη) // (ιταλ.) buono (= καλός) // (ισπαν.) bueno (= καλός)." },
    { la:"sapiens", el:"(ισπαν.) sabio (= σοφός), saber (= γνωρίζω) // (γαλλ.) savoir (= γνωρίζω), sage (= σοφός), savant (= λόγιος) // (αγγλ.) sapient (= σοφός) // (ιταλ.) sapere (= γνωρίζω)." },
    { la:"consulit", el:"(γαλλ.) consulter (= συμβουλεύομαι) // (αγγλ.) consultant (= σύμβουλος), consultation (= διαβούλευση) // (ιταλ.) consultare (= συμβουλεύομαι) // (ισπαν.) consultar (= συμβουλεύομαι)." },
    { la:"vituperandus", el:"(αγγλ.) vituperation (= ύβρις, ψόγος), vituperate (= κακολογώ, επιπλήττω), vituperative (= υβριστικός) // (γαλλ.) vitupérer (= επικρίνω δριμύτατα) // (ιταλ.) vituperare (= εξυβρίζω) // (ισπαν.) vituperio (= ύβρη, ψόγος)." },
    { la:"proditor [< pro-do]", el:"προδίδωμι, προδότης, προδοσία // (ιταλ.) proditorio (= δόλιος, προδοτικός)." },
    { la:"patriae, patriam", el:"πατρίς, πατήρ // (αγγλ.) expatriate (= εκπατρισμένος, εκπατρίζω), repatriate (= επαναπατρίζω) // (γαλλ.) patrie (= πατρίδα) // (ιταλ.) patria (= πατρίδα) // (ισπαν.) patria (= πατρίδα)." },
    { la:"desertor [< desero]", el:"(γαλλ.) déserter (= εγκαταλείπω), déserteur (= λιποτάκτης) // (αγγλ.) desert (= έρημος), desertion (= λιποταξία, εγκατάλειψη) // (ιταλ.) disertore (= λιποτάκτης) // (ισπαν.) desertor (= λιποτάκτης)." },
    { la:"natura", el:"γίγνομαι, γνήσιος // (αγγλ.) nature (= φύση), natural (= φυσικός) // νατουραλισμός (< γαλλ.)." },
    { la:"con-sequitur [< cum + sequor]", el:"ἕπομαι // (αγγλ.) sequent (= ακόλουθος), consequence (= συνέπεια), sequence (= ακολουθία) // (γαλλ.) seconde (= δευτερόλεπτο), suivre (= ακολουθώ) // σεκόντο (< ιταλ.)." },
    { la:"utilitatem, utilitāti, utilitātis", el:"(αγγλ.) utility (= χρησιμότητα), use (= χρήση), utilitarian (= ωφελιμιστικός/ωφελιμιστής) // (γαλλ.) utile (= χρήσιμος), utiliser (= χρησιμοποιώ)." },
    { la:"fit", el:"φύω, φύσις // (αγγλ.) fiat (= διάταγμα, εντολή)." },
    { la:"laudandus [< laudo]", el:"(γαλλ.) laudatif (= κολακευτικός), louer (= επαινώ) // (αγγλ.) laudable (= αξιέπαινος) // (ιταλ.) lodare (= επαινώ)." },
    { la:"re", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός), rebus (= εικονογρίφος) // (γαλλ.) réel (= πραγματικός), rien (= τίποτα)." },
    { la:"publica", el:"(γαλλ.) publique (= δημόσιος) // (αγγλ.) public (= δημόσιος), publish (= δημοσιεύω) // (ιταλ.) pubblico (= δημόσιος)." },
    { la:"re publica", el:"ρεπουμπλικανός, ρεπουμπλικανισμός // ρεπούμπλικα (< ιταλ.) // (αγγλ.) republic (= δημοκρατία) // (γαλλ.) république (= δημοκρατία) // (γερμ.) Republik (= δημοκρατία)." },
    { la:"cadat [< cado]", el:"κάζο (< ιταλ. caso = συμβάν) // (αγγλ.) cadence (= ρυθμός, πτώση φωνής), accident (= ατύχημα, συμβάν), case (= περίπτωση, πτώση) // (γαλλ.) chance (= τύχη)." },
    { la:"decet", el:"(γαλλ.) décent (= αξιοπρεπής)." },
    { la:"cariorem [< carus]", el:"(γαλλ.) caritatif (= φιλανθρωπικός), cher (= αγαπητός, ακριβός) // (αγγλ.) charity (= φιλανθρωπία, αγάπη), cherish (= περιβάλλω με στοργή) // (ιταλ.) caro (= αγαπητός, ακριβός)." }
  ]
};

export default UNIT;
