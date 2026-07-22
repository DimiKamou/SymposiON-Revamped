export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 29,
  title: "Ο Οκταβιανός, ο παπουτσής και το κοράκι",
  latinTitle: "Lectio XXIX",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρηματικός προσδ. του χρόνου στο occurrit της κύριας. Εισάγεται με τον ιστορικό - διηγηματικό σύνδεσμο cum και εκφέρεται με υποτακτική (rediret), γιατί ο cum υπογραμμίζει τη βαθύτερη σχέση αιτίου - αιτιατού· δηλώνει το σύγχρονο στο παρελθόν. Ισχύει η ακολουθία των χρόνων.', kids:[
        { l:'Cum', r:'Σύνδεσμος', g:'χρονικός ιστορικός - διηγηματικός σύνδεσμος', d:'cum — όταν' },
        { l:'Octavianus', r:'Υποκείμενο', to:'στο rediret', g:'ονομ. ενικ., αρσ. β΄ κλ.', d:'Octavianus, -i (αρσ. β΄) — ο Οκταβιανός' },
        { l:'post victoriam', k:'victoria', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο rediret', g:'post (πρόθ. + αιτ.) + victoriam (αιτ. ενικ., θηλ.)', d:'post — μετά· victoria, -ae (θηλ. α΄) — η νίκη' },
        { l:'Actiacam', r:'Επιθετικός προσδ.', to:'στο victoriam', g:'αιτ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'Actiacus, -a, -um — ο του Ακτίου, Ακτιακός', note:'Δεν σχηματίζει παραθετικά, γιατί φανερώνει καταγωγή.' },
        { l:'Romam', r:'Απρόθετη αιτιατική της κίνησης σε τόπο', to:'στο rediret', g:'αιτ. ενικ., θηλ. α΄ κλ.', d:'Roma, -ae (θηλ. α΄) — η Ρώμη', note:'Ως όνομα πόλης τίθεται σε απρόθετη μορφή· δεν σχηματίζει πληθ.' },
        { l:'rediret', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατατικού ενεργ. — ανώμαλο σύνθετο του eo', d:'redeo, redii (redivi), reditum, redire (red + eo) — επιστρέφω', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης.', kids:[
        { l:'homo', r:'Υποκείμενο', to:'στο occurrit', g:'ονομ. ενικ., αρσ. (εδώ) γ΄ κλ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
        { l:'quidam', r:'Επιθετικός προσδ.', to:'στο homo', g:'ονομ. ενικ., αρσ. — αόριστη επιθετική αντων.', d:'quidam, quaedam, quoddam — κάποιος, -α, -ο' },
        { l:'ei', r:'Αντικείμενο', to:'στο occurrit (occurro + δοτ.)', g:'δοτ. ενικ., αρσ. — δεικτική ως επαναληπτική αντων.', d:'is, ea, id — αυτός, -ή, -ό (ei = Octaviano)' },
        { l:'occurrit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. (+ δοτ.)', d:'occurro, occurri / occucurri, occursum, occurrere (3) — πηγαίνω να συναντήσω' },
        { l:'corvum', r:'Αντικείμενο', to:'στη μετοχή tenens', g:'αιτ. ενικ., αρσ. β΄ κλ.', d:'corvus, -i (αρσ. β΄) — ο κόρακας' },
        { l:'tenens', r:'Επιρρ. τροπική μετοχή (συνημμένη στο homo)', to:'στο occurrit (σύγχρονο)', g:'ονομ. ενικ., αρσ. — μτχ. ενεργ. ενεστ. (τριτόκλιτη μονοκατάληκτη, tenens, tenentis)', d:'teneo, tenui, tentum, tenere (2) — κρατώ', a:';' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης. Εννοούμενο υποκείμενο: homo.', kids:[
        { l:'eum', r:'Άμεσο αντικείμενο', to:'στο instituerat (και υποκ. στο dicere — ετεροπροσωπία)', g:'αιτ. ενικ., αρσ. — δεικτική ως επαναληπτική αντων.', d:'is, ea, id — αυτός, -ή, -ό (eum = corvum)' },
        { l:'instituerat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσυντελίκου ενεργ.', d:'instituo, institui, institutum, instituere (3) (+ αιτ. και απαρ.) — διδάσκω κάποιον κάτι' },
        { l:'haec', r:'(Σύστοιχο) αντικείμενο', to:'στο απαρέμφατο dicere', g:'αιτ. πληθ., ουδ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, -ή, -ό' },
        { l:'dicere', r:'Τελικό απαρέμφατο (έμμεσο αντικείμενο)', to:'στο instituerat', g:'απαρέμφατο ενεστ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέγω', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας, εκφερόμενη με προστακτική.', kids:[
        { l:'Ave', r:'Ρήμα', g:'β΄ ενικ. προστακτικής ενεστ. του ελλειπτικού ρήματος ave', d:'ave — χαίρε', a:',', note:'Ελλειπτικό ρήμα· εννοούμενο υποκ. (tu).' },
        { l:'Caesar', r:'Κλητική προσφώνηση', g:'κλητ. ενικ., αρσ. γ΄ κλ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας', a:',' },
        { l:'victor', r:'Παράθεση', to:'στο Caesar', g:'κλητ. ενικ., αρσ. γ΄ κλ.', d:'victor, victoris (αρσ. γ΄) — ο νικητής' },
        { l:'imperator', r:'Επιθετικός προσδ.', to:'στο victor (ουσιαστικό που δηλώνει αξίωμα)', g:'κλητ. ενικ., αρσ. γ΄ κλ.', d:'imperator, imperatoris (αρσ. γ΄) — ο στρατηγός', a:'.', note:'Κατά το σχολικό βιβλίο. Αν το victor θεωρηθεί επίθετο: imperator = παράθεση στο Caesar, victor = επιθετικός προσδ. στο imperator.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης (απρόσωπη σύνταξη). Εννοούμενο υποκ. του emere: (Caesarem).', kids:[
        { l:'Caesaris', r:'Γενική που δηλώνει το ενδιαφερόμενο πρόσωπο', to:'στο interfuit', g:'γεν. ενικ., αρσ. γ΄ κλ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας' },
        { l:'multum', r:'Επιρρ. προσδ. του ποσού', to:'στο interfuit', g:'ποσοτικό επίρρημα', d:'multum — πολύ' },
        { l:'interfuit', r:'Ρήμα (απρόσωπο)', g:'γ΄ ενικ. οριστ. παρακειμένου του απρόσωπου - σύνθετου του sum', d:'interest, interfuit, —, interesse (inter + sum) — ενδιαφέρει· interest + γεν. προσώπου και απαρέμφατο = με ενδιαφέρει να κάνω κάτι', note:'interest + γενική (ενδιαφερόμενο πρόσωπο) + απαρέμφατο.' },
        { l:'corvum', r:'Αντικείμενο', to:'στο απαρέμφατο emere', g:'αιτ. ενικ., αρσ. β΄ κλ.', d:'corvus, -i (αρσ. β΄) — ο κόρακας' },
        { l:'emere', r:'Τελικό απαρέμφατο (υποκείμενο)', to:'στο απρόσωπο interfuit', g:'απαρέμφατο ενεστ. ενεργ.', d:'emo, emi, emptum, emere (3) — αγοράζω', a:';' }
      ]}
    ]},

    { n: 4, kids: [
      { l:'itaque', r:'Σύνδεσμος', g:'παρατακτικός συμπερασματικός σύνδεσμος', d:'itaque — λοιπόν, επομένως', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης. Εννοούμενο υποκείμενο: (Caesar).', kids:[
        { l:'viginti', r:'Επιθετικός προσδ.', to:'στο milibus', g:'απόλυτο αριθμητικό, άκλιτο', d:'viginti — είκοσι' },
        { l:'milibus', r:'Αφαιρετική της αξίας', to:'στο emit', g:'αφαιρ. πληθ., ουδ. — απόλυτο αριθμητικό (πληθ. του άκλιτου mille)', d:'milia, -ium (ουδ.) — χιλιάδες', note:'Χρησιμοποιείται αφαιρετική, γιατί δηλώνεται συγκεκριμένη αξία (viginti milibus sestertium).' },
        { l:'sestertium', r:'Γενική διαιρετική', to:'στο milibus', g:'γεν. πληθ. (σε -um αντί -orum), αρσ. β΄ κλ.', d:'sestertius, -ii (αρσ. β΄) — ο σηστέρτιος (νόμισμα)' },
        { l:'eum', r:'Αντικείμενο', to:'στο emit', g:'αιτ. ενικ., αρσ. — δεικτική ως επαναληπτική αντων.', d:'is, ea, id — αυτός, -ή, -ό (eum = corvum)' },
        { l:'emit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'emo, emi, emptum, emere (3) — αγοράζω', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης.', kids:[
        { l:'Id', r:'Επιθετικός προσδ.', to:'στο exemplum', g:'ονομ. ενικ., ουδ. — δεικτική ως οριστική αντων.', d:'is, ea, id — αυτός, -ή, -ό' },
        { l:'exemplum', r:'Υποκείμενο', to:'στο incitavit', g:'ονομ. ενικ., ουδ. β΄ κλ.', d:'exemplum, -i (ουδ. β΄) — το παράδειγμα' },
        { l:'sutorem', r:'Άμεσο αντικείμενο', to:'στο incitavit', g:'αιτ. ενικ., αρσ. γ΄ κλ.', d:'sutor, sutoris (αρσ. γ΄) — ο παπουτσής' },
        { l:'quendam', r:'Επιθετικός προσδ.', to:'στο sutorem', g:'αιτ. ενικ., αρσ. — αόριστη επιθετική αντων.', d:'quidam, quaedam, quoddam — κάποιος, -α, -ο' },
        { l:'incitavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'incito, incitavi, incitatum, incitare (1) — παρακινώ· incito + αιτ. + βουλητική πρόταση = παρακινώ κάποιον να...', a:',' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ονοματική βουλητική πρόταση, ως έμμεσο αντικείμενο στο incitavit της κύριας. Εισάγεται με τον βουλητικό σύνδεσμο ut, γιατί είναι καταφατική, και εκφέρεται με υποτακτική (doceret), γιατί το περιεχόμενό της είναι απλώς επιθυμητό· χρόνου παρατατικού, γιατί εξαρτάται από ιστορικό χρόνο (incitavit). Ιδιομορφία στην ακολουθία (συγχρονισμός).', kids:[
          { l:'ut', r:'Σύνδεσμος', g:'υποτακτικός βουλητικός σύνδεσμος', d:'ut — να' },
          { l:'corvum', r:'Άμεσο αντικείμενο', to:'στο doceret', g:'αιτ. ενικ., αρσ. β΄ κλ.', d:'corvus, -i (αρσ. β΄) — ο κόρακας' },
          { l:'doceret', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατατικού ενεργ.', d:'doceo, docui, doctum, docere (2) — διδάσκω', note:'Εννοούμενο υποκείμενο: (sutor).' },
          { l:'parem', r:'Κατηγορηματικός προσδ.', to:'στο salutationem', g:'αιτ. ενικ., θηλ. — επίθ. γ΄ κλ. μονοκατάληκτο τριγενές (par, par, par)', d:'par, par, par (γεν. paris) — όμοιος, ίδιος', note:'Δεν σχηματίζει παραθετικά, γιατί δηλώνει κάτι απόλυτο.' },
          { l:'salutationem', r:'Έμμεσο αντικείμενο', to:'στο doceret', g:'αιτ. ενικ., θηλ. γ΄ κλ.', d:'salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός', a:'.' }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης. Εννοούμενο υποκείμενο: (sutor).', kids:[
        { l:'Diu', r:'Επιρρ. προσδ. του χρόνου', to:'στο impendebat', g:'χρονικό επίρρημα', d:'diu — για πολύ καιρό' },
        { l:'operam', r:'Αντικείμενο', to:'στο impendebat', g:'αιτ. ενικ., θηλ. α΄ κλ.', d:'opera, -ae (θηλ. α΄) — ο κόπος, η εργασία', note:'Ετερόσημο: στον πληθ. operae, -arum = οι μισθωτοί εργάτες.' },
        { l:'frustra', r:'Επιρρ. προσδ. του τρόπου', to:'στο impendebat', g:'τροπικό επίρρημα', d:'frustra — μάταια' },
        { l:'impendebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ.', d:'impendo, impendi, impensum, impendere (3) (in + pendo) — ξοδεύω· operam impendo = κοπιάζω μάταια', a:';' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρηματικός προσδ. του χρόνου στο solebat της κύριας. Εισάγεται με τον χρονικό επαναληπτικό σύνδεσμο quotiescumque (ισοδύναμο του επαναληπτικού cum) και εκφέρεται με οριστική (non respondebat), γιατί η πράξη μάς ενδιαφέρει από καθαρά χρονική άποψη· χρόνου παρατατικού, γιατί εξαρτάται από ιστορικό χρόνο (solebat) και εκφράζει την αόριστη επανάληψη στο παρελθόν.', kids:[
        { l:'quotiescumque', r:'Σύνδεσμος', g:'χρονικός επαναληπτικός σύνδεσμος', d:'quotiescumque — όσες φορές, κάθε φορά που' },
        { l:'avis', r:'Υποκείμενο', to:'στο respondebat', g:'ονομ. ενικ., θηλ. γ΄ κλ.', d:'avis, avis (θηλ. γ΄) — το πουλί' },
        { l:'non', r:'Αρνητικό μόριο', to:'στο respondebat', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
        { l:'respondebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ.', d:'respondeo, respondi, responsum, respondere (2) — απαντώ', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης.', kids:[
        { l:'sutor', r:'Υποκείμενο', to:'στο solebat (και στο dicere — ταυτοπροσωπία)', g:'ονομ. ενικ., αρσ. γ΄ κλ.', d:'sutor, sutoris (αρσ. γ΄) — ο παπουτσής' },
        { l:'dicere', r:'Τελικό απαρέμφατο (αντικείμενο)', to:'στο solebat', g:'απαρέμφατο ενεστ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέγω' },
        { l:'solebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού — ημιαποθετικό', d:'soleo, solitus sum, (solitum), solere (2, ημιαποθετικό) — συνηθίζω' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (ευθύς λόγος)', note:'Κύρια πρόταση κρίσης (τα λόγια του παπουτσή). Εννοούμενο υποκείμενο: (ego).', kids:[
        { l:'Oleum', r:'Αντικείμενο', to:'στο perdidi', g:'αιτ. ενικ., ουδ. β΄ κλ.', d:'oleum, -i (ουδ. β΄) — το λάδι', note:'Εύχρηστο μόνο στον ενικό.' },
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός καταφατικός σύνδεσμος', d:'et — και' },
        { l:'operam', r:'Αντικείμενο', to:'στο perdidi', g:'αιτ. ενικ., θηλ. α΄ κλ.', d:'opera, -ae (θηλ. α΄) — ο κόπος, η εργασία' },
        { l:'perdidi', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'perdo, perdidi, perditum, perdere (3) — χάνω· oleum et operam perdidi = κρίμα στον κόπο μου', a:'.' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης.', kids:[
        { l:'Tandem', r:'Επιρρ. προσδ. του χρόνου', to:'στο didicit', g:'χρονικό επίρρημα', d:'tandem — επιτέλους' },
        { l:'corvus', r:'Υποκείμενο', to:'στο didicit', g:'ονομ. ενικ., αρσ. β΄ κλ.', d:'corvus, -i (αρσ. β΄) — ο κόρακας' },
        { l:'salutationem', r:'Αντικείμενο', to:'στο didicit', g:'αιτ. ενικ., θηλ. γ΄ κλ.', d:'salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός' },
        { l:'didicit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'disco, didici, —, discere (3) — μαθαίνω' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός καταφατικός σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης, συνδεόμενη με την προηγούμενη κύρια παρατακτικά συμπλεκτικά (et).', kids:[
        { l:'sutor', r:'Υποκείμενο', to:'στο attulit', g:'ονομ. ενικ., αρσ. γ΄ κλ.', d:'sutor, sutoris (αρσ. γ΄) — ο παπουτσής', a:',' },
        { l:'cupidus', r:'Επιρρ. κατηγορούμενο του τρόπου', to:'από το attulit στο υποκ. sutor', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'cupidus, -a, -um — αυτός που επιθυμεί (cupidus + γενική)', note:'Κατά μία άλλη εκδοχή: επιρρ. κατηγορούμενο της αιτίας (επιθυμώντας = επειδή επιθυμούσε).' },
        { l:'pecuniae', r:'Γενική αντικειμενική (ως συμπλήρωμα)', to:'στο cupidus', g:'γεν. ενικ., θηλ. α΄ κλ.', d:'pecunia, -ae (θηλ. α΄) — τα χρήματα', a:',', note:'Ως περιληπτικό όνομα δεν σχηματίζει πληθ.' },
        { l:'eum', r:'Άμεσο αντικείμενο', to:'στο attulit', g:'αιτ. ενικ., αρσ. — δεικτική ως επαναληπτική αντων.', d:'is, ea, id — αυτός, -ή, -ό (eum = corvum)' },
        { l:'Caesari', r:'Έμμεσο αντικείμενο', to:'στο attulit', g:'δοτ. ενικ., αρσ. γ΄ κλ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας' },
        { l:'attulit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. — ανώμαλο σύνθετο του fero', d:'affero / adfero, attuli, allatum, afferre / adferre (ad + fero) — φέρνω· affero + αιτ. + δοτ. = φέρνω κάτι σε κάποιον', a:'.' }
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης.', kids:[
        { l:'Audita', r:'Επιρρ. χρονική μετοχή (νόθη αφαιρετική απόλυτη)', to:'στο dixit (προτερόχρονο)', g:'αφαιρ. ενικ., θηλ. — μτχ. παθ. παρακειμένου β΄ κλ.', d:'audio, audivi (audii), auditum, audire (4) — ακούω' },
        { l:'salutatione', r:'Υποκείμενο της μετοχής Audita', to:'νόθη αφαιρ. απόλυτη', g:'αφαιρ. ενικ., θηλ. γ΄ κλ.', d:'salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός', note:'Νόθη αφαιρετική απόλυτη· εννοείται εμπρόθετο (ως έμψυχο) ποιητικό αίτιο (a Caesare) στη μετοχή Audita.' },
        { l:'Caesar', r:'Υποκείμενο', to:'στο dixit', g:'ονομ. ενικ., αρσ. γ΄ κλ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας' },
        { l:'dixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέγω', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (ευθύς λόγος)', note:'Κύρια πρόταση κρίσης (τα λόγια του Καίσαρα). Εννοούμενο υποκείμενο: (ego).', kids:[
        { l:'Domi', r:'Επιρρ. προσδ. που δηλώνει στάση σε τόπο', to:'στο audio', g:'γεν. ενικ. (με επιρρ. σημασία), θηλ. δ΄ κλ.', d:'domus, -us (θηλ. δ΄) — το σπίτι· domi = στο σπίτι' },
        { l:'satis', r:'Επιρρ. προσδ. του ποσού', to:'στο audio', g:'ποσοτικό επίρρημα', d:'satis — αρκετά· satis salutationum = αρκετούς χαιρετισμούς' },
        { l:'salutationum', r:'Γενική διαιρετική', to:'στο satis', g:'γεν. πληθ., θηλ. γ΄ κλ.', d:'salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός' },
        { l:'talium', r:'Επιθετικός προσδ.', to:'στο salutationum', g:'γεν. πληθ., θηλ. — δεικτική αντων.', d:'talis, talis, tale — τέτοιος, -α, -ο' },
        { l:'audio', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ.', d:'audio, audivi (audii), auditum, audire (4) — ακούω', a:'.' }
      ]}
    ]},

    { n: 10, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης· περιέχει την απρόσωπη έκφραση venit in mentem (+ γενική). Εννοούμενο σύστοιχο υποκείμενο: (memoria).', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στην έκφραση venit in mentem', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'venit', r:'Ρήμα (απρόσωπη έκφραση)', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'venio, veni, ventum, venire (4) — έρχομαι· venit mihi in mentem (+ γεν.) = μου έρχεται στον νου κάτι, θυμάμαι' },
        { l:'corvo', r:'Δοτική προσωπική', to:'στην έκφραση venit in mentem', g:'δοτ. ενικ., αρσ. β΄ κλ.', d:'corvus, -i (αρσ. β΄) — ο κόρακας' },
        { l:'in mentem', k:'mens', r:'Εμπρόθετος προσδ. της εισόδου σε κατάσταση (μεταφ. κίνηση σε τόπο)', to:'στο venit', g:'in (πρόθ. + αιτ.) + mentem (αιτ. ενικ., θηλ.)', d:'in — σε· mens, mentis (θηλ. γ΄) — ο νους' },
        { l:'verborum', r:'Γενική ως αντικείμενο (στην έκφραση μνήμης)', to:'στο venit in mentem', g:'γεν. πληθ., ουδ. β΄ κλ.', d:'verbum, -i (ουδ. β΄) — ο λόγος' },
        { l:'domini', r:'Γενική υποκειμενική', to:'στο verborum', g:'γεν. ενικ., αρσ. β΄ κλ.', d:'dominus, -i (αρσ. β΄) — το αφεντικό, ο κύριος' },
        { l:'sui', r:'Επιθετικός προσδ.', to:'στο domini (άμεση / ευθεία αυτοπάθεια — αναφέρεται στο corvo)', g:'γεν. ενικ., αρσ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)', d:'suus, sua, suum — δικός, -ή, -ό του', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (ευθύς λόγος)', note:'Κύρια πρόταση κρίσης (τα λόγια του αφεντικού). Εννοούμενο υποκείμενο: (ego).', kids:[
        { l:'Oleum', r:'Αντικείμενο', to:'στο perdidi', g:'αιτ. ενικ., ουδ. β΄ κλ.', d:'oleum, -i (ουδ. β΄) — το λάδι' },
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός καταφατικός σύνδεσμος', d:'et — και' },
        { l:'operam', r:'Αντικείμενο', to:'στο perdidi', g:'αιτ. ενικ., θηλ. α΄ κλ.', d:'opera, -ae (θηλ. α΄) — ο κόπος, η εργασία' },
        { l:'perdidi', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'perdo, perdidi, perditum, perdere (3) — χάνω', a:'.' }
      ]}
    ]},

    { n: 11, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης.', kids:[
        { l:'Ad', r:'Πρόθεση', to:'σχηματίζει εμπρόθ. προσδ. αναφοράς στο risit', g:'πρόθεση + αιτιατική', d:'ad — σε, προς' },
        { l:'haec', r:'Επιθετικός προσδ.', to:'στο verba', g:'αιτ. πληθ., ουδ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, -ή, -ό' },
        { l:'verba', r:'Εμπρόθετος προσδ. της αναφοράς (ή της αιτίας / εξωτ. αναγκαστικού αιτίου)', to:'στο risit', g:'αιτ. πληθ., ουδ. β΄ κλ.', d:'verbum, -i (ουδ. β΄) — ο λόγος' },
        { l:'Augustus', r:'Υποκείμενο', to:'στο risit', g:'ονομ. ενικ., αρσ. β΄ κλ.', d:'Augustus, -i (αρσ. β΄) — ο Αύγουστος' },
        { l:'risit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'rideo, risi, risum, ridere (2) — γελώ' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης, συνδεόμενη με την προηγούμενη κύρια παρατακτικά συμπλεκτικά (-que). Εννοούμενο υποκείμενο: (Augustus).', kids:[
        { l:'emit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'emo, emi, emptum, emere (3) — αγοράζω' },
        { l:'-que', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (εγκλιτικός) σύνδεσμος', d:'-que — και' },
        { l:'avem', r:'Αντικείμενο', to:'στο emit', g:'αιτ. ενικ., θηλ. γ΄ κλ.', d:'avis, avis (θηλ. γ΄) — το πουλί' },
        { l:'tanti', r:'Γενική της αξίας (αφηρημένη)', to:'στο emit', g:'γεν. ενικ., ουδ. — δεικτική αντων.', d:'tantus, tanta, tantum — τόσος, -η, -ο· tanti ... quanti = τόσο ... όσο', a:',' },
        { type:'sub', key:'paravoliki', label:'Παραβολική', note:'Δευτ. επιρρηματική απλή παραβολική πρόταση που εκφράζει ποσότητα. Λειτουργεί ως β΄ όρος σύγκρισης με α΄ όρο την κύρια «emitque avem tanti». Εισάγεται με την αναφορική αντων. quanti (στην κύρια η δεικτική tanti — παραβολικό ζεύγος tanti ... quanti). Εκφέρεται με οριστική (emerat), γιατί η σύγκριση αφορά αντικειμενική πραγματικότητα· χρόνου υπερσυντελίκου.', kids:[
          { l:'quanti', r:'Γενική της αξίας (αφηρημένη)', to:'στο emerat', g:'γεν. ενικ., ουδ. — αναφορική αντων.', d:'quantus, quanta, quantum — όσος, -η, -ο' },
          { l:'nullam', r:'Αντικείμενο', to:'στο emerat', g:'αιτ. ενικ., θηλ. — αόριστη αντων. / αντωνυμικό επίθ.', d:'nullus, nulla, nullum — κανένας, καμία, κανένα' },
          { l:'adhuc', r:'Επιρρ. προσδ. του χρόνου', to:'στο emerat', g:'χρονικό επίρρημα', d:'adhuc (ad + huc) — μέχρι τότε' },
          { l:'emerat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσυντελίκου ενεργ.', d:'emo, emi, emptum, emere (3) — αγοράζω', a:'.', note:'Εννοούμενο υποκείμενο: (Augustus).' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Cum Octavianus post victoriam Actiacam Romam rediret, homo quidam ei occurrit corvum tenens;", el:"Όταν ο Οκταβιανός, μετά τη νίκη στο Άκτιο, επέστρεφε στη Ρώμη, κάποιος άνθρωπος πήγε να τον συναντήσει κρατώντας ένα κοράκι·" },
    { n:2, la:"eum instituerat haec dicere: «Ave, Caesar, victor imperator».", el:"το είχε διδάξει να λέει τα εξής: «Χαίρε, Καίσαρα, νικητή στρατηγέ»." },
    { n:3, la:"Caesaris multum interfuit corvum emere;", el:"Ο Καίσαρας ενδιαφέρθηκε πολύ να αγοράσει το κοράκι·" },
    { n:4, la:"itaque viginti milibus sestertium eum emit.", el:"το αγόρασε λοιπόν για είκοσι χιλιάδες σηστερτίους." },
    { n:5, la:"Id exemplum sutorem quendam incitavit, ut corvum doceret parem salutationem.", el:"Αυτό το παράδειγμα παρακίνησε κάποιον παπουτσή να μάθει σε ένα κοράκι τον ίδιο χαιρετισμό." },
    { n:6, la:"Diu operam frustra impendebat;", el:"Για πολύ καιρό κόπιαζε μάταια·" },
    { n:7, la:"quotiescumque avis non respondebat, sutor dicere solebat «Oleum et operam perdidi».", el:"κάθε φορά που το πουλί δεν απαντούσε, ο παπουτσής συνήθιζε να λέει: «Κρίμα στον κόπο μου»." },
    { n:8, la:"Tandem corvus salutationem didicit et sutor, cupidus pecuniae, eum Caesari attulit.", el:"Επιτέλους το κοράκι έμαθε τον χαιρετισμό και ο παπουτσής, επιθυμώντας χρήματα, το έφερε στον Καίσαρα." },
    { n:9, la:"Audita salutatione Caesar dixit: «Domi satis salutationum talium audio».", el:"Όταν άκουσε τον χαιρετισμό, ο Καίσαρας είπε: «Στο σπίτι μου ακούω αρκετούς τέτοιους χαιρετισμούς»." },
    { n:10, la:"Tum venit corvo in mentem verborum domini sui: «Oleum et operam perdidi».", el:"Τότε ήρθαν στον νου του κορακιού τα λόγια του αφεντικού του: «Κρίμα στον κόπο μου»." },
    { n:11, la:"Ad haec verba Augustus risit emitque avem tanti, quanti nullam adhuc emerat.", el:"Σε αυτά τα λόγια ο Αύγουστος γέλασε και αγόρασε το πουλί τόσο, όσο κανένα μέχρι τότε δεν είχε αγοράσει." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"victoria, -ae" },
        { form:"Roma, -ae", note:"κύριο όνομα, χωρίς πληθ." },
        { form:"opera, -ae", note:"ετερόσημο" },
        { form:"pecunia, -ae", note:"περιληπτικό, χωρίς πληθ." }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Octavianus, -i", note:"κύριο όνομα, χωρίς πληθ." },
        { form:"corvus, -i" },
        { form:"sestertius, -ii", note:"γεν. πληθ. sestertium" },
        { form:"dominus, -i" },
        { form:"Augustus, -i", note:"κύριο όνομα, χωρίς πληθ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"exemplum, -i" },
        { form:"oleum, -i", note:"μόνο ενικός" },
        { form:"verbum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"homo, hominis" },
        { form:"Caesar, Caesaris", note:"κύριο όνομα, χωρίς πληθ." },
        { form:"victor, victoris" },
        { form:"imperator, imperatoris" },
        { form:"sutor, sutoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"salutatio, salutationis" },
        { form:"avis, avis", note:"γεν. πληθ. avium· αφαιρ. ενικ. -e / -i" },
        { form:"mens, mentis", note:"γεν. πληθ. mentium" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"domus, -us", note:"σχηματίζει τύπους και κατά τη β΄ κλ.· domi (γεν./στάση), domum (κίνηση σε), domo (κίνηση από)" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"Actiacus, -a, -um", note:"δεν σχηματίζει παραθετικά (καταγωγή)" },
      { form:"cupidus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"par, par, par", note:"μονοκατάληκτο· δεν σχηματίζει παραθετικά" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ & ΕΠΙΡΡΗΜΑΤΩΝ ────────────────────────────
  comparatives: [
    { kl:"Επίθετα", rows:[
      { pos:"multi, -ae, -a", comp:"plures, -es, -a (γεν. plurium)", sup:"plurimi, -ae, -a" },
      { pos:"cupidus, -a, -um", comp:"cupidior, -ior, -ius", sup:"cupidissimus, -a, -um" },
      { pos:"Actiacus, -a, -um", comp:"—", sup:"—" },
      { pos:"par, par, par", comp:"—", sup:"—" }
    ]},
    { kl:"Επιρρήματα", rows:[
      { pos:"multum", comp:"plus", sup:"plurimum" },
      { pos:"diu", comp:"diutius", sup:"diutissime" },
      { pos:"cupide", comp:"cupidius", sup:"cupidissime" },
      { pos:"satis", comp:"satius", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική· quendam, quarundam (τελικό m → n)" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως οριστική" },
    { form:"talis, talis, tale", kind:"Δεικτική", extra:"" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ένας κτήτορας" },
    { form:"tantus, tanta, tantum", kind:"Δεικτική", extra:"παραβολικό ζεύγος tanti ... quanti" },
    { form:"quantus, quanta, quantum", kind:"Αναφορική", extra:"" },
    { form:"nullus, nulla, nullum", kind:"Αντωνυμικό επίθ.", extra:"γεν. nullius, δοτ. nulli· χωρίς κλητική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"incito", perf:"incitavi", sup:"incitatum", inf:"incitare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"teneo", perf:"tenui", sup:"tentum", inf:"tenere", note:"" },
      { pres:"doceo", perf:"docui", sup:"doctum", inf:"docere", note:"" },
      { pres:"respondeo", perf:"respondi", sup:"responsum", inf:"respondere", note:"" },
      { pres:"soleo", perf:"solitus sum", sup:"(solitum)", inf:"solere", note:"ημιαποθετικό" },
      { pres:"rideo", perf:"risi", sup:"risum", inf:"ridere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"occurro", perf:"occurri / occucurri", sup:"occursum", inf:"occurrere", note:"+ δοτ." },
      { pres:"instituo", perf:"institui", sup:"institutum", inf:"instituere", note:"" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"προστ. dic" },
      { pres:"emo", perf:"emi", sup:"emptum", inf:"emere", note:"" },
      { pres:"impendo", perf:"impendi", sup:"impensum", inf:"impendere", note:"in + pendo" },
      { pres:"perdo", perf:"perdidi", sup:"perditum", inf:"perdere", note:"" },
      { pres:"disco", perf:"didici", sup:"—", inf:"discere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"audio", perf:"audivi (audii)", sup:"auditum", inf:"audire", note:"" },
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venire", note:"" }
    ]},
    { syz:"Ανώμαλα - Ελλειπτικά", rows:[
      { pres:"interest", perf:"interfuit", sup:"—", inf:"interesse", note:"απρόσωπο· inter + sum" },
      { pres:"redeo", perf:"redii", sup:"reditum", inf:"redire", note:"red + eo" },
      { pres:"affero / adfero", perf:"attuli", sup:"allatum", inf:"afferre / adferre", note:"ad + fero" },
      { pres:"ave", perf:"—", sup:"—", inf:"avere", note:"ελλειπτικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Απρόσωπο", title:"interest / interfuit: απρόσωπο", body:"Το interest (interfuit) είναι απρόσωπο σύνθετο του sum: συντάσσεται με γενική του ενδιαφερόμενου προσώπου και απαρέμφατο ως υποκείμενο (Caesaris multum interfuit corvum emere = ο Καίσαρας ενδιαφέρθηκε πολύ να αγοράσει το κοράκι)." },
    { tag:"Αφαιρετική", title:"tanti / quanti vs milibus: αξία", body:"Η αφηρημένη (υλική) αξία δηλώνεται με γενική (tanti ... quanti = τόσο ... όσο), ενώ η συγκεκριμένη αξία με αφαιρετική (viginti milibus sestertium = για είκοσι χιλιάδες σηστερτίους)." },
    { tag:"Μετοχή", title:"Audita salutatione: νόθη αφαιρετική απόλυτη", body:"Το Audita salutatione είναι νόθη αφαιρετική απόλυτη: η μετοχή είναι παθητικού παρακειμένου και το εννοούμενο ποιητικό αίτιό της (a Caesare) ταυτίζεται με το υποκείμενο της κύριας (Caesar). Δηλώνει το προτερόχρονο." },
    { tag:"Απρόσωπη έκφραση", title:"venit corvo in mentem", body:"Η απρόσωπη έκφραση venit mihi in mentem (+ γενική) = «μου έρχεται στον νου, θυμάμαι» συντάσσεται με δοτική προσωπική (corvo) και γενική ως αντικείμενο (verborum)· εννοούμενο σύστοιχο υποκείμενο (memoria)." },
    { tag:"Τόπος", title:"domi: γενική τόπου (locativus)", body:"Το domi είναι γενική ενικού με επιρρηματική σημασία (στάση σε τόπο): domi = στο σπίτι. Πρβ. domum (κίνηση σε τόπο) και domo (κίνηση από τόπο)." },
    { tag:"Ρήμα", title:"soleo: ημιαποθετικό", body:"Το soleo, solitus sum, solere (2) είναι ημιαποθετικό: σχηματίζει τους αρκτικούς χρόνους με την ενεργητική φωνή και τους παρακείμενους (solitus sum) με την παθητική." }
  ],

  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"Audita salutatione Caesar dixit", to:"Postquam Caesar audivit salutationem, ... dixit", note:"επιρρ. χρονική μετοχή παρακειμένου (προτερόχρονο), νόθη αφαιρετική απόλυτη· εξάρτηση από ιστορικό χρόνο (dixit)." },
      { from:"Audita salutatione Caesar dixit", to:"Cum Caesar audivisset salutationem, ... dixit", note:"εναλλακτική ανάλυση με cum + υποτακτική υπερσυντελίκου." }
    ]},
    { id:"Β", label:"Μετατροπή δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Cum Octavianus ... rediret, homo quidam ei occurrit corvum tenens", to:"Octaviano ... redeunti homo quidam occurrit corvum tenens", note:"χρονική μετοχή συνημμένη στο Octaviano (ei = Octaviano, αντικείμενο στο occurrit)." },
      { from:"quotiescumque avis non respondebat, sutor dicere solebat", to:"ave / avi non respondente, sutor dicere solebat", note:"επιρρ. χρονική μετοχή, γνήσια αφαιρετική απόλυτη (το ave/avi δεν έχει άλλο ρόλο στην πρόταση του solebat)." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"eum instituerat haec dicere", to:"is a homine (ab eo) institutus erat haec dicere" },
      { from:"itaque ... eum emit", to:"itaque ... is emptus est a homine (ab illo)" },
      { from:"Id exemplum sutorem quendam incitavit", to:"Eo exemplo sutor quidam incitatus est", note:"το ποιητικό αίτιο «exemplo» με απρόθετη αφαιρετική, γιατί είναι άψυχο." },
      { from:"Diu operam frustra impendebat;", to:"Diu opera a sutore frustra impendebatur" },
      { from:"... sutor, cupidus pecuniae, eum Caesari attulit.", to:"... a sutore, cupido pecuniae, is Caesari allatus est" },
      { from:"... emitque avem tanti, quanti nullam adhuc emerat", to:"... et (ab Augusto) avis empta est tanti, quanti nulla adhuc (ab eo) empta erat" }
    ]},
    { id:"Δ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο (εξάρτηση «Scriptor narrat / narravit»)", items:[
      { from:"Όλο το κείμενο, εκτός των προτάσεων «Ave, Caesar, victor imperator» και «Oleum et operam perdidi».", to:"Scriptor narrat / narravit cum Octavianus ... rediret, hominem quendam ei occurrisse corvum tenentem; (hominem) eum instituisse illa dicere ...; Caesaris multum interfuisse ...; viginti ... Caesarem eum emisse; id exemplum ... incitavisse, ut ... doceret ...; illum (ή sutorem) diu ... impendere; quotiescumque avis non responderet, sutorem dicere solere se oleum ... perdidisse; tandem corvum salutationem didicisse et sutorem, cupidum ... ... attulisse; audita salutatione Caesarem dixisse, se domi ... audire; tum venisse corvo ... domini sui; ad illa (ή ea) verba Augustum risisse emisseque ..., quanti ... emisset." }
    ]}
  ],

  etymology: [
    { la:"Octavianus", el:"Οκταβιανός // (αγγλ.) octave (= οκτάβα, ογδοάδα)." },
    { la:"victoriam, victor", el:"(γαλλ.) victoire (= νίκη), (αγγλ.) victory // (ιταλ.) vittoria (= νίκη) // (ισπαν.) victoria (= νίκη)." },
    { la:"Actiacam", el:"Άκτιο." },
    { la:"Romam", el:"Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός // (αγγλ.) romance (= ιπποτικό μυθιστόρημα, ειδύλλιο) // (γαλλ.) roman (= μυθιστόρημα)." },
    { la:"rediret", el:"εἶμι // ιταμός." },
    { la:"homo", el:"ουμανισμός (< γαλλ.) // (γαλλ.) homme (= άνθρωπος) // (ιταλ.) uomo (= άνθρωπος)." },
    { la:"occurrit", el:"κούρσα (< γαλλ.) // κουρσάρος (< ιταλ.) // (αγγλ.) occur (= συμβαίνω, τυχαίνω) // (γαλλ.) courir (= τρέχω)." },
    { la:"corvum, corvus, corvo", el:"κόραξ // (γαλλ.) corbeau // (αγγλ.) cormorant (= κορμοράνος (θαλασσοκόρακας)) // (ισπαν.) cuervo (= κόρακας)." },
    { la:"tenens", el:"(γαλλ.) tenir (= κρατώ) // (αγγλ.) con-tent (= περιεχόμενο), tenant (= ενοικιαστής, κάτοχος)." },
    { la:"instituerat", el:"ινστιτούτο // (γαλλ.) instituer (= θεσπίζω, ιδρύω) // (αγγλ.) institution (= θεσμός, ίδρυμα)." },
    { la:"dicere, dixit", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση), dire (= λέγω) // (αγγλ.) predict (= προβλέπω)." },
    { la:"Caesar, Caesaris, Caesari", el:"Καίσαρας, καισαρική (τομή), καισαρισμός // (γερμ.) Kaiser (= αυτοκράτορας)." },
    { la:"imperator", el:"ιμπεριαλισμός (< γαλλ.) // (αγγλ.) emperor (= αυτοκράτορας) // (γαλλ.) empereur (= αυτοκράτορας)." },
    { la:"multum", el:"μάλα (= πολύ) // (αγγλ.) multitude (= πλήθος) // (ιταλ.) molto (= πολύ) // (ισπαν.) mucho (= πολύς, πολύ)." },
    { la:"emere, emit", el:"(γερμ.) nehmen (= παίρνω) // (αγγλ.) redeem (= εξαγοράζω, λυτρώνω), premium (= ασφάλιστρο, πριμ), exempt (= απαλλάσσω)." },
    { la:"viginti", el:"εἴκοσι // (γαλλ.) vingt // (ιταλ.) venti (= είκοσι) // (ισπαν.) veinte (= είκοσι)." },
    { la:"milibus", el:"μίλι // (γαλλ.) mille (= χίλια), million (= εκατομμύριο) // (αγγλ.) mile (= μίλι)." },
    { la:"sestertium", el:"σηστέρτιος." },
    { la:"exemplum", el:"(γαλλ.) exemple (= παράδειγμα) // (αγγλ.) example (= παράδειγμα), sample (= δείγμα) // (ιταλ.) esempio (= παράδειγμα) // (ισπαν.) ejemplo (= παράδειγμα)." },
    { la:"sutorem, sutor (< suo = ράβω)", el:"κοστούμι (< ιταλ.) // (γαλλ.) suture (= ραφή, ράμμα), couture (= ραπτική, υψηλή ραπτική)." },
    { la:"incitavit", el:"(γαλλ.) inciter (= υποκινώ)." },
    { la:"doceret", el:"δοκέω, δόγμα // ντοκουμέντο (< ιταλ.) // (γαλλ.) docteur (= διδάκτωρ) // (αγγλ.) docile (= πειθήνιος, ευπειθής), doctrine (= δόγμα, διδασκαλία)." },
    { la:"parem", el:"(γαλλ.) pareil (= όμοιος), comparer (= συγκρίνω) // (αγγλ.) com-pare, peer (= ομότιμος, ευγενής), parity (= ισοτιμία)." },
    { la:"salutationem, salutatione, salutationum", el:"(γαλλ.) salutation (= χαιρετισμός) // (αγγλ.) salute (= χαιρετώ) // (ισπαν.) salud (= υγεία)." },
    { la:"operam (< opus)", el:"όπερα, οπερέτα (< ιταλ.) // (αγγλ.) operate (= λειτουργώ, χειρουργώ) // (γαλλ.) œuvre (= έργο), manœuvre (= ελιγμός, χειρισμός)." },
    { la:"frustra", el:"(αγγλ.) frustrate (= ματαιώνω) // (γαλλ.) frustrer (= ματαιώνω, απογοητεύω) // (ισπαν.) frustrar (= ματαιώνω)." },
    { la:"impendebat", el:"(γαλλ.) dé-penser (= ξοδεύω), peser (= ζυγίζω) // (αγγλ.) pension (= σύνταξη)." },
    { la:"avis, avem", el:"αἰετός, αετός // (γαλλ.) aviateur (= αεροπόρος), aviation (= αεροπορία), oiseau (= πουλί) // (αγγλ.) aviary (= πτηνοτροφείο / κλωβός), avian (= των πτηνών) // (ιταλ.) uccello (= πουλί)." },
    { la:"respondebat", el:"σπένδω, σπονδή· άσπονδος // (πορτογαλ.) responder (= απαντώ) // (αγγλ.) response (= απάντηση), sponsor (= χορηγός / ανάδοχος) // (γαλλ.) répondre (= απαντώ)." },
    { la:"oleum", el:"ἔλαιον // (αγγλ.) oil (= λάδι), petroleum (= πετρέλαιο), linoleum (= λινοτάπητας / μουσαμάς) // (γαλλ.) olive (= ελιά), huile (= λάδι) // (ιταλ.) olio (= λάδι)." },
    { la:"perdidi", el:"δίδωμι // (γαλλ.) perdre (= χάνω), perdition (= απώλεια) // (ιταλ.) perdere (= χάνω) // (ισπαν.) perder (= χάνω)." },
    { la:"didicit", el:"δι-δάσκομαι." },
    { la:"cupidus", el:"(γαλλ.) cupide (= άπληστος), cupidité (= απληστία) // (αγγλ.) cupidity (= απληστία / πλεονεξία), covet (= εποφθαλμιώ / ποθώ)." },
    { la:"audita, audio", el:"ἀΐω (= ακούω) // (αγγλ.) audience (= ακροατήριο), audit (= λογιστικός έλεγχος) // (γαλλ.) obéir (= υπακούω)." },
    { la:"domi, domini", el:"δέμω, δόμος // δώμα, δωμάτιο, νεόδμητος // (γαλλ.) domestique (= εξημερωμένος) // (αγγλ.) domicile (= κατοικία), dominate (= κυριαρχώ) // (ιταλ.) duomo (= καθεδρικός ναός) // (ισπαν.) don (= κύριος (τιμητικός τίτλος))." },
    { la:"satis", el:"ἄδην (< *σαδ-ην) // (γαλλ.) satis-fait (= ικανοποιημένος) // (αγγλ.) satisfy (= ικανοποιώ), satiate (= χορταίνω, κορεννύω), saturate (= κορεννύω, διαποτίζω)." },
    { la:"venit", el:"βαίνω // (γαλλ.) avenue (= λεωφόρος), venir (= έρχομαι), souvenir (= ανάμνηση / ενθύμιο) // (αγγλ.) event (= γεγονός), adventure (= περιπέτεια) // (ιταλ.) venire (= έρχομαι)." },
    { la:"mentem", el:"μιμνήσκω, μνήμη, μέντωρ // (γαλλ.) mental (= διανοητικός) // (αγγλ.) mention (= μνεία, αναφορά), demented (= παράφρων)." },
    { la:"verborum, verba", el:"(Fερέω) ἐρῶ // (γαλλ.) verbe (= ρήμα)· βερμπαλισμός (< γαλλ.) // (αγγλ.) proverb (= παροιμία), verbatim (= κατά λέξη, αυτολεξεί)." },
    { la:"Augustus", el:"Αύγουστος // (αγγλ.) August (= Αύγουστος (μήνας)), august (= σεβαστός, μεγαλοπρεπής) // (γαλλ.) août (= Αύγουστος (μήνας))." },
    { la:"risit", el:"(γαλλ.) rire (= γελώ)." }
  ]
};

export default UNIT;
