// SymposiON launcher glue — «Ακρόπολις 432 π.Χ.» (iframe overlay).
(function () {
  'use strict';
  function _appBase() { return window.APP_BASE || (new URL('./', location.href).href); }
  window.openAcropolis = function () {
    var wrap = document.getElementById('acropolis-wrap');
    if (wrap && !wrap.querySelector('iframe')) {
      var docLang = (document.documentElement.getAttribute('lang') || '').slice(0, 2);
      var lang = (docLang === 'el' || docLang === 'gr') ? 'gr' : 'en';
      wrap.innerHTML = '<iframe src="' + _appBase() + 'games/acropolis/index.html?lang=' + lang + '"' +
        ' title="Acropolis 432 BC" allow="fullscreen; autoplay; pointer-lock"' +
        ' style="width:100%;height:100%;border:0;display:block"></iframe>';
    }
    var ov = document.getElementById('acropolis-overlay');
    if (ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
  };
  window.closeAcropolis = function () {
    var ov = document.getElementById('acropolis-overlay');
    if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
    var wrap = document.getElementById('acropolis-wrap');
    if (wrap) wrap.innerHTML = '';
    if (typeof goTo === 'function') goTo('home');
  };
})();
