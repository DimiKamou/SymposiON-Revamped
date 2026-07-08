// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 34
//  Δομή ίδια με το template (unit16.js).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 34,
  title: "Ο Σκιπίωνας ο Αφρικανός και οι λήσταρχοι",
  latinTitle: "Lectio XXXIV",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική πρόταση· εισάγεται με τον ιστορικό (διηγηματικό) cum· εκφέρεται με υποτακτική παρατατικού, γιατί ο ιστορικός cum υπογραμμίζει τη βαθύτερη σχέση κύριας–δευτερεύουσας (σχέση αιτίου–αιτιατού) και δηλώνει το σύγχρονο στο παρελθόν. Λειτουργεί ως επιρρ. προσδ. του χρόνου στο venerunt.", kids:[
          { l:"Cum", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (ιστορικός/διηγηματικός) — + υποτακτική", d:"cum — όταν" },
          { l:"Africanus", r:"Υποκείμενο", to:"στο esset", g:"ονομ. ενικ., αρσ. (β΄ κλ.)", d:"Africanus, Africani (αρσ. β΄) — ο Αφρικανός" },
          { l:"in Literno", k:"Liternum", r:"Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο", to:"στο esset", g:"in (πρόθ. + αφαιρ.) + Literno (αφαιρ. ενικ., ουδ.)", d:"in — σε· Liternum, -i (ουδ. β΄) — το Λίτερνο (μόνο ενικ.)" },
          { l:"esset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατατικού", d:"sum, fui, —, esse — είμαι, υπάρχω", a:"," }
        ]},
        { l:"complures", r:"Επιθετικός προσδ.", to:"στο duces", g:"ονομ. πληθ., αρσ. — επίθ. γ΄ κλ.", d:"complures, -es, -(i)a — πολλοί", note:"Δε σχηματίζει παραθετικά." },
        { l:"praedonum", r:"Γενική κτητική", to:"στο duces", g:"γεν. πληθ.", d:"praedo, praedonis (αρσ. γ΄) — ο ληστής" },
        { l:"duces", r:"Υποκείμενο", to:"στο venerunt", g:"ονομ. πληθ.", d:"dux, ducis (αρσ. γ΄) — ο αρχηγός" },
        { l:"forte", r:"Επιρρ. προσδ. του τρόπου", to:"στο venerunt", g:"τροπικό επίρρημα", d:"forte — τυχαία", note:"Δε σχηματίζει παραθετικά· να μη συγχέεται με το fortiter (< fortis)." },
        { l:"salutatum", r:"Αιτ. σουπίνου (σκοπός)", to:"στο venerunt", g:"αιτ. σουπίνου", d:"saluto, salutavi, salutatum, salutare (1) — χαιρετίζω επίσημα", note:"Εξαρτάται από το ρήμα κίνησης venerunt και δηλώνει τον σκοπό της κίνησης." },
        { l:"ad eum", k:"is", r:"Εμπρόθετος επιρρ. προσδ. (κατεύθυνση σε πρόσωπο)", to:"στο venerunt", g:"ad (πρόθ. + αιτ.) + eum (αιτ. ενικ., αρσ.)", d:"ad — σε, προς· is, ea, id — αυτός (δεικτική ως επαναληπτική)" },
        { l:"venerunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου ενεργ.", d:"venio, veni, ventum, venire (4) — έρχομαι, φθάνω", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { l:"Tum", r:"Επιρρ. προσδ. του χρόνου", to:"στο conlocavit", g:"χρονικό επίρρημα", d:"tum — τότε" },
        { l:"Scipio", r:"Υποκείμενο", to:"στο conlocavit", g:"ονομ. ενικ.", d:"Scipio, Scipionis (αρσ. γ΄) — ο Σκιπίωνας", a:"," },
        { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρ. αιτιολογική πρόταση· εισάγεται με τον αιτιολογικό cum· εκφέρεται με υποτακτική υπερσυντελίκου, γιατί η αιτιολογία είναι αποτέλεσμα εσωτερικής, λογικής διεργασίας και δηλώνει το προτερόχρονο στο παρελθόν. Λειτουργεί ως επιρρ. προσδ. της αιτίας στο conlocavit.", kids:[
          { l:"cum", r:"Αιτιολ. σύνδεσμος", g:"αιτιολογικός σύνδεσμος (+ υποτακτική)", d:"cum — επειδή" },
          { l:"se", r:"Αντικείμενο", to:"στο captum", g:"αιτ. ενικ., γ΄ προσ. προσωπικής (αυτοπαθούς) αντων.", d:"sui, sibi, se, se — εαυτού", note:"Εκφράζει έμμεση αυτοπάθεια." },
          { l:"ipsum", r:"Επιθετικός προσδ.", to:"στο se", g:"αιτ. ενικ., αρσ. — δεικτική (ως οριστική) αντων.", d:"ipse, ipsa, ipsum — ο ίδιος" },
          { l:"captum", r:"Αιτ. σουπίνου (σκοπός)", to:"στο venisse", g:"αιτ. σουπίνου", d:"capio, cepi, captum, capere (3, 15 σε -io) — συλλαμβάνω", note:"Εξαρτάται από τον ρηματικό τύπο κίνησης venisse και δηλώνει τον σκοπό." },
          { l:"venisse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο existimasset", g:"απαρέμφατο παρακειμένου ενεργ.", d:"venio, veni, ventum, venire (4) — έρχομαι, φθάνω" },
          { l:"eos", r:"Υποκείμενο απαρεμφάτου", to:"στο venisse (ετεροπροσωπία)", g:"αιτ. πληθ., αρσ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός" },
          { l:"existimasset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσυντελίκου ενεργ. (συνηρημ. αντί existimavisset)", d:"existimo, existimavi, existimatum, existimare (1) — νομίζω, θεωρώ", note:"Εννοούμενο υποκείμενο: Scipio." }
        ]},
        { l:"praesidium", r:"Αντικείμενο", to:"στο conlocavit", g:"αιτ. ενικ., ουδ.", d:"praesidium, -ii/-i (ουδ. β΄) — η φρουρά" },
        { l:"domesticorum", r:"Γενική διαιρετική", to:"στο praesidium", g:"γεν. πληθ., αρσ.", d:"domestici, -orum (αρσ. β΄, μόνο πληθ.) — οι δούλοι του σπιτιού", note:"Κατ' άλλη άποψη γενική του περιεχομένου." },
        { l:"in tecto", k:"tectum", r:"Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο", to:"στο conlocavit", g:"in (πρόθ. + αφαιρ.) + tecto (αφαιρ. ενικ., ουδ.)", d:"in — σε· tectum, -i (ουδ. β΄) — το σπίτι" },
        { l:"conlocavit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ.", d:"conloco, conlocavi, conlocatum, conlocare (1) — τοποθετώ, εγκαθιστώ", a:"." }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως. Εννοούμενο υποκείμενο: praedones.", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική πρόταση· εισάγεται με τον χρονικό σύνδεσμο ut (προτερόχρονο)· εκφέρεται με οριστική παρακειμένου, γιατί η πράξη ενδιαφέρει μόνο από χρονική άποψη. Λειτουργεί ως επιρρ. προσδ. του χρόνου στο appropinquaverunt.", kids:[
          { l:"Quod", r:"Αντικείμενο", to:"στο animadverterunt", g:"αιτ. ενικ., ουδ. — αναφορική αντων. (= id)", d:"qui, quae, quod — ο οποίος", note:"Αναφορική έλξη στην αρχή περιόδου (= id)." },
          { l:"ut", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (+ οριστ.) — προτερόχρονο", d:"ut — όταν, μόλις" },
          { l:"praedones", r:"Υποκείμενο", to:"στο animadverterunt", g:"ονομ. πληθ.", d:"praedo, praedonis (αρσ. γ΄) — ο ληστής" },
          { l:"animadverterunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου ενεργ.", d:"animadverto, animadverti, animadversum, animadvertere (3) — παρατηρώ", a:"," }
        ]},
        { l:"abiectis", r:"Χρον. μετοχή (αφαιρ. απόλυτη)", to:"στο appropinquaverunt", g:"αφαιρ. πληθ., ουδ. — μτχ. παρακειμένου παθ.", d:"abicio, abieci, abiectum, abicere (3, 15 σε -io) — ρίπτω, αποθέτω", note:"Ιδιάζουσα αφαιρετική απόλυτη· δηλώνει το προτερόχρονο, έχει παθητική σημασία." },
        { l:"armis", r:"Υποκείμενο μετοχής", to:"στο abiectis", g:"αφαιρ. πληθ., ουδ.", d:"arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα" },
        { l:"ianuae", r:"Αντικείμενο", to:"στο appropinquaverunt", g:"δοτ. ενικ.", d:"ianua, -ae (θηλ. α΄) — η πόρτα" },
        { l:"appropinquaverunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου ενεργ.", d:"appropinquo, appropinquavi, appropinquatum, appropinquare (1) — πλησιάζω", note:"Εννοούμενο υποκείμενο: praedones." }
      ]},
      { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως. Εννοούμενο υποκείμενο: praedones.", kids:[
        { l:"clara", r:"Επιθετικός προσδ.", to:"στο voce", g:"αφαιρ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"clarus, -a, -um — καθαρός, δυνατός" },
        { l:"voce", r:"Αφαιρετική (οργανική) του τρόπου", to:"στο nuntiaverunt", g:"αφαιρ. ενικ.", d:"vox, vocis (θηλ. γ΄) — η φωνή" },
        { l:"Scipioni", r:"Έμμεσο αντικείμενο", to:"στο nuntiaverunt", g:"δοτ. ενικ.", d:"Scipio, Scipionis (αρσ. γ΄) — ο Σκιπίωνας" },
        { l:"nuntiaverunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου ενεργ.", d:"nuntio, nuntiavi, nuntiatum, nuntiare (1) — αναγγέλλω", note:"Εννοούμενο υποκείμενο: praedones." },
        { l:"(incredibile", r:"Προεξαγγελτική παράθεση", to:"στη φράση virtutem eius admiratum se venisse", g:"ονομ. ενικ., ουδ. — επίθ. γ΄ κλ.", d:"incredibilis, -is, -e — απίστευτος", note:"Έχει προέλθει από την πρόταση «(quod/hoc) est incredibile auditu»· εκεί το incredibile θα ήταν κατηγορούμενο." },
        { l:"auditu", r:"Αφαιρ. σουπίνου (αναφορά)", to:"στο incredibile", g:"αφαιρ. σουπίνου", d:"audio, audivi, auditum, audire (4) — ακούω", a:"!)" },
        { l:"virtutem", r:"Αντικείμενο", to:"στο admiratum", g:"αιτ. ενικ.", d:"virtus, virtutis (θηλ. γ΄) — ανδρεία, αρετή" },
        { l:"eius", r:"Γενική κτητική", to:"στο virtutem", g:"γεν. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός" },
        { l:"admiratum", r:"Αιτ. σουπίνου (σκοπός)", to:"στο venisse", g:"αιτ. σουπίνου", d:"admiror, admiratus sum, admirari (1, αποθ.) — θαυμάζω", note:"Εξαρτάται από τον ρηματικό τύπο κίνησης venisse και δηλώνει τον σκοπό." },
        { l:"se", r:"Υποκείμενο απαρεμφάτου", to:"στο venisse (ταυτοπροσωπία)", g:"αιτ. ενικ., γ΄ προσ. προσωπικής αντων.", d:"sui, sibi, se, se — εαυτού", note:"Λατινισμός: το υποκ. του ειδικού απαρεμφάτου τίθεται σε αιτιατική και στην ταυτοπροσωπία." },
        { l:"venisse", r:"Ειδικό απαρέμφατο (άμεσο αντικείμενο)", to:"στο nuntiaverunt", g:"απαρέμφατο παρακειμένου ενεργ.", d:"venio, veni, ventum, venire (4) — έρχομαι, φθάνω", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική πρόταση· εισάγεται με τον χρονικό σύνδεσμο postquam (προτερόχρονο)· εκφέρεται με οριστική παρακειμένου, γιατί η πράξη ενδιαφέρει μόνο από χρονική άποψη. Λειτουργεί ως επιρρ. προσδ. του χρόνου στο iussit.", kids:[
          { l:"Haec", r:"Άμεσο αντικείμενο", to:"στο rettulerunt", g:"αιτ. πληθ., ουδ. — δεικτική αντων.", d:"hic, haec, hoc — αυτός", note:"Πρόταξη όρου: η αντωνυμία βρίσκεται μπροστά από τον σύνδεσμο postquam." },
          { l:"postquam", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (+ οριστ.) — προτερόχρονο", d:"postquam — όταν, αφού" },
          { l:"domestici", r:"Υποκείμενο", to:"στο rettulerunt", g:"ονομ. πληθ., αρσ.", d:"domestici, -orum (αρσ. β΄, μόνο πληθ.) — οι δούλοι του σπιτιού" },
          { l:"Scipioni", r:"Έμμεσο αντικείμενο", to:"στο rettulerunt", g:"δοτ. ενικ.", d:"Scipio, Scipionis (αρσ. γ΄) — ο Σκιπίωνας" },
          { l:"rettulerunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου ενεργ.", d:"refero, ret(t)uli, relatum, referre (3, ανώμαλο) — επαναφέρω, αποκρίνομαι", a:"," }
        ]},
        { l:"is", r:"Υποκείμενο", to:"στο iussit", g:"ονομ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός" },
        { l:"fores", r:"Υποκείμενο απαρεμφάτου", to:"στο reserari (ετεροπροσωπία)", g:"αιτ. πληθ.", d:"foris, foris (θηλ. γ΄) — η πόρτα, η είσοδος (συνήθ. πληθ.· γεν. πληθ. forium)" },
        { l:"reserari", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο iussit", g:"απαρέμφατο ενεστ. παθ.", d:"resero, reseravi, reseratum, reserare (1) — ανοίγω" },
        { l:"eos", r:"Υποκείμενο απαρεμφάτου", to:"στο intromitti (ετεροπροσωπία)", g:"αιτ. πληθ., αρσ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός" },
        { l:"-que", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος — εγκλιτικός", d:"-que — και", conn:true },
        { l:"intromitti", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο iussit", g:"απαρέμφατο ενεστ. παθ.", d:"intromitto, intromisi, intromissum, intromittere (3) — βάζω μέσα, εισάγω" },
        { l:"iussit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ.", d:"iubeo, iussi, iussum, iubere (2) — διατάζω", a:"." }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { l:"Praedones", r:"Υποκείμενο", to:"στο venerati sunt", g:"ονομ. πληθ.", d:"praedo, praedonis (αρσ. γ΄) — ο ληστής" },
        { l:"postes", r:"Αντικείμενο", to:"στο venerati sunt", g:"αιτ. πληθ.", d:"postis, postis (αρσ. γ΄) — η παραστάδα (γεν. πληθ. postium)" },
        { l:"ianuae", r:"Γενική κτητική", to:"στο postes", g:"γεν. ενικ.", d:"ianua, -ae (θηλ. α΄) — η πόρτα" },
        { l:"tamquam", r:"Παραβολικό επίρρημα", to:"εισάγει το κατηγορούμενο templum", g:"παραβολικό επίρρημα", d:"tamquam — σαν" },
        { l:"sanctum", r:"Επιθετικός προσδ.", to:"στο templum", g:"αιτ. ενικ., ουδ. — επίθ. β΄ κλ.", d:"sanctus, -a, -um — ιερός" },
        { l:"templum", r:"Κατηγορούμενο", to:"στο postes (μέσω του tamquam)", g:"αιτ. ενικ., ουδ.", d:"templum, -i (ουδ. β΄) — ο ναός" },
        { l:"venerati sunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου (αποθ.)", d:"veneror, veneratus sum, venerari (1, αποθ.) — προσκυνώ, λατρεύω" }
      ]},
      { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως. Εννοούμενο υποκείμενο: praedones.", kids:[
        { l:"cupide", r:"Επιρρ. προσδ. του τρόπου", to:"στο osculati sunt", g:"τροπικό επίρρημα", d:"cupide — με πάθος (< cupidus, -a, -um)" },
        { l:"Scipionis", r:"Γενική κτητική", to:"στο dextram", g:"γεν. ενικ.", d:"Scipio, Scipionis (αρσ. γ΄) — ο Σκιπίωνας" },
        { l:"dextram", r:"Αντικείμενο", to:"στο osculati sunt", g:"αιτ. ενικ.", d:"dextra, -ae (θηλ. α΄) — το δεξί χέρι (< συνεκφορά dextra manus)" },
        { l:"osculati sunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου (αποθ.)", d:"osculor, osculatus sum, osculari (1, αποθ.) — φιλώ, ασπάζομαι", note:"Εννοούμενο υποκείμενο: praedones.", a:"." }
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως. Εννοούμενο υποκείμενο: praedones.", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική πρόταση· εισάγεται με τον ιστορικό (διηγηματικό) cum· εκφέρεται με υποτακτική υπερσυντελίκου· δηλώνει το προτερόχρονο στο παρελθόν. Λειτουργεί ως επιρρ. προσδ. του χρόνου στο reverterunt.", kids:[
          { l:"Cum", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (ιστορικός/διηγηματικός) — + υποτακτική", d:"cum — όταν, αφού" },
          { l:"ante vestibulum", k:"vestibulum", r:"Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο", to:"στο posuissent", g:"ante (πρόθ. + αιτ.) + vestibulum (αιτ. ενικ., ουδ.)", d:"ante — μπροστά (σε)· vestibulum, -i (ουδ. β΄) — η είσοδος" },
          { l:"dona", r:"Αντικείμενο", to:"στο posuissent", g:"αιτ. πληθ., ουδ.", d:"donum, -i (ουδ. β΄) — το δώρο" },
          { l:"posuissent", r:"Ρήμα", g:"γ΄ πληθ. υποτ. υπερσυντελίκου ενεργ.", d:"pono, posui, positum, ponere (3) — τοποθετώ", note:"Εννοούμενο υποκείμενο: praedones.", a:"," },
          { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. επιθετική αναφορική πρόταση, προσδιοριστική στο dona· εισάγεται με την αναφορική αντωνυμία quae· εκφέρεται με οριστική ενεστώτα, γιατί δηλώνει το πραγματικό (αναφέρεται στο παρόν).", kids:[
            { l:"quae", r:"Άμεσο αντικείμενο", to:"στο consecrare", g:"αιτ. πληθ., ουδ. — αναφορική αντων.", d:"qui, quae, quod — ο οποίος" },
            { l:"homines", r:"Υποκείμενο", to:"στο solent (και στο consecrare, ταυτοπροσωπία)", g:"ονομ. πληθ.", d:"homo, hominis (αρσ. γ΄) — ο άνθρωπος" },
            { l:"deis", r:"Έμμεσο αντικείμενο", to:"στο consecrare", g:"δοτ. πληθ., αρσ.", d:"deus, dei (αρσ. β΄) — ο θεός" },
            { l:"immortalibus", r:"Επιθετικός προσδ.", to:"στο deis", g:"δοτ. πληθ., αρσ. — επίθ. γ΄ κλ.", d:"immortalis, -is, -e — αθάνατος" },
            { l:"consecrare", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο solent", g:"απαρέμφατο ενεστ. ενεργ.", d:"consecro, consecravi, consecratum, consecrare (1) — αφιερώνω, προσφέρω" },
            { l:"solent", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. (ημιαποθ.)", d:"soleo, solitus sum, solere (2, ημιαποθ.) — συνηθίζω", a:"," }
          ]}
        ]},
        { l:"domum", r:"Επιρρ. προσδ. της κίνησης σε τόπο (αιτ.)", to:"στο reverterunt", g:"αιτ. ενικ.", d:"domus, -us (θηλ. δ΄) — το σπίτι", note:"Η αιτιατική domus (ονόματος τόπου) δηλώνει την κίνηση σε τόπο χωρίς πρόθεση." },
        { l:"reverterunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου (αποθ./ημιαποθ.)", d:"revertor, reverti/reversus sum, reverti (3, αποθ. & ημιαποθ.) — επιστρέφω", note:"Εννοούμενο υποκείμενο: praedones.", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Cum Africanus", el:"Όταν ο Αφρικανός" },
    { la:"esset in Literno, complures", el:"ήταν στο Λίτερνο, πολλοί" },
    { la:"duces praedonum", el:"αρχηγοί ληστών" },
    { la:"venerunt forte ad eum", el:"ήρθαν κατά τύχη σε αυτόν" },
    { la:"salutatum.", el:"για να τον χαιρετίσουν επίσημα." },
    { la:"Tum Scipio,", el:"Τότε ο Σκιπίωνας," },
    { la:"cum existimasset", el:"επειδή νόμισε" },
    { la:"eos venisse", el:"ότι αυτοί είχαν έρθει" },
    { la:"captum se ipsum,", el:"για να συλλάβουν αυτόν τον ίδιο," },
    { la:"conlocavit in tecto", el:"εγκατέστησε στο σπίτι του" },
    { la:"praesidium", el:"φρουρά" },
    { la:"domesticorum.", el:"από τους δούλους (του σπιτιού)." },
    { la:"Ut praedones", el:"Όταν οι ληστές" },
    { la:"animadverterunt quod,", el:"το παρατήρησαν αυτό," },
    { la:"abiectis armis", el:"αφού κατέθεσαν τα όπλα τους," },
    { la:"ianuae appropinquaverunt", el:"πλησίασαν την πόρτα" },
    { la:"et clara voce", el:"και με δυνατή φωνή" },
    { la:"nuntiaverunt Scipioni", el:"ανάγγειλαν στον Σκιπίωνα" },
    { la:"(incredibile auditu!)", el:"(απίστευτο στο άκουσμα!)" },
    { la:"se venisse", el:"ότι είχαν έρθει" },
    { la:"admiratum virtutem eius.", el:"για να θαυμάσουν την ανδρεία του." },
    { la:"Postquam domestici", el:"Όταν οι δούλοι" },
    { la:"rettulerunt haec Scipioni,", el:"μετέφεραν αυτά στον Σκιπίωνα," },
    { la:"is iussit", el:"αυτός διέταξε" },
    { la:"reserari fores", el:"να ανοιχτούν οι πόρτες" },
    { la:"intromitti eosque.", el:"και να μπουν αυτοί μέσα." },
    { la:"Praedones venerati sunt", el:"Οι ληστές προσκύνησαν" },
    { la:"postes ianuae", el:"τις παραστάδες της πόρτας" },
    { la:"tamquam sanctum templum", el:"σαν ιερό ναό" },
    { la:"et osculati sunt cupide", el:"και φίλησαν με πάθος" },
    { la:"dextram Scipionis.", el:"το δεξί χέρι του Σκιπίωνα." },
    { la:"Cum posuissent", el:"Αφού τοποθέτησαν" },
    { la:"ante vestibulum dona,", el:"μπροστά στην είσοδο δώρα," },
    { la:"quae solent", el:"τα οποία συνηθίζουν" },
    { la:"homines consecrare", el:"οι άνθρωποι να προσφέρουν" },
    { la:"immortalibus deis,", el:"στους αθάνατους θεούς," },
    { la:"reverterunt domum.", el:"επέστρεψαν στον τόπο τους." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"dextra, -ae" },
        { form:"ianua, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Africanus, -i" },
        { form:"deus, -i", note:"κλητ. ενικ. deus & dive· ονομ./κλητ. πληθ. dei, dii, di· δοτ./αφαιρ. πληθ. deis, diis, dis" },
        { form:"domestici, -orum", note:"μόνο πληθ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"arma, -orum", note:"μόνο πληθ." },
        { form:"donum, -i" },
        { form:"Liternum, -i", note:"μόνο ενικ." },
        { form:"praesidium, -ii (-i)" },
        { form:"tectum, -i" },
        { form:"templum, -i" },
        { form:"vestibulum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"dux, ducis" },
        { form:"homo, -inis" },
        { form:"postis, postis", note:"γεν. πληθ. postium" },
        { form:"praedo, praedonis" },
        { form:"Scipio, Scipionis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"foris, foris", note:"συνήθ. πληθ. fores· γεν. πληθ. forium" },
        { form:"virtus, virtutis" },
        { form:"vox, vocis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"domus, -us", note:"αιτ. domum/domos· αφαιρ. domo· γεν. πληθ. domuum/domorum" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"clarus, -a, -um" },
      { form:"dexter, dext(e)ra, dext(e)rum" },
      { form:"sanctus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"complures, -es, -(i)a", note:"δεν σχηματίζει παραθετικά" },
      { form:"immortalis, -is, -e", note:"deus immortalis: χωρίς κλητ. ενικού" },
      { form:"incredibilis, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"clarus, -a, -um", comp:"clarior, -ior, -ius", sup:"clarissimus, -a, -um" },
      { pos:"dexter, dext(e)ra, dext(e)rum", comp:"dexterior, -ior, -ius", sup:"dextimus, -a, -um" },
      { pos:"sanctus, -a, -um", comp:"sanctior, -ior, -ius", sup:"sanctissimus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"complures, -es, -(i)a", comp:"—", sup:"—" },
      { pos:"immortalis, -is, -e", comp:"—", sup:"—" },
      { pos:"incredibilis, -is, -e", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική", extra:"ως οριστική" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"—, sui, sibi, se, —, a se", kind:"Προσωπική", extra:"γ΄ προσώπου (αυτοπαθής)" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"appropinquo", perf:"appropinquavi", sup:"appropinquatum", inf:"appropinquare", note:"" },
      { pres:"conloco", perf:"conlocavi", sup:"conlocatum", inf:"conlocare", note:"" },
      { pres:"consecro", perf:"consecravi", sup:"consecratum", inf:"consecrare", note:"" },
      { pres:"existimo", perf:"existimavi", sup:"existimatum", inf:"existimare", note:"" },
      { pres:"nuntio", perf:"nuntiavi", sup:"nuntiatum", inf:"nuntiare", note:"" },
      { pres:"resero", perf:"reseravi", sup:"reseratum", inf:"reserare", note:"" },
      { pres:"saluto", perf:"salutavi", sup:"salutatum", inf:"salutare", note:"" },
      { pres:"admiror", perf:"admiratus sum", sup:"—", inf:"admirari", note:"αποθετικό" },
      { pres:"osculor", perf:"osculatus sum", sup:"—", inf:"osculari", note:"αποθετικό" },
      { pres:"veneror", perf:"veneratus sum", sup:"—", inf:"venerari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"iubeo", perf:"iussi", sup:"iussum", inf:"iubere", note:"" },
      { pres:"soleo", perf:"solitus sum", sup:"—", inf:"solere", note:"ημιαποθετικό" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"abicio", perf:"abieci", sup:"abiectum", inf:"abicere", note:"15 σε -io" },
      { pres:"animadverto", perf:"animadverti", sup:"animadversum", inf:"animadvertere", note:"" },
      { pres:"capio", perf:"cepi", sup:"captum", inf:"capere", note:"15 σε -io" },
      { pres:"intromitto", perf:"intromisi", sup:"intromissum", inf:"intromittere", note:"" },
      { pres:"pono", perf:"posui", sup:"positum", inf:"ponere", note:"" },
      { pres:"refero", perf:"rettuli / retuli", sup:"relatum", inf:"referre", note:"ανώμαλο (σύνθ. του fero)" },
      { pres:"revertor", perf:"reversus sum / reverti", sup:"—", inf:"reverti", note:"ημιαποθ. (& αποθ.)" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"audio", perf:"audivi", sup:"auditum", inf:"audire", note:"" },
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ / ΠΑΓΙΔΕΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"Τα είδη του cum", body:"Στο κείμενο ο cum εμφανίζεται τρεις φορές: ιστορικός/διηγηματικός (+ υποτακτική) στις προτ. 1 και 12, και αιτιολογικός (+ υποτακτική) στην προτ. 4. Ο ut (προτ. 5) είναι χρονικός σύνδεσμος (+ οριστική) = όταν, μόλις — όχι τελικός/βουλητικός." },
    { tag:"Σουπίνο", title:"Τέσσερα σουπίνα", body:"salutatum, captum, admiratum: αιτιατική σουπίνου που εξαρτάται από ρήμα κίνησης (venerunt / venisse) και δηλώνει σκοπό. auditu: αφαιρετική σουπίνου που δηλώνει αναφορά και εξαρτάται από το incredibile." },
    { tag:"Απαρέμφατο", title:"se venisse: λατινισμός", body:"Στην προτ. 7 το ειδικό απαρέμφατο venisse έχει υποκείμενο se σε αιτιατική, αν και υπάρχει ταυτοπροσωπία (nuntiaverunt … se venisse). Πρόκειται για λατινισμό. Αντίθετα, στις προτ. 4 και 9 υπάρχει ετεροπροσωπία (eos venisse, fores reserari, eos intromitti)." },
    { tag:"Μετοχή", title:"abiectis armis", body:"Ιδιάζουσα αφαιρετική απόλυτη (χρονική μετοχή): το armis είναι υποκείμενο της μετοχής abiectis· δηλώνει το προτερόχρονο και έχει παθητική σημασία." },
    { tag:"Παράθεση", title:"incredibile auditu", body:"Προεξαγγελτική παράθεση στη φράση «virtutem eius admiratum se venisse». Προέρχεται από πρόταση «(quod/hoc) est incredibile auditu», όπου το incredibile θα ήταν κατηγορούμενο και το auditu αφαιρετική σουπίνου (αναφορά)." },
    { tag:"Ουσιαστικό", title:"domum: κίνηση σε τόπο", body:"Το domus (δ΄ κλ.) ως όνομα τόπου δηλώνει την κίνηση σε τόπο με σκέτη αιτιατική (domum), χωρίς πρόθεση· η στάση σε τόπο με domi και η κίνηση από τόπο με domo." }
  ]
};

export default UNIT;
