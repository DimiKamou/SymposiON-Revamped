/* ════════════════════════════════════════════════════════════════════
   SymposiON · LIVE SITE-BANNER BAR  (synthesis port)
   ────────────────────────────────────────────────────────────────────
   Renders the sticky announcement strip at the very top of the page.

   Ver1 had this as _loadSiteBanners() inside nav.js; synthesis has no
   nav.js, so this is a self-contained module loaded eagerly (before
   js/app.js) and initialised on DOM ready.

   Data source (in priority order, all guarded):
     1. Firestore `banners` where active == true   (when firebase is up)
     2. SymStore('site_banners', [])                (offline / seeded)
     3. The bundled SEED                            (first-run fallback)

   Each active banner is filtered for:
     • dismissal   — localStorage 'sym_dismissed_banners' (per device)
     • expiry      — endsAt in the past

   Banner doc shape (honoured as-is):
     { titleGr, titleEn, bodyGr, bodyEn, type:'info'|'promo'|'warning',
       active, ctaGr, ctaEn, ctaAction, endsAt }

   Markup matches css/site-banners.css. No build step / framework.
   Public API: window.BannerBar = { init, render, reload, dismiss }.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var WRAP_ID    = 'site-banners-wrap';
  var STORE_KEY  = 'site_banners';                 // SymStore mirror key
  var DISMISS_LS = 'sym_dismissed_banners';        // localStorage CSV of ids

  /* ── Bundled seed (the six handoff banners) — first-run fallback only.
        Not auto-written anywhere; just shown if no other source has data. */
  var SEED = [
    { id:'seed-summer-offer', type:'promo', active:true,
      titleGr:'Καλοκαιρινή προσφορά', titleEn:'Summer offer',
      bodyGr:'−30% στο ετήσιο Pro — όλη η ύλη, όλα τα παιχνίδια, ένα έτος.',
      bodyEn:'−30% on annual Pro — every subject, every game, for a full year.',
      ctaGr:'Απόκτησέ το', ctaEn:'Get the deal', ctaAction:"goTo('offers')", endsAt:null },
    { id:'seed-labyrinth', type:'info', active:true,
      titleGr:'Νέο παιχνίδι: Λαβύρινθος', titleEn:'New game: Labyrinth',
      bodyGr:"Βυθίσου στον λαβύρινθο του Μινώταυρου και δοκίμασε τα Αρχαία σου.",
      bodyEn:"Descend into the Minotaur's maze and put your Ancient Greek to the test.",
      ctaGr:'Παίξε τώρα', ctaEn:'Play now', ctaAction:"goTo('browse')", endsAt:null }
  ];

  /* ── language helper (synthesis uses SYM_LANG; siteLang is the legacy
        mirror set by setSiteLang). Default Greek. ─────────────────────── */
  function lang() {
    var l = (window.SYM_LANG || window.siteLang || 'gr');
    return l === 'en' ? 'en' : 'gr';
  }
  function pick(gr, en) {
    return lang() === 'en' ? (en || gr || '') : (gr || '');
  }
  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── firebase availability guard ─────────────────────────────────── */
  function fb() {
    try {
      return (typeof firebase !== 'undefined' && firebase.apps && firebase.apps.length)
        ? firebase : null;
    } catch (_) { return null; }
  }

  /* ── dismissed-ids (localStorage CSV) ────────────────────────────── */
  function dismissedIds() {
    try {
      var raw = localStorage.getItem(DISMISS_LS) || '';
      return raw ? raw.split(',').filter(Boolean) : [];
    } catch (_) { return []; }
  }
  function markDismissed(id) {
    if (!id) return;
    try {
      var ids = dismissedIds();
      if (ids.indexOf(id) === -1) { ids.push(id); localStorage.setItem(DISMISS_LS, ids.join(',')); }
    } catch (_) {}
  }

  /* ── normalise a raw banner (Firestore doc or SymStore/seed object)
        into a flat shape the renderer understands. endsAt may be a
        Firestore Timestamp, an ISO string, a millis number, or null. ─── */
  function toMillis(endsAt) {
    if (endsAt == null) return null;
    try {
      if (typeof endsAt.toDate === 'function') return endsAt.toDate().getTime();
      if (typeof endsAt.seconds === 'number')  return endsAt.seconds * 1000;
    } catch (_) {}
    if (typeof endsAt === 'number') return endsAt;
    // A bare 'YYYY-MM-DD' (the SymStore/offline mirror format) is parsed by
    // Date.parse() as 00:00 UTC of that day, so the banner would be treated as
    // expired for the WHOLE end-date — hiding it a full day early vs the
    // Firestore path (which stores end-of-day) and the admin list (which marks
    // it expired only after endsAt+'T23:59:59'). Normalise a bare date to
    // end-of-day so expiry semantics match everywhere.
    var s = String(endsAt);
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) s += 'T23:59:59';
    var ms = Date.parse(s);
    return isNaN(ms) ? null : ms;
  }
  function normalize(id, d) {
    d = d || {};
    return {
      id:        d.id || id || '',
      type:      (d.type === 'promo' || d.type === 'warning') ? d.type : 'info',
      active:    d.active !== false,
      titleGr:   d.titleGr || '',
      titleEn:   d.titleEn || d.titleGr || '',
      bodyGr:    d.bodyGr  || '',
      bodyEn:    d.bodyEn  || d.bodyGr || '',
      ctaGr:     d.ctaGr   || '',
      ctaEn:     d.ctaEn   || d.ctaGr || '',
      ctaAction: d.ctaAction || '',
      endsAtMs:  toMillis(d.endsAt),
    };
  }

  /* ── load active banners from the best available source ──────────── */
  function loadFromStore() {
    var arr = (window.SymStore && SymStore.get) ? SymStore.get(STORE_KEY, null) : null;
    if (Array.isArray(arr) && arr.length) {
      return arr.map(function (b, i) { return normalize(b.id || ('store-' + i), b); });
    }
    return null;
  }

  function loadBanners() {
    var f = fb();
    if (!f) {
      // No firebase — SymStore, then seed.
      var s = loadFromStore();
      return Promise.resolve(s || SEED.map(function (b) { return normalize(b.id, b); }));
    }
    return f.firestore().collection('banners').where('active', '==', true).get()
      .then(function (snap) {
        var out = [];
        snap.forEach(function (doc) { out.push(normalize(doc.id, doc.data())); });
        // If Firestore has no active banners, fall back to local sources so a
        // freshly-seeded SymStore (sandbox) still shows something.
        if (!out.length) {
          var s = loadFromStore();
          if (s) return s;
        }
        return out;
      })
      .catch(function (err) {
        try { console.warn('[banner-bar] firestore load failed, falling back:', err); } catch (_) {}
        var s = loadFromStore();
        return s || SEED.map(function (b) { return normalize(b.id, b); });
      });
  }

  /* ── filter: active, not dismissed, not expired ──────────────────── */
  function visible(banners) {
    var now  = Date.now();
    var dism = dismissedIds();
    return banners.filter(function (b) {
      if (!b.active) return false;
      if (b.id && dism.indexOf(b.id) !== -1) return false;
      if (b.endsAtMs != null && b.endsAtMs < now) return false;
      return true;
    });
  }

  /* ── run a CTA action string safely (guarded). Actions are authored by
        admins only (e.g. goTo('offers')). ─────────────────────────────── */
  function runCta(action) {
    if (!action) return;
    try {
      // eslint-disable-next-line no-new-func
      (new Function(action))();
    } catch (err) {
      try { console.warn('[banner-bar] CTA action failed:', action, err); } catch (_) {}
    }
  }

  /* ── ensure the sticky wrap exists at the very top of the document.
        Placed just before .stage so it sits above the shell. ──────────── */
  function ensureWrap() {
    var wrap = document.getElementById(WRAP_ID);
    if (wrap) return wrap;
    wrap = document.createElement('div');
    wrap.id = WRAP_ID;
    var stage = document.querySelector('.stage');
    if (stage && stage.parentNode) stage.parentNode.insertBefore(wrap, stage);
    else document.body.insertBefore(wrap, document.body.firstChild);
    return wrap;
  }

  /* ── build one banner's DOM node ─────────────────────────────────── */
  function buildBanner(b) {
    var title = esc(pick(b.titleGr, b.titleEn));
    var body  = pick(b.bodyGr, b.bodyEn);
    var cta   = pick(b.ctaGr, b.ctaEn);

    var node = document.createElement('div');
    node.className = 'site-banner site-banner--' + b.type;
    if (b.id) node.setAttribute('data-banner-id', b.id);

    var inner =
      '<div class="site-banner-body">' +
        '<strong class="site-banner-title">' + title + '</strong>' +
        (body ? '<span class="site-banner-text">' + esc(body) + '</span>' : '') +
        (cta && b.ctaAction
          ? '<button class="site-banner-cta" type="button">' + esc(cta) + '</button>'
          : '') +
      '</div>' +
      '<button class="site-banner-close" type="button" aria-label="Close" title="' +
        (lang() === 'en' ? 'Dismiss' : 'Απόκρυψη') + '">&#10005;</button>';
    node.innerHTML = inner;

    var ctaBtn = node.querySelector('.site-banner-cta');
    if (ctaBtn) ctaBtn.addEventListener('click', function () { runCta(b.ctaAction); });

    var closeBtn = node.querySelector('.site-banner-close');
    if (closeBtn) closeBtn.addEventListener('click', function () {
      markDismissed(b.id);
      node.style.opacity = '0';
      setTimeout(function () { if (node.parentNode) node.parentNode.removeChild(node); }, 280);
    });

    return node;
  }

  /* ── render the bar from a known banner list ─────────────────────── */
  function paint(banners) {
    var wrap = ensureWrap();
    wrap.innerHTML = '';
    visible(banners).forEach(function (b) { wrap.appendChild(buildBanner(b)); });
  }

  /* ── public: (re)load + render ───────────────────────────────────── */
  function render() {
    return loadBanners().then(paint).catch(function (err) {
      try { console.warn('[banner-bar] render failed:', err); } catch (_) {}
    });
  }

  var _booted = false;
  function init() {
    if (_booted) return;
    _booted = true;
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', function () { render(); });
    } else {
      render();
    }
    // Re-paint when the language toggles (SymStore broadcasts 'sym-store';
    // app.js also re-renders on lang switch — cheap to re-derive from cache).
    window.addEventListener('sym-lang-change', function () { render(); });
  }

  window.BannerBar = {
    init:    init,
    render:  render,
    reload:  render,
    dismiss: markDismissed,
    _seed:   SEED,
  };

  // Self-init on load. Idempotent; the admin component can also call render().
  init();
})();
