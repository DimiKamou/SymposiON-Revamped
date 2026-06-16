/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — quality.js
   One source of truth for the performance/visual tier. Phones get a
   lighter pipeline (smaller shadows, cheaper bloom, capped DPR) so
   the cinematic look stays at 60fps; desktops get the full treatment.
════════════════════════════════════════════════════════════════ */

function detect() {
  const coarse = typeof matchMedia === 'function' && matchMedia('(pointer:coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const small = Math.min(screen.width || 1280, screen.height || 800) < 520;
  const mobile = coarse || small;
  const weak = mobile || cores <= 4 || mem <= 3;

  // Effective pixel ratio: cap hard on phones, and trim weak devices a touch
  // more so the multi-pass bloom stays at 60fps. This is the single knob the
  // renderer + composer both use.
  const cap = mobile ? 1.8 : 2;
  const dpr = Math.min(window.devicePixelRatio || 1, cap) * (weak ? 0.9 : 1.0);

  return {
    mobile,
    weak,
    dpr,
    shadowMap: weak ? 1024 : 2048,
    shadowRadius: weak ? 2 : 4,
    bloom: true,
    bloomStrength: weak ? 0.26 : 0.34,
    bloomRadius: weak ? 0.5 : 0.6,
    bloomThreshold: 0.96,
    grain: !weak,             // film grain only where we have headroom
    chroma: weak ? 0.55 : 0.85, // chromatic-aberration multiplier
    anisotropy: weak ? 4 : 8,
    exposure: 0.88,
  };
}

export const QUALITY = detect();
