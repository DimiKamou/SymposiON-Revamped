/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — juice.js
   The "feel" layer: pooled GPU particles (dust puffs, gold sparkles,
   speed trails) + a fully procedural WebAudio synth (no audio files).
   Everything scales down on weak devices / prefers-reduced-motion.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { QUALITY } from './quality.js';

export const REDUCED_MOTION =
  typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ───────────────────────────────────────────────────────────────
   PARTICLES — one THREE.Points per system, ring-buffer allocated.
   World-space; update() takes the per-frame scroll delta so puffs
   recede with the road (fixed-camera / moving-world design).
─────────────────────────────────────────────────────────────── */
const VTX = /* glsl */`
  attribute float aSize; attribute float aAlpha; attribute vec3 aColor;
  varying float vAlpha; varying vec3 vColor;
  void main(){
    vColor = aColor; vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * (160.0 / max(1.0, -mv.z));
    gl_Position = projectionMatrix * mv;
  }`;
const FRG = /* glsl */`
  precision mediump float;
  varying float vAlpha; varying vec3 vColor;
  void main(){
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.06, d) * vAlpha;
    if (a < 0.012) discard;
    gl_FragColor = vec4(vColor, a);
  }`;

export class Particles {
  constructor(scene, opts = {}) {
    const scale = (QUALITY.weak ? 0.55 : 1) * (REDUCED_MOTION ? 0.5 : 1);
    this.max = Math.max(24, Math.floor((opts.max || 256) * scale));
    this.gravity = opts.gravity !== undefined ? opts.gravity : -7;
    this.drag = opts.drag !== undefined ? opts.drag : 1.8;
    this.grow = !!opts.grow;                 // dust grows as it fades
    this.baseAlpha = opts.alpha !== undefined ? opts.alpha : 1;
    const n = this.max;
    this.pos = new Float32Array(n * 3);
    this.vel = new Float32Array(n * 3);
    this.col = new Float32Array(n * 3);
    this.life = new Float32Array(n);
    this.maxLife = new Float32Array(n);
    this.size0 = new Float32Array(n);
    this.sizes = new Float32Array(n);
    this.alpha = new Float32Array(n);
    this.head = 0;

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(this.pos, 3));
    g.setAttribute('aColor', new THREE.BufferAttribute(this.col, 3));
    g.setAttribute('aSize', new THREE.BufferAttribute(this.sizes, 1));
    g.setAttribute('aAlpha', new THREE.BufferAttribute(this.alpha, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: VTX, fragmentShader: FRG,
      transparent: true, depthWrite: false,
      blending: (opts.additive !== false) ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    this.points = new THREE.Points(g, m);
    this.points.frustumCulled = false;
    this.points.renderOrder = 5;
    scene.add(this.points);
  }

  /* spray `count` particles from (x,y,z) */
  burst(x, y, z, o = {}) {
    const count = Math.max(1, Math.round((o.count || 8) * (REDUCED_MOTION ? 0.5 : 1)));
    const col = _tmpColor.set(o.color !== undefined ? o.color : 0xffffff);
    const spd = o.speed !== undefined ? o.speed : 3;
    const up = o.up !== undefined ? o.up : 2;
    const life = o.life !== undefined ? o.life : 0.6;
    const size = o.size !== undefined ? o.size : 0.2;
    const spread = o.spread !== undefined ? o.spread : 1;
    const vz = o.vz || 0;
    for (let k = 0; k < count; k++) {
      const i = this.head; this.head = (this.head + 1) % this.max;
      const a = Math.random() * Math.PI * 2, r = 0.3 + Math.random() * 0.7;
      this.pos[i * 3]     = x + (Math.random() - 0.5) * 0.2 * spread;
      this.pos[i * 3 + 1] = y + (Math.random() - 0.5) * 0.15;
      this.pos[i * 3 + 2] = z + (Math.random() - 0.5) * 0.2 * spread;
      this.vel[i * 3]     = Math.cos(a) * spd * r * spread;
      this.vel[i * 3 + 1] = up * (0.35 + Math.random() * 0.9);
      this.vel[i * 3 + 2] = Math.sin(a) * spd * r * spread * 0.6 + vz;
      const j = 0.85 + Math.random() * 0.3;
      this.col[i * 3] = Math.min(1, col.r * j);
      this.col[i * 3 + 1] = Math.min(1, col.g * j);
      this.col[i * 3 + 2] = Math.min(1, col.b * j);
      this.life[i] = this.maxLife[i] = life * (0.6 + Math.random() * 0.7);
      this.size0[i] = size * (0.7 + Math.random() * 0.7);
    }
  }

  update(dt, dz = 0) {
    const dragK = Math.exp(-this.drag * dt);
    const g = this.gravity;
    for (let i = 0; i < this.max; i++) {
      if (this.life[i] <= 0) { if (this.alpha[i] !== 0) this.alpha[i] = 0; continue; }
      this.life[i] -= dt;
      if (this.life[i] <= 0) { this.alpha[i] = 0; continue; }
      this.vel[i * 3 + 1] += g * dt;
      this.vel[i * 3] *= dragK; this.vel[i * 3 + 2] *= dragK;
      this.pos[i * 3]     += this.vel[i * 3] * dt;
      this.pos[i * 3 + 1] += this.vel[i * 3 + 1] * dt;
      this.pos[i * 3 + 2] += this.vel[i * 3 + 2] * dt + dz;
      if (this.pos[i * 3 + 1] < 0.04) { this.pos[i * 3 + 1] = 0.04; this.vel[i * 3 + 1] *= -0.25; }
      const f = this.life[i] / this.maxLife[i];
      this.alpha[i] = Math.min(1, f * 2.2) * this.baseAlpha;
      this.sizes[i] = this.size0[i] * (this.grow ? (1.55 - 0.75 * f) : (0.45 + 0.55 * f));
    }
    const at = this.points.geometry.attributes;
    at.position.needsUpdate = true;
    at.aAlpha.needsUpdate = true;
    at.aSize.needsUpdate = true;
    at.aColor.needsUpdate = true;
  }
}
const _tmpColor = new THREE.Color();

/* ───────────────────────────────────────────────────────────────
   SFX — tiny procedural synth. Context is created lazily inside the
   first user-gesture-driven call; every voice is osc/noise → filter
   → envelope → master. No samples, no deps.
─────────────────────────────────────────────────────────────── */
export class Sfx {
  constructor() {
    this.enabled = localStorage.getItem('as_sound') !== '0';
    this.ctx = null; this.master = null; this._nb = null;
  }
  _ac() {
    try {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return null;
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = 0.5;
        this.master.connect(this.ctx.destination);
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    } catch (e) { return null; }
  }
  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('as_sound', this.enabled ? '1' : '0');
    if (this.enabled) this.tone(660, 990, 0.09, { type: 'triangle', vol: 0.1 });
    return this.enabled;
  }

  tone(f0, f1, dur, o = {}) {
    if (!this.enabled) return;
    const ctx = this._ac(); if (!ctx) return;
    const t = ctx.currentTime + (o.delay || 0);
    const osc = ctx.createOscillator();
    osc.type = o.type || 'sine';
    osc.frequency.setValueAtTime(Math.max(1, f0), t);
    if (f1 && f1 !== f0) osc.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
    const g = ctx.createGain();
    const vol = o.vol !== undefined ? o.vol : 0.15;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, vol), t + (o.attack || 0.008));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g); g.connect(this.master);
    osc.start(t); osc.stop(t + dur + 0.03);
  }
  _noiseBuf(ctx) {
    if (this._nb) return this._nb;
    const len = (ctx.sampleRate * 0.6) | 0;
    const b = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = b.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this._nb = b; return b;
  }
  noise(dur, o = {}) {
    if (!this.enabled) return;
    const ctx = this._ac(); if (!ctx) return;
    const t = ctx.currentTime + (o.delay || 0);
    const src = ctx.createBufferSource();
    src.buffer = this._noiseBuf(ctx); src.loop = true;
    const flt = ctx.createBiquadFilter();
    flt.type = o.filter || 'bandpass';
    flt.frequency.setValueAtTime(o.f || 800, t);
    if (o.slideTo) flt.frequency.exponentialRampToValueAtTime(o.slideTo, t + dur);
    flt.Q.value = o.q !== undefined ? o.q : 1;
    const g = ctx.createGain();
    const vol = o.vol !== undefined ? o.vol : 0.15;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.001, vol), t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(flt); flt.connect(g); g.connect(this.master);
    src.start(t); src.stop(t + dur + 0.05);
  }

  /* ── vocabulary ─────────────────────────────────────────────── */
  coin(chain = 0) {                       // ascending semitones with the chain
    const f = 740 * Math.pow(2, Math.min(chain, 12) / 12);
    this.tone(f, f * 1.5, 0.12, { type: 'triangle', vol: 0.11 });
    this.tone(f * 2, f * 2, 0.07, { type: 'sine', vol: 0.045, delay: 0.015 });
  }
  jump()  { this.noise(0.2, { f: 700, slideTo: 1900, vol: 0.08 }); this.tone(240, 470, 0.18, { type: 'sine', vol: 0.05 }); }
  land()  { this.tone(150, 55, 0.13, { type: 'sine', vol: 0.16 }); this.noise(0.07, { f: 500, vol: 0.06 }); }
  roll()  { this.noise(0.3, { f: 1100, slideTo: 340, vol: 0.12 }); }
  swish() { this.noise(0.09, { f: 900, slideTo: 1500, vol: 0.045 }); }
  whoosh(loud = true) {
    this.noise(0.3, { f: 420, slideTo: 2600, q: 1.6, vol: loud ? 0.2 : 0.09 });
  }
  step()  { this.noise(0.03, { f: 1000, vol: 0.018 }); }
  thud(strength = 0.5) {                   // Talos footfall — bronze stomp, felt not heard
    const v = 0.04 + strength * 0.09;
    this.tone(76, 34, 0.16, { type: 'sine', vol: v });
    this.noise(0.07, { f: 150, filter: 'lowpass', vol: v * 0.5 });
  }
  crash() {
    this.noise(0.26, { f: 300, q: 0.7, vol: 0.28 });
    this.tone(170, 48, 0.34, { type: 'sawtooth', vol: 0.2 });
    this.tone(1250, 960, 0.14, { type: 'square', vol: 0.05, delay: 0.02 });
  }
  shieldClang() {
    for (const [f, d, v] of [[720, 0.3, 0.14], [1083, 0.22, 0.1], [1620, 0.16, 0.07]]) {
      this.tone(f, f * 0.98, d, { type: 'triangle', vol: v });
    }
    this.noise(0.1, { f: 2200, vol: 0.07 });
  }
  lunge() {                                // Talos bronze growl + servo clank
    this.tone(110, 52, 0.6, { type: 'sawtooth', vol: 0.18 });
    this.tone(113, 55, 0.6, { type: 'sawtooth', vol: 0.14 });
    this.noise(0.45, { f: 170, slideTo: 75, vol: 0.14 });
    this.tone(860, 620, 0.1, { type: 'square', vol: 0.06, delay: 0.16 });
  }
  power() {
    this.tone(420, 1680, 0.32, { type: 'sawtooth', vol: 0.07 });
    for (let i = 0; i < 3; i++) {
      this.tone(1200 + i * 420, 1400 + i * 460, 0.12, { type: 'sine', vol: 0.06, delay: 0.06 + i * 0.06 });
    }
  }
  quiz() {                                 // herald's horn — the gate opens
    this.tone(392, 392, 0.2, { type: 'square', vol: 0.045 });
    this.tone(523, 523, 0.26, { type: 'square', vol: 0.05, delay: 0.15 });
  }
  correct(streak = 0) {
    const base = [523.25, 659.25, 783.99, 1046.5];
    base.forEach((f, i) => this.tone(f, f, 0.2, { type: 'triangle', vol: 0.1, delay: i * 0.07 }));
    if (streak >= 3) this.tone(1318.5, 1318.5, 0.28, { type: 'triangle', vol: 0.09, delay: 0.3 });
  }
  wrong() {
    this.tone(196, 128, 0.4, { type: 'sawtooth', vol: 0.14 });
    this.tone(202, 132, 0.4, { type: 'sawtooth', vol: 0.12 });
  }
  ui() { this.tone(520, 700, 0.07, { type: 'triangle', vol: 0.06 }); }
}
