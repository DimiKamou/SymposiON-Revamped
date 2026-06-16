// ============================================================
//  SymposiON — Static Pages: About, Contact, Feedback
//  Content is stored in Firestore /config/pages document.
// ============================================================

// ── SHARED CONTENT LOADER ──
async function _loadPageContent() {
  try {
    const doc = await firebase.firestore().collection('config').doc('pages').get();
    return doc.exists ? (doc.data() || {}) : {};
  } catch (_) { return {}; }
}

// ──────────────────────────────────────────────
//  ABOUT PAGE
// ──────────────────────────────────────────────
function navToAbout() {
  buildNav('about-nav-wrap', [
    { label: t('Αρχική', 'Home'), action: "goTo('home')" },
    { label: t('Σχετικά με εμάς', 'About us') },
  ]);
  _renderAboutPage();
  goTo('about');
  _navPush({ page: 'about' });
}

async function _renderAboutPage() {
  const pages = await _loadPageContent();
  const c = pages.about || {};
  const title = siteLang === 'en' ? (c.titleEn || c.titleGr || 'About us') : (c.titleGr || 'Σχετικά με εμάς');
  const body  = siteLang === 'en' ? (c.bodyEn  || c.bodyGr  || '') : (c.bodyGr || '');
  const titleEl = document.getElementById('about-page-title');
  const bodyEl  = document.getElementById('about-page-body');
  if (titleEl) titleEl.textContent = title;
  if (bodyEl)  bodyEl.innerHTML = (body || t('Περισσότερες πληροφορίες σύντομα.', 'More information coming soon.')).replace(/\n/g, '<br>');
}

// ──────────────────────────────────────────────
//  CONTACT PAGE
// ──────────────────────────────────────────────
function navToContact() {
  buildNav('contact-nav-wrap', [
    { label: t('Αρχική', 'Home'), action: "goTo('home')" },
    { label: t('Επικοινωνία', 'Contact') },
  ]);
  _renderContactPage();
  goTo('contact');
  _navPush({ page: 'contact' });
}

async function _renderContactPage() {
  const pages = await _loadPageContent();
  const c = pages.contact || {};
  const title = siteLang === 'en' ? (c.titleEn || c.titleGr || 'Contact') : (c.titleGr || 'Επικοινωνία');
  const body  = siteLang === 'en' ? (c.bodyEn  || c.bodyGr  || '') : (c.bodyGr || '');
  const titleEl = document.getElementById('contact-page-title');
  const bodyEl  = document.getElementById('contact-page-body');
  if (titleEl) titleEl.textContent = title;
  if (bodyEl)  bodyEl.innerHTML = (body || t('Επικοινωνήστε μαζί μας.', 'Get in touch with us.')).replace(/\n/g, '<br>');
}

// ──────────────────────────────────────────────
//  FEEDBACK PAGE
// ──────────────────────────────────────────────
function navToFeedback() {
  buildNav('feedback-nav-wrap', [
    { label: t('Αρχική', 'Home'), action: "goTo('home')" },
    { label: t('Σχόλια', 'Feedback') },
  ]);
  _renderFeedbackPage();
  goTo('feedback');
  _navPush({ page: 'feedback' });
}

async function _renderFeedbackPage() {
  const pages = await _loadPageContent();
  const c = pages.feedbackPage || {};
  const title = siteLang === 'en' ? (c.titleEn || c.titleGr || 'Feedback') : (c.titleGr || 'Σχόλια & Προτάσεις');
  const body  = siteLang === 'en' ? (c.bodyEn  || c.bodyGr  || '') : (c.bodyGr || '');
  const titleEl = document.getElementById('feedback-page-title');
  const bodyEl  = document.getElementById('feedback-page-body');
  if (titleEl) titleEl.textContent = title;
  if (bodyEl)  bodyEl.innerHTML = (body || t('Στείλε μας τα σχόλιά σου — τα διαβάζουμε όλα.', 'Send us your thoughts — we read every message.')).replace(/\n/g, '<br>');
  // Reset form state on each navigation
  const form    = document.getElementById('feedback-form');
  const success = document.getElementById('feedback-success');
  if (form)    form.style.display    = '';
  if (success) success.style.display = 'none';
  ['fb-name','fb-email','fb-message'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  const errEl = document.getElementById('feedback-form-error');
  if (errEl) errEl.textContent = '';
}

// ── SUBMIT FEEDBACK ──
async function submitFeedback() {
  const name    = (document.getElementById('fb-name')?.value    || '').trim();
  const email   = (document.getElementById('fb-email')?.value   || '').trim();
  const message = (document.getElementById('fb-message')?.value || '').trim();
  const errEl   = document.getElementById('feedback-form-error');

  if (!message) {
    if (errEl) errEl.textContent = t('Γράψε το μήνυμά σου.', 'Please write your message.');
    return;
  }
  if (errEl) errEl.textContent = '';

  const btn = document.getElementById('fb-submit-btn');
  if (btn) { btn.disabled = true; btn.dataset.origText = btn.textContent; btn.textContent = t('Αποστολή...', 'Sending...'); }

  try {
    await firebase.firestore().collection('feedback').add({
      name:      name  || t('Ανώνυμος', 'Anonymous'),
      email:     email || '',
      message,
      lang:      siteLang,
      uid:       (typeof currentUser !== 'undefined' && currentUser) ? currentUser.uid : null,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    const form    = document.getElementById('feedback-form');
    const success = document.getElementById('feedback-success');
    if (form)    form.style.display    = 'none';
    if (success) success.style.display = '';
  } catch (err) {
    console.error('[feedback] submit error:', err);
    if (errEl) errEl.textContent = t('Σφάλμα αποστολής. Δοκίμασε ξανά.', 'Submission error. Please try again.');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = btn.dataset.origText || t('Αποστολή', 'Send'); }
  }
}

// ──────────────────────────────────────────────
//  ADMIN: PAGE CONTENT EDITOR
// ──────────────────────────────────────────────
function adminShowPageTab(btn, tabId) {
  document.querySelectorAll('.admin-page-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.admin-page-tab-content').forEach(c => { c.style.display = 'none'; });
  btn.classList.add('active');
  const tab = document.getElementById(tabId);
  if (tab) tab.style.display = '';
}

async function _adminLoadPageContent() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  try {
    const doc = await firebase.firestore().collection('config').doc('pages').get();
    const data = doc.exists ? (doc.data() || {}) : {};
    const map = {
      about:        ['about-title-gr','about-title-en','about-body-gr','about-body-en'],
      contact:      ['contact-title-gr','contact-title-en','contact-body-gr','contact-body-en'],
      feedbackPage: ['fbpage-title-gr','fbpage-title-en','fbpage-body-gr','fbpage-body-en'],
    };
    for (const [page, ids] of Object.entries(map)) {
      const c = data[page] || {};
      _setAdminInputVal(ids[0], c.titleGr || '');
      _setAdminInputVal(ids[1], c.titleEn || '');
      _setAdminInputVal(ids[2], c.bodyGr  || '');
      _setAdminInputVal(ids[3], c.bodyEn  || '');
    }
  } catch (err) {
    console.error('[admin] load page content error:', err);
  }
}

function _setAdminInputVal(id, val) {
  const el = document.getElementById(id);
  if (el) el.value = val;
}

async function adminSavePageContent() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  const resultEl = document.getElementById('admin-pages-result');
  const btn = document.querySelector('#admin-pages-form .admin-action-btn');
  _adminSetLoading(btn, true);
  _adminResult(resultEl, '', '');

  try {
    const pages = {
      about: {
        titleGr: (document.getElementById('about-title-gr')?.value   || '').trim(),
        titleEn: (document.getElementById('about-title-en')?.value   || '').trim(),
        bodyGr:  (document.getElementById('about-body-gr')?.value    || '').trim(),
        bodyEn:  (document.getElementById('about-body-en')?.value    || '').trim(),
      },
      contact: {
        titleGr: (document.getElementById('contact-title-gr')?.value || '').trim(),
        titleEn: (document.getElementById('contact-title-en')?.value || '').trim(),
        bodyGr:  (document.getElementById('contact-body-gr')?.value  || '').trim(),
        bodyEn:  (document.getElementById('contact-body-en')?.value  || '').trim(),
      },
      feedbackPage: {
        titleGr: (document.getElementById('fbpage-title-gr')?.value  || '').trim(),
        titleEn: (document.getElementById('fbpage-title-en')?.value  || '').trim(),
        bodyGr:  (document.getElementById('fbpage-body-gr')?.value   || '').trim(),
        bodyEn:  (document.getElementById('fbpage-body-en')?.value   || '').trim(),
      },
    };
    await firebase.firestore().collection('config').doc('pages').set(pages, { merge: true });
    _adminResult(resultEl, t('✓ Αποθηκεύτηκε.', '✓ Saved.'), 'success');
  } catch (err) {
    console.error('[admin] save page content error:', err);
    _adminResult(resultEl, t('Σφάλμα αποθήκευσης.', 'Save error.'), 'error');
  } finally {
    _adminSetLoading(btn, false);
  }
}

// ──────────────────────────────────────────────
//  ADMIN: FEEDBACK INBOX
// ──────────────────────────────────────────────
async function _adminLoadFeedback() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  const listEl = document.getElementById('admin-feedback-items');
  if (!listEl) return;
  listEl.innerHTML = `<div class="admin-codes-loading">${t('Φόρτωση...', 'Loading...')}</div>`;

  try {
    const snap = await firebase.firestore()
      .collection('feedback')
      .orderBy('createdAt', 'desc')
      .limit(30)
      .get();

    if (snap.empty) {
      listEl.innerHTML = `<div class="admin-codes-empty">${t('Δεν υπάρχουν σχόλια ακόμα.', 'No feedback submitted yet.')}</div>`;
      return;
    }

    listEl.innerHTML = snap.docs.map(d => {
      const fb = d.data();
      const date = fb.createdAt?.toDate ? fb.createdAt.toDate().toLocaleDateString('el-GR') : '—';
      return `
        <div class="admin-feedback-item">
          <div class="admin-feedback-meta">
            <span class="admin-feedback-name">${_escFb(fb.name || '—')}</span>
            ${fb.email ? `<a class="admin-feedback-email" href="mailto:${_escFb(fb.email)}">${_escFb(fb.email)}</a>` : ''}
            <span class="admin-feedback-date">${date}</span>
          </div>
          <div class="admin-feedback-msg">${_escFb(fb.message || '')}</div>
          <button class="admin-del-btn" onclick="adminDeleteFeedback('${d.id}')">✕</button>
        </div>
      `;
    }).join('');
  } catch (err) {
    console.error('[admin] load feedback error:', err);
    listEl.innerHTML = `<div class="admin-codes-empty">${t('Σφάλμα φόρτωσης.', 'Load error.')}</div>`;
  }
}

function _escFb(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

async function adminDeleteFeedback(id) {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  if (!confirm(t('Διαγραφή σχολίου;', 'Delete this feedback?'))) return;
  try {
    await firebase.firestore().collection('feedback').doc(id).delete();
    showToast(t('Διαγράφηκε.', 'Deleted.'), 'Deleted.');
    _adminLoadFeedback();
  } catch (err) {
    console.error('[admin] delete feedback error:', err);
    showToast(t('Σφάλμα διαγραφής.', 'Delete error.'), 'Delete error.');
  }
}
