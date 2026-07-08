// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 31
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 31,
  title: "Η γενναιότητα δε βγαίνει πάντα σε καλό",
  latinTitle: "Lectio XXXI",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Bello', r:'Αφαιρετική (τοπική) του χρόνου', to:'στο praefuit', g:'αφαιρ. ενικ., ουδ.', d:'bellum, -i (ουδ. β΄) — ο πόλεμος' },
        { l:'Latino', r:'Επιθετικός προσδ.', to:'στο Bello', g:'αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'Latinus, -a, -um — Λατινικός' },
        { l:'T. Manlius', r:'Υποκείμενο', to:'στο praefuit', g:'ονομ. ενικ.', d:'Manlius, -ii/-i (αρσ. β΄) — ο Μάνλιος', note:'T. = Titus, Titi (αρσ. β΄) — ο Τίτος (προτακτικό).' },
        { l:'consul', r:'Παράθεση', to:'στο T. Manlius', g:'ονομ. ενικ.', d:'consul, consulis (αρσ. γ΄) — ο ύπατος', a:',' },
        { l:'nobili', r:'Επιθετικός προσδ.', to:'στο genere', g:'αφαιρ. ενικ., ουδ. — επίθ. γ΄ κλ.', d:'nobilis, -is, -e — αριστοκρατικός' },
        { l:'genere', r:'Αφαιρετική (κυρίως) της καταγωγής', to:'στο natus', g:'αφαιρ. ενικ., ουδ.', d:'genus, generis (ουδ. γ΄) — το γένος, η γενιά' },
        { l:'natus', r:'Επιθετική μετοχή (παράθεση)', to:'στο T. Manlius', g:'ονομ. ενικ., αρσ. — μτχ. παρακ. (αποθ.)', d:'nascor, natus sum, nasci (3, αποθ.) — γεννιέμαι', note:'Επιθετική μετοχή, παράθεση στο T. Manlius· μτχ. μέλλ. nasciturus.', a:',' },
        { l:'exercitui', r:'Αντικείμενο', to:'στο praefuit', g:'δοτ. ενικ.', d:'exercitus, -us (αρσ. δ΄) — ο στρατός', note:'Το praesum συντάσσεται με δοτική.' },
        { l:'Romanorum', r:'Γενική κτητική', to:'στο exercitui', g:'γεν. πληθ.', d:'Romanus, -i (αρσ. β΄) — ο Ρωμαίος' },
        { l:'praefuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου', d:'praesum, praefui, —, praeesse — είμαι αρχηγός, προΐσταμαι (+ δοτ.)', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Is', r:'Υποκείμενο', to:'στο edixit', g:'ονομ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο edixit (πρότ. 2). Εισάγεται με τον ιστορικό/διηγηματικό cum· εκφέρεται με υποτακτική, γιατί ο ιστορικός cum υπογραμμίζει τη βαθύτερη (αιτιώδη) σχέση κύριας–δευτ. πρότασης· συγκεκριμένα με υποτ. παρατατικού (εξάρτηση από ιστορικό χρόνο), δηλώνει το σύγχρονο στο παρελθόν.', kids:[
          { l:'cum', r:'Χρον. σύνδεσμος', g:'ιστορικός/διηγηματικός cum (+ υποτακτική)', d:'cum — όταν' },
          { l:'aliquando', r:'Επιρρ. προσδ. του χρόνου', to:'στο abiret', g:'χρονικό επίρρημα', d:'aliquando — κάποτε' },
          { l:'castris', r:'Αφαιρετική (κυρίως) της απομάκρυνσης', to:'στο abiret', g:'αφαιρ. πληθ., ουδ.', d:'castra, -orum (ουδ. β΄) — το στρατόπεδο', note:'Ετερόσημο: ενικ. castrum, -i = το φρούριο.' },
          { l:'abiret', r:'Ρήμα', g:'γ΄ ενικ. υποτ. παρατατικού — ανώμαλο', d:'abeo, abi(v)i, abitum, abire — φεύγω', note:'Εννοούμενο υποκ.: is.', a:',' }
        ]},
        { l:'edixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου', d:'edico, edixi, edictum, edicere (3) — διατάζω', note:'β΄ ενικ. προστ. ενεστ.: edic.' },
        { type:'sub', key:'voulitiki', label:'Βουλητική', note:'Δευτ. ουσιαστική βουλητική πρόταση, αντικείμενο στο edixit (πρότ. 2). Εισάγεται με τον βουλητικό σύνδεσμο ut, γιατί είναι καταφατική· εκφέρεται με υποτακτική, γιατί το περιεχόμενό της είναι απλώς επιθυμητό· συγκεκριμένα με υποτ. παρατατικού λόγω εξάρτησης από ιστορικό χρόνο (edixit)· ιδιομορφία στην ακολουθία των χρόνων (συγχρονισμός κύριας–δευτ. πρότασης).', kids:[
          { l:'ut', r:'Βουλητικός σύνδεσμος', g:'βουλητικός σύνδεσμος (+ υποτακτική)', d:'ut — να' },
          { l:'omnes', r:'Υποκείμενο', to:'στο abstinerent', g:'ονομ. πληθ., αρσ. — επίθ. γ΄ κλ. (ουσιαστικοπ.)', d:'omnis, -is, -e — όλος' },
          { l:'pugna', r:'Αφαιρετική (κυρίως) του χωρισμού', to:'στο abstinerent', g:'αφαιρ. ενικ.', d:'pugna, -ae (θηλ. α΄) — η μάχη' },
          { l:'abstinerent', r:'Ρήμα', g:'γ΄ πληθ. υποτ. παρατατικού ενεργ.', d:'abstineo, abstinui, abstentum, abstinere (2) — απέχω (+ αφαιρ. χωρισμού)', a:'.' }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { l:'Sed', r:'Σύνδεσμος', g:'αντιθετικός σύνδεσμος', d:'sed — αλλά', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'paulo', r:'Αφαιρετική (οργανική) του μέτρου', to:'στο post', g:'αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'paulus, -a, -um — λίγος' },
        { l:'post', r:'Επιρρ. προσδ. του χρόνου', to:'στο praeterequitavit', g:'χρονικό επίρρημα', d:'post — αργότερα, ύστερα' },
        { l:'filius', r:'Υποκείμενο', to:'στο praeterequitavit', g:'ονομ. ενικ.', d:'filius, -ii/-i (αρσ. β΄) — ο γιος', note:'Κλητ. ενικ.: fili.' },
        { l:'eius', r:'Γενική κτητική', to:'στο filius', g:'γεν. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'castra', r:'Αντικείμενο', to:'στο praeterequitavit', g:'αιτ. πληθ., ουδ.', d:'castra, -orum (ουδ. β΄) — το στρατόπεδο', note:'Ετερόσημο: ενικ. castrum = φρούριο.' },
        { l:'hostium', r:'Γενική κτητική', to:'στο castra', g:'γεν. πληθ.', d:'hostis, -is (αρσ. & θηλ. γ΄) — ο εχθρός' },
        { l:'praeterequitavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου', d:'praeterequito, -avi, -atum, -are (1) — περνώ έφιππος μπροστά από' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'a duce', k:'dux', r:'Ποιητικό αίτιο (εμπρόθετο)', to:'στο lacessitus est', g:'a/ab (πρόθ. + αφαιρ.) + duce (αφαιρ. ενικ.)', d:'a/ab — από· dux, ducis (αρσ. γ΄) — ο αρχηγός', note:'Εμπρόθετο ποιητικό αίτιο, γιατί δηλώνει έμψυχο.' },
        { l:'hostium', r:'Γενική κτητική', to:'στο duce', g:'γεν. πληθ.', d:'hostis, -is (αρσ. & θηλ. γ΄) — ο εχθρός' },
        { l:'his', r:'Επιθετικός προσδ.', to:'στο verbis', g:'αφαιρ. πληθ., ουδ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'verbis', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο lacessitus est', g:'αφαιρ. πληθ., ουδ.', d:'verbum, -i (ουδ. β΄) — ο λόγος' },
        { l:'proelio', r:'Αντικείμενο', to:'στο lacessitus est', g:'δοτ. ενικ., ουδ.', d:'proelium, -ii/-i (ουδ. β΄) — η μάχη' },
        { l:'lacessitus est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου παθ.', d:'lacesso, lacessivi, lacessitum, lacessere (3) — προκαλώ', note:'Εννοούμενο υποκ.: filius.', a:':' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας (εντός ευθέος λόγου).', kids:[
        { l:'«', plain:true },
        { l:'Congrediamur', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. — αποθετικό', d:'congredior, congressus sum, congredi (3, 15 σε -io, αποθ.) — συγκρούομαι, μονομαχώ', note:'Προτρεπτική υποτακτική· εννοούμενο υποκ.: nos.', a:',' },
        { type:'sub', key:'teliki', label:'Τελική', note:'Δευτ. επιρρηματική τελική πρόταση, ως επιρρ. προσδ. του σκοπού στο congrediamur (πρότ. 7). Εισάγεται με τον τελικό σύνδεσμο ut, γιατί είναι καταφατική· εκφέρεται με υποτακτική (ο σκοπός στα λατινικά θεωρείται υποκειμενική κατάσταση), συγκεκριμένα με υποτ. ενεστώτα λόγω εξάρτησης από αρκτικό χρόνο, δηλώνει το σύγχρονο στο παρόν· ιδιομορφία στην ακολουθία των χρόνων.', kids:[
          { l:'ut', r:'Τελικός σύνδεσμος', g:'τελικός σύνδεσμος (+ υποτακτική)', d:'ut — για να' },
          { l:'singularis', r:'Επιθετικός προσδ.', to:'στο proelii', g:'γεν. ενικ., ουδ. — επίθ. γ΄ κλ.', d:'singularis, -is, -e — μοναδικός' },
          { l:'proelii', r:'Γενική υποκειμενική', to:'στο eventu', g:'γεν. ενικ., ουδ.', d:'proelium, -ii/-i (ουδ. β΄) — η μάχη· εδώ: η μονομαχία' },
          { l:'eventu', r:'Αφαιρετική (κυρίως) του σημείου εκκίνησης για εκτίμηση/κρίση', to:'στο cernatur', g:'αφαιρ. ενικ.', d:'eventus, -us (αρσ. δ΄) — η έκβαση' },
          { l:'cernatur', r:'Ρήμα (απρόσωπο)', g:'γ΄ ενικ. υποτ. ενεστ. παθ.', d:'cerno, crevi, cretum, cernere (3) — κρίνω, διακρίνω', note:'Απρόσωπο· υποκείμενό του η πλάγια ερωτηματική quanto… antecellat.' },
          { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρόταση μερικής αγνοίας, ως υποκείμενο στο απρόσωπο cernatur (πρότ. 8). Εισάγεται με την ερωτηματική αντωνυμία quanto· εκφέρεται με υποτακτική, γιατί η εξάρτηση δίνει υποκειμενική χροιά στο περιεχόμενό της· συγκεκριμένα με υποτ. ενεστώτα λόγω εξάρτησης από αρκτικό χρόνο (cernatur), δηλώνει το σύγχρονο στο παρόν.', kids:[
            { l:'quanto', r:'Αφαιρετική (οργανική) του μέτρου', to:'στο antecellat', g:'αφαιρ. ενικ., ουδ. — ερωτηματική αντων.', d:'quantus, -a, -um — πόσος, πόση, πόσο' },
            { l:'miles', r:'Υποκείμενο', to:'στο antecellat', g:'ονομ. ενικ.', d:'miles, militis (αρσ. γ΄) — ο στρατιώτης' },
            { l:'Latinus', r:'Επιθετικός προσδ.', to:'στο miles', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'Latinus, -a, -um — Λατινικός· εδώ: ο Λατίνος' },
            { l:'Romano', r:'Αντικείμενο', to:'στο antecellat', g:'δοτ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'Romanus, -a, -um — ρωμαϊκός· εδώ: ο Ρωμαίος', note:'Το antecello συντάσσεται με δοτική· Romano ως αντικ. (κατά παράλειψη του militi) ή επιθ. προσδ. στο εννοούμενο militi.' },
            { l:'virtute', r:'Αφαιρετική (οργανική) της αναφοράς', to:'στο antecellat', g:'αφαιρ. ενικ.', d:'virtus, virtutis (θηλ. γ΄) — η ανδρεία' },
            { l:'antecellat', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. ενεργ.', d:'antecello, —, —, antecellere (3) — ξεπερνώ (+ δοτ.)', note:'Ελλειπτικό ρήμα.', a:'».' }
          ]}
        ]}
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο ruit', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'adulescens', r:'Υποκείμενο', to:'στο ruit', g:'ονομ. ενικ.', d:'adulescens, adulescentis (αρσ. γ΄) — ο νεαρός', note:'Γεν. πληθ.: adulescentium.', a:',' },
        { l:'viribus', r:'Αφαιρετική (οργανική) του μέσου', to:'στη μετοχή confisus', g:'αφαιρ. πληθ.', d:'vis (θηλ. γ΄) — η δύναμη', note:'Ελλειπτικό: ενικ. vis, —, —, vim, vi· πληθ. vires, virium, viribus…' },
        { l:'suis', r:'Επιθετικός προσδ.', to:'στο viribus', g:'αφαιρ. πληθ., θηλ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)', d:'suus, sua, suum — δικός του', note:'Εκφράζει άμεση αυτοπάθεια.' },
        { l:'confisus', r:'Αιτιολογική μετοχή (συνημμένη)', to:'στο adulescens', g:'ονομ. ενικ., αρσ. — μτχ. παρακ. (ημιαποθ.)', d:'confido, confisus sum, confidere (3, ημιαποθ.) — εμπιστεύομαι', note:'Επιρρ. προσδ. της αιτίας στο ruit.' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
        { l:'cupiditate', r:'Αφαιρετική (οργανική) του εσωτ. αναγκαστικού αιτίου', to:'στο permotus', g:'αφαιρ. ενικ.', d:'cupiditas, cupiditatis (θηλ. γ΄) — η επιθυμία' },
        { l:'pugnandi', r:'Γενική γερουνδίου (αντικειμενική)', to:'στο cupiditate', g:'γεν. γερουνδίου', d:'pugno, -avi, -atum, -are (1) — μάχομαι', note:'Γενική αντικειμενική ως συμπλήρωμα στο cupiditate.' },
        { l:'permotus', r:'Αιτιολογική μετοχή (συνημμένη)', to:'στο adulescens', g:'ονομ. ενικ., αρσ. — μτχ. παρακ. παθ.', d:'permoveo, permovi, permotum, permovere (2) — παρακινώ', note:'Επιρρ. προσδ. της αιτίας στο ruit.', a:',' },
        { l:'iniussu', r:'Αφαιρετική (οργανική) του εσωτ. αναγκαστικού αιτίου', to:'στο ruit', g:'αφαιρ. ενικ.', d:'iniussus, -us (αρσ. δ΄) — η παρά τη διαταγή· iniussu + γεν. = παρά τη διαταγή' },
        { l:'consulis', r:'Γενική υποκειμενική', to:'στο iniussu', g:'γεν. ενικ.', d:'consul, consulis (αρσ. γ΄) — ο ύπατος' },
        { l:'in certamen', k:'certamen', r:'Εμπρόθετος επιρρ. προσδ. του σκοπού', to:'στο ruit', g:'in (πρόθ. + αιτ.) + certamen (αιτ. ενικ., ουδ.)', d:'in — σε, προς· certamen, certaminis (ουδ. γ΄) — ο αγώνας' },
        { l:'ruit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'ruo, rui, rutum, ruere (3) — ορμώ', note:'Μτχ. μέλλ.: ruiturus.', a:';' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'fortior', r:'Επιρρηματικό κατηγορούμενο του τρόπου', to:'στο εννοούμενο adulescens', g:'ονομ. ενικ., αρσ. — συγκρ. επίθ. γ΄ κλ.', d:'fortior, -ior, -ius — γενναιότερος (συγκρ. του fortis, -is, -e)', a:',' },
        { l:'hoste', r:'Αφαιρετική (κυρίως) συγκριτική', to:'στο fortior', g:'αφαιρ. ενικ.', d:'hostis, -is (αρσ. & θηλ. γ΄) — ο εχθρός', note:'Β΄ όρος σύγκρισης (αφαιρετική συγκριτική).' },
        { l:'transfixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'transfigo, transfixi, transfixum, transfigere (3) — διαπερνώ', note:'Εννοούμενο υποκ.: adulescens.' },
        { l:'eum', r:'Αντικείμενο', to:'στο transfixit', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'hasta', r:'Αφαιρετική (οργανική) του οργάνου', to:'στο transfixit', g:'αφαιρ. ενικ.', d:'hasta, -ae (θηλ. α΄) — το δόρυ' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως. Εννοούνται: adulescens (υποκ.), eum (αντικ.).', kids:[
        { l:'spoliavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'spolio, spoliavi, spoliatum, spoliare (1) — απογυμνώνω', note:'Εννοούμενα: adulescens (υποκ.), eum (αντικ.).' },
        { l:'armis', r:'Αφαιρετική (κυρίως) του χωρισμού', to:'στο spoliavit', g:'αφαιρ. πληθ., ουδ.', d:'arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα', a:'.' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'Statim', r:'Επιρρ. προσδ. του χρόνου', to:'στο petiverunt', g:'χρονικό επίρρημα', d:'statim — αμέσως' },
        { l:'hostes', r:'Υποκείμενο', to:'στο petiverunt', g:'ονομ. πληθ.', d:'hostis, -is (αρσ. & θηλ. γ΄) — ο εχθρός' },
        { l:'fuga', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο petiverunt', g:'αφαιρ. ενικ.', d:'fuga, -ae (θηλ. α΄) — η φυγή' },
        { l:'salutem', r:'Αντικείμενο', to:'στο petiverunt', g:'αιτ. ενικ.', d:'salus, salutis (θηλ. γ΄) — η σωτηρία' },
        { l:'petiverunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ.', d:'peto, peti(v)i, petitum, petere (3) — ζητώ', a:'.' }
      ]}
    ]},

    { n: 7, kids: [
      { l:'Sed', r:'Σύνδεσμος', g:'αντιθετικός σύνδεσμος', d:'sed — αλλά', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσεως.', kids:[
        { l:'consul', r:'Υποκείμενο', to:'στο multavit', g:'ονομ. ενικ.', d:'consul, consulis (αρσ. γ΄) — ο ύπατος', a:',' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο multavit (πρότ. 14). Εισάγεται με τον ιστορικό/διηγηματικό cum· εκφέρεται με υποτακτική (η βαθύτερη σχέση κύριας–δευτ. πρότασης), συγκεκριμένα με υποτ. υπερσυντελίκου λόγω εξάρτησης από ιστορικό χρόνο, δηλώνει το προτερόχρονο στο παρελθόν.', kids:[
          { l:'cum', r:'Χρον. σύνδεσμος', g:'ιστορικός/διηγηματικός cum (+ υποτακτική)', d:'cum — όταν' },
          { l:'in castra', k:'castra', r:'Εμπρόθετος επιρρ. προσδ. της κίνησης σε τόπο', to:'στο revertisset', g:'in (πρόθ. + αιτ.) + castra (αιτ. πληθ., ουδ.)', d:'in — σε, προς· castra, -orum (ουδ. β΄) — το στρατόπεδο' },
          { l:'revertisset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. υπερσυντελίκου', d:'revertor, reverti / reversus sum, reverti (3, αποθ. & ημιαποθ.) — επιστρέφω', note:'Εννοούμενο υποκ.: consul.', a:',' }
        ]},
        { l:'adulescentem', r:'Αντικείμενο', to:'στο multavit', g:'αιτ. ενικ.', d:'adulescens, adulescentis (αρσ. γ΄) — ο νεαρός', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. επιθετική αναφορική πρόταση, προσδιοριστική στο adulescentem (πρότ. 14). Εισάγεται με την αναφορική αντωνυμία cuius· εκφέρεται με οριστική, γιατί δηλώνει το πραγματικό, συγκεκριμένα με οριστ. υπερσυντελίκου (πράξη συντελεσμένη στο παρελθόν πριν από κάποια άλλη).', kids:[
          { l:'cuius', r:'Γενική υποκειμενική', to:'στο opera', g:'γεν. ενικ., αρσ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'opera', r:'Αφαιρετική (οργανική) του μέσου', to:'στο fugati erant', g:'αφαιρ. ενικ.', d:'opera, -ae (θηλ. α΄) — το έργο, η ενέργεια, ο κόπος', note:'Στον πληθ.: operae, -arum = οι εργάτες, οι μισθωτοί.' },
          { l:'hostes', r:'Υποκείμενο', to:'στο fugati erant', g:'ονομ. πληθ.', d:'hostis, -is (αρσ. & θηλ. γ΄) — ο εχθρός' },
          { l:'fugati erant', r:'Ρήμα', g:'γ΄ πληθ. οριστ. υπερσυντελίκου παθ.', d:'fugo, fugavi, fugatum, fugare (1) — τρέπω σε φυγή', a:',' }
        ]},
        { l:'morte', r:'Αφαιρετική (οργανική) της ποινής', to:'στο multavit', g:'αφαιρ. ενικ.', d:'mors, mortis (θηλ. γ΄) — ο θάνατος', note:'Γεν. πληθ.: mortium.' },
        { l:'multavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ.', d:'multo, multavi, multatum, multare (1) — τιμωρώ', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Bello Latino", el:"Στη διάρκεια του Λατινικού πολέμου" },
    { la:"T. Manlius consul", el:"ο Τίτος Μάνλιος, ο ύπατος," },
    { la:"natus", el:"καταγόμενος" },
    { la:"nobili genere", el:"από αριστοκρατική γενιά," },
    { la:"praefuit", el:"είχε την αρχηγία" },
    { la:"exercitui Romanorum.", el:"του στρατού των Ρωμαίων." },
    { la:"Is cum aliquando", el:"Αυτός, όταν κάποτε" },
    { la:"abiret castris,", el:"έφευγε από το στρατόπεδο," },
    { la:"edixit", el:"διέταξε" },
    { la:"ut abstinerent omnes pugna.", el:"να απέχουν όλοι από τη μάχη." },
    { la:"Sed post paulo", el:"Αλλά μετά από λίγο" },
    { la:"filius eius", el:"ο γιος του" },
    { la:"praeterequitavit", el:"πέρασε έφιππος μπροστά" },
    { la:"castra", el:"από το στρατόπεδο" },
    { la:"hostium", el:"των εχθρών" },
    { la:"et a duce hostium", el:"και από τον αρχηγό των εχθρών" },
    { la:"his verbis lacessitus est", el:"με αυτά τα λόγια προκλήθηκε" },
    { la:"proelio:", el:"σε μάχη:" },
    { la:"«Congrediamur,", el:"«Ας μονομαχήσουμε," },
    { la:"ut cernatur", el:"για να κριθεί" },
    { la:"eventu singularis proelii,", el:"από την έκβαση της μονομαχίας," },
    { la:"quanto Latinus miles", el:"πόσο ο Λατίνος στρατιώτης" },
    { la:"antecellat Romano", el:"ξεπερνά τον Ρωμαίο (στρατιώτη)" },
    { la:"virtute».", el:"στην ανδρεία»." },
    { la:"Tum adulescens,", el:"Τότε ο νέος," },
    { la:"confisus", el:"επειδή είχε εμπιστοσύνη" },
    { la:"viribus suis", el:"στις δυνάμεις του" },
    { la:"et permotus", el:"και επειδή παρακινήθηκε" },
    { la:"cupiditate pugnandi,", el:"από την επιθυμία της μάχης," },
    { la:"iniussu consulis", el:"παρά τη διαταγή του υπάτου" },
    { la:"ruit in certamen;", el:"όρμησε στον αγώνα·" },
    { la:"et fortior hoste,", el:"και γενναιότερος από τον εχθρό," },
    { la:"transfixit eum hasta", el:"τον διαπέρασε με το δόρυ" },
    { la:"et spoliavit armis.", el:"και τον γύμνωσε από τα όπλα του." },
    { la:"Statim hostes", el:"Αμέσως οι εχθροί" },
    { la:"petiverunt salutem fuga.", el:"ζήτησαν τη σωτηρία στη φυγή." },
    { la:"Sed consul,", el:"Αλλά ο ύπατος," },
    { la:"cum revertisset in castra,", el:"όταν επέστρεψε στο στρατόπεδο," },
    { la:"adulescentem,", el:"τον νεαρό," },
    { la:"opera cuius", el:"με την πράξη του οποίου" },
    { la:"hostes fugati erant,", el:"είχαν τραπεί σε φυγή οι εχθροί," },
    { la:"multavit morte.", el:"τιμώρησε σε θάνατο." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"fuga, -ae" },
        { form:"hasta, -ae" },
        { form:"opera, -ae", note:"στον πληθ. operae, -arum = οι εργάτες" },
        { form:"pugna, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"filius, -ii / -i" },
        { form:"Romanus, -i" },
        { form:"Manlius, -ii / -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"arma, -orum", note:"δεν έχει ενικό" },
        { form:"castrum, -i", note:"ετερόσημο (πληθ. castra = στρατόπεδο)" },
        { form:"proelium, -ii / -i" },
        { form:"verbum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"adulescens, adulescentis" },
        { form:"consul, consulis" },
        { form:"dux, ducis" },
        { form:"hostis, hostis", note:"& θηλ." },
        { form:"miles, militis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"cupiditas, cupiditatis" },
        { form:"mors, mortis" },
        { form:"salus, salutis" },
        { form:"virtus, virtutis" },
        { form:"vis, —, —, vim", note:"ελλειπτικό" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"certamen, certaminis" },
        { form:"genus, generis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"eventus, -us" },
        { form:"exercitus, -us" },
        { form:"iniussus, -us" }
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
      { form:"fortis, -is, -e" },
      { form:"nobilis, -is, -e" },
      { form:"omnis, -is, -e" },
      { form:"singularis, -is, -e" }
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
      { pos:"fortis, -is, -e", comp:"fortior, -ior, -ius", sup:"fortissimus, -a, -um" },
      { pos:"nobilis, -is, -e", comp:"nobilior, -ior, -ius", sup:"nobilissimus, -a, -um" },
      { pos:"omnis, -is, -e", comp:"—", sup:"—" },
      { pos:"singularis, -is, -e", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"quantus, -a, -um", kind:"Ερωτηματική", extra:"" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ένας κτήτορας" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"fugo", perf:"fugavi", sup:"fugatum", inf:"fugare", note:"" },
      { pres:"multo", perf:"multavi", sup:"multatum", inf:"multare", note:"" },
      { pres:"praeterequito", perf:"praeterequitavi", sup:"praeterequitatum", inf:"praeterequitare", note:"" },
      { pres:"pugno", perf:"pugnavi", sup:"pugnatum", inf:"pugnare", note:"" },
      { pres:"spolio", perf:"spoliavi", sup:"spoliatum", inf:"spoliare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"abstineo", perf:"abstinui", sup:"abstentum", inf:"abstinere", note:"" },
      { pres:"permoveo", perf:"permovi", sup:"permotum", inf:"permovere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"antecello", perf:"—", sup:"—", inf:"antecellere", note:"ελλειπτικό" },
      { pres:"cerno", perf:"crevi", sup:"cretum", inf:"cernere", note:"μτχ. παρακ. conspectus (από conspicio)" },
      { pres:"edico", perf:"edixi", sup:"edictum", inf:"edicere", note:"β΄ ενικ. προστ. ενεστ.: edic" },
      { pres:"lacesso", perf:"lacessivi", sup:"lacessitum", inf:"lacessere", note:"" },
      { pres:"peto", perf:"peti(v)i", sup:"petitum", inf:"petere", note:"" },
      { pres:"ruo", perf:"rui", sup:"rutum", inf:"ruere", note:"μτχ. μέλλ. ruiturus" },
      { pres:"transfigo", perf:"transfixi", sup:"transfixum", inf:"transfigere", note:"" },
      { pres:"congredior", perf:"congressus sum", sup:"—", inf:"congredi", note:"αποθετικό (15 σε -io)" },
      { pres:"nascor", perf:"natus sum", sup:"—", inf:"nasci", note:"αποθετικό (μτχ. μέλλ. nasciturus)" },
      { pres:"confido", perf:"confisus sum", sup:"—", inf:"confidere", note:"ημιαποθετικό" },
      { pres:"revertor", perf:"reversus sum / reverti", sup:"—", inf:"reverti", note:"αποθ. & ημιαποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"abeo", perf:"abi(v)i", sup:"abitum", inf:"abire", note:"ανώμαλο (σύνθ. του eo)" },
      { pres:"praesum", perf:"praefui", sup:"—", inf:"praeesse", note:"σύνθετο του sum" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ ────────────────────────────────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"Ιστορικός / διηγηματικός cum", body:"Στις προτάσεις «cum aliquando castris abiret» και «cum in castra revertisset» ο cum είναι ιστορικός/διηγηματικός· γι' αυτό εκφέρεται με υποτακτική (παρατατικού για το σύγχρονο, υπερσυντελίκου για το προτερόχρονο), υπογραμμίζοντας τη βαθύτερη, αιτιώδη σχέση κύριας και δευτερεύουσας." },
    { tag:"Ακολουθία χρόνων", title:"Ιδιομορφία (βουλητική & τελική)", body:"Στη βουλητική «ut… abstinerent» και στην τελική «ut… cernatur» υπάρχει ιδιομορφία στην ακολουθία των χρόνων: η βούληση/ο σκοπός είναι ιδωμένα τη στιγμή που εμφανίζονται στο μυαλό του ομιλητή (συγχρονισμός της κύριας με τη δευτ. πρόταση) και όχι τη στιγμή της πιθανής πραγματοποίησής τους." },
    { tag:"Ουσιαστικό", title:"castra: ετερόσημο", body:"castra, -orum (ουδ. β΄, πληθ.) = το στρατόπεδο· στον ενικό castrum, -i = το φρούριο. Ετερόσημο ουσιαστικό." },
    { tag:"Ουσιαστικό", title:"vis: ελλειπτικό", body:"Το vis (θηλ. γ΄) είναι ελλειπτικό: ενικ. vis, —, —, vim, vi· πληθ. vires, virium, viribus, vires (& viris), vires, viribus. Το viribus εδώ = δυνάμεις." },
    { tag:"Προσδιορισμός", title:"fortior hoste", body:"Το fortior είναι επιρρηματικό κατηγορούμενο του τρόπου στο εννοούμενο υποκ. adulescens, ενώ το hoste είναι αφαιρετική (κυρίως) συγκριτική, δηλαδή ο β΄ όρος σύγκρισης." },
    { tag:"Σύνταξη", title:"Ρήματα με δοτική & iniussu", body:"Το praesum (praefuit exercitui) και το antecello (antecellat Romano/militi) συντάσσονται με δοτική. Το iniussu + γενική υποκειμενική (consulis) αποδίδεται «παρά τη διαταγή (κάποιου)» και λειτουργεί ως αφαιρετική του εσωτερικού αναγκαστικού αιτίου." }
  ]
};

export default UNIT;
