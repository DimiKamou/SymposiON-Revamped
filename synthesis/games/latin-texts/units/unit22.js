export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 22,
  title: "Προτροπές προς τους Ρωμαίους",
  latinTitle: "Lectio XXII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας. Εκφέρεται με προτρεπτική υποτακτική. Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'Imitemur', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. — αποθετικό', d:'imitor, imitatus sum, (imitatum), imitari (1, αποθετικό) — μιμούμαι' },
        { l:'nostros', r:'Επιθετικός προσδ.', to:'στα Brutos, Camillos, Decios, Curios, Fabricios, Scipiones', g:'αιτ. πληθ., αρσ. — κτητική αντων. α΄ προσ. (πολλοί κτήτορες)', d:'noster, nostra, nostrum — δικός μας' },
        { l:'Brutos', r:'Αντικείμενο', to:'στο imitemur', g:'αιτ. πληθ.', d:'Brutus, -i (αρσ. β΄) — ο Βρούτος' },
        { l:'Camillos', r:'Αντικείμενο', to:'στο imitemur', g:'αιτ. πληθ.', d:'Camillus, -i (αρσ. β΄) — ο Κάμιλλος' },
        { l:'Decios', r:'Αντικείμενο', to:'στο imitemur', g:'αιτ. πληθ.', d:'Decius, -ii/-i (αρσ. β΄) — ο Δέκιος', note:'Ως υπερδισύλλαβο σε -ius σχηματίζει γεν. ενικ. σε -ii και -i, κλητ. ενικ. σε -i.' },
        { l:'Curios', r:'Αντικείμενο', to:'στο imitemur', g:'αιτ. πληθ.', d:'Curius, -ii/-i (αρσ. β΄) — ο Κούριος' },
        { l:'Fabricios', r:'Αντικείμενο', to:'στο imitemur', g:'αιτ. πληθ.', d:'Fabricius, -ii/-i (αρσ. β΄) — ο Φαβρίκιος' },
        { l:'Scipiones', r:'Αντικείμενο', to:'στο imitemur', g:'αιτ. πληθ.', d:'Scipio, Scipionis (αρσ. γ΄) — ο Σκιπίωνας', a:',' },
        { l:'innumerabiles', r:'Επιθετικός προσδ.', to:'στο alios', g:'αιτ. πληθ., αρσ. — επίθ. γ΄ κλ. (δικατάληκτο)', d:'innumerabilis, -is, -e — αμέτρητος', note:'Δεν σχηματίζει παραθετικά, γιατί δηλώνει κάτι απόλυτο.' },
        { l:'alios', r:'Αντικείμενο', to:'στο imitemur', g:'αιτ. πληθ., αρσ. — αόριστη αντων. / αντωνυμικό επίθ.', d:'alius, alia, aliud — άλλος', note:'Αντωνυμικό επίθετο: γεν. ενικ. σε -ius, δοτ. ενικ. σε -i και στα τρία γένη.' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση, στους όρους Brutos, Camillos, Decios, Curios, Fabricios, Scipiones, alios. Εισάγεται με την αναφορική αντων. qui και εκφέρεται με οριστική (stabiliverunt), γιατί εκφράζει το πραγματικό· δηλώνει το προτερόχρονο.', kids:[
          { l:'qui', r:'Υποκείμενο', to:'στο stabiliverunt', g:'ονομ. πληθ., αρσ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'hanc', r:'Επιθετικός προσδ.', to:'στο rem publicam', g:'αιτ. ενικ., θηλ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
          { l:'rem', r:'Αντικείμενο', to:'στο stabiliverunt', g:'αιτ. ενικ.', d:'res, rei (θηλ. ε΄) — το πράγμα· res publica = η πολιτεία', note:'Η συνεκφορά res publica κλίνεται μόνο στον ενικό.' },
          { l:'publicam', r:'Επιθετικός προσδ.', to:'στο rem', g:'αιτ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'publicus, -a, -um — δημόσιος', note:'Δεν σχηματίζει παραθετικά, γιατί δηλώνει κάτι απόλυτο.' },
          { l:'stabiliverunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακειμένου ενεργ. φωνής', d:'stabilio, stabilivi, stabilitum, stabilire (4) — στεριώνω', a:';' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια (κρίσης)', note:'Κύρια πρόταση κρίσης. Η αναφορική αντων. quos, μετά από ισχυρό σημείο στίξης, ισοδυναμεί με δεικτική (quos = eos) και εισάγει κύρια πρόταση. Εννοούμενο υποκείμενο: ego.', kids:[
        { l:'quos', r:'Αντικείμενο', to:'στο repono', g:'αιτ. πληθ., αρσ. — αναφορική αντων. (= eos)', d:'qui, quae, quod — ο οποίος· quos = eos', note:'Μετά από ισχυρό σημείο στίξης η αναφορική ισοδυναμεί με δεικτική.' },
        { l:'equidem', r:'Επιρρ. προσδ. του τρόπου', to:'στο repono', g:'τροπικό βεβαιωτικό επίρρημα', d:'equidem — (εγώ) βέβαια' },
        { l:'in', r:'Πρόθεση (εμπρόθετος τόπου)', to:'στο repono', g:'πρόθεση + αφαιρ.', d:'in — σε, ανάμεσα' },
        { l:'deorum', r:'Γενική υποκειμενική / περιεχομένου', to:'στο coetu / στο numero', g:'γεν. πληθ.', d:'deus, -i (αρσ. β΄) — ο θεός', note:'Κατ’ άλλους γενική διαιρετική στο numero. Ανώμαλη κλίση (dei/dii/di κ.λπ.).' },
        { l:'immortalium', r:'Επιθετικός προσδ.', to:'στο deorum', g:'γεν. πληθ., αρσ. — επίθ. γ΄ κλ. (δικατάληκτο)', d:'immortalis, -is, -e — αθάνατος', note:'Δεν σχηματίζει παραθετικά, γιατί δηλώνει κάτι απόλυτο.' },
        { l:'coetu', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (μεταξύ)', to:'στο repono', g:'αφαιρ. ενικ.', d:'coetus, -us (αρσ. δ΄, < cum + eo) — η συγκέντρωση, η συνάθροιση' },
        { l:'ac', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'ac — και' },
        { l:'numero', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (μεταξύ)', to:'στο repono', g:'αφαιρ. ενικ.', d:'numerus, -i (αρσ. β΄) — ο αριθμός' },
        { l:'repono', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'repono, reposui, repositum, reponere (3, < re + pono) — τοποθετώ', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας. Εκφέρεται με προτρεπτική υποτακτική. Οι τρεις προτάσεις (3) χωρίζονται με κόμμα (ασύνδετο σχήμα). Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'Amemus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. φωνής', d:'amo, amavi, amatum, amare (1) — αγαπώ' },
        { l:'patriam', r:'Αντικείμενο', to:'στο amemus', g:'αιτ. ενικ.', d:'patria, -ae (θηλ. α΄) — η πατρίδα', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας. Προτρεπτική υποτακτική. Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'pareamus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. φωνής', d:'pareo, parui, paritum, parere (2) — υπακούω' },
        { l:'senatui', r:'Αντικείμενο', to:'στο pareamus', g:'δοτ. ενικ.', d:'senatus, -us (αρσ. δ΄) — η Σύγκλητος', note:'Δοτ. ενικ. σε -ui και -u· ως περιληπτικό όνομα δεν σχηματίζει πληθυντικό.', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας. Προτρεπτική υποτακτική. Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'consulamus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. φωνής', d:'consulo, consului, consultum, consulere (3) — φροντίζω για' },
        { l:'bonis', r:'Δοτική προσωπική χαριστική', to:'στο consulamus', g:'δοτ. πληθ., αρσ. — ουσιαστικοπ. επίθ. β΄ κλ.', d:'boni, -orum (αρσ. β΄) — οι καλοί πολίτες', note:'Ουσιαστικοποιημένο αρσενικό του επιθέτου bonus, -a, -um· σχηματίζει μόνο πληθυντικό.', a:';' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας. Προτρεπτική υποτακτική. Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'praesentes', r:'Επιθετικός προσδ. (επιθετοποιημένη μετοχή)', to:'στο fructus', g:'αιτ. πληθ., αρσ. — μτχ. ενεστ. (praesens) του praesum', d:'praesum, praefui, praeesse (< prae + sum) — είμαι παρών· praesens = τωρινός, παρών', note:'Ως επιθετική σχηματίζει αφαιρ. ενικ. σε -i· γεν. πληθ. σε -ium.' },
        { l:'fructus', r:'Αντικείμενο', to:'στο neglegamus', g:'αιτ. πληθ.', d:'fructus, -us (αρσ. δ΄) — ο καρπός, η ωφέλεια, το κέρδος' },
        { l:'neglegamus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. φωνής', d:'neglego (και negligo), neglexi, neglectum, neglegere (3, < nec + lego) — αδιαφορώ για', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας. Προτρεπτική υποτακτική. Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'posteritatis', r:'Γενική κτητική (ή υποκειμενική)', to:'στο gloriae', g:'γεν. ενικ.', d:'posteritas, posteritatis (θηλ. γ΄) — το μέλλον, οι μεταγενέστεροι', note:'Δεν σχηματίζει πληθυντικό, γιατί δηλώνει αφηρημένη έννοια.' },
        { l:'gloriae', r:'Αντικείμενο', to:'στο serviamus', g:'δοτ. ενικ.', d:'gloria, -ae (θηλ. α΄) — η δόξα' },
        { l:'serviamus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. φωνής', d:'servio, servivi (servii), servitum, servire (4) — υπηρετώ', a:';' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας. Προτρεπτική υποτακτική. Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'id', r:'Υποκείμενο (ειδικού απαρεμφάτου)', to:'στο esse', g:'αιτ. ενικ., ουδ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο putemus (ετεροπροσωπία)', g:'απαρέμφατο ενεστ.', d:'sum, fui, esse — είμαι' },
        { l:'optimum', r:'Κατηγορούμενο', to:'στο id (μέσω του esse)', g:'αιτ. ενικ., ουδ. — επίθ. β΄ κλ. (υπερθ. του bonus)', d:'optimus, -a, -um — άριστος· υπερθετικός βαθμός του bonus, -a, -um' },
        { l:'putemus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. φωνής', d:'puto, putavi, putatum, putare (1) — νομίζω, θεωρώ', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση, στον όρο id της κύριας. Εισάγεται με την αναφορική αντων. quod και εκφέρεται με οριστική (est), γιατί εκφράζει το πραγματικό· αναφέρεται στο παρόν.', kids:[
          { l:'quod', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'est', r:'Ρήμα (συνδετικό)', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, esse — είμαι' },
          { l:'rectissimum', r:'Κατηγορούμενο', to:'στο quod (μέσω του est)', g:'ονομ. ενικ., ουδ. — επίθ. β΄ κλ. (υπερθ. του rectus)', d:'rectissimus, -a, -um — ο πιο σωστός· υπερθετικός βαθμός του rectus, -a, -um', a:';' }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας. Προτρεπτική υποτακτική. Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'speremus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. φωνής', d:'spero, speravi, speratum, sperare (1) — ελπίζω' },
        { type:'sub', key:'anaforiki', label:'Αναφορική (ουσιαστική)', note:'Δευτ. αναφορική ουσιαστική πρόταση· λειτουργεί ως αντικείμενο στο ρήμα speremus της κύριας. Εισάγεται με την αναφορική αντων. quae και εκφέρεται με οριστική (volumus), γιατί εκφράζει το πραγματικό· αναφέρεται στο παρόν.', kids:[
          { l:'quae', r:'Αντικείμενο', to:'στο volumus', g:'αιτ. πληθ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'volumus', r:'Ρήμα', g:'α΄ πληθ. οριστ. ενεστ. — ανώμαλο', d:'volo, volui, velle — θέλω', a:',' }
        ]}
      ]},
      { l:'sed', r:'Σύνδεσμος', g:'αντιθετικός (παρατακτικός) σύνδεσμος', d:'sed — αλλά', note:'Συνδέει αντιθετικά τις δύο κύριες προτάσεις (speremus / feramus).', conn:true },
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας, συνδεόμενη παρατακτικά αντιθετικά (sed) με την προηγούμενη. Προτρεπτική υποτακτική. Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'feramus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. φωνής — ανώμαλο', d:'fero, tuli, latum, ferre — υπομένω, φέρω' },
        { type:'sub', key:'anaforiki', label:'Αναφορική (ουσιαστική)', note:'Δευτ. αναφορική ουσιαστική πρόταση· λειτουργεί ως αντικείμενο στο ρήμα feramus της κύριας. Εισάγεται με την αναφορική αντων. quod και εκφέρεται με οριστική (acciderit), γιατί εκφράζει το πραγματικό· αναφέρεται στο μέλλον.', kids:[
          { l:'quod', r:'Υποκείμενο', to:'στο acciderit', g:'ονομ. ενικ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'acciderit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. συντελ. μέλλοντα ενεργ. φωνής', d:'accido, accidi, accidere (3, < ad + cado) — πέφτω· απρόσ. accidit = συμβαίνει', a:';' }
        ]}
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια (επιθυμίας)', note:'Κύρια πρόταση επιθυμίας. Προτρεπτική υποτακτική. Εννοούμενο υποκείμενο: nos.', kids:[
        { l:'arbitremur', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. — αποθετικό', d:'arbitror, arbitratus sum, (arbitratum), arbitrari (1, αποθετικό) — πιστεύω, νομίζω' },
        { l:'denique', r:'Επιρρ. προσδ. του χρόνου', to:'στο arbitremur', g:'χρονικό επίρρημα', d:'denique — τέλος, επιτέλους' },
        { l:'corpus', r:'Υποκείμενο (ειδικού απαρεμφάτου)', to:'στο esse (1)', g:'αιτ. ενικ., ουδ.', d:'corpus, corporis (ουδ. γ΄) — το σώμα' },
        { l:'virorum', r:'Γενική κτητική', to:'στο corpus', g:'γεν. πληθ.', d:'vir, viri (αρσ. β΄) — ο άνδρας' },
        { l:'fortium', r:'Επιθετικός προσδ.', to:'στο virorum', g:'γεν. πληθ., αρσ. — επίθ. γ΄ κλ. (δικατάληκτο)', d:'fortis, -is, -e — γενναίος, δυνατός' },
        { l:'magnorum', r:'Επιθετικός προσδ.', to:'στο hominum', g:'γεν. πληθ., αρσ. — επίθ. β΄ κλ.', d:'magnus, -a, -um — μεγάλος' },
        { l:'-que', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος — εγκλιτικός', d:'-que — και' },
        { l:'hominum', r:'Γενική κτητική', to:'στο corpus', g:'γεν. πληθ.', d:'homo, hominis (αρσ. γ΄) — ο άνθρωπος' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο arbitremur (ετεροπροσωπία)', g:'απαρέμφατο ενεστ.', d:'sum, fui, esse — είμαι', note:'esse (1): υποκείμενο corpus, κατηγορούμενο mortale.' },
        { l:'mortale', r:'Κατηγορούμενο', to:'στο corpus (μέσω του esse 1)', g:'αιτ. ενικ., ουδ. — επίθ. γ΄ κλ. (δικατάληκτο)', d:'mortalis, -is, -e — θνητός', note:'Δεν σχηματίζει παραθετικά, γιατί δηλώνει κάτι απόλυτο.', a:',' },
        { l:'animi', r:'Γενική υποκειμενική', to:'στο motus', g:'γεν. ενικ.', d:'animus, -i (αρσ. β΄) — η ψυχή· animi motus = οι δυνάμεις της ψυχής' },
        { l:'vero', r:'Σύνδεσμος', g:'αντιθετικός (παρατακτικός) σύνδεσμος', d:'vero — όμως' },
        { l:'motus', r:'Υποκείμενο (ειδικού απαρεμφάτου)', to:'στο esse (2)', g:'αιτ. πληθ.', d:'motus, -us (αρσ. δ΄) — η κίνηση· animi motus = οι δυνάμεις/πνευματικές δραστηριότητες της ψυχής' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'virtutis', r:'Γενική κτητική (ή υποκειμενική)', to:'στο gloriam', g:'γεν. ενικ.', d:'virtus, virtutis (θηλ. γ΄) — η ανδρεία, η αρετή' },
        { l:'gloriam', r:'Υποκείμενο (ειδικού απαρεμφάτου)', to:'στο esse (2)', g:'αιτ. ενικ.', d:'gloria, -ae (θηλ. α΄) — η δόξα' },
        { l:'sempiternam', r:'Κατηγορούμενο', to:'στα motus, gloriam (μέσω του esse 2)', g:'αιτ. ενικ., θηλ. — επίθ. β΄ κλ.', d:'sempiternus, -a, -um — αιώνιος', note:'Το κατηγορούμενο συμφωνεί στο γένος με το πλησιέστερο υποκείμενο (gloriam). Δεν σχηματίζει παραθετικά (απόλυτη έννοια).' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο arbitremur (ετεροπροσωπία)', g:'απαρέμφατο ενεστ.', d:'sum, fui, esse — είμαι', note:'esse (2): υποκείμενα motus, gloriam, κατηγορούμενο sempiternam.', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Imitemur nostros Brutos, Camillos, Decios, Curios, Fabricios, Scipiones, innumerabiles alios qui hanc rem publicam stabiliverunt;", el:"Ας μιμούμαστε τους δικούς μας Βρούτους, Καμίλλους, Δεκίους, Κουρίους, Φαβρικίους, Σκιπίωνες, τους αμέτρητους άλλους, οι οποίοι στερέωσαν αυτήν την πολιτεία·" },
    { n:2, la:"quos equidem in deorum immortalium coetu ac numero repono.", el:"αυτούς εγώ βέβαια τοποθετώ ανάμεσα στους αθάνατους θεούς." },
    { n:3, la:"Amemus patriam, pareamus senatui, consulamus bonis;", el:"Ας αγαπάμε την πατρίδα, ας υπακούουμε στη Σύγκλητο, ας φροντίζουμε για τους καλούς πολίτες·" },
    { n:4, la:"praesentes fructus neglegamus, posteritatis gloriae serviamus;", el:"ας αδιαφορούμε για τα τωρινά κέρδη, ας υπηρετούμε τη δόξα του μέλλοντος·" },
    { n:5, la:"id esse optimum putemus, quod est rectissimum;", el:"ας θεωρούμε ότι είναι άριστο αυτό, που είναι το πιο σωστό·" },
    { n:6, la:"speremus quae volumus, sed feramus quod acciderit;", el:"ας ελπίζουμε αυτά που θέλουμε, αλλά ας υπομένουμε ό,τι θα έχει συμβεί·" },
    { n:7, la:"arbitremur denique corpus virorum fortium magnorumque hominum esse mortale, animi vero motus et virtutis gloriam sempiternam esse.", el:"ας πιστεύουμε, τέλος, ότι το σώμα των γενναίων ανδρών και των μεγάλων ανθρώπων είναι θνητό, οι δυνάμεις όμως της ψυχής και η δόξα της αρετής είναι αιώνια." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"patria, -ae" },
        { form:"gloria, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Brutus, -i" },
        { form:"Camillus, -i" },
        { form:"Decius, -ii/-i" },
        { form:"Curius, -ii/-i" },
        { form:"Fabricius, -ii/-i" },
        { form:"deus, -i", note:"ανώμαλη κλίση" },
        { form:"numerus, -i" },
        { form:"boni, -orum", note:"μόνο πληθ." },
        { form:"vir, viri" },
        { form:"animus, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Scipio, Scipionis" },
        { form:"homo, hominis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"posteritas, posteritatis", note:"δεν έχει πληθ." },
        { form:"virtus, virtutis", note:"γεν. πληθ. -um/-ium" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"corpus, corporis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"coetus, -us" },
        { form:"senatus, -us", note:"δεν έχει πληθ." },
        { form:"fructus, -us" },
        { form:"motus, -us" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"res, rei" }
      ]}
    ]},
    { kl:"Σύνθετο ουσιαστικό", groups:[
      { gender:"Θηλυκά", items:[
        { form:"res publica, rei publicae", note:"μόνο ενικ." }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"publicus, -a, -um" },
      { form:"bonus, -a, -um" },
      { form:"rectus, -a, -um" },
      { form:"magnus, -a, -um" },
      { form:"sempiternus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"innumerabilis, -is, -e" },
      { form:"immortalis, -is, -e" },
      { form:"fortis, -is, -e" },
      { form:"mortalis, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"publicus, -a, -um", comp:"—", sup:"—" },
      { pos:"bonus, -a, -um (bene)", comp:"melior, -ior, -ius (melius)", sup:"optimus, -a, -um (optime)" },
      { pos:"rectus, -a, -um (recte)", comp:"rectior, -ior, -ius (rectius)", sup:"rectissimus, -a, -um (rectissime)" },
      { pos:"magnus, -a, -um (magnopere)", comp:"maior, -ior, -ius (magis)", sup:"maximus, -a, -um (maxime)" },
      { pos:"sempiternus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"innumerabilis, -is, -e", comp:"—", sup:"—" },
      { pos:"immortalis, -is, -e", comp:"—", sup:"—" },
      { pos:"fortis, -is, -e (fortiter)", comp:"fortior, -ior, -ius (fortius)", sup:"fortissimus, -a, -um (fortissime)" },
      { pos:"mortalis, -is, -e", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"noster, nostra, nostrum", kind:"Κτητική", extra:"α΄ προσ., πολλοί κτήτορες" },
    { form:"alius, alia, aliud", kind:"Αόριστη", extra:"αντωνυμικό επίθ.· γεν. -ius, δοτ. -i" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"imitor", perf:"imitatus sum", sup:"(imitatum)", inf:"imitari", note:"αποθετικό" },
      { pres:"amo", perf:"amavi", sup:"amatum", inf:"amare", note:"" },
      { pres:"puto", perf:"putavi", sup:"putatum", inf:"putare", note:"" },
      { pres:"spero", perf:"speravi", sup:"speratum", inf:"sperare", note:"" },
      { pres:"arbitror", perf:"arbitratus sum", sup:"(arbitratum)", inf:"arbitrari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"pareo", perf:"parui", sup:"paritum", inf:"parere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"repono", perf:"reposui", sup:"repositum", inf:"reponere", note:"< re + pono" },
      { pres:"consulo", perf:"consului", sup:"consultum", inf:"consulere", note:"" },
      { pres:"neglego", perf:"neglexi", sup:"neglectum", inf:"neglegere", note:"και negligo / negligere· < nec + lego" },
      { pres:"accido", perf:"accidi", sup:"—", inf:"accidere", note:"< ad + cado" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"stabilio", perf:"stabilivi", sup:"stabilitum", inf:"stabilire", note:"" },
      { pres:"servio", perf:"servivi (servii)", sup:"servitum", inf:"servire", note:"" }
    ]},
    { syz:"Ανώμαλα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό — είμαι" },
      { pres:"praesum", perf:"praefui", sup:"—", inf:"praeesse", note:"< prae + sum" },
      { pres:"volo", perf:"volui", sup:"—", inf:"velle", note:"θέλω" },
      { pres:"fero", perf:"tuli", sup:"latum", inf:"ferre", note:"φέρω, υπομένω" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"quos = eos: κύρια πρόταση", body:"Η αναφορική αντωνυμία quos, όταν βρίσκεται στην αρχή περιόδου και μετά από ισχυρό σημείο στίξης, ισοδυναμεί με δεικτική (quos = eos) και εισάγει κύρια (και όχι δευτερεύουσα αναφορική) πρόταση, εφόσον δεν υπάρχει άλλη κύρια." },
    { tag:"Έγκλιση", title:"Προτρεπτική υποτακτική", body:"Όλες οι κύριες προτάσεις είναι προτάσεις επιθυμίας που εκφέρονται με προτρεπτική υποτακτική (α΄ πληθ. ενεστώτα): imitemur, amemus, pareamus, consulamus, neglegamus, serviamus, putemus, speremus, feramus, arbitremur = «ας…»." },
    { tag:"Ρήμα", title:"imitor, arbitror: αποθετικά", body:"Τα imitor (imitari, 1) και arbitror (arbitrari, 1) είναι αποθετικά: κλίνονται στην παθητική φωνή αλλά έχουν ενεργητική σημασία και διατηρούν 6 τύπους από την ενεργητική φωνή (μτχ. ενεστ., υποτ./απαρ./μτχ. μέλλοντα, γερούνδιο, σουπίνο)." },
    { tag:"Ουσιαστικό", title:"res publica: σύνθετο ουσιαστικό", body:"Η res publica είναι σύνθετο ουσιαστικό όπου κλίνονται και τα δύο μέρη (rem publicam, rei publicae)· χρησιμοποιείται μόνο στον ενικό αριθμό." },
    { tag:"Μετοχή", title:"praesens: επιθετοποιημένη μετοχή", body:"Το praesentes είναι μετοχή ενεστώτα του praesum (< prae + sum) που λειτουργεί ως επιθετικός προσδιορισμός στο fructus (δηλώνει το σύγχρονο). Ως επιθετική σχηματίζει την αφαιρετική ενικού σε -i (και όχι σε -e)." },
    { tag:"Κατηγορούμενο", title:"sempiternam: συμφωνία με το πλησιέστερο", body:"Στο esse (2) υποκείμενα είναι δύο (motus, gloriam)· το κατηγορούμενο sempiternam τίθεται σε θηλυκό γένος, γιατί συμφωνεί με το πλησιέστερο υποκείμενο (gloriam)." }
  ],

  transforms: [
    { id:"Α", label:"Ανάλυση μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"praesentes fructus neglegamus", to:"fructus, qui praesunt, neglegamus… (qui + οριστική ενεστ.)", note:"επιθετική μετοχή στο fructus· εξάρτηση από αρκτικό χρόνο: neglegamus" }
    ]},
    { id:"Β", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"qui hanc rem publicam stabiliverunt", to:"a quibus haec res publica stabilita est" },
      { from:"quos equidem in deorum immortalium coetu ac numero repono", to:"qui (= ei) quidem in deorum immortalium coetu ac numero a me reponuntur" },
      { from:"Amemus patriam, pareamus senatui, consulamus bonis", to:"Patria a nobis ametur, senatus pareatur, boni consulantur" },
      { from:"posteritatis gloriae serviamus", to:"posteritatis gloria a nobis serviatur" },
      { from:"id esse optimum putemus", to:"id esse optimum a nobis putetur" }
    ]},
    { id:"Γ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"Imitemur nostros Brutos … alios, qui hanc rem publicam stabiliverunt", to:"Cicero monet (αρκτ. χρ.) / monuit (ιστορ. χρ.) Romanos ut imitentur / imitarentur suos Brutos … alios, qui illam rem publicam stabiliverint / stabilivissent· ή imitari suos Brutos…", note:"moneo, adhortor + βουλητική πρόταση (ut…) ή τελικό απαρέμφατο" },
      { from:"quos equidem in deorum … numero repono", to:"Cicero dicit (αρκτ. χρ.) / dixit (ιστορ. χρ.) se quidem eos in deorum … numero reponere" },
      { from:"Amemus patriam, pareamus senatui, consulamus bonis", to:"Cicero adhortatur / adhortabatur Romanos: ut ament / amarent…, (ut) pareant / parerent…, (ut) consulant / consulerent…· ή amare…, parere…, consulere…" },
      { from:"praesentes fructus neglegamus, posteritatis gloriae serviamus", to:"(ut) … neglegant / neglegerent, (ut) … serviant / servirent· ή … neglegere, … servire" },
      { from:"id esse optimum putemus, quod est rectissimum", to:"(ut) … putent / putarent, quod sit / esset…· ή id … putare, quod…" },
      { from:"speremus quae volumus, sed feramus quod acciderit", to:"(ut) sperent / sperarent quae velint / vellent, sed (ut) ferant / ferrent quod acciderit (υποτ. παρακ.) / accidisset· ή sperare quae…, sed ferre quod…" },
      { from:"arbitremur denique corpus … esse mortale …", to:"(ut) arbitrentur / arbitrarentur … ή arbitrari…" }
    ]},
    { id:"Δ", label:"Μετατροπή του πλαγίου λόγου σε ευθύ", items:[
      { from:"… ; id esse optimum putemus, …", to:"… ; id est optimum, …" },
      { from:"… ; arbitremur denique corpus virorum fortium magnorumque hominum esse mortale, animi vero motus et virtutis gloriam sempiternam esse", to:"corpus (ονομ.) virorum fortium magnorumque hominum est mortale (ονομ.), animi vero motus (ονομ.) et virtutis gloria sempiterna est" }
    ]}
  ],

  etymology: [
    { la:"imitemur", el:"(γαλλ.) imiter // ιμιτασιόν (< imitation, γαλλ.) // (αγγλ.) imitate (= μιμούμαι) // (ιταλ.) imitare (= μιμούμαι)." },
    { la:"Brutos", el:"Βρούτος // (αγγλ.) brute, brutal (= κτήνος· βάναυσος) // (γαλλ.) brut, brutal (= ακατέργαστος· βάναυσος) // (ιταλ.) bruto (= κτήνος, ζώο)." },
    { la:"Camillos", el:"Κάμιλλος // (γαλλ.) Camille." },
    { la:"Curios", el:"Κούριος." },
    { la:"Fabricios", el:"Φαμπρίκιος." },
    { la:"Scipiones", el:"Σκιπίωνας." },
    { la:"innumerabiles, numero", el:"νούμερο (< ιταλ.) // (γαλλ.) numéral (= αριθμός, ψηφίο) // (αγγλ.) number, numerous (= αριθμός· πολυάριθμος) // (ισπαν.) número (= αριθμός)." },
    { la:"alios", el:"άλλος, άλλη, άλλο // (αγγλ.) alien (= ξένος, αλλοδαπός), alias, alibi (= ψευδώνυμο· άλλοθι)." },
    { la:"rem", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός), rebus (= εικονόγριφος) // (γαλλ.) rien (= τίποτα)." },
    { la:"publicam", el:"(γαλλ.) publique (= δημόσιος) // (αγγλ.) public (= δημόσιος· κοινό), publish (= δημοσιεύω) // (ιταλ.) pubblico (= δημόσιος)." },
    { la:"rem publicam", el:"ρεπουμπλικανός, ρεπουμπλικανισμός // ρεπούμπλικα (= είδος ανδρικού καπέλου) (< ιταλ.) // (αγγλ.) republic (= δημοκρατία) // (γαλλ.) république (= δημοκρατία) // (ισπαν.) república (= δημοκρατία) // (γερμ.) Republik (= δημοκρατία)." },
    { la:"stabiliverunt", el:"ίστημι, στάση // (γαλλ.) stable (= σταθερός), stabilité (= σταθερότητα) // (αγγλ.) establish (= ιδρύω, εδραιώνω) // (ιταλ.) stabile (= σταθερός)." },
    { la:"deorum", el:"Ζεύς, (γενική) Διός // (αγγλ.) deity, deism (= θεότητα· ντεϊσμός) // (γαλλ.) dieu, adieu (= θεός· αντίο) // (ιταλ.) dio (= θεός) // (ισπαν.) dios (= θεός)." },
    { la:"immortalium, mortale", el:"βροτός // (γαλλ.) mort (= νεκρός) // (αγγλ.) mortal (= θνητός) // (ιταλ.) morte (= morte (= θάνατος)) // (ισπαν.) muerte (= muerte (= θάνατος))." },
    { la:"coetu (< cum + eo)", el:"είμι // (αγγλ.) exit (= exit (= έξοδος)), transit (= transit (= διέλευση))." },
    { la:"repono", el:"(γαλλ.) positionner (= τοποθετώ) // position (= θέση) // (αγγλ.) postpone (= postpone (= αναβάλλω)) // (ιταλ.) porre (= porre (= θέτω, τοποθετώ)) // (ισπαν.) poner (= poner (= βάζω, τοποθετώ))." },
    { la:"amemus", el:"αμόρε (< ιταλ.) // (γαλλ.) amour, aimer (= aimer (= αγαπώ)) // (αγγλ.) amateur (= amateur (= ερασιτέχνης)) // (ισπαν.) amar (= amar (= αγαπώ))." },
    { la:"patriam", el:"πατρίς, πατήρ· πατέρας // (γαλλ.) patrie (= patrie (= πατρίδα)) // (ιταλ.) patria (= patria (= πατρίδα))." },
    { la:"pareamus", el:"(γαλλ.) parent (= γονέας), apparaître (= apparaître (= εμφανίζομαι)) // (αγγλ.) apparent (= apparent (= εμφανής, προφανής))." },
    { la:"senatui", el:"(αγγλ.) senator (= γερουσιαστής), senior (= ηλικιωμένος) // (ιταλ.) signore (= signore (= κύριος)) // (ισπαν.) señor (= señor (= κύριος))." },
    { la:"consulamus", el:"(γαλλ.) consulter (= συμβουλεύω) // (αγγλ.) consultant (= σύμβουλος) // (ισπαν.) consultar (= consultar (= συμβουλεύομαι))." },
    { la:"bonis", el:"μπονα-μάς [< ιταλ. bona mano (= καλό χέρι)], μπουνάτσα (< βενετ.) (= καλοκαιρία), μπόνους // (αγγλ.) bounty (= bounty (= γενναιοδωρία, αμοιβή)) // (ιταλ.) buono (= buono (= καλός)) // (ισπαν.) bueno (= bueno (= καλός))." },
    { la:"prae-sentes, esse, est / fructus", el:"είμί // fructus → φρούτο (< ιταλ.) // (γαλλ.) fruit (= φρούτο) // (αγγλ.) present (= present (= παρών)), essence (= essence (= ουσία)) // (ισπαν.) fruto (= fruto (= καρπός)) // (γερμ.) Frucht (= Frucht (= καρπός, φρούτο))." },
    { la:"neglegamus", el:"(αγγλ.) neglect (= παραμέληση) // (γαλλ.) négligence // (ιταλ.) negligente (= negligente (= αμελής))." },
    { la:"posteritatis", el:"(γαλλ.) postérité (= απόγονοι) // (αγγλ.) posterior (= μεταγενέστερος), posterity (= posterity (= απόγονοι, μεταγενέστεροι)) // (ισπαν.) posteridad (= αιωνιότητα) // (ιταλ.) posterità (= posterità (= απόγονοι, μεταγένεια))." },
    { la:"gloriae, gloriam", el:"(αγγλ.) glory, (γαλλ.) gloire, glorious (= glorious (= ένδοξος)) // (ιταλ.) gloria (= gloria (= δόξα)) // (ισπαν.) gloria (= gloria (= δόξα))." },
    { la:"serviamus", el:"(γαλλ.) servir // (αγγλ.) serve (= υπηρετώ, σερβίρω), service (= υπηρεσία), servant (= υπηρέτης) // (ιταλ.) servire (= υπηρετώ)." },
    { la:"optimum", el:"(γαλλ.) optimal // οπτιμισμός (< γαλλ.) // (αγγλ.) optimum (= βέλτιστο), optimism (= αισιοδοξία), optimize (= βελτιστοποιώ) // (ιταλ.) ottimo (= άριστος, βέλτιστος)." },
    { la:"putemus", el:"(αγγλ.) dis-putation (= συζήτηση, λογομαχία), putative (= υποτιθέμενος), compute (= υπολογίζω), computer (= υπολογιστής), count (= μετρώ), reputation (= φήμη, υπόληψη), amputate (= ακρωτηριάζω) // (γαλλ.) compter (= μετρώ)." },
    { la:"rectissimum", el:"(γαλλ.) cor-rect (= σωστό) // (αγγλ.) rectify (= διορθώνω), rectangle (= ορθογώνιο), erect (= όρθιος, ανεγείρω), direct (= άμεσος, κατευθύνω)." },
    { la:"speremus", el:"(γαλλ.) espérer (= ελπίζω), espoir (= ελπίδα) // Σπεράντζα // (αγγλ.) desperate (= απελπισμένος), despair (= απελπισία) // (ισπαν.) esperar (= ελπίζω, περιμένω), esperanza (= ελπίδα (πρβλ. Esperanto))." },
    { la:"volumus", el:"βούλομαι // (αγγλ.) volunteer (= εθελοντής), voluntary (= εθελοντικός, εκούσιος), volition (= βούληση), benevolent (= καλοπροαίρετος) // (γαλλ.) vouloir (= θέλω)." },
    { la:"feramus", el:"φέρω, διαφορά, φορέας, φορείο // (αγγλ.) trans-fer (= μεταφορά), offer (= προσφέρω), suffer (= υποφέρω), refer (= αναφέρω, παραπέμπω), fertile (= γόνιμος) // (γαλλ.) offrir (= προσφέρω), souffrir (= υποφέρω)." },
    { la:"acciderit", el:"(γαλλ.) accident (= ατύχημα) // (αγγλ.) accidental (= τυχαίος)." },
    { la:"arbitremur", el:"(γαλλ.) arbitre (= διαιτητής, κριτής), arbitrer (= διαιτητεύω) // (αγγλ.) arbiter (= διαιτητής, κριτής), arbitrary (= αυθαίρετος), arbitrate (= διαιτητεύω) // (ιταλ.) arbitro (= διαιτητής)." },
    { la:"corpus", el:"κόρπους (= σώμα κειμένων) // (αγγλ.) corpse (= πτώμα), corps (= σώμα (στρατού)), corporation (= εταιρεία, σωματείο) // (γαλλ.) corps (= σώμα) // (ισπαν.) cuerpo (= σώμα)." },
    { la:"virorum, virtutis", el:"βιρτουόζος (< ιταλ. virtuoso) // (αγγλ.) virtue (= αρετή), virtual (= εικονικός, δυνητικός), virile (= ανδρικός, ρωμαλέος) // (γαλλ.) vertu (= αρετή), viril (= ανδρικός)." },
    { la:"fortium", el:"(γαλλ.) fort (= σωματική δύναμη) // (ισπαν.) fortaleza (= φρούριο) // (αγγλ.) fortify (= οχυρώνω), fortitude (= σθένος, καρτερία), force (= δύναμη, βία), comfort (= άνεση, παρηγοριά) // (ιταλ.) forte (= δυνατός, δυνατά (μουσ.))." },
    { la:"magnorum", el:"μέγας // (αγγλ.) magnific (= μεγαλοπρεπής), magnitude (= μέγεθος), magnify (= μεγεθύνω), magnate (= μεγιστάνας), major (= μείζων, ανώτερος) // (γαλλ.) magnificence (= μεγαλοπρέπεια) // (ιταλ.) maggiore (= μεγαλύτερος)." },
    { la:"hominum", el:"ουμανισμός (< γαλλ.) // (αγγλ.) homicide (= ανθρωποκτονία), homage (= φόρος τιμής, υποτέλεια) // (γαλλ.) homme (= άνθρωπος, άνδρας), on (= αόριστη αντωνυμία 'κανείς, οι άνθρωποι') // (ιταλ.) uomo (= άνθρωπος, άνδρας) // (ισπαν.) hombre (= άνθρωπος, άνδρας)." },
    { la:"animi", el:"ανιμισμός (< γαλλ.) / άνεμος // (αγγλ.) unanimous (= ομόφωνος), animosity (= εχθρότητα, μνησικακία), animal (= ζώο) // (γαλλ.) âme (= ψυχή) // (ισπαν.) alma (= ψυχή)." },
    { la:"motus", el:"μοτέρ (< γαλλ.) // μοτίβο (επαναλαμβανόμενο στοιχείο μουσικού θέματος) [< ιταλ. motivo (= κίνητρο)] // (αγγλ.) motion (= κίνηση), emotion (= συναίσθημα, συγκίνηση), motive (= κίνητρο), momentum (= ορμή, φορά), mobile (= κινητός), remote (= απομακρυσμένος) // (γαλλ.) mouvement (= κίνηση)." },
    { la:"sempiternam", el:"(ισπαν.) siempre (= πάντα) // (αγγλ.) sempiternal (= αιώνιος, αέναος) // (γαλλ.) sempiternel (= αέναος, ατελεύτητος) // (ιταλ.) sempre (= πάντα)." }
  ]
};

export default UNIT;
