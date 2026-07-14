/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — builders-world.js
   Scenery (columns, trees, temple, clouds) + obstacle props.
   Every obstacle carries userData.action: 'dodge' | 'jump' | 'slide'
   and userData.clearH (top of its hard collision volume).

   Look pass: every prop gets (a) a vertical vertex-colour ramp —
   AO-dark base → sun-lit top — via gradTint, (b) a soft contact blob
   so it sits ON the ground on every quality tier, (c) shared cached
   materials + a procedural fluting texture on the marble columns.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { PAL, ACT, rand, choice } from './config.js';
import { mat, toon, vtoon, glow, emissive, mesh, gradTint } from './gfx.js';
import { QUALITY } from './quality.js';

const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, s = 10) => new THREE.CylinderGeometry(rt, rb, h, s);
/* box/cyl with the vertical AO ramp pre-baked */
const gbox = (w, h, d, bot, top) => gradTint(box(w, h, d), bot, top);
const gcyl = (rt, rb, h, s, bot, top) => gradTint(cyl(rt, rb, h, s), bot, top);

/* ── soft contact blob — grounds props on every tier ───────────── */
const _blobGeo = new THREE.CircleGeometry(1, 18);
const _blobMat = new THREE.MeshBasicMaterial({
  color: 0x1f150a, transparent: true,
  opacity: QUALITY.shadows ? 0.13 : 0.26,   // carries grounding when no shadow map
  depthWrite: false,
});
function blob(r = 0.8, x = 0, z = 0) {
  const b = new THREE.Mesh(_blobGeo, _blobMat);
  b.rotation.x = -Math.PI / 2;
  b.position.set(x, 0.028, z);
  b.scale.setScalar(r);
  b.renderOrder = 1;
  return b;
}

/* ── lazy shared textured materials (need env → created on first use) */
let SM = null;
function M() {
  if (SM) return SM;
  // Doric fluting: soft vertical shading stripes, tiled around the shaft
  const c = document.createElement('canvas'); c.width = 128; c.height = 64;
  const x = c.getContext('2d');
  x.fillStyle = '#efe9d8'; x.fillRect(0, 0, 128, 64);
  const FL = 8, w = 128 / FL;
  for (let i = 0; i < FL; i++) {
    const g = x.createLinearGradient(i * w, 0, (i + 1) * w, 0);
    g.addColorStop(0.0, 'rgba(96,84,62,0.34)');
    g.addColorStop(0.24, 'rgba(255,255,255,0.10)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.30)');
    g.addColorStop(0.76, 'rgba(255,255,255,0.10)');
    g.addColorStop(1.0, 'rgba(96,84,62,0.34)');
    x.fillStyle = g; x.fillRect(i * w, 0, w, 64);
  }
  const fluteTex = new THREE.CanvasTexture(c);
  fluteTex.wrapS = THREE.RepeatWrapping; fluteTex.wrapT = THREE.RepeatWrapping;
  fluteTex.repeat.set(2, 1);
  fluteTex.anisotropy = QUALITY.anisotropy;

  SM = {
    // fluted marble shaft — vertex ramp + stripe map
    shaft: new THREE.MeshStandardMaterial({
      color: PAL.column, map: fluteTex, roughness: 0.74, metalness: 0,
      envMapIntensity: 0.7, vertexColors: true,
    }),
    // charcoal swift silhouettes
    bird: new THREE.MeshBasicMaterial({ color: 0x33291c }),
    // warm flame core + additive halo sprite for the lanterns
    flame: new THREE.MeshStandardMaterial({
      color: 0xFFCE7A, emissive: 0xFFA63C, emissiveIntensity: 2.6,
      roughness: 0.4, metalness: 0,
    }),
    glowSprite: makeGlowSprite(),
  };
  return SM;
}

function makeGlowSprite() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(32, 32, 2, 32, 32, 30);
  g.addColorStop(0, 'rgba(255,196,110,0.85)');
  g.addColorStop(0.4, 'rgba(255,160,70,0.30)');
  g.addColorStop(1, 'rgba(255,140,50,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  return new THREE.SpriteMaterial({ map: t, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
}

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
  const stoneDk = vtoon(PAL.columnDk);
  const base = mesh(gbox(1.05, 0.32, 1.05, 0.66, 1.0), stoneDk, 0, 0.16, 0);
  const shaft = mesh(gcyl(0.36, 0.44, height, 16, 0.72, 1.08), M().shaft, 0, height / 2 + 0.3, 0);
  const echinus = mesh(gcyl(0.5, 0.4, 0.22, 16, 0.9, 1.1), vtoon(PAL.column), 0, height + 0.4, 0);
  const abacus = mesh(gbox(0.95, 0.2, 0.95, 0.92, 1.12), stoneDk, 0, height + 0.6, 0);
  g.add(base, shaft, echinus, abacus, blob(0.95));
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
  const trunk = mesh(gcyl(0.14, 0.22, 1.4, 7, 0.6, 1.0), vtoon(PAL.trunk), 0, 0.7, 0);
  trunk.rotation.z = rand(-0.09, 0.09);
  const knot = mesh(gcyl(0.1, 0.15, 0.8, 6, 0.62, 1.0), vtoon(PAL.trunk), 0.14, 0.5, 0.05);
  knot.rotation.z = -0.5;
  const canopy = vtoon(PAL.olive);
  const canopyLt = vtoon(0x93AC6A);
  for (let i = 0; i < 4; i++) {
    const r = rand(0.7, 1.0);
    const p = mesh(gradTint(new THREE.IcosahedronGeometry(r, 1), 0.62, 1.16),
      i % 2 ? canopyLt : canopy,
      rand(-0.5, 0.5), 1.6 + rand(-0.2, 0.5), rand(-0.5, 0.5));
    p.rotation.set(rand(0, 3), rand(0, 3), 0);
    g.add(p);
  }
  g.add(trunk, knot, blob(1.1));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Cypress (tall spire, layered silhouette) ──────────────────── */
export function buildCypress() {
  const g = new THREE.Group();
  const trunk = mesh(gcyl(0.1, 0.14, 0.6, 6, 0.6, 1.0), vtoon(PAL.trunk), 0, 0.3, 0);
  const dark = vtoon(PAL.cypress);
  const body = mesh(gradTint(new THREE.ConeGeometry(0.72, 3.3, 9), 0.58, 1.14), dark, 0, 2.0, 0);
  const tip = mesh(gradTint(new THREE.ConeGeometry(0.42, 1.7, 8), 0.75, 1.2), vtoon(0x5A7A44), 0, 3.4, 0);
  g.add(trunk, body, tip, blob(0.7));
  g.rotation.z = rand(-0.035, 0.035);          // gentle organic lean
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* row of three cypresses — classic Greek roadside rhythm */
export function buildCypressRow() {
  const g = new THREE.Group();
  for (let i = 0; i < 3; i++) {
    const c = buildCypress();
    c.position.set(rand(-0.3, 0.3), 0, (i - 1) * rand(2.2, 3.0));
    c.scale.setScalar(rand(0.82, 1.12));
    g.add(c);
  }
  return g;
}

/* ── Distant temple (Parthenon-ish silhouette, sits on the horizon) ─ */
export function buildTemple() {
  const g = new THREE.Group();
  const stone = vtoon(PAL.pediment);
  const stepW = 9, stepD = 5;
  const crepis = mesh(gbox(stepW + 1.2, 0.5, stepD + 1.2, 0.7, 1.0), vtoon(PAL.columnDk), 0, 0.25, 0);
  const stylobate = mesh(gbox(stepW, 0.8, stepD, 0.72, 1.05), vtoon(PAL.columnDk), 0, 0.65, 0);
  g.add(crepis, stylobate);
  for (let i = 0; i < 7; i++) {
    const x = -stepW / 2 + 0.9 + i * ((stepW - 1.8) / 6);
    const col = mesh(gcyl(0.28, 0.32, 3.4, 10, 0.7, 1.1), stone, x, 1.05 + 1.7, stepD / 2 - 0.5);
    g.add(col);
  }
  const arch = mesh(gbox(stepW, 0.6, 1.2, 0.85, 1.08), stone, 0, 1.05 + 3.7, stepD / 2 - 0.5);
  const ped = mesh(gradTint(pedimentGeo(stepW, 1.4, 1.0), 0.82, 1.12), vtoon(PAL.roofTile), 0, 1.05 + 4.0, stepD / 2 - 0.5);
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
  const stoneDk = vtoon(PAL.columnDk);
  const cream = vtoon(PAL.pediment);
  const tile = vtoon(PAL.roofTile);

  // twin column pairs flanking the road, just outside the kerbs
  for (const side of [-1, 1]) {
    for (const off of [5.15, 6.35]) {
      const x = side * off;
      g.add(mesh(gbox(1.0, 0.34, 1.0, 0.66, 1.0), stoneDk, x, 0.17, 0));
      g.add(mesh(gcyl(0.34, 0.42, 5.3, 16, 0.74, 1.08), M().shaft, x, 2.99, 0));
      g.add(mesh(gcyl(0.48, 0.38, 0.2, 14, 0.9, 1.1), cream, x, 5.72, 0));
      g.add(mesh(gbox(0.9, 0.18, 0.9, 0.92, 1.1), stoneDk, x, 5.9, 0));
    }
    g.add(blob(1.6, side * 5.75, 0));
  }
  // architrave + frieze across the full span
  const architrave = mesh(gbox(14.1, 0.62, 1.3, 0.8, 1.06), cream, 0, 6.3, 0);
  const frieze = mesh(gbox(14.1, 0.44, 1.36, 0.94, 1.1), cream, 0, 6.83, 0);
  g.add(architrave, frieze);
  for (let i = 0; i < 9; i++) {                      // triglyph rhythm
    g.add(mesh(box(0.42, 0.44, 0.06), toon(PAL.columnDk), -6.4 + i * 1.6, 6.83, 0.72));
  }
  // central pediment (front-facing triangular prism) + geison + acroterion
  const ped = mesh(gradTint(pedimentGeo(7.2, 1.35, 1.0), 0.84, 1.12), cream, 0, 7.05, 0);
  const cap = mesh(gbox(7.6, 0.18, 1.2, 0.9, 1.08), tile, 0, 7.08, 0);
  const acro = mesh(new THREE.ConeGeometry(0.3, 0.55, 6), toon(PAL.roofTile), 0, 8.65, 0);
  g.add(ped, cap, acro);
  // twin votive braziers on the inner columns — living fire over the gate
  const fires = [];
  for (const side of [-1, 1]) {
    const bx = side * 5.15;
    const bowl = mesh(gcyl(0.34, 0.18, 0.28, 10, 0.8, 1.05), vtoon(PAL.bronzeDk), bx, 6.14, 0);
    const fire = mesh(new THREE.ConeGeometry(0.19, 0.5, 7), M().flame, bx, 6.5, 0);
    const halo = new THREE.Sprite(M().glowSprite);
    halo.position.set(bx, 6.55, 0.05); halo.scale.setScalar(1.7);
    g.add(bowl, fire, halo);
    fires.push({ fire, halo });
  }
  // flame flicker — world.js calls scenery tick(dt, t) each frame
  g.userData.tick = (dt, t) => {
    for (let i = 0; i < fires.length; i++) {
      const f = fires[i];
      f.fire.scale.y = 1 + Math.sin(t * 12 + i * 2.1) * 0.16 + Math.sin(t * 23 + i * 0.7) * 0.07;
      f.fire.rotation.y = t * 2.2 + i;
      f.halo.scale.setScalar(1.7 + Math.sin(t * 9 + i * 1.7) * 0.22);
    }
  };
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
  const marbleM = vtoon(PAL.column);
  const marbleDk = vtoon(PAL.columnDk);
  const pillar = mesh(gbox(0.44, 1.9, 0.4, 0.7, 1.08), marbleM, 0, 0.95, 0);
  const base = mesh(gbox(0.66, 0.22, 0.6, 0.62, 0.95), marbleDk, 0, 0.11, 0);
  const shoulders = mesh(gbox(0.68, 0.14, 0.42, 0.95, 1.1), marbleM, 0, 1.94, 0);
  const head = mesh(gradTint(new THREE.SphereGeometry(0.21, 12, 10), 0.88, 1.14), marbleM, 0, 2.2, 0);
  head.scale.set(0.92, 1.1, 0.95);
  const beard = mesh(new THREE.ConeGeometry(0.13, 0.3, 6), toon(PAL.columnDk), 0, 2.02, 0.13);
  beard.rotation.x = 0.5;
  g.add(base, pillar, shoulders, head, beard, blob(0.55));
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
    const c = vtoon(choice(clay));
    const bodyM = mesh(gradTint(new THREE.SphereGeometry(0.3, 10, 8), 0.68, 1.12), c, 0, 0.44, 0);
    bodyM.scale.set(1, 1.3, 1);
    const neck = mesh(gcyl(0.1, 0.16, 0.34, 8, 0.9, 1.1), c, 0, 0.88, 0);
    const foot = mesh(gcyl(0.14, 0.09, 0.18, 8, 0.6, 0.9), c, 0, 0.09, 0);
    a.add(bodyM, neck, foot);
    a.position.set(rand(-0.8, 0.8), 0, rand(-0.5, 0.5));
    a.scale.setScalar(rand(0.7, 1.0));
    if (Math.random() < 0.3) { a.rotation.z = 1.35; a.position.y = 0.12; }  // one toppled
    g.add(a);
  }
  g.add(blob(1.0));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Hanging lantern on a post — warm firefly of the night phase ── */
export function buildLantern() {
  const g = new THREE.Group();
  const wood = vtoon(PAL.trunk);
  const post = mesh(gcyl(0.07, 0.1, 2.7, 7, 0.62, 1.05), wood, 0, 1.35, 0);
  const arm = mesh(box(0.72, 0.07, 0.07), toon(PAL.trunk), 0.3, 2.62, 0);
  // swinging lamp assembly (tick animates this pivot)
  const swing = new THREE.Group();
  swing.position.set(0.62, 2.58, 0);
  const chain = mesh(cyl(0.012, 0.012, 0.24, 4), toon(PAL.bronzeDk), 0, -0.12, 0);
  const cage = mesh(gbox(0.22, 0.3, 0.22, 0.85, 1.1), vtoon(PAL.bronzeDk), 0, -0.4, 0);
  const core = mesh(new THREE.SphereGeometry(0.085, 8, 7), M().flame, 0, -0.4, 0);
  const halo = new THREE.Sprite(M().glowSprite);
  halo.position.set(0, -0.4, 0); halo.scale.setScalar(1.35);
  swing.add(chain, cage, core, halo);
  g.add(post, arm, swing, blob(0.4));
  const ph = rand(0, Math.PI * 2);
  g.userData.tick = (dt, t) => {
    swing.rotation.z = Math.sin(t * 1.6 + ph) * 0.085;
    halo.scale.setScalar(1.35 + Math.sin(t * 8 + ph) * 0.17);   // firelight breathes
  };
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Verge statue — robed marble figure on a pedestal ──────────── */
export function buildVergeStatue() {
  const g = new THREE.Group();
  const marbleM = vtoon(PAL.column);
  const marbleDk = vtoon(PAL.columnDk);
  const plinth = mesh(gbox(1.15, 0.35, 1.15, 0.62, 0.95), marbleDk, 0, 0.17, 0);
  const ped = mesh(gbox(0.85, 0.95, 0.85, 0.72, 1.05), marbleM, 0, 0.82, 0);
  const cornice = mesh(gbox(1.0, 0.14, 1.0, 0.95, 1.1), marbleDk, 0, 1.36, 0);
  const robe = mesh(gcyl(0.3, 0.46, 1.05, 10, 0.74, 1.06), marbleM, 0, 1.95, 0);
  const torso = mesh(gradTint(new THREE.CapsuleGeometry(0.26, 0.6, 4, 8), 0.85, 1.12), marbleM, 0, 2.7, 0);
  const head = mesh(gradTint(new THREE.SphereGeometry(0.2, 12, 10), 0.9, 1.15), marbleM, 0, 3.28, 0);
  const armR = mesh(gradTint(new THREE.CapsuleGeometry(0.09, 0.5, 4, 8), 0.9, 1.1), marbleM, 0.3, 2.85, 0.1);
  armR.rotation.z = -0.85; armR.rotation.x = -0.3;
  g.add(plinth, ped, cornice, robe, torso, head, armR, blob(0.85));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Verge market stall — awning + crates, faces the road ──────── */
export function buildVergeStall() {
  const g = new THREE.Group();
  const wood = vtoon(PAL.trunk);
  for (const [px, pz] of [[-1.0, 0.45], [1.0, 0.45], [-1.0, -0.45], [1.0, -0.45]]) {
    g.add(mesh(gbox(0.13, 2.0, 0.13, 0.6, 1.05), wood, px, 1.0, pz));
  }
  const table = mesh(gbox(2.3, 0.16, 1.05, 0.8, 1.1), wood, 0, 0.95, 0);
  const skirtCloth = mesh(gbox(2.3, 0.8, 0.06, 0.7, 1.05), vtoon(PAL.chiton), 0, 0.5, 0.5);
  g.add(table, skirtCloth);
  // sloped striped awning
  const stripeA = vtoon(PAL.terra), stripeB = vtoon(PAL.chiton);
  for (let i = 0; i < 6; i++) {
    const s = mesh(gbox(0.4, 0.05, 1.5, 0.95, 1.06), i % 2 ? stripeB : stripeA, -1.0 + i * 0.4, 2.06, 0.16);
    s.rotation.x = -0.3;
    g.add(s);
  }
  // produce: amphora + fruit bowls
  const pot = mesh(gradTint(new THREE.SphereGeometry(0.22, 9, 7), 0.7, 1.1), vtoon(PAL.roofTileDk), -0.7, 1.22, 0);
  pot.scale.set(1, 1.35, 1);
  g.add(pot);
  const fruits = [0xD9573D, 0xE8B23C, 0x8AA94F];
  for (let i = 0; i < 6; i++) {
    g.add(mesh(new THREE.SphereGeometry(0.09, 7, 6), toon(choice(fruits)), rand(-0.2, 0.9), 1.1, rand(-0.3, 0.3)));
  }
  g.add(blob(1.35));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Swift flock — dark silhouettes crossing the sky ───────────── */
export function buildBirdFlock() {
  const g = new THREE.Group();
  const bm = M().bird;
  const wingR = box(0.62, 0.035, 0.2); wingR.translate(0.31, 0, 0);
  const wingL = box(0.62, 0.035, 0.2); wingL.translate(-0.31, 0, 0);
  const bodyG = new THREE.CapsuleGeometry(0.07, 0.3, 3, 6);
  bodyG.rotateX(Math.PI / 2);
  const birds = [];
  const n = 3 + (Math.random() * 3 | 0);
  for (let i = 0; i < n; i++) {
    const b = new THREE.Group();
    const wl = new THREE.Mesh(wingL, bm);
    const wr = new THREE.Mesh(wingR, bm);
    const body = new THREE.Mesh(bodyG, bm);
    b.add(wl, wr, body);
    b.position.set(rand(-2.2, 2.2), rand(-0.8, 0.8), rand(-1.6, 1.6));
    b.scale.setScalar(rand(0.8, 1.25));
    g.add(b);
    birds.push({ grp: b, wl, wr, ph: rand(0, Math.PI * 2), spd: rand(9, 13) });
  }
  g.userData.birds = birds;
  return g;
}

/* ── Tholos shrine — round colonnade, mid-distance meadow jewel ── */
export function buildTholos() {
  const g = new THREE.Group();
  const cream = vtoon(PAL.pediment);
  const stoneDk = vtoon(PAL.columnDk);
  const base1 = mesh(gcyl(2.0, 2.25, 0.3, 14, 0.66, 0.98), stoneDk, 0, 0.15, 0);
  const base2 = mesh(gcyl(1.7, 1.95, 0.3, 14, 0.72, 1.02), cream, 0, 0.45, 0);
  g.add(base1, base2);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.add(mesh(gcyl(0.16, 0.2, 2.3, 10, 0.74, 1.08), M().shaft,
      Math.cos(a) * 1.32, 1.75, Math.sin(a) * 1.32));
  }
  const ring = mesh(gcyl(1.62, 1.62, 0.28, 14, 0.86, 1.08), cream, 0, 3.04, 0);
  const roof = mesh(gradTint(new THREE.ConeGeometry(1.85, 1.05, 14), 0.8, 1.16), vtoon(PAL.roofTile), 0, 3.7, 0);
  const finial = mesh(new THREE.SphereGeometry(0.14, 8, 6), vtoon(PAL.drachmaDk), 0, 4.32, 0);
  g.add(ring, roof, finial, blob(1.7));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return g;
}

/* ── Weathered boulder cluster — breaks up the open meadow ─────── */
export function buildRocks() {
  const g = new THREE.Group();
  const grey = vtoon(0xB9AE96);
  const greyDk = vtoon(0x998D74);
  const n = 2 + (Math.random() * 3 | 0);
  for (let i = 0; i < n; i++) {
    const r = rand(0.3, 0.85);
    const rock = mesh(gradTint(new THREE.DodecahedronGeometry(r, 0), 0.6, 1.14),
      i % 2 ? greyDk : grey, rand(-1.1, 1.1), r * 0.55, rand(-0.9, 0.9));
    rock.rotation.set(rand(0, 3), rand(0, 3), rand(0, 3));
    rock.scale.y = rand(0.55, 0.8);            // squat, half-buried
    g.add(rock);
  }
  g.add(blob(1.1));
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
    p.scale.y = 0.72;                       // flatter, more cumulus
    g.add(p);
  }
  g.userData.mat = m;   // game tints this with the day-night cycle
  return g;
}

/* ════════════════════════════════════════════════════════════════
   OBSTACLES — each tagged with required action.
════════════════════════════════════════════════════════════════ */

/* fallen column lying across a lane → JUMP over */
export function obFallenColumn() {
  const g = new THREE.Group();
  const drum = mesh(gcyl(0.55, 0.55, 2.3, 14, 0.66, 1.12), M().shaft, 0, 0.55, 0);
  drum.rotation.z = Math.PI / 2;
  const cap1 = mesh(gcyl(0.56, 0.5, 0.2, 14, 0.8, 1.05), vtoon(PAL.columnDk), 1.05, 0.55, 0); cap1.rotation.z = Math.PI / 2;
  const cap2 = mesh(gcyl(0.5, 0.56, 0.2, 14, 0.8, 1.05), vtoon(PAL.columnDk), -1.05, 0.55, 0); cap2.rotation.z = Math.PI / 2;
  // rubble chips at the break
  for (let i = 0; i < 3; i++) {
    g.add(mesh(gradTint(new THREE.DodecahedronGeometry(rand(0.09, 0.16)), 0.7, 1.05), vtoon(PAL.columnDk),
      rand(-1.3, 1.3), 0.09, rand(0.35, 0.7)));
  }
  g.add(drum, cap1, cap2, blob(1.5));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.JUMP, clearH: 1.15 };
  return g;
}

/* low archway spanning a lane → SLIDE under */
export function obArch() {
  const g = new THREE.Group();
  const tile = vtoon(PAL.roofTile);
  const pL = mesh(gbox(0.4, 2.6, 0.4, 0.68, 1.08), M().shaft, -1.05, 1.3, 0);
  const pR = mesh(gbox(0.4, 2.6, 0.4, 0.68, 1.08), M().shaft, 1.05, 1.3, 0);
  const lintel = mesh(gbox(2.7, 0.55, 0.6, 0.82, 1.1), vtoon(PAL.column), 0, 2.05, 0);
  const roof = mesh(gbox(3.0, 0.3, 0.8, 0.9, 1.12), tile, 0, 2.45, 0);
  g.add(pL, pR, lintel, roof, blob(0.5, -1.05, 0), blob(0.5, 1.05, 0));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.SLIDE, gapH: 1.5 };
  return g;
}

/* market stall (blocks a lane) → DODGE */
export function obStall() {
  const g = new THREE.Group();
  const wood = vtoon(PAL.trunk);
  const post = (x) => mesh(gbox(0.14, 2.1, 0.14, 0.6, 1.05), wood, x, 1.05, 0);
  const table = mesh(gbox(2.0, 0.18, 1.0, 0.78, 1.1), wood, 0, 1.0, 0);
  const stripeA = vtoon(PAL.roofTile), stripeB = vtoon(PAL.chiton);
  for (let i = 0; i < 5; i++) {
    const s = mesh(gbox(0.4, 0.06, 1.2, 0.95, 1.06), i % 2 ? stripeA : stripeB, -0.8 + i * 0.4, 2.15, 0.1);
    g.add(s);
  }
  const awning = mesh(gbox(2.2, 0.06, 1.25, 0.95, 1.06), stripeA, 0, 2.18, 0.1);
  awning.rotation.x = -0.18; awning.position.z = 0.25; awning.position.y = 2.0;
  for (let i = 0; i < 3; i++) {
    const pot = mesh(gcyl(0.1, 0.16, 0.4, 8, 0.75, 1.08), vtoon(PAL.roofTileDk), -0.6 + i * 0.6, 1.3, 0);
    g.add(pot);
  }
  g.add(post(-0.9), post(0.9), table, awning, blob(1.25));
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
    const c = vtoon(choice(clay));
    const bodyM = mesh(gradTint(new THREE.SphereGeometry(0.34, 10, 8), 0.66, 1.12), c, 0, 0.5, 0);
    bodyM.scale.set(1, 1.3, 1);
    const neck = mesh(gcyl(0.12, 0.18, 0.4, 8, 0.9, 1.1), c, 0, 1.0, 0);
    const footM = mesh(gcyl(0.16, 0.1, 0.2, 8, 0.6, 0.9), c, 0, 0.1, 0);
    a.add(bodyM, neck, footM);
    a.position.set(rand(-0.7, 0.7), 0, rand(-0.3, 0.3));
    a.scale.setScalar(rand(0.8, 1.05));
    g.add(a);
  }
  g.add(blob(1.1));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.JUMP, clearH: 1.25 };
  return g;
}

/* statue on pedestal (tall) → DODGE */
export function obStatue() {
  const g = new THREE.Group();
  const marbleM = vtoon(PAL.column);
  const ped = mesh(gbox(1.0, 1.1, 1.0, 0.64, 1.05), vtoon(PAL.columnDk), 0, 0.55, 0);
  const torso = mesh(gradTint(cap2(0.3, 0.9), 0.82, 1.1), marbleM, 0, 1.8, 0);
  const head = mesh(gradTint(new THREE.SphereGeometry(0.24, 12, 10), 0.9, 1.14), marbleM, 0, 2.5, 0);
  const arm = mesh(gradTint(cap2(0.1, 0.6), 0.9, 1.1), marbleM, 0.32, 2.1, 0); arm.rotation.z = -0.9;
  const robe = mesh(gcyl(0.34, 0.5, 0.9, 10, 0.72, 1.05), marbleM, 0, 1.3, 0);
  g.add(ped, robe, torso, arm, head, blob(0.9));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.DODGE, clearH: 99 };
  return g;
}

/* crack / pit in the road → JUMP */
export function obPit() {
  const g = new THREE.Group();
  // radial-gradient hole reads as depth instead of flat black
  const c = document.createElement('canvas'); c.width = 64; c.height = 64;
  const x = c.getContext('2d');
  const rg = x.createRadialGradient(32, 36, 4, 32, 32, 32);
  rg.addColorStop(0, '#050302'); rg.addColorStop(0.75, '#160e06'); rg.addColorStop(1, '#2b1c0c');
  x.fillStyle = rg; x.fillRect(0, 0, 64, 64);
  const holeTex = new THREE.CanvasTexture(c);
  const hole = mesh(new THREE.PlaneGeometry(2.2, 2.6),
    new THREE.MeshBasicMaterial({ map: holeTex }));
  hole.rotation.x = -Math.PI / 2; hole.position.y = 0.03;
  const edge = vtoon(PAL.roadEdge);
  const e1 = mesh(gbox(2.4, 0.18, 0.3, 0.7, 1.1), edge, 0, 0.08, -1.25);
  const e2 = mesh(gbox(2.4, 0.18, 0.3, 0.7, 1.1), edge, 0, 0.08, 1.25);
  // crumbled slabs tilting into the void
  const slabL = mesh(gbox(0.5, 0.07, 1.6, 0.85, 1.05), vtoon(PAL.columnDk), -1.05, 0.02, 0);
  slabL.rotation.z = 0.3;
  const slabR = mesh(gbox(0.5, 0.07, 1.6, 0.85, 1.05), vtoon(PAL.columnDk), 1.05, 0.02, 0);
  slabR.rotation.z = -0.3;
  g.add(hole, e1, e2, slabL, slabR);
  g.userData = { action: ACT.JUMP, clearH: 0.6 };
  return g;
}

/* rolling cart (tall load) → DODGE */
export function obCart() {
  const g = new THREE.Group();
  const wood = vtoon(PAL.trunk);
  const bed = mesh(gbox(1.6, 0.5, 1.1, 0.72, 1.08), wood, 0, 0.9, 0);
  const side = mesh(gbox(1.6, 0.5, 0.1, 0.8, 1.06), wood, 0, 1.2, 0.5);
  const wheelG = new THREE.TorusGeometry(0.42, 0.1, 6, 16);
  const wM = vtoon(PAL.bronzeDk);
  const w1 = mesh(gradTint(wheelG, 0.8, 1.08), wM, 0, 0.42, 0.55);
  const w2 = mesh(gradTint(wheelG.clone(), 0.8, 1.08), wM, 0, 0.42, -0.55);
  for (let i = 0; i < 3; i++) {
    const pot = mesh(gradTint(new THREE.SphereGeometry(0.28, 8, 6), 0.75, 1.1), vtoon(PAL.roofTile), -0.5 + i * 0.5, 1.5, 0);
    pot.scale.set(1, 1.3, 1);
    g.add(pot);
  }
  g.add(bed, side, w1, w2, blob(1.2));
  g.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  g.userData = { action: ACT.DODGE, clearH: 99 };
  return g;
}

function cap2(r, len) { return new THREE.CapsuleGeometry(r, len, 4, 8); }

/* low merchant table piled with fruit → VAULT over (jump) */
export function obVaultTable() {
  const g = new THREE.Group();
  const wood = vtoon(PAL.trunk);
  const top = mesh(gbox(2.1, 0.14, 0.95, 0.86, 1.1), wood, 0, 0.78, 0);
  const cloth = mesh(gbox(2.14, 0.1, 1.0, 0.8, 1.06), vtoon(PAL.terra), 0, 0.7, 0);
  const legFL = mesh(gbox(0.12, 0.72, 0.12, 0.6, 1.0), wood, -0.9, 0.36, 0.35);
  const legFR = mesh(gbox(0.12, 0.72, 0.12, 0.6, 1.0), wood, 0.9, 0.36, 0.35);
  const legBL = mesh(gbox(0.12, 0.72, 0.12, 0.6, 1.0), wood, -0.9, 0.36, -0.35);
  const legBR = mesh(gbox(0.12, 0.72, 0.12, 0.6, 1.0), wood, 0.9, 0.36, -0.35);
  g.add(top, cloth, legFL, legFR, legBL, legBR, blob(1.2));
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
  const wood = vtoon(PAL.trunk);
  const pL = mesh(gbox(0.22, 1.95, 0.22, 0.62, 1.06), wood, -1.2, 0.98, 0);
  const pR = mesh(gbox(0.22, 1.95, 0.22, 0.62, 1.06), wood, 1.2, 0.98, 0);
  const beam = mesh(gbox(3.0, 0.3, 0.5, 0.85, 1.1), vtoon(PAL.roofTileDk), 0, 2.02, 0);
  const braceL = mesh(box(0.1, 0.66, 0.1), toon(PAL.trunk), -0.98, 1.62, 0); braceL.rotation.z = 0.7;
  const braceR = mesh(box(0.1, 0.66, 0.1), toon(PAL.trunk), 0.98, 1.62, 0); braceR.rotation.z = -0.7;
  g.add(pL, pR, beam, braceL, braceR, blob(0.45, -1.2, 0), blob(0.45, 1.2, 0));
  // hanging cloth pennants (blue / terracotta / cream)
  const cols = [PAL.sash, PAL.terra, PAL.chiton];
  for (let i = 0; i < 4; i++) {
    const p = mesh(gbox(0.34, 0.42, 0.05, 0.86, 1.05), vtoon(cols[i % 3]), -0.85 + i * 0.56, 1.66, 0.08);
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
  const wood = vtoon(PAL.trunk);
  const bed = mesh(gbox(1.5, 0.42, 1.5, 0.72, 1.08), wood, 0, 0.85, 0);
  const front = mesh(gbox(1.5, 0.5, 0.12, 0.8, 1.08), wood, 0, 1.25, 0.75);
  const sideL = mesh(gbox(0.1, 0.4, 1.5, 0.8, 1.06), wood, -0.72, 1.2, 0);
  const sideR = mesh(gbox(0.1, 0.4, 1.5, 0.8, 1.06), wood, 0.72, 1.2, 0);
  g.add(bed, front, sideL, sideR, blob(1.25));
  // big side wheels in spin-wrappers (world.js spins wrapper.rotation.x)
  const wheels = [];
  for (const side of [-1, 1]) {
    const wrap = new THREE.Group();
    wrap.position.set(side * 0.85, 0.52, 0);
    const tyre = mesh(new THREE.TorusGeometry(0.5, 0.11, 6, 16), vtoon(PAL.bronzeDk), 0, 0, 0);
    gradTint(tyre.geometry, 0.85, 1.08);
    tyre.rotation.y = Math.PI / 2;
    for (let s = 0; s < 4; s++) {
      const spoke = mesh(box(0.05, 0.9, 0.05), toon(PAL.trunk), 0, 0, 0);
      spoke.rotation.x = (s / 4) * Math.PI;
      wrap.add(spoke);
    }
    wrap.add(tyre);
    g.add(wrap);
    wheels.push(wrap);
  }
  // toppling amphorae load
  for (let i = 0; i < 3; i++) {
    const pot = mesh(gradTint(new THREE.SphereGeometry(0.26, 8, 6), 0.75, 1.1), vtoon(i % 2 ? PAL.roofTile : PAL.roofTileDk),
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
  const wood = vtoon(PAL.trunk);
  const pL = mesh(gbox(0.18, 2.2, 0.18, 0.62, 1.06), wood, -1.15, 1.1, 0.32);
  const pR = mesh(gbox(0.18, 2.2, 0.18, 0.62, 1.06), wood, 1.15, 1.1, 0.32);
  const bar = mesh(box(2.6, 0.12, 0.12), toon(PAL.trunk), 0, 2.14, 0.32);
  g.add(pL, pR, bar, blob(0.45, -1.15, 0.32), blob(0.45, 1.15, 0.32));
  // sloped striped canvas (terracotta / cream, black-figure market colours)
  const stripeA = vtoon(PAL.terra), stripeB = vtoon(PAL.chiton);
  for (let i = 0; i < 6; i++) {
    const s = mesh(gbox(0.42, 0.05, 1.45, 0.92, 1.08), i % 2 ? stripeB : stripeA, -1.05 + i * 0.42, 2.02, -0.22);
    s.rotation.x = -0.4;
    g.add(s);
  }
  // scalloped hem swinging at the low edge
  for (let i = 0; i < 6; i++) {
    const h = mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.05, 8), i % 2 ? toon(PAL.terra) : toon(PAL.chiton),
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
