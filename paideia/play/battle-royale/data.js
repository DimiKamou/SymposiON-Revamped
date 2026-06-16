/* ============================================================
   Battle Royale — data.js
   Warriors (the 24-strong field) + question pool + tournament math.
   Plain JS, attached to window so the Babel scripts can read it.
   ============================================================ */

/* ── The field. "You" is injected by the app at a random slot. ──
   sigil = Greek capital shown on the medallion. hue drives the
   medallion colour. skill = bot answer accuracy (0–1). pace =
   how fast the bot tends to lock in (lower = faster, seconds). */
const NAME_POOL = [
  { name: 'Lysandra',  sigil: 'Λ', hue: 18,  skill: 0.78, pace: 2.6 },
  { name: 'Theron',    sigil: 'Θ', hue: 42,  skill: 0.72, pace: 3.1 },
  { name: 'Kassandra', sigil: 'Κ', hue: 350, skill: 0.81, pace: 2.2 },
  { name: 'Nikias',    sigil: 'Ν', hue: 200, skill: 0.66, pace: 3.6 },
  { name: 'Daphne',    sigil: 'Δ', hue: 140, skill: 0.74, pace: 2.9 },
  { name: 'Alexios',   sigil: 'Α', hue: 28,  skill: 0.69, pace: 3.3 },
  { name: 'Iola',      sigil: 'Ι', hue: 310, skill: 0.77, pace: 2.5 },
  { name: 'Damon',     sigil: 'Δ', hue: 220, skill: 0.63, pace: 3.8 },
  { name: 'Phaedra',   sigil: 'Φ', hue: 8,   skill: 0.83, pace: 2.0 },
  { name: 'Leon',      sigil: 'Λ', hue: 48,  skill: 0.70, pace: 3.2 },
  { name: 'Xanthe',    sigil: 'Ξ', hue: 52,  skill: 0.75, pace: 2.7 },
  { name: 'Orion',     sigil: 'Ο', hue: 232, skill: 0.79, pace: 2.3 },
  { name: 'Selene',    sigil: 'Σ', hue: 264, skill: 0.73, pace: 2.8 },
  { name: 'Andreas',   sigil: 'Α', hue: 12,  skill: 0.61, pace: 4.0 },
  { name: 'Galen',     sigil: 'Γ', hue: 158, skill: 0.68, pace: 3.4 },
  { name: 'Ariadne',   sigil: 'Α', hue: 328, skill: 0.85, pace: 1.9 },
  { name: 'Castor',    sigil: 'Κ', hue: 205, skill: 0.67, pace: 3.5 },
  { name: 'Elektra',   sigil: 'Η', hue: 358, skill: 0.80, pace: 2.4 },
  { name: 'Nikos',     sigil: 'Ν', hue: 36,  skill: 0.64, pace: 3.7 },
  { name: 'Thalia',    sigil: 'Θ', hue: 122, skill: 0.76, pace: 2.6 },
  { name: 'Demos',     sigil: 'Δ', hue: 24,  skill: 0.65, pace: 3.6 },
  { name: 'Calliope',  sigil: 'Χ', hue: 288, skill: 0.82, pace: 2.1 },
  { name: 'Castalia',  sigil: 'Κ', hue: 188, skill: 0.71, pace: 3.0 },
  { name: 'Aias',      sigil: 'Α', hue: 4,   skill: 0.74, pace: 2.8 },
  { name: 'Myron',     sigil: 'Μ', hue: 96,  skill: 0.69, pace: 3.3 },
  { name: 'Zephyra',   sigil: 'Ζ', hue: 176, skill: 0.78, pace: 2.5 },
  { name: 'Hektor',    sigil: 'Η', hue: 14,  skill: 0.84, pace: 2.0 },
  { name: 'Iris',      sigil: 'Ι', hue: 300, skill: 0.72, pace: 2.9 },
];

/* ── Question pool. Mixed general knowledge (placeholder theme).
   q = prompt, opts = 4 answers, ans = index of correct. ── */
const QUESTION_POOL = [
  { q: 'Which planet is the largest in our solar system?', opts: ['Saturn', 'Jupiter', 'Neptune', 'Earth'], ans: 1 },
  { q: 'How many sides does a hexagon have?', opts: ['Five', 'Six', 'Seven', 'Eight'], ans: 1 },
  { q: 'What is the capital of Japan?', opts: ['Seoul', 'Beijing', 'Tokyo', 'Bangkok'], ans: 2 },
  { q: 'Who painted the Mona Lisa?', opts: ['Raphael', 'Michelangelo', 'Da Vinci', 'Donatello'], ans: 2 },
  { q: 'What gas do plants primarily absorb?', opts: ['Oxygen', 'Nitrogen', 'Hydrogen', 'Carbon dioxide'], ans: 3 },
  { q: 'Which ocean is the largest on Earth?', opts: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], ans: 2 },
  { q: 'What is the chemical symbol for gold?', opts: ['Go', 'Gd', 'Au', 'Ag'], ans: 2 },
  { q: 'How many strings does a standard violin have?', opts: ['Four', 'Five', 'Six', 'Seven'], ans: 0 },
  { q: 'In which country are the pyramids of Giza?', opts: ['Sudan', 'Egypt', 'Mexico', 'Peru'], ans: 1 },
  { q: 'What is the hardest known natural material?', opts: ['Quartz', 'Steel', 'Diamond', 'Granite'], ans: 2 },
  { q: 'Which is the smallest prime number?', opts: ['Zero', 'One', 'Two', 'Three'], ans: 2 },
  { q: 'What language has the most native speakers?', opts: ['English', 'Hindi', 'Spanish', 'Mandarin'], ans: 3 },
  { q: 'Which metal is liquid at room temperature?', opts: ['Mercury', 'Lead', 'Tin', 'Zinc'], ans: 0 },
  { q: 'How many colours are in a rainbow?', opts: ['Five', 'Six', 'Seven', 'Eight'], ans: 2 },
  { q: 'What is the tallest mountain on Earth?', opts: ['K2', 'Everest', 'Denali', 'Kilimanjaro'], ans: 1 },
  { q: 'Who wrote the play "Hamlet"?', opts: ['Dickens', 'Shakespeare', 'Tolstoy', 'Homer'], ans: 1 },
  { q: 'What is the powerhouse of the cell?', opts: ['Nucleus', 'Ribosome', 'Mitochondria', 'Membrane'], ans: 2 },
  { q: 'Which country gifted the Statue of Liberty?', opts: ['Britain', 'France', 'Spain', 'Italy'], ans: 1 },
  { q: 'How many minutes are in a full day?', opts: ['1200', '1440', '1600', '2400'], ans: 1 },
  { q: 'What is the freezing point of water in Celsius?', opts: ['-10°', '0°', '10°', '32°'], ans: 1 },
  { q: 'Which instrument has 88 keys?', opts: ['Organ', 'Harp', 'Piano', 'Accordion'], ans: 2 },
  { q: 'What is the largest land animal?', opts: ['Rhino', 'Hippo', 'Elephant', 'Giraffe'], ans: 2 },
  { q: 'Which planet is known as the Red Planet?', opts: ['Venus', 'Mars', 'Mercury', 'Jupiter'], ans: 1 },
  { q: 'How many continents are there?', opts: ['Five', 'Six', 'Seven', 'Eight'], ans: 2 },
  { q: 'What is the main ingredient in bread?', opts: ['Rice', 'Flour', 'Corn', 'Oats'], ans: 1 },
  { q: 'Who developed the theory of relativity?', opts: ['Newton', 'Einstein', 'Galileo', 'Bohr'], ans: 1 },
  { q: 'Which sea is the saltiest?', opts: ['Red Sea', 'Dead Sea', 'Black Sea', 'Caspian'], ans: 1 },
  { q: 'What is the square root of 144?', opts: ['11', '12', '13', '14'], ans: 1 },
  { q: 'Which bird is a symbol of peace?', opts: ['Eagle', 'Dove', 'Owl', 'Swan'], ans: 1 },
  { q: 'In what year did humans first land on the Moon?', opts: ['1965', '1969', '1972', '1958'], ans: 1 },
  { q: 'What is the longest river in the world?', opts: ['Amazon', 'Nile', 'Yangtze', 'Danube'], ans: 1 },
  { q: 'Which element has the symbol "O"?', opts: ['Osmium', 'Oxygen', 'Gold', 'Oganesson'], ans: 1 },
  { q: 'How many legs does a spider have?', opts: ['Six', 'Eight', 'Ten', 'Twelve'], ans: 1 },
  { q: 'What shape has no corners?', opts: ['Square', 'Triangle', 'Circle', 'Pentagon'], ans: 2 },
];

/* ── Tournament math ── */

// Bracket size after a round of `n` survivors.
function nextBracketSize(n) {
  // power of two -> halve; otherwise drop to the largest power of two below.
  if ((n & (n - 1)) === 0) return n / 2;
  let p = 1;
  while (p * 2 < n) p *= 2;
  return p;
}

// Human-readable name for a round given how many remain.
function roundLabel(remaining) {
  switch (remaining) {
    case 2:  return { en: 'The Final',   gr: 'Ο ΤΕΛΙΚΟΣ' };
    case 4:  return { en: 'Semifinal',   gr: 'ΗΜΙΤΕΛΙΚΟΣ' };
    case 8:  return { en: 'Quarterfinal', gr: 'ΠΡΟΗΜΙΤΕΛΙΚΟΣ' };
    case 16: return { en: 'Round of 16', gr: 'ΦΑΣΗ ΤΩΝ 16' };
    default: return { en: 'Opening Clash', gr: 'ΠΡΩΤΗ ΑΝΑΜΕΤΡΗΣΗ' };
  }
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Pair survivors into matches + byes for this round.
   Guarantees the human (id === 'you') is always placed in a match.
   Returns { matches: [[a,b],...], byes: [player,...] }. */
function drawRound(survivors) {
  const next = nextBracketSize(survivors.length);
  const numMatches = survivors.length - next;
  const numByes = next - numMatches; // = 2*next - n

  let pool = shuffle(survivors);
  // Make sure "you" never draws a bye — pull to the front of the match pool.
  const youIdx = pool.findIndex((p) => p.id === 'you');
  if (youIdx >= 0) {
    const [you] = pool.splice(youIdx, 1);
    pool.unshift(you);
  }

  const inMatches = pool.slice(0, numMatches * 2);
  const byes = pool.slice(numMatches * 2);

  // Pair: seed human's match first, then the rest.
  const matches = [];
  for (let i = 0; i < inMatches.length; i += 2) {
    matches.push([inMatches[i], inMatches[i + 1]]);
  }
  // Ensure the human's match is index 0 for easy lookup.
  const hm = matches.findIndex((m) => m[0].id === 'you' || m[1].id === 'you');
  if (hm > 0) { const [m] = matches.splice(hm, 1); matches.unshift(m); }
  // Human always on the left of their match.
  if (matches[0] && matches[0][1].id === 'you') matches[0].reverse();

  return { matches, byes: byes.slice(0, numByes) };
}

window.BR_DATA = {
  NAME_POOL, QUESTION_POOL,
  nextBracketSize, roundLabel, shuffle, drawRound, simWinner,
};

/* probabilistic winner between two warriors (skill-weighted) */
function simWinner(a, b) {
  const pa = a.skill / (a.skill + b.skill);
  return Math.random() < pa * 0.85 + 0.075 ? a : b;
}
