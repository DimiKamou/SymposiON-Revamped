// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 41
//  Lectio XLI — «Μίλα για να σε καταλαβαίνουν, όχι για να μιλάς» (Aulus Gellius)
//  periods, alignment, nouns, adjectives, comparatives, pronouns, verbs, sos
//  + προαιρετικά transforms (Μέρος VIII) & etymology (Μέρος IX).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 41,
  title: "Μίλα για να σε καταλαβαίνουν, όχι για να μιλάς",
  latinTitle: "Lectio XLI",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Curius", r:"Υποκείμενο", to:"στο locuti sunt", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Curius, -ii (-i) (αρσ. β΄) — ο Κούριος" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"Fabricius", r:"Υποκείμενο", to:"στο locuti sunt", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Fabricius, -ii (-i) (αρσ. β΄) — ο Φαβρίκιος" },
        { l:"antiquissimi", r:"Επιθετικός προσδ.", to:"στο viri", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ., υπερθ. βαθμού", d:"antiquissimus, -a, -um (< antiquus) — αρχαιότατος" },
        { l:"viri", r:"Παράθεση", to:"στα Curius, Fabricius", g:"ονομ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"vir, viri (αρσ. β΄) — ο άνδρας", a:"," },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"his", k:"hic", r:"Β΄ όρος σύγκρισης (αφαιρετική συγκριτική)", to:"στο antiquiores", g:"αφαιρ. πληθ., αρσ. — δεικτική αντωνυμία", d:"hic, haec, hoc — αυτός· (Horatii = α΄ όρος)" },
        { l:"antiquiores", r:"Επιθετικός προσδ.", to:"στο Horatii", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ., συγκριτικού βαθμού", d:"antiquior, -ior, -ius (< antiquus) — αρχαιότερος" },
        { l:"Horatii", r:"Υποκείμενο", to:"στο locuti sunt", g:"ονομ. πληθ., αρσ. — ουσιαστικό β΄ κλ. (όνομα γενιάς)", d:"Horatius, -ii (-i) (αρσ. β΄) — ο Οράτιος (πληθ. = η γενιά)" },
        { l:"plane", r:"Επιρρ. προσδ. του τρόπου", to:"στο locuti sunt", g:"τροπικό επίρρημα", d:"plane — καθαρά" },
        { l:"ac", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"ac — και" },
        { l:"dilucide", r:"Επιρρ. προσδ. του τρόπου", to:"στο locuti sunt", g:"τροπικό επίρρημα", d:"dilucide — με διαύγεια" },
        { l:"cum suis", k:"suus", r:"Εμπρόθετος προσδ. της κοινωνίας", to:"στο locuti sunt", g:"cum (πρόθ. + αφαιρ.) + suis (αφαιρ. πληθ., αρσ.)", d:"cum — με· suus, sua, suum — δικός τους (= οι σύγχρονοί τους)", note:"suis: άμεση αυτοπάθεια (στα υποκείμενα)." },
        { l:"locuti sunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου — αποθετικό", d:"loquor, locutus sum, (locutum), loqui (3, αποθετικό) — μιλώ, συνομιλώ", a:";" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Εννοούμενο υποκ.: (Curius, Fabricius, Horatii).", kids:[
        { l:"non", r:"Άρνηση", to:"στο utebantur", g:"αρνητικό μόριο", d:"non — όχι, δεν" },
        { l:"Sicanorum", r:"Γενική κτητική", to:"στο verbis", g:"γεν. πληθ., αρσ. — ουσιαστικό β΄ κλ. (μόνο πληθ.)", d:"Sicani, -orum (αρσ. β΄) — οι Σικανοί" },
        { l:"aut", r:"Σύνδεσμος", g:"παρατακτικός διαζευκτικός σύνδεσμος", d:"aut — ή" },
        { l:"Pelasgorum", r:"Γενική κτητική", to:"στο verbis", g:"γεν. πληθ., αρσ. — ουσιαστικό β΄ κλ. (μόνο πληθ.)", d:"Pelasgi, -orum (αρσ. β΄) — οι Πελασγοί", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στα Sicanorum, Pelasgorum· οριστική (πραγματικό), ενεστώτα (dicuntur).", kids:[
          { l:"qui", r:"Υποκείμενο", to:"στο dicuntur", g:"ονομ. πληθ., αρσ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
          { l:"primi", r:"Επιρρ. κατηγορούμενο της τάξης/σειράς", to:"στο qui (μέσω coluisse)", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ., υπερθ. βαθμού (< prae)", d:"primus, -a, -um — πρώτος, -η, -ο" },
          { l:"coluisse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο dicuntur", g:"απαρέμφατο παρακειμένου ενεργ. φωνής", d:"colo, colui, cultum, colĕre (3) — κατοικώ", note:"qui = υποκ. του coluisse σε ονομαστική (άρση λατινισμού: εξαρτάται από παθ. λεκτικό dicuntur)." },
          { l:"Italiam", r:"Αντικείμενο", to:"στο coluisse", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"Italia, -ae (θηλ. α΄) — η Ιταλία" },
          { l:"dicuntur", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. παθ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέγω", a:"," }
        ]},
        { l:"sed", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"sed — αλλά" },
        { l:"aetatis", r:"Γενική κτητική", to:"στο verbis", g:"γεν. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"aetas, aetatis (θηλ. γ΄) — η εποχή" },
        { l:"suae", r:"Επιθετικός προσδ.", to:"στο aetatis", g:"γεν. ενικ., θηλ. — κτητική αντωνυμία γ΄ προσ. (πολλών κτητόρων)", d:"suus, sua, suum — δικός τους", note:"Άμεση αυτοπάθεια (στα εννοούμενα υποκείμενα)." },
        { l:"verbis", r:"Αντικείμενο", to:"στο utebantur", g:"αφαιρ. πληθ., ουδ. — ουσιαστικό β΄ κλ.", d:"verbum, -i (ουδ. β΄) — ο λόγος, η λέξη", note:"utor + αφαιρετική (αντικείμενο σε αφαιρ.)." },
        { l:"utebantur", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρατατικού — αποθετικό", d:"utor, usus sum, (usum), uti (3, αποθετικό) — χρησιμοποιώ (+ αφαιρ.)", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Tu", r:"Υποκείμενο", to:"στο uteris", g:"ονομ. ενικ. — προσωπική αντωνυμία β΄ προσ.", d:"tu — εσύ" },
        { l:"autem", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"autem — όμως, εξάλλου", a:"," },
        { type:"sub", key:"paravoliki", label:"Υποθετική παραβολική", note:"Δευτ. υποθετική παραβολική (β΄ όρος σύγκρισης με α΄ την κύρια)· proinde quasi + υποτακτική (υποθετική σύγκριση), ενεστώτα (loquaris).", kids:[
          { l:"proinde quasi", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός παραβολικός σύνδεσμος", d:"proinde quasi — σαν να" },
          { l:"cum matre", k:"mater", r:"Εμπρόθετος προσδ. της κοινωνίας", to:"στο loquaris", g:"cum (πρόθ. + αφαιρ.) + matre (αφαιρ. ενικ., θηλ.)", d:"cum — με· mater, matris (θηλ. γ΄) — η μητέρα" },
          { l:"Evandri", r:"Γενική κτητική", to:"στο matre", g:"γεν. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Evander (Evandrus), Evandri (αρσ. β΄) — ο Εύανδρος" },
          { l:"nunc", r:"Επιρρ. προσδ. του χρόνου", to:"στο loquaris", g:"χρονικό επίρρημα", d:"nunc — τώρα" },
          { l:"loquaris", r:"Ρήμα", g:"β΄ ενικ. υποτ. ενεστ. — αποθετικό", d:"loquor, locutus sum, loqui (3, αποθετικό) — μιλώ", note:"Εννοούμενο υποκ.: (tu).", a:"," }
        ]},
        { l:"sermone", r:"Αντικείμενο", to:"στο uteris", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"sermo, sermonis (αρσ. γ΄) — ο λόγος, τα λόγια" },
        { l:"abhinc", r:"Επιρρ. προσδ. του χρόνου", to:"στο obsoleto", g:"χρονικό επίρρημα", d:"abhinc — εδώ και· abhinc multis annis = εδώ και πολλά χρόνια" },
        { l:"multis", r:"Επιθετικός προσδ.", to:"στο annis", g:"αφαιρ. πληθ., αρσ. — επίθ. β΄ κλ.", d:"multi, -ae, -a — πολλοί" },
        { l:"annis", r:"Αφαιρετική του χρόνου", to:"στο obsoleto", g:"αφαιρ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"annus, -i (αρσ. β΄) — το έτος" },
        { l:"iam", r:"Επιρρ. προσδ. του χρόνου", to:"στο obsoleto", g:"χρονικό επίρρημα", d:"iam — πια, ήδη" },
        { l:"obsoleto", r:"Επιθετικός προσδ.", to:"στο sermone", g:"αφαιρ. ενικ., αρσ. — επίθ. β΄ κλ. (επιθετοπ. μετοχή)", d:"obsoletus, -a, -um (< obsolesco) — απαρχαιωμένος, ξεπερασμένος" },
        { l:"uteris", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. — αποθετικό", d:"utor, usus sum, uti (3, αποθετικό) — χρησιμοποιώ (+ αφαιρ.)", a:"," }
      ]},
      { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρ. αιτιολογική στο uteris· quod + οριστική (αντικειμενικά αποδεκτή), ενεστώτα (vis).", kids:[
        { l:"quod", r:"Σύνδεσμος", g:"υποτακτικός αιτιολογικός σύνδεσμος", d:"quod — επειδή" },
        { l:"neminem", k:"nemo", r:"Υποκείμενο απαρεμφάτων", to:"στα scire, intellegere (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — αόριστη ουσιαστική αντωνυμία", d:"nemo (< ne + homo) — κανένας" },
        { l:"scire", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο vis", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"scio, scivi (scii), scitum, scīre (4) — γνωρίζω, ξέρω" },
        { l:"atque", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"atque — και" },
        { l:"intellegere", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο vis", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"intellego, intellexi, intellectum, intellegĕre (3) (< intel + lego) — καταλαβαίνω" },
        { l:"vis", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. — ανώμαλο", d:"volo, volui, —, velle — θέλω", note:"Εννοούμενο υποκ.: (tu).", a:"," },
        { type:"sub", key:"plagia", label:"Πλάγια ερωτηματική", note:"Δευτ. πλάγια ερωτηματική (μερικής άγνοιας), αντικείμενο στα scire, intellegere· υποτακτική (dicas), ενεστώτα — σύγχρονο στο παρόν.", kids:[
          { l:"quae", k:"quis", r:"Αντικείμενο", to:"στο dicas", g:"αιτ. πληθ., ουδ. — ερωτηματική αντωνυμία", d:"quis, quid — ποιος; τι;" },
          { l:"dicas", r:"Ρήμα", g:"β΄ ενικ. υποτ. ενεστ. ενεργ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέγω", note:"Εννοούμενο υποκ.: (tu).", a:"." }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια (ευθεία ερώτηση)", note:"Ευθεία ερώτηση κρίσης, μερικής άγνοιας, ρητορική (= προτροπή: γιατί δεν σωπαίνεις;).", kids:[
        { l:"Quin", r:"Επιρρ. προσδ. της αιτίας", to:"στο taces", g:"ερωτηματικό επίρρημα", d:"quin — γιατί δεν;" },
        { l:"homo", r:"Κλητική προσφώνηση", g:"κλητ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"homo, hominis (αρσ. γ΄) — ο άνθρωπος" },
        { l:"inepte", r:"Επιθετικός προσδ.", to:"στο homo", g:"κλητ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"ineptus, -a, -um — ανόητος, -η, -ο", a:"," },
        { l:"taces", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"taceo, tacui, tacitum, tacēre (2) — σωπαίνω", note:"Εννοούμενο υποκ.: (tu).", a:"," }
      ]},
      { type:"sub", key:"teliki", label:"Τελική", note:"Δευτ. επιρρ. τελική στο taces· ut + υποτακτική ενεστώτα (consequaris) — ιδιομορφία στην ακολουθία (συγχρονισμός).", kids:[
        { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός τελικός σύνδεσμος", d:"ut — για να" },
        { l:"consequaris", r:"Ρήμα", g:"β΄ ενικ. υποτ. ενεστ. — αποθετικό", d:"consequor, consecutus sum, consequi (3, αποθετικό) (< cum + sequor) — πετυχαίνω", note:"Εννοούμενα: υποκ. (tu), αντικ. (id).", a:"," }
      ]},
      { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο (id)· οριστική (πραγματικό), ενεστώτα (vis). quod vis = id, quod vis.", kids:[
        { l:"quod", k:"qui", r:"Αντικείμενο", to:"στο vis", g:"αιτ. ενικ., ουδ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
        { l:"vis", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. — ανώμαλο", d:"volo, volui, —, velle — θέλω", note:"Εννοούμενο υποκ.: (tu).", a:"?" }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Sed", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"sed — αλλά" },
        { l:"antiquitatem", r:"Υποκείμενο απαρεμφάτου", to:"στο placere (ετεροπροσωπία)", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"antiquitas, antiquitatis (θηλ. γ΄) — η αρχαιότητα" },
        { l:"tibi", k:"tu", r:"Αντικείμενο", to:"στο placere", g:"δοτ. ενικ. — προσωπική αντωνυμία β΄ προσ.", d:"tu — εσύ" },
        { l:"placere", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο dicis", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"placeo, placui, placitum, placēre (2) — αρέσω" },
        { l:"dicis", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέγω", note:"Εννοούμενο υποκ.: (tu).", a:"," }
      ]},
      { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρ. αιτιολογική στο placere· quod + υποτακτική (υποκειμενική αιτιολογία), ενεστώτα (sit).", kids:[
        { l:"quod", r:"Σύνδεσμος", g:"υποτακτικός αιτιολογικός σύνδεσμος", d:"quod — επειδή" },
        { l:"honesta", r:"Κατηγορούμενο", to:"στο εννοούμενο antiquitas (μέσω sit)", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"honestus, -a, -um — τιμημένος, ευπρεπής" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"bona", r:"Κατηγορούμενο", to:"στο εννοούμενο antiquitas (μέσω sit)", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"bonus, -a, -um — καλός, -ή, -ό" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"modesta", r:"Κατηγορούμενο", to:"στο εννοούμενο antiquitas (μέσω sit)", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"modestus, -a, -um — σεμνός, κόσμιος" },
        { l:"sit", r:"Ρήμα", g:"γ΄ ενικ. υποτ. ενεστ. — συνδετικό", d:"sum, fui, —, esse — είμαι", note:"Εννοούμενο υποκ.: (antiquitas).", a:"." }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια (επιθυμίας)", note:"Κύρια επιθυμίας — προστακτική (προτροπή).", kids:[
        { l:"Sic", r:"Επιρρ. προσδ. του τρόπου", to:"στο vive", g:"τροπικό επίρρημα", d:"sic — έτσι· παραβολικό ζεύγος sic … ut" },
        { l:"ergo", r:"Σύνδεσμος", g:"παρατακτικός συμπερασματικός σύνδεσμος", d:"ergo — λοιπόν, επομένως" },
        { l:"vive", r:"Ρήμα", g:"β΄ ενικ. προστακτικής ενεστ. ενεργ. φωνής", d:"vivo, vixi, victum, vivĕre (3) — ζω", note:"Εννοούμενο υποκ.: (tu).", a:"," }
      ]},
      { type:"sub", key:"paravoliki", label:"Παραβολική", note:"Δευτ. απλή παραβολική του τρόπου (β΄ όρος σύγκρισης)· ut + οριστική (πραγματικότητα)· εννοείται vivebant.", kids:[
        { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός παραβολικός σύνδεσμος", d:"ut — όπως" },
        { l:"viri", r:"Υποκείμενο", to:"στο εννοούμενο vivebant", g:"ονομ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"vir, viri (αρσ. β΄) — ο άνδρας" },
        { l:"antiqui", r:"Επιθετικός προσδ.", to:"στο viri", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ.", d:"antiquus, -a, -um — αρχαίος, -α, -ο", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (επιθυμίας)", note:"Κύρια επιθυμίας — προστακτική· συνδέεται παρατακτικά αντιθετικά (sed).", kids:[
        { l:"sed", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"sed — αλλά" },
        { l:"sic", r:"Επιρρ. προσδ. του τρόπου", to:"στο loquere", g:"τροπικό επίρρημα", d:"sic — έτσι" },
        { l:"loquere", r:"Ρήμα", g:"β΄ ενικ. προστακτικής ενεστ. — αποθετικό", d:"loquor, locutus sum, loqui (3, αποθετικό) — μιλώ", note:"Εννοούμενο υποκ.: (tu).", a:"," }
      ]},
      { type:"sub", key:"paravoliki", label:"Παραβολική", note:"Δευτ. απλή παραβολική του τρόπου (β΄ όρος σύγκρισης)· ut + οριστική· εννοείται loquuntur.", kids:[
        { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός παραβολικός σύνδεσμος", d:"ut — όπως" },
        { l:"viri", r:"Υποκείμενο", to:"στο εννοούμενο loquuntur", g:"ονομ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"vir, viri (αρσ. β΄) — ο άνδρας" },
        { l:"aetatis", r:"Γενική κτητική", to:"στο viri", g:"γεν. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"aetas, aetatis (θηλ. γ΄) — η εποχή" },
        { l:"nostrae", r:"Επιθετικός προσδ.", to:"στο aetatis", g:"γεν. ενικ., θηλ. — κτητική αντωνυμία α΄ προσ. (πολλών κτητόρων)", d:"noster, nostra, nostrum — δικός μας", a:";" }
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια (επιθυμίας)", note:"Κύρια επιθυμίας — προστακτική· συνδέεται με atque.", kids:[
        { l:"atque", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"atque — και" },
        { l:"id", r:"Αντικείμενο", to:"στο habe", g:"αιτ. ενικ., ουδ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό" },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο id· οριστική (πραγματικό), παρακειμένου (scriptum est).", kids:[
          { l:"quod", k:"qui", r:"Υποκείμενο", to:"στο scriptum est", g:"ονομ. ενικ., ουδ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
          { l:"a C. Caesare", k:"Caesar", r:"Εμπρόθετο ποιητικό αίτιο", to:"στο scriptum est", g:"a (πρόθ. + αφαιρ.) + C. Caesare (αφαιρ. ενικ., αρσ.)", d:"a — από· Caesar, Caesaris (αρσ. γ΄) — ο Καίσαρας (De Analogia)", note:"Ποιητικό αίτιο εμπρόθετα (έμψυχο)." },
          { l:"scriptum est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής", d:"scribo, scripsi, scriptum, scribĕre (3) — γράφω", a:"," }
        ]},
        { l:"habe", r:"Ρήμα", g:"β΄ ενικ. προστακτικής ενεστ. ενεργ. φωνής", d:"habeo, habui, habitum, habēre (2) — έχω", note:"Εννοούμενο υποκ.: (tu)." },
        { l:"semper", r:"Επιρρ. προσδ. του χρόνου", to:"στο habe", g:"χρονικό επίρρημα", d:"semper — πάντοτε" },
        { l:"in memoria", k:"memoria", r:"Εμπρόθετος προσδ. (στάση σε τόπο, μεταφ.)", to:"στο habe", g:"in (πρόθ. + αφαιρ.) + memoria (αφαιρ. ενικ., θηλ.)", d:"in — σε· memoria, -ae (θηλ. α΄) — η μνήμη" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"in pectore", k:"pectus", r:"Εμπρόθετος προσδ. (στάση σε τόπο, μεταφ.)", to:"στο habe", g:"in (πρόθ. + αφαιρ.) + pectore (αφαιρ. ενικ., ουδ.)", d:"in — σε· pectus, pectoris (ουδ. γ΄) — η καρδιά, το στήθος", a:":" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (επιθυμίας)", note:"Κύρια επιθυμίας — προτρεπτική υποτακτική (προτροπή). Το «tamquam scopulum» = βραχυλογική παραβολή (= tamquam scopulus sit).", kids:[
        { l:"tamquam scopulum", k:"scopulus", r:"Βραχυλογική παραβολή (κατηγορούμενο στο verbum)", to:"στο verbum", g:"tamquam (υποθ. παραβολικός σύνδ.) + scopulum (αιτ. ενικ., αρσ.)", d:"tamquam — σαν· scopulus, -i (αρσ. β΄) — ο σκόπελος", note:"Ισοδυναμεί με tamquam scopulus sit (verbum): δευτ. υποθετική παραβολική." },
        { l:"sic", r:"Επιρρ. προσδ. του τρόπου", to:"στο fugias", g:"τροπικό επίρρημα", d:"sic — έτσι" },
        { l:"fugias", r:"Ρήμα", g:"β΄ ενικ. υποτ. ενεστ. (προτρεπτική) ενεργ. φωνής", d:"fugio, fugi, fugitum, fugĕre (3, σε -io) — αποφεύγω", note:"Εννοούμενο υποκ.: (tu)." },
        { l:"verbum", r:"Αντικείμενο", to:"στο fugias", g:"αιτ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"verbum, -i (ουδ. β΄) — ο λόγος, η λέξη" },
        { l:"insolens", r:"Επιθετικός προσδ.", to:"στο verbum", g:"αιτ. ενικ., ουδ. — επίθ. γ΄ κλ. (μονοκατάληκτο)", d:"insolens, insolentis — ασυνήθιστος, -η, -ο" },
        { l:"atque", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"atque — και" },
        { l:"inauditum", r:"Επιθετικός προσδ.", to:"στο verbum", g:"αιτ. ενικ., ουδ. — επίθ. β΄ κλ.", d:"inauditus, -a, -um — ανήκουστος, πρωτάκουστος", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Curius et Fabricius, antiquissimi viri, et his antiquiōres Horatii plane ac dilucide cum suis locūti sunt;", el:"Ο Κούριος και ο Φαβρίκιος, αρχαιότατοι άνδρες, και οι αρχαιότεροι από αυτούς Οράτιοι μίλησαν καθαρά και με διαύγεια με τους συγχρόνους τους·" },
    { la:"non Sicanōrum aut Pelasgōrum, qui primi coluisse Italiam dicuntur, sed aetātis suae verbis utebantur.", el:"δεν χρησιμοποιούσαν τη γλώσσα των Σικανών ή των Πελασγών, οι οποίοι λέγεται ότι κατοίκησαν πρώτοι την Ιταλία, αλλά (τη γλώσσα) της εποχής τους." },
    { la:"Tu autem, proinde quasi cum matre Evandri nunc loquāris, sermōne abhinc multis annis iam obsolēto uteris, quod neminem scire atque intellegere vis, quae dicas.", el:"Εσύ όμως, σαν να μιλάς τώρα με τη μητέρα του Ευάνδρου, χρησιμοποιείς λόγο απαρχαιωμένο εδώ και πολλά χρόνια πια, επειδή δεν θέλεις κανείς να ξέρει και να καταλαβαίνει τι λες." },
    { la:"Quin, homo inepte, taces, ut consequāris, quod vis?", el:"Γιατί, ανόητε άνθρωπε, δεν σωπαίνεις, για να πετύχεις αυτό που θέλεις;" },
    { la:"Sed antiquitātem tibi placēre dicis, quod honesta et bona et modesta sit.", el:"Αλλά λες ότι σου αρέσει η αρχαιότητα, γιατί (τάχα) είναι τιμημένη και καλή και σεμνή." },
    { la:"Sic ergo vive, ut viri antīqui, sed sic loquere, ut viri aetātis nostrae;", el:"Έτσι λοιπόν να ζεις, όπως οι αρχαίοι άνδρες, αλλά να μιλάς έτσι, όπως οι άνδρες της εποχής μας·" },
    { la:"atque id quod a C. Caesare scriptum est, habe semper in memoriā et in pectore: «tamquam scopulum, sic fugias verbum insolens atque inaudītum».", el:"και αυτό που γράφτηκε από τον Γάιο Καίσαρα, να το έχεις πάντοτε στη μνήμη και στην καρδιά: «σαν τον σκόπελο, έτσι να αποφεύγεις τον ασυνήθιστο και πρωτάκουστο λόγο»." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"Italia, -ae", note:"κύριο όνομα — μόνο ενικ." },
        { form:"memoria, -ae", note:"αφηρημ. — μόνο ενικ." }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Curius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Curi" },
        { form:"Fabricius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Fabrici" },
        { form:"vir, viri" },
        { form:"Horatius, -ii (-i)", note:"όνομα γενιάς — εδώ πληθ. (Horatii)" },
        { form:"Sicani, -orum", note:"όνομα λαού — μόνο πληθ." },
        { form:"Pelasgi, -orum", note:"όνομα λαού — μόνο πληθ." },
        { form:"Evander / Evandrus, Evandri", note:"κύριο όνομα — μόνο ενικ." },
        { form:"annus, -i" },
        { form:"scopulus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"verbum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"sermo, sermonis" },
        { form:"homo, hominis" },
        { form:"C. Caesar, Caesaris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"aetas, aetatis", note:"γεν. πληθ. -um/-ium, αιτ. πληθ. -es/-is" },
        { form:"mater, matris", note:"γεν. πληθ. -um (matrum), εξαίρεση" },
        { form:"antiquitas, antiquitatis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"pectus, pectoris" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"antiquus, -a, -um" },
      { form:"primus, -a, -um", note:"υπερθ. (< prae)· χωρίς θετικό βαθμό" },
      { form:"multi, -ae, -a", note:"μόνο πληθ.· ανώμαλα παραθετικά" },
      { form:"obsoletus, -a, -um", note:"επιθετοπ. μετοχή· δεν σχηματίζει παραθετικά" },
      { form:"ineptus, -a, -um" },
      { form:"honestus, -a, -um" },
      { form:"bonus, -a, -um", note:"ανώμαλα παραθετικά" },
      { form:"modestus, -a, -um" },
      { form:"inauditus, -a, -um", note:"δεν σχηματίζει παραθετικά (απόλυτο)" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"insolens, insolens, insolens (insolentis)", note:"μονοκατάληκτο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ ──────────────────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"antiquus, -a, -um", comp:"antiquior, -ior, -ius", sup:"antiquissimus, -a, -um", note:"επίρρ.: antique → antiquius → antiquissime" },
      { pos:"(prae)", comp:"prior, prior, prius", sup:"primus, -a, -um", note:"χωρίς θετικό· επίρρ. primum/primo" },
      { pos:"multi, -ae, -a", comp:"plures, -es, -a", sup:"plurimi, -ae, -a", note:"ανώμαλα· επίρρ.: multum → plus → plurimum" },
      { pos:"bonus, -a, -um", comp:"melior, -ior, -ius", sup:"optimus, -a, -um", note:"ανώμαλα· επίρρ.: bene → melius → optime" },
      { pos:"ineptus, -a, -um", comp:"ineptior, -ior, -ius", sup:"ineptissimus, -a, -um", note:"επίρρ.: inepte → ineptius → ineptissime" },
      { pos:"honestus, -a, -um", comp:"honestior, -ior, -ius", sup:"honestissimus, -a, -um", note:"επίρρ.: honeste → honestius → honestissime" },
      { pos:"modestus, -a, -um", comp:"modestior, -ior, -ius", sup:"modestissimus, -a, -um", note:"επίρρ.: modeste → modestius → modestissime" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"insolens, insolens, insolens", comp:"insolentior, -ior, -ius", sup:"insolentissimus, -a, -um", note:"επίρρ.: insolenter → insolentius → insolentissime" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"his" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., πολλών κτητόρων (suis, suae)" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"qui, quod" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσώπου (tu, tibi)" },
    { form:"nemo", kind:"Αόριστη ουσιαστική", extra:"< ne + homo· αναπληρώνεται από nullus" },
    { form:"quis, quid", kind:"Ερωτηματική ουσιαστική", extra:"quae (πλάγια ερώτηση)" },
    { form:"noster, nostra, nostrum", kind:"Κτητική", extra:"α΄ προσ., πολλών κτητόρων" },
    { form:"is, ea, id", kind:"Δεικτική-επαναληπτική", extra:"id" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Β΄ συζυγία", rows:[
      { pres:"taceo", perf:"tacui", sup:"tacitum", inf:"tacēre", note:"" },
      { pres:"placeo", perf:"placui", sup:"placitum", inf:"placēre", note:"" },
      { pres:"habeo", perf:"habui", sup:"habitum", inf:"habēre", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"loquor", perf:"locutus sum", sup:"(locutum)", inf:"loqui", note:"αποθετικό" },
      { pres:"colo", perf:"colui", sup:"cultum", inf:"colĕre", note:"" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicĕre", note:"προστ. dic" },
      { pres:"utor", perf:"usus sum", sup:"(usum)", inf:"uti", note:"αποθετικό (+ αφαιρ.)" },
      { pres:"intellego / intelligo", perf:"intellexi", sup:"intellectum", inf:"intellegĕre", note:"< intel + lego" },
      { pres:"consequor", perf:"consecutus sum", sup:"(consecutum)", inf:"consequi", note:"αποθετικό (< cum + sequor)" },
      { pres:"vivo", perf:"vixi", sup:"victum", inf:"vivĕre", note:"" },
      { pres:"scribo", perf:"scripsi", sup:"scriptum", inf:"scribĕre", note:"" },
      { pres:"fugio", perf:"fugi", sup:"fugitum", inf:"fugĕre", note:"3, σε -io· προστ. fuge" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"scio", perf:"scivi (scii)", sup:"scitum", inf:"scīre", note:"προστ. scito / scitote" }
    ]},
    { syz:"Ανώμαλα ρήματα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"volo", perf:"volui", sup:"—", inf:"velle", note:"χωρίς προστακτική" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Παραβολικές", title:"Απλές vs υποθετικές παραβολικές", body:"Το κείμενο έχει και τις δύο κατηγορίες: «ut viri antiqui / ut viri aetatis nostrae» = απλές παραβολικές (ut + οριστική, πραγματική σύγκριση· παραβολικό ζεύγος sic … ut)· «proinde quasi … loquaris» και «tamquam scopulum (= tamquam scopulus sit)» = υποθετικές παραβολικές (proinde quasi / tamquam + υποτακτική, υποθετική σύγκριση)." },
    { tag:"Ρηματικά", title:"Αποθετικά ρήματα", body:"loquor, utor, consequor (και το προστ. loquere): αποθετικά — κλίνονται στη μέση φωνή με ενεργητική σημασία. Το utor συντάσσεται με αντικείμενο σε αφαιρετική (verbis, sermone). Κάθε αποθετικό έχει 6 τύπους ενεργητικής φωνής (μετοχές, απαρ./υποτ. μέλλοντα, γερούνδιο, σουπίνο)." },
    { tag:"Προτροπή", title:"Προτρεπτικές κύριες προτάσεις", body:"Οι κύριες επιθυμίας εκφράζουν προτροπή: vive, loquere, habe (προστακτική) και fugias (προτρεπτική υποτακτική). Πρβ. και τη ρητορική ερώτηση «Quin … taces?» που ισοδυναμεί με προτροπή (= γιατί δεν σωπαίνεις;)." },
    { tag:"Απαρέμφατο", title:"Άρση του λατινισμού", body:"«qui primi coluisse Italiam dicuntur»: το υποκείμενο (qui) του ειδικού απαρεμφάτου (coluisse) μπαίνει σε ονομαστική (όχι αιτιατική), γιατί το απαρέμφατο εξαρτάται από παθητικό λεκτικό ρήμα (dicuntur) — προσωπική σύνταξη / άρση του λατινισμού." },
    { tag:"Δευτ. πρόταση", title:"Πλάγια ερωτηματική «quae dicas»", body:"«quod neminem scire … vis, quae dicas»: η «quae dicas» είναι δευτ. πλάγια ερωτηματική (μερικής άγνοιας), αντικείμενο στα απαρέμφατα scire/intellegere· εκφέρεται πάντα με υποτακτική (dicas)." },
    { tag:"Σκοπός", title:"Δήλωση του σκοπού με 5 τρόπους", body:"«ut consequaris»: ο σκοπός δηλώνεται με 5 τρόπους — τελική ut· αναφορική-τελική (qui consequaris)· σουπίνο (consecutum)· ad + αιτ. γερουνδίου (ad consequendum)· γεν. γερουνδίου + causa/gratia (consequendi causa). Εδώ αποφεύγεται η γερουνδιακή έλξη, γιατί το αντικείμενο (id) είναι ουδέτερο αντωνυμίας." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Μετατροπή δευτ. προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Tu autem, proinde quasi … loquaris, sermone … uteris, quod neminem scire atque intellegere vis, quae dicas",
        to:"Tu autem, proinde quasi … loquens, sermone … uteris neminem scire atque intellegere volens / cupiens, quae dicas",
        note:"Η υποθετική παραβολική → υποθετική μετοχή (loquens) και η αιτιολογική → αιτιολογική μετοχή (volens/cupiens), συνημμένες στο υποκ. tu." },
      { from:"…; atque id quod a C. Caesare scriptum est, habe …",
        to:"…; atque id a C. Caesare scriptum habe …",
        note:"Η αναφορική → επιθετική μετοχή (scriptum), με υποκ. το id (αντικ. του habe)." }
    ]},
    { id:"Β", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"…, habe semper in memoria et in pectore",
        to:"…, habeatur a te semper in memoria et in pectore." },
      { from:"…, sic fugias verbum insolens atque inauditum",
        to:"…, sic fugiatur a te verbum (ονομ.) insolens (ονομ.) atque inauditum (ονομ.)." }
    ]},
    { id:"Γ", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"… id quod a C. Caesare scriptum est …",
        to:"… id quod (αιτ.) C. Caesar scripsit …" }
    ]},
    { id:"Δ", label:"Δήλωση του σκοπού με όλους τους τρόπους (5)", items:[
      { from:"Quin, homo inepte, taces, ut consequaris (id), quod vis?",
        to:["α. Τελική: … taces, ut consequaris (id), quod vis?",
            "β. Αναφορική-τελική: … taces, qui consequaris (id), quod vis?",
            "γ. Σουπίνο: … taces consecutum (id), quod vis?",
            "δ. ad + αιτ. γερουνδίου: … taces ad consequendum (id), quod vis?",
            "ε. γεν. γερουνδίου + causa / gratia: … taces consequendi causa / gratia (id), quod vis?"],
        note:"Στις περιπτώσεις δ & ε αποφεύγεται η γερουνδιακή έλξη, γιατί το αντικείμενο του γερουνδίου (id) είναι ουδέτερο αντωνυμίας." }
    ]},
    { id:"Ε", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"(εξάρτηση: Philosophus dicit / dixit) Curius et Fabricius … locuti sunt; … verbis utebantur; Tu autem … uteris",
        to:"Curium et Fabricium … et illis antiquiores (αιτ.) Horatios … locutos esse; non … sed aetatis suae verbis eos uti; illum autem … sermone … uteris, quod neminem scire atque intellegere velit / vellet, quae dicat / diceret.",
        note:"Οι κύριες κρίσης → ειδικά απαρέμφατα με υποκ. σε αιτ.· τα ρήματα των δευτ. προτάσεων σε υποτακτική." },
      { from:"(εξάρτηση: Philosophus interrogat / interrogavit hominem ineptum) Quin … taces, ut consequaris, quod vis?",
        to:"… qui taceat / taceret, ut consequatur / consequeretur, quod velit / vellet.",
        note:"Ευθεία ερώτηση → πλάγια (αναφορική qui + υποτακτική)." },
      { from:"(εξάρτηση: Philosophus putat / putabat) Sed antiquitatem tibi placere dicis, quod … sit",
        to:"antiquitatem illi placere illum dicere, quod honesta et bona et modesta sit / esset." },
      { from:"(εξάρτηση: Philosophus admonet / admonuit adulescentem) Sic ergo vive …; sed sic loquere …; atque id … habe …; … sic fugias …",
        to:"ut sic vivat / viveret, ut viri antiqui, sed sic loquatur / loqueretur, ut viri aetatis suae; ut id quod a C. Caesare scriptum sit / esset, habeat / haberet …; ut, tamquam scopulum, sic fugiat / fugeret verbum insolens atque inauditum.",
        note:"Οι κύριες επιθυμίας (προστακτική) → βουλητικές προτάσεις (ut + υποτακτική) ή τελικά απαρέμφατα (admoneo + ut / απαρέμφατο)." }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"…, qui primi coluisse Italiam dicuntur, …",
        to:"…, qui primi Italiam coluerunt / coluere, …" },
      { from:"Sed antiquitatem tibi placere dicis, quod … sit",
        to:"Antiquitas mihi placet, quod … est (αντικειμενική αιτιολογία) ή sit (υποκειμενική)." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"Curius", el:"Κούριος" },
    { la:"Fabricius", el:"Φαβρίκιος" },
    { la:"antiquissimi, antiquiores, antiquitatem, antiqui [< antiquus < ante]", el:"αντίκα (< ιταλ.), αντικέρ (< γαλλ.)" },
    { la:"viri", el:"βιρτουόζος (< ιταλ. virtuoso)" },
    { la:"Horatii", el:"Οράτιος" },
    { la:"di-lucide", el:"λευκός, λύχνος // (γαλλ.) lune (= σελήνη), lumière (= φως)" },
    { la:"locūti, loquāris, loquere [< loquor]", el:"(γαλλ.) loquace (= ομιλητικός)" },
    { la:"sunt, sit, est", el:"εἰμί" },
    { la:"Sicanōrum", el:"Σικανοί" },
    { la:"Pelasgōrum", el:"Πελασγοί" },
    { la:"primi", el:"πρό, πρότερος, πρῶτος· πριν // πριμαντόνα (< ιταλ.) // (γαλλ.) primaire (= πρωτογενής)" },
    { la:"coluisse [< colo]", el:"κουλτούρα" },
    { la:"Italiam", el:"Ιταλία" },
    { la:"dicuntur, dicas, dicis [< dico]", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= υπαγόρευση)" },
    { la:"aetātis [< aetas < aevitas]", el:"(αγγλ.) eternal (= αιώνιος)" },
    { la:"verbis, verbum", el:"(Ϝερέω) ἐρῶ // (γαλλ.) verbe (= ρήμα)· βερμπαλισμός (< γαλλ.)" },
    { la:"utebantur, uteris [< utor]", el:"(αγγλ.) utility, use // (γαλλ.) utile (= χρήσιμος), utiliser (= χρησιμοποιώ)" },
    { la:"matre [< mater]", el:"μήτηρ // (γαλλ.) maternel (= μητρικός), matrimonial (= γαμήλιος)" },
    { la:"Evandri", el:"Εύανδρος" },
    { la:"nunc", el:"νῦν" },
    { la:"sermōne", el:"(αγγλ.) sermon (= ομιλία, κήρυγμα)" },
    { la:"multis", el:"μάλα (= πολύ)" },
    { la:"annis", el:"(γαλλ.) année (= έτος, χρονιά)" },
    { la:"obsolēto [< ob-solesco], in-solens [< soleo]", el:"(γαλλ.) obsolète (= απαρχαιωμένος), insolent (= ιταμός)" },
    { la:"neminem [< nemo < ne + homo], homo", el:"ουμανισμός (< γαλλ.)" },
    { la:"scire [< scio]", el:"(γαλλ.) science (= επιστήμη), conscient (= ειδήμων)" },
    { la:"intellegere [< intellego]", el:"(γαλλ.) intelligent (= ευφυής)" },
    { la:"vis [< volo]", el:"βούλομαι // (αγγλ.) volunteer (= εθελοντής)" },
    { la:"in-epte [< in + aptus]", el:"ἅπτω // (αγγλ.) inept (= ανάρμοστος, ανόητος)" },
    { la:"taces", el:"(αγγλ.) tacit (= σιωπηρός)" },
    { la:"con-sequāris", el:"ἕπομαι // (αγγλ.) sequent (= ακόλουθος) // (γαλλ.) obséquieux (= δουλοπρεπής), seconde (= δευτερόλεπτο)" },
    { la:"placēre", el:"(αγγλ.) placebo (= εικονικό φάρμακο)" },
    { la:"honesta", el:"ονόρε (< ιταλ.) // (αγγλ.) honor (= τιμή) // (γαλλ.) honorable (= αξιότιμος)" },
    { la:"bona", el:"μπονα-μάς [< ιταλ. bona mano], μπουνάτσα (< βενετ.), μπόνους" },
    { la:"modesta [< modus]", el:"(γαλλ.) modeste (= σεμνός)" },
    { la:"vive [< vivo]", el:"βίος // βιταλισμός, βιταμίνη (< γαλλ.)" },
    { la:"Gaio, Caesare", el:"Γάιος· Καίσαρας, καισαρική (τομή), καισαρισμός" },
    { la:"scriptum", el:"σκάριφος (= όργανο γραφής), σκαρίφημα // (αγγλ.) script (= σενάριο)" },
    { la:"habe", el:"(γερμ.) haben, (αγγλ.) have" },
    { la:"semper", el:"(ισπαν.) siempre (= πάντα)" },
    { la:"memoria", el:"μέμνημαι, μνήμη, μνημονικός // (αγγλ.) monument (= μνημείο)" },
    { la:"pectore", el:"πέτο [< ιταλ. petto (= στήθος)] // (γαλλ.) pectoral (= θωρακικός)" },
    { la:"scopulum", el:"σκόπελος (= βράχος)" },
    { la:"fugias [< fugio]", el:"φεύγω, φυγή // (αγγλ.) fugitive (= φυγάς)" },
    { la:"in-auditum [< audio]", el:"ἄω" }
  ]
};

export default UNIT;
