/* ════════════════════════════════════════════════════════════════════
   SymposiON · sym-blocks.js
   Block factory: banner / plan / offer generators + a no-code picker.
   Exposes window.SymBlocks.
   ════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── Accent colour map ─────────────────────────────────────────── */
  const ACCENT = {
    gold:        'var(--sym-gold)',
    terra:       'var(--sym-terra)',
    aegean:      'var(--med-aegean)',
    olive:       'var(--med-olive)',
    terracotta:  'var(--med-terracotta)',
    sun:         'var(--med-sun)',
    wine:        'var(--med-wine)',
  };

  function resolveAccent(a) {
    if (!a) return ACCENT.gold;
    return ACCENT[a] || a;
  }

  /* ─── Countdown helper ──────────────────────────────────────────── */
  function fmtDeadline(deadline) {
    if (!deadline) return '';
    const d = new Date(deadline);
    if (isNaN(d)) return String(deadline);
    const now  = Date.now();
    const diff = d - now;
    if (diff <= 0) return 'Λήξη';
    const days = Math.floor(diff / 86400000);
    const hrs  = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    if (days > 0) return days + 'd ' + hrs + 'h';
    if (hrs  > 0) return hrs  + 'h ' + mins + 'm';
    return mins + 'm';
  }

  function startCountdown(el, deadline) {
    if (!deadline || !el) return;
    function tick() {
      el.textContent = fmtDeadline(deadline);
    }
    tick();
    const iv = setInterval(function () {
      tick();
      if (new Date(deadline) <= Date.now()) clearInterval(iv);
    }, 30000);
  }

  /* ─── Illustration injector (re-uses loader.js cache if available) ─ */
  function injectArt(el) {
    if (typeof window._injectIllus === 'function') {
      window._injectIllus(el);
    }
  }

  /* ──────────────────────────────────────────────────────────────────
     BANNER
     variants: hero | promo | strip | square
  ────────────────────────────────────────────────────────────────── */
  function banner(opts) {
    opts = opts || {};
    const v       = opts.variant || 'hero';
    const ac      = resolveAccent(opts.accent);
    const eyebrow = opts.eyebrow || '';
    const title   = opts.title   || '';
    const body    = opts.body    || '';
    const cta     = opts.cta     || 'Μάθε περισσότερα';
    const href    = opts.href    || '#';
    const art     = opts.art     || '';

    const el = document.createElement('div');
    el.className = 'sym-banner sym-banner-' + v;
    el.style.setProperty('--bac', ac);

    if (v === 'hero') {
      el.innerHTML =
        '<div class="copy">' +
          (eyebrow ? '<div class="eyebrow">' + eyebrow + '</div>' : '') +
          '<h3>' + title + '</h3>' +
          (body ? '<p>' + body + '</p>' : '') +
          '<a class="cta" href="' + href + '">' + cta + ' →</a>' +
        '</div>' +
        (art ? '<span class="sun" data-illu="' + art + '" style="width:200px;height:200px"></span>' : '') +
        '<span class="wm" data-illu="meander-band" style="width:240px;height:60px"></span>';

    } else if (v === 'promo') {
      el.innerHTML =
        '<span class="laurel" data-illu="laurel-arc" style="width:130px;height:65px"></span>' +
        '<div class="l">' +
          (eyebrow ? '<div class="badge">' + eyebrow + '</div>' : '') +
          '<h3>' + title + '</h3>' +
        '</div>' +
        '<a class="cta" href="' + href + '">' + cta + '</a>';

    } else if (v === 'strip') {
      el.innerHTML =
        '<div class="meander-bg"></div>' +
        (art ? '<span class="ic" data-illu="' + art + '" style="width:30px;height:30px"></span>' : '') +
        '<div class="tx"><b>' + title + '</b> ' + body + '</div>' +
        '<a class="cta" href="' + href + '">' + cta + '</a>';

    } else if (v === 'square') {
      /* square returns a grid of up to 3 cards from opts.squares[] */
      el.className = 'sym-banner-squares';
      const squares = opts.squares || [
        { variant: 'sea',   eyebrow: eyebrow, title: title },
        { variant: 'olive', eyebrow: eyebrow, title: title },
        { variant: 'terra', eyebrow: eyebrow, title: title },
      ];
      el.innerHTML = squares.map(function (s) {
        return '<div class="sym-square ' + (s.variant || 'sea') + '">' +
          (s.art ? '<span class="wm" data-illu="' + s.art + '" style="width:150px;height:150px"></span>' : '') +
          (s.eyebrow ? '<div class="eyebrow">' + s.eyebrow + '</div>' : '') +
          '<h4>' + (s.title || '') + '</h4>' +
        '</div>';
      }).join('');
    }

    injectArt(el);
    return el;
  }

  /* ──────────────────────────────────────────────────────────────────
     PLAN
     variants: plain | featured
  ────────────────────────────────────────────────────────────────── */
  function plan(opts) {
    opts = opts || {};
    const feat     = opts.variant === 'featured';
    const tier     = opts.tier     || 'Free';
    const icon     = opts.icon     || 'laurel-arc';
    const price    = opts.price    || '0';
    const period   = opts.period   || '';
    const note     = opts.note     || '';
    const ribbon   = opts.ribbon   || (feat ? 'ΔΗΜΟΦΙΛΕΣ' : '');
    const features = opts.features || [];
    const cta      = opts.cta      || (feat ? 'Επέλεξε →' : 'Έναρξη →');
    const onClick  = opts.onClick  || null;

    const el = document.createElement('div');
    el.className = 'sym-plan' + (feat ? ' feat' : '');

    const featsHtml = features.map(function (f) {
      const label    = (typeof f === 'string') ? f : f.label;
      const included = (typeof f === 'string') ? true : f.included !== false;
      const check    = included
        ? '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 8l3 3 7-7"/></svg>'
        : '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4l8 8M12 4l-8 8"/></svg>';
      return '<li' + (included ? '' : ' class="off"') + '>' + check + label + '</li>';
    }).join('');

    el.innerHTML =
      (ribbon ? '<div class="ribbon">' + ribbon + '</div>' : '') +
      '<div class="tier">' + tier + '</div>' +
      '<div class="icon" data-illu="' + icon + '" style="width:46px;height:46px"></div>' +
      '<div class="pr">' + price + (period ? '<small> / ' + period + '</small>' : '') + '</div>' +
      (note ? '<div class="pr-sub">' + note + '</div>' : '') +
      '<ul>' + featsHtml + '</ul>' +
      '<button class="buy">' + cta + '</button>';

    if (onClick) el.querySelector('.buy').addEventListener('click', onClick);

    injectArt(el);
    return el;
  }

  /* ──────────────────────────────────────────────────────────────────
     OFFER
     variants: ribbon | coin | laurel | countdown
  ────────────────────────────────────────────────────────────────── */
  function offer(opts) {
    opts = opts || {};
    const v        = opts.variant  || 'ribbon';
    const ac       = resolveAccent(opts.accent);
    const tag      = opts.tag      || '';
    const eyebrow  = opts.eyebrow  || '';
    const title    = opts.title    || '';
    const body     = opts.body     || '';
    const cta      = opts.cta      || 'Δες τώρα';
    const href     = opts.href     || '#';
    const deadline = opts.deadline || null;

    const el = document.createElement('div');
    el.className = 'sym-offer v-' + v;
    el.style.setProperty('--ac', ac);

    let inner = '';
    if (v === 'ribbon') {
      inner += '<div class="sym-offer-ribbon">' + (tag || 'Νέο') + '</div>';
    } else if (v === 'coin' || v === 'laurel') {
      const artName = v === 'coin' ? 'coin' : 'laurel-arc';
      inner += '<span class="sym-offer-art" data-illu="' + artName + '" style="width:130px;height:130px"></span>';
    } else if (v === 'countdown') {
      inner += '<span class="sym-offer-clock" data-illu="sand-timer" style="width:38px;height:38px"></span>';
    }

    inner += (eyebrow ? '<div class="sym-offer-eyebrow">' + eyebrow + '</div>' : '') +
      (title  ? '<div class="sym-offer-title">' + title + '</div>' : '') +
      (body   ? '<div class="sym-offer-body">'  + body  + '</div>' : '');

    if (v === 'countdown' && deadline) {
      inner += '<div class="sym-offer-deadline" data-deadline="' + deadline + '"></div>';
    }

    inner += '<a class="sym-offer-cta" href="' + href + '">' + cta + '</a>';

    el.innerHTML = inner;

    if (v === 'countdown' && deadline) {
      const cd = el.querySelector('.sym-offer-deadline');
      startCountdown(cd, deadline);
    }

    injectArt(el);
    return el;
  }

  /* ──────────────────────────────────────────────────────────────────
     PICKER  — no-code variant chooser
     kind:  'banner' | 'plan' | 'offer'
     mount: CSS selector string or DOM element
     onPick(variant, el): called when user clicks a swatch
  ────────────────────────────────────────────────────────────────── */
  function picker(kind, mount, onPick) {
    const container = (typeof mount === 'string')
      ? document.querySelector(mount)
      : mount;
    if (!container) return;

    const variantSets = {
      banner: ['hero', 'promo', 'strip'],
      plan:   ['plain', 'featured'],
      offer:  ['ribbon', 'coin', 'laurel', 'countdown'],
    };

    const variants = variantSets[kind] || [];
    const sampleData = {
      banner: { eyebrow: 'ΝΕΟΣ ΚΥΚΛΟΣ', title: 'Ξεκλείδωσε τα πάντα', body: 'Απεριόριστη πρόσβαση σε όλα τα παιχνίδια.' },
      plan:   { tier: 'PRO', price: '€4.99', period: 'μήνα', features: ['Όλα τα παιχνίδια', 'Αποθήκευση προόδου', { label: 'Τάξη δασκάλου', included: false }] },
      offer:  { eyebrow: 'ΕΚΠΤΩΣΗ', title: '–30% για λίγο', body: 'Μόνο μέχρι σήμερα.', deadline: Date.now() + 3600000 },
    };

    const grid = document.createElement('div');
    grid.className = 'sym-picker';

    let selected = null;

    variants.forEach(function (v) {
      const opt = document.createElement('button');
      opt.className = 'sym-picker-opt';
      opt.setAttribute('data-variant', v);

      const name = document.createElement('span');
      name.className = 'sym-picker-name';
      name.textContent = v;
      opt.appendChild(name);

      const preview = document.createElement('div');
      preview.className = 'sym-picker-preview';

      const data = Object.assign({}, sampleData[kind] || {}, { variant: v });
      let previewEl = null;
      if (kind === 'banner') previewEl = banner(data);
      else if (kind === 'plan') previewEl = plan(data);
      else if (kind === 'offer') previewEl = offer(data);
      if (previewEl) preview.appendChild(previewEl);

      opt.appendChild(preview);

      opt.addEventListener('click', function () {
        if (selected) selected.classList.remove('on');
        opt.classList.add('on');
        selected = opt;
        if (typeof onPick === 'function') onPick(v, opt);
      });

      grid.appendChild(opt);
    });

    container.innerHTML = '';
    container.appendChild(grid);
  }

  /* ─── Public API ────────────────────────────────────────────────── */
  window.SymBlocks = { banner: banner, plan: plan, offer: offer, picker: picker };

})();
