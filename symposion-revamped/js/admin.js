// ============================================================
//  SymposiON — Admin Dashboard
//  Accessible exclusively by dimikamou@gmail.com (isAdmin === true)
//  Features: Grant Access · Discount Codes · Pricing · Access Control · Banners
// ============================================================

// ── Default access config (used when Firestore has nothing) ──
const ADMIN_DEFAULT_ACCESS = {
  'gym-a':     'free',
  'gym-b':     'free',
  'gym-c':     'free',
  'lyk-a':     'free',
  'lyk-b':     'free',
  'lyk-c':     'free',
  'gram-nea':  'free',
  'gram-arch': 'free',
  'gram-lat':  'free',
};

const ADMIN_GRADE_LABELS = {
  'gym-a':     'Α΄ Γυμνασίου',
  'gym-b':     'Β΄ Γυμνασίου',
  'gym-c':     'Γ΄ Γυμνασίου',
  'lyk-a':     'Α΄ Λυκείου',
  'lyk-b':     'Β΄ Λυκείου',
  'lyk-c':     'Γ΄ Λυκείου',
  'gram-nea':  'Νέα Ελληνικά (Γραμματική)',
  'gram-arch': 'Αρχαία Ελληνικά (Γραμματική)',
  'gram-lat':  'Λατινικά (Γραμματική)',
};


// ============================================================
//  GRANT FREE ACCESS
// ============================================================
async function adminGrantAccess() {
  if (!isAdmin) return;

  const email    = (document.getElementById('admin-grant-email')?.value  || '').trim().toLowerCase();
  const role     = document.getElementById('admin-grant-role')?.value    || 'student';
  const months   = parseInt(document.getElementById('admin-grant-months')?.value || '1', 10);
  const classKey = document.getElementById('admin-grant-class')?.value   || 'all';
  const resultEl = document.getElementById('admin-grant-result');

  if (!email) {
    _adminResult(resultEl, t('Συμπλήρωσε email.', 'Enter an email.'), 'error');
    return;
  }

  const btn = document.querySelector('#admin-grant-form .admin-action-btn');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    const grantFn = firebase.functions().httpsCallable('adminGrantAccess');
    const result  = await grantFn({ targetEmail: email, role, months, classKey });
    const name    = result.data.displayName || email;
    _adminResult(resultEl,
      t(`✓ Πρόσβαση χορηγήθηκε σε ${name} (${role}, ${months} μήνες).`,
        `✓ Access granted to ${name} (${role}, ${months} months).`),
      'success'
    );
    document.getElementById('admin-grant-email').value = '';
    _adminLoadStats();
  } catch (err) {
    console.error('[admin] grant access error:', err);
    const msg = err.message?.includes('not found')
      ? t(`Δεν βρέθηκε χρήστης με email: ${email}`, `No user found with email: ${email}`)
      : t('Σφάλμα. Δοκίμασε ξανά.', 'Error. Please try again.');
    _adminResult(resultEl, msg, 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

// ============================================================
//  HERO'S JOURNEY — Grant XP / Drachmas to a user
// ============================================================
async function adminGrantProgression() {
  if (!isAdmin) return;

  const email    = (document.getElementById('admin-prog-email')?.value || '').trim().toLowerCase();
  const xpAmt    = Math.max(0, parseInt(document.getElementById('admin-prog-xp')?.value || '0', 10) || 0);
  const drAmt    = Math.max(0, parseInt(document.getElementById('admin-prog-dr')?.value || '0', 10) || 0);
  const resultEl = document.getElementById('admin-prog-result');

  if (!email) { _adminResult(resultEl, t('Συμπλήρωσε email.', 'Enter an email.'), 'error'); return; }
  if (xpAmt === 0 && drAmt === 0) { _adminResult(resultEl, t('Εισάγαγε XP ή Δραχμές.', 'Enter XP or Drachmas.'), 'error'); return; }

  const btn = document.querySelector('#admin-prog-form .admin-action-btn');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    // Look up user by email (admin can read all user docs)
    const usersSnap = await firebase.firestore().collection('users')
      .where('email', '==', email).limit(1).get();

    if (usersSnap.empty) {
      _adminResult(resultEl,
        t(`Δεν βρέθηκε χρήστης: ${email}`, `No user found: ${email}`), 'error');
      return;
    }

    const userDoc  = usersSnap.docs[0];
    const uid      = userDoc.id;
    const userName = userDoc.data().displayName || email;

    const progRef  = firebase.firestore().doc(`users/${uid}/progression/data`);
    const progDoc  = await progRef.get();

    if (!progDoc.exists) {
      // Bootstrap a fresh progression doc
      const newXp    = xpAmt;
      const newDr    = drAmt;
      const newLevel = Math.floor(Math.sqrt(newXp / 100));
      await progRef.set({
        xp: newXp, drachmas: newDr, level: newLevel,
        unlockedTitles: ['νεοφώτιστος'], activeTitle: 'νεοφώτιστος',
        unlockedAvatars: ['owl'],       activeAvatar: 'owl',
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      const cur      = progDoc.data();
      const newXp    = (cur.xp || 0) + xpAmt;
      const newDr    = (cur.drachmas || 0) + drAmt;
      const newLevel = Math.floor(Math.sqrt(newXp / 100));
      await progRef.update({
        xp: newXp, drachmas: newDr, level: newLevel,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    }

    const parts = [];
    if (xpAmt > 0) parts.push(`${xpAmt} XP`);
    if (drAmt > 0) parts.push(`${drAmt} ⌾`);
    _adminResult(resultEl,
      t(`✓ ${parts.join(' + ')} χορηγήθηκαν σε ${userName}.`,
        `✓ ${parts.join(' + ')} granted to ${userName}.`),
      'success');

    document.getElementById('admin-prog-email').value = '';
    document.getElementById('admin-prog-xp').value    = '';
    document.getElementById('admin-prog-dr').value    = '';
  } catch (err) {
    console.error('[admin] grant progression error:', err);
    _adminResult(resultEl, t('Σφάλμα. Δοκίμασε ξανά.', 'Error. Please try again.'), 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

// ============================================================
//  DISCOUNT CODE GENERATOR
// ============================================================
function adminGenerateCode() {
  const prefixes  = ['SYMPOSION', 'BLACKFRIDAY', 'SUMMER', 'BACK2SCHOOL', 'EASTER', 'PROMO'];
  const prefix    = prefixes[Math.floor(Math.random() * prefixes.length)];
  const num       = Math.floor(Math.random() * 90 + 10);
  const code      = `${prefix}${num}`;
  const inp       = document.getElementById('admin-code-name');
  if (inp) { inp.value = code; }
}

async function adminCreateCode() {
  if (!isAdmin) return;

  const code     = (document.getElementById('admin-code-name')?.value     || '').trim().toUpperCase();
  const discount = parseInt(document.getElementById('admin-code-discount')?.value || '20', 10);
  const expiry   = document.getElementById('admin-code-expiry')?.value    || '';
  const maxUses  = parseInt(document.getElementById('admin-code-max-uses')?.value || '0', 10);
  const resultEl = document.getElementById('admin-code-result');

  if (!code) {
    _adminResult(resultEl, t('Συμπλήρωσε τον κωδικό.', 'Enter a code.'), 'error');
    return;
  }
  if (discount < 1 || discount > 100) {
    _adminResult(resultEl, t('Η έκπτωση πρέπει να είναι 1–100%.', 'Discount must be 1–100%.'), 'error');
    return;
  }
  if (!expiry) {
    _adminResult(resultEl, t('Επίλεξε ημερομηνία λήξης.', 'Set an expiry date.'), 'error');
    return;
  }

  const btn = document.querySelector('#admin-code-form .admin-action-btn');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    const couponRef = firebase.firestore().collection('coupons').doc(code);
    const existing  = await couponRef.get();
    if (existing.exists) {
      _adminResult(resultEl,
        t(`Ο κωδικός "${code}" υπάρχει ήδη.`, `Code "${code}" already exists.`),
        'error'
      );
      return;
    }

    await couponRef.set({
      code,
      discount,
      type:      'percentage',
      expiresAt: firebase.firestore.Timestamp.fromDate(new Date(expiry + 'T23:59:59')),
      maxUses:   maxUses || 0,
      usedCount: 0,
      active:    true,
      createdBy: currentUser?.email || 'admin',
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });

    _adminResult(resultEl,
      t(`✓ Κωδικός "${code}" (−${discount}%) δημιουργήθηκε.`,
        `✓ Code "${code}" (−${discount}%) created.`),
      'success'
    );
    document.getElementById('admin-code-name').value = '';
    _adminLoadCoupons();
    _adminLoadStats();
  } catch (err) {
    console.error('[admin] create code error:', err);
    _adminResult(resultEl, t('Σφάλμα κατά τη δημιουργία.', 'Creation error.'), 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

async function adminDeactivateCode(code) {
  if (!isAdmin || !confirm(`Απενεργοποίηση κωδικού "${code}";`)) return;
  try {
    await firebase.firestore().collection('coupons').doc(code).update({ active: false });
    showToast(t(`Κωδικός "${code}" απενεργοποιήθηκε.`, `Code "${code}" deactivated.`), '');
    _adminLoadCoupons();
    _adminLoadStats();
  } catch (err) {
    console.error('[admin] deactivate error:', err);
    showToast(t('Σφάλμα.', 'Error.'), 'Error.');
  }
}

// ── Load & render existing coupons with usage analytics ──
async function _adminLoadCoupons() {
  const wrap = document.getElementById('admin-codes-items');
  if (!wrap) return;

  wrap.innerHTML = `<div class="admin-codes-loading">${t('Φόρτωση...', 'Loading...')}</div>`;

  try {
    const snap = await firebase.firestore()
      .collection('coupons')
      .orderBy('createdAt', 'desc')
      .limit(20)
      .get();

    if (snap.empty) {
      wrap.innerHTML = `<div class="admin-codes-empty">${t('Δεν υπάρχουν κωδικοί ακόμα.', 'No codes yet.')}</div>`;
      return;
    }

    wrap.innerHTML = snap.docs.map(doc => {
      const d        = doc.data();
      const expDate  = d.expiresAt?.toDate?.()?.toLocaleDateString('el-GR') || '—';
      const used     = d.usedCount || 0;
      const max      = d.maxUses  || 0;
      const usesText = max ? `${used} / ${max}` : `${used} / ∞`;
      const pct      = max ? Math.min(100, Math.round((used / max) * 100)) : 0;
      const active   = d.active !== false;
      const isExpired = d.expiresAt?.toDate?.() < new Date();
      return `
        <div class="admin-code-row${active ? '' : ' inactive'}">
          <div class="admin-code-name">${d.code}</div>
          <div class="admin-code-meta">
            <span class="admin-code-discount">−${d.discount}%</span>
            <span class="admin-code-uses" title="${t('Χρήσεις','Uses')}">${usesText} ${t('χρήσεις','uses')}</span>
            <span class="admin-code-expiry ${isExpired ? 'expired' : ''}">${t('Λήξη','Exp')}: ${expDate}</span>
            <span class="admin-code-status ${active ? 'active' : 'inactive'}">
              ${active ? (isExpired ? t('Έληξε','Expired') : t('Ενεργός','Active')) : t('Ανενεργός','Inactive')}
            </span>
          </div>
          ${max > 0 ? `<div class="admin-usage-bar"><div class="admin-usage-fill" style="width:${pct}%"></div></div>` : ''}
          ${active && !isExpired
            ? `<button class="admin-deact-btn" onclick="adminDeactivateCode('${d.code}')"
                       title="${t('Απενεργοποίηση', 'Deactivate')}">✕</button>`
            : ''}
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('[admin] load coupons error:', err);
    wrap.innerHTML = `<div class="admin-codes-empty">${t('Σφάλμα φόρτωσης.', 'Load error.')}</div>`;
  }
}

// ============================================================
//  SUBSCRIPTION PRICING
// ============================================================

// Built-in plan keys that always appear in the table
const _BUILTIN_PLANS = ['student', 'teacher'];

// Labels for built-in plans (used when rendering)
const _PLAN_LABELS = {
  student: { gr: 'Μαθητής', en: 'Student' },
  teacher: { gr: 'Καθηγητής', en: 'Teacher' },
};

async function _adminLoadPricing() {
  try {
    const doc = await firebase.firestore().collection('config').doc('pricing').get();
    if (!doc.exists) return;
    const data = doc.data();

    // Update built-in rows
    const months = [1, 3, 6, 12];
    _BUILTIN_PLANS.forEach(tp => {
      months.forEach(m => {
        const el = document.getElementById(`price-${tp}-${m}`);
        if (el && data[tp]?.[m] !== undefined) el.value = data[tp][m];
      });
    });

    // Render any custom plan rows that were saved
    const tbody = document.getElementById('pricing-tbody');
    if (!tbody) return;
    // Remove any previously injected custom rows
    tbody.querySelectorAll('.custom-plan-row').forEach(r => r.remove());

    const customPlans = (data._customPlans || []);
    const labels      = data._labels || {};
    customPlans.forEach(key => {
      if (_BUILTIN_PLANS.includes(key)) return;
      _appendPlanRow(key, labels[key] || key, data[key] || {});
    });

    // Inject custom plans into the Grant Access & Mass Grant role selects
    _populateRoleSelects(customPlans.filter(k => !_BUILTIN_PLANS.includes(k)), labels);
  } catch (err) {
    console.error('[admin] load pricing error:', err);
  }
}

// Inject custom plan options into all role <select> elements
// (called after pricing loads so custom plans appear alongside Student / Teacher)
function _populateRoleSelects(customPlans, labels) {
  ['admin-grant-role', 'mass-role'].forEach(selectId => {
    const sel = document.getElementById(selectId);
    if (!sel) return;
    // Remove stale custom options from a previous load
    sel.querySelectorAll('option[data-custom="1"]').forEach(o => o.remove());
    // Append fresh custom options
    customPlans.forEach(key => {
      const opt          = document.createElement('option');
      opt.value          = key;
      opt.textContent    = labels[key] || (key.charAt(0).toUpperCase() + key.slice(1));
      opt.dataset.custom = '1';
      sel.appendChild(opt);
    });
  });
}

async function adminSavePricing() {
  if (!isAdmin) return;
  const resultEl = document.getElementById('admin-pricing-result');
  const btn = document.querySelector('#admin-pricing-form .admin-action-btn');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    const months = [1, 3, 6, 12];
    const pricing = {};
    const customPlans = [];
    const labels = {};

    // Collect all plan rows (built-in + custom)
    document.querySelectorAll('#pricing-tbody tr[data-plan]').forEach(row => {
      const tp = row.dataset.plan;
      pricing[tp] = {};
      months.forEach(m => {
        const val = parseFloat(row.querySelector(`[data-month="${m}"]`)?.value || '0');
        pricing[tp][m] = isNaN(val) ? 0 : Math.max(0, val);
      });
      if (!_BUILTIN_PLANS.includes(tp)) {
        customPlans.push(tp);
        labels[tp] = row.querySelector('.plan-label-cell')?.textContent?.trim() || tp;
      }
    });

    await firebase.firestore().collection('config').doc('pricing').set({
      ...pricing,
      _customPlans: customPlans,
      _labels: labels,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: currentUser?.email || 'admin',
    });

    _adminResult(resultEl, t('✓ Τιμές αποθηκεύτηκαν.', '✓ Prices saved.'), 'success');
  } catch (err) {
    console.error('[admin] save pricing error:', err);
    _adminResult(resultEl, t('Σφάλμα αποθήκευσης.', 'Save error.'), 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

// Append a new plan row to the pricing table
function _appendPlanRow(key, label, prices = {}) {
  const tbody = document.getElementById('pricing-tbody');
  if (!tbody) return;
  const months = [1, 3, 6, 12];
  const isCustom = !_BUILTIN_PLANS.includes(key);
  const row = document.createElement('tr');
  if (isCustom) row.className = 'custom-plan-row';
  row.dataset.plan = key;
  row.innerHTML = `
    <td class="admin-pricing-label plan-label-cell" contenteditable="${isCustom}"
        style="${isCustom ? 'cursor:text;border-bottom:1px dashed var(--stone);outline:none;' : ''}"
        data-gr="${label}" data-en="${label}">${label}</td>
    ${months.map(m => `
      <td><input type="number" class="admin-input admin-price-input"
                 data-month="${m}" min="0" step="0.01"
                 value="${prices[m] ?? (m === 1 ? 1.99 : m === 3 ? 4.99 : m === 6 ? 8.99 : 14.99)}"/></td>
    `).join('')}
    ${isCustom ? `<td><button class="admin-deact-btn" onclick="this.closest('tr').remove()"
                      title="${t('Διαγραφή πλάνου', 'Remove plan')}">✕</button></td>` : '<td></td>'}
  `;
  tbody.appendChild(row);
}

// Called by "Add Plan" button
function adminAddPlanRow() {
  const key   = 'plan_' + Date.now();
  const label = t('Νέο Πλάνο', 'New Plan');
  _appendPlanRow(key, label, {});
  // Focus the label cell so admin can rename immediately
  const newRow = document.querySelector(`#pricing-tbody tr[data-plan="${key}"] .plan-label-cell`);
  if (newRow) { newRow.focus(); document.execCommand('selectAll', false, null); }
}

// ============================================================
//  LEVEL ACCESS CONTROL
// ============================================================
async function _adminLoadAccess() {
  const grid = document.getElementById('admin-access-grid');
  if (!grid) return;

  const accessLevels = [
    { val: 'free',    labelGr: '🔓 Δωρεάν',    labelEn: '🔓 Free' },
    { val: 'student', labelGr: '📚 Student Pro', labelEn: '📚 Student Pro' },
    { val: 'teacher', labelGr: '🎓 Teacher Pro', labelEn: '🎓 Teacher Pro' },
  ];

  const _renderAccess = (current) => {
    grid.innerHTML = Object.entries(ADMIN_GRADE_LABELS).map(([key, label]) => {
      const cur = current[key] || 'student';
      return `<div class="admin-access-row">
        <span class="admin-access-grade">${label}</span>
        <select class="admin-select admin-access-select" data-grade="${key}">
          ${accessLevels.map(al => `<option value="${al.val}" ${cur === al.val ? 'selected' : ''}>${t(al.labelGr, al.labelEn)}</option>`).join('')}
        </select>
      </div>`;
    }).join('');
  };

  // Render immediately with defaults — no waiting for Firestore
  _renderAccess({ ...ADMIN_DEFAULT_ACCESS });

  // Silently patch with saved values once Firestore responds
  try {
    const doc = await firebase.firestore().collection('config').doc('access').get();
    if (doc.exists && doc.data().grades) _renderAccess({ ...ADMIN_DEFAULT_ACCESS, ...doc.data().grades });
  } catch (err) {
    console.error('[admin] load access error:', err);
  }
}

async function adminSaveAccess() {
  if (!isAdmin) return;
  const resultEl = document.getElementById('admin-access-result');
  const btn = document.querySelector('#admin-access-form .admin-action-btn');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    const grades = {};
    document.querySelectorAll('.admin-access-select').forEach(sel => {
      grades[sel.dataset.grade] = sel.value;
    });

    await firebase.firestore().collection('config').doc('access').set({
      grades,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: currentUser?.email || 'admin',
    });

    // Propagate to the live site config so changes take effect immediately
    if (typeof _siteAccess !== 'undefined') {
      Object.assign(_siteAccess, grades);
    }
    // Re-render browse page and home dropdowns so lock badges update without a page reload
    if (typeof renderBrowse      === 'function') renderBrowse();
    if (typeof _refreshHomeLocks === 'function') _refreshHomeLocks();

    _adminResult(resultEl, t('✓ Κανόνες πρόσβασης αποθηκεύτηκαν. Οι αλλαγές ισχύουν άμεσα.', '✓ Access rules saved. Changes take effect immediately.'), 'success');
  } catch (err) {
    console.error('[admin] save access error:', err);
    _adminResult(resultEl, t('Σφάλμα αποθήκευσης.', 'Save error.'), 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}


// ============================================================
//  BANNERS / ANNOUNCEMENTS
// ============================================================
async function adminCreateBanner() {
  if (!isAdmin) return;

  const titleGr   = (document.getElementById('admin-banner-title-gr')?.value   || '').trim();
  const titleEn   = (document.getElementById('admin-banner-title-en')?.value   || '').trim();
  const bodyGr    = (document.getElementById('admin-banner-body-gr')?.value    || '').trim();
  const bodyEn    = (document.getElementById('admin-banner-body-en')?.value    || '').trim();
  const type      = document.getElementById('admin-banner-type')?.value        || 'info';
  const expiry    = document.getElementById('admin-banner-expiry')?.value      || '';
  const ctaGr     = (document.getElementById('admin-banner-cta-gr')?.value     || '').trim();
  const ctaEn     = (document.getElementById('admin-banner-cta-en')?.value     || '').trim();
  const ctaAction = (document.getElementById('admin-banner-cta-action')?.value || '').trim();
  const resultEl  = document.getElementById('admin-banner-result');

  if (!titleGr) {
    _adminResult(resultEl, t('Συμπλήρωσε τουλάχιστον τον τίτλο (GR).', 'Enter at least a title (GR).'), 'error');
    return;
  }

  const btn = document.querySelector('#admin-banner-form .admin-action-btn');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    const bannerData = {
      titleGr,
      titleEn:   titleEn   || titleGr,
      bodyGr:    bodyGr    || '',
      bodyEn:    bodyEn    || bodyGr || '',
      type,
      active:    true,
      ctaGr:     ctaGr     || '',
      ctaEn:     ctaEn     || ctaGr || '',
      ctaAction: ctaAction || '',
      endsAt:    expiry
        ? firebase.firestore.Timestamp.fromDate(new Date(expiry + 'T23:59:59'))
        : null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      createdBy: currentUser?.email || 'admin',
    };

    await firebase.firestore().collection('banners').add(bannerData);

    _adminResult(resultEl, t('✓ Banner δημοσιεύτηκε.', '✓ Banner published.'), 'success');
    ['admin-banner-title-gr','admin-banner-title-en','admin-banner-body-gr','admin-banner-body-en',
     'admin-banner-cta-gr','admin-banner-cta-en','admin-banner-cta-action','admin-banner-expiry'
    ].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });

    _adminLoadBanners();
    _adminLoadStats();
    // Refresh banners on the live site immediately
    if (typeof _loadSiteBanners === 'function') _loadSiteBanners();
  } catch (err) {
    console.error('[admin] create banner error:', err);
    _adminResult(resultEl, t('Σφάλμα δημιουργίας.', 'Creation error.'), 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

async function adminDeactivateBanner(id) {
  if (!isAdmin || !confirm(t('Απενεργοποίηση banner;', 'Deactivate banner?'))) return;
  try {
    await firebase.firestore().collection('banners').doc(id).update({ active: false });
    showToast(t('Banner απενεργοποιήθηκε.', 'Banner deactivated.'), '');
    _adminLoadBanners();
    _adminLoadStats();
    if (typeof _loadSiteBanners === 'function') _loadSiteBanners();
  } catch (err) {
    console.error('[admin] deactivate banner error:', err);
    showToast(t('Σφάλμα.', 'Error.'), 'Error.');
  }
}

async function _adminLoadBanners() {
  const wrap = document.getElementById('admin-banners-items');
  if (!wrap) return;

  wrap.innerHTML = `<div class="admin-codes-loading">${t('Φόρτωση...', 'Loading...')}</div>`;

  try {
    const snap = await firebase.firestore()
      .collection('banners')
      .orderBy('createdAt', 'desc')
      .limit(15)
      .get();

    if (snap.empty) {
      wrap.innerHTML = `<div class="admin-codes-empty">${t('Δεν υπάρχουν banners ακόμα.', 'No banners yet.')}</div>`;
      return;
    }

    const typeIcon = { info: 'ℹ️', promo: '🏷️', warning: '⚠️' };

    wrap.innerHTML = snap.docs.map(doc => {
      const d       = doc.data();
      const active  = d.active !== false;
      const endsAt  = d.endsAt?.toDate?.()?.toLocaleDateString('el-GR') || '∞';
      const expired = d.endsAt?.toDate?.() < new Date();
      return `
        <div class="admin-code-row${active ? '' : ' inactive'}">
          <div class="admin-code-name" style="font-size:13px;">${typeIcon[d.type] || 'ℹ️'} ${d.titleGr}</div>
          <div class="admin-code-meta">
            <span class="admin-code-expiry ${expired ? 'expired' : ''}">${t('Λήξη','Exp')}: ${endsAt}</span>
            <span class="admin-code-status ${active ? 'active' : 'inactive'}">
              ${active ? (expired ? t('Έληξε','Expired') : t('Ενεργό','Active')) : t('Ανενεργό','Inactive')}
            </span>
            ${d.ctaGr ? `<span style="font-size:11px;color:var(--stone);">CTA: ${d.ctaGr}</span>` : ''}
          </div>
          ${active && !expired
            ? `<button class="admin-deact-btn" onclick="adminDeactivateBanner('${doc.id}')"
                       title="${t('Απενεργοποίηση', 'Deactivate')}">✕</button>`
            : ''}
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('[admin] load banners error:', err);
    wrap.innerHTML = `<div class="admin-codes-empty">${t('Σφάλμα φόρτωσης.', 'Load error.')}</div>`;
  }
}

// ============================================================
//  STATS
// ============================================================
async function _adminLoadStats() {
  ['stat-total-users','stat-pro-users','stat-coupons','stat-code-uses','stat-banners']
    .forEach(id => _setStatVal(id, '…'));

  try {
    const [usersSnap, proSnap, couponsSnap, allCouponsSnap, bannersSnap] = await Promise.all([
      firebase.firestore().collection('users').get(),
      firebase.firestore().collection('users').where('plan', '==', 'pro').get(),
      firebase.firestore().collection('coupons').where('active', '==', true).get(),
      firebase.firestore().collection('coupons').get(),
      firebase.firestore().collection('banners').where('active', '==', true).get(),
    ]);

    const totalUses = allCouponsSnap.docs.reduce((sum, d) => sum + (d.data().usedCount || 0), 0);

    _setStatVal('stat-total-users', usersSnap.size);
    _setStatVal('stat-pro-users',   proSnap.size);
    _setStatVal('stat-coupons',     couponsSnap.size);
    _setStatVal('stat-code-uses',   totalUses);
    _setStatVal('stat-banners',     bannersSnap.size);
  } catch (err) {
    console.error('[admin] stats error:', err);
    ['stat-total-users','stat-pro-users','stat-coupons','stat-code-uses','stat-banners']
      .forEach(id => _setStatVal(id, '—'));
  }
}

function _setStatVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ============================================================
//  MASS GRANT ACCESS
// ============================================================

let _massGrantList = [];  // [{ email, status }]

function adminMassSetMethod(method, btn) {
  document.querySelectorAll('.admin-mass-method-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.getElementById('mass-input-text').style.display = method === 'text' ? '' : 'none';
  document.getElementById('mass-input-file').style.display = method === 'file' ? '' : 'none';
  document.getElementById('admin-mass-preview').style.display = 'none';
  _massGrantList = [];
}

function adminMassHandleFile(file) {
  if (!file) return;
  const dropText = document.getElementById('mass-drop-text');
  if (dropText) dropText.textContent = file.name;

  const reader = new FileReader();

  if (file.name.toLowerCase().endsWith('.csv')) {
    reader.onload = e => _massParseCSV(e.target.result);
    reader.readAsText(file, 'UTF-8');
  } else {
    // Excel — requires SheetJS
    reader.onload = e => {
      try {
        const wb   = XLSX.read(new Uint8Array(e.target.result), { type: 'array' });
        const ws   = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const emails = rows
          .map(r => String(r[0] || '').trim().toLowerCase())
          .filter(v => v.includes('@'));
        _massSetList(emails);
      } catch (err) {
        console.error('[admin] xlsx parse error:', err);
        showToast(t('Σφάλμα ανάγνωσης αρχείου.', 'File read error.'), '');
      }
    };
    reader.readAsArrayBuffer(file);
  }
}

function _massParseCSV(text) {
  const emails = text.split(/[\r\n]+/)
    .map(line => line.split(',')[0].replace(/"/g, '').trim().toLowerCase())
    .filter(v => v.includes('@'));
  _massSetList(emails);
}

function _massSetList(emails) {
  const unique = [...new Set(emails.filter(e => e.includes('@') && e.includes('.')))];
  _massGrantList = unique.map(email => ({ email, status: 'pending' }));
  _massRenderPreviewTable();
}

function adminMassParsePreview() {
  // Only parse textarea when in text mode
  if (document.getElementById('mass-input-text')?.style.display !== 'none') {
    const raw = document.getElementById('mass-emails-textarea')?.value || '';
    const emails = raw.split(/[\r\n,;]+/)
      .map(e => e.trim().toLowerCase())
      .filter(e => e.includes('@') && e.includes('.'));
    _massSetList(emails);
  } else {
    // File mode — list already populated by file handler
    _massRenderPreviewTable();
  }
}

function _massRenderPreviewTable() {
  const preview = document.getElementById('admin-mass-preview');
  const header  = document.getElementById('admin-mass-preview-header');
  const tbody   = document.getElementById('admin-mass-tbody');
  const execBtn = document.getElementById('admin-mass-execute-btn');
  const execLbl = document.getElementById('admin-mass-execute-label');
  const prog    = document.getElementById('admin-mass-progress');

  if (_massGrantList.length === 0) {
    if (header) header.textContent = t('Δεν βρέθηκαν έγκυρα emails.', 'No valid emails found.');
    if (tbody)  tbody.innerHTML = '';
    if (preview) preview.style.display = '';
    return;
  }

  if (header) header.textContent = t(
    `${_massGrantList.length} λογαριασμοί έτοιμοι για χορήγηση`,
    `${_massGrantList.length} accounts ready for access grant`
  );

  if (tbody) {
    tbody.innerHTML = _massGrantList.map((item, i) => `
      <tr id="mass-row-${i}">
        <td>${i + 1}</td>
        <td style="font-size:12.5px;">${item.email}</td>
        <td><span class="mass-status mass-status-pending">—</span></td>
      </tr>`).join('');
  }

  if (execBtn)  execBtn.disabled = false;
  if (execLbl)  execLbl.textContent = t(`⚡ Χορήγηση σε Όλους (${_massGrantList.length})`, `⚡ Grant to All (${_massGrantList.length})`);
  if (prog)     prog.textContent = '';
  if (preview)  preview.style.display = '';
  _adminResult(document.getElementById('admin-mass-result'), '', '');
}

async function adminExecuteMassGrant() {
  if (!isAdmin || _massGrantList.length === 0) return;

  const role     = document.getElementById('mass-role')?.value    || 'student';
  const months   = parseInt(document.getElementById('mass-months')?.value || '3', 10);
  const classKey = document.getElementById('mass-class')?.value   || 'all';
  const execBtn  = document.getElementById('admin-mass-execute-btn');
  const execLbl  = document.getElementById('admin-mass-execute-label');
  const prog     = document.getElementById('admin-mass-progress');
  const resultEl = document.getElementById('admin-mass-result');

  execBtn.disabled = true;
  _adminResult(resultEl, '', '');

  const grantFn = firebase.functions().httpsCallable('adminGrantAccess');
  let succeeded = 0, failed = 0;

  for (let i = 0; i < _massGrantList.length; i++) {
    const { email } = _massGrantList[i];
    const row       = document.getElementById(`mass-row-${i}`);
    const badge     = row?.querySelector('.mass-status');

    if (badge) { badge.className = 'mass-status mass-status-loading'; badge.textContent = '⏳'; }
    if (prog)  prog.textContent = `${i + 1} / ${_massGrantList.length}`;

    try {
      await grantFn({ targetEmail: email, role, months, classKey });
      succeeded++;
      if (badge) { badge.className = 'mass-status mass-status-ok'; badge.textContent = '✓'; }
    } catch (err) {
      failed++;
      const msg = err.message?.includes('not found') ? '✗ not found' : '✗ error';
      if (badge) { badge.className = 'mass-status mass-status-err'; badge.textContent = msg; }
    }
  }

  if (prog)    prog.textContent = '';
  if (execLbl) execLbl.textContent = t('✓ Ολοκληρώθηκε', '✓ Completed');

  _adminResult(resultEl,
    t(`✓ ${succeeded} επιτυχία${failed > 0 ? ` · ${failed} σφάλματα` : ''}.`,
      `✓ ${succeeded} succeeded${failed > 0 ? ` · ${failed} failed` : ''}.`),
    failed === 0 ? 'success' : 'error'
  );
  _adminLoadStats();
}

// ── UI helpers ──
function _adminResult(el, msg, type) {
  if (!el) return;
  el.textContent = msg;
  el.className   = `cc-result admin-result${type ? ' ' + type : ''}`;
}

// ── Populate the grade unlock checkboxes (runs once per panel open) ──
function _adminBuildGradeCheckboxes() {
  const grid = document.getElementById('subs-grades-unlock-grid');
  if (!grid || grid.childElementCount > 0) return;
  Object.entries(ADMIN_GRADE_LABELS).forEach(([key, label]) => {
    const item = document.createElement('label');
    item.className = 'subs-grade-check';
    item.innerHTML = `<input type="checkbox" data-grade-key="${key}"/>${label}`;
    grid.appendChild(item);
  });
}

// ============================================================
//  CLASSROOM LINKER  (classrooms/{classId})
// ============================================================

let _subsCurrentClassId = null;

async function adminSearchClassroom() {
  const email     = (document.getElementById('subs-classroom-search-id')?.value || '').trim().toLowerCase();
  const resultEl  = document.getElementById('subs-classroom-search-result');
  const bindPanel = document.getElementById('subs-classroom-bind');
  const btn       = document.querySelector('.subs-search-btn');

  if (!email) {
    resultEl.textContent = t('Συμπλήρωσε το email του καθηγητή.', 'Enter the teacher\'s email.');
    resultEl.className   = 'subs-search-result not-found';
    return;
  }

  btn.disabled            = true;
  resultEl.textContent    = t('Αναζήτηση...', 'Searching...');
  resultEl.className      = 'subs-search-result';
  bindPanel.style.display = 'none';
  _subsCurrentClassId     = null;

  try {
    // Step 1 — find the user by email
    const userSnap = await firebase.firestore()
      .collection('users').where('email', '==', email).limit(1).get();

    if (userSnap.empty) {
      resultEl.textContent = t(
        `Δεν βρέθηκε χρήστης με email: ${email}`,
        `No user found with email: ${email}`
      );
      resultEl.className = 'subs-search-result not-found';
      return;
    }

    const userDoc  = userSnap.docs[0];
    const uid      = userDoc.id;
    const userName = userDoc.data().displayName || email;

    // Step 2 — find classroom record for this teacher UID
    const classSnap = await firebase.firestore()
      .collection('classrooms').where('teacherUid', '==', uid).limit(1).get();

    _adminBuildGradeCheckboxes();

    // Use uid as the classroom doc ID when creating a new one
    const classId = classSnap.empty ? uid : classSnap.docs[0].id;
    const classData = classSnap.empty ? null : classSnap.docs[0].data();

    _subsCurrentClassId = classId;

    if (classSnap.empty) {
      resultEl.textContent = t(
        `✓ Βρέθηκε ο χρήστης "${userName}". Δεν υπάρχει τάξη — θα δημιουργηθεί νέα.`,
        `✓ Found "${userName}". No classroom yet — a new one will be created.`
      );
    } else {
      resultEl.textContent = t(
        `✓ Βρέθηκε τάξη για "${userName}".`,
        `✓ Found classroom for "${userName}".`
      );
    }
    resultEl.className = 'subs-search-result found';

    document.getElementById('subs-bind-target-label').textContent =
      `${userName} · ${email}`;

    // Pre-populate the bind panel with existing data (or blank if new)
    const payload = classData ? { ...classData, teacherUid: uid } : { teacherUid: uid };
    _adminPrefillBindPanel(payload);
    bindPanel.style.display = '';

  } catch (err) {
    console.error('[admin] classroom search error:', err);
    resultEl.textContent = t('Σφάλμα αναζήτησης. Δοκίμασε ξανά.', 'Search error. Please try again.');
    resultEl.className   = 'subs-search-result not-found';
  } finally {
    btn.disabled = false;
  }
}

function _adminPrefillBindPanel(data) {
  const subTypeEl  = document.getElementById('subs-bind-sub-type');
  const expiryEl   = document.getElementById('subs-bind-expiry');
  const checkboxes = document.querySelectorAll('#subs-grades-unlock-grid input[type="checkbox"]');

  if (!data) {
    if (subTypeEl)  subTypeEl.value  = 'free';
    if (expiryEl)   expiryEl.value   = '';
    checkboxes.forEach(cb => { cb.checked = false; });
    return;
  }

  if (subTypeEl && data.subscriptionType) subTypeEl.value = data.subscriptionType;
  if (expiryEl  && data.expiresAt) {
    const d = data.expiresAt.toDate?.();
    if (d) expiryEl.value = d.toISOString().slice(0, 10);
  }
  const unlocked = Array.isArray(data.unlockedGrades) ? data.unlockedGrades : [];
  checkboxes.forEach(cb => { cb.checked = unlocked.includes(cb.dataset.gradeKey); });

  // Feature flags
  const features = Array.isArray(data.features) ? data.features : [];
  document.querySelectorAll('#subs-features-grid input[type="checkbox"]')
    .forEach(cb => { cb.checked = features.includes(cb.dataset.feature); });
}

async function adminBindClassroom() {
  if (!isAdmin || !_subsCurrentClassId) return;
  const resultEl = document.getElementById('subs-bind-result');
  const btn      = document.getElementById('subs-bind-save-btn');
  const subType  = document.getElementById('subs-bind-sub-type')?.value  || 'free';
  const expiryVal= document.getElementById('subs-bind-expiry')?.value    || '';

  const unlockedGrades = [];
  document.querySelectorAll('#subs-grades-unlock-grid input[type="checkbox"]:checked')
    .forEach(cb => unlockedGrades.push(cb.dataset.gradeKey));

  const features = [];
  document.querySelectorAll('#subs-features-grid input[type="checkbox"]:checked')
    .forEach(cb => features.push(cb.dataset.feature));

  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    const teacherEmail = (document.getElementById('subs-classroom-search-id')?.value || '').trim().toLowerCase();
    const payload = {
      subscriptionType: subType,
      unlockedGrades,
      features,
      teacherEmail,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: currentUser?.email || 'admin',
    };
    if (expiryVal) {
      payload.expiresAt = firebase.firestore.Timestamp.fromDate(
        new Date(expiryVal + 'T23:59:59')
      );
    }

    await firebase.firestore()
      .collection('classrooms').doc(_subsCurrentClassId)
      .set(payload, { merge: true });

    _adminShowSubsToast(
      t('Οι κανόνες πρόσβασης ενημερώθηκαν επιτυχώς.',
        'Access rules updated successfully.')
    );
    _adminResult(resultEl, '', '');
  } catch (err) {
    console.error('[admin] bind classroom error:', err);
    _adminResult(resultEl, t('Σφάλμα αποθήκευσης.', 'Save error.'), 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

// ── Moss-green inline toast ──
function _adminShowSubsToast(msg) {
  const existing = document.querySelector('.subs-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'subs-toast';
  toast.innerHTML = `
    <svg class="subs-toast-icon" viewBox="0 0 18 18" fill="none"
         stroke="#74C98A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="9" cy="9" r="8"/>
      <polyline points="5.5,9.5 8,12 12.5,6.5"/>
    </svg>
    <span>${msg}</span>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s';
    toast.style.opacity    = '0';
    setTimeout(() => toast.remove(), 420);
  }, 3500);
}

function _adminSetLoading(btn, on) {
  if (!btn) return;
  btn.disabled = on;
  if (on) {
    btn.dataset.origText = btn.textContent;
    btn.textContent      = t('Επεξεργασία...', 'Processing...');
  } else {
    btn.textContent = btn.dataset.origText || btn.textContent;
  }
}

// ============================================================
//  CURRICULUM PLANNER
//  Per-class assignment of datasets (+ specific lyo levels)
//  and game engines. Saved to classes/{classKey}/curriculum/main
// ============================================================

let _cpClassKey  = null;
let _cpActiveTab = 'practice'; // 'practice' | 'theory'
let _cpCurrData  = { datasets: {}, engines: {}, order: [], engineOrder: [] };

const _CP_CLASSES = [
  { key: 'gym-a', label: 'Α΄ Γυμνασίου', short: 'Α΄ Γυμν.' },
  { key: 'gym-b', label: 'Β΄ Γυμνασίου', short: 'Β΄ Γυμν.' },
  { key: 'gym-c', label: 'Γ΄ Γυμνασίου', short: 'Γ΄ Γυμν.' },
  { key: 'lyk-a', label: 'Α΄ Λυκείου',   short: 'Α΄ Λυκ.'  },
  { key: 'lyk-b', label: 'Β΄ Λυκείου',   short: 'Β΄ Λυκ.'  },
  { key: 'lyk-c', label: 'Γ΄ Λυκείου',   short: 'Γ΄ Λυκ.'  },
];

function _cpInitPanel() {
  const wrap = document.getElementById('cp-class-tabs');
  if (!wrap || wrap.childElementCount > 0) return;

  wrap.innerHTML = _CP_CLASSES.map((c, i) => `
    <button class="cp-class-tab${i === 0 ? ' active' : ''}"
            data-key="${c.key}"
            title="${c.label}"
            onclick="_cpSelectClass('${c.key}', this)">${c.short}</button>
  `).join('');

  _cpTooltipInit();
  _cpSelectClass(_CP_CLASSES[0].key, wrap.querySelector('.cp-class-tab'));
  _cpEcLoad();   // global engines-per-content matrix (class-independent)
}

async function _cpSelectClass(classKey, btn) {
  document.querySelectorAll('.cp-class-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  _cpClassKey = classKey;
  _cpCurrData = { datasets: {}, engines: {} };

  const content  = document.getElementById('cp-content');
  const loading  = document.getElementById('cp-loading');
  const resultEl = document.getElementById('cp-result');
  if (content)  content.style.display = 'none';
  if (loading)  loading.style.display = '';
  if (resultEl) resultEl.textContent  = '';

  try {
    const snap = await firebase.firestore()
      .collection('classes').doc(classKey)
      .collection('curriculum').doc('main').get();

    if (snap.exists) {
      const d = snap.data();
      _cpCurrData = {
        datasets:    d.datasets    || {},
        engines:     d.engines     || {},
        order:       Array.isArray(d.order)       ? d.order       : [],
        engineOrder: Array.isArray(d.engineOrder) ? d.engineOrder : [],
      };
      // Fill any missing order entries for newly-added datasets
      _cpFillMissingOrder();
    } else {
      _cpDefaultAll();
    }
  } catch (err) {
    console.warn('[cp] load:', err);
    _cpDefaultAll();
  }

  if (loading) loading.style.display = 'none';
  if (content) content.style.display = '';
  _cpRenderDatasets();
}

// Resolve a level-config global by name. var/function globals are on
// window; top-level const/let globals (e.g. LYO_LVL) live in the global
// lexical scope and need indirect eval. Name comes from GP_DATASETS only.
function _cpResolveLevels(name) {
  if (!name) return null;
  if (typeof window[name] !== 'undefined') return window[name];
  try { return (0, eval)(name); } catch (_e) { return null; }
}

function _cpDefaultAll() {
  const allDs = typeof GP_DATASETS !== 'undefined' ? GP_DATASETS : [];
  const allEng = typeof GP_ENGINES !== 'undefined' ? GP_ENGINES : [];
  _cpCurrData = { datasets: {}, engines: {}, order: [], engineOrder: [] };
  // Enable all grammar datasets by default; build order from current GP_DATASETS sequence
  allDs.forEach(ds => {
    const entry = { enabled: ds.category === 'Γραμματική' };
    if (ds.leveled && ds.levelsGlobal) {
      const lvlArr = _cpResolveLevels(ds.levelsGlobal);
      if (Array.isArray(lvlArr)) entry.levels = lvlArr.map(l => l.id);
    }
    _cpCurrData.datasets[ds.id] = entry;
    _cpCurrData.order.push(ds.id);
  });
  allEng.forEach(e => {
    _cpCurrData.engines[e.id] = { enabled: true };
    _cpCurrData.engineOrder.push(e.id);
  });
}

// Append any newly-added GP_DATASETS/GP_ENGINES not yet in the saved order arrays.
function _cpFillMissingOrder() {
  const allDs  = typeof GP_DATASETS !== 'undefined' ? GP_DATASETS : [];
  const allEng = typeof GP_ENGINES  !== 'undefined' ? GP_ENGINES  : [];
  allDs.forEach(ds => {
    if (!_cpCurrData.order.includes(ds.id)) _cpCurrData.order.push(ds.id);
  });
  allEng.forEach(e => {
    if (!_cpCurrData.engineOrder.includes(e.id)) _cpCurrData.engineOrder.push(e.id);
  });
}

function _cpResetDefaults() {
  _cpDefaultAll();
  _cpRenderDatasets();
  _cpRenderEngines();
  const resultEl = document.getElementById('cp-result');
  if (resultEl) { resultEl.textContent = 'Επαναφορά προεπιλογών — αποθηκεύστε για να εφαρμοστούν.'; resultEl.className = 'admin-result'; }
}

// ── Render datasets ──────────────────────────────────────────

function _cpRenderDatasets() {
  const grid = document.getElementById('cp-datasets-grid');
  if (!grid) return;

  const allDs = typeof GP_DATASETS !== 'undefined' ? GP_DATASETS : [];
  // Filter by active tab type
  const filtered = allDs.filter(ds => {
    const t = ds.type || 'practice';
    return _cpActiveTab === 'theory' ? t === 'theory' : t !== 'theory';
  });

  if (!filtered.length) {
    grid.innerHTML = `<div class="sp-ccm-empty">${
      _cpActiveTab === 'theory'
        ? 'Δεν βρέθηκε θεωρητικό περιεχόμενο για αυτή την τάξη.'
        : 'Δεν βρέθηκαν datasets.'
    }</div>`;
    return;
  }

  // Sort by stored order array; unordered items append at end
  const order = _cpCurrData.order || [];
  const sorted = [...filtered].sort((a, b) => {
    const ia = order.indexOf(a.id), ib = order.indexOf(b.id);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  // Flat ordered list with category labels as decoration
  let lastCat = null;
  const rows = sorted.map((ds, idx) => {
    let catHd = '';
    if (ds.category !== lastCat) {
      catHd = `<div class="cp-cat-hd" style="margin-top:${lastCat?'14px':'0'}">${ds.category || 'Άλλα'}</div>`;
      lastCat = ds.category;
    }
    return catHd + _cpBuildDatasetRow(ds, idx, sorted.length);
  }).join('');

  grid.innerHTML = rows;
}

// Move a dataset up (-1) or down (+1) in the order array, then re-render.
function _cpMoveDataset(dsId, dir) {
  const order = _cpCurrData.order;
  const idx = order.indexOf(dsId);
  if (idx === -1) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= order.length) return;
  [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
  _cpRenderDatasets();
}

// Move an engine up/down in engineOrder.
function _cpMoveEngine(engId, dir) {
  const order = _cpCurrData.engineOrder;
  const idx = order.indexOf(engId);
  if (idx === -1) return;
  const newIdx = idx + dir;
  if (newIdx < 0 || newIdx >= order.length) return;
  [order[idx], order[newIdx]] = [order[newIdx], order[idx]];
  _cpRenderEngines();
}

// Tab switcher — called from the admin-cc.js view
window._cpSetTab = function(tab) {
  _cpActiveTab = tab;
  _cpRenderDatasets();
  _cpRenderEngines();
};

function _cpBuildDatasetRow(ds, idx, total) {
  const state    = _cpCurrData.datasets[ds.id] || { enabled: false };
  const isOn     = !!state.enabled;
  const levels   = Array.isArray(state.levels) ? state.levels : [];
  const lvlArray = (ds.leveled && ds.levelsGlobal) ? _cpResolveLevels(ds.levelsGlobal) : null;
  const hasPicker = Array.isArray(lvlArray) && lvlArray.length > 0;

  let pickerHtml = '';
  if (hasPicker) {
    const groups = {};
    lvlArray.forEach(l => { if (!groups[l.group]) groups[l.group] = []; groups[l.group].push(l); });
    const total    = lvlArray.length;
    const selCount = levels.length;
    const pickerId = `cp-lvl-picker-${ds.id}`;
    const countId  = `cp-lvl-count-${ds.id}`;

    const groupsHtml = Object.entries(groups).map(([grp, lvls]) => {
      const allSel = lvls.every(l => levels.includes(l.id));
      const chips  = lvls.map(l => {
        const sel = levels.includes(l.id);
        return `<button class="cp-lyo-chip cp-lyo-chip--${l.color || 'lgreen'}${sel ? ' selected' : ''}"
                        data-lvl="${l.id}" title="Επίπεδο ${l.id}: ${l.desc || ''}"
                        onclick="_cpToggleLevel('${ds.id}', ${l.id}, this)">${l.id}</button>`;
      }).join('');
      return `
        <div class="cp-lyo-group">
          <div class="cp-lyo-grp-hd">
            <span class="cp-lyo-grp-name">${grp}</span>
            <button class="cp-lyo-grp-btn${allSel ? ' active' : ''}"
                    data-group="${grp}"
                    onclick="_cpToggleLevelGroup('${ds.id}', '${grp}', this)">${allSel ? '✓ Όλα' : 'Επιλογή Όλων'}</button>
          </div>
          <div class="cp-lyo-chips">${chips}</div>
        </div>`;
    }).join('');

    pickerHtml = `
      <div class="cp-lyo-picker${isOn ? '' : ' cp-lyo-picker--hidden'}" id="${pickerId}">
        <div class="cp-lyo-picker-hd">
          <span class="cp-lyo-picker-title">Επίπεδα</span>
          <span class="cp-lyo-picker-count" id="${countId}">${selCount}/${total} επίπεδα</span>
          <button class="cp-lyo-all-btn active" onclick="_cpToggleLevelAll('${ds.id}', true)">Όλα</button>
          <button class="cp-lyo-all-btn" onclick="_cpToggleLevelAll('${ds.id}', false)">Κανένα</button>
        </div>
        <div class="cp-lyo-groups">${groupsHtml}</div>
      </div>`;
  }

  const tierTag    = `<span class="sp-ccm-cat-tag">${ds.tier || 'free'}</span>`;
  const leveledTag = hasPicker ? '<span class="cp-leveled-tag">Επίπεδα</span>' : '';

  const isFirst = (idx === 0);
  const isLast  = (idx === (total || 0) - 1);
  const moveBtns = `<div class="cp-move-btns">
    <button class="cp-move-btn" title="Μετακίνηση πάνω"
      onclick="_cpMoveDataset('${ds.id}', -1)"${isFirst ? ' disabled' : ''}>↑</button>
    <button class="cp-move-btn" title="Μετακίνηση κάτω"
      onclick="_cpMoveDataset('${ds.id}', 1)"${isLast  ? ' disabled' : ''}>↓</button>
  </div>`;

  return `
    <div class="cp-dataset-row${isOn ? ' cp-row-on' : ''}" id="cp-ds-row-${ds.id}">
      <div class="cp-row-main">
        ${moveBtns}
        <div class="sp-ccm-mode-info">
          <span class="sp-ccm-mode-icon">${ds.icon || '📦'}</span>
          <div class="sp-ccm-mode-text">
            <div class="sp-ccm-mode-label">${ds.label}</div>
            <div class="sp-ccm-mode-meta">${ds.meta || ''}</div>
          </div>
          ${leveledTag}${tierTag}
        </div>
        <label class="subs-toggle" title="${isOn ? 'Ενεργό' : 'Ανενεργό'}">
          <input type="checkbox" data-dsid="${ds.id}" ${isOn ? 'checked' : ''}
                 onchange="_cpToggleDataset('${ds.id}', this)"/>
          <span class="subs-toggle-track"></span>
        </label>
      </div>
      ${pickerHtml}
    </div>`;
}

function _cpToggleDataset(dsId, el) {
  if (!_cpCurrData.datasets[dsId]) _cpCurrData.datasets[dsId] = {};
  _cpCurrData.datasets[dsId].enabled = !!el.checked;
  const row = document.getElementById(`cp-ds-row-${dsId}`);
  if (row) row.classList.toggle('cp-row-on', !!el.checked);
  // Show/hide level picker for any leveled dataset
  const picker = document.getElementById(`cp-lvl-picker-${dsId}`);
  if (picker) picker.classList.toggle('cp-lyo-picker--hidden', !el.checked);
}

// ── Generic level helpers (work for any leveled dataset) ─────

function _cpToggleLevel(dsId, lvlId, btn) {
  if (!_cpCurrData.datasets[dsId]) _cpCurrData.datasets[dsId] = { enabled: true, levels: [] };
  if (!Array.isArray(_cpCurrData.datasets[dsId].levels)) _cpCurrData.datasets[dsId].levels = [];
  const lvls = _cpCurrData.datasets[dsId].levels;
  const idx  = lvls.indexOf(lvlId);
  if (idx === -1) { lvls.push(lvlId); btn.classList.add('selected'); }
  else            { lvls.splice(idx, 1); btn.classList.remove('selected'); }
  _cpUpdateLevelCount(dsId);
  _cpSyncGroupBtn(btn);
}

function _cpToggleLevelGroup(dsId, groupName, btn) {
  const ds = typeof GP_DATASETS !== 'undefined' ? GP_DATASETS.find(d => d.id === dsId) : null;
  const lvlArray = (ds && ds.levelsGlobal) ? window[ds.levelsGlobal] : null;
  if (!Array.isArray(lvlArray)) return;
  if (!_cpCurrData.datasets[dsId]) _cpCurrData.datasets[dsId] = { enabled: true, levels: [] };
  if (!Array.isArray(_cpCurrData.datasets[dsId].levels)) _cpCurrData.datasets[dsId].levels = [];
  const lvls   = _cpCurrData.datasets[dsId].levels;
  const grpIds = lvlArray.filter(l => l.group === groupName).map(l => l.id);
  const allOn  = grpIds.every(id => lvls.includes(id));

  grpIds.forEach(id => {
    const idx = lvls.indexOf(id);
    if (allOn) { if (idx !== -1) lvls.splice(idx, 1); }
    else        { if (idx === -1) lvls.push(id); }
  });

  const grpDiv = btn.closest('.cp-lyo-group');
  if (grpDiv) {
    grpDiv.querySelectorAll('.cp-lyo-chip').forEach(c => {
      c.classList.toggle('selected', lvls.includes(+c.dataset.lvl));
    });
  }
  btn.classList.toggle('active', !allOn);
  btn.textContent = !allOn ? '✓ Όλα' : 'Επιλογή Όλων';
  _cpUpdateLevelCount(dsId);
}

function _cpToggleLevelAll(dsId, selectAll) {
  const ds = typeof GP_DATASETS !== 'undefined' ? GP_DATASETS.find(d => d.id === dsId) : null;
  const lvlArray = (ds && ds.levelsGlobal) ? window[ds.levelsGlobal] : null;
  if (!Array.isArray(lvlArray)) return;
  if (!_cpCurrData.datasets[dsId]) _cpCurrData.datasets[dsId] = { enabled: true, levels: [] };
  _cpCurrData.datasets[dsId].levels = selectAll ? lvlArray.map(l => l.id) : [];
  const picker = document.getElementById(`cp-lvl-picker-${dsId}`);
  if (picker) {
    picker.querySelectorAll('.cp-lyo-chip').forEach(c => c.classList.toggle('selected', selectAll));
    picker.querySelectorAll('.cp-lyo-grp-btn').forEach(b => {
      b.classList.toggle('active', selectAll);
      b.textContent = selectAll ? '✓ Όλα' : 'Επιλογή Όλων';
    });
  }
  _cpUpdateLevelCount(dsId);
}

function _cpUpdateLevelCount(dsId) {
  const el = document.getElementById(`cp-lvl-count-${dsId}`);
  if (!el) return;
  const ds = typeof GP_DATASETS !== 'undefined' ? GP_DATASETS.find(d => d.id === dsId) : null;
  const lvlArray = (ds && ds.levelsGlobal) ? window[ds.levelsGlobal] : null;
  if (!Array.isArray(lvlArray)) return;
  const n = (_cpCurrData.datasets[dsId]?.levels || []).length;
  el.textContent = `${n}/${lvlArray.length} επίπεδα`;
}


function _cpSyncGroupBtn(chip) {
  const grpDiv = chip.closest('.cp-lyo-group');
  if (!grpDiv) return;
  const btn    = grpDiv.querySelector('.cp-lyo-grp-btn');
  if (!btn) return;
  const chips  = [...grpDiv.querySelectorAll('.cp-lyo-chip')];
  const allSel = chips.every(c => c.classList.contains('selected'));
  btn.classList.toggle('active', allSel);
  btn.textContent = allSel ? '✓ Όλα' : 'Επιλογή Όλων';
}

// ── Render game engines ──────────────────────────────────────

function _cpRenderEngines() {
  const inner = document.getElementById('cp-engines-inner');
  if (!inner) return;
  const allEng = typeof GP_ENGINES !== 'undefined' ? GP_ENGINES : [];

  // Filter by active tab type (theory tab shows mnemosyne only; practice shows the rest)
  const filtered = allEng.filter(e => {
    const t = e.type || 'practice';
    return _cpActiveTab === 'theory' ? t === 'theory' : t !== 'theory';
  });

  if (!filtered.length) { inner.innerHTML = ''; return; }

  // Sort by engineOrder
  const engOrder = _cpCurrData.engineOrder || [];
  const sorted = [...filtered].sort((a, b) => {
    const ia = engOrder.indexOf(a.id), ib = engOrder.indexOf(b.id);
    if (ia === -1 && ib === -1) return 0;
    if (ia === -1) return 1; if (ib === -1) return -1;
    return ia - ib;
  });

  inner.innerHTML = sorted.map((eng, idx) => {
    const state  = _cpCurrData.engines[eng.id];
    const isOn   = state ? state.enabled !== false : true;
    const pvpTag = eng.multiplayer ? '<span class="cp-pvp-tag">PvP</span>' : '';
    const tags   = (eng.tags || []).join(' · ');
    const moveBtns = `<div class="cp-move-btns">
      <button class="cp-move-btn" onclick="_cpMoveEngine('${eng.id}',-1)"${idx===0?' disabled':''}>↑</button>
      <button class="cp-move-btn" onclick="_cpMoveEngine('${eng.id}',1)"${idx===sorted.length-1?' disabled':''}>↓</button>
    </div>`;
    return `
      <div class="cp-dataset-row${isOn ? ' cp-row-on' : ''}" id="cp-eng-row-${eng.id}">
        <div class="cp-row-main">
          ${moveBtns}
          <div class="sp-ccm-mode-info">
            <span class="sp-ccm-mode-icon">${eng.icon || '🎮'}</span>
            <div class="sp-ccm-mode-text">
              <div class="sp-ccm-mode-label">${eng.label}</div>
              <div class="sp-ccm-mode-meta">${eng.subtitle || ''} · ${tags}</div>
            </div>
            ${pvpTag}
          </div>
          <label class="subs-toggle">
            <input type="checkbox" data-engid="${eng.id}" ${isOn ? 'checked' : ''}
                   onchange="_cpToggleEngine('${eng.id}', this)"/>
            <span class="subs-toggle-track"></span>
          </label>
        </div>
      </div>`;
  }).join('');
}

function _cpToggleEngine(engineId, el) {
  if (!_cpCurrData.engines[engineId]) _cpCurrData.engines[engineId] = {};
  _cpCurrData.engines[engineId].enabled = !!el.checked;
  const row = document.getElementById(`cp-eng-row-${engineId}`);
  if (row) row.classList.toggle('cp-row-on', !!el.checked);
}

// ── Save ─────────────────────────────────────────────────────

// ── Lyo level tooltip ────────────────────────────────────────

function _cpTooltipInit() {
  if (document.getElementById('cp-tooltip')) return;
  const tip = document.createElement('div');
  tip.id = 'cp-tooltip';
  tip.className = 'cp-tooltip';
  document.body.appendChild(tip);

  document.addEventListener('mouseover', e => {
    const chip = e.target.closest('.cp-lyo-chip');
    if (!chip) { tip.style.opacity = '0'; return; }
    // Find which dataset this chip belongs to by walking up to the picker div
    const picker = chip.closest('[id^="cp-lvl-picker-"]');
    const dsId   = picker ? picker.id.replace('cp-lvl-picker-', '') : 'lyo';
    const ds     = typeof GP_DATASETS !== 'undefined' ? GP_DATASETS.find(d => d.id === dsId) : null;
    const lvlArr = (ds && ds.levelsGlobal) ? _cpResolveLevels(ds.levelsGlobal) : (typeof LYO_LVL !== 'undefined' ? LYO_LVL : null);
    if (!lvlArr) { tip.style.opacity = '0'; return; }
    const lvl = lvlArr.find(l => l.id === +chip.dataset.lvl);
    if (!lvl) { tip.style.opacity = '0'; return; }
    tip.innerHTML = `
      <div class="cp-tip-lvl">Επίπεδο ${lvl.id}</div>
      <div class="cp-tip-grp">${lvl.group}</div>
      <div class="cp-tip-desc">${lvl.desc || ''}</div>`;
    tip.style.opacity = '1';
  });

  document.addEventListener('mousemove', e => {
    if (tip.style.opacity === '0') return;
    const x = e.clientX, y = e.clientY;
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = (x + 14) + 'px';
    tip.style.top  = Math.max(8, y - th - 10) + 'px';
  });

  document.addEventListener('mouseout', e => {
    const chip = e.target.closest('.cp-lyo-chip');
    if (!chip) return;
    if (!e.relatedTarget?.closest('.cp-lyo-chip')) tip.style.opacity = '0';
  });
}

async function _cpSave() {
  if ((typeof isAdmin === 'undefined' || !isAdmin) || !_cpClassKey) return;
  const btn      = document.getElementById('cp-save-btn');
  const resultEl = document.getElementById('cp-result');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    await firebase.firestore()
      .collection('classes').doc(_cpClassKey)
      .collection('curriculum').doc('main')
      .set({
        datasets:    _cpCurrData.datasets,
        engines:     _cpCurrData.engines,
        order:       _cpCurrData.order,
        engineOrder: _cpCurrData.engineOrder,
        updatedAt:   firebase.firestore.FieldValue.serverTimestamp(),
        updatedBy:   (typeof currentUser !== 'undefined' && currentUser?.email) || 'admin',
      });
    _adminResult(resultEl, '✓ Αποθηκεύτηκε επιτυχώς!', 'success');
    setTimeout(() => _adminResult(resultEl, '', ''), 3500);
  } catch (err) {
    console.error('[cp] save:', err);
    _adminResult(resultEl, 'Σφάλμα αποθήκευσης.', 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

// ============================================================
//  ENGINES PER CONTENT  ·  Παιχνίδια ανά Ύλη  (global / class-independent)
//  ──────────────────────────────────────────────────────────
//  Allow-list of arcade engines per content category, stored at
//  config/engine-content = { map: { 'Γραμματική':[id,…], … } }.
//  A category key present → only those engines allowed; a category
//  absent → no override → all allowed. Read side lives in nav.js
//  (_loadEngineContent / _gpEngineAllowedForCategory).
// ============================================================

const _CP_EC_CATEGORIES = ['Γραμματική', 'Λατινικά'];
let _cpEcMap    = {};      // { category: [engineId,…] } — loaded override
let _cpEcLoaded = false;

// An engine "supports" a category unless its own allowedCategories excludes it.
function _cpEcApplicable(eng, category) {
  return !eng.allowedCategories || eng.allowedCategories.includes(category);
}

// Toggle ON-state: a category with no stored list = no override = all allowed.
function _cpEcIsOn(engineId, category) {
  const list = _cpEcMap[category];
  if (!Array.isArray(list)) return true;
  return list.includes(engineId);
}

async function _cpEcLoad() {
  if (_cpEcLoaded) return;
  _cpEcLoaded = true;
  try {
    const doc = await firebase.firestore().collection('config').doc('engine-content').get();
    if (doc.exists && doc.data().map) _cpEcMap = doc.data().map;
  } catch (_) { /* offline — start from "all allowed" defaults */ }
  _cpEcRender();
}

function _cpEcRender() {
  const host = document.getElementById('cp-ec-grid');
  if (!host || typeof GP_ENGINES === 'undefined') return;
  const cats = _CP_EC_CATEGORIES;
  const cols = `grid-template-columns:1fr repeat(${cats.length},70px)`;

  let html = '<div class="cp-ec-table">';
  html += `<div class="cp-ec-row cp-ec-colhead" style="${cols}">` +
    '<div class="cp-ec-colhead-lead">Παιχνίδι</div>' +
    cats.map(c => `<div class="cp-ec-cell">${c}</div>`).join('') +
    '</div>';

  const engMap = {};
  GP_ENGINES.forEach(e => { engMap[e.id] = e; });

  const groups = (typeof GP_ENGINE_CATEGORIES !== 'undefined') ? GP_ENGINE_CATEGORIES : [];
  groups.forEach(grp => {
    html += `<div class="cp-ec-grouphd">${grp.label}</div>`;
    grp.ids.forEach(eid => {
      const eng = engMap[eid];
      if (eng) html += _cpEcBuildRow(eng, cats, cols);
    });
  });
  html += '</div>';
  host.innerHTML = html;
}

function _cpEcBuildRow(eng, cats, cols) {
  const cells = cats.map(cat => {
    if (!_cpEcApplicable(eng, cat)) {
      return '<div class="cp-ec-cell cp-ec-na" title="Το παιχνίδι δεν υποστηρίζει αυτή την ύλη">—</div>';
    }
    const on = _cpEcIsOn(eng.id, cat);
    return '<div class="cp-ec-cell">' +
      `<label class="subs-toggle" title="${on ? 'Ενεργό' : 'Ανενεργό'}">` +
        `<input type="checkbox" ${on ? 'checked' : ''} onchange="_cpEcToggle('${eng.id}','${cat}',this)"/>` +
        '<span class="subs-toggle-track"></span>' +
      '</label></div>';
  }).join('');
  return `<div class="cp-ec-row" style="${cols}">` +
    `<div class="cp-ec-name">${eng.label}<span class="cp-ec-sub">${eng.subtitle || ''}</span></div>` +
    cells + '</div>';
}

function _cpEcToggle(engineId, category, el) {
  let list = _cpEcMap[category];
  // First touch of an "all allowed" category — materialize the implicit
  // full set into an explicit allow-list so this toggle is meaningful.
  if (!Array.isArray(list)) {
    list = GP_ENGINES.filter(e => _cpEcApplicable(e, category)).map(e => e.id);
    _cpEcMap[category] = list;
  }
  const i = list.indexOf(engineId);
  if (el.checked) { if (i === -1) list.push(engineId); }
  else            { if (i !== -1) list.splice(i, 1); }
}

async function _cpEcSave() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  const btn      = document.getElementById('cp-ec-save-btn');
  const resultEl = document.getElementById('cp-ec-result');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    await firebase.firestore().collection('config').doc('engine-content').set({
      map:       _cpEcMap,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: (typeof currentUser !== 'undefined' && currentUser?.email) || 'admin',
    });
    // Apply to the live read-side map so games re-filter without a reload.
    window._gpEngineContent = _cpEcMap;
    _adminResult(resultEl, '✓ Αποθηκεύτηκε — ισχύει άμεσα.', 'success');
    setTimeout(() => _adminResult(resultEl, '', ''), 3500);
  } catch (err) {
    console.error('[cp-ec] save:', err);
    _adminResult(resultEl, 'Σφάλμα αποθήκευσης.', 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

// ============================================================
//  TIER CONTROL PANEL
//  Set free / student / teacher tier per dataset and game engine.
//  Saved to config/game-tiers (same path as old General tab card).
// ============================================================

let _trTierData   = {};   // { datasetId: 'free'|'student'|'teacher' }
let _trEngData    = {};   // { engineId:  'free'|'student'|'teacher' }
let _trInitDone   = false;
// Exposed so admin-cc.js can reset the guard when re-opening the tiers view
window._trResetInit = () => { _trInitDone = false; _trTierData = {}; _trEngData = {}; };

async function _trInitPanel() {
  if (_trInitDone) return;
  _trInitDone = true;

  const loading = document.getElementById('tr-loading');
  if (loading) loading.style.display = '';

  // Defaults from GP_DATASETS
  if (typeof GP_DATASETS !== 'undefined') {
    GP_DATASETS.forEach(ds => { _trTierData[ds.id] = ds.tier || 'free'; });
  }
  if (typeof GP_ENGINES !== 'undefined') {
    GP_ENGINES.forEach(e => { _trEngData[e.id] = e.tier || 'free'; });
  }

  // Overlay from Firestore
  try {
    const doc = await firebase.firestore().collection('config').doc('game-tiers').get();
    if (doc.exists && doc.data().tiers) {
      Object.assign(_trTierData, doc.data().tiers);
    }
    if (doc.exists && doc.data().engineTiers) {
      Object.assign(_trEngData, doc.data().engineTiers);
    }
  } catch (e) { /* no connectivity — use defaults */ }

  // Wildcard access state from Firestore
  try {
    const appDoc = await firebase.firestore().collection('config').doc('app').get();
    const wildcardEl = document.getElementById('tr-wildcard-checkbox');
    if (wildcardEl && appDoc.exists) {
      wildcardEl.checked = !!appDoc.data()?.wildcard_access;
    }
  } catch (_) {}

  if (loading) loading.style.display = 'none';
  ['tr-wildcard-section', 'tr-ds-section', 'tr-eng-section', 'tr-save-section'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  });

  _trRenderDatasets();
  _trRenderEngines();
}

function _trRenderDatasets() {
  const grid = document.getElementById('tr-datasets-grid');
  if (!grid) return;
  const datasets = typeof GP_DATASETS !== 'undefined' ? GP_DATASETS : [];

  const cats = {};
  datasets.forEach(ds => {
    const cat = ds.category || 'Άλλα';
    if (!cats[cat]) cats[cat] = [];
    cats[cat].push(ds);
  });

  grid.innerHTML = Object.entries(cats).map(([cat, list]) => `
    <div class="cp-cat-section">
      <div class="cp-cat-hd">${cat}</div>
      <div class="cp-cat-rows">
        ${list.map(ds => _trBuildRow(ds.id, ds.icon || '📦', ds.label, ds.meta || '', _trTierData[ds.id] || 'free', 'ds')).join('')}
      </div>
    </div>
  `).join('');
}

function _trRenderEngines() {
  const grid = document.getElementById('tr-engines-grid');
  if (!grid) return;
  const engines = typeof GP_ENGINES !== 'undefined' ? GP_ENGINES : [];

  grid.innerHTML = `
    <div class="cp-cat-section">
      <div class="cp-cat-hd">Game Engines</div>
      <div class="cp-cat-rows">
        ${engines.map(e => _trBuildRow(e.id, e.icon || '🎮', e.label, `${e.subtitle || ''} · ${(e.tags||[]).join(', ')}`, _trEngData[e.id] || 'free', 'eng')).join('')}
      </div>
    </div>`;
}

function _trBuildRow(id, icon, label, meta, tier, type) {
  const mkBtn = (t, lbl) => `<button class="tr-t-btn${tier===t?' active':''}" data-tier="${t}"
    onclick="_trSetTier('${id}','${t}',this,'${type}')">${lbl}</button>`;
  return `
    <div class="cp-dataset-row cp-row-on" id="tr-row-${type}-${id}">
      <div class="cp-row-main">
        <div class="sp-ccm-mode-info">
          <span class="sp-ccm-mode-icon">${icon}</span>
          <div class="sp-ccm-mode-text">
            <div class="sp-ccm-mode-label">${label}</div>
            <div class="sp-ccm-mode-meta">${meta}</div>
          </div>
        </div>
        <div class="tr-tier-sel" id="tr-sel-${type}-${id}">
          ${mkBtn('free','Free')}${mkBtn('student','Student')}${mkBtn('teacher','Teacher')}
        </div>
      </div>
    </div>`;
}

function _trSetTier(id, tier, btn, type) {
  if (type === 'ds') _trTierData[id] = tier;
  else               _trEngData[id]  = tier;
  const sel = document.getElementById(`tr-sel-${type}-${id}`);
  if (sel) sel.querySelectorAll('.tr-t-btn').forEach(b => b.classList.toggle('active', b.dataset.tier === tier));
}

async function _trSave() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  const btn      = document.getElementById('tr-save-btn');
  const resultEl = document.getElementById('tr-result');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    // merge so we don't clobber sibling keys written by other tabs
    // (the General-tab tiers card and the datasetActive/engineActive toggles)
    await firebase.firestore().collection('config').doc('game-tiers').set({
      tiers:       _trTierData,
      engineTiers: _trEngData,
      updatedAt:   firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy:   (typeof currentUser !== 'undefined' && currentUser?.email) || 'admin',
    }, { merge: true });

    // Apply to live GP_DATASETS so games re-gate without reload
    if (typeof GP_DATASETS !== 'undefined') {
      GP_DATASETS.forEach(ds => { if (_trTierData[ds.id]) ds.tier = _trTierData[ds.id]; });
    }

    _adminResult(resultEl, '✓ Tiers αποθηκεύτηκαν — ισχύουν άμεσα.', 'success');
    setTimeout(() => _adminResult(resultEl, '', ''), 3500);
  } catch (err) {
    console.error('[tr] save:', err);
    _adminResult(resultEl, 'Σφάλμα αποθήκευσης.', 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

// ── WILDCARD ACCESS OVERRIDE ──────────────────────────────────
// Saves wildcard_access flag to /config/app.
// When true, _checkWildcardAccess() (app.js) unlocks all modules.
async function _trSaveWildcard(checkbox) {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  const val = !!checkbox?.checked;
  try {
    await firebase.firestore().collection('config').doc('app')
      .set({ wildcard_access: val }, { merge: true });
    if (typeof showSymphoniToast === 'function') {
      showSymphoniToast(
        val ? 'warning' : 'success',
        val ? '⚠ Wildcard Access ΕΝΕΡΓΟ — όλα τα modules ξεκλειδωμένα!'
            : '✓ Wildcard Access απενεργοποιήθηκε.'
      );
    }
  } catch (err) {
    console.error('[wildcard] save error:', err);
    if (checkbox) checkbox.checked = !val; // revert on failure
  }
}

/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — admin content editor  (config/anodos: riddles + rewards)
   ────────────────────────────────────────────────────────────────────
   Riddles append to the game's EVENTS (αἰνίγματα). Rewards append to RELICS
   (collectible περίαπτα). The ⚡ true/false volley is auto-generated from the
   trivia at runtime (anodos-content.js), so it is NOT edited here.
   Saved to config/anodos (admin-only write, public read — firestore.rules).
   ════════════════════════════════════════════════════════════════════ */
var _anodosData = { riddles: [], rewards: [] };

function _anodosInitPanel() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  _anodosLoadContent();
}

async function _anodosLoadContent() {
  try {
    const doc = await firebase.firestore().collection('config').doc('anodos').get();
    const d = (doc.exists && doc.data()) || {};
    _anodosData = {
      riddles: Array.isArray(d.riddles) ? d.riddles.slice() : [],
      rewards: Array.isArray(d.rewards) ? d.rewards.slice() : [],
    };
  } catch (err) {
    console.error('[admin] load anodos error:', err);
    _anodosData = { riddles: [], rewards: [] };
  }
  _anodosRender();
}

function _anodosEsc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _anodosRender() {
  const rl = document.getElementById('anodos-riddles-list');
  const wl = document.getElementById('anodos-rewards-list');
  const empty = txt => '<div style="color:var(--text-subtle,#9a8d78);font-size:13px;padding:6px 0;">' + txt + '</div>';
  if (rl) rl.innerHTML = _anodosData.riddles.length
    ? _anodosData.riddles.map((r, i) => _anodosRiddleRow(r, i)).join('')
    : empty('Δὲν ὑπάρχουν αἰνίγματα ἀκόμη.');
  if (wl) wl.innerHTML = _anodosData.rewards.length
    ? _anodosData.rewards.map((r, i) => _anodosRewardRow(r, i)).join('')
    : empty('Δὲν ὑπάρχουν περίαπτα ἀκόμη.');
}

function _anodosRiddleRow(r, i) {
  r = r || {};
  const opts = Array.isArray(r.opts) ? r.opts : ['', '', '', ''];
  const o = k => _anodosEsc(opts[k] || '');
  const sel = k => (r.a | 0) === k ? ' selected' : '';
  return '' +
    '<div class="admin-anodos-row" data-kind="riddle" data-i="' + i + '" style="border:1px solid rgba(200,120,48,.18);border-radius:10px;padding:12px;margin-bottom:10px;">' +
      '<div class="admin-field" style="margin-bottom:8px;"><label>Ἐρώτηση</label>' +
        '<input type="text" class="admin-input an-q" value="' + _anodosEsc(r.q) + '" placeholder="π.χ. Τί εἶμαι;"/></div>' +
      '<div class="admin-field-row">' +
        '<div class="admin-field"><label>Α</label><input type="text" class="admin-input an-o0" value="' + o(0) + '"/></div>' +
        '<div class="admin-field"><label>Β</label><input type="text" class="admin-input an-o1" value="' + o(1) + '"/></div>' +
        '<div class="admin-field"><label>Γ</label><input type="text" class="admin-input an-o2" value="' + o(2) + '"/></div>' +
        '<div class="admin-field"><label>Δ</label><input type="text" class="admin-input an-o3" value="' + o(3) + '"/></div>' +
      '</div>' +
      '<div class="admin-field-row" style="align-items:flex-end;">' +
        '<div class="admin-field" style="max-width:120px;"><label>Σωστή</label><select class="admin-input an-a">' +
          '<option value="0"' + sel(0) + '>Α</option><option value="1"' + sel(1) + '>Β</option>' +
          '<option value="2"' + sel(2) + '>Γ</option><option value="3"' + sel(3) + '>Δ</option></select></div>' +
        '<div class="admin-field" style="flex:2;"><label>Τίτλος (προαιρετικό)</label>' +
          '<input type="text" class="admin-input an-title" value="' + _anodosEsc(r.title) + '" placeholder="Αἴνιγμα"/></div>' +
        '<button type="button" class="admin-deact-btn" title="Διαγραφή" onclick="_anodosRemove(\'riddle\',' + i + ')">✕</button>' +
      '</div>' +
    '</div>';
}

function _anodosRewardRow(r, i) {
  r = r || {};
  return '' +
    '<div class="admin-anodos-row" data-kind="reward" data-i="' + i + '" style="border:1px solid rgba(200,120,48,.18);border-radius:10px;padding:12px;margin-bottom:10px;">' +
      '<div class="admin-field-row" style="align-items:flex-end;">' +
        '<div class="admin-field" style="max-width:90px;"><label>Εἰκονίδιο</label>' +
          '<input type="text" class="admin-input an-icon" value="' + _anodosEsc(r.icon || '✦') + '" placeholder="✦"/></div>' +
        '<div class="admin-field" style="flex:2;"><label>Ὄνομα</label>' +
          '<input type="text" class="admin-input an-name" value="' + _anodosEsc(r.name) + '" placeholder="π.χ. Δαχτυλίδι τοῦ Γύγη"/></div>' +
        '<button type="button" class="admin-deact-btn" title="Διαγραφή" onclick="_anodosRemove(\'reward\',' + i + ')">✕</button>' +
      '</div>' +
      '<div class="admin-field" style="margin-top:8px;"><label>Περιγραφή</label>' +
        '<input type="text" class="admin-input an-desc" value="' + _anodosEsc(r.desc) + '" placeholder="Τί κάνει / λόγια θρύλου"/></div>' +
    '</div>';
}

// Read DOM rows back into _anodosData so add/remove never loses in-progress edits.
function _anodosSync() {
  const riddles = [];
  document.querySelectorAll('#anodos-riddles-list .admin-anodos-row').forEach(row => {
    riddles.push({
      q:     row.querySelector('.an-q').value.trim(),
      opts:  [0, 1, 2, 3].map(k => row.querySelector('.an-o' + k).value.trim()),
      a:     parseInt(row.querySelector('.an-a').value, 10) || 0,
      title: row.querySelector('.an-title').value.trim(),
    });
  });
  const rewards = [];
  document.querySelectorAll('#anodos-rewards-list .admin-anodos-row').forEach(row => {
    rewards.push({
      icon: row.querySelector('.an-icon').value.trim() || '✦',
      name: row.querySelector('.an-name').value.trim(),
      desc: row.querySelector('.an-desc').value.trim(),
    });
  });
  _anodosData = { riddles, rewards };
}

function _anodosAddRiddle() { _anodosSync(); _anodosData.riddles.push({ q: '', opts: ['', '', '', ''], a: 0, title: '' }); _anodosRender(); }
function _anodosAddReward() { _anodosSync(); _anodosData.rewards.push({ icon: '✦', name: '', desc: '' }); _anodosRender(); }
function _anodosRemove(kind, i) {
  _anodosSync();
  if (kind === 'riddle') _anodosData.riddles.splice(i, 1);
  else _anodosData.rewards.splice(i, 1);
  _anodosRender();
}

async function adminSaveAnodos() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  _anodosSync();
  const resultEl = document.getElementById('anodos-save-result');
  const btn = document.getElementById('anodos-save-btn');
  // Validate: a riddle needs a question + ≥2 filled options; a reward needs a name.
  const riddles = _anodosData.riddles
    .map(r => ({ q: r.q, opts: (r.opts || []).map(s => String(s || '').trim()), a: r.a | 0, title: r.title || '' }))
    .filter(r => r.q && r.opts.filter(Boolean).length >= 2);
  const rewards = _anodosData.rewards
    .map(r => ({ icon: r.icon || '✦', name: r.name, desc: r.desc || '' }))
    .filter(r => r.name);
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');
  try {
    await firebase.firestore().collection('config').doc('anodos').set({
      riddles, rewards,
      updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy: (typeof currentUser !== 'undefined' && currentUser && currentUser.email) || 'admin',
    });
    // Apply immediately for this session so panel launches pick it up without reload.
    window._anodosConfig = { riddles, rewards };
    _adminResult(resultEl,
      t('✓ Ἀποθηκεύτηκε. ' + riddles.length + ' αἰνίγματα, ' + rewards.length + ' περίαπτα.',
        '✓ Saved. ' + riddles.length + ' riddles, ' + rewards.length + ' rewards.'),
      'success');
  } catch (err) {
    console.error('[admin] save anodos error:', err);
    _adminResult(resultEl, t('Σφάλμα ἀποθήκευσης.', 'Save error.'), 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}
