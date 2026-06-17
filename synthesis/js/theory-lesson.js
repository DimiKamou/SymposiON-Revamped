/* ════════════════════════════════════════════════════════════════════
   theory-lesson.js — the three-mode grammar lesson view
   (Θεωρία · Πίνακας · Κάρτες), recreated in vanilla JS from the design
   handoff's lesson-grammar.jsx. Part-of-speech-agnostic: verbs expose
   tenses/moods/pers, nominals expose tabs/cols/rows — the view reads the
   generic aliases.

   • Θεωρία  — stat cards, intro, paradigm as mood blocks, worked example.
   • Πίνακας — interactive tense×mood×person grid + "Μελέτη" blur/reveal.
   • Κάρτες  — delegates to the EXISTING Mnemosyne engine via navToStudy()
               (does NOT rebuild flashcards — INTEGRATION §1).

   Entry point:  openTheoryLesson(datasetId)
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var GPAL = ['var(--c-mood)', 'var(--c-form)', 'var(--c-voice)', 'var(--c-person)', 'var(--c-tense)'];
  function colFor(c, i) {
    return (window.MOOD_COLORS && window.MOOD_COLORS[c]) || GPAL[i % GPAL.length];
  }
  var TABS = function (l) { return l.tabs || l.tenses || []; };
  var COLS = function (l) { return l.cols || l.moods || []; };
  var ROWS = function (l) { return l.rows || l.pers || []; };

  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmtEnd(s) { return String(s || '').replace(/<i>/g, '<span class="end">').replace(/<\/i>/g, '</span>'); }
  function fmtE(s) {
    return String(s || '').replace(/<e>/g, '<em style="color:var(--terra);font-style:normal">').replace(/<\/e>/g, '</em>');
  }
  function elFrom(html) { var d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstElementChild; }

  // ── module state for the currently open lesson ──
  var S = { lesson: null, mode: 'theory', ti: 0, study: false, rev: {} };

  /* ─────────────────────────── Θεωρία ─────────────────────────── */
  function viewTheory(L) {
    var tabs = TABS(L), cols = COLS(L), rows = ROWS(L), t = tabs[0];
    var data = L.data || {};
    function blk(c) {
      var out = [];
      rows.forEach(function (p, i) {
        var v = data[t] && data[t][c] ? data[t][c][i] : '';
        if (v !== '' && v != null) out.push([p, v]);
      });
      return out;
    }
    function moodBlock(name, color, pairs) {
      return '<div class="tr-mood"><div class="tr-mood-h" style="color:' + color + '">' +
        '<span class="bar" style="background:' + color + '"></span>' + esc(name) + '</div>' +
        pairs.map(function (r) {
          return '<div class="tr-mood-row"><span class="tr-pers">' + esc(r[0]) +
            '</span><span class="tr-form" style="font-size:21px">' + fmtEnd(r[1]) + '</span></div>';
        }).join('') + '</div>';
    }
    var hasNom = L.nom && L.nom[t] && L.nom[t].length > 0;
    var html = '<div>';
    // badges
    html += '<div style="display:flex;gap:12px;flex-wrap:wrap">' +
      (L.badges || []).map(function (b) {
        return '<div class="tr-stat"><div class="k">' + esc(b[0]) + '</div><div class="v">' + esc(b[1]) + '</div></div>';
      }).join('') + '</div>';
    // intro
    html += '<div style="margin-top:36px"><div class="tr-kicker">Τι είναι</div>' +
      '<p class="tr-body" style="margin-top:12px;max-width:720px">' + fmtEnd(L.intro || '') + '</p></div>';
    // paradigm blocks
    html += '<div style="margin-top:34px"><h2 class="tr-h2" style="font-size:30px">' + esc(t) + '</h2>' +
      '<hr class="tr-rule tr-rule--left" style="margin:14px 0 22px"/>' +
      '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:start">';
    cols.forEach(function (c, i) { html += moodBlock(c, colFor(c, i), blk(c)); });
    if (hasNom) html += moodBlock('Ονοματικοί τύποι', 'var(--gold)', L.nom[t]);
    html += '</div></div>';
    // example
    if (L.example) {
      html += '<div style="margin-top:36px;border-left:2px solid var(--terra);padding-left:22px">' +
        '<div class="tr-kicker" style="color:var(--terra)">Στον λόγο</div>' +
        '<p class="tr-form" style="font-size:28px;line-height:1.3;margin-top:10px">' + fmtE(L.example.gr) + '</p>' +
        '<p class="tr-meaning" style="font-size:18px;margin-top:6px">' + esc(L.example.tr) + '</p></div>';
    }
    html += '</div>';
    return elFrom(html);
  }

  /* ─────────────────────────── Πίνακας ────────────────────────── */
  function viewMatrix(L, rerender) {
    var tabs = TABS(L), cols = COLS(L), rows = ROWS(L);
    var t = tabs[S.ti] || tabs[0];
    var single = tabs.length <= 1;
    var data = L.data || {};
    var wrap = document.createElement('div');

    // top bar: tabs + Μελέτη toggle
    var top = '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px">' +
      '<div class="trm-tabs" style="border-bottom:' + (single ? 'none' : '1px solid var(--line)') + ';flex:1">';
    if (single) top += '<span class="tr-kicker" style="color:var(--gold)">' + esc(t) + '</span>';
    else top += tabs.map(function (tn, i) {
      return '<button class="trm-tab' + (i === S.ti ? ' on' : '') + '" data-ti="' + i + '">' + esc(tn) + '</button>';
    }).join('');
    top += '</div><button class="tr-btn ' + (S.study ? 'tr-btn--terra' : 'tr-btn--ghost') + '" data-act="study" style="margin-left:16px">' +
      (S.study ? '◉ Μελέτη ΟΝ' : '◯ Μελέτη') + '</button></div>';

    // grid
    var grid = '<div class="trm' + (S.study ? ' study' : '') + '">' +
      '<div class="trm-grid" style="grid-template-columns:minmax(110px,auto) repeat(' + cols.length + ',1fr)">' +
      '<div class="trm-cell trm-colh"></div>';
    cols.forEach(function (m, i) {
      grid += '<div class="trm-cell trm-colh"><span class="bar" style="background:' + colFor(m, i) + '"></span>' +
        '<span class="m" style="color:' + colFor(m, i) + '">' + esc(m) + '</span></div>';
    });
    rows.forEach(function (p, ri) {
      grid += '<div class="trm-cell trm-rowh"><span class="trm-pers">' + esc(p) + '</span></div>';
      cols.forEach(function (m) {
        var v = data[t] && data[t][m] ? data[t][m][ri] : '';
        var key = t + '|' + m + '|' + ri;
        var revealed = !S.study || S.rev[key];
        if (v) {
          grid += '<div class="trm-cell' + (revealed ? ' revealed' : '') + '" data-key="' + esc(key) + '">' +
            '<span class="trm-form">' + fmtEnd(v) + '</span></div>';
        } else {
          grid += '<div class="trm-cell dim"><span class="trm-form" style="font-size:18px;color:var(--fog)">—</span></div>';
        }
      });
    });
    grid += '</div>';
    // nominal extras row (verbs: inf/ptc)
    if (L.nom && L.nom[t] && L.nom[t].length > 0) {
      grid += '<div style="display:flex;gap:28px;margin-top:16px;padding:0 4px;flex-wrap:wrap">' +
        L.nom[t].map(function (r) {
          return '<div style="display:flex;align-items:baseline;gap:12px"><span class="tr-pers" style="min-width:84px">' +
            esc(r[0]) + '</span><span class="trm-form" style="font-size:22px">' + fmtEnd(r[1]) + '</span></div>';
        }).join('') + '</div>';
    }
    grid += '</div>';

    // legend + caption
    var legend = '<div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px">' +
      '<div class="trm-legend">' + cols.map(function (m, i) {
        return '<span><span class="sw" style="background:' + colFor(m, i) + '"></span>' + esc(m) + '</span>';
      }).join('') + '</div>' +
      '<div class="tr-cap">' + (S.study ? 'Πάτα ένα κελί για να το αποκαλύψεις' : esc(t)) + '</div></div>';

    wrap.innerHTML = top + grid + legend;

    // wiring
    wrap.querySelectorAll('.trm-tab[data-ti]').forEach(function (b) {
      b.onclick = function () { S.ti = +b.dataset.ti; S.rev = {}; rerender(); };
    });
    var studyBtn = wrap.querySelector('[data-act="study"]');
    if (studyBtn) studyBtn.onclick = function () { S.study = !S.study; S.rev = {}; rerender(); };
    if (S.study) {
      wrap.querySelectorAll('.trm-cell[data-key]').forEach(function (c) {
        c.style.cursor = 'pointer';
        c.onclick = function () { S.rev[c.dataset.key] = true; rerender(); };
      });
    }
    return wrap;
  }

  /* ─────────────────────────── Κάρτες ─────────────────────────── */
  // Curated museum flip-cards from lesson.cards (GCards), with a handoff
  // to the full Mnemosyne deck. Empty state when the lesson has no cards.
  function viewCards(L) {
    var deck = L.cards || [];
    var wrap = document.createElement('div');
    var cs = { idx: 0, flipped: false, mastered: [] };

    function mnemoBtn() {
      return (typeof navToStudy === 'function')
        ? '<div class="tr-cap" style="margin-top:22px;text-align:center"><button class="tr-btn tr-btn--ghost" data-act="full">▶ Πλήρης μελέτη (Μνημοσύνη)</button></div>'
        : '';
    }
    function wireMnemo() {
      var fb = wrap.querySelector('[data-act="full"]');
      if (fb) fb.onclick = function () { navToStudy(L.id); };
    }

    if (deck.length === 0) {
      wrap.innerHTML = '<div class="tt-empty">Δεν υπάρχουν κάρτες για αυτό το μάθημα ακόμη.</div>' + mnemoBtn();
      wireMnemo();
      return wrap;
    }

    function renderCard() {
      var card = deck[cs.idx];
      var face = !cs.flipped
        ? '<div class="trc-face" style="align-items:center;justify-content:center;text-align:center">' +
            '<div class="tr-chips" style="justify-content:center;margin-bottom:22px">' +
              (card.chips || []).map(function (ch) { return '<span class="tr-chip"><span class="dot ' + esc(ch[1]) + '"></span>' + esc(ch[0]) + '</span>'; }).join('') +
            '</div>' +
            '<div class="trc-prompt" style="font-size:30px;font-style:italic;color:var(--stone)">' + esc(card.prompt) + '</div>' +
            '<div style="margin-top:24px;font-size:56px;font-family:var(--f-serif);color:var(--line-hi)">?</div></div>'
        : '<div class="trc-face" style="align-items:center;justify-content:center;text-align:center">' +
            '<div class="tr-cap" style="color:var(--terra)">Απάντηση</div>' +
            '<div class="trc-answer" style="font-size:76px;line-height:1;margin:12px 0 4px"><em>' + esc(card.answer) + '</em></div>' +
            '<div class="tr-meaning" style="font-size:20px">' + esc(card.meaning) + '</div>' +
            '<div class="trc-prompt" style="font-size:20px;margin-top:18px">' + fmtE(card.ex) + '</div></div>';
      wrap.innerHTML =
        '<div style="display:flex;flex-direction:column;align-items:center">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;width:100%;max-width:620px">' +
            '<div class="tr-cap">Κάρτα ' + (cs.idx + 1) + ' / ' + deck.length + '</div>' +
            '<div class="trc-pips">' + deck.map(function (_, i) { return '<span class="trc-pip' + (cs.mastered.indexOf(i) >= 0 ? ' full' : '') + '"></span>'; }).join('') + '</div>' +
            '<div class="tr-cap">' + cs.mastered.length + ' κατακτήθηκαν</div></div>' +
          '<div class="trc-stage" style="width:min(600px,100%);height:340px;margin:26px 0">' +
            '<div class="trc-spine" style="transform:translate(9px,9px)"></div>' +
            '<div class="trc-spine" style="transform:translate(4px,4px)"></div>' +
            '<div class="trc-card" data-act="flip" style="position:relative;width:100%;height:100%;cursor:pointer">' + face + '</div>' +
          '</div>' +
          '<div style="display:flex;gap:14px;height:50px;opacity:' + (cs.flipped ? 1 : 0) + ';pointer-events:' + (cs.flipped ? 'auto' : 'none') + ';transition:opacity .2s">' +
            '<button class="tr-btn tr-btn--ghost" data-act="again" style="min-width:170px;justify-content:center">↻ Επανάληψη</button>' +
            '<button class="tr-btn tr-btn--terra" data-act="got" style="min-width:170px;justify-content:center">✓ Το κατέκτησα</button></div>' +
          '<div class="tr-cap" style="margin-top:14px">' + (cs.flipped ? 'Πάτα την κάρτα για να γυρίσει' : 'Πάτα την κάρτα για την απάντηση') + '</div>' +
          mnemoBtn() +
        '</div>';
      wrap.querySelector('[data-act="flip"]').onclick = function () { cs.flipped = !cs.flipped; renderCard(); };
      var next = function (master) {
        if (master && cs.mastered.indexOf(cs.idx) < 0) cs.mastered.push(cs.idx);
        cs.flipped = false; cs.idx = (cs.idx + 1) % deck.length; renderCard();
      };
      var ag = wrap.querySelector('[data-act="again"]'); if (ag) ag.onclick = function () { next(false); };
      var gt = wrap.querySelector('[data-act="got"]'); if (gt) gt.onclick = function () { next(true); };
      wireMnemo();
    }
    renderCard();
    return wrap;
  }

  /* ─────────────────────────── shell ──────────────────────────── */
  function ensureOverlay() {
    var ov = document.getElementById('theory-lesson-overlay');
    if (ov) return ov;
    ov = elFrom(
      '<div id="theory-lesson-overlay" class="tr-overlay" role="dialog" aria-modal="true" aria-label="Μάθημα γραμματικής">' +
        '<button class="tr-overlay-close" aria-label="Κλείσιμο">✕</button>' +
        '<div class="tr"><div class="tr-grain"></div><div class="tr-inner" id="theory-lesson-mount"></div></div>' +
      '</div>');
    ov.querySelector('.tr-overlay-close').onclick = closeTheoryLesson;
    ov.addEventListener('click', function (e) { if (e.target === ov) closeTheoryLesson(); });
    document.body.appendChild(ov);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && ov.classList.contains('active')) closeTheoryLesson();
    });
    return ov;
  }

  function renderLesson() {
    var L = S.lesson, mount = document.getElementById('theory-lesson-mount');
    if (!L || !mount) return;
    // codex lessons render their own self-contained view (header + table)
    if (L.kind === 'codex' && typeof window.renderTheoryCodex === 'function') {
      window.renderTheoryCodex(L, mount, function () { reopen(L.id); });
      return;
    }
    mount.innerHTML = '';
    // header
    var head = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px">' +
      '<div><div class="tr-eyebrow">Αρχαία Ελληνικά · ' + esc(L.posLabel || 'Ρήμα') + ' · ' + esc(L.level || '') +
        (L.edited ? ' <span style="color:var(--gold);margin-left:8px">· επεξεργασμένο</span>' : '') + '</div>' +
        '<div style="margin-top:10px"><div class="tr-lemma" style="font-size:64px;line-height:1">' +
          esc(L.lemma[0]) + '<em>' + esc(L.lemma[1]) + '</em>' + esc(L.lemma[2]) + '</div>' +
          '<div class="tr-meaning" style="font-size:22px;margin-top:6px">' + esc(L.meaning) + '</div></div>' +
      '</div>';
    // admin edit button (wired in step 2 via window.openTheoryEditor)
    if (window.theoryIsCurator && window.theoryIsCurator() && typeof window.openTheoryEditor === 'function') {
      head += '<button class="tr-btn tr-btn--ghost" data-act="edit" style="flex-shrink:0">✎ Επεξεργασία</button>';
    }
    head += '</div>';
    mount.appendChild(elFrom(head));
    var editBtn = mount.querySelector('[data-act="edit"]');
    if (editBtn) editBtn.onclick = function () {
      window.openTheoryEditor(L, function () { reopen(L.id); });
    };

    // mode sub-nav
    var MODES = [['theory', 'Θεωρία'], ['matrix', 'Πίνακας'], ['cards', 'Κάρτες']];
    var seg = elFrom('<div class="seg" style="margin-top:26px">' + MODES.map(function (m) {
      return '<button class="seg-btn' + (S.mode === m[0] ? ' on' : '') + '" data-mode="' + m[0] + '">' + m[1] + '</button>';
    }).join('') + '</div>');
    seg.querySelectorAll('.seg-btn[data-mode]').forEach(function (b) {
      b.onclick = function () { S.mode = b.dataset.mode; S.ti = 0; S.study = false; S.rev = {}; renderLesson(); };
    });
    mount.appendChild(seg);
    mount.appendChild(elFrom('<hr class="tr-rule" style="margin:0 0 30px"/>'));

    // body
    var body;
    if (S.mode === 'matrix') body = viewMatrix(L, renderLesson);
    else if (S.mode === 'cards') body = viewCards(L);
    else body = viewTheory(L);
    mount.appendChild(body);
  }

  function reopen(id) { openTheoryLesson(id); }

  function closeTheoryLesson() {
    var ov = document.getElementById('theory-lesson-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openTheoryLesson(datasetId) {
    var ds = (window.GP_CONTENT && window.GP_CONTENT.find && window.GP_CONTENT.find(datasetId)) ||
             (typeof GP_DATASETS !== 'undefined' && GP_DATASETS.find(function (d) { return d.id === datasetId; })) || null;
    // dispatch authored Q&A / Parallel kinds to their own views
    if (ds && ds.kind === 'qa' && typeof window.openQALesson === 'function') { window.openQALesson(datasetId); return; }
    if (ds && ds.kind === 'parallel' && typeof window.openParallelLesson === 'function') { window.openParallelLesson(datasetId); return; }
    // tier gating (reuse nav's helper when present)
    if (ds && typeof _gpCanAccessTier === 'function' && !_gpCanAccessTier(ds.tier)) {
      if (typeof showToast === 'function') showToast('Απαιτείται συνδρομή για αυτό το υλικό', 'A subscription is required');
      return;
    }
    var lesson = (typeof buildLessonFromDataset === 'function') ? buildLessonFromDataset(datasetId) : null;
    if (!lesson) {                                  // no adapter → fall back to Mnemosyne
      if (typeof navToStudy === 'function') navToStudy(datasetId);
      return;
    }
    // refresh teacher overrides from Firestore, then (re)render (step 4 wiring)
    if (typeof window.loadTheoryOverride === 'function') {
      window.loadTheoryOverride(datasetId).then(function () {
        S.lesson = (typeof buildLessonFromDataset === 'function') ? buildLessonFromDataset(datasetId) : lesson;
        renderLesson();
      }).catch(function () {});
    }
    S.lesson = lesson; S.mode = 'theory'; S.ti = 0; S.study = false; S.rev = {};
    var ov = ensureOverlay();
    renderLesson();
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    var inner = ov.querySelector('.tr-inner');
    if (inner) inner.scrollTop = 0;
    ov.scrollTop = 0;
  }

  window.openTheoryLesson = openTheoryLesson;
  window.closeTheoryLesson = closeTheoryLesson;
})();
