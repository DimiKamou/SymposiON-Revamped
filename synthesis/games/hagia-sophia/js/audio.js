/* ============================================================
   Hagia Sophia 537 — audio.js
   Fully generative ambience (no audio assets): a low ison-like
   drone with slow beating partials through a synthesized
   cathedral reverb, plus soft footsteps. Off until user enables.
   ============================================================ */
HS.Ambience = function () {
  let ctx = null, master = null, on = false, stepGain = null, stepBuf = null;

  function impulse(seconds, decay) {
    const rate = ctx.sampleRate, len = rate * seconds;
    const buf = ctx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++)
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay);
    }
    return buf;
  }

  function start() {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.0;
    const verb = ctx.createConvolver();
    verb.buffer = impulse(4.4, 2.6);
    const verbGain = ctx.createGain(); verbGain.gain.value = 0.8;
    master.connect(verb); verb.connect(verbGain);
    verbGain.connect(ctx.destination);
    const dry = ctx.createGain(); dry.gain.value = 0.35;
    master.connect(dry); dry.connect(ctx.destination);

    // drone: D2 + A2 + D3 partials, slightly detuned pairs
    [[73.42, 0.05], [73.9, 0.035], [110, 0.028], [110.5, 0.02], [146.8, 0.016], [220.3, 0.008]]
      .forEach(([f, g], i) => {
        const o = ctx.createOscillator();
        o.type = i < 2 ? 'sawtooth' : 'sine';
        o.frequency.value = f;
        const og = ctx.createGain(); og.gain.value = g;
        const filt = ctx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 480;
        o.connect(filt); filt.connect(og); og.connect(master);
        // very slow amplitude drift
        const lfo = ctx.createOscillator(); lfo.frequency.value = 0.03 + i * 0.017;
        const lg = ctx.createGain(); lg.gain.value = g * 0.45;
        lfo.connect(lg); lg.connect(og.gain);
        o.start(); lfo.start();
      });
    // air
    const noise = ctx.createBufferSource();
    noise.buffer = impulse(6, 0.0001); noise.loop = true;
    const nf = ctx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = 850; nf.Q.value = 0.4;
    const ng = ctx.createGain(); ng.gain.value = 0.012;
    noise.connect(nf); nf.connect(ng); ng.connect(master);
    noise.start();
    // footsteps bus
    stepGain = ctx.createGain(); stepGain.gain.value = 0.0;
    const sf = ctx.createBiquadFilter(); sf.type = 'lowpass'; sf.frequency.value = 300;
    stepGain.connect(sf); sf.connect(ctx.destination);
    stepBuf = impulse(0.09, 6);
  }

  let stepT = 0;
  this.tickSteps = function (dt, moving, running) {
    if (!on || !ctx) return;
    stepT -= dt;
    if (moving && stepT <= 0) {
      stepT = running ? 0.34 : 0.52;
      const s = ctx.createBufferSource(); s.buffer = stepBuf;
      const g = ctx.createGain(); g.gain.value = 0.16 + Math.random() * 0.06;
      s.connect(g); g.connect(stepGain);
      s.start();
    }
  };

  this.setOn = function (v) {
    on = v;
    if (v && !ctx) start();
    if (ctx) {
      ctx.resume && ctx.resume();
      master.gain.linearRampToValueAtTime(v ? 0.9 : 0.0, ctx.currentTime + 1.2);
      stepGain.gain.linearRampToValueAtTime(v ? 1.0 : 0.0, ctx.currentTime + 0.5);
    }
  };
  this.isOn = function () { return on; };
};
