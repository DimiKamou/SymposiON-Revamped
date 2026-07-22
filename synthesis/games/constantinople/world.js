/* ============================================================
   Κωνσταντινούπολις 330–1453 — geometry + era logic.
   Stylised diorama, 1 unit ≈ 10 m. Era groups toggled by setEra.
   ============================================================ */
(function () {
  const A = window.XP_APP;
  const G = {};                    // era-toggled groups

  A.buildWorld = function (world, XP) {
    const M = {
      sea:   new THREE.MeshStandardMaterial({ color: 0x1f4a66, metalness: 0.35, roughness: 0.25 }),
      land:  new THREE.MeshStandardMaterial({ color: 0xb3a179, roughness: 0.95 }),
      land2: new THREE.MeshStandardMaterial({ color: 0x9c8f6a, roughness: 0.95 }),
      wall:  new THREE.MeshStandardMaterial({ color: 0xd8cfb4, roughness: 0.8 }),
      roof:  new THREE.MeshStandardMaterial({ color: 0xa4593a, roughness: 0.85 }),
      house: new THREE.MeshStandardMaterial({ color: 0xcbbd9e, roughness: 0.9 }),
      marble:new THREE.MeshStandardMaterial({ color: 0xe8e2d2, roughness: 0.55 }),
      lead:  new THREE.MeshStandardMaterial({ color: 0x8f979f, metalness: 0.3, roughness: 0.5 }),
      gold:  new THREE.MeshStandardMaterial({ color: 0xd9b45c, metalness: 0.85, roughness: 0.3 }),
      porph: new THREE.MeshStandardMaterial({ color: 0x5e3140, roughness: 0.5 }),
      bronze:new THREE.MeshStandardMaterial({ color: 0x7a5a2e, metalness: 0.75, roughness: 0.45 }),
      gran:  new THREE.MeshStandardMaterial({ color: 0x9a6553, roughness: 0.8 }),
      dark:  new THREE.MeshStandardMaterial({ color: 0x4a4238, roughness: 0.9 }),
      green: new THREE.MeshStandardMaterial({ color: 0x51663d, roughness: 0.95 }),
      tent:  new THREE.MeshStandardMaterial({ color: 0xe3d7b8, roughness: 0.9 }),
      red:   new THREE.MeshStandardMaterial({ color: 0x9c2020, roughness: 0.7, side: THREE.DoubleSide }),
      sailW: new THREE.MeshStandardMaterial({ color: 0xe9e2cc, roughness: 0.8, side: THREE.DoubleSide }),
      smoke: new THREE.MeshBasicMaterial({ color: 0x2c2620, transparent: true, opacity: 0.55, fog: false }),
      burn:  new THREE.MeshBasicMaterial({ color: 0x1c1613, transparent: true, opacity: 0.6 })
    };

    /* ---------- sea + land ---------- */
    const sea = new THREE.Mesh(new THREE.PlaneGeometry(1400, 1000), M.sea);
    sea.rotation.x = -Math.PI / 2; sea.position.y = 0; world.add(sea);

    function landShape(pts) {
      const sh = new THREE.Shape();
      pts.forEach((p, i) => i ? sh.lineTo(p[0], p[1]) : sh.moveTo(p[0], p[1]));
      sh.closePath();
      const g = new THREE.ExtrudeGeometry(sh, { depth: 1.4, bevelEnabled: false });
      g.rotateX(-Math.PI / 2);           // shape (x,z') → ground plane, top at y=1.4
      return g;
    }
    // peninsula (x, z): z drawn negative-north / positive-south, shape uses (x, -z)
    const PEN = [[-255, -155], [-40, -128], [60, -120], [160, -95], [230, -60], [258, -32],
                 [245, 12], [212, 56], [140, 82], [60, 100], [-40, 112], [-150, 148], [-258, 165]];
    const GAL = [[118, -202], [232, -196], [238, -122], [148, -118]];
    world.add(new THREE.Mesh(landShape(PEN.map(p => [p[0], -p[1]])), M.land));
    world.add(new THREE.Mesh(landShape(GAL.map(p => [p[0], -p[1]])), M.land2));
    // Thracian mainland west of the walls
    world.add(new THREE.Mesh(landShape([[-620, -240], [-255, -170], [-262, 180], [-620, 260]].map(p => [p[0], -p[1]])), M.land2));
    XP.addFloor({ x0: -620, x1: 258, z0: -240, z1: 260, y: 1.4 });

    /* ---------- reusable minis ---------- */
    const houseGeo = (function () {
      const b = new THREE.BoxGeometry(3.4, 2.2, 2.6); b.translate(0, 1.1, 0);
      const r = new THREE.CylinderGeometry(0.01, 2.05, 1.4, 4); r.rotateY(Math.PI / 4);
      r.scale(0.86, 1, 0.66); r.translate(0, 2.9, 0);
      return { b, r };
    })();
    function houseField(group, rnd, count, inZone) {
      const bs = [], rs = [];
      let tries = 0;
      while (bs.length / 1 < count && tries++ < count * 30) {
        const x = -250 + rnd() * 500, z = -150 + rnd() * 300;
        if (!inZone(x, z)) continue;
        const s = 0.7 + rnd() * 0.9, rot = rnd() * Math.PI;
        const m = new THREE.Matrix4().compose(
          new THREE.Vector3(x, 1.4, z),
          new THREE.Quaternion().setFromEuler(new THREE.Euler(0, rot, 0)),
          new THREE.Vector3(s, s, s));
        bs.push(m); rs.push(m);
      }
      const ib = new THREE.InstancedMesh(houseGeo.b, M.house, bs.length);
      const ir = new THREE.InstancedMesh(houseGeo.r, M.roof, rs.length);
      bs.forEach((m, i) => { ib.setMatrixAt(i, m); ir.setMatrixAt(i, m); });
      group.add(ib, ir);
    }
    function pip(poly, x, z) {          // point-in-polygon (ray cast)
      let inside = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i][0], zi = poly[i][1], xj = poly[j][0], zj = poly[j][1];
        if ((zi > z) !== (zj > z) && x < (xj - xi) * (z - zi) / (zj - zi) + xi) inside = !inside;
      }
      return inside;
    }
    function inland(poly, x, z, m) {    // strictly inside, ≥ m units from every coast
      return pip(poly, x, z) && pip(poly, x - m, z) && pip(poly, x + m, z)
          && pip(poly, x, z - m) && pip(poly, x, z + m);
    }
    const EXCL = [[190, 0, 7.5], [52, 8, 9.5], [-75, -70, 10], [-135, -85, 9], [203, 20, 6.5], [-205, 75, 6]];
    function inPeninsula(x, z) {
      if (!inland(PEN, x, z, 7)) return false;
      if (Math.abs(z - 8) < 5 && x > -220) return false;          // keep the Mese clear
      for (const [ex, ez, er] of EXCL)                            // plazas, cisterns, baths
        if ((x - ex) * (x - ex) + (z - ez) * (z - ez) < er * er) return false;
      return true;
    }

    function domedChurch(b, x, z, s, domeB) {
      const base = new THREE.BoxGeometry(6 * s, 3.6 * s, 6 * s); base.translate(0, 1.8 * s, 0);
      b.add(base, x, 1.4, z);
      const dome = new THREE.SphereGeometry(2.4 * s, 14, 8, 0, Math.PI * 2, 0, Math.PI / 2);
      (domeB || bLead).add(dome, x, 1.4 + 3.6 * s, z);
    }

    function wallLine(builder, x0, z0, x1, z1, h, t, towerEvery, towerH) {
      const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
      const yaw = Math.atan2(dx, dz) + Math.PI / 2;   // wall runs along its local X
      const g = new THREE.BoxGeometry(len, h, t);
      builder.add(g, (x0 + x1) / 2, 1.4 + h / 2, (z0 + z1) / 2, yaw);
      const n = Math.floor(len / towerEvery);
      for (let i = 0; i <= n; i++) {
        const k = i / Math.max(1, n);
        const tw = new THREE.CylinderGeometry(t * 0.9, t * 1.05, towerH, 8);
        builder.add(tw, x0 + dx * k, 1.4 + towerH / 2, z0 + dz * k);
      }
      XP.addBox(Math.min(x0, x1) - t, Math.max(x0, x1) + t, Math.min(z0, z1) - t, Math.max(z0, z1) + t, 0, 1.4 + h);
    }

    function ships(group, list, sailMat) {
      const hull = new THREE.BoxGeometry(5.4, 1.1, 1.7); hull.translate(0, 0.55, 0);
      const mast = new THREE.CylinderGeometry(0.09, 0.09, 4.4, 6); mast.translate(0, 2.8, 0);
      const sail = new THREE.PlaneGeometry(2.6, 2.9); sail.translate(0, 3.1, 0.05);
      const geo = XP.mergeGeoms([hull, mast]);
      list.forEach(p => {
        const m1 = new THREE.Mesh(geo, M.dark), m2 = new THREE.Mesh(sail, sailMat);
        m1.position.set(p[0], p[3] || 0, p[1]); m1.rotation.y = p[2];
        m2.position.copy(m1.position); m2.rotation.y = p[2];
        group.add(m1, m2);
      });
    }

    /* ---------- persistent core (all eras) ---------- */
    const bWall = XP.builder(M.wall, 'walls'), bMarble = XP.builder(M.marble),
          bLead = XP.builder(M.lead), bGold = XP.builder(M.gold),
          bDark = XP.builder(M.dark), bPorph = XP.builder(M.porph);

    // Mese street ribbons
    bDark.add(new THREE.BoxGeometry(410, 0.25, 3.4), -20, 1.45, 8);
    bDark.add(new THREE.BoxGeometry(3.4, 0.25, 0.1), 0, 0, 0); // (spacer, negligible)
    { // SW branch to the Golden Gate
      const dx = -238 - (-30), dz = 96 - 10, len = Math.hypot(dx, dz);
      const g = new THREE.BoxGeometry(len, 0.25, 3);
      bDark.add(g, (-30 + -238) / 2, 1.45, (10 + 96) / 2, Math.atan2(dx, dz) + Math.PI / 2);
    }

    /* ══ ERA GROUPS ══ */
    for (const k of ['constantine', 'theod', 'hsBasilica', 'just', 'maced', 'sack', 'late', 'ottoman', 'denseC', 'denseB', 'denseX', 'galata', 'horses', 'chainWorks', 'chain', 'chainBrk'])
      { G[k] = new THREE.Group(); world.add(G[k]); }

    /* — era 0+: Constantine — */
    {
      const b = XP.builder(M.wall);
      wallLine(b, -52, -128, -70, 142, 5, 2.2, 26, 8);          // Constantinian wall
      // Hippodrome (U opens north): two stands + sphendone
      const stand = new THREE.BoxGeometry(38, 4.5, 5);
      b.add(stand, 172, 1.4 + 2.25, 12, 0); b.add(stand, 172, 1.4 + 2.25, 30, 0);
      const sph = new THREE.CylinderGeometry(11, 11, 4.5, 20, 1, false, 0, Math.PI);
      b.add(sph, 153, 1.4 + 2.25, 21, -Math.PI / 2);
      b.add(new THREE.BoxGeometry(3, 3.6, 22), 192.5, 1.4 + 1.8, 21);   // carceres (start gates)
      // spina: the Serpent Column of Delphi (Constantine's Plataia trophy)
      const bBr = XP.builder(M.bronze);
      bBr.add(new THREE.CylinderGeometry(0.34, 0.46, 1.8, 8), 168, 1.4 + 0.9, 21);
      bBr.add(new THREE.CylinderGeometry(0.24, 0.34, 1.6, 8), 168.12, 1.4 + 2.55, 21);
      bBr.add(new THREE.CylinderGeometry(0.15, 0.24, 1.5, 8), 168, 1.4 + 4.05, 20.9);
      for (const a of [-0.7, 0, 0.7])
        bBr.add(new THREE.SphereGeometry(0.2, 8, 6), 168 + Math.sin(a) * 0.45, 1.4 + 4.95, 21 - 0.45 + Math.abs(a) * 0.3);
      bBr.flush(G.constantine);
      // kathisma (imperial box) + the Milion tetrapylon
      b.add(new THREE.BoxGeometry(4.6, 5.5, 3.6), 172, 1.4 + 2.75, 34.4);
      bGold.add(new THREE.SphereGeometry(1.4, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), 172, 1.4 + 5.5, 34.4);
      for (const [mx, mz] of [[185.5, 6.5], [188.5, 6.5], [185.5, 9.5], [188.5, 9.5]])
        bMarble.add(new THREE.CylinderGeometry(0.16, 0.16, 3.4, 6), mx, 1.4 + 1.7, mz);
      bMarble.add(new THREE.BoxGeometry(4.2, 0.7, 4.2), 187, 1.4 + 3.75, 8);
      // Great Palace terraces
      const t1 = new THREE.BoxGeometry(26, 5, 20), t2 = new THREE.BoxGeometry(20, 4, 14), t3 = new THREE.BoxGeometry(14, 3, 10);
      b.add(t1, 196, 1.4 + 2.5, 38); b.add(t2, 202, 1.4 + 2, 50); b.add(t3, 206, 1.4 + 1.5, 57);
      bGold.add(new THREE.SphereGeometry(3.2, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), 196, 1.4 + 5, 38); // Chrysotriklinos-ish
      // Forum of Constantine + porphyry column
      bMarble.add(new THREE.CylinderGeometry(9, 9, 0.5, 24), 148, 1.65, 8);
      bPorph.add(new THREE.CylinderGeometry(0.9, 1.05, 11, 10), 148, 1.4 + 5.5, 8);
      bGold.add(new THREE.SphereGeometry(0.9, 8, 6), 148, 1.4 + 11.4, 8);
      // the colonnaded porticoes of the Mese (both branches)
      XP.columnType('stoa', { profile: 'doric', r: 0.14, h: 1.6, taper: 0.85, mat: M.marble, capMat: M.marble, capH: 0.14, seg: 6, collide: false });
      for (let sx = -218; sx <= 182; sx += 5)
        for (const so of [-2.6, 2.6]) XP.column('stoa', sx, 8 + so, 1.4);
      b.add(new THREE.BoxGeometry(402, 0.12, 1.7), -18, 1.4 + 1.62, 8 - 2.6);
      b.add(new THREE.BoxGeometry(402, 0.12, 1.7), -18, 1.4 + 1.62, 8 + 2.6);
      {
        const nx = 0.382, nz = 0.924, yawB = Math.atan2(-208, 86) + Math.PI / 2;
        for (let t = 0.03; t < 0.99; t += 0.027) {
          const bx = -30 - 208 * t, bz = 10 + 86 * t;
          for (const s of [-1, 1]) XP.column('stoa', bx + s * nx * 2.4, bz + s * nz * 2.4, 1.4);
        }
        for (const s of [-1, 1])
          b.add(new THREE.BoxGeometry(224, 0.12, 1.7), -134 + s * nx * 2.4, 1.4 + 1.62, 53 + s * nz * 2.4, yawB);
      }
      // Augoustaion square + the baths of Zeuxippos
      bMarble.add(new THREE.CylinderGeometry(6.5, 6.5, 0.22, 20), 190, 1.51, 0);
      b.add(new THREE.BoxGeometry(9, 4, 7), 203, 1.4 + 2, 20);
      bLead.add(new THREE.SphereGeometry(1.8, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2), 201.5, 1.4 + 4, 18.5);
      bLead.add(new THREE.SphereGeometry(1.3, 10, 5, 0, Math.PI * 2, 0, Math.PI / 2), 205, 1.4 + 4, 22);
      XP.label('Αὐγουσταῖον', 190, 9, 0, 0.6);
      XP.label('Ζεύξιππον', 203, 10.5, 20, 0.55);
      // old Byzantion acropolis point: two temples
      bMarble.add(new THREE.BoxGeometry(7, 3, 4.6), 226, 1.4 + 1.5, -38);
      bMarble.add(new THREE.BoxGeometry(5.4, 2.6, 3.6), 234, 1.4 + 1.3, -28);
      b.flush(G.constantine);
      houseField(G.denseC, XP.rng(101), 420, (x, z) => x > -48 && inPeninsula(x, z));
      XP.label('Ἱππόδρομος', 172, 22, 21, 0.9); XP.label('Μέγα Παλάτιον', 200, 20, 48, 0.9);
      XP.label('Φόρος Κωνσταντίνου', 148, 24, 8, 0.85);
    }

    /* — era 1+: Theodosius — */
    {
      const b = XP.builder(M.wall);
      wallLine(b, -235, -152, -242, 162, 7, 2.6, 18, 11);       // inner wall
      wallLine(b, -248, -150, -255, 160, 3.5, 1.6, 18, 5.5);    // outer wall
      const moat = new THREE.BoxGeometry(6, 0.5, 316);
      G.theod.add(new THREE.Mesh(moat, M.green));
      G.theod.children[G.theod.children.length - 1].position.set(-263, 1.2, 4);
      G.theod.children[G.theod.children.length - 1].rotation.y = 0.02;
      // Golden Gate
      const bm1 = XP.builder(M.marble), bg1 = XP.builder(M.gold);
      bm1.add(new THREE.BoxGeometry(9, 8, 4), -239, 1.4 + 4, 96);
      bm1.add(new THREE.BoxGeometry(3.4, 10, 4.4), -245, 1.4 + 5, 96);
      bm1.add(new THREE.BoxGeometry(3.4, 10, 4.4), -233, 1.4 + 5, 96);
      bg1.add(new THREE.BoxGeometry(2.2, 3.4, 0.5), -239, 1.4 + 1.8, 94.2);
      // spina: the obelisk of Theodosius (raised 390 on its sculpted base)
      bm1.add(new THREE.BoxGeometry(1.9, 1.5, 1.9), 176, 1.4 + 0.75, 21);
      const bGr = XP.builder(M.gran);
      const obl = new THREE.CylinderGeometry(0.34, 0.5, 5.6, 4); obl.rotateY(Math.PI / 4);
      bGr.add(obl, 176, 1.4 + 1.5 + 2.8, 21); bGr.flush(G.theod);
      bg1.add(new THREE.ConeGeometry(0.4, 0.7, 4), 176, 1.4 + 7.45, 21);
      // Forum Tauri (Theodosius, 393): plaza, spiral column, triumphal arch
      bm1.add(new THREE.CylinderGeometry(8, 8, 0.4, 20), 52, 1.6, 8);
      bm1.add(new THREE.CylinderGeometry(0.75, 0.9, 9, 10), 52, 1.4 + 4.5, 8);
      bg1.add(new THREE.BoxGeometry(0.5, 0.9, 0.5), 52, 1.4 + 9.5, 8);
      bm1.add(new THREE.BoxGeometry(1.4, 5, 1.4), 44, 1.4 + 2.5, 5.2);
      bm1.add(new THREE.BoxGeometry(1.4, 5, 1.4), 44, 1.4 + 2.5, 10.8);
      bm1.add(new THREE.BoxGeometry(1.4, 1.4, 8.4), 44, 1.4 + 5.7, 8);
      // columns of Arcadius (403, on the SW branch) and Marcian (~455)
      bm1.add(new THREE.CylinderGeometry(0.7, 0.85, 8.5, 10), -146, 1.4 + 4.25, 64);
      bg1.add(new THREE.BoxGeometry(0.45, 0.8, 0.45), -146, 1.4 + 9, 64);
      bm1.add(new THREE.CylinderGeometry(0.5, 0.6, 6, 10), 30, 1.4 + 3, -25);
      // monastery of Stoudios (462) inland of the Golden Gate
      bm1.add(new THREE.BoxGeometry(7, 3.2, 4.6), -205, 1.4 + 1.6, 75);
      bm1.add(new THREE.BoxGeometry(7.4, 0.9, 1.2), -205, 1.4 + 3.6, 75);
      // the great open cisterns of Aspar and Aetius
      for (const [cxr, czr, s] of [[-75, -70, 16], [-135, -85, 14]]) {
        bm1.add(new THREE.BoxGeometry(s + 1.6, 1.2, 0.8), cxr, 1.4 + 0.6, czr - s / 2);
        bm1.add(new THREE.BoxGeometry(s + 1.6, 1.2, 0.8), cxr, 1.4 + 0.6, czr + s / 2);
        bm1.add(new THREE.BoxGeometry(0.8, 1.2, s + 1.6), cxr - s / 2, 1.4 + 0.6, czr);
        bm1.add(new THREE.BoxGeometry(0.8, 1.2, s + 1.6), cxr + s / 2, 1.4 + 0.6, czr);
        const w = new THREE.Mesh(new THREE.PlaneGeometry(s - 0.6, s - 0.6), M.sea);
        w.rotation.x = -Math.PI / 2; w.position.set(cxr, 2.25, czr);
        G.theod.add(w);
      }
      bm1.flush(G.theod); bg1.flush(G.theod);
      XP.label('Φόρον Ταύρου', 52, 14, 8, 0.7);
      G.theod.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      XP.label('Στήλη Ἀρκαδίου', -146, 13.5, 64, 0.55);
      G.theod.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      XP.label('Μονὴ Στουδίου', -205, 9.5, 75, 0.6);
      G.theod.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      XP.label('Κινστέρνα Ἄσπαρος', -75, 8.5, -70, 0.55);
      G.theod.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      XP.label('Κινστέρνα Ἀετίου', -135, 8.5, -85, 0.55);
      G.theod.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      // Aqueduct of Valens
      for (let i = 0; i < 20; i++) {
        const x = 58 - i * 5.2;
        b.add(new THREE.BoxGeometry(1.6, 8.5, 2), x, 1.4 + 4.25, -12 + i * 0.25);
      }
      b.add(new THREE.BoxGeometry(104, 1.6, 2.4), 8.6, 1.4 + 9.1, -9.6, 0.048);
      // Theodosian harbour + Julian harbour moles
      b.add(new THREE.BoxGeometry(26, 2, 3), 20, 1, 110, 0.5);
      b.add(new THREE.BoxGeometry(20, 2, 3), 122, 1, 92, 0.4);
      b.flush(G.theod);
      houseField(G.denseB, XP.rng(202), 340, (x, z) => x <= -48 && x > -228 && inPeninsula(x, z));
      XP.label('Θεοδοσιανά Τείχη', -238, 30, -20, 1.05);
      XP.label('Χρυσή Πύλη', -239, 20, 96, 0.8);
      XP.label('Ὑδραγωγεῖον Οὐάλεντος', 8, 20, -11, 0.85);
    }

    /* — Hagia Sophia: basilica (eras 1 only) vs domed (2+) — */
    {
      const b = XP.builder(M.marble);
      b.add(new THREE.BoxGeometry(16, 6, 9), 195, 1.4 + 3, -8);
      const gable = new THREE.CylinderGeometry(0.01, 6.4, 3.4, 3); gable.rotateZ(Math.PI / 2); gable.rotateY?.(0);
      b.add(new THREE.BoxGeometry(16.4, 1.6, 1.2), 195, 1.4 + 6.6, -8);
      b.flush(G.hsBasilica);
    }
    {
      const b = XP.builder(M.marble), bl = XP.builder(M.lead), bg = XP.builder(M.gold);
      b.add(new THREE.BoxGeometry(15, 7.5, 12), 195, 1.4 + 3.75, -8);
      bl.add(new THREE.SphereGeometry(4.4, 18, 9, 0, Math.PI * 2, 0, Math.PI / 2), 195, 1.4 + 7.2, -8);
      bl.add(new THREE.SphereGeometry(3.1, 14, 7, 0, Math.PI, 0, Math.PI / 2).rotateY(Math.PI / 2), 202.4, 1.4 + 5.8, -8);
      bl.add(new THREE.SphereGeometry(3.1, 14, 7, 0, Math.PI, 0, Math.PI / 2).rotateY(-Math.PI / 2), 187.6, 1.4 + 5.8, -8);
      bg.add(new THREE.BoxGeometry(0.25, 1.6, 0.25), 195, 1.4 + 12.2, -8);
      b.flush(G.just); bl.flush(G.just); bg.flush(G.just);
      // Hagia Eirene + Sergius&Bacchus + Holy Apostles (Justinian rebuild)
      const b2 = XP.builder(M.marble), bl2 = XP.builder(M.lead);
      domedChurch(b2, 208, -22, 0.9, bl2); domedChurch(b2, 186, 52, 0.8, bl2); domedChurch(b2, -18, -52, 1.1, bl2);
      // Boukoleon: the palace harbour front on the Marmara
      b2.add(new THREE.BoxGeometry(10, 4.2, 4.6), 200, 1.4 + 2.1, 58.5);
      b2.add(new THREE.BoxGeometry(13, 1.1, 2.6), 200, 1.4 + 0.55, 61.4);
      // the column of Justinian on the Augoustaion (543) — Prokopios' horseman
      b2.add(new THREE.CylinderGeometry(0.55, 0.7, 10, 10), 190, 1.4 + 5, 0);
      bg.add(new THREE.BoxGeometry(0.95, 0.32, 0.3), 190, 1.4 + 10.45, 0);
      bg.add(new THREE.SphereGeometry(0.17, 6, 5), 190.45, 1.4 + 10.72, 0);
      bg.add(new THREE.BoxGeometry(0.17, 0.5, 0.17), 190, 1.4 + 10.85, 0);
      b2.flush(G.just); bl2.flush(G.just); bg.flush(G.just);
      XP.label('Ἁγία Σοφία', 195, 26, -8, 1.1);
      XP.label('Βουκολέων', 200, 11, 59, 0.55);
      G.just.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      XP.label('Στήλη Ἰουστινιανοῦ', 190, 15, 0, 0.55);
      G.just.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
    }

    /* — era 3+: apogee — */
    {
      houseField(G.denseX, XP.rng(303), 200, (x, z) => inPeninsula(x, z));
      const b = XP.builder(M.marble), bl3 = XP.builder(M.lead);
      for (const [x, z, s] of [[80, -40, 0.8], [40, 60, 0.75], [-80, 30, 0.85], [-140, -40, 0.8], [-60, -80, 0.75], [120, 30, 0.7]])
        domedChurch(b, x, z, s, bl3);
      // Blachernae palace NW
      b.add(new THREE.BoxGeometry(16, 8, 10), -206, 1.4 + 4, -132);
      b.add(new THREE.BoxGeometry(10, 11, 8), -196, 1.4 + 5.5, -138);
      // Pharos beacon tower over the palace + the Walled Obelisk on the spina
      b.add(new THREE.CylinderGeometry(0.9, 1.2, 7, 8), 207, 1.4 + 3.5, 52);
      const wob = new THREE.CylinderGeometry(0.3, 0.62, 5.2, 4); wob.rotateY(Math.PI / 4);
      b.add(wob, 160, 1.4 + 3.1, 21);
      b.add(new THREE.BoxGeometry(1.5, 1.0, 1.5), 160, 1.4 + 0.5, 21);
      b.flush(G.maced); bl3.flush(G.maced);
      const bg3 = XP.builder(M.gold);
      bg3.add(new THREE.SphereGeometry(0.5, 8, 6), 207, 1.4 + 7.4, 52);
      bg3.flush(G.maced);
      houseField(G.galata, XP.rng(404), 80, (x, z) => inland(GAL, x, z, 6));
      XP.label('Βλαχέρναι', -201, 26, -134, 0.85);
      XP.label('Γαλατᾶς', 185, 22, -160, 0.85);
    }

    /* — era 4 only: the 1204 sack — */
    {
      const rnd = XP.rng(500);
      for (let i = 0; i < 9; i++) {
        const x = 40 + rnd() * 150, z = -95 + rnd() * 120;
        const scorch = new THREE.Mesh(new THREE.CircleGeometry(8 + rnd() * 8, 16), M.burn);
        scorch.rotation.x = -Math.PI / 2; scorch.position.set(x, 1.62, z);
        G.sack.add(scorch);
        const plume = new THREE.Mesh(new THREE.CylinderGeometry(2.5 + rnd() * 2, 0.8, 26 + rnd() * 14, 8, 1, true), M.smoke);
        plume.position.set(x, 1.4 + 15, z);
        G.sack.add(plume);
      }
      ships(G.sack, [[150, -105, 1.2], [138, -98, 1.4], [162, -112, 1.1], [128, -90, 1.5], [174, -118, 1.0]], M.sailW);
      XP.label('1204 — πυρκαϊαί', 110, 40, -60, 0.95);
      G.sack.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);  // era-bound label
    }

    /* — era 5: 1453 — */
    {
      const rnd = XP.rng(600);
      // Ottoman camp west of the walls
      const tentG = new THREE.ConeGeometry(2.2, 3, 8);
      const tents = new THREE.InstancedMesh(tentG, M.tent, 130);
      for (let i = 0; i < 130; i++) {
        const x = -285 - rnd() * 55, z = -120 + rnd() * 250;
        tents.setMatrixAt(i, new THREE.Matrix4().compose(
          new THREE.Vector3(x, 1.4 + 1.5, z), new THREE.Quaternion(),
          new THREE.Vector3(0.8 + rnd() * 0.7, 0.8 + rnd() * 0.6, 0.8 + rnd() * 0.7)));
      }
      G.ottoman.add(tents);
      // the sultan's tent + the great bombard
      const st = new THREE.Mesh(new THREE.ConeGeometry(5, 6, 10), M.red);
      st.position.set(-300, 1.4 + 3, 10); G.ottoman.add(st);
      const bomb = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.6, 9, 10), M.dark);
      bomb.rotation.z = Math.PI / 2 - 0.12; bomb.rotation.y = 0.15;
      bomb.position.set(-262, 3.4, 8); G.ottoman.add(bomb);
      // banners
      for (const [x, z] of [[-262, 2], [-262, 14], [-300, 4], [-278, -60], [-278, 80]]) {
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 7, 5), M.dark);
        p.position.set(x, 1.4 + 3.5, z); G.ottoman.add(p);
        const f = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.5), M.red);
        f.position.set(x + 1.3, 1.4 + 6, z); G.ottoman.add(f);
      }
      // fleet in the Marmara + ships hauled overland behind Galata
      ships(G.ottoman, [[60, 150, 0.3], [90, 145, 0.2], [30, 160, 0.4], [120, 140, 0.25], [0, 170, 0.5], [155, -70, 2.2], [140, -78, 2.3]], M.sailW);
      ships(G.ottoman, [[248, -150, 1.9, 1.4], [258, -140, 1.9, 1.4], [268, -130, 1.9, 1.4]], M.red); // on land!
      XP.label('Ὀθωμανικὸν στρατόπεδον', -295, 30, -30, 0.95);
      G.ottoman.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      // Galata tower (built by the Genoese, 1348)
      const gt = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.6, 12, 12), M.wall);
      gt.position.set(185, 1.4 + 6, -152); G.late.add(gt);
      const gtc = new THREE.Mesh(new THREE.ConeGeometry(2.8, 3, 12), M.lead);
      gtc.position.set(185, 1.4 + 13.5, -152); G.late.add(gtc);
      XP.label('Πύργος Γαλατᾶ', 185, 20, -152, 0.65);
      G.late.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
    }

    /* — the chain of the Golden Horn (attested from 717; rammed open 1203) — */
    {
      const CT = [227, -57], KT = [206, -122];       // tower of Eugenios · the Kastellion
      const bT = XP.builder(M.wall);
      bT.add(new THREE.BoxGeometry(4, 7, 4), CT[0], 1.4 + 3.5, CT[1]);
      bT.add(new THREE.BoxGeometry(3.4, 6, 3.4), KT[0], 1.4 + 3, KT[1]);
      bT.flush(G.chainWorks);
      XP.label('Πύργος Εὐγενίου', CT[0], 13, CT[1], 0.55);
      G.chainWorks.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      XP.label('Καστέλλιον', KT[0], 12, KT[1], 0.55);
      G.chainWorks.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      function boom(group, t0, t1, dropStart, dropEnd) {
        const bC = XP.builder(M.dark), N = 14;
        let px = null, py = 0, pz = 0;
        for (let i = 0; i <= N; i++) {
          const t = t0 + (t1 - t0) * i / N, u = i / N;
          const x = CT[0] + (KT[0] - CT[0]) * t, z = CT[1] + (KT[1] - CT[1]) * t;
          const y = 2.3 - 6.4 * t * (1 - t) - dropEnd * u * u - dropStart * (1 - u) * (1 - u);
          if (px !== null) {
            const dx = x - px, dz = z - pz, len = Math.hypot(dx, dz);
            const seg = new THREE.CylinderGeometry(0.26, 0.26, len + 0.2, 6);
            seg.rotateZ(Math.PI / 2);
            bC.add(seg, (x + px) / 2, (y + py) / 2, (z + pz) / 2, Math.atan2(dx, dz) - Math.PI / 2);
            if (i % 2 === 0 && y > 0.2)
              bC.add(new THREE.BoxGeometry(1.7, 0.5, 0.9), x, Math.max(y - 0.15, 0.25), z, Math.atan2(dx, dz) - Math.PI / 2);
          }
          px = x; py = y; pz = z;
        }
        bC.flush(group);
      }
      boom(G.chain, 0, 1, 0, 0);
      XP.label('Ἡ Ἅλυσις', (CT[0] + KT[0]) / 2, 10, (CT[1] + KT[1]) / 2, 0.7);
      G.chain.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
      boom(G.chainBrk, 0, 0.38, 0, 3.4);             // 1204: both halves droop into the Horn
      boom(G.chainBrk, 0.72, 1, 3.4, 0);
      ships(G.chainBrk, [[218, -92, 2.35], [224, -82, 2.5]], M.sailW);
      XP.label('1204 — ἡ ἅλυσις σπασμένη', 217, 12, -90, 0.6);
      G.chainBrk.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
    }

    /* — the four bronze horses over the carceres (to Venice, 1204) — */
    {
      const hs = new THREE.Shape();
      [[-1.05, 0.5], [-1.1, 0.9], [-0.75, 1.02], [-0.2, 0.98], [0.45, 1.02], [0.7, 1.5],
       [0.92, 1.62], [1.18, 1.5], [1.05, 1.28], [0.95, 0.9], [0.78, 0.52], [0.6, 0.52],
       [0.55, 0.06], [0.4, 0.06], [0.38, 0.5], [-0.35, 0.5], [-0.5, 0.06], [-0.68, 0.06],
       [-0.72, 0.52], [-0.95, 0.4]]
        .forEach((p, i) => i ? hs.lineTo(p[0], p[1]) : hs.moveTo(p[0], p[1]));
      hs.closePath();
      const hg = new THREE.ExtrudeGeometry(hs, { depth: 0.26, bevelEnabled: false });
      const bh = XP.builder(M.gold);
      for (const hz of [14.5, 18.5, 22.5, 26.5]) bh.add(hg, 192.4, 1.4 + 3.6, hz, Math.PI / 2);
      bh.flush(G.horses);
    }

    // sea walls: the single-line coastal circuit, joined to the land walls at
    // both ends (completed under the prefect Cyrus, 439) — towers all the way
    {
      const b = XP.builder(M.wall);
      const path = [[-235, -152]].concat(PEN, [[-242, 162]]);
      const twr = new THREE.CylinderGeometry(1.15, 1.35, 5.2, 8);
      for (let i = 0; i < path.length - 1; i++) {
        const [x0, z0] = path[i], [x1, z1] = path[i + 1];
        const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
        b.add(new THREE.BoxGeometry(len + 1.2, 3.4, 1.4), (x0 + x1) / 2, 1.4 + 1.7, (z0 + z1) / 2,
          Math.atan2(dx, dz) + Math.PI / 2);
        const n = Math.max(1, Math.round(len / 16));
        for (let k = 1; k <= n; k++) b.add(twr, x0 + dx * k / n, 1.4 + 2.6, z0 + dz * k / n);
      }
      b.flush(G.theod);
      XP.label('Παράλια Τείχη', 30, 14, 100, 0.75);
      G.theod.add(XP.labelGroup.children[XP.labelGroup.children.length - 1]);
    }

    [bWall, bMarble, bLead, bGold, bDark, bPorph].forEach(b => b.flush(world));
  };

  /* era visibility table (index: 330,413,537,1000,1204,1453) */
  A.setEra = function (i) {
    G.constantine.visible = true;
    G.denseC.visible = true;
    G.theod.visible = i >= 1;
    G.denseB.visible = i >= 1 && i !== 5;
    G.hsBasilica.visible = i === 1;
    G.just.visible = i >= 2;
    G.denseX.visible = i >= 3 && i !== 5;
    G.maced.visible = i >= 3;
    G.galata.visible = i >= 3;
    G.horses.visible = i <= 3;                 // looted to San Marco in 1204
    G.chainWorks.visible = i >= 3;
    G.chain.visible = i === 3 || i === 5;      // intact — 1453: Mehmed goes over land
    G.chainBrk.visible = i === 4;              // 1203: the Venetians ram it open
    G.sack.visible = i === 4;
    G.late.visible = i === 5;                  // Galata tower is 1348
    G.ottoman.visible = i === 5;
  };
})();
