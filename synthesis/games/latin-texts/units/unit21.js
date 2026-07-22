export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 21,
  title: "Πώς πήρε το όνομά του το Πίσαυρο",
  latinTitle: "Lectio XXI (Prima et Vicesima)",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Brenno', r:'Κατηγορηματικός προσδ. του αξιώματος', to:'στο duce', g:'αφαιρ. ενικ., αρσ.', d:'Brennus, -i (αρσ. β΄) — ο Βρέννος', note:'«Brenno duce»: ιδιόμορφη αφαιρετική απόλυτη που δηλώνει χρόνο (δεν υπάρχει μετοχή). Το duce είναι «υποκείμενο» και το Brenno κατηγορηματικός προσδιορισμός που δηλώνει αξίωμα.' },
        { l:'duce', r:'«Υποκείμενο» ιδιόμορφης αφαιρ. απόλυτης', to:'(δηλώνει χρόνο)', g:'αφαιρ. ενικ.', d:'dux, ducis (αρσ. γ΄) — ο αρχηγός, στρατηγός' },
        { l:'Galli', r:'Υποκείμενο', to:'στο everterunt', g:'ονομ. πληθ., αρσ.', d:'Gallus, -i (αρσ. β΄) — ο Γαλάτης', a:',' },
        { l:'apud Alliam', k:'Allia', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (πλησίον)', to:'στη μετοχή deletis', g:'apud (πρόθ. + αιτ.) + Alliam (αιτ. ενικ.)', d:'apud — κοντά σε· Allia, -ae (αρσ. α΄) — ο Αλίας (ποταμός)' },
        { l:'flumen', r:'Παράθεση', to:'στο Alliam', g:'αιτ. ενικ., ουδ.', d:'flumen, fluminis (ουδ. γ΄) — ο ποταμός' },
        { l:'deletis', r:'Επιρρ. χρονική μετοχή (νόθη αφαιρ. απόλυτη)', to:'στο everterunt', g:'αφαιρ. πληθ., θηλ. — μτχ. παρακειμένου παθ. φωνής', d:'deleo, delevi, deletum, delere (2) — κατατροπώνω, καταστρέφω, εξολοθρεύω', note:'Δηλώνει το προτερόχρονο. Νόθη αφαιρ. απόλυτη: το εννοούμενο ποιητικό αίτιο a Gallis ταυτίζεται με το υποκείμενο Galli του ρήματος εξάρτησης everterunt.' },
        { l:'legionibus', r:'Υποκείμενο μετοχής', to:'στο deletis', g:'αφαιρ. πληθ.', d:'legio, legionis (θηλ. γ΄) — η λεγεώνα' },
        { l:'Romanorum', r:'Γενική κτητική', to:'στο legionibus', g:'γεν. πληθ.', d:'Romanus, -i (αρσ. β΄) — ο Ρωμαίος', a:',' },
        { l:'everterunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής', d:'everto, everti, eversum, evertere (3) (< ex + verto) — καταστρέφω εντελώς' },
        { l:'urbem', r:'Αντικείμενο', to:'στο everterunt', g:'αιτ. ενικ.', d:'urbs, urbis (θηλ. γ΄) — η πόλη' },
        { l:'Romam', r:'Επεξήγηση', to:'στο urbem', g:'αιτ. ενικ., θηλ.', d:'Roma, -ae (θηλ. α΄) — η Ρώμη' },
        { l:'praeter Capitolium', k:'Capitolium', r:'Εμπρόθετος επιρρ. προσδ. της εξαίρεσης', to:'στο everterunt', g:'praeter (πρόθ. + αιτ.) + Capitolium (αιτ. ενικ., ουδ.)', d:'praeter — εκτός από· Capitolium, -ii/-i (ουδ. β΄) — το Καπιτώλιο', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική επιθετική προσδιοριστική πρόταση, στον όρο Capitolium της κύριας. Εισάγεται με την (εμπρόθετη) αναφορική αντων. (pro) quo και εκφέρεται με οριστική (acceperunt), γιατί εκφράζει το πραγματικό και αναφέρεται στο παρελθόν.', kids:[
          { l:'pro quo', k:'quo', r:'Εμπρόθετος επιρρ. προσδ. του ανταλλάγματος', to:'στο acceperunt', g:'pro (πρόθ. + αφαιρ.) + quo (αφαιρ. ενικ., ουδ.) — αναφορική αντων.', d:'pro — ως αντάλλαγμα· qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'immensam', r:'Επιθετικός προσδ.', to:'στο pecuniam', g:'αιτ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'immensus, -a, -um (< in + metior) — τεράστιος, πολύ μεγάλος' },
          { l:'pecuniam', r:'Αντικείμενο', to:'στο acceperunt', g:'αιτ. ενικ.', d:'pecunia, -ae (θηλ. α΄) — τα χρήματα, το χρηματικό ποσό' },
          { l:'acceperunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής', d:'accipio, accepi, acceptum, accipere (3, σε -io) (< ad + capio) — δέχομαι, παίρνω', note:'Εννοούμενο υποκείμενο: Galli.', a:'.' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο est factus', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'Camillus', r:'Υποκείμενο', to:'στο est factus', g:'ονομ. ενικ., αρσ.', d:'Camillus, -i (αρσ. β΄) — ο Κάμιλλος', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική επιθετική προσδιοριστική πρόταση, στον όρο Camillus της κύριας. Εισάγεται με την αναφορική αντων. qui και εκφέρεται με οριστική (fuerat), γιατί εκφράζει το πραγματικό· δηλώνει το προτερόχρονο.', kids:[
          { l:'qui', r:'Υποκείμενο', to:'στο fuerat', g:'ονομ. ενικ., αρσ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'diu', r:'Επιρρ. προσδ. του χρόνου', to:'στο fuerat', g:'χρονικό επίρρημα', d:'diu — για πολύ καιρό' },
          { l:'apud Ardeam', k:'Ardea', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (πλησίον)', to:'στο fuerat', g:'apud (πρόθ. + αιτ.) + Ardeam (αιτ. ενικ.)', d:'apud — κοντά σε· Ardea, -ae (θηλ. α΄) — η Αρδέα (πόλη του Λατίου)' },
          { l:'in exilio', k:'exilium', r:'Εμπρόθετος επιρρ. προσδ. της κατάστασης', to:'στο fuerat', g:'in (πρόθ. + αφαιρ.) + exilio (αφαιρ. ενικ., ουδ.)', d:'in — σε· ex(s)ilium, -ii/-i (ουδ. β΄) — η εξορία' },
          { l:'fuerat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσυντελίκου', d:'sum, fui, —, esse — είμαι, βρίσκομαι, υπάρχω' },
          { l:'propter', r:'Εμπρόθετος επιρρ. προσδ. της αιτίας (εξωτ. αναγκ. αίτιο)', to:'στο fuerat (με το praedam)', g:'πρόθεση + αιτ.', d:'propter — εξαιτίας' },
          { l:'Veientanam', r:'Επιθετικός προσδ.', to:'στο praedam', g:'αιτ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'Veientanus, -a, -um (< Veiens = Βήιος) — σχετικός με τους Βηίους' },
          { l:'praedam', r:'Αντικείμενο εμπροθέτου (υποκ. μετοχής divisam)', to:'στο propter', g:'αιτ. ενικ.', d:'praeda, -ae (θηλ. α΄) — η λεία' },
          { l:'non', r:'Αρνητικό μόριο', to:'στο divisam', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
          { l:'aequo', r:'Επιθετικός προσδ.', to:'στο iure', g:'αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'aequus, -a, -um — δίκαιος, ίσος' },
          { l:'iure', r:'Αφαιρετική (οργανική) του τρόπου', to:'στη μετοχή divisam', g:'αφαιρ. ενικ.', d:'ius, iuris (ουδ. γ΄) — το δίκαιο' },
          { l:'divisam', r:'Επιθετική μετοχή', to:'στο praedam', g:'αιτ. ενικ., θηλ. — μτχ. παρακειμένου παθ. φωνής', d:'divido, divisi, divisum, dividere (3) — μοιράζω', note:'Δηλώνει το προτερόχρονο (ως μτχ. παρακ.)· λειτουργεί ως επιθετικός προσδ. στο praedam (praedam: υποκ. της μετοχής).', a:',' }
        ]},
        { l:'absens', r:'Επιρρ. εναντιωματική μετοχή (συνημμένη στο Camillus)', to:'στο est factus', g:'ονομ. ενικ., αρσ. — μτχ. ενεστ. (γεν. absentis), μονοκατάληκτη γ΄ κλ.', d:'absum, afui, —, abesse (< ab + sum) — απουσιάζω', note:'Δηλώνει το σύγχρονο. Η μετοχή sens του sum δεν είναι σε χρήση· εύχρηστες οι μετοχές των συνθέτων (absens, praesens).' },
        { l:'dictator', r:'Κατηγορούμενο', to:'στο Camillus (μέσω του est factus)', g:'ονομ. ενικ., αρσ.', d:'dictator, dictatoris (αρσ. γ΄) — ο δικτάτορας, αρχιστράτηγος' },
        { l:'est factus', r:'Ρήμα (συνδετικό)', g:'γ΄ ενικ. οριστ. παρακειμένου', d:'fio, factus sum, fieri (ανώμαλο) — γίνομαι', a:';' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'is', r:'Υποκείμενο', to:'στο secutus est', g:'ονομ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό (is = Camillus)' },
        { l:'Gallos', r:'Αντικείμενο', to:'στο secutus est', g:'αιτ. πληθ.', d:'Gallus, -i (αρσ. β΄) — ο Γαλάτης' },
        { l:'iam', r:'Επιρρ. προσδ. του χρόνου', to:'στη μετοχή abeuntes', g:'χρονικό επίρρημα', d:'iam — ήδη, πια, κιόλας' },
        { l:'abeuntes', r:'Επιρρ. χρονική μετοχή (συνημμένη στο Gallos)', to:'στο secutus est', g:'αιτ. πληθ., αρσ. — μτχ. ενεστ. ενεργ. (γεν. abeuntis), μονοκατάληκτη γ΄ κλ.', d:'abeo, abii (abivi), abitum, abire (< ab + eo) — φεύγω, απομακρύνομαι', note:'Δηλώνει το σύγχρονο (Gallos: υποκ. της μετοχής).' },
        { l:'secutus est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — αποθετικό', d:'sequor, secutus sum, (secutum), sequi (3, αποθετικό) — ακολουθώ', a:';' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Η αναφορική αντων. quibus, μετά από ισχυρό σημείο στίξης, ισοδυναμεί με δεικτική (quibus = eis)· εισάγει κύρια και όχι δευτερεύουσα πρόταση.', kids:[
        { l:'quibus', r:'Υποκείμενο μετοχής', to:'στο interemptis', g:'αφαιρ. πληθ., αρσ. — αναφορική αντων. (quibus = eis)', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
        { l:'interemptis', r:'Επιρρ. χρονική μετοχή (νόθη αφαιρ. απόλυτη)', to:'στο recepit', g:'αφαιρ. πληθ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'interimo, interemi, interemptum, interimere (3) (< inter + emo) — εξολοθρεύω', note:'Δηλώνει το προτερόχρονο. Νόθη αφαιρ. απόλυτη: το εννοούμενο ποιητικό αίτιο a Camillo ταυτίζεται με το υποκείμενο Camillus του ρήματος εξάρτησης recepit.' },
        { l:'aurum', r:'Αντικείμενο', to:'στο recepit', g:'αιτ. ενικ., ουδ.', d:'aurum, -i (ουδ. β΄) — το χρυσάφι' },
        { l:'omne', r:'Κατηγορηματικός προσδ.', to:'στο aurum', g:'αιτ. ενικ., ουδ. — επίθ. γ΄ κλ.', d:'omnis, omnis, omne — όλος, ολόκληρος' },
        { l:'recepit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'recipio, recepi, receptum, recipere (3, σε -io) (< re + capio) — παίρνω πίσω, επανακτώ', note:'Εννοούμενο υποκείμενο: Camillus.', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Η αναφορική αντων. Quod, μετά από ισχυρό σημείο στίξης, ισοδυναμεί με δεικτική (Quod = id)· εισάγει κύρια και όχι δευτερεύουσα πρόταση.', kids:[
        { l:'Quod', r:'Υποκείμενο', to:'στο dedit', g:'ονομ. ενικ., ουδ. — αναφορική αντων. (Quod = id)', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
        { l:'illic', r:'Επιρρ. προσδ. της στάσης σε τόπο', to:'στη μετοχή appensum', g:'τοπικό επίρρημα', d:'illic — εκεί' },
        { l:'appensum', r:'Επιρρ. αιτιολογική μετοχή (συνημμένη στο Quod)', to:'στο dedit', g:'ονομ. ενικ., ουδ. — μτχ. παρακειμένου παθ. φωνής', d:'appendo, appendi, appensum, appendere (3) (< ad + pendo) — ζυγίζω', note:'Δηλώνει το προτερόχρονο (Quod: υποκ. της μετοχής).' },
        { l:'civitati', r:'Έμμεσο αντικείμενο', to:'στο dedit', g:'δοτ. ενικ.', d:'civitas, civitatis (θηλ. γ΄) — η πολιτεία' },
        { l:'nomen', r:'Άμεσο αντικείμενο', to:'στο dedit', g:'αιτ. ενικ., ουδ.', d:'nomen, nominis (ουδ. γ΄) — το όνομα' },
        { l:'dedit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'do, dedi, datum, dare (1) — δίνω', a:';' }
      ]}
    ]},

    { n: 6, kids: [
      { l:'nam', r:'Σύνδεσμος', g:'παρατακτικός αιτιολογικός διασαφητικός / επεξηγηματικός σύνδεσμος', d:'nam — γιατί, δηλαδή', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Pisaurum', r:'Κατηγορούμενο', to:'στο εννοούμενο civitas (μέσω του dicitur)', g:'ονομ. ενικ., ουδ.', d:'Pisaurum, -i (ουδ. β΄) — το Πίσαυρο' },
        { l:'dicitur', r:'Ρήμα (συνδετικό)', g:'γ΄ ενικ. οριστ. ενεστ. παθ. φωνής', d:'dico, dixi, dictum, dicere (3) — λέγω, ονομάζω', note:'Εννοούμενο υποκείμενο: civitas.', a:',' },
        { type:'sub', key:'aitiologiki', label:'Αιτιολογική', note:'Δευτ. επιρρηματική αιτιολογική πρόταση· λειτουργεί ως επιρρ. προσδ. της αιτίας στο ρήμα dicitur της κύριας. Εισάγεται με τον αιτιολογικό σύνδεσμο quod και εκφέρεται με οριστική (αιτιολογία αντικειμενικά αποδεκτή)· δηλώνει το προτερόχρονο.', kids:[
          { l:'quod', r:'Σύνδεσμος', g:'υποτακτικός αιτιολογικός σύνδεσμος', d:'quod — επειδή, διότι' },
          { l:'illic', r:'Επιρρ. προσδ. της στάσης σε τόπο', to:'στο pensatum est', g:'τοπικό επίρρημα', d:'illic — εκεί' },
          { l:'aurum', r:'Υποκείμενο', to:'στο pensatum est', g:'ονομ. ενικ., ουδ.', d:'aurum, -i (ουδ. β΄) — το χρυσάφι' },
          { l:'pensatum est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής', d:'penso, pensavi, pensatum, pensare (1) — ζυγίζω', a:'.' }
        ]}
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Post', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο rediit (με το factum)', g:'πρόθεση + αιτ.', d:'post — μετά' },
        { l:'hoc', r:'Επιθετικός προσδ.', to:'στο factum', g:'αιτ. ενικ., ουδ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'factum', r:'Αντικείμενο εμπροθέτου', to:'στο Post', g:'αιτ. ενικ., ουδ.', d:'factum, -i (ουδ. β΄) — η πράξη, το γεγονός' },
        { l:'rediit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου', d:'redeo, redii (redivi), reditum, redire (< red + eo) — επιστρέφω', note:'Εννοούμενο υποκείμενο: Camillus.' },
        { l:'in exilium', k:'exilium', r:'Εμπρόθετος επιρρ. προσδ. της κίνησης σε τόπο (μεταφ.)', to:'στο rediit', g:'in (πρόθ. + αιτ.) + exilium (αιτ. ενικ., ουδ.)', d:'in — σε· ex(s)ilium, -ii/-i (ουδ. β΄) — η εξορία', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική επιθετική προσδιοριστική πρόταση, στον όρο exilium της κύριας. Εισάγεται με το αναφορικό επίρρημα unde και εκφέρεται με οριστική (reversus est), γιατί εκφράζει το πραγματικό και αναφέρεται στο παρελθόν.', kids:[
          { l:'unde', r:'Επιρρ. προσδ. της κίνησης από τόπο', to:'στο reversus est', g:'αναφορικό τοπικό επίρρημα', d:'unde — από όπου' },
          { l:'tamen', r:'Σύνδεσμος', g:'παρατακτικός αντιθετικός σύνδεσμος', d:'tamen — όμως' },
          { l:'rogatus', r:'Επιρρ. χρονική μετοχή (συνημμένη στο εννοούμενο Camillus)', to:'στο reversus est', g:'ονομ. ενικ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'rogo, rogavi, rogatum, rogare (1) — παρακαλώ, ζητώ', note:'Δηλώνει το προτερόχρονο.' },
          { l:'reversus est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — αποθετικό (εδώ)', d:'revertor, reversus sum, (reversum), reverti (3, αποθετικό / ημιαποθετικό) — επιστρέφω', note:'Εννοούμενο υποκείμενο: Camillus.', a:'.' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Brenno duce Galli, apud Alliam flumen deletis legionibus Romanorum, everterunt urbem Romam praeter Capitolium, pro quo immensam pecuniam acceperunt.", el:"Με αρχηγό τον Βρέννο οι Γαλάτες, αφού κατατρόπωσαν τις λεγεώνες των Ρωμαίων κοντά στον Αλία ποταμό, κατέστρεψαν εντελώς την πόλη Ρώμη εκτός από το Καπιτώλιο, για το οποίο πήραν ως αντάλλαγμα (ένα) τεράστιο χρηματικό ποσό." },
    { n:2, la:"Tum Camillus, qui diu apud Ardeam in exilio fuerat propter Veientanam praedam non aequo iure divisam, absens dictator est factus;", el:"Τότε ο Κάμιλλος, ο οποίος είχε παραμείνει στην εξορία για πολύ καιρό κοντά στην Αρδέα εξαιτίας της λείας από τους Βηίους, που δεν είχε μοιραστεί ακριβοδίκαια, αν και απουσίαζε, έγινε δικτάτορας·" },
    { n:3, la:"is Gallos iam abeuntes secutus est;", el:"αυτός ακολούθησε τους Γαλάτες, ενώ ήδη έφευγαν·" },
    { n:4, la:"quibus interemptis aurum omne recepit.", el:"αφού εξολόθρευσε αυτούς, πήρε πίσω όλο το χρυσάφι." },
    { n:5, la:"Quod illic appensum civitati nomen dedit;", el:"Αυτό, επειδή ζυγίστηκε εκεί, έδωσε το όνομα στην πολιτεία·" },
    { n:6, la:"nam Pisaurum dicitur, quod illic aurum pensatum est.", el:"ονομάζεται δηλαδή Πίσαυρο, επειδή εκεί ζυγίστηκε το χρυσάφι." },
    { n:7, la:"Post hoc factum rediit in exilium, unde tamen rogatus reversus est.", el:"Μετά από αυτή την πράξη επέστρεψε στην εξορία, από όπου, όμως, γύρισε, αφού τον παρακάλεσαν." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Allia, -ae", note:"ποταμός (κύριο όνομα)" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"Roma, -ae", note:"κύριο όνομα, χωρίς πληθ." },
        { form:"pecunia, -ae", note:"περιληπτικό, χωρίς πληθ." },
        { form:"Ardea, -ae", note:"κύριο όνομα" },
        { form:"praeda, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Brennus, -i", note:"κύριο όνομα" },
        { form:"Gallus, -i", note:"όνομα έθνους, κυρίως πληθ." },
        { form:"Romanus, -i", note:"όνομα έθνους, κυρίως πληθ." },
        { form:"Camillus, -i", note:"κύριο όνομα" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"Capitolium, -ii/-i", note:"υπερδισύλλαβο σε -ium· γεν. ενικ. Capitolii/Capitoli" },
        { form:"ex(s)ilium, -ii/-i", note:"υπερδισύλλαβο σε -ium· γεν. ενικ. ex(s)ilii/ex(s)ili" },
        { form:"aurum, -i", note:"όνομα μετάλλου, χωρίς πληθ." },
        { form:"Pisaurum, -i", note:"κύριο όνομα, χωρίς πληθ." },
        { form:"factum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"dux, ducis", note:"αρσενικό αν και σε -x" },
        { form:"dictator, dictatoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"legio, legionis" },
        { form:"urbs, urbis", note:"γεν. πληθ. urbium· αιτ. πληθ. urbes/urbis" },
        { form:"civitas, civitatis", note:"γεν. πληθ. civitatum/civitatium" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"flumen, fluminis" },
        { form:"ius, iuris" },
        { form:"nomen, nominis" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"immensus, -a, -um" },
      { form:"Veientanus, -a, -um", note:"παράγωγο από κύριο όνομα (< Veiens)" },
      { form:"aequus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"omnis, omnis, omne" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ & ΕΠΙΡΡΗΜΑΤΩΝ ───────────────────────────
  comparatives: [
    { kl:"Επίθετα", rows:[
      { pos:"immensus, -a, -um", comp:"immensior, -ior, -ius", sup:"immensissimus, -a, -um" },
      { pos:"aequus, -a, -um", comp:"aequior, -ior, -ius", sup:"aequissimus, -a, -um" },
      { pos:"Veientanus, -a, -um", comp:"—", sup:"—" },
      { pos:"omnis, -is, -e", comp:"—", sup:"—" }
    ]},
    { kl:"Επιρρήματα", rows:[
      { pos:"immense", comp:"immensius", sup:"immensissime" },
      { pos:"aeque", comp:"aequius", sup:"aequissime" },
      { pos:"diu", comp:"diutius", sup:"diutissime" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"do", perf:"dedi", sup:"datum", inf:"dare", note:"χαρακτ. a βραχύ (εκτός das, da, dans)" },
      { pres:"penso", perf:"pensavi", sup:"pensatum", inf:"pensare", note:"" },
      { pres:"rogo", perf:"rogavi", sup:"rogatum", inf:"rogare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"deleo", perf:"delevi", sup:"deletum", inf:"delere", note:"" },
      { pres:"everto", perf:"everti", sup:"eversum", inf:"evertere", note:"< ex + verto" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"accipio", perf:"accepi", sup:"acceptum", inf:"accipere", note:"σε -io (< ad + capio)" },
      { pres:"divido", perf:"divisi", sup:"divisum", inf:"dividere", note:"" },
      { pres:"sequor", perf:"secutus sum", sup:"(secutum)", inf:"sequi", note:"αποθετικό" },
      { pres:"interimo", perf:"interemi", sup:"interemptum", inf:"interimere", note:"< inter + emo" },
      { pres:"recipio", perf:"recepi", sup:"receptum", inf:"recipere", note:"σε -io (< re + capio)" },
      { pres:"appendo", perf:"appendi", sup:"appensum", inf:"appendere", note:"< ad + pendo" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"προστ. ενεστ. dic" },
      { pres:"revertor", perf:"reversus sum", sup:"(reversum)", inf:"reverti", note:"αποθετικό / ημιαποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"Ανώμαλα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"absum", perf:"afui", sup:"—", inf:"abesse", note:"< ab + sum" },
      { pres:"abeo", perf:"abii (abivi)", sup:"abitum", inf:"abire", note:"< ab + eo" },
      { pres:"redeo", perf:"redii (redivi)", sup:"reditum", inf:"redire", note:"< red + eo" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"ως παθ. του facio" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"Brenno duce: ιδιόμορφη αφαιρετική απόλυτη", body:"Το «Brenno duce» είναι ιδιόμορφη (νόθη) αφαιρετική απόλυτη χωρίς μετοχή, γιατί το ρήμα sum δεν έχει μετοχή ενεστώτα. Το duce λειτουργεί ως «υποκείμενο» και το Brenno ως κατηγορηματικός προσδιορισμός που δηλώνει αξίωμα. Δηλώνει χρόνο και αναλύεται σε cum Brennus dux esset / dum Brennus dux est." },
    { tag:"Σύνταξη", title:"Νόθη αφαιρετική απόλυτη", body:"Τα deletis legionibus και quibus interemptis είναι νόθες αφαιρετικές απόλυτες: το εννοούμενο ποιητικό αίτιο (a Gallis, a Camillo) ταυτίζεται με το υποκείμενο του ρήματος εξάρτησης (Galli / Camillus). Αντίθετα, στη μετατροπή «auro pensato» έχουμε γνήσια αφαιρετική απόλυτη." },
    { tag:"Αντωνυμία", title:"quibus / Quod = εις / id (κύρια πρόταση)", body:"Η αναφορική αντωνυμία (quibus, Quod) στην αρχή περιόδου και μετά από ισχυρό σημείο στίξης ισοδυναμεί με δεικτική (quibus = eis, Quod = id) και εισάγει κύρια —όχι δευτερεύουσα αναφορική— πρόταση." },
    { tag:"Ρήμα", title:"revertor: αποθετικό ή ημιαποθετικό", body:"Το revertor λειτουργεί είτε ως αποθετικό (παρακ. reversus sum) είτε ως ημιαποθετικό (παρακ. reverti). Κριτήριο διάκρισης είναι ο παρακείμενος· εδώ (reversus est) λειτουργεί ως αποθετικό. Δεν έχει απαρέμφατο μέλλοντα μέσης φωνής και δανείζεται 6 τύπους από την ενεργητική." },
    { tag:"Ρήμα", title:"accipio / recipio: σύνθετα του capio σε -io", body:"Τα accipio (< ad + capio) και recipio (< re + capio) ανήκουν στα 15 ρήματα σε -io της γ΄ συζυγίας: αποβάλλουν τον χαρακτήρα i όταν ακολουθεί άλλο i, το -er (βραχύ) ή το -e τελικό της προστακτικής." },
    { tag:"Σύνταξη", title:"Εξωτερικό αναγκαστικό αίτιο", body:"Το propter Veientanam praedam δηλώνει εξωτερικό αναγκαστικό αίτιο (εκφέρεται με ob / per / propter + αιτιατική). Αντίθετα, το εσωτερικό αναγκαστικό αίτιο (ψυχικά πάθη) εκφέρεται με απλή αφαιρετική (π.χ. dolore, timore, pudore)." }
  ],

  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"deletis legionibus (νόθη αφαιρ. απόλυτη · χρονική μτχ. παρακ. · προτερόχρονο)", to:"postquam Galli legiones deleverunt / delevere (postquam + οριστ. παρακειμένου) ή cum Galli legiones delevissent (cum + υποτ. υπερσυντελίκου)", note:"εξάρτηση από ιστορικό χρόνο: everterunt" },
      { from:"non divisam (επιθετική μτχ. παρακ. στο praedam · προτερόχρονο)", to:"quae non divisa erat (quae + οριστ. υπερσυντελίκου)", note:"εξάρτηση: fuerat" },
      { from:"absens (εναντιωματική μτχ. ενεστ. · σύγχρονο)", to:"etsi aberat (etsi + οριστ. παρατατικού) ή licet abesset (licet + υποτ. παρατατικού)", note:"εξάρτηση: est factus" },
      { from:"abeuntes (χρονική μτχ. ενεστ. · σύγχρονο)", to:"dum abeunt (dum + οριστ. ενεστώτα, συνεχιζόμενη πράξη) ή cum abirent (cum + υποτ. παρατατικού)", note:"εξάρτηση: secutus est" },
      { from:"quibus interemptis (νόθη αφαιρ. απόλυτη · χρονική μτχ. παρακ. · προτερόχρονο)", to:"postquam Camillus interemit eos (postquam + οριστ. παρακειμένου) ή cum Camillus interemisset eos (cum + υποτ. υπερσυντελίκου)", note:"εξάρτηση: recepit" },
      { from:"appensum (αιτιολογική μτχ. παρακ. · προτερόχρονο)", to:"quod (ή quia / quoniam) appensum erat (οριστ. υπερσυντ. · αντικειμ. αποδεκτή αιτιολογία) ή quod appensum esset (υποτ. · υποκειμ. αιτιολογία) ή cum appensum esset (cum + υποτ. υπερσυντ.)", note:"εξάρτηση: dedit" },
      { from:"rogatus (χρονική μτχ. παρακ. · προτερόχρονο)", to:"postquam rogatus est (postquam + οριστ. παρακ.) ή cum rogatus esset (cum + υποτ. υπερσυντ.)", note:"εξάρτηση: reversus est" }
    ]},
    { id:"Β", label:"Ανάλυση της ιδιόμορφης αφαιρετικής απόλυτης σε χρονική πρόταση", items:[
      { from:"Brenno duce", to:"cum Brennus dux esset (cum + υποτ. παρατατικού) ή dum Brennus dux est (dum + οριστ. ενεστώτα)" }
    ]},
    { id:"Γ", label:"Μετατροπή δευτερεύουσας πρότασης σε μετοχή", items:[
      { from:"nam Pisaurum dicitur, quod illic aurum pensatum est", to:"nam Pisaurum dicitur illic auro pensato", note:"Μετατροπή της αιτιολογικής πρότασης σε αιτιολογική μετοχή (γνήσια αφαιρ. απόλυτη), γιατί το υποκείμενό της «auro» δεν έχει άλλον ρόλο στην πρόταση με ρήμα το dicitur στην οποία ανήκει." }
    ]},
    { id:"Δ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Brenno duce Galli ... everterunt urbem Romam praeter Capitolium, pro quo immensam pecuniam acceperunt", to:"Brenno duce a Gallis ... urbs Roma eversa est praeter Capitolium, pro quo immensa pecunia accepta est" },
      { from:"quibus interemptis aurum omne recepit", to:"quibus (= Gallis) interemptis aurum omne (a Camillo) receptum est" },
      { from:"Quod illic appensum civitati nomen dedit", to:"Nomen eo appenso illic civitati datum est", note:"Το ποιητικό αίτιο eo εκφέρεται με απρόθετη αφαιρετική, γιατί είναι άψυχο· επίσης η μετοχή appenso είναι συνημμένη στο ποιητικό αίτιο eo." }
    ]},
    { id:"Ε", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"Tum Camillus, —, absens dictator est factus", to:"Tum (Romani) Camillum absentem dictatorem fecerunt / fecere" },
      { from:"nam Pisaurum dicitur, quod illic aurum pensatum est", to:"nam (Romani) civitatem Pisaurum dicunt, quod illic aurum pensaverunt / pensavere" }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο (εξάρτηση: Ille / Scriptor dicit — αρκτ. χρ. / dixit — ιστορ. χρ.)", items:[
      { from:"Brenno duce Galli ... everterunt ..., pro quo ... acceperunt", to:"Brenno duce Gallos ... evertisse ..., pro quo ... acceperint / accepissent" },
      { from:"Tum Camillus, qui ... fuerat ..., absens dictator est factus", to:"tum Camillum, qui ... fuerit / fuisset ..., absentem dictatorem esse factum" },
      { from:"is Gallos iam abeuntes secutus est", to:"eum ... secutum esse" },
      { from:"quibus interemptis aurum omne recepit", to:"eis interemptis Camillum aurum omne recepisse" },
      { from:"Quod illic appensum civitati nomen dedit", to:"id (αιτ.) illic appensum (αιτ.) ... dedisse" },
      { from:"nam Pisaurum dicitur, quod illic aurum pensatum est", to:"civitatem Pisaurum (αιτ.) dici, quod illic aurum pensatum sit / pensatum esset" },
      { from:"Post hoc factum rediit in exilium, unde tamen rogatus reversus est", to:"post illud factum Camillum redisse in exilium, unde ... reversus sit / reversus esset" }
    ]}
  ],

  etymology: [
    { la:"Brenno", el:"Βρέννος." },
    { la:"dux", el:"δούκας // (αγγλ.) duke (= δούκας, ευγενής) // (γαλλ.) duc (= δούκας) // (ιταλ.) duce (= ηγέτης, αρχηγός)." },
    { la:"Galli, Gallos", el:"Γάλλοι, Γαλλία // (αγγλ.) Gallic (= γαλατικός, της Γαλατίας)." },
    { la:"Alliam", el:"Αλίας." },
    { la:"flumen", el:"φλέω (= είμαι κατάμεστος), φλύω (= αναβράζω), φλοῖσβος (= ήχος κυμμάτων) // (γερμ.) fluss (= ποτάμι) // (αγγλ.) flume (= τεχνητός αγωγός/κανάλι νερού) // (ιταλ.) fiume (= ποτάμι)." },
    { la:"deletis", el:"(αγγλ.) delete (= διάγραψε), indelible (= ανεξίτηλος) // (γαλλ.) indélébile (= ανεξίτηλος)." },
    { la:"legionibus", el:"λέγω // (αγγλ.) legion (= λεγεώνα, πλήθος) // (γαλλ.) légion (= λεγεώνα)." },
    { la:"Romanorum, Romam", el:"Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός // (αγγλ.) romance (= ιπποτικό αφήγημα, ειδύλλιο) // (γαλλ.) roman (= μυθιστόρημα)." },
    { la:"everterunt, reversus", el:"(verso) βέρσο (= πίσω μέρος σελίδας), ρεβέρ (< γαλλ.), v.s. (= εναντίον) // (αγγλ.) version (= εκδοχή, έκδοση), convert (= μετατρέπω), vertigo (= ίλιγγος)." },
    { la:"urbem", el:"(γαλλ.) urbain (= αστικός) // (αγγλ.) urban (= αστικός), suburb (= προάστιο)." },
    { la:"Capitolium (< caput)", el:"Καπιτώλιο // καπέλο [< ιταλ. capello (= κάλυμμα κεφαλιού)] // (γαλλ.) capitalisme, chef (= αρχηγός, μάγειρας) // (αγγλ.) captain (= αρχηγός, πλοίαρχος)." },
    { la:"immensam (< in + metior)", el:"μέτρον, μέτριος // (αγγλ.) immense (= τεράστιος, αμέτρητος), measure (= μέτρο, μετρώ) // (γαλλ.) mesure (= μέτρο)." },
    { la:"acceperunt, recepit", el:"(γαλλ.) accepter (= δέχομαι) // (ιταλ.) capire (= καταλαβαίνω) // (αγγλ.) capture (= συλλαμβάνω, αιχμαλωτίζω), receive (= λαμβάνω), capable (= ικανός)." },
    { la:"Camillus", el:"Κάμιλλος // (γαλλ.) Camille // (ιταλ.) Camillo (= ιταλ. βαπτιστικό όνομα) // (ισπαν.) Camilo (= ισπαν. βαπτιστικό όνομα)." },
    { la:"Ardeam", el:"Αρδέα." },
    { la:"exilio, exilium", el:"(γαλλ.) exil (= εξορία) // (αγγλ.) exile (= εξορία, εξόριστος) // (ιταλ.) esilio (= εξορία)." },
    { la:"praedam", el:"(αγγλ.) prey (= λεία), predator (= αρπακτικό, θηρευτής) // (γαλλ.) proie (= λεία)." },
    { la:"aequo", el:"(αγγλ.) equal (= ίσος), equator (= ισημερινός) // (γαλλ.) égal (= ίσος)." },
    { la:"iure", el:"(αγγλ.) justice, (γαλλ.) justice (= δικαιοσύνη), jury (= σώμα ενόρκων), injury (= βλάβη, αδικία) // (γαλλ.) juste (= δίκαιος)." },
    { la:"divisam", el:"(γαλλ.) diviser (= χωρίζω) // (αγγλ.) division (= διαίρεση) // (ιταλ.) dividere (= διαιρώ, χωρίζω)." },
    { la:"absens, est", el:"εἰμί // (αγγλ.) absent (= απών) // (γαλλ.) absent (= απών)." },
    { la:"dictator, dicitur", el:"δείκ-νυμι (= δείχνω) // δικτάτορας // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση) // (αγγλ.) dictate (= υπαγορεύω) // (ιταλ.) dire (= λέω)." },
    { la:"factus, factum", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο) // (γαλλ.) fait (= γεγονός) // (ιταλ.) fatto (= γεγονός, καμωμένος)." },
    { la:"abeuntes, rediit", el:"εἶμι // ιταμός // (αγγλ.) exit (= έξοδος), transit (= διέλευση)." },
    { la:"secutus", el:"ἕπομαι // (αγγλ.) sequent (= ακόλουθος), sequence (= ακολουθία) // (γαλλ.) seconde (= δευτερόλεπτο), suivre (= ακολουθώ) // σεκόντο (= δεύτερη φωνή) (< ιταλ.) // (ιταλ.) seguire (= ακολουθώ)." },
    { la:"aurum", el:"(γαλλ.) or // (ιταλ.) oro (= χρυσός) // (ισπαν.) oro (= χρυσός)." },
    { la:"appensum, pensatum", el:"(αγγλ.) pending (= εκκρεμής), pension (= σύνταξη), pensive (= σκεπτικός) // (γαλλ.) peser (= ζυγίζω), penser (= σκέφτομαι)." },
    { la:"civitati", el:"κοίτη· (αγγλ.) city (= πόλη) // (γαλλ.) civilisation (= πολιτισμός) // (αγγλ.) civic (= δημοτικός) // (ιταλ.) città (= πόλη) // (ισπαν.) ciudad (= πόλη)." },
    { la:"nomen", el:"ὄνομα // (γαλλ.) nom (= όνομα, ουσιαστικό), (αγγλ.) name // (αγγλ.) noun (= ουσιαστικό), nominal (= ονομαστικός) // (ιταλ.) nome (= όνομα) // (ισπαν.) nombre (= όνομα)." },
    { la:"dedit", el:"δίδωμι· δώρημα, δώρο // (γαλλ.) donner (= δίνω) // (αγγλ.) data (= δεδομένα), date (= ημερομηνία) // (ιταλ.) dare (= δίνω) // (ισπαν.) dar (= δίνω)." },
    { la:"Pisaurum", el:"Πίσαυρο // (ιταλ.) Pesaro." },
    { la:"rogatus", el:"(γαλλ.) inter-rogation (= ερώτημα, ανάκριση) // (αγγλ.) arrogant (= αλαζόνας), prerogative (= προνόμιο) // (ισπαν.) rogar (= παρακαλώ, ικετεύω)." }
  ]
};

export default UNIT;
