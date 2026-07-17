// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 50
//  Lectio L — «Η φτώχεια και η απληστία είναι κακοί σύμβουλοι της εξουσίας»
//  (Valerius Maximus, Facta et dicta memorabilia 6,4,2)
//  periods, alignment, nouns, adjectives, comparatives, pronouns, verbs, sos
//  + προαιρετικά transforms (Μέρος VIII) & etymology (Μέρος IX).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 50,
  title: "Η φτώχεια και η απληστία είναι κακοί σύμβουλοι της εξουσίας",
  latinTitle: "Lectio L",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική (cum ιστορικός)", note:"Δευτ. επιρρ. χρονική στο erat· cum ιστορικός-διηγηματικός + υποτακτική παρατ. (contenderent) — σύγχρονο στο παρελθόν.", kids:[
          { l:"Cum", r:"Σύνδεσμος", g:"υποτακτικός χρονικός (ιστορικός-διηγηματικός) σύνδεσμος", d:"cum — όταν" },
          { l:"Servius Sulpicius Galba", k:"Galba", r:"Υποκείμενο", to:"στο contenderent", g:"ονομ. ενικ., αρσ. — κύριο όνομα (β΄ + α΄ κλ.)", d:"Servius Sulpicius Galba — ο Σέρβιος Σουλπίκιος Γάλβας" },
          { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
          { l:"Aurelius Cotta", k:"Cotta", r:"Υποκείμενο", to:"στο contenderent", g:"ονομ. ενικ., αρσ. — κύριο όνομα (β΄ + α΄ κλ.)", d:"Aurelius Cotta — ο Αυρήλιος Κόττας" },
          { l:"consules", r:"Παράθεση", to:"στα Galba, Cotta", g:"ονομ. πληθ., αρσ. — ουσιαστικό γ΄ κλ.", d:"consul, consulis (αρσ. γ΄) — ο ύπατος" },
          { l:"in senatu", k:"senatus", r:"Εμπρόθετος προσδ. (στάση σε τόπο)", to:"στο contenderent", g:"in (πρόθ. + αφαιρ.) + senatu (αφαιρ. ενικ., αρσ. δ΄)", d:"in — σε· senatus, -us (αρσ. δ΄) — η Σύγκλητος" },
          { l:"contenderent", r:"Ρήμα", g:"γ΄ πληθ. υποτ. παρατ. ενεργ. φωνής", d:"contendo, contendi, contentum, contendĕre (3) (< cum + tendo) — φιλονικώ, αντιδικώ" },
          { type:"sub", key:"plagia", label:"Πλάγια ερωτηματική (μερικής άγνοιας)", note:"Δευτ. ουσιαστική πλάγια ερωτηματική, αντικείμενο στο contenderent· uter + υποτακτική παρατ. (mitteretur) — σύγχρονο στο παρελθόν.", kids:[
            { l:"uter", r:"Υποκείμενο", to:"στο mitteretur", g:"ονομ. ενικ., αρσ. — ερωτηματική (αντωνυμικό επίθετο) uter, utra, utrum", d:"uter, utra, utrum — ποιος από τους δύο;" },
            { l:"adversus Viriathum", k:"Viriathus", r:"Εμπρόθετος προσδ. (εναντίωση)", to:"στο mitteretur", g:"adversus (πρόθ. + αιτ.) + Viriathum (αιτ. ενικ., αρσ.)", d:"adversus — εναντίον· Viriathus, -i (αρσ. β΄) — ο Βιρίαθος" },
            { l:"in Hispaniam", k:"Hispania", r:"Εμπρόθετος προσδ. (κίνηση σε τόπο)", to:"στο mitteretur", g:"in (πρόθ. + αιτ.) + Hispaniam (αιτ. ενικ., θηλ.)", d:"in — σε· Hispania, -ae (θηλ. α΄) — η Ισπανία" },
            { l:"mitteretur", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. παθ. φωνής", d:"mitto, misi, missum, mittĕre (3) — στέλνω", a:"," }
          ]}
        ]},
        { l:"magna", r:"Επιθετικός προσδ.", to:"στο dissensio", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"magnus, -a, -um — μεγάλος, -η, -ο" },
        { l:"inter patres", k:"pater", r:"Εμπρόθετος προσδ. (του «μεταξύ»)", to:"στη φράση dissensio erat", g:"inter (πρόθ. + αιτ.) + patres (αιτ. πληθ., αρσ.)", d:"inter — ανάμεσα· patres (conscripti) — οι Συγκλητικοί" },
        { l:"conscriptos", r:"Επιθετική μετοχή", to:"στο patres", g:"αιτ. πληθ., αρσ. — μτχ. παρακ. παθ. φωνής", d:"conscribo, conscripsi, conscriptum, conscribĕre (3) — καταγράφω (patres conscripti = οι Συγκλητικοί)" },
        { l:"dissensio", r:"Υποκείμενο", to:"στο erat", g:"ονομ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"dissensio, dissensionis (θηλ. γ΄) — η διαφωνία" },
        { l:"erat", r:"Ρήμα (υπαρκτικό)", g:"γ΄ ενικ. οριστ. παρατ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι, υπάρχω", a:"," },
        { l:"aliis", k:"alius", r:"Υποκείμενο μετοχής", to:"στη μετοχή dicentibus", g:"αφαιρ. πληθ., αρσ. — αντωνυμικό επίθετο", d:"alius, alia, aliud — άλλος (aliis … aliis = άλλοι … άλλοι)" },
        { l:"pro Galba", k:"Galba", r:"Εμπρόθετος προσδ. (υπεράσπισης)", to:"στη μετοχή dicentibus", g:"pro (πρόθ. + αφαιρ.) + Galba (αφαιρ. ενικ., αρσ.)", d:"pro — υπέρ· Galba, -ae (αρσ. α΄) — ο Γάλβας" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"aliis", k:"alius", r:"Υποκείμενο μετοχής", to:"στη μετοχή dicentibus", g:"αφαιρ. πληθ., αρσ. — αντωνυμικό επίθετο", d:"alius, alia, aliud — άλλος" },
        { l:"pro Cotta", k:"Cotta", r:"Εμπρόθετος προσδ. (υπεράσπισης)", to:"στη μετοχή dicentibus", g:"pro (πρόθ. + αφαιρ.) + Cotta (αφαιρ. ενικ., αρσ.)", d:"pro — υπέρ· Cotta, -ae (αρσ. α΄) — ο Κόττας" },
        { l:"dicentibus", r:"Επιρρ. χρονική/αιτιολογική μετοχή (γνήσια αφαιρετική απόλυτη)", to:"στο erat", g:"αφαιρ. πληθ., αρσ. — μτχ. ενεστ. ενεργ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέω (dico pro aliquo = μιλώ υπέρ κάποιου)", note:"aliis … aliis = υποκ. της μετοχής· δηλώνει το σύγχρονο.", a:";" }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"solus", r:"Κατηγορηματικός προσδ.", to:"στο P. Scipio Aemilianus", g:"ονομ. ενικ., αρσ. — αντωνυμικό επίθετο", d:"solus, sola, solum — μόνος, -η, -ο" },
        { l:"P. Scipio Aemilianus", k:"Scipio", r:"Υποκείμενο", to:"στο dissensit", g:"ονομ. ενικ., αρσ. — κύριο όνομα (β΄ + γ΄ + β΄ κλ.)", d:"Publius Scipio Aemilianus — ο Πόπλιος Σκιπίωνας Αιμιλιανός" },
        { l:"cum toto senatu", k:"senatus", r:"Εμπρόθετος προσδ. (εναντίωση)", to:"στο dissensit", g:"cum (πρόθ. + αφαιρ.) + toto senatu (αφαιρ. ενικ., αρσ. δ΄)", d:"cum — με· senatus, -us (αρσ. δ΄) — η Σύγκλητος", note:"toto: κατηγορηματικός προσδ. στο senatu." },
        { l:"dissensit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"dissentio, dissensi, dissensum, dissentīre (4) (< dis + sentio) — διαφωνώ", a:":" },
        { type:"sub", key:"kyria", label:"Ευθύς λόγος — κύρια (κρίσης)", note:"Κύρια πρόταση σε ευθύ λόγο (το inquit = κύρια παρενθετική). placet απρόσωπο + τελικό απαρέμφατο.", kids:[
          { l:"Neutrum", k:"neuter", r:"Υποκείμενο απαρεμφάτου", to:"στο mitti (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — αντωνυμικό επίθετο", d:"neuter, neutra, neutrum — κανείς από τους δύο" },
          { l:"inquit", r:"Ρήμα (παρενθετικό)", g:"γ΄ ενικ. οριστ. (παρακ. εδώ) — ελλειπτικό", d:"inquam — λέγω" },
          { l:"mihi", k:"ego", r:"Δοτική προσωπική", to:"στο placet", g:"δοτ. ενικ. — προσωπική αντωνυμία α΄ προσ.", d:"ego — εγώ" },
          { l:"mitti", r:"Τελικό απαρέμφατο (υποκείμενο)", to:"στο placet", g:"απαρέμφατο ενεστ. παθ. φωνής", d:"mitto, misi, missum, mittĕre (3) — στέλνω" },
          { l:"placet", r:"Ρήμα (απρόσωπο)", g:"γ΄ ενικ. οριστ. ενεστ. — απρόσωπο (2)", d:"placet, placuit, —, placēre — είναι αρεστό, θεωρώ ορθό (+ δοτ. + απαρ.)", a:"," },
          { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρ. αιτιολογική στο placet· quia + οριστική (αντικειμενικά αποδεκτή αιτία) ενεστ. (habet).", kids:[
            { l:"quia", r:"Σύνδεσμος", g:"υποτακτικός αιτιολογικός σύνδεσμος", d:"quia — επειδή" },
            { l:"alter", k:"alter", r:"Υποκείμενο", to:"στο habet", g:"ονομ. ενικ., αρσ. — αντωνυμικό επίθετο", d:"alter, altera, alterum — ο ένας από τους δύο" },
            { l:"nihil", k:"nihil", r:"Αντικείμενο", to:"στο habet", g:"αιτ. ενικ., ουδ. — αόριστη ουσιαστική αντωνυμία", d:"nihil — τίποτα" },
            { l:"habet", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"habeo, habui, habitum, habēre (2) — έχω", a:"," }
          ]},
          { type:"sub", key:"aitiologiki", label:"Αιτιολογική (ασύνδετο)", note:"Δευτ. επιρρ. αιτιολογική στο placet· ασύνδετα (ενν. quia) + οριστική ενεστ. (est).", kids:[
            { l:"alteri", k:"alter", r:"Δοτική προσωπική (του κρίνοντος)", to:"στο est satis", g:"δοτ. ενικ., αρσ. — αντωνυμικό επίθετο", d:"alter, altera, alterum — ο ένας από τους δύο" },
            { l:"nihil", k:"nihil", r:"Υποκείμενο", to:"στο est", g:"ονομ. ενικ., ουδ. — αόριστη ουσιαστική αντωνυμία", d:"nihil — τίποτα" },
            { l:"est", k:"sum", r:"Ρήμα (συνδετικό)", g:"γ΄ ενικ. οριστ. ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι" },
            { l:"satis", r:"Επιρρ. προσδ. του ποσού (ως κατηγορούμενο)", to:"στο nihil (μέσω est)", g:"ποσοτικό επίρρημα", d:"satis — αρκετά (nihil est satis = τίποτα δεν είναι αρκετό)", a:"." }
          ]}
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Nam", r:"Σύνδεσμος", g:"παρατακτικός αιτιολογικός σύνδεσμος", d:"nam — γιατί, δηλαδή" },
        { l:"Scipio Aemilianus", k:"Scipio", r:"Υποκείμενο", to:"στο iudicabat", g:"ονομ. ενικ., αρσ. — κύριο όνομα (γ΄ + β΄ κλ.)", d:"Scipio Aemilianus — ο Σκιπίωνας Αιμιλιανός" },
        { l:"aeque", r:"Επιρρ. προσδ. του τρόπου", to:"στο iudicabat", g:"τροπικό επίρρημα", d:"aeque — εξίσου, το ίδιο" },
        { l:"malam", k:"malus", r:"Επιθετικός προσδ.", to:"στο magistram", g:"αιτ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"malus, -a, -um — κακός, -ή, -ό" },
        { l:"imperii", r:"Γενική αντικειμενική", to:"στο magistram", g:"γεν. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"imperium, -ii/-i (ουδ. β΄) — η εξουσία" },
        { l:"magistram", r:"Κατηγορούμενο του αντικειμένου", to:"στα inopiam, avaritiam", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"magistra, -ae (θηλ. α΄) — η δασκάλα, η σύμβουλος", note:"Προληπτικό κατηγορούμενο από το μεταβατικό-δοξαστικό iudicabat." },
        { l:"iudicabat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής", d:"iudico, iudicavi, iudicatum, iudicāre (1) — κρίνω, θεωρώ" },
        { l:"inopiam", r:"Αντικείμενο", to:"στο iudicabat", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"inopia, -ae (θηλ. α΄) — η φτώχεια, η ένδεια" },
        { l:"atque", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"atque — και" },
        { l:"avaritiam", r:"Αντικείμενο", to:"στο iudicabat", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"avaritia, -ae (θηλ. α΄) — η απληστία", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Qua sententia στην αρχή περιόδου: qua = δεικτική (= et ea) → εισάγει κύρια.", kids:[
        { l:"Qua", k:"qui", r:"Επιθετικός προσδ.", to:"στο sententia", g:"αφαιρ. ενικ., θηλ. — αναφορική (= δεικτική) αντωνυμία", d:"qui, quae, quod — ο οποίος (Qua = et ea)" },
        { l:"sententia", r:"Υποκείμενο μετοχής", to:"στη μετοχή dicta", g:"αφαιρ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"sententia, -ae (θηλ. α΄) — η άποψη" },
        { l:"graviter", r:"Επιρρ. προσδ. του τρόπου", to:"στη μετοχή dicta", g:"τροπικό επίρρημα", d:"graviter — με σοβαρότητα, με κύρος" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"sine ulla malevolentia", k:"malevolentia", r:"Εμπρόθετος προσδ. (εξαίρεσης)", to:"στη μετοχή dicta", g:"sine (πρόθ. + αφαιρ.) + ulla malevolentia (αφαιρ. ενικ., θηλ.)", d:"sine — χωρίς· malevolentia, -ae (θηλ. α΄) — η κακοβουλία", note:"ulla: επιθετικός προσδ. στο malevolentia." },
        { l:"dicta", r:"Επιρρ. χρονική/αιτιολογική μετοχή (νόθη αφαιρετική απόλυτη)", to:"στο obtinuit", g:"αφαιρ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέω", note:"sententia = υποκ. της μετοχής· προτερόχρονο· εννοείται ποιητικό αίτιο (a Scipione) — νόθη." },
        { l:"Scipio", k:"Scipio", r:"Υποκείμενο", to:"στο obtinuit", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"Scipio, Scipionis (αρσ. γ΄) — ο Σκιπίωνας" },
        { l:"obtinuit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"obtineo, obtinui, obtentum, obtinēre (2) (< ob + teneo) — πετυχαίνω", a:"," },
        { type:"sub", key:"symperasmatiki", label:"Συμπερασματική (ουσιαστική)", note:"Δευτ. ουσιαστική συμπερασματική, αντικείμενο στο obtinuit· ut (+ neuter, αποφατική) + υποτακτική παρατ. (mitteretur) — ιδιομορφία ακολουθίας (συγχρονισμός).", kids:[
          { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός συμπερασματικός σύνδεσμος", d:"ut — ώστε" },
          { l:"neuter", k:"neuter", r:"Υποκείμενο", to:"στο mitteretur", g:"ονομ. ενικ., αρσ. — αντωνυμικό επίθετο", d:"neuter, neutra, neutrum — κανείς από τους δύο" },
          { l:"in provinciam", k:"provincia", r:"Εμπρόθετος προσδ. (κίνηση σε τόπο)", to:"στο mitteretur", g:"in (πρόθ. + αιτ.) + provinciam (αιτ. ενικ., θηλ.)", d:"in — σε· provincia, -ae (θηλ. α΄) — η επαρχία" },
          { l:"mitteretur", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. παθ. φωνής", d:"mitto, misi, missum, mittĕre (3) — στέλνω", a:"." }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Cum Servius Sulpicius Galba et Aurelius Cotta consules in senatu contenderent uter adversus Viriathum in Hispaniam mitteretur, magna inter patres conscriptos dissensio erat, aliis pro Galba et aliis pro Cotta dicentibus;", el:"Όταν ο Σέρβιος Σουλπίκιος Γάλβας και ο Αυρήλιος Κόττας, οι ύπατοι, αντιδικούσαν στη Σύγκλητο ποιος από τους δύο να σταλεί στην Ισπανία εναντίον του Βιρίαθου, υπήρχε μεγάλη διαφωνία ανάμεσα στους Συγκλητικούς, καθώς άλλοι μιλούσαν υπέρ του Γάλβα και άλλοι υπέρ του Κόττα·" },
    { la:"solus P. Scipio Aemilianus cum toto senātu dissensit: «Neutrum» inquit «mihi mitti placet, quia alter nihil habet, alteri nihil est satis».", el:"μόνος ο Πόπλιος Σκιπίωνας Αιμιλιανός διαφώνησε με όλη τη Σύγκλητο: «Κρίνω ορθό», είπε, «να μη σταλεί κανένας από τους δύο, επειδή ο ένας δεν έχει τίποτα, ενώ για τον άλλο τίποτα δεν είναι αρκετό»." },
    { la:"Nam Scipio Aemilianus aeque malam imperii magistram iudicābat inopiam atque avaritiam.", el:"Δηλαδή ο Σκιπίωνας Αιμιλιανός θεωρούσε εξίσου κακή σύμβουλο της εξουσίας τη φτώχεια και την απληστία." },
    { la:"Qua sententia graviter et sine ulla malevolentia dicta Scipio obtinuit, ut neuter in provinciam mitteretur.", el:"Επειδή αυτή η άποψη ειπώθηκε με σοβαρότητα και χωρίς καμιά κακοβουλία, ο Σκιπίωνας πέτυχε να μη σταλεί κανένας από τους δύο στην επαρχία." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Galba, -ae", note:"κύριο όνομα (αρσ. α΄ κλ.)" },
        { form:"Cotta, -ae", note:"κύριο όνομα (αρσ. α΄ κλ.)" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"Hispania, -ae" },
        { form:"magistra, -ae" },
        { form:"inopia, -ae" },
        { form:"avaritia, -ae" },
        { form:"sententia, -ae" },
        { form:"provincia, -ae" },
        { form:"malevolentia, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Servius, -ii/-i", note:"κύριο όνομα" },
        { form:"Sulpicius, -ii/-i", note:"κύριο όνομα" },
        { form:"Aurelius, -ii/-i", note:"κύριο όνομα" },
        { form:"Viriathus, -i", note:"κύριο όνομα" },
        { form:"Publius, -ii/-i", note:"κύριο όνομα (P.)" },
        { form:"Aemilianus, -i", note:"κύριο όνομα" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"imperium, -ii/-i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"consul, consulis" },
        { form:"patres, patrum", note:"μόνο πληθ. (patres conscripti = οι Συγκλητικοί)" },
        { form:"Scipio, Scipionis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"dissensio, dissensionis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"senatus, -us" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"magnus, -a, -um", note:"ανώμαλα παραθετικά" },
      { form:"malus, -a, -um", note:"ανώμαλα παραθετικά" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ & ΕΠΙΡΡΗΜΑΤΩΝ ──────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"magnus, -a, -um", comp:"maior, -ior, -ius", sup:"maximus, -a, -um", note:"ανώμαλα· επίρρ.: magnopere → magis → maxime" },
      { pos:"malus, -a, -um", comp:"peior, -ior, -ius", sup:"pessimus, -a, -um", note:"ανώμαλα· επίρρ.: male → peius → pessime" },
      { pos:"aequus, -a, -um", comp:"aequior, -ior, -ius", sup:"aequissimus, -a, -um", note:"επίρρ.: aeque → aequius → aequissime" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"gravis, -is, -e", comp:"gravior, -ior, -ius", sup:"gravissimus, -a, -um", note:"επίρρ.: graviter → gravius → gravissime" }
    ]},
    { kl:"Επιρρήματα (ελλιπή)", rows:[
      { pos:"satis", comp:"satius", sup:"— (χωρίς υπερθετικό)", note:"ποσοτικό επίρρημα" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσ. (mihi)" },
    { form:"nihil", kind:"Αόριστη ουσιαστική", extra:"άκλιτο (ουσιαστικά)· = τίποτα" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"qua (στην αρχή περιόδου = δεικτική)" },
    { form:"uter, utra, utrum", kind:"Αντωνυμικό επίθετο (ερωτηματικό)", extra:"γεν. utrīus, δοτ. utri" },
    { form:"alius, alia, aliud", kind:"Αντωνυμικό επίθετο", extra:"aliis … aliis = άλλοι … άλλοι" },
    { form:"solus, sola, solum", kind:"Αντωνυμικό επίθετο", extra:"γεν. solīus, δοτ. soli" },
    { form:"totus, tota, totum", kind:"Αντωνυμικό επίθετο", extra:"γεν. totīus, δοτ. toti" },
    { form:"alter, altera, alterum", kind:"Αντωνυμικό επίθετο", extra:"ο ένας από τους δύο (γεν. alterīus)" },
    { form:"ullus, ulla, ullum", kind:"Αντωνυμικό επίθετο", extra:"κανένας (σε άρνηση)" },
    { form:"neuter, neutra, neutrum", kind:"Αντωνυμικό επίθετο", extra:"κανείς από τους δύο (γεν. neutrīus)" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"iudico", perf:"iudicavi", sup:"iudicatum", inf:"iudicāre", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"placet", perf:"placuit", sup:"—", inf:"placēre", note:"απρόσωπο· + δοτ. + απαρ." },
      { pres:"habeo", perf:"habui", sup:"habitum", inf:"habēre", note:"" },
      { pres:"obtineo", perf:"obtinui", sup:"obtentum", inf:"obtinēre", note:"< ob + teneo" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"contendo", perf:"contendi", sup:"contentum", inf:"contendĕre", note:"< cum + tendo" },
      { pres:"mitto", perf:"misi", sup:"missum", inf:"mittĕre", note:"" },
      { pres:"conscribo", perf:"conscripsi", sup:"conscriptum", inf:"conscribĕre", note:"< cum + scribo" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicĕre", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"dissentio", perf:"dissensi", sup:"dissensum", inf:"dissentīre", note:"< dis + sentio" }
    ]},
    { syz:"Ανώμαλα / ελλειπτικά ρήματα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"inquam", perf:"inquii", sup:"—", inf:"—", note:"ελλειπτικό — λέγω (παρενθετικό)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Αντωνυμικά", title:"Πλήθος αντωνυμικών επιθέτων", body:"uter, alius, solus, totus, alter, ullus, neuter: όλα αντωνυμικά επίθετα με γενική ενικού σε -īus και δοτική σε -i (και στα τρία γένη). Πρόσεξε: solus & totus = κατηγορηματικοί προσδιορισμοί (μόνος / ολόκληρος)· alter/neuter = «ο ένας/κανείς από τους δύο»." },
    { tag:"Αφαιρ. απόλυτη", title:"Δύο γνήσιες + μία νόθη", body:"«aliis pro Galba et aliis pro Cotta dicentibus» = γνήσια αφαιρετική απόλυτη (χρονική/αιτιολογική, με το εμπλεκόμενο σχήμα aliis … aliis ως υποκείμενο). «Qua sententia … dicta» = ΝΟΘΗ αφαιρετική απόλυτη (το εννοούμενο ποιητικό αίτιο a Scipione ταυτίζεται με το υποκ. Scipio του obtinuit)." },
    { tag:"Απρόσωπο", title:"placet + δοτική + απαρέμφατο", body:"«Neutrum mihi mitti placet»: placet απρόσωπο· mitti = τελικό απαρέμφατο-υποκείμενο· neutrum = υποκ. του απαρεμφάτου (ετεροπροσωπία)· mihi = δοτ. προσωπική. (mitti = «να σταλεί».)" },
    { tag:"Συμπερασματική", title:"Ουσιαστική συμπερασματική (obtinuit ut …)", body:"«obtinuit, ut neuter … mitteretur»: δευτ. ουσιαστική συμπερασματική, αντικείμενο στο obtinuit· ut + neuter (αποφατική) + υποτακτική· ιδιομορφία στην ακολουθία των χρόνων (συγχρονισμός κύριας–δευτ.)." },
    { tag:"Πλάγια ερώτηση", title:"uter … mitteretur (μερικής άγνοιας)", body:"«contenderent uter … mitteretur»: δευτ. πλάγια ερωτηματική μερικής άγνοιας (uter), αντικείμενο στο contenderent (μέσα σε cum ιστορικό)· υποτακτική (mitteretur) — σύγχρονο στο παρελθόν." },
    { tag:"Αναφορικά", title:"Qua sententia = δεικτική στην αρχή περιόδου", body:"«Qua sententia … dicta»: η αναφορική qua, στην αρχή περιόδου μετά από ισχυρή στίξη, ισοδυναμεί με δεικτική (Qua = et ea) και εισάγει ΚΥΡΙΑ πρόταση. Πρβ. και τις αιτιολογικές quia + ασύνδετο («alter nihil habet, alteri nihil est satis»)." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"dicentibus (aliis ... aliis) — γνήσια αφαιρετική απόλυτη αιτιολογική μετοχή ενεστώτα (δηλώνει το σύγχρονο)",
        to:[
        "(αντικειμενικά αποδεκτή αιτιολογία) quod / quia / quoniam alii ... et alii ... dicebant (quod + οριστική παρατατικού)",
        "(υποκειμενική ή υποθετική αιτιολογία) quod / quia / quoniam alii ... et alii ... dicerent (quod + υποτακτική παρατατικού)",
        "(αιτιολογία ως αποτέλεσμα εσωτερικής, λογικής διεργασίας) cum alii ... et alii ... dicerent (cum αιτιολογικός + υποτακτική παρατατικού)"],
        note:"Εξάρτηση από ιστορικό χρόνο: erat." },
      { from:"dicta (sententia) — νόθη αφαιρετική απόλυτη, αιτιολογική (ή χρονική) μετοχή παρακειμένου (δηλώνει το προτερόχρονο)",
        to:[
        "(αιτιολογική, αντικειμενικά αποδεκτή) quod / quia / quoniam eam sententiam dixerat (quod + οριστική υπερσυντελίκου)",
        "(αιτιολογική, υποκειμενική ή υποθετική) quod / quia / quoniam eam sententiam dixisset (quod + υποτακτική υπερσυντελίκου)",
        "(αιτιολογική, εσωτερική λογική διεργασία) cum eam sententiam dixisset (cum αιτιολογικός + υποτακτική υπερσυντελίκου)",
        "(χρονική) postquam eam sententiam dixit (postquam + οριστική παρακειμένου)",
        "(χρονική) cum eam sententiam dixisset (cum ιστορικός + υποτακτική υπερσυντελίκου)"],
        note:"Εξάρτηση από ιστορικό χρόνο: obtinuit." }
    ]},
    { id:"Β", label:"Μετατροπή δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Cum Servius Sulpicius Galba et Aurelius Cotta consules in senatu contenderent ..., magna ... dissensio erat",
        to:"Servio Sulpicio Galba et Aurelio Cotta consulibus in senatu contendentibus ... magna ... dissensio erat",
        note:"Μετατροπή της χρονικής πρότασης σε χρονική μετοχή, γνήσια αφαιρετική απόλυτη, γιατί τα υποκείμενά της «Servio Sulpicio Galba» και «Aurelio Cotta» δεν έχουν κανέναν άλλο ρόλο στην πρόταση με ρήμα το erat." },
      { from:"Neutrum mihi mitti placet, quia alter nihil habet",
        to:"Neutrum mihi mitti placet altero nihil habente",
        note:"Μετατροπή της αιτιολογικής πρότασης σε αιτιολογική μετοχή, γνήσια αφαιρετική απόλυτη, γιατί το υποκείμενό της «altero» δεν έχει κανέναν άλλο ρόλο στην πρόταση με ρήμα το placet." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Nam Scipio Aemilianus aeque malam imperii magistram iudicabat inopiam atque avaritiam", to:"Nam a Scipione Aemiliano aeque mala imperii magistra iudicabatur inopia atque avaritia" },
      { from:"Qua sententia graviter et sine ulla malevolentia dicta Scipio obtinuit", to:"Qua sententia graviter et sine ulla malevolentia dicta obtentum est a Scipione..." }
    ]},
    { id:"Δ", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"ut neuter in provinciam mitteretur", to:"... ut neutrum in provinciam mitterent" }
    ]},
    { id:"Ε", label:"Μετατροπή του ευθέος λόγου σε πλάγιο", items:[
      { from:"Scriptor tradit (αρκτ. χρ.) / tradidit (ιστορ. χρ.) ...", to:"cum Servius ... et Aurelius ... contenderent uter ... mitteretur, magnam ... dissensionem esse, aliis ... et aliis ... dicentibus; solum P. Scipionem Aemilianum ... dissensisse: ..." },
      { from:"Scipio Aemilianus inquit (αρκτ. ενεστ.) / inquit (ιστορ. πρκ.) ...", to:"neutrum sibi mitti placere, quia alter nihil habeat / haberet, alteri nihil sit / esset satis" },
      { from:"Scriptor dicit (αρκτ. χρ.) / dixit (ιστορ. χρ.) ...",
        to:[
        "Scipionem Aemilianum ... iudicare ... avaritiam",
        "ea sententia ... Scipionem obtinuisse, ut neuter ... mittatur / mitteretur"] }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"Cum Servius Sulpicius Galba et Aurelius Cotta consules in senatu contenderent uter adversus Viriathum in Hispaniam mitteretur", to:"Uter adversus Viriathum in Hispaniam mittitur?" }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"Servius", el:"Σέρβιος." },
    { la:"Sulpicius", el:"Σουλπίκιος." },
    { la:"Galba", el:"Γάλβας." },
    { la:"Aurelius", el:"Αυρήλιος." },
    { la:"Cotta", el:"Κόττας." },
    { la:"consules", el:"(γαλλ.) consul (= πρόξενος), consulter (= συμβουλεύω) // (αγγλ.) consultant (= σύμβουλος), consulate (= προξενείο)." },
    { la:"senatu", el:"(αγγλ.) senator (= γερουσιαστής), senior (= ηλικιωμένος), senate (= γερουσία)." },
    { la:"con-tenderent [< contendo < cum + tendo]", el:"τείνω, τένων (= τένοντας) // (γαλλ.) tendu (= τεντωμένος) // (αγγλ.) contender (= αντίπαλος), tension (= τάση)." },
    { la:"ad-versus", el:"(verso) βέρσο (= πίσω μέρος σελίδας), v.s. (= εναντίον)· ρεβέρ (< γαλλ.) // (αγγλ.) adverse (= δυσμενής, αντίθετος), adversary (= αντίπαλος) // (γαλλ.) adversaire (= αντίπαλος)." },
    { la:"Viriathum", el:"Βιρίαθος." },
    { la:"Hispaniam", el:"Ισπανία // (αγγλ.) Hispanic (= ισπανικός, ισπανόφωνος) // (γαλλ.) Espagne (= Ισπανία) // (ισπαν.) España (= Ισπανία)." },
    { la:"mitteretur, mitti [< mitto]", el:"(αγγλ.) mission (= αποστολή), missile (= βλήμα, πύραυλος), message (= μήνυμα) // (γαλλ.) mettre (= βάζω, τοποθετώ)." },
    { la:"magna", el:"μέγας // (αγγλ.) magnific (= μεγαλοπρεπής), magnitude (= μέγεθος), magnate (= μεγιστάνας) // (γαλλ.) magnificence (= μεγαλοπρέπεια) // (ιταλ.) magno (= μέγας (π.χ. Alessandro Magno))." },
    { la:"patres", el:"πατήρ // (γαλλ.) paternel (= πατρικός), père (= πατέρας) // (αγγλ.) patron (= προστάτης, πάτρωνας), paternity (= πατρότητα) // (ιταλ.) padre (= πατέρας)." },
    { la:"con-scriptos [< conscribo]", el:"σκάριφος (= όργανο γραφής), σκαρίφημα // (αγγλ.) script (= σενάριο κινηματογραφικής ταινίας), conscript (= κληρωτός, στρατολογώ), scribe (= γραφέας) // (γαλλ.) écrire (= γράφω) // (ιταλ.) scrivere (= γράφω) // (ισπαν.) escribir (= γράφω)." },
    { la:"dis-sensio, dis-sensit [< dissentio < dis + sentio]", el:"(γαλλ.) dissension (= διαφωνία), (αγγλ.) dissent, sentir (= αισθάνομαι) // (αγγλ.) sense (= αίσθηση), consent (= συναίνεση) // (ιταλ.) sentire (= αισθάνομαι, ακούω) // (ισπαν.) sentir (= αισθάνομαι)." },
    { la:"erat, est", el:"εἰμί // (αγγλ.) essence (= ουσία) // (γαλλ.) être (= είμαι, το ον) // (ιταλ.) essere (= είμαι)." },
    { la:"aliis [< alius]", el:"ἄλλος, ἄλλη, ἄλλο // (αγγλ.) alien (= ξένος, εξωγήινος), alias (= ψευδώνυμο, άλλως), alibi (= άλλοθι)." },
    { la:"dicentibus, dicta [< dico]", el:"δείκνυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση), dire (= λέω) // (αγγλ.) dictator (= δικτάτορας), verdict (= ετυμηγορία) // (ιταλ.) dire (= λέω) // (ισπαν.) decir (= λέω)." },
    { la:"solus", el:"σόλο (< ιταλ.), σολίστας // (γαλλ.) solitude (= μοναξιά), seul (= μόνος) // (αγγλ.) sole (= μοναδικός, μόνος), solitary (= μοναχικός), desolate (= ερημωμένος)." },
    { la:"Publius", el:"Πόπλιος." },
    { la:"Scipio", el:"Σκιπίωνας." },
    { la:"Aemilianus [< Aemilius]", el:"Αιμιλιανός, Αιμίλιος." },
    { la:"toto [< totus]", el:"(αγγλ.) total (= σύνολο) // totalité (= ολότητα) // (γαλλ.) tout (= όλος, ολόκληρος) // (ιταλ.) tutto (= όλος) // (ισπαν.) todo (= όλος)." },
    { la:"neutrum, neuter [< neuter < ne- + uter]", el:"οὐδέτερος // (γαλλ.) neutre // (αγγλ.) neutral (= ουδέτερος), neuter (= ουδέτερος)." },
    { la:"placet", el:"(αγγλ.) placebo (= εικονικό φάρμακο), please (= παρακαλώ, ευχαριστώ), placid (= ήρεμος, γαλήνιος) // (γαλλ.) plaire (= αρέσω) // (ιταλ.) piacere (= αρέσω, ευχαρίστηση) // (ισπαν.) placer (= ευχαρίστηση, αρέσω)." },
    { la:"alter, alteri", el:"ἄλλος, ἄλλη, ἄλλο // (αγγλ.) alternative (= εναλλακτικός), altruism (= αλτρουισμός) // (γαλλ.) autre (= άλλος) // (ιταλ.) altro (= άλλος) // (ισπαν.) otro (= άλλος)." },
    { la:"satis", el:"ἅδην [< *σαδ-ην] // (γαλλ.) satis-fait (= ικανοποιημένος), assez (= αρκετά) // (αγγλ.) satiate (= χορταίνω) // (ιταλ.) assai (= αρκετά, πολύ)." },
    { la:"habet", el:"(γερμ.) haben (= έχω), (αγγλ.) have // (αγγλ.) habit (= συνήθεια), able (= ικανός) // (γαλλ.) avoir (= έχω) // (ιταλ.) avere (= έχω)." },
    { la:"aeque [< aequus]", el:"(αγγλ.) equal (= ίσος), equator (= ισημερινός) // (γαλλ.) égal (= ίσος) // (ιταλ.) uguale (= ίσος) // (ισπαν.) igual (= ίσος)." },
    { la:"malam [< malus], male-volentia [< malevolens < male- + volo]", el:"μέλας, (γαλλ.) mal (= κακός), (ισπαν.) male-volencia (= μοχθηρία) // βούλομαι, (αγγλ.) volunteer (= εθελοντής) // (αγγλ.) malice (= κακία), voluntary (= εθελοντικός) // (γαλλ.) vouloir (= θέλω) // (ιταλ.) malo (= κακός)." },
    { la:"imperii", el:"ιμπεριαλισμός (< γαλλ.) // (αγγλ.) empire (= αυτοκρατορία), emperor (= αυτοκράτορας), imperial (= αυτοκρατορικός) // (γαλλ.) empereur (= αυτοκράτορας)." },
    { la:"magistram [< magister < magis]", el:"μάγιστρος, μαέστρος (< ιταλ.), μάστορας // (αγγλ.) master (= κύριος, αφέντης), magistrate (= δικαστικός άρχοντας) // (γαλλ.) maître (= κύριος, δάσκαλος) // (γερμ.) Meister (= μάστορας, μάστερ)." },
    { la:"iudicabat [< iudico < ius dico]", el:"(γαλλ.) justice (= δικαιοσύνη), juste (= δίκαιος), juger (= κρίνω) // δείκνυμι (= δείχνω) // (αγγλ.) judge (= δικαστής), prejudice (= προκατάληψη) // (ιταλ.) giudice (= δικαστής)." },
    { la:"avaritiam", el:"(γαλλ.) avarice (= φιλαργυρία), avare (= φιλάργυρος) // (αγγλ.) avaricious (= φιλάργυρος) // (ιταλ.) avaro (= φιλάργυρος) // (ισπαν.) avaro (= φιλάργυρος)." },
    { la:"sententia [< sentio]", el:"(αγγλ.) sentence (= πρόταση και απόφαση), sentiment (= συναίσθημα), sense (= αίσθηση, νόημα) // (γαλλ.) sentir (= αισθάνομαι) // (ιταλ.) sentire (= αισθάνομαι)." },
    { la:"graviter [< gravis]", el:"βαρύς // (γαλλ.) gravité (= βαρύτητα, σοβαρότητα) // grièvement (= βαριά, σοβαρά) // (αγγλ.) grave (= σοβαρός), gravity (= βαρύτητα) // (ιταλ.) grave (= βαρύς, σοβαρός) // (ισπαν.) grave (= σοβαρός, βαρύς)." },
    { la:"obtinuit [< obtineo < ob + teneo]", el:"τείνω // (γαλλ.) tenir (= κρατώ), obtenir (= αποκτώ) // (αγγλ.) obtain (= αποκτώ), tenant (= ενοικιαστής) // (ιταλ.) ottenere (= αποκτώ) // (ισπαν.) tener (= έχω, κρατώ)." },
    { la:"provinciam", el:"(γαλλ.) province (= επαρχία), Provence (= Προβηγκία) // (αγγλ.) provincial (= επαρχιακός) // (ιταλ.) provincia (= επαρχία)." }
  ]
};

export default UNIT;
