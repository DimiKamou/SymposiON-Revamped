// ============================================================
//  SymposiON — PIN Lobby: student joins a custom game by code
// ============================================================

async function joinGameWithPin(rawPin) {
  const pin   = (rawPin || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
  const errEl = document.getElementById('pin-join-error');
  const btn   = document.getElementById('pin-join-btn');
  const input = document.getElementById('pin-input');

  _hidePinError();

  if (pin.length !== 6) {
    _showPinError('Ο κωδικός πρέπει να είναι 6 χαρακτήρες.');
    input?.focus();
    return;
  }

  _setPinLoading(true);

  try {
    const snap = await firebase.firestore()
      .collection('custom_games')
      .where('pinCode', '==', pin)
      .limit(1)
      .get();

    if (snap.empty) {
      _showPinError('Δεν βρέθηκε παιχνίδι με αυτόν τον κωδικό.');
      input?.select();
      input?.focus();
      return;
    }

    const doc = snap.docs[0];
    if (typeof launchCustomHomework === 'function') {
      launchCustomHomework({ id: doc.id, ...doc.data() });
      if (input) input.value = '';
    }
  } catch (err) {
    console.error('[lobby] PIN join error:', err);
    _showPinError('Σφάλμα σύνδεσης. Δοκίμασε ξανά.');
  } finally {
    _setPinLoading(false);
  }
}

function _setPinLoading(on) {
  const btn = document.getElementById('pin-join-btn');
  if (!btn) return;
  btn.disabled = on;
  btn.classList.toggle('loading', on);
}

function _showPinError(msg) {
  const errEl = document.getElementById('pin-join-error');
  if (!errEl) return;
  errEl.textContent = msg;
  errEl.classList.remove('visible');
  void errEl.offsetWidth; // force reflow so animation restarts
  errEl.classList.add('visible');
}

function _hidePinError() {
  const errEl = document.getElementById('pin-join-error');
  if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
}
