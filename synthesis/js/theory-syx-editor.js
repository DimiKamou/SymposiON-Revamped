/* ════════════════════════════════════════════════════════════════════
   theory-syx-editor.js — the curator editor for the two client-side lesson
   registries that previously had NO editor at all:

     • window.SYNTAX  — the Συντακτικό theory course (kind:'syntax')
     • window.NEG     — Έκθεση & Νεοελληνική Γλώσσα (kind:'neg')

   Both share the same lesson shape ({eyebrow, section, level, title, titleEm,
   subtitle, stats[], intro(HTML), theory[{h,body}], worked{note}, exercises}).
   The engines render window.SYNTAX.get(id) / window.NEG.get(id) directly, so
   this file also adds the missing OVERRIDE-MERGE step: saved patches are merged
   onto the built-in lessons at load (and live, after a save).

   Persistence reuses the shared theory-editor.js layer:
     window.saveTheoryOverride / loadTheoryOverride / clearTheoryOverride
   → SymStore('lesson_overrides') mirror + Firestore lesson_overrides/{id}.
   The syntax/neg lesson ids (syn-*, neg-*) never collide with the THEORY_META
   dataset ids (eimi, epitheta…), so sharing that collection is safe and the
   THEORY_META merge (applyTheoryOverride) never touches these lessons.

   Only the pedagogical TEXT is editable here (title, intro, theory sections,
   stats, worked note). The interactive EXERCISES are code-defined and are not
   restructured through this editor.

   Loaded AFTER theory-editor.js + theory-syntax.js + theory-neg.js (index.html).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var SS = function () { return window.SymStore; };
  var LS_KEY = 'lesson_overrides';   // shared with theory-editor.js
  var Ed = function () { return window.TheoryEd || null; };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function isCurator() {
    try { return (typeof window.theoryIsCurator === 'function') ? !!window.theoryIsCurator() : (typeof isAdmin !== 'undefined' && !!isAdmin); }
    catch (_) { return false; }
  }
  window.syxIsCurator = isCurator;

  function overrideMap() {
    var m = SS() ? SS().get(LS_KEY, {}) : {};
    return (m && typeof m === 'object') ? m : {};
  }

  /* ── merge saved patches into a registry's lessons (in place) ──────────
     The registry's get()/all() return the same lesson object references the
     engine renders, so an Object.assign here is picked up on next render. */
  function applyOverrides(reg) {
    if (!reg || typeof reg.all !== 'function') return;
    var m = overrideMap();
    reg.all().forEach(function (L) {
      if (!L || !L.id) return;
      var p = m[L.id];
      if (!p) return;
      Object.keys(p).forEach(function (k) {
        if (k === 'updatedAt') return;
        L[k] = p[k];
      });
    });
  }
  // apply to both known registries (safe if one isn't loaded yet)
  function applyAll() {
    applyOverrides(window.SYNTAX);
    applyOverrides(window.NEG);
  }
  window.applySyxOverrides = applyAll;

  /* ── editor overlay ───────────────────────────────────────────────── */
  function ensureOverlay() {
    var ov = document.getElementById('syx-editor-overlay');
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = 'syx-editor-overlay';
    ov.setAttribute('style',
      'position:fixed;inset:0;z-index:2147483000;display:none;overflow:auto;' +
      'background:var(--ink,#12100c);color:var(--cream,#f3ead6)');
    ov.innerHTML = '<div class="tr-inner" style="max-width:920px;margin:0 auto;padding:40px 24px 80px"></div>';
    document.body.appendChild(ov);
    return ov;
  }
  function field(label, id, value, area) {
    var E = Ed();
    var lab = E ? E.LAB : 'display:block;margin-bottom:6px;font-size:11px;opacity:.7';
    var inp = E ? (area ? E.AREA : E.INP) : 'width:100%;box-sizing:border-box;padding:8px 10px';
    var ctl = area
      ? '<textarea data-f="' + id + '" style="' + inp + '">' + esc(value) + '</textarea>'
      : '<input data-f="' + id + '" value="' + esc(value) + '" style="' + inp + '"/>';
    return '<label style="display:block;margin-bottom:16px"><span style="' + lab + '">' + esc(label) + '</span>' + ctl + '</label>';
  }
  function sectionLabel(t) {
    return '<div style="margin:8px 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.7">' + esc(t) + '</div>';
  }

  // reg is passed so save→re-merge→reopen re-renders the right registry.
  function openEditor(reg, lesson, reopenCb) {
    if (!lesson || !lesson.id) return;
    var E = Ed();
    var ov = ensureOverlay();
    var inner = ov.querySelector('.tr-inner');
    var id = lesson.id;
    var INP = E ? E.INP : 'width:100%;box-sizing:border-box;padding:8px 10px';
    var stats = (lesson.stats || []).map(function (s) { return [s[0] || '', s[1] || '']; });
    var theory = (lesson.theory || []).map(function (t) { return { h: t.h || '', body: t.body || '' }; });
    var hasWorked = !!(lesson.worked && typeof lesson.worked === 'object');
    var edited = !!overrideMap()[id];

    var bar = E ? E.barHTML({
      hint: 'Επεξεργασία μαθήματος — οι αλλαγές υπερισχύουν του προεπιλεγμένου (τα διαδραστικά ασκήσεις μένουν ως έχουν).',
      edited: edited, saveLabel: '✓ Αποθήκευση'
    }) : '<div style="margin-bottom:20px"><button data-ed="cancel">Άκυρο</button> <button data-ed="save">Αποθήκευση</button>' +
        (edited ? ' <button data-ed="reset">Επαναφορά</button>' : '') + '</div>';

    var h = '';
    h += '<div class="tr-eyebrow" style="margin-bottom:6px">' + esc(lesson.kind === 'neg' ? 'Έκθεση / ΝΕΓ' : 'Συντακτικό') + ' · ' + esc(id) + '</div>';
    h += '<h2 style="margin:0 0 22px;font-size:28px">' + esc((lesson.title || '') + (lesson.titleEm || '')) + '</h2>';
    h += bar;

    h += field('Κατηγορία (eyebrow)', 'eyebrow', lesson.eyebrow || '', false);
    h += field('Ενότητα (section)', 'section', lesson.section || '', false);
    h += field('Επίπεδο (level)', 'level', lesson.level || '', false);
    h += '<div style="display:flex;gap:12px">' +
         '<div style="flex:1">' + field('Τίτλος (title)', 'title', lesson.title || '', false) + '</div>' +
         '<div style="flex:1">' + field('Έμφαση τίτλου (titleEm)', 'titleEm', lesson.titleEm || '', false) + '</div>' +
         '</div>';
    h += field('Υπότιτλος (subtitle)', 'subtitle', lesson.subtitle || '', false);
    h += field('Εισαγωγή (intro · επιτρέπεται HTML: <b> <i> …)', 'intro', lesson.intro || '', true);

    // stats — [label, value] rows
    h += sectionLabel('Στατιστικά (stats)');
    h += '<div data-stats style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">';
    stats.forEach(function (s, i) {
      h += '<div style="display:flex;gap:8px" data-stat="' + i + '">' +
        '<input data-sk="' + i + '" value="' + esc(s[0]) + '" placeholder="Ετικέτα" style="flex:1;' + INP + '"/>' +
        '<input data-sv="' + i + '" value="' + esc(s[1]) + '" placeholder="Τιμή" style="flex:1;' + INP + '"/>' +
        '<button data-sdel="' + i + '" class="tr-btn tr-btn--ghost" style="flex-shrink:0">✕</button>' +
        '</div>';
    });
    h += '</div><button data-sadd class="tr-btn tr-btn--ghost" style="margin-bottom:22px">＋ Στατιστικό</button>';

    // theory — {h, body} cards
    h += sectionLabel('Θεωρία — ενότητες');
    h += '<div data-theory style="display:flex;flex-direction:column;gap:14px;margin-bottom:12px">';
    theory.forEach(function (t, i) {
      h += '<div style="' + (E ? E.CARD : 'border:1px solid #444;padding:14px') + '" data-th="' + i + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
          '<span style="font-size:11px;opacity:.6">Ενότητα ' + (i + 1) + '</span>' +
          '<button data-thdel="' + i + '" class="tr-btn tr-btn--ghost">✕</button></div>' +
        '<input data-thh="' + i + '" value="' + esc(t.h) + '" placeholder="Τίτλος ενότητας" style="margin-bottom:6px;' + INP + '"/>' +
        '<textarea data-thb="' + i + '" placeholder="Κείμενο (επιτρέπεται HTML)" style="' + (E ? E.AREA : 'width:100%;min-height:80px') + '">' + esc(t.body) + '</textarea>' +
        '</div>';
    });
    h += '</div><button data-thadd class="tr-btn tr-btn--ghost" style="margin-bottom:22px">＋ Ενότητα θεωρίας</button>';

    // worked example note (SYNTAX only)
    if (hasWorked) {
      h += field('Σχόλιο παραδείγματος (worked.note · HTML)', 'workednote', (lesson.worked && lesson.worked.note) || '', true);
    }

    inner.innerHTML = h;
    ov.style.display = 'block';
    document.body.style.overflow = 'hidden';

    function close() { ov.style.display = 'none'; document.body.style.overflow = ''; }

    function collect() {
      var patch = {};
      inner.querySelectorAll('[data-f]').forEach(function (n) {
        var k = n.getAttribute('data-f');
        if (k === 'workednote') return;
        patch[k] = n.value;
      });
      // stats
      var sRows = inner.querySelectorAll('[data-stat]');
      patch.stats = Array.prototype.map.call(sRows, function (row) {
        return [(row.querySelector('[data-sk]') || {}).value || '', (row.querySelector('[data-sv]') || {}).value || ''];
      }).filter(function (p) { return p[0] || p[1]; });
      // theory
      var tRows = inner.querySelectorAll('[data-th]');
      patch.theory = Array.prototype.map.call(tRows, function (row) {
        return { h: (row.querySelector('[data-thh]') || {}).value || '', body: (row.querySelector('[data-thb]') || {}).value || '' };
      }).filter(function (t) { return t.h || t.body; });
      // worked note (preserve the rest of worked{})
      if (hasWorked) {
        var note = (inner.querySelector('[data-f="workednote"]') || {}).value || '';
        patch.worked = Object.assign({}, lesson.worked, { note: note });
      }
      return patch;
    }

    function afterSaved() {
      applyAll();
      close();
      if (typeof reopenCb === 'function') reopenCb();
    }
    function onSave() {
      var patch = collect();
      var btn = inner.querySelector('[data-ed="save"]');
      if (btn) btn.textContent = '…';
      if (typeof window.saveTheoryOverride === 'function') {
        window.saveTheoryOverride(id, patch).then(afterSaved).catch(function () { if (btn) btn.textContent = 'Σφάλμα — δοκίμασε ξανά'; });
      } else {
        // no persistence layer → merge in memory only
        var m = overrideMap(); m[id] = patch; if (SS()) SS().set(LS_KEY, m);
        afterSaved();
      }
    }
    function onReset() {
      if (typeof window.clearTheoryOverride === 'function') {
        window.clearTheoryOverride(id).then(function () {
          // clearing only removes the patch; the base lesson keeps the last
          // merged values in memory, so reload to fully restore. Best-effort:
          location.reload();
        }).catch(function () {});
      } else {
        var m = overrideMap(); delete m[id]; if (SS()) SS().set(LS_KEY, m); location.reload();
      }
    }
    if (E && E.wireBar) E.wireBar(inner, { onCancel: close, onReset: onReset, onSave: onSave });
    else {
      var cb = inner.querySelector('[data-ed="cancel"]'); if (cb) cb.onclick = close;
      var sb = inner.querySelector('[data-ed="save"]'); if (sb) sb.onclick = onSave;
      var rb = inner.querySelector('[data-ed="reset"]'); if (rb) rb.onclick = onReset;
    }

    // add / delete rows — reopen with a mutated lesson so values persist
    function reopenWith(l) { openEditor(reg, l, reopenCb); }
    var addS = inner.querySelector('[data-sadd]'); if (addS) addS.onclick = function () {
      reopenWith(Object.assign({}, lesson, collect(), { stats: (collect().stats || []).concat([['', '']]) }));
    };
    inner.querySelectorAll('[data-sdel]').forEach(function (b) {
      b.onclick = function () { var a = collect().stats || []; a.splice(+b.getAttribute('data-sdel'), 1); reopenWith(Object.assign({}, lesson, collect(), { stats: a })); };
    });
    var addT = inner.querySelector('[data-thadd]'); if (addT) addT.onclick = function () {
      reopenWith(Object.assign({}, lesson, collect(), { theory: (collect().theory || []).concat([{ h: '', body: '' }]) }));
    };
    inner.querySelectorAll('[data-thdel]').forEach(function (b) {
      b.onclick = function () { var a = collect().theory || []; a.splice(+b.getAttribute('data-thdel'), 1); reopenWith(Object.assign({}, lesson, collect(), { theory: a })); };
    });
  }

  /* ── public openers (resolve the lesson from the registry) ──────────── */
  function _open(reg, id, cb) {
    if (!reg || typeof reg.get !== 'function') { if (window.showToast) showToast('Η ενότητα δεν φορτώθηκε.'); return; }
    // pull this lesson's Firestore override (if any) into the local mirror,
    // merge, THEN open — so an admin on another device sees the latest.
    function go() { var L = reg.get(id); if (!L) { if (window.showToast) showToast('Δεν βρέθηκε το μάθημα.'); return; } applyOverrides(reg); openEditor(reg, reg.get(id), cb); }
    if (typeof window.loadTheoryOverride === 'function') {
      try { window.loadTheoryOverride(id).then(go).catch(go); } catch (_) { go(); }
    } else { go(); }
  }
  window.openSyntaxLessonEditor = function (id, cb) { _open(window.SYNTAX, id, cb); };
  window.openNegLessonEditor    = function (id, cb) { _open(window.NEG, id, cb); };

  /* ── apply saved overrides on load (once the registries exist) ──────── */
  function boot() {
    applyAll();
    // registries/data files may load slightly after us — retry briefly.
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      if ((window.SYNTAX && window.SYNTAX.all) || (window.NEG && window.NEG.all)) applyAll();
      if (tries > 20) clearInterval(iv);
    }, 150);
  }
  if (document.readyState !== 'loading') boot();
  else document.addEventListener('DOMContentLoaded', boot);
})();
