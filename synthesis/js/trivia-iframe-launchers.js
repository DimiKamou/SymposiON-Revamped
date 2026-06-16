// ============================================================
//  SymposiON — Synthesis: Ver1 nav.js launcher extracts
//  (trivia + iframe + study + symposion)
//
//  These launcher functions were defined in Ver1 `js/nav.js`, which is
//  NOT loaded in the revamp shell (it collides with the revamp router).
//  Only the launch entrypoints (and their minimal direct helpers) are
//  extracted here, exposed as window globals, WITHOUT pulling in nav.js's
//  render/router internals.
//
//  ORCHESTRATOR: add `<script src="js/trivia-iframe-launchers.js"></script>`
//  to synthesis/index.html (eager, after syn-lazy.js / before app wires
//  clicks). The game's own JS (iliada-trivia, odyssey-trivia, study
//  flashcards) is lazy-loaded by the manifest; these launchers stay eager.
//
//  Extracted functions (all on window):
//    launchGame(lang)          → iliada-trivia (shared trivia engine)
//    closeGame()               → close trivia overlay (used by overlay button)
//    switchGameLang(l)         → trivia lang toggle (used by overlay button)
//    openSymposion()/close     → symposion board-game iframe overlay
//    openIstoria()/close       → istoria iframe overlay (course=g3)
//    openHistoryGame()/close   → history-game iframe overlay
//    navToStudy(datasetId)     → Mnemosyne.startStudySession via GP_DATASETS
//    closeStudyOverlay()       → close study overlay
//
//  NOTE: launchOdysseyTrivia(lang) is NOT extracted here — it ships in
//  games/odyssey-trivia/game.js (lazy-loaded) and itself calls launchGame().
// ============================================================
(function () {
  'use strict';

  // ── Minimal i18n / toast shims (Ver1 nav.js globals absent in the revamp) ──
  // flashcards.js (study) + the study/trivia overlays reference `t(gr,en)`,
  // `siteLang`, `showToast`, `setSiteLang` — all Ver1 nav.js globals not loaded
  // in the revamp shell. Provide guarded shims so these game files run; if the
  // foundation later defines real versions, they win (we never clobber).
  if (typeof window.siteLang === 'undefined') {
    try {
      var _docLang = (document.documentElement.getAttribute('lang') || '').slice(0, 2);
      window.siteLang = (_docLang === 'en') ? 'en' : 'gr';
    } catch (_) { window.siteLang = 'gr'; }
  }
  if (typeof window.t !== 'function') {
    window.t = function (gr, en) { return window.siteLang === 'en' ? (en || gr) : gr; };
  }
  if (typeof window.showToast !== 'function') {
    window.showToast = function (msg) {
      try { console.log('[toast]', msg); } catch (_) {}
    };
  }
  if (typeof window.setSiteLang !== 'function') {
    window.setSiteLang = function (l) {
      window.siteLang = (l === 'en') ? 'en' : 'gr';
      try {
        document.querySelectorAll('[data-gr][data-en]').forEach(function (el) {
          el.textContent = window.siteLang === 'en' ? el.dataset.en : el.dataset.gr;
        });
      } catch (_) {}
      // Re-render the active study card if Mnemosyne is mid-session.
      try { if (window.Mnemosyne && typeof Mnemosyne._renderCard === 'function' && Mnemosyne.cards) Mnemosyne._renderCard(); } catch (_) {}
    };
  }

  // Resolve app base the same robust way syn-lazy.js does.
  function _appBase() {
    return window.APP_BASE || (new URL('./', location.href).href);
  }
  // Best-effort current grade/course key — Ver1 used a global `currentGradeKey`.
  function _gradeKey() {
    return (typeof window.currentGradeKey === 'string' && window.currentGradeKey) || 'gym-a';
  }

  // ── ILIAD TRIVIA (shared trivia engine) ─────────────────────
  // launchGame() restores the Iliad question set (in case Odyssey Trivia was
  // last active), wires the overlay title/lang, then calls the engine initGame()
  // (from games/iliada-trivia/game.js, lazy-loaded by the manifest).
  function launchGame(lang) {
    if (typeof ILIADA_QUESTIONS !== 'undefined') {
      window.QUESTIONS  = ILIADA_QUESTIONS;
      window.RHAPSODIES = ILIADA_RHAPSODIES;
    }
    const titleEl = document.querySelector('#trivia-overlay .overlay-title');
    if (titleEl) { titleEl.textContent = lang === 'en' ? 'Iliad Trivia' : 'Trivia Ιλιάδας'; }

    const ov = document.getElementById('trivia-overlay');
    if (ov) ov.classList.add('active');
    document.body.style.overflow = 'hidden';
    const olGr = document.getElementById('ol-gr');
    const olEn = document.getElementById('ol-en');
    if (olGr) olGr.classList.toggle('active', lang === 'gr');
    if (olEn) olEn.classList.toggle('active', lang === 'en');
    if (typeof initGame === 'function') initGame(lang);
  }

  function closeGame() {
    const ov = document.getElementById('trivia-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
    if (typeof soloStopTimer === 'function') soloStopTimer();
    if (typeof tStopTimer === 'function') tStopTimer();
    // Restore Iliad data if Odyssey Trivia was active
    if (typeof ILIADA_QUESTIONS !== 'undefined') {
      window.QUESTIONS  = ILIADA_QUESTIONS;
      window.RHAPSODIES = ILIADA_RHAPSODIES;
    }
    if (window._savedQuotesEn) {
      window.QUOTES_EN = window._savedQuotesEn;
      window.QUOTES_GR = window._savedQuotesGr;
      window._savedQuotesEn = null;
      window._savedQuotesGr = null;
    }
  }

  function switchGameLang(l) {
    const olGr = document.getElementById('ol-gr');
    const olEn = document.getElementById('ol-en');
    if (olGr) olGr.classList.toggle('active', l === 'gr');
    if (olEn) olEn.classList.toggle('active', l === 'en');
    if (typeof setLang === 'function') setLang(l);
  }

  // ── SYMPOSION BOARD GAME (iframe overlay) ───────────────────
  function openSymposion() {
    const ov = document.getElementById('symposion-overlay');
    if (!ov) return;
    ov.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeSymposion() {
    const ov = document.getElementById('symposion-overlay');
    if (!ov) return;
    ov.classList.remove('active');
    document.body.style.overflow = '';
    if (typeof goTo === 'function') goTo('home');
  }

  // ── ISTORIA Γ΄ ΛΥΚΕΙΟΥ (iframe → games/istoria/index.html?course=g3) ──
  function openIstoria() {
    const wrap = document.getElementById('istoria-wrap');
    if (wrap && !wrap.querySelector('iframe')) {
      wrap.innerHTML = '<iframe src="' + _appBase() + 'games/istoria/index.html?course=g3" style="width:100%;height:100%;border:none;display:block;"></iframe>';
    }
    const ov = document.getElementById('istoria-overlay');
    if (ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
  }
  function closeIstoria() {
    const ov = document.getElementById('istoria-overlay');
    if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
  }

  // ── HISTORY GAME (iframe; course = current grade) ───────────
  function openHistoryGame() {
    const course = _gradeKey();
    const src = _appBase() + 'games/istoria/index.html?course=' + encodeURIComponent(course);
    const wrap = document.getElementById('history-game-wrap');
    if (wrap) {
      wrap.innerHTML = '<iframe src="' + src + '" style="width:100%;height:100%;border:none;display:block;"></iframe>';
    }
    const ov = document.getElementById('history-game-overlay');
    if (ov) { ov.classList.add('active'); document.body.style.overflow = 'hidden'; }
  }
  function closeHistoryGame() {
    const ov = document.getElementById('history-game-overlay');
    if (ov) { ov.classList.remove('active'); document.body.style.overflow = ''; }
  }

  // ── MNEMOSYNE STUDY MODE ────────────────────────────────────
  function closeStudyOverlay() {
    const ov = document.getElementById('study-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
  }

  // navToStudy(datasetId): resolve a GP_DATASETS entry, gate on tier, load &
  // normalise its questions, then hand off to Mnemosyne.startStudySession.
  // All cross-module deps are typeof-guarded so it degrades gracefully when a
  // GP bridge / Firestore is absent.
  async function navToStudy(datasetId) {
    const _toast = function (gr, en) {
      if (typeof showToast === 'function') {
        showToast((typeof t === 'function') ? t(gr, en) : gr, '');
      } else {
        console.warn('[navToStudy]', gr);
      }
    };

    // 1. Resolve dataset descriptor
    const dataset = (typeof GP_DATASETS !== 'undefined')
      ? GP_DATASETS.find(d => d.id === datasetId)
      : null;
    if (!dataset) { _toast('Δεν βρέθηκε η ύλη.', 'Content module not found.'); return; }

    // 2. Subscription gate
    if (typeof _gpCanAccessTier === 'function' && !_gpCanAccessTier(dataset.tier)) {
      _toast('Απαιτείται Pro συνδρομή για αυτή την ύλη.', 'Pro subscription required for this content.');
      if (typeof navToSubscribe === 'function') navToSubscribe();
      return;
    }

    // 3. Load raw data
    let rawData = null;
    if (typeof dataset.loader === 'function') {
      try { rawData = dataset.loader(); } catch (_) { rawData = null; }
    }
    // Firestore fallback if window-scope data is absent
    if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
      if (typeof firebase !== 'undefined' && firebase.firestore) {
        try {
          const snap = await firebase.firestore().collection('game_data').doc(datasetId).get();
          if (snap.exists) {
            rawData = snap.data().questions || snap.data().items || snap.data().data || [];
          }
        } catch (err) {
          console.warn('[navToStudy] Firestore fallback failed:', err);
        }
      }
    }
    if (!rawData || (Array.isArray(rawData) && rawData.length === 0)) {
      _toast('Τα δεδομένα δεν φορτώθηκαν.', 'Content data could not be loaded.');
      return;
    }

    // 4. Normalise to {q, a, hint}
    const items = (typeof _gpNormalizeQuestions === 'function')
      ? _gpNormalizeQuestions(rawData, datasetId)
      : rawData;
    if (!items || items.length === 0) {
      _toast('Δεν βρέθηκαν κάρτες για αυτή την ύλη.', 'No flashcards found for this module.');
      return;
    }

    // 5. Hand off to MnemosyneEngine (from games/study/flashcards.js, lazy-loaded)
    if (typeof Mnemosyne === 'undefined') {
      console.error('[navToStudy] MnemosyneEngine not loaded.');
      return;
    }
    await Mnemosyne.startStudySession(datasetId, items, dataset.label || datasetId);
  }

  // ── _gpNormalizeQuestions (extracted minimal helper) ────────
  // navToStudy() depends on this normalizer, which in Ver1 lives ONLY in
  // js/nav.js (line ~4232) — not in the revamp foundation (gp-content.js).
  // It is a pure, self-contained function, so it is extracted verbatim here.
  // Guard: if a foundation file already defines it on window, defer to that.
  function _gpNormalizeQuestions(rawData, _datasetId) {
    if (typeof window._gpNormalizeQuestions === 'function' &&
        window._gpNormalizeQuestions !== _gpNormalizeQuestions) {
      return window._gpNormalizeQuestions(rawData, _datasetId);
    }
    if (!rawData) return [];

    // ── NON-ARRAY BRANCH ──
    if (!Array.isArray(rawData)) {
      if (typeof rawData !== 'object') return [];
      // A. Trivia lang-object: { gr:{all:[...]}, en:{all:[...]} }
      const langData = rawData.gr || rawData.en;
      if (langData && typeof langData === 'object') {
        const allArr = langData.all;
        if (Array.isArray(allArr) && allArr.length > 0)
          return _gpNormalizeQuestions(allArr, _datasetId);
        const flat = Object.values(langData).filter(Array.isArray).flat();
        if (flat.length > 0) return _gpNormalizeQuestions(flat, _datasetId);
      }
      // B. EIMI_PARADIGM
      if (rawData.lemma !== undefined && Array.isArray(rawData.tenses)) {
        const lemma = rawData.lemma;
        return rawData.tenses.flatMap(tense =>
          (tense.groups || []).flatMap(g =>
            (g.forms || []).filter(f => f && f.f).map(f => ({
              q: `${lemma} — ${f.l} · ${g.mood || g.label || ''} · ${tense.label || ''}`,
              a: String(f.f), options: [], hint: rawData.meaning || '',
            }))
          )
        ).filter(x => x.q && x.a);
      }
      const vals = Object.values(rawData);
      if (vals.length === 0) return [];
      const v0 = vals.find(Boolean);
      if (!v0 || typeof v0 !== 'object') return [];
      // C. Paradigm dict (SYN_G / AOB_G / RMI_G / AFW_G)
      if (v0.verb !== undefined && v0.tense !== undefined && Array.isArray(v0.endings)) {
        return vals.filter(Boolean).map(item => {
          const form = Array.isArray(item.endings) && item.endings[0]
            ? String(item.endings[0]) : null;
          if (!form) return null;
          return {
            q: `${item.verb} — ${item.form || ''} · ${item.mood || ''} · ${item.tense || ''}`,
            a: form, options: item.endings.slice(0, 4).map(String), hint: '',
          };
        }).filter(Boolean);
      }
      // D. ANT_DB dict
      if (v0.lemma !== undefined && v0.form !== undefined && v0.ptosi !== undefined) {
        return vals.filter(Boolean).map(item => ({
          q: `${item.lemma} — ${item.ptosi || ''}${item.arithmos ? ' (' + item.arithmos + ')' : ''}${item.genos ? ' ' + item.genos : ''}`,
          a: String(item.form),
          options: Array.isArray(item.alts) ? [item.form, ...item.alts].slice(0, 4).map(String) : [],
          hint: item.en || '',
        })).filter(x => x.q && x.a);
      }
      // E. Wrapper objects
      if (rawData.questions) return _gpNormalizeQuestions(rawData.questions, _datasetId);
      if (rawData.items)     return _gpNormalizeQuestions(rawData.items,     _datasetId);
      return [];
    }

    // ── ARRAY BRANCH ──
    if (rawData.length === 0) return [];
    const sample = rawData.find(x => x && typeof x === 'object');
    if (!sample) return [];
    // F. ARV_DB
    if (sample.lemma !== undefined && Array.isArray(sample.forms) &&
        sample.forms.length > 0 && sample.forms[0] && sample.forms[0].t !== undefined) {
      const TENSE_GR = {
        present: 'Ενεστώτας', imperfect: 'Παρατατικός', future: 'Μέλλοντας',
        aorist: 'Αόριστος', perfect: 'Παρακείμενος', pluperfect: 'Υπερσυντελικός',
      };
      const VOICE_SFX = { active: '', middle_passive: ' (μεσ./παθ.)', passive: ' (παθ.)' };
      return rawData.filter(Boolean).flatMap(item =>
        (item.forms || []).filter(f => f && f.f).map(f => {
          const answer = String(f.f).split(/[—,]/)[0].trim();
          return {
            q: `${item.lemma} — ${TENSE_GR[f.t] || f.t}${VOICE_SFX[f.v] || ''}`,
            a: answer, options: [], hint: item.meaning || '',
          };
        }).filter(x => x.a)
      ).filter(x => x.q && x.a);
    }
    // G. KR_DB
    if (sample.lemma !== undefined && Array.isArray(sample.groups) &&
        sample.groups.length > 0 && sample.groups[0].forms !== undefined) {
      return rawData.filter(Boolean).flatMap(item =>
        (item.groups || []).flatMap(g =>
          (g.forms || []).filter(f => f && f.f).map(f => ({
            q: `${item.lemma} — ${f.l} · ${g.label || ''}`,
            a: String(f.f), options: [], hint: item.meaning || '',
          }))
        )
      ).filter(x => x.q && x.a);
    }
    // H. OUS_DB / LAT_N_DB / LAT_A_DB
    if (sample.l !== undefined && Array.isArray(sample.s) && Array.isArray(sample.p)) {
      const CASES = ['Ονομαστική','Γενική','Δοτική','Αιτιατική','Κλητική','Αφαιρετική'];
      return rawData.filter(Boolean).flatMap(entry => {
        const rows = [];
        const genderNote = entry.t ? ` (${entry.t})` : '';
        entry.s.forEach((form, i) => {
          if (form) rows.push({
            q: `${entry.l}${genderNote} — ${CASES[i] || 'πτώση ' + (i + 1)} εν.`,
            a: String(form), options: [], hint: entry.meaning || '',
          });
        });
        entry.p.forEach((form, i) => {
          if (form) rows.push({
            q: `${entry.l}${genderNote} — ${CASES[i] || 'πτώση ' + (i + 1)} πλ.`,
            a: String(form), options: [], hint: entry.meaning || '',
          });
        });
        return rows;
      }).filter(x => x.q && x.a);
    }
    // I. LAT_V_DB
    if (sample.inf !== undefined) {
      const PERSONS = ['α΄ εν.','β΄ εν.','γ΄ εν.','α΄ πλ.','β΄ πλ.','γ΄ πλ.'];
      const TENSE_KEYS = [
        { k: 'act_ind_pres', l: 'Ενεστ. Ενεργ. Οριστ.' },
        { k: 'act_ind_ipf',  l: 'Παρατ. Ενεργ. Οριστ.' },
        { k: 'act_ind_fut',  l: 'Μέλλ. Ενεργ. Οριστ.'  },
        { k: 'act_ind_prf',  l: 'Παρακ. Ενεργ. Οριστ.'  },
        { k: 'pas_ind_pres', l: 'Ενεστ. Παθ. Οριστ.'   },
        { k: 'pas_ind_ipf',  l: 'Παρατ. Παθ. Οριστ.'   },
      ];
      return rawData.filter(Boolean).flatMap(entry =>
        TENSE_KEYS.flatMap(({ k, l }) => {
          if (!Array.isArray(entry[k])) return [];
          return entry[k].map((form, i) => ({
            q: `${entry.inf} — ${l}, ${PERSONS[i]}`,
            a: String(form), options: [], hint: entry.meaning || '',
          })).filter(x => x.a);
        })
      ).filter(x => x.q && x.a);
    }
    // J. Trivia items
    if (sample.opts !== undefined) {
      return rawData.filter(Boolean).map(item => {
        const opts = Array.isArray(item.opts) ? item.opts : [];
        const ans = typeof item.ans === 'number'
          ? (opts[item.ans] || '') : String(item.ans || '');
        return { q: String(item.q || ''), a: ans, options: opts, hint: item.hint || '' };
      }).filter(x => x.q && x.a);
    }
    // K. Standard {q,a}
    if (sample.q !== undefined && sample.a !== undefined) {
      return rawData.filter(Boolean).map(item => ({
        q: String(item.q), a: String(item.a),
        options: Array.isArray(item.options) ? item.options : [], hint: item.hint || '',
      })).filter(x => x.q && x.a);
    }
    // L. {question,answer}
    if (sample.question !== undefined) {
      return rawData.filter(Boolean).map(item => ({
        q: String(item.question), a: String(item.answer ?? item.correct ?? ''),
        options: item.options ?? item.choices ?? [], hint: item.hint ?? '',
      })).filter(x => x.q && x.a);
    }
    // M. Flashcard {front,back}
    if (sample.front !== undefined && sample.back !== undefined) {
      return rawData.filter(Boolean).map(item => ({
        q: String(item.front), a: String(item.back || ''), options: [], hint: '',
      })).filter(x => x.q && x.a);
    }
    // N. verb/word + form
    if (sample.verb !== undefined && sample.form !== undefined) {
      return rawData.filter(Boolean).map(item => ({
        q: `${item.verb}${item.tense ? ' (' + item.tense + ')' : ''}`,
        a: String(item.form), options: [], hint: item.hint || '',
      })).filter(x => x.q && x.a);
    }
    if (sample.word !== undefined && sample.form !== undefined) {
      return rawData.filter(Boolean).map(item => ({
        q: `${item.word}${item.case ? ' — ' + item.case : ''}`,
        a: String(item.form), options: [], hint: '',
      })).filter(x => x.q && x.a);
    }
    // O. Generic fallback: first two string/number keys
    const strKeys = Object.keys(sample).filter(k =>
      typeof sample[k] === 'string' || typeof sample[k] === 'number'
    );
    if (strKeys.length >= 2) {
      return rawData.filter(Boolean).map(item => ({
        q: String(item[strKeys[0]]), a: String(item[strKeys[1]]), options: [], hint: '',
      })).filter(x => x.q && x.a);
    }
    return [];
  }
  // Expose so navToStudy (and any foundation that lacks it) can use it.
  if (typeof window._gpNormalizeQuestions !== 'function') {
    window._gpNormalizeQuestions = _gpNormalizeQuestions;
  }

  // ── default-arg wrappers (manifest keys; synLaunch calls them with no args) ──
  // The manifest dispatcher calls window[openFn]() with no arguments, so these
  // thin wrappers bake in sensible defaults for openers that need a param.
  function synOpenIliadaTrivia() { return launchGame('gr'); }              // iliada-trivia
  function synOpenStudyFlashcards() { return navToStudy('iliada-trivia'); } // study default dataset

  // ── expose globals ──────────────────────────────────────────
  window.synOpenIliadaTrivia    = synOpenIliadaTrivia;
  window.synOpenStudyFlashcards = synOpenStudyFlashcards;
  window.launchGame        = launchGame;
  window.closeGame         = closeGame;
  window.switchGameLang    = switchGameLang;
  window.openSymposion     = openSymposion;
  window.closeSymposion    = closeSymposion;
  window.openIstoria       = openIstoria;
  window.closeIstoria      = closeIstoria;
  window.openHistoryGame   = openHistoryGame;
  window.closeHistoryGame  = closeHistoryGame;
  window.navToStudy        = navToStudy;
  window.closeStudyOverlay = closeStudyOverlay;
})();
