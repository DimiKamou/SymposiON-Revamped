// ============================================================
//  SymposiON — Το Μονοπάτι του Ήρωα (The Hero's Journey)
//  RPG Progression, Leveling & Profile Customization System
// ============================================================

// ── TITLE CATALOG ────────────────────────────────────────────
// levelReq: unlock at this level for free (0 = not level-gated)
// cost:     Drachma purchase price (0 = free / level-unlocked)
const HJ_TITLES = [
  { id: 'neofotistos',  gr: 'Νεοφώτιστος',   en: 'Initiate',       levelReq: 0,   cost: 0   },
  { id: 'efivos',       gr: 'Έφηβος',         en: 'Ephebe',         levelReq: 2,   cost: 0   },
  { id: 'oplitis',      gr: 'Οπλίτης',        en: 'Hoplite',        levelReq: 0,   cost: 50  },
  { id: 'filosofos',    gr: 'Φιλόσοφος',      en: 'Philosopher',    levelReq: 5,   cost: 0   },
  { id: 'athlitis',     gr: 'Αθλητής',        en: 'Athlete',        levelReq: 0,   cost: 75  },
  { id: 'myrmidones',   gr: 'Μυρμιδόνας',     en: 'Myrmidon',       levelReq: 8,   cost: 0   },
  { id: 'stratigos',    gr: 'Στρατηγός',      en: 'Strategos',      levelReq: 0,   cost: 125 },
  { id: 'iroas',        gr: 'Ήρωας',          en: 'Hero',           levelReq: 12,  cost: 0   },
  { id: 'olympionikes', gr: 'Ολυμπιονίκης',   en: 'Olympian',       levelReq: 18,  cost: 0   },
  { id: 'imitheos',     gr: 'Ημίθεος',        en: 'Demigod',        levelReq: 0,   cost: 250 },
  // Levels 20–100
  { id: 'agoritis',     gr: 'Αγορητής',       en: 'Orator',         levelReq: 20,  cost: 0   },
  { id: 'argonaftis',   gr: 'Αργοναύτης',     en: 'Argonaut',       levelReq: 25,  cost: 0   },
  { id: 'proxenos',     gr: 'Πρόξενος',       en: 'Proxenos',       levelReq: 0,   cost: 200 },
  { id: 'exarchon',     gr: 'Έξαρχος',        en: 'Exarch',         levelReq: 30,  cost: 0   },
  { id: 'spartiatis',   gr: 'Σπαρτιάτης',     en: 'Spartan',        levelReq: 0,   cost: 300 },
  { id: 'taxiarchos',   gr: 'Ταξίαρχος',      en: 'Taxiarch',       levelReq: 35,  cost: 0   },
  { id: 'athanatos',    gr: 'Αθάνατος',       en: 'Immortal',       levelReq: 40,  cost: 0   },
  { id: 'triirarchos',  gr: 'Τριήραρχος',     en: 'Trierarch',      levelReq: 0,   cost: 400 },
  { id: 'archistratigps',gr:'Αρχιστράτηγος',  en: 'Archstrategist', levelReq: 45,  cost: 0   },
  { id: 'polemarchos',  gr: 'Πολέμαρχος',     en: 'Polemarch',      levelReq: 50,  cost: 0   },
  { id: 'anax',         gr: 'Άναξ',           en: 'Anax',           levelReq: 55,  cost: 0   },
  { id: 'basileus',     gr: 'Βασιλεύς',       en: 'Basileus',       levelReq: 0,   cost: 500 },
  { id: 'eponymos',     gr: 'Επώνυμος',       en: 'Eponymous',      levelReq: 60,  cost: 0   },
  { id: 'archaios',     gr: 'Αρχαίος',        en: 'Ancient One',    levelReq: 65,  cost: 0   },
  { id: 'titanomachos', gr: 'Τιτανομάχος',    en: 'Titanslayer',    levelReq: 70,  cost: 0   },
  { id: 'titan',        gr: 'Τιτάν',          en: 'Titan',          levelReq: 0,   cost: 750 },
  { id: 'olympios',     gr: 'Ολύμπιος',       en: 'Olympian God',   levelReq: 75,  cost: 0   },
  { id: 'theomachos',   gr: 'Θεομάχος',       en: 'Theomach',       levelReq: 80,  cost: 0   },
  { id: 'kosmoktisths', gr: 'Κοσμοκτίστης',   en: 'Worldbuilder',   levelReq: 85,  cost: 0   },
  { id: 'kosmokrator',  gr: 'Κοσμοκράτωρ',    en: 'Cosmocrator',    levelReq: 90,  cost: 0   },
  { id: 'uranion',      gr: 'Ουράνιος',       en: 'Celestial',      levelReq: 95,  cost: 0   },
  { id: 'theoclhs',     gr: 'Θεόκλης',        en: 'Theocles',       levelReq: 100, cost: 0   },
];

// ── AVATAR CATALOG ───────────────────────────────────────────
// SVG functions are hoisted (function declarations), safe to call here.
const HJ_AVATARS = [
  { id: 'owl',      gr: 'Κουκουβάγια', en: 'Owl of Athena',  cost: 0,   svg: _svgOwl()      },
  { id: 'helmet',   gr: 'Κράνος',      en: 'Spartan Helmet', cost: 50,  svg: _svgHelmet()   },
  { id: 'laurel',   gr: 'Δάφνη',       en: 'Laurel Wreath',  cost: 75,  svg: _svgLaurel()   },
  { id: 'trident',  gr: 'Τρίαινα',     en: 'Trident',        cost: 100, svg: _svgTrident()  },
  { id: 'lyre',     gr: 'Λύρα',        en: 'Lyre of Apollo', cost: 125, svg: _svgLyre()     },
  { id: 'caduceus', gr: 'Κηρύκειο',    en: 'Caduceus',       cost: 150, svg: _svgCaduceus() },
];

// ── STATE ─────────────────────────────────────────────────────
let _prog = null;  // cached progression document

// ── TEMPLE OF THE MUSES — per-user state defaults ─────────────
// The Temple generalises the Hero's Journey: many cosmetic slots / pillars,
// a loadout of boons, consumable lifelines, rolling quests, a saga arc and
// lifetime stats. The spend currency stays `drachmas` (surfaced as "Kleos").
// These ride along in the SAME users/{uid}/progression/data doc.
function _templeStateDefaults() {
  return {
    owned:        [],                          // ids of purchased cosmetics / offerings / boons
    equipped:     {},                          // { slot|pillarId : itemId }
    loadout:      [],                          // equipped boon ids (≤ realm.loadoutMax)
    consumables:  {},                          // { consumableId : chargesRemaining }
    quests:       {},                          // { questId : progressCount }
    claimed:      [],                          // ids of quests whose reward was claimed
    activeQuests: { daily: [], weekly: [] },   // current rolled rotation
    saga:         { chapter: 0, progress: 0 }, // sequential epic arc
    stats:        { wins: 0, sessions: 0, bestStreak: 0, swift: 0,
                    mastered: 0, accuracy: 0, hours: 0, kleosLifetime: 0 },
    // weekly ledger — refills every Sunday (see _maybeWeeklyReset):
    //   anchor:      ms of the current week's Sunday 00:00 boundary
    //   earned:      { [gameId]: { xp, drachmas } } toward the weekly cap
    //   firstClears: gameIds that already paid their first-clear-of-week bonus
    weekly:       { anchor: 0, earned: {}, firstClears: [] },
  };
}

// Fill any missing Temple keys on a loaded progression doc so old accounts
// (created before the Temple) don't crash the new UI. Mutates + returns `p`.
// Does not write to Firestore — fields persist lazily on first Temple action.
function _ensureTempleState(p) {
  if (!p) return p;
  const d = _templeStateDefaults();
  for (const k in d) {
    if (p[k] == null) { p[k] = d[k]; }
  }
  // nested guards (a partial object from an interrupted write)
  if (!p.activeQuests || typeof p.activeQuests !== 'object') p.activeQuests = d.activeQuests;
  if (p.activeQuests.daily  == null) p.activeQuests.daily  = [];
  if (p.activeQuests.weekly == null) p.activeQuests.weekly = [];
  if (!p.saga || typeof p.saga !== 'object') p.saga = d.saga;
  if (!p.stats || typeof p.stats !== 'object') p.stats = d.stats;
  if (!p.weekly || typeof p.weekly !== 'object') p.weekly = d.weekly;
  if (!p.weekly.earned || typeof p.weekly.earned !== 'object') p.weekly.earned = {};
  if (!Array.isArray(p.weekly.firstClears)) p.weekly.firstClears = [];
  if (p.weekly.anchor == null) p.weekly.anchor = 0;
  return p;
}

// ── WEEKLY (Sunday) RESET + per-game reward engine ────────────
// Most-recent Sunday 00:00 (local time). The site is Greek, so local is right.
function _weekAnchor(now) {
  now = now || new Date();
  const sunday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay(), 0, 0, 0, 0);
  return sunday.getTime();
}

// If we've crossed into a new week, refill the weekly caps, re-arm the
// first-clear bonuses, and reroll the weekly quest rotation. Persists.
function _maybeWeeklyReset() {
  if (!_prog || !currentUser) return;
  _ensureTempleState(_prog);
  const anchor = _weekAnchor();
  if ((_prog.weekly.anchor || 0) >= anchor) return; // still the same week
  _prog.weekly = { anchor: anchor, earned: {}, firstClears: [] };
  const patch = { weekly: _prog.weekly };
  const realm = (typeof getRealm === 'function') ? getRealm() : null;
  if (realm && typeof rollCadence === 'function' && realm.questsByCadence('weekly').length) {
    _prog.activeQuests.weekly = rollCadence('weekly');
    _prog.activeQuests.weekly.forEach(id => { if (_prog.quests[id] == null) _prog.quests[id] = 0; });
    _prog.claimed = (_prog.claimed || []).filter(id => {
      const q = realm.QUESTS.find(x => x.id === id); return q && q.cadence !== 'weekly';
    });
    patch.activeQuests = _prog.activeQuests; patch.quests = _prog.quests; patch.claimed = _prog.claimed;
  }
  _progRef(currentUser.uid).update(patch).catch(() => {});
}

// Resolve a game's raw payout from its realm params + this run's performance.
function _computeGameReward(cfg, perf) {
  perf = perf || {}; cfg = cfg || {};
  const score   = Math.max(0, Number(perf.score) || 0);
  const streak  = Math.max(0, Number(perf.bestStreak) || 0);
  const swift   = !!perf.swift;
  const perfect = !!perf.perfect;
  const xp = (cfg.baseXp || 0) + (cfg.xpPerScore || 0) * score + (cfg.xpPerStreak || 0) * streak
    + (swift ? (cfg.swiftXp || 0) : 0) + (perfect ? (cfg.perfectXp || 0) : 0);
  const drachmas = (cfg.baseDrachmas || 0) + (cfg.drachmasPerScore || 0) * score
    + (perfect ? (cfg.perfectDrachmas || 0) : 0);
  return { xp: Math.max(0, Math.round(xp)), drachmas: Math.max(0, Math.round(drachmas)) };
}

// ── PARAMETERISED GAME REWARD (preferred entry for games) ─────
// Games call: awardGameRewards('iliada-arcade', { score, bestStreak, swift, perfect })
// The amounts come from config/realm (admin-tunable), with a first-clear-of-
// week bonus and a weekly cap (0 = uncapped) that refills every Sunday. Falls
// back to the `default` entry for any game without its own override.
async function awardGameRewards(gameId, perf) {
  if (!currentUser || (typeof _firebaseReady !== 'undefined' && !_firebaseReady)) return { xp: 0, drachmas: 0 };
  if (!_prog) await initProgression(currentUser.uid);
  _maybeWeeklyReset();

  const realm = (typeof getRealm === 'function') ? getRealm() : null;
  const cfg = (realm && realm.gameReward) ? realm.gameReward(gameId) : {};
  let { xp, drachmas } = _computeGameReward(cfg, perf);

  // first-clear-of-week bonus
  const firstClears = _prog.weekly.firstClears || (_prog.weekly.firstClears = []);
  if (gameId && firstClears.indexOf(gameId) === -1) {
    xp += cfg.weeklyBonusXp || 0; drachmas += cfg.weeklyBonusDrachmas || 0;
    firstClears.push(gameId);
  }
  // weekly cap clamp (0 = uncapped)
  const earnedMap = _prog.weekly.earned || (_prog.weekly.earned = {});
  const prev = earnedMap[gameId] || { xp: 0, drachmas: 0 };
  if (cfg.weeklyCapXp > 0)       xp       = Math.max(0, Math.min(xp,       cfg.weeklyCapXp - prev.xp));
  if (cfg.weeklyCapDrachmas > 0) drachmas = Math.max(0, Math.min(drachmas, cfg.weeklyCapDrachmas - prev.drachmas));
  earnedMap[gameId] = { xp: prev.xp + xp, drachmas: prev.drachmas + drachmas };

  _progRef(currentUser.uid).update({ weekly: _prog.weekly }).catch(() => {});
  await awardRewards(xp, drachmas); // xp/level/stats/quests + toasts
  return { xp, drachmas };
}

// ── LIVE SYNC (Step 5) ────────────────────────────────────────
// One onSnapshot listener on the progression doc keeps every surface in
// step: multiple tabs, the Temple page, the in-game overlay, the nav. Local
// writes are skipped (the acting surface already updated optimistically) by
// comparing the incoming doc to the cached one — only genuine remote changes
// trigger a re-render.
let _progListening = false;
let _progUnsub = null;
function _attachProgListener(uid) {
  if (_progListening || !uid || typeof _progRef !== 'function') return;
  _progListening = true;
  try {
    _progUnsub = _progRef(uid).onSnapshot(snap => {
      if (!snap.exists) return;
      const incoming = _ensureTempleState(snap.data());
      incoming.level = _hjLevel(incoming.xp || 0);
      let changed = true;
      try { changed = JSON.stringify(incoming) !== JSON.stringify(_prog); } catch (e) {}
      _prog = incoming;
      if (typeof _templeUpdateNavChip === 'function') _templeUpdateNavChip();
      if (!changed) return; // local write echo — surfaces already current
      if (document.getElementById('page-profile')?.classList.contains('active')) renderProfilePage();
      if (document.getElementById('page-temple')?.classList.contains('active') && typeof renderTemplePage === 'function') renderTemplePage();
      if (typeof _updateAllNavbars === 'function') _updateAllNavbars();
    }, err => { console.warn('[hj] progression listener failed', err); });
  } catch (e) { _progListening = false; console.warn('[hj] listener attach failed', e); }
}

// ── MATH ─────────────────────────────────────────────────────
function _hjLevel(xp)  { return Math.floor(Math.sqrt(xp / 100)); }
function _hjXpFor(lvl) { return lvl * lvl * 100; }

// ── ADMIN INFINITE-FUNDS SHIM (Drachmas) ──────────────────────
// Admins have unlimited Drachmas so they can unlock every Agora item.
// Delegates the admin check to the shared predicate in js/sym-kleos.js.
function _hjIsInfiniteAdmin() {
  return !!(window.symKleosIsAdmin && window.symKleosIsAdmin());
}
// Effective spendable balance: Infinity for admins, else the real Firestore value.
function _hjDrachmas() {
  return _hjIsInfiniteAdmin() ? Infinity : (_prog ? (_prog.drachmas || 0) : 0);
}
function _hjDrachmasLabel() {
  return _hjIsInfiniteAdmin() ? '∞' : (((_prog && _prog.drachmas) || 0).toLocaleString('el-GR'));
}

// ── FIRESTORE REFERENCE ───────────────────────────────────────
function _progRef(uid) {
  return firebase.firestore().doc(`users/${uid}/progression/data`);
}

// ── INIT ON LOGIN ─────────────────────────────────────────────
async function initProgression(uid) {
  try {
    const snap = await _progRef(uid).get();
    if (!snap.exists) {
      const defaults = {
        xp: 0, level: 0, drachmas: 0,
        unlockedTitles:  ['neofotistos'],
        activeTitle:     'neofotistos',
        unlockedAvatars: ['owl'],
        activeAvatar:    'owl',
        ..._templeStateDefaults(),
      };
      await _progRef(uid).set(defaults);
      _prog = defaults;
    } else {
      _prog = _ensureTempleState(snap.data());
      const computed = _hjLevel(_prog.xp || 0);
      if (computed !== _prog.level) {
        _prog.level = computed;
        _progRef(uid).update({ level: computed }).catch(() => {});
      }
    }
  } catch (e) {
    console.warn('[hj] init failed — using defaults', e);
    _prog = {
      xp: 0, level: 0, drachmas: 0,
      unlockedTitles: ['neofotistos'], activeTitle: 'neofotistos',
      unlockedAvatars: ['owl'],       activeAvatar: 'owl',
      ..._templeStateDefaults(),
    };
  }
  _maybeWeeklyReset();
  _attachProgListener(uid);
  return _prog;
}

function resetProgression() {
  if (_progUnsub) { try { _progUnsub(); } catch (e) {} _progUnsub = null; }
  _progListening = false;
  _prog = null;
}

// ── AWARD REWARDS ─────────────────────────────────────────────
// Called from any game's endgame screen: awardRewards(xp, drachmas)
async function awardRewards(xpAmount, drachmaAmount) {
  if (!currentUser || (typeof _firebaseReady !== 'undefined' && !_firebaseReady)) return;
  if (!_prog) await initProgression(currentUser.uid);

  const prevLevel   = _prog.level;
  _prog.xp         += Math.max(0, xpAmount      || 0);
  _prog.drachmas   += Math.max(0, drachmaAmount || 0);
  _prog.level       = _hjLevel(_prog.xp);

  // ── TEMPLE SESSION HOOK (Step 6) ──
  // A finished game leaves a mark in the Temple: bump lifetime stats and
  // nudge every active daily/weekly quest one step toward its goal.
  _ensureTempleState(_prog);
  _prog.stats.sessions      = (_prog.stats.sessions || 0) + 1;
  _prog.stats.kleosLifetime = (_prog.stats.kleosLifetime || 0) + Math.max(0, drachmaAmount || 0);
  const _realm   = (typeof getRealm === 'function') ? getRealm() : null;
  const _activeQ = [].concat(
    (_prog.activeQuests && _prog.activeQuests.daily)  || [],
    (_prog.activeQuests && _prog.activeQuests.weekly) || []);
  if (_realm) _activeQ.forEach(id => {
    const q = _realm.QUESTS.find(x => x.id === id);
    if (q && (_prog.quests[id] || 0) < q.goal) _prog.quests[id] = Math.min(q.goal, (_prog.quests[id] || 0) + 1);
  });

  try {
    await _progRef(currentUser.uid).update({
      xp:       _prog.xp,
      drachmas: _prog.drachmas,
      level:    _prog.level,
      stats:    _prog.stats,
      quests:   _prog.quests,
    });
  } catch (e) { console.warn('[hj] reward update failed', e); }

  // Refresh open profile page
  if (document.getElementById('page-profile')?.classList.contains('active')) {
    renderProfilePage();
  }

  if (_prog.level > prevLevel) {
    _hjAutoUnlockTitles(_prog.level);
    _hjShowLevelUpToast(_prog.level, xpAmount, drachmaAmount);
    if (typeof _updateAllNavbars === 'function') _updateAllNavbars();
  } else if (xpAmount || drachmaAmount) {
    _hjShowRewardToast(xpAmount, drachmaAmount);
  }
}

function _hjAutoUnlockTitles(level) {
  if (!_prog || !currentUser) return;
  let changed = false;
  HJ_TITLES.forEach(t => {
    if (t.levelReq > 0 && level >= t.levelReq && !_prog.unlockedTitles.includes(t.id)) {
      _prog.unlockedTitles.push(t.id);
      changed = true;
    }
  });
  if (changed) {
    _progRef(currentUser.uid)
      .update({ unlockedTitles: _prog.unlockedTitles })
      .catch(() => {});
  }
}

// ── PURCHASE (spend Drachmas) ─────────────────────────────────
async function purchaseItem(type, id) {
  if (!currentUser || !_prog) return { ok: false, reason: 'not-ready' };

  const catalog   = type === 'title' ? HJ_TITLES : HJ_AVATARS;
  const item      = catalog.find(x => x.id === id);
  if (!item) return { ok: false, reason: 'not-found' };

  const ownedList = type === 'title' ? _prog.unlockedTitles : _prog.unlockedAvatars;
  if (ownedList.includes(id)) return { ok: false, reason: 'already-owned' };
  if (_hjDrachmas() < item.cost) return { ok: false, reason: 'insufficient-drachmas' };

  ownedList.push(id);

  const update = {};
  update[type === 'title' ? 'unlockedTitles' : 'unlockedAvatars'] = ownedList;
  if (!_hjIsInfiniteAdmin()) {           // admins keep their (untouched) balance
    _prog.drachmas -= item.cost;
    update.drachmas = _prog.drachmas;
  }

  try {
    await _progRef(currentUser.uid).update(update);
    return { ok: true };
  } catch (e) {
    console.warn('[hj] purchase failed', e);
    return { ok: false, reason: 'firestore-error' };
  }
}

// ── EQUIP (set active item) ───────────────────────────────────
async function equipItem(type, id) {
  if (!currentUser || !_prog) return;

  const ownedList = type === 'title' ? _prog.unlockedTitles : _prog.unlockedAvatars;
  if (!ownedList.includes(id)) return;

  const field   = type === 'title' ? 'activeTitle' : 'activeAvatar';
  _prog[field]  = id;

  const update = { [field]: id };
  // Equipping a symbol also makes it the active profile picture, in front of
  // any uploaded/Google photo.
  if (type === 'avatar') {
    _prog.avatarMode  = 'symbol';
    update.avatarMode = 'symbol';
  }

  try {
    await _progRef(currentUser.uid).update(update);
    if (typeof _updateAllNavbars === 'function') _updateAllNavbars();
  } catch (e) { console.warn('[hj] equip failed', e); }
}

// ── GETTERS ───────────────────────────────────────────────────
function getProgression()  { return _prog; }
function getActiveTitle()  { return _prog ? HJ_TITLES.find(t => t.id === _prog.activeTitle)   : null; }
function getActiveAvatar() { return _prog ? HJ_AVATARS.find(a => a.id === _prog.activeAvatar) : null; }

// Which source backs the profile picture: an uploaded/Google 'photo' or the
// equipped 'symbol'. An explicit choice (set when the user equips a symbol or
// uploads a photo) wins; with no choice yet, the photo wins when one exists so
// existing accounts keep their current avatar.
function getAvatarMode() {
  if (_prog && (_prog.avatarMode === 'symbol' || _prog.avatarMode === 'photo')) return _prog.avatarMode;
  return (currentUser && currentUser.photoURL) ? 'photo' : 'symbol';
}

// True when the equipped hero symbol should render as the profile picture
// (i.e. in front of any uploaded/Google photo).
function shouldUseSymbolAvatar() {
  return !!getActiveAvatar() && getAvatarMode() === 'symbol';
}

// ── NAVIGATE TO PROFILE ───────────────────────────────────────
function navToProfile() {
  if (!currentUser) {
    if (typeof openAuthModal === 'function') openAuthModal('login');
    return;
  }
  if (typeof goTo === 'function') goTo('profile');
  if (typeof _navPush === 'function') _navPush({ page: 'profile' });

  if (!_prog) {
    initProgression(currentUser.uid).then(renderProfilePage);
  } else {
    renderProfilePage();
  }
}

// ── PROFILE PAGE RENDERER ─────────────────────────────────────
function renderProfilePage() {
  const container = document.getElementById('profile-content');
  if (!container) return;

  if (!currentUser || !_prog) {
    container.innerHTML = `<div class="hj-loading"><div class="hj-loading-ring"></div></div>`;
    if (currentUser && !_prog) initProgression(currentUser.uid).then(renderProfilePage);
    return;
  }

  const p          = _prog;
  const lvl        = p.level;
  const xpThis     = _hjXpFor(lvl);
  const xpNext     = _hjXpFor(lvl + 1);
  const pct        = (p.xp <= 0 && lvl === 0) ? 0
    : Math.min(100, Math.round(((p.xp - xpThis) / (xpNext - xpThis)) * 100));
  const name       = currentUser.displayName || currentUser.email?.split('@')[0] || 'Ήρωας';
  const titleObj   = getActiveTitle();
  const avatarObj  = getActiveAvatar();
  const lang       = (typeof siteLang !== 'undefined') ? siteLang : 'gr';
  const lvlLbl     = lang === 'en' ? 'Lv.' : 'Επ.';
  const titleLabel = titleObj ? (lang === 'en' ? titleObj.en : titleObj.gr) : '';

  // Resolve the best available photo URL: Firebase Auth photo (Google) or Firestore-stored upload
  const photoURL = currentUser.photoURL || null;
  // When the user has equipped a symbol as their picture, it takes precedence over the photo.
  const useSymbol = shouldUseSymbolAvatar();
  const showPhoto = photoURL && !useSymbol;

  container.innerHTML = `
    <!-- ── Player Card ── -->
    <div class="hj-player-card">

      <!-- Profile picture wrapper — hover reveals upload button -->
      <div class="profile-avatar-wrapper" title="${lang === 'en' ? 'Change profile picture' : 'Αλλαγή φωτογραφίας προφίλ'}"
           onclick="document.getElementById('profile-pic-input').click()">
        ${showPhoto
          ? `<img class="profile-avatar-img" src="${_hjEsc(photoURL)}" alt="avatar" id="profile-avatar-img"/>`
          : `<div class="profile-avatar-fallback" id="profile-avatar-img">${avatarObj ? avatarObj.svg : _svgOwl()}</div>`
        }
        <div class="profile-avatar-overlay">
          <span class="profile-avatar-camera">📷</span>
          <span class="profile-avatar-hint">${lang === 'en' ? 'Upload' : 'Ανέβασμα'}</span>
        </div>
        <div class="profile-avatar-uploading" id="profile-avatar-uploading" style="display:none;">
          <div class="profile-avatar-spin"></div>
        </div>
      </div>
      <!-- Hidden file input — accepts png & webp only -->
      <input type="file" id="profile-pic-input" accept=".png,.webp,image/png,image/webp"
             style="display:none" onchange="uploadProfilePicture(this)"/>
      <div class="profile-pic-error" id="profile-pic-error"></div>

      <div class="hj-player-info">
        <div class="hj-player-name">${_hjEsc(name)}</div>
        <div class="hj-player-title">${_hjEsc(titleLabel)}</div>
        <div class="hj-level-row">
          <div class="hj-level-badge">${_hjEsc(lvlLbl)} ${lvl}</div>
          <div class="hj-xp-wrap">
            <div class="hj-xp-bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
              <div class="hj-xp-fill" style="width:0%"></div>
            </div>
            <div class="hj-xp-label">${p.xp.toLocaleString('el-GR')} / ${xpNext.toLocaleString('el-GR')} XP</div>
          </div>
        </div>
      </div>

      <div class="hj-drachma-block">
        <div class="hj-drachma-icon">⌾</div>
        <div class="hj-drachma-amount">${_hjDrachmasLabel()}</div>
        <div class="hj-drachma-label">${lang === 'en' ? 'Drachmas' : 'Δραχμές'}</div>
      </div>
    </div>

    <!-- ── Billing / Subscription ── -->
    <div id="hj-billing-section" class="hj-billing-loading-wrap"></div>

    <!-- ── Agora Shop ── -->
    <div class="hj-agora">
      <div class="hj-agora-header">
        <div class="hj-agora-title-group">
          <div class="hj-agora-tag">${lang === 'en' ? 'Marketplace' : 'Αγορά'}</div>
          <h2 class="hj-agora-title">${lang === 'en' ? "Hero's Agora" : 'Αγορά Ήρωα'}</h2>
        </div>
        <div class="hj-agora-tabs" role="tablist">
          <button class="hj-tab active" id="hj-tab-titles"
                  onclick="_hjSwitchTab('titles')" role="tab" aria-selected="true">
            ${lang === 'en' ? 'Titles' : 'Τίτλοι'}
          </button>
          <button class="hj-tab" id="hj-tab-avatars"
                  onclick="_hjSwitchTab('avatars')" role="tab" aria-selected="false">
            ${lang === 'en' ? 'Symbols' : 'Σύμβολα'}
          </button>
        </div>
      </div>

      <div id="hj-panel-titles"  class="hj-shop-grid hj-panel active" role="tabpanel">
        ${_hjRenderTitles()}
      </div>
      <div id="hj-panel-avatars" class="hj-shop-grid hj-panel" role="tabpanel">
        ${_hjRenderAvatars()}
      </div>
    </div>
  `;

  // Animate XP bar on next paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const fill = container.querySelector('.hj-xp-fill');
    if (fill) fill.style.width = pct + '%';
  }));

  // Load billing section asynchronously (non-blocking)
  if (currentUser) _hjLoadBillingSection();
}

// ── BILLING SECTION ───────────────────────────────────────────
async function _hjLoadBillingSection() {
  const section = document.getElementById('hj-billing-section');
  if (!section || !currentUser) return;

  const lang = (typeof siteLang !== 'undefined') ? siteLang : 'gr';

  // Show spinner while loading
  section.innerHTML = `
    <div class="hj-billing-card">
      <div class="hj-billing-loading"><div class="hj-billing-spinner"></div></div>
    </div>`;

  try {
    const [classSnap, userSnap] = await Promise.all([
      firebase.firestore().collection('classrooms').doc(currentUser.uid).get(),
      firebase.firestore().collection('users').doc(currentUser.uid).get(),
    ]);

    const classData = classSnap.exists ? classSnap.data() : {};
    const userData  = userSnap.exists  ? userSnap.data()  : {};

    // Expose teacher feature flags globally so live-arena.js and other
    // modules can gate functionality without re-reading Firestore.
    window.teacherFeatures = Array.isArray(classData.features) ? classData.features : [];

    const planId    = classData.subscriptionType || 'free';
    const expiresAt = classData.expiresAt?.toDate?.() || null;
    const autoRenew = userData.auto_renew !== false; // default true

    // Resolve display label from tier cache or fallback
    const tierDef   = (typeof _spTiersCache !== 'undefined' && Array.isArray(_spTiersCache))
      ? _spTiersCache.find(td => td.id === planId) : null;
    const planLabel = tierDef
      ? (lang === 'en' ? tierDef.label : (tierDef.labelGr || tierDef.label))
      : planId.charAt(0).toUpperCase() + planId.slice(1);

    // Format expiry date
    const expText = expiresAt
      ? expiresAt.toLocaleDateString(lang === 'en' ? 'en-GB' : 'el-GR',
          { day: 'numeric', month: 'long', year: 'numeric' })
      : (lang === 'en' ? '∞ No expiry' : '∞ Χωρίς λήξη');

    // Warn if expiring within 14 days
    const isExpiring = expiresAt
      && (expiresAt.getTime() - Date.now()) < 14 * 24 * 3600 * 1000;

    // Grace period check — shows dismissable banner if subscription just lapsed
    if (typeof checkSubscriptionGrace === 'function') {
      checkSubscriptionGrace(expiresAt);
    }

    section.innerHTML = `
      <div class="hj-billing-card">
        <div class="hj-billing-header">
          <span class="hj-billing-tag">${lang === 'en' ? 'Subscription' : 'Συνδρομή'}</span>
          <h3 class="hj-billing-title">${lang === 'en' ? 'My Plan' : 'Το Πλάνο μου'}</h3>
        </div>

        <div class="hj-billing-plan-row">
          <span class="hj-billing-plan-label">${lang === 'en' ? 'Active plan' : 'Ενεργό πλάνο'}</span>
          <span class="hj-billing-plan-badge hj-billing-plan-badge--${_hjEsc(planId)}">${_hjEsc(planLabel)}</span>
        </div>

        <div class="hj-billing-exp-row">
          <span class="hj-billing-plan-label">${lang === 'en' ? 'Valid until' : 'Ισχύει έως'}</span>
          <span class="hj-billing-exp-date${isExpiring ? ' hj-billing-exp-date--warn' : ''}">${_hjEsc(expText)}</span>
        </div>

        <div class="hj-billing-divider"></div>

        <div class="hj-autorenew-row">
          <div class="hj-autorenew-info">
            <div class="hj-autorenew-title">
              ${lang === 'en' ? 'Automatic Renewal' : 'Αυτόματη Ανανέωση Συνδρομής'}
            </div>
            <div class="hj-autorenew-desc">
              ${lang === 'en'
                ? 'Automatically renew your subscription when it expires.'
                : 'Αυτόματη ανανέωση της συνδρομής σου κατά τη λήξη της.'}
            </div>
          </div>
          <label class="hj-autorenew-toggle">
            <input type="checkbox" id="hj-autorenew-input"
                   ${autoRenew ? 'checked' : ''}
                   onchange="hjToggleAutoRenew(this)"/>
            <span class="hj-autorenew-track"></span>
          </label>
        </div>

        <div class="hj-autorenew-warn" id="hj-autorenew-warn"
             ${autoRenew ? 'style="display:none;"' : ''}>
          ${lang === 'en'
            ? '⚠ Auto-renewal is disabled. Your subscription will not be renewed automatically.'
            : '⚠ Η αυτόματη ανανέωση είναι απενεργοποιημένη. Η συνδρομή σου δεν θα ανανεωθεί αυτόματα.'}
        </div>

        <!-- ── Subscription sync button ── -->
        <button id="sync-sub-btn"
                onclick="if(typeof syncSubscription==='function')syncSubscription()"
                title="${lang === 'en' ? 'Manually sync subscription status from billing ledger' : 'Χειροκίνητος συγχρονισμός συνδρομής'}">
          🔄 ${lang === 'en' ? 'Sync Subscription' : 'Συγχρονισμός Συνδρομής'}
        </button>
      </div>`;
  } catch (err) {
    console.warn('[hj] billing section failed', err);
    section.innerHTML = ''; // hide silently on error — doesn't break the page
  }
}

async function hjToggleAutoRenew(el) {
  if (!currentUser) { if (el) el.checked = !el.checked; return; }
  const newVal = !!el?.checked;
  try {
    await firebase.firestore().collection('users').doc(currentUser.uid)
      .update({ auto_renew: newVal });
    const warnEl = document.getElementById('hj-autorenew-warn');
    if (warnEl) warnEl.style.display = newVal ? 'none' : '';
  } catch (err) {
    console.warn('[hj] auto-renew toggle failed', err);
    if (el) el.checked = !el.checked; // revert on Firestore error
  }
}

// ── PROFILE PICTURE UPLOADER ─────────────────────────────────
// Uploads to Firebase Storage /user_profiles/{uid}/avatar.webp,
// persists the download URL to Firestore users/{uid}.photoURL,
// then live-patches all avatar elements in the current session.
async function uploadProfilePicture(inputEl) {
  if (!currentUser) return;
  const file = inputEl?.files?.[0];
  if (!file) return;

  const lang = (typeof siteLang !== 'undefined') ? siteLang : 'gr';
  const errEl = document.getElementById('profile-pic-error');
  const spinner = document.getElementById('profile-avatar-uploading');

  // Client-side guard: 5 MB, png/webp only
  if (file.size > 5 * 1024 * 1024) {
    if (errEl) errEl.textContent = lang === 'en' ? 'File must be under 5 MB.' : 'Το αρχείο πρέπει να είναι κάτω από 5 MB.';
    inputEl.value = '';
    return;
  }
  if (!['image/png', 'image/webp'].includes(file.type)) {
    if (errEl) errEl.textContent = lang === 'en' ? 'Only .png and .webp files accepted.' : 'Μόνο .png και .webp αρχεία γίνονται δεκτά.';
    inputEl.value = '';
    return;
  }

  if (errEl) errEl.textContent = '';
  if (spinner) spinner.style.display = 'flex';

  try {
    const storageRef = firebase.storage()
      .ref(`user_profiles/${currentUser.uid}/avatar.webp`);

    await storageRef.put(file, { contentType: file.type });
    const downloadURL = await storageRef.getDownloadURL();

    // Persist to Firestore so the URL survives across sessions
    await firebase.firestore().collection('users').doc(currentUser.uid)
      .set({ photoURL: downloadURL }, { merge: true });

    // Update the Firebase Auth profile object so nav avatars refresh too
    await currentUser.updateProfile({ photoURL: downloadURL });

    // Uploading a photo makes it the active picture again (over any equipped symbol)
    if (_prog) {
      _prog.avatarMode = 'photo';
      _progRef(currentUser.uid).update({ avatarMode: 'photo' }).catch(() => {});
    }

    // Live-patch all avatar <img> elements on the page without a reload
    document.querySelectorAll('.nav-avatar, #profile-avatar-img').forEach(el => {
      if (el.tagName === 'IMG') {
        el.src = downloadURL;
      } else {
        // Fallback div — swap to <img>
        const img = document.createElement('img');
        img.className = el.className;
        img.src = downloadURL;
        img.alt = 'avatar';
        img.id  = el.id || '';
        el.replaceWith(img);
      }
    });

    // Re-render all nav bars so the new photo appears immediately
    if (typeof _updateAllNavbars === 'function') _updateAllNavbars();

    if (typeof showToast === 'function') {
      showToast('✓ Φωτογραφία προφίλ ενημερώθηκε!', '✓ Profile picture updated!');
    }
  } catch (err) {
    console.error('[profile-pic] upload failed:', err);
    if (errEl) {
      errEl.textContent = lang === 'en'
        ? 'Upload failed. Check connection and try again.'
        : 'Αποτυχία ανεβάσματος. Έλεγξε σύνδεση και δοκίμασε ξανά.';
    }
  } finally {
    if (spinner) spinner.style.display = 'none';
    inputEl.value = ''; // reset so same file can be re-selected
  }
}

// ── TAB SWITCH ────────────────────────────────────────────────
function _hjSwitchTab(tab) {
  ['titles', 'avatars'].forEach(id => {
    document.getElementById('hj-tab-' + id)?.classList.toggle('active', id === tab);
    document.getElementById('hj-panel-' + id)?.classList.toggle('active', id === tab);
  });
}

// ── TITLES GRID ───────────────────────────────────────────────
function _hjRenderTitles() {
  if (!_prog) return '';
  const lang = (typeof siteLang !== 'undefined') ? siteLang : 'gr';

  return HJ_TITLES.map(t => {
    const label   = lang === 'en' ? t.en : t.gr;
    const owned   = _prog.unlockedTitles.includes(t.id);
    const active  = _prog.activeTitle === t.id;

    let cls, stateText, clickAttr = '';

    if (active) {
      cls = 'hj-item-active';
      stateText = lang === 'en' ? 'Active' : 'Ενεργό';
    } else if (owned) {
      cls = 'hj-item-owned';
      stateText = lang === 'en' ? 'Equip' : 'Εξόπλισε';
      clickAttr = `onclick="equipItem('title','${t.id}').then(()=>renderProfilePage())"`;
    } else if (t.levelReq > 0 && _prog.level < t.levelReq) {
      cls = 'hj-item-locked';
      stateText = (lang === 'en' ? 'Level ' : 'Επ. ') + t.levelReq;
    } else if (t.cost > 0 && _hjDrachmas() >= t.cost) {
      cls = 'hj-item-buyable';
      stateText = `⌾ ${t.cost}`;
      clickAttr = `onclick="_hjConfirmPurchase('title','${t.id}')"`;
    } else if (t.cost > 0) {
      cls = 'hj-item-locked';
      stateText = `⌾ ${t.cost}`;
    } else {
      cls = 'hj-item-locked';
      stateText = '';
    }

    const reqPill  = t.levelReq > 0
      ? `<span class="hj-item-req">${lang === 'en' ? 'Lv.' : 'Επ.'} ${t.levelReq}</span>` : '';
    const costPill = t.cost > 0
      ? `<span class="hj-item-cost">⌾ ${t.cost}</span>`
      : `<span class="hj-item-req">${lang === 'en' ? 'Free' : 'Δωρεάν'}</span>`;

    return `
      <div class="hj-item hj-item-title ${cls}" ${clickAttr}>
        <div class="hj-item-name">${_hjEsc(label)}</div>
        <div class="hj-item-footer">
          <div class="hj-item-meta">${reqPill || costPill}</div>
          <span class="hj-item-state">${_hjEsc(stateText)}</span>
        </div>
      </div>`;
  }).join('');
}

// ── AVATARS GRID ──────────────────────────────────────────────
function _hjRenderAvatars() {
  if (!_prog) return '';
  const lang = (typeof siteLang !== 'undefined') ? siteLang : 'gr';

  const symbolShown = getAvatarMode() === 'symbol';

  return HJ_AVATARS.map(a => {
    const label  = lang === 'en' ? a.en : a.gr;
    const owned  = _prog.unlockedAvatars.includes(a.id);
    // "Active" reflects the picture actually on display: the equipped symbol,
    // and only while symbol mode is on (a photo can be showing instead).
    const active = _prog.activeAvatar === a.id && symbolShown;

    let cls, stateText, clickAttr = '';

    if (active) {
      cls = 'hj-item-active';
      stateText = lang === 'en' ? 'Active' : 'Ενεργό';
    } else if (owned) {
      cls = 'hj-item-owned';
      stateText = lang === 'en' ? 'Equip' : 'Εξόπλισε';
      clickAttr = `onclick="equipItem('avatar','${a.id}').then(()=>renderProfilePage())"`;
    } else if (_hjDrachmas() >= a.cost) {
      cls = 'hj-item-buyable';
      stateText = `⌾ ${a.cost}`;
      clickAttr = `onclick="_hjConfirmPurchase('avatar','${a.id}')"`;
    } else {
      cls = 'hj-item-locked';
      stateText = `⌾ ${a.cost}`;
    }

    const costPill = a.cost > 0
      ? `<span class="hj-item-cost">⌾ ${a.cost}</span>`
      : `<span class="hj-item-req">${lang === 'en' ? 'Free' : 'Δωρεάν'}</span>`;

    return `
      <div class="hj-item hj-item-avatar ${cls}" ${clickAttr}>
        <div class="hj-avatar-preview">${a.svg}</div>
        <div class="hj-item-name">${_hjEsc(label)}</div>
        <div class="hj-item-footer">
          <div class="hj-item-meta">${costPill}</div>
          <span class="hj-item-state">${_hjEsc(stateText)}</span>
        </div>
      </div>`;
  }).join('');
}

// ── PURCHASE MODAL ────────────────────────────────────────────
function _hjConfirmPurchase(type, id) {
  const catalog = type === 'title' ? HJ_TITLES : HJ_AVATARS;
  const item    = catalog.find(x => x.id === id);
  if (!item || !_prog) return;

  const lang      = (typeof siteLang !== 'undefined') ? siteLang : 'gr';
  const label     = lang === 'en' ? item.en : item.gr;
  const typeLabel = lang === 'en'
    ? (type === 'title' ? 'title' : 'symbol')
    : (type === 'title' ? 'τίτλο' : 'σύμβολο');

  let modal = document.getElementById('hj-purchase-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id        = 'hj-purchase-modal';
    modal.className = 'hj-modal-overlay';
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.classList.remove('active');
    });
    document.body.appendChild(modal);
  }

  modal.innerHTML = `
    <div class="hj-modal-box">
      <div class="hj-modal-coin">⌾</div>
      <div class="hj-modal-title">${_hjEsc(label)}</div>
      <div class="hj-modal-body">
        ${lang === 'en'
          ? `Spend <strong>${item.cost} Drachmas</strong> to unlock this ${typeLabel}?`
          : `Δαπάνη <strong>${item.cost} Δραχμές</strong> για να αποκτήσεις αυτόν τον ${typeLabel};`}
      </div>
      <div class="hj-modal-balance">
        ${lang === 'en' ? 'Your balance:' : 'Υπόλοιπο:'} ${_hjDrachmasLabel()} ${lang === 'en' ? 'Drachmas' : 'Δρχ.'}
      </div>
      <div class="hj-modal-actions">
        <button class="hj-modal-cancel"
                onclick="document.getElementById('hj-purchase-modal').classList.remove('active')">
          ${lang === 'en' ? 'Cancel' : 'Ακύρωση'}
        </button>
        <button class="hj-modal-confirm"
                onclick="_hjExecutePurchase('${type}','${id}')">
          ${lang === 'en' ? 'Purchase' : 'Αγορά'}
        </button>
      </div>
    </div>
  `;

  requestAnimationFrame(() => modal.classList.add('active'));
}

async function _hjExecutePurchase(type, id) {
  const modal = document.getElementById('hj-purchase-modal');
  if (modal) modal.classList.remove('active');

  const result = await purchaseItem(type, id);
  if (result.ok) {
    const catalog = type === 'title' ? HJ_TITLES : HJ_AVATARS;
    const item    = catalog.find(x => x.id === id);
    if (item && typeof showToast === 'function') {
      showToast(`Απέκτησες: ${item.gr}!`, `Acquired: ${item.en}!`);
    }
    renderProfilePage();
  } else if (result.reason === 'insufficient-drachmas') {
    if (typeof showToast === 'function')
      showToast('Δεν έχεις αρκετές Δραχμές.', 'Not enough Drachmas.');
  } else {
    if (typeof showToast === 'function')
      showToast('Κάτι πήγε στραβά. Δοκίμασε ξανά.', 'Something went wrong. Try again.');
  }
}

// ══════════════════════════════════════════════════════════════
//  GRAND LEVEL-UP BANNER
//  Full-screen celebratory modal: laurel emblem, ray burst,
//  confetti shards and XP / Δραχμές reward chips. Dismisses on tap
//  or after ~4.6s. Pure CSS animation (no GSAP dependency); colours
//  are self-contained (dark/gold) and defined in css/student.css.
//
//  Usage:
//    showLevelUp({ level, titleGr, titleEn, flavor, xp, drachmas });
// ══════════════════════════════════════════════════════════════

const LU_ICON_LAUREL = `<svg viewBox="0 0 80 80" fill="none" aria-hidden="true">
  <line x1="40" y1="72" x2="40" y2="46" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M36 21 Q28 13 19 22 Q15 33 24 40 Q33 44 36 37 Q40 30 36 21Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M44 21 Q52 13 61 22 Q65 33 56 40 Q47 44 44 37 Q40 30 44 21Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M30 31 Q22 23 16 32 Q14 41 22 44 Q31 47 33 39" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M50 31 Q58 23 64 32 Q66 41 58 44 Q49 47 47 39" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M27 43 Q19 39 16 47 Q15 55 24 56 Q33 57 34 48" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
  <path d="M53 43 Q61 39 64 47 Q65 55 56 56 Q47 57 46 48" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>
</svg>`;
const LU_ICON_BOLT = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M13 2 L4 14 H11 L10 22 L20 9 H13 Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>`;
const LU_ICON_COIN = `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="8.5" stroke="currentColor" stroke-width="1.6"/><path d="M9.5 9 Q12 6.5 14.5 9 M9.5 15 Q12 17.5 14.5 15 M12 8 V16" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;

const LU_SHARD_COLORS = ['#C4A448', '#D97B5C', '#6A8752', '#F0EBE0'];

function showLevelUp(opts = {}) {
  const o = Object.assign({
    level: 1, titleGr: '', titleEn: '',
    flavor: 'A new title awaits in your Profile.',
    xp: 0, drachmas: 0
  }, opts);

  document.getElementById('lvlup')?.remove();

  const el = document.createElement('div');
  el.id = 'lvlup';

  // confetti shards
  let confetti = '';
  for (let i = 0; i < 14; i++) {
    const left  = 8 + Math.random() * 84;
    const color = LU_SHARD_COLORS[i % LU_SHARD_COLORS.length];
    const delay = (Math.random() * 0.3).toFixed(2);
    confetti += `<span class="lu-bit" style="left:${left}%;background:${color};animation-delay:${delay}s"></span>`;
  }

  const titleLine = (o.titleGr || o.titleEn)
    ? `<div class="lu-title"><span class="gr">${o.titleGr}</span>${o.titleGr && o.titleEn ? ' · ' : ''}${o.titleEn}</div>`
    : '';

  el.innerHTML = `
    <div class="lu-backdrop"></div>
    <div class="lu-card">
      <div class="lu-glow"></div>
      <div class="lu-confetti">${confetti}</div>
      <div class="lu-emblem">
        <div class="lu-rays"></div>
        <div class="lu-disc">${LU_ICON_LAUREL}</div>
      </div>
      <div class="lu-eyebrow">Ανέβηκες Επίπεδο<span class="en">LEVEL UP</span></div>
      <div class="lu-line"><span class="rule"></span><span class="dot"></span><span class="rule"></span></div>
      <div class="lu-number">${o.level}</div>
      ${titleLine}
      <div class="lu-flavor">${o.flavor}</div>
      <div class="lu-rewards">
        ${o.xp       ? `<div class="lu-chip"><span class="ic">${LU_ICON_BOLT}</span><b>+${o.xp}</b>&nbsp;XP</div>` : ''}
        ${o.drachmas ? `<div class="lu-chip"><span class="ic">${LU_ICON_COIN}</span><b>+${o.drachmas}</b>&nbsp;Δρχ</div>` : ''}
      </div>
      <div class="lu-hint">Tap anywhere to continue</div>
    </div>`;

  document.body.appendChild(el);
  // double rAF so the entrance transition plays from the start state
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-in')));

  const dismiss = () => {
    if (el.classList.contains('is-out')) return;
    el.classList.remove('is-in');
    el.classList.add('is-out');
    setTimeout(() => el.remove(), 600);
  };

  // tap to dismiss
  el.style.pointerEvents = 'auto';
  el.addEventListener('click', dismiss);

  // auto-dismiss
  const auto = setTimeout(dismiss, 4600);
  el.addEventListener('click', () => clearTimeout(auto), { once: true });

  return el;
}

// expose globally so other modules can trigger it directly
if (typeof window !== 'undefined') window.showLevelUp = showLevelUp;

// ── LEVEL-UP TOAST ────────────────────────────────────────────
// Drives the Grand banner above: names the milestone title unlocked
// at this level (HJ_TITLES is keyed by levelReq) and shows the XP /
// Drachmas just awarded as reward chips.
function _hjShowLevelUpToast(level, xp, drachmas) {
  const t    = HJ_TITLES.find(x => x.levelReq === level);
  const lang = (typeof siteLang !== 'undefined') ? siteLang : 'gr';

  showLevelUp({
    level,
    titleGr: t ? t.gr : '',
    titleEn: t ? t.en : '',
    flavor: t
      ? (lang === 'en' ? 'New title unlocked — see it in your Profile.'
                       : 'Νέος τίτλος ξεκλειδώθηκε — δες τον στο Προφίλ σου.')
      : (lang === 'en' ? 'Keep climbing the Path of the Hero.'
                       : 'Συνέχισε να ανεβαίνεις το Μονοπάτι του Ήρωα.'),
    xp:       Math.max(0, xp || 0),
    drachmas: Math.max(0, drachmas || 0)
  });
}

// ── LEVEL-UP TOAST (compact) ──────────────────────────────────
// Previous compact toast, kept as an alternative to the Grand banner.
function _hjShowLevelUpToastCompact(level) {
  document.getElementById('hj-levelup-toast')?.remove();

  const el = document.createElement('div');
  el.id = 'hj-levelup-toast';
  el.innerHTML = `
    <div class="lut-backdrop"></div>
    <div class="lut-card">
      <div class="lut-glow"></div>
      <div class="lut-eyebrow">Ανέβηκες Επίπεδο!</div>
      <div class="lut-number">${level}</div>
      <div class="lut-subtitle">Το Μονοπάτι του Ήρωα</div>
      <div class="lut-sep"></div>
      <div class="lut-hint">Δες τον νέο σου τίτλο στο Προφίλ</div>
    </div>
  `;
  document.body.appendChild(el);

  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('lut-visible')));
  setTimeout(() => {
    el.classList.add('lut-exit');
    setTimeout(() => el.remove(), 600);
  }, 3800);
}

// ── REWARD TOAST ─────────────────────────────────────────────
function _hjShowRewardToast(xp, drachmas) {
  if (!xp && !drachmas) return;
  const parts = [];
  if (xp)       parts.push(`+${xp} XP`);
  if (drachmas) parts.push(`+${drachmas} Δρχ.`);

  document.getElementById('hj-reward-toast')?.remove();

  const el = document.createElement('div');
  el.id        = 'hj-reward-toast';
  el.className = 'hj-reward-toast';
  el.innerHTML = `<span class="hrt-bolt">⚡</span><span class="hrt-text">${parts.join(' · ')}</span>`;
  document.body.appendChild(el);

  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('hrt-in')));
  setTimeout(() => {
    el.classList.add('hrt-out');
    setTimeout(() => el.remove(), 450);
  }, 2600);
}

// ── UTILITY ───────────────────────────────────────────────────
function _hjEsc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

// ══════════════════════════════════════════════════════════════
//  SVG ICONS — Minimalist Classical Outlines (80×80 viewBox)
//  All use currentColor so CSS controls both size and palette.
// ══════════════════════════════════════════════════════════════

function _svgOwl() {
  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="hj-svg" aria-hidden="true">
  <ellipse cx="40" cy="45" rx="20" ry="23" stroke="currentColor" stroke-width="1.8"/>
  <ellipse cx="40" cy="27" rx="15" ry="13" stroke="currentColor" stroke-width="1.8"/>
  <circle  cx="33" cy="25" r="4.5" stroke="currentColor" stroke-width="1.5"/>
  <circle  cx="47" cy="25" r="4.5" stroke="currentColor" stroke-width="1.5"/>
  <circle  cx="33" cy="25" r="1.8" fill="currentColor"/>
  <circle  cx="47" cy="25" r="1.8" fill="currentColor"/>
  <path d="M37 31 L40 35 L43 31" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
  <path d="M25 17 Q29 10 37 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M55 17 Q51 10 43 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M27 61 Q33 66 40 64 Q47 66 53 61" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M32 67 L30 73 M40 67 L40 73 M48 67 L50 73" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
}

function _svgHelmet() {
  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="hj-svg" aria-hidden="true">
  <path d="M15 47 Q13 29 40 18 Q67 29 65 47 L65 56 Q57 61 40 61 Q23 61 15 56 Z"
        stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>
  <path d="M15 47 L12 54 Q12 65 24 65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M65 47 L68 54 Q68 65 56 65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M26 65 L54 65" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M35 36 Q40 32 45 36" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M37 19 Q38 10 40 8 Q42 10 43 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="40" cy="8" rx="3.5" ry="2.5" stroke="currentColor" stroke-width="1.5"/>
</svg>`;
}

function _svgLaurel() {
  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="hj-svg" aria-hidden="true">
  <line x1="40" y1="72" x2="40" y2="48" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <path d="M36 21 Q28 13 19 22 Q15 33 24 40 Q33 44 36 37 Q40 30 36 21Z"
        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
  <path d="M44 21 Q52 13 61 22 Q65 33 56 40 Q47 44 44 37 Q40 30 44 21Z"
        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
  <path d="M30 31 Q22 23 16 32 Q14 41 22 44 Q31 47 33 39"
        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
  <path d="M50 31 Q58 23 64 32 Q66 41 58 44 Q49 47 47 39"
        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
  <path d="M27 43 Q19 39 16 47 Q15 55 24 56 Q33 57 34 48"
        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
  <path d="M53 43 Q61 39 64 47 Q65 55 56 56 Q47 57 46 48"
        stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
</svg>`;
}

function _svgTrident() {
  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="hj-svg" aria-hidden="true">
  <line x1="40" y1="12" x2="40" y2="72" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M40 18 L36 8 L36 32" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M40 18 L44 8 L44 32" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M34 34 Q40 38 46 34" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <line x1="30" y1="63" x2="50" y2="63" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;
}

function _svgLyre() {
  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="hj-svg" aria-hidden="true">
  <path d="M26 20 Q18 26 18 40 Q18 56 28 62" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <path d="M54 20 Q62 26 62 40 Q62 56 52 62" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" fill="none"/>
  <path d="M26 62 L34 70 L40 68 L46 70 L54 62" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" fill="none"/>
  <line x1="26" y1="22" x2="54" y2="22" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  <line x1="34" y1="24" x2="34" y2="64" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="40" y1="22" x2="40" y2="66" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="46" y1="24" x2="46" y2="64" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
  <ellipse cx="40" cy="14" rx="5" ry="4" stroke="currentColor" stroke-width="1.5"/>
</svg>`;
}

function _svgCaduceus() {
  return `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" class="hj-svg" aria-hidden="true">
  <line x1="40" y1="10" x2="40" y2="72" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  <path d="M33 30 Q28 20 36 15 Q46 13 46 23 Q46 32 36 34 Q27 36 27 45 Q27 55 40 57"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M47 30 Q52 20 44 15 Q34 13 34 23 Q34 32 44 34 Q53 36 53 45 Q53 55 40 57"
        stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <path d="M34 10 Q40 6 46 10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none"/>
  <ellipse cx="40" cy="10" rx="5" ry="3" stroke="currentColor" stroke-width="1.5"/>
</svg>`;
}
