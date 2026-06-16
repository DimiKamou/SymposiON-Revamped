/* ============================================================
   Agora Live Arena — Custom Quiz Builder  (LAQ)
   Load AFTER live-arena.js and live-arena-lobby.js.

   Exposes window.LAQ with:
     LAQ.addQuestion()        — add a blank question card
     LAQ.removeQuestion(id)   — remove a card by ID
     LAQ.uploadFile()         — import JSON or CSV
     LAQ.downloadTemplate()   — download a JSON template
     LAQ.launch()             — validate + hand off to LiveArena.launchHost()

   Question shape (same as LiveArena datasets):
     { q: "text", opts: ["A","B","C","D"], ans: 0 }
   ============================================================ */
(function () {
  'use strict';

  /* ── helpers ──────────────────────────────────────────────── */
  function el(id) { return document.getElementById(id); }
  function t(gr, en) {
    return (typeof siteLang !== 'undefined' && siteLang === 'en') ? en : gr;
  }
  function esc(s) {
    return String(s)
      .replace(/&/g,'&amp;').replace(/</g,'&lt;')
      .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  /* ── state ────────────────────────────────────────────────── */
  let _questions = [];   // [{ id, q, opts:['','','',''], ans:0 }, …]
  let _nextId    = 1;

  /* ── DOM sync ─────────────────────────────────────────────── */
  function _syncUI() {
    const list  = el('la-cq-list');
    const empty = el('la-cq-empty');
    const count = el('la-cq-count');
    const start = el('la-cq-start-btn');
    if (!list) return;

    if (empty) empty.style.display = _questions.length ? 'none' : '';
    if (count) count.textContent   = _questions.length + ' ' + t('ερωτήσεις', 'questions');
    if (start) start.disabled      = _questions.length === 0;
  }

  function _renderCard(qObj) {
    const list = el('la-cq-list');
    if (!list) return;

    const card = document.createElement('div');
    card.className   = 'la-cq-card';
    card.dataset.qid = qObj.id;

    card.innerHTML = `
      <div class="la-cq-card-hd">
        <span class="la-cq-card-num">#${_questions.indexOf(qObj) + 1}</span>
        <button class="la-cq-remove-btn" onclick="LAQ.removeQuestion(${qObj.id})" title="Remove">✕</button>
      </div>
      <textarea class="la-cq-q-input" placeholder="${esc(t('Κείμενο ερώτησης…','Question text…'))}"
                oninput="LAQ._onQText(${qObj.id},this.value)"
                rows="2">${esc(qObj.q)}</textarea>
      <div class="la-cq-opts-grid">
        ${qObj.opts.map((opt, i) => `
          <label class="la-cq-opt-row${qObj.ans === i ? ' la-cq-opt-correct' : ''}">
            <input type="radio" name="la-cq-ans-${qObj.id}" value="${i}"
                   ${qObj.ans === i ? 'checked' : ''}
                   onchange="LAQ._onAns(${qObj.id},${i})"/>
            <input type="text" class="la-cq-opt-input"
                   placeholder="${esc(t('Επιλογή', 'Option'))} ${String.fromCharCode(65+i)}"
                   value="${esc(opt)}"
                   oninput="LAQ._onOpt(${qObj.id},${i},this.value)"/>
          </label>`).join('')}
      </div>`;
    list.appendChild(card);
    _syncUI();
  }

  function _rebuildList() {
    const list = el('la-cq-list');
    if (!list) return;
    list.innerHTML = '';
    _questions.forEach(q => _renderCard(q));
    _syncUI();
  }

  /* ── public API ───────────────────────────────────────────── */
  const LAQ = {};

  LAQ.addQuestion = function (data) {
    const qObj = {
      id:   _nextId++,
      q:    (data && data.q)    || '',
      opts: (data && data.opts) ? data.opts.slice(0, 4).concat(['','','',''].slice(data.opts.length)) : ['','','',''],
      ans:  (data && typeof data.ans === 'number') ? data.ans : 0,
    };
    _questions.push(qObj);
    _renderCard(qObj);
    // Scroll new card into view
    const card = el('la-cq-list')?.lastElementChild;
    if (card) card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  };

  LAQ.removeQuestion = function (id) {
    _questions = _questions.filter(q => q.id !== id);
    const card = document.querySelector(`.la-cq-card[data-qid="${id}"]`);
    if (card) card.remove();
    _rebuildList(); // renumber
  };

  /* live-edit callbacks (called from inline onchange/oninput) */
  LAQ._onQText = function (id, val) {
    const q = _questions.find(q => q.id === id);
    if (q) q.q = val;
  };
  LAQ._onOpt = function (id, idx, val) {
    const q = _questions.find(q => q.id === id);
    if (q) q.opts[idx] = val;
  };
  LAQ._onAns = function (id, idx) {
    const q = _questions.find(q => q.id === id);
    if (!q) return;
    q.ans = idx;
    // Update correct highlight
    const card = document.querySelector(`.la-cq-card[data-qid="${id}"]`);
    if (card) {
      card.querySelectorAll('.la-cq-opt-row').forEach((row, i) => {
        row.classList.toggle('la-cq-opt-correct', i === idx);
      });
    }
  };

  /* ── Upload JSON / CSV ────────────────────────────────────── */
  LAQ.uploadFile = function () {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json,.csv,application/json,text/csv';
    inp.onchange = function () {
      const file = inp.files && inp.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function (e) {
        try {
          const text = e.target.result;
          let parsed;
          if (file.name.endsWith('.csv') || file.type === 'text/csv') {
            parsed = _parseCsv(text);
          } else {
            parsed = JSON.parse(text);
          }
          if (!Array.isArray(parsed) || !parsed.length) throw new Error('empty');
          // Reset and load
          _questions = []; _nextId = 1;
          parsed.forEach(row => LAQ.addQuestion(row));
          if (typeof symphoniToast === 'function') {
            symphoniToast(t(`✓ Φορτώθηκαν ${parsed.length} ερωτήσεις`, `✓ Loaded ${parsed.length} questions`), 'success');
          }
        } catch (err) {
          if (typeof symphoniToast === 'function') {
            symphoniToast(t('Σφάλμα ανάγνωσης αρχείου. Έλεγξε τη μορφή.', 'File read error. Check the format.'), 'error');
          }
        }
      };
      reader.readAsText(file, 'utf-8');
    };
    inp.click();
  };

  function _parseCsv(text) {
    // Expected columns: question, opt1, opt2, opt3, opt4, correct (1-indexed)
    const lines = text.trim().split(/\r?\n/);
    const header = lines[0].toLowerCase().split(',').map(s => s.trim());
    const qi = header.indexOf('question');
    const oi = [1,2,3,4].map(n => header.indexOf('opt' + n));
    const ci = header.indexOf('correct');
    if (qi < 0 || oi[0] < 0) throw new Error('bad csv');
    return lines.slice(1).filter(Boolean).map(line => {
      const cols = line.split(',').map(s => s.trim().replace(/^"|"$/g,''));
      const opts = oi.map(i => i >= 0 ? cols[i] || '' : '');
      const ans  = ci >= 0 ? Math.max(0, parseInt(cols[ci], 10) - 1) : 0;
      return { q: cols[qi] || '', opts, ans };
    });
  }

  /* ── Template download ────────────────────────────────────── */
  LAQ.downloadTemplate = function () {
    const sample = [
      { q: 'Ποιος έγραψε την Ιλιάδα;', opts: ['Όμηρος','Ησίοδος','Σοφοκλής','Ευριπίδης'], ans: 0 },
      { q: 'Πόσα χρόνια κράτησε η πολιορκία της Τροίας;', opts: ['5','10','20','3'], ans: 1 },
    ];
    const blob = new Blob([JSON.stringify(sample, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'live-arena-quiz-template.json';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  /* ── Launch ───────────────────────────────────────────────── */
  LAQ.launch = function () {
    // Validate
    const invalid = _questions.filter(q =>
      !q.q.trim() || q.opts.filter(o => o.trim()).length < 2
    );
    if (invalid.length) {
      if (typeof symphoniToast === 'function') {
        symphoniToast(
          t('Κάποιες ερωτήσεις δεν έχουν κείμενο ή επαρκείς επιλογές.',
            'Some questions are missing text or options.'), 'error');
      }
      return;
    }

    const name = (el('la-cq-name')?.value || '').trim()
      || t('Δικό μου Quiz', 'My Custom Quiz');

    // Convert to LiveArena format: { q, opts, ans }
    const questions = _questions.map(q => ({
      q:    q.q.trim(),
      opts: q.opts.map(o => o.trim()),
      ans:  q.ans,
    }));

    if (typeof LiveArena !== 'undefined' && LiveArena.launchHost) {
      LiveArena.launchHost({ questions, gameName: name });
    }
  };

  /* ── Reset when returning to builder screen ──────────────── */
  LAQ.reset = function () {
    _questions = []; _nextId = 1;
    const list = el('la-cq-list');
    if (list) list.innerHTML = '';
    const nameEl = el('la-cq-name');
    if (nameEl) nameEl.value = '';
    _syncUI();
  };

  window.LAQ = LAQ;
})();
