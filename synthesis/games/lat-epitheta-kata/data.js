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
  { l:'aequus, -a, -um',   nom:'aequus',   stem:'aequ',   sub:'2us', m:'ίσος, δίκαιος',            texts:[21,35,49] },
  { l:'bonus, -a, -um',    nom:'bonus',    stem:'bon',    sub:'2us', m:'καλός',                    texts:[6,22,39,41,46], comp:'melior', superl:'optimus' },
  { l:'captivus, -a, -um', nom:'captivus', stem:'captiv', sub:'2us', m:'αιχμάλωτος',               texts:[43,45], noDeg:true, degNote:'δηλώνει κατάσταση' },
  { l:'clarus, -a, -um',   nom:'clarus',   stem:'clar',   sub:'2us', m:'λαμπρός, ένδοξος',         texts:[5,19,34] },
  { l:'cupidus, -a, -um',  nom:'cupidus',  stem:'cupid',  sub:'2us', m:'αυτός που επιθυμεί',       texts:[29,32] },
  { l:'durus, -a, -um',    nom:'durus',    stem:'dur',    sub:'2us', m:'σκληρός',                  texts:[27,48] },
  { l:'epicus, -a, -um',   nom:'epicus',   stem:'epic',   sub:'2us', m:'επικός',                   texts:[5], noDeg:true, degNote:'σχέσης/είδους' },
  { l:'fidus, -a, -um',    nom:'fidus',    stem:'fid',    sub:'2us', m:'πιστός',                   texts:[44] },
  { l:'frigidus, -a, -um', nom:'frigidus', stem:'frigid', sub:'2us', m:'κρύος, ψυχρός',            texts:[15] },
  { l:'horrendus, -a, -um',nom:'horrendus',stem:'horrend',sub:'2us', m:'φρικτός',                  texts:[14], noDeg:true, degNote:'γερουνδιακό' },
  { l:'immaturus, -a, -um',nom:'immaturus',stem:'immatur',sub:'2us', m:'πρόωρος',                  texts:[43] },
  { l:'immensus, -a, -um', nom:'immensus', stem:'immens', sub:'2us', m:'αμέτρητος, απέραντος',     texts:[21], noDeg:true, degNote:'απόλυτη έννοια' },
  { l:'imperitus, -a, -um',nom:'imperitus',stem:'imperit',sub:'2us', m:'άπειρος',                  texts:[39,42] },
  { l:'improbus, -a, -um', nom:'improbus', stem:'improb', sub:'2us', m:'αχρείος, πονηρός',         texts:[19,42] },
  { l:'ineptus, -a, -um',  nom:'ineptus',  stem:'inept',  sub:'2us', m:'ανόητος, ανάρμοστος',      texts:[36,41] },
  { l:'infestus, -a, -um', nom:'infestus', stem:'infest', sub:'2us', m:'εχθρικός, επικίνδυνος',    texts:[18,43] },
  { l:'infidus, -a, -um',  nom:'infidus',  stem:'infid',  sub:'2us', m:'άπιστος',                  texts:[44], noDeg:true, degNote:'δηλώνει ιδιότητα' },
  { l:'iucundus, -a, -um', nom:'iucundus', stem:'iucund', sub:'2us', m:'ευχάριστος',               texts:[27] },
  { l:'ligneus, -a, -um',  nom:'ligneus',  stem:'ligne',  sub:'2us', m:'ξύλινος',                  texts:[36], noDeg:true, degNote:'υλικού' },
  { l:'longus, -a, -um',   nom:'longus',   stem:'long',   sub:'2us', m:'μακρύς',                   texts:[26,38,43] },
  { l:'magnus, -a, -um',   nom:'magnus',   stem:'magn',   sub:'2us', m:'μεγάλος',                  texts:[16,17,22,30,36,48,50], comp:'maior', superl:'maximus' },
  { l:'marinus, -a, -um',  nom:'marinus',  stem:'marin',  sub:'2us', m:'θαλάσσιος',                texts:[3], noDeg:true, degNote:'σχέσης' },
  { l:'maturus, -a, -um',  nom:'maturus',  stem:'matur',  sub:'2us', m:'ώριμος',                   texts:[27,47] },
  { l:'multi, -ae, -a',    nom:'multus',   stem:'mult',   sub:'2us', m:'πολλοί',                   texts:[5,7,19,27,32,33,41,42], comp:'plus', superl:'plurimus', degNote:'συγκρ. plus (ουδ. εν.) / plures (πληθ.)' },
  { l:'nimius, -a, -um',   nom:'nimius',   stem:'nimi',   sub:'2us', m:'υπερβολικός',              texts:[25], comp:'magis nimius', superl:'maxime nimius', peri:true, degNote:'περιφραστικά (φωνήεν πριν το -us)' },
  { l:'obvius, -a, -um',   nom:'obvius',   stem:'obvi',   sub:'2us', m:'αυτός που βρίσκεται μπροστά', texts:[20], noDeg:true },
  { l:'parvus, -a, -um',   nom:'parvus',   stem:'parv',   sub:'2us', m:'μικρός',                   texts:[26,28,32], comp:'minor', superl:'minimus' },
  { l:'paucus, -a, -um',   nom:'paucus',   stem:'pauc',   sub:'2us', m:'λίγος (συν. πληθ. pauci)', texts:[14,24,28], comp:'paucior', superl:'paucissimus', degNote:'κυρίως πληθ.: pauci → pauciores → paucissimi' },
  { l:'paulus, -a, -um',   nom:'paulus',   stem:'paul',   sub:'2us', m:'μικρός, λίγος',            texts:[20,23,31,38], noDeg:true, degNote:'ελλειπτικό' },
  { l:'pavidus, -a, -um',  nom:'pavidus',  stem:'pavid',  sub:'2us', m:'έντρομος',                 texts:[11] },
  { l:'pennatus, -a, -um', nom:'pennatus', stem:'pennat', sub:'2us', m:'φτερωτός',                 texts:[3], noDeg:true, degNote:'υλικού/ιδιότητας' },
  { l:'repentinus, -a, -um',nom:'repentinus',stem:'repentin',sub:'2us', m:'ξαφνικός',              texts:[13], noDeg:true },
  { l:'salvus, -a, -um',   nom:'salvus',   stem:'salv',   sub:'2us', m:'σώος, ασφαλής',            texts:[37], noDeg:true, degNote:'απόλυτη έννοια' },
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
  { l:'posterus, -a, -um', nom:'posterus', stem:'poster', sub:'2us', m:'επόμενος',                 texts:[16,20,48], comp:'posterior', superl:'postremus', degNote:'και postumus' },
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
  { l:'Romanus, -a, -um',  nom:'Romanus',  stem:'Roman',  sub:'2us', m:'Ρωμαϊκός',                texts:[11,19,31,35], noDeg:true, degNote:'κύριο' },

  // ═══════════ Β΄ ΚΛΙΣΗ — σε -er ═══════════
  { l:'dexter, -(e)ra, -(e)rum', nom:'dexter', stem:'dextr', sub:'2er', m:'δεξιός', texts:[34], comp:'dexterior', superl:'dextimus', degNote:'συγκρ. dexterior · υπερθ. dextimus' },
  { l:'liber, -era, -erum',  nom:'liber', stem:'liber', sub:'2er', m:'ελεύθερος',     texts:[6,28,43] },
  { l:'miser, -era, -erum',  nom:'miser', stem:'miser', sub:'2er', m:'δυστυχισμένος', texts:[37,43] },
  { l:'pulcher, -chra, -chrum', nom:'pulcher', stem:'pulchr', sub:'2er', m:'όμορφος', texts:[5] },
  { l:'tener, -era, -erum',  nom:'tener', stem:'tener', sub:'2er', m:'τρυφερός, απαλός', texts:[6] },

  // ═══════════ Γ΄ ΚΛΙΣΗ — δικατάληκτα -is/-e ═══════════
  { l:'civilis, -is, -e',   nom:'civilis', stem:'civil', sub:'3two', m:'πολιτικός',          texts:[33,37], noDeg:true, degNote:'σχέσης' },
  { l:'facilis, -is, -e',   nom:'facilis', stem:'facil', sub:'3two', m:'εύκολος',            texts:[] },
  { l:'fortis, -is, -e',    nom:'fortis',  stem:'fort',  sub:'3two', m:'γενναίος, δυνατός',  texts:[22,30,31,32] },
  { l:'illustris, -is, -e', nom:'illustris',stem:'illustr',sub:'3two', m:'λαμπρός, ένδοξος', texts:[13] },
  { l:'immortalis, -is, -e',nom:'immortalis',stem:'immortal',sub:'3two', m:'αθάνατος',       texts:[22,34], noDeg:true, degNote:'απόλυτη έννοια' },
  { l:'incredibilis, -is, -e',nom:'incredibilis',stem:'incredibil',sub:'3two', m:'απίστευτος', texts:[17,34] },
  { l:'liberalis, -is, -e', nom:'liberalis',stem:'liberal',sub:'3two', m:'γενναιόδωρος',     texts:[13] },
  { l:'mirabilis, -is, -e', nom:'mirabilis',stem:'mirabil',sub:'3two', m:'θαυμαστός',        texts:[20] },
  { l:'mollis, -is, -e',    nom:'mollis',  stem:'moll',  sub:'3two', m:'μαλακός',            texts:[27,42] },
  { l:'nobilis, -is, -e',   nom:'nobilis', stem:'nobil', sub:'3two', m:'ευγενής, ξακουστός', texts:[31] },
  { l:'omnis, -is, -e',     nom:'omnis',   stem:'omn',   sub:'3two', m:'κάθε, όλος',         texts:[6,7,11,15,21,25,31,32,33,37,44,46,48], noDeg:true, degNote:'καθολική έννοια' },
  { l:'similis, -is, -e',   nom:'similis', stem:'simil', sub:'3two', m:'όμοιος',             texts:[14] },
  { l:'singularis, -is, -e',nom:'singularis',stem:'singular',sub:'3two', m:'μοναδικός',      texts:[31], noDeg:true, degNote:'απόλυτη έννοια' },
  { l:'stabilis, -is, -e',  nom:'stabilis',stem:'stabil',sub:'3two', m:'σταθερός',           texts:[44] },
  { l:'tristis, -is, -e',   nom:'tristis', stem:'trist', sub:'3two', m:'λυπημένος, θλιβερός', texts:[20,26] },
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
  { l:'ferox, -ocis',     nom:'ferox',    stem:'feroc',   sub:'3one', m:'άγριος',            texts:[37] },
  { l:'impotens, -entis', nom:'impotens', stem:'impotent', sub:'3one', m:'αυτός που δεν συγκρατείται', texts:[37] },
  { l:'impudens, -entis', nom:'impudens', stem:'impudent', sub:'3one', m:'αναιδής',          texts:[24] },
  { l:'iners, -rtis',     nom:'iners',    stem:'inert',   sub:'3one', m:'άεργος, νωθρός',    texts:[15] },
  { l:'infelix, -icis',   nom:'infelix',  stem:'infelic', sub:'3one', m:'δυστυχής',          texts:[43] },
  { l:'ingens, -entis',   nom:'ingens',   stem:'ingent',  sub:'3one', m:'πελώριος, τεράστιος', texts:[14,17,23] },
  { l:'inops, -opis',     nom:'inops',    stem:'inop',    sub:'3one', m:'φτωχός, ανήμπορος', texts:[44], comp:'egentior', superl:'egentissimus', degNote:'δανείζεται παραθετικά από το egens' },
  { l:'locuples, -etis',  nom:'locuples', stem:'locuplet',sub:'3one', m:'πλούσιος',          texts:[] },
  { l:'minax, -acis',     nom:'minax',    stem:'minac',   sub:'3one', m:'απειλητικός',       texts:[43] },
  { l:'par, -aris',       nom:'par',      stem:'par',     sub:'3one', m:'ίσος, όμοιος',       texts:[29], noDeg:true, degNote:'απόλυτη έννοια' },
  { l:'praecox, -ocis',   nom:'praecox',  stem:'praecoc', sub:'3one', m:'πρώιμος',            texts:[25], noDeg:true },
  { l:'recens, -entis',   nom:'recens',   stem:'recent',  sub:'3one', m:'πρόσφατος, νέος',    texts:[25] },
  // ── panel-3 sync: adjectives from κείμενα 16-50 ──
  { l:'reliquus, -a, -um', nom:'reliquus', stem:'reliqu', sub:'2us', m:'υπόλοιπος', texts:[16], noDeg:true },
  { l:'vivus, -a, -um', nom:'vivus', stem:'viv', sub:'2us', m:'ζωντανός', texts:[16] },
  { l:'militaris, -is, -e', nom:'militaris', stem:'militar', sub:'3two', m:'στρατιωτικός', texts:[16,17], noDeg:true },
  { l:'peritus, -a, -um', nom:'peritus', stem:'perit', sub:'2us', m:'έμπειρος', texts:[17], noDeg:true },
  { l:'communis, -is, -e', nom:'communis', stem:'commun', sub:'3two', m:'κοινός', texts:[17,46] },
  { l:'aversus, -a, -um', nom:'aversus', stem:'avers', sub:'2us', m:'γυρισμένος ανάποδα, αντεστραμμένος', texts:[18], noDeg:true },
  { l:'conatus, -a, -um', nom:'conatus', stem:'conat', sub:'2us', m:'αυτός που προσπάθησε (ενεργ. σημασία)', texts:[18], noDeg:true },
  { l:'confusus, -a, -um', nom:'confusus', stem:'confus', sub:'2us', m:'μπερδεμένος, συγκεχυμένος', texts:[18], noDeg:true },
  { l:'excitatus, -a, -um', nom:'excitatus', stem:'excitat', sub:'2us', m:'ξυπνημένος, σηκωμένος', texts:[18], noDeg:true },
  { l:'fessus, -a, -um', nom:'fessus', stem:'fess', sub:'2us', m:'κουρασμένος', texts:[18,38], noDeg:true },
  { l:'fretus, -a, -um', nom:'fretus', stem:'fret', sub:'2us', m:'αυτός που έχει εμπιστοσύνη / πεποίθηση', texts:[18], noDeg:true },
  { l:'versus, -a, -um', nom:'versus', stem:'vers', sub:'2us', m:'στραμμένος, γυρισμένος', texts:[18], noDeg:true },
  { l:'nobilissimus, -a, -um', nom:'nobilissimus', stem:'nobilissim', sub:'2us', m:'αριστοκρατικότατος, επιφανέστατος', texts:[19], noDeg:true },
  { l:'pravissimus, -a, -um', nom:'pravissimus', stem:'pravissim', sub:'2us', m:'πάρα πολύ διεστραμμένος, φαύλος', texts:[19], noDeg:true },
  { l:'publicus, -a, -um', nom:'publicus', stem:'public', sub:'2us', m:'δημόσιος', texts:[19,22,25,32,33,35,46], noDeg:true },
  { l:'cruentissimus, -a, -um', nom:'cruentissimus', stem:'cruentissim', sub:'2us', m:'αιματηρότατος', texts:[19], noDeg:true },
  { l:'Veientanus, -a, -um', nom:'Veientanus', stem:'Veientan', sub:'2us', m:'σχετικός με τους Βηίους', texts:[21], noDeg:true },
  { l:'rectus, -a, -um', nom:'rectus', stem:'rect', sub:'2us', m:'σωστός, ίσιος', texts:[22] },
  { l:'sempiternus, -a, -um', nom:'sempiternus', stem:'sempitern', sub:'2us', m:'αιώνιος', texts:[22], noDeg:true },
  { l:'innumerabilis, -is, -e', nom:'innumerabilis', stem:'innumerabil', sub:'3two', m:'αμέτρητος', texts:[22], noDeg:true },
  { l:'mortalis, -is, -e', nom:'mortalis', stem:'mortal', sub:'3two', m:'θνητός', texts:[22], noDeg:true },
  { l:'siccus, -a, -um', nom:'siccus', stem:'sicc', sub:'2us', m:'στεγνός', texts:[23] },
  { l:'piscatorius, -a, -um', nom:'piscatorius', stem:'piscatori', sub:'2us', m:'ψαράδικος', texts:[23], noDeg:true },
  { l:'tertius, -a, -um', nom:'tertius', stem:'terti', sub:'2us', m:'τρίτος, -η, -ο', texts:[25], noDeg:true },
  { l:'festivus, -a, -um', nom:'festivus', stem:'festiv', sub:'2us', m:'πρόσχαρος', texts:[26] },
  { l:'dignus, -a, -um', nom:'dignus', stem:'dign', sub:'2us', m:'άξιος', texts:[26] },
  { l:'paternus, -a, -um', nom:'paternus', stem:'patern', sub:'2us', m:'πατρικός', texts:[26], noDeg:true },
  { l:'novus, -a, -um', nom:'novus', stem:'nov', sub:'2us', m:'νέος', texts:[26], comp:'recentior', superl:'novissimus' },
  { l:'amabilis, -is, -e', nom:'amabilis', stem:'amabil', sub:'3two', m:'αξιαγάπητος', texts:[26] },
  { l:'anilis, -is, -e', nom:'anilis', stem:'anil', sub:'3two', m:'γεροντικός', texts:[26], noDeg:true },
  { l:'matronalis, -is, -e', nom:'matronalis', stem:'matronal', sub:'3two', m:'που ταιριάζει σε δέσποινα', texts:[26], noDeg:true },
  { l:'puellaris, -is, -e', nom:'puellaris', stem:'puellar', sub:'3two', m:'κοριτσίστικος', texts:[26], noDeg:true },
  { l:'grandis, -is, -e', nom:'grandis', stem:'grand', sub:'3two', m:'μεγάλος', texts:[27] },
  { l:'mitis, -is, -e', nom:'mitis', stem:'mit', sub:'3two', m:'γλυκός', texts:[27] },
  { l:'puter (putris), putris, putre', nom:'puter', stem:'putr', sub:'3three', m:'σάπιος', texts:[27], noDeg:true },
  { l:'Epicureus, -a, -um', nom:'Epicureus', stem:'Epicure', sub:'2us', m:'Επικούρειος', texts:[28], noDeg:true },
  { l:'Sardianus, -a, -um', nom:'Sardianus', stem:'Sardian', sub:'2us', m:'Σαρδιανός, από τις Σάρδεις', texts:[28], noDeg:true },
  { l:'superus, -a, -um', nom:'superus', stem:'super', sub:'2us', m:'ο επάνω, ανώτερος', texts:[28], comp:'superior', superl:'supremus / summus' },
  { l:'gratus, -a, -um', nom:'gratus', stem:'grat', sub:'2us', m:'ευχάριστος', texts:[28] },
  { l:'plenus, -a, -um', nom:'plenus', stem:'plen', sub:'2us', m:'γεμάτος', texts:[32] },
  { l:'excellens, -entis', nom:'excellens', stem:'excellent', sub:'3one', m:'έξοχος, διακεκριμένος', texts:[32] },
  { l:'armatus, -a, -um', nom:'armatus', stem:'armat', sub:'2us', m:'οπλισμένος (στον πόλεμο)', texts:[33,40], noDeg:true },
  { l:'severus, -a, -um', nom:'severus', stem:'sever', sub:'2us', m:'αυστηρός, -ή, -ό', texts:[33] },
  { l:'togatus, -a, -um', nom:'togatus', stem:'togat', sub:'2us', m:'τηβεννοφόρος (στην ειρήνη)', texts:[33], noDeg:true },
  { l:'felix, -icis', nom:'felix', stem:'felic', sub:'3one', m:'ευτυχισμένος, -η, -ο', texts:[35] },
  { l:'unus, -a, -um', nom:'unus', stem:'un', sub:'2us', m:'ένας, μία, ένα', texts:[35], noDeg:true },
  { l:'tres, tria', nom:'tres', stem:'tr', sub:'3two', m:'τρεις, τρία', texts:[35], noDeg:true },
  { l:'priscus, -a, -um', nom:'priscus', stem:'prisc', sub:'2us', m:'αρχαίος, πατροπαράδοτος', texts:[38], noDeg:true },
  { l:'nuptialis, -is, -e', nom:'nuptialis', stem:'nuptial', sub:'3two', m:'γαμήλιος', texts:[38], noDeg:true },
  { l:'integer, integra, integrum', nom:'integer', stem:'integr', sub:'2er', m:'υγιής, αρτιμελής', texts:[39] },
  { l:'praeceps, praecipitis', nom:'praeceps', stem:'praecipit', sub:'3one', m:'αυτός που πέφτει με το κεφάλι', texts:[39], noDeg:true },
  { l:'vilis, -is, -e', nom:'vilis', stem:'vil', sub:'3two', m:'ευτελής, φτηνός', texts:[39] },
  { l:'debilis, -is, -e', nom:'debilis', stem:'debil', sub:'3two', m:'αδύναμος, ανάπηρος', texts:[39] },
  { l:'memorabilis, -is, -e', nom:'memorabilis', stem:'memorabil', sub:'3two', m:'αξιομνημόνευτος, -η, -ο', texts:[39], noDeg:true },
  { l:'infirmus, -a, -um', nom:'infirmus', stem:'infirm', sub:'2us', m:'αδύναμος', texts:[40] },
  { l:'solus, -a, -um', nom:'solus', stem:'sol', sub:'2us', m:'μόνος', texts:[40], noDeg:true },
  { l:'antiquus, -a, -um', nom:'antiquus', stem:'antiqu', sub:'2us', m:'αρχαίος, -α, -ο', texts:[41] },
  { l:'primus, -a, -um', nom:'primus', stem:'prim', sub:'2us', m:'πρώτος, -η, -ο', texts:[41], noDeg:true },
  { l:'obsoletus, -a, -um', nom:'obsoletus', stem:'obsolet', sub:'2us', m:'απαρχαιωμένος, ξεπερασμένος', texts:[41], noDeg:true },
  { l:'honestus, -a, -um', nom:'honestus', stem:'honest', sub:'2us', m:'τιμημένος, ευπρεπής', texts:[41] },
  { l:'modestus, -a, -um', nom:'modestus', stem:'modest', sub:'2us', m:'σεμνός, κόσμιος', texts:[41] },
  { l:'inauditus, -a, -um', nom:'inauditus', stem:'inaudit', sub:'2us', m:'ανήκουστος, πρωτάκουστος', texts:[41], noDeg:true },
  { l:'insolens, -entis', nom:'insolens', stem:'insolent', sub:'3one', m:'ασυνήθιστος, -η, -ο', texts:[41] },
  { l:'nonnulli, -ae, -a', nom:'nonnullus', stem:'nonnull', sub:'2us', m:'μερικοί, κάποιοι', texts:[42], noDeg:true },
  { l:'suspectus, -a, -um', nom:'suspectus', stem:'suspect', sub:'2us', m:'ύποπτος', texts:[44] },
  { l:'Gallus, -a, -um', nom:'Gallus', stem:'Gall', sub:'2us', m:'γαλατικός', texts:[45], noDeg:true },
  { l:'Graecus, -a, -um', nom:'Graecus', stem:'Graec', sub:'2us', m:'ελληνικός', texts:[45], noDeg:true },
  { l:'carus, -a, -um', nom:'carus', stem:'car', sub:'2us', m:'αγαπητός, ακριβός', texts:[46] },
  { l:'singuli, -ae, -a', nom:'singuli', stem:'singul', sub:'2us', m:'ο καθένας ξεχωριστά', texts:[46], noDeg:true },
  { l:'sapiens, -entis', nom:'sapiens', stem:'sapient', sub:'3one', m:'σοφός', texts:[46] },
  { l:'canus, -a, -um', nom:'canus', stem:'can', sub:'2us', m:'ασπρομάλλης', texts:[47], noDeg:true },
  { l:'calvus, -a, -um', nom:'calvus', stem:'calv', sub:'2us', m:'φαλακρός', texts:[47], noDeg:true },
  { l:'secretus, -a, -um', nom:'secretus', stem:'secret', sub:'2us', m:'κρυφός, απόμερος', texts:[47,49] },
  { l:'albus, -a, -um', nom:'albus', stem:'alb', sub:'2us', m:'άσπρος, -η, -ο', texts:[48], noDeg:true },
  { l:'eximius, -a, -um', nom:'eximius', stem:'eximi', sub:'2us', m:'εξαιρετικός, -ή, -ό', texts:[48], comp:'magis eximius', superl:'maxime eximius' },
  { l:'utilis, -is, -e', nom:'utilis', stem:'util', sub:'3two', m:'χρήσιμος, -η, -ο', texts:[48] },
  { l:'tonsorius, -a, -um', nom:'tonsorius', stem:'tonsori', sub:'2us', m:'του μανικιουρίστα/κουρέα', texts:[49], noDeg:true },
  { l:'temerarius, -a, -um', nom:'temerarius', stem:'temerari', sub:'2us', m:'ασυλλόγιστος, -η, -ο', texts:[49], comp:'magis temerarius', superl:'maxime temerarius' },
  { l:'certus, -a, -um', nom:'certus', stem:'cert', sub:'2us', m:'βέβαιος, -η, -ο', texts:[49] },
  { l:'malus, -a, -um', nom:'malus', stem:'mal', sub:'2us', m:'κακός, -ή, -ό', texts:[50], comp:'peior', superl:'pessimus' },
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
