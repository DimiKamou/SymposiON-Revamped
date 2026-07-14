/* ============================================================
   Hagia Sophia 537 — nave.js
   The naos core: floor, piers, two-storey colonnades, galleries,
   tympana, the four great arches, pendentives, the FIRST (shallow,
   537) dome with its 40-light crown, the two great semidomes and
   the four exedrae with their porphyry columns.
   ============================================================ */
HS.buildNave = function (world) {
  const D = HS.DIM, M = HS.mats;
  const gold = HS.builder(M.gold, 'gold');
  const goldX = HS.builder(M.goldCross, 'goldCross');
  const marble = HS.builder(M.proc, 'marble');
  const white = HS.builder(M.white, 'white');
  const book = HS.builder(M.bookmatch, 'revetment');
  const parap = HS.builder(M.parapet, 'parapet');

  /* ================= floor ================= */
  {
    const g = new THREE.PlaneGeometry(69, 62);
    g.rotateX(-Math.PI / 2);
    const m = new THREE.Mesh(g, M.floor);
    m.position.set(1.5, 0, 0);                       // spans x −33…36
    world.add(m);
    HS.addFloor({ x0: -32.4, x1: 30.4, z0: -30.6, z1: 30.6, y: 0 });
  }

  /* ================= main piers ================= */
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    const cxp = sx * (D.R - D.pierX / 2);
    const czp = sz * (14.3 + D.pierZ / 2);
    marble.add(new THREE.BoxGeometry(D.pierX, D.springY, D.pierZ), cxp, D.springY / 2, czp);
    HS.addBox(sx * (D.R - D.pierX), sx * D.R, sz * 14.3, sz * (14.3 + D.pierZ), 0, D.springY);
    // book-matched revetment on the two faces seen from the nave
    for (let row = 0; row < 4; row++) {
      const py = 1.55 + row * 2.62;
      for (const off of [-1.3, 1.3]) {
        book.add(new THREE.BoxGeometry(2.3, 2.5, 0.08), cxp + off, py, sz * (14.3 - 0.06));
        book.add(new THREE.BoxGeometry(0.08, 2.5, 2.3), sx * (D.R - D.pierX - 0.06), py, czp + off);
      }
    }
  }

  /* ============ nave colonnades (N & S), two storeys ============ */
  HS.columnType('naveG',  { r: 0.575, h: 9.6, mat: M.verd });
  HS.columnType('naveGal',{ r: 0.42,  h: 6.6, mat: M.verd, collide: false });
  const groundCols = [-6.18, -2.06, 2.06, 6.18];
  const groundBays = [-8.24, -4.12, 0, 4.12, 8.24];
  const galCols = [-7.36, -4.41, -1.47, 1.47, 4.41, 7.36];
  const galBays = [-8.83, -5.89, -2.94, 0, 2.94, 5.89, 8.83];

  for (const s of [-1, 1]) {
    const z = s * D.R;
    groundCols.forEach(x => HS.column('naveG', x, z));
    galCols.forEach(x => HS.column('naveGal', x, z, D.gFloor));

    // ground spandrel: extrude +Z is wall thickness; face the nave
    let g = HS.arcadeGeo(-D.colSpanX, D.colSpanX, D.arcSpring, D.gFloor, groundBays, D.arcR, 0.95);
    marble.add(g, 0, 0, z - (s > 0 ? 0.85 : 0.1) + 0, 0);
    groundBays.forEach(cx =>
      gold.add(HS.archBand(D.arcR, D.arcR + 0.32, 0.4), cx, D.arcSpring, z - (s > 0 ? 0.5 : -0.1) - 0.0));

    // gallery spandrel (spring 19.8 → great cornice 23.2)
    g = HS.arcadeGeo(-D.colSpanX, D.colSpanX, D.gArcSpring, D.gCornice, galBays, D.gArcR, 0.95);
    gold.add(g, 0, 0, z - (s > 0 ? 0.85 : 0.1));

    // gallery parapet between the columns + collider
    HS.parapet(parap, white, 0, D.gFloor, z - s * 0.3, 2 * D.colSpanX, 0);
    HS.addBox(-D.colSpanX, D.colSpanX, z - s * 0.5, z + s * 0.05, D.gFloor, D.gFloor + 1.2);
  }

  /* ============ tympana (N & S) with their windows ============ */
  for (const s of [-1, 1]) {
    const pts = [[-15.48, D.gCornice], [15.48, D.gCornice], [15.48, D.springY + 0.01]];
    for (let i = 0; i <= 30; i++) {
      const a = i / 30 * Math.PI;                       // 0 → π
      pts.push([15.49 * Math.cos(a), D.springY + 15.49 * Math.sin(a)]);
    }
    pts.push([-15.48, D.springY + 0.01]);
    const holes = [];
    [-11.1, -7.4, -3.7, 0, 3.7, 7.4, 11.1].forEach(cx => holes.push({ x: cx, y: 24.6, w: 2.3, h: 5.0 }));
    [-7.4, -3.7, 0, 3.7, 7.4].forEach(cx => holes.push({ x: cx, y: 30.6, w: 2.1, h: 4.6 }));
    const mesh = new THREE.Mesh(HS.wallWithHoles(pts, holes, 1.25), M.gold);
    mesh.position.z = s > 0 ? 15.42 : -16.67;
    world.add(mesh);
    holes.forEach(h => HS.windowPane(world, h.w, h.h, h.x, h.y, s * 15.62, s > 0 ? Math.PI : 0, null));
  }

  /* ============ the four great arches (archivolt bands) ============ */
  for (const s of [-1, 1]) {
    gold.add(HS.archBand(D.R, D.R + 1.9, 2.3), 0, D.springY, s * D.R - 1.15, 0);          // N/S
    gold.add(HS.archBand(D.R, D.R + 1.9, 2.3), s * D.R - 1.15, D.springY, 0, Math.PI / 2); // E/W
  }
  /* spandrel walls above each great arch, closing the corners between
     arch extrados and the dome ring */
  {
    const sh = new THREE.Shape();      // wide enough to overlap at the corners
    sh.moveTo(-16.8, D.springY - 0.02); sh.lineTo(16.8, D.springY - 0.02);
    sh.lineTo(16.8, D.archCrownY + 0.7); sh.lineTo(-16.8, D.archCrownY + 0.7);
    sh.closePath();
    const hole = new THREE.Path();
    hole.moveTo(-15.49, D.springY);
    hole.absarc(0, D.springY, 15.49, Math.PI, 0, true);
    hole.lineTo(-15.49, D.springY);
    sh.holes.push(hole);
    const spg = new THREE.ExtrudeGeometry(sh, { depth: 1.25, bevelEnabled: false, curveSegments: 48 });
    const uv = spg.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.25, uv.getY(i) * 0.25);
    for (const s of [-1, 1]) {
      gold.add(spg.clone(), 0, 0, s > 0 ? 15.45 : -16.7, 0);
      gold.add(spg.clone(), s > 0 ? 16.7 : -15.45, 0, 0, -Math.PI / 2);
    }
  }

  /* ============ pendentives ============ */
  {
    const Rp = D.R * Math.SQRT2;
    let g = HS.sphereBand(Rp, 0, D.R, 0, Math.PI * 2, 128, 30);
    HS.scaleUV(g, 30, 6);
    g.translate(0, D.springY, 0);
    g = HS.filterFaces(g, (x, y, z) => Math.abs(x) <= D.R + 0.05 && Math.abs(z) <= D.R + 0.05);
    world.add(new THREE.Mesh(g, M.goldCross));
  }

  /* ============ the FIRST dome (537 profile) ============ */
  {
    const rise = D.domeRise;
    const Rd = (D.R * D.R + rise * rise) / (2 * rise);       // ≈ 17.7 m
    const cy = D.archCrownY + rise - Rd;
    const ring = new THREE.TorusGeometry(D.R + 0.35, 0.55, 8, 96);
    ring.rotateX(Math.PI / 2);
    white.add(ring, 0, D.archCrownY, 0);
    const y0 = D.archCrownY - cy, y1 = D.domeWinTop - cy;
    if (!HS.hideSet.has('piers')) for (let i = 0; i < 40; i++) {   // piers between the 40 lights
      const a = i * Math.PI / 20;
      gold.raw(HS.sphereBand(Rd, y0, y1, a - HS.rad(1.9), HS.rad(3.8), 4, 3).translate(0, cy, 0));
    }
    // extended well past the lights so no floor sightline escapes to sky
    const glow = new THREE.Mesh(HS.sphereBand(Rd + 0.4, y0 - 0.4, y1 + 2.6, 0, Math.PI * 2, 80, 5), M.glow);
    glow.position.y = cy;
    world.add(glow);
    const cap = new THREE.Mesh(HS.sphereBand(Rd, y1, Rd, 0, Math.PI * 2, 112, 30), M.domeGold);
    cap.position.y = cy;
    world.add(cap);
    // crown medallion: the great mosaic cross of the first dome
    const cc = document.createElement('canvas'); cc.width = cc.height = 256;
    const c2 = cc.getContext('2d');
    c2.fillStyle = '#a8874a'; c2.beginPath(); c2.arc(128, 128, 126, 0, 7); c2.fill();
    c2.strokeStyle = '#e9dcb4'; c2.lineWidth = 8; c2.beginPath(); c2.arc(128, 128, 112, 0, 7); c2.stroke();
    c2.strokeStyle = '#f4eedb'; c2.lineWidth = 26;
    c2.beginPath(); c2.moveTo(128, 44); c2.lineTo(128, 212); c2.moveTo(62, 96); c2.lineTo(194, 96); c2.stroke();
    const ct = new THREE.CanvasTexture(cc); ct.colorSpace = THREE.SRGBColorSpace;
    const disc = new THREE.Mesh(new THREE.CircleGeometry(3.4, 40),
      new THREE.MeshStandardMaterial({ map: ct, metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide }));
    disc.rotation.x = Math.PI / 2;
    disc.position.y = D.archCrownY + rise - 0.3;
    world.add(disc);
  }

  /* ============ the two great semidomes ============ */
  for (const e of [-1, 1]) {
    // rotY(+π/2) maps the geometry's +Z bulge to +X (east)
    const rotY = e > 0 ? Math.PI / 2 : -Math.PI / 2;
    if (e > 0) {                                              // EAST: 5 lights at the base
      let up = new THREE.SphereGeometry(D.R, 80, 20, 0, Math.PI, 0, HS.rad(80));
      HS.scaleUV(up, 15, 5);
      up.rotateY(rotY); up.translate(D.R, D.springY, 0);
      goldX.raw(up);
      [[0, 36], [48, 60], [72, 84], [96, 108], [120, 132], [144, 180]].forEach(([a0, a1]) => {
        const seg = new THREE.SphereGeometry(D.R, 12, 4, HS.rad(a0), HS.rad(a1 - a0), HS.rad(80), HS.rad(10));
        HS.scaleUV(seg, Math.max(1, (a1 - a0) / 12), 1);
        seg.rotateY(rotY); seg.translate(D.R, D.springY, 0);
        gold.raw(seg);
      });
      const glow = new THREE.Mesh(new THREE.SphereGeometry(D.R + 0.45, 40, 4, 0, Math.PI, HS.rad(72), HS.rad(18)), M.glow);
      glow.rotation.y = rotY; glow.position.set(D.R, D.springY, 0);
      world.add(glow);
    } else {
      const g = new THREE.SphereGeometry(D.R, 80, 24, 0, Math.PI, 0, Math.PI / 2);
      HS.scaleUV(g, 15, 7);
      g.rotateY(rotY); g.translate(-D.R, D.springY, 0);
      goldX.raw(g);
    }
  }

  /* ============ end walls (chord segments) ============ */
  function arcWallChords(builderRef, e, a0deg, a1deg, y0, y1, segN, thick, collide) {
    const r = D.R, cx = e * D.R;
    for (let i = 0; i < segN; i++) {
      const aa = HS.rad(a0deg + (i + 0.5) * (a1deg - a0deg) / segN);
      const chord = 2 * r * Math.sin(HS.rad(a1deg - a0deg) / segN / 2) + 0.28;
      const px = cx + e * r * Math.cos(aa), pz = r * Math.sin(aa);
      const yaw = Math.atan2(e * Math.cos(aa), Math.sin(aa));  // +Z → outward normal
      builderRef.add(new THREE.BoxGeometry(chord, y1 - y0, thick), px, (y0 + y1) / 2, pz, yaw);
      if (collide) {
        const hx = Math.abs(chord / 2 * Math.cos(yaw)) + Math.abs(thick / 2 * Math.sin(yaw)) + 0.05;
        const hz = Math.abs(chord / 2 * Math.sin(yaw)) + Math.abs(thick / 2 * Math.cos(yaw)) + 0.05;
        HS.addBox(px - hx, px + hx, pz - hz, pz + hz, y0, y1);
      }
    }
  }

  for (const e of [-1, 1]) {
    for (const s of [-1, 1]) {
      // masonry between central opening and exedra (θ 19°..36°), floor → cornice.
      // On the WEST end a door (θ≈27°) leads through to the narthex vestibules.
      if (e < 0) {
        arcWallChords(marble, e, s * 19, s * 23.5, 0, D.gCornice, 1, 1.3, true);
        arcWallChords(marble, e, s * 30.5, s * 36, 0, D.gCornice, 1, 1.3, true);
        arcWallChords(marble, e, s * 23.5, s * 30.5, 4.9, D.gCornice, 2, 1.3, false); // over the door
      } else {
        arcWallChords(marble, e, s * 19, s * 36, 0, D.gCornice, 3, 1.3, true);
      }
      // masonry between exedra and main pier (θ 72°..90°)
      arcWallChords(marble, e, s * 72, s * 90, 0, D.gCornice, 3, 1.3, true);
      // book-matched panels zone on those walls (visual, slightly inset)
      arcWallChords(book, e, s * 21, s * 34, 0.9, 9.9, 3, 1.34, false);
      arcWallChords(book, e, s * 74, s * 88, 0.9, 9.9, 3, 1.34, false);
    }
    // upper wall band above everything to the semidome springing
    arcWallChords(gold, e, -90, 90, D.gCornice, D.springY + 0.45, 14, 1.15, false);
    // spandrel above the central opening (arch crown ≈19.9 → cornice)
    arcWallChords(marble, e, -19, 19, 19.8, D.gCornice, 4, 1.25, false);
    // central opening archivolt (apse arch / west entrance arch)
    gold.add(HS.archBand(4.95, 5.65, 1.5), e * 29.45, 15.0, 0, e > 0 ? -Math.PI / 2 : Math.PI / 2);
  }

  /* ---- exedrae (4): niche + conch + porphyry columns + gallery ---- */
  HS.columnType('exG',   { r: 0.60, h: 9.6, mat: M.porphyry });
  HS.columnType('exGal', { r: 0.40, h: 5.6, mat: M.verd, collide: false });
  for (const e of [-1, 1]) for (const s of [-1, 1]) {
    const beta = D.exAng;
    const C = { x: e * D.R + e * D.R * Math.cos(beta), z: s * D.R * Math.sin(beta) };
    const dirX = e * Math.cos(beta), dirZ = s * Math.sin(beta);   // outward bulge
    const alpha = Math.atan2(dirX, dirZ);
    const tx = -dirZ, tz = dirX;                                  // tangent
    // niche wall + conch
    marble.add(HS.scaleUV(new THREE.CylinderGeometry(D.exR, D.exR, D.exSpring, 36, 1, true, alpha - Math.PI / 2, Math.PI), 8, 7),
      C.x, D.exSpring / 2, C.z);
    let conch = new THREE.SphereGeometry(D.exR, 48, 16, 0, Math.PI, 0, Math.PI / 2);
    HS.scaleUV(conch, 6, 3);
    conch.rotateY(alpha); conch.translate(C.x, D.exSpring, C.z);
    goldX.raw(conch);
    gold.add(HS.archBand(D.exR, D.exR + 0.5, 0.9), C.x, D.exSpring, C.z, alpha + Math.PI);
    for (let i = 0; i < 5; i++) {                                 // niche colliders
      const gAng = alpha - Math.PI / 2 + (i + 0.5) * Math.PI / 5;
      const px = C.x + Math.sin(gAng) * D.exR, pz = C.z + Math.cos(gAng) * D.exR;
      HS.addBox(px - 1.05, px + 1.05, pz - 1.05, pz + 1.05, 0, D.exSpring);
    }
    // 2 porphyry columns + ground arcade across the opening face
    for (const k of [-1, 1]) HS.column('exG', C.x + tx * k * 1.83, C.z + tz * k * 1.83, 0, alpha);
    marble.add(HS.arcadeGeo(-5.5, 5.5, D.arcSpring, D.gFloor, [-3.66, 0, 3.66], 1.7, 0.85),
      C.x, 0, C.z, alpha + Math.PI);
    // gallery slab, 6 verd columns, ring spandrel, parapet
    marble.add(new THREE.CylinderGeometry(D.exR - 0.15, D.exR - 0.15, D.gSlab, 28, 1, false, alpha - Math.PI / 2, Math.PI),
      C.x, D.gFloor - D.gSlab / 2, C.z);
    HS.addFloor({ circle: { x: C.x, z: C.z, r: D.exR - 0.35 }, y: D.gFloor });
    for (let i = 0; i < 6; i++) {
      const gAng = -HS.rad(75) + i * HS.rad(30);
      HS.column('exGal', C.x + Math.sin(alpha + gAng) * 4.5, C.z + Math.cos(alpha + gAng) * 4.5, D.gFloor, alpha + gAng + Math.PI);
    }
    gold.add(new THREE.CylinderGeometry(4.6, 4.6, 1.2, 30, 1, true, alpha - Math.PI / 2, Math.PI), C.x, 19.82, C.z);
    HS.parapet(parap, white, C.x, D.gFloor, C.z, 10.4, alpha + Math.PI);
    for (const k of [-2.6, 0, 2.6]) {                             // parapet colliders
      const px = C.x + tx * k, pz = C.z + tz * k;
      HS.addBox(px - 1.35, px + 1.35, pz - 1.35, pz + 1.35, D.gFloor, D.gFloor + 1.2);
    }
  }

  /* ---- the great cornice at 23.2 ---- */
  for (const s of [-1, 1])
    white.add(new THREE.BoxGeometry(2 * D.R + 1.6, 0.55, 0.85), 0, D.gCornice + 0.27, s * (D.R - 0.35));
  for (const e of [-1, 1]) {
    const seg = 18;
    for (let i = 0; i < seg; i++) {
      const a = HS.rad(-86 + (i + 0.5) * 172 / seg);
      const rr = D.R - 0.35;
      const px = e * D.R + e * rr * Math.cos(a), pz = rr * Math.sin(a);
      const chord = 2 * rr * Math.sin(HS.rad(172 / seg) / 2) + 0.15;
      const g = new THREE.BoxGeometry(chord, 0.55, 0.85);
      const yaw = Math.atan2(e * Math.cos(a), Math.sin(a));
      white.add(g, px, D.gCornice + 0.27, pz, yaw);
    }
  }
  // lower cornice line at gallery floor around the ends
  for (const e of [-1, 1]) {
    const seg = 14;
    for (let i = 0; i < seg; i++) {
      const a = HS.rad(-88 + (i + 0.5) * 176 / seg);
      const rr = D.R - 0.4;
      const px = e * D.R + e * rr * Math.cos(a), pz = rr * Math.sin(a);
      const chord = 2 * rr * Math.sin(HS.rad(176 / seg) / 2) + 0.15;
      const yaw = Math.atan2(e * Math.cos(a), Math.sin(a));
      white.add(new THREE.BoxGeometry(chord, 0.4, 0.6), px, D.gFloor + 0.1, pz, yaw);
    }
  }

  [gold, goldX, marble, white, book, parap].forEach(b => b.flush(world));
};
