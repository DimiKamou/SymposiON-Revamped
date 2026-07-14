// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 47
//  Lectio XLVII — «Ο Αύγουστος και η φιλαρέσκεια της κόρης του, της Ιουλίας»
//  (Macrobius, Saturnalia 2, 5)
//  periods, alignment, nouns, adjectives, comparatives, pronouns, verbs, sos
//  + προαιρετικά transforms (Μέρος VIII) & etymology (Μέρος IX).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 47,
  title: "Ο Αύγουστος και η φιλαρέσκεια της κόρης του, της Ιουλίας",
  latinTitle: "Lectio XLVII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Iulia", r:"Υποκείμενο", to:"στο coeperat", g:"ονομ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"Iulia, -ae (θηλ. α΄) — η Ιουλία (κύριο όνομα, μόνο ενικ.)" },
        { l:"Augusti", k:"Augustus", r:"Γενική κτητική", to:"στο filia", g:"γεν. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Augustus, -i (αρσ. β΄) — ο Αύγουστος" },
        { l:"filia", r:"Παράθεση", to:"στο Iulia", g:"ονομ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"filia, -ae (θηλ. α΄) — η κόρη (δοτ./αφαιρ. πληθ. filiis/filiabus)", a:"," },
        { l:"mature", r:"Επιρρ. προσδ. του χρόνου", to:"στο habere coeperat", g:"χρονικό επίρρημα (< maturus)", d:"mature — πρόωρα" },
        { l:"habere", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο coeperat", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"habeo, habui, habitum, habēre (2) — έχω", note:"Εννοούμενο υποκ.: (Iulia) — ταυτοπροσωπία." },
        { l:"coeperat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. υπερσ. — ελλειπτικό", d:"coepi, coepisse — άρχισα" },
        { l:"canos", k:"cani", r:"Αντικείμενο", to:"στο habere", g:"αιτ. πληθ., αρσ. — ουσιαστικό β΄ κλ. (μόνο πληθ.)", d:"cani, -orum (αρσ. β΄) — οι άσπρες τρίχες", a:"," },
        { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο canos· οριστική (πραγματικό), παρατ. (solebat) — αναφορά στο παρελθόν.", kids:[
          { l:"quos", k:"qui", r:"Αντικείμενο", to:"στο legere", g:"αιτ. πληθ., αρσ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
          { l:"legere", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο solebat", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"lego, legi, lectum, legĕre (3) — κόβω, βγάζω", note:"Εννοούμενο υποκ.: (Iulia) — ταυτοπροσωπία." },
          { l:"secrete", r:"Επιρρ. προσδ. του τρόπου", to:"στο legere", g:"τροπικό επίρρημα", d:"secrete (secreto) — κρυφά" },
          { l:"solebat", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρατ. — ημιαποθετικό", d:"soleo, solitus sum, (solitum), solēre (2) — συνηθίζω", note:"Εννοούμενο υποκ.: (Iulia).", a:"." }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Hac", k:"hic", r:"Επιθετικός προσδ.", to:"στο re", g:"αφαιρ. ενικ., θηλ. — δεικτική αντωνυμία", d:"hic, haec, hoc — αυτός, -ή, -ό" },
        { l:"re", k:"res", r:"Υποκείμενο μετοχής", to:"στη μετοχή audita", g:"αφαιρ. ενικ., θηλ. — ουσιαστικό ε΄ κλ.", d:"res, rei (θηλ. ε΄) — το πράγμα" },
        { l:"audita", r:"Επιρρ. χρονική μετοχή (νόθη αφαιρετική απόλυτη)", to:"στο voluit", g:"αφαιρ. ενικ., θηλ. — μτχ. παρακ. παθ. φωνής", d:"audio, audivi, auditum, audīre (4) — ακούω", note:"Δηλώνει το προτερόχρονο· εννοείται ποιητικό αίτιο (ab Augusto)." },
        { l:"Augustus", r:"Υποκείμενο", to:"στο voluit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Augustus, -i (αρσ. β΄) — ο Αύγουστος" },
        { l:"voluit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. — ανώμαλο", d:"volo, volui, —, velle — θέλω" },
        { l:"filiam", r:"Άμεσο αντικείμενο", to:"στο deterrere", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"filia, -ae (θηλ. α΄) — η κόρη" },
        { l:"deterrere", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο voluit", g:"απαρέμφατο ενεστ. ενεργ. φωνής", d:"deterreo, deterrui, deterritum, deterrēre (2) (< de + terreo) — αποθαρρύνω", note:"Εννοούμενο υποκ.: (Augustus) — ταυτοπροσωπία." },
        { type:"sub", key:"voulitiki", label:"Ουσιαστική του quominus", note:"Δευτ. ουσιαστική πρόταση του quominus, ως έμμεσο αντικείμενο στο deterrere (ρήμα εμποδισμού)· υποτακτική παρατ. (faceret) — εξάρτηση από ιστ. χρόνο· ιδιομορφία ακολουθίας (συγχρονισμός).", kids:[
          { l:"quominus", r:"Σύνδεσμος", g:"υποτακτικός σύνδεσμος (ρήματα εμποδισμού)", d:"quominus — (από το) να" },
          { l:"id", k:"is", r:"Αντικείμενο", to:"στο faceret", g:"αιτ. ενικ., ουδ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό" },
          { l:"faceret", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. ενεργ. φωνής", d:"facio, feci, factum, facĕre (3, σε -io) — κάνω", note:"Εννοούμενο υποκ.: (filia).", a:"." }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Εννοούμενο υποκ.: (Augustus).", kids:[
        { l:"Eo", k:"is", r:"Επιθετικός προσδ.", to:"στο consilio", g:"αφαιρ. ενικ., ουδ. — δεικτική (ως οριστική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό" },
        { l:"consilio", r:"Αφαιρετική (οργανική) του τρόπου", to:"στο intervenit", g:"αφαιρ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"consilium, -ii/-i (ουδ. β΄) — το σχέδιο (eo consilio = μ' αυτό το σχέδιο)" },
        { l:"aliquando", r:"Επιρρ. προσδ. του χρόνου", to:"στο intervenit", g:"χρονικό επίρρημα", d:"aliquando — κάποτε" },
        { l:"repente", r:"Επιρρ. προσδ. του τρόπου", to:"στο intervenit", g:"τροπικό επίρρημα", d:"repente — ξαφνικά, απρόοπτα" },
        { l:"intervenit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"intervenio, interveni, interventum, intervenīre (4) (< inter + venio) — εμφανίζομαι απρόοπτα" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Συνδέεται με την προηγούμενη παρατακτικά συμπλεκτικά (-que). Εννοούμενο υποκ.: (Augustus).", kids:[
        { l:"oppressit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"opprimo, oppressi, oppressum, opprimĕre (3) (< ob + premo) — πιάνω επ' αυτοφώρω" },
        { l:"-que", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος (εγκλιτικός)", d:"-que — και" },
        { l:"ornatrices", r:"Αντικείμενο", to:"στο oppressit", g:"αιτ. πληθ., θηλ. — ουσιαστικό γ΄ κλ.", d:"ornatrix, ornatricis (θηλ. γ΄) — η κομμώτρια", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { type:"sub", key:"enantiomatiki", label:"Εναντιωματική", note:"Δευτ. επιρρ. εναντιωματική στο dissimulavit· etsi + οριστική (πραγματική κατάσταση), παρακ. (deprehendit)· στην κύρια το tamen.", kids:[
          { l:"Etsi", r:"Σύνδεσμος", g:"υποτακτικός εναντιωματικός σύνδεσμος", d:"etsi — αν και" },
          { l:"super vestem", k:"vestis", r:"Εμπρόθετος προσδ. του τόπου", to:"στο deprehendit", g:"super (πρόθ. + αιτ.) + vestem (αιτ. ενικ., θηλ.)", d:"super — πάνω σε· vestis, -is (θηλ. γ΄) — το φόρεμα" },
          { l:"earum", k:"is", r:"Γενική κτητική", to:"στο vestem", g:"γεν. πληθ., θηλ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός (earum = ornatricum)" },
          { l:"deprehendit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"deprehendo, deprehendi, deprehensum, deprehendĕre (3) — ανακαλύπτω", note:"Εννοούμενο υποκ.: (Augustus)." },
          { l:"canos", k:"cani", r:"Αντικείμενο", to:"στο deprehendit", g:"αιτ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"cani, -orum (αρσ. β΄) — οι άσπρες τρίχες", a:"," }
        ]},
        { l:"tamen", r:"Σύνδεσμος", g:"παρατακτικός αντιθετικός σύνδεσμος", d:"tamen — όμως" },
        { l:"Augustus", r:"Υποκείμενο", to:"στο dissimulavit", g:"ονομ. ενικ., αρσ. — ουσιαστικό β΄ κλ.", d:"Augustus, -i (αρσ. β΄) — ο Αύγουστος" },
        { l:"dissimulavit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"dissimulo, dissimulavi, dissimulatum, dissimulāre (1) — προσποιούμαι ότι δεν…" },
        { l:"eos", k:"is", r:"Αντικείμενο", to:"στο vidisse", g:"αιτ. πληθ., αρσ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός (eos = canos)" },
        { l:"vidisse", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο dissimulavit", g:"απαρέμφατο παρακ. ενεργ. φωνής", d:"video, vidi, visum, vidēre (2) — βλέπω", note:"Εννοούμενο υποκ.: (se) — άμεση αυτοπάθεια (λατινισμός)." }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Συνδέεται με την προηγούμενη κύρια παρατακτικά συμπλεκτικά (et). Εννοούμενο υποκ.: (Augustus).", kids:[
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"aliis", k:"alius", r:"Επιθετικός προσδ.", to:"στο sermonibus", g:"αφαιρ. πληθ., αρσ. — αντωνυμικό επίθετο", d:"alius, alia, aliud — άλλος, -η, -ο" },
        { l:"sermonibus", r:"Αφαιρετική (οργανική) του τρόπου", to:"στο extraxit", g:"αφαιρ. πληθ., αρσ. — ουσιαστικό γ΄ κλ.", d:"sermo, sermonis (αρσ. γ΄) — η κουβέντα, ο λόγος" },
        { l:"tempus", r:"Αντικείμενο", to:"στο extraxit", g:"αιτ. ενικ., ουδ. — ουσιαστικό γ΄ κλ.", d:"tempus, temporis (ουδ. γ΄) — ο χρόνος" },
        { l:"extraxit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"extraho, extraxi, extractum, extrahĕre (3) — παρατείνω" },
        { type:"sub", key:"xroniki", label:"Χρονική", note:"Δευτ. επιρρ. χρονική στο extraxit· donec + οριστική παρακ. (induxit) — η πράξη ενδιαφέρει μόνο χρονικά· δηλώνει το υστερόχρονο.", kids:[
          { l:"donec", r:"Σύνδεσμος", g:"υποτακτικός χρονικός σύνδεσμος", d:"donec — ώσπου, ωσότου" },
          { l:"induxit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"induco, induxi, inductum, inducĕre (3) (< in + duco) — φέρνω για συζήτηση", note:"Εννοούμενο υποκ.: (Augustus)." },
          { l:"mentionem", r:"Αντικείμενο", to:"στο induxit", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"mentio, mentionis (θηλ. γ΄) — η μνεία" },
          { l:"aetatis", r:"Γενική αντικειμενική", to:"στο mentionem", g:"γεν. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"aetas, aetatis (θηλ. γ΄) — η ηλικία", a:"." }
        ]}
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Εννοούμενο υποκ.: (Augustus).", kids:[
        { l:"Tum", r:"Επιρρ. προσδ. του χρόνου", to:"στο interrogavit", g:"χρονικό επίρρημα", d:"tum — τότε" },
        { l:"interrogavit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"interrogo, interrogavi, interrogatum, interrogāre (1) — ρωτώ" },
        { l:"filiam", r:"Άμεσο αντικείμενο", to:"στο interrogavit", g:"αιτ. ενικ., θηλ. — ουσιαστικό α΄ κλ.", d:"filia, -ae (θηλ. α΄) — η κόρη", a:"," },
        { type:"sub", key:"plagia", label:"Πλάγια ερωτηματική (ολικής άγνοιας, διμελής)", note:"Δευτ. ουσιαστική πλάγια ερωτηματική, έμμεσο αντικ. στο interrogavit· utrum … an· υποτακτική παρατ. (mallet) — εξάρτηση από ιστ. χρόνο, σύγχρονο στο παρελθόν.", kids:[
          { l:"utrum", r:"Ερωτηματικό μόριο", g:"εισάγει διμελή ολικής άγνοιας πλάγια ερώτηση", d:"utrum … an — αν … ή" },
          { l:"post", r:"Πρόθεση", g:"πρόθεση + αιτιατική", d:"post — μετά" },
          { l:"aliquot", r:"Επιθετικός προσδ.", to:"στο annos", g:"άκλιτη αόριστη επιθ. αντωνυμία (μόνο πληθ.)", d:"aliquot — μερικοί, -ές, -ά" },
          { l:"annos", r:"Εμπρόθετος προσδ. του χρόνου", to:"στο esse", g:"αιτ. πληθ., αρσ. — ουσιαστικό β΄ κλ.", d:"annus, -i (αρσ. β΄) — το έτος" },
          { l:"cana", k:"canus", r:"Κατηγορούμενο", to:"στο (illa) (μέσω esse)", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"canus, -a, -um — ασπρομάλλης" },
          { l:"esse", k:"sum", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο mallet", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι", note:"Εννοούμενο υποκ.: (illa) — ταυτοπροσωπία." },
          { l:"mallet", r:"Ρήμα", g:"γ΄ ενικ. υποτ. παρατ. — ανώμαλο", d:"malo, malui, —, malle — προτιμώ", note:"Εννοούμενο υποκ.: (illa)." },
          { l:"an", r:"Ερωτηματικό μόριο", g:"β΄ σκέλος διμελούς πλάγιας ερώτησης", d:"an — ή" },
          { l:"calva", k:"calvus", r:"Κατηγορούμενο", to:"στο (illa) (μέσω esse)", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"calvus, -a, -um — φαλακρός", a:"." }
        ]}
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { type:"sub", key:"xroniki", label:"Χρονική (cum ιστορικός)", note:"Δευτ. επιρρ. χρονική στο obiecit· cum ιστορικός-διηγηματικός + υποτακτική υπερσ. (respondisset) — προτερόχρονο στο παρελθόν, υπογραμμίζει βαθύτερη σχέση αιτίου-αιτιατού.", kids:[
          { l:"Cum", r:"Σύνδεσμος", g:"υποτακτικός χρονικός (ιστορικός-διηγηματικός) σύνδεσμος", d:"cum — όταν" },
          { l:"illa", k:"ille", r:"Υποκείμενο", to:"στο respondisset", g:"ονομ. ενικ., θηλ. — δεικτική αντωνυμία", d:"ille, illa, illud — εκείνος, -η, -ο" },
          { l:"respondisset", r:"Ρήμα", g:"γ΄ ενικ. υποτ. υπερσ. ενεργ. φωνής", d:"respondeo, respondi, responsum, respondēre (2) — απαντώ" },
          { type:"sub", key:"kyria", label:"Ευθύς λόγος (αντικείμενο)", note:"Κύρια πρόταση σε ευθύ λόγο· νοηματικά άμεσο αντικείμενο στο respondisset.", kids:[
            { l:"ego", r:"Υποκείμενο", to:"στο malo", g:"ονομ. ενικ., θηλ. — προσωπική αντωνυμία α΄ προσ.", d:"ego — εγώ" },
            { l:"pater", r:"Κλητική προσφώνηση", g:"κλητ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"pater, patris (αρσ. γ΄) — ο πατέρας", a:"," },
            { l:"cana", k:"canus", r:"Κατηγορούμενο", to:"στο ego (μέσω esse)", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"canus, -a, -um — ασπρομάλλης" },
            { l:"esse", k:"sum", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο malo", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι", note:"Εννοούμενο υποκ.: (ego)." },
            { l:"malo", r:"Ρήμα", g:"α΄ ενικ. οριστ. ενεστ. — ανώμαλο", d:"malo, malui, —, malle — προτιμώ" }
          ]}
        ]},
        { l:"mendacium", r:"Άμεσο αντικείμενο", to:"στο obiecit", g:"αιτ. ενικ., ουδ. — ουσιαστικό β΄ κλ.", d:"mendacium, -ii/-i (ουδ. β΄) — το ψέμα, το ψεύτικο επιχείρημα" },
        { l:"illi", k:"ille", r:"Έμμεσο αντικείμενο", to:"στο obiecit", g:"δοτ. ενικ., θηλ. — δεικτική αντωνυμία", d:"ille, illa, illud — εκείνος, -η, -ο" },
        { l:"pater", r:"Υποκείμενο", to:"στο obiecit", g:"ονομ. ενικ., αρσ. — ουσιαστικό γ΄ κλ.", d:"pater, patris (αρσ. γ΄) — ο πατέρας" },
        { l:"obiecit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. παρακ. ενεργ. φωνής", d:"obicio, obieci, obiectum, obicĕre (3, σε -io) (< ob + iacio) — προβάλλω (αντίθετο επιχείρημα)", a:":" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (κρίσης) — ευθύς λόγος", note:"Εννοούμενο υποκ.: (ego).", kids:[
        { l:"Non", r:"Άρνηση", to:"στο dubito", g:"αρνητικό μόριο", d:"non — δεν" },
        { l:"dubito", r:"Ρήμα", g:"α΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"dubito, dubitavi, dubitatum, dubitāre (1) — αμφιβάλλω" },
        { type:"sub", key:"voulitiki", label:"Ουσιαστική του quin", note:"Δευτ. ουσιαστική πρόταση του quin, αντικείμενο στο non dubito (ρήμα που δηλώνει «δεν αμφιβάλλω»)· υποτακτική ενεστ. (nolis) — εξάρτηση από αρκτικό χρόνο· ιδιομορφία ακολουθίας (συγχρονισμός).", kids:[
          { l:"quin", r:"Σύνδεσμος", g:"υποτακτικός σύνδεσμος (μετά από ρήματα μη αμφιβολίας)", d:"quin — ότι, πως (δεν)" },
          { l:"calva", k:"calvus", r:"Κατηγορούμενο", to:"στο (tu) (μέσω esse)", g:"ονομ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"calvus, -a, -um — φαλακρός" },
          { l:"esse", k:"sum", r:"Τελικό απαρέμφατο (αντικείμενο)", to:"στο nolis", g:"απαρέμφατο ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι", note:"Εννοούμενο υποκ.: (tu)." },
          { l:"nolis", r:"Ρήμα", g:"β΄ ενικ. υποτ. ενεστ. — ανώμαλο", d:"nolo, nolui, —, nolle (< non + volo) — δεν θέλω", note:"Εννοούμενο υποκ.: (tu).", a:"." }
        ]}
      ]}
    ]},

    { n: 7, kids: [
      { type:"main", key:"kyria", label:"Κύρια — ευθεία ερώτηση (μερικής άγνοιας)", note:"Ευθεία ερώτηση κρίσης· οριστική (πραγματικό), ενεστ. (times). Εννοούμενο υποκ.: (tu).", kids:[
        { l:"Quid", k:"quis", r:"Αιτιατική της αιτίας", to:"στο non times", g:"αιτ. ενικ., ουδ. — ερωτηματική ουσιαστική αντωνυμία", d:"quis, quid — ποιος; τι; (quid = γιατί)" },
        { l:"ergo", r:"Σύνδεσμος", g:"παρατακτικός συμπερασματικός σύνδεσμος", d:"ergo — λοιπόν" },
        { l:"non", r:"Άρνηση", to:"στο times", g:"αρνητικό μόριο", d:"non — δεν" },
        { l:"times", r:"Ρήμα", g:"β΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"timeo, timui, —, timēre (2) — φοβάμαι" },
        { type:"sub", key:"endoiastiki", label:"Ενδοιαστική", note:"Δευτ. ουσιαστική ενδοιαστική, αντικείμενο στο non times (ρήμα φόβου)· ne (φόβος μήπως γίνει κάτι) + υποτακτική ενεστ. (faciant) — εξάρτηση από αρκτικό χρόνο· ιδιομορφία ακολουθίας.", kids:[
          { l:"ne", r:"Σύνδεσμος", g:"υποτακτικός ενδοιαστικός σύνδεσμος", d:"ne — μήπως" },
          { l:"istae", k:"iste", r:"Υποκείμενο", to:"στο faciant", g:"ονομ. πληθ., θηλ. — δεικτική αντωνυμία", d:"iste, ista, istud — αυτός (εδώ)" },
          { l:"te", k:"tu", r:"Αντικείμενο", to:"στο faciant", g:"αιτ. ενικ., θηλ. — προσωπική αντωνυμία β΄ προσ.", d:"tu — εσύ" },
          { l:"calvam", k:"calvus", r:"Κατηγορούμενο του αντικειμένου", to:"στο te", g:"αιτ. ενικ., θηλ. — επίθ. β΄ κλ.", d:"calvus, -a, -um — φαλακρός" },
          { l:"faciant", r:"Ρήμα", g:"γ΄ πληθ. υποτ. ενεστ. ενεργ. φωνής", d:"facio, feci, factum, facĕre (3, σε -io) — κάνω", a:"?" }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Iulia, Augusti filia, mature habēre coeperat canos, quos legere secrēte solēbat.", el:"Η Ιουλία, η κόρη του Αυγούστου, είχε αρχίσει να έχει πρόωρα άσπρες τρίχες, τις οποίες συνήθιζε να βγάζει κρυφά." },
    { la:"Hac re audīta Augustus voluit filiam deterrēre quominus id faceret.", el:"Όταν άκουσε αυτό, ο Αύγουστος θέλησε να αποθαρρύνει την κόρη του από το να το κάνει αυτό." },
    { la:"Eo consilio aliquando repente intervēnit oppressitque ornatrices.", el:"Μ' αυτό το σχέδιο εμφανίστηκε κάποτε απρόοπτα και έπιασε επ' αυτοφώρω τις κομμώτριες." },
    { la:"Etsi super vestem eārum deprehendit canos, tamen Augustus dissimulāvit eos vidisse et aliis sermonibus tempus extraxit, donec induxit mentiōnem aetātis.", el:"Αν και ανακάλυψε άσπρες τρίχες πάνω στο φόρεμά τους, εντούτοις ο Αύγουστος προσποιήθηκε ότι δεν τις είδε και παρέτεινε τον χρόνο με άλλες κουβέντες, ώσπου έφερε τη συζήτηση στην ηλικία (της)." },
    { la:"Tum interrogāvit filiam, utrum post aliquot annos cana esse mallet an calva.", el:"Τότε ρώτησε την κόρη του αν θα προτιμούσε μετά από μερικά χρόνια να είναι ασπρομάλλα ή φαλακρή." },
    { la:"Cum illa respondisset «ego, pater, cana esse malo», mendacium illi pater obiēcit: «Non dubito quin calva esse nolis.", el:"Όταν εκείνη απάντησε «εγώ, πατέρα, προτιμώ να είμαι ασπρομάλλα», ο πατέρας τής πρόβαλε ψεύτικο επιχείρημα: «Δεν αμφιβάλλω ότι δεν θέλεις να είσαι φαλακρή." },
    { la:"Quid ergo non times ne istae te calvam faciant?»", el:"Γιατί λοιπόν δεν φοβάσαι μήπως αυτές εδώ σε κάνουν φαλακρή;»" }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"Iulia, -ae", note:"κύριο όνομα — μόνο ενικ." },
        { form:"filia, -ae", note:"δοτ./αφαιρ. πληθ. filiis / filiabus" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Augustus, -i", note:"κύριο όνομα — μόνο ενικ." },
        { form:"cani, -orum", note:"μόνο πληθ." },
        { form:"annus, -i" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"consilium, -ii/-i" },
        { form:"mendacium, -ii/-i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"sermo, sermonis" },
        { form:"pater, patris", note:"γεν. πληθ. patrum" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"ornatrix, ornatricis" },
        { form:"vestis, vestis", note:"γεν. πληθ. -ium, αιτ. πληθ. -es/-is" },
        { form:"mentio, mentionis" },
        { form:"aetas, aetatis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"tempus, temporis" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"res, rei" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"canus, -a, -um", note:"απόλυτο — δεν σχηματίζει παραθετικά" },
      { form:"calvus, -a, -um", note:"δεν σχηματίζει παραθετικά" },
      { form:"maturus, -a, -um", note:"διπλός υπερθ. (maturissimus / maturrimus)" },
      { form:"secretus, -a, -um", note:"δεν σχηματίζει υπερθετικό" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (& επιρρημάτων) ──────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"maturus, -a, -um", comp:"maturior, -ior, -ius", sup:"maturissimus / maturrimus, -a, -um", note:"επίρρ.: mature → maturius → maturissime / maturrime" },
      { pos:"secretus, -a, -um", comp:"secretior, -ior, -ius", sup:"— (χωρίς υπερθετικό)", note:"επίρρ.: secrete (secreto) → secretius → —" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"quos" },
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"hac" },
    { form:"is, ea, id", kind:"Δεικτική (επαναληπτική/οριστική)", extra:"id, eo, earum, eos" },
    { form:"ille, illa, illud", kind:"Δεικτική", extra:"illa, illi" },
    { form:"iste, ista, istud", kind:"Δεικτική", extra:"istae (με έμφαση/μειωτικά)" },
    { form:"ego", kind:"Προσωπική", extra:"α΄ προσ." },
    { form:"tu", kind:"Προσωπική", extra:"β΄ προσ. (te)" },
    { form:"quis, quid", kind:"Ερωτηματική ουσιαστική", extra:"quid (= γιατί)" },
    { form:"aliquot", kind:"Αόριστη επιθετική", extra:"άκλιτη· μόνο πληθ." },
    { form:"alius, alia, aliud", kind:"Αντωνυμικό επίθετο", extra:"aliis" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"dissimulo", perf:"dissimulavi", sup:"dissimulatum", inf:"dissimulāre", note:"" },
      { pres:"interrogo", perf:"interrogavi", sup:"interrogatum", inf:"interrogāre", note:"< inter + rogo" },
      { pres:"dubito", perf:"dubitavi", sup:"dubitatum", inf:"dubitāre", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"habeo", perf:"habui", sup:"habitum", inf:"habēre", note:"" },
      { pres:"soleo", perf:"solitus sum", sup:"(solitum)", inf:"solēre", note:"ημιαποθετικό" },
      { pres:"deterreo", perf:"deterrui", sup:"deterritum", inf:"deterrēre", note:"< de + terreo" },
      { pres:"video", perf:"vidi", sup:"visum", inf:"vidēre", note:"" },
      { pres:"respondeo", perf:"respondi", sup:"responsum", inf:"respondēre", note:"" },
      { pres:"timeo", perf:"timui", sup:"—", inf:"timēre", note:"χωρίς σουπίνο" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"lego", perf:"legi", sup:"lectum", inf:"legĕre", note:"" },
      { pres:"facio", perf:"feci", sup:"factum", inf:"facĕre", note:"3, σε -io" },
      { pres:"opprimo", perf:"oppressi", sup:"oppressum", inf:"opprimĕre", note:"< ob + premo" },
      { pres:"deprehendo", perf:"deprehendi", sup:"deprehensum", inf:"deprehendĕre", note:"< de + prehendo" },
      { pres:"extraho", perf:"extraxi", sup:"extractum", inf:"extrahĕre", note:"" },
      { pres:"induco", perf:"induxi", sup:"inductum", inf:"inducĕre", note:"< in + duco" },
      { pres:"obicio", perf:"obieci", sup:"obiectum", inf:"obicĕre", note:"3, σε -io· < ob + iacio" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"audio", perf:"audivi (audii)", sup:"auditum", inf:"audīre", note:"" },
      { pres:"intervenio", perf:"interveni", sup:"interventum", inf:"intervenīre", note:"< inter + venio" }
    ]},
    { syz:"Ανώμαλα ρήματα", rows:[
      { pres:"volo", perf:"volui", sup:"—", inf:"velle", note:"θέλω" },
      { pres:"malo", perf:"malui", sup:"—", inf:"malle", note:"< magis + volo — προτιμώ" },
      { pres:"nolo", perf:"nolui", sup:"—", inf:"nolle", note:"< non + volo — δεν θέλω" },
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό" },
      { pres:"coepi", perf:"coepi", sup:"—", inf:"coepisse", note:"ελλειπτικό — άρχισα" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Δευτ. πρόταση", title:"quominus & quin (ουσιαστικές)", body:"«deterrere quominus id faceret»: ουσιαστική του quominus μετά από ρήμα εμποδισμού (deterreo), ως έμμεσο αντικείμενο. «Non dubito quin … nolis»: ουσιαστική του quin μετά από ρήμα άρσης αμφιβολίας (non dubito), ως αντικείμενο. Και οι δύο με υποτακτική· ιδιομορφία στην ακολουθία των χρόνων (συγχρονισμός)." },
    { tag:"Ενδοιαστική", title:"times ne … (φόβος)", body:"«non times ne istae te calvam faciant»: δευτ. ουσιαστική ενδοιαστική, αντικείμενο στο ρήμα φόβου (times). Το ne δηλώνει φόβο μήπως ΓΙΝΕΙ κάτι (το μη επιθυμητό)· εκφέρεται με υποτακτική ενεστ. (εξάρτηση από αρκτικό χρόνο)." },
    { tag:"Πλάγια ερώτηση", title:"utrum … an (ολικής άγνοιας, διμελής)", body:"«utrum … cana esse mallet an calva»: δευτ. πλάγια ερωτηματική ολικής άγνοιας, διμελής (utrum … an), έμμεσο αντικείμενο στο interrogavit· πάντα με υποτακτική (mallet: παρατ., σύγχρονο στο παρελθόν)." },
    { tag:"Χρονικές", title:"cum ιστορικός vs donec + οριστική", body:"«Cum illa respondisset» = cum ιστορικός-διηγηματικός + υποτακτική (προτερόχρονο, βαθύτερη σχέση αιτίου-αιτιατού). «donec induxit» = καθαρά χρονικός donec + οριστική (η πράξη ενδιαφέρει μόνο χρονικά· υστερόχρονο)." },
    { tag:"Μετοχή", title:"Νόθη αφαιρετική απόλυτη «hac re audita»", body:"«Hac re audita»: επιρρ. χρονική μετοχή σε νόθη αφαιρετική απόλυτη — νόθη, γιατί το εννοούμενο ποιητικό αίτιο (ab Augusto) ταυτίζεται με το υποκ. (Augustus) του ρήματος voluit. Δηλώνει το προτερόχρονο." },
    { tag:"Ρηματικά", title:"Ημιαποθετικό, ελλειπτικό & ανώμαλα", body:"soleo: ημιαποθετικό (ενεργ. ενεστ. – μέσος παρακ. solitus sum). coepi, coepisse: ελλειπτικό (μόνο συντελικοί χρόνοι) = άρχισα. volo / malo (< magis+volo) / nolo (< non+volo): ανώμαλα ρήματα της βούλησης." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε αντίστοιχες δευτερεύουσες προτάσεις", items:[
      { from:"hac re audita",
        to:[
        "με postquam: postquam Augustus hanc rem audivit (postquam + οριστική παρακειμένου)",
        "με cum: cum Augustus hanc rem audivisset (cum ιστορικός + υποτακτική υπερσυντελίκου)"],
        note:"Νόθη αφαιρετική απόλυτη, επιρρηματική χρονική μετοχή παρακειμένου· δηλώνει το προτερόχρονο. Εξάρτηση από ιστορικό χρόνο: voluit (παρακείμενος με σημασία αορίστου)." }
    ]},
    { id:"Β", label:"Μετατροπή των δευτερευουσών προτάσεων σε αντίστοιχες μετοχές", items:[
      { from:"Etsi super vestem earum deprehendit canos, tamen Augustus dissimulavit eos vidisse",
        to:"Augustus canos deprehensos super vestem earum dissimulavit se vidisse",
        note:"Μετατροπή της δευτερεύουσας εναντιωματικής πρότασης σε εναντιωματική μετοχή, συνημμένη στο αντικείμενο canos του ρήματος dissimulavit της πρότασης στην οποία ανήκει." }
    ]},
    { id:"Γ", label:"Η μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"... oppressitque ornatrices", to:"... ornatricesque (ονομ.) oppressae sunt ab Augusto" },
      { from:"Etsi super vestem earum deprehendit canos, ...", to:"Etsi super vestem earum deprehensi sunt cani ab Augusto, ..." },
      { from:"... et aliis sermonibus tempus extraxit, donec induxit mentionem aetatis", to:"... et aliis sermonibus tempus (ονομ.) extractum est ab Augusto, donec mentio aetatis inducta est (ab eo)" },
      { from:"Tum interrogavit filiam, ...", to:"Tum interrogata est filia ab Augusto, ..." },
      { from:"... mendacium illi pater obiecit", to:"..., mendacium (ονομ.) illi a patre obiectum est" },
      { from:"... ne istae te calvam faciant?", to:"... ne ab istis tu calva fias?" }
    ]},
    { id:"Δ", label:"Μετατροπή του ευθέος λόγου σε πλάγιο", items:[
      { from:"Όλο το κείμενο (ευθύς λόγος), με εξάρτηση: Macrobius narrat (αρκτ. χρ.) / narrabat (ιστορ. χρ.)",
        to:[
        "Iuliam, Augusti filiam, ... coepisse canos, quos ... soleret",
        "illā re auditā Augustum voluisse ... quominus id faciat / faceret",
        "eo consilio ... Augustum intervenisse oppressisseque ornatrices",
        "etsi ... deprehenderit / deprehendisset canos, tamen Augustum dissimulavisse eos se vidisse et ... extraxisse, donec induxerit / induxisset ...",
        "cum illa respondisset patri se canam esse malle, mendacium illi patrem obiecisse",
        "tum Augustum interrogavisse filiam, utrum ... cana esse malit / mallet an calva",
        "ipsum (se) non dubitare quin (illa) calva esse nolit / nollet"],
        note:"Τα ζεύγη τύπων (faciat/faceret, deprehenderit/deprehendisset, induxerit/induxisset, malit/mallet, nolit/nollet) ισχύουν αντίστοιχα για αρκτικό (narrat) / ιστορικό (narrabat) χρόνο εξάρτησης. Χρησιμοποιείται ipsum αντί se για αποφυγή σύγχυσης υποκειμένων." },
      { from:"«ego, pater, cana esse malo»", to:"Illa respondet (αρκτ. χρ.) / respondit (ιστορ. χρ.) patri se canam esse malle" },
      { from:"«Non dubito quin calva esse nolis»", to:"Pater mendacium illi obicit (αρκτ. χρ.) / obiecit (ιστορ. χρ.) se non dubitare quin calva esse nolit / nollet" },
      { from:"«Quid ergo non times ne istae te calvam faciant?»", to:"Pater Iuliam (filiam) interrogat (αρκτ. χρ.) / interrogavit (ιστορ. χρ.) quin ergo non timeat / timeret ne eae (ή illae) illam calvam faciant / facerent" }
    ]},
    { id:"Ε", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"... Augustus voluit filiam deterrere quominus id faceret",
        to:[
        "Noli id facere!",
        "Ne id feceris!"],
        note:"απαγόρευση" },
      { from:"Tum interrogavit filiam, utrum post aliquot annos cana esse mallet an calva.",
        to:[
        "Utrum post aliquot annos cana esse mavis an calva?",
        "Mavisne post aliquot annos cana esse an calva?",
        "Post aliquot annos cana esse mavis an calva?"] },
      { from:"Non dubito quin calva esse nolis",
        to:[
        "Calva esse non vis",
        "Num calva esse vis?"],
        note:"Το Num calva esse vis; περιμένει αρνητική απάντηση (ρητορική ερώτηση)." },
      { from:"Quid ergo non times ne istae te calvam faciant?",
        to:[
        "Facientne istae te calvam?",
        "Istae te calvam facient"],
        note:"Το Facientne ...; όταν δεν γνωρίζουμε την απάντηση που περιμένουμε." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"Iulia", el:"Ιουλία." },
    { la:"Augusti, Augustus", el:"Αύγουστος // (αγγλ.) august / August (= σεβάσμιος, μεγαλοπρεπής / Αύγουστος) // (γαλλ.) août (= Αύγουστος)." },
    { la:"mature", el:"(= ώριμος) // (γαλλ.) maturité (= ωριμότητα) // (αγγλ.) mature / premature (= ώριμος / πρόωρος) // (ισπαν.) maduro (= ώριμος)." },
    { la:"habere", el:"(γερμ.) haben (= έχω) // (αγγλ.) have, habit (= συνήθεια, ένδυμα) // (γαλλ.) avoir (= έχω) // (ιταλ.) avere (= έχω) // (ισπαν.) haber (= έχω)." },
    { la:"legere [< lego]", el:"λέγω // (αγγλ.) lecture (= διάλεξη), legible (= ευανάγνωστος) // (γαλλ.) lire (= διαβάζω)." },
    { la:"secrete [< secretus < se-cerno]", el:"κρίνω // (γαλλ.) secret (= μυστικό) // (αγγλ.) secretary (= γραμματέας), discern (= διακρίνω)." },
    { la:"solebat [< soleo]", el:"(γαλλ.) ob-solète (= απαρχαιωμένος), in-solent (= ιταμός, αήθης) // (ισπαν.) soler (= συνηθίζω)." },
    { la:"re", el:"ρεαλισμός (< γαλλ.) // (αγγλ.) real (= πραγματικός), republic (= δημοκρατία, πολιτεία), rebus (= εικονόγριφος)." },
    { la:"audita [< audio]", el:"ἀΐω // (αγγλ.) audience (= ακροατήριο), obey (= υπακούω) // (γαλλ.) ouïr (= ακούω) // (ισπαν.) oír (= ακούω)." },
    { la:"voluit [< volo], mallet, malo [< magis + volo], nolis [< nolo < ne- + volo]", el:"βούλομαι // (αγγλ.) volunteer (= εθελοντής), benevolent (= καλοπροαίρετος), malevolent (= κακόβουλος), voluntary (= εκούσιος) // (γαλλ.) vouloir (= θέλω)." },
    { la:"de-terrere [< de-terreo]", el:"τρέω, τρόμος // (γαλλ.) terroriste (= τρομοκράτης), terreur (= τρόμος) // (αγγλ.) deter (= αποτρέπω), terrible (= τρομερός)." },
    { la:"faceret, faciant [< facio]", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο), manufacture (= κατασκευάζω) // (γαλλ.) faire (= κάνω) // (ισπαν.) hacer (= κάνω)." },
    { la:"repente", el:"(ισπ.) repentino (= ξαφνικός)." },
    { la:"inter-venit", el:"βαίνω // (γαλλ.) venir (= έρχομαι), intervenir (= παρεμβαίνω), avenue (= λεωφόρος) // (αγγλ.) event (= γεγονός), convene (= συγκαλώ, συνέρχομαι)." },
    { la:"op-pressit [< op-primo]", el:"πρέσα // (γαλλ.) oppression (= καταπίεση) // κομπρεσέρ (< γαλλ.) // κομπρέσα (< ιταλ.) // (αγγλ.) express (= εκφράζω / στίβω), print (= τυπώνω, αποτύπωμα) // (ιταλ.) espresso (= καφές εσπρέσο (κυριολ. 'στυμμένος'))." },
    { la:"ornatrices [< orno (= κοσμώ)]", el:"(γαλλ.) orner (= διακοσμώ) // (αγγλ.) ornate (= περίτεχνος), ornament (= στολίδι, κόσμημα), adorn (= στολίζω, καλλωπίζω)." },
    { la:"super vestem", el:"ὑπέρ // ἐσθής, ἔννυμι // βεστιάριο (< ιταλ.) // (αγγλ.) vest (= γιλέκο, ένδυμα), invest (= επενδύω), superior (= ανώτερος)." },
    { la:"de-pre-hendit", el:"χανδάνω (= κρατώ, χωρώ) // (αγγλ.) com-prehend (= κατανοώ, περιλαμβάνω), prison (= φυλακή), apprehend (= συλλαμβάνω, αντιλαμβάνομαι) // (γαλλ.) prendre (= παίρνω, πιάνω)." },
    { la:"dis-simulavit", el:"(αγγλ.) similar (= όμοιος), simulate (= προσομοιώνω, υποκρίνομαι) // (γαλλ.) similarité (= ομοιότητα), sembler (= φαίνομαι, μοιάζω)." },
    { la:"aliis [< alius]", el:"ἄλλος, ἄλλη, ἄλλο // (αγγλ.) alien (= ξένος, αλλότριος), alias (= άλλως, ψευδώνυμο), alibi (= άλλοθι)." },
    { la:"vidisse", el:"(ϝιδεῖν) ιδέα, βίντεο (< αγγλ.) // (αγγλ.) vision (= όραση, όραμα) // (γαλλ.) voir (= βλέπω)." },
    { la:"sermonibus", el:"(αγγλ.) sermon (= ομιλία, κήρυγμα)." },
    { la:"tempus", el:"τέμπο (< ιταλ.) // (ισπαν.) tiempo (= χρόνος) // (αγγλ.) temporary (= προσωρινός), contemporary (= σύγχρονος) // (γαλλ.) temps (= χρόνος, καιρός)." },
    { la:"ex-traxit [< ex-traho]", el:"(αγγλ.) extra-ction (= εξαγωγή) / τρακτέρ (< γαλλ.), attract (= προσελκύω), contract (= συμβόλαιο / συστέλλω), train (= τρένο, σειρά, εκπαιδεύω)." },
    { la:"in-duxit [< in-duco]", el:"(γαλλ.) in-ductif (= επαγωγικός), con-ducteur (= οδηγός), conduire (= οδηγώ) // (αγγλ.) ad-ductor (= προσαγωγός μυς), produce (= παράγω), duke (= δούκας)." },
    { la:"mentionem [< mentio < mens]", el:"μέμνημαι, μνήμη, μνημονικός // μένος // (γαλλ.) mental (= δια-νοητικός) // (αγγλ.) mention (= αναφέρω, μνεία), dementia (= άνοια)." },
    { la:"aetatis [< aetas < aevitas]", el:"(αγγλ.) eternal (= αιώνιος), age (= ηλικία, εποχή)." },
    { la:"interrogavit", el:"(γαλλ.) inter-rogation (= ερώτημα, ανάκριση), inter-rogatif (= ερωτηματικός) // (αγγλ.) interrogate (= ανακρίνω, ερωτώ), prerogative (= προνόμιο)." },
    { la:"annos", el:"(γαλλ.) année (= έτος) // (αγγλ.) annual (= ετήσιος), anniversary (= επέτειος)." },
    { la:"esse", el:"εἰμί // (αγγλ.) essence (= ουσία), essential (= ουσιώδης, απαραίτητος)." },
    { la:"calva, calvam", el:"(γαλλ.) calvitie (= φαλάκρα), chauve (= φαλακρός)." },
    { la:"re-spondisset", el:"σπένδω, σπονδή, ἄσπονδος // (πορτογαλ.) responder (= απαντώ) // (αγγλ.) sponsor (= χορηγός, ανάδοχος), spouse (= σύζυγος)." },
    { la:"ego", el:"εγώ // (αγγλ.) ego (= εγώ, ο εαυτός)." },
    { la:"pater", el:"πατήρ // (γαλλ.) paternel (= πατρικός), père (= πατέρας) // (αγγλ.) patron (= προστάτης, πάτρωνας)." },
    { la:"mendacium [< mendax < mentior]", el:"μένος, μνήμη / (γαλλ.) mentir (= ψεύδομαι) / (αγγλ.) mendacious (= ψεύτης, ψευδής) // (αγγλ.) mendacity (= ψευδολογία, τάση προς το ψέμα)." },
    { la:"ob-iecit", el:"ἵημι (= ρίχνω) // (αγγλ.) object (= αντικείμενο, αντιτίθεμαι), reject (= απορρίπτω), project (= σχέδιο, προβάλλω)." },
    { la:"dubito [< dubius (= αμφίβολος)]", el:"δοιοί (= δύο, δύο τρόπων/ειδών), διττῶς, δύο // (αγγλ.) doubt (= αμφιβάλλω), dubious (= αμφίβολος, ύποπτος) // (γαλλ.) douter (= αμφιβάλλω)." },
    { la:"times [< timeo]", el:"(αγγλ.) timorous (= δειλός, φοβικός), timid (= δειλός, συνεσταλμένος), intimidate (= εκφοβίζω)." }
  ]
};

export default UNIT;
