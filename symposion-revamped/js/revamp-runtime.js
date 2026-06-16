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

  /* ── boot ───────────────────────────────────────────────────────── */
  function boot() {
    try { window.SymConsent.start(); } catch (e) {}
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
