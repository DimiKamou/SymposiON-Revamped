/* ════════════════════════════════════════════════════════════════════
   exam-agent.js — the in-app Exam Agent panel (synthesis)
   --------------------------------------------------------------------
   window.ExamAgent.open({ klass? }) opens a panel where a teacher pastes
   ΚΕΙΜΕΝΟ 1, picks the exam profile, and the agent drafts an ENRICHED
   ΘΕΜΑ 1 (Νεοελληνική Γλώσσα, Β΄ Λυκείου) grounded on the θεωρία έκθεσης.
   Review → edit → select → save as draft.

   Backend: the `generateExam` Cloud Function (mirror of gradeAnswer; key
   server-side, θεωρία from Firestore config/ekthesi-theory). Drafts persist
   via `adminSaveExamContent` (validated + audited) with a SymStore fallback
   so it always saves locally even offline.

   Loaded BEFORE js/app.js, so window.el / window.L are resolved LAZILY at
   call time (same rule as anathesi.js) — never captured at load.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const el  = (...a) => (window.el ? window.el(...a) : null);
  const L   = (o) => (window.L ? window.L(o) : ((o && (o.gr || o.en)) || o));
  const SS  = () => window.SymStore || { get: (k, d) => d, set: () => {} };

  function callable(name) {
    try { return firebase.functions().httpsCallable(name); } catch (_) { return null; }
  }

  /* ── entry point ─────────────────────────────────────────────────── */
  function open(opts) {
    opts = opts || {};
    injectStyles();
    const stage = document.querySelector('.stage') || document.body;

    const ov = el('div', { class: 'pv-overlay', onclick: (e) => { if (e.target === ov) ov.remove(); } });
    window.symApplyThemeClass && window.symApplyThemeClass(ov);
    const box = el('div', { class: 'an-wiz ea-box' });
    ov.appendChild(box);
    stage.appendChild(ov);
    requestAnimationFrame(() => ov.classList.add('in'));

    const state = { subject: 'ekthesi', profile: 'trapeza', title: '', text: '', perSlot: 3, results: null, sel: {}, busy: false };

    paintForm();

    function close() { ov.remove(); }

    function header(txt) {
      return el('div', { class: 'an-wiz__bar' }, [
        el('div', { class: 'an-wiz__steps' }, [el('span', { class: 'an-wiz__step on' }, txt)]),
        el('button', { class: 'pv-modal__x', onclick: close, html: '&times;' }),
      ]);
    }
    function field(label, ctrl) { return el('label', { class: 'an-field' }, [el('span', {}, label), ctrl]); }

    /* ── STEP 1 · source + options ── */
    function paintForm() {
      box.innerHTML = '';
      box.appendChild(header('✨ ' + L({ gr: 'Δημιουργία Θεμάτων — Έκθεση', en: 'Generate θέματα — Έκθεση' })));
      const pane = el('div', { class: 'an-wiz__pane' });

      const prof = el('select', { class: 'an-field__i' },
        [['trapeza', 'Τράπεζα Θεμάτων'], ['panellinies', 'Πανελλήνιες']]
          .map(([v, t]) => el('option', { value: v, selected: v === state.profile ? 'selected' : null }, t)));
      prof.addEventListener('change', () => { state.profile = prof.value; });

      const titleI = el('input', { class: 'an-field__i', type: 'text',
        placeholder: L({ gr: 'Τίτλος Κειμένου 1 (προαιρετικό)', en: 'Text 1 title (optional)' }), value: state.title });
      titleI.addEventListener('input', () => { state.title = titleI.value; });

      const ta = el('textarea', { class: 'ea-textarea', rows: '10',
        placeholder: L({ gr: 'Επικόλλησε εδώ το ΚΕΙΜΕΝΟ 1 (μη λογοτεχνικό)…', en: 'Paste ΚΕΙΜΕΝΟ 1 here…' }) });
      ta.value = state.text;
      ta.addEventListener('input', () => { state.text = ta.value; });

      const per = el('input', { class: 'an-field__i ea-num', type: 'number', min: '1', max: '5', value: String(state.perSlot) });
      per.addEventListener('input', () => { state.perSlot = Math.max(1, Math.min(5, Number(per.value) || 3)); });

      pane.appendChild(field(L({ gr: 'Μορφή εξέτασης', en: 'Exam profile' }), prof));
      pane.appendChild(field(L({ gr: 'Τίτλος', en: 'Title' }), titleI));
      pane.appendChild(el('label', { class: 'an-field' }, [el('span', {}, L({ gr: 'Κείμενο 1', en: 'Text 1' })), ta]));
      pane.appendChild(field(L({ gr: 'Εναλλακτικές ανά υποερώτημα', en: 'Alternatives per slot' }), per));
      pane.appendChild(el('div', { class: 'ea-note' }, L({
        gr: 'Ο agent συντάσσει εμπλουτισμένο ΘΕΜΑ 1 (Α·Β·Γ) με βάση τη θεωρία έκθεσης. Πρόχειρο για έλεγχο — τίποτα δεν δημοσιεύεται αυτόματα.',
        en: 'The agent drafts an enriched ΘΕΜΑ 1 grounded on the θεωρία. Draft for review — nothing is auto-published.',
      })));
      pane.appendChild(el('div', { class: 'an-wiz__nav' }, [
        el('span', {}),
        el('button', { class: 'sc-cta sc-cta--solid', onclick: generate }, ['✨ ', L({ gr: 'Δημιουργία ΘΕΜΑ 1', en: 'Generate ΘΕΜΑ 1' })]),
      ]));
      box.appendChild(pane);
    }

    /* ── generate via the Cloud Function ── */
    async function generate() {
      if (state.busy) return;
      if (!state.text || state.text.trim().length < 40) {
        alert(L({ gr: 'Επικόλλησε πρώτα το Κείμενο 1 (τουλάχιστον μερικές προτάσεις).', en: 'Paste Text 1 first (a few sentences).' }));
        return;
      }
      const fn = callable('generateExam');
      if (!fn) {
        alert(L({ gr: 'Χρειάζεται σύνδεση με Firebase (Functions) για τη δημιουργία.', en: 'Firebase Functions connection required.' }));
        return;
      }
      state.busy = true; paintBusy();
      try {
        const res = await fn({
          subject: state.subject, profile: state.profile,
          source: { title: state.title, text: state.text },
          request: { perSlot: state.perSlot, target: 'thema1' },
        });
        state.busy = false;
        state.results = (res && res.data) || null;
        if (!state.results || !Array.isArray(state.results.themata) || !state.results.themata.length) {
          alert(L({ gr: 'Δεν επιστράφηκαν θέματα. Δοκίμασε ξανά.', en: 'No θέματα returned. Try again.' }));
          paintForm(); return;
        }
        state.sel = {};
        state.results.themata.forEach((t, i) => { state.sel[i] = true; });
        paintResults();
      } catch (e) {
        state.busy = false;
        alert(friendlyErr(e));
        paintForm();
      }
    }

    function friendlyErr(e) {
      const code = String((e && (e.code || e.message)) || '');
      if (/unconfig|failed-precondition/.test(code)) return L({ gr: 'Ο AI generator δεν έχει ρυθμιστεί (λείπει το ANTHROPIC_KEY στο functions/.env).', en: 'Generator unconfigured (ANTHROPIC_KEY missing in functions/.env).' });
      if (/permission-denied/.test(code))            return L({ gr: 'Απαιτείται λογαριασμός διαχειριστή / ρόλος content.', en: 'Admin / content role required.' });
      if (/unavailable|upstream/.test(code))         return L({ gr: 'Ο AI βοηθός δεν αποκρίθηκε. Δοκίμασε ξανά σε λίγο.', en: 'AI upstream error — try again shortly.' });
      return L({ gr: 'Σφάλμα δημιουργίας: ', en: 'Generation error: ' }) + ((e && (e.message || e.details)) || 'unknown');
    }

    function paintBusy() {
      box.innerHTML = '';
      box.appendChild(header('✨ ' + L({ gr: 'Δημιουργία…', en: 'Generating…' })));
      box.appendChild(el('div', { class: 'an-wiz__pane ea-busy' }, [
        el('div', { class: 'ea-spinner' }),
        el('div', {}, L({ gr: 'Ο agent αναλύει το κείμενο και συντάσσει το ΘΕΜΑ 1… (~15–30 δευτ.)', en: 'The agent is drafting ΘΕΜΑ 1… (~15–30s)' })),
      ]));
    }

    /* ── STEP 2 · review, edit, select ── */
    function paintResults() {
      box.innerHTML = '';
      box.appendChild(header('✅ ' + L({ gr: 'ΘΕΜΑ 1 — έλεγξε, διόρθωσε & επίλεξε', en: 'ΘΕΜΑ 1 — review, edit & select' })));
      const pane = el('div', { class: 'an-wiz__pane' });
      const SLOTS = [['Α', 10], ['Β', 10], ['Γ', 15]];

      SLOTS.forEach(([slot, marks]) => {
        const items = state.results.themata
          .map((t, i) => ({ t, i }))
          .filter((x) => String(x.t.slot || '').toUpperCase().indexOf(slot) === 0);
        if (!items.length) return;
        pane.appendChild(el('div', { class: 'ea-slot-h' }, 'ΘΕΜΑ 1 · ' + slot + ' (' + marks + ' ' + L({ gr: 'μον.', en: 'pts' }) + ')'));
        items.forEach(({ t, i }) => {
          const cb = el('input', { type: 'checkbox', checked: state.sel[i] ? 'checked' : null });
          cb.addEventListener('change', () => { state.sel[i] = cb.checked; });
          const promptTa = el('textarea', { class: 'ea-edit', rows: '2' });
          promptTa.value = t.prompt;
          promptTa.addEventListener('input', () => { t.prompt = promptTa.value; });
          pane.appendChild(el('div', { class: 'ea-card' }, [
            el('div', { class: 'ea-card__top' }, [
              el('label', { class: 'ea-pick' }, [cb, el('span', { class: 'ea-cat' }, t.category || '—')]),
              el('span', { class: 'ea-marks' }, (t.marks || marks) + ' μον.'),
            ]),
            promptTa,
            el('div', { class: 'ea-ans' }, [
              el('div', { class: 'ea-ans__h' }, L({ gr: 'Ενδεικτική απάντηση', en: 'Model answer' })),
              el('div', {}, t.modelAnswer || '—'),
              (t.points && t.points.length) ? el('ul', { class: 'ea-points' }, t.points.map((pt) => el('li', {}, pt))) : null,
            ]),
          ]));
        });
      });

      pane.appendChild(el('div', { class: 'an-wiz__nav' }, [
        el('button', { class: 'sc-cta sc-cta--ghost sc-cta--sm', onclick: paintForm }, ['← ', L({ gr: 'Νέο κείμενο', en: 'New text' })]),
        el('button', { class: 'sc-cta sc-cta--solid sc-cta--sm', onclick: saveDraft }, ['💾 ', L({ gr: 'Αποθήκευση ως πρόχειρο', en: 'Save as draft' })]),
      ]));
      box.appendChild(pane);
    }

    /* ── save selected as a draft (server-validated + local fallback) ── */
    async function saveDraft() {
      const chosen = state.results.themata.filter((t, i) => state.sel[i]);
      if (!chosen.length) { alert(L({ gr: 'Επίλεξε τουλάχιστον ένα θέμα.', en: 'Select at least one θέμα.' })); return; }
      const id  = 'ekthesi-' + Date.now();
      const doc = {
        schema: 'exam', subject: state.subject, profile: state.profile,
        source: { title: state.title || '', text: state.text },
        themata: chosen, status: 'draft', created: Date.now(),
      };
      // 1) always persist locally (works offline / in the sandbox)
      try {
        SS().set('examContent/' + id, doc);
        const idx = SS().get('exam_drafts', []) || [];
        idx.unshift({ id, title: state.title || ('Έκθεση · ' + new Date().toLocaleDateString('el-GR')), profile: state.profile, created: Date.now() });
        SS().set('exam_drafts', idx);
      } catch (_) {}
      // 2) best-effort validated server save (RBAC + audit)
      let serverOk = false;
      const fn = callable('adminSaveExamContent');
      if (fn) { try { await fn({ contentId: id, content: doc }); serverOk = true; } catch (_) { /* keep local */ } }

      box.innerHTML = '';
      box.appendChild(el('div', { class: 'an-done' }, [
        el('span', { class: 'an-done__check' }, '✓'),
        L(serverOk
          ? { gr: 'Αποθηκεύτηκε ως πρόχειρο (server).', en: 'Saved as draft (server).' }
          : { gr: 'Αποθηκεύτηκε τοπικά ως πρόχειρο.', en: 'Saved locally as draft.' }),
      ]));
      setTimeout(() => { close(); if (typeof opts.onSaved === 'function') opts.onSaved(id, doc); }, 1200);
    }
  }

  /* ── one-time styles (scoped ea-*) ─────────────────────────────────── */
  function injectStyles() {
    if (document.getElementById('ea-styles')) return;
    const css = `
      .ea-box{ max-width:820px; width:min(92vw,820px); }
      .ea-textarea,.ea-edit{ width:100%; box-sizing:border-box; font:inherit; line-height:1.5;
        padding:10px 12px; border-radius:10px; border:1px solid rgba(0,0,0,.18);
        background:rgba(255,255,255,.75); color:inherit; resize:vertical; }
      .ea-num{ max-width:90px; }
      .ea-note{ font-size:.86em; opacity:.75; margin:.5em 0 1em; line-height:1.45; }
      .ea-busy{ display:flex; flex-direction:column; align-items:center; gap:16px; padding:40px 20px; text-align:center; }
      .ea-spinner{ width:34px; height:34px; border-radius:50%; border:3px solid rgba(0,0,0,.15);
        border-top-color:var(--ca,#2F6F8E); animation:ea-spin .8s linear infinite; }
      @keyframes ea-spin{ to{ transform:rotate(360deg); } }
      .ea-slot-h{ font-weight:700; margin:16px 0 8px; padding-bottom:4px; border-bottom:2px solid var(--ca,#2F6F8E); }
      .ea-card{ border:1px solid rgba(0,0,0,.12); border-radius:12px; padding:12px; margin-bottom:10px; background:rgba(255,255,255,.5); }
      .ea-card__top{ display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:8px; }
      .ea-pick{ display:flex; align-items:center; gap:8px; cursor:pointer; }
      .ea-cat{ font-weight:600; font-size:.9em; text-transform:uppercase; letter-spacing:.02em; opacity:.85; }
      .ea-marks{ font-size:.85em; opacity:.7; white-space:nowrap; }
      .ea-ans{ margin-top:8px; font-size:.92em; background:rgba(0,0,0,.04); border-radius:8px; padding:8px 10px; }
      .ea-ans__h{ font-size:.78em; text-transform:uppercase; letter-spacing:.03em; opacity:.6; margin-bottom:3px; }
      .ea-points{ margin:6px 0 0; padding-left:18px; }
      .ea-points li{ margin:2px 0; }
    `;
    const st = document.createElement('style');
    st.id = 'ea-styles'; st.textContent = css;
    document.head.appendChild(st);
  }

  window.ExamAgent = { open };
})();
