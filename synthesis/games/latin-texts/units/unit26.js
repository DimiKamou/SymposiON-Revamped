// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 26
//  «Το πνεύμα ωριμάζει όπως οι καρποί» (Accius & Pacuvius, κατά Gellium)
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 26,
  title: "Το πνεύμα ωριμάζει όπως οι καρποί",
  latinTitle: "Lectio XXVI",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκείμενο του devertit: Accius (από τη χρονική).', kids:[
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική, ως επιρρ. προσδ. του χρόνου στο «devertit». Εισάγεται με τον ιστορικό/διηγηματικό σύνδεσμο cum και εκφέρεται με υποτακτική υπερσυντελίκου (venisset), δηλώνοντας το προτερόχρονο στο παρελθόν με έμφαση στη βαθύτερη σχέση των γεγονότων.', kids:[
          { l:'Cum', r:'Χρον. σύνδεσμος', g:'ιστορικός/διηγηματικός cum (+ υποτακτική)', d:'cum — όταν, αφού' },
          { l:'Accius', r:'Υποκείμενο', to:'στο venisset (και στο devertit)', g:'ονομ. ενικ., αρσ.', d:'Accius, -ii/-i (αρσ. β΄) — ο Άκκιος' },
          { l:'ex urbe', k:'urbs', r:'Εμπρόθετος επιρρ. προσδ. της απομάκρυνσης', to:'στο venisset', g:'ex (πρόθ. + αφαιρ.) + urbe (αφαιρ. ενικ.)', d:'ex — από· urbs, urbis (θηλ. γ΄) — η πόλη' },
          { l:'Roma', r:'Επεξήγηση', to:'στο urbe', g:'αφαιρ. ενικ., θηλ. — ομοιόπτωτος προσδ.', d:'Roma, -ae (θηλ. α΄, χωρίς πληθ.) — η Ρώμη' },
          { l:'Tarentum', r:'Επιρρ. προσδ. της κίνησης προς τόπο', to:'στο venisset', g:'αιτ. ενικ., ουδ. — όνομα πόλης (χωρίς πρόθ.)', d:'Tarentum, -i (ουδ. β΄, χωρίς πληθ.) — ο Τάραντας' },
          { l:'venisset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. υπερσ. ενεργ.', d:'venio, veni, ventum, venire (4) — έρχομαι', a:',' }
        ]},
        { type:'sub', key:'anaforiki', label:'Αναφορική (τοπική)', note:'Δευτ. αναφορική προσδιοριστική (τοπική) στο Tarentum. Εισάγεται με το αναφορικό τοπικό επίρρημα ubi και εκφέρεται με οριστική (recesserat), γιατί δηλώνει κάτι το πραγματικό.', kids:[
          { l:'ubi', r:'Αναφ. τοπ. επίρρημα', g:'αναφορικό τοπικό επίρρημα — εισάγει την αναφορική', d:'ubi — όπου' },
          { l:'Pacuvius', r:'Υποκείμενο', to:'στο recesserat', g:'ονομ. ενικ., αρσ.', d:'Pacuvius, -ii/-i (αρσ. β΄) — ο Πακούβιος' },
          { l:'grandi', r:'Επιθετικός προσδ.', to:'στο aetate', g:'αφαιρ. ενικ., θηλ. — επίθ. γ΄ κλ.', d:'grandis, -is, -e — μεγάλος, προχωρημένος' },
          { l:'iam', r:'Επιρρ. προσδ. του χρόνου', to:'στο recesserat', g:'χρονικό επίρρημα', d:'iam — πια, ήδη' },
          { l:'aetate', r:'Αφαιρετική της ιδιότητας', to:'στο Pacuvius (μέσω recesserat)', g:'αφαιρ. ενικ., θηλ.', d:'aetas, aetatis (θηλ. γ΄) — η ηλικία', note:'«grandi aetate» = σε προχωρημένη ηλικία.' },
          { l:'recesserat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσ. ενεργ.', d:'recedo, recessi, recessum, recedere (3) — αποσύρομαι, αποχωρώ', a:',' }
        ]},
        { l:'devertit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. — ημιαποθετικό', d:'devertor/deverto, deverti, deversum, deverti/devertere (3, ημιαποθ.) — καταλύω, φιλοξενούμαι' },
        { l:'ad eum', k:'is, ea, id', r:'Εμπρόθετος επιρρ. προσδ. (κίνηση/κατεύθυνση σε πρόσωπο)', to:'στο devertit', g:'ad (πρόθ. + αιτ.) + eum (αιτ. ενικ., αρσ.)', d:'ad — σε, προς· is, ea, id — αυτός, αυτή, αυτό', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Accius', r:'Υποκείμενο', to:'στο legit', g:'ονομ. ενικ., αρσ.', d:'Accius, -ii/-i (αρσ. β΄) — ο Άκκιος', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική στο Accius, με οριστική (πραγματικό).', kids:[
          { l:'qui', r:'Υποκείμενο', to:'στο erat', g:'ονομ. ενικ., αρσ. — αναφορ. αντων.', d:'qui, quae, quod — ο οποίος' },
          { l:'multo', r:'Αφαιρετική του μέτρου/διαφοράς', to:'στο minor', g:'αφαιρ. ενικ., ουδ.', d:'multus, -a, -um — πολύς· «multo» = κατά πολύ' },
          { l:'minor', r:'Κατηγορούμενο', to:'στο qui (μέσω erat)', g:'ονομ. ενικ., αρσ. — συγκριτικός βαθμός', d:'parvus, -a, -um (συγκρ. minor) — μικρός' },
          { l:'natu', r:'Αφαιρετική της αναφοράς', to:'στο minor', g:'αφαιρ. ενικ. (δ΄ κλ.) — υπερσυντ. τύπος με αφαιρ. μόνο', d:'natus, -us (αρσ. δ΄) — η ηλικία· «minor natu» = μικρότερος στην ηλικία' },
          { l:'erat', r:'Ρήμα (συνδετικό)', g:'γ΄ ενικ. οριστ. παρατ.', d:'sum, fui, esse — είμαι', a:',' }
        ]},
        { l:'tragoediam', r:'Αντικείμενο', to:'στο legit', g:'αιτ. ενικ., θηλ.', d:'tragoedia, -ae (θηλ. α΄) — η τραγωδία' },
        { l:'suam', r:'Επιθετικός προσδ.', to:'στο tragoediam', g:'αιτ. ενικ., θηλ. — κτητ. αντων. (γ΄ προσ.)', d:'suus, sua, suum — δικός του', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική στο tragoediam, με οριστική (πραγματικό).', kids:[
          { l:'cui', r:'Δοτ. προσωπική κτητική', to:'στο est', g:'δοτ. ενικ. — αναφορ. αντων.', d:'qui, quae, quod — ο οποίος· «cui nomen est» = του οποίου το όνομα είναι' },
          { l:'Atreus', r:'Επεξήγηση', to:'στο nomen', g:'ονομ. ενικ., αρσ. — ελκτική έλξη (λαμβάνει ονομαστική)', d:'Atreus, -i (αρσ. β΄) — ο Ατρέας (τίτλος τραγωδίας)' },
          { l:'nomen', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ., ουδ.', d:'nomen, nominis (ουδ. γ΄) — το όνομα' },
          { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, esse — είμαι· υπάρχω', a:',' }
        ]},
        { l:'ei', r:'Έμμεσο αντικείμενο', to:'στο legit', g:'δοτ. ενικ., αρσ. — δεικτ. αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'desideranti', r:'Επιρρ. αιτιολογική μετοχή', to:'συνημμένη στο ei', g:'μετοχή ενεστ. ενεργ., δοτ. ενικ., αρσ.', d:'desidero, desideravi, desideratum, desiderare (1) — επιθυμώ, ποθώ', note:'«ei desideranti» = σε αυτόν, επειδή το επιθυμούσε.' },
        { l:'legit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'lego, legi, lectum, legere (3) — διαβάζω (μεγαλόφωνα)', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Ρήμα εξάρτησης dixit· ακολουθεί πλάγιος λόγος με δύο ειδικά απαρέμφατα (esse, videri) ως αντικείμενα.', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο dixit', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'Pacuvius', r:'Υποκείμενο', to:'στο dixit', g:'ονομ. ενικ., αρσ.', d:'Pacuvius, -ii/-i (αρσ. β΄) — ο Πακούβιος' },
        { l:'dixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέω' },
        { l:'sonora', r:'Κατηγορούμενο', to:'στο υποκ. του esse («quae scripsisset»)', g:'αιτ. πληθ., ουδ. — επίθ. β΄ κλ.', d:'sonorus, -a, -um — ηχηρός' },
        { l:'quidem', r:'Βεβαιωτικό μόριο', g:'άκλιτο βεβαιωτικό μόριο', d:'quidem — βέβαια, βεβαίως', plain:true },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο dixit', g:'απαρέμφατο ενεστ.', d:'sum, fui, esse — είμαι' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος (sonora–grandia)', d:'et — και' },
        { l:'grandia', r:'Κατηγορούμενο', to:'στο υποκ. του esse', g:'αιτ. πληθ., ουδ. — επίθ. γ΄ κλ.', d:'grandis, -is, -e — μεγαλόπρεπος, υψηλός' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική· λειτουργεί ως υποκείμενο των απαρεμφάτων (esse/videri). Εκφέρεται με υποτακτική (scripsisset) λόγω πλαγίου λόγου (έλξη).', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο scripsisset (και υποκ. των esse/videri)', g:'ονομ. πληθ., ουδ. — αναφορ. αντων.', d:'qui, quae, quod — αυτά που, όσα' },
          { l:'scripsisset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. υπερσ. ενεργ.', d:'scribo, scripsi, scriptum, scribere (3) — γράφω', a:',' }
        ]},
        { l:'sed', r:'Σύνδεσμος', g:'αντιθετικός σύνδεσμος (esse–videri)', d:'sed — αλλά', conn:true },
        { l:'videri', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο dixit', g:'απαρέμφατο ενεστ. παθ.', d:'video, vidi, visum, videre (2) — βλέπω· παθ. videor — φαίνομαι' },
        { l:'tamen', r:'Αντιθετικό επίρρημα', g:'άκλιτο αντιθετικό επίρρημα', d:'tamen — όμως', plain:true },
        { l:'ea', r:'Υποκείμενο απαρεμφάτου', to:'στο videri', g:'αιτ. πληθ., ουδ. — δεικτ. αντων.', d:'is, ea, id — αυτά' },
        { l:'sibi', r:'Δοτ. προσωπική (του κρίνοντος)', to:'στο videri', g:'δοτ. ενικ. — προσωπ. αντων. γ΄ προσ.', d:'se (sui, sibi, se) — εαυτού· εδώ αναφέρεται στον Pacuvius' },
        { l:'duriora', r:'Κατηγορούμενο', to:'στο ea (μέσω videri)', g:'αιτ. πληθ., ουδ. — συγκριτικός βαθμός', d:'durus, -a, -um (συγκρ. durior) — σκληρός, τραχύς', note:'Συγκριτικός απόλυτης σύγκρισης: «κάπως τραχιά».' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
        { l:'acerbiora', r:'Κατηγορούμενο', to:'στο ea (μέσω videri)', g:'αιτ. πληθ., ουδ. — συγκριτικός βαθμός', d:'acerbus, -a, -um (συγκρ. acerbior) — πικρός, στυφός', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Ita', r:'Επιρρ. προσδ. του τρόπου', to:'στο est', g:'δεικτικό τροπικό επίρρημα', d:'ita — έτσι' },
        { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, esse — είμαι· εδώ: έτσι έχει το πράγμα', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (παρενθετική)', note:'Παρενθετική κύρια πρόταση που διακόπτει τον ευθύ λόγο.', kids:[
        { l:'inquit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. — ελλειπτικό', d:'inquam (ελλειπτικό) — λέω' },
        { l:'Accius', r:'Υποκείμενο', to:'στο inquit', g:'ονομ. ενικ., αρσ.', d:'Accius, -ii/-i (αρσ. β΄) — ο Άκκιος', a:',' }
      ]},
      { type:'sub', key:'paravoliki', label:'Παραβολική (του τρόπου)', note:'Δευτ. αναφορική παραβολική του τρόπου· προσδιορίζει το «Ita est». Εισάγεται με τον παραβολικό σύνδεσμο ut και εκφέρεται με οριστική.', kids:[
        { l:'ut', r:'Παραβολικός σύνδεσμος', g:'παραβολικός σύνδεσμος (+ οριστική)', d:'ut — όπως' },
        { l:'dicis', r:'Ρήμα', g:'β΄ ενικ. οριστ. ενεστ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέω', note:'Εννοούμενο υποκείμενο: tu (ο Πακούβιος).', a:';' }
      ]}
    ]},

    { n: 5, kids: [
      { l:'neque', r:'Σύνδεσμος', g:'αντιθετικός/συμπλεκτικός σύνδεσμος (= et non)', d:'neque — και δεν', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'id', r:'Υποκείμενο', to:'στο paenitet', g:'ονομ.(ουδ.) ενικ. — δεικτ. αντων.', d:'is, ea, id — αυτό', note:'Υποκείμενο του απρόσωπου paenitet.' },
        { l:'me', r:'Αντικείμενο (αιτ. προσώπου)', to:'στο paenitet', g:'αιτ. ενικ. — προσωπ. αντων. α΄ προσ.', d:'ego — εγώ' },
        { l:'sane', r:'Επιρρ. προσδ.', to:'στο paenitet', g:'βεβαιωτικό επίρρημα', d:'sane — βέβαια, ασφαλώς' },
        { l:'paenitet', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. — απρόσωπο', d:'paenitet, paenituit, paenitere (2, απρόσ.) — μεταμελούμαι, μετανιώνω', a:';' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Ρήμα εξάρτησης spero· ακολουθεί ειδικό απαρέμφατο μέλλοντα (fore).', kids:[
        { l:'meliora', r:'Κατηγορούμενο', to:'στο υποκ. του fore («quae scribam»)', g:'αιτ. πληθ., ουδ. — συγκριτικός βαθμός', d:'bonus, -a, -um (συγκρ. melior) — καλός' },
        { l:'enim', r:'Σύνδεσμος', g:'αιτιολογικός (παρατακτικός) σύνδεσμος', d:'enim — γιατί, δηλαδή', conn:true },
        { l:'fore', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο spero', g:'απαρέμφατο μέλλ. (= futurum esse)', d:'sum, fui, esse — είμαι· fore = θα είμαι/υπάρξω' },
        { l:'spero', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ.', d:'spero, speravi, speratum, sperare (1) — ελπίζω', note:'Εννοούμενο υποκείμενο: ego.' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική· ο όρος αναφοράς (εννοούμενο «ea») είναι υποκείμενο του fore.', kids:[
          { l:'quae', r:'Αντικείμενο', to:'στο scribam (και υποκ. του fore)', g:'αιτ. πληθ., ουδ. — αναφορ. αντων.', d:'qui, quae, quod — αυτά που, όσα' },
          { l:'deinceps', r:'Επιρρ. προσδ. του χρόνου', to:'στο scribam', g:'χρονικό επίρρημα', d:'deinceps — στη συνέχεια, διαδοχικά' },
          { l:'scribam', r:'Ρήμα', g:'α΄ ενικ. οριστ. μέλλ. ενεργ.', d:'scribo, scripsi, scriptum, scribere (3) — γράφω', a:'.' }
        ]}
      ]}
    ]},

    { n: 7, kids: [
      { l:'Nam', r:'Σύνδεσμος', g:'αιτιολογικός (παρατακτικός) σύνδεσμος', d:'nam — γιατί, πράγματι', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Ρήμα εξάρτησης aiunt· ακολουθεί ειδικό απαρέμφατο (esse) με υποκείμενο idem.', kids:[
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική· συσχετίζεται με το idem (idem … quod). Εκφέρεται με οριστική (πραγματικό).', kids:[
          { l:'quod', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ., ουδ. — αναφορ. αντων.', d:'qui, quae, quod — αυτό που' },
          { l:'in pomis', k:'pomum', r:'Εμπρόθετος επιρρ. προσδ. (κατάσταση)', to:'στο est', g:'in (πρόθ. + αφαιρ.) + pomis (αφαιρ. πληθ., ουδ.)', d:'in — σε· pomum, -i (ουδ. β΄) — ο καρπός, το φρούτο· «στους καρπούς»' },
          { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, esse — είμαι· εδώ: ισχύει, συμβαίνει', a:',' }
        ]},
        { l:'idem', r:'Υποκείμενο απαρεμφάτου', to:'στο esse', g:'αιτ. ενικ., ουδ. — οριστική/δεικτ. αντων.', d:'idem, eadem, idem — ο ίδιος· το ίδιο' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο aiunt', g:'απαρέμφατο ενεστ.', d:'sum, fui, esse — είμαι· εδώ: ισχύει' },
        { l:'aiunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. — ελλειπτικό', d:'aio (ελλειπτικό) — λέω, βεβαιώνω', note:'Εννοούμενο υποκείμενο: (οι άνθρωποι) «λένε».' },
        { l:'in ingeniis', k:'ingenium', r:'Εμπρόθετος επιρρ. προσδ. (κατάσταση)', to:'στο esse', g:'in (πρόθ. + αφαιρ.) + ingeniis (αφαιρ. πληθ., ουδ.)', d:'in — σε· ingenium, -ii/-i (ουδ. β΄) — το πνεύμα, το ταλέντο· «στα πνεύματα»', a:':' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Υποκείμενο του fiunt: η αναφορική «quae … nascuntur» (εννοούμενο «ea»).', kids:[
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική· λειτουργεί ως υποκείμενο της κύριας (fiunt). Με οριστική (πραγματικό).', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο nascuntur (και στο fiunt)', g:'ονομ. πληθ., ουδ. — αναφορ. αντων.', d:'qui, quae, quod — αυτά που, όσα' },
          { l:'dura', r:'Κατηγορούμενο', to:'στο quae (μέσω nascuntur)', g:'ονομ. πληθ., ουδ. — επίθ. β΄ κλ.', d:'durus, -a, -um — σκληρός' },
          { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
          { l:'acerba', r:'Κατηγορούμενο', to:'στο quae (μέσω nascuntur)', g:'ονομ. πληθ., ουδ. — επίθ. β΄ κλ.', d:'acerbus, -a, -um — πικρός, στυφός' },
          { l:'nascuntur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. — αποθετικό', d:'nascor, natus sum, nasci (3, αποθ.) — γεννιέμαι', a:',' }
        ]},
        { l:'post', r:'Επιρρ. προσδ. του χρόνου', to:'στο fiunt', g:'χρονικό επίρρημα', d:'post — ύστερα, έπειτα' },
        { l:'fiunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. — ανώμαλο', d:'fio, factus sum, fieri — γίνομαι' },
        { l:'mitia', r:'Κατηγορούμενο', to:'στο quae (μέσω fiunt)', g:'ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.', d:'mitis, -is, -e — ήπιος, γλυκός, ώριμος' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
        { l:'iucunda', r:'Κατηγορούμενο', to:'στο quae (μέσω fiunt)', g:'ονομ. πληθ., ουδ. — επίθ. β΄ κλ.', d:'iucundus, -a, -um — ευχάριστος', a:';' }
      ]}
    ]},

    { n: 9, kids: [
      { l:'sed', r:'Σύνδεσμος', g:'αντιθετικός σύνδεσμος', d:'sed — αλλά', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Υποκείμενο του fiunt: η αναφορική «quae … gignuntur» (εννοούμενο «ea»).', kids:[
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική· λειτουργεί ως υποκείμενο της κύριας (fiunt). Με οριστική (πραγματικό).', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο gignuntur (και στο fiunt)', g:'ονομ. πληθ., ουδ. — αναφορ. αντων.', d:'qui, quae, quod — αυτά που, όσα' },
          { l:'gignuntur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. παθ.', d:'gigno, genui, genitum, gignere (3) — γεννώ· παθ.: γεννιέμαι' },
          { l:'statim', r:'Επιρρ. προσδ. του χρόνου', to:'στο gignuntur', g:'χρονικό επίρρημα', d:'statim — αμέσως, από την αρχή' },
          { l:'vieta', r:'Κατηγορούμενο', to:'στο quae (μέσω gignuntur)', g:'ονομ. πληθ., ουδ. — επίθ. β΄ κλ.', d:'vietus, -a, -um — μαραμένος, ζαρωμένος', note:'Δεν περιλαμβάνεται στους πίνακες παραθετικών.' },
          { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
          { l:'mollia', r:'Κατηγορούμενο', to:'στο quae (μέσω gignuntur)', g:'ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.', d:'mollis, -is, -e — μαλακός', a:',' }
        ]},
        { l:'non', r:'Αρνητικό μόριο', to:'στο (matura) fiunt', g:'αρνητικό μόριο', d:'non — δεν', plain:true },
        { l:'matura', r:'Κατηγορούμενο', to:'στο quae (μέσω fiunt)', g:'ονομ. πληθ., ουδ. — επίθ. β΄ κλ.', d:'maturus, -a, -um — ώριμος' },
        { l:'mox', r:'Επιρρ. προσδ. του χρόνου', to:'στο fiunt', g:'χρονικό επίρρημα', d:'mox — έπειτα, αργότερα' },
        { l:'fiunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. — ανώμαλο', d:'fio, factus sum, fieri — γίνομαι' },
        { l:'sed', r:'Σύνδεσμος', g:'αντιθετικός σύνδεσμος (matura–putria)', d:'sed — αλλά' },
        { l:'putria', r:'Κατηγορούμενο', to:'στο quae (μέσω fiunt)', g:'ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.', d:'puter (putris), -is, -e — σάπιος', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Cum Accius ex urbe Roma Tarentum venisset,", el:"Όταν ο Άκκιος είχε έρθει από την πόλη Ρώμη στον Τάραντα," },
    { la:"ubi Pacuvius grandi iam aetate recesserat,", el:"όπου ο Πακούβιος είχε αποσυρθεί σε προχωρημένη πια ηλικία," },
    { la:"devertit ad eum.", el:"κατέλυσε σε αυτόν (τον επισκέφθηκε)." },
    { la:"Accius, qui multo minor natu erat,", el:"Ο Άκκιος, ο οποίος ήταν πολύ μικρότερος στην ηλικία," },
    { la:"tragoediam suam, cui «Atreus» nomen est,", el:"την τραγωδία του, της οποίας το όνομα είναι «Ατρέας»," },
    { la:"ei desideranti legit.", el:"του τη διάβασε, επειδή το επιθυμούσε." },
    { la:"Tum Pacuvius dixit", el:"Τότε ο Πακούβιος είπε" },
    { la:"sonora quidem esse et grandia quae scripsisset,", el:"ότι όσα είχε γράψει ήταν βέβαια ηχηρά και μεγαλόπρεπα," },
    { la:"sed videri tamen ea sibi duriora et acerbiora.", el:"αλλά ότι όμως αυτά του φαίνονταν κάπως τραχιά και πικρά." },
    { la:"«Ita est,» inquit Accius, «ut dicis;", el:"«Έτσι είναι,» είπε ο Άκκιος, «όπως λες·" },
    { la:"neque id me sane paenitet;", el:"και δεν μετανιώνω βέβαια γι' αυτό·" },
    { la:"meliora enim fore spero, quae deinceps scribam.", el:"γιατί ελπίζω ότι θα είναι καλύτερα αυτά που θα γράψω στη συνέχεια." },
    { la:"Nam quod in pomis est, idem esse aiunt in ingeniis:", el:"Γιατί αυτό που ισχύει για τους καρπούς, το ίδιο λένε ότι ισχύει για τα πνεύματα (τα ταλέντα):" },
    { la:"quae dura et acerba nascuntur, post fiunt mitia et iucunda;", el:"αυτά που γεννιούνται σκληρά και στυφά, ύστερα γίνονται μαλακά (ώριμα) και ευχάριστα (γλυκά)·" },
    { la:"sed quae gignuntur statim vieta et mollia,", el:"αλλά αυτά που γεννιούνται από την αρχή μαραμένα και μαλακά," },
    { la:"non matura mox fiunt sed putria.»", el:"δεν γίνονται αργότερα ώριμα αλλά σάπια.»" }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"Roma, -ae", note:"χωρίς πληθ." },
        { form:"tragoedia, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Accius, -ii / -i" },
        { form:"Atreus, -i" },
        { form:"Pacuvius, -ii / -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"ingenium, -ii / -i" },
        { form:"pomum, -i" },
        { form:"Tarentum, -i", note:"χωρίς πληθ." }
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
      { form:"multi, -ae, -a" },
      { form:"parvus, -a, -um" },
      { form:"sonorus, -a, -um" }
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
      { pos:"puter (putris), -is, -e", comp:"putrior, -ior, -ius", sup:"puterrimus, -a, -um / puterrissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσ." },
    { form:"idem, eadem, idem", kind:"Δεικτική", extra:"(ως οριστική)" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"(ως επαναληπτική)" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"se", kind:"Προσωπική", extra:"γ΄ προσ. (αυτοπαθής)" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ." }
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
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"" },
      { pres:"gigno", perf:"genui", sup:"genitum", inf:"gignere", note:"" },
      { pres:"lego", perf:"legi", sup:"lectum", inf:"legere", note:"" },
      { pres:"recedo", perf:"recessi", sup:"recessum", inf:"recedere", note:"" },
      { pres:"scribo", perf:"scripsi", sup:"scriptum", inf:"scribere", note:"" },
      { pres:"devertor / deverto", perf:"deverti", sup:"deversum", inf:"deverti / devertere", note:"ημιαποθετικό" },
      { pres:"nascor", perf:"natus sum", sup:"—", inf:"nasci", note:"αποθετικό (μτχ. μέλλ. nasciturus)" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"aio", perf:"—", sup:"—", inf:"—", note:"ελλειπτικό" },
      { pres:"inquam", perf:"—", sup:"—", inf:"—", note:"ελλειπτικό" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"ανώμαλο (παθ. του facio)" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"cum ιστορικό/διηγηματικό", body:"Το «Cum … venisset» είναι χρονική με ιστορικό/διηγηματικό cum + υποτακτική υπερσυντελίκου (venisset)· δηλώνει το προτερόχρονο στο παρελθόν και τονίζει τη βαθύτερη σχέση των γεγονότων." },
    { tag:"Ρήμα", title:"devertit: ημιαποθετικό", body:"Το deverto/devertor είναι ημιαποθετικό (deverti, deversum, devertere): σχηματίζει τους παρελθοντικούς χρόνους με μεσοπαθητικούς τύπους. Το «devertit» = κατέλυσε, φιλοξενήθηκε." },
    { tag:"Ρήμα", title:"paenitet: απρόσωπο", body:"Το «neque id me paenitet» έχει το απρόσωπο paenitet με id ως υποκείμενο (ουδ. αντων.) και me ως αιτιατική του προσώπου (αντικείμενο): «δεν μετανιώνω γι' αυτό»." },
    { tag:"Ρήμα", title:"nascor vs gigno", body:"Το nascor (natus sum, nasci) είναι αποθετικό με ενεργητική σημασία «γεννιέμαι» (μτχ. μέλλ. nasciturus)· το gignuntur είναι κανονικός παθητικός τύπος του gigno. Πρόσεξε τη διάκριση nascuntur / gignuntur." },
    { tag:"Παραθετικά", title:"απόλυτη σύγκριση", body:"Τα duriora, acerbiora (και meliora) είναι συγκριτικοί απόλυτης σύγκρισης: «κάπως/μάλλον τραχιά, πικρά», χωρίς β΄ όρο σύγκρισης." },
    { tag:"Πτώση", title:"minor natu / grandi aetate", body:"Το «minor natu» έχει αφαιρετική της αναφοράς (natu)· το «grandi aetate» είναι αφαιρετική της ιδιότητας. Το «cui Atreus nomen est» έχει δοτική κτητική (cui) και το Atreus σε ονομαστική κατ' ελκτική έλξη." }
  ]
};

export default UNIT;
