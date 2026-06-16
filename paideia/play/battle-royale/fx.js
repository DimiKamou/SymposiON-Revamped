/* ============================================================
   Battle Royale — fx.js
   Tiny WebAudio sound engine (no asset files) + screen shake.
   Every sound is synthesised on the fly. window.BR_FX.
   ============================================================ */
(function () {
  let ctx = null;
  let enabled = true;

  function ac() {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); }
      catch (e) { ctx = null; }
    }
    if (ctx && ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  function setEnabled(v) { enabled = !!v; }

  // a single oscillator "blip"
  function tone({ freq = 440, dur = 0.12, type = 'sine', gain = 0.18, slideTo = null, delay = 0 }) {
    if (!enabled) return;
    const c = ac(); if (!c) return;
    const t0 = c.currentTime + delay;
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g).connect(c.destination);
    osc.start(t0); osc.stop(t0 + dur + 0.02);
  }

  // filtered noise burst (clashes, crowd)
  function noise({ dur = 0.3, gain = 0.2, type = 'highpass', freq = 1200, delay = 0 }) {
    if (!enabled) return;
    const c = ac(); if (!c) return;
    const t0 = c.currentTime + delay;
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource(); src.buffer = buf;
    const filt = c.createBiquadFilter(); filt.type = type; filt.frequency.value = freq;
    const g = c.createGain();
    g.gain.setValueAtTime(gain, t0);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(filt).connect(g).connect(c.destination);
    src.start(t0); src.stop(t0 + dur);
  }

  const S = {
    tick:    () => tone({ freq: 540, dur: 0.08, type: 'square', gain: 0.10 }),
    go:      () => { tone({ freq: 330, slideTo: 660, dur: 0.28, type: 'sawtooth', gain: 0.16 }); noise({ dur: 0.18, gain: 0.10, freq: 900 }); },
    clash:   () => { noise({ dur: 0.22, gain: 0.28, type: 'highpass', freq: 2600 }); tone({ freq: 180, slideTo: 90, dur: 0.2, type: 'triangle', gain: 0.14 }); },
    select:  () => tone({ freq: 620, dur: 0.07, type: 'sine', gain: 0.12 }),
    correct: () => { tone({ freq: 523, dur: 0.1, type: 'sine', gain: 0.16 }); tone({ freq: 784, dur: 0.14, type: 'sine', gain: 0.16, delay: 0.09 }); },
    wrong:   () => tone({ freq: 196, slideTo: 110, dur: 0.3, type: 'sawtooth', gain: 0.16 }),
    roundWin:  () => { tone({ freq: 659, dur: 0.12, gain: 0.16 }); tone({ freq: 988, dur: 0.18, gain: 0.16, delay: 0.1 }); },
    roundLose: () => { tone({ freq: 330, dur: 0.16, type: 'triangle', gain: 0.14 }); tone({ freq: 247, dur: 0.22, type: 'triangle', gain: 0.14, delay: 0.12 }); },
    blaze:   () => { tone({ freq: 880, slideTo: 1320, dur: 0.16, type: 'sine', gain: 0.16 }); tone({ freq: 1320, dur: 0.12, gain: 0.12, delay: 0.12 }); },
    power:   () => { tone({ freq: 700, slideTo: 1400, dur: 0.18, type: 'sine', gain: 0.14 }); },
    freeze:  () => { tone({ freq: 1400, slideTo: 400, dur: 0.4, type: 'sine', gain: 0.14 }); },
    victory: () => { [523, 659, 784, 1047].forEach((f, i) => tone({ freq: f, dur: 0.22, gain: 0.16, delay: i * 0.13 })); noise({ dur: 0.6, gain: 0.08, freq: 3000, delay: 0.1 }); },
    defeat:  () => { [440, 392, 330, 262].forEach((f, i) => tone({ freq: f, dur: 0.3, type: 'triangle', gain: 0.14, delay: i * 0.16 })); },
    crowd:   () => noise({ dur: 0.8, gain: 0.07, type: 'bandpass', freq: 700 }),
  };

  function play(name) { try { (S[name] || (()=>{}))(); } catch (e) {} }

  // screen shake — toggles a class on #root
  function shake(strength) {
    const r = document.getElementById('root');
    if (!r) return;
    const cls = strength === 'big' ? 'shake-big' : 'shake-sm';
    r.classList.remove('shake-sm', 'shake-big');
    void r.offsetWidth; // reflow to restart
    r.classList.add(cls);
    setTimeout(() => r.classList.remove(cls), 600);
  }

  function buzz(ms) { try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {} }

  window.BR_FX = { play, shake, buzz, setEnabled, resume: ac };
})();
