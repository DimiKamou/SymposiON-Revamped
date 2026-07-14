export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 43,
  title: "Η οργή της μάνας",
  latinTitle: "Lectio XLIII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Ευθεία ερώτηση ολικής αγνοίας απλή, στην οποία περιμένουμε αρνητική απάντηση (ρητορική ερώτηση).', kids:[
        { l:'Num', r:'Ερωτηματικό μόριο', g:'ερωτηματικό μόριο (εισάγει ευθεία ερωτ. ολικής αγνοίας — αναμένεται αρνητ. απάντηση)', d:'num — μήπως' },
        { l:'veni', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'venio, veni, ventum, venire (4) — έρχομαι', note:'Εννοούμενο υποκείμενο: ego.' },
        { l:'ad hostem', k:'hostis', r:'Εμπρόθετος προσδ. της εχθρικής κατεύθυνσης (σε πρόσωπο)', to:'στο veni', g:'ad (πρόθ. + αιτ.) + hostem (αιτ. ενικ.)', d:'ad — σε, προς· hostis, -is (αρσ. γ΄) — ο εχθρός (γεν. πληθ. hostium)' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Ευθεία ερώτηση ολικής αγνοίας απλή, στην οποία περιμένουμε αρνητική απάντηση (ρητορική ερώτηση).', kids:[
        { l:'sum', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ.', d:'sum, fui, –, esse — είμαι', note:'Εννοούμενο υποκείμενο: ego.' },
        { l:'captiva', r:'Κατηγορούμενο', to:'στο (εννοούμενο) ego (μέσω του sum)', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'captivus, -a, -um — αιχμάλωτος' },
        { l:'in castris', k:'castra', r:'Εμπρόθετος προσδ. της στάσης σε τόπο', to:'στο sum', g:'in (πρόθ. + αφαιρ.) + castris (αφαιρ. πληθ., ουδ.)', d:'in — σε· castra, -orum (ουδ. β΄) — το στρατόπεδο (ενικ. castrum = φρούριο· ετερόσημο)' },
        { l:'tuis', r:'Επιθετικός προσδ.', to:'στο castris', g:'αφαιρ. πληθ., ουδ. — κτητική αντων. β΄ προσ. (ένας κτήτορας)', d:'tuus, tua, tuum — δικός σου', a:'?' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Ευθεία ερώτηση ολικής αγνοίας απλή, χωρίς εισαγωγικό ερωτηματικό μόριο (για έμφαση).', kids:[
        { l:'In hoc', k:'hic, haec, hoc', r:'Εμπρόθετος προσδ. (εισόδου σε κατάσταση)', to:'στο traxit', g:'in (πρόθ. + αιτ.) + hoc (αιτ. ενικ., ουδ. — δεικτική αντων.)', d:'in — σε (εδώ: σε τέτοιο σημείο)· hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'me', r:'Αντικείμενο', to:'στο traxit', g:'αιτ. ενικ. — α΄ προσ. προσωπικής αντων.', d:'ego — εγώ' },
        { l:'traxit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'traho, traxi, tractum, trahere (3) — τραβώ, σύρω' },
        { l:'longa', r:'Επιθετικός προσδ.', to:'στο vita', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'longus, -a, -um — μακρόχρονος' },
        { l:'vita', r:'Υποκείμενο', to:'στο traxit', g:'ονομ. ενικ.', d:'vita, -ae (θηλ. α΄) — η ζωή' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
        { l:'infelix', r:'Επιθετικός προσδ.', to:'στο senecta', g:'ονομ. ενικ., θηλ. — επίθ. γ΄ κλ.', d:'infelix, -icis — δυστυχισμένος' },
        { l:'senecta', r:'Υποκείμενο', to:'στο traxit', g:'ονομ. ενικ.', d:'senecta, -ae (θηλ. α΄) — τα γηρατειά (χωρίς πληθ.)', a:',' },
        { type:'sub', key:'symperasmatiki', label:'Συμπερασματική', note:'Δευτ. επιρρ. συμπερασματική· εισάγεται με τον συμπερασματικό σύνδεσμο ut (καταφατική)· εκφέρεται με υποτακτική παρατατικού (δυνητική, εξάρτηση από ιστορικό χρόνο)· ιδιομορφία στην ακολουθία των χρόνων (συγχρονισμός κύριας–δευτ.). Λειτουργεί ως επιρρ. προσδ. του αποτελέσματος στο traxit.', kids:[
          { l:'ut', r:'Συμπερασματικός σύνδεσμος', g:'συμπερασματικός σύνδεσμος (+ υποτακτ.)', d:'ut — ώστε' },
          { l:'viderem', r:'Ρήμα', g:'α΄ ενικ. υποτακτ. παρατατικού ενεργ. φωνής', d:'video, vidi, visum, videre (2) — βλέπω', note:'Εννοούμενο υποκείμενο: ego.' },
          { l:'te', r:'Αντικείμενο', to:'στο viderem', g:'αιτ. ενικ. — β΄ προσ. προσωπικής αντων.', d:'tu — εσύ' },
          { l:'primum', r:'Επιρρ. προσδ. του χρόνου', to:'στο viderem', g:'χρονικό επίρρημα', d:'primum — πρώτα' },
          { l:'exsulem', r:'Κατηγορούμενο', to:'στο te (αντικ.)', g:'αιτ. ενικ.', d:'exsul, exsulis (αρσ. γ΄) — ο εξόριστος' },
          { l:'deinde', r:'Επιρρ. προσδ. του χρόνου', to:'στο viderem', g:'χρονικό επίρρημα', d:'deinde — έπειτα' },
          { l:'hostem', r:'Κατηγορούμενο', to:'στο te (αντικ.)', g:'αιτ. ενικ.', d:'hostis, -is (αρσ. γ΄) — ο εχθρός', a:'?' }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Ευθεία ερώτηση μερικής αγνοίας.', kids:[
        { l:'Qui', r:'Επιρρ. προσδ. του τρόπου', to:'στο potuisti', g:'ερωτηματικό τροπικό επίρρημα', d:'qui — πώς;' },
        { l:'potuisti', r:'Ρήμα', g:'β΄ ενικ. οριστ. παρακειμένου', d:'possum, potui, –, posse — μπορώ', note:'Εννοούμενο υποκείμενο: tu (και του απαρεμφάτου populari — ταυτοπροσωπία).' },
        { l:'populari', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο potuisti', g:'απαρέμφατο ενεστ. — αποθετικό', d:'populor, populatus sum, populari (1, αποθ.) — λεηλατώ, ερημώνω' },
        { l:'hanc', r:'Επιθετικός προσδ.', to:'στο terram', g:'αιτ. ενικ., θηλ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'terram', r:'Αντικείμενο', to:'στο populari', g:'αιτ. ενικ.', d:'terra, -ae (θηλ. α΄) — η γη, η χώρα', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. επιθετική αναφορική, προσδιοριστική στο terram· εισάγεται με την αναφορική αντων. quae· εκφέρεται με οριστική παρακειμένου (πραγματικό, παρελθόν).', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο genuit', g:'ονομ. ενικ., θηλ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'te', r:'Αντικείμενο', to:'στο genuit', g:'αιτ. ενικ. — β΄ προσ. προσωπικής αντων.', d:'tu — εσύ' },
          { l:'genuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'gigno, genui, genitum, gignere (3) — γεννώ' }
        ]},
        { l:'atque', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'atque — και', conn:true },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. επιθετική αναφορική, προσδιοριστική στο terram· εισάγεται με την (εννοούμενη) αναφορική αντων. quae· εκφέρεται με οριστική παρακειμένου (πραγματικό, παρελθόν).', kids:[
          { l:'aluit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'alo, alui, al(i)tum, alere (3) — τρέφω', note:'Εννοούνται: quae (υποκ.), te (αντικ.).', a:'?' }
        ]}
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Ευθεία ερώτηση ολικής αγνοίας απλή, χωρίς εισαγωγικό ερωτηματικό μόριο (για έμφαση).', kids:[
        { l:'Non', r:'Άρνηση', to:'στο cecidit', g:'αρνητικό μόριο', d:'non — όχι, δεν' },
        { l:'tibi', r:'Δοτική προσωπική (ηθική)', to:'στο cecidit', g:'δοτ. ενικ. — β΄ προσ. προσωπικής αντων.', d:'tu — εσύ' },
        { l:'cecidit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'cado, cecidi, casum, cadere (3) — πέφτω' },
        { l:'ira', r:'Υποκείμενο', to:'στο cecidit', g:'ονομ. ενικ.', d:'ira, -ae (θηλ. α΄) — η οργή' },
        { l:'ingredienti', r:'Χρονική μετοχή (συνημμένη στο tibi)', to:'στο tibi', g:'δοτ. ενικ., αρσ. — μετοχή ενεστ. (αποθ.)', d:'ingredior, ingressus sum, ingredi (3, 15 σε -io, αποθ.) — εισβάλλω, μπαίνω' },
        { l:'fines', r:'Αντικείμενο', to:'στο ingredienti', g:'αιτ. πληθ.', d:'finis, -is (αρσ. γ΄) — το σύνορο, το τέλος (γεν. πληθ. finium)' },
        { l:'patriae', r:'Γενική κτητική', to:'στο fines', g:'γεν. ενικ.', d:'patria, -ae (θηλ. α΄) — η πατρίδα', a:'?' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Ευθεία ερώτηση μερικής αγνοίας.', kids:[
        { type:'sub', key:'paraxoritiki', label:'Παραχωρητική', note:'Δευτ. επιρρ. παραχωρητική· εισάγεται με τον παραχωρητικό σύνδεσμο quamvis· εκφέρεται με οριστική υπερσυντελίκου (η σύνταξη quamvis + οριστική είναι ποιητική/μετακλασική· αναφορά στο παρελθόν). Λειτουργεί ως επιρρ. προσδ. της παραχώρησης στο succurrit.', kids:[
          { l:'Quamvis', r:'Παραχωρητικός σύνδεσμος', g:'παραχωρητικός σύνδεσμος (εδώ + οριστική)', d:'quamvis — αν και, παρόλο που' },
          { l:'perveneras', r:'Ρήμα', g:'β΄ ενικ. οριστ. υπερσυντελίκου ενεργ. φωνής', d:'pervenio, perveni, perventum, pervenire (4) — φθάνω', note:'Εννοούμενο υποκείμενο: tu.' },
          { l:'infesto', r:'Επιθετικός προσδ.', to:'στο animo', g:'αφαιρ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'infestus, -a, -um — εχθρικός' },
          { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
          { l:'minaci', r:'Επιθετικός προσδ.', to:'στο animo', g:'αφαιρ. ενικ., αρσ. — επίθ. γ΄ κλ.', d:'minax, -acis — απειλητικός' },
          { l:'animo', r:'Αφαιρετική του τρόπου', to:'στο perveneras', g:'αφαιρ. ενικ.', d:'animus, -i (αρσ. β΄) — η ψυχή, η διάθεση', a:',' }
        ]},
        { l:'cur', r:'Επιρρ. προσδ. της αιτίας', to:'στο succurrit', g:'ερωτηματικό επίρρημα', d:'cur — γιατί;', a:',' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική· εισάγεται με τον καθαρά χρονικό cum· εκφέρεται με οριστική παρακειμένου (το σύγχρονο στο παρελθόν). Λειτουργεί ως επιρρ. προσδ. του χρόνου στο succurrit.', kids:[
          { l:'cum', r:'Χρονικός σύνδεσμος', g:'χρονικός σύνδεσμος (καθαρά χρονικός, + οριστική)', d:'cum — όταν' },
          { l:'in conspectu', k:'conspectus', r:'Εμπρόθετος προσδ. της κατάστασης', to:'στο fuit', g:'in (πρόθ. + αφαιρ.) + conspectu (αφαιρ. ενικ.)', d:'in — σε· conspectus, -us (αρσ. δ΄) — η θέα, η όψη' },
          { l:'fuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου', d:'sum, fui, –, esse — είμαι, υπάρχω' },
          { l:'Roma', r:'Υποκείμενο', to:'στο fuit', g:'ονομ. ενικ.', d:'Roma, -ae (θηλ. α΄) — η Ρώμη (χωρίς πληθ.)', a:',' }
        ]},
        { l:'non', r:'Άρνηση', to:'στο succurrit', g:'αρνητικό μόριο', d:'non — όχι, δεν' },
        { l:'succurrit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'succurrit, succurrit, succursum, succurrere (3, απρόσ.) — έρχεται στο μυαλό' },
        { l:'tibi', r:'Δοτική προσωπική', to:'στο succurrit', g:'δοτ. ενικ. — β΄ προσ. προσωπικής αντων.', d:'tu — εσύ', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως (τα λόγια που θα έπρεπε να είχαν έρθει στο μυαλό).', kids:[
        { l:'«intra illa moenia', k:'moenia', r:'Εμπρόθετος προσδ. της στάσης σε τόπο', to:'στο sunt', g:'intra (πρόθ. + αιτ.) + illa (αιτ. πληθ., ουδ. — δεικτική αντων.) + moenia (αιτ. πληθ.)', d:'intra — μέσα σε· ille, illa, illud — εκείνος· moenia, -ium (ουδ. γ΄, χωρίς ενικ.) — τα τείχη', note:'illa: επιθετικός προσδ. στο moenia.' },
        { l:'sunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ.', d:'sum, fui, –, esse — είμαι, υπάρχω' },
        { l:'domus', r:'Υποκείμενο', to:'στο sunt', g:'ονομ. ενικ.', d:'domus, -us (θηλ. δ΄) — το σπίτι' },
        { l:'ac', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'ac — και' },
        { l:'penates', r:'Υποκείμενο', to:'στο sunt', g:'ονομ. πληθ.', d:'penates, -ium (αρσ. γ΄, χωρίς ενικ.) — οι θεοί του σπιτιού, οι εφέστιοι θεοί' },
        { l:'mei', r:'Επιθετικός προσδ.', to:'στο penates', g:'ονομ. πληθ., αρσ. — κτητική αντων. α΄ προσ. (ένας κτήτορας)', d:'meus, mea, meum — δικός μου', a:',' },
        { l:'mater', r:'Υποκείμενο', to:'στο sunt', g:'ονομ. ενικ.', d:'mater, matris (θηλ. γ΄) — η μητέρα' },
        { l:'coniunx', r:'Υποκείμενο', to:'στο sunt', g:'ονομ. ενικ.', d:'coniu(n)x, coniugis (θηλ. γ΄) — η σύζυγος' },
        { l:'liberique', r:'Υποκείμενο', to:'στο sunt', g:'liberi (ονομ. πληθ., αρσ.) + -que (εγκλιτικός συμπλεκτικός σύνδεσμος)', d:'liberi, -orum (αρσ. β΄, χωρίς ενικ.) — τα παιδιά· -que — και', a:'»?' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως· απόδοση ευθέος υποθετικού λόγου β΄ είδους (μη πραγματικό).', kids:[
        { l:'Ergo', r:'Συμπερασματικός σύνδεσμος', g:'συμπερασματικός σύνδεσμος', d:'ergo — επομένως, λοιπόν' },
        { type:'sub', key:'ypothetiki', label:'Υποθετική', note:'Δευτ. επιρρ. υποθετική (υπόθεση)· εισάγεται με τον υποθετικό σύνδεσμο nisi (αρνητική, η άρνηση σε όλο το περιεχόμενο)· εκφέρεται με υποτακτική υπερσυντελίκου του απραγματοποίητου (αντίθετο του πραγματικού στο παρελθόν). Λειτουργεί ως επιρρ. προσδ. της προϋπόθεσης στο oppugnaretur — υποθ. λόγος β΄ είδους (υπόθεση: παρελθόν, απόδοση: παρόν).', kids:[
          { l:'nisi', r:'Υποθετικός σύνδεσμος', g:'υποθετικός σύνδεσμος (εισάγει αρνητική υπόθεση)', d:'nisi — αν δεν' },
          { l:'ego', r:'Υποκείμενο', to:'στο peperissem', g:'ονομ. ενικ. — α΄ προσ. προσωπικής αντων.', d:'ego — εγώ' },
          { l:'peperissem', r:'Ρήμα', g:'α΄ ενικ. υποτακτ. υπερσυντελίκου ενεργ. φωνής', d:'pario, peperi, partum, parere (3, 15 σε -io) — γεννώ', note:'Εννοούμενο αντικείμενο: te.', a:',' }
        ]},
        { l:'Roma', r:'Υποκείμενο', to:'στο oppugnaretur', g:'ονομ. ενικ.', d:'Roma, -ae (θηλ. α΄) — η Ρώμη (χωρίς πληθ.)' },
        { l:'non', r:'Άρνηση', to:'στο oppugnaretur', g:'αρνητικό μόριο', d:'non — όχι, δεν' },
        { l:'oppugnaretur', r:'Ρήμα', g:'γ΄ ενικ. υποτακτ. παρατατικού παθ. φωνής', d:'oppugno, oppugnavi, oppugnatum, oppugnare (1) — πολιορκώ', a:';' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως· απόδοση ευθέος υποθετικού λόγου β΄ είδους (μη πραγματικό στο παρόν).', kids:[
        { type:'sub', key:'ypothetiki', label:'Υποθετική', note:'Δευτ. επιρρ. υποθετική· εισάγεται με τον υποθετικό σύνδεσμο nisi (αρνητική)· εκφέρεται με υποτακτική υπερσυντελίκου του απραγματοποίητου. Λειτουργεί ως επιρρ. προσδ. της προϋπόθεσης στο essem — υποθ. λόγος β΄ είδους (υπόθεση και απόδοση στο παρόν).', kids:[
          { l:'nisi', r:'Υποθετικός σύνδεσμος', g:'υποθετικός σύνδεσμος (αρνητική υπόθεση)', d:'nisi — αν δεν' },
          { l:'haberem', r:'Ρήμα', g:'α΄ ενικ. υποτακτ. παρατατικού ενεργ. φωνής', d:'habeo, habui, habitum, habere (2) — έχω', note:'Εννοούμενο υποκείμενο: ego.' },
          { l:'filium', r:'Αντικείμενο', to:'στο haberem', g:'αιτ. ενικ.', d:'filius, -ii/-i (αρσ. β΄) — ο γιος (κλητ. fili)', a:',' }
        ]},
        { l:'essem', r:'Ρήμα', g:'α΄ ενικ. υποτακτ. παρατατικού', d:'sum, fui, –, esse — είμαι, υπάρχω', note:'Εννοούμενο υποκείμενο: ego.' },
        { l:'mortua', r:'Επιρρ. κατηγορούμενο του χρόνου (μετοχή)', to:'στο (εννοούμενο) ego (μέσω του essem)', g:'ονομ. ενικ., θηλ. — μετοχή παρακειμένου (αποθ.)', d:'morior, mortuus sum, mori (3, 15 σε -io, αποθ.) — πεθαίνω (μτχ. παρακ. mortuus, -a, -um)' },
        { l:'libera', r:'Κατηγορούμενο', to:'στο (εννοούμενο) ego (μέσω του essem)', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'liber, -era, -erum — ελεύθερος' },
        { l:'in libera patria', k:'patria', r:'Εμπρόθετος προσδ. της στάσης σε τόπο', to:'στο essem', g:'in (πρόθ. + αφαιρ.) + libera (αφαιρ. ενικ., θηλ. — επίθ.) + patria (αφαιρ. ενικ.)', d:'in — σε· liber, -era, -erum — ελεύθερος· patria, -ae (θηλ. α΄) — η πατρίδα', note:'libera (το 2ο): επιθετικός προσδ. στο patria.', a:'.' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Ego', r:'Υποκείμενο', to:'στο possum', g:'ονομ. ενικ. — α΄ προσ. προσωπικής αντων.', d:'ego — εγώ', note:'Υποκείμενο και του απαρεμφάτου pati (ταυτοπροσωπία).' },
        { l:'iam', r:'Επιρρ. προσδ. του χρόνου', to:'στο pati', g:'χρονικό επίρρημα', d:'iam — πια, ήδη' },
        { l:'nihil', r:'Αντικείμενο', to:'στο pati', g:'αιτ. ενικ., ουδ. — αόριστη ουσιαστική αντων.', d:'nihil — τίποτα' },
        { l:'possum', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ.', d:'possum, potui, –, posse — μπορώ' },
        { l:'pati', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο possum', g:'απαρέμφατο ενεστ. — αποθετικό', d:'patior, passus sum, pati (3, 15 σε -io, αποθ.) — υπομένω, παθαίνω' }
      ]},
      { l:'nec', r:'Σύνδεσμος', g:'αντιθετικός σύνδεσμος', d:'nec — και δεν, ούτε', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'diu', r:'Επιρρ. προσδ. του χρόνου', to:'στο futura sum', g:'χρονικό επίρρημα', d:'diu — για πολύ καιρό' },
        { l:'futura sum', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ. περιφραστικής συζυγίας', d:'sum, fui, –, esse — είμαι, υπάρχω (ενεργ. περιφρ. συζ.)', note:'Εννοούμενο υποκείμενο: ego.' },
        { l:'miserrima', r:'Κατηγορούμενο', to:'στο (εννοούμενο) ego (μέσω του futura sum)', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ. (υπερθ. βαθμού)', d:'miser, -era, -erum — δυστυχισμένος (υπερθ. miserrimus, -a, -um)', a:':' }
      ]}
    ]},

    { n: 9, kids: [
      { l:'at', r:'Αντιθετικός σύνδεσμος', g:'αντιθετικός σύνδεσμος', d:'at — αλλά', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως· απόδοση ευθέος υποθετικού λόγου α΄ είδους (ανοικτή υπόθεση).', kids:[
        { l:'contra', r:'Επιρρ. προσδ. του τρόπου', to:'στο manet', g:'τροπικό επίρρημα', d:'contra — αντίθετα' },
        { l:'hos', r:'Αντικείμενο', to:'στο manet', g:'αιτ. πληθ., αρσ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό', a:',' },
        { type:'sub', key:'ypothetiki', label:'Υποθετική', note:'Δευτ. επιρρ. υποθετική· εισάγεται με τον υποθετικό σύνδεσμο si (καταφατική)· εκφέρεται με οριστική ενεστώτα (αναφορά στο παρόν). Λειτουργεί ως επιρρ. προσδ. της προϋπόθεσης στο manet — υποθ. λόγος α΄ είδους (ανοικτή υπόθεση στο παρόν).', kids:[
          { l:'si', r:'Υποθετικός σύνδεσμος', g:'υποθετικός σύνδεσμος (καταφατική υπόθεση)', d:'si — αν' },
          { l:'pergis', r:'Ρήμα', g:'β΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'pergo, perrexi, perrectum, pergere (3) — κατευθύνομαι· εδώ: συνεχίζω', note:'Εννοούμενο υποκείμενο: tu.', a:',' }
        ]},
        { l:'manet', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'maneo, mansi, mansum, manere (2) — περιμένω' },
        { l:'aut', r:'Διαζευκτικός σύνδεσμος', g:'διαζευκτικός σύνδεσμος (aut … aut)', d:'aut … aut — ή … ή' },
        { l:'immatura', r:'Επιθετικός προσδ.', to:'στο mors', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'immaturus, -a, -um — πρόωρος' },
        { l:'mors', r:'Υποκείμενο', to:'στο manet', g:'ονομ. ενικ.', d:'mors, mortis (θηλ. γ΄) — ο θάνατος (γεν. πληθ. mortium)' },
        { l:'aut', r:'Διαζευκτικός σύνδεσμος', g:'διαζευκτικός σύνδεσμος (aut … aut)', d:'aut … aut — ή … ή' },
        { l:'longa', r:'Επιθετικός προσδ.', to:'στο servitus', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'longus, -a, -um — μακρόχρονος' },
        { l:'servitus', r:'Υποκείμενο', to:'στο manet', g:'ονομ. ενικ.', d:'servitus, servitutis (θηλ. γ΄) — η σκλαβιά', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Num veni ad hostem", el:"Μήπως ήρθα σε εχθρό" },
    { la:"et sum captiva", el:"και είμαι αιχμάλωτη" },
    { la:"in castris tuis?", el:"στο στρατόπεδό σου;" },
    { la:"In hoc me traxit", el:"Σε τέτοιο σημείο με οδήγησε" },
    { la:"longa vita", el:"η μακροζωία" },
    { la:"et infelix senecta,", el:"και τα δυστυχισμένα γερατειά," },
    { la:"ut viderem te", el:"ώστε να σε δω" },
    { la:"primum exsulem", el:"πρώτα εξόριστο" },
    { la:"deinde hostem?", el:"και ύστερα εχθρό;" },
    { la:"Qui potuisti populari", el:"Πώς μπόρεσες να λεηλατήσεις" },
    { la:"hanc terram,", el:"αυτήν τη χώρα," },
    { la:"quae te genuit", el:"που σε γέννησε" },
    { la:"atque aluit?", el:"και σε ανάθρεψε;" },
    { la:"Non tibi cecidit ira", el:"Δε σου πέρασε η οργή" },
    { la:"ingredienti", el:"όταν περνούσες" },
    { la:"fines patriae?", el:"τα σύνορα της πατρίδας σου;" },
    { la:"Quamvis perveneras", el:"Παρόλο που είχες φτάσει" },
    { la:"infesto et minaci animo,", el:"με εχθρική και απειλητική διάθεση," },
    { la:"cur, cum in conspectu fuit Roma,", el:"γιατί, όταν είδες τη Ρώμη," },
    { la:"non succurrit tibi:", el:"δε σου ήρθε στο μυαλό:" },
    { la:"«intra illa moenia", el:"«Μέσα σε εκείνα εκεί τα τείχη" },
    { la:"sunt domus", el:"βρίσκονται το σπίτι μου" },
    { la:"ac penates mei,", el:"και οι θεοί του σπιτιού μου," },
    { la:"mater coniunx liberique»?", el:"η μάνα, η γυναίκα και τα παιδιά μου»;" },
    { la:"Ergo", el:"Επομένως," },
    { la:"nisi ego peperissem,", el:"αν εγώ δε σε είχα γεννήσει," },
    { la:"Roma non oppugnaretur;", el:"η Ρώμη δε θα πολιορκούνταν·" },
    { la:"nisi haberem filium,", el:"αν δεν είχα γιο," },
    { la:"essem mortua", el:"θα ήμουν στο θάνατό μου" },
    { la:"libera in libera patria.", el:"ελεύθερη σε ελεύθερη πατρίδα." },
    { la:"Ego iam nihil possum pati", el:"Εγώ τίποτα πια δεν μπορώ να πάθω" },
    { la:"nec diu", el:"και ούτε για πολύ καιρό" },
    { la:"futura sum miserrima:", el:"θα είμαι πολύ δυστυχισμένη·" },
    { la:"at contra hos,", el:"αλλά αντίθετα αυτούς," },
    { la:"si pergis,", el:"αν συνεχίσεις," },
    { la:"manet aut immatura mors", el:"τους περιμένει ή πρόωρος θάνατος" },
    { la:"aut longa servitus.", el:"ή μακρόχρονη σκλαβιά." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"ira, -ae" },
        { form:"patria, -ae" },
        { form:"Roma, -ae", note:"δεν έχει πληθυντικό" },
        { form:"senecta, -ae", note:"δεν έχει πληθυντικό" },
        { form:"terra, -ae" },
        { form:"vita, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"animus, -i" },
        { form:"filius, -ii (-i)" },
        { form:"liberi, -orum", note:"δεν έχει ενικό" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"castra, -orum", note:"ετερόσημο" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"exsul, exsulis" },
        { form:"finis, finis" },
        { form:"hostis, hostis" },
        { form:"penates, penatium", note:"δεν έχει ενικό" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"coniu(n)x, coniugis" },
        { form:"mater, matris" },
        { form:"servitus, servitutis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"moenia, moenium", note:"δεν έχει ενικό" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"conspectus, -us" } ] },
      { gender:"Θηλυκά", items:[ { form:"domus, -us" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"captivus, -a, -um" },
      { form:"immaturus, -a, -um", note:"χωρίς παραθετικά (αρνητική έννοια)" },
      { form:"infestus, -a, -um" },
      { form:"liber, -era, -erum" },
      { form:"longus, -a, -um" },
      { form:"miser, -era, -erum" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"infelix, infelix, infelix (-icis)" },
      { form:"minax, minax, minax (-acis)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"captivus, -a, -um", comp:"—", sup:"—" },
      { pos:"immaturus, -a, -um", comp:"—", sup:"—", note:"αρνητική έννοια — δεν σχηματίζει παραθετικά" },
      { pos:"infestus, -a, -um", comp:"infestior, -ior, -ius", sup:"infestissimus, -a, -um" },
      { pos:"liber, -era, -erum", comp:"liberior, -ior, -ius", sup:"liberrimus, -a, -um" },
      { pos:"longus, -a, -um", comp:"longior, -ior, -ius", sup:"longissimus, -a, -um" },
      { pos:"miser, -era, -erum", comp:"miserior, -ior, -ius", sup:"miserrimus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"infelix, infelix, infelix (-icis)", comp:"infelicior, -ior, -ius", sup:"infelicissimus, -a, -um" },
      { pos:"minax, minax, minax (-acis)", comp:"minacior, -ior, -ius", sup:"minacissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσώπου" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσώπου" },
    { form:"meus, mea, meum", kind:"Κτητική", extra:"α΄ προσ., ένας κτήτορας" },
    { form:"tuus, tua, tuum", kind:"Κτητική", extra:"β΄ προσ., ένας κτήτορας" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"nemo, — / —, nihil", kind:"Αόριστη ουσιαστική", extra:"nihil = ουδέτερο του nemo" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"oppugno", perf:"oppugnavi", sup:"oppugnatum", inf:"oppugnare", note:"" },
      { pres:"populor", perf:"populatus sum", sup:"—", inf:"populari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"habeo", perf:"habui", sup:"habitum", inf:"habere", note:"" },
      { pres:"maneo", perf:"mansi", sup:"mansum", inf:"manere", note:"" },
      { pres:"video", perf:"vidi", sup:"visum", inf:"videre", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"alo", perf:"alui", sup:"al(i)tum", inf:"alere", note:"" },
      { pres:"cado", perf:"cecidi", sup:"casum", inf:"cadere", note:"" },
      { pres:"gigno", perf:"genui", sup:"genitum", inf:"gignere", note:"" },
      { pres:"pario", perf:"peperi", sup:"partum", inf:"parere", note:"15 σε -io· μτχ. μέλλ. pariturus" },
      { pres:"pergo", perf:"perrexi", sup:"perrectum", inf:"pergere", note:"" },
      { pres:"succurrit", perf:"succurrit", sup:"succursum", inf:"succurrere", note:"απρόσωπο" },
      { pres:"traho", perf:"traxi", sup:"tractum", inf:"trahere", note:"" },
      { pres:"ingredior", perf:"ingressus sum", sup:"—", inf:"ingredi", note:"15 σε -io, αποθετικό" },
      { pres:"morior", perf:"mortuus sum", sup:"—", inf:"mori", note:"15 σε -io, αποθετικό· μτχ. μέλλ. moriturus" },
      { pres:"patior", perf:"passus sum", sup:"—", inf:"pati", note:"15 σε -io, αποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"pervenio", perf:"perveni", sup:"perventum", inf:"pervenire", note:"" },
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"ανώμαλο" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ ────────────────────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"num → ρητορική ερώτηση", body:"Το num εισάγει ευθεία ερώτηση ολικής αγνοίας στην οποία περιμένουμε αρνητική απάντηση (ρητορική ερώτηση). Στην 3η και 8η περίοδο η ερώτηση δεν έχει καθόλου εισαγωγικό μόριο, για έμφαση." },
    { tag:"Ουσιαστικό", title:"castra: ετερόσημο", body:"castra, -orum (ουδ. β΄, πληθ.) = στρατόπεδο· στον ενικό castrum, -i = φρούριο. Ετερόσημο ουσιαστικό." },
    { tag:"Σύνδεσμος", title:"quamvis + οριστική", body:"Ο παραχωρητικός quamvis κανονικά συντάσσεται με υποτακτική· εδώ (quamvis … perveneras) εκφέρεται με οριστική υπερσυντελίκου — σύνταξη ποιητική και μετακλασική, κατ' αναλογία προς το quamquam." },
    { tag:"Ακολουθία χρόνων", title:"ut viderem: ιδιομορφία", body:"Στη συμπερασματική «ut … viderem» υπάρχει ιδιομορφία στην ακολουθία των χρόνων: το αποτέλεσμα είναι ιδωμένο τη στιγμή που εμφανίζεται στο μυαλό του ομιλητή (συγχρονισμός κύριας–δευτ.) και όχι τη στιγμή της πιθανής πραγματοποίησής του." },
    { tag:"Υποθετικοί λόγοι", title:"β΄ και α΄ είδος", body:"nisi ego peperissem → Roma non oppugnaretur και nisi haberem filium → essem mortua: υποθ. λόγοι β΄ είδους (αντίθετοι προς την πραγματικότητα). si pergis → manet…: υποθ. λόγος α΄ είδους (ανοικτή υπόθεση στο παρόν)." },
    { tag:"Ρήμα", title:"Αποθετικά ρήματα", body:"populor, ingredior, morior, patior είναι αποθετικά: παθητικός τύπος, ενεργητική σημασία (λεηλατώ, εισβάλλω, πεθαίνω, υπομένω). Το mortua είναι μετοχή παρακειμένου (ενεργ. σημ.) του morior." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"ingredienti (επιρρηματική χρονική μετοχή ενεστώτα — σύγχρονο)",
        to:[
        "dum ingrederis / -re (dum + οριστ. ενεστ. — σύγχρονο, συνεχιζόμενη πράξη)",
        "cum ingredereris / -re (cum ιστορικός + υποτ. παρατ. — εξάρτηση από ιστορικό χρόνο: cecidit)"] }
    ]},
    { id:"Β", label:"Μετατροπή δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Qui potuisti populari hanc terram, quae te genuit atque aluit?",
        to:"Qui potuisti populari hanc terram quae te genitum aluit?",
        note:"Η 1η αναφορική πρόταση → επιρρηματική χρονική μετοχή, συνημμένη στο αντικ. (te) του aluit." },
      { from:"Ergo ego nisi peperissem (te), Roma non oppugnaretur;",
        to:"Ergo te a me non parto Roma non oppugnaretur.",
        note:"Η υποθετική → υποθετική μετοχή, γνήσια αφαιρετική απόλυτη (το υποκ. te δεν έχει άλλο ρόλο στην πρόταση του non oppugnaretur)." },
      { from:"nisi filium haberem, libera in libera patria mortua essem.",
        to:"non habens filium libera in libera patria mortua essem.",
        note:"Η υποθετική → υποθετική μετοχή, συνημμένη στο εννοούμενο υποκ. ego του essem." },
      { from:"…, si pergis, aut immatura mors aut longa servitus manet.",
        to:"…, te pergente aut immatura mors aut longa servitus manet.",
        note:"Η υποθετική → υποθετική μετοχή, γνήσια αφαιρετική απόλυτη (το υποκ. te δεν έχει άλλο ρόλο στην πρόταση του manet)." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"In hoc me longa vita et infelix senecta traxit, ut primum exsulem deinde hostem te viderem?",
        to:"In hoc ego longa vita et infelici senectā tracta sum, ut primum tu exsul deinde hostis a me videreris / -re?",
        note:"Τα ποιητικά αίτια vita, senecta με απρόθετη αφαιρετική (άψυχα)· το a me εμπρόθετα (έμψυχο)." },
      { from:"Qui potuisti populari hanc terram, quae te genuit atque aluit?",
        to:"Qui potuisti populari hanc terram, qua tu genitus es atque alitus (altus) es?",
        note:"Το ποιητικό αίτιο qua (= terra) απρόθετα (άψυχο)· ως προσωποποιημένο: a qua." },
      { from:"Ergo ego nisi peperissem, Roma non oppugnaretur; (ενν. te peperissem)", to:"Ergo a me nisi tu partus esses, Roma non oppugnaretur." }
    ]},
    { id:"Δ", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"Ergo … Roma non oppugnaretur;",
        to:"Ergo … (tu) Romam non oppugnares.",
        note:"Στην παθητική εννοείται το έμψυχο ποιητικό αίτιο a te → εννοούμενο υποκ. tu." }
    ]},
    { id:"Ε", label:"Μετατροπή των υποθετικών λόγων στα άλλα είδη", items:[
      { from:"Ergo ego nisi peperissem, Roma non oppugnaretur; (μεικτός β΄ είδους: υπόθεση στο παρελθόν, απόδοση στο παρόν — αντίθετο προς την πραγματικότητα)",
        to:[
        "Α΄ είδος (ανοικτή, παρόν): Ergo ego nisi pario, Roma non oppugnatur",
        "Α΄ είδος (ανοικτή, παρελθόν): Ergo ego nisi peperi, Roma non oppugnata est",
        "Α΄ είδος (ανοικτή, μέλλον): Ergo ego nisi pariam / peperero, Roma non oppugnabitur",
        "Β΄ είδος (αντίθετο, παρόν): Ergo ego nisi parerem, Roma non oppugnaretur",
        "Β΄ είδος (αντίθετο, παρελθόν): Ergo ego nisi peperissem, Roma non oppugnata esset",
        "Γ΄ είδος (δυνατή/πιθανή, παρόν-μέλλον): Ergo ego nisi pariam, Roma non oppugnetur"] },
      { from:"nisi filium haberem, libera in libera patria mortua essem. (β΄ είδος — αντίθετο προς την πραγματικότητα, παρόν)",
        to:[
        "Α΄ είδος (ανοικτή, παρόν): nisi filium habeo, libera in libera patria mortua sum",
        "Α΄ είδος (ανοικτή, παρελθόν): nisi filium habui, libera in libera patria mortua fui",
        "Α΄ είδος (ανοικτή, μέλλον): nisi filium habebo / habuero, libera in libera patria mortua ero",
        "Β΄ είδος (αντίθετο, παρόν): nisi filium haberem, libera in libera patria mortua essem",
        "Β΄ είδος (αντίθετο, παρελθόν): nisi filium habuissem, libera in libera patria mortua fuissem",
        "Γ΄ είδος (δυνατή/πιθανή, παρόν-μέλλον): nisi filium habeam, libera in libera patria mortua sim"] },
      { from:"at contra hos, si pergis, aut immatura mors aut longa servitus manet. (α΄ είδος — ανοικτή για το παρόν)",
        to:[
        "Α΄ είδος (ανοικτή, παρόν): si pergis, … aut immatura mors aut longa servitus manet",
        "Α΄ είδος (ανοικτή, παρελθόν): si perrexisti, … mansit",
        "Α΄ είδος (ανοικτή, μέλλον): si perges / perrexeris, … manebit",
        "Β΄ είδος (αντίθετο, παρόν): si pergeres, … maneret",
        "Β΄ είδος (αντίθετο, παρελθόν): si perrexisses, … mansisset",
        "Γ΄ είδος (δυνατή/πιθανή, παρόν-μέλλον): si pergas, … maneat"] }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"(εξάρτηση: Mater interrogat / interrogavit filium) Num ad hostem veni et captiva in castris tuis sum;",
        to:"num ipsa ad hostem venerit / venisset et captiva in castris illius sit / esset",
        note:"Πλάγιες ερωτηματικές προτάσεις." },
      { from:"In hoc me longa vita et infelix senecta traxit, ut primum exsulem deinde hostem te viderem;", to:"num in illud (id) se longa vita et infelix senecta traxerit / traxisset, ut primum exsulem deinde hostem illum videat / videret" },
      { from:"Qui potuisti populari hanc terram, quae te genuit atque aluit;", to:"qui potuerit / potuisset populari illam (eam) terram, quae illum genuerit / genuisset atque aluerit / aluisset" },
      { from:"Non tibi ingredienti fines patriae ira cecidit;", to:"num non illi ingredienti fines patriae ira ceciderit / cecidisset" },
      { from:"Quamvis infesto animo et minaci perveneras, cur, cum in conspectu Roma fuit, tibi non succurrit «intra illa moenia domus ac penates mei sunt, mater coniunx liberique»;", to:"quamvis infesto et minaci animo pervenerit / pervenisset, cur, cum in conspectu Roma fuerit / fuisset, illi non succurrerit / succurrisset intra illa moenia domum ac penates (αιτ.) suos esse, matrem coniugem liberosque" },
      { from:"(εξάρτηση: Mater filio dicit / dixit) Ergo ego nisi peperissem, Roma non oppugnaretur;",
        to:"nisi ipsa (illum) peperisset, illum Romam non oppugnaturum esse",
        note:"Ειδικό απαρέμφατο· απαρ. ενεστ. ενεργ. περιφραστικής συζυγίας." },
      { from:"nisi filium haberem, libera in libera patria mortua essem;", to:"nisi filium haberet, se liberam in libera patria mortuam futuram esse" },
      { from:"Ego nihil iam pati … possum, nec ut sim miserrima, diu futura sum;", to:"se nihil iam pati posse nec diu miserrimam futuram esse" },
      { from:"at contra hos, si pergis, aut immatura mors aut longa servitus manet.", to:"at contra illos, si (ille) pergat / pergeret, aut immaturam mortem aut longam servitutem manere" }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"hostem", el:"(αγγλ.) host (= ξενιστής), hostile (= εχθρικός) // (γαλλ.) hostilité (= εχθρότητα)." },
    { la:"in-gredienti [< in-gredior]", el:"(αγγλ.) ingress (= είσοδος), e-gress (= έξοδος), progress (= πρόοδος), congress (= συνέδριο, κογκρέσο) // (γαλλ.) ingredient (= συστατικό), degré (= βαθμός, βαθμίδα)." },
    { la:"per-veneras [< per-venio]", el:"βαίνω // (γαλλ.) venir (= έρχομαι), parvenir (= φθάνω), avenue (= λεωφόρος), souvenir (= ανάμνηση) // (αγγλ.) invent (= εφευρίσκω), prevent (= προλαμβάνω, εμποδίζω)." },
    { la:"captiva [< capio]", el:"(αγγλ.) captive (= αιχμάλωτος), capture (= σύλληψη, συλλαμβάνω), accept (= αποδέχομαι) // (γαλλ.) captif." },
    { la:"castris", el:"κάστρο // (αγγλ.) castle (= κάστρο, πύργος) // (γαλλ.) château (= πύργος, κάστρο) // (ισπαν.) castillo (= κάστρο)." },
    { la:"sum, sunt, essem", el:"εἰμί // (αγγλ.) essence (= ουσία), present (= παρών) // (γαλλ.) essence (= ουσία)." },
    { la:"longa", el:"δολιχός // (αγγλ.) long (= μακρύς), (γαλλ.) longue, longitude (= γεωγραφικό μήκος), prolong (= παρατείνω) // (γαλλ.) prolonger (= παρατείνω)." },
    { la:"vita", el:"βίος // βιταλισμός (< γαλλ. vitalisme), βιταμίνη (< γαλλ.) // (γαλλ.) vie (= ζωή)." },
    { la:"in-felix", el:"(ισπαν.) infeliz (= δυστυχισμένος) // (γαλλ.) félicité (= ευτυχία) // (αγγλ.) felicity (= ευτυχία)." },
    { la:"senecta [< senex]", el:"(αγγλ.) senior (= ηλικιωμένος), senator (= γερουσιαστής), senile (= γεροντικός) // (γαλλ.) sénile (= γεροντικός)." },
    { la:"traxit [< traho]", el:"τρακτέρ (< γαλλ.) // (αγγλ.) ex-traction (= εξαγωγή), attract (= ελκύω), contract (= συμβόλαιο· συστέλλω) // (γαλλ.) trait (= γραμμή, χαρακτηριστικό)." },
    { la:"primum", el:"πρό, πρότερος, πρῶτος· πριν // πριμαντόνα (< ιταλ.) // (γαλλ.) primaire (= πρωτογενής), premier (= πρώτος) // (αγγλ.) prime (= πρώτος, κύριος), prince (= πρίγκιπας)." },
    { la:"ex(s)ulem [< ex(s)ul]", el:"(γαλλ.) exil (= εξορία), exilé (= εξόριστος) // (ιταλ.) esilio (= εξορία)." },
    { la:"fines", el:"φινάλε, φινίρισμα (< ιταλ.) // (γαλλ.) finaliste, finir (= τελειώνω) // (αγγλ.) finite (= πεπερασμένος), finish (= τελειώνω), define (= ορίζω)." },
    { la:"patriae, patriā", el:"πατρίς, πατήρ, πατέρας // (αγγλ.) expatriate (= εκπατρίζω), repatriate (= επαναπατρίζω) // (γαλλ.) patrie (= πατρίδα) // (ιταλ.) patria (= πατρίδα)." },
    { la:"cecidit [< cado]", el:"κάζο [< ιταλ. caso (= συμβάν)] // (αγγλ.) accident (= ατύχημα, συμβάν), cadence (= ρυθμός, πτώση), cascade (= καταρράκτης), occident (= δύση), deciduous (= φυλλοβόλος) // (γαλλ.) chance (= τύχη)." },
    { la:"infesto", el:"(γαλλ.) infester (= λυμαίνομαι) // (ισπαν.) infestar (= μολύνω, κατακλύζω)." },
    { la:"minaci [< minor (= απειλώ)]", el:"(γαλλ.) menacer (= απειλώ), (ισπαν.) con-minar // (ιταλ.) minaccia (= απειλή)." },
    { la:"animo", el:"ανιμισμός (< γαλλ.) // άνεμος // (αγγλ.) animal (= ζώο), animate (= εμψυχώνω), unanimous (= ομόφωνος) // (γαλλ.) animer (= εμψυχώνω), animal (= ζώο)." },
    { la:"con-spectu [< con-spicio]", el:"σπέκουλα (= κερδοσκοπία), σπεκουλαδόρος, σπεκουλάρω (< ιταλ.) // (αγγλ.) pro-spect (= προοπτική, άποψη), aspect (= όψη, άποψη), inspect (= επιθεωρώ), spectator (= θεατής) // (γαλλ.) spectacle (= θέαμα)." },
    { la:"Roma", el:"Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός // (αγγλ.) romance (= ρομάντζο, ιπποτικό μυθιστόρημα), romantic (= ρομαντικός) // (γαλλ.) roman (= μυθιστόρημα), romain (= Ρωμαίος)." },
    { la:"succurrit [< sub + curro]", el:"κούρσα (< γαλλ.) // κουρσάρος (< ιταλ.) // (αγγλ.) current (= ρεύμα, τρέχων), occur (= συμβαίνω), excursion (= εκδρομή) // (γαλλ.) secourir (= βοηθώ, συντρέχω), courir (= τρέχω), courant (= ρεύμα)." },
    { la:"viderem", el:"(ϝιδεῖν) ἰδέα, βίντεο (< αγγλ.) // (αγγλ.) vision (= όραση, όραμα), evident (= προφανής), provide (= παρέχω, προνοώ) // (γαλλ.) voir (= βλέπω), vue (= θέα, άποψη)." },
    { la:"moenia", el:"ἄμυνα // (αγγλ.) munition (= πυρομαχικά, οχύρωση), ammunition (= πυρομαχικά) // (γαλλ.) munition (= πυρομαχικά)." },
    { la:"potuisti [< possum < potis (= δυνατός) + sum]", el:"πόσις, δεσπότης («κύριος σπιτιού») // (αγγλ.) potent (= ισχυρός), potential (= δυναμικό, δυνητικός), possible (= δυνατός, πιθανός) // (γαλλ.) pouvoir (= μπορώ, δύναμη), puissant (= ισχυρός)." },
    { la:"terram", el:"τέρσομαι (= ξεραίνομαι) // τερακότα (< ιταλ.) // (αγγλ.) terrain (= έδαφος), terrestrial (= γήινος), subterranean (= υπόγειος), terrace (= βεράντα, πεζούλι) // (γαλλ.) terre (= γη, χώμα), atterrir (= προσγειώνομαι)." },
    { la:"genuit [< gigno]", el:"γίγνομαι, γένος, γενιά, γνήσιος // natura (= φύση), natural, νατουραλισμός (< γαλλ.) // (αγγλ.) genital (= γεννητικός), progenitor (= πρόγονος)." },
    { la:"aluit [< alo]", el:"ἀλδαίνω (= ενδυναμώνω, αυξάνω) // (γαλλ.) alourdir (= αυξάνω, βαραίνω) // (αγγλ.) aliment (= τροφή), adult (= ενήλικος), adolescent (= έφηβος)." },
    { la:"domus", el:"δέμω, δόμος, δῶμα, νεόδμητος // (γαλλ.) domestique (= εξημερωμένος) // (αγγλ.) domicile (= κατοικία) // (ιταλ.) duomo (= καθεδρικός ναός)." },
    { la:"mater", el:"μήτηρ // (γαλλ.) maternel (= μητρικός), matri-monial (= συζυγικός, γαμήλιος), mère (= μητέρα) // (αγγλ.) matrix (= μήτρα) // (ιταλ.) madre (= μητέρα)." },
    { la:"con-iunx [< con-iungo]", el:"ζεύγνυμι, ζυγός, σύζυγος // (αγγλ.) conjugal (= συζυγικός), junction (= σύνδεση) // (γαλλ.) conjoint (= σύζυγος)." },
    { la:"op-pugnaretur [< op-pugno]", el:"πύξ (= με γροθιά)· πυγμή // (αγγλ.) pugnacious (= μαχητικός), impugn (= αμφισβητώ, προσβάλλω) // (γαλλ.) poing (= γροθιά)." },
    { la:"haberem", el:"(γερμ.) haben (= έχω), (αγγλ.) have // (αγγλ.) able (= ικανός), habit (= συνήθεια) // (γαλλ.) avoir (= έχω) // (ιταλ.) avere (= έχω) // (ισπαν.) haber (= έχω)." },
    { la:"libera, liberā", el:"(γαλλ.) libre (= ελεύθερος) // (αγγλ.) liberty (= ελευθερία), libero (< ιταλ.), liberal (= φιλελεύθερος), liberate (= απελευθερώνω)." },
    { la:"mortua, mors", el:"βροτός // (γαλλ.) mort (= νεκρός), mourir (= πεθαίνω) // (αγγλ.) mortal (= θνητός), mortgage (= υποθήκη)." },
    { la:"pati [< patior]", el:"παθεῖν, πάθος // πασιέντσα (< ιταλ.) // (γαλλ.) patience (= υπομονή) // (αγγλ.) patient (= ασθενής), passion (= πάθος), compassion (= συμπόνια), passive (= παθητικός)." },
    { la:"miserrima", el:"μιζέρια, μίζερος (< ιταλ.) // (αγγλ.) miserable (= άθλιος), commiserate (= συμπονώ) // (γαλλ.) misère (= δυστυχία)." },
    { la:"futura", el:"(γαλλ.) futur (= μέλλον) // (αγγλ.) future (= μέλλον) // (ιταλ.) futuro (= μέλλον)." },
    { la:"contra", el:"(επίρρ.) κόντρα (< ιταλ.) // (αγγλ.) contrary (= αντίθετος), country (= χώρα) // (γαλλ.) contre (= εναντίον)." },
    { la:"pergis [< pergo < per + rego]", el:"ρήγας // (αγγλ.) rector (= πρύτανης, διευθυντής), regent (= αντιβασιλέας)." },
    { la:"im-matura", el:"(γαλλ.) immature (= ανώριμος), mature (= ώριμος) // (αγγλ.) premature (= πρόωρος) // (ιταλ.) maturo (= ώριμος) // (ισπαν.) maduro (= ώριμος)." },
    { la:"servitus [< servus]", el:"σερβίρω, σερβιτόρος, σερβίτσιο (< ιταλ.) // σέρβις (< αγγλ.), σερβίς (< γαλλ.) // (αγγλ.) serf (= δουλοπάροικος), servile (= δουλικός) // (γαλλ.) serf (= δουλοπάροικος) // (ισπαν.) siervo (= δούλος)." },
    { la:"manet", el:"μένω, μόνος // (αγγλ.) mansion (= μέγαρο, έπαυλη), permanent (= μόνιμος), remain (= παραμένω) // (γαλλ.) maison (= σπίτι)." }
  ]
};

export default UNIT;
