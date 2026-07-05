/* ════════════════════════════════════════════════════════════════════
   theory-data.js — adapters that turn the EXISTING grammar datasets
   (EIMI_PARADIGM, EPT_DB, OUS_DB, …) into the part-of-speech-agnostic
   "lesson" shape consumed by theory-lesson.js:

     { id, kind, title, icon, posLabel, level, lemma:[a,b,c], meaning,
       badges:[[k,v]], intro,  tabs/cols/rows,  data[tab][col][rowIdx],
       nom:{tab:[[name,form]]},  example:{gr,tr} }

   The paradigm FORMS are sourced from the existing dataset (single source
   of truth — INTEGRATION §2). The pedagogical chrome (lemma split, badges,
   intro, worked example) lives in THEORY_META, since the raw datasets
   don't carry it. Teacher in-place corrections are merged on top via
   applyTheoryOverride() (Firestore lesson_overrides — see theory-lesson.js).

   Κάρτες are NOT rebuilt here — that mode delegates to the existing
   Mnemosyne engine through navToStudy(datasetId).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // strip accents + article + punctuation, lowercase — for lemma matching
  function _norm(w) {
    if (!w) return '';
    var s = String(w);
    try { s = s.normalize('NFD').replace(/[̀-ͯ]/g, ''); } catch (_) {}
    return s.replace(/^(ὁ|ἡ|τὸ|τό|ὦ|\(ὦ\))\s+/i, '').replace(/[^Ͱ-ϿA-Za-z]/g, '').toLowerCase();
  }
  var DECL = { 1: 'Α΄', 2: 'Β΄', 3: 'Γ΄', 4: 'Δ΄' };

  // Dataset globals are declared with top-level `const` in their game files,
  // so they live in the global LEXICAL scope (reachable as bare identifiers)
  // and are NOT properties of `window`. Read them with typeof-guarded refs.
  function _eimi()     { return (typeof EIMI_PARADIGM !== 'undefined') ? EIMI_PARADIGM : null; }
  function _ept()      { return (typeof EPT_DB        !== 'undefined') ? EPT_DB        : null; }
  function _ous()      { return (typeof OUS_DB        !== 'undefined') ? OUS_DB        : null; }
  function _ousCases() { return (typeof OUS_CASES     !== 'undefined') ? OUS_CASES     : null; }

  /* ── VERB: εἰμί from EIMI_PARADIGM ──────────────────────────────── */
  function eimiToLesson() {
    var P = _eimi();
    if (!P || !P.tenses) return null;
    var FIN = ['Οριστική', 'Υποτακτική', 'Ευκτική', 'Προστακτική'];
    var pers = ['α΄ εν.', 'β΄ εν.', 'γ΄ εν.', 'α΄ πλ.', 'β΄ πλ.', 'γ΄ πλ.'];
    var tenses = [], data = {}, nom = {};
    P.tenses.forEach(function (t) {
      tenses.push(t.label);
      data[t.label] = {};
      FIN.forEach(function (m) { data[t.label][m] = pers.map(function () { return ''; }); });
      var nomRows = [];
      t.groups.forEach(function (g) {
        if (FIN.indexOf(g.mood) >= 0) {
          g.forms.forEach(function (f) {
            var i = pers.indexOf(f.l);
            if (i >= 0) data[t.label][g.mood][i] = f.f;
          });
        } else if (g.mood === 'Απαρέμφατο') {
          nomRows.push(['Απαρέμφατο', g.forms.map(function (f) { return f.f; }).join(' ')]);
        } else if (g.mood === 'Μετοχή') {
          nomRows.push(['Μετοχή', g.forms.map(function (f) { return f.f; }).join(' · ')]);
        }
      });
      nom[t.label] = nomRows;
    });
    return { meaning: P.meaning, tenses: tenses, moods: FIN, pers: pers, data: data, nom: nom };
  }

  /* ── ADJECTIVE: 3-gender from EPT_DB ────────────────────────────── */
  function adjToLesson(match) {
    var DB = _ept();
    if (!DB || !DB.length) return null;
    var e = (match && DB.filter(function (x) { return _norm(x.l).indexOf(_norm(match)) === 0; })[0]) || DB[0];
    var cases = _ousCases() || ['Ονομαστική', 'Γενική', 'Δοτική', 'Αιτιατική', 'Κλητική'];
    var data = {
      'Ενικός':      { 'Αρσενικό': e.m.s.slice(), 'Θηλυκό': e.f.s.slice(), 'Ουδέτερο': e.n.s.slice() },
      'Πληθυντικός': { 'Αρσενικό': e.m.p.slice(), 'Θηλυκό': e.f.p.slice(), 'Ουδέτερο': e.n.p.slice() },
    };
    return { tabs: ['Ενικός', 'Πληθυντικός'], cols: ['Αρσενικό', 'Θηλυκό', 'Ουδέτερο'], rows: cases.slice(), data: data, lemma3: e.l };
  }

  /* ── NOUN: representative declensions from OUS_DB ───────────────── */
  function nounToLesson(featured) {
    var DB = _ous();
    if (!DB || !DB.length) return null;
    var cases = _ousCases() || ['Ονομαστική', 'Γενική', 'Δοτική', 'Αιτιατική', 'Κλητική'];
    var picks = [];
    // prefer the curated lemmas, matched against the live DB …
    (featured || []).forEach(function (lemma) {
      var hit = DB.filter(function (x) { return _norm(x.l).indexOf(_norm(lemma)) >= 0; })[0];
      if (hit && picks.indexOf(hit) < 0) picks.push(hit);
    });
    // … then pad with the first entry of each declension class for coverage
    [1, 2, 3].forEach(function (d) {
      if (picks.length >= 6) return;
      var hit = DB.filter(function (x) { return x.d === d && picks.indexOf(x) < 0; })[0];
      if (hit) picks.push(hit);
    });
    if (!picks.length) picks = DB.slice(0, 4);
    var tabs = [], data = {};
    picks.forEach(function (e) {
      var label = e.l + (DECL[e.d] ? ' · ' + DECL[e.d] : '');
      tabs.push(label);
      data[label] = { 'Ενικός': (e.s || []).slice(), 'Πληθυντικός': (e.p || []).slice() };
    });
    return { tabs: tabs, cols: ['Ενικός', 'Πληθυντικός'], rows: cases.slice(), data: data };
  }

  /* ── pedagogical chrome per dataset (forms come from the dataset) ─ */
  var THEORY_META = {
    eimi: {
      posLabel: 'Ρήμα', level: 'Β΄ Γυμνασίου', lemma: ['ε', 'ἰ', 'μί'], meaning: 'είμαι, υπάρχω',
      badges: [['Είδος', 'Βοηθητικό'], ['Σχηματισμός', 'Αθεματικό'], ['Κλίση', 'Ανώμαλο'], ['Θέμα', 'ἐσ‑ / εἰ‑']],
      intro: 'Το <b>εἰμί</b> είναι το συνδετικό και βοηθητικό ρήμα της αρχαίας ελληνικής — το αντίστοιχο του «είμαι». Ανήκει στα <b>αθεματικά</b> ρήματα (σε ‑μι) και κλίνεται ανώμαλα: το θέμα <b>ἐσ‑</b> εμφανίζεται καθαρά στον πληθυντικό (ἐσμέν, ἐστέ).',
      example: { gr: 'Σωκράτης σοφὸς <e>ἐστιν</e>.', tr: '«Ο Σωκράτης είναι σοφός.» — γ΄ ενικό, Οριστική Ενεστώτα.' },
      cards: [
        { chips: [['Οριστική', 'd-mood'], ['β΄ ενικό', 'd-person'], ['Ενεστώτας', 'd-tense']], prompt: 'πῶς σχηματίζεται;', answer: 'εἶ', meaning: '«είσαι»', ex: 'σὺ σοφὸς <e>εἶ</e>.' },
        { chips: [['Οριστική', 'd-mood'], ['γ΄ πληθ.', 'd-person'], ['Ενεστώτας', 'd-tense']], prompt: 'πῶς σχηματίζεται;', answer: 'εἰσί(ν)', meaning: '«είναι» (πολλοί)', ex: 'θεοὶ <e>εἰσιν</e>.' },
        { chips: [['Ονοματικός τύπος', 'd-form'], ['Ενεστώτας', 'd-tense']], prompt: 'το απαρέμφατο;', answer: 'εἶναι', meaning: '«το να είναι»', ex: 'καλὸν <e>εἶναι</e> ἀγαθόν.' },
        { chips: [['Οριστική', 'd-mood'], ['α΄ πληθ.', 'd-person'], ['Παρατατικός', 'd-tense']], prompt: 'πῶς σχηματίζεται;', answer: 'ἦμεν', meaning: '«ήμασταν»', ex: 'ἡμεῖς φίλοι <e>ἦμεν</e>.' },
      ],
      build: function () { return eimiToLesson(); },
    },
    epitheta: {
      posLabel: 'Επίθετο', level: 'Α΄ Γυμνασίου', lemma: ['ἀγα', 'θ', 'ός'], meaning: 'επίθετα · ‑ος, ‑η, ‑ον',
      badges: [['Πρότυπο', 'ἀγαθός'], ['Γένη', '3'], ['Κλίση', 'Β΄ & Α΄'], ['Πτώσεις', '5']],
      intro: 'Τα <b>επίθετα</b> συμφωνούν με το ουσιαστικό σε <b>γένος, αριθμό και πτώση</b>. Το πρότυπο <b>ἀγαθός, ‑ή, ‑όν</b> κλίνεται: αρσενικό &amp; ουδέτερο κατά Β΄ κλίση, θηλυκό κατά Α΄ κλίση.',
      example: { gr: 'ὁ <e>ἀγαθὸς</e> πολίτης.', tr: '«Ο καλός πολίτης» — αρσενικό, ονομαστική ενικού· συμφωνεί με «πολίτης».' },
      cards: [
        { chips: [['Θηλυκό', 'd-form'], ['γενική εν.', 'd-mood'], ['Α΄ κλίση', 'd-tense']], prompt: 'ποιος τύπος;', answer: 'ἀγαθῆς', meaning: 'θηλ. γενική ενικού', ex: 'ἔργον <e>ἀγαθῆς</e> ψυχῆς.' },
        { chips: [['Ουδέτερο', 'd-form'], ['ονομ. πληθ.', 'd-mood'], ['Β΄ κλίση', 'd-tense']], prompt: 'ποιος τύπος;', answer: 'ἀγαθά', meaning: 'ουδ. ονομ./αιτ. πληθ.', ex: 'τὰ <e>ἀγαθὰ</e> τῆς πόλεως.' },
        { chips: [['Αρσενικό', 'd-form'], ['αιτ. πληθ.', 'd-mood'], ['Β΄ κλίση', 'd-tense']], prompt: 'ποιος τύπος;', answer: 'ἀγαθούς', meaning: 'αρσ. αιτιατική πληθ.', ex: 'τιμῶμεν <e>ἀγαθοὺς</e> ἄνδρας.' },
      ],
      build: function () { return adjToLesson('ἀγαθός'); },
    },
    ousiastika: {
      posLabel: 'Ουσιαστικό', level: 'Α΄ Γυμνασίου', lemma: ['ἡ ', 'χώ', 'ρα'], meaning: 'ουσιαστικά · Α΄–Γ΄ κλίση',
      badges: [['Πτώσεις', '5'], ['Αριθμοί', '2'], ['Γένη', '3'], ['Κλίσεις', 'Α΄–Γ΄']],
      intro: 'Τα <b>ουσιαστικά</b> κλίνονται κατά <b>πτώση</b> (Ονομαστική, Γενική, Δοτική, Αιτιατική, Κλητική) και <b>αριθμό</b> (ενικός, πληθυντικός)· η κατάληξη δείχνει τον συντακτικό ρόλο. Α΄ κλίση (<b>ἡ χώρα</b>), Β΄ κλίση (<b>ὁ λόγος</b>) και <b>Γ΄ κλίση</b> — η πιο πλούσια, με θέμα που φαίνεται στη γενική.',
      example: { gr: 'ὁ <e>φύλαξ</e> τῆς πόλεως.', tr: '«Ο φύλακας της πόλης» — Γ΄ κλίση· η γενική πόλεως δείχνει το θέμα.' },
      cards: [
        { chips: [['Γενική', 'd-mood'], ['ενικός', 'd-person'], ['Γ΄ · φύλαξ', 'd-tense']], prompt: 'ποια κατάληξη;', answer: 'τοῦ φύλακος', meaning: 'γενική ενικού (θέμα φυλακ‑)', ex: 'ἡ ἀσπὶς <e>τοῦ φύλακος</e>.' },
        { chips: [['Δοτική', 'd-mood'], ['πληθ.', 'd-person'], ['Γ΄ · σῶμα', 'd-tense']], prompt: 'ποια κατάληξη;', answer: 'τοῖς σώμασι(ν)', meaning: 'δοτική πληθ.', ex: 'πόνος ἔνεστι <e>τοῖς σώμασι</e>.' },
        { chips: [['Γενική', 'd-mood'], ['ενικός', 'd-person'], ['Γ΄ · πόλις', 'd-tense']], prompt: 'ποια κατάληξη;', answer: 'τῆς πόλεως', meaning: 'γενική ενικού', ex: 'οἱ νόμοι <e>τῆς πόλεως</e>.' },
        { chips: [['Αιτιατική', 'd-mood'], ['ενικός', 'd-person'], ['Γ΄ · βασιλεύς', 'd-tense']], prompt: 'ποια κατάληξη;', answer: 'τὸν βασιλέα', meaning: 'αιτιατική ενικού', ex: 'τιμῶμεν <e>τὸν βασιλέα</e>.' },
      ],
      build: function () { return nounToLesson(['χώρα', 'λόγος', 'φύλαξ', 'σῶμα', 'πόλις', 'βασιλεύς']); },
    },
  };

  // authored grammar lessons (created in the Studio) carry a full lesson
  // object on their GP_CONTENT dataset record (_lessonDoc); they have no META.
  function _findDs(id) {
    return (window.GP_CONTENT && window.GP_CONTENT.find && window.GP_CONTENT.find(id)) ||
           (typeof GP_DATASETS !== 'undefined' && GP_DATASETS.find(function (d) { return d.id === id; })) || null;
  }
  function _authoredDoc(id) { var ds = _findDs(id); return (ds && ds._lessonDoc) ? ds._lessonDoc : null; }

  /* ── public: which datasets this view can render ────────────────── */
  function canTheoryLesson(id) {
    if (typeof window.canSyntaxLesson === 'function' && window.canSyntaxLesson(id)) return true;
    if (typeof window.canNegLesson === 'function' && window.canNegLesson(id)) return true;
    return !!((THEORY_META[id] && THEORY_META[id].build) || _authoredDoc(id));
  }

  /* ── public: build the merged lesson (chrome + live forms) ──────── */
  function buildLessonFromDataset(id) {
    var meta = THEORY_META[id];
    if (!meta) {
      // authored lesson: full object already on the dataset record
      var doc = _authoredDoc(id);
      if (doc) return applyTheoryOverride(Object.assign({ id: id, kind: 'grammar', group: 'Γραμματική' }, doc));
      return null;
    }
    var forms = meta.build();
    if (!forms) return null;            // dataset global not loaded yet
    var ds = _findDs(id) || {};
    // codex lessons ({cols, verbs}) use a different shape than paradigms
    if (meta.kind === 'codex') {
      return applyTheoryOverride({
        id: id, kind: 'codex', group: 'Γραμματική',
        title: ds.label || meta.title || id, icon: ds.icon || '📖',
        posLabel: meta.posLabel || 'Ρήμα', level: meta.level || '',
        headline: meta.headline || ['Αόριστος', 'Β΄'],
        meaning: meta.meaning || '', intro: meta.intro || '',
        cols: forms.cols, verbs: forms.verbs,
      });
    }
    var lemma = meta.lemma;
    if (forms.lemma3 && (!lemma || !lemma.length)) lemma = ['', forms.lemma3, ''];
    var lesson = {
      id: id, kind: 'grammar', group: 'Γραμματική',
      title: ds.label || meta.title || id, icon: ds.icon || '⚡',
      posLabel: meta.posLabel || 'Ρήμα', level: meta.level || '',
      lemma: lemma || ['', '', ''], meaning: meta.meaning || forms.meaning || '',
      badges: meta.badges || [], intro: meta.intro || '',
      example: meta.example || null,
      tabs: forms.tabs, tenses: forms.tenses, cols: forms.cols, moods: forms.moods,
      rows: forms.rows, pers: forms.pers, data: forms.data, nom: forms.nom || null,
      cards: meta.cards || [],
    };
    return applyTheoryOverride(lesson);
  }

  // built-in grammar lessons offered as clone templates in the Studio
  var _TEMPLATE_IDS = ['eimi', 'epitheta', 'ousiastika'];
  function grammarTemplates() {
    return _TEMPLATE_IDS.map(function (id) { return buildLessonFromDataset(id); }).filter(Boolean);
  }

  /* ── teacher overrides (Firestore lesson_overrides/{id}) ──────────
     Cache is populated by theory-lesson.js after a Firestore read.
     applyTheoryOverride does the same shallow merge as the prototype's
     applyOverride(): patch keys replace lesson keys; edited:true flag. */
  var _ovCache = {};                                  // id -> patch object
  function setOverrideCache(id, patch) { if (patch) _ovCache[id] = patch; else delete _ovCache[id]; }
  function getOverrideCache(id) { return _ovCache[id] || null; }
  function applyTheoryOverride(L) {
    var o = _ovCache[L.id];
    if (!o) return L;
    var merged = Object.assign({}, L, o);
    merged.edited = true;
    return merged;
  }

  // parsing-category colours per mood (matches the design's MOOD_COLORS)
  if (!window.MOOD_COLORS) window.MOOD_COLORS = {
    'Οριστική': 'var(--c-mood)', 'Υποτακτική': 'var(--c-form)',
    'Ευκτική': 'var(--c-voice)', 'Προστακτική': 'var(--c-person)',
  };

  window.THEORY_META = THEORY_META;
  window.canTheoryLesson = canTheoryLesson;
  window.buildLessonFromDataset = buildLessonFromDataset;
  window.grammarTemplates = grammarTemplates;
  window.theoryOverrides = { set: setOverrideCache, get: getOverrideCache, apply: applyTheoryOverride };
})();
