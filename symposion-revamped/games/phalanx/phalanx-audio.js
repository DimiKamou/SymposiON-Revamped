// ============================================================
//  PHALANX · Reimagined — Web Audio SFX kit (window.PhalanxAudio)
//  No asset files: everything is synthesized.
//    select()      — pick up one of your units
//    place()       — set a unit down in placement
//    move()        — a single-tile march step
//    charge()      — cavalry 2-tile gallop
//    clash()       — bronze-on-bronze contact when units meet
//    correct()     — rising "the line holds" sting
//    wrong()       — descending buzzer, a unit falls
//    standoff()    — dull bounce, both units survive
//    general()     — somber horn when a General falls
//    victory(win)  — triumphal fanfare / defeat dirge
//    startDrone/setStrain/stopDrone — battlefield tension bed
// ============================================================
(function () {
  class PhalanxAudioEngine {
    constructor() { this._ctx = null; this._drone = null; this._dg = null; this.muted = false; }
    _init() {
      if (this._ctx) { if (this._ctx.state === 'suspended') this._ctx.resume(); return true; }
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); return true; }
      catch (e) { return false; }
    }
    _pan(node, x) {
      const ctx = this._ctx;
      if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = x; node.connect(p); return p; }
      return node;
    }
    _tone(type, f0, f1, dur, peak, t0, pan) {
      const ctx = this._ctx, t = t0 == null ? ctx.currentTime : t0;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t);
      if (f1 != null && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + Math.min(0.02, dur * 0.3));
      g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
      o.connect(g);
      this._pan(g, pan || 0).connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.02);
      return { o, g };
    }
    _noise(dur, peak, freq, q, t0) {
      const ctx = this._ctx, t = t0 == null ? ctx.currentTime : t0;
      const len = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const src = ctx.createBufferSource(); src.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = freq; bp.Q.value = q || 1;
      const g = ctx.createGain(); g.gain.setValueAtTime(peak, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(bp); bp.connect(g); g.connect(ctx.destination);
      src.start(t); src.stop(t + dur + 0.02);
    }

    select() { if (this.muted || !this._init()) return; this._tone('sine', 520, 720, 0.09, 0.10); }
    place()  { if (this.muted || !this._init()) return; this._tone('triangle', 220, 110, 0.12, 0.16); this._noise(0.06, 0.10, 320, 0.8); }
    move()   { if (this.muted || !this._init()) return; this._tone('sine', 160, 120, 0.10, 0.10); this._noise(0.05, 0.08, 240, 0.6); }
    charge() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      for (let i = 0; i < 4; i++) this._noise(0.05, 0.13, 180 + i * 30, 0.7, t + i * 0.055);
      this._tone('sawtooth', 110, 180, 0.26, 0.10, t);
    }
    clash() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      // bright bronze ring + metallic noise burst
      this._tone('triangle', 1180, 760, 0.34, 0.16, t);
      this._tone('square',   1760, 1320, 0.22, 0.06, t + 0.004);
      this._noise(0.14, 0.26, 2600, 2.4, t);
      this._noise(0.10, 0.14, 1400, 1.6, t + 0.02);
    }
    correct() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((f, i) => this._tone('triangle', f, f, 0.30, 0.15, t + i * 0.075));
    }
    wrong() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      this._tone('sawtooth', 200, 70, 0.34, 0.20, t);
      this._noise(0.22, 0.12, 180, 0.6, t + 0.04);
    }
    standoff() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      this._tone('sine', 330, 247, 0.20, 0.13, t);
      this._tone('sine', 247, 196, 0.22, 0.10, t + 0.05);
    }
    general() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      [98, 130.81].forEach((f, i) => this._tone('sawtooth', f, f * 0.75, 0.9, 0.18, t + i * 0.18));
    }
    victory(win) {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      const seq = win ? [392, 523.25, 659.25, 783.99, 1046.5] : [330, 294, 247, 196];
      seq.forEach((f, i) => this._tone('triangle', f, f, win ? 0.55 : 0.7, 0.16, t + i * (win ? 0.13 : 0.2)));
    }

    startDrone() {
      if (this.muted || !this._init() || this._drone) return;
      const ctx = this._ctx;
      this._drone = ctx.createOscillator(); this._dg = ctx.createGain();
      this._drone.type = 'sawtooth'; this._drone.frequency.value = 48;
      this._dg.gain.value = 0;
      this._drone.connect(this._dg); this._dg.connect(ctx.destination); this._drone.start();
    }
    setStrain(x) { // 0..1
      if (!this._ctx || !this._drone) return;
      const now = this._ctx.currentTime;
      this._drone.frequency.setTargetAtTime(48 + x * 60, now, 0.3);
      this._dg.gain.setTargetAtTime(this.muted ? 0 : 0.012 + x * 0.03, now, 0.3);
    }
    stopDrone() { if (this._drone) { try { this._drone.stop(); } catch (e) {} this._drone = this._dg = null; } }

    setMuted(m) { this.muted = m; if (m && this._dg) this._dg.gain.value = 0; }
    stop() { this.stopDrone(); if (this._ctx) { try { this._ctx.close(); } catch (e) {} this._ctx = null; } }
  }
  window.PhalanxAudio = new PhalanxAudioEngine();
})();
