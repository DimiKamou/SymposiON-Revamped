/* ════════════════════════════════════════════════════════════════════
   theory-codex.js — the Αόριστος Β΄ reference codex (lesson-codex.jsx).
   Many lemmas × fixed principal-part columns; the aorist-β΄ column reads
   terra. Searchable; teacher-editable (rows saved to lesson_overrides).

   The verb list is built from the EXISTING games/aoristos-b/data.js
   (AOB_VERBS + the same endings the game uses) so the codex, the Κάρτες
   and the AI tutor all read ONE source (addendum requirement).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var CX_KEYS = ['pres', 'aor', 'sub', 'opt', 'imp', 'inf', 'part'];
  var CX_COLS = ['Ενεστώτας', 'Αόρ. β΄', 'Υποτακτ.', 'Ευκτ.', 'Προστ.', 'Απαρ.', 'Μετοχή'];

  // short modern-Greek glosses for the 20 αόριστος-β΄ verbs
  var AOB_GLOSS = {
    'ἄγω': 'οδηγώ', 'ἁμαρτάνω': 'σφάλλω', 'βάλλω': 'ρίχνω', 'γίγνομαι': 'γίνομαι',
    'ἔρχομαι': 'έρχομαι', 'εὑρίσκω': 'βρίσκω', 'ἔχω': 'έχω', 'λαμβάνω': 'παίρνω',
    'λανθάνω': 'διαφεύγω', 'λέγω': 'λέω', 'λείπω': 'εγκαταλείπω', 'μανθάνω': 'μαθαίνω',
    'ὁράω': 'βλέπω', 'πάσχω': 'παθαίνω', 'πίπτω': 'πέφτω', 'πυνθάνομαι': 'πληροφορούμαι',
    'τέμνω': 'κόβω', 'τρέχω': 'τρέχω', 'φέρω': 'φέρνω', 'φεύγω': 'φεύγω',
  };

  // build the codex verb rows from AOB_VERBS (same concatenation the game uses)
  function aobToCodex() {
    if (typeof AOB_VERBS === 'undefined' || typeof AOB_ACT_IND === 'undefined') return null;
    var verbs = AOB_VERBS.map(function (v) {
      var mid = (v.v === 'mid');
      var IND = mid ? AOB_MID_IND : AOB_ACT_IND;
      var SUB = mid ? AOB_MID_SUB : AOB_ACT_SUB;
      var OPT = mid ? AOB_MID_OPT : AOB_ACT_OPT;
      var IMP = mid ? AOB_MID_IMP : AOB_ACT_IMP;
      var INF = mid ? AOB_MID_INF : AOB_ACT_INF;
      var PART = mid ? AOB_MID_PART : AOB_ACT_PART;
      return {
        pres: v.p,
        aor: v.ri + IND[0],                          // headline — correctly accented
        sub: v.r + SUB[0],
        opt: v.r + OPT[0],
        imp: (!mid && v.exc) ? v.exc : v.r + IMP[0],
        inf: v.r + INF,
        part: v.r + PART.αρσ,
        gloss: AOB_GLOSS[v.p] || '',
      };
    });
    return { cols: CX_COLS, verbs: verbs };
  }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function elFrom(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  var CXINP = 'background:var(--inset);border:1px solid var(--line);border-radius:2px;color:var(--cream);font-family:var(--f-serif);font-size:16px;padding:7px 9px;outline:none;width:100%;box-sizing:border-box';

  /* ── render the codex into the lesson mount ─────────────────────── */
  function renderTheoryCodex(lesson, mount, reopen) {
    if (!mount) return;
    var admin = (typeof window.theoryIsCurator === 'function') && window.theoryIsCurator();
    var hd0 = lesson.headline || ['Αόριστος', 'Β΄'];
    var st = {
      q: '', editing: false, rows: (lesson.verbs || []).map(function (v) { return Object.assign({}, v); }),
      hd: [hd0[0] || '', hd0[1] || ''], posLabel: lesson.posLabel || '', level: lesson.level || '',
      meaning: lesson.meaning || '', intro: lesson.intro || '',
    };
    var cols = lesson.cols || CX_COLS;
    var ED = window.TheoryEd || {};

    function toast(m) { if (typeof showToast === 'function') showToast(m, m); }

    function render() {
      var norm = function (s) { return (s || '').toLowerCase(); };
      var view = st.editing ? st.rows : st.rows.filter(function (v) {
        return !st.q.trim() || [v.pres, v.aor, v.gloss].some(function (x) { return norm(x).indexOf(norm(st.q)) >= 0; });
      });
      var h = '<div>';
      // header
      h += '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px"><div>' +
        '<div class="tr-eyebrow">Αρχαία Ελληνικά · ' + esc(lesson.posLabel || 'Ρήμα') + ' · ' + esc(lesson.level || '') +
          (lesson.edited ? ' <span style="color:var(--gold);margin-left:8px">· επεξεργασμένο</span>' : '') + '</div>' +
        '<div class="tr-lemma" style="font-size:52px;margin-top:10px">' + esc((lesson.headline || hd0)[0]) + ' <em>' + esc((lesson.headline || hd0)[1]) + '</em></div>' +
        '<div class="tr-meaning" style="font-size:21px;margin-top:4px">' + esc(lesson.meaning || '') + '</div></div>';
      if (admin && !st.editing) h += '<button class="tr-btn tr-btn--ghost" data-a="edit" style="flex-shrink:0">✎ Επεξεργασία</button>';
      h += '</div>';
      h += '<p class="tr-body" style="margin-top:18px;max-width:780px;font-size:17px">' + (lesson.intro || '') + '</p>';

      // toolbar
      if (st.editing) {
        // header card (Κεφαλίδα codex)
        h += '<div style="' + (ED.CARD || 'border:1px solid var(--line);border-radius:3px;padding:18px 20px') + ';margin:22px 0 14px">' +
          '<div class="tr-kicker" style="color:var(--gold);margin-bottom:14px">Κεφαλίδα codex</div>' +
          '<div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">' +
            '<div><label style="' + ED.LAB + '">Κατηγορία (eyebrow)</label><input style="' + ED.MONO + '" data-hf="posLabel" value="' + esc(st.posLabel) + '"/></div>' +
            '<div><label style="' + ED.LAB + '">Τάξη / επίπεδο</label><input style="' + ED.MONO + '" data-hf="level" value="' + esc(st.level) + '"/></div></div>' +
          '<label style="' + ED.LAB + ';margin-top:18px">Τίτλος — το δεύτερο κομμάτι φωτίζεται</label>' +
          '<div style="display:flex;gap:8px">' +
            '<input style="' + ED.INP + ';font-family:var(--f-serif);font-size:22px" data-hd="0" value="' + esc(st.hd[0]) + '" placeholder="Αόριστος"/>' +
            '<input style="' + ED.INP + ';font-family:var(--f-serif);font-size:22px;color:var(--terra)" data-hd="1" value="' + esc(st.hd[1]) + '" placeholder="Β΄"/></div>' +
          '<label style="' + ED.LAB + ';margin-top:18px">Υπότιτλος</label>' +
          '<input style="' + ED.INP + '" data-hf="meaning" value="' + esc(st.meaning) + '"/>' +
          '<label style="' + ED.LAB + ';margin-top:18px">Εισαγωγή — επιτρέπεται &lt;b&gt;</label>' +
          '<textarea style="' + ED.AREA + '" data-hf="intro">' + esc(st.intro) + '</textarea></div>';
        h += '<div style="display:flex;align-items:center;gap:10px;margin:0 0 12px">' +
          '<span class="tr-kicker" style="color:var(--gold)">✎ Ρήματα codex</span><div style="flex:1"></div>' +
          '<button class="tr-btn tr-btn--ghost" data-a="add">＋ Ρήμα</button>' +
          (lesson.edited ? '<button class="tr-btn tr-btn--ghost" data-a="reset" style="color:var(--terra);border-color:color-mix(in srgb,var(--terra) 40%,transparent)">Επαναφορά</button>' : '') +
          '<button class="tr-btn tr-btn--ghost" data-a="cancel">Άκυρο</button>' +
          '<button class="tr-btn tr-btn--terra" data-a="save">✓ Αποθήκευση</button></div>';
      } else {
        h += '<div style="display:flex;align-items:center;gap:14px;margin:22px 0 14px">' +
          '<input class="cx-search" data-a="q" value="' + esc(st.q) + '" placeholder="Αναζήτηση ρήματος…"/>' +
          '<div class="tr-cap">' + view.length + ' / ' + st.rows.length + ' ρήματα</div><div style="flex:1"></div>' +
          '<div class="tr-cap"><span style="color:var(--terra)">terra</span> = αόριστος β΄</div></div>';
      }

      // grid
      h += '<div class="cx-wrap"><div class="cx-grid" style="grid-template-columns:' +
        (st.editing ? 'repeat(' + cols.length + ',1fr) 36px' : 'repeat(' + cols.length + ',1fr)') + '">';
      cols.forEach(function (c, i) { h += '<div class="cx-h' + (i === 1 ? ' aor' : '') + '">' + esc(c) + '</div>'; });
      if (st.editing) h += '<div class="cx-h"></div>';
      view.forEach(function (v) {
        var realIdx = st.editing ? st.rows.indexOf(v) : st.rows.indexOf(v);
        CX_KEYS.forEach(function (k, ci) {
          var cls = 'cx-c' + (ci === 1 ? ' aor' : '') + (ci === 0 ? ' pres' : '');
          if (st.editing) {
            h += '<div class="' + cls + '"><input style="' + CXINP + (ci === 1 ? ';color:var(--terra)' : '') + '" data-ck="' + k + '" data-ci="' + realIdx + '" value="' + esc(v[k] || '') + '"/></div>';
          } else {
            h += '<div class="' + cls + '"><span>' + esc(v[k] || '') +
              (ci === 0 && v.gloss ? '<span class="cx-gloss">' + esc(v.gloss) + '</span>' : '') + '</span></div>';
          }
        });
        if (st.editing) h += '<button class="cx-del" data-del="' + realIdx + '" title="Διαγραφή">✕</button>';
      });
      h += '</div></div>';
      if (!st.editing) h += '<p class="tr-cap" style="margin-top:18px;text-transform:none;letter-spacing:0;font-family:var(--f-serif);font-style:italic;font-size:15px;color:var(--stone)">Τα ίδια ρήματα τροφοδοτούν και τις «Κάρτες» και τον βοηθό — μία πηγή, πολλές χρήσεις.</p>';
      // Κάρτες handoff
      if (!st.editing && typeof navToStudy === 'function') {
        h += '<div style="margin-top:14px"><button class="tr-btn tr-btn--ghost" data-a="cards">▶ Κάρτες (Μνημοσύνη)</button></div>';
      }
      h += '</div>';

      mount.innerHTML = '';
      mount.appendChild(elFrom(h));

      var eb = mount.querySelector('[data-a="edit"]'); if (eb) eb.onclick = function () { st.editing = true; render(); };
      var qq = mount.querySelector('[data-a="q"]'); if (qq) qq.oninput = function (e) { st.q = e.target.value; render(); var n = mount.querySelector('[data-a="q"]'); if (n) { n.focus(); n.setSelectionRange(n.value.length, n.value.length); } };
      var cards = mount.querySelector('[data-a="cards"]'); if (cards) cards.onclick = function () { navToStudy(lesson.id); };
      var add = mount.querySelector('[data-a="add"]'); if (add) add.onclick = function () { st.rows.push({ pres: '', aor: '', sub: '', opt: '', imp: '', inf: '', part: '', gloss: '' }); render(); };
      var cancel = mount.querySelector('[data-a="cancel"]'); if (cancel) cancel.onclick = function () { st.rows = (lesson.verbs || []).map(function (v) { return Object.assign({}, v); }); st.editing = false; render(); };
      // header card fields (silent)
      mount.querySelectorAll('[data-hf]').forEach(function (el) { el.oninput = function (e) { st[el.dataset.hf] = e.target.value; }; });
      mount.querySelectorAll('[data-hd]').forEach(function (el) { el.oninput = function (e) { st.hd[+el.dataset.hd] = e.target.value; }; });
      var reset = mount.querySelector('[data-a="reset"]'); if (reset) reset.onclick = function () {
        window.clearTheoryOverride(lesson.id).then(function () { reopen && reopen(); }).catch(function () { toast('Δεν αποθηκεύτηκε'); });
      };
      var save = mount.querySelector('[data-a="save"]'); if (save) save.onclick = function () {
        var rows = st.rows.filter(function (r) { return r.pres || r.aor; });
        var patch = { verbs: rows, headline: [st.hd[0], st.hd[1]], posLabel: st.posLabel, level: st.level, meaning: st.meaning, intro: st.intro };
        window.saveTheoryOverride(lesson.id, patch).then(function () { toast('✓ Αποθηκεύτηκε'); reopen && reopen(); }).catch(function () { toast('Δεν αποθηκεύτηκε — έλεγξε σύνδεση/δικαιώματα'); });
      };
      mount.querySelectorAll('[data-ck]').forEach(function (inp) {
        inp.oninput = function (e) { var i = +inp.dataset.ci, k = inp.dataset.ck; if (st.rows[i]) st.rows[i][k] = e.target.value; };
      });
      mount.querySelectorAll('[data-del]').forEach(function (b) {
        b.onclick = function () { st.rows.splice(+b.dataset.del, 1); render(); };
      });
    }
    render();
  }

  // register the codex lesson into the shared meta registry
  function _register() {
    if (!window.THEORY_META) { setTimeout(_register, 50); return; }
    window.THEORY_META['aoristos-b'] = {
      kind: 'codex', posLabel: 'Ρήμα', level: 'Γ΄ Γυμνασίου',
      meaning: 'ο δυνατός (θεματικός) αόριστος — 20 ανώμαλα ρήματα',
      intro: 'Ο <b>αόριστος β΄</b> (δυνατός/θεματικός) σχηματίζεται από διαφορετικό, συχνά συντομευμένο <b>ρηματικό θέμα</b> — όχι με τον χαρακτήρα <b>‑σ‑</b> του αορίστου α΄. Παίρνει τις καταλήξεις του παρατατικού/ενεστώτα. Στην <b>οριστική</b> το θέμα είναι αυξημένο· στις άλλες εγκλίσεις (υποτακτική, ευκτική, προστακτική, απαρέμφατο, μετοχή) χωρίς αύξηση.',
      build: function () { return aobToCodex(); },
    };
  }
  _register();

  window.aobToCodex = aobToCodex;
  window.renderTheoryCodex = renderTheoryCodex;
})();
