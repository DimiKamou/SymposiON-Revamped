// ============================================================
//  SymposiON — Ναὸς τῶν Μουσῶν (Temple of the Muses)
//  REALM LOADER — the shared, admin-authored economy catalog.
//
//  One Firestore document, config/realm, drives every Temple surface:
//  pillars · cosmetics · boons · consumables · quests · saga ·
//  achievements · the realm theme. It is world-readable and
//  admin-writable (see firestore.rules → /config/{docId}).
//
//  This module:
//    • bundles REALM_DEFAULT (the factory seed) so every client has a
//      realm to render even before/without the Firestore doc,
//    • loads config/realm and attaches an onSnapshot listener so admin
//      edits in the Curator's Console reach players with no deploy,
//    • auto-seeds config/realm the first time an admin loads the site,
//    • exposes:  getRealm()            — the live, built read-model
//                realmItem(id)         — any catalog item by id
//                questsByCadence(c)    — pool filtered by 'daily'|'weekly'
//                rollCadence(c)        — weighted spawn of a rotation
//                rollQuests()          — { daily:[…], weekly:[…] }
//                onRealm(fn)/offRealm  — subscribe to live changes
//                initRealm()           — attach the Firestore listener
//
//  Load order: include BEFORE progression.js in index.html.
// ============================================================
(function () {
  'use strict';

  // ── small helpers ────────────────────────────────────────────
  const clone = o => (window.structuredClone ? structuredClone(o) : JSON.parse(JSON.stringify(o)));

  // ══════════════════════════════════════════════════════════════
  //  REALM_DEFAULT — the factory catalog (the immutable seed).
  //  config/realm, when present, overrides this. A realm is authored
  //  from these collections; the admin console mutates a clone of it.
  // ══════════════════════════════════════════════════════════════
  const ICON_NAMES = [
    'wreath', 'column', 'lightning', 'scroll', 'trophy', 'gear',
    'shield-round', 'helmet', 'labyrinth', 'trident', 'sword', 'runner',
    'timeline', 'cyclops-eye', 'acropolis', 'chariot', 'tablet', 'cards',
  ];

  /* the four core pillars (admin edits copy/icon; custom pillars add more) */
  const PILLARS = [
    { id: 'cosmetics',    el: 'Ἀφιερώματα', en: 'Cosmetics',    icon: 'column',    blurb: 'Dedications laid at the altar', core: true },
    { id: 'boons',        el: 'Εὐλογίες',   en: 'Boons',        icon: 'lightning', blurb: 'Favors of the gods',            core: true },
    { id: 'quests',       el: 'Ἆθλοι',      en: 'Quests',       icon: 'scroll',    blurb: 'Labors set before you',         core: true },
    { id: 'achievements', el: 'Τρόπαια',    en: 'Achievements', icon: 'trophy',    blurb: 'Trophies of a lifetime',        core: true },
  ];

  const COSMETIC_SLOTS = [
    { id: 'palette',  el: 'Χρώματα',   en: 'Palette',   icon: 'column' },
    { id: 'backdrop', el: 'Φόντο',     en: 'Backdrop',  icon: 'acropolis' },
    { id: 'particle', el: 'Σπινθῆρες', en: 'Particles', icon: 'lightning' },
    { id: 'sigil',    el: 'Σῆμα',      en: 'Sigil',     icon: 'wreath' },
  ];

  const COSMETICS = [
    { id: 'pal-obsidian', slot: 'palette', theme: 'obsidian', el: 'Ὀψιδιανός', en: 'Obsidian', price: 0,
      lore: 'Volcanic glass, candle-gold. The founding rite.', swatch: ['#0A0907', '#D2A24A', '#E07A3C'] },
    { id: 'pal-katabasis', slot: 'palette', theme: 'obsidian-katabasis', el: 'Κατάβασις', en: 'Katabasis', price: 1400,
      lore: 'The descent — amethyst dusk over ember.', swatch: ['#0C0810', '#ED7A28', '#8A63B6'] },
    { id: 'pal-solstice', slot: 'palette', theme: 'obsidian-solstice', el: 'Ἡλιοτρόπιον', en: 'Solstice', price: 1400,
      lore: 'Evergreen and gilt — the turning of the year.', swatch: ['#080B08', '#D8B45A', '#3C8459'] },
    { id: 'pal-orphic', slot: 'palette', theme: 'orphic', el: 'Ὀρφικὴ Νύξ', en: 'Orphic Night', price: 3200, sagaGate: 3,
      lore: 'Iridescence on black water. Sung into being.', swatch: ['#06080C', '#8E7FD6', '#6FC9B0'] },

    { id: 'bd-circle', slot: 'backdrop', el: 'Τελετουργικὸς Κύκλος', en: 'Ritual Circle', price: 0, kind: 'circle',
      lore: 'The slow-turning wheel of the rite.' },
    { id: 'bd-embers', slot: 'backdrop', el: 'Ἀνερχόμεναι Σπίθαι', en: 'Rising Embers', price: 900, kind: 'embers',
      lore: 'Sparks ascend from the altar fire.' },
    { id: 'bd-frieze', slot: 'backdrop', el: 'Μαρμάρινη Ζωφόρος', en: 'Marble Frieze', price: 900, kind: 'frieze',
      lore: 'A carved procession in pentelic stone.' },
    { id: 'bd-aether', slot: 'backdrop', el: 'Αἰθήρ', en: 'Aether Field', price: 2400, sagaGate: 4, kind: 'aether',
      lore: 'The upper air where the gods breathe.' },

    { id: 'pt-hearth', slot: 'particle', el: 'Σπινθῆρες Ἑστίας', en: 'Hearth Sparks', price: 0, tint: 'gold',
      lore: 'Warm sparks of the household fire.' },
    { id: 'pt-golddust', slot: 'particle', el: 'Χρυσόκονις', en: 'Gold Dust', price: 700, tint: 'goldLt',
      lore: 'Drifting motes of beaten gold.' },
    { id: 'pt-petals', slot: 'particle', el: 'Πέταλα', en: 'Falling Petals', price: 700, tint: 'terra',
      lore: 'Petals shaken from a votive garland.' },

    { id: 'sg-olive', slot: 'sigil', el: 'Στέφανος Ἐλαίας', en: 'Olive Wreath', price: 0, icon: 'wreath',
      lore: 'The victor’s crown of Olympia.' },
    { id: 'sg-laurel', slot: 'sigil', el: 'Δάφνη Δελφῶν', en: 'Laurel of Delphi', price: 1100, icon: 'trophy',
      lore: 'Apollo’s bay, won at the Pythian games.' },
  ];

  const LOADOUT_MAX = 3;

  const BOONS = [
    { id: 'bn-aristeia', el: 'Ἀριστεία', en: 'Aristeia', icon: 'sword', price: 1200,
      effect: 'Win streaks compound your Kleos yield.' },
    { id: 'bn-mnemosyne', el: 'Μνημοσύνη', en: 'Mnemosyne’s Favor', icon: 'tablet', price: 1500,
      effect: 'Keep half your streak through a single loss.' },
    { id: 'bn-momentum', el: 'Ὁρμή', en: 'Momentum', icon: 'chariot', price: 1000,
      effect: 'Combos build a quarter faster.' },
    { id: 'bn-foresight', el: 'Πρόνοια', en: 'Foresight', icon: 'cyclops-eye', price: 1800,
      effect: 'Glimpse the next trial before it begins.' },
    { id: 'bn-nemesis', el: 'Νέμεσις', en: 'Nemesis', icon: 'helmet', price: 1600,
      effect: 'Greater foes surrender greater glory.' },
  ];

  const CONSUMABLES = [
    { id: 'cs-breath', el: 'Δευτέρα Πνοή', en: 'Second Breath', icon: 'shield-round', price: 300, bundle: 3,
      effect: 'Rise once from a defeat.' },
    { id: 'cs-thread', el: 'Νῆμα Ἀριάδνης', en: 'Ariadne’s Thread', icon: 'labyrinth', price: 250, bundle: 3,
      effect: 'Escape a trial without penalty.' },
    { id: 'cs-oracle', el: 'Χρησμός', en: 'The Oracle', icon: 'cyclops-eye', price: 200, bundle: 5,
      effect: 'Reveal one hidden truth.' },
  ];

  /* QUESTS — a POOL of objectives. Each period the realm ROLLS a weighted
     subset (rollCadence) into rotation. Admin edits the pool + roll counts. */
  const QUESTS = [
    { id: 'q-duels',    cadence: 'daily',  weight: 4, el: 'Τρεῖς Μονομαχίαι', en: 'Win three duels',         icon: 'sword',        goal: 3,   reward: 120 },
    { id: 'q-streak',   cadence: 'daily',  weight: 3, el: 'Σειρὰ Δέκα',        en: 'Reach a streak of ten',   icon: 'lightning',    goal: 10,  reward: 200 },
    { id: 'q-drills',   cadence: 'daily',  weight: 5, el: 'Πέντε Ἀσκήσεις',    en: 'Finish five drills',      icon: 'tablet',       goal: 5,   reward: 150 },
    { id: 'q-modes',    cadence: 'daily',  weight: 3, el: 'Δύο Τρόποι',         en: 'Play in two modes',       icon: 'cards',        goal: 2,   reward: 100 },
    { id: 'q-flawless', cadence: 'daily',  weight: 2, el: 'Ἄπταιστος',         en: 'Win without a mistake',   icon: 'shield-round', goal: 1,   reward: 180 },
    { id: 'q-swift',    cadence: 'daily',  weight: 2, el: 'Ταχύτης',           en: 'Three swift victories',   icon: 'runner',       goal: 3,   reward: 160 },
    { id: 'w-marathon', cadence: 'weekly', weight: 4, el: 'Μαραθών',           en: 'Win twenty-five duels',   icon: 'runner',       goal: 25,  reward: 600 },
    { id: 'w-pantheon', cadence: 'weekly', weight: 3, el: 'Πάνθεον',           en: 'Play every discipline',   icon: 'acropolis',    goal: 6,   reward: 750 },
    { id: 'w-hecatomb', cadence: 'weekly', weight: 2, el: 'Ἑκατόμβη',          en: 'Offer a hundred drills',  icon: 'column',       goal: 100, reward: 900 },
    { id: 'w-unbroken', cadence: 'weekly', weight: 2, el: 'Ἄθραυστος',         en: 'Hold a streak of thirty', icon: 'lightning',    goal: 30,  reward: 1000 },
  ];

  const QUEST_ROTATION = { daily: 4, weekly: 2 };

  const SAGA = {
    el: 'Τὸ Ἔπος', en: 'The Epic',
    chapters: [
      { id: 's1', el: 'Ἀναχώρησις',  en: 'The Departure', goal: 4,  reward: 200 },
      { id: 's2', el: 'Κατάβασις',   en: 'The Descent',   goal: 6,  reward: 350, unlock: 'pal-katabasis' },
      { id: 's3', el: 'Ἡ Δοκιμασία', en: 'The Trial',     goal: 8,  reward: 500, unlock: 'pal-orphic' },
      { id: 's4', el: 'Αἰθήρ',       en: 'The Ascent',    goal: 10, reward: 700, unlock: 'bd-aether' },
      { id: 's5', el: 'Νόστος',      en: 'The Return',    goal: 12, reward: 1000 },
    ],
  };

  const ACH_DIMENSIONS = [
    { id: 'volume',     el: 'Πλῆθος',   en: 'Volume',     icon: 'acropolis' },
    { id: 'accuracy',   el: 'Ἀκρίβεια', en: 'Accuracy',   icon: 'lightning' },
    { id: 'speed',      el: 'Τάχος',    en: 'Speed',      icon: 'runner' },
    { id: 'mastery',    el: 'Δεινότης', en: 'Mastery',    icon: 'tablet' },
    { id: 'collection', el: 'Συλλογή',  en: 'Collection', icon: 'cards' },
  ];

  const ACHIEVEMENTS = [
    { id: 'a-centurion',  dim: 'volume',     el: 'Ἑκατοντάρχης', en: 'Centurion',       icon: 'shield-round', goal: 100, stat: 'wins',       note: 'One hundred victories.' },
    { id: 'a-myriad',     dim: 'volume',     el: 'Μυριάς',       en: 'The Myriad',      icon: 'acropolis',    goal: 500, stat: 'sessions',   note: 'Five hundred returns to the Temple.' },
    { id: 'a-unbroken',   dim: 'accuracy',   el: 'Ἄθραυστος',    en: 'Unbroken',        icon: 'lightning',    goal: 25,  stat: 'bestStreak', note: 'A streak of twenty-five.' },
    { id: 'a-hermes',     dim: 'speed',      el: 'Ἑρμῆς',        en: 'Swift as Hermes', icon: 'runner',       goal: 50,  stat: 'swift',      note: 'Fifty trials won against the clock.' },
    { id: 'a-polymath',   dim: 'mastery',    el: 'Πολυμαθής',    en: 'Polymath',        icon: 'tablet',       goal: 12,  stat: 'mastered',   note: 'Master every discipline.' },
    { id: 'a-connoisseur', dim: 'collection', el: 'Φιλόκαλος',   en: 'Connoisseur',     icon: 'cards',        goal: 10,  stat: 'owned',      note: 'Gather ten dedications.' },
  ];

  /* CUSTOM PILLARS — admin-authored side panels holding "offerings"
     (generic unlockables: buy → own, optionally equip one as active). */
  const CUSTOM_PILLARS = [
    { id: 'oracles', el: 'Μαντεῖα', en: 'Oracles', icon: 'cyclops-eye', blurb: 'Voices that read the future',
      equipModel: 'single',
      offerings: [
        { id: 'or-delphi',     el: 'Δελφοί',     en: 'Oracle of Delphi',   icon: 'acropolis', price: 0,    lore: 'The Pythia’s smoke-wreathed verses.' },
        { id: 'or-dodona',     el: 'Δωδώνη',     en: 'Whispering Oaks',    icon: 'column',    price: 1200, lore: 'Zeus speaks through rustling leaves.' },
        { id: 'or-trophonius', el: 'Τροφώνιος',  en: 'Cave of Trophonius', icon: 'labyrinth', price: 2600, sagaGate: 3, lore: 'None who descend return unchanged.' },
      ] },
  ];

  const STAT_CARDS = [
    { key: 'kleosLifetime', el: 'Κλέος αἰώνιον', en: 'Lifetime Glory', fmt: 'kleos' },
    { key: 'sessions',      el: 'Ἐπιστροφαί',    en: 'Sessions' },
    { key: 'bestStreak',    el: 'Μεγίστη Σειρά',  en: 'Best Streak' },
    { key: 'hours',         el: 'Ὧραι',          en: 'Hours in Rite', suffix: 'h' },
    { key: 'accuracy',      el: 'Ἀκρίβεια',      en: 'Accuracy', suffix: '%' },
  ];

  const REALM_THEME = 'obsidian';

  /* ════════════════ GAME REWARDS · per-game XP / drachma economy ════════════════
     Each entry tunes what a game pays out, with no per-game code. The reward
     engine (progression.js → awardGameRewards) reads gameReward(id), which
     merges the matching entry over the `default` entry. A finished game passes
     its performance (score, bestStreak, swift, perfect); the engine computes:
       xp       = baseXp + xpPerScore·score + xpPerStreak·bestStreak
                  + (swift?swiftXp:0) + (perfect?perfectXp:0)
       drachmas = baseDrachmas + drachmasPerScore·score + (perfect?perfectDrachmas:0)
     then adds the first-clear-of-week bonus and clamps to the weekly cap
     (0 = uncapped). The weekly ledger refills every Sunday. */
  const GAME_REWARDS = [
    { id: 'default', el: 'Προεπιλογή', en: 'Default (all games)',
      baseXp: 0, xpPerScore: 15, xpPerStreak: 5, swiftXp: 10, perfectXp: 10,
      baseDrachmas: 3, drachmasPerScore: 0, perfectDrachmas: 3,
      weeklyBonusXp: 25, weeklyBonusDrachmas: 10,
      weeklyCapXp: 0, weeklyCapDrachmas: 0 },
    { id: 'live-arena', el: 'Ζωντανή Ἀρένα', en: 'Live Arena',
      baseXp: 15, xpPerScore: 0, xpPerStreak: 0, swiftXp: 0, perfectXp: 0,
      baseDrachmas: 1, drachmasPerScore: 0, perfectDrachmas: 0,
      weeklyBonusXp: 0, weeklyBonusDrachmas: 0,
      weeklyCapXp: 0, weeklyCapDrachmas: 0 },
    { id: 'iliada-arcade', el: 'Ἰλιὰς Arcade', en: 'Iliad Arcade',
      xpPerScore: 20, baseDrachmas: 5, drachmasPerScore: 1, perfectXp: 10, perfectDrachmas: 5 },
    { id: 'review-hub', el: 'Τάρταρος', en: 'Tartarus Review',
      xpPerScore: 10, perfectXp: 20, baseDrachmas: 2, perfectDrachmas: 3,
      weeklyBonusXp: 0, weeklyBonusDrachmas: 0 },
    // point-scored quizzes — `score` is points (10+/correct), so a small
    // per-point coefficient keeps payouts in line with the drill games.
    { id: 'iliada-trivia', el: 'Trivia Ἰλιάδος', en: 'Iliad Trivia',
      xpPerScore: 1, drachmasPerScore: 0, baseDrachmas: 3, perfectXp: 20, perfectDrachmas: 3 },
    { id: 'odyssey-trivia', el: 'Trivia Ὀδυσσείας', en: 'Odyssey Trivia',
      xpPerScore: 1, drachmasPerScore: 0, baseDrachmas: 3, perfectXp: 20, perfectDrachmas: 3 },
    // ── arcade games: `score` is points (hundreds–thousands), so a small
    //    per-point coefficient keeps XP in line with the drill games ──
    { id: 'temple-run', el: 'Δρόμος Ναοῦ', en: 'Temple Run',
      xpPerScore: 0.05, drachmasPerScore: 0, baseDrachmas: 3, perfectXp: 25 },
    { id: 'invaders', el: 'Εἰσβολεῖς', en: 'Invaders',
      xpPerScore: 0.05, drachmasPerScore: 0, baseXp: 10, baseDrachmas: 3 },
    { id: 'crypto-hack', el: 'Κρυπτογράφος', en: 'Crypto Hack',
      xpPerScore: 0.03, drachmasPerScore: 0, baseDrachmas: 3, perfectXp: 25 },
    { id: 'labyrinth', el: 'Λαβύρινθος', en: 'Labyrinth',
      xpPerScore: 0.08, drachmasPerScore: 0, baseDrachmas: 3, perfectXp: 25 },
    { id: 'rapid-fire', el: 'Καταιγισμός', en: 'Rapid Fire',
      xpPerScore: 0.05, drachmasPerScore: 0, baseDrachmas: 3 },
    { id: 'epic-puzzle', el: 'Γρῖφος', en: 'Epic Puzzle',
      xpPerScore: 1, baseDrachmas: 3, perfectXp: 25 },
    { id: 'naumachia', el: 'Ναυμαχία', en: 'Naumachia',
      xpPerScore: 6, baseDrachmas: 3, perfectXp: 20 },
    { id: 'blade', el: 'Ξίφος', en: 'Blade',
      xpPerScore: 2, baseDrachmas: 3, perfectXp: 20 },
    // study/flashcards: `score` is CUMULATIVE cards mastered — cap it so the
    // running total can't be farmed each session.
    { id: 'study', el: 'Μελέτη', en: 'Flashcards',
      xpPerScore: 2, baseDrachmas: 0, weeklyBonusXp: 0, weeklyBonusDrachmas: 0,
      weeklyCapXp: 120, weeklyCapDrachmas: 20 },
  ];

  const REALM_DEFAULT = {
    ICON_NAMES,
    pillars:       PILLARS,
    cosmeticSlots: COSMETIC_SLOTS,
    cosmetics:     COSMETICS,
    loadoutMax:    LOADOUT_MAX,
    boons:         BOONS,
    consumables:   CONSUMABLES,
    quests:        QUESTS,
    questRotation: QUEST_ROTATION,
    saga:          SAGA,
    achDimensions: ACH_DIMENSIONS,
    achievements:  ACHIEVEMENTS,
    customPillars: CUSTOM_PILLARS,
    statCards:     STAT_CARDS,
    gameRewards:   GAME_REWARDS,
    realmTheme:    REALM_THEME,
  };

  // ── merge a stored catalog over the factory default so new keys survive ──
  function hydrate(stored) {
    const d = clone(REALM_DEFAULT);
    if (!stored || typeof stored !== 'object') return d;
    const out = { ...d, ...stored };
    ['pillars', 'cosmeticSlots', 'cosmetics', 'boons', 'consumables', 'quests',
     'achDimensions', 'achievements', 'customPillars', 'statCards', 'gameRewards', 'ICON_NAMES'].forEach(k => {
      if (!Array.isArray(out[k])) out[k] = d[k];
    });
    if (!out.saga || typeof out.saga !== 'object') out.saga = d.saga;
    if (!out.questRotation || typeof out.questRotation !== 'object') out.questRotation = d.questRotation;
    if (out.loadoutMax == null) out.loadoutMax = d.loadoutMax;
    if (!out.realmTheme) out.realmTheme = d.realmTheme;
    // Forward-fill any game reward entries added to the factory default that the
    // stored Firestore snapshot doesn't have yet — avoids a manual admin save
    // every time a new game is wired to the reward engine.
    if (Array.isArray(out.gameRewards) && Array.isArray(d.gameRewards)) {
      const storedIds = new Set(out.gameRewards.map(g => g && g.id));
      d.gameRewards.forEach(g => { if (g && g.id && !storedIds.has(g.id)) out.gameRewards.push(g); });
    }
    return out;
  }

  // ── build the LIVE read-model from an editable catalog ──
  function build(cat) {
    const byId = {};
    const reg = arr => (arr || []).forEach(x => { if (x && x.id) byId[x.id] = x; });
    reg(cat.cosmetics); reg(cat.boons); reg(cat.consumables);
    (cat.customPillars || []).forEach(p => reg(p.offerings));

    const corePillars   = (cat.pillars || []).map(p => ({ ...p, core: true }));
    const customPillars = (cat.customPillars || []).map(p => ({ ...p, custom: true }));
    const PILLARS_LIVE  = [...corePillars, ...customPillars];

    const questsByCadence = c => (cat.quests || []).filter(q => q.cadence === c);

    // per-game reward params: the matching entry merged over `default`
    const grById = {};
    (cat.gameRewards || []).forEach(g => { if (g && g.id) grById[g.id] = g; });
    const gameReward = gid => Object.assign({}, grById.default || {}, grById[gid] || {});

    return {
      ...cat,
      // UPPERCASE aliases (read by the player components)
      PILLARS:        PILLARS_LIVE,
      COSMETIC_SLOTS: cat.cosmeticSlots,
      COSMETICS:      cat.cosmetics,
      BOONS:          cat.boons,
      CONSUMABLES:    cat.consumables,
      SAGA:           cat.saga,
      ACH_DIMENSIONS: cat.achDimensions,
      ACHIEVEMENTS:   cat.achievements,
      STAT_CARDS:     cat.statCards,
      LOADOUT_MAX:    cat.loadoutMax,
      QUESTS:         cat.quests,
      // helpers
      corePillars, customPillars,
      questsByCadence,
      gameReward,
      customPillar: id => (cat.customPillars || []).find(p => p.id === id),
      byId,
      item: id => byId[id],
    };
  }

  // ── live state ────────────────────────────────────────────────
  let _catalog = clone(REALM_DEFAULT);
  let _realm   = build(_catalog);
  const _subs  = new Set();

  function _emit() {
    _realm = build(_catalog);
    _subs.forEach(fn => { try { fn(_realm, _catalog); } catch (e) {} });
  }

  // ── weighted quest rotation (random daily/weekly spawn) ──
  // Ported verbatim from the prototype config.js.
  function rollCadence(cadence) {
    const pool = (_catalog.quests || []).filter(q => q.cadence === cadence && q.enabled !== false);
    const want = Math.min((_catalog.questRotation && _catalog.questRotation[cadence]) || 0, pool.length);
    const picked = [];
    const bag = pool.map(q => ({ id: q.id, w: Math.max(0.0001, q.weight || 1) }));
    let total = bag.reduce((s, b) => s + b.w, 0);
    while (picked.length < want && bag.length) {
      let r = Math.random() * total, i = 0;
      while (i < bag.length - 1 && (r -= bag[i].w) > 0) i++;
      picked.push(bag[i].id); total -= bag[i].w; bag.splice(i, 1);
    }
    return picked;
  }
  function rollQuests() { return { daily: rollCadence('daily'), weekly: rollCadence('weekly') }; }

  // ── Firestore sync ───────────────────────────────────────────
  const REALM_DOC = ['config', 'realm'];
  let _listening = false;

  function _realmRef() { return firebase.firestore().collection(REALM_DOC[0]).doc(REALM_DOC[1]); }

  function initRealm() {
    if (_listening) return;
    if (typeof firebase === 'undefined' || !firebase.firestore) return; // retried below
    _listening = true;
    try {
      _realmRef().onSnapshot(snap => {
        if (snap.exists) {
          _catalog = hydrate(snap.data());
          _emit();
        } else {
          // No realm published yet. Keep the bundled default; an admin seeds it.
          if (typeof isAdmin !== 'undefined' && isAdmin) _seedRealm();
        }
      }, err => {
        console.warn('[realm] snapshot failed — using bundled default', err);
      });
    } catch (e) {
      _listening = false;
      console.warn('[realm] listener attach failed', e);
    }
  }

  // Admin-only: publish the bundled default to config/realm the first time.
  function _seedRealm() {
    if (typeof isAdmin === 'undefined' || !isAdmin) return;
    _realmRef().set(clone(REALM_DEFAULT))
      .then(() => console.info('[realm] seeded config/realm with factory default'))
      .catch(err => console.warn('[realm] seed failed', err));
  }

  // Admin-only: persist an edited catalog (used by the Curator's Console).
  function saveRealm(next) {
    if (typeof isAdmin === 'undefined' || !isAdmin) return Promise.reject(new Error('not-admin'));
    const cat = hydrate(next);
    return _realmRef().set(cat); // onSnapshot will fan the change back to us
  }

  // Apply an edited catalog to the LIVE model immediately, without waiting on
  // Firestore — gives the Curator's Console an instant local preview. A
  // debounced saveRealm() then persists it (and the onSnapshot echo re-applies
  // the same data, so this never drifts from the server copy).
  function applyLocal(next) { _catalog = hydrate(next); _emit(); }

  // ── public API ───────────────────────────────────────────────
  window.getRealm        = () => _realm;
  window.realmItem       = id => _realm.byId[id];
  window.questsByCadence = c => _realm.questsByCadence(c);
  window.rollCadence     = rollCadence;
  window.rollQuests      = rollQuests;
  window.onRealm         = fn => { _subs.add(fn); return () => _subs.delete(fn); };
  window.offRealm        = fn => _subs.delete(fn);
  window.initRealm       = initRealm;
  window.REALM_DEFAULT   = REALM_DEFAULT;
  // Authoring surface for the admin console (Step 7):
  window.RealmStore = {
    getCatalog: () => clone(_catalog),
    default:    () => clone(REALM_DEFAULT),
    save:       saveRealm,
    applyLocal: applyLocal,
    seed:       _seedRealm,
    rollQuests, rollCadence,
  };

  // ── attach the listener as soon as Firebase is ready ──
  // Firebase compat may finish initialising slightly after this script runs,
  // so retry briefly until firebase.firestore is available.
  (function _autoInit(tries) {
    if (typeof firebase !== 'undefined' && firebase.firestore) { initRealm(); return; }
    if (tries <= 0) return;
    setTimeout(() => _autoInit(tries - 1), 120);
  })(40);
})();
