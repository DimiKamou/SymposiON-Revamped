/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — builders-actors.js
   Runner (Νεανίας / Κορασίδα, fully rigged), Talos chaser,
   drachma coins, power-up pickups.

   2026 resculpt: organic lathe/capsule volumes, sphere joints,
   real faces, cloth that reads as cloth. The runner is modelled
   facing -z (back to the camera, Subway-Surfers framing). The
   hunters are AUTHORED facing +z but their roots are pre-rotated
   π on Y, so during the chase they too face -z — backs to the
   camera, bearing down on the runner ahead of them.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { PAL } from './config.js';
import { mat, toon, vtoon, marble, metal, vmetal, glow, emissive, mesh, gradTint } from './gfx.js';
import { QUALITY } from './quality.js';

const cap = (r, len, rad = 5, cap2 = 8) => new THREE.CapsuleGeometry(r, len, rad, cap2);
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

/* segment budget per quality tier — the whole cast shares these */
const HQ = QUALITY.tier !== 'low';
const RS = HQ ? 18 : 11;   // lathe / cylinder radial segments
const SW = HQ ? 18 : 12;   // sphere width segments
const SH = HQ ? 14 : 9;    // sphere height segments

/* ── shared geometry memo (heroes are rebuilt on picker toggle) ── */
const _geo = new Map();
function memoGeo(key, make) {
  let g = _geo.get(key);
  if (!g) { g = make(); _geo.set(key, g); }
  return g;
}
const sphGeo = (r) => memoGeo('s' + r, () => new THREE.SphereGeometry(r, SW, SH));
const capGeo = (r, len) => memoGeo('c' + r + '_' + len, () => new THREE.CapsuleGeometry(r, len, HQ ? 6 : 4, RS));

/* tapered limb segment — lathe with a gentle muscle bulge.
   Origin at the TOP joint; the flesh runs down to y = -len. */
function limbGeo(r1, r2, len) {
  return memoGeo(`l${r1}_${r2}_${len}`, () => {
    const pts = [];
    const N = 7;
    for (let i = N; i >= 0; i--) {          // bottom → top for outward normals
      const t = i / N;
      const ease = t * t * (3 - 2 * t);
      const bulge = 1 + 0.09 * Math.sin(Math.PI * Math.min(1, t * 1.25));
      pts.push(new THREE.Vector2((r1 + (r2 - r1) * ease) * bulge, -len * ease));
    }
    return new THREE.LatheGeometry(pts, RS);
  });
}

/* lathe from a raw [radius, y] profile (bottom → top) */
function latheGeo(key, profile, tint) {
  return memoGeo('L' + key, () => {
    const g = new THREE.LatheGeometry(profile.map(([r, y]) => new THREE.Vector2(r, y)), RS);
    if (tint) gradTint(g, tint[0], tint[1]);
    return g;
  });
}

/* joint sphere helper */
const joint = (r, m, x = 0, y = 0, z = 0) => mesh(sphGeo(r), m, x, y, z);

/* ── procedural meander (Greek key) trim texture ────────────────── */
const _meanderTex = new Map();
function meanderTex(bg, fg) {
  const key = bg + '_' + fg;
  let t = _meanderTex.get(key);
  if (t) return t;
  const c = document.createElement('canvas');
  c.width = 256; c.height = 32;
  const x = c.getContext('2d');
  x.fillStyle = bg; x.fillRect(0, 0, 256, 32);
  x.strokeStyle = fg; x.lineWidth = 3; x.lineCap = 'square'; x.lineJoin = 'miter';
  for (let i = 0; i < 8; i++) {
    const o = i * 32;
    x.beginPath();
    x.moveTo(o + 2, 25);
    x.lineTo(o + 25, 25); x.lineTo(o + 25, 8); x.lineTo(o + 9, 8);
    x.lineTo(o + 9, 18); x.lineTo(o + 17, 18); x.lineTo(o + 17, 13);
    x.stroke();
  }
  x.fillStyle = fg; x.fillRect(0, 1, 256, 2); x.fillRect(0, 29, 256, 2);
  t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping;
  t.repeat.set(2, 1);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = QUALITY.anisotropy || 4;
  _meanderTex.set(key, t);
  return t;
}
/* soft radial sprite for back-glow quads — additive rim light with a real
   falloff instead of a hard-edged rectangle */
let _radialTex = null;
function radialGlowTex() {
  if (_radialTex) return _radialTex;
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const x = c.getContext('2d');
  const g = x.createRadialGradient(64, 64, 6, 64, 64, 64);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.45, 'rgba(255,255,255,0.55)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, 0, 128, 128);
  _radialTex = new THREE.CanvasTexture(c);
  return _radialTex;
}

const _meanderMat = new Map();
function meanderMat(bg, fg) {
  const key = bg + '_' + fg;
  let m = _meanderMat.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({ map: meanderTex(bg, fg), roughness: 0.7, metalness: 0.0, envMapIntensity: 0.6 });
    _meanderMat.set(key, m);
  }
  return m;
}

/* ── shared face materials (module-level so rebuilds don't leak) ── */
let _face = null;
function faceMats() {
  if (_face) return _face;
  _face = {
    white: mat(0xFFFFFF, { roughness: 0.28, envMapIntensity: 0.9 }),
    iris: mat(0x54341C, { roughness: 0.25 }),
    irisM: mat(0x3E2A16, { roughness: 0.25 }),
    pupil: mat(0x140C06, { roughness: 0.3 }),
    spec: new THREE.MeshBasicMaterial({ color: 0xFFFFFF }),
    mouth: mat(0xA34D38, { roughness: 0.6 }),
    mouthIn: mat(0x571F12, { roughness: 0.75 }),
    lip: mat(0xC26850, { roughness: 0.55 }),
    lipF: mat(0xB94F3E, { roughness: 0.5 }),
    blush: mat(0xE89078, { roughness: 0.8 }),
  };
  return _face;
}

/* Build a stylized face on the -z side of a head group.
   headC = local y of the head-sphere centre.
   The returned group's userData carries the LIVING-FACE rig:
     eyes[]   — per-eye groups (scale.y drives the blink)
     brows[]  — { m, z0, y0, s } for blink drops + mood tilts
     mouths{} — smile / grin / worry meshes (one visible at a time) */
function buildFace(headG, headC, skinDkM, browM, { female }) {
  const F = faceMats();
  const g = new THREE.Group();
  g.position.y = headC;
  const ud = { eyes: [], brows: [], mouths: {} };

  for (const s of [-1, 1]) {
    // eye cluster lives in its own group so a blink is one scale.y write
    const eyeG = new THREE.Group();
    eyeG.position.set(s * 0.082, 0.022, 0);
    const white = mesh(sphGeo(0.052), F.white, 0, 0, -0.176);
    white.scale.set(1, 1.22, 0.62);
    const iris = mesh(sphGeo(0.03), female ? F.iris : F.irisM, 0, -0.002, -0.203);
    iris.scale.set(1, 1, 0.55);
    const pupil = mesh(sphGeo(0.016), F.pupil, 0, -0.004, -0.216);
    pupil.scale.set(1, 1, 0.5);
    const spec = mesh(sphGeo(0.0085), F.spec, -0.012, 0.012, -0.222);
    eyeG.add(white, iris, pupil, spec);
    g.add(eyeG);
    ud.eyes.push(eyeG);
    // brow — a soft capsule arc above the eye
    const brow = mesh(capGeo(0.0115, 0.055), browM, s * 0.085, 0.095, -0.196);
    brow.rotation.z = Math.PI / 2 + s * (female ? 0.22 : 0.14);
    brow.rotation.y = -s * 0.35;
    g.add(brow);
    ud.brows.push({ m: brow, z0: brow.rotation.z, y0: 0.095, s });
    if (female && HQ) {
      // eyelash hint — a fine dark arc at the upper outer edge of the eye
      const lash = mesh(capGeo(0.006, 0.032), browM, s * 0.108, 0.06, -0.186);
      lash.rotation.z = Math.PI / 2 + s * 0.55;
      lash.rotation.y = -s * 0.42;
      g.add(lash);
    }
    if (female) {
      const blush = mesh(sphGeo(0.028), F.blush, s * 0.148, -0.052, -0.148);
      blush.scale.set(1, 0.66, 0.35);
      blush.rotation.y = -s * 0.62;
      g.add(blush);
    }
  }
  // button nose
  const nose = mesh(sphGeo(0.021), skinDkM, 0, -0.028, -0.222);
  nose.scale.set(0.85, 1.15, 0.75);
  // mouth states — resting smile / streak grin / danger worry.
  // Cheap visibility swaps driven by the game's mood tick.
  const arc = female ? 1.7 : 1.95;
  const smile = mesh(
    memoGeo('smile' + arc, () => new THREE.TorusGeometry(0.048, 0.0105, 6, 12, arc)),
    F.mouth, 0, -0.062, -0.196);
  smile.rotation.z = -Math.PI / 2 - arc / 2;
  const grin = new THREE.Group();
  const gArc = mesh(
    memoGeo('grin', () => new THREE.TorusGeometry(0.056, 0.012, 6, 12, 2.2)),
    F.mouth, 0, -0.056, -0.197);
  gArc.rotation.z = -Math.PI / 2 - 1.1;
  const gIn = mesh(sphGeo(0.03), F.mouthIn, 0, -0.078, -0.19);
  gIn.scale.set(1.5, 0.72, 0.4);
  grin.add(gArc, gIn);
  grin.visible = false;
  const worry = mesh(
    memoGeo('worry', () => new THREE.TorusGeometry(0.038, 0.0105, 6, 10, 1.5)),
    F.mouth, 0, -0.085, -0.193);
  worry.rotation.z = Math.PI / 2 - 0.75;   // flipped arc → worried frown
  worry.visible = false;
  ud.mouths.smile = smile; ud.mouths.grin = grin; ud.mouths.worry = worry;
  // defined lips — a soft lower-lip pad under the resting mouth
  const lip = mesh(sphGeo(female ? 0.02 : 0.017), female ? F.lipF : F.lip, 0, -0.083, -0.191);
  lip.scale.set(1.55, 0.5, 0.5);
  g.add(nose, smile, grin, worry, lip);
  g.userData = ud;
  headG.add(g);
  return g;
}

/* ───────────────────────────────────────────────────────────────
   RUNNER — young Greek athlete in a short running chiton.
   sex: 'male' (Νεανίας) | 'female' (Κορασίδα)
   Rig is identical for both so the animation code is shared.
   Faces -z (back to the camera during play).
─────────────────────────────────────────────────────────────── */
export function buildRunner(sex = 'male') {
  const female = sex === 'female';
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  // skin — gentle sheen + a whisper of warm under-glow (fake sub-surface
  // bounce; cheap material response, no shader work)
  const skin    = toon(PAL.skin,   { roughness: 0.56, envMapIntensity: 0.85, emissive: 0x66210A, emissiveIntensity: 0.05 });
  const skinDk  = toon(PAL.skinDk, { roughness: 0.6,  envMapIntensity: 0.8 });
  const chitonC = female ? 0xF7EFE0 : PAL.chiton;
  const chiton  = vtoon(chitonC);
  const chitonS = vtoon(PAL.chitonSh, { side: THREE.DoubleSide });
  const sashMat = toon(female ? PAL.terra : PAL.sash);
  const hairMat = toon(female ? 0x3A2818 : PAL.hair, { roughness: 0.6 });
  const hairDk  = toon(female ? 0x2C1D10 : 0x38281B, { roughness: 0.62 });
  const laurelM = toon(PAL.laurel);
  const goldM   = metal(PAL.drachma);
  const leather = toon(0x8C5A33, { roughness: 0.55 });
  const trimM   = female ? meanderMat('#C24E35', '#F7EFE0') : meanderMat('#1E6FB8', '#F2CE6B');

  /* proportions (body space; game applies ×1.15 on the root) */
  const shX   = female ? 0.245 : 0.285;   // shoulder pivot x
  const hipX  = 0.125;
  const armY  = 1.335, hipY = 0.76;

  // ── torso — lathe bodice: chest → waist taper, no corners anywhere
  const torso = new THREE.Group();
  torso.position.y = 1.06;
  const prof = female
    ? [[0.155, -0.32], [0.175, -0.2], [0.205, -0.04], [0.232, 0.1], [0.222, 0.2], [0.165, 0.28], [0.085, 0.33], [0.02, 0.345]]
    : [[0.17, -0.32], [0.19, -0.2], [0.235, -0.02], [0.262, 0.12], [0.248, 0.21], [0.185, 0.29], [0.09, 0.335], [0.02, 0.35]];
  const chest = mesh(latheGeo('torso_' + sex, prof, [0.86, 1.06]), chiton, 0, 0, 0);
  chest.scale.z = female ? 0.74 : 0.82;
  torso.add(chest);

  // ── skirt — flared lathe pivoted at the waist so the existing
  //    flutter hooks (scale flare + rotation.x) swing the hem naturally
  const skirtProf = female
    ? [[0.315, -0.28], [0.31, -0.26], [0.28, -0.2], [0.235, -0.11], [0.19, 0]]
    : [[0.3, -0.26], [0.295, -0.24], [0.27, -0.19], [0.23, -0.1], [0.195, 0]];
  const skirt = mesh(latheGeo('skirt_' + sex, skirtProf, [0.84, 1.03]), chitonS, 0, -0.26, 0);
  skirt.scale.z = 0.92;
  // meander hem band forms the hem lip (child of the skirt so the
  // flare/flutter hooks carry it)
  const hemH = 0.09;
  const band = mesh(
    memoGeo('band_' + sex, () => new THREE.CylinderGeometry(female ? 0.292 : 0.278, female ? 0.335 : 0.318, hemH, RS, 1, true)),
    trimM, 0, female ? -0.262 : -0.243, 0);
  skirt.add(band);
  if (HQ) {
    // second cloth layer — an over-fold whose hem rides above the meander
    // band, rippling on its own phase so the peplos reads as FOLDED fabric
    // in motion (game.js drives userData.layer2). Skipped on low tier.
    const overProf = female
      ? [[0.30, -0.145], [0.295, -0.12], [0.27, -0.06], [0.225, 0.005], [0.19, 0.045]]
      : [[0.285, -0.135], [0.28, -0.11], [0.26, -0.055], [0.22, 0.005], [0.19, 0.045]];
    const over = mesh(latheGeo('skirt2_' + sex, overProf, [0.76, 1.0]), chitonS, 0, -0.015, 0);
    skirt.add(over);
    skirt.userData.layer2 = over;
  }
  torso.add(skirt);

  if (female) {
    // peplos over-fold draped from the chest + high terracotta zone
    const fold = mesh(
      memoGeo('fold_f', () => gradTint(new THREE.CylinderGeometry(0.2, 0.265, 0.17, RS, 1, true), 0.82, 1.0)),
      chitonS, 0, -0.02, 0);
    fold.scale.z = 0.76;
    const belt = mesh(memoGeo('belt_f', () => new THREE.TorusGeometry(0.196, 0.047, HQ ? 10 : 7, RS)), sashMat, 0, -0.25, 0);
    belt.rotation.x = Math.PI / 2; belt.scale.set(1, 0.8, 1.05);
    const knot = mesh(sphGeo(0.045), sashMat, 0, -0.235, -0.185);
    const pinL = mesh(sphGeo(0.038), goldM, -0.135, 0.285, -0.09);
    const pinR = mesh(sphGeo(0.038), goldM, 0.135, 0.285, -0.09);
    torso.add(fold, belt, knot, pinL, pinR);
  } else {
    // aegean sash shoulder→hip — a thin band tilted across the chest
    const sashG = new THREE.Group();
    sashG.position.y = 0.04;
    sashG.rotation.z = 0.52;
    const sash = mesh(memoGeo('sash_m', () => new THREE.TorusGeometry(0.293, 0.036, HQ ? 10 : 7, RS)), sashMat, 0, 0, 0);
    sash.rotation.x = Math.PI / 2;
    sash.scale.set(1, 0.86, 1);
    sashG.add(sash);
    const belt = mesh(memoGeo('belt_m', () => new THREE.TorusGeometry(0.205, 0.042, HQ ? 10 : 7, RS)), sashMat, 0, -0.26, 0);
    belt.rotation.x = Math.PI / 2; belt.scale.set(1, 0.85, 1);
    const clasp = mesh(sphGeo(0.048), goldM, 0.155, 0.24, -0.12);
    torso.add(sashG, belt, clasp);
  }
  body.add(torso);

  let mane = null;
  if (!female) {
    // himation tail — a sash end knotted at the left shoulder that hangs
    // down the back (+z, the camera side) and STREAMS with speed through
    // the same rig.mane flutter hooks the ponytail uses
    mane = new THREE.Group();
    mane.position.set(-0.2, 0.3, 0.13);
    const knot = mesh(sphGeo(0.052), sashMat, 0, 0, 0);
    const tie = mesh(memoGeo('tieM', () => new THREE.TorusGeometry(0.046, 0.012, 6, HQ ? 12 : 8)), goldM, 0, -0.035, 0.015);
    tie.rotation.x = 1.2;
    const seg1 = mesh(capGeo(0.055, 0.22), sashMat, 0.02, -0.15, 0.05);
    seg1.rotation.x = -0.3; seg1.rotation.z = -0.08;
    const seg2 = mesh(capGeo(0.043, 0.19), sashMat, 0.045, -0.36, 0.11);
    seg2.rotation.x = -0.18; seg2.rotation.z = -0.1;
    const tipM = mesh(sphGeo(0.042), goldM, 0.06, -0.49, 0.14);
    tipM.scale.set(1.1, 0.7, 0.6);
    mane.add(knot, tie, seg1, seg2, tipM);
    torso.add(mane);
  }

  // ── head — slightly oversized, smooth, with a real face (-z side)
  const headG = new THREE.Group();
  headG.position.y = 1.44;
  const headC = 0.1;                        // head-sphere centre (local)
  const head = mesh(sphGeo(0.235), skin, 0, headC, 0);
  head.scale.set(0.96, 1.06, 0.98);
  const neck = mesh(capGeo(0.062, 0.1), skin, 0, -0.045, 0.01);
  headG.add(head, neck);
  const face = buildFace(headG, headC, skinDk, hairDk, { female });

  if (female) {
    // kore crown — tilted sphere cap, braid rim, gold fillet, side locks
    const crown = mesh(
      memoGeo('crownF', () => new THREE.SphereGeometry(0.252, SW, SH, 0, Math.PI * 2, 0, 1.95)),
      hairMat, 0, headC + 0.055, 0.02);
    crown.rotation.x = -0.36;
    const fringe = mesh(sphGeo(0.1), hairMat, 0, headC + 0.138, -0.145);
    fringe.scale.set(1.75, 0.52, 0.62);
    const braid = mesh(
      memoGeo('braidF', () => new THREE.TorusGeometry(0.22, 0.032, HQ ? 8 : 6, RS)),
      hairDk, 0, headC + 0.075, 0.018);
    braid.rotation.x = Math.PI / 2 + 0.46;
    const fillet = mesh(
      memoGeo('filletF', () => new THREE.TorusGeometry(0.234, 0.014, 6, RS)),
      goldM, 0, headC + 0.125, 0.015);
    fillet.rotation.x = Math.PI / 2 + 0.46;
    const lockL = mesh(capGeo(0.042, 0.15), hairMat, -0.195, headC - 0.11, -0.045);
    lockL.rotation.z = 0.14; lockL.rotation.x = -0.1;
    const lockR = lockL.clone(); lockR.position.x = 0.195; lockR.rotation.z = -0.14;
    headG.add(crown, fringe, braid, fillet, lockL, lockR);
    // small ears peeking between crown and side locks
    const earLf = mesh(sphGeo(0.03), skin, -0.219, headC - 0.012, -0.012);
    earLf.scale.set(0.5, 0.82, 0.62);
    const earRf = earLf.clone(); earRf.position.x = 0.219;
    headG.add(earLf, earRf);
    if (HQ) {
      // gold drop earrings — tiny jewelry beat that catches the sun
      for (const s of [-1, 1]) {
        const drop = mesh(sphGeo(0.015), goldM, s * 0.224, headC - 0.06, -0.012);
        drop.scale.set(0.8, 1.35, 0.8);
        headG.add(drop);
      }
    }

    // ponytail — pivot at the nape; rest pose baked into children so the
    // game's absolute flutter rotations swing it from the tie
    mane = new THREE.Group();
    mane.position.set(0, headC + 0.13, 0.19);
    const tie = mesh(memoGeo('tieF', () => new THREE.TorusGeometry(0.052, 0.016, 6, HQ ? 12 : 8)), goldM, 0, -0.01, 0.02);
    tie.rotation.x = 1.15;
    const seg1 = mesh(capGeo(0.07, 0.2), hairMat, 0, -0.14, 0.055);
    seg1.rotation.x = -0.32;
    const seg2 = mesh(capGeo(0.052, 0.17), hairMat, 0, -0.35, 0.115);
    seg2.rotation.x = -0.16;
    const tip = mesh(sphGeo(0.048), hairDk, 0, -0.49, 0.14);
    tip.scale.set(0.82, 1.35, 0.82);
    mane.add(tie, seg1, seg2, tip);
    headG.add(mane);
  } else {
    // short athletic curls under a laurel band
    const crop = mesh(
      memoGeo('cropM', () => new THREE.SphereGeometry(0.25, SW, SH, 0, Math.PI * 2, 0, 1.9)),
      hairMat, 0, headC + 0.045, 0.02);
    crop.rotation.x = -0.24;
    const fringe = mesh(sphGeo(0.095), hairMat, 0, headC + 0.125, -0.15);
    fringe.scale.set(1.9, 0.58, 0.72);
    headG.add(crop, fringe);
    // deterministic curl bumps along the hairline + crown — the temple
    // curls soften the cap rim so it never reads as a helmet edge
    const curlPos = [
      [-0.19, 0.1, -0.11], [0.19, 0.1, -0.11], [-0.22, 0.08, 0.05], [0.22, 0.08, 0.05],
      [-0.215, 0.05, -0.075], [0.215, 0.05, -0.075],
      [-0.12, 0.21, -0.09], [0.12, 0.21, -0.09], [0, 0.24, 0.03], [-0.16, 0.16, 0.15], [0.16, 0.16, 0.15], [0, 0.14, 0.21],
    ];
    for (const [cx, cy, cz] of curlPos) {
      const curl = mesh(sphGeo(0.062), hairDk, cx, headC + cy, cz);
      curl.scale.setScalar(0.88 + 0.3 * Math.abs(Math.sin(cx * 37 + cz * 19)));
      headG.add(curl);
    }
    const laurel = mesh(
      memoGeo('laurelM', () => new THREE.TorusGeometry(0.235, 0.02, 6, RS)),
      laurelM, 0, headC + 0.075, 0.005);
    laurel.rotation.x = Math.PI / 2 + 0.38;
    headG.add(laurel);
    for (let i = 0; i < 8; i++) {                    // laurel leaves
      const a = -0.5 + (i / 7) * (Math.PI + 1);
      const leaf = mesh(sphGeo(0.042), laurelM,
        Math.cos(a) * 0.24, headC + 0.075 - Math.sin(0.38) * Math.sin(a) * 0.22, Math.sin(a) * 0.225);
      leaf.scale.set(0.55, 1.5, 0.32);
      leaf.rotation.z = Math.cos(a) * 0.7;
      headG.add(leaf);
    }
    // small ears (visible with the short crop)
    const earL = mesh(sphGeo(0.032), skin, -0.222, headC - 0.01, -0.01);
    earL.scale.set(0.5, 0.85, 0.65);
    const earR = earL.clone(); earR.position.x = 0.222;
    headG.add(earL, earR);
  }
  body.add(headG);

  // ── arms — sphere shoulder under a cap sleeve, tapered upper,
  //    sphere elbow, tapered forearm, soft mitt hand
  const armR1 = female ? 0.062 : 0.073, armR2 = female ? 0.049 : 0.057;
  const foreR1 = female ? 0.047 : 0.055, foreR2 = female ? 0.037 : 0.043;
  function makeArm(side) {
    const pivot = new THREE.Group();
    pivot.position.set(shX * side, armY, 0);
    const sleeve = joint(female ? 0.078 : 0.09, toon(chitonC));
    sleeve.scale.set(1, 0.85, 1);
    sleeve.position.y = -0.015;
    const upper = mesh(limbGeo(armR1, armR2, 0.26), skin, 0, -0.045, 0);
    const elbowY = -0.31;
    const fore = new THREE.Group();
    fore.position.y = elbowY;
    const elbow = joint(armR2 * 1.02, skin);
    const foreM = mesh(limbGeo(foreR1, foreR2, 0.23), skin, 0, -0.015, 0);
    // wrist + simple hand: palm, curled finger mass, opposed thumb —
    // three volumes that read as a relaxed runner's half-fist
    const wrist = joint(foreR2 * 1.08, skin, 0, -0.25, 0);
    const hs = female ? 0.85 : 1;
    const hand = new THREE.Group();
    hand.position.set(0, -0.275, 0);
    const palm = mesh(sphGeo(0.05), skin, 0, -0.015 * hs, 0);
    palm.scale.set(0.92 * hs, 1.12 * hs, 0.64 * hs);
    const fingers = mesh(capGeo(0.036, 0.05), skin, 0, -0.078 * hs, 0.012);
    fingers.scale.set(1.02 * hs, hs, 0.74 * hs);
    fingers.rotation.x = 0.55;                 // natural relaxed curl
    const thumb = mesh(capGeo(0.017, 0.046), skin, -side * 0.047 * hs, -0.022 * hs, -0.01);
    thumb.rotation.z = -side * 0.78;
    thumb.rotation.x = 0.35;
    thumb.scale.setScalar(hs);
    hand.add(palm, fingers, thumb);
    fore.add(elbow, foreM, wrist, hand);
    if (female && side === -1) {
      const bangle = mesh(memoGeo('bangleF', () => new THREE.TorusGeometry(0.048, 0.01, 6, HQ ? 12 : 8)), goldM, 0, -0.21, 0);
      bangle.rotation.x = Math.PI / 2;
      fore.add(bangle);
    }
    if (!female && side === 1 && HQ) {
      // bronze-gold arm-band with a clasp bead on the sword-arm bicep
      const armBand = mesh(memoGeo('armbandM', () => new THREE.TorusGeometry(0.082, 0.012, 6, HQ ? 12 : 8)), goldM, 0, -0.175, 0);
      armBand.rotation.x = Math.PI / 2;
      const clasp2 = mesh(sphGeo(0.017), goldM, 0, -0.175, -0.08);
      pivot.add(armBand, clasp2);
    }
    pivot.add(sleeve, upper, fore);
    pivot.userData.fore = fore;
    return pivot;
  }
  const armL = makeArm(-1), armR = makeArm(1);
  body.add(armL, armR);

  // ── legs — tapered thigh, sphere knee, calf-bulge shin, sculpted
  //    sandal (rounded volumes only)
  const thR1 = female ? 0.08 : 0.088, thR2 = female ? 0.058 : 0.064;
  const shR1 = female ? 0.055 : 0.061, shR2 = 0.036;
  function makeLeg(side) {
    const pivot = new THREE.Group();
    pivot.position.set(hipX * side, hipY, 0);
    const hip = joint(thR1 * 1.04, skin);
    const thigh = mesh(limbGeo(thR1, thR2, 0.31), skin, 0, -0.02, 0);
    const shin = new THREE.Group();
    shin.position.y = -0.35;
    const knee = joint(thR2 * 1.02, skin);
    const calf = mesh(limbGeo(shR1, shR2, 0.3), skin, 0, -0.015, 0);
    const ankle = joint(0.036, skin, 0, -0.325, 0);
    // foot — flattened capsule, toe toward -z (the facing direction)
    const foot = mesh(capGeo(0.055, 0.12), skinDk, 0, -0.362, -0.045);
    foot.rotation.x = Math.PI / 2;
    foot.scale.set(0.85, 1.05, 0.6);
    const sole = mesh(capGeo(0.058, 0.13), leather, 0, -0.388, -0.045);
    sole.rotation.x = Math.PI / 2;
    sole.scale.set(0.9, 1.06, 0.2);
    const strapA = mesh(memoGeo('strapA', () => new THREE.TorusGeometry(0.045, 0.009, 5, HQ ? 12 : 8)), leather, 0, -0.318, -0.01);
    strapA.rotation.x = Math.PI / 2;
    const strapB = mesh(memoGeo('strapB', () => new THREE.TorusGeometry(0.052, 0.009, 5, HQ ? 12 : 8)), leather, 0, -0.352, -0.075);
    strapB.rotation.x = Math.PI / 2 + 0.5;
    strapB.scale.set(1, 1, 0.75);
    shin.add(knee, calf, ankle, foot, sole, strapA, strapB);
    pivot.add(hip, thigh, shin);
    pivot.userData.shin = shin;
    return pivot;
  }
  const legL = makeLeg(-1), legR = makeLeg(1);
  body.add(legL, legR);

  const blob = mesh(
    new THREE.CircleGeometry(0.5, 20),
    new THREE.MeshBasicMaterial({ color: 0x241c0e, transparent: true, opacity: 0.34, depthWrite: false }),
    0, 0.02, 0,
  );
  blob.rotation.x = -Math.PI / 2;
  root.add(blob);

  root.traverse((o) => { if (o.isMesh && o !== blob) { o.castShadow = true; o.receiveShadow = true; } });

  return { root, rig: { body, torso, headG, armL, armR, legL, legR, blob, skirt, mane, face }, sex };
}

/* ───────────────────────────────────────────────────────────────
   TALOS — the bronze automaton that hunts you.
   Rounded overlapping plates; molten ichor glows in the joints
   and plate gaps. AUTHORED facing +z, then the root is spun π on
   Y so he runs facing -z like the runner: back to the camera,
   furnace back-glow toward the lens, face bearing down on the
   prey ahead. game.js positions the root in world space and
   drives body/head rotations in LOCAL space, so the flip is
   transparent to the chase choreography.
─────────────────────────────────────────────────────────────── */
export function buildTalos() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const bronzeV  = vmetal(PAL.bronze,  { roughness: 0.38 });  // gradTint'd geos only
  const bronze   = metal(PAL.bronze,   { roughness: 0.38 });
  const bronzeLt = metal(PAL.bronzeLt, { roughness: 0.28 });
  const bronzeDk = metal(PAL.bronzeDk, { roughness: 0.5 });
  const verd     = mat(PAL.verdigris, { roughness: 0.7, metalness: 0.2 });
  const eyeMat   = emissive(PAL.talosEye, 2.4);

  // ── torso — barrel-chest lathe, chest→waist taper
  const torsoProf = [
    [0.5, 1.58], [0.56, 1.7], [0.6, 1.86], [0.68, 2.08], [0.76, 2.36],
    [0.8, 2.6], [0.74, 2.82], [0.56, 2.98], [0.28, 3.1], [0.02, 3.14],
  ];
  const torso = mesh(latheGeo('talos_torso', torsoProf, [0.8, 1.1]), bronzeV, 0, 0, 0);
  torso.scale.z = 0.78;
  body.add(torso);

  // sculpted pectoral plates on the authored front (+z → runner side)
  for (const s of [-1, 1]) {
    const pec = mesh(sphGeo(0.34), bronzeLt, s * 0.33, 2.6, 0.34);
    pec.scale.set(1.1, 0.78, 0.5);
    pec.rotation.x = -0.12;
    body.add(pec);
  }
  // overlapping abdomen plate rings (rounded, stacked)
  const ab1 = mesh(memoGeo('t_ab1', () => gradTint(new THREE.CylinderGeometry(0.665, 0.72, 0.2, RS, 1, true), 0.85, 1.05)), bronzeV, 0, 2.02, 0);
  ab1.scale.z = 0.78;
  const ab2 = mesh(memoGeo('t_ab2', () => gradTint(new THREE.CylinderGeometry(0.61, 0.66, 0.18, RS, 1, true), 0.85, 1.05)), bronzeV, 0, 1.78, 0);
  ab2.scale.z = 0.78;
  const hipRing = mesh(memoGeo('t_hip', () => new THREE.TorusGeometry(0.52, 0.09, HQ ? 10 : 7, RS)), verd, 0, 1.6, 0);
  hipRing.rotation.x = Math.PI / 2; hipRing.scale.set(1, 0.78, 1);
  body.add(ab1, ab2, hipRing);

  // molten ichor seams — the automaton's furnace core showing through the
  // plating. One UNIQUE emissive material shared by all strips so the game
  // can drive emissiveIntensity brighter as he closes in on the runner.
  const moltenMat = new THREE.MeshStandardMaterial({
    color: 0x431c06, emissive: new THREE.Color(PAL.talosEye),
    emissiveIntensity: 0.9, roughness: 0.55, metalness: 0.2,
  });
  // seams flank the chest on the authored front + glow rings in the plate
  // gaps (the rings stay readable from every side, camera included)
  const moltenL = mesh(capGeo(0.045, 1.15), moltenMat, -0.6, 2.32, 0.42);
  const moltenR = mesh(capGeo(0.045, 1.15), moltenMat, 0.6, 2.32, 0.42);
  const moltenWaist = mesh(memoGeo('t_mw', () => new THREE.TorusGeometry(0.615, 0.045, 6, RS)), moltenMat, 0, 1.905, 0);
  moltenWaist.rotation.x = Math.PI / 2; moltenWaist.scale.set(1, 0.78, 1);
  const moltenNeck = mesh(memoGeo('t_mn', () => new THREE.TorusGeometry(0.24, 0.05, 6, RS)), moltenMat, 0, 3.13, 0);
  moltenNeck.rotation.x = Math.PI / 2;
  const moltenCore = mesh(sphGeo(0.16), moltenMat, 0, 2.5, 0.5);
  moltenCore.scale.set(1, 1.3, 0.5);
  body.add(moltenL, moltenR, moltenWaist, moltenNeck, moltenCore);
  // furnace back-glow: an additive quad on the FAR side of his body from
  // the camera — his opaque body z-rejects the centre so only a hot rim
  // bleeds around the silhouette (radial falloff so the quad edge never
  // prints on a night sky). With the root flipped π, "far side" is local
  // +z, and the quad itself is spun π so its front face aims at the lens.
  const heat = mesh(new THREE.PlaneGeometry(3.0, 3.7),
    new THREE.MeshBasicMaterial({
      color: 0xFF5A1E, map: radialGlowTex(), transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }), 0, 2.35, 0.62);
  heat.rotation.y = Math.PI;
  body.add(heat);

  // ── pauldrons — big spheres with verdigris rims
  for (const s of [-1, 1]) {
    const pau = mesh(sphGeo(0.44), bronzeLt, s * 0.92, 2.98, 0);
    pau.scale.set(1, 0.9, 0.96);
    const rim = mesh(memoGeo('t_prim', () => new THREE.TorusGeometry(0.4, 0.05, 6, RS)), verd, s * 0.94, 2.9, 0);
    rim.rotation.x = 0.5; rim.rotation.z = s * -0.45;
    body.add(pau, rim);
  }

  // ── head — rounded Corinthian helm, molten grimace, glowing glare
  const headG = new THREE.Group();
  headG.position.y = 3.5;
  const helmProf = [
    [0.3, -0.28], [0.4, -0.16], [0.44, 0.0], [0.42, 0.14], [0.34, 0.28], [0.18, 0.4], [0.02, 0.44],
  ];
  const helm = mesh(latheGeo('talos_helm', helmProf, [0.86, 1.08]), bronzeV, 0, 0, 0);
  helm.scale.z = 0.95;
  // cheek guards sweeping down beside the glare
  for (const s of [-1, 1]) {
    const cheek = mesh(sphGeo(0.17), bronzeDk, s * 0.24, -0.16, 0.24);
    cheek.scale.set(0.5, 1.05, 0.75);
    cheek.rotation.y = s * 0.25;
    headG.add(cheek);
  }
  const noseGuard = mesh(capGeo(0.05, 0.16), bronzeDk, 0, -0.06, 0.4);
  // angry glowing eyes — almond spheres poking through the helm slit,
  // outer tips raked up
  const eyeL = mesh(sphGeo(0.1), eyeMat, -0.17, 0.05, 0.375);
  eyeL.scale.set(1.35, 0.5, 0.45); eyeL.rotation.z = -0.3;
  const eyeR = mesh(sphGeo(0.1), eyeMat, 0.17, 0.05, 0.375);
  eyeR.scale.set(1.35, 0.5, 0.45); eyeR.rotation.z = 0.3;
  // halo quad kept NARROWER than the helm so its additive edges can't
  // bleed past the silhouette when seen from behind
  const eyeGlow = mesh(new THREE.PlaneGeometry(0.58, 0.26), glow(PAL.talosEye, 0.5), 0, 0.05, 0.43);
  // furnace grimace — molten slit where a mouth should be
  const grimace = mesh(capGeo(0.035, 0.17), moltenMat, 0, -0.23, 0.35);
  grimace.rotation.z = Math.PI / 2;
  // crest — flattened plume arc, terracotta
  const crest = mesh(
    memoGeo('t_crest', () => new THREE.TorusGeometry(0.4, 0.14, HQ ? 8 : 6, HQ ? 18 : 12, Math.PI * 1.12)),
    mat(PAL.roofTile, { roughness: 0.6 }), 0, 0.16, 0);
  crest.rotation.y = Math.PI / 2;
  crest.rotation.z = Math.PI * 0.06;
  crest.scale.set(1, 1, 0.2);
  headG.add(helm, noseGuard, eyeGlow, eyeL, eyeR, grimace, crest);
  body.add(headG);

  // ── arms — ball shoulders, tapered upper, molten elbow, heavy
  //    gauntlet forearm, clamp-ready claw hands
  function arm(side) {
    const pivot = new THREE.Group();
    pivot.position.set(1.0 * side, 2.9, 0);
    const shoulder = joint(0.27, bronze);
    const upper = mesh(limbGeo(0.23, 0.17, 0.6), bronzeDk, 0, -0.06, 0);
    const elbow = mesh(sphGeo(0.19), bronzeLt, 0, -0.72, 0);
    const moltenElbow = mesh(memoGeo('t_me', () => new THREE.TorusGeometry(0.155, 0.035, 6, HQ ? 14 : 9)), moltenMat, 0, -0.72, 0);
    moltenElbow.rotation.x = Math.PI / 2;
    // gauntlet — inverted taper (wider at the wrist)
    const gaunt = mesh(limbGeo(0.16, 0.235, 0.52), bronze, 0, -0.78, 0);
    // claw hand: rounded palm + four curled fingers + thumb
    const hand = new THREE.Group();
    hand.position.y = -1.42;
    const palm = mesh(sphGeo(0.2), bronzeDk, 0, -0.02, 0.02);
    palm.scale.set(1.05, 0.8, 0.72);
    hand.add(palm);
    for (let i = 0; i < 4; i++) {
      const fx = -0.13 + i * 0.087;
      const fin = mesh(capGeo(0.05, 0.2), bronzeLt, fx, -0.1, 0.13);
      fin.rotation.x = -0.85 - (i % 2) * 0.15;
      hand.add(fin);
    }
    const thumb = mesh(capGeo(0.055, 0.15), bronzeLt, side * 0.19, -0.06, 0.08);
    thumb.rotation.x = -0.7; thumb.rotation.z = side * 0.5;
    hand.add(thumb);
    pivot.add(shoulder, upper, elbow, moltenElbow, gaunt, hand);
    return pivot;
  }
  const armL = arm(-1), armR = arm(1);
  body.add(armL, armR);

  // ── legs — tapered thigh, molten knee, flared greave, rounded foot
  function leg(side) {
    const pivot = new THREE.Group();
    pivot.position.set(0.45 * side, 1.6, 0);
    const hip = joint(0.26, bronze);
    const thigh = mesh(limbGeo(0.24, 0.17, 0.55), bronze, 0, -0.05, 0);
    const knee = mesh(sphGeo(0.185), bronzeLt, 0, -0.66, 0);
    const moltenKnee = mesh(memoGeo('t_mk', () => new THREE.TorusGeometry(0.15, 0.035, 6, HQ ? 14 : 9)), moltenMat, 0, -0.66, 0);
    moltenKnee.rotation.x = Math.PI / 2;
    const greave = mesh(limbGeo(0.16, 0.22, 0.5), bronzeDk, 0, -0.71, 0);
    const foot = mesh(capGeo(0.17, 0.32), bronzeDk, 0, -1.28, 0.14);
    foot.rotation.x = Math.PI / 2;
    foot.scale.set(1.1, 1.0, 0.55);
    const toe = mesh(memoGeo('t_toe', () => new THREE.TorusGeometry(0.15, 0.045, 6, HQ ? 12 : 8)), verd, 0, -1.28, 0.32);
    toe.rotation.x = Math.PI / 2; toe.scale.set(1, 1, 0.5);
    pivot.add(hip, thigh, knee, moltenKnee, greave, foot, toe);
    return pivot;
  }
  const legL = leg(-1), legR = leg(1);
  body.add(legL, legR);

  root.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  root.scale.setScalar(0.62);
  // chase facing: authored +z front → world -z. Back to the camera, eyes
  // on the runner. game.js only writes root.position, never root.rotation.
  root.rotation.y = Math.PI;

  return { root, rig: { body, headG, armL, armR, legL, legR, eyeL, eyeR, eyeGlow, moltenMat, heat, kind: 'talos' } };
}

/* ───────────────────────────────────────────────────────────────
   MINOTAUR — the bull of the labyrinth, loosed on the agora.
   Massive muscled bull-man: dark umber hide, charcoal fur ruff,
   bone horns, bronze fittings, furnace-red glare. AUTHORED facing
   +z, root pre-rotated π on Y so he charges facing -z — horns and
   muzzle aimed at the runner, fur-ridged back to the camera. He
   exposes the EXACT rig interface game.js drives for Talos
   (body/headG/armL/armR/legL/legR + eyeGlow/moltenMat/heat), so
   the same stomp/track/creep/lunge/grab choreography works.
─────────────────────────────────────────────────────────────── */
export function buildMinotaur() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const hideV   = vtoon(PAL.minoHide, { roughness: 0.55, envMapIntensity: 0.7 });
  const hide    = toon(PAL.minoHide, { roughness: 0.55, envMapIntensity: 0.7 });
  const hideLt  = toon(PAL.minoHideLt, { roughness: 0.5, envMapIntensity: 0.75 });
  const hideDk  = toon(PAL.minoHideDk, { roughness: 0.6 });
  const fur     = toon(PAL.minoFur, { roughness: 0.92, envMapIntensity: 0.35 });
  const furDk   = toon(PAL.minoFurDk, { roughness: 0.95, envMapIntensity: 0.3 });
  const hornM   = toon(PAL.minoHorn, { roughness: 0.34, envMapIntensity: 0.95 });
  const hornDkM = toon(PAL.minoHornDk, { roughness: 0.45 });
  const bronzeM = metal(PAL.bronze, { roughness: 0.38 });
  const hoofM   = toon(PAL.minoHoof, { roughness: 0.38, envMapIntensity: 0.85 });
  // fury material — glowing eyes + nostril embers. ONE unique emissive
  // instance so game.js drives it exactly like Talos' molten seams.
  const rageMat = new THREE.MeshStandardMaterial({
    color: 0x2A0C06, emissive: new THREE.Color(PAL.minoEye),
    emissiveIntensity: 0.9, roughness: 0.5, metalness: 0.1,
  });

  // ── torso — barrel chest even wider than Talos', tapering to the belt
  const torsoProf = [
    [0.52, 1.56], [0.58, 1.7], [0.63, 1.88], [0.72, 2.1], [0.82, 2.38],
    [0.85, 2.6], [0.78, 2.82], [0.58, 3.0], [0.3, 3.12], [0.02, 3.16],
  ];
  const torso = mesh(latheGeo('mino_torso', torsoProf, [0.76, 1.1]), hideV, 0, 0, 0);
  torso.scale.z = 0.74;
  body.add(torso);

  // sculpted pecs + abdominal lumps on the authored front (+z → runner side)
  for (const s of [-1, 1]) {
    const pec = mesh(sphGeo(0.36), hideLt, s * 0.34, 2.56, 0.32);
    pec.scale.set(1.12, 0.8, 0.52);
    pec.rotation.x = -0.14;
    body.add(pec);
    for (let r = 0; r < 2; r++) {
      const ab = mesh(sphGeo(0.145), hideLt, s * 0.155, 2.14 - r * 0.27, 0.40 - r * 0.05);
      ab.scale.set(1, 0.78, 0.45);
      body.add(ab);
    }
  }

  // ── fur ruff — layered dark volumes across shoulders, chest and back
  //    (kept LOW at centre so the bull head clears the ruff at distance)
  const ruff = [
    [0, 3.1, 0.15, 0.32, 1.5, 0.55, 1.0],
    [-0.5, 3.08, 0.12, 0.3, 1.3, 0.72, 1.0], [0.5, 3.08, 0.12, 0.3, 1.3, 0.72, 1.0],
    [-0.88, 3.02, 0.02, 0.3, 1.2, 0.8, 1.0], [0.88, 3.02, 0.02, 0.3, 1.2, 0.8, 1.0],
    [-0.3, 3.0, 0.36, 0.24, 1.25, 0.7, 0.8], [0.3, 3.0, 0.36, 0.24, 1.25, 0.7, 0.8],
    [0, 2.96, 0.44, 0.22, 1.2, 0.8, 0.7],
    [0, 3.0, -0.3, 0.36, 1.4, 0.8, 0.9],
    // spine ridge — breaks up the bare back in the over-shoulder view
    [0, 2.78, -0.5, 0.18, 0.9, 1.35, 0.5], [0, 2.42, -0.48, 0.15, 0.85, 1.3, 0.5],
  ];
  ruff.forEach(([x, y, z, r, sx, sy, sz], i) => {
    const tuft = mesh(sphGeo(r), i % 2 ? furDk : fur, x, y, z);
    tuft.scale.set(sx, sy, sz);
    body.add(tuft);
  });
  // sternum tuft trailing down the chest
  for (let i = 0; i < 3; i++) {
    const t2 = mesh(sphGeo(0.14 - i * 0.03), i % 2 ? fur : furDk, 0, 2.78 - i * 0.22, 0.42 - i * 0.03);
    t2.scale.set(1.15, 1.35, 0.5);
    body.add(t2);
  }

  // ── bronze belt + hide loincloth
  const belt = mesh(memoGeo('mino_belt', () => new THREE.TorusGeometry(0.56, 0.085, HQ ? 10 : 7, RS)), bronzeM, 0, 1.62, 0);
  belt.rotation.x = Math.PI / 2; belt.scale.set(1, 0.76, 1);
  const buckle = mesh(sphGeo(0.11), bronzeM, 0, 1.6, 0.45);
  buckle.scale.set(1, 1, 0.45);
  const clothProf = [[0.44, -0.42], [0.5, -0.36], [0.53, -0.22], [0.5, -0.06], [0.45, 0.02]];
  const cloth = mesh(latheGeo('mino_cloth', clothProf, [0.72, 1.02]), vtoon(PAL.minoHideDk, { roughness: 0.7 }), 0, 1.58, 0);
  cloth.scale.z = 0.74;
  body.add(belt, buckle, cloth);

  // ── head — sculpted bull skull, heavy muzzle, swept horns, rage-lit eyes
  const headG = new THREE.Group();
  headG.position.y = 3.5;                    // rides clear of the fur ruff
  const skull = mesh(sphGeo(0.34), hide, 0, 0.1, 0.0);
  skull.scale.set(0.96, 1.0, 0.92);
  const crownTuft = mesh(sphGeo(0.24), fur, 0, 0.32, -0.02);
  crownTuft.scale.set(1.2, 0.7, 1.0);
  const browRidge = mesh(capGeo(0.075, 0.3), hideDk, 0, 0.22, 0.2);
  browRidge.rotation.z = Math.PI / 2;
  // muzzle — heavy rounded snout thrust down the running line (authored
  // +z; the root flip aims it at the runner ahead)
  const muzzle = mesh(capGeo(0.185, 0.2), hideLt, 0, -0.06, 0.3);
  muzzle.rotation.x = Math.PI / 2;
  muzzle.scale.set(1.05, 1, 0.85);
  const jaw = mesh(sphGeo(0.15), hideDk, 0, -0.2, 0.28);
  jaw.scale.set(0.9, 0.62, 0.8);
  // flaring nostrils — dark pits with an ember core (fury-lit, breath-puffs
  // spawn from here in game.js)
  const noseTip = mesh(sphGeo(0.16), hideDk, 0, -0.03, 0.46);
  noseTip.scale.set(1.15, 0.72, 0.5);
  const nostrils = [];
  for (const s of [-1, 1]) {
    const n = mesh(sphGeo(0.052), furDk, s * 0.085, -0.045, 0.5);
    n.scale.set(1.25, 0.9, 0.5);
    n.rotation.y = s * 0.3;
    const core = mesh(sphGeo(0.026), rageMat, s * 0.085, -0.045, 0.515);
    core.scale.set(1.2, 0.8, 0.5);
    headG.add(n, core);
    nostrils.push(n);
  }
  // bronze nose ring — the captive bull broke his tether
  const ring = mesh(memoGeo('mino_ring', () => new THREE.TorusGeometry(0.075, 0.016, 6, HQ ? 14 : 10)), bronzeM, 0, -0.135, 0.5);
  // furious raked ember eyes + halo quad kept inside the skull silhouette
  const eyeL = mesh(sphGeo(0.085), rageMat, -0.165, 0.13, 0.235);
  eyeL.scale.set(1.3, 0.62, 0.5); eyeL.rotation.z = -0.35;
  const eyeR = mesh(sphGeo(0.085), rageMat, 0.165, 0.13, 0.235);
  eyeR.scale.set(1.3, 0.62, 0.5); eyeR.rotation.z = 0.35;
  // soft radial halo (a flat quad prints as a red band at mid-distance)
  const eyeGlow = mesh(new THREE.PlaneGeometry(0.72, 0.4),
    new THREE.MeshBasicMaterial({
      color: PAL.minoEye, map: radialGlowTex(), transparent: true, opacity: 0.5,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }), 0, 0.13, 0.31);
  // angry charcoal brow ledges slanted in over the eyes
  for (const s of [-1, 1]) {
    const brow = mesh(capGeo(0.045, 0.14), furDk, s * 0.17, 0.235, 0.24);
    brow.rotation.z = Math.PI / 2 + s * 0.42;
    headG.add(brow);
  }
  // ears flicked out under the horns
  for (const s of [-1, 1]) {
    const ear = mesh(capGeo(0.055, 0.12), hide, s * 0.38, 0.1, -0.02);
    ear.rotation.z = s * 1.35;
    ear.scale.set(0.7, 1, 0.5);
    headG.add(ear);
  }
  // horns — three swept segments each: out, up, curving in at the tip.
  // Sized to CARRY the silhouette at gameplay distance, day or night.
  for (const s of [-1, 1]) {
    const base = mesh(sphGeo(0.11), hornDkM, s * 0.3, 0.32, 0.0);
    const h1 = mesh(capGeo(0.09, 0.26), hornM, s * 0.47, 0.42, 0.0);
    h1.rotation.z = -s * 1.08;
    const h2 = mesh(capGeo(0.068, 0.24), hornM, s * 0.68, 0.6, 0.02);
    h2.rotation.z = -s * 0.42;
    const tip = mesh(memoGeo('mino_tip', () => new THREE.ConeGeometry(0.06, 0.3, RS)), hornM, s * 0.75, 0.86, 0.04);
    tip.rotation.z = s * 0.24;
    headG.add(base, h1, h2, tip);
  }
  headG.add(skull, crownTuft, browRidge, muzzle, jaw, noseTip, ring, eyeL, eyeR, eyeGlow);
  body.add(headG);

  // menace back-glow — dark-red rim bleeding around his silhouette,
  // driven through the same trig.heat hook as Talos' furnace quad.
  // Radial falloff so night skies never show a hard edge. Sits on the
  // FAR side of the body from the camera (local +z once the root is
  // flipped π) and is spun π itself so its front face aims at the lens —
  // the body occludes the centre, only the rim burns around him.
  const heat = mesh(new THREE.PlaneGeometry(3.2, 3.9),
    new THREE.MeshBasicMaterial({
      color: 0xC22A14, map: radialGlowTex(), transparent: true, opacity: 0,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }), 0, 2.3, 0.62);
  heat.rotation.y = Math.PI;
  body.add(heat);

  // ── arms — fur-capped boulder shoulders, bronze arm-band, heavy fists
  function arm(side) {
    const pivot = new THREE.Group();
    pivot.position.set(1.02 * side, 2.86, 0);
    const shoulder = joint(0.3, hide);
    const furCap = mesh(sphGeo(0.3), fur, side * 0.06, 0.14, 0);
    furCap.scale.set(1.15, 0.7, 1.05);
    const upper = mesh(limbGeo(0.25, 0.18, 0.6), hide, 0, -0.06, 0);
    const band = mesh(memoGeo('mino_band', () => new THREE.TorusGeometry(0.26, 0.042, 6, RS)), bronzeM, 0, -0.34, 0);
    band.rotation.x = Math.PI / 2;
    const elbow = mesh(sphGeo(0.19), hideLt, 0, -0.7, 0);
    const fore = mesh(limbGeo(0.175, 0.145, 0.5), hide, 0, -0.74, 0);
    // heavy closed fist — palm boulder + knuckle row + clamped thumb
    const fist = new THREE.Group();
    fist.position.y = -1.36;
    const palm = mesh(sphGeo(0.205), hideDk, 0, 0, 0.02);
    palm.scale.set(1.0, 0.88, 0.9);
    fist.add(palm);
    for (let i = 0; i < 4; i++) {
      const kn = mesh(sphGeo(0.068), hideLt, -0.115 + i * 0.077, -0.06, 0.16);
      fist.add(kn);
    }
    const thumb = mesh(capGeo(0.06, 0.1), hideLt, side * 0.17, -0.02, 0.1);
    thumb.rotation.x = -0.6; thumb.rotation.z = side * 0.55;
    fist.add(thumb);
    pivot.add(shoulder, furCap, upper, band, elbow, fore, fist);
    return pivot;
  }
  const armL = arm(-1), armR = arm(1);
  body.add(armL, armR);

  // ── legs — digitigrade: thigh forward, hock back, cloven hooves
  function leg(side) {
    const pivot = new THREE.Group();
    pivot.position.set(0.48 * side, 1.62, 0);
    const hip = joint(0.28, hide);
    const thigh = mesh(limbGeo(0.26, 0.17, 0.55), hide, 0, -0.03, 0.02);
    thigh.rotation.x = -0.22;                    // drives the knee forward
    const furThigh = mesh(sphGeo(0.2), fur, 0, -0.16, -0.1);
    furThigh.scale.set(1.05, 1.3, 0.8);
    const knee = mesh(sphGeo(0.17), hideLt, 0, -0.62, 0.14);
    const shank = mesh(limbGeo(0.14, 0.1, 0.48), hideDk, 0, -0.64, 0.13);
    shank.rotation.x = 0.42;                     // sweeps back — the hock
    const hock = mesh(sphGeo(0.115), hideDk, 0, -1.06, -0.06);
    const pastern = mesh(limbGeo(0.095, 0.115, 0.28), hideDk, 0, -1.08, -0.05);
    pastern.rotation.x = -0.35;                  // kicks forward to the hoof
    // cloven hoof — two dark polished lobes
    for (const h of [-1, 1]) {
      const lobe = mesh(capGeo(0.075, 0.12), hoofM, h * 0.068, -1.4, 0.1);
      lobe.rotation.x = Math.PI / 2;
      lobe.scale.set(0.78, 1, 0.62);
      pivot.add(lobe);
    }
    pivot.add(hip, thigh, furThigh, knee, shank, hock, pastern);
    return pivot;
  }
  const legL = leg(-1), legR = leg(1);
  body.add(legL, legR);

  root.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  root.scale.setScalar(0.64);
  // chase facing: authored +z front → world -z. The bull charges after
  // the runner with his back to the camera; lowered horns read from
  // behind as a charging bull. game.js never writes root.rotation.
  root.rotation.y = Math.PI;

  return { root, rig: { body, headG, armL, armR, legL, legR, eyeL, eyeR, eyeGlow, moltenMat: rageMat, heat, nostrils, kind: 'minotaur' } };
}

/* ───────────────────────────────────────────────────────────────
   DRACHMA COIN — struck gold metal disc, spins on Y.
─────────────────────────────────────────────────────────────── */
let _coinGeo = null, _coinRim = null, _coinMat = null, _coinRimMat = null, _coinBossMat = null;
export function buildCoin() {
  if (!_coinGeo) {
    _coinGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 22);
    _coinRim = new THREE.TorusGeometry(0.34, 0.05, 8, 22);
    // self-glow lifts the gold at dusk/night and lets the high-tier bloom
    // catch a sparkle as the face sweeps past the sun — hot enough to cross
    // the bloom threshold, cool enough not to read radioactive at noon
    _coinMat = metal(PAL.drachma, { roughness: 0.28, emissive: 0x8A5E10, emissiveIntensity: 0.72 });
    _coinRimMat = metal(PAL.drachmaDk, { roughness: 0.3, emissive: 0x6B4A10, emissiveIntensity: 0.35 });
    _coinBossMat = metal(PAL.drachmaEm, { roughness: 0.22, emissive: 0x9A701A, emissiveIntensity: 0.85 });
  }
  const g = new THREE.Group();
  const face = mesh(_coinGeo, _coinMat, 0, 0, 0);
  face.rotation.x = Math.PI / 2;
  const rim = mesh(_coinRim, _coinRimMat, 0, 0, 0);
  const boss = mesh(new THREE.SphereGeometry(0.13, 10, 8), _coinBossMat, 0, 0, 0.045);
  boss.scale.set(1, 1, 0.5);
  g.add(face, rim, boss);
  g.userData.kind = 'coin';
  return g;
}

/* ───────────────────────────────────────────────────────────────
   POWER-UPS
─────────────────────────────────────────────────────────────── */
export const PU_META = {
  magnet:  { color: PAL.hermes,     label: 'ΦΤΕΡΩΤΑ ΣΑΝΔΑΛΙΑ', en: 'magnet' },
  shield:  { color: PAL.aegis,      label: 'ΑΙΓΙΔΑ',            en: 'shield' },
  dash:    { color: PAL.dash,       label: 'ΟΡΜΗ',              en: 'dash'   },
  mult:    { color: PAL.multiplier, label: 'ΔΑΦΝΙΝΟ ΣΤΕΦΑΝΙ',   en: 'x2'     },
  chariot: { color: PAL.chariot,    label: 'ΦΤΕΡΩΤΟ ΑΡΜΑ',      en: 'chariot'},
};
export const PU_TYPES = Object.keys(PU_META);
export function puLabel(t) { return (PU_META[t] || {}).label || ''; }
export function puColor(t) { return (PU_META[t] || PU_META.magnet).color; }

export function buildPowerup(type) {
  const meta = PU_META[type] || PU_META.magnet;
  const g = new THREE.Group();
  const col = meta.color;

  const beam = mesh(new THREE.CylinderGeometry(0.55, 0.85, 7, 16, 1, true),
    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false, blending: THREE.AdditiveBlending }),
    0, 3.5, 0);
  const bubble = mesh(new THREE.IcosahedronGeometry(0.7, 1),
    new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending }));
  const ring = mesh(new THREE.TorusGeometry(0.72, 0.04, 8, 28), glow(col, 0.95));
  ring.rotation.x = Math.PI / 2;
  const groundRing = mesh(new THREE.RingGeometry(0.7, 0.95, 28), glow(col, 0.6), 0, -1.38, 0);
  groundRing.rotation.x = -Math.PI / 2;
  g.add(beam, groundRing, bubble, ring);

  const icon = new THREE.Group();
  const c = emissive(col, 0.6);
  const cLt = glow(col, 1);

  if (type === 'magnet') {
    const gold = metal(PAL.drachma);
    const goldLt = glow(0xFFE3A0, 1);
    const foot  = mesh(box(0.20, 0.13, 0.40), gold, 0, -0.10, 0.02);
    const toe   = mesh(box(0.20, 0.17, 0.13), gold, 0, -0.04, 0.22);
    const sole  = mesh(box(0.22, 0.05, 0.46), goldLt, 0, -0.16, 0.03);
    const ankle = mesh(new THREE.CylinderGeometry(0.115, 0.125, 0.24, 14), gold, 0, 0.07, -0.07);
    const cuff  = mesh(new THREE.TorusGeometry(0.125, 0.03, 6, 18), goldLt, 0, 0.18, -0.07); cuff.rotation.x = Math.PI / 2;
    icon.add(foot, toe, sole, ankle, cuff);
    for (const side of [-1, 1]) {
      for (let i = 0; i < 3; i++) {
        const f = mesh(box(0.05, 0.34 - i * 0.07, 0.11), goldLt,
          side * (0.13 + i * 0.035), 0.10 + i * 0.06, -0.12 - i * 0.05);
        f.rotation.z = side * (0.55 + i * 0.14);
        f.rotation.x = -0.22;
        icon.add(f);
      }
    }
  } else if (type === 'shield') {
    const disc = mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.09, 22), c, 0, 0, 0);
    disc.rotation.x = Math.PI / 2;
    const rim = mesh(new THREE.TorusGeometry(0.38, 0.05, 8, 22), metal(PAL.aegisRim));
    const boss = mesh(new THREE.SphereGeometry(0.11, 10, 8), metal(PAL.aegisRim), 0, 0, 0.07);
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * Math.PI * 2;
      const sp = mesh(box(0.32, 0.025, 0.02), cLt, Math.cos(a) * 0.18, Math.sin(a) * 0.18, 0.06);
      sp.rotation.z = a; icon.add(sp);
    }
    icon.add(disc, rim, boss);
  } else if (type === 'dash') {
    for (let i = 0; i < 3; i++) {
      const ch = mesh(new THREE.ConeGeometry(0.2, 0.14, 4), c, 0, 0, -0.22 + i * 0.22);
      ch.rotation.x = -Math.PI / 2; ch.scale.set(1, 1, 1.5);
      icon.add(ch);
    }
  } else if (type === 'mult') {
    const wreath = mesh(new THREE.TorusGeometry(0.3, 0.045, 6, 22), emissive(PAL.multiplier, 0.5));
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      const leaf = mesh(new THREE.SphereGeometry(0.06, 6, 4), toon(PAL.oliveDk), Math.cos(a) * 0.3, Math.sin(a) * 0.3, 0);
      leaf.scale.set(0.6, 1.7, 0.6); leaf.rotation.z = a; icon.add(leaf);
    }
    icon.add(wreath);
  } else if (type === 'chariot') {
    const cab = mesh(box(0.34, 0.24, 0.26), c, 0, 0, 0);
    const wheel = mesh(new THREE.TorusGeometry(0.15, 0.04, 6, 16), metal(PAL.bronzeDk), 0, -0.07, 0.15);
    const wheel2 = wheel.clone(); wheel2.position.z = -0.15;
    const wing = mesh(box(0.56, 0.025, 0.2), cLt, -0.14, 0.1, 0); wing.rotation.z = 0.35;
    const wing2 = mesh(box(0.56, 0.025, 0.2), cLt, 0.14, 0.1, 0); wing2.rotation.z = -0.35;
    icon.add(cab, wheel, wheel2, wing, wing2);
  }
  icon.scale.setScalar(1.15);
  g.add(icon);
  g.userData.kind = 'powerup';
  g.userData.puType = type;
  g.userData.icon = icon;
  g.userData.beam = beam;
  g.userData.groundRing = groundRing;
  return g;
}
