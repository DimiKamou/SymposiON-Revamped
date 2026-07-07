/* ════════════════════════════════════════════════════════════════════
   theory-neg.js — the Έκθεση & Λογοτεχνία lesson engine (kind:'neg').
   Νεοελληνική Γλώσσα & Λογοτεχνία, Γ΄ Λυκείου (Πανελλήνιες).
   Renders the built-in NEG lessons (theory-neg-data.js) inside the
   shared .tr-overlay museum shell, with a .seg switcher:

     • Θεωρία  — stat pills + intro + theory blocks + worked example
     • Άσκηση  — deterministic exercises, graded CLIENT-SIDE against
                 accept-sets (no Cloud Functions, works fully offline)
     • Εξέταση — free answer → gradeNegAnswer callable (categorical);
                 DEGRADES GRACEFULLY when undeployed.

   Exercise types (exam archetypes of Θέμα Β):
     choice          — MCQ / Σωστό-Λάθος / cloze με αιτιολόγηση
     passage         — απόσπασμα → ταξινόμηση (τρόπος ανάπτυξης, πειθώ…)
     match           — αντιστοίχιση Στήλη Α → Στήλη Β (αρχέτυπο 2023 Β1)
     tap-word        — εντόπισε τη λέξη-στόχο σε αντιθετικές κάρτες
     error-spot      — βρες το λάθος + ονόμασε τον κανόνα
     transformation  — καθοδηγούμενα βήματα (μετατροπές, πύκνωση…)

   Entry: window.openNegLesson(idOrDataset). Dispatched from
   theory-lesson.js openTheoryLesson() when ds.kind === 'neg'.
   Reuses the .tr-* / .syx-* CSS of the Συντακτικό course; the few
   NEG-only bits live in css/theory-neg.css.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function raw(s) { return String(s == null ? '' : s); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function fmt(s) { return raw(s).replace(/<i>/g, '<em style="color:var(--terra);font-style:normal">').replace(/<\/i>/g, '</em>'); }
  function el(html) { var d = document.createElement('div'); d.innerHTML = String(html).trim(); return d.firstElementChild; }
  function callable(n) { try { return firebase.functions().httpsCallable(n); } catch (_) { return null; } }
  function toast(m) { if (typeof showToast === 'function') showToast(m, m); }

  function _resolveId(idOrDs) {
    if (idOrDs && typeof idOrDs === 'object') return idOrDs.id || '';
    return String(idOrDs || '');
  }

  var S = { lesson: null, mode: 'theory' };

  /* ───────────────────────── Θεωρία ───────────────────────── */
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
    if (L.stats && L.stats.length) {
      h += '<div style="display:flex;gap:12px;flex-wrap:wrap">' + L.stats.map(function (s) {
        return '<div class="tr-stat"><div class="k">' + esc(s[0]) + '</div><div class="v">' + esc(s[1]) + '</div></div>';
      }).join('') + '</div>';
    }
    h += '<div style="margin-top:32px"><div class="tr-kicker">Τι είναι</div>' +
      '<div class="tr-body syx-prose" style="margin-top:12px;max-width:820px">' + fmt(L.intro) + '</div></div>';
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
    // worked example — colour-chunked κομμάτια (π.χ. μέρη παραγράφου, δείκτες)
    if (L.worked) {
      h += '<div style="margin-top:36px;border-left:2px solid var(--terra);padding-left:22px">' +
        '<div class="tr-kicker" style="color:var(--terra)">Δουλεμένο παράδειγμα</div>' +
        '<div class="syx-worked neg-worked" style="margin-top:14px">' +
        L.worked.gr.map(function (c) {
          return '<span class="syx-chunk ' + esc(c.fam) + '" style="color:var(--syx-h);border-bottom-color:var(--syx-h)">' +
            fmt(c.w) + '<span class="lab" style="color:var(--syx-h)">' + esc(c.role) + '</span></span>';
        }).join(' ') + '</div>';
      if (L.worked.note) h += '<div class="tt-note" style="margin-top:20px;max-width:720px"><span class="ic">✶</span><p>' + fmt(L.worked.note) + '</p></div>';
      h += '</div>';
    }
    h += '<div class="syx-credit" style="margin-top:46px;padding-top:16px;border-top:1px solid var(--line-soft);font-family:var(--f-mono);font-size:11px;letter-spacing:0.02em;color:var(--stone);line-height:1.65;max-width:820px">' +
      'Η θεωρία ακολουθεί την εξεταστέα ύλη της Νεοελληνικής Γλώσσας &amp; Λογοτεχνίας (Πανελλαδικές, ενιαία εξέταση) — ' +
      'σύνθεση από σχολικά βοηθήματα θεωρίας και τα επίσημα θέματα 2020–2025, με διαδραστική επεξεργασία.</div>';
    h += '</div>';
    return el(h);
  }

  /* ───────────────────────── Άσκηση ───────────────────────── */
  function exerciseCard(ex, label) {
    var card = document.createElement('div');
    card.className = 'syx-ex'; card.style.marginTop = '22px';
    card.appendChild(el('<div class="syx-ex-k">' + esc(label) + ' · ' + _exKind(ex.type) + '</div>'));
    if (ex.q) card.appendChild(el('<div class="syx-ex-q">' + fmt(ex.q) + '</div>'));
    var body = renderExercise(ex);
    if (body) card.appendChild(body);
    return card;
  }

  function viewPractice(L) {
    var wrap = document.createElement('div');
    var exs = L.exercises || [];
    var bank = L.bank || [];
    var total = exs.length + bank.length;
    if (!total) { wrap.innerHTML = '<div class="tt-empty">Δεν υπάρχουν ασκήσεις ακόμη.</div>'; return wrap; }
    wrap.appendChild(el('<div style="margin-bottom:4px"><div class="tr-kicker">Άσκηση · ' + total + ' παραδείγματα</div>' +
      '<p class="tr-body" style="font-size:17px;line-height:1.65;margin-top:12px;max-width:740px">Κάθε άσκηση διορθώνεται <b>τοπικά</b> με την επεξήγηση του κριτηρίου — όπως ζητείται και στις Πανελλήνιες: όχι μόνο «τι», αλλά και «γιατί». Πάτησε «<b>Δημιούργησε άσκηση</b>» για επιπλέον παραδείγματα.</p></div>'));
    exs.forEach(function (ex, i) { wrap.appendChild(exerciseCard(ex, 'Άσκηση ' + String(i + 1).padStart(2, '0'))); });

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
      if (!window.NEG_AI_GENERATE) { serveFromBank(); return; }
      var fn = callable('generateNegExercise');
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
    return { 'choice': 'Επιλογή με αιτιολόγηση', 'passage': 'Ανάλυση αποσπάσματος',
      'match': 'Αντιστοίχιση', 'tap-word': 'Εντοπισμός στο κείμενο',
      'error-spot': 'Εντοπισμός λάθους', 'transformation': 'Μετασχηματισμός' }[t] || 'Άσκηση';
  }

  function renderExercise(ex) {
    if (ex.type === 'choice') return renderChoice(ex);
    if (ex.type === 'passage') return renderPassage(ex);
    if (ex.type === 'match') return renderMatch(ex);
    if (ex.type === 'tap-word') return renderTapWord(ex);
    if (ex.type === 'error-spot') return renderErrorSpot(ex);
    if (ex.type === 'transformation') return renderTransformation(ex);
    return el('<div class="tt-empty">—</div>');
  }

  /* ── choice (MCQ / Σωστό-Λάθος / cloze) ───────────────────── */
  function renderChoice(ex) {
    var box = document.createElement('div');
    var optsH = ex.options.map(function (o, oi) { return '<span class="syx-opt" data-oi="' + oi + '">' + fmt(o.t) + '</span>'; }).join('');
    box.innerHTML =
      (ex.stem ? '<div class="neg-passage">' + fmt(ex.stem) + '</div>' : '') +
      '<div class="syx-opts">' + optsH + '</div>' +
      '<div class="syx-fb"></div>' +
      '<div class="syx-reveal">' + fmt(ex.reason) + '</div>';
    var locked = false, fb = box.querySelector('.syx-fb'), reveal = box.querySelector('.syx-reveal');
    box.querySelectorAll('.syx-opt').forEach(function (b) {
      b.onclick = function () {
        if (locked) return; var o = ex.options[+b.dataset.oi];
        if (o && o.ok) { locked = true; b.classList.add('ok'); fb.className = 'syx-fb good'; fb.innerHTML = '✓ Σωστά.'; reveal.classList.add('show'); }
        else { b.classList.add('no'); fb.className = 'syx-fb bad'; fb.textContent = (o && o.miss) || ex.miss || 'Όχι — δοκίμασε ξανά.'; }
      };
    });
    return box;
  }

  /* ── passage (απόσπασμα → ταξινόμηση + αιτιολόγηση) ───────── */
  function renderPassage(ex) {
    var box = document.createElement('div');
    var optsH = ex.options.map(function (o) { return '<span class="syx-opt" data-r="' + esc(o.r) + '">' + esc(o.t) + '</span>'; }).join('');
    box.innerHTML =
      '<div class="neg-passage">' + fmt(ex.passage) + (ex.cite ? '<div class="neg-cite">' + fmt(ex.cite) + '</div>' : '') + '</div>' +
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

  /* ── match (αντιστοίχιση Στήλη Α → Στήλη Β) ───────────────── */
  function renderMatch(ex) {
    var box = document.createElement('div');
    var rights = ex.pairs.map(function (p, i) { return { t: p.r, pi: i }; });
    (ex.extra || []).forEach(function (t) { rights.push({ t: t, pi: -1 }); });
    // deterministic-ish shuffle so re-renders do not thrash
    rights.sort(function (a, b) { return (a.t.length * 7 + a.t.charCodeAt(0)) - (b.t.length * 7 + b.t.charCodeAt(0)); });
    var leftH = ex.pairs.map(function (p, i) {
      return '<button class="neg-mitem" data-side="l" data-pi="' + i + '">' + fmt(p.l) + '</button>';
    }).join('');
    var rightH = rights.map(function (r, ri) {
      return '<button class="neg-mitem" data-side="r" data-ri="' + ri + '" data-pi="' + r.pi + '">' + fmt(r.t) + '</button>';
    }).join('');
    box.innerHTML =
      '<div class="neg-match">' +
        '<div class="neg-mcol"><div class="neg-mhead">' + esc(ex.colL || 'Στήλη Α') + '</div>' + leftH + '</div>' +
        '<div class="neg-mcol"><div class="neg-mhead">' + esc(ex.colR || 'Στήλη Β') + '</div>' + rightH + '</div>' +
      '</div>' +
      '<div class="syx-hint">' + esc(ex.hint || 'Πάτησε ένα στοιχείο της Στήλης Α και μετά το ταίρι του στη Στήλη Β.') + '</div>' +
      '<div class="syx-fb"></div>' +
      '<div class="syx-reveal">' + fmt(ex.reveal) + '</div>';
    var fb = box.querySelector('.syx-fb'), reveal = box.querySelector('.syx-reveal'), hint = box.querySelector('.syx-hint');
    var selL = null, matched = 0;
    function shake(n) { n.classList.remove('syx-shk'); void n.offsetWidth; n.classList.add('syx-shk'); }
    box.querySelectorAll('[data-side="l"]').forEach(function (b) {
      b.onclick = function () {
        if (b.classList.contains('locked')) return;
        if (selL) selL.classList.remove('sel');
        selL = b; b.classList.add('sel');
        hint.textContent = 'Τώρα διάλεξε το ταίρι του στη Στήλη Β.';
      };
    });
    box.querySelectorAll('[data-side="r"]').forEach(function (b) {
      b.onclick = function () {
        if (b.classList.contains('locked') || !selL) return;
        if (b.dataset.pi === selL.dataset.pi) {
          selL.classList.remove('sel'); selL.classList.add('locked'); b.classList.add('locked');
          selL = null; matched++;
          fb.className = 'syx-fb good'; fb.textContent = '✓ Σωστό ζεύγος.';
          if (matched >= ex.pairs.length) {
            hint.textContent = 'Όλα τα ζεύγη σωστά.';
            reveal.classList.add('show');
          } else hint.textContent = 'Συνέχισε με το επόμενο στοιχείο της Στήλης Α.';
        } else {
          fb.className = 'syx-fb bad'; fb.textContent = ex.missMsg || 'Όχι — αυτό ταιριάζει αλλού.';
          shake(b);
        }
      };
    });
    return box;
  }

  /* ── tap-word (εντόπισε τη λέξη-στόχο σε αντιθετικές κάρτες) ── */
  function renderTapWord(ex) {
    var box = document.createElement('div');
    var sub = ex.subtitle ? '<div class="syx-sub" style="margin:2px 0 4px">' + esc(ex.subtitle) + '</div>' : '';
    var cardsH = ex.cards.map(function (c, ci) {
      var sent = c.tokens.map(function (tk, ti) {
        return '<span class="syx-w" data-ci="' + ci + '" data-ti="' + ti + '" data-hit="' + (tk.hit ? 1 : 0) + '">' + esc(tk.w) + '</span>';
      }).join(' ') + esc(c.tail || '');
      return '<div class="syx-dcard" data-card="' + ci + '" data-hashit="' + (c.hasHit ? 1 : 0) + '">' +
        '<div class="syx-dcard-h">' + esc(c.h) + '</div>' +
        '<div class="syx-sent" style="font-size:19px">' + sent + '</div>' +
        '<div class="syx-prompt">' + esc(ex.prompt || 'Πάτησε τη λέξη που ζητείται.') + '</div>' +
        (ex.noneLabel ? '<button class="syx-nb">' + esc(ex.noneLabel) + '</button>' : '') +
        '<div class="syx-fb bad"></div>' +
        '<div class="syx-lock ' + esc((c.lock && c.lock.fam) || 'syx-fam-core') + '"></div>' +
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
      var hit = card.querySelector('[data-hit="1"]');
      if (hit) { hit.classList.add((c.lock && c.lock.fam) || 'syx-fam-core'); hit.style.color = 'var(--syx-h)'; hit.style.borderBottom = '1px solid var(--syx-h)'; }
      card.querySelector('.syx-prompt').style.display = 'none';
      var nb = card.querySelector('.syx-nb'); if (nb) nb.style.display = 'none';
      card.querySelector('.syx-fb').textContent = '';
      var lock = card.querySelector('.syx-lock');
      lock.innerHTML = '<span style="font-weight:600">✓</span> ' + esc(c.lock ? c.lock.t : 'Σωστά');
      lock.classList.add('show');
      var cr = card.querySelector('[data-cardreveal]'); if (cr) cr.innerHTML = fmt(c.reason || '');
      maybeReveal();
    }
    function miss(card, msg) {
      var fb = card.querySelector('.syx-fb'); fb.textContent = msg;
    }
    box.querySelectorAll('.syx-w').forEach(function (w) {
      w.onclick = function () {
        var card = w.closest('.syx-dcard'); if (done[+card.dataset.card]) return;
        if (w.dataset.hit === '1') win(card);
        else {
          w.classList.remove('syx-shk'); void w.offsetWidth; w.classList.add('syx-shk');
          miss(card, (ex.missWord || 'Το «{w}» δεν είναι αυτό που ζητείται.').replace('{w}', w.textContent.trim()));
        }
      };
    });
    box.querySelectorAll('.syx-nb').forEach(function (b) {
      b.onclick = function () {
        var card = b.closest('.syx-dcard'); if (done[+card.dataset.card]) return;
        if (card.dataset.hashit === '0') win(card);
        else miss(card, ex.missNone || 'Υπάρχει — ψάξε ξανά.');
      };
    });
    return box;
  }

  /* ── error-spot ───────────────────────────────────────────── */
  function renderErrorSpot(ex) {
    var box = document.createElement('div');
    var toks = ex.tokens.map(function (tk) { return '<span class="syx-w" data-id="' + esc(tk.id) + '">' + esc(tk.w) + '</span>'; }).join(' ') + esc(ex.tail || '.');
    box.innerHTML =
      '<div class="syx-sent" style="margin-top:6px;font-size:19px">' + toks + '</div>' +
      '<button class="syx-nb" data-none>Δεν υπάρχει λάθος (σωστή)</button>' +
      '<div class="syx-hint" data-step>Πάτησε τη λέξη που φταίει — μετά ονόμασε τον κανόνα.</div>' +
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
        if (!ex.hasError) { fb.className = 'syx-fb bad'; fb.textContent = 'Η διατύπωση είναι σωστή — δεν υπάρχει λάθος εδώ.'; shake(w); return; }
        if ((ex.errorTokens || []).indexOf(w.dataset.id) >= 0) {
          found = true; w.style.color = 'var(--terra)'; w.style.borderBottom = '1px solid var(--terra)';
          hint.textContent = 'Σωστός εντοπισμός. Τώρα: ποιος κανόνας παραβιάζεται;'; showRules();
        } else { fb.className = 'syx-fb bad'; fb.textContent = 'Όχι εκεί — το λάθος είναι αλλού.'; shake(w); }
      };
    });
    box.querySelector('[data-none]').onclick = function () {
      if (locked || found) return;
      if (!ex.hasError) { this.style.borderColor = 'var(--sage)'; this.style.color = 'var(--sage)'; win('✓ Σωστά — δεν έχει λάθος.'); }
      else { fb.className = 'syx-fb bad'; fb.textContent = 'Υπάρχει λάθος — βρες τη λέξη που φταίει.'; }
    };
    return box;
  }

  /* ── transformation (καθοδηγούμενα βήματα) ────────────────── */
  function renderTransformation(ex) {
    var box = document.createElement('div');
    var stepsH = ex.steps.map(function (s, i) {
      return '<div class="syx-ex" data-tstep="' + i + '" style="margin-top:12px;padding:14px 16px' + (i > 0 ? ';opacity:.4;pointer-events:none' : '') + '">' +
        '<div class="syx-ex-k">Βήμα ' + (i + 1) + '</div>' +
        '<div class="syx-ex-q" style="font-size:16px">' + fmt(s.q) + '</div>' +
        '<div class="syx-opts">' + s.options.map(function (o, oi) { return '<span class="syx-opt" data-oi="' + oi + '">' + fmt(o.t) + '</span>'; }).join('') + '</div>' +
        '<div class="syx-fb"></div>' +
        (s.reason ? '<div class="syx-reveal" style="font-size:14px">' + fmt(s.reason) + '</div>' : '') + '</div>';
    }).join('');
    box.innerHTML =
      '<div class="tt-pane"><div class="tt-pane-h"><span class="lab">Αφετηρία</span></div>' +
      '<div class="tt-src"><div class="tt-srcline"><span class="n">→</span><span class="g" style="font-family:var(--f-sans);font-size:17px">' + fmt(ex.source) + '</span></div></div></div>' +
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
    if (L.exam && L.exam.prompt) bankE.unshift(L.exam);
    if (!bankE.length) bankE = [{ prompt: '—', placeholder: 'Γράψε την απάντησή σου…' }];
    var idx = 0;
    var wrap = document.createElement('div');
    function cur() { return bankE[((idx % bankE.length) + bankE.length) % bankE.length]; }
    function degradeMsg() {
      return 'Ο βοηθός AI της Εξέτασης ενεργοποιείται με την επόμενη δημοσίευση (Cloud Function <code>gradeNegAnswer</code>). ' +
        'Οι ασκήσεις στην «Άσκηση» λειτουργούν πλήρως τοπικά.';
    }
    function draw() {
      var ex = cur();
      var pos = (((idx % bankE.length) + bankE.length) % bankE.length + 1) + ' / ' + bankE.length;
      wrap.innerHTML =
        '<div class="tt-note" style="max-width:760px"><span class="ic">✶</span><p>Απάντησε όπως στις <b style="color:var(--bone)">Πανελλήνιες</b> — πλήρης απάντηση με αναφορά στο κείμενο και αιτιολόγηση. Ο βοηθός κρίνει <b style="color:var(--bone)">ανά κριτήριο</b>, όχι με βαθμό.</p></div>' +
        '<div class="tt-pane" style="margin-top:18px"><div class="tt-pane-h"><span class="lab">Η εκφώνηση</span><span class="tr-cap">' + (ex.points ? esc(ex.points) + ' · ' : '') + esc(pos) + '</span></div>' +
          '<div class="tt-src"><div class="tt-srcline"><span class="n">→</span><span class="g" style="font-family:var(--f-sans);font-size:17px;line-height:1.6">' + fmt(ex.prompt || '') + '</span></div></div></div>' +
        '<div style="display:flex;gap:10px;margin-top:14px;flex-wrap:wrap">' +
          '<button class="tr-btn tr-btn--ghost" data-next>↻ Νέα εκφώνηση</button>' +
          (ex.model ? '<button class="tr-btn tr-btn--ghost" data-model>✎ Δες ενδεικτική απάντηση</button>' : '') + '</div>' +
        '<div style="margin-top:20px"><textarea class="tt-input" data-att style="font-family:var(--f-sans);font-size:16px" placeholder="' + esc(ex.placeholder || 'Γράψε την απάντησή σου…') + '"></textarea>' +
          '<div class="tt-actions"><button class="tr-btn tr-btn--terra" data-check disabled>✓ Έλεγξε</button></div>' +
          '<div class="tt-err" data-err style="display:none"></div></div>' +
        (ex.model ? '<div data-modelbox style="display:none;margin-top:16px" class="tt-note"><span class="ic">✎</span><div class="syx-prose" style="line-height:1.7">' + fmt(ex.model) + '</div></div>' : '') +
        '<div data-fb></div>';
      wire();
    }
    function wire() {
      var ta = wrap.querySelector('[data-att]'), btn = wrap.querySelector('[data-check]');
      var errEl = wrap.querySelector('[data-err]'), fbEl = wrap.querySelector('[data-fb]');
      ta.oninput = function () { btn.disabled = !ta.value.trim(); };
      wrap.querySelector('[data-next]').onclick = function () { idx++; draw(); };
      var mb = wrap.querySelector('[data-model]');
      if (mb) mb.onclick = function () {
        var box = wrap.querySelector('[data-modelbox]'); if (!box) return;
        var show = box.style.display === 'none';
        box.style.display = show ? 'block' : 'none';
        mb.innerHTML = show ? '✎ Κρύψε την ενδεικτική απάντηση' : '✎ Δες ενδεικτική απάντηση';
        if (show) try { box.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (_) {}
      };
      btn.onclick = function () {
        if (!ta.value.trim()) return;
        errEl.style.display = 'none'; fbEl.innerHTML = '';
        var fn = callable('gradeNegAnswer');
        if (!fn) { errEl.style.display = 'block'; errEl.innerHTML = degradeMsg(); return; }
        btn.disabled = true; btn.innerHTML = '<span class="tt-spin"></span> Έλεγχος…';
        fn({ lessonId: L.id, attempt: ta.value, prompt: cur().prompt, model: cur().model, points: cur().points }).then(function (r) {
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
    var tally = (d.correct != null && d.total != null) ? '<span class="syx-tally">' + d.correct + ' από ' + d.total + ' κριτήρια</span>' : '';
    mount.innerHTML = '<div class="tt-fb">' + tally + '<div style="margin-top:14px">' + claims + '</div>' +
      (d.summary ? '<p class="tt-summary">' + esc(d.summary) + '</p>' : '') + '</div>';
  }

  /* ───────────────────────── shell ────────────────────────── */
  function ensureOverlay() {
    var ov = document.getElementById('theory-neg-overlay');
    if (ov) return ov;
    ov = el('<div id="theory-neg-overlay" class="tr-overlay" role="dialog" aria-modal="true" aria-label="Έκθεση και Λογοτεχνία">' +
      '<button class="tr-overlay-close" aria-label="Κλείσιμο">✕</button>' +
      '<div class="tr"><div class="tr-grain"></div><div class="tr-inner" id="theory-neg-mount"></div></div></div>');
    ov.querySelector('.tr-overlay-close').onclick = closeNegLesson;
    ov.addEventListener('click', function (e) { if (e.target === ov) closeNegLesson(); });
    document.body.appendChild(ov);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && ov.classList.contains('active')) closeNegLesson(); });
    return ov;
  }

  function render() {
    var L = S.lesson, mount = document.getElementById('theory-neg-mount');
    if (!L || !mount) return;
    mount.innerHTML = '';
    var _cur = (typeof window.theoryIsCurator === 'function') ? window.theoryIsCurator() : (typeof isAdmin !== 'undefined' && isAdmin);
    var head = '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:16px"><div>' +
      '<div class="tr-eyebrow">' + esc(L.eyebrow || 'Έκθεση') + ' · ' + esc(L.level || '') + '</div>' +
      '<div style="margin-top:10px"><div class="tr-lemma" style="font-size:52px;line-height:1.05">' +
        esc(L.title) + '<em>' + esc(L.titleEm || '') + '</em></div>' +
        (L.subtitle ? '<div class="tr-meaning" style="font-size:21px;margin-top:6px">' + esc(L.subtitle) + '</div>' : '') +
      '</div></div>' +
      (_cur ? '<button class="tr-btn tr-btn--ghost" data-edit style="flex-shrink:0" title="Επεξεργασία μαθήματος">✎ Επεξεργασία</button>' : '') +
      '</div>';
    mount.appendChild(el(head));
    if (_cur) { var _eb = mount.querySelector('[data-edit]'); if (_eb) _eb.onclick = function () {
      if (typeof window.openNegLessonEditor === 'function') window.openNegLessonEditor(L.id, function () { render(); });
      else toast('Ο συντάκτης δεν φορτώθηκε.');
    }; }

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
  }

  function openNegLesson(idOrDs) {
    var id = _resolveId(idOrDs);
    var L = (window.NEG && window.NEG.get) ? window.NEG.get(id) : null;
    if (!L) { toast('Δεν βρέθηκε το μάθημα'); return; }
    S.lesson = L; S.mode = 'theory';
    // ground the Sokrates tutor on the open lesson
    window.SOKRATES_CTX = { kind: 'neg', title: (L.title || '') + (L.titleEm || ''), tag: L.subtitle, level: L.level, commentary: L.intro };
    var ov = ensureOverlay();
    render();
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    ov.scrollTop = 0;
    var inner = ov.querySelector('.tr-inner'); if (inner) inner.scrollTop = 0;
  }

  function closeNegLesson() {
    var ov = document.getElementById('theory-neg-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
    window.SOKRATES_CTX = null;
  }

  window.openNegLesson = openNegLesson;
  window.closeNegLesson = closeNegLesson;
  // so theory-lesson.js / theory-data.js dispatch can recognise NEG datasets
  window.canNegLesson = function (id) { return !!(window.NEG && window.NEG.has && window.NEG.has(_resolveId(id))); };
})();
