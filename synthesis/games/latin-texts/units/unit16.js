// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ
//  Αντιγράψε αυτό το αρχείο (π.χ. units/unit17.js) και συμπλήρωσε τα δικά σου
//  δεδομένα. Το template χτίζει μόνο του: κείμενο με hover, σύνταξη σε
//  [κύριες] / (δευτερεύουσες), μετάφραση, πίνακες λέξεων και SOS.
//
//  ΔΟΜΗ ΚΕΙΜΕΝΟΥ (periods): κάθε περίοδος -> kids (λέξεις ή προτάσεις).
//    Λέξη   : { l:'latin', r:'ρόλος', to:'στο X', g:'γραμματική', d:'λήμμα — σημασία', a:'στίξη', note:'έξτρα' }
//             r = σύντομος ρόλος (π.χ. Υποκείμενο). to = ο όρος εξάρτησης (π.χ. "στο gerunt").
//             Στο popup & στην ανάλυση εμφανίζεται: «r to»  ->  «Υποκείμενο στο gerunt».
//    Πρόταση: { type:'main'|'sub', key:'kyria'|'xroniki'|..., label:'...', note:'...', kids:[...] }
//    Σύνδεσμος εκτός αγκύλης: conn:true.  Άκλιτο/χωρίς popup: plain:true.
//  keys προτάσεων -> χρώμα: kyria, xroniki, aitiologiki, teliki, voulitiki,
//    endoiastiki, symperasmatiki, anaforiki, ypothetiki, plagia, eidiki,
//    paravoliki, enantiomatiki, paraxoritiki
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 16,
  title: "Η τελευταία μάχη του Καίσαρα στη Γαλατία",
  latinTitle: "",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Nostri', r:'Υποκείμενο', to:'στο gerunt', g:'ονομ. πληθ., αρσ. — κτητική αντωνυμία α΄ προσ. (πολλοί κτήτορες)', d:'noster, nostra, nostrum — ο δικός μας', a:',' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική, ως επιρρ. προσδ. του χρόνου στο «rem gerunt». Εισάγεται με τον χρονικό σύνδεσμο postquam και εκφέρεται με οριστική, γιατί δηλώνει κάτι το πραγματικό (προτερόχρονο).', kids:[
          { l:'postquam', r:'Χρον. σύνδεσμος', g:'χρονικός σύνδεσμος (+ οριστική) — προτερόχρονο', d:'postquam — αφού' },
          { l:'miserunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής', d:'mitto, misi, missum, mittere (3) — στέλνω· εδώ: ρίχνω' },
          { l:'pila', r:'Αντικείμενο', to:'στο miserunt', g:'αιτ. πληθ., ουδ.', d:'pilum, -i (ουδ. β΄) — το ακόντιο' },
          { l:'in hostes', k:'hostis', r:'Εμπρόθετος επιρρ. προσδ. της εναντίωσης', to:'στο miserunt', g:'in (πρόθ. + αιτ.) + hostes (αιτ. πληθ.)', d:'in — σε (εδώ εναντίον)· hostis, -is (αρσ. γ΄) — ο εχθρός', a:',' }
        ]},
        { l:'gerunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. ενεργ. φωνής', d:'gero, gessi, gestum, gerere (3) — διεξάγω· «rem gero» = μάχομαι' },
        { l:'rem', r:'Αντικείμενο', to:'στο gerunt', g:'αιτ. ενικ.', d:'res, rei (θηλ. ε΄) — το πράγμα· «rem gero» = μάχομαι' },
        { l:'gladiis', r:'Αφαιρετική του οργάνου', to:'στο rem gerunt', g:'αφαιρ. πληθ.', d:'gladius, -ii/-i (αρσ. β΄) — το ξίφος', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Repente', r:'Επιρρ. προσδ. του τρόπου', to:'στο cernitur', g:'τροπικό επίρρημα', d:'repente — ξαφνικά (από επίθ. γ΄ κλ. repens)' },
        { l:'post tergum', k:'tergum', r:'Εμπρόθετος επιρρ. προσδ. του τόπου', to:'στο cernitur', g:'post (πρόθ. + αιτ.) + tergum (αιτ. ενικ., ουδ.)', d:'post — πίσω από· tergum, -i (ουδ. β΄) — τα νώτα, η πλάτη' },
        { l:'cernitur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. παθ. φωνής', d:'cerno, crevi, cretum, cernere (3) — διακρίνω' },
        { l:'equitatus', r:'Υποκείμενο', to:'στο cernitur', g:'ονομ. ενικ.', d:'equitatus, -us (αρσ. δ΄) — το ιππικό', a:';' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'cohortes', r:'Υποκείμενο', to:'στο appropinquant', g:'ονομ. πληθ.', d:'cohors, cohortis (θηλ. γ΄) — η κοόρτη' },
        { l:'appropinquant', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. ενεργ.', d:'appropinquo, -avi, -atum, -are (1) — πλησιάζω', a:';' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'hostes', r:'Υποκείμενο', to:'στο vertunt', g:'ονομ. πληθ.', d:'hostis, -is (αρσ. γ΄) — ο εχθρός' },
        { l:'vertunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. ενεργ.', d:'verto, verti, versum, vertere (3) — στρέφω' },
        { l:'terga', r:'Αντικείμενο', to:'στο vertunt', g:'αιτ. πληθ., ουδ.', d:'tergum, -i (ουδ. β΄) — τα νώτα' }
      ]}
    ]},

    { n: 5, kids: [
      { l:'ac', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'ac — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'fugiunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. ενεργ.', d:'fugio, fugi, fugitum, fugere (3, 15 σε -io) — φεύγω', note:'Εννοούμενο υποκείμενο: hostes.', a:';' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'eis', r:'Αντικείμενο', to:'στο occurrunt', g:'δοτ. πληθ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό', note:'Το occurro συντάσσεται με δοτική → το eis είναι αντικείμενο (όχι εμπρόθετο).' },
        { l:'occurrunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. ενεργ. (+ δοτ.)', d:'occurro, occurri/occucurri, occursum, occurrere (3) — επιτίθεμαι' },
        { l:'equites', r:'Υποκείμενο', to:'στο occurrunt', g:'ονομ. πληθ.', d:'eques, equitis (αρσ. γ΄) — ο ιππέας', a:'.' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Fit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. — ανώμαλο', d:'fio, factus sum, fieri — γίνομαι' },
        { l:'magna', r:'Επιθετικός προσδ.', to:'στο caedes', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'magnus, -a, -um — μεγάλος' },
        { l:'caedes', r:'Υποκείμενο', to:'στο Fit', g:'ονομ. ενικ.', d:'caedes, -is (θηλ. γ΄) — η σφαγή', a:'.' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Sedulius', r:'Υποκείμενο', to:'στο occiditur', g:'ονομ. ενικ.', d:'Sedulius, -ii/-i (αρσ. β΄) — ο Σεδούλιος (κλητ. Seduli)', a:',' },
        { l:'dux', r:'Παράθεση', to:'στο Sedulius', g:'ονομ. ενικ.', d:'dux, ducis (αρσ. γ΄) — ο αρχηγός, ο στρατηγός' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
        { l:'princeps', r:'Παράθεση', to:'στο Sedulius', g:'ονομ. ενικ.', d:'princeps, principis (αρσ. γ΄) — ο ηγεμόνας' },
        { l:'Lemovicum', r:'Γενική αντικειμενική', to:'στα dux, princeps', g:'γεν. πληθ.', d:'Lemovices, -um (αρσ. γ΄, μόνο πληθ.) — οι Λεμόβικες', a:',' },
        { l:'occiditur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. παθ.', d:'occido, occidi, occisum, occidere (3) — σκοτώνω', a:';' }
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'dux', r:'Υποκείμενο', to:'στο comprehenditur', g:'ονομ. ενικ.', d:'dux, ducis (αρσ. γ΄) — ο αρχηγός, ο στρατηγός' },
        { l:'Arvernorum', r:'Γενική αντικειμενική', to:'στο dux', g:'γεν. πληθ.', d:'Arverni, -orum (αρσ. β΄, μόνο πληθ.) — οι Αρβέρνοι' },
        { l:'comprehenditur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. παθ.', d:'comprehendo/comprendo, -hendi, -hensum, -hendere (3) — συλλαμβάνω' },
        { l:'vivus', r:'Επιρρ. κατηγορούμενο του τρόπου', to:'στο dux (μέσω του comprehenditur)', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'vivus, -a, -um — ζωντανός', note:'Δεν είναι απλός επιθετικός προσδιορισμός, αλλά επιρρηματικό κατηγορούμενο.' },
        { l:'in fuga', k:'fuga', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο comprehenditur', g:'in (πρόθ. + αφαιρ.) + fuga (αφαιρ. ενικ.)', d:'in — σε· fuga, -ae (θηλ. α΄) — η φυγή', a:';' }
      ]}
    ]},

    { n: 10, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'septuaginta', r:'Επιθετικός προσδ.', to:'στο signa', g:'άκλιτο απόλυτο αριθμητικό επίθετο', d:'septuaginta quattuor — εβδομήντα τέσσερα (74)' },
        { l:'quattuor', r:'Επιθετικός προσδ.', to:'στο signa', g:'άκλιτο απόλυτο αριθμητικό επίθετο', d:'septuaginta quattuor — εβδομήντα τέσσερα (74)' },
        { l:'(LXXIIII)', plain:true },
        { l:'militaria', r:'Επιθετικός προσδ.', to:'στο signa', g:'ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.', d:'militaris, -is, -e — στρατιωτικός' },
        { l:'signa', r:'Υποκείμενο', to:'στο referuntur', g:'ονομ. πληθ., ουδ.', d:'signum, -i (ουδ. β΄) — το λάβαρο, η σημαία' },
        { l:'referuntur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. παθ.', d:'refero, ret(t)uli, relatum, referre — παραδίδω (ανώμαλο, σύνθ. του fero)' },
        { l:'ad Caesarem', k:'Caesar', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (κατεύθυνση σε πρόσωπο)', to:'στο referuntur', g:'ad (πρόθ. + αιτ.) + Caesarem (αιτ. ενικ.)', d:'ad — σε, προς· Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας', a:';' }
      ]}
    ]},

    { n: 11, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'magnus', r:'Επιθετικός προσδ.', to:'στο numerus', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'magnus, -a, -um — μεγάλος' },
        { l:'numerus', r:'Υποκείμενο', to:'στο capitur', g:'ονομ. ενικ.', d:'numerus, -i (αρσ. β΄) — ο αριθμός' },
        { l:'hostium', r:'Γενική διαιρετική', to:'στο numerus', g:'γεν. πληθ.', d:'hostis, -is (αρσ. γ΄) — ο εχθρός' },
        { l:'capitur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. παθ.', d:'capio, cepi, captum, capere (3, 15 σε -io) — πιάνω· εδώ: αιχμαλωτίζω' }
      ]},
      { l:'atque', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'atque — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούνται: numerus (υποκ.), hostium (γεν. διαιρετική), magnus (επιθ. προσδ.).', kids:[
        { l:'interficitur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. παθ.', d:'interficio, -feci, -fectum, -ficere (3, 15 σε -io) — σκοτώνω', note:'Εννοούμενο υποκείμενο: numerus.', a:';' }
      ]}
    ]},

    { n: 12, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'reliqui', r:'Υποκείμενο', to:'στο discedunt', g:'ονομ. πληθ., αρσ. — επίθ. β΄ κλ. (ουσιαστικοπ.)', d:'reliquus, -a, -um — υπόλοιπος' },
        { l:'ex fuga', k:'fuga', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο discedunt', g:'ex (πρόθ. + αφαιρ.) + fuga (αφαιρ. ενικ.)', d:'ex — μετά από· fuga, -ae (θηλ. α΄) — η φυγή' },
        { l:'discedunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. ενεργ.', d:'discedo, -cessi, -cessum, -cedere (3) — αποχωρώ· εδώ: διασκορπίζομαι' },
        { l:'in civitates', k:'civitas', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (κατεύθυνση)', to:'στο discedunt', g:'in (πρόθ. + αιτ.) + civitates (αιτ. πληθ.)', d:'in — σε, προς· civitas, civitatis (θηλ. γ΄) — η πολιτεία· εδώ: η επικράτεια', a:'.' }
      ]}
    ]},

    { n: 13, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Postero', r:'Επιθετικός προσδ.', to:'στο die', g:'αφαιρ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'posterus, -a, -um — επόμενος' },
        { l:'die', r:'Αφαιρετική του χρόνου', to:'στο mittuntur', g:'αφαιρ. ενικ.', d:'dies, diei (αρσ. ε΄) — η ημέρα' },
        { l:'mittuntur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. παθ.', d:'mitto, misi, missum, mittere (3) — στέλνω' },
        { l:'legati', r:'Υποκείμενο', to:'στο mittuntur', g:'ονομ. πληθ.', d:'legatus, -i (αρσ. β΄) — ο πρεσβευτής, ο απεσταλμένος' },
        { l:'ad Caesarem', k:'Caesar', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (κατεύθυνση σε πρόσωπο)', to:'στο mittuntur', g:'ad (πρόθ. + αιτ.) + Caesarem (αιτ. ενικ.)', d:'ad — σε, προς· Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας', a:'.' }
      ]}
    ]},

    { n: 14, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Caesar', r:'Υποκείμενο', to:'στο iubet', g:'ονομ. ενικ.', d:'Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας' },
        { l:'iubet', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ.', d:'iubeo, iussi, iussum, iubere (2) — διατάζω' },
        { l:'tradi', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο iubet', g:'απαρέμφατο ενεστ. παθ.', d:'trado, tradidi, traditum, tradere (3) — παραδίδω' },
        { l:'arma', r:'Υποκείμενο απαρεμφάτου', to:'στο tradi (ετεροπροσωπία)', g:'αιτ. πληθ., ουδ.', d:'arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα' },
        { l:'ac', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'ac — και' },
        { l:'produci', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο iubet', g:'απαρέμφατο ενεστ. παθ.', d:'produco, -duxi, -ductum, -ducere (3) — οδηγώ μπροστά' },
        { l:'principes', r:'Υποκείμενο απαρεμφάτου', to:'στο produci (ετεροπροσωπία)', g:'αιτ. πληθ.', d:'princeps, principis (αρσ. γ΄) — ο ηγεμόνας', a:'.' }
      ]}
    ]},

    { n: 15, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Ipse', r:'Κατηγορηματικός προσδ.', to:'στο (εννοούμενο) Caesar', g:'ονομ. ενικ., αρσ. — δεικτική (ως οριστική) αντων.', d:'ipse, ipsa, ipsum — ο ίδιος' },
        { l:'consedit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'consido, consedi, consessum, considere (3) — παίρνω θέση', note:'Εννοούμενο υποκείμενο: Caesar.' },
        { l:'pro castris', k:'castra', r:'Εμπρόθετος επιρρ. προσδ. του τόπου', to:'στο consedit', g:'pro (πρόθ. + αφαιρ.) + castris (αφαιρ. πληθ., ουδ.)', d:'pro — μπροστά σε· castra, -orum (ουδ. β΄) — στρατόπεδο (ενικ. castrum = φρούριο· ετερόσημο)', a:';' }
      ]}
    ]},

    { n: 16, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'eo', r:'Επιρρ. προσδ. τόπου (κατεύθυνση)', to:'στο producuntur', g:'τοπικό επίρρημα', d:'eo — (προς τα) εκεί' },
        { l:'duces', r:'Υποκείμενο', to:'στο producuntur', g:'ονομ. πληθ.', d:'dux, ducis (αρσ. γ΄) — ο αρχηγός, ο στρατηγός' },
        { l:'producuntur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. παθ.', d:'produco, -duxi, -ductum, -ducere (3) — οδηγώ μπροστά', a:'.' }
      ]}
    ]},

    { n: 17, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Vercingetorix', r:'Υποκείμενο', to:'στο deditur', g:'ονομ. ενικ.', d:'Vercingetorix, Vercingetorigis (αρσ. γ΄) — ο Βερκιγγετόριγας' },
        { l:'deditur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. παθ.', d:'dedo, dedidi, deditum, dedere (3) — παραδίδω', a:',' }
      ]}
    ]},

    { n: 18, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'arma', r:'Υποκείμενο', to:'στο proiciuntur', g:'ονομ. πληθ., ουδ.', d:'arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα' },
        { l:'proiciuntur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. παθ.', d:'proicio, -ieci, -iectum, -icere (3, 15 σε -io) — ρίχνω κάτω· εδώ: καταθέτω', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Nostri,", el:"Οι δικοί μας," },
    { la:"postquam miserunt pila in hostes,", el:"αφού έριξαν τα ακόντια στους εχθρούς," },
    { la:"gerunt rem gladiis.", el:"μάχονται με τα ξίφη." },
    { la:"Repente post tergum cernitur equitatus;", el:"Ξαφνικά στα νώτα τους διακρίνεται το ιππικό·" },
    { la:"cohortes appropinquant;", el:"οι κοόρτεις πλησιάζουν·" },
    { la:"hostes vertunt terga", el:"οι εχθροί στρέφουν τα νώτα (τους)" },
    { la:"ac fugiunt;", el:"και φεύγουν·" },
    { la:"eis occurrunt equites.", el:"τους επιτίθενται οι ιππείς." },
    { la:"Fit magna caedes.", el:"Γίνεται μεγάλη σφαγή." },
    { la:"Sedulius, dux et princeps Lemovicum, occiditur;", el:"Ο Σεδούλιος, ο στρατηγός και ηγεμόνας των Λεμοβίκων, σκοτώνεται·" },
    { la:"dux Arvernorum comprehenditur vivus in fuga;", el:"ο στρατηγός των Αρβέρνων συλλαμβάνεται ζωντανός κατά τη διάρκεια της φυγής·" },
    { la:"septuaginta quattuor (LXXIIII) militaria signa referuntur ad Caesarem;", el:"εβδομήντα τέσσερις στρατιωτικές σημαίες παραδίδονται στον Καίσαρα·" },
    { la:"magnus numerus hostium capitur atque interficitur;", el:"μεγάλος αριθμός εχθρών συλλαμβάνεται και εκτελείται·" },
    { la:"reliqui ex fuga discedunt in civitates.", el:"οι υπόλοιποι μετά από τη φυγή διασκορπίζονται στις πολιτείες." },
    { la:"Postero die mittuntur legati ad Caesarem.", el:"Την επόμενη ημέρα στέλνονται πρεσβευτές στον Καίσαρα." },
    { la:"Caesar iubet tradi arma ac produci principes.", el:"Ο Καίσαρας διατάζει να παραδοθούν τα όπλα και να οδηγηθούν μπροστά του οι ηγεμόνες." },
    { la:"Ipse consedit pro castris;", el:"Ο ίδιος παίρνει θέση μπροστά από το στρατόπεδο·" },
    { la:"eo duces producuntur.", el:"εκεί οι αρχηγοί οδηγούνται μπροστά του." },
    { la:"Vercingetorix deditur,", el:"Ο Βερκιγγετόριγας παραδίδεται," },
    { la:"arma proiciuntur.", el:"τα όπλα κατατίθενται." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[ { form:"fuga, -ae" } ] }
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Arverni, -orum", note:"μόνο πληθ." },
        { form:"gladius, -ii" },
        { form:"legatus, -i" },
        { form:"numerus, -i" },
        { form:"Sedulius, -ii / -i", note:"μόνο ενικ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"arma, -orum", note:"μόνο πληθ." },
        { form:"castra, -orum", note:"ετερόσημο" },
        { form:"pilum, -i" },
        { form:"signum, -i" },
        { form:"tergum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Caesar, Caesaris", note:"μόνο ενικ." },
        { form:"dux, ducis" },
        { form:"eques, equitis" },
        { form:"hostis, -is" },
        { form:"Lemovices, -um", note:"μόνο πληθ." },
        { form:"princeps, principis" },
        { form:"Vercingetorix, Vercingetorigis", note:"μόνο ενικ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"caedes, -is" },
        { form:"cohors, cohortis" },
        { form:"civitas, civitatis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"equitatus, -us" } ] }
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"dies, diei" } ] },
      { gender:"Θηλυκά", items:[ { form:"res, rei" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"magnus, -a, -um" },
      { form:"posterus, -a, -um" },
      { form:"reliquus, -a, -um" },
      { form:"vivus, -a, -um" },
      { form:"septuaginta quattuor", note:"άκλιτο αριθμητικό" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"militaris, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"magnus, -a, -um", comp:"maior, -ior, -ius", sup:"maximus, -a, -um" },
      { pos:"posterus, -a, -um", comp:"posterior, -ior, -ius", sup:"postremus, -a, -um / postumus, -a, -um" },
      { pos:"reliquus, -a, -um", comp:"—", sup:"—" },
      { pos:"vivus, -a, -um", comp:"(vivior, -ior, -ius)", sup:"(vivissimus, -a, -um)" },
      { pos:"septuaginta quattuor", comp:"—", sup:"—", note:"άκλιτο" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"militaris, -is, -e", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"noster, nostra, nostrum", kind:"Κτητική", extra:"α΄ προσ., πολλοί κτήτορες" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική", extra:"ως οριστική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"appropinquo", perf:"appropinquavi", sup:"appropinquatum", inf:"appropinquare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"iubeo", perf:"iussi", sup:"iussum", inf:"iubere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"capio", perf:"cepi", sup:"captum", inf:"capere", note:"15 σε -io" },
      { pres:"cerno", perf:"crevi", sup:"cretum", inf:"cernere", note:"μτχ. παρακ. conspectus" },
      { pres:"comprehendo / comprendo", perf:"comprehendi", sup:"comprehensum", inf:"comprehendere", note:"" },
      { pres:"consido", perf:"consedi", sup:"consessum", inf:"considere", note:"" },
      { pres:"dedo", perf:"dedidi", sup:"deditum", inf:"dedere", note:"" },
      { pres:"discedo", perf:"discessi", sup:"discessum", inf:"discedere", note:"" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"ανώμαλο (παθ. του facio)" },
      { pres:"fugio", perf:"fugi", sup:"fugitum", inf:"fugere", note:"15 σε -io" },
      { pres:"gero", perf:"gessi", sup:"gestum", inf:"gerere", note:"" },
      { pres:"interficio", perf:"interfeci", sup:"interfectum", inf:"interficere", note:"15 σε -io" },
      { pres:"mitto", perf:"misi", sup:"missum", inf:"mittere", note:"" },
      { pres:"occido", perf:"occidi", sup:"occisum", inf:"occidere", note:"" },
      { pres:"occurro", perf:"occurri / occucurri", sup:"occursum", inf:"occurrere", note:"" },
      { pres:"produco", perf:"produxi", sup:"productum", inf:"producere", note:"" },
      { pres:"proicio", perf:"proieci", sup:"proiectum", inf:"proicere", note:"15 σε -io" },
      { pres:"refero", perf:"ret(t)uli", sup:"relatum", inf:"referre", note:"ανώμαλο (σύνθ. του fero)" },
      { pres:"trado", perf:"tradidi", sup:"traditum", inf:"tradere", note:"" },
      { pres:"verto", perf:"verti", sup:"versum", inf:"vertere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] }
  ],

  // ── ΜΕΡΟΣ 7 (προαιρετικό): SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ────────────────────
  sos: [
    { tag:"Σύνταξη", title:"rem gero = μάχομαι", body:"Η περίφραση «rem gero» αποδίδεται «μάχομαι». Το gladiis είναι αφαιρετική του οργάνου στη ρηματική φράση «rem gerunt»." },
    { tag:"Ρήμα", title:"fit → fio", body:"Ο τύπος fit είναι γ΄ ενικ. ενεστ. του ανώμαλου fio, factus sum, fieri, που λειτουργεί ως παθητικό του facio." },
    { tag:"Σύνταξη", title:"occurro + δοτική", body:"Το occurro συντάσσεται με δοτική· γι' αυτό το eis είναι αντικείμενο (και όχι εμπρόθετος προσδιορισμός)." },
    { tag:"Προσδιορισμός", title:"vivus: επιρρ. κατηγορούμενο", body:"Το vivus δεν είναι απλός επιθετικός προσδιορισμός, αλλά επιρρηματικό κατηγορούμενο του τρόπου στο dux (μέσω του comprehenditur)." },
    { tag:"Ουσιαστικό", title:"castra: ετερόσημο", body:"castra, -orum (ουδ. β΄, πληθ.) = στρατόπεδο· στον ενικό castrum, -i = φρούριο. Ετερόσημο ουσιαστικό." },
    { tag:"Απαρέμφατο", title:"Ετεροπροσωπία (tradi / produci)", body:"Στο «Caesar iubet arma tradi ac principes produci» τα τελικά απαρέμφατα έχουν υποκείμενα arma και principes — διαφορετικά από το υποκείμενο του iubet (Caesar). Πρόκειται για ετεροπροσωπία." }
  ]
};

export default UNIT;
