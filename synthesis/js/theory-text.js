/* ════════════════════════════════════════════════════════════════════
   theory-text.js — the text / literature reader (lesson-text.jsx):
     Κείμενο  — verse + hover-gloss + meter + commentary + ref reveal
     Πρόσωπα   — faction-coded character cards (only if the text has chars)
     Μετάφραση — the AI tutor (Μετάφραση / Συντακτικό), scoped to this text

   SECURITY: this client only ever reads the STUDENT-SAFE texts/{id} doc.
   The reference translation/syntax lives in texts/{id}/private/answer
   (rules: read:false) and is reached ONLY through the Cloud Functions
   gradeTranslation / translationHint / revealTextReference.

   Entry point:  openTextLesson(datasetIdOrDocId)
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function elFrom(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }
  function _strip(w) {
    try { return w.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ''); }
    catch (_) { return w.replace(/^[^Α-Ωα-ωΆ-ώ]+|[^Α-Ωα-ωΆ-ώ]+$/g, ''); }
  }
  function _docId(id) { return String(id || '').replace(/^tx:/, ''); }

  var S = { lesson: null, mode: 'text', sub: 'trans', attempt: '', fb: null, hints: [], busy: null, err: '', showRef: false, refText: '' };

  // student-safe text doc → lesson model (tokens with optional glosses)
  function buildTextModel(docId, t) {
    var gmap = {};
    (t.glosses || []).forEach(function (g) { if (g && g.w && g.g) gmap[_strip(g.w)] = g.g; });
    var lines = (t.srcLines || []).filter(Boolean).map(function (line) {
      return line.trim().split(/\s+/).map(function (w) {
        var k = _strip(w); return gmap[k] ? { t: w, g: gmap[k] } : { t: w };
      });
    });
    return {
      id: docId, kind: 'text', title: t.title || 'Κείμενο', tag: t.tag || '', level: t.level || '',
      meter: t.meter || '', commentary: t.commentary || '', teacher: true,
      chars: Array.isArray(t.chars) ? t.chars : [],
      hasRef: !!t.hasRef, hasSyntax: !!t.hasSyntax, lines: lines,
      // raw fields kept for the in-place editor
      srcLines: Array.isArray(t.srcLines) ? t.srcLines.slice() : [],
      glosses: Array.isArray(t.glosses) ? t.glosses.map(function (g) { return { w: g.w, g: g.g }; }) : [],
    };
  }

  function _callable(name) {
    if (typeof firebase === 'undefined' || !firebase.functions) return null;
    try { return firebase.functions().httpsCallable(name); } catch (_) { return null; }
  }

  /* ─────────────────────────── Κείμενο ────────────────────────── */
  function viewText(L, rerender) {
    var verse = L.lines.map(function (toks) {
      return '<div>' + toks.map(function (tk) {
        return '<span class="trr-w' + (tk.g ? ' gloss' : '') + '">' + esc(tk.t) +
          (tk.g ? '<span class="pop">' + esc(tk.g) + '</span>' : '') + '</span> ';
      }).join('') + '</div>';
    }).join('');
    var h = '<div>' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start"><div>' +
        '<div class="tr-eyebrow">' + (L.teacher ? 'Κείμενο καθηγητή' : 'Λογοτεχνία') + ' · ' + esc(L.tag) + '</div>' +
        '<div class="tr-lemma" style="font-size:40px;margin-top:8px">' + esc(L.title) + '</div></div></div>' +
      '<hr class="tr-rule tr-rule--left" style="margin:24px 0 22px"/>' +
      '<div class="trr-verse">' + verse + '</div>';
    if (L.meter) {
      h += '<div class="trr-meter" style="margin-top:24px"><span class="tr-cap" style="color:var(--gold)">' + esc(L.meter) + '</span>' +
        '<span style="display:flex;gap:12px;margin-left:6px">' +
        '<span class="trr-foot"><span class="s"></span><span class="s"></span></span>'.repeat(2) +
        '<span class="trr-foot"><span class="s"></span><span class="s short"></span><span class="s short"></span></span>' +
        '<span class="trr-foot"><span class="s"></span><span class="s"></span></span>'.repeat(2) +
        '<span class="trr-foot"><span class="s"></span><span class="s short"></span><span class="s short"></span></span>' +
        '</span></div>';
    }
    if (L.commentary) {
      h += '<div style="margin-top:28px"><div class="tr-kicker" style="color:var(--gold)">Σχόλιο</div>' +
        '<p class="trr-note" style="margin-top:10px">' + L.commentary + '</p></div>';
    }
    if (L.hasRef) {
      h += '<details class="tt-ref" style="margin-top:26px"' + (S.showRef ? ' open' : '') + '>' +
        '<summary>Δες την απόδοση (νέα ελληνικά)</summary>' +
        '<div class="body" data-ref-body>' + (S.refText ? '«' + esc(S.refText) + '»' : '<span class="tr-cap">Φόρτωση…</span>') + '</div></details>';
    }
    var _coarse = !!(window.matchMedia && window.matchMedia('(hover: none)').matches);
    h += '<div class="tr-cap" style="margin-top:20px">' + (_coarse ? 'Πάτα' : 'Πέρνα πάνω από') + ' τις <span style="color:var(--terra)">υπογραμμισμένες</span> λέξεις για ερμηνεία</div></div>';
    var wrap = elFrom(h);
    // touch: phones have no hover — tap a glossed word to reveal its .pop
    wrap.querySelectorAll('.trr-w.gloss').forEach(function (w) {
      w.setAttribute('tabindex', '0');
      w.setAttribute('role', 'button');
      w.addEventListener('click', function (e) {
        e.stopPropagation();
        var wasOpen = w.classList.contains('show');
        wrap.querySelectorAll('.trr-w.show').forEach(function (o) { o.classList.remove('show'); });
        if (!wasOpen) w.classList.add('show');
      });
      w.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); w.click(); }
      });
    });
    wrap.addEventListener('click', function () {
      wrap.querySelectorAll('.trr-w.show').forEach(function (o) { o.classList.remove('show'); });
    });
    var det = wrap.querySelector('details.tt-ref');
    if (det) det.addEventListener('toggle', function () {
      if (det.open && !S.refText) {
        S.showRef = true;
        var fn = _callable('revealTextReference');
        var body = det.querySelector('[data-ref-body]');
        if (!fn) { if (body) body.textContent = 'Μη διαθέσιμο εκτός σύνδεσης.'; return; }
        fn({ textId: L.id, mode: 'trans' }).then(function (r) {
          S.refText = (r && r.data && r.data.reference) || '';
          if (body) body.innerHTML = S.refText ? '«' + esc(S.refText) + '»' : 'Δεν υπάρχει απόδοση αναφοράς.';
        }).catch(function () { if (body) body.textContent = 'Δεν ήταν δυνατή η φόρτωση.'; });
      } else { S.showRef = det.open; }
    });
    return wrap;
  }

  /* ─────────────────────────── Πρόσωπα ────────────────────────── */
  function viewChars(L) {
    var cards = (L.chars || []).map(function (c) {
      var faction = (c.f === 'Τρώες' || c.f === 'trojan') ? 'trojan' : 'greek';
      return '<div class="trp-card ' + faction + '"><div class="trp-emblem">' + esc(c.e || (c.n || '?')[0]) + '</div>' +
        '<div><div class="trp-name">' + esc(c.n) + '</div><div class="trp-role">' + esc(c.r) + '</div>' +
        '<div class="trp-desc">' + esc(c.d) + '</div></div></div>';
    }).join('');
    return elFrom('<div><div style="display:flex;justify-content:space-between;align-items:center">' +
      '<div class="tr-kicker">Τα πρόσωπα</div><div style="display:flex;gap:18px">' +
      '<span class="trp-faction"><span class="sw" style="background:var(--aegean)"></span>Αχαιοί</span>' +
      '<span class="trp-faction"><span class="sw" style="background:var(--terra)"></span>Τρώες</span></div></div>' +
      '<div class="trp-grid" style="margin-top:18px">' + cards + '</div></div>');
  }

  /* ─────────────────────────── Μετάφραση (AI tutor) ───────────── */
  function viewTranslate(L, rerender) {
    if (!L.hasRef && !L.hasSyntax) {
      return elFrom('<div class="tt-empty">Αυτό το κείμενο δεν έχει ακόμη απάντηση αναφοράς από τον καθηγητή.</div>');
    }
    // keep sub on an available mode
    if (S.sub === 'trans' && !L.hasRef) S.sub = 'syntax';
    if (S.sub === 'syntax' && !L.hasSyntax) S.sub = 'trans';
    var srcLines = L.lines.map(function (toks) { return toks.map(function (t) { return t.t; }).join(' '); });
    var vClass = S.fb ? 'v-' + String(S.fb.verdict || '').replace('χρειάζεται δουλειά', 'δουλειά') : '';
    var verdictSym = S.fb ? (S.fb.verdict === 'σωστό' ? '✓' : S.fb.verdict === 'κοντά' ? '◑' : '○') : '';

    var h = '<div>' +
      '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px">' +
        '<div class="tt-note" style="margin:0;flex:1 1 360px"><span class="ic">✶</span>' +
          '<p>Ο βοηθός κρίνει το <b style="color:var(--bone)">νόημα</b>, όχι τις ακριβείς λέξεις. Δοκίμασε μόνος σου — οι υποδείξεις δεν δίνουν έτοιμη την απάντηση.</p></div>' +
        '<div class="trc-seg">' +
          (L.hasRef ? '<button data-sub="trans" class="' + (S.sub === 'trans' ? 'on' : '') + '">Μετάφραση</button>' : '') +
          (L.hasSyntax ? '<button data-sub="syntax" class="' + (S.sub === 'syntax' ? 'on' : '') + '">Συντακτικό</button>' : '') +
        '</div></div>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:22px;align-items:start">' +
        '<div class="tt-pane"><div class="tt-pane-h"><span class="lab">Πρωτότυπο</span><span class="lab" style="color:var(--gold)">' + esc(L.tag) + '</span></div>' +
          '<div class="tt-src">' + srcLines.map(function (g, i) {
            return '<div class="tt-srcline"><span class="n">' + (i + 1) + '</span><span class="g">' + esc(g) + '</span></div>';
          }).join('') + '</div></div>' +
        '<div class="tt-pane"><div class="tt-pane-h"><span class="lab">' + (S.sub === 'trans' ? 'Η μετάφρασή σου' : 'Η ανάλυσή σου') + '</span>' +
          '<span class="lab">' + (S.busy === 'check' ? 'Ελέγχω…' : '') + '</span></div>' +
          '<div style="padding:18px 22px 22px">' +
            '<textarea class="tt-input" data-attempt placeholder="' + (S.sub === 'trans' ? 'Γράψε τη δική σου μετάφραση…' : 'Γράψε τη συντακτική σου ανάλυση…') + '">' + esc(S.attempt) + '</textarea>' +
            '<div class="tt-actions">' +
              '<button class="tr-btn tr-btn--ghost" data-a="hint"' + ((S.busy || S.hints.length >= 3) ? ' disabled' : '') + '>' +
                (S.busy === 'hint' ? '<span class="tt-spin" style="border-top-color:var(--bone);border-color:color-mix(in srgb,var(--cream) 30%,transparent)"></span>' : '💡') +
                ' ' + (S.hints.length >= 3 ? 'Τέλος υποδείξεων' : (S.hints.length ? 'Κι άλλη' : 'Βοήθησέ με')) + '</button>' +
              '<button class="tr-btn tr-btn--terra" data-a="check"' + ((!S.attempt.trim() || S.busy) ? ' disabled' : '') + '>' +
                (S.busy === 'check' ? '<span class="tt-spin"></span>' : '✓') + ' Έλεγξε</button>' +
            '</div>' +
            (S.err ? '<div class="tt-err">⚠ ' + esc(S.err) + '</div>' : '') +
            S.hints.map(function (hh, i) { return '<div class="tt-hint"><div><span class="lvl">Υπόδειξη ' + (i + 1) + '</span><div style="margin-top:4px">' + esc(hh) + '</div></div></div>'; }).join('');
    if (S.fb) {
      h += '<div class="tt-fb">' +
        '<span class="tt-verdict ' + vClass + '">' + verdictSym + ' ' + esc(S.fb.verdict) + '</span>' +
        '<div class="tt-bar-score"><div style="width:' + Math.max(0, Math.min(100, S.fb.score || 0)) + '%"></div></div>' +
        (S.fb.summary ? '<p class="tt-summary">' + esc(S.fb.summary) + '</p>' : '') +
        (S.fb.strengths || []).map(function (s) { return '<ul class="tt-list"><li class="s"><span class="mk">✓</span><span>' + esc(s) + '</span></li></ul>'; }).join('') +
        (S.fb.issues || []).map(function (x) { return '<ul class="tt-list"><li class="i"><span class="mk">→</span><span>' + (x.phrase ? '<span class="ph">' + esc(x.phrase) + ': </span>' : '') + esc(x.note) + '</span></li></ul>'; }).join('') +
        '<details class="tt-ref" data-reveal><summary>Δες την απάντηση αναφοράς</summary><div class="body" data-ref-body>' + (S.refText ? '«' + esc(S.refText) + '»' : '<span class="tr-cap">Φόρτωση…</span>') + '</div></details>' +
        '</div>';
    }
    h += '</div></div></div></div>';

    var wrap = elFrom(h);
    var ta = wrap.querySelector('[data-attempt]');
    if (ta) ta.oninput = function (e) { S.attempt = e.target.value; var cb = wrap.querySelector('[data-a="check"]'); if (cb) cb.disabled = !S.attempt.trim() || !!S.busy; };
    wrap.querySelectorAll('[data-sub]').forEach(function (b) {
      b.onclick = function () { S.sub = b.dataset.sub; S.attempt = ''; S.fb = null; S.hints = []; S.err = ''; S.refText = ''; rerender(); };
    });
    var chk = wrap.querySelector('[data-a="check"]'); if (chk) chk.onclick = function () { doCheck(L, rerender); };
    var hnt = wrap.querySelector('[data-a="hint"]'); if (hnt) hnt.onclick = function () { doHint(L, rerender); };
    var det = wrap.querySelector('[data-reveal]');
    if (det) det.addEventListener('toggle', function () {
      if (det.open && !S.refText) {
        var fn = _callable('revealTextReference'); var body = det.querySelector('[data-ref-body]');
        if (!fn) { if (body) body.textContent = 'Μη διαθέσιμο.'; return; }
        fn({ textId: L.id, mode: S.sub }).then(function (r) {
          S.refText = (r && r.data && r.data.reference) || '';
          if (body) body.innerHTML = S.refText ? '«' + esc(S.refText) + '»' : 'Δεν υπάρχει απάντηση αναφοράς.';
        }).catch(function () { if (body) body.textContent = 'Δεν ήταν δυνατή η φόρτωση.'; });
      }
    });
    return wrap;
  }

  function _errMsg(e) {
    var m = (e && e.message) || '';
    if (/unconfigured|unavailable|upstream/.test(m)) return 'Ο βοηθός AI δεν είναι διαθέσιμος αυτή τη στιγμή.';
    return m || 'Κάτι πήγε στραβά. Δοκίμασε ξανά.';
  }
  function doCheck(L, rerender) {
    if (!S.attempt.trim() || S.busy) return;
    var fn = _callable('gradeTranslation');
    if (!fn) { S.err = 'Ο βοηθός AI δεν είναι διαθέσιμος.'; rerender(); return; }
    S.busy = 'check'; S.err = ''; S.fb = null; S.refText = ''; rerender();
    fn({ textId: L.id, mode: S.sub, attempt: S.attempt }).then(function (r) {
      S.fb = r && r.data; S.busy = null;
      // optional: surface best score on the lesson rail (users/{uid}/translations)
      _logTranslation(L.id, S.fb);
      rerender();
    }).catch(function (e) { S.err = _errMsg(e); S.busy = null; rerender(); });
  }
  function doHint(L, rerender) {
    if (S.busy || S.hints.length >= 3) return;
    var fn = _callable('translationHint');
    if (!fn) { S.err = 'Ο βοηθός AI δεν είναι διαθέσιμος.'; rerender(); return; }
    S.busy = 'hint'; S.err = ''; rerender();
    fn({ textId: L.id, mode: S.sub, attempt: S.attempt, level: S.hints.length + 1 }).then(function (r) {
      var hint = r && r.data && r.data.hint;
      if (hint) S.hints.push(hint); else S.err = 'Δεν μπόρεσα να δώσω υπόδειξη.';
      S.busy = null; rerender();
    }).catch(function (e) { S.err = _errMsg(e); S.busy = null; rerender(); });
  }
  function _logTranslation(textId, fb) {
    if (!fb || typeof firebase === 'undefined' || !firebase.firestore) return;
    try {
      var u = firebase.auth().currentUser; if (!u) return;
      var ref = firebase.firestore().doc('users/' + u.uid + '/translations/' + textId);
      ref.set({
        bestScore: firebase.firestore.FieldValue ? Math.max(0, Math.min(100, fb.score || 0)) : (fb.score || 0),
        lastVerdict: fb.verdict || '', attempts: firebase.firestore.FieldValue.increment(1),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      }, { merge: true }).catch(function () {});
    } catch (_) {}
  }

  /* ─────────────────────────── shell ──────────────────────────── */
  function ensureOverlay() {
    var ov = document.getElementById('theory-text-overlay');
    if (ov) return ov;
    ov = elFrom('<div id="theory-text-overlay" class="tr-overlay" role="dialog" aria-modal="true" aria-label="Κείμενο">' +
      '<button class="tr-overlay-close" aria-label="Κλείσιμο">✕</button>' +
      '<div class="tr"><div class="tr-grain"></div><div class="tr-inner" id="theory-text-mount"></div></div></div>');
    ov.querySelector('.tr-overlay-close').onclick = closeTextLesson;
    ov.addEventListener('click', function (e) { if (e.target === ov) closeTextLesson(); });
    document.body.appendChild(ov);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('active')) closeTextLesson(); });
    return ov;
  }
  function render() {
    var L = S.lesson, mount = document.getElementById('theory-text-mount');
    if (!L || !mount) return;
    mount.innerHTML = '';
    if (S.editing) { renderTextEditor(L, mount, function () { S.editing = false; openTextLesson(L.id); }); return; }
    // curator entry to the in-place editor
    if (typeof window.theoryIsCurator === 'function' && window.theoryIsCurator()) {
      var bar = elFrom('<div style="display:flex;justify-content:flex-end;margin-bottom:8px"><button class="tr-btn tr-btn--ghost" data-a="edit">✎ Επεξεργασία</button></div>');
      bar.querySelector('[data-a="edit"]').onclick = function () { S.editing = true; render(); };
      mount.appendChild(bar);
    }
    var MODES = [['text', 'Κείμενο']];
    if (L.chars && L.chars.length) MODES.push(['chars', 'Πρόσωπα']);
    MODES.push(['translate', 'Μετάφραση']);
    var seg = elFrom('<div class="seg">' + MODES.map(function (m) {
      return '<button class="seg-btn' + (S.mode === m[0] ? ' on' : '') + '" data-mode="' + m[0] + '">' + m[1] + '</button>';
    }).join('') + '</div>');
    seg.querySelectorAll('.seg-btn[data-mode]').forEach(function (b) {
      b.onclick = function () { S.mode = b.dataset.mode; render(); };
    });
    mount.appendChild(seg);
    mount.appendChild(elFrom('<hr class="tr-rule" style="margin:0 0 30px"/>'));
    var body;
    if (S.mode === 'chars') body = viewChars(L);
    else if (S.mode === 'translate') body = viewTranslate(L, render);
    else body = viewText(L, render);
    mount.appendChild(body);
  }
  /* ── in-place text editor (curator) ──────────────────────────────
     Writes student-safe fields to texts/{id} and the reference (ref/syntax)
     to texts/{id}/private/answer — the reference never lands on the public
     doc/payload (security note). lines are rebuilt from srcLines+glosses on
     load, so the editor stores srcLines + glosses, not token arrays. */
  function renderTextEditor(L, mount, onDone) {
    var ED = window.TheoryEd || {};
    var es = {
      title: L.title || '', tag: L.tag || '', meter: L.meter || '',
      src: (L.srcLines || []).join('\n'),
      glosses: (L.glosses || []).map(function (g) { return { w: g.w, g: g.g }; }),
      ref: '', syntax: '', commentary: L.commentary || '',
      chars: (L.chars || []).map(function (c) { return Object.assign({}, c); }),
    };
    function toast(m) { if (typeof showToast === 'function') showToast(m, m); }
    // pre-fill the teacher-only reference via the sanctioned reveal function
    var rfn = _callable('revealTextReference');
    if (rfn && L.hasRef) rfn({ textId: L.id, mode: 'trans' }).then(function (r) { es.ref = (r && r.data && r.data.reference) || ''; var t = mount.querySelector('[data-f="ref"]'); if (t && !t.value) t.value = es.ref; }).catch(function () {});
    if (rfn && L.hasSyntax) rfn({ textId: L.id, mode: 'syntax' }).then(function (r) { es.syntax = (r && r.data && r.data.reference) || ''; var t = mount.querySelector('[data-f="syntax"]'); if (t && !t.value) t.value = es.syntax; }).catch(function () {});

    function draw() {
      var h = '<div>';
      h += ED.barHTML({ hint: 'Διόρθωσε το κείμενο, τις λέξεις-ερμηνείες, τις απαντήσεις αναφοράς και τα πρόσωπα.', edited: false });
      // header card
      h += '<div style="' + ED.CARD + ';margin-bottom:22px"><div class="tr-kicker" style="color:var(--gold);margin-bottom:14px">Κεφαλίδα</div>' +
        '<div style="display:grid;grid-template-columns:2fr 1fr;gap:14px">' +
          '<div><label style="' + ED.LAB + '">Τίτλος</label><input style="' + ED.INP + '" data-f="title" value="' + esc(es.title) + '"/></div>' +
          '<div><label style="' + ED.LAB + '">Μετρικό</label><input style="' + ED.MONO + '" data-f="meter" value="' + esc(es.meter) + '"/></div></div>' +
        '<label style="' + ED.LAB + ';margin-top:14px">Ετικέτα (eyebrow)</label><input style="' + ED.INP + '" data-f="tag" value="' + esc(es.tag) + '"/></div>';
      // body two columns
      h += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;align-items:start"><div>' +
        '<label style="' + ED.LAB + '">Πρωτότυπο — μία γραμμή ανά στίχο</label>' +
        '<textarea style="' + ED.AREA + ';min-height:140px;font-family:var(--f-serif);font-size:18px" data-f="src">' + esc(es.src) + '</textarea>' +
        '<label style="' + ED.LAB + ';margin-top:14px">Γλωσσάρι (λέξη → ερμηνεία)</label><div data-glosses style="display:flex;flex-direction:column;gap:8px">';
      es.glosses.forEach(function (g, i) {
        h += '<div style="display:flex;gap:8px;align-items:center">' +
          '<input style="' + ED.INP + ';max-width:200px;font-size:18px" data-gw="' + i + '" value="' + esc(g.w) + '" placeholder="λέξη"/>' +
          '<span style="color:var(--terra)">→</span>' +
          '<input style="' + ED.INP + '" data-gg="' + i + '" value="' + esc(g.g) + '" placeholder="ερμηνεία"/>' +
          '<button class="tr-btn tr-btn--ghost" data-grm="' + i + '" style="padding:6px 10px">✕</button></div>';
      });
      h += '</div><button class="tr-btn tr-btn--ghost" data-a="addgloss" style="align-self:flex-start;padding:6px 12px;margin-top:8px">＋ Λέξη</button></div><div>' +
        '<label style="' + ED.LAB + '">Μετάφραση αναφοράς <span style="color:var(--terra)">(κρυφό από μαθητή)</span></label>' +
        '<textarea style="' + ED.AREA + '" data-f="ref">' + esc(es.ref) + '</textarea>' +
        '<label style="' + ED.LAB + ';margin-top:14px">Συντακτικό αναφοράς <span style="color:var(--terra)">(κρυφό)</span></label>' +
        '<textarea style="' + ED.AREA + '" data-f="syntax">' + esc(es.syntax) + '</textarea>' +
        '<label style="' + ED.LAB + ';margin-top:14px">Σχόλιο (ορατό) — επιτρέπεται &lt;b&gt;</label>' +
        '<textarea style="' + ED.AREA + '" data-f="commentary">' + esc(es.commentary) + '</textarea></div></div>';
      // characters
      h += '<div style="display:flex;justify-content:space-between;align-items:baseline;margin:22px 0 12px">' +
        '<label style="' + ED.LAB + ';margin:0">Πρόσωπα · ' + es.chars.length + '</label>' +
        '<button class="tr-btn tr-btn--ghost" data-a="addchar" style="padding:6px 12px">＋ Πρόσωπο</button></div>';
      h += '<div style="display:flex;flex-direction:column;gap:10px">';
      es.chars.forEach(function (c, i) {
        var fac = (c.f === 'Τρώες' || c.f === 'trojan') ? 'trojan' : 'greek';
        h += '<div style="' + ED.CARD + ';padding:12px 14px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">' +
          '<select style="' + ED.MONO + ';max-width:130px" data-cf="' + i + '_f">' +
            '<option value="greek"' + (fac === 'greek' ? ' selected' : '') + '>Αχαιοί</option>' +
            '<option value="trojan"' + (fac === 'trojan' ? ' selected' : '') + '>Τρώες</option></select>' +
          '<input style="' + ED.INP + ';max-width:60px;text-align:center" data-cf="' + i + '_e" value="' + esc(c.e || '') + '" placeholder="Α"/>' +
          '<input style="' + ED.INP + '" data-cf="' + i + '_n" value="' + esc(c.n || '') + '" placeholder="Όνομα"/>' +
          '<div style="flex:1"></div>' +
          '<button class="tr-btn tr-btn--ghost" data-cmv="' + i + '" data-dir="-1" style="padding:3px 9px;font-size:12px"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
          '<button class="tr-btn tr-btn--ghost" data-cmv="' + i + '" data-dir="1" style="padding:3px 9px;font-size:12px"' + (i === es.chars.length - 1 ? ' disabled' : '') + '>↓</button>' +
          '<button class="tr-btn tr-btn--ghost" data-crm="' + i + '" style="padding:3px 9px;font-size:12px;color:var(--terra);border-color:color-mix(in srgb,var(--terra) 40%,transparent)">✕</button></div>' +
          '<input style="' + ED.INP + ';margin-bottom:6px" data-cf="' + i + '_r" value="' + esc(c.r || '') + '" placeholder="Ρόλος — π.χ. Αχαιοί · Ήρωας"/>' +
          '<textarea style="' + ED.AREA + ';min-height:50px" data-cf="' + i + '_d" placeholder="Περιγραφή">' + esc(c.d || '') + '</textarea></div>';
      });
      h += '</div></div>';

      mount.innerHTML = '';
      mount.appendChild(elFrom(h));
      ED.wireBar(mount, { onCancel: function () { onDone && onDone(); }, onSave: doSave });
      ['title', 'tag', 'meter', 'src', 'ref', 'syntax', 'commentary'].forEach(function (f) {
        var el = mount.querySelector('[data-f="' + f + '"]'); if (el) el.oninput = function (e) { es[f] = e.target.value; };
      });
      mount.querySelectorAll('[data-gw]').forEach(function (el) { el.oninput = function (e) { es.glosses[+el.dataset.gw].w = e.target.value; }; });
      mount.querySelectorAll('[data-gg]').forEach(function (el) { el.oninput = function (e) { es.glosses[+el.dataset.gg].g = e.target.value; }; });
      mount.querySelectorAll('[data-grm]').forEach(function (el) { el.onclick = function () { es.glosses.splice(+el.dataset.grm, 1); draw(); }; });
      var ag = mount.querySelector('[data-a="addgloss"]'); if (ag) ag.onclick = function () { es.glosses.push({ w: '', g: '' }); draw(); };
      mount.querySelectorAll('[data-cf]').forEach(function (el) { el.oninput = el.onchange = function (e) { var p = el.dataset.cf.split('_'); es.chars[+p[0]][p[1]] = e.target.value; }; });
      mount.querySelectorAll('[data-crm]').forEach(function (el) { el.onclick = function () { es.chars.splice(+el.dataset.crm, 1); draw(); }; });
      mount.querySelectorAll('[data-cmv]').forEach(function (el) { el.onclick = function () { var i = +el.dataset.cmv, j = i + (+el.dataset.dir); if (j < 0 || j >= es.chars.length) return; var c = es.chars.splice(i, 1)[0]; es.chars.splice(j, 0, c); draw(); }; });
      var ac = mount.querySelector('[data-a="addchar"]'); if (ac) ac.onclick = function () { es.chars.push({ f: 'greek', e: '', n: '', r: '', d: '' }); draw(); };
    }

    function doSave() {
      if (typeof firebase === 'undefined' || !firebase.firestore) { toast('Μη διαθέσιμο εκτός σύνδεσης'); return; }
      var db = firebase.firestore();
      var srcLines = es.src.split('\n').map(function (s) { return s.trim(); }).filter(Boolean);
      var glosses = es.glosses.filter(function (g) { return (g.w || '').trim() && (g.g || '').trim(); }).map(function (g) { return { w: g.w.trim(), g: g.g.trim() }; });
      var chars = es.chars.filter(function (c) { return (c.n || '').trim(); }).map(function (c) { return { f: c.f === 'trojan' ? 'trojan' : 'greek', e: (c.e || '').trim(), n: (c.n || '').trim(), r: (c.r || '').trim(), d: (c.d || '').trim() }; });
      var pub = {
        title: es.title.trim(), tag: es.tag.trim(), meter: es.meter.trim(),
        srcLines: srcLines, glosses: glosses, commentary: es.commentary.trim(), chars: chars,
        hasRef: !!es.ref.trim(), hasSyntax: !!es.syntax.trim(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      };
      // student-safe doc (NO ref/syntax keys), then the private reference subdoc
      db.doc('texts/' + L.id).set(pub, { merge: true }).then(function () {
        return db.doc('texts/' + L.id + '/private/answer').set({ ref: es.ref.trim(), syntax: es.syntax.trim(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      }).then(function () {
        toast('✓ Αποθηκεύτηκε');
        if (window.GP_CONTENT && window.GP_CONTENT.loadCloud) window.GP_CONTENT.loadCloud(true);
        onDone && onDone();
      }).catch(function (e) { console.warn('[text-editor]', e); toast('Δεν αποθηκεύτηκε — έλεγξε σύνδεση/δικαιώματα'); });
    }
    draw();
  }

  function closeTextLesson() {
    var ov = document.getElementById('theory-text-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
  }
  function openTextLesson(idOrDoc) {
    var docId = _docId(idOrDoc);
    if (typeof firebase === 'undefined' || !firebase.firestore) {
      if (typeof showToast === 'function') showToast('Μη διαθέσιμο εκτός σύνδεσης', 'Unavailable offline');
      return;
    }
    firebase.firestore().doc('texts/' + docId).get().then(function (doc) {
      if (!doc.exists) { if (typeof showToast === 'function') showToast('Το κείμενο δεν βρέθηκε', 'Text not found'); return; }
      S.lesson = buildTextModel(docId, doc.data());
      S.mode = 'text'; S.sub = 'trans'; S.attempt = ''; S.fb = null; S.hints = []; S.busy = null; S.err = ''; S.showRef = false; S.refText = ''; S.editing = false;
      var ov = ensureOverlay();
      render();
      ov.classList.add('active');
      document.body.style.overflow = 'hidden';
      ov.scrollTop = 0;
    }).catch(function (e) {
      console.warn('[theory-text] load', e);
      if (typeof showToast === 'function') showToast('Σφάλμα φόρτωσης κειμένου', 'Load error');
    });
  }

  window.openTextLesson = openTextLesson;
  window.closeTextLesson = closeTextLesson;
})();
