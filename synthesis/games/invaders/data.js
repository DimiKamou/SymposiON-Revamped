// ============================================================
//  Grammar Invaders — Level Data  v2
//  Global: INVADERS_DB
//
//  Each level:
//    title   — shown in the question panel header
//    entries — exactly 6 objects { word, label }
//              word  : the Greek form shown ON the enemy ship
//              label : the grammatical description shown IN the question
//                      ("Πυροβόλησε: β΄ ενικό Ενεστώτα")
//
//  Grid is 6 × 3.  Each row = one shuffled copy of all 6 entries,
//  so every form appears once per row.  Questions are drawn only
//  from the front (bottom-most alive) row.
// ============================================================

const INVADERS_DB = [

  // ── Level 1 ────────────────────────────────────────────────
  {
    title: 'Ενεστώτας — λύω (Ενεργ. Φωνή)',
    entries: [
      { word: 'λύω',          label: 'α΄ ενικό' },
      { word: 'λύεις',        label: 'β΄ ενικό' },
      { word: 'λύει',         label: 'γ΄ ενικό' },
      { word: 'λύομεν',       label: 'α΄ πληθυντικό' },
      { word: 'λύετε',        label: 'β΄ πληθυντικό' },
      { word: 'λύουσι(ν)',    label: 'γ΄ πληθυντικό' },
    ],
  },

  // ── Level 2 ────────────────────────────────────────────────
  {
    title: 'Μέλλοντας — λύσω (Ενεργ. Φωνή)',
    entries: [
      { word: 'λύσω',         label: 'α΄ ενικό' },
      { word: 'λύσεις',       label: 'β΄ ενικό' },
      { word: 'λύσει',        label: 'γ΄ ενικό' },
      { word: 'λύσομεν',      label: 'α΄ πληθυντικό' },
      { word: 'λύσετε',       label: 'β΄ πληθυντικό' },
      { word: 'λύσουσι(ν)',   label: 'γ΄ πληθυντικό' },
    ],
  },

  // ── Level 3 ────────────────────────────────────────────────
  {
    title: 'Αόριστος Α΄ — ἔλυσα (Ενεργ. Φωνή)',
    entries: [
      { word: 'ἔλυσα',        label: 'α΄ ενικό' },
      { word: 'ἔλυσας',       label: 'β΄ ενικό' },
      { word: 'ἔλυσε(ν)',     label: 'γ΄ ενικό' },
      { word: 'ἐλύσαμεν',     label: 'α΄ πληθυντικό' },
      { word: 'ἐλύσατε',      label: 'β΄ πληθυντικό' },
      { word: 'ἔλυσαν',       label: 'γ΄ πληθυντικό' },
    ],
  },
];
