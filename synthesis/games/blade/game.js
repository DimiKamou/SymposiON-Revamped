// ══════════════════════════════════════════════════════════
// GRAMMARIAN'S BLADE — Ξίφος του Γραμματικού
// Fruit-Ninja style grammar slicer · vanilla JS + Canvas
// ══════════════════════════════════════════════════════════

const BLADE_CASES = ['ΟΝΟΜΑΣΤΙΚΗ','ΓΕΝΙΚΗ','ΔΟΤΙΚΗ','ΑΙΤΙΑΤΙΚΗ','ΚΛΗΤΙΚΗ'];
const BLADE_NUMS  = ['ΕΝΙΚΟΥ','ΠΛΗΘΥΝΤΙΚΟΥ'];
const BLADE_DEG   = { 'συγκριτικός':'ΣΥΓΚΡΙΤΙΚΟΣ ΒΑΘΜΟΣ', 'υπερθετικός':'ΥΠΕΡΘΕΤΙΚΟΣ ΒΑΘΜΟΣ' };

// ── Selectable grammar exercises ────────────────────────────
// Every mode reuses the same slice mechanic. `kind` chooses the round
// generator; noun modes pull from a declension-paradigm array (shape:
// [lemma, gender, sing[5], plur[5]]). Scoped to grammar content for now —
// more exercises (verbs, pronouns) can be added as further entries.
const BLADE_MODES = [
  { id: 'nouns',  kind: 'noun', icon: '🏛️',
    title: 'Ουσιαστικά Α΄ Κλίσης', hint: 'Κόψε τον σωστό τύπο κλίσης',
    raw: () => (typeof NOUN_RAW_A !== 'undefined' ? NOUN_RAW_A : null) },
  { id: 'nounsB', kind: 'noun', icon: '🏺',
    title: 'Ουσιαστικά Β΄ Κλίσης', hint: 'Κόψε τον σωστό τύπο κλίσης',
    raw: () => (typeof NOUN_RAW_B !== 'undefined' ? NOUN_RAW_B : null) },
  { id: 'nounsC', kind: 'noun', icon: '⚱️',
    title: 'Ουσιαστικά Γ΄ Κλίσης', hint: 'Κόψε τον σωστό τύπο κλίσης',
    raw: () => (typeof NOUN_RAW_C !== 'undefined' ? NOUN_RAW_C : null) },
  { id: 'adj',    kind: 'adj',  icon: '⚔️',
    title: 'Παραθετικά Επιθέτων', hint: 'Συγκριτικός & Υπερθετικός βαθμός' },
];
function bladeModeDef(id) {
  return BLADE_MODES.find(m => m.id === id) || BLADE_MODES[0];
}

// ──────────────────────────────────────────────────────────
class BladeGame {
  constructor(containerEl) {
    this.container = containerEl;
    this.canvas    = null;
    this.ctx       = null;
    this.raf       = null;
    this.mode      = null;
    this.modeDef   = null;

    this.W = 0; this.H = 0; this.dpr = 1;

    // State
    this.score  = 0;
    this.streak = 0;
    this.lives  = 3;
    this.best   = 0;
    this.running  = false;
    this.gameOver = false;

    // Round
    this.promptText    = '';
    this.roundPool     = [];
    this.spawnTimer    = 0;
    this.spawnInterval = 52;   // frames between launches
    this.correctSliced = false;
    this.roundTid      = null;

    // Objects
    this.tokens    = [];
    this.particles = [];

    // Pointer / trail
    this.trail      = [];
    this.ptrDown    = false;
    this.lastPX     = 0;
    this.lastPY     = 0;

    // Shake
    this.shakeF = 0;
    this.shakeA = 0;

    this.lastT = 0;

    // Bound handlers
    this._rz  = this._resize.bind(this);
    this._pm  = this._ptrMove.bind(this);
    this._pd  = this._ptrDown.bind(this);
    this._pu  = this._ptrUp.bind(this);
  }

  // ── Build DOM ────────────────────────────────────────────

  _build() {
    this.container.innerHTML = '';

    const gs = document.createElement('div');
    gs.id = 'blade-screen-game';

    // HUD
    const hud = document.createElement('div');
    hud.id = 'blade-hud';
    hud.innerHTML =
      '<div id="blade-lives"></div>' +
      '<div id="blade-prompt"></div>' +
      '<div id="blade-score-wrap">' +
        '<div id="blade-score">0</div>' +
        '<div id="blade-streak"></div>' +
      '</div>';
    gs.appendChild(hud);

    // Back-to-menu button (only visible on game-over)
    const back = document.createElement('button');
    back.id        = 'blade-back-game';
    back.textContent = '← Επιλογή Τρόπου';
    back.addEventListener('click', () => this._returnToModes());
    gs.appendChild(back);

    // Canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'blade-canvas';
    gs.appendChild(this.canvas);

    this.container.appendChild(gs);
    this.ctx = this.canvas.getContext('2d');

    this._resize();
    window.addEventListener('resize', this._rz);
    this.canvas.addEventListener('pointermove',  this._pm, { passive: true });
    this.canvas.addEventListener('pointerdown',  this._pd, { passive: true });
    this.canvas.addEventListener('pointerup',    this._pu, { passive: true });
    this.canvas.addEventListener('pointercancel',this._pu, { passive: true });
  }

  _resize() {
    if (!this.canvas) return;
    const p = this.canvas.parentElement;
    const r = p ? p.getBoundingClientRect() : { width: 0, height: 0 };
    this.W   = r.width  || window.innerWidth;
    this.H   = r.height || window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width  = Math.round(this.W * this.dpr);
    this.canvas.height = Math.round(this.H * this.dpr);
    this.canvas.style.width  = this.W + 'px';
    this.canvas.style.height = this.H + 'px';
  }

  // ── Pointer ──────────────────────────────────────────────

  _ptrDown(e) {
    this.ptrDown = true;
    const rc = this.canvas.getBoundingClientRect();
    const x  = e.clientX - rc.left;
    const y  = e.clientY - rc.top;
    this.trail  = [{ x, y }];
    this.lastPX = x; this.lastPY = y;
  }

  _ptrMove(e) {
    if (!this.ptrDown) return;
    const rc = this.canvas.getBoundingClientRect();
    const x  = e.clientX - rc.left;
    const y  = e.clientY - rc.top;
    this.trail.push({ x, y });
    if (this.trail.length > 7) this.trail.shift();
    if (this.running && !this.gameOver) this._checkSlice(x, y);
    this.lastPX = x; this.lastPY = y;
  }

  _ptrUp() {
    this.ptrDown = false;
    this.trail   = [];
  }

  // ── Slice ────────────────────────────────────────────────

  _checkSlice(x2, y2) {
    if (this.trail.length < 2) return;
    const { x: x1, y: y1 } = this.trail[this.trail.length - 2];
    for (let i = this.tokens.length - 1; i >= 0; i--) {
      const tk = this.tokens[i];
      if (tk.sliced) continue;
      const l = tk.x - tk.w * 0.5,  r = tk.x + tk.w * 0.5;
      const t = tk.y - tk.h * 0.5,  b = tk.y + tk.h * 0.5;
      if (this._segHitsAABB(x1, y1, x2, y2, l, t, r, b)) {
        tk.sliced   = true;
        tk.sliceT   = 0;
        tk.sliceDir = x2 > x1 ? 1 : -1;
        this._onSlice(tk, (x1 + x2) * 0.5, (y1 + y2) * 0.5);
        return;
      }
    }
  }

  _segHitsAABB(ax, ay, bx, by, l, t, r, bt) {
    if (ax >= l && ax <= r && ay >= t && ay <= bt) return true;
    if (bx >= l && bx <= r && by >= t && by <= bt) return true;
    const sides = [[l,t,r,t],[r,t,r,bt],[l,bt,r,bt],[l,t,l,bt]];
    for (const [x3,y3,x4,y4] of sides) {
      const d  = (y4-y3)*(bx-ax) - (x4-x3)*(by-ay);
      if (Math.abs(d) < 1e-9) continue;
      const ua = ((x4-x3)*(ay-y3) - (y4-y3)*(ax-x3)) / d;
      const ub = ((bx-ax)*(ay-y3) - (by-ay)*(ax-x3)) / d;
      if (ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1) return true;
    }
    return false;
  }

  // ── Slice result ─────────────────────────────────────────

  _onSlice(tok, px, py) {
    if (tok.correct) {
      this._burst(px, py, '#c9a44a', '#f0e080', 32);
      this._burst(px, py, '#fff8e1', '#ffffff', 10);
      this.score++;
      this.streak++;
      this.correctSliced = true;
      this._updateHUD();
      // dismiss remaining airborne tokens
      this.tokens.forEach(tk => { if (!tk.sliced) { tk.sliced = true; tk.sliceT = 0; tk.sliceDir = 1; } });
      this.roundPool = [];
      this._schedNextRound(420);
    } else {
      if (window.symLogMistake) { try { window.symLogMistake({ q: this.promptText, wrong: tok.text, right: (this.tokens.find(function(t){return t.correct;})||{}).text || '', cat: 'Ξίφος του Γραμματικού', gameId: 'blade' }); } catch (_) {} }
      this._burst(px, py, '#c0392b', '#e74c3c', 22);
      this._burst(px, py, '#7a1a12', '#922b21', 8);
      this.lives--; this.errors++;
      this.streak = 0;
      this.shakeF = 20; this.shakeA = 10;
      this._updateHUD();
      if (this.lives <= 0) {
        this.tokens.forEach(tk => { if (!tk.sliced) { tk.sliced = true; tk.sliceT = 0; tk.sliceDir = 1; } });
        this.roundPool = [];
        this._schedGameOver(650);
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

  // ── Particles ─────────────────────────────────────────────

  _burst(px, py, c1, c2, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 1.5 + Math.random() * 5.5;
      this.particles.push({
        x: px, y: py,
        vx: Math.cos(a) * s, vy: Math.sin(a) * s - 1.5,
        ay: 0.2,
        life: 1, decay: 0.025 + Math.random() * 0.028,
        r: 1.5 + Math.random() * 2.5,
        c: Math.random() > 0.5 ? c1 : c2,
      });
    }
  }

  // ── HUD ───────────────────────────────────────────────────

  _updateHUD() {
    const lv = document.getElementById('blade-lives');
    if (lv) {
      lv.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const s = document.createElement('span');
        s.className = 'blade-heart ' + (i < this.lives ? 'full' : 'empty');
        s.textContent = i < this.lives ? '♥' : '♡';
        lv.appendChild(s);
      }
    }
    const sc = document.getElementById('blade-score');
    if (sc) sc.textContent = this.score;
    const st = document.getElementById('blade-streak');
    if (st) {
      if (this.streak >= 2) { st.textContent = '×' + this.streak; st.style.display = 'block'; }
      else st.style.display = 'none';
    }
    const pr = document.getElementById('blade-prompt');
    if (pr) pr.textContent = this.promptText;
  }

  // ── Data / Rounds ─────────────────────────────────────────

  _nounRound() {
    const raw = (this.modeDef && this.modeDef.raw) ? this.modeDef.raw() : null;
    if (!raw || !raw.length) return null;
    const entry  = raw[Math.floor(Math.random() * raw.length)];
    const [lemma,, sing, plur] = entry;
    const numI   = Math.floor(Math.random() * 2);
    const caseI  = Math.floor(Math.random() * 5);
    const correct = (numI === 0 ? sing : plur)[caseI];
    const all     = [...sing, ...plur];
    const distract = this._shuffle(all.filter(f => f !== correct));
    return {
      prompt: BLADE_CASES[caseI] + ' ' + BLADE_NUMS[numI] + ' · ' + lemma,
      correct,
      distract,
    };
  }

  _adjRound() {
    if (typeof PAR_G === 'undefined') return null;
    const entries = Object.values(PAR_G);
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
    // Distractors: positive form + forms of other degrees
    const distract = [pos];
    for (const e of degs) {
      if (e.degree !== target.degree) distract.push(...e.endings.slice(0, 2));
    }
    return {
      prompt: label + ' · ' + pos,
      correct,
      distract: this._shuffle(distract.filter(f => f !== correct)),
    };
  }

  // Rounds from a Games-Panel configurator bank (gp-content / cfg.G), shaped as
  // [{ prompt, correct, distract:[…] }] and stored on this.gpPool. Lets blade
  // play any grammar dataset chosen in the Engine Configurator (item 5).
  _gpRound() {
    const pool = this.gpPool;
    if (!pool || !pool.length) return null;
    const it = pool[Math.floor(Math.random() * pool.length)];
    if (!it || !it.correct) return null;
    return {
      prompt:   it.prompt,
      correct:  it.correct,
      distract: this._shuffle((it.distract || []).filter(f => f && f !== it.correct)),
    };
  }

  _nextRound() {
    if (!this.running || this.gameOver) return;
    this.correctSliced = false;

    const round = (this.modeDef && this.modeDef.kind === 'gp')
      ? this._gpRound()
      : (this.modeDef && this.modeDef.kind === 'adj')
        ? this._adjRound() : this._nounRound();
    if (!round) return;

    this.promptText = round.prompt;
    const pr = document.getElementById('blade-prompt');
    if (pr) pr.textContent = this.promptText;

    const pool = [{ text: round.correct, correct: true }];
    round.distract.slice(0, 4).forEach(d => pool.push({ text: d, correct: false }));
    // Each form appears twice → two passes per round, doubling reaction time
    this.roundPool  = this._shuffle([...pool, ...pool]);
    this.spawnTimer = 0;
  }

  _shuffle(a) {
    const b = [...a];
    for (let i = b.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [b[i], b[j]] = [b[j], b[i]];
    }
    return b;
  }

  // ── Token launch ──────────────────────────────────────────

  _launch(form) {
    // Scale token size with screen — helps readability on projectors / big displays
    const fontSize = Math.round(Math.max(14, Math.min(24, this.W * 0.020)));
    let w = Math.round(Math.max(100, this.W * 0.13));
    if (this.ctx) {
      this.ctx.save();
      this.ctx.font = Math.round(fontSize * this.dpr) + 'px "Noto Serif",serif';
      w = Math.max(w, this.ctx.measureText(form.text).width / this.dpr + 48);
      this.ctx.restore();
    }
    const h    = Math.round(Math.max(50, Math.min(88, this.H * 0.10)));
    const side = Math.floor(Math.random() * 4);
    let x, y, vx, vy;

    // Velocities scale with screen height so tokens arc to the upper/middle screen
    // regardless of display size.  Physics: gravity = 0.13 (up) / 0.07 (down).
    // Side tokens spawn in the lower 60-85 % of screen and arc upward through the middle.
    // Bottom tokens use vy = sqrt((H*0.7+70)*0.26) so they peak at ~30 % from top.
    const vyBottom = -(Math.sqrt((this.H * 0.7 + 70) * 0.26) + Math.random() * 3.0);
    const vySide   = -(Math.sqrt(this.H * 0.13) + Math.random() * 2.5);
    if (side === 0) {          // left
      x = -70; y = this.H * (0.60 + Math.random() * 0.25);
      vx =  2.6 + Math.random() * 2.2; vy = vySide;
    } else if (side === 1) {   // right
      x = this.W + 70; y = this.H * (0.60 + Math.random() * 0.25);
      vx = -(2.6 + Math.random() * 2.2); vy = vySide;
    } else if (side === 2) {   // bottom-left
      x = this.W * (0.1 + Math.random() * 0.35); y = this.H + 70;
      vx = 0.4 + Math.random() * 1.2; vy = vyBottom;
    } else {                   // bottom-right
      x = this.W * (0.55 + Math.random() * 0.35); y = this.H + 70;
      vx = -(0.4 + Math.random() * 1.2); vy = vyBottom;
    }

    this.tokens.push({ text: form.text, correct: form.correct, x, y, vx, vy, w, h, sliced: false, sliceT: 0, sliceDir: 1 });
  }

  // ── Game Over ─────────────────────────────────────────────

  _doGameOver() {
    this.gameOver = true;
    this.running  = false;
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }

    const key  = 'blade_best_' + this.mode;
    const prev = parseInt(localStorage.getItem(key) || '0', 10);
    this.best  = Math.max(this.score, prev);
    localStorage.setItem(key, String(this.best));

    if(typeof awardGameRewards==='function' && this.score > 0){ awardGameRewards('blade', { score: this.score, perfect: this.errors === 0 }); }

    const backBtn = document.getElementById('blade-back-game');
    if (backBtn) backBtn.classList.add('visible');

    const loop = () => {
      this._drawFrame();
      if (this.gameOver && this.canvas && this.canvas.isConnected) this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  _returnToModes() {
    this.gameOver = false;
    this.running  = false;
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    // Configurator-launched (gp) sessions have no internal mode grid — replay the
    // same bank instead of dropping into blade's own noun/adjective picker.
    if (this.modeDef && this.modeDef.kind === 'gp' && this.gpPool && this.gpPool.length) {
      this._start();
      return;
    }
    this._teardownCanvas();
    bladeBuildUI();      // rebuild the mode-selector inside #blade-wrap
  }

  // ── Main loop ─────────────────────────────────────────────

  _start() {
    this.score  = 0; this.streak = 0; this.lives = 3; this.errors = 0;
    this.gameOver = false; this.running = true;
    this.tokens = []; this.particles = []; this.trail = [];
    this.shakeF = 0; this.shakeA = 0;
    this.best = parseInt(localStorage.getItem('blade_best_' + this.mode) || '0', 10);

    this._updateHUD();
    this._nextRound();

    this.lastT = performance.now();
    const loop = (t) => {
      if (!this.running) return;
      this._tick(t);
      this._drawFrame();
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  _tick(t) {
    const dt = Math.min((t - this.lastT) / 16.667, 3);
    this.lastT = t;

    if (this.shakeF > 0) { this.shakeF--; this.shakeA *= 0.82; } else this.shakeA = 0;
    if (!this.running) return;

    // Spawn
    this.spawnTimer += dt;
    if (this.roundPool.length && this.spawnTimer >= this.spawnInterval) {
      this.spawnTimer = 0;
      this._launch(this.roundPool.shift());
    }

    // Update tokens
    let live = 0;
    for (let i = this.tokens.length - 1; i >= 0; i--) {
      const tk = this.tokens[i];
      if (tk.sliced) {
        tk.sliceT += 0.09 * dt;
        if (tk.sliceT >= 1) this.tokens.splice(i, 1);
        continue;
      }
      // Asymmetric gravity: slower ascent + descent = more time to read & slice
      tk.vy += (tk.vy < 0 ? 0.13 : 0.07) * dt;
      tk.x  += tk.vx * dt;
      tk.y  += tk.vy * dt;
      if (tk.y > this.H + 130 || Math.abs(tk.x - this.W * 0.5) > this.W) {
        this.tokens.splice(i, 1); continue;
      }
      live++;
    }

    // Round ended naturally (all tokens gone, pool empty, no correct found)
    if (!this.roundPool.length && live === 0 && !this.correctSliced && !this.roundTid)
      this._schedNextRound(320);

    // Update particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.vx *= 0.96; p.vy += p.ay;
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.life -= p.decay * dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }
  }

  // ── Draw ──────────────────────────────────────────────────

  _drawFrame() {
    const ctx = this.ctx;
    if (!ctx || !this.canvas) return;
    const cW = this.canvas.width, cH = this.canvas.height, d = this.dpr;

    ctx.save();
    if (this.shakeA > 0.4) ctx.translate((Math.random()-0.5)*this.shakeA*d, (Math.random()-0.5)*this.shakeA*d);

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, 0, cH);
    bg.addColorStop(0, '#100d0b'); bg.addColorStop(1, '#1c1710');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, cW, cH);

    this._drawRelief(ctx, cW, cH, d);

    // Particles
    for (const p of this.particles) {
      ctx.globalAlpha = Math.max(0, p.life * 0.92);
      ctx.fillStyle = p.c;
      ctx.beginPath(); ctx.arc(p.x*d, p.y*d, p.r*d, 0, Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Blade trail
    if (this.trail.length >= 2) {
      ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (let i = 1; i < this.trail.length; i++) {
        const alpha = i / this.trail.length;
        ctx.globalAlpha = alpha * 0.72;
        ctx.strokeStyle = '#c9a44a';
        ctx.lineWidth = (1 + alpha * 2.2) * d;
        ctx.beginPath();
        ctx.moveTo(this.trail[i-1].x*d, this.trail[i-1].y*d);
        ctx.lineTo(this.trail[i].x*d,   this.trail[i].y*d);
        ctx.stroke();
      }
      ctx.globalAlpha = 1; ctx.restore();
    }

    for (const tk of this.tokens) this._drawToken(ctx, tk, d);

    ctx.restore();
    if (this.gameOver) this._drawGameOver(ctx, cW, cH, d);
  }

  _drawRelief(ctx, W, H, d) {
    ctx.save();
    ctx.globalAlpha = 0.042;
    ctx.strokeStyle = '#c9a44a'; ctx.fillStyle = '#c9a44a';
    const n = 6, top = H*0.07, bot = H*0.93;
    for (let i = 0; i < n; i++) {
      const cx = (W/(n+1))*(i+1);
      ctx.lineWidth = 13*d;
      ctx.beginPath(); ctx.moveTo(cx, top+5*d); ctx.lineTo(cx, bot-5*d); ctx.stroke();
      ctx.lineWidth = d;
      ctx.fillRect(cx-18*d, top, 36*d, 5*d);
      ctx.fillRect(cx-22*d, top-4*d, 44*d, 4*d);
      ctx.fillRect(cx-18*d, bot-5*d, 36*d, 5*d);
      ctx.fillRect(cx-22*d, bot, 44*d, 4*d);
    }
    ctx.lineWidth = 2*d;
    ctx.beginPath(); ctx.moveTo(0, top-5*d); ctx.lineTo(W, top-5*d); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, bot+4*d); ctx.lineTo(W, bot+4*d); ctx.stroke();
    ctx.restore();
  }

  _drawToken(ctx, tk, d) {
    const tx = tk.x*d, ty = tk.y*d, tw = tk.w*d, th = tk.h*d, r = 8*d;
    ctx.save();
    if (tk.sliced) {
      ctx.globalAlpha = Math.max(0, 1 - tk.sliceT*1.7);
      ctx.translate(tx + tk.sliceDir*tk.sliceT*30*d, ty + tk.sliceT*26*d);
      ctx.rotate(tk.sliceDir * tk.sliceT * 0.28);
    } else {
      ctx.translate(tx, ty);
    }

    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 10*d; ctx.shadowOffsetY = 3*d;
    const fill = ctx.createLinearGradient(-tw*.5,-th*.5, tw*.5,th*.5);
    fill.addColorStop(0,'#2e2318'); fill.addColorStop(1,'#1a1309');
    ctx.fillStyle = fill;
    this._rrect(ctx, -tw*.5,-th*.5, tw,th, r); ctx.fill();

    ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
    ctx.lineWidth = 1.5*d; ctx.strokeStyle = 'rgba(201,164,74,0.46)';
    this._rrect(ctx, -tw*.5,-th*.5, tw,th, r); ctx.stroke();

    // Top sheen
    ctx.save(); ctx.globalAlpha *= 0.28;
    const sh = ctx.createLinearGradient(-tw*.5,-th*.5, -tw*.5, 0);
    sh.addColorStop(0,'rgba(255,255,240,0.22)'); sh.addColorStop(1,'transparent');
    ctx.fillStyle = sh;
    this._rrect(ctx,-tw*.5,-th*.5,tw,th*.5,r); ctx.fill();
    ctx.restore();

    const fSize = Math.round(Math.max(14, Math.min(24, this.W * 0.020)));
    ctx.font = Math.round(fSize * d) + 'px "Noto Serif",serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#e8d4a0';
    ctx.shadowColor = 'rgba(0,0,0,0.9)'; ctx.shadowBlur = 3*d;
    ctx.fillText(tk.text, 0, 0);
    ctx.restore();
  }

  _rrect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x+r,y); ctx.lineTo(x+w-r,y); ctx.quadraticCurveTo(x+w,y,x+w,y+r);
    ctx.lineTo(x+w,y+h-r); ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);
    ctx.lineTo(x+r,y+h); ctx.quadraticCurveTo(x,y+h,x,y+h-r);
    ctx.lineTo(x,y+r); ctx.quadraticCurveTo(x,y,x+r,y);
    ctx.closePath();
  }

  _drawGameOver(ctx, W, H, d) {
    const cx = W*.5, cy = H*.5;
    const pw = Math.min(360*d, W*.88), ph = 210*d, r = 14*d;
    ctx.save();
    ctx.fillStyle = 'rgba(8,6,4,0.83)'; ctx.fillRect(0,0,W,H);

    ctx.shadowColor = 'rgba(0,0,0,0.7)'; ctx.shadowBlur = 22*d;
    ctx.fillStyle = '#1c160e';
    this._rrect(ctx, cx-pw*.5, cy-ph*.5, pw, ph, r); ctx.fill();
    ctx.shadowBlur = 0;
    ctx.lineWidth = 2*d; ctx.strokeStyle = '#c9a44a';
    this._rrect(ctx, cx-pw*.5, cy-ph*.5, pw, ph, r); ctx.stroke();

    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = '#c9a44a';
    ctx.font = 'bold ' + Math.round(21*d) + 'px "Cinzel",serif';
    ctx.fillText('ΤΕΛΟΣ ΠΑΙΧΝΙΔΙΟΥ', cx, cy-67*d);

    ctx.globalAlpha = 0.3; ctx.strokeStyle = '#c9a44a'; ctx.lineWidth = d;
    ctx.beginPath(); ctx.moveTo(cx-pw*.3,cy-42*d); ctx.lineTo(cx+pw*.3,cy-42*d); ctx.stroke();
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#e8d8a0'; ctx.font = Math.round(17*d) + 'px "Cinzel",serif';
    ctx.fillText('Βαθμός: ' + this.score, cx, cy-10*d);

    const newBest = this.score >= this.best;
    ctx.fillStyle = newBest ? '#c9a44a' : 'rgba(201,164,74,0.6)';
    ctx.font = Math.round(13*d) + 'px "Cinzel",serif';
    ctx.fillText((newBest ? '🏆 Νέο ' : '') + 'Καλύτερος: ' + this.best, cx, cy+24*d);

    ctx.fillStyle = 'rgba(200,185,155,0.42)'; ctx.font = Math.round(11*d) + 'px "Cinzel",serif';
    ctx.fillText('Πάτα "← Επιλογή Τρόπου" για νέο παιχνίδι', cx, cy+68*d);
    ctx.restore();
  }

  // ── Public API ────────────────────────────────────────────

  loadMode(mode) {
    this.modeDef = bladeModeDef(mode);
    this.mode    = this.modeDef.id;   // normalize legacy aliases
    if (!this.canvas) this._build();
    this._start();
  }

  // Launch a Games-Panel / configurator session over an arbitrary grammar bank.
  loadGP(pool, title) {
    this.gpPool  = pool || [];
    this.modeDef = { id: 'gp', kind: 'gp', title: title || 'Ξίφος του Γραμματικού' };
    this.mode    = 'gp';
    if (!this.canvas) this._build();
    this._start();
  }

  _teardownCanvas() {
    window.removeEventListener('resize', this._rz);
    if (this.canvas) {
      this.canvas.removeEventListener('pointermove',   this._pm);
      this.canvas.removeEventListener('pointerdown',   this._pd);
      this.canvas.removeEventListener('pointerup',     this._pu);
      this.canvas.removeEventListener('pointercancel', this._pu);
      this.canvas = null; this.ctx = null;
    }
    if (this.roundTid) { clearTimeout(this.roundTid); this.roundTid = null; }
  }

  destroy() {
    this.running = false; this.gameOver = false;
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
    this._teardownCanvas();
    if (this.container) this.container.innerHTML = '';
  }
}

// ══════════════════════════════════════════════════════════
// OPEN / CLOSE — platform overlay integration
// ══════════════════════════════════════════════════════════

let _bladeGame = null;

function bladeBuildUI() {
  const wrap = document.getElementById('blade-wrap');
  if (!wrap) return;
  if (_bladeGame) { _bladeGame.destroy(); _bladeGame = null; }

  // Build one card per grammar exercise from the BLADE_MODES registry.
  const bestStyle = 'font:0.72rem \'Cinzel\',serif;color:rgba(201,164,74,0.55);margin-top:4px';
  const cards = BLADE_MODES.map(m => {
    const best = parseInt(localStorage.getItem('blade_best_' + m.id) || '0', 10);
    const bestHtml = best ? '<span style="' + bestStyle + '">Καλύτερος: ' + best + '</span>' : '';
    return '<button class="blade-mode-btn" onclick="bladeStartMode(\'' + m.id + '\')">' +
        '<span class="bm-icon">' + m.icon + '</span>' +
        '<span class="bm-title">' + m.title + '</span>' +
        '<span class="bm-hint">' + m.hint + '</span>' +
        bestHtml +
      '</button>';
  }).join('');

  wrap.innerHTML =
    '<div id="blade-screen-modes">' +
      '<h1>Ξίφος του Γραμματικού</h1>' +
      '<p class="blade-subtitle">Κόψε τη σωστή γραμματική μορφή · Φρουτονίνια Γλωσσολογίας</p>' +
      '<button class="blade-share-btn" onclick="typeof showQR===\'function\'&&showQR(\'Ξίφος του Γραμματικού\',{nav:\'game\',id:\'blade\'})">📱 Μοιράσου στην τάξη</button>' +
      '<p class="blade-mode-label">Επίλεξε γραμματική άσκηση</p>' +
      '<div class="blade-mode-grid">' + cards + '</div>' +
    '</div>';
}

function bladeStartMode(mode) {
  const wrap = document.getElementById('blade-wrap');
  if (!wrap) return;
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
  // Fallback: derive from {q,a,options}
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
  const overlay = document.getElementById('blade-overlay');
  if (overlay) overlay.classList.remove('active');
  document.body.style.overflow = '';
  window._gpBladePool = null;   // clear any configurator bank
}
