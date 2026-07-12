/* data.js — Iliada Arcade · playable game data
   Two campaigns (Ιλιάδα / Οδύσσεια). Each rhapsody has a unique hero look,
   a unique boss, its own palette + motif backdrop, and quiz questions.
   Weapons: Ιλιάδα = sword + 2 throwing spears · Οδύσσεια = sword + bow ×5. */

const GAME_DATA = {
  iliada: {
    label:'ΙΛΙΑΔΑ', heroName:'ΑΧΙΛΛΕΥΣ', portrait:'Α',
    ranged:{ type:'spear', ammo:2, name:'ΔΟΡΥ', recharge:5.0, speed:15, dmg:34 },
    sword:{ name:'ΞΙΦΟΣ', dmg:14, range:128, cd:0.36 },
    ult:{ name:'ΜΗΝΙΣ' },
    rhaps:{
      alpha:{ roman:'Α', latin:'I',   title:'Η Μήνις', motif:'walls',
        pal:{ sky:['#191230','#3A2348','#6E3650','#B0532F','#E08A44','#F2B85E'], ground:'#5E4226', far:'#140A12', accent:'#C8542B', ember:'city', sun:[0.30,0.55] },
        hero:{ tint:'#1A0E08', crest:'#E8C96A', cape:'#8E2A18', shield:'#C8542B', emblem:'#E2A867' },
        enemy:{ tint:'#22120C', crest:'#7A2E18' },
        boss:{ name:'ΕΚΤΩΡ', en:'Hector', kind:'melee', weapon:'spear', tint:'#8A4226', crest:'#E8C96A', hp:200, scale:1.5 },
        quiz:[ {q:'Ποιος παίρνει τη Βρισηίδα από τον Αχιλλέα;', o:['Ο Νέστωρ','Ο Αγαμέμνων','Ο Οδυσσέας','Ο Μενέλαος'], a:1},
               {q:'Σε ποια θεά προσεύχεται ο Αχιλλέας;', o:['Στην Ήρα','Στην Αθηνά','Στη Θέτιδα','Στην Άρτεμη'], a:2} ] },
      zeta:{ roman:'Ζ', latin:'VI',  title:'Έκτωρ & Ανδρομάχη', motif:'walls',
        pal:{ sky:['#2C5E86','#5688AC','#94B6C6','#CDC2A0','#DBCAA0'], ground:'#B89A60', far:'#3A2A1E', accent:'#B5642E', ember:null, sun:null },
        hero:{ tint:'#241208', crest:'#C8542B', cape:'#2C4A60', shield:'#9C6A28', emblem:'#DBCAA0' },
        enemy:{ tint:'#3A2414', crest:'#7A4A1E' },
        boss:{ name:'ΠΑΡΙΣ', en:'Paris', kind:'archer', weapon:'bow', tint:'#6E4A22', crest:'#C8542B', hp:170, scale:1.32 },
        quiz:[ {q:'Τι ζητά η Ανδρομάχη από τον Έκτορα στις πύλες;', o:['Να φύγει από την Τροία','Να μη γυρίσει στη μάχη','Να σκοτώσει τον Αχιλλέα','Να καλέσει τον Πρίαμο'], a:1},
               {q:'Πώς λέγεται ο γιος του Έκτορα;', o:['Αστυάναξ','Τήλεμαχος','Νεοπτόλεμος','Άδραστος'], a:0} ] },
      pi:{ roman:'Π', latin:'XVI', title:'Θάνατος Πατρόκλου', motif:'plain',
        pal:{ sky:['#7E6236','#B08C46','#CFAA5E','#BE9850','#8E6E34'], ground:'#BC9C5E', far:'#5A4624', accent:'#9C6A2E', ember:null, dust:'heavy', sun:[0.52,0.22] },
        hero:{ tint:'#1E1206', crest:'#E2A867', cape:'#8A5A20', shield:'#A8741F', emblem:'#F0D49A' },
        enemy:{ tint:'#3A2A14', crest:'#7A521E' },
        boss:{ name:'ΣΑΡΠΗΔΩΝ', en:'Sarpedon', kind:'melee', weapon:'spear', tint:'#9C6A2A', crest:'#F0D49A', hp:210, scale:1.46 },
        quiz:[ {q:'Με τίνος πανοπλία πολεμά ο Πάτροκλος;', o:['Του Νέστορα','Του Αχιλλέα','Του Αίαντα','Του Διομήδη'], a:1},
               {q:'Ποιος θεός βοηθά να σκοτωθεί ο Πάτροκλος;', o:['Ο Άρης','Ο Ποσειδών','Ο Απόλλων','Ο Ερμής'], a:2} ] },
      chi:{ roman:'Χ', latin:'XXII', title:'Θάνατος Έκτορα', motif:'walls',
        pal:{ sky:['#1C1430','#46233E','#84303A','#C24A2E','#E47C38'], ground:'#6E4830','far':'#281A10', accent:'#C8542B', ember:'city', dust:'med', sun:[0.26,0.54] },
        hero:{ tint:'#1A0E08', crest:'#E8C96A', cape:'#8E2A18', shield:'#C8542B', emblem:'#E2A867' },
        enemy:{ tint:'#22120C', crest:'#7A2E18' },
        boss:{ name:'ΕΚΤΩΡ', en:'Hector', kind:'melee', weapon:'spear', tint:'#8A4226', crest:'#E8C96A', hp:260, scale:1.6 },
        quiz:[ {q:'Πόσες φορές γυρίζουν την Τροία πριν τη μονομαχία;', o:['Μία','Δύο','Τρεις','Επτά'], a:2},
               {q:'Ποια θεά ξεγελά τον Έκτορα να σταθεί;', o:['Η Αφροδίτη','Η Αθηνά','Η Ήρα','Η Ίρις'], a:1} ] },
      omega:{ roman:'Ω', latin:'XXIV', title:'Πρίαμος & Αχιλλέας', motif:'tent',
        pal:{ sky:['#06091A','#0C1230','#171B40','#281E38','#3A2830'], ground:'#1E1A2A', far:'#0A0710', accent:'#C8542B', ember:'braziers', stars:true, sun:null },
        hero:{ tint:'#14100A', crest:'#9DA8C8', cape:'#3A2838', shield:'#5E4A2E', emblem:'#9DA8C8' },
        enemy:{ tint:'#1A1622', crest:'#4A3E5A' },
        boss:{ name:'ΣΚΙΑ ΕΚΤΟΡΟΣ', en:'Shade of Hector', kind:'melee', weapon:'spear', tint:'#46506E', crest:'#9DA8C8', hp:230, scale:1.55, ghost:true },
        quiz:[ {q:'Τι ζητά ο Πρίαμος από τον Αχιλλέα;', o:['Εκεχειρία','Το σώμα του Έκτορα','Όπλα','Χρυσό'], a:1},
               {q:'Ποιος θεός οδηγεί τον Πρίαμο στη σκηνή;', o:['Ο Ερμής','Ο Δίας','Ο Απόλλων','Ο Άρης'], a:0} ] },
    }
  },
  odysseia: {
    label:'ΟΔΥΣΣΕΙΑ', heroName:'ΟΔΥΣΣΕΥΣ', portrait:'Ο',
    ranged:{ type:'arrow', ammo:5, name:'ΤΟΞΟ', recharge:2.6, speed:19, dmg:22 },
    sword:{ name:'ΞΙΦΟΣ', dmg:13, range:120, cd:0.34 },
    ult:{ name:'ΟΡΓΗ' },
    rhaps:{
      alpha:{ roman:'Α', latin:'I',   title:'Στην Ιθάκη', motif:'columns',
        pal:{ sky:['#5E4226','#3C2814','#20140A','#150C06'], ground:'#2A1C10', far:'#0E0A06', accent:'#C8542B', ember:'braziers', radial:true },
        hero:{ tint:'#1A0E08', crest:'#C8542B', cape:'#3A2414', shield:'#8E5A28', emblem:'#E2A867', bow:true },
        enemy:{ tint:'#2A1810', crest:'#6E3E1E' },
        boss:{ name:'ΑΝΤΙΝΟΟΣ', en:'Antinous', kind:'melee', weapon:'sword', tint:'#8A4A28', crest:'#E0B24A', hp:200, scale:1.42 },
        quiz:[ {q:'Τι κάνουν οι μνηστήρες στο παλάτι;', o:['Φυλάνε τον θρόνο','Ρημάζουν το βιος','Χτίζουν πλοία','Ψάχνουν τον Οδυσσέα'], a:1},
               {q:'Ποια θεά προστατεύει τον Τηλέμαχο;', o:['Η Ήρα','Η Αθηνά','Η Καλυψώ','Η Κίρκη'], a:1} ] },
      iota:{ roman:'Ι', latin:'IX',  title:'Ο Πολύφημος', motif:'cave',
        pal:{ sky:['#4A2410','#24120A','#0C0604'], ground:'#180E07', far:'#0A0604', accent:'#E8742A', ember:'fire', radial:true, fire:[0.46,0.66] },
        hero:{ tint:'#0E0A08', crest:'#E8C96A', cape:'#5E3018', shield:'#A8431F', emblem:'#E8C96A', bow:true },
        enemy:{ tint:'#1A120C', crest:'#5E3018' },
        boss:{ name:'ΠΟΛΥΦΗΜΟΣ', en:'Polyphemus', kind:'giant', weapon:'club', tint:'#3A2414', eye:'#F6C44A', hp:340, scale:2.6 },
        quiz:[ {q:'Με τι τυφλώνει ο Οδυσσέας τον Κύκλωπα;', o:['Με σπαθί','Με πυρωμένο πάσσαλο','Με βέλος','Με πέτρα'], a:1},
               {q:'Τι όνομα λέει ο Οδυσσέας στον Πολύφημο;', o:['Κανείς','Αίθων','Νέστωρ','Ούτις-Κανένας'], a:3} ] },
      kappa:{ roman:'Κ', latin:'X',  title:'Η Κίρκη', motif:'columns',
        pal:{ sky:['#2E3C22','#243016','#161E0E','#0E1408'], ground:'#161E0E', far:'#0A0E06', accent:'#9DE0A8', ember:'green', radial:true },
        hero:{ tint:'#0E0A08', crest:'#9DE0A8', cape:'#244018', shield:'#5E7A3A', emblem:'#CFF0A8', bow:true },
        enemy:{ tint:'#1A2210', crest:'#4A6A2E' },
        boss:{ name:'ΚΙΡΚΗ', en:'Circe', kind:'caster', weapon:'staff', tint:'#2A3A1E', crest:'#9DE0A8', wand:'#CFF0A8', hp:220, scale:1.4 },
        quiz:[ {q:'Σε τι μεταμορφώνει η Κίρκη τους συντρόφους;', o:['Σε λιοντάρια','Σε χοίρους','Σε πουλιά','Σε πέτρες'], a:1},
               {q:'Ποιο βότανο προστατεύει τον Οδυσσέα;', o:['Το μώλυ','Ο λωτός','Η μανδραγόρα','Το κενταύρι'], a:0} ] },
      mu:{ roman:'Μ', latin:'XII', title:'Οι Σειρῆνες', motif:'sea',
        pal:{ sky:['#141A2E','#243A52','#3E6A7E','#6E96A0','#9CB6B2'], ground:'#16303E', far:'#0E1A24', accent:'#2FB6C0', ember:null, spray:true },
        hero:{ tint:'#0E0A08', crest:'#C8542B', cape:'#1E4452', shield:'#2A6A74', emblem:'#9CB6B2', bow:true },
        enemy:{ tint:'#14222A', crest:'#2A6A74' },
        boss:{ name:'ΣΚΥΛΛΑ', en:'Scylla', kind:'caster', weapon:'staff', tint:'#14323A', crest:'#3EB6C0', wand:'#7EE0E8', arms:true, hp:250, scale:1.7 },
        quiz:[ {q:'Πώς ακούει ο Οδυσσέας το τραγούδι των Σειρήνων;', o:['Με κερί στ\u2019 αυτιά','Δεμένος στο κατάρτι','Κοιμισμένος','Δεν το ακούει'], a:1},
               {q:'Τι χάνει ο Οδυσσέας περνώντας τη Σκύλλα;', o:['Το πλοίο','Έξι συντρόφους','Το τόξο','Τον χάρτη'], a:1} ] },
      chi:{ roman:'Χ', latin:'XXII', title:'Μνηστηροφονία', motif:'columns',
        pal:{ sky:['#4A331F','#311F12','#1E1209','#150C06'], ground:'#1E1209', far:'#0E0A06', accent:'#C8542B', ember:'braziers', radial:true },
        hero:{ tint:'#1A0E08', crest:'#E8C96A', cape:'#3A2414', shield:'#C8542B', emblem:'#E2A867', bow:true },
        enemy:{ tint:'#2A1810', crest:'#6E3E1E' },
        boss:{ name:'ΕΥΡΥΜΑΧΟΣ', en:'Eurymachus', kind:'melee', weapon:'sword', tint:'#8A4226', crest:'#E0B24A', hp:240, scale:1.45 },
        quiz:[ {q:'Ποιο όπλο κρίνει τη μνηστηροφονία;', o:['Το δόρυ του Οδυσσέα','Το τόξο του Οδυσσέα','Η ασπίδα','Το ξίφος του Τηλέμαχου'], a:1},
               {q:'Ποιος πολεμά στο πλευρό του Οδυσσέα;', o:['Ο Νέστωρ','Ο Τηλέμαχος','Ο Μενέλαος','Ο Αίας'], a:1} ] },
    }
  }
};

const RHAP_ORDER = { iliada:['alpha','zeta','pi','chi','omega'], odysseia:['alpha','iota','kappa','mu','chi'] };

if (typeof window!=='undefined') window.GAME_DATA = GAME_DATA, window.RHAP_ORDER = RHAP_ORDER;
// NOTE: admin content override runs in play/override.js, loaded AFTER quiz.js
// (which rewrites every rhapsody's .quiz from its own bank), so admin edits win.
