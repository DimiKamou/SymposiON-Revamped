// ============================================================
//  SymposiON — Voyage (Ζωφόρος) progress bridge
//  The 5 black-figure voyage games (games/voyage/<slug>.html) persist student
//  progress in their OWN same-origin localStorage under
//  `zofatos:progress:<document.title>` ({ stationIdx: {'mode:idx':true} }) and
//  admin content overrides under `zofatos:content:<title>`. Because the iframe
//  shares this origin, the parent app can READ that progress (for the Hero
//  Profile) and toggle the games' built-in editor (`zofatos:admin`) so an admin
//  edits episodes/quizzes from Site Studio. This module is the bridge.
// ============================================================
(function () {
  'use strict';

  // doc = the value of <title> in each voyage HTML (the games key their storage by it).
  var WORKS = [
    { slug:'iliada',   fn:'openIliadaVoyage',   doc:'Ιλιάδα — Η Ζωφόρος της Μήνιδος',            gr:'Ἰλιάς',     en:'Iliad',        sub:'Η Μῆνις',        illu:'shield-spear' },
    { slug:'odysseia', fn:'openOdysseiaVoyage', doc:'Οδύσσεια — Η Ζωφόρος του Νόστου',           gr:'Ὀδύσσεια',  en:'Odyssey',      sub:'Ὁ Νόστος',       illu:'trireme' },
    { slug:'eleni',    fn:'openEleniVoyage',    doc:'Ευριπίδη Ελένη — Η Ζωφόρος του Ειδώλου',    gr:'Ἑλένη',     en:'Helen',        sub:'Τὸ Εἴδωλον',     illu:'masks' },
    { slug:'troades',  fn:'openTroadesVoyage',  doc:'Ευριπίδη Τρωάδες — Η Ζωφόρος των Τρωάδων',  gr:'Τρῳάδες',   en:'Trojan Women', sub:'Ὁ Θρῆνος',       illu:'masks' },
    { slug:'alkistis', fn:'openAlkistisVoyage', doc:'Ευριπίδη Άλκηστις — Η Ζωφόρος της Αλκήστιδος', gr:'Ἄλκηστις', en:'Alcestis',  sub:'Ἡ Θυσία',        illu:'masks' },
  ];

  function _load(k) { try { var r = localStorage.getItem(k); return r ? JSON.parse(r) : null; } catch (e) { return null; } }

  // Read one work's progress: how many stations touched + total correct answers.
  function progressFor(w) {
    var p = _load('zofatos:progress:' + w.doc) || {};
    var stations = 0, answered = 0;
    Object.keys(p).forEach(function (i) {
      var st = p[i] || {}; var n = Object.keys(st).length;
      if (n > 0) stations++; answered += n;
    });
    return { stations: stations, answered: answered, started: answered > 0 };
  }

  // Aggregate across all 5 works (for the Hero Profile card).
  function summary() {
    var works = WORKS.map(function (w) {
      var pr = progressFor(w);
      return { slug:w.slug, fn:w.fn, gr:w.gr, en:w.en, sub:w.sub, illu:w.illu,
               stations:pr.stations, answered:pr.answered, started:pr.started };
    });
    return {
      works: works,
      totalAnswered: works.reduce(function (s, w) { return s + w.answered; }, 0),
      totalStations: works.reduce(function (s, w) { return s + w.stations; }, 0),
      worksStarted: works.filter(function (w) { return w.started; }).length,
    };
  }

  // Launch a work; `asEditor` unlocks the games' built-in content editor first
  // (shared origin → the iframe sees the flag and shows the admin tools).
  function open(slug, asEditor) {
    var w = WORKS.filter(function (x) { return x.slug === slug; })[0];
    if (!w) return;
    try { localStorage.setItem('zofatos:admin', asEditor ? 'true' : 'false'); } catch (e) {}
    if (typeof window[w.fn] === 'function') window[w.fn]();
  }
  function openEditor(slug) { open(slug, true); }

  window.SymVoyage = { WORKS: WORKS, progressFor: progressFor, summary: summary, open: open, openEditor: openEditor };
})();
