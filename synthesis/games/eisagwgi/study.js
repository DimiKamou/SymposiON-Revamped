/* ════════════════════════════════════════════════════════════════════
   Εισαγωγή — study.js  (Αρχαία Γ΄ Λυκείου · Φιλοσοφικός Λόγος)

   A self-contained quiz + theory module (mounted full-screen in an iframe
   overlay by js/eisagwgi-launch.js). Reuses the grammar-game «Game Panel»
   level-picker look (.gpx-* classes from games/lyo/game.css) so selection
   feels identical to Λύω.

   Flow:  PICK (rail = Σωκράτης/Πλάτων/Αριστοτέλης, rows = θέματα, multi-select
          + «🎲 Όλη η Εισαγωγή»)  →  ΘΕΩΡΙΑ (textbook prose)  |  ΚΟΥΙΖ (closed
          questions: MC / Σωστό-Λάθος / Αντιστοίχιση / Συμπλήρωση).

   Data (window.EIS): topics[] (data/topics.js), theory{id} (data/theory-*.js),
   pools{id} (data/q-*.js). Progress in localStorage['eis_prog_<id>'].
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  var G = window.EIS = window.EIS || { topics: [], theory: {}, pools: {} };

  /* ── tiny DOM + text helpers ─────────────────────────────────────── */
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function norm(s) {
    s = String(s == null ? '' : s).toLowerCase();
    try { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (_) {}
    return s.replace(/ς/g, 'σ').replace(/[^a-zα-ω0-9]/g, '');
  }
  function matches(v, accept) { return (accept || []).some(function (a) { return norm(a) === norm(v); }); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  /* ── progress (localStorage) ─────────────────────────────────────── */
  function progGet(id) { try { return JSON.parse(localStorage.getItem('eis_prog_' + id)) || {}; } catch (_) { return {}; } }
  function progSet(id, best) {
    try { var p = progGet(id); p.completed = true; p.best = Math.max(p.best || 0, best); localStorage.setItem('eis_prog_' + id, JSON.stringify(p)); } catch (_) {}
  }
  function levelsFlat() { var out = []; G.topics.forEach(function (t) { (t.levels || []).forEach(function (l) { out.push({ level: l, group: t.group, accent: t.accent }); }); }); return out; }
  function poolFor(id) { return (G.pools[id] || []).slice(); }

  /* ── state ───────────────────────────────────────────────────────── */
  var S = { openGroup: null, sel: {}, quiz: null };
  var MOUNT = null;

  /* ═══════════════════ SCREEN 1 · PICKER (.gpx look) ═════════════════ */
  function ring(pct, done) {
    var r = 15.5, c = 2 * Math.PI * r, off = c * (1 - Math.max(0, Math.min(1, pct)));
    return '<svg class="gpx-ring" viewBox="0 0 36 36" width="34" height="34">' +
      '<circle cx="18" cy="18" r="' + r + '" fill="none" stroke="var(--gg-line)" stroke-width="3"></circle>' +
      '<circle cx="18" cy="18" r="' + r + '" fill="none" stroke="var(--gg-acc)" stroke-width="3" stroke-linecap="round" ' +
      'stroke-dasharray="' + c.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 18 18)"></circle>' +
      '<text x="18" y="22" text-anchor="middle" font-size="10" fill="var(--gg-ink)" font-family="Montserrat,sans-serif">' + (done ? '✓' : Math.round(pct * 100)) + '</text></svg>';
  }
  function groupStats(t) {
    var done = 0; (t.levels || []).forEach(function (l) { if (progGet(l.id).completed) done++; });
    return { done: done, total: (t.levels || []).length };
  }

  function renderPicker() {
    if (!S.openGroup) S.openGroup = (G.topics[0] || {}).group || null;
    var wrap = el('div', 'lyo-screen active');
    var pick = el('div', 'gpx-pick');

    // progress bar (overall levels completed)
    var flat = levelsFlat(), doneAll = flat.filter(function (x) { return progGet(x.level.id).completed; }).length;
    var prog = el('div', 'gpx-prog');
    prog.innerHTML = '<div class="gpx-bar"><i style="width:' + (flat.length ? Math.round(doneAll / flat.length * 100) : 0) + '%"></i></div>' +
      '<span>' + doneAll + '/' + flat.length + ' θέματα</span>';
    pick.appendChild(prog);

    var body = el('div', 'gpx-body');

    // ── rail (groups + Μείξη) ──
    var rail = el('div', 'gpx-rail');
    rail.appendChild(el('div', 'gpx-rail-lbl', 'Ενότητες'));
    G.topics.forEach(function (t) {
      var st = groupStats(t), pct = st.total ? st.done / st.total : 0;
      var it = el('button', 'gpx-railitem' + (S.openGroup === t.group ? ' on' : ''));
      it.innerHTML = '<div class="gpx-railbody"><span class="nm">' + esc(t.group) + '</span>' +
        '<span class="bl">' + st.done + '/' + st.total + ' ολοκλ.</span></div>' + ring(pct, st.done === st.total && st.total > 0);
      it.onclick = function () { S.openGroup = t.group; paint(); };
      rail.appendChild(it);
    });
    // Μείξη — start a quiz over the whole Εισαγωγή
    var mix = el('button', 'gpx-railitem gpx-extra');
    mix.innerHTML = '<div class="gpx-railbody"><span class="nm">🎲 Μείξη</span><span class="bl">Όλη η Εισαγωγή</span></div>';
    mix.onclick = function () { startQuiz(flat.map(function (x) { return x.level.id; }), 'Όλη η Εισαγωγή'); };
    rail.appendChild(mix);
    body.appendChild(rail);

    // ── detail (rows of the open group, multi-select) ──
    var detail = el('div', 'gpx-detail');
    var grp = G.topics.filter(function (t) { return t.group === S.openGroup; })[0] || G.topics[0];
    var hd = el('div', 'gpx-detail-hd');
    hd.innerHTML = '<h3>' + esc(grp.group) + '</h3><span class="meta">' + (grp.levels || []).length + ' θέματα</span>';
    detail.appendChild(hd);

    var rows = el('div', 'gpx-rows');
    (grp.levels || []).forEach(function (l, i) {
      var p = progGet(l.id), n = (G.pools[l.id] || []).length;
      var state = p.completed ? 's-done' : (p.best ? 's-active' : 's-new');
      var row = el('button', 'gpx-row ' + state + (S.sel[l.id] ? ' eq-picked' : ''));
      var chip = p.completed ? '✓ ' + (p.best || 0) + '%' : (n + ' ερωτ.');
      row.innerHTML = '<span class="gpx-num">' + (S.sel[l.id] ? '☑' : String(i + 1).padStart(2, '0')) + '</span>' +
        '<div class="gpx-rowbody"><span class="gpx-desc">' + esc(l.label) + (l.sub ? ' <em class="eq-sub">' + esc(l.sub) + '</em>' : '') + '</span>' +
        '<span class="eq-hint">' + esc(l.hint || '') + '</span></div>' +
        '<span class="gpx-score">' + chip + '</span>';
      row.onclick = function () { S.sel[l.id] = !S.sel[l.id]; paint(); };
      rows.appendChild(row);
    });
    detail.appendChild(rows);
    body.appendChild(detail);
    pick.appendChild(body);
    wrap.appendChild(pick);

    // ── sticky action bar (selection → theory / quiz) ──
    var selIds = Object.keys(S.sel).filter(function (k) { return S.sel[k]; });
    var bar = el('div', 'eq-selbar');
    var lbl = selIds.length ? (selIds.length + ' θέμα' + (selIds.length > 1 ? 'τα' : '') + ' επιλεγμένα') : 'Διάλεξε ένα ή περισσότερα θέματα (ή «Μείξη»)';
    bar.innerHTML = '<span class="eq-selcount">' + lbl + '</span>' +
      '<div class="eq-selacts">' +
      '<button class="eq-btn eq-btn-ghost" data-a="theory"' + (selIds.length === 1 ? '' : ' disabled') + '>📖 Θεωρία</button>' +
      '<button class="eq-btn" data-a="quiz"' + (selIds.length ? '' : ' disabled') + '>✎ Κουίζ →</button></div>';
    bar.querySelector('[data-a="quiz"]').onclick = function () {
      if (!selIds.length) return;
      var name = selIds.length === 1 ? labelOf(selIds[0]) : selIds.length + ' θέματα';
      startQuiz(selIds, name);
    };
    bar.querySelector('[data-a="theory"]').onclick = function () { if (selIds.length === 1) renderTheory(selIds[0]); };
    wrap.appendChild(bar);

    MOUNT.innerHTML = ''; MOUNT.appendChild(wrap);
  }

  function labelOf(id) { var f = levelsFlat().filter(function (x) { return x.level.id === id; })[0]; return f ? f.level.label : id; }
  function paint() { renderPicker(); }

  /* ═══════════════════ SCREEN 2 · ΘΕΩΡΙΑ ════════════════════════════ */
  function renderTheory(id) {
    var th = G.theory[id] || { title: labelOf(id), blocks: [] };
    var wrap = el('div', 'lyo-screen active');
    var card = el('div', 'lcard eq-theory');
    var h = '<button class="eq-back" data-a="back">← Ενότητες</button>' +
      '<div class="eq-eyebrow">Εισαγωγή · Φιλοσοφικός Λόγος</div>' +
      '<h1>' + esc(th.title || labelOf(id)) + '</h1>' +
      (th.src ? '<div class="eq-src">' + esc(th.src) + '</div>' : '');
    (th.blocks || []).forEach(function (b) {
      if (b.h) h += '<h3 class="eq-th-h">' + esc(b.h) + '</h3>';
      (b.paras || []).forEach(function (p) { h += '<p class="eq-th-p">' + esc(p) + '</p>'; });
    });
    if (!(th.blocks || []).length) h += '<p class="eq-th-p" style="opacity:.7">Η θεωρία για αυτό το θέμα προστίθεται σύντομα.</p>';
    h += '<div class="eq-th-foot"><button class="eq-btn" data-a="quiz">✎ Κουίζ σε αυτό το θέμα →</button></div>';
    card.innerHTML = h;
    card.querySelector('[data-a="back"]').onclick = renderPicker;
    card.querySelector('[data-a="quiz"]').onclick = function () { startQuiz([id], th.title || labelOf(id)); };
    wrap.appendChild(card);
    MOUNT.innerHTML = ''; MOUNT.appendChild(wrap);
    MOUNT.scrollTop = 0;
  }

  /* ═══════════════════ SCREEN 3 · ΚΟΥΙΖ ══════════════════════════════ */
  var SESSION = 12; // questions per run

  function startQuiz(ids, name) {
    var pool = [];
    ids.forEach(function (id) { poolFor(id).forEach(function (q) { pool.push(q); }); });
    pool = shuffle(pool);
    if (!pool.length) { renderQuizEmpty(name); return; }
    var queue = pool.slice(0, Math.min(SESSION, pool.length));
    S.quiz = { ids: ids, name: name, queue: queue, i: 0, correct: 0, answered: false };
    renderQuestion();
  }

  function renderQuizEmpty(name) {
    var wrap = el('div', 'lyo-screen active');
    var card = el('div', 'lcard');
    card.innerHTML = '<button class="eq-back" data-a="back">← Ενότητες</button>' +
      '<h1>' + esc(name || 'Κουίζ') + '</h1><p class="eq-th-p" style="opacity:.75">Δεν υπάρχουν ακόμη ερωτήσεις για αυτό το θέμα.</p>';
    card.querySelector('[data-a="back"]').onclick = renderPicker;
    wrap.appendChild(card); MOUNT.innerHTML = ''; MOUNT.appendChild(wrap);
  }

  function renderQuestion() {
    var Q = S.quiz, q = Q.queue[Q.i];
    Q.answered = false;
    var wrap = el('div', 'lyo-screen active');
    var card = el('div', 'lcard eq-quiz');
    // header: progress + score
    var head = el('div', 'eq-qhead');
    head.innerHTML = '<button class="eq-back" data-a="back">← Έξοδος</button>' +
      '<div class="eq-qprog"><div class="eq-qbar"><i style="width:' + Math.round(Q.i / Q.queue.length * 100) + '%"></i></div>' +
      '<span>' + (Q.i + 1) + ' / ' + Q.queue.length + '</span></div>' +
      '<div class="eq-qname">' + esc(Q.name) + '</div>';
    card.appendChild(head);

    card.appendChild(el('div', 'eq-qtype', typeLabel(q.type)));
    card.appendChild(el('div', 'eq-q', esc(q.q || '')));

    var bodyWrap = el('div', 'eq-body');
    var footer = el('div', 'eq-qfoot');
    var next = el('button', 'eq-btn', (Q.i + 1 < Q.queue.length) ? 'Επόμενη →' : 'Ολοκλήρωση ✓');
    next.disabled = true;
    next.onclick = function () { Q.i++; if (Q.i < Q.queue.length) renderQuestion(); else renderScore(); };

    function done(correct) {
      if (Q.answered) return; Q.answered = true;
      if (correct) Q.correct++;
      next.disabled = false;
      next.classList.add('eq-btn-go');
    }
    bodyWrap.appendChild(buildBody(q, done));
    card.appendChild(bodyWrap);
    footer.appendChild(next);
    card.appendChild(footer);

    wrap.appendChild(card);
    MOUNT.innerHTML = ''; MOUNT.appendChild(wrap); MOUNT.scrollTop = 0;
    card.querySelector('[data-a="back"]').onclick = function () { renderPicker(); };
  }

  function typeLabel(t) { return ({ mc: 'Πολλαπλή επιλογή', tf: 'Σωστό ή Λάθος', match: 'Αντιστοίχιση', fill: 'Συμπλήρωση' })[t] || 'Ερώτηση'; }

  function buildBody(q, done) {
    if (q.type === 'tf') return mcBody({ opts: ['Σωστό', 'Λάθος'], correct: q.answer ? 0 : 1, explain: q.explain }, done);
    if (q.type === 'match') return matchBody(q, done);
    if (q.type === 'fill') return fillBody(q, done);
    return mcBody(q, done); // 'mc' default
  }

  /* MC / TF ─ one click is final */
  function mcBody(x, done) {
    var holder = el('div');
    var opts = el('div', 'eq-opts');
    var explain = el('div', 'eq-explain'); explain.hidden = true;
    if (x.explain) explain.innerHTML = esc(x.explain);
    (x.opts || []).forEach(function (o, idx) {
      var b = el('button', 'eq-opt', '<span class="eq-mk">' + ('ΑΒΓΔΕ'[idx] || (idx + 1)) + '</span><span>' + esc(o) + '</span>');
      b.onclick = function () {
        $$('.eq-opt', opts).forEach(function (z) { z.disabled = true; });
        var ok = idx === x.correct;
        b.classList.add(ok ? 'correct' : 'incorrect');
        if (!ok) { var c = $$('.eq-opt', opts)[x.correct]; if (c) c.classList.add('correct'); }
        explain.hidden = false;
        done(ok);
      };
      opts.appendChild(b);
    });
    holder.appendChild(opts); holder.appendChild(explain);
    return holder;
  }

  /* Αντιστοίχιση ─ click left then right */
  function matchBody(x, done) {
    var holder = el('div', 'eq-match');
    var pairs = (x.pairs || []).map(function (p, i) { return { a: p[0], b: p[1], i: i }; });
    var left = el('div', 'eq-mcol'), right = el('div', 'eq-mcol');
    var sel = null, ok = 0;
    pairs.forEach(function (p) {
      var lb = el('button', 'eq-mi', '<span class="grk">' + esc(p.a) + '</span>'); lb.dataset.i = p.i;
      lb.onclick = function () { if (lb.classList.contains('done')) return; $$('.eq-mi', left).forEach(function (z) { z.classList.remove('sel'); }); lb.classList.add('sel'); sel = p.i; };
      left.appendChild(lb);
    });
    shuffle(pairs).forEach(function (p) {
      var rb = el('button', 'eq-mi', esc(p.b)); rb.dataset.i = p.i;
      rb.onclick = function () {
        if (rb.classList.contains('done') || sel == null) return;
        if (+rb.dataset.i === sel) {
          var lb = left.querySelector('.eq-mi[data-i="' + sel + '"]');
          if (lb) { lb.classList.add('done'); lb.classList.remove('sel'); }
          rb.classList.add('done'); ok++;
          if (ok === pairs.length) { holder.appendChild(el('div', 'eq-mscore', 'Όλα σωστά! ✓')); done(true); }
        } else { rb.classList.add('miss'); setTimeout(function () { rb.classList.remove('miss'); }, 320); }
        sel = null; $$('.eq-mi', left).forEach(function (z) { z.classList.remove('sel'); });
      };
      right.appendChild(rb);
    });
    var cols = el('div', 'eq-mcols'); cols.appendChild(left); cols.appendChild(right);
    holder.appendChild(cols);
    // let a partial give-up still advance
    var skip = el('button', 'eq-skip', 'Δεν ξέρω / Δες τις σωστές');
    skip.onclick = function () {
      $$('.eq-mi', holder).forEach(function (z) { z.classList.add('done'); });
      if (!holder.querySelector('.eq-mscore')) { holder.appendChild(el('div', 'eq-mscore eq-miss', 'Οι σωστές αντιστοιχίσεις σημειώθηκαν.')); done(false); }
      skip.remove();
    };
    holder.appendChild(skip);
    return holder;
  }

  /* Συμπλήρωση ─ text input(s), lenient matching */
  function fillBody(x, done) {
    var holder = el('div', 'eq-fill');
    var items = (x.items || [x]).map(function (it) {
      var row = el('div', 'eq-fi');
      var prompt = it.prompt ? esc(it.prompt).replace(/_{2,}/g, '<b class="eq-blank">____</b>') : (it.word ? '<span class="grk">' + esc(it.word) + '</span> →' : '');
      row.innerHTML = '<span class="eq-fp">' + prompt + '</span>';
      var inp = el('input', 'eq-inp'); inp.type = 'text'; inp.setAttribute('autocomplete', 'off');
      var acc = el('span', 'eq-acc'); acc.hidden = true;
      row.appendChild(inp); row.appendChild(acc);
      holder.appendChild(row);
      return { inp: inp, acc: acc, accept: it.accept || [] };
    });
    var check = el('button', 'eq-btn eq-btn-ghost eq-check', 'Έλεγχος');
    var score = el('div', 'eq-mscore'); score.hidden = true;
    if (x.explain) { var ex = el('div', 'eq-explain'); ex.hidden = true; ex.innerHTML = esc(x.explain); holder._ex = ex; }
    check.onclick = function () {
      var good = 0;
      items.forEach(function (o) {
        var ok = o.inp.value.trim() && matches(o.inp.value, o.accept);
        o.inp.classList.toggle('right', ok); o.inp.classList.toggle('wrong', !ok);
        if (ok) good++; else if (o.accept.length) { o.acc.hidden = false; o.acc.textContent = 'π.χ. ' + o.accept.slice(0, 2).join(', '); }
        o.inp.disabled = true;
      });
      score.hidden = false; score.textContent = 'Σωστά: ' + good + '/' + items.length;
      if (holder._ex) { holder._ex.hidden = false; }
      check.disabled = true;
      done(good === items.length);
    };
    holder.appendChild(check); holder.appendChild(score); if (holder._ex) holder.appendChild(holder._ex);
    return holder;
  }

  /* ── final score ─────────────────────────────────────────────────── */
  function renderScore() {
    var Q = S.quiz, pct = Math.round(Q.correct / Q.queue.length * 100);
    if (Q.ids.length === 1) progSet(Q.ids[0], pct);
    var msg = pct >= 90 ? 'Άριστα! ✦' : pct >= 70 ? 'Πολύ καλά!' : pct >= 50 ? 'Καλή προσπάθεια.' : 'Συνέχισε την εξάσκηση.';
    var wrap = el('div', 'lyo-screen active');
    var card = el('div', 'lcard eq-scorecard');
    card.innerHTML = '<div class="eq-eyebrow">' + esc(Q.name) + '</div>' +
      '<div class="eq-scorenum">' + pct + '%</div>' +
      '<div class="eq-scorel">' + Q.correct + ' / ' + Q.queue.length + ' σωστά · ' + msg + '</div>' +
      '<div class="eq-th-foot"><button class="eq-btn" data-a="again">↻ Ξανά</button>' +
      '<button class="eq-btn eq-btn-ghost" data-a="back">← Ενότητες</button></div>';
    card.querySelector('[data-a="again"]').onclick = function () { startQuiz(Q.ids, Q.name); };
    card.querySelector('[data-a="back"]').onclick = renderPicker;
    wrap.appendChild(card); MOUNT.innerHTML = ''; MOUNT.appendChild(wrap); MOUNT.scrollTop = 0;
  }

  /* ── boot ────────────────────────────────────────────────────────── */
  function boot() {
    MOUNT = $('#eis-wrap');
    if (!MOUNT) return;
    if (!(G.topics || []).length) { MOUNT.innerHTML = '<div class="lyo-screen active"><div class="lcard"><h1>Εισαγωγή</h1><p>Δεν φορτώθηκαν δεδομένα.</p></div></div>'; return; }
    renderPicker();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
  window.EIS.boot = boot;
})();
