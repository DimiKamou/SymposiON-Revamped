/* ════════════════════════════════════════════════════════════════════
   SymposiON — Synthesis · AI TUTOR (student-facing Q&A)
   A flexible, bilingual tutor grounded in admin-uploaded reference books.
   Talks to the `askTutor` Firebase callable (auth required, rate-limited,
   scope-limited server-side to the platform's classics subjects).
   Self-contained IIFE. Registers window.SYM_SCREENS.tutor and re-asserts
   it on a setTimeout(…,0) so a later-loading module can't clobber it.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  // Bilingual helper — mirror the rest of the shell (window.L from app.js).
  const L = (o) => (window.L ? window.L(o) : (o && (o.gr || o.en)) || '');
  const go = (s, p) => window.symGo(s, p);

  // Subject picker — label is sent to the callable; 'Όλα' maps to 'all'.
  const SUBJECTS = [
    { key: 'all',         gr: 'Όλα τα μαθήματα',  en: 'All subjects' },
    { key: 'Ιστορία',     gr: 'Ιστορία',          en: 'History' },
    { key: 'Αρχαία Ελληνικά', gr: 'Αρχαία Ελληνικά', en: 'Ancient Greek' },
    { key: 'Λατινικά',    gr: 'Λατινικά',          en: 'Latin' },
    { key: 'Λογοτεχνία',  gr: 'Λογοτεχνία',        en: 'Literature' },
    { key: 'Έκθεση',      gr: 'Έκθεση',            en: 'Composition' },
  ];

  // In-memory conversation history for this session (cleared on reload).
  const history = [];

  /* ── friendly bilingual error mapping (err.code / err.message) ── */
  function friendlyError(err) {
    const code = (err && err.code) || '';
    const msg  = (err && err.message) || '';
    if (code === 'unauthenticated') {
      return L({ gr: 'Πρέπει να συνδεθείς για να ρωτήσεις.', en: 'You need to sign in to ask.' });
    }
    if (code === 'failed-precondition' || /grader-unconfigured/.test(msg)) {
      return L({ gr: 'Ο AI βοηθός δεν είναι ακόμη διαθέσιμος.', en: 'The AI tutor isn’t available yet.' });
    }
    if (code === 'resource-exhausted') {
      return L({ gr: 'Πολλές ερωτήσεις πολύ γρήγορα — δοκίμασε ξανά σε λίγο.', en: 'Too many questions too fast — try again in a moment.' });
    }
    if (code === 'invalid-argument') {
      return L({ gr: 'Η ερώτηση δεν είναι έγκυρη — γράψε λίγο περισσότερα.', en: 'That question isn’t valid — please write a bit more.' });
    }
    if (code === 'internal') {
      return L({ gr: 'Κάτι πήγε στραβά. Δοκίμασε ξανά.', en: 'Something went wrong. Please try again.' });
    }
    return L({ gr: 'Κάτι πήγε στραβά. Δοκίμασε ξανά.', en: 'Something went wrong. Please try again.' });
  }

  /* ── chat bubble (preserves line breaks via white-space:pre-wrap) ── */
  function bubble(role, text, opts) {
    opts = opts || {};
    const isStudent = role === 'student';
    const wrap = el('div', {
      class: 'sc-tutor__msg sc-tutor__msg--' + (isStudent ? 'me' : 'ai'),
      style: 'display:flex;flex-direction:column;gap:4px;max-width:78%;'
        + (isStudent ? 'align-self:flex-end;align-items:flex-end;' : 'align-self:flex-start;align-items:flex-start;'),
    });
    wrap.appendChild(el('span', {
      class: 'sc-tutor__who',
      style: 'font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.6',
    }, isStudent ? L({ gr: 'Εσύ', en: 'You' }) : L({ gr: 'Βοηθός', en: 'Tutor' })));
    const body = el('div', {
      class: 'sc-tutor__txt' + (opts.error ? ' sc-tutor__txt--error' : ''),
      style: 'white-space:pre-wrap;line-height:1.5;padding:11px 14px;border-radius:14px;font-size:15px;'
        + (isStudent
            ? 'background:var(--ca,#3E7E86);color:#fff;border-bottom-right-radius:5px;'
            : 'background:color-mix(in srgb, var(--fg,#222) 6%, transparent);color:var(--fg,#222);border:1px solid color-mix(in srgb, var(--fg,#222) 12%, transparent);border-bottom-left-radius:5px;')
        + (opts.error ? 'color:#b8444a;background:color-mix(in srgb,#b8444a 10%,transparent);border-color:color-mix(in srgb,#b8444a 30%,transparent);' : ''),
    }, text);
    wrap.appendChild(body);
    if (opts.grounded != null) {
      wrap.appendChild(el('span', {
        class: 'sc-tutor__tag',
        style: 'font-size:11px;opacity:.62;font-weight:600',
      }, opts.grounded
        ? L({ gr: '📖 Βασισμένο στα βιβλία αναφοράς', en: '📖 Grounded in reference books' })
        : L({ gr: '○ Από τη γενική γνώση', en: '○ From general knowledge' })));
    }
    return wrap;
  }

  /* ── typing / loading indicator ── */
  function typingBubble() {
    const wrap = el('div', {
      class: 'sc-tutor__msg sc-tutor__msg--ai sc-tutor__typing',
      style: 'align-self:flex-start;display:flex;flex-direction:column;gap:4px;max-width:78%',
    });
    wrap.appendChild(el('span', {
      style: 'font-size:11px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;opacity:.6',
    }, L({ gr: 'Βοηθός', en: 'Tutor' })));
    wrap.appendChild(el('div', {
      style: 'padding:13px 16px;border-radius:14px;border-bottom-left-radius:5px;'
        + 'background:color-mix(in srgb, var(--fg,#222) 6%, transparent);'
        + 'border:1px solid color-mix(in srgb, var(--fg,#222) 12%, transparent);'
        + 'font-size:15px;letter-spacing:2px;opacity:.7',
    }, L({ gr: 'γράφει…', en: 'typing…' })));
    return wrap;
  }

  /* ══ THE SCREEN ══ */
  function tutorScreen(home, ctx) {
    const accent = '#3E7E86';
    const body = window.synPage(home, {
      back: 'home', accent,
      eyebrow: L({ gr: 'AI Βοηθός · Ρώτησε', en: 'AI Tutor · Ask' }),
      title: L({ gr: 'AI Βοηθός', en: 'AI Tutor' }),
      sub: L({
        gr: 'Ρώτησε ό,τι θες για τα μαθήματά σου — βασίζεται στα βιβλία αναφοράς της πλατφόρμας.',
        en: 'Ask anything about your subjects — grounded in the platform’s reference books.',
      }),
    });

    // ── scope intro: helps ONLY with these subjects; off-topic is declined ──
    body.appendChild(el('div', {
      class: 'sc-tutor__intro sc-stagger has-accent',
      style: 'margin:0 0 18px;padding:13px 16px;border-radius:14px;--ca:' + accent + ';'
        + 'background:color-mix(in srgb, ' + accent + ' 8%, transparent);'
        + 'border:1px solid color-mix(in srgb, ' + accent + ' 26%, transparent)',
    }, [
      el('div', { style: 'font-weight:700;margin-bottom:4px' },
        L({ gr: 'Βοηθάω μόνο με τα μαθήματα της πλατφόρμας', en: 'I only help with the platform’s subjects' })),
      el('p', { class: 'sc-hint', style: 'margin:0' }, L({
        gr: 'Αρχαία, Όμηρος, Ιστορία, Λατινικά, Λογοτεχνία & Έκθεση. Ερωτήσεις εκτός θέματος ευγενικά απορρίπτονται.',
        en: 'Ancient Greek, Homer, History, Latin, Literature & Composition. Off-topic questions are politely declined.',
      })),
    ]));

    // ── conversation area (re-rendered from history) ──
    const convo = el('div', {
      class: 'sc-tutor__convo sc-stagger',
      style: 'display:flex;flex-direction:column;gap:16px;min-height:120px;margin:0 0 18px;'
        + 'padding:18px;border-radius:16px;background:color-mix(in srgb, var(--fg,#222) 3%, transparent);'
        + 'border:1px solid color-mix(in srgb, var(--fg,#222) 9%, transparent)',
    });
    function emptyState() {
      return el('div', {
        class: 'sc-tutor__empty',
        style: 'text-align:center;opacity:.5;padding:26px 12px;font-size:14px;align-self:center',
      }, L({ gr: 'Γράψε την πρώτη σου ερώτηση παρακάτω.', en: 'Type your first question below.' }));
    }
    function paintConvo() {
      convo.innerHTML = '';
      if (!history.length) { convo.appendChild(emptyState()); return; }
      history.forEach(m => convo.appendChild(bubble(m.role, m.text, { grounded: m.grounded, error: m.error })));
      convo.scrollTop = convo.scrollHeight;
    }
    paintConvo();
    body.appendChild(convo);

    // ── subject picker ──
    body.appendChild(el('label', { class: 'sc-tutor__subjrow sc-stagger', style: 'display:block;margin:0 0 12px' }, [
      el('span', { class: 'sc-field__l', style: 'display:block;margin-bottom:6px;font-weight:700' },
        L({ gr: 'Μάθημα', en: 'Subject' })),
      el('select', { class: 'sc-field__i sc-select', id: 'tutorSubject' },
        SUBJECTS.map(s => el('option', { value: s.key }, L(s)))),
    ]));

    // ── question textarea + ask button ──
    const ta = el('textarea', {
      class: 'sc-field__i',
      id: 'tutorQuestion',
      rows: '3',
      placeholder: L({ gr: 'Γράψε την ερώτησή σου…', en: 'Type your question…' }),
      style: 'width:100%;resize:vertical;min-height:72px;font:inherit;line-height:1.5',
    });

    const signedIn = !!window.currentUser;

    let askBtn;
    if (signedIn) {
      askBtn = el('button', { class: 'sc-cta sc-cta--solid sc-tutor__ask', onclick: () => send() },
        [ L({ gr: 'Ρώτησε', en: 'Ask' }), el('span', { html: '&rarr;' }) ]);
      // Enter-to-send (Shift+Enter = newline), the familiar chat convention.
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
      });
    } else {
      // Not signed in → swap the send action for a sign-in prompt.
      askBtn = el('button', {
        class: 'sc-cta sc-cta--solid sc-tutor__ask',
        onclick: () => { if (typeof window.openAuthModal === 'function') window.openAuthModal('login'); else go('login'); },
      }, L({ gr: 'Συνδέσου για να ρωτήσεις', en: 'Sign in to ask' }));
      ta.setAttribute('disabled', '');
      ta.style.opacity = '.6';
    }

    body.appendChild(el('div', {
      class: 'sc-tutor__composer sc-stagger',
      style: 'display:flex;flex-direction:column;gap:10px;align-items:stretch',
    }, [
      ta,
      el('div', { style: 'display:flex;justify-content:flex-end' }, [ askBtn ]),
    ]));

    if (!signedIn) {
      body.appendChild(el('p', { class: 'sc-hint sc-stagger', style: 'text-align:right;margin:8px 0 0' },
        L({ gr: 'Συνδέσου για να χρησιμοποιήσεις τον AI βοηθό.', en: 'Sign in to use the AI tutor.' })));
    }

    /* ── send a question to the askTutor callable ── */
    function send() {
      if (!window.currentUser) {
        if (typeof window.openAuthModal === 'function') window.openAuthModal('login');
        return;
      }
      const question = (ta.value || '').trim();
      if (!question) { ta.focus(); return; }
      const subjSel = document.getElementById('tutorSubject');
      const subjectKey = (subjSel && subjSel.value) || 'all';
      const subject = subjectKey === 'all' ? 'all' : subjectKey;

      // Render the student bubble + clear the box.
      history.push({ role: 'student', text: question });
      ta.value = '';
      paintConvo();

      // Disable the button + show typing indicator.
      askBtn.disabled = true;
      const origLabel = askBtn.innerHTML;
      askBtn.textContent = '…';
      const typing = typingBubble();
      convo.appendChild(typing);
      convo.scrollTop = convo.scrollHeight;

      function restore() {
        askBtn.disabled = false;
        askBtn.innerHTML = origLabel;
        if (typing && typing.parentNode) typing.remove();
      }

      // Guard: Firebase / functions might be unavailable (offline / CDN blocked).
      let callable = null;
      try {
        if (typeof firebase !== 'undefined' && firebase.functions) {
          callable = firebase.functions().httpsCallable('askTutor');
        }
      } catch (_) { callable = null; }

      if (!callable) {
        restore();
        const text = friendlyError({ code: 'failed-precondition', message: 'grader-unconfigured' });
        history.push({ role: 'tutor', text, error: true });
        paintConvo();
        return;
      }

      callable({ question, subject })
        .then((res) => {
          restore();
          const data = (res && res.data) || {};
          const answer = data.answer || L({ gr: '(κενή απάντηση)', en: '(empty answer)' });
          history.push({ role: 'tutor', text: answer, grounded: !!data.grounded });
          paintConvo();
        })
        .catch((err) => {
          restore();
          try { console.warn('[symposion tutor] askTutor error:', err); } catch (_) {}
          history.push({ role: 'tutor', text: friendlyError(err), error: true });
          paintConvo();
        });
    }
  }

  /* ── register, re-asserting on the next tick (admin-synthesis.js pattern) ── */
  function register() {
    if (!window.SYM_SCREENS) window.SYM_SCREENS = {};
    window.SYM_SCREENS.tutor = tutorScreen;
  }
  register();
  setTimeout(register, 0);
})();
