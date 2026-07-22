/* =============================================================================
 * Flappy Waiting Game  —  drop-in "while you wait" mini-game
 * -----------------------------------------------------------------------------
 * A self-contained, style-isolated (Shadow DOM) Flappy-Bird clone. No deps.
 * Works in plain HTML, React, Vue, Svelte — anywhere custom elements run.
 *
 * USAGE
 *   <script src="flappy-waiting-game.js"></script>   // or: import './flappy-waiting-game.js'
 *
 *   // 1) As a modal "waiting" overlay (recommended for loading states):
 *   const w = FlappyWaiting.open({ title: 'While you wait…', onClose(){} });
 *   // ...when the wait is over:
 *   w.close();
 *
 *   // 2) Inline, anywhere:
 *   <flappy-waiting-game></flappy-waiting-game>
 *   // or: FlappyWaiting.embed(document.querySelector('#slot'));
 *
 * The game pauses itself when its overlay is closed and tears down cleanly
 * (cancels rAF, removes listeners, closes its AudioContext) on removal.
 * ========================================================================== */
(function () {
  "use strict";
  if (window.customElements && customElements.get("flappy-waiting-game")) return; // already loaded

  // ---- Safe storage (sandboxed iframes throw on localStorage) ----------------
  const store = (() => {
    let ok = true;
    try { const k = "__flap_test__"; localStorage.setItem(k, "1"); localStorage.removeItem(k); }
    catch (e) { ok = false; }
    const mem = {};
    return {
      get(k, d) { try { if (!ok) return k in mem ? mem[k] : d; const v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return k in mem ? mem[k] : d; } },
      set(k, v) { try { if (ok) localStorage.setItem(k, v); else mem[k] = String(v); } catch (e) { mem[k] = String(v); } },
    };
  })();

  const GAME_CSS = `
    :host { display:block; width:100%; height:100%; }
    * { margin:0; padding:0; box-sizing:border-box; }
    #wrap {
      position:relative; width:100%; max-width:420px; aspect-ratio:420/640;
      max-height:100%; margin:0 auto; border-radius:14px; overflow:hidden;
      box-shadow:0 20px 60px rgba(0,0,0,.45);
      font-family:"Trebuchet MS","Segoe UI",system-ui,sans-serif;
      -webkit-tap-highlight-color:transparent; touch-action:manipulation; user-select:none;
    }
    canvas { display:block; width:100%; height:100%; cursor:pointer; }
    #ui {
      position:absolute; inset:0; display:flex; flex-direction:column;
      align-items:center; justify-content:center; pointer-events:none;
      text-align:center; color:#fff;
    }
    .panel {
      pointer-events:auto; background:rgba(0,0,0,.32);
      backdrop-filter:blur(4px); -webkit-backdrop-filter:blur(4px);
      padding:26px 30px; border-radius:18px; border:2px solid rgba(255,255,255,.25);
      box-shadow:0 8px 30px rgba(0,0,0,.35); max-width:86%;
      transition:opacity .25s ease, transform .25s ease;
    }
    h1 {
      font-size:clamp(26px,8vw,44px); letter-spacing:1px; color:#ffd34d;
      text-shadow:0 3px 0 #d68a00,0 5px 8px rgba(0,0,0,.4); margin-bottom:6px;
    }
    .sub { font-size:14px; opacity:.92; margin-bottom:18px; line-height:1.5; }
    .key {
      display:inline-block; background:rgba(255,255,255,.9); color:#222;
      border-radius:6px; padding:1px 8px; font-weight:700; font-size:12px;
      box-shadow:0 2px 0 rgba(0,0,0,.3);
    }
    button.btn {
      pointer-events:auto; font-family:inherit; font-weight:700; font-size:17px;
      color:#553a00; background:linear-gradient(#ffd34d,#ffb700); border:none;
      border-bottom:4px solid #c98a00; border-radius:12px; padding:12px 30px;
      cursor:pointer; transition:transform .08s ease, filter .15s ease;
    }
    button.btn:hover { filter:brightness(1.06); }
    button.btn:active { transform:translateY(2px); border-bottom-width:2px; }
    .scores { display:flex; gap:26px; justify-content:center; margin-bottom:20px; }
    .scorebox { min-width:96px; }
    .scorebox .label { font-size:12px; letter-spacing:2px; opacity:.8; text-transform:uppercase; }
    .scorebox .val { font-size:40px; font-weight:800; text-shadow:0 3px 6px rgba(0,0,0,.4); }
    .medal { font-size:38px; margin-bottom:4px; }
    .hidden { opacity:0; transform:scale(.92); pointer-events:none !important; }
    .gone { display:none; }
    #liveScore {
      position:absolute; top:18px; left:0; right:0; text-align:center;
      font-size:52px; font-weight:800; color:#fff;
      text-shadow:0 3px 0 rgba(0,0,0,.35),0 6px 10px rgba(0,0,0,.35);
      pointer-events:none; opacity:0; transition:opacity .2s ease;
    }
    #liveScore.show { opacity:1; }
    #sound {
      position:absolute; top:12px; right:12px; pointer-events:auto;
      background:rgba(0,0,0,.3); border:1px solid rgba(255,255,255,.25); color:#fff;
      width:38px; height:38px; border-radius:10px; font-size:18px; cursor:pointer;
      display:flex; align-items:center; justify-content:center; transition:background .15s ease;
    }
    #sound:hover { background:rgba(0,0,0,.5); }
    .credit { margin-top:14px; font-size:11px; opacity:.6; }
  `;

  const GAME_HTML = `
    <div id="wrap">
      <canvas id="game" width="420" height="640"></canvas>
      <div id="liveScore">0</div>
      <button id="sound" title="Toggle sound">🔊</button>
      <div id="ui">
        <div class="panel" id="startPanel">
          <h1>FLAPPY BIRD</h1>
          <div class="sub">
            Tap, click, or press <span class="key">Space</span> to flap.<br>
            Fly through the pipes. Don't crash.
          </div>
          <button class="btn" id="startBtn">PLAY</button>
          <div class="credit">A little game to pass the time</div>
        </div>
        <div class="panel hidden gone" id="overPanel">
          <div class="medal" id="medal">🏅</div>
          <h1 style="font-size:32px;">GAME OVER</h1>
          <div class="scores">
            <div class="scorebox"><div class="label">Score</div><div class="val" id="finalScore">0</div></div>
            <div class="scorebox"><div class="label">Best</div><div class="val" id="bestScore">0</div></div>
          </div>
          <button class="btn" id="retryBtn">PLAY AGAIN</button>
        </div>
      </div>
    </div>
  `;

  // ===========================================================================
  // <flappy-waiting-game> — the game itself
  // ===========================================================================
  class FlappyWaitingGame extends HTMLElement {
    constructor() {
      super();
      this._root = this.attachShadow({ mode: "open" });
      this._root.innerHTML = `<style>${GAME_CSS}</style>${GAME_HTML}`;
      this._active = false;
      this._raf = 0;
    }

    connectedCallback() { if (!this._booted) this._boot(); this.resume(); }
    disconnectedCallback() { this._teardown(); }

    /** Stop animating + listening (e.g. overlay hidden). Safe to call repeatedly. */
    pause() {
      this._active = false;
      if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; }
    }
    /** Resume animating. Resets the frame clock so there's no dt spike. */
    resume() {
      if (this._active) return;
      this._active = true;
      this._last = performance.now();
      this._raf = requestAnimationFrame(this._loop);
    }
    /** Jump straight into a fresh round. */
    restart() { if (this._startGame) this._startGame(); }

    _teardown() {
      this.pause();
      if (this._onKey) window.removeEventListener("keydown", this._onKey);
      if (this._actx) { try { this._actx.close(); } catch (e) {} this._actx = null; }
      this._booted = false;
    }

    // ---- All game logic, scoped to this instance's shadow root -------------
    _boot() {
      this._booted = true;
      const root = this._root;
      const self = this;
      const canvas = root.getElementById("game");
      const ctx = canvas.getContext("2d");
      const W = canvas.width, H = canvas.height;
      const GROUND_H = 90, FLOOR_Y = H - GROUND_H;

      const STATE = { READY: 0, PLAYING: 1, OVER: 2 };
      let state = STATE.READY;
      let score = 0;
      let best = +store.get("flappyBest", 0);
      let soundOn = store.get("flappySound", "1") === "1";

      // Tunables
      const GRAVITY = 1500, FLAP_V = -440, MAX_FALL = 620;
      const PIPE_W = 66, GAP = 168, PIPE_SPACING = 220, SPEED = 150, BIRD_R = 15;

      const bird = { x: W * 0.30, y: H * 0.45, vy: 0, rot: 0, wing: 0 };
      let pipes = [], clouds = [], particles = [], groundX = 0;

      function spawnPipe(x) {
        const margin = 70, minTop = margin, maxTop = FLOOR_Y - GAP - margin;
        pipes.push({ x, top: minTop + Math.random() * (maxTop - minTop), passed: false });
      }
      function resetPipes() {
        pipes = [];
        let x = W + 120;
        for (let i = 0; i < 4; i++) { spawnPipe(x); x += PIPE_SPACING; }
      }
      function initClouds() {
        clouds = [];
        for (let i = 0; i < 6; i++) clouds.push({
          x: Math.random() * W, y: 40 + Math.random() * (FLOOR_Y - 160),
          s: 0.4 + Math.random() * 0.6, scale: 0.6 + Math.random() * 0.9,
        });
      }
      function burst(x, y, color, n = 14) {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * Math.PI * 2, sp = 60 + Math.random() * 180;
          particles.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 60,
            life: 0.6 + Math.random() * 0.4, max: 1, color, r: 2 + Math.random() * 3 });
        }
      }

      // Audio (WebAudio, no files)
      function audioCtx() {
        if (!self._actx) { try { self._actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { self._actx = null; } }
        return self._actx;
      }
      function tone(freq, dur, type = "square", vol = 0.15, slideTo = null) {
        if (!soundOn) return;
        const a = audioCtx(); if (!a) return;
        if (a.state === "suspended") a.resume();
        const t = a.currentTime, osc = a.createOscillator(), gain = a.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, t);
        if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(gain).connect(a.destination);
        osc.start(t); osc.stop(t + dur + 0.02);
      }
      const sfx = {
        flap: () => tone(620, 0.12, "square", 0.10, 360),
        score: () => { tone(880, 0.08, "square", 0.12); setTimeout(() => tone(1175, 0.10, "square", 0.12), 70); },
        hit: () => tone(180, 0.18, "sawtooth", 0.18, 70),
        die: () => { tone(300, 0.18, "square", 0.14, 120); setTimeout(() => tone(160, 0.3, "sawtooth", 0.14, 60), 120); },
      };

      // DOM refs (scoped)
      const startPanel = root.getElementById("startPanel");
      const overPanel = root.getElementById("overPanel");
      const startBtn = root.getElementById("startBtn");
      const retryBtn = root.getElementById("retryBtn");
      const liveScore = root.getElementById("liveScore");
      const finalScoreEl = root.getElementById("finalScore");
      const bestScoreEl = root.getElementById("bestScore");
      const medalEl = root.getElementById("medal");
      const soundBtn = root.getElementById("sound");
      soundBtn.textContent = soundOn ? "🔊" : "🔇";

      const show = (el) => { el.classList.remove("gone"); requestAnimationFrame(() => el.classList.remove("hidden")); };
      const hide = (el) => { el.classList.add("hidden"); setTimeout(() => el.classList.add("gone"), 260); };

      function startGame() {
        audioCtx();
        score = 0;
        bird.x = W * 0.30; bird.y = H * 0.45; bird.vy = 0; bird.rot = 0;
        resetPipes(); particles = [];
        liveScore.textContent = "0";
        state = STATE.PLAYING;
        hide(startPanel); hide(overPanel);
        liveScore.classList.add("show");
        flap();
        self.dispatchEvent(new CustomEvent("flappy-start", { bubbles: true, composed: true }));
      }
      self._startGame = startGame;

      function gameOver() {
        state = STATE.OVER;
        sfx.hit(); sfx.die();
        burst(bird.x, bird.y, "#ffcf3f", 22);
        liveScore.classList.remove("show");
        if (score > best) { best = score; store.set("flappyBest", best); }
        finalScoreEl.textContent = score; bestScoreEl.textContent = best;
        medalEl.textContent = score >= 40 ? "🏆" : score >= 20 ? "🥇" : score >= 10 ? "🥈" : score >= 5 ? "🥉" : "🍂";
        setTimeout(() => show(overPanel), 550);
        self.dispatchEvent(new CustomEvent("flappy-gameover", { detail: { score, best }, bubbles: true, composed: true }));
      }

      function flap() {
        if (state !== STATE.PLAYING) return;
        bird.vy = FLAP_V; bird.wing = 1; sfx.flap();
      }

      function onInput(e) {
        if (e && e.type === "keydown") {
          if (e.repeat) return;
          if (e.code !== "Space" && e.code !== "ArrowUp" && e.code !== "KeyW") return;
          e.preventDefault();
        }
        if (state === STATE.PLAYING) flap();
        else if (state === STATE.READY) startGame();
        else if (state === STATE.OVER) { if (overPanel.classList.contains("gone")) return; startGame(); }
      }

      // Listeners. Keyboard is window-level but only acts while this game is active.
      self._onKey = (e) => { if (self._active) onInput(e); };
      window.addEventListener("keydown", self._onKey);
      canvas.addEventListener("mousedown", (e) => { e.preventDefault(); onInput(e); });
      canvas.addEventListener("touchstart", (e) => { e.preventDefault(); onInput(e); }, { passive: false });
      startBtn.addEventListener("click", (e) => { e.stopPropagation(); startGame(); });
      retryBtn.addEventListener("click", (e) => { e.stopPropagation(); startGame(); });
      soundBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        soundOn = !soundOn; store.set("flappySound", soundOn ? "1" : "0");
        soundBtn.textContent = soundOn ? "🔊" : "🔇";
        if (soundOn) tone(660, 0.08, "square", 0.12);
      });

      function circleRectHit(cx, cy, r, rx, ry, rw, rh) {
        const nx = Math.max(rx, Math.min(cx, rx + rw)), ny = Math.max(ry, Math.min(cy, ry + rh));
        const dx = cx - nx, dy = cy - ny;
        return dx * dx + dy * dy < r * r;
      }

      function update(dt) {
        for (const c of clouds) {
          c.x -= SPEED * 0.25 * c.s * dt;
          if (c.x < -60) { c.x = W + 60; c.y = 40 + Math.random() * (FLOOR_Y - 160); }
        }
        bird.wing = Math.max(0, bird.wing - dt * 6);

        if (state === STATE.PLAYING) {
          groundX = (groundX - SPEED * dt) % 24;
          bird.vy = Math.min(bird.vy + GRAVITY * dt, MAX_FALL);
          bird.y += bird.vy * dt;
          const target = bird.vy < 0 ? -0.5 : Math.min(bird.vy / 500, 1.4);
          bird.rot += (target - bird.rot) * Math.min(1, dt * 10);

          for (const p of pipes) {
            p.x -= SPEED * dt;
            if (!p.passed && p.x + PIPE_W < bird.x - BIRD_R) {
              p.passed = true; score++; liveScore.textContent = score;
              burst(bird.x + 8, bird.y, "#fff", 6); sfx.score();
              self.dispatchEvent(new CustomEvent("flappy-score", { detail: { score }, bubbles: true, composed: true }));
            }
          }
          // Spawn relative to the rightmost pipe → spacing is always exact.
          if (!pipes.length) spawnPipe(W);
          else { const rx = pipes[pipes.length - 1].x; if (rx <= W - PIPE_SPACING) spawnPipe(rx + PIPE_SPACING); }
          pipes = pipes.filter(p => p.x + PIPE_W > -10);

          let dead = false;
          if (bird.y + BIRD_R >= FLOOR_Y) { bird.y = FLOOR_Y - BIRD_R; dead = true; }
          if (bird.y - BIRD_R <= 0) { bird.y = BIRD_R; bird.vy = 0; }
          for (const p of pipes) {
            if (circleRectHit(bird.x, bird.y, BIRD_R, p.x, 0, PIPE_W, p.top) ||
                circleRectHit(bird.x, bird.y, BIRD_R, p.x, p.top + GAP, PIPE_W, FLOOR_Y - (p.top + GAP))) {
              dead = true; break;
            }
          }
          if (dead) gameOver();
        } else if (state === STATE.READY) {
          bird.y = H * 0.45 + Math.sin(performance.now() / 300) * 8;
          bird.rot = Math.sin(performance.now() / 300) * 0.15;
        } else if (state === STATE.OVER) {
          if (bird.y + BIRD_R < FLOOR_Y) {
            bird.vy = Math.min(bird.vy + GRAVITY * dt, MAX_FALL);
            bird.y += bird.vy * dt;
            bird.rot = Math.min(bird.rot + dt * 4, Math.PI / 2);
            if (bird.y + BIRD_R > FLOOR_Y) bird.y = FLOOR_Y - BIRD_R;
          }
        }

        for (const pt of particles) { pt.vy += 480 * dt; pt.x += pt.vx * dt; pt.y += pt.vy * dt; pt.life -= dt; }
        particles = particles.filter(p => p.life > 0);
      }

      // ---- Drawing ----------------------------------------------------------
      function drawCloud(x, y, s) {
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
        ctx.beginPath();
        ctx.arc(0, 0, 18, 0, Math.PI * 2); ctx.arc(20, 6, 14, 0, Math.PI * 2);
        ctx.arc(-20, 6, 15, 0, Math.PI * 2); ctx.arc(0, 10, 22, 0, Math.PI * 2);
        ctx.fill(); ctx.restore();
      }
      function drawBackground() {
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "#4ec0ca"); g.addColorStop(0.6, "#8fd9de"); g.addColorStop(1, "#cdeef0");
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.save();
        const sun = ctx.createRadialGradient(W * 0.78, 90, 10, W * 0.78, 90, 130);
        sun.addColorStop(0, "rgba(255,247,210,0.9)"); sun.addColorStop(1, "rgba(255,247,210,0)");
        ctx.fillStyle = sun; ctx.fillRect(0, 0, W, 280); ctx.restore();
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        for (const c of clouds) drawCloud(c.x, c.y, c.scale);
        ctx.fillStyle = "#79c47f"; ctx.beginPath(); ctx.moveTo(0, FLOOR_Y);
        for (let x = 0; x <= W; x += 70) ctx.quadraticCurveTo(x + 35, FLOOR_Y - 55, x + 70, FLOOR_Y);
        ctx.lineTo(W, FLOOR_Y); ctx.lineTo(0, FLOOR_Y); ctx.closePath(); ctx.fill();
      }
      function drawPipe(p) {
        const lipH = 26, lipOver = 5;
        const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
        grad.addColorStop(0, "#5aa83a"); grad.addColorStop(0.35, "#7ed957"); grad.addColorStop(0.5, "#9fe87a");
        grad.addColorStop(0.7, "#7ed957"); grad.addColorStop(1, "#4e9531");
        ctx.fillStyle = grad;
        ctx.fillRect(p.x, 0, PIPE_W, p.top - lipH);
        ctx.fillRect(p.x - lipOver, p.top - lipH, PIPE_W + lipOver * 2, lipH);
        const by = p.top + GAP;
        ctx.fillRect(p.x, by + lipH, PIPE_W, FLOOR_Y - (by + lipH));
        ctx.fillRect(p.x - lipOver, by, PIPE_W + lipOver * 2, lipH);
        ctx.strokeStyle = "rgba(40,90,30,.55)"; ctx.lineWidth = 2;
        ctx.strokeRect(p.x, 0, PIPE_W, p.top - lipH);
        ctx.strokeRect(p.x - lipOver, p.top - lipH, PIPE_W + lipOver * 2, lipH);
        ctx.strokeRect(p.x, by + lipH, PIPE_W, FLOOR_Y - (by + lipH));
        ctx.strokeRect(p.x - lipOver, by, PIPE_W + lipOver * 2, lipH);
        ctx.fillStyle = "rgba(255,255,255,.25)";
        ctx.fillRect(p.x + 6, 0, 5, p.top - lipH);
        ctx.fillRect(p.x + 6, by + lipH, 5, FLOOR_Y - (by + lipH));
      }
      function drawGround() {
        ctx.fillStyle = "#ded895"; ctx.fillRect(0, FLOOR_Y, W, GROUND_H);
        ctx.fillStyle = "#7ed957"; ctx.fillRect(0, FLOOR_Y, W, 16);
        ctx.fillStyle = "#5aa83a"; ctx.fillRect(0, FLOOR_Y + 14, W, 4);
        ctx.fillStyle = "rgba(0,0,0,.08)";
        for (let x = groundX; x < W; x += 24) {
          ctx.beginPath();
          ctx.moveTo(x, FLOOR_Y + 22); ctx.lineTo(x + 12, FLOOR_Y + 22);
          ctx.lineTo(x + 6, FLOOR_Y + GROUND_H); ctx.lineTo(x - 6, FLOOR_Y + GROUND_H);
          ctx.closePath(); ctx.fill();
        }
      }
      function drawBird() {
        ctx.save(); ctx.translate(bird.x, bird.y); ctx.rotate(bird.rot);
        const bg = ctx.createLinearGradient(0, -BIRD_R, 0, BIRD_R);
        bg.addColorStop(0, "#ffe16b"); bg.addColorStop(1, "#fbb434");
        ctx.fillStyle = bg; ctx.beginPath(); ctx.ellipse(0, 0, BIRD_R + 3, BIRD_R, 0, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = "#c9851a"; ctx.lineWidth = 2; ctx.stroke();
        ctx.fillStyle = "#fff4d0"; ctx.beginPath(); ctx.ellipse(2, 6, 9, 6, 0, 0, Math.PI * 2); ctx.fill();
        const wingUp = Math.sin(bird.wing * Math.PI);
        ctx.fillStyle = "#fff4d0"; ctx.strokeStyle = "#c9851a"; ctx.lineWidth = 1.5;
        ctx.save(); ctx.translate(-3, 2); ctx.rotate(-0.5 - wingUp * 1.1);
        ctx.beginPath(); ctx.ellipse(0, 0, 10, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.stroke(); ctx.restore();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(9, -6, 6, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#222"; ctx.beginPath(); ctx.arc(11, -6, 3, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(12, -7, 1, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#ff8a3c"; ctx.beginPath();
        ctx.moveTo(15, -2); ctx.lineTo(27, 1); ctx.lineTo(15, 6); ctx.closePath(); ctx.fill();
        ctx.strokeStyle = "#d96a1f"; ctx.stroke();
        ctx.restore();
      }
      function drawParticles() {
        for (const p of particles) {
          ctx.globalAlpha = Math.max(0, p.life / p.max); ctx.fillStyle = p.color;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
        ctx.globalAlpha = 1;
      }
      function render() {
        drawBackground();
        for (const p of pipes) drawPipe(p);
        drawGround(); drawParticles(); drawBird();
      }

      this._last = performance.now();
      this._loop = (now) => {
        if (!this._active) return;
        this._raf = requestAnimationFrame(this._loop); // schedule first so a bad frame can't freeze it
        let dt = (now - this._last) / 1000; this._last = now;
        if (dt > 0.05) dt = 0.05;
        try { update(dt); render(); } catch (err) { console.error("[flappy]", err); }
      };

      initClouds(); resetPipes();
      bestScoreEl.textContent = best;
    }
  }

  // ===========================================================================
  // <flappy-waiting-overlay> — full-screen "while you wait" modal
  // ===========================================================================
  const OVERLAY_CSS = `
    :host { position:fixed; inset:0; z-index:2147483000; display:block; }
    .backdrop {
      position:absolute; inset:0; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:14px; padding:20px;
      background:rgba(10,20,24,.62); backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
      opacity:0; transition:opacity .25s ease;
    }
    :host(.in) .backdrop { opacity:1; }
    .title {
      color:#fff; font-family:"Trebuchet MS","Segoe UI",system-ui,sans-serif;
      font-size:clamp(16px,4vw,22px); font-weight:700; letter-spacing:.3px;
      text-shadow:0 2px 8px rgba(0,0,0,.5); text-align:center;
    }
    .stage { width:min(420px,92vw); height:min(640px,72vh); }
    .close {
      font-family:inherit; font-weight:700; font-size:14px; color:#fff;
      background:rgba(255,255,255,.14); border:1px solid rgba(255,255,255,.3);
      border-radius:999px; padding:8px 20px; cursor:pointer; transition:background .15s ease;
    }
    .close:hover { background:rgba(255,255,255,.28); }
    .hint { color:rgba(255,255,255,.7); font:500 12px system-ui; }
  `;

  class FlappyWaitingOverlay extends HTMLElement {
    constructor() {
      super();
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `
        <style>${OVERLAY_CSS}</style>
        <div class="backdrop" part="backdrop">
          <div class="title" id="title">While you wait…</div>
          <div class="stage"><flappy-waiting-game id="game"></flappy-waiting-game></div>
          <button class="close" id="close">Close</button>
          <div class="hint">Esc or click outside to close</div>
        </div>`;
      this._game = r.getElementById("game");
      this._backdrop = r.querySelector(".backdrop");
      r.getElementById("close").addEventListener("click", () => this.close());
      this._backdrop.addEventListener("mousedown", (e) => { if (e.target === this._backdrop) this.close(); });
      this._onEsc = (e) => { if (e.key === "Escape") this.close(); };
    }
    connectedCallback() {
      const t = this.getAttribute("title-text");
      if (t) this.shadowRoot.getElementById("title").textContent = t;
      window.addEventListener("keydown", this._onEsc);
      requestAnimationFrame(() => this.classList.add("in")); // fade in
    }
    disconnectedCallback() { window.removeEventListener("keydown", this._onEsc); }
    close() {
      if (this._closing) return; this._closing = true;
      this._game.pause();
      this.classList.remove("in");
      this.dispatchEvent(new CustomEvent("close", { bubbles: true }));
      setTimeout(() => this.remove(), 260);
    }
  }

  customElements.define("flappy-waiting-game", FlappyWaitingGame);
  customElements.define("flappy-waiting-overlay", FlappyWaitingOverlay);

  // ===========================================================================
  // Convenience API
  // ===========================================================================
  const FlappyWaiting = {
    /** Open the game as a modal overlay. Returns { close, el }. */
    open(opts = {}) {
      const overlay = document.createElement("flappy-waiting-overlay");
      if (opts.title) overlay.setAttribute("title-text", opts.title);
      if (typeof opts.onClose === "function") overlay.addEventListener("close", opts.onClose, { once: true });
      (opts.mount || document.body).appendChild(overlay);
      return { close: () => overlay.close(), el: overlay };
    },
    /** Embed the game inline inside a container. Returns the <flappy-waiting-game> element. */
    embed(container, opts = {}) {
      const g = document.createElement("flappy-waiting-game");
      container.appendChild(g);
      return g;
    },
  };

  window.FlappyWaiting = FlappyWaiting;
})();
