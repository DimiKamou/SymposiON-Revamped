// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 33
//  «Καιρός για ανασυγκρότηση» (Lectio XXXIII)
// ============================================================================

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
        { l:"Omnia", r:"Υποκείμενο", to:"στο sunt excitanda", g:"ονομ. πληθ., ουδ. — επίθ. omnis (ουσιαστικοπ.)", d:"omnis, -is, -e — όλος, καθένας· (ουσιαστικοπ.) τα πάντα" },
        { l:"sunt excitanda", r:"Ρήμα", g:"γ΄ πληθ., παθ. περιφραστική συζυγία (γερουνδιακό excitanda + sum) — δηλώνει το δέον/αναγκαίο", d:"excito, excitavi, excitatum, excitare (1) — ανασυγκροτώ, ανορθώνω, ξανασηκώνω" },
        { l:"tibi", r:"Δοτική προσωπική του ποιητικού αιτίου", to:"στο sunt excitanda", g:"δοτ. ενικ. β΄ προσ. — προσωπική αντωνυμία", d:"tu — εσύ", note:"Δοτική του ενεργούντος προσώπου (ποιητικό αίτιο) στην παθ. περιφραστική συζυγία." },
        { l:"uni", r:"Επιθετικός (κατηγορηματικός) προσδ.", to:"στο tibi", g:"δοτ. ενικ. — αριθμ./αντωνυμικό επίθ. unus (γεν. -ius, δοτ. -i)", d:"unus, -a, -um — ένας, μόνος" },
        { l:"C. Caesar", r:"Κλητική προσφώνηση", g:"κλητ. ενικ. (Gaius Caesar)", d:"Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική πρόταση, προσδιορίζει το Omnia. Εισάγεται με την αναφ. αντων. quae και εκφέρεται με οριστική (sentis), γιατί δηλώνει κάτι το πραγματικό.", kids:[
          { l:"quae", r:"Υποκείμενο απαρεμφάτου", to:"στο iacere", g:"ονομ. πληθ., ουδ. — αναφορική αντωνυμία (αναφορά στο Omnia)", d:"qui, quae, quod — ο οποίος" },
          { l:"iacere", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο sentis", g:"απαρέμφατο ενεστ. ενεργ.", d:"iaceo, iacui, —, iacere (2) — κείμαι, είμαι πεσμένος", note:"Αντικείμενο του sentis· υποκείμενό του το quae (ετεροπροσωπία)." },
          { l:"sentis", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. ενεργ.", d:"sentio, sensi, sensum, sentire (4) — αισθάνομαι, αντιλαμβάνομαι, γνωρίζω", note:"Εννοούμενο υποκείμενο: tu." },
          { l:"perculsa", r:"Επιρρ. κατηγορούμενο (κατηγορηματική μτχ.)", to:"στο quae (μέσω του iacere)", g:"ονομ. πληθ., ουδ. — μτχ. παρακ. παθ. φωνής", d:"percello, perculi, perculsum, percellere (3) — καταρρίπτω, συγκλονίζω, ανατρέπω" },
          { l:"atque", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"atque — και" },
          { l:"prostrata", r:"Επιρρ. κατηγορούμενο (κατηγορηματική μτχ.)", to:"στο quae (μέσω του iacere)", g:"ονομ. πληθ., ουδ. — μτχ. παρακ. παθ. φωνής", d:"prosterno, prostravi, prostratum, prosternere (3) — ρίχνω κάτω, καταβάλλω" },
          { l:"impetu", r:"Αφαιρετική του οργάνου (της αιτίας)", to:"στα perculsa, prostrata", g:"αφαιρ. ενικ.", d:"impetus, -us (αρσ. δ΄) — η ορμή, η λαίλαπα, η επίθεση" },
          { l:"belli", r:"Γενική υποκειμενική", to:"στο impetu", g:"γεν. ενικ., ουδ.", d:"bellum, -i (ουδ. β΄) — ο πόλεμος" },
          { l:"ipsius", r:"Επιθετικός (κατηγορηματικός) προσδ.", to:"στο belli", g:"γεν. ενικ., ουδ. — οριστική (δεικτική) αντωνυμία", d:"ipse, ipsa, ipsum — ο ίδιος", a:"," }
        ]},
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική πρόταση· η αναφ. αντων. quod (ουδ.) αναφέρεται στο περιεχόμενο των προηγουμένων. Εκφέρεται με οριστική — πραγματικό.", kids:[
          { l:"quod", r:"Υποκείμενο", to:"στο fuit", g:"ονομ. ενικ., ουδ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος", note:"Αναφέρεται στο περιεχόμενο των προηγουμένων." },
          { l:"fuit", r:"Ρήμα (συνδετικό)", g:"γ΄ ενικ. οριστ. παρακειμένου", d:"sum, fui, —, esse — είμαι, υπάρχω" },
          { l:"necesse", r:"Κατηγορούμενο", to:"στο quod", g:"άκλιτο επίθετο (ουδ.)", d:"necesse — αναγκαίο, απαραίτητο", a:";" }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Εννοείται το ρήμα sunt (constituenda sunt).", kids:[
        { l:"constituenda", r:"Ρήμα", g:"ονομ. πληθ., ουδ. — γερουνδιακό (παθ. περιφραστική με εννοούμενο sunt)", d:"constituo, constitui, constitutum, constituere (3) — οργανώνω, εγκαθιδρύω, αποκαθιστώ", note:"Εννοείται το sunt." },
        { l:"iudicia", r:"Υποκείμενο", to:"στο constituenda (sunt)", g:"ονομ. πληθ., ουδ.", d:"iudicium, -ii/-i (ουδ. β΄) — η δίκη, το δικαστήριο· (πληθ.) η δικαιοσύνη", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Παρατακτικά (ασύνδετο σχήμα)· εννοείται το ρήμα est.", kids:[
        { l:"revocanda", r:"Ρήμα", g:"ονομ. ενικ., θηλ. — γερουνδιακό (παθ. περιφραστική με εννοούμενο est)", d:"revoco, revocavi, revocatum, revocare (1) — ανακαλώ, επαναφέρω, αποκαθιστώ", note:"Εννοείται το est." },
        { l:"fides", r:"Υποκείμενο", to:"στο revocanda (est)", g:"ονομ. ενικ.", d:"fides, -ei (θηλ. ε΄) — η πίστη· εδώ: η εμπορική πίστη, η φερεγγυότητα", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Παρατακτικά (ασύνδετο σχήμα)· εννοείται το ρήμα sunt.", kids:[
        { l:"comprimendae", r:"Ρήμα", g:"ονομ. πληθ., θηλ. — γερουνδιακό (παθ. περιφραστική με εννοούμενο sunt)", d:"comprimo, compressi, compressum, comprimere (3) — συγκρατώ, χαλιναγωγώ, καταστέλλω", note:"Εννοείται το sunt." },
        { l:"libidines", r:"Υποκείμενο", to:"στο comprimendae (sunt)", g:"ονομ. πληθ.", d:"libido, libidinis (θηλ. γ΄) — η επιθυμία, το πάθος", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Παρατακτικά (ασύνδετο σχήμα)· εννοείται το ρήμα est.", kids:[
        { l:"propaganda", r:"Ρήμα", g:"ονομ. ενικ., θηλ. — γερουνδιακό (παθ. περιφραστική με εννοούμενο est)", d:"propago, propagavi, propagatum, propagare (1) — αυξάνω, πολλαπλασιάζω, διαδίδω", note:"Εννοείται το est." },
        { l:"suboles", r:"Υποκείμενο", to:"στο propaganda (est)", g:"ονομ. ενικ.", d:"suboles, -is (θηλ. γ΄) — ο απόγονος, η γενιά· εδώ: ο πληθυσμός", a:";" }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"omnia", r:"Υποκείμενο", to:"στο vincienda sunt", g:"ονομ. πληθ., ουδ. — επίθ. omnis (ουσιαστικοπ.)", d:"omnis, -is, -e — όλος· (ουσιαστικοπ.) τα πάντα", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική πρόταση, προσδιορίζει το omnia. Εκφέρεται με οριστική — πραγματικό.", kids:[
          { l:"quae", r:"Υποκείμενο", to:"στο diffluxerunt", g:"ονομ. πληθ., ουδ. — αναφορική αντωνυμία (αναφορά στο omnia)", d:"qui, quae, quod — ο οποίος" },
          { l:"dilapsa", r:"Επιρρ. μετοχή (χρονική) / επιρρ. κατηγορούμενο", to:"στο diffluxerunt", g:"ονομ. πληθ., ουδ. — μτχ. παρακ. (αποθετικό ρ.)", d:"dilabor, dilapsus sum, dilabi (αποθ. 3) — διαλύομαι, καταρρέω, σωριάζομαι", note:"Μετοχή αποθετικού ρήματος με ενεργητική/μέση σημασία: «αφού κατέρρευσαν»." },
          { l:"iam", r:"Επιρρ. προσδ. του χρόνου", to:"στο diffluxerunt", g:"χρονικό επίρρημα", d:"iam — ήδη, πλέον" },
          { l:"diffluxerunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου ενεργ.", d:"diffluo, diffluxi, —, diffluere (3) — διαλύομαι, χάνομαι, καταλύομαι", a:"," }
        ]},
        { l:"severis", r:"Επιθετικός προσδ.", to:"στο legibus", g:"αφαιρ. πληθ., θηλ. — επίθ. β΄ κλ.", d:"severus, -a, -um — αυστηρός" },
        { l:"legibus", r:"Αφαιρετική του οργάνου (μέσου)", to:"στο vincienda sunt", g:"αφαιρ. πληθ.", d:"lex, legis (θηλ. γ΄) — ο νόμος" },
        { l:"vincienda sunt", r:"Ρήμα", g:"γ΄ πληθ., παθ. περιφραστική συζυγία (γερουνδιακό vincienda + sunt) — δηλώνει το δέον", d:"vincio, vinxi, vinctum, vincire (4) — δένω, στερεώνω, συγκρατώ", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"In tanto civili bello", k:"bellum", r:"Εμπρόθετος επιρρ. προσδ. των χρονικών ορίων (κατάστασης)", to:"στο perdidit", g:"in (πρόθ. + αφαιρ.)· tanto, civili (επιθ. προσδ. στο bello, αφαιρ. ενικ. ουδ.)", d:"in — σε, κατά τη διάρκεια· tantus, -a, -um — τόσο μεγάλος· civilis, -is, -e — εμφύλιος, πολιτικός· bellum, -i (ουδ. β΄) — ο πόλεμος", a:"," },
        { l:"in tanto ardore", k:"ardor", r:"Εμπρόθετος επιρρ. προσδ. των χρονικών ορίων (κατάστασης)", to:"στο perdidit", g:"in (πρόθ. + αφαιρ.)· tanto (επιθ. προσδ. στο ardore)", d:"in — σε· tantus, -a, -um — τόσο μεγάλος· ardor, ardoris (αρσ. γ΄) — η φλόγα, ο αναβρασμός, το πάθος" },
        { l:"animorum", r:"Γενική (αντικειμενική)", to:"στο ardore", g:"γεν. πληθ.", d:"animus, -i (αρσ. β΄) — η ψυχή, το πνεύμα" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"armorum", r:"Γενική (αντικειμενική)", to:"στο ardore", g:"γεν. πληθ., ουδ.", d:"arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα", a:"," },
        { l:"quassata", r:"Επιθετικός προσδ. (μτχ. ως επιθετική)", to:"στο res publica", g:"ονομ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής", d:"quasso, quassavi, quassatum, quassare (1) — συγκλονίζω, ρημάζω, τσακίζω" },
        { l:"res publica", r:"Υποκείμενο", to:"στο perdidit", g:"ονομ. ενικ. (res + publica)", d:"res publica, rei publicae (θηλ. ε΄ + επίθ.) — η πολιτεία, το κράτος" },
        { l:"multa", r:"Αντικείμενο", to:"στο perdidit", g:"αιτ. πληθ., ουδ. — επίθ. multus (ουσιαστικοπ.)", d:"multus, -a, -um — πολύς· (ουσιαστικοπ.) πολλά" },
        { l:"perdidit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ.", d:"perdo, perdidi, perditum, perdere (3) — χάνω, καταστρέφω" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος (et ... et)", d:"et — και" },
        { l:"ornamenta", r:"Αντικείμενο (επεξήγηση στο multa)", to:"στο perdidit", g:"αιτ. πληθ., ουδ.", d:"ornamentum, -i (ουδ. β΄) — το στολίδι, το διακριτικό, το κόσμημα" },
        { l:"dignitatis", r:"Γενική (κτητική/αντικειμενική)", to:"στο ornamenta", g:"γεν. ενικ.", d:"dignitas, dignitatis (θηλ. γ΄) — το κύρος, η αξιοπρέπεια" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος (et ... et)", d:"et — και" },
        { l:"praesidia", r:"Αντικείμενο (επεξήγηση στο multa)", to:"στο perdidit", g:"αιτ. πληθ., ουδ.", d:"praesidium, -ii/-i (ουδ. β΄) — η προστασία, το στήριγμα, η φρουρά" },
        { l:"stabilitatis", r:"Γενική (αντικειμενική)", to:"στο praesidia", g:"γεν. ενικ.", d:"stabilitas, stabilitatis (θηλ. γ΄) — η σταθερότητα" },
        { l:"suae", r:"Επιθετικός προσδ. (κτητική αντων.)", to:"στο stabilitatis", g:"γεν. ενικ., θηλ. — κτητική αντωνυμία γ΄ προσ.", d:"suus, sua, suum — δικός του/της", a:";" }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"multaque", r:"Αντικείμενο", to:"στο fecit", g:"αιτ. πληθ., ουδ. — επίθ. multus (ουσιαστικοπ.)· -que: συμπλεκτικός σύνδεσμος", d:"multus, -a, -um — πολύς· (ουσιαστικοπ.) πολλά", note:"Το εγκλιτικό -que (συμπλεκτικός σύνδεσμος) συνδέει την περίοδο με την προηγούμενη." },
        { l:"uterque", r:"Επιθετικός προσδ.", to:"στο dux", g:"ονομ. ενικ., αρσ. — αντωνυμικό επίθ. / αντωνυμία", d:"uterque, utraque, utrumque — και οι δύο, ο ένας και ο άλλος" },
        { l:"dux", r:"Υποκείμενο", to:"στο fecit", g:"ονομ. ενικ.", d:"dux, ducis (αρσ. γ΄) — ο αρχηγός, ο στρατηγός" },
        { l:"fecit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ.", d:"facio, feci, factum, facere (3, 15 σε -io) — κάνω" },
        { l:"armatus", r:"Επιρρ. κατηγορούμενο (του χρόνου/εναντίωσης)", to:"στο dux", g:"ονομ. ενικ., αρσ. — μτχ. παρακ. / επίθ. β΄ κλ.", d:"armo, armavi, armatum, armare (1) — οπλίζω· armatus = οπλισμένος (σε καιρό πολέμου)", note:"Επιρρηματικό κατηγορούμενο: «όταν/ενώ ήταν οπλισμένος (σε καιρό πολέμου)»· αντιτίθεται στο togatus.", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική πρόταση (προσδιορίζει το multa)· εκφέρεται με υποτακτική υπερσυντελίκου (prohibuisset) με δυνητική/υποθετική σημασία (δυνητική υποτακτική του παρελθόντος — απόδοση λανθάνοντος υποθετικού λόγου).", kids:[
          { l:"quae", r:"Υποκείμενο απαρεμφάτου / αντικείμενο ρήματος", to:"στο fieri & prohibuisset", g:"αιτ. πληθ., ουδ. — αναφορική αντωνυμία (αναφορά στο multa)", d:"qui, quae, quod — ο οποίος", note:"Υποκείμενο του απαρεμφάτου fieri· το απαρέμφατο (με το quae) είναι αντικείμενο του prohibuisset." },
          { l:"idem", r:"Υποκείμενο", to:"στο prohibuisset", g:"ονομ. ενικ., αρσ. — οριστική (επαναληπτική) αντωνυμία", d:"idem, eadem, idem — ο ίδιος", note:"Αναφέρεται στο dux (uterque dux)." },
          { l:"togatus", r:"Επιρρ. κατηγορούμενο (του χρόνου/εναντίωσης)", to:"στο idem", g:"ονομ. ενικ., αρσ. — επίθ. β΄ κλ. (από το toga)", d:"togatus, -a, -um — ντυμένος με τήβεννο, πολίτης (σε καιρό ειρήνης)", note:"Επιρρηματικό κατηγορούμενο· αντιτίθεται στο armatus: «ως πολίτης, σε καιρό ειρήνης»." },
          { l:"fieri", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο prohibuisset", g:"απαρέμφατο ενεστ. — ανώμαλο (παθ. του facio)", d:"fio, factus sum, fieri — γίνομαι· (ως παθ. του facio) γίνομαι", note:"Απαρέμφατο του fio ως παθητικού του facio· υποκείμενό του το quae." },
          { l:"prohibuisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσυντελίκου ενεργ. — δυνητική υποτακτική", d:"prohibeo, prohibui, prohibitum, prohibere (2) — εμποδίζω, αποτρέπω", note:"Δυνητική υποτακτική («θα είχε εμποδίσει»): απόδοση λανθάνοντος υποθετικού λόγου.", a:"." }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { l:"Quare", r:"Συμπερασματικός σύνδεσμος", g:"συμπερασματικό επίρρημα / σύνδεσμος", d:"quare — γι' αυτό, επομένως", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Απρόσωπη σύνταξη· το subvenio είναι αμετάβατο (+ δοτ.), γι' αυτό η παθ. περιφραστική είναι απρόσωπη.", kids:[
        { l:"subveniendum", r:"Ρήμα (γερουνδιακό — απρόσωπο)", to:"στο est", g:"ουδ. ενικ. — γερουνδιακό (παθ. περιφραστική)", d:"subvenio, subveni, subventum, subvenire (4) — βοηθώ, έρχομαι σε βοήθεια (+ δοτ.)", note:"Σχηματίζει με το est την απρόσωπη παθ. περιφραστική συζυγία: subveniendum est = πρέπει να βοηθηθεί." },
        { l:"reipublicae", r:"Αντικείμενο (δοτική)", to:"στο subveniendum est", g:"δοτ. ενικ.", d:"res publica, rei publicae (θηλ. ε΄) — η πολιτεία", note:"Το subvenio συντάσσεται με δοτική." },
        { l:"est", r:"Ρήμα (βοηθητικό παθ. περιφραστικής)", g:"γ΄ ενικ. οριστ. ενεστ.", d:"sum, fui, —, esse — είμαι" },
        { l:"tibi", r:"Δοτική προσωπική του ποιητικού αιτίου", to:"στο subveniendum est", g:"δοτ. ενικ. β΄ προσ. — προσωπική αντωνυμία", d:"tu — εσύ", note:"Ποιητικό αίτιο (δοτ. του ενεργούντος προσώπου).", a:"," }
      ]},
      { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"sananda sunt", r:"Ρήμα", g:"γ΄ πληθ., παθ. περιφραστική συζυγία (γερουνδιακό sananda + sunt) — δηλώνει το δέον", d:"sano, sanavi, sanatum, sanare (1) — θεραπεύω, γιατρεύω" },
        { l:"tibi", r:"Δοτική προσωπική του ποιητικού αιτίου", to:"στο sananda sunt", g:"δοτ. ενικ. β΄ προσ. — προσωπική αντωνυμία", d:"tu — εσύ" },
        { l:"nunc", r:"Επιρρ. προσδ. του χρόνου", to:"στο sananda sunt", g:"χρονικό επίρρημα", d:"nunc — τώρα" },
        { l:"omnia", r:"Επιθετικός προσδ.", to:"στο vulnera", g:"ονομ. πληθ., ουδ. — επίθ. omnis", d:"omnis, -is, -e — όλος" },
        { l:"vulnera", r:"Υποκείμενο", to:"στο sananda sunt", g:"ονομ. πληθ., ουδ.", d:"vulnus, vulneris (ουδ. γ΄) — η πληγή, το τραύμα" },
        { l:"belli", r:"Γενική (αντικειμενική/κτητική)", to:"στο vulnera", g:"γεν. ενικ., ουδ.", d:"bellum, -i (ουδ. β΄) — ο πόλεμος", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική πρόταση, προσδιορίζει το vulnera. Εκφέρεται με οριστική — πραγματικό.", kids:[
          { l:"quibus", r:"Αντικείμενο (δοτική)", to:"στο mederi", g:"δοτ. πληθ., ουδ. — αναφορική αντωνυμία (αναφορά στο vulnera)", d:"qui, quae, quod — ο οποίος", note:"Το medeor συντάσσεται με δοτική· γι' αυτό το quibus είναι αντικείμενο." },
          { l:"praeter te", k:"tu", r:"Εμπρόθετος επιρρ. προσδ. (εξαίρεσης)", to:"στο potest", g:"praeter (πρόθ. + αιτ.) + te (αιτ. ενικ. β΄ προσ.)", d:"praeter — εκτός από· tu — εσύ" },
          { l:"mederi", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο potest", g:"απαρέμφατο ενεστ. — αποθετικό ρήμα", d:"medeor, —, mederi (αποθ. 2) — θεραπεύω, γιατρεύω (+ δοτ.)", note:"Αποθετικό· δεν σχηματίζει παρακείμενο/σουπίνο. Τελικό απαρέμφατο, αντικ. του potest." },
          { l:"nemo", r:"Υποκείμενο", to:"στο potest", g:"ονομ. ενικ. — αόριστη (ουσιαστική) αντωνυμία", d:"nemo, nullius/neminis — κανείς" },
          { l:"potest", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. — ανώμαλο", d:"possum, potui, —, posse — μπορώ", a:"." }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Omnia sunt excitanda", el:"Τα πάντα πρέπει να ανασυγκροτηθούν" },
    { la:"tibi uni, C. Caesar,", el:"από σένα μόνο, Γάιε Καίσαρα," },
    { la:"quae iacere sentis", el:"όσα ξέρεις ότι κείτονται" },
    { la:"perculsa atque prostrata", el:"αναποδογυρισμένα και ριγμένα κάτω" },
    { la:"impetu belli ipsius,", el:"από τη λαίλαπα αυτού του ίδιου πολέμου," },
    { la:"quod fuit necesse;", el:"που υπήρξε αναγκαίος·" },
    { la:"constituenda iudicia,", el:"πρέπει να αναδιοργανωθεί η δικαιοσύνη," },
    { la:"revocanda fides,", el:"πρέπει να αποκατασταθεί η εμπορική πίστη," },
    { la:"comprimendae libidines,", el:"πρέπει να χαλιναγωγηθούν τα πάθη," },
    { la:"propaganda suboles;", el:"πρέπει να επιδιωχθεί η αύξηση του πληθυσμού·" },
    { la:"omnia, quae iam diffluxerunt", el:"όλα όσα ήδη έχουν καταλυθεί," },
    { la:"dilapsa,", el:"αφού κατέρρευσαν," },
    { la:"severis legibus vincienda sunt.", el:"πρέπει να στερεωθούν με αυστηρούς νόμους." },
    { la:"In tanto civili bello,", el:"Σε (ένα) τόσο μεγάλο εμφύλιο πόλεμο," },
    { la:"in tanto ardore", el:"σε (ένα) τόσο μεγάλο πάθος" },
    { la:"animorum et armorum,", el:"των ψυχών και των όπλων," },
    { la:"quassata res publica multa perdidit", el:"η ρημαγμένη πολιτεία έχασε πολλά" },
    { la:"et ornamenta dignitatis", el:"και διακριτικά του κύρους (της)" },
    { la:"et praesidia stabilitatis suae;", el:"και στηρίγματα της σταθερότητάς της·" },
    { la:"multaque uterque dux", el:"και ο ένας και ο άλλος αρχηγός" },
    { la:"fecit armatus,", el:"έκανε πολλά στον πόλεμο," },
    { la:"quae idem fieri prohibuisset", el:"τα οποία ο ίδιος θα είχε εμποδίσει να γίνουν" },
    { la:"togatus.", el:"σε καιρό ειρήνης." },
    { la:"Quare subveniendum reipublicae est", el:"Επομένως, πρέπει να βοηθήσεις την πολιτεία" },
    { la:"et sananda sunt tibi nunc", el:"και πρέπει να θεραπευτούν από σένα τώρα" },
    { la:"omnia vulnera belli,", el:"όλες οι πληγές του πολέμου," },
    { la:"quibus praeter te", el:"τις οποίες κανείς εκτός από σένα" },
    { la:"nemo mederi potest.", el:"δεν μπορεί να γιατρέψει." }
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
        { form:"suboles, -is" }
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
        { form:"fides, -ei", note:"εδώ: η εμπορική πίστη" },
        { form:"res, rei" },
        { form:"res publica, rei publicae", note:"res + publicus (επίθ.)· η πολιτεία" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"multus, -a, -um" },
      { form:"severus, -a, -um" },
      { form:"tantus, -a, -um" },
      { form:"togatus, -a, -um", note:"από το toga· ντυμένος με τήβεννο" },
      { form:"unus, -a, -um", note:"αριθμ./αντωνυμικό (γεν. -ius, δοτ. -i)" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"civilis, -is, -e" },
      { form:"omnis, -is, -e" }
    ]},
    { kl:"Άκλιτα", items:[
      { form:"necesse", note:"άκλιτο επίθετο (μόνο ουδ.)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"multus, -a, -um", comp:"plus (πληθ. plures, plura)", sup:"plurimus, -a, -um", note:"ανώμαλα" },
      { pos:"severus, -a, -um", comp:"severior, -ior, -ius", sup:"severissimus, -a, -um" },
      { pos:"tantus, -a, -um", comp:"—", sup:"—", note:"δεικτικό — δεν σχηματίζει παραθετικά" },
      { pos:"togatus, -a, -um", comp:"—", sup:"—", note:"δηλώνει κατάσταση — δεν σχηματίζει παραθετικά" },
      { pos:"unus, -a, -um", comp:"—", sup:"—", note:"αριθμητικό/αντωνυμικό" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"civilis, -is, -e", comp:"civilior, -ior, -ius", sup:"civilissimus, -a, -um" },
      { pos:"omnis, -is, -e", comp:"—", sup:"—", note:"δηλώνει το όλον — δεν σχηματίζει παραθετικά" }
    ]},
    { kl:"Άκλιτα", rows:[
      { pos:"necesse", comp:"—", sup:"—", note:"άκλιτο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσ. (tibi, te)" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ. (αυτοπαθής)" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"quae, quod, quibus" },
    { form:"ipse, ipsa, ipsum", kind:"Οριστική (δεικτική)", extra:"ipsius" },
    { form:"idem, eadem, idem", kind:"Οριστική (επαναληπτική)", extra:"idem" },
    { form:"uterque, utraque, utrumque", kind:"Επιμεριστική / αόριστη", extra:"= και οι δύο" },
    { form:"nemo", kind:"Αόριστη (ουσιαστική)", extra:"nemo, nullius / neminis" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"armo", perf:"armavi", sup:"armatum", inf:"armare", note:"" },
      { pres:"excito", perf:"excitavi", sup:"excitatum", inf:"excitare", note:"" },
      { pres:"propago", perf:"propagavi", sup:"propagatum", inf:"propagare", note:"" },
      { pres:"quasso", perf:"quassavi", sup:"quassatum", inf:"quassare", note:"θαμιστικό" },
      { pres:"revoco", perf:"revocavi", sup:"revocatum", inf:"revocare", note:"" },
      { pres:"sano", perf:"sanavi", sup:"sanatum", inf:"sanare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"iaceo", perf:"iacui", sup:"—", inf:"iacere", note:"= κείμαι· μτχ. μέλλ. iaciturus" },
      { pres:"medeor", perf:"—", sup:"—", inf:"mederi", note:"αποθετικό (+ δοτ.)· χωρίς παρακ./σουπίνο" },
      { pres:"prohibeo", perf:"prohibui", sup:"prohibitum", inf:"prohibere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"comprimo", perf:"compressi", sup:"compressum", inf:"comprimere", note:"" },
      { pres:"constituo", perf:"constitui", sup:"constitutum", inf:"constituere", note:"" },
      { pres:"diffluo", perf:"diffluxi", sup:"—", inf:"diffluere", note:"σπάνιο σουπίνο (diffluxum)" },
      { pres:"dilabor", perf:"dilapsus sum", sup:"—", inf:"dilabi", note:"αποθετικό" },
      { pres:"facio", perf:"feci", sup:"factum", inf:"facere", note:"15 σε -io· παθ. fio" },
      { pres:"percello", perf:"perculi", sup:"perculsum", inf:"percellere", note:"" },
      { pres:"perdo", perf:"perdidi", sup:"perditum", inf:"perdere", note:"" },
      { pres:"prosterno", perf:"prostravi", sup:"prostratum", inf:"prosternere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"sentio", perf:"sensi", sup:"sensum", inf:"sentire", note:"" },
      { pres:"subvenio", perf:"subveni", sup:"subventum", inf:"subvenire", note:"+ δοτ." },
      { pres:"vincio", perf:"vinxi", sup:"vinctum", inf:"vincire", note:"= δένω" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"σύνθ. pote + sum" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"παθ. του facio" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7 (προαιρετικό): SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ────────────────────
  sos: [
    { tag:"Σύνταξη", title:"Παθητική περιφραστική συζυγία", body:"Οι τύποι sunt excitanda, constituenda (sunt), vincienda sunt, sananda sunt, subveniendum est δηλώνουν το δέον/αναγκαίο (γερουνδιακό + sum). Το ποιητικό αίτιο μπαίνει σε δοτική: δοτική προσωπική του ενεργούντος προσώπου (tibi)." },
    { tag:"Σύνταξη", title:"subveniendum est: απρόσωπη σύνταξη", body:"Το subvenio είναι αμετάβατο (συντάσσεται με δοτική: reipublicae)· γι' αυτό η παθητική περιφραστική του είναι απρόσωπη (subveniendum est), χωρίς προσωπικό υποκείμενο." },
    { tag:"Ρήμα", title:"Αποθετικά: dilabor, medeor", body:"Το dilapsa είναι μετοχή παρακ. του αποθετικού dilabor (ενεργ./μέση σημασία: «αφού κατέρρευσαν»). Το medeor είναι αποθετικό, χωρίς παρακείμενο/σουπίνο, και συντάσσεται με δοτική (quibus ... mederi)." },
    { tag:"Ρήμα", title:"fieri = παθητικό του facio", body:"Ο τύπος fieri είναι απαρέμφατο ενεστ. του ανώμαλου fio, factus sum, fieri, που λειτουργεί ως παθητικό του facio (quae idem togatus fieri prohibuisset)." },
    { tag:"Έγκλιση", title:"prohibuisset: δυνητική υποτακτική", body:"Το prohibuisset (υποτ. υπερσυντελίκου) είναι δυνητική υποτακτική του παρελθόντος («θα είχε εμποδίσει») στην αναφορική πρόταση — απόδοση λανθάνοντος υποθετικού λόγου." },
    { tag:"Προσδιορισμός", title:"armatus / togatus: επιρρ. κατηγορούμενα", body:"Τα armatus και togatus δεν είναι απλοί επιθετικοί προσδιορισμοί, αλλά επιρρηματικά κατηγορούμενα (του χρόνου/εναντίωσης): «ως οπλισμένος (σε καιρό πολέμου)» ↔ «ως πολίτης (σε καιρό ειρήνης)»." }
  ]
};

export default UNIT;
