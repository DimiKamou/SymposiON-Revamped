'use strict';

// ============================================================
//  ΛΑΤΙΝΙΚΕΣ ΑΝΤΩΝΥΜΙΕΣ — Πλήρης Βάση Δεδομένων
//  (Επαναληπτική ύλη, πανελλαδικώς εξεταζόμενα κείμενα)
//
//  Format per entry:
//  { l:'λήμμα', t:'γένος', sub:'κλειδί κατηγορίας',
//    s:[nom, gen, dat, acc, voc, abl]   ← Ενικός
//    p:[nom, gen, dat, acc, voc, abl] } ← Πληθυντικός
//  '-' = δεν υπάρχει τύπος.  (Οι αντωνυμίες, κατά κανόνα, δεν
//  διαθέτουν κλητική, εξαίρεση οι κτητικές meus/mea στον ενικό.)
//
//  Κατηγορίες (sub prefix):
//   pers_  Προσωπικές · poss_ Κτητικές · dem_ Δεικτικές ·
//   det_   Οριστικές  · rel_  Αναφορικές · int_ Ερωτηματικές ·
//   ind_   Αόριστες
// ============================================================

const LAT_P_CASES = ['Ονομαστική','Γενική','Δοτική','Αιτιατική','Κλητική','Αφαιρετική'];

const LAT_P_DB = [

  // ── 1. ΠΡΟΣΩΠΙΚΕΣ (pronomina personalia) ────────────────────────────────────
  { l:'ego / nos', t:'αόριστο', sub:'pers1',
    s:['ego','mei','mihi','me','-','me'],
    p:['nos','nostri, nostrum','nobis','nos','-','nobis'] },
  { l:'tu / vos', t:'αόριστο', sub:'pers2',
    s:['tu','tui','tibi','te','-','te'],
    p:['vos','vestri, vestrum','vobis','vos','-','vobis'] },
  // γ΄ πρόσωπο (αυτοπαθητική) — χωρίς ονομαστική, ίδια σε ενικό & πληθυντικό
  { l:'sui, sibi, se', t:'αόριστο', sub:'pers3',
    s:['-','sui','sibi','se','-','se'],
    p:['-','sui','sibi','se','-','se'] },

  // ── 2. ΚΤΗΤΙΚΕΣ (pronomina possessiva) ──────────────────────────────────────
  // Για έναν κτήτορα — κλίνονται ως δευτερόκλιτα επίθετα.
  // meus, mea, meum (μόνη με κλητική: mi / mea, στον ενικό)
  { l:'meus, mea, meum', t:'αρσενικό', sub:'poss_meus',
    s:['meus','mei','meo','meum','mi','meo'],
    p:['mei','meorum','meis','meos','-','meis'] },
  { l:'meus, mea, meum', t:'θηλυκό', sub:'poss_meus',
    s:['mea','meae','meae','meam','mea','mea'],
    p:['meae','mearum','meis','meas','-','meis'] },
  { l:'meus, mea, meum', t:'ουδέτερο', sub:'poss_meus',
    s:['meum','mei','meo','meum','-','meo'],
    p:['mea','meorum','meis','mea','-','meis'] },

  // tuus, tua, tuum
  { l:'tuus, tua, tuum', t:'αρσενικό', sub:'poss_tuus',
    s:['tuus','tui','tuo','tuum','-','tuo'],
    p:['tui','tuorum','tuis','tuos','-','tuis'] },
  { l:'tuus, tua, tuum', t:'θηλυκό', sub:'poss_tuus',
    s:['tua','tuae','tuae','tuam','-','tua'],
    p:['tuae','tuarum','tuis','tuas','-','tuis'] },
  { l:'tuus, tua, tuum', t:'ουδέτερο', sub:'poss_tuus',
    s:['tuum','tui','tuo','tuum','-','tuo'],
    p:['tua','tuorum','tuis','tua','-','tuis'] },

  // suus, sua, suum (αυτοπαθητική κτητική γ΄ προσώπου)
  { l:'suus, sua, suum', t:'αρσενικό', sub:'poss_suus',
    s:['suus','sui','suo','suum','-','suo'],
    p:['sui','suorum','suis','suos','-','suis'] },
  { l:'suus, sua, suum', t:'θηλυκό', sub:'poss_suus',
    s:['sua','suae','suae','suam','-','sua'],
    p:['suae','suarum','suis','suas','-','suis'] },
  { l:'suus, sua, suum', t:'ουδέτερο', sub:'poss_suus',
    s:['suum','sui','suo','suum','-','suo'],
    p:['sua','suorum','suis','sua','-','suis'] },

  // Για πολλούς κτήτορες
  // noster, nostra, nostrum
  { l:'noster, nostra, nostrum', t:'αρσενικό', sub:'poss_noster',
    s:['noster','nostri','nostro','nostrum','-','nostro'],
    p:['nostri','nostrorum','nostris','nostros','-','nostris'] },
  { l:'noster, nostra, nostrum', t:'θηλυκό', sub:'poss_noster',
    s:['nostra','nostrae','nostrae','nostram','-','nostra'],
    p:['nostrae','nostrarum','nostris','nostras','-','nostris'] },
  { l:'noster, nostra, nostrum', t:'ουδέτερο', sub:'poss_noster',
    s:['nostrum','nostri','nostro','nostrum','-','nostro'],
    p:['nostra','nostrorum','nostris','nostra','-','nostris'] },

  // vester, vestra, vestrum
  { l:'vester, vestra, vestrum', t:'αρσενικό', sub:'poss_vester',
    s:['vester','vestri','vestro','vestrum','-','vestro'],
    p:['vestri','vestrorum','vestris','vestros','-','vestris'] },
  { l:'vester, vestra, vestrum', t:'θηλυκό', sub:'poss_vester',
    s:['vestra','vestrae','vestrae','vestram','-','vestra'],
    p:['vestrae','vestrarum','vestris','vestras','-','vestris'] },
  { l:'vester, vestra, vestrum', t:'ουδέτερο', sub:'poss_vester',
    s:['vestrum','vestri','vestro','vestrum','-','vestro'],
    p:['vestra','vestrorum','vestris','vestra','-','vestris'] },

  // ── 3. ΔΕΙΚΤΙΚΕΣ (pronomina demonstrativa) ──────────────────────────────────
  // hic, haec, hoc
  { l:'hic, haec, hoc', t:'αρσενικό', sub:'dem_hic',
    s:['hic','huius','huic','hunc','-','hoc'],
    p:['hi','horum','his','hos','-','his'] },
  { l:'hic, haec, hoc', t:'θηλυκό', sub:'dem_hic',
    s:['haec','huius','huic','hanc','-','hac'],
    p:['hae','harum','his','has','-','his'] },
  { l:'hic, haec, hoc', t:'ουδέτερο', sub:'dem_hic',
    s:['hoc','huius','huic','hoc','-','hoc'],
    p:['haec','horum','his','haec','-','his'] },

  // iste, ista, istud (κλίνεται όπως η ille)
  { l:'iste, ista, istud', t:'αρσενικό', sub:'dem_iste',
    s:['iste','istius','isti','istum','-','isto'],
    p:['isti','istorum','istis','istos','-','istis'] },
  { l:'iste, ista, istud', t:'θηλυκό', sub:'dem_iste',
    s:['ista','istius','isti','istam','-','ista'],
    p:['istae','istarum','istis','istas','-','istis'] },
  { l:'iste, ista, istud', t:'ουδέτερο', sub:'dem_iste',
    s:['istud','istius','isti','istud','-','isto'],
    p:['ista','istorum','istis','ista','-','istis'] },

  // ille, illa, illud
  { l:'ille, illa, illud', t:'αρσενικό', sub:'dem_ille',
    s:['ille','illius','illi','illum','-','illo'],
    p:['illi','illorum','illis','illos','-','illis'] },
  { l:'ille, illa, illud', t:'θηλυκό', sub:'dem_ille',
    s:['illa','illius','illi','illam','-','illa'],
    p:['illae','illarum','illis','illas','-','illis'] },
  { l:'ille, illa, illud', t:'ουδέτερο', sub:'dem_ille',
    s:['illud','illius','illi','illud','-','illo'],
    p:['illa','illorum','illis','illa','-','illis'] },

  // talis, talis, tale (τέτοιος — τριτόκλιτο δικατάληκτο)
  { l:'talis, talis, tale', t:'αρσενικό/θηλυκό', sub:'dem_talis',
    s:['talis','talis','tali','talem','-','tali'],
    p:['tales','talium','talibus','tales','-','talibus'] },
  { l:'talis, talis, tale', t:'ουδέτερο', sub:'dem_talis',
    s:['tale','talis','tali','tale','-','tali'],
    p:['talia','talium','talibus','talia','-','talibus'] },

  // tantus, tanta, tantum (τόσος — δευτερόκλιτο)
  { l:'tantus, tanta, tantum', t:'αρσενικό', sub:'dem_tantus',
    s:['tantus','tanti','tanto','tantum','-','tanto'],
    p:['tanti','tantorum','tantis','tantos','-','tantis'] },
  { l:'tantus, tanta, tantum', t:'θηλυκό', sub:'dem_tantus',
    s:['tanta','tantae','tantae','tantam','-','tanta'],
    p:['tantae','tantarum','tantis','tantas','-','tantis'] },
  { l:'tantus, tanta, tantum', t:'ουδέτερο', sub:'dem_tantus',
    s:['tantum','tanti','tanto','tantum','-','tanto'],
    p:['tanta','tantorum','tantis','tanta','-','tantis'] },

  // ── 4. ΟΡΙΣΤΙΚΕΣ (pronomina determinativa) ──────────────────────────────────
  // is, ea, id
  { l:'is, ea, id', t:'αρσενικό', sub:'det_is',
    s:['is','eius','ei','eum','-','eo'],
    p:['ei','eorum','eis','eos','-','eis'] },
  { l:'is, ea, id', t:'θηλυκό', sub:'det_is',
    s:['ea','eius','ei','eam','-','ea'],
    p:['eae','earum','eis','eas','-','eis'] },
  { l:'is, ea, id', t:'ουδέτερο', sub:'det_is',
    s:['id','eius','ei','id','-','eo'],
    p:['ea','eorum','eis','ea','-','eis'] },

  // ipse, ipsa, ipsum
  { l:'ipse, ipsa, ipsum', t:'αρσενικό', sub:'det_ipse',
    s:['ipse','ipsius','ipsi','ipsum','-','ipso'],
    p:['ipsi','ipsorum','ipsis','ipsos','-','ipsis'] },
  { l:'ipse, ipsa, ipsum', t:'θηλυκό', sub:'det_ipse',
    s:['ipsa','ipsius','ipsi','ipsam','-','ipsa'],
    p:['ipsae','ipsarum','ipsis','ipsas','-','ipsis'] },
  { l:'ipse, ipsa, ipsum', t:'ουδέτερο', sub:'det_ipse',
    s:['ipsum','ipsius','ipsi','ipsum','-','ipso'],
    p:['ipsa','ipsorum','ipsis','ipsa','-','ipsis'] },

  // idem, eadem, idem  (is + dem · όπου η is λήγει σε -m, η idem σε -ndem)
  { l:'idem, eadem, idem', t:'αρσενικό', sub:'det_idem',
    s:['idem','eiusdem','eidem','eundem','-','eodem'],
    p:['eidem','eorundem','eisdem','eosdem','-','eisdem'] },
  { l:'idem, eadem, idem', t:'θηλυκό', sub:'det_idem',
    s:['eadem','eiusdem','eidem','eandem','-','eadem'],
    p:['eaedem','earundem','eisdem','easdem','-','eisdem'] },
  { l:'idem, eadem, idem', t:'ουδέτερο', sub:'det_idem',
    s:['idem','eiusdem','eidem','idem','-','eodem'],
    p:['eadem','eorundem','eisdem','eadem','-','eisdem'] },

  // ── 5. ΑΝΑΦΟΡΙΚΕΣ (pronomina relativa) ──────────────────────────────────────
  // qui, quae, quod
  { l:'qui, quae, quod', t:'αρσενικό', sub:'rel_qui',
    s:['qui','cuius','cui','quem','-','quo'],
    p:['qui','quorum','quibus','quos','-','quibus'] },
  { l:'qui, quae, quod', t:'θηλυκό', sub:'rel_qui',
    s:['quae','cuius','cui','quam','-','qua'],
    p:['quae','quarum','quibus','quas','-','quibus'] },
  { l:'qui, quae, quod', t:'ουδέτερο', sub:'rel_qui',
    s:['quod','cuius','cui','quod','-','quo'],
    p:['quae','quorum','quibus','quae','-','quibus'] },

  // quantus, quanta, quantum (όσος — δευτερόκλιτο)
  { l:'quantus, quanta, quantum', t:'αρσενικό', sub:'rel_quantus',
    s:['quantus','quanti','quanto','quantum','-','quanto'],
    p:['quanti','quantorum','quantis','quantos','-','quantis'] },
  { l:'quantus, quanta, quantum', t:'θηλυκό', sub:'rel_quantus',
    s:['quanta','quantae','quantae','quantam','-','quanta'],
    p:['quantae','quantarum','quantis','quantas','-','quantis'] },
  { l:'quantus, quanta, quantum', t:'ουδέτερο', sub:'rel_quantus',
    s:['quantum','quanti','quanto','quantum','-','quanto'],
    p:['quanta','quantorum','quantis','quanta','-','quantis'] },

  // ── 6. ΕΡΩΤΗΜΑΤΙΚΕΣ (pronomina interrogativa) ───────────────────────────────
  // quis, quid? (ουσιαστική) — ενικός: αρσ.=θηλ., πληθ.: χωριστά ανά γένος
  { l:'quis, quid;', t:'αρσενικό', sub:'int_quis',
    s:['quis','cuius','cui','quem','-','quo'],
    p:['qui','quorum','quibus','quos','-','quibus'] },
  { l:'quis, quid;', t:'θηλυκό', sub:'int_quis',
    s:['quis','cuius','cui','quem','-','quo'],
    p:['quae','quarum','quibus','quas','-','quibus'] },
  { l:'quis, quid;', t:'ουδέτερο', sub:'int_quis',
    s:['quid','cuius','cui','quid','-','quo'],
    p:['quae','quorum','quibus','quae','-','quibus'] },

  // quantus, quanta, quantum? (πόσος; — κλίνεται όπως η αναφορική)
  { l:'quantus, -a, -um;', t:'αρσενικό', sub:'int_quantus',
    s:['quantus','quanti','quanto','quantum','-','quanto'],
    p:['quanti','quantorum','quantis','quantos','-','quantis'] },
  { l:'quantus, -a, -um;', t:'θηλυκό', sub:'int_quantus',
    s:['quanta','quantae','quantae','quantam','-','quanta'],
    p:['quantae','quantarum','quantis','quantas','-','quantis'] },
  { l:'quantus, -a, -um;', t:'ουδέτερο', sub:'int_quantus',
    s:['quantum','quanti','quanto','quantum','-','quanto'],
    p:['quanta','quantorum','quantis','quanta','-','quantis'] },

  // ── 7. ΑΟΡΙΣΤΕΣ (pronomina indefinita) ──────────────────────────────────────
  // aliquis, aliqua, aliquid (ουσιαστική)
  { l:'aliquis, -qua, -quid', t:'αρσενικό', sub:'ind_aliquis',
    s:['aliquis','alicuius','alicui','aliquem','-','aliquo'],
    p:['aliqui','aliquorum','aliquibus','aliquos','-','aliquibus'] },
  { l:'aliquis, -qua, -quid', t:'θηλυκό', sub:'ind_aliquis',
    s:['aliqua','alicuius','alicui','aliquam','-','aliqua'],
    p:['aliquae','aliquarum','aliquibus','aliquas','-','aliquibus'] },
  { l:'aliquis, -qua, -quid', t:'ουδέτερο', sub:'ind_aliquis',
    s:['aliquid','alicuius','alicui','aliquid','-','aliquo'],
    p:['aliqua','aliquorum','aliquibus','aliqua','-','aliquibus'] },

  // aliqui, aliqua, aliquod (επιθετική)
  { l:'aliqui, -qua, -quod', t:'αρσενικό', sub:'ind_aliqui',
    s:['aliqui','alicuius','alicui','aliquem','-','aliquo'],
    p:['aliqui','aliquorum','aliquibus','aliquos','-','aliquibus'] },
  { l:'aliqui, -qua, -quod', t:'θηλυκό', sub:'ind_aliqui',
    s:['aliqua','alicuius','alicui','aliquam','-','aliqua'],
    p:['aliquae','aliquarum','aliquibus','aliquas','-','aliquibus'] },
  { l:'aliqui, -qua, -quod', t:'ουδέτερο', sub:'ind_aliqui',
    s:['aliquod','alicuius','alicui','aliquod','-','aliquo'],
    p:['aliqua','aliquorum','aliquibus','aliqua','-','aliquibus'] },

  // quidam, quaedam, quiddam (ουσιαστική) — όπου η qui λήγει σε -m, η quidam σε -ndam
  { l:'quidam, quaedam, quiddam', t:'αρσενικό', sub:'ind_quidam_s',
    s:['quidam','cuiusdam','cuidam','quendam','-','quodam'],
    p:['quidam','quorundam','quibusdam','quosdam','-','quibusdam'] },
  { l:'quidam, quaedam, quiddam', t:'θηλυκό', sub:'ind_quidam_s',
    s:['quaedam','cuiusdam','cuidam','quandam','-','quadam'],
    p:['quaedam','quarundam','quibusdam','quasdam','-','quibusdam'] },
  { l:'quidam, quaedam, quiddam', t:'ουδέτερο', sub:'ind_quidam_s',
    s:['quiddam','cuiusdam','cuidam','quiddam','-','quodam'],
    p:['quaedam','quorundam','quibusdam','quaedam','-','quibusdam'] },

  // quidam, quaedam, quoddam (επιθετική)
  { l:'quidam, quaedam, quoddam', t:'αρσενικό', sub:'ind_quidam_a',
    s:['quidam','cuiusdam','cuidam','quendam','-','quodam'],
    p:['quidam','quorundam','quibusdam','quosdam','-','quibusdam'] },
  { l:'quidam, quaedam, quoddam', t:'θηλυκό', sub:'ind_quidam_a',
    s:['quaedam','cuiusdam','cuidam','quandam','-','quadam'],
    p:['quaedam','quarundam','quibusdam','quasdam','-','quibusdam'] },
  { l:'quidam, quaedam, quoddam', t:'ουδέτερο', sub:'ind_quidam_a',
    s:['quoddam','cuiusdam','cuidam','quoddam','-','quodam'],
    p:['quaedam','quorundam','quibusdam','quaedam','-','quibusdam'] },

  // nemo (κανένας, καμία) — ουσιαστική· γεν./αφαιρ./πληθ. από nullus
  { l:'nemo', t:'αρσενικό/θηλυκό', sub:'ind_nemo',
    s:['nemo','nullius','nemini','neminem','-','nullo'],
    p:['nulli','nullorum','nullis','nullos','-','nullis'] },

  // nihil (τίποτε) — ουσιαστική ουδ.· μόνο ονομ. & αιτ.· λοιπά από nulla res
  { l:'nihil', t:'ουδέτερο', sub:'ind_nihil',
    s:['nihil','nullius rei','nulli rei','nihil','-','nulla re'],
    p:['-','-','-','-','-','-'] },

  // neuter, neutra, neutrum (κανένας από τους δύο) — αντωνυμικό επίθετο
  { l:'neuter, -tra, -trum', t:'αρσενικό', sub:'ind_neuter',
    s:['neuter','neutrius','neutri','neutrum','-','neutro'],
    p:['neutri','neutrorum','neutris','neutros','-','neutris'] },
  { l:'neuter, -tra, -trum', t:'θηλυκό', sub:'ind_neuter',
    s:['neutra','neutrius','neutri','neutram','-','neutra'],
    p:['neutrae','neutrarum','neutris','neutras','-','neutris'] },
  { l:'neuter, -tra, -trum', t:'ουδέτερο', sub:'ind_neuter',
    s:['neutrum','neutrius','neutri','neutrum','-','neutro'],
    p:['neutra','neutrorum','neutris','neutra','-','neutris'] },

  // nullus, nulla, nullum (κανένας, καμία, κανένα) — αντωνυμικό επίθετο
  { l:'nullus, -a, -um', t:'αρσενικό', sub:'ind_nullus',
    s:['nullus','nullius','nulli','nullum','-','nullo'],
    p:['nulli','nullorum','nullis','nullos','-','nullis'] },
  { l:'nullus, -a, -um', t:'θηλυκό', sub:'ind_nullus',
    s:['nulla','nullius','nulli','nullam','-','nulla'],
    p:['nullae','nullarum','nullis','nullas','-','nullis'] },
  { l:'nullus, -a, -um', t:'ουδέτερο', sub:'ind_nullus',
    s:['nullum','nullius','nulli','nullum','-','nullo'],
    p:['nulla','nullorum','nullis','nulla','-','nullis'] },
];

const LAT_P_PACKS = [
  { id:'pp1',  label:'Προσωπικές (ego, tu, sui)',         color:'lgreen',
    subs:['pers1','pers2','pers3'] },
  { id:'pp2',  label:'Κτητικές — ενός κτήτορα (meus / tuus / suus)', color:'lgreen',
    subs:['poss_meus','poss_tuus','poss_suus'] },
  { id:'pp3',  label:'Κτητικές — πολλών κτητόρων (noster / vester)', color:'lgreen',
    subs:['poss_noster','poss_vester'] },
  { id:'pp4',  label:'Δεικτικές — hic & iste',            color:'lyellow',
    subs:['dem_hic','dem_iste'] },
  { id:'pp5',  label:'Δεικτικές — ille',                  color:'lyellow',
    subs:['dem_ille'] },
  { id:'pp6',  label:'Δεικτικές — talis & tantus',        color:'lyellow',
    subs:['dem_talis','dem_tantus'] },
  { id:'pp7',  label:'Οριστικές — is & ipse',             color:'lred',
    subs:['det_is','det_ipse'] },
  { id:'pp8',  label:'Οριστικές — idem',                  color:'lred',
    subs:['det_idem'] },
  { id:'pp9',  label:'Αναφορικές — qui & quantus',        color:'lred',
    subs:['rel_qui','rel_quantus'] },
  { id:'pp10', label:'Ερωτηματικές — quis & quantus;',    color:'lred',
    subs:['int_quis','int_quantus'] },
  { id:'pp11', label:'Αόριστες — aliquis & aliqui',       color:'lpurple',
    subs:['ind_aliquis','ind_aliqui'] },
  { id:'pp12', label:'Αόριστες — quidam (ουσ. & επιθ.)',  color:'lpurple',
    subs:['ind_quidam_s','ind_quidam_a'] },
  { id:'pp13', label:'Αόριστες — nemo, nihil, neuter, nullus', color:'lpurple',
    subs:['ind_nemo','ind_nihil','ind_neuter','ind_nullus'] },
  { id:'pp14', label:'Όλες οι αντωνυμίες',                color:'lpurple',
    subs:['all'] },
];
