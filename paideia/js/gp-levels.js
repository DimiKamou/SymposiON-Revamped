/* ============================================================
   gp-levels.js  —  GP_LEVEL_PROVIDERS
   ------------------------------------------------------------
   Real, multi-selectable levels for the configurator's level step.
   Each provider exposes its module's level list (grouped, as the
   game groups them) + a raw-data filter, so a multi-selection
   produces the correct question bank.

   Load EAGERLY before nav.js. The configurator opens before the
   lazy game files load, so the level data must live here.

   Provider shape:
     GP_LEVEL_PROVIDERS[datasetId] = {
       levels: [{ id, group, color:'lgreen'|'lyellow'|'lred'|'lpurple', desc }],
       // Return the subset of rawDB matching the selected level ids,
       // PRESERVING rawDB's shape (dict → dict subset, array → array subset),
       // so _gpNormalizeQuestions still recognises it.
       filterRaw(rawDB, selectedIds) => filteredRawDB,
       // ── OR ── generator-leveled (lyo): build questions per id.
       generator(id) => [ {q,opts,ans} ] | null,
     }

   In the launch path (nav.js / initGameWithData):
     const prov = GP_LEVEL_PROVIDERS[datasetId];
     if (prov && prov.generator && Array.isArray(levelIds))    // build G = concat per id
       ...
     else if (prov && prov.filterRaw && Array.isArray(levelIds) && levelIds.length)
       rawData = prov.filterRaw(rawData, levelIds);            // BEFORE _gpNormalizeQuestions
   Missing provider / empty selection → fall back to whole DB (today's behavior; no regression).

   ⚠ Keep these level lists + filters in sync with the source game files.
   Source of truth per provider noted inline (file:line at time of writing).
   The form-label constants below are inlined copies of each game's
   STD6/IMP4 person-number labels (SYN_LP/SYN_IP, AOBIP, AFP/AFIP).
   ============================================================ */
window.GP_LEVEL_PROVIDERS = (function () {
  'use strict';
  const P = {};

  // person/number form labels, inlined from the game data files
  const STD6 = ["α ενικό", "β ενικό", "γ ενικό", "α πληθυντικό", "β πληθυντικό", "γ πληθυντικό"];
  const IMP4 = ["β ενικό", "γ ενικό", "β πληθυντικό", "γ πληθυντικό"];

  // ── shared helpers ─────────────────────────────────────────
  function uiLevels(levels) {
    return levels.map(l => ({ id: l.id, group: l.group, section: l.section || null, color: l.color, desc: l.desc }));
  }
  // Keyed-paradigm dict subset. Entry props: {verb, voice, mood, tense, form}.
  // level.f = { voices?, moods?, tenses?, forms?, verbs? } (each an array; absent = unconstrained).
  function gramMatch(g, f) {
    if (f.verbs && !f.verbs.includes(g.verb)) return false;
    if (f.voices && !f.voices.includes(g.voice)) return false;
    if (f.moods && !f.moods.includes(g.mood)) return false;
    if (f.tenses && !f.tenses.includes(g.tense)) return false;
    if (f.forms && !f.forms.includes(g.form)) return false;
    return true;
  }
  function dictSubset(dict, pred) {
    const out = {};
    for (const k in dict) {
      if (Object.prototype.hasOwnProperty.call(dict, k) && pred(dict[k])) out[k] = dict[k];
    }
    return out;
  }
  // Generic provider for keyed-paradigm grammar (AOB_G / SYN_G / AFW_G / RMI_G).
  // Levels carry a `f` filter spec; `resolve(level)` may lazily expand verb lists.
  function dictProvider(levels, resolve) {
    return {
      levels: uiLevels(levels),
      filterRaw(dict, ids) {
        if (!dict || typeof dict !== 'object' || Array.isArray(dict)) return dict;
        const sel = levels.filter(l => ids.includes(l.id) && l.f);
        if (!sel.length) return dict;
        const specs = sel.map(l => (resolve ? resolve(l) : l.f)).filter(Boolean);
        if (!specs.length) return dict;
        return dictSubset(dict, g => specs.some(f => gramMatch(g, f)));
      },
    };
  }
  // Generic provider for array DBs filtered by a `sub`-code union (OUS / LAT-N).
  // dedup by entry.l (lemma), matching the source filters.
  function subArrayProvider(levels, matchSub) {
    return {
      levels: uiLevels(levels),
      filterRaw(arr, ids) {
        if (!Array.isArray(arr)) return arr;
        const subs = levels.filter(l => ids.includes(l.id)).reduce((a, l) => a.concat(l.sub || []), []);
        if (!subs.length) return arr;
        if (subs.includes('all')) return arr;
        const result = [], seen = new Set();
        arr.forEach(n => {
          for (const s of subs) {
            if (matchSub(n, s)) { if (!seen.has(n.l)) { seen.add(n.l); result.push(n); } break; }
          }
        });
        return result;
      },
    };
  }

  /* ── lyo — generator-leveled ────────────────────────────────
     Source: games/lyo/game.js  LYO_LVL (line 461) + lyoKeys/lyoGenQ.
     lyo's loader generates questions per level via _gpLyoGenQuestions(id, n)
     (defined in nav.js). For a multi-selection nav.js calls the generator per
     selected id and concats. We expose the level list for the UI + a generator. */
  const LYO_LVL = [
    { id: 1,  group: "Οριστική", color: "lgreen",  desc: "Ενεστώτας, Μέλλοντας — Ενεργητική Φωνή" },
    { id: 2,  group: "Οριστική", color: "lgreen",  desc: "Παρατατικός, Αόριστος — Ενεργητική Φωνή" },
    { id: 3,  group: "Οριστική", color: "lyellow", desc: "Παρακείμενος, Υπερσυντέλικος — Ενεργητική Φωνή" },
    { id: 4,  group: "Οριστική", color: "lyellow", desc: "Όλοι οι χρόνοι — Ενεργητική Φωνή" },
    { id: 5,  group: "Οριστική", color: "lyellow", desc: "Ενεστώτας, Μέλλοντας — Μέση Φωνή" },
    { id: 6,  group: "Οριστική", color: "lyellow", desc: "Παρατατικός, Αόριστος — Μέση Φωνή" },
    { id: 7,  group: "Οριστική", color: "lred",    desc: "Όλοι οι χρόνοι — Μέση Φωνή" },
    { id: 8,  group: "Οριστική", color: "lred",    desc: "Όλοι οι χρόνοι — Ενεργητική & Μέση Φωνή" },
    { id: 9,  group: "Υποτακτική", color: "lgreen",  desc: "Ενεστώτας, Αόριστος — Ενεργητική Φωνή" },
    { id: 10, group: "Υποτακτική", color: "lyellow", desc: "Ενεστώτας, Αόριστος — Μέση Φωνή" },
    { id: 11, group: "Υποτακτική", color: "lred",    desc: "Ενεστώτας, Αόριστος — Ενεργητική & Μέση Φωνή" },
    { id: 24, group: "Υποτακτική", color: "lgreen",  desc: "Παρακείμενος — Ενεργητική Φωνή" },
    { id: 25, group: "Υποτακτική", color: "lyellow", desc: "Παρακείμενος — Μέση Φωνή" },
    { id: 26, group: "Υποτακτική", color: "lred",    desc: "Παρακείμενος — Ενεργητική & Μέση Φωνή" },
    { id: 12, group: "Ευκτική", color: "lgreen",  desc: "Ενεστώτας, Μέλλοντας, Αόριστος — Ενεργητική Φωνή" },
    { id: 13, group: "Ευκτική", color: "lyellow", desc: "Ενεστώτας, Μέλλοντας, Αόριστος — Μέση Φωνή" },
    { id: 14, group: "Ευκτική", color: "lred",    desc: "Ενεστώτας, Μέλλοντας, Αόριστος — Ενεργητική & Μέση Φωνή" },
    { id: 27, group: "Ευκτική", color: "lgreen",  desc: "Παρακείμενος — Ενεργητική Φωνή" },
    { id: 28, group: "Ευκτική", color: "lyellow", desc: "Παρακείμενος — Μέση Φωνή" },
    { id: 29, group: "Ευκτική", color: "lred",    desc: "Παρακείμενος — Ενεργητική & Μέση Φωνή" },
    { id: 15, group: "Προστακτική", color: "lgreen",  desc: "Ενεστώτας, Αόριστος — Ενεργητική Φωνή" },
    { id: 16, group: "Προστακτική", color: "lyellow", desc: "Ενεστώτας, Αόριστος — Μέση Φωνή" },
    { id: 17, group: "Προστακτική", color: "lred",    desc: "Ενεστώτας, Αόριστος — Ενεργητική & Μέση Φωνή" },
    { id: 30, group: "Προστακτική", color: "lgreen",  desc: "Παρακείμενος — Ενεργητική Φωνή" },
    { id: 31, group: "Προστακτική", color: "lyellow", desc: "Παρακείμενος — Μέση Φωνή" },
    { id: 32, group: "Προστακτική", color: "lred",    desc: "Παρακείμενος — Ενεργητική & Μέση Φωνή" },
    { id: 18, group: "Ονοματικοί Τύποι", color: "lpurple", desc: "Απαρέμφατο — Ενεργητική Φωνή" },
    { id: 19, group: "Ονοματικοί Τύποι", color: "lpurple", desc: "Απαρέμφατο — Μέση Φωνή" },
    { id: 20, group: "Ονοματικοί Τύποι", color: "lpurple", desc: "Μετοχή — Ενεργητική Φωνή" },
    { id: 21, group: "Ονοματικοί Τύποι", color: "lpurple", desc: "Μετοχή — Μέση Φωνή" },
    { id: 22, group: "Ονοματικοί Τύποι", color: "lred",    desc: "Απαρέμφατο & Μετοχή — Ενεργητική & Μέση Φωνή" },
    { id: 23, group: "Συνδυαστικό", color: "lred", desc: "Όλες οι εγκλίσεις + απαρέμφατο + μετοχή — Ενεργητική & Μέση Φωνή" },
  ];
  P['lyo'] = {
    levels: uiLevels(LYO_LVL),
    generator: (id) => (typeof _gpLyoGenQuestions === 'function' ? _gpLyoGenQuestions(id, 25) : null),
    // filterRaw unused for lyo (uses generator); nav.js: if(prov.generator) build G = concat per id.
  };

  /* ── ousiastika — array DB (OUS_DB), sub-code union ─────────
     Source: games/ousiastika/game.js  OUS_LEVELS + _ousFilterNouns. */
  // Migrated to broad umbrellas (`group`) + display `section`; `sub` selection
  // codes, `id`s and `color` are preserved (see _ousMatch). Keep in sync with
  // games/ousiastika/game.js OUS_LEVELS.
  const OUS_LEVELS = [
    { id: 1, group: 'Α΄ Κλίση', section: null, color: 'lgreen',  desc: 'Αρσενικά: νεανίας, πολίτης (-ας, -ης)', sub: ['1_αρσ'] },
    { id: 2, group: 'Α΄ Κλίση', section: null, color: 'lyellow', desc: 'Θηλυκά: χώρα, τιμή (-α, -η)', sub: ['1_θηλ'] },
    { id: 3, group: 'Α΄ Κλίση', section: null, color: 'lred',    desc: 'Α΄ Κλίση — Όλα', sub: ['1'] },
    { id: 4, group: 'Β΄ Κλίση', section: null, color: 'lgreen',  desc: 'Αρσ./Θηλ.: λόγος, νόσος (-ος)', sub: ['2_αρσθηλ'] },
    { id: 5, group: 'Β΄ Κλίση', section: null, color: 'lyellow', desc: 'Ουδέτερα: δῶρον (-ον)', sub: ['2_ουδ'] },
    { id: 6, group: 'Β΄ Κλίση', section: null, color: 'lred',    desc: 'Β΄ Κλίση — Όλα', sub: ['2'] },
    { id: 7, group: 'Γ΄ Κλίση', section: 'Φωνηεντόληκτα', color: 'lgreen',  desc: 'Μονόθεμα -ως: ὁ ἥρως', sub: ['φων_ως'] },
    { id: 8, group: 'Γ΄ Κλίση', section: 'Φωνηεντόληκτα', color: 'lgreen',  desc: 'Μονόθεμα -υς: ἰχθύς, βότρυς', sub: ['φων_υς_μ'] },
    { id: 9, group: 'Γ΄ Κλίση', section: 'Φωνηεντόληκτα', color: 'lyellow', desc: 'Διπλόθεμα -ις/-υς/-υ: πόλις, πέλεκυς, ἄστυ', sub: ['φων_διπλ'] },
    { id: 10, group: 'Γ΄ Κλίση', section: 'Φωνηεντόληκτα', color: 'lyellow', desc: 'Σε -ευς: βασιλεύς', sub: ['φων_ευς'] },
    { id: 11, group: 'Γ΄ Κλίση', section: 'Φωνηεντόληκτα', color: 'lyellow', desc: 'Διπλόθεμα -ω: ἠχώ, πειθώ', sub: ['φων_ω'] },
    { id: 12, group: 'Γ΄ Κλίση', section: 'Φωνηεντόληκτα', color: 'lred',    desc: 'Διφθογγόληκτα: ναῦς, βοῦς, γραῦς', sub: ['φων_αυ'] },
    { id: 13, group: 'Γ΄ Κλίση', section: 'Αφωνόληκτα',  color: 'lgreen',  desc: 'Ουρανικόληκτα: ὁ κόραξ (κ/γ/χ)', sub: ['αφων_ουραν'] },
    { id: 14, group: 'Γ΄ Κλίση', section: 'Αφωνόληκτα',  color: 'lgreen',  desc: 'Χειλικόληκτα: ὁ γύψ (π/β/φ)', sub: ['αφων_χειλ'] },
    { id: 15, group: 'Γ΄ Κλίση', section: 'Αφωνόληκτα',  color: 'lyellow', desc: 'Οδοντικόληκτα βασικά: ὁ τάπης, ἡ πατρίς (τ/δ/θ)', sub: ['αφων_οδ'] },
    { id: 16, group: 'Γ΄ Κλίση', section: 'Αφωνόληκτα',  color: 'lgreen',  desc: 'Σε -ντ (ΟΝ.-ας): ὁ ἱμάς, γίγας, ἐλέφας', sub: ['αφων_ιμας'] },
    { id: 17, group: 'Γ΄ Κλίση', section: 'Αφωνόληκτα',  color: 'lyellow', desc: 'Σε -ντ (ΟΝ.-ων): ὁ λέων, ἄρχων, ὀδούς', sub: ['αφων_λεων'] },
    { id: 18, group: 'Γ΄ Κλίση', section: 'Αφωνόληκτα',  color: 'lred',    desc: 'Ουδέτερα -α: τὸ σῶμα, πρᾶγμα, ὄνομα', sub: ['αφων_σωμα'] },
    { id: 19, group: 'Γ΄ Κλίση', section: 'Ενρινόληκτα', color: 'lgreen',  desc: 'Μονόθεμα: ὁ ἀγών, Ἕλλην, μήν', sub: ['ενριν_μ'] },
    { id: 20, group: 'Γ΄ Κλίση', section: 'Ενρινόληκτα', color: 'lyellow', desc: 'Διπλόθεμα: ὁ ἡγεμών, ποιμήν', sub: ['ενριν_δ'] },
    { id: 21, group: 'Γ΄ Κλίση', section: 'Υγρόληκτα',   color: 'lgreen',  desc: 'Μονόθεμα: ὁ σωτήρ, ῥήτωρ, κλητήρ', sub: ['υγρ_ρητ'] },
    { id: 22, group: 'Γ΄ Κλίση', section: 'Υγρόληκτα',   color: 'lyellow', desc: 'Συγκοπτόμενα: ὁ πατήρ, ἡ μήτηρ, ὁ ἀνήρ', sub: ['υγρ_πατ'] },
    { id: 23, group: 'Γ΄ Κλίση', section: 'Σιγμόληκτα',  color: 'lgreen',  desc: 'Αρσ. σε -ης / -κλῆς: Σωκράτης, Ἡρακλῆς', sub: ['σιγμ_σωκρ', 'σιγμ_κλης'] },
    { id: 24, group: 'Γ΄ Κλίση', section: 'Σιγμόληκτα',  color: 'lyellow', desc: 'Θηλ. σε -ώς: ἡ αἰδώς, ἠώς', sub: ['σιγμ_αιδ'] },
    { id: 25, group: 'Γ΄ Κλίση', section: 'Σιγμόληκτα',  color: 'lyellow', desc: 'Ουδ. σε -ος: τὸ βέλος, ἔθνος, κράτος', sub: ['σιγμ_βελ'] },
    { id: 26, group: 'Γ΄ Κλίση', section: 'Σιγμόληκτα',  color: 'lred',    desc: 'Ουδ. σε -ας/-αρ: τὸ κρέας, τέρας, γῆρας', sub: ['σιγμ_κρε'] },
    { id: 30, group: 'Γ΄ Κλίση', section: null, color: 'lred', desc: 'Γ΄ Κλίση — Όλες οι υποκατηγορίες', sub: ['γ'] },
    { id: 27, group: 'Ανώμαλα', section: null, color: 'lpurple', desc: 'Ανώμαλα κατά γένος: ὁ λύχνος → τὰ λύχνα', sub: ['ανωμ_γεν'] },
    { id: 28, group: 'Ανώμαλα', section: null, color: 'lpurple', desc: 'Ετερόκλιτα: ὁ ἀμνός/ἀρνός, τὸ πῦρ/πυρά', sub: ['ετεροκλ'] },
    { id: 29, group: 'Ανώμαλα', section: null, color: 'lpurple', desc: 'Μεταπλαστά: τὸ γόνυ/γόνατος, ὁ Ζεύς/Διός', sub: ['μεταπλ'] },
    { id: 31, group: 'Συνδυαστικό', section: null, color: 'lred', desc: 'Α΄ + Β΄ + Γ΄ — Όλα μαζί', sub: ['all'] },
  ];
  function _ousMatch(n, s) {
    if (s === '1')            return n.d === 1;
    if (s === '1_αρσ')        return n.d === 1 && n.t === 'αρσενικό';
    if (s === '1_θηλ')        return n.d === 1 && n.t === 'θηλυκό';
    if (s === '2')            return n.d === 2;
    if (s === '2_αρσθηλ')     return n.d === 2 && (n.t === 'αρσενικό' || n.t === 'θηλυκό');
    if (s === '2_ουδ')        return n.d === 2 && n.t === 'ουδέτερο';
    if (s === 'γ')            return n.d === 3;
    if (s === 'ανωμ_γεν')     return n.sub === 'ανωμ_γεν';
    if (s === 'ετεροκλ')      return n.sub === 'ετεροκλ';
    if (s === 'μεταπλ')       return n.sub === 'μεταπλ';
    return n.sub === s;
  }
  P['ousiastika'] = subArrayProvider(OUS_LEVELS, _ousMatch);

  /* ── lat-nouns — array DB (LAT_N_DB), sub-code union ────────
     Source: games/lat-nouns/game.js  LATN_LEVELS + _latnFilter. */
  const LATN_LEVELS = [
    { id: 1,  group: 'Α΄ Κλίση', color: 'lgreen',  desc: 'Θηλυκά: puella, aqua, terra (-a)', sub: ['1f'] },
    { id: 2,  group: 'Α΄ Κλίση', color: 'lyellow', desc: 'Αρσενικά: nauta, poeta, agricola', sub: ['1m'] },
    { id: 3,  group: 'Α΄ Κλίση', color: 'lred',    desc: 'Α΄ Κλίση — Όλα', sub: ['1'] },
    { id: 4,  group: 'Β΄ Κλίση', color: 'lgreen',  desc: 'Αρσ. -us/-er: dominus, puer, magister', sub: ['2m', '2m_er'] },
    { id: 5,  group: 'Β΄ Κλίση', color: 'lyellow', desc: 'Ουδ. -um: donum, bellum, regnum', sub: ['2n'] },
    { id: 6,  group: 'Β΄ Κλίση', color: 'lred',    desc: 'Β΄ Κλίση — Όλα', sub: ['2'] },
    { id: 7,  group: 'Γ΄ Κλίση', section: 'Συμφωνόληκτα', color: 'lgreen',  desc: 'Συμφ. (ανισοσύλλ.): rex, miles, homo', sub: ['3cons'] },
    { id: 8,  group: 'Γ΄ Κλίση', section: 'Φωνηεντόληκτα (i-stem)', color: 'lgreen',  desc: 'Φωνηεντόλ. (ισοσύλλ.): civis, urbs, mons', sub: ['3istem'] },
    { id: 9,  group: 'Γ΄ Κλίση', section: 'Ουδέτερα', color: 'lyellow', desc: 'Ουδ. σύμφ.: nomen, corpus, tempus', sub: ['3n'] },
    { id: 10, group: 'Γ΄ Κλίση', section: 'Ουδέτερα', color: 'lyellow', desc: 'Ουδ. -al/-ar/-e: animal, mare', sub: ['3n_al'] },
    { id: 11, group: 'Γ΄ Κλίση', section: null, color: 'lred',    desc: 'Γ΄ Κλίση — Όλα', sub: ['3'] },
    { id: 12, group: 'Δ΄ Κλίση', color: 'lgreen',  desc: 'Αρσ./Θηλ. -us: exercitus, manus', sub: ['4m', '4f'] },
    { id: 13, group: 'Δ΄ Κλίση', color: 'lyellow', desc: 'Ουδ. -u: cornu, genu', sub: ['4n'] },
    { id: 14, group: 'Δ΄ Κλίση', color: 'lred',    desc: 'Δ΄ Κλίση — Όλα', sub: ['4'] },
    { id: 15, group: 'Ε΄ Κλίση', color: 'lpurple', desc: 'Ε΄ Κλίση: dies, res, spes, fides', sub: ['5'] },
    { id: 16, group: 'Master Challenge', color: 'lred', desc: 'Όλες οι κλίσεις μαζί', sub: ['all'] },
  ];
  function _latnMatch(n, s) {
    if (s === '1') return n.d === 1;
    if (s === '2') return n.d === 2;
    if (s === '3') return n.d === 3;
    if (s === '4') return n.d === 4;
    if (s === '5') return n.d === 5;
    return n.sub === s;
  }
  P['lat-nouns'] = subArrayProvider(LATN_LEVELS, _latnMatch);

  /* ── antonymies — dict DB (ANT_DB), sub-code union ──────────
     Source: games/antonymies/game.js  ANT_LEVELS + _antFilterEntries.
     ANT_DB is a dict keyed by id → {id, type, lemma, ptosi, form, alts, …};
     return a dict subset so _gpNormalizeQuestions (format D) handles it. */
  const ANT_LEVELS = [
    { id: 1,  group: 'Προσωπικές',      color: 'lgreen',  desc: 'ἐγώ / σύ — 1ο & 2ο πρόσ. ενικός',     sub: ['egw_sy'] },
    { id: 2,  group: 'Προσωπικές',      color: 'lyellow', desc: 'ἡμεῖς / ὑμεῖς — 1ο & 2ο πρόσ. πληθ.', sub: ['imeis_ymeis'] },
    { id: 3,  group: 'Προσωπικές',      color: 'lyellow', desc: 'αὐτός — 3ο πρόσωπο / εμφατική',        sub: ['aytos_pr'] },
    { id: 4,  group: 'Προσωπικές',      color: 'lred',    desc: 'Προσωπικές — Όλες',                   sub: ['prosopiki'] },
    { id: 5,  group: 'Δεικτικές',       color: 'lgreen',  desc: 'οὗτος — αὕτη — τοῦτο',                 sub: ['oytos'] },
    { id: 6,  group: 'Δεικτικές',       color: 'lyellow', desc: 'ἐκεῖνος — ἐκείνη — ἐκεῖνο',            sub: ['ekeinos'] },
    { id: 7,  group: 'Δεικτικές',       color: 'lyellow', desc: 'ὅδε — ἥδε — τόδε',                     sub: ['ode'] },
    { id: 8,  group: 'Δεικτικές',       color: 'lred',    desc: 'Δεικτικές — Όλες',                    sub: ['deiktiki'] },
    { id: 9,  group: 'Αυτοπαθείς',      color: 'lgreen',  desc: 'ἐμαυτοῦ / σεαυτοῦ — 1ο & 2ο πρόσ.',   sub: ['emaut_seaut'] },
    { id: 10, group: 'Αυτοπαθείς',      color: 'lyellow', desc: 'ἑαυτοῦ — 3ο πρόσωπο',                  sub: ['eautou'] },
    { id: 11, group: 'Αυτοπαθείς',      color: 'lred',    desc: 'Αυτοπαθείς — Όλες',                   sub: ['aytopathitiki'] },
    { id: 12, group: 'Αναφορικές & Λοιπές', section: 'Αναφορικές',      color: 'lgreen',  desc: 'ὅς — ἥ — ὅ (αναφορική αντωνυμία)',     sub: ['anaforiki'] },
    { id: 13, group: 'Αναφορικές & Λοιπές', section: 'Ερωτηματικές',    color: 'lyellow', desc: 'τίς — τί (ερωτηματική αντωνυμία)',      sub: ['erotim'] },
    { id: 14, group: 'Αναφορικές & Λοιπές', section: 'Αόριστες',        color: 'lyellow', desc: 'τις — τι (αόριστη αντωνυμία)',          sub: ['aoristologi'] },
    { id: 15, group: 'Κτητικές',        color: 'lgreen',  desc: 'ἐμός / σός — κτητικές 1ου & 2ου προσ.', sub: ['emos_sos'] },
    { id: 16, group: 'Κτητικές',        color: 'lyellow', desc: 'ἡμέτερος / ὑμέτερος — κτητικές πληθ.', sub: ['imetr_ymetr'] },
    { id: 17, group: 'Κτητικές',        color: 'lred',    desc: 'Κτητικές — Όλες',                     sub: ['ktitiki'] },
    { id: 19, group: 'Συνδυαστικό', color: 'lred',   desc: 'Όλες οι Αντωνυμίες μαζί',             sub: ['all'] },
    // id 18 (Μεταφραστικό, sub 'transl') is a translate-only mode — not a question bank — so omitted here.
  ];
  function _antMatch(e, s) {
    switch (s) {
      case 'egw_sy':        return e.type === 'prosopiki' && (e.lemma === 'ἐγώ' || e.lemma === 'σύ');
      case 'imeis_ymeis':   return e.type === 'prosopiki' && (e.lemma === 'ἡμεῖς' || e.lemma === 'ὑμεῖς');
      case 'aytos_pr':      return e.type === 'prosopiki' && e.lemma === 'αὐτός';
      case 'prosopiki':     return e.type === 'prosopiki';
      case 'oytos':         return e.type === 'deiktiki' && e.lemma === 'οὗτος';
      case 'ekeinos':       return e.type === 'deiktiki' && e.lemma === 'ἐκεῖνος';
      case 'ode':           return e.type === 'deiktiki' && e.lemma === 'ὅδε';
      case 'deiktiki':      return e.type === 'deiktiki';
      case 'emaut_seaut':   return e.type === 'aytopathitiki' && (e.lemma === 'ἐμαυτοῦ' || e.lemma === 'σεαυτοῦ');
      case 'eautou':        return e.type === 'aytopathitiki' && e.lemma === 'ἑαυτοῦ';
      case 'aytopathitiki': return e.type === 'aytopathitiki';
      case 'anaforiki':     return e.type === 'anaforiki';
      case 'erotim':        return e.type === 'erotim';
      case 'aoristologi':   return e.type === 'aoristologi';
      case 'emos_sos':      return e.type === 'ktitiki' && (e.lemma === 'ἐμός' || e.lemma === 'σός');
      case 'imetr_ymetr':   return e.type === 'ktitiki' && (e.lemma === 'ἡμέτερος' || e.lemma === 'ὑμέτερος');
      case 'ktitiki':       return e.type === 'ktitiki';
      default:              return false;   // 'transl' and unknown → no bank entries
    }
  }
  P['antonymies'] = {
    levels: uiLevels(ANT_LEVELS),
    filterRaw(dict, ids) {
      if (!dict || typeof dict !== 'object' || Array.isArray(dict)) return dict;
      const subs = ANT_LEVELS.filter(l => ids.includes(l.id)).reduce((a, l) => a.concat(l.sub || []), []);
      if (!subs.length) return dict;
      if (subs.includes('all')) return dict;
      return dictSubset(dict, e => subs.some(s => _antMatch(e, s)));
    },
  };

  /* ── aoristos-b — keyed dict (AOB_G) ────────────────────────
     Source: games/aoristos-b/data.js  AOB_LEVELS (line 102) + aobKeys.
     Entry props: {verb, voice, mood, form}. Levels 1/2 also constrain by
     verb-list (active vs middle/both), resolved lazily from AOB_VERBS. */
  const AOB_LEVELS = [
    { id: 1, group: 'Οριστική', color: 'lgreen',  desc: 'Ενεργητική Φωνή — Οριστική',
      f: { voices: ['ενεργητική'], moods: ['οριστική'] }, vkind: 'act' },
    { id: 2, group: 'Οριστική', color: 'lyellow', desc: 'Μέση Φωνή — Οριστική',
      f: { voices: ['μέση'], moods: ['οριστική'] }, vkind: 'midboth' },
    { id: 3, group: 'Υποτακτική & Ευκτική', color: 'lgreen',  desc: 'Υποτακτική — Ενεργητική & Μέση',
      f: { voices: ['ενεργητική', 'μέση'], moods: ['υποτακτική'] } },
    { id: 4, group: 'Υποτακτική & Ευκτική', color: 'lyellow', desc: 'Ευκτική — Ενεργητική & Μέση',
      f: { voices: ['ενεργητική', 'μέση'], moods: ['ευκτική'] } },
    { id: 5, group: 'Προστακτική & Ονοματικοί', color: 'lpurple', desc: 'Προστακτική, Απαρέμφατο & Μετοχή',
      f: { voices: ['ενεργητική', 'μέση'], moods: ['προστακτική', '—'], forms: [...IMP4, 'απαρέμφατο', 'μετοχή'] } },
    { id: 6, group: 'Συνδυαστικό', color: 'lred', desc: 'Όλες εγκλίσεις — Ενεργητική & Μέση',
      f: { voices: ['ενεργητική', 'μέση'], moods: ['οριστική', 'υποτακτική', 'ευκτική', 'προστακτική', '—'] } },
  ];
  P['aoristos-b'] = dictProvider(AOB_LEVELS, (l) => {
    if (!l.vkind) return l.f;
    if (typeof AOB_VERBS === 'undefined') return l.f;   // verbs unresolvable → voice already separates
    const verbs = AOB_VERBS
      .filter(v => l.vkind === 'act' ? v.v === 'act' : (v.v === 'mid' || v.v === 'both'))
      .map(v => v.p);
    return Object.assign({}, l.f, { verbs });
  });

  /* ── synirimmena — keyed dict (SYN_G) ───────────────────────
     Source: games/synirimmena/data.js  SYN_LEVELS (line 177) + synKeys.
     Entry props: {verb, tense, voice, mood, form}. forms: SYN_LP=STD6, SYN_IP=IMP4. */
  const ALLM = ['οριστική', 'υποτακτική', 'ευκτική', 'προστακτική', '—'];
  const SYN_ALLF = [...STD6, 'απαρέμφατο', 'μετοχή'];
  const SYN_LEVELS = [
    { id: 1,  group: 'τιμῶ (τιμάω)', color: 'lgreen',  desc: 'Ενεστώτας — Ενεργητική Φωνή', f: { verbs: ['timw'], voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['ενεστώτας'], forms: STD6 } },
    { id: 2,  group: 'τιμῶ (τιμάω)', color: 'lgreen',  desc: 'Παρατατικός — Ενεργητική Φωνή', f: { verbs: ['timw'], voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['παρατατικός'], forms: STD6 } },
    { id: 3,  group: 'τιμῶ (τιμάω)', color: 'lyellow', desc: 'Υποτακτική + Ευκτική + Προστακτική — Ενεργητική', f: { verbs: ['timw'], voices: ['ενεργητική'], moods: ['υποτακτική', 'ευκτική', 'προστακτική'], tenses: ['ενεστώτας'], forms: STD6 } },
    { id: 4,  group: 'τιμῶ (τιμάω)', color: 'lyellow', desc: 'Απαρέμφατο + Μετοχή — Ενεργητική', f: { verbs: ['timw'], voices: ['ενεργητική'], moods: ['—'], tenses: ['ενεστώτας'], forms: ['απαρέμφατο', 'μετοχή'] } },
    { id: 5,  group: 'τιμῶ (τιμάω)', color: 'lyellow', desc: 'Ενεστώτας + Παρατατικός — Μέση Φωνή', f: { verbs: ['timw'], voices: ['μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός'], forms: STD6 } },
    { id: 6,  group: 'τιμῶ (τιμάω)', color: 'lred',    desc: 'Όλα — τιμῶ', f: { verbs: ['timw'], voices: ['ενεργητική', 'μέση'], moods: ALLM, tenses: ['ενεστώτας', 'παρατατικός'], forms: SYN_ALLF } },
    { id: 7,  group: 'ποιῶ (ποιέω)', color: 'lgreen',  desc: 'Ενεστώτας — Ενεργητική Φωνή', f: { verbs: ['poiw'], voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['ενεστώτας'], forms: STD6 } },
    { id: 8,  group: 'ποιῶ (ποιέω)', color: 'lgreen',  desc: 'Παρατατικός — Ενεργητική Φωνή', f: { verbs: ['poiw'], voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['παρατατικός'], forms: STD6 } },
    { id: 9,  group: 'ποιῶ (ποιέω)', color: 'lyellow', desc: 'Υποτακτική + Ευκτική + Προστακτική — Ενεργητική', f: { verbs: ['poiw'], voices: ['ενεργητική'], moods: ['υποτακτική', 'ευκτική', 'προστακτική'], tenses: ['ενεστώτας'], forms: STD6 } },
    { id: 10, group: 'ποιῶ (ποιέω)', color: 'lyellow', desc: 'Απαρέμφατο + Μετοχή — Ενεργητική', f: { verbs: ['poiw'], voices: ['ενεργητική'], moods: ['—'], tenses: ['ενεστώτας'], forms: ['απαρέμφατο', 'μετοχή'] } },
    { id: 11, group: 'ποιῶ (ποιέω)', color: 'lyellow', desc: 'Ενεστώτας + Παρατατικός — Μέση Φωνή', f: { verbs: ['poiw'], voices: ['μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός'], forms: STD6 } },
    { id: 12, group: 'ποιῶ (ποιέω)', color: 'lred',    desc: 'Όλα — ποιῶ', f: { verbs: ['poiw'], voices: ['ενεργητική', 'μέση'], moods: ALLM, tenses: ['ενεστώτας', 'παρατατικός'], forms: SYN_ALLF } },
    { id: 13, group: 'δηλῶ (δηλόω)', color: 'lgreen',  desc: 'Ενεστώτας — Ενεργητική Φωνή', f: { verbs: ['dilw'], voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['ενεστώτας'], forms: STD6 } },
    { id: 14, group: 'δηλῶ (δηλόω)', color: 'lgreen',  desc: 'Παρατατικός — Ενεργητική Φωνή', f: { verbs: ['dilw'], voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['παρατατικός'], forms: STD6 } },
    { id: 15, group: 'δηλῶ (δηλόω)', color: 'lyellow', desc: 'Υποτακτική + Ευκτική + Προστακτική — Ενεργητική', f: { verbs: ['dilw'], voices: ['ενεργητική'], moods: ['υποτακτική', 'ευκτική', 'προστακτική'], tenses: ['ενεστώτας'], forms: STD6 } },
    { id: 16, group: 'δηλῶ (δηλόω)', color: 'lyellow', desc: 'Απαρέμφατο + Μετοχή — Ενεργητική', f: { verbs: ['dilw'], voices: ['ενεργητική'], moods: ['—'], tenses: ['ενεστώτας'], forms: ['απαρέμφατο', 'μετοχή'] } },
    { id: 17, group: 'δηλῶ (δηλόω)', color: 'lyellow', desc: 'Ενεστώτας + Παρατατικός — Μέση Φωνή', f: { verbs: ['dilw'], voices: ['μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός'], forms: STD6 } },
    { id: 18, group: 'δηλῶ (δηλόω)', color: 'lred',    desc: 'Όλα — δηλῶ', f: { verbs: ['dilw'], voices: ['ενεργητική', 'μέση'], moods: ALLM, tenses: ['ενεστώτας', 'παρατατικός'], forms: SYN_ALLF } },
    { id: 19, group: 'Συνδυαστικό',  color: 'lyellow', desc: 'Ενεστώτας Ενεργητικής — Όλα τα ρήματα', f: { verbs: ['timw', 'poiw', 'dilw'], voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['ενεστώτας'], forms: STD6 } },
    { id: 20, group: 'Συνδυαστικό',  color: 'lyellow', desc: 'Παρατατικός Ενεργητικής — Όλα τα ρήματα', f: { verbs: ['timw', 'poiw', 'dilw'], voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['παρατατικός'], forms: STD6 } },
    { id: 21, group: 'Συνδυαστικό',  color: 'lred',    desc: 'Οριστική Ενεργητική & Μέση — Όλα τα ρήματα', f: { verbs: ['timw', 'poiw', 'dilw'], voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός'], forms: STD6 } },
    { id: 22, group: 'Συνδυαστικό',  color: 'lred',    desc: 'Όλες οι εγκλίσεις — Όλα τα ρήματα', f: { verbs: ['timw', 'poiw', 'dilw'], voices: ['ενεργητική', 'μέση'], moods: ALLM, tenses: ['ενεστώτας', 'παρατατικός'], forms: SYN_ALLF } },
  ];
  P['synirimmena'] = dictProvider(SYN_LEVELS);

  /* ── afwnolekta — keyed dict (AFW_G) ────────────────────────
     Source: games/afwnolekta/data.js  AFW_LEVELS (line 223) + afwKeys.
     Entry props: {verb, voice, mood, tense, form}. forms: AFP=STD6, AFIP=IMP4.
     Levels 27/28 (isEq/isAug, filter:null) are special practice modes — not
     question banks — so omitted here. */
  const AFW_LEVELS = [
    { id: 1,  group: 'Μέλλοντας', color: 'lgreen',  desc: 'Ενεργητική — Οριστική', f: { voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['μέλλοντας'], forms: STD6 } },
    { id: 2,  group: 'Μέλλοντας', color: 'lyellow', desc: 'Ενεργητική — Ευκτική', f: { voices: ['ενεργητική'], moods: ['ευκτική'], tenses: ['μέλλοντας'], forms: STD6 } },
    { id: 3,  group: 'Μέλλοντας', color: 'lyellow', desc: 'Ενεργητική — Απαρέμφατο + Μετοχή', f: { voices: ['ενεργητική'], moods: ['—'], tenses: ['μέλλοντας'], forms: ['απαρέμφατο', 'μετοχή'] } },
    { id: 4,  group: 'Μέλλοντας', color: 'lgreen',  desc: 'Μέση — Οριστική', f: { voices: ['μέση'], moods: ['οριστική'], tenses: ['μέλλοντας'], forms: STD6 } },
    { id: 5,  group: 'Μέλλοντας', color: 'lyellow', desc: 'Μέση — Ευκτική', f: { voices: ['μέση'], moods: ['ευκτική'], tenses: ['μέλλοντας'], forms: STD6 } },
    { id: 6,  group: 'Μέλλοντας', color: 'lyellow', desc: 'Μέση — Απαρέμφατο + Μετοχή', f: { voices: ['μέση'], moods: ['—'], tenses: ['μέλλοντας'], forms: ['απαρέμφατο', 'μετοχή'] } },
    { id: 7,  group: 'Μέλλοντας', color: 'lred',    desc: 'Ενεργητική + Μέση — Όλα', f: { voices: ['ενεργητική', 'μέση'], moods: ['οριστική', 'ευκτική', '—'], tenses: ['μέλλοντας'], forms: [...STD6, 'απαρέμφατο', 'μετοχή'] } },
    { id: 8,  group: 'Αόριστος', color: 'lgreen',  desc: 'Ενεργητική — Οριστική', f: { voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['αόριστος'], forms: STD6 } },
    { id: 9,  group: 'Αόριστος', color: 'lgreen',  desc: 'Ενεργητική — Υποτακτική', f: { voices: ['ενεργητική'], moods: ['υποτακτική'], tenses: ['αόριστος'], forms: STD6 } },
    { id: 10, group: 'Αόριστος', color: 'lyellow', desc: 'Ενεργητική — Ευκτική', f: { voices: ['ενεργητική'], moods: ['ευκτική'], tenses: ['αόριστος'], forms: STD6 } },
    { id: 11, group: 'Αόριστος', color: 'lyellow', desc: 'Ενεργητική — Προστακτική', f: { voices: ['ενεργητική'], moods: ['προστακτική'], tenses: ['αόριστος'], forms: IMP4 } },
    { id: 12, group: 'Αόριστος', color: 'lyellow', desc: 'Ενεργητική — Απαρέμφατο + Μετοχή', f: { voices: ['ενεργητική'], moods: ['—'], tenses: ['αόριστος'], forms: ['απαρέμφατο', 'μετοχή'] } },
    { id: 13, group: 'Αόριστος', color: 'lgreen',  desc: 'Μέση — Οριστική', f: { voices: ['μέση'], moods: ['οριστική'], tenses: ['αόριστος'], forms: STD6 } },
    { id: 14, group: 'Αόριστος', color: 'lyellow', desc: 'Μέση — Υποτακτική + Ευκτική', f: { voices: ['μέση'], moods: ['υποτακτική', 'ευκτική'], tenses: ['αόριστος'], forms: STD6 } },
    { id: 15, group: 'Αόριστος', color: 'lyellow', desc: 'Μέση — Προστακτική', f: { voices: ['μέση'], moods: ['προστακτική'], tenses: ['αόριστος'], forms: IMP4 } },
    { id: 16, group: 'Αόριστος', color: 'lyellow', desc: 'Μέση — Απαρέμφατο + Μετοχή', f: { voices: ['μέση'], moods: ['—'], tenses: ['αόριστος'], forms: ['απαρέμφατο', 'μετοχή'] } },
    { id: 17, group: 'Αόριστος', color: 'lred',    desc: 'Ενεργητική + Μέση — Όλα', f: { voices: ['ενεργητική', 'μέση'], moods: ALLM, tenses: ['αόριστος'], forms: [...STD6, 'απαρέμφατο', 'μετοχή'] } },
    { id: 18, group: 'Παρακείμενος', color: 'lgreen',  desc: 'Ενεργητική — Οριστική', f: { voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['παρακείμενος'], forms: STD6 } },
    { id: 19, group: 'Παρακείμενος', color: 'lyellow', desc: 'Ενεργητική — Απαρέμφατο + Μετοχή', f: { voices: ['ενεργητική'], moods: ['—'], tenses: ['παρακείμενος'], forms: ['απαρέμφατο', 'μετοχή'] } },
    { id: 20, group: 'Παρακείμενος', color: 'lgreen',  desc: 'Μέση — Οριστική', f: { voices: ['μέση'], moods: ['οριστική'], tenses: ['παρακείμενος'], forms: STD6 } },
    { id: 21, group: 'Παρακείμενος', color: 'lyellow', desc: 'Μέση — Υποτακτική + Ευκτική (Περιφρ.)', f: { voices: ['μέση'], moods: ['υποτακτική', 'ευκτική'], tenses: ['παρακείμενος'], forms: STD6 } },
    { id: 22, group: 'Παρακείμενος', color: 'lyellow', desc: 'Μέση — Προστακτική', f: { voices: ['μέση'], moods: ['προστακτική'], tenses: ['παρακείμενος'], forms: IMP4 } },
    { id: 23, group: 'Παρακείμενος', color: 'lyellow', desc: 'Μέση — Απαρέμφατο + Μετοχή', f: { voices: ['μέση'], moods: ['—'], tenses: ['παρακείμενος'], forms: ['απαρέμφατο', 'μετοχή'] } },
    { id: 24, group: 'Παρακείμενος', color: 'lred',    desc: 'Ενεργητική + Μέση — Όλα', f: { voices: ['ενεργητική', 'μέση'], moods: ALLM, tenses: ['παρακείμενος'], forms: [...STD6, 'απαρέμφατο', 'μετοχή'] } },
    { id: 25, group: 'Συνδυαστικό', color: 'lred', desc: 'Ενεργητική Οριστική — Μέλλ. + Αόρ. + Παρακ.', f: { voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['μέλλοντας', 'αόριστος', 'παρακείμενος'], forms: STD6 } },
    { id: 26, group: 'Συνδυαστικό', color: 'lred', desc: 'Ενεργητική + Μέση — Όλοι χρόνοι, Όλες εγκλίσεις', f: { voices: ['ενεργητική', 'μέση'], moods: ALLM, tenses: ['ενεστώτας', 'παρατατικός', 'μέλλοντας', 'αόριστος', 'παρακείμενος', 'υπερσυντέλικος'], forms: [...STD6, 'απαρέμφατο', 'μετοχή'] } },
  ];
  P['afwnolekta'] = dictProvider(AFW_LEVELS);

  /* ── rimata-mi — keyed dict (RMI_G) ─────────────────────────
     Source: games/rimata-mi/data.js  RMI_LEVELS (line 163) + rmiKeys.
     Entry props: {verb, voice, mood, tense}. Verb names are literal Greek lemmas.
     Levels 10/11 use RMI_ANOM_VERBS / RMI_ALL_VERBS — inlined below. */
  const RMI_ANOM = ['δίδωμι', 'τίθημι', 'ἵστημι', 'ἵημι'];
  const RMI_ALL = ['δείκνυμι', 'δίδωμι', 'τίθημι', 'ἵστημι', 'ἵημι'];
  const RMI_LEVELS = [
    { id: 1,  group: 'δείκνυμι — Ομαλό Πρότυπο', color: 'lgreen',  desc: 'Ενεστώτας & Παρατατικός — Ενεργητική & Μέση', f: { verbs: ['δείκνυμι'], voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός'] } },
    { id: 2,  group: 'Ανώμαλα — Ενεστώτας', color: 'lgreen',  desc: 'δίδωμι — Ενεστώτας & Παρατατικός, Ενεργ. & Μέση', f: { verbs: ['δίδωμι'], voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός'] } },
    { id: 3,  group: 'Ανώμαλα — Ενεστώτας', color: 'lgreen',  desc: 'τίθημι — Ενεστώτας & Παρατατικός, Ενεργ. & Μέση', f: { verbs: ['τίθημι'], voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός'] } },
    { id: 4,  group: 'Ανώμαλα — Ενεστώτας', color: 'lgreen',  desc: 'ἵστημι — Ενεστώτας & Παρατατικός, Ενεργ. & Μέση', f: { verbs: ['ἵστημι'], voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός'] } },
    { id: 5,  group: 'Ανώμαλα — Ενεστώτας', color: 'lgreen',  desc: 'ἵημι — Ενεστώτας & Παρατατικός, Ενεργ. & Μέση', f: { verbs: ['ἵημι'], voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός'] } },
    { id: 6,  group: 'Αόριστος Β΄', color: 'lpurple', desc: 'δίδωμι — Αόριστος Β΄, Ενεργ. & Μέση', f: { verbs: ['δίδωμι'], voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['αόριστος'] } },
    { id: 7,  group: 'Αόριστος Β΄', color: 'lpurple', desc: 'τίθημι — Αόριστος Β΄, Ενεργ. & Μέση', f: { verbs: ['τίθημι'], voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['αόριστος'] } },
    { id: 8,  group: 'Αόριστος Β΄', color: 'lpurple', desc: 'ἵστημι — Αόριστος Β΄, Ενεργ. Φωνή', f: { verbs: ['ἵστημι'], voices: ['ενεργητική'], moods: ['οριστική'], tenses: ['αόριστος'] } },
    { id: 9,  group: 'Αόριστος Β΄', color: 'lpurple', desc: 'ἵημι — Αόριστος Β΄, Ενεργ. & Μέση', f: { verbs: ['ἵημι'], voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['αόριστος'] } },
    { id: 10, group: 'Συνδυαστικό', color: 'lred', desc: 'Όλα τα ανώμαλα — Ενεστ. + Παρατ. + Αόρ.', f: { verbs: RMI_ANOM, voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός', 'αόριστος'] } },
    { id: 11, group: 'Συνδυαστικό', color: 'lred', desc: 'Όλα — δείκνυμι + ανώμαλα, Ενεστ. + Παρατ. + Αόρ.', f: { verbs: RMI_ALL, voices: ['ενεργητική', 'μέση'], moods: ['οριστική'], tenses: ['ενεστώτας', 'παρατατικός', 'αόριστος'] } },
  ];
  P['rimata-mi'] = dictProvider(RMI_LEVELS);

  return P;
})();
