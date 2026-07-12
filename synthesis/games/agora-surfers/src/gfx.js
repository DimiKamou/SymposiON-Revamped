/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — gfx.js
   PBR material helpers (MeshStandardMaterial) for a modern, semi-
   realistic look. Image-based lighting (env map) is injected once at
   scene init via setEnv() so marble reads soft and bronze reads metal.

   Perf discipline: the standard-material families (mat/toon/marble/
   metal and their vertex-colour variants) are CACHED — every column,
   obstacle and tree that asks for the same hex+options shares one
   material instance, which collapses shader-program switches.
   Materials that get mutated per-instance (glow opacity, driven
   emissive) must NOT go through the cache — use unique:true.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';

let ENV = null;
export function setEnv(tex) { ENV = tex; }

/* material cache — key on family + colour + options */
const _cache = new Map();
function cached(kind, hex, opts, make) {
  const key = kind + '|' + hex + '|' + JSON.stringify(opts, Object.keys(opts).sort());
  let m = _cache.get(key);
  if (!m) { m = make(); _cache.set(key, m); }
  return m;
}

function makeStandard(hex, opts = {}) {
  const m = new THREE.MeshStandardMaterial({
    color: hex,
    roughness: opts.roughness ?? 0.82,
    metalness: opts.metalness ?? 0.0,
    flatShading: !!opts.flat,
    transparent: !!opts.transparent,
    opacity: opts.opacity ?? 1,
    emissive: opts.emissive ?? 0x000000,
    emissiveIntensity: opts.emissiveIntensity ?? 1,
    envMapIntensity: opts.envMapIntensity ?? 0.7,
    side: opts.side ?? THREE.FrontSide,
    vertexColors: !!opts.vertexColors,
  });
  if (ENV) m.envMap = ENV;
  return m;
}

/* Matte stone / wood / fabric — the workhorse. */
export function mat(hex, opts = {}) {
  if (opts.unique) { const { unique, ...rest } = opts; return makeStandard(hex, rest); }
  return cached('m', hex, opts, () => makeStandard(hex, opts));
}

/* Polished marble — smoother, faint sheen. */
export function marble(hex, opts = {}) {
  return mat(hex, { roughness: 0.5, metalness: 0.0, envMapIntensity: 1.0, ...opts });
}

/* Skin / fabric — soft, no flat shading. */
export function toon(hex, opts = {}) {
  return mat(hex, { roughness: 0.72, metalness: 0.0, flat: false, envMapIntensity: 0.6, ...opts });
}

/* Metal — bronze Talos, coins, fittings. */
export function metal(hex, opts = {}) {
  return mat(hex, {
    roughness: opts.roughness ?? 0.34, metalness: opts.metalness ?? 0.95,
    envMapIntensity: opts.envMapIntensity ?? 1.25, flat: !!opts.flat,
    emissive: opts.emissive ?? 0x000000, emissiveIntensity: opts.emissiveIntensity ?? 1,
    unique: opts.unique,
  });
}

/* Vertex-tinted variants — same cache, vertexColors on. Pair these with
   gradTint()ed geometry: lighter tops + ambient-occlusion-dark bases. */
export function vtoon(hex, opts = {}) { return toon(hex, { ...opts, vertexColors: true }); }
export function vmetal(hex, opts = {}) { return metal(hex, { ...opts, vertexColors: true }); }

/* Bake a vertical brightness ramp into a geometry's vertex colours.
   bot/top are multipliers (e.g. 0.78 → AO-dark base, 1.06 → lit top).
   Cheap fake of sky occlusion + bounce that reads as real shading. */
export function gradTint(geo, bot = 0.78, top = 1.06) {
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const span = Math.max(1e-5, bb.max.y - bb.min.y);
  const pos = geo.attributes.position;
  const n = pos.count;
  const col = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const t = (pos.getY(i) - bb.min.y) / span;
    const e = t * t * (3 - 2 * t);                 // smoothstep — eased ramp
    const v = bot + (top - bot) * e;
    col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = v;
  }
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  return geo;
}

/* Glowing unlit material (eyes, glows, lane lines, beams).
   NOT cached — call sites mutate opacity per instance. */
export function glow(hex, opacity = 1) {
  return new THREE.MeshBasicMaterial({
    color: hex, transparent: opacity < 1, opacity,
    blending: opacity < 1 ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: opacity >= 1,
  });
}

/* Emissive standard material (things that glow but still catch light). */
export function emissive(hex, intensity = 1.2) {
  const m = mat(hex, { roughness: 0.4, metalness: 0.1, unique: true });
  m.emissive = new THREE.Color(hex);
  m.emissiveIntensity = intensity * 1.6;   // push past the bloom threshold
  m.toneMapped = true;
  return m;
}

/* quick mesh helper */
export function mesh(geo, material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, material);
  m.position.set(x, y, z);
  return m;
}

/* enable shadows on a whole subtree */
export function castShadows(obj, cast = true, receive = false) {
  obj.traverse((o) => { if (o.isMesh) { o.castShadow = cast; o.receiveShadow = receive; } });
  return obj;
}
