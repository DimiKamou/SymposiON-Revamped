/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — builders-world.js
   Scenery (columns, trees, temple, clouds) + obstacle props.
   Every obstacle carries userData.action: 'dodge' | 'jump' | 'slide'
   and userData.clearH (top of its hard collision volume).
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { PAL, ACT, rand, choice } from './config.js';
import { mat, toon, glow, mesh } from './gfx.js';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s = 10) => new THREE.CylinderGeometry(rt, rb, h, s);

/* triangular prism whose face looks down the road (±Z), apex up.
   width = full base width, height = apex above base, depth = thickness */
function pedimentGeo(width, height, depth) {
  const g = new THREE.CylinderGeometry(1, 1, depth, 3, 1);
  g.rotateX(Math.PI / 2);        // triangle face now in the XY plane
  g.rotateZ(Math.PI);            // apex up, base horizontal
  // 3-gon: apex at y=+1, base at y=-0.5, half-width 0.866
  g.scale(width / 1.732, height / 1.5, 1);
  g.translate(0, height / 3, 0); // base sits on y=0
  return g;
}

/* ── Doric column (side scenery; tall & elegant) ───────────────── */
export function buildColumn(height = 5.5) {
  const g = new THREE.Group();
  const stone = toon(PAL.column);
  const stoneDk = toon(PAL.columnDk);
  const base = mesh(box(1.05, 0.32, 1.05), stoneDk, 0, 0.16, 0);
  const shaft = mesh(cyl(0.36, 0.44, height, 12), stone, 0, height / 2 + 0.3, 0);
  const echinus = mesh(cyl(0.5, 0.4, 0.22, 12), stone, 0, height + 0.4, 0);
  const abacus = mesh(box(0.95, 0.2, 0.95), stoneDk, 0, height + 0.6, 0);
  g.add(base, shaft, echinus, abacus);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* a broken/half column (varied skyline) */
export function buildBrokenColumn() {
  const g = buildColumn(rand(2.2, 3.6));
  return g;
}

/* ── Olive tree (round canopy) ─────────────────────────────────── */
export function buildOlive() {
  const g = new THREE.Group();
  const trunk = mesh(cyl(0.14, 0.2, 1.4, 6), toon(PAL.trunk), 0, 0.7, 0);
  const canopy = toon(PAL.olive);
  for (let i = 0; i < 4; i++) {
    const r = rand(0.7, 1.0);
    const p = mesh(new THREE.IcosahedronGeometry(r, 0), canopy,
      rand(-0.5, 0.5), 1.6 + rand(-0.2, 0.5), rand(-0.5, 0.5));
    g.add(p);
  }
  g.add(trunk);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Cypress (tall spire) ──────────────────────────────────────── */
export function buildCypress() {
  const g = new THREE.Group();
  const trunk = mesh(cyl(0.1, 0.14, 0.6, 6), toon(PAL.trunk), 0, 0.3, 0);
  const body = mesh(new THREE.ConeGeometry(0.7, 3.6, 8), toon(PAL.cypress), 0, 2.2, 0);
  g.add(trunk, body);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Distant temple (Parthenon-ish silhouette, sits on the horizon) ─ */
export function buildTemple() {
  const g = new THREE.Group();
  const stone = mat(PAL.pediment);
  const stepW = 9, stepD = 5;
  const stylobate = mesh(box(stepW, 0.8, stepD), toon(PAL.columnDk), 0, 0.4, 0);
  g.add(stylobate);
  for (let i = 0; i < 7; i++) {
    const x = -stepW / 2 + 0.9 + i * ((stepW - 1.8) / 6);
    const col = mesh(cyl(0.28, 0.32, 3.4, 8), stone, x, 0.8 + 1.7, stepD / 2 - 0.5);
    g.add(col);
  }
  const arch = mesh(box(stepW, 0.6, 1.2), stone, 0, 0.8 + 3.7, stepD / 2 - 0.5);
  const ped = mesh(pedimentGeo(stepW, 1.4, 1.0), toon(PAL.roofTile), 0, 0.8 + 4.0, stepD / 2 - 0.5);
  g.add(arch, ped);
  g.scale.setScalar(1.0);
  return g;
}

/* ── Propylaea — monumental gate spanning the whole road ────────
   Pure scenery (no collision): you run beneath it. Passing under a
   marble gateway every few hundred metres gives the endless road a
   sense of place and rhythm — the Subway-Surfers "tunnel" beat.    */
export function buildPropylaea() {
  const g = new THREE.Group();
  const stone = toon(PAL.column);
  const stoneDk = toon(PAL.columnDk);
  const cream = toon(PAL.pediment);
  const tile = toon(PAL.roofTile);

  // twin column pairs flanking the road, just outside the kerbs
  for (const side of [-1, 1]) {
    for (const off of [5.15, 6.35]) {
      const x = side * off;
      g.add(mesh(box(1.0, 0.34, 1.0), stoneDk, x, 0.17, 0));
      g.add(mesh(cyl(0.34, 0.42, 5.3, 12), stone, x, 2.99, 0));
      g.add(mesh(cyl(0.48, 0.38, 0.2, 12), stone, x, 5.72, 0));
      g.add(mesh(box(0.9, 0.18, 0.9), stoneDk, x, 5.9, 0));
    }
  }
  // architrave + frieze across the full span
  const architrave = mesh(box(14.1, 0.62, 1.3), stone, 0, 6.3, 0);
  const frieze = mesh(box(14.1, 0.44, 1.36), cream, 0, 6.83, 0);
  g.add(architrave, frieze);
  for (let i = 0; i < 9; i++) {                      // triglyph rhythm
    g.add(mesh(box(0.42, 0.44, 0.06), stoneDk, -6.4 + i * 1.6, 6.83, 0.72));
  }
  // central pediment (front-facing triangular prism) + geison + acroterion
  const ped = mesh(pedimentGeo(7.2, 1.35, 1.0), cream, 0, 7.05, 0);
  const cap = mesh(box(7.6, 0.18, 1.2), tile, 0, 7.08, 0);
  const acro = mesh(new THREE.ConeGeometry(0.3, 0.55, 6), tile, 0, 8.65, 0);
  g.add(ped, cap, acro);
  // festival garland — pennants strung beneath the architrave
  const rope = mesh(box(11.6, 0.045, 0.045), toon(PAL.trunk), 0, 5.9, 0.4);
  g.add(rope);
  const cols = [PAL.sash, PAL.terra, PAL.drachma, PAL.olive];
  for (let i = 0; i < 8; i++) {
    const p = mesh(box(0.42, 0.5, 0.045), toon(cols[i % 4]), -4.9 + i * 1.4, 5.62, 0.4);
    p.rotation.x = rand(-0.1, 0.1);
    p.rotation.z = rand(-0.08, 0.08);
    g.add(p);
  }
  g.traverse((o) => { if (o.isMesh) { o.castShadow = true; o.receiveShadow = true; } });
  return g;
}

/* ── Herm — square marble pillar topped with a bearded head ────── */
export function buildHerm() {
  const g = new THREE.Group();
  const marbleM = toon(PAL.column);
  const marbleDk = toon(PAL.columnDk);
  const pillar = mesh(box(0.44, 1.9, 0.4), marbleM, 0, 0.95, 0);
  const base = mesh(box(0.66, 0.22, 0.6), marbleDk, 0, 0.11, 0);
  const shoulders = mesh(box(0.68, 0.14, 0.42), marbleM, 0, 1.94, 0);
  const head = mesh(new THREE.SphereGeometry(0.21, 10, 8), marbleM, 0, 2.2, 0);
  head.scale.set(0.92, 1.1, 0.95);
  const beard = mesh(new THREE.ConeGeometry(0.13, 0.3, 6), marbleDk, 0, 2.02, 0.13);
  beard.rotation.x = 0.5;
  g.add(base, pillar, shoulders, head, beard);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Amphora cluster resting on the verge (scenery, off-road) ──── */
export function buildVergeAmphorae() {
  const g = new THREE.Group();
  const clay = [PAL.roofTile, PAL.roofTileDk, PAL.drachmaDk];
  const n = 2 + (Math.random() * 3 | 0);
  for (let i = 0; i < n; i++) {
    const a = new THREE.Group();
    const c = toon(choice(clay));
    const bodyM = mesh(new THREE.SphereGeometry(0.3, 10, 8), c, 0, 0.44, 0);
    bodyM.scale.set(1, 1.3, 1);
    const neck = mesh(cyl(0.1, 0.16, 0.34, 8), c, 0, 0.88, 0);
    const foot = mesh(cyl(0.14, 0.09, 0.18, 8), c, 0, 0.09, 0);
    a.add(bodyM, neck, foot);
    a.position.set(rand(-0.8, 0.8), 0, rand(-0.5, 0.5));
    a.scale.setScalar(rand(0.7, 1.0));
    if (Math.random() < 0.3) { a.rotation.z = 1.35; a.position.y = 0.12; }  // one toppled
    g.add(a);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Cloud billboard puff ──────────────────────────────────────── */
export function buildCloud() {
  const g = new THREE.Group();
  const m = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.92 });
  for (let i = 0; i < 5; i++) {
    const r = rand(1.4, 2.6);
    const p = mesh(new THREE.SphereGeometry(r, 8, 6), m, rand(-3.5, 3.5), rand(-0.6, 0.6), rand(-1, 1));
    g.add(p);
  }
  return g;
}

/* ════════════════════════════════════════════════════════════════
   OBSTACLES — each tagged with required action.
════════════════════════════════════════════════════════════════ */

/* fallen column lying across a lane → JUMP over */
export function obFallenColumn() {
  const g = new THREE.Group();
  const stone = toon(PAL.column);
  const drum = mesh(cyl(0.55, 0.55, 2.3, 12), stone, 0, 0.55, 0);
  drum.rotation.z = Math.PI / 2;
  const cap1 = mesh(cyl(0.56, 0.5, 0.2, 12), toon(PAL.columnDk), 1.05, 0.55, 0); cap1.rotation.z = Math.PI / 2;
  const cap2 = mesh(cyl(0.5, 0.56, 0.2, 12), toon(PAL.columnDk), -1.05, 0.55, 0); cap2.rotation.z = Math.PI / 2;
  g.add(drum, cap1, cap2);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.JUMP, clearH: 1.15 };
  return g;
}

/* low archway spanning a lane → SLIDE under */
export function obArch() {
  const g = new THREE.Group();
  const stone = toon(PAL.column);
  const tile = toon(PAL.roofTile);
  const pL = mesh(box(0.4, 2.6, 0.4), stone, -1.05, 1.3, 0);
  const pR = mesh(box(0.4, 2.6, 0.4), stone, 1.05, 1.3, 0);
  const lintel = mesh(box(2.7, 0.55, 0.6), stone, 0, 2.05, 0);
  const roof = mesh(box(3.0, 0.3, 0.8), tile, 0, 2.45, 0);
  g.add(pL, pR, lintel, roof);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.SLIDE, gapH: 1.5 };
  return g;
}

/* market stall (blocks a lane) → DODGE */
export function obStall() {
  const g = new THREE.Group();
  const wood = toon(PAL.trunk);
  const post = (x) => mesh(box(0.14, 2.1, 0.14), wood, x, 1.05, 0);
  const table = mesh(box(2.0, 0.18, 1.0), wood, 0, 1.0, 0);
  const stripeA = toon(PAL.roofTile), stripeB = toon(PAL.chiton);
  for (let i = 0; i < 5; i++) {
    const s = mesh(box(0.4, 0.06, 1.2), i % 2 ? stripeA : stripeB, -0.8 + i * 0.4, 2.15, 0.1);
    g.add(s);
  }
  const awning = mesh(box(2.2, 0.06, 1.25), stripeA, 0, 2.18, 0.1);
  awning.rotation.x = -0.18; awning.position.z = 0.25; awning.position.y = 2.0;
  for (let i = 0; i < 3; i++) {
    const pot = mesh(cyl(0.1, 0.16, 0.4, 8), toon(PAL.roofTileDk), -0.6 + i * 0.6, 1.3, 0);
    g.add(pot);
  }
  g.add(post(-0.9), post(0.9), table, awning);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.DODGE, clearH: 99 };
  return g;
}

/* amphora cluster (low) → JUMP */
export function obAmphorae() {
  const g = new THREE.Group();
  const clay = [PAL.roofTile, PAL.roofTileDk, PAL.drachmaDk];
  const n = 2 + (Math.random() * 2 | 0);
  for (let i = 0; i < n; i++) {
    const a = new THREE.Group();
    const c = toon(choice(clay));
    const bodyM = mesh(new THREE.SphereGeometry(0.34, 10, 8), c, 0, 0.5, 0);
    bodyM.scale.set(1, 1.3, 1);
    const neck = mesh(cyl(0.12, 0.18, 0.4, 8), c, 0, 1.0, 0);
    const footM = mesh(cyl(0.16, 0.1, 0.2, 8), c, 0, 0.1, 0);
    a.add(bodyM, neck, footM);
    a.position.set(rand(-0.7, 0.7), 0, rand(-0.3, 0.3));
    a.scale.setScalar(rand(0.8, 1.05));
    g.add(a);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.JUMP, clearH: 1.25 };
  return g;
}

/* statue on pedestal (tall) → DODGE */
export function obStatue() {
  const g = new THREE.Group();
  const marbleM = toon(PAL.column);
  const ped = mesh(box(1.0, 1.1, 1.0), toon(PAL.columnDk), 0, 0.55, 0);
  const torso = mesh(cap2(0.3, 0.9), marbleM, 0, 1.8, 0);
  const head = mesh(new THREE.SphereGeometry(0.24, 10, 8), marbleM, 0, 2.5, 0);
  const arm = mesh(cap2(0.1, 0.6), marbleM, 0.32, 2.1, 0); arm.rotation.z = -0.9;
  const robe = mesh(cyl(0.34, 0.5, 0.9, 10), marbleM, 0, 1.3, 0);
  g.add(ped, robe, torso, arm, head);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.DODGE, clearH: 99 };
  return g;
}

/* crack / pit in the road → JUMP */
export function obPit() {
  const g = new THREE.Group();
  const hole = mesh(new THREE.PlaneGeometry(2.2, 2.6),
    new THREE.MeshBasicMaterial({ color: 0x140e06 }));
  hole.rotation.x = -Math.PI / 2; hole.position.y = 0.03;
  const edge = toon(PAL.roadEdge);
  const e1 = mesh(box(2.4, 0.18, 0.3), edge, 0, 0.08, -1.25);
  const e2 = mesh(box(2.4, 0.18, 0.3), edge, 0, 0.08, 1.25);
  g.add(hole, e1, e2);
  g.userData = { action: ACT.JUMP, clearH: 0.6 };
  return g;
}

/* rolling cart (tall load) → DODGE */
export function obCart() {
  const g = new THREE.Group();
  const wood = toon(PAL.trunk);
  const bed = mesh(box(1.6, 0.5, 1.1), wood, 0, 0.9, 0);
  const side = mesh(box(1.6, 0.5, 0.1), toon(PAL.trunk), 0, 1.2, 0.5);
  const wheelG = new THREE.TorusGeometry(0.42, 0.1, 6, 16);
  const wM = toon(PAL.bronzeDk);
  const w1 = mesh(wheelG, wM, 0, 0.42, 0.55);
  const w2 = mesh(wheelG, wM, 0, 0.42, -0.55);
  for (let i = 0; i < 3; i++) {
    const pot = mesh(new THREE.SphereGeometry(0.28, 8, 6), toon(PAL.roofTile), -0.5 + i * 0.5, 1.5, 0);
    pot.scale.set(1, 1.3, 1);
    g.add(pot);
  }
  g.add(bed, side, w1, w2);
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.DODGE, clearH: 99 };
  return g;
}

function cap2(r, len) { return new THREE.CapsuleGeometry(r, len, 4, 8); }

/* low merchant table piled with fruit → VAULT over (jump) */
export function obVaultTable() {
  const g = new THREE.Group();
  const wood = toon(PAL.trunk);
  const top = mesh(box(2.1, 0.14, 0.95), wood, 0, 0.78, 0);
  const cloth = mesh(box(2.14, 0.1, 1.0), toon(PAL.terra), 0, 0.7, 0);
  const legFL = mesh(box(0.12, 0.72, 0.12), wood, -0.9, 0.36, 0.35);
  const legFR = mesh(box(0.12, 0.72, 0.12), wood, 0.9, 0.36, 0.35);
  const legBL = mesh(box(0.12, 0.72, 0.12), wood, -0.9, 0.36, -0.35);
  const legBR = mesh(box(0.12, 0.72, 0.12), wood, 0.9, 0.36, -0.35);
  g.add(top, cloth, legFL, legFR, legBL, legBR);
  // fruit piles (figs / pomegranates / quinces)
  const fruits = [0xD9573D, 0xE8B23C, 0x8AA94F];
  for (let i = 0; i < 8; i++) {
    const f = mesh(new THREE.SphereGeometry(0.11 + Math.random() * 0.05, 8, 6),
      toon(choice(fruits)), rand(-0.85, 0.85), 0.93, rand(-0.3, 0.3));
    g.add(f);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.JUMP, clearH: 1.0 };
  return g;
}

/* stoa scaffold beam hung with pennants → SLIDE / roll under */
export function obBeam() {
  const g = new THREE.Group();
  const wood = toon(PAL.trunk);
  const pL = mesh(box(0.22, 1.95, 0.22), wood, -1.2, 0.98, 0);
  const pR = mesh(box(0.22, 1.95, 0.22), wood, 1.2, 0.98, 0);
  const beam = mesh(box(3.0, 0.3, 0.5), toon(PAL.roofTileDk), 0, 2.02, 0);
  const braceL = mesh(box(0.1, 0.66, 0.1), wood, -0.98, 1.62, 0); braceL.rotation.z = 0.7;
  const braceR = mesh(box(0.1, 0.66, 0.1), wood, 0.98, 1.62, 0); braceR.rotation.z = -0.7;
  g.add(pL, pR, beam, braceL, braceR);
  // hanging cloth pennants (blue / terracotta / cream)
  const cols = [PAL.sash, PAL.terra, PAL.chiton];
  for (let i = 0; i < 4; i++) {
    const p = mesh(box(0.34, 0.42, 0.05), toon(cols[i % 3]), -0.85 + i * 0.56, 1.66, 0.08);
    p.rotation.x = rand(-0.12, 0.12);
    g.add(p);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.SLIDE, gapH: 1.45 };
  return g;
}

/* runaway merchant cart — rolls TOWARD you faster than the road → DODGE */
export function obRunawayCart() {
  const g = new THREE.Group();
  const wood = toon(PAL.trunk);
  const bed = mesh(box(1.5, 0.42, 1.5), wood, 0, 0.85, 0);
  const front = mesh(box(1.5, 0.5, 0.12), wood, 0, 1.25, 0.75);
  const sideL = mesh(box(0.1, 0.4, 1.5), wood, -0.72, 1.2, 0);
  const sideR = mesh(box(0.1, 0.4, 1.5), wood, 0.72, 1.2, 0);
  g.add(bed, front, sideL, sideR);
  // big side wheels in spin-wrappers (world.js spins wrapper.rotation.x)
  const wheels = [];
  for (const side of [-1, 1]) {
    const wrap = new THREE.Group();
    wrap.position.set(side * 0.85, 0.52, 0);
    const tyre = mesh(new THREE.TorusGeometry(0.5, 0.11, 6, 16), toon(PAL.bronzeDk), 0, 0, 0);
    tyre.rotation.y = Math.PI / 2;
    for (let s = 0; s < 4; s++) {
      const spoke = mesh(box(0.05, 0.9, 0.05), wood, 0, 0, 0);
      spoke.rotation.x = (s / 4) * Math.PI;
      wrap.add(spoke);
    }
    wrap.add(tyre);
    g.add(wrap);
    wheels.push(wrap);
  }
  // toppling amphorae load
  for (let i = 0; i < 3; i++) {
    const pot = mesh(new THREE.SphereGeometry(0.26, 8, 6), toon(i % 2 ? PAL.roofTile : PAL.roofTileDk),
      -0.4 + i * 0.4, 1.32, rand(-0.2, 0.2));
    pot.scale.set(1, 1.35, 1);
    pot.rotation.z = rand(-0.25, 0.25);
    g.add(pot);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.DODGE, clearH: 99, moving: true, zSpeed: 7, wheels };
  return g;
}

/* striped shop awning slung low across the lane → SLIDE under */
export function obAwning() {
  const g = new THREE.Group();
  const wood = toon(PAL.trunk);
  const pL = mesh(box(0.18, 2.2, 0.18), wood, -1.15, 1.1, 0.32);
  const pR = mesh(box(0.18, 2.2, 0.18), wood, 1.15, 1.1, 0.32);
  const bar = mesh(box(2.6, 0.12, 0.12), wood, 0, 2.14, 0.32);
  g.add(pL, pR, bar);
  // sloped striped canvas (terracotta / cream, black-figure market colours)
  const stripeA = toon(PAL.terra), stripeB = toon(PAL.chiton);
  for (let i = 0; i < 6; i++) {
    const s = mesh(box(0.42, 0.05, 1.45), i % 2 ? stripeB : stripeA, -1.05 + i * 0.42, 2.02, -0.22);
    s.rotation.x = -0.4;
    g.add(s);
  }
  // scalloped hem swinging at the low edge
  for (let i = 0; i < 6; i++) {
    const h = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 8), i % 2 ? stripeA : stripeB,
      -1.05 + i * 0.42, 1.66, 0.42);
    h.rotation.x = Math.PI / 2;
    g.add(h);
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.SLIDE, gapH: 1.4 };
  return g;
}

/* registry → world.js picks by action need */
export const OBSTACLES = {
  jump:  [obFallenColumn, obAmphorae, obPit, obVaultTable],
  slide: [obArch, obBeam, obAwning],
  dodge: [obStall, obStatue, obCart, obRunawayCart],
};
