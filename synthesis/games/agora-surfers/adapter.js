/* ═══════════════════════════════════════════════════════════════════
   AGORA SURFERS — host adapter
   Drop this on the page that hosts your game panel:

     <script src="agora-surfers/adapter.js"></script>

   Then launch the runner with the questions your panel selected /
   generated (same way every other game receives its set):

     openAgoraSurfers({
       title: 'Ιλιάδα — Ραψωδία Α',
       questions: [
         { q: 'Ποιος είναι ο πατέρας του Αχιλλέα;',
           a: ['Πηλεύς','Πρίαμος','Νέστωρ'], correct: 0 },
         // …  3–4 options each.  Paideia shape { q, opts, ans } also works.
       ],
     });

   The game itself ships NO questions — it plays only what you pass in.
   closeAgoraSurfers() tears the iframe down and frees the GPU.

   Back-compat: openTempleRun / closeTempleRun are kept as aliases.
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Directory of THIS script → works on file://, any subdir, any domain.
  var BASE = (function () {
    try {
      if (document.currentScript && document.currentScript.src) {
        var s = document.currentScript.src;
        return s.substring(0, s.lastIndexOf('/') + 1);
      }
    } catch (e) {}
    var found = document.querySelector('script[src*="agora-surfers"]');
    if (found && found.src) return found.src.substring(0, found.src.lastIndexOf('/') + 1);
    return 'agora-surfers/';
  })();

  var OVERLAY_ID = 'agora-surfers-overlay';

  function ensureOverlay() {
    var ov = document.getElementById(OVERLAY_ID);
    if (ov) return ov;
    ov = document.createElement('div');
    ov.id = OVERLAY_ID;
    ov.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:9999', 'display:none',
      'background:#0D0A06',
    ].join(';');
    document.body.appendChild(ov);
    return ov;
  }

  window.openAgoraSurfers = function (config) {
    config = Object.assign({ title: '', questions: [], lang: null }, config || {});

    // Prefer directly-passed questions; fall back to the GP pool injected by
    // _gpInjectEngineData('temple-run') before the opener was called — same
    // bridge pattern as Naumachia (_gpNauPool), Labyrinth (LB_Q), etc.
    var gpPool = window._gpTrPool || [];
    var questions = (config.questions && config.questions.length >= 3)
      ? config.questions
      : gpPool;

    // Bridge: the same-origin iframe reads this via window.parent.__trInject.
    window.__trInject = {
      title:     config.title || 'Agora Surfers',
      lang:      config.lang  || (typeof window.siteLang === 'string' ? window.siteLang : 'gr'),
      questions: questions.length >= 3 ? questions : null,
    };

    var ov = ensureOverlay();
    ov.style.display = 'block';
    document.body.style.overflow = 'hidden';
    ov.innerHTML = '';

    // Dark cover hides the white iframe flash while Three.js boots.
    var cover = document.createElement('div');
    cover.style.cssText = [
      'position:absolute', 'inset:0', 'z-index:2', 'background:#0D0A06',
      'display:flex', 'align-items:center', 'justify-content:center', 'pointer-events:none',
    ].join(';');
    cover.innerHTML = '<span style="font-size:2.6rem;opacity:.4;'
      + 'animation:as-spin 2s linear infinite">⚔️</span>'
      + '<style>@keyframes as-spin{to{transform:rotate(360deg)}}</style>';
    ov.appendChild(cover);

    var iframe = document.createElement('iframe');
    iframe.src = BASE + 'index.html';   // relative to this script
    iframe.setAttribute('allowfullscreen', '');
    iframe.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:none;display:block';
    iframe.addEventListener('load', function () { cover.remove(); }, { once: true });
    ov.appendChild(iframe);

    window.__agoraFrame = iframe;
  };

  window.closeAgoraSurfers = function () {
    window.__trInject = null;
    var ov = document.getElementById(OVERLAY_ID);
    if (ov) {
      var ifrm = ov.querySelector('iframe');
      if (ifrm) ifrm.src = 'about:blank';   // stop the WebGL loop immediately
      setTimeout(function () { ov.innerHTML = ''; ov.style.display = 'none'; }, 250);
    }
    document.body.style.overflow = '';
  };

  // Always overwrite the aliases so the lazy-loader stub is properly replaced
  // and so existing panel code that calls openTempleRun/closeTempleRun works.
  window.openTempleRun  = window.openAgoraSurfers;
  window.closeTempleRun = window.closeAgoraSurfers;
})();
