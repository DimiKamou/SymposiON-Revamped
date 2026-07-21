/* ════════════════════════════════════════════════════════════════════
   Εισαγωγή — Αρχαία Γ΄ Λυκείου (Φιλοσοφικός Λόγος)
   topics.js — the level/topic map that drives the Λύω-style picker.

   Groups (left rail)  →  levels (rows).  A synthetic «Μείξη · Όλη η
   Εισαγωγή» category is added by study.js from every level's pool.

   Each level id keys into:
     window.EIS.theory[id]  = { title, src, blocks:[{h?, paras:[]}] }   (data/theory-*.js)
     window.EIS.pools[id]   = [ {type,q,…}, … ]  closed-type questions    (data/q-*.js)
   ════════════════════════════════════════════════════════════════════ */
window.EIS = window.EIS || { topics: [], theory: {}, pools: {} };

window.EIS.topics = [
  { group: 'Σωκράτης', accent: '#7A5C9E', levels: [
    { id: 'sok-idees', label: 'Οι φιλοσοφικές ιδέες', sub: 'Δ2', hint: 'Διαλεκτική · μαιευτική · ειρωνεία · ορισμοί · επαγωγή · ηθική' },
    { id: 'sok-diki',  label: 'Η δίκη & ο θάνατος',   sub: 'Δ3', hint: 'Η κατηγορία, η απολογία, το τέλος του Σωκράτη' },
  ]},
  { group: 'Πλάτων', accent: '#2E6F8E', levels: [
    { id: 'pla-bios', label: 'Ο βίος του',              sub: 'Ε1', hint: 'Καταγωγή, Σικελία, ίδρυση της Ακαδημίας' },
    { id: 'pla-prot', label: 'Πρωταγόρας — εισαγωγή',   sub: 'Β–Γ', hint: 'Φιλοσοφική σημασία & ο μύθος του Πρωταγόρα' },
    { id: 'pla-pol',  label: 'Πολιτεία — εισαγωγή',     sub: '1–13', hint: 'Οι τρεις τάξεις, οι φύλακες, οι φιλόσοφοι-βασιλείς, η δικαιοσύνη' },
    { id: 'pla-spil', label: 'Αλληγορία του σπηλαίου',  sub: 'σημείωμα', hint: 'Παιδεία, το χρέος του φιλοσόφου, αισθητός & νοητός κόσμος' },
  ]},
  { group: 'Αριστοτέλης', accent: '#B0562C', levels: [
    { id: 'ari-bios',   label: 'Βίος και έργα',            sub: '', hint: 'Στάγειρα, Ακαδημία, Μακεδονία, Λύκειο' },
    { id: 'ari-ithika', label: 'Ηθικά Νικομάχεια — εισαγ.', sub: '', hint: 'Ηθική αρετή, μεσότητα, ευδαιμονία' },
    { id: 'ari-polit',  label: 'Πολιτικά — εισαγωγή',      sub: '', hint: 'Η πόλις, ο άνθρωπος ζῷον πολιτικόν' },
  ]},
];
