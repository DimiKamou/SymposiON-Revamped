/* etym-lexico.js — ετυμολογικά (ομόρριζα ανά ενότητα + συνώνυμα/αντώνυμα) από τον
   Φάκελο Υλικού. Γεμίζει u.etymRef (λεξικό αναφοράς) και επεκτείνει u.etymBank
   (γεννήτρια ασκήσεων). Παράγεται αυτόματα· θα συμπληρωθεί με τα δεδομένα OCR. */
(function(){
  var G = window.GNWSTO; if(!G || !G.units) return;
  var REF = {};
  var BANK = {};
  function key(e){ return (e && e.gr ? String(e.gr).trim() : ""); }
  G.units.forEach(function(u){
    if(REF[u.id]) u.etymRef = REF[u.id];
    if(BANK[u.id] && BANK[u.id].length){
      var have = {}; (u.etymBank||[]).forEach(function(x){ have[key(x)] = 1; });
      var add = BANK[u.id].filter(function(x){ return key(x) && !have[key(x)]; });
      u.etymBank = (u.etymBank||[]).concat(add);
    }
  });
})();
