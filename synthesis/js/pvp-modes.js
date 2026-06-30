/* ════════════════════════════════════════════════════════════════════
   pvp-modes.js — the 20 competitive game modes, shared by the Live Arena
   host setup and the PvP arena. Mirrors games/pvp-arena/js/pvp-data.js
   (PVP.MODES / PVP.DUEL_MODES) but on the main-app window with hex accents
   (the app's light theme doesn't define the arena's --sym-* tokens) and a
   `live` flag = "can the Live Arena host this as a class match today".

   Live Arena = a multiplayer, score-comparable MC quiz. The 12 score-modes
   run as a themed live quiz now (live:true); the 8 head-to-head DUEL modes
   are 1v1 arena games (live:false here — hosted from the PvP arena).
   Each: { id, gr, en, glyph, accent(hex), weight, blurb:{gr,en}, engine?, live }.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var A = { terra:'#C5572F', gold:'#A2862F', sage:'#6f8f4f', blood:'#9b3d2e', aegean:'#3a6ea5' };

  // 12 multiplayer / score-comparable — everyone plays the same game, scores compared.
  window.PVP_MODES = [
    { id:'krypteia',  gr:'ΚΡΥΠΤΕΙΑ',          en:'Crypto Hack',     glyph:'Λ', accent:A.terra,  weight:5, live:true,  blurb:{gr:'Σπάσε τις σκυτάλες των αντιπάλων.', en:'Crack rivals’ ciphers.'} },
    { id:'fleece',    gr:'ΧΡΥΣΟΜΑΛΛΟΝ ΔΕΡΑΣ',  en:'Gold Quest',      glyph:'☉', accent:A.gold,   weight:5, live:true,  blurb:{gr:'Άνοιξε πίθους — απόφυγε την Πανδώρα.', en:'Open jars — dodge Pandora.'} },
    { id:'halieia',   gr:'ΑΛΙΕΙΑ',             en:'Fishing Frenzy',  glyph:'Ψ', accent:A.sage,   weight:5, live:true,  blurb:{gr:'Ρίξε τα δίχτυα στο Αιγαίο.', en:'Cast nets in the Aegean.'} },
    { id:'moirai',    gr:'ΜΟΙΡΑΙ',             en:'Wheel of Fates',  glyph:'⊛', accent:A.blood,  weight:5, live:true,  blurb:{gr:'Γύρισε τον τροχό των Μοιρών.', en:'Spin the wheel of fate.'} },
    { id:'anabasis',  gr:'ΑΝΑΒΑΣΙΣ',           en:'Millionaire',     glyph:'⛰', accent:A.gold,   weight:3, live:true,  blurb:{gr:'Ανέβα τις βαθμίδες του Ολύμπου.', en:'Climb Olympus.'} },
    { id:'hippodrome',gr:'ΑΡΜΑΤΟΔΡΟΜΙΑ',       en:'Race',            glyph:'⊚', accent:A.terra,  weight:3, live:true,  blurb:{gr:'Οδήγησε το άρμα στο τέρμα.', en:'Drive your chariot home.'} },
    { id:'manteion',  gr:'ΜΑΝΤΕΙΟΝ',           en:'Wager Quiz',      glyph:'◬', accent:A.aegean, weight:3, live:true,  blurb:{gr:'Πόνταρε τη σοφία σου.', en:'Wager your wisdom.'} },
    { id:'hegemonia', gr:'ΗΓΕΜΟΝΙΑ',           en:'Color Kingdom',   glyph:'▦', accent:A.blood,  weight:2, live:true,  blurb:{gr:'Κατάκτησε τα τετράγωνα.', en:'Conquer the squares.'} },
    { id:'akropolis', gr:'ΑΚΡΟΠΟΛΙΣ',          en:'Builder',         glyph:'⊓', accent:A.gold,   weight:2, live:true,  blurb:{gr:'Ύψωσε τους κίονες του ναού.', en:'Raise the temple columns.'} },
    { id:'discus',    gr:'ΔΙΣΚΟΣ',             en:'Plinko',          glyph:'◯', accent:A.sage,   weight:2, live:true,  blurb:{gr:'Άφησε τον δίσκο να κατρακυλήσει.', en:'Let the discus fall.'} },
    { id:'agora',     gr:'ΑΓΟΡΑ',              en:'Auction',         glyph:'⚖', accent:A.gold,   weight:2, live:true,  blurb:{gr:'Πλειοδότησε για την απάντηση.', en:'Bid for the answer.'} },
    { id:'toxotes',   gr:'ΤΟΞΟΤΗΣ',            en:'Duck Hunt',       glyph:'➶', accent:A.terra,  weight:2, live:true,  blurb:{gr:'Τόξευσε τους πετούμενους πίθους.', en:'Shoot the flying jars.'} },
  ];

  // 8 head-to-head 1v1 duels — hosted from the PvP arena, not the live class lobby (yet).
  window.PVP_DUEL_MODES = [
    { id:'skaki',     gr:'ΣΚΑΚΙ',        en:'Chess',          glyph:'♛', accent:A.blood,  weight:5, engine:'chess',   live:false, blurb:{gr:'Κανονικό σκάκι — απάντησε σωστά, αλλιώς χάνεις τη σειρά.', en:'Real chess — answer right or forfeit your move.'} },
    { id:'petteia',   gr:'ΠΕΤΤΕΙΑ',      en:'Strategy Chess', glyph:'♟', accent:A.terra,  weight:4, engine:'petteia', live:false, blurb:{gr:'Απάντησε σωστά για να κινηθείς — αιχμαλώτισε τις πέττες.', en:'Answer right to move; flank to capture.'} },
    { id:'tug',       gr:'ΔΙΕΛΚΥΣΤΙΝΔΑ', en:'Tug of War',     glyph:'⇄', accent:A.gold,   weight:4, engine:'tug',     live:false, blurb:{gr:'Τράβα το σχοινί με σωστές απαντήσεις.', en:'Pull the rope with right answers.'} },
    { id:'diogmos',   gr:'ΔΙΩΓΜΟΣ',      en:'The Pursuit',    glyph:'🔥', accent:A.blood,  weight:5, engine:'erinyes', live:false, blurb:{gr:'Οι Ερινύες κυνηγούν — τρέξε στο άσυλο.', en:'The Furies give chase — flee to asylum.'} },
    { id:'naumachia', gr:'ΝΑΥΜΑΧΙΑ',     en:'Battleship',     glyph:'⚓', accent:A.aegean, weight:3, engine:'quiz',    live:false, blurb:{gr:'Βύθισε τον στόλο του αντιπάλου.', en:'Sink the rival fleet.'} },
    { id:'akropolis_d',gr:'ΑΚΡΟΠΟΛΙΣ',   en:'Builder Duel',   glyph:'⊓', accent:A.gold,   weight:3, engine:'quiz',    live:false, blurb:{gr:'Ύψωσε τον ναό πριν τον αντίπαλο.', en:'Raise the temple first.'} },
    { id:'ekklisia_d',gr:'ΕΚΚΛΗΣΙΑ',     en:'Buzzer Duel',    glyph:'◉', accent:A.aegean, weight:3, engine:'quiz',    live:false, blurb:{gr:'Πάτα πρώτος — πάρε τον λόγο.', en:'Buzz first, take the floor.'} },
    { id:'pankration',gr:'ΠΑΓΚΡΑΤΙΟΝ',   en:'Duel',           glyph:'⚡', accent:A.blood,  weight:3, engine:'quiz',    live:false, blurb:{gr:'Καθαρή μονομαχία πόντων.', en:'Pure point duel.'} },
  ];
})();
