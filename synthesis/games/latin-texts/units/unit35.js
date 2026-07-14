// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 35
//  Lectio XXXV — «Ο φιλόσοφος μπροστά στα δεινά της εξορίας» (Seneca)
//  Δομή ίδια με το template (unit16.js): periods -> kids (λέξεις/προτάσεις),
//  alignment, nouns, adjectives, comparatives, pronouns, verbs, sos.
//  + ΝΕΟ (προαιρετικό) πεδίο `transforms` -> Μέρος VIII «Μετατροπές».
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 35,
  title: "Ο φιλόσοφος μπροστά στα δεινά της εξορίας",
  latinTitle: "Lectio XXXV",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Unum", r:"Επιθετικός προσδ.", to:"στο servum", g:"αιτ. ενικ., αρσ. — απόλυτο αριθμητικό επίθετο", d:"unus, una, unum — ένας, μία, ένα" },
        { l:"fuisse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο tradunt", g:"απαρέμφατο παρακειμένου — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι, υπάρχω", note:"Υπαρκτικό «είμαι»· εκφράζει κτήση σε συνδυασμό με δοτική προσωπική (Homero / Platoni / Zenoni)." },
        { l:"Homero", r:"Δοτική προσωπική κτητική", to:"στο (υπαρκτικό) fuisse", g:"δοτ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Homērus, -i (αρσ. β΄) — ο Όμηρος" },
        { l:"servum", r:"Υποκείμενο απαρεμφάτου", to:"στο fuisse (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"servus, -i (αρσ. β΄) — ο δούλος", a:"," },
        { l:"tres", r:"Επιθετικός προσδ.", to:"στο εννοούμενο servos", g:"αιτ. πληθ., αρσ. — απόλυτο αριθμητικό επίθετο", d:"tres, tres, tria — τρεις, τρία", note:"Εννοείται (servos) υποκ. του fuisse: «τρεις (δούλους)»." },
        { l:"Platoni", r:"Δοτική προσωπική κτητική", to:"στο (υπαρκτικό) fuisse", g:"δοτ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"Plato(n), Platōnis (αρσ. γ΄) — ο Πλάτωνας", a:"," },
        { l:"nullum", r:"Επιθετικός προσδ.", to:"στο εννοούμενο servum", g:"αιτ. ενικ., αρσ. — αόριστη επιθετική αντωνυμία / αντωνυμικό επίθ.", d:"nullus, nulla, nullum — κανένας, καμία, κανένα" },
        { l:"Zenoni", r:"Δοτική προσωπική κτητική", to:"στο (υπαρκτικό) fuisse", g:"δοτ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"Zeno(n), Zenōnis (αρσ. γ΄) — ο Ζήνωνας" },
        { l:"tradunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. ενεργ. φωνής", d:"trado, tradidi, traditum, tradĕre (3) (< trans + do) — παραδίδω, αναφέρω", note:"Εννοούμενο υποκείμενο: (homines) = αναφέρουν.", a:"." }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Nemo", r:"Υποκείμενο", to:"στο miseretur", g:"ονομ. ενικ., αρσ. — αόριστη ουσιαστική αντωνυμία", d:"nemo (< ne + homo) — κανένας" },
        { l:"vero", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"vero — όμως, αλλά" },
        { l:"eos", r:"Αντικείμενο", to:"στο miseretur", g:"αιτ. πληθ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό", note:"eos = Homerum, Platonem, Zenonem." },
        { l:"miseretur", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. — αποθετικό (β΄ συζ.)", d:"misereor, miseritus sum, (miseritum), miserēri (2, αποθετικό) — λυπάμαι, οικτίρω", note:"nemo eos miseretur = κανείς ας μην τους λυπηθεί (προτρεπτική/απαγορευτική χροιά).", a:"," }
      ]},
      { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρηματική αιτιολογική· επιρρ. προσδ. της αιτίας στο miseretur. Εισάγεται με τον αιτιολογικό σύνδεσμο quod, εκφέρεται με υποτακτική (υποκειμενική/υποθετική αιτιολογία), χρόνου παρακειμένου (vixerint — προτερόχρονο στο παρόν).", kids:[
        { l:"quod", r:"Σύνδεσμος", g:"υποτακτικός αιτιολογικός σύνδεσμος", d:"quod — επειδή" },
        { l:"infeliciter", r:"Επιρρ. προσδ. του τρόπου", to:"στο vixerint", g:"τροπικό επίρρημα", d:"infeliciter — δυστυχισμένα, στη δυστυχία" },
        { l:"vixerint", r:"Ρήμα", g:"γ΄ πληθ. υποτ. παρακειμένου ενεργ. φωνής", d:"vivo, vixi, victum, vivĕre (3) — ζω", note:"Εννοούμενο υποκ.: (ei) = Homerus, Plato, Zeno.", a:"." }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Menenius", r:"Υποκείμενο", to:"στο funeratus est", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Menēnius, -ii (-i) (αρσ. β΄) — ο Μενήνιος" },
        { l:"Agrippa", r:"Υποκείμενο", to:"στο funeratus est", g:"ονομ. ενικ., αρσ. — ουσιαστικό α΄ κλ.", d:"Agrippa, -ae (αρσ. α΄) — ο Αγρίππας", note:"Menenius Agrippa = ενιαίο κύριο όνομα (υποκείμενο).", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στον όρο Menenius Agrippa. Εισάγεται με την αναφ. αντωνυμία qui, εκφέρεται με οριστική (πραγματικό), χρόνου παρακειμένου (fuit).", kids:[
          { l:"qui", r:"Υποκείμενο", to:"στο fuit", g:"ονομ. ενικ., αρσ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος, η οποία, το οποίο" },
          { l:"inter patres", k:"pater", r:"Εμπρόθετος προσδ. της κοινωνίας («μεταξύ»)", to:"στο fuit", g:"inter (πρόθ. + αιτ.) + patres (αιτ. πληθ., αρσ.)", d:"inter — ανάμεσα, μεταξύ· patres, patrum (αρσ. γ΄, πληθ.) — οι πατρίκιοι, οι Συγκλητικοί" },
          { l:"ac", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"ac — και" },
          { l:"plebem", r:"Εμπρόθετος προσδ. της κοινωνίας («μεταξύ»)", to:"στο fuit (εξυπακ. inter)", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄/ε΄ κλ. (ετερόκλιτο)", d:"plebs, plebis (& plebes, plebei) (θηλ.) — οι πληβείοι, ο απλός λαός" },
          { l:"publicae", r:"Επιθετικός προσδ.", to:"στο gratiae", g:"γεν. ενικ., θηλ. — επίθ. β΄ κλ.", d:"publicus, -a, -um — δημόσιος, -α, -ο" },
          { l:"gratiae", r:"Γενική αντικειμενική", to:"στο sequester", g:"γεν. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"gratia, -ae (θηλ. α΄) — η χάρη, η συμφιλίωση" },
          { l:"sequester", r:"Κατηγορούμενο", to:"στο qui (μέσω fuit)", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"sequester, sequestris (αρσ. γ΄) — ο μεσολαβητής", note:"publicae gratiae sequester = μεσολαβητής για την κοινή συμφιλίωση (απεργία πληβείων, 494 π.Χ.)." },
          { l:"fuit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου — συνδετικό", d:"sum, fui, —, esse — είμαι", a:"," }
        ]},
        { l:"aere", r:"Υποκείμενο μετοχής", to:"στη μετοχή collato", g:"αφαιρ. ενικ., ουδ. — ουσιαστικό γ΄ κλ.", d:"aes, aeris (ουδ. γ΄) — ο χαλκός, τα χρήματα", note:"aere collato = με έρανο (με χρήματα που συγκεντρώθηκαν)." },
        { l:"collato", r:"Χρονική μετοχή (γνήσια αφαιρ. απόλυτη)", to:"στο funeratus est", g:"αφαιρ. ενικ., ουδ. — μετοχή παθ. παρακειμένου, β΄ κλ.", d:"collatus, -a, -um (< confero, contuli, collatum, conferre) — αφού συγκεντρώθηκε", note:"Γνήσια αφαιρετική απόλυτη· επιρρ. χρονική μετοχή, δηλώνει το προτερόχρονο." },
        { l:"funeratus est", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής", d:"funero, funerāvi, funeratum, funerāre (1) (< funus) — κηδεύω, θάβω", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Atilius", r:"Υποκείμενο", to:"στο scripsit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Atilius, -ii (-i) (αρσ. β΄) — ο Ατίλιος" },
        { l:"Regulus", r:"Υποκείμενο", to:"στο scripsit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Rēgulus, -i (αρσ. β΄) — ο Ρήγουλος", note:"Atilius Regulus: Ρωμαίος ύπατος του Α΄ Καρχηδονιακού πολέμου.", a:"," },
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρηματική χρονική· επιρρ. προσδ. του χρόνου στο scripsit. Εισάγεται με ιστορικό-διηγηματικό cum, εκφέρεται με υποτακτική παρατατικού (funderet — σύγχρονο στο παρελθόν)· τονίζει τη βαθύτερη σχέση αιτίου–αιτιατού.", kids:[
          { l:"cum", r:"Σύνδεσμος", g:"υποτακτικός χρονικός (ιστορικός-διηγηματικός) σύνδεσμος", d:"cum — όταν" },
          { l:"Poenos", r:"Αντικείμενο", to:"στο funderet", g:"αιτ. πληθ., αρσ. — ουσιαστικό β΄ κλ. (μόνο πληθ.)", d:"Poeni, -orum (αρσ. β΄) — οι Καρχηδόνιοι" },
          { l:"in Africa", k:"Africa", r:"Εμπρόθετος προσδ. της στάσης σε τόπο", to:"στο funderet", g:"in (πρόθ. + αφαιρ.) + Africa (αφαιρ. ενικ., θηλ.)", d:"in — σε· Africa, -ae (θηλ. α΄) — η Αφρική" },
          { l:"funderet", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατατικού ενεργ. φωνής", d:"fundo, fudi, fusum, fundĕre (3) — τρέπω σε φυγή, κατατροπώνω", note:"Εννοούμενο υποκ.: (Atilius Regulus).", a:"," }
        ]},
        { l:"ad senatum", k:"senatus", r:"Εμπρόθετος προσδ. της κατεύθυνσης (σε πρόσωπο)", to:"στο scripsit", g:"ad (πρόθ. + αιτ.) + senatum (αιτ. ενικ., αρσ.)", d:"ad — προς· senatus, -us (αρσ. δ΄) — η Σύγκλητος" },
        { l:"scripsit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"scribo, scripsi, scriptum, scribĕre (3) — γράφω" },
        { l:"mercenarium", r:"Υποκείμενο απαρεμφάτου", to:"στο discessisse (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"mercenārius, -ii (αρσ. β΄) — ο μισθωτός εργάτης" },
        { l:"suum", r:"Επιθετικός προσδ.", to:"στο mercenarium", g:"αιτ. ενικ., αρσ. — κτητική αντωνυμία γ΄ προσ. (ενός κτήτορα)", d:"suus, sua, suum — δικός, -ή, -ό του", note:"Άμεση (ευθεία) αυτοπάθεια — αναφέρεται στο υποκ. Atilius Regulus." },
        { l:"discessisse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο scripsit", g:"απαρέμφατο παρακειμένου ενεργ. φωνής", d:"discedo, discessi, discessum, discedĕre (3) (< dis + cedo) — φεύγω, αποχωρώ" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"ab eo", k:"is", r:"Εμπρόθετο ποιητικό αίτιο", to:"στο desertum esse", g:"ab (πρόθ. + αφαιρ.) + eo (αφαιρ. ενικ., αρσ.)", d:"ab — από· is, ea, id — αυτός (eo = mercenario)", note:"Ποιητικό αίτιο σε εμπρόθετη αφαιρετική, γιατί είναι έμψυχο." },
        { l:"desertum esse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο scripsit", g:"απαρέμφατο παρακειμένου παθ. φωνής", d:"desero, deserui, desertum, deserĕre (3) — εγκαταλείπω" },
        { l:"rus", r:"Υποκείμενο απαρεμφάτου", to:"στο desertum esse (ετεροπροσωπία)", g:"αιτ. ενικ., ουδ. — ουσιαστικό γ΄ κλ.", d:"rus, ruris (ουδ. γ΄) — ο αγρός, η εξοχή", a:";" }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"id", r:"Υποκείμενο απαρεμφάτου", to:"στο curari (ετεροπροσωπία)", g:"αιτ. ενικ., ουδ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό", note:"id = rus (ο αγρός)." },
        { l:"senatui", r:"Δοτική προσωπική", to:"στο απρόσωπο placuit", g:"δοτ. ενικ., αρσ. — ουσιαστικό δ΄ κλ.", d:"senatus, -us (αρσ. δ΄) — η Σύγκλητος" },
        { l:"publice", r:"Επιρρ. προσδ. του τρόπου", to:"στο curari", g:"τροπικό επίρρημα", d:"publice — δημόσια, με τη φροντίδα του κράτους" },
        { l:"curari", r:"Τελικό απαρέμφατο (υποκείμενο)", to:"στο απρόσωπο placuit", g:"απαρέμφατο ενεστ. παθ. φωνής", d:"curo, curāvi, curatum, curāre (1) — φροντίζω" },
        { l:"placuit", r:"Ρήμα (απρόσωπο)", g:"γ΄ ενικ. οριστ. παρακειμένου — απρόσωπο", d:"placet, placuit / placitum est, placēre (2, απρόσωπο) — αποφασίζω, αρέσει", note:"placet + δοτ. προσωπική + απαρέμφατο. id senatui curari placuit = η Σύγκλητος αποφάσισε να καλλιεργηθεί ο αγρός.", a:"," }
      ]},
      { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρηματική αιτιολογική· επιρρ. προσδ. της αιτίας στο placuit. Εισάγεται με quoniam, εκφέρεται με οριστική (αντικειμενικά αποδεκτή αιτιολογία), χρόνου παρατατικού (aberat).", kids:[
        { l:"quoniam", r:"Σύνδεσμος", g:"υποτακτικός αιτιολογικός σύνδεσμος", d:"quoniam — επειδή" },
        { l:"Regulus", r:"Υποκείμενο", to:"στο aberat", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Rēgulus, -i (αρσ. β΄) — ο Ρήγουλος" },
        { l:"aberat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατατικού — ανώμαλο (σύνθετο του sum)", d:"absum, afui, —, abesse (< ab + sum) — απουσιάζω, λείπω", a:"." }
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Scipionis", r:"Γενική κτητική", to:"στο filiae", g:"γεν. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"Scipio, Scipiōnis (αρσ. γ΄) — ο Σκιπίωνας" },
        { l:"filiae", r:"Υποκείμενο", to:"στο acceperunt", g:"ονομ. πληθ., θηλ. — ουσιαστικό α΄ κλ.", d:"filia, -ae (θηλ. α΄) — η κόρη", note:"Δοτ./αφαιρ. πληθ. filiabus (για διάκριση από το αρσ. filius)." },
        { l:"ex aerario", k:"aerarium", r:"Εμπρόθετος προσδ. της προέλευσης", to:"στο acceperunt", g:"ex (πρόθ. + αφαιρ.) + aerario (αφαιρ. ενικ., ουδ.)", d:"ex — από· aerarium, -ii (-i) (ουδ. β΄) — το δημόσιο ταμείο" },
        { l:"dotem", r:"Αντικείμενο", to:"στο acceperunt", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"dos, dotis (θηλ. γ΄) — η προίκα" },
        { l:"acceperunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής", d:"accipio, accepi, acceptum, accipĕre (3, σε -io) (< ad + capio) — παίρνω, δέχομαι", a:"," }
      ]},
      { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρηματική αιτιολογική· επιρρ. προσδ. της αιτίας στο acceperunt. Εισάγεται με quia, εκφέρεται με οριστική (αντικειμενικά αποδεκτή), χρόνου υπερσυντελίκου (reliquerat — προτερόχρονο).", kids:[
        { l:"quia", r:"Σύνδεσμος", g:"υποτακτικός αιτιολογικός σύνδεσμος", d:"quia — επειδή" },
        { l:"nihil", r:"Άμεσο αντικείμενο", to:"στο reliquerat", g:"αιτ. ενικ., ουδ. — αόριστη ουσιαστική αντωνυμία", d:"nihil — τίποτα", note:"Σχηματίζει μόνο ονομ./αιτ. ενικ. ουδ.· οι άλλες πτώσεις από το nulla res." },
        { l:"illis", r:"Έμμεσο αντικείμενο", to:"στο reliquerat", g:"δοτ. πληθ., θηλ. — δεικτική αντωνυμία", d:"ille, illa, illud — εκείνος, -η, -ο" },
        { l:"reliquerat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσυντελίκου ενεργ. φωνής", d:"relinquo, reliqui, relictum, relinquĕre (3) — αφήνω, κληροδοτώ" },
        { l:"pater", r:"Υποκείμενο", to:"στο reliquerat", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"pater, patris (αρσ. γ΄) — ο πατέρας", a:"." }
      ]}
    ]},

    { n: 7, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Aequum", r:"Κατηγορούμενο (απρόσωπη έκφραση)", to:"με το erat", g:"ονομ. ενικ., ουδ. — επίθ. β΄ κλ.", d:"aequus, aequa, aequum — δίκαιος, -η, -ο", note:"aequum erat = ήταν δίκαιο (απρόσωπη έκφραση + τελικό απαρέμφατο)." },
        { l:"mehercule", r:"Επιφωνηματική (ομωτική) έκφραση", g:"επιφώνημα", d:"mehercule — μα τον Ηρακλή" },
        { l:"erat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατατικού — συνδετικό/βοηθητικό", d:"sum, fui, —, esse — είμαι" },
        { l:"populum", r:"Υποκείμενο απαρεμφάτου", to:"στο conferre (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"populus, -i (αρσ. β΄) — ο λαός" },
        { l:"Romanum", r:"Επιθετικός προσδ.", to:"στο populum", g:"αιτ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"Rōmānus, -a, -um — ρωμαϊκός, -ή, -ό" },
        { l:"tributum", r:"Άμεσο αντικείμενο", to:"στο conferre", g:"αιτ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"tribūtum, -i (ουδ. β΄) — ο φόρος, η εισφορά" },
        { l:"Scipioni", r:"Έμμεσο αντικείμενο", to:"στο conferre", g:"δοτ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"Scipio, Scipiōnis (αρσ. γ΄) — ο Σκιπίωνας" },
        { l:"conferre", r:"Τελικό απαρέμφατο (υποκείμενο)", to:"στην απρόσωπη έκφραση aequum erat", g:"απαρέμφατο ενεστ. ενεργ. φωνής — ανώμαλο (σύνθετο του fero)", d:"confero, contuli, collatum, conferre (< cum + fero) — συγκεντρώνω, καταβάλλω (φόρο)", a:"," }
      ]},
      { type:"sub", key:"aitiologiki", label:"Αιτιολογική", note:"Δευτ. επιρρηματική αιτιολογική· επιρρ. προσδ. της αιτίας στην απρόσωπη έκφραση aequum erat. Εισάγεται με cum, εκφέρεται με υποτακτική (αιτιολογία ως εσωτερική λογική διεργασία), χρόνου παρατατικού (exigeret — σύγχρονο στο παρελθόν).", kids:[
        { l:"cum", r:"Σύνδεσμος", g:"υποτακτικός αιτιολογικός σύνδεσμος", d:"cum — αφού, επειδή" },
        { l:"a Carthagine", k:"Carthago", r:"Εμπρόθετος προσδ. της προέλευσης", to:"στο exigeret", g:"a (πρόθ. + αφαιρ.) + Carthagine (αφαιρ. ενικ., θηλ.)", d:"a — από· Carthago, Carthaginis (θηλ. γ΄) — η Καρχηδόνα" },
        { l:"semper", r:"Επιρρ. προσδ. του χρόνου", to:"στο exigeret", g:"χρονικό επίρρημα", d:"semper — πάντοτε" },
        { l:"tributum", r:"Αντικείμενο", to:"στο exigeret", g:"αιτ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"tribūtum, -i (ουδ. β΄) — ο φόρος" },
        { l:"ipse", r:"Υποκείμενο", to:"στο exigeret", g:"ονομ. ενικ., αρσ. — δεικτική/οριστική αντωνυμία", d:"ipse, ipsa, ipsum — ο ίδιος, η ίδια, το ίδιο" },
        { l:"exigeret", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατατικού ενεργ. φωνής", d:"exigo, exegi, exactum, exigĕre (3) (< ex + ago) — εισπράττω, απαιτώ", a:"." }
      ]}
    ]},

    { n: 8, kids: [
      { type:"main", key:"kyria", label:"Κύρια (επιφωνηματική)", kids:[
        { l:"O", r:"Επιφώνημα", g:"επιφώνημα", d:"O — ω!" },
        { l:"felices", r:"Επιθετικός προσδ.", to:"στο viros", g:"αιτ. πληθ., αρσ. — επίθ. γ΄ κλ. (μονοκατάληκτο)", d:"felix, felicis — ευτυχισμένος, -η, -ο" },
        { l:"viros", r:"Επιφωνηματική αιτιατική", g:"αιτ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"vir, viri (αρσ. β΄) — ο άνδρας", note:"Αιτιατική της αναφώνησης (σε εκφράσεις έκπληξης ή πόνου)." },
        { l:"puellarum", r:"Γενική κτητική", to:"στο viros", g:"γεν. πληθ., θηλ. — ουσιαστικό α΄ κλ.", d:"puella, -ae (θηλ. α΄) — το κορίτσι", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική-αιτιολογική", note:"Δευτ. αναφορική-αιτιολογική, προσδιοριστική στον όρο viros. Εισάγεται με quibus, εκφέρεται με οριστική (αντικειμενικά αποδεκτή αιτιολογία), χρόνου παρακειμένου (fuit).", kids:[
          { l:"quibus", r:"Δοτική προσωπική (χαριστική)", to:"στο fuit", g:"δοτ. πληθ., αρσ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος, η οποία, το οποίο" },
          { l:"populus", r:"Υποκείμενο", to:"στο fuit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"populus, -i (αρσ. β΄) — ο λαός" },
          { l:"Romanus", r:"Επιθετικός προσδ.", to:"στο populus", g:"ονομ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"Rōmānus, -a, -um — ρωμαϊκός, -ή, -ό" },
          { l:"loco", r:"Αφαιρετική του τόπου (μεταφορικά)", to:"στο fuit", g:"αφαιρ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"locus, -i (αρσ. β΄) — ο τόπος, η θέση", note:"loco soceri = κατηγορούμενο (μέσω του συνδετικού fuit): «πήρε τη θέση του πεθερού»." },
          { l:"soceri", r:"Γενική κτητική", to:"στο loco", g:"γεν. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"socer, soceri (αρσ. β΄) — ο πεθερός" },
          { l:"fuit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου — συνδετικό", d:"sum, fui, —, esse — είμαι", a:"!" }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Unum fuisse Homero servum, tres Platoni, nullum Zenoni tradunt.", el:"Αναφέρουν ότι ο Όμηρος είχε έναν δούλο, ο Πλάτωνας τρεις, ο Ζήνωνας κανέναν." },
    { la:"Nemo vero eos miseretur, quod infeliciter vixerint.", el:"Κανένας όμως ας μην τους λυπάται, επειδή (τάχα) έζησαν δυστυχισμένα." },
    { la:"Menenius Agrippa, qui inter patres ac plebem publicae gratiae sequester fuit, aere collato funeratus est.", el:"Ο Μενήνιος Αγρίππας, ο οποίος υπήρξε μεσολαβητής για την κοινή συμφιλίωση ανάμεσα στους πατρικίους και στους πληβείους, κηδεύτηκε με έρανο." },
    { la:"Atilius Regulus, cum Poenos in Africa funderet, ad senatum scripsit mercenarium suum discessisse et ab eo desertum esse rus;", el:"Ο Ατίλιος Ρήγουλος, όταν κατατρόπωνε τους Καρχηδόνιους στην Αφρική, έγραψε στη Σύγκλητο ότι ο μισθωτός εργάτης του είχε φύγει και ότι ο αγρός είχε εγκαταλειφθεί από αυτόν·" },
    { la:"id senatui publice curari placuit, quoniam Regulus aberat.", el:"η Σύγκλητος αποφάσισε να καλλιεργηθεί αυτός με τη φροντίδα του κράτους, επειδή ο Ρήγουλος απουσίαζε." },
    { la:"Scipionis filiae ex aerario dotem acceperunt, quia nihil illis reliquerat pater.", el:"Οι κόρες του Σκιπίωνα πήραν προίκα από το δημόσιο ταμείο, επειδή ο πατέρας (τους) δεν είχε αφήσει τίποτα σε εκείνες." },
    { la:"Aequum mehercule erat populum Romanum tributum Scipioni conferre, cum a Carthagine semper tributum ipse exigeret.", el:"Ήταν βέβαια δίκαιο, μα τον Ηρακλή, να πληρώνει ο ρωμαϊκός λαός φόρο στον Σκιπίωνα, αφού ο ίδιος εισέπραττε πάντοτε φόρο από την Καρχηδόνα." },
    { la:"O felices viros puellarum, quibus populus Romanus loco soceri fuit!", el:"Ω τρισευτυχισμένοι άνδρες των κοριτσιών (= των μελλοντικών συζύγων), για τους οποίους ο ρωμαϊκός λαός στάθηκε στη θέση του πεθερού!" }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Agrippa, -ae", note:"κύριο όνομα — μόνο ενικ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"gratia, -ae" },
        { form:"Africa, -ae", note:"κύριο όνομα — μόνο ενικ." },
        { form:"filia, -ae", note:"δοτ./αφαιρ. πληθ. filiis & filiabus" },
        { form:"puella, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Homērus, -i", note:"κύριο όνομα — μόνο ενικ." },
        { form:"servus, -i" },
        { form:"Menēnius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Meneni" },
        { form:"Atilius, -ii (-i)", note:"κύριο όνομα — μόνο ενικ.· κλητ. Atili" },
        { form:"Rēgulus, -i", note:"κύριο όνομα — μόνο ενικ." },
        { form:"Poeni, -orum", note:"εθνικό — μόνο πληθ." },
        { form:"mercenārius, -ii", note:"γεν. ενικ. μόνο ασυναίρετη (mercenarii)" },
        { form:"populus, -i" },
        { form:"locus, -i", note:"ετερογενές/ετερόσημο: πληθ. loca (τόποι), loci (χωρία βιβλίου)" },
        { form:"vir, viri", note:"β΄ κλ. σε -ir (χωρίς κατάληξη ονομ./κλητ. ενικ.)" },
        { form:"socer, soceri" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"aerarium, -ii (-i)" },
        { form:"tribūtum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Plato(n), Platōnis", note:"κύριο όνομα (ελλην.) — μόνο ενικ.· τύποι Plato/Platon, αιτ. Platonem/Platona" },
        { form:"Zeno(n), Zenōnis", note:"κύριο όνομα (ελλην.) — μόνο ενικ.· τύποι Zeno/Zenon, αιτ. Zenonem/Zenona" },
        { form:"sequester, sequestris", note:"γεν. πληθ. -ium, αιτ. πληθ. -es/-is" },
        { form:"Scipio, Scipiōnis", note:"κύριο όνομα — μόνο ενικ." },
        { form:"pater, patris", note:"γεν. πληθ. patrum· ο πληθ. patres, patrum = οι πατρίκιοι/Συγκλητικοί" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"plebs, plebis", note:"ετερόκλιτο· και κατά ε΄ κλ. (plebes, plebei)" },
        { form:"dos, dotis", note:"γεν. πληθ. -ium (dotium), αιτ. πληθ. -es/-is" },
        { form:"Carthago, Carthaginis", note:"κύριο όνομα — μόνο ενικ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"aes, aeris", note:"υλικό — κανονικά μόνο ενικ.· πληθ. aera = χάλκινα νομίσματα" },
        { form:"rus, ruris", note:"πληθ. μόνο ονομ./αιτ. (rura)" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"senatus, -us", note:"δοτ. ενικ. senatui & senatu· περιληπτικό — μόνο ενικ." }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"publicus, -a, -um", note:"δεν σχηματίζει παραθετικά (απόλυτη έννοια)" },
      { form:"aequus, aequa, aequum" },
      { form:"Rōmānus, -a, -um", note:"εθνικό — δεν σχηματίζει παραθετικά" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"felix, felix, felix (felicis)", note:"τριγενές μονοκατάληκτο" }
    ]},
    { kl:"Αριθμητικά επίθετα (απόλυτα)", items:[
      { form:"unus, una, unum", note:"γεν. unīus, δοτ. uni (αντωνυμική κλίση)" },
      { form:"tres, tres, tria", note:"μόνο πληθ.· γεν. trium, δοτ./αφαιρ. tribus" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ ──────────────────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"aequus, aequa, aequum", comp:"aequior, -ior, -ius", sup:"aequissimus, -a, -um", note:"επίρρ.: aeque → aequius → aequissime" },
      { pos:"publicus, -a, -um", comp:"—", sup:"—", note:"δεν σχηματίζει παραθετικά (απόλυτη έννοια)" },
      { pos:"Rōmānus, -a, -um", comp:"—", sup:"—", note:"εθνικό — δεν σχηματίζει παραθετικά" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"felix, felix, felix", comp:"felicior, -ior, -ius", sup:"felicissimus, -a, -um", note:"επίρρ.: feliciter → felicius → felicissime" },
      { pos:"infelix, infelix, infelix", comp:"infelicior, -ior, -ius", sup:"infelicissimus, -a, -um", note:"επίρρ.: infeliciter → infelicius → infelicissime" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"nemo", kind:"Αόριστη ουσιαστική", extra:"< ne + homo· αναπληρώνεται από nullius, nemini, nullo (rei/re)" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική (eos, eo)" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"εκείνος, -η, -ο (illis)" },
    { form:"ipse, ipsa, ipsum", kind:"Οριστική", extra:"δεικτική-οριστική· δηλώνει ταυτότητα" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"ο οποίος (qui, quibus)" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ενός κτήτορα (άμεση αυτοπάθεια)" },
    { form:"nihil", kind:"Αόριστη ουσιαστική", extra:"μόνο ονομ./αιτ. ενικ. ουδ.· υπόλοιπα από nulla res" },
    { form:"nullus, nulla, nullum", kind:"Αντωνυμικό επίθετο", extra:"αόριστη επιθ. αντωνυμία· γεν. nullīus, δοτ. nulli" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"funero", perf:"funerāvi", sup:"funeratum", inf:"funerāre", note:"< funus" },
      { pres:"curo", perf:"curāvi", sup:"curatum", inf:"curāre", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"misereor", perf:"miseritus sum", sup:"(miseritum)", inf:"miserēri", note:"αποθετικό (τύπος κειμένου: miseretur)" },
      { pres:"placet", perf:"placuit / placitum est", sup:"—", inf:"placēre", note:"απρόσωπο" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"trado", perf:"tradidi", sup:"traditum", inf:"tradĕre", note:"< trans + do" },
      { pres:"vivo", perf:"vixi", sup:"victum", inf:"vivĕre", note:"" },
      { pres:"fundo", perf:"fudi", sup:"fusum", inf:"fundĕre", note:"τρέπω σε φυγή" },
      { pres:"scribo", perf:"scripsi", sup:"scriptum", inf:"scribĕre", note:"" },
      { pres:"discedo", perf:"discessi", sup:"discessum", inf:"discedĕre", note:"< dis + cedo" },
      { pres:"desero", perf:"deserui", sup:"desertum", inf:"deserĕre", note:"" },
      { pres:"accipio", perf:"accepi", sup:"acceptum", inf:"accipĕre", note:"3, σε -io (< ad + capio)" },
      { pres:"relinquo", perf:"reliqui", sup:"relictum", inf:"relinquĕre", note:"" },
      { pres:"exigo", perf:"exegi", sup:"exactum", inf:"exigĕre", note:"< ex + ago" }
    ]},
    { syz:"Ανώμαλα ρήματα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"absum", perf:"afui", sup:"—", inf:"abesse", note:"< ab + sum" },
      { pres:"confero", perf:"contuli", sup:"collatum", inf:"conferre", note:"ανώμαλο, σύνθετο του fero" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Σύνταξη", title:"Δοτική προσωπική κτητική + υπαρκτικό «sum»", body:"«Unum fuisse Homero servum, tres Platoni, nullum Zenoni»: το fuisse είναι υπαρκτικό «είμαι» και μαζί με τη δοτική προσωπική κτητική (Homero, Platoni, Zenoni) δηλώνει κατοχή· κατά λέξη «στον Όμηρο υπήρχε ένας δούλος» = ο Όμηρος είχε έναν δούλο. Υποκείμενα των (εννοούμενων) fuisse: servum / (servos) / (servum)." },
    { tag:"Απαρέμφατο", title:"Ετεροπροσωπία στα ειδικά απαρέμφατα", body:"Τα ειδικά απαρέμφατα fuisse (στο tradunt), discessisse & desertum esse (στο scripsit) έχουν υποκείμενο σε αιτιατική διαφορετικό από το υποκείμενο του ρήματος εξάρτησης (ετεροπροσωπία): servum, mercenarium, rus αντίστοιχα. Το απαρέμφατο παθ. παρακειμένου (desertum esse) είναι πάντοτε ειδικό." },
    { tag:"Μετοχή", title:"Γνήσια αφαιρετική απόλυτη «aere collato»", body:"«aere collato»: γνήσια αφαιρετική απόλυτη — επιρρηματική χρονική μετοχή παθητικού παρακειμένου (collato), δηλώνει το προτερόχρονο ως προς το funeratus est. Το aere είναι το υποκείμενο της μετοχής και δεν έχει άλλο ρόλο στην κύρια. Αναλύεται σε: postquam aes collatum est / cum aes collatum esset." },
    { tag:"Δευτ. πρόταση", title:"cum χρονικό vs cum αιτιολογικό", body:"Και τα δύο cum εκφέρονται με υποτακτική, αλλά διαφέρουν: «cum Poenos in Africa funderet» = χρονικό ιστορικό-διηγηματικό (τονίζει τη βαθύτερη σχέση αιτίου–αιτιατού)· «cum a Carthagine semper tributum ipse exigeret» = αιτιολογικό (η αιτιολογία ως αποτέλεσμα εσωτερικής λογικής διεργασίας). Πρβ. quod, quoniam, quia (αιτιολογικοί με οριστική)." },
    { tag:"Απρόσωπα", title:"placet & aequum est + τελικό απαρέμφατο", body:"Οι απρόσωπες εκφράσεις «placuit» και «aequum erat» παίρνουν ως υποκείμενο τελικό απαρέμφατο (curari, conferre). Στο placet προστίθεται δοτική προσωπική (senatui). Τα υποκείμενα των απαρεμφάτων (id, populum) μπαίνουν σε αιτιατική (ετεροπροσωπία)." },
    { tag:"Αυτοπάθεια", title:"suum vs ab eo (ποιητικό αίτιο)", body:"«mercenarium suum»: suus = άμεση/ευθεία αυτοπάθεια (στο υποκ. Atilius Regulus). Αντίθετα το «ab eo» (is) εκφράζει το ποιητικό αίτιο του desertum esse με εμπρόθετη αφαιρετική (a/ab), επειδή είναι έμψυχο· eo = mercenario (χωρίς αυτοπάθεια)." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση μετοχών σε αντίστοιχες δευτ. προτάσεις", items:[
      { from:"(aere) collato",
        to:["postquam aes collatum est  (postquam + οριστική παρακειμένου)",
            "cum aes collatum esset  (cum + υποτακτική υπερσυντελίκου)"],
        note:"Επιρρηματική χρονική μετοχή παρακειμένου· δηλώνει το προτερόχρονο, γνήσια αφαιρετική απόλυτη. Αναλύεται σε δευτερεύουσα χρονική πρόταση." }
    ]},
    { id:"Β", label:"Μετατροπή δευτ. προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Atilius Regulus, cum … funderet … scripsit",
        to:"Atilius Regulus, … fundens … scripsit",
        note:"Μετατροπή της δευτ. χρονικής πρότασης σε επιρρηματική χρονική μετοχή· συνημμένη στο υποκείμενο Atilius Regulus του ρήματος scripsit της πρότασης στην οποία ανήκει." },
      { from:"id … placuit, quoniam Regulus aberat",
        to:"id … placuit Regulo absente",
        note:"Μετατροπή της δευτ. αιτιολογικής σε επιρρηματική αιτιολογική μετοχή· γνήσια αφαιρετική απόλυτη, γιατί το υποκείμενό της Regulo δεν έχει κανένα άλλο ρόλο στην πρόταση με ρήμα το placuit." },
      { from:"Scipionis filiae … acceperunt, quia nihil illis reliquerat pater",
        to:"Scipionis filiae … acceperunt nullā re illis relictā a patre",
        note:"Μετατροπή της δευτ. αιτιολογικής σε επιρρηματική αιτιολογική μετοχή· γνήσια αφαιρετική απόλυτη («nullā re»). Επίσης το reliquerat γίνεται μετοχή παθ. παρακειμένου (relictā), οπότε η σύνταξη από ενεργητική γίνεται παθητική, γιατί η Λατινική δε διαθέτει ενεργητική μετοχή για το παρελθόν." },
      { from:"Aequum … erat populum Romanum tributum Scipioni conferre, cum … tributum ipse exigeret",
        to:"Aequum … erat populum Romanum tributum Scipioni conferre … tributum ipsum exigentem",
        note:"Μετατροπή της δευτ. χρονικής (εδώ αιτιολογικής-χρονικής) σε επιρρηματική μετοχή· συνημμένη στο υποκείμενο populum του απαρεμφάτου conferre." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Scipionis filiae ex aerario dotem acceperunt, quia nihil illis reliquerat pater",
        to:"A filiis Scipionis ex aerario dos accepta est, quia nihil (ονομ.) illis a patre relictum erat." },
      { from:"Aequum mehercule erat populum Romanum tributum Scipioni conferre",
        to:"Aequum mehercule erat a populo Romano tributum (ονομ.) Scipioni conferri." }
    ]},
    { id:"Δ", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"Menenius Agrippa, … , aere collato funeratus est",
        to:"Romani Menenium Agrippam aere collato funeraverunt." },
      { from:"Atilius Regulus, … scripsit … ab eo desertum esse rus",
        to:"Atilius Regulus, … scripsit eum deseruisse rus (αιτ.)." }
    ]},
    { id:"Ε", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"(ευθύς) Nemo vero eos miseretur, quod infeliciter vixerint",
        to:"Scriptor monet / monuit Romanos ne aliquis eos miseretur / miseraretur, quod … vixerint / vixissent.",
        note:"Εξάρτηση από ρήμα προτρεπτικό (monet/monuit): η κύρια επιθυμίας γίνεται βουλητική (ne + υποτακτική)." },
      { from:"(ευθύς) Menenius Agrippa … funeratus est· Atilius Regulus … scripsit …· id … placuit …· Scipionis filiae … acceperunt …· aequum … erat …",
        to:"Scriptor tradit / tradidit Menenium Agrippam, qui … fuerit / fuisset, … funeratum esse; Atilium Regulum, cum … funderet, … scripsisse mercenarium suum discessisse et ab eo desertum esse rus; id … placuisse, quoniam Regulus abesset; Scipionis filias … accepisse, quia nihil illis reliquisset pater; aequum mehercule fuisse populum Romanum … conferre, cum … ipse exigeret.",
        note:"Εξάρτηση από ρήμα λεκτικό (tradit/tradidit): οι κύριες κρίσης γίνονται ειδικά απαρέμφατα με υποκείμενο σε αιτιατική· τα ρήματα των δευτ. προτάσεων σε υποτακτική." }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"Unum fuisse Homero servum, tres Platoni, nullum Zenoni tradunt",
        to:"Unus fuit Homero servus, tres (ονομ.) Platoni, nullus Zenoni.",
        note:"Το ειδικό απαρέμφατο fuisse γίνεται ρήμα κύριας (fuit)· τα υποκείμενα από αιτιατική σε ονομαστική (unus servus, tres, nullus)." },
      { from:"Atilius Regulus, … ad senatum scripsit mercenarium suum discessisse et ab eo desertum esse rus",
        to:"Mercenarius meus discessit et ab eo desertum est rus (ονομ.).",
        note:"Τα ειδικά απαρέμφατα γίνονται ρήματα κύριων προτάσεων· suum → meus, υποκείμενα σε ονομαστική (mercenarius, rus)." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  //  Λατινική λέξη → ελληνικές ή άλλων ευρωπαϊκών γλωσσών συγγενείς/παράγωγες.
  etymology: [
    { la:"unum", el:"ένας // (γαλλ.) un (= ένας), unique (= μοναδικός), unité (= ενότητα) // (αγγλ.) union (= ένωση) // (ιταλ.) uno (= ένας) // (ισπαν.) uno (= ένας)." },
    { la:"Homēro", el:"Όμηρος, Ομηρικός." },
    { la:"servum", el:"σερβίρω, σερβιτόρος, σερβίτσιο (< ιταλ.) // σέρβις (< αγγλ.), σερβίς (< γαλλ.) // (αγγλ.) servant (= υπηρέτης), serf (= δουλοπάροικος), servile (= δουλικός)." },
    { la:"tres", el:"τρεῖς, τρία· τρίτος // (αγγλ.) triple (= τριπλός) // (γαλλ.) trois (= τρία) // (ιταλ.) tre (= τρία) // (ισπαν.) tres (= τρία)." },
    { la:"Platōni", el:"Πλάτωνας // (αγγλ.) platonic (= πλατωνικός)." },
    { la:"nullum", el:"νούλα [< ιταλ. nulla (= μηδενικό, χωρίς αξία)] // (αγγλ.) annul (= ακυρώνω)." },
    { la:"Zenōni", el:"Ζήνωνας." },
    { la:"tra-dunt [< tra-do], dotem [< do]", el:"δί-δω-μι· δώρημα, δώρο // (γαλλ.) tradition (= παράδοση), donner (= δίνω) // (αγγλ.) traitor (= προδότης), donation (= δωρεά), dowry (= προίκα) // (ιταλ.) dare (= δίνω)." },
    { la:"nemo [< ne + homo]", el:"ουμανισμός (< γαλλ.) // (αγγλ.) human (= ανθρώπινος) // (γαλλ.) homme (= άνθρωπος) // (ισπαν.) hombre (= άνθρωπος)." },
    { la:"miserētur", el:"μιζέρια, μίζερος (< ιταλ.) // (αγγλ.) miser (= τσιγκούνης), miserable (= άθλιος) // (γαλλ.) misérable (= άθλιος)." },
    { la:"in-feliciter, felīces", el:"(γαλλ.) félicité (= ευτυχία), féliciter (= συγχαίρω) // (ιταλ.) felice (= ευτυχισμένος) // (ισπαν.) feliz (= ευτυχισμένος)." },
    { la:"vixerint [< vivo]", el:"βίος // βιταλισμός (< γαλλ. vitalisme), βιταμίνη (< γαλλ.) // (αγγλ.) survive (= επιβιώνω), vivid (= ζωηρός, ζωντανός) // (γαλλ.) vivre (= ζω)." },
    { la:"Menēnius", el:"Μενήνιος." },
    { la:"Agrippa", el:"Αγρίππας." },
    { la:"patres, pater", el:"πατήρ // (γαλλ.) paternel (= πατρικός), père (= πατέρας) // (αγγλ.) patron (= προστάτης, πάτρωνας), paternity (= πατρότητα) // (ιταλ.) padre (= πατέρας)." },
    { la:"plēbem", el:"πίμπλημι / πληθύς· πλέμπα, πληβείος // (αγγλ.) plebeian (= πληβείος, του λαού), plebiscite (= δημοψήφισμα) // (γαλλ.) plébiscite (= δημοψήφισμα)." },
    { la:"publicae, publice", el:"(γαλλ.) publique (= δημόσιος) // ρε-πουμπλικανός // (αγγλ.) public (= δημόσιος), publish (= δημοσιεύω), publication (= δημοσίευση, έκδοση) // (ιταλ.) pubblico (= δημόσιος / κοινό)." },
    { la:"gratiae", el:"(αγγλ.) grateful (= ευγνώμων), grace (= χάρη), gratitude (= ευγνωμοσύνη), gratis (= δωρεάν) // (γαλλ.) con-gratuler (= συγχαίρω), grâce (= χάρη) // (ιταλ.) grazie (= ευχαριστώ) // (ισπαν.) gracias (= ευχαριστώ)." },
    { la:"sequester [< sequor]", el:"ἕπομαι // (αγγλ.) sequent (= ακόλουθος), sequence (= ακολουθία, σειρά), consequence (= συνέπεια), execute (= εκτελώ) // (γαλλ.) seconde (= δευτερόλεπτο), suivre (= ακολουθώ) // σεκόντο (= δεύτερη φωνή) (< ιταλ.)." },
    { la:"funerātus [< funero < funus]", el:"(γαλλ.) funérailles (= κηδεία), (αγγλ.) funeral, funèbre (= πένθιμος, νεκρικός) // (αγγλ.) funereal (= πένθιμος, νεκρώσιμος), funerary (= ταφικός, νεκρικός) // (ιταλ.) funerale (= κηδεία)." },
    { la:"est, esse, ab-erat, erat", el:"εἰμί // (αγγλ.) essence (= ουσία), essential (= ουσιώδης, βασικός), absent (= απών) // (ιταλ.) essere (= είμαι)." },
    { la:"Atilius", el:"Ατίλιος." },
    { la:"Rēgulus", el:"Ρήγουλος." },
    { la:"Poenos", el:"Φοῖνιξ· Φοίνικες // (αγγλ.) Punic (= καρχηδονιακός, φοινικικός) // (γαλλ.) punique (= καρχηδονιακός)." },
    { la:"Africā", el:"Αφρική, Αφρικανός." },
    { la:"funderet", el:"χύνω· (αγγλ.) con-fused (= μπερδεμένος, συγκεχυμένος) // κομφούζιο (< αγγλ. con-fusion) // (αγγλ.) infuse (= εγχέω, εμποτίζω) // (γαλλ.) fondre (= λιώνω, τήκω)." },
    { la:"senātum, senatui", el:"(αγγλ.) senator (= γερουσιαστής), senior (= ηλικιωμένος), senile (= γεροντικός, ξεμωραμένος) // (ιταλ.) signore (= κύριος) // (ισπαν.) señor (= κύριος)." },
    { la:"scripsit [< scribo]", el:"σκάριφος (= όργανο γραφής), σκαρίφημα // (αγγλ.) script (= σενάριο ταινίας), scribe (= γραφέας, αντιγραφέας) // (γαλλ.) écrire (= γράφω) // (ιταλ.) scrivere (= γράφω) // (ισπαν.) escribir (= γράφω)." },
    { la:"mercenārium", el:"(αγγλ.) merchant (= έμπορος), (γαλλ.) marchand, commerce (= εμπόριο) // (γαλλ.) merci (= ευχαριστώ), marché (= αγορά) // (ιταλ.) mercato (= αγορά)." },
    { la:"dis-cessisse [< dis-cedo]", el:"(γαλλ.) récession (= ύφεση, επιβράδυνση), céder (= υποχωρώ, παραχωρώ) // (αγγλ.) cede (= εκχωρώ, παραχωρώ), cease (= παύω, σταματώ)." },
    { la:"desertum [< desero]", el:"(γαλλ.) déserter (= εγκαταλείπω) // (αγγλ.) desert (= έρημος) // (ιταλ.) deserto (= έρημος) // (ισπαν.) desierto (= έρημος)." },
    { la:"rus", el:"ρουστίκ [< (γαλλ.) rustique (= χωριάτικος)] // (γαλλ.) rustre (= αγροίκος, άξεστος) // (αγγλ.) rural (= αγροτικός) // (ιταλ.) rurale (= αγροτικός)." },
    { la:"curāri", el:"κούρα (< ιταλ.) (= φροντίδα) // (αγγλ.) cure (= θεραπεία, ίαση), accurate (= ακριβής), secure (= ασφαλής) // (γαλλ.) sûr (= σίγουρος, ασφαλής)." },
    { la:"placuit", el:"(αγγλ.) placebo (= εικονικό φάρμακο), please (= ευχαριστώ, αρέσω), placid (= ήρεμος, γαλήνιος) // (γαλλ.) plaire (= αρέσω) // (ιταλ.) piacere (= αρέσω, ευχαρίστηση)." },
    { la:"Scipiōnis, Scipiōni", el:"Σκιπίωνας." },
    { la:"accepērunt [< accipio]", el:"(γαλλ.) accepter (= δέχομαι) // (ιταλ.) capire (= καταλαβαίνω) // (αγγλ.) capture (= συλλαμβάνω, αιχμαλωτίζω)." },
    { la:"re-liquerat", el:"λείπω, λοιπός // (γαλλ.) relique (= λείψανο, κειμήλιο) // (αγγλ.) relinquish (= εγκαταλείπω, παραιτούμαι), relic (= λείψανο, κειμήλιο), delinquent (= παραβάτης, εγκληματίας)." },
    { la:"aequum", el:"(αγγλ.) equal (= ίσος), equator (= ισημερινός), equity (= ισότητα, δικαιοσύνη) // (γαλλ.) égal (= ίσος) // (ιταλ.) uguale (= ίσος)." },
    { la:"me-hercule", el:"Ηρακλής // (αγγλ.) herculean (= ηράκλειος, τεράστιος) // (γαλλ.) herculéen (= ηράκλειος, γιγαντιαίος)." },
    { la:"populum, populus", el:"πόπολο, ποπολάρος (< ιταλ.) // (γαλλ.) populaire (= δημοφιλής), peuple (= λαός) // (αγγλ.) people (= λαός), popular (= δημοφιλής), population (= πληθυσμός) // (ισπαν.) pueblo (= χωριό, λαός)." },
    { la:"Rōmānum, Rōmānus", el:"Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός // (αγγλ.) romance (= ιπποτικό αφήγημα, ρομάντζο) // (γαλλ.) roman (= μυθιστόρημα)." },
    { la:"tribūtum [< tribus]", el:"(γαλλ.) con-tribution (= συνεισφορά), con-tribuable (= φορολογούμενος) // (αγγλ.) tribe (= φυλή), tribute (= φόρος υποτέλειας), attribute (= αποδίδω, ιδιότητα), distribute (= διανέμω)." },
    { la:"con-ferre [< con-fero]", el:"φέρω· διαφορά, φορέας, φορείο // (αγγλ.) trans-fer (= μεταφορά), confer (= συσκέπτομαι, απονέμω), refer (= παραπέμπω), prefer (= προτιμώ), offer (= προσφέρω)." },
    { la:"Carthagine", el:"Καρχηδόνα." },
    { la:"semper", el:"(ισπαν.) siempre (= πάντα) // (αγγλ.) sempiternal (= αιώνιος, παντοτινός) // (ιταλ.) sempre (= πάντα)." },
    { la:"exigeret [< ex-ago]", el:"ἄγω // (αγγλ.) exact (= ακριβής), exigent (= επιτακτικός, απαιτητικός) // (γαλλ.) exiger (= απαιτώ)." },
    { la:"viros [< vir]", el:"βιρτουόζος (< ιταλ. virtuoso) // (αγγλ.) virile (= ανδρικός, ανδροπρεπής), virtue (= αρετή), virtual (= εικονικός)." },
    { la:"puellārum (puer)", el:"puerulus → pullus (= μικρό ζώο) → (κατάληξη) -πουλο(ς) // (αγγλ.) puerile (= παιδαριώδης)." },
    { la:"loco", el:"(γαλλ.) locale (= τοπικός), lieu (= τόπος) // (αγγλ.) location (= τοποθεσία), locate (= εντοπίζω, τοποθετώ), allocate (= κατανέμω) // (ισπαν.) lugar (= τόπος, μέρος)." },
    { la:"soceri", el:"ἑκυρός (= πεθερός)." }
  ]
};

export default UNIT;
