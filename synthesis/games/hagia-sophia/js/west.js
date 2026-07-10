/* ============================================================
   Hagia Sophia 537 — west.js
   West wall with its nine doors (centre: the Imperial Door),
   inner narthex + over-narthex gallery with the Empress's loge,
   exonarthex, the colonnaded atrium with the phiale fountain,
   and the exterior massing seen from the courtyard.
   ============================================================ */
HS.buildWest = function (world) {
  const D = HS.DIM, M = HS.mats;
  const marble = HS.builder(M.proc, 'w-marble');
  const white = HS.builder(M.white, 'w-white');
  const gold = HS.builder(M.gold, 'w-gold');
  const goldX = HS.builder(M.goldCross, 'w-goldX');
  const book = HS.builder(M.bookmatch, 'w-book');
  const brick = HS.builder(M.brick, 'w-brick');
  const lead = HS.builder(M.lead, 'w-lead');
  const bronze = HS.builder(M.bronze, 'w-bronze');
  const parap = HS.builder(M.parapet, 'w-parap');

  /* ============ nave west wall (z −15.5…15.5) with 5 doors ============ */
  {
    const holes = [
      { x: 0, y: 0, w: 4.6, h: 7.4, r: 0 },              // Imperial Door
      { x: -3.55 - 0 - 0 - 0, y: 0, w: 0, h: 0 },        // (placeholder, removed below)
    ];
    const H = [
      { x: 0, y: 0, w: 4.6, h: 7.4, r: 0 },
      { x: 3.55, y: 0, w: 2.0, h: 4.6 }, { x: -3.55, y: 0, w: 2.0, h: 4.6 },
      { x: 7.05, y: 0, w: 2.4, h: 4.9 }, { x: -7.05, y: 0, w: 2.4, h: 4.9 },
      { x: 0, y: 13.2, w: 8.8, h: 5.6 },                  // loge opening to over-narthex
    ];
    const wall = new THREE.Mesh(HS.wallWithHoles(
      [[-15.5, 0], [15.5, 0], [15.5, 21.2], [-15.5, 21.2]], H, D.wallT), M.proc);
    wall.rotation.y = -Math.PI / 2;                       // local +X→+Z, extrude→−X
    wall.position.set(D.narthexE + D.wallT, 0, 0);
    world.add(wall);
    // colliders with the door gaps open
    [[2.3, 2.55], [4.55, 5.85], [8.25, 15.5]].forEach(([a, b]) => {
      HS.addBox(D.narthexW, D.narthexE, a, b, 0, 24);
      HS.addBox(D.narthexW, D.narthexE, -b, -a, 0, 24);
    });
    HS.addBox(D.narthexW, D.narthexE, -15.5, 15.5, 7.6, 12.9);  // over the doors

    /* Imperial Door dressing: jambs, entablature, open bronze leaves */
    white.add(new THREE.BoxGeometry(0.5, 8.0, 0.75), D.narthexE + 0.4, 4.0, 2.55);
    white.add(new THREE.BoxGeometry(0.5, 8.0, 0.75), D.narthexE + 0.4, 4.0, -2.55);
    white.add(new THREE.BoxGeometry(0.85, 0.9, 6.4), D.narthexE + 0.4, 7.95, 0);
    for (const s of [-1, 1]) {
      const leaf = new THREE.Mesh(new THREE.PlaneGeometry(2.1, 7.1), M.bronzeDoor);
      leaf.position.set(D.narthexE + 0.9 + 0.35, 3.55, s * (2.3 - 1.05 * 0.35));
      leaf.rotation.y = -Math.PI / 2 + s * 1.25;          // leaves ajar, opening inward
      world.add(leaf);
    }
    // smaller bronze leaves on the four side doors (ajar)
    [[3.55, 2.0, 4.6], [-3.55, 2.0, 4.6], [7.05, 2.4, 4.9], [-7.05, 2.4, 4.9]].forEach(([z, w, h]) => {
      const leaf = new THREE.Mesh(new THREE.PlaneGeometry(w - 0.3, h - 0.4), M.bronzeDoor);
      leaf.position.set(D.narthexE + 0.7, (h - 0.4) / 2, z + (w / 2 - 0.2));
      leaf.rotation.y = -Math.PI / 2 + 0.9;
      world.add(leaf);
    });
    // book-matched revetment flanking the doors (narthex side + nave side)
    for (const s of [-1, 1]) {
      book.add(new THREE.BoxGeometry(0.1, 5.2, 4.0), D.narthexE + D.wallT + 0.02, 2.9, s * 11.5);
      book.add(new THREE.BoxGeometry(0.1, 5.2, 4.0), D.narthexW - 0.02 + 0, 2.9, s * 11.5);
    }
  }

  /* ============ the loge balcony (Empress's place) ============ */
  {
    marble.add(new THREE.BoxGeometry(2.7, 0.35, 9.0), -30.75, D.gFloor - 0.175, 0);
    HS.addFloor({ x0: -32.4, x1: -29.55, z0: -4.4, z1: 4.4, y: D.gFloor });
    HS.parapet(parap, white, -29.5, D.gFloor, 0, 9.0, Math.PI / 2);
    HS.addBox(-29.7, -29.3, -4.6, 4.6, D.gFloor, D.gFloor + 1.25);
    for (const s of [-1, 1]) {          // side rails
      HS.parapet(parap, white, -30.9, D.gFloor, s * 4.42, 2.6, 0);
      HS.addBox(-32.4, -29.5, s * 4.25, s * 4.6, D.gFloor, D.gFloor + 1.25);
    }
    // porphyry disc marking the imperial station
    const disc = new THREE.Mesh(new THREE.CircleGeometry(0.85, 24), M.porphyry);
    disc.rotation.x = -Math.PI / 2; disc.position.set(-31.2, D.gFloor + 0.012, 0);
    world.add(disc);
    // soffit under the balcony bay + barrel cap of the west central bay
    gold.add(new THREE.BoxGeometry(1.6, 0.3, 10.0), -30.6, 19.75, 0);
  }

  /* ============ vestibule pockets behind the θ≈27° doors ============ */
  {
    for (const s of [-1, 1]) {
      marble.add(new THREE.BoxGeometry(2.3, 0.6, 7.2), -29.9, 12.9, s * 8.6);  // pocket ceiling
    }
  }

  /* ============ narthex (ground) ============ */
  const floorStrip = new THREE.MeshStandardMaterial({
    map: HS.texs.proc.clone(), color: 0xd6d4cc, metalness: 0.05, roughness: 0.5 });
  floorStrip.map.repeat.set(2.4, 15);
  {
    const x0 = D.narthex0, x1 = D.narthexW;               // −38.2 … −32.4
    // floor
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 + 1.4, 57.2), floorStrip);
    fl.rotation.x = -Math.PI / 2; fl.position.set((x0 + x1) / 2 - 0.7, 0.005, 0);
    world.add(fl);
    HS.addFloor({ x0: x0 - 1.4, x1: x1, z0: -28.6, z1: 28.6, y: 0 });
    // west wall of the narthex (5 doors to the exonarthex)
    const H = [0, 9, -9, 18, -18].map(z => ({ x: z, y: 0, w: 2.6, h: 4.3 }));
    const wall = new THREE.Mesh(HS.wallWithHoles(
      [[-28.6, 0], [28.6, 0], [28.6, 23.4], [-28.6, 23.4]], H.concat(
        [0, 9, -9, 18, -18].map(z => ({ x: z, y: 15.0, w: 2.3, h: 4.2 }))    // hall windows
      ), D.wallT), M.proc);
    wall.rotation.y = -Math.PI / 2;
    wall.position.set(x0 + 0, 0, 0);
    world.add(wall);
    [[1.3, 7.7], [10.3, 16.7], [19.3, 28.6]].forEach(([a, b]) => {
      HS.addBox(x0 - D.wallT, x0, a, b, 0, 24);
      HS.addBox(x0 - D.wallT, x0, -b, -a, 0, 24);
    });
    HS.addBox(x0 - D.wallT, x0, -28.6, 28.6, 4.4, 12.9);
    [0, 9, -9, 18, -18].forEach(z =>
      HS.windowPane(world, 2.3, 4.2, z, 15.0, x0 - 0.7, Math.PI / 2));       // hall panes (west light)
    // north/south end walls
    for (const s of [-1, 1]) {
      marble.add(new THREE.BoxGeometry(x1 - x0 + 1.5, 23.4, D.wallT), (x0 + x1) / 2, 11.7, s * (28.6 + D.wallT / 2));
      HS.addBox(x0 - 1.5, x1, s * 28.6, s * (28.6 + D.wallT), 0, 24);
    }
    // revetment along the narthex east wall between doors
    [-12.5, -14, 12.5].forEach(() => {});
    for (const zz of [-12.2, -10, 10, 12.2]) book.add(new THREE.BoxGeometry(0.1, 4.6, 1.9), x1 - 0.05, 2.6, zz);
    // ceiling: slab + 9 gold cross-vault caps
    marble.add(new THREE.BoxGeometry(x1 - x0, 0.6, 57.2), (x0 + x1) / 2, 11.0, 0);
    const capR = 3.5;
    for (let k = 0; k < 9; k++) {
      const cz = -24.9 + k * 6.225;
      const cap = HS.scaleUV(HS.sphereBand(capR, 2.2, capR, 0, Math.PI * 2, 24, 6), 5, 2);
      cap.translate((x0 + x1) / 2, 10.65 - capR, cz);
      goldX.raw(cap);
    }
    // over-narthex hall: floor slab (12.6…13.2), ceiling, gold caps
    marble.add(new THREE.BoxGeometry(x1 - x0, 0.6, 57.2), (x0 + x1) / 2, D.gFloor - 0.3, 0);
    HS.addFloor({ x0, x1: x1 + 0.0, z0: -28.6, z1: 28.6, y: D.gFloor });
    marble.add(new THREE.BoxGeometry(x1 - x0, 0.7, 57.2), (x0 + x1) / 2, 21.85, 0);
    for (let k = 0; k < 9; k++) {
      const cz = -24.9 + k * 6.225;
      const cap = HS.scaleUV(HS.sphereBand(capR, 2.4, capR, 0, Math.PI * 2, 24, 6), 5, 2);
      cap.translate((x0 + x1) / 2, 21.6 - capR, cz);
      goldX.raw(cap);
    }
  }

  /* ============ exonarthex ============ */
  {
    const x0 = D.exo0, x1 = D.exoE;                       // −44.2 … −39.6
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 + 1.4, 57.2), floorStrip);
    fl.rotation.x = -Math.PI / 2; fl.position.set((x0 + x1) / 2, 0.004, 0);
    world.add(fl);
    HS.addFloor({ x0: x0 - 1.5, x1: x1 + 1.5, z0: -28.6, z1: 28.6, y: 0 });
    // west (atrium-facing) wall: 5 open arches
    const H = [0, 9, -9, 18, -18].map(z => ({ x: z, y: 0, w: 3.1, h: 4.9 }));
    const wall = new THREE.Mesh(HS.wallWithHoles(
      [[-28.6, 0], [28.6, 0], [28.6, 9.6], [-28.6, 9.6]], H, D.wallT), M.brick);
    wall.rotation.y = -Math.PI / 2;
    wall.position.set(x0, 0, 0);
    world.add(wall);
    [[1.55, 7.45], [10.55, 16.45], [19.55, 28.6]].forEach(([a, b]) => {
      HS.addBox(x0 - D.wallT, x0, a, b, 0, 12);
      HS.addBox(x0 - D.wallT, x0, -b, -a, 0, 12);
    });
    HS.addBox(x0 - D.wallT, x0, -28.6, 28.6, 5.0, 12);
    for (const s of [-1, 1]) {
      brick.add(new THREE.BoxGeometry(x1 - x0 + 1.5, 9.6, D.wallT), (x0 + x1) / 2, 4.8, s * (28.6 + D.wallT / 2));
      HS.addBox(x0 - 1.5, x1 + 1.5, s * 28.6, s * (28.6 + D.wallT), 0, 12);
    }
    marble.add(new THREE.BoxGeometry(x1 - x0, 0.7, 57.2), (x0 + x1) / 2, 9.15, 0);
    for (let k = 0; k < 9; k++) {                         // plain vault caps
      const cz = -24.9 + k * 6.225;
      const cap = HS.sphereBand(3.5, 2.4, 3.5, 0, Math.PI * 2, 20, 5);
      cap.translate((x0 + x1) / 2, 9.15 - 3.5, cz);
      white.raw(cap);
    }
  }

  /* ============ atrium court ============ */
  {
    const x0 = D.atrium0, x1 = D.atriumE;                 // −88 … −45.6
    // paving
    const pav = new THREE.MeshStandardMaterial({ map: HS.texs.proc.clone(), color: 0xbdb49e, roughness: 0.85, metalness: 0 });
    pav.map.repeat.set(10, 8);
    const fl = new THREE.Mesh(new THREE.PlaneGeometry(x1 - x0 + 6, 57.5), pav);
    fl.rotation.x = -Math.PI / 2; fl.position.set((x0 + x1) / 2 - 1, 0.002, 0);
    world.add(fl);
    HS.addFloor({ x0: x0 - 3, x1: x1 + 1.5, z0: -28.6, z1: 28.6, y: 0 });
    // perimeter walls (N, S, W) + west gate (closed bronze)
    for (const s of [-1, 1]) {
      brick.add(new THREE.BoxGeometry(x1 - x0 + 5, 8.6, 1.2), (x0 + x1) / 2 - 1, 4.3, s * 27.4);
      HS.addBox(x0 - 3.5, x1, s * 26.8, s * 28.0, 0, 12);
    }
    brick.add(new THREE.BoxGeometry(1.2, 8.6, 56), x0 - 2.4, 4.3, 0);
    HS.addBox(x0 - 3.0, x0 - 1.8, -28, 28, 0, 12);
    const gate = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 5.8), M.bronzeDoor);
    gate.position.set(x0 - 1.7, 2.9, 0); gate.rotation.y = Math.PI / 2;
    world.add(gate);
    gold.add(HS.archBand(2.3, 2.75, 0.5), x0 - 1.9, 5.8, 0, Math.PI / 2);
    // stoas N/S/W: columns + arches + shed roofs
    HS.columnType('atrium', { r: 0.34, h: 5.3, mat: M.proc });
    const stZ = 20.4;
    for (const s of [-1, 1]) {
      const xs = [];
      for (let x = x0 + 3.2; x <= x1 - 3.4; x += 3.85) xs.push(x);
      xs.forEach(x => HS.column('atrium', x, s * stZ));
      const bays = [];
      for (let i = 0; i < xs.length - 1; i++) bays.push((xs[i] + xs[i + 1]) / 2);
      const g = HS.arcadeGeo(x0 + 2, x1 - 2, 5.3, 6.9, bays.map(b => b - (x0 + x1) / 2), 1.55, 0.6);
      marble.add(g, (x0 + x1) / 2, 0, s * stZ - (s > 0 ? 0.5 : 0.1));
      // shed roof: lean-to from perimeter wall down to the arcade
      const roof = new THREE.BoxGeometry(x1 - x0 + 2, 0.25, 8.6);
      const rm = new THREE.Mesh(roof, M.lead);
      rm.position.set((x0 + x1) / 2, 7.65, s * (stZ + 3.2));
      rm.rotation.x = s * 0.18;
      world.add(rm);
    }
    { // west stoa
      const zs = [];
      for (let z = -17.3; z <= 17.4; z += 3.85) zs.push(z);
      zs.forEach(z => HS.column('atrium', x0 + 3.0, z));
      const bays = [];
      for (let i = 0; i < zs.length - 1; i++) bays.push((zs[i] + zs[i + 1]) / 2);
      const g = HS.arcadeGeo(-17.3 - 1.9, 17.4 + 1.9, 5.3, 6.9, bays, 1.55, 0.6);
      const gm = new THREE.Mesh(g, M.proc);
      gm.rotation.y = -Math.PI / 2; gm.position.set(x0 + 3.0 - 0.25 + 0.55, 0, 0);
      world.add(gm);
      const rm = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.25, 41), M.lead);
      rm.position.set(x0 + 0.6, 7.65, 0); rm.rotation.z = -0.18;
      world.add(rm);
    }

    /* ---- the phiale fountain ---- */
    {
      const FX = -66;
      const oct = new THREE.CylinderGeometry(3.7, 3.9, 0.42, 8);
      white.add(oct, FX, 0.21, 0);
      HS.addFloor({ circle: { x: FX, z: 0, r: 3.75 }, y: 0.42 });
      marble.add(new THREE.CylinderGeometry(2.65, 2.75, 0.85, 24, 1, false), FX, 0.42 + 0.425, 0);
      white.add(new THREE.TorusGeometry(2.62, 0.22, 8, 28).rotateX(Math.PI / 2), FX, 1.32, 0);
      const wat = new THREE.Mesh(new THREE.CircleGeometry(2.45, 24), M.water);
      wat.rotation.x = -Math.PI / 2; wat.position.set(FX, 1.18, 0);
      world.add(wat);
      HS.addCyl(FX, 0, 2.95, 0, 2.2);
      // bronze pine-cone spout on a porphyry baluster
      const bal = new THREE.CylinderGeometry(0.22, 0.3, 1.1, 10);
      const bm = new THREE.Mesh(bal, M.porphyry); bm.position.set(FX, 1.18 + 0.55, 0); world.add(bm);
      bronze.add(new THREE.ConeGeometry(0.42, 0.95, 10), FX, 2.35, 0);
      // canopy: 8 colonnettes + ring + shallow dome + cross
      HS.columnType('phiale', { r: 0.15, h: 3.1, mat: M.verd });
      for (let i = 0; i < 8; i++) {
        const a = i / 8 * Math.PI * 2 + Math.PI / 8;
        HS.column('phiale', FX + Math.cos(a) * 3.3, Math.sin(a) * 3.3, 0.42);
      }
      white.add(new THREE.CylinderGeometry(3.62, 3.62, 0.42, 8, 1, false).rotateY(Math.PI / 8), FX, 0.42 + 3.1 + 0.21, 0);
      const dome = HS.sphereBand(4.4, 2.9, 4.4, 0, Math.PI * 2, 24, 8);
      dome.translate(FX, 1.05, 0);                 // rim lands on the ring (≈3.95)
      lead.raw(dome);
      gold.add(new THREE.BoxGeometry(0.08, 0.85, 0.08), FX, 5.85, 0);
      gold.add(new THREE.BoxGeometry(0.5, 0.08, 0.08), FX, 5.95, 0);
    }
  }

  /* ============ exterior massing (seen from the atrium) ============ */
  if (!HS.hideSet || !HS.hideSet.has('ext')) {
    // ground plane far out
    const gp = new THREE.Mesh(new THREE.PlaneGeometry(320, 240),
      new THREE.MeshStandardMaterial({ color: 0x9a8f76, roughness: 1 }));
    gp.rotation.x = -Math.PI / 2; gp.position.set(-10, -0.05, 0);
    world.add(gp);
    // narthex + exonarthex roofs (lean-to slabs)
    lead.add(new THREE.BoxGeometry(6.6, 0.3, 59), -35.3, 22.6, 0);
    lead.add(new THREE.BoxGeometry(5.4, 0.3, 59), -41.9, 10.1, 0);
    // upper west face above the over-narthex (kept low so the dome and
    // west semidome stay visible from the courtyard)
    brick.add(new THREE.BoxGeometry(1.3, 9.3, 33), -32.3, 22.2 + 4.65, 0);
    // its three lights (they feed the hall glow at dusk from outside — decorative)
    // aisle + gallery exterior skins and roofs
    for (const s of [-1, 1]) {
      brick.add(new THREE.BoxGeometry(63, 23.5, 0.4), 0, 11.75, s * 32.1);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(63, 0.3, 16.6), M.lead);
      roof.position.set(0, 24.6, s * 24.2); roof.rotation.x = s * 0.36;
      world.add(roof);
    }
    // east exterior: apse shell + east wall skin (split around the apse,
    // which protrudes through the facade plane)
    brick.add(new THREE.BoxGeometry(0.4, 23.5, 24.7), 32.3, 11.75, -19.15);
    brick.add(new THREE.BoxGeometry(0.4, 23.5, 24.7), 32.3, 11.75, 19.15);
    brick.add(new THREE.BoxGeometry(0.4, 4.0, 13.7), 32.3, 21.5, 0);
    const apShell = new THREE.SphereGeometry(D.apseR + 0.5, 24, 10, 0, Math.PI, 0, Math.PI / 2);
    apShell.rotateY(Math.PI / 2); apShell.translate(D.apseCX, 15.0, 0);
    lead.raw(apShell);
    // (no brick skin around the apse drum — its inner face would show
    // through the mouth edges; the lead shell + closure wall enclose it)
    // north/south great-arch exterior masses (fully outside the tympana);
    // east/west arches carry the semidome shells directly — no masses there
    for (const s of [-1, 1]) {
      brick.add(new THREE.BoxGeometry(33.4, 16.6, 1.8), 0, 23.4 + 8.3, s * 17.7);
    }
    // semidome + exedra shells (lead)
    for (const e of [-1, 1]) {
      const sh = new THREE.SphereGeometry(D.R + 0.55, 48, 16, 0, Math.PI, 0, Math.PI / 2);
      sh.rotateY(e > 0 ? Math.PI / 2 : -Math.PI / 2);
      sh.translate(e * D.R, D.springY, 0);
      lead.raw(sh);
      for (const s of [-1, 1]) {
        const beta = D.exAng;
        const C = { x: e * D.R + e * D.R * Math.cos(beta), z: s * D.R * Math.sin(beta) };
        const alpha = Math.atan2(e * Math.cos(beta), s * Math.sin(beta));
        const ex = new THREE.SphereGeometry(D.exR + 0.4, 24, 8, 0, Math.PI, 0, Math.PI / 2);
        ex.rotateY(alpha); ex.translate(C.x, D.exSpring, C.z);
        lead.raw(ex);
      }
    }
    // dome exterior: window-band piers, lead cap, gold cross
    white.add(new THREE.TorusGeometry(16.35, 0.5, 8, 64).rotateX(Math.PI / 2), 0, D.archCrownY, 0);
    const rise = D.domeRise, Rd = (D.R * D.R + rise * rise) / (2 * rise), cy = D.archCrownY + rise - Rd;
    for (let i = 0; i < 40; i++) {
      const a = i * Math.PI / 20;
      brick.raw(HS.sphereBand(Rd + 0.55, D.archCrownY - cy, D.domeWinTop - cy, a - HS.rad(2.1), HS.rad(4.2), 4, 2).translate(0, cy, 0));
    }
    lead.raw(HS.sphereBand(Rd + 0.55, D.domeWinTop - cy, Rd + 0.55, 0, Math.PI * 2, 72, 18).translate(0, cy, 0));
    gold.add(new THREE.BoxGeometry(0.22, 2.2, 0.22), 0, D.archCrownY + rise + 1.35, 0);
    gold.add(new THREE.BoxGeometry(1.3, 0.22, 0.22), 0, D.archCrownY + rise + 1.85, 0);
    // twin stair-ramp towers beyond the narthex ends
    for (const s of [-1, 1]) {
      brick.add(new THREE.CylinderGeometry(2.6, 2.8, 18, 12), -35.3, 9, s * 32.2);
      lead.add(new THREE.ConeGeometry(2.95, 2.5, 12), -35.3, 19.2, s * 32.2);
      HS.addCyl(-35.3, s * 32.2, 3.0, 0, 18);
    }
  }

  [marble, white, gold, goldX, book, brick, lead, bronze, parap].forEach(b => b.flush(world));
};
