/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — main.js  (boot)
════════════════════════════════════════════════════════════════ */
import { Game } from './game.js';
import { readInjected, getInjectedTitle } from './questions.js';
import { PU_TYPES, puColor } from './builders-actors.js';

const hex6 = (n) => '#' + (n >>> 0).toString(16).padStart(6, '0').slice(-6);

// Build the power-up legend on the start screen from the same source of truth.
function buildLegend() {
  const el = document.getElementById('pu-legend');
  if (!el) return;
  el.innerHTML = PU_TYPES.map((t) => {
    const sub = (Game.PU_INFO[t] || {}).sub || '';
    return `<div class="pu-leg" style="--lc:${hex6(puColor(t))}">` +
      `<span class="li">${Game.PU_ICON[t] || ''}</span>` +
      `<span class="ln">${Game.PU_SHORT[t]}</span>` +
      `<span class="ld">${sub}</span></div>`;
  }).join('');
}

// Pull host-injected questions (paideia) before the game builds its queue.
const inj = readInjected();
const title = getInjectedTitle();
if (title) {
  const t1 = document.getElementById('start-title');
  const t2 = document.getElementById('game-title');
  if (t1) t1.textContent = title;
  if (t2) t2.textContent = title;
}

const stage = document.getElementById('stage');
let game;
try {
  game = new Game(stage);
  window.__agora = game;
  buildLegend();
} catch (e) {
  console.error('[AgoraSurfers] boot failed:', e);
}

// Reveal the scene. The Game constructor already force-hides loading after its
// first render; this is a belt-and-suspenders fallback independent of timing.
function hideLoading() {
  const l = document.getElementById('loading');
  if (l) l.classList.add('hidden');
}
hideLoading();
requestAnimationFrame(() => requestAnimationFrame(hideLoading));
setTimeout(hideLoading, 800);
