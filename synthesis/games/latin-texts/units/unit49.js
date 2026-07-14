// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 49
//  Lectio XLIX — «Η Πορκία και ο Βρούτος» (Valerius Maximus, Facta et dicta
//  memorabilia 3,2,15)
//  periods, alignment, nouns, adjectives, comparatives, pronouns, verbs, sos
//  + προαιρετικά transforms (Μέρος VIII) & etymology (Μέρος IX).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 49,
  title: "Η Πορκία και ο Βρούτος",
  latinTitle: "Lectio XLIX",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Porcia", r:"Υποκείμενο", to:"στο poposcit", g:"ονομ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"Porcia, -ae (θηλ. α΄) — η Πορκία" },
        { l:"Bruti", k:"Brutus", r:"Γενική κτητική", to:"στο uxor", g:"γεν. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Brutus, -i (αρσ. β΄) — ο Βρούτος" },
        { l:"uxor", r:"Παράθεση", to:"στο Porcia", g:"ονομ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"uxor, uxoris (θηλ. γ΄) — η σύζυγος", a:"," },
        { type:"sub", key:"xroniki", label:"Χρονική (cum ιστορικός)", note:"Δευτ. επιρρ. χρονική στο poposcit· cum ιστορικός-διηγηματικός + υποτακτική υπερσ. (cognovisset) — προτερόχρονο στο παρελθόν.", kids:[
          { l:"cum", r:"Σύνδεσμος", g:"υποτακτικός χρονικός (ιστορικός-διηγηματικός) σύνδεσμος", d:"cum — όταν" },
          { l:"viri", r:"Γενική υποκειμενική", to:"στο consilium", g:"γεν. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"vir, viri (αρσ. β΄) — ο άντρας, ο σύζυγος" },
          { l:"sui", k:"suus", r:"Επιθετικός προσδ.", to:"στο viri", g:"γεν. ενικ., αρσ. — κτητική αντωνυμία γ΄ προσ.", d:"suus, sua, suum — δικός της", note:"Άμεση αυτοπάθεια (στο εννοούμενο υποκ. Porcia)." },
          { l:"consilium", r:"Αντικείμενο", to:"στο cognovisset", g:"αιτ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"consilium, -ii/-i (ουδ. β΄) — το σχέδιο" },
          { l:"de interficiendo", r:"Εμπρόθετο γερουνδιακό (αναφοράς)", to:"στο consilium", g:"de (πρόθ. + αφαιρ.) + interficiendo (αφαιρ. γερουνδιακού)", d:"interficio, interfeci, interfectum, interficĕre (3, σε -io) — σκοτώνω", note:"Υποχρεωτική γερουνδιακή έλξη (αρχικά: de interficiendo Caesarem)." },
          { l:"Caesare", k:"Caesar", r:"Υποκείμενο γερουνδιακού", to:"στο interficiendo", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας" },
          { l:"cognovisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσ. ενεργ. φωνής", d:"cognosco, cognovi, cognitum, cognoscĕre (3) — μαθαίνω", note:"Εννοούμενο υποκ.: (Porcia).", a:"," }
        ]},
        { l:"cultellum", r:"Αντικείμενο", to:"στο poposcit", g:"αιτ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"cultellus, -i (αρσ. β΄) — το μαχαιράκι, το ξυράφι" },
        { l:"tonsorium", r:"Επιθετικός προσδ.", to:"στο cultellum", g:"αιτ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"tonsorius, -a, -um — του μανικιουρίστα/κουρέα" },
        { l:"quasi", r:"Επιρρ. προσδ. του τρόπου (παραβολικό)", to:"στο resecandorum", g:"παραβολικό επίρρημα (υποθετική παραβολή)", d:"quasi — δήθεν, σαν να", note:"Βραχυλογική υποθετική παραβολή (= quasi … cultellum posceret)." },
        { l:"unguium", r:"Υποκείμενο γερουνδιακού", to:"στο resecandorum", g:"γεν. πληθ., αρσ. — ουσιαστικό γ΄ κλ.", d:"unguis, unguis (αρσ. γ΄) — το νύχι" },
        { l:"resecandorum", r:"Γερουνδιακό (σκοπού)", to:"στο poposcit", g:"γεν. πληθ., αρσ. — γερουνδιακό (causa + γεν.)", d:"reseco, resecui, resectum, resecāre (1) (< re + seco) — κόβω", note:"Υποχρεωτική γερουνδιακή έλξη (αρχικά: ungues resecandi causa)." },
        { l:"causa", r:"Καταχρηστική πρόθεση (+ γενική)", to:"στο resecandorum", g:"καταχρηστική πρόθεση — δηλώνει σκοπό", d:"causa — με σκοπό να" },
        { l:"poposcit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"posco, poposci, —, poscĕre (3) — ζητώ" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Συνδέεται με την προηγούμενη παρατακτικά συμπλεκτικά (-que). Εννοούμενο υποκ.: (Porcia).", kids:[
        { l:"eo", k:"is", r:"Αφαιρετική του οργάνου", to:"στο vulneravit", g:"αφαιρ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός (eo = cultello)" },
        { l:"-que", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος (εγκλιτικός)", d:"-que — και" },
        { l:"velut", r:"Επιρρ. προσδ. του τρόπου (παραβολικό)", to:"στη μετοχή elapso", g:"παραβολικό επίρρημα (υποθετική παραβολή)", d:"velut — σαν να" },
        { l:"forte", r:"Επιρρ. προσδ. του τρόπου", to:"στη μετοχή elapso", g:"τροπικό επίρρημα (αφαιρ. του fors)", d:"forte — τυχαία (velut forte = δήθεν κατά τύχη)" },
        { l:"elapso", k:"elabor", r:"Επιρρ. αιτιολογική μετοχή", to:"στο vulneravit", g:"αφαιρ. ενικ., αρσ. — μτχ. παρακ. αποθετικού", d:"elabor, elapsus sum, (elapsum), elabi (3) (< e + labor) — ξεγλιστρώ", note:"Συνημμένη στο eo (υποκ. της)· προτερόχρονο· λόγω velut, υποκειμενική/υποθετική αιτιολογία." },
        { l:"se", k:"sui", r:"Αντικείμενο", to:"στο vulneravit", g:"αιτ. ενικ., θηλ. — προσωπική αντωνυμία γ΄ προσ.", d:"se — τον εαυτό της", note:"Άμεση αυτοπάθεια (στο εννοούμενο υποκ. Porcia)." },
        { l:"vulneravit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"vulnero, vulneravi, vulneratum, vulnerāre (1) — πληγώνω", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Clamore", r:"Αφαιρετική του ποιητικού αιτίου (απρόθετη)", to:"στη μετοχή vocatus", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"clamor, clamoris (αρσ. γ΄) — η κραυγή", note:"Απρόθετο, γιατί είναι άψυχο." },
        { l:"deinde", r:"Επιρρ. προσδ. του χρόνου", to:"στο venit", g:"χρονικό επίρρημα", d:"deinde — έπειτα" },
        { l:"ancillarum", r:"Γενική υποκειμενική", to:"στο clamore", g:"γεν. πληθ., θηλ. — ουσιαστικό α΄ κλ.", d:"ancilla, -ae (θηλ. α΄) — η υπηρέτρια" },
        { l:"in cubiculum", k:"cubiculum", r:"Εμπρόθετος προσδ. (κίνηση σε τόπο)", to:"στη μετοχή vocatus", g:"in (πρόθ. + αιτ.) + cubiculum (αιτ. ενικ., ουδ.)", d:"in — σε· cubiculum, -i (ουδ. β΄) — η κρεβατοκάμαρα" },
        { l:"vocatus", r:"Επιρρ. χρονική μετοχή", to:"στο venit", g:"ονομ. ενικ., αρσ. — μτχ. παρακ. παθ. φωνής", d:"voco, vocavi, vocatum, vocāre (1) — καλώ", note:"Brutus = υποκ. της μετοχής· προτερόχρονο (συνημμένη)." },
        { l:"Brutus", r:"Υποκείμενο", to:"στο venit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Brutus, -i (αρσ. β΄) — ο Βρούτος" },
        { l:"ad eam obiurgandam", k:"obiurgo", r:"Εμπρόθετο γερουνδιακό (σκοπού)", to:"στο venit", g:"ad (πρόθ. + αιτ.) + eam obiurgandam (αιτ. ενικ., θηλ.)", d:"obiurgo, obiurgavi, obiurgatum, obiurgāre (1) — μαλώνω", note:"eam = υποκ. γερουνδιακού (= Porciam)· υποχρεωτική γερουνδιακή έλξη (αρχικά: ad eam obiurgandum)." },
        { l:"venit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"venio, veni, ventum, venīre (4) — έρχομαι", a:"," },
        { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρ. αιτιολογική στο venit· quod + υποτακτική υπερσ. (praeripuisset) — υποκειμενική/υποθετική αιτιολογία, προτερόχρονο στο παρελθόν.", kids:[
          { l:"quod", r:"Σύνδεσμος", g:"υποτακτικός αιτιολογικός σύνδεσμος", d:"quod — επειδή" },
          { l:"tonsoris", r:"Γενική κτητική", to:"στο officium", g:"γεν. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"tonsor, tonsoris (αρσ. γ΄) — ο μανικιουρίστας/κουρέας" },
          { l:"praeripuisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσ. ενεργ. φωνής", d:"praeripio, praeripui, praereptum, praeripĕre (3, σε -io) (< prae + rapio) — αρπάζω, κλέβω", note:"Εννοούμενο υποκ.: (Porcia)." },
          { l:"officium", r:"Αντικείμενο", to:"στο praeripuisset", g:"αιτ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"officium, -ii/-i (ουδ. β΄) — το καθήκον, η τέχνη", a:"." }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"cui στην αρχή περιόδου = δεικτική (cui = ei = Bruto). Ο ευθύς λόγος που ακολουθεί = άμεσο αντικ. στο inquit.", kids:[
        { l:"Cui", k:"qui", r:"Έμμεσο αντικείμενο", to:"στο inquit", g:"δοτ. ενικ., αρσ. — αναφορική (= δεικτική) αντωνυμία", d:"qui, quae, quod — ο οποίος (cui = ei = Bruto)" },
        { l:"secreto", r:"Επιρρ. προσδ. του τρόπου", to:"στο inquit", g:"τροπικό επίρρημα", d:"secreto — κρυφά" },
        { l:"Porcia", r:"Υποκείμενο", to:"στο inquit", g:"ονομ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"Porcia, -ae (θηλ. α΄) — η Πορκία" },
        { l:"inquit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. (παρακ. εδώ) — ελλειπτικό", d:"inquam — λέγω (παρενθετικό, σε ευθύ λόγο)", a:":" },
        { type:"sub", key:"kyria", label:"Ευθύς λόγος — κύρια (κρίσης)", note:"Κύρια πρόταση σε ευθύ λόγο· άμεσο αντικείμενο στο inquit.", kids:[
          { l:"non", r:"Άρνηση", to:"στο est", g:"αρνητικό μόριο", d:"non — δεν" },
          { l:"est", k:"sum", r:"Ρήμα (συνδετικό)", g:"γ΄ ενικ. οριστ. ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι" },
          { l:"hoc", k:"hic", r:"Υποκείμενο", to:"στο non est", g:"ονομ. ενικ., ουδ. — δεικτική αντωνυμία", d:"hic, haec, hoc — αυτός, -ή, -ό" },
          { l:"temerarium", r:"Επιθετικός προσδ.", to:"στο factum", g:"ονομ. ενικ., ουδ. — επίθ. β΄ κλ.", d:"temerarius, -a, -um — ασυλλόγιστος, -η, -ο" },
          { l:"factum", r:"Κατηγορούμενο", to:"στο hoc (μέσω non est)", g:"ονομ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"factum, -i (ουδ. β΄) — η πράξη" },
          { l:"meum", k:"meus", r:"Επιθετικός προσδ.", to:"στο factum", g:"ονομ. ενικ., ουδ. — κτητική αντωνυμία α΄ προσ.", d:"meus, mea, meum — δικός μου", a:"," },
          { l:"sed", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"sed — αλλά" },
          { l:"certissimum", k:"certus", r:"Επιθετικός προσδ.", to:"στο indicium", g:"ονομ. ενικ., ουδ. — επίθ. β΄ κλ., υπερθ. βαθμού", d:"certissimus, -a, -um (< certus) — βεβαιότατος" },
          { l:"indicium", r:"Κατηγορούμενο", to:"στο hoc (μέσω non est)", g:"ονομ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"indicium, -ii/-i (ουδ. β΄) — η απόδειξη, το τεκμήριο" },
          { l:"amoris", r:"Γενική αντικειμενική", to:"στο indicium", g:"γεν. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"amor, amoris (αρσ. γ΄) — η αγάπη" },
          { l:"mei", k:"meus", r:"Επιθετικός προσδ.", to:"στο amoris", g:"γεν. ενικ., αρσ. — κτητική αντωνυμία α΄ προσ.", d:"meus, mea, meum — δικός μου" },
          { l:"erga te", k:"tu", r:"Εμπρόθετος προσδ. (φιλικής σχέσης)", to:"στο amoris", g:"erga (πρόθ. + αιτ.) + te (αιτ. ενικ.)", d:"erga — προς· tu — εσύ" },
          { l:"tale", k:"talis", r:"Επιθετικός προσδ.", to:"στο consilium", g:"αιτ. ενικ., ουδ. — δεικτική αντωνυμία", d:"talis, talis, tale — τέτοιος, -α, -ο" },
          { l:"consilium", r:"Αντικείμενο", to:"στη μετοχή molientem", g:"αιτ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"consilium, -ii/-i (ουδ. β΄) — το σχέδιο" },
          { l:"molientem", k:"molior", r:"Επιθετική μετοχή", to:"στο te", g:"αιτ. ενικ., αρσ. — μτχ. ενεστ. αποθετικού (moliens, -entis)", d:"molior, molitus sum, (molitum), molīri (4) — μηχανεύομαι", note:"te = υποκ. της μετοχής· δηλώνει το σύγχρονο." }
        ]},
        { type:"sub", key:"kyria", label:"Ευθύς λόγος — κύρια (κρίσης)", note:"Κύρια πρόταση σε ευθύ λόγο (συνέχεια). Εννοούμενο υποκ.: (ego = Porcia).", kids:[
          { l:"experiri", k:"experior", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο volui", g:"απαρέμφατο ενεστ. — αποθετικό", d:"experior, expertus sum, (expertum), experīri (4) — δοκιμάζω", note:"Εννοούμενο υποκ.: (ego) — ταυτοπροσωπία." },
          { l:"enim", r:"Σύνδεσμος", g:"παρατακτικός αιτιολογικός (διασαφητικός) σύνδεσμος", d:"enim — δηλαδή" },
          { l:"volui", r:"Ρήμα", g:"α΄ ενικ. οριστ. παρακ. — ανώμαλο", d:"volo, volui, —, velle — θέλω", note:"Εννοούμενο υποκ.: (ego)." },
          { type:"sub", key:"plagia", label:"Πλάγια ερωτηματική (μερικής άγνοιας)", note:"Δευτ. ουσιαστική πλάγια ερωτηματική, αντικείμενο στο experiri· quam + υποτακτική· ενεργ. περιφραστική συζυγία παρατ. (essem interemptura) — υστερόχρονο στο παρελθόν.", kids:[
            { l:"quam", r:"Επιρρ. προσδ. του ποσού", to:"στο aequo", g:"ερωτηματικό (ποσοτικό) επίρρημα", d:"quam — πόσο" },
            { l:"aequo", k:"aequus", r:"Επιθετικός προσδ.", to:"στο animo", g:"αφαιρ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"aequus, -a, -um — ήρεμος, ίσος (aequo animo = με αταραξία)" },
            { l:"animo", r:"Αφαιρετική (οργανική) του τρόπου", to:"στο essem interemptura", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"animus, -i (αρσ. β΄) — η ψυχή, το πνεύμα" },
            { l:"me", k:"ego", r:"Αντικείμενο", to:"στο essem interemptura", g:"αιτ. ενικ., θηλ. — προσωπική αντωνυμία α΄ προσ.", d:"ego — εγώ", note:"Άμεση αυτοπάθεια (στο εννοούμενο υποκ. ego)." },
            { l:"ferro", r:"Αφαιρετική του οργάνου", to:"στο essem interemptura", g:"αφαιρ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"ferrum, -i (ουδ. β΄) — το σίδερο, το (σιδερένιο) όπλο" },
            { l:"essem interemptura", k:"interimo", r:"Ρήμα", g:"α΄ ενικ. υποτ. παρατ. — ενεργ. περιφραστική συζυγία", d:"interimo, interemi, interemptum, interimĕre (3) (< inter + emo) — σκοτώνω (essem interemptura = θα σκότωνα)", note:"Εννοούμενο υποκ.: (ego)." },
            { type:"sub", key:"ypothetiki", label:"Υποθετική (υπόθεση)", note:"Δευτ. επιρρ. υποθετική· si … non + υποτ. υπερσ. (cessisset) λόγω πλάγιου λόγου· εξαρτημένος υποθετικός λόγος (α΄ είδος — ανοικτή για το μέλλον), απόδοση = essem interemptura.", kids:[
              { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
              { l:"tibi", k:"tu", r:"Δοτική προσωπική (αντιχαριστική)", to:"στο cessisset", g:"δοτ. ενικ. — προσωπική αντωνυμία β΄ προσ.", d:"tu — εσύ" },
              { l:"consilium", r:"Υποκείμενο", to:"στο cessisset", g:"ονομ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"consilium, -ii/-i (ουδ. β΄) — το σχέδιο" },
              { l:"non", r:"Άρνηση", to:"στο cessisset", g:"αρνητικό μόριο", d:"non — δεν" },
              { l:"ex sententia", k:"sententia", r:"Εμπρόθετος προσδ. του τρόπου", to:"στο cessisset", g:"ex (πρόθ. + αφαιρ.) + sententia (αφαιρ. ενικ., θηλ.)", d:"ex — κατά· sententia, -ae (θηλ. α΄) — η γνώμη (ex sententia = κατ' ευχήν)" },
              { l:"cessisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσ. ενεργ. φωνής", d:"cedo, cessi, cessum, cedĕre (3) — προχωρώ, εξελίσσομαι (consilium ex sententia cedit = πάει κατ' ευχήν)", a:"." }
            ]}
          ]}
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Porcia, Bruti uxor, cum viri sui consilium de interficiendo Caesare cognovisset, cultellum tonsorium quasi unguium resecandorum causa poposcit eoque velut forte elapso se vulnerāvit.", el:"Η Πορκία, η σύζυγος του Βρούτου, όταν έμαθε το σχέδιο του άντρα της για τη δολοφονία του Καίσαρα, ζήτησε ένα μαχαιράκι του κουρέα δήθεν για να κόψει τα νύχια της και με αυτό αυτοτραυματίστηκε, καθώς της γλίστρησε δήθεν κατά τύχη." },
    { la:"Clamore deinde ancillārum in cubiculum vocātus Brutus ad eam obiurgandam venit, quod tonsōris praeripuisset officium.", el:"Έπειτα ο Βρούτος, αφού κλήθηκε στην κρεβατοκάμαρα από την κραυγή των υπηρετριών, ήρθε για να τη μαλώσει, επειδή τάχα είχε κλέψει την τέχνη του κουρέα." },
    { la:"Cui secrēto Porcia «non est hoc» inquit «temerarium factum meum, sed certissimum indicium amōris mei erga te tale consilium molientem: experīri enim volui, quam aequo animo me ferro essem interemptūra, si tibi consilium non ex sententia cessisset».", el:"Σε αυτόν είπε κρυφά η Πορκία: «Δεν είναι αυτό ασυλλόγιστη πράξη μου, αλλά βεβαιότατη απόδειξη της αγάπης μου προς εσένα, που μηχανεύεσαι τέτοιο σχέδιο· θέλησα δηλαδή να δοκιμάσω με πόση αταραξία θα σκοτωνόμουν με σιδερένιο όπλο, αν το σχέδιο δεν σου πήγαινε κατ' ευχήν»." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"Porcia, -ae", note:"κύριο όνομα" },
        { form:"ancilla, -ae" },
        { form:"sententia, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Brutus, -i", note:"κύριο όνομα· κλητ. Brute" },
        { form:"vir, viri" },
        { form:"cultellus, -i" },
        { form:"animus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"consilium, -ii/-i" },
        { form:"cubiculum, -i" },
        { form:"officium, -ii/-i" },
        { form:"factum, -i" },
        { form:"indicium, -ii/-i" },
        { form:"ferrum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Caesar, Caesaris" },
        { form:"unguis, unguis", note:"γεν. πληθ. unguium" },
        { form:"clamor, clamoris" },
        { form:"tonsor, tonsoris" },
        { form:"amor, amoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"uxor, uxoris" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"tonsorius, -a, -um", note:"δηλώνει προέλευση — δεν σχηματίζει παραθετικά" },
      { form:"temerarius, -a, -um", note:"περιφραστικά παραθετικά (magis / maxime)" },
      { form:"certus, -a, -um" },
      { form:"aequus, -a, -um" },
      { form:"secretus, -a, -um", note:"δεν σχηματίζει υπερθετικό (επίρρ. secreto)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (& επιρρημάτων) ──────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"certus, -a, -um", comp:"certior, -ior, -ius", sup:"certissimus, -a, -um", note:"επίρρ.: certe → certius → certissime" },
      { pos:"aequus, -a, -um", comp:"aequior, -ior, -ius", sup:"aequissimus, -a, -um", note:"επίρρ.: aeque → aequius → aequissime" },
      { pos:"temerarius, -a, -um", comp:"magis temerarius", sup:"maxime temerarius", note:"περιφραστικά· επίρρ.: temerarie → magis temerarie → maxime temerarie" },
      { pos:"secretus, -a, -um", comp:"secretior, -ior, -ius", sup:"— (χωρίς υπερθετικό)", note:"επίρρ.: secrete / secreto → secretius → —" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ. (sui)" },
    { form:"is, ea, id", kind:"Δεικτική (επαναληπτική)", extra:"eo, eam" },
    { form:"sui, sibi, se", kind:"Προσωπική γ΄ προσ. (αυτοπαθής)", extra:"se" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"cui (στην αρχή περιόδου = δεικτική)" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"hoc" },
    { form:"meus, mea, meum", kind:"Κτητική", extra:"α΄ προσ. (meum, mei)" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσ. (te, tibi)" },
    { form:"talis, talis, tale", kind:"Δεικτική", extra:"tale" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"reseco", perf:"resecui", sup:"resectum", inf:"resecāre", note:"< re + seco" },
      { pres:"vulnero", perf:"vulneravi", sup:"vulneratum", inf:"vulnerāre", note:"" },
      { pres:"voco", perf:"vocavi", sup:"vocatum", inf:"vocāre", note:"" },
      { pres:"obiurgo", perf:"obiurgavi", sup:"obiurgatum", inf:"obiurgāre", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"interficio", perf:"interfeci", sup:"interfectum", inf:"interficĕre", note:"3, σε -io· < inter + facio" },
      { pres:"cognosco", perf:"cognovi", sup:"cognitum", inf:"cognoscĕre", note:"" },
      { pres:"posco", perf:"poposci", sup:"—", inf:"poscĕre", note:"χωρίς σουπίνο" },
      { pres:"elabor", perf:"elapsus sum", sup:"(elapsum)", inf:"elabi", note:"αποθετικό (< e + labor)" },
      { pres:"praeripio", perf:"praeripui", sup:"praereptum", inf:"praeripĕre", note:"3, σε -io· < prae + rapio" },
      { pres:"interimo", perf:"interemi", sup:"interemptum", inf:"interimĕre", note:"< inter + emo" },
      { pres:"cedo", perf:"cessi", sup:"cessum", inf:"cedĕre", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"venio", perf:"veni", sup:"ventum", inf:"venīre", note:"" },
      { pres:"molior", perf:"molitus sum", sup:"(molitum)", inf:"molīri", note:"αποθετικό" },
      { pres:"experior", perf:"expertus sum", sup:"(expertum)", inf:"experīri", note:"αποθετικό" }
    ]},
    { syz:"Ανώμαλα / ελλειπτικά ρήματα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"volo", perf:"volui", sup:"—", inf:"velle", note:"θέλω" },
      { pres:"inquam", perf:"inquii", sup:"—", inf:"—", note:"ελλειπτικό — λέγω (παρενθετικό)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Γερουνδιακή έλξη", title:"Τρεις υποχρεωτικές γερουνδιακές έλξεις", body:"«de interficiendo Caesare» (αρχικά de interficiendo Caesarem), «unguium resecandorum causa» (αρχικά ungues resecandi causa) και «ad eam obiurgandam» (αρχικά ad eam obiurgandum): σε όλες, το γερουνδιακό συμφωνεί με το αντικείμενο σε γένος-αριθμό-πτώση — υποχρεωτική γερουνδιακή έλξη." },
    { tag:"Παραβολικές", title:"quasi & velut (βραχυλογικές υποθετικές)", body:"«quasi unguium resecandorum causa» και «eoque velut forte elapso»: βραχυλογικές εκφράσεις υποθετικής παραβολής, που ισοδυναμούν με λανθάνουσες υποθετικές παραβολικές προτάσεις (quasi/velut + υποτακτική)." },
    { tag:"Αναφορικά", title:"cui = δεικτική στην αρχή περιόδου", body:"«Cui secreto Porcia … inquit»: η αναφορική cui, μετά από ισχυρό σημείο στίξης στην αρχή περιόδου, ισοδυναμεί με δεικτική (cui = ei = Bruto) και εισάγει ΚΥΡΙΑ πρόταση." },
    { tag:"Υποθ. λόγος", title:"Εξαρτημένος υποθετικός λόγος + ενεργ. περιφραστική", body:"«si … cessisset … essem interemptura»: εξαρτημένος υποθετικός λόγος (α΄ είδος — ανοικτή για το μέλλον) μέσα σε πλάγια ερωτηματική· η απόδοση εκφέρεται με ενεργητική περιφραστική συζυγία (essem interemptura = θα σκότωνα). Ευθύς: si … cesserit, … interimam." },
    { tag:"Αυτοπάθεια", title:"Άμεση αυτοπάθεια (sui, se, me)", body:"sui (στο viri), se (αντικ. του vulneravit) και me (αντικ. του essem interemptura): άμεση/ευθεία αυτοπάθεια — αναφέρονται στο (εννοούμενο) υποκείμενο της ίδιας πρότασης (Porcia / ego)." },
    { tag:"Ρηματικά", title:"Αποθετικά & ελλειπτικά", body:"elabor, molior, experior: αποθετικά (μέση φωνή, ενεργ. σημασία). posco: δεν σχηματίζει σουπίνο. inquam: ελλειπτικό ρήμα, χρησιμοποιείται παρενθετικά μέσα σε ευθύ λόγο." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"(velut) elapso",
        to:"quod elapsus esset",
        note:"Αιτιολογική μετοχή (υποκειμενικής/υποθετικής αιτιολογίας) παρακειμένου, προτερόχρονο → αιτιολογική πρόταση (quod + υποτακτική υπερσυντελίκου). Εξάρτηση: vulneravit." },
      { from:"vocatus",
        to:[
        "postquam: postquam vocatus est (postquam + οριστική παρακειμένου)",
        "cum: cum vocatus esset (cum ιστορικό + υποτακτική υπερσυντελίκου)"],
        note:"Χρονική μετοχή παρακειμένου, προτερόχρονο. Εξάρτηση: venit." },
      { from:"molientem",
        to:"qui moliris / molire",
        note:"Επιθετική μετοχή ενεστώτα στο (erga) te, σύγχρονο → αναφορική πρόταση (qui + οριστική ενεστώτα). Εξάρτηση: est." }
    ]},
    { id:"Β", label:"Μετατροπή δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Porcia, ..., cum viri sui consilium de interficiendo Caesare cognovisset, cultellum ... poposcit",
        to:"Porcia, ..., consilio viri sui de interficiendo Caesare cognito cultellum ... poposcit",
        note:"Χρονική πρόταση → χρονική μετοχή (νόθη αφαιρετική απόλυτη· εννοούμενο ποιητικό αίτιο a Porcia ταυτίζεται με το υποκείμενο)." },
      { from:"Brutus ad eam obiurgandam venit, quod tonsoris praeripuisset officium",
        to:"Brutus ad eam obiurgandam venit officio tonsoris praerepto (ab ea)",
        note:"Αιτιολογική πρόταση → αιτιολογική μετοχή (νόθη αφαιρετική απόλυτη· εννοούμενο ποιητικό αίτιο ab ea ταυτίζεται με το eam)." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Porcia, Bruti uxor, ... cultellum tonsorium quasi unguium resecandorum causa poposcit",
        to:"A Porcia, Bruti uxore, ... cultellus tonsorius quasi unguium resecandorum causa postulatus est",
        note:"Το posco δεν διαθέτει σουπίνο· η παθητική σχηματίζεται με postulatus est (< postulo)." },
      { from:"cum viri sui consilium de interficiendo Caesare cognovisset", to:"cum consilium viri sui de interficiendo Caesare cognitum esset a Porcia" },
      { from:"quod tonsoris praeripuisset officium", to:"quod tonsoris praereptum esset officium ab ea" }
    ]},
    { id:"Δ", label:"Δήλωση του σκοπού με όλους τους τρόπους εκφοράς (5 τρόποι)", items:[
      { from:"unguium resecandorum causa poposcit",
        to:[
        "τελική: poposcit ut ungues / -is resecaret",
        "αναφορικοτελική: poposcit quae ungues / -is resecaret",
        "σουπίνο: poposcit ungues / -is resectum",
        "ad + γερουνδιακό/γερούνδιο: poposcit ad ungues / -is resecandos (με έλξη) ή ad ungues / -is resecandum (χωρίς έλξη)",
        "γενική + causa/gratia: poposcit unguium resecandorum causa (με έλξη) ή ungues / -is resecandi causa (χωρίς έλξη)"] },
      { from:"Brutus ad eam obiurgandam venit",
        to:[
        "τελική: Brutus venit ut eam obiurgaret",
        "αναφορικοτελική: Brutus venit qui eam obiurgaret",
        "σουπίνο: Brutus venit eam obiurgatum",
        "ad + γερουνδιακό/γερούνδιο: Brutus venit ad eam obiurgandam (με έλξη) ή ad eam obiurgandum (χωρίς έλξη)",
        "γενική + causa/gratia: Brutus venit eius obiurgandae causa (με έλξη) ή eam obiurgandi causa (χωρίς έλξη)"] }
    ]},
    { id:"Ε", label:"Μετατροπή του πλάγιου λόγου σε ευθύ και τροπή του ανεξάρτητου υποθετικού λόγου στα άλλα είδη", items:[
      { from:"Experiri enim volui, quam aequo animo me ferro essem interemptura, si tibi consilium non ex sententia cessisset (εξαρτημένος / πλάγιος υποθετικός λόγος)",
        to:"Quam aequo animo me ferro interimam, si tibi consilium non ex sententia cesserit? (ανεξάρτητος / ευθύς)",
        note:"1ο είδος — ανοικτή υπόθεση για το μέλλον. Υπόθεση: si non cesserit (οριστική συντελεσμένου μέλλοντα) / Απόδοση: interimam (οριστική μέλλοντα)." },
      { from:"1ο είδος — ανοικτή υπόθεση (του πραγματικού)",
        to:[
        "μέλλον: si ... non cesserit — Quam ... interimam? (οριστ. συντελ. μέλλοντα / οριστ. μέλλοντα)",
        "παρόν: si ... non cedit — Quam ... interimo? (οριστική ενεστώτα)",
        "παρελθόν: si ... non cessit — Quam ... interemi? (οριστική παρακειμένου)"] },
      { from:"2ο είδος — υπόθεση αντίθετη προς την πραγματικότητα (του απραγματοποίητου)",
        to:[
        "παρόν: si ... non cederet — Quam ... interimerem? (υποτακτική παρατατικού)",
        "παρελθόν: si ... non cessisset — Quam ... interemissem? (υποτακτική υπερσυντελίκου)"] },
      { from:"3ο είδος — υπόθεση δυνατή ή πιθανή", to:"si ... non cedat — Quam ... interimam? (υποτακτική ενεστώτα)" }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του ευθέος λόγου σε πλάγιο", items:[
      { from:"Porcia, Bruti uxor, cum ... cognovisset, ... poposcit eoque se vulneravit; clamore deinde ... vocatus Brutus ad eam obiurgandam venit, quod tonsoris praeripuisset officium",
        to:"Scriptor tradit / tradidit Porciam, Bruti uxorem, cum ... cognovisset, ... poposcisse eoque se vulneravisse; clamore deinde ... vocatum Brutum ad eam obiurgandam venisse, quod tonsoris praeripuisset (κατ' άλλους: praeripuerit) officium",
        note:"Εξάρτηση από ρήμα λεκτικό: Scriptor tradit (αρκτικός χρόνος) / tradidit (ιστορικός χρόνος)." },
      { from:"Cui secreto Porcia inquit «non est hoc temerarium factum meum, sed certissimum indicium amoris mei erga te tale consilium molientem: experiri enim volui, quam aequo animo me ferro essem interemptura, si tibi consilium non ex sententia cessisset»", to:"Porcia inquit non esse illud temerarium factum suum, sed certissimum indicium amoris sui erga illum tale consilium molientem: experiri enim se voluisse, quam aequo animo se ferro esset interemptura, si illi ... cessisset" }
    ]},
    { id:"Ζ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"experiri enim volui, quam aequo animo me ferro essem interemptura, si tibi consilium non ex sententia cessisset (πλάγιος)", to:"Quam aequo animo me ferro interimam, si tibi consilium non ex sententia cesserit? (ευθύς — οριστική συντελεσμένου μέλλοντα)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"Porcia", el:"Πορκία." },
    { la:"Brutus", el:"Βρούτος // (αγγλ.) brutal (= βάναυσος, κτηνώδης), brute (= κτήνος) // (γαλλ.) brut (= ακατέργαστος, ωμός)." },
    { la:"uxor", el:"(γαλλ.) uxori-cide (= συζυγοκτονία) // (αγγλ.) uxorious (= υπερβολικά αφοσιωμένος στη σύζυγο)." },
    { la:"viri", el:"βιρτουόζος (< ιταλ. virtuoso) // (αγγλ.) virile (= ανδρικός, ρωμαλέος) // (γαλλ.) viril (= ανδρικός)." },
    { la:"inter-ficiendo [< interficio < inter + facio], officium [< officio < ob + facio], factum [< facio]", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο) // (γαλλ.) office (= γραφείο), officiel (= επίσημος), faire (= κάνω, φτιάχνω)." },
    { la:"Caesare", el:"Καίσαρας, καισαρική (τομή), καισαρισμός // (γερμ.) Kaiser (= αυτοκράτορας)." },
    { la:"cognovisset [< cognosco < cum + gnosco (αρχαϊκός τύπος του nosco)]", el:"γι-γνώσκω // (αγγλ.) recognize (= αναγνωρίζω) // (γαλλ.) connaître (= γνωρίζω)." },
    { la:"cultellum [< culter]", el:"σκάλλω, σκαλίζω // (αγγλ.) co(u)lter (= μαχαίρι), cutlery (= μαχαιροπίρουνα) // (γαλλ.) couteau (= μαχαίρι) // (ιταλ.) coltello (= μαχαίρι)." },
    { la:"tonsorium, tonsoris [< tonsor < tondeo]", el:"(αγγλ.) tonsure (= κουρά), tonsorial (= σχετικός με το κούρεμα/τον κουρέα) // (γαλλ.) tondre (= κουρεύω)." },
    { la:"unguium [< unguis]", el:"ὄνυξ (= νύχι) // (αγγλ.) ungula (= οπλή), ungulate (= οπληφόρο (θηλαστικό))." },
    { la:"re-secandorum [< re-seco]", el:"σέγα [< (ιταλ.) sega (= πριόνι)] // (αγγλ.) section (= τομή, τμήμα), segment (= τμήμα)." },
    { la:"causa", el:"(γαλλ.) cause (= αιτία), accusation (= κατηγορία), chose (= πράγμα) // (ιταλ.) cosa (= πράγμα) // (ισπαν.) cosa (= πράγμα)." },
    { la:"forte", el:"φουρτούνα (< ιταλ.) // (γαλλ.) fortune (= τύχη) // (αγγλ.) fortuitous (= τυχαίος, συμπτωματικός)." },
    { la:"clamore [< clamor < clamo]", el:"ρε-κλάμα [< (γαλλ.) reclame (= διαφήμιση)] // (αγγλ.) claim (= διεκδικώ, απαίτηση), clamor (= κατακραυγή) // (ιταλ.) chiamare (= καλώ) // (ισπαν.) llamar (= καλώ)." },
    { la:"ancillarum", el:"(αγγλ.) ancillary (= επικουρικός)." },
    { la:"cubiculum", el:"κουβούκλιο // (αγγλ.) shower cubicle (= καμπίνα λουτρού), incubate (= επωάζω), concubine (= παλλακίδα), succumb (= υποκύπτω)." },
    { la:"vocatus [< voco < vox]", el:"(αγγλ.) vocal (= φωνητικός), voice (= φωνή), advocate (= συνήγορος), vocation (= κλήση, επάγγελμα) // (γαλλ.) vocabulaire (= λεξιλόγιο), avocat (= δικηγόρος)." },
    { la:"obiurgandam [< obiurgo < ob + iurgo < iure ago]", el:"ἄγω // (γαλλ.) justice (= δικαιοσύνη), juste (= δίκαιος) // (αγγλ.) justice, jury (= ένορκοι), injury (= βλάβη, αδικία), agent (= πράκτορας), act (= πράξη)." },
    { la:"venit [< venio]", el:"βαίνω // (γαλλ.) venir (= έρχομαι), avenue (= λεωφόρος) // (αγγλ.) invent (= εφευρίσκω), event (= γεγονός), adventure (= περιπέτεια), convention (= σύμβαση)." },
    { la:"prae-ripuisset [< praeripio < prae + rapio]", el:"(γαλλ.) rapt (= απαγωγή), ravir (= αρπάζω, γοητεύω) // (αγγλ.) rapid (= ταχύς), rapture (= έκσταση), ravish (= αρπάζω, συνεπαίρνω)." },
    { la:"secreto [< secretus < se-cerno], certissimum [< certus]", el:"κρίνω // (γαλλ.) secret (= μυστικό), certain (= βέβαιος) // (αγγλ.) discern (= διακρίνω), secretary (= γραμματέας)." },
    { la:"est, essem", el:"εἰμί // (αγγλ.) essence (= ουσία), present (= παρών), absent (= απών), entity (= οντότητα)." },
    { la:"indicium [< index < indico < in + dico]", el:"δείκνυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση) // (αγγλ.) indicate (= υποδεικνύω), index (= δείκτης, ευρετήριο), dictate (= υπαγορεύω), predict (= προβλέπω)." },
    { la:"amoris [< amor]", el:"αμόρε (< ιταλ.) // (γαλλ.) amour (= αγάπη), ami (= φίλος), aimer (= αγαπώ) // (αγγλ.) amateur (= ερασιτέχνης), enemy (= εχθρός) // (ισπαν.) amigo (= φίλος)." },
    { la:"ex-periri [< ex-perior]", el:"πείρα, πειρατής, άπειρος, απειρία // εξπέρ [< (γαλλ.) expert (= ειδικός)] // (αγγλ.) experience (= εμπειρία), experiment (= πείραμα), peril (= κίνδυνος) // (γαλλ.) expérience (= εμπειρία, πείραμα)." },
    { la:"volui [< volo]", el:"βούλομαι // (αγγλ.) volunteer (= εθελοντής), voluntary (= εθελοντικός, εκούσιος), benevolent (= καλοπροαίρετος), malevolent (= κακόβουλος) // (γαλλ.) volonté (= θέληση)." },
    { la:"elapso [< elabor < ex + labor]", el:"λαμβάνω // (αγγλ.) labor (= μόχθος), lapse (= ολίσθημα, παρέλευση), collapse (= κατάρρευση) // (γαλλ.) laborieux (= κοπιώδης)." },
    { la:"vulneravit [< vulnero < vulnus]", el:"οὐλή (= επουλωμένο τραύμα) // (αγγλ.) vulnerable (= τρωτός, ευπαθής)." },
    { la:"aequo", el:"(αγγλ.) equal (= ίσος), equator (= ισημερινός), equation (= εξίσωση) // (γαλλ.) égalité (= ισότητα) // (ισπαν.) igual (= ίσος)." },
    { la:"animo", el:"ανιμισμός (< γαλλ.) // άνεμος // (αγγλ.) animal (= ζώο) // (γαλλ.) âme (= ψυχή) // (ισπαν.) alma (= ψυχή)." },
    { la:"ferro", el:"(γαλλ.) ferreux (= σιδηρούχος) // (αγγλ.) ferrous (= σιδηρούχος) // (ιταλ.) ferro (= σίδηρος) // (ισπαν.) hierro (= σίδηρος)." },
    { la:"inter-emptura [< interimo < inter + emo]", el:"(γερμ.) nehmen (= παίρνω) // (αγγλ.) exempt (= απαλλαγμένος), redeem (= εξαγοράζω, λυτρώνω), premium (= ασφάλιστρο, πριμ)." },
    { la:"sententia [< sentio]", el:"(αγγλ.) sentence (= απόφαση), sentiment (= συναίσθημα), sense (= αίσθηση, νόημα), consent (= συναίνεση) // (γαλλ.) sentir (= αισθάνομαι, μυρίζω)." },
    { la:"cessisset [< cedo]", el:"(γαλλ.) céder (= παραχωρώ), recession (= ύφεση, επιβράδυνση), succès (= επιτυχία) // (αγγλ.) access (= πρόσβαση), process (= διαδικασία)." }
  ]
};

export default UNIT;
