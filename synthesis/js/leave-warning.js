/* ════════════════════════════════════════════════════════════════════
   leave-warning.js — in-app "exit the game?" confirmation.

   Replaces the blocking window.confirm() the shell used for the in-game Back
   guard with a themed modal (design handoff: leaving-warning.html). Appears
   above game overlays; closes on Stay, backdrop click, or Esc.

     window.showLeaveWarning({ title, message, progress, stayLabel, leaveLabel,
                               onLeave, onStay })
     window.closeLeaveWarning()

   Themed with the shell's design tokens (var(--card) …) so it matches light &
   dark. beforeunload (tab close / refresh) still uses the browser's own prompt —
   that one is not replaceable by page script.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.showLeaveWarning) return;

  var WARN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>';
  var HOUR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12"/><path d="M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/></svg>';

  function lang() { return window.SYM_LANG === 'en' ? 'en' : 'gr'; }

  var CSS =
    '.sym-leave-scrim{position:fixed;inset:0;z-index:10050;display:grid;place-items:center;padding:24px;' +
      'background:rgba(6,4,14,.72);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);' +
      'opacity:0;pointer-events:none;transition:opacity .22s}' +
    '.sym-leave-scrim.on{opacity:1;pointer-events:auto}' +
    '.sym-leave-modal{width:min(340px,90vw);text-align:center;border-radius:16px;padding:22px;' +
      'background:var(--card,#182430);color:var(--fg,#eef0ff);border:1px solid var(--line,rgba(160,150,210,.16));' +
      'box-shadow:0 40px 90px -30px rgba(0,0,0,.9);transform:scale(.94) translateY(10px);transition:transform .22s;' +
      'font-family:var(--sans,"Alegreya Sans",system-ui,sans-serif)}' +
    '.sym-leave-scrim.on .sym-leave-modal{transform:none}' +
    '.sym-leave-ic{width:48px;height:48px;border-radius:50%;margin:0 auto 12px;display:grid;place-items:center;' +
      'background:var(--terra-soft,rgba(236,95,136,.14));color:var(--terra,#ec5f88)}' +
    '.sym-leave-ic svg{width:24px;height:24px}' +
    '.sym-leave-t{font-family:var(--serif,"Alegreya",serif);font-size:20px;font-weight:800;margin:0 0 5px}' +
    '.sym-leave-m{color:var(--muted,#a6a2c8);font-size:13.5px;margin:0}' +
    '.sym-leave-prog{display:inline-flex;align-items:center;gap:7px;margin:12px 0 18px;border-radius:999px;padding:5px 12px;' +
      'font-size:12px;font-weight:700;color:var(--gold,#e6b85f);background:rgba(0,0,0,.22);border:1px solid var(--line-soft,rgba(255,255,255,.06))}' +
    '.sym-leave-prog svg{width:14px;height:14px}' +
    '.sym-leave-btns{display:flex;gap:9px}' +
    '.sym-leave-btns button{flex:1;border-radius:10px;padding:10px;font:800 13.5px var(--sans,"Alegreya Sans",system-ui,sans-serif);cursor:pointer;transition:.15s}' +
    '.sym-leave-stay{border:1px solid var(--line,rgba(160,150,210,.16));background:rgba(127,127,127,.08);color:var(--fg,#eef0ff)}' +
    '.sym-leave-stay:hover{border-color:var(--terra,#5bd0c0);color:var(--terra,#7fe3d5)}' +
    '.sym-leave-leave{border:none;color:#fff;background:linear-gradient(180deg,var(--terra,#ff85a8),var(--terra-dk,#ec5f88))}' +
    '.sym-leave-leave:hover{filter:brightness(1.06);transform:translateY(-1px)}';

  var scrim, titleEl, msgEl, progEl, stayEl, leaveEl, keyH, cbStay;

  function ensureCss() {
    if (document.getElementById('sym-leave-css')) return;
    var s = document.createElement('style'); s.id = 'sym-leave-css'; s.textContent = CSS;
    document.head.appendChild(s);
  }
  function build() {
    scrim = document.createElement('div');
    scrim.className = 'sym-leave-scrim';
    scrim.innerHTML =
      '<div class="sym-leave-modal" role="alertdialog" aria-modal="true">' +
        '<div class="sym-leave-ic">' + WARN + '</div>' +
        '<h2 class="sym-leave-t"></h2>' +
        '<p class="sym-leave-m"></p>' +
        '<div class="sym-leave-prog"></div>' +
        '<div class="sym-leave-btns"><button class="sym-leave-stay" type="button"></button><button class="sym-leave-leave" type="button"></button></div>' +
      '</div>';
    document.body.appendChild(scrim);
    titleEl = scrim.querySelector('.sym-leave-t');
    msgEl   = scrim.querySelector('.sym-leave-m');
    progEl  = scrim.querySelector('.sym-leave-prog');
    stayEl  = scrim.querySelector('.sym-leave-stay');
    leaveEl = scrim.querySelector('.sym-leave-leave');
    // backdrop click = stay (dismiss)
    scrim.addEventListener('click', function (e) { if (e.target === scrim) close(); });
  }
  function close() {
    if (!scrim) return;
    scrim.classList.remove('on');
    if (keyH) { document.removeEventListener('keydown', keyH); keyH = null; }
  }

  window.closeLeaveWarning = close;
  window.showLeaveWarning = function (o) {
    o = o || {};
    ensureCss();
    if (!scrim) build();
    var en = lang() === 'en';
    titleEl.textContent = o.title || (en ? 'Exit the game?' : 'Έξοδος από το παιχνίδι;');
    msgEl.textContent   = o.message || (en ? 'Are you sure you want to leave?' : 'Είσαι σίγουρος ότι θέλεις να φύγεις;');
    progEl.innerHTML    = HOUR + ' ' + (o.progress || (en ? 'This round’s progress will be lost' : 'Η πρόοδος αυτού του γύρου θα χαθεί'));
    stayEl.textContent  = o.stayLabel || (en ? 'Keep playing' : 'Συνέχισε το παιχνίδι');
    leaveEl.textContent = o.leaveLabel || (en ? 'Exit' : 'Έξοδος');
    cbStay = o.onStay;
    // fresh handlers each open (capture this call's callbacks)
    stayEl.onclick  = function () { close(); if (o.onStay) o.onStay(); };
    leaveEl.onclick = function () { close(); if (o.onLeave) o.onLeave(); };
    scrim.classList.add('on');
    keyH = function (e) { if (e.key === 'Escape') close(); };  // Esc = stay (dismiss)
    document.addEventListener('keydown', keyH);
  };
})();
