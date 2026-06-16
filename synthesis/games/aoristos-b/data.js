// ============================================================
//  ΑΟΡΙΣΤΟΣ Β΄ — Πλήρης Κλίση
//  20 ρήματα με ανώμαλο αόριστο β΄
//  Οριστική, Υποτακτική, Ευκτική, Προστακτική + Απαρέμφατο + Μετοχή
//  Ενεργητική & Μέση Φωνή
// ============================================================

const AOB_G = {};
const AOBP  = ["α ενικό","β ενικό","γ ενικό","α πληθυντικό","β πληθυντικό","γ πληθυντικό"];
const AOBIP = ["β ενικό","γ ενικό","β πληθυντικό","γ πληθυντικό"];

function aobAdd(verb,form,voice,mood,tense,mc,fi,gender){
  const k=gender?`${verb}|${form}|${voice}|${mood}|${tense}|${gender}`:`${verb}|${form}|${voice}|${mood}|${tense}`;
  AOB_G[k]={verb,form,voice,mood,tense,gender:gender||null,endings:mc,fi_endings:fi||mc};
}

// ── VERB DATABASE ──
// r = αόριστος θέμα (χωρίς αύξηση — για Υποτ/Ευκτ/Προστ/Απαρεμφ/Μετοχή)
// ri = αυξημένο θέμα για Οριστική
// voice: "act", "mid", "both"
// exc: εξαιρετικός τύπος β΄ ενικό Προστ. ΕΦ
const AOB_VERBS = [
  {p:"ἄγω",     r:"ἀγαγ",  ri:"ἤγαγ",  v:"act"},
  {p:"ἁμαρτάνω",r:"ἁμαρτ", ri:"ἥμαρτ", v:"act"},
  {p:"βάλλω",   r:"βαλ",   ri:"ἔβαλ",  v:"act"},
  {p:"γίγνομαι",r:"γεν",   ri:"ἐγεν",  v:"mid"},
  {p:"ἔρχομαι", r:"ἐλθ",   ri:"ἦλθ",   v:"act", exc:"ἐλθέ"},
  {p:"εὑρίσκω", r:"εὑρ",   ri:"ηὗρ",   v:"act", exc:"εὑρέ"},
  {p:"ἔχω",     r:"σχ",    ri:"ἔσχ",   v:"act"},
  {p:"λαμβάνω", r:"λαβ",   ri:"ἔλαβ",  v:"act", exc:"λαβέ"},
  {p:"λανθάνω", r:"λαθ",   ri:"ἔλαθ",  v:"act"},
  {p:"λέγω",    r:"εἰπ",   ri:"εἶπ",   v:"act", exc:"εἰπέ"},
  {p:"λείπω",   r:"λιπ",   ri:"ἔλιπ",  v:"act"},
  {p:"μανθάνω", r:"μαθ",   ri:"ἔμαθ",  v:"act"},
  {p:"ὁράω",    r:"ἰδ",    ri:"εἶδ",   v:"act", exc:"ἰδέ"},
  {p:"πάσχω",   r:"παθ",   ri:"ἔπαθ",  v:"act"},
  {p:"πίπτω",   r:"πεσ",   ri:"ἔπεσ",  v:"act"},
  {p:"πυνθάνομαι",r:"πυθ", ri:"ἐπυθ",  v:"mid"},
  {p:"τέμνω",   r:"τεμ",   ri:"ἔτεμ",  v:"act"},
  {p:"τρέχω",   r:"δραμ",  ri:"ἔδραμ", v:"act"},
  {p:"φέρω",    r:"ἐνεγκ", ri:"ἤνεγκ", v:"act"},
  {p:"φεύγω",   r:"φυγ",   ri:"ἔφυγ",  v:"act"},
];

// ── ENDINGS ──
const AOB_ACT_IND = ["ον","ες","ε","ομεν","ετε","ον"];
const AOB_ACT_SUB = ["ω","ῃς","ῃ","ωμεν","ητε","ωσιν"];
const AOB_ACT_OPT = ["οιμι","οις","οι","οιμεν","οιτε","οιεν"];
const AOB_ACT_IMP = ["ε","έτω","ετε","όντων"]; // β ενικό, γ ενικό, β πλ, γ πλ
const AOB_ACT_INF = "εῖν";
const AOB_ACT_PART = {αρσ:"ών",θηλ:"οῦσα",ουδ:"όν"};

const AOB_MID_IND = ["όμην","ου","ετο","όμεθα","εσθε","οντο"];
const AOB_MID_SUB = ["ωμαι","ῃ","ηται","ώμεθα","ησθε","ωνται"];
const AOB_MID_OPT = ["οίμην","οιο","οιτο","οίμεθα","οισθε","οιντο"];
const AOB_MID_IMP = ["οῦ","έσθω","εσθε","έσθων"];
const AOB_MID_INF = "έσθαι";
const AOB_MID_PART = {αρσ:"όμενος",θηλ:"ομένη",ουδ:"όμενον"};

// ── GENERATOR ──
AOB_VERBS.forEach(v => {
  const voices = v.v === "both" ? ["act","mid"] : [v.v];

  voices.forEach(voice => {
    const gr = voice === "act" ? "ενεργητική" : "μέση";
    const IND  = voice === "act" ? AOB_ACT_IND  : AOB_MID_IND;
    const SUB  = voice === "act" ? AOB_ACT_SUB  : AOB_MID_SUB;
    const OPT  = voice === "act" ? AOB_ACT_OPT  : AOB_MID_OPT;
    const IMP  = voice === "act" ? AOB_ACT_IMP  : AOB_MID_IMP;
    const INF  = voice === "act" ? AOB_ACT_INF  : AOB_MID_INF;
    const PART = voice === "act" ? AOB_ACT_PART : AOB_MID_PART;

    // Οριστική (αυξημένο θέμα)
    AOBP.forEach((p,i) => aobAdd(v.p, p, gr, "οριστική", "αόριστος", [v.ri+IND[i]], [IND[i]]));

    // Υποτακτική (θέμα χωρίς αύξηση)
    AOBP.forEach((p,i) => aobAdd(v.p, p, gr, "υποτακτική", "αόριστος", [v.r+SUB[i]], [SUB[i]]));

    // Ευκτική
    AOBP.forEach((p,i) => aobAdd(v.p, p, gr, "ευκτική", "αόριστος", [v.r+OPT[i]], [OPT[i]]));

    // Προστακτική — 4 πρόσωπα
    AOBIP.forEach((p,i) => {
      // Εξαιρετικός τύπος β΄ ενικό ΕΦ
      if (i === 0 && voice === "act" && v.exc) {
        aobAdd(v.p, p, gr, "προστακτική", "αόριστος", [v.exc], [v.exc.replace(v.r,"")]);
      } else {
        aobAdd(v.p, p, gr, "προστακτική", "αόριστος", [v.r+IMP[i]], [IMP[i]]);
      }
    });

    // Απαρέμφατο
    aobAdd(v.p, "απαρέμφατο", gr, "—", "αόριστος", [v.r+INF], [INF]);

    // Μετοχή
    [["αρσενικό","αρσ"],["θηλυκό","θηλ"],["ουδέτερο","ουδ"]].forEach(([gGr,gK]) =>
      aobAdd(v.p, "μετοχή", gr, "—", "αόριστος", [v.r+PART[gK]], [PART[gK]], gGr));
  });
});

// ── LEVELS ──
const AOB_LEVELS = [
  {id:1, group:"Οριστική", color:"lgreen",
   desc:"Ενεργητική Φωνή — Οριστική",
   filter:{voices:["ενεργητική"], moods:["οριστική"], verbs:AOB_VERBS.filter(v=>v.v==="act").map(v=>v.p)}},
  {id:2, group:"Οριστική", color:"lyellow",
   desc:"Μέση Φωνή — Οριστική",
   filter:{voices:["μέση"], moods:["οριστική"], verbs:AOB_VERBS.filter(v=>v.v==="mid"||v.v==="both").map(v=>v.p)}},
  {id:3, group:"Υποτακτική & Ευκτική", color:"lgreen",
   desc:"Υποτακτική — Ενεργητική & Μέση",
   filter:{voices:["ενεργητική","μέση"], moods:["υποτακτική"]}},
  {id:4, group:"Υποτακτική & Ευκτική", color:"lyellow",
   desc:"Ευκτική — Ενεργητική & Μέση",
   filter:{voices:["ενεργητική","μέση"], moods:["ευκτική"]}},
  {id:5, group:"Προστακτική & Ονοματικοί", color:"lpurple",
   desc:"Προστακτική, Απαρέμφατο & Μετοχή",
   filter:{voices:["ενεργητική","μέση"], moods:["προστακτική","—"], forms:[...AOBIP,"απαρέμφατο","μετοχή"]}},
  {id:6, group:"Συνδυαστικό", color:"lred",
   desc:"Όλες εγκλίσεις — Ενεργητική & Μέση",
   filter:{voices:["ενεργητική","μέση"], moods:["οριστική","υποτακτική","ευκτική","προστακτική","—"]}},
];

function aobKeys(filter) {
  return Object.keys(AOB_G).filter(k => {
    const g = AOB_G[k];
    const mv  = !filter.verbs  || filter.verbs.includes(g.verb);
    const mvo = !filter.voices || filter.voices.includes(g.voice);
    const mm  = !filter.moods  || filter.moods.includes(g.mood);
    const mf  = !filter.forms  || filter.forms.includes(g.form);
    return mv && mvo && mm && mf;
  });
}

function aobGetStem(g) {
  const v = AOB_VERBS.find(x => x.p === g.verb); if (!v) return g.verb;
  return g.mood === "οριστική" ? v.ri : v.r;
}

function aobBuildQText(g) {
  const v = `<em>${g.verb}</em>`;
  const tags = (...it) => '<div class="lq-tags">'+it.map(([c,t])=>`<span class="lq-tag ${c}">${t}</span>`).join('')+'</div>';
  if (g.form==="απαρέμφατο") return `<div class="lq-main">Κατάληξη <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;">απαρεμφάτου</span> Αορ. Β΄ του ${v};</div>`+tags(['voice',g.voice+' Φωνή']);
  if (g.form==="μετοχή")     return `<div class="lq-main">Κατάληξη <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;">μετοχής</span> Αορ. Β΄ του ${v};</div>`+tags(['voice',g.voice+' Φωνή'],['gender',g.gender]);
  return `<div class="lq-main">Αόριστος Β΄ του ${v} — <span class="lq-tag form" style="font-size:1rem;padding:1px 10px;vertical-align:middle;">${g.form}</span>;</div>`+tags(['voice',g.voice+' Φωνή'],['mood',g.mood]);
}
window.AOB_LEVELS = AOB_LEVELS;
