/* ============================================================
   Hagia Sophia 537 — aisles.js
   North & south side aisles and the galleries above them:
   outer walls with two tiers of windows, aisle colonnades,
   shallow mosaic vault-caps, gallery floors and parapet edges.
   ============================================================ */
HS.buildAisles = function (world) {
  const D = HS.DIM, M = HS.mats;
  const gold = HS.builder(M.gold, 'aisle-gold');
  const goldX = HS.builder(M.goldCross, 'aisle-goldX');
  const marble = HS.builder(M.proc, 'aisle-marble');
  const book = HS.builder(M.bookmatch, 'aisle-revet');
  const white = HS.builder(M.white, 'aisle-white');

  HS.columnType('aisle',    { r: 0.55, h: 9.6, mat: M.verd });
  HS.columnType('aisleGal', { r: 0.45, h: 8.0, mat: M.verd, collide: false });

  const colXs = [-28, -22.4, -16.8, -11.2, -5.6, 0, 5.6, 11.2, 16.8, 22.4, 28];
  const winXs = [-25.2, -19.6, -14, -8.4, -2.8, 2.8, 8.4, 14, 19.6, 25.2];

  for (const s of [-1, 1]) {
    const zw = s * D.aisleZ1;                       // inner wall face
    /* ---- outer wall, ground + gallery, with windows ---- */
    const holesG = winXs.map(x => ({ x, y: 2.9, w: 1.9, h: 3.9 }));
    const holesU = winXs.map(x => ({ x, y: 15.2, w: 1.9, h: 4.1 }));
    const outline = [[-31, 0], [31, 0], [31, 23.4], [-31, 23.4]];
    const wallG = HS.wallWithHoles(outline, holesG.concat(holesU), D.wallT);
    const mesh = new THREE.Mesh(wallG, M.proc);
    mesh.position.z = s > 0 ? zw : zw - D.wallT;
    world.add(mesh);
    HS.addBox(-31, 31, Math.min(zw, zw + s * D.wallT), Math.max(zw, zw + s * D.wallT), 0, 24);
    holesG.concat(holesU).forEach(h =>
      HS.windowPane(world, h.w, h.h, h.x, h.y, zw + s * 0.7, s > 0 ? Math.PI : 0));
    // revetment band on the ground storey of the outer wall
    for (const x of colXs) book.add(new THREE.BoxGeometry(4.6, 7.6, 0.1), x + 2.8, 4.4, zw - s * 0.06);

    /* ---- aisle colonnade (single row mid-aisle), both storeys ---- */
    const zc = s * 22.9;
    colXs.forEach(x => {
      if (Math.abs(x) > 29) return;
      HS.column('aisle', x, zc);
      HS.column('aisleGal', x, zc, D.gFloor);
    });

    /* ---- aisle ceiling: slab + shallow gold vault caps ---- */
    const slab = new THREE.BoxGeometry(62, 0.9, D.aisleZ1 - D.R - 0.1);
    marble.add(slab, 0, 12.75, s * (D.R + (D.aisleZ1 - D.R) / 2 + 0.05));
    // vault caps hang below the slab in two lanes
    const laneZ = [s * 19.1, s * 26.6];
    const capR = 4.6, capRise = 1.5;
    for (let i = 0; i < 11; i++) {
      const cxv = -28 + i * 5.6;
      for (const lz of laneZ) {
        const cap = HS.scaleUV(HS.sphereBand(capR, capR - capRise, capR, 0, Math.PI * 2, 26, 6), 6, 2);
        cap.translate(cxv, 12.55 - capR, lz);
        goldX.raw(cap);
      }
    }
    /* transverse arch bands column → walls (ground) */
    colXs.forEach(x => {
      if (Math.abs(x) > 29) return;
      gold.add(HS.archBand(3.2, 3.65, 0.5, 0, Math.PI), x, 9.4, s * 26.75, Math.PI / 2);
      gold.add(HS.archBand(3.2, 3.65, 0.5, 0, Math.PI), x, 9.4, s * 19.1, Math.PI / 2);
    });

    /* ---- gallery floor + its ceiling ---- */
    HS.addFloor({ x0: -31, x1: 31, z0: Math.min(zw, s * D.R + s * 0.2), z1: Math.max(zw, s * D.R + s * 0.2), y: D.gFloor });
    const gSlab = new THREE.BoxGeometry(62, 0.9, D.aisleZ1 - D.R - 0.1);
    marble.add(gSlab, 0, 21.75, s * (D.R + (D.aisleZ1 - D.R) / 2 + 0.05));
    for (let i = 0; i < 11; i++) {
      const cxv = -28 + i * 5.6;
      for (const lz of laneZ) {
        const cap = HS.scaleUV(HS.sphereBand(capR, capR - 1.3, capR, 0, Math.PI * 2, 26, 6), 6, 2);
        cap.translate(cxv, 21.7 - capR, lz);
        goldX.raw(cap);
      }
    }

    /* ---- east & west end walls of the aisles ---- */
    for (const e of [-1, 1]) {
      const xw = e * 31;
      const endHoles = e < 0
        ? [{ x: s * 19.5, y: 0, w: 2.5, h: 4.6 }, { x: s * 26, y: 0, w: 2.5, h: 4.6 }]  // doors → narthex
        : [{ x: s * 20.2, y: 0.02, w: 2.2, h: 3.9 }, { x: s * 25.6, y: 0.02, w: 2.2, h: 3.9 }]; // pastophoria (blind)
      const sh = HS.wallWithHoles([[15.5, 0], [D.aisleZ1 + D.wallT, 0], [D.aisleZ1 + D.wallT, 23.4], [15.5, 23.4]].map(p => [p[0] * s, p[1]]),
        endHoles, D.wallT);
      const em = new THREE.Mesh(sh, M.proc);
      // local +X → world +Z, extrusion (+Z local) → world −X
      em.rotation.y = -Math.PI / 2;
      em.position.set(e > 0 ? xw + D.wallT : xw, 0, 0);
      world.add(em);
      HS.addBox(xw - (e > 0 ? 0 : D.wallT), xw + (e > 0 ? D.wallT : 0), s * 15.5, s * (D.aisleZ1 + 0.1), 0, 24,);
      if (e > 0) {   // bronze "doors" to the (unmodelled) pastophoria
        endHoles.forEach(h => {
          const dm = new THREE.Mesh(new THREE.PlaneGeometry(h.w - 0.2, h.h - 0.15), M.bronzeDoor);
          dm.position.set(xw - 0.15, h.h / 2, h.x);
          dm.rotation.y = -Math.PI / 2;
          world.add(dm);
        });
      } else {       // west doors punch through to the narthex: keep passable
        endHoles.forEach(h => {
          // carve walkway gap: colliders added as two boxes around each door instead
        });
      }
    }
  }

  /* fix west aisle end-wall colliders: leave the two door gaps open */
  // (replace the two solid boxes just added for e<0 by segmented ones)
  HS.colliders = HS.colliders.filter(c => !(c.kind === 'box' && Math.abs(c.x0 - (-31 - D.wallT)) < 0.01));
  for (const s of [-1, 1]) {
    const zzs = [[15.5, 18.25], [20.75, 24.75], [27.25, D.aisleZ1]];
    zzs.forEach(([z0, z1]) => HS.addBox(-31 - D.wallT, -31, s * z0, s * z1, 0, 24));
    HS.addBox(-31 - D.wallT, -31, s * 15.5, s * D.aisleZ1, 5.2, 24); // above doors
  }

  [gold, goldX, marble, book, white].forEach(b => b.flush(world));
};
