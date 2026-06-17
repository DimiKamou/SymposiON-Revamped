/* ════════════════════════════════════════════════════════════════════
   theory-parallel.js — side-by-side bilingual reader (lesson-parallel.jsx).
   Each row pairs an ancient line (left) with its modern rendering (right),
   aligned by index; the student can hide the right column and reveal line
   by line. Curator-authored: stored as an authored_lessons doc with
   kind:'parallel' (no reference-answer security — both sides are visible).

   Entry points: openParallelLesson(idOrDoc) · openParallelStudio() (blank)
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var ED = null;
  function ed() { return (ED = ED || window.TheoryEd || {}); }
  function esc(s) { return ed().esc ? ed().esc(s) : String(s == null ? '' : s); }
  function elFrom(h) { return ed().elFrom ? ed().elFrom(h) : (function () { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstElementChild; })(); }
  function _db() { try { return firebase.firestore(); } catch (_) { return null; } }
  function _uid() { try { return firebase.auth().currentUser ? firebase.auth().currentUser.uid : null; } catch (_) { return null; } }
  function toast(m) { if (typeof showToast === 'function') showToast(m, m); }
  function isCurator() { return (typeof window.theoryIsCurator === 'function') && window.theoryIsCurator(); }
  function _docId(id) { return String(id || '').replace(/^pl:/, ''); }

  var S = { lesson: null, hide: false, shown: {}, editing: false };

  function modelFromDoc(id, d) {
    return {
      id: id, kind: 'parallel', navGroup: d.navGroup || 'literature',
      title: d.title || 'Παράλληλο κείμενο', tag: d.tag || '', level: d.level || '', intro: d.intro || '',
      leftLabel: d.leftLabel || 'Αρχαίο κείμενο', rightLabel: d.rightLabel || 'Νέα ελληνικά',
      commentary: d.commentary || '', pairs: Array.isArray(d.pairs) ? d.pairs.map(function (p) { return { a: p.a, g: p.g }; }) : [],
    };
  }

  /* ── read view ──────────────────────────────────────────────────── */
  function renderRead(mount) {
    var L = S.lesson;
    mount.innerHTML = '';
    var pairs = L.pairs || [];
    var h = '<div><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap"><div>' +
      '<div class="tr-eyebrow">Παράλληλο κείμενο · ' + esc(L.level) + (L.edited ? ' <span style="color:var(--gold);margin-left:8px">· επεξεργασμένο</span>' : '') + '</div>' +
      '<div class="tr-lemma" style="font-size:40px;line-height:1.05;margin-top:8px">' + esc(L.title) + '</div>' +
      (L.tag ? '<div class="tr-meaning" style="font-size:19px;margin-top:6px">' + esc(L.tag) + '</div>' : '') + '</div>' +
      '<div style="display:flex;gap:10px;flex-shrink:0">' +
        (isCurator() ? '<button class="tr-btn tr-btn--ghost" data-a="edit">✎ Επεξεργασία</button>' : '') +
        '<button class="tr-btn ' + (S.hide ? 'tr-btn--terra' : 'tr-btn--ghost') + '" data-a="hide">' + (S.hide ? '◉ Απόδοση κρυφή' : '◯ Κρύψε την απόδοση') + '</button>' +
      '</div></div>';
    if (L.intro) h += '<p class="tr-body" style="margin-top:16px;max-width:760px">' + L.intro + '</p>';
    h += '<div class="pl-wrap" style="margin-top:24px"><div class="pl-head"><div class="pl-h-l">' + esc(L.leftLabel) + '</div><div class="pl-h-r">' + esc(L.rightLabel) + '</div></div>';
    if (!pairs.length) h += '<div class="tt-empty" style="margin:16px">Δεν υπάρχουν στίχοι ακόμη.</div>';
    pairs.forEach(function (p, i) {
      var reveal = !S.hide || S.shown[i];
      h += '<div class="pl-row"><span class="pl-n">' + (i + 1) + '</span><div class="pl-a">' + esc(p.a) + '</div>' +
        '<div class="pl-g' + (reveal ? '' : ' masked') + '" data-rev="' + i + '">' +
        (p.g ? (reveal ? esc(p.g) : '<span class="pl-tap">δες την απόδοση</span>') : '<span style="color:var(--fog)">—</span>') + '</div></div>';
    });
    h += '</div>';
    if (L.commentary) h += '<div style="margin-top:28px"><div class="tr-kicker" style="color:var(--gold)">Σχόλιο</div><p class="trr-note" style="margin-top:10px">' + L.commentary + '</p></div>';
    h += '<div class="tr-cap" style="margin-top:18px">' + (S.hide ? 'Πάτησε ένα κελί δεξιά για να αποκαλύψεις τη γραμμή' : 'Κάθε γραμμή αρχαίου ευθυγραμμίζεται με την απόδοσή της') + '</div></div>';
    mount.appendChild(elFrom(h));
    var eb = mount.querySelector('[data-a="edit"]'); if (eb) eb.onclick = function () { S.editing = true; render(); };
    var hb = mount.querySelector('[data-a="hide"]'); if (hb) hb.onclick = function () { S.hide = !S.hide; S.shown = {}; render(); };
    mount.querySelectorAll('[data-rev]').forEach(function (el) { el.onclick = function () { if (S.hide) { S.shown[+el.dataset.rev] = true; render(); } }; });
  }

  /* ── editor ─────────────────────────────────────────────────────── */
  function renderEditor(mount) {
    var E = ed(), L = S.lesson;
    var es = {
      title: L.title || '', tag: L.tag || '', level: L.level || '', intro: L.intro || '',
      leftLabel: L.leftLabel || '', rightLabel: L.rightLabel || '', commentary: L.commentary || '',
      pairs: (L.pairs || []).map(function (p) { return { a: p.a, g: p.g }; }),
    };
    function draw() {
      var h = '<div>' + E.barHTML({ hint: 'Διόρθωσε τους στίχους και τις αποδόσεις· κάθε ζεύγος ευθυγραμμίζεται κατά γραμμή.', edited: false });
      h += '<div style="' + E.CARD + ';margin-bottom:22px"><div class="tr-kicker" style="color:var(--gold);margin-bottom:14px">Κεφαλίδα</div>' +
        '<div style="display:grid;grid-template-columns:2fr 1fr;gap:14px">' +
          '<div><label style="' + E.LAB + '">Τίτλος</label><input style="' + E.INP + '" data-f="title" value="' + esc(es.title) + '"/></div>' +
          '<div><label style="' + E.LAB + '">Επίπεδο</label><input style="' + E.MONO + '" data-f="level" value="' + esc(es.level) + '"/></div></div>' +
        '<label style="' + E.LAB + ';margin-top:14px">Υπότιτλος (tag)</label><input style="' + E.INP + '" data-f="tag" value="' + esc(es.tag) + '"/>' +
        '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:14px">' +
          '<div><label style="' + E.LAB + '">Ετικέτα αριστερής</label><input style="' + E.MONO + '" data-f="leftLabel" value="' + esc(es.leftLabel) + '" placeholder="Αρχαίο κείμενο"/></div>' +
          '<div><label style="' + E.LAB + '">Ετικέτα δεξιάς</label><input style="' + E.MONO + '" data-f="rightLabel" value="' + esc(es.rightLabel) + '" placeholder="Νέα ελληνικά"/></div></div>' +
        '<label style="' + E.LAB + ';margin-top:14px">Εισαγωγή — επιτρέπεται &lt;b&gt;</label><textarea style="' + E.AREA + '" data-f="intro">' + esc(es.intro) + '</textarea></div>';
      h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px"><label style="' + E.LAB + ';margin:0">Ζεύγη στίχων · ' + es.pairs.length + '</label>' +
        '<button class="tr-btn tr-btn--ghost" data-a="addpair" style="padding:6px 12px">＋ Στίχος</button></div>';
      if (!es.pairs.length) h += '<div class="tt-empty">Δεν υπάρχουν στίχοι — πάτησε «＋ Στίχος».</div>';
      h += '<div style="display:flex;flex-direction:column;gap:10px">';
      es.pairs.forEach(function (p, i) {
        h += '<div style="display:flex;gap:8px;align-items:flex-start"><span class="tr-cap" style="min-width:22px;padding-top:12px;text-align:right">' + (i + 1) + '</span>' +
          '<textarea style="' + E.AREA + ';min-height:46px;font-family:var(--f-serif);font-size:18px" data-pa="' + i + '" placeholder="αρχαίος στίχος">' + esc(p.a) + '</textarea>' +
          '<textarea style="' + E.AREA + ';min-height:46px" data-pg="' + i + '" placeholder="απόδοση">' + esc(p.g) + '</textarea>' +
          '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">' +
            '<button class="tr-btn tr-btn--ghost" data-pmv="' + i + '" data-dir="-1" style="padding:3px 9px;font-size:12px"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button class="tr-btn tr-btn--ghost" data-pmv="' + i + '" data-dir="1" style="padding:3px 9px;font-size:12px"' + (i === es.pairs.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button class="tr-btn tr-btn--ghost" data-prm="' + i + '" style="padding:3px 9px;font-size:12px;color:var(--terra);border-color:color-mix(in srgb,var(--terra) 40%,transparent)">✕</button></div></div>';
      });
      h += '</div>';
      h += '<label style="' + E.LAB + ';margin-top:22px">Σχόλιο — επιτρέπεται &lt;b&gt;</label><textarea style="' + E.AREA + '" data-f="commentary">' + esc(es.commentary) + '</textarea></div>';
      mount.innerHTML = '';
      mount.appendChild(elFrom(h));
      E.wireBar(mount, { onCancel: function () { if (L._isNew) { closeParallel(); } else { S.editing = false; render(); } }, onSave: doSave });
      ['title', 'tag', 'level', 'intro', 'leftLabel', 'rightLabel', 'commentary'].forEach(function (f) { var el = mount.querySelector('[data-f="' + f + '"]'); if (el) el.oninput = function (e) { es[f] = e.target.value; }; });
      mount.querySelectorAll('[data-pa]').forEach(function (el) { el.oninput = function (e) { es.pairs[+el.dataset.pa].a = e.target.value; }; });
      mount.querySelectorAll('[data-pg]').forEach(function (el) { el.oninput = function (e) { es.pairs[+el.dataset.pg].g = e.target.value; }; });
      mount.querySelectorAll('[data-prm]').forEach(function (el) { el.onclick = function () { es.pairs.splice(+el.dataset.prm, 1); draw(); }; });
      mount.querySelectorAll('[data-pmv]').forEach(function (el) { el.onclick = function () { var i = +el.dataset.pmv, j = i + (+el.dataset.dir); if (j < 0 || j >= es.pairs.length) return; var x = es.pairs.splice(i, 1)[0]; es.pairs.splice(j, 0, x); draw(); }; });
      var ap = mount.querySelector('[data-a="addpair"]'); if (ap) ap.onclick = function () { es.pairs.push({ a: '', g: '' }); draw(); };
    }
    function doSave() {
      var db = _db(), uid = _uid();
      if (!db || !uid) { toast('Χρειάζεται σύνδεση'); return; }
      if (!es.title.trim()) { toast('Χρειάζεται τίτλος'); return; }
      var doc = {
        kind: 'parallel', navGroup: L.navGroup || 'literature',
        title: es.title.trim(), tag: es.tag.trim(), level: es.level.trim(), intro: es.intro.trim(),
        leftLabel: es.leftLabel.trim(), rightLabel: es.rightLabel.trim(), commentary: es.commentary.trim(),
        pairs: es.pairs.filter(function (p) { return (p.a || '').trim() || (p.g || '').trim(); }).map(function (p) { return { a: (p.a || '').trim(), g: (p.g || '').trim() }; }),
        ownerUid: uid, published: true, updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      if (L._isNew) doc.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      db.collection('authored_lessons').doc(L.id).set(doc, { merge: true }).then(function () {
        toast('✓ Αποθηκεύτηκε');
        if (window.GP_CONTENT && window.GP_CONTENT.loadCloud) window.GP_CONTENT.loadCloud(true);
        if (typeof window.refreshTheoryDeck === 'function') window.refreshTheoryDeck();
        S.lesson = Object.assign({ id: L.id }, modelFromDoc(L.id, doc)); S.editing = false; render();
      }).catch(function (e) { console.warn('[parallel-editor]', e); toast('Δεν αποθηκεύτηκε — έλεγξε σύνδεση/δικαιώματα'); });
    }
    draw();
  }

  function render() {
    var mount = document.getElementById('theory-parallel-mount');
    if (!mount || !S.lesson) return;
    if (S.editing) renderEditor(mount); else renderRead(mount);
  }

  /* ── overlay ────────────────────────────────────────────────────── */
  function ensureOverlay() {
    var ov = document.getElementById('theory-parallel-overlay');
    if (ov) return ov;
    ov = elFrom('<div id="theory-parallel-overlay" class="tr-overlay" role="dialog" aria-modal="true" aria-label="Παράλληλο κείμενο">' +
      '<button class="tr-overlay-close" aria-label="Κλείσιμο">✕</button>' +
      '<div class="tr"><div class="tr-grain"></div><div class="tr-inner" id="theory-parallel-mount"></div></div></div>');
    ov.querySelector('.tr-overlay-close').onclick = closeParallel;
    ov.addEventListener('click', function (e) { if (e.target === ov) closeParallel(); });
    document.body.appendChild(ov);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('active')) closeParallel(); });
    return ov;
  }
  function closeParallel() { var ov = document.getElementById('theory-parallel-overlay'); if (ov) ov.classList.remove('active'); document.body.style.overflow = ''; }
  function show(lesson, editing) {
    S.lesson = lesson; S.hide = false; S.shown = {}; S.editing = !!editing;
    var ov = ensureOverlay(); render(); ov.classList.add('active'); document.body.style.overflow = 'hidden'; ov.scrollTop = 0;
  }
  function _resolveDoc(idOrDoc) {
    var id = _docId(idOrDoc);
    var ds = (window.GP_CONTENT && window.GP_CONTENT.find && window.GP_CONTENT.find(id)) || null;
    if (ds && ds._lessonDoc) return Promise.resolve(modelFromDoc(id, ds._lessonDoc));
    var db = _db(); if (!db) return Promise.reject(new Error('offline'));
    return db.doc('authored_lessons/' + id).get().then(function (d) { if (!d.exists) throw new Error('not found'); return modelFromDoc(id, d.data()); });
  }
  function openParallelLesson(idOrDoc) {
    _resolveDoc(idOrDoc).then(function (m) { show(m, false); }).catch(function () { toast('Δεν βρέθηκε το κείμενο'); });
  }
  function openParallelStudio() {
    if (!isCurator()) { toast('Μόνο για καθηγητές'); return; }
    var uid = _uid() || 'anon';
    var id = 'pl-' + uid.slice(0, 4) + '-' + Math.abs(_hash(String(Date_now()))).toString(36);
    show({ id: id, kind: 'parallel', _isNew: true, navGroup: 'literature', title: '', tag: '', level: '', intro: '', leftLabel: 'Αρχαίο κείμενο', rightLabel: 'Νέα ελληνικά', commentary: '', pairs: [{ a: '', g: '' }] }, true);
  }
  function _hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  function Date_now() { try { return Date.now(); } catch (_) { return 0; } }

  window.openParallelLesson = openParallelLesson;
  window.openParallelStudio = openParallelStudio;
  window.closeParallelLesson = closeParallel;
})();
