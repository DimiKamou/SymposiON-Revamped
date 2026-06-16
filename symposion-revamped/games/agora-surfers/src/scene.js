/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — scene.js
   Renderer · bright gradient sky · sun · lights · scrolling road.
   Design: FIXED camera, MOVING world (props scroll toward camera).
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PAL, G } from './config.js';
import { mesh, setEnv } from './gfx.js';
import { QUALITY } from './quality.js';

export function initRenderer(stage) {
  const renderer = new THREE.WebGLRenderer({ antialias: !QUALITY.weak, powerPreference: 'high-performance', preserveDrawingBuffer: true, stencil: false });
  renderer.setPixelRatio(QUALITY.dpr);
  renderer.setSize(stage.clientWidth, stage.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = QUALITY.exposure;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = QUALITY.weak ? THREE.PCFShadowMap : THREE.PCFSoftShadowMap;
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
  sun.castShadow = true;
  sun.shadow.mapSize.set(QUALITY.shadowMap, QUALITY.shadowMap);
  const d = 20;
  sun.shadow.camera.near = 1; sun.shadow.camera.far = 90;
  sun.shadow.camera.left = -d; sun.shadow.camera.right = d;
  sun.shadow.camera.top = d; sun.shadow.camera.bottom = -d;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.025;
  sun.shadow.radius = QUALITY.shadowRadius;
  // keep the shadow frustum centred a bit ahead of the player
  sun.target.position.set(0, 0, -6);
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

  // wide grass verge (static, large)
  const grassTex = makeGrassTexture();
  const grass = mesh(new THREE.PlaneGeometry(220, 700, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xc7d49a, map: grassTex, roughness: 0.96, metalness: 0, envMapIntensity: 0.3 }), 0, -0.02, -180);
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  group.add(grass);

  // marble road — repeating texture scrolled along length
  const roadTex = makeRoadTexture();
  roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping;
  roadTex.repeat.set(1, 26);
  roadTex.anisotropy = QUALITY.anisotropy;
  const roadRough = makeRoadRough();
  roadRough.wrapS = roadRough.wrapT = THREE.RepeatWrapping;
  roadRough.repeat.set(1, 26);
  const road = mesh(new THREE.PlaneGeometry(9.4, 700, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0xcabf9f, map: roadTex, roughnessMap: roadRough, roughness: 0.6, metalness: 0.0, envMapIntensity: 0.6 }), 0, 0, -180);
  road.rotation.x = -Math.PI / 2;
  road.receiveShadow = true;
  group.add(road);

  // terracotta kerbs
  const kerbMat = new THREE.MeshStandardMaterial({ color: PAL.roadEdge, roughness: 0.8, metalness: 0, envMapIntensity: 0.6 });
  const kerbL = mesh(new THREE.BoxGeometry(0.5, 0.35, 700), kerbMat, -5.0, 0.1, -180);
  const kerbR = mesh(new THREE.BoxGeometry(0.5, 0.35, 700), kerbMat, 5.0, 0.1, -180);
  kerbL.receiveShadow = kerbR.receiveShadow = true;
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
  // base polished marble
  const g = x.createLinearGradient(0, 0, 512, 0);
  g.addColorStop(0, '#ddd2b8'); g.addColorStop(0.5, '#f6f1e2'); g.addColorStop(1, '#ddd2b8');
  x.fillStyle = g; x.fillRect(0, 0, 512, 512);
  // soft mottling
  for (let i = 0; i < 900; i++) {
    x.fillStyle = `rgba(${190 + Math.random()*40|0},${175 + Math.random()*40|0},${140 + Math.random()*40|0},0.05)`;
    const r = 6 + Math.random() * 30;
    x.beginPath(); x.arc(Math.random()*512, Math.random()*512, r, 0, 7); x.fill();
  }
  // marble veins (fine, branching)
  for (let i = 0; i < 30; i++) {
    x.strokeStyle = `rgba(120,100,72,${0.06 + Math.random()*0.12})`;
    x.lineWidth = 0.6 + Math.random() * 1.4;
    x.beginPath();
    let sx = Math.random() * 512, sy = Math.random() * 512;
    x.moveTo(sx, sy);
    for (let k = 0; k < 4; k++) {
      sx += (Math.random()-0.5) * 90; sy += 40 + Math.random()*60;
      x.quadraticCurveTo(sx + (Math.random()-0.5)*40, sy - 30, sx, sy);
    }
    x.stroke();
  }
  // tile seams (subtle grout)
  x.strokeStyle = 'rgba(70,55,35,0.4)'; x.lineWidth = 4;
  for (const yy of [6, 256]) { x.beginPath(); x.moveTo(0, yy); x.lineTo(512, yy); x.stroke(); }
  x.strokeStyle = 'rgba(255,255,255,0.25)'; x.lineWidth = 1.5;
  for (const yy of [10, 260]) { x.beginPath(); x.moveTo(0, yy); x.lineTo(512, yy); x.stroke(); }
  // two gold lane dividers (inlaid brass strips)
  for (const cx of [170, 342]) {
    const lg = x.createLinearGradient(cx - 5, 0, cx + 5, 0);
    lg.addColorStop(0, '#a8761e'); lg.addColorStop(0.5, '#f2cf6a'); lg.addColorStop(1, '#a8761e');
    x.fillStyle = lg; x.fillRect(cx - 4, 0, 8, 512);
    x.fillStyle = 'rgba(255,242,200,0.55)'; x.fillRect(cx - 1, 0, 2, 512);
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
  const c = document.createElement('canvas'); c.width = 128; c.height = 128;
  const x = c.getContext('2d');
  x.fillStyle = '#8aa94f'; x.fillRect(0, 0, 128, 128);
  for (let i = 0; i < 400; i++) {
    x.fillStyle = Math.random() > 0.5 ? 'rgba(110,139,60,0.5)' : 'rgba(150,170,90,0.5)';
    x.fillRect(Math.random() * 128, Math.random() * 128, 2, 4);
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(40, 120);
  return t;
}
