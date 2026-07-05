/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — atmosphere.js
   A living sky that journeys Dawn → Day → Sunset → Night and loops.
   Owns: gradient sky-dome shader (sun/moon core + scatter + stars),
   a travelling celestial disc, a cylindrical horizon panorama
   (far mountains, near headlands, shimmering Aegean sea), and drives
   the scene fog + sun/hemi lights + tone-map exposure each frame.
   Everything is phase-tinted so the whole world changes mood together.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { mesh } from './gfx.js';
import { G } from './config.js';
import { QUALITY } from './quality.js';

const C = (hex) => new THREE.Color(hex);

/* ── Phase keyframes. Each is a full atmospheric mood. ──────────── */
const PHASES = [
  { name: 'dawn',
    top: 0x24386e, mid: 0x9a6fa6, bot: 0xf2a86a, haze: 0xf6b07a,
    sunDir: [0.30, 0.13, -1], sunCol: 0xffd7a0, disc: 0xfff0d2, discSize: 1.0, tight: 240, glow: 0.30,
    night: 0.18, fog: 0xdcae86,
    hemiSky: 0x9bb3d8, hemiGround: 0x6e6a4c, hemiInt: 0.45,
    sunLight: 0xffd0a0, sunInt: 1.7, exposure: 0.92,
    mtnFar: 0xc59ab0, mtnNear: 0x7d6a86, sea: 0x6f86a8, seaSun: 0xffc98a },
  { name: 'day',
    top: 0x2E8BD6, mid: 0x83C7F0, bot: 0xFBEFD6, haze: 0xfbe6c2,
    sunDir: [0.18, 0.55, -1], sunCol: 0xfff3d0, disc: 0xfff6da, discSize: 0.9, tight: 260, glow: 0.16,
    night: 0.0, fog: 0xCDE6F5,
    hemiSky: 0xbfe3ff, hemiGround: 0x9aa86a, hemiInt: 0.42,
    sunLight: 0xfff1d2, sunInt: 2.15, exposure: 0.88,
    mtnFar: 0x9fb6cf, mtnNear: 0x6f93b0, sea: 0x2f86c4, seaSun: 0xfff2c0 },
  { name: 'sunset',
    top: 0x223066, mid: 0xd9633a, bot: 0xffce78, haze: 0xff9d52,
    sunDir: [-0.22, 0.08, -1], sunCol: 0xff8a32, disc: 0xffce8a, discSize: 1.7, tight: 90, glow: 0.55,
    night: 0.12, fog: 0xe0935a,
    hemiSky: 0xc88f7a, hemiGround: 0x6a5238, hemiInt: 0.46,
    sunLight: 0xff944a, sunInt: 1.8, exposure: 0.92,
    mtnFar: 0xc98a6a, mtnNear: 0x6e4a52, sea: 0x9a6a5a, seaSun: 0xffb45a },
  { name: 'night',
    top: 0x070f28, mid: 0x132a52, bot: 0x244069, haze: 0x2a4a78,
    sunDir: [-0.20, 0.52, -1], sunCol: 0xbcd2ff, disc: 0xeef4ff, discSize: 0.75, tight: 420, glow: 0.10,
    night: 1.0, fog: 0x132440,
    hemiSky: 0x35507f, hemiGround: 0x1a2236, hemiInt: 0.5,
    sunLight: 0xaec6ff, sunInt: 0.6, exposure: 0.86,
    mtnFar: 0x26385f, mtnNear: 0x161f3c, sea: 0x16294a, seaSun: 0xbcd2ff },
];

const SECONDS_PER_PHASE = 34;   // ~2¼ min for a full day-night loop

export class Atmosphere {
  constructor(scene) {
    this.scene = scene;
    this.t = SECONDS_PER_PHASE * 1.0;   // start the menu in daylight
    this._tmp = { top: C(0), mid: C(0), bot: C(0), haze: C(0), sunCol: C(0), disc: C(0),
                  sunLight: C(0), hemiSky: C(0), hemiGround: C(0), fog: C(0),
                  mtnFar: C(0), mtnNear: C(0), sea: C(0), seaSun: C(0), dir: new THREE.Vector3() };

    this._buildSky();
    this._buildCelestial();
    this._buildBackdrop();
  }

  /* ── sky dome: gradient + sun/moon glow + procedural stars ────── */
  _buildSky() {
    const u = {
      uTop: { value: C(0x2E8BD6) }, uMid: { value: C(0x83C7F0) }, uBot: { value: C(0xFBEFD6) },
      uHaze: { value: C(0xfbe6c2) }, uSunDir: { value: new THREE.Vector3(0.18, 0.55, -1).normalize() },
      uSunCol: { value: C(0xfff3d0) }, uTight: { value: 260 }, uGlow: { value: 0.16 },
      uNight: { value: 0 }, uTime: { value: 0 },
    };
    this.sky = u;
    const mtl = new THREE.ShaderMaterial({
      side: THREE.BackSide, depthWrite: false, uniforms: u,
      vertexShader: `varying vec3 vP; void main(){ vec4 w=modelMatrix*vec4(position,1.); vP=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }`,
      fragmentShader: `
        precision highp float;
        uniform vec3 uTop,uMid,uBot,uHaze,uSunCol; uniform vec3 uSunDir;
        uniform float uTight,uGlow,uNight,uTime; varying vec3 vP;
        float hash(vec3 p){ return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453); }
        void main(){
          vec3 d = normalize(vP);
          float t = clamp(d.y*0.5+0.5, 0., 1.);
          vec3 col = t < 0.5 ? mix(uBot,uMid,smoothstep(0.0,0.5,t))
                             : mix(uMid,uTop,smoothstep(0.5,1.0,t));
          // horizon haze
          col += uHaze * pow(1.0-abs(d.y), 7.0) * 0.6;
          // stars (night only), high in the dome, gently twinkling
          if (uNight > 0.01) {
            vec3 q = floor(d * 240.0);
            float h = hash(q);
            float s = smoothstep(0.9972, 1.0, h);
            float tw = 0.6 + 0.4*sin(uTime*2.5 + h*120.0);
            col += vec3(0.85,0.9,1.0) * s * tw * uNight * smoothstep(0.02,0.35,d.y);
          }
          // sun / moon
          float sd = max(dot(d,uSunDir), 0.0);
          col += uSunCol * pow(sd, uTight) * 1.5;
          col += uSunCol * pow(sd, 8.0) * uGlow;
          // dither to kill banding
          col += (hash(vec3(d.xy*620.0, 1.0))-0.5)*0.012;
          gl_FragColor = vec4(col, 1.0);
        }`,
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(480, 40, 22), mtl);
    sky.frustumCulled = false; sky.renderOrder = -10;
    this.scene.add(sky);
  }

  /* ── travelling celestial body (sun by day, moon by night) ──────
     Additive-blended: the disc ADDS to the sky-shader glow instead of
     occluding it, so it can never render darker than the halo around
     it (the old "eclipse" artifact). */
  _buildCelestial() {
    const g = new THREE.Group();
    this.disc = mesh(new THREE.CircleGeometry(14, 40),
      new THREE.MeshBasicMaterial({ color: 0xfff6da, transparent: true, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }), 0, 0, 0);
    g.add(this.disc);
    this.halos = [];
    for (let i = 1; i <= 3; i++) {
      const h = mesh(new THREE.CircleGeometry(14 + i * 10, 40),
        new THREE.MeshBasicMaterial({ color: 0xfff2cf, transparent: true, opacity: 0.12 / i, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }), 0, 0, -i);
      g.add(h); this.halos.push(h);
    }
    g.renderOrder = -9;
    this.celestial = g;
    this.scene.add(g);
  }

  /* ── horizon panorama: mountains + headlands + Aegean sea ───────
     One cylinder per layer, all sharing eye-level (y≈6) as v=0.5 so
     the horizon line lands exactly where the grass meets the sky.
     Sea is a thin bright band just above that line (peeks over the
     grass); mountains rise behind it. depthTest off so they always
     sit at the far horizon regardless of the scrolling world.       */
  _buildBackdrop() {
    const cyl = (radius, tex, renderOrder, blend) => {
      const geo = new THREE.CylinderGeometry(radius, radius, BACK_H, 128, 1, true);
      const m = new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, depthTest: true, side: THREE.BackSide, fog: false });
      if (blend) m.blending = blend;
      const mh = new THREE.Mesh(geo, m);
      mh.position.set(0, BACK_Y, G_CAM_Z);
      mh.renderOrder = renderOrder;
      mh.frustumCulled = false;
      this.scene.add(mh);
      return mh;
    };
    this.mtnFar  = cyl(372, ridgeTexture(0.70, 5, 0.05), -8);
    this.mtnNear = cyl(338, ridgeTexture(0.52, 8, 0.12), -7);
    this.sea     = cyl(300, seaTexture(), -6);
    this.haze    = cyl(296, hazeTexture(), -5.5);
    this.seaSun  = cyl(294, sunPathTexture(), -5, THREE.AdditiveBlending);
  }

  /* ── per-frame blend + apply ──────────────────────────────────── */
  update(dt, lights, renderer) {
    this.t += dt;
    this.sky.uTime.value += dt;

    const span = SECONDS_PER_PHASE;
    const total = PHASES.length * span;
    const tt = ((this.t % total) + total) % total;
    const idx = Math.floor(tt / span);
    const f = smooth(tt / span - idx);          // eased cross-fade
    const a = PHASES[idx], b = PHASES[(idx + 1) % PHASES.length];
    const T = this._tmp;

    T.top.copy(C(a.top)).lerp(C(b.top), f);
    T.mid.copy(C(a.mid)).lerp(C(b.mid), f);
    T.bot.copy(C(a.bot)).lerp(C(b.bot), f);
    T.haze.copy(C(a.haze)).lerp(C(b.haze), f);
    T.sunCol.copy(C(a.sunCol)).lerp(C(b.sunCol), f);
    T.disc.copy(C(a.disc)).lerp(C(b.disc), f);
    T.sunLight.copy(C(a.sunLight)).lerp(C(b.sunLight), f);
    T.hemiSky.copy(C(a.hemiSky)).lerp(C(b.hemiSky), f);
    T.hemiGround.copy(C(a.hemiGround)).lerp(C(b.hemiGround), f);
    T.fog.copy(C(a.fog)).lerp(C(b.fog), f);
    T.mtnFar.copy(C(a.mtnFar)).lerp(C(b.mtnFar), f);
    T.mtnNear.copy(C(a.mtnNear)).lerp(C(b.mtnNear), f);
    T.sea.copy(C(a.sea)).lerp(C(b.sea), f);
    T.seaSun.copy(C(a.seaSun)).lerp(C(b.seaSun), f);

    const dir = T.dir.set(
      lerp(a.sunDir[0], b.sunDir[0], f),
      lerp(a.sunDir[1], b.sunDir[1], f),
      lerp(a.sunDir[2], b.sunDir[2], f),
    ).normalize();
    const night = lerp(a.night, b.night, f);
    const tight = lerp(a.tight, b.tight, f);
    const glow = lerp(a.glow, b.glow, f);
    const discSize = lerp(a.discSize, b.discSize, f);
    const sunInt = lerp(a.sunInt, b.sunInt, f);
    const hemiInt = lerp(a.hemiInt, b.hemiInt, f);
    const exposure = lerp(a.exposure, b.exposure, f);

    // sky uniforms
    this.sky.uTop.value.copy(T.top); this.sky.uMid.value.copy(T.mid); this.sky.uBot.value.copy(T.bot);
    this.sky.uHaze.value.copy(T.haze); this.sky.uSunCol.value.copy(T.sunCol);
    this.sky.uSunDir.value.copy(dir); this.sky.uTight.value = tight; this.sky.uGlow.value = glow;
    this.sky.uNight.value = night;

    // celestial disc rides the sun direction, faces the camera
    this.celestial.position.set(dir.x * 300, dir.y * 300, G_CAM_Z + dir.z * 300);
    this.celestial.lookAt(0, G.CAM_Y, G_CAM_Z);
    this.disc.material.color.copy(T.disc);
    this.disc.scale.setScalar(discSize);
    for (const h of this.halos) { h.material.color.copy(T.disc); h.material.opacity = (0.13 * glow / 0.16) * (1 - night * 0.6); }

    // backdrop tints
    this.mtnFar.material.color.copy(T.mtnFar);
    this.mtnNear.material.color.copy(T.mtnNear);
    this.sea.material.color.copy(T.sea);
    this.seaSun.material.color.copy(T.seaSun);
    this.seaSun.material.opacity = 0.55 * (0.4 + glow);
    // horizon haze glow — tinted with the sky-haze colour, softened at night
    this.haze.material.color.copy(T.haze);
    this.haze.material.opacity = 0.6 * (1 - night * 0.5);

    // scene fog
    if (this.scene.fog) this.scene.fog.color.copy(T.fog);

    // lights
    if (lights) {
      if (lights.hemi) { lights.hemi.color.copy(T.hemiSky); lights.hemi.groundColor.copy(T.hemiGround); lights.hemi.intensity = hemiInt; }
      if (lights.sun)  { lights.sun.color.copy(T.sunLight); lights.sun.intensity = sunInt;
        lights.sun.position.set(dir.x * 60 + 4, Math.max(6, dir.y * 60), dir.z * 40 + 30); }
    }
    // tone-map exposure
    if (renderer) renderer.toneMappingExposure = exposure;
  }
}

const G_CAM_Z = G.CAM_Z;
const BACK_Y = 4.0;
const BACK_H = 220;
const lerp = (a, b, t) => a + (b - a) * t;
const smooth = (t) => t * t * (3 - 2 * t);

function ridgeTexture(peakFrac, peaks, jitter) {
  const W = 2048, H = 512, horizon = H * 0.5;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.clearRect(0, 0, W, H);
  x.fillStyle = '#ffffff';
  x.beginPath();
  x.moveTo(0, horizon);
  const steps = peaks * 22, amp = peakFrac * horizon;
  const ph = Math.random() * 10;
  for (let i = 0; i <= steps; i++) {
    const px = (i / steps) * W;
    const prof = (
      0.55 * (0.5 + 0.5 * Math.sin(i / steps * Math.PI * peaks * 2 + ph)) +
      0.30 * (0.5 + 0.5 * Math.sin(i * 0.9 + ph * 2)) +
      0.15 * Math.random()
    );
    const ridgeY = horizon - amp * prof - (Math.random() - 0.5) * jitter * H;
    x.lineTo(px, ridgeY);
  }
  x.lineTo(W, horizon); x.closePath(); x.fill();

  x.globalCompositeOperation = 'destination-in';
  const fade = x.createLinearGradient(0, horizon - amp, 0, horizon + 2);
  fade.addColorStop(0.0, 'rgba(0,0,0,1)');
  fade.addColorStop(0.5, 'rgba(0,0,0,0.95)');
  fade.addColorStop(0.82, 'rgba(0,0,0,0.45)');
  fade.addColorStop(1.0, 'rgba(0,0,0,0)');
  x.fillStyle = fade;
  x.fillRect(0, horizon - amp - 30, W, amp + 40);
  x.globalCompositeOperation = 'source-over';

  const t = new THREE.CanvasTexture(c);
  t.wrapS = THREE.RepeatWrapping; t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function hazeTexture() {
  const W = 8, H = 256, horizon = H * 0.5;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.clearRect(0, 0, W, H);
  const g = x.createLinearGradient(0, horizon - 70, 0, horizon + 56);
  g.addColorStop(0.00, 'rgba(255,255,255,0)');
  g.addColorStop(0.42, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.55, 'rgba(255,255,255,1)');
  g.addColorStop(0.70, 'rgba(255,255,255,0.7)');
  g.addColorStop(1.00, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, horizon - 70, W, 126);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function seaTexture() {
  const W = 1024, H = 256, horizon = H * 0.5;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.clearRect(0, 0, W, H);
  const top = horizon - 2, bot = horizon + 18;
  const g = x.createLinearGradient(0, top, 0, bot);
  g.addColorStop(0, 'rgba(255,255,255,0.55)');
  g.addColorStop(0.3, 'rgba(255,255,255,0.5)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(0, top, W, bot - top);
  for (let i = 0; i < 90; i++) {
    const yy = top + 2 + Math.random() * (bot - top - 4);
    x.globalAlpha = 0.12 + Math.random() * 0.2;
    x.fillStyle = 'rgba(255,255,255,1)';
    x.fillRect(Math.random() * W, yy, 8 + Math.random() * 40, 1.1);
  }
  x.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function sunPathTexture() {
  const W = 1024, H = 256, horizon = H * 0.5;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const x = c.getContext('2d');
  x.clearRect(0, 0, W, H);
  const cx = W * 0.5, top = horizon - 4, bot = horizon + 22;
  const g = x.createRadialGradient(cx, horizon - 2, 4, cx, horizon + 4, 150);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.5, 'rgba(255,255,255,0.32)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  x.fillStyle = g; x.fillRect(cx - 150, top, 300, bot - top);
  x.fillStyle = 'rgba(255,255,255,0.9)';
  for (let i = 0; i < 80; i++) {
    const yy = top + Math.random() * (bot - top);
    const spread = 14 + (yy - top) * 1.4;
    x.globalAlpha = 0.5 * (1 - (yy - top) / (bot - top));
    x.fillRect(cx - spread / 2 + Math.random() * spread, yy, 5 + Math.random() * 9, 1.3);
  }
  x.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
