/* ════════════════════════════════════════════════════════════════════
   Συμπόσιον — TurnEngine.js
   A tiny finite-state machine for the turn lifecycle. It only knows about
   states and legal transitions + a pub/sub bus; it holds no board data.
   BoardGameEngine drives it: engine.fsm.go('ROLLING'), etc.

     IDLE ─▶ ROLLING ─▶ MOVING ─▶ QUESTION_PHASE ─▶ TURN_END ─▶ IDLE
                              └────────────────────▶ TURN_END
     (any) ─▶ GAME_OVER  (terminal)
   ════════════════════════════════════════════════════════════════════ */
(function (root) {

  const STATES = ['IDLE', 'ROLLING', 'MOVING', 'QUESTION_PHASE', 'TURN_END', 'GAME_OVER'];

  const TRANSITIONS = {
    IDLE:           ['ROLLING', 'GAME_OVER'],
    ROLLING:        ['MOVING', 'GAME_OVER'],
    MOVING:         ['QUESTION_PHASE', 'TURN_END', 'GAME_OVER'],
    QUESTION_PHASE: ['TURN_END', 'MOVING', 'GAME_OVER'],
    TURN_END:       ['IDLE', 'GAME_OVER'],
    GAME_OVER:      [],
  };

  class TurnEngine {
    constructor() {
      this.state = 'IDLE';
      this._listeners = {};
    }

    on(evt, cb) {
      (this._listeners[evt] = this._listeners[evt] || []).push(cb);
      return this;
    }
    _emit(evt, payload) {
      (this._listeners[evt] || []).forEach((cb) => cb(payload));
    }

    can(to) {
      return (TRANSITIONS[this.state] || []).includes(to);
    }

    go(to, payload) {
      if (!STATES.includes(to)) throw new Error('Unknown state: ' + to);
      if (!this.can(to)) {
        console.warn(`[TurnEngine] illegal ${this.state} → ${to}`);
        return false;
      }
      const from = this.state;
      this._emit('leave:' + from, { from, to, payload });
      this.state = to;
      this._emit('enter:' + to, { from, to, payload });
      this._emit('change', { from, to, payload });
      return true;
    }

    is(s) { return this.state === s; }
    reset() { this.state = 'IDLE'; }
  }

  TurnEngine.STATES = STATES;
  root.TurnEngine = TurnEngine;
})(window);
