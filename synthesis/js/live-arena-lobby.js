/* ============================================================
   Agora Live Arena — lobby extras
   Load AFTER js/live-arena.js:
     <script src="js/live-arena-lobby.js?v=1"></script>
   Adds, without touching live-arena.js:
     • inline QR in the lobby (reuses the QRCode library)
     • host avatar + class banner upload
     • timer / shuffle / lock setting pills (visual)
   ============================================================ */
(function () {
  'use strict';
  var LAX = {};
  function el(id) { return document.getElementById(id); }

  /* Build the join URL — reuse nav.js helper if present */
  function shareURL(pin) {
    try { if (typeof _buildShareURL === 'function') return _buildShareURL({ join: pin }); } catch (e) {}
    return location.origin + '/?join=' + pin;
  }

  /* ---- Inline QR (redrawn whenever the PIN changes) ---- */
  LAX.renderQR = function () {
    var box = el('la-qr-box');
    var pinEl = el('la-pin-display');
    if (!box || !pinEl) return;
    var pin = (pinEl.textContent || '').trim();
    if (!/^\d{4,8}$/.test(pin)) { box.innerHTML = ''; return; }
    if (box.getAttribute('data-pin') === pin) return; // already drawn
    box.setAttribute('data-pin', pin);
    box.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
      new QRCode(box, {
        text: shareURL(pin), width: 150, height: 150,
        colorDark: '#1C1510', colorLight: '#F4ECD8',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  };

  function watchPin() {
    var pinEl = el('la-pin-display');
    if (!pinEl) return;
    var obs = new MutationObserver(function () { LAX.renderQR(); });
    obs.observe(pinEl, { childList: true, characterData: true, subtree: true });
    LAX.renderQR();
  }

  /* ---- Image uploads ---- */
  function pickImage(cb) {
    var inp = document.createElement('input');
    inp.type = 'file'; inp.accept = 'image/*';
    inp.onchange = function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function (e) { cb(e.target.result); };
      r.readAsDataURL(f);
    };
    inp.click();
  }
  LAX.uploadAvatar = function () {
    pickImage(function (src) {
      var a = el('la-host-avatar');
      if (a) { a.style.backgroundImage = 'url(' + src + ')'; a.classList.add('la-has-img'); }
    });
  };
  LAX.uploadBanner = function () {
    pickImage(function (src) {
      var b = el('la-lobby-banner');
      if (b) { b.style.backgroundImage = 'url(' + src + ')'; b.classList.add('la-has-img'); }
    });
  };

  /* Match config (per-question time, shuffle, lock, duration) now lives on the
     setup screen (curriculum-picker.js → _liveCfg) and is read by the engine
     from _cfg.config. The old footer pills + their handlers were removed. */

  window.LAX = LAX;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', watchPin);
  else watchPin();
})();
