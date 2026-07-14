// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 27
//  Δομή: periods -> kids (λέξεις ή προτάσεις), alignment, πίνακες λέξεων, SOS.
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 27,
  title: "Το πνεύμα ωριμάζει όπως και οι καρποί",
  latinTitle: "Lectio XXVII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρηματική χρονική, ως επιρρ. προσδ. του χρόνου στο devertit. Εισάγεται με τον ιστορικό (διηγηματικό) cum, που τονίζει τη βαθύτερη σχέση αιτίου–αιτιατού κύριας και δευτ. πρότασης· εκφέρεται με υποτακτική υπερσυντελίκου, γιατί εξαρτάται από ιστορικό χρόνο (devertit) και δηλώνει το προτερόχρονο στο παρελθόν.", kids:[
          { l:"Cum", r:"Ιστορικός/διηγηματικός σύνδεσμος", g:"χρονικός σύνδεσμος (+ υποτακτική)", d:"cum — όταν" },
          { l:"Accius", r:"Υποκείμενο", to:"στο venisset", g:"ονομ. ενικ. (αρσ. β΄)", d:"Accius, Accii/Acci (αρσ. β΄) — ο Άκκιος", note:"κλητ. ενικ.: Acci" },
          { l:"ex urbe", k:"urbs", r:"Εμπρόθετος επιρρ. προσδ. της κίνησης από τόπο", to:"στο venisset", g:"ex (πρόθ. + αφαιρ.) + urbe (αφαιρ. ενικ., θηλ.)", d:"ex — από· urbs, urbis (θηλ. γ΄) — η πόλη", note:"γεν. πληθ.: urbium" },
          { l:"Roma", r:"Επεξήγηση", to:"στο urbe", g:"αφαιρ. ενικ. (θηλ. α΄)", d:"Roma, Romae (θηλ. α΄) — η Ρώμη", note:"δεν έχει πληθ." },
          { l:"Tarentum", r:"Απρόθετη αιτιατική της κίνησης σε τόπο", to:"στο venisset", g:"αιτ. ενικ. (ουδ. β΄)", d:"Tarentum, Tarenti (ουδ. β΄) — ο Τάραντας", note:"όνομα πόλης· δεν έχει πληθ." },
          { l:"venisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσυντ. ενεργ. φωνής", d:"venio, veni, ventum, venire (4) — έρχομαι", a:"," }
        ]},
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο Tarentum (της πρότ. 1). Εισάγεται με το αναφορικό τοπικό επίρρημα ubi· εκφέρεται με οριστική υπερσυντελίκου, γιατί δηλώνει κάτι πραγματικό, συντελεσμένο στο παρελθόν πριν από άλλη πράξη.", kids:[
          { l:"ubi", r:"Αναφορικό τοπικό επίρρημα (εισάγει)", g:"αναφορικό τοπικό επίρρημα", d:"ubi — όπου" },
          { l:"Pacuvius", r:"Υποκείμενο", to:"στο recesserat", g:"ονομ. ενικ. (αρσ. β΄)", d:"Pacuvius, Pacuvii/Pacuvi (αρσ. β΄) — ο Πακούβιος", note:"κλητ. ενικ.: Pacuvi" },
          { l:"grandi", r:"Επιθετικός προσδ.", to:"στο aetate", g:"αφαιρ. ενικ., θηλ. — επίθ. γ΄ κλ.", d:"grandis, -is, -e — μεγάλος" },
          { l:"iam", r:"Επιρρ. προσδ. του χρόνου", to:"στο recesserat", g:"χρονικό επίρρημα", d:"iam — πια, ήδη" },
          { l:"aetate", r:"Αφαιρετική του χρόνου", to:"στο recesserat", g:"αφαιρ. ενικ. (θηλ. γ΄)", d:"aetas, aetatis (θηλ. γ΄) — η ηλικία", note:"γεν. πληθ.: aetatum & aetatium" },
          { l:"recesserat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσυντ. ενεργ. φωνής", d:"recedo, recessi, recessum, recedere (3) — αποσύρομαι", a:"," }
        ]},
        { l:"devertit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου", d:"deverto, deverti, deversum, devertere (3) & devertor, deverti, deverti (3, ημιαποθ.) — καταλύω, μένω", note:"εννοούμενο υποκ.: Accius" },
        { l:"ad eum", k:"is, ea, id", r:"Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο", to:"στο devertit", g:"ad (πρόθ. + αιτ.) + eum (αιτ. ενικ., αρσ.)", d:"ad — σε, προς· is, ea, id — αυτός", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Accius", r:"Υποκείμενο", to:"στο legit", g:"ονομ. ενικ. (αρσ. β΄)", d:"Accius, Accii/Acci (αρσ. β΄) — ο Άκκιος", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. επιθετική αναφορική προσδιοριστική στο Accius (της πρότ. 4). Εισάγεται με την αναφορική αντωνυμία qui· εκφέρεται με οριστική παρατατικού, γιατί δηλώνει το πραγματικό στο παρελθόν.", kids:[
          { l:"qui", r:"Υποκείμενο", to:"στο erat", g:"ονομ. ενικ., αρσ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
          { l:"multo", r:"Αφαιρετική του μέτρου", to:"στο minor", g:"αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.", d:"multus, -a, -um — πολύς" },
          { l:"minor", r:"Κατηγορούμενο", to:"στο qui (μέσω του erat)", g:"ονομ. ενικ., αρσ. — επίθ. γ΄ κλ. (συγκρ.)", d:"minor, minor, minus — μικρότερος (συγκρ. του parvus)" },
          { l:"natu", r:"Αφαιρετική της αναφοράς", to:"στο minor", g:"αφαιρ. ενικ. (αρσ. δ΄)", d:"natus, -us (αρσ. δ΄) — η ηλικία" },
          { l:"erat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατατικού", d:"sum, fui, —, esse — είμαι, υπάρχω", a:"," }
        ]},
        { l:"tragoediam", r:"Άμεσο αντικείμενο", to:"στο legit", g:"αιτ. ενικ. (θηλ. α΄)", d:"tragoedia, -ae (θηλ. α΄) — η τραγωδία" },
        { l:"suam", r:"Επιθετικός προσδ.", to:"στο tragoediam", g:"αιτ. ενικ., θηλ. — κτητ. αντων. γ΄ προσ. (1 κτήτορας)", d:"suus, sua, suum — δικός του", note:"εκφράζει άμεση αυτοπάθεια", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. επιθετική αναφορική προσδιοριστική στο tragoediam (της πρότ. 4). Εισάγεται με την αναφορική αντωνυμία cui· εκφέρεται με οριστική ενεστώτα, γιατί αναφέρεται στο παρόν.", kids:[
          { l:"cui", r:"Δοτική προσωπική κτητική", to:"στο est", g:"δοτ. ενικ., θηλ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
          { l:"Atreus", r:"Παράθεση", to:"στο nomen", g:"ονομ. ενικ. (αρσ. β΄)", d:"Atreus, -i (αρσ. β΄) — ο Ατρέας", note:"γεν.: Atrei/Atreos· αιτ.: Atreum/Atrea· κλητ.: Atreu" },
          { l:"nomen", r:"Υποκείμενο", to:"στο est", g:"ονομ. ενικ. (ουδ. γ΄)", d:"nomen, nominis (ουδ. γ΄) — το όνομα" },
          { l:"est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ.", d:"sum, fui, —, esse — είμαι, υπάρχω", a:"," }
        ]},
        { l:"ei", r:"Έμμεσο αντικείμενο", to:"στο legit", g:"δοτ. ενικ., αρσ. — δεικτ. (ως επαναληπτ.) αντων.", d:"is, ea, id — αυτός" },
        { l:"desideranti", r:"Αιτιολογική μετοχή (συνημμένη στο ei)", to:"στο ei", g:"δοτ. ενικ., αρσ. — μετοχή ενεστ. ενεργ.", d:"desidero, -avi, -atum, -are (1) — επιθυμώ", note:"ή επιθετική μτχ., επιθετικός προσδ. στο ei" },
        { l:"legit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"lego, legi, lectum, legere (3) — διαβάζω", a:"." }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Tum", r:"Επιρρ. προσδ. του χρόνου", to:"στο dixit", g:"χρονικό επίρρημα", d:"tum — τότε" },
        { l:"Pacuvius", r:"Υποκείμενο", to:"στο dixit", g:"ονομ. ενικ. (αρσ. β΄)", d:"Pacuvius, Pacuvii/Pacuvi (αρσ. β΄) — ο Πακούβιος" },
        { l:"dixit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"dico, dixi, dictum, dicere (3) — λέω", note:"β΄ ενικ. προστ. ενεστ.: dic" },
        { l:"sonora", r:"Κατηγορούμενο", to:"στο quae (μέσω του esse)", g:"αιτ. πληθ., ουδ. — επίθ. β΄ κλ.", d:"sonorus, -a, -um — ηχηρός" },
        { l:"quidem", r:"Επιρρ. προσδ. του τρόπου", to:"στο esse", g:"τροπικό επίρρημα", d:"quidem — βέβαια" },
        { l:"esse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο dixit", g:"απαρέμφατο ενεστ.", d:"sum, fui, —, esse — είμαι, υπάρχω" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"grandia", r:"Κατηγορούμενο", to:"στο quae (μέσω του esse)", g:"αιτ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"grandis, -is, -e — μεγάλος" },
        { type:"sub", key:"anaforiki", label:"Αναφορική (ουσιαστική)", note:"Δευτ. ουσιαστική αναφορική, υποκ. του esse (ετεροπροσωπία). Εκφέρεται με υποτακτική υπερσυντελίκου του πλαγίου λόγου, γιατί εξαρτάται από ιστορικό χρόνο (το απαρ. esse, ως εξαρτώμενο από το dixit) και δηλώνει το προτερόχρονο στο παρελθόν.", kids:[
          { l:"quae", r:"Αντικείμενο", to:"στο scripsisset", g:"αιτ. πληθ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος", note:"η όλη πρόταση = υποκ. του esse" },
          { l:"scripsisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσυντ. ενεργ. φωνής", d:"scribo, scripsi, scriptum, scribere (3) — γράφω", note:"εννοούμενο υποκ.: Accius", a:"," }
        ]},
        { l:"sed", r:"Σύνδεσμος", g:"αντιθετικός σύνδεσμος", d:"sed — αλλά" },
        { l:"videri", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο dixit", g:"απαρέμφατο ενεστ. παθ. φωνής", d:"video, vidi, visum, videre (2) — βλέπω· (παθ.) φαίνομαι" },
        { l:"tamen", r:"Σύνδεσμος", g:"αντιθετικός σύνδεσμος", d:"tamen — όμως" },
        { l:"ea", r:"Υποκείμενο του απαρεμφάτου", to:"στο videri (ετεροπροσωπία)", g:"αιτ. πληθ., ουδ. — δεικτ. (ως επαναληπτ.) αντων.", d:"is, ea, id — αυτός" },
        { l:"sibi", r:"Δοτική προσωπική του κρίνοντος προσώπου", to:"στο videri", g:"δοτ. ενικ. — προσωπική αντων. γ΄ προσ.", d:"sui, sibi, se — (για τον) εαυτό του" },
        { l:"duriora", r:"Κατηγορούμενο", to:"στο ea (μέσω εννοούμενου esse)", g:"αιτ. πληθ., ουδ. — επίθ. γ΄ κλ. (συγκρ.)", d:"durior, -ior, -ius — σκληρότερος (συγκρ. του durus)", note:"εκφράζει απόλυτη σύγκριση" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"acerbiora", r:"Κατηγορούμενο", to:"στο ea (μέσω εννοούμενου esse)", g:"αιτ. πληθ., ουδ. — επίθ. γ΄ κλ. (συγκρ.)", d:"acerbior, -ior, -ius — πικρότερος (συγκρ. του acerbus)", note:"εκφράζει απόλυτη σύγκριση", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Ita", r:"Επιρρ. προσδ. του τρόπου", to:"στο est", g:"τροπικό επίρρημα", d:"ita — έτσι" },
        { l:"est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ.", d:"sum, fui, —, esse — είμαι, υπάρχω", note:"εννοούμενο υποκ.: id" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (παρενθετική)", kids:[
        { l:"inquit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. — ελλειπτικό", d:"inquam — λέω" },
        { l:"Accius", r:"Υποκείμενο", to:"στο inquit", g:"ονομ. ενικ. (αρσ. β΄)", d:"Accius, Accii/Acci (αρσ. β΄) — ο Άκκιος" }
      ]},
      { type:"sub", key:"paravoliki", label:"Παραβολική", note:"Δευτ. επιρρηματική απλή παραβολική πρόταση (δηλώνει τρόπο). Εισάγεται με τον παραβολικό σύνδεσμο ut, που σχηματίζει παραβολικό ζεύγος με το επίρρ. ita της κύριας· εκφέρεται με οριστική ενεστώτα (η σύγκριση αφορά αντικειμενική πραγματικότητα)· λειτουργεί ως β΄ όρος σύγκρισης.", kids:[
        { l:"ut", r:"Παραβολικός σύνδεσμος (εισάγει)", g:"παραβολικός σύνδεσμος", d:"ut — όπως" },
        { l:"dicis", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"dico, dixi, dictum, dicere (3) — λέω", note:"εννοούμενο υποκ.: tu", a:";" }
      ]},
      { l:"neque", r:"Σύνδεσμος", g:"αντιθετικός σύνδεσμος", d:"neque — ούτε", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"id", r:"Υποκείμενο", to:"στο paenitet", g:"ονομ. ενικ., ουδ. — δεικτ. (ως επαναληπτ.) αντων.", d:"is, ea, id — αυτός· (ουδ.) αυτό" },
        { l:"me", r:"Αιτιατική του προσώπου που μετανιώνει", to:"στο paenitet", g:"αιτ. ενικ. — προσωπική αντων. α΄ προσ.", d:"ego — εγώ" },
        { l:"sane", r:"Επιρρ. προσδ. του τρόπου", to:"στο paenitet", g:"τροπικό επίρρημα", d:"sane — βέβαια", note:"συγκρ.: sanius" },
        { l:"paenitet", r:"Ρήμα (απρόσωπο)", g:"γ΄ ενικ. οριστ. ενεστ. — απρόσωπο", d:"paenitet, paenituit, —, paenitere (2) — μετανιώνω", a:";" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"meliora", r:"Κατηγορούμενο", to:"στο ενν. ea (μέσω του fore)", g:"αιτ. πληθ., ουδ. — επίθ. γ΄ κλ. (συγκρ.)", d:"melior, -ior, -ius — καλύτερος (συγκρ. του bonus)" },
        { l:"enim", r:"Σύνδεσμος", g:"αιτιολογικός σύνδεσμος (παρατακτικός)", d:"enim — γιατί" },
        { l:"fore", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο spero", g:"απαρέμφατο μέλλοντα", d:"sum, fui, —, esse — είμαι (fore = futurum esse)", note:"υποκ. του: ενν. ea (ετεροπροσωπία)" },
        { l:"spero", r:"Ρήμα", g:"α΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"spero, -avi, -atum, -are (1) — ελπίζω", note:"εννοούμενο υποκ.: ego" },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. επιθετική αναφορική προσδιοριστική στο εννοούμενο ea (της πρότ. 13). Εισάγεται με την αναφορική αντωνυμία quae· εκφέρεται με οριστική μέλλοντα, γιατί αναφέρεται στο μέλλον.", kids:[
          { l:"quae", r:"Αντικείμενο", to:"στο scribam", g:"αιτ. πληθ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
          { l:"deinceps", r:"Επιρρ. προσδ. του χρόνου", to:"στο scribam", g:"χρονικό επίρρημα", d:"deinceps — στη συνέχεια, αργότερα" },
          { l:"scribam", r:"Ρήμα", g:"α΄ ενικ. οριστ. μέλλοντα ενεργ. φωνής", d:"scribo, scripsi, scriptum, scribere (3) — γράφω", note:"εννοούμενο υποκ.: ego", a:"." }
        ]}
      ]}
    ]},

    { n: 5, kids: [
      { l:"Nam", r:"Σύνδεσμος", g:"αιτιολογικός σύνδεσμος (παρατακτικός)", d:"nam — γιατί", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. επιθετική αναφορική προσδιοριστική στο idem (της πρότ. 15). Εισάγεται με την αναφορική αντωνυμία quod· εκφέρεται με οριστική ενεστώτα, γιατί αναφέρεται στο παρόν.", kids:[
          { l:"quod", r:"Υποκείμενο", to:"στο est", g:"ονομ. ενικ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
          { l:"in pomis", k:"pomum", r:"Εμπρόθετος επιρρ. προσδ. της κατάστασης", to:"στο est", g:"in (πρόθ. + αφαιρ.) + pomis (αφαιρ. πληθ., ουδ.)", d:"in — σε· pomum, -i (ουδ. β΄) — ο καρπός" },
          { l:"est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ.", d:"sum, fui, —, esse — είμαι, υπάρχω", a:"," }
        ]},
        { l:"idem", r:"Υποκείμενο του απαρεμφάτου", to:"στο esse (ετεροπροσωπία)", g:"αιτ. ενικ., ουδ. — δεικτ. (ως επαναληπτ.) αντων.", d:"idem, eadem, idem — ο ίδιος" },
        { l:"esse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο aiunt", g:"απαρέμφατο ενεστ.", d:"sum, fui, —, esse — είμαι, υπάρχω" },
        { l:"aiunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. — ελλειπτικό", d:"aio — λέω, ισχυρίζομαι", note:"εννοούμενο υποκ.: homines" },
        { l:"in ingeniis", k:"ingenium", r:"Εμπρόθετος επιρρ. προσδ. της κατάστασης", to:"στο esse", g:"in (πρόθ. + αφαιρ.) + ingeniis (αφαιρ. πληθ., ουδ.)", d:"in — σε· ingenium, -ii/-i (ουδ. β΄) — το πνεύμα", a:":" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. επιθετική αναφορική προσδιοριστική στο εννοούμενο ea (της κύριας «post fiunt mitia et iucunda»). Εισάγεται με την αναφορική αντωνυμία quae· εκφέρεται με οριστική ενεστώτα (πραγματικό, παρόν).", kids:[
          { l:"quae", r:"Υποκείμενο", to:"στο nascuntur", g:"ονομ. πληθ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
          { l:"dura", r:"Κατηγορούμενο", to:"στο quae (μέσω του nascuntur)", g:"ονομ. πληθ., ουδ. — επίθ. β΄ κλ.", d:"durus, -a, -um — σκληρός, τραχύς" },
          { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
          { l:"acerba", r:"Κατηγορούμενο", to:"στο quae (μέσω του nascuntur)", g:"ονομ. πληθ., ουδ. — επίθ. β΄ κλ.", d:"acerbus, -a, -um — πικρός" },
          { l:"nascuntur", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. — αποθετικό", d:"nascor, natus sum, nasci (3, αποθ.) — γεννιέμαι", note:"μτχ. μέλλ.: nasciturus", a:"," }
        ]},
        { l:"post", r:"Επιρρ. προσδ. του χρόνου", to:"στο fiunt", g:"χρονικό επίρρημα", d:"post — αργότερα, ύστερα" },
        { l:"fiunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. — ανώμαλο", d:"fio, factus sum, fieri — γίνομαι", note:"εννοούμενο υποκ.: ea" },
        { l:"mitia", r:"Κατηγορούμενο", to:"στο ενν. ea (μέσω του fiunt)", g:"ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"mitis, -is, -e — γινωμένος, ώριμος" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"iucunda", r:"Κατηγορούμενο", to:"στο ενν. ea (μέσω του fiunt)", g:"ονομ. πληθ., ουδ. — επίθ. β΄ κλ.", d:"iucundus, -a, -um — γλυκός, ευχάριστος", a:";" }
      ]},
      { l:"sed", r:"Σύνδεσμος", g:"αντιθετικός σύνδεσμος", d:"sed — αλλά", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. επιθετική αναφορική προσδιοριστική στο εννοούμενο ea (της κύριας «non matura mox fiunt sed putria»). Εισάγεται με την αναφορική αντωνυμία quae· εκφέρεται με οριστική ενεστώτα (πραγματικό, παρόν).", kids:[
          { l:"quae", r:"Υποκείμενο", to:"στο gignuntur", g:"ονομ. πληθ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
          { l:"gignuntur", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. παθ. φωνής", d:"gigno, genui, genitum, gignere (3) — γεννώ" },
          { l:"statim", r:"Επιρρ. προσδ. του χρόνου", to:"στο gignuntur", g:"χρονικό επίρρημα", d:"statim — εξαρχής, αμέσως" },
          { l:"vieta", r:"Κατηγορούμενο", to:"στο quae (μέσω του gignuntur)", g:"ονομ. πληθ., ουδ. — επίθ. β΄ κλ.", d:"vietus, -a, -um — μαραμένος" },
          { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
          { l:"mollia", r:"Κατηγορούμενο", to:"στο quae (μέσω του gignuntur)", g:"ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"mollis, -is, -e — μαλακός", a:"," }
        ]},
        { l:"non", r:"Άρνηση", to:"στο fiunt", g:"αρνητικό μόριο", d:"non — δεν, όχι" },
        { l:"matura", r:"Κατηγορούμενο", to:"στο ενν. ea (μέσω του fiunt)", g:"ονομ. πληθ., ουδ. — επίθ. β΄ κλ.", d:"maturus, -a, -um — ώριμος" },
        { l:"mox", r:"Επιρρ. προσδ. του χρόνου", to:"στο fiunt", g:"χρονικό επίρρημα", d:"mox — έπειτα, σε λίγο" },
        { l:"fiunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. — ανώμαλο", d:"fio, factus sum, fieri — γίνομαι", note:"εννοούμενο υποκ.: ea" },
        { l:"sed", r:"Σύνδεσμος", g:"αντιθετικός σύνδεσμος", d:"sed — αλλά" },
        { l:"putria", r:"Κατηγορούμενο", to:"στο ενν. ea (μέσω του fiunt)", g:"ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"puter (putris), -is, -e — σάπιος", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Cum Accius venisset", el:"Όταν ο Άκκιος ήρθε" },
    { la:"ex urbe Roma Tarentum,", el:"από την πόλη Ρώμη στον Τάραντα," },
    { la:"ubi Pacuvius recesserat", el:"όπου ο Πακούβιος είχε αποσυρθεί" },
    { la:"grandi iam aetate,", el:"σε μεγάλη ήδη ηλικία," },
    { la:"devertit ad eum.", el:"κατέλυσε σε αυτόν." },
    { la:"Accius, qui erat", el:"Ο Άκκιος, που ήταν" },
    { la:"multo minor natu,", el:"πολύ μικρότερος στην ηλικία," },
    { la:"tragoediam suam,", el:"την τραγωδία του," },
    { la:"cui nomen est «Atreus»,", el:"της οποίας το όνομα είναι «Ατρέας»," },
    { la:"legit ei", el:"διάβασε σε αυτόν," },
    { la:"desideranti.", el:"επειδή (ή: που) το επιθυμούσε." },
    { la:"Tum Pacuvius dixit", el:"Τότε ο Πακούβιος είπε" },
    { la:"esse quidem sonora", el:"ότι ήταν βέβαια ηχηρά" },
    { la:"et grandia", el:"και μεγαλόπρεπα" },
    { la:"quae scripsisset,", el:"όσα είχε γράψει," },
    { la:"sed tamen ea videri sibi", el:"αλλά όμως του φαίνονταν" },
    { la:"duriora et acerbiora.", el:"κάπως σκληρά και πικρά." },
    { la:"«Ita est» inquit Accius", el:"«Έτσι είναι» είπε ο Άκκιος" },
    { la:"«ut dicis;", el:"«όπως τα λες·" },
    { la:"neque sane me paenitet id;", el:"κι ούτε βέβαια μετανιώνω γι' αυτό·" },
    { la:"enim spero fore meliora,", el:"γιατί ελπίζω πως θα είναι καλύτερα" },
    { la:"quae scribam deinceps.", el:"αυτά που θα γράψω αργότερα." },
    { la:"Nam quod est in pomis,", el:"Γιατί αυτό που συμβαίνει στους καρπούς," },
    { la:"idem aiunt esse in ingeniis:", el:"το ίδιο λένε ότι συμβαίνει και στο πνεύμα:" },
    { la:"quae nascuntur dura et acerba,", el:"αυτοί που γεννιούνται σκληροί και πικροί," },
    { la:"fiunt post", el:"γίνονται μετά" },
    { la:"mitia et iucunda;", el:"γινωμένοι και ευχάριστοι·" },
    { la:"sed quae gignuntur", el:"όσοι όμως γεννιούνται" },
    { la:"statim vieta et mollia,", el:"από την αρχή μαραμένοι και μαλακοί," },
    { la:"mox non fiunt matura", el:"αργότερα δε γίνονται ώριμοι" },
    { la:"sed putria».", el:"αλλά σάπιοι»." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"Roma, -ae", note:"δεν έχει πληθ." },
        { form:"tragoedia, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Accius, -ii (-i)" },
        { form:"Atreus, -i" },
        { form:"Pacuvius, -ii (-i)" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"ingenium, -ii (-i)" },
        { form:"pomum, -i" },
        { form:"Tarentum, -i", note:"δεν έχει πληθ." }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"aetas, aetatis" },
        { form:"urbs, urbis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"nomen, nominis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"natus, -us" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"acerbus, -a, -um" },
      { form:"bonus, -a, -um" },
      { form:"durus, -a, -um" },
      { form:"iucundus, -a, -um" },
      { form:"maturus, -a, -um" },
      { form:"multus, -a, -um" },
      { form:"parvus, -a, -um" },
      { form:"sonorus, -a, -um" },
      { form:"vietus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"grandis, -is, -e" },
      { form:"mitis, -is, -e" },
      { form:"mollis, -is, -e" },
      { form:"puter (putris), -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"acerbus, -a, -um", comp:"acerbior, -ior, -ius", sup:"acerbissimus, -a, -um" },
      { pos:"bonus, -a, -um", comp:"melior, -ior, -ius", sup:"optimus, -a, -um" },
      { pos:"durus, -a, -um", comp:"durior, -ior, -ius", sup:"durissimus, -a, -um" },
      { pos:"iucundus, -a, -um", comp:"iucundior, -ior, -ius", sup:"iucundissimus, -a, -um" },
      { pos:"maturus, -a, -um", comp:"maturior, -ior, -ius", sup:"maturissimus, -a, -um / maturrimus, -a, -um" },
      { pos:"multi, -ae, -a", comp:"plures, -es, -(i)a", sup:"plurimi, -ae, -a" },
      { pos:"parvus, -a, -um", comp:"minor, -or, -us", sup:"minimus, -a, -um" },
      { pos:"sonorus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"grandis, -is, -e", comp:"grandior, -ior, -ius", sup:"grandissimus, -a, -um" },
      { pos:"mitis, -is, -e", comp:"mitior, -ior, -ius", sup:"mitissimus, -a, -um" },
      { pos:"mollis, -is, -e", comp:"mollior, -ior, -ius", sup:"mollissimus, -a, -um" },
      { pos:"puter (putris), -is, -e", comp:"putrior, -ior, -ius", sup:"putrissimus, -a, -um & puterrimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσ." },
    { form:"se", kind:"Προσωπική", extra:"γ΄ προσ. (αυτοπαθής)" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., 1 κτήτορας" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"idem, eadem, idem", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"desidero", perf:"desideravi", sup:"desideratum", inf:"desiderare", note:"" },
      { pres:"spero", perf:"speravi", sup:"speratum", inf:"sperare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"paenitet", perf:"paenituit", sup:"—", inf:"paenitere", note:"απρόσωπο" },
      { pres:"video", perf:"vidi", sup:"visum", inf:"videre", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"β΄ ενικ. προστ. ενεστ.: dic" },
      { pres:"gigno", perf:"genui", sup:"genitum", inf:"gignere", note:"" },
      { pres:"lego", perf:"legi", sup:"lectum", inf:"legere", note:"" },
      { pres:"recedo", perf:"recessi", sup:"recessum", inf:"recedere", note:"" },
      { pres:"scribo", perf:"scripsi", sup:"scriptum", inf:"scribere", note:"" },
      { pres:"deverto / devertor", perf:"deverti", sup:"deversum / deverti", inf:"devertere / deverti", note:"ημιαποθετικό" },
      { pres:"nascor", perf:"natus sum", sup:"—", inf:"nasci", note:"αποθετικό (μτχ. μέλλ.: nasciturus)" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ / Ελλειπτικά", rows:[
      { pres:"aio", perf:"—", sup:"—", inf:"—", note:"ελλειπτικό" },
      { pres:"inquam", perf:"—", sup:"—", inf:"—", note:"ελλειπτικό" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"ανώμαλο (παθ. του facio)" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"Ιστορικός / διηγηματικός cum", body:"Η πρότ. «Cum ... venisset» είναι χρονική με ιστορικό cum: εκφέρεται με υποτακτική (υπερσυντελίκου, προτερόχρονο), γιατί ο cum υπογραμμίζει τη σχέση αιτίου–αιτιατού κύριας και δευτ. πρότασης." },
    { tag:"Σύνταξη", title:"minor natu — multo", body:"Το minor είναι συγκριτικός του parvus· το natu είναι αφαιρετική της αναφοράς και το multo αφαιρετική του μέτρου (και τα δύο στο minor)." },
    { tag:"Μετοχή", title:"desideranti: αιτιολογική μετοχή", body:"Το desideranti είναι αιτιολογική μετοχή συνημμένη στο ei (ή, κατ' άλλη ανάλυση, επιθετική μετοχή – επιθετικός προσδ. στο ei)." },
    { tag:"Απαρέμφατο", title:"Ετεροπροσωπία (esse / videri / fore)", body:"Τα ειδικά απαρέμφατα esse, videri, fore έχουν διαφορετικά υποκείμενα (quae, ea) από τα ρήματα εξάρτησης (dixit, spero) — πρόκειται για ετεροπροσωπία." },
    { tag:"Πρόταση", title:"quae scripsisset: υποτακτική πλαγίου λόγου", body:"Η ουσιαστική αναφορική «quae scripsisset» είναι υποκ. του esse και εκφέρεται με υποτακτική υπερσυντελίκου του πλαγίου λόγου (εξάρτηση από ιστορικό χρόνο, προτερόχρονο)." },
    { tag:"Σύνταξη", title:"cui ... nomen est", body:"Στην πρότ. «cui Atreus nomen est» το cui είναι δοτική προσωπική κτητική στο est, το nomen υποκείμενο και το Atreus παράθεση στο nomen." },
    { tag:"Τόπος", title:"Tarentum: απρόθετη αιτιατική κίνησης", body:"Ως όνομα πόλης, το Tarentum μπαίνει σε απρόθετη αιτιατική για την κίνηση σε τόπο (στο venisset)· αντίστοιχα το ex urbe δηλώνει κίνηση από τόπο." }
  ]
};

export default UNIT;
