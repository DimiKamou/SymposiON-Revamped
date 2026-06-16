/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — gfx.js
   PBR material helpers (MeshStandardMaterial) for a modern, semi-
   realistic look. Image-based lighting (env map) is injected once at
   scene init via setEnv() so marble reads soft and bronze reads metal.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';

let ENV = null;
export function setEnv(tex) { ENV = tex; }

/* Matte stone / wood / fabric — the workhorse. */
export function mat(hex, opts = {}) {
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
  });
  if (ENV) m.envMap = ENV;
  return m;
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
  return mat(hex, { roughness: opts.roughness ?? 0.34, metalness: opts.metalness ?? 0.95, envMapIntensity: opts.envMapIntensity ?? 1.25, flat: !!opts.flat });
}

/* Glowing unlit material (eyes, glows, lane lines, beams). */
export function glow(hex, opacity = 1) {
  return new THREE.MeshBasicMaterial({
    color: hex, transparent: opacity < 1, opacity,
    blending: opacity < 1 ? THREE.AdditiveBlending : THREE.NormalBlending,
    depthWrite: opacity >= 1,
  });
}

/* Emissive standard material (things that glow but still catch light). */
export function emissive(hex, intensity = 1.2) {
  const m = mat(hex, { roughness: 0.4, metalness: 0.1 });
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
