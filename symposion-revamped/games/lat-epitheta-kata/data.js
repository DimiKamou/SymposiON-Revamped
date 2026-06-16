'use strict';
// ════════════════════════════════════════════════════════════════════════════
//  ΕΠΙΘΕΤΑ ΑΝΑ ΚΕΙΜΕΝΟ — Latin adjectives grouped by school text (κείμενα 3–45)
//  Source: school adjective list (λατινικά – επίθετα).
//
//  Two exercises feed off this DB:
//    1) ΚΛΙΣΗ ΕΠΙΘΕΤΩΝ      — decline an adjective (m/f/n · sg/pl · 6 πτώσεις)
//    2) ΠΑΡΑΘΕΤΙΚΑ          — (a) σχηματισμός συγκριτικού/υπερθετικού
//                              (b) κλίση των παραθετικών
//
//  Cases order: [0]=Ονομαστική [1]=Γενική [2]=Δοτική [3]=Αιτιατική
//               [4]=Κλητική    [5]=Αφαιρετική
//
//  Each raw entry carries:
//    l     display lemma (π.χ. 'bonus, -a, -um')
//    nom   ονομ. αρσενικού (π.χ. 'bonus','pulcher','omnis','ferox')
//    stem  θέμα κλίσης      (π.χ. 'bon','pulchr','omn','feroc')
//    sub   τύπος κλίσης     ('2us'|'2er'|'3two'|'3three'|'3one')
//    m     σημασία          (greek)
//    texts [κείμενα]
//  Παραθετικά:
//    Τα ομαλά παράγονται αυτόματα (_latekDegrees). Για ανώμαλα/ιδιαίτερα
//    δίνονται ρητά: comp (ονομ. αρσ. συγκριτικού) & superl (ονομ. αρσ. υπερθ.).
//    noDeg:true  → δε σχηματίζει παραθετικά (κύρια/αριθμητικά/υλικά/ελλειπτικά)
//    degNote     → προαιρετική σημείωση (π.χ. «υπερθετικός του propior»)
//  Σημ.: οι χαρακτηρισμοί noDeg είναι παιδαγωγικές επιλογές — ο/η εκπαιδευτικός
//        μπορεί να τους προσαρμόσει.
// ════════════════════════════════════════════════════════════════════════════

const LATEK_CASES    = ['Ονομαστική','Γενική','Δοτική','Αιτιατική','Κλητική','Αφαιρετική'];
const LATEK_CASES_EN = ['Nominative','Genitive','Dative','Accusative','Vocative','Ablative'];
const LATEK_GEND     = { αρσενικό:'αρσ.', θηλυκό:'θηλ.', ουδέτερο:'ουδ.' };
const LATEK_GEND_AB  = { αρσενικό:'m.', θηλυκό:'f.', ουδέτερο:'n.' };
const LATEK_SUB_LBL  = {
  '2us':'Β΄ Κλίση (-us/-a/-um)', '2er':'Β΄ Κλίση (-er)',
  '3two':'Γ΄ Κλίση δικατάληκτα (-is/-e)', '3three':'Γ΄ Κλίση τρικατάληκτα (-er)',
  '3one':'Γ΄ Κλίση μονοκατάληκτα',
};

// ── decliner: ALL THREE genders for a positive-degree adjective ──────────────
//  returns { m:{s,p}, f:{s,p}, n:{s,p} }
function _latekDecline(sub, nom, stem) {
  if (sub === '2us') return {
    m:{ s:[stem+'us',stem+'i',stem+'o',stem+'um',stem+'e',stem+'o'],
        p:[stem+'i',stem+'orum',stem+'is',stem+'os',stem+'i',stem+'is'] },
    f:{ s:[stem+'a',stem+'ae',stem+'ae',stem+'am',stem+'a',stem+'a'],
        p:[stem+'ae',stem+'arum',stem+'is',stem+'as',stem+'ae',stem+'is'] },
    n:{ s:[stem+'um',stem+'i',stem+'o',stem+'um',stem+'um',stem+'o'],
        p:[stem+'a',stem+'orum',stem+'is',stem+'a',stem+'a',stem+'is'] },
  };
  if (sub === '2er') return {                         // masc nom = lemma, voc = nom
    m:{ s:[nom,stem+'i',stem+'o',stem+'um',nom,stem+'o'],
        p:[stem+'i',stem+'orum',stem+'is',stem+'os',stem+'i',stem+'is'] },
    f:{ s:[stem+'a',stem+'ae',stem+'ae',stem+'am',stem+'a',stem+'a'],
        p:[stem+'ae',stem+'arum',stem+'is',stem+'as',stem+'ae',stem+'is'] },
    n:{ s:[stem+'um',stem+'i',stem+'o',stem+'um',stem+'um',stem+'o'],
        p:[stem+'a',stem+'orum',stem+'is',stem+'a',stem+'a',stem+'is'] },
  };
  if (sub === '3two') {                                // -is (m/f) · -e (n), i-stem
    const mf = { s:[stem+'is',stem+'is',stem+'i',stem+'em',stem+'is',stem+'i'],
                 p:[stem+'es',stem+'ium',stem+'ibus',[stem+'es',stem+'is'],stem+'es',stem+'ibus'] };
    return { m:mf, f:mf,
      n:{ s:[stem+'e',stem+'is',stem+'i',stem+'e',stem+'e',stem+'i'],
          p:[stem+'ia',stem+'ium',stem+'ibus',stem+'ia',stem+'ia',stem+'ibus'] } };
  }
  if (sub === '3three') return {                       // m -er · f -ris · n -re
    m:{ s:[nom,stem+'is',stem+'i',stem+'em',nom,stem+'i'],
        p:[stem+'es',stem+'ium',stem+'ibus',[stem+'es',stem+'is'],stem+'es',stem+'ibus'] },
    f:{ s:[stem+'is',stem+'is',stem+'i',stem+'em',stem+'is',stem+'i'],
        p:[stem+'es',stem+'ium',stem+'ibus',[stem+'es',stem+'is'],stem+'es',stem+'ibus'] },
    n:{ s:[stem+'e',stem+'is',stem+'i',stem+'e',stem+'e',stem+'i'],
        p:[stem+'ia',stem+'ium',stem+'ibus',stem+'ia',stem+'ia',stem+'ibus'] },
  };
  if (sub === '3one') {                                // ένα γένος-τύπος για όλα
    const mf = { s:[nom,stem+'is',stem+'i',stem+'em',nom,stem+'i'],
                 p:[stem+'es',stem+'ium',stem+'ibus',[stem+'es',stem+'is'],stem+'es',stem+'ibus'] };
    return { m:mf, f:mf,
      n:{ s:[nom,stem+'is',stem+'i',nom,nom,stem+'i'],
          p:[stem+'ia',stem+'ium',stem+'ibus',stem+'ia',stem+'ia',stem+'ibus'] } };
  }
  const dash = ['-','-','-','-','-','-'];
  return { m:{s:dash,p:dash}, f:{s:dash,p:dash}, n:{s:dash,p:dash} };
}

// ── decliner: COMPARATIVE (-ior/-ius) — τριτόκλιτο συμφωνόληκτο, ΟΧΙ i-stem ──
//  works for regular (clarior) and irregular (maior, minor, melior, peior)
function _latekDeclineComp(mascNom) {
  const r = end => mascNom.replace(/or$/, end);
  const mf = { s:[mascNom, r('oris'), r('ori'), r('orem'), mascNom, r('ore')],
               p:[r('ores'), r('orum'), r('oribus'), r('ores'), r('ores'), r('oribus')] };
  const neut = mascNom.replace(/or$/, 'us');           // clarior→clarius, maior→maius, minor→minus
  return { m:mf, f:mf,
    n:{ s:[neut, r('oris'), r('ori'), neut, neut, r('ore')],
        p:[r('ora'), r('orum'), r('oribus'), r('ora'), r('ora'), r('oribus')] } };
}
// plus — ιδιόμορφος συγκριτικός του multus (ουδ. εν. ουσιαστικοποιημένο)
const _LATEK_PLUS = {
  m:{ s:['-','-','-','-','-','-'], p:['plures','plurium','pluribus',['plures','pluris'],'plures','pluribus'] },
  f:{ s:['-','-','-','-','-','-'], p:['plures','plurium','pluribus',['plures','pluris'],'plures','pluribus'] },
  n:{ s:['plus','pluris','-','plus','-','-'], p:['plura','plurium','pluribus','plura','plura','pluribus'] },
};

// ── decliner: SUPERLATIVE (-issimus/-rimus/-limus) — όπως bonus (Β΄/Α΄) ───────
function _latekDeclineSuperl(mascNom) {
  return _latekDecline('2us', mascNom, mascNom.replace(/us$/, ''));
}

// ── auto-build degree lemmas (ομαλά) με δυνατότητα override (ανώμαλα) ─────────
const _LATEK_LIMUS = ['facilis','difficilis','similis','dissimilis','gracilis','humilis'];
function _latekDegrees(e) {
  if (e.noDeg) return { comp:null, superl:null };
  let comp = e.comp || (e.stem + 'ior');
  let superl;
  if (e.noSuperl)      superl = null;                                            // alacer (χωρίς υπερθ.)
  else if (e.superl)   superl = e.superl;                                        // ρητό (ανώμαλο/ιδιαίτερο)
  else if (e.sub === '2er' || e.sub === '3three') superl = e.nom + 'rimus';      // pulcher→pulcherrimus
  else if (_LATEK_LIMUS.includes(e.nom))          superl = e.stem + 'limus';     // facilis→facillimus
  else                                            superl = e.stem + 'issimus';   // clarus→clarissimus
  return { comp, superl };
}

// ── raw entries ──────────────────────────────────────────────────────────────
const LATEK_RAW = [

  // ═══════════ Β΄ ΚΛΙΣΗ — τρικατάληκτα -us/-a/-um ═══════════
  { l:'acerbus, -a, -um',  nom:'acerbus',  stem:'acerb',  sub:'2us', m:'πικρός, σκληρός',          texts:[27] },
  { l:'aequus, -a, -um',   nom:'aequus',   stem:'aequ',   sub:'2us', m:'ίσος, δίκαιος',            texts:[21] },
  { l:'bonus, -a, -um',    nom:'bonus',    stem:'bon',    sub:'2us', m:'καλός',                    texts:[6,27], comp:'melior', superl:'optimus' },
  { l:'captivus, -a, -um', nom:'captivus', stem:'captiv', sub:'2us', m:'αιχμάλωτος',               texts:[43,45], noDeg:true, degNote:'δηλώνει κατάσταση' },
  { l:'clarus, -a, -um',   nom:'clarus',   stem:'clar',   sub:'2us', m:'λαμπρός, ένδοξος',         texts:[5,34] },
  { l:'cupidus, -a, -um',  nom:'cupidus',  stem:'cupid',  sub:'2us', m:'αυτός που επιθυμεί',       texts:[29] },
  { l:'durus, -a, -um',    nom:'durus',    stem:'dur',    sub:'2us', m:'σκληρός',                  texts:[27] },
  { l:'epicus, -a, -um',   nom:'epicus',   stem:'epic',   sub:'2us', m:'επικός',                   texts:[5], noDeg:true, degNote:'σχέσης/είδους' },
  { l:'fidus, -a, -um',    nom:'fidus',    stem:'fid',    sub:'2us', m:'πιστός',                   texts:[44] },
  { l:'frigidus, -a, -um', nom:'frigidus', stem:'frigid', sub:'2us', m:'κρύος, ψυχρός',            texts:[15] },
  { l:'horrendus, -a, -um',nom:'horrendus',stem:'horrend',sub:'2us', m:'φρικτός',                  texts:[14], noDeg:true, degNote:'γερουνδιακό' },
  { l:'immaturus, -a, -um',nom:'immaturus',stem:'immatur',sub:'2us', m:'πρόωρος',                  texts:[43] },
  { l:'immensus, -a, -um', nom:'immensus', stem:'immens', sub:'2us', m:'αμέτρητος, απέραντος',     texts:[21], noDeg:true, degNote:'απόλυτη έννοια' },
  { l:'imperitus, -a, -um',nom:'imperitus',stem:'imperit',sub:'2us', m:'άπειρος',                  texts:[42] },
  { l:'improbus, -a, -um', nom:'improbus', stem:'improb', sub:'2us', m:'αχρείος, πονηρός',         texts:[42] },
  { l:'ineptus, -a, -um',  nom:'ineptus',  stem:'inept',  sub:'2us', m:'ανόητος, ανάρμοστος',      texts:[36] },
  { l:'infestus, -a, -um', nom:'infestus', stem:'infest', sub:'2us', m:'εχθρικός, επικίνδυνος',    texts:[43] },
  { l:'infidus, -a, -um',  nom:'infidus',  stem:'infid',  sub:'2us', m:'άπιστος',                  texts:[44], noDeg:true, degNote:'δηλώνει ιδιότητα' },
  { l:'iucundus, -a, -um', nom:'iucundus', stem:'iucund', sub:'2us', m:'ευχάριστος',               texts:[27] },
  { l:'ligneus, -a, -um',  nom:'ligneus',  stem:'ligne',  sub:'2us', m:'ξύλινος',                  texts:[36], noDeg:true, degNote:'υλικού' },
  { l:'longus, -a, -um',   nom:'longus',   stem:'long',   sub:'2us', m:'μακρύς',                   texts:[43] },
  { l:'magnus, -a, -um',   nom:'magnus',   stem:'magn',   sub:'2us', m:'μεγάλος',                  texts:[36], comp:'maior', superl:'maximus' },
  { l:'marinus, -a, -um',  nom:'marinus',  stem:'marin',  sub:'2us', m:'θαλάσσιος',                texts:[3], noDeg:true, degNote:'σχέσης' },
  { l:'maturus, -a, -um',  nom:'maturus',  stem:'matur',  sub:'2us', m:'ώριμος',                   texts:[27] },
  { l:'multi, -ae, -a',    nom:'multus',   stem:'mult',   sub:'2us', m:'πολλοί',                   texts:[5,7,42], comp:'plus', superl:'plurimus', degNote:'συγκρ. plus (ουδ. εν.) / plures (πληθ.)' },
  { l:'nimius, -a, -um',   nom:'nimius',   stem:'nimi',   sub:'2us', m:'υπερβολικός',              texts:[25], comp:'magis nimius', superl:'maxime nimius', peri:true, degNote:'περιφραστικά (φωνήεν πριν το -us)' },
  { l:'obvius, -a, -um',   nom:'obvius',   stem:'obvi',   sub:'2us', m:'αυτός που βρίσκεται μπροστά', texts:[20], noDeg:true },
  { l:'parvus, -a, -um',   nom:'parvus',   stem:'parv',   sub:'2us', m:'μικρός',                   texts:[27], comp:'minor', superl:'minimus' },
  { l:'paucus, -a, -um',   nom:'paucus',   stem:'pauc',   sub:'2us', m:'λίγος (συν. πληθ. pauci)', texts:[14,24], comp:'paucior', superl:'paucissimus', degNote:'κυρίως πληθ.: pauci → pauciores → paucissimi' },
  { l:'paulus, -a, -um',   nom:'paulus',   stem:'paul',   sub:'2us', m:'μικρός, λίγος',            texts:[31], noDeg:true, degNote:'ελλειπτικό' },
  { l:'pavidus, -a, -um',  nom:'pavidus',  stem:'pavid',  sub:'2us', m:'έντρομος',                 texts:[11] },
  { l:'pennatus, -a, -um', nom:'pennatus', stem:'pennat', sub:'2us', m:'φτερωτός',                 texts:[3], noDeg:true, degNote:'υλικού/ιδιότητας' },
  { l:'repentinus, -a, -um',nom:'repentinus',stem:'repentin',sub:'2us', m:'ξαφνικός',              texts:[13], noDeg:true },
  { l:'salvus, -a, -um',   nom:'salvus',   stem:'salv',   sub:'2us', m:'σώος, ασφαλής',            texts:[38], noDeg:true, degNote:'απόλυτη έννοια' },
  { l:'sanctus, -a, -um',  nom:'sanctus',  stem:'sanct',  sub:'2us', m:'ιερός, σεβαστός',          texts:[34] },
  { l:'secundus, -a, -um', nom:'secundus', stem:'secund', sub:'2us', m:'δεύτερος· ευνοϊκός',       texts:[5], noDeg:true, degNote:'τακτικό αριθμητικό' },
  { l:'serenus, -a, -um',  nom:'serenus',  stem:'seren',  sub:'2us', m:'αίθριος, γαλήνιος',        texts:[13], noDeg:true, degNote:'τέλεια/απόλυτη έννοια' },
  { l:'sollicitus, -a, -um',nom:'sollicitus',stem:'sollicit',sub:'2us', m:'ανήσυχος',              texts:[14,44] },
  { l:'sonorus, -a, -um',  nom:'sonorus',  stem:'sonor',  sub:'2us', m:'ηχηρός',                   texts:[27], noDeg:true, degNote:'από ουσιαστικό (sonor)' },
  { l:'squalidus, -a, -um',nom:'squalidus',stem:'squalid',sub:'2us', m:'βρόμικος, ρυπαρός',        texts:[14] },
  { l:'stultus, -a, -um',  nom:'stultus',  stem:'stult',  sub:'2us', m:'ανόητος, κουτός',          texts:[42] },
  { l:'superbus, -a, -um', nom:'superbus', stem:'superb', sub:'2us', m:'υπερήφανος, αλαζονικός',   texts:[3] },
  { l:'supervacaneus, -a, -um',nom:'supervacaneus',stem:'supervacane',sub:'2us', m:'περιττός',     texts:[36], noDeg:true },
  { l:'trepidus, -a, -um', nom:'trepidus', stem:'trepid', sub:'2us', m:'έντρομος, ταραγμένος',     texts:[20] },
  { l:'vietus, -a, -um',   nom:'vietus',   stem:'viet',   sub:'2us', m:'μαραμένος, ζαρωμένος',     texts:[27], noDeg:true, degNote:'ελλειπτικό' },
  // ανώμαλα/ελλειπτικά -us με ιδιαίτερα παραθετικά
  { l:'exterus, -a, -um',  nom:'exterus',  stem:'exter',  sub:'2us', m:'εξωτερικός',               texts:[25], comp:'exterior', superl:'extremus', degNote:'και extimus' },
  { l:'posterus, -a, -um', nom:'posterus', stem:'poster', sub:'2us', m:'επόμενος',                 texts:[20], comp:'posterior', superl:'postremus', degNote:'και postumus' },
  { l:'proximus, -a, -um', nom:'proximus', stem:'proxim', sub:'2us', m:'πλησιέστατος, επόμενος',   texts:[20], noDeg:true, degNote:'υπερθετικός (θετ. propior)' },
  { l:'ultimus, -a, -um',  nom:'ultimus',  stem:'ultim',  sub:'2us', m:'τελευταίος, έσχατος',      texts:[5], noDeg:true, degNote:'υπερθετικός (συγκρ. ulterior)' },
  { l:'quinquagesimus, -a, -um',nom:'quinquagesimus',stem:'quinquagesim',sub:'2us', m:'πεντηκοστός', texts:[20], noDeg:true, degNote:'τακτικό αριθμητικό' },
  { l:'regius, -a, -um',   nom:'regius',   stem:'regi',   sub:'2us', m:'βασιλικός',                texts:[3], noDeg:true, degNote:'σχέσης' },
  // κύρια επίθετα -us (δε σχηματίζουν παραθετικά)
  { l:'Actiacus, -a, -um', nom:'Actiacus', stem:'Actiac', sub:'2us', m:'Ακτιακός, του Ακτίου',     texts:[14,29], noDeg:true, degNote:'κύριο' },
  { l:'Falernus, -a, -um', nom:'Falernus', stem:'Falern', sub:'2us', m:'Φαλερνός',                 texts:[11], noDeg:true, degNote:'κύριο' },
  { l:'Latinus, -a, -um',  nom:'Latinus',  stem:'Latin',  sub:'2us', m:'Λατινικός',               texts:[31], noDeg:true, degNote:'κύριο' },
  { l:'Manlianus, -a, -um',nom:'Manlianus',stem:'Manlian',sub:'2us', m:'του Μανλίου',             texts:[42], noDeg:true, degNote:'κύριο' },
  { l:'Punicus, -a, -um',  nom:'Punicus',  stem:'Punic',  sub:'2us', m:'Καρχηδονιακός',           texts:[5,25], noDeg:true, degNote:'κύριο' },
  { l:'Romanus, -a, -um',  nom:'Romanus',  stem:'Roman',  sub:'2us', m:'Ρωμαϊκός',                texts:[11], noDeg:true, degNote:'κύριο' },

  // ═══════════ Β΄ ΚΛΙΣΗ — σε -er ═══════════
  { l:'dexter, -(e)ra, -(e)rum', nom:'dexter', stem:'dextr', sub:'2er', m:'δεξιός', texts:[34], comp:'dexterior', superl:'dextimus', degNote:'συγκρ. dexterior · υπερθ. dextimus' },
  { l:'liber, -era, -erum',  nom:'liber', stem:'liber', sub:'2er', m:'ελεύθερος',     texts:[6,43] },
  { l:'miser, -era, -erum',  nom:'miser', stem:'miser', sub:'2er', m:'δυστυχισμένος', texts:[38,43] },
  { l:'pulcher, -chra, -chrum', nom:'pulcher', stem:'pulchr', sub:'2er', m:'όμορφος', texts:[5] },
  { l:'tener, -era, -erum',  nom:'tener', stem:'tener', sub:'2er', m:'τρυφερός, απαλός', texts:[6] },

  // ═══════════ Γ΄ ΚΛΙΣΗ — δικατάληκτα -is/-e ═══════════
  { l:'civilis, -is, -e',   nom:'civilis', stem:'civil', sub:'3two', m:'πολιτικός',          texts:[38], noDeg:true, degNote:'σχέσης' },
  { l:'facilis, -is, -e',   nom:'facilis', stem:'facil', sub:'3two', m:'εύκολος',            texts:[36] },
  { l:'fortis, -is, -e',    nom:'fortis',  stem:'fort',  sub:'3two', m:'γενναίος, δυνατός',  texts:[31] },
  { l:'illustris, -is, -e', nom:'illustris',stem:'illustr',sub:'3two', m:'λαμπρός, ένδοξος', texts:[13] },
  { l:'immortalis, -is, -e',nom:'immortalis',stem:'immortal',sub:'3two', m:'αθάνατος',       texts:[34], noDeg:true, degNote:'απόλυτη έννοια' },
  { l:'incredibilis, -is, -e',nom:'incredibilis',stem:'incredibil',sub:'3two', m:'απίστευτος', texts:[34] },
  { l:'liberalis, -is, -e', nom:'liberalis',stem:'liberal',sub:'3two', m:'γενναιόδωρος',     texts:[13] },
  { l:'mirabilis, -is, -e', nom:'mirabilis',stem:'mirabil',sub:'3two', m:'θαυμαστός',        texts:[20] },
  { l:'mollis, -is, -e',    nom:'mollis',  stem:'moll',  sub:'3two', m:'μαλακός',            texts:[42] },
  { l:'nobilis, -is, -e',   nom:'nobilis', stem:'nobil', sub:'3two', m:'ευγενής, ξακουστός', texts:[31] },
  { l:'omnis, -is, -e',     nom:'omnis',   stem:'omn',   sub:'3two', m:'κάθε, όλος',         texts:[6,7,11,15,21,25,31,38,44], noDeg:true, degNote:'καθολική έννοια' },
  { l:'similis, -is, -e',   nom:'similis', stem:'simil', sub:'3two', m:'όμοιος',             texts:[14] },
  { l:'singularis, -is, -e',nom:'singularis',stem:'singular',sub:'3two', m:'μοναδικός',      texts:[31], noDeg:true, degNote:'απόλυτη έννοια' },
  { l:'stabilis, -is, -e',  nom:'stabilis',stem:'stabil',sub:'3two', m:'σταθερός',           texts:[44] },
  { l:'tristis, -is, -e',   nom:'tristis', stem:'trist', sub:'3two', m:'λυπημένος, θλιβερός', texts:[20] },
  { l:'turpis, -is, -e',    nom:'turpis',  stem:'turp',  sub:'3two', m:'αισχρός, άσχημος',   texts:[15] },
  // κύρια/εθνικά δικατάληκτα (χωρίς παραθετικά)
  { l:'Cannensis, -is, -e', nom:'Cannensis',stem:'Cannens',sub:'3two', m:'της Κάννης',       texts:[11], noDeg:true, degNote:'κύριο' },
  { l:'Carthagiensis, -is, -e',nom:'Carthagiensis',stem:'Carthagiens',sub:'3two', m:'της Καρχηδόνας', texts:[11], noDeg:true, degNote:'κύριο' },
  { l:'Parmenis, -is, -e',  nom:'Parmenis',stem:'Parmen',sub:'3two', m:'(κύριο επίθετο)',    texts:[14], noDeg:true, degNote:'κύριο' },

  // ═══════════ Γ΄ ΚΛΙΣΗ — τρικατάληκτα -er/-ris/-re ═══════════
  { l:'alacer, -cris, -cre',  nom:'alacer',  stem:'alacr',  sub:'3three', m:'ζωηρός, πρόθυμος', texts:[13], noSuperl:true, degNote:'χωρίς υπερθετικό' },
  { l:'equester, -stris, -stre',nom:'equester',stem:'equestr',sub:'3three', m:'ιππικός',        texts:[15], noDeg:true, degNote:'σχέσης' },

  // ═══════════ Γ΄ ΚΛΙΣΗ — μονοκατάληκτα ═══════════
  { l:'complures, -es, -(i)a', nom:'complures', stem:'complur', sub:'3one', m:'αρκετοί, πολλοί', texts:[34], noDeg:true, degNote:'μόνο πληθ.', noSg:true },
  { l:'ferox, -ocis',     nom:'ferox',    stem:'feroc',   sub:'3one', m:'άγριος',            texts:[38] },
  { l:'impotens, -entis', nom:'impotens', stem:'impotent', sub:'3one', m:'αυτός που δεν συγκρατείται', texts:[38] },
  { l:'impudens, -entis', nom:'impudens', stem:'impudent', sub:'3one', m:'αναιδής',          texts:[24] },
  { l:'iners, -rtis',     nom:'iners',    stem:'inert',   sub:'3one', m:'άεργος, νωθρός',    texts:[15] },
  { l:'infelix, -icis',   nom:'infelix',  stem:'infelic', sub:'3one', m:'δυστυχής',          texts:[43] },
  { l:'ingens, -entis',   nom:'ingens',   stem:'ingent',  sub:'3one', m:'πελώριος, τεράστιος', texts:[14] },
  { l:'inops, -opis',     nom:'inops',    stem:'inop',    sub:'3one', m:'φτωχός, ανήμπορος', texts:[44], comp:'egentior', superl:'egentissimus', degNote:'δανείζεται παραθετικά από το egens' },
  { l:'locuples, -etis',  nom:'locuples', stem:'locuplet',sub:'3one', m:'πλούσιος',          texts:[36] },
  { l:'minax, -acis',     nom:'minax',    stem:'minac',   sub:'3one', m:'απειλητικός',       texts:[43] },
  { l:'par, -aris',       nom:'par',      stem:'par',     sub:'3one', m:'ίσος, όμοιος',       texts:[29], noDeg:true, degNote:'απόλυτη έννοια' },
  { l:'praecox, -ocis',   nom:'praecox',  stem:'praecoc', sub:'3one', m:'πρώιμος',            texts:[25], noDeg:true },
  { l:'recens, -entis',   nom:'recens',   stem:'recent',  sub:'3one', m:'πρόσφατος, νέος',    texts:[25] },
];

// ── expand: build full paradigm (m/f/n · s/p) + degree lemmas ────────────────
const LATEK_DB = LATEK_RAW.filter(e => e.texts && e.texts.length).map(e => {
  const o = Object.assign({}, e);
  const dec = _latekDecline(o.sub, o.nom, o.stem);
  // complures: only plural (override singulars to '-')
  if (o.noSg) { ['m','f','n'].forEach(g => { dec[g].s = ['-','-','-','-','-','-']; }); }
  o.decl = dec;                                         // {m:{s,p},f:{s,p},n:{s,p}}
  const deg = _latekDegrees(o);
  o.comp = deg.comp;                                    // ονομ. αρσ. συγκριτικού ή null
  o.superl = deg.superl;                                // ονομ. αρσ. υπερθετικού ή null
  // pre-build degree paradigms (για την κλίση παραθετικών)
  // περιφραστικά (peri) ΔΕΝ κλίνονται — μόνο σχηματισμός
  if (o.comp && !o.peri)   o.compDecl   = (o.comp === 'plus') ? _LATEK_PLUS : _latekDeclineComp(o.comp);
  if (o.superl && !o.peri) o.superlDecl = _latekDeclineSuperl(o.superl);
  return o;
});

// ── map: text number → adjectives appearing in it ────────────────────────────
const LATEK_BY_TEXT = {};
LATEK_DB.forEach(a => { a.texts.forEach(t => { (LATEK_BY_TEXT[t] = LATEK_BY_TEXT[t] || []).push(a); }); });
const LATEK_TEXTS = Object.keys(LATEK_BY_TEXT).map(Number).sort((a, b) => a - b);
