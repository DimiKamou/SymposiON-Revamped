// ============================================================
//  ΠΑΘΗΤΙΚΟΣ ΜΕΛΛΟΝΤΑΣ & ΑΟΡΙΣΤΟΣ — game controller
//  Depends on: shared-engine.js
//
//  Επίπεδο 1: Βασικά ρήματα (λύω — απλό θη)
//  Επίπεδο 2: Αφωνόληκτα (φθ / χθ / σθ)
// ============================================================

const PATH_PREFIX = 'path';
let _pathFilter = null;

// ── GRAMMAR DATA ──
const PATH_G = {};
const PATH_P  = ["α ενικό","β ενικό","γ ενικό","α πληθυντικό","β πληθυντικό","γ πληθυντικό"];
const PATH_IP = ["β ενικό","γ ενικό","β πληθυντικό","γ πληθυντικό"];

function _pathAdd(verb, cat, form, tense, mood, mc, fi, stem, gender) {
  const k = gender
    ? `${verb}|${form}|${tense}|${mood}|${gender}`
    : `${verb}|${form}|${tense}|${mood}`;
  PATH_G[k] = { verb, cat, form, tense, mood, gender: gender||null,
                endings: mc, fi_endings: fi||mc, stem };
}

// ── Παθητικό πρόσφυμα ανά κατηγορία ──
// Αυτό είναι το τελικό σύμφωνο που μπαίνει πριν την κατάληξη θη.
// βασικό: θ (λύω → λυ-θ-ήσομαι)
// χειλικό: φθ (λείπω → λει-φθ-ήσομαι)
// ουρανικό: χθ (πράττω → πρα-χθ-ήσομαι)
// οδοντικό: σθ (νομίζω → νομι-σθ-ήσομαι)
const _PC = { βασικό:"θ", χειλικό:"φθ", ουρανικό:"χθ", οδοντικό:"σθ" };

// ── Επιθέματα ανά τύπο (μετά το παθητικό πρόσφυμα) ──
const _S = {
  // Παθητικός Μέλλοντας
  mel_ind:  ["ήσομαι","ήσῃ","ήσεται","ησόμεθα","ήσεσθε","ήσονται"],
  mel_opt:  ["ησοίμην","ήσοιο","ήσοιτο","ησοίμεθα","ήσοισθε","ήσοιντο"],
  mel_inf:  "ήσεσθαι",
  mel_part: { αρσενικό:"ησόμενος", θηλυκό:"ησομένη", ουδέτερο:"ησόμενον" },
  // Παθητικός Αόριστος
  aor_ind:  ["ην","ης","η","ημεν","ητε","ησαν"],   // με αυξημένο θέμα
  aor_sub:  ["ῶ","ῇς","ῇ","ῶμεν","ῆτε","ῶσι"],
  aor_opt:  ["είην","είης","είη","εῖμεν","εῖτε","εῖεν"],
  aor_imp:  {
    "β ενικό":       ["ητι"],
    "γ ενικό":       ["ήτω"],
    "β πληθυντικό":  ["ητε"],
    "γ πληθυντικό":  ["έντων","ήτωσαν"],
  },
  aor_inf:  "ῆναι",
  aor_part: { αρσενικό:"είς", θηλυκό:"εῖσα", ουδέτερο:"έν" },
};

// ── Βάση ρημάτων ──
// fi  : εμφανιζόμενο θέμα για μη αυξημένους τύπους (μέλλ. + μη-οριστικές εγκλ. αορ.)
// fi_aor: θέμα για αυξημένη οριστική αορίστου
const PATH_VERBS = [
  // ── Βασικά (απλό θη) ──
  { verb:"λύω",     cat:"βασικό",   fi:"λυ",    fi_aor:"ἐλύ" },
  // ── Χειλικόληκτα (π/β/φ → φθ) ──
  { verb:"λείπω",   cat:"χειλικό",  fi:"λει",   fi_aor:"ἐλεί" },
  { verb:"πέμπω",   cat:"χειλικό",  fi:"πεμ",   fi_aor:"ἐπέμ" },
  { verb:"καλύπτω", cat:"χειλικό",  fi:"καλύ",  fi_aor:"ἐκαλύ" },
  // ── Ουρανόφωνα (κ/γ/χ/ττ → χθ) ──
  { verb:"πράττω",  cat:"ουρανικό", fi:"πρα",   fi_aor:"ἐπρά" },
  { verb:"ἄγω",     cat:"ουρανικό", fi:"ἀ",     fi_aor:"ἤ"    },
  { verb:"φυλάττω", cat:"ουρανικό", fi:"φυλα",  fi_aor:"ἐφυλά" },
  { verb:"ταράττω", cat:"ουρανικό", fi:"τάρα",  fi_aor:"ἐταρά" },
  { verb:"κηρύττω", cat:"ουρανικό", fi:"κηρυ",  fi_aor:"ἐκηρύ" },
  { verb:"διώκω",   cat:"ουρανικό", fi:"διω",   fi_aor:"ἐδιώ"  },
  // ── Οδοντόφωνα (τ/δ/θ/ζ → σθ) ──
  { verb:"νομίζω",  cat:"οδοντικό", fi:"νομι",  fi_aor:"ἐνομί" },
  { verb:"πείθω",   cat:"οδοντικό", fi:"πει",   fi_aor:"ἐπεί"  },
  { verb:"ψεύδω",   cat:"οδοντικό", fi:"ψευ",   fi_aor:"ἐψεύ"  },
];

// ── Κατασκευή δεδομένων ──
(function _buildPathData() {
  PATH_VERBS.forEach(v => {
    const pc  = _PC[v.cat];
    const MEL = "παθ. μέλλοντας";
    const AOR = "παθ. αόριστος";
    const st  = v.fi + "-";        // θέμα για μη αυξημένους τύπους
    const sta = v.fi_aor + "-";    // θέμα για αυξημένη ορ. αορίστου

    // ── ΠΑΘΗΤΙΚΟΣ ΜΕΛΛΟΝΤΑΣ ──
    PATH_P.forEach((frm, i) =>
      _pathAdd(v.verb, v.cat, frm, MEL, "οριστική",    [pc+_S.mel_ind[i]], null, st));
    PATH_P.forEach((frm, i) =>
      _pathAdd(v.verb, v.cat, frm, MEL, "ευκτική",     [pc+_S.mel_opt[i]], null, st));
    _pathAdd(v.verb, v.cat, "απαρέμφατο", MEL, "—", [pc+_S.mel_inf], null, st);
    Object.entries(_S.mel_part).forEach(([gen, suf]) =>
      _pathAdd(v.verb, v.cat, "μετοχή", MEL, "—", [pc+suf], null, st, gen));

    // ── ΠΑΘΗΤΙΚΟΣ ΑΟΡΙΣΤΟΣ ──
    // Οριστική — αυξημένο θέμα
    PATH_P.forEach((frm, i) =>
      _pathAdd(v.verb, v.cat, frm, AOR, "οριστική",    [pc+_S.aor_ind[i]], null, sta));
    // Υποτακτική
    PATH_P.forEach((frm, i) =>
      _pathAdd(v.verb, v.cat, frm, AOR, "υποτακτική",  [pc+_S.aor_sub[i]], null, st));
    // Ευκτική
    PATH_P.forEach((frm, i) =>
      _pathAdd(v.verb, v.cat, frm, AOR, "ευκτική",     [pc+_S.aor_opt[i]], null, st));
    // Προστακτική
    PATH_IP.forEach(frm =>
      _pathAdd(v.verb, v.cat, frm, AOR, "προστακτική", _S.aor_imp[frm].map(s => pc+s), null, st));
    // Απαρέμφατο & Μετοχή
    _pathAdd(v.verb, v.cat, "απαρέμφατο", AOR, "—", [pc+_S.aor_inf], null, st);
    Object.entries(_S.aor_part).forEach(([gen, suf]) =>
      _pathAdd(v.verb, v.cat, "μετοχή", AOR, "—", [pc+suf], null, st, gen));
  });
})();

// ── HELPER FUNCTIONS ──
function pathKeys(filter) {
  return Object.keys(PATH_G).filter(k => {
    const g = PATH_G[k];
    if (filter.verbs     && !filter.verbs.includes(g.verb))     return false;
    if (filter.verb_cats && !filter.verb_cats.includes(g.cat))  return false;
    if (!filter.tenses.includes(g.tense))  return false;
    if (!filter.moods.includes(g.mood))    return false;
    if (!filter.forms.includes(g.form))    return false;
    return true;
  });
}

function pathGetStem(g) { return g.stem; }

function pathBuildQText(g) {
  const v = `<em>${g.verb}</em>`;
  const tags = (...items) =>
    '<div class="lq-tags">' +
    items.map(([cls, txt]) => `<span class="lq-tag ${cls}">${txt}</span>`).join('') +
    '</div>';
  if (g.form === "απαρέμφατο")
    return `<div class="lq-main">Ποια είναι η κατάληξη του <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;">απαρεμφάτου</span> του ${v};</div>` +
           tags(['tense', g.tense]);
  if (g.form === "μετοχή")
    return `<div class="lq-main">Ποια είναι η κατάληξη της <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;">μετοχής</span> του ${v};</div>` +
           tags(['tense', g.tense], ['gender', g.gender]);
  return `<div class="lq-main">Ποια είναι η κατάληξη του ${v} στο <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;vertical-align:middle;">${g.form}</span>;</div>` +
         tags(['tense', g.tense], ['mood', g.mood]);
}

// ── LEVELS ──
const _MEL = "παθ. μέλλοντας";
const _AOR = "παθ. αόριστος";
const _ALL_FORMS = [...PATH_P, "β πληθυντικό", "απαρέμφατο", "μετοχή"]
                    .filter((v, i, a) => a.indexOf(v) === i);
const _MEL_FORMS = [...PATH_P, "απαρέμφατο", "μετοχή"];
const _AOR_FORMS = [...PATH_P, ...PATH_IP.filter(x => !PATH_P.includes(x)), "απαρέμφατο", "μετοχή"];
const _MEL_MOODS = ["οριστική","ευκτική","—"];
const _AOR_MOODS = ["οριστική","υποτακτική","ευκτική","προστακτική","—"];

const PATH_LVL = [
  // ════ Παθητικός Μέλλοντας — Βασικά ════
  { id:1,  group:"Παθητικός Μέλλοντας (βασικά)", color:"lgreen",
    desc:"Οριστική — Παθ. Μέλλοντας",
    filter:{ verbs:["λύω"], tenses:[_MEL], moods:["οριστική"], forms:PATH_P } },
  { id:2,  group:"Παθητικός Μέλλοντας (βασικά)", color:"lyellow",
    desc:"Ευκτική — Παθ. Μέλλοντας",
    filter:{ verbs:["λύω"], tenses:[_MEL], moods:["ευκτική"], forms:PATH_P } },
  { id:3,  group:"Παθητικός Μέλλοντας (βασικά)", color:"lpurple",
    desc:"Απαρέμφατο & Μετοχή — Παθ. Μέλλοντας",
    filter:{ verbs:["λύω"], tenses:[_MEL], moods:["—"], forms:["απαρέμφατο","μετοχή"] } },
  { id:4,  group:"Παθητικός Μέλλοντας (βασικά)", color:"lred",
    desc:"Όλες οι εγκλίσεις — Παθ. Μέλλοντας",
    filter:{ verbs:["λύω"], tenses:[_MEL], moods:_MEL_MOODS, forms:_MEL_FORMS } },
  // ════ Παθητικός Αόριστος — Βασικά ════
  { id:5,  group:"Παθητικός Αόριστος (βασικά)", color:"lgreen",
    desc:"Οριστική — Παθ. Αόριστος",
    filter:{ verbs:["λύω"], tenses:[_AOR], moods:["οριστική"], forms:PATH_P } },
  { id:6,  group:"Παθητικός Αόριστος (βασικά)", color:"lgreen",
    desc:"Υποτακτική — Παθ. Αόριστος",
    filter:{ verbs:["λύω"], tenses:[_AOR], moods:["υποτακτική"], forms:PATH_P } },
  { id:7,  group:"Παθητικός Αόριστος (βασικά)", color:"lyellow",
    desc:"Ευκτική — Παθ. Αόριστος",
    filter:{ verbs:["λύω"], tenses:[_AOR], moods:["ευκτική"], forms:PATH_P } },
  { id:8,  group:"Παθητικός Αόριστος (βασικά)", color:"lyellow",
    desc:"Προστακτική — Παθ. Αόριστος",
    filter:{ verbs:["λύω"], tenses:[_AOR], moods:["προστακτική"], forms:PATH_IP } },
  { id:9,  group:"Παθητικός Αόριστος (βασικά)", color:"lpurple",
    desc:"Απαρέμφατο & Μετοχή — Παθ. Αόριστος",
    filter:{ verbs:["λύω"], tenses:[_AOR], moods:["—"], forms:["απαρέμφατο","μετοχή"] } },
  { id:10, group:"Παθητικός Αόριστος (βασικά)", color:"lred",
    desc:"Όλες οι εγκλίσεις — Παθ. Αόριστος",
    filter:{ verbs:["λύω"], tenses:[_AOR], moods:_AOR_MOODS, forms:_AOR_FORMS } },
  // ════ Συνδυαστικό Βασικό ════
  { id:11, group:"Συνδυαστικό (βασικά)", color:"lred",
    desc:"Μέλλοντας + Αόριστος — Βασικά",
    filter:{ verbs:["λύω"], tenses:[_MEL,_AOR], moods:[..._MEL_MOODS,..._AOR_MOODS].filter((v,i,a)=>a.indexOf(v)===i), forms:[..._MEL_FORMS,..._AOR_FORMS].filter((v,i,a)=>a.indexOf(v)===i) } },
  // ════ Αφωνόληκτα — Χειλικόληκτα ════
  { id:12, group:"Αφωνόληκτα — Χειλικόληκτα (φθ)", color:"lgreen",
    desc:"Μέλλοντας — χειλικά (λείπω, πέμπω, καλύπτω)",
    filter:{ verb_cats:["χειλικό"], tenses:[_MEL], moods:_MEL_MOODS, forms:_MEL_FORMS } },
  { id:13, group:"Αφωνόληκτα — Χειλικόληκτα (φθ)", color:"lyellow",
    desc:"Αόριστος — χειλικά (λείπω, πέμπω, καλύπτω)",
    filter:{ verb_cats:["χειλικό"], tenses:[_AOR], moods:_AOR_MOODS, forms:_AOR_FORMS } },
  { id:14, group:"Αφωνόληκτα — Χειλικόληκτα (φθ)", color:"lred",
    desc:"Μέλλοντας + Αόριστος — χειλικά",
    filter:{ verb_cats:["χειλικό"], tenses:[_MEL,_AOR], moods:[..._MEL_MOODS,..._AOR_MOODS].filter((v,i,a)=>a.indexOf(v)===i), forms:[..._MEL_FORMS,..._AOR_FORMS].filter((v,i,a)=>a.indexOf(v)===i) } },
  // ════ Αφωνόληκτα — Ουρανόφωνα ════
  { id:15, group:"Αφωνόληκτα — Ουρανόφωνα (χθ)", color:"lgreen",
    desc:"Μέλλοντας — ουρανικά (πράττω, ἄγω, φυλάττω…)",
    filter:{ verb_cats:["ουρανικό"], tenses:[_MEL], moods:_MEL_MOODS, forms:_MEL_FORMS } },
  { id:16, group:"Αφωνόληκτα — Ουρανόφωνα (χθ)", color:"lyellow",
    desc:"Αόριστος — ουρανικά",
    filter:{ verb_cats:["ουρανικό"], tenses:[_AOR], moods:_AOR_MOODS, forms:_AOR_FORMS } },
  { id:17, group:"Αφωνόληκτα — Ουρανόφωνα (χθ)", color:"lred",
    desc:"Μέλλοντας + Αόριστος — ουρανικά",
    filter:{ verb_cats:["ουρανικό"], tenses:[_MEL,_AOR], moods:[..._MEL_MOODS,..._AOR_MOODS].filter((v,i,a)=>a.indexOf(v)===i), forms:[..._MEL_FORMS,..._AOR_FORMS].filter((v,i,a)=>a.indexOf(v)===i) } },
  // ════ Αφωνόληκτα — Οδοντόφωνα ════
  { id:18, group:"Αφωνόληκτα — Οδοντόφωνα (σθ)", color:"lgreen",
    desc:"Μέλλοντας — οδοντικά (νομίζω, πείθω, ψεύδω)",
    filter:{ verb_cats:["οδοντικό"], tenses:[_MEL], moods:_MEL_MOODS, forms:_MEL_FORMS } },
  { id:19, group:"Αφωνόληκτα — Οδοντόφωνα (σθ)", color:"lyellow",
    desc:"Αόριστος — οδοντικά",
    filter:{ verb_cats:["οδοντικό"], tenses:[_AOR], moods:_AOR_MOODS, forms:_AOR_FORMS } },
  { id:20, group:"Αφωνόληκτα — Οδοντόφωνα (σθ)", color:"lred",
    desc:"Μέλλοντας + Αόριστος — οδοντικά",
    filter:{ verb_cats:["οδοντικό"], tenses:[_MEL,_AOR], moods:[..._MEL_MOODS,..._AOR_MOODS].filter((v,i,a)=>a.indexOf(v)===i), forms:[..._MEL_FORMS,..._AOR_FORMS].filter((v,i,a)=>a.indexOf(v)===i) } },
  // ════ Αφωνόληκτα Συνδυαστικό ════
  { id:21, group:"Αφωνόληκτα — Συνδυαστικό", color:"lred",
    desc:"Μέλλοντας — όλες κατηγορίες (φθ / χθ / σθ)",
    filter:{ verb_cats:["χειλικό","ουρανικό","οδοντικό"], tenses:[_MEL], moods:_MEL_MOODS, forms:_MEL_FORMS } },
  { id:22, group:"Αφωνόληκτα — Συνδυαστικό", color:"lred",
    desc:"Αόριστος — όλες κατηγορίες (φθ / χθ / σθ)",
    filter:{ verb_cats:["χειλικό","ουρανικό","οδοντικό"], tenses:[_AOR], moods:_AOR_MOODS, forms:_AOR_FORMS } },
  { id:23, group:"Αφωνόληκτα — Συνδυαστικό", color:"lred",
    desc:"Μέλλοντας + Αόριστος — όλα τα αφωνόληκτα",
    filter:{ verb_cats:["χειλικό","ουρανικό","οδοντικό"], tenses:[_MEL,_AOR],
             moods:[..._MEL_MOODS,..._AOR_MOODS].filter((v,i,a)=>a.indexOf(v)===i),
             forms:[..._MEL_FORMS,..._AOR_FORMS].filter((v,i,a)=>a.indexOf(v)===i) } },
];

// ── GAME BUILD / OPEN / CLOSE ──
const _PATH_MODES = [
  { id:'mc',    icon:'🔲', label:'Πολλαπλή Επιλογή',    hint:'Επίλεξε από 4 καταλήξεις' },
  { id:'fi',    icon:'✏️',  label:'Συμπλήρωση Κενού',    hint:'Γράψε την κατάληξη' },
  { id:'fw',    icon:'📝', label:'Ολόκληρος Τύπος',      hint:'Γράψε ολόκληρη τη λέξη' },
  { id:'match', icon:'🔗', label:'Αντιστοίχιση',          hint:'Αντίστοιχισε τύπο με περιγραφή' },
];

function openPathitiko(levelId, mode) {
  document.getElementById('path-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('path-screen-levels')) _pathBuild();
  // Auto-navigate to a specific level+mode when QR-scanned
  if (levelId) {
    setTimeout(() => {
      const card = document.querySelector(`#path-level-grid .lvl-card[data-lvl-id="${levelId}"]`);
      if (card) card.click();
      if (mode) setTimeout(() => gramSetMode('path', mode), 60);
    }, 60);
  }
}

function closePathitiko() {
  if (_gramCleanup && _gramCleanup['path']) _gramCleanup['path']();
  document.getElementById('path-overlay').classList.remove('active');
  document.body.style.overflow = '';
  const wrap = document.getElementById('path-wrap');
  if (wrap) {
    wrap.querySelectorAll('.lyo-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('path-screen-levels')?.classList.add('active');
  }
}

function _pathBuild() {
  const wrap = document.getElementById('path-wrap');
  wrap.innerHTML = gramBuildScreens(
    PATH_PREFIX,
    'Παθητικός Μέλλοντας & Αόριστος',
    'Παθητική Φωνή — Μέλλοντας · Αόριστος · Όλες οι Εγκλίσεις',
    { modes: _PATH_MODES }
  );
  wrap.querySelectorAll('select').forEach(s => {
    s.style.cssText = 'width:100%;padding:9px 12px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:0.93rem;cursor:pointer;font-family:inherit;';
  });

  gramBuildLevelGrid(PATH_PREFIX, PATH_LVL, lvl => {
    _pathFilter = lvl.filter;
    document.getElementById('path-sett-title').textContent = `Επίπεδο ${lvl.id} — ${lvl.desc}`;
    document.getElementById('path-sett-back').onclick = () => {
      document.querySelectorAll('#path-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
      document.getElementById('path-screen-levels').classList.add('active');
    };
    document.querySelectorAll('#path-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('path-screen-settings').classList.add('active');
  });

  document.getElementById('path-launch-btn').onclick = _pathLaunch;
  gramBuildKeyboard(PATH_PREFIX);
  gramSetMode(PATH_PREFIX, 'mc');
}

function _pathLaunch() {
  const mode = gramGetMode(PATH_PREFIX);
  if (!_pathFilter) return;
  const time  = parseInt(document.getElementById('path-sel-time').value);
  const lives = parseInt(document.getElementById('path-sel-lives').value);
  gramRunGame({
    prefix:  PATH_PREFIX,
    G:       PATH_G,
    keysFn:  pathKeys,
    stemFn:  pathGetStem,
    qtFn:    pathBuildQText,
    filter:  _pathFilter,
    mode,
    lives,
    timer:   time,
    wrapId:  'path-wrap',
  });
}
