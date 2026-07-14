// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 39
//  Lectio XXXIX — «Ένα πρότυπο ιδανικού ανθρώπου» (Seneca)
//  Δομή ίδια με το template (unit16.js): periods -> kids (λέξεις/προτάσεις),
//  alignment, nouns, adjectives, comparatives, pronouns, verbs, sos.
//  + προαιρετικά πεδία `transforms` (Μέρος VIII) & `etymology` (Μέρος IX).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 39,
  title: "Ένα πρότυπο ιδανικού ανθρώπου",
  latinTitle: "Lectio XXXIX",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Sapientem", r:"Αντικείμενο", to:"στο prohibet", g:"αιτ. ενικ., αρσ. — ουσιαστικό γ΄ κλ. (ουσιαστικοπ. μετοχή)", d:"sapiens, sapientis (αρσ. γ΄) — ο σοφός" },
        { l:"nec", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός (αποφατικός) σύνδεσμος", d:"nec — ούτε" },
        { l:"paupertas", r:"Υποκείμενο", to:"στο prohibet", g:"ονομ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"paupertas, paupertatis (θηλ. γ΄) — η φτώχεια" },
        { l:"nec", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός (αποφατικός) σύνδεσμος", d:"nec — ούτε" },
        { l:"dolor", r:"Υποκείμενο", to:"στο prohibet", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"dolor, doloris (αρσ. γ΄) — ο πόνος, η λύπη" },
        { l:"prohibet", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"prohibeo, prohibui, prohibitum, prohibēre (2) (< pro + habeo) — εμποδίζω", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Ασύνδετο σχήμα με την προηγούμενη κύρια (χωρίζονται με κόμμα)· εννοείται το ρήμα prohibent. Τα υποκείμενα συνδέονται παρατακτικά (nec … nec … nec).", kids:[
        { l:"nec", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός (αποφατικός) σύνδεσμος", d:"nec — ούτε" },
        { l:"eae", r:"Επιθετικός προσδ.", to:"στο res", g:"ονομ. πληθ., θηλ. — δεικτική (ως οριστική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό" },
        { l:"res", r:"Υποκείμενο", to:"στο εννοούμενο prohibent", g:"ονομ. πληθ., θηλ. — ουσιαστικό ε΄ κλ.", d:"res, rei (θηλ. ε΄) — το πράγμα", a:"," }
      ]},
      { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο res· οριστική (πραγματικό), ενεστώτα (avertunt) — σύγχρονο στο παρόν.", kids:[
        { l:"quae", r:"Υποκείμενο", to:"στο avertunt", g:"ονομ. πληθ., θηλ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος, η οποία, το οποίο" },
        { l:"imperitos", r:"Αντικείμενο", to:"στο avertunt", g:"αιτ. πληθ., αρσ. — επίθ. β΄ κλ.", d:"imperitus, -a, -um — άπειρος, -η, -ο" },
        { l:"avertunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. ενεργ. φωνής", d:"averto, averti, aversum, avertĕre (3) (< a + verto) — βγάζω κάποιον από τον δρόμο του" }
      ]},
      { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο res, συνδεόμενη με την προηγούμενη με et (χωρίς επανάληψη του quae)· οριστική, ενεστώτα (agunt).", kids:[
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"praecipites", r:"Κατηγορούμενο", to:"στο εννοούμενο αντικ. (imperitos) (μέσω agunt)", g:"αιτ. πληθ., αρσ. — επίθ. γ΄ κλ. (μονοκατάληκτο)", d:"praeceps, praecipitis — αυτός που πέφτει με το κεφάλι", note:"aliquem praecipitem ago = γκρεμοτσακίζω κάποιον." },
        { l:"agunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. ενεργ. φωνής", d:"ago, egi, actum, agĕre (3) — οδηγώ, σπρώχνω", note:"Εννοείται υποκ. (quae) & αντικ. (imperitos).", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια (ευθεία ερώτηση)", note:"Ευθεία ερώτηση ολικής αγνοίας.", kids:[
        { l:"Tu", r:"Υποκείμενο", to:"στο putas", g:"ονομ. ενικ. — προσωπική αντωνυμία β΄ προσ.", d:"tu — εσύ" },
        { l:"illum", r:"Υποκείμενο απαρεμφάτου", to:"στο premi (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — δεικτική αντωνυμία", d:"ille, illa, illud — εκείνος, -η, -ο", note:"illum = τον σοφό (sapientem)." },
        { l:"premi", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο putas", g:"απαρέμφατο ενεστ. παθ. φωνής", d:"premo, pressi, pressum, premĕre (3) — καταβάλλω, πιέζω" },
        { l:"putas", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"puto, putavi, putatum, putāre (1) — νομίζω, θεωρώ" },
        { l:"malis", r:"Αφαιρετική (οργανική) του μέσου", to:"στο premi", g:"αφαιρ. πληθ., ουδ. — ουσιαστικό β΄ κλ.", d:"mala, -orum (ουδ. β΄, μόνο πληθ.) — οι συμφορές", a:"?" }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Utitur", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. — αποθετικό", d:"utor, usus sum, (usum), uti (3, αποθετικό) — χρησιμοποιώ (+ αφαιρ.)", note:"Εννοείται υποκ. (sapiens) & αντικ. σε αφαιρετική (malis) = (αντίθετα) τις χρησιμοποιεί.", a:"!" }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Non", r:"Άρνηση", to:"στο sciebat", g:"αρνητικό μόριο", d:"non — δεν, όχι", note:"Non … tantum = όχι μόνο." },
        { l:"ex ebore", k:"ebur", r:"Εμπρόθετος προσδ. της ύλης", to:"στο facere", g:"ex (πρόθ. + αφαιρ.) + ebore (αφαιρ. ενικ., ουδ.)", d:"ex — από· ebur, eboris (ουδ. γ΄) — το ελεφαντόδοντο" },
        { l:"tantum", r:"Επιρρ. προσδ. (μόνο)", to:"στο facere", g:"ποσοτικό επίρρημα", d:"tantum — μόνο" },
        { l:"Phidias", r:"Υποκείμενο", to:"στο sciebat", g:"ονομ. ενικ., αρσ. — ουσιαστικό α΄ κλ. (ελλην.)", d:"Phidias, -ae (αρσ. α΄) — ο Φειδίας", note:"Αιτ. Phidiam & Phidian (ελλην. τύπος)." },
        { l:"sciebat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής", d:"scio, scivi (scii), scitum, scīre (4) — γνωρίζω, ξέρω" },
        { l:"facere", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο (non) sciebat", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"facio, feci, factum, facĕre (3, σε -io) — κάνω, φτιάχνω" },
        { l:"simulacra", r:"Αντικείμενο", to:"στο facere", g:"αιτ. πληθ., ουδ. — ουσιαστικό β΄ κλ.", d:"simulacrum, -i (ουδ. β΄) — το άγαλμα, το ομοίωμα", a:";" }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Ελλειπτική — εννοούνται Phidias (υποκ.) & simulacra (αντικ.).", kids:[
        { l:"ex aere", k:"aes", r:"Εμπρόθετος προσδ. της ύλης", to:"στο faciebat", g:"ex (πρόθ. + αφαιρ.) + aere (αφαιρ. ενικ., ουδ.)", d:"ex — από· aes, aeris (ουδ. γ΄) — ο χαλκός, ο μπρούντζος" },
        { l:"quoque", r:"Επιρρ. προσδ. (επίσης)", to:"στο faciebat", g:"τροπικό (προσθετικό) επίρρημα", d:"quoque — επίσης" },
        { l:"faciebat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής", d:"facio, feci, factum, facĕre (3, σε -io) — φτιάχνω", a:"." }
      ]}
    ]},

    { n: 6, kids: [
      { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"Δευτ. επιρρ. υποθετική (υπόθεση)· si + υποτ. υπερσυντελίκου (obtulisses). Απόδοση: fecisset tale. Β΄ είδος — αντίθετη προς την πραγματικότητα στο παρελθόν.", kids:[
        { l:"Si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
        { l:"marmor", r:"Άμεσο αντικείμενο", to:"στο obtulisses", g:"αιτ. ενικ., ουδ. — ουσιαστικό γ΄ κλ.", d:"marmor, marmoris (ουδ. γ΄) — το μάρμαρο" },
        { l:"illi", r:"Έμμεσο αντικείμενο", to:"στο obtulisses", g:"δοτ. ενικ., αρσ. — δεικτική αντωνυμία", d:"ille, illa, illud — εκείνος (= στον Φειδία)" },
        { l:"obtulisses", r:"Ρήμα", g:"β΄ ενικ. υποτ. υπερσυντελίκου ενεργ. φωνής — ανώμαλο", d:"obfero (offero), obtuli, oblatum, obferre (offerre) (< ob + fero) — προσφέρω (+ δοτ.)", note:"Εννοούμενο υποκ.: (tu).", a:"," }
      ]},
      { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"Β΄ όρος υπόθεσης, σε ασύνδετο σχήμα με την προηγούμενη· εννοείται obtulisses.", kids:[
        { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
        { l:"viliorem", r:"Επιθετικός προσδ.", to:"στο materiam", g:"αιτ. ενικ., θηλ. — επίθ. γ΄ κλ., συγκριτικού βαθμού", d:"vilior, -ior, -ius (< vilis, -is, -e) — πιο ευτελής, φτηνότερος" },
        { l:"materiam", r:"Άμεσο αντικείμενο", to:"στο εννοούμενο obtulisses", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ. (& ε΄: materies)", d:"materia, -ae (θηλ. α΄) — το υλικό, η ύλη", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"fecisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσυντελίκου ενεργ. φωνής", d:"facio, feci, factum, facĕre (3, σε -io) — κάνω, φτιάχνω", note:"Εννοούμενο υποκ.: (Phidias)." },
        { l:"tale", r:"Αντικείμενο", to:"στο fecisset", g:"αιτ. ενικ., ουδ. — δεικτική (συσχετική) αντωνυμία", d:"talis, talis, tale — τέτοιος, -α, -ο", a:"," }
      ]},
      { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο tale· υποτακτική (δυνητική), παρατατικού (posset) — σύγχρονο στο παρελθόν (ακολουθία χρόνων).", kids:[
        { l:"quale", r:"Υποκείμενο", to:"στο posset & στο fieri", g:"ονομ. ενικ., ουδ. — αναφορική (συσχετική) αντωνυμία", d:"qualis, qualis, quale — όποιος, -α, -ο", note:"talis … quale = συσχετικές αντωνυμίες." },
        { l:"ex illa", k:"materia", r:"Εμπρόθετος προσδ. της ύλης", to:"στο fieri", g:"ex (πρόθ. + αφαιρ.) + illa (αφαιρ. ενικ., θηλ.)", d:"ex — από· illa = ex materia illa (από εκείνο το υλικό)" },
        { l:"fieri", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο posset", g:"απαρέμφατο ενεστ. — ανώμαλο", d:"fio, factus sum, fieri — γίνομαι", note:"quale = υποκ. του fieri (ταυτοπροσωπία)." },
        { l:"optimum", r:"Κατηγορούμενο", to:"στο quale (μέσω fieri)", g:"ονομ. ενικ., ουδ. — επίθ. β΄ κλ., υπερθ. βαθμού (ανώμαλο)", d:"optimus, -a, -um (υπερθ. του bonus) — άριστος, -η, -ο" },
        { l:"posset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατατικού — ανώμαλο (σύνθετο του sum)", d:"possum, potui, —, posse (< pot + sum) — μπορώ", a:"." }
      ]}
    ]},

    { n: 7, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Eodem", r:"Κατηγορηματικός προσδ.", to:"στο modo", g:"αφαιρ. ενικ., αρσ. — δεικτική-επαναληπτική αντωνυμία", d:"idem, eadem, idem — ο ίδιος, η ίδια, το ίδιο" },
        { l:"modo", r:"Αφαιρετική (οργανική) του τρόπου", to:"στο explicabit", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"modus, -i (αρσ. β΄) — ο τρόπος" },
        { l:"sapiens", r:"Υποκείμενο", to:"στο explicabit", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"sapiens, sapientis (αρσ. γ΄) — ο σοφός" },
        { l:"virtutem", r:"Αντικείμενο", to:"στο explicabit", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"virtus, virtutis (θηλ. γ΄) — η αρετή, η ανδρεία", a:"," },
        { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"Δευτ. υποθετική· si + οριστ. μέλλοντα (licebit). Α΄ είδος — υπόθεση ανοιχτή για το μέλλον. Απόδοση: in divitiis explicabit.", kids:[
          { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
          { l:"licebit", r:"Ρήμα (απρόσωπο)", g:"γ΄ ενικ. οριστ. μέλλοντα — απρόσωπο", d:"licet, licuit / licitum est, —, licēre (2, απρόσωπο) — επιτρέπεται, είναι δυνατό", note:"si licebit (ενν. ei explicare) = αν μπορέσει (να αναπτύξει).", a:"," }
        ]},
        { l:"in divitiis", k:"divitiae", r:"Εμπρόθετος προσδ. της κατάστασης", to:"στο explicabit", g:"in (πρόθ. + αφαιρ.) + divitiis (αφαιρ. πληθ., θηλ.)", d:"in — σε· divitiae, -arum (θηλ. α΄, μόνο πληθ.) — τα πλούτη" },
        { l:"explicabit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. μέλλοντα ενεργ. φωνής", d:"explico, explicavi, explicatum, explicāre (1) — εκφράζω, δείχνω, αναπτύσσω", a:"," }
      ]},
      { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"«si minus» = si non licebit (ελλειπτικός υποθετικός λόγος, α΄ είδος). Απόδοση: in paupertate (explicabit).", kids:[
        { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
        { l:"minus", r:"Άρνηση (ιδιωματικά)", to:"= si non licebit", g:"επίρρημα (si minus = αν όχι)", d:"si minus — αν όχι (= si non licebit ei explicare)", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Ελλειπτική — εννοείται sapiens virtutem explicabit.", kids:[
        { l:"in paupertate", k:"paupertas", r:"Εμπρόθετος προσδ. της κατάστασης", to:"στο εννοούμενο explicabit", g:"in (πρόθ. + αφαιρ.) + paupertate (αφαιρ. ενικ., θηλ.)", d:"in — σε· paupertas, paupertatis (θηλ. γ΄) — η φτώχεια", a:";" }
      ]},
      { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"si + οριστ. μέλλοντα (poterit)· α΄ είδος. Απόδοση: in patria (explicabit).", kids:[
        { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
        { l:"poterit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. μέλλοντα — ανώμαλο (σύνθετο του sum)", d:"possum, potui, —, posse (< pot + sum) — μπορώ", note:"si poterit (ενν. virtutem explicare).", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Ελλειπτική.", kids:[
        { l:"in patria", k:"patria", r:"Εμπρόθετος προσδ. της στάσης σε τόπο", to:"στο εννοούμενο explicabit", g:"in (πρόθ. + αφαιρ.) + patria (αφαιρ. ενικ., θηλ.)", d:"in — σε· patria, -ae (θηλ. α΄) — η πατρίδα", a:"," }
      ]},
      { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"«si minus» = si non poterit· α΄ είδος. Απόδοση: in exilio (explicabit).", kids:[
        { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
        { l:"minus", r:"Άρνηση (ιδιωματικά)", to:"= si non poterit", g:"επίρρημα (si minus = αν όχι)", d:"si minus — αν όχι", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Ελλειπτική.", kids:[
        { l:"in exilio", k:"exilium", r:"Εμπρόθετος προσδ. της στάσης σε τόπο (μεταφ.)", to:"στο εννοούμενο explicabit", g:"in (πρόθ. + αφαιρ.) + exilio (αφαιρ. ενικ., ουδ.)", d:"in — σε· ex(s)ilium, -ii (-i) (ουδ. β΄) — η εξορία", a:";" }
      ]},
      { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"si + οριστ. μέλλοντα (poterit)· α΄ είδος. Απόδοση: imperator (explicabit).", kids:[
        { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
        { l:"poterit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. μέλλοντα — ανώμαλο", d:"possum, potui, —, posse — μπορώ", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Ελλειπτική.", kids:[
        { l:"imperator", r:"Κατηγορούμενο", to:"στο εννοούμενο υποκ. sapiens", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"imperator, imperatoris (αρσ. γ΄) — ο στρατηγός", note:"Κατ' άλλους επιρρ. κατηγορούμενο του χρόνου/τρόπου.", a:"," }
      ]},
      { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"«si minus» = si non poterit· α΄ είδος. Απόδοση: miles (explicabit).", kids:[
        { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
        { l:"minus", r:"Άρνηση (ιδιωματικά)", to:"= si non poterit", g:"επίρρημα (si minus = αν όχι)", d:"si minus — αν όχι", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Ελλειπτική.", kids:[
        { l:"miles", r:"Κατηγορούμενο", to:"στο εννοούμενο υποκ. sapiens", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"miles, militis (αρσ. γ΄) — ο στρατιώτης", a:";" }
      ]},
      { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"si + οριστ. μέλλοντα (poterit)· α΄ είδος. Απόδοση: integer (explicabit).", kids:[
        { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
        { l:"poterit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. μέλλοντα — ανώμαλο", d:"possum, potui, —, posse — μπορώ", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Ελλειπτική.", kids:[
        { l:"integer", r:"Κατηγορούμενο", to:"στο εννοούμενο υποκ. sapiens", g:"ονομ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"integer, integra, integrum — υγιής, αρτιμελής", a:"," }
      ]},
      { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"«si minus» = si non poterit· α΄ είδος. Απόδοση: debilis (explicabit).", kids:[
        { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
        { l:"minus", r:"Άρνηση (ιδιωματικά)", to:"= si non poterit", g:"επίρρημα (si minus = αν όχι)", d:"si minus — αν όχι", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Ελλειπτική.", kids:[
        { l:"debilis", r:"Κατηγορούμενο", to:"στο εννοούμενο υποκ. sapiens", g:"ονομ. ενικ., αρσ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"debilis, -is, -e — αδύναμος, ανάπηρος", a:"." }
      ]}
    ]},

    { n: 8, kids: [
      { type:"sub", key:"anaforiki", label:"Αναφορική-υποθετική", note:"Λανθάνων υποθετικός λόγος (α΄ είδος, ανοιχτή για το μέλλον)· quamcumque = si aliquam· acceperit = οριστ. συντελ. μέλλοντα. Απόδοση: aliquid … efficiet.", kids:[
        { l:"Quamcumque", r:"Επιθετικός προσδ.", to:"στο fortunam", g:"αιτ. ενικ., θηλ. — αναφορική αοριστολογική αντωνυμία", d:"quicumque, quaecumque, quodcumque — οποιοσδήποτε, -δήποτε, -δήποτε" },
        { l:"fortunam", r:"Αντικείμενο", to:"στο acceperit", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"fortuna, -ae (θηλ. α΄) — η τύχη" },
        { l:"acceperit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. συντελ. μέλλοντα ενεργ. φωνής", d:"accipio, accepi, acceptum, accipĕre (3, σε -io) (< ad + capio) — δέχομαι", note:"Εννοούμενο υποκ.: (sapiens).", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"aliquid", r:"Αντικείμενο", to:"στο efficiet", g:"αιτ. ενικ., ουδ. — αόριστη ουσιαστική αντωνυμία", d:"aliquis, aliqua (aliquae), aliquid — κάποιος, -α, -ο" },
        { l:"ex illa", k:"fortuna", r:"Εμπρόθετος προσδ. της προέλευσης", to:"στο efficiet", g:"ex (πρόθ. + αφαιρ.) + illa (αφαιρ. ενικ., θηλ.)", d:"ex — από· illa = από εκείνη (την τύχη)" },
        { l:"memorabile", r:"Επιθετικός προσδ.", to:"στο aliquid", g:"αιτ. ενικ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"memorabilis, -is, -e — αξιομνημόνευτος, -η, -ο" },
        { l:"efficiet", r:"Ρήμα", g:"γ΄ ενικ. οριστ. μέλλοντα ενεργ. φωνής", d:"efficio, effeci, effectum, efficĕre (3, σε -io) (< ex + facio) — δημιουργώ, κατορθώνω", note:"Εννοούμενο υποκ.: (sapiens).", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Sapientem nec paupertas nec dolor prohibet, nec eae res, quae imperītos avertunt et praecipites agunt.", el:"Ούτε η φτώχεια ούτε η λύπη εμποδίζει τον σοφό, ούτε εκείνα τα πράγματα που βγάζουν από τον δρόμο τους άπειρους και τους οδηγούν στον γκρεμό." },
    { la:"Tu illum premi putas malis?", el:"Εσύ νομίζεις ότι εκείνος καταβάλλεται από τις συμφορές;" },
    { la:"Utitur!", el:"(Αντίθετα) τις χρησιμοποιεί!" },
    { la:"Non ex ebore tantum Phidias sciēbat facere simulacra;", el:"Ο Φειδίας δεν ήξερε να φτιάχνει αγάλματα μόνο από ελεφαντόδοντο·" },
    { la:"ex aere quoque faciēbat.", el:"έφτιαχνε (τα) και από χαλκό." },
    { la:"Si marmor illi obtulisses, si viliōrem materiam, fecisset tale, quale ex illā fieri optimum posset.", el:"Αν του πρόσφερες μάρμαρο, αν (του πρόσφερες) πιο ευτελές υλικό, θα έφτιαχνε (κάτι) τέτοιο, όποιο θα μπορούσε να γίνει άριστο από εκείνο (το υλικό)." },
    { la:"Eōdem modo sapiens virtūtem, si licēbit, in divitiis explicābit, si minus, in paupertāte; si poterit, in patriā, si minus, in exilio; si poterit, imperātor, si minus, miles; si poterit, integer, si minus, debilis.", el:"Με τον ίδιο τρόπο ο σοφός θα δείξει την αρετή του, αν μπορέσει, μέσα στα πλούτη, αν όχι, μέσα στη φτώχεια· αν μπορέσει, στην πατρίδα, αν όχι, στην εξορία· αν μπορέσει, ως στρατηγός, αν όχι, ως στρατιώτης· αν μπορέσει, αρτιμελής, αν όχι, ανάπηρος." },
    { la:"Quamcumque fortūnam acceperit, aliquid ex illa memorabile efficiet.", el:"Όποια τύχη κι αν του λάχει, θα δημιουργήσει από αυτή κάτι αξιομνημόνευτο." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Phidias, -ae", note:"κύριο όνομα (ελλην.) — μόνο ενικ.· αιτ. Phidiam & Phidian" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"materia, -ae", note:"αφθονούν: & materies, materiei (ε΄)· αφηρημ. — μόνο ενικ." },
        { form:"divitiae, -arum", note:"μόνο πληθυντικός" },
        { form:"patria, -ae" },
        { form:"fortuna, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"modus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"mala, -orum", note:"μόνο πληθυντικός" },
        { form:"simulacrum, -i" },
        { form:"ex(s)ilium, -ii (-i)" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"sapiens, sapientis", note:"ουσιαστικοπ. μετοχή· αφαιρ. -e, γεν. πληθ. -ium" },
        { form:"dolor, doloris" },
        { form:"imperator, imperatoris" },
        { form:"miles, militis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"paupertas, paupertatis", note:"αφηρημ. — μόνο ενικ." },
        { form:"virtus, virtutis", note:"γεν. πληθ. -um & -ium· πληθ. = αρετές" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"ebur, eboris", note:"συνήθως ενικ." },
        { form:"aes, aeris", note:"υλικό — πληθ. aera = χάλκινα αντικείμενα" },
        { form:"marmor, marmoris", note:"ύλη — πληθ. marmora = αγάλματα" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"res, rei", note:"res & dies: τα μόνα της ε΄ κλ. με πλήρη πληθυντικό" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"imperitus, -a, -um" },
      { form:"bonus, -a, -um", note:"ανώμαλα παραθετικά (melior, optimus)" },
      { form:"integer, integra, integrum" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"praeceps, praeceps, praeceps (praecipitis)", note:"μονοκατάληκτο· δεν σχηματίζει παραθετικά (απόλυτο)" },
      { form:"vilis, -is, -e", note:"δικατάληκτο" },
      { form:"debilis, -is, -e", note:"δικατάληκτο" },
      { form:"memorabilis, -is, -e", note:"δικατάληκτο· χωρίς υπερθετικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ ──────────────────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"bonus, -a, -um", comp:"melior, -ior, -ius", sup:"optimus, -a, -um", note:"ανώμαλα· επίρρ.: bene → melius → optime" },
      { pos:"imperitus, -a, -um", comp:"imperitior, -ior, -ius", sup:"imperitissimus, -a, -um", note:"επίρρ.: imperite → imperitius → imperitissime" },
      { pos:"integer, integra, integrum", comp:"integrior, -ior, -ius", sup:"integerrimus, -a, -um", note:"επίρρ.: integre → integrius → integerrime" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"vilis, -is, -e", comp:"vilior, -ior, -ius", sup:"vilissimus, -a, -um", note:"επίρρ.: viliter → vilius → vilissime" },
      { pos:"debilis, -is, -e", comp:"debilior, -ior, -ius", sup:"debilissimus, -a, -um", note:"επίρρ.: debiliter → debilius → debilissime" },
      { pos:"memorabilis, -is, -e", comp:"memorabilior, -ior, -ius", sup:"—", note:"δεν σχηματίζει υπερθετικό· επίρρ.: memorabiliter → memorabilius → —" },
      { pos:"praeceps, praeceps, praeceps", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά (απόλυτο)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική-οριστική", extra:"ως οριστική (eae res)" },
    { form:"idem, eadem, idem", kind:"Δεικτική-επαναληπτική", extra:"eodem modo" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"illum, illi, illa" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσώπου" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"quae" },
    { form:"quicumque, quaecumque, quodcumque", kind:"Αναφορική-αοριστολογική", extra:"quamcumque (= si aliquam)" },
    { form:"aliquis, aliqua (aliquae), aliquid", kind:"Αόριστη ουσιαστική", extra:"aliquid" },
    { form:"talis, talis, tale", kind:"Δεικτική (συσχετική)", extra:"talis … qualis" },
    { form:"qualis, qualis, quale", kind:"Αναφορική (συσχετική)", extra:"quale" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"puto", perf:"putavi", sup:"putatum", inf:"putāre", note:"" },
      { pres:"explico", perf:"explicavi", sup:"explicatum", inf:"explicāre", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"prohibeo", perf:"prohibui", sup:"prohibitum", inf:"prohibēre", note:"< pro + habeo" },
      { pres:"licet", perf:"licuit / licitum est", sup:"—", inf:"licēre", note:"απρόσωπο· χωρίς σουπίνο" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"averto", perf:"averti", sup:"aversum", inf:"avertĕre", note:"< a + verto" },
      { pres:"ago", perf:"egi", sup:"actum", inf:"agĕre", note:"" },
      { pres:"premo", perf:"pressi", sup:"pressum", inf:"premĕre", note:"" },
      { pres:"utor", perf:"usus sum", sup:"(usum)", inf:"uti", note:"αποθετικό (+ αφαιρ.)" },
      { pres:"facio", perf:"feci", sup:"factum", inf:"facĕre", note:"3, σε -io· προστ. fac· παθ. fio" },
      { pres:"accipio", perf:"accepi", sup:"acceptum", inf:"accipĕre", note:"3, σε -io (< ad + capio)" },
      { pres:"efficio", perf:"effeci", sup:"effectum", inf:"efficĕre", note:"3, σε -io (< ex + facio)" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"scio", perf:"scivi (scii)", sup:"scitum", inf:"scīre", note:"προστ. scito / scitote" }
    ]},
    { syz:"Ανώμαλα ρήματα", rows:[
      { pres:"obfero (offero)", perf:"obtuli", sup:"oblatum", inf:"obferre (offerre)", note:"< ob + fero (+ δοτ.)" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"παθητικό του facio" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"< pot + sum" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Υποθετικός λόγος", title:"Τρία είδη υποθετικών λόγων στο ίδιο κείμενο", body:"«Si marmor illi obtulisses … fecisset tale» = β΄ είδος (αντίθετη προς την πραγματικότητα, παρελθόν: υποτ. υπερσ. → υποτ. υπερσ.). «si licebit / poterit … explicabit» = α΄ είδος (ανοιχτή, μέλλον: οριστ. μέλλ. → οριστ. μέλλ.). «Quamcumque fortunam acceperit … efficiet» = λανθάνων υποθετικός λόγος α΄ είδους (quamcumque = si aliquam)." },
    { tag:"Ελλειπτικές", title:"Οι τέσσερις παράλληλες προτάσεις", body:"Στο «si licebit, in divitiis explicabit, si minus, in paupertate· si poterit …» τα sapiens, virtutem, explicabit δηλώνονται μία φορά και εννοούνται σε όλες τις επόμενες υποθέσεις/αποδόσεις. Το «si minus» = si non licebit / si non poterit. Τα imperator, miles, integer, debilis = κατηγορούμενα (κατ' άλλους επιρρ. κατηγορούμενα) στο εννοούμενο sapiens." },
    { tag:"Αντωνυμίες", title:"Συσχετικές: talis … qualis", body:"«fecisset tale, quale … posset»: talis (δεικτική) και qualis (αναφορική) είναι συσχετικές αντωνυμίες (τέτοιος … όποιος). Η αναφορική quale εισάγει αναφορική πρόταση με υποτακτική (δυνητική), προσδιοριστική στο tale." },
    { tag:"Απρόσωπα", title:"licet + δοτική προσωπική + απαρέμφατο", body:"Το «si licebit» είναι απρόσωπο (licet): υποκείμενό του το εννοούμενο τελικό απαρέμφατο (explicare), με δοτική προσωπική (ei = sapienti) και υποκείμενο του απαρεμφάτου σε αιτιατική (eum) — ετεροπροσωπία λόγω απρόσωπης σύνταξης. Αντίθετα το possum (si poterit) είναι προσωπικό (ταυτοπροσωπία)." },
    { tag:"Αποθετικό", title:"utor + αφαιρετική", body:"«Utitur!»: το utor είναι αποθετικό (κλίνεται στη μέση φωνή, ενεργητική σημασία) και συντάσσεται με αντικείμενο σε αφαιρετική (εννοείται malis). Έχει 6 τύπους ενεργητικής φωνής (μετοχές, απαρ./υποτ. μέλλοντα, γερούνδιο, σουπίνο)." },
    { tag:"Κλίση", title:"Phidias — ελληνική κλίση", body:"Το Phidias (κύριο όνομα ελληνικής προέλευσης) σχηματίζει την αιτιατική ενικού και σε -m (Phidiam) και σε -n (Phidian). Πρβ. και άλλα ελληνικά ονόματα (Plato → Platona, Zeno → Zenona)." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Μετατροπή δευτ. προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"…, nec eae res, quae imperitos avertunt et praecipites agunt",
        to:"…, nec eae res imperitos avertentes et praecipites agentes",
        note:"Μετατροπή των αναφορικών προτάσεων σε επιθετικές (αναφορικές) μετοχές, με υποκείμενο το res." },
      { from:"Si marmor illi obtulisses, si (obtulisses) viliorem materiam, fecisset tale",
        to:"marmore illi oblato (a te), viliore materiā oblatā (a te) fecisset tale",
        note:"Μετατροπή των υποθετικών προτάσεων σε υποθετικές μετοχές· γνήσιες αφαιρετικές απόλυτες, γιατί τα υποκείμενά τους (marmore, materiā) δεν έχουν άλλο ρόλο στην πρόταση με ρήμα το fecisset." }
    ]},
    { id:"Β", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Sapientem nec paupertas nec dolor prohibet, nec eae res, quae imperitos avertunt et praecipites agunt",
        to:"Sapiens nec paupertate nec dolore prohibetur, nec eis (iis/is) rebus, quibus imperiti avertuntur et praecipites aguntur." },
      { from:"…; ex aere quoque faciebat",
        to:"ex aere quoque (simulacra) (a Phidiā) faciebantur." },
      { from:"Si marmor illi obtulisses, si viliorem materiam, fecisset tale",
        to:"Si marmor illi oblatum esset a te, si (oblata esset) vilioris materia (a te), factum esset tale." },
      { from:"Quamcumque fortunam acceperit, aliquid ex illā memorabile efficiet",
        to:"Quaecumque fortuna accepta erit, aliquid ex illā memorabile efficietur." }
    ]},
    { id:"Γ", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"Tu illum premi putas malis?",
        to:"Tu mala illum premere putas?",
        note:"Το ειδικό απαρέμφατο παθ. φωνής (premi) → ενεργ. (premere)· το malis (αφαιρ.) γίνεται υποκείμενο (mala, αιτ.) και το illum αντικείμενο." }
    ]},
    { id:"Δ", label:"Μετατροπή των υποθετικών λόγων στα άλλα είδη", items:[
      { from:"Si marmor illi obtulisses, si (obtulisses) viliorem materiam, fecisset tale  [το κείμενο: β΄ είδος, παρελθόν]",
        to:["1ο είδος (ανοιχτή) — παρόν: Si … obfers/offers → facit tale (οριστ. ενεστ.)",
            "1ο — παρελθόν: Si … obtulisti → fecit tale (οριστ. παρακ.)",
            "1ο — μέλλον: Si … obferes/offeres → faciet tale (οριστ. μέλλ.)",
            "2ο είδος (αντίθετη) — παρόν: Si … obferres/offerres → faceret tale (υποτ. παρατ.)",
            "2ο — παρελθόν: Si … obtulisses → fecisset tale (υποτ. υπερσ.)  [κείμενο]",
            "3ο είδος (δυνατή/πιθανή) — παρόν-μέλλον: Si … obferas/offeras → faciat tale (υποτ. ενεστ.)"] },
      { from:"si licebit / poterit, in divitiis explicabit  [το κείμενο: α΄ είδος, μέλλον]",
        to:["1ο είδος — παρόν: si licet/potest → in divitiis explicat (οριστ. ενεστ.)",
            "1ο — παρελθόν: si licebat/poterat → explicabat (οριστ. παρατ.)",
            "1ο — μέλλον: si licebit/poterit → explicabit (οριστ. μέλλ.)  [κείμενο]",
            "2ο είδος — παρόν: si liceret/posset → explicaret (υποτ. παρατ.)",
            "2ο — παρελθόν: si licuisset/potuisset → explicavisset (υποτ. υπερσ.)",
            "3ο είδος — παρόν-μέλλον: si liceat/possit → explicet (υποτ. ενεστ.)"] },
      { from:"Quamcumque fortunam acceperit, aliquid ex illa memorabile efficiet  [το κείμενο: α΄ είδος, μέλλον]",
        to:["1ο είδος — παρόν: Quamcumque … accipit → efficit (οριστ. ενεστ.)",
            "1ο — παρελθόν: … accepit → effecit (οριστ. παρακ.)",
            "1ο — μέλλον: … acceperit → efficiet (οριστ. συντ. μέλλ. → μέλλ.)  [κείμενο]",
            "2ο είδος — παρόν: … acciperet → efficeret (υποτ. παρατ.)",
            "2ο — παρελθόν: … accepisset → effecisset (υποτ. υπερσ.)",
            "3ο είδος — παρόν-μέλλον: … accipiat → efficiat (υποτ. ενεστ.)"] }
    ]},
    { id:"Ε", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"(εξάρτηση: Scriptor putat / putabat) Sapientem nec paupertas nec dolor prohibet, nec eae res …",
        to:"sapientem nec paupertatem nec dolorem prohibere, nec eas res, quae imperitos avertant / averterent et praecipites agant / agerent.",
        note:"Οι κύριες κρίσης → ειδικά απαρέμφατα με υποκ. σε αιτ.· τα ρήματα των αναφορικών σε υποτακτική." },
      { from:"(εξάρτηση: Scriptor interrogat / interrogavit) Tu illum premi putas malis?",
        to:"… num ille illum (= sapientem) premi putet / putaret malis.",
        note:"Ευθεία ερώτηση → πλάγια (num + υποτακτική)." },
      { from:"(εξάρτηση: Scriptor dicit / dixit) Utitur! … Si marmor illi obtulisses … fecisset tale …",
        to:"illum (= sapientem) uti; non ex ebore tantum Phidian/Phidiam scire …; (eum) facere; si vir marmor illi obtulisset, si (obtulisset) viliorem materiam, fecisse tale, quale ex illa fieri optimum posset.",
        note:"Η υπόλοιπη μετατροπή (si licebit …, Quamcumque …) δεν είναι εφικτή: το licet & το possum δεν έχουν υποτακτική/απαρέμφατο μέλλοντα, ούτε απαρέμφατο συντελ. μέλλοντα ενεργ. φωνής." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"sapientem, sapiens [< sapio]", el:"σαφής, σοφός // (ισπαν.) sabio (= σοφός), saber (= γνωρίζω) // (γαλλ.) savoir (= γνωρίζω) // (αγγλ.) sapient (= σοφός) // (ιταλ.) sapere (= γνωρίζω)." },
    { la:"paupertas, paupertāte [< pau-per]", el:"παῦ-ρος // (γαλλ.) pau-vre (= φτωχός), pauvreté (= φτώχεια) // (αγγλ.) pauper (= άπορος), poor (= φτωχός) // (ιταλ.) povero (= φτωχός) // (ισπαν.) pobre (= φτωχός)." },
    { la:"dolor", el:"(αγγλ.) dolor (= θλίψη, πόνος), indolent (= νωθρός, οκνηρός), condolence (= συλλυπητήρια) // (γαλλ.) douleur (= πόνος) // (ιταλ.) dolore (= πόνος)." },
    { la:"prohibet [< pro + habeo]", el:"(γερμ.) haben (= έχω), (αγγλ.) have // (γαλλ.) prohiber (= απαγορεύω) // (αγγλ.) prohibit (= απαγορεύω), habit (= συνήθεια) // (ιταλ.) avere (= έχω) // (ισπαν.) haber (= έχω)." },
    { la:"res", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός), republic (= δημοκρατία, πολιτεία), rebus (= εικονόγριφος) // (γαλλ.) rien (= τίποτα)." },
    { la:"imperītos", el:"πείρα, πειρατής· άπειρος, απειρία // εξπέρ [< γαλλ. expert (= ειδικός)]." },
    { la:"a-vertunt [< a + verto]", el:"(verso) βέρσο (= πίσω μέρος σελίδας), ρεβέρ (< γαλλ.) // (αγγλ.) avert (= αποστρέφω, αποτρέπω), version (= εκδοχή), universe (= σύμπαν)." },
    { la:"praecipites [< prae + caput]", el:"καπέλο (< ιταλ.), καπετάνιος (< βενετ.), καπιταλισμός (< γαλλ.) // (αγγλ.) precipice (= γκρεμός), decapitate (= αποκεφαλίζω) // (γαλλ.) chef (= αρχηγός, αρχιμάγειρας) // (ιταλ.) capo (= κεφαλή, αρχηγός)." },
    { la:"agunt", el:"ἄγω // (αγγλ.) act (= πράξη), agent (= πράκτορας), agile (= ευκίνητος) // (γαλλ.) agir (= ενεργώ)." },
    { la:"premi [< premo]", el:"πρέσα // (γαλλ.) comprimer (= συμπιέζω) // κομπρεσέρ, κομπρέσα (< ιταλ.) // (αγγλ.) press (= πιέζω), express (= εκφράζω), print (= τυπώνω) // (ιταλ.) premere (= πιέζω)." },
    { la:"putas", el:"(αγγλ.) disputation (= συζήτηση), putative (= υποτιθέμενος), compute (= υπολογίζω), count (= μετρώ), reputation (= φήμη, υπόληψη) // (γαλλ.) compter (= μετρώ)." },
    { la:"malis", el:"μέλας // (γαλλ.) mal (= κακός) // (ισπαν.) malevolencia (= μοχθηρία), malo (= κακός) // (αγγλ.) malice (= κακία, μοχθηρία), malaria (= ελονοσία)." },
    { la:"utitur [< utor]", el:"(αγγλ.) utility, use, usual (= συνήθης), abuse (= κατάχρηση) // (γαλλ.) utile (= χρήσιμος), utiliser (= χρησιμοποιώ), usage (= χρήση) // (ιταλ.) usare (= χρησιμοποιώ)." },
    { la:"Phidias", el:"Φειδίας." },
    { la:"sciēbat [< scio]", el:"(γαλλ.) science (= επιστήμη), conscient (= ειδήμων) // (αγγλ.) conscious (= ενσυνείδητος, έχων επίγνωση), omniscient (= παντογνώστης), prescient (= προγνωστικός, προορατικός)." },
    { la:"facere, faciēbat, fecisset, efficiet [< facio / efficio]", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο), effect (= αποτέλεσμα, επίδραση) // (γαλλ.) faire (= κάνω)." },
    { la:"simulacra [< simulo]", el:"(αγγλ.) similar, assemble (= συναθροίζω) // (γαλλ.) similarité, simulacre (= ομοίωμα)." },
    { la:"marmor", el:"μάρμαρος (= σπινθηροβόλος λίθος), μαρμαίρω· μάρμαρο // (αγγλ.) marble (= μάρμαρο) // (γαλλ.) marbre (= μάρμαρο) // (ιταλ.) marmo (= μάρμαρο)." },
    { la:"viliōrem [< vilis]", el:"(αγγλ.) vile (= αχρείος, ευτελής), vilify (= δυσφημώ, εξευτελίζω), revile (= εξυβρίζω, κακολογώ)." },
    { la:"materiam", el:"μαδέρι (< βενετ.), ματεριαλισμός (= υλισμός) (< γαλλ.) // (αγγλ.) matter (= ύλη, θέμα) // (γαλλ.) matière (= ύλη) // (ισπαν.) madera (= ξύλο)." },
    { la:"fieri", el:"φύω, φύσις." },
    { la:"optimum", el:"(γαλλ.) optimal // οπτιμισμός (< γαλλ.) // (αγγλ.) optimum (= το βέλτιστο) // (ιταλ.) ottimo (= άριστος) // (ισπαν.) óptimo (= άριστος)." },
    { la:"posset, poterit [< potis + sum]", el:"πόσις, δεσ-πότης («κύριος σπιτιού») // (αγγλ.) power (= δύναμη, εξουσία), possible (= δυνατός, εφικτός) // (γαλλ.) pouvoir (= μπορώ· δύναμη)." },
    { la:"modo", el:"(γαλλ.) mode (= μόδα), modèle (= μοντέλο) // (αγγλ.) modern (= σύγχρονος), moderate (= μετριάζω, μετριοπαθής)." },
    { la:"virtūtem [< vir]", el:"βιρτουόζος (< ιταλ.) // (αγγλ.) virtue (= αρετή), virtual (= εικονικός, δυνάμει υπάρχων) // (γαλλ.) vertu (= αρετή)." },
    { la:"licēbit", el:"(αγγλ.) licence (= άδεια), leisure (= ελεύθερος χρόνος, σχόλη), illicit (= παράνομος, αθέμιτος) // (γαλλ.) loisir (= ελεύθερος χρόνος)." },
    { la:"divitias", el:"δῖος [< Διός] (= θεϊκός) // (γαλλ.) divin (= θεϊκός) // (ιταλ.) dovizia (= αφθονία)." },
    { la:"explicābit", el:"(γαλλ.) expliquer (= εξηγώ), explicable (= ερμηνεύσιμος) // (αγγλ.) explicit (= ρητός, σαφής) // (ιταλ.) spiegare (= εξηγώ, ξεδιπλώνω)." },
    { la:"minus", el:"μινόρε, μίνιμουμ, μινιατούρα (< ιταλ.) // (γαλλ.) minute, moins (= λιγότερο) // (ισπαν.) menos (= λιγότερο)." },
    { la:"patriā", el:"πατρίς, πατήρ· πατέρας // (γαλλ.) père (= πατέρας), patrie (= πατρίδα) // (ισπαν.) padre (= πατέρας)." },
    { la:"exilio", el:"(γαλλ.) exil (= εξορία) // (αγγλ.) exile (= εξορία, εξόριστος) // (ιταλ.) esilio (= εξορία) // (ισπαν.) exilio (= εξορία)." },
    { la:"imperātor", el:"ιμπεριαλισμός (< γαλλ.) // (αγγλ.) emperor (= αυτοκράτορας) // (γαλλ.) empereur (= αυτοκράτορας) // (ιταλ.) imperatore (= αυτοκράτορας)." },
    { la:"miles", el:"μιλιταρισμός (< γαλλ.) // (αγγλ.) military (= στρατιωτικός) // (γαλλ.) militaire (= στρατιωτικός) // (ιταλ.) milizia (= πολιτοφυλακή)." },
    { la:"integer", el:"(αγγλ.) integer [= ακέραιος αριθμός], entire (= ολόκληρος), integrity (= ακεραιότητα) // (γαλλ.) intégrale (= πλήρης), entier (= ολόκληρος, ακέραιος)." },
    { la:"debilis [< de + habilis]", el:"(γαλλ.) débiliter (= εξασθενώ) // (αγγλ.) debility (= αδυναμία, εξασθένηση) // (ιταλ.) debole (= αδύναμος)." },
    { la:"fortūnam", el:"φουρτούνα (< ιταλ.) // (γαλλ.) fortune (= τύχη) // (ισπαν.) fortuna (= τύχη)." },
    { la:"acceperit [< accipio]", el:"(γαλλ.) accepter (= δέχομαι) // (ιταλ.) capire (= καταλαβαίνω) // (αγγλ.) capture (= σύλληψη, αιχμαλωσία)." },
    { la:"memorabile", el:"μέμνημαι, μνήμη // (γαλλ.) mémorable, mémoire (= μνήμη) // (αγγλ.) monument (= μνημείο), memory (= μνήμη) // (ισπαν.) memoria (= μνήμη)." }
  ]
};

export default UNIT;
