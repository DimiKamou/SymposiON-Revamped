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
  function escAttr(s) { return esc(s).replace(/"/g, '&quot;'); }
  function _tok(s) { return window.parallelTokenize ? window.parallelTokenize(s) : [{ t: String(s == null ? '' : s), w: true, wi: 0 }]; }
  // per-pair syntax map → kept only when it has at least one assigned role
  function _cleanSyn(syn) {
    if (!syn || typeof syn !== 'object') return null;
    var out = {}, has = false;
    Object.keys(syn).forEach(function (k) { if (syn[k] && String(syn[k]).trim()) { out[k] = String(syn[k]).trim(); has = true; } });
    return has ? out : null;
  }
  function _synCount(p) { return p && p.syn ? Object.keys(p.syn).filter(function (k) { return p.syn[k]; }).length : 0; }
  // render the original line as tokenised spans; annotated words become .pl-synw
  function renderOrig(p) {
    return _tok(p.a).map(function (tk) {
      if (!tk.w) return esc(tk.t);
      var role = p.syn && p.syn[tk.wi];
      if (role) return '<span class="pl-synw" data-role="' + escAttr(role) + '">' + esc(tk.t) + '</span>';
      return esc(tk.t);
    }).join('');
  }

  var S = { lesson: null, hide: false, shown: {}, editing: false, synOn: false };

  function modelFromDoc(id, d) {
    return {
      id: id, kind: 'parallel', navGroup: d.navGroup || 'literature',
      title: d.title || 'Παράλληλο κείμενο', tag: d.tag || '', level: d.level || '', intro: d.intro || '',
      leftLabel: d.leftLabel || 'Αρχαίο κείμενο', rightLabel: d.rightLabel || 'Νέα ελληνικά',
      commentary: d.commentary || '', pairs: Array.isArray(d.pairs) ? d.pairs.map(function (p) { return { a: p.a, g: p.g, syn: _cleanSyn(p.syn) }; }) : [],
    };
  }

  /* ── read view ──────────────────────────────────────────────────── */
  function renderRead(mount) {
    var L = S.lesson;
    mount.innerHTML = '';
    var pairs = L.pairs || [];
    var annot = pairs.reduce(function (n, p) { return n + _synCount(p); }, 0);
    if (!annot) S.synOn = false;
    var h = '<div><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px;flex-wrap:wrap"><div>' +
      '<div class="tr-eyebrow">Παράλληλο κείμενο · ' + esc(L.level) + (annot ? ' <span style="color:var(--gold);margin-left:8px">· ' + annot + ' σχόλια σύνταξης</span>' : '') + (L.edited ? ' <span style="color:var(--gold);margin-left:8px">· επεξεργασμένο</span>' : '') + '</div>' +
      '<div class="tr-lemma" style="font-size:40px;line-height:1.05;margin-top:8px">' + esc(L.title) + '</div>' +
      (L.tag ? '<div class="tr-meaning" style="font-size:19px;margin-top:6px">' + esc(L.tag) + '</div>' : '') + '</div>' +
      '<div style="display:flex;gap:10px;flex-shrink:0;flex-wrap:wrap">' +
        (isCurator() ? '<button class="tr-btn tr-btn--ghost" data-a="edit">✎ Επεξεργασία</button>' : '') +
        (annot ? '<button class="tr-btn ' + (S.synOn ? 'tr-btn--terra' : 'tr-btn--ghost') + '" data-a="syn">' + (S.synOn ? '■ Σύνταξη' : '□ Σύνταξη') + '</button>' : '') +
        '<button class="tr-btn ' + (S.hide ? 'tr-btn--terra' : 'tr-btn--ghost') + '" data-a="hide">' + (S.hide ? '◉ Απόδοση κρυφή' : '◯ Κρύψε την απόδοση') + '</button>' +
      '</div></div>';
    if (L.intro) h += '<p class="tr-body" style="margin-top:16px;max-width:760px">' + L.intro + '</p>';
    h += '<div class="pl-wrap' + (S.synOn ? ' pl-synon' : '') + '" style="margin-top:24px"><div class="pl-head"><div class="pl-h-l">' + esc(L.leftLabel) + '</div><div class="pl-h-r">' + esc(L.rightLabel) + '</div></div>';
    if (!pairs.length) h += '<div class="tt-empty" style="margin:16px">Δεν υπάρχουν στίχοι ακόμη.</div>';
    pairs.forEach(function (p, i) {
      var reveal = !S.hide || S.shown[i];
      h += '<div class="pl-row"><span class="pl-n">' + (i + 1) + '</span><div class="pl-a">' + renderOrig(p) + '</div>' +
        '<div class="pl-g' + (reveal ? '' : ' masked') + '" data-rev="' + i + '">' +
        (p.g ? (reveal ? esc(p.g) : '<span class="pl-tap">δες την απόδοση</span>') : '<span style="color:var(--fog)">—</span>') + '</div></div>';
    });
    h += '</div>';
    if (L.commentary) h += '<div style="margin-top:28px"><div class="tr-kicker" style="color:var(--gold)">Σχόλιο</div><p class="trr-note" style="margin-top:10px">' + L.commentary + '</p></div>';
    h += '<div class="tr-cap" style="margin-top:18px">' + (S.synOn ? 'Πάτησε μια υπογραμμισμένη λέξη για τον συντακτικό της ρόλο' : (S.hide ? 'Πάτησε ένα κελί δεξιά για να αποκαλύψεις τη γραμμή' : 'Κάθε γραμμή αρχαίου ευθυγραμμίζεται με την απόδοσή της')) + '</div></div>';
    mount.appendChild(elFrom(h));
    var eb = mount.querySelector('[data-a="edit"]'); if (eb) eb.onclick = function () { S.editing = true; render(); };
    var hb = mount.querySelector('[data-a="hide"]'); if (hb) hb.onclick = function () { S.hide = !S.hide; S.shown = {}; render(); };
    var sb = mount.querySelector('[data-a="syn"]'); if (sb) sb.onclick = function () { S.synOn = !S.synOn; render(); };
    mount.querySelectorAll('[data-rev]').forEach(function (el) { el.onclick = function () { if (S.hide) { S.shown[+el.dataset.rev] = true; render(); } }; });
    mount.querySelectorAll('.pl-synw').forEach(function (el) { el.onclick = function (e) { if (!S.synOn) return; e.stopPropagation(); showSynPop(el, el.getAttribute('data-role')); }; });
  }

  /* ── editor ─────────────────────────────────────────────────────── */
  function renderEditor(mount) {
    var E = ed(), L = S.lesson;
    var es = {
      title: L.title || '', tag: L.tag || '', level: L.level || '', intro: L.intro || '',
      leftLabel: L.leftLabel || '', rightLabel: L.rightLabel || '', commentary: L.commentary || '',
      pairs: (L.pairs || []).map(function (p) { return { a: p.a, g: p.g, syn: (p.syn && typeof p.syn === 'object') ? Object.assign({}, p.syn) : {} }; }),
    };
    function chipsHTML(p) {
      var toks = _tok(p.a).filter(function (t) { return t.w; });
      if (!toks.length) return '<span class="tr-cap">Γράψε πρώτα τον αρχαίο στίχο.</span>';
      return toks.map(function (tk) {
        var role = p.syn && p.syn[tk.wi];
        return '<button type="button" class="pl-ed-chip' + (role ? ' has' : '') + '" data-wi="' + tk.wi + '">' + esc(tk.t) + (role ? '<i>' + esc(role) + '</i>' : '') + '</button>';
      }).join('');
    }
    // drop syn keys past the current word count (indices shift on text edits)
    function pruneSyn(p) {
      if (!p.syn) return;
      var n = _tok(p.a).filter(function (t) { return t.w; }).length;
      Object.keys(p.syn).forEach(function (k) { if (+k >= n) delete p.syn[k]; });
    }
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
        var sc = _synCount(p);
        h += '<div data-pi="' + i + '">' +
          '<div style="display:flex;gap:8px;align-items:flex-start"><span class="tr-cap" style="min-width:22px;padding-top:12px;text-align:right">' + (i + 1) + '</span>' +
          '<textarea style="' + E.AREA + ';min-height:46px;font-family:var(--f-serif);font-size:18px" data-pa="' + i + '" placeholder="αρχαίος στίχος">' + esc(p.a) + '</textarea>' +
          '<textarea style="' + E.AREA + ';min-height:46px" data-pg="' + i + '" placeholder="απόδοση">' + esc(p.g) + '</textarea>' +
          '<div style="display:flex;flex-direction:column;gap:4px;flex-shrink:0">' +
            '<button class="tr-btn tr-btn--ghost" data-pmv="' + i + '" data-dir="-1" style="padding:3px 9px;font-size:12px"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
            '<button class="tr-btn tr-btn--ghost" data-pmv="' + i + '" data-dir="1" style="padding:3px 9px;font-size:12px"' + (i === es.pairs.length - 1 ? ' disabled' : '') + '>↓</button>' +
            '<button class="tr-btn tr-btn--ghost" data-prm="' + i + '" style="padding:3px 9px;font-size:12px;color:var(--terra);border-color:color-mix(in srgb,var(--terra) 40%,transparent)">✕</button></div></div>' +
          '<div style="margin:6px 0 0 30px"><button class="tr-btn tr-btn--ghost" data-syntog="' + i + '" style="padding:4px 10px;font-size:11px">⚙ Σύνταξη' + (sc ? ' · ' + sc + ' λέξεις' : '') + ' ▾</button></div>' +
          '<div class="pl-ed-syn" data-synrow="' + i + '" hidden style="margin:2px 0 4px 30px"><div class="pl-ed-chips" data-chips="' + i + '">' + chipsHTML(p) + '</div></div>' +
          '</div>';
      });
      h += '</div>';
      h += '<label style="' + E.LAB + ';margin-top:22px">Σχόλιο — επιτρέπεται &lt;b&gt;</label><textarea style="' + E.AREA + '" data-f="commentary">' + esc(es.commentary) + '</textarea></div>';
      mount.innerHTML = '';
      mount.appendChild(elFrom(h));
      E.wireBar(mount, { onCancel: function () { if (L._isNew) { closeParallel(); } else { S.editing = false; render(); } }, onSave: doSave });
      ['title', 'tag', 'level', 'intro', 'leftLabel', 'rightLabel', 'commentary'].forEach(function (f) { var el = mount.querySelector('[data-f="' + f + '"]'); if (el) el.oninput = function (e) { es[f] = e.target.value; }; });
      mount.querySelectorAll('[data-pa]').forEach(function (el) { el.oninput = function (e) {
        var i = +el.dataset.pa; es.pairs[i].a = e.target.value; pruneSyn(es.pairs[i]);
        var chips = mount.querySelector('[data-chips="' + i + '"]'); if (chips) { chips.innerHTML = chipsHTML(es.pairs[i]); wireChips(mount, es); }
      }; });
      mount.querySelectorAll('[data-pg]').forEach(function (el) { el.oninput = function (e) { es.pairs[+el.dataset.pg].g = e.target.value; }; });
      mount.querySelectorAll('[data-prm]').forEach(function (el) { el.onclick = function () { es.pairs.splice(+el.dataset.prm, 1); draw(); }; });
      mount.querySelectorAll('[data-pmv]').forEach(function (el) { el.onclick = function () { var i = +el.dataset.pmv, j = i + (+el.dataset.dir); if (j < 0 || j >= es.pairs.length) return; var x = es.pairs.splice(i, 1)[0]; es.pairs.splice(j, 0, x); draw(); }; });
      mount.querySelectorAll('[data-syntog]').forEach(function (el) { el.onclick = function () { var row = mount.querySelector('[data-synrow="' + el.dataset.syntog + '"]'); if (row) row.hidden = !row.hidden; }; });
      mount.querySelectorAll('.pl-ed-chip').forEach(function (chip) { chip.onclick = function () {
        var prow = chip.closest('[data-pi]'); var i = +prow.dataset.pi, wi = +chip.dataset.wi;
        openRolePick(chip, es.pairs[i], wi, function () { var chips = mount.querySelector('[data-chips="' + i + '"]'); if (chips) chips.innerHTML = chipsHTML(es.pairs[i]); wireChips(mount, es); var tog = mount.querySelector('[data-syntog="' + i + '"]'); if (tog) { var sc = _synCount(es.pairs[i]); tog.innerHTML = '⚙ Σύνταξη' + (sc ? ' · ' + sc + ' λέξεις' : '') + ' ▾'; } });
      }; });
      var ap = mount.querySelector('[data-a="addpair"]'); if (ap) ap.onclick = function () { es.pairs.push({ a: '', g: '', syn: {} }); draw(); };
    }
    function wireChips(mount, es) {
      mount.querySelectorAll('.pl-ed-chip').forEach(function (chip) { chip.onclick = function () {
        var prow = chip.closest('[data-pi]'); var i = +prow.dataset.pi, wi = +chip.dataset.wi;
        openRolePick(chip, es.pairs[i], wi, function () { var chips = mount.querySelector('[data-chips="' + i + '"]'); if (chips) chips.innerHTML = chipsHTML(es.pairs[i]); wireChips(mount, es); var tog = mount.querySelector('[data-syntog="' + i + '"]'); if (tog) { var sc = _synCount(es.pairs[i]); tog.innerHTML = '⚙ Σύνταξη' + (sc ? ' · ' + sc + ' λέξεις' : '') + ' ▾'; } });
      }; });
    }
    function doSave() {
      var db = _db(), uid = _uid();
      if (!db || !uid) { toast('Χρειάζεται σύνδεση'); return; }
      if (!es.title.trim()) { toast('Χρειάζεται τίτλος'); return; }
      var doc = {
        kind: 'parallel', navGroup: L.navGroup || 'literature',
        title: es.title.trim(), tag: es.tag.trim(), level: es.level.trim(), intro: es.intro.trim(),
        leftLabel: es.leftLabel.trim(), rightLabel: es.rightLabel.trim(), commentary: es.commentary.trim(),
        pairs: es.pairs.filter(function (p) { return (p.a || '').trim() || (p.g || '').trim(); }).map(function (p) { var o = { a: (p.a || '').trim(), g: (p.g || '').trim() }; var s = _cleanSyn(p.syn); if (s) o.syn = s; return o; }),
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

  /* ── reader syntax popover ──────────────────────────────────────── */
  function showSynPop(anchor, role) {
    closeSynPop();
    var ov = document.getElementById('theory-parallel-overlay'); if (!ov) return;
    var pop = elFrom('<div class="pl-synpop"><span class="pl-synpop-w">' + esc(anchor.textContent) + '</span><span class="pl-synpop-r">' + esc(role) + '</span></div>');
    ov.appendChild(pop);
    var r = anchor.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight;
    var left = Math.max(8, Math.min(window.innerWidth - pw - 8, r.left + r.width / 2 - pw / 2));
    var top = r.top - ph - 10; if (top < 8) top = r.bottom + 10;
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
    setTimeout(function () { document.addEventListener('mousedown', _synPopOutside, true); window.addEventListener('scroll', closeSynPop, true); }, 0);
  }
  function _synPopOutside(e) { if (!e.target.closest('.pl-synpop') && !e.target.closest('.pl-synw')) closeSynPop(); }
  function closeSynPop() { var p = document.querySelector('.pl-synpop'); if (p) p.remove(); document.removeEventListener('mousedown', _synPopOutside, true); window.removeEventListener('scroll', closeSynPop, true); }

  /* ── editor role picker ─────────────────────────────────────────── */
  function openRolePick(anchor, pair, wi, onChange) {
    closeRolePick();
    var groups = window.PARALLEL_ROLE_GROUPS || [];
    var ov = document.getElementById('theory-parallel-overlay');
    var pick = elFrom('<div class="pl-rolepick" role="dialog">' +
      '<div class="pl-rolepick-h">Συντακτικός ρόλος για «' + esc(anchor.childNodes[0] ? anchor.childNodes[0].textContent : '') + '»</div>' +
      '<div class="pl-rolepick-row"><input type="text" placeholder="ρόλος ή αναζήτηση…" value="' + escAttr((pair.syn && pair.syn[wi]) || '') + '"/><button class="pl-rolepick-btn" data-ok>OK</button><button class="pl-rolepick-clr" data-clr>Αφαίρεση</button></div>' +
      '<div class="pl-rolepick-list"></div></div>');
    (ov || document.body).appendChild(pick);
    var input = pick.querySelector('input'), listEl = pick.querySelector('.pl-rolepick-list');
    function paintList(filter) {
      var f = (filter || '').trim().toLowerCase(), cur = (pair.syn && pair.syn[wi]) || '';
      listEl.innerHTML = groups.map(function (g) {
        var roles = g[1].filter(function (r) { return !f || r.toLowerCase().indexOf(f) >= 0; });
        if (!roles.length) return '';
        return '<div class="pl-rolepick-grp"><div class="pl-rolepick-glab">' + esc(g[0]) + '</div>' +
          roles.map(function (r) { return '<button type="button" class="pl-role' + (r === cur ? ' on' : '') + '" data-r="' + escAttr(r) + '">' + esc(r) + '</button>'; }).join('') + '</div>';
      }).join('') || '<div class="tr-cap" style="padding:8px">Πάτησε OK για ελεύθερη καταχώριση.</div>';
    }
    function commit(val) { pair.syn = pair.syn || {}; if (val && val.trim()) pair.syn[wi] = val.trim(); else delete pair.syn[wi]; closeRolePick(); if (onChange) onChange(); }
    paintList('');
    input.oninput = function () { paintList(input.value); };
    input.onkeydown = function (e) { if (e.key === 'Enter') { e.preventDefault(); commit(input.value); } else if (e.key === 'Escape') closeRolePick(); };
    pick.querySelector('[data-ok]').onclick = function () { commit(input.value); };
    pick.querySelector('[data-clr]').onclick = function () { commit(''); };
    listEl.onclick = function (e) { var b = e.target.closest('.pl-role'); if (b) commit(b.dataset.r); };
    var r = anchor.getBoundingClientRect(), pw = pick.offsetWidth, ph = pick.offsetHeight;
    var left = Math.max(8, Math.min(window.innerWidth - pw - 8, r.left + r.width / 2 - pw / 2));
    var top = r.top - ph - 8; if (top < 8) top = r.bottom + 8;
    pick.style.left = left + 'px'; pick.style.top = top + 'px';
    input.focus(); input.select();
    setTimeout(function () { document.addEventListener('mousedown', _rolePickOutside, true); }, 0);
  }
  function _rolePickOutside(e) { if (!e.target.closest('.pl-rolepick') && !e.target.closest('.pl-ed-chip')) closeRolePick(); }
  function closeRolePick() { var p = document.querySelector('.pl-rolepick'); if (p) p.remove(); document.removeEventListener('mousedown', _rolePickOutside, true); }

  function _injectSynCSS() {
    if (document.getElementById('pl-syn-css')) return;
    var st = document.createElement('style'); st.id = 'pl-syn-css';
    st.textContent =
      '.pl-synon .pl-synw{background:color-mix(in srgb,var(--gold,#A2862F) 18%,transparent);border-bottom:2px solid var(--gold,#A2862F);border-radius:3px;cursor:pointer;padding:0 1px;transition:background .15s}' +
      '.pl-synon .pl-synw:hover{background:color-mix(in srgb,var(--gold,#A2862F) 32%,transparent)}' +
      '.pl-synpop{position:fixed;z-index:100002;background:#201a12;border:1px solid color-mix(in srgb,var(--gold,#A2862F) 45%,transparent);border-radius:11px;padding:10px 14px;box-shadow:0 16px 44px rgba(20,14,8,.5);display:flex;flex-direction:column;gap:4px;max-width:280px}' +
      '.pl-synpop-w{font-family:var(--f-serif,serif);font-size:17px;color:#ECDAB4}' +
      '.pl-synpop-r{font:600 11px/1.2 var(--f-disp,"Oswald",sans-serif);letter-spacing:.06em;text-transform:uppercase;color:var(--gold,#E0B24C)}' +
      '.pl-ed-chips{display:flex;flex-wrap:wrap;gap:5px}' +
      '.pl-ed-chip{font-family:var(--f-serif,serif);font-size:15px;padding:4px 8px;border-radius:7px;border:1px solid var(--line,rgba(0,0,0,.14));background:var(--sink,rgba(0,0,0,.05));cursor:pointer;display:inline-flex;flex-direction:column;align-items:center;gap:2px;color:inherit}' +
      '.pl-ed-chip.has{border-color:var(--gold,#A2862F);background:color-mix(in srgb,var(--gold,#A2862F) 14%,transparent)}' +
      '.pl-ed-chip i{font:600 8.5px/1 var(--f-disp,"Oswald",sans-serif);font-style:normal;letter-spacing:.04em;text-transform:uppercase;color:var(--gold,#A2862F)}' +
      '.pl-rolepick{position:fixed;z-index:100003;width:330px;max-width:92vw;background:#201a12;border:1px solid color-mix(in srgb,var(--gold,#A2862F) 40%,transparent);border-radius:13px;box-shadow:0 18px 50px rgba(20,14,8,.55);padding:12px;color:#ECDAB4}' +
      '.pl-rolepick-h{font:600 11px/1.3 var(--f-disp,"Oswald",sans-serif);letter-spacing:.04em;text-transform:uppercase;color:var(--gold,#E0B24C);margin-bottom:8px}' +
      '.pl-rolepick-row{display:flex;gap:6px;margin-bottom:8px}' +
      '.pl-rolepick input{flex:1;min-width:0;background:rgba(255,255,255,.06);border:1px solid color-mix(in srgb,var(--gold,#A2862F) 30%,transparent);border-radius:8px;padding:7px 10px;color:#ECDAB4;font:13px var(--f-sans,"Montserrat",sans-serif)}' +
      '.pl-rolepick-list{max-height:250px;overflow-y:auto}' +
      '.pl-rolepick-glab{position:sticky;top:0;background:#201a12;font:600 9.5px/1.4 var(--f-disp,"Oswald",sans-serif);letter-spacing:.08em;text-transform:uppercase;color:#8C7F6B;padding:4px 0}' +
      '.pl-role{display:inline-block;font:11.5px var(--f-sans,"Montserrat",sans-serif);padding:4px 8px;margin:2px 3px 2px 0;border-radius:999px;border:1px solid rgba(255,255,255,.13);background:transparent;color:#ECDAB4;cursor:pointer}' +
      '.pl-role:hover{border-color:var(--gold,#A2862F)}' +
      '.pl-role.on{background:var(--terra,#C5572F);border-color:var(--terra,#C5572F);color:#fff}' +
      '.pl-rolepick-btn{background:var(--terra,#C5572F);border:none;border-radius:8px;color:#fff;padding:7px 12px;cursor:pointer;font:600 11px var(--f-disp,"Oswald",sans-serif);letter-spacing:.04em;text-transform:uppercase}' +
      '.pl-rolepick-clr{background:transparent;border:1px solid color-mix(in srgb,var(--terra,#C5572F) 40%,transparent);color:var(--terra,#C5572F);border-radius:8px;padding:7px 10px;cursor:pointer;font-size:11px;white-space:nowrap}';
    document.head.appendChild(st);
  }

  /* ── overlay ────────────────────────────────────────────────────── */
  function ensureOverlay() {
    _injectSynCSS();
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
    S.lesson = lesson; S.hide = false; S.shown = {}; S.synOn = false; S.editing = !!editing;
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
