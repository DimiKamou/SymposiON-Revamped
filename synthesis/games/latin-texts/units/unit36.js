export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 36,
  title: "Μια απόπειρα δωροδοκίας",
  latinTitle: "Lectio XXXVI",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Manius', r:'Υποκείμενο', to:'στο utebatur', g:'ονομ. ενικ., αρσ.', d:'Manius, Manii/Mani (αρσ. β΄) — ο Μάνιος (praenomen)' },
        { l:'Curius', r:'Μέρος του ονόματος (υποκ.)', to:'στο Manius', g:'ονομ. ενικ., αρσ.', d:'Curius, Curii/Curi (αρσ. β΄) — ο Κούριος (nomen)' },
        { l:'Dentatus', r:'Μέρος του ονόματος (υποκ.)', to:'στο Manius', g:'ονομ. ενικ., αρσ.', d:'Dentatus, Dentati (αρσ. β΄) — ο Δεντάτος (cognomen)' },
        { l:'utebatur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατ. — αποθετικό', d:'utor, usus sum, uti (3, αποθ.) — χρησιμοποιώ (+ αφαιρ.)' },
        { l:'maxima', r:'Επιθετικός προσδ.', to:'στο frugalitate', g:'αφαιρ. ενικ., θηλ. — επίθ. β΄ κλ. (υπερθ. του magnus)', d:'maximus, -a, -um — πολύ μεγάλος' },
        { l:'frugalitate', r:'Αντικείμενο (αφαιρ. οργανική)', to:'στο utebatur', g:'αφαιρ. ενικ.', d:'frugalitas, frugalitatis (θηλ. γ΄) — η ολιγάρκεια (χωρίς πληθ.)', a:',' },
        { type:'sub', key:'teliki', label:'Τελική', note:'Δευτ. επιρρ. τελική, ως επιρρ. προσδ. του σκοπού στο utebatur. Εισάγεται με τον τελικό σύνδεσμο quo (γιατί ακολουθεί επίρρημα συγκριτικού βαθμού, facilius) και εκφέρεται με υποτακτική (ο σκοπός θεωρείται υποκειμενική κατάσταση), υποτ. παρατατικού λόγω εξάρτησης από ιστορικό χρόνο (σύγχρονο στο παρελθόν). Ιδιομορφία στην ακολουθία των χρόνων.', kids:[
          { l:'quo', r:'Τελικός σύνδεσμος', g:'τελικός σύνδεσμος (πριν από επίθ./επίρρ. συγκριτικού βαθμού)', d:'quo — για να' },
          { l:'posset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατ.', d:'possum, potui, —, posse — μπορώ' },
          { l:'facilius', r:'Επιρρ. προσδ. του τρόπου', to:'στο posset', g:'τροπικό επίρρ. — συγκρ. βαθμός (του facile, υπερθ. facillime)', d:'facile — εύκολα· facilius — ευκολότερα' },
          { l:'contemnere', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο posset', g:'απαρέμφατο ενεστ. ενεργ.', d:'contemno, contempsi, contemptum, contemnere (3) — περιφρονώ', note:'Υποκ.: το εννοούμενο Manius Curius Dentatus (ταυτοπροσωπία).' },
          { l:'divitias', r:'Αντικείμενο', to:'στο contemnere', g:'αιτ. πληθ.', d:'divitiae, divitiarum (θηλ. α΄) — τα πλούτη (χωρίς ενικ.)', a:'.' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Quodam', r:'Επιθετικός προσδ.', to:'στο die', g:'αφαιρ. ενικ., αρσ. — αόριστη επιθετική αντων.', d:'quidam, quaedam, quoddam — κάποιος, κάποια, κάποιο' },
        { l:'die', r:'Αφαιρετική (τοπική) του χρόνου', to:'στο venerunt', g:'αφαιρ. ενικ.', d:'dies, diei (αρσ. ε΄) — η ημέρα' },
        { l:'venerunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακ. ενεργ.', d:'venio, veni, ventum, venire (4) — έρχομαι' },
        { l:'ad eum', k:'is', r:'Εμπρόθετος επιρρ. προσδ. της κατεύθυνσης (σε πρόσωπο)', to:'στο venerunt', g:'ad (πρόθ. + αιτ.) + eum (αιτ. ενικ., αρσ. — δεικτ. ως επαναληπτική αντων.)', d:'ad — σε, προς· is, ea, id — αυτός, αυτή, αυτό' },
        { l:'legati', r:'Υποκείμενο', to:'στο venerunt', g:'ονομ. πληθ.', d:'legatus, legati (αρσ. β΄) — ο απεσταλμένος' },
        { l:'Samnitium', r:'Γενική κτητική', to:'στο legati', g:'γεν. πληθ.', d:'Samnites, Samnitium (αρσ. γ΄, μόνο πληθ.) — οι Σαμνίτες', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Ille', r:'Υποκείμενο', to:'στο praebuit', g:'ονομ. ενικ., αρσ. — δεικτική αντων.', d:'ille, illa, illud — εκείνος, εκείνη, εκείνο' },
        { l:'praebuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'praebeo, praebui, praebitum, praebere (2) — παρέχω' },
        { l:'se', r:'Άμεσο αντικείμενο', to:'στο praebuit', g:'αιτ. ενικ. — προσωπ. αντων. γ΄ προσ.', d:'se — τον εαυτό του', note:'Εκφράζει άμεση αυτοπάθεια· υποκ. του γερουνδιακού spectandum.' },
        { l:'eis', r:'Έμμεσο αντικείμενο', to:'στο praebuit', g:'δοτ. πληθ., αρσ. — δεικτ. (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'spectandum', r:'Αιτ. γερουνδιακού (δηλώνει σκοπό)', to:'στο praebuit', g:'αιτ. γερουνδιακού, αρσ.', d:'specto, spectavi, spectatum, spectare (1) — βλέπω, παρατηρώ', note:'Υποκ. του το se· από αυτό (ρήμα αίσθησης) εξαρτώνται οι κατηγορηματικές μετοχές assidentem/cenantem.' },
        { l:'assidentem', r:'Κατηγορηματική μετοχή', to:'στο se (μέσω spectandum)', g:'αιτ. ενικ., αρσ. — μτχ. ενεστ.', d:'assideo, assedi, assessum, assidere (2) — κάθομαι' },
        { l:'in scamno', k:'scamnum', r:'Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο', to:'στη μετοχή assidentem', g:'in (πρόθ. + αφαιρ.) + scamno (αφαιρ. ενικ., ουδ.)', d:'in — σε· scamnum, scamni (ουδ. β΄) — το σκαμνί' },
        { l:'apud focum', k:'focus', r:'Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο (πλησίον)', to:'στη μετοχή assidentem', g:'apud (πρόθ. + αιτ.) + focum (αιτ. ενικ.)', d:'apud — κοντά σε· focus, foci (αρσ. β΄) — η φωτιά' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και', note:'Συνδέει τις μετοχές assidentem και cenantem.' },
        { l:'cenantem', r:'Κατηγορηματική μετοχή', to:'στο se (μέσω spectandum)', g:'αιτ. ενικ., αρσ. — μτχ. ενεστ.', d:'ceno, cenavi, cenatum, cenare (1) — γευματίζω' },
        { l:'ex ligneo catillo', k:'catillus', r:'Εμπρόθετος επιρρ. προσδ. της προέλευσης', to:'στη μετοχή cenantem', g:'ex (πρόθ. + αφαιρ.) + ligneo (αφαιρ. ενικ., αρσ. — επίθ. β΄ κλ.) + catillo (αφαιρ. ενικ.)', d:'ex — από· ligneus, -a, -um — ξύλινος· catillus, catilli (αρσ. β΄) — το πιάτο', note:'Το ligneo είναι επιθετικός προσδ. στο catillo.', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως. Εννοούμενο υποκ.: Manius Curius Dentatus.', kids:[
        { l:'Contempsit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'contemno, contempsi, contemptum, contemnere (3) — περιφρονώ', note:'Εννοούμενο υποκ.: Manius Curius Dentatus.' },
        { l:'divitias', r:'Αντικείμενο', to:'στο Contempsit', g:'αιτ. πληθ.', d:'divitiae, divitiarum (θηλ. α΄) — τα πλούτη (χωρίς ενικ.)' },
        { l:'Samnitium', r:'Γενική κτητική', to:'στο divitias', g:'γεν. πληθ.', d:'Samnites, Samnitium (αρσ. γ΄, μόνο πληθ.) — οι Σαμνίτες' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Samnites', r:'Υποκείμενο', to:'στο mirati sunt', g:'ονομ. πληθ.', d:'Samnites, Samnitium (αρσ. γ΄, μόνο πληθ.) — οι Σαμνίτες' },
        { l:'mirati sunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακ. — αποθετικό', d:'miror, miratus sum, mirari (1, αποθ.) — θαυμάζω' },
        { l:'paupertatem', r:'Αντικείμενο', to:'στο mirati sunt', g:'αιτ. ενικ.', d:'paupertas, paupertatis (θηλ. γ΄) — η φτώχεια' },
        { l:'eius', r:'Γενική κτητική', to:'στο paupertatem', g:'γεν. ενικ., αρσ. — δεικτ. (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { l:'Nam', r:'Σύνδεσμος', g:'αιτιολογικός παρατακτικός σύνδεσμος', d:'nam — δηλαδή, γιατί', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως. Εννοούμενο υποκ.: Manius Curius Dentatus. Η χρονική (cum...) προσδιορίζει και το solvit και το dixit.', kids:[
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική, ως επιρρ. προσδ. του χρόνου στα solvit και dixit. Εισάγεται με τον ιστορικό/διηγηματικό cum και εκφέρεται με υποτακτική, που υπογραμμίζει τη βαθύτερη (αιτιακή) σχέση κύριας–δευτ. πρότασης· υποτ. υπερσυντελίκου λόγω εξάρτησης από ιστορικό χρόνο (προτερόχρονο στο παρελθόν).', kids:[
          { l:'cum', r:'Χρον. σύνδεσμος', g:'ιστορικός/διηγηματικός cum (+ υποτακτική)', d:'cum — όταν, ενώ' },
          { l:'attulissent', r:'Ρήμα', g:'γ΄ πληθ. υποτ. υπερσ. ενεργ. — ανώμαλο (σύνθ. του fero)', d:'affero (adfero), attuli, allatum, afferre (adferre) — φέρνω', note:'Εννοούμενο υποκ.: Samnites.' },
          { l:'ad eum', k:'is', r:'Εμπρόθετος επιρρ. προσδ. της κατεύθυνσης (σε πρόσωπο)', to:'στο attulissent', g:'ad (πρόθ. + αιτ.) + eum (αιτ. ενικ., αρσ. — δεικτ. ως επαναληπτική)', d:'ad — σε, προς· is, ea, id — αυτός, αυτή, αυτό' },
          { l:'magnum', r:'Επιθετικός προσδ.', to:'στο pondus', g:'αιτ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'magnus, -a, -um — μεγάλος' },
          { l:'pondus', r:'Αντικείμενο', to:'στο attulissent', g:'αιτ. ενικ., ουδ.', d:'pondus, ponderis (ουδ. γ΄) — το βάρος' },
          { l:'auri', r:'Γενική διαιρετική', to:'στο pondus', g:'γεν. ενικ., ουδ.', d:'aurum, auri (ουδ. β΄) — το χρυσάφι', note:"Κατ' άλλη άποψη γενική του περιεχομένου." },
          { l:'missum', r:'Επιθετική μετοχή (επιθ. προσδ.)', to:'στο pondus', g:'αιτ. ενικ., ουδ. — μτχ. παρακ. παθ.', d:'mitto, misi, missum, mittere (3) — στέλνω' },
          { l:'publice', r:'Επιρρ. προσδ. του τρόπου', to:'στη μετοχή missum', g:'τροπικό επίρρ. (από επίθ. β΄ κλ. publicus)', d:'publice — δημόσια, από την πολιτεία', a:',' },
          { type:'sub', key:'teliki', label:'Τελική', note:'Δευτ. επιρρ. τελική, ως επιρρ. προσδ. του σκοπού στο attulissent. Εισάγεται με τον τελικό σύνδεσμο ut (καταφατική) και εκφέρεται με υποτακτική, υποτ. παρατατικού λόγω εξάρτησης από ιστορικό χρόνο (σύγχρονο στο παρελθόν). Ιδιομορφία στην ακολουθία των χρόνων.', kids:[
            { l:'ut', r:'Τελικός σύνδεσμος', g:'τελικός σύνδεσμος (+ υποτακτική)', d:'ut — για να' },
            { l:'eo', r:'Αντικείμενο (αφαιρ. οργανική)', to:'στο uteretur', g:'αφαιρ. ενικ., ουδ. — δεικτ. (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
            { l:'uteretur', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατ. — αποθετικό', d:'utor, usus sum, uti (3, αποθ.) — χρησιμοποιώ (+ αφαιρ.)', note:'Εννοούμενο υποκ.: Manius Curius Dentatus.', a:',' }
          ]}
        ]},
        { l:'solvit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'solvo, solvi, solutum, solvere (3) — λύνω, χαλαρώνω', note:'Εννοούμενο υποκ.: Manius Curius Dentatus.' },
        { l:'vultum', r:'Αντικείμενο', to:'στο solvit', g:'αιτ. ενικ.', d:'vultus, vultus (αρσ. δ΄) — το πρόσωπο' },
        { l:'risu', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο solvit', g:'αφαιρ. ενικ.', d:'risus, risus (αρσ. δ΄) — το γέλιο' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως. Εννοούμενο υποκ.: Manius Curius Dentatus.', kids:[
        { l:'protinus', r:'Επιρρ. προσδ. του χρόνου', to:'στο dixit', g:'χρονικό επίρρ.', d:'protinus — αμέσως' },
        { l:'dixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέγω', note:'Εννοούμενο υποκ.: Manius Curius Dentatus.', a:':' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας (ευθύς λόγος). Εννοούμενο υποκ.: vos.', kids:[
        { l:'«', plain:true },
        { l:'Ministri', r:'Κλητική προσφώνηση', g:'κλητ. πληθ.', d:'minister, ministri (αρσ. β΄) — ο απεσταλμένος, ο πρεσβευτής' },
        { l:'supervacaneae', r:'Επιθετικός προσδ.', to:'στο legationis', g:'γεν. ενικ., θηλ. — επίθ. β΄ κλ.', d:'supervacaneus, -a, -um — περιττός, ανώφελος', a:',' },
        { type:'sub', key:'teliki', label:'Τελική (παρενθετική)', note:'Δευτ. επιρρ. τελική, παρενθετική. Εισάγεται με τον τελικό σύνδεσμο ne (αρνητική) και εκφέρεται με υποτακτική, υποτ. ενεστώτα γιατί εξαρτάται από αρκτικό χρόνο.', kids:[
          { l:'ne', r:'Τελικός σύνδεσμος', g:'τελικός σύνδεσμος (+ υποτακτική)', d:'ne — για να μην' },
          { l:'dicam', r:'Ρήμα', g:'α΄ ενικ. υποτ. ενεστ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέγω', note:'Εννοούμενο υποκ.: ego.' }
        ]},
        { l:'ineptae', r:'Επιθετικός προσδ.', to:'στο legationis', g:'γεν. ενικ., θηλ. — επίθ. β΄ κλ.', d:'ineptus, -a, -um — ανόητος', a:',' },
        { l:'legationis', r:'Γενική αντικειμενική', to:'στο Ministri', g:'γεν. ενικ.', d:'legatio, legationis (θηλ. γ΄) — η πρεσβεία', a:',' },
        { l:'narrate', r:'Ρήμα', g:'β΄ πληθ. προστ. ενεστ. ενεργ.', d:'narro, narravi, narratum, narrare (1) — διηγούμαι', note:'Εννοούμενο υποκ.: vos.' },
        { l:'Samnitibus', r:'Έμμεσο αντικείμενο', to:'στο narrate', g:'δοτ. πληθ.', d:'Samnites, Samnitium (αρσ. γ΄, μόνο πληθ.) — οι Σαμνίτες' },
        { l:'Manium', r:'Υποκείμενο απαρεμφάτου', to:'στο malle (ετεροπροσωπία)', g:'αιτ. ενικ.', d:'Manius, Manii/Mani (αρσ. β΄) — ο Μάνιος' },
        { l:'Curium', r:'Υποκείμενο απαρεμφάτου', to:'στο malle', g:'αιτ. ενικ.', d:'Curius, Curii/Curi (αρσ. β΄) — ο Κούριος' },
        { l:'malle', r:'Άμεσο αντικείμενο (ειδικό απαρέμφατο)', to:'στο narrate', g:'απαρέμφατο ενεστ. — ανώμαλο', d:'malo, malui, —, malle — προτιμώ', note:'Συγκριτική λέξη· υποκ. του το Manium Curium (ετεροπροσωπία).' },
        { l:'imperare', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο malle', g:'απαρέμφατο ενεστ. ενεργ.', d:'impero, imperavi, imperatum, imperare (1) — εξουσιάζω', note:'Α΄ όρος σύγκρισης· υποκ. το εννοούμενο Manium Curium.' },
        { l:'locupletibus', r:'Αντικείμενο (συμπλήρωμα)', to:'στο imperare', g:'δοτ. πληθ.', d:'locuples, locupletis (αρσ. γ΄) — ο πλούσιος (ουσιαστικοπ. επίθ. γ΄ κλ.)' },
        { l:'quam', r:'Παραβολικός σύνδεσμος (β΄ όρος σύγκρισης)', g:'παραβολικό επίρρ.· εισάγει τον β΄ όρο σύγκρισης', d:'quam — παρά' },
        { l:'fieri', r:'Β΄ όρος σύγκρισης (απαρέμφατο)', to:'προς το imperare (μέσω quam)', g:'απαρέμφατο ενεστ. — ανώμαλο (παθ. του facio)', d:'fio, factus sum, fieri — γίνομαι', note:'Ομοιότροπα προς τον α΄ όρο imperare· υποκ. το εννοούμενο Manium Curium.' },
        { l:'ipsum', r:'Επιθετικός προσδ.', to:'στο (εννοούμενο) υποκ. του fieri', g:'αιτ. ενικ., αρσ. — δεικτ. (ως οριστική) αντων.', d:'ipse, ipsa, ipsum — ο ίδιος' },
        { l:'locupletem', r:'Κατηγορούμενο', to:'στο υποκ. του fieri', g:'αιτ. ενικ.', d:'locuples, locupletis (αρσ. γ΄) — ο πλούσιος', a:';' }
      ]}
    ]},

    { n: 7, kids: [
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας. Εννοούμενο υποκ.: vos.', kids:[
        { l:'mementote', r:'Ρήμα', g:'β΄ πληθ. προστ. παρακ. (με σημ. ενεστ.) — ελλειπτικό', d:'memini, meminisse — θυμάμαι', note:'Εννοούμενο υποκ.: vos.' },
        { l:'me', r:'Υποκείμενο απαρεμφάτων', to:'στα vinci, corrumpi', g:'αιτ. ενικ. — προσωπ. αντων. α΄ προσ.', d:'ego — εγώ' },
        { l:'posse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο mementote', g:'απαρέμφατο ενεστ. — εδώ απρόσωπο', d:'possum, potui, —, posse — μπορώ' },
        { l:'nec', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος (nec … nec)', d:'nec … nec — ούτε … ούτε' },
        { l:'vinci', r:'Υποκείμενο (τελικό απαρέμφατο)', to:'στο posse', g:'απαρέμφατο ενεστ. παθ.', d:'vinco, vici, victum, vincere (3) — νικώ' },
        { l:'acie', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο vinci', g:'αφαιρ. ενικ.', d:'acies, aciei (θηλ. ε΄) — η μάχη' },
        { l:'nec', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος (nec … nec)', d:'nec … nec — ούτε … ούτε' },
        { l:'corrumpi', r:'Υποκείμενο (τελικό απαρέμφατο)', to:'στο posse', g:'απαρέμφατο ενεστ. παθ.', d:'corrumpo, corrupi, corruptum, corrumpere (3) — διαφθείρω' },
        { l:'pecunia', r:'Αφαιρετική (οργανική) του μέσου', to:'στο corrumpi', g:'αφαιρ. ενικ.', d:'pecunia, pecuniae (θηλ. α΄) — τα χρήματα, η αμοιβή', a:'».' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Manius Curius Dentatus", el:"Ο Μάνιος Κούριος Δεντάτος" },
    { la:"utebatur maxima frugalitate,", el:"ήταν πάρα πολύ ολιγαρκής," },
    { la:"quo posset facilius", el:"για να μπορεί ευκολότερα" },
    { la:"contemnere divitias.", el:"να περιφρονεί τα πλούτη." },
    { la:"Quodam die", el:"Κάποια μέρα" },
    { la:"venerunt ad eum", el:"ήρθαν προς αυτόν" },
    { la:"legati Samnitium.", el:"αγγελιοφόροι των Σαμνιτών." },
    { la:"Ille praebuit se eis", el:"Εκείνος παρουσιάστηκε μπροστά τους" },
    { la:"spectandum", el:"για να τον δουν" },
    { la:"assidentem in scamno", el:"να κάθεται σε σκαμνί" },
    { la:"apud focum", el:"δίπλα στη φωτιά" },
    { la:"et cenantem ex ligneo catillo.", el:"και να γευματίζει από ξύλινο πιάτο." },
    { la:"Contempsit", el:"Περιφρόνησε" },
    { la:"divitias Samnitium", el:"τα πλούτη των Σαμνιτών" },
    { la:"et Samnites mirati sunt", el:"και οι Σαμνίτες θαύμασαν" },
    { la:"paupertatem eius.", el:"τη φτώχεια του." },
    { la:"Nam cum attulissent ad eum", el:"Δηλαδή, ενώ είχαν φέρει σε αυτόν" },
    { la:"magnum pondus auri", el:"πολύ χρυσάφι" },
    { la:"missum publice,", el:"που στάλθηκε από την πολιτεία," },
    { la:"ut eo uteretur,", el:"για να το χρησιμοποιήσει," },
    { la:"solvit vultum", el:"χαλάρωσε το (αυστηρό) πρόσωπό του" },
    { la:"risu", el:"με το γέλιο" },
    { la:"et protinus dixit:", el:"και αμέσως είπε:" },
    { la:"«Ministri supervacaneae,", el:"«Απεσταλμένοι της περιττής" },
    { la:"ne dicam ineptae, legationis,", el:"—για να μην πω ανόητης— πρεσβείας," },
    { la:"narrate Samnitibus", el:"πείτε στους Σαμνίτες" },
    { la:"Manium Curium malle", el:"ότι ο Μάνιος Κούριος προτιμάει" },
    { la:"imperare locupletibus", el:"να εξουσιάζει τους πλούσιους" },
    { la:"quam fieri ipsum locupletem;", el:"παρά να γίνει ο ίδιος πλούσιος·" },
    { la:"et mementote", el:"και να θυμάστε" },
    { la:"me posse", el:"ότι εγώ δεν είναι δυνατόν" },
    { la:"nec vinci acie", el:"ούτε να νικηθώ στη μάχη" },
    { la:"nec corrumpi pecunia».", el:"ούτε να διαφθαρώ με χρήματα»." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"divitiae, -arum", note:"μόνο πληθ." },
        { form:"pecunia, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"catillus, -i", note:"ετερογενές (πληθ. catilla, -orum, ουδ.)" },
        { form:"focus, -i" },
        { form:"legatus, -i" },
        { form:"Manius, -ii / -i" },
        { form:"Curius, -ii / -i" },
        { form:"Dentatus, -i" },
        { form:"minister, ministri" },
        { form:"populus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"aurum, -i" },
        { form:"scamnum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"locuples, locupletis", note:"ουσιαστικοπ. επίθ." },
        { form:"Samnites, Samnitium", note:"μόνο πληθ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"legatio, legationis" },
        { form:"paupertas, paupertatis" },
        { form:"frugalitas, frugalitatis", note:"χωρίς πληθ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"pondus, ponderis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"risus, -us" },
        { form:"vultus, -us" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"dies, diei" } ] },
      { gender:"Θηλυκά", items:[ { form:"acies, aciei", note:"στον πληθ. μόνο ονομ./αιτ./κλητ." } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"ineptus, -a, -um" },
      { form:"ligneus, -a, -um" },
      { form:"magnus, -a, -um" },
      { form:"supervacaneus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"ineptus, -a, -um", comp:"ineptior, -ior, -ius", sup:"ineptissimus, -a, -um" },
      { pos:"ligneus, -a, -um", comp:"—", sup:"—" },
      { pos:"magnus, -a, -um", comp:"maior, -ior, -ius", sup:"maximus, -a, -um" },
      { pos:"supervacaneus, -a, -um", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσ." },
    { form:"se", kind:"Προσωπική", extra:"γ΄ προσ. (αυτοπαθής)" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική", extra:"ως οριστική" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"ceno", perf:"cenavi", sup:"cenatum", inf:"cenare", note:"" },
      { pres:"impero", perf:"imperavi", sup:"imperatum", inf:"imperare", note:"" },
      { pres:"narro", perf:"narravi", sup:"narratum", inf:"narrare", note:"" },
      { pres:"specto", perf:"spectavi", sup:"spectatum", inf:"spectare", note:"" },
      { pres:"miror", perf:"miratus sum", sup:"—", inf:"mirari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"assideo", perf:"assedi", sup:"assessum", inf:"assidere", note:"" },
      { pres:"praebeo", perf:"praebui", sup:"praebitum", inf:"praebere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"contemno", perf:"contempsi", sup:"contemptum", inf:"contemnere", note:"" },
      { pres:"corrumpo", perf:"corrupi", sup:"corruptum", inf:"corrumpere", note:"" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"β΄ ενικ. προστ. dic" },
      { pres:"mitto", perf:"misi", sup:"missum", inf:"mittere", note:"" },
      { pres:"solvo", perf:"solvi", sup:"solutum", inf:"solvere", note:"" },
      { pres:"vinco", perf:"vici", sup:"victum", inf:"vincere", note:"" },
      { pres:"utor", perf:"usus sum", sup:"—", inf:"uti", note:"αποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"affero (adfero)", perf:"attuli", sup:"allatum", inf:"afferre (adferre)", note:"σύνθ. του fero· β΄ ενικ. προστ. affer/adfer" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"παθ. του facio" },
      { pres:"malo", perf:"malui", sup:"—", inf:"malle", note:"ανώμαλο" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"ανώμαλο" },
      { pres:"—", perf:"memini", sup:"—", inf:"meminisse", note:"ελλειπτικό (προστ. παρακ. memento, mementote)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7 (προαιρετικό): SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ────────────────────
  sos: [
    { tag:"Σύνταξη", title:"quo αντί ut", body:"Η τελική «quo facilius ... posset» εισάγεται με quo (και όχι ut), γιατί ακολουθεί επίρρημα συγκριτικού βαθμού (facilius)." },
    { tag:"Ρήμα", title:"utor + αφαιρετική", body:"Τα αποθετικά utebatur/uteretur συντάσσονται με αφαιρετική (οργανική) του οργάνου: frugalitate, eo. Το «αντικείμενό» τους δεν μπαίνει σε αιτιατική." },
    { tag:"Χρονική", title:"Ιστορικός/διηγηματικός cum", body:"Η «cum attulissent» εκφέρεται με υποτακτική (υπερσυντελίκου), γιατί είναι ο ιστορικός cum, που υπογραμμίζει τη βαθύτερη (αιτιακή) σχέση κύριας–δευτερεύουσας." },
    { tag:"Γερουνδιακό", title:"spectandum (σκοπός)", body:"Το spectandum είναι αιτιατική γερουνδιακού που δηλώνει σκοπό και εξαρτάται από το praebuit· υποκείμενό του είναι το se, και από αυτό εξαρτώνται οι κατηγορηματικές μετοχές assidentem/cenantem." },
    { tag:"Απαρέμφατο", title:"Ετεροπροσωπία (malle)", body:"Στο «narrate ... Manium Curium malle ...» το ειδικό απαρέμφατο malle έχει υποκείμενο το Manium Curium (αιτ.), διαφορετικό από το εννοούμενο vos του narrate — ετεροπροσωπία." },
    { tag:"Σύγκριση", title:"quam + β΄ όρος", body:"Το quam εισάγει τον β΄ όρο σύγκρισης (fieri) ομοιότροπα προς τον α΄ όρο (imperare)· συγκριτική λέξη είναι το malle. Το facilius είναι συγκρ. του επιρρ. facile (υπερθ. facillime)." }
  ]
};

export default UNIT;
