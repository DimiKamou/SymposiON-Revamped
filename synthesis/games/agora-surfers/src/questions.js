/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — questions.js
   HOST-INJECTED QUIZ ONLY (no questions bundled with the game).

   Questions are NOT stored here. The Paideia game panel picks the
   subject / generates the set — exactly like every other game — and
   passes them in when it launches the runner:

     window.openAgoraSurfers({
       title: 'Ιλιάδα — Ραψωδία Α',
       questions: [
         { q: '…', a: ['…','…','…'], correct: 1 },   // native format
         { q: '…', opts: ['…','…','…'], ans: 0 },     // paideia format
       ],
     });

   The adapter stores that on  window.__trInject ; this iframe reads it
   from window.parent (same origin). Both question shapes are accepted.
   If no questions arrive, the runner still plays — it simply never
   raises a quiz card (see Game._openQuiz / hasQuestions()).
════════════════════════════════════════════════════════════════ */

let activePool = [];        // filled from the host; empty until injected
let injectedTitle = null;

// The host bank may deliver the prompt as a bilingual object ({gr,en}) rather
// than a plain string; picking the language here stops the quiz card from
// rendering the literal "[object Object]".
const _lang = () => (((window.parent && window.parent.siteLang) || window.siteLang) === 'en' ? 'en' : 'gr');
function qtext(q) {
  if (q == null) return '';
  if (typeof q === 'string') return q;
  if (typeof q === 'object') {
    const v = q[_lang()] != null ? q[_lang()] : (q.gr != null ? q.gr : q.en);
    if (typeof v === 'string') return v;
    if (v && typeof v === 'object') return qtext(v);
    if (q.q !== undefined) return qtext(q.q);
  }
  return String(q);
}

/* Normalise one host question into the engine's native shape. */
function normalize(q) {
  if (!q) return null;
  // native: { q, a:[…], correct }
  if (Array.isArray(q.a) && q.correct !== undefined) {
    const a = q.a.slice(0, 4);
    return { q: qtext(q.q), a, correct: Math.min(Math.max(q.correct | 0, 0), a.length - 1) };
  }
  // paideia: { q, opts:[…], ans }
  const opts = (q.opts || q.a || []).slice(0, 4);
  const ans = typeof q.ans === 'number' ? q.ans
            : typeof q.correct === 'number' ? q.correct : 0;
  return { q: qtext(q.q), a: opts, correct: Math.min(Math.max(ans | 0, 0), opts.length - 1) };
}

function ingest(list) {
  return (list || [])
    .map(normalize)
    .filter((q) => q && q.q && Array.isArray(q.a) && q.a.length >= 2);
}

/* Read host-injected questions (paideia). Accepts both formats. */
export function readInjected() {
  try {
    const src = (window.parent && window.parent !== window) ? window.parent : window;
    const inj = src.__trInject;
    if (!inj) return null;
    if (inj.title) injectedTitle = inj.title;
    if (inj.questions && inj.questions.length) {
      activePool = ingest(inj.questions);
      return { title: injectedTitle, count: activePool.length };
    }
    return { title: injectedTitle, count: 0 };
  } catch (e) {
    // Cross-origin / sandboxed standalone play: no host injection available.
    return null;
  }
}

/* Optional imperative API — host may push questions in after load. */
export function setQuestions(list, title) {
  activePool = ingest(list);
  if (title) injectedTitle = title;
  return activePool.length;
}

export function getInjectedTitle() { return injectedTitle; }

/* True once the host has supplied a usable question set. */
export function hasQuestions() { return activePool.length > 0; }

/* Returns a fresh shuffled queue of questions (empty if none injected). */
export function buildQueue() {
  return activePool.slice().sort(() => Math.random() - 0.5);
}
