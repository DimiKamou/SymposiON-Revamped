/* ════════════════════════════════════════════════════════════════════
   theory-qa.js — Q&A comprehension lesson (lesson-qa.jsx). Two modes the
   curator can enable: Κάρτες (reveal the answer) and Εξέταση (AI grades
   the typed answer vs the reference). Curator-authored: authored_lessons
   doc kind:'qa' holds only the student-safe items { q, note }; the
   reference answers live in authored_lessons/{id}/private/answers and are
   reached ONLY through the gradeQAItem / revealQAItem Cloud Functions
   (security note — answers never reach the student client/payload).

   Entry points: openQALesson(idOrDoc) · openQAStudio() (blank)
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var ED = null;
  function ed() { return (ED = ED || window.TheoryEd || {}); }
  function esc(s) { return ed().esc ? ed().esc(s) : String(s == null ? '' : s); }
  function elFrom(h) { return ed().elFrom ? ed().elFrom(h) : (function () { var d = document.createElement('div'); d.innerHTML = h.trim(); return d.firstElementChild; })(); }
  function fmtE(s) { return String(s || '').replace(/<e>/g, '<em style="color:var(--terra);font-style:normal">').replace(/<\/e>/g, '</em>'); }
  function _db() { try { return firebase.firestore(); } catch (_) { return null; } }
  function _uid() { try { return firebase.auth().currentUser ? firebase.auth().currentUser.uid : null; } catch (_) { return null; } }
  function _callable(n) { try { return firebase.functions().httpsCallable(n); } catch (_) { return null; } }
  function toast(m) { if (typeof showToast === 'function') showToast(m, m); }
  function isCurator() { return (typeof window.theoryIsCurator === 'function') && window.theoryIsCurator(); }
  function _docId(id) { return String(id || '').replace(/^qa:/, ''); }

  var QA_MODES = [['reveal', 'Κάρτες (αποκάλυψη)'], ['grade', 'Εξέταση (AI)']];
  var MODE_LAB = { reveal: 'Κάρτες', grade: 'Εξέταση' };
  var S = { lesson: null, mode: 'reveal', editing: false, open: {}, revealed: {}, idx: 0, attempt: '', fb: null, busy: false, err: '', refText: '' };

  function modelFromDoc(id, d) {
    return {
      id: id, kind: 'qa', navGroup: d.navGroup || 'literature',
      title: d.title || 'Ερωτήσεις', tag: d.tag || '', level: d.level || '', intro: d.intro || '',
      sourceLabel: d.sourceLabel || '', source: Array.isArray(d.source) ? d.source.slice() : [],
      modes: (Array.isArray(d.modes) && d.modes.length) ? d.modes.slice() : ['reveal'],
      items: Array.isArray(d.items) ? d.items.map(function (it) { return { q: it.q, note: it.note }; }) : [],
    };
  }

  /* ── reveal mode: question → fetch answer via function → show ────── */
  function viewReveal(L, rerender) {
    var items = L.items || [];
    var wrap = document.createElement('div');
    if (!items.length) { wrap.innerHTML = '<div class="tt-empty">Δεν υπάρχουν ερωτήσεις ακόμη.</div>'; return wrap; }
    var seen = Object.keys(S.open).filter(function (k) { return S.open[k]; }).length;
    var h = '<div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">' +
      '<div class="tr-kicker">Ερωτήσεις κατανόησης</div><div class="tr-cap">' + seen + ' / ' + items.length + ' αποκαλύφθηκαν</div></div>' +
      '<div style="display:flex;flex-direction:column;gap:12px">';
    items.forEach(function (it, i) {
      var o = !!S.open[i];
      h += '<div class="qa-card' + (o ? ' open' : '') + '"><button class="qa-q" data-q="' + i + '">' +
        '<span class="qa-num">' + String(i + 1).padStart(2, '0') + '</span>' +
        '<span class="qa-qtext">' + esc(it.q) + '</span><span class="qa-chev">' + (o ? '▴' : '▾') + '</span></button>';
      if (o) {
        h += '<div class="qa-a"><div class="qa-a-lab">Απάντηση</div>' +
          '<div class="qa-a-body">' + (S.revealed[i] != null ? fmtE(S.revealed[i]) : '<span class="tr-cap">Φόρτωση…</span>') + '</div>' +
          (it.note ? '<div class="qa-note">' + esc(it.note) + '</div>' : '') + '</div>';
      }
      h += '</div>';
    });
    h += '</div><div class="tr-cap" style="margin-top:18px">Σκέψου την απάντηση — μετά πάτησε για να την αποκαλύψεις</div></div>';
    wrap.innerHTML = h;
    wrap.querySelectorAll('[data-q]').forEach(function (b) {
      b.onclick = function () {
        var i = +b.dataset.q; S.open[i] = !S.open[i];
        if (S.open[i] && S.revealed[i] == null) {
          var fn = _callable('revealQAItem');
          if (fn) fn({ lessonId: L.id, itemIndex: i }).then(function (r) { S.revealed[i] = (r && r.data && r.data.answer) || ''; rerender(); }).catch(function () { S.revealed[i] = '—'; rerender(); });
          else { S.revealed[i] = '(μη διαθέσιμο)'; }
        }
        rerender();
      };
    });
    return wrap;
  }

  /* ── grade mode: type → gradeQAItem function → verdict ───────────── */
  function viewExam(L, rerender) {
    var items = L.items || [];
    var wrap = document.createElement('div');
    if (!items.length) { wrap.innerHTML = '<div class="tt-empty">Δεν υπάρχουν ερωτήσεις ακόμη.</div>'; return wrap; }
    var it = items[S.idx];
    var vClass = S.fb ? 'v-' + String(S.fb.verdict || '').replace('χρειάζεται δουλειά', 'δουλειά') : '';
    var sym = S.fb ? (S.fb.verdict === 'σωστό' ? '✓' : S.fb.verdict === 'κοντά' ? '◑' : '○') : '';
    var h = '<div><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">' +
      '<div class="tt-note" style="margin:0;flex:1 1 320px"><span class="ic">✶</span><p>Ο βοηθός κρίνει το <b style="color:var(--bone)">νόημα</b> της απάντησής σου σε σχέση με την απάντηση του καθηγητή.</p></div>' +
      '<div style="display:flex;align-items:center;gap:10px">' +
        '<button class="tr-btn tr-btn--ghost" data-a="prev" style="padding:10px 14px"' + (S.idx === 0 ? ' disabled' : '') + '>←</button>' +
        '<span class="tr-cap">Ερώτηση ' + (S.idx + 1) + ' / ' + items.length + '</span>' +
        '<button class="tr-btn tr-btn--ghost" data-a="next" style="padding:10px 14px"' + (S.idx === items.length - 1 ? ' disabled' : '') + '>→</button></div></div>' +
      '<div class="qa-exam-q" style="margin-top:22px"><span class="qa-num">' + String(S.idx + 1).padStart(2, '0') + '</span><span>' + esc(it.q) + '</span></div>' +
      '<div style="margin-top:16px"><textarea class="tt-input" data-attempt placeholder="Γράψε την απάντησή σου…">' + esc(S.attempt) + '</textarea>' +
        '<div class="tt-actions"><button class="tr-btn tr-btn--terra" data-a="check"' + ((!S.attempt.trim() || S.busy) ? ' disabled' : '') + '>' + (S.busy ? '<span class="tt-spin"></span>' : '✓') + ' Έλεγξε</button></div>' +
        (S.err ? '<div class="tt-err">⚠ ' + esc(S.err) + '</div>' : '');
    if (S.fb) {
      h += '<div class="tt-fb"><span class="tt-verdict ' + vClass + '">' + sym + ' ' + esc(S.fb.verdict) + '</span>' +
        '<div class="tt-bar-score"><div style="width:' + Math.max(0, Math.min(100, S.fb.score || 0)) + '%"></div></div>' +
        (S.fb.summary ? '<p class="tt-summary">' + esc(S.fb.summary) + '</p>' : '') +
        (S.fb.strengths || []).map(function (s) { return '<ul class="tt-list"><li class="s"><span class="mk">✓</span><span>' + esc(s) + '</span></li></ul>'; }).join('') +
        (S.fb.issues || []).map(function (x) { return '<ul class="tt-list"><li class="i"><span class="mk">→</span><span>' + (x.phrase ? '<span class="ph">' + esc(x.phrase) + ': </span>' : '') + esc(x.note) + '</span></li></ul>'; }).join('') +
        '<details class="tt-ref" data-reveal><summary>Δες την απάντηση αναφοράς</summary><div class="body" data-ref-body>' + (S.refText ? '«' + esc(S.refText) + '»' : '<span class="tr-cap">Φόρτωση…</span>') + '</div></details></div>';
    }
    h += '</div></div>';
    wrap.innerHTML = h;
    var ta = wrap.querySelector('[data-attempt]'); if (ta) ta.oninput = function (e) { S.attempt = e.target.value; var c = wrap.querySelector('[data-a="check"]'); if (c) c.disabled = !S.attempt.trim() || S.busy; };
    var pv = wrap.querySelector('[data-a="prev"]'); if (pv) pv.onclick = function () { S.idx = Math.max(0, S.idx - 1); S.attempt = ''; S.fb = null; S.err = ''; S.refText = ''; rerender(); };
    var nx = wrap.querySelector('[data-a="next"]'); if (nx) nx.onclick = function () { S.idx = Math.min(items.length - 1, S.idx + 1); S.attempt = ''; S.fb = null; S.err = ''; S.refText = ''; rerender(); };
    var ck = wrap.querySelector('[data-a="check"]'); if (ck) ck.onclick = function () {
      if (!S.attempt.trim() || S.busy) return;
      var fn = _callable('gradeQAItem'); if (!fn) { S.err = 'Ο βοηθός AI δεν είναι διαθέσιμος.'; rerender(); return; }
      S.busy = true; S.err = ''; S.fb = null; S.refText = ''; rerender();
      fn({ lessonId: L.id, itemIndex: S.idx, attempt: S.attempt }).then(function (r) { S.fb = r && r.data; S.busy = false; rerender(); })
        .catch(function (e) { S.err = (e && /unavailable|unconfigured|upstream/.test(e.message || '')) ? 'Ο βοηθός AI δεν είναι διαθέσιμος αυτή τη στιγμή.' : ((e && e.message) || 'Σφάλμα.'); S.busy = false; rerender(); });
    };
    var det = wrap.querySelector('[data-reveal]');
    if (det) det.addEventListener('toggle', function () {
      if (det.open && !S.refText) {
        var fn = _callable('revealQAItem'); var body = det.querySelector('[data-ref-body]');
        if (!fn) { if (body) body.textContent = 'Μη διαθέσιμο.'; return; }
        fn({ lessonId: L.id, itemIndex: S.idx }).then(function (r) { S.refText = (r && r.data && r.data.answer) || ''; if (body) body.innerHTML = S.refText ? '«' + esc(S.refText) + '»' : '—'; }).catch(function () { if (body) body.textContent = 'Δεν φορτώθηκε.'; });
      }
    });
    return wrap;
  }

  /* ── editor ─────────────────────────────────────────────────────── */
  function renderEditor(mount) {
    var E = ed(), L = S.lesson;
    var es = {
      title: L.title || '', tag: L.tag || '', level: L.level || '', intro: L.intro || '',
      sourceLabel: L.sourceLabel || '', source: (L.source || []).join('\n'),
      modes: (L.modes && L.modes.length ? L.modes.slice() : ['reveal']),
      items: (L.items || []).map(function (it) { return { q: it.q, a: '', note: it.note }; }),
    };
    // pre-fill reference answers via the function (curator editing existing)
    if (!L._isNew) {
      var rfn = _callable('revealQAItem');
      if (rfn) es.items.forEach(function (it, i) {
        rfn({ lessonId: L.id, itemIndex: i }).then(function (r) { it.a = (r && r.data && r.data.answer) || ''; var t = mount.querySelector('[data-ia="' + i + '"]'); if (t && !t.value) t.value = it.a; }).catch(function () {});
      });
    }
    function draw() {
      var h = '<div>' + E.barHTML({ hint: 'Διόρθωσε τις ερωτήσεις, τις απαντήσεις αναφοράς και το κείμενο.', edited: false });
      // header card
      h += '<div style="' + E.CARD + ';margin-bottom:22px"><div class="tr-kicker" style="color:var(--gold);margin-bottom:14px">Κεφαλίδα</div>' +
        '<div style="display:grid;grid-template-columns:2fr 1fr;gap:14px">' +
          '<div><label style="' + E.LAB + '">Τίτλος</label><input style="' + E.INP + '" data-f="title" value="' + esc(es.title) + '"/></div>' +
          '<div><label style="' + E.LAB + '">Επίπεδο</label><input style="' + E.MONO + '" data-f="level" value="' + esc(es.level) + '"/></div></div>' +
        '<label style="' + E.LAB + ';margin-top:14px">Υπότιτλος (tag)</label><input style="' + E.INP + '" data-f="tag" value="' + esc(es.tag) + '"/>' +
        '<label style="' + E.LAB + ';margin-top:14px">Εισαγωγή — επιτρέπεται &lt;b&gt;</label><textarea style="' + E.AREA + '" data-f="intro">' + esc(es.intro) + '</textarea>' +
        '<label style="' + E.LAB + ';margin-top:14px">Διαθέσιμες λειτουργίες (τουλάχιστον μία)</label><div style="display:flex;gap:10px">' +
          QA_MODES.map(function (m) { var on = es.modes.indexOf(m[0]) >= 0; return '<button class="tr-btn ' + (on ? 'tr-btn--terra' : 'tr-btn--ghost') + '" data-mode="' + m[0] + '">' + (on ? '◉' : '○') + ' ' + esc(m[1]) + '</button>'; }).join('') +
        '</div></div>';
      // source card
      h += '<div style="' + E.CARD + ';margin-bottom:22px"><label style="' + E.LAB + '">Κείμενο αναφοράς (προαιρετικό) — μία γραμμή ανά στίχο</label>' +
        '<input style="' + E.MONO + ';margin-bottom:8px" data-f="sourceLabel" value="' + esc(es.sourceLabel) + '" placeholder="Τίτλος πλαισίου — π.χ. Το κείμενο"/>' +
        '<textarea style="' + E.AREA + '" data-f="source">' + esc(es.source) + '</textarea></div>';
      // items
      h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:12px"><label style="' + E.LAB + ';margin:0">Ερωτήσεις · ' + es.items.length + '</label>' +
        '<button class="tr-btn tr-btn--ghost" data-a="additem" style="padding:6px 12px">＋ Ερώτηση</button></div>';
      if (!es.items.length) h += '<div class="tt-empty">Δεν υπάρχουν ερωτήσεις — πάτησε «＋ Ερώτηση».</div>';
      h += '<div style="display:flex;flex-direction:column;gap:12px">';
      es.items.forEach(function (it, i) {
        h += '<div style="' + E.CARD + ';padding:14px 16px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:10px">' +
          '<span class="tr-kicker" style="color:var(--gold)">' + String(i + 1).padStart(2, '0') + '</span><div style="flex:1"></div>' +
          '<button class="tr-btn tr-btn--ghost" data-imv="' + i + '" data-dir="-1" style="padding:4px 10px;font-size:12px"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
          '<button class="tr-btn tr-btn--ghost" data-imv="' + i + '" data-dir="1" style="padding:4px 10px;font-size:12px"' + (i === es.items.length - 1 ? ' disabled' : '') + '>↓</button>' +
          '<button class="tr-btn tr-btn--ghost" data-irm="' + i + '" style="padding:4px 10px;font-size:12px;color:var(--terra);border-color:color-mix(in srgb,var(--terra) 40%,transparent)">✕</button></div>' +
          '<label style="' + E.LAB + '">Ερώτηση</label><input style="' + E.INP + ';margin-bottom:8px" data-iq="' + i + '" value="' + esc(it.q) + '"/>' +
          '<label style="' + E.LAB + '">Απάντηση αναφοράς <span style="color:var(--terra)">(κρυφό)</span> — &lt;e&gt; φωτίζει</label><textarea style="' + E.AREA + ';min-height:64px" data-ia="' + i + '">' + esc(it.a) + '</textarea>' +
          '<label style="' + E.LAB + ';margin-top:8px">Σημείωση (προαιρετικό)</label><input style="' + E.INP + '" data-inote="' + i + '" value="' + esc(it.note || '') + '"/></div>';
      });
      h += '</div></div>';
      mount.innerHTML = '';
      mount.appendChild(elFrom(h));
      E.wireBar(mount, { onCancel: function () { if (L._isNew) closeQA(); else { S.editing = false; render(); } }, onSave: doSave });
      ['title', 'tag', 'level', 'intro', 'sourceLabel', 'source'].forEach(function (f) { var el = mount.querySelector('[data-f="' + f + '"]'); if (el) el.oninput = function (e) { es[f] = e.target.value; }; });
      mount.querySelectorAll('[data-mode]').forEach(function (b) { b.onclick = function () { var m = b.dataset.mode, has = es.modes.indexOf(m) >= 0; if (has) { if (es.modes.length > 1) es.modes = es.modes.filter(function (x) { return x !== m; }); } else es.modes.push(m); draw(); }; });
      mount.querySelectorAll('[data-iq]').forEach(function (el) { el.oninput = function (e) { es.items[+el.dataset.iq].q = e.target.value; }; });
      mount.querySelectorAll('[data-ia]').forEach(function (el) { el.oninput = function (e) { es.items[+el.dataset.ia].a = e.target.value; }; });
      mount.querySelectorAll('[data-inote]').forEach(function (el) { el.oninput = function (e) { es.items[+el.dataset.inote].note = e.target.value; }; });
      mount.querySelectorAll('[data-irm]').forEach(function (b) { b.onclick = function () { es.items.splice(+b.dataset.irm, 1); draw(); }; });
      mount.querySelectorAll('[data-imv]').forEach(function (b) { b.onclick = function () { var i = +b.dataset.imv, j = i + (+b.dataset.dir); if (j < 0 || j >= es.items.length) return; var x = es.items.splice(i, 1)[0]; es.items.splice(j, 0, x); draw(); }; });
      var ai = mount.querySelector('[data-a="additem"]'); if (ai) ai.onclick = function () { es.items.push({ q: '', a: '', note: '' }); draw(); };
    }
    function doSave() {
      var db = _db(), uid = _uid();
      if (!db || !uid) { toast('Χρειάζεται σύνδεση'); return; }
      if (!es.title.trim()) { toast('Χρειάζεται τίτλος'); return; }
      var kept = es.items.filter(function (it) { return (it.q || '').trim(); });
      var modes = QA_MODES.map(function (m) { return m[0]; }).filter(function (m) { return es.modes.indexOf(m) >= 0; });
      if (!modes.length) modes = ['reveal'];
      var pub = {
        kind: 'qa', navGroup: L.navGroup || 'literature',
        title: es.title.trim(), tag: es.tag.trim(), level: es.level.trim(), intro: es.intro.trim(),
        sourceLabel: es.sourceLabel.trim(), source: es.source.split('\n').map(function (l) { return l.trim(); }).filter(Boolean),
        modes: modes, items: kept.map(function (it) { return { q: it.q.trim(), note: (it.note || '').trim() }; }),
        ownerUid: uid, published: true, updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      if (L._isNew) pub.createdAt = firebase.firestore.FieldValue.serverTimestamp();
      var answers = kept.map(function (it) { return (it.a || '').trim(); });
      // public doc (NO answers), then the private answers subdoc
      db.collection('authored_lessons').doc(L.id).set(pub, { merge: true }).then(function () {
        return db.doc('authored_lessons/' + L.id + '/private/answers').set({ answers: answers, updatedAt: firebase.firestore.FieldValue.serverTimestamp() });
      }).then(function () {
        toast('✓ Αποθηκεύτηκε');
        if (window.GP_CONTENT && window.GP_CONTENT.loadCloud) window.GP_CONTENT.loadCloud(true);
        if (typeof window.refreshTheoryDeck === 'function') window.refreshTheoryDeck();
        S.lesson = modelFromDoc(L.id, pub); S.editing = false; S.mode = modes[0]; S.idx = 0; S.open = {}; S.revealed = {}; render();
      }).catch(function (e) { console.warn('[qa-editor]', e); toast('Δεν αποθηκεύτηκε — έλεγξε σύνδεση/δικαιώματα'); });
    }
    draw();
  }

  /* ── read shell ─────────────────────────────────────────────────── */
  function renderRead(mount) {
    var L = S.lesson;
    var modes = (L.modes && L.modes.length) ? L.modes : ['reveal'];
    if (modes.indexOf(S.mode) < 0) S.mode = modes[0];
    var h = '<div><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px"><div>' +
      '<div class="tr-eyebrow">' + (L.navGroup === 'grammar' ? 'Γραμματική' : 'Λογοτεχνία') + ' · Ερωτήσεις · ' + esc(L.level) +
        (L.edited ? ' <span style="color:var(--gold);margin-left:8px">· επεξεργασμένο</span>' : '') + '</div>' +
      '<div class="tr-lemma" style="font-size:40px;line-height:1.05;margin-top:8px">' + esc(L.title) + '</div>' +
      (L.tag ? '<div class="tr-meaning" style="font-size:19px;margin-top:6px">' + esc(L.tag) + '</div>' : '') + '</div>' +
      (isCurator() ? '<button class="tr-btn tr-btn--ghost" data-a="edit" style="flex-shrink:0">✎ Επεξεργασία</button>' : '') + '</div>';
    if (L.intro) h += '<p class="tr-body" style="margin-top:16px;max-width:760px">' + L.intro + '</p>';
    if (L.source && L.source.length) {
      h += '<details class="qa-src" open><summary>' + esc(L.sourceLabel || 'Το κείμενο') + '</summary><div class="qa-src-body">' +
        L.source.map(function (ln, i) { return '<div class="qa-src-line"><span class="n">' + (i + 1) + '</span><span class="g">' + esc(ln) + '</span></div>'; }).join('') + '</div></details>';
    }
    if (modes.length > 1) {
      h += '<div class="seg" style="margin-top:24px">' + modes.map(function (m) { return '<button class="seg-btn' + (S.mode === m ? ' on' : '') + '" data-qmode="' + m + '">' + esc(MODE_LAB[m]) + '</button>'; }).join('') + '</div>';
    } else h += '<hr class="tr-rule" style="margin:24px 0 0"/>';
    h += '<hr class="tr-rule" style="margin:0 0 30px"/><div data-body></div></div>';
    mount.innerHTML = '';
    mount.appendChild(elFrom(h));
    var eb = mount.querySelector('[data-a="edit"]'); if (eb) eb.onclick = function () { S.editing = true; render(); };
    mount.querySelectorAll('[data-qmode]').forEach(function (b) { b.onclick = function () { S.mode = b.dataset.qmode; S.idx = 0; S.attempt = ''; S.fb = null; S.err = ''; S.open = {}; render(); }; });
    var bodyEl = mount.querySelector('[data-body]');
    var body = (S.mode === 'grade') ? viewExam(L, render) : viewReveal(L, render);
    bodyEl.appendChild(body);
  }

  function render() {
    var mount = document.getElementById('theory-qa-mount');
    if (!mount || !S.lesson) return;
    if (S.editing) renderEditor(mount); else renderRead(mount);
  }

  /* ── overlay ────────────────────────────────────────────────────── */
  function ensureOverlay() {
    var ov = document.getElementById('theory-qa-overlay');
    if (ov) return ov;
    ov = elFrom('<div id="theory-qa-overlay" class="tr-overlay" role="dialog" aria-modal="true" aria-label="Ερωτήσεις">' +
      '<button class="tr-overlay-close" aria-label="Κλείσιμο">✕</button>' +
      '<div class="tr"><div class="tr-grain"></div><div class="tr-inner" id="theory-qa-mount"></div></div></div>');
    ov.querySelector('.tr-overlay-close').onclick = closeQA;
    ov.addEventListener('click', function (e) { if (e.target === ov) closeQA(); });
    document.body.appendChild(ov);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('active')) closeQA(); });
    return ov;
  }
  function closeQA() { var ov = document.getElementById('theory-qa-overlay'); if (ov) ov.classList.remove('active'); document.body.style.overflow = ''; }
  function show(lesson, editing) {
    S.lesson = lesson; S.editing = !!editing; S.mode = (lesson.modes && lesson.modes[0]) || 'reveal';
    S.open = {}; S.revealed = {}; S.idx = 0; S.attempt = ''; S.fb = null; S.busy = false; S.err = ''; S.refText = '';
    var ov = ensureOverlay(); render(); ov.classList.add('active'); document.body.style.overflow = 'hidden'; ov.scrollTop = 0;
  }
  function _resolveDoc(idOrDoc) {
    var id = _docId(idOrDoc);
    var ds = (window.GP_CONTENT && window.GP_CONTENT.find && window.GP_CONTENT.find(id)) || null;
    if (ds && ds._lessonDoc) return Promise.resolve(modelFromDoc(id, ds._lessonDoc));
    var db = _db(); if (!db) return Promise.reject(new Error('offline'));
    return db.doc('authored_lessons/' + id).get().then(function (d) { if (!d.exists) throw new Error('not found'); return modelFromDoc(id, d.data()); });
  }
  function openQALesson(idOrDoc) { _resolveDoc(idOrDoc).then(function (m) { show(m, false); }).catch(function () { toast('Δεν βρέθηκε το μάθημα'); }); }
  function openQAStudio() {
    if (!isCurator()) { toast('Μόνο για καθηγητές'); return; }
    var uid = _uid() || 'anon';
    var id = 'qa-' + uid.slice(0, 4) + '-' + Math.abs(_hash(String(_now()))).toString(36);
    show({ id: id, kind: 'qa', _isNew: true, navGroup: 'literature', title: '', tag: '', level: '', intro: '', sourceLabel: '', source: [], modes: ['reveal'], items: [{ q: '', a: '', note: '' }] }, true);
  }
  function _hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return h; }
  function _now() { try { return Date.now(); } catch (_) { return 0; } }

  window.openQALesson = openQALesson;
  window.openQAStudio = openQAStudio;
  window.closeQALesson = closeQA;
})();
