/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — quality.js
   One source of truth for the performance/visual tier.
     high — capable desktops: MSAA composer, bloom, grain, speed
            chromatic aberration, PCFSoft 2048 shadows.
     mid  — capable phones / mid laptops: grade pass only (vignette,
            tone), PCF 1024 shadows, no bloom.
     low  — weak school laptops & old phones: NO post stack at all,
            no shadow map (contact blobs carry the grounding), so the
            raw render loop stays at 60fps.
════════════════════════════════════════════════════════════════ */

function detect() {
  const coarse = typeof matchMedia === 'function' && matchMedia('(pointer:coarse)').matches;
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  const small = Math.min(screen.width || 1280, screen.height || 800) < 520;
  const mobile = coarse || small;
  const weak = mobile || cores <= 4 || mem <= 3;

  // weak devices that still have muscle (modern 6–8 core phones) → mid;
  // genuinely weak hardware (4-core school laptops, old phones) → low.
  const tier = !weak ? 'high' : ((cores >= 6 || mem >= 6) ? 'mid' : 'low');

  // Effective pixel ratio: cap hard on phones, and trim weak devices a touch
  // more so the pipeline stays at 60fps. Single knob for renderer + composer.
  const cap = mobile ? 1.8 : 2;
  const dpr = Math.min(window.devicePixelRatio || 1, cap) * (weak ? 0.9 : 1.0);

  return {
    mobile,
    weak,
    tier,
    dpr,
    // shadows: real map on high/mid, contact blobs only on low
    shadows: tier !== 'low',
    shadowMap: tier === 'high' ? 2048 : 1024,
    shadowRadius: tier === 'high' ? 4 : 2,
    // post stack
    post: tier !== 'low',            // composer exists at all
    bloom: tier === 'high',          // UnrealBloom only with headroom
    msaa: tier === 'high' ? 4 : 0,   // MSAA samples on the composer RT
    bloomStrength: 0.48,
    bloomRadius: 0.62,
    bloomThreshold: 0.84,
    grain: tier === 'high',          // film grain only where we have headroom
    chroma: tier === 'high' ? 0.85 : 0.0, // chromatic-aberration multiplier
    anisotropy: weak ? 4 : 8,
    exposure: 0.88,
  };
}

export const QUALITY = detect();
