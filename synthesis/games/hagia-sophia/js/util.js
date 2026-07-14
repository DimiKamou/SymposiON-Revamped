/* ============================================================
   Hagia Sophia 537 — util.js
   Shared namespace, master dimensions, geometry helpers.
   All units are metres. Axes: +X = east (apse), −X = west
   (Imperial Door / atrium), +Z = south, +Y = up. Floor y = 0.
   Dimensions follow the published surveys (Mainstone, Van Nice)
   rounded for a clean procedural model; the dome uses the
   *original* shallow profile of 537 (crown ≈ 49 m, the dome
   that stood until 558), not today's taller 562 rebuild.
   ============================================================ */
window.HS = window.HS || {};

HS.DIM = {
  R: 15.5,              // half-side of the central square = semidome radius
  springY: 24.3,        // springing of the four great arches
  archCrownY: 39.8,     // crown of great arches = dome ring
  domeRise: 9.2,        // rise of the FIRST dome (537–558) → crown ≈ 49
  domeWinTop: 42.7,     // top of the 40-window band
  pierX: 5.2,           // main pier size along x
  pierZ: 5.6,           // main pier size along z (14.3 → 19.9)
  colSpanX: 10.3,       // nave colonnade runs x −10.3 … 10.3
  gFloor: 13.2,         // gallery floor level
  gSlab: 0.6,           // gallery slab thickness (soffit at 12.6)
  gCornice: 23.2,       // great cornice below the tympana
  arcSpring: 9.6,       // ground arcade springing
  arcR: 2.06,           // ground arcade arch radius (5 bays of 4.12)
  gArcSpring: 19.8,     // gallery arcade springing
  gArcR: 1.472,         // gallery arch radius (7 bays of 2.944)
  aisleZ1: 30.6,        // inner face of outer aisle wall
  wallT: 1.4,
  naveW: -31, naveE: 31,      // flat west wall / east curved-wall face
  exAng: 54 * Math.PI / 180,  // exedra axis, from the E/W axis
  exR: 5.5,                   // exedra niche radius
  exSpring: 20.4,             // exedra conch springing
  apseR: 4.9,                 // apse radius (centre x = 30.2)
  apseCX: 30.2,
  bemaY: 0.35,                // raised sanctuary platform
  narthexW: -32.4, narthexE: -31,   // nave west wall slab
  narthex0: -38.2,            // narthex west face (inner)
  exoE: -39.6, exo0: -44.2,   // exonarthex
  atriumE: -45.6, atrium0: -88, // atrium court (inner faces)
  atriumZ: 24,                // court half-width
  eye: 1.7,
};

/* ---------- small helpers ---------- */
HS.rad = function (d) { return d * Math.PI / 180; };
HS.V3  = function (x, y, z) { return new THREE.Vector3(x, y, z); };

/* Seeded PRNG so the procedural marble is identical on every load. */
HS.rng = function (seed) {
  let s = seed >>> 0;
  return function () {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
};

/* ---------- geometry merge (positions/normals/uvs) ---------- */
HS.mergeGeoms = function (geoms) {
  let vc = 0;
  const list = geoms.map(g => g.index ? g.toNonIndexed() : g);
  list.forEach(g => { vc += g.attributes.position.count; });
  const pos = new Float32Array(vc * 3);
  const nor = new Float32Array(vc * 3);
  const uv  = new Float32Array(vc * 2);
  let o = 0;
  list.forEach(g => {
    const n = g.attributes.position.count;
    pos.set(g.attributes.position.array, o * 3);
    if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
    if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
    o += n;
  });
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal',   new THREE.BufferAttribute(nor, 3));
  out.setAttribute('uv',       new THREE.BufferAttribute(uv, 2));
  return out;
};

/* Accumulates transformed geometries per material, flushes 1 mesh. */
HS.builder = function (material, name) {
  const geoms = [];
  return {
    add(geo, x, y, z, rotY, rotX, rotZ, sc) {
      const m = new THREE.Matrix4();
      const e = new THREE.Euler(rotX || 0, rotY || 0, rotZ || 0, 'YXZ');
      m.compose(
        new THREE.Vector3(x || 0, y || 0, z || 0),
        new THREE.Quaternion().setFromEuler(e),
        new THREE.Vector3(sc || 1, sc || 1, sc || 1));
      const g = geo.clone(); g.applyMatrix4(m); geoms.push(g);
      return this;
    },
    raw(geo) { geoms.push(geo); return this; },
    flush(parent) {
      if (!geoms.length) return null;
      const mesh = new THREE.Mesh(HS.mergeGeoms(geoms), material);
      mesh.name = name || 'merged';
      mesh.matrixAutoUpdate = false;
      parent.add(mesh);
      geoms.length = 0;
      return mesh;
    }
  };
};

/* Keep faces of a (non-indexed) geometry whose centroid passes `test`. */
HS.filterFaces = function (geo, test) {
  const g = geo.index ? geo.toNonIndexed() : geo;
  const p = g.attributes.position.array,
        n = g.attributes.normal.array,
        u = g.attributes.uv ? g.attributes.uv.array : null;
  const P = [], N = [], U = [];
  for (let i = 0; i < p.length; i += 9) {
    const cx = (p[i] + p[i + 3] + p[i + 6]) / 3,
          cy = (p[i + 1] + p[i + 4] + p[i + 7]) / 3,
          cz = (p[i + 2] + p[i + 5] + p[i + 8]) / 3;
    if (!test(cx, cy, cz)) continue;
    for (let k = 0; k < 9; k++) { P.push(p[i + k]); N.push(n[i + k]); }
    if (u) { const j = (i / 9) * 6; for (let k = 0; k < 6; k++) U.push(u[j + k]); }
  }
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(new Float32Array(P), 3));
  out.setAttribute('normal',   new THREE.BufferAttribute(new Float32Array(N), 3));
  if (u) out.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(U), 2));
  return out;
};

/* Arch-topped rectangular Shape (door / window / arcade opening).
   w = width, hTot = total height, archR defaults to w/2. Origin at
   the bottom-centre. */
HS.archShapePath = function (w, hTot, archR) {
  const r = archR || w / 2, s = hTot - r;
  const p = new THREE.Path();
  p.moveTo(-w / 2, 0);
  p.lineTo(-w / 2, s);
  p.absarc(0, s, r, Math.PI, 0, true);
  p.lineTo(w / 2, 0);
  p.lineTo(-w / 2, 0);
  return p;
};

/* Wall (in local XY, extruded along +Z by `t`) with arch-topped holes.
   outline: array of [x,y] pts. holes: {x,y,w,h,r?} (y = sill). */
HS.wallWithHoles = function (outline, holes, t) {
  const sh = new THREE.Shape();
  outline.forEach((pt, i) => i ? sh.lineTo(pt[0], pt[1]) : sh.moveTo(pt[0], pt[1]));
  sh.closePath();
  (holes || []).forEach(h => {
    const r = (h.r !== undefined) ? h.r : h.w / 2;
    const path = new THREE.Path();
    const s = h.y + h.h - r;
    path.moveTo(h.x - h.w / 2, h.y);
    path.lineTo(h.x - h.w / 2, s);
    if (r > 0) path.absarc(h.x, s, h.w / 2, Math.PI, 0, true);
    else path.lineTo(h.x - h.w / 2, h.y + h.h), path.lineTo(h.x + h.w / 2, h.y + h.h);
    path.lineTo(h.x + h.w / 2, h.y);
    path.closePath();
    sh.holes.push(path);
  });
  const g = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: false, curveSegments: 24 });
  // scale UVs down so metre-scaled textures look right on extruded walls
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.25, uv.getY(i) * 0.25);
  return g;
};

/* Half-annulus arch band (archivolt): inner radius ri, outer ro,
   thickness t (extruded along local +Z), spanning angle a0..a1. */
HS.archBand = function (ri, ro, t, a0, a1) {
  const sh = new THREE.Shape();
  const A0 = (a0 === undefined) ? 0 : a0, A1 = (a1 === undefined) ? Math.PI : a1;
  sh.absarc(0, 0, ro, A0, A1, false);
  sh.absarc(0, 0, ri, A1, A0, true);
  sh.closePath();
  const g = new THREE.ExtrudeGeometry(sh, { depth: t, bevelEnabled: false, curveSegments: 48 });
  const uv = g.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * 0.25, uv.getY(i) * 0.25);
  return g;
};

/* Partial sphere shell. yBase..yTop measured from the sphere centre.
   phi0/phiL default to a full ring. */
HS.sphereBand = function (R, yBase, yTop, phi0, phiL, wSeg, hSeg) {
  const t0 = Math.acos(Math.min(1, Math.max(-1, yTop / R)));   // theta from +Y pole
  const t1 = Math.acos(Math.min(1, Math.max(-1, yBase / R)));
  return new THREE.SphereGeometry(R, wSeg || 64, hSeg || 16,
    phi0 || 0, (phiL === undefined) ? Math.PI * 2 : phiL, t0, t1 - t0);
};

/* Scale a geometry's UVs (for sphere/cylinder surfaces whose 0..1
   UV span covers many metres — retile so mosaic reads at 1:1). */
HS.scaleUV = function (geo, kx, ky) {
  const uv = geo.attributes.uv;
  for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * kx, uv.getY(i) * (ky || kx));
  return geo;
};

/* ---------- collision / walkable-floor registries ---------- */
HS.colliders = [];      // {kind:'box',x0,x1,z0,z1,y0,y1} | {kind:'cyl',x,z,r,y0,y1}
HS.floors = [];         // {x0,x1,z0,z1,y, ramp?:{axis,from,to,y0,y1}, circle?:{x,z,r}}

HS.addBox = function (x0, x1, z0, z1, y0, y1) {
  HS.colliders.push({ kind: 'box',
    x0: Math.min(x0, x1), x1: Math.max(x0, x1),
    z0: Math.min(z0, z1), z1: Math.max(z0, z1),
    y0: (y0 === undefined) ? 0 : y0, y1: (y1 === undefined) ? 30 : y1 });
};
HS.addCyl = function (x, z, r, y0, y1) {
  HS.colliders.push({ kind: 'cyl', x, z, r,
    y0: (y0 === undefined) ? 0 : y0, y1: (y1 === undefined) ? 12 : y1 });
};
HS.addFloor = function (spec) { HS.floors.push(spec); };

/* Highest walkable floor at (x,z) whose level is ≤ refY+climb. */
HS.groundY = function (x, z, refY) {
  let best = -1e9;
  const climb = 0.85;
  for (const f of HS.floors) {
    let inside, y = f.y;
    if (f.circle) {
      const dx = x - f.circle.x, dz = z - f.circle.z;
      inside = dx * dx + dz * dz <= f.circle.r * f.circle.r;
    } else {
      inside = x >= f.x0 && x <= f.x1 && z >= f.z0 && z <= f.z1;
    }
    if (!inside) continue;
    if (f.ramp) {
      const t = f.ramp.axis === 'x'
        ? (x - f.ramp.from) / (f.ramp.to - f.ramp.from)
        : (z - f.ramp.from) / (f.ramp.to - f.ramp.from);
      y = f.ramp.y0 + Math.min(1, Math.max(0, t)) * (f.ramp.y1 - f.ramp.y0);
    }
    if (y > best && y <= refY + climb) best = y;
  }
  return best === -1e9 ? 0 : best;
};
