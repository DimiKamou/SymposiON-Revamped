/* sfx.js — tiny WebAudio synth for combat sounds (no asset files).
   Lazily inits on first user gesture (autoplay policy). window.SFX. */
(function(){
'use strict';
let ac=null, master=null;
function init(){ if(ac){ if(ac.state==='suspended') ac.resume(); return; }
  try{ ac=new (window.AudioContext||window.webkitAudioContext)(); }catch(e){ return; }
  master=ac.createGain(); master.gain.value=0.32; master.connect(ac.destination); }
function noise(dur){ const n=(ac.sampleRate*dur)|0, b=ac.createBuffer(1,n,ac.sampleRate), d=b.getChannelData(0);
  for(let i=0;i<n;i++) d[i]=Math.random()*2-1; const s=ac.createBufferSource(); s.buffer=b; return s; }
function env(g,t0,a,d,peak){ g.gain.setValueAtTime(0.0001,t0); g.gain.linearRampToValueAtTime(peak,t0+a); g.gain.exponentialRampToValueAtTime(0.0001,t0+a+d); }

function slash(){ if(!ac) return; const t=ac.currentTime;
  const s=noise(0.22), bp=ac.createBiquadFilter(); bp.type='bandpass'; bp.Q.value=0.9;
  bp.frequency.setValueAtTime(2800,t); bp.frequency.exponentialRampToValueAtTime(680,t+0.18);
  const g=ac.createGain(); env(g,t,0.004,0.17,0.62); s.connect(bp).connect(g).connect(master); s.start(t); s.stop(t+0.24);
  const o=ac.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(2200,t); o.frequency.exponentialRampToValueAtTime(900,t+0.1);
  const g2=ac.createGain(); env(g2,t,0.002,0.09,0.16); o.connect(g2).connect(master); o.start(t); o.stop(t+0.12); }

function ranged(type){ if(!ac) return; const t=ac.currentTime; const arrow=type==='arrow';
  const o=ac.createOscillator(); o.type=arrow?'sawtooth':'square'; const f0=arrow?980:560;
  o.frequency.setValueAtTime(f0,t); o.frequency.exponentialRampToValueAtTime(f0*0.28,t+0.12);
  const g=ac.createGain(); env(g,t,0.003,0.11,0.32); o.connect(g).connect(master); o.start(t); o.stop(t+0.14);
  const s=noise(0.08), hp=ac.createBiquadFilter(); hp.type='highpass'; hp.frequency.value=1900;
  const g2=ac.createGain(); env(g2,t,0.001,0.06,0.22); s.connect(hp).connect(g2).connect(master); s.start(t); s.stop(t+0.09); }

function block(){ if(!ac) return; const t=ac.currentTime;
  [1500,2250].forEach((f,i)=>{ const o=ac.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(f,t);
    const g=ac.createGain(); env(g,t,0.001,0.12,0.28-i*0.1); o.connect(g).connect(master); o.start(t); o.stop(t+0.14); });
  const s=noise(0.05), g3=ac.createGain(); env(g3,t,0.001,0.04,0.2); s.connect(g3).connect(master); s.start(t); s.stop(t+0.06); }

function parry(){ if(!ac) return; const t=ac.currentTime;
  const o=ac.createOscillator(); o.type='triangle'; o.frequency.setValueAtTime(2500,t); o.frequency.exponentialRampToValueAtTime(3700,t+0.09);
  const g=ac.createGain(); env(g,t,0.001,0.2,0.34); o.connect(g).connect(master); o.start(t); o.stop(t+0.22);
  const o2=ac.createOscillator(); o2.type='sine'; o2.frequency.setValueAtTime(1700,t);
  const g2=ac.createGain(); env(g2,t,0.001,0.12,0.2); o2.connect(g2).connect(master); o2.start(t); o2.stop(t+0.14); }

function hurt(){ if(!ac) return; const t=ac.currentTime;
  const o=ac.createOscillator(); o.type='sine'; o.frequency.setValueAtTime(190,t); o.frequency.exponentialRampToValueAtTime(58,t+0.18);
  const g=ac.createGain(); env(g,t,0.002,0.2,0.5); o.connect(g).connect(master); o.start(t); o.stop(t+0.24);
  const s=noise(0.12), lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=900;
  const g2=ac.createGain(); env(g2,t,0.001,0.1,0.34); s.connect(lp).connect(g2).connect(master); s.start(t); s.stop(t+0.13); }

function ult(){ if(!ac) return; const t=ac.currentTime;
  const o=ac.createOscillator(); o.type='sawtooth'; o.frequency.setValueAtTime(70,t); o.frequency.exponentialRampToValueAtTime(230,t+0.5);
  const lp=ac.createBiquadFilter(); lp.type='lowpass'; lp.frequency.setValueAtTime(380,t); lp.frequency.exponentialRampToValueAtTime(2700,t+0.4);
  const g=ac.createGain(); env(g,t,0.01,0.62,0.62); o.connect(lp).connect(g).connect(master); o.start(t); o.stop(t+0.66);
  const s=noise(0.6), bp=ac.createBiquadFilter(); bp.type='bandpass'; bp.frequency.setValueAtTime(300,t); bp.frequency.exponentialRampToValueAtTime(3200,t+0.45);
  const g2=ac.createGain(); env(g2,t,0.01,0.5,0.4); s.connect(bp).connect(g2).connect(master); s.start(t); s.stop(t+0.6);
  const o2=ac.createOscillator(); o2.type='triangle'; o2.frequency.setValueAtTime(880,t+0.08); o2.frequency.linearRampToValueAtTime(1340,t+0.5);
  const g3=ac.createGain(); env(g3,t+0.08,0.02,0.42,0.18); o2.connect(g3).connect(master); o2.start(t+0.08); o2.stop(t+0.56); }

window.SFX={ init, slash, ranged, block, parry, hurt, ult,
  setMuted(m){ try{ if(master) master.gain.value = m?0:0.32; }catch(e){} },
  toggleMute(){ const m = master? master.gain.value>0 : false; this.setMuted(m); return m; } };
})();
