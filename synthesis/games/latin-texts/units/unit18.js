export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 18,
  title: "Ο Ηρακλής στην Ιταλία",
  latinTitle: "Lectio XVIII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Hercules", r:"Υποκείμενο", to:"στο dicitur", g:"ονομ. ενικ., αρσ. — ανώμ. ουσ. γ΄ κλ.", d:"Hercules, Herculis / Herculi (αρσ. γ΄) — ο Ηρακλής", note:"Δεν έχει πληθ. αριθμό." },
        { l:"boves", r:"Αντικείμενο", to:"στο adduxisse", g:"αιτ. πληθ., αρσ. — ανώμ. ουσ. γ΄ κλ.", d:"bos, bovis (αρσ. γ΄) — το βόδι", note:"Γεν. πληθ.: bovum & boum· δοτ./αφαιρ. πληθ.: bobus & bubus." },
        { l:"Geryonis", r:"Γενική κτητική", to:"στο boves", g:"γεν. ενικ., αρσ. — ανώμ. ουσ. γ΄ κλ.", d:"Geryon & Geryones, Geryonis — ο Γηρυόνης", note:"Δεν έχει πληθ. αριθμό." },
        { l:"ex Hispania", k:"Hispania", r:"Εμπρόθετος επιρρ. προσδ. του τόπου (αφετηρία / απομάκρυνση)", to:"στο adduxisse", g:"ex (πρόθ. + αφαιρ.) + Hispania (αφαιρ. ενικ.)", d:"ex — από· Hispania, -ae (θηλ. α΄) — η Ισπανία" },
        { l:"in eum locum", k:"locus", r:"Εμπρόθετος επιρρ. προσδ. του τόπου (κατεύθυνση)", to:"στο adduxisse", g:"in (πρόθ. + αιτ.) + locum (αιτ. ενικ.)· eum: επιθετικός προσδ. στο locum", d:"in — σε, προς· locus, -i (αρσ. β΄) — ο τόπος, το μέρος", note:"locus: ετερογενές (πληθ. loci = χωρία βιβλίου, loca = τόποι)." },
        { l:"adduxisse", r:"Αντικείμενο (ειδικό απαρέμφατο)", to:"στο dicitur", g:"απαρέμφατο παρακειμένου ενεργ. φωνής", d:"adduco, adduxi, adductum, adducere (3) — οδηγώ προς, παρασύρω", note:"Υποκείμενο Hercules (ταυτοπροσωπία· άρση λατινισμού λόγω εξάρτησης από παθητικό τύπο λεκτικού ρήματος)." },
        { l:"dicitur", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. παθ. φωνής", d:"dico, dixi, dictum, dicere (3) — λέω", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. ονοματική αναφορική επιθετική προσδιοριστική πρόταση, ως επεξήγηση στο «eum locum» της εξάρτησής της.", kids:[
          { l:"ubi", r:"Επιρρ. προσδ. του τόπου", to:"στο condidit", g:"αναφορικό τοπικό επίρρημα (εισάγει την αναφορική)", d:"ubi — όπου" },
          { l:"postea", r:"Επιρρ. προσδ. του χρόνου", to:"στο condidit", g:"χρονικό επίρρημα", d:"postea — αργότερα, έπειτα" },
          { l:"Romulus", r:"Υποκείμενο", to:"στο condidit", g:"ονομ. ενικ.", d:"Romulus, -i (αρσ. β΄) — ο Ρωμύλος", note:"Δεν έχει πληθ. αριθμό." },
          { l:"urbem", r:"Αντικείμενο", to:"στο condidit", g:"αιτ. ενικ.", d:"urbs, urbis (θηλ. γ΄) — η πόλη", note:"Γεν. πληθ.: urbium." },
          { l:"Romam", r:"Επεξήγηση", to:"στο urbem", g:"αιτ. ενικ.", d:"Roma, -ae (θηλ. α΄) — η Ρώμη", note:"Δεν έχει πληθ. αριθμό." },
          { l:"condidit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"condo, condidi, conditum, condere (3) — χτίζω", a:"." }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Prope Tiberim", k:"Tiberis", r:"Εμπρόθετος επιρρ. προσδ. του τόπου (το εγγύς / πλησίον)", to:"στο refecisse", g:"prope (πρόθ. + αιτ.) + Tiberim (αιτ. ενικ.)", d:"prope — κοντά σε· Tiberis, -is (αρσ. γ΄) — ο Τίβερης", note:"Αιτ. Tiberim, αφαιρ. Tiberi· δεν έχει πληθ. αριθμό." },
        { l:"fluvium", r:"Παράθεση", to:"στο Tiberim", g:"αιτ. ενικ.", d:"fluvius, -ii (αρσ. β΄) — ο ποταμός" },
        { l:"Hercules", r:"Υποκείμενο", to:"στο fertur", g:"ονομ. ενικ., αρσ. — ανώμ. ουσ. γ΄ κλ.", d:"Hercules, Herculis / Herculi (αρσ. γ΄) — ο Ηρακλής" },
        { l:"boves", r:"Αντικείμενο", to:"στο refecisse", g:"αιτ. πληθ., αρσ. — ανώμ. γ΄ κλ.", d:"bos, bovis (αρσ. γ΄) — το βόδι" },
        { l:"refecisse", r:"Αντικείμενο (ειδικό απαρέμφατο)", to:"στο fertur", g:"απαρέμφατο παρακειμένου ενεργ. φωνής", d:"reficio, refeci, refectum, reficere (3, 15 σε -io) — ξεκουράζω", note:"Υποκείμενο Hercules (ταυτοπροσωπία· άρση λατινισμού λόγω εξάρτησης από παθητικό λεκτικό ρήμα)." },
        { l:"fertur", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. παθ. φωνής — ανώμαλο", d:"fero, tuli, latum, ferre — φέρνω· εδώ: fertur = λέγεται" }
      ]},
      { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Εννοούνται το ρήμα fertur και το υποκείμενο Hercules.", kids:[
        { l:"ipse", r:"Κατηγορηματικός προσδ.", to:"στο (εννοούμενο) Hercules", g:"ονομ. ενικ., αρσ. — δεικτική (ως οριστική) αντων.", d:"ipse, ipsa, ipsum — ο ίδιος" },
        { l:"de via", k:"via", r:"Εμπρόθετος επιρρ. προσδ. του εξωτερικού αναγκαστικού αιτίου", to:"στο fessus", g:"de (πρόθ. + αφαιρ.) + via (αφαιρ. ενικ.)", d:"de — από, εξαιτίας· via, -ae (θηλ. α΄) — ο δρόμος" },
        { l:"fessus", r:"Επιρρ. κατηγορούμενο του τρόπου", to:"στο (εννοούμενο) Hercules (μέσω του dormivisse)", g:"ονομ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"fessus, -a, -um — κουρασμένος", note:"Χρησιμοποιήθηκε ως μτχ. παθ. παρακ. του fatiscor / fatisco." },
        { l:"ibi", r:"Επιρρ. προσδ. του τόπου", to:"στο dormivisse", g:"τοπικό επίρρημα", d:"ibi — εκεί" },
        { l:"dormivisse", r:"Αντικείμενο (ειδικό απαρέμφατο)", to:"στο (εννοούμενο) fertur", g:"απαρέμφατο παρακειμένου ενεργ. φωνής", d:"dormio, dormi(v)i, dormitum, dormire (4) — κοιμάμαι", note:"Υποκείμενο Hercules (ταυτοπροσωπία).", a:"." }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Tum", r:"Επιρρ. προσδ. του χρόνου", to:"στο traxit", g:"χρονικό επίρρημα", d:"tum — τότε" },
        { l:"Cacus", r:"Υποκείμενο", to:"στο traxit", g:"ονομ. ενικ.", d:"Cacus, -i (αρσ. β΄) — ο Κάκος", note:"Δεν έχει πληθ. αριθμό." },
        { l:"pastor", r:"Παράθεση", to:"στο Cacus", g:"ονομ. ενικ.", d:"pastor, pastoris (αρσ. γ΄) — ο βοσκός", a:"," },
        { l:"fretus", r:"Επιρρ. κατηγορούμενο του τρόπου", to:"στο Cacus (μέσω του traxit)", g:"ονομ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"fretus, -a, -um — αυτός που έχει εμπιστοσύνη / πεποίθηση" },
        { l:"viribus", r:"Αφαιρετική (οργανική) του μέσου", to:"στο fretus", g:"αφαιρ. πληθ.", d:"vis (θηλ. γ΄) — η δύναμη", note:"Ελλειπτικό: ενικ. vis, vim, vi· πληθ. vires, virium, viribus.", a:"," },
        { l:"boves", r:"Αντικείμενο", to:"στο traxit", g:"αιτ. πληθ., αρσ. — ανώμ. γ΄ κλ.", d:"bos, bovis (αρσ. γ΄) — το βόδι" },
        { l:"quosdam", r:"Επιθετικός προσδ.", to:"στο boves", g:"αιτ. πληθ., αρσ. — αόριστη επιθετική αντων.", d:"quidam, quaedam, quoddam — κάποιος, κάποια, κάποιο" },
        { l:"in speluncam", k:"spelunca", r:"Εμπρόθετος επιρρ. προσδ. του τόπου (κατεύθυνση)", to:"στο traxit", g:"in (πρόθ. + αιτ.) + speluncam (αιτ. ενικ.)", d:"in — σε, προς· spelunca, -ae (θηλ. α΄) — η σπηλιά" },
        { l:"caudis", r:"Αφαιρετική του μέσου", to:"στο traxit", g:"αφαιρ. πληθ.", d:"cauda, -ae (θηλ. α΄) — η ουρά" },
        { l:"traxit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"traho, traxi, tractum, trahere (3) — σύρω, τραβώ" },
        { l:"aversos", r:"Επιρρ. χρονική μετοχή", to:"στο traxit", g:"αιτ. πληθ., αρσ. — μτχ. παρακ. παθ. φωνής", d:"averto, averti, aversum, avertere (3) — γυρίζω ανάποδα", note:"Υποκείμενο boves (συνημμένη).", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Εννοούμενο υποκείμενο: Hercules. Οι χρονικές (Ubi … aspexit / … sensit) λειτουργούν ως επιρρ. προσδ. του χρόνου στο pergit.", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική, ως επιρρ. προσδ. του χρόνου στο pergit. Εισάγεται με τον χρονικό σύνδεσμο ubi και εκφέρεται με οριστική, γιατί δηλώνει κάτι το πραγματικό.", kids:[
          { l:"Ubi", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (+ οριστική)", d:"ubi — μόλις, όταν" },
          { l:"Hercules", r:"Υποκείμενο", to:"στο aspexit", g:"ονομ. ενικ., αρσ. — ανώμ. γ΄ κλ.", d:"Hercules, Herculis / Herculi (αρσ. γ΄) — ο Ηρακλής", a:"," },
          { l:"e somno", k:"somnus", r:"Εμπρόθετος επιρρ. προσδ. (έξοδος από κατάσταση)", to:"στο excitatus", g:"e(x) (πρόθ. + αφαιρ.) + somno (αφαιρ. ενικ.)", d:"e / ex — από· somnus, -i (αρσ. β΄) — ο ύπνος" },
          { l:"excitatus", r:"Επιρρ. χρονική μετοχή", to:"στο aspexit", g:"ονομ. ενικ., αρσ. — μτχ. παρακ. παθ. φωνής", d:"excito, excitavi, excitatum, excitare (1) — σηκώνω· excitor e somno = ξυπνώ", note:"Υποκείμενο Hercules (συνημμένη).", a:"," },
          { l:"gregem", r:"Αντικείμενο", to:"στο aspexit", g:"αιτ. ενικ.", d:"grex, gregis (αρσ. γ΄) — το κοπάδι" },
          { l:"aspexit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"aspicio, aspexi, aspectum, aspicere (3, 15 σε -io) — κοιτάζω, βλέπω" }
        ]},
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός (παρατακτικός) σύνδεσμος", d:"et — και", conn:true },
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική, ως επιρρ. προσδ. του χρόνου στο pergit. Εισάγεται (εννοείται) με τον ubi — συνδέεται παρατακτικά με την προηγούμενη — και εκφέρεται με οριστική, γιατί δηλώνει κάτι το πραγματικό.", kids:[
          { l:"partem", r:"Υποκείμενο απαρεμφάτου", to:"στο abesse", g:"αιτ. ενικ.", d:"pars, partis (θηλ. γ΄) — το μέρος, το τμήμα" },
          { l:"abesse", r:"Αντικείμενο (ειδικό απαρέμφατο)", to:"στο sensit", g:"απαρέμφατο ενεστώτα", d:"absum, afui, —, abesse — απουσιάζω, λείπω", note:"Υποκείμενο partem (ετεροπροσωπία)." },
          { l:"sensit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"sentio, sensi, sensum, sentire (4) — αισθάνομαι, αντιλαμβάνομαι", note:"Εννοούμενο υποκείμενο: Hercules.", a:"," }
        ]},
        { l:"pergit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"pergo, perrexi, perrectum, pergere (3) — κατευθύνομαι", note:"Εννοούμενο υποκείμενο: Hercules." },
        { l:"ad proximam speluncam", k:"spelunca", r:"Εμπρόθετος επιρρ. προσδ. του τόπου (κατεύθυνση)", to:"στο pergit", g:"ad (πρόθ. + αιτ.) + speluncam (αιτ. ενικ.)· proximam: επιθετικός προσδ.", d:"ad — σε, προς· spelunca, -ae (θηλ. α΄) — η σπηλιά· proximus, -a, -um — (πάρα) πολύ κοντινός", a:";" }
      ]}
    ]},

    { n: 5, kids: [
      { l:"sed", r:"Σύνδεσμος", g:"αντιθετικός (παρατακτικός) σύνδεσμος", d:"sed — αλλά", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", note:"Εννοούμενο υποκείμενο: Hercules.", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική, ως επιρρ. προσδ. του χρόνου στο coepit. Εισάγεται με τον χρονικό σύνδεσμο postquam και εκφέρεται με οριστική, γιατί δηλώνει κάτι το πραγματικό (προτερόχρονο).", kids:[
          { l:"postquam", r:"Χρον. σύνδεσμος", g:"χρονικός σύνδεσμος (+ οριστική) — προτερόχρονο", d:"postquam — αφού" },
          { l:"vestigia", r:"Αντικείμενο", to:"στο vidit", g:"αιτ. πληθ., ουδ.", d:"vestigium, -ii / -i (ουδ. β΄) — το ίχνος" },
          { l:"boum", r:"Γενική κτητική", to:"στο vestigia", g:"γεν. πληθ., αρσ. — ανώμ. γ΄ κλ.", d:"bos, bovis (αρσ. γ΄) — το βόδι" },
          { l:"foras", r:"Επιρρ. προσδ. του τόπου (κατεύθυνση)", to:"στο versa", g:"τοπικό επίρρημα", d:"foras — προς τα έξω" },
          { l:"versa", r:"Κατηγορηματικός προσδ.", to:"στο vestigia", g:"αιτ. πληθ., ουδ. — μτχ. παρακ. παθ. φωνής", d:"verto, verti, versum, vertere (3) — στρέφω" },
          { l:"vidit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής", d:"video, vidi, visum, videre (2) — βλέπω", note:"Εννοούμενο υποκείμενο: Hercules.", a:"," }
        ]},
        { l:"confusus", r:"Επιρρ. αιτιολογική μετοχή", to:"στο coepit", g:"ονομ. ενικ., αρσ. — μτχ. παρακ. παθ. φωνής", d:"confundo, confudi, confusum, confundere (3) — συγχέω, μπερδεύω", note:"Υποκείμενο (ενν.) Hercules (συνημμένη), ως επιρρ. προσδ. της αιτίας." },
        { l:"gregem", r:"Αντικείμενο", to:"στο amovere", g:"αιτ. ενικ.", d:"grex, gregis (αρσ. γ΄) — το κοπάδι" },
        { l:"ex infesto loco", k:"locus", r:"Εμπρόθετος επιρρ. προσδ. του τόπου (απομάκρυνση από το εγγύς)", to:"στο amovere", g:"ex (πρόθ. + αφαιρ.) + loco (αφαιρ. ενικ.)· infesto: επιθετικός προσδ.", d:"ex — από· locus, -i (αρσ. β΄) — ο τόπος· infestus, -a, -um — εχθρικός" },
        { l:"amovere", r:"Αντικείμενο (τελικό απαρέμφατο)", to:"στο coepit", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"amoveo, amovi, amotum, amovere (2) — απομακρύνω", note:"Υποκείμενο Hercules (ταυτοπροσωπία)." },
        { l:"coepit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής — ελλειπτικό", d:"coepi, coepisse — άρχισα", note:"Εννοούμενο υποκείμενο: Hercules.", a:"." }
      ]}
    ]},

    { n: 6, kids: [
      { l:"Sed", r:"Σύνδεσμος", g:"αντιθετικός (παρατακτικός) σύνδεσμος", d:"sed — αλλά", conn:true },
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"bovum", r:"Γενική υποκειμενική", to:"στο mugitus", g:"γεν. πληθ., αρσ. — ανώμ. γ΄ κλ.", d:"bos, bovis (αρσ. γ΄) — το βόδι" },
        { l:"mugitus", r:"Υποκείμενο", to:"στο convertit", g:"ονομ. ενικ.", d:"mugitus, -us (αρσ. δ΄) — το μουγκρητό" },
        { l:"ex spelunca", k:"spelunca", r:"Εμπρόθετος επιρρ. προσδ. της προέλευσης", to:"στο auditus", g:"ex (πρόθ. + αφαιρ.) + spelunca (αφαιρ. ενικ.)", d:"ex — από· spelunca, -ae (θηλ. α΄) — η σπηλιά" },
        { l:"auditus", r:"Επιθετική μετοχή", to:"στο mugitus", g:"ονομ. ενικ., αρσ. — μτχ. παρακ. παθ. φωνής", d:"audio, audi(v)i, auditum, audire (4) — ακούω", note:"Υποκείμενο mugitus· ως επιθετικός προσδ. στο mugitus." },
        { l:"Herculem", r:"Αντικείμενο", to:"στο convertit", g:"αιτ. ενικ., αρσ. — ανώμ. γ΄ κλ.", d:"Hercules, Herculis / Herculi (αρσ. γ΄) — ο Ηρακλής" },
        { l:"convertit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"converto, converti, conversum, convertere (3) — γυρίζω / στρέφω κάποιον προς τα πίσω", note:"Ενεστ. convertit (ομόγραφο με τον παρακ.).", a:"." }
      ]}
    ]},

    { n: 7, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Tum", r:"Επιρρ. προσδ. του χρόνου", to:"στο interficitur", g:"χρονικό επίρρημα", d:"tum — τότε" },
        { l:"Cacus", r:"Υποκείμενο", to:"στο interficitur", g:"ονομ. ενικ.", d:"Cacus, -i (αρσ. β΄) — ο Κάκος", a:"," },
        { l:"vi", r:"Αφαιρετική του τρόπου", to:"στο prohibere", g:"αφαιρ. ενικ.", d:"vis (θηλ. γ΄) — η δύναμη· εδώ: η βία" },
        { l:"prohibere", r:"Αντικείμενο (τελικό απαρέμφατο)", to:"στο conatus", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"prohibeo, prohibui, prohibitum, prohibere (2) — εμποδίζω", note:"Υποκείμενο Cacus (ταυτοπροσωπία)." },
        { l:"eum", r:"Αντικείμενο", to:"στο prohibere", g:"αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.", d:"is, ea, id — αυτός, αυτή, αυτό" },
        { l:"conatus", r:"Επιρρ. χρονική μετοχή", to:"στο interficitur", g:"ονομ. ενικ., αρσ. — μτχ. παρακ. (αποθ. ρήμα)", d:"conor, conatus sum, conari (1, αποθ.) — προσπαθώ", note:"Υποκείμενο Cacus (συνημμένη).", a:"," },
        { l:"Herculis", r:"Γενική κτητική", to:"στο clava", g:"γεν. ενικ., αρσ. — ανώμ. γ΄ κλ.", d:"Hercules, Herculis / Herculi (αρσ. γ΄) — ο Ηρακλής" },
        { l:"clava", r:"Αφαιρετική του οργάνου", to:"στο interficitur", g:"αφαιρ. ενικ.", d:"clava, -ae (θηλ. α΄) — το ρόπαλο" },
        { l:"interficitur", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. παθ. φωνής", d:"interficio, interfeci, interfectum, interficere (3, 15 σε -io) — σκοτώνω", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Hercules boves Geryonis ex Hispania in eum locum adduxisse dicitur, ubi postea Romulus urbem Romam condidit.", el:"Ο Ηρακλής λέγεται ότι οδήγησε τα βόδια του Γηρυόνη από την Ισπανία σε αυτόν τον τόπο, όπου αργότερα ο Ρωμύλος έχτισε την πόλη Ρώμη." },
    { n:2, la:"Prope Tiberim fluvium Hercules boves refecisse fertur et ipse de via fessus ibi dormivisse.", el:"Κοντά στον Τίβερη ποταμό ο Ηρακλής λέγεται ότι ξεκούρασε τα βόδια και ο ίδιος κουρασμένος από τον δρόμο κοιμήθηκε εκεί." },
    { n:3, la:"Tum Cacus pastor, fretus viribus, boves quosdam in speluncam caudis traxit aversos.", el:"Τότε ο Κάκος ο βοσκός, έχοντας εμπιστοσύνη στις δυνάμεις του, τράβηξε από τις ουρές μερικά βόδια σε μια σπηλιά γυρισμένα ανάποδα." },
    { n:4, la:"Ubi Hercules, e somno excitatus, gregem aspexit et partem abesse sensit, pergit ad proximam speluncam;", el:"Μόλις ο Ηρακλής, αφού σηκώθηκε από τον ύπνο, κοίταξε το κοπάδι και κατάλαβε ότι έλειπε ένα μέρος, κατευθύνεται στην κοντινότερη σπηλιά·" },
    { n:5, la:"sed postquam vestigia boum foras versa vidit, confusus gregem ex infesto loco amovere coepit.", el:"αλλά, αφού είδε τα ίχνη των βοδιών στραμμένα προς τα έξω, μπερδεμένος άρχισε να απομακρύνει το κοπάδι από τον εχθρικό τόπο." },
    { n:6, la:"Sed bovum mugitus ex spelunca auditus Herculem convertit.", el:"Αλλά το μουγκρητό των βοδιών που ακούστηκε από τη σπηλιά γύρισε πίσω τον Ηρακλή." },
    { n:7, la:"Tum Cacus, vi prohibere eum conatus, Herculis clava interficitur.", el:"Τότε ο Κάκος, ενώ προσπαθούσε να τον εμποδίσει με τη βία, σκοτώνεται από το ρόπαλο του Ηρακλή." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"cauda, -ae" },
        { form:"clava, -ae" },
        { form:"Hispania, -ae", note:"μόνο ενικ." },
        { form:"Roma, -ae", note:"μόνο ενικ." },
        { form:"spelunca, -ae" },
        { form:"via, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Cacus, -i", note:"μόνο ενικ." },
        { form:"fluvius, -ii" },
        { form:"locus, -i", note:"ετερογενές (πληθ. loci = χωρία βιβλίου, loca = τόποι)" },
        { form:"Romulus, -i", note:"μόνο ενικ." },
        { form:"somnus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"vestigium, -ii / -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"bos, bovis", note:"ανώμαλο· γεν. πληθ. bovum & boum, δοτ./αφαιρ. πληθ. bobus & bubus" },
        { form:"Geryon, Geryonis", note:"& Geryones, Geryonae· μόνο ενικ." },
        { form:"grex, gregis" },
        { form:"Hercules, -is / -i", note:"ανώμαλο· μόνο ενικ." },
        { form:"pastor, pastoris" },
        { form:"Tiberis, -is", note:"αιτ. Tiberim, αφαιρ. Tiberi· μόνο ενικ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"pars, partis", note:"γεν. πληθ. partium· partes, -ium = παράταξη (ετερόσημο)" },
        { form:"urbs, urbis", note:"γεν. πληθ. urbium" },
        { form:"vis", note:"ελλειπτικό· ενικ. vis, vim, vi· πληθ. vires, virium, viribus" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"corpus, corporis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"mugitus, -us" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"aversus, -a, -um", note:"μτχ. παρακ. ως επίθετο" },
      { form:"conatus, -a, -um", note:"μτχ. παρακ. ως επίθετο" },
      { form:"confusus, -a, -um", note:"μτχ. παρακ. ως επίθετο" },
      { form:"excitatus, -a, -um", note:"μτχ. παρακ. ως επίθετο" },
      { form:"fessus, -a, -um" },
      { form:"fretus, -a, -um" },
      { form:"infestus, -a, -um" },
      { form:"prope", note:"επίρρ./πρόθ. με παραθετικά (propior, proximus)" },
      { form:"versus, -a, -um", note:"μτχ. παρακ. ως επίθετο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"aversus, -a, -um", comp:"—", sup:"—" },
      { pos:"conatus, -a, -um", comp:"—", sup:"—" },
      { pos:"confusus, -a, -um", comp:"—", sup:"—" },
      { pos:"excitatus, -a, -um", comp:"—", sup:"—" },
      { pos:"fessus, -a, -um", comp:"—", sup:"—" },
      { pos:"fretus, -a, -um", comp:"—", sup:"—" },
      { pos:"infestus, -a, -um", comp:"infestior, -ior, -ius", sup:"infestissimus, -a, -um" },
      { pos:"prope", comp:"propior, -ior, -ius", sup:"proximus, -a, -um", note:"επίρρ./πρόθ." },
      { pos:"versus, -a, -um", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική (eum)" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική", extra:"ως οριστική" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική (quosdam)" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"conor", perf:"conatus sum", sup:"—", inf:"conari", note:"αποθετικό" },
      { pres:"excito", perf:"excitavi", sup:"excitatum", inf:"excitare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"amoveo", perf:"amovi", sup:"amotum", inf:"amovere", note:"" },
      { pres:"prohibeo", perf:"prohibui", sup:"prohibitum", inf:"prohibere", note:"" },
      { pres:"video", perf:"vidi", sup:"visum", inf:"videre", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"adduco", perf:"adduxi", sup:"adductum", inf:"adducere", note:"" },
      { pres:"aspicio", perf:"aspexi", sup:"aspectum", inf:"aspicere", note:"15 σε -io" },
      { pres:"coepi", perf:"—", sup:"—", inf:"coepisse", note:"ελλειπτικό (μόνο χρόνοι παρακ.)" },
      { pres:"condo", perf:"condidi", sup:"conditum", inf:"condere", note:"" },
      { pres:"confundo", perf:"confudi", sup:"confusum", inf:"confundere", note:"" },
      { pres:"converto", perf:"converti", sup:"conversum", inf:"convertere", note:"" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"" },
      { pres:"fatiscor", perf:"—", sup:"—", inf:"fatisci", note:"αποθετικό" },
      { pres:"interficio", perf:"interfeci", sup:"interfectum", inf:"interficere", note:"15 σε -io" },
      { pres:"pergo", perf:"perrexi", sup:"perrectum", inf:"pergere", note:"" },
      { pres:"reficio", perf:"refeci", sup:"refectum", inf:"reficere", note:"15 σε -io" },
      { pres:"traho", perf:"traxi", sup:"tractum", inf:"trahere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"audio", perf:"audi(v)i", sup:"auditum", inf:"audire", note:"" },
      { pres:"dormio", perf:"dormi(v)i", sup:"dormitum", inf:"dormire", note:"" },
      { pres:"sentio", perf:"sensi", sup:"sensum", inf:"sentire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"absum", perf:"afui", sup:"—", inf:"abesse", note:"σύνθετο του sum" },
      { pres:"fero", perf:"tuli", sup:"latum", inf:"ferre", note:"ανώμαλο· fertur = λέγεται" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"dicitur / fertur = λέγεται (προσωπική σύνταξη)", body:"Τα παθητικά λεκτικά dicitur και fertur εκφέρονται προσωπικά· τα ειδικά απαρέμφατα adduxisse, refecisse, dormivisse έχουν υποκείμενο Hercules (ταυτοπροσωπία — άρση λατινισμού, λόγω εξάρτησης από παθητικό τύπο λεκτικού ρήματος)." },
    { tag:"Ουσιαστικό", title:"bos, bovis: ανώμαλο", body:"Γεν. πληθ.: bovum & boum (και οι δύο τύποι στο κείμενο)· δοτ./αφαιρ. πληθ.: bobus & bubus." },
    { tag:"Ουσιαστικό", title:"vis: ελλειπτικό", body:"Ενικός: vis, —, —, vim, —, vi (viribus = αφαιρ. πληθ.)· πληθ.: vires, virium, viribus, vires, vires, viribus." },
    { tag:"Πρόθεση", title:"e / ex", body:"Η ex αποβάλλει το x πριν από σύμφωνο (e somno) και το διατηρεί πριν από φωνήεν ή h (ex Hispania, ex infesto, ex spelunca)." },
    { tag:"Προσδιορισμός", title:"Επιρρ. κατηγορούμενα του τρόπου", body:"fessus (στο ενν. Hercules μέσω dormivisse) και fretus (στο Cacus μέσω traxit) είναι επιρρηματικά κατηγορούμενα του τρόπου, όχι απλοί επιθετικοί προσδιορισμοί." },
    { tag:"Μετοχές", title:"Ποικιλία μετοχών", body:"excitatus / aversos / conatus = χρονικές· confusus = αιτιολογική· auditus = επιθετική· versa = κατηγορηματικός προσδ. Το conatus προέρχεται από αποθετικό ρήμα, άρα έχει ενεργητική σημασία." }
  ],
  transforms: [
    { id:"Α", label:"Μετατροπή ενεργητικής σύνταξης σε παθητική", items:[
      { from:"... postea Romulus urbem Romam condidit", to:"postea a Romulo urbs Roma condidita est." },
      { from:"Tum Cacus pastor, fretus viribus, boves quosdam in speluncam caudis traxit aversos", to:"Tum a Caco pastore, freto viribus, boves quidam in speluncam caudis tracti sunt aversi." },
      { from:"... Hercules, e somno excitatus, gregem aspexit...", to:"ab Hercule, e somno excitato, grex aspectus est..." },
      { from:"... (Hercules) boum vestigia foras versa vidit...", to:"(ab Hercule) boum vestigia foras versa visa sunt..." },
      { from:"(Hercules) confusus gregem ex loco infesto amovere coepit", to:"(ab Hercule) confuso grex ex loco infesto amoveri coeptus est." },
      { from:"Sed bovum mugitus ex spelunca auditus Herculem convertit", to:"Sed bovum mugitu ex spelunca audito Hercules conversus est." }
    ]},
    { id:"Β", label:"Μετατροπή παθητικής σύνταξης σε ενεργητική", items:[
      { from:"Hercules boves Geryonis ex Hispania in eum locum adduxisse dicitur", to:"Herculem boves Geryonis ex Hispania in eum locum adduxisse dicunt." },
      { from:"Prope Tiberim fluvium Hercules boves refecisse fertur et ipse de via fessus ibi dormivisse", to:"Prope Tiberim fluvium Herculem boves refecisse ferunt et ipsum de via fessum ibi dormivisse." },
      { from:"Tum Cacus, vi prohibere eum conatus, Herculis clava interficitur", to:"Tum Cacum, vi prohibere eum conatum, Hercules clava interficit." }
    ]},
    { id:"Γ", label:"Μετατροπή σε απαρεμφατική σύνταξη με εξάρτηση από «Titus Livius narrat»", items:[
      { from:"Hercules boves Geryonis ex Hispania in eum locum adduxisse dicitur, ubi postea Romulus urbem Romam condidit", to:"Titus Livius narrat Herculem boves Geryonis ex Hispania in eum locum adduxisse dici." },
      { from:"Prope Tiberim fluvium Hercules boves refecisse fertur et ipse de via fessus ibi dormivisse", to:"Titus Livius narrat prope Tiberim fluvium Herculem boves refecisse ferri et ipsum de via fessum ibi dormivisse." },
      { from:"Tum Cacus pastor, fretus viribus, boves quosdam in speluncam caudis traxit aversos", to:"Titus Livius narrat tum Cacum pastorem, fretum viribus, boves quosdam in speluncam caudis traxisse aversos." },
      { from:"... (Hercules) pergit ad proximam speluncam", to:"Titus Livius narrat (Herculem) pergere ad proximam speluncam.", note:"printed 'proximan' (typo) in both source clause and result on p.172; normalized to 'proximam'" },
      { from:"... (Hercules) confusus gregem ex loco infesto amovere coepit", to:"Titus Livius narrat (Herculem) confusum gregem ex loco infesto amovere coepisse." },
      { from:"... bovum mugitus ex spelunca auditus Herculem convertit", to:"Titus Livius narrat bovum mugitum ex spelunca auditum Herculem convertisse." },
      { from:"Tum Cacus, vi prohibere eum conatus, Herculis clava interficitur", to:"Titus Livius narrat tum Cacum, vi prohibere eum conatum, Herculis clava interfici." }
    ]}
  ],
  etymology: [
    { la:"Hercules, Herculem, Herculis", el:"Ηρακλής // (αγγλ.) herculean (= ηράκλειος, τιτάνιος, πελώριος)." },
    { la:"boves, boum, bovum", el:"βοῦς / βόδι // (αγγλ.) bovine (= βοοειδής), beef (= βοδινό κρέας) // (γαλλ.) bœuf (= βόδι, βοδινό) // (ισπαν.) buey (= βόδι)." },
    { la:"Geryonis", el:"Γηρυόνης." },
    { la:"Hispania", el:"Ισπανία // (αγγλ.) spaniel (= σπάνιελ (ράτσα σκύλου)) // (γαλλ.) Espagne (= Ισπανία) // (ισπαν.) España (= Ισπανία)." },
    { la:"locum, loco", el:"(αγγλ.) location (= τοποθεσία), local (= τοπικός) // (γαλλ.) lieu (= τόπος (π.χ. au lieu de = αντί)) // (ιταλ.) luogo (= τόπος)." },
    { la:"adduxisse", el:"(αγγλ.) adductor (= προσαγωγός μυς), adduce (= παραθέτω, επικαλούμαι (ως απόδειξη)), conduct (= διεξάγω / συμπεριφορά), produce (= παράγω)." },
    { la:"dicitur", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση) // (αγγλ.) dictator (= δικτάτορας), predict (= προβλέπω)." },
    { la:"Romulus, Romam", el:"Ρωμύλος, Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός // (αγγλ.) romance (= ρομάντζο, ιπποτική αφήγηση) // (γαλλ.) roman (= μυθιστόρημα)." },
    { la:"urbem", el:"(γαλλ.) urbain (= αστικός) // (αγγλ.) urban (= αστικός), suburb (= προάστιο)." },
    { la:"Tiberim", el:"Τίβερης." },
    { la:"fluvium", el:"φλέω (= είμαι κατάμεστος), φλύω (= αναβράζω), φλοῖσβος (= ήχος κυμμάτων) // (γερμ.) fluss (= ποτάμι) // (αγγλ.) fluid (= ρευστό, υγρό), fluent (= ευφράδης, που ρέει), influence (= επιρροή) // (γαλλ.) fleuve (= ποτάμι (μεγάλο, που χύνεται στη θάλασσα))." },
    { la:"re-fecisse, inter-ficitur", el:"(αγγλ.) facts (= γεγονότα), effect (= αποτέλεσμα, επίδραση) // (γαλλ.) faire (= κάνω) // (ισπαν.) hacer (= κάνω)." },
    { la:"fertur", el:"φέρω // (αγγλ.) transfer (= μεταφορά), fertile (= εύφορος, γόνιμος), refer (= αναφέρομαι, παραπέμπω), confer (= απονέμω / συσκέπτομαι)." },
    { la:"fessus (fatiscor)", el:"(γαλλ.) fatigué (= κουρασμένος) // (αγγλ.) indefatigable (= ακούραστος)." },
    { la:"dormivisse", el:"(γαλλ.) dormir (= κοιμάμαι) // (αγγλ.) dormant (= σε λήθαργο, αδρανής), dormitory (= κοιτώνας, υπνωτήριο)." },
    { la:"Cacus", el:"Κάκος." },
    { la:"pastor", el:"πάστορας // (αγγλ.) pasture (= βοσκότοπος, βοσκή), pastoral (= ποιμενικός, βουκολικός) // (ιταλ.) pastore (= βοσκός, ποιμένας)." },
    { la:"viribus, vi", el:"(Ϝις) ἴς (= δύναμη) // (αγγλ.) vim (= σφρίγος, ζωτικότητα, ορμή)." },
    { la:"speluncam, spelunca", el:"σπήλυγξ (= σπήλαιον) // (αγγλ.) spelunker (spelunking) (= εξερευνητής σπηλαίων / σπηλαιοεξερεύνηση) // (ιταλ.) spelonca (= σπηλιά, άντρο)." },
    { la:"caudis", el:"(αγγλ.) caudal (= ο της ουράς, ουραίος), coward (= δειλός) // (γαλλ.) queue (= ουρά) // (ιταλ.) coda (= ουρά· μουσική κατακλείδα)." },
    { la:"traxit", el:"(αγγλ.) extraction (= εξαγωγή), τρακτέρ (< γαλλ.), attraction (= έλξη), contract (= συμβόλαιο)." },
    { la:"aversos, versa, convertit", el:"(verso) βέρσο (= πίσω μέρος σελίδας), ρεβέρ (< γαλλ.), v.s. (= εναντίον) // (αγγλ.) version (= εκδοχή, μετάφραση), reverse (= αντιστροφή, αντίστροφος), universe (= σύμπαν)." },
    { la:"somno", el:"ὕπνος // (αγγλ.) insomnia (= αϋπνία), somnolent (= νυσταλέος, υπναλέος), somnambulism (= υπνοβασία)." },
    { la:"excitatus", el:"(γαλλ.) inciter (= υποκινώ) // (αγγλ.) excite (= διεγείρω, ενθουσιάζω), recite (= απαγγέλλω)." },
    { la:"gregem", el:"ἀ-γείρω (= συγκεντρώνω) // (αγγλ.) gregarious (= κοινωνικός, αγελαίος), congregation (= εκκλησίασμα, σύναξη), segregate (= διαχωρίζω)." },
    { la:"aspexit", el:"(αγγλ.) pro-spect (= προοπτική, άποψη), aspect (= όψη, άποψη), spectacle (= θέαμα), inspect (= επιθεωρώ), aspect (= όψη, πλευρά), inspect (= επιθεωρώ, εξετάζω) // σπέκουλα (= κερδοσκοπία), σπεκουλαδόρος, σπεκουλάρω (< ιταλ.)." },
    { la:"partem", el:"πάρτη, παρτίδα // (γαλλ.) partie // (αγγλ.) particle (= σωματίδιο, μόριο), partition (= διαχωρισμός, διαμέρισμα), particular (= ιδιαίτερος, επιμέρους)." },
    { la:"ab-esse (es-)", el:"εἰμί // (αγγλ.) absent (= απών), essence (= ουσία)." },
    { la:"sensit", el:"(γαλλ.) sentir (= αισθάνομαι, νιώθω), sensible (= ευαίσθητος) // (αγγλ.) sense (= αίσθηση, έννοια), sentiment (= συναίσθημα), consent (= συναίνεση, συγκατάθεση)." },
    { la:"vestigia", el:"(αγγλ.) vestige (= ίχνος), in-vestigation (= έρευνα, εξέταση)." },
    { la:"foras", el:"θύρα // (αγγλ.) foreign (= ξένος, αλλοδαπός)." },
    { la:"vidit", el:"(Ϝιδεῖν) ιδέα, βίντεο [< αγγλ. video] // (αγγλ.) vision (= όραση, όραμα), visible (= ορατός), visit (= επίσκεψη, επισκέπτομαι)." },
    { la:"confusus", el:"(αγγλ.) confused (= μπερδεμένος, συγκεχυμένος), confusion (= σύγχυση), confound (= συγχέω, μπερδεύω)." },
    { la:"infesto", el:"(γαλλ.) infester (= λυμαίνομαι)." },
    { la:"amovere", el:"(αγγλ.) move (= κινούμαι), motion (= κίνηση), mobile (= κινητός), emotion (= συγκίνηση) // μοτέρ (< γαλλ.) // μοτίβο (= επαναλαμβανόμενο στοιχείο μουσικού θέματος) [< ιταλ. motivo (= κίνητρο)]." },
    { la:"mugitus", el:"μυκάομαι -ῶμαι (= μουγκανίζω, μουγκρίζω), μυκηθμός (= μουγκανητό, μούγκρισμα)." },
    { la:"auditus", el:"ἀΐω // (αγγλ.) audio (= ακουστικός, ήχος), audience (= ακροατήριο, κοινό), audit (= (οικονομικός) έλεγχος), obey (= υπακούω)." },
    { la:"pro-hibere", el:"(γερμ.) haben, (αγγλ.) have." }
  ]
};

export default UNIT;
