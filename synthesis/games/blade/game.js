// ══════════════════════════════════════════════════════════
// GRAMMARIAN'S BLADE — Ξίφος του Γραμματικού
// Fruit-Ninja-feel grammar slicer · vanilla JS + Canvas
//
// Reimagined: velocity-gated glowing blade ribbon, procedural
// throwables (amphorae / kylikes / pomegranates / figs) that
// split into two spinning halves, juice splatter + fading floor
// decals, bomb-style detonation on wrong forms, combo callouts,
// critical slices, frenzy waves, golden multi-hit pomegranate,
// slice-to-select menu, WebAudio synth SFX — all in a Greek
// courtyard at dusk.
//
// Launch contract preserved: window.openBlade / window.closeBlade,
// #blade-overlay / #blade-wrap, NOUN_RAW_A/B/C + PAR_G + GP pools,
// localStorage 'blade_best_<mode>', symLogMistake, awardGameRewards.
// ══════════════════════════════════════════════════════════

const BLADE_CASES = ['ΟΝΟΜΑΣΤΙΚΗ','ΓΕΝΙΚΗ','ΔΟΤΙΚΗ','ΑΙΤΙΑΤΙΚΗ','ΚΛΗΤΙΚΗ'];
const BLADE_NUMS  = ['ΕΝΙΚΟΥ','ΠΛΗΘΥΝΤΙΚΟΥ'];
const BLADE_DEG   = { 'συγκριτικός':'ΣΥΓΚΡΙΤΙΚΟΣ ΒΑΘΜΟΣ', 'υπερθετικός':'ΥΠΕΡΘΕΤΙΚΟΣ ΒΑΘΜΟΣ' };

const BLADE_REDUCED = (function(){
  try { return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; }
  catch (e) { return false; }
})();

// ── Bundled fallback paradigms (verbatim rows from ousiastika/data.js
//    and paratheta/game.js) so the game ALWAYS opens with real content,
//    even before the full databases are lazy-loaded. ──────────────────
const BLADE_FB_A = [
  ["ὁ νεανίας", "αρσενικό", ["νεανίας","νεανίου","νεανίᾳ","νεανίαν","νεανία"], ["νεανίαι","νεανιῶν","νεανίαις","νεανίας","νεανίαι"]],
  ["ὁ στρατιώτης", "αρσενικό", ["στρατιώτης","στρατιώτου","στρατιώτῃ","στρατιώτην","στρατιῶτα"], ["στρατιῶται","στρατιωτῶν","στρατιώταις","στρατιώτας","στρατιῶται"]],
  ["ὁ ποιητής", "αρσενικό", ["ποιητής","ποιητοῦ","ποιητῇ","ποιητήν","ποιητά"], ["ποιηταί","ποιητῶν","ποιηταῖς","ποιητάς","ποιηταί"]],
  ["ἡ ἀλήθεια", "θηλυκό", ["ἀλήθεια","ἀληθείας","ἀληθείᾳ","ἀλήθειαν","ἀλήθεια"], ["ἀλήθειαι","ἀληθειῶν","ἀληθείαις","ἀληθείας","ἀλήθειαι"]],
  ["ἡ σοφία", "θηλυκό", ["σοφία","σοφίας","σοφίᾳ","σοφίαν","σοφία"], ["σοφίαι","σοφιῶν","σοφίαις","σοφίας","σοφίαι"]],
  ["ἡ τράπεζα", "θηλυκό", ["τράπεζα","τραπέζης","τραπέζῃ","τράπεζαν","τράπεζα"], ["τράπεζαι","τραπεζῶν","τραπέζαις","τραπέζας","τράπεζαι"]]
];
const BLADE_FB_B = [
  ["ὁ ἀγρός", "αρσενικό", ["ἀγρός","ἀγροῦ","ἀγρῷ","ἀγρόν","ἀγρέ"], ["ἀγροί","ἀγρῶν","ἀγροῖς","ἀγρούς","ἀγροί"]],
  ["ὁ βίος", "αρσενικό", ["βίος","βίου","βίῳ","βίον","βίε"], ["βίοι","βίων","βίοις","βίους","βίοι"]],
  ["ὁ λίθος", "αρσενικό", ["λίθος","λίθου","λίθῳ","λίθον","λίθε"], ["λίθοι","λίθων","λίθοις","λίθους","λίθοι"]],
  ["ὁ λύκος", "αρσενικό", ["λύκος","λύκου","λύκῳ","λύκον","λύκε"], ["λύκοι","λύκων","λύκοις","λύκους","λύκοι"]],
  ["ὁ μάγος", "αρσενικό", ["μάγος","μάγου","μάγῳ","μάγον","μάγε"], ["μάγοι","μάγων","μάγοις","μάγους","μάγοι"]],
  ["ὁ θυμός", "αρσενικό", ["θυμός","θυμοῦ","θυμῷ","θυμόν","θυμέ"], ["θυμοί","θυμῶν","θυμοῖς","θυμούς","θυμοί"]]
];
const BLADE_FB_C = [
  ["ἡ δύναμις", "θηλυκό", ["δύναμις","δυνάμεως","δυνάμει","δύναμιν","δύναμι"], ["δυνάμεις","δυνάμεων","δυνάμεσι","δυνάμεις","δυνάμεις"]],
  ["ἡ φύσις", "θηλυκό", ["φύσις","φύσεως","φύσει","φύσιν","φύσι"], ["φύσεις","φύσεων","φύσεσι","φύσεις","φύσεις"]],
  ["ἡ τάξις", "θηλυκό", ["τάξις","τάξεως","τάξει","τάξιν","τάξι"], ["τάξεις","τάξεων","τάξεσι","τάξεις","τάξεις"]],
  ["ἡ κρίσις", "θηλυκό", ["κρίσις","κρίσεως","κρίσει","κρίσιν","κρίσι"], ["κρίσεις","κρίσεων","κρίσεσι","κρίσεις","κρίσεις"]],
  ["ἡ πόλις", "θηλυκό", ["πόλις","πόλεως","πόλει","πόλιν","πόλι"], ["πόλεις","πόλεων","πόλεσι","πόλεις","πόλεις"]],
  ["ἡ ὕβρις", "θηλυκό", ["ὕβρις","ὕβρεως","ὕβρει","ὕβριν","ὕβρι"], ["ὕβρεις","ὕβρεων","ὕβρεσι","ὕβρεις","ὕβρεις"]]
];
const BLADE_FB_PAR = [
  { positive:'σοφός',    degree:'συγκριτικός', endings:['σοφώτερος'] },
  { positive:'σοφός',    degree:'υπερθετικός', endings:['σοφώτατος'] },
  { positive:'νέος',     degree:'συγκριτικός', endings:['νεώτερος'] },
  { positive:'νέος',     degree:'υπερθετικός', endings:['νεώτατος'] },
  { positive:'δεινός',   degree:'συγκριτικός', endings:['δεινότερος'] },
  { positive:'δεινός',   degree:'υπερθετικός', endings:['δεινότατος'] },
  { positive:'ἀληθής',   degree:'συγκριτικός', endings:['ἀληθέστερος'] },
  { positive:'ἀληθής',   degree:'υπερθετικός', endings:['ἀληθέστατος'] },
  { positive:'εὐγενής',  degree:'συγκριτικός', endings:['εὐγενέστερος'] },
  { positive:'εὐγενής',  degree:'υπερθετικός', endings:['εὐγενέστατος'] }
];

// ── Selectable grammar exercises (same ids + data sources as before;
//    raw() now falls back to the bundled rows if the DB isn't loaded) ──
const BLADE_MODES = [
  { id: 'nouns',  kind: 'noun', obj: 'amphora',
    title: 'Ουσιαστικά Α΄ Κλίσης', hint: 'Κόψε τον σωστό τύπο κλίσης',
    raw: () => (typeof NOUN_RAW_A !== 'undefined' ? NOUN_RAW_A : BLADE_FB_A) },
  { id: 'nounsB', kind: 'noun', obj: 'kylix',
    title: 'Ουσιαστικά Β΄ Κλίσης', hint: 'Κόψε τον σωστό τύπο κλίσης',
    raw: () => (typeof NOUN_RAW_B !== 'undefined' ? NOUN_RAW_B : BLADE_FB_B) },
  { id: 'nounsC', kind: 'noun', obj: 'fig',
    title: 'Ουσιαστικά Γ΄ Κλίσης', hint: 'Κόψε τον σωστό τύπο κλίσης',
    raw: () => (typeof NOUN_RAW_C !== 'undefined' ? NOUN_RAW_C : BLADE_FB_C) },
  { id: 'adj',    kind: 'adj',  obj: 'pom',
    title: 'Παραθετικά Επιθέτων', hint: 'Συγκριτικός & Υπερθετικός βαθμός' },
];
function bladeModeDef(id) {
  return BLADE_MODES.find(m => m.id === id) || BLADE_MODES[0];
}

// Upgrade to the full paradigm databases when possible (lazyLoad is the
// platform loader; bundled fallbacks keep the game playable regardless).
function bladeEnsureData(def) {
  return new Promise(resolve => {
    try {
      if (def.kind === 'noun' && typeof NOUN_RAW_A === 'undefined' && typeof window.lazyLoad === 'function') {
        window.lazyLoad(['games/ousiastika/data.js']).then(() => resolve(true), () => resolve(false));
        return;
      }
      if (def.kind === 'adj' && typeof PAR_G === 'undefined' && typeof window.lazyLoad === 'function') {
        window.lazyLoad(['games/lyo/game.js', 'games/paratheta/game.js']).then(() => resolve(true), () => resolve(false));
        return;
      }
    } catch (e) {}
    resolve(true);
  });
}

// ══════════════════════════════════════════════════════════
// AUDIO — tiny WebAudio synth (whoosh / splat / bomb / combo)
// ══════════════════════════════════════════════════════════
const BladeSfx = {
  ctx: null, master: null, _nb: null, _lastWhoosh: 0,
  muted: (function(){ try { return localStorage.getItem('blade_muted') === '1'; } catch (e) { return false; } })(),

  ensure() {
    try {
      if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.5;
      this.master.connect(this.ctx.destination);
    } catch (e) { this.ctx = null; }
  },
  setMuted(m) {
    this.muted = m;
    try { localStorage.setItem('blade_muted', m ? '1' : '0'); } catch (e) {}
    if (this.master) this.master.gain.value = m ? 0 : 0.5;
  },
  _noise() {
    if (this._nb) return this._nb;
    const len = this.ctx.sampleRate * 1;
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    this._nb = buf; return buf;
  },
  _noiseHit(t0, dur, f0, f1, peak, type) {
    const src = this.ctx.createBufferSource(); src.buffer = this._noise(); src.loop = true;
    const flt = this.ctx.createBiquadFilter(); flt.type = type || 'bandpass'; flt.Q.value = 1.1;
    flt.frequency.setValueAtTime(f0, t0);
    flt.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t0 + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + dur * 0.18);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    src.connect(flt); flt.connect(g); g.connect(this.master);
    src.start(t0); src.stop(t0 + dur + 0.02);
  },
  _tone(t0, dur, f0, f1, peak, type) {
    const o = this.ctx.createOscillator(); o.type = type || 'sine';
    o.frequency.setValueAtTime(f0, t0);
    if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(30, f1), t0 + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + Math.min(0.02, dur * 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(this.master);
    o.start(t0); o.stop(t0 + dur + 0.02);
  },
  whoosh(v) {
    if (!this.ctx || this.muted) return;
    const now = performance.now();
    if (now - this._lastWhoosh < 90) return;
    this._lastWhoosh = now;
    const t0 = this.ctx.currentTime;
    const k = Math.min(1.6, 0.6 + v * 0.5);
    try { this._noiseHit(t0, 0.15, 500 * k, 2400 * k, 0.13 * k, 'bandpass'); } catch (e) {}
  },
  splat(pottery) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    try {
      this._noiseHit(t0, 0.13, 1400, 300, 0.4, 'lowpass');
      this._tone(t0, 0.16, 170, 62, 0.4, 'sine');
      if (pottery) this._tone(t0, 0.09, 1250, 720, 0.14, 'triangle');
    } catch (e) {}
  },
  crit() {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    try {
      this._tone(t0, 0.22, 880, 880, 0.22, 'sine');
      this._tone(t0 + 0.03, 0.26, 1318, 1318, 0.18, 'sine');
      this._noiseHit(t0, 0.18, 5200, 8200, 0.07, 'highpass');
    } catch (e) {}
  },
  bomb() {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    try {
      this._tone(t0, 0.55, 150, 36, 0.7, 'sine');
      this._noiseHit(t0, 0.4, 3000, 180, 0.5, 'lowpass');
      this._noiseHit(t0, 0.1, 6000, 9000, 0.2, 'highpass');
    } catch (e) {}
  },
  combo(n) {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    const steps = Math.min(n, 5);
    try {
      for (let i = 0; i < steps; i++)
        this._tone(t0 + i * 0.055, 0.14, 523 * Math.pow(1.1892, i), 0, 0.16, 'triangle');
    } catch (e) {}
  },
  pop(i) {
    if (!this.ctx || this.muted) return;
    try { this._tone(this.ctx.currentTime, 0.08, 620 + i * 70, 0, 0.16, 'sine'); } catch (e) {}
  },
  select() {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    try { this._tone(t0, 0.14, 440, 660, 0.2, 'triangle'); this._tone(t0 + 0.06, 0.18, 660, 880, 0.14, 'triangle'); } catch (e) {}
  },
  gong() {
    if (!this.ctx || this.muted) return;
    const t0 = this.ctx.currentTime;
    try { this._tone(t0, 1.3, 196, 190, 0.35, 'sine'); this._tone(t0, 1.5, 98, 96, 0.3, 'sine'); this._tone(t0, 0.5, 392, 380, 0.1, 'triangle'); } catch (e) {}
  }
};

// ══════════════════════════════════════════════════════════
// PROCEDURAL SPRITES — throwable pottery & fruit
// ══════════════════════════════════════════════════════════
let _bladeMeasure = null;
function bladeMeasureCtx() {
  if (!_bladeMeasure) _bladeMeasure = document.createElement('canvas').getContext('2d');
  return _bladeMeasure;
}

const BLADE_OBJ = {
  amphora: { pottery: true,  juice: '#c9713a', ratio: 1.30 },
  kylix:   { pottery: true,  juice: '#c9713a', ratio: 0.95 },
  pom:     { pottery: false, juice: '#c2233c', ratio: 1.04 },
  fig:     { pottery: false, juice: '#7c3d70', ratio: 1.14 }
};
const BLADE_OBJ_IDS = ['amphora','kylix','pom','fig'];

function bladePaintAmphora(ctx, w, h) {
  const nW = w * 0.34, bodyTop = -h * 0.34;
  // handles
  ctx.strokeStyle = '#6f351a'; ctx.lineWidth = w * 0.075; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-nW * 0.52, -h * 0.40);
  ctx.quadraticCurveTo(-w * 0.56, -h * 0.34, -w * 0.40, -h * 0.10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(nW * 0.52, -h * 0.40);
  ctx.quadraticCurveTo(w * 0.56, -h * 0.34, w * 0.40, -h * 0.10); ctx.stroke();
  // body
  const g = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, 0);
  g.addColorStop(0, '#8a4423'); g.addColorStop(0.35, '#c97c47'); g.addColorStop(0.62, '#b05e2e'); g.addColorStop(1, '#5f2c15');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-nW * 0.5, -h * 0.48);
  ctx.lineTo(-nW * 0.46, bodyTop);
  ctx.bezierCurveTo(-w * 0.52, -h * 0.24, -w * 0.50, h * 0.10, -w * 0.20, h * 0.40);
  ctx.lineTo(-w * 0.16, h * 0.44);
  ctx.lineTo(w * 0.16, h * 0.44);
  ctx.lineTo(w * 0.20, h * 0.40);
  ctx.bezierCurveTo(w * 0.50, h * 0.10, w * 0.52, -h * 0.24, nW * 0.46, bodyTop);
  ctx.lineTo(nW * 0.5, -h * 0.48);
  ctx.closePath(); ctx.fill();
  // rim + foot
  ctx.fillStyle = '#2a1710';
  ctx.beginPath(); ctx.ellipse(0, -h * 0.475, nW * 0.62, h * 0.032, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(-w * 0.20, h * 0.44, w * 0.40, h * 0.045);
  // black-figure shoulder band with meander ticks
  ctx.fillStyle = 'rgba(38,20,12,0.92)';
  ctx.fillRect(-w * 0.44, -h * 0.30, w * 0.88, h * 0.105);
  ctx.strokeStyle = 'rgba(232,206,146,0.8)'; ctx.lineWidth = Math.max(1, w * 0.014);
  const my = -h * 0.248, mw = w * 0.078;
  for (let x = -w * 0.38; x < w * 0.36; x += mw) {
    ctx.beginPath();
    ctx.moveTo(x, my + h * 0.028); ctx.lineTo(x, my - h * 0.022);
    ctx.lineTo(x + mw * 0.62, my - h * 0.022); ctx.lineTo(x + mw * 0.62, my + h * 0.006);
    ctx.stroke();
  }
  // lower glaze band
  ctx.fillStyle = 'rgba(38,20,12,0.85)';
  ctx.fillRect(-w * 0.30, h * 0.30, w * 0.60, h * 0.05);
  // sheen
  const sh = ctx.createLinearGradient(-w * 0.4, 0, -w * 0.05, 0);
  sh.addColorStop(0, 'rgba(255,240,210,0.30)'); sh.addColorStop(1, 'rgba(255,240,210,0)');
  ctx.fillStyle = sh;
  ctx.beginPath(); ctx.ellipse(-w * 0.24, -h * 0.02, w * 0.10, h * 0.30, 0.12, 0, Math.PI * 2); ctx.fill();
}

function bladePaintKylix(ctx, w, h) {
  const rimY = -h * 0.26, rimRy = h * 0.085;
  // handles
  ctx.strokeStyle = '#6f351a'; ctx.lineWidth = w * 0.06; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(-w * 0.44, rimY + h * 0.03);
  ctx.quadraticCurveTo(-w * 0.62, rimY - h * 0.10, -w * 0.36, rimY - h * 0.07); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(w * 0.44, rimY + h * 0.03);
  ctx.quadraticCurveTo(w * 0.62, rimY - h * 0.10, w * 0.36, rimY - h * 0.07); ctx.stroke();
  // bowl
  const g = ctx.createLinearGradient(-w * 0.5, 0, w * 0.5, 0);
  g.addColorStop(0, '#8a4423'); g.addColorStop(0.4, '#c97c47'); g.addColorStop(1, '#5f2c15');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(-w * 0.48, rimY);
  ctx.bezierCurveTo(-w * 0.42, h * 0.10, -w * 0.14, h * 0.16, 0, h * 0.17);
  ctx.bezierCurveTo(w * 0.14, h * 0.16, w * 0.42, h * 0.10, w * 0.48, rimY);
  ctx.closePath(); ctx.fill();
  // interior (dark glaze ellipse)
  ctx.fillStyle = '#241309';
  ctx.beginPath(); ctx.ellipse(0, rimY, w * 0.48, rimRy, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(232,206,146,0.55)'; ctx.lineWidth = Math.max(1, w * 0.012);
  ctx.beginPath(); ctx.ellipse(0, rimY, w * 0.48, rimRy, 0, 0, Math.PI * 2); ctx.stroke();
  // eye motif (kylix "eye cup")
  ctx.fillStyle = 'rgba(38,20,12,0.9)';
  ctx.beginPath(); ctx.ellipse(0, h * 0.02, w * 0.10, h * 0.055, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = 'rgba(232,206,146,0.85)';
  ctx.beginPath(); ctx.arc(0, h * 0.02, w * 0.028, 0, Math.PI * 2); ctx.fill();
  // stem + foot
  ctx.fillStyle = '#7c3c1e';
  ctx.fillRect(-w * 0.045, h * 0.17, w * 0.09, h * 0.17);
  ctx.fillStyle = '#5f2c15';
  ctx.beginPath(); ctx.ellipse(0, h * 0.37, w * 0.20, h * 0.05, 0, 0, Math.PI * 2); ctx.fill();
  // sheen
  const sh = ctx.createLinearGradient(-w * 0.4, 0, -w * 0.1, 0);
  sh.addColorStop(0, 'rgba(255,240,210,0.25)'); sh.addColorStop(1, 'rgba(255,240,210,0)');
  ctx.fillStyle = sh;
  ctx.beginPath(); ctx.ellipse(-w * 0.26, -h * 0.06, w * 0.08, h * 0.14, 0.3, 0, Math.PI * 2); ctx.fill();
}

function bladePaintPom(ctx, w, h, golden) {
  const r = w * 0.47;
  if (golden) {
    const glow = ctx.createRadialGradient(0, 0, r * 0.5, 0, 0, r * 1.45);
    glow.addColorStop(0, 'rgba(246,214,120,0.5)'); glow.addColorStop(1, 'rgba(246,214,120,0)');
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(0, 0, r * 1.45, 0, Math.PI * 2); ctx.fill();
  }
  const g = ctx.createRadialGradient(-r * 0.4, -r * 0.42, r * 0.2, 0, 0, r * 1.15);
  if (golden) { g.addColorStop(0, '#f8e3a0'); g.addColorStop(0.55, '#d9ab52'); g.addColorStop(1, '#8a671f'); }
  else        { g.addColorStop(0, '#e8828e'); g.addColorStop(0.5, '#c2233c'); g.addColorStop(1, '#79101f'); }
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(0, h * 0.04, r, 0, Math.PI * 2); ctx.fill();
  // calyx crown
  ctx.fillStyle = golden ? '#a1781f' : '#8f1d2c';
  ctx.beginPath();
  ctx.moveTo(-w * 0.14, -h * 0.36);
  ctx.lineTo(-w * 0.10, -h * 0.50); ctx.lineTo(-w * 0.035, -h * 0.41);
  ctx.lineTo(0, -h * 0.53);        ctx.lineTo(w * 0.035, -h * 0.41);
  ctx.lineTo(w * 0.10, -h * 0.50); ctx.lineTo(w * 0.14, -h * 0.36);
  ctx.closePath(); ctx.fill();
  // speckles + highlight
  ctx.fillStyle = golden ? 'rgba(255,246,214,0.5)' : 'rgba(255,214,214,0.28)';
  ctx.beginPath(); ctx.ellipse(-r * 0.42, -r * 0.3, r * 0.16, r * 0.26, -0.5, 0, Math.PI * 2); ctx.fill();
  if (golden) {
    // laurel mark
    ctx.strokeStyle = 'rgba(120,86,20,0.8)'; ctx.lineWidth = Math.max(1, w * 0.02);
    ctx.beginPath(); ctx.arc(0, h * 0.05, r * 0.5, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke();
    for (let i = 0; i < 5; i++) {
      const a = Math.PI * (0.2 + i * 0.15);
      const lx = Math.cos(a) * r * 0.5, ly = h * 0.05 + Math.sin(a) * r * 0.5;
      ctx.beginPath(); ctx.ellipse(lx, ly, r * 0.09, r * 0.045, a + Math.PI / 2, 0, Math.PI * 2); ctx.stroke();
    }
  }
}

function bladePaintFig(ctx, w, h) {
  const g = ctx.createRadialGradient(-w * 0.18, h * 0.02, w * 0.08, 0, h * 0.08, w * 0.62);
  g.addColorStop(0, '#a06a96'); g.addColorStop(0.45, '#7c3d70'); g.addColorStop(1, '#3c1c3c');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.moveTo(0, -h * 0.46);
  ctx.bezierCurveTo(w * 0.10, -h * 0.34, w * 0.46, -h * 0.16, w * 0.44, h * 0.14);
  ctx.bezierCurveTo(w * 0.42, h * 0.40, w * 0.16, h * 0.48, 0, h * 0.48);
  ctx.bezierCurveTo(-w * 0.16, h * 0.48, -w * 0.42, h * 0.40, -w * 0.44, h * 0.14);
  ctx.bezierCurveTo(-w * 0.46, -h * 0.16, -w * 0.10, -h * 0.34, 0, -h * 0.46);
  ctx.closePath(); ctx.fill();
  // stem
  ctx.strokeStyle = '#6b4a2a'; ctx.lineWidth = w * 0.05; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(0, -h * 0.44); ctx.quadraticCurveTo(w * 0.03, -h * 0.54, w * 0.09, -h * 0.56); ctx.stroke();
  // leaf
  ctx.fillStyle = '#5d7a3a';
  ctx.save(); ctx.translate(-w * 0.12, -h * 0.42); ctx.rotate(-0.7);
  ctx.beginPath(); ctx.ellipse(0, 0, w * 0.16, w * 0.075, 0, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = 'rgba(30,46,14,0.6)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(-w * 0.14, 0); ctx.lineTo(w * 0.14, 0); ctx.stroke();
  ctx.restore();
  // bloom highlight
  ctx.fillStyle = 'rgba(236,214,236,0.22)';
  ctx.beginPath(); ctx.ellipse(-w * 0.2, -h * 0.06, w * 0.10, h * 0.2, 0.35, 0, Math.PI * 2); ctx.fill();
}

function bladePaintBand(ctx, bw, bh, text, fontPx) {
  const r = bh * 0.3;
  // shadow under band
  ctx.fillStyle = 'rgba(20,10,4,0.35)';
  bladeRRPath(ctx, -bw / 2 + 2, -bh / 2 + 3, bw, bh, r); ctx.fill();
  const g = ctx.createLinearGradient(0, -bh / 2, 0, bh / 2);
  g.addColorStop(0, '#f2e5c4'); g.addColorStop(0.5, '#e6d2a4'); g.addColorStop(1, '#d3ba88');
  ctx.fillStyle = g;
  bladeRRPath(ctx, -bw / 2, -bh / 2, bw, bh, r); ctx.fill();
  ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(66,42,18,0.7)';
  bladeRRPath(ctx, -bw / 2, -bh / 2, bw, bh, r); ctx.stroke();
  // pins at the ends
  ctx.fillStyle = 'rgba(66,42,18,0.55)';
  ctx.beginPath(); ctx.arc(-bw / 2 + bh * 0.32, 0, bh * 0.09, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(bw / 2 - bh * 0.32, 0, bh * 0.09, 0, Math.PI * 2); ctx.fill();
  ctx.font = '600 ' + fontPx + 'px "Noto Serif", serif';
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = '#2c1a0c';
  ctx.fillText(text, 0, 1);
}

function bladeRRPath(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Build an offscreen sprite for a throwable. text=null → plain object.
function bladeMakeSprite(text, objId, opts) {
  opts = opts || {};
  const dpr = opts.dpr || 1;
  const def = BLADE_OBJ[objId] || BLADE_OBJ.amphora;
  const fontPx = opts.fontPx || 20;
  let bandW = 0, bandH = 0;
  if (text) {
    const m = bladeMeasureCtx();
    m.font = '600 ' + fontPx + 'px "Noto Serif", serif';
    bandW = Math.ceil(m.measureText(text).width) + fontPx * 1.7;
    bandH = Math.ceil(fontPx * 1.85);
  }
  const ow = opts.size || Math.max(76, Math.min(150, bandW * 0.8 || 96));
  const oh = ow * def.ratio;
  const w = Math.ceil(Math.max(ow * 1.28, bandW) + 10);   // room for handles/glow
  const h = Math.ceil(oh + (opts.golden ? ow * 0.5 : 12));
  const cv = document.createElement('canvas');
  cv.width = Math.max(2, Math.round(w * dpr)); cv.height = Math.max(2, Math.round(h * dpr));
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.translate(w / 2, h / 2);
  if (objId === 'amphora')      bladePaintAmphora(ctx, ow, oh);
  else if (objId === 'kylix')   bladePaintKylix(ctx, ow, oh);
  else if (objId === 'pom')     bladePaintPom(ctx, ow, oh, opts.golden);
  else                          bladePaintFig(ctx, ow, oh);
  if (text) bladePaintBand(ctx, bandW, bandH, text, fontPx);
  return { cv, w, h, r: Math.max(ow, oh) * 0.5 + 8, objId,
           juice: opts.golden ? '#e8c25a' : def.juice, pottery: def.pottery };
}

// Splatter decal (unique irregular blob), pre-rendered.
function bladeMakeSplat(color, size, dpr) {
  const s = Math.ceil(size);
  const cv = document.createElement('canvas');
  cv.width = cv.height = Math.max(2, Math.round(s * dpr));
  const ctx = cv.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.translate(s / 2, s / 2);
  ctx.fillStyle = color;
  const blobs = 7 + (Math.random() * 4 | 0);
  for (let i = 0; i < blobs; i++) {
    const a = Math.random() * Math.PI * 2, d = Math.random() * s * 0.14;
    const r = s * (0.07 + Math.random() * 0.10);
    ctx.globalAlpha = 0.55 + Math.random() * 0.35;
    ctx.beginPath(); ctx.arc(Math.cos(a) * d, Math.sin(a) * d, r, 0, Math.PI * 2); ctx.fill();
  }
  const drops = 9 + (Math.random() * 6 | 0);
  for (let i = 0; i < drops; i++) {
    const a = Math.random() * Math.PI * 2;
    const d = s * (0.18 + Math.random() * 0.30);
    const r = 1.4 + Math.random() * 3.4;
    ctx.globalAlpha = 0.4 + Math.random() * 0.5;
    ctx.save();
    ctx.translate(Math.cos(a) * d, Math.sin(a) * d); ctx.rotate(a);
    ctx.beginPath(); ctx.ellipse(0, 0, r * (1.2 + Math.random()), r * 0.7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
  return cv;
}

function bladeEaseOutBack(t) {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

// ══════════════════════════════════════════════════════════
// GAME
// ══════════════════════════════════════════════════════════
class BladeGame {
  constructor(containerEl) {
    this.container = containerEl;
    this.canvas = null; this.ctx = null; this.raf = null;
    this.alive = true;
    this.scene = 'menu';                 // 'menu' | 'game' | 'over'
    this.mode = null; this.modeDef = null; this.gpPool = null;

    this.W = 0; this.H = 0; this.dpr = 1;

    // Run state
    this.score = 0; this.streak = 0; this.lives = 3; this.best = 0; this.errors = 0;
    this.running = false; this.gameOver = false;

    // Round state
    this.promptText = ''; this.roundPool = []; this.roundNum = 0;
    this.spawnTimer = 0; this.spawnInterval = 46;
    this.correctSliced = false; this.frenzy = false;
    this.pendingPomo = false; this.newBest = false;
    this.roundTid = null; this.dismissTid = null; this.pomoTid = null; this.uiTid = null;

    // Entities / FX
    this.tokens = []; this.shards = []; this.parts = [];
    this.decals = []; this.callouts = []; this.popups = [];
    this.rings = []; this.stamps = []; this.ambient = [];
    this.menuItems = []; this.overItems = [];
    this.uiLock = false;

    // Pointer / blade
    this.pts = []; this.ptrDown = false; this.bladeV = 0;
    this.downX = 0; this.downY = 0; this.downT = 0;
    this.strokeSlices = 0; this.lastSliceT = 0;

    // Feel
    this.shakeF = 0; this.shakeA = 0; this.flashA = 0;
    this.timeScale = 1; this.tsPulses = [];

    this.bg = null;
    this.lastT = 0; this.now = 0;

    this._rz = this._resize.bind(this);
    this._pm = this._ptrMove.bind(this);
    this._pd = this._ptrDown.bind(this);
    this._pu = this._ptrUp.bind(this);
  }

  // ── DOM ───────────────────────────────────────────────────
  _build() {
    this.container.innerHTML = '';
    const gs = document.createElement('div');
    gs.id = 'blade-screen-game';

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'blade-canvas';
    gs.appendChild(this.canvas);

    const hud = document.createElement('div');
    hud.id = 'blade-hud';
    hud.innerHTML =
      '<div id="blade-lives"></div>' +
      '<div id="blade-prompt"><span id="blade-prompt-main"></span><span id="blade-prompt-sub"></span></div>' +
      '<div id="blade-score-wrap">' +
        '<div id="blade-score">0</div>' +
        '<div id="blade-streak"></div>' +
      '</div>';
    gs.appendChild(hud);

    // Fruit-Ninja style menu chrome (DOM for i18n + QR share)
    const mui = document.createElement('div');
    mui.id = 'blade-menu-ui';
    mui.innerHTML =
      '<h1>Ξίφος του Γραμματικού</h1>' +
      '<p class="blade-subtitle">Κόψε τη σωστή γραμματική μορφή · Slice the correct form</p>' +
      '<button class="blade-share-btn" onclick="typeof showQR===\'function\'&&showQR(\'Ξίφος του Γραμματικού\',{nav:\'game\',id:\'blade\'})">📱 Μοιράσου στην τάξη</button>' +
      '<p class="blade-menu-hint">— Κόψε ένα αγγείο για να ξεκινήσεις —</p>';
    gs.appendChild(mui);

    const back = document.createElement('button');
    back.id = 'blade-back-game';
    back.textContent = '← Επιλογή Τρόπου';
    back.addEventListener('click', () => this._returnToModes());
    gs.appendChild(back);

    const mute = document.createElement('button');
    mute.id = 'blade-mute';
    mute.title = 'Ήχος · Sound';
    mute.textContent = BladeSfx.muted ? '🔇' : '🔊';
    mute.addEventListener('click', () => {
      BladeSfx.ensure();
      BladeSfx.setMuted(!BladeSfx.muted);
      mute.textContent = BladeSfx.muted ? '🔇' : '🔊';
    });
    gs.appendChild(mute);

    this.container.appendChild(gs);
    this.ctx = this.canvas.getContext('2d');

    this._resize();
    window.addEventListener('resize', this._rz);
    this.canvas.addEventListener('pointermove',   this._pm, { passive: true });
    this.canvas.addEventListener('pointerdown',   this._pd, { passive: true });
    this.canvas.addEventListener('pointerup',     this._pu, { passive: true });
    this.canvas.addEventListener('pointercancel', this._pu, { passive: true });
    this.canvas.addEventListener('pointerleave',  this._pu, { passive: true });
  }

  _resize() {
    if (!this.canvas) return;
    const p = this.canvas.parentElement;
    const r = p ? p.getBoundingClientRect() : { width: 0, height: 0 };
    this.W = r.width  || window.innerWidth;
    this.H = r.height || window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width  = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
    this.canvas.style.width  = this.W + 'px';
    this.canvas.style.height = this.H + 'px';
    this._renderBackdrop();
    this._seedAmbient();
    if (this.scene === 'menu') this._layoutMenu();
    if (this.scene === 'over') this._layoutOver();
  }

  // ── Backdrop: Greek courtyard at dusk (pre-rendered) ──────
  _renderBackdrop() {
    const W = this.W, H = this.H, d = this.dpr;
    const cv = document.createElement('canvas');
    cv.width = Math.max(2, Math.round(W * d)); cv.height = Math.max(2, Math.round(H * d));
    const ctx = cv.getContext('2d');
    ctx.scale(d, d);

    const horizon = H * 0.55;
    // Dusk sky
    const sky = ctx.createLinearGradient(0, 0, 0, horizon);
    sky.addColorStop(0, '#131024'); sky.addColorStop(0.42, '#33203f');
    sky.addColorStop(0.72, '#6e3145'); sky.addColorStop(1, '#a1512e');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, W, horizon + 2);
    // Sun glow
    const sun = ctx.createRadialGradient(W * 0.5, horizon, 10, W * 0.5, horizon, W * 0.34);
    sun.addColorStop(0, 'rgba(255,178,102,0.55)'); sun.addColorStop(1, 'rgba(255,178,102,0)');
    ctx.fillStyle = sun; ctx.fillRect(0, 0, W, horizon + 2);
    // Stars
    ctx.fillStyle = 'rgba(255,246,222,0.7)';
    for (let i = 0; i < 46; i++) {
      const sx = Math.random() * W, sy = Math.random() * horizon * 0.55;
      ctx.globalAlpha = 0.15 + Math.random() * 0.5;
      ctx.fillRect(sx, sy, 1.4, 1.4);
    }
    ctx.globalAlpha = 1;

    // Courtyard floor — warm worn slabs
    const fl = ctx.createLinearGradient(0, horizon, 0, H);
    fl.addColorStop(0, '#2c1c12'); fl.addColorStop(0.5, '#20130c'); fl.addColorStop(1, '#140c07');
    ctx.fillStyle = fl; ctx.fillRect(0, horizon, W, H - horizon);
    // Perspective slab joints
    ctx.strokeStyle = 'rgba(220,180,120,0.06)'; ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      const y = horizon + (H - horizon) * (i * i) / 30;
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
    for (let i = -4; i <= 4; i++) {
      ctx.beginPath();
      ctx.moveTo(W * 0.5 + i * W * 0.09, horizon);
      ctx.lineTo(W * 0.5 + i * W * 0.24, H);
      ctx.stroke();
    }
    // Meander emblem circle in floor centre
    ctx.save();
    ctx.translate(W * 0.5, horizon + (H - horizon) * 0.55);
    ctx.scale(1, 0.42);
    const er = Math.min(W * 0.24, 240);
    ctx.strokeStyle = 'rgba(201,164,74,0.10)'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, er, 0, Math.PI * 2); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, er * 0.86, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 5; ctx.strokeStyle = 'rgba(201,164,74,0.05)';
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * er * 0.88, Math.sin(a) * er * 0.88);
      ctx.lineTo(Math.cos(a) * er * 0.98, Math.sin(a) * er * 0.98);
      ctx.stroke();
    }
    ctx.restore();

    // Distant hills behind the colonnade
    ctx.fillStyle = 'rgba(38,20,34,0.55)';
    ctx.beginPath();
    ctx.moveTo(0, horizon);
    ctx.quadraticCurveTo(W * 0.18, horizon - H * 0.075, W * 0.38, horizon - H * 0.02);
    ctx.quadraticCurveTo(W * 0.55, horizon + H * 0.01, W * 0.72, horizon - H * 0.055);
    ctx.quadraticCurveTo(W * 0.88, horizon - H * 0.09, W, horizon - H * 0.03);
    ctx.lineTo(W, horizon); ctx.closePath(); ctx.fill();

    // Stoa colonnade silhouette on the horizon
    ctx.fillStyle = '#0e0a12';
    const colTop = horizon - H * 0.24, colBot = horizon + 2;
    const nCols = Math.max(5, Math.round(W / 190));
    const gap = W / nCols;
    ctx.fillRect(-4, colTop - H * 0.035, W + 8, H * 0.028);           // architrave
    ctx.fillRect(-4, colTop - H * 0.012, W + 8, H * 0.012);
    for (let i = 0; i <= nCols; i++) {
      const cx = i * gap + gap * 0.5;
      const cw = Math.min(26, gap * 0.16);
      ctx.fillRect(cx - cw / 2, colTop, cw, colBot - colTop);
      ctx.fillRect(cx - cw * 0.85, colTop, cw * 1.7, H * 0.014);       // capital
      ctx.fillRect(cx - cw * 0.85, colBot - H * 0.012, cw * 1.7, H * 0.012);
    }
    // Cypresses
    ctx.fillStyle = '#0b0810';
    const cyp = (x, s) => {
      ctx.beginPath();
      ctx.moveTo(x, horizon);
      ctx.bezierCurveTo(x - 14 * s, horizon - 60 * s, x - 10 * s, horizon - 150 * s, x, horizon - 200 * s);
      ctx.bezierCurveTo(x + 10 * s, horizon - 150 * s, x + 14 * s, horizon - 60 * s, x, horizon);
      ctx.fill();
    };
    cyp(W * 0.06, 0.9); cyp(W * 0.115, 0.6); cyp(W * 0.94, 1.0); cyp(W * 0.885, 0.55);

    // Overhanging olive branches, top corners
    ctx.strokeStyle = 'rgba(10,8,14,0.9)'; ctx.fillStyle = 'rgba(14,12,20,0.9)';
    const branch = (sx, dir) => {
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(sx, -6);
      ctx.quadraticCurveTo(sx + 90 * dir, 34, sx + 170 * dir, 44); ctx.stroke();
      for (let i = 1; i <= 6; i++) {
        const t = i / 6;
        const bx = sx + 170 * dir * t, by = -6 + 58 * t * (2 - t);
        ctx.save(); ctx.translate(bx, by); ctx.rotate(dir * (0.5 + t));
        ctx.beginPath(); ctx.ellipse(0, 0, 16, 5.5, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    };
    branch(-10, 1); branch(W + 10, -1);

    // Braziers at bottom corners
    const brazier = (bx) => {
      ctx.fillStyle = '#0d0a10';
      ctx.beginPath(); ctx.ellipse(bx, H - 34, 30, 9, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(bx - 4, H - 34, 8, 26);
      ctx.beginPath(); ctx.moveTo(bx - 18, H - 4); ctx.lineTo(bx - 4, H - 12); ctx.lineTo(bx - 2, H - 4); ctx.fill();
      ctx.beginPath(); ctx.moveTo(bx + 18, H - 4); ctx.lineTo(bx + 4, H - 12); ctx.lineTo(bx + 2, H - 4); ctx.fill();
      const fg = ctx.createRadialGradient(bx, H - 44, 2, bx, H - 44, 26);
      fg.addColorStop(0, 'rgba(255,170,80,0.5)'); fg.addColorStop(1, 'rgba(255,140,60,0)');
      ctx.fillStyle = fg;
      ctx.beginPath(); ctx.arc(bx, H - 44, 26, 0, Math.PI * 2); ctx.fill();
    };
    brazier(W * 0.075); brazier(W * 0.925);

    // Vignette
    const vg = ctx.createRadialGradient(W / 2, H * 0.48, Math.min(W, H) * 0.36, W / 2, H * 0.5, Math.max(W, H) * 0.72);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(4,2,8,0.55)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);

    this.bg = cv;
  }

  _seedAmbient() {
    this.ambient = [];
    if (BLADE_REDUCED) return;
    for (let i = 0; i < 9; i++)                      // embers rising from braziers
      this.ambient.push({
        type: 'ember',
        x: (Math.random() < 0.5 ? 0.075 : 0.925) * this.W + (Math.random() - 0.5) * 30,
        y: this.H - 30 - Math.random() * this.H * 0.5,
        vx: (Math.random() - 0.5) * 0.14, vy: -(0.18 + Math.random() * 0.3),
        r: 1 + Math.random() * 1.8, phase: Math.random() * 9
      });
    for (let i = 0; i < 8; i++)                      // drifting petals
      this.ambient.push({
        type: 'petal',
        x: Math.random() * this.W, y: Math.random() * this.H,
        vx: -(0.12 + Math.random() * 0.22), vy: 0.16 + Math.random() * 0.22,
        r: 2.4 + Math.random() * 2.2, phase: Math.random() * 9
      });
  }

  // ── Pointer / blade ──────────────────────────────────────
  _ptrDown(e) {
    BladeSfx.ensure();
    this.ptrDown = true;
    const rc = this.canvas.getBoundingClientRect();
    const x = e.clientX - rc.left, y = e.clientY - rc.top;
    this.pts = [{ x, y, t: performance.now() }];
    this.bladeV = 0; this.strokeSlices = 0;
    this.downX = x; this.downY = y; this.downT = performance.now();
  }

  _ptrMove(e) {
    if (!this.ptrDown || !this.canvas) return;
    const rc = this.canvas.getBoundingClientRect();
    const x = e.clientX - rc.left, y = e.clientY - rc.top;
    const now = performance.now();
    const last = this.pts[this.pts.length - 1];
    if (last) {
      const dx = x - last.x, dy = y - last.y;
      const dd = Math.hypot(dx, dy);
      if (dd < 2.5) return;
      const dtm = Math.max(1, now - last.t);
      this.bladeV = this.bladeV * 0.55 + (dd / dtm) * 0.45;
    }
    this.pts.push({ x, y, t: now });
    if (this.pts.length > 16) this.pts.shift();

    const fast = this.bladeV > 0.28;
    if (fast && this.bladeV > 0.85) BladeSfx.whoosh(this.bladeV);
    if (last && fast) {
      if (this.scene === 'game' && this.running && !this.gameOver)
        this._checkSlice(last.x, last.y, x, y, now);
      else if (this.scene === 'menu' || this.scene === 'over')
        this._checkUiSlice(last.x, last.y, x, y);
    }
    // blade tip sparkles
    if (fast && !BLADE_REDUCED && this.parts.length < 300 && Math.random() < 0.5)
      this.parts.push({ type: 'dot', x, y, vx: (Math.random() - 0.5) * 1.4, vy: (Math.random() - 0.5) * 1.4,
                        ay: 0.02, life: 0.5, decay: 0.06, r: 0.8 + Math.random() * 1.2, c: '#ffe9b0' });
  }

  _ptrUp(e) {
    if (!this.ptrDown) return;
    this.ptrDown = false;
    // Tap-to-select fallback on menu / game-over scenes
    if ((this.scene === 'menu' || this.scene === 'over') && e && e.clientX != null) {
      const rc = this.canvas.getBoundingClientRect();
      const x = e.clientX - rc.left, y = e.clientY - rc.top;
      const dt = performance.now() - this.downT;
      if (dt < 300 && Math.hypot(x - this.downX, y - this.downY) < 8) {
        const items = this.scene === 'menu' ? this.menuItems : this.overItems;
        for (const it of items) {
          if (!it.sliced && Math.hypot(x - it.x, y - it.y - it.bob) < it.sprite.r * 1.1) {
            this._selectItem(it, -0.5); break;
          }
        }
      }
    }
    this.strokeSlices = 0;
  }

  // segment-circle hit
  _segHitsCircle(x1, y1, x2, y2, cx, cy, r) {
    const dx = x2 - x1, dy = y2 - y1;
    const l2 = dx * dx + dy * dy;
    let t = l2 ? ((cx - x1) * dx + (cy - y1) * dy) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    const px = x1 + t * dx, py = y1 + t * dy;
    return Math.hypot(cx - px, cy - py) <= r;
  }

  _checkSlice(x1, y1, x2, y2, now) {
    const theta = Math.atan2(y2 - y1, x2 - x1);
    for (let i = this.tokens.length - 1; i >= 0; i--) {
      const tk = this.tokens[i];
      if (tk.sliced || tk.dismiss) continue;
      if (!this._segHitsCircle(x1, y1, x2, y2, tk.x, tk.y, tk.r)) continue;
      const mx = (x1 + x2) * 0.5, my = (y1 + y2) * 0.5;
      if (tk.special) { this._hitPomo(tk, mx, my, now, i); continue; }
      tk.sliced = true;
      this._splitToken(tk, theta);
      this.tokens.splice(i, 1);
      this._onSlice(tk, mx, my, now);
      if (this.gameOver) return;
    }
  }

  // ── Golden pomegranate (multi-hit bonus) ─────────────────
  _hitPomo(tk, mx, my, now, idx) {
    if (now - (tk.lastHit || 0) < 130) return;
    tk.lastHit = now;
    tk.hits = (tk.hits || 0) + 1;
    tk.vy -= 1.6; tk.vx += (Math.random() - 0.5) * 1.6;
    this._burst(mx, my, '#f6d678', '#fff3c8', 10, 'spark');
    BladeSfx.pop(tk.hits);
    this.popups.push({ text: '✦', x: mx, y: my, vy: -1.1, life: 1, size: 16, c: '#f6d678' });
    if (tk.hits >= 6) {
      this.tokens.splice(idx, 1);
      this.score += 3;
      this._burst(tk.x, tk.y, '#f6d678', '#e8c25a', 42, 'spark');
      this._burst(tk.x, tk.y, '#fff3c8', '#f0e0a0', 18, 'dot');
      this.rings.push({ x: tk.x, y: tk.y, r0: 8, r1: 130, t0: this.now, dur: 500, c: 'rgba(246,214,120,0.9)', lw: 3 });
      this._callout('ΧΡΥΣΟ ΡΟΔΙ +3', tk.x, tk.y - 30, 30, '#f6d678');
      BladeSfx.combo(5);
      this._updateHUD();
    }
  }

  // ── Split a token into two spinning halves + juice ───────
  _splitToken(tk, theta) {
    const th = theta - (tk.ang || 0);
    const nx = -Math.sin(theta), ny = Math.cos(theta);
    const k = 1.5 + Math.random() * 1.1;
    for (let half = 0; half < 2; half++) {
      const s = half === 0 ? -1 : 1;
      this.shards.push({
        cv: tk.sprite.cv, w: tk.w, h: tk.h, theta: th, half,
        x: tk.x, y: tk.y,
        vx: tk.vx * 0.7 + nx * k * s + Math.cos(theta) * 0.6,
        vy: tk.vy * 0.7 + ny * k * s - 0.8,
        rot: tk.ang || 0,
        spin: s * (0.05 + Math.random() * 0.10),
        life: 1
      });
    }
    if (this.shards.length > 26) this.shards.splice(0, this.shards.length - 26);
    // juice burst + splash decal
    const juice = tk.sprite.juice;
    this._burst(tk.x, tk.y, juice, tk.sprite.pottery ? '#8a5a30' : '#e88a96',
                tk.sprite.pottery ? 16 : 26, tk.sprite.pottery ? 'shard' : 'dot');
    this._burst(tk.x, tk.y, juice, juice, 8, 'dot');
    this.decals.push({
      cv: bladeMakeSplat(juice, 90 + Math.random() * 70, this.dpr),
      x: tk.x, y: tk.y, rot: Math.random() * Math.PI * 2,
      a: 0.5, decay: 0.0013, s: 1
    });
    if (this.decals.length > 12) this.decals.shift();
    // slice flash line
    this.rings.push({ x: tk.x, y: tk.y, r0: 2, r1: tk.r * 1.3, t0: this.now, dur: 200, c: 'rgba(255,248,225,0.8)', lw: 2 });
  }

  // ── Slice results ────────────────────────────────────────
  _onSlice(tk, px, py, now) {
    if (tk.correct) {
      let pts = 1;
      const crit = this.bladeV > 2.1 || Math.random() < 0.08;
      if (crit) {
        pts += 2;
        this._burst(px, py, '#f6d678', '#fff3c8', 30, 'spark');
        this.rings.push({ x: px, y: py, r0: 6, r1: 120, t0: this.now, dur: 420, c: 'rgba(246,214,120,0.9)', lw: 3 });
        this._callout('ΚΑΙΡΙΑ ΤΟΜΗ!', px, py - 44, 26, '#f6d678');
        BladeSfx.crit();
      } else {
        BladeSfx.splat(tk.sprite.pottery);
      }
      // combo tracking (within one stroke, tight window)
      if (now - this.lastSliceT < 420 && this.strokeSlices > 0) this.strokeSlices++;
      else this.strokeSlices = 1;
      this.lastSliceT = now;
      if (this.strokeSlices >= 2) {
        const bonus = this.strokeSlices === 2 ? 1 : 2;
        pts += bonus;
        const label = this.strokeSlices === 2 ? 'ΔΙΠΛΟ!' :
                      this.strokeSlices === 3 ? 'ΤΡΙΠΛΟ!' : 'ΘΡΙΑΜΒΟΣ ×' + this.strokeSlices;
        this._callout(label, this.W * 0.5, this.H * 0.34, 34 + this.strokeSlices * 3, '#e8c25a');
        BladeSfx.combo(this.strokeSlices);
      }
      this.score += pts;
      this.streak++;
      if (this.streak > 0 && this.streak % 4 === 0) this.pendingPomo = true;
      this.popups.push({ text: '+' + pts, x: px, y: py, vy: -1.2, life: 1, size: crit ? 26 : 20, c: crit ? '#f6d678' : '#e8d8a0' });
      this._updateHUD();
      if (!this.frenzy) {
        this.correctSliced = true;
        if (this.dismissTid) clearTimeout(this.dismissTid);
        this.dismissTid = setTimeout(() => {
          this.dismissTid = null;
          this.tokens.forEach(t => { if (!t.special) t.dismiss = true; });
          this.roundPool = [];
        }, 300);
        this._schedNextRound(800);
      }
    } else {
      // ── Wrong form: bomb-style detonation ──
      if (window.symLogMistake) {
        try {
          const right = (this.tokens.find(t => t.correct) || {}).text || this._roundCorrect || '';
          window.symLogMistake({ q: this.promptText, wrong: tk.text, right, cat: 'Ξίφος του Γραμματικού', gameId: 'blade' });
        } catch (_) {}
      }
      this.flashA = BLADE_REDUCED ? 0.22 : 0.5;
      this.rings.push({ x: px, y: py, r0: 6, r1: Math.max(this.W, this.H) * 0.42, t0: this.now, dur: 620, c: 'rgba(255,120,80,0.85)', lw: 5 });
      this.rings.push({ x: px, y: py, r0: 2, r1: 130, t0: this.now, dur: 320, c: 'rgba(255,235,210,0.9)', lw: 3 });
      this.stamps.push({ x: px, y: py, rot: (Math.random() - 0.5) * 0.35, a: 1 });
      this._burst(px, py, '#3a3a3a', '#232323', 16, 'smoke');
      this._burst(px, py, '#ff7a3c', '#e74c3c', 26, 'spark');
      this.shakeF = 22; this.shakeA = BLADE_REDUCED ? 4 : 15;
      if (!BLADE_REDUCED) this.tsPulses.push({ v: 0.4, until: this.now + 520 });
      BladeSfx.bomb();

      this.lives--; this.errors++;
      this.streak = 0; this.pendingPomo = false;
      this._updateHUD(true);
      if (this.lives === 1) this._callout('ΤΕΛΕΥΤΑΙΑ ΖΩΗ!', this.W * 0.5, this.H * 0.30, 30, '#ff8a6a');
      if (this.lives <= 0) {
        this.gameOver = true;   // stop further slicing immediately
        this.roundPool = [];
        this.tokens.forEach(t => { t.dismiss = true; });
        this._schedGameOver(950);
      }
    }
  }

  _schedNextRound(ms) {
    if (this.roundTid) { clearTimeout(this.roundTid); this.roundTid = null; }
    this.roundTid = setTimeout(() => { this.roundTid = null; this._nextRound(); }, ms);
  }
  _schedGameOver(ms) {
    if (this.roundTid) { clearTimeout(this.roundTid); this.roundTid = null; }
    this.roundTid = setTimeout(() => { this.roundTid = null; this._doGameOver(); }, ms);
  }

  // ── Particles ────────────────────────────────────────────
  _burst(px, py, c1, c2, n, type) {
    if (this.parts.length > 340) return;
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1.2 + Math.random() * 5.4;
      this.parts.push({
        type: type || 'dot',
        x: px, y: py,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.6,
        ay: type === 'smoke' ? -0.03 : 0.19,
        life: 1, decay: (type === 'smoke' ? 0.02 : 0.024) + Math.random() * 0.026,
        r: type === 'smoke' ? 6 + Math.random() * 9 : 1.4 + Math.random() * 2.6,
        rot: Math.random() * Math.PI * 2, spin: (Math.random() - 0.5) * 0.3,
        c: Math.random() > 0.5 ? c1 : c2
      });
    }
  }

  _callout(text, x, y, size, color) {
    this.callouts.push({ text, x, y, size, c: color || '#e8c25a',
                         rot: (Math.random() - 0.5) * 0.12, t0: this.now, dur: 1150 });
    if (this.callouts.length > 6) this.callouts.shift();
  }

  // ── HUD ──────────────────────────────────────────────────
  _updateHUD(lostLife) {
    const lv = document.getElementById('blade-lives');
    if (lv) {
      lv.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const s = document.createElement('span');
        const full = i < this.lives;
        s.className = 'blade-heart ' + (full ? 'full' : 'empty');
        if (lostLife && i === this.lives) s.className += ' just-lost';
        s.textContent = full ? '♥' : '♡';
        lv.appendChild(s);
      }
    }
    const sc = document.getElementById('blade-score');
    if (sc && sc.textContent !== String(this.score)) {
      sc.textContent = this.score;
      sc.classList.remove('pop'); void sc.offsetWidth; sc.classList.add('pop');
    }
    const st = document.getElementById('blade-streak');
    if (st) {
      if (this.streak >= 2) { st.textContent = '×' + this.streak; st.style.display = 'block'; }
      else st.style.display = 'none';
    }
  }

  _setPrompt(text) {
    this.promptText = text || '';
    const pr = document.getElementById('blade-prompt');
    const pm = document.getElementById('blade-prompt-main');
    const ps = document.getElementById('blade-prompt-sub');
    if (!pr) return;
    if (pm && ps) {
      const ix = this.promptText.indexOf(' · ');
      if (ix > -1) {
        pm.textContent = this.promptText.slice(0, ix);
        ps.textContent = this.promptText.slice(ix + 3);
      } else { pm.textContent = this.promptText; ps.textContent = ''; }
    } else pr.textContent = this.promptText;
    pr.classList.remove('swap'); void pr.offsetWidth; pr.classList.add('swap');
  }

  // ── Rounds (data sources unchanged) ──────────────────────
  _nounRound() {
    const raw = (this.modeDef && this.modeDef.raw) ? this.modeDef.raw() : null;
    if (!raw || !raw.length) return null;
    const entry = raw[Math.floor(Math.random() * raw.length)];
    const [lemma,, sing, plur] = entry;
    const numI  = Math.floor(Math.random() * 2);
    const caseI = Math.floor(Math.random() * 5);
    const correct = (numI === 0 ? sing : plur)[caseI];
    const all = [...sing, ...plur];
    return {
      prompt: BLADE_CASES[caseI] + ' ' + BLADE_NUMS[numI] + ' · ' + lemma,
      correct,
      distract: this._shuffle(all.filter(f => f !== correct))
    };
  }

  _adjRound() {
    const entries = (typeof PAR_G !== 'undefined') ? Object.values(PAR_G) : BLADE_FB_PAR;
    if (!entries.length) return null;
    const groups = {};
    for (const e of entries) {
      if (!groups[e.positive]) groups[e.positive] = [];
      groups[e.positive].push(e);
    }
    const positives = Object.keys(groups);
    if (!positives.length) return null;
    const pos    = positives[Math.floor(Math.random() * positives.length)];
    const degs   = groups[pos];
    const target = degs[Math.floor(Math.random() * degs.length)];
    const correct = target.endings[0];
    const label   = BLADE_DEG[target.degree] || target.degree.toUpperCase();
    const distract = [pos];
    for (const e of degs)
      if (e.degree !== target.degree) distract.push(...e.endings.slice(0, 2));
    return { prompt: label + ' · ' + pos, correct,
             distract: this._shuffle(distract.filter(f => f !== correct)) };
  }

  _gpRound() {
    const pool = this.gpPool;
    if (!pool || !pool.length) return null;
    const it = pool[Math.floor(Math.random() * pool.length)];
    if (!it || !it.correct) return null;
    return { prompt: it.prompt, correct: it.correct,
             distract: this._shuffle((it.distract || []).filter(f => f && f !== it.correct)) };
  }

  _nextRound() {
    if (!this.running || this.gameOver) return;
    this.correctSliced = false;
    this.roundNum++;

    const round = (this.modeDef && this.modeDef.kind === 'gp') ? this._gpRound()
                : (this.modeDef && this.modeDef.kind === 'adj') ? this._adjRound()
                : this._nounRound();
    if (!round) return;

    this._setPrompt(round.prompt);
    this._roundCorrect = round.correct;

    this.frenzy = this.roundNum >= 5 && this.roundNum % 5 === 0 && round.distract.length >= 1;
    if (this.frenzy) {
      const pool = [];
      for (let i = 0; i < 6; i++) pool.push({ text: round.correct, correct: true });
      round.distract.slice(0, 2).forEach(d => pool.push({ text: d, correct: false }));
      this.roundPool = this._shuffle(pool);
      this.spawnInterval = 15;
      this._callout('ΚΑΤΑΙΓΙΣΜΟΣ!', this.W * 0.5, this.H * 0.30, 44, '#ffb057');
      if (!BLADE_REDUCED) this.tsPulses.push({ v: 0.55, until: this.now + 900 });
      BladeSfx.combo(4);
    } else {
      const pool = [{ text: round.correct, correct: true }];
      round.distract.slice(0, 4).forEach(d => pool.push({ text: d, correct: false }));
      // each form appears twice → two chances per round
      this.roundPool = this._shuffle([...pool, ...pool]);
      this.spawnInterval = Math.max(34, 46 - this.score * 0.2);
    }
    this.spawnTimer = this.spawnInterval;      // first launch immediately

    if (this.pendingPomo && !this.frenzy) {
      this.pendingPomo = false;
      if (this.pomoTid) clearTimeout(this.pomoTid);
      this.pomoTid = setTimeout(() => {
        this.pomoTid = null;
        if (!this.running || this.gameOver) return;
        this._launchPomo();
        this._callout('ΧΡΥΣΟ ΡΟΔΙ!', this.W * 0.5, this.H * 0.36, 30, '#f6d678');
      }, 1300);
    }
  }

  _shuffle(a) {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  // ── Launch ───────────────────────────────────────────────
  _launch(form) {
    const fontPx = Math.round(Math.max(15, Math.min(25, this.W * 0.020)));
    const objId = BLADE_OBJ_IDS[Math.floor(Math.random() * BLADE_OBJ_IDS.length)];
    const sprite = bladeMakeSprite(form.text, objId, { dpr: this.dpr, fontPx });
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;
    const vyBottom = -(Math.sqrt((this.H * 0.7 + 70) * 0.26) + Math.random() * 3.0);
    const vySide   = -(Math.sqrt(this.H * 0.13) + Math.random() * 2.5);
    if (side === 0)      { x = -80; y = this.H * (0.60 + Math.random() * 0.25); vx = 2.6 + Math.random() * 2.2; vy = vySide; }
    else if (side === 1) { x = this.W + 80; y = this.H * (0.60 + Math.random() * 0.25); vx = -(2.6 + Math.random() * 2.2); vy = vySide; }
    else if (side === 2) { x = this.W * (0.1 + Math.random() * 0.35); y = this.H + 80; vx = 0.4 + Math.random() * 1.2; vy = vyBottom; }
    else                 { x = this.W * (0.55 + Math.random() * 0.35); y = this.H + 80; vx = -(0.4 + Math.random() * 1.2); vy = vyBottom; }
    this.tokens.push({
      text: form.text, correct: form.correct, sprite,
      x, y, vx, vy, w: sprite.w, h: sprite.h, r: Math.max(sprite.w, sprite.h) * 0.42 + 6,
      phase: Math.random() * 9, ang: 0,
      sliced: false, dismiss: false, alpha: 1, special: false
    });
  }

  _launchPomo() {
    const size = Math.max(64, Math.min(92, this.W * 0.07));
    const sprite = bladeMakeSprite(null, 'pom', { dpr: this.dpr, size, golden: true });
    this.tokens.push({
      text: '', correct: false, sprite, special: true, hits: 0, lastHit: 0,
      x: this.W * (0.35 + Math.random() * 0.3), y: this.H + 70,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.sqrt(this.H * 0.5 * 0.26) + 1.2),
      w: sprite.w, h: sprite.h, r: Math.max(sprite.w, sprite.h) * 0.42 + 8,
      phase: Math.random() * 9, ang: 0, sliced: false, dismiss: false, alpha: 1
    });
  }

  // ── Menu / game-over sliceable UI ────────────────────────
  showMenu() {
    this.scene = 'menu';
    this.running = false; this.gameOver = false; this.uiLock = false;
    this.tokens = []; this.shards = []; this.callouts = []; this.popups = [];
    this.rings = []; this.stamps = []; this.decals = [];
    this._clearTimers();
    if (!this.canvas) this._build();
    this._layoutMenu();
    const mui = document.getElementById('blade-menu-ui');
    if (mui) mui.classList.add('visible');
    const hud = document.getElementById('blade-hud');
    if (hud) hud.classList.remove('visible');
    const back = document.getElementById('blade-back-game');
    if (back) back.classList.remove('visible');
    this._ensureLoop();
  }

  _layoutMenu() {
    const wide = this.W >= 720;
    const size = Math.max(58, Math.min(96, this.W * (wide ? 0.062 : 0.11)));
    this.menuItems = BLADE_MODES.map((m, i) => {
      const best = parseInt(localStorage.getItem('blade_best_' + m.id) || '0', 10);
      let x, y;
      if (wide) { x = this.W * (0.155 + i * 0.23); y = this.H * 0.52; }
      else      { x = this.W * (i % 2 === 0 ? 0.27 : 0.73); y = this.H * (i < 2 ? 0.40 : 0.66); }
      return {
        modeId: m.id, title: m.title, hint: m.hint, best,
        sprite: bladeMakeSprite(null, m.obj, { dpr: this.dpr, size }),
        x, y, bob: 0, phase: i * 1.7, sliced: false, action: null
      };
    });
  }

  _layoutOver() {
    const size = Math.max(56, Math.min(84, this.W * 0.06));
    const items = [];
    items.push({ label: 'ΞΑΝΑ', action: 'replay',
                 sprite: bladeMakeSprite(null, 'pom', { dpr: this.dpr, size }),
                 x: this.W * ((this.modeDef && this.modeDef.kind === 'gp') ? 0.5 : 0.38),
                 y: this.H * 0.74, bob: 0, phase: 0.4, sliced: false });
    if (!(this.modeDef && this.modeDef.kind === 'gp'))
      items.push({ label: 'ΜΕΝΟΥ', action: 'menu',
                   sprite: bladeMakeSprite(null, 'kylix', { dpr: this.dpr, size }),
                   x: this.W * 0.62, y: this.H * 0.74, bob: 0, phase: 2.1, sliced: false });
    this.overItems = items;
  }

  _checkUiSlice(x1, y1, x2, y2) {
    const items = this.scene === 'menu' ? this.menuItems : this.overItems;
    for (const it of items) {
      if (it.sliced) continue;
      if (this._segHitsCircle(x1, y1, x2, y2, it.x, it.y + it.bob, it.sprite.r * 1.05)) {
        this._selectItem(it, Math.atan2(y2 - y1, x2 - x1));
        return;
      }
    }
  }

  _selectItem(it, theta) {
    if (this.uiLock || it.sliced) return;
    this.uiLock = true;
    it.sliced = true;
    // split the menu object like a real fruit
    const fake = { x: it.x, y: it.y + it.bob, vx: 0, vy: -1.4, ang: 0,
                   w: it.sprite.w, h: it.sprite.h, sprite: it.sprite, r: it.sprite.r };
    this._splitToken(fake, theta);
    BladeSfx.select(); BladeSfx.splat(it.sprite.pottery);
    if (this.uiTid) clearTimeout(this.uiTid);
    this.uiTid = setTimeout(() => {
      this.uiTid = null;
      if (this.scene === 'menu') bladeStartMode(it.modeId);
      else if (it.action === 'replay') this._startGame();
      else this._returnToModes();
    }, 430);
  }

  // ── Game over / navigation ───────────────────────────────
  _doGameOver() {
    this.running = false; this.gameOver = true;
    this.scene = 'over'; this.uiLock = false;
    const key  = 'blade_best_' + this.mode;
    const prev = parseInt(localStorage.getItem(key) || '0', 10);
    this.newBest = this.score > 0 && this.score >= prev;
    this.best = Math.max(this.score, prev);
    localStorage.setItem(key, String(this.best));
    if (typeof awardGameRewards === 'function' && this.score > 0)
      awardGameRewards('blade', { score: this.score, perfect: this.errors === 0 });
    const backBtn = document.getElementById('blade-back-game');
    if (backBtn) backBtn.classList.add('visible');
    const hud = document.getElementById('blade-hud');
    if (hud) hud.classList.remove('visible');
    this._layoutOver();
    if (this.newBest) {
      this._callout('ΝΕΟ ΡΕΚΟΡ!', this.W * 0.5, this.H * 0.24, 38, '#f6d678');
      this._burst(this.W * 0.5, this.H * 0.3, '#f6d678', '#fff3c8', 40, 'spark');
    }
    BladeSfx.gong();
  }

  _returnToModes() {
    if (this.modeDef && this.modeDef.kind === 'gp' && this.gpPool && this.gpPool.length) {
      this._startGame();          // configurator sessions replay the same bank
      return;
    }
    this.showMenu();
  }

  // ── Start / loop ─────────────────────────────────────────
  loadMode(mode) {
    this.modeDef = bladeModeDef(mode);
    this.mode = this.modeDef.id;
    if (!this.canvas) this._build();
    bladeEnsureData(this.modeDef).then(() => {
      if (this.alive) this._startGame();
    });
  }

  loadGP(pool, title) {
    this.gpPool  = pool || [];
    this.modeDef = { id: 'gp', kind: 'gp', title: title || 'Ξίφος του Γραμματικού' };
    this.mode = 'gp';
    if (!this.canvas) this._build();
    this._startGame();
  }

  _startGame() {
    this._clearTimers();
    this.scene = 'game';
    this.score = 0; this.streak = 0; this.lives = 3; this.errors = 0;
    this.roundNum = 0; this.newBest = false; this.pendingPomo = false;
    this.gameOver = false; this.running = true; this.uiLock = false;
    this.tokens = []; this.shards = []; this.parts = []; this.decals = [];
    this.callouts = []; this.popups = []; this.rings = []; this.stamps = [];
    this.pts = []; this.frenzy = false;
    this.shakeF = 0; this.shakeA = 0; this.flashA = 0;
    this.timeScale = 1; this.tsPulses = [];
    this.best = parseInt(localStorage.getItem('blade_best_' + this.mode) || '0', 10);

    const mui = document.getElementById('blade-menu-ui');
    if (mui) mui.classList.remove('visible');
    const hud = document.getElementById('blade-hud');
    if (hud) hud.classList.add('visible');
    const back = document.getElementById('blade-back-game');
    if (back) back.classList.remove('visible');

    this._updateHUD();
    this._nextRound();
    this._ensureLoop();
  }

  _ensureLoop() {
    if (this.raf) return;
    this.lastT = performance.now();
    const loop = (t) => {
      this.raf = null;
      if (!this.alive || !this.canvas || !this.canvas.isConnected) return;
      this._tick(t);
      this._draw();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  _clearTimers() {
    if (this.roundTid)   { clearTimeout(this.roundTid);   this.roundTid = null; }
    if (this.dismissTid) { clearTimeout(this.dismissTid); this.dismissTid = null; }
    if (this.pomoTid)    { clearTimeout(this.pomoTid);    this.pomoTid = null; }
    if (this.uiTid)      { clearTimeout(this.uiTid);      this.uiTid = null; }
  }

  // ── Tick ─────────────────────────────────────────────────
  _tick(t) {
    const rawDt = Math.min(t - this.lastT, 48);
    this.lastT = t; this.now = t;

    // time scale (slow-mo pulses + last-life tension)
    let target = 1;
    if (!BLADE_REDUCED) {
      if (this.scene === 'game' && this.running && this.lives === 1) target = 0.88;
      this.tsPulses = this.tsPulses.filter(p => p.until > t);
      for (const p of this.tsPulses) target = Math.min(target, p.v);
    }
    this.timeScale += (target - this.timeScale) * 0.10;
    const dt = rawDt * this.timeScale;
    const f = dt / 16.667;
    const rawF = rawDt / 16.667;

    // trail decay
    while (this.pts.length && t - this.pts[0].t > 190) this.pts.shift();
    if (!this.ptrDown) this.bladeV *= Math.pow(0.86, rawF);

    if (this.shakeF > 0) { this.shakeF -= rawF; this.shakeA *= Math.pow(0.86, rawF); } else this.shakeA = 0;
    if (this.flashA > 0) this.flashA = Math.max(0, this.flashA - 0.045 * rawF);

    // spawn + tokens
    if (this.scene === 'game' && this.running && !this.gameOver) {
      this.spawnTimer += f;
      if (this.roundPool.length && this.spawnTimer >= this.spawnInterval) {
        this.spawnTimer = 0;
        this._launch(this.roundPool.shift());
      }
      let live = 0;
      for (let i = this.tokens.length - 1; i >= 0; i--) {
        const tk = this.tokens[i];
        const grav = tk.special ? 0.5 : 1;
        tk.vy += (tk.vy < 0 ? 0.13 : 0.07) * grav * f;
        tk.x += tk.vx * f; tk.y += tk.vy * f;
        if (tk.dismiss) {
          tk.alpha -= 0.05 * f; tk.vy += 0.12 * f;
          if (tk.alpha <= 0) { this.tokens.splice(i, 1); continue; }
        }
        tk.ang = tk.special
          ? (tk.ang + 0.02 * f)
          : Math.sin(tk.phase + t * 0.0022) * 0.15;
        if (tk.y > this.H + 160 || Math.abs(tk.x - this.W * 0.5) > this.W) {
          this.tokens.splice(i, 1); continue;
        }
        if (!tk.dismiss && !tk.special) live++;
      }
      if (!this.roundPool.length && live === 0 && !this.correctSliced && !this.roundTid && !this.dismissTid) {
        this.frenzy = false;
        this._schedNextRound(360);
      }
    }

    // shards
    for (let i = this.shards.length - 1; i >= 0; i--) {
      const sh = this.shards[i];
      sh.vy += 0.16 * f;
      sh.x += sh.vx * f; sh.y += sh.vy * f;
      sh.rot += sh.spin * f;
      sh.life -= 0.011 * f;
      if (sh.life <= 0 || sh.y > this.H + 180) this.shards.splice(i, 1);
    }
    // particles
    for (let i = this.parts.length - 1; i >= 0; i--) {
      const p = this.parts[i];
      p.vx *= Math.pow(0.96, f); p.vy += p.ay * f;
      p.x += p.vx * f; p.y += p.vy * f;
      if (p.spin) p.rot += p.spin * f;
      if (p.type === 'smoke') p.r += 0.35 * f;
      p.life -= p.decay * f;
      if (p.life <= 0) this.parts.splice(i, 1);
    }
    // decals fade
    for (let i = this.decals.length - 1; i >= 0; i--) {
      const dcl = this.decals[i];
      dcl.a -= dcl.decay * rawF;
      if (dcl.a <= 0) this.decals.splice(i, 1);
    }
    // popups
    for (let i = this.popups.length - 1; i >= 0; i--) {
      const pp = this.popups[i];
      pp.y += pp.vy * rawF; pp.life -= 0.02 * rawF;
      if (pp.life <= 0) this.popups.splice(i, 1);
    }
    // callouts expire
    this.callouts = this.callouts.filter(c => t - c.t0 < c.dur);
    // rings
    this.rings = this.rings.filter(rg => t - rg.t0 < rg.dur);
    // stamps
    for (let i = this.stamps.length - 1; i >= 0; i--) {
      this.stamps[i].a -= 0.012 * rawF;
      if (this.stamps[i].a <= 0) this.stamps.splice(i, 1);
    }
    // ambient drift
    for (const am of this.ambient) {
      am.x += (am.vx + Math.sin(am.phase + t * 0.001) * 0.08) * rawF;
      am.y += am.vy * rawF;
      if (am.type === 'ember' && am.y < -10) { am.y = this.H - 20; am.x = (Math.random() < 0.5 ? 0.075 : 0.925) * this.W + (Math.random() - 0.5) * 30; }
      if (am.type === 'petal') {
        if (am.y > this.H + 10) { am.y = -10; am.x = Math.random() * this.W; }
        if (am.x < -12) am.x = this.W + 10;
      }
    }
    // menu / over bobbing
    const items = this.scene === 'menu' ? this.menuItems : this.scene === 'over' ? this.overItems : null;
    if (items) for (const it of items)
      it.bob = BLADE_REDUCED ? 0 : Math.sin(it.phase + t * 0.0016) * 7;
  }

  // ── Draw ─────────────────────────────────────────────────
  _draw() {
    const ctx = this.ctx;
    if (!ctx || !this.canvas) return;
    const d = this.dpr, W = this.W, H = this.H, t = this.now;

    ctx.setTransform(d, 0, 0, d, 0, 0);
    let sx = 0, sy = 0;
    if (this.shakeA > 0.4) {
      sx = (Math.random() - 0.5) * this.shakeA;
      sy = (Math.random() - 0.5) * this.shakeA;
      ctx.translate(sx, sy);
    }

    // backdrop
    if (this.bg) ctx.drawImage(this.bg, 0, 0, W, H);
    else { ctx.fillStyle = '#14100c'; ctx.fillRect(0, 0, W, H); }

    // splash decals
    for (const dcl of this.decals) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, dcl.a);
      ctx.translate(dcl.x, dcl.y); ctx.rotate(dcl.rot);
      const dw = dcl.cv.width / d, dh = dcl.cv.height / d;
      ctx.drawImage(dcl.cv, -dw / 2, -dh / 2, dw, dh);
      ctx.restore();
    }

    // ambient embers & petals
    for (const am of this.ambient) {
      if (am.type === 'ember') {
        ctx.globalAlpha = 0.35 + 0.3 * Math.sin(am.phase + t * 0.004);
        ctx.fillStyle = '#ffab5e';
        ctx.beginPath(); ctx.arc(am.x, am.y, am.r, 0, Math.PI * 2); ctx.fill();
      } else {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = '#c9788a';
        ctx.save();
        ctx.translate(am.x, am.y); ctx.rotate(am.phase + t * 0.0012);
        ctx.beginPath(); ctx.ellipse(0, 0, am.r, am.r * 0.45, 0, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;

    if (this.scene === 'menu') this._drawMenu(ctx, t);
    else if (this.scene === 'over') this._drawOver(ctx, t);

    // shards (split halves)
    for (const sh of this.shards) this._drawShard(ctx, sh);

    // tokens
    if (this.scene === 'game')
      for (const tk of this.tokens) this._drawToken(ctx, tk, t);

    // particles
    for (const p of this.parts) {
      const a = Math.max(0, p.life);
      if (p.type === 'smoke') {
        ctx.globalAlpha = a * 0.4;
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      } else if (p.type === 'shard') {
        ctx.globalAlpha = a * 0.95;
        ctx.fillStyle = p.c;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.beginPath();
        ctx.moveTo(-p.r * 1.4, p.r); ctx.lineTo(0, -p.r * 1.6); ctx.lineTo(p.r * 1.4, p.r * 0.6);
        ctx.closePath(); ctx.fill();
        ctx.restore();
      } else if (p.type === 'spark') {
        ctx.globalAlpha = a * 0.95;
        ctx.strokeStyle = p.c; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.vx * 2.2, p.y - p.vy * 2.2); ctx.stroke();
      } else {
        ctx.globalAlpha = a * 0.92;
        ctx.fillStyle = p.c;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;

    // shockwave rings
    for (const rg of this.rings) {
      const p = (t - rg.t0) / rg.dur;
      const r = rg.r0 + (rg.r1 - rg.r0) * (1 - Math.pow(1 - p, 2.6));
      ctx.globalAlpha = (1 - p) * 0.9;
      ctx.strokeStyle = rg.c; ctx.lineWidth = rg.lw * (1 - p * 0.6);
      ctx.beginPath(); ctx.arc(rg.x, rg.y, r, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // X stamps
    for (const st of this.stamps) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, st.a);
      ctx.translate(st.x, st.y); ctx.rotate(st.rot);
      ctx.font = '900 84px "Cinzel", serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(30,4,4,0.85)';
      ctx.strokeText('Χ', 0, 0);
      ctx.fillStyle = '#e0392b';
      ctx.fillText('Χ', 0, 0);
      ctx.restore();
    }

    // blade ribbon
    this._drawBlade(ctx, t);

    // popups & callouts
    for (const pp of this.popups) {
      ctx.globalAlpha = Math.max(0, pp.life);
      ctx.font = '700 ' + pp.size + 'px "Cinzel", serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(20,10,4,0.8)';
      ctx.strokeText(pp.text, pp.x, pp.y);
      ctx.fillStyle = pp.c;
      ctx.fillText(pp.text, pp.x, pp.y);
    }
    ctx.globalAlpha = 1;
    for (const c of this.callouts) this._drawCallout(ctx, c, t);

    // detonation flash + last-life vignette + frenzy tint
    if (this.flashA > 0.01) {
      ctx.fillStyle = 'rgba(255,244,230,' + this.flashA.toFixed(3) + ')';
      ctx.fillRect(-sx - 4, -sy - 4, W + 8, H + 8);
    }
    if (this.scene === 'game' && this.running && this.lives === 1) {
      const pulse = 0.16 + 0.06 * Math.sin(t * 0.005);
      const vg = ctx.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.32, W / 2, H / 2, Math.max(W, H) * 0.66);
      vg.addColorStop(0, 'rgba(160,20,20,0)'); vg.addColorStop(1, 'rgba(160,20,20,' + pulse.toFixed(3) + ')');
      ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
    }
    if (this.frenzy && this.running) {
      ctx.fillStyle = 'rgba(255,176,87,0.05)';
      ctx.fillRect(0, 0, W, H);
    }
  }

  _drawToken(ctx, tk, t) {
    ctx.save();
    if (tk.dismiss) ctx.globalAlpha = Math.max(0, tk.alpha);
    ctx.translate(tk.x, tk.y);
    ctx.rotate(tk.ang);
    if (tk.special) {
      const gl = 0.5 + 0.5 * Math.sin(t * 0.008);
      ctx.shadowColor = 'rgba(246,214,120,' + (0.5 + gl * 0.4).toFixed(2) + ')';
      ctx.shadowBlur = 22 + gl * 14;
    }
    ctx.drawImage(tk.sprite.cv, -tk.w / 2, -tk.h / 2, tk.w, tk.h);
    ctx.restore();
  }

  _drawShard(ctx, sh) {
    const a = Math.max(0, Math.min(1, sh.life * 1.5));
    const S = Math.max(sh.w, sh.h);
    ctx.save();
    ctx.globalAlpha = a;
    ctx.translate(sh.x, sh.y);
    ctx.rotate(sh.rot);
    ctx.rotate(sh.theta);
    ctx.beginPath();
    if (sh.half === 0) ctx.rect(-S, -S, S * 2, S);
    else ctx.rect(-S, 0, S * 2, S);
    ctx.clip();
    ctx.rotate(-sh.theta);
    ctx.drawImage(sh.cv, -sh.w / 2, -sh.h / 2, sh.w, sh.h);
    ctx.restore();
  }

  _drawBlade(ctx, t) {
    const n = this.pts.length;
    if (n < 2 || !this.ptrDown) return;
    const vNorm = Math.max(0.35, Math.min(1.6, this.bladeV));
    const maxW = 13 * vNorm;
    // build ribbon polygon
    const left = [], right = [];
    for (let i = 0; i < n; i++) {
      const p = this.pts[i];
      const q = this.pts[Math.min(i + 1, n - 1)];
      const pr = this.pts[Math.max(i - 1, 0)];
      let dx = q.x - pr.x, dy = q.y - pr.y;
      const dd = Math.hypot(dx, dy) || 1;
      dx /= dd; dy /= dd;
      const wgt = Math.pow(i / (n - 1), 1.35) * maxW + 0.4;
      left.push({ x: p.x - dy * wgt, y: p.y + dx * wgt });
      right.push({ x: p.x + dy * wgt, y: p.y - dx * wgt });
    }
    // glow pass
    ctx.save();
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.20;
    ctx.strokeStyle = '#e8c25a';
    ctx.lineWidth = maxW * 2.6;
    ctx.beginPath();
    ctx.moveTo(this.pts[0].x, this.pts[0].y);
    for (let i = 1; i < n; i++) ctx.lineTo(this.pts[i].x, this.pts[i].y);
    ctx.stroke();
    // core ribbon
    ctx.globalAlpha = 0.94;
    ctx.beginPath();
    ctx.moveTo(left[0].x, left[0].y);
    for (let i = 1; i < n; i++) ctx.lineTo(left[i].x, left[i].y);
    for (let i = n - 1; i >= 0; i--) ctx.lineTo(right[i].x, right[i].y);
    ctx.closePath();
    const tip = this.pts[n - 1], tail = this.pts[0];
    const rg = ctx.createLinearGradient(tail.x, tail.y, tip.x, tip.y);
    rg.addColorStop(0, 'rgba(232,194,90,0.06)');
    rg.addColorStop(0.55, 'rgba(255,244,214,0.65)');
    rg.addColorStop(1, '#ffffff');
    ctx.fillStyle = rg;
    ctx.fill();
    // edge glint
    ctx.globalAlpha = 0.5;
    ctx.strokeStyle = 'rgba(255,238,180,0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  _drawCallout(ctx, c, t) {
    const p = (t - c.t0) / c.dur;
    if (p >= 1) return;
    const scale = p < 0.22 ? bladeEaseOutBack(p / 0.22) : 1;
    const alpha = p > 0.7 ? 1 - (p - 0.7) / 0.3 : 1;
    ctx.save();
    ctx.globalAlpha = Math.max(0, alpha);
    ctx.translate(c.x, c.y - p * 16);
    ctx.rotate(c.rot);
    ctx.scale(scale, scale);
    ctx.font = 'italic 700 ' + c.size + 'px "Noto Serif", serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.lineWidth = Math.max(3, c.size * 0.16);
    ctx.strokeStyle = 'rgba(24,12,4,0.85)';
    ctx.strokeText(c.text, 0, 0);
    ctx.fillStyle = c.c;
    ctx.fillText(c.text, 0, 0);
    ctx.restore();
  }

  _drawPlinth(ctx, x, y, w) {
    ctx.save();
    ctx.globalAlpha = 0.65;
    const g = ctx.createLinearGradient(x - w / 2, 0, x + w / 2, 0);
    g.addColorStop(0, '#3a3040'); g.addColorStop(0.5, '#57485c'); g.addColorStop(1, '#2c2434');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.moveTo(x - w * 0.42, y);
    ctx.lineTo(x + w * 0.42, y);
    ctx.lineTo(x + w * 0.5, y + 14);
    ctx.lineTo(x - w * 0.5, y + 14);
    ctx.closePath(); ctx.fill();
    ctx.fillRect(x - w * 0.46, y - 5, w * 0.92, 5);
    ctx.restore();
  }

  _drawMenu(ctx, t) {
    for (const it of this.menuItems) {
      const y = it.y + it.bob;
      this._drawPlinth(ctx, it.x, it.y + it.sprite.h * 0.52, it.sprite.w * 1.1);
      if (!it.sliced) {
        ctx.save();
        ctx.translate(it.x, y);
        ctx.rotate(BLADE_REDUCED ? 0 : Math.sin(it.phase + t * 0.0016) * 0.06);
        ctx.drawImage(it.sprite.cv, -it.sprite.w / 2, -it.sprite.h / 2, it.sprite.w, it.sprite.h);
        ctx.restore();
      }
      // labels
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      const ty = it.y + it.sprite.h * 0.52 + 24;
      ctx.font = '700 ' + Math.max(13, Math.min(16, this.W * 0.013)) + 'px "Cinzel", serif';
      ctx.fillStyle = '#c9a44a';
      ctx.fillText(it.title, it.x, ty);
      ctx.font = Math.max(10, Math.min(12, this.W * 0.010)) + 'px "Noto Serif", serif';
      ctx.fillStyle = 'rgba(232,216,160,0.55)';
      ctx.fillText(it.hint, it.x, ty + 22);
      if (it.best) {
        ctx.font = '700 ' + Math.max(10, Math.min(12, this.W * 0.010)) + 'px "Cinzel", serif';
        ctx.fillStyle = 'rgba(201,164,74,0.6)';
        ctx.fillText('Καλύτερος: ' + it.best, it.x, ty + 40);
      }
    }
  }

  _drawOver(ctx, t) {
    const cx = this.W * 0.5;
    // dark wash
    ctx.fillStyle = 'rgba(8,5,10,0.55)';
    ctx.fillRect(0, 0, this.W, this.H);
    // marble stele
    const pw = Math.min(400, this.W * 0.86), ph = Math.min(250, this.H * 0.42);
    const py = this.H * 0.35;
    ctx.save();
    ctx.translate(cx, py);
    // pediment
    ctx.fillStyle = '#241d2c';
    ctx.strokeStyle = 'rgba(201,164,74,0.5)'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-pw * 0.54, -ph * 0.5);
    ctx.lineTo(0, -ph * 0.5 - 34);
    ctx.lineTo(pw * 0.54, -ph * 0.5);
    ctx.closePath(); ctx.fill(); ctx.stroke();
    // slab
    const mg = ctx.createLinearGradient(0, -ph / 2, 0, ph / 2);
    mg.addColorStop(0, '#2c2438'); mg.addColorStop(1, '#1c1626');
    ctx.fillStyle = mg;
    bladeRRPath(ctx, -pw / 2, -ph / 2, pw, ph, 10);
    ctx.fill(); ctx.stroke();
    // laurel arcs
    ctx.strokeStyle = 'rgba(201,164,74,0.35)'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(0, ph * 0.05, pw * 0.30, Math.PI * 0.75, Math.PI * 1.35); ctx.stroke();
    ctx.beginPath(); ctx.arc(0, ph * 0.05, pw * 0.30, Math.PI * 1.65, Math.PI * 2.25); ctx.stroke();
    // text
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#c9a44a';
    ctx.font = '700 ' + Math.min(24, pw * 0.062) + 'px "Cinzel", serif';
    ctx.fillText('ΤΕΛΟΣ ΠΑΙΧΝΙΔΙΟΥ', 0, -ph * 0.30);
    ctx.globalAlpha = 0.35;
    ctx.strokeStyle = '#c9a44a'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-pw * 0.3, -ph * 0.16); ctx.lineTo(pw * 0.3, -ph * 0.16); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#f0e4c0';
    ctx.font = '700 ' + Math.min(46, pw * 0.13) + 'px "Cinzel", serif';
    ctx.fillText(String(this.score), 0, ph * 0.04);
    ctx.font = Math.min(13, pw * 0.036) + 'px "Cinzel", serif';
    ctx.fillStyle = 'rgba(232,216,160,0.6)';
    ctx.fillText('ΒΑΘΜΟΣ', 0, -ph * 0.08);
    ctx.fillStyle = this.newBest ? '#f6d678' : 'rgba(201,164,74,0.7)';
    ctx.font = '700 ' + Math.min(15, pw * 0.042) + 'px "Cinzel", serif';
    ctx.fillText((this.newBest ? '🏆 ΝΕΟ ΡΕΚΟΡ · ' : 'ΚΑΛΥΤΕΡΟΣ · ') + this.best, 0, ph * 0.28);
    ctx.restore();

    // sliceable replay / menu objects
    for (const it of this.overItems) {
      const y = it.y + it.bob;
      if (!it.sliced) {
        ctx.save();
        ctx.translate(it.x, y);
        ctx.rotate(BLADE_REDUCED ? 0 : Math.sin(it.phase + t * 0.0016) * 0.06);
        ctx.drawImage(it.sprite.cv, -it.sprite.w / 2, -it.sprite.h / 2, it.sprite.w, it.sprite.h);
        ctx.restore();
      }
      ctx.textAlign = 'center'; ctx.textBaseline = 'top';
      ctx.font = '700 14px "Cinzel", serif';
      ctx.fillStyle = '#c9a44a';
      ctx.fillText(it.label, it.x, it.y + it.sprite.h * 0.55 + 6);
    }
    ctx.font = '12px "Noto Serif", serif';
    ctx.fillStyle = 'rgba(232,216,160,0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('Κόψε ένα αντικείμενο για να συνεχίσεις', this.W * 0.5, this.H * 0.88);
  }

  // ── Teardown ─────────────────────────────────────────────
  destroy() {
    this.alive = false;
    this.running = false; this.gameOver = false;
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    this._clearTimers();
    window.removeEventListener('resize', this._rz);
    if (this.canvas) {
      this.canvas.removeEventListener('pointermove',   this._pm);
      this.canvas.removeEventListener('pointerdown',   this._pd);
      this.canvas.removeEventListener('pointerup',     this._pu);
      this.canvas.removeEventListener('pointercancel', this._pu);
      this.canvas.removeEventListener('pointerleave',  this._pu);
      this.canvas = null; this.ctx = null;
    }
    if (this.container) this.container.innerHTML = '';
  }
}

// ══════════════════════════════════════════════════════════
// OPEN / CLOSE — platform overlay integration (contract kept)
// ══════════════════════════════════════════════════════════

let _bladeGame = null;
let _bladeEsc  = null;

function bladeBuildUI() {
  const wrap = document.getElementById('blade-wrap');
  if (!wrap) return;
  if (_bladeGame) { _bladeGame.destroy(); _bladeGame = null; }
  _bladeGame = new BladeGame(wrap);
  _bladeGame.showMenu();
}

function bladeStartMode(mode) {
  const wrap = document.getElementById('blade-wrap');
  if (!wrap) return;
  // Reuse the live instance (menu → game transition keeps the canvas warm)
  if (_bladeGame && _bladeGame.alive && _bladeGame.container === wrap) {
    _bladeGame.loadMode(mode);
    return;
  }
  if (_bladeGame) { _bladeGame.destroy(); _bladeGame = null; }
  _bladeGame = new BladeGame(wrap);
  _bladeGame.loadMode(mode);
}

// Build blade's round pool from a normalized GP question bank (cfg.G items
// shaped {q:{gr,en}, a:[…], c}). Lives here so blade is self-sufficient even if
// nav.js hasn't pre-built window._gpBladePool.
function _bladePoolFromCfg(cfg) {
  if (!cfg) return null;
  if (Array.isArray(cfg.questions) && cfg.questions.length) {
    return cfg.questions.map(function(it){
      var opts = Array.isArray(it.a) ? it.a : (Array.isArray(it.opts) ? it.opts : []);
      var ci   = (typeof it.c === 'number') ? it.c : (typeof it.ans === 'number' ? it.ans : 0);
      var correct = opts[ci];
      var prompt  = (it.q && it.q.gr) ? it.q.gr : String(it.q || '');
      return { prompt: prompt, correct: correct, distract: opts.filter(function(_,i){ return i !== ci; }) };
    }).filter(function(r){ return r.prompt && r.correct; });
  }
  if (Array.isArray(window._gpBladePool) && window._gpBladePool.length) return window._gpBladePool;
  const G = cfg.G;
  if (!Array.isArray(G) || !G.length) return null;
  if (typeof _gpToMcItems === 'function') {
    return _gpToMcItems(G).map(it => ({
      prompt:   it.q && it.q.gr ? it.q.gr : String(it.q || ''),
      correct:  it.a[it.c],
      distract: it.a.filter((_, i) => i !== it.c),
    })).filter(r => r.prompt && r.correct);
  }
  return G.map(item => {
    const opts = Array.isArray(item.options) && item.options.length ? item.options : [item.a];
    return { prompt: String(item.q || ''), correct: String(item.a || ''),
             distract: opts.filter(o => o !== item.a) };
  }).filter(r => r.prompt && r.correct);
}

// Accepts either the legacy (levelId, mode) signature OR a configurator cfg
// object (first arg). A cfg / injected pool launches the grammar bank directly,
// skipping blade's internal mode-select screen.
function openBlade(arg, mode) {
  const overlay = document.getElementById('blade-overlay');
  if (!overlay) return;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (!_bladeEsc) {
    _bladeEsc = function (e) {
      if (e.key !== 'Escape') return;
      const ov = document.getElementById('blade-overlay');
      if (!ov || !ov.classList.contains('active')) return;
      if (document.querySelector('.qrm')) return;   // QR share modal handles its own Escape
      closeBlade();
    };
    document.addEventListener('keydown', _bladeEsc);
  }

  const cfg  = (arg && typeof arg === 'object') ? arg : null;
  const pool = (Array.isArray(window._gpBladePool) && window._gpBladePool.length)
    ? window._gpBladePool
    : (cfg ? _bladePoolFromCfg(cfg) : null);

  if (pool && pool.length) {
    bladeStartGP(pool, cfg && cfg.title);
    return;
  }
  if (mode) bladeStartMode(mode);
  else bladeBuildUI();
}

function bladeStartGP(pool, title) {
  const wrap = document.getElementById('blade-wrap');
  if (!wrap) return;
  if (_bladeGame) { _bladeGame.destroy(); _bladeGame = null; }
  _bladeGame = new BladeGame(wrap);
  _bladeGame.loadGP(pool, title);
}

function closeBlade() {
  if (_bladeGame) { _bladeGame.destroy(); _bladeGame = null; }
  if (_bladeEsc) { document.removeEventListener('keydown', _bladeEsc); _bladeEsc = null; }
  const overlay = document.getElementById('blade-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  window._gpBladePool = null;   // clear any configurator bank
}
