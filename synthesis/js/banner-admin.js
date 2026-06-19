/* ════════════════════════════════════════════════════════════════════
   SymposiON · BANNER ADMIN  (self-contained component)
   ────────────────────────────────────────────────────────────────────
   window.BannerAdmin.render(paneEl) builds, inside the given pane element:

     • a bilingual CREATE form (type, title GR/EN, body GR/EN, CTA GR/EN,
       CTA action, expiry)
     • a LIVE PREVIEW that uses the real css/site-banners.css classes, so
       the admin sees exactly how the banner will appear on the site
     • a "Seed example banners" button (loads the 6 handoff banners)
     • a LIST of existing banners, each with inline EDIT (calls
       adminUpdateBanner) and an Activate/Deactivate toggle

   The lead mounts this from the admin 'banners' section with:
       if (window.BannerAdmin) BannerAdmin.render(pane);

   Backend lives in js/admin.js (adminCreateBannerFromFields,
   adminUpdateBanner, adminSetBannerActive, adminSeedBanners,
   adminLoadAllBanners) — all guarded + SymStore-mirrored.

   Dependency-light: uses window.el / window.L when present, else minimal
   DOM. Styles with existing sc-* admin classes where possible, plus the
   site-banners css for the preview.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── helpers (reuse the app's, fall back to minimal) ─────────────── */
  function L(o) {
    if (typeof window.L === 'function') return window.L(o);
    if (!o) return '';
    var l = (window.SYM_LANG || window.siteLang || 'gr');
    return l === 'en' ? (o.en || o.gr || '') : (o.gr || o.en || '');
  }
  function lang() {
    var l = (window.SYM_LANG || window.siteLang || 'gr');
    return l === 'en' ? 'en' : 'gr';
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function mk(tag, attrs, kids) {
    if (typeof window.el === 'function') return window.el(tag, attrs, kids);
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'style') n.setAttribute('style', attrs[k]);
      else if (k.indexOf('on') === 0 && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
      if (c == null) return;
      n.appendChild((typeof c === 'string' || typeof c === 'number') ? document.createTextNode(String(c)) : c);
    });
    return n;
  }
  function isAdminOk() { return (typeof isAdmin === 'undefined') ? true : !!isAdmin; }
  function toast(gr, en) {
    if (typeof window.showToast === 'function') { window.showToast(gr, en); return; }
    try { console.log('[banner-admin]', lang() === 'en' ? (en || gr) : gr); } catch (_) {}
  }

  /* ── the six handoff seed banners (kept here so seeding has no fetch
        dependency; mirrors banners.seed.json) ─────────────────────────── */
  var SEED = [
    { type:'promo', titleGr:'Καλοκαιρινή προσφορά', titleEn:'Summer offer',
      bodyGr:'−30% στο ετήσιο Pro — όλη η ύλη, όλα τα παιχνίδια, ένα έτος.',
      bodyEn:'−30% on annual Pro — every subject, every game, for a full year.',
      ctaGr:'Απόκτησέ το', ctaEn:'Get the deal', ctaAction:"goTo('offers')", endsAt:'2026-07-31' },
    { type:'info', titleGr:'Νέο παιχνίδι: Λαβύρινθος', titleEn:'New game: Labyrinth',
      bodyGr:'Βυθίσου στον λαβύρινθο του Μινώταυρου και δοκίμασε τα Αρχαία σου.',
      bodyEn:"Descend into the Minotaur's maze and put your Ancient Greek to the test.",
      ctaGr:'Παίξε τώρα', ctaEn:'Play now', ctaAction:"goTo('browse')", endsAt:null },
    { type:'promo', titleGr:'Δοκίμασε δωρεάν 7 ημέρες', titleEn:'Try 7 days free',
      bodyGr:'Ξεκλείδωσε ολόκληρη τη βιβλιοθήκη — χωρίς κάρτα, χωρίς δέσμευση.',
      bodyEn:'Unlock the whole library — no card, no commitment.',
      ctaGr:'Ξεκίνα δωρεάν', ctaEn:'Start free', ctaAction:"goTo('offers')", endsAt:null },
    { type:'info', titleGr:'Θερινό πρόγραμμα μελέτης', titleEn:'Summer study plan',
      bodyGr:'Καθημερινά κουίζ επανάληψης για να κρατήσεις τη φόρμα σου το καλοκαίρι.',
      bodyEn:'Daily revision quizzes to keep you sharp over the break.',
      ctaGr:'Δες το πρόγραμμα', ctaEn:'See the plan', ctaAction:"goTo('browse')", endsAt:null },
    { type:'warning', titleGr:'Προγραμματισμένη συντήρηση', titleEn:'Scheduled maintenance',
      bodyGr:'Κυριακή 22/06, 02:00–04:00. Σύντομη διακοπή — η πρόοδός σου είναι ασφαλής.',
      bodyEn:'Sun 22 Jun, 02:00–04:00. Brief downtime — your progress is safe.',
      ctaGr:'', ctaEn:'', ctaAction:'', endsAt:'2026-06-22' },
    { type:'promo', titleGr:'Φέρε έναν φίλο', titleEn:'Refer a friend',
      bodyGr:'Μάθετε Αρχαία παρέα — μοιράσου το SymposiON με μια κλικ.',
      bodyEn:'Learn the classics together — share SymposiON in one tap.',
      ctaGr:'Μοιράσου το', ctaEn:'Share it',
      ctaAction:"navigator.share?navigator.share({title:'SymposiON',text:'Μάθε Αρχαία Ελληνικά παίζοντας!',url:location.origin}):(navigator.clipboard.writeText(location.origin),(window.showToast&&showToast('Ο σύνδεσμος αντιγράφηκε!','Link copied!')))",
      endsAt:null },
  ];

  var TYPES = [
    ['info',    { gr:'Πληροφορία', en:'Info' }],
    ['promo',   { gr:'Προσφορά',   en:'Promo' }],
    ['warning', { gr:'Προειδοποίηση', en:'Warning' }],
  ];

  /* ── form field ids (scoped to this component) ───────────────────── */
  var F = {
    type:'ba-type', titleGr:'ba-title-gr', titleEn:'ba-title-en',
    bodyGr:'ba-body-gr', bodyEn:'ba-body-en',
    ctaGr:'ba-cta-gr', ctaEn:'ba-cta-en', ctaAction:'ba-cta-action',
    expiry:'ba-expiry',
  };

  var _pane = null;            // mount element
  var _editingId = null;       // null = create mode, else editing this banner

  function $(id) { return _pane ? _pane.querySelector('#' + id) : document.getElementById(id); }
  function val(id) { var e = $(id); return e ? (e.value || '').trim() : ''; }
  function setVal(id, v) { var e = $(id); if (e) e.value = (v == null ? '' : v); }

  /* ── read the form into a fields object ──────────────────────────── */
  function readForm() {
    return {
      type:      val(F.type) || 'info',
      titleGr:   val(F.titleGr), titleEn: val(F.titleEn),
      bodyGr:    val(F.bodyGr),  bodyEn:  val(F.bodyEn),
      ctaGr:     val(F.ctaGr),   ctaEn:   val(F.ctaEn),
      ctaAction: val(F.ctaAction),
      expiry:    val(F.expiry),
    };
  }
  function clearForm() {
    setVal(F.titleGr, ''); setVal(F.titleEn, '');
    setVal(F.bodyGr, '');  setVal(F.bodyEn, '');
    setVal(F.ctaGr, '');   setVal(F.ctaEn, '');
    setVal(F.ctaAction, ''); setVal(F.expiry, '');
    var ty = $(F.type); if (ty) ty.value = 'info';
    _editingId = null;
    updateSubmitLabel();
    updatePreview();
  }

  function updateSubmitLabel() {
    var btn = $('ba-submit');
    if (!btn) return;
    btn.textContent = _editingId
      ? L({ gr:'✓ Αποθήκευση αλλαγών', en:'✓ Save changes' })
      : L({ gr:'＋ Δημοσίευση', en:'＋ Publish' });
    var cancel = $('ba-cancel-edit');
    if (cancel) cancel.style.display = _editingId ? '' : 'none';
  }

  /* ── live preview using the real site-banners.css classes ────────── */
  function updatePreview() {
    var host = $('ba-preview');
    if (!host) return;
    var d = readForm();
    var title = lang() === 'en' ? (d.titleEn || d.titleGr) : d.titleGr;
    var body  = lang() === 'en' ? (d.bodyEn  || d.bodyGr ) : d.bodyGr;
    var cta   = lang() === 'en' ? (d.ctaEn   || d.ctaGr  ) : d.ctaGr;
    if (!title) title = L({ gr:'(τίτλος banner)', en:'(banner title)' });

    host.innerHTML =
      '<div class="site-banner site-banner--' + (d.type || 'info') + '">' +
        '<div class="site-banner-body">' +
          '<strong class="site-banner-title">' + esc(title) + '</strong>' +
          (body ? '<span class="site-banner-text">' + esc(body) + '</span>' : '') +
          (cta && d.ctaAction
            ? '<button class="site-banner-cta" type="button" onclick="return false">' + esc(cta) + '</button>'
            : '') +
        '</div>' +
        '<button class="site-banner-close" type="button" onclick="return false" aria-label="Close">&#10005;</button>' +
      '</div>';
  }

  /* ── small DOM builders (label + input/textarea/select) ──────────── */
  /* Inputs sit on white cards inside the light admin. Pin an EXPLICIT dark ink
     (#241c14) + readable placeholder instead of `color:inherit`, which risked a
     light-on-white wash if an ancestor set a pale text colour. */
  var INK = '#241c14';
  var INP_STYLE = 'padding:9px 11px;border-radius:9px;border:1px solid rgba(0,0,0,.28);'
                + 'font:inherit;font-size:14px;background:#fff;color:' + INK + ';width:100%;';

  function field(labelObj, inputNode) {
    return mk('label', { class:'ba-field', style:'display:flex;flex-direction:column;gap:5px;flex:1;min-width:160px;' }, [
      // label: explicit dark ink + full opacity so it never reads light-on-light.
      mk('span', { class:'ba-field-lbl', style:'font-size:11.5px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:' + INK + ';opacity:.92;' }, L(labelObj)),
      inputNode,
    ]);
  }
  function input(id, placeholder) {
    var n = mk('input', { id:id, type:'text', class:'sc-inp ba-inp', placeholder:placeholder || '',
      style:INP_STYLE });
    n.addEventListener('input', updatePreview);
    return n;
  }
  function textarea(id, placeholder) {
    var n = mk('textarea', { id:id, rows:'2', class:'sc-inp ba-inp', placeholder:placeholder || '',
      style:INP_STYLE + 'resize:vertical;' });
    n.addEventListener('input', updatePreview);
    return n;
  }
  function dateInput(id) {
    var n = mk('input', { id:id, type:'date', class:'sc-inp ba-inp',
      style:INP_STYLE });
    n.addEventListener('input', updatePreview);
    return n;
  }
  function typeSelect(id) {
    var sel = mk('select', { id:id, class:'sc-inp ba-inp',
      style:INP_STYLE },
      TYPES.map(function (tp) { return mk('option', { value:tp[0] }, L(tp[1])); }));
    sel.addEventListener('change', updatePreview);
    return sel;
  }

  /* ── CREATE / SAVE submit ────────────────────────────────────────── */
  async function onSubmit() {
    if (!isAdminOk()) return;
    var d = readForm();
    if (!d.titleGr) { toast('Συμπλήρωσε τίτλο (GR).', 'Enter a title (GR).'); return; }

    var btn = $('ba-submit');
    if (btn) btn.disabled = true;
    try {
      var ok;
      if (_editingId) {
        ok = await window.adminUpdateBanner(_editingId, d);
        toast(ok ? '✓ Το banner ενημερώθηκε.' : 'Σφάλμα ενημέρωσης.',
              ok ? '✓ Banner updated.' : 'Update error.');
      } else {
        var id = await window.adminCreateBannerFromFields(d);
        ok = !!id;
        toast(ok ? '✓ Το banner δημοσιεύτηκε.' : 'Σφάλμα δημιουργίας.',
              ok ? '✓ Banner published.' : 'Creation error.');
      }
      if (ok) { clearForm(); await refreshList(); }
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  /* ── EDIT: prefill the form from a banner row ────────────────────── */
  function startEdit(b) {
    _editingId = b.id;
    var ty = $(F.type); if (ty) ty.value = b.type || 'info';
    setVal(F.titleGr, b.titleGr); setVal(F.titleEn, b.titleEn);
    setVal(F.bodyGr,  b.bodyGr);  setVal(F.bodyEn,  b.bodyEn);
    setVal(F.ctaGr,   b.ctaGr);   setVal(F.ctaEn,   b.ctaEn);
    setVal(F.ctaAction, b.ctaAction);
    setVal(F.expiry, (typeof b.endsAt === 'string') ? b.endsAt : '');
    updateSubmitLabel();
    updatePreview();
    var form = $('ba-form'); if (form && form.scrollIntoView) form.scrollIntoView({ block:'center', behavior:'smooth' });
  }

  async function onToggleActive(b) {
    if (!isAdminOk()) return;
    var ok = await window.adminSetBannerActive(b.id, !b.active);
    if (ok) await refreshList();
  }

  async function onSeed() {
    if (!isAdminOk()) return;
    var btn = $('ba-seed');
    if (btn) btn.disabled = true;
    try {
      var n = await window.adminSeedBanners(SEED);
      toast('✓ Προστέθηκαν ' + n + ' banners.', '✓ Seeded ' + n + ' banners.');
      await refreshList();
    } finally {
      if (btn) btn.disabled = false;
    }
  }

  /* ── render the existing-banners list ────────────────────────────── */
  async function refreshList() {
    var host = $('ba-list');
    if (!host) return;
    host.innerHTML = '<div class="ba-empty" style="color:' + INK + ';opacity:.7;font-size:13px;padding:8px 0;">' +
      esc(L({ gr:'Φόρτωση…', en:'Loading…' })) + '</div>';

    var banners = [];
    try { banners = await window.adminLoadAllBanners(); } catch (_) { banners = []; }

    if (!banners.length) {
      host.innerHTML = '<div class="ba-empty" style="color:' + INK + ';opacity:.7;font-size:13px;padding:8px 0;">' +
        esc(L({ gr:'Δεν υπάρχουν banners ακόμη.', en:'No banners yet.' })) + '</div>';
      return;
    }

    host.innerHTML = '';
    var typeTag = { info:'ℹ️', promo:'🏷️', warning:'⚠️' };
    banners.forEach(function (b) {
      var expired = (typeof b.endsAt === 'string') && (Date.parse(b.endsAt + 'T23:59:59') < Date.now());
      var statusGr = !b.active ? 'Ανενεργό' : (expired ? 'Έληξε' : 'Ενεργό');
      var statusEn = !b.active ? 'Inactive' : (expired ? 'Expired' : 'Active');
      var statusColor = !b.active ? '#9a8d78' : (expired ? '#b8742f' : '#2f8f5b');

      var row = mk('div', { class:'ba-row',
        style:'display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid rgba(0,0,0,.1);border-radius:10px;margin-bottom:8px;' + (b.active ? '' : 'opacity:.62;') });

      var meta = mk('div', { style:'flex:1;min-width:0;' }, [
        mk('div', { style:'font-weight:700;font-size:13.5px;color:' + INK + ';white-space:nowrap;overflow:hidden;text-overflow:ellipsis;' },
          (typeTag[b.type] || 'ℹ️') + ' ' + (b.titleGr || b.titleEn || '—')),
        mk('div', { style:'font-size:11.5px;color:' + INK + ';opacity:.78;margin-top:3px;display:flex;gap:10px;flex-wrap:wrap;' }, [
          mk('span', { style:'color:' + statusColor + ';font-weight:700;opacity:1;' }, L({ gr:statusGr, en:statusEn })),
          mk('span', {}, L({ gr:'Λήξη', en:'Exp' }) + ': ' + ((typeof b.endsAt === 'string') ? b.endsAt : '∞')),
          b.ctaGr ? mk('span', {}, 'CTA: ' + b.ctaGr) : null,
        ]),
      ]);

      var actions = mk('div', { style:'display:flex;gap:6px;flex-shrink:0;' }, [
        mk('button', { class:'sc-mini ba-act', type:'button',
          style:'padding:6px 11px;border-radius:8px;border:1px solid rgba(0,0,0,.28);background:#fff;color:' + INK + ';cursor:pointer;font:inherit;font-size:12px;font-weight:600;',
          onclick: function () { startEdit(b); } }, '✎ ' + L({ gr:'Επεξεργασία', en:'Edit' })),
        mk('button', { class:'sc-mini ba-act', type:'button',
          style:'padding:6px 11px;border-radius:8px;border:1px solid rgba(0,0,0,.28);background:#fff;color:' + INK + ';cursor:pointer;font:inherit;font-size:12px;font-weight:600;',
          onclick: function () { onToggleActive(b); } },
          b.active ? L({ gr:'Απενεργοποίηση', en:'Deactivate' }) : L({ gr:'Ενεργοποίηση', en:'Activate' })),
      ]);

      row.appendChild(meta);
      row.appendChild(actions);
      host.appendChild(row);
    });
  }

  /* ── build the whole component into the pane ─────────────────────── */
  function render(paneEl) {
    _pane = paneEl || document.body;
    _editingId = null;
    _pane.innerHTML = '';

    // Heading — explicit dark ink so it never inherits a pale shell colour.
    _pane.appendChild(mk('div', { class:'sc-panel__h',
      style:'font-size:20px;font-weight:800;color:' + INK + ';margin-bottom:4px;' },
      L({ gr:'Banners & ανακοινώσεις', en:'Banners & announcements' })));
    _pane.appendChild(mk('p', { style:'font-size:13.5px;color:' + INK + ';opacity:.82;margin:0 0 16px;max-width:60ch;' },
      L({ gr:'Δημιούργησε, επεξεργάσου και ενεργοποίησε τη γραμμή ανακοινώσεων στην κορυφή του site. Η προεπισκόπηση δείχνει ακριβώς πώς θα εμφανιστεί.',
          en:'Create, edit and toggle the announcement strip at the top of the site. The preview shows exactly how it will appear.' })));

    /* ── CREATE / EDIT form ── */
    var form = mk('div', { id:'ba-form', class:'sc-card',
      style:'border:1px solid rgba(0,0,0,.1);border-radius:14px;padding:16px;margin-bottom:18px;background:rgba(255,255,255,.55);' });

    form.appendChild(mk('div', { style:'display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;' }, [
      field({ gr:'Τύπος', en:'Type' }, typeSelect(F.type)),
      field({ gr:'Λήξη (προαιρετικό)', en:'Expiry (optional)' }, dateInput(F.expiry)),
    ]));
    form.appendChild(mk('div', { style:'display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;' }, [
      field({ gr:'Τίτλος (GR)', en:'Title (GR)' }, input(F.titleGr, 'Καλοκαιρινή προσφορά')),
      field({ gr:'Τίτλος (EN)', en:'Title (EN)' }, input(F.titleEn, 'Summer offer')),
    ]));
    form.appendChild(mk('div', { style:'display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;' }, [
      field({ gr:'Κείμενο (GR)', en:'Body (GR)' }, textarea(F.bodyGr, '')),
      field({ gr:'Κείμενο (EN)', en:'Body (EN)' }, textarea(F.bodyEn, '')),
    ]));
    form.appendChild(mk('div', { style:'display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;' }, [
      field({ gr:'CTA (GR)', en:'CTA (GR)' }, input(F.ctaGr, 'Απόκτησέ το')),
      field({ gr:'CTA (EN)', en:'CTA (EN)' }, input(F.ctaEn, 'Get the deal')),
    ]));
    form.appendChild(mk('div', { style:'display:flex;gap:12px;flex-wrap:wrap;margin-bottom:14px;' }, [
      field({ gr:'Ενέργεια CTA (JS)', en:'CTA action (JS)' }, input(F.ctaAction, "goTo('offers')")),
    ]));

    var submit = mk('button', { id:'ba-submit', class:'sc-act primary', type:'button',
      style:'padding:10px 18px;border-radius:10px;border:none;background:#C8512E;color:#fff;font-weight:700;cursor:pointer;font:inherit;',
      onclick: onSubmit }, L({ gr:'＋ Δημοσίευση', en:'＋ Publish' }));
    var cancelEdit = mk('button', { id:'ba-cancel-edit', type:'button',
      style:'display:none;padding:10px 16px;border-radius:10px;border:1px solid rgba(0,0,0,.28);background:#fff;color:' + INK + ';font-weight:600;cursor:pointer;font:inherit;margin-left:8px;',
      onclick: clearForm }, L({ gr:'Άκυρο', en:'Cancel' }));
    form.appendChild(mk('div', { style:'display:flex;align-items:center;' }, [submit, cancelEdit]));

    _pane.appendChild(form);

    /* ── LIVE PREVIEW ── */
    _pane.appendChild(mk('div', { style:'font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:' + INK + ';opacity:.78;margin:0 0 8px;' },
      L({ gr:'Προεπισκόπηση', en:'Live preview' })));
    // Dark frame so the dark banner reads correctly against the light admin.
    _pane.appendChild(mk('div', { id:'ba-preview',
      style:'border-radius:12px;overflow:hidden;border:1px solid rgba(0,0,0,.18);background:#0D0B09;margin-bottom:22px;' }));

    /* ── EXISTING LIST + SEED ── */
    _pane.appendChild(mk('div', { style:'display:flex;align-items:center;justify-content:space-between;gap:12px;margin:0 0 10px;' }, [
      mk('div', { style:'font-size:11.5px;font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:' + INK + ';opacity:.78;' },
        L({ gr:'Υπάρχοντα banners', en:'Existing banners' })),
      mk('button', { id:'ba-seed', type:'button',
        style:'padding:7px 13px;border-radius:8px;border:1px solid rgba(0,0,0,.28);background:#fff;color:' + INK + ';cursor:pointer;font:inherit;font-size:12px;font-weight:600;',
        onclick: onSeed }, L({ gr:'⤓ Φόρτωση παραδειγμάτων', en:'⤓ Seed example banners' })),
    ]));
    _pane.appendChild(mk('div', { id:'ba-list' }));

    updatePreview();
    refreshList();
  }

  window.BannerAdmin = { render: render, refresh: refreshList, _seed: SEED };
})();
