// ============================================================
//  SymposiON — Inline Checkout Module  v1.0
//  Stripe Payment Element (Card + Google Pay + Apple Pay)
//  + PayPal Buttons SDK
//  Backed by Firebase Cloud Functions for server-side verification.
//
//  Depends on:
//    nav.js       → t(), showToast(), goTo(), currentUser
//    subscribe.js → _subType, _subMonths, _subClass, _subPricing, _formatEuro
//    Firebase     → firebase.functions()
// ============================================================

'use strict';

// ── Stripe publishable key ─────────────────────────────────
// Replace with your real key from https://dashboard.stripe.com/apikeys
const _CO_STRIPE_PK = 'pk_test_REPLACE_WITH_YOUR_STRIPE_PUBLISHABLE_KEY';

// ── PayPal client ID ───────────────────────────────────────
// Replace with your real client ID from https://developer.paypal.com/
const _CO_PAYPAL_CLIENT_ID = 'REPLACE_WITH_YOUR_PAYPAL_CLIENT_ID';

// ── Module state ──────────────────────────────────────────
let _coStripe          = null;   // Stripe.js instance
let _coElements        = null;   // stripe.elements() result
let _coPayEl           = null;   // mounted PaymentElement
let _coClientSecret    = null;   // PaymentIntent client_secret
let _coStripeReady     = false;  // PaymentElement fully mounted
let _coPayPalLoaded    = false;  // PayPal SDK injected & rendered
let _coActiveMethod    = 'card'; // 'card' | 'paypal'

// ── Stripe dark theme ─────────────────────────────────────
const _CO_STRIPE_APPEARANCE = {
  theme: 'night',
  variables: {
    colorPrimary:         '#c9a44a',
    colorBackground:      '#16130e',
    colorText:            '#e8e2d5',
    colorDanger:          '#c05040',
    fontFamily:           "'Raleway', sans-serif",
    fontSizeBase:         '14px',
    borderRadius:         '7px',
    spacingUnit:          '4px',
    colorTextPlaceholder: '#6a6358',
    colorIcon:            '#9a9385',
    colorIconTabSelected: '#c9a44a',
  },
  rules: {
    '.Input': {
      border:          '1px solid #2e2b25',
      backgroundColor: '#0f0d0a',
      color:           '#e8e2d5',
      boxShadow:       'none',
      padding:         '10px 12px',
    },
    '.Input:focus': {
      border:    '1px solid #c9a44a',
      boxShadow: '0 0 0 3px rgba(201,164,74,.14)',
    },
    '.Input--invalid': {
      border:    '1px solid #c05040',
      boxShadow: '0 0 0 3px rgba(192,80,64,.12)',
    },
    '.Label': {
      color:          '#7a7265',
      fontSize:       '10.5px',
      letterSpacing:  '.065em',
      textTransform:  'uppercase',
      fontWeight:     '700',
    },
    '.Tab': {
      border:          '1px solid #2e2b25',
      backgroundColor: '#16130e',
      color:           '#9a9385',
    },
    '.Tab:hover': {
      border:          '1px solid #c9a44a',
      color:           '#e8e2d5',
      backgroundColor: '#1e1a12',
    },
    '.Tab--selected': {
      borderColor:     '#c9a44a',
      backgroundColor: '#1e1a12',
      color:           '#e8e2d5',
      boxShadow:       '0 0 0 1px #c9a44a',
    },
    '.TabIcon--selected': { fill: '#c9a44a' },
    '.Error':   { color: '#c05040' },
    '.Block':   { backgroundColor: '#16130e', borderColor: '#2e2b25' },
  },
};

// ============================================================
//  ENTRY POINT — called by proceedToCheckout() in subscribe.js
// ============================================================
function openCheckoutZone() {
  if (!currentUser) {
    if (typeof openAuthModal === 'function') openAuthModal('login');
    showToast('Συνδέσου πρώτα για να συνεχίσεις.', 'Please sign in to continue.');
    return;
  }

  const zone = document.getElementById('checkout-merchant-zone');
  if (!zone) return;

  // Populate order summary with current selection
  _coUpdateOrderSummary();

  // Show zone and scroll to it
  zone.classList.remove('co-hidden');
  requestAnimationFrame(() => {
    zone.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  // Default to card method and init Stripe
  _coSwitchMethod('card');
}

function closeCheckoutZone() {
  const zone = document.getElementById('checkout-merchant-zone');
  if (zone) zone.classList.add('co-hidden');
  // Destroy Stripe elements so we get a fresh PaymentIntent on reopen
  _coStripe      = null;
  _coElements    = null;
  _coPayEl       = null;
  _coClientSecret = null;
  _coStripeReady  = false;
  _coPayPalLoaded = false;
  _coActiveMethod = 'card';
}

// ── Populate order summary chip ────────────────────────────
function _coUpdateOrderSummary() {
  const el = document.getElementById('co-order-details');
  if (!el) return;

  const type     = (typeof _subType   !== 'undefined') ? _subType   : 'student';
  const months   = (typeof _subMonths !== 'undefined') ? _subMonths : 1;
  const cls      = (typeof _subClass  !== 'undefined') ? _subClass  : 'all';
  const pricing  = (typeof _subPricing !== 'undefined') ? _subPricing : null;

  const typeLabel = { student: t('Μαθητής', 'Student'), teacher: t('Καθηγητής', 'Teacher') }[type]
                    || type.charAt(0).toUpperCase() + type.slice(1);
  const durLabel  = months === 1
    ? t('1 Μήνας', '1 Month')
    : t(`${months} Μήνες`, `${months} Months`);
  const price     = (pricing && pricing[type]?.[months])
    ? (typeof _formatEuro === 'function' ? _formatEuro(pricing[type][months]) : `€${pricing[type][months].toFixed(2)}`)
    : '—';
  const clsLabel  = cls === 'all' ? t('Όλες οι τάξεις', 'All Grades') : cls;

  el.innerHTML = `
    <div class="co-order-row">
      <span class="co-order-plan">SymposiON Pro — ${typeLabel}</span>
      <span class="co-order-price">${price}</span>
    </div>
    <div class="co-order-meta">${durLabel} · ${clsLabel}</div>
  `;

  // Also update the pay button price label
  const priceDisplay = document.getElementById('co-btn-price-display');
  if (priceDisplay) priceDisplay.textContent = price;
}

// ============================================================
//  METHOD SWITCHER
// ============================================================
function _coSwitchMethod(method) {
  _coActiveMethod = method;

  document.querySelectorAll('.co-method-btn').forEach(btn => {
    btn.classList.toggle('co-method-btn--active', btn.dataset.method === method);
    btn.setAttribute('aria-pressed', btn.dataset.method === method ? 'true' : 'false');
  });

  const stripeZone = document.getElementById('co-stripe-zone');
  const paypalZone = document.getElementById('co-paypal-zone');

  if (method === 'card') {
    stripeZone?.classList.remove('co-hidden');
    paypalZone?.classList.add('co-hidden');
    _coInitStripe();
  } else {
    stripeZone?.classList.add('co-hidden');
    paypalZone?.classList.remove('co-hidden');
    _coInitPayPal();
  }
}

// ============================================================
//  STRIPE — Payment Element (Card + Google Pay + Apple Pay)
// ============================================================

async function _coInitStripe() {
  if (_coElements) return; // already mounted

  _coSetStripeLoading(true);
  _coClearError('stripe');

  try {
    // 1. Load Stripe.js on demand
    if (!window.Stripe) await _coInjectScript('https://js.stripe.com/v3/');
    if (!_coStripe) _coStripe = Stripe(_CO_STRIPE_PK); // eslint-disable-line no-undef

    // 2. Create PaymentIntent on server (server verifies price)
    const createPI = firebase.functions().httpsCallable('createPaymentIntent');
    const res = await createPI({
      userType: (typeof _subType   !== 'undefined') ? _subType   : 'student',
      months:   (typeof _subMonths !== 'undefined') ? _subMonths : 1,
      classKey: (typeof _subClass  !== 'undefined') ? _subClass  : 'all',
    });
    _coClientSecret = res.data.clientSecret;

    // 3. Create Elements with full dark theme
    _coElements = _coStripe.elements({
      clientSecret: _coClientSecret,
      appearance:   _CO_STRIPE_APPEARANCE,
      fonts: [{ cssSrc: 'https://fonts.googleapis.com/css2?family=Raleway:wght@400;600&display=swap' }],
    });

    // 4. Mount PaymentElement (auto-shows Card, Google Pay, Apple Pay tabs)
    const mountEl = document.getElementById('stripe-payment-element');
    if (!mountEl) throw new Error('Mount point #stripe-payment-element not found');

    _coPayEl = _coElements.create('payment', {
      layout: { type: 'tabs', defaultCollapsed: false },
      wallets: { googlePay: 'auto', applePay: 'auto' },
    });

    _coPayEl.mount('#stripe-payment-element');
    _coPayEl.on('ready',  () => { _coSetStripeLoading(false); _coStripeReady = true; });
    _coPayEl.on('loaderror', (e) => {
      _coSetStripeLoading(false);
      _coShowError('stripe', t('Σφάλμα φόρτωσης φόρμας.', 'Form failed to load.') + ' (' + (e.error?.message || '') + ')');
    });

  } catch (err) {
    console.error('[checkout] Stripe init:', err);
    _coSetStripeLoading(false);
    _coShowError('stripe',
      err.message?.includes('not configured')
        ? t('Η πληρωμή δεν έχει ρυθμιστεί ακόμα.', 'Payment not configured yet.')
        : t('Αδύνατη σύνδεση με πύλη πληρωμής. Δοκίμασε ξανά.', 'Could not connect to payment gateway. Please try again.')
    );
  }
}

async function coSubmitStripePayment() {
  if (!_coElements || !_coStripe) return;

  const btn = document.getElementById('co-stripe-pay-btn');
  _coClearError('stripe');
  _coSetBtnState(btn, 'loading');

  try {
    const { error, paymentIntent } = await _coStripe.confirmPayment({
      elements:         _coElements,
      redirect:         'if_required',          // handle 3DS inline; redirect only when necessary
      confirmParams: {
        return_url: window.location.origin + window.location.pathname + '?payment=success',
      },
    });

    if (error) {
      _coSetBtnState(btn, 'idle');
      _coShowError('stripe', _coLocalizeStripeError(error));
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      _coSetBtnState(btn, 'success');
      _coShowSuccessState();
    }

  } catch (err) {
    console.error('[checkout] confirm error:', err);
    _coSetBtnState(btn, 'idle');
    _coShowError('stripe', t('Σφάλμα σύνδεσης. Δοκίμασε ξανά.', 'Connection error. Please try again.'));
  }
}

function _coLocalizeStripeError(error) {
  const MAP = {
    card_declined:     t('Η κάρτα απορρίφθηκε.', 'Your card was declined.'),
    insufficient_funds:t('Ανεπαρκές υπόλοιπο.', 'Insufficient funds.'),
    incorrect_cvc:     t('Λανθασμένος CVC.', 'Incorrect CVC code.'),
    expired_card:      t('Η κάρτα έχει λήξει.', 'Your card has expired.'),
    processing_error:  t('Σφάλμα επεξεργασίας. Δοκίμασε ξανά.', 'Processing error. Try again.'),
    incorrect_number:  t('Λανθασμένος αριθμός κάρτας.', 'Incorrect card number.'),
    do_not_honor:      t('Η κάρτα σου δεν αποδέχτηκε την πληρωμή.', 'Your card did not accept the payment.'),
    authentication_required: t('Απαιτείται επαλήθευση κάρτας (3DS).', 'Card authentication required (3DS).'),
  };
  return MAP[error.code] || MAP[error.decline_code]
    || error.message
    || t('Η πληρωμή απέτυχε. Παρακαλώ δοκιμάστε ξανά.', 'Payment failed. Please try again.');
}

function _coSetStripeLoading(on) {
  document.getElementById('co-stripe-skeleton')?.classList.toggle('co-hidden', !on);
  document.getElementById('stripe-payment-element')?.classList.toggle('co-hidden', on);
  const payBtn = document.getElementById('co-stripe-pay-btn');
  if (payBtn) payBtn.disabled = on;
}

// ============================================================
//  PAYPAL — Buttons SDK
// ============================================================

async function _coInitPayPal() {
  if (_coPayPalLoaded) return;
  _coClearError('paypal');

  const wrap = document.getElementById('co-paypal-inner');
  if (!wrap) return;
  wrap.innerHTML = `<div class="co-paypal-spinner"><div class="co-spinner"></div><p>${t('Φόρτωση PayPal…', 'Loading PayPal…')}</p></div>`;

  try {
    if (!window.paypal) {
      await _coInjectScript(
        `https://www.paypal.com/sdk/js?client-id=${_CO_PAYPAL_CLIENT_ID}&currency=EUR&intent=capture&components=buttons`,
        { 'data-sdk-integration-source': 'integrationbuilder_sc' }
      );
    }

    wrap.innerHTML = ''; // remove spinner

    paypal.Buttons({ // eslint-disable-line no-undef
      style: {
        layout:  'vertical',
        color:   'gold',
        shape:   'rect',
        label:   'pay',
        height:  48,
        tagline: false,
      },

      // ── CREATE ORDER (server-side) ──
      createOrder: async () => {
        try {
          const fn  = firebase.functions().httpsCallable('createPayPalOrder');
          const res = await fn({
            userType: (typeof _subType   !== 'undefined') ? _subType   : 'student',
            months:   (typeof _subMonths !== 'undefined') ? _subMonths : 1,
            classKey: (typeof _subClass  !== 'undefined') ? _subClass  : 'all',
          });
          return res.data.orderId;
        } catch (err) {
          console.error('[checkout] PayPal createOrder:', err);
          _coShowError('paypal', t('Αδύνατη δημιουργία παραγγελίας. Δοκίμασε ξανά.', 'Could not create order. Please try again.'));
          throw err;
        }
      },

      // ── APPROVE → CAPTURE (server-side) ──
      onApprove: async (data) => {
        wrap.innerHTML = `<div class="co-paypal-spinner"><div class="co-spinner"></div><p>${t('Επαλήθευση πληρωμής…', 'Verifying payment…')}</p></div>`;
        try {
          const fn  = firebase.functions().httpsCallable('capturePayPalOrder');
          const res = await fn({ orderId: data.orderID });
          if (res.data.status === 'COMPLETED') {
            _coShowSuccessState();
          } else {
            throw new Error('Unexpected capture status: ' + res.data.status);
          }
        } catch (err) {
          console.error('[checkout] PayPal capture:', err);
          _coPayPalLoaded = false;
          _coInitPayPal();
          _coShowError('paypal', t('Η επαλήθευση απέτυχε. Δοκίμασε ξανά.', 'Verification failed. Please try again.'));
        }
      },

      onError: (err) => {
        console.error('[checkout] PayPal SDK error:', err);
        _coShowError('paypal', t('Η πληρωμή μέσω PayPal απέτυχε. Παρακαλώ δοκιμάστε ξανά.', 'PayPal payment failed. Please try again.'));
      },

      onCancel: () => {
        _coShowError('paypal', t('Η πληρωμή ακυρώθηκε.', 'Payment was cancelled.'));
      },

    }).render('#co-paypal-inner');

    _coPayPalLoaded = true;

  } catch (err) {
    console.error('[checkout] PayPal init:', err);
    wrap.innerHTML = '';
    _coShowError('paypal', t('Αδύνατη φόρτωση PayPal. Δοκίμασε ξανά.', 'Could not load PayPal. Please try again.'));
  }
}

// ============================================================
//  SUCCESS STATE
// ============================================================
function _coShowSuccessState() {
  const zone = document.getElementById('checkout-merchant-zone');
  if (!zone) return;

  zone.innerHTML = `
    <div class="co-success-wrap" role="status" aria-live="polite">
      <div class="co-success-ring">
        <svg class="co-check-svg" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle class="co-check-circle" cx="28" cy="28" r="26"
                  stroke="#c9a44a" stroke-width="2" stroke-dasharray="163.4" stroke-dashoffset="163.4"/>
          <path  class="co-check-mark"   d="M16 29l8 8 16-16"
                  stroke="#c9a44a" stroke-width="2.8" stroke-linecap="round"
                  stroke-linejoin="round" stroke-dasharray="33" stroke-dashoffset="33"/>
        </svg>
      </div>
      <h3 class="co-success-title">${t('Πληρωμή Επιτυχής!', 'Payment Successful!')}</h3>
      <p  class="co-success-body">
        ${t('Η πρόσβασή σου ενεργοποιείται εντός λεπτού.', 'Your access will be activated within a minute.')}
      </p>
      <p  class="co-success-note">
        ${t('Θα λάβεις επιβεβαίωση στο email σου.', "You'll receive a confirmation email shortly.")}
      </p>
    </div>
  `;

  // Trigger SVG animations on next tick
  requestAnimationFrame(() => {
    zone.querySelector('.co-check-circle')?.classList.add('co-anim-circle');
    zone.querySelector('.co-check-mark')?.classList.add('co-anim-check');
  });

  setTimeout(() => { if (typeof goTo === 'function') goTo('home'); }, 4000);
}

// ============================================================
//  ERROR / STATE HELPERS
// ============================================================
function _coShowError(zone, message) {
  const id = zone === 'stripe' ? 'co-stripe-error' : 'co-paypal-error';
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = message;
  el.classList.remove('co-hidden');
  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function _coClearError(zone) {
  const ids = zone ? [`co-${zone}-error`] : ['co-stripe-error', 'co-paypal-error'];
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.add('co-hidden'); }
  });
}

function _coSetBtnState(btn, state) {
  if (!btn) return;
  const price   = document.getElementById('co-btn-price-display')?.textContent || '';
  const LABELS  = {
    idle:    `<svg class="co-lock-icon" viewBox="0 0 16 18" fill="none"><rect x="3" y="8" width="10" height="9" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M5 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>${t('Ολοκλήρωση Πληρωμής', 'Complete Payment')}<span class="co-pay-price">${price}</span>`,
    loading: `<span class="co-spinner-inline"></span>${t('Επεξεργασία…', 'Processing…')}`,
    success: `<svg viewBox="0 0 16 16" fill="none" style="width:15px;height:15px;margin-right:6px;"><path d="M3 8l3.5 3.5L13 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>${t('Πληρωμή Επιτυχής!', 'Payment Successful!')}`,
  };
  btn.disabled   = state !== 'idle';
  btn.innerHTML  = LABELS[state] ?? LABELS.idle;
  btn.className  = 'co-pay-btn' + (state === 'loading' ? ' co-pay-btn--loading' : state === 'success' ? ' co-pay-btn--success' : '');
}

// ── Utility: inject a script tag once ─────────────────────
function _coInjectScript(src, attrs = {}) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s   = document.createElement('script');
    s.src     = src;
    s.async   = true;
    Object.entries(attrs).forEach(([k, v]) => s.setAttribute(k, v));
    s.onload  = resolve;
    s.onerror = () => reject(new Error(`Script load failed: ${src}`));
    document.head.appendChild(s);
  });
}

// ── Handle Stripe redirect return (payment_intent in URL) ─
(function _handleStripeReturn() {
  const p      = new URLSearchParams(window.location.search);
  const status = p.get('redirect_status');
  if (!status) return;
  history.replaceState({}, '', window.location.pathname);
  if (status === 'succeeded') {
    setTimeout(() => showToast(
      '✓ Η πληρωμή ολοκληρώθηκε! Η πρόσβασή σου ενεργοποιείται εντός λεπτού.',
      '✓ Payment complete! Your access activates within a minute.'
    ), 700);
  } else if (status === 'failed') {
    setTimeout(() => showToast(
      'Η πληρωμή απέτυχε. Παρακαλώ δοκιμάστε ξανά.',
      'Payment failed. Please try again.'
    ), 700);
  }
})();
