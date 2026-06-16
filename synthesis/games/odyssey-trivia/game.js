// ============================================================
//  Odyssey Trivia — Game Launcher
//  Reuses the Iliad Trivia engine (iliada-trivia/game.js).
//  Swaps QUESTIONS / RHAPSODIES to the Odyssey set before launch
//  and restores them on close.
// ============================================================

function launchOdysseyTrivia(lang) {
  window._triviaGameId = 'odyssey-trivia'; // mistake logging: tag errors to the correct game
  // Swap question data to Odyssey set
  window.QUESTIONS  = OD_QUESTIONS;
  window.RHAPSODIES = OD_RHAPSODIES;

  // Patch the overlay title and back-button label
  const titleEl = document.querySelector('#trivia-overlay .overlay-title');
  if (titleEl) {
    titleEl.dataset.gr = 'Trivia Οδύσσειας';
    titleEl.dataset.en = 'Odyssey Trivia';
    titleEl.textContent = (lang === 'en') ? 'Odyssey Trivia' : 'Trivia Οδύσσειας';
  }
  // Patch QR button to point to Odyssey Trivia
  const qrBtn = document.querySelector('#trivia-overlay .overlay-qr-btn');
  if (qrBtn) qrBtn.setAttribute('onclick', "showQR('Trivia Οδύσσειας', {nav:'game',id:'odyssey-trivia'})");

  // Patch the quote arrays so the end-screen uses Odyssey quotes
  window._savedQuotesEn = window.QUOTES_EN;
  window._savedQuotesGr = window.QUOTES_GR;
  window.QUOTES_EN = OD_QUOTES_EN;
  window.QUOTES_GR = OD_QUOTES_GR;

  // Use the shared trivia overlay + engine
  launchGame(lang || 'gr');
}

function closeOdysseyTrivia() {
  // Restore Iliad questions and quotes
  if (typeof ILIADA_QUESTIONS !== 'undefined') {
    window.QUESTIONS  = ILIADA_QUESTIONS;
    window.RHAPSODIES = ILIADA_RHAPSODIES;
  }
  if (window._savedQuotesEn) {
    window.QUOTES_EN = window._savedQuotesEn;
    window.QUOTES_GR = window._savedQuotesGr;
    window._savedQuotesEn = null;
    window._savedQuotesGr = null;
  }
  // Restore overlay title
  const titleEl = document.querySelector('#trivia-overlay .overlay-title');
  if (titleEl) {
    titleEl.dataset.gr = 'Trivia Ιλιάδας';
    titleEl.dataset.en = 'Iliad Trivia';
    titleEl.textContent = 'Trivia Ιλιάδας';
  }
  // Restore QR button to Iliad Trivia
  const qrBtn = document.querySelector('#trivia-overlay .overlay-qr-btn');
  if (qrBtn) qrBtn.setAttribute('onclick', "showQR('Trivia Ιλιάδας', {nav:'game',id:'iliada-trivia'})");
  window._triviaGameId = 'iliada-trivia'; // restore default game id for mistake logging
  closeGame();
}
