export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 21,
  title: "Πώς πήρε το όνομά του το Πίσαυρο",
  latinTitle: "Lectio XXI",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Brenno', r:'Υποκείμενο αφαιρ. απόλυτης', g:'αφαιρ. ενικ., αρσ.', d:'Brennus, -i (αρσ. β΄) — ο Βρέννος', note:'«Brenno duce»: ιδιόμορφη (γνήσια) αφαιρετική απόλυτη που δηλώνει χρόνο· Brenno = υποκείμενο, duce = κατηγορηματικός προσδ. Λειτουργεί ως επιρρ. προσδ. του χρόνου στο evertērunt.' },
        { l:'duce', r:'Κατηγορηματικός προσδ.', to:'στο Brenno', g:'αφαιρ. ενικ., αρσ.', d:'dux, ducis (αρσ. γ΄) — ο αρχηγός, ο στρατηγός' },
        { l:'Galli', r:'Υποκείμενο', to:'στο evertērunt', g:'ονομ. πληθ., αρσ.', d:'Gallus, -i (αρσ. β΄) — ο Γαλάτης', a:',' },
        { l:'apud Alliam', k:'Allia', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (το εγγύς)', to:'στο delētis', g:'apud (πρόθ. + αιτ.) + Alliam (αιτ. ενικ., θηλ.)', d:'apud — κοντά σε· Allia, -ae (θηλ. α΄) — ο Αλλίας (ποταμός)' },
        { l:'flumen', r:'Παράθεση', to:'στο Alliam', g:'αιτ. ενικ., ουδ.', d:'flumen, fluminis (ουδ. γ΄) — ο ποταμός' },
        { l:'delētis', r:'Επιρρ. χρονική μετοχή', to:'στο evertērunt', g:'αφαιρ. πληθ., θηλ. — μτχ. παρακ. παθ. φωνής', d:'deleo, delevi, deletum, delere (2) — καταστρέφω, εξολοθρεύω', note:'Αφαιρετική απόλυτη με υποκείμενο το legionibus.' },
        { l:'legionibus', r:'Υποκείμενο μετοχής (αφαιρ. απόλυτη)', to:'στο delētis', g:'αφαιρ. πληθ., θηλ.', d:'legio, legionis (θηλ. γ΄) — η λεγεώνα' },
        { l:'Romanōrum', r:'Γενική κτητική', to:'στο legionibus', g:'γεν. πληθ., αρσ.', d:'Romani, -orum (αρσ. β΄, ως ουσ. πληθ.) — οι Ρωμαίοι', a:',' },
        { l:'evertērunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής', d:'everto, everti, eversum, evertere (3) — καταστρέφω ολοκληρωτικά' },
        { l:'urbem', r:'Αντικείμενο', to:'στο evertērunt', g:'αιτ. ενικ., θηλ.', d:'urbs, urbis (θηλ. γ΄) — η πόλη' },
        { l:'Rōmam', r:'Επεξήγηση', to:'στο urbem', g:'αιτ. ενικ., θηλ.', d:'Roma, -ae (θηλ. α΄) — η Ρώμη' },
        { l:'praeter Capitōlium', k:'Capitolium', r:'Εμπρόθετος επιρρ. προσδ. που δηλώνει εξαίρεση', to:'στο evertērunt', g:'praeter (πρόθ. + αιτ.) + Capitolium (αιτ. ενικ., ουδ.)', d:'praeter — εκτός από· Capitolium, -ii/-i (ουδ. β΄) — το Καπιτώλιο', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. ονοματική αναφορική επιθετική προσδιοριστική πρόταση, ως επιθετικός προσδ. στο Capitolium. Εισάγεται με την αναφορική αντωνυμία quo (pro quo: εμπρόθετη εισαγωγή) και εκφέρεται με οριστική παρακειμένου (accepērunt), γιατί δηλώνει το πραγματικό.', kids:[
          { l:'pro quo', k:'qui', r:'Εμπρόθετος επιρρ. προσδ. που δηλώνει αντικατάσταση/αντάλλαγμα', to:'στο accepērunt', g:'pro (πρόθ. + αφαιρ.) + quo (αφαιρ. ενικ., ουδ. — αναφορική αντων.)', d:'pro — αντί για, ως αντάλλαγμα· qui, quae, quod — ο οποίος' },
          { l:'accepērunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής', d:'accipio (ad+capio), accepi, acceptum, accipere (3, 15 σε -io) — δέχομαι, παίρνω', note:'Εννοούμενο υποκείμενο: Galli.' },
          { l:'immensam', r:'Επιθετικός προσδ.', to:'στο pecuniam', g:'αιτ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'immensus, -a, -um — τεράστιος, πολύ μεγάλος' },
          { l:'pecuniam', r:'Αντικείμενο', to:'στο accepērunt', g:'αιτ. ενικ., θηλ.', d:'pecunia, -ae (θηλ. α΄) — τα χρήματα, το χρηματικό ποσό', a:'.' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο est factus', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'Camillus', r:'Υποκείμενο', to:'στο est factus', g:'ονομ. ενικ., αρσ.', d:'Camillus, -i (αρσ. β΄) — ο Κάμιλλος', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. ονοματική αναφορική επιθετική προσδιοριστική πρόταση, ως παράθεση στο Camillus. Εισάγεται με την αναφορική αντωνυμία qui και εκφέρεται με οριστική υπερσυντελίκου (fuerat), γιατί δηλώνει το πραγματικό.', kids:[
          { l:'qui', r:'Υποκείμενο', to:'στο fuerat', g:'ονομ. ενικ., αρσ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος' },
          { l:'diu', r:'Επιρρ. προσδ. του χρόνου', to:'στο fuerat', g:'χρονικό επίρρημα (ΣΥΓΚΡ. diutius, ΥΠΕΡΘ. diutissime)', d:'diu — για πολύ καιρό' },
          { l:'apud Ardeam', k:'Ardea', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (το εγγύς)', to:'στο fuerat', g:'apud (πρόθ. + αιτ.) + Ardeam (αιτ. ενικ., θηλ.)', d:'apud — κοντά σε· Ardea, -ae (θηλ. α΄) — η Αρδέα' },
          { l:'in exilio', k:'exilium', r:'Εμπρόθετος επιρρ. προσδ. που δηλώνει κατάσταση', to:'στο fuerat', g:'in (πρόθ. + αφαιρ.) + exilio (αφαιρ. ενικ., ουδ.)', d:'in — σε· exilium, -ii/-i (ουδ. β΄) — η εξορία' },
          { l:'fuerat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσυντελίκου', d:'sum, fui, —, esse — είμαι, υπάρχω, βρίσκομαι' },
          { l:'propter Vēientānam praedam', k:'praeda', r:'Εμπρόθετος επιρρ. προσδ. της αιτίας (εξωτ. αναγκαστικό αίτιο)', to:'στο fuerat', g:'propter (πρόθ. + αιτ.) + praedam (αιτ. ενικ., θηλ.)· Vēientānam (αιτ. ενικ., θηλ. — επίθ. β΄ κλ.)', d:'propter — εξαιτίας· Veientanus, -a, -um — ο σχετικός με τους Βηίους· praeda, -ae (θηλ. α΄) — η λεία', note:'Vēientānam: επιθετικός προσδ. στο praedam (δεν έχει παραθετικά λόγω σημασίας).' },
          { l:'non', r:'Άρνηση', to:'στο divīsam', g:'αρνητικό μόριο', d:'non — όχι, δεν' },
          { l:'aequo', r:'Επιθετικός προσδ.', to:'στο iure', g:'αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'aequus, -a, -um — ίσος, δίκαιος' },
          { l:'iure', r:'Αφαιρετική του τρόπου', to:'στο divīsam', g:'αφαιρ. ενικ., ουδ.', d:'ius, iuris (ουδ. γ΄) — το δίκαιο' },
          { l:'divīsam', r:'Επιθετική μετοχή (επιθετικός προσδ.)', to:'στο praedam', g:'αιτ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής', d:'divido, divisi, divisum, dividere (3) — μοιράζω, χωρίζω', note:'Υποκείμενο μετοχής: praedam. «non ... divīsam» = που δεν είχε μοιραστεί.', a:',' }
        ]},
        { l:'absens', r:'Επιρρ. εναντιωματική μετοχή (συνημμένη)', to:'στο est factus', g:'ονομ. ενικ., αρσ. — μτχ. ενεστ.', d:'absum, afui, —, abesse — απουσιάζω (σύνθ. του sum)', note:'Υποκείμενο μετοχής: Camillus. Δηλώνει εναντίωση: «αν και απουσίαζε».' },
        { l:'dictātor', r:'Κατηγορούμενο', to:'στο Camillus (μέσω est factus)', g:'ονομ. ενικ., αρσ.', d:'dictator, dictatoris (αρσ. γ΄) — ο δικτάτορας, ο αρχιστράτηγος' },
        { l:'est factus', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — ανώμαλο (fio)', d:'fio, factus sum, —, fieri — γίνομαι (ως παθ. του facio)', a:';' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'is', r:'Υποκείμενο', to:'στο secūtus est', g:'ονομ. ενικ., αρσ. — δεικτική (επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'Gallos', r:'Αντικείμενο', to:'στο secūtus est', g:'αιτ. πληθ., αρσ.', d:'Gallus, -i (αρσ. β΄) — ο Γαλάτης' },
        { l:'iam', r:'Επιρρ. προσδ. του χρόνου', to:'στο abeuntes', g:'χρονικό επίρρημα', d:'iam — ήδη, πια, πλέον' },
        { l:'abeuntes', r:'Επιρρ. χρονική μετοχή (συνημμένη)', to:'στο secūtus est', g:'αιτ. πληθ., αρσ. — μτχ. ενεστ. ενεργ. φωνής', d:'abeo, abii/abivi, abitum, abire — φεύγω, αποχωρώ (ανώμαλο, σύνθ. του eo)', note:'Υποκείμενο μετοχής: Gallos.' },
        { l:'secūtus est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — αποθετικό', d:'sequor, secutus sum, sequi (3, αποθετικό) — ακολουθώ', a:':' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Η αναφορική αντωνυμία quibus στην αρχή περιόδου, μετά από ισχυρό σημείο στίξης, λειτουργεί ως δεικτική και εισάγει κύρια πρόταση.', kids:[
        { l:'quibus', r:'Υποκείμενο μετοχής (αφαιρ. απόλυτη)', to:'στο interemptis', g:'αφαιρ. πληθ., αρσ. — αναφορική (εδώ ως δεικτική) αντων.', d:'qui, quae, quod — ο οποίος (εδώ: αυτός)', note:'Αναφορική ως δεικτική· εισάγει κύρια πρόταση.' },
        { l:'interemptis', r:'Επιρρ. χρονική μετοχή (αφαιρ. απόλυτη)', to:'στο recēpit', g:'αφαιρ. πληθ., αρσ. — μτχ. παρακ. παθ. φωνής', d:'interimo, interemi, interemptum, interimere (3) — εξολοθρεύω, σκοτώνω', note:'Υποκείμενο μετοχής: quibus.' },
        { l:'aurum', r:'Αντικείμενο', to:'στο recēpit', g:'αιτ. ενικ., ουδ.', d:'aurum, -i (ουδ. β΄) — το χρυσάφι' },
        { l:'omne', r:'Κατηγορηματικός προσδ.', to:'στο aurum', g:'αιτ. ενικ., ουδ. — επίθ. γ΄ κλ.', d:'omnis, -is, -e — όλος, ολόκληρος', note:'Κατηγορηματικός (όχι επιθετικός) προσδ.· δεν έχει παραθετικά λόγω σημασίας.' },
        { l:'recēpit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'recipio, recepi, receptum, recipere (3, 15 σε -io) — παίρνω πίσω, ανακτώ', note:'Εννοούμενο υποκείμενο: is.', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Το quod στην αρχή περιόδου, μετά από ισχυρό σημείο στίξης, λειτουργεί ως δεικτική αντωνυμία και εισάγει κύρια πρόταση.', kids:[
        { l:'Quod', r:'Υποκείμενο', to:'στο dedit', g:'ονομ. ενικ., ουδ. — αναφορική (εδώ ως δεικτική) αντων.', d:'qui, quae, quod — ο οποίος (εδώ: αυτό)', note:'Αναφορική ως δεικτική· εισάγει κύρια πρόταση.' },
        { l:'appensum', r:'Επιρρ. αιτιολογική μετοχή (συνημμένη)', to:'στο dedit', g:'ονομ. ενικ., ουδ. — μτχ. παρακ. παθ. φωνής', d:'appendo, appendi, appensum, appendere (3) — ζυγίζω', note:'Υποκείμενο μετοχής: Quod. Δηλώνει αιτία.' },
        { l:'illic', r:'Επιρρ. προσδ. του τόπου', to:'στο appensum', g:'τοπικό επίρρημα', d:'illic — εκεί' },
        { l:'dedit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'do, dedi, datum, dare (1) — δίνω' },
        { l:'nomen', r:'Άμεσο αντικείμενο', to:'στο dedit', g:'αιτ. ενικ., ουδ.', d:'nomen, nominis (ουδ. γ΄) — το όνομα' },
        { l:'civitāti', r:'Έμμεσο αντικείμενο', to:'στο dedit', g:'δοτ. ενικ., θηλ.', d:'civitas, civitatis (θηλ. γ΄) — η πολιτεία', a:':' }
      ]}
    ]},

    { n: 6, kids: [
      { l:'nam', r:'Σύνδεσμος', g:'αιτιολογικός (παρατακτικός) σύνδεσμος', d:'nam — γιατί, δηλαδή', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Pisaurum', r:'Κατηγορούμενο', to:'στο civitas (μέσω dicitur)', g:'ονομ. ενικ., ουδ.', d:'Pisaurum, -i (ουδ. β΄) — το Πίσαυρο' },
        { l:'dicitur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. παθ. φωνής', d:'dico, dixi, dictum, dicere (3) — λέω, ονομάζω', note:'Εννοούμενο υποκείμενο: civitas.', a:',' },
        { type:'sub', key:'aitiologiki', label:'Αιτιολογική', note:'Δευτ. επιρρηματική αιτιολογική πρόταση, ως επιρρ. προσδ. της αιτίας στο dicitur. Εισάγεται με τον αιτιολογικό σύνδεσμο quod και εκφέρεται με οριστική παρακειμένου (pensātum est), γιατί δηλώνει αντικειμενική αιτιολογία.', kids:[
          { l:'quod', r:'Αιτιολογικός σύνδεσμος', g:'αιτιολογικός σύνδεσμος (+ οριστική) — αντικειμενική αιτιολογία', d:'quod — επειδή' },
          { l:'illic', r:'Επιρρ. προσδ. του τόπου', to:'στο pensātum est', g:'τοπικό επίρρημα', d:'illic — εκεί' },
          { l:'aurum', r:'Υποκείμενο', to:'στο pensātum est', g:'ονομ. ενικ., ουδ.', d:'aurum, -i (ουδ. β΄) — το χρυσάφι' },
          { l:'pensātum est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής', d:'penso, pensavi, pensatum, pensare (1) — ζυγίζω', a:'.' }
        ]}
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Post hoc factum', k:'factum', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο rediit', g:'post (πρόθ. + αιτ.) + factum (αιτ. ενικ., ουδ.)· hoc (αιτ. ενικ., ουδ. — δεικτική αντων.)', d:'post — μετά· hic, haec, hoc — αυτός, αυτή, αυτό· factum, -i (ουδ. β΄) — η πράξη', note:'hoc: επιθετικός προσδ. στο factum.' },
        { l:'rediit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής — ανώμαλο', d:'redeo, redii/redivi, reditum, redire — επιστρέφω (ανώμαλο, σύνθ. του eo)', note:'Εννοούμενο υποκείμενο: Camillus.' },
        { l:'in exilium', k:'exilium', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (κατεύθυνση)', to:'στο rediit', g:'in (πρόθ. + αιτ.) + exilium (αιτ. ενικ., ουδ.)', d:'in — σε· exilium, -ii/-i (ουδ. β΄) — η εξορία', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. ονοματική αναφορική επιθετική προσδιοριστική πρόταση, ως επιθετικός προσδ. στο exilium. Εισάγεται με το αναφορικό επίρρημα unde και εκφέρεται με οριστική παρακειμένου (reversus est), γιατί δηλώνει το πραγματικό.', kids:[
          { l:'unde', r:'Επιρρ. προσδ. του τόπου (προέλευση)', to:'στο reversus est', g:'αναφορικό τοπικό επίρρημα', d:'unde — απ’ όπου', note:'Εισάγει την αναφορική πρόταση.' },
          { l:'tamen', r:'Αντιθετικός σύνδεσμος', g:'αντιθετικός σύνδεσμος', d:'tamen — όμως' },
          { l:'rogātus', r:'Επιρρ. χρονική μετοχή (συνημμένη)', to:'στο reversus est', g:'ονομ. ενικ., αρσ. — μτχ. παρακ. παθ. φωνής', d:'rogo, rogavi, rogatum, rogare (1) — παρακαλώ, ζητώ', note:'Υποκείμενο μετοχής: Camillus.' },
          { l:'reversus est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — ημιαποθετικό', d:'revertor, reversus sum (/reverti), reverti (3, ημιαποθετικό) — επιστρέφω', note:'Εννοούμενο υποκείμενο: Camillus.', a:'.' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Brenno duce Galli,", el:"Με αρχηγό το Βρέννο οι Γαλάτες," },
    { la:"delētis", el:"αφού κατατρόπωσαν" },
    { la:"legionibus Romanōrum,", el:"τις λεγεώνες των Ρωμαίων" },
    { la:"apud Alliam flumen", el:"κοντά στον Αλία ποταμό," },
    { la:"evertērunt", el:"κατέστρεψαν εντελώς" },
    { la:"urbem Rōmam", el:"την πόλη Ρώμη" },
    { la:"praeter Capitōlium,", el:"εκτός από το Καπιτώλιο," },
    { la:"pro quo accepērunt", el:"για το οποίο πήραν ως αντάλλαγμα" },
    { la:"immensam pecuniam.", el:"ένα πολύ μεγάλο χρηματικό ποσό." },
    { la:"Tum Camillus,", el:"Τότε ο Κάμιλλος," },
    { la:"qui fuerat", el:"ο οποίος είχε βρεθεί" },
    { la:"diu in exilio", el:"για πολύ καιρό στην εξορία" },
    { la:"apud Ardeam", el:"κοντά στην Αρδέα" },
    { la:"propter Vēientānam praedam", el:"εξαιτίας της λείας από τους Βηίους" },
    { la:"divīsam non aequo iure,", el:"που δεν είχε μοιραστεί ακριβοδίκαια," },
    { la:"absens est", el:"αν και απουσίαζε," },
    { la:"factus dictātor;", el:"έγινε αρχιστράτηγος·" },
    { la:"is secūtus est Gallos", el:"αυτός ακολούθησε τους Γαλάτες," },
    { la:"iam abeuntes:", el:"ενώ πια αποχωρούσαν·" },
    { la:"quibus interemptis", el:"αφού τους εξολόθρευσε," },
    { la:"recēpit omne aurum.", el:"πήρε πίσω όλο το χρυσάφι." },
    { la:"Quod appensum illic", el:"Αυτό, επειδή ζυγίστηκε εκεί," },
    { la:"dedit nomen civitāti:", el:"έδωσε το όνομά του στην πολιτεία·" },
    { la:"nam Pisaurum dicitur,", el:"ονομάζεται δηλαδή Πίσαυρο," },
    { la:"quod aurum pensātum est illic.", el:"επειδή το χρυσάφι ζυγίστηκε εκεί." },
    { la:"Post hoc factum", el:"Μετά από αυτή την πράξη" },
    { la:"rediit in exilium,", el:"επέστρεψε στην εξορία," },
    { la:"unde tamen reversus est", el:"από όπου όμως επέστρεψε," },
    { la:"rogātus.", el:"αφού τον παρακάλεσαν." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"Allia, -ae", note:"μόνο ενικ." },
        { form:"Ardea, -ae", note:"μόνο ενικ." },
        { form:"pecunia, -ae" },
        { form:"praeda, -ae" },
        { form:"Rōma, -ae", note:"μόνο ενικ." }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Brennus, -i" },
        { form:"Camillus, -i" },
        { form:"Gallus, -i" },
        { form:"Romanus, -i", note:"ως ουσ. συνήθ. στον πληθ. (Romani, -orum)" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"aurum, -i", note:"μόνο ενικ." },
        { form:"Capitolium, -ii, (-i)", note:"μόνο ενικ." },
        { form:"ex(s)ilium, -ii, (-i)" },
        { form:"factum, -i" },
        { form:"Pisaurum, -i", note:"μόνο ενικ." }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"dictātor, -is" },
        { form:"dux, ducis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"civitas, civitatis" },
        { form:"legio, legiōnis" },
        { form:"urbs, urbis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"flumen, -inis" },
        { form:"ius, iuris" },
        { form:"nomen, -inis" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"aequus, -a, -um" },
      { form:"Vēientānus, -a, -um", note:"δεν έχει παραθετικά λόγω σημασίας" },
      { form:"immensus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"omnis, -is, -e", note:"δεν έχει παραθετικά λόγω σημασίας" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"aequus, -a, -um", comp:"aequior, -ior, -ius", sup:"aequissimus, -a, -um" },
      { pos:"Vēientānus, -a, -um", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά λόγω σημασίας" },
      { pos:"immensus, -a, -um", comp:"immensior, -ior, -ius", sup:"immensissimus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"omnis, -is, -e", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά λόγω σημασίας" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"hic, haec, hoc", kind:"Δεικτική" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"επαναληπτική" },
    { form:"qui, quae, quod", kind:"Αναφορική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"do", perf:"dedi", sup:"datum", inf:"dare", note:"" },
      { pres:"penso", perf:"pensavi", sup:"pensatum", inf:"pensare", note:"" },
      { pres:"rogo", perf:"rogavi", sup:"rogatum", inf:"rogare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"deleo", perf:"delevi", sup:"deletum", inf:"delere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"accipio", perf:"accepi", sup:"acceptum", inf:"accipere", note:"ad+capio, 15 σε -io" },
      { pres:"appendo", perf:"appendi", sup:"appensum", inf:"appendere", note:"" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"" },
      { pres:"divido", perf:"divisi", sup:"divisum", inf:"dividere", note:"" },
      { pres:"everto", perf:"everti", sup:"eversum", inf:"evertere", note:"" },
      { pres:"interimo", perf:"interemi", sup:"interemptum", inf:"interimere", note:"" },
      { pres:"recipio", perf:"recepi", sup:"receptum", inf:"recipere", note:"15 σε -io" },
      { pres:"sequor", perf:"secutus sum", sup:"—", inf:"sequi", note:"αποθετικό" },
      { pres:"revertor", perf:"reversus sum / reverti", sup:"—", inf:"reverti", note:"ημιαποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"absum", perf:"afui", sup:"—", inf:"abesse", note:"σύνθετο του sum" },
      { pres:"abeo", perf:"abii / abivi", sup:"abitum", inf:"abire", note:"ανώμαλο (ab+eo)" },
      { pres:"redeo", perf:"redii / redivi", sup:"reditum", inf:"redire", note:"ανώμαλο (red+eo)" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"ανώμαλο (ως παθ. του facio)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7 (προαιρετικό): SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ────────────────────
  sos: [
    { tag:"Σύνταξη", title:"Brenno duce: ιδιόμορφη αφαιρετική απόλυτη", body:"Το «Brenno duce» είναι ιδιόμορφη (γνήσια) αφαιρετική απόλυτη που δηλώνει χρόνο· Brenno = υποκείμενο, duce = κατηγορηματικός προσδιορισμός. Δεν υπάρχει μετοχή, γιατί το ρήμα sum δεν σχηματίζει μετοχή ενεστώτα." },
    { tag:"Αντωνυμία", title:"quibus / Quod = αναφορική ως δεικτική", body:"Στην αρχή των περιόδων 4 και 5, το quibus και το Quod βρίσκονται μετά από ισχυρό σημείο στίξης· λειτουργούν ως δεικτικές αντωνυμίες και εισάγουν κύρια πρόταση (σύνδεση με το προηγούμενο)." },
    { tag:"Προσδιορισμός", title:"omne: κατηγορηματικός προσδιορισμός", body:"Το omne (aurum omne) είναι κατηγορηματικός προσδιορισμός στο aurum (= όλο το χρυσάφι, στο σύνολό του), όχι επιθετικός. Το omnis δεν σχηματίζει παραθετικά λόγω σημασίας." },
    { tag:"Μετοχή", title:"absens: εναντιωματική μετοχή", body:"Το absens είναι επιρρηματική εναντιωματική μετοχή (συνημμένη, με υποκ. Camillus): «αν και απουσίαζε». Το «est factus» είναι παρακείμενος του ανώμαλου fio (= γίνομαι)." },
    { tag:"Μετοχή", title:"divīsam + iure + propter praedam", body:"Το divīsam είναι επιθετική μετοχή στο praedam· το iure είναι αφαιρετική του τρόπου στο divīsam και το «propter praedam» εμπρόθετος της αιτίας (εξωτερικό αναγκαστικό αίτιο) στο fuerat." },
    { tag:"Σύνδεσμος", title:"Δύο διαφορετικά quod", body:"Προσοχή: στην πρότ. 9 το quod είναι αιτιολογικός σύνδεσμος (+ οριστική, αντικειμενική αιτιολογία), ενώ αλλού το quod/quo είναι αναφορική αντωνυμία. Επίσης sequor = αποθετικό, revertor = ημιαποθετικό." }
  ]
};

export default UNIT;
