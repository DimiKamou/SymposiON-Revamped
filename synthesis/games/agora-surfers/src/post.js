/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — post.js
   Cinematic post stack: HDR render → UnrealBloom (highlight glow on
   sun, gold, molten eyes) → tonemap/sRGB → final grade pass
   (vignette, filmic contrast, gentle teal-shadow / warm-highlight
   split-tone, edge chromatic aberration, dithered grain).
   Adaptive — phones get a lighter version via QUALITY.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { QUALITY } from './quality.js';

/* Final-look grade — runs in sRGB after tonemap/OutputPass. */
const GradeShader = {
  uniforms: {
    tDiffuse:   { value: null },
    uTime:      { value: 0 },
    uVignette:  { value: 1.0 },   // strength
    uChroma:    { value: 1.0 },   // edge chromatic aberration
    uGrain:     { value: 1.0 },   // film grain amount
    uContrast:  { value: 1.17 },
    uSat:       { value: 1.33 },
    uPulse:     { value: 0.0 },   // 0..1 danger red flash driven by game
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
  `,
  fragmentShader: /* glsl */`
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform float uTime, uVignette, uChroma, uGrain, uContrast, uSat, uPulse;

    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

    void main(){
      vec2 uv = vUv;
      vec2 c = uv - 0.5;
      float r2 = dot(c, c);

      // chromatic aberration — near-zero in the centre, only the very
      // corners get a faint fringe (no more rainbow edges on the columns)
      float ca = uChroma * r2 * r2 * 0.006;
      vec2 dir = normalize(c + 1e-5);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + dir * ca).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - dir * ca).b;

      // filmic contrast around mid-grey
      col = (col - 0.5) * uContrast + 0.5;

      // very light split-tone so colour stays vivid & arcade-bright
      float luma = dot(col, vec3(0.299, 0.587, 0.114));
      vec3 shadowTint = vec3(0.985, 1.00, 1.02);
      vec3 highTint   = vec3(1.02, 1.00, 0.985);
      col *= mix(shadowTint, highTint, smoothstep(0.15, 0.85, luma));

      // saturation — punchy, Subway-Surfers pop
      col = mix(vec3(luma), col, uSat);

      // danger pulse — push toward warm red when the game flags peril
      col = mix(col, col * vec3(1.25, 0.72, 0.66) + vec3(0.12, 0.0, 0.0), uPulse * 0.5);

      // vignette — a touch heavier so the frame corners cradle the action
      float vig = smoothstep(0.95, 0.30, r2 * 1.9);
      col *= mix(1.0, vig, 0.62 * uVignette);

      // dithered film grain (also kills banding) — kept very light
      float g = hash(uv * vec2(1920.0, 1080.0) + uTime) - 0.5;
      col += g * (0.018 * uGrain);

      gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
    }
  `,
};

export function makePost(renderer, scene, camera) {
  // ── LOW tier: no composer at all — raw forward render keeps weak
  //    school laptops at 60fps. The DOM danger vignette covers pulses.
  if (!QUALITY.post) {
    return {
      composer: null, bloom: null, grade: null,
      setSize() {},
      render() { renderer.render(scene, camera); },
      setPulse() {},
      setSpeed() {},
    };
  }

  const size = new THREE.Vector2();
  renderer.getSize(size);

  // HDR target; MSAA samples on the high tier give the composer path the
  // edge quality the (bypassed) canvas antialias used to provide.
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType });
  if (QUALITY.msaa && renderer.capabilities.isWebGL2) rt.samples = QUALITY.msaa;

  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(QUALITY.dpr);
  composer.setSize(size.x, size.y);

  composer.addPass(new RenderPass(scene, camera));

  // ── HIGH tier only: gentle bloom on sun / gold / molten seams
  let bloom = null;
  if (QUALITY.bloom) {
    bloom = new UnrealBloomPass(
      new THREE.Vector2(size.x, size.y),
      QUALITY.bloomStrength, QUALITY.bloomRadius, QUALITY.bloomThreshold,
    );
    composer.addPass(bloom);
  }

  // tonemap (uses renderer.toneMapping) + correct sRGB output
  composer.addPass(new OutputPass());

  const grade = new ShaderPass(GradeShader);
  grade.uniforms.uChroma.value = QUALITY.chroma * 0.55;
  grade.uniforms.uGrain.value = QUALITY.grain ? 1.0 : 0.0;
  grade.renderToScreen = true;
  composer.addPass(grade);

  function setSize(w, h) {
    composer.setSize(w, h);
    if (bloom) bloom.setSize(w, h);
  }

  function render(dt) {
    grade.uniforms.uTime.value += dt;
    composer.render(dt);
  }

  return {
    composer, bloom, grade, setSize, render,
    setPulse(v) { grade.uniforms.uPulse.value = v; },
    // chromatic fringe widens with velocity — the "wind in the lens" cue
    setSpeed(f) { grade.uniforms.uChroma.value = QUALITY.chroma * (0.55 + 0.9 * f); },
  };
}
