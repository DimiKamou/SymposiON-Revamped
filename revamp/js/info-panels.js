/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · INFO PANELS
   Footer "Information" destinations as preview panels: About · Contact ·
   Feedback (comments / bug reports). Content is admin-editable — About &
   Contact read SymStore keys edited in Admin → About; Feedback submissions
   are written to `user_feedback` and surface in Admin → Feedback.
     window.SymInfoPanel.about() / .contact() / .feedback()
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const E = function () { return window.el.apply(null, arguments); };
  const L = function (o) { return window.SYM.L(o); };
  const lang = () => window.SYM_LANG;
  const SS = () => window.SymStore;

  // shared defaults — mirror the Admin → About / Feedback editors
  const DEF = {
    about_title:   'Η αρχαιότητα, σαν παιχνίδι',
    about_mission: 'Το SymposiON μετατρέπει τα Αρχαία Ελληνικά, τα Ομηρικά Έπη, την Ιστορία και τα Λατινικά σε παιχνίδια — ώστε κάθε μαθητής να μαθαίνει παίζοντας.',
    about_contact: 'hello@symposi-on.com · Αθήνα, Ελλάδα',
    contact_email: 'hello@symposi-on.com',
    contact_address: 'Αθήνα, Ελλάδα',
    contact_hours: 'Δευτ–Παρ · 9:00–17:00',
  };
  window.SYM_INFO_DEFAULTS = DEF;

  function pushFeedback(entry) {
    const cur = SS().get('user_feedback', []);
    cur.unshift(Object.assign({ ts: Date.now(), new: 1 }, entry));
    SS().set('user_feedback', cur.slice(0, 60));
  }

  /* ── modal shell (reuses pv-overlay / pv-modal chrome) ── */
  function close() { const ov = document.querySelector('.info-ov'); if (ov) ov.remove(); document.removeEventListener('keydown', esc); }
  function esc(e) { if (e.key === 'Escape') close(); }

  function shell(opts) {
    close();
    const ov = E('div', { class: 'pv-overlay info-ov', onclick: (e) => { if (e.target === ov) close(); } });
    const box = E('div', { class: 'pv-modal info-modal' });
    box.appendChild(E('div', { class: 'pv-modal__bar' }, [
      E('div', { class: 'pv-modal__title' }, [ E('span', { class: 'pv-modal__dot' }), opts.title ]),
      E('div', { class: 'pv-modal__tools' }, [
        (window.STATE && window.STATE.role === 'admin')
          ? E('button', { class: 'info-editlink', title: L({ gr: 'Επεξεργασία στο Admin', en: 'Edit in Admin' }), onclick: () => { close(); window.__adminSec = opts.adminSec || 'about'; window.symGo('admin'); } },
              [ E('span', { class: 'info-editlink__q' }, '✎'), L({ gr: 'Επεξεργασία', en: 'Edit' }) ])
          : null,
        E('button', { class: 'pv-modal__x', onclick: close, html: '&times;' }),
      ]),
    ]));
    box.appendChild(opts.body);
    ov.appendChild(box);
    document.querySelector('.stage').appendChild(ov);
    if (window.injectIllus) window.injectIllus(ov);
    requestAnimationFrame(() => ov.classList.add('in'));
    if (window.gsap) gsap.from(box, { y: 24, scale: .96, autoAlpha: 0, duration: .4, ease: 'back.out(1.5)' });
    document.addEventListener('keydown', esc);
    return { ov, box };
  }

  function markNode() { const m = E('div', { class: 'info-mark' }); if (window.brandMark) m.appendChild(window.brandMark('info-mark__svg')); return m; }
  function metaRow(illu, label, value) {
    return E('div', { class: 'info-meta__row' }, [
      E('span', { class: 'info-meta__ic', 'data-illu': illu }),
      E('div', {}, [ E('span', { class: 'info-meta__l' }, label), E('span', { class: 'info-meta__v' }, value) ]),
    ]);
  }

  /* ── ABOUT ── */
  function about() {
    const g = (k) => SS().get(k, DEF[k]);
    const body = E('div', { class: 'info-body' }, [
      E('div', { class: 'info-hero' }, [ markNode(), E('div', {}, [
        E('div', { class: 'info-kicker' }, L({ gr: 'Σχετικά με το SymposiON', en: 'About SymposiON' })),
        E('h3', { class: 'info-title' }, g('about_title')),
      ]) ]),
      E('p', { class: 'info-lead' }, g('about_mission')),
      E('div', { class: 'info-meta' }, [ metaRow('world', L({ gr: 'Επικοινωνία', en: 'Reach us' }), g('about_contact')) ]),
    ]);
    shell({ title: L({ gr: 'Σχετικά', en: 'About' }), adminSec: 'about', body });
  }

  /* ── CONTACT ── */
  function contactCard(illu, label, value) {
    return E('div', { class: 'info-card' }, [
      E('span', { class: 'info-card__ic', 'data-illu': illu }),
      E('span', { class: 'info-card__l' }, label),
      E('span', { class: 'info-card__v' }, value),
    ]);
  }
  function contact() {
    const g = (k) => SS().get(k, DEF[k]);
    const body = E('div', { class: 'info-body' }, [
      E('p', { class: 'info-lead' }, L({ gr: 'Έχεις ερώτηση ή πρόταση; Στείλε μας μήνυμα ή χρησιμοποίησε τα στοιχεία παρακάτω.', en: 'A question or a suggestion? Send us a message or use the details below.' })),
      E('div', { class: 'info-cards' }, [
        contactCard('speech', L({ gr: 'Email', en: 'Email' }), g('contact_email')),
        contactCard('map', L({ gr: 'Διεύθυνση', en: 'Address' }), g('contact_address')),
        contactCard('hourglass', L({ gr: 'Ώρες', en: 'Hours' }), g('contact_hours')),
      ]),
      msgForm({ kind: 'contact' }),
    ]);
    shell({ title: L({ gr: 'Επικοινωνία', en: 'Contact' }), adminSec: 'about', body });
  }

  /* ── FEEDBACK (comments / bug reports) ── */
  function feedback() {
    const body = E('div', { class: 'info-body' }, [
      E('p', { class: 'info-lead' }, L({ gr: 'Μοιράσου ένα σχόλιο ή ανάφερε ένα πρόβλημα — η ομάδα μας τα διαβάζει όλα.', en: 'Leave a comment or report a bug — our team reads every one.' })),
      msgForm({ kind: 'feedback', withType: true }),
      recentComments(),
    ]);
    shell({ title: L({ gr: 'Σχόλια & Αναφορές', en: 'Feedback & Reports' }), adminSec: 'feedback', body });
  }

  function recentComments() {
    const items = (SS().get('user_feedback', [])).filter(f => f.kind === 'comment' && f.t).slice(0, 3);
    if (!items.length) return null;
    const wrap = E('div', { class: 'info-recent' }, [ E('div', { class: 'info-recent__h' }, L({ gr: 'Πρόσφατα σχόλια', en: 'Recent comments' })) ]);
    items.forEach(f => wrap.appendChild(E('div', { class: 'info-rc' }, [ E('span', { class: 'info-rc__n' }, f.n || L({ gr: 'Ανώνυμος', en: 'Anonymous' })), E('p', { class: 'info-rc__t' }, f.t) ])));
    return wrap;
  }

  /* ── shared message form ── */
  function msgForm(opts) {
    opts = opts || {};
    const wrap = E('div', { class: 'info-form' });
    let kind = opts.withType ? 'comment' : 'contact';
    if (opts.withType) {
      wrap.appendChild(E('div', { class: 'info-form__lbl' }, L({ gr: 'Τι θέλεις να μας πεις;', en: 'What would you like to tell us?' })));
      const seg = E('div', { class: 'info-seg' });
      [['comment', { gr: 'Σχόλιο', en: 'Comment' }, 'speech'], ['bug', { gr: 'Αναφορά bug', en: 'Bug report' }, 'shield-round']].forEach(([v, lab, ic]) => {
        seg.appendChild(E('button', { class: 'info-seg__b' + (v === kind ? ' on' : ''), 'data-k': v, onclick: () => {
          kind = v; seg.querySelectorAll('.info-seg__b').forEach(b => b.classList.toggle('on', b.dataset.k === v));
          ref.style.display = v === 'bug' ? '' : 'none';
        } }, [ E('span', { class: 'info-seg__ic', 'data-illu': ic }), L(lab) ]));
      });
      wrap.appendChild(seg);
    }
    const name = E('input', { class: 'info-input', placeholder: L({ gr: 'Το όνομά σου (προαιρετικό)', en: 'Your name (optional)' }) });
    const msg = E('textarea', { class: 'info-input info-textarea', rows: '3', placeholder: opts.kind === 'contact'
      ? L({ gr: 'Το μήνυμά σου…', en: 'Your message…' })
      : L({ gr: 'Γράψε το σχόλιο ή το πρόβλημα…', en: 'Write your comment or the problem…' }) });
    const ref = E('input', { class: 'info-input info-form__ref', placeholder: L({ gr: 'Πού το συνάντησες; π.χ. Live Arena (προαιρετικό)', en: 'Where did you find it? e.g. Live Arena (optional)' }), style: 'display:none' });
    wrap.appendChild(name); wrap.appendChild(msg);
    if (opts.withType) wrap.appendChild(ref);
    const submit = E('button', { class: 'info-submit', onclick: () => {
      const text = (msg.value || '').trim();
      if (!text) { msg.classList.add('shake'); setTimeout(() => msg.classList.remove('shake'), 420); msg.focus(); return; }
      pushFeedback({
        n: (name.value || '').trim() || (lang() === 'en' ? 'Anonymous' : 'Ανώνυμος'),
        kind: opts.kind === 'contact' ? 'contact' : kind,
        t: text,
        ref: (ref.value || '').trim() || null,
      });
      const done = E('div', { class: 'info-done' }, [
        E('span', { class: 'info-done__ic', 'data-illu': 'wreath-laurel' }),
        E('div', {}, [
          E('strong', {}, L({ gr: 'Ευχαριστούμε!', en: 'Thank you!' })),
          E('p', {}, L({ gr: 'Το μήνυμά σου στάλθηκε στην ομάδα και θα εμφανιστεί στη Διαχείριση.', en: 'Your message was sent to the team and will appear in Admin.' })),
        ]),
      ]);
      wrap.replaceWith(done);
      if (window.injectIllus) window.injectIllus(done);
    } }, L({ gr: 'Αποστολή', en: 'Send' }));
    wrap.appendChild(E('div', { class: 'info-form__foot' }, [ submit ]));
    return wrap;
  }

  /* ════════════════ GUIDES (admin-editable how-to-play) ════════════════
     Stored in SymStore 'guides' (editable in Admin → Guides). Each guide:
     { id, illu, kicker, headline, intro, steps:[…], ctaLabel, ctaScreen } */
  const DEFAULT_GUIDES = [
    { id: 'g-anodos', illu: 'acropolis', kicker: 'Πώς να παίξεις', headline: 'Άνοδος',
      intro: 'Σκαρφάλωσε από τον Τάρταρο στον Όλυμπο, απαντώντας σωστά σε κάθε βήμα. Μια ήττα επαναφέρει τη διαδρομή — αλλά κρατάς ό,τι έμαθες.',
      steps: [
        'Διάλεξε μάθημα και ξεκίνα από τον Τάρταρο.',
        'Απάντησε στον γρίφο κάθε σκαλοπατιού για να ανέβεις.',
        'Νίκησε τον φύλακα στο τέλος κάθε επιπέδου.',
        'Έφτασε στον Όλυμπο για να κερδίσεις Kleos & παράσημα.',
      ], ctaLabel: 'Παίξε Άνοδος', ctaScreen: 'anodos' },
    { id: 'g-olympia', illu: 'wreath-laurel', kicker: 'Ξεκλείδωσε ανταμοιβές', headline: 'Ολυμπία',
      intro: 'Η Ολυμπία (πρώην Ναός των Μουσών) είναι ο χώρος ανταμοιβών. Κέρδισε Kleos παίζοντας και ξεκλείδωσε θέματα, δείκτες και εφέ για την αρχική σου.',
      steps: [
        'Μάζεψε Kleos από παιχνίδια, άθλους & saga.',
        'Άνοιξε την Ολυμπία και διάλεξε στολίδι.',
        'Ξεκλείδωσε θέματα, δείκτες (cursors) & εφέ κίνησης.',
        'Φόρεσέ τα — η αρχική σου αλλάζει όψη.',
      ], ctaLabel: 'Άνοιξε την Ολυμπία', ctaScreen: 'temple' },
  ];
  window.SYM_GUIDES_DEFAULT = DEFAULT_GUIDES;
  function getGuides() { const g = SS().get('guides', null); return (g && g.length) ? g : DEFAULT_GUIDES; }

  function guides() {
    const list = getGuides();
    const wrap = E('div', { class: 'info-body' }, [
      E('p', { class: 'info-lead' }, L({ gr: 'Οδηγοί & how-to-play για τα παιχνίδια και τους χώρους του SymposiON.', en: 'Guides & how-to-play for the games and spaces of SymposiON.' })),
    ]);
    const grid = E('div', { class: 'info-guides' });
    list.forEach(g => grid.appendChild(E('button', { class: 'info-guide', onclick: () => guide(g.id) }, [
      E('span', { class: 'info-guide__ic', 'data-illu': g.illu || 'book' }),
      E('span', { class: 'info-guide__tx' }, [
        E('span', { class: 'info-guide__kick' }, g.kicker || L({ gr: 'Οδηγός', en: 'Guide' })),
        E('strong', { class: 'info-guide__hd' }, g.headline || ''),
        E('span', { class: 'info-guide__in' }, g.intro || ''),
      ]),
      E('span', { class: 'info-guide__arr', html: '&rarr;' }),
    ])));
    wrap.appendChild(grid);
    shell({ title: L({ gr: 'Οδηγοί', en: 'Guides' }), adminSec: 'guides', body: wrap });
  }

  function guide(id) {
    const g = getGuides().find(x => x.id === id) || getGuides()[0];
    if (!g) return guides();
    const body = E('div', { class: 'info-body' }, [
      E('button', { class: 'info-back', onclick: guides }, [ E('span', { html: '&larr;' }), L({ gr: 'Όλοι οι οδηγοί', en: 'All guides' }) ]),
      E('div', { class: 'info-hero' }, [
        E('div', { class: 'info-mark info-mark--illu' }, [ E('span', { class: 'info-mark__illu', 'data-illu': g.illu || 'book' }) ]),
        E('div', {}, [ E('div', { class: 'info-kicker' }, g.kicker || ''), E('h3', { class: 'info-title' }, g.headline || '') ]),
      ]),
      E('p', { class: 'info-lead' }, g.intro || ''),
      E('ol', { class: 'info-steps' }, (g.steps || []).map(s => E('li', { class: 'info-step' }, [ E('span', { class: 'info-step__t' }, s) ]))),
    ]);
    if (g.ctaScreen) body.appendChild(E('div', { class: 'info-form__foot' }, [
      E('button', { class: 'info-submit', onclick: () => { close(); window.symGo(g.ctaScreen); } }, [ g.ctaLabel || L({ gr: 'Άνοιγμα', en: 'Open' }), E('span', { html: ' &rarr;' }) ]),
    ]));
    shell({ title: g.headline || L({ gr: 'Οδηγός', en: 'Guide' }), adminSec: 'guides', body });
  }

  window.SymInfoPanel = { about, contact, feedback, guides, guide, close, open: (k) => ({ about, contact, feedback, guides }[k] || about)() };
})();
