export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 17,
  title: "Φόβος μπροστά στο άγνωστο",
  latinTitle: "Lectio XVII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Magnus', r:'Επιθετικός προσδ.', to:'στο timor', g:'ονομ. ενικ., αρσ. — επίθ. β΄ κλ.', d:'magnus, -a, -um — μεγάλος' },
        { l:'timor', r:'Υποκείμενο', to:'στο occupavit', g:'ονομ. ενικ.', d:'timor, timoris (αρσ. γ΄) — ο φόβος' },
        { l:'exercitum', r:'Αντικείμενο', to:'στο occupavit', g:'αιτ. ενικ.', d:'exercitus, exercitus (αρσ. δ΄) — ο στρατός' },
        { l:'occupavit', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρακειμένου ενεργ. φωνής', d:'occupo, occupavi, occupatum, occupare (1) — καταλαμβάνω' },
        { l:'ex vocibus', k:'vox', r:'Εμπρόθετος επιρρ. προσδ. του εξωτερικού αναγκαστικού αιτίου', to:'στο occupavit', g:'ex (πρόθ. + αφαιρ.) + vocibus (αφαιρ. πληθ.)', d:'ex — από· vox, vocis (θηλ. γ΄) — η φωνή· εδώ: η διάδοση' },
        { l:'Gallorum', r:'Γενική υποκειμενική', to:'στο vocibus', g:'γεν. πληθ.', d:'Galli, -orum (αρσ. β΄, μόνο πληθ.) — οι Γαλάτες' },
        { l:'ac', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'ac — και' },
        { l:'mercatorum', r:'Γενική υποκειμενική', to:'στο vocibus', g:'γεν. πληθ.', d:'mercator, mercatoris (αρσ. γ΄) — ο έμπορος', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. ονοματική αναφορική επιθετική προσδιοριστική πρόταση, ως επιθετικός προσδιορισμός στα Gallorum, mercatorum της εξάρτησής της. Εισάγεται με την αναφορική αντων. qui και εκφέρεται με οριστική (praedicabant).', kids:[
          { l:'qui', r:'Υποκείμενο', to:'στο praedicabant', g:'ονομ. πληθ., αρσ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'Germanos', r:'Υποκείμενο ειδικού απαρεμφάτου', to:'στο esse (ετεροπροσωπία)', g:'αιτ. πληθ.', d:'Germani, -orum (αρσ. β΄, μόνο πληθ.) — οι Γερμανοί' },
          { l:'ingenti', r:'Επιθετικός προσδ.', to:'στο magnitudine', g:'αφαιρ. ενικ., θηλ. — επίθ. γ΄ κλ. (γεν. ingentis)', d:'ingens, ingens, ingens (γεν. ingentis) — τεράστιος' },
          { l:'magnitudine', r:'Αφαιρετική κατηγορηματική της ιδιότητας', to:'στο Germanos (μέσω του esse)', g:'αφαιρ. ενικ.', d:'magnitudo, magnitudinis (θηλ. γ΄) — το μέγεθος' },
          { l:'corporum', r:'Γενική κτητική', to:'στο magnitudine', g:'γεν. πληθ.', d:'corpus, corporis (ουδ. γ΄) — το σώμα' },
          { l:'et', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'et — και' },
          { l:'incredibili', r:'Επιθετικός προσδ.', to:'στο virtute', g:'αφαιρ. ενικ., θηλ. — επίθ. γ΄ κλ.', d:'incredibilis, -is, -e — απίστευτος' },
          { l:'virtute', r:'Αφαιρετική κατηγορηματική της ιδιότητας', to:'στο Germanos (μέσω του esse)', g:'αφαιρ. ενικ.', d:'virtus, virtutis (θηλ. γ΄) — η αρετή, η ανδρεία· εδώ: η ανδρεία' },
          { l:'esse', r:'Αντικείμενο (ειδικό απαρέμφατο)', to:'στο praedicabant', g:'απαρέμφατο ενεστ.', d:'sum, fui, —, esse — είμαι, υπάρχω' },
          { l:'praedicabant', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρατατικού ενεργ. φωνής', d:'praedico, praedicavi, praedicatum, praedicare (1) — διακηρύττω', a:'.' }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Alius', r:'Υποκείμενο', to:'στο cupiebat', g:'ονομ. ενικ., αρσ. — αόριστη αντων. (αντωνυμικό επίθ.)', d:'alius, alia, aliud — ο άλλος, η άλλη, το άλλο', note:'Γεν. ενικ.: alius, Δοτ. ενικ.: alii. Αντωνυμικό επίθετο. «Alius alia de causa» = ο καθένας για διαφορετικό λόγο.' },
        { l:'alia', r:'Επιθετικός προσδ.', to:'στο causa', g:'αφαιρ. ενικ., θηλ. — αόριστη αντων.', d:'alius, alia, aliud — ο άλλος, η άλλη, το άλλο' },
        { l:'de causa', k:'causa', r:'Εμπρόθετος επιρρ. προσδ. του εξωτερικού αναγκαστικού αιτίου', to:'στο discedere', g:'de (πρόθ. + αφαιρ.) + causa (αφαιρ. ενικ.)', d:'de — για, από (εξαιτίας)· causa, causae (θηλ. α΄) — η αιτία, ο λόγος' },
        { l:'discedere', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο cupiebat (ταυτοπροσωπία)', g:'απαρέμφατο ενεστ. ενεργ. φωνής', d:'discedo, discessi, discessum, discedere (3) — αποχωρώ' },
        { l:'cupiebat', r:'Ρήμα', g:'γ΄ ενικ. οριστ. παρατατικού ενεργ. φωνής', d:'cupio, cupi(v)i, cupitum, cupere (3, 15 σε -io) — επιθυμώ', a:'.' }
      ]}
    ]},

    { n: 3, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Nonnulli', r:'Υποκείμενο', to:'στο remanebant', g:'ονομ. πληθ., αρσ. — αντωνυμικό επίθ.', d:'nonnulli, nonnullae, nonnulla — μερικοί, μερικές, μερικά', note:'Από το αρνητικό μόριο non + την αόριστη αντων. nullus, -a, -um.' },
        { l:'pudore', r:'Αφαιρετική του ποιητικού αιτίου', to:'στο adducti', g:'αφαιρ. ενικ.', d:'pudor, pudoris (αρσ. γ΄) — η ντροπή', note:'Δεν είναι εύχρηστο στον πληθ.' },
        { l:'adducti', r:'Επιρρ. αιτιολογική μετοχή (συνημμένη στο Nonnulli)', to:'στο remanebant', g:'ονομ. πληθ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'adduco, adduxi, adductum, adducere (3) — παρασύρω, παρακινώ' },
        { l:'remanebant', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρατατικού ενεργ. φωνής', d:'remaneo, remansi, remansum, remanere (2) — παραμένω', a:'.' }
      ]}
    ]},

    { n: 4, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Hi', r:'Υποκείμενο', to:'στο poterant', g:'ονομ. πληθ., αρσ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'neque', r:'Σύνδεσμος', g:'αντιθετικός (παρατακτικός) σύνδεσμος', d:'neque — ούτε', note:'Πρώτο σκέλος του «neque ... neque».' },
        { l:'vultum', r:'Αντικείμενο', to:'στο fingere', g:'αιτ. ενικ.', d:'vultus, vultus (αρσ. δ΄) — το πρόσωπο' },
        { l:'fingere', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο poterant (ταυτοπροσωπία)', g:'απαρέμφατο ενεστ. ενεργ. φωνής', d:'fingo, finxi, fictum, fingere (3) — πλάθω· vultum fingere = προσποιούμαι', note:'vultum fingere = προσποιούμαι.' },
        { l:'neque', r:'Σύνδεσμος', g:'αντιθετικός (παρατακτικός) σύνδεσμος', d:'neque — ούτε', note:'Δεύτερο σκέλος του «neque ... neque».' },
        { l:'lacrimas', r:'Αντικείμενο', to:'στο tenere', g:'αιτ. πληθ.', d:'lacrima, lacrimae (θηλ. α΄) — το δάκρυ' },
        { l:'tenere', r:'Αντικείμενο (τελικό απαρέμφατο)', to:'στο poterant (ταυτοπροσωπία)', g:'απαρέμφατο ενεστ. ενεργ. φωνής', d:'teneo, tenui, tentum, tenere (2) — κρατώ, συγκρατώ' },
        { l:'poterant', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρατατικού', d:'possum, potui, —, posse — μπορώ', a:';' }
      ]}
    ]},

    { n: 5, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'abditi', r:'Επιρρ. χρονική μετοχή (συνημμένη στο εννοούμενο hi)', to:'στο querebantur', g:'ονομ. πληθ., αρσ. — μτχ. παρακειμένου παθ. φωνής', d:'abdo, abdidi, abditum, abdere (3) — κρύβω' },
        { l:'in tabernaculis', k:'tabernaculum', r:'Εμπρόθετος επιρρ. προσδ. του τόπου (στάση)', to:'στο abditi', g:'in (πρόθ. + αφαιρ.) + tabernaculis (αφαιρ. πληθ., ουδ.)', d:'in — σε· tabernaculum, tabernaculi (ουδ. β΄) — η σκηνή' },
        { l:'aut', r:'Σύνδεσμος', g:'διαζευκτικός (παρατακτικός) σύνδεσμος', d:'aut — ή, είτε', note:'Πρώτο σκέλος του διαζευκτικού «aut ... aut».' },
        { l:'suum', r:'Επιθετικός προσδ.', to:'στο fatum', g:'αιτ. ενικ., ουδ. — κτητική αντων. γ΄ προσ. (πολλοί κτήτορες)', d:'suus, sua, suum — ο δικός τους, η δική τους, το δικό τους' },
        { l:'fatum', r:'Αντικείμενο', to:'στο querebantur', g:'αιτ. ενικ., ουδ.', d:'fatum, fati (ουδ. β΄) — η μοίρα' },
        { l:'querebantur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρατατικού — αποθετικό', d:'queror, questus sum, queri (3, αποθετικό) — παραπονιέμαι', note:'Αποθετικό ρήμα: παθητικοί τύποι με ενεργητική σημασία. Εννοούμενο υποκείμενο: hi.' }
      ]}
    ]},

    { n: 6, kids: [
      { l:'aut', r:'Σύνδεσμος', g:'διαζευκτικός (παρατακτικός) σύνδεσμος', d:'aut — ή, είτε', note:'Δεύτερο σκέλος του «aut ... aut»· συνδέει τις δύο κύριες προτάσεις (querebantur / miserabantur).', conn:true },
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'cum familiaribus', k:'familiaris', r:'Εμπρόθετος επιρρ. προσδ. της κοινωνίας', to:'στο miserabantur', g:'cum (πρόθ. + αφαιρ.) + familiaribus (αφαιρ. πληθ.)', d:'cum — με· familiaris, familiaris (αρσ. γ΄) — ο φίλος, ο γνωστός', note:'Αφαιρ. ενικ.: familiari· γεν. πληθ.: familiarium.' },
        { l:'suis', r:'Επιθετικός προσδ.', to:'στο familiaribus', g:'αφαιρ. πληθ., αρσ. — κτητική αντων. γ΄ προσ. (πολλοί κτήτορες)', d:'suus, sua, suum — ο δικός τους, η δική τους, το δικό τους' },
        { l:'commune', r:'Επιθετικός προσδ.', to:'στο periculum', g:'αιτ. ενικ., ουδ. — επίθ. γ΄ κλ.', d:'communis, -is, -e — κοινός' },
        { l:'periculum', r:'Αντικείμενο', to:'στο miserabantur', g:'αιτ. ενικ., ουδ.', d:'periculum, periculi (ουδ. β΄) — ο κίνδυνος' },
        { l:'miserabantur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρατατικού — αποθετικό', d:'miseror, miseratus sum, miserari (1, αποθετικό) — λυπάμαι· εδώ: θρηνώ, θρηνολογώ', note:'Αποθετικό ρήμα. Εννοούμενο υποκείμενο: hi.', a:'.' }
      ]}
    ]},

    { n: 7, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Totis', r:'Κατηγορηματικός προσδ.', to:'στο castris', g:'αφαιρ. πληθ., ουδ. — αντωνυμικό επίθ.', d:'totus, tota, totum — όλος, ολόκληρος', note:'Γεν. ενικ.: totius. Δοτ. ενικ.: toti.' },
        { l:'castris', r:'Αφαιρετική του τόπου (στάση)', to:'στο obsignabantur', g:'αφαιρ. πληθ., ουδ.', d:'castra, castrorum (ουδ. β΄) — το στρατόπεδο (ενικ. castrum, -i = το φρούριο· ετερόσημο)' },
        { l:'testamenta', r:'Υποκείμενο', to:'στο obsignabantur', g:'ονομ. πληθ., ουδ.', d:'testamentum, testamenti (ουδ. β΄) — η διαθήκη' },
        { l:'obsignabantur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρατατικού παθ. φωνής', d:'obsigno, obsignavi, obsignatum, obsignare (1) — υπογράφω και σφραγίζω', a:'.' }
      ]}
    ]},

    { n: 8, kids: [
      { type:'main', key:'kyria', label:'Κύρια', kids:[
        { l:'Horum', r:'Γενική υποκειμενική', to:'στα vocibus, timore', g:'γεν. πληθ., αρσ. — δεικτική αντων.', d:'hic, haec, hoc — αυτός, αυτή, αυτό' },
        { l:'vocibus', r:'Αφαιρετική του εξωτερικού αναγκαστικού αιτίου', to:'στο perturbabantur', g:'αφαιρ. πληθ.', d:'vox, vocis (θηλ. γ΄) — η φωνή· εδώ: η διάδοση' },
        { l:'ac', r:'Σύνδεσμος', g:'συμπλεκτικός (παρατακτικός) σύνδεσμος', d:'ac — και' },
        { l:'timore', r:'Αφαιρετική του εξωτερικού αναγκαστικού αιτίου', to:'στο perturbabantur', g:'αφαιρ. ενικ.', d:'timor, timoris (αρσ. γ΄) — ο φόβος' },
        { l:'paulatim', r:'Επιρρ. προσδ. του ποσού', to:'στο perturbabantur', g:'τροπικό ή και ποσοτικό επίρρημα', d:'paulatim — λίγο λίγο, σιγά σιγά' },
        { l:'etiam', r:'Επιδοτικός σύνδεσμος', g:'συμπλεκτικός επιδοτικός (παρατακτικός) σύνδεσμος', d:'etiam — ακόμα και' },
        { l:'ii', r:'Υποκείμενο', to:'στο perturbabantur', g:'ονομ. πληθ., αρσ. — δεικτική (ως επαναληπτική) αντων.', d:'is, ea, id — αυτός, αυτή, αυτό', a:',' },
        { type:'sub', key:'anaforiki', label:'Αναφορική', note:'Δευτ. ονοματική αναφορική επιθετική προσδιοριστική πρόταση, ως επεξήγηση στο ii της εξάρτησής της. Εκφέρεται με οριστική (habebantur).', kids:[
          { l:'qui', r:'Υποκείμενο', to:'στο habebantur', g:'ονομ. πληθ., αρσ. — αναφορική αντων.', d:'qui, quae, quod — ο οποίος, η οποία, το οποίο' },
          { l:'rei', r:'Γενική (αντικειμενική) ως συμπλήρωμα', to:'στο periti', g:'γεν. ενικ.', d:'res, rei (θηλ. ε΄) — το πράγμα· εδώ: το θέμα· res militaris = τα στρατιωτικά' },
          { l:'militaris', r:'Επιθετικός προσδ.', to:'στο rei', g:'γεν. ενικ., θηλ. — επίθ. γ΄ κλ.', d:'militaris, -is, -e — στρατιωτικός· res militaris = τα στρατιωτικά', note:'Η συνεκφορά res militaris χρησιμοποιείται σπάνια στον πληθ.' },
          { l:'periti', r:'Κατηγορούμενο', to:'στο qui (μέσω του habebantur)', g:'ονομ. πληθ., αρσ. — επίθ. β΄ κλ.', d:'peritus, -a, -um — έμπειρος' },
          { l:'habebantur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρατατικού παθ. φωνής', d:'habeo, habui, habitum, habere (2) — έχω· στην παθ. φωνή: θεωρούμαι', note:'habeor (παθ. φωνή) = θεωρούμαι.', a:',' }
        ]},
        { l:'perturbabantur', r:'Ρήμα', g:'γ΄ πληθ. οριστ. παρατατικού παθ. φωνής', d:'perturbo, perturbavi, perturbatum, perturbare (1) — ταράζω', a:'.' }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { n:1, la:"Magnus timor exercitum occupavit ex vocibus Gallorum ac mercatorum, qui Germanos ingenti magnitudine corporum et incredibili virtute esse praedicabant.", el:"Μεγάλος φόβος κατέλαβε το στρατό από τις διαδόσεις των Γαλατών και των εμπόρων, οι οποίοι διακήρυσσαν ότι οι Γερμανοί είχαν φοβερή σωματική διάπλαση και απίστευτη ανδρεία." },
    { n:2, la:"Alius alia de causa discedere cupiebat.", el:"Προβάλλοντας ο καθένας και μια δικαιολογία επιθυμούσε να αποχωρήσει." },
    { n:3, la:"Nonnulli pudore adducti remanebant.", el:"Μερικοί παρασυρμένοι από ντροπή παρέμεναν." },
    { n:4, la:"Hi neque vultum fingere neque lacrimas tenere poterant;", el:"Αυτοί δεν μπορούσαν ούτε να προσποιηθούν ούτε να συγκρατήσουν τα δάκρυά τους·" },
    { n:5, la:"abditi in tabernaculis aut suum fatum querebantur", el:"κρυμμένοι στις σκηνές τους είτε παραπονούνταν για τη μοίρα τους" },
    { n:6, la:"aut cum familiaribus suis commune periculum miserabantur.", el:"είτε θρηνούσαν για τον κοινό κίνδυνο μαζί με τους γνωστούς τους." },
    { n:7, la:"Totis castris testamenta obsignabantur.", el:"Σε ολόκληρο το στρατόπεδο υπογράφονταν και σφραγίζονταν διαθήκες." },
    { n:8, la:"Horum vocibus ac timore paulatim etiam ii, qui rei militaris periti habebantur, perturbabantur.", el:"Από τις διαδόσεις και το φόβο αυτών ταράζονταν σιγά σιγά ακόμα και αυτοί, οι οποίοι θεωρούνταν έμπειροι στα στρατιωτικά ζητήματα." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ & ΕΠΙΘΕΤΑ (κατά κλίση & γένος) ────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"causa, -ae" },
        { form:"lacrima, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Galli, -orum", note:"μόνο πληθ." },
        { form:"Germani, -orum", note:"μόνο πληθ." }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"castra, -orum", note:"ετερόσημο" },
        { form:"fatum, -i" },
        { form:"tabernaculum, -i" },
        { form:"testamentum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"familiaris, -is" },
        { form:"mercator, -oris" },
        { form:"pudor, -oris", note:"δεν έχει πληθ." },
        { form:"timor, timoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"magnitudo, magnitudinis" },
        { form:"virtus, virtutis" },
        { form:"vox, vocis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"corpus, corporis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"exercitus, -us" },
        { form:"vultus, -us" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[ { form:"res, rei" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"magnus, -a, -um" },
      { form:"peritus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"communis, -is, -e" },
      { form:"incredibilis, -is, -e" },
      { form:"ingens, ingentis" },
      { form:"militaris, -is, -e" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"magnus, -a, -um", comp:"maior, -ior, -ius", sup:"maximus, -a, -um" },
      { pos:"peritus, -a, -um", comp:"—", sup:"—" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"communis, -is, -e", comp:"communior, -ior, -ius", sup:"communissimus, -a, -um" },
      { pos:"incredibilis, -is, -e", comp:"—", sup:"—" },
      { pos:"ingens, ingentis", comp:"ingentior, -ior, -ius", sup:"ingentissimus, -a, -um" },
      { pos:"militaris, -is, -e", comp:"militarior, -ior, -ius", sup:"—" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"alius, alia, aliud", kind:"Αόριστη", extra:"ουσιαστική-επιθετική (αντωνυμικό επίθ.)· γεν. alius, δοτ. alii" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"" },
    { form:"is, ea, id", kind:"Δεικτική", extra:"ως επαναληπτική" },
    { form:"nonnulli, nonnullae, nonnulla", kind:"Αόριστη", extra:"αντωνυμικό επίθ. (non + nullus)" },
    { form:"suus, sua, suum", kind:"Κτητική", extra:"γ΄ προσ., πολλοί κτήτορες" },
    { form:"totus, tota, totum", kind:"Αντωνυμικό επίθ.", extra:"γεν. totius, δοτ. toti" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"miseror", perf:"miseratus sum", sup:"—", inf:"miserari", note:"αποθετικό" },
      { pres:"obsigno", perf:"obsignavi", sup:"obsignatum", inf:"obsignare", note:"" },
      { pres:"occupo", perf:"occupavi", sup:"occupatum", inf:"occupare", note:"" },
      { pres:"perturbo", perf:"perturbavi", sup:"perturbatum", inf:"perturbare", note:"" },
      { pres:"praedico", perf:"praedicavi", sup:"praedicatum", inf:"praedicare", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"habeo", perf:"habui", sup:"habitum", inf:"habere", note:"παθ. habeor = θεωρούμαι" },
      { pres:"remaneo", perf:"remansi", sup:"remansum", inf:"remanere", note:"" },
      { pres:"teneo", perf:"tenui", sup:"tentum", inf:"tenere", note:"" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"abdo", perf:"abdidi", sup:"abditum", inf:"abdere", note:"" },
      { pres:"adduco", perf:"adduxi", sup:"adductum", inf:"adducere", note:"" },
      { pres:"cupio", perf:"cupivi", sup:"cupitum", inf:"cupere", note:"15 σε -io" },
      { pres:"discedo", perf:"discessi", sup:"discessum", inf:"discedere", note:"" },
      { pres:"fingo", perf:"finxi", sup:"fictum", inf:"fingere", note:"" },
      { pres:"queror", perf:"questus sum", sup:"—", inf:"queri", note:"αποθετικό" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"Ανώμαλα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"είμαι, υπάρχω" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"σύνθετο του sum" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ & ΠΑΡΑΤΗΡΗΣΕΙΣ ─────────────────────────────────
  sos: [
    { tag:"Ουσιαστικό", title:"castra: ετερόσημο", body:"castra, -orum (ουδ. β΄, πληθ.) = το στρατόπεδο· στον ενικό castrum, -i = το φρούριο. Ετερόσημο ουσιαστικό." },
    { tag:"Ρήμα", title:"queror & miseror: αποθετικά", body:"Τα queror (questus sum, queri) και miseror (miseratus sum, miserari) είναι αποθετικά ρήματα: έχουν παθητικούς τύπους αλλά ενεργητική σημασία." },
    { tag:"Ρήμα", title:"habeor = θεωρούμαι", body:"Το habeo (2) = έχω· στην παθητική φωνή habeor αποκτά τη σημασία «θεωρούμαι» (qui rei militaris periti habebantur = οι οποίοι θεωρούνταν έμπειροι)." },
    { tag:"Συνεκφορά", title:"res militaris = τα στρατιωτικά", body:"Η συνεκφορά res militaris σημαίνει «τα στρατιωτικά ζητήματα»· το rei είναι γενική ως συμπλήρωμα (αντικειμενική) στο periti. Χρησιμοποιείται σπάνια στον πληθ." },
    { tag:"Αντωνυμία", title:"alius: αντωνυμικό επίθετο", body:"Το alius, alia, aliud είναι αντωνυμικό επίθετο με γεν. ενικ. alius και δοτ. ενικ. alii. Το σχήμα «Alius alia de causa» αποδίδεται «ο καθένας για διαφορετικό λόγο»." },
    { tag:"Συνεκφορά", title:"vultum fingere = προσποιούμαι", body:"Η έκφραση vultum fingere (κυριολ. «πλάθω το πρόσωπο») σημαίνει «προσποιούμαι»." }
  ],
  transforms: [
    { id:"Α", label:"Μετατροπή ενεργητικής σύνταξης σε παθητική", items:[
      { from:"Magnus timor exercitum occupāvit ex vocibus Gallōrum ac mercatōrum, qui Germānos ingenti magnitudine corporum et incredibili virtūte esse praedicābant", to:"Magnō timōre exercitus occupātus est ex vocibus Gallōrum ac mercatōrum, a quibus Germānos ingenti magnitudine corporum et incredibili virtūte esse praedicabātur", note:"απρόσωπο" },
      { from:"Hi neque vultum fingere neque lacrimas tenēre poterant;", to:"Ab his neque vultum fingi neque lacrimas tenēri poterat", note:"απρόσωπο" }
    ]},
    { id:"Β", label:"Μετατροπή παθητικής σύνταξης σε ενεργητική", items:[
      { from:"Totis castris testamenta obsignabantur (ab eis)", to:"Totis castris (ii) testamenta obsignābant" },
      { from:"Horum vocibus ac timōre paulātim etiam ii, qui rei militāris perīti habebantur (a Rōmānis), perturbabantur", to:"Horum voces ac timor paulātim etiam eos, quos rei militāris perītos habēbant (Rōmāni), perturbabant" }
    ]},
    { id:"Γ", label:"Μετατροπή σε απαρεμφατική σύνταξη με εξάρτηση από «Caesar narrat»", items:[
      { from:"Magnus timor exercitum occupāvit ex vocibus Gallōrum ac mercatōrum", to:"Caesar narrat magnum timōrem exercitum occupavisse ex vocibus Gallōrum ac mercatōrum" },
      { from:"Alius aliā de causā discedere cupiēbat", to:"Caesar narrat alium aliā de causā discedere cupivisse" },
      { from:"Nonnulli pudōre adducti remanēbant", to:"Caesar narrat nonnullos pudōre adductos remansisse" },
      { from:"Hi neque vultum fingere neque lacrimas tenēre poterant; abditi in tabernaculis aut suum fatum querebantur aut cum familiaribus suis commūne periculum miserabantur", to:"Caesar narrat eos neque vultum fingere neque lacrimas tenēre potuisse; abditos in tabernaculis aut suum fatum questos esse aut cum familiaribus suis commūne periculum miserātos esse" },
      { from:"Totis castris testamenta obsignabantur", to:"Caesar narrat totis castris testamenta obsignāta esse" },
      { from:"Horum vocibus ac timōre paulātim etiam ii [...] perturbabantur", to:"Caesar narrat illōrum vocibus ac timōre paulātim etiam eos [...] perturbātos esse" }
    ]}
  ],
  etymology: [
    { la:"magnus", el:"μέγας." },
    { la:"timor", el:"(αγγλ.) timorous (= δειλός, φοβισμένος)." },
    { la:"exercitum", el:"(ισπαν.) ejército (= στρατός) // (γαλλ.) exercice (= άσκηση)." },
    { la:"occupāvit", el:"(ιταλ.) capire (= καταλαβαίνω)." },
    { la:"vocibus", el:"(αγγλ.) revocation (= ανάκληση), vocal (= φωνητικός), voice (= φωνή) // (γαλλ.) vocabulaire (= λεξιλόγιο)." },
    { la:"Gallōrum", el:"Γάλλος, Γαλλία." },
    { la:"mercatōrum", el:"(αγγλ.) merchant, (γαλλ.) marchand." },
    { la:"Germānos", el:"Γερμανός, Γερμανία." },
    { la:"magnitudine", el:"μέγας // (αγγλ.) magnitude (= μέγεθος, σημασία) // (γαλλ.) magnifique (= θαυμάσιος)." },
    { la:"corporum", el:"κόρπους (= σώμα κειμένων)." },
    { la:"in-credibili", el:"(αγγλ.) incredible." },
    { la:"virtūte (vir)", el:"βιρτουόζος (< ιταλ. virtuoso)." },
    { la:"esse (es-)", el:"είμι." },
    { la:"prae-dicābant", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= ορθογραφία, υπαγόρευση)." },
    { la:"alius, aliā", el:"ἄλλος, ἄλλη, ἄλλο." },
    { la:"causā", el:"(αγγλ.) cause." },
    { la:"cupiēbat", el:"(γαλλ.) cupidité (= απληστία)." },
    { la:"nonnulli", el:"νούλα [< ιταλ. nulla (= μηδενικό, χωρίς αξία)]." },
    { la:"adducti", el:"(αγγλ.) adductor (= προσαγωγός μυς)." },
    { la:"remanēbant", el:"μένω, μόνος." },
    { la:"fingere", el:"φιγούρα, φιγουράρω, φιγουρίνι (< ιταλ. figura, figurare, figurino)." },
    { la:"lacrimas", el:"δάκρυμα (= αιτία δακρύων, δάκρυ), δάκρυον." },
    { la:"tenēre", el:"(γαλλ.) tenir (= κρατώ)." },
    { la:"poterant [(potis = δυνατός) + sum]", el:"πόσις, δεσ-πότης («κύριος σπιτιού»)." },
    { la:"tabernaculis (< taberna)", el:"ταβέρνα." },
    { la:"fatum", el:"φημί (= λέω, ισχυρίζομαι), φατός (= αυτός που μπορεί να ειπωθεί, ονομαστός) // fata morgana (είδος αντικατοπτρισμού)." },
    { la:"familiaribus (familia)", el:"φαμίλια // (γαλλ.) famille (= οικογένεια) // (αγγλ.) family (= οικογένεια / οικογενειακός)." },
    { la:"commūne", el:"(γαλλ.) commune // κομμουνισμός (< γαλλ. communisme)." },
    { la:"periculum, perīti", el:"πείρα, πειρατής· απειρία." },
    { la:"miserabantur", el:"μιζέρια, μίζερος (< ιταλ.)." },
    { la:"totis", el:"(γαλλ.) totalité (= ολότητα) // (αγγλ.) total (= σύνολο, άθροισμα)." },
    { la:"castris", el:"κάστρο." },
    { la:"testamenta", el:"(αγγλ.) testament." },
    { la:"ob-signabantur", el:"σινιάλο (< ιταλ.) // (αγγλ.) sign (= σήμα, σημάδι) // (γαλλ.) signe (= σήμα, σημάδι, δείγμα)." },
    { la:"timōre", el:"(αγγλ.) timorous (= δειλός, φοβισμένος)." },
    { la:"paulātim (paulus)", el:"παῦρος (= μικρός, λίγος)." },
    { la:"rei", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός)." },
    { la:"militāris", el:"μιλιταρισμός (< γαλλ.)." },
    { la:"habebantur", el:"(γερμ.) haben, (αγγλ.) have." },
    { la:"per-turbabantur", el:"τύρβη (= ταραχή), τούρμπο, τουρμπίνα (< γαλλ.)." }
  ]
};

export default UNIT;
