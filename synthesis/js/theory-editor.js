/* ════════════════════════════════════════════════════════════════════
   theory-editor.js — ISSUE 8: the MISSING theory-override authoring layer.

   Three hooks are REFERENCED across the theory subsystem but were never
   defined anywhere in the codebase, so theory editing silently did nothing:

     • window.theoryIsCurator()          — gate the in-lesson "✎ Επεξεργασία"
                                            button (theory-lesson.js:266,
                                            theory-codex.js:60, …).
     • window.loadTheoryOverride(id)     — pull the saved override for a lesson
                                            into theoryOverrides cache before a
                                            (re)render (theory-lesson.js:320).
     • window.saveTheoryOverride(id, patch) / window.clearTheoryOverride(id)
                                            — persist / remove a lesson override
                                            (theory-codex.js:160,155).
     • window.openTheoryEditor(lesson,cb) — the overlay editor the in-lesson
                                            edit button opens (theory-lesson.js:273).

   Overrides live in Firestore `lesson_overrides/{id}` (gated by can('content'))
   and are cached locally in SymStore('lesson_overrides') so they survive an
   offline sandbox. On save we ALSO push the patch into window.theoryOverrides
   (theory-data.js) so applyTheoryOverride() merges it live without a reload.

   Loaded AFTER theory-data.js + theory-edit-shared.js (window.TheoryEd) and
   BEFORE / alongside theory-lesson.js — order is enforced in index.html.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var SS = function () { return window.SymStore; };
  var LS_KEY = 'lesson_overrides';   // SymStore map { id -> patch }

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fsReady() {
    try { return typeof firebase !== 'undefined' && !!(firebase && firebase.firestore); }
    catch (_e) { return false; }
  }

  /* ── curator gate ───────────────────────────────────────────────────
     Any provisioned admin may edit theory. Mirrors the bare `isAdmin`
     lexical global (auth.js) that the rest of the admin gates on, plus the
     is-admin body class + bootstrap email as fallbacks. */
  function isCurator() {
    try { if (typeof isAdmin !== 'undefined' && isAdmin) return true; } catch (_) {}
    try { if (document.body && document.body.classList.contains('is-admin')) return true; } catch (_) {}
    try { if (window.currentUser && window.currentUser.email === 'dimikamou@gmail.com') return true; } catch (_) {}
    return false;
  }
  window.theoryIsCurator = window.theoryIsCurator || isCurator;

  /* ── local override cache (SymStore mirror) ─────────────────────────── */
  function lsAll() {
    var m = SS() ? SS().get(LS_KEY, {}) : {};
    return (m && typeof m === 'object') ? m : {};
  }
  function lsGet(id) { return lsAll()[id] || null; }
  function lsSet(id, patch) {
    var m = lsAll();
    if (patch) m[id] = patch; else delete m[id];
    if (SS()) SS().set(LS_KEY, m);
  }

  // Push a patch (or null to clear) into theory-data's live cache so the merge
  // applies without reloading the page.
  function applyLive(id, patch) {
    try { if (window.theoryOverrides && window.theoryOverrides.set) window.theoryOverrides.set(id, patch); } catch (_) {}
  }

  /* ── loadTheoryOverride(id) → Promise ───────────────────────────────
     Reads Firestore lesson_overrides/{id} when available (falling back to the
     local SymStore mirror) and primes the theory-data cache so the next
     buildLessonFromDataset(id) reflects it. Always resolves (never rejects) so
     callers can `.then()` unconditionally. */
  window.loadTheoryOverride = window.loadTheoryOverride || function (id) {
    return new Promise(function (resolve) {
      // seed from local first (instant, offline-safe)
      var local = lsGet(id);
      if (local) applyLive(id, local);
      if (!fsReady()) { resolve(local || null); return; }
      try {
        firebase.firestore().collection('lesson_overrides').doc(id).get()
          .then(function (d) {
            var patch = (d && d.exists && d.data()) || null;
            if (patch) { lsSet(id, patch); applyLive(id, patch); }
            resolve(patch || local || null);
          })
          .catch(function () { resolve(local || null); });
      } catch (_e) { resolve(local || null); }
    });
  };

  /* ── saveTheoryOverride(id, patch) → Promise ────────────────────────
     Persists to Firestore lesson_overrides/{id} (merge) + the local mirror,
     and applies live. Resolves on success; rejects if a Firestore write was
     attempted and failed (so the codex editor's .catch() toast fires). When no
     firebase is present it saves locally and resolves (sandbox-friendly). */
  window.saveTheoryOverride = window.saveTheoryOverride || function (id, patch) {
    patch = patch || {};
    lsSet(id, patch);
    applyLive(id, patch);
    return new Promise(function (resolve, reject) {
      if (!fsReady()) { resolve(patch); return; }   // local-only (sandbox)
      try {
        var rec = Object.assign({}, patch, { updatedAt: Date.now() });
        firebase.firestore().collection('lesson_overrides').doc(id)
          .set(rec, { merge: true })
          .then(function () { resolve(patch); })
          .catch(function (e) { reject(e); });
      } catch (e) { reject(e); }
    });
  };

  /* ── clearTheoryOverride(id) → Promise ─────────────────────────────── */
  window.clearTheoryOverride = window.clearTheoryOverride || function (id) {
    lsSet(id, null);
    applyLive(id, null);
    return new Promise(function (resolve, reject) {
      if (!fsReady()) { resolve(); return; }
      try {
        firebase.firestore().collection('lesson_overrides').doc(id)
          .delete()
          .then(function () { resolve(); })
          .catch(function (e) { reject(e); });
      } catch (e) { reject(e); }
    });
  };

  /* ════════════════ THE EDITOR OVERLAY ═══════════════════════════════
     A focused overlay (built on window.TheoryEd chrome) that edits the
     pedagogical fields a curator most needs: posLabel, level, meaning, intro,
     the worked example (gr/tr), the badge chips, and the flash-card prompts.
     The paradigm FORMS are intentionally NOT edited here — they come from the
     single source of truth (the grammar dataset). On save it writes ONLY the
     changed fields as the override patch. */
  var Ed = function () { return window.TheoryEd || null; };

  function ensureOverlay() {
    var ov = document.getElementById('theory-editor-overlay');
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = 'theory-editor-overlay';
    ov.setAttribute('style',
      'position:fixed;inset:0;z-index:2147483000;display:none;overflow:auto;' +
      'background:var(--ink,#12100c);color:var(--cream,#f3ead6)');
    ov.innerHTML = '<div class="tr-inner" style="max-width:920px;margin:0 auto;padding:40px 24px 80px"></div>';
    document.body.appendChild(ov);
    return ov;
  }

  function fieldHTML(label, id, value, area) {
    var E = Ed();
    var lab = E ? E.LAB : 'display:block;margin-bottom:6px;font-size:11px;opacity:.7';
    var inp = E ? (area ? E.AREA : E.INP) : 'width:100%;box-sizing:border-box;padding:8px 10px';
    var ctl = area
      ? '<textarea data-f="' + id + '" style="' + inp + '">' + esc(value) + '</textarea>'
      : '<input data-f="' + id + '" value="' + esc(value) + '" style="' + inp + '"/>';
    return '<label style="display:block;margin-bottom:16px"><span style="' + lab + '">' + esc(label) + '</span>' + ctl + '</label>';
  }

  window.openTheoryEditor = window.openTheoryEditor || function (lesson, reopenCb) {
    if (!lesson || !lesson.id) return;
    var E = Ed();
    var ov = ensureOverlay();
    var inner = ov.querySelector('.tr-inner');
    var id = lesson.id;
    var badges = (lesson.badges || []).map(function (b) { return [b[0], b[1]]; });
    var cards = (lesson.cards || []).map(function (c) {
      return { prompt: c.prompt || '', answer: c.answer || '', meaning: c.meaning || '', ex: c.ex || '' };
    });
    var ex = lesson.example || { gr: '', tr: '' };

    var bar = E ? E.barHTML({
      hint: 'Επεξεργασία προτύπου θεωρίας — οι αλλαγές υπερισχύουν του προεπιλεγμένου μαθήματος.',
      edited: !!lesson.edited, saveLabel: '✓ Αποθήκευση'
    }) : '<div style="margin-bottom:20px"><button data-ed="cancel">Άκυρο</button> <button data-ed="save">Αποθήκευση</button>' +
        (lesson.edited ? ' <button data-ed="reset">Επαναφορά</button>' : '') + '</div>';

    var h = '';
    h += '<div class="tr-eyebrow" style="margin-bottom:6px">Πρότυπο Θεωρίας · ' + esc(id) + '</div>';
    h += '<h2 style="margin:0 0 22px;font-size:28px">' + esc(lesson.title || id) + '</h2>';
    h += bar;

    h += fieldHTML('Μέρος του λόγου (posLabel)', 'posLabel', lesson.posLabel || '', false);
    h += fieldHTML('Επίπεδο (level)', 'level', lesson.level || '', false);
    h += fieldHTML('Σημασία / meaning', 'meaning', lesson.meaning || '', false);
    h += fieldHTML('Εισαγωγή (intro · επιτρέπεται HTML)', 'intro', lesson.intro || '', true);
    h += fieldHTML('Παράδειγμα — κείμενο (gr, <e>…</e> για έμφαση)', 'ex_gr', ex.gr || '', true);
    h += fieldHTML('Παράδειγμα — απόδοση (tr)', 'ex_tr', ex.tr || '', true);

    // badges (label / value rows)
    h += '<div style="margin:8px 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.7">Badges</div>';
    h += '<div data-badges style="display:flex;flex-direction:column;gap:8px;margin-bottom:12px">';
    badges.forEach(function (b, i) {
      h += '<div style="display:flex;gap:8px" data-badge="' + i + '">' +
        '<input data-bk="' + i + '" value="' + esc(b[0]) + '" placeholder="Ετικέτα" style="flex:1;' + (E ? E.INP : '') + '"/>' +
        '<input data-bv="' + i + '" value="' + esc(b[1]) + '" placeholder="Τιμή" style="flex:1;' + (E ? E.INP : '') + '"/>' +
        '<button data-bdel="' + i + '" class="tr-btn tr-btn--ghost" style="flex-shrink:0">✕</button>' +
        '</div>';
    });
    h += '</div>';
    h += '<button data-badd class="tr-btn tr-btn--ghost" style="margin-bottom:22px">＋ Badge</button>';

    // cards (prompt / answer / meaning / example)
    h += '<div style="margin:8px 0 6px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;opacity:.7">Κάρτες</div>';
    h += '<div data-cards style="display:flex;flex-direction:column;gap:14px;margin-bottom:12px">';
    cards.forEach(function (c, i) {
      h += '<div style="' + (E ? E.CARD : 'border:1px solid #444;padding:14px') + '" data-card="' + i + '">' +
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">' +
          '<span style="font-size:11px;opacity:.6">Κάρτα ' + (i + 1) + '</span>' +
          '<button data-cdel="' + i + '" class="tr-btn tr-btn--ghost">✕</button></div>' +
        '<input data-ck="prompt" data-ci="' + i + '" value="' + esc(c.prompt) + '" placeholder="Ερώτημα" style="margin-bottom:6px;' + (E ? E.INP : '') + '"/>' +
        '<input data-ck="answer" data-ci="' + i + '" value="' + esc(c.answer) + '" placeholder="Απάντηση" style="margin-bottom:6px;' + (E ? E.INP : '') + '"/>' +
        '<input data-ck="meaning" data-ci="' + i + '" value="' + esc(c.meaning) + '" placeholder="Σημασία" style="margin-bottom:6px;' + (E ? E.INP : '') + '"/>' +
        '<input data-ck="ex" data-ci="' + i + '" value="' + esc(c.ex) + '" placeholder="Παράδειγμα (<e>…</e>)" style="' + (E ? E.INP : '') + '"/>' +
        '</div>';
    });
    h += '</div>';
    h += '<button data-cadd class="tr-btn tr-btn--ghost" style="margin-bottom:22px">＋ Κάρτα</button>';

    inner.innerHTML = h;
    ov.style.display = 'block';
    document.body.style.overflow = 'hidden';

    function close() {
      ov.style.display = 'none';
      document.body.style.overflow = '';
    }
    function collect() {
      var patch = {};
      inner.querySelectorAll('[data-f]').forEach(function (n) {
        var k = n.getAttribute('data-f'), v = n.value;
        if (k === 'ex_gr' || k === 'ex_tr') return;   // handled below
        patch[k] = v;
      });
      var exGr = (inner.querySelector('[data-f="ex_gr"]') || {}).value || '';
      var exTr = (inner.querySelector('[data-f="ex_tr"]') || {}).value || '';
      if (exGr || exTr) patch.example = { gr: exGr, tr: exTr };
      // badges
      var bRows = inner.querySelectorAll('[data-badge]');
      if (bRows.length) {
        patch.badges = Array.prototype.map.call(bRows, function (row) {
          var k = (row.querySelector('[data-bk]') || {}).value || '';
          var v = (row.querySelector('[data-bv]') || {}).value || '';
          return [k, v];
        }).filter(function (p) { return p[0] || p[1]; });
      }
      // cards
      var cRows = inner.querySelectorAll('[data-card]');
      if (cRows.length) {
        patch.cards = Array.prototype.map.call(cRows, function (row) {
          var o = {};
          row.querySelectorAll('[data-ck]').forEach(function (inp) { o[inp.getAttribute('data-ck')] = inp.value; });
          return o;
        }).filter(function (o) { return o.prompt || o.answer; });
      }
      return patch;
    }

    // wire the shared status bar (or the fallback buttons)
    function onSave() {
      var patch = collect();
      var btn = inner.querySelector('[data-ed="save"]');
      if (btn) btn.textContent = '…';
      window.saveTheoryOverride(id, patch).then(function () {
        close();
        if (typeof reopenCb === 'function') reopenCb();
      }).catch(function () {
        if (btn) btn.textContent = 'Σφάλμα — δοκίμασε ξανά';
      });
    }
    function onReset() {
      window.clearTheoryOverride(id).then(function () {
        close();
        if (typeof reopenCb === 'function') reopenCb();
      }).catch(function () {});
    }
    if (E && E.wireBar) {
      E.wireBar(inner, { onCancel: close, onReset: onReset, onSave: onSave });
    } else {
      var cb = inner.querySelector('[data-ed="cancel"]'); if (cb) cb.onclick = close;
      var sb = inner.querySelector('[data-ed="save"]'); if (sb) sb.onclick = onSave;
      var rb = inner.querySelector('[data-ed="reset"]'); if (rb) rb.onclick = onReset;
    }

    // badge add/delete (re-render by reopening the editor with a mutated lesson)
    function reopenWith(l) { window.openTheoryEditor(l, reopenCb); }
    inner.querySelector('[data-badd]').onclick = function () {
      var l = Object.assign({}, lesson, { badges: collect().badges || [] });
      l.badges = (l.badges || []).concat([['', '']]);
      reopenWith(l);
    };
    inner.querySelectorAll('[data-bdel]').forEach(function (b) {
      b.onclick = function () {
        var arr = (collect().badges || []); arr.splice(+b.getAttribute('data-bdel'), 1);
        reopenWith(Object.assign({}, lesson, { badges: arr }));
      };
    });
    // card add/delete
    inner.querySelector('[data-cadd]').onclick = function () {
      var arr = (collect().cards || []).concat([{ prompt: '', answer: '', meaning: '', ex: '' }]);
      reopenWith(Object.assign({}, lesson, { cards: arr }));
    };
    inner.querySelectorAll('[data-cdel]').forEach(function (b) {
      b.onclick = function () {
        var arr = (collect().cards || []); arr.splice(+b.getAttribute('data-cdel'), 1);
        reopenWith(Object.assign({}, lesson, { cards: arr }));
      };
    });
  };
})();
