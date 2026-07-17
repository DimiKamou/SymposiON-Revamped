export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 30,
  title: "Ο Λικίνιος Μουρήνας και τα ήθη της Ανατολής",
  latinTitle: "Lectio XXX (Lectio Tricesima)",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια (α΄ σκέλος «et … et»)', kids:[
        { l:'Hic', r:'Υποκείμενο', to:'στο fuit', g:'ονομ. ενικ., αρσ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, -ή, -ό', note:'Κοινό υποκείμενο και των δύο συνδεόμενων κύριων προτάσεων (et … et fuit).' },
        { l:'vero', r:'Σύνδεσμος', g:'παρατακτικός αντιθετικός (μεταβατικός) σύνδεσμος', d:'vero — όμως' },
        { l:'iudices', r:'Κλητική προσφώνηση', g:'κλητ. πληθ.', d:'iudex, iudicis (αρσ. γ΄) — ο δικαστής', a:',' },
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'et — και', note:'Πρώτο σκέλος του «et … et».', conn:true },
        { l:'fuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου του ανώμαλου - βοηθητικού', d:'sum, fui, —, esse — είμαι' },
        { l:'in Asia', k:'Asia', r:'Εμπρόθετος επιρρ. προσδ. στάσης σε τόπο', to:'στο fuit', g:'in (πρόθ. + αφαιρ.) + Asia (αφαιρ. ενικ.)', d:'in — σε· Asia, -ae (θηλ. α΄) — η Ασία' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (β΄ σκέλος «et … et»)', note:'Κύρια πρόταση κρίσης, συνδεόμενη με την προηγούμενη παρατακτικά συμπλεκτικά (et).', kids:[
        { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'et — και', note:'Δεύτερο σκέλος του «et … et».', conn:true },
        { l:'viro', r:'Δοτική προσωπική χαριστική', to:'στο fuit', g:'δοτ. ενικ.', d:'vir, viri (αρσ. β΄) — ο άντρας' },
        { l:'fortissimo', r:'Επιθετικός προσδ.', to:'στο viro', g:'δοτ. ενικ., αρσ. — υπερθετικός βαθμός του διακατάληκτου επιθ. fortis, -is, -e (γ΄ κλ.)', d:'fortis, -is, -e — γενναίος· fortissimus, -a, -um — γενναιότατος' },
        { l:'patri', r:'Επεξήγηση', to:'στο viro', g:'δοτ. ενικ.', d:'pater, patris (αρσ. γ΄) — ο πατέρας' },
        { l:'suo', r:'Επιθετικός προσδ.', to:'στο patri', g:'δοτ. ενικ., αρσ. — κτητική αντων. γ΄ προσ. (ένας κτήτορας)', d:'suus, sua, suum — ο δικός του', note:'Το suo αναφέρεται στο εννοούμενο υποκείμενο hic (άμεση / ευθεία αυτοπάθεια).' },
        { l:'magno', r:'Επιθετικός προσδ.', to:'στο adiumento', g:'δοτ. ενικ., ουδ. — επίθ. β΄ κλ.', d:'magnus, -a, -um — μεγάλος' },
        { l:'adiumento', r:'Δοτική κατηγορηματική του σκοπού', to:'από το fuit (στο υποκ. hic)', g:'δοτ. ενικ.', d:'adiumentum, -i (ουδ. β΄) — η βοήθεια' },
        { l:'in periculis', k:'periculum', r:'Εμπρόθετος επιρρ. προσδ. της κατάστασης', to:'στο fuit', g:'in (πρόθ. + αφαιρ.) + periculis (αφαιρ. πληθ., ουδ.)', d:'in — σε· periculum, -i (ουδ. β΄) — ο κίνδυνος', a:',' },
        { l:'solacio', r:'Δοτική κατηγορηματική του σκοπού', to:'από το fuit (στο υποκ. hic)', g:'δοτ. ενικ.', d:'solacium, -ii / -i (ουδ. β΄) — η παρηγοριά' },
        { l:'in laboribus', k:'labor', r:'Εμπρόθετος επιρρ. προσδ. της κατάστασης', to:'στο fuit', g:'in (πρόθ. + αφαιρ.) + laboribus (αφαιρ. πληθ.)', d:'in — σε· labor, laboris (αρσ. γ΄) — ο μόχθος', a:',' },
        { l:'gratulationi', r:'Δοτική κατηγορηματική του σκοπού', to:'από το fuit (στο υποκ. hic)', g:'δοτ. ενικ.', d:'gratulatio, gratulationis (θηλ. γ΄) — η έκφραση συγχαρητηρίων' },
        { l:'in victoria', k:'victoria', r:'Εμπρόθετος επιρρ. προσδ. της κατάστασης', to:'στο fuit', g:'in (πρόθ. + αφαιρ.) + victoria (αφαιρ. ενικ.)', d:'in — σε· victoria, -ae (θηλ. α΄) — η νίκη' },
        { l:'fuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου του ανώμαλου - βοηθητικού', d:'sum, fui, —, esse — είμαι', a:'.' }
      ]}
    ]},

    { n: 2, kids: [
      { l:'Et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός μεταβατικός (εδώ) σύνδεσμος', d:'et — και', conn:true },
      { type:'sub', key:'ypothetiki', label:'Υποθετική', note:'Δευτ. επιρρηματική υποθετική πρόταση. Εισάγεται με τον υποθετικό σύνδεσμο si (καταφατική) και εκφέρεται με οριστική. Με απόδοση την κύρια «(Murenam laudare) debemus» σχηματίζει υποθετικό λόγο α΄ είδους — ανοικτή υπόθεση στο παρόν. Υπόθεση: si habet· Απόδοση: debemus (laudare).', kids:[
        { l:'si', r:'Σύνδεσμος', g:'υποτακτικός υποθετικός (καταφατικός) σύνδεσμος', d:'si — αν' },
        { l:'habet', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'habeo, habui, habitum, habere (2) — έχω' },
        { l:'Asia', r:'Υποκείμενο', to:'στο habet', g:'ονομ. ενικ.', d:'Asia, -ae (θηλ. α΄) — η Ασία' },
        { l:'suspicionem', r:'Αντικείμενο', to:'στο habet', g:'αιτ. ενικ.', d:'suspicio, suspicionis (θηλ. γ΄) — η υποψία' },
        { l:'quandam', r:'Επιθετικός προσδ.', to:'στο suspicionem', g:'αιτ. ενικ., θηλ. — αόριστη επιθετική αντων.', d:'quidam, quaedam, quoddam — κάποιος, -α, -ο' },
        { l:'luxuriae', r:'Γενική αντικειμενική', to:'στο suspicionem', g:'γεν. ενικ.', d:'luxuria, -ae (θηλ. α΄) — η τρυφή, η πολυτέλεια', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης· απόδοση του υποθετικού λόγου.', kids:[
        { l:'Murenam', r:'Αντικείμενο', to:'στο απαρέμφατο laudare', g:'αιτ. ενικ.', d:'Murena, -ae (αρσ. α΄) — ο Μουρήνας' },
        { l:'laudare', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο debemus (ταυτοπροσωπία· ενν. υποκ. nos)', g:'απαρέμφατο ενεστ. ενεργ. φωνής', d:'laudo, laudavi, laudatum, laudare (1) — επαινώ' },
        { l:'debemus', r:'Ρήμα', g:'α΄ πληθ. οριστ. ενεστ. ενεργ. φωνής', d:'debeo, debui, debitum, debere (2) — οφείλω', note:'Εννοούμενο υποκείμενο: nos.', a:',' }
      ]},
      { type:'sub', key:'aitiologiki', label:'Αιτιολογική', note:'Δευτ. επιρρηματική αιτιολογική πρόταση· λειτουργεί ως επιρρ. προσδ. της αιτίας στο debemus (laudare) της κύριας. Εισάγεται με τον αιτιολογικό σύνδεσμο quod και εκφέρεται με οριστική (αιτιολογία αντικειμενικά αποδεκτή), παρακειμένου (vidit) — δηλώνει το προτερόχρονο.', kids:[
        { l:'quod', r:'Σύνδεσμος', g:'υποτακτικός αιτιολογικός σύνδεσμος', d:'quod — γιατί' },
        { l:'Asiam', r:'Αντικείμενο', to:'στο vidit', g:'αιτ. ενικ.', d:'Asia, -ae (θηλ. α΄) — η Ασία', note:'Εννοούμενο υποκείμενο: Murena.' },
        { l:'vidit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'video, vidi, visum, videre (2) — βλέπω' }
      ]},
      { type:'sub', key:'aitiologiki', label:'Αιτιολογική (sed)', note:'Δευτ. επιρρηματική αιτιολογική πρόταση, συνδεόμενη με την προηγούμενη αιτιολογική παρατακτικά αντιθετικά (sed). Εισάγεται με εννοούμενο τον αιτιολογικό σύνδεσμο (quod) και εκφέρεται με οριστική παρακειμένου (vixit) — δηλώνει το προτερόχρονο.', kids:[
        { l:'sed', r:'Σύνδεσμος', g:'παρατακτικός αντιθετικός σύνδεσμος', d:'sed — αλλά', conn:true },
        { l:'in Asia', k:'Asia', r:'Εμπρόθετος επιρρ. προσδ. στάσης σε τόπο', to:'στο vixit', g:'in (πρόθ. + αφαιρ.) + Asia (αφαιρ. ενικ.)', d:'in — σε· Asia, -ae (θηλ. α΄) — η Ασία', note:'Εννοούμενο υποκείμενο: Murena.' },
        { l:'continenter', r:'Επιρρ. προσδ. του τρόπου', to:'στο vixit', g:'τροπικό επίρρημα (θετικός· βλ. continens)', d:'continenter — με εγκράτεια' },
        { l:'vixit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'vivo, vixi, victum, vivere (3) — ζω', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', note:'Κύρια πρόταση κρίσης. Η αναφορική αντων. Quam στην αρχή περιόδου, ύστερα από ισχυρό σημείο στίξης, ισοδυναμεί με δεικτική (= eam) και εισάγει κύρια πρόταση (quam ob rem = γι΄ αυτόν τον λόγο).', kids:[
        { l:'Quam', r:'Επιθετικός προσδ.', to:'στο rem', g:'αιτ. ενικ., θηλ. — αναφορική (ως δεικτική) αντων.', d:'qui, quae, quod — ο οποίος· εδώ = is, ea, id (αυτός)', note:'quam ob rem = γι΄ αυτόν τον λόγο.' },
        { l:'ob', r:'Πρόθεση', g:'πρόθεση + αιτιατική', d:'ob — εξαιτίας' },
        { l:'rem', r:'Εμπρόθετος επιρρ. προσδ. του εξωτερικού αναγκαστικού αιτίου', to:'στο (non) obiecerunt', g:'αιτ. ενικ. (ob + rem)', d:'res, rei (θηλ. ε΄) — το πράγμα' },
        { l:'accusatores', r:'Υποκείμενο', to:'στο (non) obiecerunt', g:'ονομ. πληθ.', d:'accusator, accusatoris (αρσ. γ΄) — ο κατήγορος' },
        { l:'non', r:'Άρνηση', to:'στο obiecerunt', g:'αρνητικό μόριο', d:'non — δεν, όχι' },
        { l:'Asiae', r:'Γενική επεξηγηματική', to:'στο nomen', g:'γεν. ενικ.', d:'Asia, -ae (θηλ. α΄) — η Ασία' },
        { l:'nomen', r:'Άμεσο αντικείμενο', to:'στο (non) obiecerunt', g:'αιτ. ενικ., ουδ.', d:'nomen, nominis (ουδ. γ΄) — το όνομα' },
        { l:'Murenae', r:'Έμμεσο αντικείμενο', to:'στο (non) obiecerunt', g:'δοτ. ενικ.', d:'Murena, -ae (αρσ. α΄) — ο Μουρήνας' },
        { l:'obiecerunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής', d:'obicio, obieci, obiectum, obicere (σε -io, 3) — προσάπτω μομφή, κατηγορώ', note:'obicio + αιτ. + δοτ. = προσάπτω μομφή σε κάποιον.', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση, προσδιοριστική στον όρο Asiae της κύριας. Εισάγεται με την (εμπρόθετη) αναφορική αντων. ex qua (= ex Asia) και εκφέρεται με οριστική· εκφράζει το πραγματικό, παρακειμένου — αναφέρεται στο παρελθόν.', kids:[
          { l:'ex', r:'Πρόθεση', g:'πρόθεση + αφαιρετική', d:'ex — από' },
          { l:'qua', r:'Εμπρόθετος επιρρ. προσδ. της προέλευσης (ή της αιτίας)', to:'στο constituta est', g:'αφαιρ. ενικ., θηλ. — αναφορική αντων. (ex + qua)', d:'qui, quae, quod — ο οποίος', note:'ex qua = ex Asia.' },
          { l:'laus', r:'Υποκείμενο', to:'στο constituta est', g:'ονομ. ενικ.', d:'laus, laudis (θηλ. γ΄) — ο έπαινος' },
          { l:'familiae', r:'Δοτική προσωπική χαριστική', to:'στο constituta est', g:'δοτ. ενικ.', d:'familia, -ae (θηλ. α΄) — η οικογένεια' },
          { l:'memoria', r:'Υποκείμενο', to:'στο constituta est', g:'ονομ. ενικ.', d:'memoria, -ae (θηλ. α΄) — η μνήμη, η υστεροφημία' },
          { l:'generi', r:'Δοτική προσωπική χαριστική', to:'στο constituta est', g:'δοτ. ενικ.', d:'genus, generis (ουδ. γ΄) — το γένος' },
          { l:'honos', r:'Υποκείμενο', to:'στο constituta est', g:'ονομ. ενικ.', d:'honos και honor, honoris (αρσ. γ΄) — η τιμή' },
          { l:'et', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'et — και' },
          { l:'gloria', r:'Υποκείμενο', to:'στο constituta est', g:'ονομ. ενικ.', d:'gloria, -ae (θηλ. α΄) — η δόξα' },
          { l:'nomini', r:'Δοτική προσωπική χαριστική', to:'στο constituta est', g:'δοτ. ενικ.', d:'nomen, nominis (ουδ. γ΄) — το όνομα' },
          { l:'constituta est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου παθ. φωνής', d:'constituo, constitui, constitutum, constituere (3) — δημιουργώ', note:'Πολλά υποκείμενα· το ρήμα συμφωνεί με το πλησιέστερο (laus).', a:',' }
        ]}
      ]},
      { type:'main', key:'kyria', label:'Κύρια (sed)', note:'Κύρια πρόταση κρίσης, συνδεόμενη με την προηγούμενη (Quam ob rem … obiecerunt) παρατακτικά αντιθετικά (sed). Εννοούμενο ρήμα: obiecerunt· εννοούμενο υποκείμενο: accusatores.', kids:[
        { l:'sed', r:'Σύνδεσμος', g:'παρατακτικός αντιθετικός σύνδεσμος', d:'sed — αλλά', conn:true },
        { l:'aliquod', r:'Επιθετικός προσδ.', to:'στα flagitium, dedecus', g:'αιτ. ενικ., ουδ. — αόριστη επιθετική αντων.', d:'aliqui, aliqua, aliquod — κάποιος, -α, -ο' },
        { l:'flagitium', r:'Άμεσο αντικείμενο (στο ενν. obiecerunt) — υποκ. των μετοχών', to:'στο (ενν.) obiecerunt', g:'αιτ. ενικ., ουδ.', d:'flagitium, -ii / -i (ουδ. β΄) — το όνειδος' },
        { l:'ac', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'ac — και' },
        { l:'dedecus', r:'Άμεσο αντικείμενο (στο ενν. obiecerunt) — υποκ. των μετοχών', to:'στο (ενν.) obiecerunt', g:'αιτ. ενικ., ουδ.', d:'dedecus, dedecoris (ουδ. γ΄) — η ντροπή' },
        { l:'aut', r:'Σύνδεσμος', g:'παρατακτικός διαζευκτικός σύνδεσμος', d:'aut — είτε', note:'Πρώτο σκέλος του «aut … aut».' },
        { l:'in Asia', k:'Asia', r:'Εμπρόθετος επιρρ. προσδ. στάσης σε τόπο', to:'στη μετοχή susceptum', g:'in (πρόθ. + αφαιρ.) + Asia (αφαιρ. ενικ.)', d:'in — σε· Asia, -ae (θηλ. α΄) — η Ασία' },
        { l:'susceptum', r:'Επιθετική μετοχή', to:'στα flagitium, dedecus', g:'αιτ. ενικ., ουδ. — μτχ. παρακειμένου παθ. φωνής (β΄ κλ.)', d:'suscipio, suscepi, susceptum, suscipere (σε -io, 3) — παραλαμβάνω· «φορτώνομαι»', note:'Δηλώνει το προτερόχρονο (μτχ. παρακειμένου).' },
        { l:'aut', r:'Σύνδεσμος', g:'παρατακτικός διαζευκτικός σύνδεσμος', d:'aut — είτε', note:'Δεύτερο σκέλος του «aut … aut».' },
        { l:'ex Asia', k:'Asia', r:'Εμπρόθετος επιρρ. προσδ. κίνησης από τόπο', to:'στη μετοχή deportatum', g:'ex (πρόθ. + αφαιρ.) + Asia (αφαιρ. ενικ.)', d:'ex — από· Asia, -ae (θηλ. α΄) — η Ασία' },
        { l:'deportatum', r:'Επιθετική μετοχή', to:'στα flagitium, dedecus', g:'αιτ. ενικ., ουδ. — μτχ. παρακειμένου παθ. φωνής (β΄ κλ.)', d:'deporto, deportavi, deportatum, deportare (1, < de + porto) — φέρνω από κάπου', note:'Δηλώνει το προτερόχρονο (μτχ. παρακειμένου).', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια (α΄)', note:'Κύρια πρόταση κρίσης. Απρόσωπη έκφραση: το απαρέμφατο meruisse λειτουργεί ως υποκείμενο στο προσωπικό ρήμα fuit.', kids:[
        { l:'Meruisse', r:'Υποκείμενο (απαρέμφατο)', to:'στο fuit', g:'απαρέμφατο παρακειμένου ενεργ. φωνής', d:'mereo, merui, meritum, merere (2) — αξίζω· stipendia mereo = υπηρετώ τη στρατιωτική μου θητεία', note:'Αντιστοιχεί στο έναρθρο απαρέμφατο της αρχαίας ελληνικής («το να υπηρετήσει»).' },
        { l:'vero', r:'Σύνδεσμος', g:'παρατακτικός αντιθετικός σύνδεσμος', d:'vero — όμως' },
        { l:'stipendia', r:'Αντικείμενο', to:'στο απαρέμφατο meruisse', g:'αιτ. πληθ., ουδ.', d:'stipendia, -orum (ουδ. β΄) — η θητεία', note:'Εννοούμενο υποκείμενο του meruisse: Murenam (ετεροπροσωπία).' },
        { l:'in', r:'Πρόθεση', g:'πρόθεση + αφαιρετική', d:'in — σε' },
        { l:'eo', r:'Επιθετικός προσδ.', to:'στο bello', g:'αφαιρ. ενικ., ουδ. — δεικτική (ως οριστική) αντων.', d:'is, ea, id — αυτός, -ή, -ό' },
        { l:'bello', k:'bellum', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο απαρέμφατο meruisse', g:'αφαιρ. ενικ., ουδ. (in + bello)', d:'bellum, -i (ουδ. β΄) — ο πόλεμος' },
        { l:'virtutis', r:'Γενική κατηγορηματική του χαρακτηριστικού γνωρίσματος (ιδιότητας)', to:'από το fuit (στο υποκ. meruisse)', g:'γεν. ενικ.', d:'virtus, virtutis (θηλ. γ΄) — η ανδρεία', note:'virtutis fuit = υπήρξε δείγμα ανδρείας.' },
        { l:'fuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου του ανώμαλου - βοηθητικού', d:'sum, fui, —, esse — είμαι', a:';' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (β΄)', note:'Κύρια πρόταση κρίσης· απρόσωπη έκφραση με το απαρέμφατο meruisse ως υποκείμενο του fuit.', kids:[
        { l:'patre', r:'Ιδιόμορφη αφαιρετική απόλυτη (χρόνου) — «υποκείμενο»', to:'στο απαρέμφατο meruisse', g:'αφαιρ. ενικ.', d:'pater, patris (αρσ. γ΄) — ο πατέρας', note:'patre imperatore: ιδιόμορφη αφαιρετική απόλυτη (χωρίς μετοχή, με δύο ουσιαστικά).' },
        { l:'imperatore', r:'Κατηγορηματικός προσδ.', to:'στο patre', g:'αφαιρ. ενικ.', d:'imperator, imperatoris (αρσ. γ΄) — ο στρατηγός', note:'Ουσιαστικό που δηλώνει αξίωμα.' },
        { l:'libentissime', r:'Επιρρ. προσδ. του τρόπου', to:'στο απαρέμφατο meruisse', g:'τροπικό επίρρημα, υπερθετικός βαθμός (libenter)', d:'libentissime — με πολύ μεγάλη προθυμία' },
        { l:'meruisse', r:'Υποκείμενο (απαρέμφατο)', to:'στο fuit', g:'απαρέμφατο παρακειμένου ενεργ. φωνής', d:'mereo, merui, meritum, merere (2) — αξίζω', note:'Εννοούμενο υποκείμενο: Murenam (ετεροπροσωπία).' },
        { l:'pietatis', r:'Γενική κατηγορηματική του χαρακτηριστικού γνωρίσματος (ιδιότητας)', to:'από το fuit (στο υποκ. meruisse)', g:'γεν. ενικ.', d:'pietas, pietatis (θηλ. γ΄) — η ευσέβεια, ο σεβασμός', note:'pietatis fuit = υπήρξε δείγμα σεβασμού.' },
        { l:'fuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου του ανώμαλου - βοηθητικού', d:'sum, fui, —, esse — είμαι', a:';' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (γ΄)', note:'Κύρια πρόταση κρίσης· απρόσωπη έκφραση με το απαρέμφατο fuisse ως υποκείμενο του fuit.', kids:[
        { l:'finem', r:'Υποκείμενο (του απαρεμφάτου fuisse)', to:'στο fuisse', g:'αιτ. ενικ.', d:'finis, finis (αρσ. γ΄) — το τέλος', note:'Ετεροπροσωπία ως προς το fuit.' },
        { l:'stipendiorum', r:'Γενική υποκειμενική', to:'στο finem', g:'γεν. πληθ., ουδ.', d:'stipendia, -orum (ουδ. β΄) — η θητεία' },
        { l:'patris', r:'Γενική υποκειμενική', to:'στα victoriam, triumphum', g:'γεν. ενικ.', d:'pater, patris (αρσ. γ΄) — ο πατέρας' },
        { l:'victoriam', r:'Κατηγορούμενο', to:'στο finem (μέσω του fuisse)', g:'αιτ. ενικ.', d:'victoria, -ae (θηλ. α΄) — η νίκη' },
        { l:'ac', r:'Σύνδεσμος', g:'παρατακτικός συμπλεκτικός (καταφατικός) σύνδεσμος', d:'ac — και' },
        { l:'triumphum', r:'Κατηγορούμενο', to:'στο finem (μέσω του fuisse)', g:'αιτ. ενικ.', d:'triumphus, -i (αρσ. β΄) — ο θρίαμβος' },
        { l:'fuisse', r:'Υποκείμενο (απαρέμφατο)', to:'στο fuit', g:'απαρέμφατο παρακειμένου του ανώμαλου - βοηθητικού', d:'sum, fui, —, esse — είμαι' },
        { l:'felicitatis', r:'Γενική κατηγορηματική του χαρακτηριστικού γνωρίσματος (ιδιότητας)', to:'από το fuit (στο υποκ. fuisse)', g:'γεν. ενικ.', d:'felicitas, felicitatis (θηλ. γ΄) — η ευτυχία, η καλή τύχη', note:'felicitatis fuit = υπήρξε δείγμα καλής τύχης.' },
        { l:'fuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου του ανώμαλου - βοηθητικού', d:'sum, fui, —, esse — είμαι', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Hic vero, iudices, et fuit in Asia", el:"Αυτός όμως, δικαστές, και βρέθηκε στην Ασία" },
    { n:2, la:"et viro fortissimo, patri suo, magno adiumento in periculis, solacio in laboribus, gratulationi in victoria fuit.", el:"και υπήρξε για τον πατέρα του, άνδρα γενναιότατο, μεγάλη βοήθεια στους κινδύνους, παρηγοριά στους μόχθους, αφορμή συγχαρητηρίων στη νίκη." },
    { n:3, la:"Et si habet Asia suspicionem quandam luxuriae,", el:"Και αν η Ασία έχει κάποια υποψία τρυφής," },
    { n:4, la:"Murenam laudare debemus,", el:"οφείλουμε να επαινούμε τον Μουρήνα," },
    { n:5, la:"quod Asiam vidit", el:"γιατί είδε την Ασία," },
    { n:6, la:"sed in Asia continenter vixit.", el:"αλλά έζησε στην Ασία με εγκράτεια." },
    { n:7, la:"Quam ob rem accusatores non Asiae nomen Murenae obiecerunt,", el:"Γι΄ αυτόν τον λόγο οι κατήγοροι δεν προσήψαν στον Μουρήνα μομφή για το όνομα «Ασία»," },
    { n:8, la:"ex qua laus familiae, memoria generi, honos et gloria nomini constituta est,", el:"από την οποία δημιουργήθηκε έπαινος για την οικογένεια, υστεροφημία για το γένος, τιμή και δόξα για το όνομα," },
    { n:9, la:"sed aliquod flagitium ac dedecus aut in Asia susceptum aut ex Asia deportatum.", el:"αλλά για κάποιο όνειδος και ντροπή, που είτε «φορτώθηκε» στην Ασία είτε μεταφέρθηκε από την Ασία." },
    { n:10, la:"Meruisse vero stipendia in eo bello virtutis fuit;", el:"Το ότι υπηρέτησε, όμως, στον στρατό σε αυτόν τον πόλεμο υπήρξε δείγμα ανδρείας·" },
    { n:11, la:"patre imperatore libentissime meruisse pietatis fuit;", el:"το ότι υπηρέτησε με πολύ μεγάλη προθυμία, όταν ο πατέρας (του) ήταν στρατηγός, υπήρξε δείγμα σεβασμού·" },
    { n:12, la:"finem stipendiorum patris victoriam ac triumphum fuisse felicitatis fuit.", el:"το ότι το τέλος της θητείας (του) συνέπεσε με τη νίκη και τον θρίαμβο του πατέρα (του) υπήρξε δείγμα καλής τύχης." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Murena, -ae", note:"κύριο όνομα· δεν σχηματίζει πληθ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"Asia, -ae", note:"κύριο όνομα· δεν σχηματίζει πληθ." },
        { form:"victoria, -ae" },
        { form:"luxuria, -ae", note:"κλίνεται και κατά την ε΄ κλ.: luxuries, luxuriei· αφηρημένο, χωρίς πληθ." },
        { form:"familia, -ae", note:"γεν. ενικ. και -as (pater familias)" },
        { form:"memoria, -ae" },
        { form:"gloria, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"vir, viri" },
        { form:"triumphus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"adiumentum, -i" },
        { form:"periculum, -i" },
        { form:"solacium, -ii / -i" },
        { form:"flagitium, -ii / -i" },
        { form:"stipendium, -ii / -i", note:"ετερόσημο: ενικ. = μισθός, πληθ. stipendia, -orum = θητεία" },
        { form:"bellum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"iudex, iudicis" },
        { form:"pater, patris", note:"γεν. πληθ. patrum (αντί -ium)" },
        { form:"labor, laboris" },
        { form:"accusator, accusatoris" },
        { form:"honos και honor, honoris", note:"ονομ./κλητ. ενικ. σε δύο τύπους" },
        { form:"imperator, imperatoris" },
        { form:"finis, finis", note:"ετερόσημο: ενικ. = τέλος, πληθ. fines = σύνορα" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"gratulatio, gratulationis" },
        { form:"suspicio, suspicionis" },
        { form:"laus, laudis" },
        { form:"virtus, virtutis" },
        { form:"pietas, pietatis" },
        { form:"felicitas, felicitatis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"nomen, nominis" },
        { form:"genus, generis" },
        { form:"dedecus, dedecoris" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"res, rei" },
        { form:"luxuries, luxuriei", note:"ως ετερόκλιτο ουσιαστικό (και α΄ κλ. luxuria)" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"magnus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"fortis, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ & ΕΠΙΡΡΗΜΑΤΩΝ (κατά κλίση) ───────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"magnus, -a, -um", comp:"maior, -ior, -ius", sup:"maximus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"fortis, -is, -e", comp:"fortior, -ior, -ius", sup:"fortissimus, -a, -um" },
      { pos:"continens, -ntis", comp:"continentior, -ior, -ius", sup:"continentissimus, -a, -um" },
      { pos:"libens, -ntis", comp:"libentior, -ior, -ius", sup:"libentissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., για έναν κτήτορα" },
    { form:"quidam, quaedam, quoddam", kind:"Αόριστη", extra:"επιθετική· κατά την κλίση το τελικό m → n (quendam, quarundam)" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"aliqui, aliqua, aliquod", kind:"Αόριστη", extra:"επιθετική" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως οριστική (και επαναληπτική)" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"laudo", perf:"laudavi", sup:"laudatum", inf:"laudare", note:"" },
      { pres:"deporto", perf:"deportavi", sup:"deportatum", inf:"deportare", note:"< de + porto" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"habeo", perf:"habui", sup:"habitum", inf:"habere", note:"" },
      { pres:"debeo", perf:"debui", sup:"debitum", inf:"debere", note:"< de + habeo" },
      { pres:"video", perf:"vidi", sup:"visum", inf:"videre", note:"" },
      { pres:"mereo", perf:"merui", sup:"meritum", inf:"merere", note:"stipendia mereo = υπηρετώ τη θητεία μου" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"vivo", perf:"vixi", sup:"victum", inf:"vivere", note:"" },
      { pres:"obicio", perf:"obieci", sup:"obiectum", inf:"obicere", note:"σε -io (< ob + iacio)" },
      { pres:"constituo", perf:"constitui", sup:"constitutum", inf:"constituere", note:"" },
      { pres:"suscipio", perf:"suscepi", sup:"susceptum", inf:"suscipere", note:"σε -io (< subs + capio)" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"Ανώμαλα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό — είμαι" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"Διπλή δοτική (dativus finalis)", body:"adiumento, solacio, gratulationi = δοτικές κατηγορηματικές του σκοπού από το συνδετικό fuit· μαζί με τη δοτική προσωπική χαριστική viro / patri σχηματίζουν το σχήμα της διπλής δοτικής («ήταν προς όφελος του πατέρα του μεγάλη βοήθεια»)." },
    { tag:"Αντωνυμία", title:"Quam ob rem = δεικτική, εισάγει κύρια", body:"Η αναφορική αντων. Quam στην αρχή περιόδου, μετά από ισχυρό σημείο στίξης, ισοδυναμεί με δεικτική (= eam) και εισάγει κύρια πρόταση (quam ob rem = γι΄ αυτόν τον λόγο), όχι δευτερεύουσα αναφορική." },
    { tag:"Αναφορική", title:"ex qua = ex Asia", body:"Το ex qua είναι εμπρόθετη αναφορική αντωνυμία (= ex Asia) και εισάγει γνήσια δευτ. αναφορική προσδιοριστική πρόταση, προσδιοριστική στο Asiae της κύριας." },
    { tag:"Σύνταξη", title:"patre imperatore: ιδιόμορφη αφαιρετική απόλυτη", body:"Το patre imperatore είναι ιδιόμορφη (γνήσια) αφαιρετική απόλυτη του χρόνου χωρίς μετοχή, με δύο ουσιαστικά: patre = «υποκείμενο», imperatore = κατηγορηματικός προσδιορισμός που δηλώνει αξίωμα. Αναλύεται σε χρονική: cum pater imperator erat / esset." },
    { tag:"Σύνταξη", title:"Γενική κατηγορηματική του χαρακτηριστικού γνωρίσματος", body:"virtutis fuit, pietatis fuit, felicitatis fuit = υπήρξε δείγμα ανδρείας / σεβασμού / καλής τύχης. Απρόσωπη έκφραση: το απαρέμφατο (meruisse, fuisse) λειτουργεί ως υποκείμενο του προσωπικού fuit· η γενική είναι κατηγορηματική του χαρακτηριστικού γνωρίσματος." },
    { tag:"Μετοχή", title:"susceptum / deportatum: επιθετικές μετοχές", body:"Τα susceptum και deportatum είναι επιθετικές μετοχές παρακειμένου (δηλώνουν το προτερόχρονο) στα flagitium, dedecus· δεν είναι ρηματικοί τύποι με εννοούμενο esse. Αναλύονται σε αναφορικές: quod susceptum / deportatum erat." },
    { tag:"Ουσιαστικό", title:"stipendia & finis: ετερόσημα", body:"Το stipendium, -ii/-i (ενικ.) = μισθός, ενώ ο πληθ. stipendia, -orum = θητεία. Το finis, -is (ενικ.) = τέλος, ενώ ο πληθ. fines, -ium = σύνορα, όρια." }
  ],

  // ── ΜΕΡΟΣ 8: ΩΣ ΠΡΟΣ ΤΟ ΣΥΝΤΑΚΤΙΚΟ (ΜΕΤΑΤΡΟΠΕΣ) ─────────────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"aliquod flagitium ac dedecus … in Asia susceptum", to:"aliquod flagitium ac dedecus … quod in Asia susceptum erat", note:"quod + οριστική υπερσυντελίκου· εξάρτηση από ιστορικό χρόνο (obiecerunt)· προτερόχρονο" },
      { from:"aliquod flagitium ac dedecus … ex Asia deportatum", to:"aliquod flagitium ac dedecus … quod ex Asia deportatum erat", note:"quod + οριστική υπερσυντελίκου· προτερόχρονο" }
    ]},
    { id:"Β", label:"Ανάλυση της ιδιόμορφης αφαιρετικής απόλυτης του χρόνου σε δευτερεύουσα χρονική πρόταση", items:[
      { from:"patre imperatore … meruisse", to:"cum pater imperator erat … meruisse", note:"cum + οριστική παρατατικού: καθαρά χρονικός" },
      { from:"patre imperatore … meruisse", to:"cum pater imperator esset … meruisse", note:"cum + υποτακτική παρατατικού: χρονικός ιστορικός - διηγηματικός" }
    ]},
    { id:"Γ", label:"Μετατροπή δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Et si habet Asia suspicionem quandam luxuriae, … debemus", to:"Et habente Asia suspicionem quandam luxuriae, … debemus", note:"γνήσια αφαιρετική απόλυτη (το υποκ. Asia δεν έχει άλλον ρόλο στην πρόταση με ρήμα το debemus)" },
      { from:"Murenam laudare debemus, quod Asiam vidit", to:"Murenam laudare debemus, Asia visa", note:"νόθη αφαιρετική απόλυτη· το εννοούμενο ποιητικό αίτιο «a Murena» ταυτίζεται με το αντικείμενο Murenam του laudare" }
    ]},
    { id:"Δ", label:"Μετατροπή του υποθετικού λόγου στα άλλα είδη (υπόθεση: si habet / απόδοση: debemus)", items:[
      { from:"Si habet Asia … luxuriae — Murenam laudare debemus", to:"Si habet … (οριστ. ενεστ.) — debemus (laudare)", note:"α΄ είδος: ανοικτή υπόθεση στο παρόν" },
      { from:"Si habet …", to:"Si habuit Asia … — Murenam laudare debuimus", note:"α΄ είδος: ανοικτή υπόθεση στο παρελθόν (οριστ. παρακειμ.)" },
      { from:"Si habet …", to:"Si habebit (habuerit) Asia … — Murenam laudare debebimus", note:"α΄ είδος: ανοικτή υπόθεση στο μέλλον (οριστ. μέλλ. / συντελ. μέλλ.)" },
      { from:"Si habet …", to:"Si haberet Asia … — Murenam laudare deberemus", note:"β΄ είδος: υπόθεση αντίθετη προς την πραγματικότητα στο παρόν (υποτ. παρατατ.)" },
      { from:"Si habet …", to:"Si habuisset Asia … — Murenam laudare debuissemus", note:"β΄ είδος: υπόθεση αντίθετη προς την πραγματικότητα στο παρελθόν (υποτ. υπερσυντ.)" },
      { from:"Si habet …", to:"Si habeat Asia … — Murenam laudare debeamus", note:"γ΄ είδος: υπόθεση δυνατή ή πιθανή στο παρόν - μέλλον (υποτ. ενεστ.)" }
    ]},
    { id:"Ε", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Murenam laudare debemus", to:"Murena laudandus est (nobis)", note:"laudandus est: οριστ. ενεστ. παθητικής περιφραστικής συζυγίας" },
      { from:"Quam ob rem accusatores non Asiae nomen Murenae obiecerunt", to:"Quam ob rem non Asiae nomen Murenae obiectum est ab accusatoribus" }
    ]},
    { id:"ΣΤ", label:"Μετατροπή του αποσπάσματος (Hic vero … deportatum) σε πλάγιο λόγο (εξάρτηση: Cicero dicit / dixit)", items:[
      { from:"Hic vero, iudices, et fuit in Asia et viro fortissimo, patri suo, magno adiumento in periculis, solacio in laboribus, gratulationi in victoria fuit.", to:"Cicero dicit / dixit iudicibus illum et fuisse in Asia et viro fortissimo, patri suo, magno adiumento in periculis, solacio in laboribus, gratulationi in victoria fuisse;" },
      { from:"Et si habet Asia suspicionem quandam luxuriae, Murenam laudare debemus, quod Asiam vidit sed in Asia continenter vixit.", to:"et si habeat / haberet Asia … , Murenam eos laudare debere, quod Asiam viderit / vidisset sed … vixerit / vixisset;" },
      { from:"Quam ob rem accusatores non Asiae nomen Murenae obiecerunt, ex qua … constituta est, sed aliquod flagitium ac dedecus … deportatum.", to:"quam ob rem accusatores non … obiecisse, ex qua … constituta sit / constituta esset, sed aliquod flagitium ac dedecus … deportatum." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΟΙ ΣΥΣΧΕΤΙΣΜΟΙ ────────────────────────────────────
  etymology: [
    { la:"iudices", el:"(γαλλ.) justice (= δικαιοσύνη), juste (= δίκαιος) // (αγγλ.) justice, judge (= δικαστής), judicial (= δικαστικός)." },
    { la:"Asia (Asiā, Asiam, Asiae)", el:"Ασία." },
    { la:"viro, virtūtis", el:"βιρτουόζος (< ιταλ. virtuoso) // (αγγλ.) virtue (= αρετή), virile (= ανδρικός, αρρενωπός)." },
    { la:"fortissimo", el:"(γαλλ.) fort (= σωματική δύναμη) // (ισπαν.) fortaleza (= φρούριο) // (αγγλ.) force (= δύναμη) // (ιταλ.) forte (= δυνατός, ισχυρός)." },
    { la:"patri, patre, patris", el:"πατήρ // (γαλλ.) paternel (= πατρικός), père (= πατέρας) // (αγγλ.) patron (= προστάτης, χορηγός) // (ιταλ.) padre (= πατέρας)." },
    { la:"magno", el:"μέγας // (αγγλ.) magni-fic (= μεγαλοπρεπής), magnitude (= μέγεθος), magnate (= μεγιστάνας)." },
    { la:"adiumentum (< ad-iuvo)", el:"(γαλλ.) adiuvant (= βοηθητικός, πρόσθετος), aider (= βοηθώ) // (αγγλ.) aid (= βοήθεια) // (ιταλ.) aiutare (= βοηθώ)." },
    { la:"periculis", el:"πείρα, πειρατής· απειρία // (αγγλ.) peril (= κίνδυνος) // (γαλλ.) péril (= κίνδυνος) // (ιταλ.) pericolo (= κίνδυνος)." },
    { la:"solacio", el:"(αγγλ.) solace (= παρηγοριά), (γαλλ.) con-solation, console (= παρηγορώ) // (ισπαν.) solaz (= παρηγοριά, ανακούφιση)." },
    { la:"laboribus", el:"λαμβάνω // (αγγλ.) labor (= μόχθος), elaborate (= επεξεργάζομαι), collaborate (= συνεργάζομαι) // (γαλλ.) laboratoire (= εργαστήριο), laborieux (= κοπιώδης) // (ιταλ.) lavoro (= εργασία, δουλειά)." },
    { la:"gratulatiōni", el:"(αγγλ.) con-gratulations (= συγχαρητήρια), grateful (= ευγνώμων), gratitude (= ευγνωμοσύνη), grace (= χάρη) // (γαλλ.) con-gratuler (= συγχαίρω) // (ιταλ.) grazie (= ευχαριστώ) // (ισπαν.) gracias (= ευχαριστώ)." },
    { la:"victoriā, victōriam", el:"(γαλλ.) victoire, (αγγλ.) victory // (ιταλ.) vittoria (= νίκη)." },
    { la:"habet, debēmus (de + habeo)", el:"(γερμ.) haben, (αγγλ.) have // (αγγλ.) habit (= συνήθεια), debt (= χρέος) // (γαλλ.) avoir (= έχω), devoir (= οφείλω, καθήκον) // (ιταλ.) avere (= έχω)." },
    { la:"suspiciōnem", el:"(γαλλ.) suspicion (= υποψία) // (αγγλ.) suspect (= ύποπτος)." },
    { la:"luxuriae", el:"λούσο (< ιταλ.), λουξ (< γαλλ.) // luxury (= πολυτέλεια) // (αγγλ.) luxuriant (= οργιώδης, πλούσιος (βλάστηση)) // (γαλλ.) luxure (= λαγνεία, ασωτία)." },
    { la:"Murēnam, Murēnae", el:"Μουρήνας // (αγγλ.) moray (= σμέρνα, μύραινα) // (γαλλ.) murène (= σμέρνα, μύραινα)." },
    { la:"laudāre, laus", el:"(γαλλ.) laudatif (= κολακευτικός), louer (= επαινώ) // (αγγλ.) laudable (= αξιέπαινος)." },
    { la:"vidit", el:"(Ϝιδεῖν) ιδέα, βίντεο (< αγγλ.) // (γαλλ.) voir (= βλέπω) // (ιταλ.) vedere (= βλέπω)." },
    { la:"con-tinenter", el:"(γαλλ.) tenir (= κρατώ) // (αγγλ.) content (= περιεχόμενο), continent (= ήπειρος)." },
    { la:"vixit", el:"βίος // βιταλισμός (< γαλλ. vitalisme), βιταμίνη (< γαλλ.) // (αγγλ.) vivid (= ζωηρός, ζωντανός) // (γαλλ.) vivre (= ζω)." },
    { la:"rem", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός), rebus (= εικονόγριφος) // (γαλλ.) rien (= τίποτα)." },
    { la:"accusatōres (< accuso < ad + causa)", el:"(γαλλ.) cause (= αιτία), accusation (= κατηγορία), chose (= πράγμα) // (αγγλ.) accuse (= κατηγορώ) // (ιταλ.) cosa (= πράγμα)." },
    { la:"nomen, nomini", el:"όνομα // (γαλλ.) nom (= όνομα, ουσιαστικό), (αγγλ.) name // (αγγλ.) noun (= ουσιαστικό), nominate (= ονομάζω, προτείνω/διορίζω)." },
    { la:"obiecērunt", el:"ἵημι (= ρίχνω) // (αγγλ.) object (= αντικείμενο) // (γαλλ.) jeter (= ρίχνω)." },
    { la:"familiae", el:"φαμίλια // (γαλλ.) famille (= οικογένεια) // (αγγλ.) family (= οικογένεια / οικογενειακός), familiar (= οικείος) // (ιταλ.) famiglia (= οικογένεια)." },
    { la:"memoria", el:"μέμνημαι· μνήμη, μνημονικός // (αγγλ.) monument (= μνημείο), remember (= θυμάμαι), memorial (= μνημείο, αναμνηστικό) // (γαλλ.) mémoire (= μνήμη, υπόμνημα)." },
    { la:"generi", el:"γένος· γενιά // (αγγλ.) gender (= γένος, φύλο), generate (= παράγω, γεννώ) // (γαλλ.) genre (= είδος, γένος)." },
    { la:"honos", el:"ονόρε (< ιταλ.) // (αγγλ.) honor (= τιμή), honest (= έντιμος) // (γαλλ.) honorable (= αξιότιμος), honneur (= τιμή)." },
    { la:"gloria", el:"(αγγλ.) glory, (γαλλ.) gloire, glorious (= ένδοξος) // (γαλλ.) glorieux (= ένδοξος) // (ιταλ.) gloria (= δόξα)." },
    { la:"constitūta", el:"συν-ίστημι // (γαλλ.) con-stituer (= συγκροτώ, καθορίζω) // (αγγλ.) constitution (= σύνταγμα, σύσταση) // (ιταλ.) costituire (= συγκροτώ, συνιστώ)." },
    { la:"est", el:"εἰμί // (αγγλ.) essence (= ουσία) // (γαλλ.) essence (= ουσία)." },
    { la:"dedecus", el:"(γαλλ.) decent (= αξιοπρεπής)." },
    { la:"sus-ceptum", el:"(γαλλ.) ac-cepter (= δέχομαι) // (ιταλ.) capire (= καταλαβαίνω) // (αγγλ.) susceptible (= επιρρεπής, ευάλωτος), capture (= σύλληψη, αιχμαλωσία)." },
    { la:"de-portātum", el:"ρα-πόρτο (= αναφορά) (< ιταλ.), πόρτο (= λιμάνι) (< ιταλ.) // (αγγλ.) deportation (= απέλαση), portable (= φορητός) // (γαλλ.) porter (= κουβαλώ, φέρω)." },
    { la:"meruisse", el:"μείρ-ομαι, μέρ-ος // (αγγλ.) merit (= αξία, προσόν), emeritus (= ομότιμος, αφυπηρετήσας) // (γαλλ.) mériter (= αξίζω)." },
    { la:"sti-pendia, stipendiōrum", el:"(γαλλ.) dé-penser (= ξοδεύω) // (αγγλ.) stipend (= μισθός, χορηγία) // (ιταλ.) stipendio (= μισθός)." },
    { la:"imperatōre", el:"ιμπεριαλισμός (< γαλλ.) // (αγγλ.) emperor (= αυτοκράτορας) // (γαλλ.) empereur (= αυτοκράτορας) // (ιταλ.) imperatore (= αυτοκράτορας)." },
    { la:"libentissime", el:"(γερμ.) liebe (= αγάπη) // (αγγλ.) libido (= γενετήσια ορμή, επιθυμία)." },
    { la:"pietātis", el:"(γαλλ.) piété (= ευσέβεια), pitié (= οίκτος) // (αγγλ.) piety (= ευσέβεια), pity (= οίκτος, ευσπλαχνία) // (ιταλ.) pietà (= ευσπλαχνία, οίκτος)." },
    { la:"finem", el:"φινάλε, φινίρισμα (< ιταλ.) // (γαλλ.) finaliste (= ο προκριθείς στον τελικό αγώνα διοργάνωσης) // (αγγλ.) finish (= τελειώνω), finite (= πεπερασμένος), define (= ορίζω)." },
    { la:"triumphum", el:"θρίαμβος // (αγγλ.) triumph (= θρίαμβος), trump (= ατού (χαρτί)) // (γαλλ.) triomphe (= θρίαμβος) // (ιταλ.) trionfo (= θρίαμβος) // (ισπαν.) triunfo (= θρίαμβος, νίκη)." },
    { la:"felicitātis", el:"(γαλλ.) félicité (= ευτυχία) // (αγγλ.) felicity (= ευτυχία), felicitate (= συγχαίρω, εύχομαι) // (ιταλ.) felicità (= ευτυχία) // (ισπαν.) felicidad (= ευτυχία)." }
  ]
};

export default UNIT;
