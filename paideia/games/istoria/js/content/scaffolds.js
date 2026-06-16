/* ════════════════════════════════════════════════════════════════════
   content/scaffolds.js — topic scaffolds for the non-exam history classes
   These migrate the chapter/topic structure from the old history-game.html
   (Α/Β/Γ Γυμνασίου + Α΄ Λυκείου). Banks start empty — the same themed panel
   renders them, and content is authored per class via the admin studio.
   No AI grading here (no model answers yet): meta.hasAI = false.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  const C = (window.ISTORIA_CONTENT = window.ISTORIA_CONTENT || {});
  const emptyModes = ()=>({ mc:[], fc:[], match:[], tl:[], tf:[], fib:[], vid:null });

  function pack(course, meta, unitDefs){
    const units = unitDefs.map((u,i)=>({ id:u.id, rn:['I','II','III','IV','V','VI'][i]||String(i+1), t:u.t, en:u.en||('Chapter '+(i+1)), p:u.p||'', cnt:u.cnt||'' }));
    const data = {}; units.forEach(u=> data[u.id]=emptyModes());
    C[course] = { meta:Object.assign({course, hasAI:false}, meta), units, data, methods:{} };
  }

  pack('gym-a',
    { kicker:'Αρχαία Ελληνική Ιστορία', title:'Ιστορία Α΄ Γυμνασίου', subtitle:'', category:'ΓΥΜΝΑΣΙΟ · Α΄ ΤΑΞΗ' },
    [ {id:'ch1', t:'Πελοποννησιακός Πόλεμος', en:'Peloponnesian War', p:'Αθήνα — Σπάρτη, 431–404 π.Χ.'},
      {id:'ch2', t:'Κεφάλαιο 2', en:'Chapter 2', p:'Συμπλήρωσε θέμα & ύλη από τη Διαχείριση.'},
      {id:'ch3', t:'Κεφάλαιο 3', en:'Chapter 3', p:'Συμπλήρωσε θέμα & ύλη από τη Διαχείριση.'} ]);

  pack('gym-b',
    { kicker:'Βυζαντινή & Μεσαιωνική Ιστορία', title:'Ιστορία Β΄ Γυμνασίου', subtitle:'', category:'ΓΥΜΝΑΣΙΟ · Β΄ ΤΑΞΗ' },
    [ {id:'ch1', t:'Άλωση Κωνσταντινούπολης', en:'Fall of Constantinople', p:'1453 — το τέλος της Βυζαντινής Αυτοκρατορίας.'},
      {id:'ch2', t:'Κεφάλαιο 2', en:'Chapter 2', p:'Συμπλήρωσε θέμα & ύλη από τη Διαχείριση.'},
      {id:'ch3', t:'Κεφάλαιο 3', en:'Chapter 3', p:'Συμπλήρωσε θέμα & ύλη από τη Διαχείριση.'} ]);

  pack('gym-c',
    { kicker:'Νεότερη & Σύγχρονη Ιστορία', title:'Ιστορία Γ΄ Γυμνασίου', subtitle:'', category:'ΓΥΜΝΑΣΙΟ · Γ΄ ΤΑΞΗ' },
    [ {id:'ch1', t:'Β΄ Παγκόσμιος Πόλεμος', en:'World War II', p:'1939–1945 — η Ελλάδα στον πόλεμο.'},
      {id:'ch2', t:'Κεφάλαιο 2', en:'Chapter 2', p:'Συμπλήρωσε θέμα & ύλη από τη Διαχείριση.'},
      {id:'ch3', t:'Κεφάλαιο 3', en:'Chapter 3', p:'Συμπλήρωσε θέμα & ύλη από τη Διαχείριση.'} ]);

  pack('lyk-a',
    { kicker:'Νεότερη Ελληνική & Παγκόσμια Ιστορία', title:'Ιστορία Α΄ Λυκείου', subtitle:'', category:'ΛΥΚΕΙΟ · Α΄ ΤΑΞΗ' },
    [ {id:'u1', t:'Ενότητα 1', en:'Unit 1', p:'Συμπλήρωσε θέμα & ύλη από τη Διαχείριση.'},
      {id:'u2', t:'Ενότητα 2', en:'Unit 2', p:'Συμπλήρωσε θέμα & ύλη από τη Διαχείριση.'},
      {id:'u3', t:'Ενότητα 3', en:'Unit 3', p:'Συμπλήρωσε θέμα & ύλη από τη Διαχείριση.'} ]);
})();
