/* ════════════════════════════════════════════════════════════════════
   SymposiON — Share QR modal · window.showQR(title, opts)
   A single, theme-adaptive share overlay used everywhere a QR/link is
   needed (level-select "Share to class", in-game share buttons that call
   window.showQR, …). The qrcodejs lib is LAZY-loaded from CDN on first
   use (mirrors admin-synthesis.js `_loadPdfJs`). If the lib fails to load
   the modal degrades gracefully to just the copyable link — never crashes.

     showQR(title, { url })          → explicit share URL
     showQR(title, { join: pin })    → location.origin + '/?join=' + pin
     showQR(title, { game, ds, levels }) → origin + '/?game=…(&ds=…)(&levels=…)'
     showQR(title)                   → location.origin + '/'
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var QR_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';

  /* bilingual helper — falls back to gr/en if the global isn't ready */
  function L(o) {
    if (typeof o === 'string') return o;
    if (typeof window.L === 'function') return window.L(o);
    return (o && (o.gr || o.en)) || '';
  }

  /* lazy CDN loader for qrcodejs (mirrors admin-synthesis _loadPdfJs) */
  function _loadQR() {
    if (window.QRCode) return Promise.resolve(window.QRCode);
    return new Promise(function (res, rej) {
      var s = document.createElement('script');
      s.src = QR_CDN;
      s.onload = function () { window.QRCode ? res(window.QRCode) : rej(new Error('qrcode load failed')); };
      s.onerror = function () { rej(new Error('qrcode load failed')); };
      document.head.appendChild(s);
    });
  }

  /* resolve the share URL from the opts shape */
  function buildURL(opts) {
    opts = opts || {};
    var origin = location.origin;
    if (opts.url) return opts.url;
    if (opts.join != null && opts.join !== '') return origin + '/?join=' + opts.join;
    if (opts.game) {
      var u = origin + '/?game=' + encodeURIComponent(opts.game);
      if (opts.ds)     u += '&ds=' + encodeURIComponent(opts.ds);
      if (opts.levels) u += '&levels=' + encodeURIComponent(opts.levels);
      return u;
    }
    return origin + '/';
  }

  /* keep the active theme class so the overlay inherits the --sym-* / --card
     tokens (the modal lives on <body>, outside #sym-home where theme is scoped) */
  function themeClass() {
    if (typeof window.symThemeClass === 'function') return window.symThemeClass();
    return 'theme-' + ((window.STATE && window.STATE.theme) || 'alabaster');
  }

  window.showQR = function showQR(title, opts) {
    var url = buildURL(opts);

    /* ── overlay scaffold ── */
    var overlay = document.createElement('div');
    overlay.className = 'qrm ' + themeClass();
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', L({ gr: 'Μοιράσου', en: 'Share' }));

    var card = document.createElement('div');
    card.className = 'qrm__card';
    overlay.appendChild(card);

    function close() {
      document.removeEventListener('keydown', onKey);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }
    function onKey(e) { if (e.key === 'Escape') close(); }

    /* close ✕ */
    var x = document.createElement('button');
    x.className = 'qrm__x';
    x.setAttribute('aria-label', L({ gr: 'Κλείσιμο', en: 'Close' }));
    x.innerHTML = '&times;';
    x.addEventListener('click', close);
    card.appendChild(x);

    /* title */
    var h = document.createElement('h3');
    h.className = 'qrm__title';
    h.textContent = title || L({ gr: 'Μοιράσου', en: 'Share' });
    card.appendChild(h);

    var sub = document.createElement('p');
    sub.className = 'qrm__sub';
    sub.textContent = L({ gr: 'Σκάναρε τον κωδικό QR ή στείλε τον σύνδεσμο.', en: 'Scan the QR code or send the link.' });
    card.appendChild(sub);

    /* QR slot */
    var qrSlot = document.createElement('div');
    qrSlot.className = 'qrm__qr';
    qrSlot.setAttribute('aria-hidden', 'true');
    card.appendChild(qrSlot);

    /* the share URL as selectable text */
    var link = document.createElement('div');
    link.className = 'qrm__link';
    link.textContent = url;
    card.appendChild(link);

    /* actions: copy + close */
    var acts = document.createElement('div');
    acts.className = 'qrm__acts';

    var copyBtn = document.createElement('button');
    copyBtn.className = 'qrm__btn qrm__btn--primary';
    copyBtn.textContent = L({ gr: 'Αντιγραφή συνδέσμου', en: 'Copy link' });
    copyBtn.addEventListener('click', function () {
      var done = function () {
        copyBtn.textContent = L({ gr: '✓ Αντιγράφηκε', en: '✓ Copied' });
        copyBtn.classList.add('is-done');
        setTimeout(function () {
          copyBtn.textContent = L({ gr: 'Αντιγραφή συνδέσμου', en: 'Copy link' });
          copyBtn.classList.remove('is-done');
        }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { fallbackCopy(url, done); });
      } else { fallbackCopy(url, done); }
    });
    acts.appendChild(copyBtn);

    var closeBtn = document.createElement('button');
    closeBtn.className = 'qrm__btn';
    closeBtn.textContent = L({ gr: 'Κλείσιμο', en: 'Close' });
    closeBtn.addEventListener('click', close);
    acts.appendChild(closeBtn);

    card.appendChild(acts);

    /* click-outside to close */
    overlay.addEventListener('mousedown', function (e) { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);

    document.body.appendChild(overlay);
    copyBtn.focus();

    /* draw the QR (lazy lib). On failure leave the link-only modal intact. */
    _loadQR().then(function (QR) {
      qrSlot.innerHTML = '';
      try {
        new QR(qrSlot, { text: url, width: 200, height: 200, correctLevel: QR.CorrectLevel.M });
        qrSlot.classList.add('is-ready');
      } catch (_) { qrSlot.classList.add('is-empty'); }
    }, function () {
      qrSlot.classList.add('is-empty');
      qrSlot.textContent = L({ gr: 'Χρησιμοποίησε τον σύνδεσμο πιο κάτω.', en: 'Use the link below.' });
    });

    return { close: close };
  };

  /* execCommand fallback for older / insecure-context browsers */
  function fallbackCopy(text, done) {
    try {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      if (done) done();
    } catch (_) { /* give up silently — the link is still selectable */ }
  }
})();
