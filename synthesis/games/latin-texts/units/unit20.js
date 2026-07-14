// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 20
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 20,
  title: "Πίσω από τις κουρτίνες ή πώς ο Κλαύδιος έγινε αυτοκράτορας",
  latinTitle: "Lectio XX",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Claudius', r:'Υποκείμενο', to:'στο cepit', g:'ονομ. ενικ., αρσ.', d:'Claudius, Claudii/Claudi (αρσ. β΄) — ο Κλαύδιος (κλητ. Claudi)' },
        { l:'quinquagesimo', r:'Επιθετικός προσδ.', to:'στο anno', g:'αφαιρ. ενικ., αρσ. — τακτικό αριθμ. επίθ. β΄ κλ.', d:'quinquagesimus, -a, -um — πεντηκοστός' },
        { l:'anno', r:'Αφαιρετική του χρόνου', to:'στο cepit', g:'αφαιρ. ενικ.', d:'annus, -i (αρσ. β΄) — ο χρόνος, το έτος' },
        { l:'aetatis', r:'Γενική διαιρετική', to:'στο anno', g:'γεν. ενικ.', d:'aetas, aetatis (θηλ. γ΄) — η ηλικία' },
        { l:'suae', r:'Επιθετικός προσδ.', to:'στο aetatis', g:'γεν. ενικ., θηλ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)', d:'suus, sua, suum — δικός του', note:'Εκφράζει πλάγια (έμμεση) αυτοπάθεια.' },
        { l:'imperium', r:'Αντικείμενο', to:'στο cepit', g:'αιτ. ενικ., ουδ.', d:'imperium, imperii/imperi (ουδ. β΄) — η εξουσία' },
        { l:'cepit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'capio, cepi, captum, capere (3, 15 σε -io) — πιάνω· εδώ: καταλαμβάνω' },
        { l:'mirabili', r:'Επιθετικός προσδ.', to:'στο casu', g:'αφαιρ. ενικ., αρσ. — επίθ. γ΄ κλ.', d:'mirabilis, -is, -e — παράδοξος' },
        { l:'quodam', r:'Επιθετικός προσδ.', to:'στη φράση mirabili casu', g:'αφαιρ. ενικ., αρσ. — αόριστη επιθετική αντων.', d:'quidam, quaedam, quoddam — κάποιος, κάποια, κάποιο', note:'Επάλληλος επιθετικός προσδιορισμός.' },
        { l:'casu', r:'Αφαιρετική του τρόπου', to:'στο cepit', g:'αφαιρ. ενικ.', d:'casus, casus (αρσ. δ΄) — το τυχαίο γεγονός', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Exclusus', r:'Χρονική μετοχή', to:'συνημμένη στο (εννοούμενο) Claudius', g:'ονομ. ενικ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'excludo, exclusi, exclusum, excludere (3) — αποκλείω, διώχνω' },
        { l:'ab insidiatoribus', k:'insidiator', r:'Εμπρόθετος προσδ. του ποιητικού αιτίου', to:'στη μτχ. exclusus', g:'ab (πρόθ. + αφαιρ.) + insidiatoribus (αφαιρ. πληθ.)', d:'ab — από· insidiator, insidiatoris (αρσ. γ΄) — ο συνωμότης, ο δολοφόνος' },
        { l:'Caligulae', r:'Γενική αντικειμενική', to:'στο insidiatoribus', g:'γεν. ενικ.', d:'Caligula, Caligulae (αρσ. α΄) — ο Καλιγούλας', a:',' },
        { l:'recesserat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. υπερσυντελίκου ενεργ. φωνής', d:'recedo, recessi, recessum, recedere (3) — αποσύρομαι', note:'Εννοούμενο υποκείμενο: Claudius.' },
        { l:'in diaetam', k:'diaeta', r:'Εμπρόθετος προσδ. της κίνησης σε τόπο', to:'στο recesserat', g:'in (πρόθ. + αιτ.) + diaetam (αιτ. ενικ.)', d:'in — σε, προς· diaeta, diaetae (θηλ. α΄) — η θερινή κατοικία', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. επιθετική αναφορική, προσδιοριστική στο diaetam (της κύριας). Εισάγεται με την αναφορική αντων. cui· εκφέρεται με οριστική, γιατί δηλώνει κάτι το πραγματικό — και μάλιστα ενεστώτα, γιατί αναφέρεται στο παρόν. Λειτουργεί ως επιθ. προσδ. στο diaetam.', kids:[
          { l:'cui', r:'Δοτική προσωπική κτητική', to:'στο est', g:'δοτ. ενικ., θηλ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'nomen', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ., ουδ.', d:'nomen, nominis (ουδ. γ΄) — το όνομα' },
          { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, –, esse — είμαι, υπάρχω' },
          { l:'Hermaeum', r:'Παράθεση', to:'στο nomen', g:'ονομ. ενικ., ουδ.', d:'Hermaeum, Hermaei (ουδ. β΄) — το Ερμαίο', a:'.' }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Paulo', r:'Αφαιρετική του μέτρου (ποσού)', to:'στο post', g:'αφαιρ. ενικ., ουδ. — επίθ. β΄ κλ. (ως ουσιαστικό)', d:'paulus, -a, -um — λίγος' },
        { l:'post', r:'Επιρρ. προσδ. του χρόνου', to:'στο prorepsit', g:'χρονικό επίρρημα', d:'post — αργότερα, μετά' },
        { l:'rumore', r:'Αφαιρετική του εξωτερικού αναγκαστικού αιτίου', to:'στο exterritus', g:'αφαιρ. ενικ.', d:'rumor, rumoris (αρσ. γ΄) — η φήμη, η είδηση' },
        { l:'caedis', r:'Γενική αντικειμενική', to:'στο rumore', g:'γεν. ενικ.', d:'caedes, caedis (θηλ. γ΄) — η σφαγή' },
        { l:'exterritus', r:'Αιτιολογική μετοχή', to:'συνημμένη στο (εννοούμενο) Claudius', g:'ονομ. ενικ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'exterreo, exterrui, exterritum, exterrere (2) — τρομοκρατώ' },
        { l:'prorepsit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'prorepo, prorepsi, proreptum, prorepere (3) — σέρνομαι', note:'Εννοούμενο υποκείμενο: Claudius.' },
        { l:'ad solarium', k:'solarium', r:'Εμπρόθετος προσδ. της κίνησης σε τόπο', to:'στο prorepsit', g:'ad (πρόθ. + αιτ.) + solarium (αιτ. ενικ., ουδ.)', d:'ad — σε, προς· solarium, solarii/solari (ουδ. β΄) — το λιακωτό' },
        { l:'proximum', r:'Επιθετικός προσδ.', to:'στο solarium', g:'αιτ. ενικ., ουδ. — επίθ. β΄ κλ. (υπερθ. βαθμός)', d:'proximus, -a, -um — (πάρα) πολύ κοντινός', note:'Υπερθετικός βαθμός· παράγεται από το επίρρ. (και πρόθ.) prope (ΣΥΓΚΡ. propior, -ior, -ius).' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'inter vela', k:'velum', r:'Εμπρόθετος προσδ. της στάσης σε τόπο', to:'στο abdidit', g:'inter (πρόθ. + αιτ.) + vela (αιτ. πληθ., ουδ.)', d:'inter — ανάμεσα σε· velum, veli (ουδ. β΄) — το παραπέτασμα', note:'Δηλώνει το «μεταξύ».' },
        { l:'praetenta', r:'Επιθετική μετοχή (επιθ. προσδ.)', to:'στο vela', g:'αιτ. πληθ., ουδ. — μτχ. παρακειμένου παθ. φωνής', d:'praetendo, praetendi, praetentum, praetendere (3) — κρεμώ' },
        { l:'foribus', r:'Αντικείμενο', to:'στη μτχ. praetenta', g:'δοτ. πληθ.', d:'foris, foris (θηλ. γ΄) — η πόρτα, η είσοδος (συνήθως πληθ. fores, forium)' },
        { l:'se', r:'Αντικείμενο', to:'στο abdidit', g:'αιτ. ενικ. — προσωπική (αυτοπαθής) αντων. γ΄ προσ.', d:'sui, sibi, se — (αυτοπαθής) εαυτός', note:'Εκφράζει ευθεία (άμεση) αυτοπάθεια.' },
        { l:'abdidit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'abdo, abdidi, abditum, abdere (3) — κρύβω', note:'Εννοούμενο υποκείμενο: Claudius.', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Discurrens', r:'Επιθετική μετοχή', to:'στο miles (ή χρονική, συνημμένη στο miles)', g:'ονομ. ενικ., αρσ. — μτχ. ενεστ. ενεργ. φωνής', d:'discurro, discurri/discucurri, discursum, discurrere (3) — τρέχω εδώ κι εκεί' },
        { l:'miles', r:'Υποκείμενο', to:'στο animadvertit', g:'ονομ. ενικ.', d:'miles, militis (αρσ. γ΄) — ο στρατιώτης' },
        { l:'pedes', r:'Αντικείμενο', to:'στο animadvertit', g:'αιτ. πληθ.', d:'pes, pedis (αρσ. γ΄) — το πόδι' },
        { l:'eius', r:'Γενική κτητική', to:'στο pedes', g:'γεν. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό', note:'Κτήση χωρίς αυτοπάθεια (αναφέρεται σε άλλο πρόσωπο, όχι στο υποκ.).' },
        { l:'animadvertit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'animadverto, animadverti, animadversum, animadvertere (3) — παρατηρώ, προσέχω', a:';' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'eum', r:'Αντικείμενο', to:'στο adgnovit', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'latentem', r:'Κατηγορηματική μετοχή', to:'στο eum (εξαρτάται από το adgnovit)', g:'αιτ. ενικ., αρσ. — μτχ. ενεστ. ενεργ. φωνής', d:'lateo, latui, –, latere (2) — κρύβομαι' },
        { l:'adgnovit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'adgnosco, adgnovi, adgnitum, adgnoscere (3) — αναγνωρίζω', note:'Εννοούμενο υποκείμενο: miles.', a:';' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'extractum', r:'Χρονική μετοχή', to:'συνημμένη στο eum', g:'αιτ. ενικ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'extraho, extraxi, extractum, extrahere (3) — τραβώ έξω' },
        { l:'imperatorem', r:'Κατηγορούμενο στο αντικείμενο', to:'στο eum (μέσω του salutavit)', g:'αιτ. ενικ.', d:'imperator, imperatoris (αρσ. γ΄) — ο αυτοκράτορας' },
        { l:'eum', r:'Αντικείμενο', to:'στο salutavit', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'salutavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'saluto, salutavi, salutatum, salutare (1) — προσαγορεύω, χαιρετώ', note:'Εννοούμενο υποκείμενο: miles.', a:'.' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Hinc', r:'Επιρρ. προσδ. της κίνησης από τόπο', to:'στο adduxit', g:'τοπικό επίρρημα', d:'hinc — από εκεί' },
        { l:'ad commilitones', k:'commilito', r:'Εμπρόθετος προσδ. της κατεύθυνσης (σε πρόσωπο)', to:'στο adduxit', g:'ad (πρόθ. + αιτ.) + commilitones (αιτ. πληθ.)', d:'ad — σε, προς· commilito, commilitonis (αρσ. γ΄) — ο συστρατιώτης, ο σύντροφος' },
        { l:'suos', r:'Επιθετικός προσδ.', to:'στο commilitones', g:'αιτ. πληθ., αρσ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)', d:'suus, sua, suum — δικός του', note:'Εκφράζει ευθεία (άμεση) αυτοπάθεια.' },
        { l:'eum', r:'Αντικείμενο', to:'στο adduxit', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'adduxit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'adduco, adduxi, adductum, adducere (3) — οδηγώ προς (προστ. adduc)', note:'Εννοούμενο υποκείμενο: miles.', a:'.' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Ab his', k:'hic', r:'Εμπρόθετος προσδ. του ποιητικού αιτίου', to:'στο delatus est', g:'ab (πρόθ. + αφαιρ.) + his (αφαιρ. πληθ., αρσ.)', d:'ab — από· hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'in castra', k:'castra', r:'Εμπρόθετος προσδ. της κίνησης σε τόπο', to:'στο delatus est', g:'in (πρόθ. + αιτ.) + castra (αιτ. πληθ., ουδ.)', d:'in — σε, προς· castra, castrorum (ουδ. β΄) — το στρατόπεδο (ενικ. castrum = φρούριο· ετερόσημο)' },
        { l:'delatus est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής', d:'defero, detuli, delatum, deferre — μεταφέρω (ανώμαλο, σύνθ. του fero)', note:'Εννοούμενο υποκείμενο: Claudius.' },
        { l:'tristis', r:'Επιρρ. κατηγορούμενο του τρόπου', to:'στο (εννοούμενο) Claudius (μέσω του delatus est)', g:'ονομ. ενικ., αρσ. — επίθ. γ΄ κλ.', d:'tristis, -is, -e — λυπημένος' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
        { l:'trepidus', r:'Επιρρ. κατηγορούμενο του τρόπου', to:'στο (εννοούμενο) Claudius (μέσω του delatus est)', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'trepidus, -a, -um — έντρομος', a:',' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική, ως επιρρ. προσδ. του χρόνου στο delatus est (της κύριας). Εισάγεται με τον χρονικό σύνδεσμο dum, που δηλώνει το σύγχρονο· εκφέρεται με οριστική ενεστώτα, γιατί δηλώνει μια συνεχιζόμενη πράξη στη διάρκεια της οποίας συμβαίνει μια άλλη — πρόκειται για λατινισμό.', kids:[
          { l:'dum', r:'Χρον. σύνδεσμος', g:'χρονικός σύνδεσμος (+ οριστ. — σύγχρονο, λατινισμός)', d:'dum — ενώ' },
          { l:'obvia', r:'Επιθετικός προσδ.', to:'στο turba', g:'ονομ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'obvius, -a, -um — αντίθετος· εδώ: αυτός που συναντά' },
          { l:'turba', r:'Υποκείμενο', to:'στο miseratur', g:'ονομ. ενικ.', d:'turba, turbae (θηλ. α΄) — το πλήθος' },
          { l:'quasi', r:'Παραβολικό επίρρ.', to:'στο moriturum', g:'παραβολικό επίρρημα', d:'quasi — σαν να' },
          { l:'moriturum', r:'Αιτιολογική μετοχή (υποκειμενικής αιτιολογίας)', to:'συνημμένη στο eum', g:'αιτ. ενικ., αρσ. — μτχ. μέλλοντα ενεργ. φωνής', d:'morior, mortuus sum, mori (3, αποθ., 15 σε -io) — πεθαίνω', note:'Μτχ. μέλλ.: moriturus, -a, -um.' },
          { l:'eum', r:'Αντικείμενο', to:'στο miseratur', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
          { l:'miseratur', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. — αποθετικό', d:'miseror, miseratus sum, miserari (1, αποθ.) — λυπάμαι', a:'.' }
        ]}
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Postero', r:'Επιθετικός προσδ.', to:'στο die', g:'αφαιρ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'posterus, -a, -um — επόμενος' },
        { l:'die', r:'Αφαιρετική του χρόνου', to:'στο factus est', g:'αφαιρ. ενικ.', d:'dies, diei (αρσ. ε΄) — η ημέρα' },
        { l:'Claudius', r:'Υποκείμενο', to:'στο factus est', g:'ονομ. ενικ.', d:'Claudius, Claudii/Claudi (αρσ. β΄) — ο Κλαύδιος' },
        { l:'imperator', r:'Κατηγορούμενο', to:'στο υποκ. Claudius (μέσω του factus est)', g:'ονομ. ενικ.', d:'imperator, imperatoris (αρσ. γ΄) — ο αυτοκράτορας' },
        { l:'factus est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου — ανώμαλο', d:'fio, factus sum, fieri — γίνομαι (παθ. του facio)', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Claudius", el:"Ο Κλαύδιος" },
    { la:"quinquagesimo anno", el:"στο πεντηκοστό έτος" },
    { la:"aetatis suae", el:"της ηλικίας του" },
    { la:"imperium cepit", el:"κατέλαβε την εξουσία" },
    { la:"mirabili quodam casu.", el:"από ένα παράδοξο τυχαίο γεγονός." },
    { la:"Exclusus ab insidiatoribus", el:"Διωγμένος από τους δολοφόνους" },
    { la:"Caligulae,", el:"του Καλιγούλα" },
    { la:"recesserat in diaetam,", el:"είχε αποσυρθεί στη θερινή κατοικία" },
    { la:"cui nomen est Hermaeum.", el:"που ονομάζεται Ερμαίο." },
    { la:"Paulo post", el:"Λίγο αργότερα" },
    { la:"rumore caedis exterritus", el:"τρομοκρατημένος από τα νέα της σφαγής" },
    { la:"prorepsit", el:"σύρθηκε" },
    { la:"ad solarium proximum", el:"ως το πιο κοντινό λιακωτό" },
    { la:"et inter vela praetenta foribus", el:"και ανάμεσα στα παραπετάσματα που κρέμονταν στην πόρτα" },
    { la:"se abdidit.", el:"κρύφτηκε." },
    { la:"Discurrens miles", el:"Ένας στρατιώτης, καθώς έτρεχε εδώ κι εκεί," },
    { la:"pedes eius animadvertit;", el:"παρατήρησε τα πόδια του·" },
    { la:"eum latentem adgnovit;", el:"τον αναγνώρισε που κρυβόταν·" },
    { la:"extractum imperatorem eum salutavit.", el:"αφού τον τράβηξε έξω, τον προσαγόρευσε ως αυτοκράτορα." },
    { la:"Hinc ad commilitones suos eum adduxit.", el:"Από εκεί τον οδήγησε στους συστρατιώτες του." },
    { la:"Ab his in castra delatus est", el:"Από αυτούς μεταφέρθηκε στο στρατόπεδο" },
    { la:"tristis et trepidus,", el:"λυπημένος και έντρομος," },
    { la:"dum obvia turba", el:"ενώ το πλήθος που τον συναντούσε" },
    { la:"quasi moriturum eum miseratur.", el:"τον λυπόταν σαν να επρόκειτο να πεθάνει." },
    { la:"Postero die Claudius", el:"Την επόμενη μέρα ο Κλαύδιος" },
    { la:"imperator factus est.", el:"έγινε αυτοκράτορας." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"Caligula, -ae" } ] },
      { gender:"Θηλυκά", items:[
        { form:"diaeta, -ae" },
        { form:"turba, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"annus, -i" },
        { form:"Claudius, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"castra, -orum", note:"ετερόσημο" },
        { form:"Hermaeum, -i", note:"δεν έχει πληθ." },
        { form:"imperium, -ii (-i)" },
        { form:"solarium, -ii (-i)" },
        { form:"velum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"commilito, commilitonis" },
        { form:"imperator, imperatoris" },
        { form:"insidiator, insidiatoris" },
        { form:"miles, militis" },
        { form:"pes, pedis" },
        { form:"rumor, rumoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"aetas, aetatis" },
        { form:"caedes, caedis" },
        { form:"foris, foris" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"nomen, nominis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"casus, -us" } ] }
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"dies, diei" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"quinquagesimus, -a, -um", note:"τακτικό αριθμητικό" },
      { form:"obvius, -a, -um" },
      { form:"paulus, -a, -um" },
      { form:"posterus, -a, -um" },
      { form:"proximus, -a, -um", note:"υπερθ. του prope" },
      { form:"trepidus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"mirabilis, -is, -e" },
      { form:"tristis, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"obvius, -a, -um", comp:"—", sup:"—" },
      { pos:"paulus, -a, -um", comp:"—", sup:"—" },
      { pos:"posterus, -a, -um", comp:"posterior, -ior, -ius", sup:"postremus, -a, -um & postumus, -a, -um" },
      { pos:"(prope)", comp:"propior, -ior, -ius", sup:"proximus, -a, -um", note:"από το επίρρ./πρόθ. prope· ελλειπτικά παραθετικά" },
      { pos:"trepidus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"mirabilis, -is, -e", comp:"mirabilior, -ior, -ius", sup:"mirabilissimus, -a, -um" },
      { pos:"tristis, -is, -e", comp:"tristior, -ior, -ius", sup:"tristissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"hic, haec, hoc", kind:"Δεικτική" },
    { form:"qui, quae, quod", kind:"Αναφορική" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική" },
    { form:"sui, sibi, se, se", kind:"Προσωπική", extra:"γ΄ προσ. (αυτοπαθής)" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ένας κτήτορας" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"miseror", perf:"miseratus sum", sup:"—", inf:"miserari", note:"αποθετικό" },
      { pres:"saluto", perf:"salutavi", sup:"salutatum", inf:"salutare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"exterreo", perf:"exterrui", sup:"exterritum", inf:"exterrere", note:"" },
      { pres:"lateo", perf:"latui", sup:"—", inf:"latere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"abdo", perf:"abdidi", sup:"abditum", inf:"abdere", note:"" },
      { pres:"adduco", perf:"adduxi", sup:"adductum", inf:"adducere", note:"προστ. adduc" },
      { pres:"adgnosco / agnosco", perf:"adgnovi", sup:"adgnitum", inf:"adgnoscere", note:"" },
      { pres:"animadverto", perf:"animadverti", sup:"animadversum", inf:"animadvertere", note:"" },
      { pres:"capio", perf:"cepi", sup:"captum", inf:"capere", note:"15 σε -io" },
      { pres:"discurro", perf:"discurri / discucurri", sup:"discursum", inf:"discurrere", note:"" },
      { pres:"excludo", perf:"exclusi", sup:"exclusum", inf:"excludere", note:"" },
      { pres:"extraho", perf:"extraxi", sup:"extractum", inf:"extrahere", note:"" },
      { pres:"morior", perf:"mortuus sum", sup:"—", inf:"mori", note:"αποθετικό, 15 σε -io· μτχ. μέλλ. moriturus" },
      { pres:"praetendo", perf:"praetendi", sup:"praetentum / praetensum", inf:"praetendere", note:"" },
      { pres:"prorepo", perf:"prorepsi", sup:"proreptum", inf:"prorepere", note:"" },
      { pres:"recedo", perf:"recessi", sup:"recessum", inf:"recedere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"defero", perf:"detuli", sup:"delatum", inf:"deferre", note:"ανώμαλο (σύνθ. του fero)" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"ανώμαλο (παθ. του facio)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7 (προαιρετικό): SOS — ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ────────────────────
  sos: [
    { tag:"Σύνδεσμος", title:"dum + οριστική ενεστώτα (λατινισμός)", body:"Η χρονική πρόταση «dum ... miseratur» δηλώνει το σύγχρονο μιας συνεχιζόμενης πράξης· γι' αυτό εκφέρεται με οριστική ενεστώτα ακόμη κι όταν αναφέρεται στο παρελθόν. Πρόκειται για λατινισμό (πλησιάζεται με «ενώ»)." },
    { tag:"Μετοχές", title:"Ποικιλία μετοχών", body:"Οι μετοχές εδώ έχουν διαφορετικές λειτουργίες: exclusus, exterritus, extractum → επιρρηματικές (χρονική/αιτιολογική), συνημμένες· praetenta, discurrens → επιθετικές· latentem → κατηγορηματική (με το animadvertit/adgnovit)· quasi moriturum → αιτιολογική υποκειμενικής αιτιολογίας." },
    { tag:"Αντωνυμία", title:"Αυτοπάθεια: suae / suos / se vs eius", body:"Τα suae (πλάγια αυτοπάθεια), suos και se (ευθεία αυτοπάθεια) αναφέρονται στο υποκείμενο· αντίθετα το eius (γεν. κτητική στο pedes) δηλώνει κτήση χωρίς αυτοπάθεια, γιατί αναφέρεται σε άλλο πρόσωπο (τον Κλαύδιο, όχι στον στρατιώτη-υποκείμενο)." },
    { tag:"Παραθετικά", title:"proximus: ελλειπτικά παραθετικά", body:"Το proximus είναι υπερθετικός βαθμός που παράγεται από το επίρρημα/πρόθεση prope (κοντά). Ελλειπτικά παραθετικά: ΘΕΤ. —, ΣΥΓΚΡ. propior, -ior, -ius, ΥΠΕΡΘ. proximus, -a, -um." },
    { tag:"Ουσιαστικό", title:"castra: ετερόσημο", body:"castra, -orum (ουδ. β΄, πληθ.) = στρατόπεδο· στον ενικό castrum, -i = φρούριο. Ετερόσημο ουσιαστικό." },
    { tag:"Ρήμα", title:"factus est → fio", body:"Ο τύπος factus est είναι γ΄ ενικ. παρακειμένου του ανώμαλου fio, factus sum, fieri (= γίνομαι), που λειτουργεί ως παθητικό του facio. Όταν όμως το facio είναι σύνθετο, σχηματίζει κανονικά παθητική φωνή (π.χ. interficio → interficior)." }
  ],
  transforms: [
    { id:"Α", label:"Μετατροπή ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Claudius quinquagesimo anno aetatis suae imperium cepit mirabili quodam casu", to:"A Claudio quinquagesimo anno aetatis suae imperium captum est mirabili quodam casu" },
      { from:"inter vela praetenta foribus se abdidit", to:"(Claudius) inter vela praetenta foribus abditus est" },
      { from:"Discurrens miles pedes eius animadvertit; eum latentem adgnovit; extractum imperatorem eum salutavit", to:"A milite discurrenti / discurrente pedes eius animadversi sunt; is latens adgnitus est (a milite); extractus imperator is salutatus est (a milite)", note:"discurrenti = ως επιθετική μετοχή· discurrente = ως χρονική μετοχή" },
      { from:"(miles) eum adduxit", to:"is adductus est (a milite)" }
    ]},
    { id:"Β", label:"Μετατροπή παθητικής σύνταξης σε ενεργητική", items:[
      { from:"Ab his in castra (Claudius) delatus est tristis et trepidus", to:"Hi in castra (Claudium) detulerunt (ή detulere) tristem et trepidum" },
      { from:"Postero die Claudius imperator factus est (a Romanis)", to:"Postero die (Romani) Claudium imperatorem fecerunt (ή fecere)" }
    ]},
    { id:"Γ", label:"Μετατροπή σε απαρεμφατική σύνταξη με εξάρτηση από «Suetonius narrat»", items:[
      { from:"Claudius quinquagesimo anno aetatis suae imperium cepit mirabili quodam casu", to:"Suetonius narrat Claudium quinquagesimo anno aetatis suae imperium cepisse mirabili quodam casu" },
      { from:"(Claudius,) exclusus ab insidiatoribus Caligulae, recesserat in diaetam", to:"Suetonius narrat (Claudium,) exclusum ab insidiatoribus Caligulae, recessisse in diaetam" },
      { from:"(Claudius) paulo post rumore caedis exterritus prorepsit ad solarium proximum et inter vela praetenta foribus se abdidit", to:"Suetonius narrat (Claudium) paulo post rumore caedis exterritum prorepsisse ad solarium proximum et inter vela praetenta foribus se abdidisse" },
      { from:"Discurrens miles pedes eius animadvertit; eum latentem adgnovit; extractum imperatorem eum salutavit", to:"Suetonius narrat discurrentem militem pedes eius animadvertisse; eum latentem adgnovisse; extractum imperatorem eum salutavisse" },
      { from:"(Miles) hinc ad commilitones suos eum adduxit", to:"Suetonius narrat (militem) illinc ad commilitones suos eum adduxisse" },
      { from:"(Claudius) ab his in castra delatus est tristis et trepidus", to:"Suetonius narrat (Claudium) ab illis in castra delatum esse tristem et trepidum" },
      { from:"Postero die Claudius imperator factus est", to:"Suetonius narrat postero die Claudium imperatorem factum esse" }
    ]}
  ],
  etymology: [
    { la:"Claudius", el:"Κλαύδιος." },
    { la:"quinquagesimo", el:"(γαλλ.) cinquantième (= πεντηκοστός)." },
    { la:"anno", el:"(γαλλ.) année (= έτος, χρονιά) // (αγγλ.) annual (= ετήσιος), anniversary (= επέτειος)." },
    { la:"imperium", el:"ιμπεριαλισμός (< γαλλ.) // (αγγλ.) empire (= αυτοκρατορία), imperial (= αυτοκρατορικός)." },
    { la:"cepit", el:"(ιταλ.) capire (= καταλαβαίνω) // (αγγλ.) capture (= σύλληψη, αιχμαλωσία), capable (= ικανός)." },
    { la:"mirabili", el:"(γαλλ.) miracle (= θαύμα), admirable (= θαυμαστός) // (αγγλ.) marvel (= θαύμα)." },
    { la:"casu", el:"κάζο [< ιταλ. caso (= συμβάν)] // (αγγλ.) case (= περίπτωση), casual (= τυχαίος, ανεπίσημος)." },
    { la:"ex-clusus (claudo)", el:"κλείς, κλειδίον // (γαλλ.) clé (= κλειδί) // (αγγλ.) exclude (= αποκλείω), clause (= πρόταση, ρήτρα), close (= κλείνω)." },
    { la:"insidiatoribus", el:"(γαλλ.) insidieux (= ύπουλος) // (αγγλ.) insidious (= ύπουλος)." },
    { la:"Caligulae", el:"Καλιγούλας." },
    { la:"recesserat", el:"(γαλλ.) récession (= ύφεση, επιβράδυνση) // (αγγλ.) recede (= υποχωρώ)." },
    { la:"diaetam", el:"δίαιτα (= διατροφή) // (αγγλ.) diet (= δίαιτα) // (γαλλ.) diète (= δίαιτα) // (ιταλ.) dieta (= δίαιτα)." },
    { la:"nomen", el:"όνομα // (γαλλ.) nom (= όνομα, ουσιαστικό), (αγγλ.) name // (αγγλ.) nominal (= ονομαστικός), nomenclature (= ονοματολογία)." },
    { la:"Hermaeum", el:"Ερμῆς // Ερμαίο." },
    { la:"paulo", el:"παῦρος (= μικρός, λίγος)." },
    { la:"rumore", el:"(γαλλ.) rumor (= διάδοση, φήμη) // (ιταλ.) rumore (= θόρυβος, βουή)." },
    { la:"exterritus", el:"τρέω, τρόμος // (γαλλ.) terroriste (= τρομοκράτης)." },
    { la:"pro-repsit", el:"ἕρπω // (αγγλ.) reptile (= ερπετό)." },
    { la:"solarium (sol)", el:"σολάριουμ // ἥλιος // (ισπαν.) soleado (= ηλιόλουστος) // (αγγλ.) solar (= ηλιακός)." },
    { la:"proximum", el:"(γαλλ.) proximité (= εγγύτητα) // (αγγλ.) approximate (= κατά προσέγγιση, προσεγγιστικός)." },
    { la:"vela", el:"βέλο // (γαλλ.) voile (= πανί, ιστίο) // (αγγλ.) veil (= πέπλο, βέλο), reveal (= αποκαλύπτω)." },
    { la:"prae-tenta (prae-tendo)", el:"τείνω // (γαλλ.) étendre (= τείνω), tendu (= τεντωμένος) // (αγγλ.) pretend (= προσποιούμαι), tension (= ένταση)." },
    { la:"foribus", el:"θύρα // (αγγλ.) foreign (= ξένος)." },
    { la:"discurrens", el:"κούρσα (< γαλλ.), κουρσόρος (< ιταλ.) // (αγγλ.) discourse (= λόγος, ομιλία), current (= ρεύμα, τρέχων)." },
    { la:"miles, com-militones", el:"μιλιταρισμός (< γαλλ.) // (αγγλ.) military (= στρατιωτικός), militia (= πολιτοφυλακή)." },
    { la:"pedes", el:"πούς (γενική ποδός), πέδον (= έδαφος), πέδη (συνήθως πέδαι = δεσμά ποδιών), πεζῇ (= με τα πόδια) // (αγγλ.) pedestrian (= πεζός), pedal (= πετάλι)." },
    { la:"anim-ad-vertit", el:"ανιμισμός (< γαλλ.), άνεμος // v.s. (= εναντίον)· (verso) βέρσο (= πίσω μέρος σελίδας), ρεβέρ (< γαλλ.) // (αγγλ.) unanimous (= ομόφωνος), magnanimous (= μεγαλόψυχος)." },
    { la:"latentem", el:"(αγγλ.) latent (= λανθάνων, κρυμμένος)." },
    { la:"ad-gnovit", el:"γι-γνώσκω // (αγγλ.) recognize (= αναγνωρίζω), cognition (= γνώση, γνωστική λειτουργία)." },
    { la:"extractum", el:"(αγγλ.) extraction (= εξαγωγή), τρακτέρ (< γαλλ.), contract (= συμβόλαιο / συστέλλω), attract (= ελκύω, προσελκύω)." },
    { la:"imperatorem, imperator", el:"ιμπεριαλισμός (< γαλλ.) // (αγγλ.) emperor (= αυτοκράτορας) // (γαλλ.) empereur (= αυτοκράτορας) // (ιταλ.) imperatore (= αυτοκράτορας)." },
    { la:"salutavit", el:"(γαλλ.) salutation (= χαιρετισμός) // (αγγλ.) salute (= χαιρετώ, χαιρετισμός) // (ιταλ.) salute (= υγεία) // (ισπαν.) salud (= υγεία)." },
    { la:"adduxit", el:"(αγγλ.) adductor (= προσαγωγός μυς), conduct (= διεξάγω, αγωγή), produce (= παράγω) // (ιταλ.) duce (= αρχηγός, ηγέτης)." },
    { la:"castra", el:"κάστρο // (αγγλ.) castle (= κάστρο, πύργος) // (γαλλ.) château (= πύργος, κάστρο) // (ισπαν.) castillo (= κάστρο)." },
    { la:"tristis", el:"(γαλλ.) triste (= λυπημένος)." },
    { la:"turba", el:"τύρβη (= ταραχή) // τούρμπο, τουρμπίνα (< γαλλ.) // (αγγλ.) disturb (= ενοχλώ, διαταράσσω), trouble (= πρόβλημα, ταραχή), turbid (= θολός, θολερός)." },
    { la:"moriturum", el:"βροτός // (γαλλ.) mort (= νεκρός) // (αγγλ.) mortal (= θνητός), moribund (= ετοιμοθάνατος) // (ιταλ.) morire (= πεθαίνω) // (ισπαν.) morir (= πεθαίνω)." },
    { la:"miseratur", el:"μιζέρια, μίζερος (< ιταλ.) // (αγγλ.) miserable (= άθλιος, δυστυχής), misery (= δυστυχία, αθλιότητα) // (γαλλ.) misère (= αθλιότητα, δυστυχία)." },
    { la:"postero", el:"(γαλλ.) postérité (= απόγονοι) // (αγγλ.) posterior (= οπίσθιος, μεταγενέστερος), preposterous (= παράλογος, εξωφρενικός)." },
    { la:"die", el:"(Ζεύς, γενική Διός) Δίας (ως «θεός του φωτός») // (αγγλ.) diary (= ημερολόγιο), diurnal (= ημερήσιος) // (ισπαν.) día (= ημέρα)." },
    { la:"factus est", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο) // (γαλλ.) faire (= κάνω), fait (= γεγονός) // (ισπαν.) hacer (= κάνω)." }
  ]
};

export default UNIT;
