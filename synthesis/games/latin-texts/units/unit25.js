export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 25,
  title: "Πώς ένα σύκο στάθηκε αφορμή να καταστραφεί η Καρχηδόνα",
  latinTitle: "Lectio XXV",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Cato', r:'Υποκείμενο', to:'στο attulit', g:'ονομ. ενικ., αρσ.', d:'Cato, Catonis (αρσ. γ΄) — ο Κάτωνας' },
        { l:'attulit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'affero / adfero, attuli, allatum, afferre / adferre (< ad + fero) — φέρνω (κάπου)' },
        { l:'quodam', r:'Επιθετικός προσδ.', to:'στο die', g:'αφαιρ. ενικ., αρσ. — αόριστη επιθετ. αντων.', d:'quidam, quaedam, quoddam — κάποιος, -α, -ο' },
        { l:'die', r:'Αφαιρετική του χρόνου', to:'στο attulit', g:'αφαιρ. ενικ.', d:'dies, diei (αρσ. ε΄) — η ημέρα' },
        { l:'in curiam', k:'curia', r:'Εμπρόθετος επιρρ. προσδ. της κίνησης σε τόπο', to:'στο attulit', g:'in (πρόθ. + αιτ.) + curiam (αιτ. ενικ.)', d:'in — σε· curia, curiae (θηλ. α΄) — το Βουλευτήριο, το κτήριο της Συγκλήτου' },
        { l:'ficum', r:'Αντικείμενο', to:'στο attulit', g:'αιτ. ενικ.', d:'ficus, fici και (ficus, ficus) (θηλ. β΄) — το σύκο' },
        { l:'praecocem', r:'Επιθετικός προσδ.', to:'στο ficum', g:'αιτ. ενικ., θηλ. — επίθ. τριγενές μονοκατάληκτο γ΄ κλ. (γεν. praecocis)', d:'praecox, praecocis — πρώιμος, -η, -ο' },
        { l:'ex Carthagine', k:'Carthago', r:'Εμπρόθετος επιρρ. προσδ. της προέλευσης', to:'στο attulit', g:'ex (πρόθ. + αφαιρ.) + Carthagine (αφαιρ. ενικ.)', d:'ex — από· Carthago, Carthaginis (θηλ. γ΄) — η Καρχηδόνα' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης, συνδεόμενη με την προηγούμενη με το παρατακτικό -que· ρήμα inquit, εννοούμενο υποκ. (Cato), με συνημμένη τη μετοχή ostendens.', kids:[
        { l:'ostendens', r:'Επιρρ. χρονική (ή τροπική) μετοχή (συνημμένη στο εννοούμενο Cato)', to:'στο inquit', g:'ονομ. ενικ., αρσ. — μτχ. ενεργ. ενεστ.', d:'ostendo, ostendi, ostentum (ostensum), ostendere (3) (< obs + tendo) — δείχνω' },
        { l:'que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος — εγκλιτική χρήση (ostendens-que)', d:'-que — και', conn:true },
        { l:'patribus', r:'Έμμεσο αντικείμενο', to:'στη μετοχή ostendens (με εννοούμενο άμεσο αντικ. eam / ficum)', g:'δοτ. πληθ.', d:'patres, patrum (αρσ. γ΄) — οι Συγκλητικοί' },
        { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης (ευθύς λόγος).', kids:[
          { l:'Interrogo', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'interrogo, interrogavi, interrogatum, interrogare (1) — ρωτώ' },
          { l:'vos', r:'Άμεσο αντικείμενο', to:'στο interrogo', g:'αιτ. πληθ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ' }
        ]},
        { l:'inquit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου του ελλειπτικού ρήματος', d:'inquam — λέγω' },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρόταση μερικής άγνοιας, ως έμμεσο αντικ. στο ρήμα interrogo της κύριας. Εισάγεται με το ερωτηματικό επίρρημα quando· εκφέρεται με υποτακτική (putetis) λόγω ιδιομορφίας στην ακολουθία των χρόνων (υποκειμενική χροιά), χρόνου ενεστ. (εξάρτηση από αρκτικό χρόνο interrogo — σύγχρονο στο παρόν).', kids:[
          { l:'quando', r:'Επιρρ. προσδ. του χρόνου', to:'στο decerptam esse', g:'χρονικό (ερωτηματικό) επίρρημα', d:'quando — πότε' },
          { l:'hanc', r:'Επιθετικός προσδ.', to:'στο ficum', g:'αιτ. ενικ., θηλ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, -ή, -ό' },
          { l:'ficum', r:'Υποκείμενο (ειδικού απαρεμφάτου)', to:'στο decerptam esse (ετεροπροσωπία)', g:'αιτ. ενικ.', d:'ficus, fici (θηλ. β΄) — το σύκο' },
          { l:'decerptam esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο putetis', g:'απαρέμφατο παρακειμ. παθ. φωνής', d:'decerpo, decerpsi, decerptum, decerpere (3) (< de + carpo) — κόβω' },
          { l:'putetis', r:'Ρήμα', g:'β΄ πληθ. υποτακτ. ενεστ. ενεργ. φωνής', d:'puto, putavi, putatum, putare (1) — νομίζω' },
          { l:'ex arbore', k:'arbor', r:'Εμπρόθετος επιρρ. προσδ. της απομάκρυνσης (χωρισμού)', to:'στο decerptam esse', g:'ex (πρόθ. + αφαιρ.) + arbore (αφαιρ. ενικ.)', d:'ex — από· arbor, arboris (θηλ. γ΄) — το δέντρο', a:'.' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο ρήμα inquit της κύριας. Εισάγεται με τον ιστορικό - διηγηματικό σύνδεσμο cum και εκφέρεται με υποτακτική, γιατί ο cum υπογραμμίζει τη βαθύτερη σχέση αιτίου - αιτιατού· χρόνου υπερσυντελίκου (dixissent), γιατί εξαρτάται από ιστορικό χρόνο (inquit) και δηλώνει το προτερόχρονο στο παρελθόν.', kids:[
        { l:'Cum', r:'Σύνδεσμος', g:'υποτακτικός χρονικός ιστορικός - διηγηματικός σύνδεσμος', d:'cum — όταν' },
        { l:'omnes', r:'Υποκείμενο', to:'στο dixissent', g:'ονομ. πληθ., αρσ. — επίθ. δικατάληκτο γ΄ κλ.', d:'omnis, -is, -e — όλος, -η, -ο' },
        { l:'recentem', r:'Κατηγορούμενο', to:'στο εννοούμενο υποκ. ficum (μέσω του esse)', g:'αιτ. ενικ., θηλ. — επίθ. τριγενές μονοκατάληκτο γ΄ κλ. (γεν. recentis)', d:'recens, recentis — πρόσφατος, φρέσκος' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο dixissent (εννοούμ. υποκ. ficum — ετεροπροσωπία)', g:'απαρέμφατο ενεστ.', d:'sum, fui, —, esse — είμαι' },
        { l:'dixissent', r:'Ρήμα', g:'γ΄ πληθ. υποτακτ. υπερσυντελίκου ενεργ. φωνής', d:'dico, dixi, dictum, dicere (3) — λέγω', a:',' }
      ]},
      { l:'Atqui', r:'Σύνδεσμος', g:'παρατακτικός αντιθετικός σύνδεσμος', d:'atqui — κι όμως', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας· εκφέρεται με προστακτική (scitote).', kids:[
        { l:'ante', r:'Πρόθεση', to:'με το diem σχηματίζει εμπρόθ. προσδ. του χρόνου στο decerptam esse', g:'πρόθεση + αιτιατική', d:'ante — προ, πριν (δηλώνει το «πριν πόσο χρόνο»)' },
        { l:'tertium', r:'Επιθετικός προσδ.', to:'στο diem', g:'αιτ. ενικ., αρσ. — τακτικό αριθμ. επίθ. β΄ κλ.', d:'tertius, -a, -um — τρίτος, -η, -ο' },
        { l:'diem', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο decerptam esse', g:'αιτ. ενικ.', d:'dies, diei (αρσ. ε΄) — η ημέρα' },
        { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια παρενθετική πρόταση κρίσης· ρήμα inquit, εννοούμ. υποκ. (Cato).', kids:[
          { l:'inquit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου του ελλειπτικού ρήματος', d:'inquam — λέγω' }
        ]},
        { l:'scitote', r:'Ρήμα', g:'β΄ πληθ. προστακτ. ενεστ. ενεργ. φωνής (αναπληρώνεται από την προστακτ. μέλλοντα)', d:'scio, scivi (scii), scitum, scire (4) — μαθαίνω, γνωρίζω' },
        { l:'decerptam esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο scitote (εννοούμ. υποκ. ficum — ετεροπροσωπία)', g:'απαρέμφατο παρακειμ. παθ. φωνής', d:'decerpo, decerpsi, decerptum, decerpere (3) — κόβω' },
        { l:'Carthagine', r:'Απρόθετη αφαιρετική της στάσης σε τόπο', to:'στο decerptam esse', g:'αφαιρ. ενικ. (όνομα πόλης γ΄ κλ. ενικού → απλή αφαιρετική)', d:'Carthago, Carthaginis (θηλ. γ΄) — η Καρχηδόνα', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια επιφωνηματική πρόταση.', kids:[
        { l:'Tam', r:'Επιρρ. προσδ. του ποσού', to:'επιτείνει τη σημασία του prope', g:'ποσοτικό επίρρημα', d:'tam — τόσο' },
        { l:'prope', r:'Επιρρ. προσδ. του τόπου', to:'στο habemus', g:'τοπικό επίρρημα', d:'prope — κοντά' },
        { l:'a muris', k:'murus', r:'Εμπρόθετος επιρρ. προσδ. της τοπικής αφετηρίας', to:'στο habemus', g:'a (πρόθ. + αφαιρ.) + muris (αφαιρ. πληθ.)', d:'a — από· murus, muri (αρσ. β΄) — το τείχος (συνήθως πληθ. muri, murorum = τα τείχη)' },
        { l:'habemus', r:'Ρήμα', g:'α΄ πληθ. οριστ. ενεστ. ενεργ. φωνής', d:'habeo, habui, habitum, habere (2) — έχω' },
        { l:'hostem', r:'Αντικείμενο', to:'στο habemus (εννοούμ. υποκ. nos)', g:'αιτ. ενικ.', d:'hostis, hostis (εδώ αρσ. γ΄) — ο εχθρός', a:'!' }
      ]}
    ]},

    { n: 4, kids: [
      { l:'Itaque', r:'Σύνδεσμος', g:'παρατακτικός συμπερασματικός σύνδεσμος', d:'itaque — επομένως, λοιπόν', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας· εκφέρεται με προστακτική.', kids:[
        { l:'cavete', r:'Ρήμα', g:'β΄ πληθ. προστακτ. ενεστ. ενεργ. φωνής', d:'caveo, cavi, cautum, cavere (2) — προσέχω, φυλάγομαι' },
        { l:'periculum', r:'Αντικείμενο', to:'στο cavete (εννοούμ. υποκ. vos)', g:'αιτ. ενικ., ουδ.', d:'periculum, periculi (ουδ. β΄) — ο κίνδυνος', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας· εκφέρεται με προστακτική.', kids:[
        { l:'tutamini', r:'Ρήμα', g:'β΄ πληθ. προστακτ. ενεστ. — αποθετικό', d:'tutor, tutatus sum, (tutatum), tutari (1, αποθετικό) — προστατεύω' },
        { l:'patriam', r:'Αντικείμενο', to:'στο tutamini (εννοούμ. υποκ. vos)', g:'αιτ. ενικ.', d:'patria, patriae (θηλ. α΄) — η πατρίδα', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας· εκφέρεται με έκφραση απαγόρευσης (nolite confidere).', kids:[
        { l:'Opibus', r:'Αφαιρετική (οργανική) του μέσου', to:'στο confidere', g:'αφαιρ. πληθ.', d:'opes, opum (θηλ. γ΄, συνήθως πληθ.) — οι δυνάμεις (ενικ. σπάνια: opis, opem, ope = η βοήθεια)' },
        { l:'urbis', r:'Γενική κτητική', to:'στο opibus', g:'γεν. ενικ.', d:'urbs, urbis (θηλ. γ΄) — η πόλη' },
        { l:'nolite', r:'Ρήμα', g:'β΄ πληθ. προστακτ. ενεστ. του ανώμαλου ρήματος', d:'nolo, nolui, —, nolle — δε θέλω' },
        { l:'confidere', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο nolite (ταυτοπροσωπία — εννοούμ. υποκ. vos)', g:'απαρέμφατο ενεστ. — ημιαποθετικό', d:'confido, confisus sum, (confisum), confidere (3, ημιαποθετικό) — εμπιστεύομαι, έχω εμπιστοσύνη, στηρίζομαι', a:'.' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας· εκφέρεται με προστακτική (deponite).', kids:[
        { l:'Fiduciam', r:'Αντικείμενο', to:'στο deponite', g:'αιτ. ενικ.', d:'fiducia, fiduciae (θηλ. α΄) — η αυτοπεποίθηση' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση στο fiduciam της κύριας. Εισάγεται με την αναφορική αντων. quae και εκφέρεται με οριστική (est), γιατί εκφράζει το πραγματικό· χρόνου ενεστ., γιατί αναφέρεται στο παρόν.', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ., θηλ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'nimia', r:'Επιρρηματικό κατηγορούμενο του τρόπου', to:'στο υποκ. quae (μέσω του est)', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'nimius, -a, -um — υπερβολικός, -ή, -ό', note:'Κατ’ άλλους χαρακτηρίζεται ως κατηγορούμενο· όμως με υπαρκτικό ρήμα και δοτική προσωπική κτητική δεν μπορούμε να έχουμε καθαρό (απλό) κατηγορούμενο.' },
          { l:'vobis', r:'Δοτική προσωπική κτητική', to:'στο est', g:'δοτ. πληθ., αρσ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ' },
          { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. του ανώμαλου - βοηθητικού (υπαρκτικού εδώ) ρήματος', d:'sum, fui, —, esse — είμαι, υπάρχω', a:',' }
        ]},
        { l:'deponite', r:'Ρήμα', g:'β΄ πληθ. προστακτ. ενεστ. ενεργ. φωνής (εννοούμ. υποκ. vos)', d:'depono, deposui, depositum, deponere (3) (< de + pono) — αποβάλλω', a:'.' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας· εκφέρεται με έκφραση απαγόρευσης (Neminem credideritis).', kids:[
        { l:'Neminem', r:'Υποκείμενο (ειδικού απαρεμφάτου)', to:'στο consulturum esse (ετεροπροσωπία)', g:'αιτ. ενικ., αρσ. — αόριστη ουσιαστ. αντων.', d:'nemo — κανένας', note:'Η nemo αναπληρώνει τη γεν. και την αφαιρ. ενικ. καθώς και τον πληθ. από την nullus, -a, -um (γεν. nullius, δοτ. nemini, αιτ. neminem, αφαιρ. nullo).' },
        { l:'credideritis', r:'Ρήμα', g:'β΄ πληθ. υποτακτ. παρακειμ. ενεργ. φωνής', d:'credo, credidi, creditum, credere (3) — πιστεύω' },
        { l:'patriae', r:'Δοτική προσωπική χαριστική', to:'στο consulturum esse', g:'δοτ. ενικ.', d:'patria, patriae (θηλ. α΄) — η πατρίδα' },
        { l:'consulturum esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο credideritis', g:'απαρέμφατο μέλλοντα ενεργ. φωνής', d:'consulo, consului, consultum, consulere (3) — φροντίζω για' },
        { type:'sub', key:'ypothetiki', label:'Υποθετική', note:'Δευτ. επιρρηματική υποθετική πρόταση (υπόθεση). Εισάγεται με τον υποθετικό σύνδεσμο nisi, γιατί είναι αποφατική / αρνητική. Σχηματίζει εξαρτημένο (από το credideritis) υποθετικό λόγο: Υπόθεση nisi ... consulueritis (nisi + υποτακτ. παρακειμ.) — Απόδοση neminem patriae consulturum esse (απαρ. μέλλοντα)· ανοικτή υπόθεση για το μέλλον.', kids:[
          { l:'nisi', r:'Σύνδεσμος', g:'υποτακτικός υποθετικός (αποφατικός / αρνητικός) σύνδεσμος', d:'nisi — αν δεν' },
          { l:'vos', r:'Υποκείμενο', to:'στο consulueritis', g:'ονομ. πληθ., αρσ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ' },
          { l:'ipsi', r:'Επιθετικός προσδ.', to:'στο vos', g:'ονομ. πληθ., αρσ. — δεικτική - οριστική αντων.', d:'ipse, ipsa, ipsum — ο ίδιος, η ίδια, το ίδιο' },
          { l:'patriae', r:'Δοτική προσωπική χαριστική', to:'στο consulueritis', g:'δοτ. ενικ.', d:'patria, patriae (θηλ. α΄) — η πατρίδα' },
          { l:'consulueritis', r:'Ρήμα', g:'β΄ πληθ. υποτακτ. παρακειμ. ενεργ. φωνής', d:'consulo, consului, consultum, consulere (3) — φροντίζω για', a:'.' }
        ]}
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας· εκφέρεται με προστακτική.', kids:[
        { l:'Mementote', r:'Ρήμα', g:'β΄ πληθ. προστακτ. (αναλογικά σχηματισμένης με την προστακτ. μέλλοντα) με σημασία ενεστ. του ελλειπτικού ρήματος', d:'memini, meminisse — θυμάμαι' },
        { l:'rem publicam', k:'res', r:'Υποκείμενο (ειδικού απαρεμφάτου)', to:'στο fuisse', g:'αιτ. ενικ. (rem: αιτ. ενικ. θηλ.· publicam: επιθ. προσδ.)', d:'res publica, rei publicae — η πολιτεία, η δημοκρατία', note:'Συνεκφορά: rem = υποκ. στο fuisse, publicam = επιθετικός προσδ. στο rem.' },
        { l:'in extremo discrimine', k:'discrimen', r:'Εμπρόθετος επιρρ. προσδ. της κατάστασης', to:'στο fuisse', g:'in (πρόθ. + αφαιρ.) + extremo (αφαιρ. ενικ., ουδ.) + discrimine (αφαιρ. ενικ.)', d:'in — σε· extremus, -a, -um — έσχατος (υπερθ. του exterus)· discrimen, discriminis (ουδ. γ΄) — ο κίνδυνος', note:'extremo: κατηγορηματικός προσδ. στο discrimine.' },
        { l:'quondam', r:'Επιρρ. προσδ. του χρόνου', to:'στο fuisse', g:'χρονικό επίρρημα', d:'quondam — κάποτε' },
        { l:'fuisse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο Mementote (εννοούμ. υποκ. vos — ετεροπροσωπία)', g:'απαρέμφατο παρακειμ. του ανώμαλου - βοηθητικού ρήματος', d:'sum, fui, —, esse — είμαι, βρίσκομαι', a:'!' }
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης.', kids:[
        { l:'Statim', r:'Επιρρ. προσδ. του χρόνου', to:'στο sumptum est', g:'χρονικό επίρρημα', d:'statim — αμέσως' },
        { l:'que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος — εγκλιτική χρήση (Statim-que)', d:'-que — και', conn:true },
        { l:'sumptum est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμ. παθ. φωνής', d:'sumo, sumpsi, sumptum, sumere (3) — αρχίζω· bellum sumo = αρχίζω πόλεμο' },
        { l:'Punicum', r:'Επιθετικός προσδ.', to:'στο bellum', g:'ονομ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'Punicus, -a, -um — Καρχηδονιακός, -ή, -ό' },
        { l:'bellum', r:'Υποκείμενο', to:'στο sumptum est', g:'ονομ. ενικ., ουδ.', d:'bellum, belli (ουδ. β΄) — ο πόλεμος' },
        { l:'tertium', r:'Επιθετικός προσδ.', to:'στο bellum', g:'ονομ. ενικ., ουδ. — τακτικό αριθμ. επίθ. β΄ κλ.', d:'tertius, tertia, tertium — τρίτος, -η, -ο', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση στον όρο bellum της κύριας. Εισάγεται με την αναφορική αντων. quo και εκφέρεται με οριστική (deleta est), γιατί εκφράζει το πραγματικό· χρόνου παρακειμ., γιατί αναφέρεται στο παρελθόν.', kids:[
          { l:'quo', r:'Αφαιρετική του χρόνου', to:'στο deleta est', g:'αφαιρ. ενικ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο', note:'Η αφαιρετική του χρόνου quo εκφράζει το «πότε έγινε κάτι».' },
          { l:'Carthago', r:'Υποκείμενο', to:'στο deleta est', g:'ονομ. ενικ.', d:'Carthago, Carthaginis (θηλ. γ΄) — η Καρχηδόνα' },
          { l:'deleta est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμ. παθ. φωνής', d:'deleo, delevi, deletum, delere (2) — καταστρέφω', a:'.' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Cato attulit quodam die in curiam ficum praecocem ex Carthagine ostendensque patribus «Interrogo vos» inquit «quando hanc ficum decerptam esse putetis ex arbore».", el:"Κάποια μέρα ο Κάτωνας έφερε στο Βουλευτήριο ένα πρώιμο σύκο από την Καρχηδόνα και δείχνοντάς το στους Συγκλητικούς, είπε: «Σας ρωτώ πότε νομίζετε ότι κόπηκε αυτό το σύκο από το δέντρο»." },
    { n:2, la:"Cum omnes recentem esse dixissent, «Atqui ante tertium diem» inquit «scitote decerptam esse Carthagine.", el:"Όταν όλοι είπαν ότι ήταν φρέσκο, είπε: «Κι όμως μάθετε ότι κόπηκε στην Καρχηδόνα πριν τρεις μέρες." },
    { n:3, la:"Tam prope a muris habemus hostem!", el:"Τόσο κοντά στα τείχη έχουμε τον εχθρό!" },
    { n:4, la:"Itaque cavete periculum, tutamini patriam.", el:"Φυλαχτείτε λοιπόν από τον κίνδυνο, προστατεύστε την πατρίδα." },
    { n:5, la:"Opibus urbis nolite confidere.", el:"Μην έχετε εμπιστοσύνη στις δυνάμεις της πόλης." },
    { n:6, la:"Fiduciam, quae nimia vobis est, deponite.", el:"Να αποβάλετε την αυτοπεποίθηση, που είναι υπερβολική σε εσάς." },
    { n:7, la:"Neminem credideritis patriae consulturum esse, nisi vos ipsi patriae consulueritis.", el:"Κανείς να μην πιστέψετε ότι θα φροντίσει για την πατρίδα, αν εσείς οι ίδιοι δεν φροντίσετε για την πατρίδα." },
    { n:8, la:"Mementote rem publicam in extremo discrimine quondam fuisse!»", el:"Να θυμάστε ότι η πολιτεία βρέθηκε κάποτε στον έσχατο κίνδυνο!»" },
    { n:9, la:"Statimque sumptum est Punicum bellum tertium, quo Carthago deleta est.", el:"Κι αμέσως άρχισε ο τρίτος Καρχηδονιακός πόλεμος, κατά τη διάρκεια του οποίου η Καρχηδόνα καταστράφηκε." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"curia, -ae" },
        { form:"patria, -ae" },
        { form:"fiducia, -ae", note:"δεν σχηματίζει πληθ." }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"murus, -i", note:"συνήθως πληθ. muri, -orum = τα τείχη" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"ficus, -i", note:"ετερόκλιτο· και τύποι δ΄ κλ. (ficus, -us)" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"periculum, -i" },
        { form:"bellum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Cato, Catonis", note:"κύριο όνομα, δεν έχει πληθ." },
        { form:"patres, patrum", note:"εδώ μόνο πληθ. = οι Συγκλητικοί (ενικ. pater, patris = πατέρας)" },
        { form:"hostis, hostis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"Carthago, Carthaginis", note:"κύριο όνομα, δεν έχει πληθ." },
        { form:"arbor, arboris" },
        { form:"opes, opum", note:"συνήθως πληθ. = δυνάμεις (ενικ. σπάνια: opis, opem, ope = βοήθεια)" },
        { form:"urbs, urbis", note:"γεν. πληθ. -ium" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"discrimen, discriminis" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"dies, diei", note:"εδώ αρσ. = ημέρα· θηλ. όταν σημαίνει ορισμένη προθεσμία" } ] },
      { gender:"Θηλυκά", items:[ { form:"res, rei" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"tertius, -a, -um", note:"τακτικό αριθμητικό· δεν σχηματίζει κλητική" },
      { form:"nimius, -a, -um", note:"παραθετικά περιφραστικά" },
      { form:"publicus, -a, -um", note:"δεν σχηματίζει παραθετικά" },
      { form:"exterus, -a, -um" },
      { form:"Punicus, -a, -um", note:"δεν σχηματίζει παραθετικά" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"praecox, -x, -x", note:"τριγενές μονοκατάληκτο (γεν. praecocis)· δεν σχηματίζει παραθετικά" },
      { form:"omnis, -is, -e", note:"δεν σχηματίζει παραθετικά" },
      { form:"recens, -ns, -ns", note:"τριγενές μονοκατάληκτο (γεν. recentis)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"tertius, -a, -um", comp:"—", sup:"—" },
      { pos:"nimius, -a, -um", comp:"magis nimius, -a, -um", sup:"maxime nimius, -a, -um" },
      { pos:"publicus, -a, -um", comp:"—", sup:"—" },
      { pos:"exterus, -a, -um", comp:"exterior, -ior, -ius", sup:"extremus, -a, -um / extimus, -a, -um" },
      { pos:"Punicus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"praecox, praecocis", comp:"—", sup:"—" },
      { pos:"omnis, -is, -e", comp:"—", sup:"—" },
      { pos:"recens, recentis", comp:"recentior, -ior, -ius", sup:"recentissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική· κλίνεται όπως η qui, quae, quod (τελικό -m → -n πριν από -dam: quendam, quorundam)" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσώπου" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"nemo", kind:"Αόριστη", extra:"ουσιαστική· αναπληρώνει τύπους της nullus, -a, -um" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική - οριστική", extra:"" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"interrogo", perf:"interrogavi", sup:"interrogatum", inf:"interrogare", note:"" },
      { pres:"puto", perf:"putavi", sup:"putatum", inf:"putare", note:"" },
      { pres:"tutor", perf:"tutatus sum", sup:"(tutatum)", inf:"tutari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"habeo", perf:"habui", sup:"habitum", inf:"habere", note:"" },
      { pres:"caveo", perf:"cavi", sup:"cautum", inf:"cavere", note:"" },
      { pres:"deleo", perf:"delevi", sup:"deletum", inf:"delere", note:"" },
      { pres:"ostendo", perf:"ostendi", sup:"ostentum (ostensum)", inf:"ostendere", note:"< obs + tendo" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"decerpo", perf:"decerpsi", sup:"decerptum", inf:"decerpere", note:"< de + carpo" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"προστ. ενεστ. dic" },
      { pres:"confido", perf:"confisus sum", sup:"(confisum)", inf:"confidere", note:"ημιαποθετικό" },
      { pres:"depono", perf:"deposui", sup:"depositum", inf:"deponere", note:"< de + pono" },
      { pres:"credo", perf:"credidi", sup:"creditum", inf:"credere", note:"" },
      { pres:"consulo", perf:"consului", sup:"consultum", inf:"consulere", note:"" },
      { pres:"sumo", perf:"sumpsi", sup:"sumptum", inf:"sumere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"scio", perf:"scivi (scii)", sup:"scitum", inf:"scire", note:"προστ. ενεστ. αναπληρώνεται από την προστ. μέλλοντα" }
    ]},
    { syz:"Ανώμαλα", rows:[
      { pres:"affero / adfero", perf:"attuli", sup:"allatum", inf:"afferre / adferre", note:"< ad + fero· προστ. ενεστ. affer" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"nolo", perf:"nolui", sup:"—", inf:"nolle", note:"< ne + volo" }
    ]},
    { syz:"Ελλειπτικά", rows:[
      { pres:"inquam", perf:"—", sup:"—", inf:"—", note:"ελλειπτικό — λέγω" },
      { pres:"memini", perf:"memini", sup:"—", inf:"meminisse", note:"ελλειπτικό (παρακείμ. με σημασία ενεστ.)· προστ. memento / mementote" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Ουσιαστικό", title:"ficus: ετερόκλιτο", body:"Το ficus, fici (θηλ.) κλίνεται κατά τη β΄ κλίση, έχει όμως και τύπους της δ΄ κλίσης σε -us και -u (ficus, ficus). Είναι ετερόκλιτο και γένους θηλυκού ως όνομα δέντρου· εδώ = το σύκο." },
    { tag:"Τόπος", title:"Carthagine: απλή αφαιρετική στάσης", body:"Σε ονόματα πόλεων γ΄ κλίσης ενικού (ή πληθυντικού) η στάση σε τόπο δηλώνεται με απλή (απρόθετη) αφαιρετική: Carthagine = στην Καρχηδόνα. (Σε α΄ και β΄ κλίσης ενικού → γενική, π.χ. Ephesi = στην Έφεσο.)" },
    { tag:"Σύνδεσμος", title:"cum ιστορικός - διηγηματικός", body:"Το cum omnes ... dixissent είναι χρονική με τον ιστορικό - διηγηματικό cum + υποτακτική (υπερσυντελίκου, προτερόχρονο), γιατί υπογραμμίζεται η βαθύτερη σχέση αιτίου - αιτιατού ανάμεσα στη δευτερεύουσα και την κύρια." },
    { tag:"Ρήμα", title:"nolite confidere: απαγόρευση", body:"Η απαγόρευση εκφράζεται με noli / nolite + απαρέμφατο ενεστ. (β΄ ενικ./πληθ.) ή με ne + υποτακτική παρακειμ. Έτσι: Nolite confidere = ne confisi sitis. Το confido είναι ημιαποθετικό, το tutor αποθετικό." },
    { tag:"Συνεκφορά", title:"res publica: συνεκφορά", body:"Η res publica, rei publicae = η πολιτεία, η δημοκρατία, κλίνεται και στα δύο μέρη της. Εδώ rem = υποκ. στο απαρέμφατο fuisse και publicam = επιθετικός προσδ." },
    { tag:"Ρήμα", title:"memini / mementote", body:"Το memini, meminisse είναι ελλειπτικό (παρακείμενος χωρίς ενεστώτα, με σημασία ενεστ.). Σχηματίζει δύο τύπους προστακτικής (β΄ ενικ. memento, β΄ πληθ. mementote), αναλογικά με την προστακτ. μέλλοντα, με σημασία ενεστώτα = θυμήσου / να θυμάστε." }
  ],

  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"ostendens (επιρρ. χρονική μετοχή ενεστ., δηλώνει το σύγχρονο· εξάρτηση από ιστορικό χρόνο inquit)", to:"dum ostendit (dum + οριστ. ενεστ. — συνεχιζόμενη πράξη / λατινισμός) ή cum ostenderet (cum + υποτακτ. παρατατικού)", note:"Αν η μετοχή χαρακτηριστεί ως τροπική, δεν αναλύεται." }
    ]},
    { id:"Β", label:"Μετατροπή κυρίων προτάσεων σε μετοχικές φράσεις", items:[
      { from:"Cato attulit quodam die in curiam ficum praecocem ex Carthagine et inquit", to:"A Catone allata quodam die in curiam fico praecoci ex Carthagine inquit", note:"Νόθη αφαιρετική απόλυτη, γιατί η λατινική δε διαθέτει ενεργητ. μετοχή παρακειμ. και το ποιητικό αίτιο «a Catone» ταυτίζεται με το υποκ. Cato του ρήματος inquit." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Cato attulit quodam die in curiam ficum praecocem ex Carthagine ...", to:"A Catone quodam die ficus praecox in curiam allata est ex Carthagine" },
      { from:"fiduciam, ..., deponite", to:"Fiducia, ..., a vobis deponetur!" }
    ]},
    { id:"Δ", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"... «quando hanc ficum decerptam esse putetis ex arbore»", to:"... «quando hanc ficum aliquem decerpsisse putetis ex arbore»" },
      { from:"..., quo Carthago deleta est", to:"..., quo (Romani) Carthaginem deleverunt / delevere" }
    ]},
    { id:"Ε", label:"Μετατροπή του πλαγίου λόγου σε ευθύ και τροπή του υποθετικού λόγου στα άλλα είδη", items:[
      { from:"Εξαρτημένος υποθετικός λόγος: Neminem credideritis patriae consulturum esse, nisi vos ipsi patriae consulueritis (εξάρτηση από την έκφραση απαγόρευσης «neminem credideritis»)", to:"Ανεξάρτητος (ευθύς λόγος): Nemo patriae consulet, nisi vos ipsi patriae consulueritis", note:"Ανοικτή υπόθεση για το μέλλον — Υπόθεση: nisi ... consulueritis (οριστ. συντελεσμ. μέλλοντα)· Απόδοση: ... consulet (οριστ. μέλλοντα)." },
      { from:"1ο είδος — Ανοικτή υπόθεση (πραγματικού)", to:"Υπόθεση: nisi ... consulitis (οριστ. ενεστ.) — Απόδοση: ... consulit (οριστ. ενεστ.) [για το παρόν]· Υπόθεση: nisi ... consuluistis (οριστ. παρακειμ.) — Απόδοση: ... consuluit (οριστ. παρακειμ.) [για το παρελθόν]" },
      { from:"2ο είδος — Υπόθεση αντίθετη προς την πραγματικότητα", to:"Υπόθεση: nisi ... consuleretis (υποτακτ. παρατατικού) — Απόδοση: ... consuleret (υποτακτ. παρατατικού) [για το παρόν]· Υπόθεση: nisi ... consuluissetis (υποτακτ. υπερσυντελίκου) — Απόδοση: ... consuluisset (υποτακτ. υπερσυντελίκου) [για το παρελθόν]" },
      { from:"3ο είδος — Υπόθεση δυνατή ή πιθανή", to:"Υπόθεση: nisi ... consulatis (υποτακτ. ενεστ.) — Απόδοση: ... consulat (υποτακτ. ενεστ.) [για το παρόν - μέλλον]" }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του ευθέος λόγου σε πλάγιο λόγο", items:[
      { from:"Cato attulit ... ex Carthagine· «Interrogo vos» ... «quando hanc ficum decerptam esse putetis ex arbore»", to:"Scriptor narrat / narravit Catonem attulisse ... ex Carthagine· Catonem interrogare illos quando illam ficum decerptam esse putent / putarent ex arbore" },
      { from:"«Atqui ante tertium diem scitote decerptam esse Carthagine»", to:"Cato adhortatur / adhortatus est patres ut sciant / scirent ante tertium diem ficum decerptam esse Carthagine ή scire ante tertium diem ...", note:"adhortor, admoneo + βουλητική πρόταση (ut ...) ή τελικό απαρέμφατο." },
      { from:"«Tam prope a muris habemus hostem!»", to:"Cato dicit / dixit tam prope a muris ipsos habere hostem ή Dico / Dixi tam prope a muris nos habere hostem" },
      { from:"«Itaque cavete periculum, tutamini patriam. Opibus urbis nolite confidere. Fiduciam, quae nimia vobis est, deponite. Neminem credideritis patriae consulturum esse, nisi vos ipsi patriae consulueritis»", to:"Cato admonet / admonuit Romanos ut caveant / caverent periculum, (ut) tutentur / tutarentur patriam (ή cavere periculum, tutari patriam)· ne opibus urbis confidant / confiderent (ή non opibus urbis confidere)· ut fiduciam, quae nimia illis sit / esset, deponant / deponerent (ή fiduciam ... deponere)· ne aliquem patriae consulturum esse credant / crederent (ή non aliquem ... credere), nisi illi ipsi patriae consulueritis / consuluissetis" },
      { from:"«Mementote rem publicam in extremo discrimine quondam fuisse!» Statimque sumptum est Punicum bellum tertium, quo Carthago deleta est", to:"Scriptor tradit / tradidit statim sumptum esse Punicum bellum tertium quo Carthago deleta sit / deleta esset" }
    ]}
  ],

  etymology: [
    { la:"Cato", el:"Κάτων." },
    { la:"die, diem", el:"(Ζεύς, γενική Διός) Δίας (ως «θεός του φωτός») // (αγγλ.) diary (= ημερολόγιο), journal (= περιοδικό, ημερήσιο) // (ισπαν.) día (= ημέρα)." },
    { la:"ficum", el:"σῦκον, φίκος // (αγγλ.) fig (= σύκο) // (γαλλ.) figue (= σύκο) // (ιταλ.) fico (= σύκο) // (ισπαν.) higo (= σύκο)." },
    { la:"praecocem", el:"(γαλλ.) précoce, abricot (= βερίκοκο) // (αγγλ.) apricot (= βερίκοκο), precocious (= πρώιμος, πρόωρα ώριμος)." },
    { la:"Carthagine, Carthago", el:"Καρχηδόνα." },
    { la:"os-tendens", el:"τείνω // (γαλλ.) étendre (= τείνω), tendu (= τεντωμένος) // (αγγλ.) ostensible (= φαινομενικός, εμφανής), ostentatious (= επιδεικτικός)." },
    { la:"patribus, patriam, patriae", el:"πατήρ, πατρίς // (γαλλ.) paternel (= πατρικός), père (= πατέρας) // (αγγλ.) paternity (= πατρότητα) // (ισπαν.) padre (= πατέρας)." },
    { la:"interrogo", el:"(γαλλ.) interrogation (= ερώτημα, ανάκριση) // (αγγλ.) interrogate (= ανακρίνω, ερωτώ)." },
    { la:"de-cerptam", el:"καρπός." },
    { la:"esse, est", el:"εἰμί // (αγγλ.) essence (= ουσία), essential (= ουσιώδης) // (ιταλ.) essere (= είμαι, το είναι)." },
    { la:"putetis", el:"(αγγλ.) dis-putation (= συζήτηση, λογομαχία), putative (= υποτιθέμενος), compute (= υπολογίζω), amputate (= ακρωτηριάζω)." },
    { la:"arbore", el:"άλμπουρο (< βενετ.) // (γαλλ.) arbre (= δέντρο) // (αγγλ.) arboreal (= δεντρικός, των δέντρων) // (ιταλ.) albero (= δέντρο) // (ισπαν.) árbol (= δέντρο)." },
    { la:"recentem", el:"(γαλλ.) récent (= πρόσφατος) // (ισπαν.) reciente (= πρόσφατος)." },
    { la:"dixissent", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση), dire (= λέω) // (αγγλ.) dictate (= υπαγορεύω)." },
    { la:"tertium", el:"τρεῖς, τρία // (αγγλ.) tertiary (= τριτογενής, τρίτης τάξεως) // (γαλλ.) tiers (= τρίτος, τρίτο μέρος)." },
    { la:"scitote", el:"(γαλλ.) science (= επιστήμη), con-scient (= ειδήμων) // (αγγλ.) conscious (= συνειδητός), omniscient (= παντογνώστης)." },
    { la:"muris", el:"ἄ-μυνα· μουράγιο (< βενετ.) // (γαλλ.) mur (= τείχος) // (αγγλ.) mural (= τοιχογραφία· του τοίχου) // (ιταλ.) muro (= τοίχος)." },
    { la:"habemus", el:"(γερμ.) haben, (αγγλ.) have // (αγγλ.) habit (= συνήθεια· ένδυμα), prohibit (= απαγορεύω) // (γαλλ.) avoir (= έχω)." },
    { la:"hostem", el:"(αγγλ.) host (= ξενιστής), hostile (= εχθρικός) // (γαλλ.) hostilité (= εχθρότητα)." },
    { la:"cavete", el:"(κοϜέω) κοέω (= παρατηρώ) // (αγγλ.) caveat (= επιφύλαξη, προειδοποίηση), caution (= προσοχή, προφύλαξη)." },
    { la:"periculum", el:"πείρα, πειρατής· απειρία // (αγγλ.) peril (= κίνδυνος) // (γαλλ.) péril (= κίνδυνος) // (ιταλ.) pericolo (= κίνδυνος)." },
    { la:"tutamini", el:"(γαλλ.) tuteur (= παιδαγωγός) // (αγγλ.) tutor (= δάσκαλος, κηδεμόνας), tuition (= διδασκαλία· δίδακτρα)." },
    { la:"urbis", el:"(γαλλ.) urbain (= αστικός) // (αγγλ.) urban (= αστικός), suburb (= προάστιο)." },
    { la:"nolite [< ne- + volo]", el:"βούλομαι // (αγγλ.) volunteer (= εθελοντής), voluntary (= εκούσιος, εθελοντικός), benevolent (= καλοπροαίρετος) // (γαλλ.) vouloir (= θέλω)." },
    { la:"confidere, fiduciam", el:"πειθώ // (γαλλ.) con-fiance (= εμπιστοσύνη) // (αγγλ.) con-fidence (= αυτοπεποίθηση), fiduciary (= εμπιστευματικός, καταπιστευματικός) // (ιταλ.) fiducia (= εμπιστοσύνη)." },
    { la:"de-ponite", el:"(γαλλ.) positionner (= τοποθετώ) // position (= θέση) // (αγγλ.) deposit (= καταθέτω· κατάθεση), deposition (= κατάθεση, απόθεση)." },
    { la:"credideritis", el:"(αγγλ.) credible (= πιστευτός), αντιθ. incredible, credit (= πίστωση), creed (= δόγμα, πιστεύω) // (γαλλ.) croire (= πιστεύω)." },
    { la:"consulturum, consulueritis", el:"(γαλλ.) consulter (= συμβουλεύω) // (αγγλ.) consultant (= σύμβουλος) // (ιταλ.) consultare (= συμβουλεύομαι)." },
    { la:"mementote", el:"μέμνημαι· μνήμη, μνημονικός // (αγγλ.) monument (= μνημείο), memento (= ενθύμιο) // (γαλλ.) mémento (= υπόμνημα, ενθύμιο)." },
    { la:"rem", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός), rebus (= εικονόγριφος) // (γαλλ.) rien (= τίποτα)." },
    { la:"publicam", el:"(γαλλ.) publique (= δημόσιος) // (αγγλ.) public (= δημόσιος), publish (= δημοσιεύω, εκδίδω)." },
    { la:"rem publicam", el:"ρεπουμπλικανός, ρεπουμπλικανισμός // ρεπούμπλικα (= είδος ανδρικού καπέλου) (< ιταλ.) // (αγγλ.) republic (= δημοκρατία) // (γαλλ.) république (= δημοκρατία)." },
    { la:"extremo", el:"εξτρεμισμός (< γαλλ.) // (αγγλ.) extreme (= ακραίος), extremity (= άκρο, εσχατιά)." },
    { la:"dis-crimine", el:"κρίνω // (γαλλ.) crise (= κρίση), discrimination (= διάκριση) // (αγγλ.) crime (= έγκλημα), discriminate (= κάνω διάκριση, διακρίνω)." },
    { la:"deleta", el:"(αγγλ.) delete (= διάγραψε), indelible (= ανεξίτηλος) // (γαλλ.) indélébile (= ανεξίτηλος)." }
  ]
};

export default UNIT;
