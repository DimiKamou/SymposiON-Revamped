// SymposiON — launcher glue for «Αγία Σοφία 537», the interactive
// museum (iframe overlay, like istoria/symposion). Lazy-loaded by
// synLaunch via js/manifest/experiences.js; the 3D app itself lives
// in games/hagia-sophia/ and only loads when the overlay opens.
(function () {
  'use strict';

  function _appBase() {
    return window.APP_BASE || (new URL('./', location.href).href);
  }

  function openHagiaSophia() {
    var wrap = document.getElementById('hagia-sophia-wrap');
    if (wrap && !wrap.querySelector('iframe')) {
      var docLang = (document.documentElement.getAttribute('lang') || '').slice(0, 2);
      var lang = (docLang === 'el' || docLang === 'gr') ? 'gr' : 'en';
      wrap.innerHTML =
        '<iframe src="' + _appBase() + 'games/hagia-sophia/index.html?lang=' + lang + '"' +
        ' title="Hagia Sophia 537 — Interactive Museum"' +
        ' allow="fullscreen; autoplay; pointer-lock"' +
        ' style="width:100%;height:100%;border:0;display:block"></iframe>';
    }
    var ov = document.getElementById('hagia-sophia-overlay');
    if (ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
  }

  function closeHagiaSophia() {
    var ov = document.getElementById('hagia-sophia-overlay');
    if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
    // tear the WebGL context down so the museum doesn't render in the background
    var wrap = document.getElementById('hagia-sophia-wrap');
    if (wrap) wrap.innerHTML = '';
    if (typeof goTo === 'function') goTo('home');
  }

  window.openHagiaSophia = openHagiaSophia;
  window.closeHagiaSophia = closeHagiaSophia;
})();
