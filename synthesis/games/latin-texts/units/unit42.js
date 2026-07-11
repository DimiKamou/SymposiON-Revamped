// ============================================================================
//  ΛΑΤΙΝΙΚΑ — ΦΥΛΛΟ ΔΕΔΟΜΕΝΩΝ ΕΝΟΤΗΤΑΣ 42
//  Lectio XLII — «Ο Κικέρωνας και η συνωμοσία του Κατιλίνα» (Cicero)
//  periods, alignment, nouns, adjectives, comparatives, pronouns, verbs, sos
//  + προαιρετικά transforms (Μέρος VIII) & etymology (Μέρος IX).
// ============================================================================

export const UNIT = {
  course: "Λατινικά Προσανατολισμού — Γ΄ Λυκείου",
  number: 42,
  title: "Ο Κικέρωνας και η συνωμοσία του Κατιλίνα",
  latinTitle: "Lectio XLII",
  dataVersion: 2,

  // ── ΜΕΡΟΣ 1: ΚΕΙΜΕΝΟ + ΣΥΝΤΑΞΗ ────────────────────────────────────────────
  periods: [
    { n: 1, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Nonnulli", k:"nonnulli", r:"Υποκείμενο", to:"στο sunt", g:"ονομ. πληθ., αρσ. — αντωνυμικό επίθετο", d:"nonnulli, -ae, -a (< non + nullus) — μερικοί, κάποιοι", note:"Αντωνυμικό επίθετο· κλίνεται ως δευτερόκλιτο· όχι εύχρηστο στον ενικό." },
        { l:"sunt", r:"Ρήμα (υπαρκτικό)", g:"γ΄ πληθ. οριστ. ενεστ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι, υπάρχω" },
        { l:"in hoc ordine", k:"hic", r:"Εμπρόθετος προσδ. (στάση σε τόπο)", to:"στο sunt", g:"in (πρόθ. + αφαιρ.) + hoc ordine (αφαιρ. ενικ.)", d:"in — σε· hic, haec, hoc — αυτός· ordo, ordinis (αρσ. γ΄) — τάξη", note:"hoc: επιθετικός προσδ. στο ordine. ordo senatorius = η τάξη των Συγκλητικών.", a:"," },
        { type:"sub", key:"symperasmatiki", label:"Αναφορική-συμπερασματική", note:"Δευτ. επιρρ. αναφορική συμπερασματική στο nonnulli· qui non = ut non ei· υποτακτική (το αποτέλεσμα = υποκειμ. κατάσταση), ενεστ. (videant) — ιδιομορφία ακολουθίας (συγχρονισμός με την κύρια).", kids:[
          { l:"qui", k:"qui", r:"Υποκείμενο", to:"στο non videant", g:"ονομ. πληθ., αρσ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
          { l:"aut", r:"Σύνδεσμος", g:"παρατακτικός διαζευκτικός σύνδεσμος", d:"aut … aut — είτε … είτε" },
          { l:"ea", k:"is", r:"Αντικείμενο", to:"στο non videant", g:"αιτ. πληθ., ουδ. — δεικτική (ως οριστική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό", a:"," },
          { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο ea· οριστική (πραγματικό), ενεστ. (imminent) — δηλώνει το σύγχρονο.", kids:[
            { l:"quae", k:"qui", r:"Υποκείμενο", to:"στο imminent", g:"ονομ. πληθ., ουδ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
            { l:"imminent", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. ενεργ. φωνής", d:"immineo, —, —, imminēre (2) — πλησιάζω απειλητικά", note:"Χωρίς παρακείμενο & σουπίνο.", a:"," }
          ]},
          { l:"non", r:"Άρνηση", to:"στο videant", g:"αρνητικό μόριο", d:"non — όχι, δεν" },
          { l:"videant", r:"Ρήμα", g:"γ΄ πληθ. υποτ. ενεστ. ενεργ. φωνής", d:"video, vidi, visum, vidēre (2) — βλέπω", a:"," }
        ]},
        { type:"sub", key:"symperasmatiki", label:"Αναφορική-συμπερασματική", note:"Δευτ. επιρρ. αναφορική συμπερασματική στο nonnulli· συνδέεται διαζευκτικά (aut … aut) με την ❷· qui = ut ei· υποτακτική ενεστ. (dissimulent).", kids:[
          { l:"aut", r:"Σύνδεσμος", g:"παρατακτικός διαζευκτικός σύνδεσμος", d:"aut … aut — είτε … είτε" },
          { l:"ea", k:"is", r:"Αντικείμενο", to:"στο (εννοούμενο) videre", g:"αιτ. πληθ., ουδ. — δεικτική (ως επαναληπτική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό", a:"," },
          { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο ea· οριστική (πραγματικό), ενεστ. (vident).", kids:[
            { l:"quae", k:"qui", r:"Αντικείμενο", to:"στο vident", g:"αιτ. πληθ., ουδ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
            { l:"vident", r:"Ρήμα", g:"γ΄ πληθ. οριστ. ενεστ. ενεργ. φωνής", d:"video, vidi, visum, vidēre (2) — βλέπω", note:"Εννοούμενο υποκ.: (ei / ii / i).", a:"," }
          ]},
          { l:"dissimulent", r:"Ρήμα", g:"γ΄ πληθ. υποτ. ενεστ. ενεργ. φωνής", d:"dissimulo, dissimulavi, dissimulatum, dissimulāre (1) (< dis + simulo) — προσποιούμαι ότι δεν…", note:"Εννοούμενα: υποκ. (qui)· ειδικό απαρ. (videre) αντικ. — με υποκ. (qui: ταυτοπροσωπία) & αντικ. ea.", a:":" }
        ]}
      ]}
    ]},

    { n: 2, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"qui στην αρχή περιόδου, μετά από ισχυρή στίξη (:) = δεικτική (qui = ei / ii / i) → εισάγει κύρια, όχι δευτ. αναφορική.", kids:[
        { l:"qui", k:"qui", r:"Υποκείμενο", to:"στο aluerunt", g:"ονομ. πληθ., αρσ. — αναφορική (= δεικτική) αντωνυμία", d:"qui, quae, quod — ο οποίος· qui = ei / ii / i" },
        { l:"spem", k:"spes", r:"Αντικείμενο", to:"στο aluerunt", g:"αιτ. ενικ., θηλ. — ουσιαστικό ε΄ κλ.", d:"spes, spei (θηλ. ε΄) — η ελπίδα" },
        { l:"Catilinae", k:"Catilina", r:"Γενική υποκειμενική", to:"στο spem", g:"γεν. ενικ., αρσ. — ουσιαστικό α΄ κλ.", d:"Catilina, -ae (αρσ. α΄) — ο Κατιλίνας" },
        { l:"mollibus", k:"mollis", r:"Επιθετικός προσδ.", to:"στο sententiis", g:"αφαιρ. πληθ., θηλ. — επίθ. γ΄ κλ. (δικατάληκτο)", d:"mollis, -is, -e — επιεικής, μαλακός, -ή, -ό" },
        { l:"sententiis", k:"sententia", r:"Αφαιρετική (οργανική) του μέσου", to:"στο aluerunt", g:"αφαιρ. πληθ., θηλ. — ουσιαστικό α΄ κλ.", d:"sententia, -ae (θηλ. α΄) — η απόφαση, η γνώμη" },
        { l:"aluerunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακ. ενεργ. φωνής", d:"alo, alui, alitum (altum), alĕre (3) — (εκ)τρέφω" }
      ]},
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"Συνδέεται με την ❻ παρατακτικά συμπλεκτικά (-que). Εννοούμενο υποκ.: (qui).", kids:[
        { l:"coniurationem", k:"coniuratio", r:"Αντικείμενο", to:"στο confirmaverunt", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"coniuratio, coniurationis (θηλ. γ΄) — η συνωμοσία" },
        { l:"-que", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος (εγκλιτικός)", d:"-que — και" },
        { l:"nascentem", k:"nascor", r:"Επιθετική (συνημμένη) ή επιρρ. χρονική μετοχή", to:"στο coniurationem", g:"αιτ. ενικ., θηλ. — μτχ. ενεστ. (nascens, -entis)", d:"nascor, natus sum, (natum), nasci (3, αποθετικό) — γεννιέμαι", note:"coniurationem = υποκ. της μετοχής· ως μτχ. ενεστ. δηλώνει το σύγχρονο (συνημμένη)." },
        { l:"non credendo", r:"Αφαιρετική (οργανική) γερουνδίου (τρόπου)", to:"στο confirmaverunt", g:"non (άρνηση) + credendo (αφαιρ. γερουνδίου)", d:"credo, credidi, creditum, credĕre (3) — πιστεύω", note:"Εννοείται (eam) nasci: ειδικό απαρ., αντικ. στο γερούνδιο· (eam) = υποκ." },
        { l:"confirmaverunt", r:"Ρήμα", g:"γ΄ πληθ. οριστ. παρακ. ενεργ. φωνής", d:"confirmo, confirmavi, confirmatum, confirmāre (1) — ενισχύω, επιβεβαιώνω", a:";" }
      ]}
    ]},

    { n: 3, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", note:"quorum στην αρχή περιόδου, μετά από ισχυρή στίξη (;) = δεικτική (quorum = eorum) → εισάγει κύρια. Στην κύρια αυτή εντάσσεται η απόδοση του υποθετικού λόγου ❾.", kids:[
        { l:"quorum", k:"qui", r:"Γενική υποκειμενική (ή κτητική)", to:"στο auctoritatem", g:"γεν. πληθ., αρσ. — αναφορική (= δεικτική) αντωνυμία", d:"qui, quae, quod — ο οποίος· quorum = eorum" },
        { l:"auctoritatem", k:"auctoritas", r:"Αντικείμενο", to:"στη μετοχή secuti", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"auctoritas, auctoritatis (θηλ. γ΄) — το κύρος, η επιρροή", note:"auctoritatem alicuius sequor = ενεργώ κάτω από την επιρροή κάποιου." },
        { l:"secuti", k:"sequor", r:"Επιρρ. τροπική (ή αιτιολογική) μετοχή", to:"στο dicerent", g:"ονομ. πληθ., αρσ. — μτχ. παρακ. (secutus, -a, -um)", d:"sequor, secutus sum, (secutum), sequi (3, αποθετικό) — ακολουθώ", note:"multi = υποκ. της μετοχής· δηλώνει το προτερόχρονο (συνημμένη)." },
        { l:"multi", r:"Υποκείμενο", to:"στο dicerent", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ. (ουσιαστικοπ.)", d:"multi, -ae, -a — πολλοί", a:"," },
        { l:"non solum", r:"Σύνδεσμος", g:"παρατακτική αντιθετική (επιδοτική) σύνδεση", d:"non solum … verum etiam — όχι μόνο … αλλά και" },
        { l:"improbi", r:"Παράθεση", to:"στο multi", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ.", d:"improbus, -a, -um — αχρείος, -α, -ο", note:"Αντί των ουσιαστικών viri / homines." },
        { l:"verum etiam", r:"Σύνδεσμος", g:"παρατακτική αντιθετική (επιδοτική) σύνδεση", d:"non solum … verum etiam — όχι μόνο … αλλά και" },
        { l:"imperiti", r:"Παράθεση", to:"στο multi", g:"ονομ. πληθ., αρσ. — επίθ. β΄ κλ.", d:"imperitus, -a, -um — άπειρος, -η, -ο", a:"," },
        { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"Δευτ. επιρρ. υποθετική (υπόθεση)· απόδοση = crudeliter et regie id factum esse dicerent. Μεικτός υποθ. λόγος β΄ είδους (αντίθετος προς την πραγματικότητα): υπόθεση στο παρελθόν (υποτ. υπερσ.), απόδοση στο παρόν (υποτ. παρατ.).", kids:[
          { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
          { l:"in hunc", k:"hic", r:"Εμπρόθετος προσδ. (εχθρική κατεύθυνση)", to:"στο animadvertissem", g:"in (πρόθ. + αιτ.) + hunc (αιτ. ενικ., αρσ.)", d:"in — σε, εναντίον· hic, haec, hoc — αυτός", note:"animadverto in aliquem = τιμωρώ κάποιον." },
          { l:"animadvertissem", r:"Ρήμα", g:"α΄ ενικ. υποτ. υπερσ. ενεργ. φωνής", d:"animadverto, animadverti, animadversum, animadvertĕre (3) — παρατηρώ, (in aliquem) τιμωρώ", note:"Εννοούμενο υποκ.: (ego).", a:"," }
        ]},
        { l:"crudeliter", r:"Επιρρ. προσδ. του τρόπου", to:"στο factum esse", g:"τροπικό επίρρημα", d:"crudeliter — με σκληρότητα" },
        { l:"et", r:"Σύνδεσμος", g:"παρατακτικός συμπλεκτικός σύνδεσμος", d:"et — και" },
        { l:"regie", r:"Επιρρ. προσδ. του τρόπου", to:"στο factum esse", g:"τροπικό επίρρημα", d:"regie — τυραννικά" },
        { l:"id", k:"is", r:"Υποκείμενο απαρεμφάτου", to:"στο factum esse (ετεροπροσωπία)", g:"αιτ. ενικ., ουδ. — δεικτική (ως οριστική) αντωνυμία", d:"is, ea, id — αυτός, -ή, -ό" },
        { l:"factum esse", k:"fio", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο dicerent", g:"απαρέμφατο παρακ. — ανώμαλο", d:"fio, factus sum, fieri — γίνομαι" },
        { l:"dicerent", r:"Ρήμα", g:"γ΄ πληθ. υποτ. παρατ. ενεργ. φωνής", d:"dico, dixi, dictum, dicĕre (3) — λέγω", a:"." }
      ]}
    ]},

    { n: 4, kids: [
      { type:"main", key:"kyria", label:"Κύρια (κρίσης)", kids:[
        { l:"Nunc", r:"Επιρρ. προσδ. του χρόνου", to:"στο intellego", g:"χρονικό επίρρημα", d:"nunc — τώρα" },
        { l:"intellego", r:"Ρήμα", g:"α΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"intellego (intelligo), intellexi, intellectum, intellegĕre (3) — καταλαβαίνω", note:"Εννοούμενο υποκ.: (ego).", a:"," },
        { type:"sub", key:"ypothetiki", label:"Υποθετική", note:"Δευτ. επιρρ. υποθετική (υπόθεση)· εξαρτημένος υποθ. λόγος / σε πλάγιο λόγο (απόδοση = τα απαρ. fore). Α΄ είδος (ανοιχτή για το μέλλον): υποτ. παρακ. (pervenerit) λόγω της εξάρτησης.", kids:[
          { l:"si", r:"Σύνδεσμος", g:"υποτακτικός υποθετικός σύνδεσμος", d:"si — αν" },
          { l:"iste", k:"iste", r:"Υποκείμενο", to:"στο pervenerit", g:"ονομ. ενικ., αρσ. — δεικτική αντωνυμία", d:"iste, ista, istud — αυτός (μειωτικά)" },
          { l:"in Manliana castra", r:"Εμπρόθετος προσδ. (κίνηση σε τόπο)", to:"στο pervenerit", g:"in (πρόθ. + αιτ.) + Manliana castra (αιτ. πληθ., ουδ.)", d:"in — σε· Manlianus, -a, -um — του Μανλίου· castra, -orum (ουδ. β΄) — στρατόπεδο", note:"Manliana: επιθετικός προσδ. στο castra. castra (πληθ.) = στρατόπεδο (ετερόσημο).", a:"," },
          { type:"sub", key:"anaforiki", label:"Αναφορική", note:"Δευτ. αναφορική προσδιοριστική στο castra· οριστική ενεστ. (intendit) — λειτουργεί ανεξάρτητα από τον πλάγιο λόγο (γι' αυτό διατηρεί οριστική).", kids:[
            { l:"quo", r:"Επιρρ. προσδ. του τόπου", to:"στο intendit", g:"αναφορικό τοπικό επίρρημα", d:"quo — όπου" },
            { l:"intendit", r:"Ρήμα", g:"γ΄ ενικ. οριστ. ενεστ. ενεργ. φωνής", d:"intendo, intendi, intentum (intensum), intendĕre (3) — κατευθύνομαι", note:"Εννοούμενο υποκ.: (iste).", a:"," }
          ]}
        ]},
        { l:"neminem", k:"nemo", r:"Υποκείμενο απαρεμφάτου", to:"στο fore (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — αόριστη ουσιαστική αντωνυμία", d:"nemo (< ne + homo) — κανένας" },
        { l:"tam", r:"Επιρρ. προσδ. του ποσού", to:"στο stultum", g:"ποσοτικό επίρρημα", d:"tam — τόσο" },
        { l:"stultum", r:"Κατηγορούμενο", to:"στο neminem (μέσω fore)", g:"αιτ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"stultus, -a, -um — ανόητος, -η, -ο" },
        { l:"fore", k:"sum", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο intellego", g:"απαρέμφατο μέλλ. — ανώμαλο/βοηθητικό", d:"sum, fui, —, esse — είμαι (fore = futurum esse)", a:"," },
        { type:"sub", key:"symperasmatiki", label:"Αναφορική-συμπερασματική", note:"Δευτ. επιρρ. αναφορική συμπερασματική στο neminem (1)· qui non = ut non is· προεξαγγέλλεται με το tam (1)· υποτ. ενεστ. (videat) — ιδιομορφία ακολουθίας (εξάρτηση από αρκτικό χρόνο).", kids:[
          { l:"qui", k:"qui", r:"Υποκείμενο", to:"στο non videat", g:"ονομ. ενικ., αρσ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
          { l:"non", r:"Άρνηση", to:"στο videat", g:"αρνητικό μόριο", d:"non — δεν" },
          { l:"videat", r:"Ρήμα", g:"γ΄ ενικ. υποτ. ενεστ. ενεργ. φωνής", d:"video, vidi, visum, vidēre (2) — βλέπω" },
          { l:"coniurationem", k:"coniuratio", r:"Υποκείμενο απαρεμφάτου", to:"στο esse factam (ετεροπροσωπία)", g:"αιτ. ενικ., θηλ. — ουσιαστικό γ΄ κλ.", d:"coniuratio, coniurationis (θηλ. γ΄) — η συνωμοσία" },
          { l:"esse factam", k:"fio", r:"Ειδικό απαρέμφατο (αντικείμενο)", to:"στο non videat", g:"απαρέμφατο παρακ. — ανώμαλο (= factam esse)", d:"fio, factus sum, fieri — γίνομαι", a:"," }
        ]},
        { l:"neminem", k:"nemo", r:"Υποκείμενο (εννοούμενου) απαρεμφάτου", to:"στο (fore) (ετεροπροσωπία)", g:"αιτ. ενικ., αρσ. — αόριστη ουσιαστική αντωνυμία", d:"nemo (< ne + homo) — κανένας", note:"Εννοείται 2ο fore: ειδικό απαρ., αντικ. στο intellego." },
        { l:"tam", r:"Επιρρ. προσδ. του ποσού", to:"στο improbum", g:"ποσοτικό επίρρημα", d:"tam — τόσο" },
        { l:"improbum", r:"Κατηγορούμενο", to:"στο neminem (μέσω εννοούμενου fore)", g:"αιτ. ενικ., αρσ. — επίθ. β΄ κλ.", d:"improbus, -a, -um — αχρείος, -α, -ο", a:"," },
        { type:"sub", key:"symperasmatiki", label:"Αναφορική-συμπερασματική", note:"Δευτ. επιρρ. αναφορική συμπερασματική στο neminem (2)· qui non = ut non is· προεξαγγέλλεται με το tam (2)· υποτ. ενεστ. (fateatur) — ιδιομορφία ακολουθίας.", kids:[
          { l:"qui", k:"qui", r:"Υποκείμενο", to:"στο non fateatur", g:"ονομ. ενικ., αρσ. — αναφορική αντωνυμία", d:"qui, quae, quod — ο οποίος" },
          { l:"non", r:"Άρνηση", to:"στο fateatur", g:"αρνητικό μόριο", d:"non — δεν" },
          { l:"fateatur", r:"Ρήμα", g:"γ΄ ενικ. υποτ. ενεστ. — αποθετικό", d:"fateor, fassus sum, (fassum), fatēri (2, αποθετικό) — ομολογώ", note:"Εννοείται coniurationem esse factam (ειδικό απαρ., αντικ.).", a:"." }
        ]}
      ]}
    ]}
  ],

  // ── ΜΕΡΟΣ 2: ΜΕΤΑΦΡΑΣΗ ΣΕ ΑΝΤΙΣΤΟΙΧΙΣΗ ────────────────────────────────────
  alignment: [
    { la:"Nonnulli sunt in hoc ordine, qui aut ea, quae imminent, non videant, aut ea, quae vident, dissimulent:", el:"Υπάρχουν μερικοί σε αυτή την τάξη (των Συγκλητικών), οι οποίοι είτε αυτά που πλησιάζουν απειλητικά δεν τα βλέπουν, είτε προσποιούνται ότι δεν βλέπουν αυτά που βλέπουν·" },
    { la:"qui spem Catilīnae mollibus sententiis aluērunt coniurationemque nascentem non credendo confirmavērunt;", el:"αυτοί εξέθρεψαν την ελπίδα του Κατιλίνα με τις επιεικείς αποφάσεις (τους) και ενίσχυσαν τη συνωμοσία που γεννιόταν, με το να μην (θέλουν να) πιστεύουν (ότι αυτή γεννιόταν)·" },
    { la:"quorum auctoritātem secūti multi, non solum improbi verum etiam imperīti, si in hunc animadvertissem, crudeliter et regie id factum esse dicerent.", el:"και πολλοί, ενεργώντας κάτω από την επιρροή αυτών, όχι μόνο αχρείοι αλλά και άπειροι, αν τον είχα τιμωρήσει, θα έλεγαν ότι αυτό έγινε με σκληρότητα και τυραννικά." },
    { la:"Nunc intellego, si iste in Manliāna castra pervēnerit, quo intendit, neminem tam stultum fore, qui non videat coniurationem esse factam, neminem tam improbum, qui non fateātur.", el:"Τώρα καταλαβαίνω πως, αν αυτός φτάσει στο στρατόπεδο του Μανλίου, όπου κατευθύνεται, κανείς δεν θα είναι τόσο ανόητος, που να μη βλέπει ότι έγινε συνωμοσία, (και) κανείς τόσο αχρείος, που να μην (το) ομολογεί." }
  ],

  // ── ΜΕΡΟΣ 3: ΟΥΣΙΑΣΤΙΚΑ (κατά κλίση & γένος) ──────────────────────────────
  nouns: [
    { kl:"Α΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"Catilina, -ae", note:"κύριο όνομα — μόνο ενικ." }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"sententia, -ae" }
      ]}
    ]},
    { kl:"Β΄ κλίση", groups:[
      { gender:"Ουδέτερα", items:[
        { form:"castra, -orum", note:"ετερόσημο· ενικ. castrum = φρούριο, πληθ. castra = στρατόπεδο· εδώ μόνο πληθ." }
      ]}
    ]},
    { kl:"Γ΄ κλίση", groups:[
      { gender:"Αρσενικά", items:[
        { form:"ordo, ordinis" }
      ]},
      { gender:"Θηλυκά", items:[
        { form:"coniuratio, coniurationis" },
        { form:"auctoritas, auctoritatis" }
      ]}
    ]},
    { kl:"Ε΄ κλίση", groups:[
      { gender:"Θηλυκά", items:[
        { form:"spes, spei", note:"στον πληθ. μόνο ονομ./αιτ./κλητ. (spes)· πρβ. species, facies, acies" }
      ]}
    ]}
  ],

  adjectives: [
    { kl:"Β΄ κλίση", items:[
      { form:"nonnulli, -ae, -a", note:"αντωνυμικό επίθετο (< non + nullus)· όχι εύχρηστο στον ενικό" },
      { form:"multi, -ae, -a", note:"μόνο πληθ.· ανώμαλα παραθετικά" },
      { form:"improbus, -a, -um" },
      { form:"imperitus, -a, -um" },
      { form:"stultus, -a, -um" },
      { form:"Manlianus, -a, -um", note:"δηλώνει καταγωγή — δεν σχηματίζει παραθετικά" }
    ]},
    { kl:"Γ΄ κλίση", items:[
      { form:"mollis, mollis, molle", note:"δικατάληκτο" }
    ]}
  ],

  // ── ΜΕΡΟΣ 4: ΠΑΡΑΘΕΤΙΚΑ ΕΠΙΘΕΤΩΝ (& επιρρημάτων) ──────────────────────────
  comparatives: [
    { kl:"Β΄ κλίση", rows:[
      { pos:"multi, -ae, -a", comp:"plures, -es, -a", sup:"plurimi, -ae, -a", note:"ανώμαλα· επίρρ.: multum → plus → plurimum" },
      { pos:"improbus, -a, -um", comp:"improbior, -ior, -ius", sup:"improbissimus, -a, -um", note:"επίρρ.: improbe → improbius → improbissime" },
      { pos:"imperitus, -a, -um", comp:"imperitior, -ior, -ius", sup:"imperitissimus, -a, -um", note:"επίρρ.: imperite → imperitius → imperitissime" },
      { pos:"stultus, -a, -um", comp:"stultior, -ior, -ius", sup:"stultissimus, -a, -um", note:"επίρρ.: stulte → stultius → stultissime" },
      { pos:"regius, -a, -um", comp:"magis regius", sup:"maxime regius", note:"περιφραστικά (-ius πριν από φωνήεν)· επίρρ.: regie → magis regie → maxime regie" }
    ]},
    { kl:"Γ΄ κλίση", rows:[
      { pos:"mollis, -is, -e", comp:"mollior, -ior, -ius", sup:"mollissimus, -a, -um", note:"επίρρ.: molliter → mollius → mollissime" },
      { pos:"crudelis, -is, -e", comp:"crudelior, -ior, -ius", sup:"crudelissimus, -a, -um", note:"επίρρ.: crudeliter → crudelius → crudelissime" }
    ]}
  ],

  // ── ΜΕΡΟΣ 5: ΑΝΤΩΝΥΜΙΕΣ ───────────────────────────────────────────────────
  pronouns: [
    { form:"hic, haec, hoc", kind:"Δεικτική", extra:"hoc, hunc" },
    { form:"qui, quae, quod", kind:"Αναφορική", extra:"qui, quae, quorum (στην αρχή περιόδου = δεικτική)" },
    { form:"is, ea, id", kind:"Δεικτική (οριστική/επαναληπτική)", extra:"ea, id· αναπληρώνει το qui / quorum" },
    { form:"iste, ista, istud", kind:"Δεικτική", extra:"iste (με μειωτική σημασία)" },
    { form:"nemo", kind:"Αόριστη ουσιαστική", extra:"< ne + homo· neminem· αναπληρώνεται από nullus (αφαιρ. ενικ. & πληθ.)" }
  ],

  // ── ΜΕΡΟΣ 6: ΑΡΧΙΚΟΙ ΧΡΟΝΟΙ ΡΗΜΑΤΩΝ (κατά συζυγία) ────────────────────────
  verbs: [
    { syz:"Α΄ συζυγία", rows:[
      { pres:"dissimulo", perf:"dissimulavi", sup:"dissimulatum", inf:"dissimulāre", note:"< dis + simulo" },
      { pres:"confirmo", perf:"confirmavi", sup:"confirmatum", inf:"confirmāre", note:"" }
    ]},
    { syz:"Β΄ συζυγία", rows:[
      { pres:"immineo", perf:"—", sup:"—", inf:"imminēre", note:"χωρίς παρακ. & σουπίνο" },
      { pres:"video", perf:"vidi", sup:"visum", inf:"vidēre", note:"" },
      { pres:"fateor", perf:"fassus sum", sup:"(fassum)", inf:"fatēri", note:"αποθετικό (2)" }
    ]},
    { syz:"Γ΄ συζυγία", rows:[
      { pres:"alo", perf:"alui", sup:"alitum / altum", inf:"alĕre", note:"" },
      { pres:"nascor", perf:"natus sum", sup:"(natum)", inf:"nasci", note:"αποθετικό· μτχ. μέλλ. nasciturus" },
      { pres:"credo", perf:"credidi", sup:"creditum", inf:"credĕre", note:"" },
      { pres:"sequor", perf:"secutus sum", sup:"(secutum)", inf:"sequi", note:"αποθετικό" },
      { pres:"animadverto", perf:"animadverti", sup:"animadversum", inf:"animadvertĕre", note:"in aliquem = τιμωρώ" },
      { pres:"dico", perf:"dixi", sup:"dictum", inf:"dicĕre", note:"προστ. dic" },
      { pres:"intellego / intelligo", perf:"intellexi", sup:"intellectum", inf:"intellegĕre", note:"" },
      { pres:"intendo", perf:"intendi", sup:"intentum / intensum", inf:"intendĕre", note:"< in + tendo· διπλό σουπίνο" }
    ]},
    { syz:"Δ΄ συζυγία", rows:[
      { pres:"pervenio", perf:"perveni", sup:"perventum", inf:"pervenīre", note:"< per + venio" }
    ]},
    { syz:"Ανώμαλα ρήματα", rows:[
      { pres:"sum", perf:"fui", sup:"—", inf:"esse", note:"βοηθητικό (fore = futurum esse)" },
      { pres:"fio", perf:"factus sum", sup:"—", inf:"fieri", note:"= γίνομαι· παθ. του facio (απλού)" }
    ]}
  ],

  // ── ΜΕΡΟΣ 7: SOS — ΠΑΓΙΔΕΣ / ΠΑΡΑΤΗΡΗΣΕΙΣ ΣΥΝΤΑΞΗΣ ───────────────────────
  sos: [
    { tag:"Δευτ. πρόταση", title:"Αναφορικές-συμπερασματικές (qui non = ut non is)", body:"Το κείμενο έχει τέσσερις: «qui … non videant», «(qui) … dissimulent», «qui non videat», «qui non fateatur». Είναι δευτ. επιρρ. αναφορικές συμπερασματικές — εισάγονται με qui (αρνητικές: qui non = ut non is), προεξαγγέλλονται από nonnulli / tam και εκφέρονται με υποτακτική (το αποτέλεσμα στη λατινική = υποκειμενική κατάσταση). Παρουσιάζουν ιδιομορφία στην ακολουθία των χρόνων (συγχρονισμός κύριας–δευτ.)." },
    { tag:"Αναφορικά", title:"qui / quorum στην αρχή περιόδου = δεικτικά", body:"«qui spem Catilinae … aluerunt» και «quorum auctoritatem secuti …»: η αναφορική αντωνυμία στην αρχή περιόδου, μετά από ισχυρή στίξη (: ;), ισοδυναμεί με δεικτική (qui = ei / ii / i· quorum = eorum) και εισάγει ΚΥΡΙΑ πρόταση, όχι δευτ. αναφορική." },
    { tag:"Υποθ. λόγοι", title:"Δύο διαφορετικοί υποθετικοί λόγοι", body:"«si in hunc animadvertissem … dicerent» = μεικτός υποθετικός λόγος β΄ είδους (υπόθεση στο παρελθόν, απόδοση στο παρόν — αντίθετος προς την πραγματικότητα). «si iste … pervenerit … neminem fore» = εξαρτημένος / σε πλάγιο λόγο (α΄ είδος — ανοιχτή για το μέλλον)· η απόδοση βρίσκεται στα απαρέμφατα fore, γι' αυτό η υπόθεση εκφέρεται με υποτακτική (pervenerit)." },
    { tag:"Μετοχές", title:"nascentem & secuti", body:"«nascentem» = επιθετική (συνημμένη) ή επιρρ. χρονική μετοχή ενεστ. (σύγχρονο), με υποκ. coniurationem. «secuti» = επιρρ. τροπική ή αιτιολογική μετοχή παρακ. (προτερόχρονο), με υποκ. multi. Και οι δύο ανήκουν σε αποθετικά ρήματα (nascor, sequor) — άρα ενεργητικής διάθεσης." },
    { tag:"Γερούνδιο", title:"non credendo (αφαιρετική του τρόπου)", body:"«coniurationem … non credendo confirmaverunt»: το credendo είναι αφαιρετική γερουνδίου (οργανική) που δηλώνει τρόπο στο confirmaverunt· εννοείται ως αντικείμενό του το ειδικό απαρέμφατο (eam) nasci." },
    { tag:"Απαρέμφατα", title:"Ετεροπροσωπία στα ειδικά απαρέμφατα", body:"«id factum esse» (υποκ. id), «neminem … fore» (υποκ. neminem), «coniurationem esse factam» (υποκ. coniurationem): τα ειδικά απαρέμφατα έχουν υποκείμενο σε αιτιατική διαφορετικό από το υποκ. του ρήματος εξάρτησης (ετεροπροσωπία). Το fore = futurum esse (απαρ. μέλλ. του sum)." }
  ],

  // ── ΜΕΡΟΣ 8: ΜΕΤΑΤΡΟΠΕΣ (Συντακτική επεξεργασία κειμένου) ─────────────────
  transforms: [
    { id:"Α", label:"Ανάλυση των μετοχών σε δευτερεύουσες προτάσεις", items:[
      { from:"nascentem (επιθετική ή επιρρ. χρονική μτχ. ενεστ.)",
        to:["Επιθετική → quae nascebatur (quae + οριστ. παρατ.· εξάρτ. από ιστ. χρόνο confirmaverunt)",
            "Χρονική → dum nascitur (dum + οριστ. ενεστ.· σύγχρονο–συνεχιζόμενη πράξη)",
            "Χρονική → cum nasceretur (cum ιστορικός + υποτ. παρατ.· εξάρτ. από ιστ. χρόνο confirmaverunt)"],
        note:"Δηλώνει το σύγχρονο." },
      { from:"secuti (επιρρ. τροπική ή αιτιολογική μτχ. παρακ.)",
        to:["Τροπική → δεν αναλύεται",
            "Αιτιολογική → quod / quia / quoniam secuti erant (+ οριστ. υπερσ.· αντικειμενική αιτία)",
            "Αιτιολογική → quod / quia / quoniam secuti essent (+ υποτ. υπερσ.· υποκειμενική/υποθετική αιτία)",
            "Αιτιολογική → cum secuti essent (cum αιτιολογικός + υποτ. υπερσ.· εσωτερική λογική διεργασία)"],
        note:"Δηλώνει το προτερόχρονο· εξάρτηση από ιστ. χρόνο dicerent." }
    ]},
    { id:"Β", label:"Μετατροπή δευτερεύουσας πρότασης σε μετοχή", items:[
      { from:"…, ea, quae imminent, …",
        to:"…, ea imminentia, …",
        note:"Η αναφορική → επιθετική (συνημμένη) μετοχή, με υποκ. τον όρο ea." }
    ]},
    { id:"Γ", label:"Μετατροπή κύριας πρότασης σε μετοχική φράση", items:[
      { from:"qui spem Catilinae mollibus sententiis aluerunt coniurationemque nascentem non credendo confirmaverunt;",
        to:"qui spe Catilinae mollibus sententiis alitā (altā) coniurationemque nascentem non credendo confirmaverunt",
        note:"Η α΄ κύρια → επιρρ. χρονική μετοχή σε νόθη αφαιρετική απόλυτη (το εννοούμενο ποιητικό αίτιο a quibus = ab eis ταυτίζεται με το υποκ. qui = ei του confirmaverunt)." }
    ]},
    { id:"Δ", label:"Μετατροπή της ενεργητικής σύνταξης σε παθητική", items:[
      { from:"qui spem Catilinae mollibus sententiis aluerunt coniurationemque nascentem non credendo confirmaverunt;",
        to:"a quibus spes Catilinae mollibus sententiis alita (alta) est coniuratioque nascens non credendo confirmata est",
        note:"ή: spes Catilinae mollibus sententiis ab eis alta (alita) est coniuratioque nascens non credendo (ab eis) confirmata est." },
      { from:"Nunc intellego, …",
        to:"Nunc intellegitur a me, …" }
    ]},
    { id:"Ε", label:"Μετατροπή της παθητικής σύνταξης σε ενεργητική", items:[
      { from:"…, qui non videat coniurationem esse factam, …",
        to:"…, qui non videat Catilinam coniurationem (αντικ.) fecisse, …" }
    ]},
    { id:"ΣΤ", label:"Μετατροπή των υποθετικών λόγων στα άλλα είδη", items:[
      { from:"1. si in hunc animadvertissem, … id factum esse dicerent (μεικτός β΄ είδους — αντίθετος προς την πραγματικότητα)",
        to:["Α΄ είδος (παρόν): si in hunc animadverto, … id factum esse dicunt",
            "Α΄ είδος (παρελθόν): si in hunc animadverti, … dixerunt / dixere",
            "Α΄ είδος (μέλλον): si in hunc animadvertam (animadvertero), … dicent",
            "Β΄ είδος (παρόν): si in hunc animadverterem, … dicerent",
            "Β΄ είδος (παρελθόν): si in hunc animadvertissem, … dixissent",
            "Γ΄ είδος (παρόν–μέλλον): si in hunc animadvertam, … dicant"],
        note:"Απόδοση: crudeliter et regie id factum esse + ο αντίστοιχος ρηματικός τύπος." },
      { from:"2. si iste in Manliana castra pervenerit, neminem tam stultum fore, neminem tam improbum (fore) (εξαρτημένος / σε πλάγιο λόγο — α΄ είδους, ανοιχτή για το μέλλον)",
        to:["Ευθύς λόγος: si … pervenerit (οριστ. συντ. μέλλ.), nemo tam stultus erit, nemo tam improbus (erit)",
            "Α΄ είδος (παρόν): si … pervenit, nemo tam stultus est, nemo tam improbus (est)",
            "Α΄ είδος (παρελθόν): si … pervenit, nemo tam stultus fuit, nemo tam improbus (fuit)",
            "Α΄ είδος (μέλλον): si … perveniet (pervenerit), nemo tam stultus erit …",
            "Β΄ είδος (παρόν): si … perveniret, nemo tam stultus esset …",
            "Β΄ είδος (παρελθόν): si … pervenisset, nemo tam stultus fuisset …",
            "Γ΄ είδος (παρόν–μέλλον): si … perveniat, nemo tam stultus sit …"] }
    ]},
    { id:"Ζ", label:"Μετατροπή των αναφορικών-συμπερασματικών σε απλές συμπερασματικές", items:[
      { from:"qui aut ea, – , non videant", to:"ut ei / ii / i aut ea non videant" },
      { from:"(qui) aut ea, – , dissimulent", to:"ut ei / ii / i aut ea dissimulent" },
      { from:"qui non videat coniurationem esse factam", to:"ut is non videat coniurationem esse factam" },
      { from:"qui non fateatur", to:"ut is non fateatur" }
    ]},
    { id:"Η", label:"Μετατροπή του κειμένου σε πλάγιο λόγο", items:[
      { from:"(εξάρτ.: Cicero putat / putabat) Nonnulli sunt in hoc ordine, qui … non videant, … dissimulent: qui … aluerunt … confirmaverunt;",
        to:"nonnullos esse in illo ordine, qui aut ea, quae immineant / imminerent, non videant / viderent, aut ea, quae videant / viderent, dissimulent / dissimularent: eos spem Catilinae mollibus sententiis aluisse coniurationemque nascentem non credendo confirmavisse." },
      { from:"(εξάρτ.: Cicero dicit / dixit patribus) quorum auctoritatem secuti multi … dicerent. Nunc intellego …",
        to:"eorum auctoritatem secutos multos, non solum improbos verum etiam imperitos, si in illum animadvertisset, crudeliter et regie id factum esse dicturos esse; tunc se intellegere, si iste in Manliana castra pervenerit / pervenisset, quo intendit / intendebat, neminem tam stultum fore, qui non videat / videret coniurationem esse factam, neminem tam improbum, qui non fateatur / fateretur.",
        note:"Η υποτ. παρατ. dicerent → απαρ. ενεστ. ενεργ. περιφρ. συζυγίας (dicturos esse). Η οριστ. intendit διατηρείται (λειτουργεί ανεξάρτητα από τον πλάγιο λόγο)." }
    ]},
    { id:"Θ", label:"Μετατροπή του πλάγιου λόγου σε ευθύ", items:[
      { from:"… crudeliter et regie id factum esse dicerent",
        to:"crudeliter et regie id (ονομ.) factum est." },
      { from:"Nunc intellego, si iste … pervenerit, quo intendit, neminem tam stultum fore, qui non videat …, neminem tam improbum, qui non fateatur",
        to:"Si iste in Manliana castra pervenerit (οριστ. συντ. μέλλ.), quo intendit, nemo tam stultus erit, qui non videat coniurationem esse factam, nemo tam improbus, qui non fateatur." }
    ]}
  ],

  // ── ΜΕΡΟΣ 9: ΕΤΥΜΟΛΟΓΙΚΑ (Λεξιλογικός κόσμος) ────────────────────────────
  etymology: [
    { la:"nonnulli [< non + nullus]", el:"νούλα [< ιταλ. nulla (= μηδενικό, χωρίς αξία)]" },
    { la:"sunt, esse [< sum]", el:"εἰμί" },
    { la:"ordine [< ordo]", el:"(αγγλ.) order (= διαταγή) // (γαλλ.) ordinaire (= συνήθης), ordre (= τάξη)" },
    { la:"imminent [< im-mineo]", el:"μένος, μανία" },
    { la:"videant, vident, videat [< video]", el:"(Ϝιδεῖν) ιδέα, βίντεο (< αγγλ.)" },
    { la:"dis-simulent [< dis-simulo]", el:"(αγγλ.) similar (= όμοιος) // (γαλλ.) similarité (= ομοιότητα)" },
    { la:"spem [< spes]", el:"(γαλλ.) espoir (= ελπίδα), espérer (= ελπίζω) // Σπεράντζα" },
    { la:"Catilīnae", el:"Κατιλίνας" },
    { la:"mollibus [< mollis]", el:"(γαλλ.) ra-mollir (= μαλακώνω)" },
    { la:"sententiis [< sentio]", el:"(αγγλ.) sentence (= απόφαση)" },
    { la:"aluērunt [< alo]", el:"ἀλ-δαίνω (= ενδυναμώνω, αυξάνω) // (γαλλ.) alourdir (= βαραίνω)" },
    { la:"con-iurationem [< coniuro < cum + ius]", el:"(γαλλ.) justice (= δικαιοσύνη), juste (= δίκαιος)" },
    { la:"nascentem [< nascor]", el:"γί-γνο-μαι, γνήσιος // (γαλλ.) nature (= φύση), naturel· νατουραλισμός" },
    { la:"credendo [< credo]", el:"(αγγλ.) credible (= πιστευτός), αντιθ. incredible" },
    { la:"con-firmavērunt [< confirmo]", el:"(γαλλ.) confirmer (= επιβεβαιώνω) // φίρμα (< ιταλ.)" },
    { la:"auctoritātem [< augeo]", el:"αυξάνω - αύξω // (αγγλ.) authoritative (= έγκυρος, έγκριτος)" },
    { la:"secūti [< sequor]", el:"ἕπομαι // (αγγλ.) sequent (= ακόλουθος) // (γαλλ.) seconde (= δευτερόλεπτο)· σεκόντο (< ιταλ.)" },
    { la:"multi", el:"μάλα (= πολύ)" },
    { la:"solum", el:"σόλο (< ιταλ.), σολίστ(ας) // (γαλλ.) solitude (= μοναξιά)" },
    { la:"im-probi, im-probum", el:"(αγγλ.) probity (= χρηστότητα, ακεραιότητα)" },
    { la:"im-perīti", el:"πείρα, πειρατής· άπειρος, απειρία // εξπέρ [< γαλλ. expert (= ειδικός)]" },
    { la:"anim-ad-vertissem", el:"(verso) βέρσο (= πίσω μέρος σελίδας), ρεβέρ (< γαλλ.), v.s. (= εναντίον) // ανιμισμός (< γαλλ.), άνεμος" },
    { la:"crudeliter [< crudelis < crudus < cruor]", el:"κρέας" },
    { la:"regie", el:"ρήγας" },
    { la:"factum, factam [< facio]", el:"(αγγλ.) facts (= γεγονότα), factory (= εργοστάσιο)" },
    { la:"dicerent, dicit [< dico]", el:"δείκ-νυμι (= δείχνω) // (γαλλ.) dictionnaire (= λεξικό), dictée (= υπαγόρευση)" },
    { la:"nunc", el:"νῦν" },
    { la:"intellego", el:"(γαλλ.) intelligent (= ευφυής)" },
    { la:"Manliāna", el:"Μάνλιος" },
    { la:"castra", el:"κάστρο" },
    { la:"per-vēnerit [< per + venio]", el:"βαίνω // (γαλλ.) parvenir (= φθάνω), avenue (= λεωφόρος)" },
    { la:"in-tendit [< in + tendo]", el:"τείνω, τένων (= τένοντας) // (γαλλ.) étendre (= τείνω), tendu (= τεντωμένος)" },
    { la:"neminem [< nemo < ne + homo]", el:"ουμανισμός (< γαλλ.)" },
    { la:"stultum", el:"(αγγλ.) stultify (= μωραίνω)" },
    { la:"fateātur [< fateor]", el:"φημί, φάσκω, φατός, φάτις" }
  ]
};

export default UNIT;
