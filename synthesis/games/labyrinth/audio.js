// ============================================================
//  LABYRINTH · REIMAGINED — audio.js
//  Tense-minimal synthesized kit (Web Audio, no asset files):
//   • heartbeat that quickens with the Minotaur's nearness
//   • a low sub-drone that swells with tension
//   • panned Minotaur footstep thuds (you hear it circling)
//   • sharp UI stings: pickup / correct / wrong / hurt / win / lose / descend
//  Exposes window.LabAudio. All scheduling is internal.
// ============================================================
(function () {
  'use strict';

  let ctx = null, master = null, droneGain = null, droneOsc = null, droneOsc2 = null, droneFilt = null;
  let muted = false, started = false;
  let tension = 0;            // 0..1 — set by the engine each frame
  let beatTimer = null, beatOn = false;

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 0.9;
    master.connect(ctx.destination);
    return ctx;
  }

  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }

  // ── low sub-drone bed ──
  function startDrone() {
    if (!ensure() || droneOsc) return;
    droneFilt = ctx.createBiquadFilter();
    droneFilt.type = 'lowpass';
    droneFilt.frequency.value = 220;
    droneGain = ctx.createGain();
    droneGain.gain.value = 0.0;
    droneOsc = ctx.createOscillator();
    droneOsc.type = 'sawtooth';
    droneOsc.frequency.value = 41.2;      // low E
    droneOsc2 = ctx.createOscillator();
    droneOsc2.type = 'sine';
    droneOsc2.frequency.value = 55;       // A, slow beating
    droneOsc.connect(droneFilt);
    droneOsc2.connect(droneFilt);
    droneFilt.connect(droneGain);
    droneGain.connect(master);
    droneOsc.start(); droneOsc2.start();
  }
  function stopDrone() {
    if (droneOsc) { try { droneOsc.stop(); droneOsc2.stop(); } catch (e) {} droneOsc = droneOsc2 = null; }
    droneGain = droneFilt = null;
  }

  // ── heartbeat scheduler (self-driving from `tension`) ──
  function thump(t0, freq, gain) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(freq, t0);
    o.frequency.exponentialRampToValueAtTime(freq * 0.5, t0 + 0.12);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    o.connect(g); g.connect(master);
    o.start(t0); o.stop(t0 + 0.2);
  }
  function beat() {
    if (!beatOn || !ctx) return;
    const amp = 0.18 + tension * 0.5;
    const t = ctx.currentTime;
    thump(t, 64, amp);           // lub
    thump(t + 0.14, 52, amp * 0.7); // dub
    // interval shrinks as tension rises: ~1.5s calm → ~0.42s terror
    const interval = 1500 - tension * 1080;
    beatTimer = setTimeout(beat, Math.max(360, interval));
  }
  function startBeat() { if (beatOn) return; beatOn = true; ensure(); beat(); }
  function stopBeat() { beatOn = false; if (beatTimer) { clearTimeout(beatTimer); beatTimer = null; } }

  // ── panned Minotaur footstep ──
  function footstep(pan, intensity) {
    if (!ensure() || muted) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    const p = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    o.type = 'triangle';
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(58, t + 0.1);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.06 + intensity * 0.14, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g);
    if (p) { p.pan.value = Math.max(-1, Math.min(1, pan)); g.connect(p); p.connect(master); }
    else g.connect(master);
    o.start(t); o.stop(t + 0.18);
  }

  // ── the hero's own footfall — a barely-there leather scuff ──
  let stepAlt = false;
  function stepSelf() {
    if (!ensure() || muted) return;
    const t = ctx.currentTime;
    stepAlt = !stepAlt;
    const dur = 0.07;
    const n = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, Math.max(1, (ctx.sampleRate * dur) | 0), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / d.length, 2);
    n.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.frequency.value = stepAlt ? 350 : 300;
    f.Q.value = 1.1;
    const g = ctx.createGain();
    g.gain.value = 0.03;
    n.connect(f); f.connect(g); g.connect(master);
    n.start(t);
  }

  // ── generic sting helper ──
  function tone(type, freq, dur, gain, slideTo, when) {
    if (!ensure() || muted) return;
    const t = (when || ctx.currentTime);
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); g.connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  function noiseHit(dur, gain, lp) {
    if (!ensure() || muted) return;
    const t = ctx.currentTime;
    const n = ctx.createBufferSource();
    const buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
    n.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp || 1800;
    const g = ctx.createGain(); g.gain.value = gain;
    n.connect(f); f.connect(g); g.connect(master);
    n.start(t);
  }

  const STINGS = {
    pickup() {  // lighting a brazier — bright rising
      tone('triangle', 520, 0.12, 0.18, 880);
      tone('sine', 784, 0.18, 0.12, 1175, (ctx ? ctx.currentTime + 0.06 : 0));
    },
    correct() {
      const t = ctx ? ctx.currentTime : 0;
      tone('triangle', 587, 0.1, 0.16, null, t);          // D5
      tone('triangle', 880, 0.16, 0.16, null, t + 0.09);  // A5
    },
    wrong() {
      tone('sawtooth', 180, 0.22, 0.18, 80);
      noiseHit(0.12, 0.08, 900);
    },
    hurt() {     // Minotaur strike
      tone('sawtooth', 140, 0.3, 0.28, 48);
      noiseHit(0.25, 0.2, 1200);
    },
    door() { tone('square', 220, 0.14, 0.1, 330); },
    lowTorch() {  // the torch gutters — a soft, worried sputter
      const t = ctx ? ctx.currentTime : 0;
      tone('triangle', 220, 0.14, 0.09, 140, t);
      tone('triangle', 175, 0.18, 0.08, 110, t + 0.16);
      noiseHit(0.1, 0.04, 1400);
    },
    descend() {
      const t = ctx ? ctx.currentTime : 0;
      tone('sine', 330, 0.5, 0.12, 110, t);
      tone('sine', 220, 0.6, 0.12, 70, t + 0.12);
    },
    win() {
      const t = ctx ? ctx.currentTime : 0;
      [523, 659, 784, 1047].forEach((f, i) => tone('triangle', f, 0.3, 0.16, null, t + i * 0.12));
    },
    lose() {
      const t = ctx ? ctx.currentTime : 0;
      tone('sawtooth', 220, 0.7, 0.2, 55, t);
      tone('sawtooth', 165, 0.9, 0.2, 41, t + 0.15);
      noiseHit(0.5, 0.12, 700);
    },
  };

  function sting(name) { resume(); if (STINGS[name]) STINGS[name](); }

  window.LabAudio = {
    init() { ensure(); resume(); },
    start() { ensure(); resume(); started = true; startDrone(); startBeat(); },
    stop() { stopBeat(); stopDrone(); started = false; },
    // engine pushes 0..1 tension each frame
    setTension(t) {
      tension = Math.max(0, Math.min(1, t));
      if (droneGain && ctx) droneGain.gain.setTargetAtTime(0.04 + tension * 0.16, ctx.currentTime, 0.3);
      if (droneFilt && ctx) droneFilt.frequency.setTargetAtTime(160 + tension * 320, ctx.currentTime, 0.3);
    },
    footstep, stepSelf, sting,
    setMuted(m) { muted = m; if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.05); },
    isMuted() { return muted; },
    get tension() { return tension; },
  };
})();
