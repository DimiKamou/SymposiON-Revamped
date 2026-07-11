// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 19
//  Lectio XIX — «Η συνωμοσία του Κατιλίνα»
//  Δομή ίδια με το template (unit16.js): periods -> kids (λέξεις/προτάσεις),
//  alignment, nouns, adjectives, comparatives, pronouns, verbs, sos.
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 19,
  title: "Η συνωμοσία του Κατιλίνα",
  latinTitle: "Lectio XIX",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Marco", r:"Υποκείμενο (ιδιόμ. αφαιρ. απόλυτη)", to:"στο consulibus", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Marcus, -i (αρσ. β΄) — ο Μάρκος", note:"Ιδιόμορφη αφαιρετική απόλυτη χωρίς μετοχή (το sum δεν έχει μετοχή ενεστώτα)· λειτουργεί ως επιρρ. προσδ. του χρόνου στο coniurāvit. «Marco Tullio Cicerōne et Gaio Antōnio» = υποκείμενο, «consulibus» = κατηγορηματικός προσδ." },
        { l:"Tullio", r:"Υποκείμενο (ιδιόμ. αφαιρ. απόλυτη)", to:"στο consulibus", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Tullius, -ii (-i) (αρσ. β΄) — ο Τύλλιος" },
        { l:"Cicerōne", r:"Υποκείμενο (ιδιόμ. αφαιρ. απόλυτη)", to:"στο consulibus", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"Cicero, Cicerōnis (αρσ. γ΄) — ο Κικέρωνας" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"Gaio", r:"Υποκείμενο (ιδιόμ. αφαιρ. απόλυτη)", to:"στο consulibus", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Gaius, -ii (-i) (αρσ. β΄) — ο Γάιος" },
        { l:"Antōnio", r:"Υποκείμενο (ιδιόμ. αφαιρ. απόλυτη)", to:"στο consulibus", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Antōnius, -ii (-i) (αρσ. β΄) — ο Αντώνιος" },
        { l:"consulibus", r:"Κατηγορηματικός προσδ.", to:"στα Cicerōne, Antōnio", g:"αφαιρ. πληθ., αρσ. — ουσιαστικό γ΄ κλ.", d:"consul, consulis (αρσ. γ΄) — ο ύπατος", a:"," },
        { l:"Lucius", r:"Υποκείμενο", to:"στο coniurāvit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Lucius, -ii (-i) (αρσ. β΄) — ο Λεύκιος" },
        { l:"Sergius", r:"Υποκείμενο", to:"στο coniurāvit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Sergius, -ii (-i) (αρσ. β΄) — ο Σέργιος" },
        { l:"Catilīna", r:"Υποκείμενο", to:"στο coniurāvit", g:"ονομ. ενικ., αρσ. — ουσιαστικό α΄ κλ.", d:"Catilīna, -ae (αρσ. α΄) — ο Κατιλίνας", a:"," },
        { l:"nobilissimi", r:"Επιθετικός προσδ.", to:"στο generis", g:"γεν. ενικ., ουδ. — επίθ. β΄ κλ., υπερθ. βαθμού", d:"nobilissimus, -a, -um (< nobilis, -is, -e) — αριστοκρατικότατος, επιφανέστατος" },
        { l:"generis", r:"Γενική της ιδιότητας", to:"στο vir", g:"γεν. ενικ., ουδ. — ουσιαστικό γ΄ κλ.", d:"genus, generis (ουδ. γ΄) — το γένος, η γενιά, η καταγωγή" },
        { l:"vir", r:"Παράθεση", to:"στο Lucius Sergius Catilīna", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"vir, viri (αρσ. β΄) — ο άνδρας" },
        { l:"sed", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"sed — αλλά" },
        { l:"ingenii", r:"Γενική της ιδιότητας", to:"στο vir", g:"γεν. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"ingenium, -ii (-i) (ουδ. β΄) — η φύση, ο χαρακτήρας, το πνεύμα" },
        { l:"pravissimi", r:"Επιθετικός προσδ.", to:"στο ingenii", g:"γεν. ενικ., ουδ. — επίθ. β΄ κλ., υπερθ. βαθμού", d:"pravissimus, -a, -um (< pravus, -a, -um) — πάρα πολύ διεστραμμένος, φαύλος", a:"," },
        { l:"contra rem publicam", k:"res", r:"Εμπρόθετος επιρρ. προσδ. της εχθρικής διάθεσης", to:"στο coniurāvit", g:"contra (πρόθ. + αιτ.) + rem publicam (αιτ. ενικ., θηλ.)", d:"contra — εναντίον· res publica, rei publicae (θηλ. ε΄, σύνθετο) — η πολιτεία, το κράτος", note:"publicam: επιθ. προσδ. στο rem· res publica = σύνθετο ουσιαστικό (κλίνονται και τα δύο μέρη)." },
        { l:"coniurāvit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"coniuro, coniurāvi, coniuratum, coniurāre (1) (< cum + iuro) — συνωμοτώ, δίνω όρκο μαζί με κάποιον", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Eum", r:"Αντικείμενο", to:"στο consecūti erant", g:"αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό", note:"Επαναληπτική: eum = Lucium Sergium Catilīnam." },
        { l:"clari", r:"Επιθετικός προσδ.", to:"στο viri", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ., θετ. βαθμού", d:"clarus, -a, -um — λαμπρός, ένδοξος, επιφανής" },
        { l:"quidam", r:"Επιθετικός προσδ.", to:"στα clari (sed) improbi viri", g:"ονομ. πληθ., αρσ. — αόριστη επιθετική αντωνυμία", d:"quidam, quaedam, quoddam — κάποιος, -α, -ο" },
        { l:"sed", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"sed — αλλά" },
        { l:"improbi", r:"Επιθετικός προσδ.", to:"στο viri", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ., θετ. βαθμού", d:"improbus, -a, -um (< in + probus) — φαύλος, αχρείος, ανήθικος" },
        { l:"viri", r:"Υποκείμενο", to:"στο consecūti erant", g:"ονομ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"vir, viri (αρσ. β΄) — ο άνδρας" },
        { l:"consecūti erant", r:"Ρήμα", g:"γ΄ πληθ. οριστ. υπερσυντελίκου — αποθετικό", d:"consequor, consecūtus sum, consequi (3, αποθετικό) (< cum + sequor) — ακολουθώ", a:"." }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Catilīna", r:"Υποκείμενο", to:"στο expulsus est", g:"ονομ. ενικ., αρσ. — ουσιαστικό α΄ κλ.", d:"Catilīna, -ae (αρσ. α΄) — ο Κατιλίνας" },
        { l:"a Cicerōne", k:"Cicero", r:"Εμπρόθετο ποιητικό αίτιο", to:"στο expulsus est", g:"a (πρόθ. + αφαιρ.) + Cicerōne (αφαιρ. ενικ., αρσ.)", d:"a (ab) — από· Cicero, Cicerōnis (αρσ. γ΄) — ο Κικέρωνας", note:"Ποιητικό αίτιο σε εμπρόθετη αφαιρετική ως έμψυχο." },
        { l:"ex urbe", k:"urbs", r:"Εμπρόθετος επιρρ. προσδ. της απομάκρυνσης", to:"στο expulsus est", g:"ex (πρόθ. + αφαιρ.) + urbe (αφαιρ. ενικ., θηλ.)", d:"ex (e) — από· urbs, urbis (θηλ. γ΄) — η πόλη (εδώ = η Ρώμη)" },
        { l:"expulsus est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής", d:"expello, expuli, expulsum, expellere (3) (< ex + pello) — εκδιώκω, διώχνω", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Socii", r:"Υποκείμενο", to:"στο deprehensi sunt", g:"ονομ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"socius, -ii (αρσ. β΄) — ο σύντροφος, ο εταίρος, ο σύμμαχος" },
        { l:"eius", r:"Γενική κτητική", to:"στο socii", g:"γεν. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό", note:"Κτήση χωρίς αυτοπάθεια· eius = Luci(i) Sergi(i) Catilīnae." },
        { l:"deprehensi sunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου παθ. φωνής", d:"deprehendo (deprendo), deprehendi, deprehensum, deprehendere (3) (< de + prehendo) — συλλαμβάνω", note:"Εννοείται a militibus (ποιητικό αίτιο)." }
      ]},
      { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Συνδέεται παρατακτικά (et) με την προηγούμενη ομοειδή κύρια· εννοούνται socii (υποκ.) και eius.", kids:[
        { l:"in carcere", k:"carcer", r:"Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο", to:"στο strangulāti sunt", g:"in (πρόθ. + αφαιρ.) + carcere (αφαιρ. ενικ., αρσ.)", d:"in — σε· carcer, carceris (αρσ. γ΄) — η φυλακή, το δεσμωτήριο" },
        { l:"strangulāti sunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου παθ. φωνής", d:"strangulo, strangulāvi, strangulatum, strangulāre (1) — στραγγαλίζω", note:"Εννοούμενο υποκείμενο: socii (eius).", a:"." }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Ab Antōnio", k:"Antonius", r:"Εμπρόθετο ποιητικό αίτιο", to:"στο interfectus est", g:"ab (πρόθ. + αφαιρ.) + Antōnio (αφαιρ. ενικ., αρσ.)", d:"ab (a) — από· Antōnius, -ii (-i) (αρσ. β΄) — ο Αντώνιος", note:"Ποιητικό αίτιο σε εμπρόθετη αφαιρετική ως έμψυχο.", a:"," },
        { l:"altero", r:"Επιθετικός προσδ.", to:"στο consule", g:"αφαιρ. ενικ., αρσ. — αόριστη επιθετική αντωνυμία", d:"alter, altera, alterum — ο άλλος (από δύο)" },
        { l:"consule", r:"Παράθεση", to:"στο Antōnio", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"consul, consulis (αρσ. γ΄) — ο ύπατος", a:"," },
        { l:"Catilīna", r:"Υποκείμενο", to:"στο interfectus est", g:"ονομ. ενικ., αρσ. — ουσιαστικό α΄ κλ.", d:"Catilīna, -ae (αρσ. α΄) — ο Κατιλίνας" },
        { l:"ipse", r:"Επιθετικός προσδ.", to:"στο Catilīna", g:"ονομ. ενικ., αρσ. — οριστική αντωνυμία", d:"ipse, ipsa, ipsum — ο ίδιος, η ίδια, το ίδιο" },
        { l:"cum exercitu", k:"exercitus", r:"Εμπρόθετος επιρρ. προσδ. της κοινωνίας", to:"στο interfectus est", g:"cum (πρόθ. + αφαιρ.) + exercitu (αφαιρ. ενικ., αρσ.)", d:"cum — (μαζί) με· exercitus, -us (αρσ. δ΄) — ο στρατός" },
        { l:"suo", r:"Επιθετικός προσδ.", to:"στο exercitu", g:"αφαιρ. ενικ., αρσ. — κτητική αντωνυμία γ΄ προσ. (ενός κτήτορα)", d:"suus, sua, suum — δικός, -ή, -ό του", note:"Άμεση (ευθεία) αυτοπάθεια· αναφέρεται στο υποκείμενο Catilīna.", a:"," },
        { l:"proelio", r:"Αφαιρετική (οργανική) του μέσου", to:"στη μετοχή victus", g:"αφαιρ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"proelium, -ii (-i) (ουδ. β΄) — η μάχη", note:"Απρόθετη αφαιρετική οργανική (έτσι με τα ρήματα που σημαίνουν «νικώ»)." },
        { l:"victus", r:"Χρονική μετοχή", to:"στο interfectus est", g:"ονομ. ενικ., αρσ. — μετοχή παθ. παρακειμένου, β΄ κλ.", d:"victus, -a, -um (< vinco, vici, victum, vincere (3)) — νικημένος", note:"Επιρρηματική χρονική μετοχή, συνημμένη στο υποκείμενο Catilīna· δηλώνει το προτερόχρονο.", a:"," },
        { l:"interfectus est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής", d:"interficio, interfēci, interfectum, interficere (3, σε -io) (< inter + facio) — σκοτώνω, φονεύω", a:"." }
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Gaius", r:"Υποκείμενο", to:"στο tradit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Gaius, -ii (-i) (αρσ. β΄) — ο Γάιος" },
        { l:"Sallustius", r:"Υποκείμενο", to:"στο tradit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Sallustius, -ii (-i) (αρσ. β΄) — ο Σαλλούστιος" },
        { l:"tradit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"trado, tradidi, traditum, tradere (3) (< trans + do) — παραδίδω, αναφέρω" },
        { l:"multos", r:"Επιθετικός προσδ.", to:"στο milites Rōmānos", g:"αιτ. πληθ., αρσ. — επίθ. β΄ κλ., θετ. βαθμού", d:"multi, -ae, -a — πολλοί, -ές, -ά" },
        { l:"etiam", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός (επιδοτικός) σύνδεσμος", d:"etiam — επιπλέον, ακόμη (και)" },
        { l:"milites", r:"Υποκείμενο απαρεμφάτου", to:"στο occīsos esse (ετεροπροσωπία)", g:"αιτ. πληθ., αρσ. — ουσιαστικό γ΄ κλ.", d:"miles, militis (αρσ. γ΄) — ο στρατιώτης" },
        { l:"Rōmānos", r:"Επιθετικός προσδ.", to:"στο milites", g:"αιτ. πληθ., αρσ. — επίθ. β΄ κλ.", d:"Rōmānus, -a, -um (< Roma) — Ρωμαίος, ρωμαϊκός" },
        { l:"in eādem cruentissimā pugnā", k:"pugna", r:"Εμπρόθετος επιρρ. προσδ. του χρόνου", to:"στο occīsos esse", g:"in (πρόθ. + αφαιρ.) + eādem cruentissimā pugnā (αφαιρ. ενικ., θηλ.)", d:"in — σε· pugna, -ae (θηλ. α΄) — η μάχη· cruentissimus, -a, -um — αιματηρότατος· idem, eadem, idem — ο ίδιος", note:"cruentissimā: επιθ. προσδ. (υπερθ. βαθμού) στο pugnā· eādem: επιθ. προσδ. στο cruentissimā pugnā." },
        { l:"occīsos esse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο tradit", g:"απαρέμφατο παρακειμένου παθ. φωνής", d:"occido, occīdi, occīsum, occidere (3) (< ob + caedo) — σκοτώνω, κατακόπτω", note:"Το απαρέμφατο παθ. παρακειμένου είναι πάντοτε ειδικό, με υποκείμενο σε αιτιατική.", a:"," },
        { l:"multos", r:"Υποκείμενο απαρεμφάτου", to:"στο vulnerātos esse (ετεροπροσωπία)", g:"αιτ. πληθ., αρσ. — επίθ. β΄ κλ., θετ. βαθμού", d:"multi, -ae, -a — πολλοί, -ές, -ά", note:"Υποκείμενο του vulnerātos esse (αντί του παραλειπόμενου milites, στο οποίο θα ήταν επιθ. προσδ.)." },
        { l:"autem", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"autem — πάλι, εξάλλου" },
        { l:"graviter", r:"Επιρρ. προσδ. του τρόπου", to:"στο vulnerātos esse", g:"τροπικό επίρρημα (του gravis, -is, -e)", d:"graviter — βαριά, σφοδρά, σοβαρά" },
        { l:"vulnerātos esse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο tradit", g:"απαρέμφατο παρακειμένου παθ. φωνής", d:"vulnero, vulnerāvi, vulneratum, vulnerāre (1) (< vulnus) — τραυματίζω", note:"Δεύτερο ειδικό απαρέμφατο, αντικείμενο στο tradit.", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Marco Tullio Cicerōne et Gaio Antōnio consulibus,", el:"Όταν ο Μάρκος Τύλλιος Κικέρωνας και ο Γάιος Αντώνιος ήταν ύπατοι," },
    { la:"Lucius Sergius Catilīna, nobilissimi generis vir sed ingenii pravissimi, contra rem publicam coniurāvit.", el:"ο Λεύκιος Σέργιος Κατιλίνας, άνδρας αριστοκρατικότατης γενιάς αλλά πάρα πολύ διεστραμμένου πνεύματος, συνωμότησε εναντίον της πολιτείας." },
    { la:"Eum clari quidam sed improbi viri consecūti erant.", el:"Τον είχαν ακολουθήσει κάποιοι επιφανείς αλλά αχρείοι άνδρες." },
    { la:"Catilīna a Cicerōne ex urbe expulsus est.", el:"Ο Κατιλίνας διώχθηκε από τον Κικέρωνα εκτός πόλης (= από τη Ρώμη)." },
    { la:"Socii eius deprehensi sunt", el:"Οι σύντροφοί του συνελήφθησαν" },
    { la:"et in carcere strangulāti sunt.", el:"και στραγγαλίστηκαν στη φυλακή." },
    { la:"Ab Antōnio, altero consule, Catilīna ipse cum exercitu suo, proelio victus, interfectus est.", el:"Από τον Αντώνιο, τον άλλο ύπατο, ο Κατιλίνας ο ίδιος μαζί με τον στρατό του, αφού νικήθηκε σε μάχη, σκοτώθηκε." },
    { la:"Gaius Sallustius tradit multos etiam milites Rōmānos in eādem cruentissimā pugnā occīsos esse,", el:"Ο Γάιος Σαλλούστιος αναφέρει ότι πολλοί ακόμη στρατιώτες Ρωμαίοι σκοτώθηκαν στην ίδια αιματηρότατη μάχη," },
    { la:"multos autem graviter vulnerātos esse.", el:"πολλοί πάλι τραυματίστηκαν βαριά." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Catilīna, -ae", note:"κύριο όνομα — μόνο ενικ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"pugna, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Marcus, -i", note:"κύριο όνομα — μόνο ενικ." },
        { form:"Tullius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Tulli" },
        { form:"Gaius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Gai" },
        { form:"Antōnius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Antōni" },
        { form:"Lucius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Luci" },
        { form:"Sergius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Sergi" },
        { form:"vir, viri", note:"μοναδικό β΄ κλ. σε -ir (χωρίς κατάληξη ονομ./κλητ. ενικ.)" },
        { form:"socius, -ii", note:"γεν. ενικ. μόνο ασυναίρετη (socii)" },
        { form:"Sallustius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Sallusti" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"ingenium, -ii (-i)" },
        { form:"proelium, -ii (-i)" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Cicero, Cicerōnis", note:"κύριο όνομα — μόνο ενικ." },
        { form:"consul, consulis" },
        { form:"carcer, carceris", note:"πληθ. carceres, -um = αφετηρία" },
        { form:"miles, militis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"urbs, urbis", note:"περιττοσύλλαβο· γεν. πληθ. -ium, αιτ. πληθ. -es/-is" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"genus, generis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"exercitus, -us" } ] }
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[ { form:"res, rei", note:"πλήρης ενικός & πληθυντικός· e παραλήγουσας βραχύ (rěi)" } ] }
    ]},
    { kl:"Σύνθετο ουσιαστικό", groups:[
      { gender:"Θηλυκό", items:[ { form:"res publica, rei publicae", note:"res + publica (κλίνονται και τα δύο μέρη)" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"nobilissimus, -a, -um", note:"υπερθ. βαθμού" },
      { form:"pravissimus, -a, -um", note:"υπερθ. βαθμού" },
      { form:"publicus, -a, -um" },
      { form:"clarus, -a, -um" },
      { form:"improbus, -a, -um" },
      { form:"multi, -ae, -a" },
      { form:"Rōmānus, -a, -um" },
      { form:"cruentissimus, -a, -um", note:"υπερθ. βαθμού" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ ──────────────────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"clarus, -a, -um", comp:"clarior, -ior, -ius", sup:"clarissimus, -a, -um" },
      { pos:"cruentus, -a, -um", comp:"cruentior, -ior, -ius", sup:"cruentissimus, -a, -um" },
      { pos:"improbus, -a, -um", comp:"improbior, -ior, -ius", sup:"improbissimus, -a, -um" },
      { pos:"multi, -ae, -a", comp:"plures, -es, -a", sup:"plurimi, -ae, -a", note:"ανώμαλα παραθετικά" },
      { pos:"pravus, -a, -um", comp:"pravior, -ior, -ius", sup:"pravissimus, -a, -um" },
      { pos:"publicus, -a, -um", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά" },
      { pos:"Rōmānus, -a, -um", comp:"—", sup:"—", note:"εθνικό — δεν σχηματίζει παραθετικά" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"nobilis, -is, -e", comp:"nobilior, -ior, -ius", sup:"nobilissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική (eum, eius)" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη επιθετική", extra:"< qui, quae, quod + dam" },
    { form:"alter, altera, alterum", kind:"Αόριστη επιθετική", extra:"ο άλλος (από δύο)· γεν. alterīus, δοτ. alteri" },
    { form:"ipse, ipsa, ipsum", kind:"Οριστική", extra:"δηλώνει ταυτότητα" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ενός (ή πολλών) κτητόρων" },
    { form:"idem, eadem, idem", kind:"Δεικτική", extra:"ως επαναληπτική (< is, ea, id + dem)· δηλώνει επανάληψη" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"coniuro", perf:"coniurāvi", sup:"coniuratum", inf:"coniurāre", note:"< cum + iuro" },
      { pres:"strangulo", perf:"strangulāvi", sup:"strangulatum", inf:"strangulāre", note:"" },
      { pres:"vulnero", perf:"vulnerāvi", sup:"vulneratum", inf:"vulnerāre", note:"< vulnus" }
    ]},
    { syz:"Β΄ συζυγία", rows:[] },
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"consequor", perf:"consecūtus sum", sup:"(consecūtum)", inf:"consequi", note:"αποθετικό (< cum + sequor)" },
      { pres:"expello", perf:"expuli", sup:"expulsum", inf:"expellĕre", note:"< ex + pello" },
      { pres:"deprehendo / deprendo", perf:"deprehendi / deprensi", sup:"deprehensum / deprensum", inf:"deprehendĕre / deprendĕre", note:"< de + prehendo" },
      { pres:"vinco", perf:"vici", sup:"victum", inf:"vincĕre", note:"" },
      { pres:"interficio", perf:"interfēci", sup:"interfectum", inf:"interficĕre", note:"3, σε -io (< inter + facio)" },
      { pres:"trado", perf:"tradidi", sup:"traditum", inf:"tradĕre", note:"< trans + do" },
      { pres:"occīdo", perf:"occīdi", sup:"occīsum", inf:"occīdere", note:"< ob + caedo (όχι cădo = πέφτω)" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] }
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Σύνταξη", title:"Ιδιόμορφη αφαιρετική απόλυτη", body:"«Marco Tullio Cicerōne et Gaio Antōnio consulibus»: αφαιρετική απόλυτη χωρίς μετοχή, γιατί το ρήμα sum δεν έχει μετοχή ενεστώτα. Λειτουργεί ως επιρρ. προσδ. του χρόνου στο coniurāvit· «Marco Tullio Cicerōne et Gaio Antōnio» εκλαμβάνεται ως υποκείμενο και «consulibus» (δηλωτικό αξιώματος) ως κατηγορηματικός προσδιορισμός." },
    { tag:"Απαρέμφατο", title:"Διπλά ειδικά απαρέμφατα & ετεροπροσωπία", body:"Στο «tradit ... occīsos esse ... vulnerātos esse» υπάρχουν δύο ειδικά απαρέμφατα, αντικείμενα στο tradit. Το απαρέμφατο παθητικού παρακειμένου είναι πάντοτε ειδικό, με υποκείμενο σε αιτιατική: milites (occīsos esse) και multos (vulnerātos esse) — ετεροπροσωπία, αφού διαφέρουν από το υποκείμενο του tradit (Gaius Sallustius)." },
    { tag:"Ουσιαστικό", title:"res publica: σύνθετο", body:"Το res publica, rei publicae είναι σύνθετο ουσιαστικό (res + publica) όπου κλίνονται και τα δύο συνθετικά. «contra rem publicam» = εναντίον της πολιτείας / του κράτους (publicam = επιθ. προσδ. στο rem)." },
    { tag:"Ποιητικό αίτιο", title:"a Cicerōne / ab Antōnio", body:"Το ποιητικό αίτιο εκφέρεται με εμπρόθετη αφαιρετική a/ab + αφαιρετική, επειδή πρόκειται για έμψυχα (a Cicerōne στο expulsus est· ab Antōnio στο interfectus est). Στις προτάσεις των socii εννοείται a militibus." },
    { tag:"Προσδιορισμός", title:"proelio victus", body:"Το proelio είναι απρόθετη αφαιρετική (οργανική) του μέσου στη μετοχή victus — έτσι με τα ρήματα που σημαίνουν «νικώ» (vinco, supero). Το victus είναι επιρρηματική χρονική μετοχή, συνημμένη στο υποκείμενο Catilīna, και δηλώνει το προτερόχρονο." },
    { tag:"Αντωνυμίες", title:"is / idem / ipse — suus vs eius", body:"is, ea, id (eum, eius) = δεικτική ως επαναληπτική· idem, eadem (eādem) = δηλώνει επανάληψη· ipse (ipse) = δηλώνει ταυτότητα. Στην αυτοπάθεια: suo (suus) = άμεση/ευθεία αυτοπάθεια (στο υποκ. Catilīna), ενώ eius (is) = κτήση χωρίς αυτοπάθεια." }
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  //  Ετυμολογικοί συσχετισμοί λατινικών λέξεων με ελληνικές ή άλλων ευρωπαϊκών γλωσσών.
  etymology: [
    { la:"Marco Tullio Cicerōne", el:"Μάρκος Τύλλιος Κικέρωνας" },
    { la:"Gaio Antōnio", el:"Γάιος Αντώνιος" },
    { la:"consulibus, consule", el:"(γαλλ.) consulter (= συμβουλεύω)" },
    { la:"Lucius Sergius Catilīna", el:"Λεύκιος Σέργιος Κατιλίνας" },
    { la:"nobilissimi", el:"γιγνώσκω // (γαλλ.) noble (= ευγενής, αριστοκράτης)" },
    { la:"generis", el:"γένος· γενιά" },
    { la:"ingenii", el:"(αγγλ.) engine (= κινητήρας)" },
    { la:"pravissimi", el:"μπράβος [< ιταλ. bravo (= μισθωτός σωματοφύλακας / ταραχοποιός)]" },
    { la:"contra", el:"(επίρρημα) κόντρα (< ιταλ.)" },
    { la:"rem", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός)" },
    { la:"publicam", el:"(γαλλ.) publique (= δημόσιος)" },
    { la:"rem publicam", el:"ρεπουμπλικανός, ρεπουμπλικανισμός // ρεπούμπλικα (= είδος ανδρικού καπέλου) (< ιταλ.)" },
    { la:"con-iurāvit (ius)", el:"(γαλλ.) justice (= δικαιοσύνη) // (αγγλ.) justice // (γαλλ.) juste (= δίκαιος)" },
    { la:"clari", el:"(αγγλ.) clear (= καθαρός, σαφής)" },
    { la:"im-probi", el:"(αγγλ.) probity (= χρηστότητα, ακεραιότητα)" },
    { la:"consecūti erant", el:"(αγγλ.) sequent (= ακόλουθος)" },
    { la:"urbe", el:"(γαλλ.) urbain (= αστικός)" },
    { la:"expulsus est (ex-pellor)", el:"(αγγλ.) expulsion (= εκδίωξη, απέλαση), expelled (= διωγμένος, αποβληθείς)" },
    { la:"socii", el:"(αγγλ.) social (= κοινωνικός) // σοσιαλισμός (< γαλλ.)" },
    { la:"de-prehensi sunt", el:"(αγγλ.) com-prehend (= κατανοώ, περιλαμβάνω)" },
    { la:"carcere", el:"(αγγλ.) in-carceration (= φυλάκιση, κάθειρξη)" },
    { la:"strangulāti sunt", el:"στραγγαλίζω // (αγγλ.) strangulate // (γαλλ.) étrangler" },
    { la:"exercitu", el:"(ισπαν.) ejército (= στρατός) // (γαλλ.) exercice (= άσκηση)" },
    { la:"victus", el:"(γαλλ.) victoire, (αγγλ.) victory" },
    { la:"inter-fectus est", el:"(αγγλ.) facts (= γεγονότα)" },
    { la:"Gaius Sallustius", el:"Γάιος Σαλλούστιος" },
    { la:"tradit", el:"(γαλλ.) tradition (= παράδοση)" },
    { la:"multos", el:"μάλα (= πολύ)" },
    { la:"milites", el:"μιλιταρισμός (< γαλλ.)" },
    { la:"Rōmānos", el:"Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός" },
    { la:"pugnā", el:"πύξ (= γροθιά)· πυγμή" },
    { la:"graviter", el:"(γαλλ.) gravement (= βαριά, σοβαρά) // (γαλλ.) gravité (= βαρύτητα, σοβαρότητα)" },
    { la:"vulnerātos esse (vulnus)", el:"ουλή (= επουλωμένο τραύμα) // (αγγλ.) vulnerable (= τρωτός, ευπαθής)" }
  ]
};

export default UNIT;
