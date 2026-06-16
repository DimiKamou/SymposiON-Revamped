/* ────────────────────────────────────────────────────────────
   _materialize.mjs — convert GENERATOR-based grammar games into
   editable paradigm tables (option (a) "materialise").

   Each adapter RESHAPES the forms the game's own generator already
   produces, so the output is faithful by construction — no morphology
   is re-derived here. The Studio then edits these tables and the game
   can read them (generator retired).

   Add one adapter per game; register it in ADAPTERS. migrate-content.mjs
   calls materializeAll() and writes each result to gameContent/{id}.
   ──────────────────────────────────────────────────────────── */
import { resolve } from 'path';
import { loadGlobals } from './_loadStatic.mjs';

const PERS = ['α ενικό', 'β ενικό', 'γ ενικό', 'α πληθυντικό', 'β πληθυντικό', 'γ πληθυντικό'];
const PLAB = ['α΄ ενικ.', 'β΄ ενικ.', 'γ΄ ενικ.', 'α΄ πληθ.', 'β΄ πληθ.', 'γ΄ πληθ.'];
const MOODS = [['οριστική', 'Οριστική'], ['υποτακτική', 'Υποτακτική'], ['ευκτική', 'Ευκτική'], ['προστακτική', 'Προστακτική']];
const GEN = [['αρσενικό', 'Μετοχή (αρσ.)'], ['θηλυκό', 'Μετοχή (θηλ.)'], ['ουδέτερο', 'Μετοχή (ουδ.)']];
const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
const slug = s => String(s).replace(/[^a-zα-ω0-9]+/gi, '-').replace(/^-|-$/g, '').slice(0, 40) || 'u';

/* ── generic verb-paradigm map ────────────────────────────────
   Works for any game whose generator fills a map of records
   { verb, form, voice, mood, tense, gender, endings:[fullForm] }
   (aoristos-b · afwnolekta · synirimmena · rimata-mi). Groups by
   (tense, voice); finite forms → persons×moods, non-finite → a
   small Ονοματικοί-Τύποι slice. labelMap maps a verb key→lemma.   */
function materializeVerbG(G, { labelMap = {}, unitWord = 'Χρόνος', cellOf, defaultVoice = '' } = {}) {
  const cell = cellOf || (g => (g.endings && g.endings[0]) || '');
  const all = Object.values(G).filter(g => g && cell(g));
  if (!all.length) return null;
  const vo = g => g.voice || defaultVoice || '';
  const lemmaOf = v => labelMap[v] || v;
  const val = (items, verb, form, mood, gender) => {
    const g = items.find(x => x.verb === verb && x.form === form && x.mood === mood && (gender ? x.gender === gender : true));
    return g ? cell(g) : '';
  };
  // group by tense||voice, preserving first-seen order
  const groups = new Map();
  all.forEach(g => { const k = `${g.tense}||${vo(g)}`; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(g); });
  const units = [];
  for (const [key, items] of groups) {
    const [tense, voice] = key.split('||');
    const verbs = [...new Set(items.map(g => g.verb))];
    // finite
    const moods = MOODS.filter(([mk]) => items.some(g => g.mood === mk && PERS.includes(g.form)));
    const rows = PERS.filter(p => items.some(g => g.form === p));
    if (moods.length && rows.length) {
      units.push({ key: slug(`${tense}-${voice}-fin`), label: `${cap(tense)} · ${cap(voice)} — Κλίση`,
        rowAxis: rows.map(p => PLAB[PERS.indexOf(p)]), colAxis: moods.map(m => m[1]),
        entries: verbs.filter(v => items.some(g => g.verb === v && PERS.includes(g.form)))
          .map(v => ({ lemma: lemmaOf(v), meta: `${cap(voice)} Φωνή`,
            cells: rows.map(p => moods.map(([mk]) => val(items, v, p, mk))) })) });
    }
    // non-finite (infinitive + participle); getters close over `items`, take verb
    const hasInf = items.some(g => g.form === 'απαρέμφατο');
    const partGenders = GEN.filter(([gk]) => items.some(g => g.form === 'μετοχή' && g.gender === gk));
    const plainPart = !partGenders.length && items.some(g => g.form === 'μετοχή');
    const rowDefs = [];
    if (hasInf) rowDefs.push(['Απαρέμφατο', v => val(items, v, 'απαρέμφατο', '—')]);
    partGenders.forEach(([gk, lbl]) => rowDefs.push([lbl, v => val(items, v, 'μετοχή', '—', gk)]));
    if (plainPart) rowDefs.push(['Μετοχή', v => val(items, v, 'μετοχή', '—')]);
    if (rowDefs.length) {
      const nfVerbs = verbs.filter(v => items.some(g => g.verb === v && (g.form === 'απαρέμφατο' || g.form === 'μετοχή')));
      units.push({ key: slug(`${tense}-${voice}-onom`), label: `${cap(tense)} · ${cap(voice)} — Ονοματικοί Τύποι`,
        rowAxis: rowDefs.map(r => r[0]), colAxis: ['Τύπος'],
        entries: nfVerbs.map(v => ({ lemma: lemmaOf(v), meta: `${cap(voice)} Φωνή`,
          cells: rowDefs.map(r => [r[1](v)]) })) });
    }
  }
  return { schema: 'paradigm', unitWord, unitWordEn: 'Section', units };
}

/* ── stored declension DB ({ l, t, s:[cases], p:[cases] }) ──── */
function materializeDeclensionDB(DB, cases, { groupKey = 'd', groupLabels = {}, unitWord = 'Κλίση' } = {}) {
  const groups = new Map();
  DB.forEach(r => { const k = r[groupKey]; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); });
  const units = [...groups.keys()].map(k => ({
    key: slug(String(k)), label: groupLabels[k] || `${k}`,
    rowAxis: cases.slice(), colAxis: ['Ενικός', 'Πληθυντικός'],
    entries: groups.get(k).map(r => ({ lemma: r.l, meta: r.t || '',
      cells: cases.map((_, i) => [(r.s && r.s[i]) || '', (r.p && r.p[i]) || '']) })),
  }));
  return { schema: 'paradigm', unitWord, unitWordEn: 'Declension', units };
}

/* ── stored adjective DB ({ l, sub, m/f/n:{s:[cases],p:[cases]} }) ── */
function materializeAdjectives(DB, cases, { unitWord = 'Κατηγορία' } = {}) {
  const COLS = ['Αρσ. Ενικ.', 'Αρσ. Πληθ.', 'Θηλ. Ενικ.', 'Θηλ. Πληθ.', 'Ουδ. Ενικ.', 'Ουδ. Πληθ.'];
  const at = (g, k, i) => (g && g[k] && g[k][i]) || '';
  const groups = new Map();
  DB.forEach(r => { const k = r.sub || '—'; if (!groups.has(k)) groups.set(k, []); groups.get(k).push(r); });
  const units = [...groups.keys()].map(k => ({
    key: slug(k), label: k,
    rowAxis: cases.slice(), colAxis: COLS,
    entries: groups.get(k).map(r => ({ lemma: r.l, meta: '',
      cells: cases.map((_, i) => [at(r.m, 's', i), at(r.m, 'p', i), at(r.f, 's', i), at(r.f, 'p', i), at(r.n, 's', i), at(r.n, 'p', i)]) })),
  }));
  return { schema: 'paradigm', unitWord, unitWordEn: 'Category', units };
}

/* ── eimi: { lemma, tenses:[{ id,label, groups:[{mood, forms:[{l,f}] }] }] } ── */
function materializeEimi(PARA) {
  const FIN = ['Οριστική', 'Υποτακτική', 'Ευκτική', 'Προστακτική'];
  const units = [];
  (PARA.tenses || []).forEach(t => {
    const fin = t.groups.filter(g => FIN.includes(g.mood));
    if (fin.length) {
      const rows = []; fin.forEach(g => g.forms.forEach(f => { if (!rows.includes(f.l)) rows.push(f.l); }));
      units.push({ key: slug(t.id + '-fin'), label: `${t.label} — Κλίση`,
        rowAxis: rows, colAxis: fin.map(g => g.mood),
        entries: [{ lemma: PARA.lemma, meta: t.label,
          cells: rows.map(rl => fin.map(g => { const f = g.forms.find(x => x.l === rl); return f ? f.f : ''; })) }] });
    }
    const nf = t.groups.filter(g => !FIN.includes(g.mood));
    if (nf.length) {
      const rows = [], vals = [];
      nf.forEach(g => g.forms.forEach(f => { rows.push(g.mood + (f.l && f.l !== g.mood ? ` ${f.l}` : '')); vals.push([f.f]); }));
      units.push({ key: slug(t.id + '-onom'), label: `${t.label} — Ονοματικοί Τύποι`,
        rowAxis: rows, colAxis: ['Τύπος'], entries: [{ lemma: PARA.lemma, meta: t.label, cells: vals }] });
    }
  });
  return { schema: 'paradigm', unitWord: 'Χρόνος', unitWordEn: 'Tense', units };
}

/* ── anwmala-rimata: principal parts [{lemma,letter,forms:[{v,t,f}]}] ── */
function materializeAnwmala(DB) {
  const TENSES = [['present', 'Ενεστώτας'], ['imperfect', 'Παρατατικός'], ['future', 'Μέλλοντας'], ['aorist', 'Αόριστος'], ['perfect', 'Παρακείμενος'], ['pluperfect', 'Υπερσυντέλικος']];
  const VOICES = [['active', 'Ενεργητική'], ['middle_passive', 'Μέση / Παθ.']];
  const f = (e, v, t) => { const x = (e.forms || []).find(y => y.v === v && y.t === t); return x ? x.f : ''; };
  const byLetter = new Map();
  DB.forEach(e => { const k = e.letter || '—'; if (!byLetter.has(k)) byLetter.set(k, []); byLetter.get(k).push(e); });
  const units = [...byLetter.keys()].map(L => ({
    key: slug('l-' + L), label: `Γράμμα ${L}`,
    rowAxis: TENSES.map(t => t[1]), colAxis: VOICES.map(v => v[1]),
    entries: byLetter.get(L).map(e => ({ lemma: e.lemma, meta: e.meaning || '',
      cells: TENSES.map(([tk]) => VOICES.map(([vk]) => f(e, vk, tk))) })),
  }));
  return { schema: 'paradigm', unitWord: 'Γράμμα', unitWordEn: 'Letter', units };
}

/* ── lat-epitheta: [{l, sub, t:gender, degree, s:[cases], p:[cases]}] ── */
function materializeLatAdjectives(DB, cases) {
  const COLS = ['Αρσ. Ενικ.', 'Αρσ. Πληθ.', 'Θηλ. Ενικ.', 'Θηλ. Πληθ.', 'Ουδ. Ενικ.', 'Ουδ. Πληθ.'];
  const at = (r, k, i) => (r && r[k] && r[k][i]) || '';
  // group rows by sub → adjective(lemma+degree) → {αρσ,θηλ,ουδ}
  const subs = new Map();
  DB.forEach(r => { const sk = r.sub || '—'; if (!subs.has(sk)) subs.set(sk, new Map()); const ak = `${r.l}||${r.degree || 'positive'}`;
    const m = subs.get(sk); if (!m.has(ak)) m.set(ak, { l: r.l, degree: r.degree }); m.get(ak)[r.t] = r; });
  const units = [...subs.keys()].map(sk => ({
    key: slug(sk), label: sk,
    rowAxis: cases.slice(), colAxis: COLS,
    entries: [...subs.get(sk).values()].map(a => ({
      lemma: a.l + (a.degree && a.degree !== 'positive' ? ` (${a.degree})` : ''), meta: '',
      cells: cases.map((_, i) => [at(a['αρσενικό'], 's', i), at(a['αρσενικό'], 'p', i), at(a['θηλυκό'], 's', i), at(a['θηλυκό'], 'p', i), at(a['ουδέτερο'], 's', i), at(a['ουδέτερο'], 'p', i)]) })),
  }));
  return { schema: 'paradigm', unitWord: 'Κατηγορία', unitWordEn: 'Category', units };
}

/* ── antonymies: ANT_RAW [id,lemma,type,case,number,gender,form,alts] ──
   Pronouns vary in dimensions, so each lemma is its own unit with cols =
   the (number[/gender]) combos it actually uses (self-consistent table). */
function materializeAntonymies(RAW, caseLabels, typeLabels) {
  const ARITH = ['ενικός', 'πληθυντικός'];
  const GEN = [['αρσενικό', 'Αρσ.'], ['θηλυκό', 'Θηλ.'], ['ουδέτερο', 'Ουδ.']];
  const cap = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const byLemma = new Map();
  RAW.forEach(row => {
    const [, lemma, type, ptosi, arithmos, genos, form, alts] = row;
    if (!byLemma.has(lemma)) byLemma.set(lemma, { type, rows: [] });
    byLemma.get(lemma).rows.push({ ptosi, arithmos, genos, form, alts: alts || [] });
  });
  const units = [];
  for (const [lemma, { type, rows }] of byLemma) {
    const combos = [], seen = new Set();
    rows.forEach(r => { const k = r.arithmos + '|' + (r.genos || ''); if (!seen.has(k)) { seen.add(k); combos.push({ arithmos: r.arithmos, genos: r.genos }); } });
    combos.sort((a, b) => (ARITH.indexOf(a.arithmos) - ARITH.indexOf(b.arithmos))
      || ((a.genos ? GEN.findIndex(g => g[0] === a.genos) : -1) - (b.genos ? GEN.findIndex(g => g[0] === b.genos) : -1)));
    const colLabel = c => (c.arithmos === 'ενικός' ? 'Εν.' : 'Πλ.') + (c.genos ? ' ' + (GEN.find(g => g[0] === c.genos) || [, c.genos])[1] : '');
    const cases = caseLabels.filter(c => rows.some(r => r.ptosi === c));
    const val = (ptosi, c) => { const r = rows.find(x => x.ptosi === ptosi && x.arithmos === c.arithmos && (c.genos ? x.genos === c.genos : !x.genos));
      return r ? (r.alts.length ? `${r.form} (${r.alts.join(', ')})` : r.form) : ''; };
    units.push({ key: slug(lemma), label: `${typeLabels[type] || type} · ${lemma}`,
      rowAxis: cases.map(cap), colAxis: combos.map(colLabel),
      entries: [{ lemma, meta: typeLabels[type] || type, cells: cases.map(p => combos.map(c => val(p, c))) }] });
  }
  return { schema: 'paradigm', unitWord: 'Αντωνυμία', unitWordEn: 'Pronoun', units };
}

/* ── lat-verbs: { inf, conj, <voice>_<mood>_<tense>:[6 persons] } ── */
function materializeLatVerbs(DB) {
  const LPERS = ['1 sg', '2 sg', '3 sg', '1 pl', '2 pl', '3 pl'];
  const COMBOS = [
    ['act_ind', 'Ενεργητική · Οριστική', [['pres', 'Ενεστ.'], ['ipf', 'Παρατ.'], ['fut', 'Μέλλ.'], ['prf', 'Παρακ.'], ['plpf', 'Υπερσ.']]],
    ['act_sub', 'Ενεργητική · Υποτακτική', [['pres', 'Ενεστ.'], ['ipf', 'Παρατ.']]],
    ['pas_ind', 'Παθητική · Οριστική', [['pres', 'Ενεστ.'], ['ipf', 'Παρατ.'], ['fut', 'Μέλλ.']]],
    ['pas_sub', 'Παθητική · Υποτακτική', [['pres', 'Ενεστ.'], ['ipf', 'Παρατ.']]],
  ];
  const units = [];
  COMBOS.forEach(([combo, label, tenses]) => {
    const tns = tenses.filter(([tk]) => DB.some(v => Array.isArray(v[`${combo}_${tk}`])));
    if (!tns.length) return;
    units.push({ key: slug(combo), label,
      rowAxis: LPERS.slice(), colAxis: tns.map(t => t[1]),
      entries: DB.map(v => ({ lemma: v.inf, meta: v.meaning || (v.conj ? `${v.conj}η συζ.` : ''),
        cells: LPERS.map((_, i) => tns.map(([tk]) => { const a = v[`${combo}_${tk}`]; return (a && a[i]) || ''; })) })) });
  });
  return { schema: 'paradigm', unitWord: 'Έγκλιση', unitWordEn: 'Mood', units };
}

// ── per-game adapters ───────────────────────────────────────
const verbGame = (rel, Gname, opts) => P => {
  const g = loadGlobals(resolve(P, rel), [Gname]);
  return g[Gname] ? materializeVerbG(g[Gname], opts) : null;
};

export const ADAPTERS = {
  'aoristos-b':  verbGame('games/aoristos-b/data.js',  'AOB_G', { unitWord: 'Ενότητα' }),
  'afwnolekta':  verbGame('games/afwnolekta/data.js',  'AFW_G', { unitWord: 'Χρόνος' }),
  'rimata-mi':   verbGame('games/rimata-mi/data.js',   'RMI_G', { unitWord: 'Χρόνος' }),
  'synirimmena': P => {
    const g = loadGlobals(resolve(P, 'games/synirimmena/data.js'), ['SYN_G', 'SYN_VERB_LABELS']);
    return g.SYN_G ? materializeVerbG(g.SYN_G, { labelMap: g.SYN_VERB_LABELS || {}, unitWord: 'Ρήμα' }) : null;
  },
  'ousiastika': P => {
    const g = loadGlobals(resolve(P, 'games/ousiastika/data.js'), ['OUS_DB', 'OUS_CASES']);
    return g.OUS_DB ? materializeDeclensionDB(g.OUS_DB, g.OUS_CASES || ['Ονομαστική', 'Γενική', 'Δοτική', 'Αιτιατική', 'Κλητική'],
      { groupKey: 'd', groupLabels: { 1: 'Α΄ Κλίση', 2: 'Β΄ Κλίση', 3: 'Γ΄ Κλίση', 4: 'Ανώμαλα' }, unitWord: 'Κλίση' }) : null;
  },
  'epitheta': P => {
    const g = loadGlobals(resolve(P, 'games/epitheta/data.js'), ['EPT_DB']);
    return g.EPT_DB ? materializeAdjectives(g.EPT_DB, ['Ονομαστική', 'Γενική', 'Δοτική', 'Αιτιατική', 'Κλητική'], { unitWord: 'Κατηγορία' }) : null;
  },
  'eimi': P => {
    const g = loadGlobals(resolve(P, 'games/eimi/data.js'), ['EIMI_PARADIGM']);
    return g.EIMI_PARADIGM ? materializeEimi(g.EIMI_PARADIGM) : null;
  },
  'anwmala-rimata': P => {
    const g = loadGlobals(resolve(P, 'games/anwmala-rimata/data.js'), ['ARV_DB']);
    return g.ARV_DB ? materializeAnwmala(g.ARV_DB) : null;
  },
  'lat-epitheta': P => {
    const g = loadGlobals(resolve(P, 'games/lat-epitheta/data.js'), ['LAT_A_DB', 'LAT_A_CASES']);
    return g.LAT_A_DB ? materializeLatAdjectives(g.LAT_A_DB, g.LAT_A_CASES || ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Vocative', 'Ablative']) : null;
  },
  'antonymies': P => {
    const g = loadGlobals(resolve(P, 'games/antonymies/data.js'), ['ANT_RAW', 'ANT_CASES', 'ANT_TYPE_LABELS']);
    return g.ANT_RAW ? materializeAntonymies(g.ANT_RAW, g.ANT_CASES || ['ονομαστική', 'γενική', 'δοτική', 'αιτιατική'], g.ANT_TYPE_LABELS || {}) : null;
  },
  'lat-verbs': P => {
    const g = loadGlobals(resolve(P, 'games/lat-verbs/data.js'), ['LAT_V_DB']);
    return g.LAT_V_DB ? materializeLatVerbs(g.LAT_V_DB) : null;
  },
  'lat-antonymies': P => {
    const g = loadGlobals(resolve(P, 'games/lat-antonymies/data.js'), ['LAT_P_DB', 'LAT_P_CASES']);
    return g.LAT_P_DB ? materializeDeclensionDB(g.LAT_P_DB, g.LAT_P_CASES || ['Nominative', 'Genitive', 'Dative', 'Accusative', 'Vocative', 'Ablative'],
      { groupKey: 'sub', unitWord: 'Κατηγορία' }) : null;
  },
  // pathitiko: PATH_G lives in game.js; forms = stem (with display hyphen) +
  // ending; passive voice only (g.voice undefined → labelled Παθητική).
  'pathitiko': P => {
    const g = loadGlobals(resolve(P, 'games/pathitiko/game.js'), ['PATH_G']);
    return g.PATH_G ? materializeVerbG(g.PATH_G, { unitWord: 'Χρόνος', defaultVoice: 'Παθητική',
      cellOf: r => (r.stem || '').replace(/-/g, '') + ((r.endings && r.endings[0]) || '') }) : null;
  },
  // paratheta: degrees of comparison; PAR_G.endings are full forms.
  'paratheta': P => {
    const g = loadGlobals(resolve(P, 'games/paratheta/game.js'), ['PAR_G']);
    if (!g.PAR_G) return null;
    const CATLAB = { os: 'Σε -ος', is: 'Σε -ης', irregular: 'Ανώμαλα' };
    const cat2pos = new Map();
    Object.values(g.PAR_G).forEach(r => {
      const c = r.category || '—'; if (!cat2pos.has(c)) cat2pos.set(c, new Map());
      const m = cat2pos.get(c); if (!m.has(r.positive)) m.set(r.positive, {});
      m.get(r.positive)[r.degree] = (r.endings && r.endings[0]) || '';
    });
    const units = [...cat2pos.keys()].map(c => ({
      key: slug(c), label: CATLAB[c] || c,
      rowAxis: ['Θετικός', 'Συγκριτικός', 'Υπερθετικός'], colAxis: ['Τύπος'],
      entries: [...cat2pos.get(c).entries()].map(([pos, d]) => ({ lemma: pos, meta: CATLAB[c] || c,
        cells: [[pos], [d['συγκριτικός'] || ''], [d['υπερθετικός'] || '']] })),
    }));
    return { schema: 'paradigm', unitWord: 'Κατηγορία', unitWordEn: 'Category', units };
  },
};

export function materializeAll(P) {
  const out = {};
  for (const [id, fn] of Object.entries(ADAPTERS)) {
    try { const doc = fn(P); if (doc && doc.units && doc.units.length) out[id] = doc; }
    catch (e) { console.warn(`materialize ${id} failed:`, e.message); }
  }
  return out;
}
