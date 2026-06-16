// ============================================================
//  TOW · Reimagined — Web Audio SFX kit  (window.TowAudio)
//  No asset files: everything is synthesized.
//    buzz(side)   — a team slams their pad (panned, team-pitched)
//    claim(side)  — short rising "you have the floor" sting
//    snap(int)    — rope-snap on a correct pull
//    danger()     — two low thumps near a losing edge
//    deny()       — short buzzer for wrong / too-early
//    tick()       — soft countdown tick during the buzz window
//    startHum/setTension/stopHum — continuous strain drone
//    victory(side)
// ============================================================
(function () {
  class TowAudioEngine {
    constructor() { this._ctx = null; this._osc = null; this._oscGain = null; this.muted = false; }
    _init() {
      if (this._ctx) { if (this._ctx.state === 'suspended') this._ctx.resume(); return true; }
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); return true; }
      catch (e) { return false; }
    }
    _pan(node, x) { // x: -1 left .. +1 right
      const ctx = this._ctx;
      if (ctx.createStereoPanner) { const p = ctx.createStereoPanner(); p.pan.value = x; node.connect(p); return p; }
      return node;
    }

    buzz(side) {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square';
      const base = side === 'A' ? 196 : 147; // G3 / D3 — distinct per team
      o.frequency.setValueAtTime(base * 2, t);
      o.frequency.exponentialRampToValueAtTime(base, t + 0.16);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.30, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.30);
      o.connect(g);
      this._pan(g, side === 'A' ? -0.7 : 0.7).connect(ctx.destination);
      o.start(t); o.stop(t + 0.32);
    }

    claim(side) {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx;
      const notes = side === 'A' ? [392, 523.25, 659.25] : [293.66, 392, 493.88];
      notes.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        const t = ctx.currentTime + i * 0.07;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.16, t + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
        o.connect(g);
        this._pan(g, side === 'A' ? -0.5 : 0.5).connect(ctx.destination);
        o.start(t); o.stop(t + 0.3);
      });
    }

    snap(intensity) {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      const len = Math.floor(ctx.sampleRate * 0.07);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf;
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
      bp.frequency.value = 600 + intensity * 1400; bp.Q.value = 1.8;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.30 + intensity * 0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
      src.connect(bp); bp.connect(g); g.connect(ctx.destination);
      src.start(t); src.stop(t + 0.1);
    }

    deny() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(160, t);
      o.frequency.exponentialRampToValueAtTime(70, t + 0.25);
      g.gain.setValueAtTime(0.22, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.3);
    }

    tick() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = 880;
      g.gain.setValueAtTime(0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.06);
    }

    danger() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx;
      const thump = (t) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(65, t);
        o.frequency.exponentialRampToValueAtTime(28, t + 0.18);
        g.gain.setValueAtTime(0.34, t);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.25);
      };
      thump(ctx.currentTime); thump(ctx.currentTime + 0.28);
    }

    startHum() {
      if (this.muted || !this._init() || this._osc) return;
      const ctx = this._ctx;
      this._osc = ctx.createOscillator();
      this._oscGain = ctx.createGain();
      this._osc.type = 'sawtooth';
      this._osc.frequency.value = 55;
      this._oscGain.gain.value = 0;
      this._osc.connect(this._oscGain);
      this._oscGain.connect(ctx.destination);
      this._osc.start();
    }
    setTension(tension) {
      if (!this._ctx || !this._osc) return;
      const now = this._ctx.currentTime;
      this._osc.frequency.setTargetAtTime(55 + tension * 100, now, 0.15);
      this._oscGain.gain.setTargetAtTime(this.muted ? 0 : tension * tension * 0.05, now, 0.15);
    }
    stopHum() { if (this._osc) { try { this._osc.stop(); } catch (e) {} this._osc = this._oscGain = null; } }

    victory(side) {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx;
      const freqs = side === 'A'
        ? [523.25, 659.25, 783.99, 1046.50]
        : [392.00, 493.88, 587.33, 783.99];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        const t = ctx.currentTime + i * 0.14;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.16, t + 0.06);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.65);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.7);
      });
    }

    setMuted(m) { this.muted = m; if (m && this._oscGain) this._oscGain.gain.value = 0; }
    stop() { this.stopHum(); if (this._ctx) { try { this._ctx.close(); } catch (e) {} this._ctx = null; } }
  }

  window.TowAudio = new TowAudioEngine();
})();
