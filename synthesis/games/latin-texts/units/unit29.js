export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 29,
  title: "Ο Οκταβιανός, ο παπουτσής και το κοράκι",
  latinTitle: "Lectio XXIX",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική· εισάγεται με τον ιστορικό/διηγηματικό cum, ο οποίος χρησιμοποιείται σε διηγήσεις του παρελθόντος· εκφέρεται με υποτακτική (παρατατικού), γιατί ο ιστορικός cum υπογραμμίζει τη βαθύτερη σχέση κύριας–δευτ. πρότ. (σχέση αιτίου–αιτιατού) και δηλώνει το σύγχρονο στο παρελθόν· λειτουργεί ως επιρρ. προσδ. του χρόνου στο occurrit.', kids:[
          { l:'Cum', r:'Χρον. σύνδεσμος', g:'ιστορικός/διηγηματικός cum (+ υποτακτική)', d:'cum — όταν' },
          { l:'Octavianus', r:'Υποκείμενο', to:'στο rediret', g:'ονομ. ενικ., αρσ.', d:'Octavianus, Octaviani (αρσ. β΄) — ο Οκταβιανός' },
          { l:'post victoriam', k:'victoria', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο rediret', g:'post (πρόθ. + αιτ.) + victoriam (αιτ. ενικ., θηλ.)', d:'post — μετά, ύστερα· victoria, victoriae (θηλ. α΄) — η νίκη' },
          { l:'Actiacam', r:'Επιθετικός προσδ.', to:'στο victoriam', g:'αιτ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'Actiacus, Actiaca, Actiacum — Ακτιακός, του Ακτίου' },
          { l:'Romam', r:'Αιτιατική της κατεύθυνσης (κίνηση σε τόπο)', to:'στο rediret', g:'αιτ. ενικ., θηλ.', d:'Roma, Romae (θηλ. α΄) — η Ρώμη (δεν έχει πληθ.)' },
          { l:'rediret', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατ. ενεργ. — ανώμαλο', d:'redeo, redi(v)i, reditum, redire — επιστρέφω', a:',' }
        ]},
        { l:'homo', r:'Υποκείμενο', to:'στο occurrit', g:'ονομ. ενικ., αρσ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
        { l:'quidam', r:'Επιθετικός προσδ.', to:'στο homo', g:'ονομ. ενικ., αρσ. — επιθετική αόριστη αντων.', d:'quidam, quaedam, quoddam — κάποιος, κάποια, κάποιο' },
        { l:'ei', r:'Αντικείμενο', to:'στο occurrit', g:'δοτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό', note:'Το occurro συντάσσεται με δοτική → το ei είναι αντικείμενο.' },
        { l:'occurrit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ. (+ δοτ.)', d:'occurro, occurri & occucurri, occursum, occurrere (3) — πηγαίνω να συναντήσω' },
        { l:'corvum', r:'Αντικείμενο μετοχής', to:'στο tenens', g:'αιτ. ενικ., αρσ.', d:'corvus, corvi (αρσ. β΄) — το κοράκι' },
        { l:'tenens', r:'Τροπική μετοχή', to:'συνημμένη στο homo', g:'ονομ. ενικ., αρσ. — μτχ. ενεστ.', d:'teneo, tenui, tentum, tenere (2) — κρατώ', note:'Κατ’ άλλη εκδοχή: επιθετική μετοχή, επιθετικός προσδ. στο homo.', a:';' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'eum', r:'Άμεσο αντικείμενο & υποκ. απαρεμφάτου', to:'στο instituerat (ετεροπροσωπία)', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'instituerat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσ. ενεργ.', d:'instituo, institui, institutum, instituere (3) — διδάσκω', note:'Εννοούμενο υποκείμενο: homo.' },
        { l:'haec', r:'Αντικείμενο', to:'στο dicere', g:'αιτ. πληθ., ουδ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'dicere', r:'Τελικό απαρέμφατο (έμμεσο αντικ.)', to:'στο instituerat', g:'απαρ. ενεστ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέω (προστ. dic)', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. επιθυμίας (τα λόγια που διδάχτηκε το κοράκι).', kids:[
        { l:'Ave', r:'Ρήμα', g:'β΄ ενικ. προστ. ενεστ. ενεργ. — ελλειπτικό', d:'aveo, –, –, avere (2) — χαίρω (μόνο προστ. & απαρ.)', note:'Εννοούμενο υποκείμενο: tu.', a:',' },
        { l:'Caesar', r:'Κλητική προσφώνηση', g:'κλητ. ενικ., αρσ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας', a:',' },
        { l:'victor', r:'Επιθετικός προσδ.', to:'στο imperator', g:'κλητ. ενικ., αρσ.', d:'victor, victoris (αρσ. γ΄) — ο νικητής' },
        { l:'imperator', r:'Παράθεση', to:'στο Caesar', g:'κλητ. ενικ., αρσ.', d:'imperator, imperatoris (αρσ. γ΄) — ο στρατηγός', a:'».' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Caesaris', r:'Γενική του ενδιαφερομένου προσώπου', to:'στο interfuit', g:'γεν. ενικ., αρσ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας' },
        { l:'multum', r:'Επιρρ. προσδ. του ποσού', to:'στο interfuit', g:'ποσοτικό επίρρ. (ΣΥΓΚΡ. plus, ΥΠΕΡΘ. plurimum)', d:'multum — πολύ' },
        { l:'interfuit', r:'Ρήμα (απρόσωπο)', g:'γ΄ ενικ. οριστ. παρακ. — απρόσωπο', d:'interest, interfuit, –, interesse — ενδιαφέρει' },
        { l:'corvum', r:'Αντικείμενο', to:'στο emere', g:'αιτ. ενικ., αρσ.', d:'corvus, corvi (αρσ. β΄) — το κοράκι' },
        { l:'emere', r:'Τελικό απαρέμφατο (υποκείμενο)', to:'στο interfuit', g:'απαρ. ενεστ. ενεργ.', d:'emo, emi, emptum, emere (3) — αγοράζω', note:'Εννοούμενο υποκείμενο του emere: Caesarem (ετεροπροσωπία).', a:';' }
      ]}
    ]},

    { n: 4, kids: [
      { l:'itaque', r:'Σύνδεσμος', g:'συμπερασματικός σύνδεσμος', d:'itaque — επομένως, λοιπόν', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'viginti', r:'Επιθετικός προσδ.', to:'στο milibus', g:'άκλιτο απόλυτο αριθμητικό επίθ.', d:'viginti — είκοσι' },
        { l:'milibus', r:'Αφαιρετική της αξίας', to:'στο emit', g:'αφαιρ. πληθ., ουδ. — απόλυτο αριθμητικό επίθ. γ΄ κλ.', d:'mille (άκλ.) / πληθ. milia, milium (γ΄ κλ.) — χίλιοι' },
        { l:'sestertium', r:'Γενική διαιρετική (ή του περιεχομένου)', to:'στο milibus', g:'γεν. πληθ., αρσ.', d:'sestertius, sestertii (αρσ. β΄) — ο σηστέρτιος (γεν. πληθ. sestertium)' },
        { l:'eum', r:'Αντικείμενο', to:'στο emit', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'emit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'emo, emi, emptum, emere (3) — αγοράζω', note:'Εννοούμενο υποκείμενο: Caesar.', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Id', r:'Επιθετικός προσδ.', to:'στο exemplum', g:'ονομ. ενικ., ουδ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'exemplum', r:'Υποκείμενο', to:'στο incitavit', g:'ονομ. ενικ., ουδ.', d:'exemplum, exempli (ουδ. β΄) — το παράδειγμα' },
        { l:'sutorem', r:'Άμεσο αντικείμενο', to:'στο incitavit', g:'αιτ. ενικ., αρσ.', d:'sutor, sutoris (αρσ. γ΄) — ο παπουτσής' },
        { l:'quendam', r:'Επιθετικός προσδ.', to:'στο sutorem', g:'αιτ. ενικ., αρσ. — επιθετική αόριστη αντων.', d:'quidam, quaedam, quoddam — κάποιος, κάποια, κάποιο' },
        { l:'incitavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'incito, incitavi, incitatum, incitare (1) — παρακινώ', a:',' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική· εισάγεται με τον βουλητικό σύνδεσμο ut (καταφατική)· εκφέρεται με υποτακτική, γιατί το περιεχόμενό της είναι απλώς επιθυμητό (υποτ. παρατατικού, εξάρτηση από ιστορικό χρόνο, incitavit)· υπάρχει ιδιομορφία στην ακολουθία των χρόνων· λειτουργεί ως αντικείμενο του incitavit.', kids:[
          { l:'ut', r:'Βουλητ. σύνδεσμος', g:'βουλητικός σύνδεσμος (+ υποτακτική)', d:'ut — να' },
          { l:'corvum', r:'Άμεσο αντικείμενο', to:'στο doceret', g:'αιτ. ενικ., αρσ.', d:'corvus, corvi (αρσ. β΄) — το κοράκι' },
          { l:'doceret', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατ. ενεργ.', d:'doceo, docui, doctum, docere (2) — διδάσκω', note:'Εννοούμενο υποκείμενο: sutor.' },
          { l:'parem', r:'Επιθετικός προσδ.', to:'στο salutationem', g:'αιτ. ενικ., θηλ. — επίθ. γ΄ κλ.', d:'par, par, par (γεν. paris) — ίδιος, ίδια, ίδιο' },
          { l:'salutationem', r:'Έμμεσο αντικείμενο', to:'στο doceret', g:'αιτ. ενικ., θηλ.', d:'salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός', a:'.' }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Diu', r:'Επιρρ. προσδ. του χρόνου', to:'στο impendebat', g:'χρονικό επίρρ. (ΣΥΓΚΡ. diutius, ΥΠΕΡΘ. diutissime)', d:'diu — για πολύ καιρό' },
        { l:'operam', r:'Αντικείμενο', to:'στο impendebat', g:'αιτ. ενικ., θηλ.', d:'opera, operae (θηλ. α΄) — ο κόπος (πληθ. operae = οι μισθωτοί εργάτες, ετερόσημο)' },
        { l:'frustra', r:'Επιρρ. προσδ. του τρόπου', to:'στο impendebat', g:'τροπικό επίρρ.', d:'frustra — μάταια' },
        { l:'impendebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατ. ενεργ.', d:'impendo, impendi, impensum, impendere (3) — ξοδεύω', note:'Εννοούμενο υποκείμενο: sutor.', a:';' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική· εισάγεται με τον σύνδ. quotiescumque (ισοδυναμεί με τον επαναληπτικό cum)· εκφέρεται με οριστική, γιατί η πράξη μάς ενδιαφέρει μόνο από χρονική άποψη (οριστ. παρατατικού — επανάληψη στο παρελθόν)· λειτουργεί ως επιρρ. προσδ. του χρόνου στο solebat.', kids:[
          { l:'quotiescumque', r:'Χρον. σύνδεσμος', g:'χρονικός σύνδεσμος (= επαναληπτικός cum) + οριστική', d:'quotiescumque — κάθε φορά που, όταν' },
          { l:'avis', r:'Υποκείμενο', to:'στο respondebat', g:'ονομ. ενικ., θηλ.', d:'avis, avis (θηλ. γ΄) — το πουλί (αφαιρ. ave & avi, γεν. πληθ. avium)' },
          { l:'non', r:'Άρνηση', to:'στο respondebat', g:'αρνητικό μόριο', d:'non — όχι, δεν' },
          { l:'respondebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατ. ενεργ.', d:'respondeo, respondi, responsum, respondere (2) — απαντώ', a:',' }
        ]},
        { l:'sutor', r:'Υποκείμενο', to:'στο solebat', g:'ονομ. ενικ., αρσ.', d:'sutor, sutoris (αρσ. γ΄) — ο παπουτσής' },
        { l:'dicere', r:'Τελικό απαρέμφατο (αντικ.)', to:'στο solebat', g:'απαρ. ενεστ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέω', note:'Υποκείμενο του dicere: sutor (ταυτοπροσωπία).' },
        { l:'solebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατ. — ημιαποθετικό', d:'soleo, solitus sum, solere (2, ημιαποθ.) — συνηθίζω', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως (τα λόγια του παπουτσή).', kids:[
        { l:'Oleum', r:'Αντικείμενο', to:'στο perdidi', g:'αιτ. ενικ., ουδ.', d:'oleum, olei (ουδ. β΄) — το λάδι' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
        { l:'operam', r:'Αντικείμενο', to:'στο perdidi', g:'αιτ. ενικ., θηλ.', d:'opera, operae (θηλ. α΄) — ο κόπος' },
        { l:'perdidi', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρακ. ενεργ.', d:'perdo, perdidi, perditum, perdere (3) — χάνω', note:'Εννοούμενο υποκείμενο: ego.', a:'».' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Tandem', r:'Επιρρ. προσδ. του χρόνου', to:'στο didicit', g:'χρονικό επίρρ.', d:'tandem — επιτέλους' },
        { l:'corvus', r:'Υποκείμενο', to:'στο didicit', g:'ονομ. ενικ., αρσ.', d:'corvus, corvi (αρσ. β΄) — το κοράκι' },
        { l:'salutationem', r:'Αντικείμενο', to:'στο didicit', g:'αιτ. ενικ., θηλ.', d:'salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός' },
        { l:'didicit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'disco, didici, –, discere (3) — μαθαίνω' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'sutor', r:'Υποκείμενο', to:'στο attulit', g:'ονομ. ενικ., αρσ.', d:'sutor, sutoris (αρσ. γ΄) — ο παπουτσής', a:',' },
        { l:'cupidus', r:'Επιρρ. κατηγορούμενο του τρόπου', to:'στο sutor (μέσω του attulit)', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'cupidus, cupida, cupidum — αυτός που επιθυμεί' },
        { l:'pecuniae', r:'Γενική αντικειμενική (συμπλήρωμα)', to:'στο cupidus', g:'γεν. ενικ., θηλ.', d:'pecunia, pecuniae (θηλ. α΄) — τα χρήματα, η αμοιβή', a:',' },
        { l:'eum', r:'Άμεσο αντικείμενο', to:'στο attulit', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'Caesari', r:'Έμμεσο αντικείμενο', to:'στο attulit', g:'δοτ. ενικ., αρσ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας' },
        { l:'attulit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ. — ανώμαλο', d:'adfero (affero), attuli, allatum, adferre (afferre) — φέρνω (σε κάποιον) (σύνθ. του fero)', a:'.' }
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Audita', r:'Χρονική μετοχή (ιδιάζουσα αφαιρετική απόλυτη)', g:'αφαιρ. ενικ., θηλ. — μτχ. παρακ. παθ.', d:'audio, audivi, auditum, audire (4) — ακούω' },
        { l:'salutatione', r:'Υποκείμενο μετοχής', to:'στο Audita', g:'αφαιρ. ενικ., θηλ.', d:'salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός' },
        { l:'Caesar', r:'Υποκείμενο', to:'στο dixit', g:'ονομ. ενικ., αρσ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας' },
        { l:'dixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέω', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως (τα λόγια του Καίσαρα).', kids:[
        { l:'Domi', r:'Επιρρ. προσδ. της στάσης σε τόπο (γενική/τοπική)', to:'στο audio', g:'γεν. ενικ. (locativus), θηλ.', d:'domus, domus (θηλ. δ΄) — το σπίτι (domi = στάση σε τόπο)' },
        { l:'satis', r:'Επιρρ. προσδ. του ποσού', to:'στο audio', g:'ποσοτικό επίρρ. (ΣΥΓΚΡ. satius)', d:'satis — αρκετά' },
        { l:'salutationum', r:'Γενική διαιρετική', to:'στο satis', g:'γεν. πληθ., θηλ.', d:'salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός' },
        { l:'talium', r:'Επιθετικός προσδ.', to:'στο salutationum', g:'γεν. πληθ., θηλ. — δεικτική αντων.', d:'talis, talis, tale — τέτοιος, τέτοια, τέτοιο' },
        { l:'audio', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ.', d:'audio, audivi, auditum, audire (4) — ακούω', note:'Εννοούμενο υποκείμενο: ego.', a:'».' }
      ]}
    ]},

    { n: 10, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως. Απρόσωπη έκφραση «venit in mentem» (+ γενική) = θυμάμαι.', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στην έκφραση venit in mentem', g:'χρονικό επίρρ.', d:'tum — τότε' },
        { l:'venit', r:'Ρήμα (απρόσ. έκφραση venit in mentem)', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'venio, veni, ventum, venire (4) — έρχομαι· «venit in mentem» — θυμάμαι', note:'Εννοούμενο υποκείμενο: memoria.' },
        { l:'corvo', r:'Δοτική προσωπική', to:'στην έκφραση venit in mentem', g:'δοτ. ενικ., αρσ.', d:'corvus, corvi (αρσ. β΄) — το κοράκι' },
        { l:'in mentem', k:'mens', r:'Εμπρόθετος (μέρος της έκφρασης venit in mentem, κατεύθυνση μεταφορικά)', to:'στο venit', g:'in (πρόθ. + αιτ.) + mentem (αιτ. ενικ., θηλ.)', d:'in — σε, προς· mens, mentis (θηλ. γ΄) — ο νους, το μυαλό (γεν. πληθ. mentium)' },
        { l:'verborum', r:'Αντικείμενο (γενική)', to:'στην έκφραση venit in mentem', g:'γεν. πληθ., ουδ.', d:'verbum, verbi (ουδ. β΄) — ο λόγος' },
        { l:'domini', r:'Γενική υποκειμενική', to:'στο verborum', g:'γεν. ενικ., αρσ.', d:'dominus, domini (αρσ. β΄) — το αφεντικό, ο κύριος' },
        { l:'sui', r:'Επιθετικός προσδ.', to:'στο domini', g:'γεν. ενικ., αρσ. — κτητική αντων. γ΄ προσ. (1 κτήτορας)', d:'suus, sua, suum — δικός του, δική του, δικό του', note:'Εκφράζει άμεση αυτοπάθεια.', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως (τα λόγια του κυρίου).', kids:[
        { l:'Oleum', r:'Αντικείμενο', to:'στο perdidi', g:'αιτ. ενικ., ουδ.', d:'oleum, olei (ουδ. β΄) — το λάδι' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
        { l:'operam', r:'Αντικείμενο', to:'στο perdidi', g:'αιτ. ενικ., θηλ.', d:'opera, operae (θηλ. α΄) — ο κόπος' },
        { l:'perdidi', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρακ. ενεργ.', d:'perdo, perdidi, perditum, perdere (3) — χάνω', note:'Εννοούμενο υποκείμενο: ego.', a:'».' }
      ]}
    ]},

    { n: 11, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Ad haec verba', k:'verbum', r:'Εμπρόθετος επιρρ. προσδ. της αναφοράς', to:'στο risit', g:'ad (πρόθ. + αιτ.) + haec (αιτ. πληθ., ουδ., δεικτ.) + verba (αιτ. πληθ., ουδ.)', d:'ad — σε, προς· hic, haec, hoc — αυτός· verbum, verbi (ουδ. β΄) — ο λόγος' },
        { l:'Augustus', r:'Υποκείμενο', to:'στο risit', g:'ονομ. ενικ., αρσ.', d:'Augustus, Augusti (αρσ. β΄) — ο Αύγουστος' },
        { l:'risit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'rideo, risi, risum, ridere (2) — γελώ' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως· συνδέεται με το εγκλιτικό -que.', kids:[
        { l:'emitque', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ. + εγκλιτικό -que', d:'emo, emi, emptum, emere (3) — αγοράζω· -que (συμπλεκτικός) — και', note:'Εννοούμενο υποκείμενο: Augustus.' },
        { l:'avem', r:'Αντικείμενο', to:'στο emit', g:'αιτ. ενικ., θηλ.', d:'avis, avis (θηλ. γ΄) — το πουλί' },
        { l:'tanti', r:'Γενική της αξίας', to:'στο emit', g:'γεν. ενικ., ουδ. — δεικτική αντων.', d:'tantus, tanta, tantum — τόσος, τόση, τόσο', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. επιθετική αναφορική, προσδιοριστική στο tanti (της κύριας)· εισάγεται με την αναφορική αντων. quanti· εκφέρεται με οριστική (υπερσυντελίκου), γιατί δηλώνει το πραγματικό στο παρελθόν.', kids:[
          { l:'quanti', r:'Γενική της αξίας', to:'στο emerat', g:'γεν. ενικ., ουδ. — αναφορική αντων.', d:'quantus, quanta, quantum — όσος, όση, όσο' },
          { l:'nullam', r:'Επιθετικός προσδ.', to:'στο (εννοούμενο) avem', g:'αιτ. ενικ., θηλ. — αόριστη επιθετική αντων.', d:'nullus, nulla, nullum — κανένας, καμία, κανένα' },
          { l:'adhuc', r:'Επιρρ. προσδ. του χρόνου', to:'στο emerat', g:'χρονικό επίρρ.', d:'adhuc — μέχρι τότε' },
          { l:'emerat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσ. ενεργ.', d:'emo, emi, emptum, emere (3) — αγοράζω', note:'Εννοούμενα: Augustus (υποκ.), avem (αντικ.).', a:'.' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Cum Octavianus", el:"Όταν ο Οκταβιανός" },
    { la:"rediret Romam", el:"επέστρεφε στη Ρώμη" },
    { la:"post victoriam Actiacam,", el:"μετά τη νίκη (του) στο Άκτιο" },
    { la:"quidam homo", el:"κάποιος άνδρας" },
    { la:"ei occurrit", el:"πήγε να τον συναντήσει" },
    { la:"tenens corvum;", el:"κρατώντας (ένα) κοράκι·" },
    { la:"instituerat eum", el:"το είχε διδάξει" },
    { la:"dicere haec:", el:"να λέει τα εξής:" },
    { la:"«Ave, Caesar,", el:"«Χαίρε, Καίσαρα," },
    { la:"victor imperator».", el:"νικητή στρατηγέ!»." },
    { la:"Caesaris interfuit multum", el:"Ο Καίσαρας ενδιαφέρθηκε πολύ" },
    { la:"emere corvum;", el:"να αγοράσει το κοράκι·" },
    { la:"eum emit itaque", el:"το αγόρασε λοιπόν" },
    { la:"viginti milibus sestertium.", el:"για είκοσι χιλιάδες σηστερτίους." },
    { la:"Id exemplum incitavit", el:"Το παράδειγμα αυτό παρακίνησε" },
    { la:"quendam sutorem,", el:"κάποιον παπουτσή" },
    { la:"ut doceret corvum", el:"να μάθει σε ένα κοράκι" },
    { la:"parem salutationem.", el:"τον ίδιο χαιρετισμό." },
    { la:"Diu frustra", el:"Για πολύ καιρό μάταια" },
    { la:"impendebat operam;", el:"ξόδευε τον κόπο του·" },
    { la:"quotiescumque avis", el:"κάθε φορά που το πουλί" },
    { la:"non respondebat,", el:"δεν απαντούσε," },
    { la:"sutor solebat dicere", el:"ο παπουτσής συνήθιζε να λέει:" },
    { la:"«Perdidi oleum", el:"«Πάει χαμένο το λάδι" },
    { la:"et operam».", el:"και ο κόπος μου»." },
    { la:"Tandem corvus", el:"Επιτέλους το κοράκι" },
    { la:"didicit salutationem", el:"έμαθε τον χαιρετισμό" },
    { la:"et sutor,", el:"και ο παπουτσής," },
    { la:"cupidus pecuniae,", el:"επιθυμώντας τα χρήματα," },
    { la:"eum attulit Caesari.", el:"το έφερε στον Καίσαρα." },
    { la:"Audita salutatione", el:"Μόλις άκουσε τον χαιρετισμό," },
    { la:"Caesar dixit:", el:"ο Καίσαρας είπε:" },
    { la:"«Domi audio", el:"«Στο σπίτι μου ακούω" },
    { la:"satis talium salutationum».", el:"αρκετούς τέτοιους χαιρετισμούς»." },
    { la:"Tum corvo", el:"Τότε το κοράκι" },
    { la:"venit in mentem", el:"θυμήθηκε" },
    { la:"verborum domini sui:", el:"τα λόγια του κυρίου του:" },
    { la:"«Perdidi oleum", el:"«Πάει χαμένο το λάδι" },
    { la:"et operam».", el:"και ο κόπος μου»." },
    { la:"Augustus risit", el:"Ο Αύγουστος γέλασε" },
    { la:"ad haec verba", el:"με αυτά τα λόγια" },
    { la:"emitque avem", el:"και αγόρασε το πουλί" },
    { la:"tanti,", el:"για τόσο μεγάλο ποσό," },
    { la:"quanti nullam emerat", el:"όσο δεν είχε αγοράσει κανένα" },
    { la:"adhuc.", el:"μέχρι τότε." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"opera, -ae", note:"πληθ. operae = οι μισθωτοί εργάτες (ετερόσημο)" },
        { form:"pecunia, -ae" },
        { form:"Roma, -ae", note:"δεν έχει πληθ." },
        { form:"victoria, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Augustus, -i" },
        { form:"corvus, -i" },
        { form:"dominus, -i" },
        { form:"Octavianus, -i" },
        { form:"sestertius, -ii", note:"γεν. πληθ. sestertium" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"exemplum, -i" },
        { form:"oleum, -i" },
        { form:"verbum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Caesar, Caesaris" },
        { form:"homo, hominis" },
        { form:"imperator, imperatoris" },
        { form:"victor, victoris" },
        { form:"sutor, sutoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"avis, avis", note:"αφαιρ. ave & avi, γεν. πληθ. avium" },
        { form:"mens, mentis", note:"γεν. πληθ. mentium" },
        { form:"salutatio, salutationis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"domus, -us", note:"ανώμαλη· domi = στάση σε τόπο, domum = κίνηση σε τόπο, domo = απομάκρυνση" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"Actiacus, -a, -um" },
      { form:"cupidus, -a, -um" },
      { form:"viginti", note:"άκλιτο απόλυτο αριθμητικό" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"par, par, par", note:"γεν. paris" },
      { form:"mille / milia, -ium", note:"απόλυτο αριθμητικό (ενικ. άκλιτο, πληθ. γ΄ κλ.)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"Actiacus, -a, -um", comp:"—", sup:"—" },
      { pos:"cupidus, -a, -um", comp:"cupidior, -ior, -ius", sup:"cupidissimus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"par, par, par", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"hic, haec, hoc", kind:"Δεικτική" },
    { form:"nullus, -a, -um", kind:"Αόριστη επιθετική" },
    { form:"quantus, -a, -um", kind:"Αναφορική" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., 1 κτήτορας" },
    { form:"tantus, -a, -um", kind:"Δεικτική" },
    { form:"talis, talis, tale", kind:"Δεικτική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"incito", perf:"incitavi", sup:"incitatum", inf:"incitare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"doceo", perf:"docui", sup:"doctum", inf:"docere", note:"" },
      { pres:"respondeo", perf:"respondi", sup:"responsum", inf:"respondere", note:"" },
      { pres:"rideo", perf:"risi", sup:"risum", inf:"ridere", note:"" },
      { pres:"teneo", perf:"tenui", sup:"tentum", inf:"tenere", note:"" },
      { pres:"soleo", perf:"solitus sum", sup:"—", inf:"solere", note:"ημιαποθετικό" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"προστ. dic" },
      { pres:"disco", perf:"didici", sup:"—", inf:"discere", note:"" },
      { pres:"emo", perf:"emi", sup:"emptum", inf:"emere", note:"" },
      { pres:"impendo", perf:"impendi", sup:"impensum", inf:"impendere", note:"" },
      { pres:"instituo", perf:"institui", sup:"institutum", inf:"instituere", note:"" },
      { pres:"occurro", perf:"occurri / occucurri", sup:"occursum", inf:"occurrere", note:"" },
      { pres:"perdo", perf:"perdidi", sup:"perditum", inf:"perdere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"audio", perf:"audivi", sup:"auditum", inf:"audire", note:"" },
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"aveo", perf:"—", sup:"—", inf:"avere", note:"ελλειπτικό (μόνο προστ. & απαρ.)" },
      { pres:"adfero / affero", perf:"attuli", sup:"allatum", inf:"adferre / afferre", note:"ανώμαλο (σύνθ. του fero)" },
      { pres:"redeo", perf:"redi(v)i", sup:"reditum", inf:"redire", note:"ανώμαλο (σύνθ. του eo)" },
      { pres:"interest", perf:"interfuit", sup:"—", inf:"interesse", note:"απρόσωπο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"cum ιστορικός/διηγηματικός", body:"Το «Cum ... rediret» εισάγεται με τον ιστορικό/διηγηματικό cum και εκφέρεται με υποτακτική παρατατικού· υπογραμμίζει τη βαθύτερη σχέση αιτίου–αιτιατού κύριας και δευτ. πρότ. και δηλώνει το σύγχρονο στο παρελθόν." },
    { tag:"Ρήμα", title:"interest: απρόσωπο", body:"Στο «Caesaris multum interfuit corvum emere»: interfuit = απρόσωπο (interest, interfuit, interesse)· Caesaris = γενική του ενδιαφερομένου προσώπου· το τελικό απαρέμφατο emere = υποκείμενο (ενν. υποκ. emere: Caesarem, ετεροπροσωπία)." },
    { tag:"Έκφραση", title:"venit in mentem = θυμάμαι", body:"Το «Tum venit corvo in mentem verborum ...» είναι απρόσωπη έκφραση = θυμάμαι· ενν. υποκ. memoria, corvo = δοτική προσωπική, verborum = αντικείμενο (γενική), in mentem = κατεύθυνση μεταφορικά." },
    { tag:"Προσδιορισμός", title:"cupidus + γενική / επιρρ. κατηγορούμενο", body:"Το cupidus είναι επιρρηματικό κατηγορούμενο του τρόπου στο sutor (μέσω του attulit)· το pecuniae είναι γενική αντικειμενική ως συμπλήρωμα στο cupidus." },
    { tag:"Μετοχή", title:"Audita salutatione: αφαιρετική απόλυτη", body:"Το «Audita salutatione» είναι χρονική μετοχή, ιδιάζουσα (γνήσια) αφαιρετική απόλυτη· υποκείμενο της μετοχής το salutatione (διαφορετικό από το υποκ. dixit)." },
    { tag:"Τόπος / Αξία", title:"domi, Romam, tanti/quanti", body:"domi = γενική/τοπική (στάση σε τόπο), Romam = αιτιατική κατεύθυνσης (κίνηση σε τόπο)· tanti και quanti = γενικές της αξίας· milibus = αφαιρετική της αξίας με sestertium γενική διαιρετική." }
  ]
};

export default UNIT;
