// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 40
//  Lectio XL — «Ακλόνητη αποφασιστικότητα μπροστά στις απειλές του δικτάτορα»
//  (Sulla & Q. Mucius Scaevola). Δομή: periods, alignment, nouns, adjectives,
//  comparatives, pronouns, verbs, sos + προαιρετικά transforms & etymology.
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 40,
  title: "Ακλόνητη αποφασιστικότητα μπροστά στις απειλές του δικτάτορα",
  latinTitle: "Lectio XL",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Sulla", r:"Υποκείμενο", to:"στο coegerat", g:"ονομ. ενικ., αρσ. — ουσιαστικό α΄ κλ.", d:"Sulla, -ae (αρσ. α΄) — ο Σύλλας" },
        { l:"occupata", r:"Χρονική μετοχή (νόθη αφαιρ. απόλυτη)", to:"στο coegerat", g:"αφαιρ. ενικ., θηλ. — μετοχή παθ. παρακειμένου, β΄ κλ.", d:"occupatus, -a, -um (< occupo, occupāre 1, < ob + capio) — αφού καταλήφθηκε", note:"Νόθη αφαιρετική απόλυτη· δηλώνει το προτερόχρονο. Εννοείται ποιητικό αίτιο (a Sulla)." },
        { l:"urbe", r:"Υποκείμενο μετοχής", to:"στη μετοχή occupata", g:"αφαιρ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"urbs, urbis (θηλ. γ΄) — η πόλη (= η Ρώμη)" },
        { l:"senatum", r:"Αντικείμενο", to:"στο coegerat", g:"αιτ. ενικ., αρσ. — ουσιαστικό δ΄ κλ.", d:"senatus, -us (αρσ. δ΄) — η Σύγκλητος" },
        { l:"armatus", r:"Επιρρ. κατηγορούμενο του τρόπου", to:"στο Sulla (μέσω coegerat)", g:"ονομ. ενικ., αρσ. — επίθ. β΄ κλ. (επιθετοπ. μετοχή)", d:"armatus, -a, -um (< armo, armāre 1) — οπλισμένος, ένοπλος" },
        { l:"coegerat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσυντελίκου ενεργ. φωνής", d:"cogo, coegi, coactum, cogĕre (3) (< cum + ago) — συγκαλώ, αναγκάζω", a:"," }
      ]},
      { type:"sub", key:"teliki", label:"Τελική", note:"Δευτ. επιρρ. τελική (σκοπού) στο coegerat· ut (καταφατική), υποτακτική παρατατικού (iudicaretur) — ιδιομορφία στην ακολουθία (συγχρονισμός).", kids:[
        { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός τελικός σύνδεσμος", d:"ut — για να" },
        { l:"C. Marius", k:"Marius", r:"Υποκείμενο", to:"στο iudicaretur", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Gaius Marius, -ii (-i) (αρσ. β΄) — ο Γάιος Μάριος" },
        { l:"quam", r:"Επιρρ. προσδ. του ποσού", to:"στο celerrime", g:"ποσοτικό (επιτακτικό) επίρρημα", d:"quam (+ υπερθ.) — όσο το δυνατόν" },
        { l:"celerrime", r:"Επιρρ. προσδ. του τρόπου", to:"στο iudicaretur", g:"τροπικό επίρρημα, υπερθ. βαθμού (< celeriter)", d:"celerrime — πάρα πολύ γρήγορα· quam celerrime = όσο γίνεται γρηγορότερα" },
        { l:"hostis", r:"Κατηγορούμενο", to:"στο C. Marius (μέσω iudicaretur)", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"hostis, hostis (αρσ. γ΄) — ο εχθρός" },
        { l:"iudicaretur", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατατικού παθ. φωνής", d:"iudico, iudicāvi, iudicatum, iudicāre (1) — κρίνω, κηρύσσω", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Το cuius (αναφ. αντωνυμία στην αρχή περιόδου, μετά από ισχυρό σημείο στίξης) ισοδυναμεί με δεικτική (= eius = Sullae) και εισάγει κύρια πρόταση.", kids:[
        { l:"Cuius", k:"qui", r:"Γενική υποκειμενική", to:"στο voluntati", g:"γεν. ενικ., αρσ. — αναφορική αντωνυμία (ως δεικτική)", d:"qui, quae, quod — ο οποίος· cuius = eius = Sullae" },
        { l:"voluntati", r:"Αντικείμενο (στην περίφραση obviam ire)", to:"στο obviam ire", g:"δοτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"voluntas, voluntatis (θηλ. γ΄) — η βούληση, η θέληση" },
        { l:"nemo", r:"Υποκείμενο", to:"στο audebat & στο ire", g:"ονομ. ενικ., αρσ. — αόριστη ουσιαστική αντωνυμία", d:"nemo (< ne + homo) — κανένας" },
        { l:"obviam", r:"Επιρρ. προσδ. του τρόπου", to:"στο ire", g:"τροπικό επίρρημα", d:"obviam — αντίθετα· obviam ire + δοτ. = πηγαίνω αντίθετα (σε)" },
        { l:"ire", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο audebat", g:"απαρέμφατο ενεστ. — ανώμαλο", d:"eo, ii (ivi), itum, ire — πηγαίνω", note:"nemo = υποκ. του ire (ταυτοπροσωπία)." },
        { l:"audebat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατατικού — ημιαποθετικό", d:"audeo, ausus sum, (ausum), audēre (2, ημιαποθετικό) — τολμώ", a:";" }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"solus", r:"Κατηγορηματικός προσδ.", to:"στο Quintus Mucius Scaevola", g:"ονομ. ενικ., αρσ. — αντωνυμικό επίθετο", d:"solus, -a, -um — μόνος, -η, -ο (γεν. solius, δοτ. soli)" },
        { l:"Quintus", r:"Υποκείμενο", to:"στο noluit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Quintus, -i (αρσ. β΄) — ο Κόιντος" },
        { l:"Mucius", r:"Υποκείμενο", to:"στο noluit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Mucius, -ii (-i) (αρσ. β΄) — ο Μούκιος" },
        { l:"Scaevola", r:"Υποκείμενο", to:"στο noluit", g:"ονομ. ενικ., αρσ. — ουσιαστικό α΄ κλ.", d:"Scaevola, -ae (αρσ. α΄) — ο Σκαιόλας" },
        { l:"augur", r:"Παράθεση", to:"στο Quintus Mucius Scaevola", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"augur, auguris (αρσ. γ΄) — ο οιωνοσκόπος" },
        { l:"de hac re", k:"res", r:"Εμπρόθετος προσδ. της αναφοράς", to:"στη μετοχή interrogatus", g:"de (πρόθ. + αφαιρ.) + hac re (αφαιρ. ενικ., θηλ.)", d:"de — για· res, rei (θηλ. ε΄) — το θέμα· hic, haec, hoc — αυτός" },
        { l:"interrogatus", r:"Χρονική μετοχή", to:"στο noluit", g:"ονομ. ενικ., αρσ. — μετοχή παθ. παρακειμένου, β΄ κλ.", d:"interrogatus, -a, -um (< interrogo, interrogāre 1, < inter + rogo) — αφού ρωτήθηκε", note:"Συνημμένη στο υποκ. Q. M. Scaevola· δηλώνει το προτερόχρονο." },
        { l:"sententiam", r:"Αντικείμενο", to:"στο dicere", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"sententia, -ae (θηλ. α΄) — η γνώμη· sententiam dico = λέω επίσημα τη γνώμη μου" },
        { l:"dicere", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο noluit", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέω", note:"Q. M. Scaevola = υποκ. του dicere (ταυτοπροσωπία)." },
        { l:"noluit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου — ανώμαλο", d:"nolo, nolui, —, nolle (< ne + volo) — δεν θέλω", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Συνδέεται με την προηγούμενη με τον επιδοτικό quin etiam.", kids:[
        { l:"Quin etiam", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός (επιδοτικός) σύνδεσμος", d:"quin etiam — επιπλέον, κι ακόμη" },
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική στο dixit· ιστορικός-διηγηματικός cum + υποτακτική παρατατικού (instaret) — σύγχρονο στο παρελθόν.", kids:[
          { l:"cum", r:"Σύνδεσμος", g:"υποτακτικός χρονικός (ιστορικός-διηγηματικός) σύνδεσμος", d:"cum — όταν" },
          { l:"Sulla", r:"Υποκείμενο", to:"στο instaret", g:"ονομ. ενικ., αρσ. — ουσιαστικό α΄ κλ.", d:"Sulla, -ae (αρσ. α΄) — ο Σύλλας" },
          { l:"minitans", r:"Τροπική μετοχή", to:"στο instaret", g:"ονομ. ενικ., αρσ. — μετοχή ενεστ., γ΄ κλ. — αποθετικό", d:"minitans (< minitor, minitāri 1, αποθετικό) — απειλητικός, απειλώντας", note:"Συνημμένη στο υποκ. Sulla· δηλώνει το σύγχρονο." },
          { l:"ei", k:"is", r:"Αντικείμενο", to:"στο instaret", g:"δοτ. ενικ., αρσ. — δεικτική (ως οριστική) αντωνυμία", d:"is, ea, id — αυτός (ei = Quinto Mucio Scaevolae)" },
          { l:"instaret", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατατικού ενεργ. φωνής", d:"insto, institi, —, instāre (1) (< in + sto) (+ δοτ.) — ασκώ πίεση σε κάποιον", a:"," }
        ]},
        { l:"dixit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέω" },
        { l:"is", r:"Υποκείμενο", to:"στο dixit", g:"ονομ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός (is = Q. M. Scaevola)" },
        { l:"Sullae", r:"Αντικείμενο", to:"στο dixit", g:"δοτ. ενικ., αρσ. — ουσιαστικό α΄ κλ.", d:"Sulla, -ae (αρσ. α΄) — ο Σύλλας", a:":" }
      ]}
    ]},

    { n: 5, kids: [
      { type:"sub", key:"paraxoritiki", label:"Παραχωρητική", note:"Δευτ. επιρρ. παραχωρητική στο iudicabo· licet + υποτακτική ενεστώτα (ostendas)· προεξαγγέλλεται από το tamen της κύριας.", kids:[
        { l:"Licet", r:"Σύνδεσμος", g:"υποτακτικός παραχωρητικός σύνδεσμος", d:"licet — ακόμη κι αν" },
        { l:"mihi", k:"ego", r:"Έμμεσο αντικείμενο", to:"στο ostendas", g:"δοτ. ενικ. — προσωπική αντωνυμία α΄ προσ.", d:"ego — εγώ" },
        { l:"ostendas", r:"Ρήμα", g:"β΄ ενικ. υποτ. ενεστ. ενεργ. φωνής", d:"ostendo, ostendi, ostentum/ostensum, ostendĕre (3) — δείχνω", note:"Εννοούμενο υποκ.: (tu)." },
        { l:"agmina", r:"Άμεσο αντικείμενο", to:"στο ostendas", g:"αιτ. πληθ., ουδ. — ουσιαστικό γ΄ κλ.", d:"agmen, agminis (ουδ. γ΄) — το άγημα, ο στρατός" },
        { l:"militum", r:"Γενική (του περιεχομένου)", to:"στο agmina", g:"γεν. πληθ., αρσ. — ουσιαστικό γ΄ κλ.", d:"miles, militis (αρσ. γ΄) — ο στρατιώτης", a:"," }
      ]},
      { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο agmina· οριστική (πραγματικό), παρακειμένου (circumsedisti) — προτερόχρονο.", kids:[
        { l:"quibus", k:"qui", r:"Αφαιρετική (οργανική) του μέσου", to:"στο circumsedisti", g:"αφαιρ. πληθ., ουδ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
        { l:"curiam", r:"Αντικείμενο", to:"στο circumsedisti", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"curia, -ae (θηλ. α΄) — το Βουλευτήριο" },
        { l:"circumsedisti", r:"Ρήμα", g:"β΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"circumsedeo, circumsedi, circumsessum, circumsedēre (2) (< circum + sedeo) — περικυκλώνω", note:"Εννοούμενο υποκ.: (tu).", a:";" }
      ]},
      { type:"sub", key:"paraxoritiki", label:"Παραχωρητική", note:"Δευτ. επιρρ. παραχωρητική στο iudicabo· licet + υποτακτική ενεστώτα (miniteris).", kids:[
        { l:"licet", r:"Σύνδεσμος", g:"υποτακτικός παραχωρητικός σύνδεσμος", d:"licet — ακόμη κι αν" },
        { l:"mortem", r:"Άμεσο αντικείμενο", to:"στο miniteris", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"mors, mortis (θηλ. γ΄) — ο θάνατος· minitor mortem alicui = απειλώ κάποιον με θάνατο" },
        { l:"miniteris", r:"Ρήμα", g:"β΄ ενικ. υποτ. ενεστ. — αποθετικό", d:"minitor, minitatus sum, (minitatum), minitāri (1, αποθετικό) — απειλώ", note:"Εννοούμενα: υποκ. (tu), έμμ. αντικ. (mihi).", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"numquam", r:"Επιρρ. προσδ. του χρόνου", to:"στο iudicabo", g:"χρονικό επίρρημα", d:"numquam — ποτέ, ουδέποτε" },
        { l:"tamen", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"tamen — όμως", note:"Προεξαγγέλλει τις παραχωρητικές προτάσεις." },
        { l:"ego", r:"Υποκείμενο", to:"στο iudicabo", g:"ονομ. ενικ. — προσωπική αντωνυμία α΄ προσ.", d:"ego — εγώ" },
        { l:"hostem", r:"Κατηγορούμενο", to:"στο Marium (μέσω iudicabo)", g:"αιτ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"hostis, hostis (αρσ. γ΄) — ο εχθρός" },
        { l:"iudicabo", r:"Ρήμα", g:"α΄ ενικ. οριστ. μέλλοντα ενεργ. φωνής", d:"iudico, iudicāvi, iudicatum, iudicāre (1) — κρίνω, κηρύσσω" },
        { l:"Marium", r:"Αντικείμενο", to:"στο iudicabo", g:"αιτ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Marius, -ii (-i) (αρσ. β΄) — ο Μάριος", a:"." }
      ]}
    ]},

    { n: 6, kids: [
      { type:"sub", key:"enantiomatiki", label:"Εναντιωματική", note:"Δευτ. επιρρ. εναντιωματική στο meminero· etsi + οριστική (πραγματική κατάσταση)· προεξαγγέλλεται από το tamen.", kids:[
        { l:"Etsi", r:"Σύνδεσμος", g:"υποτακτικός εναντιωματικός σύνδεσμος", d:"etsi — αν και" },
        { l:"senex", r:"Κατηγορούμενο", to:"στο εννοούμενο υποκ. ego (μέσω sum)", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"senex, senis (αρσ. γ΄) — ο γέρος" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"corpore", r:"Αφαιρετική (κατηγορηματική) της ιδιότητας", to:"στο εννοούμενο ego (μέσω sum)", g:"αφαιρ. ενικ., ουδ. — ουσιαστικό γ΄ κλ.", d:"corpus, corporis (ουδ. γ΄) — το σώμα" },
        { l:"infirmo", r:"Επιθετικός προσδ.", to:"στο corpore", g:"αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.", d:"infirmus, -a, -um (< in + firmus) — αδύναμος, -η, -ο" },
        { l:"sum", r:"Ρήμα", g:"α΄ ενικ. οριστ. ενεστ. — συνδετικό", d:"sum, fui, —, esse — είμαι", note:"Εννοούμενο υποκ.: (ego).", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"semper", r:"Επιρρ. προσδ. του χρόνου", to:"στο meminero", g:"χρονικό επίρρημα", d:"semper — πάντοτε" },
        { l:"tamen", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"tamen — όμως", note:"Προεξαγγέλλει την εναντιωματική." },
        { l:"meminero", r:"Ρήμα", g:"α΄ ενικ. οριστ. συντελ. μέλλοντα (με σημ. απλού μέλλ.) — ελλειπτικό", d:"memini, meminisse (ελλειπτικό) — θυμάμαι", note:"Εννοούμενο υποκ.: (ego)." },
        { l:"urbem", r:"Υποκείμενο απαρεμφάτου", to:"στο conservatam esse", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"urbs, urbis (θηλ. γ΄) — η πόλη" },
        { l:"Romam", r:"Επεξήγηση", to:"στο urbem", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"Roma, -ae (θηλ. α΄) — η Ρώμη" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"Italiam", r:"Υποκείμενο απαρεμφάτου", to:"στο conservatam esse", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"Italia, -ae (θηλ. α΄) — η Ιταλία" },
        { l:"a Mario", k:"Marius", r:"Εμπρόθετο ποιητικό αίτιο", to:"στο conservatam esse", g:"a (πρόθ. + αφαιρ.) + Mario (αφαιρ. ενικ., αρσ.)", d:"a — από· Marius, -ii (-i) (αρσ. β΄) — ο Μάριος", note:"Ποιητικό αίτιο εμπρόθετα (έμψυχο)." },
        { l:"conservatam esse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο meminero", g:"απαρέμφατο παρακειμένου παθ. φωνής", d:"conservo, conservāvi, conservatum, conservāre (1) (< cum + servo) — σώζω, διαφυλάσσω", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Sulla, occupāta urbe, senātum armātus coegerat ut C. Marius quam celerrime hostis iudicarētur.", el:"Ο Σύλλας, αφού κατέλαβε την πόλη, είχε συγκαλέσει ένοπλος τη Σύγκλητο, για να κηρυχθεί ο Γάιος Μάριος όσο γίνεται γρηγορότερα εχθρός." },
    { la:"Cuius voluntāti nemo obviam ire audēbat;", el:"Στη θέλησή του κανένας δεν τολμούσε να πάει αντίθετα·" },
    { la:"solus Quintus Mucius Scaevola augur de hac re interrogātus sententiam dicere noluit.", el:"μόνο ο Κόιντος Μούκιος Σκαιόλας, ο οιωνοσκόπος, όταν ζητήθηκε η γνώμη του γι' αυτό το θέμα, δεν θέλησε να πει επίσημα τη γνώμη του." },
    { la:"Quin etiam cum Sulla minitans ei instāret, dixit is Sullae:", el:"Επιπλέον, όταν ο Σύλλας απειλητικός τού ασκούσε πίεση, αυτός είπε στον Σύλλα:" },
    { la:"«Licet mihi ostendas agmina militum, quibus curiam circumsedisti; licet mortem miniteris, numquam tamen ego hostem iudicābo Marium.", el:"«Ακόμη κι αν μου δείχνεις τα αγήματα των στρατιωτών, με τα οποία έχεις περικυκλώσει το Βουλευτήριο· ακόμη κι αν με απειλείς με θάνατο, ποτέ όμως εγώ δεν θα κρίνω τον Μάριο εχθρό." },
    { la:"Etsi senex et corpore infirmo sum, semper tamen meminero urbem Rōmam et Italiam a Mario conservātam esse.»", el:"Αν και είμαι γέρος και με αδύναμο σώμα, πάντοτε όμως θα θυμάμαι ότι η πόλη Ρώμη και η Ιταλία σώθηκε από τον Μάριο»." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Sulla, -ae", note:"κύριο όνομα — μόνο ενικ." },
        { form:"Scaevola, -ae", note:"κύριο όνομα — μόνο ενικ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"sententia, -ae" },
        { form:"curia, -ae" },
        { form:"Roma, -ae", note:"κύριο όνομα — μόνο ενικ." },
        { form:"Italia, -ae", note:"κύριο όνομα — μόνο ενικ." }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"C. Marius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Mari" },
        { form:"Quintus, -i", note:"κύριο όνομα — μόνο ενικ." },
        { form:"Mucius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Muci" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"hostis, hostis", note:"ισοσύλλαβο· γεν. πληθ. -ium, αιτ. πληθ. -es/-is" },
        { form:"augur, auguris" },
        { form:"miles, militis" },
        { form:"senex, senis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"urbs, urbis", note:"γεν. πληθ. -ium (urbium)" },
        { form:"voluntas, voluntatis" },
        { form:"mors, mortis", note:"γεν. πληθ. -ium (mortium)" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"agmen, agminis" },
        { form:"corpus, corporis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"senatus, -us", note:"δοτ. ενικ. senatui/senatu· περιληπτικό — μόνο ενικ." }
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
      { form:"armatus, -a, -um", note:"επιθετοπ. μετοχή (< armo)" },
      { form:"infirmus, -a, -um" }
    ]},
    { kl:"Αντωνυμικό επίθετο", items:[
      { form:"solus, -a, -um", note:"γεν. solius, δοτ. soli (και στα 3 γένη)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ ──────────────────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"armatus, -a, -um", comp:"armatior, -ior, -ius", sup:"armatissimus, -a, -um", note:"επιθετοπ. μετοχή· επίρρ. armate" },
      { pos:"infirmus, -a, -um", comp:"infirmior, -ior, -ius", sup:"infirmissimus, -a, -um", note:"επίρρ.: infirme → infirmius → infirmissime" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"celer, celeris, celere", comp:"celerior, -ior, -ius", sup:"celerrimus, -a, -um", note:"επίρρ.: celeriter → celerius → celerrime" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"cuius, quibus (ως δεικτική στην αρχή περιόδου)" },
    { form:"nemo", kind:"Αόριστη ουσιαστική", extra:"< ne + homo· αναπληρώνεται από nullus" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"hac re" },
    { form:"is, ea, id", kind:"Δεικτική-οριστική", extra:"& ως επαναληπτική (ei, is)" },
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσώπου (mihi, ego)" },
    { form:"solus, -a, -um", kind:"Αντωνυμικό επίθετο", extra:"γεν. solius, δοτ. soli" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"occupo", perf:"occupāvi", sup:"occupatum", inf:"occupāre", note:"< ob + capio" },
      { pres:"iudico", perf:"iudicāvi", sup:"iudicatum", inf:"iudicāre", note:"< ius dico" },
      { pres:"interrogo", perf:"interrogāvi", sup:"interrogatum", inf:"interrogāre", note:"< inter + rogo" },
      { pres:"minitor", perf:"minitatus sum", sup:"(minitatum)", inf:"minitāri", note:"αποθετικό (< minor)" },
      { pres:"insto", perf:"institi", sup:"—", inf:"instāre", note:"< in + sto· μτχ. μέλλ. instaturus" },
      { pres:"conservo", perf:"conservāvi", sup:"conservatum", inf:"conservāre", note:"< cum + servo" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"audeo", perf:"ausus sum", sup:"(ausum)", inf:"audēre", note:"ημιαποθετικό" },
      { pres:"circumsedeo", perf:"circumsedi", sup:"circumsessum", inf:"circumsedēre", note:"< circum + sedeo" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"cogo", perf:"coegi", sup:"coactum", inf:"cogĕre", note:"< cum + ago" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicĕre", note:"προστ. dic" },
      { pres:"ostendo", perf:"ostendi", sup:"ostentum / ostensum", inf:"ostendĕre", note:"" }
    ]},
    { syz:"Ανώμαλα & ελλειπτικά", rows:[
      { pres:"eo", perf:"ii (ivi)", sup:"itum", inf:"ire", note:"ανώμαλο — πηγαίνω" },
      { pres:"nolo", perf:"nolui", sup:"—", inf:"nolle", note:"< ne + volo" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"memini", perf:"—", sup:"—", inf:"meminisse", note:"ελλειπτικό — μόνο συντελικοί χρόνοι (meminero)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Δευτ. πρόταση", title:"Παραχωρητικές (licet) vs Εναντιωματικές (etsi)", body:"Το κείμενο έχει και τα δύο: «licet … ostendas / miniteris» = παραχωρητικές (licet + υποτακτική· υποθετική κατάσταση που, κι αν αληθεύει, δεν αναιρεί την κύρια)· «Etsi … sum» = εναντιωματική (etsi + οριστική· πραγματική κατάσταση). Και στις δύο η κύρια έχει tamen που τις προεξαγγέλλει. Ο licet προήλθε από το απρόσωπο licet (= επιτρέπεται) + παράλειψη του ut." },
    { tag:"Σκοπός", title:"Πέντε τρόποι δήλωσης του σκοπού", body:"«ut C. Marius … hostis iudicaretur»: ο σκοπός δηλώνεται με 5 ισοδύναμους τρόπους — (1) τελική ut· (2) αναφορική-τελική (qui … iudicaret)· (3) σουπίνο (… iudicatum)· (4) ad + αιτιατική γερουνδίου/γερουνδιακού (ad … iudicandum)· (5) γενική γερουνδίου/γερουνδιακού + causa/gratia (… iudicandi causa). Στους (4)-(5) γίνεται υποχρεωτική γερουνδιακή έλξη." },
    { tag:"Μετοχή", title:"Αφαιρετική απόλυτη & συνημμένη", body:"«occupata urbe» = νόθη αφαιρετική απόλυτη (χρονική μετοχή παρακ., προτερόχρονο· εννοείται a Sulla). «interrogatus» & «minitans» = συνημμένες μετοχές (χρονική/τροπική), συνημμένες στο υποκείμενό τους (Q. M. Scaevola / Sulla)." },
    { tag:"Ρήμα", title:"memini — ελλειπτικό ρήμα", body:"Το memini σχηματίζει μόνο τους συντελικούς χρόνους: παρακείμενο = ενεστώτας (memini = θυμάμαι), υπερσυντέλικο = παρατατικός, συντελεσμένος μέλλοντας = απλός μέλλοντας (meminero = θα θυμάμαι). Έχει προστακτική memento / mementote." },
    { tag:"Αντωνυμία", title:"cuius = αναφορική στην αρχή περιόδου", body:"Το «Cuius voluntati …» ξεκινά περίοδο μετά από ισχυρό σημείο στίξης· η αναφορική αντωνυμία εκεί ισοδυναμεί με δεικτική (cuius = eius = Sullae) και εισάγει κύρια πρόταση, όχι δευτερεύουσα αναφορική." },
    { tag:"Ρηματικά", title:"Αποθετικά & ημιαποθετικά", body:"minitor (απειλώ) = αποθετικό (μέση φωνή, ενεργ. σημασία· 6 τύποι ενεργ. φωνής). audeo (τολμώ) = ημιαποθετικό (ενεργ. στους αρκτικούς, παθ. στους συντελικούς). Πρβ. eo (ανώμαλο), nolo (< ne + volo), insto (χωρίς σουπίνο)." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση μετοχών σε αντίστοιχες δευτ. προτάσεις", items:[
      { from:"occupata (urbe)  [νόθη αφαιρ. απόλυτη, χρονική]",
        to:["postquam Sulla occupavit urbem  (postquam + οριστ. παρακ.)",
            "cum Sulla occupavisset urbem  (cum ιστορικός + υποτ. υπερσ.)"],
        note:"Επιρρ. χρονική μετοχή· δηλώνει το προτερόχρονο (εξάρτηση από ιστορικό χρόνο: coegerat)." },
      { from:"interrogatus  [συνημμένη χρονική μετοχή]",
        to:["postquam interrogatus est  (postquam + οριστ. παρακ.)",
            "cum interrogatus esset  (cum ιστορικός + υποτ. υπερσ.)"],
        note:"Δηλώνει το προτερόχρονο (εξάρτηση από ιστορικό χρόνο: noluit)." }
    ]},
    { id:"Β", label:"Μετατροπή δευτ. προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"cum Sulla minitans ei instaret, dixit is Sullae",
        to:"dixit is Sullae minitanti ei instanti",
        note:"Η χρονική πρόταση → χρονική μετοχή ενεστώτα, συνημμένη στο αντικείμενο Sullae (σε δοτική, για να συμφωνεί με τον όρο)." },
      { from:"Licet mihi ostendas … ; licet mortem miniteris, numquam … iudicabo",
        to:"Te mihi ostendente … ; te mortem minitante, numquam … iudicabo",
        note:"Οι παραχωρητικές → εναντιωματικές μετοχές ενεστώτα (γνήσιες αφαιρετικές απόλυτες: τα υποκείμενα te, te δεν έχουν άλλο ρόλο στην πρόταση με ρήμα το iudicabo)." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Sulla, … , senatum armatus coegerat",
        to:"A Sullā armato senatus coactus erat" },
      { from:"Licet mihi ostendas agmina militum, quibus curiam circumsedisti; … numquam tamen ego hostem iudicabo Marium",
        to:"Licet mihi ostendantur a te agmina (ονομ.) militum, quibus curia a te circumsessa est; … numquam tamen a me hostis iudicabitur Marius." }
    ]},
    { id:"Δ", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"ut C. Marius quam celerrime hostis iudicaretur",
        to:"ut senatus C. Marium quam celerrime hostem iudicaret." },
      { from:"semper tamen meminero urbem Romam et Italiam a Mario conservatam esse",
        to:"semper tamen meminero urbem (αντικ.) Romam et Italiam (αντικ.) Marium conservavisse." }
    ]},
    { id:"Ε", label:"Δήλωση του σκοπού με όλους τους τρόπους (5)", items:[
      { from:"Sulla … coegerat ut C. Marius quam celerrime hostis iudicaretur  [απαιτείται μετατροπή σε ενεργητική: … ut … hostem iudicaret]",
        to:["1. Τελική: … coegerat, ut C. Marium quam celerrime hostem iudicaret",
            "2. Αναφορική-τελική: … coegerat, qui C. Marium quam celerrime hostem iudicaret",
            "3. Σουπίνο: … coegerat C. Marium quam celerrime hostem iudicatum",
            "4. ad + αιτ. γερουνδίου/γερουνδιακού: … coegerat ad C. Marium quam celerrime hostem iudicandum",
            "5. γεν. γερουνδίου/γερουνδιακού + causa/gratia: … coegerat C. Marii quam celerrime hostis iudicandi causa / gratia"],
        note:"Στους τρόπους 4 & 5 (εμπρόθετο γερούνδιο με αντικείμενο σε αιτ.) γίνεται υποχρεωτική γερουνδιακή έλξη (βλ. μάθημα 49)." }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"(εξάρτηση: Scriptor dicit / dixit) Sulla … coegerat …; Cuius voluntati nemo … audebat; solus … noluit; Quin etiam … dixit is Sullae",
        to:"Sullam, occupata urbe, senatum armatum coegisse ut C. Marius … iudicaretur; eius voluntati neminem obviam ire audere; solum Q. M. Scaevolam augurem … interrogatum sententiam dicere noluisse; quin etiam cum Sulla … instaret, eum dixisse Sullae:",
        note:"Οι κύριες κρίσης → ειδικά απαρέμφατα με υποκ. σε αιτ.· τα ρήματα των δευτ. προτάσεων σε υποτακτική." },
      { from:"(εξάρτηση: Q. M. Scaevola dicit / dixit Sullae) Licet mihi ostendas …; licet mortem miniteris, numquam … iudicabo Marium",
        to:"licet sibi (ille) ostendat / ostenderet agmina militum, quibus curiam circumsederit / circumsedisset; licet mortem minitetur / minitaretur, numquam tamen se hostem iudicaturum esse Marium.",
        note:"ego → sibi/se (πλάγια αυτοπάθεια)· η κύρια (iudicabo) → απαρέμφατο μέλλοντα (iudicaturum esse)." }
    ]},
    { id:"Ζ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"semper tamen meminero urbem Romam et Italiam a Mario conservatam esse",
        to:"semper tamen urbs Roma et Italia a Mario conservata est.",
        note:"Το ειδικό απαρέμφατο (conservatam esse) → ρήμα οριστικής (conservata est)· τα υποκ. από αιτ. σε ονομ." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"Sulla, Sullae", el:"Σύλλας." },
    { la:"occupāta [< occupo < ob + capio]", el:"(ιταλ.) capire (= καταλαβαίνω) // (γαλλ.) occuper (= καταλαμβάνω) // (αγγλ.) occupy (= καταλαμβάνω), capture (= συλλαμβάνω, αιχμαλωτίζω)." },
    { la:"urbe, urbem", el:"(γαλλ.) urbain (= αστικός) // (αγγλ.) urban (= αστικός), suburb (= προάστιο)." },
    { la:"senātum, senex", el:"(αγγλ.) senator (= γερουσιαστής), senior (= ηλικιωμένος), senile (= γεροντικός, ξεμωραμένος)." },
    { la:"armātus", el:"άρμα, αρματολός // (γαλλ.) armée (= στρατός) // (αγγλ.) army (= στρατός), armament (= εξοπλισμός, οπλισμός)." },
    { la:"coegerat [< cogo < cum + ago], agmina [< ago]", el:"ἄγω // (αγγλ.) agile (= ευκίνητος, ευέλικτος), cogent (= πειστικός), agenda (= ημερήσια διάταξη)." },
    { la:"Gaius", el:"Γάιος." },
    { la:"Marius, Marium, Mario", el:"Μάριος." },
    { la:"celerrime [< celer]", el:"κέλης (= ταχύς ίππος), κέλλω // (γαλλ.) célérité (= ταχύτητα) // (αγγλ.) accelerate (= επιταχύνω), celerity (= ταχύτητα)." },
    { la:"hostis, hostem", el:"(αγγλ.) host (= ξενιστής), hostile (= εχθρικός) // (γαλλ.) hostilité (= εχθρότητα) // (ισπαν.) hueste (= στρατός, εκστρατευτικό σώμα)." },
    { la:"iudicarētur, iudicābo [< iudico < ius dico]", el:"(γαλλ.) justice (= δικαιοσύνη), juste (= δίκαιος), juger (= κρίνω, δικάζω) // (αγγλ.) justice, judge (= κρίνω· δικαστής), judicial (= δικαστικός)." },
    { la:"voluntāti [< volo], noluit [< nolo]", el:"βούλομαι // (αγγλ.) volunteer (= εθελοντής), voluntary (= εκούσιος, εθελοντικός) // (γαλλ.) vouloir (= θέλω), volonté (= βούληση, θέληση)." },
    { la:"nemo [< ne + homo]", el:"ουμανισμός (< γαλλ.) // (αγγλ.) human (= ανθρώπινος) // (γαλλ.) homme (= άνθρωπος) // (ισπαν.) hombre (= άνθρωπος, άντρας)." },
    { la:"obviam [< ob viam], ire", el:"εἶμι, οἶμος (= οδός) // (αγγλ.) obvious (= προφανής), via (= μέσω), exit (= έξοδος)." },
    { la:"audēbat [< audeo]", el:"(γαλλ.) audacieux (= τολμηρός), audace (= θράσος), oser (= τολμώ) // (αγγλ.) audacity (= τόλμη) // (ιταλ.) osare (= τολμώ)." },
    { la:"solus", el:"σόλο (< ιταλ.), σολίστας // (γαλλ.) solitude (= μοναξιά), seul (= μόνος) // (αγγλ.) sole (= μοναδικός)." },
    { la:"Quintus", el:"Κόιντος // (αγγλ.) quintet (= πεντάδα, κουιντέτο)." },
    { la:"Mucius", el:"Μούκιος." },
    { la:"Scaevola [< scaevus (= σκαιός)]", el:"Σκαιόλας." },
    { la:"augur", el:"(γαλλ.) augure (= οιωνός), inaugurer (= εγκαινιάζω) // (αγγλ.) augury (= οιωνοσκοπία), inauguration (= εγκαινίαση, ορκωμοσία)." },
    { la:"re", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός), republic (= δημοκρατία) // (γαλλ.) rien (= τίποτα)." },
    { la:"interrogātus [< inter-rogo]", el:"(γαλλ.) interrogation (= ερώτημα, ανάκριση) // (αγγλ.) interrogate (= ανακρίνω), arrogant (= αλαζόνας)." },
    { la:"sententiam [< sentio]", el:"(αγγλ.) sentence (= απόφαση), sentiment (= συναίσθημα), sense (= αίσθηση) // (γαλλ.) sentir (= αισθάνομαι)." },
    { la:"dicere, dixit [< dico]", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= υπαγόρευση), dire (= λέω) // (αγγλ.) dictate (= υπαγορεύω)." },
    { la:"minitans, minitēris [< minitor < minor]", el:"(γαλλ.) menacer (= απειλώ), (ισπαν.) conminar // (ιταλ.) minaccia (= απειλή)." },
    { la:"instāret [< insto < in + sto]", el:"ἵστημι, στάσις // (γαλλ.) station (= στάση), stable (= σταθερός) // (αγγλ.) instant (= στιγμή· άμεσος), instance (= περίπτωση) // (ισπαν.) estar (= είμαι, βρίσκομαι)." },
    { la:"os-tendas", el:"τείνω, τένων // (γαλλ.) étendre (= τείνω), tendu (= τεντωμένος) // (αγγλ.) ostentation (= επίδειξη), ostensible (= φαινομενικός)." },
    { la:"militum", el:"μιλιταρισμός (< γαλλ.) // (αγγλ.) military (= στρατιωτικός), militia (= πολιτοφυλακή) // (γαλλ.) militaire (= στρατιωτικός)." },
    { la:"circum-sedisti [< circum-sedeo]", el:"ἕζομαι, ἕδρα· (αγγλ.) possession (= κατοχή) // (αγγλ.) sedentary (= καθιστικός) // (γαλλ.) sédentaire (= καθιστικός)." },
    { la:"mortem", el:"βροτός // (γαλλ.) mort (= νεκρός) // (αγγλ.) mortal (= θνητός), mortuary (= νεκροτομείο, νεκρικός)." },
    { la:"ego", el:"ἐγώ // (αγγλ.) egoism (= εγωισμός) // (γαλλ.) égoïsme (= εγωισμός)." },
    { la:"corpore", el:"κόρπους (= σώμα κειμένων) // (αγγλ.) corporation (= εταιρεία, σωματείο), corpse (= πτώμα) // (γαλλ.) corps (= σώμα)." },
    { la:"infirmo [< in + firmus]", el:"φίρμα (< ιταλ.) // (αγγλ.) infirm (= ασθενής), affirm (= βεβαιώνω), firmament (= στερέωμα) // (γαλλ.) confirmer (= επιβεβαιώνω)." },
    { la:"sum, esse", el:"εἰμί // (αγγλ.) essence (= ουσία), essential (= ουσιώδης) // (γαλλ.) essence (= ουσία)." },
    { la:"semper", el:"(ισπαν.) siempre (= πάντα) // (αγγλ.) sempiternal (= αιώνιος) // (ιταλ.) sempre (= πάντα)." },
    { la:"meminero", el:"μέμνημαι, μνήμη // (γαλλ.) mémorable, mémoire (= μνήμη) // (αγγλ.) memorial (= μνημείο), memento (= ενθύμιο)." },
    { la:"Rōmam", el:"Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός // (αγγλ.) romance (= ρομάντζο, μυθιστόρημα) // (γαλλ.) roman (= μυθιστόρημα)." },
    { la:"Italiam", el:"Ιταλία // (αγγλ.) italic (= πλάγια γραφή, ιταλικός) // (γαλλ.) italique (= πλάγια γραφή)." },
    { la:"con-servātam [< conservo < cum + servo]", el:"κονσέρβα // (αγγλ.) conservation (= διατήρηση), preserve (= διατηρώ) // (γαλλ.) conserver (= διατηρώ)." }
  ]
};

export default UNIT;
