export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 22,
  title: "Προτροπές προς τους Ρωμαίους",
  latinTitle: "Lectio XXII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Imitemur', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. — αποθετικό ρ.', d:'imitor, imitatus sum, imitari (αποθ. 1) — μιμούμαι', note:'Προτρεπτική υποτακτική. Εννοούμενο υποκ.: nos.' },
        { l:'nostros', r:'Επιθετικός προσδ.', to:'στα Brutos, Camillos, Decios, Curios, Fabricios, Scipiones', g:'αιτ. πληθ., αρσ. — κτητική αντων. α΄ προσ. (πολλοί κτήτορες)', d:'noster, nostra, nostrum — ο δικός μας' },
        { l:'Brutos', r:'Αντικείμενο', to:'στο Imitemur', g:'αιτ. πληθ., αρσ.', d:'Brutus, -i (αρσ. β΄, μόνο ενικ.) — ο Βρούτος', a:',' },
        { l:'Camillos', r:'Αντικείμενο', to:'στο Imitemur', g:'αιτ. πληθ., αρσ.', d:'Camillus, -i (αρσ. β΄, μόνο ενικ.) — ο Κάμιλλος', a:',' },
        { l:'Decios', r:'Αντικείμενο', to:'στο Imitemur', g:'αιτ. πληθ., αρσ.', d:'Decius, -ii/-i (αρσ. β΄, μόνο ενικ.) — ο Δέκιος', a:',' },
        { l:'Curios', r:'Αντικείμενο', to:'στο Imitemur', g:'αιτ. πληθ., αρσ.', d:'Curius, -ii/-i (αρσ. β΄, μόνο ενικ.) — ο Κούριος', a:',' },
        { l:'Fabricios', r:'Αντικείμενο', to:'στο Imitemur', g:'αιτ. πληθ., αρσ.', d:'Fabricius, -ii/-i (αρσ. β΄, μόνο ενικ.) — ο Φαβρίκιος', a:',' },
        { l:'Scipiones', r:'Αντικείμενο', to:'στο Imitemur', g:'αιτ. πληθ., αρσ.', d:'Scipio, -onis (αρσ. γ΄, μόνο ενικ.) — ο Σκιπίωνας', a:',' },
        { l:'innumerabiles', r:'Επιθετικός προσδ.', to:'στο alios', g:'αιτ. πληθ., αρσ. — τριτόκλ. επίθ.', d:'innumerabilis, -is, -e — αμέτρητος', note:'Δεν έχει παραθετικά λόγω σημασίας.' },
        { l:'alios', r:'Αντικείμενο', to:'στο Imitemur', g:'αιτ. πληθ., αρσ. — αόριστη επιθ. αντων. (αντωνυμικό επίθετο)', d:'alius, alia, aliud — άλλος, -η, -ο', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική επιθετική προσδιοριστική, ως επιθ. προσδ. στα Brutos, Camillos, Decios, Curios, Fabricios, Scipiones (και alios). Εισάγεται με την αναφ. αντων. qui· εκφέρεται με οριστική (stabiliverunt), γιατί δηλώνει το πραγματικό.', kids:[
          { l:'qui', r:'Υποκείμενο', to:'στο stabiliverunt', g:'ονομ. πληθ., αρσ. — αναφ. αντων.', d:'qui, quae, quod — ο οποίος, -α, -ο' },
          { l:'stabiliverunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακ. ενεργ.', d:'stabilio, stabilivi, stabilitum, stabilire (4) — στερεώνω' },
          { l:'hanc', r:'Επιθετικός προσδ.', to:'στο rem publicam', g:'αιτ. ενικ., θηλ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, -ή, -ό' },
          { l:'rem', r:'Αντικείμενο', to:'στο stabiliverunt', g:'αιτ. ενικ., θηλ.', d:'res, rei (θηλ. ε΄) — το πράγμα· res publica = η πολιτεία' },
          { l:'publicam', r:'Επιθετικός προσδ.', to:'στο rem', g:'αιτ. ενικ., θηλ. — δευτερόκλ. επίθ.', d:'publicus, -a, -um — δημόσιος', a:';', note:'Δεν έχει παραθετικά λόγω σημασίας. res publica = η πολιτεία.' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'quos', r:'Αντικείμενο', to:'στο repono', g:'αιτ. πληθ., αρσ. — αναφ. αντων.', d:'qui, quae, quod — ο οποίος, -α, -ο', note:'Αναφορική σύνδεση: εισάγει κύρια πρόταση (= et eos), δεν σχηματίζει δευτερεύουσα.' },
        { l:'equidem', r:'Επιρρ. προσδ. του τρόπου', to:'στο repono', g:'βεβαιωτικό επίρρημα (ego + quidem)', d:'equidem — (εγώ) βέβαια' },
        { l:'repono', r:'Ρήμα', g:'α΄ ενικ. οριστ. ενεστ. ενεργ.', d:'repono, reposui, repositum, reponere (3) — τοποθετώ', note:'Εννοούμενο υποκ.: ego.' },
        { l:'in deorum immortalium coetu', k:'coetus', r:'Εμπρόθετος επιρρ. προσδ. τόπου (μεταφορικά)', to:'στο repono', g:'in (πρόθ. + αφαιρ.) + coetu (αφαιρ. ενικ., αρσ.)', d:'in — σε· coetus, -us (αρσ. δ΄) — η συνάθροιση («η χορεία»)', note:'deorum: γεν. υποκειμενική στο coetu (και γεν. διαιρετική στο numero). immortalium: επιθ. προσδ. στο deorum (δεν έχει παραθετικά λόγω σημασίας).' },
        { l:'ac', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'ac — και' },
        { l:'numero', r:'Εμπρόθετος επιρρ. προσδ. τόπου (μεταφορικά)', to:'στο repono', g:'αφαιρ. ενικ., αρσ. (με εννοούμενη την πρόθ. in)', d:'numerus, -i (αρσ. β΄) — ο αριθμός', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Amemus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ.', d:'amo, amavi, amatum, amare (1) — αγαπώ', note:'Προτρεπτική υποτακτική. Εννοούμενο υποκ.: nos.' },
        { l:'patriam', r:'Αντικείμενο', to:'στο Amemus', g:'αιτ. ενικ., θηλ.', d:'patria, -ae (θηλ. α΄) — η πατρίδα', a:',' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'pareamus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. (+ δοτ.)', d:'pareo, parui, paritum, parere (2) — υπακούω', note:'Προτρεπτική υποτακτική. Το pareo συντάσσεται με δοτική.' },
        { l:'senatui', r:'Αντικείμενο', to:'στο pareamus', g:'δοτ. ενικ., αρσ.', d:'senatus, -us (αρσ. δ΄, μόνο ενικ.) — η Σύγκλητος', a:',' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'consulamus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ.', d:'consulo, consului, consultum, consulere (3) — φροντίζω', note:'Προτρεπτική υποτακτική. consulo + δοτ. = φροντίζω για.' },
        { l:'bonis', r:'Δοτική προσωπική χαριστική', to:'στο consulamus', g:'δοτ. πληθ., αρσ. — δευτερόκλ. επίθ. (ως ουσ.)', d:'bonus, -a, -um — καλός· ως ουσ. boni, -orum — οι καλοί πολίτες', a:';' }
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'neglegamus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ.', d:'neglego / negligo, neglexi, neglectum, neglegere (3) — αδιαφορώ', note:'Προτρεπτική υποτακτική.' },
        { l:'praesentes', r:'Επιθετική μετοχή / επιθ. προσδ.', to:'στο fructus', g:'αιτ. πληθ., αρσ. — μτχ. ενεστ.', d:'praesum, praefui, —, praeesse — είμαι μπροστά, προηγούμαι· praesens — παρών, εφήμερος', note:'Επιθετική μετοχή με υποκ. fructus, ως επιθ. προσδ. στο fructus.' },
        { l:'fructus', r:'Αντικείμενο', to:'στο neglegamus', g:'αιτ. πληθ., αρσ.', d:'fructus, -us (αρσ. δ΄) — η ωφέλεια, το κέρδος', a:',' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'serviamus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. (+ δοτ.)', d:'servio, servivi, servitum, servire (4) — υπηρετώ', note:'Προτρεπτική υποτακτική. servio + δοτ.' },
        { l:'gloriae', r:'Αντικείμενο', to:'στο serviamus', g:'δοτ. ενικ., θηλ.', d:'gloria, -ae (θηλ. α΄) — η δόξα' },
        { l:'posteritatis', r:'Γενική κτητική', to:'στο gloriae', g:'γεν. ενικ., θηλ.', d:'posteritas, posteritatis (θηλ. γ΄, μόνο ενικ.) — το μέλλον, οι μεταγενέστεροι', a:';' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'putemus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ.', d:'puto, putavi, putatum, putare (1) — νομίζω, θεωρώ', note:'Προτρεπτική υποτακτική.' },
        { l:'id', r:'Υποκείμενο ειδ. απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. ενικ., ουδ. — δεικτ. (επαναληπτική) αντων.', d:'is, ea, id — αυτός, -ή, -ό', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική επιθετική προσδιοριστική, ως επεξήγηση στο id. Εισάγεται με το quod· εκφέρεται με οριστική ενεστ. (est), γιατί δηλώνει το πραγματικό.', kids:[
          { l:'quod', r:'Υποκείμενο', to:'στο est', g:'ονομ. ενικ., ουδ. — αναφ. αντων.', d:'qui, quae, quod — ο οποίος, -α, -ο' },
          { l:'est', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, —, esse — είμαι, υπάρχω' },
          { l:'rectissimum', r:'Κατηγορούμενο', to:'στο quod (μέσω του est)', g:'ονομ. ενικ., ουδ. — δευτερόκλ. επίθ. (υπερθ.)', d:'rectissimus, -a, -um — ο πιο σωστός (υπερθ. του rectus, -a, -um)', a:',' }
        ]},
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο putemus', g:'απαρ. ενεστ.', d:'sum, fui, —, esse — είμαι', note:'Ειδικό απαρέμφατο με υποκ. id (ετεροπροσωπία).' },
        { l:'optimum', r:'Κατηγορούμενο', to:'στο id (μέσω του esse)', g:'αιτ. ενικ., ουδ. — δευτερόκλ. επίθ. (υπερθ.)', d:'optimus, -a, -um — άριστος (υπερθ. του bonus, -a, -um)', a:';' }
      ]}
    ]},

    { n: 9, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'speremus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ.', d:'spero, speravi, speratum, sperare (1) — ελπίζω', note:'Προτρεπτική υποτακτική. Αντικ. του είναι η αναφ. πρόταση quae volumus.' },
        { type:'sub', key:'anaforiki', label:'Αναφορική (ουσιαστική)', note:'Δευτ. αναφορική ουσιαστική, ως αντικείμενο στο speremus. Εισάγεται με το quae· εκφέρεται με οριστική ενεστ. (volumus), γιατί δηλώνει το πραγματικό.', kids:[
          { l:'quae', r:'Αντικείμενο', to:'στο volumus', g:'αιτ. πληθ., ουδ. — αναφ. αντων.', d:'qui, quae, quod — ο οποίος, -α, -ο' },
          { l:'volumus', r:'Ρήμα', g:'α΄ πληθ. οριστ. ενεστ. — ανώμαλο', d:'volo, volui, —, velle — θέλω', a:',', note:'Εννοούμενο υποκ.: nos.' }
        ]}
      ]}
    ]},

    { n: 10, kids: [
      { l:'sed', r:'Σύνδεσμος', g:'αντιθετικός (παρατακτικός) σύνδεσμος', d:'sed — αλλά', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', note:'Εννοούμενο υποκ.: nos.', kids:[
        { l:'feramus', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. ενεργ. — ανώμαλο', d:'fero, tuli, latum, ferre — υπομένω, φέρω', note:'Προτρεπτική υποτακτική. Αντικ. του είναι η αναφ. πρόταση quod acciderit.' },
        { type:'sub', key:'anaforiki', label:'Αναφορική (ουσιαστική)', note:'Δευτ. αναφορική ουσιαστική, ως αντικείμενο στο feramus. Εισάγεται με το quod· εκφέρεται με οριστική συντ. μέλλ. (acciderit), γιατί δηλώνει το πραγματικό.', kids:[
          { l:'quod', r:'Υποκείμενο', to:'στο acciderit', g:'ονομ. ενικ., ουδ. — αναφ. αντων.', d:'qui, quae, quod — ο οποίος, -α, -ο' },
          { l:'acciderit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. συντ. μέλλ. ενεργ. — απρόσωπο', d:'accidit, accidit, —, accidere (3, ad+cado) — συμβαίνει', a:';' }
        ]}
      ]}
    ]},

    { n: 11, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'denique', r:'Επιρρ. προσδ. του χρόνου', to:'στο arbitremur', g:'χρονικό επίρρημα', d:'denique — τέλος' },
        { l:'arbitremur', r:'Ρήμα', g:'α΄ πληθ. υποτ. ενεστ. — αποθετικό ρ.', d:'arbitror, arbitratus sum, arbitrari (αποθ. 1) — νομίζω, πιστεύω', note:'Προτρεπτική υποτακτική. Εννοούμενο υποκ.: nos.' },
        { l:'corpus', r:'Υποκείμενο ειδ. απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. ενικ., ουδ.', d:'corpus, corporis (ουδ. γ΄) — το σώμα' },
        { l:'fortium', r:'Επιθετικός προσδ.', to:'στο virorum', g:'γεν. πληθ., αρσ. — τριτόκλ. επίθ.', d:'fortis, -is, -e — γενναίος, δυνατός' },
        { l:'virorum', r:'Γενική κτητική', to:'στο corpus', g:'γεν. πληθ., αρσ.', d:'vir, viri (αρσ. β΄) — ο άντρας' },
        { l:'magnorumque', r:'Επιθετικός προσδ.', to:'στο hominum', g:'γεν. πληθ., αρσ. — δευτερόκλ. επίθ. (+ εγκλιτ. -que)', d:'magnus, -a, -um — μεγάλος· -que — και', note:'Το εγκλιτικό -que (συμπλεκτικός) συνδέει τα virorum και hominum.' },
        { l:'hominum', r:'Γενική κτητική', to:'στο corpus', g:'γεν. πληθ., αρσ.', d:'homo, hominis (αρσ./θηλ. γ΄) — ο άνθρωπος' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο arbitremur', g:'απαρ. ενεστ.', d:'sum, fui, —, esse — είμαι', note:'Ειδικό απαρέμφατο με υποκ. corpus (ετεροπροσωπία).' },
        { l:'mortale', r:'Κατηγορούμενο', to:'στο corpus (μέσω του esse)', g:'αιτ. ενικ., ουδ. — τριτόκλ. επίθ.', d:'mortalis, -is, -e — θνητός', a:',', note:'Δεν έχει παραθετικά λόγω σημασίας.' },
        { l:'animi', r:'Γενική υποκειμενική', to:'στο motus', g:'γεν. ενικ., αρσ.', d:'animus, -i (αρσ. β΄) — η ψυχή, το πνεύμα' },
        { l:'vero', r:'Σύνδεσμος', g:'αντιθετικός σύνδεσμος (μετά τη λέξη)', d:'vero — όμως', note:'Παρατακτικός αντιθετικός· τίθεται πάντοτε ως δεύτερη λέξη (δεν αρχίζει πρόταση).' },
        { l:'motus', r:'Υποκείμενο ειδ. απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. πληθ., αρσ.', d:'motus, -us (αρσ. δ΄) — η κίνηση· animi motus = οι πνευματικές δραστηριότητες' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός σύνδεσμος', d:'et — και' },
        { l:'gloriam', r:'Υποκείμενο ειδ. απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. ενικ., θηλ.', d:'gloria, -ae (θηλ. α΄) — η δόξα' },
        { l:'virtutis', r:'Γενική κτητική', to:'στο gloriam', g:'γεν. ενικ., θηλ.', d:'virtus, virtutis (θηλ. γ΄) — η ανδρεία' },
        { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο arbitremur', g:'απαρ. ενεστ.', d:'sum, fui, —, esse — είμαι', note:'Ειδικό απαρέμφατο με υποκ. motus και gloriam (ετεροπροσωπία).' },
        { l:'sempiternam', r:'Κατηγορούμενο', to:'στα motus, gloriam (μέσω του esse)', g:'αιτ. ενικ., θηλ. — δευτερόκλ. επίθ.', d:'sempiternus, -a, -um — αιώνιος', a:'.', note:'Δεν έχει παραθετικά λόγω σημασίας.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Imitemur nostros Brutos,", el:"Ας μιμούμαστε τους δικούς μας Βρούτους," },
    { la:"Camillos, Decios, Curios, Fabricios, Scipiones,", el:"Κάμιλλους, Δέκιους, Κούριους, Φαβρίκιους, Σκιπίωνες," },
    { la:"innumerabiles alios,", el:"(και) αμέτρητους άλλους," },
    { la:"qui stabiliverunt hanc rem publicam;", el:"οι οποίοι στερέωσαν αυτή την πολιτεία·" },
    { la:"quos equidem repono", el:"σε αυτούς βέβαια εγώ δίνω μια θέση" },
    { la:"in deorum immortalium coetu ac numero.", el:"ανάμεσα στους αθάνατους θεούς." },
    { la:"Amemus patriam,", el:"Ας αγαπάμε την πατρίδα," },
    { la:"pareamus senatui,", el:"ας υπακούουμε στη Σύγκλητο," },
    { la:"consulamus bonis;", el:"ας φροντίζουμε για τους καλούς πολίτες·" },
    { la:"neglegamus praesentes fructus,", el:"ας αδιαφορούμε για τα εφήμερα κέρδη," },
    { la:"serviamus gloriae posteritatis;", el:"ας υπηρετούμε τη δόξα του μέλλοντος·" },
    { la:"putemus id,", el:"ας θεωρούμε ότι αυτό" },
    { la:"quod est rectissimum,", el:"που είναι το σωστότερο" },
    { la:"esse optimum;", el:"είναι και το καλύτερο·" },
    { la:"speremus quae volumus,", el:"ας ελπίζουμε αυτά που επιθυμούμε," },
    { la:"sed feramus quod acciderit;", el:"αλλά ας υπομένουμε αυτό που θα έχει συμβεί·" },
    { la:"denique arbitremur", el:"τέλος, ας θεωρούμε" },
    { la:"corpus fortium virorum", el:"ότι το σώμα των γενναίων ανδρών" },
    { la:"magnorumque hominum esse mortale,", el:"και των μεγάλων ανθρώπων είναι θνητό," },
    { la:"animi vero motus", el:"αλλά οι πνευματικές δραστηριότητες" },
    { la:"et gloriam virtutis esse sempiternam.", el:"και η δόξα της ανδρείας είναι αιώνια." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"gloria, -ae" },
        { form:"patria, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"animus, -i" },
        { form:"boni, -orum", note:"δεν έχει ενικό" },
        { form:"Brutus, -i", note:"δεν έχει πληθυντικό" },
        { form:"Camillus, -i", note:"δεν έχει πληθυντικό" },
        { form:"Curius, -ii (-i)", note:"δεν έχει πληθυντικό" },
        { form:"Decius, -ii (-i)", note:"δεν έχει πληθυντικό" },
        { form:"deus, -i" },
        { form:"Fabricius, -ii (-i)", note:"δεν έχει πληθυντικό" },
        { form:"numerus, -i" },
        { form:"vir, viri" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"homo, -inis" },
        { form:"Scipio, -onis", note:"δεν έχει πληθυντικό" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"posteritas, posteritatis", note:"δεν έχει πληθυντικό" },
        { form:"virtus, virtutis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"corpus, corporis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"coetus, -us" },
        { form:"senatus, -us", note:"δεν έχει πληθυντικό" },
        { form:"fructus, -us" },
        { form:"motus, -us" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[ { form:"res, rei" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"bonus, -a, -um" },
      { form:"magnus, -a, -um" },
      { form:"publicus, -a, -um", note:"δεν έχει παραθετικά λόγω σημασίας" },
      { form:"rectus, -a, -um" },
      { form:"sempiternus, -a, -um", note:"δεν έχει παραθετικά λόγω σημασίας" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"fortis, -is, -e" },
      { form:"immortalis, -is, -e", note:"δεν έχει παραθετικά λόγω σημασίας" },
      { form:"innumerabilis, -is, -e", note:"δεν έχει παραθετικά λόγω σημασίας" },
      { form:"mortalis, -is, -e", note:"δεν έχει παραθετικά λόγω σημασίας" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"bonus, -a, -um", comp:"melior, -ior, -ius", sup:"optimus, -a, -um" },
      { pos:"magnus, -a, -um", comp:"maior, -ior, -ius", sup:"maximus, -a, -um" },
      { pos:"publicus, -a, -um", comp:"—", sup:"—", note:"λόγω σημασίας" },
      { pos:"rectus, -a, -um", comp:"rectior, -ior, -ius", sup:"rectissimus, -a, -um" },
      { pos:"sempiternus, -a, -um", comp:"—", sup:"—", note:"λόγω σημασίας" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"fortis, -is, -e", comp:"fortior, -ior, -ius", sup:"fortissimus, -a, -um" },
      { pos:"immortalis, -is, -e", comp:"—", sup:"—", note:"λόγω σημασίας" },
      { pos:"innumerabilis, -is, -e", comp:"—", sup:"—", note:"λόγω σημασίας" },
      { pos:"mortalis, -is, -e", comp:"—", sup:"—", note:"λόγω σημασίας" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"alius, alia, aliud", kind:"Αόριστη", extra:"ή αντωνυμικό επίθετο" },
    { form:"hic, haec, hoc", kind:"Δεικτική" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"noster, nostra, nostrum", kind:"Κτητική", extra:"α΄ προσ., πολλοί κτήτορες" },
    { form:"qui, quae, quod", kind:"Αναφορική" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"amo", perf:"amavi", sup:"amatum", inf:"amare", note:"" },
      { pres:"puto", perf:"putavi", sup:"putatum", inf:"putare", note:"" },
      { pres:"spero", perf:"speravi", sup:"speratum", inf:"sperare", note:"" },
      { pres:"arbitror", perf:"arbitratus sum", sup:"—", inf:"arbitrari", note:"αποθετικό" },
      { pres:"imitor", perf:"imitatus sum", sup:"—", inf:"imitari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"pareo", perf:"parui", sup:"paritum", inf:"parere", note:"+ δοτ." }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"accidit", perf:"accidit", sup:"—", inf:"accidere", note:"απρόσωπο (ad+cado)" },
      { pres:"consulo", perf:"consului", sup:"consultum", inf:"consulere", note:"" },
      { pres:"neglego / negligo", perf:"neglexi", sup:"neglectum", inf:"neglegere / negligere", note:"" },
      { pres:"repono", perf:"reposui", sup:"repositum", inf:"reponere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"stabilio", perf:"stabilivi", sup:"stabilitum", inf:"stabilire", note:"" },
      { pres:"servio", perf:"servivi", sup:"servitum", inf:"servire", note:"" }
    ]},
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"praesum", perf:"praefui", sup:"—", inf:"praeesse", note:"σύνθετο του sum" },
      { pres:"fero", perf:"tuli", sup:"latum", inf:"ferre", note:"ανώμαλο" },
      { pres:"volo", perf:"volui", sup:"—", inf:"velle", note:"ανώμαλο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ ────────────────────────────────────────────────
  sos: [
    { tag:"Έγκλιση", title:"Προτρεπτική υποτακτική", body:"Όλα τα ρήματα των κύριων προτάσεων (Imitemur, Amemus, pareamus, consulamus, neglegamus, serviamus, putemus, speremus, feramus, arbitremur) είναι υποτακτική ενεστώτα με προτρεπτική σημασία («ας…») — εξ ου και ο τίτλος «Προτροπές»." },
    { tag:"Αντωνυμία", title:"quos: αναφορική σύνδεση", body:"Το quos (πρόταση 3) δεν εισάγει δευτερεύουσα· είναι αναφορική σύνδεση (= et eos) στην αρχή κύριας πρότασης. Αντίθετα τα qui / quod / quae (προτ. 2, 10, 12, 14) εισάγουν πραγματικές δευτ. αναφορικές προτάσεις." },
    { tag:"Σύνταξη", title:"Ρήματα με δοτική", body:"Τα pareo και servio συντάσσονται με δοτική ως αντικείμενο (senatui, gloriae), ενώ στο consulamus bonis το bonis είναι δοτική προσωπική χαριστική — προσοχή να μη θεωρηθεί αφαιρετική." },
    { tag:"Απαρέμφατο", title:"Ετεροπροσωπία στα ειδικά απαρέμφατα", body:"Τα ειδικά απαρέμφατα esse (putemus / arbitremur) έχουν υποκείμενα διαφορετικά από το υποκ. του ρήματος εξάρτησης: id, corpus, motus-gloriam. Πρόκειται για ετεροπροσωπία." },
    { tag:"Παραθετικά", title:"Έλλειψη λόγω σημασίας", body:"Δεν σχηματίζουν παραθετικά (λόγω σημασίας): innumerabilis, immortalis, mortalis, sempiternus, publicus." },
    { tag:"Σύνδεσμος", title:"vero: εγκλιτική θέση", body:"Το vero (αντιθετικός σύνδεσμος) δεν μπαίνει ποτέ στην αρχή της πρότασης· τίθεται πάντοτε ως δεύτερη λέξη: animi vero motus…" }
  ]
};

export default UNIT;
