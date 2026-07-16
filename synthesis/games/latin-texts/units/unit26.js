export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 26,
  title: "Ο Πλίνιος αναγγέλλει ένα θλιβερό γεγονός",
  latinTitle: "Lectio XXVI",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Tristissimus', r:'Επιρρηματικό κατηγορούμενο του τρόπου', to:'στο εννοούμενο υποκ. ego (μέσω του scribo)', g:'ονομ. ενικ., αρσ. — υπερθετικός βαθμός του επιθ. tristis, -is, -e (γ΄ κλ.)', d:'tristis, -is, -e — λυπημένος, θλιμμένος· υπερθ. tristissimus, -a, -um' },
        { l:'haec', r:'Άμεσο αντικείμενο', to:'στο scribo', g:'αιτ. πληθ., ουδ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'tibi', r:'Έμμεσο αντικείμενο', to:'στο scribo', g:'δοτ. ενικ., αρσ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ' },
        { l:'scribo', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'scribo, scripsi, scriptum, scribere (3) — γράφω', note:'Εννοούμενο υποκείμενο: ego.', a:':' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'C. Plinius', k:'Plinius', r:'Υποκείμενο', to:'στο εννοούμενο ρήμα dicit', g:'ονομ. ενικ., αρσ. β΄ κλ.', d:'C. (Gaius) Plinius, γεν. Plinii/-i — (Γάιος) Πλίνιος', note:'Εννοείται το ρήμα dicit.' },
        { l:'Marcellino', r:'Έμμεσο αντικείμενο', to:'στο εννοούμενο ρήμα dicit', g:'δοτ. ενικ., αρσ. β΄ κλ.', d:'Marcellinus, -i — Μαρκελλίνος' },
        { l:'suo', r:'Επιθετικός προσδ.', to:'στο Marcellino', g:'δοτ. ενικ., αρσ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)', d:'suus, sua, suum — δικός του', note:'Άμεση (ευθεία) αυτοπάθεια· αναφέρεται στο υποκ. C. Plinius.' },
        { l:'salutem', r:'Άμεσο αντικείμενο', to:'στο εννοούμενο ρήμα dicit', g:'αιτ. ενικ., θηλ. γ΄ κλ.', d:'salus, salutis (θηλ. γ΄) — σωτηρία, υγεία', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Fundani', r:'Γενική κτητική', to:'στο filia', g:'γεν. ενικ., αρσ. β΄ κλ.', d:'Fundanus, -i — Φουνδανός' },
        { l:'nostri', r:'Επιθετικός προσδ.', to:'στο Fundani', g:'γεν. ενικ., αρσ. — κτητική αντων. α΄ προσ. (πολλοί κτήτορες)', d:'noster, nostra, nostrum — δικός μας' },
        { l:'filia', r:'Υποκείμενο', to:'στο mortua est', g:'ονομ. ενικ., θηλ. α΄ κλ.', d:'filia, -ae (θηλ. α΄) — η κόρη' },
        { l:'minor', r:'Επιθετικός προσδ.', to:'στο filia', g:'ονομ. ενικ., θηλ. — συγκριτικός βαθμός του επιθ. parvus, -a, -um', d:'minor, minor, minus — μικρότερος' },
        { l:'mortua est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — αποθετικό', d:'morior, mortuus sum, (mortuum), mori (3 σε -io, αποθετικό) — πεθαίνω', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Ea', r:'Επιθετικός προσδ.', to:'στο puella', g:'αφαιρ. ενικ., θηλ. — δεικτική (ως οριστική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'puella', r:'Β΄ όρος σύγκρισης (αφαιρετική συγκριτική)', to:'προς τα nihil', g:'αφαιρ. ενικ., θηλ. α΄ κλ.', d:'puella, -ae (θηλ. α΄) — το κορίτσι', note:'Ea puella = quam ea puella (δεύτερος τρόπος εκφοράς της σύγκρισης).' },
        { l:'nihil', r:'Αντικείμενο & α΄ όρος σύγκρισης', to:'στο vidi', g:'αιτ. ενικ., ουδ. — αόριστη ουσιαστική αντων.', d:'nihil, nullius rei — τίποτα' },
        { l:'umquam', r:'Επιρρ. προσδ. του χρόνου', to:'στο vidi', g:'χρονικό επίρρημα', d:'umquam — ποτέ' },
        { l:'festivius', r:'Επιθετικός προσδ.', to:'στο πρώτο nihil', g:'αιτ. ενικ., ουδ. — συγκριτικός βαθμός του επιθ. festivus, -a, -um', d:'festivus, -a, -um — πρόσχαρος· συγκρ. festivior, -ior, -ius', a:',' },
        { l:'nihil', r:'Αντικείμενο & α΄ όρος σύγκρισης', to:'στο vidi', g:'αιτ. ενικ., ουδ. — αόριστη ουσιαστική αντων.', d:'nihil, nullius rei — τίποτα' },
        { l:'amabilius', r:'Επιθετικός προσδ.', to:'στο δεύτερο nihil', g:'αιτ. ενικ., ουδ. — συγκριτικός βαθμός του επιθ. amabilis, -is, -e', d:'amabilis, -is, -e — αξιαγάπητος· συγκρ. amabilior, -ior, -ius' },
        { l:'nec', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (αποφατικός) σύνδεσμος', d:'nec (= neque) — ούτε' },
        { l:'longiore', r:'Επιθετικός προσδ.', to:'στο vita', g:'αφαιρ. ενικ., θηλ. — συγκριτικός βαθμός του επιθ. longus, -a, -um', d:'longus, -a, -um — μακρόχρονος· συγκρ. longior, -ior, -ius' },
        { l:'vita', r:'Αφαιρετική (οργανική) του μέσου', to:'στο dignius', g:'αφαιρ. ενικ., θηλ. α΄ κλ.', d:'vita, -ae (θηλ. α΄) — η ζωή' },
        { l:'dignius', r:'Επιθετικός προσδ.', to:'στο δεύτερο nihil', g:'αιτ. ενικ., ουδ. — συγκριτικός βαθμός του επιθ. dignus, -a, -um', d:'dignus, -a, -um — άξιος· συγκρ. dignior, -ior, -ius' },
        { l:'vidi', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'video, vidi, visum, videre (2) — βλέπω', note:'Εννοούμενο υποκείμενο: ego.', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Nondum', r:'Επιρρ. προσδ. του χρόνου', to:'στο impleverat', g:'χρονικό επίρρημα', d:'nondum — όχι ακόμη, ακόμη δεν' },
        { l:'annos', r:'Αντικείμενο', to:'στο impleverat', g:'αιτ. πληθ., αρσ. β΄ κλ.', d:'annus, -i (αρσ. β΄) — έτος, χρόνος' },
        { l:'XIII', k:'tredecim', r:'Επιθετικός προσδ.', to:'στο annos', g:'απόλυτο αριθμητικό, άκλιτο', d:'tredecim (XIII) — δεκατρείς, δεκατρία' },
        { l:'impleverat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσυντελίκου ενεργ. φωνής', d:'impleo, implevi, impletum, implere (2) — συμπληρώνω', note:'Εννοούμενο υποκείμενο: (puella).', a:',' }
      ]}
    ]},

    { n: 6, kids: [
      { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'et — και', note:'Θα μπορούσε να θεωρηθεί ότι ισοδυναμεί με τον αντίστροφο cum, γιατί προηγείται το επίρρημα nondum.', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'iam', r:'Επιρρ. προσδ. του χρόνου', to:'στο erat', g:'χρονικό επίρρημα', d:'iam — ήδη, πια' },
        { l:'illi', r:'Δοτική προσωπική κτητική', to:'στο υπαρκτικό ρήμα erat', g:'δοτ. ενικ., θηλ. — δεικτική αντων.', d:'ille, illa, illud — εκείνος, εκείνη, εκείνο' },
        { l:'anilis', r:'Επιθετικός προσδ.', to:'στο prudentia', g:'ονομ. ενικ., θηλ. — επίθ. γ΄ κλ. (διτάληκτο)', d:'anilis, -is, -e — γεροντικός' },
        { l:'prudentia', r:'Υποκείμενο', to:'στο erat', g:'ονομ. ενικ., θηλ. α΄ κλ.', d:'prudentia, -ae (θηλ. α΄) — φρόνηση, σύνεση', a:',' },
        { l:'matronalis', r:'Επιθετικός προσδ.', to:'στο gravitas', g:'ονομ. ενικ., θηλ. — επίθ. γ΄ κλ. (διτάληκτο)', d:'matronalis, -is, -e — που ταιριάζει σε δέσποινα' },
        { l:'gravitas', r:'Υποκείμενο', to:'στο erat', g:'ονομ. ενικ., θηλ. γ΄ κλ.', d:'gravitas, gravitatis (θηλ. γ΄) — σοβαρότητα, σεμνότητα' },
        { l:'erat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού του ανώμ.-βοηθ. ρήματος', d:'sum, fui, —, esse — είμαι, υπάρχω' },
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'et — και' },
        { l:'tamen', r:'Σύνδεσμος', g:'παρατακτικός αντιθετικός σύνδεσμος', d:'tamen — όμως' },
        { l:'suavitas', r:'Υποκείμενο', to:'στο erat', g:'ονομ. ενικ., θηλ. γ΄ κλ.', d:'suavitas, suavitatis (θηλ. γ΄) — γλυκύτητα' },
        { l:'puellaris', r:'Επιθετικός προσδ.', to:'στο suavitas', g:'ονομ. ενικ., θηλ. — επίθ. γ΄ κλ. (διτάληκτο)', d:'puellaris, -is, -e — κοριτσίστικος', a:'.' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιφωνηματική)', kids:[
        { l:'Ut', r:'Επιρρ. προσδ. του τρόπου', to:'στο inhaerebat', g:'επιφωνηματικό επίρρημα', d:'ut — πώς!' },
        { l:'illa', r:'Υποκείμενο', to:'στο inhaerebat', g:'ονομ. ενικ., θηλ. — δεικτική αντων.', d:'ille, illa, illud — εκείνος, εκείνη, εκείνο' },
        { l:'patris', r:'Γενική κτητική', to:'στο cervicibus', g:'γεν. ενικ., αρσ. γ΄ κλ.', d:'pater, patris (αρσ. γ΄) — ο πατέρας', note:'Γεν. πληθ. patrum (θέμα σε δύο σύμφωνα).' },
        { l:'cervicibus', r:'Αντικείμενο', to:'στο inhaerebat', g:'δοτ. πληθ., θηλ. γ΄ κλ.', d:'cervices, cervicum (θηλ. γ΄) — ο τράχηλος, ο λαιμός', note:'Σπάνια στον ενικό: cervix, cervicis.' },
        { l:'inhaerebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'inhaereo, inhaesi, inhaesum, inhaerere (2, < in + haereo + δοτ.) — κρεμιέμαι από, προσκολλιέμαι', a:'!' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιφωνηματική)', kids:[
        { l:'ut', r:'Επιρρ. προσδ. του τρόπου', to:'στο complectebatur', g:'επιφωνηματικό επίρρημα', d:'ut — πώς!' },
        { l:'nos', r:'Αντικείμενο', to:'στο complectebatur', g:'αιτ. πληθ., αρσ. — προσωπική αντων. α΄ προσ.', d:'ego — εγώ' },
        { l:'amicos', r:'Παράθεση', to:'στο nos', g:'αιτ. πληθ., αρσ. β΄ κλ.', d:'amicus, -i (αρσ. β΄) — ο φίλος' },
        { l:'paternos', r:'Επιθετικός προσδ.', to:'στο amicos', g:'αιτ. πληθ., αρσ. — επίθ. β΄ κλ.', d:'paternus, -a, -um — πατρικός' },
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'et — και' },
        { l:'amanter', r:'Επιρρ. προσδ. του τρόπου', to:'στο complectebatur', g:'τροπικό επίρρημα', d:'amanter — με αγάπη' },
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'et — και' },
        { l:'modeste', r:'Επιρρ. προσδ. του τρόπου', to:'στο complectebatur', g:'τροπικό επίρρημα', d:'modeste — με σεμνότητα' },
        { l:'complectebatur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού — αποθετικό', d:'complector, complexus sum, (complexum), complecti (3, αποθετικό) — αγκαλιάζω', note:'Εννοούμενο υποκείμενο: (illa).', a:'!' }
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιφωνηματική)', kids:[
        { l:'ut', r:'Επιρρ. προσδ. του τρόπου', to:'στο diligebat', g:'επιφωνηματικό επίρρημα', d:'ut — πώς!' },
        { l:'nutrices', r:'Αντικείμενο', to:'στο diligebat', g:'αιτ. πληθ., θηλ. γ΄ κλ.', d:'nutrix, nutricis (θηλ. γ΄) — η τροφός', a:',' },
        { l:'ut', r:'Επιρρ. προσδ. του τρόπου', to:'στο diligebat', g:'επιφωνηματικό επίρρημα', d:'ut — πώς!' },
        { l:'paedagogos', r:'Αντικείμενο', to:'στο diligebat', g:'αιτ. πληθ., αρσ. β΄ κλ.', d:'paedagogus, -i (αρσ. β΄) — ο παιδαγωγός', a:',' },
        { l:'ut', r:'Επιρρ. προσδ. του τρόπου', to:'στο diligebat', g:'επιφωνηματικό επίρρημα', d:'ut — πώς!' },
        { l:'praeceptores', r:'Αντικείμενο', to:'στο diligebat', g:'αιτ. πληθ., αρσ. γ΄ κλ.', d:'praeceptor, praeceptoris (αρσ. γ΄) — ο δάσκαλος' },
        { l:'diligebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'diligo, dilexi, dilectum, diligere (3, < dis + lego) — αγαπώ', note:'Εννοούμενο υποκείμενο: (illa).', a:'!' }
      ]}
    ]},

    { n: 10, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιφωνηματική)', kids:[
        { l:'quam', r:'Επιρρ. προσδ. του ποσού', to:'στο studiose', g:'ποσοτικό επίρρημα', d:'quam — πόσο', note:'Επιτείνει τη σημασία του studiose.' },
        { l:'studiose', r:'Επιρρ. προσδ. του τρόπου', to:'στο lectitabat', g:'τροπικό επίρρημα', d:'studiose — με επιμέλεια', a:',' },
        { l:'quam', r:'Επιρρ. προσδ. του ποσού', to:'στο intellegenter', g:'ποσοτικό επίρρημα', d:'quam — πόσο', note:'Επιτείνει τη σημασία του intellegenter.' },
        { l:'intellegenter', r:'Επιρρ. προσδ. του τρόπου', to:'στο lectitabat', g:'τροπικό επίρρημα', d:'intellegenter — με εξυπνάδα, με νόημα' },
        { l:'lectitabat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'lectito, lectitavi, lectitatum, lectitare (1) — διαβάζω συχνά (θαμιστικό του lego)', note:'Εννοούμενο υποκείμενο: (illa).', a:'!' }
      ]}
    ]},

    { n: 11, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιφωνηματική)', kids:[
        { l:'ut', r:'Επιρρ. προσδ. του τρόπου', to:'στο ludebat', g:'επιφωνηματικό επίρρημα', d:'ut — πώς!' },
        { l:'parce', r:'Επιρρ. προσδ. του τρόπου', to:'στο ludebat', g:'τροπικό επίρρημα', d:'parce — συγκρατημένα' },
        { l:'ludebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'ludo, lusi, lusum, ludere (3) — παίζω', note:'Εννοούμενο υποκείμενο: (illa).', a:'!' }
      ]}
    ]},

    { n: 12, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιφωνηματική)', kids:[
        { l:'Qua', r:'Επιθετικός προσδ.', to:'στο patientia', g:'αφαιρ. ενικ., θηλ. — ερωτηματική επιθετική αντων.', d:'qui, quae, quod — ποιος, ποια, ποιο' },
        { l:'illa', r:'Υποκείμενο', to:'στο tulit', g:'ονομ. ενικ., θηλ. — δεικτική αντων.', d:'ille, illa, illud — εκείνος, εκείνη, εκείνο' },
        { l:'patientia', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο tulit', g:'αφαιρ. ενικ., θηλ. α΄ κλ.', d:'patientia, -ae (θηλ. α΄) — υπομονή', a:',' },
        { l:'qua', r:'Επιθετικός προσδ.', to:'στο constantia', g:'αφαιρ. ενικ., θηλ. — ερωτηματική επιθετική αντων.', d:'qui, quae, quod — ποιος, ποια, ποιο' },
        { l:'etiam', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός σύνδεσμος', d:'etiam — ακόμη' },
        { l:'constantia', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο tulit', g:'αφαιρ. ενικ., θηλ. α΄ κλ.', d:'constantia, -ae (θηλ. α΄) — εγκαρτέρηση' },
        { l:'novissimam', r:'Επιθετικός προσδ.', to:'στο valetudinem', g:'αιτ. ενικ., θηλ. — υπερθετικός βαθμός του επιθ. novus, -a, -um', d:'novissimus, -a, -um — τελευταίος, πρόσφατος (υπερθ. του novus, -a, -um = νέος)' },
        { l:'valetudinem', r:'Αντικείμενο', to:'στο tulit', g:'αιτ. ενικ., θηλ. γ΄ κλ.', d:'valetudo, valetudinis (θηλ. γ΄) — (κακή) υγεία, αρρώστια' },
        { l:'tulit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής του ανώμ. ρήματος', d:'fero, tuli, latum, ferre — υπομένω', a:'!' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Tristissimus haec tibi scribo:", el:"Πάρα πολύ λυπημένος σου γράφω αυτά:" },
    { n:2, la:"C. Plinius Marcellino suo salutem.", el:"Ο Γάιος Πλίνιος (στέλνει) τις ευχές του στον φίλο του Μαρκελλίνο." },
    { n:3, la:"Fundani nostri filia minor mortua est.", el:"Η μικρότερη κόρη του Φουνδανού μας πέθανε." },
    { n:4, la:"Ea puella nihil umquam festivius, nihil amabilius nec longiore vita dignius vidi.", el:"Από αυτό το κορίτσι ποτέ δεν είδα τίποτα πιο πρόσχαρο, τίποτα πιο αξιαγάπητο ούτε πιο άξιο για πιο μακρόχρονη ζωή." },
    { n:5, la:"Nondum annos XIII impleverat,", el:"Δεν είχε ακόμη συμπληρώσει τα δεκατρία της χρόνια" },
    { n:6, la:"et iam illi anilis prudentia, matronalis gravitas erat et tamen suavitas puellaris.", el:"και ήδη εκείνη διέθετε γεροντική φρόνηση, σοβαρότητα που ταιριάζει σε δέσποινα και όμως κοριτσίστικη γλυκύτητα." },
    { n:7, la:"Ut illa patris cervicibus inhaerebat!", el:"Πώς εκείνη κρεμιόταν από το λαιμό του πατέρα (της)!" },
    { n:8, la:"ut nos amicos paternos et amanter et modeste complectebatur!", el:"Πώς αγκάλιαζε εμάς τους πατρικούς φίλους και με αγάπη και με σεμνότητα!" },
    { n:9, la:"ut nutrices, ut paedagogos, ut praeceptores diligebat!", el:"Πώς αγαπούσε τις τροφούς, πώς τους παιδαγωγούς, πώς τους δασκάλους (της)!" },
    { n:10, la:"quam studiose, quam intellegenter lectitabat!", el:"Με πόση επιμέλεια, με πόση εξυπνάδα και προθυμία διάβαζε!" },
    { n:11, la:"ut parce ludebat!", el:"Πόσο συγκρατημένα έπαιζε!" },
    { n:12, la:"Qua illa patientia, qua etiam constantia novissimam valetudinem tulit!", el:"Με πόση υπομονή, με πόση ακόμη εγκαρτέρηση εκείνη υπέμεινε την τελευταία αρρώστια (της)!" }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"filia, -ae", note:"δοτ./αφαιρ. πληθ. filiabus (για διάκριση)" },
        { form:"puella, -ae" },
        { form:"vita, -ae" },
        { form:"prudentia, -ae", note:"δεν έχει πληθ. (αφηρημένη έννοια)" },
        { form:"patientia, -ae", note:"δεν έχει πληθ. (αφηρημένη έννοια)" },
        { form:"constantia, -ae", note:"δεν έχει πληθ. (αφηρημένη έννοια)" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"C. Plinius, -ii/-i", note:"κύριο όνομα· χωρίς πληθ." },
        { form:"Marcellinus, -i", note:"κύριο όνομα· χωρίς πληθ." },
        { form:"Fundanus, -i", note:"κύριο όνομα· χωρίς πληθ." },
        { form:"annus, -i" },
        { form:"amicus, -i" },
        { form:"paedagogus, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"pater, patris", note:"γεν. πληθ. patrum" },
        { form:"praeceptor, praeceptoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"salus, salutis", note:"δεν έχει πληθ. (αφηρημένη έννοια)" },
        { form:"gravitas, gravitatis" },
        { form:"suavitas, suavitatis" },
        { form:"cervices, cervicum", note:"σπάνια στον ενικό: cervix, cervicis" },
        { form:"nutrix, nutricis" },
        { form:"valetudo, valetudinis" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"parvus, -a, -um" },
      { form:"festivus, -a, -um" },
      { form:"longus, -a, -um" },
      { form:"dignus, -a, -um" },
      { form:"paternus, -a, -um" },
      { form:"novus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"tristis, -is, -e" },
      { form:"amabilis, -is, -e" },
      { form:"anilis, -is, -e" },
      { form:"matronalis, -is, -e" },
      { form:"puellaris, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"parvus, -a, -um", comp:"minor, minor, minus", sup:"minimus, -a, -um" },
      { pos:"festivus, -a, -um", comp:"festivior, -ior, -ius", sup:"festivissimus, -a, -um" },
      { pos:"longus, -a, -um", comp:"longior, -ior, -ius", sup:"longissimus, -a, -um" },
      { pos:"dignus, -a, -um", comp:"dignior, -ior, -ius", sup:"dignissimus, -a, -um" },
      { pos:"modestus, -a, -um", comp:"modestior, -ior, -ius", sup:"modestissimus, -a, -um" },
      { pos:"studiosus, -a, -um", comp:"studiosior, -ior, -ius", sup:"studiosissimus, -a, -um" },
      { pos:"parcus, -a, -um", comp:"parcior, -ior, -ius", sup:"parcissimus, -a, -um" },
      { pos:"novus, -a, -um", comp:"recentior, -ior, -ius", sup:"novissimus, -a, -um" },
      { pos:"paternus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"tristis, -is, -e", comp:"tristior, -ior, -ius", sup:"tristissimus, -a, -um" },
      { pos:"amabilis, -is, -e", comp:"amabilior, -ior, -ius", sup:"amabilissimus, -a, -um" },
      { pos:"amans, -ns, -ns", comp:"amantior, -ior, -ius", sup:"amantissimus, -a, -um" },
      { pos:"anilis, -is, -e", comp:"—", sup:"—" },
      { pos:"matronalis, -is, -e", comp:"—", sup:"—" },
      { pos:"puellaris, -is, -e", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ένας κτήτορας" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσώπου" },
    { form:"noster, nostra, nostrum", kind:"Κτητική", extra:"α΄ προσ., πολλοί κτήτορες" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως οριστική" },
    { form:"nihil", kind:"Αόριστη", extra:"ουσιαστική· άκλιτη (nullius rei)" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"" },
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσώπου" },
    { form:"qui, quae, quod", kind:"Ερωτηματική", extra:"επιθετική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"lectito", perf:"lectitavi", sup:"lectitatum", inf:"lectitare", note:"θαμιστικό του lego" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"video", perf:"vidi", sup:"visum", inf:"videre", note:"" },
      { pres:"impleo", perf:"implevi", sup:"impletum", inf:"implere", note:"" },
      { pres:"inhaereo", perf:"inhaesi", sup:"inhaesum", inf:"inhaerere", note:"< in + haereo + δοτ." }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"scribo", perf:"scripsi", sup:"scriptum", inf:"scribere", note:"" },
      { pres:"morior", perf:"mortuus sum", sup:"(mortuum)", inf:"mori", note:"αποθετικό, 15 σε -io" },
      { pres:"complector", perf:"complexus sum", sup:"(complexum)", inf:"complecti", note:"αποθετικό" },
      { pres:"diligo", perf:"dilexi", sup:"dilectum", inf:"diligere", note:"< dis + lego" },
      { pres:"ludo", perf:"lusi", sup:"lusum", inf:"ludere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"Ανώμαλα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό — είμαι" },
      { pres:"fero", perf:"tuli", sup:"latum", inf:"ferre", note:"ανώμαλο· προστ. fer· εδώ: υπομένω" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Ρήμα", title:"morior & complector: αποθετικά", body:"Το morior, mortuus sum, mori (3 σε -io) και το complector, complexus sum, complecti (3) είναι αποθετικά: κλίνονται μόνο στη μέση (παθητική) φωνή με ενεργητική σημασία. Το morior δεν έχει απαρέμφατο μέλλοντα μέσης φωνής και σχηματίζει μτχ. μέλλ. moriturus και μτχ. παρακ. mortuus." },
    { tag:"Ρήμα", title:"fero: ανώμαλο ρήμα", body:"Το fero, tuli, latum, ferre είναι ανώμαλο. Ο παρακείμενος tulit είναι το ρήμα του tulit (εδώ = υπομένω). Σχηματίζει β΄ ενικ. προστ. ενεστ. fer (χωρίς -e), όπως και dic, duc, fac. Οι τύποι από το θέμα fer- συγκόπτουν (π.χ. fers, fert· ferrem)." },
    { tag:"Ουσιαστικό", title:"C. Plinius: υπερδισύλλαβο σε -ius", body:"Το Plinius, ως υπερδισύλλαβο κύριο όνομα σε -ius, σχηματίζει γεν. ενικ. σε -ii και -i (με συναίρεση) και κλητ. ενικ. σε -i αντί -ie (πρβ. filius)." },
    { tag:"Σύνταξη", title:"Σύγκριση: β΄ όρος με αφαιρετική ή quam", body:"Στο «nihil ... festivius (nihil amabilius, dignius) ... ea puella» οι α΄ όροι είναι τα nihil, nihil και ο β΄ όρος είναι το ea puella, που εκφέρεται με απλή αφαιρετική (αφαιρετική συγκριτική). Ισοδύναμα: quam ea puella (β΄ τρόπος, στο τέλος της πρότασης)." },
    { tag:"Επίθετο", title:"novus: ελλειπτικά παραθετικά", body:"Το novus, -a, -um παίρνει συγκριτικό βαθμό recentior, -ior, -ius (από το recens, recentis) και υπερθετικό novissimus, -a, -um. Το novissimus σημαίνει «τελευταίος, πρόσφατος»." },
    { tag:"Ουσιαστικό", title:"cervices & pater: κλιτικές ιδιαιτερότητες", body:"Το cervices, cervicum (θηλ. γ΄) απαντά στον ενικό (cervix, cervicis) συνήθως στην ποίηση. Το pater, patris σχηματίζει γεν. πληθ. patrum (θέμα σε δύο σύμφωνα), όπως και mater (matrum), frater (fratrum)." }
  ],

  // ── ΜΕΡΟΣ 8: ΩΣ ΠΡΟΣ ΤΟ ΣΥΝΤΑΚΤΙΚΟ (ΜΕΤΑΤΡΟΠΕΣ) ──────────────────────────
  transforms: [
    { id:"Α", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Tristissimus haec tibi scribo", to:"A me tristissimo haec (ονομ.) tibi scribuntur." },
      { from:"Ea puella nihil umquam festivius, ... vidi", to:"Ea puella nihil (ονομ.) umquam festivius (ονομ.), ... a me visum est." },
      { from:"Nondum annos XIII impleverat", to:"Nondum XIII anni impleti erant." },
      { from:"ut nutrices, ut paedagogos, ut praeceptores diligebat!", to:"ut nutrices (ονομ.), ut paedagogi (ονομ.), ut praeceptores (ονομ.) ab illa diligebantur!" },
      { from:"Qua illa patientia, qua etiam constantia novissimam valetudinem tulit!", to:"Qua ab illa (αφαιρ.) patientia, qua etiam constantia novissima valetudo lata est!" }
    ]},
    { id:"Β", label:"Μετατροπή του ευθέος λόγου σε πλάγιο", items:[
      { from:"Tristissimus haec tibi scribo", to:"C. Plinius dicit / dixit se tristissimum illa / ea illi scribere.", note:"dicit (αρκτικός χρ.) / dixit (ιστορικός χρ.)" },
      { from:"Fundani nostri filia minor mortua est", to:"C. Plinius scribit / scripsit Marcellino Fundani sui filiam minorem mortuam esse.", note:"scribit (αρκτικός χρ.) / scripsit (ιστορικός χρ.)" },
      { from:"Ea puella nihil umquam festivius, ... vidi", to:"C. Plinius scribit / scripsit Marcellino ea puella nihil umquam festivius, ... se vidisse." },
      { from:"Nondum annos XIII impleverat, et iam illi anilis prudentia, matronalis gravitas erat et tamen suavitas puellaris", to:"C. Plinius scribit / scripsit Marcellino nondum annos XIII puellam implevisse, et iam illi anilem prudentiam, matronalem gravitatem esse et tamen suavitatem puellarem." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΟΙ ΣΥΣΧΕΤΙΣΜΟΙ ─────────────────────────────────────
  etymology: [
    { la:"Gaius Plinius", el:"Γάιος Πλίνιος." },
    { la:"Marcellino", el:"Μαρκελλίνος, Μαρκέλλα." },
    { la:"salutem", el:"(γαλλ.) salutation (= χαιρετισμός)." },
    { la:"tristissimus", el:"(γαλλ.) tristesse (= λύπη), triste (= λυπημένος) // (γερμ.) trist." },
    { la:"scribo", el:"σκάριφος (= όργανο γραφής), σκαρίφημα // (αγγλ.) script (= σενάριο κινηματογραφικής ταινίας)." },
    { la:"Fundani", el:"Φουνδανός." },
    { la:"minor", el:"μινόρε, μίνιμουμ, μινιατούρα (< ιταλ.) // μινιμαλισμός (< γαλλ.) // (γαλλ.) minute (= δευτερόλεπτο)." },
    { la:"mortua", el:"βροτός (= νεκρός) // (αγγλ.) mortal (= θνητός)." },
    { la:"est, erat", el:"εἰμί." },
    { la:"puella, puellaris (puer)", el:"puerulus → pullus (= μικρό ζώο) → (κατάληξη) -πουλος." },
    { la:"festivius", el:"φεστιβάλ (< γαλλ.)." },
    { la:"amabilius, amicos, amanter", el:"αμόρε (< ιταλ.) // (γαλλ.) amour (= αγάπη), ami (= φίλος), amical (= φιλικός)." },
    { la:"longiore", el:"δολιχ-ός // (αγγλ.) long, (γαλλ.) longue." },
    { la:"vita", el:"βίος // βιταλισμός (< γαλλ. vitalisme), βιταμίνη (< γαλλ.)." },
    { la:"dignius", el:"(γαλλ.) dignité (= αξιοπρέπεια), αντιθ. indignité." },
    { la:"vidi, prudentia [< pro-videntia < pro + video]", el:"(Ϝιδεῖν) ιδέα, βίντεο (< αγγλ.)." },
    { la:"annos", el:"(γαλλ.) année (= έτος, χρονιά)." },
    { la:"im-pleverat", el:"πίμπλημι / πληθύς· πλήθος, πλημμύρα, πλήρης, πλησμονή." },
    { la:"matronalis", el:"μήτηρ // (γαλλ.) maternel (= μητρικός)." },
    { la:"gravitas", el:"βαρύς // (γαλλ.) gravité (= βαρύτητα, σοβαρότητα)." },
    { la:"suavitas", el:"ἁδύς (ἡδύς)· ηδονή // (αγγλ.) sweet (= γλυκύς), sweetness (= γλυκύτητα)." },
    { la:"patris, paternos", el:"πατήρ // (γαλλ.) paternel (= πατρικός)." },
    { la:"cer-vicibus", el:"κάρα, κορυφή // (αγγλ.) cervix (= τράχηλος)." },
    { la:"inhaerebat", el:"(γαλλ.) inhérent (= σύμφυτος), adhérer (= προσκολλώμαι)." },
    { la:"modeste", el:"(γαλλ.) modeste (= σεμνός)." },
    { la:"complectebatur", el:"κόμπλεξ (< αγγλ.) // (γαλλ.) complexe (= σύμπλεγμα)." },
    { la:"nutrices", el:"(αγγλ.) nutrient (= θρεπτικό συστατικό) // (γαλλ.) nutrition [= (δια)τροφή]." },
    { la:"paedagogos", el:"παιδαγωγός." },
    { la:"praeceptores [< prae + capio]", el:"(γαλλ.) ac-cepter (= δέχομαι) // (ιταλ.) capire (= καταλαβαίνω)." },
    { la:"diligebat", el:"λέγω." },
    { la:"studiose", el:"στούντιο (< ιταλ.) (= εργαστήριο καλλιτέχνη, σπουδαστήριο, μικρό διαμέρισμα) // (αγγλ.) student (= μαθητής)." },
    { la:"intellegenter", el:"(γαλλ.) intelligent (= ευφυής)." },
    { la:"lectitabat", el:"λέκτορας." },
    { la:"patientia", el:"παθεῖν // πασιέντσα (< ιταλ.) // (γαλλ.) patience (= υπομονή) // (αγγλ.) patiens (= ασθενής)." },
    { la:"constantia", el:"ἵστημι, στάση, Κωνσταντίνος // (γαλλ.) station (= στάση, σταθμός), stable (= σταθερός), stabilité (= σταθερότητα)." },
    { la:"novissimam", el:"νέος· (αγγλ.) new." },
    { la:"valetudinem [< validus]", el:"(γαλλ.) valider (= επιβεβαιώνω)." }
  ]
};

export default UNIT;
