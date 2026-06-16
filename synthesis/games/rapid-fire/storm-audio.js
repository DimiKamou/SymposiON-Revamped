// ============================================================
//  ΚΑΤΑΙΓΙΣΜΟΣ · Reimagined — Web Audio SFX kit  (window.StormAudio)
//  No asset files: everything is synthesized.
//    strike(intensity)   — lightning crack on a correct answer (gold zap + thunder tail)
//    thunder(intensity)  — layered rumble burst (used by overdrive + big strikes)
//    wrong()             — dull crimson deny / clock bleed
//    combo(level)        — rising arpeggio that climbs with the streak (1..4)
//    gust(t)             — soft airy "time added" whoosh
//    overdrive()         — the storm breaks: huge thunder + electric drone swells in
//    overdriveEnd()      — drone fades, calm returns
//    tick(low)           — countdown / low-clock warning tick (sharper when low)
//    startRain/setRain/stopRain — continuous filtered-noise rain bed (intensity 0..1)
//    end()               — "the storm passes" descending wash
//    setMuted / stop
// ============================================================
(function () {
  class StormAudioEngine {
    constructor() {
      this._ctx = null; this.muted = false;
      this._drone = null; this._droneGain = null;
      this._rainSrc = null; this._rainGain = null; this._rainFilt = null;
    }
    _init() {
      if (this._ctx) { if (this._ctx.state === 'suspended') this._ctx.resume(); return true; }
      try { this._ctx = new (window.AudioContext || window.webkitAudioContext)(); return true; }
      catch (e) { return false; }
    }
    _noiseBuffer(dur) {
      const ctx = this._ctx, len = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, len, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
      return buf;
    }

    // ── lightning crack: a bright electric zap with a noise transient ──
    strike(intensity) {
      if (this.muted || !this._init()) return;
      intensity = Math.max(0.15, Math.min(1, intensity || 0.5));
      const ctx = this._ctx, t = ctx.currentTime;

      // crackle transient — short hi-passed noise
      const src = ctx.createBufferSource(); src.buffer = this._noiseBuffer(0.12);
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass';
      hp.frequency.value = 2200 + intensity * 2400; hp.Q.value = 0.7;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.16 + intensity * 0.20, t);
      ng.gain.exponentialRampToValueAtTime(0.001, t + 0.11);
      src.connect(hp); hp.connect(ng); ng.connect(ctx.destination);
      src.start(t); src.stop(t + 0.13);

      // gold zap tone — fast descending square
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'square';
      const top = 1400 + intensity * 900;
      o.frequency.setValueAtTime(top, t);
      o.frequency.exponentialRampToValueAtTime(260, t + 0.16);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.18 + intensity * 0.10, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.24);

      // sub thunder tail for bigger strikes
      if (intensity > 0.45) this.thunder(intensity * 0.8);
    }

    // ── rolling thunder: low rumble of band-passed noise + sine sub ──
    thunder(intensity) {
      if (this.muted || !this._init()) return;
      intensity = Math.max(0.2, Math.min(1, intensity || 0.6));
      const ctx = this._ctx, t = ctx.currentTime, dur = 0.5 + intensity * 0.7;

      const src = ctx.createBufferSource(); src.buffer = this._noiseBuffer(dur);
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass';
      lp.frequency.setValueAtTime(420, t);
      lp.frequency.exponentialRampToValueAtTime(90, t + dur);
      lp.Q.value = 0.6;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.10 + intensity * 0.18, t + 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(lp); lp.connect(g); g.connect(ctx.destination);
      src.start(t); src.stop(t + dur + 0.02);

      // sine sub-boom
      const o = ctx.createOscillator(), og = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(58, t);
      o.frequency.exponentialRampToValueAtTime(30, t + dur * 0.8);
      og.gain.setValueAtTime(0.0001, t);
      og.gain.linearRampToValueAtTime(0.16 + intensity * 0.16, t + 0.05);
      og.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(og); og.connect(ctx.destination);
      o.start(t); o.stop(t + dur + 0.02);
    }

    wrong() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(150, t);
      o.frequency.exponentialRampToValueAtTime(58, t + 0.3);
      g.gain.setValueAtTime(0.20, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.34);
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.36);
      // a short fizzle of rain falling away
      const src = ctx.createBufferSource(); src.buffer = this._noiseBuffer(0.18);
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 900; bp.Q.value = 0.8;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0.10, t); ng.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      src.connect(bp); bp.connect(ng); ng.connect(ctx.destination);
      src.start(t); src.stop(t + 0.2);
    }

    // ── rising arpeggio; higher streak = brighter, taller ──
    combo(level) {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx;
      level = Math.max(1, Math.min(4, level || 1));
      const scale = [392.0, 493.88, 587.33, 698.46, 783.99, 987.77]; // G major-ish climb
      const n = 2 + level; // more notes as streak grows
      for (let i = 0; i < n; i++) {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle';
        o.frequency.value = scale[Math.min(i, scale.length - 1)] * (level >= 4 ? 1.5 : 1);
        const t = ctx.currentTime + i * 0.05;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.12, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.22);
      }
    }

    // soft airy whoosh = time added to the storm clock
    gust(amount) {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime, dur = 0.26;
      const src = ctx.createBufferSource(); src.buffer = this._noiseBuffer(dur);
      const bp = ctx.createBiquadFilter(); bp.type = 'bandpass';
      bp.frequency.setValueAtTime(500, t);
      bp.frequency.exponentialRampToValueAtTime(1800, t + dur);
      bp.Q.value = 0.9;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.linearRampToValueAtTime(0.07 + Math.min(0.06, (amount || 1) * 0.02), t + 0.06);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      src.connect(bp); bp.connect(g); g.connect(ctx.destination);
      src.start(t); src.stop(t + dur + 0.02);
    }

    // ── the storm breaks → start the electric drone bed ──
    overdrive() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx;
      this.thunder(1);
      if (this._drone) return;
      this._drone = ctx.createOscillator();
      const detune = ctx.createOscillator();
      this._droneGain = ctx.createGain();
      const merge = ctx.createGain();
      this._drone.type = 'sawtooth'; this._drone.frequency.value = 73.42; // D2
      detune.type = 'sawtooth'; detune.frequency.value = 74.6;            // slight beat
      this._droneGain.gain.value = 0;
      this._drone.connect(merge); detune.connect(merge);
      merge.connect(this._droneGain); this._droneGain.connect(ctx.destination);
      this._drone.start(); detune.start();
      this._droneDetune = detune;
      this._droneGain.gain.setTargetAtTime(this.muted ? 0 : 0.07, ctx.currentTime, 0.25);
    }
    overdriveEnd() {
      if (!this._ctx) return;
      if (this._droneGain) this._droneGain.gain.setTargetAtTime(0, this._ctx.currentTime, 0.3);
      const dr = this._drone, dt = this._droneDetune;
      this._drone = this._droneDetune = this._droneGain = null;
      setTimeout(() => { try { dr && dr.stop(); } catch (e) {} try { dt && dt.stop(); } catch (e) {} }, 700);
      this.thunder(0.6);
    }

    tick(low) {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx, t = ctx.currentTime;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = 'sine'; o.frequency.value = low ? 1244 : 880;
      g.gain.setValueAtTime(low ? 0.12 : 0.08, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + (low ? 0.07 : 0.05));
      o.connect(g); g.connect(ctx.destination);
      o.start(t); o.stop(t + 0.08);
    }

    // ── continuous rain bed (filtered noise loop) ──
    startRain() {
      if (!this._init() || this._rainSrc) return;
      const ctx = this._ctx;
      const src = ctx.createBufferSource();
      src.buffer = this._noiseBuffer(2.2); src.loop = true;
      const filt = ctx.createBiquadFilter(); filt.type = 'bandpass';
      filt.frequency.value = 2400; filt.Q.value = 0.5;
      const g = ctx.createGain(); g.gain.value = 0;
      src.connect(filt); filt.connect(g); g.connect(ctx.destination);
      src.start();
      this._rainSrc = src; this._rainGain = g; this._rainFilt = filt;
    }
    setRain(intensity) {
      if (!this._ctx || !this._rainGain) return;
      const now = this._ctx.currentTime;
      const v = this.muted ? 0 : Math.max(0, Math.min(1, intensity)) * 0.05;
      this._rainGain.gain.setTargetAtTime(v, now, 0.4);
      this._rainFilt.frequency.setTargetAtTime(1800 + intensity * 1600, now, 0.4);
    }
    stopRain() {
      if (this._rainSrc) { try { this._rainSrc.stop(); } catch (e) {} }
      this._rainSrc = this._rainGain = this._rainFilt = null;
    }

    end() {
      if (this.muted || !this._init()) return;
      const ctx = this._ctx;
      const freqs = [659.25, 587.33, 493.88, 392.0, 329.63];
      freqs.forEach((f, i) => {
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'triangle'; o.frequency.value = f;
        const t = ctx.currentTime + i * 0.13;
        g.gain.setValueAtTime(0, t);
        g.gain.linearRampToValueAtTime(0.13, t + 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
        o.connect(g); g.connect(ctx.destination);
        o.start(t); o.stop(t + 0.62);
      });
      this.thunder(0.4);
    }

    setMuted(m) {
      this.muted = m;
      if (this._droneGain) this._droneGain.gain.value = m ? 0 : 0.07;
      if (this._rainGain) this._rainGain.gain.value = m ? 0 : this._rainGain.gain.value;
    }
    stop() {
      this.overdriveEnd(); this.stopRain();
      if (this._ctx) { try { this._ctx.close(); } catch (e) {} this._ctx = null; }
    }
  }

  window.StormAudio = new StormAudioEngine();
})();
