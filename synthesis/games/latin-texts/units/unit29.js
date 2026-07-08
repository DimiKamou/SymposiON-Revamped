// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 29
//  Ο Οκταβιανός, ο παπουτσής και το κοράκι  (Lectio XXIX)
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 29,
  title: "Ο Οκταβιανός, ο παπουτσής και το κοράκι",
  latinTitle: "Lectio XXIX",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως. Εννοείται: το ρήμα occurrit είναι ο πυρήνας της.", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο occurrit. Εισάγεται με τον ιστορικό/διηγηματικό cum (σε διηγήσεις του παρελθόντος)· εκφέρεται με υποτακτική, γιατί ο ιστορικός cum υπογραμμίζει τη βαθύτερη σχέση κύριας–δευτερεύουσας (σχέση αιτίου–αιτιατού, υποκειμενικό στοιχείο)· υποτακτική παρατατικού (rediret), γιατί εξαρτάται από ιστορικό χρόνο και δηλώνει το σύγχρονο στο παρελθόν.", kids:[
          { l:"Cum", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (ιστορικός/διηγηματικός) — + υποτακτική", d:"cum — όταν" },
          { l:"Octavianus", r:"Υποκείμενο", to:"στο rediret", g:"ονομ. ενικ., αρσ.", d:"Octavianus, -i (αρσ. β΄) — ο Οκταβιανός" },
          { l:"post victoriam", k:"victoria", r:"Εμπρόθετος επιρρ. προσδ. του χρόνου", to:"στο rediret", g:"post (πρόθ. + αιτ.) + victoriam (αιτ. ενικ.)", d:"post — μετά, ύστερα· victoria, -ae (θηλ. α΄) — η νίκη" },
          { l:"Actiacam", r:"Επιθετικός προσδ.", to:"στο victoriam", g:"αιτ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"Actiacus, -a, -um — Ακτιακός, του Ακτίου" },
          { l:"Romam", r:"Αιτιατική της κατεύθυνσης (κίνηση σε τόπο)", to:"στο rediret", g:"αιτ. ενικ.", d:"Roma, -ae (θηλ. α΄) — η Ρώμη (χωρίς πληθ.)" },
          { l:"rediret", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. ενεργ. — ανώμαλο", d:"redeo, redi(v)i, reditum, redire — επιστρέφω", a:"," }
        ]},
        { l:"homo", r:"Υποκείμενο", to:"στο occurrit", g:"ονομ. ενικ.", d:"homo, hominis (αρσ. γ΄) — ο άνθρωπος" },
        { l:"quidam", r:"Επιθετικός προσδ.", to:"στο homo", g:"ονομ. ενικ., αρσ. — επιθετική αόριστη αντων.", d:"quidam, quaedam, quoddam — κάποιος, κάποια, κάποιο" },
        { l:"ei", r:"Αντικείμενο", to:"στο occurrit", g:"δοτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός, αυτή, αυτό", note:"Το occurro συντάσσεται με δοτική → το ei είναι αντικείμενο (όχι εμπρόθετο)." },
        { l:"occurrit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. (+ δοτ.)", d:"occurro, occurri/occucurri, occursum, occurrere (3) — πηγαίνω να συναντήσω" },
        { l:"corvum", r:"Αντικείμενο", to:"στη μτχ. tenens", g:"αιτ. ενικ.", d:"corvus, -i (αρσ. β΄) — το κοράκι" },
        { l:"tenens", r:"Τροπική μετοχή", to:"συνημμένη στο homo", g:"ονομ. ενικ., αρσ. — μτχ. ενεστ. ενεργ.", d:"teneo, tenui, tentum, tenere (2) — κρατώ", note:"Κατ' άλλη εκδοχή: επιθετική μτχ., επιθετικός προσδ. στο homo.", a:";" }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { l:"eum", r:"Άμεσο αντικ. & υποκ. απαρεμφάτου", to:"στο instituerat / dicere", g:"αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός, αυτή, αυτό", note:"Άμεσο αντικ. του instituerat και υποκ. του dicere (ετεροπροσωπία)." },
        { l:"instituerat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσυντ. ενεργ.", d:"instituo, institui, institutum, instituere (3) — διδάσκω", note:"Εννοούμενο υποκείμενο: homo." },
        { l:"haec", r:"Αντικείμενο", to:"στο dicere", g:"αιτ. πληθ., ουδ. — δεικτική αντων.", d:"hic, haec, hoc — αυτός, αυτή, αυτό" },
        { l:"dicere", r:"Τελικό απαρέμφατο (έμμεσο αντικ.)", to:"στο instituerat", g:"απαρέμφατο ενεστ. ενεργ.", d:"dico, dixi, dictum, dicere (3) — λέω (προστ. dic)", a:":" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (επιθυμίας)", note:"Κύρια πρόταση επιθυμίας — το περιεχόμενο του χαιρετισμού.", kids:[
        { l:"«", plain:true },
        { l:"Ave", r:"Ρήμα", g:"β΄ ενικ. προστ. ενεστ. ενεργ. — ελλειπτικό ρήμα", d:"aveo, —, —, avere (2) — χαίρω (εύχρηστο μόνο σε προστ. & απαρέμφ.)", note:"Εννοούμενο υποκείμενο: tu.", a:"," },
        { l:"Caesar", r:"Κλητική προσφώνηση", g:"κλητ. ενικ.", d:"Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας", a:"," },
        { l:"victor", r:"Επιθετικός προσδ.", to:"στο imperator", g:"κλητ. ενικ.", d:"victor, victoris (αρσ. γ΄) — ο νικητής" },
        { l:"imperator", r:"Παράθεση", to:"στο Caesar", g:"κλητ. ενικ.", d:"imperator, imperatoris (αρσ. γ΄) — ο στρατηγός", a:"»." }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως (με απρόσωπο ρήμα).", kids:[
        { l:"Caesaris", r:"Γενική του ενδιαφερομένου προσώπου", to:"στο interfuit", g:"γεν. ενικ.", d:"Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας" },
        { l:"multum", r:"Επιρρ. προσδ. του ποσού", to:"στο interfuit", g:"ποσοτικό επίρρημα (ΣΥΓΚΡ. plus, ΥΠΕΡΘ. plurimum)", d:"multum — πολύ" },
        { l:"interfuit", r:"Ρήμα (απρόσωπο)", g:"γ΄ ενικ. οριστ. παρακ. — απρόσωπο", d:"interest, interfuit, —, interesse — ενδιαφέρει" },
        { l:"corvum", r:"Αντικείμενο", to:"στο emere", g:"αιτ. ενικ.", d:"corvus, -i (αρσ. β΄) — το κοράκι" },
        { l:"emere", r:"Τελικό απαρέμφατο (υποκ. του interfuit)", to:"στο interfuit", g:"απαρέμφατο ενεστ. ενεργ.", d:"emo, emi, emptum, emere (3) — αγοράζω", note:"Εννοούμενο υποκ. του emere: Caesarem (ετεροπροσωπία).", a:";" }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { l:"eum", r:"Αντικείμενο", to:"στο emit", g:"αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός, αυτή, αυτό" },
        { l:"emit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ.", d:"emo, emi, emptum, emere (3) — αγοράζω", note:"Εννοούμενο υποκείμενο: Caesar." },
        { l:"itaque", r:"Συμπερασματικός σύνδεσμος", g:"συμπερασματικός (παρατακτικός) σύνδεσμος", d:"itaque — επομένως, λοιπόν" },
        { l:"viginti", r:"Επιθετικός προσδ.", to:"στο milibus", g:"άκλιτο απόλυτο αριθμητικό επίθετο", d:"viginti — είκοσι" },
        { l:"milibus", r:"Αφαιρετική της αξίας", to:"στο emit", g:"αφαιρ. πληθ., ουδ. — απόλυτο αριθμητικό γ΄ κλ. (πληθ. του άκλιτου mille)", d:"mille (πληθ. milia, -ium) — χίλιοι" },
        { l:"sestertium", r:"Γενική διαιρετική (ή του περιεχομένου)", to:"στο milibus", g:"γεν. πληθ. (τύπος sestertium)", d:"sestertius, -ii (αρσ. β΄) — ο σηστέρτιος (νόμισμα)", a:"." }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { l:"Id", r:"Επιθετικός προσδ.", to:"στο exemplum", g:"ονομ. ενικ., ουδ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός, αυτή, αυτό" },
        { l:"exemplum", r:"Υποκείμενο", to:"στο incitavit", g:"ονομ. ενικ.", d:"exemplum, -i (ουδ. β΄) — το παράδειγμα" },
        { l:"sutorem", r:"Άμεσο αντικείμενο", to:"στο incitavit", g:"αιτ. ενικ.", d:"sutor, sutoris (αρσ. γ΄) — ο παπουτσής" },
        { l:"quendam", r:"Επιθετικός προσδ.", to:"στο sutorem", g:"αιτ. ενικ., αρσ. — επιθετική αόριστη αντων.", d:"quidam, quaedam, quoddam — κάποιος, κάποια, κάποιο" },
        { l:"incitavit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ.", d:"incito, incitavi, incitatum, incitare (1) — παρακινώ", a:"," },
        { type:"sub", key:"voulitiki", label:"Βουλητική", note:"Δευτ. ουσιαστική βουλητική πρόταση, ως αντικείμενο του incitavit. Εισάγεται με τον βουλητικό σύνδεσμο ut (καταφατική)· εκφέρεται με υποτακτική, γιατί το περιεχόμενό της είναι απλώς επιθυμητό· υποτακτική παρατατικού (doceret), γιατί εξαρτάται από ιστορικό χρόνο (incitavit). Υπάρχει ιδιομορφία στην ακολουθία των χρόνων (η βούληση ιδωμένη τη στιγμή που εμφανίζεται — συγχρονισμός κύριας/δευτ.).", kids:[
          { l:"ut", r:"Βουλητικός σύνδεσμος", g:"βουλητικός σύνδεσμος — + υποτακτική", d:"ut — να" },
          { l:"doceret", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. ενεργ.", d:"doceo, docui, doctum, docere (2) — διδάσκω, μαθαίνω", note:"Εννοούμενο υποκείμενο: sutor." },
          { l:"corvum", r:"Άμεσο αντικείμενο", to:"στο doceret", g:"αιτ. ενικ.", d:"corvus, -i (αρσ. β΄) — το κοράκι" },
          { l:"parem", r:"Επιθετικός προσδ.", to:"στο salutationem", g:"αιτ. ενικ., θηλ. — επίθ. γ΄ κλ.", d:"par, par, par (γεν. paris) — ίδιος, ίδια, ίδιο" },
          { l:"salutationem", r:"Έμμεσο αντικείμενο", to:"στο doceret", g:"αιτ. ενικ.", d:"salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός", a:"." }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { l:"Diu", r:"Επιρρ. προσδ. του χρόνου", to:"στο impendebat", g:"χρονικό επίρρημα (ΣΥΓΚΡ. diutius, ΥΠΕΡΘ. diutissime)", d:"diu — για πολύ καιρό" },
        { l:"frustra", r:"Επιρρ. προσδ. του τρόπου", to:"στο impendebat", g:"τροπικό επίρρημα", d:"frustra — μάταια" },
        { l:"impendebat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ.", d:"impendo, impendi, impensum, impendere (3) — ξοδεύω", note:"Εννοούμενο υποκείμενο: sutor." },
        { l:"operam", r:"Αντικείμενο", to:"στο impendebat", g:"αιτ. ενικ.", d:"opera, -ae (θηλ. α΄) — ο κόπος (πληθ. operae, -arum = οι μισθωτοί εργάτες — ετερόσημο)", a:";" }
      ]}
    ]},

    { n: 7, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική πρόταση, ως επιρρ. προσδ. του χρόνου στο solebat. Εισάγεται με τον σύνδεσμο quotiescumque (ισοδυναμεί με τον επαναληπτικό cum)· εκφέρεται με οριστική, γιατί η πράξη μάς ενδιαφέρει μόνο από χρονική άποψη· οριστική παρατατικού, γιατί δηλώνει επανάληψη στο παρελθόν (σύγχρονο).", kids:[
          { l:"quotiescumque", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (ισοδ. με επαναληπτικό cum) — + οριστική", d:"quotiescumque — κάθε φορά που, όταν" },
          { l:"avis", r:"Υποκείμενο", to:"στο respondebat", g:"ονομ. ενικ.", d:"avis, avis (θηλ. γ΄) — το πουλί (αφαιρ. ave/avi, γεν. πληθ. avium)" },
          { l:"non", r:"Άρνηση", to:"στο respondebat", g:"αρνητικό μόριο", d:"non — όχι, δεν" },
          { l:"respondebat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ.", d:"respondeo, respondi, responsum, respondere (2) — απαντώ", a:"," }
        ]},
        { l:"sutor", r:"Υποκείμενο", to:"στο solebat", g:"ονομ. ενικ.", d:"sutor, sutoris (αρσ. γ΄) — ο παπουτσής" },
        { l:"dicere", r:"Τελικό απαρέμφατο (αντικ.)", to:"στο solebat", g:"απαρέμφατο ενεστ. ενεργ.", d:"dico, dixi, dictum, dicere (3) — λέω", note:"Υποκ. του dicere: sutor (ταυτοπροσωπία)." },
        { l:"solebat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. — ημιαποθετικό", d:"soleo, solitus sum, solere (2, ημιαποθ.) — συνηθίζω", a:":" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως — τα λόγια του παπουτσή.", kids:[
        { l:"«", plain:true },
        { l:"Oleum", r:"Αντικείμενο", to:"στο perdidi", g:"αιτ. ενικ.", d:"oleum, -i (ουδ. β΄) — το λάδι" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"operam", r:"Αντικείμενο", to:"στο perdidi", g:"αιτ. ενικ.", d:"opera, -ae (θηλ. α΄) — ο κόπος (πληθ. operae, -arum — ετερόσημο)" },
        { l:"perdidi", r:"Ρήμα", g:"α΄ ενικ. οριστ. παρακ. ενεργ.", d:"perdo, perdidi, perditum, perdere (3) — χάνω", note:"Εννοούμενο υποκείμενο: ego.", a:"»." }
      ]}
    ]},

    { n: 8, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { l:"Tandem", r:"Επιρρ. προσδ. του χρόνου", to:"στο didicit", g:"χρονικό επίρρημα", d:"tandem — επιτέλους" },
        { l:"corvus", r:"Υποκείμενο", to:"στο didicit", g:"ονομ. ενικ.", d:"corvus, -i (αρσ. β΄) — το κοράκι" },
        { l:"salutationem", r:"Αντικείμενο", to:"στο didicit", g:"αιτ. ενικ.", d:"salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός" },
        { l:"didicit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ.", d:"disco, didici, —, discere (3) — μαθαίνω" }
      ]},
      { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως, συνδεδεμένη παρατακτικά με την προηγούμενη.", kids:[
        { l:"sutor", r:"Υποκείμενο", to:"στο attulit", g:"ονομ. ενικ.", d:"sutor, sutoris (αρσ. γ΄) — ο παπουτσής", a:"," },
        { l:"cupidus", r:"Επιρρ. κατηγορούμενο του τρόπου", to:"στο sutor (μέσω του attulit)", g:"ονομ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"cupidus, -a, -um — αυτός που επιθυμεί" },
        { l:"pecuniae", r:"Γενική αντικειμενική (συμπλήρωμα)", to:"στο cupidus", g:"γεν. ενικ.", d:"pecunia, -ae (θηλ. α΄) — τα χρήματα, η αμοιβή", a:"," },
        { l:"eum", r:"Άμεσο αντικείμενο", to:"στο attulit", g:"αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός, αυτή, αυτό" },
        { l:"Caesari", r:"Έμμεσο αντικείμενο", to:"στο attulit", g:"δοτ. ενικ.", d:"Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας" },
        { l:"attulit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. — ανώμαλο (σύνθ. του fero)", d:"adfero/affero, attuli, allatum, adferre/afferre — φέρνω (σε κάποιον) (προστ. adfer/affer)", a:"." }
      ]}
    ]},

    { n: 9, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { l:"Audita", r:"Χρονική μετοχή (ιδιάζουσα αφαιρετική απόλυτη)", g:"αφαιρ. ενικ., θηλ. — μτχ. παρακ. παθ.", d:"audio, audivi, auditum, audire (4) — ακούω", note:"Ιδιάζουσα (γνήσια) αφαιρετική απόλυτη με ρηματικό τύπο του audio." },
        { l:"salutatione", r:"Υποκείμενο μετοχής", to:"στη μτχ. audita", g:"αφαιρ. ενικ.", d:"salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός" },
        { l:"Caesar", r:"Υποκείμενο", to:"στο dixit", g:"ονομ. ενικ.", d:"Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας" },
        { l:"dixit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ.", d:"dico, dixi, dictum, dicere (3) — λέω (προστ. dic)", a:":" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως — τα λόγια του Καίσαρα.", kids:[
        { l:"«", plain:true },
        { l:"Domi", r:"Επιρρ. προσδ. της στάσης σε τόπο", to:"στο audio", g:"γεν. ενικ. (παλιά τοπική) του domus, -us (θηλ. δ΄)", d:"domus, -us (θηλ. δ΄) — το σπίτι (domi = στο σπίτι — υπόλειμμα τοπικής)" },
        { l:"satis", r:"Επιρρ. προσδ. του ποσού", to:"στο audio", g:"ποσοτικό επίρρημα (ΣΥΓΚΡ. satius)", d:"satis — αρκετά" },
        { l:"salutationum", r:"Γενική διαιρετική", to:"στο satis", g:"γεν. πληθ.", d:"salutatio, salutationis (θηλ. γ΄) — ο χαιρετισμός" },
        { l:"talium", r:"Επιθετικός προσδ.", to:"στο salutationum", g:"γεν. πληθ., θηλ. — δεικτική αντων.", d:"talis, talis, tale — τέτοιος, τέτοια, τέτοιο" },
        { l:"audio", r:"Ρήμα", g:"α΄ ενικ. οριστ. ενεστ. ενεργ.", d:"audio, audivi, auditum, audire (4) — ακούω", note:"Εννοούμενο υποκείμενο: ego.", a:"»." }
      ]}
    ]},

    { n: 10, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως — με απρόσωπη έκφραση (venit in mentem).", kids:[
        { l:"Tum", r:"Επιρρ. προσδ. του χρόνου", to:"στην έκφραση venit in mentem", g:"χρονικό επίρρημα", d:"tum — τότε" },
        { l:"corvo", r:"Δοτική προσωπική", to:"στην έκφραση venit in mentem", g:"δοτ. ενικ.", d:"corvus, -i (αρσ. β΄) — το κοράκι" },
        { l:"venit", r:"Ρήμα (απρόσωπη έκφραση)", g:"γ΄ ενικ. οριστ. παρακ. ενεργ.", d:"venio, veni, ventum, venire (4) — έρχομαι· venit in mentem = θυμάμαι", note:"Απρόσ. έκφραση venit in mentem· εννοούμενο υποκείμενο: memoria." },
        { l:"in mentem", k:"mens", r:"Εμπρόθετος (κατεύθυνση μεταφορικά) — μέρος της απρόσ. έκφρασης", g:"in (πρόθ. + αιτ.) + mentem (αιτ. ενικ.)", d:"in — σε, προς· mens, mentis (θηλ. γ΄) — ο νους, το μυαλό (γεν. πληθ. mentium)" },
        { l:"verborum", r:"Αντικείμενο (της έκφρασης venit in mentem)", to:"στην έκφραση venit in mentem", g:"γεν. πληθ.", d:"verbum, -i (ουδ. β΄) — ο λόγος" },
        { l:"domini", r:"Γενική υποκειμενική", to:"στο verborum", g:"γεν. ενικ.", d:"dominus, -i (αρσ. β΄) — ο κύριος, το αφεντικό" },
        { l:"sui", r:"Επιθετικός προσδ.", to:"στο domini", g:"γεν. ενικ., αρσ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)", d:"suus, sua, suum — δικός του, δική του, δικό του", note:"Εκφράζει άμεση αυτοπάθεια.", a:":" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως — τα λόγια του κυρίου, όπως τα θυμήθηκε το κοράκι.", kids:[
        { l:"«", plain:true },
        { l:"Oleum", r:"Αντικείμενο", to:"στο perdidi", g:"αιτ. ενικ.", d:"oleum, -i (ουδ. β΄) — το λάδι" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"operam", r:"Αντικείμενο", to:"στο perdidi", g:"αιτ. ενικ.", d:"opera, -ae (θηλ. α΄) — ο κόπος (πληθ. operae, -arum — ετερόσημο)" },
        { l:"perdidi", r:"Ρήμα", g:"α΄ ενικ. οριστ. παρακ. ενεργ.", d:"perdo, perdidi, perditum, perdere (3) — χάνω", note:"Εννοούμενο υποκείμενο: ego.", a:"»." }
      ]}
    ]},

    { n: 11, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως.", kids:[
        { l:"ad haec verba", k:"verbum", r:"Εμπρόθετος επιρρ. προσδ. της αναφοράς", to:"στο risit", g:"ad (πρόθ. + αιτ.) + haec (αιτ. πληθ., ουδ., δεικτ. αντων.) + verba (αιτ. πληθ.)", d:"ad — σε, προς (εδώ: για)· hic, haec, hoc — αυτός· verbum, -i (ουδ. β΄) — ο λόγος", note:"haec: επιθετικός προσδ. στο verba." },
        { l:"Augustus", r:"Υποκείμενο", to:"στο risit", g:"ονομ. ενικ.", d:"Augustus, -i (αρσ. β΄) — ο Αύγουστος" },
        { l:"risit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ.", d:"rideo, risi, risum, ridere (2) — γελώ" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Κύρια πρόταση κρίσεως, συνδεδεμένη παρατακτικά (με το εγκλιτικό -que) με την προηγούμενη.", kids:[
        { l:"emitque", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. (+ εγκλιτικό -que)", d:"emo, emi, emptum, emere (3) — αγοράζω", note:"Εννοούμενο υποκ.: Augustus. -que: συμπλεκτικός (παρατακτικός) σύνδεσμος = και (εγκλιτικός), συνδέει με την προηγούμενη κύρια." },
        { l:"avem", r:"Αντικείμενο", to:"στο emit", g:"αιτ. ενικ.", d:"avis, avis (θηλ. γ΄) — το πουλί (αφαιρ. ave/avi, γεν. πληθ. avium)" },
        { l:"tanti", r:"Γενική της αξίας", to:"στο emit", g:"γεν. ενικ., ουδ. — δεικτική αντων.", d:"tantus, -a, -um — τόσος, τόση, τόσο", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική (επιθετική) προσδιοριστική πρόταση στο tanti (της κύριας). Εισάγεται με την αναφορική αντωνυμία quanti· εκφέρεται με οριστική, γιατί δηλώνει το πραγματικό· οριστική υπερσυντελίκου (emerat), αναφέρεται στο παρελθόν.", kids:[
          { l:"quanti", r:"Γενική της αξίας", to:"στο emerat", g:"γεν. ενικ., ουδ. — αναφορική αντων.", d:"quantus, -a, -um — όσος, όση, όσο" },
          { l:"nullam", r:"Επιθετικός προσδ.", to:"στο (εννοούμενο) avem", g:"αιτ. ενικ., θηλ. — αόριστη επιθετική αντων.", d:"nullus, -a, -um — κανένας, καμία, κανένα" },
          { l:"adhuc", r:"Επιρρ. προσδ. του χρόνου", to:"στο emerat", g:"χρονικό επίρρημα", d:"adhuc — μέχρι τότε" },
          { l:"emerat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσυντ. ενεργ.", d:"emo, emi, emptum, emere (3) — αγοράζω", note:"Εννοούμενα: Augustus (υποκ.), avem (αντικ.).", a:"." }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Cum Octavianus", el:"Όταν ο Οκταβιανός" },
    { la:"rediret Romam", el:"επέστρεφε στη Ρώμη" },
    { la:"post victoriam Actiacam,", el:"μετά τη νίκη (του) στο Άκτιο" },
    { la:"quidam homo", el:"κάποιος άνδρας" },
    { la:"ei occurrit", el:"πήγε να τον συναντήσει" },
    { la:"tenens corvum;", el:"κρατώντας (ένα) κοράκι·" },
    { la:"instituerat eum", el:"το είχε διδάξει" },
    { la:"dicere haec:", el:"να λέει τα εξής:" },
    { la:"«Ave, Caesar,", el:"«Χαίρε, Καίσαρα," },
    { la:"victor imperator».", el:"νικητή στρατηγέ!»." },
    { la:"Caesaris interfuit multum", el:"Ο Καίσαρας ενδιαφέρθηκε πολύ" },
    { la:"emere corvum;", el:"να αγοράσει το κοράκι·" },
    { la:"eum emit itaque", el:"το αγόρασε λοιπόν" },
    { la:"viginti milibus sestertium.", el:"για είκοσι χιλιάδες σηστερτίους." },
    { la:"Id exemplum incitavit", el:"Το παράδειγμα αυτό παρακίνησε" },
    { la:"quendam sutorem,", el:"κάποιον παπουτσή" },
    { la:"ut doceret corvum", el:"να μάθει σε ένα κοράκι" },
    { la:"parem salutationem.", el:"τον ίδιο χαιρετισμό." },
    { la:"Diu frustra", el:"Για πολύ καιρό μάταια" },
    { la:"impendebat operam;", el:"ξόδευε τον κόπο του·" },
    { la:"quotiescumque avis", el:"κάθε φορά που το πουλί" },
    { la:"non respondebat,", el:"δεν απαντούσε," },
    { la:"sutor solebat dicere", el:"ο παπουτσής συνήθιζε να λέει:" },
    { la:"«Perdidi oleum", el:"«Πάει χαμένο το λάδι" },
    { la:"et operam».", el:"και ο κόπος μου»." },
    { la:"Tandem corvus", el:"Επιτέλους το κοράκι" },
    { la:"didicit salutationem", el:"έμαθε τον χαιρετισμό" },
    { la:"et sutor,", el:"και ο παπουτσής," },
    { la:"cupidus pecuniae,", el:"επιθυμώντας τα χρήματα," },
    { la:"eum attulit Caesari.", el:"το έφερε στον Καίσαρα." },
    { la:"Audita salutatione", el:"Μόλις άκουσε τον χαιρετισμό," },
    { la:"Caesar dixit:", el:"ο Καίσαρας είπε:" },
    { la:"«Domi audio", el:"«Στο σπίτι μου ακούω" },
    { la:"satis talium salutationum».", el:"αρκετούς τέτοιους χαιρετισμούς»." },
    { la:"Tum corvo", el:"Τότε το κοράκι" },
    { la:"venit in mentem", el:"θυμήθηκε" },
    { la:"verborum domini sui:", el:"τα λόγια του κυρίου του:" },
    { la:"«Perdidi oleum", el:"«Πάει χαμένο το λάδι" },
    { la:"et operam».", el:"και ο κόπος μου»." },
    { la:"Augustus risit", el:"Ο Αύγουστος γέλασε" },
    { la:"ad haec verba", el:"με αυτά τα λόγια" },
    { la:"emitque avem", el:"και αγόρασε το πουλί" },
    { la:"tanti,", el:"για τόσο μεγάλο ποσό," },
    { la:"quanti nullam emerat", el:"όσο δεν είχε αγοράσει κανένα" },
    { la:"adhuc.", el:"μέχρι τότε." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"opera, -ae", note:"πληθ. operae, -arum (ετερόσημο)" },
        { form:"pecunia, -ae" },
        { form:"Roma, -ae", note:"δεν έχει πληθ." },
        { form:"victoria, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Augustus, -i" },
        { form:"corvus, -i" },
        { form:"dominus, -i" },
        { form:"Octavianus, -i" },
        { form:"sestertius, -ii", note:"γεν. πληθ. sestertium" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"exemplum, -i", note:"παράλληλος τύπος γ΄ κλ.: exemplar, -aris" },
        { form:"oleum, -i" },
        { form:"verbum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Caesar, Caesaris" },
        { form:"homo, hominis" },
        { form:"imperator, imperatoris" },
        { form:"sutor, sutoris" },
        { form:"victor, victoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"avis, avis", note:"αφαιρ. ave/avi, γεν. πληθ. avium" },
        { form:"mens, mentis", note:"γεν. πληθ. mentium" },
        { form:"salutatio, salutationis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"domus, -us", note:"γεν. domus/domi, αφαιρ. domo, αιτ. πληθ. domos· domi (τοπική)" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"Actiacus, -a, -um" },
      { form:"cupidus, -a, -um" },
      { form:"viginti", note:"άκλιτο απόλυτο αριθμητικό" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"par, par, par", note:"γεν. paris" },
      { form:"milia, -ium", note:"απόλυτο αριθμητικό — πληθ. του άκλιτου mille" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"Actiacus, -a, -um", comp:"—", sup:"—" },
      { pos:"cupidus, -a, -um", comp:"cupidior, -ior, -ius", sup:"cupidissimus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"par, par, par", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"hic, haec, hoc", kind:"Δεικτική" },
    { form:"nullus, -a, -um", kind:"Αόριστη επιθετική" },
    { form:"quantus, -a, -um", kind:"Αναφορική" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ένας κτήτορας" },
    { form:"talis, talis, tale", kind:"Δεικτική" },
    { form:"tantus, -a, -um", kind:"Δεικτική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"incito", perf:"incitavi", sup:"incitatum", inf:"incitare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"doceo", perf:"docui", sup:"doctum", inf:"docere", note:"" },
      { pres:"respondeo", perf:"respondi", sup:"responsum", inf:"respondere", note:"" },
      { pres:"rideo", perf:"risi", sup:"risum", inf:"ridere", note:"" },
      { pres:"soleo", perf:"solitus sum", sup:"—", inf:"solere", note:"ημιαποθετικό" },
      { pres:"teneo", perf:"tenui", sup:"tentum", inf:"tenere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"προστ. dic" },
      { pres:"disco", perf:"didici", sup:"—", inf:"discere", note:"" },
      { pres:"emo", perf:"emi", sup:"emptum", inf:"emere", note:"" },
      { pres:"impendo", perf:"impendi", sup:"impensum", inf:"impendere", note:"" },
      { pres:"instituo", perf:"institui", sup:"institutum", inf:"instituere", note:"" },
      { pres:"occurro", perf:"occurri / occucurri", sup:"occursum", inf:"occurrere", note:"" },
      { pres:"perdo", perf:"perdidi", sup:"perditum", inf:"perdere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"audio", perf:"audivi", sup:"auditum", inf:"audire", note:"" },
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ / ΕΛΛΕΙΠΤΙΚΑ / ΑΠΡΟΣΩΠΑ", rows:[
      { pres:"aveo", perf:"—", sup:"—", inf:"avere", note:"ελλειπτικό (μόνο προστ. & απαρέμφ.)" },
      { pres:"affero / adfero", perf:"attuli", sup:"allatum", inf:"afferre / adferre", note:"ανώμαλο (σύνθ. του fero)" },
      { pres:"redeo", perf:"redi(v)i", sup:"reditum", inf:"redire", note:"ανώμαλο (σύνθ. του eo)" },
      { pres:"interest", perf:"interfuit", sup:"—", inf:"interesse", note:"απρόσωπο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ / ΠΑΓΙΔΕΣ ────────────────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"Ιστορικός/διηγηματικός cum", body:"Το «Cum ... rediret» εκφέρεται με υποτακτική (παρατατικού), γιατί ο ιστορικός cum υπογραμμίζει τη βαθύτερη σχέση κύριας–δευτερεύουσας (σχέση αιτίου–αιτιατού). Δηλώνει το σύγχρονο στο παρελθόν." },
    { tag:"Απρόσωπο", title:"interest / interfuit", body:"Το «Caesaris multum interfuit corvum emere»: interfuit = απρόσωπο ρήμα· Caesaris = γενική του ενδιαφερομένου προσώπου· emere = υποκείμενο (τελικό απαρέμφατο) με εννοούμενο υποκ. Caesarem (ετεροπροσωπία)." },
    { tag:"Έκφραση", title:"venit in mentem", body:"Απρόσωπη έκφραση = θυμάμαι. Εννοούμενο υποκείμενο: memoria· corvo = δοτική προσωπική· verborum = αντικείμενο (γενική). Το «in mentem» δηλώνει κατεύθυνση μεταφορικά." },
    { tag:"Πτώση", title:"Αξία: αφαιρετική vs γενική", body:"Η αξία εκφράζεται με αφαιρετική (viginti milibus = αφαιρετική της αξίας) αλλά και με γενική (tanti, quanti = γενική της αξίας). Το sestertium είναι γενική διαιρετική στο milibus." },
    { tag:"Τόπος", title:"domi (τοπική) — Romam", body:"Το domi (γενική/παλιά τοπική) δηλώνει στάση σε τόπο (= στο σπίτι). Το Romam είναι αιτιατική της κατεύθυνσης χωρίς πρόθεση (κίνηση σε τόπο)." },
    { tag:"Προσδιορισμός", title:"cupidus + γενική / κατηγορούμενο", body:"Το cupidus είναι επιρρηματικό κατηγορούμενο του τρόπου στο sutor (μέσω του attulit) και συντάσσεται με γενική αντικειμενική (pecuniae) ως συμπλήρωμα." }
  ]
};

export default UNIT;
