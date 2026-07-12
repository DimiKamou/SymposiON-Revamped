/* ============================================================
   Ακρόπολις 432 π.Χ. — geometry. 1 u = 1 m.
   Parthenon stylobate 31×70 centred (63,19.5); Erechtheion N;
   Propylaia west; Nike on the SW bastion; Promachos colossus.
   ============================================================ */
(function () {
  const A = window.XP_APP;

  function triglyphTex() {
    const c = XP.canvas(512, 96), x = c.getContext('2d');
    x.fillStyle = '#e8e2d2'; x.fillRect(0, 0, 512, 96);
    for (let i = 0; i < 8; i++) {
      const bx = i * 64;
      x.fillStyle = '#2c4a7c';                              // blue triglyph
      x.fillRect(bx + 4, 8, 24, 80);
      x.fillStyle = '#e8e2d2';
      x.fillRect(bx + 10, 12, 4, 72); x.fillRect(bx + 18, 12, 4, 72);
      x.fillStyle = '#b8452c';                              // metope ground
      x.fillRect(bx + 32, 10, 28, 76);
      x.fillStyle = '#e8dfc8';                              // metope duel (Centauromachy)
      const mx = bx + 46, pose = i % 3;
      x.save(); x.translate(mx - 7, 0);
      x.beginPath(); x.ellipse(0, 58, 9, 4.5, 0, 0, 7); x.fill();       // centaur barrel
      x.fillRect(-2.5, 30, 5, 26);                                       // centaur torso
      x.beginPath(); x.arc(0, 26, 3.6, 0, 7); x.fill();                  // head
      x.fillRect(-8, 60, 2.6, 24); x.fillRect(5, 60, 2.6, 24);           // legs
      x.restore();
      x.save(); x.translate(mx + 8, 0); if (pose === 1) x.scale(1, 0.94);
      x.beginPath(); x.arc(0, 24 + pose, 3.6, 0, 7); x.fill();           // lapith head
      x.fillRect(-2.6, 28 + pose, 5.2, 30);                              // torso
      x.beginPath(); x.moveTo(-2.6, 58); x.lineTo(-7, 84); x.lineTo(-4, 84);
      x.lineTo(0, 60); x.lineTo(4, 84); x.lineTo(7, 84); x.lineTo(2.6, 58);
      x.closePath(); x.fill();                                           // striding legs
      x.fillRect(-11, 34, 8, 2.4);                                       // spear arm
      x.restore();
    }
    return c;
  }
  function friezeTex() {
    const c = XP.canvas(1024, 96), x = c.getContext('2d');
    x.fillStyle = '#3d5a8c'; x.fillRect(0, 0, 1024, 96);
    x.fillStyle = '#e2d8c4';
    for (let i = 0; i < 26; i++) {                          // the Panathenaic procession
      const bx = 20 + i * 38, kind = i % 5;
      if (kind === 2) {                                     // walker with hydria
        x.beginPath(); x.arc(bx, 34, 6, 0, 7); x.fill();
        x.fillRect(bx - 4, 40, 8, 34);
        x.beginPath(); x.ellipse(bx + 8, 36, 4, 5, 0, 0, 7); x.fill();
      } else if (kind === 4) {                              // sacrificial ox + leader
        x.beginPath(); x.ellipse(bx + 2, 60, 15, 9, 0, 0, 7); x.fill();
        x.fillRect(bx + 13, 44, 4, 14); x.fillRect(bx - 13, 66, 3, 18);
        x.fillRect(bx + 11, 66, 3, 18);
        x.beginPath(); x.arc(bx + 19, 42, 3, 0, 7); x.fill();
        x.beginPath(); x.arc(bx - 15, 36, 5, 0, 7); x.fill();
        x.fillRect(bx - 18, 42, 7, 30);
      } else {                                              // riders
        x.beginPath(); x.ellipse(bx, 62, 16, 9, 0, 0, 7); x.fill();
        x.fillRect(bx + 10, 40, 4, 16);
        x.fillRect(bx - 14, 68, 2.6, 18); x.fillRect(bx + 11, 68, 2.6, 18);
        x.beginPath(); x.arc(bx - 2, 38, 6, 0, 7); x.fill();
        x.fillRect(bx - 4, 42, 6, 14);
      }
    }
    return c;
  }
  function parapetTex() {                                   // Nikai leading bulls (c. 410 BC)
    const c = XP.canvas(1024, 128), x = c.getContext('2d');
    x.fillStyle = '#ddd3bc'; x.fillRect(0, 0, 1024, 128);
    x.fillStyle = 'rgba(120,108,86,0.25)'; x.fillRect(0, 116, 1024, 12);
    x.fillStyle = '#f4eedd';
    for (let i = 0; i < 6; i++) {
      const bx = 40 + i * 170, kind = i % 3;
      if (kind === 0) {                                     // winged Nike leading a bull
        x.beginPath(); x.ellipse(bx + 70, 82, 30, 18, 0, 0, 7); x.fill();
        x.fillRect(bx + 94, 52, 7, 22); x.fillRect(bx + 46, 96, 6, 26);
        x.fillRect(bx + 88, 96, 6, 26);
        x.beginPath(); x.arc(bx + 104, 48, 6, 0, 7); x.fill();
        x.beginPath(); x.arc(bx, 34, 8, 0, 7); x.fill();     // Nike
        x.fillRect(bx - 6, 44, 12, 52);
        x.beginPath(); x.moveTo(bx - 6, 50); x.quadraticCurveTo(bx - 34, 30, bx - 26, 66);
        x.closePath(); x.fill();                             // wing
      } else if (kind === 1) {                               // Nike adjusting her sandal
        x.beginPath(); x.arc(bx + 16, 42, 8, 0, 7); x.fill();
        x.save(); x.translate(bx + 10, 50); x.rotate(0.55);
        x.fillRect(-7, 0, 14, 46); x.restore();
        x.fillRect(bx - 14, 88, 30, 7);                      // bent leg
        x.beginPath(); x.moveTo(bx + 26, 48); x.quadraticCurveTo(bx + 54, 26, bx + 44, 64);
        x.closePath(); x.fill();
      } else {                                               // seated Athena watching
        x.fillRect(bx - 4, 66, 30, 10); x.fillRect(bx - 4, 76, 10, 40);
        x.fillRect(bx + 2, 40, 12, 30);
        x.beginPath(); x.arc(bx + 8, 34, 7, 0, 7); x.fill();
      }
    }
    return c;
  }
  function darkFriezeTex() {                                 // Eleusinian limestone + white figures
    const c = XP.canvas(1024, 64), x = c.getContext('2d');
    x.fillStyle = '#33363e'; x.fillRect(0, 0, 1024, 64);
    x.fillStyle = '#eee7d6';
    for (let i = 0; i < 30; i++) {
      const bx = 18 + i * 34;
      x.beginPath(); x.arc(bx, 18 + (i % 3), 4.5, 0, 7); x.fill();
      x.fillRect(bx - 3.6, 24, 7.2, 30);
    }
    return c;
  }
  function pandoraTex() {                                    // birth of Pandora, statue base
    const c = XP.canvas(1024, 128), x = c.getContext('2d');
    x.fillStyle = '#241c10'; x.fillRect(0, 0, 1024, 128);
    x.fillStyle = '#d9b45c';
    for (let i = 0; i < 20; i++) {
      const bx = 30 + i * 50, h = i === 10 ? 66 : 78;        // Pandora smaller, centre-ish
      x.beginPath(); x.arc(bx, 118 - h, 7, 0, 7); x.fill();
      x.beginPath(); x.moveTo(bx - 10, 122); x.lineTo(bx - 5, 122 - h + 12);
      x.lineTo(bx + 5, 122 - h + 12); x.lineTo(bx + 10, 122); x.closePath(); x.fill();
    }
    return c;
  }
  /* unit-height pediment figures (place with scale = height in metres) */
  let FG = null;
  function figGeos() {
    if (FG) return FG;
    const R = (g, x, y, z) => { g.translate(x, y, z); return g; };
    const stand = XP.mergeGeoms([
      R(new THREE.CylinderGeometry(0.10, 0.17, 0.60, 8), 0, 0.30, 0),
      R(new THREE.CylinderGeometry(0.09, 0.12, 0.24, 8), 0, 0.70, 0),
      R(new THREE.BoxGeometry(0.30, 0.07, 0.12), 0, 0.80, 0),
      R(new THREE.SphereGeometry(0.075, 8, 7), 0, 0.885, 0)
    ]);
    const seat = XP.mergeGeoms([
      R(new THREE.BoxGeometry(0.34, 0.30, 0.30), 0, 0.15, -0.05),
      R(new THREE.BoxGeometry(0.22, 0.12, 0.34), 0, 0.34, 0.10),
      R(new THREE.CylinderGeometry(0.09, 0.125, 0.30, 8), 0, 0.49, -0.06),
      R(new THREE.BoxGeometry(0.28, 0.06, 0.12), 0, 0.63, -0.06),
      R(new THREE.SphereGeometry(0.07, 8, 7), 0, 0.715, -0.06)
    ]);
    const rbody = new THREE.CylinderGeometry(0.115, 0.115, 0.52, 8); rbody.rotateX(Math.PI / 2);
    const recl = XP.mergeGeoms([
      R(rbody, 0, 0.15, -0.02),
      R(new THREE.SphereGeometry(0.125, 8, 7), 0, 0.22, 0.20),
      R(new THREE.SphereGeometry(0.07, 8, 7), 0, 0.35, 0.28)
    ]);
    const neck = new THREE.BoxGeometry(0.20, 0.62, 0.30); neck.rotateX(-0.5);
    const head = new THREE.BoxGeometry(0.16, 0.16, 0.36); head.rotateX(-0.12);
    const horse = XP.mergeGeoms([
      R(neck, 0, 0.30, 0.06),
      R(head, 0, 0.62, 0.26),
      R(new THREE.ConeGeometry(0.035, 0.1, 5), -0.05, 0.72, 0.12),
      R(new THREE.ConeGeometry(0.035, 0.1, 5), 0.05, 0.72, 0.12)
    ]);
    FG = { stand, seat, recl, horse };
    return FG;
  }
  function fluteTex() {
    const c = XP.canvas(256, 64), x = c.getContext('2d');
    x.fillStyle = '#e9e3d3'; x.fillRect(0, 0, 256, 64);
    for (let i = 0; i < 10; i++) {
      const g = x.createLinearGradient(i * 25.6, 0, i * 25.6 + 25.6, 0);
      g.addColorStop(0, 'rgba(120,110,90,0.34)'); g.addColorStop(0.5, 'rgba(255,255,255,0.25)'); g.addColorStop(1, 'rgba(120,110,90,0.34)');
      x.fillStyle = g; x.fillRect(i * 25.6, 0, 25.6, 64);
    }
    return c;
  }
  function caryatidTex() {
    const c = XP.canvas(128, 512), x = c.getContext('2d');
    x.fillStyle = '#e6dfcd'; x.fillRect(0, 0, 128, 512);
    x.strokeStyle = 'rgba(120,108,86,0.55)'; x.lineWidth = 5;   // peplos folds
    for (let i = 0; i < 6; i++) {
      x.beginPath(); x.moveTo(22 + i * 17, 150);
      x.quadraticCurveTo(18 + i * 17, 330, 24 + i * 17, 500); x.stroke();
    }
    x.strokeStyle = 'rgba(120,108,86,0.4)'; x.lineWidth = 3;    // belt + chest
    x.beginPath(); x.moveTo(20, 150); x.quadraticCurveTo(64, 176, 108, 150); x.stroke();
    return c;
  }
  function athenaFaceTex() {
    const c = XP.canvas(256, 256), x = c.getContext('2d');
    x.fillStyle = '#efe2c8'; x.fillRect(0, 0, 256, 256);        // ivory
    x.fillStyle = '#caa24a';
    x.fillRect(0, 0, 256, 70);                                   // helmet brow
    x.fillStyle = '#3a2c18';
    x.beginPath(); x.ellipse(88, 130, 14, 8, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(168, 130, 14, 8, 0, 0, 7); x.fill();
    x.strokeStyle = '#8a6b42'; x.lineWidth = 5;
    x.beginPath(); x.moveTo(128, 130); x.lineTo(124, 185); x.lineTo(138, 190); x.stroke();
    x.strokeStyle = '#9c4030';
    x.beginPath(); x.moveTo(100, 215); x.quadraticCurveTo(128, 226, 156, 215); x.stroke();
    return c;
  }

  A.buildWorld = function (world, XP) {
    const M = {};
    M.rock   = new THREE.MeshStandardMaterial({ color: 0x9a8c68, roughness: 1 });
    M.cliff  = new THREE.MeshStandardMaterial({ color: 0x7c6c50, roughness: 1 });
    M.plain  = new THREE.MeshStandardMaterial({ color: 0xb0a284, roughness: 1 });
    M.marble = new THREE.MeshStandardMaterial({ color: 0xe9e3d3, roughness: 0.55 });
    M.flute  = new THREE.MeshStandardMaterial({ map: XP.tex(fluteTex(), 1, 1), roughness: 0.55 });
    M.trig   = new THREE.MeshStandardMaterial({ map: XP.tex(triglyphTex(), 6, 1), roughness: 0.6 });
    M.frieze = new THREE.MeshStandardMaterial({ map: XP.tex(friezeTex(), 4, 1), roughness: 0.6 });
    M.roofT  = new THREE.MeshStandardMaterial({ color: 0xd8cfb8, roughness: 0.8, side: THREE.DoubleSide });
    M.bronze = new THREE.MeshStandardMaterial({ color: 0x6a5426, metalness: 0.9, roughness: 0.4 });
    M.gold   = new THREE.MeshStandardMaterial({ color: 0xdcb85e, metalness: 0.7, roughness: 0.38 });
    M.ivory  = new THREE.MeshStandardMaterial({ color: 0xefe2c8, roughness: 0.5 });
    M.olive  = new THREE.MeshStandardMaterial({ color: 0x6b7c4a, roughness: 0.95 });
    M.cary   = new THREE.MeshStandardMaterial({ map: XP.tex(caryatidTex(), 1, 1), roughness: 0.6 });
    M.statue = new THREE.MeshStandardMaterial({ color: 0xe4dabf, roughness: 0.5 });
    M.pedBg  = new THREE.MeshStandardMaterial({ color: 0xa03a24, roughness: 0.85, side: THREE.DoubleSide });
    M.parap  = new THREE.MeshStandardMaterial({ map: XP.tex(parapetTex(), 1, 1), roughness: 0.55 });
    M.dfrz   = new THREE.MeshStandardMaterial({ map: XP.tex(darkFriezeTex(), 3, 1), roughness: 0.6 });
    M.pand   = new THREE.MeshStandardMaterial({ map: XP.tex(pandoraTex(), 1, 1), roughness: 0.6 });
    M.wood   = new THREE.MeshStandardMaterial({ color: 0x6a4a2c, roughness: 0.8 });

    const mb = XP.builder(M.marble), rb = XP.builder(M.rock), tb = XP.builder(M.roofT),
          bb = XP.builder(M.bronze), cb = XP.builder(M.cliff);

    /* ---- the rock ---- */
    const plain = new THREE.Mesh(new THREE.PlaneGeometry(1200, 900), M.plain);
    plain.rotation.x = -Math.PI / 2; plain.position.y = -26; world.add(plain);
    // plateau: extruded outline, top at y 0
    const sh = new THREE.Shape();
    const P = [[-170, 0], [-130, -45], [-60, -60], [60, -58], [120, -40], [140, 0], [120, 42], [40, 58], [-70, 55], [-140, 40]];
    P.forEach((p, i) => i ? sh.lineTo(p[0], -p[1]) : sh.moveTo(p[0], -p[1]));
    sh.closePath();
    const rockGeo = new THREE.ExtrudeGeometry(sh, { depth: 26, bevelEnabled: false });
    rockGeo.rotateX(-Math.PI / 2);
    rockGeo.translate(0, 0, 0);
    const rock = new THREE.Mesh(rockGeo, M.cliff);
    rock.position.y = -26; world.add(rock);
    const top = new THREE.Mesh(new THREE.ShapeGeometry(sh), M.rock);
    top.rotation.x = -Math.PI / 2; top.position.y = 0.02; world.add(top);
    XP.addFloor({ x0: -170, x1: 140, z0: -60, z1: 58, y: 0.02 });
    // cliff-edge safety colliders (crude ring)
    for (let i = 0; i < P.length; i++) {
      const [x0, z0] = P[i], [x1, z1] = P[(i + 1) % P.length];
      const n = 6;
      for (let k = 0; k < n; k++) {
        const t0 = k / n, xx = x0 + (x1 - x0) * t0, zz = z0 + (z1 - z0) * t0;
        XP.addCyl(xx, zz, 3.2, -1, 4);
      }
    }
    // Panathenaic way paving
    rb.add(new THREE.BoxGeometry(120, 0.12, 5), -60, 0.09, 4, -0.06);
    rb.add(new THREE.BoxGeometry(70, 0.12, 4), 10, 0.09, 10, 0.12);

    /* ---- generic temple builder ---- */
    XP.columnType('doric', { profile: 'doric', r: 0.96, h: 10.4, taper: 0.76, mat: M.flute, capMat: M.marble, capH: 0.75, seg: 14 });
    XP.columnType('doricP', { profile: 'doric', r: 0.8, h: 8.8, taper: 0.78, mat: M.flute, capMat: M.marble, capH: 0.66, seg: 14 });
    XP.columnType('ionicN', { profile: 'ionic', r: 0.33, h: 4.1, taper: 0.86, mat: M.flute, capMat: M.marble, capH: 0.5, baseH: 0.28, seg: 14 });
    XP.columnType('ionicE', { profile: 'ionic', r: 0.42, h: 6.6, taper: 0.87, mat: M.flute, capMat: M.marble, capH: 0.6, baseH: 0.34, seg: 14 });

    function crepis(cx, cz, wX, wZ, steps, sh0) {
      for (let s = 0; s < steps; s++) {
        const g = new THREE.BoxGeometry(wX + (steps - 1 - s) * 1.4, 0.45, wZ + (steps - 1 - s) * 1.4);
        mb.add(g, cx, (sh0 || 0) + 0.225 + s * 0.45, cz);
      }
      const topY = (sh0 || 0) + steps * 0.45;
      XP.addFloor({ x0: cx - wX / 2 - steps * 0.7, x1: cx + wX / 2 + steps * 0.7, z0: cz - wZ / 2 - steps * 0.7, z1: cz + wZ / 2 + steps * 0.7, y: topY });
      return topY;
    }

    /* ---- THE PARTHENON (stylobate 31×70, centre 63,19.5) ---- */
    {
      const cx = 63, cz = 19.5, W = 70, D = 31;
      const y0 = crepis(cx, cz, W, D, 3, 0);
      // peristyle 8 × 17
      const nx = 17, nz = 8;
      const spanX = W - 2 * 1.9, spanZ = D - 2 * 1.9;
      for (let i = 0; i < nx; i++) for (const sz of [-1, 1])
        XP.column('doric', cx - spanX / 2 + i * spanX / (nx - 1), cz + sz * spanZ / 2, y0);
      for (let j = 1; j < nz - 1; j++) for (const sx of [-1, 1])
        XP.column('doric', cx + sx * spanX / 2, cz - spanZ / 2 + j * spanZ / (nz - 1), y0);
      // entablature: architrave + triglyph frieze + cornice
      const entY = y0 + 10.4;
      mb.add(new THREE.BoxGeometry(W, 1.3, D), cx, entY + 0.65, cz);
      const trig = XP.builder(M.trig);
      trig.add(new THREE.BoxGeometry(W, 1.35, 0.35), cx, entY + 1.3 + 0.675, cz - D / 2 - 0.02);
      trig.add(new THREE.BoxGeometry(W, 1.35, 0.35), cx, entY + 1.3 + 0.675, cz + D / 2 + 0.02);
      trig.add(new THREE.BoxGeometry(0.35, 1.35, D), cx - W / 2 - 0.02, entY + 1.3 + 0.675, cz);
      trig.add(new THREE.BoxGeometry(0.35, 1.35, D), cx + W / 2 + 0.02, entY + 1.3 + 0.675, cz);
      mb.add(new THREE.BoxGeometry(W, 1.35, D), cx, entY + 1.3 + 0.675, cz);   // frieze core
      mb.add(new THREE.BoxGeometry(W + 1.6, 0.55, D + 1.6), cx, entY + 2.65 + 0.275, cz); // cornice
      trig.flush(world);
      // pediments + roof
      const pedY = entY + 2.92;
      const pb = XP.builder(M.pedBg);
      for (const sx of [-1, 1]) {
        // solid marble tympanum
        const tri = new THREE.Shape();
        tri.moveTo(-(D + 1.6) / 2, 0); tri.lineTo((D + 1.6) / 2, 0); tri.lineTo(0, 3.8); tri.closePath();
        const tg = new THREE.ExtrudeGeometry(tri, { depth: 0.5, bevelEnabled: false });
        tg.rotateY(Math.PI / 2);
        mb.add(tg, cx + sx * (W / 2) - (sx > 0 ? 0 : 0.5), pedY, cz);
        // painted red ground behind the figures
        const bsh = new THREE.Shape();
        bsh.moveTo(-(D + 1.0) / 2, 0); bsh.lineTo((D + 1.0) / 2, 0); bsh.lineTo(0, 3.65); bsh.closePath();
        const bg = new THREE.ShapeGeometry(bsh);
        bg.rotateY(sx > 0 ? -Math.PI / 2 : Math.PI / 2);
        pb.add(bg, cx + sx * (W / 2 + 0.66), pedY + 0.04, cz);
      }
      pb.flush(world);
      /* the pediment sculptures (αετώματα) — east: the birth of Athena between
         Helios' team rising and Selene's sinking (Paus. 1.24.5); west: Athena
         and Poseidon contend for Attica over the olive tree */
      const FGs = figGeos();
      const sb = XP.builder(M.statue);
      const EAST = [
        ['horse', 13.5, 0.95], ['recl', 11.5, 1.35], ['seat', 9.0, 1.6], ['seat', 7.3, 1.7],
        ['stand', 5.3, 2.25, -0.1], ['stand', 3.0, 1.55, 0.12], ['stand', 1.55, 2.95, 0],
        ['seat', -0.4, 2.55, 0], ['stand', -2.9, 2.6, 0.14], ['seat', -5.5, 2.0],
        ['seat', -7.6, 1.75], ['recl', -9.9, 1.5], ['recl', -12.1, 1.25], ['horse', -13.5, 0.9]
      ];
      const WEST = [
        ['recl', 12.4, 1.35], ['seat', 9.8, 1.7], ['stand', 7.7, 2.05, -0.1],
        ['horse', 5.3, 1.25], ['stand', 3.9, 1.85, -0.08],
        ['stand', 1.6, 2.9, 0.24], ['stand', -1.6, 2.9, -0.24],
        ['stand', -3.9, 1.85, 0.08], ['horse', -5.3, 1.25],
        ['stand', -7.7, 2.05, 0.1], ['seat', -9.8, 1.7], ['recl', -12.4, 1.35]
      ];
      for (const [sx, LAY] of [[1, EAST], [-1, WEST]]) {
        const fx = cx + sx * (W / 2 + 0.98);
        for (const [k, dz, s, tilt] of LAY) {
          const ry = k === 'horse' ? (dz > 0 ? 0 : Math.PI) : (sx > 0 ? Math.PI / 2 : -Math.PI / 2);
          sb.add(FGs[k], fx, pedY + 0.03, cz + dz, ry, 0, tilt || 0, s);
        }
      }
      // the olive tree of the west contest + Poseidon's bronze trident
      cb.add(new THREE.CylinderGeometry(0.09, 0.15, 1.1, 6), cx - (W / 2 + 0.9), pedY + 0.55, cz + 0.2);
      const oc = new THREE.SphereGeometry(0.72, 8, 6); oc.scale(1, 0.7, 1);
      const ob2 = XP.builder(M.olive);
      ob2.add(oc, cx - (W / 2 + 0.9), pedY + 1.35, cz + 0.2); ob2.flush(world);
      bb.add(new THREE.CylinderGeometry(0.03, 0.03, 2.4, 5), cx - (W / 2 + 1.0), pedY + 1.2, cz - 2.35, 0, 0, -0.15);
      bb.add(new THREE.BoxGeometry(0.04, 0.3, 0.3), cx - (W / 2 + 1.0), pedY + 2.35, cz - 2.5);
      sb.flush(world);
      // akroteria — palmettes at apex and corners of both fronts
      const ak = new THREE.ConeGeometry(0.55, 1.25, 6); ak.scale(1, 1, 0.32);
      const akS = new THREE.ConeGeometry(0.38, 0.8, 6); akS.scale(1, 1, 0.32);
      for (const sx of [-1, 1]) {
        mb.add(ak, cx + sx * (W / 2 + 0.55), pedY + 3.8 + 0.6, cz);
        mb.add(akS, cx + sx * (W / 2 + 0.55), pedY + 0.4, cz - (D + 1.6) / 2);
        mb.add(akS, cx + sx * (W / 2 + 0.55), pedY + 0.4, cz + (D + 1.6) / 2);
      }
      // gabled roof
      const roof = new THREE.Shape();
      roof.moveTo(-(D + 2.4) / 2, 0); roof.lineTo((D + 2.4) / 2, 0); roof.lineTo(0, 4.1); roof.closePath();
      const rg = new THREE.ExtrudeGeometry(roof, { depth: W + 0.6, bevelEnabled: false });
      rg.rotateY(Math.PI / 2);
      tb.add(rg, cx - (W + 0.6) / 2, pedY, cz);
      // naos walls + pronaos columns
      const nW = 48, nD = 19;
      mb.add(new THREE.BoxGeometry(nW, 9.6, 0.9), cx + 2, y0 + 4.8, cz - nD / 2);
      mb.add(new THREE.BoxGeometry(nW, 9.6, 0.9), cx + 2, y0 + 4.8, cz + nD / 2);
      mb.add(new THREE.BoxGeometry(0.9, 9.6, nD), cx + 2 - nW / 2, y0 + 4.8, cz);   // west wall solid
      XP.addBox(cx + 2 - nW / 2 - 0.5, cx + 2 - nW / 2 + 0.5, cz - nD / 2, cz + nD / 2, y0, y0 + 9.6);
      XP.addBox(cx + 2 - nW / 2, cx + 2 + nW / 2, cz - nD / 2 - 0.5, cz - nD / 2 + 0.5, y0, y0 + 9.6);
      XP.addBox(cx + 2 - nW / 2, cx + 2 + nW / 2, cz + nD / 2 - 0.5, cz + nD / 2 + 0.5, y0, y0 + 9.6);
      // east wall with the great door
      const dw = 4.6;
      mb.add(new THREE.BoxGeometry(0.9, 9.6, (nD - dw) / 2), cx + 2 + nW / 2, y0 + 4.8, cz - (nD + dw) / 4);
      mb.add(new THREE.BoxGeometry(0.9, 9.6, (nD - dw) / 2), cx + 2 + nW / 2, y0 + 4.8, cz + (nD + dw) / 4);
      mb.add(new THREE.BoxGeometry(0.9, 2.4, dw), cx + 2 + nW / 2, y0 + 8.4, cz);
      XP.addBox(cx + 2 + nW / 2 - 0.5, cx + 2 + nW / 2 + 0.5, cz - nD / 2, cz - dw / 2, y0, y0 + 9.6);
      XP.addBox(cx + 2 + nW / 2 - 0.5, cx + 2 + nW / 2 + 0.5, cz + dw / 2, cz + nD / 2, y0, y0 + 9.6);
      // ionic frieze band around naos top
      const fz = XP.builder(M.frieze);
      fz.add(new THREE.BoxGeometry(nW, 1.0, 0.15), cx + 2, y0 + 9.0, cz - nD / 2 - 0.55);
      fz.add(new THREE.BoxGeometry(nW, 1.0, 0.15), cx + 2, y0 + 9.0, cz + nD / 2 + 0.55);
      fz.flush(world);
      // ceiling over naos
      mb.add(new THREE.BoxGeometry(nW, 0.4, nD), cx + 2, y0 + 9.8, cz);
      // two-storey Doric colonnade of the cella, a Π around the statue
      XP.columnType('doricI', { profile: 'doric', r: 0.5, h: 4.6, taper: 0.78, mat: M.flute, capMat: M.marble, capH: 0.4, seg: 10 });
      for (let i = 0; i < 13; i++) {
        const ix = cx - 21.5 + i * 3.3;
        XP.column('doricI', ix, cz - 7.9, y0); XP.column('doricI', ix, cz + 7.9, y0);
      }
      for (const iz of [-4.95, -1.65, 1.65, 4.95]) XP.column('doricI', cx - 14.9, cz + iz, y0);
      mb.add(new THREE.BoxGeometry(41, 0.55, 1.1), cx - 1.4, y0 + 4.88, cz - 7.9);
      mb.add(new THREE.BoxGeometry(41, 0.55, 1.1), cx - 1.4, y0 + 4.88, cz + 7.9);
      mb.add(new THREE.BoxGeometry(1.1, 0.55, 11.2), cx - 14.9, y0 + 4.88, cz);
      for (let i = 0; i < 13; i += 2) {                       // upper tier, hinted
        const ix = cx - 21.5 + i * 3.3;
        mb.add(new THREE.BoxGeometry(0.6, 3.2, 0.6), ix, y0 + 6.75, cz - 7.9);
        mb.add(new THREE.BoxGeometry(0.6, 3.2, 0.6), ix, y0 + 6.75, cz + 7.9);
      }
      /* ATHENA PARTHENOS — after Pausanias 1.24.5-7 and the Varvakeion copy:
         triple-crested helmet, Nike on the right hand over a support column,
         spear and shield at her left with the serpent (Erichthonios) coiled
         inside it, gorgoneion on the aegis, the birth of Pandora on the base */
      const ax = cx - 10, az = cz;
      const gld = XP.builder(M.gold);
      gld.add(new THREE.CylinderGeometry(2.6, 3.4, 7.2, 12), ax, y0 + 1.1 + 3.6, az);            // peplos
      gld.add(new THREE.CylinderGeometry(1.15, 1.5, 2.4, 10), ax, y0 + 1.1 + 7.2 + 1.2, az);     // chest+aegis
      const face = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.85, 1.5, 12),
        new THREE.MeshStandardMaterial({ map: XP.tex(athenaFaceTex()), roughness: 0.5 }));
      face.position.set(ax, y0 + 1.1 + 9.6 + 0.75, az); world.add(face);
      gld.add(new THREE.ConeGeometry(0.9, 1.4, 10), ax, y0 + 1.1 + 11.4, az);                    // helmet
      for (const [czo, ch] of [[0, 2.0], [-0.42, 1.55], [0.42, 1.55]])                           // triple crest
        gld.add(new THREE.BoxGeometry(0.16, ch, 0.85), ax, y0 + 1.1 + 11.55 + ch / 2 - 0.7, az + czo);
      // right arm outstretched with the Nike, over its support column
      const arm = new THREE.CylinderGeometry(0.3, 0.34, 2.3, 8); arm.rotateX(Math.PI / 2);
      gld.add(arm, ax, y0 + 1.1 + 7.9, az + 2.25);
      mb.add(new THREE.CylinderGeometry(0.42, 0.52, 7.9, 10), ax, y0 + 1.1 + 3.95, az + 3.35);
      const ivb = XP.builder(M.ivory);
      ivb.add(new THREE.CylinderGeometry(0.16, 0.3, 1.15, 8), ax, y0 + 1.1 + 8.75, az + 3.35);   // Nike
      ivb.add(new THREE.SphereGeometry(0.13, 8, 6), ax, y0 + 1.1 + 9.45, az + 3.35);
      gld.add(new THREE.BoxGeometry(0.06, 0.75, 0.3), ax - 0.15, y0 + 1.1 + 8.85, az + 3.05, 0, 0, 0.45);
      gld.add(new THREE.BoxGeometry(0.06, 0.75, 0.3), ax + 0.15, y0 + 1.1 + 8.85, az + 3.05, 0, 0, -0.45);
      // gorgoneion on the aegis
      const gorg = new THREE.CylinderGeometry(0.34, 0.34, 0.1, 12); gorg.rotateZ(Math.PI / 2);
      ivb.add(gorg, ax + 1.32, y0 + 1.1 + 8.5, az);
      ivb.flush(world);
      // her left side: the shield with the serpent coiled inside, spear leaning
      const sh2 = new THREE.CylinderGeometry(2.1, 2.1, 0.25, 18); sh2.rotateZ(Math.PI / 2);
      gld.add(sh2, ax + 0.2, y0 + 1.1 + 2.2, az - 3.1);
      const coil = r => { const t = new THREE.TorusGeometry(r, 0.09, 6, 14); t.rotateX(Math.PI / 2); return t; };
      bb.add(coil(0.55), ax + 0.2, y0 + 1.15, az - 2.55);
      bb.add(coil(0.4), ax + 0.2, y0 + 1.32, az - 2.55);
      bb.add(coil(0.26), ax + 0.2, y0 + 1.49, az - 2.55);
      bb.add(new THREE.ConeGeometry(0.11, 0.4, 6), ax + 0.2, y0 + 1.75, az - 2.45, 0, 0.9, 0);
      bb.add(new THREE.CylinderGeometry(0.09, 0.09, 13, 8), ax + 0.5, y0 + 1.1 + 6.5, az - 2.9, 0, 0.1, 0);
      gld.add(new THREE.ConeGeometry(0.16, 0.7, 6), ax + 0.5, y0 + 1.1 + 13.35, az - 2.22, 0, 0.1, 0); // spear-point
      mb.add(new THREE.BoxGeometry(7.5, 1.1, 4.6), ax, y0 + 0.55, az);                            // statue base
      const pnd = XP.builder(M.pand);                                                             // Pandora relief
      pnd.add(new THREE.BoxGeometry(0.12, 0.92, 4.5), ax + 3.78, y0 + 0.55, az);
      pnd.flush(world);
      XP.addBox(ax - 3.8, ax + 3.8, az - 2.4, az + 2.4, y0, y0 + 12);
      // shallow reflecting pool (Pausanias: the water kept the ivory moist)
      const pool = new THREE.Mesh(new THREE.BoxGeometry(10, 0.08, 12),
        new THREE.MeshStandardMaterial({ color: 0x2e5e72, metalness: 0.6, roughness: 0.12 }));
      pool.position.set(ax + 9, y0 + 0.08, az); world.add(pool);
      gld.flush(world);
      XP.label('Παρθενών', cx, entY + 10, cz, 1.1);
    }

    /* ---- PROPYLAIA (west gate, centre −124,0) ---- */
    {
      const cx = -124, cz = 0;
      const y0 = crepis(cx, cz, 22, 20, 3, 0);
      for (const sz of [-7.5, -4.5, 4.5, 7.5])
        for (const sx of [-8, 8]) XP.column('doricP', cx + sx, cz + sz, y0);
      for (const sx of [-8, 8]) XP.column('doricP', cx + sx, cz + 1.6, y0), XP.column('doricP', cx + sx, cz - 1.6, y0);
      mb.add(new THREE.BoxGeometry(24, 1.1, 20), cx, y0 + 8.8 + 0.55, cz);
      const trig2 = XP.builder(M.trig);
      trig2.add(new THREE.BoxGeometry(24, 1.2, 0.3), cx, y0 + 9.9 + 0.6, cz - 10.1);
      trig2.add(new THREE.BoxGeometry(24, 1.2, 0.3), cx, y0 + 9.9 + 0.6, cz + 10.1);
      trig2.flush(world);
      mb.add(new THREE.BoxGeometry(24, 1.2, 20), cx, y0 + 9.9 + 0.6, cz);
      // cross-wall with 5 doorways
      const zsW = [[-10, -6.4], [-5.2, -3.4], [-2.2, 2.2], [3.4, 5.2], [6.4, 10]];
      for (const [z0w, z1w] of zsW) {
        mb.add(new THREE.BoxGeometry(1.2, 8.8, z1w - z0w), cx, y0 + 4.4, (z0w + z1w) / 2);
        XP.addBox(cx - 0.6, cx + 0.6, z0w, z1w, y0, y0 + 8.8);
      }
      // wings + Nike bastion
      mb.add(new THREE.BoxGeometry(10, 6.5, 8), cx + 1, y0 + 3.25, cz - 15);
      XP.addBox(cx - 4, cx + 6, cz - 19, cz - 11, 0, 8);
      mb.add(new THREE.BoxGeometry(10, 6.5, 6), cx + 1, y0 + 3.25, cz + 14);
      XP.addBox(cx - 4, cx + 6, cz + 11, cz + 17, 0, 8);
      // approach ramp from the west edge
      XP.addFloor({ x0: -170, x1: -136, z0: -8, z1: 8, y: y0, ramp: { axis: 'x', from: -170, to: -136, y0: 0.02, y1: y0 } });
      rb.add(new THREE.BoxGeometry(34, 0.14, 12), -153, 0.4, 0, 0, 0, -0.04);
      XP.label('Προπύλαια', cx, y0 + 14, cz, 0.8);
    }

    /* ---- ATHENA NIKE (bastion −138,34) — tetrastyle amphiprostyle:
       four Ionic columns at the east and west fronts only, sculpted
       frieze on all four sides, the wingless cult statue inside, and
       the Nike-parapet reliefs rimming the bastion edge ---- */
    {
      const cx = -138, cz = 34;
      mb.add(new THREE.BoxGeometry(11, 7, 9), cx, -3.5 + 0.02, cz);      // bastion mass below edge
      const y0 = crepis(cx, cz, 7.6, 5.2, 3, 0);
      for (const sz of [-1.95, -0.65, 0.65, 1.95])
        for (const sx of [-3.0, 3.0]) XP.column('ionicN', cx + sx, cz + sz, y0);
      mb.add(new THREE.BoxGeometry(8, 0.7, 5.8), cx, y0 + 4.1 + 0.35, cz);
      const fz2 = XP.builder(M.frieze);                                  // frieze wraps all four sides
      fz2.add(new THREE.BoxGeometry(8.1, 0.6, 0.2), cx, y0 + 4.8 + 0.3, cz - 3);
      fz2.add(new THREE.BoxGeometry(8.1, 0.6, 0.2), cx, y0 + 4.8 + 0.3, cz + 3);
      fz2.add(new THREE.BoxGeometry(0.2, 0.6, 5.9), cx - 4.06, y0 + 4.8 + 0.3, cz);
      fz2.add(new THREE.BoxGeometry(0.2, 0.6, 5.9), cx + 4.06, y0 + 4.8 + 0.3, cz);
      fz2.flush(world);
      const roof = new THREE.Shape();
      roof.moveTo(-3.2, 0); roof.lineTo(3.2, 0); roof.lineTo(0, 1.5); roof.closePath();
      const rg = new THREE.ExtrudeGeometry(roof, { depth: 8.4, bevelEnabled: false });
      rg.rotateY(Math.PI / 2);
      tb.add(rg, cx - 4.2, y0 + 5.4, cz);
      // little pediments + gilded akroteria
      const ntri = new THREE.Shape();
      ntri.moveTo(-3.05, 0); ntri.lineTo(3.05, 0); ntri.lineTo(0, 0.85); ntri.closePath();
      const ntg = new THREE.ExtrudeGeometry(ntri, { depth: 0.35, bevelEnabled: false });
      ntg.rotateY(Math.PI / 2);
      mb.add(ntg, cx + 3.9, y0 + 5.5, cz); mb.add(ntg, cx - 4.25, y0 + 5.5, cz);
      const gb = XP.builder(M.gold);
      gb.add(new THREE.ConeGeometry(0.22, 0.55, 6), cx + 4.05, y0 + 6.6, cz);
      gb.add(new THREE.ConeGeometry(0.22, 0.55, 6), cx - 4.05, y0 + 6.6, cz);
      gb.add(new THREE.ConeGeometry(0.15, 0.4, 6), cx + 3.95, y0 + 5.7, cz - 3.05);
      gb.add(new THREE.ConeGeometry(0.15, 0.4, 6), cx + 3.95, y0 + 5.7, cz + 3.05);
      // cella: three walls + ceiling, open to the east door
      mb.add(new THREE.BoxGeometry(3.4, 3.4, 0.22), cx, y0 + 1.7, cz - 2.1);
      mb.add(new THREE.BoxGeometry(3.4, 3.4, 0.22), cx, y0 + 1.7, cz + 2.1);
      mb.add(new THREE.BoxGeometry(0.22, 3.4, 4.42), cx - 1.7, y0 + 1.7, cz);
      mb.add(new THREE.BoxGeometry(0.22, 3.4, 1.35), cx + 1.7, y0 + 1.7, cz - 1.42);
      mb.add(new THREE.BoxGeometry(0.22, 3.4, 1.35), cx + 1.7, y0 + 1.7, cz + 1.42);
      mb.add(new THREE.BoxGeometry(0.22, 0.5, 4.2), cx + 1.7, y0 + 3.35, cz);
      mb.add(new THREE.BoxGeometry(3.9, 0.22, 4.6), cx, y0 + 3.6, cz);
      XP.addBox(cx - 1.85, cx - 1.55, cz - 2.2, cz + 2.2, y0, y0 + 3.6);
      XP.addBox(cx - 1.7, cx + 1.7, cz - 2.24, cz - 1.96, y0, y0 + 3.6);
      XP.addBox(cx - 1.7, cx + 1.7, cz + 1.96, cz + 2.24, y0, y0 + 3.6);
      XP.addBox(cx + 1.55, cx + 1.85, cz - 2.2, cz - 0.75, y0, y0 + 3.6);
      XP.addBox(cx + 1.55, cx + 1.85, cz + 0.75, cz + 2.2, y0, y0 + 3.6);
      // the ancient wooden statue: Nike Apteros with pomegranate and helmet
      mb.add(new THREE.BoxGeometry(1.0, 0.35, 1.0), cx - 0.5, y0 + 0.18, cz);
      const wb = XP.builder(M.wood);
      wb.add(new THREE.CylinderGeometry(0.26, 0.34, 1.75, 8), cx - 0.5, y0 + 0.35 + 0.88, cz);
      wb.add(new THREE.SphereGeometry(0.2, 8, 7), cx - 0.5, y0 + 2.35, cz);
      wb.flush(world);
      gb.add(new THREE.SphereGeometry(0.09, 6, 5), cx - 0.15, y0 + 1.42, cz + 0.44);
      gb.add(new THREE.ConeGeometry(0.13, 0.22, 6), cx - 0.15, y0 + 1.42, cz - 0.44);
      gb.flush(world);
      // the parapet (θωράκιο): relief balustrade rimming the bastion drop
      const pp = XP.builder(M.parap);
      pp.add(new THREE.BoxGeometry(0.16, 1.05, 8.8), cx - 5.3, 0.02 + 0.52, cz);
      pp.add(new THREE.BoxGeometry(0.16, 1.05, 8.8), cx + 5.3, 0.02 + 0.52, cz);
      pp.add(new THREE.BoxGeometry(10.8, 1.05, 0.16), cx, 0.02 + 0.52, cz + 4.3);
      pp.flush(world);
      XP.addBox(cx - 5.4, cx - 5.2, cz - 4.4, cz + 4.4, 0, 1.2);
      XP.addBox(cx + 5.2, cx + 5.4, cz - 4.4, cz + 4.4, 0, 1.2);
      XP.addBox(cx - 5.4, cx + 5.4, cz + 4.2, cz + 4.4, 0, 1.2);
      XP.label('Ναός Αθηνάς Νίκης', cx, y0 + 9, cz, 0.65);
    }

    /* ---- ATHENA PROMACHOS (−72,−14) ---- */
    {
      const cx = -72, cz = -14;
      mb.add(new THREE.BoxGeometry(4.5, 1.6, 4.5), cx, 0.8, cz);
      bb.add(new THREE.CylinderGeometry(1.15, 1.6, 5.4, 10), cx, 1.6 + 2.7, cz);
      bb.add(new THREE.CylinderGeometry(0.55, 0.75, 1.9, 8), cx, 1.6 + 5.4 + 0.95, cz);
      bb.add(new THREE.SphereGeometry(0.55, 10, 8), cx, 1.6 + 7.7, cz);
      bb.add(new THREE.ConeGeometry(0.42, 0.9, 8), cx, 1.6 + 8.5, cz);
      bb.add(new THREE.BoxGeometry(0.14, 1.1, 0.5), cx, 1.6 + 9.2, cz);
      bb.add(new THREE.CylinderGeometry(0.07, 0.07, 11.5, 6), cx + 1.5, 1.6 + 5.75, cz + 0.4);
      const sh3 = new THREE.CylinderGeometry(1.5, 1.5, 0.2, 16); sh3.rotateZ(Math.PI / 2);
      bb.add(sh3, cx - 1.6, 1.6 + 2.6, cz);
      // the gilded spear-point sailors caught from Sounion (Paus. 1.28.2)
      const gp = XP.builder(M.gold);
      gp.add(new THREE.ConeGeometry(0.13, 0.6, 6), cx + 1.5, 1.6 + 11.5 + 0.3, cz + 0.4);
      gp.add(new THREE.BoxGeometry(0.1, 0.35, 0.55), cx, 1.6 + 9.8, cz);
      gp.flush(world);
      XP.addBox(cx - 2.4, cx + 2.4, cz - 2.4, cz + 2.4, 0, 11);
      XP.label('Αθηνά Πρόμαχος', cx, 14, cz, 0.8);
    }

    /* ---- ERECHTHEION (20,−30 zone) ---- */
    {
      const cx = 20, cz = -30;
      const y0 = crepis(cx, cz, 21, 11.5, 2, 0);
      // east ionic porch — hexastyle
      for (const sz of [-4.4, -2.64, -0.88, 0.88, 2.64, 4.4]) XP.column('ionicE', cx + 10.2, cz + sz, y0);
      mb.add(new THREE.BoxGeometry(21, 6.8, 0.8), cx, y0 + 3.4, cz - 5.4);
      mb.add(new THREE.BoxGeometry(21, 6.8, 0.8), cx, y0 + 3.4, cz + 5.4);
      mb.add(new THREE.BoxGeometry(0.8, 6.8, 11.5), cx - 10.5, y0 + 3.4, cz);
      XP.addBox(cx - 11, cx - 10, cz - 5.8, cz + 5.8, y0, y0 + 7);
      XP.addBox(cx - 10.5, cx + 10.5, cz - 5.8, cz - 5.0, y0, y0 + 7);
      XP.addBox(cx - 10.5, cx + 10.5, cz + 5.0, cz + 5.8, y0, y0 + 7);
      mb.add(new THREE.BoxGeometry(22, 0.9, 12.5), cx, y0 + 7.25, cz);
      // CARYATID PORCH on the south side
      const px = cx - 5.5, pz = cz + 7.4;
      mb.add(new THREE.BoxGeometry(6.4, 1.8, 4.2), px, y0 + 0.9, pz);
      for (let i = 0; i < 6; i++) {
        const kx = px - 2.2 + (i % 3) * 2.2, kz = pz - 1 + Math.floor(i / 3) * 2;
        const kore = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.5, 2.3, 10), M.cary);
        kore.position.set(kx, y0 + 1.8 + 1.15, kz); world.add(kore);
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 10, 8), M.marble);
        head.position.set(kx, y0 + 1.8 + 2.45, kz); world.add(head);
        const kal = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.24, 0.3, 10), M.marble);
        kal.position.set(kx, y0 + 1.8 + 2.75, kz); world.add(kal);
      }
      mb.add(new THREE.BoxGeometry(6.8, 0.75, 4.6), px, y0 + 1.8 + 3.05, pz);
      XP.addBox(px - 3.4, px + 3.4, pz - 2.3, pz + 2.3, y0, y0 + 5);
      // NORTH PORCH — the tall Ionic prostasis over the grand door
      const nx2 = cx - 4.5;
      mb.add(new THREE.BoxGeometry(8.6, 0.5, 5.0), nx2, y0 - 0.25 + 0.25, cz - 7.9);
      XP.addFloor({ x0: nx2 - 4.3, x1: nx2 + 4.3, z0: cz - 10.4, z1: cz - 5.4, y: y0 });
      for (const kx of [-3, -1, 1, 3]) XP.column('ionicE', nx2 + kx, cz - 9.5, y0);
      XP.column('ionicE', nx2 - 3, cz - 7.6, y0); XP.column('ionicE', nx2 + 3, cz - 7.6, y0);
      mb.add(new THREE.BoxGeometry(7.9, 0.75, 3.8), nx2, y0 + 6.6 + 0.38, cz - 8.4);
      mb.add(new THREE.BoxGeometry(8.4, 0.3, 4.6), nx2, y0 + 7.5, cz - 8.3);
      // the grand north door
      mb.add(new THREE.BoxGeometry(0.32, 3.7, 0.36), nx2 - 1.25, y0 + 1.85, cz - 5.85);
      mb.add(new THREE.BoxGeometry(0.32, 3.7, 0.36), nx2 + 1.25, y0 + 1.85, cz - 5.85);
      mb.add(new THREE.BoxGeometry(3.1, 0.45, 0.4), nx2, y0 + 3.9, cz - 5.85);
      const dwb = XP.builder(M.wood);
      dwb.add(new THREE.BoxGeometry(2.2, 3.5, 0.15), nx2, y0 + 1.75, cz - 5.75);
      dwb.flush(world);
      // frieze of dark Eleusinian limestone with white marble figures
      const ef = XP.builder(M.dfrz);
      ef.add(new THREE.BoxGeometry(21.2, 0.55, 0.14), cx, y0 + 6.35, cz - 5.88);
      ef.add(new THREE.BoxGeometry(21.2, 0.55, 0.14), cx, y0 + 6.35, cz + 5.88);
      ef.add(new THREE.BoxGeometry(0.14, 0.55, 11.6), cx - 10.97, y0 + 6.35, cz);
      ef.flush(world);
      // Athena's olive by the west end
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 2.6, 8), M.cliff);
      t.position.set(cx - 15, 1.3, cz + 4); world.add(t);
      const cr = new THREE.Mesh(new THREE.SphereGeometry(3, 10, 8), M.olive);
      cr.position.set(cx - 15, 4.6, cz + 4); cr.scale.set(1.2, 0.75, 1.2); world.add(cr);
      XP.addCyl(cx - 15, cz + 4, 0.8, 0, 3);
      XP.label('Ἐρέχθειον', cx, y0 + 12, cz, 0.8);
      XP.label('Ἡ ἐλαία τῆς Ἀθηνᾶς', cx - 15, 8.6, cz + 4, 0.55);
    }

    /* ---- altar of Athena + dressing ---- */
    mb.add(new THREE.BoxGeometry(6, 1.4, 3.4), 44, 0.72, -22);
    XP.addBox(41, 47, -23.7, -20.3, 0, 2);

    /* ---- Brauroneion & Chalkotheke along the south wall ---- */
    XP.columnType('doricS', { profile: 'doric', r: 0.42, h: 3.3, taper: 0.8, mat: M.flute, capMat: M.marble, capH: 0.3, seg: 10 });
    {
      // Sanctuary of Artemis Brauronia (Π-shaped stoa)
      mb.add(new THREE.BoxGeometry(34, 3.8, 0.8), -41, 1.92, 50);
      mb.add(new THREE.BoxGeometry(0.8, 3.8, 7), -57.6, 1.92, 46.9);
      mb.add(new THREE.BoxGeometry(0.8, 3.8, 7), -24.4, 1.92, 46.9);
      for (let i = 0; i < 8; i++) XP.column('doricS', -55 + i * 4, 43.6, 0.02);
      tb.add(new THREE.BoxGeometry(34.8, 0.28, 7.6), -41, 4.35, 46.9, 0, 0.1, 0);
      XP.addBox(-58, -24, 49.6, 50.4, 0, 4);
      XP.label('Βραυρώνιον', -41, 8.5, 47, 0.6);
      // Chalkotheke — the store of the bronzes
      mb.add(new THREE.BoxGeometry(24, 4.2, 8), 7, 2.12, 47);
      for (let i = 0; i < 7; i++) XP.column('doricS', -3 + i * 3.3, 41.9, 0.02);
      tb.add(new THREE.BoxGeometry(25, 0.28, 10), 7, 4.6, 45.6, 0, 0.08, 0);
      XP.addBox(-5, 19, 43, 51, 0, 4.4);
      XP.label('Χαλκοθήκη', 7, 8.5, 46, 0.6);
    }

    /* ---- the circuit wall rimming the plateau edge ---- */
    {
      const C0 = [-12, 0];
      const shrink = p => [C0[0] + (p[0] - C0[0]) * 0.965, C0[1] + (p[1] - C0[1]) * 0.955];
      const SOUTH = [[140, 0], [120, 42], [40, 58], [-70, 55], [-140, 40]];
      const NORTH = [[-130, -45], [-60, -60], [60, -58], [120, -40], [140, 0]];
      for (const raw of [SOUTH, NORTH]) {
        const pts = raw.map(shrink);
        for (let i = 0; i < pts.length - 1; i++) {
          const [x0, z0] = pts[i], [x1, z1] = pts[i + 1];
          const dx = x1 - x0, dz = z1 - z0, len = Math.hypot(dx, dz);
          cb.add(new THREE.BoxGeometry(len + 0.8, 2.1, 0.9), (x0 + x1) / 2, 1.07, (z0 + z1) / 2,
            Math.atan2(dx, dz) + Math.PI / 2);
          const n = Math.ceil(len / 9);
          for (let k = 0; k < n; k++) {
            const t0 = k / n, t1 = (k + 1) / n;
            XP.addBox(Math.min(x0 + dx * t0, x0 + dx * t1) - 0.55, Math.max(x0 + dx * t0, x0 + dx * t1) + 0.55,
                      Math.min(z0 + dz * t0, z0 + dz * t1) - 0.55, Math.max(z0 + dz * t0, z0 + dz * t1) + 0.55, 0, 2.2);
          }
        }
      }
    }

    /* ---- bronze votives on marble bases along the Sacred Way ---- */
    {
      const FGs = figGeos();
      const vb = XP.builder(M.marble), vf = XP.builder(M.bronze);
      [[-96, -2.2, 1.9], [-82, 11, 1.7], [-56, -2.5, 2.1], [-34, 11.5, 1.8]].forEach(([vx, vz, s], i) => {
        vb.add(new THREE.BoxGeometry(1.3, 0.95, 1.3), vx, 0.5, vz);
        vf.add(FGs.stand, vx, 0.97, vz, i * 2.4, 0, 0, s);
        XP.addCyl(vx, vz, 0.9, 0, 2.5);
      });
      vb.flush(world); vf.flush(world);
    }

    [mb, rb, tb, bb, cb].forEach(b => b.flush(world));
  };
  A.labels = true;
})();
