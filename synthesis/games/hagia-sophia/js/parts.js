/* ============================================================
   Hagia Sophia 537 — parts.js
   Reusable builders: columns (instanced), arcades, cornices,
   window panes, parapets.
   ============================================================ */
(function () {
  const D = HS.DIM;

  /* ---------- column factory ----------
     A column type = base + shaft (with entasis) + basket capital
     + impost block. Rendered as 3 InstancedMeshes per type. */
  const colTypes = {};
  HS.columnType = function (key, spec) { colTypes[key] = Object.assign({ placements: [] }, spec); };
  HS.column = function (key, x, z, y, rotY) {
    colTypes[key].placements.push({ x, z, y: y || 0, rotY: rotY || 0 });
    if (colTypes[key].collide !== false)
      HS.addCyl(x, z, colTypes[key].r + 0.16, y || 0, (y || 0) + 3);
  };

  function shaftGeo(r, h) {
    const pts = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const rr = r * (1.015 - 0.09 * t + 0.045 * Math.sin(t * Math.PI)); // entasis
      pts.push(new THREE.Vector2(rr, t * h));
    }
    return new THREE.LatheGeometry(pts, 20);
  }
  function baseGeo(r, hB) {
    const plinth = new THREE.CylinderGeometry(r * 1.42, r * 1.5, hB * 0.55, 4);
    plinth.rotateY(Math.PI / 4); plinth.translate(0, hB * 0.275, 0);
    const torus = new THREE.CylinderGeometry(r * 1.22, r * 1.34, hB * 0.45, 18);
    torus.translate(0, hB * 0.775, 0);
    return HS.mergeGeoms([plinth, torus]);
  }
  function capGeo(r, hC) {
    // basket capital: concave flare, then 4-sided impost
    const pts = [];
    for (let i = 0; i <= 6; i++) {
      const t = i / 6;
      pts.push(new THREE.Vector2(r * (0.96 + 0.62 * t * t), t * hC * 0.62));
    }
    const basket = new THREE.LatheGeometry(pts, 16);
    const impost = new THREE.CylinderGeometry(r * 1.95, r * 1.52, hC * 0.38, 4);
    impost.rotateY(Math.PI / 4); impost.translate(0, hC * 0.81, 0);
    return HS.mergeGeoms([basket, impost]);
  }

  HS.flushColumns = function (parent) {
    Object.keys(colTypes).forEach(key => {
      const t = colTypes[key];
      const n = t.placements.length;
      if (!n) return;
      const hB = t.baseH !== undefined ? t.baseH : t.h * 0.055;
      const hC = t.capH !== undefined ? t.capH : t.h * 0.14;
      const hS = t.h - hB - hC;
      const parts = [
        { g: baseGeo(t.r, hB), m: HS.mats.proc, y0: 0 },
        { g: shaftGeo(t.r, hS), m: t.mat, y0: hB },
        { g: capGeo(t.r, hC), m: HS.mats.capital, y0: hB + hS },
      ];
      parts.forEach(p => {
        const im = new THREE.InstancedMesh(p.g, p.m, n);
        const M4 = new THREE.Matrix4();
        t.placements.forEach((pl, i) => {
          M4.makeRotationY(pl.rotY);
          M4.setPosition(pl.x, pl.y + p.y0, pl.z);
          im.setMatrixAt(i, M4);
        });
        im.instanceMatrix.needsUpdate = true;
        parent.add(im);
      });
    });
  };

  /* ---------- arcade: spandrel wall with arched openings ----------
     Local frame: wall runs along +X from x0..x1, vertical Y, extruded
     `t` along +Z, then positioned by caller via matrix params.
     bays: array of centre x for the arches. r: arch radius,
     ySpring: arch springing, yTop: top of wall. */
  HS.arcadeGeo = function (x0, x1, ySpring, yTop, bays, r, t) {
    const sh = new THREE.Shape();
    sh.moveTo(x0, ySpring - 0.06); sh.lineTo(x1, ySpring - 0.06);
    sh.lineTo(x1, yTop); sh.lineTo(x0, yTop); sh.closePath();
    bays.forEach(cx => {
      const p = new THREE.Path();
      p.moveTo(cx - r, ySpring);
      p.absarc(cx, ySpring, r, Math.PI, 0, true);   // over the top
      p.lineTo(cx - r, ySpring);
      sh.holes.push(p);
    });
    const g = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: false, curveSegments: 28 });
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.25, uv.getY(i) * 0.25);
    return g;
  };

  /* archivolt bands over a row of arches (adds relief) */
  HS.archBandsRow = function (builder, bays, r, ySpring, zPos, t, rotY, cx0) {
    bays.forEach(cx => {
      builder.add(HS.archBand(r, r + 0.34, t, 0, Math.PI),
        (cx0 || 0) + (rotY ? zPos : cx), ySpring, rotY ? cx : zPos, rotY || 0);
    });
  };

  /* ---------- cornice strip (rectangular ledge) ---------- */
  HS.corniceGeo = function (len, h, d) {
    const g = new THREE.BoxGeometry(len, h, d);
    return g;
  };
  /* arc cornice around a centre (cx,cz), radius r, angles a0..a1 */
  HS.arcCornice = function (builder, cx, cz, r, y, a0, a1, h, d) {
    const seg = Math.max(4, Math.round((a1 - a0) / 0.16));
    for (let i = 0; i < seg; i++) {
      const a = a0 + (i + 0.5) * (a1 - a0) / seg;
      const chord = 2 * r * Math.sin((a1 - a0) / seg / 2) + 0.12;
      const g = new THREE.BoxGeometry(chord, h, d);
      g.translate(0, 0, -r);
      builder.add(g, cx, y, cz, -a + Math.PI / 2);
    }
  };

  /* ---------- window: glowing pane + reveal frame ----------
     Registers the pane in HS.panes for day/dusk swapping.
     (w×h arch-topped, centred, facing +Z in local space.) */
  HS.panes = [];
  HS.windowPane = function (parent, w, h, x, y, z, rotY, frameMat) {
    const sh = new THREE.Shape();
    const r = w / 2, s = h - r;
    sh.moveTo(-w / 2, 0); sh.lineTo(-w / 2, s);
    sh.absarc(0, s, r, Math.PI, 0, true);
    sh.lineTo(w / 2, 0); sh.closePath();
    const g = new THREE.ShapeGeometry(sh, 20);
    // map pane texture 0..1
    const uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++)
      uv.setXY(i, (uv.getX(i) + w / 2) / w, uv.getY(i) / h);
    const mesh = new THREE.Mesh(g, HS.mats.pane);
    mesh.position.set(x, y, z); mesh.rotation.y = rotY || 0;
    mesh.matrixAutoUpdate = false; mesh.updateMatrix();
    parent.add(mesh);
    HS.panes.push(mesh);
    if (frameMat) {
      const fb = new THREE.Mesh(HS.archBand(w / 2, w / 2 + 0.22, 0.25, 0, Math.PI), frameMat);
      fb.position.set(x, y, z).add(new THREE.Vector3(0, s, 0).applyAxisAngle(new THREE.Vector3(0, 1, 0), rotY || 0));
      fb.rotation.y = rotY || 0;
      fb.matrixAutoUpdate = false; fb.updateMatrix();
      parent.add(fb);
    }
    return mesh;
  };

  /* ---------- gallery parapet: slab + rail ---------- */
  HS.parapet = function (builder, railBuilder, x, y, z, len, rotY) {
    const slab = new THREE.BoxGeometry(len, 1.02, 0.16);
    slab.translate(0, 0.51, 0);
    builder.add(slab, x, y, z, rotY);
    const rail = new THREE.BoxGeometry(len, 0.12, 0.26);
    rail.translate(0, 1.08, 0);
    railBuilder.add(rail, x, y, z, rotY);
  };

  /* ---------- light shaft cone ---------- */
  HS.lightShaft = function (parent, from, dir, len, r0, r1) {
    const g = new THREE.CylinderGeometry(r0, r1, len, 10, 1, true);
    g.translate(0, -len / 2, 0);
    const m = new THREE.Mesh(g, HS.mats.shaft);
    m.position.copy(from);
    const d = dir.clone().normalize();
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), d);
    m.renderOrder = 5;
    parent.add(m);
    HS.shafts = HS.shafts || [];
    HS.shafts.push(m);
    return m;
  };
})();
