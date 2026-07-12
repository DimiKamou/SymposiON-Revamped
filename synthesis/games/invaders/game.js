/* ═══════════════════════════════════════════════════════════════════
   Grammar Invaders  ·  REIMAGINED  ·  Core Engine v3
   Drop-in replacement for games/invaders/game.js

   Same engine & mechanic as v2 (front-row word options; shoot the form
   the question names). ONLY the rendering layer is re-skinned into four
   art directions, switchable at runtime:

     'arcade'   Α · Φωσφόρος     — phosphor-CRT pixel fleet (chunky sprites)
     'nyx'      Β · Νυκτομαχία   — constellation fleet on a night sky
     'melan'    Γ · Μελανόμορφος — black-figure frieze on terracotta
     'abyssos'  Δ · Ἄβυσσος      — luminous creatures in the deep

   Switch with:  window.setInvadersTheme('melan')   (persists to localStorage)
   Default theme read from localStorage('invadersTheme') || 'arcade'.

   Depends on: games/invaders/data.js  (INVADERS_DB)
   CONTROLS:  ←/→ or A/D = move · Space = shoot · Enter = restart
═══════════════════════════════════════════════════════════════════ */
(function () {
'use strict';

/* ─────────────────────────────────────────────────────────────
   § 0  THEMES  — the only thing that changes the look
───────────────────────────────────────────────────────────── */
const THEMES = {
  arcade: {
    bg: ['#141c30', '#0a0e1c', '#04060c'],   // deep-space navy
    stars: true, nebula: true, rays: false, meander: false,
    enemyStyle: 'pixel',
    playerStyle: 'cannon',
    bulletStyle: 'pixel',
    front: '#7dffa0', frontDim: '#2fae5f', idle: '#3d6653',
    word: '#b6ffd0', wordIdle: '#8296a8',
    bullet: '#8dff7a', bulletGlow: '#5ef578',
    accent: '#ffd166',
    spark: ['#8dffb0', '#ffd166', '#7fd4ff', '#ffffff'],
    sparkBad: ['#ff6b6b', '#ff9a6e', '#ffd166', '#ffffff'],
    panelBg: 'rgba(5,9,16,0.92)', panelLine: 'rgba(94,245,120,0.35)',
    panelKey: '#5c7d8f', panelTitle: '#7fd4ff', prompt: '#86a0b2', label: '#8dffb0', labelGlow: '#2fae5f',
    danger: 'rgba(94,245,120,0.22)', wrong: '#ff5e5e',
  },
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
  try { return localStorage.getItem('invadersTheme') || 'arcade'; } catch (_) { return 'arcade'; }
})();
if (!THEMES[THEME_NAME]) THEME_NAME = 'arcade';
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
// Display labels for the overlay theme button (Greek — acute accents only)
window.INVADERS_THEME_LABELS = {
  arcade: '▚ Φωσφόρος',
  nyx: '✦ Νυκτομαχία',
  melan: '⚱ Μελανόμορφος',
  abyssos: '≈ Ἄβυσσος',
};

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
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
const easeOutBack = (t) => { const c = 1.7; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
// Honour the OS "reduce motion" preference for the big ambient loops.
const _rmq = (typeof window.matchMedia === 'function') ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
const REDUCED = () => !!(_rmq && _rmq.matches);
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

// nyx — slow drifting nebula cloud (soft, additive)
class Nebula {
  constructor(W, H, col) {
    this.W = W; this.H = H; this.col = col;
    this.x = rand(0, W); this.y = rand(0, H * 0.7);
    this.r = rand(120, 240); this.vx = rand(-4, 4); this.vy = rand(-2, 2);
    this.ph = rand(0, Math.PI * 2);
  }
  update(dt) {
    this.ph += dt * 0.25;
    this.x += this.vx * dt; this.y += this.vy * dt;
    if (this.x < -this.r) this.x = this.W + this.r; if (this.x > this.W + this.r) this.x = -this.r;
    if (this.y < -this.r) this.y = this.H + this.r; if (this.y > this.H + this.r) this.y = -this.r;
  }
  draw(ctx) {
    const a = 0.5 + 0.5 * Math.sin(this.ph);
    const rg = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
    rg.addColorStop(0, this.col.replace('A', (0.10 + 0.05 * a).toFixed(3)));
    rg.addColorStop(1, this.col.replace('A', '0'));
    ctx.fillStyle = rg; ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fill();
  }
}

// nyx — rare shooting star streak
class ShootingStar {
  constructor(W, H) { this.W = W; this.H = H; this._reset(); }
  _reset() {
    this.active = false; this.delay = rand(3, 9);
    this.x = rand(this.W * 0.1, this.W * 0.7); this.y = rand(-20, this.H * 0.35);
    const ang = rand(Math.PI * 0.15, Math.PI * 0.32);
    this.vx = Math.cos(ang) * 520; this.vy = Math.sin(ang) * 520; this.life = 0;
  }
  update(dt) {
    if (!this.active) { this.delay -= dt; if (this.delay <= 0) { this.active = true; this.life = 1; } return; }
    this.x += this.vx * dt; this.y += this.vy * dt; this.life -= dt * 0.9;
    if (this.life <= 0 || this.x > this.W + 40 || this.y > this.H + 40) this._reset();
  }
  draw(ctx) {
    if (!this.active) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    const tx = this.x - this.vx * 0.055, ty = this.y - this.vy * 0.055;
    const g = ctx.createLinearGradient(this.x, this.y, tx, ty);
    g.addColorStop(0, `rgba(230,244,255,${clamp(this.life, 0, 1)})`); g.addColorStop(1, 'rgba(230,244,255,0)');
    ctx.strokeStyle = g; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(this.x, this.y); ctx.lineTo(tx, ty); ctx.stroke();
    ctx.fillStyle = `rgba(255,255,255,${clamp(this.life, 0, 1)})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, 1.6, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

// expanding shockwave ring on a correct kill (stage 2 + optional delayed stage 3)
class Shockwave {
  constructor(x, y, color, opts) {
    opts = opts || {};
    this.x = x; this.y = y; this.color = color; this.t = 0;
    this.dur = opts.dur || 0.5; this.maxR = opts.maxR || 46;
    this.delay = opts.delay || 0; this.lw = opts.lw || 2;
  }
  update(dt) {
    if (this.delay > 0) { this.delay -= dt; return true; }
    this.t += dt / this.dur; return this.t < 1;
  }
  draw(ctx) {
    if (this.delay > 0) return;
    const e = easeOutCubic(clamp(this.t, 0, 1));
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    ctx.globalAlpha = (1 - this.t) * 0.85;
    ctx.strokeStyle = this.color; ctx.lineWidth = this.lw + (1 - this.t) * 2.5;
    ctx.beginPath(); ctx.arc(this.x, this.y, 6 + e * this.maxR, 0, Math.PI * 2); ctx.stroke();
    ctx.globalAlpha = (1 - this.t) * 0.4; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(this.x, this.y, 2 + e * this.maxR * 0.55, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }
}

// stage-1 explosion core: brief additive bloom at the kill point
class KillFlash {
  constructor(x, y, color) { this.x = x; this.y = y; this.color = color; this.t = 0; this.dur = 0.24; }
  update(dt) { this.t += dt / this.dur; return this.t < 1; }
  draw(ctx) {
    const k = 1 - clamp(this.t, 0, 1);
    const r = 5 + easeOutCubic(clamp(this.t, 0, 1)) * 30;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = k;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, r);
    g.addColorStop(0, 'rgba(255,255,255,0.95)');
    g.addColorStop(0.4, this.color);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(this.x, this.y, r, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   § 5  PARTICLE
───────────────────────────────────────────────────────────── */
class Particle {
  constructor(x, y, color, shard, opts) {
    opts = opts || {};
    const spd = opts.spd || 1;
    this.x = x; this.y = y;
    this.vx = rand(-130, 130) * spd; this.vy = rand(-160, 30) * spd;
    this.life = 1; this.decay = rand(0.028, 0.065); this.r = rand(1.5, 4.5); this.color = color;
    this.shard = shard; this.rot = rand(0, Math.PI); this.vr = rand(-6, 6);
    this.glow = !!opts.glow;      // additive spark (laser/energy debris)
    this.grav = opts.grav == null ? 110 : opts.grav;
  }
  update(dt) { this.x += this.vx * dt; this.y += this.vy * dt; this.vy += this.grav * dt; this.vx *= 0.985; this.rot += this.vr * dt; this.life -= this.decay; return this.life > 0; }
  draw(ctx) {
    ctx.save(); ctx.globalAlpha = Math.max(0, this.life); ctx.fillStyle = this.color;
    if (this.glow) { ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = this.color; ctx.shadowBlur = 8; }
    if (this.shard) { ctx.translate(this.x, this.y); ctx.rotate(this.rot); ctx.fillRect(-this.r, -this.r, this.r * 2, this.r * 2); }
    else { ctx.beginPath(); ctx.arc(this.x, this.y, this.r * (this.glow ? this.life * 0.6 + 0.4 : 1), 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
}

/* ─────────────────────────────────────────────────────────────
   § 6  PROJECTILE  — theme-skinned
───────────────────────────────────────────────────────────── */
class Projectile {
  constructor(x, y) { this.x = x; this.y = y; this.py = y; this.alive = true; this.born = performance.now(); }
  update(dt) { this.py = this.y; this.y -= CFG.BULLET_SPEED * dt; if (this.y < -16) this.alive = false; }
  draw(ctx) {
    const th = T();
    // ── laser bloom trail (additive; skipped for the ink-arrow theme) ──
    if (th.bulletStyle !== 'arrow') {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      const g = ctx.createLinearGradient(this.x, this.y - 4, this.x, this.py + 22);
      g.addColorStop(0, th.bulletGlow); g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.strokeStyle = g; ctx.lineWidth = th.bulletStyle === 'wave' ? 3 : 2.5; ctx.lineCap = 'round';
      ctx.globalAlpha = 0.5;
      ctx.beginPath(); ctx.moveTo(this.x, this.y - 4); ctx.lineTo(this.x, this.py + 22); ctx.stroke();
      ctx.restore();
    }
    ctx.save();
    if (th.bulletStyle === 'arrow') {
      ctx.strokeStyle = th.bullet; ctx.fillStyle = th.bullet; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(this.x, this.y - 12); ctx.lineTo(this.x, this.y + 6); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(this.x, this.y - 14); ctx.lineTo(this.x - 4, this.y - 7); ctx.lineTo(this.x + 4, this.y - 7); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 0.6;
      ctx.beginPath(); ctx.moveTo(this.x, this.y + 6); ctx.lineTo(this.x - 3, this.y + 1); ctx.moveTo(this.x, this.y + 6); ctx.lineTo(this.x + 3, this.y + 1); ctx.stroke();
    } else if (th.bulletStyle === 'pixel') {
      // chunky zigzag bolt — classic CRT zap
      ctx.shadowColor = th.bulletGlow; ctx.shadowBlur = 9; ctx.fillStyle = th.bullet;
      for (let i = 0; i < 4; i++) ctx.fillRect(this.x - 2 + ((i & 1) ? 1.5 : -1.5), this.y - 14 + i * 3.5, 4, 3);
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

/* ── 'arcade' theme: chunky phosphor pixel sprites ──────────
   Bitmaps: 'X' = body pixel, 'o' = accent pixel (eyes / tip).
   Two walk frames each; eyes blink on a desynced timer.      */
const PIX = {
  crab: [[
    '..X.....X..',
    '...X...X...',
    '..XXXXXXX..',
    '.XXoXXXoXX.',
    'XXXXXXXXXXX',
    'X.XXXXXXX.X',
    'X.X.....X.X',
    '...XX.XX...',
  ], [
    '..X.....X..',
    'X..X...X..X',
    'X.XXXXXXX.X',
    'XXXoXXXoXXX',
    'XXXXXXXXXXX',
    '.XXXXXXXXX.',
    '..X.....X..',
    '.X.......X.',
  ]],
  squid: [[
    '...XX...',
    '..XXXX..',
    '.XXXXXX.',
    'XXoXXoXX',
    'XXXXXXXX',
    '..X..X..',
    '.X.XX.X.',
    'X.X..X.X',
  ], [
    '...XX...',
    '..XXXX..',
    '.XXXXXX.',
    'XXoXXoXX',
    'XXXXXXXX',
    '.X.XX.X.',
    'X......X',
    '.X....X.',
  ]],
  octo: [[
    '....XXXX....',
    '.XXXXXXXXXX.',
    'XXXXXXXXXXXX',
    'XXXooXXooXXX',
    'XXXXXXXXXXXX',
    '...XX..XX...',
    '..XX.XX.XX..',
    'XX........XX',
  ], [
    '....XXXX....',
    '.XXXXXXXXXX.',
    'XXXXXXXXXXXX',
    'XXXooXXooXXX',
    'XXXXXXXXXXXX',
    '..XXX..XXX..',
    '.XX..XX..XX.',
    '..XX....XX..',
  ]],
};
const PIX_KEYS = ['crab', 'squid', 'octo'];
const _pixCache = {};
function _pixSprite(sp, f, isFront, blink, th) {
  const key = `${THEME_NAME}|${sp}|${f}|${isFront ? 1 : 0}|${blink ? 1 : 0}`;
  let c = _pixCache[key];
  if (c) return c;
  const grid = PIX[sp][f];
  const px = 3, pad = 8;
  c = document.createElement('canvas');
  c.width = grid[0].length * px + pad * 2;
  c.height = grid.length * px + pad * 2;
  const g = c.getContext('2d');
  const body = isFront ? th.front : th.idle;
  const eye = blink ? body : (isFront ? (th.accent || '#ffd166') : 'rgba(255,209,102,0.4)');
  if (isFront) { g.shadowColor = th.front; g.shadowBlur = 7; }
  for (let r = 0; r < grid.length; r++) {
    for (let col = 0; col < grid[r].length; col++) {
      const ch = grid[r][col]; if (ch === '.') continue;
      g.fillStyle = ch === 'o' ? eye : body;
      g.fillRect(pad + col * px, pad + r * px, px, px);
    }
  }
  _pixCache[key] = c;
  return c;
}
function drawPixelInvader(ctx, cx, cy, S, th, isFront, word, frame) {
  const sp = PIX_KEYS[speciesIdx(word, 3)];
  const f = (frame >> 4) & 1;                       // 2-frame march
  const blink = (frame % 236) < 8;                  // occasional eye blink
  const spr = _pixSprite(sp, f, isFront, blink, th);
  ctx.drawImage(spr, Math.round(cx - spr.width / 2), Math.round(cy - spr.height / 2 + (f ? 1 : 0)));
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
    else if (th.enemyStyle === 'pixel') drawPixelInvader(ctx, cx, cy, S, th, this.isFront, this.word, this._frame);
    else drawLuminous(ctx, cx, cy, S, th, this.isFront, this.word, this._frame);
    ctx.restore();

    // wrong-hit red ring
    if (wrong) { ctx.save(); ctx.strokeStyle = th.wrong; ctx.lineWidth = 2; ctx.shadowColor = th.wrong; ctx.shadowBlur = 16; ctx.beginPath(); ctx.arc(cx, cy, 22, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }

    // ── Word label ──
    ctx.save();
    ctx.font = `${this.isFront ? '600 ' : ''}${this.isFront ? 13 : 12}px "Alegreya","Noto Serif",serif`;
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
  constructor(x, y) { this.x = x; this.y = y; this.vx = 0; this.fireCooldown = 0; this._frame = 0; this._lunge = 0; this._muzzle = 0; }
  lunge() { this._lunge = 8; this._muzzle = 5; }
  draw(ctx) {
    this._frame++;
    const th = T();
    let cx = this.x, cy = this.y, w = CFG.PLAYER_W, h = CFG.PLAYER_H;
    if (this._lunge > 0) { cy -= this._lunge; this._lunge--; }
    ctx.save();
    if (th.playerStyle === 'archer') drawArcher(ctx, cx, cy, w, h, th);
    else if (th.playerStyle === 'lyre') drawLyre(ctx, cx, cy, w, h, th, this._frame);
    else if (th.playerStyle === 'cannon') drawCannon(ctx, cx, cy, w, h, th, this._frame);
    else drawTrireme(ctx, cx, cy, w, h, th, this._frame);
    ctx.restore();
    // muzzle flash — short additive bloom at the launch point
    if (this._muzzle > 0) {
      const k = this._muzzle / 5; this._muzzle--;
      ctx.save();
      if (th.bulletStyle !== 'arrow') { ctx.globalCompositeOperation = 'lighter'; ctx.shadowColor = th.bulletGlow; ctx.shadowBlur = 14; }
      ctx.globalAlpha = k * 0.85; ctx.fillStyle = th.bullet;
      ctx.beginPath(); ctx.arc(cx, cy - h * 0.62, 2 + k * 5, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
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
const CANNON = [
  '.....o.....',
  '.....X.....',
  '....XXX....',
  '....XXX....',
  '.XXXXXXXXX.',
  'XXXXXXXXXXX',
  'XXXXXXXXXXX',
];
function drawCannon(ctx, cx, cy, w, h, th, frame) {
  const px = 3, gw = CANNON[0].length, gh = CANNON.length;
  const x0 = Math.round(cx - gw * px / 2), y0 = Math.round(cy - gh * px / 2);
  ctx.shadowColor = th.bulletGlow; ctx.shadowBlur = 12;
  for (let r = 0; r < gh; r++) {
    for (let c = 0; c < gw; c++) {
      const ch = CANNON[r][c]; if (ch === '.') continue;
      if (ch === 'o') { ctx.fillStyle = th.accent || '#ffd166'; ctx.globalAlpha = 0.6 + 0.4 * Math.abs(Math.sin(frame * 0.18)); }
      else { ctx.fillStyle = th.front; ctx.globalAlpha = 1; }
      ctx.fillRect(x0 + c * px, y0 + r * px, px, px);
    }
  }
  // soft phosphor exhaust under the hull
  ctx.globalAlpha = 0.35 + 0.2 * Math.sin(frame * 0.2);
  const g = ctx.createLinearGradient(cx, y0 + gh * px, cx, y0 + gh * px + 9);
  g.addColorStop(0, th.bulletGlow); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(x0 + 3, y0 + gh * px, gw * px - 6, 9);
  ctx.globalAlpha = 1;
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
    this.stars = []; this.motes = []; this.nebulae = []; this.shooters = [];
    this.shockwaves = []; this.particles = []; this.projectiles = []; this.enemies = []; this.player = null;
    // presentation-only extras
    this.hitFlash = 0;          // white bloom on correct kill (frames)
    this.scoreShown = 0;        // animated count-up value for the HUD
    this.waveBanner = 0;        // seconds remaining of the wave banner overlay
    this.introTimer = 1.9;      // opening CRT power-on sweep (does not gate play)
    this.time = 0;
    this.goT = 0;               // seconds since game over (drives entrance anim)
    this.best = 0;              // persistent high score (presentation only)
    try { this.best = parseInt(localStorage.getItem('invadersBest') || '0', 10) || 0; } catch (_) {}
    this.newBest = false;
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
    this.nebulae = [
      new Nebula(this.canvas.width, this.canvas.height, 'rgba(80,130,170,A)'),
      new Nebula(this.canvas.width, this.canvas.height, 'rgba(150,110,190,A)'),
      new Nebula(this.canvas.width, this.canvas.height, 'rgba(196,164,72,A)'),
    ];
    this.shooters = [new ShootingStar(this.canvas.width, this.canvas.height)];
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
    this.shockwaves = [];
    this.waveBanner = 1.7;   // kinetic "wave N" banner — purely visual, does not pause play
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

  _updateHUD() {
    if (!this.scoreEl) return;
    const n = Math.max(0, this.lives);
    const hearts = '♥'.repeat(n) + '♡'.repeat(Math.max(0, 3 - n));
    this.scoreEl.innerHTML =
      `<span class="inv-hud-lbl">SCORE</span><span class="inv-hud-score">${Math.round(this.scoreShown)}</span>` +
      `<span class="inv-hud-sep">·</span><span class="inv-hud-hearts">${hearts}</span>`;
  }

  _loop(ts) { this.rafId = requestAnimationFrame(t => this._loop(t)); const dt = Math.min((ts - this.lastTime) / 1000, 0.05); this.lastTime = ts; this._update(dt); this._draw(); }

  _update(dt) {
    this.time += dt;
    const amb = REDUCED() ? 0.35 : 1;   // slow ambient motion under reduce-motion
    this.stars.forEach(s => s.update(dt * amb));
    this.motes.forEach(m => m.update(dt * amb));
    this.nebulae.forEach(n => n.update(dt * amb));
    this.shooters.forEach(s => s.update(dt * amb));
    this.particles = this.particles.filter(p => p.update(dt));
    this.shockwaves = this.shockwaves.filter(s => s.update(dt));
    this.popups = this.popups.filter(sp => { sp.vy = (sp.vy || 45) + 40 * dt; sp.y -= sp.vy * dt; sp.life -= dt; return sp.life > 0; });
    if (this.hitFlash > 0) this.hitFlash--;
    if (this.waveBanner > 0) this.waveBanner = Math.max(0, this.waveBanner - dt);
    if (this.introTimer > 0) this.introTimer = Math.max(0, this.introTimer - dt);
    // animated score count-up for the HUD chip
    if (Math.round(this.scoreShown) !== this.score) {
      const diff = this.score - this.scoreShown;
      this.scoreShown += diff * Math.min(1, dt * 9) + Math.sign(diff) * dt * 40;
      if (Math.abs(this.score - this.scoreShown) < 1) this.scoreShown = this.score;
      this._updateHUD();
    }
    if (this.state === 'gameover') { this.goT += dt; return; }
    if (this.state === 'levelup') { this.lvlTimer -= dt; if (this.lvlTimer <= 0) { this.levelIndex++; this._initLevel(); } return; }
    const W = this.canvas.width, H = this.canvas.height;
    this.questionPulse += dt * 2.2;
    const p = this.player; p.vx = 0;
    if (this.keys['ArrowLeft'] || this.keys['KeyA'] || this.touch.left) p.vx = -CFG.PLAYER_SPEED;
    if (this.keys['ArrowRight'] || this.keys['KeyD'] || this.touch.right) p.vx = CFG.PLAYER_SPEED;
    p.x = Math.max(CFG.PLAYER_W / 2, Math.min(W - CFG.PLAYER_W / 2, p.x + p.vx * dt));
    p.fireCooldown = Math.max(0, p.fireCooldown - dt * 1000);
    if ((this.keys['Space'] || this.touch.fire) && p.fireCooldown === 0) {
      this.projectiles.push(new Projectile(p.x, p.y - CFG.PLAYER_H / 2)); p.lunge(); sfxShoot(); p.fireCooldown = CFG.FIRE_COOLDOWN;
      const th = T(), glow = th.bulletStyle !== 'arrow';
      for (let i = 0; i < 2; i++) this.particles.push(new Particle(p.x + rand(-3, 3), p.y - CFG.PLAYER_H / 2 - 2, th.bullet, false, { glow, spd: 0.35, grav: -25 }));
    }
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
            const th = T();
            // multi-stage explosion: core flash → ring → delayed echo ring
            const flashCol = th.enemyStyle === 'blackfigure' ? '#ffd9a0' : th.spark[0];
            this.shockwaves.push(new KillFlash(enemy.x, enemy.y, flashCol));
            this.shockwaves.push(new Shockwave(enemy.x, enemy.y, flashCol));
            this.shockwaves.push(new Shockwave(enemy.x, enemy.y, '#ffffff', { delay: 0.09, maxR: 30, dur: 0.4, lw: 1.2 }));
            this.hitFlash = 6;
            this.popups.push({ x: enemy.x, y: enemy.y - 10, text: `+${pts}`, life: 1.2, vy: 60, color: '#5ef578', big: true });
            if (this.streak === 3 || this.streak === 5 || this.streak === 8)
              this.popups.push({ x: enemy.x, y: enemy.y - 34, text: `ΣΕΡΙ ×${this.streak}!`, life: 1.3, vy: 40, color: '#ffd166', big: true });
            if (this.scoreEl) { this.scoreEl.classList.remove('inv-chip-pop'); void this.scoreEl.offsetWidth; this.scoreEl.classList.add('inv-chip-pop'); }
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

  _loseLife() {
    this.lives = Math.max(0, this.lives - 1); sfxError(); this.shakeFrames = CFG.SHAKE_FRAMES; this.errorFlash = 10; this._updateHUD();
    // HUD chip hurt shake (presentation only)
    if (this.scoreEl) { this.scoreEl.classList.remove('inv-chip-hurt'); void this.scoreEl.offsetWidth; this.scoreEl.classList.add('inv-chip-hurt'); }
    if (this.lives === 0) {
      this.state = 'gameover'; this.shakeFrames = 0; this.errorFlash = 0; this.goT = 0;
      this.newBest = this.score > 0 && this.score > this.best;
      if (this.newBest) { this.best = this.score; try { localStorage.setItem('invadersBest', String(this.best)); } catch (_) {} }
      if (typeof awardGameRewards === 'function' && this.score > 0) { awardGameRewards('invaders', { score: this.score, perfect: false }); }
    }
  }
  _checkLevelComplete() { if (!this.enemies.some(e => e.alive)) this._doLevelUp(); }
  _doLevelUp() {
    sfxLevelUp();
    if (typeof awardGameRewards === 'function' && this.score > 0) {
      awardGameRewards('invaders', { score: this.score, perfect: this.lives === 3 });
    }
    this.state = 'levelup'; this.lvlTimer = 2.6; this.enemies.filter(e => e.alive).forEach(e => { e.alive = false; this._spawnParticles(e.x, e.y, true); });
  }
  _spawnParticles(x, y, ok) {
    const th = T(); const palette = ok ? th.spark : th.sparkBad;
    const shard = th.enemyStyle === 'blackfigure' || th.enemyStyle === 'pixel';   // square debris for ink & pixel art
    const glowTheme = th.enemyStyle !== 'blackfigure';   // ink debris shouldn't glow
    const n = (ok ? 14 : 10) + randInt(0, 5);
    // main debris burst
    for (let i = 0; i < n; i++) this.particles.push(new Particle(x, y, palette[i % palette.length], shard, { spd: rand(0.7, 1.3) }));
    // fast bright energy sparks (additive) — the "juice" layer
    if (glowTheme) {
      const sn = ok ? 8 : 5;
      for (let i = 0; i < sn; i++) this.particles.push(new Particle(x, y, palette[0], false, { glow: true, spd: rand(1.4, 2.4), grav: 40 }));
    }
    // a couple of slow embers drifting up
    for (let i = 0; i < 3; i++) this.particles.push(new Particle(x + rand(-6, 6), y, palette[randInt(0, palette.length - 1)], false, { spd: 0.4, grav: -30 }));
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
      ctx.lineDashOffset = REDUCED() ? 0 : -((this.time * 26) % 12);   // marching ants
      ctx.globalAlpha = 0.7 + 0.3 * Math.sin(this.time * 2);
      ctx.beginPath(); ctx.moveTo(0, H - 48); ctx.lineTo(W, H - 48); ctx.stroke(); ctx.restore();
    }
    this.projectiles.forEach(b => b.draw(ctx));
    if (this.player && this.state !== 'gameover') this.player.draw(ctx);
    this.particles.forEach(p => p.draw(ctx));
    this.shockwaves.forEach(s => s.draw(ctx));
    this._drawPopups(ctx);
    // full-screen bloom pulse on a correct kill
    if (this.hitFlash > 0) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      ctx.globalAlpha = (this.hitFlash / 6) * 0.09; ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, W, H); ctx.restore();
    }
    if (this.waveBanner > 0 && this.state === 'playing') this._drawWaveBanner(W, H);
    if (this.state === 'levelup') this._drawLevelUp(W, H);
    if (this.state === 'gameover') this._drawGameOver(W, H);
    ctx.restore();
    if (this.introTimer > 0) this._drawIntro(W, H);   // outside the shake transform
  }

  /* CRT power-on: black → bright horizontal filament → vertical open → bloom */
  _drawIntro(W, H) {
    const ctx = this.ctx;
    const t = 1 - this.introTimer / 1.9;   // 0 → 1
    if (REDUCED()) {
      ctx.save(); ctx.globalAlpha = clamp(this.introTimer / 1.9, 0, 1) * 0.9;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); return;
    }
    ctx.save();
    if (t < 0.3) {                          // filament grows from the centre
      const p = easeOutCubic(t / 0.3);
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      const w2 = Math.max(2, p * W * 0.5);
      const g = ctx.createLinearGradient(W / 2 - w2, H / 2, W / 2 + w2, H / 2);
      g.addColorStop(0, 'rgba(160,220,255,0)'); g.addColorStop(0.5, 'rgba(235,250,255,0.95)'); g.addColorStop(1, 'rgba(160,220,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 2.4; ctx.shadowColor = '#9fd6ef'; ctx.shadowBlur = 18;
      ctx.beginPath(); ctx.moveTo(W / 2 - w2, H / 2); ctx.lineTo(W / 2 + w2, H / 2); ctx.stroke();
    } else if (t < 0.58) {                  // screen opens vertically
      const p = easeOutCubic((t - 0.3) / 0.28);
      const h2 = p * H * 0.5;
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, W, H / 2 - h2);
      ctx.fillRect(0, H / 2 + h2, W, H / 2 - h2 + 1);
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = 1 - p;
      ctx.fillStyle = 'rgba(200,235,250,0.5)';
      ctx.fillRect(0, H / 2 - h2 - 1.5, W, 3); ctx.fillRect(0, H / 2 + h2 - 1.5, W, 3);
    } else {                                // residual phosphor bloom fades
      const p = (t - 0.58) / 0.42;
      ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = (1 - p) * 0.16;
      ctx.fillStyle = '#cfe2ee'; ctx.fillRect(0, 0, W, H);
    }
    ctx.restore();
  }

  /* Kinetic wave banner — pops in at each level start, fades while playing */
  _drawWaveBanner(W, H) {
    const th = T(), ctx = this.ctx;
    const total = 1.7, t = 1 - this.waveBanner / total;         // 0 → 1
    const inP = clamp(t / 0.22, 0, 1);
    const outP = clamp((t - 0.78) / 0.22, 0, 1);
    const a = 1 - outP;
    const sc = REDUCED() ? 1 : (0.72 + 0.28 * easeOutBack(inP));
    const y = H * 0.42;
    ctx.save();
    // letterbox band
    ctx.globalAlpha = a * Math.min(1, inP * 1.4) * 0.85;
    const band = ctx.createLinearGradient(0, y - 52, 0, y + 52);
    band.addColorStop(0, 'rgba(0,0,0,0)'); band.addColorStop(0.5, 'rgba(0,0,0,0.55)'); band.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = band; ctx.fillRect(0, y - 52, W, 104);
    // sweeping rules
    const lw = easeOutCubic(inP) * W * 0.32;
    ctx.strokeStyle = th.label; ctx.globalAlpha = a * 0.6; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - lw, y + 27); ctx.lineTo(W / 2 - 64, y + 27);
    ctx.moveTo(W / 2 + 64, y + 27); ctx.lineTo(W / 2 + lw, y + 27);
    ctx.stroke();
    // text
    ctx.globalAlpha = a;
    ctx.translate(W / 2, y); ctx.scale(sc, sc);
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = th.label; ctx.shadowColor = th.labelGlow; ctx.shadowBlur = 18;
    ctx.font = `600 ${Math.min(44, W * 0.08)}px "Oswald","Alegreya",sans-serif`;
    ctx.fillText(`ΚΥΜΑ ${this.levelIndex + 1}`, 0, -8);
    ctx.shadowBlur = 0;
    ctx.font = '500 12px "Oswald","Montserrat",sans-serif';
    ctx.fillStyle = th.panelTitle;
    ctx.fillText(`W A V E   ${this.levelIndex + 1}`, 0, 20);
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
      // anchored glow anchors …
      const blob = (x, y, r, col) => { const rg = ctx.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, col); rg.addColorStop(1, 'transparent'); ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H); };
      blob(W * 0.18, H * 0.2, 200, 'rgba(80,130,160,0.12)');
      blob(W * 0.82, H * 0.7, 230, 'rgba(196,164,72,0.07)');
      // … plus slow drifting cloud bodies
      this.nebulae.forEach(n => n.draw(ctx));
      ctx.restore();
    }
    if (th.stars) {
      this.stars.forEach(s => s.draw(ctx));
      this.shooters.forEach(s => s.draw(ctx));
    }
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
    ctx.font = '500 11px "Oswald","Alegreya",sans-serif'; ctx.fillStyle = th.panelKey; ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText(`ΕΠΙΠΕΔΟ ${this.levelIndex + 1}`, 14, 10);
    ctx.font = '12px "Alegreya",serif'; ctx.fillStyle = th.panelTitle; ctx.fillText(level.title.normalize('NFC'), 14, 26);
    ctx.font = '500 12px "Oswald","Alegreya",sans-serif'; ctx.fillStyle = th.prompt; ctx.textAlign = 'center'; ctx.fillText('Πυροβόλησε:', W / 2, 8);
    const pulse = 0.84 + Math.sin(this.questionPulse) * 0.16;
    const appear = REDUCED() ? 1 : easeOutBack(clamp(this.questionPulse / 0.9, 0, 1));   // pop-in on new question
    ctx.save();
    ctx.globalAlpha = pulse * Math.min(1, appear + 0.2);
    ctx.translate(W / 2, 30); ctx.scale(appear, appear);
    ctx.font = `600 ${Math.min(28, W * 0.055)}px "Alegreya","Noto Serif",serif`; ctx.fillStyle = th.label;
    ctx.shadowColor = th.labelGlow; ctx.shadowBlur = 14; ctx.textAlign = 'center';
    ctx.fillText(label, 0, 0);
    ctx.restore();
    if (this.streak > 1) {
      ctx.font = '600 13px "Oswald","Alegreya",sans-serif'; ctx.fillStyle = '#5ef578'; ctx.textAlign = 'right'; ctx.fillText(`×${this.streak} σερί`, W - 14, 10);
      ctx.font = '500 10px "Oswald","Alegreya",sans-serif'; ctx.fillStyle = '#3a8e50'; ctx.fillText(`+${this.streak * 50} bonus`, W - 14, 26);
    }
    ctx.restore();
  }

  _drawPopups(ctx) {
    this.popups.forEach(sp => {
      if (sp.t0 == null) sp.t0 = sp.life;                       // remember birth life
      const age = clamp((sp.t0 - sp.life) * 7, 0, 1);
      const sc = (sp.big && !REDUCED()) ? easeOutBack(age) : 1;
      ctx.save(); ctx.globalAlpha = Math.min(1, sp.life * 1.5);
      ctx.translate(sp.x, sp.y); ctx.scale(sc, sc);
      ctx.font = `700 ${sp.big ? 17 : 14}px "Oswald","Alegreya",sans-serif`;
      ctx.fillStyle = sp.color; ctx.textAlign = 'center';
      ctx.shadowColor = sp.color; ctx.shadowBlur = 10; ctx.fillText(sp.text.normalize('NFC'), 0, 0); ctx.restore();
    });
  }

  _drawLevelUp(W, H) {
    const th = T(), ctx = this.ctx; ctx.save();
    const t = clamp((2.6 - this.lvlTimer) / 0.45, 0, 1);        // entrance 0→1
    const sc = REDUCED() ? 1 : easeOutBack(t);
    ctx.globalAlpha = Math.min(1, t * 1.6);
    ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H);
    const grad = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, 180);
    grad.addColorStop(0, 'rgba(94,245,120,0.16)'); grad.addColorStop(1, 'rgba(94,245,120,0)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    ctx.translate(W / 2, H / 2); ctx.scale(sc, sc);
    ctx.textAlign = 'center'; ctx.fillStyle = '#5ef578';
    ctx.font = `600 ${Math.min(52, W * 0.1)}px "Alegreya","Noto Serif",serif`; ctx.shadowColor = '#5ef578'; ctx.shadowBlur = 20;
    ctx.fillText('Επίπεδο', 0, -24); ctx.fillText('Ολοκληρώθηκε!', 0, 34); ctx.shadowBlur = 0;
    ctx.font = '500 12px "Oswald","Alegreya",sans-serif'; ctx.fillStyle = 'rgba(160,220,170,0.75)';
    ctx.fillText('WAVE CLEARED', 0, 56);
    ctx.font = '17px "Alegreya",serif'; ctx.fillStyle = '#c9a44a'; ctx.fillText(`Επόμενο: Επίπεδο ${this.levelIndex + 2}`, 0, 84);
    ctx.restore();
  }

  _drawGameOver(W, H) {
    const ctx = this.ctx; ctx.save();
    const t = Math.min(1, this.goT / 0.5);                      // entrance fade
    ctx.globalAlpha = t;
    ctx.fillStyle = 'rgba(6,3,3,0.82)'; ctx.fillRect(0, 0, W, H);
    // ember glow behind the title
    const eg = ctx.createRadialGradient(W / 2, H / 2 - 30, 10, W / 2, H / 2 - 30, 240);
    eg.addColorStop(0, 'rgba(255,60,50,0.14)'); eg.addColorStop(1, 'rgba(255,60,50,0)');
    ctx.fillStyle = eg; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    // chromatic-aberration GAME OVER
    const fs = Math.min(58, W * 0.11);
    const sc = REDUCED() ? 1 : easeOutBack(Math.min(1, this.goT / 0.45));
    ctx.save();
    ctx.translate(W / 2, H / 2 - 40); ctx.scale(sc, sc);
    ctx.font = `700 ${fs}px "Oswald","Montserrat",sans-serif`;
    if (!REDUCED()) {
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = 'rgba(255,70,90,0.5)';  ctx.fillText('GAME OVER', -2.2, 0);
      ctx.fillStyle = 'rgba(80,200,255,0.45)'; ctx.fillText('GAME OVER', 2.2, 0);
      ctx.globalCompositeOperation = 'source-over';
    }
    ctx.fillStyle = '#ff5e5e'; ctx.shadowColor = '#ff2020'; ctx.shadowBlur = 22;
    ctx.fillText('GAME OVER', 0, 0); ctx.shadowBlur = 0;
    ctx.restore();
    ctx.font = '500 12px "Oswald","Alegreya",sans-serif'; ctx.fillStyle = 'rgba(230,170,160,0.6)';
    ctx.fillText('ΤΕΛΟΣ ΠΑΙΧΝΙΔΙΟΥ', W / 2, H / 2 - 14);
    // score count-up
    const shown = Math.round(this.score * easeOutCubic(Math.min(1, this.goT / 0.9)));
    ctx.font = '16px "Alegreya",serif'; ctx.fillStyle = '#b9a98e';
    ctx.fillText('Τελικό Σκορ · Final Score', W / 2, H / 2 + 16);
    ctx.font = `700 ${Math.min(38, W * 0.075)}px "Oswald","Montserrat",sans-serif`;
    ctx.fillStyle = '#e8dcc8'; ctx.shadowColor = 'rgba(240,201,105,0.5)'; ctx.shadowBlur = 12;
    ctx.fillText(String(shown), W / 2, H / 2 + 52); ctx.shadowBlur = 0;
    // best score / new record
    if (this.newBest && this.goT > 0.9) {
      const pk = REDUCED() ? 1 : (0.8 + 0.2 * Math.sin(this.goT * 6));
      ctx.save(); ctx.globalAlpha = t * pk;
      ctx.font = '700 17px "Oswald","Alegreya",sans-serif'; ctx.fillStyle = '#ffd166';
      ctx.shadowColor = '#ffd166'; ctx.shadowBlur = 14;
      ctx.fillText('ΝΕΟ ΡΕΚΟΡ! · NEW BEST!', W / 2, H / 2 + 82);
      ctx.restore();
    } else if (this.best > 0) {
      ctx.font = '13px "Alegreya",serif'; ctx.fillStyle = '#8a7a5e';
      ctx.fillText(`Ρεκόρ · Best: ${this.best}`, W / 2, H / 2 + 80);
    }
    // restart hint (pulsing)
    ctx.globalAlpha = t * (REDUCED() ? 1 : (0.55 + 0.45 * Math.abs(Math.sin(this.goT * 2.4))));
    ctx.font = '500 14px "Oswald","Alegreya",sans-serif'; ctx.fillStyle = '#c9a44a';
    const hint = (navigator.maxTouchPoints > 0 || 'ontouchstart' in window) ? 'Πάτα ⚡ ΠΥΡΑ για επανεκκίνηση' : 'Πάτα Enter για επανεκκίνηση';
    ctx.fillText(hint, W / 2, H / 2 + 112); ctx.restore();
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
  // sync the theme button label with the persisted theme
  const themeBtn = document.getElementById('inv-theme-btn');
  if (themeBtn && window.INVADERS_THEME_LABELS && window.INVADERS_THEME_LABELS[THEME_NAME]) {
    themeBtn.textContent = window.INVADERS_THEME_LABELS[THEME_NAME];
  }
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
