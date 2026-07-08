// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 44
//  «Η ζωή των τυράννων» (Lectio XLIV)
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 44,
  title: "Η ζωή των τυράννων",
  latinTitle: "Lectio XLIV",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Haec', r:'Κατηγορούμενο', to:'στο vita (μέσω του est)', g:'ονομ. ενικ., θηλ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό', note:'Κατά τα φιλολογικά σχόλια: κατηγορούμενο (υποκ. το vita).' },
        { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, —, esse — είμαι' },
        { l:'vita', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ.', d:'vita, vitae (θηλ. α΄) — η ζωή' },
        { l:'tyrannorum', r:'Γενική υποκειμενική', to:'στο vita', g:'γεν. πληθ.', d:'tyrannus, -i (αρσ. β΄) — ο τύραννος', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. επιθετική αναφορική πρότ., προσδιοριστική στο vita (πρότ. 1). Εισάγεται με την εμπρόθετη αναφορική αντωνυμία in qua· εκφέρεται με οριστική (ενεστώτα), γιατί δηλώνει το πραγματικό στο παρόν.', kids:[
          { l:'in qua', k:'qui, quae, quod', r:'Εμπρόθετος επιρρ. προσδ. της στάσης σε τόπο (μεταφορικά)', to:'στο esse', g:'in (πρόθ. + αφαιρ.) + qua (αφαιρ. ενικ., θηλ. — αναφ. αντων.)', d:'in — σε· qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'nulla', r:'Επιθετικός προσδ.', to:'στο fides', g:'ονομ. ενικ., θηλ. — αόριστη επιθετική αντων.', d:'nullus, nulla, nullum — κανένας, καμία, κανένα' },
          { l:'fides', r:'Υποκείμενο', to:'στο potest / esse', g:'ονομ. ενικ.', d:'fides, fidei (θηλ. ε΄) — η εμπιστοσύνη', note:'Δεν έχει πληθ. αριθμό.', a:',' },
          { l:'nulla', r:'Επιθετικός προσδ.', to:'στο caritas', g:'ονομ. ενικ., θηλ. — αόριστη επιθετική αντων.', d:'nullus, nulla, nullum — κανένας, καμία, κανένα' },
          { l:'caritas', r:'Υποκείμενο', to:'στο potest / esse', g:'ονομ. ενικ.', d:'caritas, caritatis (θηλ. γ΄) — η αγάπη, η στοργή', a:',' },
          { l:'nulla', r:'Επιθετικός προσδ.', to:'στο fiducia', g:'ονομ. ενικ., θηλ. — αόριστη επιθετική αντων.', d:'nullus, nulla, nullum — κανένας, καμία, κανένα' },
          { l:'fiducia', r:'Υποκείμενο', to:'στο potest / esse', g:'ονομ. ενικ.', d:'fiducia, fiduciae (θηλ. α΄) — η πίστη', note:'Δεν έχει πληθ. αριθμό.' },
          { l:'stabilis', r:'Επιθετικός προσδ.', to:'στο benevolentiae', g:'γεν. ενικ., θηλ. — επίθ. γ΄ κλ.', d:'stabilis, stabilis, stabile — σταθερός' },
          { l:'benevolentiae', r:'Γενική αντικειμενική', to:'στο fiducia', g:'γεν. ενικ.', d:'benevolentia, benevolentiae (θηλ. α΄) — η ευμένεια, η καλή θέληση, η εύνοια', note:'Ο πληθ. είναι σπάνιος («φιλικές εξυπηρετήσεις / επαφές»).' },
          { l:'potest', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. — ανώμαλο', d:'possum, potui, —, posse — μπορώ' },
          { l:'esse', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο potest', g:'απαρέμφατο ενεστ.', d:'sum, fui, —, esse — είμαι, υπάρχω', a:':' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'tyrannis', r:'Δοτική προσωπική του ενεργούντος προσώπου', to:'στα suspecta / sollicita sunt', g:'δοτ. πληθ.', d:'tyrannus, -i (αρσ. β΄) — ο τύραννος', note:'Ή δοτ. προσωπική αντιχαριστική στο sunt.' },
        { l:'semper', r:'Επιρρ. προσδ. του χρόνου', to:'στο sunt', g:'χρονικό επίρρημα', d:'semper — πάντοτε, πάντα' },
        { l:'suspecta', r:'Κατηγορούμενο', to:'στο omnia (μέσω του sunt)', g:'ονομ. πληθ., ουδ. — μτχ. παρακ. παθ. φων. (ως επίθ.)', d:'suspicio, suspexi, suspectum, suspicere (3, 15 σε -io) — υποπτεύομαι· suspectus = ύποπτος' },
        { l:'atque', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'atque — και' },
        { l:'sollicita', r:'Κατηγορούμενο', to:'στο omnia (μέσω του sunt)', g:'ονομ. πληθ., ουδ. — επίθ. β΄ κλ.', d:'sollicitus, sollicita, sollicitum — ταραγμένος, ανήσυχος' },
        { l:'sunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ.', d:'sum, fui, —, esse — είμαι, υπάρχω' },
        { l:'omnia', r:'Υποκείμενο', to:'στο sunt', g:'ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.', d:'omnis, omnis, omne — όλος', a:';' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'nullus', r:'Επιθετικός προσδ.', to:'στο locus', g:'ονομ. ενικ., αρσ. — αόριστη επιθετική αντων.', d:'nullus, nulla, nullum — κανένας, καμία, κανένα' },
        { l:'locus', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ.', d:'locus, loci (αρσ. β΄) — ο τόπος, το μέρος', note:'Ετερογενές στον πληθ.: (αρσ.) loci = χωρία βιβλίου, (ουδ.) loca = τόποι.' },
        { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, —, esse — είμαι, υπάρχω' },
        { l:'amicitiae', r:'Δοτική κατηγορηματική του σκοπού', to:'στο est', g:'δοτ. ενικ.', d:'amicitia, amicitiae (θηλ. α΄) — η φιλία' },
        { l:'eis', r:'Δοτική προσωπική κτητική', to:'στο est', g:'δοτ. πληθ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Nescio', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ.', d:'nescio, nesci(v)i, nescitum, nescire (4) — αγνοώ, δεν ξέρω', note:'Εννοούμενο υποκείμενο: ego.' },
        { l:'enim', r:'Σύνδεσμος', g:'αιτιολογικός παρατακτικός σύνδεσμος', d:'enim — γιατί, δηλαδή' },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρότ. μερικής αγνοίας, αντικ. του nescio. Εισάγεται με την ερωτηματική αντωνυμία quis· εκφέρεται με υποτακτική (η εξάρτηση δίνει υποκειμενική χροιά), ενεστώτα, γιατί εξαρτάται από αρκτικό χρόνο και δηλώνει το σύγχρονο στο παρόν.', kids:[
          { l:'quis', r:'Υποκείμενο', to:'στο possit / diligere', g:'ονομ. ενικ., αρσ. — ουσιαστική ερωτηματική αντων.', d:'quis, quis, quid — ποιος, ποια, ποιο/τι' },
          { l:'possit', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. — ανώμαλο', d:'possum, potui, —, posse — μπορώ' },
          { l:'diligere', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο possit', g:'απαρέμφατο ενεστ. ενεργ.', d:'diligo, dilexi, dilectum, diligere (3) — αγαπώ' },
          { l:'eum', r:'Αντικείμενο', to:'στο diligere', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό', a:',' },
          { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. επιθετική αναφορική πρότ., προσδιοριστική στο (1ο) eum. Εισάγεται με την αναφορική αντων. quem· εκφέρεται με υποτακτική (πλαγίου λόγου) ενεστώτα, γιατί εξαρτάται από αρκτικό χρόνο (το απαρέμφατο diligere) και δηλώνει το σύγχρονο.', kids:[
            { l:'quem', r:'Αντικείμενο', to:'στο metuat', g:'αιτ. ενικ., αρσ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
            { l:'metuat', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. ενεργ.', d:'metuo, metui, metutum, metuere (3) — φοβάμαι', note:'Εννοούμενο υποκείμενο: is.', a:',' }
          ]},
          { l:'aut', r:'Σύνδεσμος', g:'διαζευκτικός σύνδεσμος', d:'aut — ή' },
          { l:'eum', r:'Αντικείμενο', to:'στο diligere', g:'αιτ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό', a:',' },
          { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. επιθετική αναφορική πρότ., προσδιοριστική στο (2ο) eum. Εισάγεται με την (εμπρόθετη) αναφορική αντων. a quo· εκφέρεται με υποτακτική (πλαγίου λόγου) ενεστώτα (σύγχρονο, από αρκτικό χρόνο).', kids:[
            { l:'a quo', k:'qui, quae, quod', r:'Εμπρόθετος προσδ. του ποιητικού αιτίου', to:'στο metui', g:'a/ab (πρόθ. + αφαιρ.) + quo (αφαιρ. ενικ., αρσ. — αναφ. αντων.)', d:'a/ab — από· qui, quae, quod — ο οποίος, η οποία, το οποίο' },
            { l:'se', r:'Υποκείμενο απαρεμφάτου', to:'στο metui (ταυτοπροσωπία — λατινισμός)', g:'αιτ. ενικ., γ΄ προσ. — προσωπική αντων.', d:'sui, sibi, se, se — ο εαυτός του', note:'Λατινισμός: στην ταυτοπροσωπία, υποκ. του ειδικού απαρεμφάτου τίθεται σε αιτιατική.' },
            { l:'metui', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο putet', g:'απαρέμφατο ενεστ. παθ. φων.', d:'metuo, metui, metutum, metuere (3) — φοβάμαι' },
            { l:'putet', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. ενεργ.', d:'puto, putavi, putatum, putare (1) — νομίζω', note:'Εννοούμενο υποκείμενο: is.', a:'.' }
          ]}
        ]}
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Coluntur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. παθ. φων.', d:'colo, colui, cultum, colere (3) — σέβομαι, καλλιεργώ', note:'Εννοούμενο υποκείμενο: tyranni.' },
        { l:'tamen', r:'Σύνδεσμος', g:'αντιθετικός σύνδεσμος', d:'tamen — όμως, εντούτοις' },
        { l:'simulatione', r:'Αφαιρετική του τρόπου', to:'στο coluntur', g:'αφαιρ. ενικ.', d:'simulatio, simulationis (θηλ. γ΄) — η προσποίηση, η υποκρισία' },
        { l:'dumtaxat', r:'Επιρρ. προσδ. του ποσού', to:'στο ad tempus', g:'ποσοτικό επίρρημα', d:'dumtaxat — μόνον, τουλάχιστον' },
        { l:'ad tempus', k:'tempus', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο coluntur', g:'ad (πρόθ. + αιτ.) + tempus (αιτ. ενικ., ουδ.)', d:'ad — σε, προς, για· tempus, temporis (ουδ. γ΄) — ο χρόνος', a:'.' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως (ρήμα: intellegitur, απρόσωπο). Η υποθετική (πρότ. 10) λειτουργεί ως επιρρ. προσδ. της προϋπόθεσης στο intellegitur (υποθετικός λόγος α΄ είδους — πραγματικό).', kids:[
        { type:'sub', key:'ypothetiki', label:'Υποθετική', note:'Δευτ. επιρρ. υποθετική πρότ. (υπόθεση). Εισάγεται με τον υποθετικό σύνδεσμο quodsi (= si), γιατί είναι καταφατική· εκφέρεται με οριστική παρακειμένου, γιατί ο υποθετικός λόγος δηλώνει ανοικτή υπόθεση στο παρελθόν (προτερόχρονη). Απόδοση: το intellegitur.', kids:[
          { l:'Quodsi', r:'Υποθετικός σύνδεσμος', g:'υποθετικός σύνδεσμος (= si)', d:'quodsi — αν όμως' },
          { l:'forte', r:'Επιρρ. προσδ. του τρόπου', to:'στο ceciderunt', g:'τροπικό επίρρημα', d:'forte — τυχαία, ίσως' },
          { l:'ceciderunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακ. ενεργ.', d:'cado, cecidi, casum, cadere (3) — πέφτω, χάνω την εξουσία', note:'Εννοούμενο υποκείμενο: tyranni.', a:',' }
        ]},
        { type:'sub', key:'paravoliki', label:'Παραβολική', note:'Δευτ. επιρρ. απλή παραβολική πρότ. (δηλώνει τρόπο) και είναι παρενθετική. Εισάγεται με τον παραβολικό σύνδεσμο ut· εκφέρεται με οριστική ενεστώτα (αντικειμενική πραγματικότητα, παρόν).', kids:[
          { l:'ut', r:'Παραβολικός σύνδεσμος', g:'παραβολικός σύνδεσμος', d:'ut — όπως' },
          { l:'fit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. — ανώμαλο', d:'fio, factus sum, fieri — γίνομαι (ως παθ. του facio)', note:'Εννοούμενο υποκείμενο: id.' },
          { l:'plerumque', r:'Επιρρ. προσδ. του χρόνου', to:'στο fit', g:'χρονικό επίρρημα', d:'plerumque — πολλές φορές, συνήθως', a:',' }
        ]},
        { l:'tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο intellegitur', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'intellegitur', r:'Ρήμα (απρόσωπο)', g:'γ΄ ενικ. οριστ. ενεστ. παθ. φων.', d:'intellego / intelligo, intellexi, intellectum, intellegere / intelligere (3) — καταλαβαίνω', a:',' },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρότ. μερικής αγνοίας, υποκ. του intellegitur. Εισάγεται με το ερωτηματικό επίρρ. quam· εκφέρεται με υποτακτική παρακειμένου (προτερόχρονο στο παρόν, από αρκτικό χρόνο).', kids:[
          { l:'quam', r:'Επιρρ. προσδ. του ποσού', to:'στο fuerint', g:'ερωτηματικό ποσοτικό επίρρημα', d:'quam — πόσο' },
          { l:'fuerint', r:'Ρήμα', g:'γ΄ πληθ. υποτ. παρακ.', d:'sum, fui, —, esse — είμαι', note:'Εννοούμενο υποκείμενο: tyranni.' },
          { l:'inopes', r:'Κατηγορούμενο', to:'στο (εννοούμενο) tyranni (μέσω του fuerint)', g:'ονομ. πληθ., αρσ. — επίθ. γ΄ κλ.', d:'inops, inops, inops (γεν. inopis) — στερημένος, ενδεής' },
          { l:'amicorum', r:'Γενική αντικειμενική', to:'στο inopes', g:'γεν. πληθ.', d:'amicus, -i (αρσ. β΄) — ο φίλος', a:'.' }
        ]}
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως.', kids:[
        { l:'Hoc', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ., ουδ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, —, esse — είμαι' },
        { type:'sub', key:'anaforiki', label:'Αναφορική (ουσιαστική)', note:'Δευτ. αναφορική ουσιαστική πρότ., κατηγορούμενο στο hoc (μέσω του est). Εισάγεται με την αναφορική αντων. quod· εκφέρεται με οριστική ενεστώτα (πραγματικό, παρόν).', kids:[
          { l:'quod', r:'Αντικείμενο', to:'στο dixisse', g:'αιτ. ενικ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'Tarquinium', r:'Υποκείμενο απαρεμφάτου', to:'στο dixisse (ετεροπροσωπία)', g:'αιτ. ενικ.', d:'Tarquinius, Tarquinii / Tarquini (αρσ. β΄) — ο Ταρκύνιος (κλητ. Tarquini)' },
          { l:'dixisse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο ferunt', g:'απαρέμφατο παρακ. ενεργ.', d:'dico, dixi, dictum, dicere (3) — λέω (προστ. dic)' },
          { l:'ferunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. ενεστ. ενεργ. — ανώμαλο', d:'fero, tuli, latum, ferre — αναφέρω, λέω (προστ. fer)', note:'Εννοούμενο υποκείμενο: homines.' },
          { l:'exulantem', r:'Χρονική μετοχή (συνημμένη)', to:'στο Tarquinium (υποκ. του dixisse)', g:'αιτ. ενικ., αρσ. — μτχ. ενεστ. ενεργ.', d:'ex(s)ulo, ex(s)ulavi, ex(s)ulatum, ex(s)ulare (1) — είμαι εξόριστος', a:':' }
        ]}
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρότ. κρίσεως (ευθύς λόγος του Ταρκυνίου).', kids:[
        { l:'Tum', r:'Επιρρ. προσδ. του χρόνου', to:'στο intellexi', g:'χρονικό επίρρημα', d:'tum — τότε' },
        { l:'intellexi', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρακ. ενεργ.', d:'intellego / intelligo, intellexi, intellectum, intellegere / intelligere (3) — καταλαβαίνω', note:'Εννοούμενο υποκείμενο: ego.', a:',' },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρότ. μερικής αγνοίας, αντικ. του intellexi. Εισάγεται με την ερωτηματική αντων. quos· εκφέρεται με υποτακτική υπερσυντελίκου (προτερόχρονο στο παρελθόν, από ιστορικό χρόνο).', kids:[
          { l:'quos', r:'Αντικείμενο', to:'στο habuissem', g:'αιτ. πληθ., αρσ. — ουσιαστική ερωτηματική αντων.', d:'quis, quis, quid — ποιος, ποια, ποιο/τι' },
          { l:'fidos', r:'Επιθετικός προσδ.', to:'στο amicos', g:'αιτ. πληθ., αρσ. — επίθ. β΄ κλ.', d:'fidus, fida, fidum — πιστός' },
          { l:'amicos', r:'Κατηγορούμενο', to:'στο αντικ. quos (μέσω του habuissem)', g:'αιτ. πληθ.', d:'amicus, amici (αρσ. β΄) — ο φίλος' },
          { l:'habuissem', r:'Ρήμα', g:'α΄ ενικ. υποτ. υπερσ. ενεργ.', d:'habeo, habui, habitum, habere (2) — έχω', note:'Εννοούμενο υποκείμενο: ego.', a:',' }
        ]},
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρότ. μερικής αγνοίας, αντικ. του intellexi. Εισάγεται με την ερωτηματική αντων. quos· εκφέρεται με υποτακτική υπερσυντελίκου (προτερόχρονο στο παρελθόν). Εννοούνται: habuissem (ρήμα), amicos (κατηγορούμενο).', kids:[
          { l:'quos', r:'Αντικείμενο', to:'στο (εννοούμενο) habuissem', g:'αιτ. πληθ., αρσ. — ουσιαστική ερωτηματική αντων.', d:'quis, quis, quid — ποιος, ποια, ποιο/τι' },
          { l:'infidos', r:'Επιθετικός προσδ.', to:'στο (εννοούμενο) amicos', g:'αιτ. πληθ., αρσ. — επίθ. β΄ κλ.', d:'infidus, infida, infidum — άπιστος, ψεύτικος', a:',' }
        ]},
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρ. χρονική πρότ., επιρρ. προσδ. του χρόνου στο intellexi. Εισάγεται με τον καθαρά χρονικό cum· εκφέρεται με οριστική παρατατικού (σύγχρονο στο παρελθόν)· διατηρείται η οριστική, γιατί η πρόταση λειτουργεί ανεξάρτητα από τον πλάγιο λόγο.', kids:[
          { l:'cum', r:'Χρονικός σύνδεσμος', g:'καθαρά χρονικός σύνδεσμος (+ οριστική)', d:'cum — όταν' },
          { l:'iam', r:'Επιρρ. προσδ. του χρόνου', to:'στο poteram', g:'χρονικό επίρρημα', d:'iam — ήδη, πια' },
          { l:'neutris', r:'Έμμεσο αντικείμενο', to:'στο referre', g:'δοτ. πληθ., αρσ. — αόριστη αντων.', d:'neuter, neutra, neutrum — ούτε ο ένας ούτε ο άλλος' },
          { l:'gratiam', r:'Άμεσο αντικείμενο', to:'στο referre', g:'αιτ. ενικ.', d:'gratia, gratiae (θηλ. α΄) — η χάρη' },
          { l:'referre', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο poteram', g:'απαρέμφατο ενεστ. ενεργ. — ανώμαλο', d:'refero, re(t)tuli, relatum, referre — ανταποδίδω (προστ. refer)' },
          { l:'poteram', r:'Ρήμα', g:'α΄ ενικ. οριστ. παρατ. — ανώμαλο', d:'possum, potui, —, posse — μπορώ', note:'Εννοούμενο υποκείμενο: ego (ταυτοπροσωπία με το referre).', a:'».' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Haec est vita tyrannorum,", el:"Αυτή είναι η ζωή των τυράννων," },
    { la:"in qua nulla fides,", el:"στην οποία καμιά εμπιστοσύνη," },
    { la:"nulla caritas,", el:"καμιά αγάπη," },
    { la:"nulla fiducia", el:"καμιά πίστη" },
    { la:"stabilis benevolentiae", el:"σε σταθερή φιλία" },
    { la:"potest esse:", el:"δεν μπορεί να υπάρξει." },
    { la:"tyrannis semper suspecta", el:"Οι τύραννοι πάντα υποπτεύονται" },
    { la:"atque sollicita sunt omnia;", el:"και ανησυχούν για όλα·" },
    { la:"nullus locus est", el:"καμία θέση" },
    { la:"amicitiae eis.", el:"δεν έχει η φιλία σε αυτούς." },
    { la:"Nescio enim", el:"Γιατί δεν ξέρω" },
    { la:"quis possit diligere", el:"ποιος μπορεί να αγαπά" },
    { la:"eum, quem metuat,", el:"αυτόν τον οποίο φοβάται," },
    { la:"aut eum,", el:"ή αυτόν" },
    { la:"a quo se metui putet.", el:"που νομίζει πως τον φοβάται." },
    { la:"Coluntur tamen", el:"Στους τυράννους δείχνουν εντούτοις" },
    { la:"simulatione dumtaxat", el:"υποκριτικό σεβασμό, τουλάχιστον" },
    { la:"ad tempus.", el:"για κάποιο χρονικό διάστημα." },
    { la:"Quodsi forte ceciderunt,", el:"Αν όμως τύχει να πέσουν," },
    { la:"ut fit plerumque,", el:"όπως συμβαίνει συνήθως," },
    { la:"tum intellegitur,", el:"τότε γίνεται αντιληπτό," },
    { la:"quam fuerint inopes amicorum.", el:"πόσο στερημένοι ήταν από φίλους." },
    { la:"Hoc est quod ferunt", el:"Αυτό είναι το οποίο λένε" },
    { la:"dixisse Tarquinium", el:"ότι είπε ο Ταρκύνιος," },
    { la:"exulantem:", el:"όταν ήταν εξόριστος:" },
    { la:"«Tum intellexi,", el:"«Τότε κατάλαβα," },
    { la:"quos habuissem fidos amicos,", el:"ποιους είχα πιστούς φίλους," },
    { la:"quos infidos,", el:"ποιους άπιστους," },
    { la:"cum poteram iam", el:"όταν δεν μπορούσα πια" },
    { la:"referre gratiam", el:"να ανταποδώσω χάρη" },
    { la:"neutris».", el:"ούτε σε εκείνους ούτε σε αυτούς»." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"amicitia, -ae" },
        { form:"benevolentia, -ae", note:"δεν έχει πληθ." },
        { form:"fiducia, -ae", note:"δεν έχει πληθ." },
        { form:"gratia, -ae" },
        { form:"vita, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"amicus, -i" },
        { form:"locus, -i", note:"ετερογενές στον πληθ. (loci / loca)" },
        { form:"Tarquinius, -ii (-i)", note:"μόνο ενικ." },
        { form:"tyrannus, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"caritas, caritatis" },
        { form:"simulatio, simulationis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"tempus, temporis" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"fides, fidei", note:"δεν έχει πληθ." }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"fidus, -a, -um" },
      { form:"infidus, -a, -um" },
      { form:"sollicitus, -a, -um" },
      { form:"suspectus, -a, -um", note:"μτχ. παρακ. του suspicio, ως επίθ." }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"inops, inops, inops (inopis)" },
      { form:"omnis, -is, -e" },
      { form:"stabilis, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"fidus, -a, -um", comp:"fidior, -ior, -ius", sup:"fidissimus, -a, -um" },
      { pos:"infidus, -a, -um", comp:"—", sup:"—" },
      { pos:"sollicitus, -a, -um", comp:"sollicitior, -ior, -ius", sup:"sollicitissimus, -a, -um" },
      { pos:"suspectus, -a, -um", comp:"suspectior, -ior, -ius", sup:"suspectissimus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"inops, inops, inops (inopis)", comp:"egentior, -ior, -ius", sup:"egentissimus, -a, -um", note:"από άλλο θέμα (egeo)" },
      { pos:"omnis, -is, -e", comp:"—", sup:"—" },
      { pos:"stabilis, -is, -e", comp:"stabilior, -ior, -ius", sup:"stabilissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"hic, haec, hoc", kind:"Δεικτική" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"nullus, -a, -um", kind:"Αόριστη επιθετική" },
    { form:"qui, quae, quod", kind:"Αναφορική" },
    { form:"quis, quis, quid", kind:"Ερωτηματική", extra:"ουσιαστική" },
    { form:"se (sui, sibi, se)", kind:"Προσωπική", extra:"γ΄ προσ." },
    { form:"neuter, neutra, neutrum", kind:"Αόριστη" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"ex(s)ulo", perf:"ex(s)ulavi", sup:"ex(s)ulatum", inf:"ex(s)ulare", note:"" },
      { pres:"puto", perf:"putavi", sup:"putatum", inf:"putare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"habeo", perf:"habui", sup:"habitum", inf:"habere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"cado", perf:"cecidi", sup:"casum", inf:"cadere", note:"" },
      { pres:"colo", perf:"colui", sup:"cultum", inf:"colere", note:"" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicere", note:"προστ. dic" },
      { pres:"diligo", perf:"dilexi", sup:"dilectum", inf:"diligere", note:"" },
      { pres:"fero", perf:"tuli", sup:"latum", inf:"ferre", note:"ανώμαλο· προστ. fer" },
      { pres:"intellego / intelligo", perf:"intellexi", sup:"intellectum", inf:"intellegere / intelligere", note:"" },
      { pres:"metuo", perf:"metui", sup:"metutum", inf:"metuere", note:"" },
      { pres:"refero", perf:"re(t)tuli", sup:"relatum", inf:"referre", note:"ανώμαλο (σύνθ. του fero)· προστ. refer" },
      { pres:"suspicio", perf:"suspexi", sup:"suspectum", inf:"suspicere", note:"15 σε -io" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"nescio", perf:"nesci(v)i", sup:"nescitum", inf:"nescire", note:"προστ. nescito / nescitote" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"ανώμαλο (ως παθ. του facio)" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"ανώμαλο" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Απαρέμφατο", title:"se + ειδικό απαρέμφατο (λατινισμός)", body:"Στο «a quo se metui putet» το se (αιτιατική προσωπικής αντωνυμίας) είναι υποκείμενο του ειδικού απαρεμφάτου metui, αν και υπάρχει ταυτοπροσωπία με το putet. Πρόκειται για λατινισμό (στα ελληνικά θα περιμέναμε ονομαστική)." },
    { tag:"Ρήμα", title:"fit → fio", body:"Ο τύπος fit είναι γ΄ ενικ. οριστ. ενεστ. του ανώμαλου fio, factus sum, fieri, που χρησιμοποιείται ως παθητικό του facio." },
    { tag:"Υποθετικός λόγος", title:"quodsi ... ceciderunt / intellegitur", body:"Απλός, ευθύς υποθετικός λόγος α΄ είδους (ανοιχτή υπόθεση): υπόθεση «quodsi ... ceciderunt» (οριστ. παρακ., προτερόχρονη), απόδοση «intellegitur» (οριστ. ενεστ.)." },
    { tag:"Έγκλιση", title:"Πλάγιες ερωτηματικές — υποτακτική", body:"Οι πλάγιες ερωτηματικές εκφέρονται με υποτακτική (υποκειμενική χροιά): ενεστ. από αρκτικό χρόνο (πρότ. 6 & 13), υπερσυντ. από ιστορικό χρόνο (πρότ. 17 & 18, εξάρτηση από το intellexi)." },
    { tag:"Σύνταξη", title:"cum χρονικός + οριστική", body:"Το «cum ... poteram» είναι καθαρά χρονικός cum με οριστική παρατατικού (σύγχρονο στο παρελθόν)· διατηρείται η οριστική γιατί η πρόταση λειτουργεί ανεξάρτητα από τον πλάγιο λόγο." },
    { tag:"Ουσιαστικό", title:"Ελλειπτικά / ετερογενή ουσιαστικά", body:"fides και fiducia δεν έχουν πληθ. (η benevolentia σπάνιο πληθ.)· το locus είναι ετερογενές στον πληθ.: (αρσ.) loci = χωρία βιβλίου, (ουδ.) loca = τόποι." }
  ]
};

export default UNIT;
