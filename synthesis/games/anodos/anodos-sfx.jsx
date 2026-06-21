/* ════════════════════════════════════════════════════════════════════
   ΑΝΟΔΟΣ — SFX · a tiny Web Audio lyre. No assets; all synthesised.
   Toggle with window.__sfxOn (driven by the "sound" tweak).
   playSfx(name) — names: correct · wrong · hit · reward · surge · boss ·
                          win · lose · curse · click · move
   ════════════════════════════════════════════════════════════════════ */
(function () {
  let ctx = null;
  let master = null;
  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.5;
      master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  // a single plucked note (lyre-ish): triangle + soft sine body, fast decay
  function pluck(freq, t0, dur, gain, type) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "triangle";
    o.frequency.setValueAtTime(freq, t0);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  // a low body thud (for hits): sine sweeping down
  function thud(freqA, freqB, t0, dur, gain) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.setValueAtTime(freqA, t0);
    o.frequency.exponentialRampToValueAtTime(freqB, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  }
  // a touch of noise (for the dull strike)
  function noise(t0, dur, gain) {
    const n = Math.floor(ctx.sampleRate * dur);
    const buf = ctx.createBuffer(1, n, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = "lowpass"; f.frequency.value = 900;
    const g = ctx.createGain(); g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t0); src.stop(t0 + dur);
  }

  // Lydian-ish gentle scale degrees (Hz) for lyre figures
  const N = { D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.0, A4: 440.0, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, A3: 220.0, D3: 146.83, G3: 196.0 };

  const SFX = {
    correct() { const t = ctx.currentTime; pluck(N.A4, t, 0.5, 0.22); pluck(N.E5, t + 0.07, 0.55, 0.18); },
    wrong()   { const t = ctx.currentTime; thud(180, 90, t, 0.34, 0.3); noise(t, 0.12, 0.06); },
    hit()     { const t = ctx.currentTime; thud(150, 70, t, 0.4, 0.34); noise(t, 0.16, 0.09); },
    reward()  { const t = ctx.currentTime; [N.A4, N.C5, N.E5].forEach((f, i) => pluck(f, t + i * 0.06, 0.6, 0.16)); },
    surge()   { const t = ctx.currentTime; [N.D5, N.A4, N.D5, N.E5].forEach((f, i) => pluck(f, t + i * 0.05, 0.5, 0.17, "sawtooth")); },
    boss()    { const t = ctx.currentTime; thud(120, 55, t, 0.9, 0.34); pluck(N.D3, t, 1.1, 0.16, "sine"); },
    win()     { const t = ctx.currentTime; [N.D4, N.F4, N.A4, N.D5, N.E5].forEach((f, i) => pluck(f, t + i * 0.11, 1.0, 0.2)); },
    lose()    { const t = ctx.currentTime; [N.G4, N.F4, N.D4, N.A3].forEach((f, i) => thud(f, f * 0.5, t + i * 0.13, 0.5, 0.2)); },
    curse()   { const t = ctx.currentTime; thud(220, 70, t, 0.7, 0.22); pluck(133, t + 0.04, 0.7, 0.12, "sawtooth"); },
    click()   { const t = ctx.currentTime; pluck(N.A4, t, 0.16, 0.1); },
    move()    { const t = ctx.currentTime; pluck(N.G4, t, 0.22, 0.12); pluck(N.D5, t + 0.05, 0.26, 0.09); },
  };

  window.playSfx = function (name) {
    if (!window.__sfxOn) return;
    if (!ac()) return;
    const fn = SFX[name]; if (fn) { try { fn(); } catch (e) {} }
  };

  // ── ambient music: a slow Dorian drone pad with a wandering filter ──
  let music = null;
  function startMusic() {
    if (!ac() || music) return;
    const t = ctx.currentTime;
    const g = ctx.createGain(); g.gain.value = 0.0001; g.connect(master);
    g.gain.exponentialRampToValueAtTime(0.085, t + 4);
    const filt = ctx.createBiquadFilter(); filt.type = "lowpass"; filt.frequency.value = 500; filt.Q.value = 6; filt.connect(g);
    // slow filter sweep
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.045; lfoG.gain.value = 280; lfo.connect(lfoG); lfoG.connect(filt.frequency); lfo.start();
    // drone voices — D2 root, A2 fifth, D3 octave (matches the lyre's key)
    const voices = [{ f: 73.42, t: "sawtooth", g: 0.26 }, { f: 110.0, t: "sawtooth", g: 0.2 }, { f: 146.83, t: "triangle", g: 0.16 }];
    const oscs = voices.map((v, i) => {
      const o = ctx.createOscillator(); o.type = v.t; o.frequency.value = v.f;
      const og = ctx.createGain(); og.gain.value = v.g;
      // gentle detune drift so the pad breathes
      const d = ctx.createOscillator(); const dg = ctx.createGain();
      d.frequency.value = 0.06 + i * 0.025; dg.gain.value = 2.2; d.connect(dg); dg.connect(o.detune); d.start();
      o.connect(og); og.connect(filt); o.start();
      return { o, d };
    });
    music = { g, filt, lfo, oscs };
  }
  function stopMusic() {
    if (!music) return;
    const m = music; music = null;
    try {
      const t = ctx.currentTime;
      m.g.gain.cancelScheduledValues(t);
      m.g.gain.setValueAtTime(Math.max(0.0001, m.g.gain.value), t);
      m.g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
      setTimeout(() => { try { m.oscs.forEach((v) => { v.o.stop(); v.d.stop(); }); m.lfo.stop(); } catch (e) {} }, 2000);
    } catch (e) {}
  }
  window.startMusic = function () { window.__musicOn = true; startMusic(); };
  window.stopMusic = function () { window.__musicOn = false; stopMusic(); };

  // priming on first user gesture (so the context is unlocked early)
  window.primeSfx = function () { if (window.__sfxOn) ac(); };
})();
