// ============================================================
//  SymposiON — Favorites
//  Firestore: users/{uid}/favorites/game_ids  (field: ids[])
//  Local cache prevents re-reads during navigation.
// ============================================================

let _favCache = null; // null = not loaded yet, []+ = loaded

// ── FIRESTORE REF ──
function _favRef() {
  if (typeof currentUser === 'undefined' || !currentUser) return null;
  if (typeof firebase === 'undefined') return null;
  return firebase.firestore().doc('users/' + currentUser.uid + '/favorites/game_ids');
}

// ── LOAD (called once per login) ──
function loadFavorites() {
  const ref = _favRef();
  if (!ref) { _favCache = []; return Promise.resolve([]); }
  return ref.get()
    .then(function(snap) {
      _favCache = snap.exists ? (snap.data().ids || []) : [];
      return _favCache;
    })
    .catch(function() { _favCache = []; return []; });
}

// ── READ ──
function getFavorites() { return _favCache || []; }
function isFavorite(id) { return (_favCache || []).indexOf(id) !== -1; }

// ── TOGGLE (optimistic + rollback) ──
function toggleFavorite(id) {
  if (typeof currentUser === 'undefined' || !currentUser) {
    if (typeof showToast === 'function')
      showToast('Συνδέσου για να αποθηκεύσεις αγαπημένα!', 'Sign in to save favorites!');
    return;
  }
  const was = isFavorite(id);
  _favCache = was
    ? (_favCache || []).filter(function(x) { return x !== id; })
    : (_favCache || []).concat([id]);
  _syncHearts(id);

  const ref = _favRef();
  if (!ref) return;
  ref.set({ ids: _favCache }, { merge: true })
    .catch(function() {
      // Rollback on Firestore error
      _favCache = was
        ? (_favCache || []).concat([id])
        : (_favCache || []).filter(function(x) { return x !== id; });
      _syncHearts(id);
    });
}

// ── SYNC HEART BUTTON STATES ──
function _syncHearts(id) {
  document.querySelectorAll('.fav-btn').forEach(function(btn) {
    if (btn.dataset.gameId === id) btn.classList.toggle('fav-active', isFavorite(id));
  });
}

function refreshAllHearts() {
  document.querySelectorAll('.fav-btn[data-game-id]').forEach(function(btn) {
    btn.classList.toggle('fav-active', isFavorite(btn.dataset.gameId));
  });
}

// ── CREATE HEART BUTTON ──
function createFavBtn(gameId) {
  const btn = document.createElement('button');
  btn.className = 'fav-btn' + (isFavorite(gameId) ? ' fav-active' : '');
  btn.dataset.gameId = gameId;
  btn.setAttribute('aria-label', isFavorite(gameId)
    ? 'Αφαίρεση από αγαπημένα'
    : 'Προσθήκη στα αγαπημένα');
  // SVG heart path
  btn.innerHTML = '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">'
    + '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3'
    + 'c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5'
    + 'c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>';
  btn.onclick = function(e) {
    e.stopPropagation();
    toggleFavorite(gameId);
  };
  return btn;
}

// ── INJECT HEARTS INTO HOME CAROUSEL ──
function _injectCarouselHearts() {
  document.querySelectorAll('.game-card[data-game-id]:not(.locked)').forEach(function(card) {
    const img = card.querySelector('.card-img');
    if (!img || img.querySelector('.fav-btn')) return;
    img.appendChild(createFavBtn(card.dataset.gameId));
  });
}

// ── FAVORITES PAGE ──
function navToFavorites() {
  if (typeof _navPush === 'function') _navPush({ page: 'favorites' });
  document.body.dataset.theme = '';

  if (typeof buildNav === 'function') {
    buildNav('favorites-nav-wrap', [
      { label: typeof t === 'function' ? t('Αρχική', 'Home') : 'Αρχική', action: "goTo('home')" },
      { label: typeof t === 'function' ? t('Αγαπημένα', 'Favorites') : 'Αγαπημένα' }
    ]);
  }

  const grid  = document.getElementById('favorites-grid');
  const empty = document.getElementById('favorites-empty');
  if (!grid) { if (typeof goTo === 'function') goTo('favorites'); return; }

  grid.innerHTML = '';
  if (empty) empty.style.display = 'none';

  // Not logged in
  if (typeof currentUser === 'undefined' || !currentUser) {
    if (empty) {
      empty.style.display = 'flex';
      const msg = empty.querySelector('.fav-empty-msg');
      if (msg) msg.textContent = typeof t === 'function'
        ? t('Συνδέσου για να δεις τα αγαπημένα σου.', 'Sign in to see your favorites.')
        : 'Συνδέσου για να δεις τα αγαπημένα σου.';
    }
    if (typeof goTo === 'function') goTo('favorites');
    return;
  }

  const favIds = getFavorites();
  if (!favIds.length) {
    if (empty) empty.style.display = 'flex';
    if (typeof goTo === 'function') goTo('favorites');
    return;
  }

  const registry = _buildFavRegistry();
  let rendered = 0;
  favIds.forEach(function(id) {
    const gm = registry[id];
    if (!gm) return;
    grid.appendChild(_buildFavCard(gm));
    rendered++;
  });

  if (!rendered && empty) empty.style.display = 'flex';
  if (typeof goTo === 'function') goTo('favorites');
}

// ── GAME REGISTRY (for favorites page card rendering) ──
function _buildFavRegistry() {
  var lang = typeof siteLang !== 'undefined' ? siteLang : 'gr';
  var _t   = function(gr, en) { return lang === 'en' ? (en || gr) : gr; };

  // Opener functions for every registered game
  var openers = {
    'feat-lyo':         function() { if (typeof openLyo           === 'function') openLyo(); },
    'feat-paratheta':   function() { if (typeof openParatheta     === 'function') openParatheta(); },
    'feat-nouns':       function() { if (typeof openOusiastika    === 'function') openOusiastika(); },
    'feat-antonymies':  function() { if (typeof openAntonymies    === 'function') openAntonymies(); },
    'klisi-epitheton':  function() { if (typeof openEpitheta      === 'function') openEpitheta(); },
    'paratheta':        function() { if (typeof openParatheta     === 'function') openParatheta(); },
    'blade':            function() { if (typeof openBlade         === 'function') openBlade(); },
    'pathitiko':        function() { if (typeof openPathitiko     === 'function') openPathitiko(); },
    'afwnolekta':       function() { if (typeof openAfwnolekta    === 'function') openAfwnolekta(); },
    'aoristos-b':       function() { if (typeof openAoristosB     === 'function') openAoristosB(); },
    'rimata-mi':        function() { if (typeof openRimataMi      === 'function') openRimataMi(); },
    'synirimmena':      function() { if (typeof openSynirimmena   === 'function') openSynirimmena(); },
    'anwmala-rimata':   function() { if (typeof openAnwmalaRimata === 'function') openAnwmalaRimata(); },
    'klisi-rimaton':    function() { if (typeof openKlisiRimaton  === 'function') openKlisiRimaton(); },
    'eimi':             function() { if (typeof openEimi          === 'function') openEimi(); },
    'iliada-arcade':    function() { if (typeof openIliadaArcade  === 'function') openIliadaArcade(); },
    'temple-run':       function() { if (typeof openTempleRun     === 'function') openTempleRun(typeof buildTempleRunConfig === 'function' ? buildTempleRunConfig(typeof currentSubjectId !== 'undefined' ? currentSubjectId : 'iliada') : {}); },
    'iliada-tow':       function() { if (typeof openTow           === 'function') openTow(); },
    'noun-tow':         function() { if (typeof openNounTow       === 'function') openNounTow(); },
    'noun-fill':        function() { if (typeof openNounFill      === 'function') openNounFill(); },
    'odyssey-journey':  function() { if (typeof openOdysseyJourney === 'function') openOdysseyJourney(); },
    'odyssey-trivia':   function() { if (typeof launchOdysseyTrivia === 'function') launchOdysseyTrivia(typeof siteLang !== 'undefined' ? siteLang : 'gr'); },
    'istoria-g3':       function() { if (typeof openIstoria       === 'function') openIstoria(); },
    'history-game':     function() { if (typeof openHistoryGame   === 'function') openHistoryGame(); },
    'antonymies':       function() { if (typeof openAntonymies    === 'function') openAntonymies(); },
    'grammar-invaders': function() { if (typeof openInvaders      === 'function') openInvaders(); },
    'myth-memory':      function() { if (typeof openMythMemory    === 'function') openMythMemory(); },
    'rapid-fire':       function() { if (typeof openRapidFire     === 'function') openRapidFire(); },
    'epic-puzzle':      function() { if (typeof openEpicPuzzle    === 'function') openEpicPuzzle(typeof currentSubjectId !== 'undefined' ? currentSubjectId : 'iliada'); },
    'lat-kata':         function() { if (typeof openLatKata       === 'function') openLatKata(); },
    'lat-nouns-kata':   function() { if (typeof openLatNounsKata  === 'function') openLatNounsKata(); },
    'lat-nouns':        function() { if (typeof openLatNouns      === 'function') openLatNouns(); },
    'lat-verbs':        function() { if (typeof openLatVerbs      === 'function') openLatVerbs(); },
    'lat-anwmala':      function() { if (typeof openLatAnwmala    === 'function') openLatAnwmala(); },
    'lat-anwmala-theory': function() { if (typeof openLatAnwmalaTheory === 'function') openLatAnwmalaTheory(); },
    'lat-epitheta':     function() { if (typeof openLatEpitheta   === 'function') openLatEpitheta(); },
    'lat-epitheta-kata':function() { if (typeof openLatEpithetaKata === 'function') openLatEpithetaKata(); },
    'lat-antonymies':   function() { if (typeof openLatAntonymies === 'function') openLatAntonymies(); },
    'lat-antonymies-theory': function() { if (typeof openLatAntonymiesTheory === 'function') openLatAntonymiesTheory(); },
    'lat-nouns-kata-theory': function() { if (typeof openLatNounsKataTheory === 'function') openLatNounsKataTheory(); },
    'lat-epitheta-kata-theory': function() { if (typeof openLatEpithetaKataTheory === 'function') openLatEpithetaKataTheory(); },
    'trivia-iliada':    function() { if (typeof launchGame        === 'function') launchGame('gr'); },
    'crypto-hack':      function() { if (typeof CryptoHack !== 'undefined' && CryptoHack.open) CryptoHack.open(); },
  };

  var reg = {};

  // ── Hand-coded featured game entries ──
  [
    { id: 'feat-lyo',
      label: _t('Μαθαίνοντας το Λύω', 'Learning to Decline: Lyo'),
      desc:  _t('Κλίση ρημάτων — 32 επίπεδα από Οριστική έως Μετοχή.', 'Verb conjugation — 32 levels from Indicative to Participle.'),
      icon: '🏛️', bg: 'linear-gradient(135deg,#1a1208,#5a4010)', hc: '#c9a44a' },
    { id: 'feat-paratheta',
      label: _t('Παραθετικά Επιθέτων', 'Degrees of Adjectives'),
      desc:  _t('Συγκριτικός & υπερθετικός — ομαλά και ανώμαλα, 10 επίπεδα.', 'Comparative & superlative — regular and irregular, 10 levels.'),
      icon: '🔼',  bg: 'linear-gradient(135deg,#1a1028,#4a2060)', hc: '#c9a4f0' },
    { id: 'feat-nouns',
      label: _t('Κλίση Ουσιαστικών', 'Noun Declension'),
      desc:  _t('Α΄, Β΄, Γ΄ κλίση — 200+ λέξεις με όλες τις υποκατηγορίες.', '1st, 2nd, 3rd declension — 200+ words across all subcategories.'),
      icon: '📜',  bg: 'linear-gradient(135deg,#0D2A3A,#185FA5)', hc: '#6ab4e8' },
    { id: 'feat-antonymies',
      label: _t('Κλίση Αντωνυμιών', 'Pronoun Declension'),
      desc:  _t('Προσωπικές, δεικτικές, αυτοπαθείς, αναφορικές — 19 επίπεδα.', 'Personal, demonstrative, reflexive, relative — 19 levels.'),
      icon: '👤',  bg: 'linear-gradient(135deg,#1A2E10,#3B6D11)', hc: '#7dc86a' },
  ].forEach(function(g) {
    reg[g.id] = { id: g.id, label: g.label, desc: g.desc, icon: g.icon, bg: g.bg, hc: g.hc, opener: openers[g.id] };
  });

  // ── Scan all GRADES for extraGames ──
  if (typeof GRADES !== 'undefined') {
    Object.keys(GRADES).forEach(function(gk) {
      var grade    = GRADES[gk];
      var subjects = [];
      if (grade.subjects) grade.subjects.forEach(function(s) { subjects.push(s); });
      if (grade.tracks)   grade.tracks.forEach(function(tr) { tr.subjects.forEach(function(s) { subjects.push(s); }); });
      subjects.forEach(function(subject) {
        (subject.extraGames || []).forEach(function(eg) {
          if (reg[eg.type]) return;
          reg[eg.type] = {
            id:     eg.type,
            label:  lang === 'en' ? ((eg.en && eg.en.label) || eg.label) : eg.label,
            desc:   lang === 'en' ? ((eg.en && eg.en.desc)  || eg.desc)  : eg.desc,
            icon:   eg.icon,
            bg:     'linear-gradient(135deg,#1a1208,#4a3010)',
            hc:     '#c9a44a',
            opener: openers[eg.type] || function() {},
          };
        });
      });
    });
  }

  // ── Trivia (DEFAULT_GAMES singleton) ──
  reg['trivia-iliada'] = {
    id:     'trivia-iliada',
    label:  _t('Ιλιάδα Trivia', 'Iliad Trivia'),
    desc:   _t('Trivia & Tug of War — πολλαπλής επιλογής ή αγώνας ομάδων.', 'Trivia & Tug of War — multiple choice or team battle.'),
    icon:   '🏆', bg: 'linear-gradient(135deg,#2A1008,#7A3010)', hc: '#c9a44a',
    opener: openers['trivia-iliada'],
  };

  // ── Crypto Hack (home carousel) ──
  reg['crypto-hack'] = {
    id:     'crypto-hack',
    label:  'Crypto Hack',
    desc:   _t('Αποκωδικοποίησε κρυφά μηνύματα χρησιμοποιώντας αρχαία κρυπτογραφία.', 'Decode secret messages using ancient cryptography.'),
    icon:   '🔐', bg: 'linear-gradient(135deg,#0A1A2A,#1A4070)', hc: '#6ab4e8',
    opener: openers['crypto-hack'],
  };

  return reg;
}

// ── BUILD CARD FOR FAVORITES PAGE ──
function _buildFavCard(gm) {
  var _tl = function(gr, en) { return (typeof siteLang !== 'undefined' && siteLang === 'en') ? (en || gr) : gr; };
  var solo = _tl('Μόνος', 'Solo');
  var free = _tl('Δωρεάν', 'Free');

  var card = document.createElement('div');
  card.className = 'g-card';
  card.dataset.gameId = gm.id;
  card.setAttribute('data-tags', 'free solo');
  card.onclick = gm.opener || function() {};
  card.innerHTML =
    '<div class="g-banner" style="background:' + gm.bg + ';position:relative;">'
      + '<span style="font-size:38px;">' + gm.icon + '</span>'
      + '<div class="free-b">' + free + '</div>'
    + '</div>'
    + '<div class="g-body">'
      + '<h3 style="color:' + (gm.hc || 'var(--espresso)') + ';">' + gm.label + '</h3>'
      + '<div class="g-desc">' + gm.desc + '</div>'
      + '<div class="g-meta">'
        + '<div class="meta-tags"><span class="tag">' + solo + '</span></div>'
        + '<div class="play-btn">▶</div>'
      + '</div>'
    + '</div>';

  var banner = card.querySelector('.g-banner');
  if (banner) banner.appendChild(createFavBtn(gm.id));
  return card;
}

// ── AUTH WATCHER ──
// Registers a second onAuthStateChanged listener (Firebase supports multiple).
// On login: loads favorites from Firestore and refreshes all hearts.
// On logout: clears the local cache.
//
// Guarded: auth.js runs before favorites.js and calls initializeApp()
// synchronously, so firebase.apps.length > 0 by the time this runs.
// The 'symposion:firebase-ready' fallback handles any load-order edge case.
(function() {
  if (typeof firebase === 'undefined') return;

  function _startAuthWatch() {
    try {
      firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
          loadFavorites().then(function() {
            refreshAllHearts();
            _injectCarouselHearts();
          });
        } else {
          _favCache = null;
          refreshAllHearts();
        }
      });
    } catch (e) {
      console.warn('[symposion fav] auth watch failed:', e);
    }
  }

  // If Firebase is already initialized (normal case), start immediately.
  // Otherwise wait for auth.js to fire the ready event.
  if (firebase.apps && firebase.apps.length > 0) {
    _startAuthWatch();
  } else {
    window.addEventListener('symposion:firebase-ready', _startAuthWatch, { once: true });
  }
})();
