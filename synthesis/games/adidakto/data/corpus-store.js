/* ════════════════════════════════════════════════════════════════════
   corpus-store.js — shared «Ανθολόγιο Αδιδάκτων» store for all three
   αδίδακτο screens (Workspace, Exam Simulator, Admin).

   Firestore-ready: each entry matches the handoff §C `corpus/{id}` schema
   (author, work, genre, diff, text, words, source, usedInExams…) PLUS the
   study apparatus the self-contained build needs (intro, sentences[{gr,model}],
   translation, glosses[{w,gloss}], questions[…]). When Firebase is wired,
   swap AdidaktoCorpus.load/save for `corpus` collection reads/writes — the
   entry shape is already aligned.

   Persistence now: bundled window.CORPUS_BASE (data/corpus.js) seeds
   localStorage 'sym_corpus_v1' on first run; the Admin screen edits that key;
   Workspace + Exam read it. 'Export' bakes edits back into data/corpus.js.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';
  var LS = 'sym_corpus_v1';
  function base(){ return (window.CORPUS_BASE || []).map(function(e){ return JSON.parse(JSON.stringify(e)); }); }
  function load(){
    try{
      var v = JSON.parse(localStorage.getItem(LS));
      if(Array.isArray(v) && v.length) return v;
    }catch(e){}
    var seed = base();
    try{ localStorage.setItem(LS, JSON.stringify(seed)); }catch(e){}
    return seed;
  }
  function save(list){ try{ localStorage.setItem(LS, JSON.stringify(list)); }catch(e){} }
  function byId(id){ return load().filter(function(e){ return String(e.id) === String(id); })[0] || null; }
  function reset(){ try{ localStorage.removeItem(LS); }catch(e){} return base(); }
  window.AdidaktoCorpus = { load: load, save: save, byId: byId, reset: reset, base: base, LS: LS };
})();
