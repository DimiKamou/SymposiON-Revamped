export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 23,
  title: "Ένας υπέροχος άνθρωπος",
  latinTitle: "Lectio XXIII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Aegrotabat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'aegroto, aegrotavi, aegrotatum, aegrotare (1) — είμαι άρρωστος' },
        { l:'Caecina', r:'Υποκείμενο', to:'στο aegrotabat', g:'ονομ. ενικ., αρσ. — α΄ κλ.', d:'Caecina, -ae (αρσ. α΄) — ο Καικίνας', note:'Ως κύριο όνομα δεν σχηματίζει πληθυντικό.' },
        { l:'Paetus', r:'Παράθεση', to:'στο Caecina (επώνυμο)', g:'ονομ. ενικ., αρσ. — β΄ κλ.', d:'Paetus, -i (αρσ. β΄) — ο Παίτος', note:'Ως κύριο όνομα δεν σχηματίζει πληθυντικό.', a:',' },
        { l:'maritus', r:'Παράθεση', to:'στο Caecina Paetus', g:'ονομ. ενικ., αρσ. — β΄ κλ.', d:'maritus, -i (αρσ. β΄) — ο σύζυγος' },
        { l:'Arriae', r:'Γενική κτητική', to:'στο maritus', g:'γεν. ενικ., θηλ. — α΄ κλ.', d:'Arria, -ae (θηλ. α΄) — η Αρρία', note:'Ως κύριο όνομα δεν σχηματίζει πληθυντικό.', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Συνδέεται με την προηγούμενη κύρια ασύνδετα (χωρίζονται με κόμμα).', kids:[
        { l:'aegrotabat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'aegroto, aegrotavi, aegrotatum, aegrotare (1) — είμαι άρρωστος' },
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός προσθετικός (εδώ) σύνδεσμος', d:'et — και' },
        { l:'filius', r:'Υποκείμενο', to:'στο aegrotabat', g:'ονομ. ενικ., αρσ. — β΄ κλ.', d:'filius, -ii / -i (αρσ. β΄) — ο γιος', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Filius', r:'Υποκείμενο', to:'στο mortuus est', g:'ονομ. ενικ., αρσ. — β΄ κλ.', d:'filius, -ii / -i (αρσ. β΄) — ο γιος' },
        { l:'mortuus est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — αποθετικό', d:'morior, mortuus sum, (mortuum), mori (3, αποθ. σε -io) — πεθαίνω', note:'Αποθετικό ρήμα σε -io της 3ης συζυγίας.', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Huic', r:'Δοτική προσωπική χαριστική', to:'στο paravit (ή κατ’ άλλους έμμεσο αντικείμενο)', g:'δοτ. ενικ., αρσ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό· εδώ = filio' },
        { l:'Arria', r:'Υποκείμενο', to:'στο paravit', g:'ονομ. ενικ., θηλ. — α΄ κλ.', d:'Arria, -ae (θηλ. α΄) — η Αρρία' },
        { l:'funus', r:'Αντικείμενο', to:'στο paravit', g:'αιτ. ενικ., ουδ. — γ΄ κλ.', d:'funus, funeris (ουδ. γ΄) — η κηδεία' },
        { l:'ita', r:'Επιρρ. προσδ. του τρόπου', to:'στο paravit', g:'τροπικό επίρρημα', d:'ita — έτσι', note:'Προεξαγγελτικό: ita ... ut = έτσι ... ώστε.' },
        { l:'paravit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'paro, paravi, paratum, parare (1) — ετοιμάζω', a:',' },
        { type:'sub', key:'symperasmatiki', label:'Συμπερασματική', note:'Δευτ. επιρρηματική συμπερασματική πρόταση, ως επιρρ. προσδ. του αποτελέσματος στο paravit. Εισάγεται με τον σύνδεσμο ut (προεξαγγέλλεται από το ita) και εκφέρεται με υποτακτική (δυνητική), γιατί το αποτέλεσμα θεωρείται υποκειμενική κατάσταση· χρόνου παρατατικού (ignoraretur) λόγω εξάρτησης από ιστορικό χρόνο (paravit).', kids:[
          { l:'ut', r:'Σύνδεσμος', g:'υποτακτικός συμπερασματικός σύνδεσμος', d:'ut — ώστε' },
          { l:'ignoraretur', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατατικού παθ. φωνής', d:'ignoro, ignoravi, ignoratum, ignorare (1) — αγνοώ', note:'Εννοούμενο υποκείμενο: funus.' },
          { l:'a marito', k:'maritus', r:'Εμπρόθετος προσδ. του ποιητικού αιτίου', to:'στο ignoraretur', g:'a (πρόθ. + αφαιρ.) + marito (αφαιρ. ενικ., αρσ.)', d:'a — από· maritus, -i (αρσ. β΄) — ο σύζυγος', note:'Εκφέρεται εμπρόθετα, γιατί είναι έμψυχο.', a:';' }
        ]}
      ]}
    ]},

    { n: 4, kids: [
      { l:'quin immo', r:'Σύνδεσμος', g:'παρατακτικός αντιθετικός σύνδεσμος', d:'quin immo — όχι μόνο αυτό αλλά (ακόμη)', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο simulabat. Εισάγεται με τον χρονικό-επαναληπτικό σύνδεσμο cum και εκφέρεται με οριστική (μόνο χρόνος), υπερσυντελίκου (intraverat), γιατί δηλώνει αόριστη επανάληψη στο παρελθόν.', kids:[
          { l:'cum', r:'Σύνδεσμος', g:'υποτακτικός χρονικός επαναληπτικός (εδώ) σύνδεσμος', d:'cum — κάθε φορά που, όταν' },
          { l:'illa', r:'Υποκείμενο', to:'στο intraverat', g:'ονομ. ενικ., θηλ. — δεικτική αντων.', d:'ille, illa, illud — εκείνος, εκείνη, εκείνο' },
          { l:'cubiculum', r:'Αντικείμενο', to:'στο intraverat', g:'αιτ. ενικ., ουδ. — β΄ κλ.', d:'cubiculum, -i (ουδ. β΄) — η κρεβατοκάμαρα' },
          { l:'mariti', r:'Γενική κτητική', to:'στο cubiculum', g:'γεν. ενικ., αρσ. — β΄ κλ.', d:'maritus, -i (αρσ. β΄) — ο σύζυγος' },
          { l:'intraverat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσυντελίκου ενεργ. φωνής', d:'intro, intravi, intratum, intrare (1) — μπαίνω', a:',' }
        ]},
        { l:'vivere', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο simulabat', g:'απαρέμφατο ενεστ. ενεργ. φωνής', d:'vivo, vixi, victum, vivere (3) — ζω' },
        { l:'filium', r:'Υποκείμενο', to:'στο vivere (ετεροπροσωπία)', g:'αιτ. ενικ., αρσ. — β΄ κλ.', d:'filius, -ii / -i (αρσ. β΄) — ο γιος' },
        { l:'simulabat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'simulo, simulavi, simulatum, simulare (1, + απρμφ.) — προσποιούμαι ότι...', note:'Εννοούμενο υποκείμενο: illa.', a:',' }
      ]},
      { l:'ac', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'ac — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Συνδέεται με την προηγούμενη κύρια παρατακτικά συμπλεκτικά (καταφατικά) με το ac.', kids:[
        { l:'marito', r:'Έμμεσο αντικείμενο', to:'στο respondebat (και υποκ. της μετοχής interroganti)', g:'δοτ. ενικ., αρσ. — β΄ κλ.', d:'maritus, -i (αρσ. β΄) — ο σύζυγος' },
        { l:'persaepe', r:'Επιρρ. προσδ. του χρόνου (χρονική συχνότητα)', to:'στη μετοχή interroganti', g:'χρονικό επίρρημα', d:'persaepe — πολύ συχνά' },
        { l:'interroganti', r:'Επιθετική μετοχή', to:'στο marito (δηλώνει το σύγχρονο)', g:'δοτ. ενικ., αρσ. — μτχ. ενεστ. ενεργ., τριτόκλ. μονοκατάληκτη (γεν. interrogantis)', d:'interrogo, interrogavi, interrogatum, interrogare (1, < inter + rogo) — ρωτώ', a:',' },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρόταση μερικής άγνοιας, ως αντικείμενο στη μετοχή interroganti. Εισάγεται με την ερωτηματική αντων. quid και εκφέρεται με υποτακτική (υποκειμενική χροιά)· παρατατικού (ageret) λόγω εξάρτησης από ιστορικό χρόνο και σύγχρονο στο παρελθόν.', kids:[
          { l:'quid', r:'Αντικείμενο', to:'στο ageret', g:'αιτ. ενικ., ουδ. — ερωτηματική ουσιαστική αντων.', d:'quis, quis, quid — ποιος, ποια, ποιο / τι;' },
          { l:'ageret', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατατικού ενεργ. φωνής', d:'ago, egi, actum, agere (3) — οδηγώ, κάνω (εδώ)' },
          { l:'puer', r:'Υποκείμενο', to:'στο ageret', g:'ονομ. ενικ., αρσ. — β΄ κλ.', d:'puer, pueri (αρσ. β΄) — το παιδί', a:',' }
        ]},
        { l:'respondebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'respondeo, respondi, responsum, respondere (2) — απαντώ', note:'Εννοούμενο υποκείμενο: illa.', a:':' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (ευθύς λόγος)', note:'Πρόταση του ευθέος λόγου· νοηματικά επέχει θέση άμεσου αντικειμένου στο respondebat. Χωρίζεται από την επόμενη ασύνδετα.', kids:[
        { l:'Bene', r:'Επιρρ. προσδ. του τρόπου', to:'στο quievit', g:'τροπικό επίρρημα', d:'bene — καλά' },
        { l:'quievit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'quiesco, quievi, quietum, quiescere (3) — κοιμάμαι, ηρεμώ, αναπαύομαι', note:'Εννοούμενο υποκείμενο: (puer).', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (ευθύς λόγος)', note:'Πρόταση του ευθέος λόγου· νοηματικά επέχει θέση άμεσου αντικειμένου στο respondebat.', kids:[
        { l:'libenter', r:'Επιρρ. προσδ. του τρόπου', to:'στο sumpsit', g:'τροπικό επίρρημα', d:'libenter — πρόθυμα' },
        { l:'cibum', r:'Αντικείμενο', to:'στο sumpsit', g:'αιτ. ενικ., αρσ. — β΄ κλ.', d:'cibus, -i (αρσ. β΄) — η τροφή' },
        { l:'sumpsit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'sumo, sumpsi, sumptum, sumere (3) — παίρνω', note:'Εννοούμενο υποκείμενο: (puer).', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Deinde', r:'Επιρρ. προσδ. του χρόνου', to:'στο egrediebatur', g:'χρονικό επίρρημα', d:'deinde — έπειτα', a:',' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο egrediebatur. Εισάγεται με τον ιστορικό-διηγηματικό σύνδεσμο cum και εκφέρεται με υποτακτική (υπογραμμίζει τη βαθύτερη σχέση αιτίου-αιτιατού), παρατατικού (vincerent) λόγω εξάρτησης από ιστορικό χρόνο και σύγχρονο στο παρελθόν.', kids:[
          { l:'cum', r:'Σύνδεσμος', g:'υποτακτικός χρονικός ιστορικός-διηγηματικός σύνδεσμος', d:'cum — όταν' },
          { l:'lacrimae', r:'Υποκείμενο', to:'στα vincerent (και prorumperent)', g:'ονομ. πληθ., θηλ. — α΄ κλ.', d:'lacrima, -ae (θηλ. α΄) — το δάκρυ' },
          { l:'suae', r:'Επιθετικός προσδ.', to:'στο lacrimae', g:'ονομ. πληθ., θηλ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)', d:'suus, sua, suum — δικός του, δική του, δικό του', note:'Έμμεση ή πλάγια αυτοπάθεια (βρίσκεται σε δευτερεύουσα και αναφέρεται στο υποκ. Arria της κύριας).', a:',' },
          { l:'diu', r:'Επιρρ. προσδ. του χρόνου (χρονική διάρκεια)', to:'στη μετοχή cohibitae', g:'χρονικό επίρρημα', d:'diu — για πολύ χρόνο' },
          { l:'cohibitae', r:'Επιθετική μετοχή', to:'στο lacrimae (δηλώνει το προτερόχρονο)', g:'ονομ. πληθ., θηλ. — μτχ. παρακειμένου παθ. φωνής', d:'cohibeo, cohibui, cohibitum, cohibere (2, < cum + habeo) — συγκρατώ', note:'lacrimae: υποκείμενο της μετοχής.', a:',' },
          { l:'vincerent', r:'Ρήμα', g:'γ΄ πληθ. υποτ. παρατατικού ενεργ. φωνής', d:'vinco, vici, victum, vincere (3) — νικώ' }
        ]},
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, συνδεόμενη παρατακτικά συμπλεκτικά (-que) με την προηγούμενη. Εισάγεται (εννοείται) με το cum και εκφέρεται με υποτακτική παρατατικού· εννοούμενο υποκείμενο: lacrimae.', kids:[
          { l:'prorumperentque', r:'Ρήμα', g:'γ΄ πληθ. υποτ. παρατατικού ενεργ. φωνής', d:'prorumpo, prorupi, proruptum, prorumpere (3, < pro + rumpo) — ξεσπώ', note:'-que: παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος (εγκλιτική χρήση) = και. Εννοούμενο υποκείμενο: lacrimae.', a:',' }
        ]},
        { l:'egrediebatur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού — αποθετικό', d:'egredior, egressus sum, (egressum), egredi (3, αποθ. σε -io, < e + gradior) — βγαίνω', note:'Εννοούμενο υποκείμενο: (Arria).', a:';' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο dabat', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'se', r:'Άμεσο αντικείμενο', to:'στο dabat', g:'αιτ. ενικ., θηλ. — προσωπική αντων. γ΄ προσ.', d:'se — τον εαυτό της', note:'Άμεση ή ευθεία αυτοπάθεια· αναφέρεται στο εννοούμενο υποκ. Arria του dabat. me dolori do = παραδίνομαι στη θλίψη.' },
        { l:'dolori', r:'Έμμεσο αντικείμενο', to:'στο dabat', g:'δοτ. ενικ., αρσ. — γ΄ κλ.', d:'dolor, doloris (αρσ. γ΄) — η θλίψη' },
        { l:'dabat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'do, dedi, datum, dare (1) — δίνω', note:'Εννοούμενο υποκείμενο: Arria.' },
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'et — και', conn:true }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Συνδέεται με την προηγούμενη κύρια παρατακτικά συμπλεκτικά (καταφατικά) με το et.', kids:[
        { l:'paulo', r:'Αφαιρετική του μέτρου ή της διαφοράς', to:'στο post', g:'αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'paulus, -a, -um — λίγος, λίγη, λίγο' },
        { l:'post', r:'Επιρρ. προσδ. του χρόνου', to:'στο redibat', g:'χρονικό επίρρημα', d:'post — αργότερα' },
        { l:'siccis', r:'Κατηγορηματικός προσδ.', to:'στο oculis', g:'αφαιρ. πληθ., αρσ. — επίθ. β΄ κλ.', d:'siccus, -a, -um — στεγνός, -ή, -ό' },
        { l:'oculis', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο redibat', g:'αφαιρ. πληθ., αρσ. — β΄ κλ.', d:'oculus, -i (αρσ. β΄) — το μάτι', note:'Το siccis δηλώνει παροδική ιδιότητα, γι’ αυτό κατηγορηματικός προσδιορισμός.' },
        { l:'redibat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού — ανώμαλο (σύνθετο του eo)', d:'redeo, redii (και redivi), reditum, redire (< red + eo) — επιστρέφω', note:'Εννοούμενο υποκείμενο: Arria.', a:'.' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Scribonianus', r:'Υποκείμενο', to:'στο moverat', g:'ονομ. ενικ., αρσ. — β΄ κλ.', d:'Scribonianus, -i (αρσ. β΄) — ο Σκριβωνιανός', note:'Ως κύριο όνομα δεν σχηματίζει πληθυντικό.' },
        { l:'arma', r:'Αντικείμενο', to:'στο moverat', g:'αιτ. πληθ., ουδ. — β΄ κλ. (plurale tantum)', d:'arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα', note:'arma moveo = στασιάζω, παίρνω τα όπλα.' },
        { l:'in Illyrico', k:'Illyricum', r:'Εμπρόθετος προσδ. της στάσης σε τόπο', to:'στο moverat', g:'in (πρόθ. + αφαιρ.) + Illyrico (αφαιρ. ενικ., ουδ.)', d:'in — σε· Illyricum, -i (ουδ. β΄) — η Ιλλυρία' },
        { l:'contra Claudium', k:'Claudius', r:'Εμπρόθετος προσδ. της εναντίωσης ή της εχθρικής ενέργειας', to:'στο moverat', g:'contra (πρόθ. + αιτ.) + Claudium (αιτ. ενικ., αρσ.)', d:'contra — εναντίον· Claudius, -ii / -i (αρσ. β΄) — ο Κλαύδιος' },
        { l:'moverat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσυντελίκου ενεργ. φωνής', d:'moveo, movi, motum, movere (2) — κινώ', a:';' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'fuerat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσυντελίκου — ανώμαλο (βοηθητικό)', d:'sum, fui, —, esse — είμαι' },
        { l:'Paetus', r:'Υποκείμενο', to:'στο fuerat', g:'ονομ. ενικ., αρσ. — β΄ κλ.', d:'Paetus, -i (αρσ. β΄) — ο Παίτος' },
        { l:'in partibus', k:'partes', r:'Εμπρόθετος προσδ. του τόπου (μεταφορικά)', to:'στο fuerat', g:'in (πρόθ. + αφαιρ.) + partibus (αφαιρ. πληθ., θηλ.)', d:'in — σε· partes, partium (θηλ. γ΄) — η πολιτική παράταξη', note:'fuerat in partibus eius = είχε πάει με το μέρος του.' },
        { l:'eius', r:'Γενική κτητική', to:'στο partibus', g:'γεν. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό· eius = Scriboniani' },
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'et — και', conn:true, a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Συνδέεται με την αμέσως προηγούμενη κύρια παρατακτικά συμπλεκτικά (καταφατικά) με το et.', kids:[
        { l:'occiso', r:'Γνήσια αφαιρετική απόλυτη — επιρρ. χρονική μετοχή', to:'στο trahebatur (δηλώνει το προτερόχρονο)', g:'αφαιρ. ενικ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'occido, occidi, occisum, occidere (3, < ob + cado) — σκοτώνω', note:'Γνήσια αφαιρ. απόλυτη, γιατί το υποκείμενό της (Scriboniano) δεν έχει άλλο ρόλο στην πρόταση.' },
        { l:'Scriboniano', r:'Υποκείμενο', to:'στη μετοχή occiso', g:'αφαιρ. ενικ., αρσ. — β΄ κλ.', d:'Scribonianus, -i (αρσ. β΄) — ο Σκριβωνιανός', a:',' },
        { l:'Romam', r:'Απρόθετη αιτιατική της κίνησης σε τόπο', to:'στο trahebatur', g:'αιτ. ενικ., θηλ. — α΄ κλ.', d:'Roma, -ae (θηλ. α΄) — η Ρώμη', note:'Απρόθετη, γιατί είναι όνομα πόλης.' },
        { l:'trahebatur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού παθ. φωνής', d:'traho, traxi, tractum, trahere (3) — σύρω, τραβώ', note:'Εννοούμενο υποκείμενο: Paetus. trahebatur = τον οδηγούσαν σιδεροδέσμιο.', a:'.' }
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Erat ascensurus', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής — ενεργητική περιφραστική συζυγία', d:'ascendo, ascendi, ascensum, ascendere (3) — ανεβαίνω', note:'Ενεργητική περιφραστική συζυγία (μετοχή μέλλοντα + Erat). Εννοούμενο υποκείμενο: (Paetus).' },
        { l:'navem', r:'Αντικείμενο', to:'στο Erat ascensurus', g:'αιτ. ενικ., θηλ. — γ΄ κλ.', d:'navis, navis (θηλ. γ΄) — το πλοίο', a:';' }
      ]}
    ]},

    { n: 10, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Arria', r:'Υποκείμενο', to:'στο orabat', g:'ονομ. ενικ., θηλ. — α΄ κλ.', d:'Arria, -ae (θηλ. α΄) — η Αρρία' },
        { l:'milites', r:'Άμεσο αντικείμενο', to:'στο orabat', g:'αιτ. πληθ., αρσ. — γ΄ κλ.', d:'miles, militis (αρσ. γ΄) — ο στρατιώτης' },
        { l:'orabat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'oro, oravi, oratum, orare (1) — παρακαλώ', a:',' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική πρόταση, ως έμμεσο αντικείμενο στο orabat. Εισάγεται με τον βουλητικό σύνδεσμο ut και εκφέρεται με υποτακτική (το περιεχόμενό της είναι απλώς επιθυμητό), παρατατικού (imponeretur) λόγω εξάρτησης από ιστορικό χρόνο και σύγχρονο στο παρελθόν.', kids:[
          { l:'ut', r:'Σύνδεσμος', g:'υποτακτικός βουλητικός σύνδεσμος', d:'ut — να' },
          { l:'simul', r:'Επιρρ. προσδ. του χρόνου', to:'στο imponeretur', g:'χρονικό επίρρημα', d:'simul — μαζί (εννοείται: με τον άντρα της)' },
          { l:'imponeretur', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατατικού παθ. φωνής', d:'impono, imposui, impositum, imponere (3, < in + pono) — επιβιβάζω', note:'Εννοούμενο υποκείμενο: (Arria). Εννοείται «στο πλοίο».', a:'.' }
        ]}
      ]}
    ]},

    { n: 11, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Non', r:'Άρνηση', to:'στο impetravit', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
        { l:'impetravit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'impetro, impetravi, impetratum, impetrare (1, < in + petro) — κατορθώνω', note:'Εννοούμενο υποκείμενο: (Arria).', a:':' }
      ]}
    ]},

    { n: 12, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'conduxit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'conduco, conduxi, conductum, conducere (3, < cum + duco) — νοικιάζω', note:'Εννοούμενο υποκείμενο: (Arria).' },
        { l:'piscatoriam', r:'Επιθετικός προσδ.', to:'στο naviculam', g:'αιτ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'piscatorius, -a, -um — ψαράδικος, -η, -ο' },
        { l:'naviculam', r:'Αντικείμενο', to:'στο conduxit', g:'αιτ. ενικ., θηλ. — α΄ κλ.', d:'navicula, -ae (θηλ. α΄) — το πλοιάριο (υποκορ. του navis)' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Συνδέεται με την αμέσως προηγούμενη κύρια παρατακτικά συμπλεκτικά (καταφατικά) με το -que.', kids:[
        { l:'ingentemque', r:'Επιθετικός προσδ.', to:'στο navem', g:'αιτ. ενικ., θηλ. — μονοκατάληκτο επίθ. γ΄ κλ. (γεν. ingentis)', d:'ingens, ingens, ingens (γεν. ingentis) — πελώριος, -α, -ο', note:'-que: παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος (εγκλιτικός) = και· συνδέει τις δύο κύριες.' },
        { l:'navem', r:'Αντικείμενο', to:'στο secuta est', g:'αιτ. ενικ., θηλ. — γ΄ κλ.', d:'navis, navis (θηλ. γ΄) — το πλοίο' },
        { l:'secuta est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — αποθετικό', d:'sequor, secutus sum, (secutum), sequi (3, αποθ.) — ακολουθώ', note:'Εννοούμενο υποκείμενο: (Arria).', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Aegrotabat Caecina Paetus, maritus Arriae, aegrotabat et filius.", el:"Ήταν άρρωστος ο Καικίνας Παίτος, ο σύζυγος της Αρρίας, άρρωστος ήταν και ο γιος." },
    { n:2, la:"Filius mortuus est.", el:"Ο γιος πέθανε." },
    { n:3, la:"Huic Arria funus ita paravit, ut ignoraretur a marito;", el:"Η Αρρία τού ετοίμασε την κηδεία έτσι, ώστε να αγνοείται από τον σύζυγό της·" },
    { n:4, la:"quin immo cum illa cubiculum mariti intraverat, vivere filium simulabat, ac marito persaepe interroganti, quid ageret puer, respondebat: «Bene quievit, libenter cibum sumpsit».", el:"όχι μόνο αυτό, αλλά κάθε φορά που εκείνη έμπαινε στην κρεβατοκάμαρα του συζύγου της, προσποιούνταν ότι ο γιος (τους) ζούσε, και στον σύζυγο που ρωτούσε πολύ συχνά τι έκανε το παιδί, απαντούσε: «Κοιμήθηκε καλά, πήρε την τροφή πρόθυμα»." },
    { n:5, la:"Deinde, cum lacrimae suae, diu cohibitae, vincerent prorumperentque, egrediebatur;", el:"Έπειτα, όταν τα δάκρυά της, που για πολύ χρόνο συγκρατούσε, νικούσαν και ξεσπούσαν, έβγαινε (έξω)·" },
    { n:6, la:"tum se dolori dabat et paulo post siccis oculis redibat.", el:"τότε παραδινόταν στη θλίψη και λίγο αργότερα επέστρεφε με τα μάτια στεγνά." },
    { n:7, la:"Scribonianus arma in Illyrico contra Claudium moverat;", el:"Ο Σκριβωνιανός είχε στασιάσει στην Ιλλυρία εναντίον του Κλαυδίου·" },
    { n:8, la:"fuerat Paetus in partibus eius et, occiso Scriboniano, Romam trahebatur.", el:"ο Παίτος είχε πάει με το μέρος του και, όταν σκοτώθηκε ο Σκριβωνιανός, οδηγούνταν σιδεροδέσμιος στη Ρώμη." },
    { n:9, la:"Erat ascensurus navem;", el:"Επρόκειτο να ανέβει σε πλοίο·" },
    { n:10, la:"Arria milites orabat, ut simul imponeretur.", el:"η Αρρία παρακαλούσε τους στρατιώτες να επιβιβαστεί μαζί (του)." },
    { n:11, la:"Non impetravit:", el:"Δεν το κατόρθωσε:" },
    { n:12, la:"conduxit piscatoriam naviculam ingentemque navem secuta est.", el:"νοίκιασε (ένα) ψαράδικο πλοιάριο και το πελώριο πλοίο ακολούθησε." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Caecina, -ae", note:"κύριο όνομα — χωρίς πληθ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"Arria, -ae", note:"κύριο όνομα — χωρίς πληθ." },
        { form:"lacrima, -ae" },
        { form:"Roma, -ae", note:"κύριο όνομα — χωρίς πληθ." },
        { form:"navicula, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Paetus, -i", note:"κύριο όνομα — χωρίς πληθ." },
        { form:"maritus, -i" },
        { form:"filius, -ii / -i" },
        { form:"puer, pueri" },
        { form:"cibus, -i" },
        { form:"oculus, -i" },
        { form:"Claudius, -ii / -i", note:"κύριο όνομα — χωρίς πληθ." },
        { form:"Scribonianus, -i", note:"κύριο όνομα — χωρίς πληθ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"cubiculum, -i" },
        { form:"arma, -orum", note:"plurale tantum (μόνο πληθ.)" },
        { form:"Illyricum, -i", note:"κύριο όνομα — χωρίς πληθ." }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"dolor, doloris" },
        { form:"miles, militis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"partes, partium", note:"με σημ. «πολιτική παράταξη» μόνο πληθ. (ενικ. pars, partis = μέρος)" },
        { form:"navis, navis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"funus, funeris" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"paulus, -a, -um" },
      { form:"siccus, -a, -um" },
      { form:"piscatorius, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"ingens, ingens, ingens", note:"μονοκατάληκτο (γεν. ingentis)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ & ΕΠΙΡΡΗΜΑΤΩΝ ────────────────────────────
  comparatives: [
    { kl:"Επίθετα Β΄ κλίσης", rows:[
      { pos:"bonus, -a, -um", comp:"melior, -ior, -ius", sup:"optimus, -a, -um" },
      { pos:"siccus, -a, -um", comp:"siccior, -ior, -ius", sup:"siccissimus, -a, -um" },
      { pos:"paulus, -a, -um", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά" },
      { pos:"piscatorius, -a, -um", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά (παράγωγο από ουσ. piscis)" }
    ]},
    { kl:"Επίθετα Γ΄ κλίσης", rows:[
      { pos:"libens, libens, libens", comp:"libentior, -ior, -ius", sup:"libentissimus, -a, -um" },
      { pos:"ingens, ingens, ingens", comp:"ingentior, -ior, -ius", sup:"ingentissimus, -a, -um" }
    ]},
    { kl:"Επιρρήματα", rows:[
      { pos:"bene", comp:"melius", sup:"optime" },
      { pos:"libenter", comp:"libentius", sup:"libentissime" },
      { pos:"sicce", comp:"siccius", sup:"siccissime" },
      { pos:"ingenter", comp:"ingentius", sup:"ingentissime" },
      { pos:"diu", comp:"diutius", sup:"diutissime" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"" },
    { form:"quis, quis, quid", kind:"Ερωτηματική", extra:"ουσιαστική" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ. για έναν ή για πολλούς κτήτορες" },
    { form:"se", kind:"Προσωπική", extra:"γ΄ προσώπου (αυτοπαθής)" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"aegroto", perf:"aegrotavi", sup:"aegrotatum", inf:"aegrotare", note:"" },
      { pres:"paro", perf:"paravi", sup:"paratum", inf:"parare", note:"" },
      { pres:"ignoro", perf:"ignoravi", sup:"ignoratum", inf:"ignorare", note:"" },
      { pres:"intro", perf:"intravi", sup:"intratum", inf:"intrare", note:"" },
      { pres:"simulo", perf:"simulavi", sup:"simulatum", inf:"simulare", note:"" },
      { pres:"interrogo", perf:"interrogavi", sup:"interrogatum", inf:"interrogare", note:"< inter + rogo" },
      { pres:"do", perf:"dedi", sup:"datum", inf:"dare", note:"χαρακτήρας a βραχύς (εκτός: das, da, dans)" },
      { pres:"oro", perf:"oravi", sup:"oratum", inf:"orare", note:"" },
      { pres:"impetro", perf:"impetravi", sup:"impetratum", inf:"impetrare", note:"< in + petro" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"respondeo", perf:"respondi", sup:"responsum", inf:"respondere", note:"" },
      { pres:"cohibeo", perf:"cohibui", sup:"cohibitum", inf:"cohibere", note:"< cum + habeo" },
      { pres:"moveo", perf:"movi", sup:"motum", inf:"movere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"morior", perf:"mortuus sum", sup:"(mortuum)", inf:"mori", note:"αποθετικό σε -io" },
      { pres:"vivo", perf:"vixi", sup:"victum", inf:"vivere", note:"" },
      { pres:"ago", perf:"egi", sup:"actum", inf:"agere", note:"" },
      { pres:"quiesco", perf:"quievi", sup:"quietum", inf:"quiescere", note:"" },
      { pres:"sumo", perf:"sumpsi", sup:"sumptum", inf:"sumere", note:"" },
      { pres:"vinco", perf:"vici", sup:"victum", inf:"vincere", note:"" },
      { pres:"prorumpo", perf:"prorupi", sup:"proruptum", inf:"prorumpere", note:"< pro + rumpo" },
      { pres:"egredior", perf:"egressus sum", sup:"(egressum)", inf:"egredi", note:"αποθετικό σε -io, < e + gradior" },
      { pres:"occido", perf:"occidi", sup:"occisum", inf:"occidere", note:"< ob + cado" },
      { pres:"traho", perf:"traxi", sup:"tractum", inf:"trahere", note:"" },
      { pres:"ascendo", perf:"ascendi", sup:"ascensum", inf:"ascendere", note:"" },
      { pres:"impono", perf:"imposui", sup:"impositum", inf:"imponere", note:"< in + pono" },
      { pres:"conduco", perf:"conduxi", sup:"conductum", inf:"conducere", note:"< cum + duco" },
      { pres:"sequor", perf:"secutus sum", sup:"(secutum)", inf:"sequi", note:"αποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"Ανώμαλα", rows:[
      { pres:"redeo", perf:"redii (και redivi)", sup:"reditum", inf:"redire", note:"σύνθετο του eo (< red + eo)" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Ρήμα", title:"morior, egredior, sequor: αποθετικά σε -io", body:"Τα morior (mortuus sum, mori), egredior (egressus sum, egredi) και sequor (secutus sum, sequi) είναι αποθετικά ρήματα της 3ης συζυγίας· κλίνονται μόνο στην παθητική φωνή με ενεργητική σημασία, δεν έχουν απαρέμφατο μέλλοντα μέσης φωνής και δανείζονται 6 τύπους από την ενεργητική." },
    { tag:"Σύνδεσμος", title:"cum: επαναληπτικός vs ιστορικός", body:"Το cum εμφανίζεται δύο φορές με διαφορετική λειτουργία: στο «cum ... intraverat» είναι χρονικός-επαναληπτικός με οριστική (αόριστη επανάληψη), ενώ στο «cum ... vincerent prorumperentque» είναι ιστορικός-διηγηματικός με υποτακτική (σχέση αιτίου-αιτιατού)." },
    { tag:"Ουσιαστικό", title:"arma: plurale tantum", body:"Το arma, -orum (ουδ. β΄) απαντά μόνο στον πληθυντικό (plurale tantum) και σημαίνει «τα όπλα». Η έκφραση arma moveo = στασιάζω, παίρνω τα όπλα." },
    { tag:"Αντωνυμία", title:"se & suus: ευθεία vs πλάγια αυτοπάθεια", body:"Στο «se dolori dabat» το se είναι άμεση/ευθεία αυτοπάθεια (αναφέρεται στο υποκ. της ίδιας πρότασης). Αντίθετα, το suae στο «lacrimae suae» βρίσκεται σε δευτερεύουσα και αναφέρεται στο υποκ. Arria της κύριας, άρα είναι έμμεση/πλάγια αυτοπάθεια." },
    { tag:"Ρήμα", title:"Erat ascensurus: ενεργητική περίφραση", body:"Ο τύπος Erat ascensurus είναι ενεργητική περιφραστική συζυγία (μετοχή μέλλοντα + Erat) στην οριστική παρατατικού· δηλώνει «επρόκειτο να ανέβει»." },
    { tag:"Μετοχή", title:"occiso Scriboniano: γνήσια αφαιρετική απόλυτη", body:"Η φράση «occiso Scriboniano» είναι γνήσια αφαιρετική απόλυτη, γιατί το υποκείμενό της (Scriboniano) δεν έχει κανέναν άλλο ρόλο στην πρόταση με ρήμα το trahebatur." }
  ],

  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"interroganti (επιθετική μετοχή στο marito, χρόνου ενεστ. — σύγχρονο)", to:"qui interrogabat (qui + οριστ. παρατατικού)", note:"εξάρτηση από ιστορικό χρόνο: respondebat" },
      { from:"cohibitae (επιθετική μετοχή στο lacrimae, χρόνου παρακ. — προτερόχρονο)", to:"quae cohibitae erant (quae + οριστ. υπερσυντελίκου)", note:"εξάρτηση από ιστορικό χρόνο: vincerent - respondebat" },
      { from:"occiso (Scriboniano) (γνήσια αφαιρ. απόλυτη, επιρρ. χρονική μτχ. παρακ. — προτερόχρονο)", to:"postquam Scribonianus occisus est (postquam + οριστ. παρακ.) / cum Scribonianus occisus esset (cum + υποτ. υπερσ.)", note:"εξάρτηση από ιστορικό χρόνο: trahebatur" }
    ]},
    { id:"Β", label:"Μετατροπή δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"cum lacrimae suae, diu cohibitae, vincerent egrediebatur", to:"lacrimis suis vincentibus, (diu cohibitis), egrediebatur", note:"χρονική μετοχή, γνήσια αφαιρ. απόλυτη (το υποκ. lacrimis δεν έχει άλλο ρόλο)" },
      { from:"prorumperentque, egrediebatur", to:"(lacrimis) prorumperentibusque egrediebatur", note:"χρονική μετοχή, γνήσια αφαιρ. απόλυτη" }
    ]},
    { id:"Γ", label:"Μετατροπή κυρίων προτάσεων σε μετοχικές φράσεις", items:[
      { from:"Filius mortuus est. Huic Arria funus ita paravit.", to:"Filio mortuo Arria funus ita paravit", note:"χρονική μετοχή συνημμένη στη δοτ. προσωπική χαριστική filio" },
      { from:"Bene quievit, libenter cibum sumpsit", to:"Bene quievit libenter cibo sumpto (a puero)", note:"νόθη αφαιρ. απόλυτη· το εννοούμενο ποιητικό αίτιο a puero ταυτίζεται με το υποκ. puer του quievit" },
      { from:"Conduxit piscatoriam naviculam ingentemque navem secuta est", to:"Conducta piscatoria navicula (ab Arria) ingentem navem secuta est", note:"νόθη αφαιρ. απόλυτη· το εννοούμενο ποιητικό αίτιο ab Arria ταυτίζεται με το υποκ. Arria του secuta est" }
    ]},
    { id:"Δ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Huic Arria funus ita paravit", to:"Funus huic ab Arria ita paratum est" },
      { from:"Tum se dolori dabat", to:"Tum dolori dabatur" },
      { from:"Scribonianus arma in Illyrico contra Claudium moverat", to:"Arma a Scriboniano in Illyrico contra Claudium mota erant" },
      { from:"Conduxit piscatoriam naviculam", to:"Piscatoria navicula ab Arria conducta est" }
    ]},
    { id:"Ε", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"..., ut ignoraretur a marito", to:"ut maritus ignoraret (funus)" },
      { from:"..., et Romam trahebatur", to:"..., et Romam (illi) eum trahebant" },
      { from:"..., ut simul imponeretur", to:"..., ut (milites) simul eam imponerent" }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο (εξάρτηση: Scriptor dicit / dixit)", items:[
      { from:"Aegrotabat Caecina Paetus, maritus Arriae, aegrotabat et filius.", to:"aegrotare Caecinam Paetum, maritum Arriae, aegrotare et filium" },
      { from:"Filius mortuus est.", to:"filium mortuum esse" },
      { from:"Huic Arria funus ita paravit, ut ignoraretur a marito;", to:"illi Arriam funus ita paravisse, ut ignoretur / ignoraretur a marito" },
      { from:"quin immo cum illa cubiculum mariti intraverat, vivere filium simulabat, ac marito persaepe interroganti, quid ageret puer, respondebat: «Bene quievit, libenter cibum sumpsit».", to:"illam, cum cubiculum mariti intravisset, vivere filium simulare, ac marito ... interroganti, quid agat / ageret puer, respondere puerum (ή eum) bene quievisse, ... sumpsisse", note:"Η οριστ. υπερσ. intraverat δεν μετατρέπεται σε υποτ. παρακ. (η πρόταση στον ευθύ λόγο είναι χρονική με χρόνο διαρκείας)." },
      { from:"Deinde, cum lacrimae suae, diu cohibitae, vincerent prorumperentque, egrediebatur;", to:"deinde Arriam, cum lacrimae suae, ... vincerent prorumperentque, egredi", note:"Ο ιστορικός cum σε εξάρτηση από αρκτικό χρόνο (dicit) δεν μετατρέπει την υποτ. παρατ. σε υποτ. ενεστ." },
      { from:"tum se dolori dabat et paulo post siccis oculis redibat.", to:"tum Arriam se dolori dare et ... redire" },
      { from:"Scribonianus arma in Illyrico contra Claudium moverat;", to:"Scribonianum ... movisse" },
      { from:"fuerat Paetus in partibus eius et, occiso Scriboniano, Romam trahebatur.", to:"fuisse Paetum ..., et, ..., (eum) Romam trahi" },
      { from:"Erat ascensurus navem;", to:"Arriam esse ascensuram navem" },
      { from:"Arria milites orabat, ut simul imponeretur.", to:"Arriam milites orare, ut simul imponatur / imponeretur" },
      { from:"Non impetravit:", to:"Arriam non impetravisse" },
      { from:"conduxit piscatoriam naviculam ingentemque navem secuta est.", to:"Arriam conduxisse ... secutam esse" }
    ]},
    { id:"Ζ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ λόγο", items:[
      { from:"..., ac marito persaepe interroganti, quid ageret puer, respondebat: ...", to:"Quid agit puer?", note:"ευθεία ερώτηση" },
      { from:"Arria milites orabat, ut simul imponeretur.", to:"Milites, simul imponar! ή Imponite, quaeso, me simul. ή Milites, me simul imponite!" }
    ]}
  ],

  etymology: [
    { la:"Caecina", el:"Καικίνας." },
    { la:"Paetus", el:"Παίτος." },
    { la:"maritus, marito, mariti", el:"(γαλλ.) mari (= σύζυγος), mariage (= γάμος) // (αγγλ.) marital (= συζυγικός), marry (= παντρεύομαι) // (ιταλ.) marito (= σύζυγος) // (ισπαν.) marido (= σύζυγος)." },
    { la:"Arriae, Arria", el:"Αρρία." },
    { la:"mortuus", el:"βροτός // (γαλλ.) mort (= νεκρός) // (αγγλ.) mortal (= θνητός), mortuary (= νεκροθάλαμος, νεκροτομείο) // (ιταλ.) morto (= νεκρός) // (ισπαν.) muerto (= νεκρός)." },
    { la:"funus", el:"(γαλλ.) funérailles, (αγγλ.) funeral, funèbre (= πένθιμος) // (αγγλ.) funereal (= πένθιμος, νεκρώσιμος) // (ιταλ.) funerale (= κηδεία)." },
    { la:"paravit", el:"(γαλλ.) pré-parer (= ετοιμάζω) // (αγγλ.) apparatus (= συσκευή, μηχανισμός), separate (= χωρίζω, διαχωρίζω) // (ιταλ.) preparare (= ετοιμάζω)." },
    { la:"ignoraretur", el:"(γαλλ.) ignorer (= αγνοώ), ignorance (= άγνοια) // (αγγλ.) ignorant (= αδαής, αμαθής)." },
    { la:"cubiculum", el:"κουβούκλιο // (αγγλ.) shower cubicle (= καμπίνα λουτρού), incubate (= επωάζω, εκκολάπτω), incubator (= θερμοκοιτίδα), concubine (= παλλακίδα)." },
    { la:"intraverat", el:"(γαλλ.) entrer (= μπαίνω) // (αγγλ.) enter (= μπαίνω, εισέρχομαι), entrance (= είσοδος)." },
    { la:"vivere", el:"βίος // βιταλισμός (< γαλλ. vitalisme), βιταμίνη (< γαλλ.) // (αγγλ.) survive (= επιβιώνω), revive (= αναβιώνω, αναζωογονώ), vivid (= ζωηρός, ζωντανός) // (γαλλ.) vivre (= ζω)." },
    { la:"simulabat, simul", el:"(αγγλ.) similar (= όμοιος), simultaneous (= ταυτόχρονος), simulate (= προσομοιώνω, μιμούμαι) // (γαλλ.) similarité (= ομοιότητα), ensemble (= μαζί, σύνολο)." },
    { la:"interroganti", el:"(γαλλ.) interrogation (= ερώτημα, ανάκριση) // (αγγλ.) interrogate (= ανακρίνω, ρωτώ), interrogative (= ερωτηματικός) // (ιταλ.) interrogare (= ερωτώ, ανακρίνω)." },
    { la:"ageret", el:"ἄγω // (αγγλ.) act (= πράξη, ενεργώ), agent (= πράκτορας), agenda (= ατζέντα, ημερήσια διάταξη) // (γαλλ.) agir (= ενεργώ, δρω)." },
    { la:"puer", el:"puerulus → pullus (= μικρό ζώο) → (κατάληξη) -πουλος // (αγγλ.) puerile (= παιδαριώδης) // (γαλλ.) puéril (= παιδαριώδης)." },
    { la:"respondebat", el:"σπένδω, σπονδή· άσπονδος // (πορτογαλ.) responder (= απαντώ) // (αγγλ.) responsible (= υπεύθυνος) // (γαλλ.) répondre (= απαντώ)." },
    { la:"bene", el:"μπονα-μάς [< ιταλ. bona mano (= καλό χέρι)], μπουνάτσα (< βενετ., = καλοκαιρία), μπόνους // (αγγλ.) benefit (= όφελος), benediction (= ευλογία) // (γαλλ.) bien (= καλά)." },
    { la:"quievit", el:"(αγγλ.) quiet (= ησυχία), requiem (= ρέκβιεμ, νεκρώσιμη ακολουθία), acquiesce (= ενδίδω, συγκατανεύω) // (γαλλ.) quiétude (= ηρεμία, γαλήνη)." },
    { la:"libenter", el:"(γερμ.) liebe (= αγάπη) // (αγγλ.) libido (= λίμπιντο, γενετήσια ορμή), libidinous (= λάγνος, φιλήδονος)." },
    { la:"lacrimae", el:"δάκρυμα (= αιτία δακρύων, δάκρυ), δάκρυον // (αγγλ.) lachrymose (= δακρύβρεχτος, κλαψιάρικος) // (γαλλ.) larme (= δάκρυ) // (ιταλ.) lacrima (= δάκρυ)." },
    { la:"cohibitae", el:"(γερμ.) haben (= έχω), (αγγλ.) have // (αγγλ.) prohibit (= απαγορεύω), inhibit (= αναστέλλω, εμποδίζω), exhibit (= εκθέτω, επιδεικνύω)." },
    { la:"vincerent", el:"(γαλλ.) victoire (= νίκη), (αγγλ.) victory, vaincre (= νικώ) // (αγγλ.) convince (= πείθω), invincible (= ανίκητος)." },
    { la:"egrediebatur", el:"(αγγλ.) egress (= έξοδος), progress (= πρόοδος, προχωρώ), ingredient (= συστατικό), gradient (= κλίση, διαβάθμιση) // κογκρέσον (= συνάθροιση) < ιταλ. congresso, με αλλαγή της σημασίας κατά το αγγλικό congress // (γαλλ.) grade (= βαθμός)." },
    { la:"dolori", el:"(αγγλ.) dolor (= θλίψη, πόνος), condolence (= συλλυπητήρια) // (γαλλ.) douleur (= πόνος) // (ιταλ.) dolore (= πόνος)." },
    { la:"dabat", el:"δίδωμι· δώρημα, δώρο // (γαλλ.) donner (= δίνω) // (αγγλ.) donate (= δωρίζω), data (= δεδομένα), date (= ημερομηνία) // (ιταλ.) dare (= δίνω)." },
    { la:"paulo", el:"παῦρος (= μικρός, λίγος) // (γαλλ.) Paul (= Παύλος (κύριο όνομα)) // (ιταλ.) Paolo (= Παύλος (κύριο όνομα)) // (ισπαν.) Pablo (= Παύλος (κύριο όνομα))." },
    { la:"siccis", el:"σέκος (< ιταλ.) // (αγγλ.) desiccate (= αποξηραίνω) // (γαλλ.) sec (= ξηρός, στεγνός) // (ιταλ.) secco (= ξηρός) // (ισπαν.) seco (= ξηρός)." },
    { la:"oculis", el:"ὄπ-ωπα, ὄμ-μα // (αγγλ.) ocular (= οφθαλμικός), binocular (= διόφθαλμος· (πληθ.) κιάλια) // (γαλλ.) oculaire (= οφθαλμικός· προσοφθάλμιος φακός)." },
    { la:"redibat", el:"εἶμι." },
    { la:"Scribonianus, Scriboniano", el:"Σκριβωνιανός // (αγγλ.) scribe (= γραφέας), manuscript (= χειρόγραφο) // (γαλλ.) écrire (= γράφω)." },
    { la:"arma", el:"άρμα, αρματολός // (γαλλ.) armée (= στρατός) // (αγγλ.) army (= στρατός), alarm (= συναγερμός)." },
    { la:"Illyrico", el:"Ιλλυρία." },
    { la:"contra", el:"(επίρρ.) κόντρα (< ιταλ.) // (αγγλ.) country (= χώρα, ύπαιθρος), counter (= αντι-, ενάντια) // (γαλλ.) contre (= εναντίον, κατά), contraire (= αντίθετος)." },
    { la:"Claudium", el:"Κλαύδιος." },
    { la:"moverat", el:"(αγγλ.) move (= κινούμαι), motion (= κίνηση), mobile (= κινητός, ευκίνητος), remote (= απομακρυσμένος), momentum (= ορμή, ώθηση) // μοτέρ (< γαλλ.) // μοτίβο [< ιταλ. motivo (= κίνητρο)] // (γαλλ.) meuble (= έπιπλο)." },
    { la:"partibus", el:"πάρτη, παρτίδα // (γαλλ.) partie // (αγγλ.) particle (= σωματίδιο, μόριο), partial (= μερικός) // (ιταλ.) parte (= μέρος)." },
    { la:"Romam", el:"Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός // (αγγλ.) romance (= ειδύλλιο· ιπποτικό μυθιστόρημα), romantic (= ρομαντικός) // (γαλλ.) roman (= μυθιστόρημα) // (ιταλ.) romanzo (= μυθιστόρημα)." },
    { la:"trahebatur", el:"τρακτέρ (< γαλλ.) // (αγγλ.) ex-traction (= εξαγωγή), attract (= έλκω, προσελκύω), contract (= σύμβαση· συστέλλω), trace (= ίχνος· ανιχνεύω) // (γαλλ.) trait (= γραμμή, χαρακτηριστικό), portrait (= προσωπογραφία)." },
    { la:"erat, est", el:"εἰμί // (αγγλ.) essence (= ουσία) // (γαλλ.) être (= είμαι· το είναι)." },
    { la:"ascensurus", el:"ασανσέρ (< γαλλ. ascenseur) // (αγγλ.) ascend (= ανεβαίνω, αναρριχώμαι), ascension (= άνοδος, ανάληψη) // (ιταλ.) ascendere (= ανεβαίνω)." },
    { la:"navem, naviculam", el:"ναῦς· ναύτης, ναυτικός // (αγγλ.) navy (= πολεμικό ναυτικό), navigate (= πλοηγώ, ναυσιπλοώ) // (γαλλ.) navire (= πλοίο) // (ιταλ.) nave (= πλοίο) // (ισπαν.) nave (= πλοίο)." },
    { la:"milites", el:"μιλιταρισμός (< γαλλ.) // (αγγλ.) military (= στρατιωτικός), militia (= πολιτοφυλακή), militant (= μαχητικός) // (ιταλ.) milite (= στρατιώτης)." },
    { la:"orabat", el:"(αγγλ.) orator (= ρήτορας), oration (= αγόρευση, λόγος), oracle (= χρησμός, μαντείο), adore (= λατρεύω) // ορατόριο (είδος θρησκευτικής όπερας) (< ιταλ.) // (γαλλ.) adorer (= λατρεύω), oraison (= προσευχή)." },
    { la:"imponeretur", el:"(γαλλ.) positionner (= τοποθετώ) // position (= θέση) // (αγγλ.) imposition (= επιβολή) // (ιταλ.) imporre (= επιβάλλω) // (ισπαν.) imponer (= επιβάλλω)." },
    { la:"impetravit", el:"(γαλλ.) per-pétrer (= διαπράττω), impétrer (= αποκτώ κατόπιν αιτήσεως) // (αγγλ.) per-petration (= διάπραξη) // (ιταλ.) impetrare (= επιτυγχάνω με ικεσία) // (ισπαν.) impetrar (= εκλιπαρώ, επιτυγχάνω με παράκληση)." },
    { la:"conduxit", el:"(αγγλ.) ad-ductor (= προσαγωγός μυς), conduit (= αγωγός) // (γαλλ.) con-ducteur (= οδηγός) // (ιταλ.) condurre (= οδηγώ) // (ισπαν.) conducir (= οδηγώ)." },
    { la:"piscatoriam", el:"πισίνα (< βενετ., κυρίως «ιχθυοτροφείο») // (αγγλ.) piscatory (= αλιευτικός), Pisces (= Ιχθύες (ζώδιο)) // (γαλλ.) poisson (= ψάρι) // (ιταλ.) pesce (= ψάρι), pescatore (= ψαράς) // (ισπαν.) pez (= ψάρι)." },
    { la:"secuta", el:"ἕπομαι // (αγγλ.) sequent (= ακόλουθος), sequence (= ακολουθία), sequel (= συνέχεια, επακόλουθο), consequence (= συνέπεια) // (γαλλ.) seconde (= δευτερόλεπτο), suivre (= ακολουθώ), suite (= ακολουθία, συνέχεια) // σεκόντο (= δεύτερη φωνή) (< ιταλ.) // (ιταλ.) seguire (= ακολουθώ) // (ισπαν.) seguir (= ακολουθώ)." }
  ]
};

export default UNIT;
