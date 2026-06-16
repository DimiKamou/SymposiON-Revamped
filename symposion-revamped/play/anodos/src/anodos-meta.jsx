/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — META-PROGRESSION (Κλέος · persistent reward economy)
   · κλέος currency · cosmetic unlocks · boosts/lifelines · quests · achievements
   Plain data + a useMeta() hook + a pure applyEvent() reducer.
   ════════════════════════════════════════════════════════════════════ */
const META_KEY = "anodos-meta-v1";

/* ── COSMETICS (unlocked with κλέος, equipped in 4 slots) ──────────────
   slot: palette | backdrop | particles | path
   base:true items are always owned (the 3 original themes + defaults).  */
const COSMETICS = [
  // palettes ──────────────────────────────────────────────
  { id: "obsidian", slot: "palette", base: true, icon: "🜃", name: "Ὀψιδιανός", en: "Obsidian", note: "Μαῦρο ἡφαιστειακὸ γυαλί.", swatch: ["#0D0B09", "#C87830"] },
  { id: "aegean",   slot: "palette", base: true, icon: "🌊", name: "Αἰγαῖον", en: "Aegean", note: "Βαθὺ θαλασσὶ καὶ χρυσός.", swatch: ["#0B1018", "#D2B36A"] },
  { id: "amphora",  slot: "palette", base: true, icon: "🏺", name: "Ἀμφορεύς", en: "Amphora", note: "Μελανόμορφο πηλὸ καὶ ὤχρα.", swatch: ["#15100A", "#D49A2A"] },
  { id: "tyrian",   slot: "palette", price: 140, icon: "👑", name: "Πορφύρα", en: "Tyrian Purple", note: "Ἡ πορφύρα τοῦ μύρηκος — χρῶμα βασιλέων.", swatch: ["#140A16", "#B5479C"] },
  { id: "bronze",   slot: "palette", price: 160, icon: "🛡", name: "Χαλκὸς Πατίνας", en: "Bronze Patina", note: "Παλαιωμένος χαλκὸς καὶ πράσινη σκουριά.", swatch: ["#0C100C", "#B6863A"] },
  { id: "dawn",     slot: "palette", price: 180, icon: "🌅", name: "Ῥοδοδάκτυλος Ἠώς", en: "Rosy Dawn", note: "Ἡ ροδίσια αὐγὴ ἁπλώνεται.", swatch: ["#161013", "#E0708A"] },
  { id: "nyx",      slot: "palette", price: 220, icon: "🌑", name: "Νὺξ Ἀβύσσου", en: "Abyssal Night", note: "Τὸ φῶς τοῦ Κάτω Κόσμου.", swatch: ["#07060E", "#8C7AC0"] },
  // backdrops ─────────────────────────────────────────────
  { id: "ritual",         slot: "backdrop", base: true, icon: "◎", name: "Τελετουργικὸς Κύκλος", en: "Ritual Circle", note: "Ὁ περιστρεφόμενος κύκλος τῶν μυστηρίων." },
  { id: "constellations", slot: "backdrop", price: 110, icon: "✦", name: "Ἀστερισμοί", en: "Constellations", note: "Ὁ οὐρανὸς τῆς Ἀρκτούρου καὶ τῶν Πλειάδων." },
  { id: "aurora",         slot: "backdrop", price: 150, icon: "🌌", name: "Σέλας", en: "Aurora", note: "Ρεύματα φωτὸς ποὺ κυλοῦν στὸν αἰθέρα." },
  { id: "marble",         slot: "backdrop", price: 170, icon: "🏛", name: "Μάρμαρον", en: "Veined Marble", note: "Φλέβες πεντελικοῦ μαρμάρου." },
  { id: "sea",            slot: "backdrop", price: 130, icon: "⌇", name: "Πέλαγος", en: "The Sea", note: "Τὰ κύματα τοῦ οἰνοπόντου Αἰγαίου." },
  // particles ─────────────────────────────────────────────
  { id: "embers", slot: "particles", base: true, icon: "🔥", name: "Σπινθῆρες", en: "Embers", note: "Ἀνερχόμενες σπίθες." },
  { id: "none",   slot: "particles", base: true, icon: "∅", name: "Καθαρὸς Ἀήρ", en: "Still Air", note: "Κανένα σωματίδιο." },
  { id: "petals", slot: "particles", price: 80,  icon: "🌿", name: "Φύλλα Δάφνης", en: "Laurel Fall", note: "Φύλλα δάφνης ποὺ πέφτουν.", },
  { id: "ash",    slot: "particles", price: 90,  icon: "❄", name: "Τέφρα", en: "Drifting Ash", note: "Ἀργὴ στάχτη ποὺ κατεβαίνει." },
  { id: "motes",  slot: "particles", price: 120, icon: "✺", name: "Πυγολαμπίδες", en: "Fireflies", note: "Αἰωρούμενα φωτεινὰ μόρια." },
  // path skins ────────────────────────────────────────────
  { id: "gold",    slot: "path", base: true, icon: "〜", name: "Χρυσὸ Μονοπάτι", en: "Gilded Path", note: "Ὁ κλασικὸς χρυσὸς δρόμος." },
  { id: "laurel",  slot: "path", price: 70,  icon: "〜", name: "Δάφνινο Μονοπάτι", en: "Laurel Path", note: "Πράσινο μονοπάτι νίκης." },
  { id: "stone",   slot: "path", price: 80,  icon: "〜", name: "Μαρμάρινο Μονοπάτι", en: "Marble Path", note: "Λευκὴ λίθινη ὁδός." },
  { id: "ichor",   slot: "path", price: 100, icon: "〜", name: "Ἰχὼρ τῶν Θεῶν", en: "Ichor Path", note: "Τὸ γαλάζιο αἷμα τῶν ἀθανάτων." },
  { id: "starlit", slot: "path", price: 120, icon: "〜", name: "Ἀστρόφωτο Μονοπάτι", en: "Starlit Path", note: "Δρόμος ἀπὸ ἄστρα." },
];
const COSMETIC_SLOTS = [
  { slot: "palette",   label: "Χρῶμα",       en: "Palette" },
  { slot: "backdrop",  label: "Φόντο",       en: "Backdrop" },
  { slot: "particles", label: "Σωματίδια",   en: "Particles" },
  { slot: "path",      label: "Μονοπάτι",    en: "Map path" },
];

/* ── BOOSTS — start-of-run perks (permanent unlock, equip up to 2) ──── */
const BOOSTS = [
  { id: "vigor",    icon: "🜂", name: "Σθένος",        en: "Vigor",     price: 130, desc: "Ξεκινᾷς μὲ +20 ἀνώτατο μένος.", enDesc: "Begin each climb with +20 max spirit." },
  { id: "purse",    icon: "🪙", name: "Θησαυρός",      en: "Full Purse",price: 110, desc: "Ξεκινᾷς μὲ +45 δραχμές.", enDesc: "Begin with +45 drachmas." },
  { id: "heirloom", icon: "🏺", name: "Κειμήλιον",     en: "Heirloom",  price: 200, desc: "Ξεκινᾷς μὲ ἕνα τυχαῖο περίαπτο.", enDesc: "Begin each climb holding a random relic." },
  { id: "scholar",  icon: "📜", name: "Σοφία",         en: "Scholar",   price: 170, desc: "+25% δόξα (XP) σὲ ὅλη τὴν ἄνοδο.", enDesc: "+25% glory (XP) for the whole climb." },
  { id: "ward",     icon: "🛡", name: "Ἀλεξητήριον",  en: "Warding",   price: 150, desc: "Ἄνοσος στὸ πρῶτο μίασμα κάθε ἀνόδου.", enDesc: "Immune to the first curse each climb." },
];

/* ── LIFELINES / CHEATS — consumable charges, used inside battle ─────── */
const LIFELINES = [
  { id: "oracle",     icon: "🔮", name: "Χρησμός",     en: "Oracle",     price: 30, kind: "lifeline", desc: "Ἀποκάλυψε μιὰ ὑπόδειξη.", enDesc: "Reveal a hint for the question." },
  { id: "halving",    icon: "⚖", name: "Δίχασις",     en: "50 / 50",    price: 45, kind: "lifeline", desc: "Σβῆσε δύο λάθος ἀπαντήσεις.", enDesc: "Strike out two wrong answers." },
  { id: "mnemosyne",  icon: "👁", name: "Μνημοσύνη",   en: "Mnemosyne",  price: 70, kind: "cheat",    desc: "Φανέρωσε τὴ σωστὴ ἀπάντηση.", enDesc: "Reveal the correct answer (a cheat).", },
];
const LIFELINE_IDS = LIFELINES.map((l) => l.id);

/* ── ACHIEVEMENTS — auto-granted at threshold (κλέος reward) ─────────── */
const ACHIEVEMENTS = [
  { id: "climb_i",    group: "Ἄνοδος",   icon: "⛰", name: "Πρῶτα Βήματα",   en: "First Steps",     desc: "Ἀνέβα 25 κόμβους συνολικά.",        stat: "tiles",    goal: 25,  reward: 40 },
  { id: "climb_ii",   group: "Ἄνοδος",   icon: "⛰", name: "Ἀκούραστος",     en: "Tireless",        desc: "Ἀνέβα 100 κόμβους συνολικά.",       stat: "tiles",    goal: 100, reward: 90 },
  { id: "climb_iii",  group: "Ἄνοδος",   icon: "⛰", name: "Ὀρειβάτης",      en: "Mountaineer",     desc: "Ἀνέβα 300 κόμβους συνολικά.",       stat: "tiles",    goal: 300, reward: 200 },
  { id: "sage_i",     group: "Σοφία",    icon: "📜", name: "Μαθητής",        en: "Pupil",           desc: "Ἀπάντησε σωστὰ 50 φορές.",          stat: "correct",  goal: 50,  reward: 50 },
  { id: "sage_ii",    group: "Σοφία",    icon: "📜", name: "Ῥαψῳδός",        en: "Rhapsode",        desc: "Ἀπάντησε σωστὰ 250 φορές.",         stat: "correct",  goal: 250, reward: 120 },
  { id: "streak_i",   group: "Σοφία",    icon: "✦", name: "Ἀλάνθαστος",     en: "Unerring",        desc: "Σερὶ 10 σωστῶν ἀπαντήσεων.",        stat: "bestStreak", goal: 10, reward: 60 },
  { id: "streak_ii",  group: "Σοφία",    icon: "✦", name: "Σοφὸς Νέστωρ",   en: "Wise as Nestor",  desc: "Σερὶ 25 σωστῶν ἀπαντήσεων.",        stat: "bestStreak", goal: 25, reward: 140 },
  { id: "riddle_i",   group: "Αἰνίγματα",icon: "𓁹", name: "Λύτης",          en: "Riddler",         desc: "Λῦσε 5 αἰνίγματα.",                 stat: "riddles",  goal: 5,   reward: 60 },
  { id: "riddle_ii",  group: "Αἰνίγματα",icon: "𓁹", name: "Οἰδίπους",       en: "Oedipus",         desc: "Λῦσε 20 αἰνίγματα.",                stat: "riddles",  goal: 20,  reward: 150 },
  { id: "swift_i",    group: "Ταχύτης",  icon: "🪶", name: "Ποδάρκης",       en: "Swift-footed",    desc: "10 ἀστραπιαῖες ἀπαντήσεις (<2.5″).",stat: "fast",     goal: 10,  reward: 70 },
  { id: "boss_i",     group: "Πόλεμος",  icon: "♛", name: "Ἀρχοντοκτόνος",  en: "Boss-slayer",     desc: "Νίκησε 5 ἄρχοντες.",                stat: "bosses",   goal: 5,   reward: 80 },
  { id: "flawless_i", group: "Πόλεμος",  icon: "🏛", name: "Ἄψογος",         en: "Flawless",        desc: "3 νίκες χωρὶς καμία πληγή.",        stat: "flawless", goal: 3,   reward: 100 },
  { id: "collector",  group: "Περίαπτα", icon: "❣", name: "Συλλέκτης",      en: "Collector",       desc: "Συγκέντρωσε καὶ τὰ 10 περίαπτα.",   stat: "relicsCount", goal: 10, reward: 180 },
  { id: "enduring",   group: "Περίαπτα", icon: "🩸", name: "Καρτερικός",     en: "Enduring",        desc: "Ἄντεξε 15 μιάσματα.",               stat: "cursesEndured", goal: 15, reward: 90 },
  { id: "victor",     group: "Δόξα",     icon: "🏆", name: "Νικητής",        en: "Victor",          desc: "Ὁλοκλήρωσε μιὰ πλήρη ἄνοδο.",       stat: "wins",     goal: 1,   reward: 120 },
  { id: "ascendant",  group: "Δόξα",     icon: "🏆", name: "Ἀνελθών",        en: "Ascendant",       desc: "Κέρδισε 5 πλήρεις ἀνόδους.",        stat: "wins",     goal: 5,   reward: 260 },
];

/* ── QUESTS — daily rotating (3 active), event-counted, manual claim ─── */
const QUESTS = {
  q_riddle3:  { icon: "𓁹", name: "Τὸ Αἴνιγμα τῆς Σφιγγός", en: "Sphinx's Test",   desc: "Λῦσε 3 αἰνίγματα.",          goal: 3,  reward: 35, match: (e, p) => e === "riddle" && p.solved },
  q_flawless: { icon: "🏛", name: "Ἄνευ Πληγῆς",            en: "Without a Scratch",desc: "Κέρδισε μιὰ μάχη ἄψογα.",    goal: 1,  reward: 40, match: (e, p) => e === "battleWin" && p.flawless },
  q_climb12:  { icon: "⛰", name: "Ἡ Μακρὰ Ἄνοδος",         en: "The Long Climb",  desc: "Ἀνέβα 12 κόμβους.",          goal: 12, reward: 30, match: (e) => e === "tile" },
  q_correct:  { icon: "📜", name: "Σχολὴ τῶν Μουσῶν",       en: "School of Muses", desc: "Ἀπάντησε σωστὰ 15 φορές.",   goal: 15, reward: 35, match: (e, p) => e === "answer" && p.correct },
  q_duel:     { icon: "🎯", name: "Μονοθέσιον",             en: "Sudden Death",    desc: "Κέρδισε 2 μονοθέσια.",        goal: 2,  reward: 45, match: (e, p) => e === "battleWin" && p.format === "duel" },
  q_elite:    { icon: "☠", name: "Κατὰ τοῦ Ἀρίστου",       en: "Slay an Elite",   desc: "Νίκησε 1 ἐλὶτ ἐχθρό.",        goal: 1,  reward: 40, match: (e, p) => e === "battleWin" && p.kind === "elite" },
  q_boss2:    { icon: "♛", name: "Πτῶσις Ἀρχόντων",         en: "Topple Lords",    desc: "Νίκησε 2 ἄρχοντες.",          goal: 2,  reward: 60, match: (e, p) => e === "battleWin" && p.kind === "boss" },
  q_swift:    { icon: "🪶", name: "Ταχεῖα Χείρ",            en: "Swift Hand",      desc: "6 ἀστραπιαῖες ἀπαντήσεις.",   goal: 6,  reward: 40, match: (e, p) => e === "answer" && p.fast },
  q_relic3:   { icon: "❣", name: "Τὰ Δῶρα τῶν Θεῶν",        en: "Gifts of the Gods",desc: "Ἀπόκτησε 3 περίαπτα.",       goal: 3,  reward: 40, match: (e) => e === "relic" },
  q_walls:    { icon: "🏯", name: "Πρὸς τὰ Τείχη",          en: "To the Walls",    desc: "Φτάσε στὸ Β΄ Μέρος.",         goal: 1,  reward: 30, match: (e, p) => e === "act" && p.act >= 2 },
};
const QUEST_IDS = Object.keys(QUESTS);

/* ── QUESTLINE — a single arc that advances across many runs ─────────── */
const QUESTLINE = [
  { id: "ql1", icon: "🩸", name: "Πρῶτον Αἷμα",       en: "First Blood",     desc: "Κέρδισε τὴν πρώτη σου μάχη.",        stat: "battles", goal: 1,  reward: 30 },
  { id: "ql2", icon: "🏯", name: "Πρὸς τὰ Τείχη",     en: "To the Walls",    desc: "Φτάσε στὸ Β΄ Μέρος μιᾶς ἀνόδου.",   stat: "maxAct",  goal: 2,  reward: 50 },
  { id: "ql3", icon: "☠", name: "Ὁ Ἄριστος",         en: "The Champion",    desc: "Νίκησε ἕναν ἐλὶτ ἐχθρό.",            stat: "elites",  goal: 1,  reward: 60 },
  { id: "ql4", icon: "♛", name: "Πτῶσις Ἄρχοντος",   en: "A Lord Falls",    desc: "Νίκησε ἕναν ἄρχοντα-ἀφέντη.",        stat: "bosses",  goal: 1,  reward: 90 },
  { id: "ql5", icon: "𓁹", name: "Ἀνὴρ Αἰνιγμάτων",   en: "Man of Riddles",  desc: "Λῦσε 8 αἰνίγματα συνολικά.",         stat: "riddles", goal: 8,  reward: 80 },
  { id: "ql6", icon: "🏛", name: "Ἡ Ἀκρόπολις",       en: "The Citadel",     desc: "Ὁλοκλήρωσε μιὰ πλήρη ἄνοδο.",        stat: "wins",    goal: 1,  reward: 200, unlock: "tyrian" },
  { id: "ql7", icon: "🏆", name: "Ἥρως Ἀθάνατος",     en: "Deathless Hero",  desc: "Κέρδισε 3 πλήρεις ἀνόδους.",         stat: "wins",    goal: 3,  reward: 400, unlock: "constellations" },
];

/* ── default persistent state ──────────────────────────────────────── */
function freshStats() {
  return {
    tiles: 0, correct: 0, answers: 0, riddles: 0, bosses: 0, flawless: 0,
    fast: 0, runs: 0, wins: 0, cursesEndured: 0, drachmesSpent: 0,
    bestStreak: 0, curStreak: 0, battles: 0, elites: 0, maxAct: 1,
    relicIds: [],
  };
}
function metaDefaults() {
  return {
    kleos: 0, lifetimeKleos: 0, lastRunKleos: 0,
    palette: "obsidian", backdrop: "ritual", particles: "embers", path: "gold",
    owned: {},                 // cosmetic id -> true
    boostsOwned: {},           // boost id -> true
    loadout: [],               // equipped boost ids (max 2)
    lifelines: { oracle: 1, halving: 1, mnemosyne: 0 },  // a couple to taste
    stats: freshStats(),
    ach: {},                   // id -> true (granted)
    quests: { active: [], rotatedAt: 0 },
    ql: 0, qlSeen: 0,
    seenHub: false,
    // ── ascension ladder ──
    anabasis: 0,               // currently selected climb level
    anabasisMax: 0,            // highest tier unlocked (win to raise)
    // ── chronicle ──
    ledger: [],                // last ~20 finished climbs
    winStreak: 0, bestWinStreak: 0,
    daily: { date: "", bestXp: 0, bestTiles: 0, attempts: 0, won: false },
  };
}

function loadMeta() {
  try {
    const s = JSON.parse(localStorage.getItem(META_KEY));
    if (s && typeof s.kleos === "number") {
      const d = metaDefaults();
      return { ...d, ...s, stats: { ...d.stats, ...(s.stats || {}) }, lifelines: { ...d.lifelines, ...(s.lifelines || {}) }, quests: { ...d.quests, ...(s.quests || {}) }, daily: { ...d.daily, ...(s.daily || {}) }, ledger: Array.isArray(s.ledger) ? s.ledger : [] };
    }
  } catch (e) {}
  return metaDefaults();
}
function saveMeta(m) { try { localStorage.setItem(META_KEY, JSON.stringify(m)); } catch (e) {} }

/* ── stat resolver (achievements + questline read thresholds) ───────── */
function statVal(stats, key) {
  if (key === "relicsCount") return (stats.relicIds || []).length;
  return stats[key] || 0;
}
function isOwned(meta, id) {
  const c = COSMETICS.find((x) => x.id === id);
  return !!(c && (c.base || meta.owned[id]));
}

/* ── quest rotation ────────────────────────────────────────────────── */
function rollQuests(prevActive) {
  const keep = new Set();
  const pool = [...QUEST_IDS];
  for (let i = pool.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [pool[i], pool[j]] = [pool[j], pool[i]]; }
  return pool.slice(0, 3).map((id) => ({ id, prog: 0, done: false, claimed: false }));
}
function ensureQuests(meta) {
  const stale = !meta.quests.active.length || (Date.now() - (meta.quests.rotatedAt || 0)) > 20 * 3600 * 1000;
  if (!stale) return meta;
  return { ...meta, quests: { active: rollQuests(meta.quests.active), rotatedAt: Date.now() } };
}

/* ── the pure reducer: fold a gameplay event into meta ──────────────── *
   returns { meta, notices } — notices are celebration cards for the UI. */
function applyEvent(meta, ev, payload = {}) {
  const notices = [];
  const s = { ...meta.stats, relicIds: [...(meta.stats.relicIds || [])] };

  switch (ev) {
    case "tile": s.tiles += 1; break;
    case "act": s.maxAct = Math.max(s.maxAct, payload.act || 1); break;
    case "answer":
      s.answers += 1;
      if (payload.correct) { s.correct += 1; s.curStreak += 1; s.bestStreak = Math.max(s.bestStreak, s.curStreak); if (payload.fast) s.fast += 1; }
      else s.curStreak = 0;
      break;
    case "riddle": if (payload.solved) s.riddles += 1; break;
    case "battleWin":
      s.battles += 1;
      if (payload.kind === "boss") s.bosses += 1;
      if (payload.kind === "elite") s.elites += 1;
      if (payload.flawless) s.flawless += 1;
      break;
    case "relic": if (payload.id && !s.relicIds.includes(payload.id)) s.relicIds.push(payload.id); break;
    case "curse": s.cursesEndured += 1; break;
    case "spend": s.drachmesSpent += (payload.amt || 0); break;
    case "runEnd": s.runs += 1; if (payload.won) s.wins += 1; break;
    default: break;
  }

  let kleos = meta.kleos, lifetime = meta.lifetimeKleos;
  const owned = { ...meta.owned };

  // achievements (threshold, auto-grant)
  const ach = { ...meta.ach };
  for (const a of ACHIEVEMENTS) {
    if (!ach[a.id] && statVal(s, a.stat) >= a.goal) {
      ach[a.id] = true; kleos += a.reward; lifetime += a.reward;
      notices.push({ type: "ach", icon: a.icon, title: a.name, en: a.en, reward: a.reward });
    }
  }

  // active daily quests (event-counted)
  const active = meta.quests.active.map((q) => {
    if (q.done || q.claimed) return q;
    const def = QUESTS[q.id]; if (!def) return q;
    const inc = def.match(ev, payload);
    if (!inc) return q;
    const prog = Math.min(def.goal, q.prog + (inc === true ? 1 : inc));
    const done = prog >= def.goal;
    if (done) notices.push({ type: "quest", icon: def.icon, title: def.name, en: def.en, reward: def.reward });
    return { ...q, prog, done };
  });

  // questline (sequential thresholds — may advance several stages at once)
  let ql = meta.ql;
  while (ql < QUESTLINE.length) {
    const stage = QUESTLINE[ql];
    if (statVal(s, stage.stat) < stage.goal) break;
    ql += 1; kleos += stage.reward; lifetime += stage.reward;
    if (stage.unlock) owned[stage.unlock] = true;
    notices.push({ type: "ql", icon: stage.icon, title: stage.name, en: stage.en, reward: stage.reward, unlock: stage.unlock });
  }

  return {
    meta: { ...meta, stats: s, kleos, lifetimeKleos: lifetime, ach, owned, quests: { ...meta.quests, active }, ql },
    notices,
  };
}

/* ── apply equipped boosts/loadout when a fresh run is built ─────────── */
function applyBoostsToRun(run, meta) {
  const load = meta.loadout || [];
  run.boosts = [...load];
  run.wardUsed = false;
  if (load.includes("vigor")) { run.menos.max += 20; run.menos.cur += 20; }
  if (load.includes("purse")) run.drachmes += 45;
  if (load.includes("heirloom")) {
    const pool = (window.RELICS || []).filter((r) => !run.relics.includes(r.id));
    if (pool.length) {
      const r = pool[(Math.random() * pool.length) | 0];
      run.relics.push(r.id);
      if (r.id === "ambrosia") { run.menos.max += 25; run.menos.cur += 25; }
    }
  }
  return run;
}

/* ── compute κλέος earned from a finished run ───────────────────────── */
function computeRunKleos(run, won) {
  const tiles = (run.visited || []).length;
  const base = Math.round(run.drachmes / 3) + tiles * 2 + Math.round((run.xp || 0) / 4) + (won ? 80 : 12);
  const ana = 1 + (run.anabasis || 0) * 0.12;   // higher ascension → more glory
  return Math.round(base * ana);
}

/* ════════════════════════════════════════════════════════════════════
   useMeta — single source of truth for the reward economy.
   ════════════════════════════════════════════════════════════════════ */
function useMeta() {
  const [meta, setMeta] = React.useState(loadMeta);
  const [notices, setNotices] = React.useState([]);
  const pushNotices = React.useCallback((arr) => {
    if (arr && arr.length) setNotices((q) => [...q, ...arr.map((n) => ({ ...n, key: (Date.now() + Math.random()).toString(36) }))]);
  }, []);
  const dismissNotice = React.useCallback((key) => setNotices((q) => q.filter((n) => n.key !== key)), []);

  React.useEffect(() => { saveMeta(meta); }, [meta]);
  React.useEffect(() => { setMeta((m) => ensureQuests(m)); }, []);

  const track = React.useCallback((ev, payload) => {
    setMeta((prev) => {
      const { meta: nm, notices: ns } = applyEvent(prev, ev, payload || {});
      if (ns.length) queueMicrotask(() => pushNotices(ns));
      return nm;
    });
  }, [pushNotices]);

  const api = React.useMemo(() => ({
    track,
    notices, dismissNotice,
    // economy / shop
    buyCosmetic: (id) => setMeta((m) => {
      const c = COSMETICS.find((x) => x.id === id); if (!c || isOwned(m, id) || m.kleos < c.price) return m;
      return { ...m, kleos: m.kleos - c.price, owned: { ...m.owned, [id]: true } };
    }),
    equipCosmetic: (slot, id) => setMeta((m) => isOwned(m, id) ? { ...m, [slot]: id } : m),
    buyBoost: (id) => setMeta((m) => {
      const b = BOOSTS.find((x) => x.id === id); if (!b || m.boostsOwned[id] || m.kleos < b.price) return m;
      return { ...m, kleos: m.kleos - b.price, boostsOwned: { ...m.boostsOwned, [id]: true } };
    }),
    toggleLoadout: (id) => setMeta((m) => {
      if (!m.boostsOwned[id]) return m;
      const has = m.loadout.includes(id);
      if (has) return { ...m, loadout: m.loadout.filter((x) => x !== id) };
      const load = m.loadout.length >= 2 ? [m.loadout[1], id] : [...m.loadout, id];
      return { ...m, loadout: load };
    }),
    buyLifeline: (id) => setMeta((m) => {
      const l = LIFELINES.find((x) => x.id === id); if (!l || m.kleos < l.price) return m;
      return { ...m, kleos: m.kleos - l.price, lifelines: { ...m.lifelines, [id]: (m.lifelines[id] || 0) + 1 } };
    }),
    spendLifeline: (id) => setMeta((m) => (m.lifelines[id] || 0) <= 0 ? m : { ...m, lifelines: { ...m.lifelines, [id]: m.lifelines[id] - 1 } }),
    claimQuest: (id) => setMeta((m) => {
      const q = m.quests.active.find((x) => x.id === id); if (!q || !q.done || q.claimed) return m;
      const def = QUESTS[id];
      return { ...m, kleos: m.kleos + def.reward, lifetimeKleos: m.lifetimeKleos + def.reward,
        quests: { ...m.quests, active: m.quests.active.map((x) => x.id === id ? { ...x, claimed: true } : x) } };
    }),
    rerollQuests: () => setMeta((m) => ({ ...m, quests: { active: rollQuests(m.quests.active), rotatedAt: Date.now() } })),
    markQlSeen: () => setMeta((m) => (m.qlSeen === m.ql ? m : { ...m, qlSeen: m.ql })),
    endRun: (run, won) => setMeta((m) => {
      const earned = computeRunKleos(run, won);
      let nm = { ...m, kleos: m.kleos + earned, lifetimeKleos: m.lifetimeKleos + earned, lastRunKleos: earned };
      // ── ascension: a win unlocks the next tier ──
      if (won) nm.anabasisMax = Math.min(ANABASIS_MAX, Math.max(nm.anabasisMax, (run.anabasis || 0) + 1));
      // ── win-streak ──
      const ws = won ? (m.winStreak || 0) + 1 : 0;
      nm.winStreak = ws;
      nm.bestWinStreak = Math.max(m.bestWinStreak || 0, ws);
      // ── chronicle / ledger ──
      const entry = {
        seed: run.seed, won, tiles: (run.visited || []).length, xp: run.xp || 0,
        drachmes: run.drachmes || 0, relics: (run.relics || []).length,
        anabasis: run.anabasis || 0, patron: run.patron || "none",
        daily: !!run.daily, kleos: earned, at: Date.now(),
      };
      nm.ledger = [entry, ...(m.ledger || [])].slice(0, 24);
      // ── daily challenge bests ──
      if (run.daily && run.dailyDate) {
        const cur = (m.daily && m.daily.date === run.dailyDate) ? m.daily : { date: run.dailyDate, bestXp: 0, bestTiles: 0, attempts: 0, won: false };
        nm.daily = {
          date: run.dailyDate,
          bestXp: Math.max(cur.bestXp || 0, run.xp || 0),
          bestTiles: Math.max(cur.bestTiles || 0, (run.visited || []).length),
          attempts: (cur.attempts || 0) + 1,
          won: cur.won || won,
        };
      }
      const res = applyEvent(nm, "runEnd", { won });
      if (res.notices.length) queueMicrotask(() => pushNotices(res.notices));
      return res.meta;
    }),
    selectAnabasis: (lvl) => setMeta((m) => ({ ...m, anabasis: Math.max(0, Math.min(m.anabasisMax, lvl)) })),
    // dev preview
    grantKleos: (n) => setMeta((m) => ({ ...m, kleos: m.kleos + n })),
    unlockAll: () => setMeta((m) => {
      const owned = { ...m.owned }; COSMETICS.forEach((c) => { if (!c.base) owned[c.id] = true; });
      const boostsOwned = { ...m.boostsOwned }; BOOSTS.forEach((b) => { boostsOwned[b.id] = true; });
      return { ...m, owned, boostsOwned, anabasisMax: ANABASIS_MAX };
    }),
    resetMeta: () => setMeta(metaDefaults()),
  }), [track, notices, dismissNotice, pushNotices]);

  return [meta, api];
}

Object.assign(window, {
  COSMETICS, COSMETIC_SLOTS, BOOSTS, LIFELINES, LIFELINE_IDS, ACHIEVEMENTS, QUESTS, QUEST_IDS, QUESTLINE,
  useMeta, isOwned, applyBoostsToRun, statVal, metaDefaults,
});
