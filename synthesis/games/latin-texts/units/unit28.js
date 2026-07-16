export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 28,
  title: "Στα ίχνη ενός δραπέτη δούλου",
  latinTitle: "Lectio XXVIII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Aesopi', r:'Γενική κτητική', to:'στο servus', g:'γεν. ενικ., αρσ.', d:'Aesopus, -i (αρσ. β΄) — ο Αίσωπος' },
        { l:'nostri', r:'Επιθετικός προσδ.', to:'στο Aesopi', g:'γεν. ενικ., αρσ. — κτητική αντων. α΄ προσ. (πολλοί κτήτορες)', d:'noster, nostra, nostrum — δικός, -ή, -ό μας' },
        { l:'Licinus', r:'Υποκείμενο', to:'στο fugit (και της μτχ. notus)', g:'ονομ. ενικ., αρσ.', d:'Licinus, -i (αρσ. β΄) — ο Λίκινος' },
        { l:'servus', r:'Παράθεση', to:'στο Licinus', g:'ονομ. ενικ., αρσ.', d:'servus, -i (αρσ. β΄) — ο δούλος' },
        { l:'tibi', r:'Δοτική προσωπική του ενεργούντος προσώπου (ή του ποιητικού αιτίου)', to:'στη μτχ. notus', g:'δοτ. ενικ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ', note:'Το ποιητικό αίτιο εκφέρεται με δοτική, γιατί εξαρτάται από συντελικό χρόνο παθ. φωνής (notus: μτχ. παρακειμένου).' },
        { l:'notus', r:'Επιθετική μετοχή (ως παράθεση στο Licinus)', to:'στο Licinus', g:'ονομ. ενικ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'nosco, novi, notum, noscere (3) — γνωρίζω· notus, -a, -um — γνωστός', note:'Δηλώνει το προτερόχρονο ως μτχ. παρακειμένου.' },
        { l:'Roma', r:'Αφαιρετική (απρόθετη) της απομάκρυνσης / κίνησης από τόπο', to:'στο fugit', g:'αφαιρ. ενικ., θηλ.', d:'Roma, -ae (θηλ. α΄) — η Ρώμη', note:'Απρόθετη, γιατί είναι όνομα πόλης.' },
        { l:'Athenas', r:'Αιτιατική (απρόθετη) της κίνησης σε τόπο', to:'στο fugit', g:'αιτ. πληθ., θηλ.', d:'Athenae, -arum (θηλ. α΄, μόνο πληθ.) — η Αθήνα', note:'Απρόθετη, γιατί είναι όνομα πόλης.' },
        { l:'fugit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'fugio, fugi, fugitum, fugere (3, σε -io) — φεύγω, δραπετεύω', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Is', r:'Υποκείμενο', to:'στο fuit', g:'ονομ. ενικ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, -ή, -ό (Is = Licinus)' },
        { l:'Athenis', r:'Αφαιρετική (απρόθετη) της στάσης σε τόπο', to:'στο fuit', g:'αφαιρ. πληθ., θηλ.', d:'Athenae, -arum (θηλ. α΄) — η Αθήνα', note:'Απρόθετη (όνομα πόλης) και σε αφαιρετική, γιατί είναι όνομα πληθυντικού αριθμού.' },
        { l:'apud Patronem', k:'Patro', r:'Εμπρόθετος προσδ. του πλησίον', to:'στο fuit', g:'apud (πρόθ. + αιτ.) + Patronem (αιτ. ενικ.)', d:'apud — κοντά, σε· Patro/Patron, Patronis (αρσ. γ΄) — ο Πάτρωνας' },
        { l:'Epicureum', r:'Παράθεση', to:'στο Patronem', g:'αιτ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'Epicureus, -a, -um — Επικούρειος', note:'Το επίθετο λειτουργεί ουσιαστικοποιημένο, στη θέση του εννοούμενου όρου «philosophum».' },
        { l:'paucos', r:'Επιθετικός προσδ.', to:'στο menses', g:'αιτ. πληθ., αρσ. — επίθ. β΄ κλ.', d:'paucus, -a, -um — λίγος' },
        { l:'menses', r:'Αιτιατική (απρόθετη) του χρόνου (χρονική διάρκεια)', to:'στο fuit', g:'αιτ. πληθ., αρσ.', d:'mensis, mensis (αρσ. γ΄) — ο μήνας' },
        { l:'pro libero', k:'liber', r:'Εμπρόθετος προσδ. της παραβολής/σύγκρισης σε θέση κατηγορουμένου', to:'στο is (μέσω του fuit)', g:'pro (πρόθ. + αφαιρ.) + libero (αφαιρ. ενικ.)', d:'pro — σαν, ως· liber, libera, liberum — ελεύθερος· pro libero = ως ελεύθερος' },
        { l:'fuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου', d:'sum, fui, —, esse — είμαι', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'(is)', r:'Υποκείμενο (εννοούμενο)', to:'στο abiit', g:'ονομ. ενικ., αρσ.', d:'is = Licinus' },
        { l:'inde', r:'Επιρρ. προσδ. της κίνησης από τόπο (απομάκρυνσης)', to:'στο abiit', g:'τοπικό επίρρημα', d:'inde — από εκεί' },
        { l:'in Asiam', k:'Asia', r:'Εμπρόθετος προσδ. της κίνησης σε τόπο', to:'στο abiit', g:'in (πρόθ. + αιτ.) + Asiam (αιτ. ενικ.)', d:'in — σε· Asia, -ae (θηλ. α΄) — η Ασία' },
        { l:'abiit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου', d:'abeo, abii (abivi), abitum, abire (< ab + eo) — φεύγω, αναχωρώ', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Postea', r:'Επιρρ. προσδ. του χρόνου (χρονική ακολουθία)', to:'στο comprehendit', g:'χρονικό επίρρημα', d:'postea — αργότερα, έπειτα' },
        { l:'Plato', r:'Υποκείμενο', to:'στο comprehendit', g:'ονομ. ενικ., αρσ.', d:'Plato/Platon, Platonis (αρσ. γ΄) — ο Πλάτωνας' },
        { l:'quidam', r:'Επιθετικός προσδ.', to:'στο Plato', g:'ονομ. ενικ., αρσ. — αόριστη επιθετική αντων.', d:'quidam, quaedam, quoddam — κάποιος, -α, -ο' },
        { l:'Sardianus', r:'Παράθεση', to:'στο Plato', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'Sardianus, -a, -um — Σαρδιανός, από τις Σάρδεις', a:',' },
        { type:'sub', key:'xroniki', label:'Χρονική', note:'Δευτ. επιρρηματική χρονική πρόταση· λειτουργεί ως επιρρ. προσδ. του χρόνου στο comprehendit της κύριας. Εισάγεται με τον ιστορικό-διηγηματικό σύνδεσμο cum και εκφέρεται με υποτακτική (cognovisset), γιατί ο cum υπογραμμίζει τη βαθύτερη σχέση αιτίου-αιτιατού με την κύρια. Χρόνου υπερσυντελίκου, γιατί εξαρτάται από ιστορικό χρόνο (comprehendit) και δηλώνει το προτερόχρονο στο παρελθόν.', kids:[
          { l:'cum', r:'Σύνδεσμος', g:'ιστορικός-διηγηματικός σύνδεσμος', d:'cum — όταν' },
          { l:'eum', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. ενικ., αρσ. — δεικτ. (επαναληπτ.) αντων.', d:'is, ea, id — αυτός (eum = Licinum)' },
          { l:'fugitivum', r:'Κατηγορούμενο', to:'στο eum (μέσω του esse)', g:'αιτ. ενικ., αρσ.', d:'fugitivus, -i (αρσ. β΄) — ο δραπέτης, φυγάς' },
          { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο cognovisset', g:'απαρέμφατο ενεστ.', d:'sum, fui, —, esse — είμαι' },
          { l:'ex', r:'Πρόθεση (ex + αφαιρ.)', to:'στο litteris', g:'πρόθεση + αφαιρ.', d:'ex — από' },
          { l:'Aesopi', r:'Γενική του δημιουργού', to:'στο litteris', g:'γεν. ενικ., αρσ.', d:'Aesopus, -i (αρσ. β΄) — ο Αίσωπος' },
          { l:'litteris', r:'Εμπρόθετος προσδ. της προέλευσης (με το ex)', to:'στο cognovisset', g:'αφαιρ. πληθ., θηλ.', d:'litterae, -arum (θηλ. α΄) — η επιστολή, τα γράμματα' },
          { l:'cognovisset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. υπερσυντελίκου ενεργ. φωνής', d:'cognosco, cognovi, cognitum, cognoscere (3) — μαθαίνω, γνωρίζω', a:',' }
        ]},
        { l:'hominem', r:'Αντικείμενο', to:'στο comprehendit', g:'αιτ. ενικ., αρσ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
        { l:'comprehendit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'comprehendo, comprehendi, comprehensum, comprehendere (3) — συλλαμβάνω' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός, καταφατικός) σύνδεσμος', d:'et — και', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'(Plato)', r:'Υποκείμενο (εννοούμενο)', to:'στο tradidit', g:'ονομ. ενικ., αρσ.', d:'Plato = ο υποκ. της προηγ. κύριας' },
        { l:'(hominem)', r:'Αντικείμενο (εννοούμενο)', to:'στο tradidit', g:'αιτ. ενικ., αρσ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
        { l:'in custodiam', k:'custodia', r:'Εμπρόθετος προσδ. της κίνησης σε τόπο (ή του σκοπού)', to:'στο tradidit', g:'in (πρόθ. + αιτ.) + custodiam (αιτ. ενικ.)', d:'in — σε, προς· custodia, -ae (θηλ. α΄) — η φυλακή' },
        { l:'Ephesi', r:'Γενική (απρόθετη) της στάσης σε τόπο', to:'στο tradidit', g:'γεν. ενικ., θηλ.', d:'Ephesus, -i (θηλ. β΄) — η Έφεσος', note:'Απρόθετη (όνομα πόλης)· σε γενική, γιατί είναι ουσιαστικό β΄ κλ. ενικού αριθμού.' },
        { l:'tradidit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'trado, tradidi, traditum, tradere (3) — παραδίδω', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας, εκφερόμενη με προστακτική.', kids:[
        { l:'Tu', r:'Υποκείμενο', to:'στο investiga', g:'ονομ. ενικ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ' },
        { l:'hominem', r:'Αντικείμενο', to:'στο investiga', g:'αιτ. ενικ., αρσ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
        { l:'investiga', r:'Ρήμα', g:'β΄ ενικ. προστ. ενεστ. ενεργ. φωνής', d:'investigo, investigavi, investigatum, investigare (1) — αναζητώ τα ίχνη', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (παρενθετική)', note:'Κύρια παρενθετική πρόταση κρίσης.', kids:[
        { l:'quaeso', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. (ελλειπτικό ρήμα)', d:'quaeso, quaesere — παρακαλώ', note:'Εύχρηστο μόνο στους τύπους quaeso (α΄ ενικ.) και quaesumus (α΄ πληθ.), παρενθετικά, για μετριασμό της προσταγής. Εννοούμενο υποκ.: (ego).', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας, εκφερόμενη με προστακτική.', kids:[
        { l:'summa', r:'Επιθετικός προσδ.', to:'στο diligentia', g:'αφαιρ. ενικ., θηλ. — επίθ. β΄ κλ. (υπερθετικός)', d:'summus, -a, -um — πάρα πολύ μεγάλος, ύψιστος (υπερθ. του superus)' },
        { l:'-que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός, εγκλιτικός) σύνδεσμος', d:'-que — και' },
        { l:'diligentia', r:'Αφαιρετική (οργανική) του τρόπου', to:'στο mitte', g:'αφαιρ. ενικ., θηλ.', d:'diligentia, -ae (θηλ. α΄) — η φροντίδα, επιμέλεια' },
        { l:'vel', r:'Σύνδεσμος', g:'διαζευκτικός (παρατακτικός) σύνδεσμος', d:'vel — είτε', note:'Πρώτο σκέλος του «vel ... vel».' },
        { l:'Romam', r:'Αιτιατική (απρόθετη) της κίνησης σε τόπο', to:'στο mitte', g:'αιτ. ενικ., θηλ.', d:'Roma, -ae (θηλ. α΄) — η Ρώμη', note:'Απρόθετη, γιατί είναι όνομα πόλης.' },
        { l:'mitte', r:'Ρήμα', g:'β΄ ενικ. προστ. ενεστ. ενεργ. φωνής', d:'mitto, misi, missum, mittere (3) — στέλνω' }
      ]},
      { l:'vel', r:'Σύνδεσμος', g:'διαζευκτικός (παρατακτικός) σύνδεσμος', d:'vel — είτε', note:'Δεύτερο σκέλος του «vel ... vel»· συνδέει τις δύο κύριες προτάσεις (mitte / deduc).', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας, εκφερόμενη με προστακτική.', kids:[
        { l:'Epheso', r:'Αφαιρετική (απρόθετη) της κίνησης από τόπο', to:'στη μτχ. rediens', g:'αφαιρ. ενικ., θηλ.', d:'Ephesus, -i (θηλ. β΄) — η Έφεσος', note:'Απρόθετη, γιατί είναι όνομα πόλης.' },
        { l:'rediens', r:'Επιρρ. χρονική μετοχή (συνημμένη στο εννοούμενο υποκ. tu)', to:'στο deduc', g:'ονομ. ενικ., αρσ. — τριτόκλιτη μτχ. ενεστ. ενεργ. φωνής', d:'redeo, redii (redivi), reditum, redire (< red + eo) — επιστρέφω', note:'Δηλώνει το σύγχρονο ως μτχ. ενεστ.' },
        { l:'tecum', r:'Εμπρόθετος προσδ. της συνοδείας', to:'στο deduc', g:'cum (πρόθ. + αφαιρ.) + te (= cum te)', d:'cum — μαζί με· tu — εσύ· tecum = μαζί σου', note:'Η πρόθεση cum, όταν συντάσσεται με αφαιρετική προσωπικών αντωνυμιών, ακολουθεί εγκλιτικά (tecum, secum).' },
        { l:'(tu)', r:'Υποκείμενο (εννοούμενο)', to:'στο deduc', g:'ονομ. ενικ.', d:'tu — εσύ' },
        { l:'(hominem)', r:'Αντικείμενο (εννοούμενο)', to:'στο deduc', g:'αιτ. ενικ., αρσ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
        { l:'deduc', r:'Ρήμα', g:'β΄ ενικ. προστ. ενεστ. ενεργ. φωνής', d:'deduco, deduxi, deductum, deducere (< de + duco, 3) — οδηγώ, φέρνω', note:'Το β΄ ενικ. προστ. ενεστ. σχηματίζεται χωρίς την κατάληξη -e (duc, deduc)· ομοίως dic, fac, fer.', a:'.' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση επιθυμίας, εκφερόμενη με έκφραση απαγόρευσης.', kids:[
        { l:'Noli', r:'Ρήμα', g:'β΄ ενικ. προστ. ενεστ. του ανώμαλου nolo', d:'nolo, nolui, —, nolle — δεν θέλω', note:'noli + απαρέμφατο = έκφραση απαγόρευσης (= ne spectaveris).' },
        { l:'(tu)', r:'Υποκείμενο (εννοούμενο)', to:'στο Noli', g:'ονομ. ενικ.', d:'tu — εσύ' },
        { l:'spectare', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο Noli (ταυτοπροσωπία)', g:'απαρέμφατο ενεστ. ενεργ. φωνής', d:'specto, spectavi, spectatum, spectare (1) — κοιτάζω, προσέχω' },
        { type:'sub', key:'plagia', label:'Πλάγια ερωτηματική', note:'Δευτ. ουσιαστική πλάγια ερωτηματική πρόταση μερικής άγνοιας· λειτουργεί ως αντικείμενο στο απαρέμφατο spectare της κύριας. Εισάγεται με την ερωτηματική αντων. quanti και εκφέρεται με υποτακτική (sit), γιατί η εξάρτηση δίνει υποκειμενική χροιά· χρόνου ενεστ., γιατί εξαρτάται από αρκτικό χρόνο και δηλώνει το σύγχρονο στο παρόν.', kids:[
          { l:'quanti', r:'Γενική κατηγορηματική της αξίας', to:'στο homo (μέσω του sit)', g:'γεν. ενικ., ουδ. — ερωτηματική αντων.', d:'quantus, quanta, quantum — πόσος, -η, -ο' },
          { l:'homo', r:'Υποκείμενο', to:'στο sit', g:'ονομ. ενικ., αρσ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
          { l:'sit', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ.', d:'sum, fui, —, esse — είμαι', a:'.' }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Parvi', r:'Επιθετικός προσδ.', to:'στο preti', g:'γεν. ενικ., ουδ. — επίθ. β΄ κλ.', d:'parvus, -a, -um — μικρός' },
        { l:'enim', r:'Σύνδεσμος', g:'αιτιολογικός (παρατακτικός) σύνδεσμος', d:'enim — γιατί, δηλαδή' },
        { l:'preti', r:'Γενική κατηγορηματική της αξίας', to:'στο «qui tam nihili est» (μέσω του est)', g:'γεν. ενικ., ουδ.', d:'pretium, -ii/-i (ουδ. β΄) — η αξία, η τιμή' },
        { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, —, esse — είμαι', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική (υποθετική)', note:'Δευτ. αναφορική υποθετική πρόταση· λειτουργεί ως υποκείμενο στο est της κύριας. Εισάγεται με την αναφορική αντων. qui και εκφέρεται με οριστική. Σχηματίζει, με απόδοση την κύρια, υποθετικό λόγο του α΄ είδους (ανοιχτή υπόθεση στο παρόν): Υπόθεση: qui tam nihili est / Απόδοση: Parvi enim preti est.', kids:[
          { l:'qui', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ., αρσ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'tam', r:'Επιρρ. προσδ. του ποσού (επιτείνει τη σημασία του nihili)', to:'στο nihili', g:'ποσοτικό επίρρημα', d:'tam — τόσο' },
          { l:'nihili', r:'Γενική κατηγορηματική της αξίας', to:'στο qui (μέσω του est)', g:'γεν. ενικ., ουδ.', d:'nihilum, -i (ουδ. β΄) — το τίποτα' },
          { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, —, esse — είμαι', a:'.' }
        ]}
      ]}
    ]},

    { n: 7, kids: [
      { l:'Sed', r:'Σύνδεσμος', g:'αντιθετικός (παρατακτικός) σύνδεσμος', d:'sed — αλλά', conn:true, a:',' },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'propter', r:'Πρόθεση (propter + αιτ.)', to:'στα scelus, audaciam', g:'πρόθεση + αιτ.', d:'propter — εξαιτίας' },
        { l:'servi', r:'Γενική υποκειμενική', to:'στα scelus, audaciam', g:'γεν. ενικ., αρσ.', d:'servus, -i (αρσ. β΄) — ο δούλος' },
        { l:'scelus', r:'Εμπρόθετος προσδ. της αιτίας (εξωτερικού αναγκαστικού αιτίου)', to:'στο est adfectus', g:'αιτ. ενικ., ουδ.', d:'scelus, sceleris (ουδ. γ΄) — το έγκλημα, η ελεεινή πράξη' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός, καταφατικός) σύνδεσμος', d:'et — και' },
        { l:'audaciam', r:'Εμπρόθετος προσδ. της αιτίας (εξωτερικού αναγκαστικού αιτίου)', to:'στο est adfectus', g:'αιτ. ενικ., θηλ.', d:'audacia, -ae (θηλ. α΄) — το θράσος', note:'Εξυπακούεται η πρόθεση propter.', a:',' },
        { l:'tanto', r:'Επιθετικός προσδ.', to:'στο dolore', g:'αφαιρ. ενικ., αρσ. — δεικτική συσχετική αντων.', d:'tantus, tanta, tantum — τόσος, -η, -ο', note:'Προεξαγγέλλει τη συμπερασματική πρόταση (tanto ... ut).' },
        { l:'dolore', r:'Αφαιρετική (οργανική) του μέσου', to:'στο est adfectus', g:'αφαιρ. ενικ., αρσ.', d:'dolor, doloris (αρσ. γ΄) — η οργή, ο πόνος' },
        { l:'Aesopus', r:'Υποκείμενο', to:'στο est adfectus', g:'ονομ. ενικ., αρσ.', d:'Aesopus, -i (αρσ. β΄) — ο Αίσωπος' },
        { l:'est adfectus', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής', d:'adficio/afficio, adfeci, adfectum, adficere (< ad + facio, 3 σε -io) — περιβάλλω· tanto dolore adfectus est = τόσο οργίστηκε', a:',' },
        { type:'sub', key:'symperasmatiki', label:'Συμπερασματική', note:'Δευτ. επιρρηματική συμπερασματική πρόταση· λειτουργεί ως επιρρ. προσδ. του αποτελέσματος στο est adfectus της κύριας. Εισάγεται με τον συμπερασματικό σύνδεσμο ut (αρνητική: ut ... nihil), γιατί προηγείται η δεικτική αντων. tanto. Εκφέρεται με υποτακτική (δυνητική), γιατί στα λατινικά το αποτέλεσμα θεωρείται μια υποκειμενική κατάσταση· χρόνου ενεστ. (possit), γιατί εξαρτάται από αρκτικό χρόνο (est adfectus: παρακείμ. με σημ. ενεστ.) και αναφέρεται στο παρόν-μέλλον.', kids:[
          { l:'ut', r:'Σύνδεσμος', g:'συμπερασματικός σύνδεσμος', d:'ut — ώστε' },
          { l:'nihil', r:'Υποκείμενο (και α΄ όρος σύγκρισης)', to:'στα possit, esse', g:'ονομ. ενικ., ουδ. — αόριστη ουσιαστική αντων.', d:'nihil — τίποτα' },
          { l:'ei', r:'Δοτική αντικειμενική', to:'στο gratius', g:'δοτ. ενικ., αρσ. — δεικτ. (επαναληπτ.) αντων.', d:'is, ea, id — αυτός (ei = Aesopo)' },
          { l:'gratius', r:'Κατηγορούμενο', to:'στο nihil (μέσω του esse)', g:'ονομ. ενικ., ουδ. — επίθ. β΄ κλ. (συγκριτικός βαθμός)', d:'gratus, -a, -um — ευχάριστος· συγκρ. gratior, -ius' },
          { l:'possit', r:'Ρήμα', g:'γ΄ ενικ. υποτ. ενεστ. (δυνητική)', d:'possum, potui, —, posse (< pot + sum) — μπορώ' },
          { l:'esse', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο possit', g:'απαρέμφατο ενεστ.', d:'sum, fui, —, esse — είμαι' },
          { l:'quam', r:'Συγκριτικό μόριο', g:'εισάγει τον β΄ όρο σύγκρισης', d:'quam — παρά, από' },
          { l:'recuperatio', r:'Β΄ όρος σύγκρισης (με quam, ομοιόπτωτα — ονομ.)', to:'στο gratius (α΄ όρος: nihil)', g:'ονομ. ενικ., θηλ.', d:'recuperatio, recuperationis (θηλ. γ΄) — η επανάκτηση' },
          { l:'fugitivi', r:'Γενική αντικειμενική', to:'στο recuperatio', g:'γεν. ενικ., αρσ.', d:'fugitivus, -i (αρσ. β΄) — ο δραπέτης', a:'.' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Aesopi nostri Licinus servus tibi notus Roma Athenas fugit.", el:"Ο Λίκινος, ο δούλος του δικού μας Αισώπου, που είναι γνωστός σε σένα, δραπέτευσε από τη Ρώμη στην Αθήνα." },
    { n:2, la:"Is Athenis apud Patronem Epicureum paucos menses pro libero fuit, inde in Asiam abiit.", el:"Αυτός για λίγους μήνες έμεινε ως ελεύθερος στην Αθήνα, κοντά στον Πάτρωνα τον Επικούρειο, από εκεί έφυγε στην Ασία." },
    { n:3, la:"Postea Plato quidam Sardianus, cum eum fugitivum esse ex Aesopi litteris cognovisset, hominem comprehendit et in custodiam Ephesi tradidit.", el:"Αργότερα κάποιος Πλάτωνας από τις Σάρδεις, όταν είχε μάθει από επιστολή του Αισώπου ότι αυτός ήταν δραπέτης, συνέλαβε τον άνθρωπο και τον παρέδωσε στη φυλακή στην Έφεσο." },
    { n:4, la:"Tu hominem investiga, quaeso, summaque diligentia vel Romam mitte vel Epheso rediens tecum deduc.", el:"Εσύ αναζήτησε τα ίχνη του ανθρώπου, παρακαλώ, και με πάρα πολύ μεγάλη φροντίδα είτε στείλε (τον) στη Ρώμη είτε φέρε (τον) μαζί σου, όταν επιστρέφεις από την Έφεσο." },
    { n:5, la:"Noli spectare quanti homo sit.", el:"Μη σε απασχολήσει πόσο αξίζει ο άνθρωπος." },
    { n:6, la:"Parvi enim preti est, qui tam nihili est.", el:"Γιατί είναι μικρής αξίας, όποιος είναι τόσο τιποτένιος." },
    { n:7, la:"Sed, propter servi scelus et audaciam, tanto dolore Aesopus est adfectus, ut nihil ei gratius possit esse quam recuperatio fugitivi.", el:"Αλλά, εξαιτίας της ελεεινής πράξης και του θράσους του δούλου, τόσο οργίστηκε ο Αίσωπος, ώστε τίποτα δε θα μπορούσε να είναι πιο ευχάριστο σε αυτόν από την επανάκτηση του δραπέτη." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"Roma, -ae", note:"μόνο ενικ. (κύριο όνομα)" },
        { form:"Athenae, -arum", note:"μόνο πληθ." },
        { form:"Asia, -ae", note:"μόνο ενικ. (κύριο όνομα)" },
        { form:"litterae, -arum", note:"ετερόσημο· littera, -ae = το γράμμα του αλφαβήτου· litterae, -arum = η επιστολή, τα γράμματα" },
        { form:"custodia, -ae" },
        { form:"diligentia, -ae" },
        { form:"audacia, -ae", note:"δεν σχηματίζει πληθ." }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Aesopus, -i", note:"μόνο ενικ. (κύριο όνομα)" },
        { form:"Licinus, -i", note:"μόνο ενικ. (κύριο όνομα)" },
        { form:"servus, -i" },
        { form:"fugitivus, -i" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"Ephesus, -i", note:"μόνο ενικ. (κύριο όνομα)" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"pretium, -ii / -i", note:"γεν. ενικ. σε -ii και -i (με συναίρεση)" },
        { form:"nihilum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Patro / Patron, Patronis", note:"κύριο όνομα· δεύτ. τύποι Patro/Patron, Patronem/Patrona" },
        { form:"mensis, mensis", note:"γεν. πληθ. mensum/mensium· αιτ. πληθ. menses/mensis" },
        { form:"Plato / Platon, Platonis", note:"κύριο όνομα· δεύτ. τύποι Plato/Platon, Platonem/Platona" },
        { form:"homo, hominis", note:"εδώ γ΄ κλ." },
        { form:"dolor, doloris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"recuperatio, recuperationis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"scelus, sceleris" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"Epicureus, -a, -um", note:"δεν σχηματίζει παραθετικά (παράγωγο από ουσιαστικό < Epicurus)" },
      { form:"paucus, -a, -um" },
      { form:"liber, libera, liberum" },
      { form:"Sardianus, -a, -um", note:"δεν σχηματίζει παραθετικά (δηλώνει καταγωγή)" },
      { form:"superus, -a, -um", note:"σχηματίζει διπλό υπερθετικό (supremus & summus)" },
      { form:"parvus, -a, -um" },
      { form:"gratus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"paucus, -a, -um", comp:"paucior, -ior, -ius", sup:"paucissimus, -a, -um" },
      { pos:"liber, libera, liberum", comp:"liberior, -ior, -ius", sup:"liberrimus, -a, -um" },
      { pos:"superus, -a, -um", comp:"superior, -ior, -ius", sup:"supremus, -a, -um / summus, -a, -um" },
      { pos:"parvus, -a, -um", comp:"minor, -or, -us", sup:"minimus, -a, -um" },
      { pos:"gratus, -a, -um", comp:"gratior, -ior, -ius", sup:"gratissimus, -a, -um" },
      { pos:"Epicureus, -a, -um", comp:"—", sup:"—" },
      { pos:"Sardianus, -a, -um", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"noster, nostra, nostrum", kind:"Κτητική", extra:"α΄ προσ., πολλοί κτήτορες" },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσώπου" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική· κλίνεται όπως το qui, quae, quod (τελικό m → n: quendam, quarundam)" },
    { form:"quantus, quanta, quantum", kind:"Ερωτηματική", extra:"" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"tantus, tanta, tantum", kind:"Δεικτική", extra:"συσχετική" },
    { form:"nihil", kind:"Αόριστη", extra:"ουσιαστική· άκλιτη (ονομ. & αιτ. ενικ.)· λοιποί τύποι από το nulla res" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"investigo", perf:"investigavi", sup:"investigatum", inf:"investigare", note:"" },
      { pres:"specto", perf:"spectavi", sup:"spectatum", inf:"spectare", note:"" },
      { pres:"nosco", perf:"novi", sup:"notum", inf:"noscere", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[] },
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"fugio", perf:"fugi", sup:"fugitum", inf:"fugere", note:"15 σε -io" },
      { pres:"cognosco", perf:"cognovi", sup:"cognitum", inf:"cognoscere", note:"" },
      { pres:"comprehendo", perf:"comprehendi", sup:"comprehensum", inf:"comprehendere", note:"" },
      { pres:"trado", perf:"tradidi", sup:"traditum", inf:"tradere", note:"" },
      { pres:"mitto", perf:"misi", sup:"missum", inf:"mittere", note:"" },
      { pres:"deduco", perf:"deduxi", sup:"deductum", inf:"deducere", note:"< de + duco· προστ. deduc" },
      { pres:"adficio / afficio", perf:"adfeci / affeci", sup:"adfectum / affectum", inf:"adficere / afficere", note:"15 σε -io· < ad + facio" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"Ανώμαλα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό — είμαι" },
      { pres:"abeo", perf:"abii (abivi)", sup:"abitum", inf:"abire", note:"< ab + eo" },
      { pres:"redeo", perf:"redii (redivi)", sup:"reditum", inf:"redire", note:"< red + eo" },
      { pres:"nolo", perf:"nolui", sup:"—", inf:"nolle", note:"< ne + volo" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"< pot + sum" },
      { pres:"quaeso", perf:"—", sup:"—", inf:"—", note:"ελλειπτικό (quaeso, quaesumus)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Δοτική ποιητ. αιτίου", title:"tibi notus", body:"Το ποιητικό αίτιο εκφέρεται με δοτική προσωπική (tibi) και όχι με a/ab + αφαιρετική, γιατί εξαρτάται από συντελικό χρόνο παθ. φωνής (notus: μτχ. παρακειμένου)." },
    { tag:"Ονόματα πόλεων", title:"Roma, Athenas, Athenis, Ephesi, Romam, Epheso", body:"Οι προσδιορισμοί του τόπου στα ονόματα πόλεων τίθενται απρόθετα. Στάση σε τόπο: αφαιρετική για πληθ./γ΄ κλ. (Athenis) και γενική για α΄-β΄ κλ. ενικού (Ephesi)· κίνηση σε/από τόπο με απλή αιτιατική/αφαιρετική (Athenas, Romam / Roma, Epheso)." },
    { tag:"Σύνδεσμος cum", title:"cum ιστορικός-διηγηματικός", body:"Το cum + υποτακτική (cognovisset) είναι ιστορικός-διηγηματικός· υπογραμμίζει τη βαθύτερη σχέση αιτίου-αιτιατού της δευτερεύουσας με την κύρια· τηρείται ακολουθία χρόνων (προτερόχρονο: υπερσυντέλικος)." },
    { tag:"Γενική αξίας", title:"quanti, nihili, preti", body:"Η αφηρημένη αξία δηλώνεται με γενική κατηγορηματική της αξίας (quanti homo sit, parvi preti est, qui tam nihili est)· η συγκεκριμένη αξία θα δηλωνόταν με αφαιρετική." },
    { tag:"Απαγόρευση", title:"noli spectare", body:"Η απαγόρευση εκφράζεται με noli/nolite + απαρέμφατο (noli spectare = ne spectaveris)." },
    { tag:"Συμπερασματική", title:"tanto dolore ... ut", body:"Η δεικτική συσχετική tanto προεξαγγέλλει τη συμπερασματική πρόταση, που εισάγεται με ut (αρνητική: ut ... nihil) και εκφέρεται με υποτακτική (δυνητική possit)· παρατηρείται ιδιομορφία στην ακολουθία των χρόνων." },
    { tag:"Προστακτική άνευ -e", title:"deduc", body:"Το β΄ ενικ. προστ. ενεστ. των duco (deduco), dico, facio (απλών) και fero σχηματίζεται χωρίς την κατάληξη -e: duc/deduc, dic, fac, fer." }
  ],

  // ── ΜΕΡΟΣ 8: ΩΣ ΠΡΟΣ ΤΟ ΣΥΝΤΑΚΤΙΚΟ (ΜΕΤΑΤΡΟΠΕΣ) ─────────────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"Aesopi nostri Licinus servus tibi notus ... fugit", to:"Licinus, qui notus erat (qui + οριστ. υπερσυντελίκου), ... fugit", note:"notus: επιθετική μτχ. παρακειμένου· δηλώνει το προτερόχρονο (εξάρτηση από ιστορικό χρόνο fugit)." },
      { from:"... vel Epheso rediens tecum deduc", to:"... vel dum redis (dum + οριστ. ενεστ.) tecum deduc", note:"rediens: επιρρ. χρονική μτχ. ενεστ.· δηλώνει το σύγχρονο (παράλληλη διάρκεια)." }
    ]},
    { id:"Β", label:"Μετατροπή κυρίων προτάσεων σε μετοχικές φράσεις", items:[
      { from:"Postea Plato quidam Sardianus, – , hominem comprehendit et in custodiam Ephesi tradidit", to:"Postea Plato quidam Sardianus, hominem comprehensum et in custodiam Ephesi tradidit", note:"Μετατροπή της 1ης κύριας σε επιρρ. χρονική μετοχή, συνημμένη στο hominem (εννοούμενο αντικ. του tradidit)." },
      { from:"Tu hominem investiga, quaeso, summaque diligentia Romam mitte ...", to:"Tu hominem investigans, ... mitte ...", note:"Μετατροπή της 1ης κύριας σε χρονική μετοχή, συνημμένη στο υποκ. Tu του mitte." }
    ]},
    { id:"Γ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Postea Plato quidam Sardianus, – , hominem comprehendit et in custodiam Ephesi tradidit", to:"Postea a Platone quodam Sardiano, – , homo comprehensus est et in custodiam Ephesi traditus est" },
      { from:"Tu hominem investiga, quaeso, summaque diligentia vel Romam mitte vel Epheso rediens tecum deduc", to:"A te homo investigetur, quaeso, summaque diligentia vel Romam mittatur vel Epheso redeunte tecum deducatur" }
    ]},
    { id:"Δ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"Aesopi nostri Licinus servus ... notus ... fugit. Is ... pro libero fuit, inde ... abiit. Postea Plato quidam Sardianus, cum eum ... cognovisset, hominem comprehendit et ... tradidit", to:"Cicero narrat / narravit Aesopi sui Licinum servum illi notum ... fugisse· eum ... pro libero fuisse, inde ... abisse. Postea Platonem quendam Sardianum, cum eum ... cognovisset, hominem comprehendisse et ... tradidisse", note:"εξάρτηση: Cicero narrat / narravit" },
      { from:"Tu hominem investiga ... summaque diligentia vel Romam mitte vel ... tecum deduc", to:"Cicero hortatur / hortatus est ut ille hominem investiget / investigaret summaque diligentia vel ... mittat / mitteret vel ... cum illo deducat / deduceret", note:"εξάρτηση: Cicero hortatur / hortatus est" },
      { from:"Noli spectare quanti homo sit", to:"Cicero adhortatur / adhortatus est ne ille spectet / spectaret quanti homo sit / esset", note:"εξάρτηση: Cicero adhortatur / adhortatus est" },
      { from:"Parvi enim preti est, qui tam nihili est", to:"Cicero putat / putavit parvi enim preti esse eum, qui ... sit / esset", note:"εξάρτηση: Cicero putat / putavit" },
      { from:"Sed, propter servi scelus ..., ... Aesopus est adfectus, ut nihil ei gratius possit esse quam recuperatio fugitivi", to:"Cicero scribit / scripsit propter servi scelus ..., ... Aesopum esse adfectum, ut nihil ei gratius possit / posset esse ... fugitivi", note:"εξάρτηση: Cicero scribit / scripsit" }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΟΙ ΣΥΣΧΕΤΙΣΜΟΙ ────────────────────────────────────
  etymology: [
    { la:"Aesopi, Aesopus", el:"Αίσωπος." },
    { la:"Licinus", el:"Λικίνος." },
    { la:"servus, servi", el:"σερβίρω, σερβιτόρος, σερβίτσιο (< ιταλ.) // σέρβις (< αγγλ.), σερβίς (< γαλλ.)." },
    { la:"notus (nosco)", el:"νέος· νότα (< λατ.) // (αγγλ.) new." },
    { la:"Roma, Romam", el:"Ρώμη, Ρωμαίος, ρωμαϊκός, ρωμιός." },
    { la:"Athenas, Athenis", el:"Ἀθῆναι, Αθήνα, Αθηναίος." },
    { la:"fugit, fugitivum, fugitivi", el:"φεύγω, φυγή // (αγγλ.) fugitive (= φυγάς)." },
    { la:"Patronem", el:"Πάτρωνας." },
    { la:"Epicureum", el:"Επικούρειος, Επίκουρος." },
    { la:"paucos (paulus), parvus", el:"παῦρος (= μικρός, λίγος)." },
    { la:"menses", el:"μήν· μήνας // (αγγλ.) month, (ισπαν.) mes." },
    { la:"libero", el:"(γαλλ.) libre (= ελεύθερος) // (αγγλ.) liberty (= ελευθερία), libero (= παίχτης με ελεύθερη θέση στο γήπεδο)." },
    { la:"Asiam", el:"Ασία." },
    { la:"abiit, rediens", el:"εἶμι // ιταμός." },
    { la:"Plato", el:"Πλάτων." },
    { la:"Sardianus", el:"Σαρδιανός, Σάρδεις." },
    { la:"esse, sit, est", el:"εἰμί." },
    { la:"litteris", el:"(γαλλ.) lettre (= γράμμα), littérature (= λογοτεχνία)." },
    { la:"cognovisset", el:"γι-γνώσκω." },
    { la:"hominem, homo", el:"ουμανισμός (< γαλλ.)." },
    { la:"comprehendit", el:"(αγγλ.) comprehend (= κατανοώ, περιλαμβάνω)." },
    { la:"custodiam", el:"κουστωδία." },
    { la:"Ephesi, Epheso", el:"Έφεσος." },
    { la:"tradidit", el:"δί-δω-μι (= παράδοση) // (γαλλ.) tradition." },
    { la:"investiga", el:"(αγγλ.) vestige (= κατάλοιπο) // (γαλλ.) investigation (= έρευνα, εξέταση)." },
    { la:"diligentia", el:"λέγω." },
    { la:"mitte", el:"(αγγλ.) mission (= αποστολή)." },
    { la:"de-duc", el:"(αγγλ.) ad-ductor (= προσαγωγός μυς) // (γαλλ.) con-ducteur (= οδηγός)." },
    { la:"noli [< ne- + volo]", el:"βούλομαι // (αγγλ.) volunteer (= εθελοντής)." },
    { la:"spectare", el:"(αγγλ.) pro-spect (= προοπτική, άποψη) // σπέκουλα (= κερδοσκοπία), σπεκουλαδόρος, σπεκουλάρω (< ιταλ.)." },
    { la:"preti", el:"πιπράσκω // (γαλλ.) prix (= τιμή), (αγγλ.) price." },
    { la:"scelus", el:"(γαλλ.) scélérat (= κάθαρμα / αχρείος)." },
    { la:"audaciam", el:"(γαλλ.) audacieux (= τολμηρός), audace (= θράσος)." },
    { la:"dolore", el:"(αγγλ.) dolor (= θλίψη, πόνος)." },
    { la:"adfectus", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο)." },
    { la:"gratius", el:"(αγγλ.) grateful (= ευγνώμων) // (γαλλ.) con-gratuler (= συγχαίρω)." },
    { la:"possit [potis (= δυνατός) + sum]", el:"πόσις, δεσ-πότης («κύριος σπιτιού»)." },
    { la:"recuperatio", el:"(ιταλ.) capire (= καταλαβαίνω) // (γαλλ.) récupération (= επανάκτηση)." }
  ]
};

export default UNIT;
