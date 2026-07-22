export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 31,
  title: "Η γενναιότητα δε βγαίνει πάντα σε καλό",
  latinTitle: "Lectio XXXI",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Bello', r:'Αφαιρετική του χρόνου', to:'στο praefuit', g:'αφαιρ. ενικ., ουδ.', d:'bellum, belli (ουδ. β΄) — ο πόλεμος' },
        { l:'Latino', r:'Επιθετικός προσδ.', to:'στο bello', g:'αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'Latinus, -a, -um — λατινικός', note:'bello Latino = στον Λατινικό πόλεμο.' },
        { l:'T. Manlius', r:'Υποκείμενο', to:'στο praefuit', g:'ονομ. ενικ., αρσ.', d:'Titus Manlius, Titi Manlii/-i (αρσ. β΄) — ο Τίτος Μάνλιος', note:'Ως κύρια ονόματα δε σχηματίζουν πληθυντικό.' },
        { l:'consul', r:'Παράθεση', to:'στο T. Manlius', g:'ονομ. ενικ.', d:'consul, consulis (αρσ. γ΄) — ο ύπατος' },
        { l:'nobili', r:'Επιθετικός προσδ.', to:'στο genere', g:'αφαιρ. ενικ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)', d:'nobilis, -is, -e — αριστοκρατικός, ευγενής' },
        { l:'genere', r:'Αφαιρετική της καταγωγής', to:'στη μετοχή natus', g:'αφαιρ. ενικ.', d:'genus, generis (ουδ. γ΄) — η γενιά, το γένος' },
        { l:'natus', r:'Επιθετική μετοχή (ως παράθεση στο T. Manlius)', to:'δηλώνει το προτερόχρονο', g:'ονομ. ενικ., αρσ. — μτχ. παρακειμένου', d:'nascor, natus sum, nasci (3, αποθετικό) — γεννιέμαι, κατάγομαι', note:'nobili genere natus = καταγόμενος από αριστοκρατική γενιά.' },
        { l:'exercitui', r:'Αντικείμενο (δοτ. ως συμπλήρωμα)', to:'στο praefuit', g:'δοτ. ενικ.', d:'exercitus, -us (αρσ. δ΄) — ο στρατός' },
        { l:'Romanorum', r:'Γενική κτητική', to:'στο exercitui', g:'γεν. πληθ., αρσ.', d:'Romanus, -i (αρσ. β΄) — ο Ρωμαίος' },
        { l:'praefuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου', d:'praesum, praefui, —, praeesse (< prae + sum) (+ δοτ.) — προΐσταμαι, έχω την αρχηγία', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Is', r:'Υποκείμενο', to:'στο edixit', g:'ονομ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό', note:'Is = T. Manlius.' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρηματικός προσδ. του χρόνου στο ρήμα edixit. Εισάγεται με τον ιστορικό-διηγηματικό σύνδεσμο cum και εκφέρεται με υποτακτική (abiret, παρατατικός) γιατί εξαρτάται από ιστορικό χρόνο· εκφράζει το σύγχρονο στο παρελθόν.', kids:[
          { l:'cum', r:'Σύνδεσμος', g:'ιστορικός-διηγηματικός σύνδεσμος', d:'cum — όταν' },
          { l:'aliquando', r:'Επιρρ. προσδ. του χρόνου', to:'στο abiret', g:'χρονικό επίρρημα', d:'aliquando — κάποτε' },
          { l:'castris', r:'Αφαιρετική της απομάκρυνσης/του χωρισμού', to:'στο abiret', g:'αφαιρ. πληθ., ουδ.', d:'castra, -orum (ουδ. β΄, πληθ.) — το στρατόπεδο' },
          { l:'abiret', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατατικού', d:'abeo, abivi/abii, abitum, abire (< ab + eo) — φεύγω, αποχωρώ', a:',' }
        ]},
        { l:'edixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'edico, edixi, edictum, edicere (< e + dico) (3) — διατάζω' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ονοματική βουλητική πρόταση, ως αντικείμενο στο ρήμα edixit. Εισάγεται με τον βουλητικό σύνδεσμο ut (καταφατική) και εκφέρεται με υποτακτική (abstinerent), γιατί το περιεχόμενό της είναι απλώς επιθυμητό. Ιδιομορφία στην ακολουθία των χρόνων.', kids:[
          { l:'ut', r:'Σύνδεσμος', g:'βουλητικός σύνδεσμος', d:'ut — να' },
          { l:'omnes', r:'Υποκείμενο', to:'στο abstinerent', g:'ονομ. πληθ., αρσ. — επίθ. γ΄ κλ.', d:'omnis, -is, -e — όλος, καθένας' },
          { l:'pugna', r:'Αφαιρετική της απομάκρυνσης/του χωρισμού', to:'στο abstinerent', g:'αφαιρ. ενικ.', d:'pugna, -ae (θηλ. α΄) — η μάχη' },
          { l:'abstinerent', r:'Ρήμα', g:'γ΄ πληθ. υποτ. παρατατικού', d:'abstineo, abstinui, abstentum, abstinere (< abs + teneo) (2) — απέχω', a:'.' }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { l:'Sed', r:'Σύνδεσμος', g:'αντιθετικός (παρατακτικός) σύνδεσμος', d:'sed — αλλά', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'paulo', r:'Αφαιρετική του μέτρου/της διαφοράς', to:'στο post', g:'αφαιρ. ενικ., ουδ.', d:'paulus, -a, -um — λίγος' },
        { l:'post', r:'Επιρρ. προσδ. του χρόνου', to:'στο praeterequitavit', g:'επίρρημα', d:'post — αργότερα, ύστερα' },
        { l:'filius', r:'Υποκείμενο', to:'στο praeterequitavit', g:'ονομ. ενικ.', d:'filius, filii/-i (αρσ. β΄) — ο γιος' },
        { l:'eius', r:'Γενική κτητική', to:'στο filius', g:'γεν. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός· eius = του T. Manlius' },
        { l:'castra', r:'Αντικείμενο', to:'στο praeterequitavit', g:'αιτ. πληθ., ουδ.', d:'castra, -orum (ουδ. β΄, πληθ.) — το στρατόπεδο' },
        { l:'hostium', r:'Γενική κτητική', to:'στο castra', g:'γεν. πληθ., αρσ.', d:'hostis, hostis (αρσ. γ΄) — ο εχθρός' },
        { l:'praeterequitavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'praeterequito, praeterequitavi, praeterequitatum, praeterequitare (< praeter + equito) (1) — περνώ έφιππος μπροστά από' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση συνδεδεμένη παρατακτικά (συμπλεκτικά) με την προηγούμενη κύρια. Εννοούμενο υποκ.: filius.', kids:[
        { l:'a duce', k:'dux', r:'Εμπρόθετος προσδ. του ποιητικού αιτίου', to:'στο lacessitus est', g:'a (πρόθ. + αφαιρ.) + duce (αφαιρ. ενικ.)', d:'a — από· dux, ducis (αρσ. γ΄) — ο αρχηγός', note:'Το ποιητικό αίτιο εκφέρεται εμπρόθετα, γιατί είναι έμψυχο.' },
        { l:'hostium', r:'Γενική αντικειμενική (ή κτητική)', to:'στο duce', g:'γεν. πληθ., αρσ.', d:'hostis, hostis (αρσ. γ΄) — ο εχθρός' },
        { l:'his', r:'Επιθετικός προσδ.', to:'στο verbis', g:'αφαιρ. πληθ., ουδ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'verbis', r:'Αφαιρετική (οργανική) του μέσου/του τρόπου', to:'στο lacessitus est', g:'αφαιρ. πληθ., ουδ.', d:'verbum, -i (ουδ. β΄) — ο λόγος' },
        { l:'proelio', r:'Αντικείμενο (δοτ. ως συμπλήρωμα)', to:'στο lacessitus est', g:'δοτ. ενικ., ουδ.', d:'proelium, proelii/-i (ουδ. β΄) — η μάχη' },
        { l:'lacessitus est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής', d:'lacesso, lacessivi, lacessitum, lacessere (3) — προκαλώ· lacesso + αιτ. + δοτ. = προκαλώ κάποιον σε…', a:':' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας, εκφέρεται με προτρεπτική υποτακτική.', kids:[
        { l:'Congrediamur', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. — αποθετικό (προτρεπτική υποτακτική)', d:'congredior, congressus sum, congredi (< cum + gradior) (3, αποθετικό σε -io) — μονομαχώ, συγκρούομαι', a:',' },
        { type:'sub', key:'teliki', label:'Τελική', note:'Δευτ. επιρρηματική τελική πρόταση, ως επιρρηματικός προσδ. του σκοπού στο ρήμα Congrediamur. Εισάγεται με τον τελικό σύνδεσμο ut (καταφατική) και εκφέρεται με υποτακτική (cernatur), γιατί εκφράζει επιδιωκόμενο σκοπό.', kids:[
          { l:'ut', r:'Σύνδεσμος', g:'τελικός σύνδεσμος', d:'ut — για να' },
          { l:'singularis', r:'Επιθετικός προσδ.', to:'στο proelii', g:'γεν. ενικ., ουδ. — επίθ. γ΄ κλ.', d:'singularis, -is, -e — μόνος, μοναδικός· proelium singulare = μονομαχία' },
          { l:'proelii', r:'Γενική υποκειμενική', to:'στο eventu', g:'γεν. ενικ., ουδ.', d:'proelium, proelii/-i (ουδ. β΄) — η μάχη' },
          { l:'eventu', r:'Αφαιρετική (σημείο εκκίνησης για κρίση)', to:'στο cernatur', g:'αφαιρ. ενικ.', d:'eventus, -us (αρσ. δ΄) — η έκβαση' },
          { l:'cernatur', r:'Ρήμα (απρόσωπο)', g:'γ΄ ενικ. υποτ. ενεστ. παθ. φωνής', d:'cerno, crevi, cretum, cernere (3) — κρίνω, αποφασίζω· εδώ απρόσ.: cernitur = φαίνεται', note:'ut … cernatur = για να φανεί από την έκβαση της μονομαχίας.', a:',' },
          { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ονοματική πλάγια ερωτηματική πρόταση μερικής άγνοιας, ως υποκείμενο στο απρόσωπο ρήμα cernatur. Εισάγεται με την ερωτηματική αντων. quanto και εκφέρεται με υποτακτική (antecellat).', kids:[
            { l:'quanto', r:'Αφαιρετική του μέτρου/της διαφοράς', to:'στο antecellat', g:'αφαιρ. ενικ., ουδ. — ερωτηματική αντων.', d:'quantus, -a, -um — πόσος' },
            { l:'miles', r:'Υποκείμενο', to:'στο antecellat', g:'ονομ. ενικ.', d:'miles, militis (αρσ. γ΄) — ο στρατιώτης' },
            { l:'Latinus', r:'Επιθετικός προσδ.', to:'στο miles', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'Latinus, -a, -um — Λατίνος, λατινικός' },
            { l:'Romano', r:'Αντικείμενο', to:'στο antecellat', g:'δοτ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'Romanus, -a, -um — Ρωμαίος, ρωμαϊκός', note:'Το επίθετο έγινε αντικείμενο με παράλειψη του εννοούμενου militi.' },
            { l:'virtute', r:'Αφαιρετική της αναφοράς', to:'στο antecellat', g:'αφαιρ. ενικ.', d:'virtus, virtutis (θηλ. γ΄) — η ανδρεία' },
            { l:'antecellat', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. ενεργ. φωνής', d:'antecello, —, —, antecellere (+ δοτ. και αφαιρ.) (3) — ξεπερνώ κάποιον σε κάτι', a:'».' }
          ]}
        ]}
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο ruit', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'adulescens', r:'Υποκείμενο', to:'στο ruit', g:'ονομ. ενικ. — ουσ. γ΄ κλ.', d:'adulescens, adulescentis (αρσ./θηλ. γ΄) — ο νεαρός', a:',' },
        { l:'viribus', r:'Αφαιρετική (οργανική) του μέσου', to:'στη μετοχή confisus', g:'αφαιρ. πληθ.', d:'vis (θηλ. γ΄, ελλειπτικό) — η δύναμη· πληθ. vires, virium — οι δυνάμεις' },
        { l:'suis', r:'Επιθετικός προσδ.', to:'στο viribus', g:'αφαιρ. πληθ., θηλ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)', d:'suus, sua, suum — δικός του', note:'Άμεση (ευθεία) αυτοπάθεια· αναφέρεται στο υποκ. adulescens.' },
        { l:'confisus', r:'Επιρρ. αιτιολογική μετοχή (συνημμένη στο adulescens)', to:'στο ruit', g:'ονομ. ενικ., αρσ. — μτχ. παρακειμένου', d:'confido, confisus sum, confidere (3, ημιαποθετικό) — εμπιστεύομαι', note:'Δηλώνει το προτερόχρονο.' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'cupiditate', r:'Αφαιρετική της αιτίας (εσωτερικό αναγκαστικό αίτιο)', to:'στη μετοχή permotus', g:'αφαιρ. ενικ.', d:'cupiditas, cupiditatis (θηλ. γ΄) — η επιθυμία' },
        { l:'pugnandi', r:'Γενική γερουνδίου (ως αντικειμενική)', to:'στο cupiditate', g:'γεν. γερουνδίου', d:'pugno, pugnavi, pugnatum, pugnare (1) — μάχομαι· pugnandi = για μάχη' },
        { l:'permotus', r:'Επιρρ. αιτιολογική μετοχή (συνημμένη στο adulescens)', to:'στο ruit', g:'ονομ. ενικ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'permoveo, permovi, permotum, permovere (< per + moveo) (2) — παρακινώ, παρασύρω', a:',' },
        { l:'iniussu', r:'Αφαιρετική της αιτίας (εσωτερικό αναγκαστικό αίτιο)', to:'στο ruit', g:'αφαιρ. ενικ.', d:'iniussus, -us (αρσ. δ΄, εύχρηστο μόνο στην αφαιρ. ενικ.) — η μη διαταγή· iniussu + γεν. = αντίθετα με τη διαταγή κάποιου' },
        { l:'consulis', r:'Γενική υποκειμενική', to:'στο iniussu', g:'γεν. ενικ.', d:'consul, consulis (αρσ. γ΄) — ο ύπατος' },
        { l:'in certamen', k:'certamen', r:'Εμπρόθετος επιρρ. προσδ. του σκοπού', to:'στο ruit', g:'in (πρόθ. + αιτ.) + certamen (αιτ. ενικ., ουδ.)', d:'in — σε· certamen, certaminis (ουδ. γ΄) — ο αγώνας, η μάχη' },
        { l:'ruit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'ruo, rui, rutum, ruere (3) — ορμώ', a:';' }
      ]}
    ]},

    { n: 6, kids: [
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκ.: adulescens.', kids:[
        { l:'fortior', r:'Επιρρηματικό κατηγορούμενο του τρόπου', to:'στο transfixit', g:'ονομ. ενικ., αρσ. — επίθ. γ΄ κλ. σε συγκριτικό βαθμό', d:'fortis, -is, -e — γενναίος· fortior = γενναιότερος', note:'α΄ όρος σύγκρισης: το εννοούμενο adulescens.' },
        { l:'hoste', r:'β΄ όρος σύγκρισης', to:'στο fortior', g:'αφαιρ. ενικ. — αφαιρετική συγκριτική', d:'hostis, hostis (αρσ. γ΄) — ο εχθρός', note:'Εκφέρεται με απλή αφαιρετική (= quam hostis).', a:',' },
        { l:'hasta', r:'Αφαιρετική (οργανική) του οργάνου', to:'στο transfixit', g:'αφαιρ. ενικ.', d:'hasta, -ae (θηλ. α΄) — το δόρυ' },
        { l:'eum', r:'Αντικείμενο', to:'στο transfixit', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός· eum = hostem' },
        { l:'transfixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'transfigo, transfixi, transfixum, transfigere (< trans + figo) (3) — διαπερνώ' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενα: υποκ. adulescens, αντικ. eum.', kids:[
        { l:'armis', r:'Αφαιρετική του χωρισμού', to:'στο spoliavit', g:'αφαιρ. πληθ., ουδ.', d:'arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα' },
        { l:'spoliavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'spolio, spoliavi, spoliatum, spoliare (+ αιτ. προσώπου και αφαιρ.) (1) — απογυμνώνω', a:'.' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Statim', r:'Επιρρ. προσδ. του χρόνου', to:'στο petiverunt', g:'χρονικό επίρρημα', d:'statim — αμέσως' },
        { l:'hostes', r:'Υποκείμενο', to:'στο petiverunt', g:'ονομ. πληθ.', d:'hostis, hostis (αρσ. γ΄) — ο εχθρός' },
        { l:'fuga', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο petiverunt', g:'αφαιρ. ενικ.', d:'fuga, -ae (θηλ. α΄) — η φυγή' },
        { l:'salutem', r:'Αντικείμενο', to:'στο petiverunt', g:'αιτ. ενικ.', d:'salus, salutis (θηλ. γ΄) — η σωτηρία', note:'fuga salutem petere = ζητώ τη σωτηρία στη φυγή.' },
        { l:'petiverunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής', d:'peto, petivi/petii, petitum, petere (3) — ζητώ', a:'.' }
      ]}
    ]},

    { n: 8, kids: [
      { l:'Sed', r:'Σύνδεσμος', g:'αντιθετικός (παρατακτικός) σύνδεσμος', d:'sed — αλλά', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'consul', r:'Υποκείμενο', to:'στο multavit', g:'ονομ. ενικ.', d:'consul, consulis (αρσ. γ΄) — ο ύπατος', a:',' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρηματικός προσδ. του χρόνου στο ρήμα multavit. Εισάγεται με τον ιστορικό-διηγηματικό σύνδεσμο cum και εκφέρεται με υποτακτική (revertisset, υπερσυντέλικος) γιατί εξαρτάται από ιστορικό χρόνο· εκφράζει το προτερόχρονο στο παρελθόν.', kids:[
          { l:'cum', r:'Σύνδεσμος', g:'ιστορικός-διηγηματικός σύνδεσμος', d:'cum — όταν, αφού' },
          { l:'in castra', k:'castra', r:'Εμπρόθετος προσδ. της κίνησης σε τόπο', to:'στο revertisset', g:'in (πρόθ. + αιτ.) + castra (αιτ. πληθ., ουδ.)', d:'in — σε· castra, -orum (ουδ. β΄) — το στρατόπεδο' },
          { l:'revertisset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. υπερσυντελίκου', d:'revertor, reverti, reverti (3, ημιαποθετικό) — επιστρέφω', note:'Εννοούμενο υποκ.: consul.', a:',' }
        ]},
        { l:'adulescentem', r:'Αντικείμενο', to:'στο multavit', g:'αιτ. ενικ.', d:'adulescens, adulescentis (αρσ. γ΄) — ο νεαρός', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση, ως επιθετικός προσδ. στον όρο adulescentem της κύριας. Εισάγεται με την αναφορική αντων. cuius και εκφέρεται με οριστική (fugati erant), γιατί εκφράζει το πραγματικό.', kids:[
          { l:'cuius', r:'Γενική υποκειμενική', to:'στο opera', g:'γεν. ενικ., αρσ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'opera', r:'Αφαιρετική (οργανική) του μέσου', to:'στο fugati erant', g:'αφαιρ. ενικ.', d:'opera, -ae (θηλ. α΄) — η ενέργεια, η φροντίδα' },
          { l:'hostes', r:'Υποκείμενο', to:'στο fugati erant', g:'ονομ. πληθ.', d:'hostis, hostis (αρσ. γ΄) — ο εχθρός' },
          { l:'fugati erant', r:'Ρήμα', g:'γ΄ πληθ. οριστ. υπερσυντελίκου παθ. φωνής', d:'fugo, fugavi, fugatum, fugare (1) — τρέπω σε φυγή', a:',' }
        ]},
        { l:'morte', r:'Αφαιρετική της ποινής', to:'στο multavit', g:'αφαιρ. ενικ.', d:'mors, mortis (θηλ. γ΄) — ο θάνατος' },
        { l:'multavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'multo, multavi, multatum, multare (+ αφαιρ. ποινής) (1) — τιμωρώ', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Bello Latino T. Manlius consul nobili genere natus exercitui Romanorum praefuit.", el:"Στον Λατινικό πόλεμο ο Τίτος Μάνλιος, ο ύπατος που καταγόταν από αριστοκρατική γενιά, είχε την αρχηγία του στρατού των Ρωμαίων." },
    { n:2, la:"Is cum aliquando castris abiret, edixit ut omnes pugna abstinerent.", el:"Αυτός, όταν κάποτε έφευγε από το στρατόπεδο, διέταξε να απέχουν όλοι από τη μάχη." },
    { n:3, la:"Sed paulo post filius eius castra hostium praeterequitavit et a duce hostium his verbis proelio lacessitus est:", el:"Αλλά λίγο αργότερα ο γιος του πέρασε έφιππος μπροστά από το στρατόπεδο των εχθρών και προκλήθηκε σε μάχη από τον αρχηγό των εχθρών με αυτά τα λόγια:" },
    { n:4, la:"«Congrediamur, ut singularis proelii eventu cernatur, quanto miles Latinus Romano virtute antecellat».", el:"«Ας μονομαχήσουμε, για να φανεί από την έκβαση της μονομαχίας πόσο ο Λατίνος στρατιώτης ξεπερνάει τον Ρωμαίο στην ανδρεία»." },
    { n:5, la:"Tum adulescens, viribus suis confisus et cupiditate pugnandi permotus, iniussu consulis in certamen ruit;", el:"Τότε ο νεαρός, έχοντας εμπιστοσύνη στις δυνάμεις του και παρακινημένος από την επιθυμία για μάχη, όρμησε στον αγώνα αντίθετα με τη διαταγή του υπάτου·" },
    { n:6, la:"et fortior hoste, hasta eum transfixit et armis spoliavit.", el:"και γενναιότερος από τον εχθρό, τον διαπέρασε με το δόρυ και τον απογύμνωσε από τα όπλα." },
    { n:7, la:"Statim hostes fuga salutem petiverunt.", el:"Αμέσως οι εχθροί ζήτησαν τη σωτηρία στη φυγή." },
    { n:8, la:"Sed consul, cum in castra revertisset, adulescentem, cuius opera hostes fugati erant, morte multavit.", el:"Αλλά ο ύπατος, όταν επέστρεψε στο στρατόπεδο, τιμώρησε με θάνατο τον νεαρό, με τις ενέργειες του οποίου οι εχθροί είχαν τραπεί σε φυγή." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"pugna, -ae" },
        { form:"hasta, -ae" },
        { form:"fuga, -ae" },
        { form:"opera, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"T(itus) Manlius — T(iti) Manli/-i", note:"κύριο όνομα" },
        { form:"Romanus, -i" },
        { form:"filius, -ii/-i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"bellum, -i" },
        { form:"castra, -orum", note:"ετερόσημο" },
        { form:"verbum, -i" },
        { form:"proelium, -ii/-i" },
        { form:"arma, -orum", note:"μόνο πληθ." }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"consul, consulis" },
        { form:"hostis, hostis" },
        { form:"dux, ducis" },
        { form:"miles, militis" },
        { form:"adulescens, adulescentis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"virtus, virtutis" },
        { form:"vis", note:"ελλειπτικό· πληθ. vires, virium" },
        { form:"cupiditas, cupiditatis" },
        { form:"salus, salutis", note:"δεν έχει πληθ." },
        { form:"mors, mortis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"genus, generis" },
        { form:"certamen, certaminis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"exercitus, -us" },
        { form:"eventus, -us" },
        { form:"iniussus, -us", note:"εύχρηστο μόνο στην αφαιρ. ενικ." }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"Latinus, -a, -um" },
      { form:"paulus, -a, -um" },
      { form:"Romanus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"nobilis, -is, -e" },
      { form:"omnis, -is, -e" },
      { form:"singularis, -is, -e" },
      { form:"fortis, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"Latinus, -a, -um", comp:"—", sup:"—" },
      { pos:"paulus, -a, -um", comp:"—", sup:"—" },
      { pos:"Romanus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"nobilis, -is, -e", comp:"nobilior, -ior, -ius", sup:"nobilissimus, -a, -um" },
      { pos:"fortis, -is, -e", comp:"fortior, -ior, -ius", sup:"fortissimus, -a, -um" },
      { pos:"omnis, -is, -e", comp:"—", sup:"—" },
      { pos:"singularis, -is, -e", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"quantus, quanta, quantum", kind:"Ερωτηματική", extra:"" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., για έναν κτήτορα" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"praeterequito", perf:"praeterequitavi", sup:"praeterequitatum", inf:"praeterequitare", note:"< praeter + equito" },
      { pres:"pugno", perf:"pugnavi", sup:"pugnatum", inf:"pugnare", note:"" },
      { pres:"spolio", perf:"spoliavi", sup:"spoliatum", inf:"spoliare", note:"" },
      { pres:"fugo", perf:"fugavi", sup:"fugatum", inf:"fugare", note:"" },
      { pres:"multo", perf:"multavi", sup:"multatum", inf:"multare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"abstineo", perf:"abstinui", sup:"abstentum", inf:"abstinere", note:"< abs + teneo" },
      { pres:"permoveo", perf:"permovi", sup:"permotum", inf:"permovere", note:"< per + moveo" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"nascor", perf:"natus sum", sup:"(natum)", inf:"nasci", note:"αποθετικό" },
      { pres:"edico", perf:"edixi", sup:"edictum", inf:"edicere", note:"< e + dico" },
      { pres:"lacesso", perf:"lacessivi", sup:"lacessitum", inf:"lacessere", note:"" },
      { pres:"congredior", perf:"congressus sum", sup:"(congressum)", inf:"congredi", note:"αποθετικό σε -io" },
      { pres:"cerno", perf:"crevi", sup:"cretum", inf:"cernere", note:"μτχ. παθ. πρκ.: conspectus (< conspicio)" },
      { pres:"antecello", perf:"—", sup:"—", inf:"antecellere", note:"" },
      { pres:"confido", perf:"confisus sum", sup:"(confisum)", inf:"confidere", note:"ημιαποθετικό" },
      { pres:"ruo", perf:"rui", sup:"rutum", inf:"ruere", note:"μτχ. ενεργ. μέλλ.: ruiturus" },
      { pres:"transfigo", perf:"transfixi", sup:"transfixum", inf:"transfigere", note:"< trans + figo" },
      { pres:"peto", perf:"petivi/petii", sup:"petitum", inf:"petere", note:"" },
      { pres:"revertor", perf:"reverti", sup:"(reversum)", inf:"reverti", note:"ημιαποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"Ανώμαλα", rows:[
      { pres:"praesum", perf:"praefui", sup:"—", inf:"praeesse", note:"< prae + sum" },
      { pres:"abeo", perf:"abivi/abii", sup:"abitum", inf:"abire", note:"< ab + eo" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Ουσιαστικό", title:"castra: ετερόσημο", body:"castra, -orum (ουδ. β΄, πληθ.) = το στρατόπεδο· στον ενικό castrum, -i = το φρούριο. Ετερόσημο ουσιαστικό." },
    { tag:"Ρήμα", title:"Αποθετικά & ημιαποθετικά", body:"nascor και congredior είναι αποθετικά (παθητικοί τύποι με ενεργητική σημασία)· confido και revertor είναι ημιαποθετικά (ενεστωτικοί χρόνοι ενεργητικοί, συντελικοί με παθητικούς τύπους και ενεργητική σημασία)." },
    { tag:"Ρήμα", title:"cerno: μετοχή παρακειμένου", body:"Το cerno (crevi, cretum, cernere) δεν σχηματίζει μετοχή παθ. παρακειμένου από το σουπίνο (cretum), αλλά δανείζεται τον τύπο conspectus, -a, -um (< conspicio), με τον οποίο σχηματίζει και τους περιφραστικούς τύπους της μέσης φωνής." },
    { tag:"Σύνταξη", title:"Romano: αντικείμενο του antecellat", body:"Το antecello συντάσσεται με δοτική· εδώ το Romano (δοτ.) είναι αντικείμενο, ενώ virtute είναι αφαιρετική της αναφοράς και quanto αφαιρετική του μέτρου. Το επίθετο Romano έγινε αντικείμενο με παράλειψη του εννοούμενου militi." },
    { tag:"Αφαιρετική", title:"iniussu: στερεότυπη αφαιρετική", body:"Το iniussu (δ΄ κλ., εύχρηστο μόνο στην αφαιρ. ενικ.) είναι στερεότυπη αφαιρετική που συντάσσεται με γενική υποκειμενική (consulis) και δηλώνει την αιτία (εσωτερικό αναγκαστικό αίτιο): iniussu consulis = αντίθετα με τη διαταγή του υπάτου." },
    { tag:"Σύγκριση", title:"fortior hoste: β΄ όρος", body:"Το fortior (συγκριτικός) έχει α΄ όρο σύγκρισης το εννοούμενο adulescens· ο β΄ όρος (hoste) εκφέρεται με απλή αφαιρετική συγκριτική, ισοδύναμη με quam + hostis." }
  ],

  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"nobili genere natus (praefuit)", to:"qui natus erat (qui + οριστ. υπερσυντελίκου), εξάρτηση από ιστορικό χρόνο: praefuit", note:"επιθετική μτχ. παρακειμένου — προτερόχρονο (αναφορική πρόταση)" },
      { from:"viribus suis confisus (ruit)", to:"quod / quia / quoniam confisus erat (+ οριστ. υπερσυντελίκου) — αιτιολογία αντικειμενικά αποδεκτή· ή quod / quia / quoniam confisus esset (+ υποτ. υπερσυντελίκου) — αιτιολογία υποθετική/υποκειμενική· ή cum confisus esset (+ υποτ. υπερσυντελίκου) — αιτιολογία ως αποτέλεσμα εσωτερικής λογικής διεργασίας", note:"αιτιολογική μτχ. παρακειμένου, εξάρτηση: ruit" },
      { from:"cupiditate pugnandi permotus (ruit)", to:"quod / quia / quoniam permotus erat (+ οριστ. υπερσυντελίκου)· ή quod / quia / quoniam permotus esset (+ υποτ. υπερσυντελίκου)· ή cum permotus esset (+ υποτ. υπερσυντελίκου)", note:"αιτιολογική μτχ. παρακειμένου, εξάρτηση: ruit" }
    ]},
    { id:"Β", label:"Μετατροπή δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Is cum aliquando castris abiret, edixit", to:"Is aliquando castris abiens, edixit", note:"χρονική μετοχή συνημμένη στο υποκ. Is" },
      { from:"Sed consul, cum in castra revertisset, … , morte multavit", to:"Sed consul in castra reversus, … , multavit", note:"χρονική μετοχή συνημμένη στο υποκ. consul" }
    ]},
    { id:"Γ", label:"Μετατροπή κυρίων προτάσεων σε μετοχικές φράσεις", items:[
      { from:"… hasta eum transfixit et armis spoliavit", to:"… hasta eum transfixum armis spoliavit", note:"χρονική μετοχή συνημμένη στο αντικ. eum του spoliavit" }
    ]},
    { id:"Δ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"et fortior hoste, hasta eum transfixit et armis spoliavit", to:"et is ab adulescente fortiore hoste hasta transfixus est et armis spoliatus est" },
      { from:"Sed consul, … , adulescentem, … , morte multavit", to:"Sed adulescens a consule morte multatus est" }
    ]},
    { id:"Ε", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"… et a duce hostium his verbis proelio lacessitus est", to:"… et dux hostium his verbis proelio eum lacessivit" }
    ]},
    { id:"ΣΤ", label:"Ισοδύναμη εκφορά του σκοπού (με όλους τους τρόπους) — Tum adulescens in certamen ruit", items:[
      { from:"Tum adulescens ruit ut certaret", to:"τελική πρόταση" },
      { from:"Tum adulescens ruit qui certaret", to:"αναφορικοτελική πρόταση (qui = ut is)" },
      { from:"Tum adulescens ruit certatum", to:"αιτιατική του σουπίνου" },
      { from:"Tum adulescens ruit ad certandum", to:"ad + αιτιατική του γερουνδίου" },
      { from:"Tum adulescens ruit causa certandi", to:"causa (ή gratia) + γενική του γερουνδίου" }
    ]},
    { id:"Ζ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"Bello Latino T. Manlius consul … natus … praefuit· … edixit ut … abstinerent· … praeterequitavit et … lacessitus est", to:"Scriptor tradit / tradidit bello Latino T. Manlium consulem … natum … praefuisse; eum cum … abiret, edixisse ut … abstineant / abstinerent; sed paulo post filium eius … praeterequitavisse et … illis (ή eis) verbis proelio lacessitum esse", note:"εξάρτηση: Scriptor tradit / tradidit" },
      { from:"«Congrediamur, ut … cernatur, quanto miles … antecellat»", to:"Dux hostium incitat / incitavit adulescentem ut congrediantur / congrederentur, ut … cernatur / cerneretur quanto miles … antecellat / antecelleret", note:"εξάρτηση: Dux hostium incitat / incitavit" },
      { from:"Tum adulescens … ruit· … transfixit et … spoliavit· statim hostes … petiverunt· sed consul … multavit", to:"Scriptor narrat / narravit tum adulescentem, viribus suis confisum et … permotum, … ruisse; et (adulescentem) fortiorem hoste, … transfixisse et … spoliavisse; statim hostes (αιτ.) … petivisse; sed consulem, … , adulescentem, cuius opera hostes fugati sint / fugati essent, … multavisse", note:"εξάρτηση: Scriptor narrat / narravit" }
    ]}
  ],

  etymology: [
    { la:"Latino, Latinus", el:"Λάτιο, Λατίνοι, Λατινικός // (αγγλ.) Latin (= λατινικός, η λατινική γλώσσα) // (ισπαν.) ladino (= (αρχικά) 'που ξέρει λατινικά', πονηρός· η ισπανοεβραϊκή)." },
    { la:"Titus Manlius", el:"Τίτος Μάνλιος." },
    { la:"consul, consulis", el:"(γαλλ.) consul (= πρόξενος), consulter (= συμβουλεύω)." },
    { la:"nobili", el:"γιγνώσκω // (γαλλ.) noble (= ευγενής, αριστοκράτης) // (αγγλ.) nobility (= ευγένεια, αριστοκρατία)." },
    { la:"genere", el:"γένος· γενιά // (αγγλ.) genus (= γένος (βιολ. ταξινόμηση)), gender (= γένος, φύλο), genre (= είδος, λογοτεχνικό γένος)." },
    { la:"natu", el:"γί-γνο-μαι, γνήσιος // natura (= φύση), natural· νατουραλισμός (< γαλλ.) // (αγγλ.) nation (= έθνος), native (= ιθαγενής, εκ γενετής) // (γαλλ.) naître (= γεννιέμαι)." },
    { la:"exercitu", el:"(ισπαν.) ejército (= στρατός) // (γαλλ.) exercice (= άσκηση) // (αγγλ.) exercise (= άσκηση) // (ιταλ.) esercito (= στρατός)." },
    { la:"Romanorum, Romano", el:"Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός // (αγγλ.) romance (= ρομάντζο, ιπποτική αφήγηση), Roman (= Ρωμαίος, ρωμαϊκός) // (γαλλ.) roman (= μυθιστόρημα)." },
    { la:"castris, castra", el:"κάστρο // (αγγλ.) castle (= κάστρο, φρούριο) // (γαλλ.) château (= πύργος, έπαυλη) // (ισπαν.) castillo (= κάστρο)." },
    { la:"abiret", el:"εἶμι // ιταμός." },
    { la:"edixit", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση), édit (= διάταγμα) // (αγγλ.) dictator (= δικτάτορας)." },
    { la:"pugna, pugnandi", el:"πύξ (= γροθιά)· πυγμή // (αγγλ.) pugnacious (= φιλόνικος, μαχητικός), repugnant (= αποκρουστικός) // (γαλλ.) poing (= γροθιά)." },
    { la:"abs-tinerent", el:"(γαλλ.) tenir (= κρατώ), (γαλλ.) abstinence (= αποχή) // (αγγλ.) abstain (= απέχω), tenacious (= επίμονος, που κρατά σφιχτά), tenant (= ενοικιαστής, κάτοχος), abstain (= απέχω)." },
    { la:"paulo", el:"παῦρος (= μικρός, λίγος)." },
    { la:"hostium, hoste, hostes", el:"(αγγλ.) host (= ξενιστής), hostile (= εχθρικός) // (γαλλ.) hostilité (= εχθρότητα)." },
    { la:"praeter-equitavit", el:"ἵππος // (αγγλ.) equestrian (= ιππικός, ιππέας), equine (= του αλόγου, ιππικός) // (γαλλ.) équitation (= ιππασία)." },
    { la:"duce", el:"δούκας // (αγγλ.) duke (= δούκας) // (γαλλ.) duc (= δούκας) // (ιταλ.) duca (= δούκας)." },
    { la:"verbis", el:"(Ϝερέω) ἐρῶ // (γαλλ.) verbe (= ρήμα)· βερμπαλισμός (< γαλλ.) // (αγγλ.) verbal (= λεκτικός, προφορικός), proverb (= παροιμία), verbatim (= κατά λέξη, αυτολεξεί)." },
    { la:"est, erant", el:"εἰμί // (αγγλ.) essence (= ουσία) // (γαλλ.) essence (= ουσία· βενζίνη)." },
    { la:"congrediamur", el:"κογκρέσο (= συνάθροιση) [< ιταλ. congresso, με αλλαγή της σημασίας κατά το αγγλ. congress] // (αγγλ.) egress (= έξοδος), progress (= πρόοδος), gradual (= βαθμιαίος)." },
    { la:"singularis", el:"(γαλλ.) singularité (= μοναδικότητα) // (αγγλ.) single (= μονός, μοναδικός)." },
    { la:"eventu", el:"βαίνω // (γαλλ.) avenue (= λεωφόρος) // (αγγλ.) event (= γεγονός, συμβάν), eventual (= ενδεχόμενος, τελικός)." },
    { la:"cernatur", el:"κρίνω // (αγγλ.) discern (= διακρίνω), concern (= αφορά· ανησυχία)." },
    { la:"miles", el:"μιλιταρισμός (< γαλλ.) // (αγγλ.) military (= στρατιωτικός), militia (= πολιτοφυλακή)." },
    { la:"virtute (< vir)", el:"βιρτουόζος (< ιταλ. virtuoso) // (αγγλ.) virtue (= αρετή), virile (= ανδρικός, ανδροπρεπής), virtual (= εικονικός, δυνητικός)." },
    { la:"antecellat (< ante + cello < celsus)", el:"κολωνός." },
    { la:"adulescens, adulescentem", el:"(γαλλ.) adulte (= ενήλικος) // (αγγλ.) adolescent (= έφηβος), adolescence (= εφηβεία)." },
    { la:"viribus", el:"(Ϝις) ἴς (= δύναμη)." },
    { la:"confisus", el:"πειθώ // (γαλλ.) con-fiance (= εμπιστοσύνη) // (αγγλ.) confidence (= αυτοπεποίθηση) // (ισπαν.) confiar (= εμπιστεύομαι)." },
    { la:"cupiditate", el:"(γαλλ.) cupide (= άπληστος), cupidité (= απληστία) // (αγγλ.) cupidity (= απληστία)." },
    { la:"permotus", el:"μοτέρ (< γαλλ.) // μοτίβο [< ιταλ. motivo (= κίνητρο)] // (αγγλ.) move (= κινούμαι), motion (= κίνηση), mobile (= κινητός)." },
    { la:"fortior", el:"(γαλλ.) fort (= σωματική δύναμη) // (ισπαν.) fortaleza (= φρούριο) // (αγγλ.) fortitude (= σθένος, ψυχική δύναμη), force (= δύναμη) // (ιταλ.) forte (= δυνατά (μουσ.))." },
    { la:"armis", el:"άρμα, αρματολός // (γαλλ.) armée (= στρατός) // (αγγλ.) armor (= πανοπλία), armament (= εξοπλισμός) // (ισπαν.) armada (= στόλος, αρμάδα)." },
    { la:"spoliavit", el:"(αγγλ.) spoil (= λάφυρο), despoil (= λεηλατώ, απογυμνώνω), spoliation (= λεηλασία, καταστροφή) // (γαλλ.) spolier (= αποστερώ, λεηλατώ)." },
    { la:"fuga, fugati", el:"φεύγω, φυγή // (αγγλ.) fugitive (= φυγάς), refuge (= καταφύγιο), subterfuge (= υπεκφυγή, τέχνασμα) // (ιταλ.) fuga (= φούγκα (μουσ.))." },
    { la:"salutem", el:"(γαλλ.) salutation (= χαιρετισμός) // (αγγλ.) salute (= χαιρετώ, χαιρετισμός) // (ισπαν.) salud (= υγεία)." },
    { la:"petiverunt", el:"πέτομαι, πετώ // (αγγλ.) petition (= αίτηση, αναφορά), appetite (= όρεξη), compete (= ανταγωνίζομαι)." },
    { la:"revertisset", el:"(γαλλ.) βέρσο (= πίσω μέρος σελίδας), ρεβέρ (< γαλλ.), v.s. (= εναντίον) // (αγγλ.) revert (= επανέρχομαι, επιστρέφω), version (= εκδοχή, παραλλαγή), universe (= σύμπαν)." },
    { la:"opera (< opus)", el:"όπερα, οπερέτα (< ιταλ.) // (αγγλ.) operate (= λειτουργώ, χειρίζομαι), cooperate (= συνεργάζομαι) // (γαλλ.) œuvre (= έργο (καλλιτεχνικό))." },
    { la:"morte", el:"βροτός // (γαλλ.) mort (= νεκρός) // (αγγλ.) mortal (= θνητός), mortify (= νεκρώνω, ταπεινώνω), amortize (= αποσβήνω (χρέος)) // (ισπαν.) muerte (= θάνατος)." }
  ]
};

export default UNIT;
