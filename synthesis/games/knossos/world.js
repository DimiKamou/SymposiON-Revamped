/* ============================================================
   Κνωσός — geometry + procedural Minoan frescoes. 1 u = 1 m.
   Central court x −25…25, z −12.5…12.5. West wing z<0, east z>0.
   ============================================================ */
(function () {
  const A = window.XP_APP;

  /* ---------- fresco painters (flat Minoan style) ---------- */
  function ground(x, w, h, base) {
    x.fillStyle = base; x.fillRect(0, 0, w, h);
    x.fillStyle = 'rgba(255,255,255,0.05)';
    for (let i = 0; i < 40; i++) x.fillRect(Math.random() * w, Math.random() * h, 14, 3);
  }
  function frame(x, w, h) {
    x.fillStyle = '#7c2f1e'; x.fillRect(0, 0, w, 10); x.fillRect(0, h - 10, w, 10);
    x.fillStyle = '#2c3b6e'; x.fillRect(0, 10, w, 6); x.fillRect(0, h - 16, w, 6);
  }
  function minoanFigure(x, cx, cy, s, skin, skirt) {
    x.fillStyle = skin;                                   // profile torso+head
    x.beginPath(); x.ellipse(cx, cy - s * 0.62, s * 0.1, s * 0.13, 0, 0, 7); x.fill();  // head
    x.fillRect(cx - s * 0.05, cy - s * 0.52, s * 0.1, s * 0.26);                        // neck+chest
    x.beginPath(); x.moveTo(cx - s * 0.16, cy - s * 0.28); x.lineTo(cx + s * 0.16, cy - s * 0.28);
    x.lineTo(cx + s * 0.05, cy); x.lineTo(cx - s * 0.05, cy); x.closePath(); x.fill();  // waist
    x.strokeStyle = skin; x.lineWidth = s * 0.05;
    x.beginPath(); x.moveTo(cx, cy - s * 0.42); x.lineTo(cx + s * 0.3, cy - s * 0.55); x.stroke(); // arm
    if (skirt) {
      x.fillStyle = skirt;
      x.beginPath(); x.moveTo(cx - s * 0.05, cy); x.lineTo(cx + s * 0.05, cy);
      x.lineTo(cx + s * 0.2, cy + s * 0.5); x.lineTo(cx - s * 0.2, cy + s * 0.5); x.closePath(); x.fill();
      x.strokeStyle = '#2c3b6e'; x.lineWidth = 2;
      for (let i = 1; i < 4; i++) { x.beginPath(); x.moveTo(cx - s * 0.06 - i * s * 0.035, cy + i * s * 0.12); x.lineTo(cx + s * 0.06 + i * s * 0.035, cy + i * s * 0.12); x.stroke(); }
    } else {
      x.fillStyle = skin;
      x.fillRect(cx - s * 0.06, cy, s * 0.05, s * 0.5);
      x.fillRect(cx + s * 0.01, cy, s * 0.05, s * 0.5);
    }
    x.fillStyle = '#1c1410';                              // hair locks
    x.beginPath(); x.ellipse(cx, cy - s * 0.7, s * 0.11, s * 0.08, 0, Math.PI, 0); x.fill();
    x.fillRect(cx + s * 0.06, cy - s * 0.7, s * 0.03, s * 0.3);
  }
  function bullFresco() {
    const w = 1024, h = 512, c = XP.canvas(w, h), x = c.getContext('2d');
    ground(x, w, h, '#d8c493'); frame(x, w, h);
    x.fillStyle = '#8a5a30';                               // the bull, stretched in flying gallop
    x.beginPath(); x.ellipse(w * 0.5, h * 0.58, 250, 95, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(w * 0.24, h * 0.5, 70, 48, -0.25, 0, 7); x.fill();   // head
    x.strokeStyle = '#8a5a30'; x.lineWidth = 26;
    [[0.3, 0.85, 0.18, 0.95], [0.42, 0.88, 0.34, 0.98], [0.62, 0.88, 0.7, 0.98], [0.74, 0.84, 0.86, 0.92]]
      .forEach(l => { x.beginPath(); x.moveTo(w * l[0], h * l[1] - 60); x.lineTo(w * l[2], h * l[3]); x.stroke(); });
    x.strokeStyle = '#e8dcc0'; x.lineWidth = 10;           // horns
    x.beginPath(); x.moveTo(w * 0.2, h * 0.42); x.quadraticCurveTo(w * 0.12, h * 0.2, w * 0.2, h * 0.14); x.stroke();
    x.fillStyle = '#5c3a1c';                               // dapples
    for (let i = 0; i < 12; i++) { x.beginPath(); x.ellipse(w * (0.35 + Math.random() * 0.3), h * (0.45 + Math.random() * 0.25), 18, 10, 0, 0, 7); x.fill(); }
    minoanFigure(x, w * 0.16, h * 0.55, 150, '#f0e6d6', '#c8b088');   // girl at horns
    minoanFigure(x, w * 0.82, h * 0.6, 150, '#f0e6d6', '#c8b088');    // girl behind
    x.save(); x.translate(w * 0.5, h * 0.22); x.rotate(Math.PI);      // leaper mid-somersault
    minoanFigure(x, 0, 0, 140, '#a4502c', null); x.restore();
    return c;
  }
  function dolphinFresco() {
    const w = 1024, h = 384, c = XP.canvas(w, h), x = c.getContext('2d');
    ground(x, w, h, '#e4ddc4'); frame(x, w, h);
    for (let i = 0; i < 5; i++) {
      const cx = w * (0.14 + i * 0.18), cy = h * (0.45 + (i % 2) * 0.15), fl = (i % 2) ? 1 : -1;
      x.save(); x.translate(cx, cy); x.scale(1, fl);
      x.fillStyle = '#3d6e8e';
      x.beginPath(); x.ellipse(0, 0, 92, 26, -0.25, 0, 7); x.fill();
      x.beginPath(); x.moveTo(78, -14); x.lineTo(120, -34); x.lineTo(104, 2); x.closePath(); x.fill();
      x.fillStyle = '#e8e2d0';
      x.beginPath(); x.ellipse(0, 12, 80, 12, -0.22, 0, 7); x.fill();
      x.fillStyle = '#c8a24c';
      x.beginPath(); x.moveTo(-18, -24); x.lineTo(6, -52); x.lineTo(16, -22); x.closePath(); x.fill();
      x.restore();
    }
    x.fillStyle = '#4a7a9c';                               // little fish
    for (let i = 0; i < 9; i++) { x.beginPath(); x.ellipse(w * Math.random(), h * (0.25 + Math.random() * 0.5), 16, 6, 0, 0, 7); x.fill(); }
    return c;
  }
  function griffinFresco() {
    const w = 512, h = 384, c = XP.canvas(w, h), x = c.getContext('2d');
    ground(x, w, h, '#a43828'); frame(x, w, h);
    x.fillStyle = '#e8dcc0';                               // couchant griffin
    x.beginPath(); x.ellipse(300, 250, 130, 55, 0, 0, 7); x.fill();          // body
    x.beginPath(); x.ellipse(180, 160, 40, 34, -0.2, 0, 7); x.fill();        // head
    x.strokeStyle = '#e8dcc0'; x.lineWidth = 16;
    x.beginPath(); x.moveTo(200, 190); x.lineTo(230, 240); x.stroke();       // neck
    x.strokeStyle = '#2c3b6e'; x.lineWidth = 6;                              // crest curls
    for (let i = 0; i < 4; i++) { x.beginPath(); x.arc(170 + i * 16, 130 - i * 6, 10, 0, 5); x.stroke(); }
    x.fillStyle = '#c8a24c';                                                 // wing
    x.beginPath(); x.moveTo(260, 210); x.quadraticCurveTo(360, 120, 420, 200); x.lineTo(300, 240); x.closePath(); x.fill();
    x.fillStyle = '#1c1410';
    x.beginPath(); x.arc(190, 152, 5, 0, 7); x.fill();                       // eye
    // papyrus stems
    x.strokeStyle = '#4a7a5c'; x.lineWidth = 5;
    for (const px of [60, 100, 450]) { x.beginPath(); x.moveTo(px, 340); x.lineTo(px, 200); x.stroke();
      x.beginPath(); x.arc(px, 190, 16, Math.PI, 0); x.stroke(); }
    return c;
  }
  function princeFresco() {
    const w = 384, h = 640, c = XP.canvas(w, h), x = c.getContext('2d');
    ground(x, w, h, '#e4d8b8'); frame(x, w, h);
    minoanFigure(x, w * 0.5, h * 0.5, 420, '#b45a34', null);
    x.fillStyle = '#3d6e8e';                                // codpiece/kilt
    x.fillRect(w * 0.5 - 26, h * 0.5, 52, 90);
    x.strokeStyle = '#c8a24c'; x.lineWidth = 8;              // lily crown + plume
    x.beginPath(); x.arc(w * 0.5, h * 0.5 - 268, 34, Math.PI, 0); x.stroke();
    x.beginPath(); x.moveTo(w * 0.5 + 20, h * 0.5 - 290); x.quadraticCurveTo(w * 0.75, h * 0.5 - 380, w * 0.62, h * 0.16); x.stroke();
    for (const lx of [-26, 0, 26]) {
      x.beginPath(); x.moveTo(w * 0.5 + lx, h * 0.5 - 286); x.lineTo(w * 0.5 + lx, h * 0.5 - 316); x.stroke();
    }
    return c;
  }
  function labrysWall(rep) {
    const s = 256, c = XP.canvas(s, s), x = c.getContext('2d');
    x.fillStyle = '#c8a06a'; x.fillRect(0, 0, s, s);
    x.fillStyle = 'rgba(120,80,40,0.25)';
    for (let i = 0; i < 5; i++) x.fillRect(0, i * 52 + 40, s, 6);
    x.strokeStyle = 'rgba(90,50,30,0.5)'; x.lineWidth = 4;   // double axe sign
    x.beginPath(); x.moveTo(128, 60); x.lineTo(128, 130);
    x.moveTo(96, 70); x.quadraticCurveTo(128, 95, 160, 70);
    x.moveTo(96, 120); x.quadraticCurveTo(128, 95, 160, 120); x.stroke();
    return c;
  }

  /* ---------- world ---------- */
  A.buildWorld = function (world, XP) {
    const M = {};
    M.earth = new THREE.MeshStandardMaterial({ color: 0xa08858, roughness: 1 });
    M.court = new THREE.MeshStandardMaterial({ color: 0xd9c8a4, roughness: 0.85 });
    M.gypsum = new THREE.MeshStandardMaterial({ color: 0xe6ddc8, roughness: 0.55 });
    M.wall = new THREE.MeshStandardMaterial({ map: XP.tex(labrysWall(), 2, 1.4), roughness: 0.85, side: THREE.DoubleSide });
    M.band = new THREE.MeshStandardMaterial({ color: 0x8a2e1c, roughness: 0.8 });
    M.colR = new THREE.MeshStandardMaterial({ color: 0xa03828, roughness: 0.55 });
    M.colK = new THREE.MeshStandardMaterial({ color: 0x201a14, roughness: 0.5 });
    M.roof = new THREE.MeshStandardMaterial({ color: 0xbfa878, roughness: 0.9, side: THREE.DoubleSide });
    M.pith = new THREE.MeshStandardMaterial({ color: 0x9c5c34, roughness: 0.75 });
    M.horn = new THREE.MeshStandardMaterial({ color: 0xe8e0cc, roughness: 0.6 });
    M.olive = new THREE.MeshStandardMaterial({ color: 0x6b7c4a, roughness: 0.95 });

    const w = XP.builder(M.wall, 'walls'), gy = XP.builder(M.gypsum), rf = XP.builder(M.roof),
          bd = XP.builder(M.band), hn = XP.builder(M.horn);

    // ground + court
    const g0 = new THREE.Mesh(new THREE.PlaneGeometry(400, 340), M.earth);
    g0.rotation.x = -Math.PI / 2; g0.position.y = -0.02; world.add(g0);
    const court = new THREE.Mesh(new THREE.BoxGeometry(50, 0.2, 25), M.court);
    court.position.set(0, 0.1, 0); world.add(court);
    XP.addFloor({ x0: -200, x1: 200, z0: -170, z1: 170, y: 0 });
    XP.addFloor({ x0: -25, x1: 25, z0: -12.5, z1: 12.5, y: 0.2 });

    XP.columnType('min', { profile: 'minoan', r: 0.3, h: 3.3, taper: 1.35, mat: M.colR, capMat: M.colK, capH: 0.5 });
    XP.columnType('minBig', { profile: 'minoan', r: 0.38, h: 4.2, taper: 1.35, mat: M.colR, capMat: M.colK, capH: 0.6 });

    function slabRoof(x0, x1, z0, z1, y) {
      rf.add(new THREE.BoxGeometry(x1 - x0, 0.35, z1 - z0), (x0 + x1) / 2, y, (z0 + z1) / 2);
    }
    function wallBox(x0, x1, z0, z1, h, y0) {
      w.add(new THREE.BoxGeometry(x1 - x0, h, z1 - z0), (x0 + x1) / 2, (y0 || 0) + h / 2, (z0 + z1) / 2);
      XP.addBox(x0, x1, z0, z1, y0 || 0, (y0 || 0) + h);
    }
    function fresco(canvas, wid, hei, x, y, z, rotY) {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(wid, hei),
        new THREE.MeshStandardMaterial({ map: XP.tex(canvas), roughness: 0.7, side: THREE.DoubleSide }));
      m.position.set(x, y, z); m.rotation.y = rotY || 0;
      world.add(m);
    }

    /* ── west wing (z < −12.5) ── */
    wallBox(-25, 25, -13.6, -12.6, 3.6, 0);                       // court west facade… (openings visual only)
    // portico columns along the court's west edge with three door gaps
    for (const cx of [-20, -14, -2, 4, 16, 22]) XP.column('min', cx, -12.2);
    // carve walk gaps in the facade collider: re-add as segments instead
    XP.colliders.pop();                                            // remove the solid facade collider
    [[-25, -22], [-12, -4], [6, 14], [24, 25]].forEach(([a, b]) => XP.addBox(a, b, -13.6, -12.6, 0, 3.6));
    slabRoof(-25, 25, -32, -12.6, 3.8);
    // throne room
    wallBox(-16, -15, -22, -13, 3.6); wallBox(-1, 0, -22, -13, 3.6);
    wallBox(-16, 0, -22.8, -22, 3.6);
    const throne = XP.mergeGeoms([
      new THREE.BoxGeometry(1.1, 0.5, 0.8).translate(0, 0.25, 0),
      new THREE.BoxGeometry(1.0, 1.5, 0.22).translate(0, 1.05, -0.3)
    ]);
    gy.add(throne, -8, 0, -21.9);
    gy.add(new THREE.BoxGeometry(6, 0.45, 0.5), -12.5, 0.22, -21.9);
    gy.add(new THREE.BoxGeometry(6, 0.45, 0.5), -3.5, 0.22, -21.9);
    fresco(griffinFresco(), 3.4, 2.5, -5.6, 1.8, -22.25, 0);
    fresco(griffinFresco(), 3.4, 2.5, -10.4, 1.8, -22.25, 0);
    // lustral basin opposite the throne
    gy.add(new THREE.BoxGeometry(3.6, 0.2, 2.6), -8, -0.05, -15.6);
    XP.column('min', -6.2, -15.6); XP.column('min', -9.8, -15.6);
    // magazines: 6 long corridors with pithoi
    for (let i = 0; i < 7; i++) wallBox(-20 + 0, 10, -32 + i * 1.65 + 0, -32 + i * 1.65 + 0.4, 3.2);
    const pithProfile = [];
    [[0, 0], [0.32, 0.05], [0.45, 0.5], [0.42, 1.05], [0.3, 1.45], [0.34, 1.6]].forEach(p => pithProfile.push(new THREE.Vector2(p[0], p[1])));
    const pith = new THREE.LatheGeometry(pithProfile, 12);
    const rnd = XP.rng(9);
    const inst = new THREE.InstancedMesh(pith, M.pith, 54);
    let pi = 0;
    for (let row = 0; row < 6; row++) for (let k = 0; k < 9; k++) {
      const px = -19 + k * 3.3 + rnd(), pz = -31.2 + row * 1.65;
      inst.setMatrixAt(pi++, new THREE.Matrix4().compose(
        new THREE.Vector3(px, 0, pz), new THREE.Quaternion(),
        new THREE.Vector3(1, 0.9 + rnd() * 0.35, 1)));
    }
    world.add(inst);
    wallBox(-20.6, -20, -32, -20.5, 3.2); wallBox(10, 10.6, -32, -20.5, 3.2);

    /* ── upper floor over west wing + horns on the court parapet ── */
    for (const cx of [-20, -14, -2, 4, 16, 22]) XP.column('min', cx, -13.4, 3.8, 0);
    slabRoof(-25, 25, -14.2, -11.9, 7.2);
    bd.add(new THREE.BoxGeometry(50, 0.5, 0.3), 0, 3.95, -12.05);
    // horns of consecration (three sets, on the parapet)
    const hornShape = new THREE.Shape();
    hornShape.moveTo(-1.1, 0); hornShape.lineTo(-0.9, 0.9); hornShape.quadraticCurveTo(-0.75, 1.35, -0.45, 1.5);
    hornShape.quadraticCurveTo(-0.6, 0.9, -0.35, 0.55); hornShape.lineTo(0.35, 0.55);
    hornShape.quadraticCurveTo(0.6, 0.9, 0.45, 1.5); hornShape.quadraticCurveTo(0.75, 1.35, 0.9, 0.9);
    hornShape.lineTo(1.1, 0); hornShape.closePath();
    const hornGeo = new THREE.ExtrudeGeometry(hornShape, { depth: 0.4, bevelEnabled: false });
    for (const hx of [-16, 0, 16]) hn.add(hornGeo, hx, 7.4, -12.2);
    hn.add(hornGeo, -30.5, 0, 24.5, 0.5);                          // one at ground for a close look

    /* ── east wing (z > 12.5): staircase block + halls ── */
    wallBox(-25, 25, 12.6, 13.6, 3.6);
    XP.colliders.pop();
    [[-25, -16], [-6, 2], [10, 25]].forEach(([a, b]) => XP.addBox(a, b, 12.6, 13.6, 0, 3.6));
    slabRoof(-25, 25, 13.4, 34, 3.8);
    // light well of the grand staircase
    for (const [cx, cz] of [[13, 16], [13, 20], [18, 16], [18, 20]]) XP.column('minBig', cx, cz);
    slabRoof(11.5, 19.5, 14.8, 21.2, 7.6);
    // stair flights (walkable)
    for (let s = 0; s < 8; s++) {
      gy.add(new THREE.BoxGeometry(2.2, 0.45, 1.05), 21.3, 0.22 + s * 0.42, 15 + s * 0.95);
      }
    XP.addFloor({ x0: 20.2, x1: 22.4, z0: 14.5, z1: 23.1, y: 3.6, ramp: { axis: 'z', from: 14.5, to: 23.1, y0: 0.2, y1: 3.6 } });
    XP.addFloor({ x0: 11, x1: 25, z0: 23.1, z1: 33.5, y: 3.8 });   // upper terrace you can reach
    XP.addBox(22.5, 23.2, 14, 24, 3.6, 5.4);                       // stair rail
    // hall of the double axes: paired columns + folding-door piers
    for (const cx of [8, 12, 16, 20]) XP.column('min', cx, 26);
    for (const cx of [8, 12, 16, 20]) XP.column('min', cx, 31);
    slabRoof(6, 24, 24.5, 32.5, 4.0);
    fresco(dolphinFresco(), 7.5, 2.8, -6, 1.9, 28, Math.PI / 2);   // queen's megaron wall
    wallBox(-7, -6.4, 22, 34, 3.8);
    wallBox(-25, -6.4, 21.5, 22, 3.8);

    /* ── frescoes around the court ── */
    fresco(bullFresco(), 7.2, 3.6, 14, 2.1, -12.55, 0);            // on the west facade
    fresco(princeFresco(), 1.9, 3.2, -2, 1.8, 24.4, Math.PI);      // south corridor
    wallBox(-8, 4, 24.6, 25.2, 4.2);
    fresco(dolphinFresco(), 6, 2.2, -19.5, 1.6, -12.55, 0);

    /* ── perimeter walls so no roof edge floats ── */
    wallBox(-25.2, -24.5, -32, -12.6, 3.6);      // west edge, north wing
    wallBox(24.5, 25.2, -32, -12.6, 3.6);
    wallBox(-25, 25, -32.5, -31.9, 3.2);         // outer magazine wall
    wallBox(-25.2, -24.5, 13.4, 34, 3.6);        // west edge, south wing
    wallBox(24.5, 25.2, 13.4, 34, 3.6);
    wallBox(-25, 25, 33.5, 34.1, 3.6);
    // court west entrance: flanking stubs, centre open
    wallBox(-25.8, -25.1, -12.5, -4, 3.4); wallBox(-25.8, -25.1, 4, 12.5, 3.4);
    for (const cz of [-3, 3]) XP.column('minBig', -25.4, cz);

    /* ── olive trees + landscape dressing ── */
    const trunk = new THREE.CylinderGeometry(0.16, 0.24, 1.7, 7);
    const crown = new THREE.SphereGeometry(1.5, 9, 7);
    for (const [tx, tz, s] of [[-34, 14, 1], [-38, -6, 1.2], [34, -20, 1], [40, 8, 1.3], [-30, 36, 1], [28, 40, 1.1], [-44, 30, 0.9]]) {
      const t = new THREE.Mesh(trunk, M.pith), cgr = new THREE.Mesh(crown, M.olive);
      t.position.set(tx, 0.85 * s, tz); t.scale.setScalar(s);
      cgr.position.set(tx, (1.7 + 1.1) * s, tz); cgr.scale.set(s, s * 0.8, s);
      world.add(t, cgr);
    }

    [w, gy, rf, bd, hn].forEach(b => b.flush(world));
    XP.label('Κεντρική Αυλή', 0, 6, 0, 0.55);
    XP.label('Αίθουσα Θρόνου', -8, 5.5, -18, 0.5);
    XP.label('Αποθήκες', -5, 5.5, -26, 0.5);
    XP.label('Μεγάλη Κλίμακα', 16, 9, 18, 0.5);
  };
  A.labels = true;
})();
