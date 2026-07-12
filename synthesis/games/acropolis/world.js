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
      x.fillStyle = '#e0d6c0';                              // figure hint
      x.beginPath(); x.ellipse(bx + 46, 48, 8, 22, 0.3 * ((i % 3) - 1), 0, 7); x.fill();
    }
    return c;
  }
  function friezeTex() {
    const c = XP.canvas(1024, 96), x = c.getContext('2d');
    x.fillStyle = '#3d5a8c'; x.fillRect(0, 0, 1024, 96);
    x.fillStyle = '#e2d8c4';
    for (let i = 0; i < 26; i++) {                          // riders of the procession
      const bx = 20 + i * 38, mounted = i % 3 !== 2;
      if (mounted) {
        x.beginPath(); x.ellipse(bx, 62, 16, 9, 0, 0, 7); x.fill();          // horse body
        x.fillRect(bx + 10, 40, 4, 16);                                      // neck
        x.beginPath(); x.arc(bx - 2, 38, 6, 0, 7); x.fill();                 // rider
        x.fillRect(bx - 4, 42, 6, 14);
      } else {
        x.beginPath(); x.arc(bx, 34, 6, 0, 7); x.fill();
        x.fillRect(bx - 4, 40, 8, 34);
      }
    }
    return c;
  }
  function pedimentTex(flip) {
    const c = XP.canvas(1024, 160), x = c.getContext('2d');
    x.fillStyle = '#b8452c'; x.fillRect(0, 0, 1024, 160);
    x.fillStyle = '#ece4d2';
    const N = 9;
    for (let i = 0; i < N; i++) {                           // standing gods, tallest centre
      const bx = 90 + i * 106, hh = 130 - Math.abs(i - (N - 1) / 2) * 26;
      x.beginPath(); x.arc(bx, 158 - hh, 12, 0, 7); x.fill();
      x.beginPath(); x.moveTo(bx - 16, 160); x.lineTo(bx - 8, 160 - hh + 10);
      x.lineTo(bx + 8, 160 - hh + 10); x.lineTo(bx + 16, 160); x.closePath(); x.fill();
    }
    if (flip) { const c2 = XP.canvas(1024, 160), y = c2.getContext('2d'); y.translate(1024, 0); y.scale(-1, 1); y.drawImage(c, 0, 0); return c2; }
    return c;
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
    M.gold   = new THREE.MeshStandardMaterial({ color: 0xd9b45c, metalness: 0.88, roughness: 0.3 });
    M.ivory  = new THREE.MeshStandardMaterial({ color: 0xefe2c8, roughness: 0.5 });
    M.olive  = new THREE.MeshStandardMaterial({ color: 0x6b7c4a, roughness: 0.95 });
    M.cary   = new THREE.MeshStandardMaterial({ map: XP.tex(caryatidTex(), 1, 1), roughness: 0.6 });

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
      for (const sx of [-1, 1]) {
        const ped = new THREE.Mesh(new THREE.PlaneGeometry(D + 1.2, 3.4),
          new THREE.MeshStandardMaterial({ map: XP.tex(pedimentTex(sx < 0)), roughness: 0.65 }));
        ped.position.set(cx + sx * (W / 2 + 0.82), pedY + 1.7, cz);
        ped.rotation.y = sx > 0 ? -Math.PI / 2 : Math.PI / 2;
        world.add(ped);
        // pediment triangle cap
        const tri = new THREE.Shape();
        tri.moveTo(-(D + 1.6) / 2, 0); tri.lineTo((D + 1.6) / 2, 0); tri.lineTo(0, 3.8); tri.closePath();
        const tg = new THREE.ExtrudeGeometry(tri, { depth: 0.5, bevelEnabled: false });
        tg.rotateY(Math.PI / 2);
        mb.add(tg, cx + sx * (W / 2 + (sx > 0 ? 0.5 : 0)), pedY, cz + (D + 1.6) / 2 * 0 + (D + 1.6) / 2 * 0, 0);
      }
      // gabled roof
      const roof = new THREE.Shape();
      roof.moveTo(-(D + 2.4) / 2, 0); roof.lineTo((D + 2.4) / 2, 0); roof.lineTo(0, 4.1); roof.closePath();
      const rg = new THREE.ExtrudeGeometry(roof, { depth: W + 0.6, bevelEnabled: false });
      rg.rotateY(Math.PI / 2);
      tb.add(rg, cx + (W + 0.6) / 2, pedY, cz);
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
      // ATHENA PARTHENOS
      const ax = cx - 10, az = cz;
      const gld = XP.builder(M.gold);
      gld.add(new THREE.CylinderGeometry(2.6, 3.4, 7.2, 12), ax, y0 + 1.1 + 3.6, az);            // peplos
      gld.add(new THREE.CylinderGeometry(1.15, 1.5, 2.4, 10), ax, y0 + 1.1 + 7.2 + 1.2, az);     // chest+aegis
      const face = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.85, 1.5, 12),
        new THREE.MeshStandardMaterial({ map: XP.tex(athenaFaceTex()), roughness: 0.5 }));
      face.position.set(ax, y0 + 1.1 + 9.6 + 0.75, az); world.add(face);
      gld.add(new THREE.ConeGeometry(0.9, 1.4, 10), ax, y0 + 1.1 + 11.4, az);                    // helmet
      gld.add(new THREE.BoxGeometry(0.22, 1.9, 0.9), ax, y0 + 1.1 + 12.2, az);                   // crest
      // shield + spear + Nike on hand
      const sh2 = new THREE.CylinderGeometry(2.1, 2.1, 0.25, 18); sh2.rotateZ(Math.PI / 2);
      gld.add(sh2, ax + 0.2, y0 + 1.1 + 2.2, az - 3.1);
      bb.add(new THREE.CylinderGeometry(0.09, 0.09, 13, 8), ax + 0.3, y0 + 1.1 + 6.5, az + 3.2);
      const ivb = XP.builder(M.ivory);
      ivb.add(new THREE.CylinderGeometry(0.5, 0.6, 1.2, 8), ax - 2.9, y0 + 1.1 + 6.2, az + 1.4, 0, 0, 0.5);
      ivb.add(new THREE.BoxGeometry(0.5, 1.1, 0.5), ax - 3.6, y0 + 1.1 + 6.9, az + 1.7);         // Nike
      ivb.flush(world);
      mb.add(new THREE.BoxGeometry(7.5, 1.1, 4.6), ax, y0 + 0.55, az);                            // statue base
      XP.addBox(ax - 3.8, ax + 3.8, az - 2.4, az + 2.4, y0, y0 + 12);
      // shallow reflecting pool
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

    /* ---- ATHENA NIKE (bastion −138,34) ---- */
    {
      const cx = -138, cz = 34;
      mb.add(new THREE.BoxGeometry(11, 7, 9), cx, -3.5 + 0.02, cz);      // bastion mass below edge
      const y0 = crepis(cx, cz, 7.6, 5.2, 3, 0);
      for (const sx of [-3, -1, 1, 3]) { XP.column('ionicN', cx + sx, cz - 2.2, y0); XP.column('ionicN', cx + sx, cz + 2.2, y0); }
      mb.add(new THREE.BoxGeometry(8, 0.7, 5.8), cx, y0 + 4.1 + 0.35, cz);
      const fz2 = XP.builder(M.frieze);
      fz2.add(new THREE.BoxGeometry(8.1, 0.6, 0.2), cx, y0 + 4.8 + 0.3, cz - 3);
      fz2.add(new THREE.BoxGeometry(8.1, 0.6, 0.2), cx, y0 + 4.8 + 0.3, cz + 3);
      fz2.flush(world);
      const roof = new THREE.Shape();
      roof.moveTo(-3.2, 0); roof.lineTo(3.2, 0); roof.lineTo(0, 1.5); roof.closePath();
      const rg = new THREE.ExtrudeGeometry(roof, { depth: 8.4, bevelEnabled: false });
      rg.rotateY(Math.PI / 2);
      tb.add(rg, cx + 4.2, y0 + 5.4, cz);
      mb.add(new THREE.BoxGeometry(2.6, 4.4, 2), cx, y0 + 2.2, cz);      // naiskos core
      XP.addBox(cx - 1.3, cx + 1.3, cz - 1, cz + 1, y0, y0 + 4.4);
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
      XP.addBox(cx - 2.4, cx + 2.4, cz - 2.4, cz + 2.4, 0, 11);
      XP.label('Αθηνά Πρόμαχος', cx, 14, cz, 0.8);
    }

    /* ---- ERECHTHEION (20,−30 zone) ---- */
    {
      const cx = 20, cz = -30;
      const y0 = crepis(cx, cz, 21, 11.5, 2, 0);
      // east ionic porch
      for (const sz of [-4.4, -2.2, 0, 2.2, 4.4]) XP.column('ionicE', cx + 10.2, cz + sz, y0);
      XP.column('ionicE', cx + 10.2, cz - 4.4, y0);
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

    [mb, rb, tb, bb, cb].forEach(b => b.flush(world));
  };
  A.labels = true;
})();
