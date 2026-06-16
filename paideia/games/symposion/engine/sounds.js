/* ════════════════════════════════════════════════════════════════════
   Συμπόσιον — sounds.js
   Tiny synthesized Web-Audio kit (no audio files). Created lazily on the
   first user gesture. Exposes window.SYM_SOUND with named cues that the
   host wires to engine events: dice roll, tile chimes, fortune cards,
   correct/wrong, lap coin, victory fanfare. Mutable + persisted.
   ════════════════════════════════════════════════════════════════════ */
(function (root) {
  const Sound = {
    ctx: null,
    master: null,
    on: true,

    init() {
      if (!this.ctx) {
        const AC = root.AudioContext || root.webkitAudioContext;
        if (!AC) return;
        try {
          this.ctx = new AC();
          this.master = this.ctx.createGain();
          this.master.gain.value = 0.5;
          this.master.connect(this.ctx.destination);
        } catch (e) { this.ctx = null; return; }
      }
      if (this.ctx.state === 'suspended') this.ctx.resume();
      try { this.on = JSON.parse(localStorage.getItem('symposion.sound') ?? 'true'); } catch (e) {}
    },
    setOn(v) { this.on = !!v; try { localStorage.setItem('symposion.sound', JSON.stringify(this.on)); } catch (e) {} },
    toggle() { this.setOn(!this.on); return this.on; },

    tone(freq, dur, opts) {
      if (!this.on || !this.ctx) return;
      const o = opts || {};
      const t = this.ctx.currentTime + (o.when || 0);
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = o.type || 'sine';
      osc.frequency.setValueAtTime(freq, t);
      if (o.glideTo) osc.frequency.exponentialRampToValueAtTime(o.glideTo, t + dur);
      const gain = o.gain == null ? 0.2 : o.gain;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(gain, t + (o.attack || 0.006));
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur + (o.release || 0.09));
      osc.connect(g).connect(this.master);
      osc.start(t); osc.stop(t + dur + (o.release || 0.09) + 0.02);
    },

    noise(dur, opts) {
      if (!this.on || !this.ctx) return;
      const o = opts || {};
      const t = this.ctx.currentTime + (o.when || 0);
      const n = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
      const buf = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      const src = this.ctx.createBufferSource(); src.buffer = buf;
      const bp = this.ctx.createBiquadFilter();
      bp.type = o.type || 'bandpass'; bp.frequency.value = o.freq || 1200; bp.Q.value = o.q || 1;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(o.gain == null ? 0.2 : o.gain, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(bp).connect(g).connect(this.master);
      src.start(t); src.stop(t + dur + 0.02);
    },

    dice() {
      this.init();
      for (let i = 0; i < 6; i++)
        this.noise(0.05, { when: i * 0.075 + Math.random() * 0.02, gain: 0.16, freq: 800 + Math.random() * 1400, q: 1.6 });
    },
    thud() { this.init(); this.tone(150, 0.12, { type: 'sine', gain: 0.2, glideTo: 70 }); this.noise(0.08, { gain: 0.1, freq: 240, q: 0.6 }); },
    chime() { this.init(); this.tone(880, 0.18, { type: 'sine', gain: 0.16 }); this.tone(1320, 0.24, { type: 'sine', gain: 0.1, when: 0.03 }); },
    correct() { this.init(); [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.17, { type: 'triangle', gain: 0.16, when: i * 0.085 })); },
    wrong() { this.init(); this.tone(220, 0.3, { type: 'sawtooth', gain: 0.12, glideTo: 110 }); this.tone(164, 0.32, { type: 'square', gain: 0.05, when: 0.02 }); },
    event() { this.init(); this.tone(660, 0.4, { type: 'sine', gain: 0.12, glideTo: 990 }); this.tone(990, 0.5, { type: 'sine', gain: 0.07, when: 0.12, glideTo: 1320 }); },
    strike() { this.init(); this.tone(130, 0.42, { type: 'sawtooth', gain: 0.22, glideTo: 55 }); this.noise(0.28, { gain: 0.2, freq: 320, q: 0.7 }); this.tone(300, 0.18, { type: 'square', gain: 0.07, when: 0.02 }); },
    coin() { this.init(); this.tone(1318, 0.1, { type: 'square', gain: 0.12 }); this.tone(1760, 0.16, { type: 'square', gain: 0.1, when: 0.07 }); this.tone(2093, 0.18, { type: 'square', gain: 0.06, when: 0.14 }); },
    jail() { this.init(); this.tone(160, 0.5, { type: 'square', gain: 0.16, glideTo: 110 }); this.tone(232, 0.5, { type: 'sawtooth', gain: 0.07 }); this.noise(0.3, { gain: 0.12, freq: 480, q: 0.5 }); },
    bonus() { this.init(); [659, 880, 1175].forEach((f, i) => this.tone(f, 0.2, { type: 'triangle', gain: 0.15, when: i * 0.09 })); },
    win() {
      this.init();
      const seq = [523, 659, 784, 1047, 1319];
      seq.forEach((f, i) => this.tone(f, 0.28, { type: 'triangle', gain: 0.18, when: i * 0.13 }));
      this.tone(1047, 0.7, { type: 'triangle', gain: 0.14, when: 0.66 });
      this.tone(1568, 0.7, { type: 'sine', gain: 0.1, when: 0.66 });
    },
  };

  root.SYM_SOUND = Sound;
})(window);
