/* ════════════════════════════════════════════════════════════════════
   Συμπόσιον — PlayerManager.js
   Owns the players array + currentPlayerIndex, builds the token sprites,
   and animates movement tile-to-tile with eased linear interpolation
   (a little parabolic "hop" on each step). Pure mechanics — it asks the
   BoardGenerator for tile coordinates and never touches game rules.
   ════════════════════════════════════════════════════════════════════ */
(function (root) {

  class PlayerManager {
    constructor(config, boardGen) {
      this.config = config;
      this.boardGen = boardGen;
      this.players = [];
      this.currentPlayerIndex = 0;
      this.sprites = {};
      this.total = config.tiles.length;
      this.stepDuration = 200;
    }

    initPlayers(playersData) {
      const tk = this.config.tokens;
      this.players = playersData.map((p, idx) => {
        const token = tk[p.tokenIndex != null ? p.tokenIndex : idx % tk.length];
        return {
          id: p.id || 'p' + (idx + 1),
          name: p.name || token.god,
          tokenIndex: p.tokenIndex != null ? p.tokenIndex : idx % tk.length,
          animal: token.animal,
          god: token.god,
          color: token.color,
          position: 0,
          coins: this.config.rules.startCoins,
          score: 0,
          laps: 0,
          streak: 0,
          bestStreak: 0,
          subjects: {},
          inventory: [],
          skipTurns: 0,
          jailed: false,
          timePenalty: 0,
        };
      });
      this.currentPlayerIndex = 0;
    }

    loadPlayers(players, currentPlayerIndex) {
      this.players = players;
      this.currentPlayerIndex = currentPlayerIndex || 0;
    }

    currentPlayer() { return this.players[this.currentPlayerIndex]; }

    _slotOffset(player) {
      const idx = this.players.indexOf(player);
      const n = this.players.length;
      const tileW = (this.boardGen.tileEls[0] || {}).offsetWidth || 80;
      const r = tileW * 0.20;
      const ang = (-Math.PI / 2) + (idx / Math.max(1, n)) * Math.PI * 2;
      return { x: Math.cos(ang) * r, y: Math.sin(ang) * r };
    }

    createTokens() {
      const layer = this.boardGen.tokenLayer;
      layer.innerHTML = '';
      this.sprites = {};
      this.players.forEach((p) => {
        const el = document.createElement('div');
        el.className = 'token';
        el.dataset.player = p.id;
        el.style.setProperty('--tok', p.color);
        el.innerHTML = `<div class="token-coin">${root.symIcon(p.animal)}</div>`;
        layer.appendChild(el);
        this.sprites[p.id] = el;
        this._place(p);
      });
      this.markCurrent();
    }

    _place(p) {
      const c = this.boardGen.getTileCenter(p.position);
      const off = this._slotOffset(p);
      const el = this.sprites[p.id];
      el.style.left = (c.x + off.x) + 'px';
      el.style.top = (c.y + off.y) + 'px';
    }

    relayout() { this.players.forEach((p) => this._place(p)); }

    markCurrent() {
      this.players.forEach((p) => {
        const el = this.sprites[p.id];
        if (el) el.classList.toggle('token--active', p === this.currentPlayer());
      });
    }

    async moveBy(player, steps) {
      const dir = steps >= 0 ? 1 : -1;
      let passedStart = false;
      let clamped = false;
      const n = Math.abs(steps);
      for (let s = 0; s < n; s++) {
        const from = player.position;
        if (dir < 0 && from === 0) { clamped = true; break; }
        const to = (from + dir + this.total) % this.total;
        if (dir > 0 && to === 0) passedStart = true;
        await this._animateStep(player, from, to);
        player.position = to;
        if (dir < 0 && to === 0) { clamped = true; break; }
      }
      return { passedStart, landedOn: player.position, clamped };
    }

    async moveTo(player, index) {
      const from = player.position;
      await this._animateStep(player, from, index, true);
      player.position = index;
      return { landedOn: index };
    }

    _animateStep(player, fromI, toI, isJump) {
      return new Promise((resolve) => {
        const sprite = this.sprites[player.id];
        const a = this.boardGen.getTileCenter(fromI);
        const b = this.boardGen.getTileCenter(toI);
        const off = this._slotOffset(player);
        const dur = (isJump ? this.stepDuration * 2.2 : this.stepDuration);
        const t0 = performance.now();
        let done = false;
        const settle = () => {
          if (done) return; done = true;
          sprite.style.left = (b.x + off.x) + 'px';
          sprite.style.top = (b.y + off.y) + 'px';
          sprite.classList.remove('token--hop');
          resolve();
        };
        const fb = setTimeout(settle, dur + 400);
        const tick = (now) => {
          if (done) return;
          let t = Math.min(1, (now - t0) / dur);
          const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          const x = a.x + (b.x - a.x) * e + off.x;
          const y = a.y + (b.y - a.y) * e + off.y;
          const hop = Math.sin(Math.PI * t) * (isJump ? 26 : 16);
          sprite.style.left = x + 'px';
          sprite.style.top = (y - hop) + 'px';
          sprite.classList.toggle('token--hop', t < 1);
          if (t < 1) requestAnimationFrame(tick);
          else { clearTimeout(fb); settle(); }
        };
        requestAnimationFrame(tick);
      });
    }

    advanceTurn() {
      const n = this.players.length;
      for (let k = 0; k < n; k++) {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % n;
        const p = this.currentPlayer();
        if (p.skipTurns > 0) {
          p.skipTurns--;
          if (p.skipTurns === 0) p.jailed = false;
          continue;
        }
        break;
      }
      this.markCurrent();
      return this.currentPlayer();
    }
  }

  root.PlayerManager = PlayerManager;
})(window);
