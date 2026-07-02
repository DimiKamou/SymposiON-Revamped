/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — builders-actors.js
   Runner (Νεανίας / Κορασίδα, fully rigged), Talos chaser,
   drachma coins, power-up pickups.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { PAL } from './config.js';
import { mat, toon, marble, metal, glow, emissive, mesh } from './gfx.js';

const cap = (r, len, rad = 5, cap2 = 8) => new THREE.CapsuleGeometry(r, len, rad, cap2);
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

/* ───────────────────────────────────────────────────────────────
   RUNNER — young Greek athlete in a short running chiton.
   sex: 'male' (Νεανίας) | 'female' (Κορασίδα)
   Rig is identical for both so the animation code is shared.
─────────────────────────────────────────────────────────────── */
export function buildRunner(sex = 'male') {
  const female = sex === 'female';
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const skin    = toon(PAL.skin);
  const skinDk  = toon(PAL.skinDk);
  const chiton  = toon(female ? 0xF7EFE0 : PAL.chiton);
  const chitonSh= toon(PAL.chitonSh);
  const sashMat = toon(female ? PAL.terra ?? 0xD9573D : PAL.sash);
  const hairMat = toon(female ? 0x3A2818 : PAL.hair);
  const laurelM = toon(PAL.laurel);
  const goldM   = metal(PAL.drachma);

  // ── torso (short chiton) — slightly slimmer for the female silhouette
  const torso = new THREE.Group();
  torso.position.y = 1.02;
  const chestW = female ? 0.54 : 0.62;
  const chest = mesh(box(chestW, 0.6, 0.32), chiton, 0, 0.04, 0);
  const skirt = mesh(new THREE.CylinderGeometry(female ? 0.27 : 0.30, female ? 0.5 : 0.46, female ? 0.62 : 0.55, 10), chitonSh, 0, female ? -0.5 : -0.45, 0);
  torso.add(chest, skirt);
  if (female) {
    const belt = mesh(new THREE.TorusGeometry(0.26, 0.05, 6, 16), sashMat, 0, -0.18, 0);
    belt.rotation.x = Math.PI / 2; belt.scale.set(1, 0.8, 1);
    const pin = mesh(new THREE.SphereGeometry(0.06, 8, 6), goldM, -0.22, 0.28, 0.05);
    torso.add(belt, pin);
  } else {
    const sash = mesh(box(0.66, 0.16, 0.36), sashMat, 0, 0.06, 0.005);
    sash.rotation.z = -0.42;
    torso.add(sash);
  }
  body.add(torso);

  // ── head + hair + adornment
  const headG = new THREE.Group();
  headG.position.y = 1.5;
  const head = mesh(new THREE.SphereGeometry(0.23, 14, 12), skin, 0, 0, 0);
  head.scale.set(1, 1.08, 0.95);
  const neck = mesh(cap(0.095, 0.12), skin, 0, -0.26, 0);
  const hair = mesh(new THREE.SphereGeometry(0.255, 14, 12), hairMat, 0, 0.04, -0.02);
  hair.scale.set(1.05, 0.92, 1.05);
  const nose = mesh(new THREE.ConeGeometry(0.04, 0.11, 6), skinDk, 0, -0.02, 0.22);
  nose.rotation.x = Math.PI / 2;
  headG.add(hair, head, neck, nose);

  let mane = null;
  if (female) {
    const fringe = mesh(box(0.42, 0.13, 0.22), hairMat, 0, 0.16, 0.13);
    mane = mesh(cap(0.22, 0.64, 6, 10), hairMat, 0, -0.46, -0.14);
    mane.scale.set(1.18, 1, 0.5);
    const curl = mesh(new THREE.SphereGeometry(0.21, 12, 10), hairMat, 0, -0.92, -0.10);
    curl.scale.set(1.15, 0.72, 0.6);
    const lockL = mesh(cap(0.07, 0.52, 6, 8), hairMat, -0.21, -0.36, 0.05); lockL.rotation.z = 0.13;
    const lockR = mesh(cap(0.07, 0.52, 6, 8), hairMat, 0.21, -0.36, 0.05); lockR.rotation.z = -0.13;
    const fillet = mesh(new THREE.TorusGeometry(0.245, 0.022, 6, 20), goldM, 0, 0.1, 0);
    fillet.rotation.x = Math.PI / 2.2;
    headG.add(mane, curl, lockL, lockR, fringe, fillet);
  } else {
    const fringe = mesh(box(0.4, 0.12, 0.25), hairMat, 0, 0.15, 0.12);
    const laurel = mesh(new THREE.TorusGeometry(0.235, 0.026, 6, 18), laurelM, 0, 0.05, 0);
    laurel.rotation.x = Math.PI / 2.1;
    headG.add(fringe, laurel);
  }
  body.add(headG);

  // ── arms (shoulder pivots)
  function makeArm(side) {
    const pivot = new THREE.Group();
    pivot.position.set((female ? 0.32 : 0.36) * side, 1.32, 0);
    const upper = mesh(cap(female ? 0.075 : 0.085, 0.26), skin, 0, -0.19, 0);
    const fore = new THREE.Group();
    fore.position.y = -0.38;
    const foreMesh = mesh(cap(female ? 0.066 : 0.075, 0.24), skin, 0, -0.17, 0);
    const hand = mesh(new THREE.SphereGeometry(0.08, 8, 6), skinDk, 0, -0.32, 0);
    fore.add(foreMesh, hand);
    pivot.add(upper, fore);
    pivot.userData.fore = fore;
    return pivot;
  }
  const armL = makeArm(-1), armR = makeArm(1);
  body.add(armL, armR);

  // ── legs (hip pivots)
  function makeLeg(side) {
    const pivot = new THREE.Group();
    pivot.position.set(0.15 * side, 0.74, 0);
    const thigh = mesh(cap(female ? 0.1 : 0.11, 0.30), skinDk, 0, -0.22, 0);
    const shin = new THREE.Group();
    shin.position.y = -0.44;
    const shinMesh = mesh(cap(female ? 0.085 : 0.095, 0.30), skin, 0, -0.20, 0);
    const foot = mesh(box(0.15, 0.09, 0.30), mat(PAL.skinDk), 0, -0.38, 0.06);
    const strap = mesh(box(0.16, 0.04, 0.12), metal(PAL.drachmaDk), 0, -0.3, 0.02);
    shin.add(shinMesh, foot, strap);
    pivot.add(thigh, shin);
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

  return { root, rig: { body, torso, headG, armL, armR, legL, legR, blob, skirt, mane }, sex };
}

/* ───────────────────────────────────────────────────────────────
   TALOS — the bronze automaton that hunts you.
─────────────────────────────────────────────────────────────── */
export function buildTalos() {
  const root = new THREE.Group();
  const body = new THREE.Group();
  root.add(body);

  const bronze   = metal(PAL.bronze,   { roughness: 0.38 });
  const bronzeLt = metal(PAL.bronzeLt, { roughness: 0.28 });
  const bronzeDk = metal(PAL.bronzeDk, { roughness: 0.5 });
  const verd     = mat(PAL.verdigris, { roughness: 0.7, metalness: 0.2 });
  const eyeMat   = emissive(PAL.talosEye, 2.4);

  const torso = mesh(box(1.5, 1.5, 0.95), bronze, 0, 2.3, 0);
  const plate = mesh(box(1.05, 0.85, 0.22), bronzeLt, 0, 2.45, 0.5);
  const seam1 = mesh(box(1.06, 0.05, 0.23), verd, 0, 2.45, 0.52);
  const seam2 = mesh(box(0.05, 0.85, 0.23), verd, 0, 2.45, 0.52);
  const verdBand = mesh(box(1.55, 0.16, 1.0), verd, 0, 1.72, 0);
  body.add(torso, plate, seam1, seam2, verdBand);

  const pauL = mesh(new THREE.SphereGeometry(0.42, 12, 10), bronzeLt, -0.9, 2.95, 0);
  const pauR = mesh(new THREE.SphereGeometry(0.42, 12, 10), bronzeLt, 0.9, 2.95, 0);
  body.add(pauL, pauR);

  const headG = new THREE.Group();
  headG.position.y = 3.5;
  const head = mesh(box(0.78, 0.8, 0.78), bronze, 0, 0, 0);
  const crest = mesh(box(0.16, 0.5, 0.72), mat(PAL.roofTile, { roughness: 0.6 }), 0, 0.56, 0);
  const eyeL = mesh(box(0.18, 0.13, 0.08), eyeMat, -0.2, 0.05, 0.4);
  const eyeR = mesh(box(0.18, 0.13, 0.08), eyeMat, 0.2, 0.05, 0.4);
  const eyeGlow = mesh(new THREE.PlaneGeometry(0.9, 0.4), glow(PAL.talosEye, 0.5), 0, 0.05, 0.42);
  const visor = mesh(box(0.7, 0.1, 0.1), bronzeDk, 0, -0.11, 0.41);
  headG.add(head, crest, eyeGlow, eyeL, eyeR, visor);
  body.add(headG);

  function arm(side) {
    const pivot = new THREE.Group();
    pivot.position.set(1.0 * side, 2.9, 0);
    const upper = mesh(cap(0.26, 0.7, 5, 8), bronzeDk, 0, -0.5, 0);
    const fist = mesh(new THREE.DodecahedronGeometry(0.36), bronzeLt, 0, -1.15, 0);
    pivot.add(upper, fist);
    return pivot;
  }
  const armL = arm(-1), armR = arm(1);
  body.add(armL, armR);

  function leg(side) {
    const pivot = new THREE.Group();
    pivot.position.set(0.45 * side, 1.6, 0);
    const thigh = mesh(cap(0.3, 0.7, 5, 8), bronze, 0, -0.55, 0);
    const foot = mesh(box(0.55, 0.35, 0.85), bronzeDk, 0, -1.15, 0.12);
    pivot.add(thigh, foot);
    return pivot;
  }
  const legL = leg(-1), legR = leg(1);
  body.add(legL, legR);

  root.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  root.scale.setScalar(0.62);

  return { root, rig: { body, headG, armL, armR, legL, legR, eyeL, eyeR, eyeGlow } };
}

/* ───────────────────────────────────────────────────────────────
   DRACHMA COIN — struck gold metal disc, spins on Y.
─────────────────────────────────────────────────────────────── */
let _coinGeo = null, _coinRim = null, _coinMat = null, _coinRimMat = null, _coinBossMat = null;
export function buildCoin() {
  if (!_coinGeo) {
    _coinGeo = new THREE.CylinderGeometry(0.34, 0.34, 0.08, 22);
    _coinRim = new THREE.TorusGeometry(0.34, 0.05, 8, 22);
    _coinMat = metal(PAL.drachma, { roughness: 0.3 });
    _coinRimMat = metal(PAL.drachmaDk, { roughness: 0.36 });
    _coinBossMat = metal(PAL.drachmaEm, { roughness: 0.25 });
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
