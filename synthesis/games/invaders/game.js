/* ═══════════════════════════════════════════════════════════════════
   Grammar Invaders  ·  REIMAGINED  ·  Core Engine v3
   Drop-in replacement for games/invaders/game.js

   Same engine & mechanic as v2 (front-row word options; shoot the form
   the question names). ONLY the rendering layer is re-skinned into three
   art directions, switchable at runtime:

     'nyx'      Α · Νυκτομαχία   — constellation fleet on a night sky
     'melan'    Β · Μελανόμορφος — black-figure frieze on terracotta
     'abyssos'  Γ · Ἄβυσσος      — luminous creatures in the deep

   Switch with:  window.setInvadersTheme('melan')   (persists to localStorage)
   Default theme read from localStorage('invadersTheme') || 'nyx'.

   Depends on: games/invaders/data.js  (INVADERS_DB)
   CONTROLS:  ←/→ or A/D = move · Space = shoot · Enter = restart
═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ─────────────────────────────────────────────────────────────
   § 0  THEMES  — the only thing that changes the look
───────────────────────────────────────────────────────────── */
const THEMES = {
  nyx: {
    bg: ['#15212b', '#0a0f15', '#06080b'],   // radial: inner → mid → outer
    stars: true, nebula: true, rays: false, meander: false,
    enemyStyle: 'constellation',
    playerStyle: 'trireme',
    bulletStyle: 'beam',
    front: '#F0C969', frontDim: '#C4A448', idle: '#9fb6c8',
    word: '#E8C87A', wordIdle: '#9fb6c8',
    bullet: '#F0C969', bulletGlow: '#F0C969',
    spark: ['#F0C969', '#D97B5C', '#E8C87A', '#cfe2ee', '#fff'],
    sparkBad: ['#D97B5C', '#B8553A', '#ff9a6e', '#fff'],
    panelBg: 'rgba(10,15,21,0.92)', panelLine: 'rgba(196,164,72,0.4)',
    panelKey: '#6f8496', panelTitle: '#7FB6CC', prompt: '#86a0b2', label: '#F0C969', labelGlow: '#C4A448',
    danger: 'rgba(240,201,105,0.18)', wrong: '#ff5e5e',
  },
  melan: {
    bg: ['#C9743F', '#B5602F', '#93481f'],
    stars: false, nebula: false, rays: false, meander: true,
    enemyStyle: 'blackfigure',
    playerStyle: 'archer',
    bulletStyle: 'arrow',
    front: '#1a0d04', frontDim: '#3a2110', idle: '#2a1709',
    word: '#1a0d04', wordIdle: '#4a2c14',
    bullet: '#1c0f06', bulletGlow: 'rgba(28,15,6,0.4)',
    spark: ['#1c0f06', '#3a2110', '#C9743F', '#7a4222'],
    sparkBad: ['#5a1e0c', '#8a3a1a', '#1c0f06'],
    panelBg: 'rgba(40,22,10,0.0)', panelLine: 'rgba(35,19,8,0.45)',
    panelKey: '#5a3418', panelTitle: '#3a2110', prompt: '#5a3418', label: '#231308', labelGlow: 'rgba(35,19,8,0.25)',
    danger: 'rgba(35,19,8,0.25)', wrong: '#7a1e0c',
    ink: '#1c0f06', clay: '#C9743F',
  },
  abyssos: {
    bg: ['#14424f', '#0b2530', '#061318'],   // inner glow placed at bottom
    bgFrom: 'bottom',
    stars: false, nebula: false, rays: true, meander: false, motes: true,
    enemyStyle: 'luminous',
    playerStyle: 'lyre',
    bulletStyle: 'wave',
    front: '#d6f1f8', frontDim: '#7FB6CC', idle: '#5b93a6',
    word: '#cdeef6', wordIdle: '#6fa6b8',
    bullet: '#9fe0ef', bulletGlow: '#7FB6CC',
    spark: ['#9fe0ef', '#E8C87A', '#cdeef6', '#7FB6CC', '#fff'],
    sparkBad: ['#E8C87A', '#D97B5C', '#9fe0ef', '#fff'],
    panelBg: 'rgba(6,19,24,0.9)', panelLine: 'rgba(127,182,204,0.4)',
    panelKey: '#4d7a8a', panelTitle: '#7FB6CC', prompt: '#6fa6b8', label: '#9fe0ef', labelGlow: '#7FB6CC',
    danger: 'rgba(127,182,204,0.18)', wrong: '#ff7a7a',
    glowAccent: '#E8C87A',
  },
};
let THEME_NAME = (function () {
  try { return localStorage.getItem('invadersTheme') || 'nyx'; } catch (_) { return 'nyx'; }
})();
if (!THEMES[THEME_NAME]) THEME_NAME = 'nyx';
const T = () => THEMES[THEME_NAME];

window.setInvadersTheme = function (name) {
  if (!THEMES[name]) return;
  THEME_NAME = name;
  try { localStorage.setItem('invadersTheme', name); } catch (_) {}
  // Rebuild starfield/background of a running instance
  if (_instance) _instance._onResize();
};
window.getInvadersTheme = () => THEME_NAME;
window.INVADERS_THEMES = Object.keys(THEMES);

/* ─────────────────────────────────────────────────────────────
   § 1  CONFIG
───────────────────────────────────────────────────────────── */
const CFG = {
  COLS: 6, ROWS: 5,
  ENEMY_W: 50, ENEMY_H: 32, ENEMY_GAP_X: 22, ENEMY_GAP_Y: 60, ENEMY_TOP: 118,
  PLAYER_W: 42, PLAYER_H: 30, PLAYER_SPEED: 300,
  BULLET_SPEED: 520, FIRE_COOLDOWN: 400,
  STARS: 90, SHAKE_FRAMES: 14, SHAKE_MAG: 5,
  BASE_SPD: 50, DROP_AMOUNT: 24, DESCENT_SPD: 8,
};

/* ─────────────────────────────────────────────────────────────
   § 2  UTILITIES
───────────────────────────────────────────────────────────── */
const rand = (a, b) => Math.random() * (b - a) + a;
const randInt = (a, b) => Math.floor(rand(a, b + 1));
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = randInt(0, i); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
// stable pseudo-species per word so each form keeps the same creature
function speciesIdx(word, n) {
  let h = 0; for (let i = 0; i < word.length; i++) h = (h * 31 + word.charCodeAt(i)) | 0;
  return Math.abs(h) % n;
}

/* ─────────────────────────────────────────────────────────────
   § 3  WEB AUDIO  (unchanged)
───────────────────────────────────────────────────────────── */
let _ac = null;
function _audio() { if (!_ac || _ac.state === 'closed') _ac = new (window.AudioContext || window.webkitAudioContext)(); return _ac; }
function _tone(freq, type, dur, vol = 0.25) {
  try {
    const ac = _audio(), osc = ac.createOscillator(), gain = ac.createGain();
    osc.connect(gain); gain.connect(ac.destination);
    osc.type = type; osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, ac.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + dur);
    osc.start(); osc.stop(ac.currentTime + dur);
  } catch (_) {}
}
const sfxShoot = () => _tone(780, 'square', 0.09, 0.12);
const sfxHit = () => { _tone(330, 'sine', 0.08, 0.3); _tone(660, 'sine', 0.12, 0.2); };
const sfxError = () => { _tone(110, 'sawtooth', 0.3, 0.4); };
const sfxLevelUp = () => [523, 659, 784, 1047].forEach((f, i) => setTimeout(() => _tone(f, 'triangle', 0.18, 0.28), i * 110));

/* ─────────────────────────────────────────────────────────────
   § 4  STAR  (used by nyx)
───────────────────────────────────────────────────────────── */
class Star {
  constructor(W, H, spread = true) { this._W = W; this._H = H; this._reset(spread); this.tw = rand(0, Math.PI * 2); }
  _reset(spread) { this.x = rand(0, this._W); this.y = spread ? rand(0, this._H) : -2; this.speed = rand(6, 26); this.r = rand(0.4, 2.0); this.alpha = rand(0.25, 1); }
  update(dt) { this.y += this.speed * dt; this.tw += dt * 3; if (this.y > this._H + 4) this._reset(false); }
  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha * (0.55 + 0.45 * Math.sin(this.tw));
    ctx.fillStyle = '#cfe2ee';
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}
// Abyssos rising mote
class Mote {
  constructor(W, H) { this._W = W; this._H = H; this._reset(true); }
  _reset(spread) { this.x = rand(0, this._W); this.y = spread ? rand(0, this._H) : this._H + 4; this.speed = rand(12, 34); this.r = rand(0.6, 2.0); this.alpha = rand(0.2, 0.8); this.sway = rand(0, Math.PI * 2); }
  update(dt) { this.y -= this.speed * dt; this.sway += dt * 1.5; this.x += Math.sin(this.sway) * 6 * dt; if (this.y < -4) this._reset(false); }
  draw(ctx) {
    ctx.save(); ctx.globalAlpha = this.alpha; ctx.fillStyle = '#aadce6';
    ctx.shadowColor = '#7FB6CC'; ctx.shadowBlur = 6;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   § 5  PARTICLE
───────────────────────────────────────────────────────────── */
class Particle {
  constructor(x, y, color, shard) {
    this.x = x; this.y = y; this.vx = rand(-130, 130); this.vy = rand(-160, 30);
    this.life = 1; this.decay = rand(0.028, 0.065); this.r = rand(1.5, 4.5); this.color = color;
    this.shard = shard; this.rot = rand(0, Math.PI); this.vr = rand(-6, 6);
  }
  update(dt) { this.x += this.vx * dt; this.y += this.vy * dt; this.vy += 110 * dt; this.rot += this.vr * dt; this.life -= this.decay; return this.life > 0; }
  draw(ctx) {
    ctx.save(); ctx.globalAlpha = Math.max(0, this.life); ctx.fillStyle = this.color;
    if (this.shard) { ctx.translate(this.x, this.y); ctx.rotate(this.rot); ctx.fillRect(-this.r, -this.r, this.r * 2, this.r * 2); }
    else { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   § 6  PROJECTILE  — theme-skinned
───────────────────────────────────────────────────────────── */
class Projectile {
  constructor(x, y) { this.x = x; this.y = y; this.alive = true; this.born = performance.now(); }
  update(dt) { this.y -= CFG.BULLET_SPEED * dt; if (this.y < -16) this.alive = false; }
  draw(ctx) {
    const th = T();
    ctx.save();
    if (th.bulletStyle === 'arrow') {
      ctx.strokeStyle = th.bullet; ctx.fillStyle = th.bullet; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(this.x, this.y - 12); ctx.lineTo(this.x, this.y + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(this.x, this.y - 14); ctx.lineTo(this.x - 4, this.y - 7); ctx.lineTo(this.x + 4, this.y - 7); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(this.x, this.y + 6); ctx.lineTo(this.x - 3, this.y + 1); ctx.moveTo(this.x, this.y + 6); ctx.lineTo(this.x + 3, this.y + 1); ctx.stroke();
    } else if (th.bulletStyle === 'wave') {
      ctx.strokeStyle = th.bullet; ctx.shadowColor = th.bulletGlow; ctx.shadowBlur = 12; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(this.x, this.y, 7, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 0.5; ctx.beginPath(); ctx.arc(this.x, this.y, 12, 0, Math.PI * 2); ctx.stroke();
    } else { // beam
      ctx.shadowColor = th.bulletGlow; ctx.shadowBlur = 10;
      ctx.fillStyle = th.bullet; ctx.fillRect(this.x - 2, this.y - 13, 4, 13);
    }
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   § 7  CREATURE RENDERERS  (canvas)
───────────────────────────────────────────────────────────── */
// design-space (0..100) → centered box of size S
function P(cx, cy, S, nx, ny) { return [cx + (nx - 50) / 100 * S, cy + (ny - 50) / 100 * S]; }

const CONST_DATA = {
  gorgon: { nodes: [[50,24],[34,42],[66,42],[50,52],[50,72],[20,26],[80,26],[16,50],[84,50]], core: 3, edges: [[0,1],[0,2],[1,3],[2,3],[3,4],[0,5],[0,6],[1,7],[2,8]] },
  cyclops: { nodes: [[50,26],[30,40],[70,40],[50,48],[50,68],[34,80],[66,80]], core: 3, edges: [[1,0],[0,2],[0,3],[3,4],[4,5],[4,6]] },
  harpy: { nodes: [[50,28],[38,46],[62,46],[14,38],[86,38],[50,64],[40,80],[60,80]], core: 5, edges: [[0,1],[0,2],[1,3],[2,4],[1,5],[2,5],[5,6],[5,7]] },
};
const CONST_KEYS = ['gorgon', 'cyclops', 'harpy'];

function drawConstellation(ctx, cx, cy, S, th, isFront, word) {
  const d = CONST_DATA[CONST_KEYS[speciesIdx(word, 3)]];
  const stroke = isFront ? th.front : th.idle;
  const node = isFront ? th.front : '#dfeaf2';
  ctx.save();
  if (isFront) { ctx.shadowColor = th.frontDim; ctx.shadowBlur = 12; }
  ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.globalAlpha = isFront ? 0.85 : 0.5;
  ctx.beginPath();
  d.edges.forEach(e => { const a = P(cx, cy, S, ...d.nodes[e[0]]), b = P(cx, cy, S, ...d.nodes[e[1]]); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); });
  ctx.stroke();
  ctx.globalAlpha = 1;
  d.nodes.forEach((n, i) => { const p = P(cx, cy, S, n[0], n[1]); ctx.fillStyle = i === d.core ? th.front : node; ctx.beginPath(); ctx.arc(p[0], p[1], i === d.core ? 2.6 : 1.6, 0, Math.PI * 2); ctx.fill(); });
  ctx.restore();
}

function drawBlackFigure(ctx, cx, cy, S, th, isFront, word, frame) {
  const sp = CONST_KEYS[speciesIdx(word, 3)];
  const legOff = (frame >> 3) & 1;
  ctx.save();
  if (isFront) { ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 8; }
  const ink = th.ink, clay = th.clay;
  ctx.fillStyle = ink; ctx.strokeStyle = ink; ctx.lineCap = 'round';
  const u = S / 100;
  if (sp === 'cyclops') {
    ctx.fillRect(cx - 14 * u, cy - 16 * u, 28 * u, 26 * u);
    ctx.lineWidth = 4 * u;
    ctx.beginPath(); ctx.moveTo(cx - 14 * u, cy - 8 * u); ctx.lineTo(cx - 22 * u, cy); ctx.moveTo(cx + 14 * u, cy - 8 * u); ctx.lineTo(cx + 22 * u, cy); ctx.stroke();
    const ly = legOff ? 4 : 0;
    ctx.beginPath(); ctx.moveTo(cx - 6 * u, cy + 10 * u); ctx.lineTo(cx - 9 * u, cy + (22 + ly) * u); ctx.moveTo(cx + 6 * u, cy + 10 * u); ctx.lineTo(cx + 9 * u, cy + (22 - ly) * u); ctx.stroke();
    ctx.strokeStyle = clay; ctx.lineWidth = 1.6 * u;
    ctx.beginPath(); ctx.arc(cx, cy - 4 * u, 7 * u, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = clay; ctx.beginPath(); ctx.arc(cx, cy - 4 * u, 2.6 * u, 0, Math.PI * 2); ctx.fill();
  } else if (sp === 'harpy') {
    ctx.beginPath(); ctx.moveTo(cx - 6 * u, cy - 6 * u); ctx.lineTo(cx - 30 * u, cy - 14 * u); ctx.lineTo(cx - 16 * u, cy + 4 * u); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx + 6 * u, cy - 6 * u); ctx.lineTo(cx + 30 * u, cy - 14 * u); ctx.lineTo(cx + 16 * u, cy + 4 * u); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy - 12 * u, 7 * u, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(cx, cy - 5 * u); ctx.lineTo(cx - 8 * u, cy + 16 * u); ctx.lineTo(cx + 8 * u, cy + 16 * u); ctx.closePath(); ctx.fill();
    const ly = legOff ? 4 : 0;
    ctx.lineWidth = 4 * u;
    ctx.beginPath(); ctx.moveTo(cx - 4 * u, cy + 16 * u); ctx.lineTo(cx - 7 * u, cy + (28 + ly) * u); ctx.moveTo(cx + 4 * u, cy + 16 * u); ctx.lineTo(cx + 7 * u, cy + (28 - ly) * u); ctx.stroke();
    ctx.fillStyle = clay; ctx.beginPath(); ctx.arc(cx - 2.5 * u, cy - 13 * u, 1.6 * u, 0, Math.PI * 2); ctx.fill();
  } else { // gorgon
    ctx.lineWidth = 3 * u;
    ctx.beginPath();
    for (let k = -2; k <= 2; k++) { const a = cx + k * 7 * u; ctx.moveTo(a, cy - 14 * u); ctx.quadraticCurveTo(a + (k >= 0 ? 6 : -6) * u, cy - 24 * u, a + (k >= 0 ? 2 : -2) * u, cy - 30 * u); }
    ctx.stroke();
    ctx.beginPath(); ctx.arc(cx, cy - 6 * u, 15 * u, 0, Math.PI * 2); ctx.fill();
    ctx.lineWidth = 4 * u;
    const ly = legOff ? 4 : 0;
    ctx.beginPath(); ctx.moveTo(cx - 7 * u, cy + 8 * u); ctx.lineTo(cx - 9 * u, cy + (22 + ly) * u); ctx.moveTo(cx + 7 * u, cy + 8 * u); ctx.lineTo(cx + 9 * u, cy + (22 - ly) * u); ctx.stroke();
    ctx.fillStyle = clay; ctx.lineWidth = 1.6 * u;
    ctx.beginPath(); ctx.arc(cx - 6 * u, cy - 8 * u, 3 * u, 0, Math.PI * 2); ctx.arc(cx + 6 * u, cy - 8 * u, 3 * u, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = clay; ctx.beginPath(); ctx.moveTo(cx - 6 * u, cy + 2 * u); ctx.quadraticCurveTo(cx, cy + 6 * u, cx + 6 * u, cy + 2 * u); ctx.stroke();
  }
  ctx.restore();
}

const LUM_KEYS = ['siren', 'kraken', 'harpy'];
function drawLuminous(ctx, cx, cy, S, th, isFront, word, frame) {
  const sp = LUM_KEYS[speciesIdx(word, 3)];
  const u = S / 100;
  const bob = Math.sin(frame * 0.06 + cx * 0.05) * 3;
  ctx.save();
  ctx.translate(0, bob);
  ctx.shadowColor = isFront ? '#cdeef6' : th.frontDim; ctx.shadowBlur = isFront ? 14 : 7;
  ctx.strokeStyle = isFront ? th.front : th.frontDim; ctx.lineWidth = 1.5 * u; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (sp === 'kraken') {
    ctx.beginPath(); ctx.arc(cx, cy - 8 * u, 13 * u, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = th.glowAccent; ctx.lineWidth = 1.2 * u;
    ctx.beginPath();
    [-12, -4, 4, 12].forEach((o, i) => { ctx.moveTo(cx + o * u, cy + 4 * u); ctx.quadraticCurveTo(cx + o * 1.6 * u, cy + 18 * u, cx + o * 0.8 * u + Math.sin(frame * 0.1 + i) * 4 * u, cy + 30 * u); });
    ctx.stroke();
    ctx.fillStyle = th.glowAccent;
    ctx.beginPath(); ctx.arc(cx - 5 * u, cy - 10 * u, 1.8 * u, 0, Math.PI * 2); ctx.arc(cx + 5 * u, cy - 10 * u, 1.8 * u, 0, Math.PI * 2); ctx.fill();
  } else if (sp === 'harpy') {
    ctx.beginPath(); ctx.arc(cx, cy - 14 * u, 6 * u, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx, cy - 8 * u); ctx.lineTo(cx, cy + 14 * u); ctx.stroke();
    ctx.strokeStyle = th.glowAccent; ctx.lineWidth = 1.2 * u;
    ctx.beginPath();
    ctx.moveTo(cx - 4 * u, cy - 2 * u); ctx.quadraticCurveTo(cx - 26 * u, cy - 12 * u, cx - 34 * u, cy + 2 * u);
    ctx.moveTo(cx + 4 * u, cy - 2 * u); ctx.quadraticCurveTo(cx + 26 * u, cy - 12 * u, cx + 34 * u, cy + 2 * u);
    ctx.moveTo(cx, cy + 14 * u); ctx.lineTo(cx - 8 * u, cy + 28 * u); ctx.moveTo(cx, cy + 14 * u); ctx.lineTo(cx + 8 * u, cy + 28 * u);
    ctx.stroke();
  } else { // siren
    ctx.beginPath(); ctx.arc(cx, cy - 18 * u, 5.5 * u, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 12 * u);
    ctx.quadraticCurveTo(cx - 6 * u, cy - 2 * u, cx - 2 * u + Math.sin(frame * 0.08) * 3 * u, cy + 8 * u);
    ctx.quadraticCurveTo(cx + 6 * u, cy + 18 * u, cx + Math.sin(frame * 0.08 + 1) * 4 * u, cy + 30 * u);
    ctx.stroke();
    ctx.strokeStyle = th.glowAccent; ctx.lineWidth = 1.2 * u;
    ctx.beginPath();
    ctx.moveTo(cx + 2 * u, cy + 28 * u); ctx.quadraticCurveTo(cx - 8 * u, cy + 34 * u, cx - 13 * u, cy + 27 * u);
    ctx.moveTo(cx + 2 * u, cy + 28 * u); ctx.quadraticCurveTo(cx + 12 * u, cy + 34 * u, cx + 17 * u, cy + 27 * u);
    ctx.stroke();
  }
  ctx.restore();
}

/* ─────────────────────────────────────────────────────────────
   § 8  ENEMY  — dispatches to theme renderer
───────────────────────────────────────────────────────────── */
class Enemy {
  constructor(x, y, row, word, label, frameOffset) {
    this.x = x; this.y = y; this.row = row; this.word = word; this.label = label;
    this.alive = true; this.isFront = false; this.wrongHit = 0; this._frame = frameOffset || 0;
  }
  update() { this._frame++; if (this.wrongHit > 0) this.wrongHit--; }
  draw(ctx) {
    if (!this.alive) return;
    const th = T(), cx = this.x, cy = this.y, S = 40;
    const wrong = this.wrongHit > 0;
    ctx.save();
    if (wrong) { ctx.globalAlpha = (this._frame & 2) ? 1 : 0.35; }
    if (th.enemyStyle === 'constellation') drawConstellation(ctx, cx, cy, S, th, this.isFront, this.word);
    else if (th.enemyStyle === 'blackfigure') drawBlackFigure(ctx, cx, cy, S, th, this.isFront, this.word, this._frame);
    else drawLuminous(ctx, cx, cy, S, th, this.isFront, this.word, this._frame);
    ctx.restore();

    // wrong-hit red ring
    if (wrong) { ctx.save(); ctx.strokeStyle = th.wrong; ctx.lineWidth = 2; ctx.shadowColor = th.wrong; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }

    // ── Word label ──
    ctx.save();
    ctx.font = `${this.isFront ? '600 ' : ''}${this.isFront ? 13 : 12}px "Noto Serif", serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'top';
    if (th.enemyStyle !== 'blackfigure') { ctx.shadowColor = '#000'; ctx.shadowBlur = 6; }
    ctx.fillStyle = this.isFront ? th.word : th.wordIdle;
    ctx.fillText((this.word || '').normalize('NFC'), cx, cy + CFG.ENEMY_H / 2 + 4);
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   § 9  PLAYER  — theme-skinned wielder
───────────────────────────────────────────────────────────── */
class Player {
  constructor(x, y) { this.x = x; this.y = y; this.vx = 0; this.fireCooldown = 0; this._frame = 0; this._lunge = 0; }
  lunge() { this._lunge = 8; }
  draw(ctx) {
    this._frame++;
    const th = T();
    let cx = this.x, cy = this.y, w = CFG.PLAYER_W, h = CFG.PLAYER_H;
    if (this._lunge > 0) { cy -= this._lunge; this._lunge--; }
    ctx.save();
    if (th.playerStyle === 'archer') drawArcher(ctx, cx, cy, w, h, th);
    else if (th.playerStyle === 'lyre') drawLyre(ctx, cx, cy, w, h, th, this._frame);
    else drawTrireme(ctx, cx, cy, w, h, th, this._frame);
    ctx.restore();
  }
}
function drawTrireme(ctx, cx, cy, w, h, th, frame) {
  ctx.shadowColor = th.bulletGlow; ctx.shadowBlur = 16;
  ctx.fillStyle = '#c9a44a';
  ctx.beginPath();
  ctx.moveTo(cx, cy - h * 0.5); ctx.lineTo(cx + w * 0.4, cy + h * 0.4); ctx.lineTo(cx, cy + h * 0.15); ctx.lineTo(cx - w * 0.4, cy + h * 0.4); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#a07830';
  ctx.beginPath(); ctx.moveTo(cx - w * 0.4, cy + h * 0.4); ctx.lineTo(cx - w * 0.5, cy + h * 0.5); ctx.lineTo(cx - w * 0.18, cy + h * 0.42); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + w * 0.4, cy + h * 0.4); ctx.lineTo(cx + w * 0.5, cy + h * 0.5); ctx.lineTo(cx + w * 0.18, cy + h * 0.42); ctx.closePath(); ctx.fill();
  ctx.fillStyle = '#ffe8a0'; ctx.beginPath(); ctx.ellipse(cx, cy - h * 0.05, w * 0.1, h * 0.2, 0, 0, Math.PI * 2); ctx.fill();
  const flH = 8 + Math.sin(frame * 0.4) * 4;
  const grad = ctx.createLinearGradient(cx, cy + h * 0.5, cx, cy + h * 0.5 + flH);
  grad.addColorStop(0, '#f5a642'); grad.addColorStop(1, 'rgba(245,60,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.moveTo(cx - w * 0.12, cy + h * 0.5); ctx.lineTo(cx + w * 0.12, cy + h * 0.5); ctx.lineTo(cx, cy + h * 0.5 + flH); ctx.closePath(); ctx.fill();
}
function drawArcher(ctx, cx, cy, w, h, th) {
  // black-figure archer silhouette + drawn bow
  const ink = th.ink;
  ctx.fillStyle = ink; ctx.strokeStyle = ink; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 4;
  ctx.beginPath(); ctx.arc(cx + 6, cy - h * 0.42, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(cx + 6, cy - h * 0.25); ctx.lineTo(cx + 4, cy + h * 0.1); ctx.lineTo(cx - 4, cy + h * 0.45); ctx.moveTo(cx + 4, cy + h * 0.1); ctx.lineTo(cx + 14, cy + h * 0.35); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(cx + 6, cy - h * 0.16); ctx.lineTo(cx - 12, cy - h * 0.05); ctx.stroke();
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(cx - 14, cy - h * 0.42); ctx.quadraticCurveTo(cx - 26, cy, cx - 14, cy + h * 0.42); ctx.stroke();
  ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(cx - 14, cy - h * 0.42); ctx.lineTo(cx - 2, cy); ctx.lineTo(cx - 14, cy + h * 0.42); ctx.stroke();
}
function drawLyre(ctx, cx, cy, w, h, th, frame) {
  ctx.strokeStyle = th.glowAccent; ctx.shadowColor = th.bulletGlow; ctx.shadowBlur = 12;
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 14, cy + h * 0.4); ctx.quadraticCurveTo(cx - 20, cy, cx - 12, cy - h * 0.5);
  ctx.moveTo(cx + 14, cy + h * 0.4); ctx.quadraticCurveTo(cx + 20, cy, cx + 12, cy - h * 0.5);
  ctx.moveTo(cx - 16, cy - h * 0.3); ctx.quadraticCurveTo(cx, cy - h * 0.4, cx + 16, cy - h * 0.3);
  ctx.moveTo(cx - 14, cy + h * 0.4); ctx.quadraticCurveTo(cx, cy + h * 0.55, cx + 14, cy + h * 0.4);
  ctx.stroke();
  ctx.lineWidth = 1; ctx.globalAlpha = 0.7;
  ctx.beginPath();
  for (let i = -2; i <= 2; i++) { ctx.moveTo(cx + i * 5, cy - h * 0.32); ctx.lineTo(cx + i * 5, cy + h * 0.4); }
  ctx.stroke();
}

/* ─────────────────────────────────────────────────────────────
   § 10  GAME
───────────────────────────────────────────────────────────── */
class Game {
  constructor(canvas, scoreEl) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d'); this.scoreEl = scoreEl;
    this.keys = {}; this.touch = { left: false, right: false, fire: false };
    this.rafId = null; this.lastTime = performance.now();
    this.score = 0; this.lives = 3; this.levelIndex = 0; this.state = 'playing'; this.lvlTimer = 0;
    this.shakeFrames = 0; this.errorFlash = 0;
    this.currentTargetLabel = null; this.streak = 0; this.questionPulse = 0;
    this.popups = [];
    this.stars = []; this.motes = []; this.particles = []; this.projectiles = []; this.enemies = []; this.player = null;
    this.enemyDir = 1; this.enemyMult = 1;
    this._kd = this._onKeyDown.bind(this); this._ku = this._onKeyUp.bind(this); this._rz = this._onResize.bind(this);
    window.addEventListener('keydown', this._kd); window.addEventListener('keyup', this._ku); window.addEventListener('resize', this._rz);
    this._bindTouch(); this._onResize(); this._initLevel();
    this.rafId = requestAnimationFrame(ts => this._loop(ts));
  }

  _bindTouch() {
    const bar = document.getElementById('invaders-touch'); if (!bar) return;
    this._touchDown = (e) => {
      const btn = e.target.closest('[data-tc]'); if (!btn) return; e.preventDefault();
      const key = btn.dataset.tc; if (key in this.touch) this.touch[key] = true;
      if (key === 'fire' && this.state === 'gameover') { this.score = 0; this.lives = 3; this.levelIndex = 0; this.enemyMult = 1; this._initLevel(); }
    };
    this._touchUp = (e) => { const btn = e.target.closest('[data-tc]'); if (btn && btn.dataset.tc in this.touch) this.touch[btn.dataset.tc] = false; };
    this._touchCancel = () => { this.touch.left = false; this.touch.right = false; this.touch.fire = false; };
    bar.addEventListener('touchstart', this._touchDown, { passive: false });
    bar.addEventListener('touchend', this._touchUp, { passive: false });
    bar.addEventListener('touchcancel', this._touchCancel);
    bar.addEventListener('mousedown', this._touchDown); bar.addEventListener('mouseup', this._touchUp);
    this._touchBar = bar;
  }

  _onResize() {
    const wrap = document.getElementById('invaders-wrap'); if (!wrap) return;
    const r = wrap.getBoundingClientRect();
    this.canvas.width = Math.floor(r.width) || window.innerWidth;
    this.canvas.height = Math.floor(r.height) || (window.innerHeight - 60);
    this.stars = Array.from({ length: CFG.STARS }, () => new Star(this.canvas.width, this.canvas.height));
    this.motes = Array.from({ length: 42 }, () => new Mote(this.canvas.width, this.canvas.height));
    if (this.player) { this.player.x = this.canvas.width / 2; this.player.y = this.canvas.height - 60; }
  }

  _activeDB() {
    return (window._gpInvadersDB && window._gpInvadersDB.length) ? window._gpInvadersDB : INVADERS_DB;
  }

  _initLevel() {
    const W = this.canvas.width, H = this.canvas.height;
    const db = this._activeDB();
    const level = db[this.levelIndex % db.length];
    const entries = level.entries; const cols = CFG.COLS, rows = CFG.ROWS;
    const gridW = cols * CFG.ENEMY_W + (cols - 1) * CFG.ENEMY_GAP_X;
    const startX = (W - gridW) / 2 + CFG.ENEMY_W / 2;
    this.enemies = [];
    for (let r = 0; r < rows; r++) {
      const rowEntries = shuffle([...entries]);
      for (let c = 0; c < cols; c++) {
        const { word, label } = rowEntries[c % rowEntries.length];
        this.enemies.push(new Enemy(startX + c * (CFG.ENEMY_W + CFG.ENEMY_GAP_X), CFG.ENEMY_TOP + r * CFG.ENEMY_GAP_Y, r, word, label, randInt(0, 15)));
      }
    }
    this.player = new Player(W / 2, H - 60);
    this.projectiles = []; this.particles = []; this.popups = [];
    this.enemyDir = 1; this.enemyMult = 1 + this.levelIndex * 0.3;
    this.state = 'playing'; this.streak = 0; this.questionPulse = 0;
    this._updateFrontRow(); this._pickQuestion(); this._updateHUD();
  }

  _getFrontRow() { let m = -1; this.enemies.forEach(e => { if (e.alive) m = Math.max(m, e.row); }); return m; }
  _getFrontRowEnemies() { const fr = this._getFrontRow(); return fr < 0 ? [] : this.enemies.filter(e => e.alive && e.row === fr); }
  _updateFrontRow() { const fr = this._getFrontRow(); this.enemies.forEach(e => { e.isFront = e.alive && e.row === fr; }); }
  _pickQuestion() { const fr = this._getFrontRowEnemies(); if (!fr.length) { this.currentTargetLabel = null; return; } this.currentTargetLabel = fr[randInt(0, fr.length - 1)].label; this.questionPulse = 0; }
  _refreshQuestion() {
    const fr = this._getFrontRowEnemies();
    if (!fr.length) { if (this.enemies.some(e => e.alive)) { this._updateFrontRow(); this._pickQuestion(); } else this.currentTargetLabel = null; return; }
    if (!fr.some(e => e.label === this.currentTargetLabel)) this._pickQuestion();
  }

  _onKeyDown(e) {
    this.keys[e.code] = true; if (e.code === 'Space') e.preventDefault();
    if (e.code === 'Enter' && this.state === 'gameover') { this.score = 0; this.lives = 3; this.levelIndex = 0; this.enemyMult = 1; this._initLevel(); }
  }
  _onKeyUp(e) { this.keys[e.code] = false; }

  _updateHUD() { if (this.scoreEl) this.scoreEl.textContent = `Score: ${this.score} | Lives: ${'♥'.repeat(Math.max(0, this.lives))}`; }

  _loop(ts) { this.rafId = requestAnimationFrame(t => this._loop(t)); const dt = Math.min((ts - this.lastTime) / 1000, 0.05); this.lastTime = ts; this._update(dt); this._draw(); }

  _update(dt) {
    this.stars.forEach(s => s.update(dt));
    this.motes.forEach(m => m.update(dt));
    this.particles = this.particles.filter(p => p.update(dt));
    this.popups = this.popups.filter(sp => { sp.y -= 45 * dt; sp.life -= dt; return sp.life > 0; });
    if (this.state === 'gameover') return;
    if (this.state === 'levelup') { this.lvlTimer -= dt; if (this.lvlTimer <= 0) { this.levelIndex++; this._initLevel(); } return; }
    const W = this.canvas.width, H = this.canvas.height;
    this.questionPulse += dt * 2.2;
    const p = this.player; p.vx = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touch.left) p.vx = -CFG.PLAYER_SPEED;
    if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.touch.right) p.vx = CFG.PLAYER_SPEED;
    p.x = Math.max(CFG.PLAYER_W / 2, Math.min(W - CFG.PLAYER_W / 2, p.x + p.vx * dt));
    p.fireCooldown = Math.max(0, p.fireCooldown - dt * 1000);
    if ((this.keys['Space'] || this.touch.fire) && p.fireCooldown === 0) { this.projectiles.push(new Projectile(p.x, p.y - CFG.PLAYER_H / 2)); p.lunge(); sfxShoot(); p.fireCooldown = CFG.FIRE_COOLDOWN; }
    this.projectiles.forEach(b => b.update(dt)); this.projectiles = this.projectiles.filter(b => b.alive);
    if (this.shakeFrames > 0) this.shakeFrames--; if (this.errorFlash > 0) this.errorFlash--;
    this.enemies.forEach(e => { if (e.alive) e.update(); });
    const alive = this.enemies.filter(e => e.alive);
    if (!alive.length) { this._doLevelUp(); return; }
    const speed = CFG.BASE_SPD * this.enemyMult;
    let minX = Infinity, maxX = -Infinity;
    alive.forEach(e => { minX = Math.min(minX, e.x - CFG.ENEMY_W / 2); maxX = Math.max(maxX, e.x + CFG.ENEMY_W / 2); });
    if ((this.enemyDir === 1 && maxX >= W - 8) || (this.enemyDir === -1 && minX <= 8)) { this.enemyDir *= -1; alive.forEach(e => { e.y += CFG.DROP_AMOUNT; }); }
    const descent = CFG.DESCENT_SPD * this.enemyMult;
    alive.forEach(e => { e.x += speed * this.enemyDir * dt; e.y += descent * dt; });
    outer:
    for (const bullet of this.projectiles) {
      if (!bullet.alive) continue;
      for (const enemy of this.enemies) {
        if (!enemy.alive) continue; if (enemy.wrongHit > 0) continue;
        const dx = Math.abs(bullet.x - enemy.x), dy = Math.abs(bullet.y - enemy.y);
        if (dx < CFG.ENEMY_W / 2 + 2 && dy < CFG.ENEMY_H / 2 + 12) {
          bullet.alive = false;
          if (enemy.label === this.currentTargetLabel) {
            enemy.alive = false; const pts = 100 + this.streak * 50; this.score += pts; this.streak++;
            sfxHit(); this._spawnParticles(enemy.x, enemy.y, true);
            this.popups.push({ x: enemy.x, y: enemy.y - 10, text: `+${pts}`, life: 1.2, color: '#5ef578' });
            this.enemyMult += 0.05; this._updateFrontRow(); this._refreshQuestion(); this._updateHUD(); this._checkLevelComplete();
          } else {
            enemy.wrongHit = 20; this.streak = 0;
            this.popups.push({ x: enemy.x, y: enemy.y - 10, text: 'Λάθος!', life: 1.0, color: '#ff5e5e' });
            this._loseLife(); if (this.state === 'gameover') return;
          }
          continue outer;
        }
      }
    }
    for (const enemy of alive) {
      if (!enemy.alive) continue;
      if (enemy.y + CFG.ENEMY_H / 2 > H - 48) {
        enemy.alive = false; this._spawnParticles(enemy.x, enemy.y, false); this.streak = 0;
        this._loseLife(); if (this.state === 'gameover') return;
        this._updateFrontRow(); this._refreshQuestion(); this._updateHUD(); this._checkLevelComplete();
      }
    }
  }

  _loseLife() { this.lives = Math.max(0, this.lives - 1); sfxError(); this.shakeFrames = CFG.SHAKE_FRAMES; this.errorFlash = 10; this._updateHUD(); if (this.lives === 0) { this.state = 'gameover'; this.shakeFrames = 0; this.errorFlash = 0; if(typeof awardGameRewards==='function' && this.score > 0){ awardGameRewards('invaders', { score: this.score, perfect: false }); } } }
  _checkLevelComplete() { if (!this.enemies.some(e => e.alive)) this._doLevelUp(); }
  _doLevelUp() {
    sfxLevelUp();
    if (typeof awardGameRewards === 'function' && this.score > 0) {
      awardGameRewards('invaders', { score: this.score, perfect: this.lives === 3 });
    }
    this.state = 'levelup'; this.lvlTimer = 2.6; this.enemies.filter(e => e.alive).forEach(e => { e.alive = false; this._spawnParticles(e.x, e.y, true); });
  }
  _spawnParticles(x, y, ok) {
    const th = T(); const palette = ok ? th.spark : th.sparkBad; const shard = th.enemyStyle === 'blackfigure';
    const n = 10 + randInt(0, 5);
    for (let i = 0; i < n; i++) this.particles.push(new Particle(x, y, palette[i % palette.length], shard));
  }

  /* ── Draw ── */
  _draw() {
    const th = T(), { ctx, canvas: { width: W, height: H } } = this;
    let sx = 0, sy = 0;
    if (this.shakeFrames > 0 && this.state !== 'gameover') { sx = rand(-CFG.SHAKE_MAG, CFG.SHAKE_MAG); sy = rand(-CFG.SHAKE_MAG, CFG.SHAKE_MAG); }
    ctx.save(); ctx.translate(sx, sy);
    this._drawBackground(th, W, H);

    if (this.errorFlash > 0) { ctx.save(); ctx.globalAlpha = (this.errorFlash / 10) * 0.28; ctx.fillStyle = '#ff2020'; ctx.fillRect(0, 0, W, H); ctx.restore(); }
    if (this.state !== 'gameover') this._drawQuestionPanel(W);

    this.enemies.forEach(e => e.draw(ctx));

    if (this.state === 'playing') {
      ctx.save(); ctx.strokeStyle = th.danger; ctx.lineWidth = 1; ctx.setLineDash([6, 6]);
      ctx.beginPath(); ctx.moveTo(0, H - 48); ctx.lineTo(W, H - 48); ctx.stroke(); ctx.restore();
    }
    this.projectiles.forEach(b => b.draw(ctx));
    if (this.player && this.state !== 'gameover') this.player.draw(ctx);
    this.particles.forEach(p => p.draw(ctx));
    this._drawPopups(ctx);
    if (this.state === 'levelup') this._drawLevelUp(W, H);
    if (this.state === 'gameover') this._drawGameOver(W, H);
    ctx.restore();
  }

  _drawBackground(th, W, H) {
    const ctx = this.ctx;
    // base gradient
    let g;
    if (th.bgFrom === 'bottom') g = ctx.createRadialGradient(W / 2, H * 1.1, 40, W / 2, H * 1.1, Math.max(W, H));
    else g = ctx.createRadialGradient(W / 2, -H * 0.1, 40, W / 2, H * 0.2, Math.max(W, H));
    g.addColorStop(0, th.bg[0]); g.addColorStop(0.45, th.bg[1]); g.addColorStop(1, th.bg[2]);
    ctx.fillStyle = g; ctx.fillRect(-CFG.SHAKE_MAG - 1, -CFG.SHAKE_MAG - 1, W + CFG.SHAKE_MAG * 2 + 2, H + CFG.SHAKE_MAG * 2 + 2);

    if (th.nebula) {
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      const blob = (x, y, r, col) => { const rg = ctx.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, col); rg.addColorStop(1, 'transparent'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); };
      blob(W * 0.18, H * 0.2, 200, 'rgba(80,130,160,0.14)');
      blob(W * 0.82, H * 0.7, 230, 'rgba(196,164,72,0.08)');
      ctx.restore();
    }
    if (th.stars) this.stars.forEach(s => s.draw(ctx));
    if (th.rays) {
      ctx.save(); ctx.globalCompositeOperation = 'screen';
      const t = performance.now() * 0.0004;
      [0.2, 0.55, 0.8].forEach((fx, i) => {
        const x = W * fx, sway = Math.sin(t + i) * 40;
        const rg = ctx.createLinearGradient(x, 0, x + sway, H);
        rg.addColorStop(0, 'rgba(150,210,225,0.10)'); rg.addColorStop(0.7, 'transparent');
        ctx.fillStyle = rg; ctx.beginPath(); ctx.moveTo(x - 40, 0); ctx.lineTo(x + 40, 0); ctx.lineTo(x + 90 + sway, H); ctx.lineTo(x - 90 + sway, H); ctx.closePath(); ctx.fill();
      });
      ctx.restore();
    }
    if (th.motes) this.motes.forEach(m => m.draw(ctx));
    if (th.meander) this._drawMeander(th, W, H);
  }

  _drawMeander(th, W, H) {
    const ctx = this.ctx; ctx.save();
    ctx.strokeStyle = th.ink; ctx.globalAlpha = 0.85; ctx.lineWidth = 2.4; ctx.lineCap = 'square';
    const unit = 20, draw = (y, flip) => {
      ctx.save(); ctx.translate(0, y); if (flip) ctx.scale(1, -1);
      for (let x = 0; x < W + unit; x += unit) { ctx.beginPath(); ctx.moveTo(x + 1, 19); ctx.lineTo(x + 1, 3); ctx.lineTo(x + 15, 3); ctx.lineTo(x + 15, 15); ctx.lineTo(x + 7, 15); ctx.lineTo(x + 7, 9); ctx.lineTo(x + 11, 9); ctx.stroke(); }
      ctx.restore();
    };
    draw(74, false);            // below the question panel
    draw(H - 4, true);          // bottom
    ctx.globalAlpha = 0.5; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(18, H - 48); ctx.lineTo(W - 18, H - 48); ctx.stroke();
    // soft inner vignette of fired clay
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'multiply';
    const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.3, W / 2, H / 2, H * 0.8);
    vg.addColorStop(0, 'transparent'); vg.addColorStop(1, 'rgba(60,28,10,0.4)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  _drawQuestionPanel(W) {
    const th = T(), ctx = this.ctx;
    const db = this._activeDB();
    const level = db[this.levelIndex % db.length];
    const label = (this.currentTargetLabel || '—').normalize('NFC');
    const panelH = 68;
    ctx.save();
    ctx.fillStyle = th.panelBg; ctx.fillRect(0, 0, W, panelH);
    ctx.strokeStyle = th.panelLine; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0, panelH); ctx.lineTo(W, panelH); ctx.stroke();
    ctx.font = '11px "Inter", sans-serif'; ctx.fillStyle = th.panelKey; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText(`Επίπεδο ${this.levelIndex + 1}`, 14, 10);
    ctx.font = '12px "Noto Serif", serif'; ctx.fillStyle = th.panelTitle; ctx.fillText(level.title.normalize('NFC'), 14, 26);
    ctx.font = '12px "Inter", sans-serif'; ctx.fillStyle = th.prompt; ctx.textAlign = 'center'; ctx.fillText('Πυροβόλησε:', W / 2, 8);
    const pulse = 0.84 + Math.sin(this.questionPulse) * 0.16;
    ctx.globalAlpha = pulse; ctx.font = `600 ${Math.min(28, W * 0.055)}px "Noto Serif", serif`; ctx.fillStyle = th.label;
    ctx.shadowColor = th.labelGlow; ctx.shadowBlur = 14; ctx.textAlign = 'center';
    ctx.fillText(label, W / 2, 30); ctx.globalAlpha = 1; ctx.shadowBlur = 0;
    if (this.streak > 1) {
      ctx.font = '600 13px "Inter", sans-serif'; ctx.fillStyle = '#5ef578'; ctx.textAlign = 'right'; ctx.fillText(`×${this.streak} σερί`, W - 14, 10);
      ctx.font = '10px "Inter", sans-serif'; ctx.fillStyle = '#3a8e50'; ctx.fillText(`+${this.streak * 50} bonus`, W - 14, 26);
    }
    ctx.restore();
  }

  _drawPopups(ctx) {
    this.popups.forEach(sp => {
      ctx.save(); ctx.globalAlpha = Math.min(1, sp.life * 1.5);
      ctx.font = '600 15px "Inter", sans-serif'; ctx.fillStyle = sp.color; ctx.textAlign = 'center';
      ctx.shadowColor = sp.color; ctx.shadowBlur = 8; ctx.fillText(sp.text.normalize('NFC'), sp.x, sp.y); ctx.restore();
    });
  }

  _drawLevelUp(W, H) {
    const th = T(), ctx = this.ctx; ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H);
    const grad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, 180);
    grad.addColorStop(0, 'rgba(94,245,120,0.16)'); grad.addColorStop(1, 'rgba(94,245,120,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center'; ctx.fillStyle = '#5ef578';
    ctx.font = `600 ${Math.min(52, W * 0.1)}px "Cormorant Garamond","Noto Serif",serif`; ctx.shadowColor = '#5ef578'; ctx.shadowBlur = 20;
    ctx.fillText('Επίπεδο', W / 2, H / 2 - 24); ctx.fillText('Ολοκληρώθηκε!', W / 2, H / 2 + 34); ctx.shadowBlur = 0;
    ctx.font = '17px "Noto Serif",serif'; ctx.fillStyle = '#c9a44a'; ctx.fillText(`Επόμενο: Επίπεδο ${this.levelIndex + 2}`, W / 2, H / 2 + 72);
    ctx.restore();
  }

  _drawGameOver(W, H) {
    const ctx = this.ctx; ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.78)'; ctx.fillRect(0, 0, W, H); ctx.textAlign = 'center'; ctx.fillStyle = '#ff5e5e';
    ctx.font = `600 ${Math.min(60, W * 0.12)}px "Cormorant Garamond","Noto Serif",serif`; ctx.shadowColor = '#ff2020'; ctx.shadowBlur = 22;
    ctx.fillText('GAME OVER', W / 2, H / 2 - 36); ctx.shadowBlur = 0;
    ctx.font = '22px "Noto Serif",serif'; ctx.fillStyle = '#e8dcc8'; ctx.fillText(`Τελικό Σκορ: ${this.score}`, W / 2, H / 2 + 14);
    ctx.font = '15px "Inter",sans-serif'; ctx.fillStyle = '#c9a44a';
    const hint = (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) ? 'Πάτα ⚡ ΠΥΡΑ για επανεκκίνηση' : 'Πάτα Enter για επανεκκίνηση';
    ctx.fillText(hint, W / 2, H / 2 + 52); ctx.restore();
  }

  destroy() {
    if (this.rafId) { cancelAnimationFrame(this.rafId); this.rafId = null; }
    window.removeEventListener('keydown', this._kd); window.removeEventListener('keyup', this._ku); window.removeEventListener('resize', this._rz);
    if (this._touchBar) {
      this._touchBar.removeEventListener('touchstart', this._touchDown); this._touchBar.removeEventListener('touchend', this._touchUp);
      this._touchBar.removeEventListener('touchcancel', this._touchCancel); this._touchBar.removeEventListener('mousedown', this._touchDown); this._touchBar.removeEventListener('mouseup', this._touchUp);
    }
  }
}

/* ─────────────────────────────────────────────────────────────
   § 11  PUBLIC API  (unchanged signatures)
───────────────────────────────────────────────────────────── */
let _instance = null;
window.openInvaders = function () {
  const overlay = document.getElementById('invaders-overlay'); if (!overlay) return;
  overlay.style.display = 'flex';
  const touchBar = document.getElementById('invaders-touch');
  if (touchBar) { const hasTouch = navigator.maxTouchPoints > 0 || 'ontouchstart' in window; touchBar.style.display = hasTouch ? 'flex' : 'none'; }
  if (typeof orientHint !== 'undefined') orientHint.request();
  if (_instance) { _instance.destroy(); _instance = null; }
  requestAnimationFrame(() => requestAnimationFrame(() => {
    const canvas = document.getElementById('invaders-canvas');
    const scoreEl = document.getElementById('invaders-score-display');
    _instance = new Game(canvas, scoreEl);
  }));
};
window.closeInvaders = function () {
  const overlay = document.getElementById('invaders-overlay'); if (overlay) overlay.style.display = 'none';
  if (_instance) { _instance.destroy(); _instance = null; }
  if (typeof orientHint !== 'undefined') orientHint.release();
  window._gpInvadersDB = null;
};

})();
