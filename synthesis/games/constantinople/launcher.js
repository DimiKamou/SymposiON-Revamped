// SymposiON launcher glue — «Κωνσταντινούπολις 330–1453» (iframe overlay).
(function () {
  'use strict';
  function _appBase() { return window.APP_BASE || (new URL('./', location.href).href); }
  window.openConstantinople = function () {
    var wrap = document.getElementById('constantinople-wrap');
    if (wrap && !wrap.querySelector('iframe')) {
      var docLang = (document.documentElement.getAttribute('lang') || '').slice(0, 2);
      var lang = (docLang === 'el' || docLang === 'gr') ? 'gr' : 'en';
      wrap.innerHTML = '<iframe src="' + _appBase() + 'games/constantinople/index.html?lang=' + lang + '"' +
        ' title="Constantinople 330-1453" allow="fullscreen; autoplay; pointer-lock"' +
        ' style="width:100%;height:100%;border:0;display:block"></iframe>';
    }
    var ov = document.getElementById('constantinople-overlay');
    if (ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
  };
  window.closeConstantinople = function () {
    var ov = document.getElementById('constantinople-overlay');
    if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
    var wrap = document.getElementById('constantinople-wrap');
    if (wrap) wrap.innerHTML = '';
    if (typeof goTo === 'function') goTo('home');
  };
})();
