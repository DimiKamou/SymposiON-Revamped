export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 24,
  title: "Το πάθημα ενός ψεύτη",
  latinTitle: "Lectio XXIV",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο sensit. Εισάγεται με τον ιστορικό-διηγηματικό σύνδεσμο cum και εκφέρεται με υποτακτική υπερσυντελίκου (venisset), γιατί εξαρτάται από ιστορικό χρόνο (sensit) και κατά την ακολουθία των χρόνων δηλώνει το προτερόχρονο στο παρελθόν.', kids:[
        { l:'Cum', r:'Σύνδεσμος', g:'υποτακτικός χρονικός ιστορικός-διηγηματικός σύνδεσμος', d:'cum — όταν' },
        { l:'P. Cornelius', r:'Υποκείμενο', to:'στο venisset', g:'ονομ. ενικ., αρσ. — β΄ κλ. (γεν. -ii/-i)', d:'Publius Cornelius — ο Πόπλιος Κορνήλιος' },
        { l:'Nasica', r:'Παράθεση/επεξήγηση', to:'στο P. Cornelius', g:'ονομ. ενικ., αρσ. — α΄ κλ.', d:'Nasica, -ae (αρσ. α΄) — ο Νασικάς' },
        { l:'ad Ennium', k:'Ennius', r:'Εμπρόθετος επιρρ. προσδ. κατεύθυνσης (προς πρόσωπο)', to:'στο venisset', g:'ad (πρόθ. + αιτ.) + Ennium (αιτ. ενικ.)', d:'ad — προς, σε· Ennius, -ii/-i (αρσ. β΄) — ο Έννιος' },
        { l:'poetam', r:'Παράθεση/επεξήγηση', to:'στο Ennium', g:'αιτ. ενικ., αρσ. — α΄ κλ.', d:'poeta, -ae (αρσ. α΄) — ο ποιητής' },
        { l:'venisset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. υπερσυντελίκου ενεργ. φωνής', d:'venio, veni, ventum, venire (4) — έρχομαι' }
      ]},
      { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική πρόταση, συνδεόμενη παρατακτικά (συμπλεκτικά, -que) με την προηγούμενη χρονική. Εισάγεται με το cum και εκφέρεται με υποτακτική υπερσυντελίκου (dixisset)· δηλώνει το προτερόχρονο στο παρελθόν.', kids:[
        { l:'ei', r:'Έμμεσο αντικείμενο', to:'στο dixisset (και υποκ. της μτχ. quaerenti)', g:'δοτ. ενικ., αρσ. — δεικτική (επαναληπτική) αντων.', d:'is, ea, id — αυτός, -ή, -ό (ei = P. Cornelio Nasicae)' },
        { l:'que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) εγκλιτικός σύνδεσμος', d:'-que — και', conn:true },
        { l:'ab ostio', k:'ostium', r:'Εμπρόθετος επιρρ. προσδ. τόπου (αφετηρία)', to:'στη μετοχή quaerenti', g:'ab (πρόθ. + αφαιρ.) + ostio (αφαιρ. ενικ., ουδ.)', d:'ab — από· ostium, -ii/-i (ουδ. β΄) — η πόρτα· ab ostio = από την πόρτα' },
        { l:'quaerenti', r:'Επιθετική μετοχή', to:'στο ei (σύγχρονο)', g:'δοτ. ενικ., αρσ. — μτχ. ενεστ. ενεργ. φωνής', d:'quaero, quaesivi, quaesitum, quaerere (3) — ζητώ' },
        { l:'Ennium', r:'Αντικείμενο', to:'στη μετοχή quaerenti', g:'αιτ. ενικ., αρσ. — β΄ κλ.', d:'Ennius, -ii/-i (αρσ. β΄) — ο Έννιος' },
        { l:'ancilla', r:'Υποκείμενο', to:'στο dixisset', g:'ονομ. ενικ., θηλ. — α΄ κλ.', d:'ancilla, -ae (θηλ. α΄) — η υπηρέτρια' },
        { l:'dixisset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. υπερσυντελίκου ενεργ. φωνής', d:'dico, dixi, dictum, dicere (3) — λέω' },
        { l:'eum', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. ενικ., αρσ. — δεικτική (επαναληπτική) αντων.', d:'is, ea, id — αυτός, -ή, -ό (eum = Ennium)' },
        { l:'domi', r:'Επιρρ. προσδ. στάσης σε τόπο', to:'στο esse', g:'γεν. ενικ. με επιρρ. σημασία (τοπικό)', d:'domus, -us (θηλ. δ΄) — το σπίτι· domi = στο σπίτι' },
        { l:'non', r:'Άρνηση', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο dixisset', g:'απαρέμφατο ενεστ.', d:'sum, fui, —, esse — είμαι, υπάρχω', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Nasica', r:'Υποκείμενο', to:'στο sensit', g:'ονομ. ενικ., αρσ. — α΄ κλ.', d:'Nasica, -ae (αρσ. α΄) — ο Νασικάς' },
        { l:'sensit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'sentio, sensi, sensum, sentire (4) — καταλαβαίνω, αισθάνομαι' },
        { l:'illam', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο dixisse (ετεροπροσωπία)', g:'αιτ. ενικ., θηλ. — δεικτική αντων.', d:'ille, illa, illud — εκείνος, -η, -ο (illam = ancillam)' },
        { l:'domini', r:'Γενική υποκειμενική', to:'στο iussu (= dominus iussit)', g:'γεν. ενικ., αρσ. — β΄ κλ.', d:'dominus, -i (αρσ. β΄) — το αφεντικό, ο κύριος' },
        { l:'iussu', r:'Αφαιρετική της αιτίας (εσωτερικού αναγκαστικού αιτίου)', to:'στο dixisse', g:'αφαιρ. ενικ., αρσ. — δ΄ κλ. (εύχρηστο μόνο στην αφαιρ. ενικ.)', d:'iussus, -us (αρσ. δ΄) — η διαταγή· domini iussu = με διαταγή του αφεντικού', note:'Στις στερεότυπες φράσεις iussu, iniussu, rogatu + γενική.' },
        { l:'id', r:'Αντικείμενο', to:'στο dixisse', g:'αιτ. ενικ., ουδ. — δεικτική (επαναληπτική) αντων.', d:'is, ea, id — αυτός, -ή, -ό' },
        { l:'dixisse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο sensit', g:'απαρέμφατο παρακειμένου ενεργ. φωνής', d:'dico, dixi, dictum, dicere (3) — λέω' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'illum', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. ενικ., αρσ. — δεικτική αντων.', d:'ille, illa, illud — εκείνος, -η, -ο (illum = Ennium)' },
        { l:'intus', r:'Επιρρ. προσδ. τόπου', to:'στο esse', g:'τοπικό επίρρημα', d:'intus — μέσα' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο sensit', g:'απαρέμφατο ενεστ.', d:'sum, fui, —, esse — είμαι, υπάρχω', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας, εκφερόμενη με προστακτική (accipe).', kids:[
        { l:'Accipe', r:'Ρήμα', g:'β΄ ενικ. προστακτ. ενεστ. ενεργ. φωνής', d:'accipio, accepi, acceptum, accipere (3, 15 σε -io, < ad+capio) — μαθαίνω, δέχομαι' },
        { l:'(tu)', r:'Υποκείμενο (εννοούμενο)', to:'στο accipe', g:'—', d:'tu — εσύ' },
        { l:'nunc', r:'Επιρρ. προσδ. χρόνου', to:'στο accipe', g:'χρονικό επίρρημα', d:'nunc — τώρα' },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρόταση μερικής άγνοιας, ως αντικείμενο στο accipe. Εισάγεται με την ερωτηματική αντων. quid και εκφέρεται με υποτακτική (fecerit)· εξάρτηση από αρκτικό χρόνο (accipe: προστακτική ενεστώτα) και δηλώνει το προτερόχρονο.', kids:[
          { l:'quid', r:'Αντικείμενο', to:'στο fecerit', g:'αιτ. ενικ., ουδ. — ερωτηματική (ουσιαστική) αντων.', d:'quis, quid — ποιος, -α, -ο / τι;' },
          { l:'postea', r:'Επιρρ. προσδ. χρόνου', to:'στο fecerit', g:'χρονικό επίρρημα', d:'postea — αργότερα, μετά' },
          { l:'Nasica', r:'Υποκείμενο', to:'στο fecerit', g:'ονομ. ενικ., αρσ. — α΄ κλ.', d:'Nasica, -ae (αρσ. α΄) — ο Νασικάς' },
          { l:'fecerit', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρακειμένου ενεργ. φωνής', d:'facio, feci, factum, facere (3, 15 σε -io) — κάνω', a:'.' }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο exclamavit. Εισάγεται με τον ιστορικό-διηγηματικό cum και εκφέρεται με υποτακτική υπερσυντελίκου (venisset)· δηλώνει το προτερόχρονο στο παρελθόν.', kids:[
        { l:'Paucis', r:'Επιθετικός προσδ.', to:'στο diebus', g:'αφαιρ. πληθ., αρσ. — επίθ. β΄ κλ.', d:'paucus, -a, -um — λίγος' },
        { l:'post', r:'Επίρρημα', to:'(post diebus = αργότερα)', g:'χρονικό επίρρημα', d:'post — αργότερα, μετά', note:'Ισοδύναμος τρόπος: post paucos dies (post = πρόθεση + αιτ.).' },
        { l:'diebus', r:'Αφαιρετική του μέτρου / της διαφοράς', to:'στο post', g:'αφαιρ. πληθ., αρσ. — ε΄ κλ.', d:'dies, diei (αρσ. ε΄) — η ημέρα' },
        { l:'cum', r:'Σύνδεσμος', g:'υποτακτικός χρονικός ιστορικός-διηγηματικός σύνδεσμος', d:'cum — όταν' },
        { l:'Ennius', r:'Υποκείμενο', to:'στο venisset', g:'ονομ. ενικ., αρσ. — β΄ κλ.', d:'Ennius, -ii/-i (αρσ. β΄) — ο Έννιος' },
        { l:'ad Nasicam', k:'Nasica', r:'Εμπρόθετος επιρρ. προσδ. κατεύθυνσης (προς πρόσωπο)', to:'στο venisset', g:'ad (πρόθ. + αιτ.) + Nasicam (αιτ. ενικ.)', d:'ad — προς, σε· Nasica, -ae (αρσ. α΄) — ο Νασικάς' },
        { l:'venisset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. υπερσυντελίκου ενεργ. φωνής', d:'venio, veni, ventum, venire (4) — έρχομαι' }
      ]},
      { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική πρόταση, συνδεόμενη παρατακτικά (συμπλεκτικά, et) με την προηγούμενη χρονική. Εκφέρεται με υποτακτική παρατατικού (quaereret)· δηλώνει το σύγχρονο στο παρελθόν.', kids:[
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και', conn:true },
        { l:'(Ennius)', r:'Υποκείμενο (εννοούμενο)', to:'στο quaereret', g:'—', d:'Ennius, -ii/-i — ο Έννιος' },
        { l:'eum', r:'Αντικείμενο', to:'στο quaereret', g:'αιτ. ενικ., αρσ. — δεικτική (επαναληπτική) αντων.', d:'is, ea, id — αυτός, -ή, -ό (eum = Nasicam)' },
        { l:'a ianua', k:'ianua', r:'Εμπρόθετος επιρρ. προσδ. τόπου (αφετηρία)', to:'στο quaereret', g:'a (πρόθ. + αφαιρ.) + ianua (αφαιρ. ενικ., θηλ.)', d:'a — από· ianua, -ae (θηλ. α΄) — η πόρτα' },
        { l:'quaereret', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατατικού ενεργ. φωνής', d:'quaero, quaesivi, quaesitum, quaerere (3) — ζητώ', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'exclamavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'exclamo, exclamavi, exclamatum, exclamare (1, < ex+clamo) — φωνάζω, αναφωνώ' },
        { l:'Nasica', r:'Υποκείμενο', to:'στο exclamavit', g:'ονομ. ενικ., αρσ. — α΄ κλ.', d:'Nasica, -ae (αρσ. α΄) — ο Νασικάς' },
        { l:'se', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο esse (ταυτοπροσωπία — Λατινισμός)', g:'αιτ. ενικ., αρσ. — προσωπική αντων. γ΄ προσ. (αυτοπαθής)', d:'se — τον εαυτό του' },
        { l:'domi', r:'Επιρρ. προσδ. στάσης σε τόπο', to:'στο esse', g:'γεν. ενικ. με επιρρ. σημασία (τοπικό)', d:'domus, -us (θηλ. δ΄) — το σπίτι· domi = στο σπίτι' },
        { l:'non', r:'Άρνηση', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο exclamavit', g:'απαρέμφατο ενεστ.', d:'sum, fui, —, esse — είμαι, υπάρχω', a:',' }
      ]},
      { type:'sub', key:'enantiomatiki', label:'Εναντιωματική', note:'Δευτ. επιρρ. εναντιωματική πρόταση, ως επιρρ. προσδ. της εναντίωσης στο exclamavit. Εισάγεται με τον εναντιωματικό σύνδεσμο etsi και εκφέρεται με οριστική (erat), γιατί εκφράζει μια πραγματική κατάσταση παρά την οποία ισχύει το περιεχόμενο της κύριας.', kids:[
        { l:'etsi', r:'Σύνδεσμος', g:'εναντιωματικός σύνδεσμος', d:'etsi — αν και' },
        { l:'(Nasica)', r:'Υποκείμενο (εννοούμενο)', to:'στο erat', g:'—', d:'Nasica, -ae — ο Νασικάς' },
        { l:'domi', r:'Επιρρ. προσδ. στάσης σε τόπο', to:'στο erat', g:'γεν. ενικ. με επιρρ. σημασία (τοπικό)', d:'domus, -us (θηλ. δ΄) — το σπίτι· domi = στο σπίτι' },
        { l:'erat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού', d:'sum, fui, —, esse — είμαι, υπάρχω', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης, με ρήμα το inquit.', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. χρόνου', to:'στο inquit', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'Ennius', r:'Υποκείμενο', to:'στο inquit', g:'ονομ. ενικ., αρσ. — β΄ κλ.', d:'Ennius, -ii/-i (αρσ. β΄) — ο Έννιος' },
        { l:'indignatus', r:'Επιρρ. αιτιολογική μετοχή (συνημμένη στο Ennius)', to:'στο inquit (προτερόχρονο)', g:'ονομ. ενικ., αρσ. — μτχ. παρακειμένου αποθετικού ρήματος', d:'indignor, indignatus sum, indignari (1, αποθετικό) — αγανακτώ' },
        { type:'sub', key:'aitiologiki', label:'Αιτιολογική', note:'Δευτ. ουσιαστική αιτιολογική πρόταση, ως αντικείμενο στη μετοχή indignatus (ρήμα ψυχικού πάθους). Εισάγεται με τον αιτιολογικό σύνδεσμο quod και εκφέρεται με οριστική (αντικειμενικά αποδεκτή αιτιολογία), χρόνου παρατατικού (mentiebatur).', kids:[
          { l:'quod', r:'Σύνδεσμος', g:'αιτιολογικός σύνδεσμος', d:'quod — που, γιατί' },
          { l:'Nasica', r:'Υποκείμενο', to:'στο mentiebatur', g:'ονομ. ενικ., αρσ. — α΄ κλ.', d:'Nasica, -ae (αρσ. α΄) — ο Νασικάς' },
          { l:'tam', r:'Επιρρ. προσδ. ποσού', to:'στο aperte', g:'ποσοτικό επίρρημα', d:'tam — τόσο' },
          { l:'aperte', r:'Επιρρ. προσδ. τρόπου', to:'στο mentiebatur', g:'τροπικό επίρρημα (θετ. βαθμός)', d:'aperte — φανερά, ανοιχτά' },
          { l:'mentiebatur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού αποθετικού ρήματος', d:'mentior, mentitus sum, mentiri (4, αποθετικό) — λέω ψέματα' }
        ]},
        { l:'inquit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου (ελλειπτικό ρήμα)', d:'inquam (ελλειπτικό) — λέω' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (ευθεία ερώτηση)', note:'Κύρια πρόταση, ευθεία ερώτηση μερικής άγνοιας· εκφέρεται με οριστική (πραγματικό), με εννοούμενο ρήμα το dicis.', kids:[
        { l:'Quid', r:'Σύστοιχο αντικείμενο', to:'στο εννοούμενο dicis', g:'αιτ. ενικ., ουδ. — ερωτηματική (ουσιαστική) αντων.', d:'quis, quid — ποιος, -α, -ο / τι;' },
        { l:'(dicis)', r:'Ρήμα (εννοούμενο)', g:'—', d:'dico, dixi, dictum, dicere (3) — λέω' },
        { l:'(tu)', r:'Υποκείμενο (εννοούμενο)', to:'στο dicis', g:'—', d:'tu — εσύ', a:';' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (ευθεία ερώτηση)', note:'Κύρια πρόταση, ευθεία ερώτηση ολικής άγνοιας, απλή· δεν εισάγεται με μόριο (για έμφαση) και εκφέρεται με οριστική (πραγματικό).', kids:[
        { l:'Ego', r:'Υποκείμενο', to:'στο non cognosco', g:'ονομ. ενικ. — προσωπική αντων. α΄ προσ.', d:'ego — εγώ' },
        { l:'non', r:'Άρνηση', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
        { l:'cognosco', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'cognosco, cognovi, cognitum, cognoscere (3) — γνωρίζω' },
        { l:'vocem', r:'Αντικείμενο', to:'στο non cognosco', g:'αιτ. ενικ., θηλ. — γ΄ κλ.', d:'vox, vocis (θηλ. γ΄) — η φωνή' },
        { l:'tuam', r:'Επιθετικός προσδ.', to:'στο vocem', g:'αιτ. ενικ., θηλ. — κτητική αντων. β΄ προσ. (ένας κτήτορας)', d:'tuus, tua, tuum — δικός, -ή, -ό σου', a:';' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια (ευθεία ερώτηση)', note:'Κύρια πρόταση, ευθεία ερώτηση ολικής άγνοιας, απλή. Εισάγεται με το εγκλιτικό ερωτηματικό μόριο -ne και εκφέρεται με οριστική (πραγματικό), χρόνου ενεστώτα (vis).', kids:[
        { l:'Vis', r:'Ρήμα', g:'β΄ ενικ. οριστ. ενεστ. του ανώμαλου volo', d:'volo, volui, —, velle — θέλω' },
        { l:'ne', r:'Ερωτηματικό μόριο', g:'εγκλιτικό ερωτηματικό μόριο', d:'-ne — μήπως', conn:true },
        { l:'(tu)', r:'Υποκείμενο (εννοούμενο)', to:'στο vis', g:'—', d:'tu — εσύ' },
        { l:'scire', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο vis (ταυτοπροσωπία)', g:'απαρέμφατο ενεστ. ενεργ. φωνής', d:'scio, scivi (scii), scitum, scire (4) — γνωρίζω, μαθαίνω' },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρόταση μερικής άγνοιας, ως αντικείμενο στο απαρέμφατο scire. Εισάγεται με την ερωτηματική αντων. quid και εκφέρεται με υποτακτική (responderit)· εξάρτηση από αρκτικό χρόνο (scire / vis) και δηλώνει το προτερόχρονο.', kids:[
          { l:'quid', r:'Αντικείμενο', to:'στο responderit', g:'αιτ. ενικ., ουδ. — ερωτηματική (ουσιαστική) αντων.', d:'quis, quid — ποιος, -α, -ο / τι;' },
          { l:'Nasica', r:'Υποκείμενο', to:'στο responderit', g:'ονομ. ενικ., αρσ. — α΄ κλ.', d:'Nasica, -ae (αρσ. α΄) — ο Νασικάς' },
          { l:'responderit', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρακειμένου ενεργ. φωνής', d:'respondeo, respondi, responsum, respondere (2) — απαντώ', a:';' }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης.', kids:[
        { l:'(tu)', r:'Υποκείμενο (εννοούμενο)', to:'στο es', g:'—', d:'tu — εσύ' },
        { l:'Homo', r:'Κατηγορούμενο', to:'στο εννοούμενο υποκ. tu (μέσω του es)', g:'ονομ. ενικ., αρσ. — γ΄ κλ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
        { l:'es', r:'Ρήμα (συνδετικό)', g:'β΄ ενικ. οριστ. ενεστ. του sum', d:'sum, fui, —, esse — είμαι' },
        { l:'impudens', r:'Επιθετικός προσδ.', to:'στο homo', g:'ονομ. ενικ., αρσ. — επίθ. γ΄ κλ. (τριγενές μονοκατάληκτο, γεν. impudentis)', d:'impudens, -ntis — αναιδής', a:'.' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης («σε πίστεψα...»). Περιέχει τη χρονική πρόταση cum te quaererem.', kids:[
        { l:'Ego', r:'Υποκείμενο', to:'στο credidi', g:'ονομ. ενικ. — προσωπική αντων. α΄ προσ.', d:'ego — εγώ' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο credidi. Εισάγεται με τον ιστορικό-διηγηματικό cum και εκφέρεται με υποτακτική παρατατικού (quaererem)· δηλώνει το σύγχρονο στο παρελθόν.', kids:[
          { l:'cum', r:'Σύνδεσμος', g:'υποτακτικός χρονικός ιστορικός-διηγηματικός σύνδεσμος', d:'cum — όταν' },
          { l:'te', r:'Αντικείμενο', to:'στο quaererem', g:'αιτ. ενικ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ (te = εσένα)' },
          { l:'quaererem', r:'Ρήμα', g:'α΄ ενικ. υποτ. παρατατικού ενεργ. φωνής', d:'quaero, quaesivi, quaesitum, quaerere (3) — ζητώ', a:',' }
        ]},
        { l:'ancillae', r:'Έμμεσο αντικείμενο', to:'στο credidi', g:'δοτ. ενικ., θηλ. — α΄ κλ.', d:'ancilla, -ae (θηλ. α΄) — η υπηρέτρια' },
        { l:'tuae', r:'Επιθετικός προσδ.', to:'στο ancillae', g:'δοτ. ενικ., θηλ. — κτητική αντων. β΄ προσ. (ένας κτήτορας)', d:'tuus, tua, tuum — δικός, -ή, -ό σου' },
        { l:'credidi', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'credo, credidi, creditum, credere (3, + δοτ. + απαρέμφατο) — πιστεύω' },
        { l:'te', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. ενικ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ (te = εσένα)' },
        { l:'domi', r:'Επιρρ. προσδ. στάσης σε τόπο', to:'στο esse', g:'γεν. ενικ. με επιρρ. σημασία (τοπικό)', d:'domus, -us (θηλ. δ΄) — το σπίτι· domi = στο σπίτι' },
        { l:'non', r:'Άρνηση', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
        { l:'esse', r:'Άμεσο αντικείμενο (ειδικό απαρέμφατο)', to:'στο credidi', g:'απαρέμφατο ενεστ.', d:'sum, fui, —, esse — είμαι', a:';' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (ευθεία ερώτηση)', note:'Κύρια πρόταση, ευθεία ερώτηση ολικής άγνοιας, απλή· δεν εισάγεται με μόριο (για έμφαση) και εκφέρεται με οριστική (πραγματικό), χρόνου ενεστώτα (credis).', kids:[
        { l:'tu', r:'Υποκείμενο', to:'στο non credis', g:'ονομ. ενικ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ' },
        { l:'mihi', r:'Αντικείμενο', to:'στο non credis (credo + δοτ.)', g:'δοτ. ενικ. — προσωπική αντων. α΄ προσ.', d:'ego — εγώ (mihi = σε μένα)' },
        { l:'ipsi', r:'Κατηγορηματικός προσδ.', to:'στο mihi', g:'δοτ. ενικ., αρσ. — δεικτική/οριστική αντων.', d:'ipse, ipsa, ipsum — ο ίδιος, η ίδια, το ίδιο' },
        { l:'non', r:'Άρνηση', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
        { l:'credis', r:'Ρήμα', g:'β΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'credo, credidi, creditum, credere (3) — πιστεύω', a:';' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Cum P. Cornelius Nasica ad Ennium poetam venisset eique ab ostio quaerenti Ennium ancilla dixisset eum domi non esse, Nasica sensit illam domini iussu id dixisse et illum intus esse.", el:"Όταν ο Πόπλιος Κορνήλιος Νασικάς είχε έρθει στον Έννιο, τον ποιητή, και σε αυτόν που ζητούσε τον Έννιο από την πόρτα η υπηρέτρια είχε πει ότι αυτός δεν ήταν στο σπίτι, ο Νασικάς κατάλαβε ότι εκείνη είχε πει αυτό με διαταγή του αφεντικού της και ότι εκείνος ήταν μέσα." },
    { n:2, la:"Accipe nunc quid postea Nasica fecerit.", el:"Μάθε τώρα τι έκανε αργότερα ο Νασικάς." },
    { n:3, la:"Paucis post diebus cum Ennius ad Nasicam venisset et eum a ianua quaereret, exclamavit Nasica se domi non esse, etsi domi erat.", el:"Λίγες μέρες αργότερα, όταν ο Έννιος είχε πάει στον Νασικά και ζητούσε αυτόν από την πόρτα, ο Νασικάς φώναξε ότι δεν ήταν στο σπίτι, αν και ήταν στο σπίτι." },
    { n:4, la:"Tum Ennius indignatus quod Nasica tam aperte mentiebatur «Quid?» inquit «Ego non cognosco vocem tuam?»", el:"Τότε ο Έννιος αγανακτισμένος γιατί ο Νασικάς έλεγε ψέματα τόσο φανερά, είπε: «Τι (λες); Εγώ δεν γνωρίζω τη φωνή σου;»" },
    { n:5, la:"Visne scire quid Nasica responderit?", el:"Θέλεις μήπως να μάθεις τι απάντησε ο Νασικάς;" },
    { n:6, la:"«Homo es impudens. Ego cum te quaererem, ancillae tuae credidi te domi non esse; tu mihi ipsi non credis?»", el:"«Είσαι άνθρωπος αναιδής. Εγώ, όταν σε ζητούσα, πίστεψα την υπηρέτριά σου ότι εσύ δεν ήσουν στο σπίτι· εσύ δεν πιστεύεις εμένα τον ίδιο;»" }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Nasica, -ae" },
        { form:"poeta, -ae" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"ancilla, -ae" },
        { form:"ianua, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"P(ublius), -ii / -i", note:"κύριο όνομα" },
        { form:"Cornelius, -ii / -i" },
        { form:"Ennius, -ii / -i" },
        { form:"dominus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"ostium, -ii / -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"homo, hominis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"vox, vocis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"iussus, -us", note:"εύχρηστο μόνο στην αφαιρ. ενικ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"domus, -us", note:"σχηματίζει και τύπους κατά τη β΄ κλ." }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"dies, diei" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"paucus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"impudens, -ntis", note:"τριγενές μονοκατάληκτο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ & ΕΠΙΡΡΗΜΑΤΩΝ ───────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"paucus, -a, -um (επίρρ. pauce)", comp:"paucior, -ior, -ius (paucius)", sup:"paucissimus, -a, -um (paucissime)" },
      { pos:"apertus, -a, -um (επίρρ. aperte)", comp:"apertior, -ior, -ius (apertius)", sup:"apertissimus, -a, -um (apertissime)" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"impudens, -ntis (επίρρ. impudenter)", comp:"impudentior, -ior, -ius (impudentius)", sup:"impudentissimus, -a, -um (impudentissime)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική (ei, eum)" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"" },
    { form:"quis, quid", kind:"Ερωτηματική", extra:"ουσιαστική" },
    { form:"se", kind:"Προσωπική", extra:"γ΄ προσώπου (αυτοπαθής)" },
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσώπου" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσώπου" },
    { form:"tuus, tua, tuum", kind:"Κτητική", extra:"β΄ προσ. για έναν κτήτορα" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική", extra:"ως οριστική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"exclamo", perf:"exclamavi", sup:"exclamatum", inf:"exclamare", note:"< ex+clamo" },
      { pres:"indignor", perf:"indignatus sum", sup:"(indignatum)", inf:"indignari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"respondeo", perf:"respondi", sup:"responsum", inf:"respondere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"quaero", perf:"quaesivi", sup:"quaesitum", inf:"quaerere", note:"" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"προστ. dic" },
      { pres:"accipio", perf:"accepi", sup:"acceptum", inf:"accipere", note:"15 σε -io (< ad+capio)" },
      { pres:"facio", perf:"feci", sup:"factum", inf:"facere", note:"15 σε -io· προστ. fac" },
      { pres:"cognosco", perf:"cognovi", sup:"cognitum", inf:"cognoscere", note:"" },
      { pres:"credo", perf:"credidi", sup:"creditum", inf:"credere", note:"+ δοτ. + απαρέμφατο" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venire", note:"" },
      { pres:"sentio", perf:"sensi", sup:"sensum", inf:"sentire", note:"" },
      { pres:"mentior", perf:"mentitus sum", sup:"(mentitum)", inf:"mentiri", note:"αποθετικό" },
      { pres:"scio", perf:"scivi (scii)", sup:"scitum", inf:"scire", note:"προστ. scito" }
    ]},
    { syz:"Ανώμαλα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό — είμαι" },
      { pres:"volo", perf:"volui", sup:"—", inf:"velle", note:"ανώμαλο — θέλω" }
    ]},
    { syz:"Ελλειπτικά", rows:[
      { pres:"inquam", perf:"(inquii)", sup:"—", inf:"—", note:"ελλειπτικό — λέω" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"cum ιστορικός-διηγηματικός + υποτακτική", body:"Ο cum των χρονικών προτάσεων (venisset, dixisset, quaereret, quaererem) είναι ιστορικός-διηγηματικός· υπογραμμίζει τη βαθύτερη σχέση αιτίου-αιτιατού και εκφέρεται με υποτακτική (υπερσυντελίκου για το προτερόχρονο, παρατατικού για το σύγχρονο), κατά την ακολουθία των χρόνων." },
    { tag:"Απαρέμφατο", title:"Λατινισμός: se vs. eum/illum", body:"Στο exclamavit Nasica se domi non esse το υποκείμενο του απαρεμφάτου (se) ταυτίζεται με το υποκείμενο του ρήματος (ταυτοπροσωπία → Λατινισμός, με αυτοπαθή αντωνυμία). Αντίθετα, στα dixisset eum ... esse και sensit illam ... dixisse έχουμε ετεροπροσωπία (αιτιατική διαφορετική)." },
    { tag:"Ουσιαστικό", title:"domi & domus: επιρρηματική χρήση", body:"Το domi είναι γενική ενικού του domus (δ΄ κλ.) με πάγια επιρρηματική σημασία· δηλώνει στάση σε τόπο (= στο σπίτι, οίκοι). Το domus σχηματίζει και τύπους κατά τη β΄ κλίση (domi, domo, domorum, domos)." },
    { tag:"Ρήμα", title:"Αποθετικά: indignor & mentior", body:"Τα indignor (indignatus sum, indignari) και mentior (mentitus sum, mentiri) είναι αποθετικά: κλίνονται μόνο στην παθητική φωνή αλλά έχουν ενεργητική σημασία (η μετοχή indignatus έχει ενεργητική διάθεση)." },
    { tag:"Ρήμα", title:"inquam & iussu: ελλειπτικά", body:"Το inquam είναι ελλειπτικό ρήμα (κυρίως inquit, inquam, inquis)· παρεμβάλλεται στον ευθύ λόγο. Το iussus (δ΄ κλ.) είναι εύχρηστο μόνο στην αφαιρετική ενικού στη στερεότυπη φράση domini iussu (= με διαταγή του αφεντικού)." },
    { tag:"Μόριο", title:"-ne & «Quid?»", body:"Το -ne (Visne) είναι εγκλιτικό ερωτηματικό μόριο ολικής άγνοιας (= μήπως). Στο «Quid?» εννοείται ρήμα dicis, οπότε το quid είναι σύστοιχο αντικείμενο· η ερώτηση «Ego non cognosco vocem tuam?» δεν εισάγεται με μόριο (για έμφαση)." }
  ],

  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"quaerenti (επιθετική μετοχή, χρόνου ενεστώτα — σύγχρονο)", to:"qui quaerebat (qui + οριστική παρατατικού)", note:"Ανάλυση σε αναφορική πρόταση· εξάρτηση από ιστορικό χρόνο (άμεσα από το dixisset, έμμεσα από το sensit)." },
      { from:"indignatus (αιτιολογική μετοχή παρακειμένου — προτερόχρονο)", to:"quod / quia / quoniam indignatus erat (quod + οριστική υπερσυντελίκου)", note:"Αντικειμενική αιτιολογία." },
      { from:"indignatus", to:"quod / quia / quoniam indignatus esset (quod + υποτακτική υπερσυντελίκου)", note:"Υποκειμενική ή υποθετική αιτιολογία." },
      { from:"indignatus", to:"cum indignatus esset (cum + υποτακτική υπερσυντελίκου)", note:"Αιτιολογία ως αποτέλεσμα εσωτερικής, λογικής διεργασίας· εξάρτηση από ιστορικό χρόνο." }
    ]},
    { id:"Β", label:"Μετατροπή δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"... et (cum) (Ennius) eum a ianua quaereret, exclamavit Nasica ...", to:"... et Ennio eum a ianua quaerente exclamavit Nasica ...", note:"Χρονική → χρονική μετοχή, γνήσια αφαιρετική απόλυτη (το εννοούμενο υποκ. Ennius δεν έχει άλλο ρόλο στην κύρια με ρήμα το exclamavit)." },
      { from:"Tum Ennius indignatus quod Nasica tam aperte mentiebatur inquit ...", to:"Tum Ennius indignatus Nasica tam aperte mentiente inquit ...", note:"Αιτιολογική → αιτιολογική μετοχή, γνήσια αφαιρετική απόλυτη (το υποκ. Nasica δεν έχει άλλο ρόλο στην κύρια με ρήμα το inquit)." },
      { from:"Ego cum te quaererem, ancillae tuae credidi te domi non esse; ...", to:"Ego te quaerens ancillae tuae credidi te domi non esse; ...", note:"Χρονική → χρονική μετοχή, συνημμένη στο υποκείμενο Ego του ρήματος credidi." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"... eique ab ostio quaerenti Ennium ancilla dixisset eum domi non esse ...", to:"... eique ab ostio quaerenti Ennium ab ancilla dictum esset (απρόσωπο) eum domi non esse ..." },
      { from:"Nasica sensit illam domini iussu id dixisse ...", to:"Nasica sensit ab illa domini iussu id dictum esse / illa a Nasica sensa est domini iussu id dixisse ..." },
      { from:"... quid postea Nasica fecerit.", to:"... quid postea a Nasica factum sit." },
      { from:"«Ego non cognosco vocem tuam?»", to:"«Vox tua non cognoscitur a me?»" },
      { from:"... quid Nasica responderit?", to:"... quid a Nasica responsum sit?" }
    ]},
    { id:"Δ", label:"Μετατροπή του ευθέος λόγου σε πλάγιο λόγο (εξάρτηση από Scriptor tradit / tradidit κ.λπ.)", items:[
      { from:"Cum P. Cornelius Nasica ... venisset eique ... ancilla dixisset ..., Nasica sensit illam ... et illum intus esse.", to:"Scriptor tradit (αρκτ. χρ.) / tradidit (ιστ. χρ.) cum P. Cornelius Nasica ... venisset eique ... ancilla dixisset ..., Nasicam sensisse illam ... et illum intus esse." },
      { from:"Accipe nunc quid postea Nasica fecerit.", to:"Scriptor admonet / admonuit eum ut accipiat / acciperet (ή accipere) nunc / tunc quid postea Nasica fecerit / fecisset." },
      { from:"Paucis post diebus cum Ennius ... venisset et eum ... quaereret, exclamavit Nasica se domi non esse, etsi domi erat.", to:"Scriptor dicit / dixit paucis post diebus cum Ennius ... venisset et eum ... quaereret, exclamavisse Nasicam se domi non esse, etsi domi esset." },
      { from:"Tum Ennius indignatus quod ... mentiebatur «Quid?» inquit", to:"Tum Ennius indignatus quod ... mentiebatur, interrogat / interrogavit quid (Nasica) dicat / diceret;" },
      { from:"«Ego non cognosco vocem tuam?»", to:"num ipse non cognoscat / non cognosceret vocem illius." },
      { from:"Visne scire quid Nasica responderit?", to:"Scriptor rogat / rogavit eum velitne / velletne scire quid Nasica responderit / respondisset." },
      { from:"«Homo es impudens. Ego cum te quaererem, ancillae tuae credidi te domi non esse;»", to:"Nasica respondet / respondit illum esse hominem impudentem; se (ή ipsum) cum illum quaereret, ancillae illius credidisse illum domi non esse." },
      { from:"«tu mihi ipsi non credis?»", to:"Nasica interrogat / interrogavit num ille sibi ipsi non credat / non crederet." }
    ]},
    { id:"Ε", label:"Μετατροπή του πλάγιου λόγου σε ευθύ λόγο", items:[
      { from:"Nasica sensit illam domini iussu id dixisse et illum intus esse.", to:"Illa domini iussu id dixit et ille intus est." },
      { from:"Accipe nunc quid postea Nasica fecerit.", to:"Quid postea Nasica fecit?" },
      { from:"..., exclamavit Nasica se domi non esse", to:"Ego domi non sum." },
      { from:"Visne scire quid Nasica responderit?", to:"Quid Nasica respondit?" }
    ]}
  ],

  etymology: [
    { la:"Publius Cornelius", el:"Πόπλιος Κορνήλιος." },
    { la:"Nasica, Nasicam", el:"Νασικάς." },
    { la:"Ennium, Ennius", el:"Έννιος." },
    { la:"poetam", el:"ποιέω-ῶ· ποιητής, ποίηση· εκποίηση, προσποίηση // (αγγλ.) poet (= ποιητής), poetry (= ποίηση) // (γαλλ.) poète (= ποιητής) // (ιταλ.) poeta (= ποιητής)." },
    { la:"venisset", el:"βαίνω // (γαλλ.) avenue (= λεωφόρος), venir (= έρχομαι) // (αγγλ.) event (= γεγονός, συμβάν), convention (= συνέδριο, σύμβαση) // (ιταλ.) venire (= έρχομαι)." },
    { la:"ancilla, ancillae", el:"(αγγλ.) ancillary (= επικουρικός) // (ιταλ.) ancella (= υπηρέτρια, δούλη)." },
    { la:"dixisset, dixisse", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση) // (αγγλ.) predict (= προβλέπω), verdict (= ετυμηγορία) // (ιταλ.) dire (= λέω)." },
    { la:"domi, domini", el:"δέμω, δόμος // δώμα, δωμάτιο, νεόδμητος // (γαλλ.) domestique (= εξημερωμένος), dominant (= κυρίαρχος), dominer (= κυριαρχώ) // (αγγλ.) domicile (= κατοικία) // (ιταλ.) duomo (= καθεδρικός ναός) // (ισπαν.) dueño (= ιδιοκτήτης, αφέντης)." },
    { la:"esse, erat, es", el:"εἰμί // (αγγλ.) essence (= ουσία), essential (= ουσιώδης) // (γαλλ.) être (= είμαι) // (ιταλ.) essere (= είμαι)." },
    { la:"sensit", el:"(γαλλ.) sentir (= αισθάνομαι, νιώθω), sensible (= ευαίσθητος) // (αγγλ.) sense (= αίσθηση), sentiment (= συναίσθημα) // (ιταλ.) sentire (= αισθάνομαι)." },
    { la:"intus", el:"ἔνδον, ἐντός // (γαλλ.) interiorité (= εσωτερικότητα), intestin (= έντερο) // (αγγλ.) intestine (= έντερο)." },
    { la:"accipe", el:"(γαλλ.) accepter (= δέχομαι) // (ιταλ.) capire (= καταλαβαίνω) // (αγγλ.) capable (= ικανός), capture (= σύλληψη, αιχμαλωτίζω)." },
    { la:"nunc", el:"νῦν." },
    { la:"fecerit", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο) // (γαλλ.) faire (= κάνω) // (ιταλ.) fare (= κάνω)." },
    { la:"paucis (paulus)", el:"παῦρος (= λίγος) // (αγγλ.) paucity (= σπανιότητα, έλλειψη) // (γαλλ.) peu (= λίγο) // (ιταλ.) poco (= λίγο) // (ισπαν.) poco (= λίγο)." },
    { la:"diebus", el:"(Ζεύς, γενική Διός) Δίας (ως «θεός του φωτός») // (αγγλ.) diary (= ημερολόγιο) // (γαλλ.) jour (= ημέρα) // (ιταλ.) giorno (= ημέρα) // (ισπαν.) día (= ημέρα)." },
    { la:"ianua", el:"Ianus (= Ιανός) > Ιανουάριος // (αγγλ.) janitor (= θυρωρός, επιστάτης)." },
    { la:"exclamavit", el:"ρεκλάμα [< γαλλ. réclame (= διαφήμιση)] // (αγγλ.) exclaim (= αναφωνώ) // (ιταλ.) chiamare (= καλώ) // (ισπαν.) llamar (= καλώ)." },
    { la:"indignatus", el:"(γαλλ.) dignité (= αξιοπρέπεια), αντιθ. indignité // (αγγλ.) indignation (= αγανάκτηση), disdain (= περιφρόνηση) // (ιταλ.) degno (= άξιος)." },
    { la:"aperte", el:"(ιταλ.) aprire (= ανοίγω) // (αγγλ.) aperture (= άνοιγμα, διάφραγμα) // (γαλλ.) ouvrir (= ανοίγω), apéritif (= απεριτίφ, ορεκτικό) // (ισπαν.) abrir (= ανοίγω)." },
    { la:"mentiebatur", el:"μένος, μνήμη // (γαλλ.) mentir (= ψεύδομαι) // (ιταλ.) mentire (= ψεύδομαι)." },
    { la:"ego", el:"ἐγώ // (αγγλ.) egoism (= εγωισμός), egocentric (= εγωκεντρικός) // (γαλλ.) égoïsme (= εγωισμός)." },
    { la:"cognosco", el:"γι-γνώσκω // (αγγλ.) cognition (= γνώση, γνωστική λειτουργία), recognize (= αναγνωρίζω) // (γαλλ.) connaître (= γνωρίζω) // (ιταλ.) conoscere (= γνωρίζω)." },
    { la:"vocem", el:"(αγγλ.) vocal (= φωνητικός), voice (= φωνή), revocation (= ανάκληση) // (γαλλ.) vocabulaire (= λεξιλόγιο), voix (= φωνή) // (ιταλ.) voce (= φωνή) // (ισπαν.) voz (= φωνή)." },
    { la:"vis(ne)", el:"βούλομαι // (αγγλ.) volunteer (= εθελοντής), voluntary (= εθελοντικός, εκούσιος), volition (= βούληση) // (γαλλ.) vouloir (= θέλω) // (ιταλ.) volere (= θέλω)." },
    { la:"scire", el:"(γαλλ.) science (= επιστήμη), con-scient (= ειδήμων) // (αγγλ.) conscience (= συνείδηση), conscious (= συνειδητός) // (ιταλ.) scienza (= επιστήμη) // (ισπαν.) ciencia (= επιστήμη)." },
    { la:"responderit", el:"σπένδω, σπονδή· ἄσπονδος // (πορτογαλ.) responder (= απαντώ) // (αγγλ.) response (= απάντηση) // (γαλλ.) répondre (= απαντώ)." },
    { la:"homo", el:"ουμανισμός (< γαλλ.) // (αγγλ.) human (= ανθρώπινος), homicide (= ανθρωποκτονία) // (γαλλ.) homme (= άνθρωπος, άνδρας) // (ιταλ.) uomo (= άνθρωπος) // (ισπαν.) hombre (= άνθρωπος, άνδρας)." },
    { la:"impudens", el:"(αγγλ.) impudence (= αναίδεια) // (γαλλ.) pudique (= σεμνός, μετριόφρων), pudeur (= αιδώς, σεμνότητα) // (ιταλ.) pudore (= αιδώς, σεμνότητα) // (ισπαν.) pudor (= αιδώς)." },
    { la:"credidi, credis", el:"(αγγλ.) credible (= πιστευτός), αντιθ. incredible, credit (= πίστωση), creed (= δόγμα, σύμβολο πίστεως), credence (= εμπιστοσύνη, πίστη) // (γαλλ.) croire (= πιστεύω)." }
  ]
};

export default UNIT;
