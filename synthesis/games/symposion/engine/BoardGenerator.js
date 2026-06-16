/* ════════════════════════════════════════════════════════════════════
   Συμπόσιον — BoardGenerator.js
   Renders the board layout: an N×N CSS-grid of DOM tiles around a central
   hub. Owns nothing about game state — it is a pure renderer + a geometry
   helper (getTileCenter) used by PlayerManager to place / move sprites.
   ════════════════════════════════════════════════════════════════════ */
(function (root) {

  class BoardGenerator {
    constructor(config, mount) {
      this.config = config;
      this.mount = mount;
      this.N = config.rules.gridSize;
      this.tileEls = {};
      this.boardEl = null;
      this.hubEl = null;
    }

    /* Map a perimeter index → 1-based {row,col} on an N×N grid.
       Winds counter-clockwise from START at the bottom-right corner. */
    gridPos(i) {
      const N = this.N;
      if (i <= 7)  return { r: N, c: N - i };
      if (i <= 13) return { r: N - (i - 7), c: 1 };
      if (i === 14) return { r: 1, c: 1 };
      if (i <= 20) return { r: 1, c: (i - 13) };
      if (i === 21) return { r: 1, c: N };
      return { r: (i - 20), c: N };
    }

    render() {
      const C = this.config;
      const board = document.createElement('div');
      board.className = 'board';
      board.style.setProperty('--n', this.N);
      this.boardEl = board;

      C.tiles.forEach((tile) => {
        const pos = this.gridPos(tile.i);
        const el = this._renderTile(tile);
        el.style.gridRow = pos.r;
        el.style.gridColumn = pos.c;
        el.dataset.edge = this._edgeOf(tile.i);
        board.appendChild(el);
        this.tileEls[tile.i] = el;
      });

      const hub = document.createElement('div');
      hub.className = 'board-hub';
      hub.style.gridRow = `2 / ${this.N}`;
      hub.style.gridColumn = `2 / ${this.N}`;
      this.hubEl = hub;
      board.appendChild(hub);

      const layer = document.createElement('div');
      layer.className = 'token-layer';
      board.appendChild(layer);
      this.tokenLayer = layer;

      this.mount.appendChild(board);
      return board;
    }

    _edgeOf(i) {
      if (i >= 1 && i <= 6)  return 'bottom';
      if (i >= 8 && i <= 13) return 'left';
      if (i >= 15 && i <= 20) return 'top';
      if (i >= 22 && i <= 27) return 'right';
      return 'corner';
    }

    _renderTile(tile) {
      const C = this.config;
      const el = document.createElement('div');
      el.className = `tile tile--${tile.type}`;
      el.dataset.index = tile.i;

      if (tile.type === 'subject') {
        const s = C.subjects[tile.subject];
        el.style.setProperty('--accent', s.color);
        el.dataset.subject = tile.subject;
        el.innerHTML = `
          <div class="tile-band"></div>
          <div class="tile-body">
            <div class="tile-glyph">${s.glyph}</div>
            <div class="tile-name">${s.label}</div>
            <div class="tile-en">${s.en}</div>
          </div>`;
      } else if (tile.type === 'event') {
        el.innerHTML = `
          <div class="tile-body tile-body--event">
            <div class="tile-eventmark">?</div>
            <div class="tile-name">Τύχη</div>
            <div class="tile-en">Fortune</div>
          </div>`;
      } else {
        const ic = tile.icon ? (root.symIcon(tile.icon) || '') : root.symIcon('column');
        el.innerHTML = `
          <div class="corner-inner">
            <div class="corner-icon">${ic}</div>
            <div class="corner-label">${tile.label || ''}</div>
            <div class="corner-sub">${tile.sub || ''}</div>
          </div>`;
      }
      return el;
    }

    getTileCenter(index) {
      const el = this.tileEls[index];
      if (!el) return { x: 0, y: 0 };
      return {
        x: el.offsetLeft + el.offsetWidth / 2,
        y: el.offsetTop + el.offsetHeight / 2,
      };
    }

    highlightTile(index) {
      const el = this.tileEls[index];
      if (!el) return;
      el.classList.remove('tile--landed');
      void el.offsetWidth;
      el.classList.add('tile--landed');
    }
  }

  root.BoardGenerator = BoardGenerator;
})(window);
