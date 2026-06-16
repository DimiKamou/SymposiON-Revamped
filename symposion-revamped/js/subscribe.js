// ============================================================
//  SymposiON — Subscription Page
//  Plan selection, Stripe Checkout initiation, payment callback
// ============================================================

// ── Pricing — defaults, overridden by Firestore /config/pricing ──
// Values in EUR (e.g. 4.99); Stripe multiplication happens server-side
let _subPricing = {
  student: { 1: 4.99,  3: 12.99, 6: 21.99, 12: 35.99 },
  teacher: { 1: 7.99,  3: 19.99, 6: 34.99, 12: 59.99 },
};

function _formatEuro(amount) { return `€${Number(amount).toFixed(2)}`; }

// Dynamic savings badges: show % off vs 1-month rate
function _calcSavings(type, months) {
  if (months === 1) return '';
  const base  = _subPricing[type][1] * months;
  const price = _subPricing[type][months];
  const pct   = Math.round((1 - price / base) * 100);
  return pct > 0 ? `−${pct}%` : '';
}

// ── Page State ──
let _subType   = 'student';
let _subClass  = 'all';
let _subMonths = 1;
let _subPricingLoaded = false;

// Custom plan labels loaded from Firestore (admin-defined extra plans)
let _subCustomPlans  = [];   // e.g. ['basic', 'school']
let _subPlanLabels   = {};   // e.g. { basic: 'Βασικό' }

async function _loadSubPricing() {
  if (_subPricingLoaded) return;
  try {
    const doc = await firebase.firestore().collection('config').doc('pricing').get();
    if (doc.exists) {
      const d = doc.data();
      const months = [1, 3, 6, 12];
      // Load built-in plans
      if (d.student) _subPricing.student = { 1: +d.student[1], 3: +d.student[3], 6: +d.student[6], 12: +d.student[12] };
      if (d.teacher) _subPricing.teacher = { 1: +d.teacher[1], 3: +d.teacher[3], 6: +d.teacher[6], 12: +d.teacher[12] };
      // Load custom plans
      if (d._customPlans?.length) {
        _subCustomPlans = d._customPlans;
        _subPlanLabels  = d._labels || {};
        d._customPlans.forEach(key => {
          if (d[key]) {
            _subPricing[key] = {};
            months.forEach(m => { _subPricing[key][m] = +d[key][m]; });
          }
        });
      }
    }
    _subPricingLoaded = true;
  } catch (_) {}
}

// ── ENTRY POINT ──
function navToSubscribe() {
  buildNav('subscribe-nav-wrap', [
    { label: t('Αρχική', 'Home'), action: "goTo('home')" },
    { label: t('Συνδρομές', 'Subscriptions') },
  ]);
  goTo('subscribe');
  _navPush({ page: 'subscribe' });
  _loadSubPricing().then(() => _renderSubscribePage());
}

// ── FULL PAGE RENDER (called on load + language change) ──
function _renderSubscribePage() {
  _renderSubTypePills();
  _renderSubClasses();
  _renderSubPlanCards();
  _renderSubFeatures();
  _syncSubCheckoutBtn();
}

// ── STEP 1: User Type Toggle ──
function _renderSubTypePills() {
  const wrap = document.getElementById('sub-type-wrap');
  if (!wrap) return;

  // Built-in plan definitions
  const builtIn = [
    { key: 'student', gr: 'Μαθητής',   en: 'Student', icon: '📚',
      descGr: 'Πρόσβαση σε όλα τα games & επίπεδα.',
      descEn: 'Access to all games & levels.' },
    { key: 'teacher', gr: 'Καθηγητής', en: 'Teacher', icon: '🎓',
      descGr: 'Μαθητής + δημιουργία κουίζ & QR codes.',
      descEn: 'Student + quiz builder & QR codes.' },
  ];

  // Append any custom plans added by the admin
  const custom = _subCustomPlans
    .filter(k => !['student','teacher'].includes(k))
    .map(k => {
      const label = _subPlanLabels[k] || k;
      return { key: k, gr: label, en: label, icon: '⭐',
               descGr: 'Προσαρμοσμένο πλάνο συνδρομής.',
               descEn: 'Custom subscription plan.' };
    });

  const types = [...builtIn, ...custom];

  wrap.innerHTML = types.map(tp => `
    <button class="sub-type-btn${_subType === tp.key ? ' active' : ''}"
            onclick="_setSubType('${tp.key}')">
      <span class="sub-type-icon">${tp.icon}</span>
      <span class="sub-type-label">${t(tp.gr, tp.en)}</span>
      <span class="sub-type-desc">${t(tp.descGr, tp.descEn)}</span>
    </button>
  `).join('');
}

// ── STEP 2: Class Selection ──
function _renderSubClasses() {
  const sel = document.getElementById('sub-class-select');
  if (!sel) return;
  const classes = [
    { key: 'all',       gr: '🌐 Όλες οι τάξεις — All Access',  en: '🌐 All Grades — All Access' },
    { key: 'gym-a',     gr: 'Α΄ Γυμνασίου (7η)',               en: '7th Grade' },
    { key: 'gym-b',     gr: 'Β΄ Γυμνασίου (8η)',               en: '8th Grade' },
    { key: 'gym-c',     gr: 'Γ΄ Γυμνασίου (9η)',               en: '9th Grade' },
    { key: 'lyk-a',     gr: 'Α΄ Λυκείου (10η)',                en: '10th Grade' },
    { key: 'lyk-b',     gr: 'Β΄ Λυκείου (11η)',                en: '11th Grade' },
    { key: 'lyk-c',     gr: 'Γ΄ Λυκείου (12η)',                en: '12th Grade' },
    { key: 'gram-arch', gr: 'Αρχαία Ελληνικά (Γραμματική)',    en: 'Ancient Greek Grammar' },
  ];
  sel.innerHTML = classes.map(cl => `
    <option value="${cl.key}" ${_subClass === cl.key ? 'selected' : ''}>
      ${t(cl.gr, cl.en)}
    </option>
  `).join('');
  sel.value = _subClass;
  sel.onchange = e => { _subClass = e.target.value; _syncSubCheckoutBtn(); };
}

// ── STEP 3: Duration / Pricing Cards ──
function _renderSubPlanCards() {
  const grid = document.getElementById('sub-plans-grid');
  if (!grid) return;
  const plans = [
    { months: 1,  gr: '1 Μήνας',   en: '1 Month',   popular: false },
    { months: 3,  gr: '3 Μήνες',   en: '3 Months',  popular: false },
    { months: 6,  gr: '6 Μήνες',   en: '6 Months',  popular: true  },
    { months: 12, gr: '12 Μήνες',  en: '12 Months', popular: false },
  ];
  grid.innerHTML = plans.map(pl => {
    const price   = _formatEuro(_subPricing[_subType][pl.months]);
    const savings = _calcSavings(_subType, pl.months);
    const sel     = _subMonths === pl.months;
    const monthly = _calcMonthly(_subType, pl.months);
    return `
      <div class="sub-plan-card${sel ? ' selected' : ''}${pl.popular ? ' popular' : ''}"
           onclick="_setSubMonths(${pl.months})" role="radio" aria-checked="${sel}">
        ${pl.popular
          ? `<div class="sub-popular-tag">${t('Δημοφιλές', 'Popular')}</div>`
          : ''}
        ${savings
          ? `<div class="sub-discount-badge">${savings}</div>`
          : ''}
        <div class="sub-plan-duration">${t(pl.gr, pl.en)}</div>
        <div class="sub-plan-price">${price}</div>
        <div class="sub-plan-subprice">${monthly} / ${t('μήνα', 'mo')}</div>
        <div class="sub-plan-check${sel ? ' visible' : ''}">✓</div>
      </div>
    `;
  }).join('');
}

function _calcMonthly(type, months) {
  const per = (_subPricing[type][months] / months).toFixed(2);
  return `€${per}`;
}

// ── FEATURES LIST ──
function _renderSubFeatures() {
  const wrap = document.getElementById('sub-features-wrap');
  if (!wrap) return;
  const features = [
    { icon: '🎮',
      gr:   'Όλα τα παιχνίδια ξεκλειδωμένα',
      en:   'All games unlocked',
      dGr:  '30+ mini-games χωρίς κλειδώματα',
      dEn:  '30+ mini-games without locks' },
    { icon: '📊',
      gr:   'Όλα τα επίπεδα',
      en:   'All difficulty levels',
      dGr:  'Premium επίπεδα σε κάθε παιχνίδι',
      dEn:  'Premium levels unlocked in every game' },
    { icon: '🎓',
      gr:   'Teacher Mode',
      en:   'Teacher Mode',
      dGr:  'Δημιουργία κουίζ & QR codes (Teacher plan)',
      dEn:  'Quiz builder & QR sharing (Teacher plan)' },
    { icon: '🌐',
      gr:   'Δίγλωσση πλατφόρμα',
      en:   'Bilingual platform',
      dGr:  'Πλήρης υποστήριξη Ελληνικών & Αγγλικών',
      dEn:  'Full Greek & English support' },
    { icon: '⚡',
      gr:   'Χωρίς αυτόματη ανανέωση',
      en:   'No auto-renewal',
      dGr:  'Εφάπαξ πληρωμή — χωρίς συνδρομή',
      dEn:  'One-time payment — no subscription trap' },
  ];
  wrap.innerHTML = features.map(f => `
    <div class="sub-feature-item">
      <span class="sub-feat-icon">${f.icon}</span>
      <div>
        <div class="sub-feat-title">${t(f.gr, f.en)}</div>
        <div class="sub-feat-desc">${t(f.dGr, f.dEn)}</div>
      </div>
    </div>
  `).join('');
}

// ── SYNC CHECKOUT BUTTON LABEL ──
function _syncSubCheckoutBtn() {
  const btn = document.getElementById('sub-checkout-btn');
  if (!btn) return;
  btn.querySelector('.sub-btn-price').textContent = _formatEuro(_subPricing[_subType][_subMonths]);
}

// ── STATE SETTERS ──
function _setSubType(type) {
  _subType = type;
  _renderSubTypePills();
  _renderSubPlanCards();
  _syncSubCheckoutBtn();
}

function _setSubMonths(months) {
  _subMonths = months;
  _renderSubPlanCards();
  _syncSubCheckoutBtn();
}

// ── CHECKOUT — opens inline payment zone ──
function proceedToCheckout() {
  if (typeof openCheckoutZone === 'function') {
    openCheckoutZone();
  }
}

// ── HANDLE STRIPE PAYMENT CALLBACKS ──
// Stripe redirects back to app with ?payment=success|cancel after checkout
(function _handlePaymentCallback() {
  const params = new URLSearchParams(window.location.search);
  const result = params.get('payment');
  if (!result) return;

  // Clean the URL immediately so a page refresh doesn't re-trigger
  history.replaceState({}, '', window.location.pathname);

  if (result === 'success') {
    setTimeout(() => showToast(
      '✓ Η πληρωμή ολοκληρώθηκε! Η πρόσβασή σου ενεργοποιείται εντός λεπτού.',
      '✓ Payment complete! Your access activates within a minute.'
    ), 600);
  } else if (result === 'cancel') {
    setTimeout(() => showToast(
      'Η πληρωμή ακυρώθηκε. Μπορείς να ξαναδοκιμάσεις όποτε θέλεις.',
      'Payment cancelled. You can try again anytime.'
    ), 600);
  }
})();
