export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 33,
  title: "Καιρός για ανασυγκρότηση",
  latinTitle: "Lectio XXXIII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Omnia", r:"Υποκείμενο", to:"στο excitanda sunt", g:"ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"omnis, -is, -e — όλος· (ουδ. πληθ.) omnia = τα πάντα" },
        { l:"sunt", r:"Ρήμα (βοηθητικό)", to:"στην περίφραση excitanda sunt", g:"γ΄ πληθ. οριστ. ενεστ. — ανώμαλο", d:"sum, fui, esse — είμαι" },
        { l:"excitanda", r:"Ρήμα (παθ. περιφραστική)", to:"με υποκ. Omnia", g:"γερουνδιακό, ονομ. πληθ. ουδ. — παθ. περιφραστική συζυγία", d:"excito, -avi, -atum, -are (1) — ξεσηκώνω· ανασυγκροτώ", note:"Παθητική περιφραστική συζυγία (δηλώνει το δέον)· το ποιητικό αίτιο σε δοτική (tibi)." },
        { l:"tibi", r:"Δοτική προσωπική του ποιητικού αιτίου", to:"στο excitanda sunt", g:"δοτ. ενικ. β΄ προσ. — προσωπική αντωνυμία", d:"tu — εσύ" },
        { l:"uni", r:"Επιθετικός/κατηγορηματικός προσδ.", to:"στο tibi", g:"δοτ. ενικ. — αντωνυμικό επίθ. (γεν. unius, δοτ. uni)", d:"unus, -a, -um — ένας, μόνος", a:"," },
        { l:"C. Caesar", r:"Κλητική προσφώνηση", k:"Caesar", g:"κλητ. ενικ. (C. = Gaius, praenomen)", d:"Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο omnia· εκφέρεται με οριστική (sentis), δηλώνει πραγματικό γεγονός. Εμπεριέχει ειδικό απαρέμφατο (iacere) εξαρτώμενο από το sentis.", kids:[
          { l:"quae", r:"Υποκείμενο απαρεμφάτου", to:"στο iacere", g:"ονομ.-αιτ. πληθ., ουδ. — αναφορική αντων. (αναφέρεται στο omnia)", d:"qui, quae, quod — ο οποίος" },
          { l:"sentis", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. ενεργ.", d:"sentio, sensi, sensum, sentire (4) — αισθάνομαι, αντιλαμβάνομαι· εδώ: ξέρω" },
          { l:"iacere", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο sentis", g:"απαρέμφατο ενεστ. ενεργ.", d:"iaceo, iacui, — (iaciturus), iacere (2) — κείτομαι" },
          { l:"perculsa", r:"Κατηγορηματική μετοχή", to:"στο iacere (αναφέρεται στο quae)", g:"μετοχή παρακ. παθ., ονομ.-αιτ. πληθ. ουδ.", d:"percello, perculi, perculsum, percellere (3) — καταβάλλω, συγκλονίζω" },
          { l:"atque", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"atque — και" },
          { l:"prostrata", r:"Κατηγορηματική μετοχή", to:"στο iacere (αναφέρεται στο quae)", g:"μετοχή παρακ. παθ., ονομ.-αιτ. πληθ. ουδ.", d:"prosterno, prostravi, prostratum, prosternere (3) — ρίχνω κάτω, καταβάλλω" },
          { l:"impetu", r:"Αφαιρετική του ποιητικού αιτίου", to:"στα perculsa, prostrata", g:"αφαιρ. ενικ., αρσ. δ΄ κλ.", d:"impetus, -us (αρσ. δ΄) — η ορμή, η λαίλαπα" },
          { l:"ipsius", r:"Επιθετικός προσδ.", to:"στο belli", g:"γεν. ενικ., ουδ. — δεικτική (οριστική) αντων.", d:"ipse, ipsa, ipsum — ο ίδιος" },
          { l:"belli", r:"Γενική υποκειμενική", to:"στο impetu", g:"γεν. ενικ., ουδ.", d:"bellum, -i (ουδ. β΄) — ο πόλεμος", a:"," },
          { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική (παρενθετική/προσδιοριστική)· το quod αναφέρεται στο bellum (ή στο περιεχόμενο της προηγούμενης πρότασης)· εκφέρεται με οριστική.", kids:[
            { l:"quod", r:"Υποκείμενο", to:"στο fuit", g:"ονομ. ενικ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
            { l:"fuit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. — ανώμαλο", d:"sum, fui, esse — είμαι· εδώ: υπάρχω, είμαι" },
            { l:"necesse", r:"Κατηγορούμενο", to:"στο quod", g:"άκλιτο (επίθ./ουσ.)", d:"necesse — αναγκαίο, απαραίτητο", a:":" }
          ]}
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Παθητική περιφραστική συζυγία με εννοούμενο sunt.", kids:[
        { l:"constituenda", r:"Ρήμα (παθ. περιφραστική)", to:"με υποκ. iudicia", g:"γερουνδιακό, ονομ. πληθ. ουδ. (εννοείται sunt)", d:"constituo, constitui, constitutum, constituere (3) — οργανώνω, ιδρύω· αποκαθιστώ" },
        { l:"iudicia", r:"Υποκείμενο", to:"στο constituenda (sunt)", g:"ονομ. πληθ., ουδ.", d:"iudicium, -ii/-i (ουδ. β΄) — το δικαστήριο· η δικαιοσύνη", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Παθητική περιφραστική συζυγία με εννοούμενο est.", kids:[
        { l:"revocanda", r:"Ρήμα (παθ. περιφραστική)", to:"με υποκ. fides", g:"γερουνδιακό, ονομ. ενικ. θηλ. (εννοείται est)", d:"revoco, -avi, -atum, -are (1) — ανακαλώ· αποκαθιστώ" },
        { l:"fides", r:"Υποκείμενο", to:"στο revocanda (est)", g:"ονομ. ενικ., θηλ. ε΄ κλ.", d:"fides, -ei (θηλ. ε΄) — η πίστη· εδώ: η εμπορική πίστη", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Παθητική περιφραστική συζυγία με εννοούμενο sunt.", kids:[
        { l:"comprimendae", r:"Ρήμα (παθ. περιφραστική)", to:"με υποκ. libidines", g:"γερουνδιακό, ονομ. πληθ. θηλ. (εννοείται sunt)", d:"comprimo, compressi, compressum, comprimere (3) — καταπνίγω, χαλιναγωγώ" },
        { l:"libidines", r:"Υποκείμενο", to:"στο comprimendae (sunt)", g:"ονομ. πληθ., θηλ. γ΄ κλ.", d:"libido, libidinis (θηλ. γ΄) — το πάθος, η επιθυμία", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Παθητική περιφραστική συζυγία με εννοούμενο est.", kids:[
        { l:"propaganda", r:"Ρήμα (παθ. περιφραστική)", to:"με υποκ. suboles", g:"γερουνδιακό, ονομ. ενικ. θηλ. (εννοείται est)", d:"propago, -avi, -atum, -are (1) — επεκτείνω, αυξάνω" },
        { l:"suboles", r:"Υποκείμενο", to:"στο propaganda (est)", g:"ονομ. ενικ., θηλ. γ΄ κλ.", d:"suboles, -is (θηλ. γ΄) — η γενιά, ο απόγονος· εδώ: ο πληθυσμός", a:";" }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"omnia", r:"Υποκείμενο", to:"στο vincienda sunt", g:"ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"omnis, -is, -e — όλος· (ουδ. πληθ.) όλα" },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο omnia· εκφέρεται με οριστική (πραγματικό γεγονός).", kids:[
          { l:"quae", r:"Υποκείμενο", to:"στο diffluxerunt", g:"ονομ. πληθ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
          { l:"iam", r:"Επιρρ. προσδ. του χρόνου", to:"στο diffluxerunt", g:"χρονικό επίρρημα", d:"iam — ήδη, πια" },
          { l:"diffluxerunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακ. ενεργ.", d:"diffluo, diffluxi, —, diffluere (3) — διαρρέω, διαλύομαι· εδώ: καταλύομαι" },
          { l:"dilapsa", r:"Επιρρ. κατηγορηματική μετοχή (χρονική)", to:"στο diffluxerunt (αναφέρεται στο quae)", g:"μετοχή παρακ. αποθ., ονομ. πληθ. ουδ.", d:"dilabor, dilapsus sum, dilabi (αποθ. 3) — διαλύομαι, καταρρέω", note:"Χρονική μετοχή (προτερόχρονο): «αφού κατέρρευσαν».", a:"," }
        ]},
        { l:"vincienda", r:"Ρήμα (παθ. περιφραστική)", to:"με υποκ. omnia", g:"γερουνδιακό, ονομ. πληθ. ουδ.", d:"vincio, vinxi, vinctum, vincire (4) — δένω· εδώ: στερεώνω", note:"Παθητική περιφραστική συζυγία· εννοείται δοτ. ποιητικού αιτίου (tibi)." },
        { l:"sunt", r:"Ρήμα (βοηθητικό)", to:"στην περίφραση vincienda sunt", g:"γ΄ πληθ. οριστ. ενεστ. — ανώμαλο", d:"sum, fui, esse — είμαι" },
        { l:"severis", r:"Επιθετικός προσδ.", to:"στο legibus", g:"αφαιρ. πληθ., θηλ. — επίθ. β΄ κλ.", d:"severus, -a, -um — αυστηρός" },
        { l:"legibus", r:"Αφαιρετική του οργάνου (μέσου)", to:"στο vincienda sunt", g:"αφαιρ. πληθ., θηλ. γ΄ κλ.", d:"lex, legis (θηλ. γ΄) — ο νόμος", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"In tanto civili bello", k:"bellum", r:"Εμπρόθετος επιρρ. προσδ. του χρόνου (κατάστασης)", to:"στο perdidit", g:"in (πρόθ. + αφαιρ.) + tanto, civili (επιθ. προσδ.) + bello (αφαιρ. ενικ., ουδ.)", d:"in — σε, κατά τη διάρκεια· tantus, -a, -um — τόσο μεγάλος· civilis, -is, -e — εμφύλιος· bellum, -i (ουδ. β΄) — ο πόλεμος", a:"," },
        { l:"in tanto ardore", k:"ardor", r:"Εμπρόθετος επιρρ. προσδ. του χρόνου (κατάστασης)", to:"στο perdidit", g:"in (πρόθ. + αφαιρ.) + tanto (επιθ. προσδ.) + ardore (αφαιρ. ενικ., αρσ.)", d:"in — σε· tantus, -a, -um — τόσο μεγάλος· ardor, ardoris (αρσ. γ΄) — η φλόγα, το πάθος" },
        { l:"animorum", r:"Γενική αντικειμενική", to:"στο ardore", g:"γεν. πληθ., αρσ. β΄ κλ.", d:"animus, -i (αρσ. β΄) — η ψυχή, το πνεύμα" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"armorum", r:"Γενική αντικειμενική", to:"στο ardore", g:"γεν. πληθ., ουδ. β΄ κλ.", d:"arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα", a:"," },
        { l:"quassata", r:"Επιθετικός προσδ. (μτχ.)", to:"στο res publica", g:"μετοχή παρακ. παθ., ονομ. ενικ. θηλ.", d:"quasso, -avi, -atum, -are (1) — συγκλονίζω, ρημάζω" },
        { l:"res publica", r:"Υποκείμενο", to:"στο perdidit", g:"ονομ. ενικ., θηλ. (res, ε΄ κλ. + publicus, -a, -um)", d:"res publica, rei publicae (θηλ.) — η πολιτεία, το κράτος" },
        { l:"multa", r:"Αντικείμενο", to:"στο perdidit", g:"αιτ. πληθ., ουδ. — επίθ. β΄ κλ. (ουσιαστικοπ.)", d:"multus, -a, -um — πολύς· (ουδ. πληθ.) πολλά" },
        { l:"perdidit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ.", d:"perdo, perdidi, perditum, perdere (3) — χάνω, καταστρέφω" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος (et… et: και… και)", d:"et — και" },
        { l:"ornamenta", r:"Επεξήγηση", to:"στο multa", g:"αιτ. πληθ., ουδ.", d:"ornamentum, -i (ουδ. β΄) — το στολίδι, το διακριτικό" },
        { l:"dignitatis", r:"Γενική αντικειμενική (κτητική)", to:"στο ornamenta", g:"γεν. ενικ., θηλ. γ΄ κλ.", d:"dignitas, dignitatis (θηλ. γ΄) — η αξιοπρέπεια, το κύρος" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"praesidia", r:"Επεξήγηση", to:"στο multa", g:"αιτ. πληθ., ουδ.", d:"praesidium, -ii/-i (ουδ. β΄) — η προστασία, το στήριγμα" },
        { l:"stabilitatis", r:"Γενική αντικειμενική (κτητική)", to:"στο praesidia", g:"γεν. ενικ., θηλ. γ΄ κλ.", d:"stabilitas, stabilitatis (θηλ. γ΄) — η σταθερότητα" },
        { l:"suae", r:"Κτητική αντωνυμία (επιθ. προσδ.)", to:"στο stabilitatis", g:"γεν. ενικ., θηλ. — κτητική αντων. γ΄ προσ.", d:"suus, sua, suum — δικός του/της", a:";" }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"uterque", r:"Επιθετικός προσδ.", to:"στο dux", g:"ονομ. ενικ., αρσ. — αντωνυμικό επίθ. / αόριστη (επιμεριστική) αντων.", d:"uterque, utraque, utrumque — και ο ένας και ο άλλος, καθένας από τους δύο" },
        { l:"dux", r:"Υποκείμενο", to:"στο fecit", g:"ονομ. ενικ., αρσ. γ΄ κλ.", d:"dux, ducis (αρσ. γ΄) — ο αρχηγός, ο στρατηγός" },
        { l:"fecit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ.", d:"facio, feci, factum, facere (3, 15 σε -io) — κάνω" },
        { l:"multaque", r:"Αντικείμενο", to:"στο fecit", g:"αιτ. πληθ., ουδ. — επίθ. β΄ κλ. (ουσιαστικοπ.) (+ εγκλιτικό -que)", d:"multus, -a, -um — πολύς· (ουδ. πληθ.) πολλά· -que (συμπλεκτικός σύνδεσμος) — και", note:"Το εγκλιτικό -que συνδέει παρατακτικά την κύρια αυτή με την προηγούμενη περίοδο." },
        { l:"armatus", r:"Επιρρ. κατηγορούμενο του χρόνου (μτχ.)", to:"στο dux (μέσω του fecit)", g:"μετοχή παρακ. παθ., ονομ. ενικ. αρσ.", d:"armo, -avi, -atum, -are (1) — οπλίζω", note:"Επιρρηματικό κατηγορούμενο: «όταν ήταν οπλισμένος», δηλ. ως στρατιωτικός / σε καιρό πολέμου.", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο multa· εκφέρεται με υποτακτική υπερσυντελίκου (prohibuisset) και έχει υποθετική/δυνητική χροιά — δηλώνει το μη πραγματικό στο παρελθόν (απόδοση λανθάνοντος υποθετικού λόγου).", kids:[
          { l:"quae", r:"Υποκείμενο απαρεμφάτου", to:"στο fieri", g:"ονομ.-αιτ. πληθ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
          { l:"idem", r:"Υποκείμενο", to:"στο prohibuisset", g:"ονομ. ενικ., αρσ. — οριστική (επαναληπτική) αντων.", d:"idem, eadem, idem — ο ίδιος" },
          { l:"prohibuisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσυντ. ενεργ.", d:"prohibeo, prohibui, prohibitum, prohibere (2) — εμποδίζω" },
          { l:"fieri", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο prohibuisset", g:"απαρέμφατο ενεστ. — ανώμαλο (παθ. του facio)", d:"fio, factus sum, fieri — γίνομαι" },
          { l:"togatus", r:"Επιρρ. κατηγορούμενο του χρόνου", to:"στο idem", g:"ονομ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"togatus, -a, -um — ντυμένος με την τήβεννο· (ως) πολίτης", note:"Επιρρηματικό κατηγορούμενο: «όταν φορούσε την τήβεννο», δηλ. ως πολίτης / σε καιρό ειρήνης.", a:"." }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { l:"Quare", r:"Συμπερασματικός (μεταβατικός) σύνδεσμος", g:"συμπερασματικό επίρρημα / σύνδεσμος", d:"quare — γι' αυτό, επομένως", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Απρόσωπη παθητική περιφραστική από αμετάβατο ρήμα (χωρίς υποκείμενο).", kids:[
        { l:"subveniendum", r:"Ρήμα (απρόσωπη παθ. περιφραστική)", to:"με αντικ. reipublicae", g:"γερουνδιακό, ονομ. ενικ. ουδ. — απρόσωπη σύνταξη", d:"subvenio, subveni, subventum, subvenire (4) — βοηθώ, έρχομαι σε βοήθεια (+ δοτ.)", note:"Το subvenio είναι αμετάβατο (+ δοτ.), γι' αυτό η παθ. περιφραστική είναι απρόσωπη (χωρίς υποκείμενο)." },
        { l:"reipublicae", r:"Αντικείμενο", to:"στο subveniendum est", g:"δοτ. ενικ., θηλ.", d:"res publica, rei publicae — η πολιτεία, το κράτος" },
        { l:"est", r:"Ρήμα (βοηθητικό)", to:"στην περίφραση subveniendum est", g:"γ΄ ενικ. οριστ. ενεστ. — ανώμαλο", d:"sum, fui, esse — είμαι" }
      ]}
    ]},

    { n: 7, kids: [
      { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"sananda", r:"Ρήμα (παθ. περιφραστική)", to:"με υποκ. vulnera", g:"γερουνδιακό, ονομ. πληθ. ουδ.", d:"sano, -avi, -atum, -are (1) — θεραπεύω, γιατρεύω" },
        { l:"sunt", r:"Ρήμα (βοηθητικό)", to:"στην περίφραση sananda sunt", g:"γ΄ πληθ. οριστ. ενεστ. — ανώμαλο", d:"sum, fui, esse — είμαι" },
        { l:"tibi", r:"Δοτική προσωπική του ποιητικού αιτίου", to:"στο sananda sunt", g:"δοτ. ενικ. β΄ προσ. — προσωπική αντων.", d:"tu — εσύ" },
        { l:"nunc", r:"Επιρρ. προσδ. του χρόνου", to:"στο sananda sunt", g:"χρονικό επίρρημα", d:"nunc — τώρα" },
        { l:"omnia", r:"Επιθετικός προσδ.", to:"στο vulnera", g:"ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"omnis, -is, -e — όλος" },
        { l:"vulnera", r:"Υποκείμενο", to:"στο sananda sunt", g:"ονομ. πληθ., ουδ. γ΄ κλ.", d:"vulnus, vulneris (ουδ. γ΄) — η πληγή" },
        { l:"belli", r:"Γενική αντικειμενική", to:"στο vulnera", g:"γεν. ενικ., ουδ.", d:"bellum, -i (ουδ. β΄) — ο πόλεμος", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο vulnera· εκφέρεται με οριστική (πραγματικό γεγονός).", kids:[
          { l:"quibus", r:"Αντικείμενο", to:"στο mederi", g:"δοτ. πληθ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος", note:"Το mederi (medeor) συντάσσεται με δοτική → quibus = δοτ. αντικείμενο." },
          { l:"nemo", r:"Υποκείμενο", to:"στο potest", g:"ονομ. ενικ. — αόριστη αντων.", d:"nemo, neminis — κανένας" },
          { l:"praeter te", k:"tu", r:"Εμπρόθετος επιρρ. προσδ. της εξαίρεσης", to:"στο potest (mederi)", g:"praeter (πρόθ. + αιτ.) + te (αιτ. ενικ.)", d:"praeter — εκτός από· tu — εσύ" },
          { l:"potest", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. — ανώμαλο", d:"possum, potui, posse — μπορώ" },
          { l:"mederi", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο potest", g:"απαρέμφατο ενεστ. — αποθετικό (medeor, 2)", d:"medeor, —, mederi (αποθ. 2) — θεραπεύω, γιατρεύω (+ δοτ.)", a:"." }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Omnia sunt excitanda", el:"Τα πάντα πρέπει να ανασυγκροτηθούν" },
    { la:"tibi uni, C. Caesar,", el:"από σένα μόνο, Γάιε Καίσαρα," },
    { la:"quae sentis iacere", el:"όσα ξέρεις ότι κείτονται" },
    { la:"perculsa atque prostrata", el:"αναποδογυρισμένα και ριγμένα κάτω" },
    { la:"impetu ipsius belli,", el:"από τη λαίλαπα αυτού του ίδιου πολέμου," },
    { la:"quod fuit necesse:", el:"που υπήρξε αναγκαίος·" },
    { la:"constituenda iudicia,", el:"πρέπει να αναδιοργανωθεί η δικαιοσύνη," },
    { la:"revocanda fides,", el:"πρέπει να αποκατασταθεί η εμπορική πίστη," },
    { la:"comprimendae libidines,", el:"πρέπει να χαλιναγωγηθούν τα πάθη," },
    { la:"propaganda suboles;", el:"πρέπει να επιδιωχθεί η αύξηση του πληθυσμού·" },
    { la:"omnia quae iam diffluxerunt dilapsa,", el:"όλα όσα ήδη έχουν καταλυθεί, αφού κατέρρευσαν," },
    { la:"vincienda sunt severis legibus.", el:"πρέπει να στερεωθούν με αυστηρούς νόμους." },
    { la:"In tanto civili bello,", el:"Σε (έναν) τόσο μεγάλο εμφύλιο πόλεμο," },
    { la:"in tanto ardore", el:"σε (ένα) τόσο μεγάλο πάθος" },
    { la:"animorum et armorum,", el:"των ψυχών και των όπλων," },
    { la:"quassata res publica multa perdidit", el:"η ρημαγμένη πολιτεία έχασε πολλά" },
    { la:"et ornamenta dignitatis", el:"και διακριτικά του κύρους (της)" },
    { la:"et praesidia stabilitatis suae;", el:"και στηρίγματα της σταθερότητάς της·" },
    { la:"uterque dux", el:"και ο ένας και ο άλλος αρχηγός" },
    { la:"fecit multaque armatus,", el:"έκανε πολλά στον πόλεμο," },
    { la:"quae idem prohibuisset fieri", el:"τα οποία ο ίδιος θα είχε εμποδίσει να γίνουν" },
    { la:"togatus.", el:"σε καιρό ειρήνης." },
    { la:"Quare subveniendum reipublicae est", el:"Επομένως, πρέπει να βοηθήσεις την πολιτεία" },
    { la:"et sananda sunt tibi nunc", el:"και πρέπει να θεραπευτούν από σένα τώρα" },
    { la:"omnia vulnera belli,", el:"όλες οι πληγές του πολέμου," },
    { la:"quibus nemo praeter te potest mederi.", el:"τις οποίες κανείς εκτός από σένα δεν μπορεί να γιατρέψει." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"animus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"arma, -orum", note:"μόνο πληθ." },
        { form:"bellum, -i" },
        { form:"iudicium, -ii / -i" },
        { form:"ornamentum, -i" },
        { form:"praesidium, -ii / -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"ardor, ardoris" },
        { form:"Caesar, Caesaris", note:"μόνο ενικ." },
        { form:"dux, ducis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"dignitas, dignitatis" },
        { form:"lex, legis" },
        { form:"libido, libidinis" },
        { form:"stabilitas, stabilitatis" },
        { form:"suboles, -is", note:"μόνο ενικ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"vulnus, vulneris" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"impetus, -us" } ] }
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"fides, -ei", note:"μόνο ενικ." },
        { form:"res publica, rei publicae", note:"κλίνονται και τα δύο συνθετικά" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"multus, -a, -um" },
      { form:"severus, -a, -um" },
      { form:"tantus, -a, -um" },
      { form:"togatus, -a, -um" },
      { form:"unus, -a, -um", note:"αντωνυμικό (γεν. unius, δοτ. uni)" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"civilis, -is, -e" },
      { form:"omnis, -is, -e" }
    ]},
    { kl:"Άκλιτα", items:[
      { form:"necesse", note:"άκλιτο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"multus, -a, -um", comp:"plus (πληθ. plures, -a)", sup:"plurimus, -a, -um", note:"ανώμαλα παραθετικά" },
      { pos:"severus, -a, -um", comp:"severior, -ior, -ius", sup:"severissimus, -a, -um" },
      { pos:"tantus, -a, -um", comp:"—", sup:"—" },
      { pos:"togatus, -a, -um", comp:"—", sup:"—" },
      { pos:"unus, -a, -um", comp:"—", sup:"—", note:"αντωνυμικό" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"civilis, -is, -e", comp:"—", sup:"—", note:"magis civilis" },
      { pos:"omnis, -is, -e", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"tu (tui, tibi, te)", kind:"Προσωπική", extra:"β΄ προσ." },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική", extra:"ως οριστική" },
    { form:"idem, eadem, idem", kind:"Οριστική", extra:"ως επαναληπτική" },
    { form:"uterque, utraque, utrumque", kind:"Αόριστη", extra:"επιμεριστική (αντωνυμικό επίθ.)" },
    { form:"nemo, neminis", kind:"Αόριστη", extra:"κανένας" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ." }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"armo", perf:"armavi", sup:"armatum", inf:"armare", note:"" },
      { pres:"excito", perf:"excitavi", sup:"excitatum", inf:"excitare", note:"" },
      { pres:"propago", perf:"propagavi", sup:"propagatum", inf:"propagare", note:"" },
      { pres:"quasso", perf:"quassavi", sup:"quassatum", inf:"quassare", note:"θαμιστικό του quatio" },
      { pres:"revoco", perf:"revocavi", sup:"revocatum", inf:"revocare", note:"" },
      { pres:"sano", perf:"sanavi", sup:"sanatum", inf:"sanare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"iaceo", perf:"iacui", sup:"— (μτχ. μέλλ. iaciturus)", inf:"iacere", note:"χωρίς σουπίνο" },
      { pres:"medeor", perf:"—", sup:"—", inf:"mederi", note:"αποθετικό· χωρίς παρακ. & σουπίνο" },
      { pres:"prohibeo", perf:"prohibui", sup:"prohibitum", inf:"prohibere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"comprimo", perf:"compressi", sup:"compressum", inf:"comprimere", note:"" },
      { pres:"constituo", perf:"constitui", sup:"constitutum", inf:"constituere", note:"" },
      { pres:"diffluo", perf:"diffluxi", sup:"—", inf:"diffluere", note:"χωρίς σουπίνο" },
      { pres:"dilabor", perf:"dilapsus sum", sup:"—", inf:"dilabi", note:"αποθετικό" },
      { pres:"facio", perf:"feci", sup:"factum", inf:"facere", note:"15 σε -io" },
      { pres:"percello", perf:"perculi", sup:"perculsum", inf:"percellere", note:"" },
      { pres:"perdo", perf:"perdidi", sup:"perditum", inf:"perdere", note:"" },
      { pres:"prosterno", perf:"prostravi", sup:"prostratum", inf:"prosternere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"sentio", perf:"sensi", sup:"sensum", inf:"sentire", note:"" },
      { pres:"subvenio", perf:"subveni", sup:"subventum", inf:"subvenire", note:"" },
      { pres:"vincio", perf:"vinxi", sup:"vinctum", inf:"vincire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"παθ. του facio" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"Παθητική περιφραστική συζυγία", body:"Οι τύποι sunt excitanda, vincienda sunt, sananda sunt, constituenda, revocanda, comprimendae, propaganda δηλώνουν το δέον («πρέπει να…»). Το ποιητικό αίτιο μπαίνει σε δοτική (tibi = δοτ. προσωπική του ποιητικού αιτίου)." },
    { tag:"Σύνταξη", title:"subveniendum est: απρόσωπη", body:"Το subvenio είναι αμετάβατο (συντάσσεται με δοτική)· γι' αυτό η παθητική περιφραστική «subveniendum est» είναι απρόσωπη, χωρίς υποκείμενο, με reipublicae = αντικείμενο σε δοτική." },
    { tag:"Ρήμα", title:"medeor / mederi + δοτική", body:"Το mederi είναι απαρέμφατο του αποθετικού medeor (2ης συζ.), που συντάσσεται με δοτική· γι' αυτό το quibus είναι δοτική-αντικείμενο (και όχι εμπρόθετος)." },
    { tag:"Προσδιορισμός", title:"armatus / togatus: επιρρ. κατηγορούμενα", body:"Τα armatus και togatus δεν είναι απλοί επιθετικοί προσδιορισμοί, αλλά επιρρηματικά κατηγορούμενα του χρόνου/κατάστασης: «όταν ήταν οπλισμένος» (σε καιρό πολέμου) — «όταν φορούσε την τήβεννο» (σε καιρό ειρήνης)." },
    { tag:"Δευτερεύουσα", title:"quae … prohibuisset", body:"Η αναφορική «quae idem prohibuisset fieri togatus» εκφέρεται με υποτακτική υπερσυντελίκου και έχει υποθετική/δυνητική χροιά (μη πραγματικό στο παρελθόν)· το fieri είναι τελικό απαρέμφατο-αντικείμενο και το quae υποκείμενό του." },
    { tag:"Ουσιαστικό", title:"res publica: κλίση", body:"Στο res publica κλίνονται και τα δύο συνθετικά (res, ε΄ κλ. + publica, επίθ.)· δοτ. rei publicae (reipublicae)." }
  ]
};

export default UNIT;
