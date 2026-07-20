'use strict';
// ════════════════════════════════════════════════════════════════════════
//  ΟΥΣΙΑΣΤΙΚΑ ΑΝΑ ΚΕΙΜΕΝΟ — Latin nouns grouped by school text (κείμενα 3–45)
//  Source: study4exams / study.cti.gr declension tables.
//
//  Cases order: [0]=Ονομαστική [1]=Γενική [2]=Δοτική [3]=Αιτιατική
//               [4]=Κλητική    [5]=Αφαιρετική
//  Each cell is a string, '-' (form does not exist), or an array of accepted
//  variants (e.g. ['filiis','filiabus']).  Regular nouns are declined at
//  runtime by _latnkDecline(); irregular ones carry explicit s/p arrays.
// ════════════════════════════════════════════════════════════════════════

const LATNK_CASES    = ['Ονομαστική','Γενική','Δοτική','Αιτιατική','Κλητική','Αφαιρετική'];
const LATNK_CASES_EN = ['Nominative','Genitive','Dative','Accusative','Vocative','Ablative'];
const LATNK_DECL_LBL = {1:'Α΄ Κλίση',2:'Β΄ Κλίση',3:'Γ΄ Κλίση',4:'Δ΄ Κλίση',5:'Ε΄ Κλίση'};
const LATNK_GEND     = { αρσενικό:'αρσ.', θηλυκό:'θηλ.', ουδέτερο:'ουδ.', 'αρσ./θηλ.':'αρσ./θηλ.' };

// ── runtime decliner for REGULAR nouns ─────────────────────────────────────
function _latnkDecline(nom, gen, d, sub) {
  if (d === 1) {
    const st = nom.replace(/(a|e)$/, '');           // puell-, gloria→glori-
    return {
      s: [nom, st+'ae', st+'ae', st+'am', nom, st+'a'],
      p: [st+'ae', st+'arum', st+'is', st+'as', st+'ae', st+'is'],
    };
  }
  if (d === 2) {
    if (sub === '2n' || sub === '2n_ium') {
      const st  = gen.replace(/i$/, '');             // doni→don, consilii→consili
      const gsg = sub === '2n_ium' ? [gen, st] : gen;
      return {
        s: [nom, gsg, st+'o', nom, nom, st+'o'],
        p: [st+'a', st+'orum', st+'is', st+'a', st+'a', st+'is'],
      };
    }
    if (sub === '2m_er') {
      const st = gen.replace(/i$/, '');              // pueri→puer, agri→agr, viri→vir
      return {
        s: [nom, gen, st+'o', st+'um', nom, st+'o'],
        p: [gen, st+'orum', st+'is', st+'os', gen, st+'is'],
      };
    }
    if (sub === '2m_ius') {                          // proper -ius / filius
      const st = nom.replace(/us$/, '');             // Vergili, fili
      return {
        s: [nom, [st+'i', st], st+'o', st+'um', st, st+'o'],
        p: [st+'i', st+'orum', st+'is', st+'os', st+'i', st+'is'],
      };
    }
    const st = nom.replace(/us$/, '');               // 2m: domin-, adversari-
    return {
      s: [nom, st+'i', st+'o', st+'um', st+'e', st+'o'],
      p: [st+'i', st+'orum', st+'is', st+'os', st+'i', st+'is'],
    };
  }
  if (d === 3) {
    const st = gen.replace(/is$/, '');
    if (sub === '3n')  return {                       // neuter consonant
      s: [nom, gen, st+'i', nom, nom, st+'e'],
      p: [st+'a', st+'um', st+'ibus', st+'a', st+'a', st+'ibus'],
    };
    if (sub === '3ni') return {                       // neuter i-stem -al/-ar/-e
      s: [nom, gen, st+'i', nom, nom, st+'i'],
      p: [st+'ia', st+'ium', st+'ibus', st+'ia', st+'ia', st+'ibus'],
    };
    if (sub === '3i')  return {                       // masc/fem i-stem
      s: [nom, gen, st+'i', st+'em', nom, st+'e'],
      p: [st+'es', st+'ium', st+'ibus', [st+'es', st+'is'], st+'es', st+'ibus'],
    };
    return {                                          // masc/fem consonant
      s: [nom, gen, st+'i', st+'em', nom, st+'e'],
      p: [st+'es', st+'um', st+'ibus', st+'es', st+'es', st+'ibus'],
    };
  }
  if (d === 4) {
    if (sub === '4n') {
      const st = nom.replace(/u$/, '');               // cornu→corn
      return {
        s: [nom, st+'us', nom, nom, nom, nom],
        p: [st+'ua', st+'uum', st+'ibus', st+'ua', st+'ua', st+'ibus'],
      };
    }
    const st = nom.replace(/us$/, '');                // casus→cas
    return {
      s: [nom, st+'us', st+'ui', st+'um', st+'us', st+'u'],
      p: [st+'us', st+'uum', st+'ibus', st+'us', st+'us', st+'ibus'],
    };
  }
  if (d === 5) {
    const st = nom.slice(0, -1);                      // res→re, dies→die
    return {
      s: [nom, gen, gen, st+'m', nom, st],
      p: [nom, st+'rum', st+'bus', nom, nom, st+'bus'],
    };
  }
  return { s: ['-','-','-','-','-','-'], p: ['-','-','-','-','-','-'] };
}

// ── raw entries ─────────────────────────────────────────────────────────────
//  l = "nom, gen" (display + parsed for the decliner) · m = meaning · t = gender
//  d = declension · sub = subtype · texts = [κείμενα]
//  Optional: s/p (explicit paradigm), noSg, noPl, plNAV (plural Nom/Acc/Voc only)
const LATNK_RAW = [

  // ══════════════ Α΄ ΚΛΙΣΗ ══════════════
  { l:'forma, formae',         m:'σχήμα, ομορφιά',        t:'θηλυκό',  d:1, sub:'1f', texts:[3] },
  { l:'belua, beluae',         m:'άγριο ζώο, κήτος',      t:'θηλυκό',  d:1, sub:'1f', texts:[3] },
  { l:'incola, incolae',       m:'κάτοικος',              t:'αρσενικό',d:1, sub:'1m', texts:[3] },
  { l:'ora, orae',             m:'ακτή',                  t:'θηλυκό',  d:1, sub:'1f', texts:[3] },
  { l:'hostia, hostiae',       m:'σφάγιο για θυσία',      t:'θηλυκό',  d:1, sub:'1f', texts:[3] },
  { l:'puella, puellae',       m:'κορίτσι, κοπέλα',       t:'θηλυκό',  d:1, sub:'1f', texts:[3,26,35,38] },
  { l:'hasta, hastae',         m:'δόρυ',                  t:'θηλυκό',  d:1, sub:'1f', texts:[3,31] },
  { l:'poeta, poetae',         m:'ποιητής',               t:'αρσενικό',d:1, sub:'1m', texts:[5,24] },
  { l:'vita, vitae',           m:'ζωή',                   t:'θηλυκό',  d:1, sub:'1f', texts:[5,15,26,43,44] },
  { l:'gloria, gloriae',       m:'δόξα',                  t:'θηλυκό',  d:1, sub:'1f', texts:[5,22,30] },
  { l:'sententia, sententiae', m:'άποψη, κρίση, απόφαση', t:'θηλυκό',  d:1, sub:'1f', texts:[6,40,42,49,50] },
  { l:'victoria, victoriae',   m:'νίκη',                  t:'θηλυκό',  d:1, sub:'1f', texts:[11,13,29,30,37] },
  { l:'pugna, pugnae',         m:'μάχη',                  t:'θηλυκό',  d:1, sub:'1f', texts:[13,19,31] },
  { l:'stella, stellae',       m:'αστέρι',                t:'θηλυκό',  d:1, sub:'1f', texts:[13] },
  { l:'diaeta, diaetae',       m:'θερινή κατοικία',       t:'θηλυκό',  d:1, sub:'1f', texts:[20] },
  { l:'turba, turbae',         m:'πλήθος',                t:'θηλυκό',  d:1, sub:'1f', texts:[20] },
  { l:'preda, predae',         m:'λεία',                  t:'θηλυκό',  d:1, sub:'1f', texts:[21], altFn:f=>f.replace(/^pred/,'praed') },
  { l:'ianua, ianuae',         m:'πόρτα',                 t:'θηλυκό',  d:1, sub:'1f', texts:[24,34] },
  { l:'ancilla, ancillae',     m:'υπηρέτρια',             t:'θηλυκό',  d:1, sub:'1f', texts:[24,49] },
  { l:'patria, patriae',       m:'πατρίδα',               t:'θηλυκό',  d:1, sub:'1f', texts:[22,25,39,43,46] },
  { l:'curia, curiae',         m:'Βουλευτήριο',           t:'θηλυκό',  d:1, sub:'1f', texts:[25,40] },
  { l:'tragoedia, tragoediae', m:'τραγωδία',              t:'θηλυκό',  d:1, sub:'1f', texts:[27] },
  { l:'fuga, fugae',           m:'φυγή',                  t:'θηλυκό',  d:1, sub:'1f', texts:[16,31] },
  { l:'dextra, dextrae',       m:'το δεξί χέρι',          t:'θηλυκό',  d:1, sub:'1f', texts:[34] },
  { l:'mora, morae',           m:'χρονοτριβή, καθυστέρηση',t:'θηλυκό', d:1, sub:'1f', texts:[38] },
  { l:'matertera, materterae', m:'θεία (από τη μητέρα)',  t:'θηλυκό',  d:1, sub:'1f', texts:[38] },
  { l:'terra, terrae',         m:'γη',                    t:'θηλυκό',  d:1, sub:'1f', texts:[43] },
  { l:'amicitia, amicitiae',   m:'φιλία, συμμαχία',       t:'θηλυκό',  d:1, sub:'1f', texts:[44] },
  { l:'gratia, gratiae',       m:'συμφιλίωση, χάρη, εύνοια',t:'θηλυκό',d:1, sub:'1f', texts:[35,44] },
  { l:'epistula, epistulae',   m:'επιστολή',              t:'θηλυκό',  d:1, sub:'1f', texts:[45] },
  { l:'tragula, tragulae',     m:'είδος ακοντίου',        t:'θηλυκό',  d:1, sub:'1f', texts:[45] },
  // ετερόσημα (αλλάζουν σημασία στον πληθυντικό)
  { l:'opera, operae',         m:'εργασία, κόπος (πληθ. = μισθωτοί εργάτες)', t:'θηλυκό', d:1, sub:'1f', texts:[29,31] },
  { l:'copia, copiae',         m:'αφθονία (πληθ. = στρατιωτικές δυνάμεις)',   t:'θηλυκό', d:1, sub:'1f', texts:[11] },
  { l:'littera, litterae',     m:'γράμμα (πληθ. = λογοτεχνία, επιστολή)',     t:'θηλυκό', d:1, sub:'1f', texts:[28,32,45] },
  // ιδιαιτερότητα: filia — δοτ./αφαιρ. πληθ. filiis & filiabus
  { l:'filia, filiae', m:'κόρη', t:'θηλυκό', d:1, sub:'1f', texts:[3,26,35,38,47],
    s:['filia','filiae','filiae','filiam','filia','filia'],
    p:['filiae','filiarum',['filiis','filiabus'],'filias','filiae',['filiis','filiabus']] },
  // Νύμφη — ελληνικοί τύποι
  { l:'Nympha, Nymphae', m:'η Νύμφη', t:'θηλυκό', d:1, sub:'1f', texts:[3],
    s:[['Nympha','Nymphe'],['Nymphae','Nymphes'],'Nymphae',['Nympham','Nymphen'],['Nympha','Nymphe'],['Nympha','Nymphe']],
    p:['Nymphae','Nympharum','Nymphis','Nymphas','Nymphae','Nymphis'] },
  // δε σχηματίζουν πληθυντικό (κύρια / αφηρημένα Α΄)
  { l:'Aethiopia, Aethiopiae', m:'Αιθιοπία',  t:'θηλυκό',  d:1, sub:'1f', texts:[3],  noPl:true },
  { l:'Campania, Campaniae',   m:'Καμπανία',   t:'θηλυκό',  d:1, sub:'1f', texts:[5],  noPl:true },
  { l:'inopia, inopiae',       m:'έλλειψη',    t:'θηλυκό',  d:1, sub:'1f', texts:[7,50],  noPl:true },
  { l:'Italia, Italiae',       m:'η Ιταλία',   t:'θηλυκό',  d:1, sub:'1f', texts:[11,40,41], noPl:true },
  { l:'Hispania, Hispaniae',   m:'Ισπανία',    t:'θηλυκό',  d:1, sub:'1f', texts:[11,18,50], noPl:true },
  { l:'Gallia, Galliae',       m:'Γαλατία',    t:'θηλυκό',  d:1, sub:'1f', texts:[11], noPl:true },
  { l:'Trebia, Trebiae',       m:'ο ποταμός Τρεβίας', t:'αρσενικό', d:1, sub:'1m', texts:[11], noPl:true },
  { l:'Africa, Africae',       m:'Αφρική',     t:'θηλυκό',  d:1, sub:'1f', texts:[11,35], noPl:true },
  { l:'Zama, Zamae',           m:'η Ζάμα',     t:'θηλυκό',  d:1, sub:'1f', texts:[11], noPl:true },
  { l:'fiducia, fiduciae',     m:'εμπιστοσύνη, αυτοπεποίθηση', t:'θηλυκό', d:1, sub:'1f', texts:[13,25,44], noPl:true },
  { l:'luna, lunae',           m:'σελήνη',     t:'θηλυκό',  d:1, sub:'1f', texts:[13], noPl:true },
  { l:'pecunia, pecuniae',     m:'χρήματα',    t:'θηλυκό',  d:1, sub:'1f', texts:[21,29,36], noPl:true },
  { l:'ira, irae',             m:'οργή',       t:'θηλυκό',  d:1, sub:'1f', texts:[43], noPl:true },
  { l:'agricultura, agriculturae', m:'γεωργία', t:'θηλυκό', d:1, sub:'1f', texts:[15], noPl:true },
  { l:'Caligula, Caligulae',   m:'ο Καλιγούλας', t:'αρσενικό', d:1, sub:'1m', texts:[20], noPl:true },
  { l:'Allia, Alliae',         m:'ο Αλίας ποταμός', t:'αρσενικό', d:1, sub:'1m', texts:[21], noPl:true },
  { l:'Ardea, Ardeae',         m:'Αρδέα',      t:'θηλυκό',  d:1, sub:'1f', texts:[21], noPl:true },
  { l:'Roma, Romae',           m:'Ρώμη',       t:'θηλυκό',  d:1, sub:'1f', texts:[18,21,23,27,28,29,40,43], noPl:true },
  { l:'Nasica, Nasicae',       m:'Νασικάς',    t:'αρσενικό',d:1, sub:'1m', texts:[24], noPl:true },
  { l:'Caecilia, Caeciliae',   m:'Καικιλία',   t:'θηλυκό',  d:1, sub:'1f', texts:[38], noPl:true },
  { l:'Catilina, Catilinae',   m:'ο Κατιλίνας',t:'αρσενικό',d:1, sub:'1m', texts:[19,42], noPl:true },
  { l:'senecta, senectae',     m:'τα γηρατειά',t:'θηλυκό',  d:1, sub:'1f', texts:[43], noPl:true },
  { l:'benevolentia, benevolentiae', m:'εύνοια, καλή θέληση', t:'θηλυκό', d:1, sub:'1f', texts:[44], noPl:true },
  // ελληνικά κύρια Α΄ με ιδιαίτερη κλίση (μόνο ενικός)
  { l:'Andromeda, Andromedae', m:'Ανδρομέδα', t:'θηλυκό', d:1, sub:'1f', texts:[3], noPl:true,
    s:['Andromeda',['Andromedae','Andromedes'],'Andromedae',['Andromedam','Andromedan','Andromeden'],['Andromeda','Andromede'],['Andromeda','Andromede']] },
  { l:'Cassiope, Cassiopes', m:'Κασσιόπη', t:'θηλυκό', d:1, sub:'1f', texts:[3], noPl:true,
    s:['Cassiope',['Cassiopes','Cassiopae'],'Cassiopae',['Cassiopen','Cassiopem'],'Cassiope','Cassiope'] },
  { l:'Perses, Persae', m:'ο Περσέας (βασιλιάς Μακεδονίας)', t:'αρσενικό', d:1, sub:'1m', texts:[13], noPl:true,
    s:['Perses','Persae','Persae',['Persam','Persen'],['Persa','Perse'],['Persa','Perse']] },
  // δε σχηματίζουν ενικό (pluralia tantum Α΄)
  { l:'Belgae, Belgarum', m:'οι Βέλγοι', t:'αρσενικό', d:1, sub:'1m', texts:[7], noSg:true,
    p:['Belgae','Belgarum','Belgis','Belgas','Belgae','Belgis'] },
  { l:'Cannae, Cannarum', m:'οι Κάννες', t:'θηλυκό', d:1, sub:'1f', texts:[11], noSg:true,
    p:['Cannae','Cannarum','Cannis','Cannas','Cannae','Cannis'] },
  { l:'insidiae, insidiarum', m:'ενέδρα, δόλος', t:'θηλυκό', d:1, sub:'1f', texts:[11], noSg:true,
    p:['insidiae','insidiarum','insidiis','insidias','insidiae','insidiis'] },
  { l:'Athenae, Athenarum', m:'η Αθήνα', t:'θηλυκό', d:1, sub:'1f', texts:[14,28], noSg:true,
    p:['Athenae','Athenarum','Athenis','Athenas','Athenae','Athenis'] },
  { l:'divitiae, divitiarum', m:'πλούτη', t:'θηλυκό', d:1, sub:'1f', texts:[36,39], noSg:true,
    p:['divitiae','divitiarum','divitiis','divitias','divitiae','divitiis'] },

  // ══════════════ Β΄ ΚΛΙΣΗ ══════════════
  // αρσενικά -us
  { l:'scopulus, scopuli', m:'βράχος',     t:'αρσενικό', d:2, sub:'2m', texts:[3,41] },
  { l:'calceus, calcei',   m:'υπόδημα',    t:'αρσενικό', d:2, sub:'2m', texts:[3] },
  { l:'animus, animi',     m:'ψυχή',       t:'αρσενικό', d:2, sub:'2m', texts:[5,6,13,14,22,32,33,43,49] },
  { l:'annus, anni',       m:'έτος',       t:'αρσενικό', d:2, sub:'2m', texts:[5,11,20,26,41,47] },
  { l:'servus, servi',     m:'δούλος',     t:'αρσενικό', d:2, sub:'2m', texts:[6,14,28,35,48] },
  { l:'legatus, legati',   m:'διοικητής, απεσταλμένος', t:'αρσενικό', d:2, sub:'2m', texts:[7,13,16,36,45] },
  { l:'populus, populi',   m:'λαός',       t:'αρσενικό', d:2, sub:'2m', texts:[11,35,36] },
  { l:'Gallus, Galli',     m:'Γαλάτης',    t:'αρσενικό', d:2, sub:'2m', texts:[21,45] },
  { l:'Romanus, Romani',   m:'ο Ρωμαίος',  t:'αρσενικό', d:2, sub:'2m', texts:[11,21,31] },
  { l:'modus, modi',       m:'τρόπος',     t:'αρσενικό', d:2, sub:'2m', texts:[13,39] },
  { l:'adversarius, adversarii', m:'αντίπαλος, εχθρός (δεν συναιρεί τη γενική)', t:'αρσενικό', d:2, sub:'2m', texts:[13] },
  { l:'somnus, somni',     m:'ύπνος',      t:'αρσενικό', d:2, sub:'2m', texts:[14,18,48] },
  { l:'mortuus, mortui',   m:'νεκρός',     t:'αρσενικό', d:2, sub:'2m', texts:[14] },
  { l:'equus, equi',       m:'άλογο',      t:'αρσενικό', d:2, sub:'2m', texts:[15] },
  { l:'dominus, domini',   m:'αφεντικό',   t:'αρσενικό', d:2, sub:'2m', texts:[24,29] },
  { l:'corvus, corvi',     m:'κοράκι',     t:'αρσενικό', d:2, sub:'2m', texts:[29] },
  { l:'focus, foci',       m:'φωτιά, εστία', t:'αρσενικό', d:2, sub:'2m', texts:[36] },
  { l:'tyrannus, tyranni', m:'τύραννος',   t:'αρσενικό', d:2, sub:'2m', texts:[44] },
  { l:'amicus, amici',     m:'φίλος',      t:'αρσενικό', d:2, sub:'2m', texts:[26,44,48] },
  { l:'captivus, captivi', m:'αιχμάλωτος', t:'αρσενικό', d:2, sub:'2m', texts:[] },
  { l:'murus, muri',       m:'τείχος (κυρίως πληθ. = τείχη)', t:'αρσενικό', d:2, sub:'2m', texts:[25] },
  { l:'elephantus, elephanti', m:'ελέφαντας (αφθονεί: Β΄ & Γ΄)', t:'αρσενικό', d:2, sub:'2m', texts:[11] },
  // αρσενικά -er
  { l:'liber, libri',      m:'βιβλίο',     t:'αρσενικό', d:2, sub:'2m_er', texts:[5,32] },
  { l:'ager, agri',        m:'αγρός',      t:'αρσενικό', d:2, sub:'2m_er', texts:[5,11] },
  { l:'puer, pueri',       m:'παιδί',      t:'αρσενικό', d:2, sub:'2m_er', texts:[5,23] },
  { l:'magister, magistri',m:'δάσκαλος',   t:'αρσενικό', d:2, sub:'2m_er', texts:[5] },
  { l:'minister, ministri',m:'θεράποντας, υπηρέτης', t:'αρσενικό', d:2, sub:'2m_er', texts:[6,36] },
  { l:'vir, viri',         m:'άνδρας',     t:'αρσενικό', d:2, sub:'2m_er', texts:[5,6,19,22,30,32,35,41,46,49] },
  // ουδέτερα -um
  { l:'oraculum, oraculi', m:'μαντείο',    t:'ουδέτερο', d:2, sub:'2n', texts:[3] },
  { l:'templum, templi',   m:'ναός',       t:'ουδέτερο', d:2, sub:'2n', texts:[5,34] },
  { l:'monumentum, monumenti', m:'μνημείο, τάφος', t:'ουδέτερο', d:2, sub:'2n', texts:[5] },
  { l:'fundamentum, fundamenti', m:'θεμέλιο', t:'ουδέτερο', d:2, sub:'2n', texts:[6] },
  { l:'verbum, verbi',     m:'λόγος',      t:'ουδέτερο', d:2, sub:'2n', texts:[7,29,31,41] },
  { l:'bellum, belli',     m:'πόλεμος',    t:'ουδέτερο', d:2, sub:'2n', texts:[11,13,14,15,25,30,31,33,37] },
  { l:'monstrum, monstri', m:'θέαμα παράξενο και φοβερό', t:'ουδέτερο', d:2, sub:'2n', texts:[13] },
  { l:'vinum, vini',       m:'κρασί',      t:'ουδέτερο', d:2, sub:'2n', texts:[15] },
  { l:'velum, veli',       m:'παραπέτασμα, κουρτίνα', t:'ουδέτερο', d:2, sub:'2n', texts:[20] },
  { l:'factum, facti',     m:'πράξη',      t:'ουδέτερο', d:2, sub:'2n', texts:[21,49] },
  { l:'periculum, periculi', m:'κίνδυνος', t:'ουδέτερο', d:2, sub:'2n', texts:[25,30,32,45] },
  { l:'pomum, pomi',       m:'καρπός',     t:'ουδέτερο', d:2, sub:'2n', texts:[27] },
  { l:'exemplum, exempli', m:'παράδειγμα', t:'ουδέτερο', d:2, sub:'2n', texts:[29,32] },
  { l:'vestibulum, vestibuli', m:'είσοδος', t:'ουδέτερο', d:2, sub:'2n', texts:[34] },
  { l:'tectum, tecti',     m:'σπίτι',      t:'ουδέτερο', d:2, sub:'2n', texts:[34] },
  { l:'donum, doni',       m:'δώρο',       t:'ουδέτερο', d:2, sub:'2n', texts:[34,48] },
  { l:'scamnum, scamni',   m:'σκαμνί',     t:'ουδέτερο', d:2, sub:'2n', texts:[36] },
  { l:'dictum, dicti',     m:'λόγος',      t:'ουδέτερο', d:2, sub:'2n', texts:[38] },
  { l:'sacellum, sacelli', m:'μικρό ιερό', t:'ουδέτερο', d:2, sub:'2n', texts:[38] },
  { l:'propositum, propositi', m:'σκοπός', t:'ουδέτερο', d:2, sub:'2n', texts:[38] },
  { l:'amentum, amenti',   m:'ιμάντας',    t:'ουδέτερο', d:2, sub:'2n', texts:[45] },
  { l:'castrum, castri',   m:'φρούριο (πληθ. castra = στρατόπεδο)', t:'ουδέτερο', d:2, sub:'2n', texts:[7,16,17,20,31,42,43,45] },
  { l:'frumentum, frumenti', m:'δημητριακά (πληθ. = τα γεννήματα)', t:'ουδέτερο', d:2, sub:'2n', texts:[7] },
  // ουδέτερα -ium (γεν. εν. -ii/-i)
  { l:'ephippium, ephippii', m:'σέλα, εφίππιο', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[15] },
  { l:'ingenium, ingenii', m:'πνεύμα',     t:'ουδέτερο', d:2, sub:'2n_ium', texts:[5,19,27] },
  { l:'consilium, consilii', m:'σκέψη, σχέδιο', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[6,45,47,49] },
  { l:'studium, studii',   m:'σπουδή, ασχολία', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[15] },
  { l:'proelium, proelii', m:'μάχη',       t:'ουδέτερο', d:2, sub:'2n_ium', texts:[15,19,31] },
  { l:'solarium, solarii', m:'λιακωτό',    t:'ουδέτερο', d:2, sub:'2n_ium', texts:[20] },
  { l:'imperium, imperii', m:'εξουσία',    t:'ουδέτερο', d:2, sub:'2n_ium', texts:[20,50] },
  { l:'exilium, exilii',   m:'εξορία',     t:'ουδέτερο', d:2, sub:'2n_ium', texts:[21,39], altFn:f=>f.replace(/^exilium/,'exsilium').replace(/^exili/,'exsili') },
  { l:'ostium, ostii',     m:'πόρτα',      t:'ουδέτερο', d:2, sub:'2n_ium', texts:[24] },
  { l:'praesidium, praesidii', m:'φρουρά', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[33,34] },
  { l:'matrimonium, matrimonii', m:'γάμος', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[38] },
  { l:'somnium, somnii',   m:'όνειρο',     t:'ουδέτερο', d:2, sub:'2n_ium', texts:[14] },
  { l:'supplicium, supplicii', m:'τιμωρία (πληθ. = ικεσίες, λατρεία)', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[14] },
  // κύρια -us (μόνο ενικός)
  { l:'Italicus, Italici', m:'Ιταλικός',   t:'αρσενικό', d:2, sub:'2m', texts:[5],  noPl:true },
  { l:'Ticinus, Ticini',   m:'ο Τίκινος ποταμός', t:'αρσενικό', d:2, sub:'2m', texts:[11], noPl:true },
  { l:'Maximus, Maximi',   m:'Μάξιμος',    t:'αρσενικό', d:2, sub:'2m', texts:[11], noPl:true },
  { l:'Trasumenus, Trasumeni', m:'η λίμνη Τρασιμένη', t:'αρσενικό', d:2, sub:'2m', texts:[11], noPl:true },
  { l:'Paulus, Pauli',     m:'Παύλος',     t:'αρσενικό', d:2, sub:'2m', texts:[13], noPl:true },
  { l:'Orcus, Orci',       m:'ο Πλούτωνας',t:'αρσενικό', d:2, sub:'2m', texts:[14], noPl:true },
  { l:'Octavianus, Octaviani', m:'Οκταβιανός', t:'αρσενικό', d:2, sub:'2m', texts:[14,29], noPl:true },
  { l:'Brennus, Brenni',   m:'ο Βρέννος',  t:'αρσενικό', d:2, sub:'2m', texts:[21], noPl:true },
  { l:'Camillus, Camilli', m:'ο Κάμιλλος', t:'αρσενικό', d:2, sub:'2m', texts:[21,22], noPl:true },
  { l:'Augustus, Augusti', m:'Αύγουστος',  t:'αρσενικό', d:2, sub:'2m', texts:[29,47], noPl:true },
  { l:'Africanus, Africani', m:'Αφρικανός',t:'αρσενικό', d:2, sub:'2m', texts:[34], noPl:true },
  { l:'Dentatus, Dentati', m:'Δεντάτος',   t:'αρσενικό', d:2, sub:'2m', texts:[36], noPl:true },
  { l:'Metellus, Metelli', m:'Μέτελλος',   t:'αρσενικό', d:2, sub:'2m', texts:[38], noPl:true },
  // κύρια ουδέτερα -um (μόνο ενικός)
  { l:'Saguntum, Sagunti', m:'το Σάγουντο',t:'ουδέτερο', d:2, sub:'2n', texts:[11], noPl:true },
  { l:'Hermaeum, Hermaei', m:'το Ερμαίο',  t:'ουδέτερο', d:2, sub:'2n', texts:[20], noPl:true },
  { l:'Pisaurum, Pisauri', m:'Πίσαυρο',    t:'ουδέτερο', d:2, sub:'2n', texts:[21], noPl:true },
  { l:'Tarentum, Tarenti', m:'Τάραντας',   t:'ουδέτερο', d:2, sub:'2n', texts:[27], noPl:true },
  { l:'Liternum, Literni', m:'Λίτερνο',    t:'ουδέτερο', d:2, sub:'2n', texts:[34], noPl:true },
  { l:'Capitolium, Capitolii', m:'το Καπιτώλιο', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[21], noPl:true },
  // ουδέτερα χωρίς πληθυντικό (υλικά)
  { l:'aurum, auri',       m:'χρυσάφι',    t:'ουδέτερο', d:2, sub:'2n', texts:[21,36], noPl:true },
  { l:'oleum, olei',       m:'λάδι',       t:'ουδέτερο', d:2, sub:'2n', texts:[29], noPl:true },
  { l:'caseus, casei',     m:'τυρί',       t:'αρσενικό', d:2, sub:'2m', texts:[15], noPl:true },
  // κύρια σε -ius (κλητική -i, γεν. -ii/-i, μόνο ενικός)
  { l:'Sillius, Sillii',   m:'Σίλιος',     t:'αρσενικό', d:2, sub:'2m_ius', texts:[5],  noPl:true },
  { l:'Vergilius, Vergilii', m:'Βιργίλιος',t:'αρσενικό', d:2, sub:'2m_ius', texts:[5],  noPl:true },
  { l:'Fabius, Fabii',     m:'Φάβιος',     t:'αρσενικό', d:2, sub:'2m_ius', texts:[11], noPl:true },
  { l:'Sulpicius, Sulpicii', m:'Σουλπίκιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[13,50], noPl:true },
  { l:'Aemilius, Aemilii', m:'Αιμίλιος',   t:'αρσενικό', d:2, sub:'2m_ius', texts:[13], noPl:true },
  { l:'Lucius, Lucii',     m:'Λεύκιος',    t:'αρσενικό', d:2, sub:'2m_ius', texts:[13,19], noPl:true },
  { l:'Cassius, Cassii',   m:'Κάσσιος',    t:'αρσενικό', d:2, sub:'2m_ius', texts:[14], noPl:true },
  { l:'Antonius, Antonii', m:'Αντώνιος',   t:'αρσενικό', d:2, sub:'2m_ius', texts:[14,19], noPl:true },
  { l:'Claudius, Claudii', m:'ο Κλαύδιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[20,23], noPl:true },
  { l:'Ennius, Ennii',     m:'ο Έννιος',   t:'αρσενικό', d:2, sub:'2m_ius', texts:[24], noPl:true },
  { l:'Cornelius, Cornelii', m:'Κορνήλιος',t:'αρσενικό', d:2, sub:'2m_ius', texts:[24], noPl:true },
  { l:'Accius, Accii',     m:'Άκκιος',     t:'αρσενικό', d:2, sub:'2m_ius', texts:[27], noPl:true },
  { l:'Pacuvius, Pacuvii', m:'Πακούβιος',  t:'αρσενικό', d:2, sub:'2m_ius', texts:[27], noPl:true },
  { l:'Manlius, Manlii',   m:'Μάνλιος',    t:'αρσενικό', d:2, sub:'2m_ius', texts:[31], noPl:true },
  { l:'Manius, Manii',     m:'Μάνιος',     t:'αρσενικό', d:2, sub:'2m_ius', texts:[36], noPl:true },
  { l:'Curius, Curii',     m:'Κούριος',    t:'αρσενικό', d:2, sub:'2m_ius', texts:[22,36,41], noPl:true },
  { l:'Tarquinius, Tarquinii', m:'Ταρκύνιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[44], noPl:true },
  // filius — προσηγορικό σε -ius
  { l:'filius, filii', m:'γιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[23,31,43] },
  // ελληνικά κύρια σε -eus
  { l:'Cepheus, Cephei', m:'Κηφέας', t:'αρσενικό', d:2, sub:'2m', texts:[3], noPl:true,
    s:['Cepheus',['Cephei','Cepheos'],['Cepheo','Cephei'],['Cepheum','Cephea','Cepheon'],'Cepheu','Cepheo'] },
  { l:'Perseus, Persei', m:'Περσέας (ο ήρωας)', t:'αρσενικό', d:2, sub:'2m', texts:[3], noPl:true,
    s:['Perseus',['Persei','Perseos'],['Perseo','Persei'],['Perseum','Persea','Perseon'],'Perseu','Perseo'] },
  { l:'Neptunus, Neptuni', m:'Ποσειδώνας', t:'αρσενικό', d:2, sub:'2m', texts:[3], noPl:true },
  { l:'Atreus, Atrei', m:'Ατρέας', t:'αρσενικό', d:2, sub:'2m', texts:[27], noPl:true,
    s:['Atreus','Atrei','Atreo','Atreum','Atreu','Atreo'] },
  // deus — ανώμαλο
  { l:'deus, dei', m:'θεός', t:'αρσενικό', d:2, sub:'2m', texts:[3,22,34,37,46],
    s:['deus','dei','deo','deum',['deus','dive'],'deo'],
    p:[['dei','dii','di'],['deorum','deum'],['deis','diis','dis'],'deos',['dei','dii','di'],['deis','diis','dis']] },
  // sestertius — γεν. εν. -ii (όχι συναίρεση), γεν. πληθ. -orum & -um
  { l:'sestertius, sestertii', m:'σηστέρτιος', t:'αρσενικό', d:2, sub:'2m', texts:[29],
    s:['sestertius','sestertii','sestertio','sestertium','sestertie','sestertio'],
    p:['sestertii',['sestertiorum','sestertium'],'sestertiis','sestertios','sestertii','sestertiis'] },
  // ficus — Β΄ + Δ΄
  { l:'ficus, fici', m:'σύκο, συκιά (Β΄ & Δ΄)', t:'θηλυκό', d:2, sub:'2m', texts:[25],
    s:['ficus',['fici','ficus'],'fico','ficum','ficus',['fico','ficu']],
    p:[['fici','ficus'],'ficorum','ficis',['ficos','ficus'],['fici','ficus'],'ficis'] },
  // ετερογενή
  { l:'locus, loci', m:'τόπος (πληθ. loca = τόποι, loci = χωρία βιβλίων)', t:'αρσενικό', d:2, sub:'2m', texts:[5,15,18,35,37,38,44,48],
    s:['locus','loci','loco','locum','loce','loco'],
    p:[['loca','loci'],'locorum','locis',['loca','locos'],['loca','loci'],'locis'] },
  { l:'caelum, caeli', m:'ουρανός (πληθ. ως αρσ. caeli)', t:'ουδέτερο', d:2, sub:'2n', texts:[13],
    s:['caelum','caeli','caelo','caelum','caelum','caelo'],
    p:['caeli','caelorum','caelis','caelos','caeli','caelis'] },
  { l:'catillus, catilli', m:'πιάτο (πληθ. ως ουδ. catilla)', t:'αρσενικό', d:2, sub:'2m', texts:[36],
    s:['catillus','catilli','catillo','catillum','catille','catillo'],
    p:['catilla','catillorum','catillis','catilla','catilla','catillis'] },
  // δε σχηματίζουν ενικό (Β΄)
  { l:'hiberna, hibernorum', m:'χειμερινό στρατόπεδο', t:'ουδέτερο', d:2, sub:'2n', texts:[7], noSg:true,
    p:['hiberna','hibernorum','hibernis','hiberna','hiberna','hibernis'] },
  { l:'Nervii, Nerviorum', m:'οι Νερβίοι', t:'αρσενικό', d:2, sub:'2m', texts:[7], noSg:true,
    p:['Nervii','Nerviorum','Nerviis','Nervios','Nervii','Nerviis'] },
  { l:'arma, armorum', m:'όπλα', t:'ουδέτερο', d:2, sub:'2n', texts:[16,23,31,33,34], noSg:true,
    p:['arma','armorum','armis','arma','arma','armis'] },
  { l:'domestici, domesticorum', m:'οι δούλοι του σπιτιού', t:'αρσενικό', d:2, sub:'2m', texts:[34], noSg:true,
    p:['domestici','domesticorum','domesticis','domesticos','domestici','domesticis'] },
  { l:'liberi, liberorum', m:'παιδιά', t:'αρσενικό', d:2, sub:'2m', texts:[43], noSg:true,
    p:['liberi','liberorum','liberis','liberos','liberi','liberis'] },
  { l:'Germani, Germanorum', m:'Γερμανοί', t:'αρσενικό', d:2, sub:'2m', texts:[15,17], noSg:true,
    p:['Germani','Germanorum','Germanis','Germanos','Germani','Germanis'] },

  // ══════════════ Γ΄ ΚΛΙΣΗ ══════════════
  // αρσενικά σύμφωνα
  { l:'iudex, iudicis',   m:'δικαστής',    t:'αρσενικό', d:3, sub:'3', texts:[6,30] },
  { l:'speculator, speculatoris', m:'ανιχνευτής, κατάσκοπος', t:'αρσενικό', d:3, sub:'3', texts:[7] },
  { l:'miles, militis',   m:'στρατιώτης',  t:'αρσενικό', d:3, sub:'3', texts:[7,13,19,20,23,31,39,40,45,48] },
  { l:'dux, ducis',       m:'αρχηγός, στρατηγός', t:'αρσενικό', d:3, sub:'3', texts:[11,16,21,31,33,34] },
  { l:'rex, regis',       m:'βασιλιάς',    t:'αρσενικό', d:3, sub:'3', texts:[13] },
  { l:'imperator, imperatoris', m:'στρατηγός', t:'αρσενικό', d:3, sub:'3', texts:[13,20,29,30,39] },
  { l:'terror, terroris', m:'τρόμος',      t:'αρσενικό', d:3, sub:'3', texts:[13,14] },
  { l:'homo, hominis',    m:'άνθρωπος',    t:'αρσενικό', d:3, sub:'3', texts:[14,15,22,24,28,29,32,34,41,46] },
  { l:'timor, timoris',   m:'φόβος',       t:'αρσενικό', d:3, sub:'3', texts:[14,17] },
  { l:'pes, pedis',       m:'πόδι',        t:'αρσενικό', d:3, sub:'3', texts:[15,20] },
  { l:'mercator, mercatoris', m:'έμπορος', t:'αρσενικό', d:3, sub:'3', texts:[15,17] },
  { l:'rumor, rumoris',   m:'φήμη, νέα',   t:'αρσενικό', d:3, sub:'3', texts:[20] },
  { l:'insidiator, insidiatoris', m:'συνωμότης, δολοφόνος', t:'αρσενικό', d:3, sub:'3', texts:[20] },
  { l:'commilito, commilitonis', m:'συστρατιώτης, σύντροφος', t:'αρσενικό', d:3, sub:'3', texts:[20] },
  { l:'dictator, dictatoris', m:'δικτάτορας', t:'αρσενικό', d:3, sub:'3', texts:[21] },
  { l:'victor, victoris', m:'νικητής',     t:'αρσενικό', d:3, sub:'3', texts:[29,37] },
  { l:'sutor, sutoris',   m:'παπουτσής',   t:'αρσενικό', d:3, sub:'3', texts:[29] },
  { l:'consul, consulis', m:'ύπατος',      t:'αρσενικό', d:3, sub:'3', texts:[19,31,50] },
  { l:'praedo, praedonis',m:'ληστής',      t:'αρσενικό', d:3, sub:'3', texts:[34] },
  { l:'locuples, locupletis', m:'πλούσιος',t:'αρσενικό', d:3, sub:'3', texts:[36] },
  { l:'mos, moris',       m:'έθιμο',       t:'αρσενικό', d:3, sub:'3', texts:[38] },
  { l:'ordo, ordinis',    m:'τάξη',        t:'αρσενικό', d:3, sub:'3', texts:[42] },
  { l:'exul, exulis',     m:'εξόριστος',   t:'αρσενικό', d:3, sub:'3', texts:[43], altFn:f=>f.replace(/^exul/,'exsul') },
  { l:'eques, equitis',   m:'ιππέας',      t:'αρσενικό', d:3, sub:'3', texts:[16,45] },
  { l:'pater, patris',    m:'πατέρας (πληθ. patres = πατρίκιοι)', t:'αρσενικό', d:3, sub:'3', texts:[25,26,30,35,47,50] },
  // θηλυκά σύμφωνα
  { l:'lex, legis',       m:'νόμος',       t:'θηλυκό', d:3, sub:'3', texts:[6,33,46] },
  { l:'legio, legionis',  m:'λεγεώνα',     t:'θηλυκό', d:3, sub:'3', texts:[7,21,45] },
  { l:'ratio, rationis',  m:'φύση, λογική',t:'θηλυκό', d:3, sub:'3', texts:[13] },
  { l:'magnitudo, magnitudinis', m:'μέγεθος', t:'θηλυκό', d:3, sub:'3', texts:[14,17] },
  { l:'venatio, venationis', m:'κυνήγι',   t:'θηλυκό', d:3, sub:'3', texts:[15] },
  { l:'nex, necis',       m:'θάνατος',     t:'θηλυκό', d:3, sub:'3', texts:[15] },
  { l:'potestas, potestatis', m:'δύναμη, εξουσία', t:'θηλυκό', d:3, sub:'3', texts:[15] },
  { l:'vox, vocis',       m:'φωνή',        t:'θηλυκό', d:3, sub:'3', texts:[17,24,32,34,38] },
  { l:'arbor, arboris',   m:'δέντρο',      t:'θηλυκό', d:3, sub:'3', texts:[25] },
  { l:'salutatio, salutationis', m:'χαιρετισμός', t:'θηλυκό', d:3, sub:'3', texts:[29] },
  { l:'virtus, virtutis', m:'ανδρεία',     t:'θηλυκό', d:3, sub:'3', texts:[17,22,30,31,34,39] },
  { l:'cupiditas, cupiditatis', m:'επιθυμία', t:'θηλυκό', d:3, sub:'3', texts:[31] },
  { l:'legatio, legationis', m:'πρεσβεία', t:'θηλυκό', d:3, sub:'3', texts:[36] },
  { l:'paupertas, paupertatis', m:'φτώχεια', t:'θηλυκό', d:3, sub:'3', texts:[36,39] },
  { l:'uxor, uxoris',     m:'η σύζυγος',   t:'θηλυκό', d:3, sub:'3', texts:[38,49] },
  { l:'soror, sororis',   m:'αδελφή',      t:'θηλυκό', d:3, sub:'3', texts:[38] },
  { l:'coniuratio, coniurationis', m:'συνωμοσία', t:'θηλυκό', d:3, sub:'3', texts:[42] },
  { l:'auctoritas, auctoritatis', m:'κύρος, επιρροή', t:'θηλυκό', d:3, sub:'3', texts:[42] },
  { l:'servitus, servitutis', m:'σκλαβιά', t:'θηλυκό', d:3, sub:'3', texts:[43] },
  { l:'caritas, caritatis', m:'αγάπη',     t:'θηλυκό', d:3, sub:'3', texts:[44] },
  { l:'simulatio, simulationis', m:'υποκρισία', t:'θηλυκό', d:3, sub:'3', texts:[44] },
  { l:'mater, matris',    m:'μητέρα',      t:'θηλυκό', d:3, sub:'3', texts:[41,43] },
  // γεν. πληθ. -um & -ium
  { l:'libertas, libertatis', m:'ελευθερία', t:'θηλυκό', d:3, sub:'3', texts:[6],
    s:['libertas','libertatis','libertati','libertatem','libertas','libertate'],
    p:['libertates',['libertatum','libertatium'],'libertatibus',['libertates','libertatis'],'libertates','libertatibus'] },
  { l:'civitas, civitatis', m:'πολιτεία', t:'θηλυκό', d:3, sub:'3', texts:[6,15,16,21,46],
    s:['civitas','civitatis','civitati','civitatem','civitas','civitate'],
    p:['civitates',['civitatum','civitatium'],'civitatibus',['civitates','civitatis'],'civitates','civitatibus'] },
  { l:'aetas, aetatis', m:'ηλικία', t:'θηλυκό', d:3, sub:'3', texts:[20,27,41,47],
    s:['aetas','aetatis','aetati','aetatem','aetas','aetate'],
    p:['aetates',['aetatum','aetatium'],'aetatibus',['aetates','aetatis'],'aetates','aetatibus'] },
  // αρσ. & θηλ.
  { l:'interpres, interpretis', m:'ερμηνευτής', t:'αρσ./θηλ.', d:3, sub:'3', texts:[6] },
  { l:'coniunx, coniugis', m:'σύζυγος', t:'αρσ./θηλ.', d:3, sub:'3', texts:[43],
    s:[['coniunx','coniux'],'coniugis','coniugi','coniugem',['coniunx','coniux'],'coniuge'],
    p:['coniuges','coniugum','coniugibus','coniuges','coniuges','coniugibus'] },
  // ουδέτερα σύμφωνα
  { l:'corpus, corporis', m:'σώμα',        t:'ουδέτερο', d:3, sub:'3n', texts:[6,17,18,22,32,40] },
  { l:'nomen, nominis',   m:'όνομα',       t:'ουδέτερο', d:3, sub:'3n', texts:[14,20,21,27,30] },
  { l:'caput, capitis',   m:'κεφάλι, θανατική ποινή', t:'ουδέτερο', d:3, sub:'3n', texts:[14] },
  { l:'flumen, fluminis', m:'ποταμός',     t:'ουδέτερο', d:3, sub:'3n', texts:[15,21] },
  { l:'ius, iuris',       m:'δίκαιο',      t:'ουδέτερο', d:3, sub:'3n', texts:[21] },
  { l:'discrimen, discriminis', m:'κίνδυνος', t:'ουδέτερο', d:3, sub:'3n', texts:[25] },
  { l:'certamen, certaminis', m:'αγώνας',  t:'ουδέτερο', d:3, sub:'3n', texts:[31] },
  { l:'genus, generis',   m:'γενιά',       t:'ουδέτερο', d:3, sub:'3n', texts:[19,30,31] },
  { l:'pondus, ponderis', m:'βάρος',       t:'ουδέτερο', d:3, sub:'3n', texts:[36] },
  { l:'omen, ominis',     m:'οιωνός',      t:'ουδέτερο', d:3, sub:'3n', texts:[38] },
  { l:'tempus, temporis', m:'χρόνος',      t:'ουδέτερο', d:3, sub:'3n', texts:[44,47] },
  { l:'lac, lactis',      m:'γάλα',        t:'ουδέτερο', d:3, sub:'3n', texts:[15], noPl:true },
  // ισοσύλλαβα & φωνηεντόληκτα i-stem
  { l:'hostis, hostis',   m:'εχθρός, αντίπαλος', t:'αρσενικό', d:3, sub:'3i', texts:[7,16,25,31,40,43,45] },
  { l:'collis, collis',   m:'λόφος',       t:'αρσενικό', d:3, sub:'3i', texts:[7] },
  { l:'clades, cladis',   m:'καταστροφή, συντριβή', t:'θηλυκό', d:3, sub:'3i', texts:[11] },
  { l:'pellis, pellis',   m:'δέρμα',       t:'θηλυκό', d:3, sub:'3i', texts:[15] },
  { l:'foris, foris',     m:'πόρτα',       t:'θηλυκό', d:3, sub:'3i', texts:[20,34] },
  { l:'postis, postis',   m:'παραστάδα',   t:'αρσενικό', d:3, sub:'3i', texts:[34] },
  { l:'finis, finis',     m:'τέλος, σύνορο', t:'αρσενικό', d:3, sub:'3i', texts:[30,43] },
  { l:'caedes, caedis',   m:'σφαγή',       t:'θηλυκό', d:3, sub:'3i', texts:[7,16,20],
    s:['caedes','caedis','caedi','caedem','caedes','caede'],
    p:['caedes',['caedium','caedum'],'caedibus',['caedes','caedis'],'caedes','caedibus'] },
  { l:'avis, avis',       m:'πουλί',       t:'θηλυκό', d:3, sub:'3i', texts:[29],
    s:['avis','avis','avi','avem','avis',['ave','avi']],
    p:['aves','avium','avibus',['aves','avis'],'aves','avibus'] },
  { l:'turris, turris',   m:'πύργος',      t:'θηλυκό', d:3, sub:'3i', texts:[45],
    s:['turris','turris','turri','turrim','turris','turri'],
    p:['turres','turrium','turribus',['turres','turris'],'turres','turribus'] },
  { l:'Neapolis, Neapolis', m:'η Νεάπολη', t:'θηλυκό', d:3, sub:'3i', texts:[5], noPl:true,
    s:['Neapolis','Neapolis','Neapoli','Neapolim','Neapolis','Neapoli'] },
  // χειλικόληκτα / δύο σύμφωνα i-stem
  { l:'mens, mentis',     m:'νους',        t:'θηλυκό', d:3, sub:'3i', texts:[6,29,32] },
  { l:'fons, fontis',     m:'πηγή',        t:'αρσενικό', d:3, sub:'3i', texts:[6] },
  { l:'gens, gentis',     m:'λαός, έθνος', t:'θηλυκό', d:3, sub:'3i', texts:[11] },
  { l:'ars, artis',       m:'τέχνη',       t:'θηλυκό', d:3, sub:'3i', texts:[13] },
  { l:'caro, carnis',     m:'κρέας',       t:'θηλυκό', d:3, sub:'3i', texts:[15] },
  { l:'urbs, urbis',      m:'πόλη',        t:'θηλυκό', d:3, sub:'3i', texts:[18,19,21,25,27,37,40,46] },
  { l:'mors, mortis',     m:'θάνατος',     t:'θηλυκό', d:3, sub:'3i', texts:[31,32,40] },
  { l:'adulescens, adulescentis', m:'νεαρός', t:'αρσενικό', d:3, sub:'3i', texts:[31] },
  { l:'nox, noctis',      m:'νύχτα',       t:'θηλυκό', d:3, sub:'3i', texts:[13,38],
    s:['nox','noctis','nocti','noctem','nox',['nocte','noctu']],
    p:['noctes','noctium','noctibus',['noctes','noctis'],'noctes','noctibus'] },
  { l:'sedes, sedis',     m:'θέση',        t:'θηλυκό', d:3, sub:'3', texts:[38] },
  // κύρια Γ΄ (μόνο ενικός)
  { l:'Caesar, Caesaris', m:'ο Καίσαρας',  t:'αρσενικό', d:3, sub:'3', texts:[7,16,29,33,41,45,49], noPl:true },
  { l:'Hannibal, Hannibalis', m:'ο Αννίβας', t:'αρσενικό', d:3, sub:'3', texts:[11], noPl:true },
  { l:'Scipio, Scipionis',m:'ο Σκιπίωνας', t:'αρσενικό', d:3, sub:'3', texts:[11,22,34,35,50], noPl:true },
  { l:'Cato, Catonis',    m:'Κάτωνας',     t:'αρσενικό', d:3, sub:'3', texts:[25], noPl:true },
  { l:'Carthago, Carthaginis', m:'Καρχηδόνα', t:'θηλυκό', d:3, sub:'3', texts:[25,35], noPl:true },
  { l:'Cicero, Ciceronis',m:'ο Κικέρωνας', t:'αρσενικό', d:3, sub:'3', texts:[19,45], noPl:true },
  // singularia tantum (αφηρημένα)
  { l:'aequitas, aequitatis', m:'ισότητα, δικαιοσύνη', t:'θηλυκό', d:3, sub:'3', texts:[6], noPl:true },
  { l:'frugalitas, frugalitatis', m:'ολιγάρκεια', t:'θηλυκό', d:3, sub:'3', texts:[36], noPl:true },
  { l:'salus, salutis',   m:'σωτηρία',     t:'θηλυκό', d:3, sub:'3', texts:[26,31,32,45,46], noPl:true },
  // pluralia tantum Γ΄
  { l:'Alpes, Alpium',    m:'οι Άλπεις',   t:'θηλυκό', d:3, sub:'3i', texts:[11], noSg:true,
    p:['Alpes','Alpium','Alpibus',['Alpes','Alpis'],'Alpes','Alpibus'] },
  { l:'moenia, moenium',  m:'τείχη',       t:'ουδέτερο', d:3, sub:'3ni', texts:[43], noSg:true,
    p:['moenia','moenium','moenibus','moenia','moenia','moenibus'] },
  { l:'penates, penatium',m:'οι εφέστιοι θεοί', t:'αρσενικό', d:3, sub:'3i', texts:[43], noSg:true,
    p:['penates','penatium','penatibus',['penates','penatis'],'penates','penatibus'] },
  { l:'Samnites, Samnitium', m:'οι Σαμνίτες', t:'αρσενικό', d:3, sub:'3i', texts:[36], noSg:true,
    p:['Samnites','Samnitium','Samnitibus',['Samnites','Samnitis'],'Samnites','Samnitibus'] },
  { l:'opes, opum', m:'στρατιωτικές δυνάμεις (ενικ. ops, opis = βοήθεια)', t:'θηλυκό', d:3, sub:'3i', texts:[25],
    s:['-','opis','-','opem','-','ope'],
    p:['opes','opum','opibus','opes','opes','opibus'] },
  // ελλειπτικό: fors (εύχρηστο μόνο στην αφαιρετική forte)
  { l:'fors, fortis', m:'τύχη (εύχρ. μόνο αφαιρ. forte = τυχαία)', t:'θηλυκό', d:3, sub:'3i', texts:[],
    s:['-','-','-','-','-','forte'], noPl:true },
  // ελλειπτικό: vis
  { l:'vis', m:'δύναμη', t:'θηλυκό', d:3, sub:'3i', texts:[7,11,18,31],
    s:['vis','-','-','vim','-','vi'],
    p:['vires','virium','viribus',['vires','viris'],'vires','viribus'] },

  // ══════════════ Δ΄ ΚΛΙΣΗ ══════════════
  { l:'magistratus, magistratus', m:'οι αρχές, οι άρχοντες', t:'αρσενικό', d:4, sub:'4m', texts:[6,15] },
  { l:'exercitus, exercitus', m:'στρατός',  t:'αρσενικό', d:4, sub:'4m', texts:[13,14,17,19,31] },
  { l:'motus, motus',     m:'κίνηση',       t:'αρσενικό', d:4, sub:'4m', texts:[13,22] },
  { l:'metus, metus',     m:'φόβος',        t:'αρσενικό', d:4, sub:'4m', texts:[13] },
  { l:'status, status',   m:'στάση',        t:'αρσενικό', d:4, sub:'4m', texts:[13] },
  { l:'aditus, aditus',   m:'προσέγγιση',   t:'αρσενικό', d:4, sub:'4m', texts:[13] },
  { l:'usus, usus',       m:'χρήση',        t:'αρσενικό', d:4, sub:'4m', texts:[15] },
  { l:'casus, casus',     m:'τυχαίο γεγονός', t:'αρσενικό', d:4, sub:'4m', texts:[20,37,45] },
  { l:'eventus, eventus', m:'έκβαση',       t:'αρσενικό', d:4, sub:'4m', texts:[31] },
  { l:'vultus, vultus',   m:'πρόσωπο',      t:'αρσενικό', d:4, sub:'4m', texts:[17,36] },
  { l:'risus, risus',     m:'γέλιο',        t:'αρσενικό', d:4, sub:'4m', texts:[36] },
  { l:'conspectus, conspectus', m:'όψη, θέα', t:'αρσενικό', d:4, sub:'4m', texts:[43] },
  // domus — ανώμαλο (Δ΄ + Β΄)
  { l:'domus, domus', m:'σπίτι', t:'θηλυκό', d:4, sub:'4f', texts:[24,29,34,43],
    s:['domus',['domus','domi'],'domui','domum','domus','domo'],
    p:['domus',['domuum','domorum'],'domibus','domos','domus','domibus'] },
  // εύχρηστα μόνο στην αφαιρετική
  { l:'iussus, iussus', m:'σύμφωνα με τη διαταγή (αφαιρ. iussu)', t:'αρσενικό', d:4, sub:'4m', texts:[24],
    s:['-','-','-','-','-','iussu'], noPl:true },
  { l:'natus, natus', m:'ηλικία (αφαιρ. natu)', t:'αρσενικό', d:4, sub:'4m', texts:[27],
    s:['-','-','-','-','-','natu'], noPl:true },
  { l:'iniussus, iniussus', m:'παρά τη διαταγή (αφαιρ. iniussu)', t:'αρσενικό', d:4, sub:'4m', texts:[31],
    s:['-','-','-','-','-','iniussu'], noPl:true },

  // ══════════════ Ε΄ ΚΛΙΣΗ ══════════════
  { l:'res, rei',   m:'πράγμα', t:'θηλυκό',  d:5, sub:'5', texts:[14,15,16,17,19,22,25,30,32,33,37,38,39,40,45,46,47] },
  { l:'dies, diei', m:'ημέρα',  t:'αρσενικό',d:5, sub:'5', texts:[14,16,20,24,25,36,45,48] },
  { l:'species, speciei', m:'θέαμα, μορφή',  t:'θηλυκό', d:5, sub:'5', texts:[14], plNAV:true },
  { l:'facies, faciei',   m:'πρόσωπο',       t:'θηλυκό', d:5, sub:'5', texts:[14], plNAV:true },
  { l:'effigies, effigiei', m:'εικόνα, μορφή, είδωλο', t:'θηλυκό', d:5, sub:'5', texts:[14], plNAV:true },
  { l:'acies, aciei', m:'μάχη', t:'θηλυκό', d:5, sub:'5', texts:[36], plNAV:true },
  { l:'spes, spei',   m:'ελπίδα', t:'θηλυκό', d:5, sub:'5', texts:[42], plNAV:true },
  { l:'fides, fidei', m:'εμπιστοσύνη', t:'θηλυκό', d:5, sub:'5', texts:[14,33,44], noPl:true },
  // ── panel-3 sync: nouns from κείμενα 16-50 ──
  { l:'Arverni, Arvernorum', m:'οι Αρβέρνοι', t:'αρσενικό', d:2, sub:'2m', texts:[16], s:['-','-','-','-','-','-'], p:['Arverni','Arvernorum','Arvernis','Arvernos','Arverni','Arvernis'] },
  { l:'gladius, gladii', m:'το ξίφος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[16], s:['gladius',['gladii','gladi'],'gladio','gladium','gladie','gladio'], p:['gladii','gladiorum','gladiis','gladios','gladii','gladiis'] },
  { l:'numerus, numeri', m:'ο αριθμός', t:'αρσενικό', d:2, sub:'2m', texts:[16,22] },
  { l:'Sedulius, Sedulii', m:'ο Σεδούλιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[16], s:['Sedulius',['Sedulii','Seduli'],'Sedulio','Sedulium','Seduli','Sedulio'], p:['-','-','-','-','-','-'] },
  { l:'pilum, pili', m:'το ακόντιο', t:'ουδέτερο', d:2, sub:'2n', texts:[16] },
  { l:'signum, signi', m:'το λάβαρο, η σημαία', t:'ουδέτερο', d:2, sub:'2n', texts:[16] },
  { l:'tergum, tergi', m:'τα νώτα, η πλάτη', t:'ουδέτερο', d:2, sub:'2n', texts:[16] },
  { l:'Lemovices, Lemovicum', m:'οι Λεμόβικες', t:'αρσενικό', d:3, sub:'3', texts:[16], s:['-','-','-','-','-','-'], p:['Lemovices','Lemovicum','Lemovicibus','Lemovices','Lemovices','Lemovicibus'] },
  { l:'princeps, principis', m:'ο ηγεμόνας', t:'αρσενικό', d:3, sub:'3', texts:[16] },
  { l:'Vercingetorix, Vercingetorigis', m:'ο Βερκιγγετόριγας', t:'αρσενικό', d:3, sub:'3', texts:[16], s:['Vercingetorix','Vercingetorigis','Vercingetorigi','Vercingetorigem','Vercingetorix','Vercingetorige'], p:['-','-','-','-','-','-'] },
  { l:'cohors, cohortis', m:'η κοόρτη', t:'θηλυκό', d:3, sub:'3i', texts:[16], s:['cohors','cohortis','cohorti','cohortem','cohors','cohorte'], p:['cohortes','cohortium','cohortibus','cohortes','cohortes','cohortibus'] },
  { l:'equitatus, equitatus', m:'το ιππικό', t:'αρσενικό', d:4, sub:'4m', texts:[16] },
  { l:'causa, causae', m:'η αιτία, ο λόγος', t:'θηλυκό', d:1, sub:'1f', texts:[17] },
  { l:'lacrima, lacrimae', m:'το δάκρυ', t:'θηλυκό', d:1, sub:'1f', texts:[17,23] },
  { l:'Galli, Gallorum', m:'οι Γαλάτες', t:'αρσενικό', d:2, sub:'2m', texts:[17], s:['-','-','-','-','-','-'], p:['Galli','Gallorum','Gallis','Gallos','Galli','Gallis'] },
  { l:'fatum, fati', m:'η μοίρα', t:'ουδέτερο', d:2, sub:'2n', texts:[17] },
  { l:'tabernaculum, tabernaculi', m:'η σκηνή', t:'ουδέτερο', d:2, sub:'2n', texts:[17] },
  { l:'testamentum, testamenti', m:'η διαθήκη', t:'ουδέτερο', d:2, sub:'2n', texts:[17] },
  { l:'familiaris, familiaris', m:'ο φίλος, ο γνωστός', t:'αρσενικό', d:3, sub:'3i', texts:[17], s:['familiaris','familiaris','familiari','familiarem','familiaris','familiari'], p:['familiares','familiarium','familiaribus','familiares','familiares','familiaribus'] },
  { l:'pudor, pudoris', m:'η ντροπή', t:'αρσενικό', d:3, sub:'3', texts:[17], s:['pudor','pudoris','pudori','pudorem','pudor','pudore'], p:['-','-','-','-','-','-'] },
  { l:'cauda, caudae', m:'η ουρά', t:'θηλυκό', d:1, sub:'1f', texts:[18] },
  { l:'clava, clavae', m:'το ρόπαλο', t:'θηλυκό', d:1, sub:'1f', texts:[18] },
  { l:'spelunca, speluncae', m:'η σπηλιά', t:'θηλυκό', d:1, sub:'1f', texts:[18] },
  { l:'via, viae', m:'ο δρόμος', t:'θηλυκό', d:1, sub:'1f', texts:[18] },
  { l:'Cacus, Caci', m:'ο Κάκος', t:'αρσενικό', d:2, sub:'2m', texts:[18], s:['Cacus','Caci','Caco','Cacum','Cace','Caco'], p:['-','-','-','-','-','-'] },
  { l:'fluvius, fluvii', m:'ο ποταμός', t:'αρσενικό', d:2, sub:'2m_ius', texts:[18] },
  { l:'Romulus, Romuli', m:'ο Ρωμύλος', t:'αρσενικό', d:2, sub:'2m', texts:[18], s:['Romulus','Romuli','Romulo','Romulum','Romule','Romulo'], p:['-','-','-','-','-','-'] },
  { l:'vestigium, vestigii', m:'το ίχνος', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[18] },
  { l:'bos, bovis', m:'το βόδι', t:'αρσ./θηλ.', d:3, sub:'3', texts:[18], s:['bos','bovis','bovi','bovem','bos','bove'], p:['boves',['boum','bovum'],['bobus','bubus'],'boves','boves',['bobus','bubus']] },
  { l:'Geryon, Geryonis', m:'ο Γηρυόνης', t:'αρσενικό', d:3, sub:'3', texts:[18], s:['Geryon','Geryonis','Geryoni','Geryonem','Geryon','Geryone'], p:['-','-','-','-','-','-'] },
  { l:'grex, gregis', m:'το κοπάδι', t:'αρσενικό', d:3, sub:'3', texts:[18] },
  { l:'Hercules, Herculis', m:'ο Ηρακλής', t:'αρσενικό', d:3, sub:'3', texts:[18], s:['Hercules',['Herculis','Herculi'],'Herculi','Herculem','Hercules','Hercule'], p:['-','-','-','-','-','-'] },
  { l:'pastor, pastoris', m:'ο βοσκός', t:'αρσενικό', d:3, sub:'3', texts:[18] },
  { l:'Tiberis, Tiberis', m:'ο Τίβερης', t:'αρσενικό', d:3, sub:'3i', texts:[18], s:['Tiberis','Tiberis','Tiberi','Tiberim','Tiberis','Tiberi'], p:['-','-','-','-','-','-'] },
  { l:'pars, partis', m:'το μέρος, το τμήμα', t:'θηλυκό', d:3, sub:'3i', texts:[18,23,46] },
  { l:'mugitus, mugitus', m:'το μουγκρητό', t:'αρσενικό', d:4, sub:'4m', texts:[18] },
  { l:'Marcus, Marci', m:'ο Μάρκος', t:'αρσενικό', d:2, sub:'2m', texts:[19], s:['Marcus','Marci','Marco','Marcum','Marce','Marco'], p:['-','-','-','-','-','-'] },
  { l:'Tullius, Tullii (Tulli)', m:'ο Τύλλιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[19], s:['Tullius',['Tullii','Tulli'],'Tullio','Tullium','Tulli','Tullio'], p:['-','-','-','-','-','-'] },
  { l:'Gaius, Gaii (Gai)', m:'ο Γάιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[19], s:['Gaius',['Gaii','Gai'],'Gaio','Gaium','Gai','Gaio'], p:['-','-','-','-','-','-'] },
  { l:'Sergius, Sergii (Sergi)', m:'ο Σέργιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[19], s:['Sergius',['Sergii','Sergi'],'Sergio','Sergium','Sergi','Sergio'], p:['-','-','-','-','-','-'] },
  { l:'socius, socii', m:'ο σύντροφος, ο εταίρος, ο σύμμαχος', t:'αρσενικό', d:2, sub:'2m', texts:[19] },
  { l:'Sallustius, Sallustii (Sallusti)', m:'ο Σαλλούστιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[19], s:['Sallustius',['Sallustii','Sallusti'],'Sallustio','Sallustium','Sallusti','Sallustio'], p:['-','-','-','-','-','-'] },
  { l:'carcer, carceris', m:'η φυλακή, το δεσμωτήριο', t:'αρσενικό', d:3, sub:'3', texts:[19] },
  { l:'res publica, rei publicae', m:'η πολιτεία, το κράτος', t:'θηλυκό', d:5, sub:'5', texts:[19,22,32], s:['res publica','rei publicae','rei publicae','rem publicam','res publica','re publica'], p:['res publicae','rerum publicarum','rebus publicis','res publicas','res publicae','rebus publicis'] },
  { l:'Brutus, Bruti', m:'ο Βρούτος', t:'αρσενικό', d:2, sub:'2m', texts:[22,49] },
  { l:'Decius, Decii', m:'ο Δέκιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[22] },
  { l:'Fabricius, Fabricii', m:'ο Φαβρίκιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[22,41] },
  { l:'boni, bonorum', m:'οι καλοί πολίτες', t:'αρσενικό', d:2, sub:'2m', texts:[22], s:['-','-','-','-','-','-'], p:['boni','bonorum','bonis','bonos','boni','bonis'] },
  { l:'posteritas, posteritatis', m:'το μέλλον, οι μεταγενέστεροι', t:'θηλυκό', d:3, sub:'3', texts:[22], s:['posteritas','posteritatis','posteritati','posteritatem','posteritas','posteritate'], p:['-','-','-','-','-','-'] },
  { l:'coetus, coetus', m:'η συγκέντρωση, η συνάθροιση', t:'αρσενικό', d:4, sub:'4m', texts:[22] },
  { l:'senatus, senatus', m:'η Σύγκλητος', t:'αρσενικό', d:4, sub:'4m', texts:[22,35,40,50], s:['senatus','senatus',['senatui','senatu'],'senatum','senatus','senatu'], p:['-','-','-','-','-','-'] },
  { l:'fructus, fructus', m:'ο καρπός, η ωφέλεια, το κέρδος', t:'αρσενικό', d:4, sub:'4m', texts:[22] },
  { l:'Caecina, Caecinae', m:'Καικίνας', t:'αρσενικό', d:1, sub:'1m', texts:[23], s:['Caecina','Caecinae','Caecinae','Caecinam','Caecina','Caecina'], p:['-','-','-','-','-','-'] },
  { l:'Arria, Arriae', m:'Αρρία', t:'θηλυκό', d:1, sub:'1f', texts:[23], s:['Arria','Arriae','Arriae','Arriam','Arria','Arria'], p:['-','-','-','-','-','-'] },
  { l:'navicula, naviculae', m:'πλοιάριο', t:'θηλυκό', d:1, sub:'1f', texts:[23] },
  { l:'Paetus, Paeti', m:'Παίτος', t:'αρσενικό', d:2, sub:'2m', texts:[23], s:['Paetus','Paeti','Paeto','Paetum','Paete','Paeto'], p:['-','-','-','-','-','-'] },
  { l:'maritus, mariti', m:'σύζυγος', t:'αρσενικό', d:2, sub:'2m', texts:[23] },
  { l:'cibus, cibi', m:'τροφή', t:'αρσενικό', d:2, sub:'2m', texts:[23] },
  { l:'oculus, oculi', m:'μάτι', t:'αρσενικό', d:2, sub:'2m', texts:[23] },
  { l:'Scribonianus, Scriboniani', m:'Σκριβωνιανός', t:'αρσενικό', d:2, sub:'2m', texts:[23], s:['Scribonianus','Scriboniani','Scriboniano','Scribonianum','Scriboniane','Scriboniano'], p:['-','-','-','-','-','-'] },
  { l:'cubiculum, cubiculi', m:'κρεβατοκάμαρα', t:'ουδέτερο', d:2, sub:'2n', texts:[23,48,49] },
  { l:'Illyricum, Illyrici', m:'Ιλλυρία', t:'ουδέτερο', d:2, sub:'2n', texts:[23], s:['Illyricum','Illyrici','Illyrico','Illyricum','Illyricum','Illyrico'], p:['-','-','-','-','-','-'] },
  { l:'dolor, doloris', m:'θλίψη', t:'αρσενικό', d:3, sub:'3', texts:[23,28,39] },
  { l:'navis, navis', m:'πλοίο', t:'θηλυκό', d:3, sub:'3i', texts:[23], s:['navis','navis','navi','navem','navis',['nave','navi']], p:['naves','navium','navibus',['naves','navis'],'naves','navibus'] },
  { l:'funus, funeris', m:'κηδεία', t:'ουδέτερο', d:3, sub:'3n', texts:[23] },
  { l:'Publius, Publii', m:'ο Πόπλιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[24,50], s:['Publius',['Publii','Publi'],'Publio','Publium','Publi','Publio'], p:['-','-','-','-','-','-'] },
  { l:'prudentia, prudentiae', m:'φρόνηση, σύνεση', t:'θηλυκό', d:1, sub:'1f', texts:[26], s:['prudentia','prudentiae','prudentiae','prudentiam','prudentia','prudentia'], p:['-','-','-','-','-','-'] },
  { l:'patientia, patientiae', m:'υπομονή', t:'θηλυκό', d:1, sub:'1f', texts:[26], s:['patientia','patientiae','patientiae','patientiam','patientia','patientia'], p:['-','-','-','-','-','-'] },
  { l:'constantia, constantiae', m:'εγκαρτέρηση', t:'θηλυκό', d:1, sub:'1f', texts:[26], s:['constantia','constantiae','constantiae','constantiam','constantia','constantia'], p:['-','-','-','-','-','-'] },
  { l:'C. Plinius, Plinii', m:'(Γάιος) Πλίνιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[26], s:['Plinius',['Plinii','Plini'],'Plinio','Plinium','Plini','Plinio'], p:['-','-','-','-','-','-'] },
  { l:'Marcellinus, Marcellini', m:'Μαρκελλίνος', t:'αρσενικό', d:2, sub:'2m', texts:[26], s:['Marcellinus','Marcellini','Marcellino','Marcellinum','Marcelline','Marcellino'], p:['-','-','-','-','-','-'] },
  { l:'Fundanus, Fundani', m:'Φουνδανός', t:'αρσενικό', d:2, sub:'2m', texts:[26], s:['Fundanus','Fundani','Fundano','Fundanum','Fundane','Fundano'], p:['-','-','-','-','-','-'] },
  { l:'paedagogus, paedagogi', m:'ο παιδαγωγός', t:'αρσενικό', d:2, sub:'2m', texts:[26] },
  { l:'praeceptor, praeceptoris', m:'ο δάσκαλος', t:'αρσενικό', d:3, sub:'3', texts:[26] },
  { l:'gravitas, gravitatis', m:'σοβαρότητα, σεμνότητα', t:'θηλυκό', d:3, sub:'3', texts:[26] },
  { l:'suavitas, suavitatis', m:'γλυκύτητα', t:'θηλυκό', d:3, sub:'3', texts:[26] },
  { l:'cervix, cervicis', m:'ο τράχηλος, ο λαιμός', t:'θηλυκό', d:3, sub:'3', texts:[26] },
  { l:'nutrix, nutricis', m:'η τροφός', t:'θηλυκό', d:3, sub:'3', texts:[26] },
  { l:'valetudo, valetudinis', m:'(κακή) υγεία, αρρώστια', t:'θηλυκό', d:3, sub:'3', texts:[26] },
  { l:'Asia, Asiae', m:'η Ασία', t:'θηλυκό', d:1, sub:'1f', texts:[28,30], s:['Asia','Asiae','Asiae','Asiam','Asia','Asia'], p:['-','-','-','-','-','-'] },
  { l:'custodia, custodiae', m:'η φυλακή', t:'θηλυκό', d:1, sub:'1f', texts:[28] },
  { l:'diligentia, diligentiae', m:'η φροντίδα, επιμέλεια', t:'θηλυκό', d:1, sub:'1f', texts:[28] },
  { l:'audacia, audaciae', m:'το θράσος', t:'θηλυκό', d:1, sub:'1f', texts:[28], s:['audacia','audaciae','audaciae','audaciam','audacia','audacia'], p:['-','-','-','-','-','-'] },
  { l:'Aesopus, Aesopi', m:'ο Αίσωπος', t:'αρσενικό', d:2, sub:'2m', texts:[28], s:['Aesopus','Aesopi','Aesopo','Aesopum','Aesope','Aesopo'], p:['-','-','-','-','-','-'] },
  { l:'Licinus, Licini', m:'ο Λίκινος', t:'αρσενικό', d:2, sub:'2m', texts:[28], s:['Licinus','Licini','Licino','Licinum','Licine','Licino'], p:['-','-','-','-','-','-'] },
  { l:'fugitivus, fugitivi', m:'ο δραπέτης, φυγάς', t:'αρσενικό', d:2, sub:'2m', texts:[28] },
  { l:'Ephesus, Ephesi', m:'η Έφεσος', t:'θηλυκό', d:2, sub:'2m', texts:[28], s:['Ephesus','Ephesi','Epheso','Ephesum','Ephese','Epheso'], p:['-','-','-','-','-','-'] },
  { l:'pretium, pretii', m:'η αξία, η τιμή', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[28] },
  { l:'nihilum, nihili', m:'το τίποτα', t:'ουδέτερο', d:2, sub:'2n', texts:[28], s:['nihilum','nihili','nihilo','nihilum','nihilum','nihilo'], p:['-','-','-','-','-','-'] },
  { l:'Patro, Patronis', m:'ο Πάτρωνας', t:'αρσενικό', d:3, sub:'3', texts:[28], s:[['Patro','Patron'],'Patronis','Patroni',['Patronem','Patrona'],['Patro','Patron'],'Patrone'], p:['-','-','-','-','-','-'] },
  { l:'mensis, mensis', m:'ο μήνας', t:'αρσενικό', d:3, sub:'3i', texts:[28], s:['mensis','mensis','mensi','mensem','mensis','mense'], p:['menses',['mensium','mensum'],'mensibus',['menses','mensis'],'menses','mensibus'] },
  { l:'Plato, Platonis', m:'ο Πλάτωνας', t:'αρσενικό', d:3, sub:'3', texts:[28,35], s:[['Plato','Platon'],'Platonis','Platoni',['Platonem','Platona'],['Plato','Platon'],'Platone'], p:['-','-','-','-','-','-'] },
  { l:'recuperatio, recuperationis', m:'η επανάκτηση', t:'θηλυκό', d:3, sub:'3', texts:[28] },
  { l:'scelus, sceleris', m:'το έγκλημα, η ελεεινή πράξη', t:'ουδέτερο', d:3, sub:'3n', texts:[28] },
  { l:'Murena, Murenae', m:'ο Μουρήνας', t:'αρσενικό', d:1, sub:'1m', texts:[30], s:['Murena','Murenae','Murenae','Murenam','Murena','Murena'], p:['-','-','-','-','-','-'] },
  { l:'luxuria, luxuriae', m:'η τρυφή, η πολυτέλεια', t:'θηλυκό', d:1, sub:'1f', texts:[30], s:['luxuria','luxuriae','luxuriae','luxuriam','luxuria','luxuria'], p:['-','-','-','-','-','-'] },
  { l:'familia, familiae', m:'η οικογένεια', t:'θηλυκό', d:1, sub:'1f', texts:[30], s:['familia',['familiae','familias'],'familiae','familiam','familia','familia'], p:['familiae','familiarum','familiis','familias','familiae','familiis'] },
  { l:'memoria, memoriae', m:'η μνήμη, η υστεροφημία', t:'θηλυκό', d:1, sub:'1f', texts:[30,41] },
  { l:'triumphus, triumphi', m:'ο θρίαμβος', t:'αρσενικό', d:2, sub:'2m', texts:[30] },
  { l:'adiumentum, adiumenti', m:'η βοήθεια', t:'ουδέτερο', d:2, sub:'2n', texts:[30] },
  { l:'solacium, solacii', m:'η παρηγοριά', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[30] },
  { l:'flagitium, flagitii', m:'το όνειδος', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[30] },
  { l:'stipendium, stipendii', m:'η θητεία (πληθ. stipendia)· ο μισθός (ενικ.)', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[30] },
  { l:'labor, laboris', m:'ο μόχθος', t:'αρσενικό', d:3, sub:'3', texts:[30] },
  { l:'accusator, accusatoris', m:'ο κατήγορος', t:'αρσενικό', d:3, sub:'3', texts:[30] },
  { l:'honos / honor, honoris', m:'η τιμή', t:'αρσενικό', d:3, sub:'3', texts:[30], s:[['honos','honor'],'honoris','honori','honorem',['honos','honor'],'honore'], p:['honores','honorum','honoribus','honores','honores','honoribus'] },
  { l:'gratulatio, gratulationis', m:'η έκφραση συγχαρητηρίων', t:'θηλυκό', d:3, sub:'3', texts:[30] },
  { l:'suspicio, suspicionis', m:'η υποψία', t:'θηλυκό', d:3, sub:'3', texts:[30] },
  { l:'laus, laudis', m:'ο έπαινος', t:'θηλυκό', d:3, sub:'3', texts:[30,32] },
  { l:'pietas, pietatis', m:'η ευσέβεια, ο σεβασμός', t:'θηλυκό', d:3, sub:'3', texts:[30] },
  { l:'felicitas, felicitatis', m:'η ευτυχία, η καλή τύχη', t:'θηλυκό', d:3, sub:'3', texts:[30] },
  { l:'dedecus, dedecoris', m:'η ντροπή', t:'ουδέτερο', d:3, sub:'3n', texts:[30] },
  { l:'luxuries, luxuriei', m:'η τρυφή, η πολυτέλεια', t:'θηλυκό', d:5, sub:'5', texts:[30], s:['luxuries','luxuriei','luxuriei','luxuriem','luxuries','luxurie'], p:['-','-','-','-','-','-'] },
  { l:'tenebrae, tenebrarum', m:'το σκοτάδι, η αφάνεια', t:'θηλυκό', d:1, sub:'1f', texts:[32], s:['-','-','-','-','-','-'], p:['tenebrae','tenebrarum','tenebris','tenebras','tenebrae','tenebris'] },
  { l:'Graecus, Graeci', m:'ο Έλληνας', t:'αρσενικό', d:2, sub:'2m', texts:[32] },
  { l:'Latinus, Latini', m:'ο Λατίνος', t:'αρσενικό', d:2, sub:'2m', texts:[32] },
  { l:'sapiens, sapientis', m:'ο σοφός', t:'αρσενικό', d:3, sub:'3i', texts:[32,39], s:['sapiens','sapientis','sapienti','sapientem','sapiens','sapiente'], p:['sapientes','sapientium','sapientibus','sapientes','sapientes','sapientibus'] },
  { l:'scriptor, scriptoris', m:'ο συγγραφέας', t:'αρσενικό', d:3, sub:'3', texts:[32] },
  { l:'vetustas, vetustatis', m:'η αρχαιότητα', t:'θηλυκό', d:3, sub:'3', texts:[32] },
  { l:'imago, imaginis', m:'η εικόνα', t:'θηλυκό', d:3, sub:'3', texts:[32] },
  { l:'honestas, honestatis', m:'η τιμή, η δόξα', t:'θηλυκό', d:3, sub:'3', texts:[32] },
  { l:'dimicatio, dimicationis', m:'ο αγώνας', t:'θηλυκό', d:3, sub:'3', texts:[32] },
  { l:'lumen, luminis', m:'το φως', t:'ουδέτερο', d:3, sub:'3n', texts:[32] },
  { l:'cruciatus, cruciatus', m:'το βάσανο, η ταλαιπωρία', t:'αρσενικό', d:4, sub:'4m', texts:[32] },
  { l:'iudicium, iudicii', m:'το δικαστήριο, η δικαιοσύνη', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[33] },
  { l:'ornamentum, ornamenti', m:'το στολίδι, το διακριτικό', t:'ουδέτερο', d:2, sub:'2n', texts:[33] },
  { l:'ardor, ardoris', m:'το πάθος', t:'αρσενικό', d:3, sub:'3', texts:[33] },
  { l:'dignitas, dignitatis', m:'το κύρος', t:'θηλυκό', d:3, sub:'3', texts:[33], s:['dignitas','dignitatis','dignitati','dignitatem','dignitas','dignitate'], p:['dignitates',['dignitatum','dignitatium'],'dignitatibus','dignitates','dignitates','dignitatibus'] },
  { l:'libido, libidinis', m:'το πάθος', t:'θηλυκό', d:3, sub:'3', texts:[33] },
  { l:'stabilitas, stabilitatis', m:'η σταθερότητα', t:'θηλυκό', d:3, sub:'3', texts:[33] },
  { l:'suboles, subolis', m:'οι απόγονοι', t:'θηλυκό', d:3, sub:'3i', texts:[33], s:['suboles','subolis','suboli','subolem','suboles','subole'], p:['suboles','subolium','subolibus','suboles','suboles','subolibus'] },
  { l:'vulnus, vulneris', m:'η πληγή, το τραύμα', t:'ουδέτερο', d:3, sub:'3n', texts:[33] },
  { l:'impetus, impetus', m:'ορμή· η λαίλαπα', t:'αρσενικό', d:4, sub:'4m', texts:[33] },
  { l:'respublica, reipublicae', m:'η πολιτεία', t:'θηλυκό', d:5, sub:'5', texts:[33], s:['respublica','reipublicae','reipublicae','rempublicam','respublica','republica'], p:['-','-','-','-','-','-'] },
  { l:'Agrippa, Agrippae', m:'ο Αγρίππας', t:'αρσενικό', d:1, sub:'1m', texts:[35], s:['Agrippa','Agrippae','Agrippae','Agrippam','Agrippa','Agrippa'], p:['-','-','-','-','-','-'] },
  { l:'Homerus, Homeri', m:'ο Όμηρος', t:'αρσενικό', d:2, sub:'2m', texts:[35], s:['Homerus','Homeri','Homero','Homerum','Homere','Homero'], p:['-','-','-','-','-','-'] },
  { l:'Menenius, Menenii', m:'ο Μενήνιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[35], s:['Menenius',['Menenii','Meneni'],'Menenio','Menenium','Meneni','Menenio'], p:['-','-','-','-','-','-'] },
  { l:'Atilius, Atilii', m:'ο Ατίλιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[35], s:['Atilius',['Atilii','Atili'],'Atilio','Atilium','Atili','Atilio'], p:['-','-','-','-','-','-'] },
  { l:'Regulus, Reguli', m:'ο Ρήγουλος', t:'αρσενικό', d:2, sub:'2m', texts:[35], s:['Regulus','Reguli','Regulo','Regulum','Regule','Regulo'], p:['-','-','-','-','-','-'] },
  { l:'Poeni, Poenorum', m:'οι Καρχηδόνιοι', t:'αρσενικό', d:2, sub:'2m', texts:[35], s:['-','-','-','-','-','-'], p:['Poeni','Poenorum','Poenis','Poenos','Poeni','Poenis'] },
  { l:'mercenarius, mercenarii', m:'ο μισθωτός εργάτης', t:'αρσενικό', d:2, sub:'2m_ius', texts:[35], s:['mercenarius','mercenarii','mercenario','mercenarium','mercenarie','mercenario'], p:['mercenarii','mercenariorum','mercenariis','mercenarios','mercenarii','mercenariis'] },
  { l:'socer, soceri', m:'ο πεθερός', t:'αρσενικό', d:2, sub:'2m_er', texts:[35] },
  { l:'aerarium, aerarii', m:'το δημόσιο ταμείο', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[35], s:['aerarium','aerarii','aerario','aerarium','aerarium','aerario'], p:['aeraria','aerariorum','aerariis','aeraria','aeraria','aerariis'] },
  { l:'tributum, tributi', m:'ο φόρος, η εισφορά', t:'ουδέτερο', d:2, sub:'2n', texts:[35] },
  { l:'Zeno, Zenonis', m:'ο Ζήνωνας', t:'αρσενικό', d:3, sub:'3', texts:[35], s:[['Zeno','Zenon'],'Zenonis','Zenoni',['Zenonem','Zenona'],['Zeno','Zenon'],'Zenone'], p:['-','-','-','-','-','-'] },
  { l:'sequester, sequestris', m:'ο μεσολαβητής', t:'αρσενικό', d:3, sub:'3i', texts:[35] },
  { l:'plebs, plebis', m:'οι πληβείοι, ο απλός λαός', t:'θηλυκό', d:3, sub:'3i', texts:[35] },
  { l:'dos, dotis', m:'η προίκα', t:'θηλυκό', d:3, sub:'3i', texts:[35] },
  { l:'aes, aeris', m:'ο χαλκός, τα χρήματα', t:'ουδέτερο', d:3, sub:'3n', texts:[35,39] },
  { l:'rus, ruris', m:'ο αγρός, η εξοχή', t:'ουδέτερο', d:3, sub:'3n', texts:[35], s:['rus','ruris','ruri','rus','rus','rure'], p:['rura','-','ruribus','rura','rura','ruribus'] },
  { l:'concordia, concordiae', m:'η ομόνοια', t:'θηλυκό', d:1, sub:'1f', texts:[37], s:['concordia','concordiae','concordiae','concordiam','concordia','concordia'], p:['-','-','-','-','-','-'] },
  { l:'natura, naturae', m:'η φύση', t:'θηλυκό', d:1, sub:'1f', texts:[37,46] },
  { l:'auxilium, auxilii', m:'η βοήθεια', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[37] },
  { l:'furor, furoris', m:'η μανία', t:'αρσενικό', d:3, sub:'3', texts:[37] },
  { l:'necessitas, necessitatis', m:'η ανάγκη', t:'θηλυκό', d:3, sub:'3', texts:[37], s:['necessitas','necessitatis','necessitati','necessitatem','necessitas','necessitate'], p:['necessitates',['necessitatum','necessitatium'],'necessitatibus',['necessitates','necessitatis'],'necessitates','necessitatibus'] },
  { l:'exitus, exitus', m:'η έκβαση', t:'αρσενικό', d:4, sub:'4m', texts:[37] },
  { l:'Phidias, Phidiae', m:'ο Φειδίας', t:'αρσενικό', d:1, sub:'1m', texts:[39], s:['Phidias','Phidiae','Phidiae',['Phidiam','Phidian'],'Phidia','Phidia'], p:['-','-','-','-','-','-'] },
  { l:'materia, materiae', m:'το υλικό, η ύλη', t:'θηλυκό', d:1, sub:'1f', texts:[39], s:['materia','materiae','materiae','materiam','materia','materia'], p:['-','-','-','-','-','-'] },
  { l:'fortuna, fortunae', m:'η τύχη', t:'θηλυκό', d:1, sub:'1f', texts:[39] },
  { l:'malum, mali', m:'οι συμφορές', t:'ουδέτερο', d:2, sub:'2n', texts:[39], s:['-','-','-','-','-','-'], p:['mala','malorum','malis','mala','mala','malis'] },
  { l:'simulacrum, simulacri', m:'το άγαλμα, το ομοίωμα', t:'ουδέτερο', d:2, sub:'2n', texts:[39] },
  { l:'ebur, eboris', m:'το ελεφαντόδοντο', t:'ουδέτερο', d:3, sub:'3n', texts:[39] },
  { l:'marmor, marmoris', m:'το μάρμαρο', t:'ουδέτερο', d:3, sub:'3n', texts:[39] },
  { l:'Sulla, Sullae', m:'ο Σύλλας', t:'αρσενικό', d:1, sub:'1m', texts:[40], s:['Sulla','Sullae','Sullae','Sullam','Sulla','Sulla'], p:['-','-','-','-','-','-'] },
  { l:'Scaevola, Scaevolae', m:'ο Σκαιόλας', t:'αρσενικό', d:1, sub:'1m', texts:[40], s:['Scaevola','Scaevolae','Scaevolae','Scaevolam','Scaevola','Scaevola'], p:['-','-','-','-','-','-'] },
  { l:'Marius, Marii', m:'ο Μάριος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[40], s:['Marius',['Marii','Mari'],'Mario','Marium','Mari','Mario'], p:['-','-','-','-','-','-'] },
  { l:'Quintus, Quinti', m:'ο Κόιντος', t:'αρσενικό', d:2, sub:'2m', texts:[40], s:['Quintus','Quinti','Quinto','Quintum','Quinte','Quinto'], p:['-','-','-','-','-','-'] },
  { l:'Mucius, Mucii', m:'ο Μούκιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[40], s:['Mucius',['Mucii','Muci'],'Mucio','Mucium','Muci','Mucio'], p:['-','-','-','-','-','-'] },
  { l:'augur, auguris', m:'ο οιωνοσκόπος', t:'αρσενικό', d:3, sub:'3', texts:[40] },
  { l:'senex, senis', m:'ο γέρος', t:'αρσενικό', d:3, sub:'3', texts:[40] },
  { l:'voluntas, voluntatis', m:'η βούληση, η θέληση', t:'θηλυκό', d:3, sub:'3', texts:[40] },
  { l:'agmen, agminis', m:'το άγημα, ο στρατός', t:'ουδέτερο', d:3, sub:'3n', texts:[40] },
  { l:'Horatius, Horatii', m:'ο Οράτιος (πληθ. = η γενιά)', t:'αρσενικό', d:2, sub:'2m_ius', texts:[41] },
  { l:'Sicanus, Sicani', m:'οι Σικανοί', t:'αρσενικό', d:2, sub:'2m', texts:[41], s:['-','-','-','-','-','-'], p:['Sicani','Sicanorum','Sicanis','Sicanos','Sicani','Sicanis'] },
  { l:'Pelasgus, Pelasgi', m:'οι Πελασγοί', t:'αρσενικό', d:2, sub:'2m', texts:[41], s:['-','-','-','-','-','-'], p:['Pelasgi','Pelasgorum','Pelasgis','Pelasgos','Pelasgi','Pelasgis'] },
  { l:'Evander, Evandri', m:'ο Εύανδρος', t:'αρσενικό', d:2, sub:'2m_er', texts:[41], s:[['Evander','Evandrus'],'Evandri','Evandro','Evandrum',['Evander','Evandre'],'Evandro'], p:['-','-','-','-','-','-'] },
  { l:'sermo, sermonis', m:'ο λόγος, τα λόγια', t:'αρσενικό', d:3, sub:'3', texts:[41,47] },
  { l:'antiquitas, antiquitatis', m:'η αρχαιότητα', t:'θηλυκό', d:3, sub:'3', texts:[41] },
  { l:'pectus, pectoris', m:'η καρδιά, το στήθος', t:'ουδέτερο', d:3, sub:'3n', texts:[41] },
  { l:'philosophus, philosophi', m:'ο φιλόσοφος', t:'αρσενικό', d:2, sub:'2m', texts:[46] },
  { l:'mundus, mundi', m:'ο κόσμος', t:'αρσενικό', d:2, sub:'2m', texts:[46] },
  { l:'proditor, proditoris', m:'ο προδότης', t:'αρσενικό', d:3, sub:'3', texts:[46] },
  { l:'desertor, desertoris', m:'ο λιποτάκτης', t:'αρσενικό', d:3, sub:'3', texts:[46] },
  { l:'utilitas, utilitatis', m:'η ωφέλεια, το συμφέρον', t:'θηλυκό', d:3, sub:'3', texts:[46] },
  { l:'numen, numinis', m:'η βούληση της θεότητας', t:'ουδέτερο', d:3, sub:'3n', texts:[46,48] },
  { l:'Iulia, Iuliae', m:'η Ιουλία (κύριο όνομα, μόνο ενικ.)', t:'θηλυκό', d:1, sub:'1f', texts:[47], s:['Iulia','Iuliae','Iuliae','Iuliam','Iulia','Iulia'], p:['-','-','-','-','-','-'] },
  { l:'cani, canorum', m:'οι άσπρες τρίχες', t:'αρσενικό', d:2, sub:'2m', texts:[47], s:['-','-','-','-','-','-'], p:['cani','canorum','canis','canos','cani','canis'] },
  { l:'mendacium, mendacii', m:'το ψέμα, το ψεύτικο επιχείρημα', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[47] },
  { l:'ornatrix, ornatricis', m:'η κομμώτρια', t:'θηλυκό', d:3, sub:'3', texts:[47] },
  { l:'vestis, vestis', m:'το φόρεμα', t:'θηλυκό', d:3, sub:'3i', texts:[47] },
  { l:'mentio, mentionis', m:'η μνεία', t:'θηλυκό', d:3, sub:'3', texts:[47] },
  { l:'cerva, cervae', m:'το ελάφι', t:'θηλυκό', d:1, sub:'1f', texts:[48] },
  { l:'Diana, Dianae', m:'η Άρτεμη', t:'θηλυκό', d:1, sub:'1f', texts:[48], s:['Diana','Dianae','Dianae','Dianam','Diana','Diana'], p:['-','-','-','-','-','-'] },
  { l:'Sertorius, Sertorii', m:'ο Σερτώριος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[48], s:['Sertorius',['Sertorii','Sertori'],'Sertorio','Sertorium','Sertori','Sertorio'], p:['-','-','-','-','-','-'] },
  { l:'Lusitanus, Lusitani', m:'ο Λουζιτανός', t:'αρσενικό', d:2, sub:'2m', texts:[48] },
  { l:'pulchritudo, pulchritudinis', m:'η ομορφιά', t:'θηλυκό', d:3, sub:'3', texts:[48], s:['pulchritudo','pulchritudinis','pulchritudini','pulchritudinem','pulchritudo','pulchritudine'], p:['-','-','-','-','-','-'] },
  { l:'admiratio, admirationis', m:'ο θαυμασμός, η κατάπληξη', t:'θηλυκό', d:3, sub:'3', texts:[48], s:['admiratio','admirationis','admirationi','admirationem','admiratio','admiratione'], p:['-','-','-','-','-','-'] },
  { l:'Porcia, Porciae', m:'η Πορκία', t:'θηλυκό', d:1, sub:'1f', texts:[49], s:['Porcia','Porciae','Porciae','Porciam','Porcia','Porcia'], p:['-','-','-','-','-','-'] },
  { l:'cultellus, cultelli', m:'το μαχαιράκι, το ξυράφι', t:'αρσενικό', d:2, sub:'2m', texts:[49] },
  { l:'officium, officii', m:'το καθήκον, η τέχνη', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[49] },
  { l:'indicium, indicii', m:'η απόδειξη, το τεκμήριο', t:'ουδέτερο', d:2, sub:'2n_ium', texts:[49] },
  { l:'ferrum, ferri', m:'το σίδερο, το (σιδερένιο) όπλο', t:'ουδέτερο', d:2, sub:'2n', texts:[49] },
  { l:'unguis, unguis', m:'το νύχι', t:'αρσενικό', d:3, sub:'3i', texts:[49] },
  { l:'clamor, clamoris', m:'η κραυγή', t:'αρσενικό', d:3, sub:'3', texts:[49] },
  { l:'tonsor, tonsoris', m:'ο μανικιουρίστας/κουρέας', t:'αρσενικό', d:3, sub:'3', texts:[49] },
  { l:'amor, amoris', m:'η αγάπη', t:'αρσενικό', d:3, sub:'3', texts:[49] },
  { l:'Galba, Galbae', m:'ο Γάλβας', t:'αρσενικό', d:1, sub:'1m', texts:[50], s:['Galba','Galbae','Galbae','Galbam','Galba','Galba'], p:['-','-','-','-','-','-'] },
  { l:'Cotta, Cottae', m:'ο Κόττας', t:'αρσενικό', d:1, sub:'1m', texts:[50], s:['Cotta','Cottae','Cottae','Cottam','Cotta','Cotta'], p:['-','-','-','-','-','-'] },
  { l:'magistra, magistrae', m:'η δασκάλα, η σύμβουλος', t:'θηλυκό', d:1, sub:'1f', texts:[50] },
  { l:'avaritia, avaritiae', m:'η απληστία', t:'θηλυκό', d:1, sub:'1f', texts:[50], s:['avaritia','avaritiae','avaritiae','avaritiam','avaritia','avaritia'], p:['-','-','-','-','-','-'] },
  { l:'provincia, provinciae', m:'η επαρχία', t:'θηλυκό', d:1, sub:'1f', texts:[50] },
  { l:'malevolentia, malevolentiae', m:'η κακοβουλία', t:'θηλυκό', d:1, sub:'1f', texts:[50], s:['malevolentia','malevolentiae','malevolentiae','malevolentiam','malevolentia','malevolentia'], p:['-','-','-','-','-','-'] },
  { l:'Servius, Servii', m:'ο Σέρβιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[50], s:['Servius',['Servii','Servi'],'Servio','Servium','Servi','Servio'], p:['-','-','-','-','-','-'] },
  { l:'Aurelius, Aurelii', m:'ο Αυρήλιος', t:'αρσενικό', d:2, sub:'2m_ius', texts:[50], s:['Aurelius',['Aurelii','Aureli'],'Aurelio','Aurelium','Aureli','Aurelio'], p:['-','-','-','-','-','-'] },
  { l:'Viriathus, Viriathi', m:'ο Βιρίαθος', t:'αρσενικό', d:2, sub:'2m', texts:[50], s:['Viriathus','Viriathi','Viriatho','Viriathum','Viriathe','Viriatho'], p:['-','-','-','-','-','-'] },
  { l:'Aemilianus, Aemiliani', m:'ο Αιμιλιανός', t:'αρσενικό', d:2, sub:'2m', texts:[50], s:['Aemilianus','Aemiliani','Aemiliano','Aemilianum','Aemiliane','Aemiliano'], p:['-','-','-','-','-','-'] },
  { l:'dissensio, dissensionis', m:'η διαφωνία', t:'θηλυκό', d:3, sub:'3', texts:[50] },
];

// ── expand: generate regular paradigms + apply defective flags ───────────────
const LATNK_DB = LATNK_RAW.map(e => {
  const o = Object.assign({}, e);
  if (!o.s || !o.p) {
    const parts = o.l.split(',');
    const nom = parts[0].trim();
    const gen = (parts[1] || '').trim();
    const dec = _latnkDecline(nom, gen, o.d, o.sub);
    if (!o.s) o.s = dec.s;
    if (!o.p) o.p = dec.p;
  }
  // altFn: accept an alternate spelling of every form (e.g. exul→exsul, preda→praeda)
  if (o.altFn) {
    const addAlt = cell => {
      if (cell === '-') return cell;
      const base = Array.isArray(cell) ? cell : [cell];
      const out = [];
      base.forEach(f => { out.push(f); const a = o.altFn(f); if (a !== f && !out.includes(a)) out.push(a); });
      return out.length > 1 ? out : out[0];
    };
    o.s = o.s.map(addAlt); o.p = o.p.map(addAlt);
  }
  if (o.noSg) o.s = ['-','-','-','-','-','-'];
  if (o.noPl) o.p = ['-','-','-','-','-','-'];
  if (o.plNAV) o.p = [o.p[0], '-', '-', o.p[3], o.p[4], '-'];
  return o;
});

// ── map: text number → nouns appearing in it ─────────────────────────────────
const LATNK_BY_TEXT = {};
LATNK_DB.forEach(n => {
  n.texts.forEach(t => { (LATNK_BY_TEXT[t] = LATNK_BY_TEXT[t] || []).push(n); });
});
// sorted list of texts that contain at least one noun
const LATNK_TEXTS = Object.keys(LATNK_BY_TEXT).map(Number).sort((a, b) => a - b);
