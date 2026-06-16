// ============================================================
//  SymposiON — app.js  v2.1
//  Central application layer — loaded after firebase-config.js
//  ──────────────────────────────────────────────────────────
//  · Theme Engine   (setSymTheme / toggleThemePicker)
//  · Version Guard  (Firestore version check → cache-bust modal)
//  · Grace Period   (3-day subscription buffer)
//  · GameplayBatch  (anti-throttle / anti-cheat write coalescing)
//  · SymphoniToast  (typed notification bridge)
//  · Subscription Sync (manual ledger handshake)
//  · Workspace Tabs (game-modes-hub ↔ theory-library-hub switch)
// ============================================================
'use strict';

/* ── LOCAL APP VERSION ─────────────────────────────────────── */
const APP_VERSION = '2.1.0'; // bump on each deployment push

/* ─── Shared: suppress all transitions for exactly two frames ───────── */
function _freezeTransitions() {
  if (document.getElementById('_themeFreeze')) return;
  const style = document.createElement('style');
  style.id = '_themeFreeze';
  style.textContent = '*, *::before, *::after { transition: none !important; animation: none !important; }';
  document.head.appendChild(style);
  requestAnimationFrame(() => { requestAnimationFrame(() => { style.remove(); }); });
}

/* ═══════════════════════════════════════════════════════════
   THEME ENGINE
   Manages: body[data-sym-theme], localStorage persistence,
   picker panel open/close, active-option marking.
═══════════════════════════════════════════════════════════ */
;(function _installThemeEngine() {

  const VALID = [
    // Classic
    'hearth', 'amphora', 'aegean',
    // Base
    'alabaster', 'obsidian',
    // Obsidian seasonal
    'obsidian-katabasis', 'obsidian-solstice', 'obsidian-bloom', 'obsidian-revel',
    // Alabaster seasonal
    'alabaster-asphodel', 'alabaster-noel', 'alabaster-anastasi', 'alabaster-apokries',
    // Vivid
    'venetian', 'olive', 'rose', 'saffron', 'amethyst', 'cyprus', 'coral', 'porphyry',
    // Locked (included so FOUC-prevention can restore them)
    'tyrian', 'golden-fleece', 'orphic', 'elysium',
    // Legacy (keep for stored prefs)
    'marble', 'onyx-gold',
  ];

  const LOCKED = ['tyrian', 'golden-fleece', 'orphic', 'elysium'];

  const KEY = 'symposion_theme';

  const SWATCHES = {
    'hearth':              '#D97B5C',
    'marble':              '#CE6B4A',
    'amphora':             '#D14A1F',
    'aegean':              '#E0894C',
    'alabaster':           '#C5572F',
    'obsidian':            '#C87830',
    'onyx-gold':           '#C87A28',
    'obsidian-katabasis':  '#ED7A28',
    'obsidian-solstice':   '#C23A2E',
    'obsidian-bloom':      '#84B86E',
    'obsidian-revel':      '#E3BB4B',
    'alabaster-asphodel':  '#C8631E',
    'alabaster-noel':      '#B5302A',
    'alabaster-anastasi':  '#D9694F',
    'alabaster-apokries':  '#C23A8C',
    'venetian':            '#D4499A',
    'olive':               '#8AA84E',
    'rose':                '#E36A98',
    'saffron':             '#E8862A',
    'amethyst':            '#9B6FD6',
    'cyprus':              '#2FA89A',
    'coral':               '#E37A5C',
    'porphyry':            '#B0395A',
    'tyrian':              '#9C3D9E',
    'golden-fleece':       '#F0C24A',
    'orphic':              '#8E7FD6',
    'elysium':             '#7FAE84',
  };

  const LABELS = {
    'hearth':              ['Hearth',          'Warm dark · Terra'],
    'marble':              ['Marble',           'Dusty day'],
    'amphora':             ['Amphora',          'Black figure · Attic red'],
    'aegean':              ['Aegean',           'Midnight sea · Copper'],
    'alabaster':           ['Alabaster',        'Pentelic marble'],
    'obsidian':            ['Obsidian',         'Black · Gold'],
    'onyx-gold':           ['Onyx-Gold',        'OLED black · Orange'],
    'obsidian-katabasis':  ['Katabasis',        'Obsidian · Halloween'],
    'obsidian-solstice':   ['Solstice',         'Obsidian · Christmas'],
    'obsidian-bloom':      ['Nocturne Bloom',   'Obsidian · Easter'],
    'obsidian-revel':      ['Gilded Revel',     'Obsidian · Carnival'],
    'alabaster-asphodel':  ['Pale Asphodel',    'Alabaster · Halloween'],
    'alabaster-noel':      ['Marble Noël',      'Alabaster · Christmas'],
    'alabaster-anastasi':  ['Anastasi',         'Alabaster · Easter'],
    'alabaster-apokries':  ['Marble Apokries',  'Alabaster · Carnival'],
    'venetian':            ['Venetian',         'Purple · Gold · Magenta'],
    'olive':               ['Olive Grove',      'Green · Gold'],
    'rose':                ['Rose Symposium',   'Pink · Amber'],
    'saffron':             ['Saffron',          'Orange · Amber'],
    'amethyst':            ['Amethyst',         'Violet · Rose'],
    'cyprus':              ['Cyprus Teal',      'Teal · Brass'],
    'coral':               ['Coral Aegean',     'Coral · Sea blue'],
    'porphyry':            ['Porphyry',         'Oxblood · Plum'],
    'tyrian':              ['Tyrian Purple',    'The murex dye'],
    'golden-fleece':       ['Golden Fleece',    'Pure radiant gold'],
    'orphic':              ['Orphic Night',     'Black · Iridescent'],
    'elysium':             ['Elysium',          'Pastel · Gold green'],
  };

  window.isThemeUnlocked = function isThemeUnlocked(id) {
    if (!LOCKED.includes(id)) return true;
    try {
      return (JSON.parse(localStorage.getItem('symposion_unlocked') || '[]')).includes(id);
    } catch { return false; }
  };

  window.setSymTheme = function setSymTheme(name) {
    if (!VALID.includes(name)) name = 'hearth';

    // Locked guard
    if (LOCKED.includes(name) && !window.isThemeUnlocked(name)) {
      if (typeof window.symphoniToast === 'function') {
        window.symphoniToast('🔒 Αυτό το θέμα είναι κλειδωμένο', 'info');
      }
      return;
    }

    _freezeTransitions();

    // Apply to both html and body so :root selectors resolve
    document.documentElement.dataset.symTheme = name;
    document.body.dataset.symTheme            = name;
    localStorage.setItem(KEY, name);

    // Indicator dot colour
    const dot = document.getElementById('theme-dot');
    if (dot) dot.style.background = SWATCHES[name] || '#D97B5C';

    // Update picker header
    const lbl = LABELS[name] || [name, ''];
    const hn = document.getElementById('tp-current-name');
    const hs = document.getElementById('tp-current-sub');
    if (hn) hn.textContent = lbl[0];
    if (hs) hs.textContent = lbl[1];

    // Mark the active option button
    document.querySelectorAll('.theme-opt[data-theme]').forEach(btn => {
      btn.classList.toggle('theme-opt--active', btn.dataset.theme === name);
    });

    // Close the picker panel
    const panel = document.getElementById('theme-panel');
    if (panel) panel.hidden = true;
  };

  window.toggleThemePicker = function toggleThemePicker() {
    const panel = document.getElementById('theme-panel');
    if (!panel) return;
    panel.hidden = !panel.hidden;
  };

  // Dismiss on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('#theme-picker')) {
      const panel = document.getElementById('theme-panel');
      if (panel) panel.hidden = true;
    }
  }, true);

  // FOUC-prevention: apply saved theme synchronously before first paint
  const saved = localStorage.getItem(KEY);
  if (saved && VALID.includes(saved)) {
    document.documentElement.dataset.symTheme = saved;
    document.body.dataset.symTheme            = saved;
    // Full apply (dot + active state) once DOM is ready
    const applyFull = () => window.setSymTheme(saved);
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', applyFull, { once: true });
    } else {
      requestAnimationFrame(applyFull);
    }
  }
})();

/* ═══════════════════════════════════════════════════════════
   SEASON ENGINE
   User-controlled — persisted in localStorage.
   Applies a season-* class to body; seasons layer on top of
   any active palette theme without touching it.
═══════════════════════════════════════════════════════════ */
;(function _installSeasonEngine() {
  const SEASONS = ['halloween', 'christmas', 'easter', 'carnival'];
  const KEY = 'symposion_season';

  // Seasonal combo themes that bake a season into their palette
  const SEASONAL_COMBOS = [
    'obsidian-katabasis', 'obsidian-solstice', 'obsidian-bloom', 'obsidian-revel',
    'alabaster-asphodel', 'alabaster-noel', 'alabaster-anastasi', 'alabaster-apokries',
  ];

  function _markActive(name) {
    // Match picker season buttons by data-season attribute
    document.querySelectorAll('.season-opt[data-season]').forEach(btn => {
      btn.classList.toggle('theme-opt--active', btn.dataset.season === (name || ''));
    });
  }

  window.setSymSeason = function setSymSeason(name) {
    _freezeTransitions();
    // If a combo theme is active, revert to its base before applying a standalone season
    if (name && SEASONS.includes(name)) {
      const cur = document.body.getAttribute('data-sym-theme') || '';
      if (SEASONAL_COMBOS.includes(cur)) {
        const base = cur.startsWith('obsidian-') ? 'obsidian' : 'alabaster';
        window.setSymTheme(base);
      }
    }
    SEASONS.forEach(s => document.body.classList.remove('season-' + s));
    if (name && SEASONS.includes(name)) {
      document.body.classList.add('season-' + name);
      localStorage.setItem(KEY, name);
      // Mutual exclusion: deactivate all palette theme buttons — only season shows active
      document.querySelectorAll('.theme-opt[data-theme]').forEach(btn => {
        btn.classList.remove('theme-opt--active');
      });
    } else {
      localStorage.removeItem(KEY);
      // Restoring "none": reactivate the currently applied palette theme button
      const cur = document.documentElement.dataset.symTheme || document.body.dataset.symTheme || '';
      if (cur) {
        document.querySelectorAll('.theme-opt[data-theme]').forEach(btn => {
          btn.classList.toggle('theme-opt--active', btn.dataset.theme === cur);
        });
      }
    }
    _markActive(name);
    const panel = document.getElementById('theme-panel');
    if (panel) panel.hidden = true;
  };

  // Restore saved season on load
  const saved = localStorage.getItem(KEY);
  if (saved && SEASONS.includes(saved)) {
    document.body.classList.add('season-' + saved);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => _markActive(saved || ''), { once: true });
  } else {
    requestAnimationFrame(() => _markActive(saved || ''));
  }
})();

/* ═══════════════════════════════════════════════════════════
   WORKSPACE TAB SWITCHER
   Flips between #game-modes-hub and #theory-library-hub
   on the subject page.
═══════════════════════════════════════════════════════════ */
window.switchWorkspaceTab = function switchWorkspaceTab(hub) {
  ['games', 'theory'].forEach(id => {
    const tabEl  = document.getElementById('ws-tab-' + id);
    const hubEl  = document.getElementById(id === 'games' ? 'game-modes-hub' : 'theory-library-hub');
    const active = id === hub;
    tabEl?.classList.toggle('ws-tab-active', active);
    if (hubEl) {
      hubEl.classList.toggle('ws-active', active);
      hubEl.hidden = !active;
    }
  });
};

/* ═══════════════════════════════════════════════════════════
   SYMPHONI NOTIFICATION BRIDGE
   showSymphoniToast(type, msgGr, msgEn?)
   type: 'success' | 'error' | 'warning' | 'info'
   'success' → moss-green  |  'error' → terracotta
═══════════════════════════════════════════════════════════ */
window.showSymphoniToast = function showSymphoniToast(type, msgGr, msgEn) {
  // Remove any existing toast
  document.getElementById('sym-notify-toast')?.remove();

  const lang = (typeof siteLang !== 'undefined') ? siteLang : 'gr';
  const text = (lang === 'en' && msgEn) ? msgEn : (msgGr || msgEn || '');

  const ICONS = { success: '✓', error: '✕', warning: '⚠', info: 'ℹ' };

  const el = document.createElement('div');
  el.id        = 'sym-notify-toast';
  el.className = `sym-notify-toast sym-notify-toast--${type || 'info'}`;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  el.innerHTML =
    `<span class="snt-icon" aria-hidden="true">${ICONS[type] || 'ℹ'}</span>` +
    `<span class="snt-text">${text}</span>`;

  document.body.appendChild(el);
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('snt-visible')));

  const delay = type === 'error' ? 4200 : 3000;
  setTimeout(() => {
    el.classList.remove('snt-visible');
    setTimeout(() => el.remove(), 380);
  }, delay);
};

/* ═══════════════════════════════════════════════════════════
   APP VERSION GUARD
   Reads Firestore /config/app → current_version.
   If it differs from APP_VERSION, blocks execution and shows
   a non-dismissable reload modal.
═══════════════════════════════════════════════════════════ */
window._checkAppVersion = async function _checkAppVersion() {
  const SESS_KEY = 'sym_version_checked';
  if (sessionStorage.getItem(SESS_KEY)) return;
  sessionStorage.setItem(SESS_KEY, '1');

  try {
    if (typeof firebase === 'undefined') return;
    const snap = await firebase.firestore().collection('config').doc('app').get();
    if (!snap.exists) return;
    const remote = snap.data()?.current_version;
    if (remote && remote !== APP_VERSION) _showVersionModal();
  } catch (_) {
    // Network failure — skip silently
  }
};

function _showVersionModal() {
  if (document.getElementById('sym-version-modal')) return;

  const modal = document.createElement('div');
  modal.id        = 'sym-version-modal';
  modal.className = 'sym-version-modal';
  modal.setAttribute('role', 'alertdialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Διαθέσιμη ενημέρωση SymposiON');
  modal.innerHTML = `
    <div class="sym-vm-backdrop" aria-hidden="true"></div>
    <div class="sym-vm-box">
      <div class="sym-vm-bolt" aria-hidden="true">⚡</div>
      <h2 class="sym-vm-title">Το SymposiON ενημερώθηκε!</h2>
      <p class="sym-vm-body">
        Μια νέα έκδοση είναι διαθέσιμη. Ανανέωσε για να
        αποκτήσεις πρόσβαση σε όλες τις νέες δυνατότητες.
      </p>
      <button class="sym-vm-btn" onclick="window.location.reload(true)">
        🔄 Ανανέωση Τώρα
      </button>
    </div>`;

  document.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('sym-vm-visible'));
}

/* ═══════════════════════════════════════════════════════════
   SUBSCRIPTION GRACE PERIOD
   checkSubscriptionGrace(expiresAt) → 'valid' | 'grace' | 'expired'
   expiresAt: Firestore Timestamp | JS Date | null
   Shows a dismissable banner during the 3-day grace window.
═══════════════════════════════════════════════════════════ */
const _GRACE_DAYS = 3;

window.checkSubscriptionGrace = function checkSubscriptionGrace(expiresAt) {
  if (!expiresAt) return 'valid';   // no expiry = perpetual / admin

  const now   = Date.now();
  const expMs = expiresAt?.toDate?.()?.getTime?.()
             ?? expiresAt?.getTime?.()
             ?? (typeof expiresAt === 'number' ? expiresAt : 0);

  if (now < expMs) return 'valid';

  const graceEnd = expMs + _GRACE_DAYS * 24 * 3600 * 1000;
  if (now < graceEnd) {
    const daysLeft = Math.max(1, Math.ceil((graceEnd - now) / (24 * 3600 * 1000)));
    _showGraceBanner(daysLeft);
    return 'grace';
  }

  return 'expired';
};

function _showGraceBanner(daysLeft) {
  if (document.getElementById('sym-grace-banner')) return;

  const banner = document.createElement('div');
  banner.id        = 'sym-grace-banner';
  banner.className = 'sym-grace-banner';
  banner.setAttribute('role', 'alert');
  banner.innerHTML = `
    <span class="sgb-icon" aria-hidden="true">⚠</span>
    <span class="sgb-text">
      Η συνδρομή σου έληξε. Έχεις
      <strong>${daysLeft} ${daysLeft === 1 ? 'μέρα' : 'μέρες'}</strong>
      περίοδο χάριτος.
      <button class="sgb-cta"
        onclick="if(typeof navToSubscribe==='function')navToSubscribe()">
        Ανανέωσε τώρα →
      </button>
    </span>
    <button class="sgb-close"
            onclick="document.getElementById('sym-grace-banner')?.remove()"
            aria-label="Κλείσιμο">✕</button>`;

  // Insert after site banners wrap (if it exists) or at body top
  const anchor = document.getElementById('site-banners-wrap');
  if (anchor) anchor.insertAdjacentElement('afterend', banner);
  else document.body.prepend(banner);
}

/* ═══════════════════════════════════════════════════════════
   GAMEPLAY TRANSACTION BATCHER
   Accumulates all game events in memory.
   Commits ONE consolidated Firestore write on terminal state.
   Anti-cheat: rejects submissions with <0.5 s / answer.
═══════════════════════════════════════════════════════════ */
window.GameplayBatch = (function () {
  'use strict';

  let _gameId  = null;
  let _active  = false;
  let _startTs = 0;
  let _scores  = null;

  function _fresh() {
    return { correct: 0, wrong: 0, livesLost: 0, maxLevel: 0, xp: 0, drachmas: 0 };
  }

  return {
    /**
     * begin(gameId) — call at game-start.
     */
    begin(gameId) {
      _gameId  = String(gameId ?? 'unknown');
      _active  = true;
      _startTs = Date.now();
      _scores  = _fresh();
    },

    /**
     * record(type, data?) — log a game event.
     * type: 'correct' | 'wrong' | 'life_lost' | 'level_up'
     */
    record(type, data = {}) {
      if (!_active || !_scores) return;
      if (type === 'correct')   _scores.correct++;
      if (type === 'wrong')     _scores.wrong++;
      if (type === 'life_lost') _scores.livesLost++;
      if (type === 'level_up')  _scores.maxLevel = Math.max(_scores.maxLevel, data.level ?? 0);
    },

    /**
     * commit(terminal, { xp, drachmas }) — call on game-over / level-clear.
     * terminal: 'level_cleared' | 'game_over'
     * Awards rewards and writes one Firestore document.
     */
    async commit(terminal, { xp = 0, drachmas = 0 } = {}) {
      if (!_active) return;
      _active = false;
      if (!_scores) return;

      _scores.xp       = xp;
      _scores.drachmas = drachmas;

      const elapsedMs = Date.now() - _startTs;
      const total     = _scores.correct + _scores.wrong;

      // Anti-cheat: require at least 0.5 s per answer on runs with >3 answers
      if (total > 3 && elapsedMs / total < 500) {
        console.warn('[GameplayBatch] Anti-cheat: submission rate too fast — blocked.');
        if (typeof showSymphoniToast === 'function') {
          showSymphoniToast('error', 'Μη έγκυρη υποβολή.', 'Invalid submission.');
        }
        _scores = null;
        _gameId = null;
        return;
      }

      // Award progression rewards — prefer the config-driven Temple engine
      // (per-game params in config/realm, with weekly cap + first-clear bonus);
      // fall back to the caller's flat xp/drachmas if it isn't available.
      let _awarded = { xp: xp, drachmas: drachmas };
      try {
        if (typeof awardGameRewards === 'function' && _gameId && _gameId !== 'unknown') {
          const res = await awardGameRewards(_gameId, { score: _scores.correct, perfect: _scores.wrong === 0 && total > 0 });
          if (res) _awarded = res;
        } else if ((xp > 0 || drachmas > 0) && typeof awardRewards === 'function') {
          await awardRewards(xp, drachmas);
        }
      } catch (_) {}
      _scores.xp = _awarded.xp; _scores.drachmas = _awarded.drachmas;

      // Single consolidated Firestore write
      const user = (typeof currentUser !== 'undefined') ? currentUser : null;
      if (user && terminal) {
        try {
          await firebase.firestore().collection('gameplay_logs').add({
            uid:        user.uid,
            gameId:     _gameId,
            terminal,
            elapsedSec: Math.round(elapsedMs / 1000),
            ..._scores,
            ts: firebase.firestore.FieldValue.serverTimestamp(),
          });
        } catch (_) { /* non-critical — never block UX */ }
      }

      _scores = null;
      _gameId = null;
    },

    /** cancel() — call when user exits mid-game without completing. */
    cancel() {
      _active = false;
      _scores = null;
      _gameId = null;
    },

    /** isActive() — true while a batch session is open. */
    isActive: () => _active,
  };
})();

/* ═══════════════════════════════════════════════════════════
   SUBSCRIPTION SYNC
   Manual handshake to refresh subscription ledger roles.
   Button: #sync-sub-btn (injected by progression.js)
═══════════════════════════════════════════════════════════ */
window.syncSubscription = async function syncSubscription() {
  const user = (typeof currentUser !== 'undefined') ? currentUser : null;
  if (!user) {
    showSymphoniToast('error', 'Πρέπει να συνδεθείς πρώτα.', 'Please sign in first.');
    return;
  }

  const btn = document.getElementById('sync-sub-btn');
  if (btn) { btn.disabled = true; btn.textContent = '…'; }

  try {
    const callFn = firebase.functions().httpsCallable('syncSubscription');
    await callFn({ uid: user.uid });
    showSymphoniToast('success', '✓ Συνδρομή συγχρονίστηκε!', '✓ Subscription synced!');
    // Refresh billing UI if profile is open
    if (typeof _hjLoadBillingSection === 'function') _hjLoadBillingSection();
  } catch (err) {
    showSymphoniToast('error', 'Σφάλμα συγχρονισμού. Δοκίμασε ξανά.', 'Sync failed. Try again.');
    console.warn('[syncSubscription]', err);
  } finally {
    if (btn) {
      btn.disabled    = false;
      btn.textContent = '🔄 Συγχρονισμός Συνδρομής';
    }
  }
};

/* ═══════════════════════════════════════════════════════════
   ADMIN ASSET STUDIO
   Renders color picker, icon library pool, and SVG/file
   upload engine inside the admin Asset Studio tab.
═══════════════════════════════════════════════════════════ */
window._adminRenderAssetStudio = function _adminRenderAssetStudio() {
  const container = document.getElementById('admin-asset-studio-content');
  if (!container) return;

  const PRESET_ICONS = [
    '📚','🏛️','⚔️','🛡️','🏺','🦁','🦉','🐉','⚡','🌊',
    '🔱','🌿','⭐','🎭','🗡️','🏹','🔥','💎','🌙','☀️',
    '📜','🎓','🧠','🎨','🔬','🌍','🎵','🏆','✨','🎯',
  ];

  container.innerHTML = `
    <!-- ── Color Customizer ── -->
    <div class="asset-studio-section">
      <div class="asset-studio-label">🎨 Χρώμα Κάρτας / Card Colour</div>
      <div class="asset-color-row">
        <input type="color" class="asset-color-input" id="asset-color-picker" value="#1C1814"
               oninput="document.getElementById('asset-color-hex').value=this.value"
               onchange="_assetApplyColor(this.value)"/>
        <input type="text"  class="asset-color-hex" id="asset-color-hex" value="#1C1814"
               maxlength="7" placeholder="#rrggbb"
               oninput="if(/^#[0-9a-fA-F]{6}$/.test(this.value)){document.getElementById('asset-color-picker').value=this.value;_assetApplyColor(this.value);}"/>
        <button class="asset-file-btn" onclick="_assetApplyColor(document.getElementById('asset-color-hex').value)">
          Εφαρμογή
        </button>
      </div>
      <div id="asset-color-preview" class="asset-color-preview" style="display:none;"></div>
    </div>

    <!-- ── Icon Library Pool ── -->
    <div class="asset-studio-section">
      <div class="asset-studio-label">🖼 Βιβλιοθήκη Εικονιδίων / Icon Library</div>
      <div class="asset-icon-grid" id="asset-icon-grid">
        ${PRESET_ICONS.map(ic =>
          `<div class="asset-icon-cell" title="${ic}" onclick="_assetSelectIcon('${ic}')">${ic}</div>`
        ).join('')}
      </div>
      <div id="asset-selected-icon" style="display:none;font-size:11px;font-family:'Raleway',sans-serif;color:var(--text-subtle);margin-top:4px;">
        Επιλεγμένο: <strong id="asset-icon-display"></strong>
      </div>
    </div>

    <!-- ── SVG / File Upload ── -->
    <div class="asset-studio-section">
      <div class="asset-studio-label">⬆ Ανέβασμα Εικονιδίου / Upload Icon</div>

      <textarea class="asset-svg-textarea" id="asset-svg-input"
                placeholder="Επικόλλησε raw SVG markup εδώ (<svg>…</svg>)…"
                rows="4"></textarea>

      <div class="asset-file-input-wrap">
        <input type="file" id="asset-file-input" accept=".svg,.png,.webp,image/svg+xml,image/png,image/webp"
               style="display:none" onchange="_assetHandleFileSelect(this)"/>
        <button class="asset-file-btn" onclick="document.getElementById('asset-file-input').click()">
          📁 Επιλογή Αρχείου (.svg/.png/.webp)
        </button>
        <span id="asset-file-name" style="font-family:'Raleway',sans-serif;font-size:11px;color:var(--text-subtle);">
          Δεν επιλέχθηκε αρχείο
        </span>
      </div>

      <div style="margin-top:0.75rem;display:flex;gap:0.75rem;align-items:center;flex-wrap:wrap;">
        <input type="text" class="asset-color-hex" id="asset-icon-key"
               placeholder="Κλειδί αποθήκευσης (π.χ. my-icon)"
               style="max-width:220px;"/>
        <button class="asset-upload-btn" id="asset-upload-btn"
                onclick="_assetUploadIcon()">
          ⬆ Ανέβασμα στο Firebase
        </button>
      </div>
      <div id="asset-upload-result" style="margin-top:0.5rem;font-family:'Raleway',sans-serif;font-size:12px;"></div>
    </div>

    <!-- ── Stored Icons ── -->
    <div class="asset-studio-section">
      <div class="asset-studio-label">📦 Αποθηκευμένα Εικονίδια</div>
      <div class="asset-icon-grid" id="asset-stored-grid">
        <div style="font-family:'Raleway',sans-serif;font-size:12px;color:var(--text-subtle);padding:8px;">
          Φόρτωση…
        </div>
      </div>
    </div>
  `;

  _assetLoadStoredIcons();
};

let _assetSelectedIcon = null;
let _assetSelectedFile = null;

window._assetSelectIcon = function _assetSelectIcon(icon) {
  _assetSelectedIcon = icon;
  document.querySelectorAll('.asset-icon-cell').forEach(c =>
    c.classList.toggle('selected', c.textContent.trim() === icon)
  );
  const wrap = document.getElementById('asset-selected-icon');
  const disp = document.getElementById('asset-icon-display');
  if (wrap) wrap.style.display = 'block';
  if (disp) disp.textContent = icon;
};

window._assetApplyColor = function _assetApplyColor(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return;
  const preview = document.getElementById('asset-color-preview');
  if (preview) {
    preview.style.display = 'flex';
    preview.style.background = `linear-gradient(135deg, ${hex}, ${hex}dd)`;
    preview.innerHTML = `<span style="font-size:11px;font-family:'Raleway',sans-serif;color:#fff;padding:6px 12px;opacity:0.85;">${hex}</span>`;
  }
};

window._assetHandleFileSelect = function _assetHandleFileSelect(input) {
  const file = input?.files?.[0];
  if (!file) return;
  _assetSelectedFile = file;
  const nameEl = document.getElementById('asset-file-name');
  if (nameEl) nameEl.textContent = file.name;
};

window._assetUploadIcon = async function _assetUploadIcon() {
  const resultEl = document.getElementById('asset-upload-result');
  const btn      = document.getElementById('asset-upload-btn');
  const keyInput = document.getElementById('asset-icon-key');
  const svgInput = document.getElementById('asset-svg-input');

  const key = keyInput?.value?.trim().replace(/[^a-z0-9_-]/gi, '-');
  if (!key) {
    if (resultEl) { resultEl.style.color = '#c0574a'; resultEl.textContent = 'Συμπλήρωσε κλειδί αποθήκευσης.'; }
    return;
  }

  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  if (resultEl) { resultEl.style.color = ''; resultEl.textContent = 'Ανέβασμα…'; }

  try {
    let downloadURL = null;

    if (_assetSelectedFile) {
      // File upload → Firebase Storage
      const ref = firebase.storage().ref(`system_icons/${key}`);
      await ref.put(_assetSelectedFile, { contentType: _assetSelectedFile.type });
      downloadURL = await ref.getDownloadURL();
    } else if (svgInput?.value?.trim().startsWith('<svg')) {
      // Inline SVG → store as Firestore field
      await firebase.firestore().collection('config').doc('system_icons')
        .set({ [key]: { type: 'svg', markup: svgInput.value.trim(), updatedAt: firebase.firestore.FieldValue.serverTimestamp() } }, { merge: true });
      if (resultEl) { resultEl.style.color = '#7fc96f'; resultEl.textContent = `✓ SVG "${key}" αποθηκεύτηκε.`; }
      _assetLoadStoredIcons();
      return;
    } else {
      if (resultEl) { resultEl.style.color = '#c0574a'; resultEl.textContent = 'Επίλεξε αρχείο ή συμπλήρωσε SVG markup.'; }
      return;
    }

    // Persist URL to Firestore
    await firebase.firestore().collection('config').doc('system_icons')
      .set({ [key]: { type: 'url', url: downloadURL, updatedAt: firebase.firestore.FieldValue.serverTimestamp() } }, { merge: true });

    if (resultEl) {
      resultEl.style.color = '#7fc96f';
      resultEl.innerHTML   = `✓ Ανέβηκε: <a href="${downloadURL}" target="_blank" style="color:var(--text-core);">${key}</a>`;
    }
    _assetLoadStoredIcons();
    if (typeof showSymphoniToast === 'function') showSymphoniToast('success', `✓ Εικονίδιο "${key}" ανέβηκε!`);
  } catch (err) {
    if (resultEl) { resultEl.style.color = '#c0574a'; resultEl.textContent = 'Σφάλμα ανεβάσματος: ' + (err.message || ''); }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = '⬆ Ανέβασμα στο Firebase'; }
  }
};

async function _assetLoadStoredIcons() {
  const grid = document.getElementById('asset-stored-grid');
  if (!grid) return;
  try {
    const snap = await firebase.firestore().collection('config').doc('system_icons').get();
    if (!snap.exists || !snap.data()) {
      grid.innerHTML = '<div style="font-family:\'Raleway\',sans-serif;font-size:12px;color:var(--text-subtle);padding:8px;">Δεν υπάρχουν αποθηκευμένα εικονίδια.</div>';
      return;
    }
    const data = snap.data();
    const entries = Object.entries(data);
    if (!entries.length) { grid.innerHTML = '<div style="font-family:\'Raleway\',sans-serif;font-size:12px;color:var(--text-subtle);padding:8px;">Κανένα εικονίδιο ακόμα.</div>'; return; }

    grid.innerHTML = entries.map(([k, v]) => {
      const inner = v.type === 'url'
        ? `<img src="${v.url}" alt="${k}" style="width:32px;height:32px;object-fit:contain;"/>`
        : `<span style="font-size:11px;font-family:'JetBrains Mono',monospace;color:var(--text-subtle);">&lt;svg&gt;</span>`;
      return `<div class="asset-icon-cell" title="${k}" onclick="navigator.clipboard?.writeText('${k}')" style="position:relative;">
        ${inner}
        <span style="position:absolute;bottom:2px;left:0;right:0;text-align:center;font-size:8px;font-family:'Raleway',sans-serif;color:var(--text-subtle);overflow:hidden;white-space:nowrap;text-overflow:ellipsis;padding:0 2px;">${k}</span>
      </div>`;
    }).join('');
  } catch (_) {
    grid.innerHTML = '<div style="font-family:\'Raleway\',sans-serif;font-size:12px;color:#c0574a;padding:8px;">Σφάλμα φόρτωσης.</div>';
  }
}

/* ═══════════════════════════════════════════════════════════
   ADMIN TIER MANAGEMENT HELPERS
   Enhanced tier row builder: adds Status toggle + Duration
═══════════════════════════════════════════════════════════ */
window._adminBuildTierRow = function _adminBuildTierRow({ id, icon, label, meta, tier, type, active = true }) {
  const mkTierBtn = (t, lbl) =>
    `<button class="tr-t-btn${tier === t ? ' active' : ''}" data-tier="${t}"
       onclick="_trSetTier('${id}','${t}',this,'${type}')">${lbl}</button>`;

  const toggleId = `tier-active-${type}-${id}`;
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
        <div style="display:flex;align-items:center;gap:0.75rem;flex-wrap:wrap;">
          <label class="admin-tier-toggle" title="Ενεργό / Ανενεργό">
            <input type="checkbox" ${active ? 'checked' : ''}
                   id="${toggleId}"
                   onchange="_adminToggleTierActive('${id}','${type}',this)"/>
            <span class="admin-tier-toggle-track"></span>
          </label>
          <div class="tr-tier-sel" id="tr-sel-${type}-${id}">
            ${mkTierBtn('free', 'Free')}${mkTierBtn('student', 'Student')}${mkTierBtn('teacher', 'Teacher')}
          </div>
        </div>
      </div>
    </div>`;
};

window._adminToggleTierActive = async function _adminToggleTierActive(id, type, checkbox) {
  const active = !!checkbox?.checked;
  try {
    const field = type === 'ds' ? 'datasetActive' : 'engineActive';
    await firebase.firestore().collection('config').doc('game-tiers')
      .set({ [field]: { [id]: active } }, { merge: true });
    if (typeof showSymphoniToast === 'function') {
      showSymphoniToast('success', `${id} ${active ? 'ενεργοποιήθηκε' : 'απενεργοποιήθηκε'}.`);
    }
  } catch (err) {
    console.error('[adminToggleTierActive]', err);
    if (checkbox) checkbox.checked = !active; // revert on error
  }
};

/* ═══════════════════════════════════════════════════════════
   WILDCARD ACCESS OVERRIDE
   If /config/app → wildcard_access === true, unlocks all
   platform modules for the current user session.
═══════════════════════════════════════════════════════════ */
window._checkWildcardAccess = async function _checkWildcardAccess() {
  try {
    const snap = await firebase.firestore().collection('config').doc('app').get();
    if (snap.exists && snap.data()?.wildcard_access === true) {
      // Override tier gating — everything becomes accessible
      if (typeof GP_DATASETS !== 'undefined') {
        GP_DATASETS.forEach(ds => { ds._tierOverride = 'free'; });
      }
      console.info('[SymposiON] Wildcard access override active.');
    }
  } catch (_) {}
};

/* ═══════════════════════════════════════════════════════════
   BOOT SEQUENCE
   All deferred checks that need Firebase to be initialised.
═══════════════════════════════════════════════════════════ */
setTimeout(() => {
  if (typeof firebase !== 'undefined' && typeof firebase.firestore === 'function') {
    _checkAppVersion();
    _checkWildcardAccess();
  }
}, 2500);
