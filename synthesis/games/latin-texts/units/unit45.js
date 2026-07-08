export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 45,
  title: "Μια επιστολή στα ελληνικά αναπτερώνει το ηθικό των πολιορκημένων",
  latinTitle: "Lectio XLV",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Caesar', r:'Υποκείμενο', to:'στο cognoscit', g:'ονομ. ενικ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας' },
        { l:'ex captivis', k:'captivus', r:'Εμπρόθετος προσδ. της προέλευσης', to:'στο cognoscit', g:'ex (πρόθ. + αφαιρ.) + captivis (αφαιρ. πληθ., αρσ. — επίθ. β΄ κλ. ουσιαστικοπ.)', d:'ex — από· captivus, -a, -um — αιχμάλωτος' },
        { l:'cognoscit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'cognosco, cognovi, cognitum, cognoscere (3) — μαθαίνω, πληροφορούμαι' },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρόταση μερικής αγνοίας, αντικείμενο του «cognoscit». Εισάγεται με την ερωτηματική αντωνυμία quae· εκφέρεται με υποτακτική, γιατί η εξάρτηση δίνει υποκειμενική χροιά, και συγκεκριμένα με υποτ. ενεστώτα, γιατί εξαρτάται από αρκτικό χρόνο και δηλώνει το σύγχρονο στο παρόν.', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο gerantur', g:'ονομ. πληθ., ουδ. — ουσιαστική ερωτηματική αντων.', d:'quis, quis, quid — ποιος, ποια, ποιο / τι' },
          { l:'apud Ciceronem', k:'Cicero', r:'Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο (μεταφορικά)', to:'στο gerantur', g:'apud (πρόθ. + αιτ.) + Ciceronem (αιτ. ενικ.)', d:'apud — σε (κοντά σε)· Cicero, Ciceronis (αρσ. γ΄) — ο Κικέρωνας', note:'«apud Ciceronem» = στο στρατόπεδο του Κικέρωνα.' },
          { l:'gerantur', r:'Ρήμα', g:'γ΄ πληθ. υποτ. ενεστ. παθ. φωνής', d:'gero, gessi, gestum, gerere (3) — κάνω, διεξάγω' }
        ]},
        { l:'-que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος (εγκλιτικός)', d:'-que — και', conn:true },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρόταση μερικής αγνοίας, αντικείμενο του «cognoscit». Εισάγεται με την ερωτηματική αντωνυμία quanto· εκφέρεται με υποτακτική, γιατί η εξάρτηση δίνει υποκειμενική χροιά, και συγκεκριμένα με υποτ. ενεστώτα, γιατί εξαρτάται από αρκτικό χρόνο και δηλώνει το σύγχρονο στο παρόν.', kids:[
          { l:'quanto', r:'Επιθετικός προσδ.', to:'στο periculo', g:'αφαιρ. ενικ., ουδ. — ερωτηματική αντων.', d:'quantus, quanta, quantum — πόσος, πόση, πόσο' },
          { l:'in periculo', k:'periculum', r:'Εμπρόθετος επιρρ. προσδ. της κατάστασης', to:'στο sit', g:'in (πρόθ. + αφαιρ.) + periculo (αφαιρ. ενικ., ουδ.)', d:'in — σε· periculum, -i (ουδ. β΄) — ο κίνδυνος' },
          { l:'res', r:'Υποκείμενο', to:'στο sit', g:'ονομ. ενικ.', d:'res, rei (θηλ. ε΄) — το πράγμα' },
          { l:'sit', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. — βοηθητικό', d:'sum, fui, —, esse — είμαι, υπάρχω', a:'.' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκείμενο: Caesar.', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο persuadet', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'cuidam', r:'Έμμεσο αντικείμενο', to:'στο persuadet', g:'δοτ. ενικ., αρσ. — ουσιαστική αόριστη αντων.', d:'quidam, quaedam, quiddam — κάποιος, κάποια, κάποιο' },
        { l:'ex equitibus', k:'eques', r:'Εμπρόθετος προσδ. του διαιρεμένου όλου', to:'στο cuidam', g:'ex (πρόθ. + αφαιρ.) + equitibus (αφαιρ. πληθ.)', d:'ex — από· eques, equitis (αρσ. γ΄) — ο ιππέας' },
        { l:'Gallis', r:'Επιθετικός προσδ.', to:'στο equitibus', g:'αφαιρ. πληθ., αρσ. — επίθ. β΄ κλ.', d:'Gallus, Galla, Gallum — γαλατικός· εδώ: ο Γαλάτης' },
        { l:'persuadet', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής (+ δοτ.)', d:'persuadeo, persuasi, persuasum, persuadere (2) — πείθω' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική πρόταση, άμεσο αντικείμενο του «persuadet». Εισάγεται με τον βουλητικό σύνδεσμο ut, γιατί είναι καταφατική· εκφέρεται με υποτακτική (περιεχόμενο απλώς επιθυμητό), και συγκεκριμένα υποτ. ενεστώτα (εξάρτηση από αρκτικό χρόνο)· ιδιομορφία στην ακολουθία των χρόνων (συγχρονισμός κύριας–δευτ.).', kids:[
          { l:'ut', r:'Βουλητικός σύνδεσμος', g:'βουλητικός σύνδεσμος (+ υποτακτική)', d:'ut — να' },
          { l:'ad Ciceronem', k:'Cicero', r:'Εμπρόθετος επιρρ. προσδ. της κατεύθυνσης (σε πρόσωπο)', to:'στο deferat', g:'ad (πρόθ. + αιτ.) + Ciceronem (αιτ. ενικ.)', d:'ad — σε, προς· Cicero, Ciceronis (αρσ. γ΄) — ο Κικέρωνας' },
          { l:'epistulam', r:'Αντικείμενο', to:'στο deferat', g:'αιτ. ενικ.', d:'epistula, -ae (θηλ. α΄) — η επιστολή' },
          { l:'deferat', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. ενεργ. φωνής', d:'defero, detuli, delatum, deferre — μεταφέρω (ανώμαλο, σύνθ. του fero)', note:'Εννοούμενο υποκείμενο: ille (= eques).', a:'.' }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Curat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'curo, curavi, curatum, curare (1) — φροντίζω', note:'Εννοούμενο υποκείμενο: Caesar.' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκείμενο: Caesar.', kids:[
        { l:'providet', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'provideo, providi, provisum, providere (2) — προνοώ' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική πρόταση, αντικείμενο των «curat» (πρότ. 6) και «providet» (πρότ. 7). Εισάγεται με τον βουλητικό αποφατικό σύνδεσμο ne, γιατί είναι αρνητική· εκφέρεται με υποτακτική (περιεχόμενο απλώς επιθυμητό), υποτ. ενεστώτα (εξάρτηση από αρκτικό χρόνο)· ιδιομορφία στην ακολουθία των χρόνων.', kids:[
          { l:'ne', r:'Βουλητικός σύνδεσμος', g:'βουλητικός αποφατικός σύνδεσμος (+ υποτακτική)', d:'ne — να μην', a:',' },
          { l:'intercepta', r:'Αφαιρετική απόλυτη υποθετική μετοχή', to:'στο cognoscantur', g:'αφαιρ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής', d:'intercipio, intercepi, interceptum, intercipere (3, 15 σε -io) — αρπάζω κάτι', note:'Γνήσια αφαιρετική απόλυτη, υποθετική μετοχή.' },
          { l:'epistula', r:'Υποκείμενο μετοχής', to:'στο intercepta', g:'αφαιρ. ενικ.', d:'epistula, -ae (θηλ. α΄) — η επιστολή', a:',' },
          { l:'nostra', r:'Επιθετικός προσδ.', to:'στο consilia', g:'ονομ. πληθ., ουδ. — κτητική αντων. α΄ προσ. (πολλοί κτήτορες)', d:'noster, nostra, nostrum — δικός μας, δική μας, δικό μας' },
          { l:'consilia', r:'Υποκείμενο', to:'στο cognoscantur', g:'ονομ. πληθ., ουδ.', d:'consilium, -ii/-i (ουδ. β΄) — το σχέδιο' },
          { l:'ab hostibus', k:'hostis', r:'Εμπρόθετος προσδ. του ποιητικού αιτίου', to:'στο cognoscantur', g:'a/ab (πρόθ. + αφαιρ.) + hostibus (αφαιρ. πληθ.)', d:'a/ab — από· hostis, -is (αρσ. γ΄) — ο εχθρός (γεν. πληθ. hostium)' },
          { l:'cognoscantur', r:'Ρήμα', g:'γ΄ πληθ. υποτ. ενεστ. παθ. φωνής', d:'cognosco, cognovi, cognitum, cognoscere (3) — μαθαίνω, πληροφορούμαι', a:'.' }
        ]}
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκείμενο: Caesar.', kids:[
        { l:'Quam', r:'Επιθετικός προσδ.', to:'στο rem', g:'αιτ. ενικ., θηλ. — αναφορική αντων. (συνδετική, = eam)', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο', note:'Αναφορική αντωνυμία ως συνδετική (= eam).' },
        { l:'ob rem', k:'res', r:'Εμπρόθετος επιρρ. προσδ. του εξωτερικού αναγκαστικού αιτίου', to:'στο mittit', g:'ob (πρόθ. + αιτ.) + rem (αιτ. ενικ.)', d:'ob — εξαιτίας· res, rei (θηλ. ε΄) — το πράγμα' },
        { l:'epistulam', r:'Αντικείμενο', to:'στο mittit', g:'αιτ. ενικ.', d:'epistula, -ae (θηλ. α΄) — η επιστολή' },
        { l:'conscriptam', r:'Επιθετική μετοχή / επιθετικός προσδ.', to:'στο epistulam', g:'αιτ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής', d:'conscribo, conscripsi, conscriptum, conscribere (3) — γράφω, συντάσσω' },
        { l:'Graecis', r:'Επιθετικός προσδ.', to:'στο litteris', g:'αφαιρ. πληθ., θηλ. — επίθ. β΄ κλ.', d:'Graecus, -a, -um — ελληνικός' },
        { l:'litteris', r:'Αφαιρετική του τρόπου', to:'στη μετοχή conscriptam', g:'αφαιρ. πληθ.', d:'litterae, -arum (θηλ. α΄, πληθ.) — η επιστολή (ετερόσημο· ενικ. littera = το γράμμα)' },
        { l:'mittit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'mitto, misi, missum, mittere (3) — στέλνω', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκείμενο: Caesar.', kids:[
        { l:'Legatum', r:'Άμεσο αντικείμενο', to:'στο monet', g:'αιτ. ενικ.', d:'legatus, -i (αρσ. β΄) — ο απεσταλμένος, ο ταχυδρόμος' },
        { l:'monet', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'moneo, monui, monitum, monere (2) — συμβουλεύω, καθοδηγώ' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική πρόταση, έμμεσο αντικείμενο του «monet». Εισάγεται με τον βουλητικό σύνδεσμο ut (καταφατική)· εκφέρεται με υποτακτική (περιεχόμενο απλώς επιθυμητό), υποτ. ενεστώτα (εξάρτηση από αρκτικό χρόνο)· ιδιομορφία στην ακολουθία των χρόνων.', kids:[
          { l:'ut', r:'Βουλητικός σύνδεσμος', g:'βουλητικός σύνδεσμος (+ υποτακτική)', d:'ut — να', a:',' },
          { type:'sub', key:'ypothetiki', label:'Υποθετική', note:'Δευτ. επιρρηματική υποθετική πρόταση. Εισάγεται με τον υποθετικό σύνδεσμο si (καταφατική)· εκφέρεται με υποτακτική πλαγίου λόγου (εξαρτημένος υποθετικός λόγος), υποτ. ενεστώτα. Λειτουργεί ως επιρρ. προσδ. της προϋπόθεσης στα adliget (πρότ. 11) και abiciat (πρότ. 12), με τα οποία σχηματίζει σύνθετο, εξαρτημένο υποθετικό λόγο α΄ είδους (ανοιχτή υπόθεση στο μέλλον).', kids:[
            { l:'si', r:'Υποθετικός σύνδεσμος', g:'υποθετικός σύνδεσμος', d:'si — αν' },
            { l:'adire', r:'Τελικό απαρέμφατο / αντικείμενο', to:'στο possit', g:'απαρ. ενεστ. — ανώμαλο', d:'adeo, adi(v)i, aditum, adire — πλησιάζω (σύνθ. του eo)', note:'Ταυτοπροσωπία (υποκ. ille = legatus).' },
            { l:'non', r:'Άρνηση', to:'στο possit', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
            { l:'possit', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. — ανώμαλο', d:'possum, potui, —, posse — μπορώ', note:'Εννοούμενο υποκείμενο: ille (= legatus).', a:',' }
          ]},
          { l:'epistulam', r:'Αντικείμενο', to:'στο adliget', g:'αιτ. ενικ.', d:'epistula, -ae (θηλ. α΄) — η επιστολή' },
          { l:'ad amentum', k:'amentum', r:'Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο', to:'στο adliget', g:'ad (πρόθ. + αιτ.) + amentum (αιτ. ενικ., ουδ.)', d:'ad — σε· amentum, -i (ουδ. β΄) — ο ιμάντας, το λουρί' },
          { l:'tragulae', r:'Γενική κτητική', to:'στο amentum', g:'γεν. ενικ.', d:'tragula, -ae (θηλ. α΄) — το ακόντιο' },
          { l:'adliget', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. ενεργ. φωνής', d:'adligo, adligavi, adligatum, adligare (1) — δένω', note:'Εννοούμενο υποκείμενο: ille (= legatus).' }
        ]},
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και', conn:true },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική πρόταση, έμμεσο αντικείμενο του «monet». Εισάγεται με τον βουλητικό σύνδεσμο (ut, εννοούμενο), υποτ. ενεστώτα· ιδιομορφία στην ακολουθία των χρόνων.', kids:[
          { l:'intra castra', k:'castra', r:'Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο', to:'στο abiciat', g:'intra (πρόθ. + αιτ.) + castra (αιτ. πληθ., ουδ.)', d:'intra — μέσα σε· castra, -orum (ουδ. β΄) — το στρατόπεδο (ετερόσημο· ενικ. castrum = φρούριο)' },
          { l:'abiciat', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. ενεργ. φωνής', d:'abicio, abieci, abiectum, abicere (3, 15 σε -io) — ρίχνω', note:'Εννοούμενα: ille (= legatus, υποκ.) και tragulam (αντικ.).', a:'.' }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκείμενο: Caesar.', kids:[
        { l:'In litteris', k:'litterae', r:'Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο (μεταφορικά)', to:'στο scribit', g:'in (πρόθ. + αφαιρ.) + litteris (αφαιρ. πληθ.)', d:'in — σε· litterae, -arum (θηλ. α΄, πληθ.) — η επιστολή' },
        { l:'scribit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'scribo, scripsi, scriptum, scribere (3) — γράφω' },
        { l:'se', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο adfore', g:'αιτ. ενικ. — προσωπική αντων. γ΄ προσ.', d:'sui, sibi, se — εαυτού (γ΄ προσ.)', note:'Ταυτοπροσωπία· ως υποκ. του ειδικού απαρεμφάτου μπαίνει αιτιατική (λατινισμός).' },
        { l:'cum legionibus', k:'legio', r:'Εμπρόθετος επιρρ. προσδ. της συνοδείας', to:'στο adfore', g:'cum (πρόθ. + αφαιρ.) + legionibus (αφαιρ. πληθ.)', d:'cum — με· legio, legionis (θηλ. γ΄) — η λεγεώνα' },
        { l:'celeriter', r:'Επιρρ. προσδ. του τρόπου', to:'στο adfore', g:'τροπικό επίρρημα', d:'celeriter — γρήγορα (ΣΥΓΚΡ. celerius, ΥΠΕΡΘ. celerrime· από επίθ. celer, celeris, celere)' },
        { l:'adfore', r:'Ειδικό απαρέμφατο / αντικείμενο', to:'στο scribit', g:'απαρ. μέλλ.', d:'adsum, adfui (affui), —, adesse — είμαι παρών, έρχομαι', a:'.' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Gallus', r:'Υποκείμενο', to:'στο constituit', g:'ονομ. ενικ.', d:'Gallus, -i (αρσ. β΄) — ο Γαλάτης', a:',' },
        { l:'periculum', r:'Αντικείμενο μετοχής', to:'στη μετοχή veritus', g:'αιτ. ενικ., ουδ.', d:'periculum, -i (ουδ. β΄) — ο κίνδυνος' },
        { l:'veritus', r:'Αιτιολογική μετοχή', to:'συνημμένη στο Gallus', g:'ονομ. ενικ., αρσ. — μτχ. παρακ. (αποθ.)', d:'vereor, veritus sum, vereri (2, αποθ.) — φοβάμαι', a:',' },
        { l:'constituit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'constituo, constitui, constitutum, constituere (3) — αποφασίζω' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική πρόταση, αντικείμενο του «constituit». Εισάγεται με τον βουλητικό σύνδεσμο ut (καταφατική)· εκφέρεται με υποτακτική παρατατικού, γιατί εξαρτάται από ιστορικό χρόνο (δηλώνει το σύγχρονο στο παρελθόν)· ιδιομορφία στην ακολουθία των χρόνων.', kids:[
          { l:'ut', r:'Βουλητικός σύνδεσμος', g:'βουλητικός σύνδεσμος (+ υποτακτική)', d:'ut — να' },
          { l:'tragulam', r:'Αντικείμενο', to:'στο mitteret', g:'αιτ. ενικ.', d:'tragula, -ae (θηλ. α΄) — το ακόντιο' },
          { l:'mitteret', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατ. ενεργ. φωνής', d:'mitto, misi, missum, mittere (3) — στέλνω, ρίχνω', note:'Εννοούμενο υποκείμενο: ipse (= Gallus).', a:'.' }
        ]}
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Haec', r:'Υποκείμενο', to:'στο adhaesit', g:'ονομ. ενικ., θηλ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό', note:'Αναφέρεται στην επιστολή/ακόντιο (= tragula).' },
        { l:'casu', r:'Αφαιρετική του τρόπου', to:'στο adhaesit', g:'αφαιρ. ενικ.', d:'casus, -us (αρσ. δ΄) — το τυχαίο γεγονός· «casu» = τυχαία' },
        { l:'ad turrim', k:'turris', r:'Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο', to:'στο adhaesit', g:'ad (πρόθ. + αιτ.) + turrim (αιτ. ενικ.)', d:'ad — σε· turris, -is (θηλ. γ΄) — ο πύργος (αιτ. turrim, αφαιρ. turri, γεν. πληθ. turrium)' },
        { l:'adhaesit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'adhaeresco, adhaesi, adhaesum, adhaerescere (3) — καρφώνομαι, προσκολλιέμαι' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκείμενο: haec.', kids:[
        { l:'tertio', r:'Επιθετικός προσδ.', to:'στο die', g:'αφαιρ. ενικ., αρσ. — τακτικό αριθμ. επίθ. β΄ κλ.', d:'tertius, -a, -um — τρίτος' },
        { l:'post', r:'Επιρρ. προσδ. του χρόνου', to:'στο conspicitur', g:'χρονικό επίρρημα', d:'post — αργότερα, ύστερα' },
        { l:'die', r:'Αφαιρετική (οργανική) του μέτρου', to:'στο post', g:'αφαιρ. ενικ.', d:'dies, diei (αρσ. ε΄) — η ημέρα' },
        { l:'a quodam milite', k:'miles', r:'Εμπρόθετος προσδ. του ποιητικού αιτίου', to:'στο conspicitur', g:'a/ab (πρόθ. + αφαιρ.) + quodam (αφαιρ. ενικ., αρσ. — αόριστη επιθετική αντων.) + milite (αφαιρ. ενικ.)', d:'a/ab — από· quidam, quaedam, quoddam — κάποιος (επιθετική)· miles, militis (αρσ. γ΄) — ο στρατιώτης', note:'quodam: επιθετικός προσδ. στο milite.' },
        { l:'conspicitur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. παθ. φωνής', d:'conspicio, conspexi, conspectum, conspicere (3, 15 σε -io) — βλέπω' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκείμενο: haec.', kids:[
        { l:'ad Ciceronem', k:'Cicero', r:'Εμπρόθετος επιρρ. προσδ. της κατεύθυνσης (σε πρόσωπο)', to:'στο defertur', g:'ad (πρόθ. + αιτ.) + Ciceronem (αιτ. ενικ.)', d:'ad — σε, προς· Cicero, Ciceronis (αρσ. γ΄) — ο Κικέρωνας' },
        { l:'defertur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. παθ. φωνής', d:'defero, detuli, delatum, deferre — μεταφέρω (ανώμαλο, σύνθ. του fero)', a:'.' }
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Ille', r:'Υποκείμενο', to:'στο perlegit', g:'ονομ. ενικ., αρσ. — δεικτική αντων.', d:'ille, illa, illud — εκείνος, εκείνη, εκείνο' },
        { l:'epistulam', r:'Αντικείμενο', to:'στο perlegit', g:'αιτ. ενικ.', d:'epistula, -ae (θηλ. α΄) — η επιστολή' },
        { l:'perlegit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'perlego, perlegi, perlectum, perlegere (3) — διαβάζω μέχρι το τέλος' }
      ]},
      { l:'-que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος (εγκλιτικός)', d:'-que — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκείμενο: ille.', kids:[
        { l:'milites', r:'Άμεσο αντικείμενο', to:'στο adhortatur', g:'αιτ. πληθ.', d:'miles, militis (αρσ. γ΄) — ο στρατιώτης' },
        { l:'adhortatur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. — αποθετικό', d:'adhortor, adhortatus sum, adhortari (1, αποθ.) — προτρέπω' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική πρόταση, έμμεσο αντικείμενο του «adhortatur». Εισάγεται με τον βουλητικό σύνδεσμο ut (καταφατική)· εκφέρεται με υποτακτική ενεστώτα (εξάρτηση από αρκτικό χρόνο)· ιδιομορφία στην ακολουθία των χρόνων.', kids:[
          { l:'ut', r:'Βουλητικός σύνδεσμος', g:'βουλητικός σύνδεσμος (+ υποτακτική)', d:'ut — να' },
          { l:'salutem', r:'Αντικείμενο', to:'στο sperent', g:'αιτ. ενικ.', d:'salus, salutis (θηλ. γ΄) — η σωτηρία, η υγεία (δεν έχει πληθ.)' },
          { l:'sperent', r:'Ρήμα', g:'γ΄ πληθ. υποτ. ενεστ. ενεργ. φωνής', d:'spero, speravi, speratum, sperare (1) — ελπίζω', note:'Εννοούμενο υποκείμενο: illi (= milites).', a:'.' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Caesar cognoscit", el:"Ο Καίσαρας πληροφορείται" },
    { la:"ex captivis", el:"από τους αιχμαλώτους" },
    { la:"quae gerantur", el:"τι συμβαίνει" },
    { la:"apud Ciceronem", el:"στο στρατόπεδο του Κικέρωνα" },
    { la:"quantoque in periculo", el:"και σε πόσο μεγάλο κίνδυνο" },
    { la:"sit res.", el:"βρίσκονται τα πράγματα." },
    { la:"Tum persuadet cuidam", el:"Τότε πείθει κάποιον" },
    { la:"ex equitibus Gallis", el:"από τους Γαλάτες ιππείς" },
    { la:"ut deferat epistulam", el:"να μεταφέρει μία επιστολή" },
    { la:"ad Ciceronem.", el:"στον Κικέρωνα." },
    { la:"Curat et providet", el:"Φροντίζει και προνοεί" },
    { la:"ne cognoscantur nostra consilia", el:"να μην μαθευτούν τα σχέδιά μας" },
    { la:"ab hostibus,", el:"από τους εχθρούς," },
    { la:"intercepta epistula.", el:"αν αρπάξουν την επιστολή." },
    { la:"Ob quam rem", el:"Για τον λόγο αυτό" },
    { la:"mittit epistulam", el:"στέλνει επιστολή" },
    { la:"conscriptam Graecis litteris.", el:"γραμμένη στα ελληνικά." },
    { la:"Monet legatum,", el:"Συμβουλεύει τον απεσταλμένο," },
    { la:"si non possit adire,", el:"αν δεν μπορέσει να πλησιάσει," },
    { la:"ut adliget epistulam", el:"να δέσει την επιστολή" },
    { la:"ad amentum tragulae", el:"στον ιμάντα του ακοντίου" },
    { la:"et abiciat intra castra.", el:"και να το ρίξει μέσα στο στρατόπεδο." },
    { la:"In litteris scribit", el:"Στην επιστολή γράφει" },
    { la:"se adfore celeriter", el:"πως θα έλθει γρήγορα" },
    { la:"cum legionibus.", el:"με τις λεγεώνες του." },
    { la:"Gallus, veritus", el:"Ο Γαλάτης, επειδή φοβήθηκε" },
    { la:"periculum,", el:"τον κίνδυνο," },
    { la:"constituit", el:"αποφάσισε" },
    { la:"ut mitteret tragulam.", el:"να ρίξει το ακόντιο." },
    { la:"Haec casu adhaesit", el:"Αυτό τυχαία καρφώθηκε" },
    { la:"ad turrim", el:"σε έναν πύργο" },
    { la:"et tertio die post", el:"και τρεις μέρες αργότερα" },
    { la:"conspicitur", el:"γίνεται αντιληπτό" },
    { la:"a quodam milite", el:"από κάποιον στρατιώτη" },
    { la:"et defertur ad Ciceronem.", el:"και μεταφέρεται στον Κικέρωνα." },
    { la:"Ille perlegit", el:"Εκείνος διαβάζει μέχρι τέλους" },
    { la:"epistulam", el:"την επιστολή" },
    { la:"adhortaturque milites", el:"και προτρέπει τους στρατιώτες" },
    { la:"ut sperent salutem.", el:"να ελπίζουν στη σωτηρία (τους)." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"epistula, -ae" },
        { form:"litterae, -arum", note:"ετερόσημο" },
        { form:"tragula, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Gallus, -i" },
        { form:"legatus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"amentum, -i" },
        { form:"castra, -orum", note:"ετερόσημο" },
        { form:"consilium, -ii / -i" },
        { form:"periculum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Caesar, Caesaris" },
        { form:"Cicero, Ciceronis" },
        { form:"eques, equitis" },
        { form:"hostis, hostis" },
        { form:"miles, militis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"legio, legionis" },
        { form:"salus, salutis", note:"δεν έχει πληθ." },
        { form:"turris, turris", note:"αιτ. turrim, αφαιρ. turri, γεν. πληθ. turrium" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"casus, -us" } ] }
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"dies, diei" } ] },
      { gender:"Θηλυκά", items:[ { form:"res, rei" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"captivus, -a, -um" },
      { form:"Gallus, -a, -um" },
      { form:"Graecus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"captivus, -a, -um", comp:"—", sup:"—" },
      { pos:"Gallus, -a, -um", comp:"—", sup:"—" },
      { pos:"Graecus, -a, -um", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"hic, haec, hoc", kind:"Δεικτική" },
    { form:"ille, illa, illud", kind:"Δεικτική" },
    { form:"noster, nostra, nostrum", kind:"Κτητική", extra:"α΄ προσ., πολλοί κτήτορες" },
    { form:"quantus, -a, -um", kind:"Ερωτηματική" },
    { form:"qui, quae, quod", kind:"Αναφορική" },
    { form:"quidam, quaedam, quiddam", kind:"Αόριστη", extra:"ουσιαστική" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική" },
    { form:"quis, quis, quid", kind:"Ερωτηματική", extra:"ουσιαστική" },
    { form:"se", kind:"Προσωπική", extra:"γ΄ προσώπου" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"adligo", perf:"adligavi", sup:"adligatum", inf:"adligare", note:"" },
      { pres:"curo", perf:"curavi", sup:"curatum", inf:"curare", note:"" },
      { pres:"spero", perf:"speravi", sup:"speratum", inf:"sperare", note:"" },
      { pres:"adhortor", perf:"adhortatus sum", sup:"—", inf:"adhortari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"moneo", perf:"monui", sup:"monitum", inf:"monere", note:"" },
      { pres:"persuadeo", perf:"persuasi", sup:"persuasum", inf:"persuadere", note:"+ δοτ." },
      { pres:"provideo", perf:"providi", sup:"provisum", inf:"providere", note:"" },
      { pres:"vereor", perf:"veritus sum", sup:"—", inf:"vereri", note:"αποθετικό" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"abicio", perf:"abieci", sup:"abiectum", inf:"abicere", note:"15 σε -io" },
      { pres:"adhaeresco", perf:"adhaesi", sup:"adhaesum", inf:"adhaerescere", note:"" },
      { pres:"cognosco", perf:"cognovi", sup:"cognitum", inf:"cognoscere", note:"" },
      { pres:"conscribo", perf:"conscripsi", sup:"conscriptum", inf:"conscribere", note:"" },
      { pres:"conspicio", perf:"conspexi", sup:"conspectum", inf:"conspicere", note:"15 σε -io" },
      { pres:"constituo", perf:"constitui", sup:"constitutum", inf:"constituere", note:"" },
      { pres:"defero", perf:"detuli", sup:"delatum", inf:"deferre", note:"ανώμαλο (σύνθ. του fero)" },
      { pres:"gero", perf:"gessi", sup:"gestum", inf:"gerere", note:"" },
      { pres:"intercipio", perf:"intercepi", sup:"interceptum", inf:"intercipere", note:"15 σε -io" },
      { pres:"mitto", perf:"misi", sup:"missum", inf:"mittere", note:"" },
      { pres:"perlego", perf:"perlegi", sup:"perlectum", inf:"perlegere", note:"" },
      { pres:"scribo", perf:"scripsi", sup:"scriptum", inf:"scribere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"adeo", perf:"adi(v)i", sup:"aditum", inf:"adire", note:"ανώμαλο (σύνθ. του eo)" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"ανώμαλο" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"adsum", perf:"adfui / affui", sup:"—", inf:"adesse", note:"σύνθετο του sum" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ ───────────────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"Πλάγιες ερωτηματικές", body:"Οι «quae apud Ciceronem gerantur» και «quantoque in periculo res sit» είναι δευτ. ουσιαστικές πλάγιες ερωτηματικές (αντικ. του cognoscit)· εκφέρονται με υποτακτική, γιατί η εξάρτηση δίνει υποκειμενική χροιά." },
    { tag:"Ακολουθία χρόνων", title:"Ιδιομορφία στις βουλητικές", body:"Στις βουλητικές (ut/ne … deferat, cognoscantur, adliget, abiciat, mitteret, sperent) υπάρχει ιδιομορφία στην ακολουθία των χρόνων: η βούληση είναι ιδωμένη τη στιγμή που εμφανίζεται στο μυαλό του ομιλητή (συγχρονισμός κύριας–δευτερεύουσας)." },
    { tag:"Υποθετικός λόγος", title:"si adire non possit …", body:"Η «si adire non possit» με απόδοση τα adliget/abiciat σχηματίζει σύνθετο, εξαρτημένο υποθετικό λόγο α΄ είδους (ανοιχτή υπόθεση στο μέλλον)· εκφέρεται με υποτακτική πλαγίου λόγου." },
    { tag:"Απαρέμφατο", title:"se … adfore (ταυτοπροσωπία)", body:"Το adfore είναι ειδικό απαρέμφατο μέλλοντα (αντικ. του scribit)· ως υποκείμενό του τίθεται η αιτιατική se, αν και έχουμε ταυτοπροσωπία — πρόκειται για λατινισμό." },
    { tag:"Μετοχή", title:"intercepta epistula", body:"Το «intercepta epistula» είναι γνήσια αφαιρετική απόλυτη, υποθετική μετοχή (= αν αρπάξουν την επιστολή), με υποκείμενο το epistula. Το veritus (πρότ. 15) είναι αιτιολογική μετοχή, συνημμένη στο Gallus." },
    { tag:"Ουσιαστικό", title:"Ετερόσημα: litterae / castra", body:"litterae, -arum (πληθ.) = επιστολή/λογοτεχνία, ενώ ενικ. littera = γράμμα. castra, -orum (πληθ.) = στρατόπεδο, ενώ ενικ. castrum = φρούριο. Η turris έχει αιτ. turrim, αφαιρ. turri, γεν. πληθ. turrium." }
  ]
};

export default UNIT;
