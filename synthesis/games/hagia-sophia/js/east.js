/* ============================================================
   Hagia Sophia 537 — east.js
   The sanctuary as Paul the Silentiary describes it (563):
   raised bema, silver templon screen, gold altar under its
   jewelled ciborium, the synthronon in the apse, and the great
   ambo on the nave axis joined to the bema by the solea.
   ============================================================ */
HS.buildEast = function (world) {
  const D = HS.DIM, M = HS.mats;
  const marble = HS.builder(M.proc, 'east-marble');
  const white = HS.builder(M.white, 'east-white');
  const silver = HS.builder(M.silver, 'east-silver');
  const gold = HS.builder(M.gold, 'east-gold');
  const goldX = HS.builder(M.goldCross, 'east-goldX');
  const sect = HS.builder(M.sectile, 'east-sectile');

  const AX = D.apseCX, AR = D.apseR;      // apse centre x=30.2, r=4.9

  /* ---------- apse wall (segments around 3 windows) + conch ---------- */
  {
    const springC = 15.0;                  // conch springing
    // wall: cylinder segments (θ measured like CylinderGeometry: (sinθ,cosθ))
    // bulge +X ⇒ θ ∈ [0°,180°]; windows centred θ 54°,90°,126°, half-width 13°
    const solids = [[0, 41], [67, 77], [103, 113], [139, 180]];
    solids.forEach(([a0, a1]) => {
      marble.add(HS.scaleUV(new THREE.CylinderGeometry(AR, AR, springC, 24, 1, true, HS.rad(a0), HS.rad(a1 - a0)),
        Math.max(1, (a1 - a0) / 25), 5), AX, springC / 2, 0);
    });
    // bands below sills and above arch-tops
    marble.add(HS.scaleUV(new THREE.CylinderGeometry(AR, AR, 4.6, 40, 1, true, 0, Math.PI), 7, 2), AX, 2.3, 0);
    marble.add(HS.scaleUV(new THREE.CylinderGeometry(AR, AR, springC - 11.2, 40, 1, true, 0, Math.PI), 7, 2), AX, (springC + 11.2) / 2, 0);
    // glow band behind the window zone
    const glow = new THREE.Mesh(new THREE.CylinderGeometry(AR + 0.35, AR + 0.35, 6.6, 40, 1, true, HS.rad(30), HS.rad(120)), M.glow);
    glow.position.set(AX, 7.9, 0);
    world.add(glow);
    // conch — plain gold (the crosses tile too small at this radius)
    let conch = new THREE.SphereGeometry(AR, 48, 18, 0, Math.PI, 0, Math.PI / 2);
    HS.scaleUV(conch, 4, 2);
    conch.rotateY(Math.PI / 2);            // bulge +X
    conch.translate(AX, springC, 0);
    gold.raw(conch);
    white.add(new THREE.TorusGeometry(AR - 0.05, 0.22, 6, 40, Math.PI).rotateX(Math.PI / 2).rotateY(Math.PI / 2), AX, springC, 0);
    // apse colliders (leave the sanctuary walkable inside)
    for (let i = 0; i < 6; i++) {
      const a = HS.rad(15 + i * 30);
      const px = AX + Math.sin(a) * AR, pz = Math.cos(a) * AR;
      HS.addBox(px - 0.9, px + 0.9, pz - 0.9, pz + 0.9, 0, springC);
    }
  }

  /* ---------- closure wall carrying the apse arch ----------
     (blocks the sightlines that would otherwise slip past the
     apse cylinder into the exterior shell) */
  {
    const wall = new THREE.Mesh(HS.wallWithHoles(
      [[-8.5, 0], [8.5, 0], [8.5, 22.5], [-8.5, 22.5]],
      [{ x: 0, y: 0, w: 9.8, h: 19.9 }], 1.0), M.proc);
    wall.rotation.y = -Math.PI / 2;          // local +X→+Z, extrude→−X
    wall.position.set(30.7, 0, 0);
    world.add(wall);
  }

  /* ---------- bema: raised platform, two steps ---------- */
  {
    sect.add(new THREE.BoxGeometry(8.5, D.bemaY, 11.5), 25.9, D.bemaY / 2, 0);
    sect.add(new THREE.CylinderGeometry(AR - 0.2, AR - 0.2, D.bemaY, 32, 1, false, 0, Math.PI), AX, D.bemaY / 2, 0);
    white.add(new THREE.BoxGeometry(0.55, 0.17, 11.5), 21.4, 0.085, 0);   // lower step
    HS.addFloor({ x0: 21.7, x1: 30.2 + AR, z0: -5.75, z1: 5.75, y: D.bemaY });
    HS.addFloor({ x0: 21.1, x1: 21.7, z0: -5.75, z1: 5.75, y: 0.17 });
  }

  /* ---------- synthronon: seven tiers + cathedra ---------- */
  {
    let r = AR - 0.25;
    for (let i = 0; i < 7; i++) {
      const h = 0.52;
      white.add(new THREE.CylinderGeometry(r, r, h, 40, 1, false, HS.rad(14), HS.rad(152)),
        AX, D.bemaY + h / 2 + i * h * 0.92, 0);
      r -= 0.42;
    }
    // the bishop's cathedra at the crown of the tiers
    const th = new THREE.BoxGeometry(1.1, 1.35, 0.75);
    gold.add(th, AX + 2.6, D.bemaY + 7 * 0.48 + 0.42, 0);
    // block climbing the tiers
    HS.addBox(AX - 2.4, AX + AR, -AR, AR, D.bemaY, 6);
  }

  /* ---------- templon: the silver chancel screen ---------- */
  {
    const TX = 23.4;                        // screen line
    HS.columnType('templon', { r: 0.21, h: 3.55, mat: M.silver, collide: false });
    // stylobate
    white.add(new THREE.BoxGeometry(0.9, 0.62, 12.2), TX, D.bemaY + 0.31, 0);
    // 8 columns, 3 door gaps (centre + two side)
    const zs = [-5.5, -4.0, -2.5, -1.15, 1.15, 2.5, 4.0, 5.5];
    zs.forEach(z => HS.column('templon', TX, z, D.bemaY + 0.62));
    // architrave with Justinian & Theodora medallions
    silver.add(new THREE.BoxGeometry(1.05, 0.6, 12.4), TX, D.bemaY + 0.62 + 3.55 + 0.3, 0);
    for (let i = 0; i < 7; i++) {
      const disc = new THREE.CylinderGeometry(0.24, 0.24, 0.1, 16).rotateZ(Math.PI / 2);
      silver.add(disc, TX - 0.55, D.bemaY + 0.62 + 3.55 + 0.3, -4.6 + i * 1.53);
    }
    // closure slabs between columns (not across the 3 doors)
    [[-5.5, -4.0], [-4.0, -2.5], [2.5, 4.0], [4.0, 5.5]].forEach(([z0, z1]) => {
      silver.add(new THREE.BoxGeometry(0.14, 1.5, z1 - z0 - 0.3), TX, D.bemaY + 0.62 + 0.75, (z0 + z1) / 2);
      HS.addBox(TX - 0.3, TX + 0.3, z0, z1, 0, 2.6);
    });
    // side closures beyond the last columns
    [[-6.1, -5.5], [5.5, 6.1]].forEach(([z0, z1]) => {
      silver.add(new THREE.BoxGeometry(0.14, 1.5, z1 - z0), TX, D.bemaY + 0.62 + 0.75, (z0 + z1) / 2);
      HS.addBox(TX - 0.3, TX + 0.3, z0, z1, 0, 2.6);
    });
    // low bronze gates in the two side doors (centre Holy Door left open)
    [[-2.5, -1.15], [1.15, 2.5]].forEach(([z0, z1]) => {
      const g = new THREE.Mesh(new THREE.PlaneGeometry(z1 - z0 - 0.2, 1.15), M.bronzeDoor);
      g.position.set(TX, D.bemaY + 0.62 + 0.58, (z0 + z1) / 2);
      g.rotation.y = Math.PI / 2;
      world.add(g);
      HS.addBox(TX - 0.25, TX + 0.25, z0, z1, 0, 1.9);
    });
  }

  /* ---------- altar + ciborium ---------- */
  {
    const ALT = 26.6;
    gold.add(new THREE.BoxGeometry(1.9, 0.16, 1.25), ALT, D.bemaY + 1.02, 0);
    marble.add(new THREE.BoxGeometry(1.6, 0.94, 0.95), ALT, D.bemaY + 0.47, 0);
    HS.addBox(ALT - 1.0, ALT + 1.0, -0.7, 0.7, 0, 2.2);
    HS.columnType('cibor', { r: 0.26, h: 4.3, mat: M.silver, collide: true });
    for (const kx of [-1, 1]) for (const kz of [-1, 1])
      HS.column('cibor', ALT + kx * 1.45, kz * 1.15, D.bemaY);
    // pyramidal canopy of silver, orb + cross at the peak
    const pyr = new THREE.ConeGeometry(2.15, 2.1, 4, 1, false);
    pyr.rotateY(Math.PI / 4);
    silver.add(pyr, ALT, D.bemaY + 4.3 + 1.05, 0);
    silver.add(new THREE.SphereGeometry(0.22, 12, 8), ALT, D.bemaY + 6.6, 0);
    const crossV = new THREE.BoxGeometry(0.08, 0.75, 0.08);
    const crossH = new THREE.BoxGeometry(0.45, 0.08, 0.08);
    gold.add(crossV, ALT, D.bemaY + 7.15, 0); gold.add(crossH, ALT, D.bemaY + 7.25, 0);
  }

  /* ---------- solea: raised walk from bema to ambo ---------- */
  {
    const x0 = 11.9, x1 = 21.4;
    sect.add(new THREE.BoxGeometry(x1 - x0, D.bemaY, 2.9), (x0 + x1) / 2, D.bemaY / 2, 0);
    HS.addFloor({ x0, x1, z0: -1.45, z1: 1.45, y: D.bemaY });
    for (const s of [-1, 1]) {
      white.add(new THREE.BoxGeometry(x1 - x0, 0.95, 0.14), (x0 + x1) / 2, D.bemaY + 0.475, s * 1.38);
      HS.addBox(x0, x1, s * 1.31, s * 1.45, 0, D.bemaY + 0.95);
    }
  }

  /* ---------- the great ambo ---------- */
  {
    const AMB = 8.3;                        // platform centre
    HS.columnType('ambo', { r: 0.19, h: 2.85, mat: M.porphyry, collide: true });
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2 + Math.PI / 8;
      HS.column('ambo', AMB + Math.cos(a) * 1.95, Math.sin(a) * 1.45, 0);
    }
    // oval platform
    const plat = new THREE.CylinderGeometry(2.6, 2.6, 0.35, 28);
    plat.scale(1.15, 1, 0.82);
    marble.add(plat, AMB, 3.02, 0);
    // parapet ring on top
    const pr = new THREE.CylinderGeometry(2.5, 2.5, 0.95, 28, 1, true);
    pr.scale(1.15, 1, 0.82);
    white.add(pr, AMB, 3.2 + 0.475, 0);
    HS.addFloor({ circle: { x: AMB, z: 0, r: 2.3 }, y: 3.2 });
    // stairs east (from solea) & west (to nave floor)
    for (const e of [-1, 1]) {
      const runX0 = AMB + e * 2.35, runX1 = AMB + e * (2.35 + 3.6);
      const st = 8;
      for (let i = 0; i < st; i++) {
        const h = 3.2 - i * (3.2 - (e > 0 ? D.bemaY : 0)) / st;
        white.add(new THREE.BoxGeometry(3.6 / st + 0.02, h, 1.9),
          runX0 + e * (i + 0.5) * 3.6 / st, h / 2, 0);
      }
      HS.addFloor({
        x0: Math.min(runX0, runX1), x1: Math.max(runX0, runX1), z0: -0.95, z1: 0.95,
        y: 3.2, ramp: { axis: 'x', from: runX0, to: runX1, y0: 3.2, y1: e > 0 ? D.bemaY : 0 }
      });
      // stair parapets
      for (const s of [-1, 1]) {
        const pg = new THREE.BoxGeometry(3.9, 1.0, 0.12);
        pg.translate(0, 0, 0);
        const mesh = new THREE.Mesh(pg, M.parapet);
        mesh.position.set(AMB + e * (2.35 + 1.8), (3.2 + (e > 0 ? D.bemaY : 0)) / 2 + 0.85, s * 1.0);
        mesh.rotation.z = -e * Math.atan2(3.2 - (e > 0 ? D.bemaY : 0), 3.6);
        world.add(mesh);
        HS.addBox(AMB + e * 2.35, AMB + e * 5.95, s * 0.93, s * 1.07, 0, 4.4);
      }
    }
  }

  [marble, white, silver, gold, goldX, sect].forEach(b => b.flush(world));
};
