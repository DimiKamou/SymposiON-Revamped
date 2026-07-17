export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 32,
  title: "Ένας πανηγυρικός της λογοτεχνίας",
  latinTitle: "Lectio XXXII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Pleni', r:'Κατηγορούμενο', to:'στο libri (μέσω του sunt)', g:'ονομ. πληθ., αρσ. — επίθ. β΄ κλ.', d:'plenus, -a, -um — γεμάτος', note:'Ως συμπλήρωμα εννοείται γενική αντικειμενική (exemplorum).' },
        { l:'omnes', r:'Κατηγορηματικός προσδ.', to:'στο libri', g:'ονομ. πληθ., αρσ. — επίθ. γ΄ κλ. (δικατάληκτο)', d:'omnis, -is, -e — όλος' },
        { l:'sunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. — ανώμαλο (βοηθητικό)', d:'sum, fui, —, esse — είμαι, υπάρχω' },
        { l:'libri', r:'Υποκείμενο', to:'στο sunt', g:'ονομ. πληθ., αρσ.', d:'liber, libri (αρσ. β΄) — το βιβλίο', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'plenae', r:'Κατηγορούμενο', to:'στο voces (μέσω του εννοούμενου sunt)', g:'ονομ. πληθ., θηλ. — επίθ. β΄ κλ.', d:'plenus, -a, -um — γεμάτος', note:'Εννοείται το ρήμα sunt. Ως συμπλήρωμα εννοείται γενική αντικειμενική (exemplorum).' },
        { l:'sapientium', r:'Γενική υποκειμενική', to:'στο voces', g:'γεν. πληθ.', d:'sapiens, sapientis (αρσ. γ΄) — ο σοφός' },
        { l:'voces', r:'Υποκείμενο', to:'στο εννοούμενο sunt', g:'ονομ. πληθ., θηλ.', d:'vox, vocis (θηλ. γ΄) — η φωνή, ο λόγος', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'plena', r:'Κατηγορούμενο', to:'στο vetustas (μέσω του εννοούμενου est)', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'plenus, -a, -um — γεμάτος', note:'Εννοείται το ρήμα est.' },
        { l:'exemplorum', r:'Γενική αντικειμενική', to:'στο plena', g:'γεν. πληθ., ουδ.', d:'exemplum, -i (ουδ. β΄) — το παράδειγμα' },
        { l:'vetustas', r:'Υποκείμενο', to:'στο εννοούμενο est', g:'ονομ. ενικ., θηλ.', d:'vetustas, vetustatis (θηλ. γ΄) — η αρχαιότητα', a:':' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Η αναφορική αντωνυμία quae στην αρχή περιόδου, αναφερόμενη στα προηγούμενα, ισοδυναμεί με δεικτική (quae = ea) και εισάγει κύρια πρόταση. Το iacerent είναι υποτακτική παρατατικού ως απόδοση υποθετικού λόγου του β΄ είδους.', kids:[
        { l:'quae', r:'Υποκείμενο', to:'στο iacerent', g:'ονομ. πληθ., ουδ. — αναφορική αντων. (εδώ = δεικτική, quae = ea)', d:'qui, quae, quod — ο οποίος (εδώ: αυτά)' },
        { l:'iacerent', r:'Ρήμα', g:'γ΄ πληθ. υποτ. παρατατικού ενεργ. φωνής', d:'iaceo, iacui, iacitum, iacēre (2) — κείμαι, βρίσκομαι' },
        { l:'in tenebris', k:'tenebrae', r:'Εμπρόθετος επιρρ. προσδ. της κατάστασης', to:'στο iacerent', g:'in (πρόθ. + αφαιρ.) + tenebris (αφαιρ. πληθ., θηλ.)', d:'in — σε· tenebrae, -arum (θηλ. α΄, μόνο πληθ.) — το σκοτάδι, η αφάνεια' },
        { l:'omnia', r:'Κατηγορηματικός προσδ.', to:'στο quae', g:'ονομ. πληθ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)', d:'omnis, -is, -e — όλος', a:',' },
        { type:'sub', key:'ypothetiki', label:'Υποθετική', note:'Δευτ. επιρρηματική υποθετική πρόταση. Εισάγεται με τον υποθετικό (αρνητικό) σύνδεσμο nisi. Με απόδοση την κύρια (iacerent) σχηματίζει υποθετικό λόγο του β΄ είδους (υπόθεση αντίθετη προς την πραγματικότητα στο παρόν). Υπόθεση: nisi accederet (nisi + υποτ. παρατατικού)· Απόδοση: iacerent (υποτ. παρατατικού).', kids:[
          { l:'nisi', r:'Σύνδεσμος', g:'υποθετικός (αρνητικός) σύνδεσμος', d:'nisi — αν δεν' },
          { l:'litterarum', r:'Γενική υποκειμενική', to:'στο lumen', g:'γεν. πληθ., θηλ.', d:'litterae, -arum (θηλ. α΄, πληθ.) — τα γράμματα, η λογοτεχνία' },
          { l:'lumen', r:'Υποκείμενο', to:'στο accederet', g:'ονομ. ενικ., ουδ.', d:'lumen, luminis (ουδ. γ΄) — το φως' },
          { l:'accederet', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατατικού ενεργ. φωνής', d:'accedo, accessi, accessum, accedere (3) (< ad + cedo) — πλησιάζω, προστίθεμαι, συνοδεύω', a:'.' }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Quam', r:'Επιρρ. προσδ. του ποσού', to:'επιτείνει το multas', g:'θαυμαστικό (ποσοτικό) επίρρημα', d:'quam — πόσο' },
        { l:'multas', r:'Επιθετικός προσδ.', to:'στο imagines', g:'αιτ. πληθ., θηλ. — επίθ. β΄ κλ.', d:'multi, -ae, -a — πολλοί' },
        { l:'imagines', r:'Άμεσο αντικείμενο', to:'στο reliquerunt', g:'αιτ. πληθ., θηλ.', d:'imago, imaginis (θηλ. γ΄) — η εικόνα' },
        { l:'fortissimorum', r:'Επιθετικός προσδ.', to:'στο virorum', g:'γεν. πληθ., αρσ. — υπερθετικός επιθ. γ΄ κλ. (fortis)', d:'fortis, -is, -e — γενναίος (υπερθ. fortissimus)' },
        { l:'virorum', r:'Γενική κτητική (ή αντικειμενική)', to:'στο imagines', g:'γεν. πληθ., αρσ.', d:'vir, viri (αρσ. β΄) — ο άνδρας' },
        { l:'non solum', r:'Σύνδεσμος', g:'παρατακτική αντιθετική επιδοτική σύνδεση (α΄ σκέλος)', d:'non solum — όχι μόνο', note:'«non solum ... verum etiam» = όχι μόνο ... αλλά και.' },
        { l:'ad intuendum', k:'intueor', r:'Εμπρόθετος επιρρ. προσδ. του σκοπού', to:'στο reliquerunt', g:'ad (πρόθ. + αιτ.) + intuendum (αιτ. γερουνδίου)', d:'intueor, intuitus sum, intueri (αποθ. 2) (< in + tueor) — ατενίζω, κοιτάζω' },
        { l:'verum etiam', r:'Σύνδεσμος', g:'παρατακτική αντιθετική επιδοτική σύνδεση (β΄ σκέλος)', d:'verum etiam — αλλά και' },
        { l:'ad imitandum', k:'imitor', r:'Εμπρόθετος επιρρ. προσδ. του σκοπού', to:'στο reliquerunt', g:'ad (πρόθ. + αιτ.) + imitandum (αιτ. γερουνδίου)', d:'imitor, imitatus sum, imitari (αποθ. 1) — μιμούμαι' },
        { l:'scriptores', r:'Υποκείμενο', to:'στο reliquerunt', g:'ονομ. πληθ., αρσ.', d:'scriptor, scriptoris (αρσ. γ΄) — ο συγγραφέας' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'Graeci', r:'Παράθεση (επεξήγηση)', to:'στο scriptores', g:'ονομ. πληθ., αρσ. — ουσιαστικοπ. επίθ. β΄ κλ.', d:'Graecus, -i (αρσ. β΄) — ο Έλληνας' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'Latini', r:'Παράθεση (επεξήγηση)', to:'στο scriptores', g:'ονομ. πληθ., αρσ. — ουσιαστικοπ. επίθ. β΄ κλ.', d:'Latinus, -i (αρσ. β΄) — ο Λατίνος' },
        { l:'nobis', r:'Έμμεσο αντικείμενο', to:'στο reliquerunt', g:'δοτ. πληθ. — προσωπική αντων. α΄ προσ.', d:'ego — εγώ (nobis = σε εμάς)' },
        { l:'reliquerunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής', d:'relinquo, reliqui, relictum, relinquere (3) (< re + linquo) — αφήνω, κληροδοτώ', a:'!' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Η αναφορική αντωνυμία Quas στην αρχή περιόδου ισοδυναμεί με δεικτική (Quas = eas = imagines) και εισάγει κύρια πρόταση.', kids:[
        { l:'Quas', r:'Άμεσο αντικείμενο', to:'στο proponebam', g:'αιτ. πληθ., θηλ. — αναφορική αντων. (εδώ = δεικτική, Quas = eas)', d:'qui, quae, quod — ο οποίος (εδώ: αυτές)' },
        { l:'ego', r:'Υποκείμενο', to:'στο proponebam', g:'ονομ. ενικ. — προσωπική αντων. α΄ προσ.', d:'ego — εγώ' },
        { l:'cupidus', r:'Επιρρηματικό κατηγορούμενο της αιτίας', to:'στο ego (από το proponebam)', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'cupidus, -a, -um — αυτός που επιθυμεί' },
        { l:'bene', r:'Επιρρ. προσδ. του τρόπου', to:'στα gerendi, administrandi', g:'τροπικό επίρρημα', d:'bene — καλά' },
        { l:'gerendi', r:'Γενική γερουνδίου (αντικειμενική συμπλήρωμα)', to:'στο cupidus', g:'γεν. γερουνδίου', d:'gero, gessi, gestum, gerere (3) — διοικώ' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'administrandi', r:'Γενική γερουνδίου (αντικειμενική συμπλήρωμα)', to:'στο cupidus', g:'γεν. γερουνδίου', d:'administro, administravi, administratum, administrare (1) — διαχειρίζομαι' },
        { l:'rem', r:'Αντικείμενο', to:'στα γερούνδια gerendi, administrandi', g:'αιτ. ενικ., θηλ.', d:'res, rei (θηλ. ε΄) — το πράγμα· res publica = η πολιτεία' },
        { l:'publicam', r:'Επιθετικός προσδ.', to:'στο rem', g:'αιτ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'publicus, -a, -um — δημόσιος', note:'res publica (σύνθετο ουσιαστικό) = η πολιτεία, η δημοκρατία.' },
        { l:'semper', r:'Επιρρ. προσδ. του χρόνου', to:'στο proponebam', g:'χρονικό επίρρημα', d:'semper — πάντοτε' },
        { l:'mihi', r:'Έμμεσο αντικείμενο', to:'στο proponebam', g:'δοτ. ενικ. — προσωπική αντων. α΄ προσ.', d:'ego — εγώ (mihi = σε εμένα)' },
        { l:'proponebam', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'propono, proposui, propositum, proponere (3) (< pro + pono) — βάζω μπροστά μου ως παράδειγμα', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Colendo', r:'Αφαιρετική γερουνδίου (του τρόπου)', to:'στο conformabam', g:'αφαιρ. γερουνδίου', d:'colo, colui, cultum, colere (3) — λατρεύω, καλλιεργώ' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'cogitando', r:'Αφαιρετική γερουνδίου (του τρόπου)', to:'στο conformabam', g:'αφαιρ. γερουνδίου', d:'cogito, cogitavi, cogitatum, cogitare (1) — σκέφτομαι, αναλογίζομαι' },
        { l:'homines', r:'Αντικείμενο', to:'στα γερούνδια colendo, cogitando', g:'αιτ. πληθ., αρσ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
        { l:'excellentes', r:'Επιθετικός προσδ.', to:'στο homines', g:'αιτ. πληθ., αρσ. — επιθετοπ. μτχ. ενεστ. (γ΄ κλ. μονοκατάληκτη, γεν. excellentis)', d:'excellens, -entis — έξοχος, διακεκριμένος' },
        { l:'animum', r:'Αντικείμενο', to:'στο conformabam', g:'αιτ. ενικ., αρσ.', d:'animus, -i (αρσ. β΄) — η ψυχή' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'mentem', r:'Αντικείμενο', to:'στο conformabam', g:'αιτ. ενικ., θηλ.', d:'mens, mentis (θηλ. γ΄) — ο νους' },
        { l:'meam', r:'Επιθετικός προσδ.', to:'στο mentem', g:'αιτ. ενικ., θηλ. — κτητική αντων. α΄ προσ. (ένας κτήτορας)', d:'meus, mea, meum — δικός μου' },
        { l:'conformabam', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'conformo, conformavi, conformatum, conformare (1) (< cum + formo) — διαμορφώνω, διαπλάθω', a:'.' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Sic', r:'Επιρρ. προσδ. του τρόπου', to:'στο potui', g:'τροπικό επίρρημα', d:'sic — έτσι, με τον τρόπο αυτό' },
        { l:'enim', r:'Σύνδεσμος', g:'παρατακτικός αιτιολογικός σύνδεσμος', d:'enim — γιατί, πράγματι' },
        { l:'laudem', r:'Αντικείμενο', to:'στο γερούνδιο expetendo', g:'αιτ. ενικ., θηλ.', d:'laus, laudis (θηλ. γ΄) — ο έπαινος' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'honestatem', r:'Αντικείμενο', to:'στο γερούνδιο expetendo', g:'αιτ. ενικ., θηλ.', d:'honestas, honestatis (θηλ. γ΄) — η τιμή, η δόξα' },
        { l:'solum', r:'Επιρρ. προσδ. του ποσού', to:'στο expetendo', g:'ποσοτικό επίρρημα', d:'solum — μόνο' },
        { l:'expetendo', r:'Αφαιρετική γερουνδίου (τρόπου, σε θέση επεξήγησης στο sic)', to:'στο sic / potui', g:'αφαιρ. γερουνδίου', d:'expeto, expetivi (expetii), expetitum, expetere (3) (< ex + peto) — επιδιώκω' },
        { l:'omnes', r:'Κατηγορηματικός προσδ.', to:'στο cruciatus', g:'αιτ. πληθ., αρσ. — επίθ. γ΄ κλ. (δικατάληκτο)', d:'omnis, -is, -e — όλος' },
        { l:'cruciatus', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. πληθ., αρσ.', d:'cruciatus, -us (αρσ. δ΄) — το βάσανο, η ταλαιπωρία' },
        { l:'corporis', r:'Γενική αντικειμενική', to:'στο cruciatus', g:'γεν. ενικ., ουδ.', d:'corpus, corporis (ουδ. γ΄) — το σώμα' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'omnia', r:'Κατηγορηματικός προσδ.', to:'στο pericula', g:'αιτ. πληθ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)', d:'omnis, -is, -e — όλος' },
        { l:'pericula', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. πληθ., ουδ.', d:'periculum, -i (ουδ. β΄) — ο κίνδυνος' },
        { l:'mortis', r:'Γενική επεξηγηματική', to:'στο pericula', g:'γεν. ενικ., θηλ.', d:'mors, mortis (θηλ. γ΄) — ο θάνατος' },
        { l:'parvi', r:'Γενική κατηγορηματική της αξίας', to:'στα cruciatus, pericula (μέσω του esse)', g:'γεν. ενικ., ουδ. — επίθ. β΄ κλ.', d:'parvus, -a, -um — μικρός', note:'parvi esse ducere = θεωρώ κάτι μικρής αξίας. Η αξία εκφέρεται με γενική, γιατί είναι αφηρημένη.' },
        { l:'esse', r:'Ειδικό απαρέμφατο (αντικείμενο)', to:'στο γερούνδιο ducendo', g:'απαρέμφατο ενεστ. — ανώμαλο', d:'sum, fui, —, esse — είμαι' },
        { l:'ducendo', r:'Αφαιρετική γερουνδίου (τρόπου, σε θέση επεξήγησης στο sic)', to:'στο sic / potui', g:'αφαιρ. γερουνδίου', d:'duco, duxi, ductum, ducere (3) — θεωρώ (parvi ducere = θεωρώ μικρής αξίας)' },
        { l:'me', r:'Αντικείμενο (άμεση αυτοπάθεια)', to:'στο απαρέμφατο obicere', g:'αιτ. ενικ. — προσωπική αντων. α΄ προσ.', d:'ego — εγώ (me = τον εαυτό μου)' },
        { l:'pro salute', k:'salus', r:'Εμπρόθετος επιρρ. προσδ. της υπεράσπισης', to:'στο obicere', g:'pro (πρόθ. + αφαιρ.) + salute (αφαιρ. ενικ.)', d:'pro — για χάρη· salus, salutis (θηλ. γ΄) — η σωτηρία, η ευημερία' },
        { l:'vestra', r:'Επιθετικός προσδ.', to:'στο salute', g:'αφαιρ. ενικ., θηλ. — κτητική αντων. β΄ προσ. (πολλοί κτήτορες)', d:'vester, vestra, vestrum — δικός σας' },
        { l:'in', r:'Πρόθεση (εμπρόθετος με το dimicationes)', to:'στο obicere', g:'in (πρόθ. + αιτ.)', d:'in — σε, προς', note:'in ... dimicationes = εμπρόθετος προσδ. που δηλώνει είσοδο σε κατάσταση.' },
        { l:'tot', r:'Επιθετικός προσδ.', to:'στο dimicationes', g:'άκλιτη δεικτική αντων.', d:'tot — τόσοι πολλοί' },
        { l:'ac', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'ac — και' },
        { l:'tantas', r:'Επιθετικός προσδ.', to:'στο dimicationes', g:'αιτ. πληθ., θηλ. — δεικτική αντων.', d:'tantus, tanta, tantum — τόσος' },
        { l:'dimicationes', r:'Εμπρόθετος (είσοδος σε κατάσταση)', to:'στο obicere', g:'αιτ. πληθ., θηλ.', d:'dimicatio, dimicationis (θηλ. γ΄) — ο αγώνας' },
        { l:'obicere', r:'Τελικό απαρέμφατο (αντικείμενο)', to:'στο potui (ταυτοπροσωπία)', g:'απαρέμφατο ενεστ. ενεργ. φωνής', d:'obicio, obieci, obiectum, obicere (3, σε -io) (< ob + iacio) — ρίχνω (me obicio = ρίχνομαι)' },
        { l:'potui', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρακειμένου — ανώμαλο', d:'possum, potui, —, posse (< pot + sum) — μπορώ', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Pleni omnes sunt libri,", el:"Γεμάτα είναι όλα τα βιβλία," },
    { n:2, la:"plenae sapientium voces,", el:"γεμάτοι οι λόγοι των σοφών," },
    { n:3, la:"plena exemplorum vetustas:", el:"γεμάτη η αρχαιότητα από παραδείγματα·" },
    { n:4, la:"quae iacerent in tenebris omnia,", el:"αυτά όλα θα έμεναν στην αφάνεια," },
    { n:5, la:"nisi litterarum lumen accederet.", el:"αν δεν τα συνόδευε το φως των γραμμάτων." },
    { n:6, la:"Quam multas imagines fortissimorum virorum", el:"Πόσο πολλές εικόνες γενναιότατων ανδρών" },
    { n:7, la:"—non solum ad intuendum, verum etiam ad imitandum—", el:"—όχι μόνο για να τις κοιτάζουμε, αλλά και για να τις μιμούμαστε—" },
    { n:8, la:"scriptores et Graeci et Latini nobis reliquerunt!", el:"μας κληροδότησαν οι συγγραφείς και οι Έλληνες και οι Λατίνοι!" },
    { n:9, la:"Quas ego, cupidus bene gerendi et administrandi rem publicam, semper mihi proponebam.", el:"Αυτές εγώ, επιθυμώντας να διοικήσω και να διαχειριστώ σωστά την πολιτεία, πάντοτε έβαζα μπροστά μου ως παράδειγμα." },
    { n:10, la:"Colendo et cogitando homines excellentes animum et mentem meam conformabam.", el:"Με το να λατρεύω και να αναλογίζομαι τους έξοχους ανθρώπους διέπλαθα την ψυχή και τον νου μου." },
    { n:11, la:"Sic enim —laudem et honestatem solum expetendo, omnes cruciatus corporis et omnia pericula mortis parvi esse ducendo— me pro salute vestra in tot ac tantas dimicationes obicere potui.", el:"Γιατί έτσι —με το να επιδιώκω δηλαδή μόνο τον έπαινο και την τιμή, με το να θεωρώ ότι είναι μικρής αξίας όλα τα βάσανα του σώματος και όλοι οι κίνδυνοι του θανάτου— μπόρεσα να ριχτώ για τη σωτηρία σας σε τόσο πολλούς και τόσο μεγάλους αγώνες." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"tenebrae, -arum", note:"μόνο πληθ." },
        { form:"litterae, -arum", note:"ετερόσημο· ενικ. littera, -ae = το γράμμα (του αλφαβήτου)" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"liber, libri" },
        { form:"vir, viri" },
        { form:"Graecus, -i" },
        { form:"Latinus, -i" },
        { form:"animus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"exemplum, -i" },
        { form:"periculum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"sapiens, sapientis" },
        { form:"scriptor, scriptoris" },
        { form:"homo, hominis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"vox, vocis" },
        { form:"vetustas, vetustatis" },
        { form:"imago, imaginis" },
        { form:"mens, mentis" },
        { form:"laus, laudis" },
        { form:"honestas, honestatis" },
        { form:"mors, mortis" },
        { form:"salus, salutis", note:"δεν έχει εύχρηστο πληθ." },
        { form:"dimicatio, dimicationis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"lumen, luminis" },
        { form:"corpus, corporis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"cruciatus, -us" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"res, rei" }
      ]}
    ]},
    { kl:"Σύνθετο ουσιαστικό", groups:[
      { gender:"Θηλυκό", items:[
        { form:"res publica, rei publicae", note:"κλίνεται μόνο στον ενικό" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"plenus, -a, -um" },
      { form:"multi, -ae, -a", note:"απαντά στον πληθ." },
      { form:"cupidus, -a, -um" },
      { form:"publicus, -a, -um", note:"δεν σχηματίζει παραθετικά (δηλώνει κάτι απόλυτο)" },
      { form:"parvus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"omnis, -is, -e", note:"δεν σχηματίζει παραθετικά (δηλώνει κάτι απόλυτο)" },
      { form:"fortis, -is, -e" },
      { form:"excellens, -ns, -ns (γεν. excellentis)", note:"επιθετοποιημένη μτχ. ενεστ. του excello" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"plenus, -a, -um", comp:"plenior, -ior, -ius", sup:"plenissimus, -a, -um" },
      { pos:"multi, -ae, -a", comp:"plures, -es, -a (γεν. plurium)", sup:"plurimi, -ae, -a" },
      { pos:"cupidus, -a, -um", comp:"cupidior, -ior, -ius", sup:"cupidissimus, -a, -um" },
      { pos:"bonus, -a, -um", comp:"melior, -ior, -ius", sup:"optimus, -a, -um" },
      { pos:"parvus, -a, -um", comp:"minor, -or, -us", sup:"minimus, -a, -um" },
      { pos:"publicus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"omnis, -is, -e", comp:"—", sup:"—" },
      { pos:"fortis, -is, -e", comp:"fortior, -ior, -ius", sup:"fortissimus, -a, -um" },
      { pos:"excellens, -entis", comp:"excellentior, -ior, -ius", sup:"excellentissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"στην αρχή περιόδου = δεικτική (quae = ea, Quas = eas)" },
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσώπου" },
    { form:"meus, mea, meum", kind:"Κτητική", extra:"α΄ προσ., ένας κτήτορας" },
    { form:"vester, vestra, vestrum", kind:"Κτητική", extra:"β΄ προσ., πολλοί κτήτορες" },
    { form:"tot", kind:"Δεικτική", extra:"άκλιτη· απαντά μόνο στον πληθ." },
    { form:"tantus, tanta, tantum", kind:"Δεικτική", extra:"" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"imitor", perf:"imitatus sum", sup:"(imitatum)", inf:"imitari", note:"αποθετικό" },
      { pres:"administro", perf:"administravi", sup:"administratum", inf:"administrare", note:"" },
      { pres:"cogito", perf:"cogitavi", sup:"cogitatum", inf:"cogitare", note:"" },
      { pres:"conformo", perf:"conformavi", sup:"conformatum", inf:"conformare", note:"< cum + formo" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"iaceo", perf:"iacui", sup:"iacitum", inf:"iacēre", note:"" },
      { pres:"intueor", perf:"intuitus sum", sup:"(intuitum)", inf:"intueri", note:"αποθετικό· < in + tueor" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"accedo", perf:"accessi", sup:"accessum", inf:"accedere", note:"< ad + cedo" },
      { pres:"relinquo", perf:"reliqui", sup:"relictum", inf:"relinquere", note:"< re + linquo" },
      { pres:"gero", perf:"gessi", sup:"gestum", inf:"gerere", note:"" },
      { pres:"propono", perf:"proposui", sup:"propositum", inf:"proponere", note:"< pro + pono" },
      { pres:"colo", perf:"colui", sup:"cultum", inf:"colere", note:"" },
      { pres:"expeto", perf:"expetivi (expetii)", sup:"expetitum", inf:"expetere", note:"< ex + peto" },
      { pres:"duco", perf:"duxi", sup:"ductum", inf:"ducere", note:"προστ. ενεστ. duc" },
      { pres:"obicio", perf:"obieci", sup:"obiectum", inf:"obicere", note:"σε -io· < ob + iacio" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"Ανώμαλα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"< pot + sum" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Αντωνυμία", title:"quae = ea (αναφορική → δεικτική)", body:"Η αναφορική αντωνυμία (ή το αναφορικό επίρρημα) στην αρχή περιόδου ή ημιπεριόδου, όταν αναφέρεται στα προηγούμενα, ισοδυναμεί με δεικτική αντωνυμία και εισάγει κύρια πρόταση: quae = ea (περ. 2), Quas = eas = imagines (περ. 4)." },
    { tag:"Υποθετικός λόγος", title:"quae iacerent ..., nisi accederet: β΄ είδος", body:"Υπόθεση: nisi accederet (nisi + υποτ. παρατατικού)· Απόδοση: iacerent (υποτ. παρατατικού). Είναι υποθετικός λόγος του β΄ είδους (υπόθεση αντίθετη προς την πραγματικότητα στο παρόν). Προσοχή: iacerent είναι υποτακτική (όχι οριστική)." },
    { tag:"Σύνταξη επιθέτου", title:"cupidus + γενική γερουνδίου", body:"Το επίθετο cupidus συντάσσεται με γενική (αντικειμενική) ως συμπλήρωμα: cupidus bene gerendi et administrandi (γενικές γερουνδίου). Το cupidus λειτουργεί ως επιρρηματικό κατηγορούμενο της αιτίας στο ego." },
    { tag:"Γερούνδιο", title:"Γερούνδιο τρόπου & σκοπού — γερουνδιακή έλξη", body:"Colendo, cogitando, expetendo, ducendo = αφαιρετικές γερουνδίου του τρόπου· ad intuendum / ad imitandum = αιτιατική γερουνδίου του σκοπού. Στις απρόθετες συντάξεις γερουνδίου + αντικείμενο σε αιτιατική γίνεται (προαιρετικά) γερουνδιακή έλξη (π.χ. bene gerendae ... rei publicae)." },
    { tag:"Σύνταξη", title:"parvi esse ducere = θεωρώ μικρής αξίας", body:"parvi = γενική κατηγορηματική της αξίας (η αξία εκφέρεται με γενική, γιατί είναι αφηρημένη). cruciatus, pericula = υποκείμενα του ειδικού απαρεμφάτου esse (ετεροπροσωπία)· omnes, omnia = κατηγορηματικοί προσδιορισμοί." },
    { tag:"Ρήμα", title:"intueor, imitor: αποθετικά", body:"Τα intueor (2) και imitor (1) είναι αποθετικά: κλίνονται μόνο στη μέση (παθητική) φωνή με ενεργητική σημασία, δεν έχουν απαρέμφατο μέλλοντα μέσης φωνής και διατηρούν 6 ενεργητικούς τύπους (μεταξύ τους το γερούνδιο: intuendum, imitandum)." }
  ],

  transforms: [
    { id:"Α", label:"Μετατροπή δευτερεύουσας πρότασης σε αντίστοιχη μετοχή", items:[
      { from:"quae iacerent in tenebris omnia, nisi litterarum lumen accederet", to:"quae iacerent in tenebris omnia, non litterarum lumine accedente", note:"Μετατροπή της υποθετικής πρότασης σε υποθετική μετοχή· γνήσια αφαιρετική απόλυτη, γιατί το υποκείμενό της (lumine) δεν έχει κανέναν άλλο ρόλο στην πρόταση με ρήμα το iacerent, στην οποία ανήκει." }
    ]},
    { id:"Β", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Quam multas imagines fortissimorum virorum ... scriptores et Graeci et Latini nobis reliquerunt!", to:"Quam multae imagines fortissimorum virorum ... a scriptoribus et Graecis et Latinis nobis relictae sunt!" },
      { from:"Quas ego, cupidus bene gerendi et administrandi rem publicam, semper mihi proponebam", to:"Quae a me, cupido bene gerendi et administrandi rem publicam, semper mihi proponebantur" }
    ]},
    { id:"Γ", label:"Μετατροπή του υποθετικού λόγου στα άλλα είδη", items:[
      { from:"nisi ... accederet — iacerent (β΄ είδος: υπόθεση αντίθετη προς την πραγματικότητα στο παρόν)", to:"nisi ... accedit — iacent", note:"α΄ είδος: ανοιχτή υπόθεση για το παρόν (οριστική ενεστώτα)" },
      { from:"nisi ... accederet — iacerent", to:"nisi ... accessit — iacuerunt", note:"α΄ είδος: ανοιχτή υπόθεση για το παρελθόν (οριστική παρακειμένου)" },
      { from:"nisi ... accederet — iacerent", to:"nisi ... accedet / accesserit — iacebunt", note:"α΄ είδος: ανοιχτή υπόθεση για το μέλλον (οριστ. μέλλοντα / συντελ. μέλλοντα — οριστ. μέλλοντα)" },
      { from:"nisi ... accederet — iacerent", to:"nisi ... accessisset — iacuissent", note:"β΄ είδος: αντίθετη προς την πραγματικότητα για το παρελθόν (υποτ. υπερσυντελίκου)" },
      { from:"nisi ... accederet — iacerent", to:"nisi ... accedat — iaceant", note:"γ΄ είδος: υπόθεση δυνατή ή πιθανή για το παρόν-μέλλον (υποτ. ενεστώτα)" }
    ]},
    { id:"Δ", label:"Μετατροπή της ενεργητικής σύνταξης (γερουνδίου) σε παθητική (γερουνδιακό) — γερουνδιακή έλξη", items:[
      { from:"cupidus bene gerendi et administrandi rem publicam", to:"cupidus bene gerendae et administrandae rei publicae", note:"προαιρετική γερουνδιακή έλξη (απρόθετη γενική γερουνδίου με αντικείμενο σε αιτιατική)" },
      { from:"Colendo et cogitando homines excellentes", to:"Colendis et cogitandis hominibus excellentibus", note:"προαιρετική γερουνδιακή έλξη (απρόθετη αφαιρετική γερουνδίου με αντικείμενο σε αιτιατική)" },
      { from:"laudem et honestatem solum expetendo", to:"laude et honestate solum expetenda", note:"προαιρετική γερουνδιακή έλξη (απρόθετη αφαιρετική γερουνδίου με αντικείμενο σε αιτιατική)" }
    ]},
    { id:"Ε", label:"Ισοδύναμη εκφορά του σκοπού (5 τρόποι)", items:[
      { from:"Quam multas imagines nobis reliquerunt ad intuendum / ad imitandum", to:"... ut intueremur / imitaremur", note:"τελική πρόταση" },
      { from:"Quam multas imagines nobis reliquerunt ad intuendum / ad imitandum", to:"... qui intueremur / imitaremur", note:"αναφορικοτελική πρόταση" },
      { from:"Quam multas imagines nobis reliquerunt ad intuendum / ad imitandum", to:"... intuitum / imitatum", note:"αιτιατική του σουπίνου" },
      { from:"Quam multas imagines nobis reliquerunt ad intuendum / ad imitandum", to:"... ad intuendum / imitandum", note:"ad + αιτιατική του γερουνδίου" },
      { from:"Quam multas imagines nobis reliquerunt ad intuendum / ad imitandum", to:"... intuendi / imitandi causa", note:"causa (ή gratia) + γενική του γερουνδίου" }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο (εξάρτηση: Cicero dicit / dixit)", items:[
      { from:"Pleni omnes sunt libri, plenae sapientium voces, plena exemplorum vetustas; quae iacerent in tenebris omnia, nisi litterarum lumen accederet", to:"Cicero dicit / dixit plenos omnes esse libros, plenas sapientium voces, plenam exemplorum vetustatem; quae iacitura fuisse ..., nisi ... accederet" },
      { from:"Quas ego, cupidus bene gerendi et administrandi rem publicam, semper mihi proponebam. Colendo et cogitando homines excellentes animum et mentem meam conformabam. Sic enim —laudem ... ducendo— me pro salute vestra in ... obicere potui", to:"Cicero dicit / dixit eas se, cupidum ..., semper sibi proponere; se colendo et cogitando ... et mentem suam conformare; sic enim —laudem ... ducendo— ipsum pro salute illorum ... se obicere potuisse" }
    ]}
  ],

  etymology: [
    { la:"pleni, plenae", el:"πίμπλημι / πληθύς· πλήθος, πλημμύρα, πλήρης, πλησμονή." },
    { la:"sunt (esse)", el:"εἰμί." },
    { la:"libri", el:"λιμπρέτο (< ιταλ.)." },
    { la:"sapientium", el:"(ισπαν.) sabio (= σοφός)." },
    { la:"voces", el:"(αγγλ.) vocal (= φωνητικός), voice (= φωνή) // (γαλλ.) vocabulaire (= λεξιλόγιο)." },
    { la:"exemplorum", el:"(γαλλ.) exemple (= παράδειγμα)." },
    { la:"vetustas (< vetus)", el:"veteranus → βετεράνος." },
    { la:"iacerent, ob-icere", el:"ἵημι (= ρίχνω)." },
    { la:"tenebris", el:"(γαλλ.) ténèbres (= σκοτάδι)." },
    { la:"litterarum", el:"(γαλλ.) lettre (= γράμμα), littérature (= λογοτεχνία)." },
    { la:"lumen", el:"λευκός, λύχνος // (γαλλ.) lune (= φεγγάρι, σελήνη), lumière (= φως)." },
    { la:"accederet", el:"(γαλλ.) accéder à (= προσπελαύνω, φτάνω)." },
    { la:"multas", el:"μάλα (= πολύ)." },
    { la:"imagines", el:"(γαλλ.) image (= εικόνα) // (αγγλ.) imagine (= φαντάζομαι)." },
    { la:"fortissimorum", el:"(γαλλ.) fort (= σωματική δύναμη) // (ισπαν.) fortaleza (= φρούριο)." },
    { la:"virorum", el:"βιρτουόζος (< ιταλ. virtuoso)." },
    { la:"solum", el:"σόλο (< ιταλ.), σολίστ(ας)." },
    { la:"intuendum (in + tueor)", el:"tutor → (γαλλ.) tuteur (= παιδαγωγός)." },
    { la:"imitandum", el:"(γαλλ.) imiter (= μιμούμαι) // ιμιτασιόν (< imitation, γαλλ.)." },
    { la:"scriptores", el:"σκάριφος (= όργανο γραφής), σκαρίφημα // (αγγλ.) script (= σενάριο κινηματογραφικής ταινίας)." },
    { la:"Graeci", el:"Γραικός." },
    { la:"Latini", el:"Λάτιο, Λατίνοι, Λατινικός." },
    { la:"re-liquerunt", el:"λείπω, λοιπός." },
    { la:"cupidus", el:"(γαλλ.) cupide (= άπληστος), cupidité (= απληστία)." },
    { la:"bene", el:"μπονα-μάς [< ιταλ. bona mano (= καλό χέρι)], μπουνάτσα (< βενετ.) (= καλοκαιρία), μπόνους." },
    { la:"ad-ministrandi", el:"(γαλλ.) ministre (= υπουργός) // (αγγλ.) ad-ministration (= διαχείριση)." },
    { la:"rem", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός)." },
    { la:"publicam", el:"(γαλλ.) publique (= δημόσιος)." },
    { la:"rem publicam", el:"ρεπουμπλικανός, ρεπουμπλικανισμός // ρεπούμπλικα (= είδος ανδρικού καπέλου) (< ιταλ.)." },
    { la:"semper", el:"(ισπαν.) siempre (= πάντα)." },
    { la:"proponebam", el:"(γαλλ.) positioner (= τοποθετώ) // position (= θέση)." },
    { la:"colendo", el:"κουλτούρα (< ιταλ.)." },
    { la:"cogitando", el:"(γαλλ.) cogiter (= αναλογίζομαι, σκέφτομαι έντονα)." },
    { la:"homines", el:"ουμανισμός (< γαλλ.)." },
    { la:"ex-celentes (< ex + cello < celsus)", el:"κολωνός // (αγγλ.) excellent (= εξαίρετος)." },
    { la:"animi", el:"ανιμισμός (< γαλλ.) / άνεμος." },
    { la:"mentem", el:"μιμνήσκω, μνήμη, μέντωρ // (γαλλ.) mental (= διανοητικός)." },
    { la:"conformabam", el:"φόρμα, φόρμουλα (< ιταλ.)." },
    { la:"laudare, laus", el:"(γαλλ.) laudatif (= κολακευτικός) // (αγγλ.) laudable (= αξιέπαινος)." },
    { la:"honestatem", el:"ονόρε (< ιταλ.) // (αγγλ.) honor (= τιμή) // (γαλλ.) honorable (= αξιότιμος)." },
    { la:"expetendo", el:"πί-πτ-ω, πετ-ώ." },
    { la:"corpus", el:"κόρπους (= σώμα κειμένων)." },
    { la:"pericula", el:"πείρα, πειρατής· απειρία." },
    { la:"mortis", el:"βροτός // (γαλλ.) mort (= νεκρός) // (αγγλ.) mortal (= θνητός)." },
    { la:"parvi", el:"παῦρος (= μικρός, λίγος)." },
    { la:"ducendo", el:"(αγγλ.) ad-ductor (= προσαγωγός μυς) // (γαλλ.) con-ducteur (= οδηγός)." },
    { la:"salute", el:"(γαλλ.) salutation (= χαιρετισμός)." },
    { la:"potui (possum < potis + sum)", el:"πόσις, δεσ-πότης (= «κύριος σπιτιού»)." }
  ]
};

export default UNIT;
