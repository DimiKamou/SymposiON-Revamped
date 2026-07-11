// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 48
//  Lectio XLVIII — «Το ελάφι του Σερτώριου» (Aulus Gellius, Noctes Atticae 15.22)
//  periods, alignment, nouns, adjectives, comparatives, pronouns, verbs, sos
//  + προαιρετικά transforms (Μέρος VIII) & etymology (Μέρος IX).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 48,
  title: "Το ελάφι του Σερτώριου",
  latinTitle: "Lectio XLVIII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Cerva", r:"Υποκείμενο", to:"στο data erat", g:"ονομ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"cerva, -ae (θηλ. α΄) — το ελάφι" },
        { l:"alba", r:"Επιθετικός προσδ.", to:"στο cerva", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"albus, -a, -um — άσπρος, -η, -ο" },
        { l:"eximiae", r:"Επιθετικός προσδ.", to:"στο pulchritudinis", g:"γεν. ενικ., θηλ. — επίθ. β΄ κλ.", d:"eximius, -a, -um — εξαιρετικός, -ή, -ό" },
        { l:"pulchritudinis", r:"Γενική (κατηγορηματική) της ιδιότητας", to:"στο cerva", g:"γεν. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"pulchritudo, pulchritudinis (θηλ. γ΄) — η ομορφιά" },
        { l:"Sertorio", k:"Sertorius", r:"Δοτική προσωπική χαριστική", to:"στο data erat", g:"δοτ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Sertorius, -ii/-i (αρσ. β΄) — ο Σερτώριος", note:"Μαζί με το dono: σχήμα διπλής δοτικής." },
        { l:"a Lusitano", k:"Lusitanus", r:"Εμπρόθετος προσδ. του ποιητικού αιτίου", to:"στο data erat", g:"a (πρόθ. + αφαιρ.) + Lusitano (αφαιρ. ενικ., αρσ.)", d:"a — από· Lusitanus, -i (αρσ. β΄) — ο Λουζιτανός", note:"Εμπρόθετο, γιατί είναι έμψυχο." },
        { l:"quodam", k:"quidam", r:"Επιθετικός προσδ.", to:"στο Lusitano", g:"αφαιρ. ενικ., αρσ. — αόριστη επιθ. αντωνυμία", d:"quidam, quaedam, quoddam — κάποιος, -α, -ο" },
        { l:"dono", r:"Δοτική κατηγορηματική του σκοπού", to:"στο data erat", g:"δοτ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"donum, -i (ουδ. β΄) — το δώρο (dono = ως δώρο)" },
        { l:"data erat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσ. παθ. φωνής", d:"do, dedi, datum, dăre (1) — δίνω", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Sertorius", r:"Υποκείμενο", to:"στο persuasit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Sertorius, -ii/-i (αρσ. β΄) — ο Σερτώριος" },
        { l:"omnibus", k:"omnis", r:"Έμμεσο αντικείμενο", to:"στο persuasit", g:"δοτ. πληθ., αρσ. — επίθ. γ΄ κλ. (ουσιαστικοπ.)", d:"omnis, -is, -e — όλος (persuadeo + δοτ.)" },
        { l:"persuasit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"persuadeo, persuasi, persuasum, persuadēre (2) (< per + suadeo) — πείθω" },
        { l:"cervam", k:"cerva", r:"Υποκείμενο απαρεμφάτων", to:"στα conloqui, docere (ετεροπροσωπία)", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"cerva, -ae (θηλ. α΄) — το ελάφι", a:"," },
        { l:"instinctam", r:"Επιρρ. αιτιολογική μετοχή", to:"στα conloqui, docere", g:"αιτ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής", d:"instinguo, instinxi, instinctum, instinguĕre (3) — παρορμώ, κατευθύνω", note:"cervam = υποκ. της μετοχής· προτερόχρονο (συνημμένη)." },
        { l:"numine", r:"Αφαιρετική του ποιητικού αιτίου (απρόθετη)", to:"στη μετοχή instinctam", g:"αφαιρ. ενικ., ουδ. — ουσιαστικό γ΄ κλ.", d:"numen, numinis (ουδ. γ΄) — η βούληση", note:"Απρόθετο, γιατί είναι άψυχο." },
        { l:"Dianae", r:"Γενική υποκειμενική", to:"στο numine", g:"γεν. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"Diana, -ae (θηλ. α΄) — η Άρτεμη" },
        { l:"conloqui", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο persuasit", g:"απαρέμφατο ενεστ. — αποθετικό", d:"conloquor, conlocutus sum, (conlocutum), conloqui (3) (< cum + loquor) — συζητώ" },
        { l:"secum", k:"sui", r:"Εμπρόθετος προσδ. της κοινωνίας", to:"στο conloqui", g:"secum = cum se (αφαιρ. ενικ., προσωπική γ΄ προσ.)", d:"secum — μαζί του (έμμεση αυτοπάθεια στο Sertorius)" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"docere", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο persuasit", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"doceo, docui, doctum, docēre (2) — υποδεικνύω (+ πλάγια ερώτηση)", a:"," },
        { type:"sub", key:"plagia", label:"Πλάγια ερωτηματική (μερικής άγνοιας)", note:"Δευτ. ουσιαστική πλάγια ερωτηματική, αντικείμενο στο docere· υποτακτική παρατ. (essent) — εξάρτηση από ιστ. χρόνο· σύγχρονο στο παρελθόν.", kids:[
          { l:"quae", k:"quis", r:"Υποκείμενο", to:"στο essent", g:"ονομ. πληθ., ουδ. — ερωτηματική ουσιαστική αντωνυμία", d:"quis, quid — ποιος; τι;" },
          { l:"utilia", k:"utilis", r:"Κατηγορούμενο", to:"στο quae (μέσω essent)", g:"ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"utilis, -is, -e — χρήσιμος, -η, -ο" },
          { l:"factu", r:"Αφαιρετική του σουπίνου (της αναφοράς)", to:"στο utilia", g:"αφαιρ. σουπίνου", d:"facio, feci, factum, facĕre (3, σε -io) — κάνω (factu = ως προς το να γίνουν)" },
          { l:"essent", r:"Ρήμα", g:"γ΄ πληθ. υποτ. παρατ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι", a:"." }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης) — απόδοση", note:"Απόδοση του υποθετικού λόγου (α΄ είδος, ανοικτή υπόθεση στο παρελθόν). Εννοούμενο υποκ.: (Sertorius).", kids:[
        { type:"sub", key:"ypothetiki", label:"Υποθετική (υπόθεση)", note:"Δευτ. επιρρ. υποθετική· si + οριστική παρατ. (videbatur)· α΄ είδος — υπόθεση ανοικτή για το παρελθόν.", kids:[
          { l:"Si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
          { l:"quid", k:"quis", r:"Υποκείμενο απαρεμφάτου", to:"στο (εννοούμενο) esse (ετεροπροσωπία)", g:"ονομ. ενικ., ουδ. — αόριστη ουσιαστική αντωνυμία", d:"quis, qua, quid — κάποιος, κάτι" },
          { l:"durius", k:"durus", r:"Κατηγορούμενο", to:"στο quid (μέσω esse)", g:"ονομ. ενικ., ουδ. — επίθ. β΄ κλ., συγκρ. βαθμού", d:"durior, -ius (< durus) — κάπως σκληρός" },
          { l:"ei", k:"is", r:"Δοτική προσωπική (του κρίνοντος)", to:"στο videbatur", g:"δοτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός (ei = Sertorio)" },
          { l:"videbatur", r:"Ρήμα (απρόσωπο)", g:"γ΄ ενικ. οριστ. παρατ. παθ. φωνής", d:"video, vidi, visum, vidēre (2) — (παθ. απρόσ.) φαίνεται", note:"Εννοείται ειδικό απαρ. (esse) ως υποκείμενο." },
          { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο quid (πλάγιος λόγος)· υποτακτική παρατ. (esset).", kids:[
            { l:"quod", k:"qui", r:"Υποκείμενο", to:"στο imperandum esset", g:"ονομ. ενικ., ουδ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
            { l:"imperandum", r:"Κατηγορούμενο (γερουνδιακό)", to:"στο quod (μέσω esset)", g:"ονομ. ενικ., ουδ. — γερουνδιακό (παθ. περιφραστική)", d:"impero, imperavi, imperatum, imperāre (1) — διατάζω", note:"imperandum esset = παθ. περιφραστική (έπρεπε να διαταχθεί)." },
            { l:"militibus", r:"Αντικείμενο", to:"στο imperandum esset", g:"δοτ. πληθ., αρσ. — ουσιαστικό γ΄ κλ.", d:"miles, militis (αρσ. γ΄) — ο στρατιώτης (impero + δοτ.)" },
            { l:"esset", k:"sum", r:"Ρήμα (συνδετικό)", g:"γ΄ ενικ. υποτ. παρατ. — βοηθητικό", d:"sum, fui, —, esse — είμαι", note:"Εννοείται δοτ. ενεργούντος προσώπου: (ei / Sertorio).", a:"," }
          ]}
        ]},
        { l:"a cerva", k:"cerva", r:"Εμπρόθετος προσδ. του ποιητικού αιτίου", to:"στο esse monitum", g:"a (πρόθ. + αφαιρ.) + cerva (αφαιρ. ενικ., θηλ.)", d:"a — από· cerva, -ae (θηλ. α΄) — το ελάφι", note:"Εμπρόθετο, γιατί (εδώ) λογίζεται έμψυχο." },
        { l:"esse monitum", k:"moneo", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο praedicabat", g:"απαρέμφατο παρακ. παθ. φωνής (= monitum esse)", d:"moneo, monui, monitum, monēre (2) — συμβουλεύω, καθοδηγώ" },
        { l:"sese", k:"sui", r:"Υποκείμενο απαρεμφάτου", to:"στο esse monitum (ταυτοπροσωπία)", g:"αιτ. ενικ., αρσ. — προσωπική αντωνυμία γ΄ προσ. (ενισχυμένη)", d:"se (sese) — τον εαυτό του", note:"Λατινισμός· η αυτοπάθεια αναφέρεται στο εννοούμενο υποκ. Sertorius." },
        { l:"praedicabat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. ενεργ. φωνής", d:"praedico, praedicavi, praedicatum, praedicāre (1) — διακηρύσσω", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Ea", k:"is", r:"Επιθετικός προσδ.", to:"στο cerva", g:"ονομ. ενικ., θηλ. — δεικτική (ως οριστική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό" },
        { l:"cerva", r:"Υποκείμενο", to:"στο fugit", g:"ονομ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"cerva, -ae (θηλ. α΄) — το ελάφι" },
        { l:"quodam", k:"quidam", r:"Επιθετικός προσδ.", to:"στο die", g:"αφαιρ. ενικ., αρσ. — αόριστη επιθ. αντωνυμία", d:"quidam, quaedam, quoddam — κάποιος, -α, -ο" },
        { l:"die", k:"dies", r:"Αφαιρετική του χρόνου", to:"στο fugit", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό ε΄ κλ.", d:"dies, diei (αρσ. ε΄) — η ημέρα" },
        { l:"fugit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"fugio, fugi, fugitum, fugĕre (3, σε -io) — φεύγω" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Συνδέεται με την προηγούμενη παρατακτικά συμπλεκτικά (et). Εννοούμενο υποκ.: (cerva).", kids:[
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"perisse", k:"pereo", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο credita est", g:"απαρέμφατο παρακ. — ανώμαλο (σύνθετο)", d:"pereo, perii, peritum, perīre (< per + eo) — χάνομαι, πεθαίνω", note:"Εννοούμενο υποκ.: (cerva) σε ονομαστική — άρση λατινισμού (παθ. δοξαστικό)." },
        { l:"credita est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. παθ. φωνής", d:"credo, credidi, creditum, credĕre (3) — πιστεύω", a:"." }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική (cum ιστορικός)", note:"Δευτ. επιρρ. χρονική στο iussit· cum ιστορικός-διηγηματικός + υποτακτική υπερσ. (nuntiavisset) — προτερόχρονο στο παρελθόν.", kids:[
          { l:"Cum", r:"Σύνδεσμος", g:"υποτακτικός χρονικός (ιστορικός-διηγηματικός) σύνδεσμος", d:"cum — όταν" },
          { l:"aliquis", r:"Υποκείμενο", to:"στο nuntiavisset", g:"ονομ. ενικ., αρσ. — αόριστη ουσιαστική αντωνυμία", d:"aliquis, aliqua, aliquid — κάποιος" },
          { l:"Sertorio", k:"Sertorius", r:"Έμμεσο αντικείμενο", to:"στο nuntiavisset", g:"δοτ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Sertorius, -ii/-i (αρσ. β΄) — ο Σερτώριος" },
          { l:"nuntiavisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσ. ενεργ. φωνής", d:"nuntio, nuntiavi, nuntiatum, nuntiāre (1) — αναγγέλλω" },
          { l:"cervam", k:"cerva", r:"Υποκείμενο απαρεμφάτου", to:"στο inventam esse (ετεροπροσωπία)", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"cerva, -ae (θηλ. α΄) — το ελάφι" },
          { l:"inventam esse", k:"invenio", r:"Ειδικό απαρέμφατο (άμεσο αντικ.)", to:"στο nuntiavisset", g:"απαρέμφατο παρακ. παθ. φωνής", d:"invenio, inveni, inventum, invenīre (4) (< in + venio) — βρίσκω", a:"," }
        ]},
        { l:"Sertorius", r:"Υποκείμενο", to:"στο iussit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Sertorius, -ii/-i (αρσ. β΄) — ο Σερτώριος" },
        { l:"eum", k:"is", r:"Άμεσο αντικείμενο", to:"στο iussit", g:"αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός (eum = aliquem)" },
        { l:"iussit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"iubeo, iussi, iussum, iubēre (2) — διατάζω" },
        { l:"tacere", r:"Τελικό απαρέμφατο (έμμεσο αντικ.)", to:"στο iussit", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"taceo, tacui, tacitum, tacēre (2) — σωπαίνω", note:"eum = υποκ. του tacere (ετεροπροσωπία).", a:";" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Εννοούμενο υποκ.: (Sertorius).", kids:[
        { l:"praeterea", r:"Επιρρ. προσδ. του τρόπου", to:"στο praecepit", g:"τροπικό (προσθετικό) επίρρημα", d:"praeterea — επιπλέον" },
        { l:"praecepit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"praecipio, praecepi, praeceptum, praecipĕre (3, σε -io) (< prae + capio) — καθοδηγώ, δίνω οδηγίες" },
        { type:"sub", key:"voulitiki", label:"Βουλητική", note:"Δευτ. ουσιαστική βουλητική, άμεσο αντικείμενο στο praecepit· ut + υποτακτική παρατ. (emitteret) — εξάρτηση από ιστ. χρόνο· ιδιομορφία ακολουθίας.", kids:[
          { l:"ut", r:"Σύνδεσμος", g:"υποτακτικός βουλητικός σύνδεσμος", d:"ut — να" },
          { l:"eam", k:"is", r:"Αντικείμενο", to:"στο emitteret", g:"αιτ. ενικ., θηλ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός (eam = cervam)" },
          { l:"postero", k:"posterus", r:"Επιθετικός προσδ.", to:"στο die", g:"αφαιρ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"posterus, -a, -um — επόμενος" },
          { l:"die", k:"dies", r:"Αφαιρετική του χρόνου", to:"στο emitteret", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό ε΄ κλ.", d:"dies, diei (αρσ. ε΄) — η ημέρα" },
          { l:"repente", r:"Επιρρ. προσδ. του τρόπου", to:"στο emitteret", g:"τροπικό επίρρημα", d:"repente — ξαφνικά" },
          { l:"in eum locum", k:"is", r:"Εμπρόθετος προσδ. (κίνηση σε τόπο)", to:"στο emitteret", g:"in (πρόθ. + αιτ.) + eum locum (αιτ. ενικ., αρσ.)", d:"in — σε· is, ea, id — αυτός· locus, -i (αρσ. β΄) — ο τόπος", note:"eum: επιθετικός προσδ. στο locum." },
          { l:"emitteret", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. ενεργ. φωνής", d:"emitto, emisi, emissum, emittĕre (3) (< e + mitto) — αφήνω ελεύθερο", note:"Εννοούμενο υποκ.: (ille / Sertorius)." },
          { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο locum (πλάγιος λόγος)· υποτακτική παρατ. (futurus esset) — ενεργ. περιφραστική, υστερόχρονο στο παρελθόν.", kids:[
            { l:"in quo", k:"qui", r:"Εμπρόθετος προσδ. (στάση σε τόπο)", to:"στο futurus esset", g:"in (πρόθ. + αφαιρ.) + quo (αφαιρ. ενικ., αρσ.)", d:"in — σε· qui, quae, quod — ο οποίος" },
            { l:"ipse", k:"ipse", r:"Υποκείμενο", to:"στο futurus esset", g:"ονομ. ενικ., αρσ. — δεικτική-οριστική αντωνυμία", d:"ipse, ipsa, ipsum — ο ίδιος" },
            { l:"cum amicis", k:"amicus", r:"Εμπρόθετος προσδ. της κοινωνίας", to:"στο futurus esset", g:"cum (πρόθ. + αφαιρ.) + amicis (αφαιρ. πληθ., αρσ.)", d:"cum — με· amicus, -i (αρσ. β΄) — ο φίλος" },
            { l:"futurus esset", k:"sum", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. — ενεργ. περιφραστική συζυγία", d:"sum, fui, —, esse — είμαι (futurus esset = επρόκειτο να είναι)", a:"." }
          ]}
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Postridie", r:"Επιρρ. προσδ. του χρόνου", to:"στο dixit", g:"χρονικό επίρρημα", d:"postridie — την επομένη (postridie eius diei = postero die)" },
        { l:"eius", k:"is", r:"Επιθετικός προσδ.", to:"στο diei", g:"γεν. ενικ., αρσ. — δεικτική (ως οριστική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό" },
        { l:"diei", k:"dies", r:"Γενική της αφετηρίας (αναφοράς)", to:"στο postridie", g:"γεν. ενικ., αρσ. — ουσιαστικό ε΄ κλ.", d:"dies, diei (αρσ. ε΄) — η ημέρα" },
        { l:"Sertorius", r:"Υποκείμενο", to:"στο dixit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Sertorius, -ii/-i (αρσ. β΄) — ο Σερτώριος", a:"," },
        { l:"admissis", r:"Επιρρ. χρονική μετοχή (νόθη αφαιρετική απόλυτη)", to:"στο dixit", g:"αφαιρ. πληθ., αρσ. — μτχ. παρακ. παθ. φωνής", d:"admitto, admisi, admissum, admittĕre (3) (< ad + mitto) — δέχομαι", note:"Προτερόχρονο· εννοείται ποιητικό αίτιο (a Sertorio) — νόθη." },
        { l:"amicis", k:"amicus", r:"Υποκείμενο μετοχής", to:"στη μετοχή admissis", g:"αφαιρ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"amicus, -i (αρσ. β΄) — ο φίλος" },
        { l:"in cubiculum", k:"cubiculum", r:"Εμπρόθετος προσδ. (κίνηση σε τόπο)", to:"στη μετοχή admissis", g:"in (πρόθ. + αιτ.) + cubiculum (αιτ. ενικ., ουδ.)", d:"in — σε· cubiculum, -i (ουδ. β΄) — η κρεβατοκάμαρα" },
        { l:"suum", k:"suus", r:"Επιθετικός προσδ.", to:"στο cubiculum", g:"αιτ. ενικ., ουδ. — κτητική αντωνυμία γ΄ προσ.", d:"suus, sua, suum — δικός του", note:"Έμμεση (πλάγια) αυτοπάθεια — στο Sertorius.", a:"," },
        { l:"dixit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέγω" },
        { l:"eis", k:"is", r:"Έμμεσο αντικείμενο", to:"στο dixit", g:"δοτ. πληθ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός (eis = amicis)" },
        { l:"visum", k:"video", r:"Ειδικό απαρέμφατο (απρόσωπο, άμεσο αντικ.)", to:"στο dixit", g:"απαρέμφατο παρακ. παθ. φωνής (visum esse)", d:"video, vidi, visum, vidēre (2) — (παθ.) φαίνεται" },
        { l:"in somno", k:"somnus", r:"Εμπρόθετος προσδ. της κατάστασης", to:"στο visum esse", g:"in (πρόθ. + αφαιρ.) + somno (αφαιρ. ενικ., αρσ.)", d:"in — σε· somnus, -i (αρσ. β΄) — ο ύπνος" },
        { l:"sibi", k:"sui", r:"Δοτική προσωπική", to:"στο visum esse", g:"δοτ. ενικ., αρσ. — προσωπική αντωνυμία γ΄ προσ.", d:"sibi — στον εαυτό του (έμμεση αυτοπάθεια στο Sertorius)" },
        { l:"esse", k:"sum", r:"Ειδικό απαρέμφατο (μέρος του visum esse)", to:"στο dixit", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι" },
        { l:"cervam", k:"cerva", r:"Υποκείμενο απαρεμφάτου", to:"στο reverti (ετεροπροσωπία)", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"cerva, -ae (θηλ. α΄) — το ελάφι", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο cervam (πλάγιος λόγος)· υποτακτική υπερσ. (perisset) — προτερόχρονο στο παρελθόν.", kids:[
          { l:"quae", k:"qui", r:"Υποκείμενο", to:"στο perisset", g:"ονομ. ενικ., θηλ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
          { l:"perisset", k:"pereo", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσ. — ανώμαλο (σύνθετο)", d:"pereo, perii, peritum, perīre (< per + eo) — χάνομαι, πεθαίνω", a:"," }
        ]},
        { l:"ad se", k:"sui", r:"Εμπρόθετος προσδ. της κατεύθυνσης", to:"στο reverti", g:"ad (πρόθ. + αιτ.) + se (αιτ. ενικ., προσωπική γ΄ προσ.)", d:"ad — προς· se — τον εαυτό του (έμμεση αυτοπάθεια στο Sertorius)" },
        { l:"reverti", k:"revertor", r:"Ειδικό απαρέμφατο (υποκείμενο)", to:"στο visum esse", g:"απαρέμφατο ενεστ. — ημιαποθετικό", d:"revertor, reverti, (reversum), reverti (3) — επιστρέφω", a:"." }
      ]}
    ]},

    { n: 7, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική (cum ιστορικός)", note:"Δευτ. επιρρ. χρονική στο orta est· cum ιστορικός-διηγηματικός + υποτακτική υπερσ. (introrupisset) — προτερόχρονο στο παρελθόν.", kids:[
          { l:"Cum", r:"Σύνδεσμος", g:"υποτακτικός χρονικός (ιστορικός-διηγηματικός) σύνδεσμος", d:"cum — όταν" },
          { l:"cerva", r:"Υποκείμενο", to:"στο introrupisset", g:"ονομ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"cerva, -ae (θηλ. α΄) — το ελάφι", a:"," },
          { l:"emissa", r:"Επιρρ. χρονική μετοχή", to:"στο introrupisset", g:"ονομ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής", d:"emitto, emisi, emissum, emittĕre (3) — αφήνω ελεύθερο", note:"cerva = υποκ. της μετοχής· προτερόχρονο (συνημμένη)." },
          { l:"a servo", k:"servus", r:"Εμπρόθετος προσδ. του ποιητικού αιτίου", to:"στη μετοχή emissa", g:"a (πρόθ. + αφαιρ.) + servo (αφαιρ. ενικ., αρσ.)", d:"a — από· servus, -i (αρσ. β΄) — ο δούλος", note:"Εμπρόθετο, γιατί είναι έμψυχο." },
          { l:"in cubiculum", k:"cubiculum", r:"Εμπρόθετος προσδ. (κίνηση σε τόπο)", to:"στο introrupisset", g:"in (πρόθ. + αιτ.) + cubiculum (αιτ. ενικ., ουδ.)", d:"in — σε· cubiculum, -i (ουδ. β΄) — η κρεβατοκάμαρα" },
          { l:"Sertorii", k:"Sertorius", r:"Γενική κτητική", to:"στο cubiculum", g:"γεν. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Sertorius, -ii/-i (αρσ. β΄) — ο Σερτώριος" },
          { l:"introrupisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσ. ενεργ. φωνής", d:"introrumpo, introrupi, introruptum, introrumpĕre (3) (< intro + rumpo) — εισβάλλω", a:"," }
        ]},
        { l:"admiratio", r:"Υποκείμενο", to:"στο orta est", g:"ονομ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"admiratio, admirationis (θηλ. γ΄) — ο θαυμασμός, η κατάπληξη" },
        { l:"magna", r:"Επιθετικός προσδ.", to:"στο admiratio", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"magnus, -a, -um — μεγάλος, -η, -ο" },
        { l:"orta est", k:"orior", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. — αποθετικό", d:"orior, ortus sum, (ortum), orīri (4) — γεννιέμαι, εμφανίζομαι", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Cerva alba eximiae pulchritudinis Sertorio a Lusitāno quodam dono data erat.", el:"Ένα άσπρο ελάφι εξαιρετικής ομορφιάς είχε δοθεί ως δώρο στον Σερτώριο από κάποιον Λουζιτανό." },
    { la:"Sertorius omnibus persuāsit cervam, instinctam numine Diānae, conloqui secum et docēre, quae utilia factu essent.", el:"Ο Σερτώριος έπεισε όλους ότι το ελάφι, καθοδηγούμενο από τη βούληση της Άρτεμης, συζητούσε μαζί του και του υποδείκνυε ποια ήταν χρήσιμα να κάνει." },
    { la:"Si quid durius ei videbātur, quod imperandum militibus esset, a cerva esse monitum sese praedicābat.", el:"Αν κάτι φαινόταν σε αυτόν κάπως σκληρό, το οποίο έπρεπε να διατάξει στους στρατιώτες, διακήρυσσε ότι είχε καθοδηγηθεί από το ελάφι." },
    { la:"Ea cerva quodam die fugit et perisse credita est.", el:"Αυτό το ελάφι κάποια μέρα έφυγε και θεωρήθηκε ότι είχε πεθάνει." },
    { la:"Cum aliquis Sertorio nuntiavisset cervam inventam esse, Sertorius eum iussit tacēre; praeterea praecēpit ut eam postero die repente in eum locum emitteret, in quo ipse cum amicis futūrus esset.", el:"Όταν κάποιος ανήγγειλε στον Σερτώριο ότι το ελάφι βρέθηκε, ο Σερτώριος τον διέταξε να σωπάσει· επιπλέον του έδωσε οδηγίες να το αφήσει ελεύθερο ξαφνικά την επόμενη μέρα σε αυτόν τον τόπο, στον οποίο επρόκειτο να βρίσκεται ο ίδιος με τους φίλους του." },
    { la:"Postridie eius diei Sertorius, admissis amīcis in cubiculum suum, dixit eis visum in somno sibi esse cervam, quae perisset, ad se reverti.", el:"Την επόμενη μέρα ο Σερτώριος, αφού δέχτηκε τους φίλους του στην κρεβατοκάμαρά του, τους είπε ότι είχε δει στον ύπνο του πως το ελάφι, που είχε χαθεί, επέστρεφε σε αυτόν." },
    { la:"Cum cerva, emissa a servo, in cubiculum Sertorii introrupisset, admirātio magna orta est.", el:"Όταν το ελάφι, αφού αφέθηκε ελεύθερο από τον δούλο, εισέβαλε στην κρεβατοκάμαρα του Σερτώριου, γεννήθηκε μεγάλος θαυμασμός." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"cerva, -ae" },
        { form:"Diana, -ae", note:"κύριο όνομα" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Sertorius, -ii/-i", note:"κύριο όνομα· κλητ. Sertori" },
        { form:"Lusitanus, -i", note:"όνομα λαού" },
        { form:"locus, -i", note:"ετερογενές πληθ.: loci / loca" },
        { form:"amicus, -i" },
        { form:"somnus, -i" },
        { form:"servus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"donum, -i" },
        { form:"cubiculum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"miles, militis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"pulchritudo, pulchritudinis" },
        { form:"admiratio, admirationis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"numen, numinis" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"dies, diei", note:"συνήθως αρσ.· θηλ. όταν = ορισμένη ημέρα/προθεσμία" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"albus, -a, -um", note:"απόλυτο — δεν σχηματίζει παραθετικά" },
      { form:"eximius, -a, -um", note:"περιφραστικά παραθετικά (magis / maxime)" },
      { form:"durus, -a, -um" },
      { form:"posterus, -a, -um", note:"ανώμαλα παραθετικά" },
      { form:"magnus, -a, -um", note:"ανώμαλα παραθετικά" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"omnis, omnis, omne", note:"απόλυτο — δεν σχηματίζει παραθετικά" },
      { form:"utilis, utilis, utile", note:"δικατάληκτο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (& επιρρημάτων) ──────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"eximius, -a, -um", comp:"magis eximius", sup:"maxime eximius", note:"περιφραστικά (-ius πριν φωνήεν)· επίρρ.: eximie → magis eximie → maxime eximie" },
      { pos:"durus, -a, -um", comp:"durior, -ior, -ius", sup:"durissimus, -a, -um", note:"επίρρ.: dure / duriter → durius → durissime" },
      { pos:"posterus, -a, -um", comp:"posterior, -ior, -ius", sup:"postremus (postumus), -a, -um", note:"ανώμαλα· επίρρ.: postea → posterius → postremum / postremo" },
      { pos:"magnus, -a, -um", comp:"maior, -ior, -ius", sup:"maximus, -a, -um", note:"ανώμαλα· επίρρ.: magnopere → magis → maxime" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"utilis, -is, -e", comp:"utilior, -ior, -ius", sup:"utilissimus, -a, -um", note:"επίρρ.: utiliter → utilius → utilissime" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη επιθετική", extra:"quodam" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"quod, quo, quae" },
    { form:"sui, sibi, se (sese)", kind:"Προσωπική γ΄ προσ. (αυτοπαθής)", extra:"secum, sese, sibi, se" },
    { form:"quis, quid", kind:"Ερωτηματική ουσιαστική", extra:"quae (πλάγια ερώτηση)" },
    { form:"quis, qua, quid", kind:"Αόριστη ουσιαστική", extra:"quid (si quid)" },
    { form:"is, ea, id", kind:"Δεικτική (επαναληπτική/οριστική)", extra:"ei, ea, eum, eam, eius, eis" },
    { form:"aliquis, aliqua, aliquid", kind:"Αόριστη ουσιαστική", extra:"aliquis" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική-οριστική", extra:"ipse" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ. (suum)" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"do", perf:"dedi", sup:"datum", inf:"dăre", note:"βραχύχρονο α (dăre)" },
      { pres:"impero", perf:"imperavi", sup:"imperatum", inf:"imperāre", note:"" },
      { pres:"praedico", perf:"praedicavi", sup:"praedicatum", inf:"praedicāre", note:"" },
      { pres:"nuntio", perf:"nuntiavi", sup:"nuntiatum", inf:"nuntiāre", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"persuadeo", perf:"persuasi", sup:"persuasum", inf:"persuadēre", note:"< per + suadeo (+ δοτ.)" },
      { pres:"doceo", perf:"docui", sup:"doctum", inf:"docēre", note:"+ πλάγια ερώτηση" },
      { pres:"video", perf:"vidi", sup:"visum", inf:"vidēre", note:"" },
      { pres:"moneo", perf:"monui", sup:"monitum", inf:"monēre", note:"" },
      { pres:"iubeo", perf:"iussi", sup:"iussum", inf:"iubēre", note:"" },
      { pres:"taceo", perf:"tacui", sup:"tacitum", inf:"tacēre", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"instinguo", perf:"instinxi", sup:"instinctum", inf:"instinguĕre", note:"" },
      { pres:"conloquor", perf:"conlocutus sum", sup:"(conlocutum)", inf:"conloqui", note:"αποθετικό (< cum + loquor)" },
      { pres:"facio", perf:"feci", sup:"factum", inf:"facĕre", note:"3, σε -io" },
      { pres:"fugio", perf:"fugi", sup:"fugitum", inf:"fugĕre", note:"3, σε -io" },
      { pres:"credo", perf:"credidi", sup:"creditum", inf:"credĕre", note:"" },
      { pres:"praecipio", perf:"praecepi", sup:"praeceptum", inf:"praecipĕre", note:"3, σε -io· < prae + capio" },
      { pres:"emitto", perf:"emisi", sup:"emissum", inf:"emittĕre", note:"< e + mitto" },
      { pres:"admitto", perf:"admisi", sup:"admissum", inf:"admittĕre", note:"< ad + mitto" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicĕre", note:"" },
      { pres:"revertor", perf:"reverti", sup:"(reversum)", inf:"reverti", note:"ημιαποθετικό" },
      { pres:"introrumpo", perf:"introrupi", sup:"introruptum", inf:"introrumpĕre", note:"< intro + rumpo" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"invenio", perf:"inveni", sup:"inventum", inf:"invenīre", note:"< in + venio" },
      { pres:"orior", perf:"ortus sum", sup:"(ortum)", inf:"orīri", note:"αποθετικό" }
    ]},
    { syz:"Ανώμαλα ρήματα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"pereo", perf:"perii", sup:"peritum", inf:"perīre", note:"< per + eo — χάνομαι" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Πλάγιος λόγος", title:"Ειδικά απαρέμφατα & προσωπική/απρόσωπη σύνταξη", body:"Το κείμενο βρίθει ειδικών απαρεμφάτων: persuasit + conloqui/docere (υποκ. cervam, ετεροπροσωπία)· praedicabat + esse monitum (υποκ. sese, ταυτοπροσωπία)· «perisse credita est» → προσωπική σύνταξη με ΑΡΣΗ του λατινισμού (υποκ. σε ονομαστική, γιατί η εξάρτηση είναι από παθ. δοξαστικό)· dixit + visum esse (απρόσωπο) + reverti (υποκ. cervam)." },
    { tag:"Δοτική", title:"Σχήμα διπλής δοτικής", body:"«Sertorio … dono data erat»: δοτική προσωπική χαριστική (Sertorio) + δοτική κατηγορηματική του σκοπού (dono = ως δώρο) — το χαρακτηριστικό σχήμα της διπλής δοτικής." },
    { tag:"Σουπίνο", title:"factu (αφαιρετική σουπίνου)", body:"«quae utilia factu essent»: το factu είναι αφαιρετική του σουπίνου (σε -u), που λειτουργεί ως αφαιρετική της αναφοράς στο επίθετο utilia (χρήσιμα ως προς το να γίνουν). Η «quae … essent» είναι πλάγια ερωτηματική, αντικείμενο στο docere." },
    { tag:"Παθ. περιφραστική", title:"imperandum … esset (γερουνδιακό + sum)", body:"«quod imperandum militibus esset»: παθητική περιφραστική συζυγία (γερουνδιακό + sum) που δηλώνει το δέον· προσωπική σύνταξη (quod = υποκ., imperandum = κατηγορούμενο)· εννοείται δοτ. του ενεργούντος προσώπου (ei/Sertorio)." },
    { tag:"Χρονικές", title:"cum ιστορικός-διηγηματικός (×2)", body:"«Cum … nuntiavisset» και «Cum … introrupisset»: cum ιστορικός-διηγηματικός + υποτακτική (υπερσυντελίκου εδώ = προτερόχρονο στο παρελθόν), που υπογραμμίζει τη βαθύτερη σχέση δευτερεύουσας–κύριας." },
    { tag:"Αυτοπάθεια", title:"Έμμεση (πλάγια) αυτοπάθεια & αφαιρετική απόλυτη", body:"secum, sese, sibi, suum, ad se: έμμεση/πλάγια αυτοπάθεια — αναφέρονται στο υποκείμενο Sertorius μέσα σε φράση με απαρέμφατο. Πρόσεξε επίσης τη ΝΟΘΗ αφαιρετική απόλυτη «admissis amicis» (ποιητ. αίτιο = υποκ. dixit) έναντι της συνημμένης μετοχής «emissa» (στο cerva)." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"ΑΝΑΛΥΣΗ ΤΩΝ ΜΕΤΟΧΩΝ ΣΕ ΑΝΤΙΣΤΟΙΧΕΣ ΔΕΥΤΕΡΕΥΟΥΣΕΣ ΠΡΟΤΑΣΕΙΣ", items:[
      { from:"instinctam (επιρρηματική αιτιολογική μετοχή παρακειμένου· δηλώνει το προτερόχρονο)",
        to:[
        "quod / quia / quoniam instincta est (quod + οριστική παρακειμένου) — αντικειμενικά αποδεκτή αιτιολογία",
        "quod / quia / quoniam instincta esset (quod + υποτακτική υπερσυντελίκου) — υποκειμενική ή υποθετική αιτιολογία",
        "cum instincta esset (cum αιτιολογικός + υποτακτική υπερσυντελίκου) — αιτιολογία ως αποτέλεσμα εσωτερικής, λογικής διεργασίας"],
        note:"εξάρτηση από ιστορικό χρόνο: persuasit" },
      { from:"admissis (amicis) (επιρρηματική χρονική μετοχή παρακειμένου· δηλώνει το προτερόχρονο)",
        to:[
        "postquam Sertorius admisit amicos (postquam + οριστική παρακειμένου)",
        "cum Sertorius admisisset amicos (cum ιστορικός - διηγηματικός + υποτακτική υπερσυντελίκου)"],
        note:"εξάρτηση από ιστορικό χρόνο: dixit" },
      { from:"emissa (επιρρηματική χρονική μετοχή παρακειμένου· δηλώνει το προτερόχρονο)",
        to:[
        "postquam cerva emissa est a servo (postquam + οριστική παρακειμένου)",
        "cum cerva emissa esset a servo (cum ιστορικός - διηγηματικός + υποτακτική υπερσυντελίκου)"],
        note:"εξάρτηση από ιστορικό χρόνο: introrupisset" }
    ]},
    { id:"Β", label:"ΜΕΤΑΤΡΟΠΗ ΤΗΣ ΕΝΕΡΓΗΤΙΚΗΣ ΣΥΝΤΑΞΗΣ ΣΕ ΠΑΘΗΤΙΚΗ", items:[
      { from:"Cum aliquis Sertorio nuntiavisset cervam inventam esse, Sertorius eum iussit tacere.",
        to:"Cum ab aliquo Sertorio nuntiatum esset cervam inventam esse, is a Sertorio iussus est tacere.",
        note:"nuntiatum esset: απρόσωπο ρήμα· cervam inventam esse: υποκείμενο στο απρόσωπο nuntiatum esset" },
      { from:"..., ut eam postero die repente in eum locum emitteret, ...", to:"..., ut ea postero die repente in eum locum emitteretur ab illo (ενν.), ..." },
      { from:"praeterea praecepit, ut eam ... emitteret ...", to:"..., is praeceptus est a Sertorio, ut eam ... emitteret." }
    ]},
    { id:"Γ", label:"ΜΕΤΑΤΡΟΠΗ ΤΗΣ ΠΑΘΗΤΙΚΗΣ ΣΥΝΤΑΞΗΣ ΣΕ ΕΝΕΡΓΗΤΙΚΗ", items:[
      { from:"Cerva alba eximiae pulchritudinis Sertorio a Lusitano quodam dono data erat.", to:"Lusitanus quidam cervam albam eximiae pulchritudinis Sertorio dono dederat." },
      { from:"... a cerva sese monitum esse praedicabat.",
        to:"... cervam se ipsum (εννοούμενο) monuisse praedicabat.",
        note:"se: αντικείμενο" }
    ]},
    { id:"Δ", label:"ΜΕΤΑΤΡΟΠΗ ΤΗΣ ΠΑΘΗΤΙΚΗΣ ΠΕΡΙΦΡΑΣΤΙΚΗΣ ΣΥΖΥΓΙΑΣ ΣΕ ΣΥΝΤΑΞΗ ΤΟΥ DEBEO - ΑΠΑΡΕΜΦΑΤΟ (ΠΡΟΣΩΠΙΚΗ ΣΥΝΤΑΞΗ) Ή ΤΟΥ DEBET - ΑΠΑΡΕΜΦΑΤΟ (ΑΠΡΟΣΩΠΗ ΣΥΝΤΑΞΗ)", items:[
      { from:"..., quod imperandum militibus esset, ...",
        to:[
        "προσωπική: ..., quos is (ή Sertorius) militibus imperare deberet, ...",
        "απρόσωπη: ..., quod eum militibus imperare deberet, ..."],
        note:"Προτιμάται συνήθως η προσωπική σύνταξη: debeo + απαρέμφατο." }
    ]},
    { id:"Ε", label:"ΜΕΤΑΤΡΟΠΗ ΤΟΥ ΥΠΟΘΕΤΙΚΟΥ ΛΟΓΟΥ ΣΤΑ ΑΛΛΑ ΕΙΔΗ", items:[
      { from:"Si quid durius ei videbatur, a cerva sese monitum esse praedicabat. (υπόθεση ανοικτή για το παρελθόν· si + οριστική παρατατικού / οριστική παρατατικού)",
        to:[
        "ανοικτή για το παρόν: Si quid durius ei videtur, a cerva sese monitum esse praedicat. (si + οριστική ενεστώτα / οριστική ενεστώτα)",
        "ανοικτή για το μέλλον: Si quid durius ei videbitur (ή visum erit), a cerva sese monitum esse praedicabit. (si + οριστική μέλλοντα ή συντελεσμένου μέλλοντα / οριστική μέλλοντα)",
        "προσδοκωμένου για το παρόν - μέλλον: Si quid durius ei videatur, a cerva sese monitum esse praedicet. (si + υποτακτική ενεστώτα / υποτακτική ενεστώτα)",
        "αντίθετη προς την πραγματικότητα (απραγματοποίητο) για το παρόν: Si quid durius ei videretur, a cerva sese monitum esse praedicaret. (si + υποτακτική παρατατικού / υποτακτική παρατατικού)",
        "αντίθετη προς την πραγματικότητα (απραγματοποίητο) για το παρελθόν: Si quid durius ei visum esset, a cerva sese monitum esse praedicavisset. (si + υποτακτική υπερσυντελίκου / υποτακτική υπερσυντελίκου)"] }
    ]},
    { id:"ΣΤ", label:"ΜΕΤΑΤΡΟΠΗ ΤΟΥ ΚΕΙΜΕΝΟΥ ΣΕ ΠΛΑΓΙΟ ΛΟΓΟ", items:[
      { from:"Ολόκληρο το κείμενο, εξαρτημένο από: Scriptor tradit (αρκτικός χρόνος) / tradidit (ιστορικός χρόνος)",
        to:[
        "cervam albam ... datam esse·",
        "Sertorium omnibus persuasisse cervam, ..., conloqui secum et docere, quae sint / essent·",
        "(si quid durius) ei videretur, quod imperandum militibus esset, Sertorium a cerva sese monitum esse praedicare·",
        "eam cervam ... fugisse et perisse creditam esse·",
        "cum aliquis ... inventam esse (nuntiavisset), Sertorium eum iussisse tacere·",
        "praeterea Sertorium praecepisse ut eam ... emittat / emitteret, in quo ipse ... futurus sit / futurus esset·",
        "postero die Sertorium, admissis amicis in cubiculum suum, dixisse eis visum in somno sibi esse cervam, quae perierit / perisset, ad se reverti·",
        "cum cerva, ..., introrupisset, admirationem magnam ortam esse."],
        note:"Η υποτακτική υπερσυντελίκου introrupisset δεν μετατρέπεται σε υποτακτική παρακειμένου σε εξάρτηση από αρκτικό χρόνο, λόγω του ιστορικού - διηγηματικού συνδέσμου cum με τον οποίο εισάγεται η χρονική πρόταση. Με βάση το νόημα θα μπορούσε να χρησιμοποιηθεί στον ευθύ λόγο και οριστική υπερσυντελίκου, δηλώνοντας το προτερόχρονο σε σχέση με το περιεχόμενο της κύριας πρότασης (dixit)." }
    ]},
    { id:"Ζ", label:"ΜΕΤΑΤΡΟΠΗ ΤΟΥ ΠΛΑΓΙΟΥ ΛΟΓΟΥ ΣΕ ΕΥΘΥ", items:[
      { from:"Sertorius omnibus persuasit cervam, instinctam numine Dianae, conloqui secum et docere, quae utilia factu essent.", to:"Cerva, instincta numine Dianae, conloquitur mecum et docet, quae utilia factu sint." },
      { from:"... et docere, quae utilia factu essent.", to:"Quae utilia factu sunt?" },
      { from:"a cerva sese monitum esse praedicabat.", to:"Ego a cerva monitus sum." },
      { from:"... et perisse credita est.", to:"... et periit." },
      { from:"Cum aliquis nuntiavisset cervam inventam esse, ...", to:"Cerva inventa est." },
      { from:"..., Sertorius eum iussit tacere.", to:"Tace!" },
      { from:"praeterea praecepit ut eam postero die repente in eum locum emitteret, in quo ipse cum amicis futurus esset.", to:"Eam cras repente in eum locum emitte, in quo ego cum amicis ero." },
      { from:"..., dixit eis visum in somno sibi esse cervam, quae perisset, ad se reverti.", to:"Visum in somno mihi est cervam, quae periit / perierat, ad me reverti." },
      { from:"... visum in somno sibi esse cervam, quae perisset, ad se reverti.", to:"Cerva, quae periit, ad me revertitur." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"cerva, cervam, cervā", el:"κέρας, κέρατο // (γαλλ.) cerf (= ελάφι)" },
    { la:"alba [< albus]", el:"άλμπουμ (= λεύκωμα) // αλμπίνος, αλμπινισμός (< γαλλ.)" },
    { la:"pulchritudinis [< pulcher]", el:"pulchritude (= ομορφιά)" },
    { la:"Sertorio (Sertorius, Sertorii)", el:"Σερτώριος" },
    { la:"Lusitano (Lusitanus)", el:"Λουζιτανός" },
    { la:"dono, data [< do]", el:"δίδωμι, δώρημα, δώρο // (γαλλ.) donner (= δίνω)" },
    { la:"erat, essent, esset, esse, est [< sum]", el:"εἰμί" },
    { la:"persuadet [< persuadeo < per + suadeo]", el:"ἁδύς (ἡδύς), ἁνδάνω (= τέρπω), ηδονή // (αγγλ.) sweet (= γλυκύς)" },
    { la:"instinctam [< in-stinguo]", el:"στίζω, ένστικτο // (γαλλ.) instinct" },
    { la:"numine [< numen]", el:"νεύσω, νεύμα" },
    { la:"Dia-nam [< divus]", el:"Ζεύς, γενική Διός" },
    { la:"con-loqui [< con-loquor]", el:"(γαλλ.) loquace (= ομιλητικός)" },
    { la:"docere [< doceo]", el:"δοκέω, δόγμα // ντοκουμέντο (< ιταλ.) / (γαλλ.) docteur (= διδάκτωρ)" },
    { la:"utilia [< utilis]", el:"(αγγλ.) utility (= χρησιμότητα), use (= χρήση) // (γαλλ.) utile (= χρήσιμος)" },
    { la:"factu [< facio]", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο)" },
    { la:"durius [< durus]", el:"ντούρος (< ιταλ.) // (γαλλ.) dur (= σκληρός)" },
    { la:"videbatur, visum [< video]", el:"(ϝιδεῖν) ιδέα, βίντεο (< αγγλ.)" },
    { la:"imperandum [< impero]", el:"ιμπεριαλισμός (< γαλλ.)" },
    { la:"militibus [< miles]", el:"μιλιταρισμός (< γαλλ.)" },
    { la:"monitum [< moneo]", el:"μιμνήσκω, μνήμη" },
    { la:"prae-dicabant [< prae-dico], dixit [< dico]", el:"δείκνυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση)" },
    { la:"die, diei [< dies]", el:"(Ζεύς, γενική Διός) Δίας (ως «θεός του φωτός»)" },
    { la:"fugit [< fugio]", el:"φεύγω, φυγή // (αγγλ.) fugitive (= φυγάς)" },
    { la:"perisse, perisset [< pereo < per + eo]", el:"εἶμι" },
    { la:"credita [< credo]", el:"(αγγλ.) credible (= πιστευτός), αντιθ. incredible" },
    { la:"nuntiavisset [< nuntio]", el:"νεύω // νούντσιος (< ιταλ.) (= διπλωματικός αντιπρόσωπος του Πάπα)" },
    { la:"in-ventam [< invenio < in + venio]", el:"βαίνω // (γαλλ.) venir (= έρχομαι), avenue (= λεωφόρος), inventer (= εφευρίσκω)" },
    { la:"tacere [< taceo]", el:"(αγγλ.) tacit (= σιωπηρός)" },
    { la:"praecepit [< prae + capio]", el:"(γαλλ.) ac-cepter (= δέχομαι) // (ιταλ.) capire (= καταλαβαίνω)" },
    { la:"postero [< posterus]", el:"(αγγλ.) posterior (= μεταγενέστερος) // (γαλλ.) postérité (= απόγονοι) // (ισπαν.) posteridad (= αιωνιότητα)" },
    { la:"repente", el:"(ισπαν.) repentino (= ξαφνικός)" },
    { la:"locum [< locus]", el:"(γαλλ.) locale (= τοπικός) // (αγγλ.) location (= τοποθεσία)" },
    { la:"e-mitteret, ad-missis, e-missa [< mitto]", el:"(αγγλ.) mission (= αποστολή)" },
    { la:"futurus", el:"(γαλλ.) futur (= μέλλον)" },
    { la:"amicis [< amicus]", el:"αμόρε (< ιταλ.) // (γαλλ.) amour (= αγάπη), ami (= φίλος), amical (= φιλικός)" },
    { la:"cubiculum", el:"κουβούκλιο // (αγγλ.) shower cubicle (= καμπίνα λουτρού)" },
    { la:"somno [< somnus]", el:"ύπνος" },
    { la:"reverti [< revertor < re + verto]", el:"(verso) βέρσο (= πίσω μέρος σελίδας), ρεβέρ (< γαλλ.), v.s. (versus) (= εναντίον)" },
    { la:"servo [< servus]", el:"σερβίρω, σερβιτόρος, σερβίτσιο (< ιταλ.) // σέρβις (< αγγλ.), σερβίς (< γαλλ.)" },
    { la:"intro-rupisset [< introrumpo < intra + rumpo]", el:"(γαλλ.) rupture (= ρήξη), corruption (= διαφθορά)" },
    { la:"ad-miratio [< ad-miror]", el:"(γαλλ.) miracle (= θαύμα), admirable (= θαυμαστός)" },
    { la:"magna [< magnus]", el:"μέγας // (αγγλ.) magnificent (= μεγαλοπρεπής) // (γαλλ.) magnificence (= μεγαλοπρέπεια)" },
    { la:"orta [< orior]", el:"ὄρνυμι (= κινώ, εγείρω)" }
  ]
};

export default UNIT;
