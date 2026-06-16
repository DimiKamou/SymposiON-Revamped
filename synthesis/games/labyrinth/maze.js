// ============================================================
//  LABYRINTH · REIMAGINED — maze.js
//  Procedural maze (recursive backtracker) + geometry + BFS.
//  Pure data; no DOM. Exposes window.LabMaze.
// ============================================================
(function () {
  'use strict';

  // walls per cell: {n,e,s,w} true = wall present
  function generate(cols, rows) {
    const cells = [];
    for (let r = 0; r < rows; r++) {
      const row = [];
      for (let c = 0; c < cols; c++) {
        row.push({ n: true, e: true, s: true, w: true, v: false });
      }
      cells.push(row);
    }

    // iterative recursive-backtracker
    const stack = [[0, 0]];
    cells[0][0].v = true;
    let visitedCount = 1;
    const total = cols * rows;

    while (visitedCount < total) {
      const [c, r] = stack[stack.length - 1];
      const nbrs = [];
      if (r > 0        && !cells[r - 1][c].v) nbrs.push([c, r - 1, 'n']);
      if (c < cols - 1 && !cells[r][c + 1].v) nbrs.push([c + 1, r, 'e']);
      if (r < rows - 1 && !cells[r + 1][c].v) nbrs.push([c, r + 1, 's']);
      if (c > 0        && !cells[r][c - 1].v) nbrs.push([c - 1, r, 'w']);

      if (nbrs.length === 0) { stack.pop(); continue; }

      const [nc, nr, dir] = nbrs[(Math.random() * nbrs.length) | 0];
      // knock down wall between current and chosen
      if (dir === 'n') { cells[r][c].n = false; cells[nr][nc].s = false; }
      if (dir === 's') { cells[r][c].s = false; cells[nr][nc].n = false; }
      if (dir === 'e') { cells[r][c].e = false; cells[nr][nc].w = false; }
      if (dir === 'w') { cells[r][c].w = false; cells[nr][nc].e = false; }
      cells[nr][nc].v = true;
      visitedCount++;
      stack.push([nc, nr]);
    }

    // braid: remove a few dead-ends to create loops (more flow, less getting stuck)
    braid(cells, cols, rows, 0.18);

    return { cols, rows, cells };
  }

  // randomly open some dead-ends so corridors loop
  function braid(cells, cols, rows, p) {
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = cells[r][c];
        const walls = (cell.n ? 1 : 0) + (cell.e ? 1 : 0) + (cell.s ? 1 : 0) + (cell.w ? 1 : 0);
        if (walls < 3) continue;            // not a dead-end
        if (Math.random() > p) continue;
        // pick a walled neighbour that exists and open it
        const opts = [];
        if (cell.n && r > 0)        opts.push('n');
        if (cell.e && c < cols - 1) opts.push('e');
        if (cell.s && r < rows - 1) opts.push('s');
        if (cell.w && c > 0)        opts.push('w');
        if (!opts.length) continue;
        const dir = opts[(Math.random() * opts.length) | 0];
        if (dir === 'n') { cell.n = false; cells[r - 1][c].s = false; }
        if (dir === 's') { cell.s = false; cells[r + 1][c].n = false; }
        if (dir === 'e') { cell.e = false; cells[r][c + 1].w = false; }
        if (dir === 'w') { cell.w = false; cells[r][c - 1].e = false; }
      }
    }
  }

  // open neighbouring cells of (c,r). Optional blocked(c,r,nc,nr) masks edges (closed doors).
  function open(maze, c, r, blocked) {
    const out = [];
    const cell = maze.cells[r][c];
    if (!cell.n && !(blocked && blocked(c, r, c, r - 1))) out.push([c, r - 1]);
    if (!cell.s && !(blocked && blocked(c, r, c, r + 1))) out.push([c, r + 1]);
    if (!cell.e && !(blocked && blocked(c, r, c + 1, r))) out.push([c + 1, r]);
    if (!cell.w && !(blocked && blocked(c, r, c - 1, r))) out.push([c - 1, r]);
    return out;
  }

  // BFS shortest path of cells from (sc,sr) to (tc,tr). Returns [[c,r],...] incl. ends, or null.
  function bfsPath(maze, sc, sr, tc, tr, blocked) {
    const { cols, rows } = maze;
    const key = (c, r) => r * cols + c;
    const prev = new Map();
    const seen = new Uint8Array(cols * rows);
    const q = [[sc, sr]];
    seen[key(sc, sr)] = 1;
    while (q.length) {
      const [c, r] = q.shift();
      if (c === tc && r === tr) {
        const path = [[c, r]];
        let k = key(c, r);
        while (prev.has(k)) {
          const [pc, pr] = prev.get(k);
          path.push([pc, pr]);
          k = key(pc, pr);
        }
        return path.reverse();
      }
      for (const [nc, nr] of open(maze, c, r, blocked)) {
        const nk = key(nc, nr);
        if (seen[nk]) continue;
        seen[nk] = 1;
        prev.set(nk, [c, r]);
        q.push([nc, nr]);
      }
    }
    return null;
  }

  // distance map (in cells) from a source, via BFS over open passages
  function distanceFrom(maze, sc, sr, blocked) {
    const { cols, rows } = maze;
    const dist = new Int32Array(cols * rows).fill(-1);
    const key = (c, r) => r * cols + c;
    const q = [[sc, sr]];
    dist[key(sc, sr)] = 0;
    while (q.length) {
      const [c, r] = q.shift();
      const d = dist[key(c, r)];
      for (const [nc, nr] of open(maze, c, r, blocked)) {
        const nk = key(nc, nr);
        if (dist[nk] === -1) { dist[nk] = d + 1; q.push([nc, nr]); }
      }
    }
    return dist;
  }

  // build thin collision rectangles {x,y,w,h} for every wall, in pixel space.
  function wallRects(maze, tile, thick) {
    const { cols, rows } = maze;
    const t = thick;
    const rects = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cell = maze.cells[r][c];
        const x = c * tile, y = r * tile;
        if (cell.n) rects.push({ x: x - t / 2, y: y - t / 2, w: tile + t, h: t });
        if (cell.w) rects.push({ x: x - t / 2, y: y - t / 2, w: t, h: tile + t });
        if (r === rows - 1 && cell.s) rects.push({ x: x - t / 2, y: y + tile - t / 2, w: tile + t, h: t });
        if (c === cols - 1 && cell.e) rects.push({ x: x + tile - t / 2, y: y - t / 2, w: t, h: tile + t });
      }
    }
    return rects;
  }

  window.LabMaze = { generate, open, bfsPath, distanceFrom, wallRects };
})();
