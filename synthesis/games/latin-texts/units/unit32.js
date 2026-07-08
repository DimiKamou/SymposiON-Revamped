// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 32
//  «Ένας πανηγυρικός της λογοτεχνίας» (Lectio XXXII)
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 32,
  title: "Ένας πανηγυρικός της λογοτεχνίας",
  latinTitle: "Lectio XXXII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Pleni", r:"Κατηγορούμενο", to:"στο libri (μέσω του sunt)", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ.", d:"plenus, -a, -um — γεμάτος" },
        { l:"sunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. — συνδετικό", d:"sum, fui, —, esse — είμαι, υπάρχω" },
        { l:"omnes", r:"Επιθετικός προσδ.", to:"στο libri", g:"ονομ. πληθ., αρσ. — επίθ. γ΄ κλ.", d:"omnis, -is, -e — όλος, κάθε" },
        { l:"libri", r:"Υποκείμενο", to:"στο sunt", g:"ονομ. πληθ.", d:"liber, libri (αρσ. β΄) — το βιβλίο", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Παρατακτικά συνδεδεμένη (ασύνδετο σχήμα)· εννοείται το ρήμα sunt.", kids:[
        { l:"plenae", r:"Κατηγορούμενο", to:"στο voces", g:"ονομ. πληθ., θηλ. — επίθ. β΄ κλ.", d:"plenus, -a, -um — γεμάτος", note:"Εννοείται το ρήμα sunt." },
        { l:"sapientium", r:"Γενική κτητική", to:"στο voces", g:"γεν. πληθ., αρσ. — επίθ. γ΄ κλ. ουσιαστικοπ. (μτχ. ενεστ.)", d:"sapiens, -entis (αρσ. γ΄) — ο σοφός" },
        { l:"voces", r:"Υποκείμενο", to:"στο (εννοούμενο) sunt", g:"ονομ. πληθ.", d:"vox, vocis (θηλ. γ΄) — η φωνή, ο λόγος", a:"," }
      ]},
      { type:"main", key:"kyria", label:"Κύρια", note:"Παρατακτικά συνδεδεμένη (ασύνδετο σχήμα)· εννοείται το ρήμα est.", kids:[
        { l:"plena", r:"Κατηγορούμενο", to:"στο vetustas", g:"ονομ. εν., θηλ. — επίθ. β΄ κλ.", d:"plenus, -a, -um — γεμάτος", note:"Εννοείται το ρήμα est." },
        { l:"exemplorum", r:"Γενική (του περιεχομένου)", to:"στο plena", g:"γεν. πληθ., ουδ.", d:"exemplum, -i (ουδ. β΄) — το παράδειγμα", note:"Το plenus συντάσσεται με γενική (ή αφαιρετική)." },
        { l:"vetustas", r:"Υποκείμενο", to:"στο (εννοούμενο) est", g:"ονομ. εν.", d:"vetustas, -atis (θηλ. γ΄) — η αρχαιότητα, τα παλιά χρόνια", a:";" }
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια (απόδοση)", note:"Κύρια πρόταση κρίσεως· λειτουργεί ως απόδοση του υποθετικού λόγου. Το quae είναι αναφορική αντωνυμία στην αρχή περιόδου, σε θέση δεικτικής (= αυτά).", kids:[
        { l:"quae", r:"Υποκείμενο", to:"στο iacerent", g:"ονομ. πληθ., ουδ. — αναφορική αντων. (σε θέση δεικτικής)", d:"qui, quae, quod — ο οποίος· εδώ: αυτά", note:"Αναφορική αντωνυμία στην αρχή περιόδου = δεικτική (αυτά, δηλ. libri, voces, vetustas)." },
        { l:"iacerent", r:"Ρήμα", g:"γ΄ πληθ. υποτ. παρατ. ενεργ.", d:"iaceo, iacui, —, iacere (2) — κείμαι, βρίσκομαι", note:"Υποτακτική παρατατικού ως απόδοση υποθετικού λόγου του μη πραγματικού στο παρόν." },
        { l:"in tenebris", k:"tenebrae", r:"Εμπρόθετος επιρρ. προσδ. (κατάστασης)", to:"στο iacerent", g:"in (πρόθ. + αφαιρ.) + tenebris (αφαιρ. πληθ.)", d:"in — σε· tenebrae, -arum (θηλ. α΄, μόνο πληθ.) — το σκοτάδι, η αφάνεια" },
        { l:"omnia", r:"Κατηγορηματικός προσδ.", to:"στο quae", g:"ονομ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"omnis, -is, -e — όλος", a:"," },
        { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"Δευτ. επιρρηματική υποθετική πρόταση, εισάγεται με τον αρνητικό υποθετικό σύνδεσμο nisi και εκφέρεται με υποτακτική παρατατικού (accederet). Μαζί με την απόδοση (iacerent) σχηματίζει υποθετικό λόγο του μη πραγματικού (αντίθετου του πραγματικού) στο παρόν.", kids:[
          { l:"nisi", r:"Υποθετικός σύνδεσμος", g:"υποθετικός σύνδεσμος (αρνητικός)", d:"nisi — εάν δεν, εκτός εάν" },
          { l:"litterarum", r:"Γενική κτητική", to:"στο lumen", g:"γεν. πληθ.", d:"litterae, -arum (θηλ. α΄, πληθ.) — τα γράμματα, η λογοτεχνία/παιδεία" },
          { l:"lumen", r:"Υποκείμενο", to:"στο accederet", g:"ονομ. εν., ουδ.", d:"lumen, luminis (ουδ. γ΄) — το φως" },
          { l:"accederet", r:"Ρήμα", g:"γ΄ εν. υποτ. παρατ. ενεργ.", d:"accedo, accessi, accessum, accedere (3) — προστίθεμαι, συνοδεύω", a:"." }
        ]}
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια (θαυμαστική)", note:"Κύρια πρόταση επιφωνηματική (θαυμαστική), εκφέρεται με οριστική.", kids:[
        { l:"Quam", r:"Επιρρ. προσδ. του ποσού", to:"στο multas", g:"θαυμαστικό (ποσοτικό) επίρρημα", d:"quam — πόσο" },
        { l:"multas", r:"Επιθετικός προσδ.", to:"στο imagines", g:"αιτ. πληθ., θηλ. — επίθ. β΄ κλ.", d:"multus, -a, -um — πολύς" },
        { l:"nobis", r:"Έμμεσο αντικείμενο (δοτ. χαριστική)", to:"στο reliquerunt", g:"δοτ. πληθ. — προσωπική αντων. α΄ προσ.", d:"ego (πληθ. nos) — εγώ, εμείς" },
        { l:"imagines", r:"Άμεσο αντικείμενο", to:"στο reliquerunt", g:"αιτ. πληθ.", d:"imago, imaginis (θηλ. γ΄) — η εικόνα, η προσωπογραφία" },
        { l:"non solum", r:"Σύνδεσμος (επιδοτικός)", g:"συσχετικός σύνδεσμος (non solum ... verum etiam)", d:"non solum — όχι μόνο" },
        { l:"ad intuendum", r:"Εμπρόθετος επιρρ. προσδ. του σκοπού", to:"στο reliquerunt", g:"ad (πρόθ. + αιτ.) + intuendum (αιτ. γερουνδίου)", d:"intueor, intuitus sum, intueri (αποθ. 2) — παρατηρώ, ατενίζω", a:"," },
        { l:"verum etiam", r:"Σύνδεσμος (επιδοτικός)", g:"συσχετικός σύνδεσμος (non solum ... verum etiam)", d:"verum etiam — αλλά και" },
        { l:"ad imitandum", r:"Εμπρόθετος επιρρ. προσδ. του σκοπού", to:"στο reliquerunt", g:"ad (πρόθ. + αιτ.) + imitandum (αιτ. γερουνδίου)", d:"imitor, imitatus sum, imitari (αποθ. 1) — μιμούμαι" },
        { l:"fortissimorum", r:"Επιθετικός προσδ.", to:"στο virorum", g:"γεν. πληθ., αρσ. — υπερθετικός βαθμός (επίθ. γ΄ κλ.)", d:"fortis, -is, -e — γενναίος· υπερθ. fortissimus, -a, -um — γενναιότατος" },
        { l:"virorum", r:"Γενική κτητική", to:"στο imagines", g:"γεν. πληθ.", d:"vir, viri (αρσ. β΄) — ο άνδρας" },
        { l:"expressas", r:"Επιθετική μετοχή", to:"στο imagines", g:"αιτ. πληθ., θηλ. — μτχ. παρακ. (παθ.)", d:"exprimo, expressi, expressum, exprimere (3) — αποτυπώνω, εκφράζω", note:"Επιθετική μετοχή που προσδιορίζει το imagines (= αποτυπωμένες)." },
        { l:"scriptores", r:"Υποκείμενο", to:"στο reliquerunt", g:"ονομ. πληθ.", d:"scriptor, scriptoris (αρσ. γ΄) — ο συγγραφέας" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος (et ... et)", d:"et — και" },
        { l:"Graeci", r:"Επιθετικός προσδ. (παράθεση)", to:"στο scriptores", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ. (ουσιαστικοπ.)", d:"Graecus, -a, -um — Έλληνας· Graeci — οι Έλληνες" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος (et ... et)", d:"et — και" },
        { l:"Latini", r:"Επιθετικός προσδ. (παράθεση)", to:"στο scriptores", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ. (ουσιαστικοπ.)", d:"Latinus, -a, -um — Λατίνος· Latini — οι Λατίνοι" },
        { l:"reliquerunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακ. ενεργ.", d:"relinquo, reliqui, relictum, relinquere (3) — αφήνω, κληροδοτώ", a:"!" }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Το Quas είναι αναφορική αντωνυμία στην αρχή περιόδου, σε θέση δεικτικής (= αυτές).", kids:[
        { l:"Quas", r:"Άμεσο αντικείμενο", to:"στο proponebam", g:"αιτ. πληθ., θηλ. — αναφορική αντων. (σε θέση δεικτικής)", d:"qui, quae, quod — ο οποίος· εδώ: αυτές", note:"Αναφορική αντωνυμία στην αρχή περιόδου = δεικτική (αυτές, δηλ. imagines)." },
        { l:"ego", r:"Υποκείμενο", to:"στο proponebam", g:"ονομ. εν. — προσωπική αντων. α΄ προσ.", d:"ego — εγώ", a:"," },
        { l:"cupidus", r:"Επιθετικός προσδ.", to:"στο ego", g:"ονομ. εν., αρσ. — επίθ. β΄ κλ. (+ γεν.)", d:"cupidus, -a, -um — αυτός που επιθυμεί, επιθυμών", note:"Το cupidus συντάσσεται με γενική (εδώ γενική γερουνδίου)." },
        { l:"bene", r:"Επιρρ. προσδ. του τρόπου", to:"στα gerendi, administrandi", g:"τροπικό επίρρημα (θετ. bene, συγκρ. melius, υπερθ. optime)", d:"bene — καλά" },
        { l:"gerendi", r:"Γενική γερουνδίου (αντικ. του cupidus)", to:"στο cupidus", g:"γεν. γερουνδίου", d:"gero, gessi, gestum, gerere (3) — διοικώ, διεξάγω" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"administrandi", r:"Γενική γερουνδίου (αντικ. του cupidus)", to:"στο cupidus", g:"γεν. γερουνδίου", d:"administro, -avi, -atum, -are (1) — διαχειρίζομαι, διοικώ" },
        { l:"rem publicam", r:"Αντικείμενο", to:"στα gerendi, administrandi", g:"αιτ. εν. (res + επίθ. publica)", d:"res publica, rei publicae (θηλ. ε΄ + επίθ.) — η πολιτεία, το κράτος", a:"," },
        { l:"semper", r:"Επιρρ. προσδ. του χρόνου", to:"στο proponebam", g:"χρονικό επίρρημα", d:"semper — πάντοτε" },
        { l:"mihi", r:"Δοτ. προσωπική (χαριστική)", to:"στο proponebam", g:"δοτ. εν. — προσωπική αντων. α΄ προσ.", d:"ego — εγώ (δοτ. mihi)", note:"proponere sibi = βάζω μπροστά μου, θέτω ως πρότυπο/στόχο." },
        { l:"proponebam", r:"Ρήμα", g:"α΄ εν. οριστ. παρατ. ενεργ.", d:"propono, proposui, propositum, proponere (3) — βάζω μπροστά, προτείνω ως πρότυπο", a:"." }
      ]}
    ]},

    { n: 5, kids: [
      { type:"main", key:"kyria", label:"Κύρια", kids:[
        { l:"Colendo", r:"Αφαιρετική γερουνδίου (τρόπου/μέσου)", to:"στο conformabam", g:"αφαιρ. γερουνδίου", d:"colo, colui, cultum, colere (3) — καλλιεργώ, λατρεύω, τιμώ" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"cogitando", r:"Αφαιρετική γερουνδίου (τρόπου/μέσου)", to:"στο conformabam", g:"αφαιρ. γερουνδίου", d:"cogito, -avi, -atum, -are (1) — σκέπτομαι, στοχάζομαι" },
        { l:"homines", r:"Αντικείμενο", to:"στα colendo, cogitando", g:"αιτ. πληθ.", d:"homo, hominis (αρσ. γ΄) — ο άνθρωπος" },
        { l:"excellentes", r:"Επιθετικός προσδ.", to:"στο homines", g:"αιτ. πληθ., αρσ. — επίθ. γ΄ κλ. (μτχ. προέλευσης)", d:"excellens, -entis — έξοχος, διακεκριμένος" },
        { l:"animum", r:"Αντικείμενο", to:"στο conformabam", g:"αιτ. εν.", d:"animus, -i (αρσ. β΄) — η ψυχή, το πνεύμα" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"mentem", r:"Αντικείμενο", to:"στο conformabam", g:"αιτ. εν.", d:"mens, mentis (θηλ. γ΄) — ο νους, η διάνοια" },
        { l:"meam", r:"Επιθετικός προσδ. (κτητ. αντων.)", to:"στα animum, mentem", g:"αιτ. εν., θηλ. — κτητική αντων. α΄ προσ. (ένας κτήτορας)", d:"meus, -a, -um — δικός μου" },
        { l:"conformabam", r:"Ρήμα", g:"α΄ εν. οριστ. παρατ. ενεργ.", d:"conformo, -avi, -atum, -are (1) — διαπλάθω, διαμορφώνω", a:"." }
      ]}
    ]},

    { n: 6, kids: [
      { type:"main", key:"kyria", label:"Κύρια", note:"Οι αφαιρετικές γερουνδίου (expetendo, ducendo) σχηματίζουν παρενθετικό σχήμα ανάμεσα σε παύλες.", kids:[
        { l:"Sic", r:"Επιρρ. προσδ. του τρόπου", to:"στο potui (obicere)", g:"δεικτικό/τροπικό επίρρημα", d:"sic — έτσι" },
        { l:"enim", r:"Αιτιολογικός σύνδεσμος (παρατακτικός)", g:"παρατακτικός αιτιολογικός σύνδεσμος (μεταθετικός)", d:"enim — διότι, γιατί", note:"Συνδέει αιτιολογικά την περίοδο με τα προηγούμενα." },
        { l:"—", plain:true },
        { l:"laudem", r:"Αντικείμενο", to:"στο expetendo", g:"αιτ. εν.", d:"laus, laudis (θηλ. γ΄) — ο έπαινος, η δόξα" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"honestatem", r:"Αντικείμενο", to:"στο expetendo", g:"αιτ. εν.", d:"honestas, -atis (θηλ. γ΄) — η τιμή, η εντιμότητα" },
        { l:"solum", r:"Επιρρ. προσδ. (περιοριστικός)", to:"στο expetendo", g:"περιοριστικό επίρρημα", d:"solum — μόνο" },
        { l:"expetendo", r:"Αφαιρετική γερουνδίου (τρόπου)", to:"στο potui", g:"αφαιρ. γερουνδίου", d:"expeto, expetivi/expetii, expetitum, expetere (3) — επιδιώκω, επιζητώ", a:"," },
        { l:"omnes", r:"Επιθετικός προσδ.", to:"στο cruciatus", g:"αιτ. πληθ., αρσ. — επίθ. γ΄ κλ.", d:"omnis, -is, -e — όλος" },
        { l:"cruciatus", r:"Αντικείμενο", to:"στο ducendo", g:"αιτ. πληθ.", d:"cruciatus, -us (αρσ. δ΄) — το βάσανο, το μαρτύριο" },
        { l:"corporis", r:"Γενική κτητική", to:"στο cruciatus", g:"γεν. εν., ουδ.", d:"corpus, corporis (ουδ. γ΄) — το σώμα" },
        { l:"et", r:"Σύνδεσμος", g:"συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"omnia", r:"Επιθετικός προσδ.", to:"στο pericula", g:"αιτ. πληθ., ουδ. — επίθ. γ΄ κλ.", d:"omnis, -is, -e — όλος" },
        { l:"pericula", r:"Αντικείμενο", to:"στο ducendo", g:"αιτ. πληθ., ουδ.", d:"periculum, -i (ουδ. β΄) — ο κίνδυνος" },
        { l:"mortis", r:"Γενική κτητική", to:"στο pericula", g:"γεν. εν.", d:"mors, mortis (θηλ. γ΄) — ο θάνατος" },
        { l:"parvi", r:"Γενική της αξίας (κατηγορούμενο)", to:"στα cruciatus, pericula (μέσω του ducendo)", g:"γεν. εν., ουδ. — επίθ. β΄ κλ.", d:"parvus, -a, -um — μικρός· parvi ducere = θεωρώ μικρής αξίας", note:"Γενική της αξίας ως κατηγορούμενο (parvi ducere = θεωρώ μικρής σημασίας)." },
        { l:"ducendo", r:"Αφαιρετική γερουνδίου (τρόπου)", to:"στο potui", g:"αφαιρ. γερουνδίου", d:"duco, duxi, ductum, ducere (3) — οδηγώ· εδώ: θεωρώ, εκτιμώ", a:" —" },
        { l:"me", r:"Άμεσο αντικείμενο", to:"στο obicere", g:"αιτ. εν. — προσωπική αντων. α΄ προσ.", d:"ego — εγώ (αιτ. me)", note:"Άμεσο αντικείμενο του απαρεμφάτου obicere (αυτοπάθεια)· λογικό υποκ. του obicere = εγώ (ταυτοπροσωπία)." },
        { l:"pro salute", k:"salus", r:"Εμπρόθετος επιρρ. προσδ. (σκοπού/υπεράσπισης)", to:"στο obicere", g:"pro (πρόθ. + αφαιρ.) + salute (αφαιρ. εν.)", d:"pro — για, υπέρ· salus, salutis (θηλ. γ΄) — η σωτηρία" },
        { l:"vestra", r:"Επιθετικός προσδ. (κτητ. αντων.)", to:"στο salute", g:"αφαιρ. εν., θηλ. — κτητική αντων. β΄ προσ. (πολλοί κτήτορες)", d:"vester, vestra, vestrum — δικός σας" },
        { l:"in tot ac tantas dimicationes", k:"dimicatio", r:"Εμπρόθετος επιρρ. προσδ. (κατεύθυνσης — σκοπού)", to:"στο obicere", g:"in (πρόθ. + αιτ.) + dimicationes (αιτ. πληθ.)· tot ac tantas = επιθ. προσδ.", d:"in — σε· dimicatio, -onis (θηλ. γ΄) — ο αγώνας, η μάχη", note:"tot (άκλιτο) και tantas (tantus, -a, -um): επιθετικοί προσδιορισμοί στο dimicationes, συνδεόμενοι με το ac." },
        { l:"obicere", r:"Αντικείμενο (τελικό απαρέμφατο)", to:"στο potui", g:"απαρέμφατο ενεστ. ενεργ.", d:"obicio, obieci, obiectum, obicere (3, 15 σε -io) — ρίχνω (μπροστά), εκθέτω", note:"Τελικό απαρέμφατο, αντικείμενο στο potui· ταυτοπροσωπία (υποκ. obicere = εγώ)." },
        { l:"potui", r:"Ρήμα", g:"α΄ εν. οριστ. παρακ. — ανώμαλο", d:"possum, potui, —, posse — μπορώ", a:"." }
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Pleni sunt omnes libri,", el:"Γεμάτα είναι όλα τα βιβλία," },
    { la:"plenae sapientium voces,", el:"γεμάτοι οι λόγοι των σοφών," },
    { la:"plena exemplorum vetustas;", el:"γεμάτη από παραδείγματα η αρχαιότητα·" },
    { la:"quae iacerent in tenebris omnia,", el:"όλα αυτά θα βρίσκονταν στην αφάνεια," },
    { la:"nisi litterarum lumen accederet.", el:"εάν δεν τα συνόδευε το φως των γραμμάτων." },
    { la:"Quam multas imagines", el:"Πόσο πολλές εικόνες" },
    { la:"fortissimorum virorum", el:"γενναιότατων ανδρών" },
    { la:"– non solum ad intuendum,", el:"– όχι μόνο για να (τις) κοιτάζουμε," },
    { la:"verum etiam ad imitandum –", el:"αλλά και για να (τις) μιμούμαστε –" },
    { la:"expressas nobis reliquerunt scriptores", el:"μας κληροδότησαν αποτυπωμένες οι συγγραφείς" },
    { la:"et Graeci et Latini!", el:"και Έλληνες και Λατίνοι!" },
    { la:"Quas ego, cupidus", el:"Αυτές εγώ, επιθυμώντας" },
    { la:"bene gerendi", el:"την καλή διοίκηση" },
    { la:"et administrandi", el:"και διαχείριση" },
    { la:"rem publicam,", el:"της πολιτείας," },
    { la:"semper", el:"πάντοτε" },
    { la:"mihi proponebam.", el:"έβαζα μπροστά μου (ως πρότυπα)." },
    { la:"Colendo", el:"Με το να λατρεύω" },
    { la:"et cogitando", el:"και να σκέπτομαι" },
    { la:"homines excellentes", el:"τους έξοχους άνδρες," },
    { la:"conformabam animum", el:"διέπλαθα την ψυχή" },
    { la:"et mentem meam.", el:"και το νου μου." },
    { la:"Sic enim", el:"Διότι έτσι" },
    { la:"– solum expetendo", el:"– με το να επιδιώκω μόνο" },
    { la:"laudem et honestatem,", el:"τον έπαινο και την τιμή," },
    { la:"ducendo", el:"με το να θεωρώ" },
    { la:"omnes cruciatus corporis", el:"όλα τα βάσανα του σώματος" },
    { la:"et omnia pericula mortis", el:"και όλους τους κινδύνους του θανάτου" },
    { la:"parvi –", el:"μικρής αξίας –" },
    { la:"potui obicere me", el:"μπόρεσα να ριχτώ" },
    { la:"in tot", el:"σε τόσο πολλούς" },
    { la:"ac tantas dimicationes", el:"και τόσο μεγάλους αγώνες" },
    { la:"pro salute vestra.", el:"για τη σωτηρία σας." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"littera, -ae", note:"συνήθ. πληθ. litterae, -arum = τα γράμματα, η λογοτεχνία" },
        { form:"tenebrae, -arum", note:"μόνο πληθ." }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"animus, -i" },
        { form:"liber, libri" },
        { form:"vir, viri" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"exemplum, -i" },
        { form:"periculum, -i" }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"homo, hominis" },
        { form:"scriptor, scriptoris" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"dimicatio, dimicationis" },
        { form:"honestas, honestatis" },
        { form:"imago, imaginis" },
        { form:"laus, laudis" },
        { form:"mens, mentis" },
        { form:"mors, mortis" },
        { form:"salus, salutis" },
        { form:"vetustas, vetustatis" },
        { form:"vox, vocis" }
      ]},
      { gender:"Ουδέτερα", items:[
        { form:"corpus, corporis" },
        { form:"lumen, luminis" }
      ]}
    ]},
    { kl:"Δ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[ { form:"cruciatus, -us" } ] }
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[ { form:"res, rei", note:"εδώ στη φράση res publica = η πολιτεία" } ] }
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"cupidus, -a, -um", note:"+ γενική" },
      { form:"Graecus, -a, -um" },
      { form:"Latinus, -a, -um" },
      { form:"multus, -a, -um" },
      { form:"parvus, -a, -um" },
      { form:"plenus, -a, -um", note:"+ γεν. ή αφαιρ." },
      { form:"publicus, -a, -um" },
      { form:"tantus, -a, -um" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"excellens, -entis", note:"μονοκατάληκτο (μτχ. προέλευσης)" },
      { form:"fortis, -is, -e" },
      { form:"omnis, -is, -e" },
      { form:"sapiens, -entis", note:"ουσιαστικοπ. = ο σοφός" }
    ]},
    { kl:"Άκλιτα", items:[
      { form:"tot", note:"άκλιτο (αναφορικό-δεικτικό ποσοτικό)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (κατά κλίση) ─────────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"cupidus, -a, -um", comp:"cupidior, -ior, -ius", sup:"cupidissimus, -a, -um" },
      { pos:"Graecus, -a, -um", comp:"—", sup:"—", note:"εθνικό — δεν σχηματίζει παραθετικά" },
      { pos:"Latinus, -a, -um", comp:"—", sup:"—", note:"εθνικό — δεν σχηματίζει παραθετικά" },
      { pos:"multus, -a, -um", comp:"plus (πληθ. plures, plura)", sup:"plurimus, -a, -um", note:"ανώμαλα" },
      { pos:"parvus, -a, -um", comp:"minor, minus", sup:"minimus, -a, -um", note:"ανώμαλα" },
      { pos:"plenus, -a, -um", comp:"plenior, -ior, -ius", sup:"plenissimus, -a, -um" },
      { pos:"publicus, -a, -um", comp:"—", sup:"—" },
      { pos:"tantus, -a, -um", comp:"—", sup:"—", note:"δεικτικό — δεν σχηματίζει παραθετικά" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"excellens, -entis", comp:"excellentior, -ior, -ius", sup:"excellentissimus, -a, -um" },
      { pos:"fortis, -is, -e", comp:"fortior, -ior, -ius", sup:"fortissimus, -a, -um" },
      { pos:"omnis, -is, -e", comp:"—", sup:"—", note:"δηλώνει το όλον — δεν σχηματίζει παραθετικά" },
      { pos:"sapiens, -entis", comp:"sapientior, -ior, -ius", sup:"sapientissimus, -a, -um" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"ego / nos", kind:"Προσωπική", extra:"α΄ προσώπου (ego, nobis, mihi, me)" },
    { form:"meus, -a, -um", kind:"Κτητική", extra:"α΄ προσ., ένας κτήτορας" },
    { form:"vester, vestra, vestrum", kind:"Κτητική", extra:"β΄ προσ., πολλοί κτήτορες" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"εδώ σε θέση δεικτικής (αρχή περιόδου): quae, quas" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"administro", perf:"administravi", sup:"administratum", inf:"administrare", note:"" },
      { pres:"cogito", perf:"cogitavi", sup:"cogitatum", inf:"cogitare", note:"" },
      { pres:"conformo", perf:"conformavi", sup:"conformatum", inf:"conformare", note:"" },
      { pres:"imitor", perf:"imitatus sum", sup:"—", inf:"imitari", note:"αποθετικό" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"iaceo", perf:"iacui", sup:"—", inf:"iacere", note:"= κείμαι, βρίσκομαι" },
      { pres:"intueor", perf:"intuitus sum", sup:"—", inf:"intueri", note:"αποθετικό" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"accedo", perf:"accessi", sup:"accessum", inf:"accedere", note:"" },
      { pres:"colo", perf:"colui", sup:"cultum", inf:"colere", note:"" },
      { pres:"duco", perf:"duxi", sup:"ductum", inf:"ducere", note:"προστ. ενεστ. duc" },
      { pres:"expeto", perf:"expetivi / expetii", sup:"expetitum", inf:"expetere", note:"" },
      { pres:"exprimo", perf:"expressi", sup:"expressum", inf:"exprimere", note:"" },
      { pres:"gero", perf:"gessi", sup:"gestum", inf:"gerere", note:"" },
      { pres:"obicio", perf:"obieci", sup:"obiectum", inf:"obicere", note:"15 σε -io" },
      { pres:"propono", perf:"proposui", sup:"propositum", inf:"proponere", note:"" },
      { pres:"relinquo", perf:"reliqui", sup:"relictum", inf:"relinquere", note:"" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[] },
    { syz:"ΑΝΩΜΑΛΑ", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"= είμαι" },
      { pres:"possum", perf:"potui", sup:"—", inf:"posse", note:"= μπορώ (σύνθ. του sum)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ ────────────────────────────────────────────────
  sos: [
    { tag:"Σύνταξη", title:"parvi ducere = θεωρώ μικρής αξίας", body:"Το parvi είναι γενική της αξίας ως κατηγορούμενο. Η φράση «parvi ducere» = «θεωρώ μικρής σημασίας»· αντικείμενα του ducendo είναι τα cruciatus και pericula." },
    { tag:"Σύνταξη", title:"plenus + γενική", body:"Το επίθετο plenus συντάσσεται με γενική (ή αφαιρετική): «plena exemplorum» = «γεμάτη από παραδείγματα». Το cupidus επίσης συντάσσεται με γενική (gerendi, administrandi)." },
    { tag:"Αντωνυμία", title:"Αναφορική σε θέση δεικτικής", body:"Τα quae (πρ. 2) και quas (πρ. 4) είναι αναφορικές αντωνυμίες στην αρχή περιόδου, ισοδυναμούν με δεικτικές (= αυτά / αυτές) και οι προτάσεις τους θεωρούνται κύριες." },
    { tag:"Υποθετικός λόγος", title:"Μη πραγματικό στο παρόν", body:"«nisi litterarum lumen accederet» (υπόθεση: nisi + υποτ. παρατ.) — «quae iacerent... omnia» (απόδοση: υποτ. παρατ.). Υποθετικός λόγος του μη πραγματικού (αντίθετου του πραγματικού) στο παρόν." },
    { tag:"Γερούνδιο", title:"Οι πτώσεις του γερουνδίου", body:"Γενική ως συμπλήρωμα του cupidus (gerendi, administrandi)· αφαιρετική του τρόπου (colendo, cogitando, expetendo, ducendo)· αιτιατική με ad για σκοπό (ad intuendum, ad imitandum)." },
    { tag:"Ρήμα", title:"Αποθετικά ρήματα", body:"Τα intueor (2) και imitor (1) είναι αποθετικά: παθητικοί τύποι με ενεργητική σημασία. Τα γερούνδιά τους (intuendum, imitandum) έχουν ενεργητική σημασία." }
  ]
};

export default UNIT;
