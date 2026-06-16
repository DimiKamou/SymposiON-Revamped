// Latin Adjective Data — 2nd decl, 3rd decl, comparative/superlative degrees
// Cases: [0]=Nom [1]=Gen [2]=Dat [3]=Acc [4]=Voc [5]=Abl
// Each entry = one gender of one lemma

const LAT_A_CASES    = ['Ονομαστική','Γενική','Δοτική','Αιτιατική','Κλητική','Αφαιρετική'];
const LAT_A_CASES_EN = ['Nominative','Genitive','Dative','Accusative','Vocative','Ablative'];

const LAT_A_SUBS = {
  '2nd_us':'Β΄ Κλίση (-us/-a/-um)','2nd_er':'Β΄ Κλίση (-er/-ra/-rum)',
  '3rd_2':'Γ΄ Κλίση (δικατάληκτα)','3rd_1':'Γ΄ Κλίση (μονοκατάληκτα)',
  'comp':'Συγκριτικός (-ior/-ius)','superl':'Υπερθετικός (-issimus/-a/-um)',
};

const LAT_A_DB = [

  // ══ Β΄ ΚΛΙΣΗ: bonus -a -um (αντιπροσωπευτικό τρικατάληκτο) ══
  { l:'bonus, -a, -um', meaning:'καλός', sub:'2nd_us', t:'αρσενικό', degree:'positive',
    s:['bonus','boni','bono','bonum','bone','bono'],
    p:['boni','bonorum','bonis','bonos','boni','bonis'] },
  { l:'bonus, -a, -um', meaning:'καλός', sub:'2nd_us', t:'θηλυκό', degree:'positive',
    s:['bona','bonae','bonae','bonam','bona','bona'],
    p:['bonae','bonarum','bonis','bonas','bonae','bonis'] },
  { l:'bonus, -a, -um', meaning:'καλός', sub:'2nd_us', t:'ουδέτερο', degree:'positive',
    s:['bonum','boni','bono','bonum','bonum','bono'],
    p:['bona','bonorum','bonis','bona','bona','bonis'] },

  // magnus -a -um
  { l:'magnus, -a, -um', meaning:'μεγάλος', sub:'2nd_us', t:'αρσενικό', degree:'positive',
    s:['magnus','magni','magno','magnum','magne','magno'],
    p:['magni','magnorum','magnis','magnos','magni','magnis'] },
  { l:'magnus, -a, -um', meaning:'μεγάλος', sub:'2nd_us', t:'θηλυκό', degree:'positive',
    s:['magna','magnae','magnae','magnam','magna','magna'],
    p:['magnae','magnarum','magnis','magnas','magnae','magnis'] },
  { l:'magnus, -a, -um', meaning:'μεγάλος', sub:'2nd_us', t:'ουδέτερο', degree:'positive',
    s:['magnum','magni','magno','magnum','magnum','magno'],
    p:['magna','magnorum','magnis','magna','magna','magnis'] },

  // malus -a -um
  { l:'malus, -a, -um', meaning:'κακός', sub:'2nd_us', t:'αρσενικό', degree:'positive',
    s:['malus','mali','malo','malum','male','malo'],
    p:['mali','malorum','malis','malos','mali','malis'] },
  { l:'malus, -a, -um', meaning:'κακός', sub:'2nd_us', t:'θηλυκό', degree:'positive',
    s:['mala','malae','malae','malam','mala','mala'],
    p:['malae','malarum','malis','malas','malae','malis'] },
  { l:'malus, -a, -um', meaning:'κακός', sub:'2nd_us', t:'ουδέτερο', degree:'positive',
    s:['malum','mali','malo','malum','malum','malo'],
    p:['mala','malorum','malis','mala','mala','malis'] },

  // multus -a -um
  { l:'multus, -a, -um', meaning:'πολύς', sub:'2nd_us', t:'αρσενικό', degree:'positive',
    s:['multus','multi','multo','multum','multe','multo'],
    p:['multi','multorum','multis','multos','multi','multis'] },
  { l:'multus, -a, -um', meaning:'πολύς', sub:'2nd_us', t:'θηλυκό', degree:'positive',
    s:['multa','multae','multae','multam','multa','multa'],
    p:['multae','multarum','multis','multas','multae','multis'] },
  { l:'multus, -a, -um', meaning:'πολύς', sub:'2nd_us', t:'ουδέτερο', degree:'positive',
    s:['multum','multi','multo','multum','multum','multo'],
    p:['multa','multorum','multis','multa','multa','multis'] },

  // novus -a -um
  { l:'novus, -a, -um', meaning:'νέος', sub:'2nd_us', t:'αρσενικό', degree:'positive',
    s:['novus','novi','novo','novum','nove','novo'],
    p:['novi','novorum','novis','novos','novi','novis'] },
  { l:'novus, -a, -um', meaning:'νέος', sub:'2nd_us', t:'θηλυκό', degree:'positive',
    s:['nova','novae','novae','novam','nova','nova'],
    p:['novae','novarum','novis','novas','novae','novis'] },
  { l:'novus, -a, -um', meaning:'νέος', sub:'2nd_us', t:'ουδέτερο', degree:'positive',
    s:['novum','novi','novo','novum','novum','novo'],
    p:['nova','novorum','novis','nova','nova','novis'] },

  // ══ Β΄ ΚΛΙΣΗ: pulcher -chra -chrum (συγκοπτόμενο -er) ══
  { l:'pulcher, -chra, -chrum', meaning:'ωραίος', sub:'2nd_er', t:'αρσενικό', degree:'positive',
    s:['pulcher','pulchri','pulchro','pulchrum','pulcher','pulchro'],
    p:['pulchri','pulchrorum','pulchris','pulchros','pulchri','pulchris'] },
  { l:'pulcher, -chra, -chrum', meaning:'ωραίος', sub:'2nd_er', t:'θηλυκό', degree:'positive',
    s:['pulchra','pulchrae','pulchrae','pulchram','pulchra','pulchra'],
    p:['pulchrae','pulchrarum','pulchris','pulchras','pulchrae','pulchris'] },
  { l:'pulcher, -chra, -chrum', meaning:'ωραίος', sub:'2nd_er', t:'ουδέτερο', degree:'positive',
    s:['pulchrum','pulchri','pulchro','pulchrum','pulchrum','pulchro'],
    p:['pulchra','pulchrorum','pulchris','pulchra','pulchra','pulchris'] },

  // liber -era -erum (κρατά το e)
  { l:'liber, -era, -erum', meaning:'ελεύθερος', sub:'2nd_er', t:'αρσενικό', degree:'positive',
    s:['liber','liberi','libero','liberum','liber','libero'],
    p:['liberi','liberorum','liberis','liberos','liberi','liberis'] },
  { l:'liber, -era, -erum', meaning:'ελεύθερος', sub:'2nd_er', t:'θηλυκό', degree:'positive',
    s:['libera','liberae','liberae','liberam','libera','libera'],
    p:['liberae','liberarum','liberis','liberas','liberae','liberis'] },
  { l:'liber, -era, -erum', meaning:'ελεύθερος', sub:'2nd_er', t:'ουδέτερο', degree:'positive',
    s:['liberum','liberi','libero','liberum','liberum','libero'],
    p:['libera','liberorum','liberis','libera','libera','liberis'] },

  // ══ Γ΄ ΚΛΙΣΗ: δικατάληκτα (-is/-is/-e) ══
  // omnis -is -e
  { l:'omnis, -is, -e', meaning:'κάθε', sub:'3rd_2', t:'αρσενικό', degree:'positive',
    s:['omnis','omnis','omni','omnem','omnis','omni'],
    p:['omnes','omnium','omnibus','omnes','omnes','omnibus'] },
  { l:'omnis, -is, -e', meaning:'κάθε', sub:'3rd_2', t:'θηλυκό', degree:'positive',
    s:['omnis','omnis','omni','omnem','omnis','omni'],
    p:['omnes','omnium','omnibus','omnes','omnes','omnibus'] },
  { l:'omnis, -is, -e', meaning:'κάθε', sub:'3rd_2', t:'ουδέτερο', degree:'positive',
    s:['omne','omnis','omni','omne','omne','omni'],
    p:['omnia','omnium','omnibus','omnia','omnia','omnibus'] },

  // brevis -is -e
  { l:'brevis, -is, -e', meaning:'σύντομος', sub:'3rd_2', t:'αρσενικό', degree:'positive',
    s:['brevis','brevis','brevi','brevem','brevis','brevi'],
    p:['breves','brevium','brevibus','breves','breves','brevibus'] },
  { l:'brevis, -is, -e', meaning:'σύντομος', sub:'3rd_2', t:'θηλυκό', degree:'positive',
    s:['brevis','brevis','brevi','brevem','brevis','brevi'],
    p:['breves','brevium','brevibus','breves','breves','brevibus'] },
  { l:'brevis, -is, -e', meaning:'σύντομος', sub:'3rd_2', t:'ουδέτερο', degree:'positive',
    s:['breve','brevis','brevi','breve','breve','brevi'],
    p:['brevia','brevium','brevibus','brevia','brevia','brevibus'] },

  // ══ Γ΄ ΚΛΙΣΗ: τρικατάληκτα -er/-eris/-ere ══
  // celer -is -e
  { l:'celer, -is, -e', meaning:'γρήγορος', sub:'3rd_2', t:'αρσενικό', degree:'positive',
    s:['celer','celeris','celeri','celerem','celer','celeri'],
    p:['celeres','celerium','celeribus','celeres','celeres','celeribus'] },
  { l:'celer, -is, -e', meaning:'γρήγορος', sub:'3rd_2', t:'θηλυκό', degree:'positive',
    s:['celeris','celeris','celeri','celerem','celeris','celeri'],
    p:['celeres','celerium','celeribus','celeres','celeres','celeribus'] },
  { l:'celer, -is, -e', meaning:'γρήγορος', sub:'3rd_2', t:'ουδέτερο', degree:'positive',
    s:['celere','celeris','celeri','celere','celere','celeri'],
    p:['celeria','celerium','celeribus','celeria','celeria','celeribus'] },

  // ══ Γ΄ ΚΛΙΣΗ: μονοκατάληκτα ══
  // felix (felic-)
  { l:'felix, felicis', meaning:'ευτυχής', sub:'3rd_1', t:'αρσενικό', degree:'positive',
    s:['felix','felicis','felici','felicem','felix','felici'],
    p:['felices','felicium','felicibus','felices','felices','felicibus'] },
  { l:'felix, felicis', meaning:'ευτυχής', sub:'3rd_1', t:'θηλυκό', degree:'positive',
    s:['felix','felicis','felici','felicem','felix','felici'],
    p:['felices','felicium','felicibus','felices','felices','felicibus'] },
  { l:'felix, felicis', meaning:'ευτυχής', sub:'3rd_1', t:'ουδέτερο', degree:'positive',
    s:['felix','felicis','felici','felix','felix','felici'],
    p:['felicia','felicium','felicibus','felicia','felicia','felicibus'] },

  // acer acris acre
  { l:'acer, acris, acre', meaning:'οξύς', sub:'3rd_2', t:'αρσενικό', degree:'positive',
    s:['acer','acris','acri','acrem','acer','acri'],
    p:['acres','acrium','acribus','acres','acres','acribus'] },
  { l:'acer, acris, acre', meaning:'οξύς', sub:'3rd_2', t:'θηλυκό', degree:'positive',
    s:['acris','acris','acri','acrem','acris','acri'],
    p:['acres','acrium','acribus','acres','acres','acribus'] },
  { l:'acer, acris, acre', meaning:'οξύς', sub:'3rd_2', t:'ουδέτερο', degree:'positive',
    s:['acre','acris','acri','acre','acre','acri'],
    p:['acria','acrium','acribus','acria','acria','acribus'] },

  // ══ ΣΥΓΚΡΙΤΙΚΟΣ: altior altior altius ══
  { l:'altior, altius (συγκρ. του altus)', meaning:'ψηλότερος', sub:'comp', t:'αρσενικό', degree:'comparative',
    s:['altior','altioris','altiori','altiorem','altior','altiore'],
    p:['altiores','altiorum','altioribus','altiores','altiores','altioribus'] },
  { l:'altior, altius (συγκρ. του altus)', meaning:'ψηλότερος', sub:'comp', t:'θηλυκό', degree:'comparative',
    s:['altior','altioris','altiori','altiorem','altior','altiore'],
    p:['altiores','altiorum','altioribus','altiores','altiores','altioribus'] },
  { l:'altior, altius (συγκρ. του altus)', meaning:'ψηλότερος', sub:'comp', t:'ουδέτερο', degree:'comparative',
    s:['altius','altioris','altiori','altius','altius','altiore'],
    p:['altiora','altiorum','altioribus','altiora','altiora','altioribus'] },

  // ══ ΥΠΕΡΘΕΤΙΚΟΣ: altissimus -a -um ══
  { l:'altissimus, -a, -um (υπερθ. του altus)', meaning:'ο ψηλότατος', sub:'superl', t:'αρσενικό', degree:'superlative',
    s:['altissimus','altissimi','altissimo','altissimum','altissime','altissimo'],
    p:['altissimi','altissimorum','altissimis','altissimos','altissimi','altissimis'] },
  { l:'altissimus, -a, -um (υπερθ. του altus)', meaning:'ο ψηλότατος', sub:'superl', t:'θηλυκό', degree:'superlative',
    s:['altissima','altissimae','altissimae','altissimam','altissima','altissima'],
    p:['altissimae','altissimarum','altissimis','altissimas','altissimae','altissimis'] },
  { l:'altissimus, -a, -um (υπερθ. του altus)', meaning:'ο ψηλότατος', sub:'superl', t:'ουδέτερο', degree:'superlative',
    s:['altissimum','altissimi','altissimo','altissimum','altissimum','altissimo'],
    p:['altissima','altissimorum','altissimis','altissima','altissima','altissimis'] },

  // pulcherrimus -a -um (υπερθ. pulcher με -rr-)
  { l:'pulcherrimus, -a, -um (υπερθ. του pulcher)', meaning:'ο ωραιότατος', sub:'superl', t:'αρσενικό', degree:'superlative',
    s:['pulcherrimus','pulcherrimi','pulcherrimo','pulcherrimum','pulcherrime','pulcherrimo'],
    p:['pulcherrimi','pulcherrimorum','pulcherrimis','pulcherrimos','pulcherrimi','pulcherrimis'] },
  { l:'pulcherrimus, -a, -um (υπερθ. του pulcher)', meaning:'ο ωραιότατος', sub:'superl', t:'θηλυκό', degree:'superlative',
    s:['pulcherrima','pulcherrimae','pulcherrimae','pulcherrimam','pulcherrima','pulcherrima'],
    p:['pulcherrimae','pulcherrimarum','pulcherrimis','pulcherrimas','pulcherrimae','pulcherrimis'] },
  { l:'pulcherrimus, -a, -um (υπερθ. του pulcher)', meaning:'ο ωραιότατος', sub:'superl', t:'ουδέτερο', degree:'superlative',
    s:['pulcherrimum','pulcherrimi','pulcherrimo','pulcherrimum','pulcherrimum','pulcherrimo'],
    p:['pulcherrima','pulcherrimorum','pulcherrimis','pulcherrima','pulcherrima','pulcherrimis'] },
];

// Comparative/superlative pairing table for recognition questions
const LAT_A_DEGREES = [
  { pos:'clarus, -a, -um',  comp:'clarior, -ior, -ius',  superl:'clarissimus, -a, -um' },
  { pos:'longus, -a, -um',  comp:'longior, -ior, -ius',  superl:'longissimus, -a, -um' },
  { pos:'altus, -a, -um',   comp:'altior, -ior, -ius',   superl:'altissimus, -a, -um' },
  { pos:'fortis, -is, -e',  comp:'fortior, -ior, -ius',  superl:'fortissimus, -a, -um' },
  { pos:'felix, felicis',   comp:'felicior, -ior, -ius', superl:'felicissimus, -a, -um' },
  { pos:'pulcher, -chra, -chrum', comp:'pulchrior, -ior, -ius', superl:'pulcherrimus, -a, -um' },
  { pos:'celer, -is, -e',   comp:'celerior, -ior, -ius', superl:'celerrimus, -a, -um' },
  { pos:'facilis, -is, -e', comp:'facilior, -ior, -ius', superl:'facillimus, -a, -um' },
  { pos:'bonus, -a, -um',   comp:'melior, -ior, -ius',   superl:'optimus, -a, -um' },
  { pos:'malus, -a, -um',   comp:'peior, -ior, -ius',    superl:'pessimus, -a, -um' },
  { pos:'magnus, -a, -um',  comp:'maior, -ior, -ius',    superl:'maximus, -a, -um' },
  { pos:'parvus, -a, -um',  comp:'minor, -ior, -ius',    superl:'minimus, -a, -um' },
  { pos:'multus, -a, -um',  comp:'plus (ουδ. μόνο εν.)', superl:'plurimus, -a, -um' },
];
