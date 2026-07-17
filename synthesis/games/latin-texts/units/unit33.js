export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 33,
  title: "Καιρός για ανασυγκρότηση",
  latinTitle: "Lectio XXXIII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Omnia', r:'Υποκείμενο', to:'στο sunt excitanda', g:'ονομ. πληθ., ουδ. — δικατάληκτο επίθ. γ΄ κλ. (γεν. omnis)', d:'omnis, -is, -e — όλος, -η, -ο', note:'Το επίθετο δεν σχηματίζει παραθετικά, γιατί δηλώνει κάτι απόλυτο.' },
        { l:'sunt', r:'Ρήμα', to:'(παθητική περιφραστική συζυγία, προσωπική σύνταξη)', g:'γ΄ πληθ. οριστ. ενεστ. — μαζί με το γερουνδιακό excitanda', d:'sum, fui, —, esse — είμαι' },
        { l:'excitanda', r:'Κατηγορούμενο', to:'στο Omnia (μέσω του sunt)', g:'ονομ. πληθ., ουδ. — γερουνδιακό (excitandus, -a, -um)', d:'excito, excitavi, excitatum, excitare (1) — αποκαθιστώ, ανασυγκροτώ', note:'Προσωπική σύνταξη, γιατί το γερουνδιακό ανήκει σε ρήμα ενεργητικό, μεταβατικό που συντάσσεται με αιτιατική.' },
        { l:'tibi', r:'Δοτική προσωπική του ενεργούντος προσώπου (ή του ποιητικού αιτίου)', to:'στο sunt excitanda', g:'δοτ. ενικ., αρσ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ' },
        { l:'uni', r:'Κατηγορηματικός προσδ.', to:'στο tibi', g:'δοτ. ενικ., αρσ. — αντωνυμικό (εδώ) επίθ.', d:'unus, una, unum — μόνος, -η, -ο', note:'Ως αντωνυμικό επίθ.: γεν. ενικ. σε -ius (unius), δοτ. ενικ. σε -i (uni)· δεν σχηματίζει κλητική.' },
        { l:'C.', r:'Κλητική προσφώνηση', to:'', g:'κλητ. ενικ. — κύριο όνομα β΄ κλ. (Gaius, Gaii / Gai)', d:'Gaius, Gaii / Gai (αρσ. β΄) — Γάιος', note:'Ως υπερδισύλλαβο σε -ius σχηματίζει γεν. σε -ii/-i και κλητ. σε -i (Gai) αντί -ie, με συναίρεση· πρβ. filius.' },
        { l:'Caesar', r:'Κλητική προσφώνηση', to:'', g:'κλητ. ενικ. — κύριο όνομα γ΄ κλ.', d:'Caesar, Caesaris (αρσ. γ΄) — Καίσαρας', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση στον όρο Omnia της κύριας. Εισάγεται με την αναφορική αντων. quae και εκφέρεται με οριστική, γιατί εκφράζει το πραγματικό· χρόνου ενεστ. (sentis), γιατί αναφέρεται στο παρόν.', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο sentis και στο απαρέμφατο iacere (ετεροπροσωπία)', g:'αιτ. πληθ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'iacere', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο sentis', g:'απαρέμφατο ενεστ. ενεργ. φωνής', d:'iaceo, iacui, iacitum, iacere (2) — κείμαι, βρίσκομαι' },
          { l:'sentis', r:'Ρήμα', g:'β΄ ενικ. οριστ. ενεστ. ενεργ. φωνής', d:'sentio, sensi, sensum, sentire (4) — αισθάνομαι, ξέρω' },
          { l:'perculsa', r:'Επιρρ. κατηγορούμενο του τρόπου (επιθετοποιημένη μτχ.)', to:'στο quae (μέσω του iacere)', g:'αιτ. πληθ., ουδ. — μτχ. παρακ. παθ. φωνής', d:'percello, perculi, perculsum, percellere (< per + cello) (3) — ανατρέπω' },
          { l:'atque', r:'Σύνδεσμος', g:'συμπλεκτικός (καταφατικός, παρατακτικός) σύνδεσμος', d:'atque — και' },
          { l:'prostrata', r:'Επιρρ. κατηγορούμενο του τρόπου (επιθετοποιημένη μτχ.)', to:'στο quae (μέσω του iacere)', g:'αιτ. πληθ., ουδ. — μτχ. παρακ. παθ. φωνής', d:'prosterno, prostravi, prostratum, prosternere (< pro + sterno) (3) — ρίχνω κάτω, καταλύω' },
          { l:'impetu', r:'Αφαιρετική του ποιητικού αιτίου', to:'στις μετοχές perculsa, prostrata', g:'αφαιρ. ενικ.', d:'impetus, -us (αρσ. δ΄) — ορμή· εδώ: η λαίλαπα' },
          { l:'belli', r:'Γενική υποκειμενική', to:'στο impetu', g:'γεν. ενικ.', d:'bellum, -i (ουδ. β΄) — ο πόλεμος' },
          { l:'ipsius', r:'Κατηγορηματικός προσδ.', to:'στο belli', g:'γεν. ενικ., ουδ. — δεικτική-οριστική αντων.', d:'ipse, ipsa, ipsum — ο ίδιος, η ίδια, το ίδιο', a:',' }
        ]},
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική πρόταση, προσδιοριστική στον όρο belli· εκφέρεται με οριστική, γιατί εκφράζει το πραγματικό· χρόνου παρακ. (fuit), γιατί δηλώνει το προτερόχρονο στο παρελθόν. Κατ’ άλλη εκδοχή είναι αναφορική προσθετική στο περιεχόμενο της προηγούμενης αναφορικής (quae iacere ... belli ipsius): «πράγμα που ήταν αναπόφευκτο».', kids:[
          { l:'quod', r:'Υποκείμενο', to:'στο fuit', g:'ονομ. ενικ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'necesse', r:'Κατηγορούμενο', to:'στο quod (μέσω του fuit)', g:'άκλιτο επίθ.', d:'necesse — αναγκαίο, αναπόφευκτο' },
          { l:'fuit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. — ανώμαλο (βοηθητικό)', d:'sum, fui, —, esse — είμαι', a:':' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια (α΄ ασύνδετη)', note:'Κύρια πρόταση κρίσης· οι τέσσερις κύριες προτάσεις χωρίζονται με κόμμα (ασύνδετο σχήμα).', kids:[
        { l:'constituenda', r:'Κατηγορούμενο', to:'στο iudicia (μέσω του εννοούμενου sunt)', g:'ονομ. πληθ., ουδ. — γερουνδιακό (constituendus, -a, -um)', d:'constituo, constitui, constitutum, constituere (3) — αναδιοργανώνω', note:'ρήμα: το εννοούμενο constituenda (sunt) — παθ. περιφρ. συζυγία, προσωπική σύνταξη. Εννοείται δοτ. προσωπική tibi.' },
        { l:'iudicia', r:'Υποκείμενο', to:'στο constituenda (sunt)', g:'ονομ. πληθ., ουδ.', d:'iudicium, -ii / -i (ουδ. β΄) — το δικαστήριο, η δικαιοσύνη', note:'Ως υπερδισύλλαβο σε -ium σχηματίζει γεν. ενικ. σε -ii και -i, με συναίρεση.', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (β΄ ασύνδετη)', kids:[
        { l:'revocanda', r:'Κατηγορούμενο', to:'στο fides (μέσω του εννοούμενου est)', g:'ονομ. ενικ., θηλ. — γερουνδιακό (revocandus, -a, -um)', d:'revoco, revocavi, revocatum, revocare (< re + voco) (1) — ανακαλώ, αποκαθιστώ', note:'ρήμα: το εννοούμενο revocanda (est) — παθ. περιφρ. συζυγία, προσωπική σύνταξη. Εννοείται δοτ. προσωπική tibi.' },
        { l:'fides', r:'Υποκείμενο', to:'στο revocanda (est)', g:'ονομ. ενικ.', d:'fides, fidei (θηλ. ε΄) — η (εμπορική) πίστη', note:'Δεν σχηματίζει πληθυντικό αριθμό.', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (γ΄ ασύνδετη)', kids:[
        { l:'comprimendae', r:'Κατηγορούμενο', to:'στο libidines (μέσω του εννοούμενου sunt)', g:'ονομ. πληθ., θηλ. — γερουνδιακό (comprimendus, -a, -um)', d:'comprimo, compressi, compressum, comprimere (< cum + premo) (3) — περιορίζω, χαλιναγωγώ', note:'ρήμα: το εννοούμενο comprimendae (sunt) — παθ. περιφρ. συζυγία, προσωπική σύνταξη. Εννοείται δοτ. προσωπική tibi.' },
        { l:'libidines', r:'Υποκείμενο', to:'στο comprimendae (sunt)', g:'ονομ. πληθ.', d:'libido, libidinis (θηλ. γ΄) — το πάθος', a:',' }
      ]},
      { type:'main', key:'kyria', label:'Κύρια (δ΄ ασύνδετη)', kids:[
        { l:'propaganda', r:'Κατηγορούμενο', to:'στο suboles (μέσω του εννοούμενου est)', g:'ονομ. ενικ., θηλ. — γερουνδιακό (propagandus, -a, -um)', d:'propago, propagavi, propagatum, propagare (1) — αφήνω απογόνους, διαιωνίζω το είδος', note:'ρήμα: το εννοούμενο propaganda (est) — παθ. περιφρ. συζυγία, προσωπική σύνταξη. Εννοείται δοτ. προσωπική tibi. propaganda suboles = πρέπει να επιδιωχθεί η αύξηση του πληθυσμού.' },
        { l:'suboles', r:'Υποκείμενο', to:'στο propaganda (est)', g:'ονομ. ενικ.', d:'suboles, subolis (θηλ. γ΄) — οι απόγονοι', note:'Ετερόσημο: στον ενικό (suboles, subolis) = οι απόγονοι, στον πληθ. (suboles, subolum) = παραφυάδες.', a:';' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'omnia', r:'Υποκείμενο', to:'στο vincienda sunt', g:'ονομ. πληθ., ουδ. — δικατάληκτο επίθ. γ΄ κλ.', d:'omnis, -is, -e — όλος, -η, -ο' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση στον όρο omnia της κύριας. Εισάγεται με την αναφορική αντων. quae και εκφέρεται με οριστική, γιατί εκφράζει το πραγματικό· χρόνου παρακ. (diffluxerunt), γιατί δηλώνει το προτερόχρονο στο παρελθόν.', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο diffluxerunt', g:'ονομ. πληθ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'dilapsa', r:'Επιρρ. χρονική μετοχή (συνημμένη στο quae)', to:'στο diffluxerunt', g:'ονομ. πληθ., ουδ. — μτχ. παρακ. (αποθετικού)', d:'dilabor, dilapsus sum, dilabi (< dis + labor) (αποθετικό 3) — καταρρέω', note:'Δηλώνει το προτερόχρονο σε σχέση με το ρήμα diffluxerunt. Ως αποθετικό κλίνεται μόνο στη μέση (παθ.) φωνή, αλλά έχει 6 τύπους ενεργ. φωνής (μτχ. ενεστ. & μέλλ., υποτ. μέλλ., γερούνδιο, απαρ. μέλλ., σουπίνο).' },
          { l:'iam', r:'Επιρρ. προσδ. του χρόνου', to:'στο diffluxerunt', g:'χρονικό επίρρημα', d:'iam — πια, ήδη' },
          { l:'diffluxerunt', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρακ. ενεργ. φωνής', d:'diffluo, diffluxi, diffluctum, diffluere (< dis + fluo) (3) — διαλύομαι, διαρρέω', a:',' }
        ]},
        { l:'severis', r:'Επιθετικός προσδ.', to:'στο legibus', g:'αφαιρ. πληθ., θηλ. — επίθ. β΄ κλ.', d:'severus, -a, -um — αυστηρός, -ή, -ό' },
        { l:'legibus', r:'Αφαιρετική (οργανική) του μέσου', to:'στο vincienda sunt', g:'αφαιρ. πληθ.', d:'lex, legis (θηλ. γ΄) — ο νόμος' },
        { l:'vincienda', r:'Κατηγορούμενο', to:'στο omnia (μέσω του sunt)', g:'ονομ. πληθ., ουδ. — γερουνδιακό (vinciendus, -a, -um)', d:'vincio, vinxi, vinctum, vincire (4) — δένω, στερεώνω', note:'Τα vinco (νικώ), vivo (ζω), vincio (δένω, στερεώνω) είναι τρία διαφορετικά ρήματα.' },
        { l:'sunt', r:'Ρήμα', to:'(παθητική περιφραστική συζυγία, προσωπική σύνταξη)', g:'γ΄ πληθ. οριστ. ενεστ. — μαζί με το γερουνδιακό vincienda', d:'sum, fui, —, esse — είμαι', note:'Εννοείται δοτ. προσωπική tibi.', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'In tanto', k:'tantus', r:'(εμπρόθετος: πρόθεση + δεικτ. αντων.)', to:'', g:'in (πρόθ. + αφαιρ.) + tanto (αφαιρ. ενικ., ουδ. — δεικτ. αντων.)', d:'in — σε· tantus, tanta, tantum — τόσος, -η, -ο', note:'tanto: επιθετικός προσδ. στο (civili) bello.' },
        { l:'civili', r:'Επιθετικός προσδ.', to:'στο bello', g:'αφαιρ. ενικ., ουδ. — δικατάληκτο επίθ. γ΄ κλ.', d:'civilis, -is, -e — εμφύλιος, -α, -ο', note:'Δεν σχηματίζει παραθετικά, γιατί δηλώνει κάτι απόλυτο.' },
        { l:'bello', r:'Εμπρόθετος επιρρ. προσδ. του χρόνου', to:'στο perdidit', g:'αφαιρ. ενικ.', d:'bellum, -i (ουδ. β΄) — ο πόλεμος' },
        { l:'in tanto', k:'tantus', r:'(εμπρόθετος: πρόθεση + δεικτ. αντων.)', to:'', g:'in (πρόθ. + αφαιρ.) + tanto (αφαιρ. ενικ., αρσ. — δεικτ. αντων.)', d:'in — σε· tantus, tanta, tantum — τόσος, -η, -ο', note:'tanto: επιθετικός προσδ. στο ardore.' },
        { l:'ardore', r:'Εμπρόθετος επιρρ. προσδ. της κατάστασης', to:'στο perdidit', g:'αφαιρ. ενικ.', d:'ardor, ardoris (αρσ. γ΄) — το πάθος' },
        { l:'animorum', r:'Γενική υποκειμενική', to:'στο ardore', g:'γεν. πληθ.', d:'animus, -i (αρσ. β΄) — η ψυχή' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (καταφατικός, παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'armorum', r:'Γενική υποκειμενική', to:'στο ardore', g:'γεν. πληθ.', d:'arma, -orum (ουδ. β΄, μόνο πληθ.) — τα όπλα', a:',' },
        { l:'quassata', r:'Επιθετική μετοχή (επιθετικός προσδ.)', to:'στο res publica', g:'ονομ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής', d:'quasso, quassavi, quassatum, quassare (1) — συντρίβω' },
        { l:'res publica', k:'res', r:'Υποκείμενο', to:'στο perdidit', g:'ονομ. ενικ. — σύνθετο ουσιαστικό (res + publica)', d:'res publica, rei publicae (θηλ.) — η πολιτεία, η δημοκρατία', note:'res: res, rei (θηλ. ε΄) = το πράγμα· publica: επίθ. publicus, -a, -um (β΄) = δημόσιος, -α, -ο. Ο πληθ. της συνεκφοράς δεν είναι σε χρήση.' },
        { l:'multa', r:'Αντικείμενο', to:'στο perdidit', g:'αιτ. πληθ., ουδ. — επίθ. β΄ κλ.', d:'multi, -ae, -a — πολλοί, -ές, -ά', note:'Κατ’ άλλη εκδοχή επιθετικός προσδ. στα ornamenta, praesidia. Το επίθετο έχει μόνο πληθ. αριθμό σε χρήση.' },
        { l:'perdidit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής', d:'perdo, perdidi, perditum, perdere (3) — χάνω' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (καταφατικός, παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'ornamenta', r:'Αντικείμενο', to:'στο perdidit', g:'αιτ. πληθ., ουδ.', d:'ornamentum, -i (ουδ. β΄) — το στολίδι, το διακριτικό' },
        { l:'dignitatis', r:'Γενική (αντικειμενική)', to:'στο ornamenta', g:'γεν. ενικ.', d:'dignitas, dignitatis (θηλ. γ΄) — το κύρος', note:'Σχηματίζει γεν. πληθ. σε -um και -ium· πρβ. aetas, civitas, utilitas, aequitas, mensis.' },
        { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (καταφατικός, παρατακτικός) σύνδεσμος', d:'et — και' },
        { l:'praesidia', r:'Αντικείμενο', to:'στο perdidit', g:'αιτ. πληθ., ουδ.', d:'praesidium, -ii / -i (ουδ. β΄) — το στήριγμα', note:'Ως υπερδισύλλαβο σε -ium σχηματίζει γεν. ενικ. σε -ii και -i, με συναίρεση.' },
        { l:'stabilitatis', r:'Γενική (αντικειμενική)', to:'στο praesidia', g:'γεν. ενικ.', d:'stabilitas, stabilitatis (θηλ. γ΄) — η σταθερότητα' },
        { l:'suae', r:'Επιθετικός προσδ.', to:'στο stabilitatis', g:'γεν. ενικ., θηλ. — κτητ. αντων. γ΄ προσ. (ένας κτήτορας)', d:'suus, sua, suum — δικός, -ή, -ό του', note:'Άμεση (ευθεία) αυτοπάθεια· το suae αναφέρεται στο υποκείμενο res publica της πρότασης στην οποία βρίσκεται.', a:';' }
      ]}
    ]},

    { n: 5, kids: [
      { l:'-que', r:'Σύνδεσμος', g:'συμπλεκτικός (καταφατικός, παρατακτικός) εγκλιτικός σύνδεσμος', d:'-que — και', note:'Συνδέει την κύρια πρόταση με την προηγούμενη.', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'multa', r:'Αντικείμενο', to:'στο fecit', g:'αιτ. πληθ., ουδ. — επίθ. β΄ κλ.', d:'multi, -ae, -a — πολλοί, -ές, -ά' },
        { l:'uterque', r:'Επιθετικός προσδ.', to:'στο dux', g:'ονομ. ενικ., αρσ. — αντωνυμικό επίθ.', d:'uterque, utraque, utrumque — και ο ένας και ο άλλος' },
        { l:'dux', r:'Υποκείμενο', to:'στο fecit', g:'ονομ. ενικ.', d:'dux, ducis (αρσ. γ΄) — ο αρχηγός' },
        { l:'fecit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής', d:'facio, feci, factum, facere (3, σε -io) — κάνω' },
        { l:'armatus', r:'Επιρρ. κατηγορούμενο της κατάστασης (επιθετοποιημένη μτχ.)', to:'στο uterque dux', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ. (επιθετοπ. μτχ. παρακ. παθ.)', d:'armo, armavi, armatum, armare (1) — οπλίζω· armatus = οπλισμένος, στον πόλεμο', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση στον όρο multa της κύριας· εκφέρεται με υποτακτική υπερσυντ. (prohibuisset), γιατί δηλώνει το μη πραγματικό στο παρελθόν.', kids:[
          { l:'quae', r:'Υποκείμενο', to:'στο απαρέμφατο fieri', g:'αιτ. πληθ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'idem', r:'Υποκείμενο', to:'στο prohibuisset', g:'ονομ. ενικ., αρσ. — δεικτική (επαναληπτική) αντων.', d:'idem, eadem, idem — ο ίδιος, η ίδια, το ίδιο' },
          { l:'togatus', r:'Επιρρ. κατηγορούμενο της κατάστασης', to:'στο idem (μέσω prohibuisset)', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'togatus, -a, -um — τηβεννοφόρος· εδώ: στην ειρήνη' },
          { l:'fieri', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο prohibuisset', g:'απαρέμφατο ενεστ. — ανώμαλο ρήμα', d:'fio, factus sum, fieri — γίνομαι' },
          { l:'prohibuisset', r:'Ρήμα', g:'γ΄ ενικ. υποτ. υπερσυντ. ενεργ. φωνής', d:'prohibeo, prohibui, prohibitum, prohibere (2) — εμποδίζω', a:'.' }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:'main', key:'symperasmatiki', label:'Κύρια (συμπερασματική)', note:'Κύρια πρόταση κρίσης· εισάγεται με τον συμπερασματικό σύνδεσμο Quare.', kids:[
        { l:'Quare', r:'Σύνδεσμος', g:'συμπερασματικός (παρατακτικός) σύνδεσμος', d:'quare — επομένως', conn:true },
        { l:'subveniendum', r:'Κατηγορούμενο', to:'(μέσω του est)', g:'ονομ. ενικ., ουδ. — γερουνδιακό (subveniendus, -a, -um)', d:'subvenio, subveni, subventum, subvenire (< sub + venio, + δοτική) (4) — βοηθώ', note:'ρήμα: subveniendum est — παθ. περιφρ. συζυγία, απρόσωπη σύνταξη (γιατί το subvenio συντάσσεται με δοτική). Εννοείται δοτ. προσωπική tibi.' },
        { l:'reipublicae', k:'respublica', r:'Αντικείμενο (σε δοτική, συμπλήρωμα)', to:'στο subveniendum est', g:'δοτ. ενικ. — σύνθετο ουσιαστικό (rei + publicae)', d:'respublica, reipublicae (θηλ.) — η πολιτεία', note:'rei: δοτ. res, rei (θηλ. ε΄) = πράγμα· publicae: δοτ. θηλ. επίθ. publicus, -a, -um (β΄) = δημόσιος. Ο πληθ. της συνεκφοράς δεν είναι σε χρήση.' },
        { l:'est', r:'Ρήμα', to:'(μαζί με το γερουνδιακό subveniendum)', g:'γ΄ ενικ. οριστ. ενεστ.', d:'sum, fui, —, esse — είμαι' }
      ]},
      { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (καταφατικός, παρατακτικός) σύνδεσμος', d:'et — και', note:'Συνδέει τις δύο κύριες προτάσεις.', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'omnia', r:'Κατηγορηματικός προσδ.', to:'στο vulnera', g:'ονομ. πληθ., ουδ. — δικατάληκτο επίθ. γ΄ κλ.', d:'omnis, -is, -e — όλος, -η, -ο' },
        { l:'nunc', r:'Επιρρ. προσδ. του χρόνου', to:'στο sananda sunt', g:'χρονικό επίρρημα', d:'nunc — τώρα' },
        { l:'belli', r:'Γενική του δημιουργού (ή κατ’ άλλους υποκειμενική)', to:'στο vulnera', g:'γεν. ενικ.', d:'bellum, -i (ουδ. β΄) — ο πόλεμος' },
        { l:'vulnera', r:'Υποκείμενο', to:'στο sananda sunt', g:'ονομ. πληθ., ουδ.', d:'vulnus, vulneris (ουδ. γ΄) — η πληγή, το τραύμα' },
        { l:'tibi', r:'Δοτική προσωπική του ενεργούντος προσώπου (ή του ποιητικού αιτίου)', to:'στο sananda sunt', g:'δοτ. ενικ., αρσ. — προσωπική αντων. β΄ προσ.', d:'tu — εσύ' },
        { l:'sananda', r:'Κατηγορούμενο', to:'στο vulnera (μέσω του sunt)', g:'ονομ. πληθ., ουδ. — γερουνδιακό (sanandus, -a, -um)', d:'sano, sanavi, sanatum, sanare (1) — θεραπεύω' },
        { l:'sunt', r:'Ρήμα', to:'(παθητική περιφραστική συζυγία, προσωπική σύνταξη)', g:'γ΄ πληθ. οριστ. ενεστ. — μαζί με το γερουνδιακό sananda', d:'sum, fui, —, esse — είμαι', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. αναφορική προσδιοριστική πρόταση στον όρο vulnera της κύριας. Εισάγεται με την αναφορική αντων. quibus και εκφέρεται με οριστική, γιατί εκφράζει το πραγματικό· χρόνου ενεστ. (potest), γιατί δηλώνει το σύγχρονο στο παρόν.', kids:[
          { l:'quibus', r:'Αντικείμενο', to:'στο απαρέμφατο mederi (mederi + δοτική)', g:'δοτ. πληθ., ουδ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'praeter te', k:'tu', r:'Εμπρόθετος προσδ. της εξαίρεσης', to:'στο potest', g:'praeter (πρόθ. + αιτ.) + te (αιτ. ενικ., αρσ. — προσωπική αντων. β΄ προσ.)', d:'praeter — εκτός από· tu — εσύ' },
          { l:'mederi', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο potest (ταυτοπροσωπία)', g:'απαρέμφατο ενεστ. — αποθετικό', d:'medeor, —, —, mederi (+ δοτική) (αποθετικό 2) — γιατρεύω' },
          { l:'nemo', r:'Υποκείμενο', to:'στο potest και στο απαρέμφατο mederi', g:'ονομ. ενικ., αρσ. — αόριστη ουσιαστική αντων.', d:'nemo — κανένας', note:'Η αφαιρ. ενικ. και ο πληθ. αναπληρώνονται από την αντων. (αόριστη επιθετική) nullus, -a, -um.' },
          { l:'potest', r:'Ρήμα', g:'γ΄ ενικ. οριστ. ενεστ. — ανώμαλο (σύνθετο του sum)', d:'possum, potui, —, posse (< pot + sum) — μπορώ', a:'.' }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Omnia sunt excitanda tibi uni, C. Caesar, quae iacere sentis perculsa atque prostrata impetu belli ipsius, quod necesse fuit:", el:"Όλα πρέπει να ανασυγκροτηθούν από σένα μόνο, Γάιε Καίσαρα, όσα ξέρεις ότι κείτονται καταλυμένα και ριγμένα κάτω από τη λαίλαπα του ίδιου του πολέμου, πράγμα που ήταν αναπόφευκτο:" },
    { n:2, la:"constituenda iudicia, revocanda fides, comprimendae libidines, propaganda suboles;", el:"πρέπει να αναδιοργανωθεί η δικαιοσύνη, πρέπει να αποκατασταθεί η εμπορική πίστη, πρέπει να χαλιναγωγηθούν τα πάθη, πρέπει να επιδιωχθεί η αύξηση του πληθυσμού·" },
    { n:3, la:"omnia quae dilapsa iam diffluxerunt, severis legibus vincienda sunt.", el:"όλα όσα, αφού κατέρρευσαν, έχουν πια καταλυθεί, πρέπει να στερεωθούν με αυστηρούς νόμους." },
    { n:4, la:"In tanto civili bello, in tanto ardore animorum et armorum, quassata res publica multa perdidit et ornamenta dignitatis et praesidia stabilitatis suae;", el:"Σε έναν τόσο μεγάλο εμφύλιο πόλεμο, σε ένα τόσο μεγάλο πάθος των ψυχών και των όπλων, η ρημαγμένη πολιτεία έχασε πολλά και διακριτικά του κύρους της και στηρίγματα της σταθερότητάς της·" },
    { n:5, la:"multaque uterque dux fecit armatus, quae idem togatus fieri prohibuisset.", el:"και πολλά έκανε στον πόλεμο και ο ένας και ο άλλος αρχηγός, τα οποία ο ίδιος στην ειρήνη θα είχε εμποδίσει να γίνουν." },
    { n:6, la:"Quare subveniendum reipublicae est et omnia nunc belli vulnera tibi sananda sunt, quibus praeter te mederi nemo potest.", el:"Επομένως πρέπει να βοηθήσεις την πολιτεία και πρέπει να θεραπευτούν από σένα τώρα όλες οι πληγές του πολέμου, τις οποίες εκτός από σένα κανένας δεν μπορεί να γιατρέψει." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"animus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"arma, -orum", note:"μόνο πληθ." },
        { form:"bellum, -i" },
        { form:"iudicium, -ii / -i" },
        { form:"ornamentum, -i" },
        { form:"praesidium, -ii / -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"ardor, ardoris" },
        { form:"Caesar, Caesaris", note:"κύριο όνομα· δεν σχηματίζει πληθ." },
        { form:"dux, ducis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"dignitas, dignitatis" },
        { form:"lex, legis" },
        { form:"libido, libidinis" },
        { form:"stabilitas, stabilitatis" },
        { form:"suboles, subolis", note:"ετερόσημο" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"vulnus, vulneris" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"impetus, -us" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"fides, fidei", note:"δεν έχει πληθ." },
        { form:"res, rei" },
        { form:"respublica, reipublicae", note:"σύνθετο (res + publica)· ο πληθ. δεν είναι σε χρήση" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"armatus, -a, -um" },
      { form:"multi, -ae, -a", note:"μόνο πληθ. σε χρήση" },
      { form:"publicus, -a, -um" },
      { form:"severus, -a, -um" },
      { form:"togatus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"civilis, -is, -e" },
      { form:"omnis, -is, -e" }
    ]},
    { kl:"Άκλιτο", items:[
      { form:"necesse" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ & ΕΠΙΡΡΗΜΑΤΩΝ ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"severus, -a, -um", comp:"severior, -ior, -ius", sup:"severissimus, -a, -um" },
      { pos:"severe (επίρρημα)", comp:"severius", sup:"severissime" },
      { pos:"multi, -ae, -a", comp:"plures, -es, -a (γεν. πληθ. plurium)", sup:"plurimi, -ae, -a" },
      { pos:"multum (επίρρημα)", comp:"plus", sup:"plurimum" },
      { pos:"publicus, -a, -um", comp:"—", sup:"—" },
      { pos:"armatus, -a, -um", comp:"—", sup:"—" },
      { pos:"togatus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"omnis, -is, -e", comp:"—", sup:"—" },
      { pos:"civilis, -is, -e", comp:"—", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσώπου" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"ipse, ipsa, ipsum", kind:"Δεικτική-οριστική", extra:"" },
    { form:"tantus, tanta, tantum", kind:"Δεικτική", extra:"" },
    { form:"idem, eadem, idem", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., ένας κτήτορας" },
    { form:"nemo", kind:"Αόριστη", extra:"ουσιαστική· η αφαιρ. ενικ. & ο πληθ. από το nullus, -a, -um" },
    { form:"unus, una, unum", kind:"Αντωνυμικό επίθ.", extra:"γεν. unius, δοτ. uni" },
    { form:"uterque, utraque, utrumque", kind:"Αντωνυμικό επίθ.", extra:"" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"armo", perf:"armavi", sup:"armatum", inf:"armare", note:"" },
      { pres:"excito", perf:"excitavi", sup:"excitatum", inf:"excitare", note:"" },
      { pres:"propago", perf:"propagavi", sup:"propagatum", inf:"propagare", note:"" },
      { pres:"quasso", perf:"quassavi", sup:"quassatum", inf:"quassare", note:"" },
      { pres:"revoco", perf:"revocavi", sup:"revocatum", inf:"revocare", note:"" },
      { pres:"sano", perf:"sanavi", sup:"sanatum", inf:"sanare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"iaceo", perf:"iacui", sup:"iacitum", inf:"iacere", note:"" },
      { pres:"medeor", perf:"—", sup:"—", inf:"mederi", note:"αποθετικό· + δοτική" },
      { pres:"prohibeo", perf:"prohibui", sup:"prohibitum", inf:"prohibere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"comprimo", perf:"compressi", sup:"compressum", inf:"comprimere", note:"< cum + premo" },
      { pres:"constituo", perf:"constitui", sup:"constitutum", inf:"constituere", note:"" },
      { pres:"diffluo", perf:"diffluxi", sup:"diffluctum", inf:"diffluere", note:"< dis + fluo" },
      { pres:"dilabor", perf:"dilapsus sum", sup:"(dilapsum)", inf:"dilabi", note:"αποθετικό· < dis + labor" },
      { pres:"facio", perf:"feci", sup:"factum", inf:"facere", note:"σε -io" },
      { pres:"percello", perf:"perculi", sup:"perculsum", inf:"percellere", note:"< per + cello" },
      { pres:"perdo", perf:"perdidi", sup:"perditum", inf:"perdere", note:"" },
      { pres:"prosterno", perf:"prostravi", sup:"prostratum", inf:"prosternere", note:"< pro + sterno" },
      { pres:"sentio", perf:"sensi", sup:"sensum", inf:"sentire", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"subvenio", perf:"subveni", sup:"subventum", inf:"subvenire", note:"< sub + venio· + δοτική" },
      { pres:"vincio", perf:"vinxi", sup:"vinctum", inf:"vincire", note:"δένω, στερεώνω" }
    ]},
    { syz:"Ανώμαλα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"ανώμαλο· = γίνομαι" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"σύνθετο του sum (< pot + sum)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"Παθητική περιφραστική συζυγία", body:"Γερουνδιακό + sum. Δηλώνει το δέον/αναγκαίο. Το ποιητικό αίτιο μπαίνει σε δοτική προσωπική του ποιητικού αιτίου (tibi). Προσωπική σύνταξη με μεταβατικά ρήματα (Omnia sunt excitanda), απρόσωπη με ρήματα που συντάσσονται με άλλη πτώση εκτός αιτιατικής (subveniendum reipublicae est, γιατί το subvenio θέλει δοτική)." },
    { tag:"Ουσιαστικό", title:"res publica / respublica", body:"Όταν γράφεται χωριστά (res publica), κλίνονται και τα δύο μέρη (res, rei + publicus, -a, -um)· όταν γράφεται ως μία λέξη (respublica, reipublicae) είναι σύνθετο θηλυκό ουσιαστικό. Ο πληθυντικός της συνεκφοράς δεν είναι σε χρήση." },
    { tag:"Ρήμα", title:"vincio ≠ vinco ≠ vivo", body:"Το vincienda sunt προέρχεται από το vincio, vinxi, vinctum, vincire (4) = δένω, στερεώνω — όχι από το vinco (νικώ) ούτε από το vivo (ζω), τρία εντελώς διαφορετικά ρήματα." },
    { tag:"Ρήμα", title:"dilabor, medeor: αποθετικά", body:"Τα dilabor (dilapsus sum, dilabi) και medeor (—, mederi) είναι αποθετικά: παθητικοί τύποι με ενεργητική σημασία. Η μετοχή dilapsa είναι χρονική (παρακειμένου) με ενεργητική σημασία «αφού κατέρρευσαν»." },
    { tag:"Αντωνυμία", title:"suae: ευθεία αυτοπάθεια", body:"Το suae (praesidia stabilitatis suae) είναι κτητική αντων. γ΄ προσ. και αναφέρεται στο υποκείμενο res publica της ίδιας πρότασης (άμεση/ευθεία αυτοπάθεια)." },
    { tag:"Αντίθεση", title:"armatus – togatus", body:"Επιρρηματικά κατηγορούμενα της κατάστασης σε αντίθεση: armatus = «οπλισμένος», δηλ. στον πόλεμο· togatus = «τηβεννοφόρος», δηλ. στην ειρήνη." }
  ],

  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"omnia quae dilapsa iam diffluxerunt (dilapsa: επιρρ. χρονική μτχ. παρακ., προτερόχρονο· εξάρτηση από ιστορικό χρόνο diffluxerunt)", to:"postquam (omnia) dilapsa sunt (postquam + οριστ. παρακ.) ή cum (omnia) dilapsa essent (cum + υποτ. υπερσυντ.)" },
      { from:"quassata res publica multa perdidit (quassata: επιθετική μτχ. παρακ., προτερόχρονο· εξάρτηση από ιστορικό χρόνο perdidit)", to:"res publica quae quassata erat multa perdidit (quae + οριστ. υπερσυντ.)" }
    ]},
    { id:"Β", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"... quassata res publica multa perdidit ...", to:"... a quassata re publica multa (ονομ.) perdita sunt ...", note:"εμπρόθετο ποιητικό αίτιο, ως έμψυχο" },
      { from:"multaque uterque dux fecit armatus, quae idem togatus fieri prohibuisset", to:"multaque ab utroque duce facta sunt armato, quae ab eodem togato fieri prohibita essent", note:"εμπρόθετο ποιητικό αίτιο, ως έμψυχο" }
    ]},
    { id:"Γ", label:"Μετατροπή της παθητικής περιφραστικής συζυγίας σε σύνταξη του debeo + απαρέμφατο (προσωπική σύνταξη)", items:[
      { from:"Omnia sunt excitanda tibi uni", to:"Tu unus omnia excitare debes" },
      { from:"constituenda (sunt) iudicia, revocanda (est) fides, comprimendae (sunt) libidines, propaganda (est) suboles (tibi)", to:"Tu iudicia constituere debes, fidem revocare debes, libidines comprimere debes, subolem propagare debes" },
      { from:"Quare subveniendum reipublicae est et omnia nunc belli vulnera tibi sananda sunt", to:"Quare reipublicae subvenire debes et omnia nunc belli vulnera tu sanare debes" }
    ]},
    { id:"Δ", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"Omnia sunt excitanda tibi uni, ... quae iacere sentis perculsa atque prostrata ..., quod necesse fuit: constituenda iudicia, revocanda fides, comprimendae libidines, propaganda suboles; omnia quae dilapsa iam diffluxerunt, ... vincienda sunt (εξάρτηση: Cicero dicit / dixit)", to:"Cicero dicit / dixit omnia (αιτ.) esse excitanda illi uni, quae iacere sentiat / sentiret perculsa atque prostrata ..., quod necesse fuerit / fuisset: constituenda esse iudicia, revocandam esse fidem, comprimendas esse libidines (αιτ.), propagandam esse subolem; omnia (αιτ.) quae dilapsa iam diffluxerint / diffluxissent, ... vincienda esse" },
      { from:"... quassata res publica multa perdidit ...; multaque uterque dux fecit armatus, quae idem togatus fieri prohibuisset (εξάρτηση: Cicero putat / putabat)", to:"Cicero putat / putabat ... quassatam rem publicam multa perdidisse ...; multaque utrumque ducem fecisse armatum, quae idem togatus fieri prohibuisset" },
      { from:"Quare subveniendum reipublicae est et omnia nunc belli vulnera tibi sananda sunt, quibus praeter te mederi nemo potest (εξάρτηση: Cicero dicit / dixit)", to:"Cicero dicit / dixit C. Caesari subveniendum reipublicae esse et omnia (αιτ.) tunc belli vulnera (αιτ.) illi sananda esse, quibus praeter illum mederi nemo possit / posset" }
    ]},
    { id:"Ε", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"... quae iacere sentis perculsa atque prostrata ...", to:"... quae (ονομ.) iacent perculsa (ονομ.) atque prostrata (ονομ.) ..." }
    ]}
  ],

  etymology: [
    { la:"excitanda", el:"(γαλλ.) inciter (= υποκινώ) // (αγγλ.) excite (= διεγείρω), incite (= υποκινώ), recite (= απαγγέλλω)." },
    { la:"sentis", el:"(γαλλ.) sentir (= αισθάνομαι) // (αγγλ.) sense (= αίσθηση), sensible (= ευαίσθητος), sentiment (= συναίσθημα), consent (= συναινώ), sentence (= πρόταση, ποινή)." },
    { la:"perculsa (per + cello)", el:"κέλομαι (= παρακινώ) // (αγγλ.) excellent (= εξαίρετος), excel (= υπερέχω)." },
    { la:"prostrata", el:"στρώννυμι (= στρώνω) // (γαλλ.) prosterner (= υποκλίνω) // (αγγλ.) prostration (= κατάπτωση), prostrate (= πρηνής), street (= δρόμος), stratum (= στρώμα)." },
    { la:"impetu", el:"πίπτω, πέτομαι (= πετώ) // (αγγλ.) impetus (= ώθηση), impetuous (= ορμητικός), petition (= αίτηση), compete (= ανταγωνίζομαι), appetite (= όρεξη) // (γαλλ.) répéter (= επαναλαμβάνω)." },
    { la:"necesse", el:"νεσεσέρ (< γαλλ. nécessaire) // (αγγλ.) necessity (= αναγκαιότητα), necessary (= αναγκαίος) // (γαλλ.) nécessité (= αναγκαιότητα) // (ιταλ.) necessario (= αναγκαίος)." },
    { la:"constituenda", el:"συν-ίστημι // (γαλλ.) constituer (= συγκροτώ), statut (= καθεστώς) // (αγγλ.) constitute (= συγκροτώ), constitution (= σύνταγμα), statute (= νόμος, καταστατικό), institute (= ιδρύω, ίδρυμα)." },
    { la:"iudicia (iudex)", el:"(γαλλ.) justice (= δικαιοσύνη), juste (= δίκαιος) // (αγγλ.) justice, judge (= κριτής), judicial (= δικαστικός), jury (= ένορκοι), injury (= βλάβη, αδικία), jurisdiction (= δικαιοδοσία)." },
    { la:"revocanda", el:"(αγγλ.) vocal (= φωνητικός), voice (= φωνή), revocation (= ανάκληση), advocate (= συνήγορος), provoke (= προκαλώ) // (γαλλ.) vocabulaire (= λεξιλόγιο), voix (= φωνή)." },
    { la:"fides", el:"πείθω // (αγγλ.) confidence (= αυτοπεποίθηση), fidelity (= πίστη), faith (= πίστη), perfidy (= απιστία, προδοσία) // (γαλλ.) fidèle (= πιστός), foi (= πίστη)." },
    { la:"comprimendae", el:"(γαλλ.) comprimer (= συμπιέζω), imprimer (= εκτυπώνω) // κομπρεσέρ (< γαλλ. compresseur), κομπρέσα (< ιταλ.) // (αγγλ.) compress (= συμπιέζω), print (= εκτυπώνω, αποτύπωμα), express (= εκφράζω)." },
    { la:"libidines", el:"λίμπιντο // (γερμ.) Liebe (= αγάπη) // (αγγλ.) libido (= γενετήσια ορμή), libidinous (= λάγνος, ακόλαστος) // (γαλλ.) libidineux (= λάγνος)." },
    { la:"propaganda", el:"προπαγάνδα (< γαλλ.) // (αγγλ.) propagate (= διαδίδω), propagation (= εξάπλωση, διάδοση) // (γαλλ.) propager (= διαδίδω)." },
    { la:"dilapsa (dis + labor)", el:"(αγγλ.) labor (= εργασία), lapse (= παρέλευση), collapse (= κατάρρευση), relapse (= υποτροπή), elapse (= παρέρχομαι (για χρόνο)), labile (= ασταθής) // (γαλλ.) laborieux (= κοπιαστικός)." },
    { la:"diffluxerunt (dis + fluo)", el:"φλύω (= αναβλύζω) // (αγγλ.) fluent (= ρέων), fluid (= ρευστό), flux (= ροή), influence (= επιρροή), affluent (= εύπορος), superfluous (= περιττός), fluctuate (= διακυμαίνομαι) // (γαλλ.) fluide (= ρευστό)." },
    { la:"severis", el:"(γαλλ.) sévère (= αυστηρός), sévérité (= αυστηρότητα), persévérance (= επιμονή) // (αγγλ.) severe (= αυστηρός), severity (= αυστηρότητα), persevere (= επιμένω), perseverance (= επιμονή)." },
    { la:"legibus", el:"λέγω // (αγγλ.) legal (= νόμιμος), legislation (= νομοθεσία), legitimate (= νόμιμος), loyal (= πιστός, νομοταγής), privilege (= προνόμιο) // (γαλλ.) loi (= νόμος) // (ιταλ.) legge (= νόμος)." },
    { la:"civili", el:"(αγγλ.) city (= πόλη), civil (= πολιτικός), civilisation (= πολιτισμός), civic (= δημοτικός, πολιτειακός), citizen (= πολίτης) // (γαλλ.) cité (= πόλη), civilisation (= πολιτισμός) // (ιταλ.) città (= πόλη) // (ισπαν.) ciudad (= πόλη)." },
    { la:"ardore", el:"(γαλλ.) ardeur (= πάθος) // (αγγλ.) ardor (= πάθος), ardent (= φλογερός), arson (= εμπρησμός)." },
    { la:"animorum", el:"άνεμος // ανιμισμός (< γαλλ.) // (αγγλ.) animal (= ζώο), animate (= εμψυχώνω), unanimous (= ομόφωνος), magnanimous (= μεγαλόψυχος), animosity (= εχθρότητα) // (γαλλ.) âme (= ψυχή) // (ισπαν.) alma (= ψυχή)." },
    { la:"armorum, armatus", el:"άρμα, αρματολός // (γαλλ.) armée (= στρατός), armer (= οπλίζω) // (αγγλ.) army (= στρατός), arms (= όπλα), armature, alarm (= συναγερμός), armament (= εξοπλισμός) // (ισπαν.) armada (= στόλος)." },
    { la:"quassata", el:"(αγγλ.) quash (= συντρίβω, ακυρώνω), squash (= συνθλίβω), concussion (= διάσειση), percussion (= κρούση), discuss (= συζητώ) // (γαλλ.) casser (= σπάζω)." },
    { la:"res, rem", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός), reality (= πραγματικότητα), rebus (= εικονογρίφος) // (γαλλ.) rien (= τίποτα)." },
    { la:"publica, publicam", el:"(γαλλ.) publique (= δημόσιος), publier (= δημοσιεύω) // (αγγλ.) public (= δημόσιος), publication (= δημοσίευση), republic (= δημοκρατία), publish (= δημοσιεύω), publicity (= δημοσιότητα) // (ιταλ.) pubblico (= δημόσιος)." },
    { la:"res publica, reipublicae", el:"ρεπουμπλικάνος, ρεπουμπλικανισμός // ρεπούμπλικα (= είδος ανδρικού καπέλου) (< ιταλ.) // (αγγλ.) republic, republican // (γαλλ.) république (= δημοκρατία) // (ιταλ.) repubblica (= δημοκρατία)." },
    { la:"multa", el:"μάλα (= πολύ) // (αγγλ.) multiple (= πολλαπλός), multitude (= πλήθος), multiply (= πολλαπλασιάζω) // (γαλλ.) multitude (= πλήθος) // (ιταλ.) molto (= πολύ) // (ισπαν.) mucho (= πολύ)." },
    { la:"perdidit (per + do)", el:"δίδωμι // (γαλλ.) perdre (= χάνω), perdition (= απώλεια) // (αγγλ.) perdition (= απώλεια)." },
    { la:"ornamenta", el:"(αγγλ.) ornament (= στολίδι), ornate (= διακοσμημένος), adorn (= στολίζω), suborn (= δωροδοκώ, υποθάλπω) // (γαλλ.) orner (= στολίζω)." },
    { la:"dignitatis", el:"(γαλλ.) dignité (= αξιοπρέπεια), αντίθ. indignité // (αγγλ.) dignity (= αξιοπρέπεια), dignitary (= αξιωματούχος), deign (= καταδέχομαι), disdain (= περιφρονώ), dainty (= λεπτός, εκλεκτός)." },
    { la:"praesidia (prae + sedeo)", el:"έζομαι, έδρα // (αγγλ.) preside (= προεδρεύω), president (= πρόεδρος), possession (= κατοχή), presidio (= οχυρό, φρούριο), presidium (= προεδρείο)." },
    { la:"stabilitatis", el:"ίστημι, στάση // (γαλλ.) stabilité (= σταθερότητα), etablir (= εγκαθιστώ, ιδρύω) // (αγγλ.) stability (= σταθερότητα), stable (= σταθερός), establish (= εγκαθιστώ, ιδρύω)." },
    { la:"dux", el:"(αγγλ.) duke (= δούκας), conduct (= διεξάγω), educate (= εκπαιδεύω), produce (= παράγω), introduce (= εισάγω) // (γαλλ.) duc (= δούκας), conduire (= οδηγώ) // (ιταλ.) duce (= αρχηγός)." },
    { la:"fecit (facio)", el:"(αγγλ.) fact (= γεγονός), factory (= εργοστάσιο), fiction (= μυθοπλασία), effect (= αποτέλεσμα), perfect (= τέλειος), manufacture (= κατασκευάζω) // (γαλλ.) fait (= γεγονός), faire (= κάνω)." },
    { la:"togatus (toga)", el:"στέγω (= σκεπάζω) // (αγγλ.) toga (= τήβεννος), protect (= προστατεύω), detect (= ανιχνεύω)." },
    { la:"prohibuisset (prohibeo)", el:"(γερμ.) haben (= έχω) // (γαλλ.) prohiber (= απαγορεύω) // (αγγλ.) prohibit (= απαγορεύω), prohibition (= απαγόρευση), exhibit (= εκθέτω), inhibit (= αναστέλλω), habit (= συνήθεια), able (= ικανός)." },
    { la:"subveniendum (sub + venio)", el:"βαίνω // (γαλλ.) subvention (= επιχορήγηση), souvenir (= ανάμνηση, ενθύμιο), venir (= έρχομαι) // (αγγλ.) subvention (= επιδότηση), convene (= συγκαλώ), souvenir (= ενθύμιο), invent (= εφευρίσκω), prevent (= εμποδίζω)." },
    { la:"nunc", el:"νυν // (αγγλ.) now (= τώρα)." },
    { la:"vulnera", el:"ουλή (= επουλωμένη πληγή) // (αγγλ.) vulnerable (= τρωτός, ευπαθής), invulnerable (= άτρωτος)." },
    { la:"sananda", el:"σῶς (= υγιής) // σανατόριο // (γαλλ.) sanatorium, sain (= υγιής) // (αγγλ.) sane (= υγιής), sanitary (= υγιεινός), insane (= τρελός, παράφρων), sanity (= σωφροσύνη, λογική)." },
    { la:"mederi", el:"(ομηρ.) μέδομαι (= φροντίζω) // (γαλλ.) médecin (= γιατρός), médecine (= ιατρική), remède (= φάρμακο, θεραπεία), médical (= ιατρικός) // (αγγλ.) medicine (= φάρμακο), remedy (= θεραπεία), medical (= ιατρικός), medicate (= χορηγώ φάρμακα, θεραπεύω)." },
    { la:"nemo (ne + homo)", el:"(αγγλ.) homo sapiens, human (= ανθρώπινος), homicide (= ανθρωποκτονία), homage (= φόρος τιμής) // (γαλλ.) homme (= άνθρωπος), on (= αόριστη αντωνυμία: «κανείς, ο καθένας») // (ισπαν.) hombre (= άντρας, άνθρωπος)." },
    { la:"potest (potis + sum)", el:"πόσις, δεσ-πότης (= «κύριος του σπιτιού») // (αγγλ.) potent (= ισχυρός), potential (= δυνητικός), possible (= δυνατός), potentate (= ισχυρός ηγεμόνας, μονάρχης), omnipotent (= παντοδύναμος), impotent (= ανίσχυρος, ανίκανος) // (γαλλ.) pouvoir (= μπορώ / δύναμη), puissant (= ισχυρός, δυνατός), puissance (= δύναμη, ισχύς)." }
  ]
};

export default UNIT;
