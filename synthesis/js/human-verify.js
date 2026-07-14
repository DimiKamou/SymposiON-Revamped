/* ════════════════════════════════════════════════════════════════════════
   human-verify.js — self-contained HUMAN-VERIFICATION + anti-bot module
   ────────────────────────────────────────────────────────────────────────
   Exposes on window:
     • SymHumanVerify(opts?)  → Promise<true>  (resolves on pass, rejects on
                                 cancel/close)
     • SymAntiBot = { honeypot(formEl), throttle(key,max,winMs), sanitize(str) }

   No external dependencies. On-brand alabaster modal styled from the app's
   design tokens (--sym-terra / --sym-gold / --sym-ink / --sym-bg-card …).
   Bilingual (gr/en) via the global L() if present, else Greek.

   Anti-bot guards inside the challenge widget:
     • RANDOMIZED challenge each call (4 challenge families, randomized
       operands / targets / option order) so it is not trivially scriptable.
     • TIMING guard — a "pass" arriving < MIN_HUMAN_MS after the challenge is
       shown is treated as bot-like → rejected & re-challenged.
     • ATTEMPT LIMIT — 3 wrong answers → a brief lockout countdown.
   ════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (window.SymHumanVerify) return; // idempotent — never double-define

  /* ── i18n: use the global L({gr,en}) if app.js defined it, else Greek ── */
  function t(o) {
    try {
      if (typeof window.L === 'function') return window.L(o);
    } catch (_) {}
    var lang = window.SYM_LANG || 'gr';
    return (o && (o[lang] || o.gr)) || '';
  }

  /* ── tiny DOM helper (use the global `el` if present, else a local one) ── */
  function mk(tag, attrs, kids) {
    if (typeof window.el === 'function') return window.el(tag, attrs, kids);
    var n = document.createElement(tag);
    if (attrs) for (var k in attrs) {
      if (k === 'class') n.className = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else if (k === 'style') n.setAttribute('style', attrs[k]);
      else if (k.slice(0, 2) === 'on' && typeof attrs[k] === 'function') n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] != null) n.setAttribute(k, attrs[k]);
    }
    if (kids != null) (Array.isArray(kids) ? kids : [kids]).forEach(function (c) {
      if (c == null) return;
      n.appendChild((typeof c === 'string' || typeof c === 'number') ? document.createTextNode(String(c)) : c);
    });
    return n;
  }

  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(arr) { return arr[rnd(arr.length)]; }
  function shuffle(arr) {
    arr = arr.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = rnd(i + 1), tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  /* tuning */
  var MIN_HUMAN_MS = 800;   // a pass faster than this = bot-like
  var MAX_ATTEMPTS = 3;     // wrong answers before a lockout
  var LOCKOUT_MS   = 8000;  // brief lockout duration

  /* ════════════════════ CSS (self-injected) ════════════════════ */
  function injectCSS() {
    if (document.getElementById('sym-hv-css')) return;
    var css = [
'.sym-hv-overlay{position:fixed;inset:0;z-index:10200;display:flex;align-items:center;',
'  justify-content:center;padding:20px;background:rgba(30,24,16,.46);',
'  backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);',
'  font-family:var(--syn-sans,var(--sans,"Montserrat",system-ui,sans-serif));',
'  animation:sym-hv-fade .18s ease both;}',
'@keyframes sym-hv-fade{from{opacity:0}to{opacity:1}}',
'@keyframes sym-hv-pop{from{opacity:0;transform:translateY(10px) scale(.97)}to{opacity:1;transform:none}}',
'@keyframes sym-hv-shake{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}',
'  30%,50%,70%{transform:translateX(-7px)}40%,60%{transform:translateX(7px)}}',
'.sym-hv-box{position:relative;width:100%;max-width:380px;border-radius:18px;',
'  background:var(--sym-bg-card,#fff);color:var(--sym-ink,#1E1810);',
'  border:1px solid var(--sym-hairline,var(--line,rgba(30,24,16,.13)));',
'  box-shadow:0 24px 60px -18px rgba(30,24,16,.45),0 4px 14px rgba(30,24,16,.10);',
'  padding:22px 22px 20px;animation:sym-hv-pop .22s cubic-bezier(.2,.7,.3,1) both;}',
'.sym-hv-box.sym-hv-bad{animation:sym-hv-shake .42s both;}',
'.sym-hv-top{display:flex;align-items:center;gap:10px;margin-bottom:6px;}',
'.sym-hv-badge{flex:0 0 auto;width:30px;height:30px;border-radius:9px;display:flex;',
'  align-items:center;justify-content:center;color:#fff;font-weight:700;',
'  background:linear-gradient(135deg,var(--sym-terra,#C5572F),var(--sym-terra-dk,#9C3F1F));',
'  box-shadow:0 4px 10px -3px var(--sym-terra,#C5572F);}',
'.sym-hv-badge svg{width:17px;height:17px;display:block;}',
'.sym-hv-ttl{font-family:var(--syn-disp,var(--disp,"Oswald",sans-serif));',
'  font-weight:600;font-size:15px;letter-spacing:.4px;text-transform:uppercase;flex:1;}',
'.sym-hv-x{flex:0 0 auto;width:28px;height:28px;border:none;border-radius:8px;cursor:pointer;',
'  background:transparent;color:var(--sym-ink,#1E1810);opacity:.5;font-size:17px;line-height:1;}',
'.sym-hv-x:hover{opacity:1;background:color-mix(in srgb,var(--sym-ink,#1E1810) 8%,transparent);}',
'@media (pointer:coarse){.sym-hv-x{position:relative;}.sym-hv-x::before{content:"";position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:44px;height:44px;}}',
'.sym-hv-sub{font-size:12px;opacity:.62;margin:0 0 14px;line-height:1.4;}',
'.sym-hv-prompt{font-family:var(--syn-serif,var(--serif,"Alegreya",Georgia,serif));',
'  font-size:21px;font-weight:600;margin:0 0 14px;text-align:center;line-height:1.3;}',
'.sym-hv-prompt b{color:var(--sym-terra,#C5572F);}',
'.sym-hv-opts{display:grid;grid-template-columns:repeat(2,1fr);gap:9px;}',
'.sym-hv-opt{appearance:none;border:1px solid var(--sym-hairline,var(--line,rgba(30,24,16,.14)));',
'  background:var(--sym-bg-dark,#F7F3EA);color:var(--sym-ink,#1E1810);border-radius:11px;',
'  padding:13px 8px;font:600 18px/1 var(--syn-sans,var(--sans,"Montserrat",sans-serif));',
'  cursor:pointer;transition:transform .08s,border-color .12s,background .12s;}',
'.sym-hv-opt:hover{border-color:var(--sym-terra,#C5572F);',
'  background:color-mix(in srgb,var(--sym-terra,#C5572F) 8%,var(--sym-bg-dark,#F7F3EA));}',
'.sym-hv-opt:active{transform:scale(.96);}',
'.sym-hv-opt:focus-visible{outline:2px solid var(--sym-terra,#C5572F);outline-offset:2px;}',
'.sym-hv-pickwrap{display:flex;flex-direction:column;gap:12px;}',
'.sym-hv-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;}',
'.sym-hv-cell{appearance:none;border:1px solid var(--sym-hairline,var(--line,rgba(30,24,16,.14)));',
'  background:var(--sym-bg-dark,#F7F3EA);border-radius:12px;padding:0;aspect-ratio:1;',
'  font-size:26px;cursor:pointer;display:flex;align-items:center;justify-content:center;',
'  transition:transform .08s,border-color .12s,background .12s;user-select:none;}',
'.sym-hv-cell:hover{border-color:var(--sym-terra,#C5572F);}',
'.sym-hv-cell:active{transform:scale(.94);}',
'.sym-hv-cell.sel{border-color:var(--sym-terra,#C5572F);border-width:2px;',
'  background:color-mix(in srgb,var(--sym-terra,#C5572F) 14%,var(--sym-bg-dark,#F7F3EA));}',
'.sym-hv-cell:focus-visible{outline:2px solid var(--sym-terra,#C5572F);outline-offset:2px;}',
'.sym-hv-slider{position:relative;height:52px;border-radius:13px;overflow:hidden;',
'  background:var(--sym-bg-dark,#F7F3EA);border:1px solid var(--sym-hairline,var(--line,rgba(30,24,16,.14)));',
'  user-select:none;touch-action:none;}',
'.sym-hv-fill{position:absolute;inset:0 auto 0 0;width:46px;border-radius:12px;',
'  background:linear-gradient(135deg,var(--sym-terra,#C5572F),var(--sym-terra-dk,#9C3F1F));}',
'.sym-hv-knob{position:absolute;top:3px;left:3px;width:46px;height:44px;border-radius:11px;',
'  background:#fff;box-shadow:0 2px 8px rgba(30,24,16,.28);display:flex;align-items:center;',
'  justify-content:center;cursor:grab;color:var(--sym-terra,#C5572F);font-size:20px;z-index:2;}',
'.sym-hv-knob:active{cursor:grabbing;}',
'.sym-hv-slabel{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;',
'  font-size:13px;font-weight:600;letter-spacing:.4px;opacity:.6;pointer-events:none;}',
'.sym-hv-slider.ok .sym-hv-slabel{color:#fff;opacity:.95;}',
'.sym-hv-foot{display:flex;align-items:center;justify-content:space-between;margin-top:14px;',
'  font-size:11.5px;min-height:18px;}',
'.sym-hv-msg{font-weight:600;}',
'.sym-hv-msg.err{color:var(--sym-terra-dk,#9C3F1F);}',
'.sym-hv-msg.ok{color:var(--sym-gold,#A2862F);}',
'.sym-hv-dots{display:flex;gap:5px;}',
'.sym-hv-dot{width:8px;height:8px;border-radius:50%;',
'  background:color-mix(in srgb,var(--sym-ink,#1E1810) 16%,transparent);}',
'.sym-hv-dot.used{background:var(--sym-terra,#C5572F);}',
'.sym-hv-new{background:none;border:none;cursor:pointer;font-size:11.5px;font-weight:600;',
'  color:var(--sym-terra,#C5572F);text-decoration:underline;padding:0;opacity:.85;}',
'.sym-hv-new:hover{opacity:1;}',
'.sym-hv-lock{text-align:center;padding:8px 0 2px;}',
'.sym-hv-lock-n{font-family:var(--syn-disp,var(--disp,"Oswald",sans-serif));',
'  font-size:38px;font-weight:700;color:var(--sym-terra,#C5572F);}'
    ].join('\n');
    var s = document.createElement('style');
    s.id = 'sym-hv-css';
    s.textContent = css;
    document.head.appendChild(s);
  }

  /* shield-check glyph for the badge */
  function shieldSVG() {
    return '<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">' +
      '<path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Z" fill="rgba(255,255,255,.18)"/>' +
      '<path d="M8.5 12l2.2 2.2L15.5 9.5" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</svg>';
  }

  /* ════════════════════ CHALLENGE GENERATORS ════════════════════ */

  /* (1) Greek arithmetic — randomized operands & operator, 4 options. */
  function genArith() {
    var op = pick(['+', '+', '-', '×']); // bias toward addition (easiest)
    var a, b, answer;
    if (op === '+') { a = 1 + rnd(8); b = 1 + rnd(8); answer = a + b; }
    else if (op === '-') { a = 5 + rnd(8); b = 1 + rnd(a - 1); answer = a - b; }
    else { a = 2 + rnd(5); b = 2 + rnd(5); answer = a * b; }
    var opts = new Set([answer]);
    while (opts.size < 4) {
      var d = answer + (rnd(7) - 3);
      if (d >= 0 && d !== answer) opts.add(d);
    }
    return {
      kind: 'arith',
      promptHTML: t({ gr: 'Πόσο κάνει', en: 'What is' }) +
        ' <b>' + a + ' ' + op + ' ' + b + '</b>;',
      options: shuffle(Array.from(opts)),
      check: function (v) { return Number(v) === answer; }
    };
  }

  /* (2) Greek word-number — written-out number, pick the matching digit. */
  function genWord() {
    var words = [
      { gr: 'δύο', en: 'two', n: 2 }, { gr: 'τρία', en: 'three', n: 3 },
      { gr: 'τέσσερα', en: 'four', n: 4 }, { gr: 'πέντε', en: 'five', n: 5 },
      { gr: 'έξι', en: 'six', n: 6 }, { gr: 'επτά', en: 'seven', n: 7 },
      { gr: 'οκτώ', en: 'eight', n: 8 }, { gr: 'εννέα', en: 'nine', n: 9 }
    ];
    var w = pick(words);
    var opts = new Set([w.n]);
    while (opts.size < 4) { opts.add(1 + rnd(9)); }
    return {
      kind: 'word',
      promptHTML: t({ gr: 'Διάλεξε τον αριθμό', en: 'Pick the number' }) +
        ' <b>«' + t(w) + '»</b>',
      options: shuffle(Array.from(opts)),
      check: function (v) { return Number(v) === w.n; }
    };
  }

  /* (3) Emoji pick — "tap all the X". Randomized target, count & layout. */
  function genPick() {
    var families = [
      { label: { gr: 'ήλιους', en: 'suns' }, target: '☀️', distract: ['🌙', '⭐', '☁️', '⚡', '🌈'] },
      { label: { gr: 'καρδιές', en: 'hearts' }, target: '❤️', distract: ['⭐', '🌙', '☀️', '🔶', '🔷'] },
      { label: { gr: 'αστέρια', en: 'stars' }, target: '⭐', distract: ['🌙', '☀️', '☁️', '❤️', '🔺'] },
      { label: { gr: 'δέντρα', en: 'trees' }, target: '🌳', distract: ['🌸', '🍄', '🌵', '🍂', '🌿'] }
    ];
    var fam = pick(families);
    var total = 8;
    var nTarget = 2 + rnd(2); // 2 or 3 targets
    var cells = [];
    for (var i = 0; i < nTarget; i++) cells.push({ e: fam.target, good: true });
    while (cells.length < total) cells.push({ e: pick(fam.distract), good: false });
    cells = shuffle(cells);
    return {
      kind: 'pick',
      family: fam,
      cells: cells,
      promptHTML: t({ gr: 'Διάλεξε όλους τους', en: 'Select all the' }) +
        ' <b>' + t(fam.label) + '</b> ' + fam.target,
      check: function (selectedIdx) {
        var sel = new Set(selectedIdx);
        for (var k = 0; k < cells.length; k++) {
          if (cells[k].good && !sel.has(k)) return false;
          if (!cells[k].good && sel.has(k)) return false;
        }
        return sel.size > 0;
      }
    };
  }

  /* (4) Slide-to-verify — drag the knob to the end. */
  function genSlide() { return { kind: 'slide' }; }

  function makeChallenge() {
    return pick([genArith, genWord, genPick, genSlide])();
  }

  /* ════════════════════ MODAL / FLOW ════════════════════ */

  function SymHumanVerify(opts) {
    opts = opts || {};
    injectCSS();

    return new Promise(function (resolve, reject) {
      var attempts = 0;
      var locked = false;
      var shownAt = 0;
      var settled = false;
      var ch;

      var overlay = mk('div', {
        class: 'sym-hv-overlay',
        role: 'dialog',
        'aria-modal': 'true',
        'aria-label': t({ gr: 'Επαλήθευση ανθρώπου', en: 'Human verification' })
      });
      // carry the active theme so token vars resolve when mounted on <body>
      try {
        if (typeof window.symApplyThemeClass === 'function') window.symApplyThemeClass(overlay);
        else overlay.classList.add('theme-' + ((window.STATE && window.STATE.theme) || 'alabaster'));
      } catch (_) { overlay.classList.add('theme-alabaster'); }

      var box = mk('div', { class: 'sym-hv-box' });
      overlay.appendChild(box);

      overlay.addEventListener('mousedown', function (e) {
        if (e.target === overlay) cancel();
      });
      function onKey(e) { if (e.key === 'Escape') cancel(); }
      document.addEventListener('keydown', onKey);

      function teardown() {
        document.removeEventListener('keydown', onKey);
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      }
      function cancel() {
        if (settled) return;
        settled = true; teardown();
        reject(new Error('cancelled'));
      }
      function succeed() {
        if (settled) return;
        settled = true;
        var msg = box.querySelector('.sym-hv-msg');
        if (msg) { msg.className = 'sym-hv-msg ok'; msg.textContent = t({ gr: 'Επαληθεύτηκε ✓', en: 'Verified ✓' }); }
        setTimeout(function () { teardown(); resolve(true); }, 360);
      }

      function flashBad(text) {
        box.classList.remove('sym-hv-bad'); void box.offsetWidth;
        box.classList.add('sym-hv-bad');
        var msg = box.querySelector('.sym-hv-msg');
        if (msg) { msg.className = 'sym-hv-msg err'; msg.textContent = text; }
      }

      /* called by every challenge when the user submits an answer */
      function attempt(correct) {
        if (settled || locked) return;
        var elapsed = Date.now() - shownAt;
        if (correct && elapsed < MIN_HUMAN_MS) {
          // too fast → bot-like; do NOT count as an attempt, re-challenge
          flashBad(t({ gr: 'Πολύ γρήγορο — δοκίμασε ξανά.', en: 'Too fast — please try again.' }));
          renderChallenge();
          return;
        }
        if (correct) { succeed(); return; }
        attempts++;
        if (attempts >= MAX_ATTEMPTS) { lockout(); return; }
        flashBad(t({ gr: 'Λάθος, ξαναπροσπάθησε.', en: 'Incorrect, try again.' }));
        renderChallenge();
      }

      function lockout() {
        locked = true;
        box.innerHTML = '';
        box.appendChild(header());
        var remain = Math.ceil(LOCKOUT_MS / 1000);
        var num = mk('div', { class: 'sym-hv-lock-n' }, String(remain));
        box.appendChild(mk('div', { class: 'sym-hv-lock' }, [
          mk('p', { class: 'sym-hv-sub', style: 'text-align:center;margin-bottom:6px' },
            t({ gr: 'Πολλές λάθος προσπάθειες. Περίμενε…', en: 'Too many wrong tries. Please wait…' })),
          num
        ]));
        var iv = setInterval(function () {
          remain--;
          if (remain <= 0) {
            clearInterval(iv);
            locked = false; attempts = 0;
            renderChallenge();
          } else { num.textContent = String(remain); }
        }, 1000);
      }

      function header() {
        return mk('div', { class: 'sym-hv-top' }, [
          mk('div', { class: 'sym-hv-badge', html: shieldSVG() }),
          mk('div', { class: 'sym-hv-ttl' }, t({ gr: 'Επαλήθευση', en: 'Verify' })),
          mk('button', {
            class: 'sym-hv-x', type: 'button',
            'aria-label': t({ gr: 'Κλείσιμο', en: 'Close' }),
            onclick: cancel
          }, '✕')
        ]);
      }

      function footer(withNew) {
        var dots = mk('div', { class: 'sym-hv-dots', 'aria-hidden': 'true' });
        for (var i = 0; i < MAX_ATTEMPTS; i++) {
          dots.appendChild(mk('span', { class: 'sym-hv-dot' + (i < attempts ? ' used' : '') }));
        }
        var kids = [mk('span', { class: 'sym-hv-msg', role: 'status', 'aria-live': 'polite' }, '')];
        if (withNew) {
          kids.push(mk('button', {
            class: 'sym-hv-new', type: 'button',
            onclick: function () { renderChallenge(); }
          }, t({ gr: 'Νέα ερώτηση', en: 'New question' })));
        }
        kids.push(dots);
        return mk('div', { class: 'sym-hv-foot' }, kids);
      }

      /* ── render one fresh challenge ── */
      function renderChallenge() {
        ch = makeChallenge();
        shownAt = Date.now();
        box.classList.remove('sym-hv-bad');
        box.innerHTML = '';
        box.appendChild(header());
        box.appendChild(mk('p', { class: 'sym-hv-sub' },
          t({ gr: 'Για την ασφάλεια του λογαριασμού, επιβεβαίωσε ότι είσαι άνθρωπος.',
              en: 'For account security, confirm you are human.' })));

        if (ch.kind === 'arith' || ch.kind === 'word') {
          box.appendChild(mk('p', { class: 'sym-hv-prompt', html: ch.promptHTML }));
          var optsWrap = mk('div', { class: 'sym-hv-opts' });
          ch.options.forEach(function (o) {
            optsWrap.appendChild(mk('button', {
              class: 'sym-hv-opt', type: 'button',
              onclick: function () { attempt(ch.check(o)); }
            }, String(o)));
          });
          box.appendChild(optsWrap);
          box.appendChild(footer(true));
        }
        else if (ch.kind === 'pick') {
          box.appendChild(mk('p', { class: 'sym-hv-prompt', html: ch.promptHTML }));
          var wrap = mk('div', { class: 'sym-hv-pickwrap' });
          var grid = mk('div', { class: 'sym-hv-grid' });
          var selected = new Set();
          ch.cells.forEach(function (c, idx) {
            var cell = mk('button', {
              class: 'sym-hv-cell', type: 'button', 'data-i': idx, 'aria-pressed': 'false'
            }, c.e);
            cell.addEventListener('click', function () {
              if (selected.has(idx)) { selected.delete(idx); cell.classList.remove('sel'); cell.setAttribute('aria-pressed', 'false'); }
              else { selected.add(idx); cell.classList.add('sel'); cell.setAttribute('aria-pressed', 'true'); }
            });
            grid.appendChild(cell);
          });
          wrap.appendChild(grid);
          wrap.appendChild(mk('button', {
            class: 'sym-hv-opt', type: 'button', style: 'grid-column:1/-1;font-size:14px;padding:11px',
            onclick: function () { attempt(ch.check(Array.from(selected))); }
          }, t({ gr: 'Επιβεβαίωση', en: 'Confirm' })));
          box.appendChild(wrap);
          box.appendChild(footer(true));
        }
        else { /* slide */
          box.appendChild(mk('p', { class: 'sym-hv-prompt' },
            t({ gr: 'Σύρε για επαλήθευση', en: 'Slide to verify' })));
          buildSlider(box);
          box.appendChild(footer(false));
        }
      }

      /* ── slide-to-verify control (pointer-driven) ── */
      function buildSlider(host) {
        var slider = mk('div', { class: 'sym-hv-slider' });
        var fill = mk('div', { class: 'sym-hv-fill' });
        var label = mk('div', { class: 'sym-hv-slabel' },
          t({ gr: 'Σύρε δεξιά →', en: 'Slide right →' }));
        var knob = mk('div', {
          class: 'sym-hv-knob', role: 'slider', tabindex: '0',
          'aria-label': t({ gr: 'Σύρε για επαλήθευση', en: 'Slide to verify' }),
          'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-valuenow': '0',
          html: '→'
        });
        slider.appendChild(fill); slider.appendChild(label); slider.appendChild(knob);
        host.appendChild(slider);

        var dragging = false, startX = 0, kw = 46, pad = 3, x = 0;
        function maxX() { return slider.clientWidth - kw - pad * 2; }
        function setX(px) {
          x = Math.max(0, Math.min(maxX(), px));
          knob.style.left = (pad + x) + 'px';
          fill.style.width = (kw + x) + 'px';
          var pct = Math.round((x / Math.max(1, maxX())) * 100);
          knob.setAttribute('aria-valuenow', String(pct));
          if (pct >= 96) slider.classList.add('ok'); else slider.classList.remove('ok');
        }
        function finishDrag() {
          if (x >= maxX() - 2) {
            slider.classList.add('ok');
            label.textContent = t({ gr: 'Έτοιμο ✓', en: 'Done ✓' });
            attempt(true);
          } else { setX(0); /* snap back */ }
        }
        function down(e) { dragging = true; startX = (e.touches ? e.touches[0].clientX : e.clientX) - x; e.preventDefault(); }
        function move(e) {
          if (!dragging) return;
          var cx = (e.touches ? e.touches[0].clientX : e.clientX);
          setX(cx - startX);
        }
        function up() { if (!dragging) return; dragging = false; finishDrag(); }

        knob.addEventListener('mousedown', down);
        knob.addEventListener('touchstart', down, { passive: false });
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move, { passive: false });
        window.addEventListener('mouseup', up);
        window.addEventListener('touchend', up);
        // keyboard accessibility: arrow / End / Space / Enter completes
        knob.addEventListener('keydown', function (e) {
          if (e.key === 'ArrowRight' || e.key === 'End' || e.key === ' ' || e.key === 'Enter') {
            setX(maxX()); finishDrag(); e.preventDefault();
          }
        });
        // expose for programmatic verification / testing
        slider._symComplete = function () { setX(maxX()); finishDrag(); };
        // clean up window listeners once the overlay is torn down
        var mo = new MutationObserver(function () {
          if (!document.body.contains(slider)) {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('touchmove', move);
            window.removeEventListener('mouseup', up);
            window.removeEventListener('touchend', up);
            mo.disconnect();
          }
        });
        mo.observe(document.body, { childList: true, subtree: true });
      }

      document.body.appendChild(overlay);
      renderChallenge();
      try { box.setAttribute('tabindex', '-1'); box.focus(); } catch (_) {}
    });
  }

  /* ════════════════════ SymAntiBot ════════════════════ */
  var SymAntiBot = {
    /* honeypot — inject a hidden trap input; bots fill it, humans can't see it */
    honeypot: function (formEl) {
      var name = 'sym_hp_' + Math.random().toString(36).slice(2, 8);
      var input = mk('input', {
        type: 'text', name: name, id: name,
        tabindex: '-1', autocomplete: 'off', 'aria-hidden': 'true'
      });
      // visually-hidden but still in the DOM/form so naive bots fill it
      input.setAttribute('style',
        'position:absolute!important;left:-9999px!important;top:auto!important;' +
        'width:1px!important;height:1px!important;overflow:hidden!important;' +
        'opacity:0!important;pointer-events:none!important;');
      // a label some bots key off of
      var label = mk('label', {
        'aria-hidden': 'true', for: name,
        style: 'position:absolute!important;left:-9999px!important;'
      }, 'Leave this field empty');

      if (formEl && formEl.appendChild) {
        formEl.appendChild(label);
        formEl.appendChild(input);
      }
      return {
        field: input,
        isBot: function () {
          return !!(input.value && String(input.value).trim().length > 0);
        },
        reset: function () { input.value = ''; },
        remove: function () {
          if (input.parentNode) input.parentNode.removeChild(input);
          if (label.parentNode) label.parentNode.removeChild(label);
        }
      };
    },

    /* throttle — client-side rate limit via localStorage timestamps */
    throttle: function (key, maxPerWindow, windowMs) {
      maxPerWindow = maxPerWindow || 5;
      windowMs = windowMs || 60000;
      var storeKey = 'sym_thr_' + key;
      var now = Date.now();
      var hits = [];
      try {
        var raw = localStorage.getItem(storeKey);
        if (raw) hits = JSON.parse(raw) || [];
      } catch (_) { hits = []; }
      if (!Array.isArray(hits)) hits = [];
      // keep only hits inside the current window
      hits = hits.filter(function (ts) { return (now - ts) < windowMs; });

      if (hits.length >= maxPerWindow) {
        var oldest = hits[0];
        var retryAfter = Math.max(0, windowMs - (now - oldest));
        // persist the pruned list (don't add a hit on a blocked attempt)
        try { localStorage.setItem(storeKey, JSON.stringify(hits)); } catch (_) {}
        return { allowed: false, retryAfter: retryAfter };
      }
      hits.push(now);
      try { localStorage.setItem(storeKey, JSON.stringify(hits)); } catch (_) {}
      return { allowed: true, retryAfter: 0 };
    },

    /* sanitize — trim, strip control chars + obvious HTML/script noise */
    sanitize: function (str) {
      if (str == null) return '';
      var s = String(str);
      // strip C0/C1 control chars (keep \t and \n) — they can hide payloads
      s = s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
      // kill <script ...>...</script> blocks entirely
      s = s.replace(/<script[\s\S]*?<\/script\s*>/gi, '');
      s = s.replace(/<script\b[^>]*>/gi, '');
      // strip any remaining HTML-ish tags
      s = s.replace(/<\/?[a-z][\s\S]*?>/gi, '');
      // neutralise stray angle brackets so nothing re-forms a tag downstream
      s = s.replace(/[<>]/g, '');
      return s.trim();
    }
  };

  window.SymHumanVerify = SymHumanVerify;
  window.SymAntiBot = SymAntiBot;
})();
