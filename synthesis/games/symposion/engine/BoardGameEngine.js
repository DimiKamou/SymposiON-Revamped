/* ════════════════════════════════════════════════════════════════════
   Συμπόσιον — BoardGameEngine.js
   The orchestrator. Owns the config + the three sub-modules
   (BoardGenerator · PlayerManager · TurnEngine) and exposes the public
   API:  init() · rollDice() · handleLanding() · serializeGame().

   It is UI-agnostic: the host page wires callbacks via engine.hooks.
   Every hook may return a Promise; the engine awaits it, so a dice-roll
   animation or a quiz modal naturally pauses the turn.
   ════════════════════════════════════════════════════════════════════ */
(function (root) {

  const SAVE_KEY = 'symposion.save.v1';

  class BoardGameEngine {
    constructor() {
      this.config = null;
      this.boardGen = null;
      this.pm = null;
      this.fsm = null;
      this.questionBank = root.QUESTION_BANK || {};
      this.rng = Math.random;
      this.lastRoll = null;
      this.extraRoll = false;
      this.finished = false;
      this.winner = null;
      this.theme = 'theme-hearth';
      this.hooks = {};
    }

    init(playersData, boardConfig, mount, winConfig) {
      this.config = boardConfig || root.BOARD_CONFIG;
      this.boardGen = new root.BoardGenerator(this.config, mount);
      this.boardGen.render();
      this.pm = new root.PlayerManager(this.config, this.boardGen);
      this.fsm = new root.TurnEngine();
      this.fsm.on('change', (e) => this.hooks.onState && this.hooks.onState(e.to, e.from));

      this._applyWinConfig(winConfig);
      this.pm.initPlayers(playersData);
      this.pm.createTokens();
      this.finished = false;
      this.winner = null;
      this.lastRoll = null;
      this.extraRoll = false;
      this.suddenDeath = false;
      this._turnsSinceEval = 0;
      this._announced = {};
      this.fsm.reset();
      this._update();
      this.log(`Ἡ ἀγωνία ἀρχίζει — ${this.pm.currentPlayer().name} ξεκινᾶ.`, 'system');
      this.log(`Σκοπός: ${this._winGoalText()}.`, 'turn');
      this.hooks.onTurn && this.hooks.onTurn(this.pm.currentPlayer());
      return this;
    }

    _applyWinConfig(winConfig) {
      const wm = this.config.winModes || {};
      this.winMode = (winConfig && winConfig.mode) || this.config.rules.winMode || 'laurels';
      if (!wm[this.winMode]) this.winMode = 'laurels';
      this.winTarget = (winConfig && winConfig.target) ||
        (wm[this.winMode] && wm[this.winMode].targets.normal) || this.config.rules.winScore;
    }
    _winGoalText() {
      const t = this.winTarget;
      switch (this.winMode) {
        case 'wealth':   return `ὁ πρῶτος μὲ ${t} δραχμές`;
        case 'marathon': return `ὁ πρῶτος ποὺ ὁλοκληρώνει ${t} γύρους`;
        case 'polymath': return `ὁ πρῶτος ποὺ θὰ κατακτήσει κάθε μάθημα`;
        case 'streak':   return `ὁ πρῶτος μὲ σερὶ ${t} σωστῶν ἀπαντήσεων`;
        case 'glory':    return `ὁ πρῶτος μὲ ${t} δόξα (δάφνες×100 + δραχμές)`;
        default:         return `ὁ πρῶτος μὲ ${t} δάφνες`;
      }
    }
    _progressOf(player) {
      switch (this.winMode) {
        case 'wealth':   return { cur: player.coins, target: this.winTarget };
        case 'marathon': return { cur: player.laps || 0, target: this.winTarget };
        case 'streak':   return { cur: player.streak || 0, target: this.winTarget };
        case 'glory':    return { cur: (player.score * 100) + player.coins, target: this.winTarget };
        case 'polymath': {
          const ids = Object.keys(this.config.subjects);
          const mastered = ids.filter((id) => ((player.subjects && player.subjects[id]) || 0) >= this.winTarget).length;
          return { cur: mastered, target: ids.length };
        }
        default:         return { cur: player.score, target: this.winTarget };
      }
    }

    _suddenDeathBump(maxValue) {
      if (this.winMode === 'polymath') { this.winTarget += 1; }
      else { this.winTarget = maxValue + 1; }
    }

    _checkWin(player) {
      if (this.finished) return;
      const { cur, target } = this._progressOf(player);
      if (cur >= target) {
        this._announced = this._announced || {};
        const key = player.id + '@' + this.winTarget;
        if (!this._announced[key]) {
          this._announced[key] = true;
          this.log(`${player.name} ἔφτασε τὸν στόχο (${target})! Ὁ γῦρος ὁλοκληρώνεται…`, 'turn');
        }
      }
    }

    _evaluateRound() {
      if (this.finished) return;
      const players = this.pm.players;
      const prog = players.map((p) => ({ p, v: this._progressOf(p).cur }));
      const target = this._progressOf(players[0]).target;
      const eligible = prog.filter((x) => x.v >= target);
      if (!eligible.length) return;
      const max = Math.max.apply(null, prog.map((x) => x.v));
      const top = prog.filter((x) => x.v === max && x.v >= target);
      if (top.length === 1) { this._declareWinner(top[0].p); return; }
      this._announced = {};
      this._suddenDeathBump(max);
      this.suddenDeath = true;
      const names = top.map((x) => x.p.name).join(' · ');
      const goal = this.winMode === 'polymath'
        ? `κάθε μάθημα ×${this.winTarget}`
        : `${this.winTarget} ${(this.config.winModes[this.winMode] || {}).unit || ''}`;
      this.log(`⚔ Ἰσοπαλία στὸ ${max} — ${names}! Θάνατος αἰφνίδιος: νέος στόχος ${goal}.`, 'win');
      if (this.hooks.onSuddenDeath) this.hooks.onSuddenDeath(this.winTarget, top.map((x) => x.p), this.winMode, max);
    }

    async rollDice() {
      if (this.finished || !this.fsm.is('IDLE')) return null;
      const player = this.pm.currentPlayer();
      this.fsm.go('ROLLING');
      const value = 1 + Math.floor(this.rng() * 6);
      this.lastRoll = value;
      this.log(`${player.name} ἔρριψε <b>${value}</b>.`, 'roll');
      if (this.hooks.onDice) await this.hooks.onDice(value, player);

      this.fsm.go('MOVING');
      const res = await this.pm.moveBy(player, value);
      if (res.passedStart) this._awardLap(player);

      const tile = this.config.tiles[player.position];
      this.boardGen.highlightTile(player.position);
      await this.handleLanding(tile);
      return value;
    }

    async handleLanding(tile, depth) {
      depth = depth || 0;
      const player = this.pm.currentPlayer();
      if (this.hooks.onLand) this.hooks.onLand(tile, player);

      switch (tile.type) {
        case 'subject':
          await this._runQuestion(tile.subject, player);
          break;
        case 'event':
          await this._runEvent(player, depth);
          break;
        case 'jail':
          this._sendToJail(player);
          break;
        case 'corner':
          if (tile.sub === 'ORACLE') {
            this.log(`Τὸ Μαντεῖον χαρίζει χρησμό — ${player.name} ξαναρίχνει τὸ ζάρι!`, 'event');
            this.extraRoll = true;
          } else if (tile.sub === 'BONUS') {
            this.log(`Οἱ Μοῦσες εὐνοοῦν τὸν ${player.name} — +3 βήματα.`, 'event');
            await this.pm.moveBy(player, 3);
            if (depth < 2) await this.handleLanding(this.config.tiles[player.position], depth + 1);
          }
          break;
        case 'start':
          this.log(`${player.name} ἀναπαύεται στὴν Ἀγορά.`, 'system');
          break;
      }
      if (depth === 0) this._finishTurn();
    }

    serializeGame() {
      return {
        version: 1,
        savedAt: Date.now(),
        theme: this.theme,
        state: this.fsm.state,
        currentPlayerIndex: this.pm.currentPlayerIndex,
        players: JSON.parse(JSON.stringify(this.pm.players)),
        lastRoll: this.lastRoll,
        extraRoll: this.extraRoll,
        winMode: this.winMode,
        winTarget: this.winTarget,
        suddenDeath: this.suddenDeath,
        finished: this.finished,
        winner: this.winner ? this.winner.id : null,
      };
    }

    deserialize(snap, mount) {
      this.config = root.BOARD_CONFIG;
      this.boardGen = new root.BoardGenerator(this.config, mount);
      this.boardGen.render();
      this.pm = new root.PlayerManager(this.config, this.boardGen);
      this.fsm = new root.TurnEngine();
      this.fsm.on('change', (e) => this.hooks.onState && this.hooks.onState(e.to, e.from));

      this.pm.loadPlayers(snap.players, snap.currentPlayerIndex);
      this.pm.createTokens();
      this._applyWinConfig({ mode: snap.winMode, target: snap.winTarget });
      this.theme = snap.theme || 'theme-hearth';
      this.lastRoll = snap.lastRoll;
      this.extraRoll = !!snap.extraRoll;
      this.suddenDeath = !!snap.suddenDeath;
      this._turnsSinceEval = 0;
      this._announced = {};
      this.finished = !!snap.finished;
      this.winner = snap.winner ? this.pm.players.find((p) => p.id === snap.winner) : null;
      this.fsm.state = 'IDLE';
      this._update();
      this.log('Ἡ παρτίδα φορτώθηκε ἀπ’ τὴ μνήμη.', 'system');
      this.hooks.onTurn && this.hooks.onTurn(this.pm.currentPlayer());
      return this;
    }

    save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(this.serializeGame())); } catch (e) {} }
    static loadSnapshot() { try { return JSON.parse(localStorage.getItem(SAVE_KEY)); } catch (e) { return null; } }
    static hasSave() { return !!localStorage.getItem(SAVE_KEY); }
    static clearSave() { try { localStorage.removeItem(SAVE_KEY); } catch (e) {} }

    _subjectMeta(id) {
      return this.config.subjects[id] || (id === 'riddles' ? this.config.riddleMeta : null) ||
        { id, label: id, en: id, color: 'var(--sym-gold)', glyph: '?', muse: '' };
    }

    _pickQuestion(poolId, bank) {
      if (!this._recent) this._recent = {};
      const recent = this._recent[poolId] || (this._recent[poolId] = []);
      const cooldown = Math.min(bank.length - 1, this.config.rules.questionCooldown || 12);
      const fresh = [];
      for (let i = 0; i < bank.length; i++) if (recent.indexOf(i) === -1) fresh.push(i);
      const choices = fresh.length ? fresh : bank.map((_, i) => i);
      const idx = choices[Math.floor(this.rng() * choices.length)];
      recent.push(idx);
      while (recent.length > cooldown) recent.shift();
      return bank[idx];
    }

    async _runQuestion(subjectId, player) {
      const bank = this.questionBank[subjectId] || [];
      if (!bank.length || !this.hooks.onQuestion) return;
      this.fsm.go('QUESTION_PHASE');
      const subject = this._subjectMeta(subjectId);
      const q = this._pickQuestion(subjectId, bank);
      const choice = await this.hooks.onQuestion(q, subject, player);
      player.timePenalty = 0;
      const correct = choice === q.ans;
      if (correct) {
        player.score++;
        player.coins += 20;
        player.subjects[subjectId] = (player.subjects[subjectId] || 0) + 1;
        player.streak = (player.streak || 0) + 1;
        if (player.streak > (player.bestStreak || 0)) player.bestStreak = player.streak;
        const extra = this.winMode === 'streak' ? ` (σερὶ ${player.streak})` : '';
        this.log(`${player.name} ἀπάντησε σωστά στὴ ${subject.label}! +1 δάφνη, +20δρ.${extra}`, 'correct');
      } else if (choice === -1) {
        player.streak = 0;
        const back = this.config.rules.timeoutBack || 0;
        if (back > 0) {
          this.log(`${player.name} δὲν ἀπάντησε ἐγκαίρως στὴ ${subject.label} — ${back} βῆμα πίσω!`, 'wrong');
          await this.pm.moveBy(player, -back);
        } else {
          this.log(`${player.name} δὲν ἀπάντησε στὴ ${subject.label}.`, 'wrong');
        }
      } else {
        player.streak = 0;
        const lost = this.config.rules.wrongCoins || 0;
        const back = this.config.rules.wrongBack || 0;
        player.coins = Math.max(0, player.coins - lost);
        const parts = [];
        if (lost) parts.push(`−${lost}δρ.`);
        if (back) parts.push(`${back} βήματα πίσω`);
        this.log(`${player.name} ἔσφαλε στὴ ${subject.label}. ${parts.join(' · ')}`, 'wrong');
        if (back > 0) await this.pm.moveBy(player, -back);
      }
      if (this.hooks.onQuestionResult) this.hooks.onQuestionResult(correct, q, player);
      this._checkWin(player);
      if (this.fsm.is('QUESTION_PHASE')) this.fsm.go('TURN_END', { silent: true });
    }

    async _runEvent(player, depth) {
      const deck = this.config.events;
      const choices = this._drawN(deck, 3);
      let ev;
      if (this.hooks.onChooseCard) ev = await this.hooks.onChooseCard(choices, player);
      else if (this.hooks.onEvent) { ev = choices[Math.floor(this.rng() * choices.length)]; await this.hooks.onEvent(ev, player); }
      if (!ev) ev = choices[0];
      player.inventory.push(ev.id);
      this.log(`<b>${ev.title}</b> — ${ev.text}`, ev.tone === 'strike' ? 'strike' : 'event');
      const fx = ev.effect;
      switch (fx.type) {
        case 'move':
          await this.pm.moveBy(player, fx.value);
          if (depth < 2) await this.handleLanding(this.config.tiles[player.position], depth + 1);
          break;
        case 'reroll':  this.extraRoll = true; break;
        case 'skip':    player.skipTurns += fx.value; break;
        case 'coins':   player.coins = Math.max(0, player.coins + fx.value); break;
        case 'question': {
          const ids = Object.keys(this.questionBank);
          const sid = ids[Math.floor(this.rng() * ids.length)];
          await this._runQuestion(sid, player);
          break;
        }
        case 'riddle': {
          await this._runQuestion('riddles', player);
          break;
        }
        case 'riddle_back': {
          await this._runQuestion('riddles', player);
          break;
        }
        case 'others_move': {
          for (const op of this._opponents(player)) await this.pm.moveBy(op, fx.value);
          break;
        }
        case 'lead_back': {
          const t = this._leader(player);
          if (t) { await this.pm.moveBy(t, fx.value); this.log(`${t.name} ὀπισθοχωρεῖ ${Math.abs(fx.value)} βήματα.`, 'strike'); }
          break;
        }
        case 'steal': {
          const t = this._richest(player);
          if (t) { const amt = Math.min(t.coins, fx.value); t.coins -= amt; player.coins += amt;
            this.log(`${player.name} ἁρπάζει ${amt}δρ. (θῦμα: ${t.name}).`, 'strike'); }
          break;
        }
        case 'other_skip': {
          const t = this._leader(player);
          if (t) { t.skipTurns += fx.value; this.log(`${t.name} ναρκώνεται — χάνει ${fx.value} γύρο.`, 'strike'); }
          break;
        }
        case 'curse_time': {
          const ops = this._opponents(player);
          ops.forEach((op) => { op.timePenalty = Math.max(op.timePenalty || 0, fx.value); });
          if (ops.length) this.log(`Οἱ ἀντίπαλοι θὰ ἔχουν λιγότερο χρόνο στὴν ἑπόμενη ἐρώτησή τους!`, 'strike');
          break;
        }
        case 'steal_laurel': {
          const t = this._leader(player);
          if (t && t.score > 0) { t.score -= fx.value; if (t.score < 0) t.score = 0;
            this.log(`Ἡ Νέμεσις ταπεινώνει τὸν πρωτοπόρο — ${t.name} χάνει δάφνη!`, 'strike'); }
          else this.log(`Ἡ Νέμεσις δὲν βρίσκει δάφνη νὰ πάρει.`, 'event');
          break;
        }
        case 'steal_all': {
          let got = 0;
          for (const op of this._opponents(player)) { const a = Math.min(op.coins, fx.value); op.coins -= a; got += a; }
          player.coins += got;
          this.log(`${player.name} ἁρπάζει συνολικὰ ${got}δρ. ἀπ' τοὺς ἀντιπάλους!`, 'strike');
          break;
        }
        case 'rand_skip': {
          const t = this._randomOpponent(player);
          if (t) { t.skipTurns += fx.value; this.log(`${t.name} πετρώνει — χάνει ${fx.value} γύρο.`, 'strike'); }
          break;
        }
        case 'rand_back': {
          const t = this._randomOpponent(player);
          if (t) { await this.pm.moveBy(t, fx.value); this.log(`${t.name} παρασύρεται ${Math.abs(fx.value)} βήματα πίσω.`, 'strike'); }
          break;
        }
        case 'teleport': {
          const subjects = this.config.subjects;
          let choice = null;
          if (this.hooks.onChooseTeleport) {
            choice = await this.hooks.onChooseTeleport(player, this.pm.players, subjects);
          }
          if (!choice) {
            const ids = Object.keys(subjects);
            choice = { targetId: player.id, subjectId: ids[Math.floor(this.rng() * ids.length)] };
          }
          const target = this.pm.players.find((p) => p.id === choice.targetId) || player;
          const subj = subjects[choice.subjectId];
          const dest = this._nearestSubjectTile(target.position, choice.subjectId);
          const who = target === player ? 'τὸν ἑαυτό του' : target.name;
          this.log(`${player.name} ἀνοίγει Πύλη Ἑρμοῦ → στέλνει ${who} στὴ ${subj.label}!`, target === player ? 'event' : 'strike');
          await this.pm.moveTo(target, dest);
          this.boardGen.highlightTile(dest);
          await this._runQuestion(choice.subjectId, target);
          break;
        }
      }
      this._checkWin(player);
    }

    _nearestSubjectTile(fromPos, subjectId) {
      const total = this.pm.total;
      let best = null, bestDist = Infinity;
      this.config.tiles.forEach((t) => {
        if (t.type === 'subject' && t.subject === subjectId) {
          let d = ((t.i - fromPos) % total + total) % total;
          if (d === 0) d = total;
          if (d < bestDist) { bestDist = d; best = t.i; }
        }
      });
      return best == null ? fromPos : best;
    }

    _drawN(arr, n) {
      const pool = arr.slice();
      const out = [];
      n = Math.min(n, pool.length);
      for (let i = 0; i < n; i++) out.push(pool.splice(Math.floor(this.rng() * pool.length), 1)[0]);
      return out;
    }

    _opponents(player) { return this.pm.players.filter((x) => x !== player); }
    _leader(player) {
      const o = this._opponents(player);
      if (!o.length) return null;
      return o.slice().sort((a, b) => b.score - a.score || b.coins - a.coins)[0];
    }
    _richest(player) {
      const o = this._opponents(player);
      if (!o.length) return null;
      return o.slice().sort((a, b) => b.coins - a.coins)[0];
    }
    _randomOpponent(player) {
      const o = this._opponents(player);
      return o.length ? o[Math.floor(this.rng() * o.length)] : null;
    }

    _sendToJail(player) {
      player.jailed = true;
      player.skipTurns += this.config.rules.jailTurns;
      this.log(`${player.name} ρίχνεται στὸν Τάρταρο — χάνει ${this.config.rules.jailTurns} γύρο.`, 'event');
    }

    _awardLap(player) {
      player.laps = (player.laps || 0) + 1;
      const r = this.config.rules;
      const bonus = r.lapBonus + (player.laps - 1) * (r.lapBonusGrowth || 0);
      player.coins += bonus;
      this.log(`🏛 ${player.name} ὁλοκλήρωσε τὸν ${player.laps}ο γῦρο τῆς Ἀγορᾶς — +${bonus}δρ.!`, 'turn');
      this._checkWin(player);
    }

    _declareWinner(player) {
      this.finished = true;
      this.winner = player;
      this.fsm.go('GAME_OVER');
      this.log(`🏆 ${player.name} στέφεται μὲ τὴ δάφνη τῆς νίκης!`, 'win');
      const quotes = root.SYMPOSION_QUOTES || [];
      const quote = quotes[Math.floor(this.rng() * quotes.length)] || '';
      if (this.hooks.onWin) this.hooks.onWin(player, quote);
    }

    _finishTurn() {
      this._update();
      this.save();
      if (this.finished) return;
      if (!this.fsm.is('TURN_END')) this.fsm.go('TURN_END');

      if (!this.extraRoll) {
        this._turnsSinceEval = (this._turnsSinceEval || 0) + 1;
        if (this._turnsSinceEval >= this.pm.players.length) {
          this._turnsSinceEval = 0;
          this._evaluateRound();
        }
      }
      if (this.finished) return;

      this.fsm.go('IDLE');
      if (this.extraRoll) {
        this.extraRoll = false;
        this.hooks.onTurn && this.hooks.onTurn(this.pm.currentPlayer(), true);
      } else {
        const next = this.pm.advanceTurn();
        this.log(`Σειρά · ${next.name}.`, 'turn');
        this.hooks.onTurn && this.hooks.onTurn(next, false);
      }
    }

    log(html, kind) { if (this.hooks.onLog) this.hooks.onLog(html, kind || 'info'); }
    _update() { if (this.hooks.onUpdate) this.hooks.onUpdate(this.pm.players, this.pm.currentPlayer()); }

    getScores() {
      return this.pm.players.slice().sort((a, b) => b.score - a.score || b.coins - a.coins);
    }
  }

  root.BoardGameEngine = BoardGameEngine;
})(window);
