export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 38,
  title: "Η μοίρα της Καικιλίας",
  latinTitle: "Lectio XXXVIII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Caecilia', r:'Υποκείμενο', to:'στο fecit (και στο petit)', g:'ονομ. ενικ., θηλ.', d:'Caecilia, -ae (θηλ. α΄) — η Καικιλία', a:',' },
        { l:'uxor', r:'Παράθεση', to:'στο Caecilia', g:'ονομ. ενικ.', d:'uxor, uxoris (θηλ. γ΄) — η σύζυγος' },
        { l:'Metelli', r:'Γενική κτητική', to:'στο uxor', g:'γεν. ενικ.', d:'Metellus, -i (αρσ. β΄) — ο Μέτελλος', a:',' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική, ως επιρρ. προσδ. του χρόνου στο fecit. Εισάγεται με τον χρονικό σύνδεσμο dum (σύγχρονο) και εκφέρεται με οριστική ενεστώτα (λατινισμός: συνεχιζόμενη πράξη στη διάρκεια της οποίας συμβαίνει μια άλλη).', kids:[
          { l:'dum', r:'Χρον. σύνδεσμος', g:'χρονικός σύνδεσμος (+ οριστική) — σύγχρονο', d:'dum — ενώ, όταν' },
          { l:'more', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο petit', g:'αφαιρ. ενικ.', d:'mos, moris (αρσ. γ΄) — το έθιμο' },
          { l:'prisco', r:'Επιθετικός προσδ.', to:'στο more', g:'αφαιρ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'priscus, -a, -um — αρχαίος, πατροπαράδοτος' },
          { l:'omen', r:'Αντικείμενο', to:'στο petit', g:'αιτ. ενικ., ουδ.', d:'omen, ominis (ουδ. γ΄) — ο οιωνός' },
          { l:'nuptiale', r:'Επιθετικός προσδ.', to:'στο omen', g:'αιτ. ενικ., ουδ. — επίθ. γ΄ κλ.', d:'nuptialis, -is, -e — γαμήλιος' },
          { l:'petit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'peto, peti(v)i, petitum, petere (3) — ζητώ, επιδιώκω', note:'Εννοούμενο υποκείμενο: Caecilia.' },
          { l:'filiae', r:'Δοτική προσωπική χαριστική', to:'στο petit', g:'δοτ. ενικ.', d:'filia, -ae (θηλ. α΄) — η κόρη', note:'Δοτ. & αφαιρ. πληθ.: filiis & filiabus.' },
          { l:'sororis', r:'Γενική κτητική', to:'στο filiae', g:'γεν. ενικ.', d:'soror, sororis (θηλ. γ΄) — η αδελφή', a:',' }
        ]},
        { l:'ipsa', r:'Επιθετικός προσδ.', to:'στο Caecilia', g:'ονομ. ενικ., θηλ. — δεικτική (ως οριστική) αντων.', d:'ipse, ipsa, ipsum — ο ίδιος, η ίδια, το ίδιο' },
        { l:'fecit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'facio, feci, factum, facere (3, 15 σε -io) — κάνω, δημιουργώ', note:'β΄ ενικ. προστ. ενεστ.: fac.' },
        { l:'omen', r:'Αντικείμενο', to:'στο fecit', g:'αιτ. ενικ., ουδ.', d:'omen, ominis (ουδ. γ΄) — ο οιωνός', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { l:'Nam', r:'Σύνδεσμος', g:'διασαφητικός (παρατακτικός) σύνδεσμος', d:'nam — δηλαδή', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'in sacello', k:'sacellum', r:'Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο', to:'στο persedebat', g:'in (πρόθ. + αφαιρ.) + sacello (αφαιρ. ενικ., ουδ.)', d:'in — σε· sacellum, -i (ουδ. β΄) — το μικρό ιερό, το μικρό τέμενος' },
        { l:'quodam', r:'Επιθετικός προσδ.', to:'στο nocte', g:'αφαιρ. ενικ., ουδ. — επιθετική αόριστη αντων.', d:'quidam, quaedam, quoddam — κάποιος, κάποια, κάποιο' },
        { l:'nocte', r:'Αφαιρετική του χρόνου', to:'στο persedebat', g:'αφαιρ. ενικ.', d:'nox, noctis (θηλ. γ΄) — η νύχτα', note:'Αφαιρ.: nocte & noctu· γεν. πληθ.: noctium.' },
        { l:'cum sororis filia', k:'filia', r:'Εμπρόθετος επιρρ. προσδ. της συνοδείας', to:'στο persedebat', g:'cum (πρόθ. + αφαιρ.) + filia (αφαιρ. ενικ.)· sororis: γεν. κτητική στο filia', d:'cum — μαζί με· filia, -ae (θηλ. α΄) — η κόρη· soror, sororis (θηλ. γ΄) — η αδελφή' },
        { l:'persedebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής', d:'persedeo, persedi, persessum, persedere (2) — κάθομαι για πολλή ώρα', note:'Εννοούμενο υποκείμενο: Caecilia.' }
      ]},
      { l:'-que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος — εγκλιτικός', d:'-que — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'expectabat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής', d:'expecto, expectavi, expectatum, expectare (1) — περιμένω', note:'Εννοούμενο υποκείμενο: Caecilia.' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική, ως επιρρ. προσδ. του χρόνου στο expectabat. Εισάγεται με τον χρονικό σύνδεσμο dum (υστερόχρονο) και εκφέρεται με υποτακτική, γιατί η πράξη περιγράφεται ως προσδοκία/επιδίωξη· εδώ υποτ. παρατ. λόγω εξάρτησης από ιστορικό χρόνο.', kids:[
          { l:'dum', r:'Χρον. σύνδεσμος', g:'χρονικός σύνδεσμος (+ υποτακτική) — υστερόχρονο', d:'dum — μέχρι, ώσπου' },
          { l:'aliqua', r:'Επιθετικός προσδ.', to:'στο vox', g:'ονομ. ενικ., θηλ. — επιθετική αόριστη αντων.', d:'aliqui, aliqua, aliquod — κάποιος, κάποια, κάποιο' },
          { l:'vox', r:'Υποκείμενο', to:'στο audiretur', g:'ονομ. ενικ.', d:'vox, vocis (θηλ. γ΄) — η φωνή' },
          { l:'congruens', r:'Επιθετική μετοχή (επιθετικός προσδ.)', to:'στο vox', g:'ονομ. ενικ., θηλ. — μτχ. ενεστ.', d:'congruo, congrui, —, congruere (3) — συμφωνώ, αρμόζω' },
          { l:'proposito', r:'Αντικείμενο της μετοχής congruens', to:'στο congruens', g:'δοτ. ενικ., ουδ.', d:'propositum, -i (ουδ. β΄) — ο σκοπός' },
          { l:'audiretur', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατ. παθ. φωνής', d:'audio, audivi, auditum, audire (4) — ακούω', a:'.' }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Tandem', r:'Επιρρ. προσδ. του χρόνου', to:'στο rogavit', g:'χρονικό επίρρημα', d:'tandem — στο τέλος, τελικά' },
        { l:'puella', r:'Υποκείμενο', to:'στο rogavit', g:'ονομ. ενικ.', d:'puella, -ae (θηλ. α΄) — η κοπέλα', a:',' },
        { l:'longa', r:'Επιθετικός προσδ.', to:'στο mora', g:'αφαιρ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'longus, -a, -um — μακρύς, μακρόχρονος' },
        { l:'mora', r:'Αφαιρετική (οργανική) του εξωτερικού αναγκαστικού αιτίου', to:'στη μετοχή fessa', g:'αφαιρ. ενικ.', d:'mora, -ae (θηλ. α΄) — η χρονοτριβή, η καθυστέρηση' },
        { l:'standi', r:'Γενική γερουνδίου (γενική αντικειμενική)', to:'στο mora', g:'γεν. γερουνδίου', d:'sto, steti, statum, stare (1) — στέκομαι' },
        { l:'fessa', r:'Αιτιολογική μετοχή (συνημμένη)', to:'στο puella', g:'ονομ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής', d:'fatiscor, fessus sum, fatisci (3, αποθ.) — κουράζομαι', a:',' },
        { l:'rogavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'rogo, rogavi, rogatum, rogare (1) — ζητώ, παρακαλώ' },
        { l:'materteram', r:'Άμεσο αντικείμενο', to:'στο rogavit', g:'αιτ. ενικ.', d:'matertera, -ae (θηλ. α΄) — η θεία (από την πλευρά της μητέρας)', a:',' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική, ως έμμεσο αντικείμενο στο rogavit. Εισάγεται με τον βουλητικό σύνδεσμο ut (καταφατική) και εκφέρεται με υποτακτική (απλώς επιθυμητό)· εδώ υποτ. παρατ. λόγω ιστορικού χρόνου, με ιδιομορφία στην ακολουθία των χρόνων (η βούληση ιδωμένη τη στιγμή που εμφανίζεται στο μυαλό).', kids:[
          { l:'ut', r:'Βουλητικός σύνδεσμος', g:'βουλητικός σύνδεσμος (+ υποτακτική)', d:'ut — να' },
          { l:'sibi', r:'Δοτική προσωπική χαριστική (έμμεση αυτοπάθεια)', to:'στο cederet', g:'δοτ. ενικ. — γ΄ προσ. προσωπική (αυτοπαθής) αντων.', d:'sui, sibi, se — (αυτοπαθής) του εαυτού του' },
          { l:'paulisper', r:'Επιρρ. προσδ. του χρόνου', to:'στο cederet', g:'χρονικό επίρρημα', d:'paulisper — για λίγο' },
          { l:'loco', r:'Αντικείμενο (σε αφαιρετική)', to:'στο cederet', g:'αφαιρ. ενικ.', d:'locus, -i (αρσ. β΄) — ο τόπος, το μέρος, η θέση', note:'Πληθ.: loci, locorum (χωρία βιβλίου) & loca, locorum (τόποι) — ετερογενές.' },
          { l:'cederet', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατ. ενεργ. φωνής', d:'cedo, cessi, cessum, cedere (3) — παραχωρώ', note:'Εννοούμενο υποκείμενο: ea.', a:'.' }
        ]}
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο dixit', g:'χρονικό επίρρημα', d:'tum — τότε, έπειτα' },
        { l:'Caecilia', r:'Υποκείμενο', to:'στο dixit', g:'ονομ. ενικ.', d:'Caecilia, -ae (θηλ. α΄) — η Καικιλία' },
        { l:'puellae', r:'Έμμεσο αντικείμενο', to:'στο dixit', g:'δοτ. ενικ.', d:'puella, -ae (θηλ. α΄) — η κοπέλα' },
        { l:'dixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'dico, dixi, dictum, dicere (3) — λέγω', note:'β΄ ενικ. προστ. ενεστ.: dic. Άμεσο αντικ. δεν υπάρχει, γιατί τα λόγια μεταφέρονται με κύρια πρόταση σε ευθύ λόγο.', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (ευθύς λόγος)', note:'Τα λόγια της Καικιλίας σε ευθύ λόγο.', kids:[
        { l:'«', plain:true },
        { l:'ego', r:'Υποκείμενο', to:'στο cedo', g:'ονομ. ενικ. — α΄ προσ. προσωπική αντων.', d:'ego — εγώ' },
        { l:'libenter', r:'Επιρρ. προσδ. του τρόπου', to:'στο cedo', g:'τροπικό επίρρημα', d:'libenter — πρόθυμα', note:'Από την επιθετικοποιημένη μτχ. ενεστ. libens, libentis = πρόθυμος.' },
        { l:'tibi', r:'Δοτική προσωπική χαριστική', to:'στο cedo', g:'δοτ. ενικ. — β΄ προσ. προσωπική αντων.', d:'tu — εσύ' },
        { l:'mea', r:'Επιθετικός προσδ.', to:'στο sede', g:'αφαιρ. ενικ., θηλ. — κτητική αντων. α΄ προσ. (ένας κτήτορας)', d:'meus, mea, meum — δικός μου, δική μου, δικό μου', note:'Κλητ. ενικ. αρσ.: mi & meus.' },
        { l:'sede', r:'Αντικείμενο (σε αφαιρετική)', to:'στο cedo', g:'αφαιρ. ενικ.', d:'sedes, sedis (θηλ. γ΄) — η έδρα, το κάθισμα', note:'Γεν. πληθ.: sedum.' },
        { l:'cedo', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'cedo, cessi, cessum, cedere (3) — αποχωρώ, παραχωρώ', a:'».' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Hoc', r:'Επιθετικός προσδ.', to:'στο dictum', g:'αιτ. ενικ., ουδ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'dictum', r:'Αντικείμενο', to:'στο confirmavit', g:'αιτ. ενικ., ουδ.', d:'dictum, -i (ουδ. β΄) — ο λόγος' },
        { l:'paulo', r:'Αφαιρετική (οργανική) του μέτρου / της διαφοράς', to:'στο post', g:'αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'paulus, -a, -um — λίγος' },
        { l:'post', r:'Επιρρ. προσδ. του χρόνου', to:'στο confirmavit', g:'χρονικό επίρρημα', d:'post — έπειτα, μετά' },
        { l:'res', r:'Υποκείμενο', to:'στο confirmavit', g:'ονομ. ενικ.', d:'res, rei (θηλ. ε΄) — το πράγμα, η πραγματικότητα' },
        { l:'ipsa', r:'Επιθετικός προσδ.', to:'στο res', g:'ονομ. ενικ., θηλ. — δεικτική (ως οριστική) αντων.', d:'ipse, ipsa, ipsum — ο ίδιος, η ίδια, το ίδιο' },
        { l:'confirmavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'confirmo, confirmavi, confirmatum, confirmare (1) — επιβεβαιώνω', a:'.' }
      ]}
    ]},

    { n: 6, kids: [
      { l:'Nam', r:'Σύνδεσμος', g:'διασαφητικός (παρατακτικός) σύνδεσμος', d:'nam — δηλαδή', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'mortua est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — αποθετικό', d:'morior, mortuus sum, mori (3, 15 σε -io, αποθ.) — πεθαίνω', note:'Μτχ. μέλλ.: moriturus, -a, -um.' },
        { l:'Caecilia', r:'Υποκείμενο', to:'στο mortua est', g:'ονομ. ενικ.', d:'Caecilia, -ae (θηλ. α΄) — η Καικιλία', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. επιθετική αναφορική, προσδιοριστική στο Caecilia. Εισάγεται με την αναφορική αντωνυμία quam και εκφέρεται με οριστική παρακειμένου, γιατί δηλώνει το πραγματικό στο παρελθόν.', kids:[
          { l:'quam', r:'Αντικείμενο', to:'στο amavit', g:'αιτ. ενικ., θηλ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'Metellus', r:'Υποκείμενο', to:'στο amavit', g:'ονομ. ενικ.', d:'Metellus, -i (αρσ. β΄) — ο Μέτελλος', a:',' },
          { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική, ως επιρρ. προσδ. του χρόνου στο amavit. Εισάγεται με τον χρονικό σύνδεσμο dum (σύγχρονο) και εκφέρεται με οριστική παρακειμένου (παράλληλη διάρκεια στο παρελθόν).', kids:[
            { l:'dum', r:'Χρον. σύνδεσμος', g:'χρονικός σύνδεσμος (+ οριστική) — σύγχρονο', d:'dum — όσο, ενώ' },
            { l:'vixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'vivo, vixi, victum, vivere (3) — ζω', note:'Εννοούμενο υποκείμενο: Caecilia.', a:',' }
          ]},
          { l:'multum', r:'Επιρρ. προσδ. του ποσού', to:'στο amavit', g:'ποσοτικό επίρρημα', d:'multum — πολύ', note:'ΣΥΓΚΡ.: plus· ΥΠΕΡΘ.: plurimum.' },
          { l:'amavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'amo, amavi, amatum, amare (1) — αγαπώ', a:';' }
        ]}
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'postea', r:'Επιρρ. προσδ. του χρόνου', to:'στο duxit', g:'χρονικό επίρρημα', d:'postea — μετά, έπειτα' },
        { l:'is', r:'Υποκείμενο', to:'στο duxit', g:'ονομ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'puellam', r:'Αντικείμενο', to:'στο duxit', g:'αιτ. ενικ.', d:'puella, -ae (θηλ. α΄) — η κοπέλα' },
        { l:'in matrimonium', k:'matrimonium', r:'Εμπρόθετος επιρρ. προσδ. (είσοδος σε κατάσταση)', to:'στο duxit', g:'in (πρόθ. + αιτ.) + matrimonium (αιτ. ενικ., ουδ.)', d:'in — σε, προς· matrimonium, -ii/-i (ουδ. β΄) — ο γάμος' },
        { l:'duxit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'duco, duxi, ductum, ducere (3) — οδηγώ· «in matrimonium duco» = παντρεύομαι (για άνδρα)', note:'β΄ ενικ. προστ. ενεστ.: duc.', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Caecilia, uxor Metelli,", el:"Η Καικιλία, η σύζυγος του Μετέλλου," },
    { la:"dum petit", el:"ενώ επεδίωκε" },
    { la:"prisco more", el:"σύμφωνα με τα πατροπαράδοτα έθιμα" },
    { la:"nuptiale omen", el:"την εμφάνιση γαμήλιου οιωνού" },
    { la:"filiae sororis,", el:"για την κόρη της αδελφής της," },
    { la:"ipsa fecit omen.", el:"η ίδια δημιούργησε τον οιωνό." },
    { la:"Quodam nocte nam", el:"Μια νύχτα δηλαδή" },
    { la:"persedebat", el:"καθόταν (για πολλή ώρα)" },
    { la:"in sacello", el:"σε κάποιο μικρό ιερό" },
    { la:"cum filia sororis", el:"μαζί με την κόρη της αδελφής της" },
    { la:"expectabatque", el:"και περίμενε," },
    { la:"dum audiretur", el:"μέχρι να ακουστεί" },
    { la:"aliqua vox", el:"κάποια φωνή" },
    { la:"congruens", el:"που να ανταποκρινόταν" },
    { la:"proposito.", el:"στο σκοπό τους." },
    { la:"Tandem puella,", el:"Στο τέλος η κοπέλα," },
    { la:"fessa", el:"κουρασμένη" },
    { la:"longa mora standi,", el:"από την πολλή ορθοστασία," },
    { la:"rogavit materteram,", el:"ζήτησε από τη θεία της" },
    { la:"ut sibi cederet", el:"να της παραχωρήσει" },
    { la:"paulisper loco.", el:"για λίγο τη θέση της." },
    { la:"Tum Caecilia dixit puellae:", el:"Τότε η Καικιλία είπε στην κοπέλα:" },
    { la:"«ego libenter", el:"«Εγώ πρόθυμα" },
    { la:"tibi cedo sede mea».", el:"σου παραχωρώ τη θέση μου»." },
    { la:"Hoc dictum", el:"Αυτόν τον λόγο" },
    { la:"confirmavit post paulo", el:"επιβεβαίωσε μετά από λίγο" },
    { la:"ipsa res.", el:"η ίδια η πραγματικότητα." },
    { la:"Mortua est nam Caecilia,", el:"Πέθανε δηλαδή η Καικιλία," },
    { la:"quam Metellus,", el:"την οποία ο Μέτελλος," },
    { la:"dum vixit,", el:"όσο ζούσε," },
    { la:"amavit multum;", el:"την αγαπούσε πολύ·" },
    { la:"postea is", el:"αργότερα αυτός" },
    { la:"duxit puellam in matrimonium.", el:"πήρε την κοπέλα για γυναίκα του." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"Caecilia, -ae", note:"μόνο ενικ." },
        { form:"filia, -ae", note:"δοτ. & αφαιρ. πληθ.: filiis & filiabus" },
        { form:"matertera, -ae" },
        { form:"mora, -ae" },
        { form:"puella, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"locus, -i", note:"ετερογενές στον πληθ.: loci & loca" },
        { form:"Metellus, -i", note:"μόνο ενικ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"dictum, -i" },
        { form:"matrimonium, -ii / -i" },
        { form:"propositum, -i" },
        { form:"sacellum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"mos, moris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"nox, noctis", note:"αφαιρ.: nocte & noctu· γεν. πληθ.: noctium" },
        { form:"soror, sororis" },
        { form:"sedes, sedis", note:"γεν. πληθ.: sedum" },
        { form:"uxor, uxoris" },
        { form:"vox, vocis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"omen, ominis" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[ { form:"res, rei" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"fessus, -a, -um", note:"μτχ. παρακ. του fatiscor, ως επίθετο" },
      { form:"longus, -a, -um" },
      { form:"paulus, -a, -um" },
      { form:"priscus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"nuptialis, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"fessus, -a, -um", comp:"—", sup:"—" },
      { pos:"longus, -a, -um", comp:"longior, -ior, -ius", sup:"longissimus, -a, -um" },
      { pos:"paulus, -a, -um", comp:"—", sup:"—" },
      { pos:"priscus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"nuptialis, -is, -e", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"aliqui, aliqua, aliquod", kind:"Αόριστη", extra:"επιθετική" },
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσ." },
    { form:"hic, haec, hoc", kind:"Δεικτική" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική", extra:"ως οριστική" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"meus, mea, meum", kind:"Κτητική", extra:"α΄ προσ., ένας κτήτορας" },
    { form:"qui, quae, quod", kind:"Αναφορική" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική" },
    { form:"se", kind:"Προσωπική", extra:"γ΄ προσ. (αυτοπαθής)" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσ." }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"amo", perf:"amavi", sup:"amatum", inf:"amare", note:"" },
      { pres:"confirmo", perf:"confirmavi", sup:"confirmatum", inf:"confirmare", note:"" },
      { pres:"expecto", perf:"expectavi", sup:"expectatum", inf:"expectare", note:"" },
      { pres:"rogo", perf:"rogavi", sup:"rogatum", inf:"rogare", note:"" },
      { pres:"sto", perf:"steti", sup:"statum", inf:"stare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"persedeo", perf:"persedi", sup:"persessum", inf:"persedere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"cedo", perf:"cessi", sup:"cessum", inf:"cedere", note:"" },
      { pres:"congruo", perf:"congrui", sup:"—", inf:"congruere", note:"" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"β΄ ενικ. προστ.: dic" },
      { pres:"duco", perf:"duxi", sup:"ductum", inf:"ducere", note:"β΄ ενικ. προστ.: duc" },
      { pres:"facio", perf:"feci", sup:"factum", inf:"facere", note:"15 σε -io· β΄ ενικ. προστ.: fac" },
      { pres:"peto", perf:"peti(v)i", sup:"petitum", inf:"petere", note:"" },
      { pres:"vivo", perf:"vixi", sup:"victum", inf:"vivere", note:"" },
      { pres:"morior", perf:"mortuus sum", sup:"—", inf:"mori", note:"αποθ., 15 σε -io· μτχ. μέλλ.: moriturus" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"audio", perf:"audivi", sup:"auditum", inf:"audire", note:"" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7 (προαιρετικό): SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"dum: τριπλή χρήση", body:"Το dum εμφανίζεται με τρεις χρήσεις: (α) + οριστική ενεστώτα για το σύγχρονο, ως λατινισμός (dum ... petit)· (β) + υποτακτική για το υστερόχρονο-προσδοκία (dum ... audiretur)· (γ) + οριστική παρακειμένου για παράλληλη διάρκεια στο παρελθόν (dum vixit)." },
    { tag:"Πρόταση", title:"ut βουλητική — ιδιομορφία", body:"Η «ut sibi paulisper loco cederet» είναι βουλητική (έμμ. αντικ. στο rogavit)· υποτ. παρατ. λόγω ιστορικού χρόνου, με ιδιομορφία στην ακολουθία των χρόνων (η βούληση ιδωμένη τη στιγμή που γεννιέται, όχι της πραγματοποίησης)." },
    { tag:"Ρήμα", title:"cedo + αφαιρετική", body:"Το cedo συντάσσεται με αντικείμενο σε αφαιρετική· γι' αυτό τα loco και sede είναι αντικείμενα (όχι εμπρόθετοι ή απλοί επιρρηματικοί προσδιορισμοί)." },
    { tag:"Ρήμα", title:"mortua est: αποθετικό morior", body:"Το mortua est είναι γ΄ ενικ. παρακειμένου του αποθετικού morior, mortuus sum, mori (3, 15 σε -io) = πεθαίνω· έχει ενεργητική σημασία και μετοχή μέλλοντα moriturus." },
    { tag:"Μετοχή", title:"fessa: αιτιολογική μετοχή", body:"Η fessa (μτχ. παρακ. του αποθ. fatiscor) είναι συνημμένη αιτιολογική μετοχή στο puella· το mora είναι αφαιρετική του εξωτερικού αναγκαστικού αιτίου, με συμπλήρωμα τη γενική γερουνδίου standi." },
    { tag:"Ουσιαστικό", title:"filia & locus: ιδιαιτερότητες", body:"filia: δοτ. & αφαιρ. πληθ. filiis & filiabus (για διάκριση από το filius). locus: ετερογενές στον πληθ. — loci, locorum (χωρία βιβλίου) & loca, locorum (τόποι)." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"congruens",
        to:"quae congrueret",
        note:"Επιθετική μετοχή ενεστώτα (σύγχρονο)· αναλύεται σε αναφορική πρόταση με quae + υποτακτική (έλξη προς την υποτακτική audiretur), χρόνου παρατατικού (εξάρτηση από ιστορικό χρόνο audiretur)." },
      { from:"fessa",
        to:[
        "quod fessa erat (+ οριστ. υπερσ.) — αιτιολογία αντικειμενικά αποδεκτή",
        "quod fessa esset (+ υποτ. υπερσ.) — αιτιολογία υποθετική/υποκειμενική",
        "cum fessa esset (cum + υποτ. υπερσ.) — εσωτερική, λογική διεργασία"],
        note:"Επιρρηματική αιτιολογική μετοχή παρακειμένου (προτερόχρονο)· εξάρτηση από ιστορικό χρόνο (rogavit)." }
    ]},
    { id:"Β", label:"Μετατροπή των δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Caecilia, uxor Metelli, dum more prisco omen nuptiale petit filiae sororis, ipsa fecit omen",
        to:"Caecilia, uxor Metelli, more prisco omen nuptiale petens filiae sororis, ipsa fecit omen",
        note:"Η χρονική πρόταση → επιρρηματική χρονική μετοχή, συνημμένη στο υποκ. Caecilia του fecit." },
      { from:"Nam mortua est Caecilia, quam Metellus, dum vixit, multum amavit",
        to:"Nam mortua est Caecilia, quam Metellus viventem multum amavit",
        note:"Η χρονική πρόταση → χρονική μετοχή, συνημμένη στο αντικ. quam του amavit· η μετοχή σε ενεστώτα (παράλληλη διάρκεια), αν και το vixit είναι παρακ." }
    ]},
    { id:"Γ", label:"Μετατροπή κυρίων προτάσεων σε μετοχικές φράσεις", items:[
      { from:"Nam in sacello quodam nocte cum sororis filia persedebat expectabatque dum aliqua vox … audiretur",
        to:"Nam in sacello quodam nocte cum sororis filia (Caecilia) persedens expectabat dum aliqua vox … audiretur",
        note:"Η κύρια → επιρρηματική χρονική μετοχή, συνημμένη στο εννοούμενο υποκ. Caecilia του expectabat." }
    ]},
    { id:"Δ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Caecilia, uxor Metelli, dum more prisco omen nuptiale petit filiae sororis, ipsa fecit omen", to:"Caecilia, uxore Metelli, dum more prisco omen nuptiale (υποκ.) petitur filiae sororis, ab ipsa factum est omen (υποκ.)" },
      { from:"Ego libenter tibi mea sede cedo", to:"Mea sedes (υποκ.) libenter tibi a me ceditur" },
      { from:"Hoc dictum paulo post res ipsa confirmavit",
        to:"Hoc dictum (υποκ.) paulo post re ipsa confirmatum est",
        note:"Το ποιητικό αίτιο (re ipsa) με απλή αφαιρετική, γιατί είναι άψυχο." },
      { from:"quam Metellus … multum amavit", to:"quae a Metello multum amata est" },
      { from:"Postea is puellam in matrimonium duxit", to:"Postea ab eo puella in matrimonium ducta est" }
    ]},
    { id:"Ε", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"Το κείμενο σε ευθύ λόγο (εξάρτηση: Scriptor tradit / tradidit)", to:"Scriptor tradit / tradidit Caeciliam, uxorem Metelli, dum … petat / peteret ipsam fecisse omen; Caeciliam (eam) in sacello quodam … persedere expectareque dum … audiretur; tandem puellam … fessam, rogavisse materteram, ut sibi … cederet; (tum) Caeciliam puellae dixisse se libenter illi sua sede cedere; illud dictum paulo post rem ipsam confirmavisse; mortuam esse Caeciliam, quam Metellus, dum vixerit / vixisset, multum amaverit / amavisset; postea eum duxisse." }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"Tandem puella, …, rogavit materteram, ut sibi paulisper loco cederet",
        to:[
        "(προστακτική) Matertera, quaeso, mihi paulisper loco cede",
        "(βουλητική υποτακτική) Matertera, mihi paulisper loco cedas"] }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"Caecilia", el:"Καικιλία" },
    { la:"uxor", el:"(γαλλ.) uxori-cide (= συζυγοκτονία)" },
    { la:"audiretur [< audio]", el:"ἀΐω" },
    { la:"puella, puellae, puellam [< puer]", el:"(γαλλ.) puéril (= παιδικός)" },
    { la:"Metelli [< Metellus]", el:"Μέτελλος" },
    { la:"more [< mos]", el:"αμοραλισμός (< γαλλ.) // (αγγλ.) moral (= ηθικό), morality (= ηθική)" },
    { la:"prisco [< prior]", el:"πρό, πρότερος, πριν // (γαλλ.) priorité (= προτεραιότητα)" },
    { la:"omen", el:"(αγγλ.) omen (= οιωνός)" },
    { la:"nuptiale [< nuptiae]", el:"νύμφη // (αγγλ.) nuptial (= γαμήλιος) // (γαλλ.) nuptialité (= ο αριθμός των γάμων κατ' έτος)" },
    { la:"petit [< peto]", el:"πίπτω, πέτομαι" },
    { la:"sororis [< soror]", el:"(γαλλ.) sœur // (αγγλ.) sister" },
    { la:"fecit [< facio]", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο)" },
    { la:"sacello [< sacrum < sacer]", el:"(αγγλ.) sacrifice (= θυσία) // (γαλλ.) sanctifier (= αγιάζω)" },
    { la:"nocte [< nox]", el:"νύξ (γεν. νυκτός) // (ισπαν.) noche // (γαλλ.) nocturne (= νυχτερινός)" },
    { la:"per-sedebat [< per-sedeo], sede", el:"ἕζομαι, ἕδρα // (αγγλ.) pos-session (= κατοχή, κτήση)" },
    { la:"expectabat [< expecto < ex + specto]", el:"(αγγλ.) expect (= αναμένω), pro-spect (= προοπτική) // (γαλλ.) expectative (= προσδοκία)" },
    { la:"vox", el:"(αγγλ.) vocal (= φωνητικός), voice (= φωνή), re-vocation (= ανάκληση) // (γαλλ.) vocabulaire (= λεξιλόγιο)" },
    { la:"congruens [< congruo]", el:"(αγγλ.) congruent (= σύμφωνος) // (γαλλ.) congruence (= αναλογία, αντιστοιχία)" },
    { la:"pro-posito [< pro-pono]", el:"(γαλλ.) positionner (= τοποθετώ), position (= θέση), proposition (= πρόταση)" },
    { la:"-ulus, pullus (= μικρό ζώο)", el:"(κατάληξη) -πουλος" },
    { la:"longa [< longus]", el:"δολιχός // (αγγλ.) long // (γαλλ.) longue" },
    { la:"mora", el:"μέριμνα, μάρτυς // μορατόριουμ [< moratorius (= αυτός που καθυστερεί)]" },
    { la:"standi [< sto]", el:"ἵστημι, στάσις // (γαλλ.) station (= στάση, σταθμός)" },
    { la:"fessa [< fatiscor]", el:"(γαλλ.) fatigué (= κουρασμένος)" },
    { la:"rogavit [< rogo]", el:"(γαλλ.) inter-rogatif (= ερωτηματικός)" },
    { la:"materteram, matri-monium [< mater]", el:"μήτηρ // (γαλλ.) maternel (= μητρικός), matrimonial (= συζυγικός, γαμήλιος)" },
    { la:"paulisper [< paulus], paulo", el:"παῦρος (= μικρός, λίγος)" },
    { la:"loco [< locus]", el:"(γαλλ.) locale (= τοπικός) // (αγγλ.) location (= τοποθεσία)" },
    { la:"cederet [< cedo]", el:"(γαλλ.) céder (= παραχωρώ), re-cession (= ύφεση, επιβράδυνση)" },
    { la:"dixit, dictum [< dico]", el:"δείκνυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση)" },
    { la:"ego", el:"ἐγώ" },
    { la:"libenter", el:"(γερμ.) Liebe (= αγάπη)" },
    { la:"res", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός)" },
    { la:"con-firmavit [< con-firmo]", el:"(γαλλ.) confirmer (= επιβεβαιώνω) // φίρμα (< ιταλ.)" },
    { la:"mortua [< morior]", el:"βροτός // (γαλλ.) mort (= νεκρός) // (αγγλ.) mortal (= θνητός)" },
    { la:"vivit [< vivo]", el:"βίος // βιταλισμός (< γαλλ. vitalisme), βιταμίνη (< γαλλ. vitamine)" },
    { la:"multum", el:"μάλα (= πολύ)" },
    { la:"amavit [< amo]", el:"(γαλλ.) amour (= αγάπη), ami (= φίλος), amical (= φιλικός)" },
    { la:"duxit [< duco]", el:"(γαλλ.) conducteur (= οδηγός) // ductor, ad-ductor" }
  ]
};

export default UNIT;
