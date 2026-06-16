/* ════════════════════════════════════════════════════════════════════
   SymposiON · carousel.js   —  rolling subject marquee
   Finds [data-sym-carousel], builds two rows from SUBJECTS, duplicates
   cards for a seamless loop.  Pair with carousel.css.
   ════════════════════════════════════════════════════════════════════ */

/* ─── 1. Subject catalogue ──────────────────────────────────────────
   Each entry:
     gr     – Greek display name
     en     – English subtitle (shown in italic below name)
     illu   – SVG filename in images/illustrations/ (no .svg)
     accent – CSS colour fed into --mc-ac
     meta   – short descriptor line
     go     – zero-arg callback that navigates to the subject
   ──────────────────────────────────────────────────────────────────── */
const CAROUSEL_SUBJECTS = [
  {
    gr: 'Ιλιάδα',
    en: 'Iliad · Ομήρου Ιλιάς',
    illu: 'sword',
    accent: '#D97B5C',
    meta: 'Β΄ ΓΥΜΝΑΣΙΟΥ · 8 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToSubject === 'function') navToSubject('gym-b', 'iliada'); }
  },
  {
    gr: 'Οδύσσεια',
    en: 'Odyssey · Ομήρου Οδύσσεια',
    illu: 'ship-prow',
    accent: '#4E8A99',
    meta: 'Α΄ ΓΥΜΝΑΣΙΟΥ · 6 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToSubject === 'function') navToSubject('gym-a', 'odysseia'); }
  },
  {
    gr: 'Ελένη',
    en: 'Helen · Ευριπίδη Ελένη',
    illu: 'theatre',
    accent: '#7A2E33',
    meta: 'Γ΄ ΓΥΜΝΑΣΙΟΥ · 8 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToSubject === 'function') navToSubject('gym-c', 'eleni'); }
  },
  {
    gr: 'Αντιγόνη',
    en: 'Antigone · Σοφοκλή',
    illu: 'crown-laurel',
    accent: '#7A2E33',
    meta: 'Β΄ ΛΥΚΕΙΟΥ · 6 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToSubject === 'function') navToSubject('lyk-b', 'antigoni'); }
  },
  {
    gr: 'Αρχαία Α΄',
    en: 'Ancient Greek · Α΄ Γυμνασίου',
    illu: 'tablet',
    accent: '#C4A448',
    meta: 'Α΄ ΓΥΜΝΑΣΙΟΥ · 5 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToSubject === 'function') navToSubject('gym-a', 'archaia'); }
  },
  {
    gr: 'Αρχαία Γ΄',
    en: 'Ancient Greek · Γ΄ Γυμνασίου',
    illu: 'quill-feather',
    accent: '#C4A448',
    meta: 'Γ΄ ΓΥΜΝΑΣΙΟΥ · 5 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToSubject === 'function') navToSubject('gym-c', 'archaia'); }
  },
  {
    gr: 'Αρχαία Α΄ Λυκ.',
    en: 'Ancient Greek · Θεωρητική',
    illu: 'scroll',
    accent: '#C4A448',
    meta: 'Α΄ ΛΥΚΕΙΟΥ · 5 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToSubject === 'function') navToSubject('lyk-a', 'archaia-thx'); }
  },
  {
    gr: 'Λατινικά Β΄',
    en: 'Latin · Β΄ Λυκείου',
    illu: 'trident',
    accent: '#C96A45',
    meta: 'Β΄ ΛΥΚΕΙΟΥ · 5 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToSubject === 'function') navToSubject('lyk-b', 'latinika'); }
  },
  {
    gr: 'Λατινικά Γ΄',
    en: 'Latin · Γ΄ Λυκείου',
    illu: 'trident',
    accent: '#C96A45',
    meta: 'Γ΄ ΛΥΚΕΙΟΥ · 5 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToSubject === 'function') navToSubject('lyk-c', 'latinika'); }
  },
  {
    gr: 'Γραμματική',
    en: 'Grammar · Αρχαία Ελληνικά',
    illu: 'column',
    accent: '#C4A448',
    meta: 'ΓΡΑΜΜΑΤΙΚΗ · 12 ΑΣΚΗΣΕΙΣ',
    go: () => { if (typeof navToGrade === 'function') navToGrade('gram-arch'); }
  },
  {
    gr: 'Ιστορία',
    en: 'History · Γυμνάσιο',
    illu: 'coin',
    accent: '#7E8C4A',
    meta: 'ΓΥΜΝΑΣΙΟ · 4 ΠΑΙΧΝΙΔΙΑ',
    go: () => { if (typeof navToGrade === 'function') navToGrade('gym-a'); }
  },
  {
    gr: 'Νέα Ελληνικά',
    en: 'Modern Greek · Grammar',
    illu: 'owl',
    accent: '#6FB0BE',
    meta: 'ΓΡΑΜΜΑΤΙΚΗ · 6 ΑΣΚΗΣΕΙΣ',
    go: () => { if (typeof navToGrade === 'function') navToGrade('gram-nea'); }
  },
];

/* ─── 2. Build a single .sym-mc card element ──────────────────────── */
function buildCarouselCard(subj) {
  const card = document.createElement('div');
  card.className = 'sym-mc';
  card.style.setProperty('--mc-ac', subj.accent);
  card.onclick = subj.go;

  const ban = document.createElement('div');
  ban.className = 'ban';
  ban.setAttribute('data-illu', subj.illu);
  ban.setAttribute('data-size', '54'); // consumed by window._injectIllus

  const bd = document.createElement('div');
  bd.className = 'bd';

  const h4 = document.createElement('h4');
  h4.textContent = subj.gr;

  const lat = document.createElement('div');
  lat.className = 'latin';
  lat.textContent = subj.en;

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = subj.meta;

  bd.appendChild(h4);
  bd.appendChild(lat);
  bd.appendChild(meta);
  card.appendChild(ban);
  card.appendChild(bd);
  return card;
}

/* ─── 3. Populate a row with doubled cards (seamless loop) ──────────── */
function fillRow(row, subjects) {
  const frag = document.createDocumentFragment();
  // double the set so the CSS translate(-50%) loop is seamless
  const doubled = [...subjects, ...subjects];
  doubled.forEach(subj => frag.appendChild(buildCarouselCard(subj)));
  row.appendChild(frag);
}

/* ─── 4. SVG injection — works on any element with [data-illu] ──────── */
const _illuCache = new Map();

function _loadSvg(name, base) {
  const key = base + name;
  if (!_illuCache.has(key)) {
    _illuCache.set(key, fetch(base + name + '.svg')
      .then(r => r.ok ? r.text() : '')
      .catch(() => ''));
  }
  return _illuCache.get(key);
}

function _injectSvgs(scope, size) {
  const els = (scope || document).querySelectorAll('[data-illu]');
  return Promise.all(Array.from(els).map(async el => {
    const name = el.dataset.illu;
    if (!name || el.dataset.illuDone) return;
    el.dataset.illuDone = '1';
    const raw = await _loadSvg(name, 'images/illustrations/');
    if (!raw) return;
    const s = size || 54;
    const styled = raw.replace(/<svg([^>]*)>/,
      (_, a) => `<svg${a.replace(/\s(width|height)="[^"]*"/g, '')} style="display:block;width:${s}px;height:${s}px;color:inherit">`
    );
    el.innerHTML = styled;
  }));
}

async function injectCarouselIllus(container) {
  // Prefer the page-wide injector (window._injectIllus) which shares the
  // same SVG cache and proven fetch path as the subject-panel illustrations.
  // Fall back to the local _injectSvgs only if it isn't available yet.
  if (typeof window._injectIllus === 'function') {
    await window._injectIllus(container);
  } else {
    await _injectSvgs(container, 54);
  }
}

/* ─── 5. Reduced-motion fallback ────────────────────────────────────── */
// Handled entirely by @media (prefers-reduced-motion) in carousel.css.
// Do NOT set row.style.animation here — inline styles override CSS keyframes
// and cannot be undone by !important on individual sub-properties.
// eslint-disable-next-line no-unused-vars
function applyReducedMotion(_container) { /* intentional no-op */ }

/* ─── 6. Convert #home-carousel to auto-scroll marquee ─────────────── */
function initGameCardMarquee() {
  const carousel = document.getElementById('home-carousel');
  const wrapper  = carousel && carousel.closest('.carousel-wrapper');
  if (!carousel || !wrapper) return;

  // Double the cards so the CSS translateX(-50%) loop is seamless
  const origCards = Array.from(carousel.querySelectorAll('.game-card'));
  origCards.forEach(card => carousel.appendChild(card.cloneNode(true)));

  // Apply auto-scroll classes
  carousel.classList.add('is-marquee');
  wrapper.classList.add('is-marquee-wrap');
}

/* ─── 7. Main init ──────────────────────────────────────────────────── */
function initCarousels() {
  // Convert game-card section to auto-scroll marquee
  initGameCardMarquee();

  // Build rolling subject carousel rows
  document.querySelectorAll('[data-sym-carousel]').forEach(container => {
    const row1 = container.querySelector('[data-row="1"]');
    const row2 = container.querySelector('[data-row="2"]');
    if (!row1 || !row2) return;

    const half = Math.ceil(CAROUSEL_SUBJECTS.length / 2);
    fillRow(row1, CAROUSEL_SUBJECTS.slice(0, half));
    fillRow(row2, CAROUSEL_SUBJECTS.slice(half));

    applyReducedMotion(container);
    injectCarouselIllus(container);
  });

  // Inject SVG illustrations — use window._injectIllus (shared cache + correct
  // base-URL resolution). Calling it here also retries any elements that failed
  // during the initial injectScope() pass before DOMContentLoaded.
  if (typeof window._injectIllus === 'function') {
    window._injectIllus(document);
  } else {
    _injectSvgs(document, 52);
  }

  // Belt-and-suspenders: schedule a second retry 1 s later to catch any
  // elements where the first pass lost the race against SPA navigation.
  setTimeout(function() {
    if (typeof window._injectIllus === 'function') window._injectIllus(document);
  }, 1000);
}

/* Run after DOM is ready */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initCarousels);
} else {
  initCarousels();
}
