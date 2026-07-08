// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 23
//  Δομή ίδια με το template (unit16.js): periods -> kids, alignment, πίνακες, sos.
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 23,
  title: "Ένας υπέροχος άνθρωπος",
  latinTitle: "Lectio XXIII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Aegrotabat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής", d:"aegroto, aegrotavi, aegrotatum, aegrotare (1) — είμαι άρρωστος" },
        { l:"Caecina", r:"Υποκείμενο", to:"στο Aegrotabat", g:"ονομ. ενικ., αρσ.", d:"Caecina, -ae (αρσ. α΄) — ο Καικίνας" },
        { l:"Paetus", r:"Υποκείμενο", to:"στο Aegrotabat", g:"ονομ. ενικ., αρσ.", d:"Paetus, -i (αρσ. β΄) — ο Παίτος", note:"Μαζί με το Caecina αποτελεί το υποκείμενο (Caecina Paetus).", a:"," },
        { l:"maritus", r:"Παράθεση", to:"στο Caecina Paetus", g:"ονομ. ενικ., αρσ.", d:"maritus, -i (αρσ. β΄) — ο σύζυγος" },
        { l:"Arriae", r:"Γενική κτητική", to:"στο maritus", g:"γεν. ενικ., θηλ.", d:"Arria, -ae (θηλ. α΄) — η Αρρία", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"aegrotabat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής", d:"aegroto, aegrotavi, aegrotatum, aegrotare (1) — είμαι άρρωστος" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και (εδώ: επίσης)", note:"Δεν συνδέει τις προτάσεις· επιτείνει το filius (= και ο γιος)." },
        { l:"filius", r:"Υποκείμενο", to:"στο aegrotabat", g:"ονομ. ενικ., αρσ.", d:"filius, -ii/-i (αρσ. β΄) — ο γιος", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Filius", r:"Υποκείμενο", to:"στο mortuus est", g:"ονομ. ενικ., αρσ.", d:"filius, -ii/-i (αρσ. β΄) — ο γιος" },
        { l:"mortuus est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. — αποθετικό", d:"morior, mortuus sum, mori (3, αποθ.) — πεθαίνω", a:"." }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Arria", r:"Υποκείμενο", to:"στο paravit", g:"ονομ. ενικ., θηλ.", d:"Arria, -ae (θηλ. α΄) — η Αρρία" },
        { l:"paravit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"paro, paravi, paratum, parare (1) — ετοιμάζω" },
        { l:"huic", r:"Έμμεσο αντικείμενο", to:"στο paravit", g:"δοτ. ενικ., αρσ. — δεικτική αντων.", d:"hic, haec, hoc — αυτός, -ή, -ό" },
        { l:"funus", r:"Άμεσο αντικείμενο", to:"στο paravit", g:"αιτ. ενικ., ουδ.", d:"funus, funeris (ουδ. γ΄) — η κηδεία" },
        { l:"ita", r:"Επιρρ. προσδ. του τρόπου", to:"στο paravit", g:"τροπικό επίρρημα", d:"ita — έτσι, κατ' αυτόν τον τρόπο", a:"," },
        { type:"sub", key:"symperasmatiki", label:"Συμπερασματική", note:"Δευτ. επιρρηματική συμπερασματική, ως επιρρ. προσδ. του αποτελέσματος στο ita (paravit). Εισάγεται με το συμπερασματικό ut (καταφατική) και εκφέρεται με υποτακτική, γιατί το αποτέλεσμα θεωρείται υποκειμενική κατάσταση· υποτ. παρατατικού (ignoraretur) γιατί εξαρτάται από ιστορικό χρόνο (paravit). Ιδιομορφία στην ακολουθία των χρόνων.", kids:[
          { l:"ut", r:"Συμπερ. σύνδεσμος", g:"συμπερασματικός σύνδεσμος (+ υποτ.)", d:"ut — ώστε" },
          { l:"ignoraretur", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. παθ. φωνής", d:"ignoro, ignoravi, ignoratum, ignorare (1) — αγνοώ", note:"Υποκείμενο (εννοούμενο): funus." },
          { l:"a marito", k:"maritus", r:"Εμπρόθ. επιρρ. προσδ. του ποιητικού αιτίου", to:"στο ignoraretur", g:"a/ab (πρόθ. + αφαιρ.) + marito (αφαιρ. ενικ., αρσ.)", d:"a/ab — από· maritus, -i (αρσ. β΄) — ο σύζυγος", a:";" }
        ]}
      ]}
    ]},

    { n: 4, kids: [
      { l:"quin immo", r:"Σύνδεσμος", g:"αντιθετικός σύνδεσμος", d:"quin immo — όχι μόνο (αυτό) αλλά και, αλλά επιπλέον", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Arria.", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρηματική χρονική, ως επιρρ. προσδ. του χρόνου στο simulabat. Εισάγεται με τον επαναληπτικό χρονικό cum· εκφέρεται με οριστική υπερσυντελίκου (intraverat), γιατί δηλώνει αόριστη επανάληψη πραγματικού γεγονότος στο παρελθόν.", kids:[
          { l:"cum", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (επαναληπτικός, + οριστ.)", d:"cum — κάθε φορά που" },
          { l:"illa", r:"Υποκείμενο", to:"στο intraverat", g:"ονομ. ενικ., θηλ. — δεικτική αντων.", d:"ille, illa, illud — εκείνος, -η, -ο" },
          { l:"intraverat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσ. ενεργ. φωνής", d:"intro, intravi, intratum, intrare (1) — μπαίνω" },
          { l:"cubiculum", r:"Αντικείμενο", to:"στο intraverat", g:"αιτ. ενικ., ουδ.", d:"cubiculum, -i (ουδ. β΄) — η κρεβατοκάμαρα" },
          { l:"mariti", r:"Γενική κτητική", to:"στο cubiculum", g:"γεν. ενικ., αρσ.", d:"maritus, -i (αρσ. β΄) — ο σύζυγος", a:"," }
        ]},
        { l:"simulabat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής", d:"simulo, simulavi, simulatum, simulare (1) — προσποιούμαι" },
        { l:"filium", r:"Υποκείμενο ειδ. απαρεμφάτου", to:"στο vivere (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ.", d:"filius, -ii/-i (αρσ. β΄) — ο γιος" },
        { l:"vivere", r:"Αντικείμενο (ειδικό απαρέμφατο)", to:"στο simulabat", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"vivo, vixi, victum, vivere (3) — ζω", a:"," }
      ]},
      { l:"ac", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"ac — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Arria.", kids:[
        { l:"respondebat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής", d:"respondeo, respondi, responsum, respondere (2) — απαντώ" },
        { l:"marito", r:"Αντικείμενο", to:"στο respondebat", g:"δοτ. ενικ., αρσ.", d:"maritus, -i (αρσ. β΄) — ο σύζυγος" },
        { l:"persaepe", r:"Επιρρ. προσδ. του χρόνου", to:"στο interroganti", g:"χρονικό επίρρημα", d:"persaepe — πολύ συχνά" },
        { l:"interroganti", r:"Επιθετική μετοχή (επιθ. προσδ.)", to:"στο marito", g:"δοτ. ενικ., αρσ., ενεστ. μτχ. ενεργ. φωνής", d:"interrogo, interrogavi, interrogatum, interrogare (1) (inter+rogo) — ρωτώ", note:"Επιθετική (αναφορική) μετοχή, συνημμένη στο marito.", a:"," },
        { type:"sub", key:"plagia", label:"Πλάγια ερωτηματική", note:"Δευτ. ονοματική πλάγια ερωτηματική (μερικής αγνοίας), ως αντικείμενο στο interroganti. Εισάγεται με την ερωτηματική αντων. quid· εκφέρεται με υποτακτική (η εξάρτηση δίνει υποκειμενική χροιά), υποτ. παρατατικού (ageret) από ιστορικό χρόνο, δηλώνει το σύγχρονο.", kids:[
          { l:"quid", r:"Αντικείμενο", to:"στο ageret", g:"αιτ. ενικ., ουδ. — ερωτηματική (ουσιαστική) αντων.", d:"quis, quis, quid — ποιος, -α, -ο;" },
          { l:"ageret", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. ενεργ. φωνής", d:"ago, egi, actum, agere (3) — οδηγώ, κάνω" },
          { l:"puer", r:"Υποκείμενο", to:"στο ageret", g:"ονομ. ενικ., αρσ.", d:"puer, pueri (αρσ. β΄) — το παιδί", a:":" }
        ]}
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Ευθύς λόγος (τα λόγια της Αρρίας): «Bene quievit, libenter cibum sumpsit». Υποκείμενο (εννοούμενο): puer.", kids:[
        { l:"Bene", r:"Επιρρ. προσδ. του τρόπου", to:"στο quievit", g:"τροπικό επίρρημα (ΣΥΓΚΡ. melius, ΥΠΕΡΘ. optime)", d:"bene — καλά" },
        { l:"quievit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"quiesco, quievi, quietum, quiescere (3) — κοιμάμαι, ησυχάζω", note:"Υποκείμενο (εννοούμενο): puer.", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): puer.", kids:[
        { l:"libenter", r:"Επιρρ. προσδ. του τρόπου", to:"στο sumpsit", g:"τροπικό επίρρημα (ΣΥΓΚΡ. libentius, ΥΠΕΡΘ. libentissime)", d:"libenter — πρόθυμα, με όρεξη" },
        { l:"cibum", r:"Αντικείμενο", to:"στο sumpsit", g:"αιτ. ενικ., αρσ.", d:"cibus, -i (αρσ. β΄) — η τροφή" },
        { l:"sumpsit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"sumo, sumpsi, sumptum, sumere (3) — παίρνω", a:"»." }
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Arria.", kids:[
        { l:"Deinde", r:"Επιρρ. προσδ. του χρόνου", to:"στο egrediebatur", g:"χρονικό επίρρημα", d:"deinde — έπειτα", a:"," },
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρηματική χρονική, ως επιρρ. προσδ. του χρόνου στο egrediebatur. Εισάγεται με τον ιστορικό-διηγηματικό cum· εκφέρεται με υποτακτική (δηλώνει βαθύτερη σχέση αιτίας-αποτελέσματος), υποτ. παρατατικού (vincerent), δηλώνει το σύγχρονο.", kids:[
          { l:"cum", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (ιστορικός-διηγηματικός, + υποτ.)", d:"cum — όταν" },
          { l:"lacrimae", r:"Υποκείμενο", to:"στο vincerent", g:"ονομ. πληθ., θηλ.", d:"lacrima, -ae (θηλ. α΄) — το δάκρυ" },
          { l:"suae", r:"Επιθετικός προσδ.", to:"στο lacrimae", g:"ονομ. πληθ., θηλ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)", d:"suus, sua, suum — δικός του/της", a:"," },
          { l:"cohibitae", r:"Επιθετική μετοχή (επιθ. προσδ.)", to:"στο lacrimae", g:"ονομ. πληθ., θηλ., μτχ. παρακ. παθ. φωνής", d:"cohibeo, cohibui, cohibitum, cohibere (2) — συγκρατώ" },
          { l:"diu", r:"Επιρρ. προσδ. του χρόνου", to:"στο cohibitae", g:"χρονικό επίρρημα (ΣΥΓΚΡ. diutius, ΥΠΕΡΘ. diutissime)", d:"diu — για πολλή ώρα", a:"," },
          { l:"vincerent", r:"Ρήμα", g:"γ΄ πληθ. υποτ. παρατ. ενεργ. φωνής", d:"vinco, vici, victum, vincere (3) — νικώ" }
        ]},
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρηματική χρονική, συνδεδεμένη παρατακτικά (–que) με την προηγούμενη· εξαρτάται από κοινού από τον ιστορικό-διηγηματικό cum. Υποτ. παρατατικού (prorumperent), δηλώνει το σύγχρονο.", kids:[
          { l:"prorumperentque", r:"Ρήμα", g:"γ΄ πληθ. υποτ. παρατ. ενεργ. φωνής (+ εγκλιτικό –que)", d:"prorumpo, prorupi, proruptum, prorumpere (3) — ξεσπώ", note:"Υποκείμενο (εννοούμενο): lacrimae. Το –que (συμπλεκτικός) συνδέει τις δύο χρονικές.", a:"," }
        ]},
        { l:"egrediebatur", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. — αποθετικό", d:"egredior, egressus sum, egredi (3, αποθ.) — βγαίνω", a:";" }
      ]}
    ]},

    { n: 7, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Arria.", kids:[
        { l:"tum", r:"Επιρρ. προσδ. του χρόνου", to:"στο dabat", g:"χρονικό επίρρημα", d:"tum — τότε" },
        { l:"dabat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής", d:"do, dedi, datum, dare (1) — δίνω" },
        { l:"se", r:"Άμεσο αντικείμενο (άμεση αυτοπάθεια)", to:"στο dabat", g:"αιτ. ενικ., θηλ. — προσωπική (αυτοπαθής) αντων. γ΄ προσ.", d:"sui, sibi, se — (ο εαυτός) του/της" },
        { l:"dolori", r:"Έμμεσο αντικείμενο", to:"στο dabat", g:"δοτ. ενικ., αρσ.", d:"dolor, doloris (αρσ. γ΄) — ο πόνος, η θλίψη" }
      ]},
      { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Arria.", kids:[
        { l:"paulo", r:"Αφαιρετική του μέτρου/της διαφοράς", to:"στο post", g:"αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ.", d:"paulus, -a, -um — λίγος", note:"Δεν σχηματίζει παραθετικά." },
        { l:"post", r:"Επιρρ. προσδ. του χρόνου", to:"στο redibat", g:"χρονικό επίρρημα", d:"post — αργότερα" },
        { l:"redibat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής — ανώμαλο", d:"redeo, redii/redivi, reditum, redire (ανώμ., red+eo) — ξαναγυρίζω, επιστρέφω" },
        { l:"oculis", r:"Αφαιρετική του τρόπου", to:"στο redibat", g:"αφαιρ. πληθ., αρσ.", d:"oculus, -i (αρσ. β΄) — το μάτι" },
        { l:"siccis", r:"Κατηγορηματικός προσδ.", to:"στο oculis", g:"αφαιρ. πληθ., αρσ. — επίθ. β΄ κλ.", d:"siccus, -a, -um — στεγνός", a:"." }
      ]}
    ]},

    { n: 8, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Scribonianus", r:"Υποκείμενο", to:"στο moverat", g:"ονομ. ενικ., αρσ.", d:"Scribonianus, -i (αρσ. β΄, μόνο ενικ.) — ο Σκριβωνιανός" },
        { l:"moverat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσ. ενεργ. φωνής", d:"moveo, movi, motum, movere (2) — κινώ· «arma moveo» = στασιάζω" },
        { l:"arma", r:"Αντικείμενο", to:"στο moverat", g:"αιτ. πληθ., ουδ.", d:"arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα" },
        { l:"contra Claudium", k:"Claudius", r:"Εμπρόθ. επιρρ. προσδ. της εναντίωσης", to:"στο moverat", g:"contra (πρόθ. + αιτ.) + Claudium (αιτ. ενικ., αρσ.)", d:"contra — εναντίον· Claudius, -ii/-i (αρσ. β΄) — ο Κλαύδιος" },
        { l:"in Illyrico", k:"Illyricum", r:"Εμπρόθ. επιρρ. προσδ. του τόπου (στάση)", to:"στο moverat", g:"in (πρόθ. + αφαιρ.) + Illyrico (αφαιρ. ενικ., ουδ.)", d:"in — σε· Illyricum, -i (ουδ. β΄) — η Ιλλυρία", a:";" }
      ]}
    ]},

    { n: 9, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Paetus", r:"Υποκείμενο", to:"στο fuerat", g:"ονομ. ενικ., αρσ.", d:"Paetus, -i (αρσ. β΄) — ο Παίτος" },
        { l:"fuerat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσ. — βοηθητικό", d:"sum, fui, esse — είμαι, υπάρχω" },
        { l:"in partibus", k:"pars", r:"Εμπρόθ. επιρρ. προσδ. του τόπου (μεταφορικά)", to:"στο fuerat", g:"in (πρόθ. + αφαιρ.) + partibus (αφαιρ. πληθ., θηλ.)", d:"in — σε· pars, partis (θηλ. γ΄) — το μέρος· «partes, -ium» = πολιτική παράταξη" },
        { l:"eius", r:"Γενική κτητική", to:"στο partibus", g:"γεν. ενικ., αρσ. — δεικτική (επαναληπτική) αντων.", d:"is, ea, id — αυτός, -ή, -ό" }
      ]},
      { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Paetus.", kids:[
        { l:"occiso", r:"Χρονική μετοχή (αφαιρ. απόλυτη)", to:"στο trahebatur", g:"αφαιρ. ενικ., αρσ., μτχ. παρακ. παθ. φωνής", d:"occido, occidi, occisum, occidere (3) — σκοτώνω", note:"Νόθη αφαιρετική απόλυτη· υποκείμενο της μετοχής το Scriboniano." },
        { l:"Scriboniano", r:"Υποκείμενο μετοχής", to:"στο occiso", g:"αφαιρ. ενικ., αρσ.", d:"Scribonianus, -i (αρσ. β΄, μόνο ενικ.) — ο Σκριβωνιανός", a:"," },
        { l:"Romam", r:"Αιτιατική της κατεύθυνσης", to:"στο trahebatur", g:"αιτ. ενικ., θηλ.", d:"Roma, -ae (θηλ. α΄, μόνο ενικ.) — η Ρώμη" },
        { l:"trahebatur", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. παθ. φωνής", d:"traho, traxi, tractum, trahere (3) — τραβώ, σύρω", a:"." }
      ]}
    ]},

    { n: 10, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Paetus.", kids:[
        { l:"Erat ascensurus", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. — ενεργ. περιφραστική συζυγία", d:"ascendo, ascendi, ascensum, ascendere (3) — ανεβαίνω· εδώ: επιβιβάζομαι", note:"Ενεργητική περιφραστική συζυγία (μέλλοντας στο παρελθόν): «επρόκειτο να επιβιβαστεί»." },
        { l:"navem", r:"Αντικείμενο", to:"στο Erat ascensurus", g:"αιτ. ενικ., θηλ.", d:"navis, navis (θηλ. γ΄) — το πλοίο", a:";" }
      ]}
    ]},

    { n: 11, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Arria", r:"Υποκείμενο", to:"στο orabat", g:"ονομ. ενικ., θηλ.", d:"Arria, -ae (θηλ. α΄) — η Αρρία" },
        { l:"orabat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής", d:"oro, oravi, oratum, orare (1) — παρακαλώ" },
        { l:"milites", r:"Άμεσο αντικείμενο", to:"στο orabat", g:"αιτ. πληθ., αρσ.", d:"miles, militis (αρσ. γ΄) — ο στρατιώτης", a:"," },
        { type:"sub", key:"voulitiki", label:"Βουλητική", note:"Δευτ. ονοματική βουλητική, ως έμμεσο αντικείμενο στο orabat. Εισάγεται με τον βουλητικό ut (καταφατική)· εκφέρεται με υποτακτική (περιεχόμενο απλώς επιθυμητό), υποτ. παρατατικού (imponeretur) από ιστορικό χρόνο (orabat). Ιδιομορφία στην ακολουθία των χρόνων.", kids:[
          { l:"ut", r:"Βουλητ. σύνδεσμος", g:"βουλητικός σύνδεσμος (+ υποτ.)", d:"ut — να" },
          { l:"simul", r:"Επιρρ. προσδ. του τρόπου", to:"στο imponeretur", g:"τροπικό επίρρημα", d:"simul — συγχρόνως, μαζί" },
          { l:"imponeretur", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. παθ. φωνής", d:"impono, imposui, impositum, imponere (3) — επιβιβάζω, τοποθετώ", note:"Υποκείμενο (εννοούμενο): Arria.", a:"." }
        ]}
      ]}
    ]},

    { n: 12, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Arria.", kids:[
        { l:"Non", r:"Επιρρ. προσδ. της άρνησης", to:"στο impetravit", g:"αρνητικό μόριο", d:"non — δεν, όχι" },
        { l:"impetravit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"impetro, impetravi, impetratum, impetrare (1) — κατορθώνω, πετυχαίνω", a:":" }
      ]}
    ]},

    { n: 13, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Arria.", kids:[
        { l:"conduxit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"conduco, conduxi, conductum, conducere (3) — νοικιάζω" },
        { l:"piscatoriam", r:"Επιθετικός προσδ.", to:"στο naviculam", g:"αιτ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"piscatorius, -a, -um — ψαράδικος", note:"Δεν σχηματίζει παραθετικά (λόγω σημασίας)." },
        { l:"naviculam", r:"Αντικείμενο", to:"στο conduxit", g:"αιτ. ενικ., θηλ.", d:"navicula, -ae (θηλ. α΄) — το πλοιάριο" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Υποκείμενο (εννοούμενο): Arria.", kids:[
        { l:"ingentemque", r:"Επιθετικός προσδ.", to:"στο navem", g:"αιτ. ενικ., θηλ. — επίθ. γ΄ κλ. (+ εγκλιτικό –que)", d:"ingens, ingentis — πελώριος, τεράστιος", note:"Το –que (συμπλεκτικός σύνδεσμος) συνδέει παρατακτικά τις δύο κύριες προτάσεις." },
        { l:"navem", r:"Αντικείμενο", to:"στο secuta est", g:"αιτ. ενικ., θηλ.", d:"navis, navis (θηλ. γ΄) — το πλοίο" },
        { l:"secuta est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. — αποθετικό", d:"sequor, secutus sum, sequi (3, αποθ.) — ακολουθώ", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Aegrotabat Caecina Paetus,", el:"Ήταν άρρωστος ο Καικίνας Παίτος," },
    { la:"maritus Arriae,", el:"ο σύζυγος της Αρρίας," },
    { la:"aegrotabat et filius.", el:"ήταν άρρωστος και ο γιος (τους)." },
    { la:"Filius mortuus est.", el:"Ο γιος πέθανε." },
    { la:"Arria paravit huic funus ita,", el:"Η Αρρία ετοίμασε γι' αυτόν κηδεία έτσι," },
    { la:"ut ignoraretur a marito;", el:"ώστε να αγνοείται από τον σύζυγο (της)·" },
    { la:"quin immo,", el:"όχι μόνο αυτό, αλλά ακόμη," },
    { la:"cum illa intraverat cubiculum mariti,", el:"κάθε φορά που εκείνη έμπαινε στην κρεβατοκάμαρα του συζύγου," },
    { la:"simulabat filium vivere,", el:"προσποιούνταν ότι ο γιος (τους) ζούσε" },
    { la:"ac respondebat marito persaepe interroganti,", el:"και απαντούσε στον σύζυγο που ρωτούσε πολύ συχνά" },
    { la:"quid ageret puer:", el:"τι έκανε το παιδί:" },
    { la:"«Bene quievit,", el:"«Καλά κοιμήθηκε," },
    { la:"libenter cibum sumpsit».", el:"έφαγε με όρεξη»." },
    { la:"Deinde, cum lacrimae suae, cohibitae diu,", el:"Έπειτα, όταν τα δάκρυά της, που είχαν συγκρατηθεί για πολλή ώρα," },
    { la:"vincerent prorumperentque,", el:"νικούσαν και ξεσπούσαν," },
    { la:"egrediebatur;", el:"έβγαινε έξω·" },
    { la:"tum dabat se dolori", el:"τότε παραδινόταν στη θλίψη" },
    { la:"et paulo post redibat oculis siccis.", el:"και λίγο αργότερα επέστρεφε με τα μάτια στεγνά." },
    { la:"Scribonianus moverat arma", el:"Ο Σκριβωνιανός είχε στασιάσει" },
    { la:"contra Claudium in Illyrico;", el:"ενάντια στον Κλαύδιο στην Ιλλυρία·" },
    { la:"Paetus fuerat in partibus eius", el:"ο Παίτος είχε πάει με το μέρος του" },
    { la:"et, occiso Scriboniano,", el:"και, αφού σκοτώθηκε ο Σκριβωνιανός," },
    { la:"Romam trahebatur.", el:"οδηγούνταν σιδηροδέσμιος στη Ρώμη." },
    { la:"Erat ascensurus navem;", el:"Επρόκειτο να επιβιβαστεί σε πλοίο·" },
    { la:"Arria orabat milites,", el:"η Αρρία παρακαλούσε τους στρατιώτες" },
    { la:"ut simul imponeretur.", el:"να επιβιβαστεί μαζί." },
    { la:"Non impetravit:", el:"Δεν το κατόρθωσε·" },
    { la:"conduxit piscatoriam naviculam", el:"νοίκιασε ψαράδικο πλοιάριο" },
    { la:"ingentemque navem secuta est.", el:"και ακολούθησε το μεγάλο πλοίο." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Caecina, -ae", note:"μόνο ενικ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"Arria, -ae", note:"μόνο ενικ." },
        { form:"lacrima, -ae" },
        { form:"navicula, -ae" },
        { form:"Roma, -ae", note:"μόνο ενικ." }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"cibus, -i" },
        { form:"Claudius, -ii / -i", note:"μόνο ενικ." },
        { form:"filius, -ii / -i" },
        { form:"maritus, -i" },
        { form:"oculus, -i" },
        { form:"Paetus, -i" },
        { form:"puer, pueri" },
        { form:"Scribonianus, -i", note:"μόνο ενικ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"arma, -orum", note:"μόνο πληθ." },
        { form:"cubiculum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"dolor, doloris" },
        { form:"miles, militis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"navis, navis" },
        { form:"pars, partis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"funus, funeris" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"paulus, -a, -um", note:"δεν έχει παραθετικά" },
      { form:"piscatorius, -a, -um", note:"δεν έχει παραθετικά (λόγω σημασίας)" },
      { form:"siccus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"ingens, ingentis" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"paulus, -a, -um", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά" },
      { pos:"piscatorius, -a, -um", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά (λόγω σημασίας)" },
      { pos:"siccus, -a, -um", comp:"siccior, -ior, -ius", sup:"siccissimus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"ingens, ingentis", comp:"ingentior, -ior, -ius", sup:"ingentissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"" },
    { form:"is, ea, id", kind:"Δεικτική (επαναληπτική)", extra:"" },
    { form:"quis, quis, quid", kind:"Ερωτηματική", extra:"ουσιαστική" },
    { form:"sui, sibi, se, —, a se", kind:"Προσωπική", extra:"γ΄ προσώπου (αυτοπαθής)" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ένας κτήτορας" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"aegroto", perf:"aegrotavi", sup:"aegrotatum", inf:"aegrotare", note:"" },
      { pres:"do", perf:"dedi", sup:"datum", inf:"dare", note:"" },
      { pres:"ignoro", perf:"ignoravi", sup:"ignoratum", inf:"ignorare", note:"" },
      { pres:"impetro", perf:"impetravi", sup:"impetratum", inf:"impetrare", note:"" },
      { pres:"interrogo", perf:"interrogavi", sup:"interrogatum", inf:"interrogare", note:"inter+rogo" },
      { pres:"intro", perf:"intravi", sup:"intratum", inf:"intrare", note:"" },
      { pres:"oro", perf:"oravi", sup:"oratum", inf:"orare", note:"" },
      { pres:"paro", perf:"paravi", sup:"paratum", inf:"parare", note:"" },
      { pres:"simulo", perf:"simulavi", sup:"simulatum", inf:"simulare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"cohibeo", perf:"cohibui", sup:"cohibitum", inf:"cohibere", note:"" },
      { pres:"moveo", perf:"movi", sup:"motum", inf:"movere", note:"" },
      { pres:"respondeo", perf:"respondi", sup:"responsum", inf:"respondere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"ago", perf:"egi", sup:"actum", inf:"agere", note:"" },
      { pres:"ascendo", perf:"ascendi", sup:"ascensum", inf:"ascendere", note:"" },
      { pres:"conduco", perf:"conduxi", sup:"conductum", inf:"conducere", note:"" },
      { pres:"impono", perf:"imposui", sup:"impositum", inf:"imponere", note:"" },
      { pres:"occido", perf:"occidi", sup:"occisum", inf:"occidere", note:"" },
      { pres:"prorumpo", perf:"prorupi", sup:"proruptum", inf:"prorumpere", note:"" },
      { pres:"quiesco", perf:"quievi", sup:"quietum", inf:"quiescere", note:"" },
      { pres:"sumo", perf:"sumpsi", sup:"sumptum", inf:"sumere", note:"" },
      { pres:"traho", perf:"traxi", sup:"tractum", inf:"trahere", note:"" },
      { pres:"vinco", perf:"vici", sup:"victum", inf:"vincere", note:"" },
      { pres:"vivo", perf:"vixi", sup:"victum", inf:"vivere", note:"" },
      { pres:"egredior", perf:"egressus sum", sup:"—", inf:"egredi", note:"αποθετικό" },
      { pres:"morior", perf:"mortuus sum", sup:"(moriturus)", inf:"mori", note:"αποθετικό (μτχ. μέλλ. moriturus)" },
      { pres:"sequor", perf:"secutus sum", sup:"—", inf:"sequi", note:"αποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"redeo", perf:"redii / redivi", sup:"reditum", inf:"redire", note:"ανώμαλο (red+eo)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ / ΠΑΓΙΔΕΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"Δύο ειδών cum", body:"Το cum «illa cubiculum mariti intraverat» είναι χρονικός επαναληπτικός (+ οριστική υπερσυντελίκου, αόριστη επανάληψη). Το cum «lacrimae... vincerent prorumperentque» είναι χρονικός ιστορικός-διηγηματικός (+ υποτακτική παρατατικού)." },
    { tag:"Σύνδεσμος", title:"Το ut: συμπερασματικό ή βουλητικό", body:"Στο «ut ignoraretur a marito» το ut είναι συμπερασματικό (αποτέλεσμα). Στο «ut simul imponeretur» είναι βουλητικό (επιθυμία). Και τα δύο + υποτακτική, αλλά με διαφορετική λειτουργία και εισαγωγική αιτιολόγηση." },
    { tag:"Ακολουθία χρόνων", title:"Ιδιομορφία", body:"Οι συμπερασματική (ignoraretur) και βουλητική (imponeretur) εκφέρονται με υποτακτική παρατατικού από ιστορικό χρόνο, με ιδιομορφία στην ακολουθία: το αποτέλεσμα/η επιθυμία αντιμετωπίζονται τη στιγμή που διαμορφώνονται στη συνείδηση του ομιλητή." },
    { tag:"Απαρέμφατο", title:"vivere: ειδικό απαρέμφατο (ετεροπροσωπία)", body:"Στο «simulabat filium vivere» το vivere είναι ειδικό απαρέμφατο, αντικείμενο του simulabat, με υποκείμενο σε αιτιατική το filium (ετεροπροσωπία, αφού υποκείμενο του simulabat είναι η Arria)." },
    { tag:"Σύνταξη", title:"occiso Scriboniano: αφαιρετική απόλυτη", body:"Η μετοχή occiso με το υποκείμενό της Scriboniano σχηματίζουν νόθη αφαιρετική απόλυτη χρονική μετοχή (= αφού σκοτώθηκε ο Σκριβωνιανός), επιρρ. προσδ. του χρόνου στο trahebatur." },
    { tag:"Προσδιορισμός", title:"paulo post & siccis oculis", body:"Το paulo είναι αφαιρετική του μέτρου/της διαφοράς στο επίρρημα post. Το oculis είναι αφαιρετική του τρόπου στο redibat και το siccis κατηγορηματικός προσδιορισμός στο oculis. Το se (dabat se dolori) είναι άμεσο αντικείμενο κατά άμεση αυτοπάθεια." }
  ]
};

export default UNIT;
