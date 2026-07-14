// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 25
//  Δομή όπως στο unit16.js: κείμενο -> periods (λέξεις/προτάσεις),
//  μετάφραση σε αντιστοίχιση, πίνακες λέξεων, SOS.
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 25,
  title: "Πώς ένα σύκο στάθηκε αφορμή να καταστραφεί η Καρχηδόνα",
  latinTitle: "Lectio XXV",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Cato', r:'Υποκείμενο', to:'στο attulit', g:'ονομ. ενικ., αρσ.', d:'Cato, Catonis (αρσ. γ΄) — ο Κάτωνας' },
        { l:'attulit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'affero, attuli, allatum, afferre — φέρνω (κάπου)', note:'β΄ ενικ. προστ. ενεστ.: affer.' },
        { l:'quodam', r:'Επιθετικός προσδ.', to:'στο die', g:'αφαιρ. ενικ., αρσ. — αόριστη επιθετική αντωνυμία', d:'quidam, quaedam, quoddam — κάποιος, κάποια, κάποιο' },
        { l:'die', r:'Αφαιρετική του χρόνου', to:'στο attulit', g:'αφαιρ. ενικ.', d:'dies, diei (αρσ. ε΄) — η ημέρα' },
        { l:'in curiam', k:'curia', r:'Εμπρόθετος επιρρ. προσδ. (κίνηση σε τόπο)', to:'στο attulit', g:'in (πρόθ. + αιτ.) + curiam (αιτ. ενικ.)', d:'in — σε, προς· curia, curiae (θηλ. α΄) — το Βουλευτήριο, το κτίριο της Συγκλήτου' },
        { l:'ficum', r:'Αντικείμενο', to:'στο attulit', g:'αιτ. ενικ., θηλ.', d:'ficus, fici (θηλ. β΄) & ficus, ficus (θηλ. δ΄) — το σύκο', note:'Έχει τύπους κατά τη β΄ και (σε -us/-u) κατά τη δ΄ κλ.' },
        { l:'praecocem', r:'Επιθετικός προσδ.', to:'στο ficum', g:'αιτ. ενικ., θηλ. — επίθ. γ΄ κλ.', d:'praecox, praecox, praecox (praecocis) — πρώιμος' },
        { l:'ex Carthagine', k:'Carthago', r:'Εμπρόθετος επιρρ. προσδ. της προέλευσης', to:'στο attulit', g:'ex (πρόθ. + αφαιρ.) + Carthagine (αφαιρ. ενικ.)', d:'ex — από· Carthago, Carthaginis (θηλ. γ΄) — η Καρχηδόνα (δεν έχει πληθ.)' }
      ]}
    ]},

    { n: 2, kids: [
      { l:'-que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος — εγκλιτικός', d:'-que — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως· συνδέεται συμπλεκτικά με την πρότ. 1 με το εγκλιτικό -que.', kids:[
        { l:'ostendens', r:'Χρονική μετοχή', to:'συνημμένη στο υποκ. Cato του inquit', g:'ονομ. ενικ., αρσ. — μετοχή ενεστώτα', d:'ostendo, ostendi, ostentum (& ostensum), ostendere (3) — δείχνω', note:'Συνημμένη χρονική μετοχή στο εννοούμενο υποκείμενο Cato.' },
        { l:'patribus', r:'Έμμεσο αντικείμενο', to:'στη μτχ. ostendens', g:'δοτ. πληθ.', d:'pater, patris (αρσ. γ΄) — ο πατέρας· εδώ πληθ. patres, patrum = οι συγκλητικοί (ετερόσημο)' },
        { l:'inquit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. — ελλειπτικό ρήμα', d:'inquam — λέω', note:'Εννοούμενο υποκ.: Cato. Άμεσο αντικ. της μτχ.: εννοούμενο ficum.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Interrogo', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'interrogo, interrogavi, interrogatum, interrogare (1) — ρωτώ', note:'Εννοούμενο υποκείμενο: ego.' },
        { l:'vos', r:'Άμεσο αντικείμενο', to:'στο interrogo', g:'αιτ. πληθ. — β΄ προσ. προσωπικής αντωνυμίας', d:'tu (πληθ. vos) — εσύ / εσείς' },
        { type:'sub', key:'plagia', label:'Δευτ. πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρόταση μερικής αγνοίας, ως έμμεσο αντικ. του interrogo. Εισάγεται με το ερωτηματικό χρονικό επίρρημα quando· εκφέρεται με υποτακτική (η εξάρτηση δίνει υποκειμενική χροιά), και συγκεκριμένα υποτ. ενεστώτα (putetis), γιατί εξαρτάται από αρκτικό χρόνο (interrogo) και δηλώνει το σύγχρονο στο παρόν.', kids:[
          { l:'quando', r:'Επιρρ. προσδ. του χρόνου', to:'στο decerptam esse', g:'ερωτηματικό χρονικό επίρρημα', d:'quando — πότε' },
          { l:'hanc', r:'Επιθετικός προσδ.', to:'στο ficum', g:'αιτ. ενικ., θηλ. — δεικτική αντωνυμία', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
          { l:'ficum', r:'Υποκείμενο απαρεμφάτου', to:'στο decerptam esse (ετεροπροσωπία)', g:'αιτ. ενικ., θηλ.', d:'ficus, fici (θηλ. β΄) & ficus, ficus (θηλ. δ΄) — το σύκο' },
          { l:'decerptam esse', r:'Ειδικό απαρέμφατο (αντικείμενο)', to:'στο putetis', g:'απαρέμφατο παρακειμένου παθ. φωνής', d:'decerpo, decerpsi, decerptum, decerpere (3) — κόβω' },
          { l:'putetis', r:'Ρήμα', g:'β΄ πληθ. υποτ. ενεστ. ενεργ. φωνής', d:'puto, putavi, putatum, putare (1) — νομίζω', note:'Εννοούμενο υποκείμενο: vos.' },
          { l:'ex arbore', k:'arbor', r:'Εμπρόθετος επιρρ. προσδ. της προέλευσης', to:'στο decerptam esse', g:'ex (πρόθ. + αφαιρ.) + arbore (αφαιρ. ενικ.)', d:'ex — από· arbor (& arbos), arboris (θηλ. γ΄) — το δέντρο', a:'.' }
        ]}
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια (παρενθετική)', note:'Κύρια παρενθετική πρόταση. Η χρονική πρόταση λειτουργεί ως επιρρ. προσδ. του χρόνου στο inquit.', kids:[
        { type:'sub', key:'xroniki', label:'Δευτ. χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο inquit. Εισάγεται με τον ιστορικό (ή διηγηματικό) cum· εκφέρεται με υποτακτική, γιατί ο ιστορικός cum υπογραμμίζει τη βαθύτερη σχέση κύριας–δευτ. (σχέση αιτίου–αιτιατού)· συγκεκριμένα υποτ. υπερσυντελίκου (dixissent), γιατί εξαρτάται από ιστορικό χρόνο (inquit) και δηλώνει το προτερόχρονο στο παρελθόν.', kids:[
          { l:'Cum', r:'Χρον. σύνδεσμος', g:'ιστορικός/διηγηματικός cum (+ υποτακτική)', d:'cum — όταν' },
          { l:'omnes', r:'Υποκείμενο', to:'στο dixissent', g:'ονομ. πληθ., αρσ. — επίθ. γ΄ κλ.', d:'omnis, omnis, omne — όλος', note:'Δε σχηματίζει παραθετικά.' },
          { l:'recentem', r:'Κατηγορούμενο', to:'στο εννοούμενο ficum (μέσω του esse)', g:'αιτ. ενικ., θηλ. — επίθ. γ΄ κλ.', d:'recens, recens, recens (recentis) — φρέσκος' },
          { l:'esse', r:'Ειδικό απαρέμφατο (αντικείμενο)', to:'στο dixissent', g:'απαρέμφατο ενεστώτα', d:'sum, fui, —, esse — είμαι, υπάρχω', note:'Εννοούμενο υποκ.: ficum (ετεροπροσωπία).' },
          { l:'dixissent', r:'Ρήμα', g:'γ΄ πληθ. υποτ. υπερσυντελίκου ενεργ. φωνής', d:'dico, dixi, dictum, dicere (3) — λέω', note:'β΄ ενικ. προστ. ενεστ.: dic.', a:',' }
        ]},
        { l:'inquit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. — ελλειπτικό ρήμα', d:'inquam — λέω', note:'Εννοούμενο υποκείμενο: Cato.' }
      ]}
    ]},

    { n: 5, kids: [
      { l:'Atqui', r:'Σύνδεσμος', g:'αντιθετικός σύνδεσμος', d:'atqui — κι όμως', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'ante tertium diem', k:'dies', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο decerptam esse', g:'ante (πρόθ. + αιτ.) + tertium (αιτ. ενικ., αρσ.) + diem (αιτ. ενικ.)', d:'ante — πριν· tertius, -a, -um — τρίτος· dies, diei (αρσ. ε΄) — η ημέρα', note:'Το tertium είναι επιθετικός προσδ. στο diem (τακτικό αριθμητικό, δεν έχει κλητική).' },
        { l:'scitote', r:'Ρήμα', g:'β΄ πληθ. προστ. ενεστ. ενεργ. φωνής', d:'scio, sci(v)i, scitum, scire (4) — γνωρίζω, ξέρω', note:'Εννοούμενο υποκ.: vos. Η προστ. ενεστ. έχει καταλήξεις μέλλοντα: scito, scitote.' },
        { l:'decerptam esse', r:'Ειδικό απαρέμφατο (αντικείμενο)', to:'στο scitote', g:'απαρέμφατο παρακειμένου παθ. φωνής', d:'decerpo, decerpsi, decerptum, decerpere (3) — κόβω', note:'Εννοούμενο υποκ.: ficum (ετεροπροσωπία).' },
        { l:'Carthagine', r:'Απρόθετη αφαιρετική (στάση σε τόπο)', to:'στο decerptam esse', g:'αφαιρ. ενικ.', d:'Carthago, Carthaginis (θηλ. γ΄) — η Καρχηδόνα (δεν έχει πληθ.)', a:'.' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση.', kids:[
        { l:'Tam', r:'Επιρρ. προσδ. του ποσού', to:'στο prope', g:'ποσοτικό επίρρημα', d:'tam — τόσο' },
        { l:'prope', r:'Επιρρ. προσδ. της στάσης σε τόπο', to:'στο habemus', g:'τοπικό επίρρημα', d:'prope — κοντά', note:'ΣΥΓΚΡ.: propius· ΥΠΕΡΘ.: proxime.' },
        { l:'a muris', k:'murus', r:'Εμπρόθετος επιρρ. προσδ. της τοπικής αφετηρίας', to:'στο prope', g:'a/ab (πρόθ. + αφαιρ.) + muris (αφαιρ. πληθ.)', d:'a (ab) — από· murus, muri (αρσ. β΄) — ο τοίχος, το τείχος (πιο εύχρηστο στον πληθ.: muri = τα τείχη)' },
        { l:'habemus', r:'Ρήμα', g:'α΄ πληθ. οριστ. ενεστ. ενεργ. φωνής', d:'habeo, habui, habitum, habere (2) — έχω', note:'Εννοούμενο υποκείμενο: nos.' },
        { l:'hostem', r:'Αντικείμενο', to:'στο habemus', g:'αιτ. ενικ.', d:'hostis, hostis (αρσ./θηλ. γ΄) — ο εχθρός (γεν. πληθ. hostium)', a:'!' }
      ]}
    ]},

    { n: 7, kids: [
      { l:'Itaque', r:'Σύνδεσμος', g:'συμπερασματικός σύνδεσμος', d:'itaque — επομένως, λοιπόν', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας.', kids:[
        { l:'cavete', r:'Ρήμα', g:'β΄ πληθ. προστ. ενεστ. ενεργ. φωνής', d:'caveo, cavi, cautum, cavere (2) — προσέχω, φυλάγομαι', note:'Εννοούμενο υποκείμενο: vos.' },
        { l:'periculum', r:'Αντικείμενο', to:'στο cavete', g:'αιτ. ενικ., ουδ.', d:'periculum, periculi (ουδ. β΄) — ο κίνδυνος', a:',' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας.', kids:[
        { l:'tutamini', r:'Ρήμα', g:'β΄ πληθ. προστ. ενεστ. — αποθετικό ρήμα', d:'tutor, tutatus sum, tutari (1, αποθ.) — προστατεύω', note:'Εννοούμενο υποκείμενο: vos.' },
        { l:'patriam', r:'Αντικείμενο', to:'στο tutamini', g:'αιτ. ενικ.', d:'patria, patriae (θηλ. α΄) — η πατρίδα', a:'.' }
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας.', kids:[
        { l:'Opibus', r:'Αφαιρετική του μέσου', to:'στο confidere', g:'αφαιρ. πληθ.', d:'opes, opum (θηλ. γ΄) — οι δυνάμεις', note:'Ελλειπτικό στον ενικ.: opis, opem, ope = βοήθεια (ετερόσημο).' },
        { l:'urbis', r:'Γενική κτητική', to:'στο opibus', g:'γεν. ενικ.', d:'urbs, urbis (θηλ. γ΄) — η πόλη (γεν. πληθ. urbium)' },
        { l:'nolite', r:'Ρήμα', g:'β΄ πληθ. προστ. ενεστ. ενεργ. — ανώμαλο', d:'nolo, nolui, —, nolle — δε θέλω', note:'Εννοούμενο υποκ.: vos (ταυτοπροσωπία με το confidere).' },
        { l:'confidere', r:'Τελικό απαρέμφατο (αντικείμενο)', to:'στο nolite', g:'απαρέμφατο ενεστώτα — ημιαποθετικό', d:'confido, confisus sum, confidere (3, ημιαποθ.) — εμπιστεύομαι', a:'.' }
      ]}
    ]},

    { n: 10, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας.', kids:[
        { l:'Fiduciam', r:'Αντικείμενο', to:'στο deponite', g:'αιτ. ενικ.', d:'fiducia, fiduciae (θηλ. α΄) — η εμπιστοσύνη, η αυτοπεποίθηση', note:'Ως αφηρημένη έννοια δεν είναι εύχρηστο στον πληθ.' },
        { l:'deponite', r:'Ρήμα', g:'β΄ πληθ. προστ. ενεστ. ενεργ. φωνής', d:'depono, deposui, depositum, deponere (3) — αποβάλλω', note:'Εννοούμενο υποκείμενο: vos.', a:',' },
        { type:'sub', key:'anaforiki', label:'Δευτ. αναφορική', note:'Δευτ. επιθετική αναφορική πρόταση, προσδιοριστική στο fiduciam. Εισάγεται με την αναφορική αντωνυμία quae· εκφέρεται με οριστική (δηλώνει το πραγματικό), και συγκεκριμένα οριστ. ενεστώτα (est), γιατί αναφέρεται στο παρόν· λειτουργεί ως επιθετικός προσδ. στο fiduciam.', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ., θηλ. — αναφορική αντωνυμία', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'nimia', r:'Κατηγορούμενο', to:'στο quae (μέσω του est)', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'nimius, nimia, nimium — υπερβολικός', note:'ΣΥΓΚΡ.: magis nimius· ΥΠΕΡΘ.: maxime nimius.' },
          { l:'vobis', r:'Δοτική προσωπική κτητική', to:'στο est', g:'δοτ. πληθ. — β΄ προσ. προσωπικής αντωνυμίας', d:'tu (πληθ. vos) — εσύ / εσείς' },
          { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, —, esse — είμαι, υπάρχω', a:'.' }
        ]}
      ]}
    ]},

    { n: 11, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας.', kids:[
        { l:'Neminem', r:'Υποκείμενο απαρεμφάτου', to:'στο consulturum esse (ετεροπροσωπία)', g:'αιτ. ενικ., αρσ. — αόριστη ουσιαστική αντωνυμία', d:'nemo, nemo — κανένας, καμία', note:'Σημασιολογικά ως ουδέτερο χρησιμοποιείται το nihil = τίποτα.' },
        { l:'credideritis', r:'Ρήμα', g:'β΄ πληθ. υποτ. παρακειμένου ενεργ. φωνής', d:'credo, credidi, creditum, credere (3) — πιστεύω', note:'Εννοούμενο υποκ.: vos. Απαγορευτική/αποτρεπτική υποτακτική.' },
        { l:'patriae', r:'Δοτική προσωπική χαριστική', to:'στο consulturum esse', g:'δοτ. ενικ.', d:'patria, patriae (θηλ. α΄) — η πατρίδα' },
        { l:'consulturum esse', r:'Ειδικό απαρέμφατο (αντικείμενο)', to:'στο credideritis', g:'απαρέμφατο μέλλοντα ενεργ. φωνής', d:'consulo, consului, consultum, consulere (3) — φροντίζω', a:',' },
        { type:'sub', key:'ypothetiki', label:'Δευτ. υποθετική', note:'Δευτ. επιρρηματική υποθετική πρόταση (υπόθεση). Εισάγεται με τον υποθετικό σύνδεσμο nisi, γιατί είναι αρνητική και η άρνηση αναφέρεται σε όλο το περιεχόμενο· εκφέρεται με υποτακτική πλαγίου λόγου (ο υποθετικός λόγος είναι εξαρτημένος), και συγκεκριμένα υποτ. παρακειμένου (consulueritis), γιατί εξαρτάται από αρκτικό χρόνο και δηλώνει το προτερόχρονο. Απόδοση: consulturum esse. Υποθετικός λόγος α΄ είδους: ανοικτή υπόθεση στο μέλλον.', kids:[
          { l:'nisi', r:'Υποθετικός σύνδεσμος', g:'υποθετικός σύνδεσμος (αρνητικός)', d:'nisi — αν δεν' },
          { l:'vos', r:'Υποκείμενο', to:'στο consulueritis', g:'ονομ. πληθ. — β΄ προσ. προσωπικής αντωνυμίας', d:'tu (πληθ. vos) — εσύ / εσείς' },
          { l:'ipsi', r:'Επιθετικός προσδ.', to:'στο vos', g:'ονομ. πληθ., αρσ. — δεικτική (ως οριστική) αντωνυμία', d:'ipse, ipsa, ipsum — ο ίδιος, η ίδια, το ίδιο' },
          { l:'patriae', r:'Δοτική προσωπική χαριστική', to:'στο consulueritis', g:'δοτ. ενικ.', d:'patria, patriae (θηλ. α΄) — η πατρίδα' },
          { l:'consulueritis', r:'Ρήμα', g:'β΄ πληθ. υποτ. παρακειμένου ενεργ. φωνής', d:'consulo, consului, consultum, consulere (3) — φροντίζω', a:'.' }
        ]}
      ]}
    ]},

    { n: 12, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας.', kids:[
        { l:'Mementote', r:'Ρήμα', g:'β΄ πληθ. προστ. μέλλοντα (με σημασία ενεστ.) — ελλειπτικό', d:'memini, meminisse — θυμάμαι', note:'Εννοούμενο υποκείμενο: vos.' },
        { l:'rem publicam', r:'Υποκείμενο απαρεμφάτου', to:'στο fuisse (ετεροπροσωπία)', g:'αιτ. ενικ. (res + publica)', d:'res publica — η πολιτεία', note:'Συνεκφορά· κλίνονται χωριστά και οι δύο όροι (res, rei + publicus, -a, -um). Γράφεται και ως μία λέξη: respublica.' },
        { l:'in extremo discrimine', k:'discrimen', r:'Εμπρόθετος επιρρ. προσδ. της κατάστασης', to:'στο fuisse', g:'in (πρόθ. + αφαιρ.) + extremo (αφαιρ. ενικ., ουδ.) + discrimine (αφαιρ. ενικ.)', d:'in — σε· extremus, -a, -um — έσχατος· discrimen, discriminis (ουδ. γ΄) — ο κίνδυνος', note:'extremus = υπερθετικός του exterus (ΣΥΓΚΡ. exterior)· το extremo είναι επιθετικός προσδ. στο discrimine.' },
        { l:'quondam', r:'Επιρρ. προσδ. του χρόνου', to:'στο fuisse', g:'χρονικό επίρρημα', d:'quondam — κάποτε' },
        { l:'fuisse', r:'Ειδικό απαρέμφατο (αντικείμενο)', to:'στο mementote', g:'απαρέμφατο παρακειμένου', d:'sum, fui, —, esse — είμαι, υπάρχω', a:'!' }
      ]}
    ]},

    { n: 13, kids: [
      { l:'-que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος — εγκλιτικός', d:'-que — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως· συνδέεται συμπλεκτικά με το εγκλιτικό -que.', kids:[
        { l:'Statim', r:'Επιρρ. προσδ. του χρόνου', to:'στο sumptum est', g:'χρονικό επίρρημα', d:'statim — αμέσως' },
        { l:'sumptum est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής', d:'sumo, sumpsi, sumptum, sumere (3) — εδώ: αρχίζω' },
        { l:'Punicum', r:'Επιθετικός προσδ.', to:'στο bellum', g:'ονομ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'Punicus, Punica, Punicum — ο Καρχηδονιακός' },
        { l:'bellum', r:'Υποκείμενο', to:'στο sumptum est', g:'ονομ. ενικ., ουδ.', d:'bellum, belli (ουδ. β΄) — ο πόλεμος' },
        { l:'tertium', r:'Επιθετικός προσδ.', to:'στο Punicum bellum', g:'ονομ. ενικ., ουδ. — τακτικό αριθμητικό β΄ κλ.', d:'tertius, tertia, tertium — τρίτος', note:'Δε σχηματίζει κλητική.', a:',' },
        { type:'sub', key:'anaforiki', label:'Δευτ. αναφορική', note:'Δευτ. επιθετική αναφορική πρόταση, προσδιοριστική στο bellum. Εισάγεται με την αναφορική αντωνυμία quo· εκφέρεται με οριστική (δηλώνει το πραγματικό), και συγκεκριμένα οριστ. παρακειμένου (deleta est), γιατί αναφέρεται στο παρελθόν· λειτουργεί ως επιθετικός προσδ. στο bellum.', kids:[
          { l:'quo', r:'Αφαιρετική του χρόνου', to:'στο deleta est', g:'αφαιρ. ενικ., ουδ. — αναφορική αντωνυμία', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'Carthago', r:'Υποκείμενο', to:'στο deleta est', g:'ονομ. ενικ.', d:'Carthago, Carthaginis (θηλ. γ΄) — η Καρχηδόνα (δεν έχει πληθ.)' },
          { l:'deleta est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής', d:'deleo, delevi, deletum, delere (2) — καταστρέφω', a:'.' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Cato attulit quodam die", el:"Ο Κάτων έφερε κάποια μέρα" },
    { la:"in curiam", el:"στο Βουλευτήριο" },
    { la:"ficum praecocem", el:"(ένα) πρώιμο σύκο" },
    { la:"ex Carthagine", el:"από την Καρχηδόνα" },
    { la:"ostendensque", el:"και, αφού το έδειξε" },
    { la:"patribus", el:"στους Συγκλητικούς," },
    { la:"inquit «Interrogo vos", el:"είπε: «Σας ρωτώ" },
    { la:"quando putetis decerptam esse", el:"πότε νομίζετε ότι κόπηκε" },
    { la:"hanc ficum ex arbore».", el:"αυτό το σύκο από το δέντρο»." },
    { la:"Cum omnes dixissent", el:"Όταν όλοι είπαν" },
    { la:"esse recentem, inquit", el:"ότι ήταν φρέσκο, είπε:" },
    { la:"«Atqui scitote", el:"«Κι όμως, να ξέρετε" },
    { la:"decerptam esse Carthagine", el:"ότι κόπηκε στην Καρχηδόνα" },
    { la:"ante tertium diem.", el:"πριν από τρεις μέρες." },
    { la:"Tam prope a muris", el:"Τόσο κοντά στα τείχη" },
    { la:"habemus hostem!", el:"έχουμε τον εχθρό!" },
    { la:"Itaque cavete", el:"Επομένως φυλαχτείτε" },
    { la:"periculum,", el:"από τον κίνδυνο," },
    { la:"tutamini patriam.", el:"προστατέψτε την πατρίδα." },
    { la:"Nolite confidere", el:"Μην έχετε εμπιστοσύνη" },
    { la:"opibus urbis.", el:"στις δυνάμεις της πόλης." },
    { la:"Deponite fiduciam,", el:"Αποβάλετε την αυτοπεποίθηση," },
    { la:"quae est nimia vobis.", el:"που είναι υπερβολική σε εσάς." },
    { la:"Neminem credideritis", el:"Κανείς να μην πιστέψετε" },
    { la:"consulturum esse patriae,", el:"ότι θα φροντίσει για την πατρίδα," },
    { la:"nisi vos ipsi", el:"εάν εσείς οι ίδιοι" },
    { la:"consulueritis patriae.", el:"δε φροντίσετε για την πατρίδα." },
    { la:"Mementote rem publicam fuisse", el:"Να θυμάστε ότι η πολιτεία βρέθηκε" },
    { la:"quondam in extremo discrimine!»", el:"κάποτε σε έσχατο κίνδυνο!»" },
    { la:"Statimque sumptum est", el:"Κι αμέσως άρχισε" },
    { la:"Punicum bellum tertium,", el:"ο τρίτος Καρχηδονιακός πόλεμος," },
    { la:"quo", el:"κατά τη διάρκεια του οποίου" },
    { la:"deleta est Carthago.", el:"καταστράφηκε η Καρχηδόνα." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"curia, -ae" },
        { form:"fiducia, -ae", note:"δεν έχει πληθ." },
        { form:"patria, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"murus, -i" } ] },
      { gender:"Θηλυκά", items:[ { form:"ficus, -i", note:"και δ΄ κλ. (ficus, -us)" } ] },
      { gender:"Ουδέτερα", items:[
        { form:"bellum, -i" },
        { form:"periculum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Cato, Catonis" },
        { form:"hostis, hostis" },
        { form:"pater, patris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"arbor, arboris" },
        { form:"Carthago, Carthaginis", note:"δεν έχει πληθ." },
        { form:"opes, opum", note:"ετερόσημο" },
        { form:"urbs, urbis" }
      ]},
      { gender:"Ουδέτερα", items:[ { form:"discrimen, discriminis" } ] }
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[ { form:"ficus, -us", note:"και β΄ κλ. (ficus, -i)" } ] }
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"dies, diei" } ] },
      { gender:"Θηλυκά", items:[ { form:"res, rei" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"exterus, -a, -um" },
      { form:"nimius, -a, -um" },
      { form:"publicus, -a, -um" },
      { form:"Punicus, -a, -um" },
      { form:"tertius, -a, -um", note:"τακτικό αριθμητικό" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"omnis, -is, -e" },
      { form:"praecox, praecox, praecox (praecocis)" },
      { form:"recens, recens, recens (recentis)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"exterus, -a, -um", comp:"exterior, -ior, -ius", sup:"extremus, -a, -um & extimus, -a, -um" },
      { pos:"nimius, -a, -um", comp:"magis nimius, -a, -um", sup:"maxime nimius, -a, -um" },
      { pos:"publicus, -a, -um", comp:"—", sup:"—" },
      { pos:"Punicus, -a, -um", comp:"—", sup:"—" },
      { pos:"tertius, -a, -um", comp:"—", sup:"—", note:"τακτικό αριθμητικό" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"omnis, -is, -e", comp:"—", sup:"—", note:"δε σχηματίζει παραθετικά" },
      { pos:"praecox, -cis", comp:"praecocior, -ior, -ius", sup:"praecocissimus, -a, -um" },
      { pos:"recens, -entis", comp:"recentior, -ior, -ius", sup:"recentissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"hic, haec, hoc", kind:"Δεικτική" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική", extra:"ως οριστική" },
    { form:"nemo", kind:"Αόριστη ουσιαστική" },
    { form:"qui, quae, quod", kind:"Αναφορική" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη επιθετική" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσ. (πληθ. vos)" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"interrogo", perf:"interrogavi", sup:"interrogatum", inf:"interrogare", note:"" },
      { pres:"puto", perf:"putavi", sup:"putatum", inf:"putare", note:"" },
      { pres:"tutor", perf:"tutatus sum", sup:"—", inf:"tutari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"caveo", perf:"cavi", sup:"cautum", inf:"cavere", note:"" },
      { pres:"deleo", perf:"delevi", sup:"deletum", inf:"delere", note:"" },
      { pres:"habeo", perf:"habui", sup:"habitum", inf:"habere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"consulo", perf:"consului", sup:"consultum", inf:"consulere", note:"" },
      { pres:"credo", perf:"credidi", sup:"creditum", inf:"credere", note:"" },
      { pres:"decerpo", perf:"decerpsi", sup:"decerptum", inf:"decerpere", note:"" },
      { pres:"depono", perf:"deposui", sup:"depositum", inf:"deponere", note:"" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"β΄ ενικ. προστ.: dic" },
      { pres:"ostendo", perf:"ostendi", sup:"ostentum / ostensum", inf:"ostendere", note:"" },
      { pres:"sumo", perf:"sumpsi", sup:"sumptum", inf:"sumere", note:"εδώ: αρχίζω" },
      { pres:"confido", perf:"confisus sum", sup:"—", inf:"confidere", note:"ημιαποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"scio", perf:"sci(v)i", sup:"scitum", inf:"scire", note:"προστ. ενεστ.: scito, scitote" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ / ΕΛΛΕΙΠΤΙΚΑ", rows:[
      { pres:"affero", perf:"attuli", sup:"allatum", inf:"afferre", note:"ανώμαλο· προστ. affer" },
      { pres:"nolo", perf:"nolui", sup:"—", inf:"nolle", note:"ανώμαλο" },
      { pres:"inquam", perf:"—", sup:"—", inf:"—", note:"ελλειπτικό" },
      { pres:"memini", perf:"—", sup:"—", inf:"meminisse", note:"ελλειπτικό (προστ. μέλλ. mementote)" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ / ΠΑΓΙΔΕΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"Ιστορικός/διηγηματικός cum", body:"Το «Cum omnes recentem esse dixissent» εισάγεται με τον ιστορικό/διηγηματικό cum, που χρησιμοποιείται σε διηγήσεις του παρελθόντος και εκφέρεται πάντα με υποτακτική (εδώ υπερσυντελίκου = προτερόχρονο)." },
    { tag:"Ουσιαστικό", title:"ficus: διπλή κλίση", body:"Το ficus κλίνεται κατά τη β΄ κλ. (ficus, fici — θηλ.) και επιπλέον παίρνει από τη δ΄ κλ. (ficus, ficus) όσους τύπους λήγουν σε -us και -u." },
    { tag:"Προστακτική", title:"scitote / mementote", body:"Οι scitote (scio) και mementote (memini) είναι προστακτικές με καταλήξεις μέλλοντα· το mementote (προστ. μέλλ.) έχει σημασία ενεστώτα («να θυμάστε»)." },
    { tag:"Σύνταξη", title:"rem publicam: συνεκφορά", body:"Το «rem publicam» (= η πολιτεία) είναι συνεκφορά· κλίνονται χωριστά και οι δύο όροι (res, rei + publicus, -a, -um). Γράφεται και ως μία λέξη: respublica." },
    { tag:"Σύνδεσμος", title:"nisi (όχι si non)", body:"Το nisi εισάγει αρνητικές υποθετικές προτάσεις όπου η άρνηση αφορά όλο το περιεχόμενο· το si non αρνείται μόνο έναν όρο. Εδώ σχηματίζεται εξαρτημένος υποθετικός λόγος α΄ είδους (ανοικτή υπόθεση στο μέλλον)." },
    { tag:"Αντωνυμία", title:"neminem: nemo / nihil", body:"Το neminem (nemo) καλύπτει το αρσ./θηλ. («κανένας/καμία»)· ως ουδέτερο («τίποτα») χρησιμοποιείται η αντωνυμία nihil." }
  ]
};

export default UNIT;
