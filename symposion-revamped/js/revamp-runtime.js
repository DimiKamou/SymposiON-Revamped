/* ════════════════════════════════════════════════════════════════════
   SymposiON — Revamp runtime
   A small, self-contained runtime that lets the prototype's feature
   modules (consent, onboarding, guide, notifications, search, settings…)
   run INSIDE the real functional app. Helpers are locals in this IIFE so
   nothing collides with the app's globals. Each ported feature module is
   pasted into this scope and closes over them.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── DOM helper (from the prototype's app.js) ───────────────────── */
  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'style') n.setAttribute('style', attrs[k]);
      else if (k.startsWith('on') && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(c => {
      if (c == null) return;
      n.appendChild((typeof c === 'string' || typeof c === 'number') ? document.createTextNode(String(c)) : c);
    });
    return n;
  }

  /* ── language + bilingual helper ────────────────────────────────── */
  window.SYM_LANG = window.SYM_LANG || (document.documentElement.lang === 'en' ? 'en' : 'gr');
  function L(o) { return o && (o[window.SYM_LANG] || o.gr) || ''; }

  /* ── brand mark (the Σ-circuit glyph, from app.js) ──────────────── */
  function brandMark(cls) {
    const s = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    s.setAttribute('viewBox', '0 0 100 100'); s.setAttribute('class', cls || '');
    s.innerHTML = '<g fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="square">'
      + '<line x1="22" y1="20" x2="78" y2="20"/><line x1="22" y1="20" x2="48" y2="50"/>'
      + '<line x1="48" y1="50" x2="22" y2="80"/><line x1="22" y1="80" x2="78" y2="80"/></g>'
      + '<g fill="none" stroke="var(--terra)" stroke-width="3.2" stroke-linecap="round">'
      + '<circle cx="64" cy="50" r="12" stroke-dasharray="62 12" stroke-dashoffset="-7" transform="rotate(-90 64 50)"/>'
      + '<line x1="64" y1="39" x2="64" y2="49"/></g>';
    return s;
  }

  /* ── theme-class helper — popups carry the app's data-sym-theme ─── */
  window.symThemeClass = () => 'theme-' + (document.body.dataset.symTheme || 'alabaster');
  window.symApplyThemeClass = (node) => { if (node) node.setAttribute('data-sym-theme', document.body.dataset.symTheme || 'alabaster'); };

  /* ── tiny localStorage layer (from the prototype's store.js) ────── */
  if (!window.SymStore) {
    const NS = 'sym_revamp_';
    const get = (key, def) => { try { const v = localStorage.getItem(NS + key); return v == null ? def : JSON.parse(v); } catch (_) { return def; } };
    const set = (key, val) => {
      try { localStorage.setItem(NS + key, JSON.stringify(val)); } catch (_) {}
      try { window.dispatchEvent(new CustomEvent('sym-store', { detail: { key, val } })); } catch (_) {}
    };
    window.SymStore = { get, set };
  }

  /* expose helpers for later feature modules loaded separately */
  window.SYMR = { el, L, brandMark };

  /* ══════════════════════════════════════════════════════════════
     FEATURE · Consent / age-gate / cookie banner
     (ported from prototype js/consent.js — uses the locals above)
     ══════════════════════════════════════════════════════════════ */
  (function () {
    const SS = () => window.SymStore;
    const CONSENT_AGE = 15;
    const THIS_YEAR = new Date().getFullYear();

    window.SymConsent = (function () {
      let ov, year, pendingDone;
      function consented() { return !!SS().get('consent', 0); }
      function start() { cookieBanner(); }
      function requireConsent(onDone) {
        if (consented()) { onDone && onDone(); return; }
        pendingDone = onDone || null; openGate();
      }
      function open(card) {
        ov = el('div', { class: 'ob-ov', role: 'dialog', 'aria-modal': 'true' });
        window.symApplyThemeClass(ov);
        ov.appendChild(card); ov._card = card;
        document.body.appendChild(ov);
        requestAnimationFrame(() => ov.classList.add('in'));
        setTimeout(() => { if (ov) ov.classList.add('in'); }, 60);
      }
      function close() { if (!ov) return; ov.classList.remove('in'); const o = ov; ov = null; setTimeout(() => o.remove(), 300); }
      function shell() { const card = el('div', { class: 'ob-card' }); const mark = el('div', { class: 'ob-mark' }); mark.appendChild(brandMark()); card.appendChild(mark); return card; }
      function openGate() { year = null; const c = shell(); ov ? close() : 0; open(paintAge(c)); }

      function paintAge(card) {
        card.innerHTML = ''; const mark = el('div', { class: 'ob-mark' }); mark.appendChild(brandMark()); card.appendChild(mark);
        card.appendChild(el('p', { class: 'ob-eyebrow' }, L({ gr: 'Πριν ξεκινήσουμε', en: 'Before we begin' })));
        card.appendChild(el('h2', { class: 'ob-ttl', html: L({ gr: 'Πόσων <em>χρονών</em> είσαι;', en: 'How <em>old</em> are you?' }) }));
        card.appendChild(el('p', { class: 'ob-sub' }, L({ gr: 'Το ζητάμε για να προστατεύσουμε τους νεότερους χρήστες, όπως ορίζει ο GDPR.', en: 'We ask to protect younger users, as required by GDPR.' })));
        const sel = el('select', { class: 'cg-year', onchange: (e) => { year = +e.target.value; cont.disabled = !year; } });
        sel.appendChild(el('option', { value: '' }, L({ gr: 'Έτος γέννησης…', en: 'Year of birth…' })));
        for (let y = THIS_YEAR - 7; y >= THIS_YEAR - 20; y--) sel.appendChild(el('option', { value: String(y) }, String(y) + '  ·  ' + (THIS_YEAR - y) + ' ' + L({ gr: 'ετών', en: 'yrs' })));
        card.appendChild(sel);
        const cont = el('button', { class: 'syn-cta syn-cta--solid', disabled: '', onclick: () => {
          const age = THIS_YEAR - year;
          SS().set('age_bracket', age < CONSENT_AGE ? 'minor' : (age < 18 ? 'teen' : 'adult'));
          paintConsent(card);
        } }, [L({ gr: 'Συνέχεια', en: 'Continue' }), el('span', { html: '&rarr;' })]);
        card.appendChild(el('div', { class: 'ob-foot' }, [cont]));
        return card;
      }

      function paintConsent(card) {
        card.innerHTML = ''; const mark = el('div', { class: 'ob-mark' }); mark.appendChild(brandMark()); card.appendChild(mark);
        card.appendChild(el('p', { class: 'ob-eyebrow' }, L({ gr: 'Όροι & Απόρρητο', en: 'Terms & Privacy' })));
        card.appendChild(el('h2', { class: 'ob-ttl', html: L({ gr: 'Λίγα <em>νομικά</em>', en: 'A little <em>legal</em>' }) }));
        card.appendChild(el('p', { class: 'ob-sub' }, L({ gr: 'Διάβασε και αποδέξου για να συνεχίσεις.', en: 'Read and accept to continue.' })));
        const cTerms = check(L({ gr: 'Αποδέχομαι τους ', en: 'I accept the ' }), { gr: 'Όρους Χρήσης', en: 'Terms of Use' }, () => terms());
        const cPriv = check(L({ gr: 'Διάβασα την ', en: 'I’ve read the ' }), { gr: 'Πολιτική Απορρήτου', en: 'Privacy Policy' }, () => privacy());
        const cMkt = check(L({ gr: '(Προαιρετικό) Θέλω ενημερώσεις & νέα.', en: '(Optional) Send me updates & news.' }), null, null);
        [cTerms, cPriv, cMkt].forEach(c => card.appendChild(c.node));
        const go2 = el('button', { class: 'syn-cta syn-cta--solid', disabled: '', onclick: () => {
          SS().set('consent_marketing', cMkt.input.checked ? 1 : 0);
          SS().set('consent', 1);
          close(); const d = pendingDone; pendingDone = null; if (d) d();
        } }, [L({ gr: 'Αποδοχή & συνέχεια', en: 'Accept & continue' }), el('span', { html: '&rarr;' })]);
        const refresh = () => { go2.disabled = !(cTerms.input.checked && cPriv.input.checked); };
        [cTerms, cPriv].forEach(c => c.input.addEventListener('change', refresh));
        card.appendChild(el('div', { class: 'ob-foot' }, [el('button', { class: 'ob-back', onclick: () => paintAge(card) }, '← ' + L({ gr: 'Πίσω', en: 'Back' })), go2]));
        return card;
      }

      function check(pre, linkLabel, onlink) {
        const input = el('input', { type: 'checkbox' });
        const lab = el('label', { class: 'cg-check' }, [input, el('span', {}, [pre,
          linkLabel ? el('a', { href: 'javascript:void 0', class: 'cg-link', onclick: (e) => { e.preventDefault(); onlink && onlink(); } }, L(linkLabel)) : null])]);
        return { node: lab, input };
      }

      function legal(title, blocks) {
        const m = el('div', { class: 'ob-ov in', style: 'z-index:9200' }); window.symApplyThemeClass(m);
        const card = el('div', { class: 'ob-card', style: 'max-width:600px' });
        card.appendChild(el('button', { class: 'ob-skip', html: '&times;', onclick: () => m.remove() }));
        card.appendChild(el('h2', { class: 'ob-ttl', style: 'font-size:26px;margin-bottom:14px' }, L(title)));
        const body = el('div', { class: 'cg-legal' });
        blocks.forEach(b => { body.appendChild(el('h4', {}, L(b.h))); body.appendChild(el('p', {}, L(b.p))); });
        body.appendChild(el('p', { class: 'cg-legal__note' }, L({ gr: '— Δείγμα κειμένου. Αντικαταστήστε με εγκεκριμένο νομικό κείμενο.', en: '— Placeholder copy. Replace with counsel-approved text.' })));
        card.appendChild(body);
        card.appendChild(el('div', { class: 'ob-foot' }, [el('button', { class: 'syn-cta syn-cta--solid', onclick: () => m.remove() }, L({ gr: 'Κλείσιμο', en: 'Close' }))]));
        m.appendChild(card); document.body.appendChild(m);
      }
      function terms() { legal({ gr: 'Όροι Χρήσης', en: 'Terms of Use' }, [
        { h: { gr: 'Η υπηρεσία', en: 'The service' }, p: { gr: 'Το SymposiON είναι εκπαιδευτική πλατφόρμα παιχνιδιών για μαθητές, καθηγητές και γονείς.', en: 'SymposiON is an educational game platform for students, teachers and parents.' } },
        { h: { gr: 'Λογαριασμοί', en: 'Accounts' }, p: { gr: 'Οι χρήστες κάτω των 15 χρειάζονται συγκατάθεση γονέα/κηδεμόνα.', en: 'Users under 15 require parent/guardian consent.' } },
        { h: { gr: 'Ορθή χρήση', en: 'Acceptable use' }, p: { gr: 'Παίξε τίμια — απαγορεύονται κατάχρηση, παρενόχληση και παράκαμψη ασφαλείας.', en: 'Play fair — abuse, harassment and security circumvention are prohibited.' } },
      ]); }
      function privacy() { legal({ gr: 'Πολιτική Απορρήτου', en: 'Privacy Policy' }, [
        { h: { gr: 'Τι συλλέγουμε', en: 'What we collect' }, p: { gr: 'Στοιχεία λογαριασμού, πρόοδο μάθησης και βασικά αναλυτικά χρήσης.', en: 'Account details, learning progress and basic usage analytics.' } },
        { h: { gr: 'Ανήλικοι', en: 'Minors' }, p: { gr: 'Για παιδιά κάτω των 15 επεξεργαζόμαστε δεδομένα μόνο με γονική συγκατάθεση.', en: 'For children under 15 we process data only with parental consent.' } },
        { h: { gr: 'Τα δικαιώματά σου', en: 'Your rights' }, p: { gr: 'Πρόσβαση, διόρθωση και διαγραφή δεδομένων ανά πάσα στιγμή από τις Ρυθμίσεις.', en: 'Access, correct and delete your data anytime from Settings.' } },
      ]); }

      function cookieBanner() {
        if (SS().get('cookie_consent', null) !== null) return;
        if (document.querySelector('.ck-bar')) return;
        const bar = el('div', { class: 'ck-bar' }); window.symApplyThemeClass(bar);
        bar.appendChild(el('div', { class: 'ck-bar__t' }, [
          el('b', {}, L({ gr: 'Cookies 🍪', en: 'Cookies 🍪' })), ' ',
          L({ gr: 'Χρησιμοποιούμε απαραίτητα cookies και — με τη συγκατάθεσή σου — αναλυτικά. ', en: 'We use essential cookies and — with your consent — analytics. ' }),
          el('a', { class: 'cg-link', href: 'javascript:void 0', onclick: (e) => { e.preventDefault(); privacy(); } }, L({ gr: 'Μάθε περισσότερα', en: 'Learn more' })),
        ]));
        const setv = (v) => { SS().set('cookie_consent', v); bar.classList.remove('in'); setTimeout(() => bar.remove(), 250); };
        bar.appendChild(el('div', { class: 'ck-bar__btns' }, [
          el('button', { class: 'ck-btn ck-btn--ghost', onclick: () => setv('necessary') }, L({ gr: 'Μόνο απαραίτητα', en: 'Necessary only' })),
          el('button', { class: 'ck-btn ck-btn--solid', onclick: () => setv('all') }, L({ gr: 'Αποδοχή όλων', en: 'Accept all' })),
        ]));
        document.body.appendChild(bar);
        requestAnimationFrame(() => bar.classList.add('in'));
        setTimeout(() => bar.classList.add('in'), 60);
      }

      return { start, requireConsent, terms, privacy, cookieBanner, reset: () => { SS().set('consent', 0); openGate(); } };
    })();
  })();

  /* ── illustration injector (fetches the app's line-art SVGs) ─────── */
  if (!window.injectIllus) {
    window.injectIllus = async function (scope) {
      const base = window.APP_BASE || new URL('./', location.href).href;
      const nodes = scope.querySelectorAll('[data-illu]:not([data-done]), [data-sym]:not([data-done])');
      await Promise.all([...nodes].map(async (node) => {
        const isSym = node.hasAttribute('data-sym');
        const dir = isSym ? 'bg-symbols' : 'illustrations';
        const name = node.getAttribute(isSym ? 'data-sym' : 'data-illu');
        node.setAttribute('data-done', '1');
        if (!name) return;
        try {
          const r = await fetch(base + 'images/' + dir + '/' + name + '.svg');
          if (r.ok) { node.innerHTML = await r.text(); const s = node.firstElementChild; if (s) { s.removeAttribute('width'); s.removeAttribute('height'); } }
        } catch (e) {}
      }));
    };
  }

  /* grade list for onboarding placement (mirrors the app's 6 classes) */
  const CLASSES = [
    { id: 'gym-a', roman: 'I',   accent: '#D2693F', gr: 'Α΄ Γυμνασίου', en: '7th Grade' },
    { id: 'gym-b', roman: 'II',  accent: '#2F6F8E', gr: 'Β΄ Γυμνασίου', en: '8th Grade' },
    { id: 'gym-c', roman: 'III', accent: '#6E8B3D', gr: 'Γ΄ Γυμνασίου', en: '9th Grade' },
    { id: 'lyk-a', roman: 'IV',  accent: '#7C5AC2', gr: 'Α΄ Λυκείου',   en: '10th Grade' },
    { id: 'lyk-b', roman: 'V',   accent: '#C18A2C', gr: 'Β΄ Λυκείου',   en: '11th Grade' },
    { id: 'lyk-c', roman: 'VI',  accent: '#B0395A', gr: 'Γ΄ Λυκείου',   en: '12th Grade' },
  ];
  const route = (s) => { try { if (typeof window.goTo === 'function') window.goTo(s); } catch (e) {} };

  /* ══════════════════════════════════════════════════════════════
     FEATURE · First-visit onboarding (role → grade → guide)
     (ported from prototype js/student.js — STATE→SymStore, symGo→goTo)
     ══════════════════════════════════════════════════════════════ */
  window.SymOnboard = (function () {
    let ov, step, role, classId, guideOn;
    const SS = () => window.SymStore;
    function isDoneOb() { return !!SS().get('onboarded', 0); }
    function maybeStart() { if (!isDoneOb()) open(); }
    function reset() { SS().set('onboarded', 0); open(); }

    function open() {
      step = 0; role = null; classId = SS().get('onboard_class', 'gym-b'); guideOn = true;
      ov = el('div', { class: 'ob-ov', role: 'dialog', 'aria-modal': 'true' });
      window.symApplyThemeClass(ov);
      const card = el('div', { class: 'ob-card' }); ov.appendChild(card); ov._card = card;
      document.body.appendChild(ov); paint();
      requestAnimationFrame(() => ov.classList.add('in'));
      setTimeout(() => { if (ov) ov.classList.add('in'); }, 60);
    }
    function close() { if (!ov) return; ov.classList.remove('in'); const o = ov; ov = null; setTimeout(() => o.remove(), 300); }

    function finish() {
      SS().set('onboarded', 1);
      SS().set('guide_mode', guideOn ? 1 : 0);
      SS().set('onboard_role', role || 'student');
      if (role === 'student' && classId) SS().set('onboard_class', classId);
      close();
      if (window.SymGuide) SymGuide.sync();
      route(role === 'teacher' ? 'teacher' : role === 'parent' ? 'parent' : 'home');
    }

    function dots(n) { const total = role === 'teacher' ? 2 : 3; return el('div', { class: 'ob-dots' }, Array.from({ length: total }, (_, i) => el('span', { class: i <= n ? 'on' : '' }))); }

    function paint() {
      const card = ov._card; card.innerHTML = '';
      card.appendChild(el('button', { class: 'ob-skip', onclick: () => { SS().set('onboarded', 1); close(); } }, L({ gr: 'Παράλειψη', en: 'Skip' })));
      const mark = el('div', { class: 'ob-mark' }); mark.appendChild(brandMark()); card.appendChild(mark);
      if (step === 0) stepRole(card);
      else if (step === 1 && role === 'student') stepGrade(card);
      else if (step === 1 && role === 'parent') stepLinkChild(card);
      else stepFinish(card);
      if (window.injectIllus) injectIllus(card);
    }

    function stepRole(card) {
      card.appendChild(dots(0));
      card.appendChild(el('p', { class: 'ob-eyebrow' }, 'SymposiON'));
      card.appendChild(el('h2', { class: 'ob-ttl', html: L({ gr: 'Καλωσήρθες στο <em>Συμπόσιο</em>', en: 'Welcome to the <em>Symposion</em>' }) }));
      card.appendChild(el('p', { class: 'ob-sub' }, L({ gr: 'Πες μας ποιος είσαι — θα στήσουμε τα πάντα στα μέτρα σου.', en: 'Tell us who you are — we’ll set everything up for you.' })));
      const roles = el('div', { class: 'ob-roles' });
      const mk = (id, ic, nm, ds) => el('button', { class: 'ob-role' + (role === id ? ' sel' : ''), onclick: () => { role = id; step = 1; paint(); } }, [el('span', { class: 'ob-role__ic', 'data-illu': ic }), el('span', { class: 'ob-role__nm' }, L(nm)), el('span', { class: 'ob-role__ds' }, L(ds))]);
      roles.appendChild(mk('student', 'owl', { gr: 'Μαθητής', en: 'Student' }, { gr: 'Παίξε, μάθε, ανέβα επίπεδα.', en: 'Play, learn, level up.' }));
      roles.appendChild(mk('teacher', 'quill', { gr: 'Καθηγητής', en: 'Teacher' }, { gr: 'Φτιάξε τάξη & ανάθεσε εργασίες.', en: 'Build a class & assign work.' }));
      card.appendChild(roles);
      const parent = el('button', { class: 'ob-role' + (role === 'parent' ? ' sel' : ''), style: 'margin-top:12px;width:100%;flex-direction:row;align-items:center;gap:14px', onclick: () => { role = 'parent'; step = 1; paint(); } }, [el('span', { class: 'ob-role__ic', 'data-illu': 'philosopher' }), el('span', {}, [el('span', { class: 'ob-role__nm', style: 'display:block' }, L({ gr: 'Γονέας', en: 'Parent' })), el('span', { class: 'ob-role__ds' }, L({ gr: 'Δες την πρόοδο του παιδιού σου.', en: 'Follow your child’s progress.' }))])]);
      card.appendChild(parent);
    }

    function stepGrade(card) {
      card.appendChild(dots(1));
      card.appendChild(el('p', { class: 'ob-eyebrow' }, L({ gr: 'Βήμα 2', en: 'Step 2' })));
      card.appendChild(el('h2', { class: 'ob-ttl', html: L({ gr: 'Σε ποια <em>τάξη</em> είσαι;', en: 'Which <em>class</em> are you in?' }) }));
      card.appendChild(el('p', { class: 'ob-sub' }, L({ gr: 'Θα σου δείξουμε την ύλη και τα παιχνίδια της τάξης σου.', en: 'We’ll show the right material and games for your class.' })));
      [['gym', { gr: 'Γυμνάσιο', en: 'Gymnasio' }], ['lyk', { gr: 'Λύκειο', en: 'Lykeio' }]].forEach(([pre, lab]) => {
        const grp = el('div', { class: 'ob-gradegrp' });
        grp.appendChild(el('div', { class: 'ob-gradegrp__h' }, L(lab)));
        const row = el('div', { class: 'ob-grades' });
        CLASSES.filter(c => c.id.indexOf(pre) === 0).forEach(c => {
          const sel = classId === c.id;
          row.appendChild(el('button', { class: 'ob-grade' + (sel ? ' sel' : ''), style: sel ? `background:${c.accent};border-color:${c.accent}` : `border-color:${c.accent}`, onclick: () => { classId = c.id; paint(); } }, [el('span', { class: 'ob-grade__rom', style: `background:${c.accent}` }, c.roman), L(c)]));
        });
        grp.appendChild(row); card.appendChild(grp);
      });
      card.appendChild(el('div', { class: 'ob-foot' }, [el('button', { class: 'ob-back', onclick: () => { step = 0; paint(); } }, '← ' + L({ gr: 'Πίσω', en: 'Back' })), el('button', { class: 'syn-cta syn-cta--solid', onclick: () => { step = 2; paint(); } }, [L({ gr: 'Συνέχεια', en: 'Continue' }), el('span', { html: '&rarr;' })])]));
    }

    function stepLinkChild(card) {
      card.appendChild(dots(1));
      card.appendChild(el('p', { class: 'ob-eyebrow' }, L({ gr: 'Βήμα 2', en: 'Step 2' })));
      card.appendChild(el('h2', { class: 'ob-ttl', html: L({ gr: 'Σύνδεσε το <em>παιδί</em> σου', en: 'Link your <em>child</em>' }) }));
      card.appendChild(el('p', { class: 'ob-sub' }, L({ gr: 'Βάλε τον 6ψήφιο κωδικό από τον λογαριασμό του παιδιού σου. Μπορείς και αργότερα.', en: 'Enter the 6-character code from your child’s account. You can do this later too.' })));
      card.appendChild(el('input', { type: 'text', maxlength: '6', placeholder: 'ΑΛΕΞ24', style: 'width:100%;font-family:var(--disp);font-size:20px;letter-spacing:.3em;text-align:center;text-transform:uppercase;padding:14px;border-radius:14px;border:1.5px solid var(--line-bold);background:var(--bg);color:var(--fg);margin-bottom:20px' }));
      card.appendChild(el('div', { class: 'ob-foot' }, [el('button', { class: 'ob-back', onclick: () => { step = 0; paint(); } }, '← ' + L({ gr: 'Πίσω', en: 'Back' })), el('button', { class: 'syn-cta syn-cta--ghost', onclick: () => { step = 2; paint(); } }, L({ gr: 'Παράλειψη', en: 'Skip' })), el('button', { class: 'syn-cta syn-cta--solid', onclick: () => { step = 2; paint(); } }, [L({ gr: 'Σύνδεση', en: 'Link' }), el('span', { html: '&rarr;' })])]));
    }

    function stepFinish(card) {
      card.appendChild(dots(role === 'teacher' ? 1 : 2));
      card.appendChild(el('p', { class: 'ob-eyebrow' }, L({ gr: 'Έτοιμοι', en: 'All set' })));
      card.appendChild(el('h2', { class: 'ob-ttl', html: L({ gr: 'Είσαι <em>έτοιμος</em>', en: 'You’re <em>ready</em>' }) }));
      card.appendChild(el('p', { class: 'ob-sub' }, role === 'teacher'
        ? L({ gr: 'Θα σε πάμε στην Κονσόλα Καθηγητή για να φτιάξεις την πρώτη σου τάξη.', en: 'We’ll take you to the Teacher Console to build your first class.' })
        : role === 'parent'
        ? L({ gr: 'Θα σε πάμε στον Γονικό Πίνακα για να δεις την πρόοδο του παιδιού σου. Θες έναν οδηγό;', en: 'We’ll take you to the Parent dashboard. Want a guide?' })
        : L({ gr: 'Θα σε πάμε στην αρχική. Θες έναν οδηγό να σε ξεναγεί;', en: 'We’ll drop you on the home screen. Want a guide to show you around?' })));
      const sw = el('button', { class: 'ob-switch' + (guideOn ? ' on' : ''), 'aria-label': 'guide', onclick: (e) => { guideOn = !guideOn; e.currentTarget.classList.toggle('on', guideOn); } });
      card.appendChild(el('div', { class: 'ob-guide-row' }, [el('span', { class: 'ob-role__ic', style: 'width:30px;height:30px', 'data-illu': 'philosopher' }), el('div', { class: 'ob-guide-row__b' }, [el('div', { class: 'ob-guide-row__t' }, L({ gr: 'Λειτουργία Οδηγού', en: 'Guide mode' })), el('div', { class: 'ob-guide-row__d' }, L({ gr: 'Σύντομες συμβουλές σε κάθε οθόνη. Σβήνει όποτε θες.', en: 'Short tips on each screen. Turn it off anytime.' }))]), sw]));
      card.appendChild(el('div', { class: 'ob-foot' }, [el('button', { class: 'ob-back', onclick: () => { step = role === 'teacher' ? 0 : 1; paint(); } }, '← ' + L({ gr: 'Πίσω', en: 'Back' })), el('button', { class: 'syn-cta syn-cta--solid', onclick: finish }, [role === 'teacher' ? L({ gr: 'Στην Κονσόλα', en: 'To the Console' }) : role === 'parent' ? L({ gr: 'Στον Πίνακα', en: 'To the dashboard' }) : L({ gr: 'Μπες', en: 'Enter' }), el('span', { html: '&rarr;' })])]));
    }

    return { maybeStart, open, reset };
  })();

  /* ══════════════════════════════════════════════════════════════
     FEATURE · Guide mode (toggleable coach tips)
     ══════════════════════════════════════════════════════════════ */
  window.SymGuide = (function () {
    let fab, tip, dismissed = {};
    const SS = () => window.SymStore;
    const TIPS = {
      home: { w: { gr: 'Αρχική', en: 'Home' }, t: { gr: 'Από εδώ ξεκινούν όλα', en: 'Everything starts here' }, d: { gr: 'Διάλεξε την τάξη σου από τα κουμπιά, ή πάτα «Πίνακας» για όλα τα παιχνίδια.', en: 'Pick your class from the chips, or open the Panel for every game.' } },
      subject: { w: { gr: 'Μάθημα', en: 'Subject' }, t: { gr: 'Τα παιχνίδια του μαθήματος', en: 'The subject’s games' }, d: { gr: 'Διάλεξε παιχνίδι και επίπεδο — η μπάρα δείχνει την πρόοδό σου.', en: 'Pick a game and level — the bar shows your progress.' } },
      trivia: { w: { gr: 'Trivia', en: 'Trivia' }, t: { gr: 'Γρήγορες ερωτήσεις', en: 'Rapid questions' }, d: { gr: 'Απάντησε γρήγορα και κέρδισε Kleos.', en: 'Answer fast and earn Kleos.' } },
      teacher: { w: { gr: 'Καθηγητής', en: 'Teacher' }, t: { gr: 'Η κονσόλα σου', en: 'Your console' }, d: { gr: 'Φτιάξε τάξη, κάλεσε μαθητές και ανάθεσε εργασίες.', en: 'Build a class, invite students and assign work.' } },
    };
    function on() { return !!SS().get('guide_mode', 0); }
    function activeScreen() { const a = document.querySelector('.page.active'); return a ? a.id.replace('page-', '') : 'home'; }
    function mount() {
      if (fab) return;
      fab = el('button', { class: 'guide-fab', onclick: toggle }, [el('span', { class: 'guide-fab__q' }, '?'), el('span', { class: 'guide-fab__lbl' }, L({ gr: 'Οδηγός', en: 'Guide' }))]);
      tip = el('div', { class: 'guide-tip' });
      window.symApplyThemeClass(fab); window.symApplyThemeClass(tip);
      document.body.appendChild(fab); document.body.appendChild(tip); sync();
    }
    function toggle() { SS().set('guide_mode', on() ? 0 : 1); dismissed = {}; sync(); }
    function sync() {
      if (!fab) return;
      window.symApplyThemeClass(fab); window.symApplyThemeClass(tip);
      fab.classList.toggle('on', on());
      renderTip();
    }
    window.addEventListener('sym-store', (e) => { if (e.detail && e.detail.key === 'guide_mode') sync(); });
    function renderTip() {
      if (!tip) return;
      const screen = activeScreen(); const info = TIPS[screen];
      if (!on() || !info || dismissed[screen]) { tip.classList.remove('show'); return; }
      tip.innerHTML = '';
      tip.appendChild(el('div', { class: 'guide-tip__hd' }, [el('span', { class: 'guide-tip__dot' }), el('span', { class: 'guide-tip__where' }, L(info.w)), el('button', { class: 'guide-tip__x', html: '&times;', onclick: () => { dismissed[screen] = 1; tip.classList.remove('show'); } })]));
      tip.appendChild(el('div', { class: 'guide-tip__t' }, L(info.t)));
      tip.appendChild(el('div', { class: 'guide-tip__d' }, L(info.d)));
      tip.appendChild(el('div', { class: 'guide-tip__foot' }, [el('button', { class: 'guide-tip__off', onclick: () => { SS().set('guide_mode', 0); sync(); } }, L({ gr: 'Σβήσε τον οδηγό', en: 'Turn off guide' }))]));
      requestAnimationFrame(() => tip.classList.add('show'));
    }
    return { mount, sync, toggle, refresh: renderTip, isOn: on };
  })();

  /* ── boot ───────────────────────────────────────────────────────── */
  function boot() {
    try { window.SymConsent.start(); } catch (e) {}
    try { window.SymGuide.mount(); } catch (e) {}
    try { window.SymOnboard.maybeStart(); } catch (e) {}
    // keep the guide tip in sync when the app switches pages
    try {
      if (typeof window.goTo === 'function' && !window.goTo.__rvWrapped) {
        const og = window.goTo;
        window.goTo = function () { const r = og.apply(this, arguments); try { window.SymGuide.sync(); } catch (e) {} return r; };
        window.goTo.__rvWrapped = true;
      }
    } catch (e) {}
    // Gate the real sign-up behind the GDPR age/terms consent (non-breaking):
    // wrap openAuthModal('signup') so it runs consent first, then proceeds.
    try {
      if (typeof window.openAuthModal === 'function' && !window.openAuthModal.__rvWrapped) {
        const orig = window.openAuthModal;
        window.openAuthModal = function (mode) {
          if (mode === 'signup' && window.SymConsent && !window.SymStore.get('consent', 0)) {
            window.SymConsent.requireConsent(() => orig('signup'));
            return;
          }
          return orig.apply(this, arguments);
        };
        window.openAuthModal.__rvWrapped = true;
      }
    } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else setTimeout(boot, 0);
})();
