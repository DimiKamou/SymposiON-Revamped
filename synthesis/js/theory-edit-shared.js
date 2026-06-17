/* ════════════════════════════════════════════════════════════════════
   theory-edit-shared.js — shared chrome for the in-place teacher editors
   across every lesson kind (grammar, codex, text, Q&A, parallel). Factors
   out the gold-tinted status bar (EdBar: Άκυρο / Επαναφορά / ✓ Αποθήκευση)
   and the common field style strings so the editing chrome is identical.
   Vanilla port of lesson-editor-shared.jsx; exposed as window.TheoryEd.
   Load BEFORE the other theory-* editor modules.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function elFrom(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

  // shared field style strings (mirror ED_LAB / ED_INPUT / ED_MONO / ED_AREA / ED_CARD)
  var INP = 'background:var(--inset);border:1px solid var(--line);border-radius:2px;color:var(--cream);font-family:var(--f-serif);font-size:17px;padding:8px 10px;outline:none;width:100%;box-sizing:border-box';
  var LAB = 'font-family:var(--f-mono);font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--stone);display:block;margin-bottom:6px';
  var MONO = INP + ';font-family:var(--f-mono);font-size:13px';
  var AREA = INP + ';min-height:90px;resize:vertical;line-height:1.5';
  var CARD = 'border:1px solid var(--line);border-radius:3px;padding:18px 20px';
  var CHIP_DOTS = [['d-mood', 'Έγκλιση'], ['d-tense', 'Χρόνος / ρήμα'], ['d-person', 'Πρόσωπο'], ['d-voice', 'Φωνή'], ['d-form', 'Τύπος']];

  // status bar HTML. opts: { hint, edited, saveLabel }. Buttons carry
  // data-ed="cancel|reset|save"; wire them with wireBar().
  function barHTML(opts) {
    opts = opts || {};
    return '<div style="display:flex;justify-content:space-between;align-items:center;gap:14px;' +
      'border:1px solid var(--line-hi);background:color-mix(in srgb,var(--gold) 6%,transparent);' +
      'border-radius:3px;padding:14px 18px;flex-wrap:wrap;margin-bottom:24px">' +
      '<div><div class="tr-kicker" style="color:var(--gold)">✎ Λειτουργία επεξεργασίας · Καθηγητής</div>' +
      '<div class="tr-cap" style="margin-top:4px;text-transform:none;letter-spacing:0">' +
        esc(opts.hint || 'Οι αλλαγές αποθηκεύονται και υπερισχύουν του προεπιλεγμένου.') + '</div></div>' +
      '<div style="display:flex;gap:10px;flex-shrink:0">' +
        '<button class="tr-btn tr-btn--ghost" data-ed="cancel">Άκυρο</button>' +
        (opts.edited ? '<button class="tr-btn tr-btn--ghost" data-ed="reset" style="color:var(--terra);border-color:color-mix(in srgb,var(--terra) 40%,transparent)">Επαναφορά</button>' : '') +
        '<button class="tr-btn tr-btn--terra" data-ed="save">' + esc(opts.saveLabel || '✓ Αποθήκευση') + '</button>' +
      '</div></div>';
  }
  function wireBar(root, h) {
    var c = root.querySelector('[data-ed="cancel"]'); if (c && h.onCancel) c.onclick = h.onCancel;
    var r = root.querySelector('[data-ed="reset"]'); if (r && h.onReset) r.onclick = h.onReset;
    var s = root.querySelector('[data-ed="save"]'); if (s && h.onSave) s.onclick = h.onSave;
  }

  window.TheoryEd = { esc: esc, elFrom: elFrom, INP: INP, LAB: LAB, MONO: MONO, AREA: AREA, CARD: CARD, CHIP_DOTS: CHIP_DOTS, barHTML: barHTML, wireBar: wireBar };
})();
