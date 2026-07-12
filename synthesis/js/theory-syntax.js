/* ════════════════════════════════════════════════════════════════════
   theory-syntax.js — the Συντακτικό lesson engine (kind:'syntax').
   Renders the built-in SYNTAX_LESSONS (theory-syntax-data.js) inside the
   shared .tr-overlay museum shell, with a .seg switcher:

     • Θεωρία  — stat pills + intro + worked example (colour-chunked)
     • Άσκηση  — the deterministic exercises, graded CLIENT-SIDE against
                 an accept-SET (no Cloud Functions, works fully offline)
     • Εξέταση — free analysis → gradeSyntaxParse callable (categorical,
                 NO score bar); DEGRADES GRACEFULLY when undeployed.

   Exercise types: discriminator (hero) · role-canvas (+phantom) ·
   clause-classifier · choice (governance-cloze / negation-predict / MCQ).

   Entry: window.openSyntaxLesson(idOrDataset). Dispatched from
   theory-lesson.js openTheoryLesson() when ds.kind === 'syntax'.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function raw(s) { return String(s == null ? '' : s); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  // <i>…</i> → terra emphasis (matches theory convention), <b> kept
  function fmt(s) { return raw(s).replace(/<i>/g, '<em style="color:var(--terra);font-style:normal">').replace(/<\/i>/g, '</em>'); }
  function el(html) { var d = document.createElement('div'); d.innerHTML = String(html).trim(); return d.firstElementChild; }
  function callable(n) { try { return firebase.functions().httpsCallable(n); } catch (_) { return null; } }
  function toast(m) { if (typeof showToast === 'function') showToast(m, m); }
  function isCurator() { return (typeof window.theoryIsCurator === 'function') && window.theoryIsCurator(); }

  // ── mastery hook: record the FIRST outcome of any pair-bearing exercise ──
  function recordPair(ex, ok) { try { if (ex && ex.pair && window.SyntaxMastery && window.SyntaxMastery.record) window.SyntaxMastery.record(ex.pair, ok); } catch (_) {} }
  function observeOutcome(node, ex) {
    if (!node || !ex || !ex.pair || typeof MutationObserver === 'undefined' || !window.SyntaxMastery) return;
    var done = false;
    function check() {
      if (done) return;
      if (node.querySelector('.syx-opt.ok, .syx-lock.show, .syx-reveal.show')) { done = true; recordPair(ex, true); obs.disconnect(); }
      else if (node.querySelector('.syx-opt.no')) { done = true; recordPair(ex, false); obs.disconnect(); }
    }
    var obs = new MutationObserver(check);
    obs.observe(node, { subtree: true, attributes: true, attributeFilter: ['class'], childList: true });
  }

  function _resolveId(idOrDs) {
    if (idOrDs && typeof idOrDs === 'object') return idOrDs.id || '';
    return String(idOrDs || '');
  }

  var S = { lesson: null, mode: 'theory' };

  /* ───────────────────────── Θεωρία ───────────────────────── */
  // rich-theory helpers: reference table + worked example list
  function thTable(t) {
    if (!t || !t.rows) return '';
    var head = (t.cols && t.cols.length) ? '<thead><tr>' + t.cols.map(function (c) { return '<th>' + fmt(c) + '</th>'; }).join('') + '</tr></thead>' : '';
    var body = t.rows.map(function (r) {
      return '<tr>' + r.map(function (cell, i) { return (i === 0 && r.length > 1) ? '<th class="rh">' + fmt(cell) + '</th>' : '<td>' + fmt(cell) + '</td>'; }).join('') + '</tr>';
    }).join('');
    return (t.title ? '<div class="syx-th-tt">' + esc(t.title) + '</div>' : '') +
      '<div class="syx-th-tablewrap"><table class="syx-th-table">' + head + '<tbody>' + body + '</tbody></table></div>';
  }
  function thExamples(exs) {
    if (!exs || !exs.length) return '';
    return '<div class="syx-th-exs">' + exs.map(function (e) {
      return '<div class="syx-th-ex"><span class="g">' + fmt(e.gr) + '</span>' + (e.an ? '<span class="an">' + fmt(e.an) + '</span>' : '') + '</div>';
    }).join('') + '</div>';
  }

  function viewTheory(L) {
    var h = '<div>';
    // stat pills (reuse .tr-stat)
    if (L.stats && L.stats.length) {
      h += '<div style="display:flex;gap:12px;flex-wrap:wrap">' + L.stats.map(function (s) {
        return '<div class="tr-stat"><div class="k">' + esc(s[0]) + '</div><div class="v">' + esc(s[1]) + '</div></div>';
      }).join('') + '</div>';
    }
    // intro
    h += '<div style="margin-top:32px"><div class="tr-kicker">Τι είναι</div>' +
      '<div class="tr-body syx-prose" style="margin-top:12px;max-width:820px">' + fmt(L.intro) + '</div></div>';
    // theory blocks — rich (prose + tables + examples + notes)
    (L.theory || []).forEach(function (b) {
      h += '<div class="syx-th" style="margin-top:32px"><h2 class="tr-h2" style="font-size:23px">' + esc(b.h) + '</h2>' +
        '<hr class="tr-rule tr-rule--left" style="margin:10px 0 16px;max-width:120px"/>';
      if (b.body) h += '<div class="tr-body syx-prose" style="font-size:17px;max-width:820px">' + fmt(b.body) + '</div>';
      if (b.table) h += thTable(b.table);
      if (b.tables) b.tables.forEach(function (t) { h += thTable(t); });
      if (b.examples) h += thExamples(b.examples);
      if (b.note) h += '<div class="tt-note" style="margin-top:16px;max-width:820px"><span class="ic">✶</span><p>' + fmt(b.note) + '</p></div>';
      h += '</div>';
    });
    // worked example — colour-chunked constituents
    if (L.worked) {
      h += '<div style="margin-top:36px;border-left:2px solid var(--terra);padding-left:22px">' +
        '<div class="tr-kicker" style="color:var(--terra)">Δουλεμένο παράδειγμα</div>' +
        '<div class="syx-worked" style="margin-top:14px">' +
        L.worked.gr.map(function (c) {
          return '<span class="syx-chunk ' + esc(c.fam) + '" style="color:var(--syx-h);border-bottom-color:var(--syx-h)">' +
            esc(c.w) + '<span class="lab" style="color:var(--syx-h)">' + esc(c.role) + '</span></span>';
        }).join(' ') + '</div>';
      if (L.worked.note) h += '<div class="tt-note" style="margin-top:20px;max-width:720px"><span class="ic">✶</span><p>' + fmt(L.worked.note) + '</p></div>';
      h += '</div>';
    }
    // source credit
    h += '<div class="syx-credit" style="margin-top:46px;padding-top:16px;border-top:1px solid var(--line-soft);font-family:var(--f-mono);font-size:11px;letter-spacing:0.02em;color:var(--stone);line-height:1.65;max-width:820px">' +
      'Η θεωρία βασίζεται στο «Συντακτικό της Αρχαίας Ελληνικής» — ' +
      '<a href="https://users.sch.gr/ipap/Ellinikos%20Politismos/Yliko/Theoria%20arxaia/Syntaktiko%20arxaias%20ellinikis.htm" target="_blank" rel="noopener" style="color:var(--gold);text-decoration:underline">users.sch.gr/ipap · Ελληνικός Πολιτισμός</a>' +
      ', με πρόσθετα παραδείγματα και διαδραστική επεξεργασία.</div>';
    h += '</div>';
    return el(h);
  }

  /* ───────────────────────── Άσκηση ───────────────────────── */
  // build a single exercise card (label + question + interaction + mastery hook)
  function exerciseCard(ex, label) {
    var card = document.createElement('div');
    card.className = 'syx-ex'; card.style.marginTop = '22px';
    card.appendChild(el('<div class="syx-ex-k">' + esc(label) + ' · ' + _exKind(ex.type) + '</div>'));
    if (ex.q) card.appendChild(el('<div class="syx-ex-q">' + fmt(ex.q) + '</div>'));
    var body = renderExercise(ex);
    if (body) { card.appendChild(body); observeOutcome(body, ex); }
    return card;
  }

  function viewPractice(L) {
    var wrap = document.createElement('div');
    var exs = L.exercises || [];
    var bank = L.bank || [];
    var total = exs.length + bank.length;
    if (!total) { wrap.innerHTML = '<div class="tt-empty">Δεν υπάρχουν ασκήσεις ακόμη.</div>'; return wrap; }
    wrap.appendChild(el('<div style="margin-bottom:4px"><div class="tr-kicker">Άσκηση · ' + total + ' παραδείγματα</div>' +
      '<p class="tr-body" style="font-size:17px;line-height:1.65;margin-top:12px;max-width:740px">Κάθε άσκηση διορθώνεται <b>τοπικά</b> με την επεξήγηση του κριτηρίου. Πάτησε «<b>Δημιούργησε άσκηση</b>» για όσα νέα παραδείγματα θέλεις.</p></div>'));
    exs.forEach(function (ex, i) { wrap.appendChild(exerciseCard(ex, 'Άσκηση ' + String(i + 1).padStart(2, '0'))); });

    // ── generate-more area (serves the bank now; AI hook for later) ──
    var slot = document.createElement('div'); wrap.appendChild(slot);
    var ctrl = el('<div style="margin-top:30px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;border-top:1px solid var(--line-soft);padding-top:24px">' +
      '<button class="tr-btn tr-btn--terra" data-gen>✦ Δημιούργησε άσκηση</button>' +
      '<span class="tr-cap" data-genstat style="text-transform:none;letter-spacing:0.02em"></span></div>');
    wrap.appendChild(ctrl);
    var genCount = 0, busy = false;
    var btn = ctrl.querySelector('[data-gen]'), stat = ctrl.querySelector('[data-genstat]');
    stat.textContent = bank.length ? ('τράπεζα · ' + bank.length + ' επιπλέον παραδείγματα') : 'αυτόματη δημιουργία (AI) · χρειάζεται δημοσίευση';
    function serveFromBank() {
      if (!bank.length) { stat.textContent = 'Η αυτόματη δημιουργία (AI) ενεργοποιείται με την επόμενη δημοσίευση.'; return; }
      var ex = bank[genCount % bank.length]; genCount++;
      var card = exerciseCard(ex, 'Νέα άσκηση ' + String(genCount).padStart(2, '0'));
      slot.appendChild(card); try { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
      stat.textContent = (genCount >= bank.length) ? ('είδες και τα ' + bank.length + ' — συνεχίζουν να επαναλαμβάνονται') : ('τράπεζα · ' + genCount + ' / ' + bank.length);
    }
    btn.onclick = function () {
      if (busy) return;
      if (!window.SYNTAX_AI_GENERATE) { serveFromBank(); return; }
      var fn = callable('generateSyntaxExercise');
      if (!fn) { serveFromBank(); return; }
      busy = true; btn.innerHTML = '<span class="tt-spin"></span> Δημιουργία…';
      fn({ lessonId: L.id, concept: L.subtitle }).then(function (r) {
        busy = false; btn.innerHTML = '✦ Δημιούργησε άσκηση';
        var ex = r && r.data && r.data.exercise;
        if (ex) { genCount++; var card = exerciseCard(ex, 'Νέα άσκηση (AI) ' + genCount); slot.appendChild(card); try { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {} }
        else serveFromBank();
      }).catch(function () { busy = false; btn.innerHTML = '✦ Δημιούργησε άσκηση'; serveFromBank(); });
    };
    return wrap;
  }
  function _exKind(t) {
    return { 'discriminator': 'Διαγνωστικός διαχωριστής', 'role-canvas': 'Συντακτικός καμβάς',
      'clause-classifier': 'Ταξινομητής προτάσεων', 'choice': 'Επιλογή με αιτιολόγηση',
      'error-spot': 'Εντοπισμός λάθους', 'transformation': 'Μετασχηματισμός' }[t] || 'Άσκηση';
  }

  function renderExercise(ex) {
    if (ex.type === 'discriminator') return renderDiscriminator(ex);
    if (ex.type === 'role-canvas') return renderRoleCanvas(ex);
    if (ex.type === 'clause-classifier') return renderClauseClassifier(ex);
    if (ex.type === 'choice') return renderChoice(ex);
    if (ex.type === 'error-spot') return renderErrorSpot(ex);
    if (ex.type === 'transformation') return renderTransformation(ex);
    return el('<div class="tt-empty">—</div>');
  }

  /* ── discriminator (hero) ─────────────────────────────────── */
  function renderDiscriminator(ex) {
    var box = document.createElement('div');
    var sub = ex.subtitle ? '<div class="syx-sub" style="margin:2px 0 4px">' + esc(ex.subtitle) + '</div>' : '';
    var cardsH = ex.cards.map(function (c, ci) {
      var sent = c.tokens.map(function (tk, ti) {
        var cls = 'syx-w' + (tk.tgt ? ' syx-tgt' : '');
        return '<span class="' + cls + '" data-ci="' + ci + '" data-ti="' + ti + '" data-syn="' + (tk.syn ? 1 : 0) + '">' + esc(tk.w) + '</span>';
      }).join(' ') + esc(c.tail || '');
      return '<div class="syx-dcard" data-card="' + ci + '" data-hassyn="' + (c.hasSyn ? 1 : 0) + '">' +
        '<div class="syx-dcard-h">' + esc(c.h) + '</div>' +
        '<div class="syx-sent">' + sent + '</div>' +
        '<div class="syx-prompt">' + esc(ex.subtitle || 'Τάπ το συνδετικό ρήμα, ή δήλωσε ότι δεν υπάρχει.') + '</div>' +
        '<button class="syx-nb">Δεν υπάρχει συνδετικό</button>' +
        '<div class="syx-fb bad"></div>' +
        '<div class="syx-lock ' + esc(c.role.fam) + '"></div>' +
        '<div class="syx-reveal" data-cardreveal style="border:0;padding:0;margin-top:10px;font-size:14px;font-style:italic;color:var(--stone)"></div>' +
        '</div>';
    }).join('');
    box.innerHTML = sub + '<div class="syx-cards">' + cardsH + '</div>' +
      '<div class="syx-reveal">' + fmt(ex.reveal) + '</div>';

    var done = {};
    function maybeReveal() {
      if (ex.cards.every(function (_, i) { return done[i]; })) {
        var rv = box.querySelector('.syx-cards ~ .syx-reveal'); if (rv) rv.classList.add('show');
      }
    }
    function win(card) {
      var ci = +card.dataset.card; if (done[ci]) return; done[ci] = true;
      var c = ex.cards[ci];
      var tgt = card.querySelector('.syx-tgt');
      if (tgt) { tgt.classList.add(c.role.fam); tgt.style.color = 'var(--syx-h)'; tgt.style.borderBottom = '1px solid var(--syx-h)'; }
      if (c.hasSyn) { var syn = card.querySelector('[data-syn="1"]'); if (syn) syn.classList.add('syn-on'); }
      card.querySelector('.syx-prompt').style.display = 'none';
      card.querySelector('.syx-nb').style.display = 'none';
      card.querySelector('.syx-fb').textContent = '';
      var lock = card.querySelector('.syx-lock');
      lock.innerHTML = '<span style="font-weight:600">✓</span> ' + esc(c.role.t);
      lock.classList.add('show');
      var cr = card.querySelector('[data-cardreveal]'); if (cr) cr.innerHTML = esc(c.reason);
      maybeReveal();
    }
    function miss(card, msg) {
      var fb = card.querySelector('.syx-fb'); fb.textContent = msg;
      var t = card.querySelector('.syx-tgt'); if (t) { t.classList.remove('syx-shk'); void t.offsetWidth; t.classList.add('syx-shk'); }
    }
    box.querySelectorAll('.syx-w').forEach(function (w) {
      w.onclick = function () {
        var card = w.closest('.syx-dcard'); if (done[+card.dataset.card]) return;
        if (w.dataset.syn === '1') win(card);
        else miss(card, (ex.missWord || 'Το «{w}» δεν είναι συνδετικό ρήμα.').replace('{w}', w.textContent.trim()));
      };
    });
    box.querySelectorAll('.syx-nb').forEach(function (b) {
      b.onclick = function () {
        var card = b.closest('.syx-dcard'); if (done[+card.dataset.card]) return;
        if (card.dataset.hassyn === '0') win(card);
        else miss(card, ex.missNone || 'Υπάρχει συνδετικό ρήμα.');
      };
    });
    return box;
  }

  /* ── role-canvas (+ phantom εννοούμενο) ───────────────────── */
  function renderRoleCanvas(ex) {
    var box = document.createElement('div');
    var toksH = ex.tokens.map(function (tk) {
      return '<div class="syx-tok" data-id="' + esc(tk.id) + '"><span class="syx-pill">' + esc(tk.w) + '</span><span class="syx-rlab"></span></div>';
    }).join('');
    var addH = ex.phantom ? '<button class="syx-add" data-add>＋ ' + esc(ex.phantom.addLabel || 'εννοούμενος όρος') + '</button>' : '';
    var palH = ex.palette.map(function (p) {
      return '<span class="syx-rchip ' + esc(p.fam) + '" data-r="' + esc(p.r) + '"><span class="dot"></span>' + esc(_cap(p.r)) + '</span>';
    }).join('');
    box.innerHTML =
      '<div class="syx-canvas" data-canvas>' + toksH + addH + '</div>' +
      '<div class="syx-palette">' + palH + '</div>' +
      '<div class="syx-hint">' + esc(ex.hint || 'Διάλεξε μια λέξη, μετά τον ρόλο της.') + '</div>' +
      '<div class="syx-reveal">' + fmt(ex.reveal) + '</div>';

    var canvas = box.querySelector('[data-canvas]');
    var hint = box.querySelector('.syx-hint');
    var reveal = box.querySelector('.syx-reveal');
    var palette = box.querySelectorAll('.syx-rchip');
    var byId = {}; ex.tokens.forEach(function (t) { byId[t.id] = t; });
    if (ex.phantom) byId[ex.phantom.id] = ex.phantom;
    var total = ex.tokens.length + (ex.phantom ? 1 : 0);
    var done = {}, sel = null, ghostAdded = false;

    function palLive(on) { palette.forEach(function (c) { c.classList.toggle('live', on); }); }
    function bind(tok) { tok.onclick = function () { select(tok); }; }
    function select(tok) {
      if (tok.classList.contains('locked')) return;
      if (sel) sel.classList.remove('sel');
      sel = tok; tok.classList.add('sel'); palLive(true);
      hint.textContent = 'Τώρα διάλεξε τον ρόλο του «' + tok.querySelector('.syx-pill').textContent.trim() + '».';
    }
    canvas.querySelectorAll('.syx-tok').forEach(bind);
    var addBtn = box.querySelector('[data-add]');
    if (addBtn) addBtn.onclick = function () {
      if (ghostAdded) return; ghostAdded = true; addBtn.style.display = 'none';
      var g = el('<div class="syx-tok syx-ghost" data-id="' + esc(ex.phantom.id) + '"><span class="syx-pill">' + esc(ex.phantom.w) + '</span><span class="syx-rlab"></span></div>');
      canvas.appendChild(g); bind(g); select(g);
      hint.textContent = 'Πρόσθεσες τον σιωπηρό όρο «' + ex.phantom.w + '». Τι ρόλο έχει;';
    };
    palette.forEach(function (chip) {
      chip.onclick = function () {
        if (!sel) return;
        var id = sel.dataset.id, want = byId[id], role = chip.dataset.r;
        if (want && role === want.role) {
          done[id] = true;
          sel.classList.add('locked', want.fam);
          sel.querySelector('.syx-pill');
          sel.querySelector('.syx-rlab').textContent = want.lab || role.toLowerCase();
          sel.classList.remove('sel'); sel.onclick = null; sel = null; palLive(false);
          var n = Object.keys(done).length;
          if (n >= total) { reveal.classList.add('show'); hint.textContent = 'Όλοι οι όροι σωστά — μαζί με τον σιωπηρό.'; }
          else if (ex.phantom && !ghostAdded && done[ex.tokens[0].id] !== undefined && everyVisibleDone()) {
            hint.textContent = 'Μένει το υποκείμενο… αλλά δεν υπάρχει λέξη. Πάτησε «＋ εννοούμενος όρος».';
          } else hint.textContent = 'Σωστά. Συνέχισε με τον επόμενο όρο.';
        } else {
          hint.textContent = 'Όχι ακόμη — ρώτα «ποιος;» για το υποκείμενο, «ποιον / τι;» για το αντικείμενο.';
        }
      };
    });
    function everyVisibleDone() { return ex.tokens.every(function (t) { return done[t.id]; }); }
    return box;
  }
  function _cap(r) { return r.charAt(0) + r.slice(1).toLowerCase(); }

  /* ── clause-classifier ────────────────────────────────────── */
  function renderClauseClassifier(ex) {
    var box = document.createElement('div');
    var period = ex.clauses.map(function (c) {
      return '<span class="syx-cl syx-cl-' + (c.cls === 'main' ? 'main' : 'sub') + '">' + raw(c.txt) + '</span>';
    }).join(', ') + '.';
    var optsH = ex.options.map(function (o) { return '<span class="syx-opt" data-r="' + esc(o.r) + '">' + esc(o.t) + '</span>'; }).join('');
    box.innerHTML =
      '<div class="syx-period">' + period + '</div>' +
      (ex.diag ? '<div class="syx-diag">' + fmt(ex.diag) + '</div>' : '') +
      '<div class="syx-opts">' + optsH + '</div>' +
      '<div class="syx-fb"></div>' +
      '<div class="syx-reveal">' + fmt(ex.reveal) + '</div>';
    var locked = false, fb = box.querySelector('.syx-fb'), reveal = box.querySelector('.syx-reveal');
    box.querySelectorAll('.syx-opt').forEach(function (b) {
      b.onclick = function () {
        if (locked) return; var r = b.dataset.r, o = ex.options.filter(function (x) { return x.r === r; })[0];
        if (o && o.ok) {
          locked = true; b.classList.add('ok');
          fb.className = 'syx-fb good'; fb.innerHTML = '✓ Σωστά — και για τον σωστό λόγο.';
          reveal.classList.add('show');
        } else {
          b.classList.add('no');
          fb.className = 'syx-fb bad'; fb.textContent = (ex.miss && (ex.miss[r] || ex.miss._)) || 'Όχι — ξανακοίτα το κριτήριο.';
        }
      };
    });
    return box;
  }

  /* ── choice (cloze / negation-predict / MCQ) ──────────────── */
  function renderChoice(ex) {
    var box = document.createElement('div');
    var optsH = ex.options.map(function (o) { return '<span class="syx-opt" data-t="' + esc(o.t) + '">' + esc(o.t) + '</span>'; }).join('');
    box.innerHTML =
      (ex.stem ? '<div class="syx-period" style="font-size:21px;margin:6px 0 4px">' + fmt(ex.stem) + '</div>' : '') +
      '<div class="syx-opts">' + optsH + '</div>' +
      '<div class="syx-fb"></div>' +
      '<div class="syx-reveal">' + fmt(ex.reason) + '</div>';
    var locked = false, fb = box.querySelector('.syx-fb'), reveal = box.querySelector('.syx-reveal');
    box.querySelectorAll('.syx-opt').forEach(function (b) {
      b.onclick = function () {
        if (locked) return; var o = ex.options.filter(function (x) { return x.t === b.dataset.t; })[0];
        if (o && o.ok) { locked = true; b.classList.add('ok'); fb.className = 'syx-fb good'; fb.innerHTML = '✓ Σωστά.'; reveal.classList.add('show'); }
        else { b.classList.add('no'); fb.className = 'syx-fb bad'; fb.textContent = 'Όχι — δοκίμασε ξανά.'; }
      };
    });
    return box;
  }

  /* ── error-spot (tap the offender, then name the violated rule) ── */
  function renderErrorSpot(ex) {
    var box = document.createElement('div');
    var toks = ex.tokens.map(function (tk) { return '<span class="syx-w" data-id="' + esc(tk.id) + '">' + esc(tk.w) + '</span>'; }).join(' ') + esc(ex.tail || '.');
    box.innerHTML =
      '<div class="syx-sent" style="margin-top:6px">' + toks + '</div>' +
      '<button class="syx-nb" data-none>Δεν υπάρχει λάθος (σωστή)</button>' +
      '<div class="syx-hint" data-step>Τάπ τη λέξη που φταίει — μετά ονόμασε τον κανόνα.</div>' +
      '<div data-rules class="syx-opts" style="display:none"></div>' +
      '<div class="syx-fb"></div>' +
      '<div class="syx-reveal">' + fmt(ex.reveal) + '</div>';
    var locked = false, found = false;
    var hint = box.querySelector('[data-step]'), rulesWrap = box.querySelector('[data-rules]');
    var fb = box.querySelector('.syx-fb'), reveal = box.querySelector('.syx-reveal');
    function shake(n) { n.classList.remove('syx-shk'); void n.offsetWidth; n.classList.add('syx-shk'); }
    function win(msg) { locked = true; fb.className = 'syx-fb good'; fb.innerHTML = msg || '✓ Σωστά.'; reveal.classList.add('show'); }
    function showRules() {
      rulesWrap.style.display = 'flex';
      rulesWrap.innerHTML = ex.rules.map(function (r, i) { return '<span class="syx-opt" data-ri="' + i + '">' + esc(r.r) + '</span>'; }).join('');
      rulesWrap.querySelectorAll('[data-ri]').forEach(function (b) {
        b.onclick = function () {
          if (locked) return; var r = ex.rules[+b.dataset.ri];
          if (r.ok) { b.classList.add('ok'); win('✓ Σωστά — και ο κανόνας σωστός.'); }
          else { b.classList.add('no'); fb.className = 'syx-fb bad'; fb.textContent = 'Ο κανόνας δεν ταιριάζει — ξανασκέψου.'; }
        };
      });
    }
    box.querySelectorAll('.syx-w').forEach(function (w) {
      w.onclick = function () {
        if (locked || found) return;
        if (!ex.hasError) { fb.className = 'syx-fb bad'; fb.textContent = 'Η πρόταση είναι σωστή — δεν υπάρχει λάθος εδώ.'; shake(w); return; }
        if ((ex.errorTokens || []).indexOf(w.dataset.id) >= 0) {
          found = true; w.style.color = 'var(--terra)'; w.style.borderBottom = '1px solid var(--terra)';
          hint.textContent = 'Σωστός εντοπισμός. Τώρα: ποιος κανόνας παραβιάζεται;'; showRules();
        } else { fb.className = 'syx-fb bad'; fb.textContent = 'Όχι εκεί — το λάθος είναι αλλού.'; shake(w); }
      };
    });
    box.querySelector('[data-none]').onclick = function () {
      if (locked || found) return;
      if (!ex.hasError) { this.style.borderColor = 'var(--sage)'; this.style.color = 'var(--sage)'; win('✓ Σωστά — η πρόταση δεν έχει λάθος.'); }
      else { fb.className = 'syx-fb bad'; fb.textContent = 'Υπάρχει λάθος — βρες τη λέξη που φταίει.'; }
    };
    return box;
  }

  /* ── transformation (guided chain — diagnose gates the result) ── */
  function renderTransformation(ex) {
    var box = document.createElement('div');
    var stepsH = ex.steps.map(function (s, i) {
      return '<div class="syx-ex" data-tstep="' + i + '" style="margin-top:12px;padding:14px 16px' + (i > 0 ? ';opacity:.4;pointer-events:none' : '') + '">' +
        '<div class="syx-ex-k">Βήμα ' + (i + 1) + '</div>' +
        '<div class="syx-ex-q" style="font-size:16px">' + fmt(s.q) + '</div>' +
        '<div class="syx-opts">' + s.options.map(function (o, oi) { return '<span class="syx-opt" data-oi="' + oi + '">' + esc(o.t) + '</span>'; }).join('') + '</div>' +
        '<div class="syx-fb"></div>' +
        (s.reason ? '<div class="syx-reveal" style="font-size:14px">' + fmt(s.reason) + '</div>' : '') + '</div>';
    }).join('');
    box.innerHTML =
      '<div class="tt-pane"><div class="tt-pane-h"><span class="lab">Αφετηρία</span></div>' +
      '<div class="tt-src"><div class="tt-srcline"><span class="n">→</span><span class="g">' + esc(ex.source) + '</span></div></div></div>' +
      stepsH +
      (ex.trap ? '<div class="tt-note" style="margin-top:14px"><span class="ic">✶</span><p>' + fmt(ex.trap) + '</p></div>' : '');
    var stepEls = box.querySelectorAll('[data-tstep]');
    stepEls.forEach(function (stepEl, i) {
      var s = ex.steps[i], locked = false;
      var fb = stepEl.querySelector('.syx-fb'), reveal = stepEl.querySelector('.syx-reveal');
      stepEl.querySelectorAll('.syx-opt').forEach(function (b) {
        b.onclick = function () {
          if (locked) return; var o = s.options[+b.dataset.oi];
          if (o.ok) {
            locked = true; b.classList.add('ok'); fb.className = 'syx-fb good'; fb.innerHTML = '✓';
            if (reveal) reveal.classList.add('show');
            var nxt = stepEls[i + 1]; if (nxt) { nxt.style.opacity = ''; nxt.style.pointerEvents = ''; }
          } else { b.classList.add('no'); fb.className = 'syx-fb bad'; fb.textContent = 'Όχι — δες ξανά.'; }
        };
      });
    });
    return box;
  }

  /* ───────────────────────── Εξέταση (AI) ─────────────────── */
  function viewExam(L) {
    var bankE = (L.examBank && L.examBank.length) ? L.examBank.slice() : [];
    if (L.exam && L.exam.sentence) bankE.unshift(L.exam);
    if (!bankE.length) bankE = [{ sentence: '—', placeholder: 'Γράψε την ανάλυσή σου…' }];
    var idx = 0, custom = null;
    var wrap = document.createElement('div');
    function cur() { return custom || bankE[((idx % bankE.length) + bankE.length) % bankE.length]; }
    function degradeMsg() {
      return 'Ο βοηθός AI της Εξέτασης ενεργοποιείται με την επόμενη δημοσίευση (Cloud Function <code>gradeSyntaxParse</code>). ' +
        'Οι ασκήσεις στην «Άσκηση» λειτουργούν πλήρως τοπικά.';
    }
    function draw() {
      var ex = cur();
      var pos = custom ? 'δικό σου κείμενο' : (((idx % bankE.length) + bankE.length) % bankE.length + 1) + ' / ' + bankE.length;
      wrap.innerHTML =
        '<div class="tt-note" style="max-width:760px"><span class="ic">✶</span><p>Γράψε <b style="color:var(--bone)">πλήρη συντακτική ανάλυση</b> της πρότασης. Ο βοηθός κρίνει <b style="color:var(--bone)">ανά όρο</b>, όχι με βαθμό. Άλλαξε πρόταση ή βάλε <b style="color:var(--bone)">δικό σου αρχαίο κείμενο</b>.</p></div>' +
        '<div class="tt-pane" style="margin-top:18px"><div class="tt-pane-h"><span class="lab">Το κείμενο</span><span class="tr-cap">' + esc(pos) + '</span></div>' +
          '<div class="tt-src"><div class="tt-srcline"><span class="n">→</span><span class="g">' + esc(ex.sentence || '') + '</span></div></div></div>' +
        '<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">' +
          '<button class="tr-btn tr-btn--ghost" data-next>↻ Νέα πρόταση</button>' +
          '<button class="tr-btn tr-btn--ghost" data-own>＋ Δικό μου κείμενο</button></div>' +
        '<div data-ownbox style="display:none;margin-top:16px;border:1px solid var(--line);border-radius:8px;padding:16px;background:color-mix(in srgb,var(--cream) 2%,transparent)">' +
          '<label class="tr-cap" style="display:block;margin-bottom:9px;text-transform:none;letter-spacing:0.02em">Επικόλλησε ένα αρχαίο κείμενο — θα χωριστεί σε προτάσεις για ανάλυση</label>' +
          '<textarea class="tt-input" data-owntext placeholder="π.χ. ένα απόσπασμα Ξενοφώντα ή Λυσία…" style="min-height:84px;font-size:18px"></textarea>' +
          '<div class="tt-actions"><button class="tr-btn tr-btn--ghost" data-ownload>Χώρισε σε προτάσεις</button></div>' +
          '<div data-ownlist style="display:flex;flex-direction:column;gap:7px;margin-top:8px"></div></div>' +
        '<div style="margin-top:20px"><textarea class="tt-input" data-att placeholder="' + esc(ex.placeholder || 'Γράψε την ανάλυσή σου…') + '"></textarea>' +
          '<div class="tt-actions"><button class="tr-btn tr-btn--terra" data-check disabled>✓ Έλεγξε</button></div>' +
          '<div class="tt-err" data-err style="display:none"></div></div>' +
        '<div data-fb></div>';
      wire();
    }
    function wire() {
      var ta = wrap.querySelector('[data-att]'), btn = wrap.querySelector('[data-check]');
      var errEl = wrap.querySelector('[data-err]'), fbEl = wrap.querySelector('[data-fb]');
      ta.oninput = function () { btn.disabled = !ta.value.trim(); };
      wrap.querySelector('[data-next]').onclick = function () { custom = null; idx++; draw(); };
      var ownBox = wrap.querySelector('[data-ownbox]');
      wrap.querySelector('[data-own]').onclick = function () { ownBox.style.display = (ownBox.style.display === 'none') ? 'block' : 'none'; };
      wrap.querySelector('[data-ownload]').onclick = function () {
        var t = wrap.querySelector('[data-owntext]').value || '';
        var sents = t.split(/(?:[.;·!?]+|\n+)/).map(function (s) { return s.trim(); }).filter(function (s) { return s.length > 3; });
        var list = wrap.querySelector('[data-ownlist]');
        if (!sents.length) { list.innerHTML = '<span class="tr-cap" style="text-transform:none">Δεν βρέθηκαν προτάσεις.</span>'; return; }
        list.innerHTML = sents.slice(0, 50).map(function (s, i) { return '<button class="tr-btn tr-btn--ghost" data-pick="' + i + '" style="justify-content:flex-start;text-align:left;font-family:var(--f-serif);font-size:18px;text-transform:none;letter-spacing:0;padding:10px 14px">' + esc(s) + '</button>'; }).join('');
        list.querySelectorAll('[data-pick]').forEach(function (b) { b.onclick = function () { custom = { sentence: sents[+b.dataset.pick], placeholder: 'Ανάλυσε αυτή την πρόταση…' }; draw(); }; });
      };
      btn.onclick = function () {
        if (!ta.value.trim()) return;
        errEl.style.display = 'none'; fbEl.innerHTML = '';
        var fn = callable('gradeSyntaxParse');
        if (!fn) { errEl.style.display = 'block'; errEl.innerHTML = degradeMsg(); return; }
        btn.disabled = true; btn.innerHTML = '<span class="tt-spin"></span> Έλεγχος…';
        fn({ lessonId: L.id, attempt: ta.value, sentence: cur().sentence }).then(function (r) {
          btn.innerHTML = '✓ Έλεγξε'; btn.disabled = false; renderVerdict(fbEl, r && r.data);
        }).catch(function () { btn.innerHTML = '✓ Έλεγξε'; btn.disabled = false; errEl.style.display = 'block'; errEl.innerHTML = degradeMsg(); });
      };
    }
    draw();
    return wrap;
  }
  function renderVerdict(mount, d) {
    if (!d) return;
    var claims = (d.claims || []).map(function (c) {
      var ok = c.verdict === 'σωστό', amb = c.verdict === 'αμφιλεγόμενο' || c.verdict === 'αμφιλεγόμενο-δεκτό';
      var color = ok ? 'var(--sage)' : amb ? 'var(--wine)' : 'var(--terra)';
      var mk = ok ? '✓' : amb ? '◑' : '→';
      return '<div class="syx-claim"><span class="mk" style="color:' + color + '">' + mk + '</span><span>' +
        '<span class="ph">' + esc(c.phrase || '') + '</span> — ' + fmt(c.note || c.verdict || '') + '</span></div>';
    }).join('');
    var tally = (d.correct != null && d.total != null) ? '<span class="syx-tally">' + d.correct + ' από ' + d.total + ' όρους σωστά</span>' : '';
    mount.innerHTML = '<div class="tt-fb">' + tally + '<div style="margin-top:14px">' + claims + '</div>' +
      (d.summary ? '<p class="tt-summary">' + esc(d.summary) + '</p>' : '') + '</div>';
  }

  /* ───────────────────────── shell ────────────────────────── */
  function ensureOverlay() {
    var ov = document.getElementById('theory-syntax-overlay');
    if (ov) return ov;
    ov = el('<div id="theory-syntax-overlay" class="tr-overlay" role="dialog" aria-modal="true" aria-label="Συντακτικό">' +
      '<button class="tr-overlay-close" aria-label="Κλείσιμο">✕</button>' +
      '<div class="tr"><div class="tr-grain"></div><div class="tr-inner" id="theory-syntax-mount"></div></div></div>');
    ov.querySelector('.tr-overlay-close').onclick = closeSyntaxLesson;
    ov.addEventListener('click', function (e) { if (e.target === ov) closeSyntaxLesson(); });
    document.body.appendChild(ov);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('active')) closeSyntaxLesson(); });
    return ov;
  }

  function render() {
    var L = S.lesson, mount = document.getElementById('theory-syntax-mount');
    if (!L || !mount) return;
    mount.innerHTML = '';
    // header
    var head = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px"><div>' +
      '<div class="tr-eyebrow">' + esc(L.eyebrow || 'Σύνταξη') + ' · ' + esc(L.level || '') + '</div>' +
      '<div style="margin-top:10px"><div class="tr-lemma" style="font-size:60px;line-height:1">' +
        esc(L.title) + '<em>' + esc(L.titleEm || '') + '</em></div>' +
        (L.subtitle ? '<div class="tr-meaning" style="font-size:21px;margin-top:6px">' + esc(L.subtitle) + '</div>' : '') +
      '</div></div>';
    if (isCurator()) head += '<button class="tr-btn tr-btn--ghost" data-edit style="flex-shrink:0" title="Επεξεργασία μαθήματος">✎ Επεξεργασία</button>';
    head += '</div>';
    mount.appendChild(el(head));

    // mode switcher
    var MODES = [['theory', 'Θεωρία'], ['practice', 'Άσκηση'], ['exam', 'Εξέταση']];
    var seg = el('<div class="seg" style="margin-top:26px">' + MODES.map(function (m) {
      return '<button class="seg-btn' + (S.mode === m[0] ? ' on' : '') + '" data-mode="' + m[0] + '">' + m[1] + '</button>';
    }).join('') + '</div>');
    seg.querySelectorAll('[data-mode]').forEach(function (b) {
      b.onclick = function () { S.mode = b.dataset.mode; render(); };
    });
    mount.appendChild(seg);
    mount.appendChild(el('<hr class="tr-rule" style="margin:0 0 30px"/>'));

    var body = (S.mode === 'practice') ? viewPractice(L) : (S.mode === 'exam') ? viewExam(L) : viewTheory(L);
    mount.appendChild(body);
    var eb = mount.querySelector('[data-edit]'); if (eb) eb.onclick = function () {
      if (typeof window.openSyntaxLessonEditor === 'function') window.openSyntaxLessonEditor(L.id, function () { render(); });
      else toast('Ο συντάκτης δεν φορτώθηκε.');
    };
  }

  function _openSyntaxLessonNow(idOrDs) {
    var id = _resolveId(idOrDs);
    var L = (window.SYNTAX && window.SYNTAX.get) ? window.SYNTAX.get(id) : null;
    if (!L) { toast('Δεν βρέθηκε το μάθημα συντακτικού'); return; }
    S.lesson = L; S.mode = 'theory';
    // ground the Sokrates tutor on the open lesson
    window.SOKRATES_CTX = { kind: 'syntax', title: (L.title || '') + (L.titleEm || ''), tag: L.subtitle, level: L.level, commentary: L.intro };
    var ov = ensureOverlay();
    render();
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    ov.scrollTop = 0;
    var inner = ov.querySelector('.tr-inner'); if (inner) inner.scrollTop = 0;
  }

  function closeSyntaxLesson() {
    var ov = document.getElementById('theory-syntax-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
    window.SOKRATES_CTX = null;
  }

  /* ───────────────────────── Μονομαχία συγχύσεων ─────────────── */
  // build an interleaved deck from every pair-bearing exercise, weak pairs first
  function duelDeck() {
    var byPair = {};
    (window.SYNTAX ? window.SYNTAX.all() : []).forEach(function (L) {
      (L.exercises || []).forEach(function (ex) { if (ex && ex.pair) { (byPair[ex.pair] = byPair[ex.pair] || []).push(ex); } });
    });
    var keys = Object.keys(byPair);
    var weak = (window.SyntaxMastery ? window.SyntaxMastery.weakPairs() : keys);
    keys.sort(function (a, b) { return (weak.indexOf(a) >= 0 ? 0 : 1) - (weak.indexOf(b) >= 0 ? 0 : 1); });
    var deck = [], idx = {}, more = true;
    while (more) { more = false; keys.forEach(function (p) { var i = idx[p] || 0; if (i < byPair[p].length) { deck.push(byPair[p][i]); idx[p] = i + 1; more = true; } }); }
    return deck;
  }

  function duelHub() {
    var mount = document.getElementById('theory-syntax-mount'); if (!mount) return;
    var M = window.SyntaxMastery, board = M ? M.board() : [];
    var rows = board.map(function (b) {
      var pct = Math.round((b.level / 5) * 100);
      var tag = b.level >= 4 ? 'κατακτήθηκε' : (b.seen ? ('επίπεδο ' + b.level + '/5') : 'νέο');
      return '<div style="margin-top:16px"><div style="display:flex;justify-content:space-between;align-items:baseline">' +
        '<span class="tr-form" style="font-size:18px;color:var(--bone)">' + esc(b.label) + '</span>' +
        '<span class="tr-cap">' + tag + '</span></div>' +
        '<div style="height:6px;border-radius:3px;background:var(--line);overflow:hidden;margin-top:7px"><div style="height:100%;width:' + pct + '%;background:linear-gradient(90deg,var(--terra),var(--gold))"></div></div>' +
        '<div class="tr-cap" style="margin-top:5px;text-transform:none;letter-spacing:0.02em;color:var(--stone)">κριτήριο: ' + esc(b.cue) + '</div></div>';
    }).join('');
    mount.innerHTML =
      '<div class="tr-eyebrow">Σύνταξη · διαρκής εξάσκηση</div>' +
      '<div class="tr-lemma" style="font-size:52px;line-height:1;margin-top:12px">Μονομαχία<em> συγχύσεων</em></div>' +
      '<div class="tr-meaning" style="font-size:20px;margin-top:6px">Τα ζεύγη που μπερδεύεις πιο συχνά — σε γρήγορη εναλλαγή</div>' +
      '<hr class="tr-rule" style="margin:24px 0 4px"/>' + rows +
      '<div style="display:flex;gap:12px;margin-top:30px">' +
        '<button class="tr-btn tr-btn--terra" data-start>Ξεκίνα τη μονομαχία</button>' +
        '<button class="tr-btn tr-btn--ghost" data-reset>Μηδενισμός προόδου</button></div>';
    mount.querySelector('[data-start]').onclick = function () { duelDrill(); };
    mount.querySelector('[data-reset]').onclick = function () { if (M) M.reset(); duelHub(); };
  }

  function duelDrill() {
    var deck = duelDeck();
    if (!deck.length) { duelHub(); return; }
    var pos = 0, mount = document.getElementById('theory-syntax-mount');
    function step() {
      if (pos >= deck.length) { duelHub(); return; }
      var ex = deck[pos];
      var pairLab = window.SyntaxMastery ? window.SyntaxMastery.pairLabel(ex.pair) : ex.pair;
      mount.innerHTML =
        '<div style="display:flex;justify-content:space-between;align-items:center"><div class="tr-eyebrow">Μονομαχία · ' + (pos + 1) + ' / ' + deck.length + '</div>' +
          '<button class="tr-btn tr-btn--ghost" data-quit style="padding:8px 14px">Έξοδος</button></div>' +
        '<div class="tr-cap" style="margin-top:10px;text-transform:none;letter-spacing:0.02em;color:var(--gold)">Ζεύγος: ' + esc(pairLab) + '</div>' +
        '<hr class="tr-rule" style="margin:16px 0 22px"/>' +
        '<div class="syx-ex" data-host>' + (ex.q ? '<div class="syx-ex-q">' + fmt(ex.q) + '</div>' : '') + '</div>' +
        '<div style="margin-top:22px"><button class="tr-btn tr-btn--terra" data-next>' + (pos === deck.length - 1 ? 'Τέλος' : 'Επόμενο') + ' →</button></div>';
      var host = mount.querySelector('[data-host]');
      var body = renderExercise(ex);
      if (body) { host.appendChild(body); observeOutcome(body, ex); }
      mount.querySelector('[data-next]').onclick = function () { pos++; window.scrollTo(0, 0); step(); };
      mount.querySelector('[data-quit]').onclick = function () { duelHub(); };
    }
    step();
  }

  function openSyntaxDuel() {
    S.lesson = null; window.SOKRATES_CTX = null;
    var ov = ensureOverlay();
    duelHub();
    ov.classList.add('active'); document.body.style.overflow = 'hidden'; ov.scrollTop = 0;
    var inner = ov.querySelector('.tr-inner'); if (inner) inner.scrollTop = 0;
  }

  // Lazy-load the heavy banks + full theory (~1.1MB) only when a lesson is
  // first opened, so the whole app boots fast. The path is resolved from this
  // script's own URL → works on any SPA route. Failed loads degrade silently
  // (standalone builds inline the data already).
  var _SCRIPT_BASE = (function () {
    try { if (document.currentScript && document.currentScript.src) return document.currentScript.src.replace(/[^/]*$/, ''); } catch (_) {}
    var ss = document.getElementsByTagName('script');
    for (var i = ss.length - 1; i >= 0; i--) { if (ss[i].src && /theory-syntax\.js(\?|$)/.test(ss[i].src)) return ss[i].src.replace(/[^/]*$/, ''); }
    return 'js/';
  })();
  var _extras = null;
  function ensureExtras() {
    if (_extras) return _extras;
    function load(name) { return new Promise(function (res) { var s = document.createElement('script'); s.src = _SCRIPT_BASE + name; s.onload = res; s.onerror = res; (document.head || document.documentElement).appendChild(s); }); }
    _extras = Promise.all([load('theory-syntax-banks.js'), load('theory-syntax-theory.js')]);
    return _extras;
  }
  function openSyntaxLesson(idOrDs) {
    var id = _resolveId(idOrDs);
    if (!(window.SYNTAX && window.SYNTAX.has && window.SYNTAX.has(id))) { toast('Δεν βρέθηκε το μάθημα συντακτικού'); return; }
    ensureExtras().then(function () { _openSyntaxLessonNow(idOrDs); });
  }

  window.openSyntaxLesson = openSyntaxLesson;
  window.closeSyntaxLesson = closeSyntaxLesson;
  window.openSyntaxDuel = openSyntaxDuel;
  // so nav.js canTheoryLesson()/dispatch can recognise syntax datasets
  window.canSyntaxLesson = function (id) { return !!(window.SYNTAX && window.SYNTAX.has && window.SYNTAX.has(_resolveId(id))); };
})();
