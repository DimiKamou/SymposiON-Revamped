/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — scene.js
   Renderer · bright gradient sky · sun · lights · scrolling road.
   Design: FIXED camera, MOVING world (props scroll toward camera).
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PAL, G } from './config.js';
import { mesh, setEnv, gradTint } from './gfx.js';
import { QUALITY } from './quality.js';

export function initRenderer(stage) {
  // preserveDrawingBuffer costs a full-frame copy per composite — nothing in
  // the app reads the canvas back, so weak devices skip it (desktop keeps it).
  const renderer = new THREE.WebGLRenderer({ antialias: !QUALITY.weak, powerPreference: 'high-performance', preserveDrawingBuffer: !QUALITY.weak, stencil: false });
  renderer.setPixelRatio(QUALITY.dpr);
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = QUALITY.exposure;
  // real shadow map on high/mid tiers; low tier grounds everything with
  // contact blobs instead so weak laptops keep their frame budget.
  renderer.shadowMap.enabled = QUALITY.shadows;
  renderer.shadowMap.type = QUALITY.tier === 'high' ? THREE.PCFSoftShadowMap : THREE.PCFShadowMap;
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  // distance haze that matches the sky low-band — deeper so far props melt
  // into the atmosphere instead of popping in.
  scene.fog = new THREE.Fog(PAL.fog, 70, 250);

  // Image-based lighting — one-time PMREM bake of a soft room env.
  // Gives marble a gentle sheen and makes bronze read as real metal.
  try {
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTex;
    setEnv(envTex);
    pmrem.dispose();
  } catch (e) { console.warn('[AgoraSurfers] env map unavailable:', e); }

  const camera = new THREE.PerspectiveCamera(60, stage.clientWidth / stage.clientHeight, 0.1, 600);
  camera.position.set(0, G.CAM_Y, G.CAM_Z);
  camera.lookAt(0, G.CAM_LOOK_Y, G.CAM_LOOK_Z);

  function resize() {
    const w = stage.clientWidth, h = stage.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', resize);

  return { renderer, scene, camera, resize };
}

/* ── Bright daytime gradient sky (cheap shader sphere) + sun ────── */
export function makeSky(scene) {
  const geo = new THREE.SphereGeometry(480, 32, 16);
  const m = new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false,
    uniforms: {
      uTop: { value: new THREE.Color(PAL.skyTop) },
      uMid: { value: new THREE.Color(PAL.skyMid) },
      uBot: { value: new THREE.Color(PAL.skyHorizon) },
    },
    vertexShader: `
      varying vec3 vP;
      void main(){ vec4 w = modelMatrix*vec4(position,1.); vP = w.xyz; gl_Position = projectionMatrix*viewMatrix*w; }`,
    fragmentShader: `
      uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uBot;
      varying vec3 vP;
      // cheap hash for a faint dithered gradient (no banding on phones)
      float h(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7)))*43758.5); }
      void main(){
        vec3 d = normalize(vP);
        float t = clamp(d.y*0.5+0.5, 0., 1.);
        // three-stop atmospheric gradient with a soft horizon glow
        vec3 col = t < 0.5
          ? mix(uBot, uMid, smoothstep(0.0,0.5,t))
          : mix(uMid, uTop, smoothstep(0.5,1.0,t));
        // warm haze lifting off the horizon
        col += vec3(0.10,0.07,0.03) * pow(1.0 - abs(d.y), 6.0);
        // sun + scattering halo toward -z, high
        vec3 sunDir = normalize(vec3(0.18, 0.40, -1.0));
        float s = max(dot(d, sunDir), 0.);
        col += vec3(1.0,0.95,0.78) * pow(s, 250.0) * 1.6;   // tight core (blooms)
        col += vec3(1.0,0.90,0.66) * pow(s, 9.0)   * 0.16;  // wide scatter
        col += vec3(0.55,0.72,0.95) * pow(max(-d.y+0.1,0.),2.0) * 0.05;
        col += (h(d.xy*512.0)-0.5)*0.012;                   // dither
        gl_FragColor = vec4(col, 1.0);
      }`,
  });
  const sky = new THREE.Mesh(geo, m);
  sky.frustumCulled = false;
  scene.add(sky);

  // sun disc
  const sun = mesh(new THREE.CircleGeometry(20, 32),
    new THREE.MeshBasicMaterial({ color: 0xfff6da }), 40, 95, -260);
  sun.lookAt(0, G.CAM_Y, G.CAM_Z);
  scene.add(sun);
  for (let i = 1; i <= 3; i++) {
    const halo = mesh(new THREE.CircleGeometry(20 + i * 12, 32),
      new THREE.MeshBasicMaterial({ color: 0xfff2cf, transparent: true, opacity: 0.12 / i, depthWrite: false }),
      40, 95, -262 - i);
    halo.lookAt(0, G.CAM_Y, G.CAM_Z);
    scene.add(halo);
  }
  return sky;
}

/* ── Lights — sunny midday (env map handles ambient/fill) ──────── */
export function makeLights(scene) {
  const hemi = new THREE.HemisphereLight(0xbfe3ff, 0x9aa86a, 0.42);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xfff1d2, 2.15);
  sun.position.set(16, 32, 14);
  sun.castShadow = QUALITY.shadows;
  sun.shadow.mapSize.set(QUALITY.shadowMap, QUALITY.shadowMap);
  // ortho box hugging the action lane — wide enough that props a good way
  // up the road still drop shadows instead of popping in shadowless
  const d = 22;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 140;
  sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
  sun.shadow.camera.top = d; sun.shadow.camera.bottom = -d * 0.9;
  // CRITICAL: bounds changed after construction — without this the frustum
  // silently stays at the ±5 default and shadows all but disappear.
  sun.shadow.camera.updateProjectionMatrix();
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.025;
  sun.shadow.radius = QUALITY.shadowRadius;
  // keep the shadow frustum centred a bit ahead of the player
  sun.target.position.set(0, 0, -11);
  scene.add(sun); scene.add(sun.target);

  const fill = new THREE.DirectionalLight(0xcfe0ff, 0.25);
  fill.position.set(-12, 14, 8);
  scene.add(fill);
  return { hemi, sun };
}

/* ── Ground + scrolling marble road ────────────────────────────── */
export function makeGround(scene) {
  const group = new THREE.Group();
  scene.add(group);

  // wide grass verge (static, large) — richer sun-dried Aegean meadow
  const grassTex = makeGrassTexture();
  const grass = mesh(new THREE.PlaneGeometry(220, 700, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xffffff, map: grassTex, roughness: 0.96, metalness: 0, envMapIntensity: 0.3 }), 0, -0.02, -180);
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  group.add(grass);

  // trampled dust verges — soft sandy fade so the road melts into the
  // meadow instead of meeting it along a razor edge
  const vergeTex = makeVergeTexture();
  for (const side of [-1, 1]) {
    const v = mesh(new THREE.PlaneGeometry(2.6, 700, 1, 1),
      new THREE.MeshStandardMaterial({
        color: 0xCDb88a, map: vergeTex, transparent: true, roughness: 0.95,
        metalness: 0, envMapIntensity: 0.3, depthWrite: false,
      }), side * 6.4, -0.005, -180);
    v.rotation.x = -Math.PI / 2;
    if (side < 0) v.rotation.z = Math.PI;       // mirror the fade
    v.receiveShadow = true;
    group.add(v);
  }

  // marble road — repeating texture scrolled along length
  const roadTex = makeRoadTexture();
  roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping;
  roadTex.repeat.set(1, 26);
  roadTex.anisotropy = QUALITY.anisotropy;
  const roadRough = makeRoadRough();
  roadRough.wrapS = roadRough.wrapT = THREE.RepeatWrapping;
  roadRough.repeat.set(1, 26);
  const road = mesh(new THREE.PlaneGeometry(9.4, 700, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xCEC19E, map: roadTex, roughnessMap: roadRough, roughness: 0.68, metalness: 0.0, envMapIntensity: 0.42 }), 0, 0, -180);
  road.rotation.x = -Math.PI / 2;
  road.receiveShadow = true;
  group.add(road);

  // terracotta kerbs — vertex-tinted (sun-lit top edge, AO-dark footing).
  // Matte + muted ramp: the old shiny bright ramp read as neon-orange rails.
  const kerbMat = new THREE.MeshStandardMaterial({ color: PAL.roadEdge, roughness: 0.88, metalness: 0, envMapIntensity: 0.32, vertexColors: true });
  const kerbGeo = gradTint(new THREE.BoxGeometry(0.5, 0.35, 700), 0.68, 1.0);
  const kerbL = mesh(kerbGeo, kerbMat, -5.0, 0.1, -180);
  const kerbR = mesh(kerbGeo, kerbMat, 5.0, 0.1, -180);
  kerbL.receiveShadow = kerbR.receiveShadow = true;
  kerbL.castShadow = kerbR.castShadow = QUALITY.shadows;
  group.add(kerbL, kerbR);

  return {
    group, road, roadTex,
    update(distance) {
      // scroll the marble texture to sell forward motion
      roadTex.offset.y = -(distance / 700) * 26;
    },
  };
}

/* baked marble-tile road texture with gold lane lines + relief */
function makeRoadTexture() {
  const c = document.createElement('canvas'); c.width = 512; c.height = 512;
  const x = c.getContext('2d');
  // base polished marble — brighter crown, worn warm toward the kerbs
  const g = x.createLinearGradient(0, 0, 512, 0);
  g.addColorStop(0, '#cbbd9c'); g.addColorStop(0.16, '#e3d8bd'); g.addColorStop(0.5, '#f8f3e4');
  g.addColorStop(0.84, '#e3d8bd'); g.addColorStop(1, '#cbbd9c');
  x.fillStyle = g; x.fillRect(0, 0, 512, 512);
  // soft mottling
  for (let i = 0; i < 900; i++) {
    x.fillStyle = `rgba(${185 + Math.random()*45|0},${168 + Math.random()*45|0},${132 + Math.random()*45|0},0.06)`;
    const r = 6 + Math.random() * 30;
    x.beginPath(); x.arc(Math.random()*512, Math.random()*512, r, 0, 7); x.fill();
  }
  // marble veins (fine, branching) — a touch more present
  for (let i = 0; i < 44; i++) {
    x.strokeStyle = `rgba(112,92,64,${0.1 + Math.random()*0.15})`;
    x.lineWidth = 0.7 + Math.random() * 1.6;
    x.beginPath();
    let sx = Math.random() * 512, sy = Math.random() * 512;
    x.moveTo(sx, sy);
    for (let k = 0; k < 4; k++) {
      sx += (Math.random()-0.5) * 90; sy += 40 + Math.random()*60;
      x.quadraticCurveTo(sx + (Math.random()-0.5)*40, sy - 30, sx, sy);
    }
    x.stroke();
  }
  // wheel-wear tracks down each lane (darker polish where carts rolled)
  for (const cx of [86, 256, 426]) {
    const wg = x.createLinearGradient(cx - 34, 0, cx + 34, 0);
    wg.addColorStop(0, 'rgba(118,98,68,0)');
    wg.addColorStop(0.5, 'rgba(118,98,68,0.16)');
    wg.addColorStop(1, 'rgba(118,98,68,0)');
    x.fillStyle = wg; x.fillRect(cx - 34, 0, 68, 512);
  }
  // tile seams (grout) — deep shadow line + bright chipped top edge so the
  // slabs read as relief, not painted lines
  x.strokeStyle = 'rgba(64,50,30,0.55)'; x.lineWidth = 4;
  for (const yy of [6, 256]) { x.beginPath(); x.moveTo(0, yy); x.lineTo(512, yy); x.stroke(); }
  x.strokeStyle = 'rgba(255,255,255,0.38)'; x.lineWidth = 1.5;
  for (const yy of [10, 260]) { x.beginPath(); x.moveTo(0, yy); x.lineTo(512, yy); x.stroke(); }
  x.strokeStyle = 'rgba(64,50,30,0.3)'; x.lineWidth = 2.5;
  for (const [vx, y0, y1] of [[52, 6, 256], [120, 256, 512], [214, 6, 256], [300, 256, 512], [392, 6, 256], [462, 256, 512]]) {
    x.beginPath(); x.moveTo(vx, y0); x.lineTo(vx, y1); x.stroke();
  }
  // kerb-side ambient occlusion — grounds the road against its edges
  for (const [x0, x1] of [[0, 26], [486, 512]]) {
    const ag = x.createLinearGradient(x0 === 0 ? 26 : 486, 0, x0 === 0 ? 0 : 512, 0);
    ag.addColorStop(0, 'rgba(56,42,24,0)'); ag.addColorStop(1, 'rgba(56,42,24,0.34)');
    x.fillStyle = ag; x.fillRect(x0, 0, x1 - x0, 512);
  }
  // two gold lane dividers (inlaid brass strips) — dark inlay channel first,
  // then the bright metal, so the strip sits IN the marble instead of on it
  for (const cx of [170, 342]) {
    x.fillStyle = 'rgba(74,56,28,0.5)'; x.fillRect(cx - 6, 0, 12, 512);
    const lg = x.createLinearGradient(cx - 5, 0, cx + 5, 0);
    lg.addColorStop(0, '#96660f'); lg.addColorStop(0.5, '#f6d472'); lg.addColorStop(1, '#96660f');
    x.fillStyle = lg; x.fillRect(cx - 4, 0, 8, 512);
    x.fillStyle = 'rgba(255,244,204,0.65)'; x.fillRect(cx - 1, 0, 2, 512);
  }
  const t = new THREE.CanvasTexture(c);
  return t;
}

/* roughness map: gold strips & grout are shinier than the marble field */
function makeRoadRough() {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#9a9a9a'; x.fillRect(0, 0, 256, 256);   // marble = mid roughness
  for (let i = 0; i < 300; i++) {                          // mottle
    x.fillStyle = `rgba(${120 + Math.random()*90|0},0,0,0.04)`;
    x.beginPath(); x.arc(Math.random()*256, Math.random()*256, 4 + Math.random()*14, 0, 7); x.fill();
  }
  x.fillStyle = '#3a3a3a';                                 // brass strips = smoother (darker = shinier)
  for (const cx of [85, 171]) x.fillRect(cx - 2, 0, 4, 256);
  const t = new THREE.CanvasTexture(c);
  return t;
}

function makeGrassTexture() {
  // sun-dried Aegean meadow: olive greens broken by straw patches,
  // clover shadows and terracotta dust — kills the flat plastic look.
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const x = c.getContext('2d');
  x.fillStyle = '#879B4E'; x.fillRect(0, 0, 256, 256);
  // broad wind-drift sweeps — long soft diagonal bands of darker/lighter
  // green that break the tiling and give the meadow a raked direction
  for (let i = 0; i < 9; i++) {
    const dark = Math.random() < 0.5;
    const col = dark ? '96,118,50' : '162,178,92';
    const rg = x.createRadialGradient(0, 0, 4, 0, 0, 60 + Math.random() * 40);
    rg.addColorStop(0, `rgba(${col},${0.22 + Math.random() * 0.16})`);
    rg.addColorStop(1, `rgba(${col},0)`);
    x.save();
    x.translate(Math.random() * 256, Math.random() * 256);
    x.rotate(Math.random() * Math.PI);
    x.scale(1, 0.28);                            // squashed = long sweep
    x.fillStyle = rg; x.fillRect(-110, -110, 220, 220);
    x.restore();
  }
  // large soft patches (dry straw / lush clumps) — strong, so the meadow
  // reads as real ground from the low camera instead of a flat wash
  for (let i = 0; i < 64; i++) {
    const warm = Math.random() < 0.45;
    const rg = x.createRadialGradient(0, 0, 2, 0, 0, 20 + Math.random() * 42);
    const col = warm ? '182,170,92' : (Math.random() < 0.5 ? '100,126,52' : '150,170,86');
    rg.addColorStop(0, `rgba(${col},${0.4 + Math.random() * 0.36})`);
    rg.addColorStop(1, `rgba(${col},0)`);
    x.save();
    x.translate(Math.random() * 256, Math.random() * 256);
    x.fillStyle = rg; x.fillRect(-64, -64, 128, 128);
    x.restore();
  }
  // fine blade noise — chunkier now that the tile covers more ground
  for (let i = 0; i < 2100; i++) {
    const v = Math.random();
    x.fillStyle = v < 0.35 ? 'rgba(82,106,42,0.6)' : v < 0.7 ? 'rgba(160,178,92,0.58)' : 'rgba(186,182,112,0.5)';
    x.fillRect(Math.random() * 256, Math.random() * 256, 2, 5);
  }
  // clover-shadow freckles — tiny dark pools that anchor the blades
  for (let i = 0; i < 170; i++) {
    x.fillStyle = `rgba(52,70,28,${0.12 + Math.random() * 0.16})`;
    x.beginPath(); x.arc(Math.random() * 256, Math.random() * 256, 1.8 + Math.random() * 3.6, 0, 7); x.fill();
  }
  // scattered wildflowers (chamomile / poppy specks)
  for (let i = 0; i < 42; i++) {
    x.fillStyle = Math.random() < 0.6 ? 'rgba(246,240,212,0.9)' : 'rgba(212,92,60,0.85)';
    const px = Math.random() * 256, py = Math.random() * 256;
    x.beginPath(); x.arc(px, py, 1.1 + Math.random() * 1.3, 0, 7); x.fill();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  // fewer repeats = larger features → visible tufts/patches near the road
  t.repeat.set(8, 25);
  t.anisotropy = QUALITY.anisotropy;
  return t;
}

/* sandy trampled strip beside the kerbs — alpha fades outward */
function makeVergeTexture() {
  const c = document.createElement('canvas'); c.width = 64; c.height = 256;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 64, 0);
  g.addColorStop(0, 'rgba(255,244,214,0.95)');
  g.addColorStop(0.4, 'rgba(255,244,214,0.55)');
  g.addColorStop(1, 'rgba(255,244,214,0)');
  x.fillStyle = g; x.fillRect(0, 0, 64, 256);
  // pebbles + footprints noise
  for (let i = 0; i < 240; i++) {
    const px = Math.random() * 64;
    x.fillStyle = `rgba(120,100,66,${0.18 * (1 - px / 64) * Math.random()})`;
    x.fillRect(px, Math.random() * 256, 1.5, 1.5);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.ClampToEdgeWrapping; t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(1, 40);
  return t;
}
