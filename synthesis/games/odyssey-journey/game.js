// ============================================================
//  Odyssey Journey 3D — Three.js Game  (Cinematic Edition)
//  Depends on: ODYSSEY_LOCATIONS (data.js), THREE (CDN)
//
//  Visual/presentation upgrade only — quiz rules, scoring,
//  data sources and the launch contract are unchanged:
//    window.initOdysseyJourney(lang) / window.destroyOdysseyJourney()
//    (+ closeOdysseyJourney/openOdysseyJourney aliases for the
//     overlay ✕ button and favorites.js)
// ============================================================

(function () {
  'use strict';

  // ── State ──────────────────────────────────────────────────
  let renderer, scene, camera, clock;
  let oceanMesh, oceanPositions;
  let shipGroup;
  let locationGroups = [];
  let raycaster, mouse;
  let animFrame = null;
  let gameWrap = null;
  let elapsed = 0;
  let starsMesh = null;
  let wakeParticles = [];
  let islandLights = [];

  // Cinematic-layer state (all torn down in destroy)
  let REDUCED = false;
  // Cheap heuristic for mid/low-end phones: dial back the heaviest GPU/CPU
  // costs (shadows, antialias, DPR, ocean tessellation, star field) so the
  // 3D chart stays smooth on coarse-pointer / low-memory devices. Desktop
  // keeps the full cinematic path (LITE stays false there).
  let LITE = false;
  let normalsTick = 0;             // ocean-normals cadence counter (LITE)
  let skyMat = null;
  let oceanShader = null;       // injected ocean shader (uTime → crest glints)
  let hemiLight = null;         // hemisphere fill — mood-tinted per island
  let oceanColorAttr = null, oceanBaseColors = null;
  let foamMats = [];            // island foam-ring shader mats (uTime)
  let pathLegs = [];            // charted course lines {mat, aId, bId}
  let ripples = [];             // expanding harbor-arrival ripple rings
  let introDone = false;        // camera sweep waits for the intro card
  let cloudSprites = [];        // drifting horizon haze billboards
  let shootingStars = [];       // active meteor streaks
  let shootTimer = 0;
  let bursts = [];              // one-shot celebration particle bursts
  let sailGeo = null, sailBase = null;      // billowing sail
  let pennantGeo = null, pennantBase = null; // waving masthead pennant
  let trailMesh = null, trailBirths = null; // golden voyage-trail points
  let trailWrite = 0, trailTimer = 0;
  let camIntroT = 0;            // opening camera sweep progress (seconds)
  let camLook = null;           // smoothed camera look-target
  let pendingBurstLocId = null; // island awaiting its completion burst
  let quizPhase = null;         // 'question' | 'result' | null (Escape guard)
  let _texCache = {};

  // Game logic state
  let currentLang = 'gr';
  let completedSet = new Set();
  let selectedLoc = null;
  let shipCurrentPos, shipTargetPos;
  let shipMoving = false;
  let quizState = null;
  let lastShipDir = null;

  const CAM_BASE = { x: 0, y: 32, z: 26 };
  const GOLD_HEX = 0xffc860, LAUREL_HEX = 0x59e89c;

  // ── Public API ─────────────────────────────────────────────
  window.initOdysseyJourney = function (lang) {
    currentLang = lang || 'gr';
    REDUCED = false;
    try { REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
    try { LITE = matchMedia('(pointer:coarse)').matches || innerWidth < 720 || (navigator.deviceMemory || 8) <= 4; } catch (e) { LITE = false; }
    const _ov = document.getElementById('odyssey-journey-overlay');
    if (_ov) { _ov.style.display = 'flex'; _ov.classList.add('active'); }
    document.body.style.overflow = 'hidden';
    try { completedSet = new Set(JSON.parse(localStorage.getItem('oj-completed') || '[]')); } catch (e) { completedSet = new Set(); }
    gameWrap = document.getElementById('odyssey-journey-wrap');
    if (!gameWrap) return;
    gameWrap.innerHTML = '';
    elapsed = 0;
    shootTimer = 0;
    camIntroT = 0;
    introDone = false;
    pendingBurstLocId = null;
    quizPhase = null;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      loadThreeJS(buildGame);
    }));
  };

  window.destroyOdysseyJourney = function () {
    if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    if (renderer) { renderer.dispose(); renderer.forceContextLoss && renderer.forceContextLoss(); }
    renderer = null; scene = null; camera = null; clock = null;
    locationGroups = []; selectedLoc = null; quizState = null;
    wakeParticles = []; islandLights = [];
    foamMats = []; pathLegs = []; cloudSprites = []; shootingStars = []; bursts = [];
    ripples = [];
    skyMat = null; oceanShader = null; hemiLight = null; oceanMesh = null; oceanPositions = null;
    oceanColorAttr = null; oceanBaseColors = null;
    sailGeo = null; sailBase = null; pennantGeo = null; pennantBase = null;
    trailMesh = null; trailBirths = null; trailWrite = 0; trailTimer = 0;
    starsMesh = null; shipGroup = null; camLook = null;
    pendingBurstLocId = null; quizPhase = null;
    Object.keys(_texCache).forEach(k => { try { _texCache[k].dispose(); } catch (e) {} });
    _texCache = {};
    window.removeEventListener('resize', onResize);
    document.removeEventListener('keydown', onKeyDown);
    const _ov = document.getElementById('odyssey-journey-overlay');
    if (_ov) { _ov.classList.remove('active'); _ov.style.display = 'none'; }
    document.body.style.overflow = '';
  };

  // Aliases: the overlay partial's back button calls closeOdysseyJourney(),
  // and favorites.js probes for openOdysseyJourney — keep both wired.
  window.closeOdysseyJourney = function () { window.destroyOdysseyJourney(); };
  window.openOdysseyJourney  = function (lang) { window.initOdysseyJourney(lang); };

  window.ojNavigateTo   = navigateTo;
  window.ojStartQuiz    = startQuiz;
  window.ojSelectAnswer = selectAnswer;
  window.ojResetJourney = resetJourney;
  window.ojCloseLocPanel  = function () { hideEl('oj-loc-panel'); };
  window.ojCloseQuizPanel = function () {
    hideEl('oj-quiz-panel');
    quizPhase = null;
    firePendingBurst();
  };
  window.ojCloseVictory = function () {
    hideEl('oj-victory-panel');
    // festive send-off: a wave of bursts across the archipelago
    if (scene) {
      const n = REDUCED ? 3 : locationGroups.length;
      locationGroups.slice(0, n).forEach((g, i) => {
        setTimeout(() => {
          if (!scene) return;
          spawnBurst(g.position.x, (g.userData.locH || 4) + 2.5, g.position.z, LAUREL_HEX);
        }, i * 140);
      });
    }
    pendingBurstLocId = null;
  };
  window.ojDismissIntro = function () {
    introDone = true; // release the opening camera sweep
    const p = document.getElementById('oj-intro');
    if (!p) return;
    p.classList.add('oj-leaving');
    setTimeout(() => { p.style.display = 'none'; p.classList.remove('oj-leaving'); }, 380);
  };

  function firePendingBurst() {
    if (!pendingBurstLocId || !scene) { pendingBurstLocId = null; return; }
    const g = locationGroups.find(x => x.userData.locationId === pendingBurstLocId);
    if (g) {
      // a rhapsody conquered is the biggest beat on the chart — full
      // laurel fountain + the freshly-green beacon flaring in triumph
      spawnBurst(g.position.x, (g.userData.locH || 4) + 2.5, g.position.z, LAUREL_HEX,
        { n: 130, size: 1.15, sp0: 1.7, spR: 3.4, grav: 2.7, max: 2.1 });
      g.userData.flare = 1.9;
    }
    pendingBurstLocId = null;
  }

  // Escape closes the topmost in-game panel (never the whole game — the
  // shell owns overlay-level close). Mid-question the quiz is untouched so
  // a stray Escape can't abandon a run.
  function onKeyDown(e) {
    if (e.key !== 'Escape' && e.key !== 'Esc') return;
    const vis = id => { const el2 = document.getElementById(id); return el2 && el2.style.display !== 'none' && el2.style.display !== ''; };
    if (vis('oj-intro'))         { window.ojDismissIntro(); return; }
    if (vis('oj-victory-panel')) { window.ojCloseVictory(); return; }
    if (vis('oj-quiz-panel'))    { if (quizPhase === 'result') window.ojCloseQuizPanel(); return; }
    if (vis('oj-loc-panel'))     { window.ojCloseLocPanel(); }
  }

  // ── Three.js Loader ────────────────────────────────────────
  function loaderHTML() {
    const gr = currentLang === 'gr';
    return `<div class="oj-loader">
      <div class="oj-loader-scene">
        <svg class="oj-loader-ship" viewBox="0 0 140 90" aria-hidden="true">
          <g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <path d="M14 62 Q10 50 20 46 L112 46 Q126 46 132 34" />
            <path d="M132 34 Q134 52 116 62 L24 62 Q14 62 14 62 Z" fill="rgba(201,164,74,0.14)" />
            <line x1="66" y1="46" x2="66" y2="10" />
            <line x1="42" y1="14" x2="90" y2="14" />
            <path d="M45 16 Q66 40 87 16 Z" fill="rgba(201,164,74,0.22)" />
            <line x1="36" y1="62" x2="30" y2="74" /><line x1="56" y1="62" x2="50" y2="74" />
            <line x1="76" y1="62" x2="70" y2="74" /><line x1="96" y1="62" x2="90" y2="74" />
          </g>
        </svg>
        <div class="oj-loader-sea">
          <svg viewBox="0 0 300 20" preserveAspectRatio="none"><path d="M0 10 Q15 2 30 10 T60 10 T90 10 T120 10 T150 10 T180 10 T210 10 T240 10 T270 10 T300 10 V20 H0 Z" fill="currentColor"/></svg>
          <svg viewBox="0 0 300 20" preserveAspectRatio="none"><path d="M0 10 Q15 2 30 10 T60 10 T90 10 T120 10 T150 10 T180 10 T210 10 T240 10 T270 10 T300 10 V20 H0 Z" fill="currentColor"/></svg>
        </div>
      </div>
      <div class="oj-loader-title">${gr ? 'Φόρτωση 3D κόσμου…' : 'Loading the 3D world…'}</div>
      <div class="oj-loader-sub">${gr ? 'Ο άνεμος γεμίζει τα πανιά · Three.js' : 'The wind fills the sails · Three.js'}</div>
    </div>`;
  }

  function loadThreeJS(cb) {
    if (window.THREE) { cb(); return; }
    if (gameWrap) gameWrap.innerHTML = loaderHTML();
    const existing = document.getElementById('three-cdn');
    if (existing) {
      const poll = setInterval(() => {
        if (window.THREE) { clearInterval(poll); if (gameWrap) gameWrap.innerHTML = ''; cb(); }
      }, 40);
      return;
    }
    function tryLoad(urls, idx) {
      if (idx >= urls.length) {
        if (gameWrap) gameWrap.innerHTML = `<div class="oj-loader oj-loader-error">
          <div style="font-size:2rem;">⚠️</div>
          <div class="oj-loader-title" style="color:#e08888;">Αποτυχία φόρτωσης Three.js</div>
          <div class="oj-loader-sub" style="max-width:320px;line-height:1.6;">Απαιτείται σύνδεση στο internet.<br>Δοκίμασε αργότερα ή χρησιμοποίησε τα άλλα παιχνίδια.</div>
        </div>`;
        return;
      }
      const s = document.createElement('script');
      s.id = idx === 0 ? 'three-cdn' : `three-cdn-${idx}`;
      s.src = urls[idx];
      s.onload = () => { if (gameWrap) gameWrap.innerHTML = ''; cb(); };
      s.onerror = () => { s.remove(); tryLoad(urls, idx + 1); };
      document.head.appendChild(s);
    }
    tryLoad([
      'https://cdn.jsdelivr.net/npm/three@0.148.0/build/three.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/three.js/r148/three.min.js',
      'https://unpkg.com/three@0.148.0/build/three.min.js',
    ], 0);
  }

  // ── Procedural textures (canvas — no external assets) ─────
  function glowTexture(key, inner, mid, outer) {
    if (_texCache[key]) return _texCache[key];
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const g = c.getContext('2d');
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, inner);
    grad.addColorStop(0.45, mid);
    grad.addColorStop(1, outer);
    g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
    const tex = new THREE.CanvasTexture(c);
    _texCache[key] = tex;
    return tex;
  }

  function cloudTexture() {
    if (_texCache.cloud) return _texCache.cloud;
    const c = document.createElement('canvas'); c.width = 256; c.height = 128;
    const g = c.getContext('2d');
    for (let i = 0; i < 26; i++) {
      const x = 30 + Math.random() * 196, y = 44 + Math.random() * 44;
      const r = 14 + Math.random() * 26;
      const grad = g.createRadialGradient(x, y, 0, x, y, r);
      grad.addColorStop(0, 'rgba(255,255,255,0.10)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = grad;
      g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    _texCache.cloud = tex;
    return tex;
  }

  // Woven-linen sail with a terracotta band + sun motif (black-figure vibe)
  function sailTexture() {
    if (_texCache.sail) return _texCache.sail;
    const c = document.createElement('canvas'); c.width = 128; c.height = 192;
    const g = c.getContext('2d');
    const grad = g.createLinearGradient(0, 0, 0, 192);
    grad.addColorStop(0, '#f2e4c0');
    grad.addColorStop(0.5, '#ead8ae');
    grad.addColorStop(1, '#dcc494');
    g.fillStyle = grad; g.fillRect(0, 0, 128, 192);
    // weave noise
    g.globalAlpha = 0.05;
    for (let y = 0; y < 192; y += 3) { g.fillStyle = (y % 6) ? '#8a7040' : '#fffbe8'; g.fillRect(0, y, 128, 1); }
    g.globalAlpha = 1;
    // terracotta band
    g.fillStyle = '#a03a1c'; g.fillRect(0, 26, 128, 16);
    g.fillStyle = 'rgba(160,58,28,0.55)'; g.fillRect(0, 46, 128, 4);
    // small sun disc motif
    g.strokeStyle = '#a03a1c'; g.lineWidth = 3;
    g.beginPath(); g.arc(64, 108, 20, 0, Math.PI * 2); g.stroke();
    g.beginPath(); g.arc(64, 108, 8, 0, Math.PI * 2); g.fillStyle = '#a03a1c'; g.fill();
    for (let r = 0; r < 8; r++) {
      const a = (r / 8) * Math.PI * 2;
      g.beginPath();
      g.moveTo(64 + Math.cos(a) * 24, 108 + Math.sin(a) * 24);
      g.lineTo(64 + Math.cos(a) * 31, 108 + Math.sin(a) * 31);
      g.stroke();
    }
    const tex = new THREE.CanvasTexture(c);
    _texCache.sail = tex;
    return tex;
  }

  // ── Build Scene ────────────────────────────────────────────
  function buildGame() {
    const T = THREE;
    clock = new T.Clock();

    const canvas = document.createElement('canvas');
    canvas.id = 'odyssey-canvas';
    gameWrap.appendChild(canvas);

    renderer = new T.WebGLRenderer({ canvas, antialias: !LITE });
    renderer.setSize(gameWrap.clientWidth, gameWrap.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, LITE ? 1.5 : 2));
    renderer.shadowMap.enabled = !LITE;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setClearColor(0x050e1e);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;

    scene = new T.Scene();
    // atmospheric depth haze — a touch warmer than pure blue so distant
    // islands melt into a sea-mist horizon rather than a hard black cutoff
    scene.fog = new T.FogExp2(0x0a1b32, 0.011);

    camera = new T.PerspectiveCamera(52, gameWrap.clientWidth / gameWrap.clientHeight, 0.1, 220);
    camera.position.set(CAM_BASE.x, CAM_BASE.y, CAM_BASE.z);
    camera.lookAt(0, 0, -2);
    camLook = new T.Vector3(0, 0, -2);

    raycaster = new T.Raycaster();
    mouse = new T.Vector2();

    buildSky();
    buildStars();
    buildMoon();
    buildClouds();
    buildOcean();
    buildLighting();
    buildIslands();
    buildShip();
    buildWake();
    buildTrail();
    buildPaths();
    buildUI();

    canvas.addEventListener('click', onCanvasClick);
    window.addEventListener('resize', onResize);
    document.addEventListener('keydown', onKeyDown);

    animate();
    setTimeout(() => { showEl('oj-intro'); }, REDUCED ? 350 : 900);
  }

  // ── Sky ────────────────────────────────────────────────────
  // Cinematic Aegean dusk-into-night dome: deep indigo zenith, a warm
  // terracotta afterglow hugging the western horizon, a slowly-drifting
  // band of milky-way haze, and a cool moon-side glow. Fully procedural.
  function buildSky() {
    const T = THREE;
    const geom = new T.SphereGeometry(100, 32, 20);
    skyMat = new T.ShaderMaterial({
      side: T.BackSide,
      depthWrite: false,
      uniforms: {
        uTop:     { value: new T.Color(0x020414) }, // near-black indigo zenith
        uMiddle:  { value: new T.Color(0x0a1d3a) }, // deep Aegean blue
        uHorizon: { value: new T.Color(0x1a4570) }, // luminous sea-band blue
        uGlow:    { value: new T.Color(0xd06a34) }, // terracotta afterglow
        uMoon:    { value: new T.Color(0x3a5a8c) }, // cool moon halo
        uTime:    { value: 0 },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uTop; uniform vec3 uMiddle; uniform vec3 uHorizon;
        uniform vec3 uGlow; uniform vec3 uMoon; uniform float uTime;
        varying vec3 vWorldPos;

        // cheap hash noise for the galaxy haze
        float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
        float noise(vec2 p){
          vec2 i = floor(p), f = fract(p);
          vec2 u = f*f*(3.0-2.0*f);
          return mix(mix(hash(i), hash(i+vec2(1.,0.)), u.x),
                     mix(hash(i+vec2(0.,1.)), hash(i+vec2(1.,1.)), u.x), u.y);
        }

        void main() {
          vec3 dir = normalize(vWorldPos);
          float h = dir.y;

          // vertical gradient: zenith -> mid -> horizon
          vec3 col = h > 0.0
            ? mix(uMiddle, uTop, pow(clamp(h,0.0,1.0), 0.55))
            : mix(uMiddle, uHorizon, pow(clamp(-h,0.0,1.0), 0.7));

          // luminous rim right at the sea line — breathes very slowly
          float rim = smoothstep(0.28, 0.0, abs(h));
          col = mix(col, uHorizon, rim * (0.55 + 0.06 * sin(uTime * 0.13)));

          // warm terracotta afterglow, biased to the west (-x) & low
          float west = smoothstep(-0.15, -1.0, dir.x);
          float low  = smoothstep(0.30, -0.05, h);
          col += uGlow * west * low * 0.46;

          // cool moon halo up toward the moon (+x,+y) — tight & restrained
          vec3 moonDir = normalize(vec3(0.5, 0.7, -0.85));
          float moonGlow = pow(max(dot(dir, moonDir), 0.0), 9.0);
          col += uMoon * moonGlow * 0.38;

          // soft milky-way haze band drifting diagonally overhead
          float band = noise(dir.xz * 4.0 + dir.y * 3.0 + vec2(uTime * 0.008, 0.0));
          float band2 = noise(dir.xz * 9.0 - vec2(uTime * 0.005, uTime * 0.003));
          float bandMask = smoothstep(0.45, 1.0, band * 0.75 + band2 * 0.35) * smoothstep(0.05, 0.6, h);
          col += vec3(0.10, 0.12, 0.20) * bandMask * 0.7;

          gl_FragColor = vec4(col, 1.0);
        }
      `
    });
    scene.add(new T.Mesh(geom, skyMat));
  }

  // ── Moon ───────────────────────────────────────────────────
  function buildMoon() {
    const T = THREE;
    const moonGeo = new T.SphereGeometry(3.5, 20, 16);
    const moonMat = new T.MeshStandardMaterial({ color: 0xdde8f0, roughness: 0.85, metalness: 0.05,
      emissive: 0x99aabb, emissiveIntensity: 0.24 });
    const moonMesh = new T.Mesh(moonGeo, moonMat);
    moonMesh.position.set(38, 52, -65);
    scene.add(moonMesh);

    // Soft halo sprite (replaces the old faceted glow shells)
    const halo = new T.Sprite(new T.SpriteMaterial({
      map: glowTexture('moonGlow', 'rgba(190,214,248,0.5)', 'rgba(120,158,214,0.1)', 'rgba(96,138,200,0)'),
      blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.26,
    }));
    halo.scale.set(15, 15, 1);
    halo.position.copy(moonMesh.position);
    scene.add(halo);

    // Moon directional light (cool blue-white) — restrained so the sea
    // stays a deep night blue instead of a washed-out carpet
    const moonLight = new T.DirectionalLight(0xc8ddf8, 0.6);
    moonLight.position.copy(moonMesh.position).normalize().multiplyScalar(80);
    moonLight.castShadow = !LITE;   // shadow pass is off entirely on LITE
    moonLight.shadow.mapSize.set(1024, 1024);
    Object.assign(moonLight.shadow.camera, { near: 0.1, far: 150, left: -40, right: 40, top: 40, bottom: -40 });
    scene.add(moonLight);
  }

  // ── Stars ──────────────────────────────────────────────────
  // Shader points: per-star twinkle phase + size so the heavens feel alive
  // (the old version faded the whole field in lock-step).
  function buildStars() {
    const T = THREE;
    const count = LITE ? 720 : 1600;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const phases = new Float32Array(count);
    const sizes = new Float32Array(count);
    const starColors = [
      [1.0, 0.97, 0.95],  // warm white
      [0.85, 0.90, 1.0],  // cool blue
      [1.0, 1.0, 0.88],   // yellow
      [1.0, 0.92, 0.92],  // pinkish
    ];
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 0.65); // upper hemisphere bias
      const r     = 78 + Math.random() * 16;
      pos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = Math.abs(r * Math.cos(phi)) + 4;
      pos[i*3+2] = r * Math.sin(phi) * Math.sin(theta);
      const c = starColors[Math.floor(Math.random() * starColors.length)];
      colors[i*3] = c[0]; colors[i*3+1] = c[1]; colors[i*3+2] = c[2];
      phases[i] = Math.random() * Math.PI * 2;
      sizes[i]  = 0.6 + Math.random() * Math.random() * 1.7;
    }
    const geom = new T.BufferGeometry();
    geom.setAttribute('position', new T.BufferAttribute(pos, 3));
    geom.setAttribute('color', new T.BufferAttribute(colors, 3));
    geom.setAttribute('aPhase', new T.BufferAttribute(phases, 1));
    geom.setAttribute('aSize', new T.BufferAttribute(sizes, 1));
    const mat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      vertexColors: true,
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        attribute float aPhase; attribute float aSize;
        uniform float uTime;
        varying vec3 vColor; varying float vTw;
        void main() {
          vColor = color;
          vTw = 0.55 + 0.45 * sin(uTime * (0.5 + fract(aPhase) * 1.3) + aPhase * 6.2831);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * (240.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        varying vec3 vColor; varying float vTw;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.05, d) * vTw;
          gl_FragColor = vec4(vColor, a);
        }
      `,
    });
    starsMesh = new T.Points(geom, mat);
    scene.add(starsMesh);
  }

  // Occasional meteor: a slim additive streak arcing across the dome.
  function spawnShootingStar() {
    if (!scene || REDUCED) return;
    const T = THREE;
    const mat = new T.MeshBasicMaterial({
      map: glowTexture('streak', 'rgba(255,255,255,0.95)', 'rgba(190,215,255,0.35)', 'rgba(150,180,255,0)'),
      blending: T.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0,
      side: T.DoubleSide,
    });
    const mesh = new T.Mesh(new T.PlaneGeometry(4.2, 0.16), mat);
    const x0 = -50 + Math.random() * 90;
    const y0 = 42 + Math.random() * 20;
    const z0 = -55 - Math.random() * 15;
    mesh.position.set(x0, y0, z0);
    const vel = new T.Vector3(-(9 + Math.random() * 7), -(3.5 + Math.random() * 2.5), 0);
    mesh.rotation.z = Math.atan2(vel.y, vel.x);
    scene.add(mesh);
    shootingStars.push({ mesh, vel, life: 0, max: 1.4 + Math.random() * 0.5 });
  }

  // ── Horizon haze clouds ────────────────────────────────────
  function buildClouds() {
    const T = THREE;
    cloudSprites = [];
    const tex = cloudTexture();
    const CLOUDS = LITE ? 3 : 6;
    for (let i = 0; i < CLOUDS; i++) {
      const mat = new T.SpriteMaterial({
        map: tex, transparent: true, depthWrite: false,
        opacity: 0.20 + Math.random() * 0.10,
        color: new T.Color(0x2e4460),   // faint slate mist, not white puffs
      });
      const sp = new T.Sprite(mat);
      const ang = (i / CLOUDS) * Math.PI * 2 + Math.random() * 0.8;
      const rad = 66 + Math.random() * 14;
      sp.position.set(Math.cos(ang) * rad, 5 + Math.random() * 6, Math.sin(ang) * rad);
      sp.scale.set(24 + Math.random() * 12, 6 + Math.random() * 4, 1);
      sp.userData = { ang, rad, y: sp.position.y, speed: 0.0016 + Math.random() * 0.0022 };
      scene.add(sp);
      cloudSprites.push(sp);
    }
  }

  // ── Ocean ──────────────────────────────────────────────────
  function buildOcean() {
    const T = THREE;
    // denser grid → smoother, more filmic swells (thinned on LITE: the
    // per-frame CPU wave displacement + normal recompute scale with SEG²)
    const SEG = LITE ? 56 : 96;
    const geom = new T.PlaneGeometry(150, 150, SEG, SEG);
    geom.rotateX(-Math.PI / 2);
    oceanPositions = geom.attributes.position;

    // per-vertex color: deep abyssal ink in the distance grading to a
    // richer Aegean blue near the centre where the ship sails
    const cnt = oceanPositions.count;
    const cols = new Float32Array(cnt * 3);
    const deep    = new T.Color(0x030f1a);
    const shallow = new T.Color(0x0c3653);
    for (let i = 0; i < cnt; i++) {
      const x = oceanPositions.getX(i), z = oceanPositions.getZ(i);
      const d = Math.min(Math.sqrt(x * x + z * z) / 60, 1);
      const c = shallow.clone().lerp(deep, d * d);
      cols[i * 3] = c.r; cols[i * 3 + 1] = c.g; cols[i * 3 + 2] = c.b;
    }
    // Second pass — ground the islands in the water: a turquoise lagoon
    // shelf glows around every shore (wan violet for the Underworld), and
    // slow current-mottling keeps the open plain from reading flat.
    const lagoon = new T.Color(0x2d8a8c);
    const sandGlow = new T.Color(0x5fb3a0);
    const hadesShallow = new T.Color(0x3a2a5e);
    const current = new T.Color(0x0e3f60);
    const cTmp = new T.Color();
    for (let i = 0; i < cnt; i++) {
      const x = oceanPositions.getX(i), z = oceanPositions.getZ(i);
      cTmp.setRGB(cols[i * 3], cols[i * 3 + 1], cols[i * 3 + 2]);
      const m = Math.sin(x * 0.052 + z * 0.077) * Math.sin(x * 0.031 - z * 0.046);
      cTmp.lerp(current, 0.16 * (m * 0.5 + 0.5));
      for (let li = 0; li < ODYSSEY_LOCATIONS.length; li++) {
        const L = ODYSSEY_LOCATIONS[li];
        const dx = x - L.pos[0], dz = z - L.pos[2];
        const dd = Math.sqrt(dx * dx + dz * dz);
        const shoreR = L.baseRadius * 1.18;
        const k = 1 - Math.min(Math.max((dd - shoreR) / (L.baseRadius * 2.2), 0), 1);
        if (k > 0) {
          const isHades = L.id === 'underworld';
          cTmp.lerp(isHades ? hadesShallow : lagoon, k * k * (isHades ? 0.55 : 0.52));
          if (!isHades && dd < shoreR * 1.5) cTmp.lerp(sandGlow, 0.3 * (1 - dd / (shoreR * 1.5)));
        }
      }
      cols[i * 3] = cTmp.r; cols[i * 3 + 1] = cTmp.g; cols[i * 3 + 2] = cTmp.b;
    }
    geom.setAttribute('color', new T.BufferAttribute(cols, 3));
    oceanColorAttr = geom.attributes.color;
    oceanBaseColors = cols.slice(0);

    // Low, dark specular: Blinn-Phong's (shininess/2+1)/π normalization
    // turns a high exponent into a blinding white blob from the chart
    // camera (the r148 lobe peaks ~240× at shininess 1500). A soft wide
    // lobe gives a faint real-light sheen; the hand-drawn moonglade in
    // the injected shader below carries the actual sparkle.
    const mat = new T.MeshPhongMaterial({
      vertexColors: true,
      emissive:  new T.Color(0x03101c),
      emissiveIntensity: 0.35,
      shininess: 42,
      specular:  new T.Color(0x0c1218),
    });
    // Inject wave-crest shading + drifting moonlit glints straight into the
    // Phong shader: crests lift toward turquoise and carry sparse darting
    // sparkles, troughs stay ink-dark. World-space, so the shimmer rides the
    // CPU swell exactly (the old separate additive "moonglade" plane read as
    // a white smear from the gameplay camera and is gone).
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uTime = { value: 0 };
      sh.vertexShader = sh.vertexShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vOjW;')
        .replace('#include <begin_vertex>',
          '#include <begin_vertex>\nvOjW = (modelMatrix * vec4(transformed, 1.0)).xyz;');
      sh.fragmentShader = sh.fragmentShader
        .replace('#include <common>', '#include <common>\nvarying vec3 vOjW;\nuniform float uTime;')
        .replace('#include <output_fragment>', `
          {
            // crest lift: wave tops breathe toward Aegean turquoise
            float ojCrest = smoothstep(0.05, 0.85, vOjW.y);
            outgoingLight += vec3(0.012, 0.052, 0.070) * ojCrest;
            // trough sink: deepen the valleys for extra swell relief
            outgoingLight *= 0.82 + 0.18 * smoothstep(-0.9, 0.5, vOjW.y);
            // moonglade axis first — a glitter road laid across the
            // north-east sea toward the risen moon; computed up front so
            // the crest glints below can brighten inside its lane
            vec2 ojMD = vec2(0.42, -0.9075);
            vec2 ojRel = vOjW.xz - vec2(24.0, -10.0);
            float ojU = dot(ojRel, ojMD);
            float ojV = dot(ojRel, vec2(-ojMD.y, ojMD.x));
            float ojHw = 5.2 + max(ojU, 0.0) * 0.26;
            float ojRoad = exp(-(ojV * ojV) / (ojHw * ojHw))
                         * smoothstep(-10.0, 2.0, ojU) * smoothstep(58.0, 30.0, ojU);
            // sparse crest glints, clustered by drifting wind patches so
            // the shimmer moves in cat's-paw lanes instead of static specks
            vec2 ojGp = vOjW.xz * 2.4;
            vec2 ojCell = floor(ojGp);
            float ojH  = fract(sin(dot(ojCell, vec2(127.1, 311.7))) * 43758.5453);
            float ojH2 = fract(ojH * 61.7);
            vec2 ojF = fract(ojGp) - vec2(0.3 + 0.4 * ojH, 0.3 + 0.4 * ojH2);
            float ojDot = smoothstep(0.30, 0.03, length(ojF));
            float ojTw = fract(ojH * 9.37 + uTime * (0.22 + ojH * 0.5));
            float ojGl = step(0.90, ojH) * smoothstep(0.34, 0.02, abs(ojTw - 0.5)) * ojDot;
            float ojWind = sin(dot(vOjW.xz, vec2(0.061, 0.043)) + uTime * 0.16)
                         + sin(dot(vOjW.xz, vec2(-0.034, 0.071)) - uTime * 0.11);
            float ojPatch = smoothstep(0.15, 1.25, ojWind);
            float ojFade = smoothstep(72.0, 20.0, length(vOjW.xz));
            outgoingLight += vec3(0.24, 0.32, 0.44) * ojGl * ojCrest * ojFade * (0.42 + 0.75 * ojPatch + 1.3 * ojRoad);
            // moonglade sparkle: dense darting micro-sparks riding a soft
            // continuous sheen, widening as it runs to the horizon
            vec2 ojGp2 = vOjW.xz * 2.6;
            vec2 ojCell2 = floor(ojGp2);
            float ojHa = fract(sin(dot(ojCell2, vec2(269.5, 183.3))) * 43758.5453);
            vec2 ojF2 = fract(ojGp2) - vec2(0.25 + 0.5 * ojHa, 0.25 + 0.5 * fract(ojHa * 43.1));
            float ojTw2 = fract(ojHa * 7.31 + uTime * (0.35 + ojHa * 0.65));
            float ojGl2 = step(0.45, ojHa) * smoothstep(0.30, 0.02, abs(ojTw2 - 0.5))
                        * smoothstep(0.34, 0.05, length(ojF2));
            outgoingLight += vec3(0.85, 0.95, 1.12) * ojGl2 * ojRoad * (0.35 + 0.65 * ojCrest);
            outgoingLight += vec3(0.14, 0.175, 0.25) * ojRoad * (0.55 + 0.45 * ojCrest);
          }
          #include <output_fragment>`);
      oceanShader = sh;
    };
    oceanMesh = new T.Mesh(geom, mat);
    oceanMesh.receiveShadow = true;
    scene.add(oceanMesh);
  }

  // ── Lighting ───────────────────────────────────────────────
  function buildLighting() {
    const T = THREE;
    // Hemisphere fill: cool starlit sky above, faint warm sea-bounce below.
    // (Kept in module state — the per-island mood system tints it.)
    hemiLight = new T.HemisphereLight(0x243b66, 0x141006, 0.42);
    scene.add(hemiLight);
    // dimmer flat fill: the night grade must come from the moon and the
    // island beacons, not a wash that flattens every surface pastel
    scene.add(new T.AmbientLight(0x101f38, 0.34));

    // Low warm "afterglow" key from the western horizon — the dying sun
    // that grazes the tops of the islands with terracotta light.
    const sun = new T.DirectionalLight(0xffb066, 0.5);
    sun.position.set(-42, 10, 26);
    scene.add(sun);

    // Subtle cool rim from behind for silhouette separation
    const rim = new T.DirectionalLight(0x4a6ea0, 0.3);
    rim.position.set(14, 8, -30);
    scene.add(rim);
  }

  // ── Per-island weather / mood ──────────────────────────────
  // As the ship nears each island the world drifts toward its temper:
  // fog, hemisphere fill, water emissive and the sky afterglow all lerp.
  const MOODS = {
    underworld: { fog: 0x140f2a, hemi: 0x2c2a5e, emis: 0x0a0718, glow: 0x7a44b0 },
    circe:      { fog: 0x180f2e, hemi: 0x3c2a58, emis: 0x100a1e, glow: 0xc060a8 },
    cyclops:    { fog: 0x151020, hemi: 0x403020, emis: 0x0e0a12, glow: 0xd0622a },
    sirens:     { fog: 0x0a2233, hemi: 0x1e4450, emis: 0x04141e, glow: 0x2d9a96 },
    phaeacia:   { fog: 0x102038, hemi: 0x2e3c5e, emis: 0x061224, glow: 0xe09040 },
    ogygia:     { fog: 0x0c2130, hemi: 0x224840, emis: 0x04161a, glow: 0x3aa870 },
    default:    { fog: 0x0a1b32, hemi: 0x243b66, emis: 0x03101c, glow: 0xd06a34 },
  };
  let _moodCols = null; // hex → THREE.Color cache (built lazily post-THREE)

  function moodFor(id) {
    if (!_moodCols) {
      _moodCols = {};
      Object.keys(MOODS).forEach(k => {
        const m = MOODS[k];
        _moodCols[k] = {
          fog:  new THREE.Color(m.fog),  hemi: new THREE.Color(m.hemi),
          emis: new THREE.Color(m.emis), glow: new THREE.Color(m.glow),
        };
      });
    }
    return _moodCols[id] || _moodCols.default;
  }

  function updateMood(delta) {
    if (!scene || !scene.fog || !shipCurrentPos) return;
    // nearest island within its harbor reach sets the mood
    let moodId = 'default', best = Infinity;
    for (let i = 0; i < ODYSSEY_LOCATIONS.length; i++) {
      const L = ODYSSEY_LOCATIONS[i];
      const dx = shipCurrentPos.x - L.pos[0], dz = shipCurrentPos.z - L.pos[2];
      const d = Math.sqrt(dx * dx + dz * dz) - L.baseRadius;
      if (d < best && d < 5.5) { best = d; moodId = MOODS[L.id] ? L.id : 'default'; }
    }
    const m = moodFor(moodId);
    const k = Math.min(delta * (REDUCED ? 3.0 : 0.9), 1); // slow weather drift
    scene.fog.color.lerp(m.fog, k);
    if (hemiLight) hemiLight.color.lerp(m.hemi, k);
    if (oceanMesh) oceanMesh.material.emissive.lerp(m.emis, k);
    if (skyMat) skyMat.uniforms.uGlow.value.lerp(m.glow, k);
  }

  // ── Islands ────────────────────────────────────────────────
  function buildIslands() {
    const T = THREE;
    locationGroups = [];
    islandLights = [];
    foamMats = [];

    ODYSSEY_LOCATIONS.forEach((loc, idx) => {
      const group = new T.Group();

      // Sandy shore with slight variation (flat-shaded → faceted terrain)
      const shoreR = loc.baseRadius * 1.18;
      const shore = new T.Mesh(
        new T.CylinderGeometry(shoreR, shoreR * 1.1, 0.5, 10),
        new T.MeshPhongMaterial({ color: 0xc8a048, flatShading: true, shininess: 8 })
      );
      shore.castShadow = true; shore.receiveShadow = true;
      group.add(shore);

      // Shore rocks (small)
      for (let r = 0; r < 5; r++) {
        const angle = (r / 5) * Math.PI * 2 + idx * 0.3;
        const rk = new T.Mesh(
          new T.DodecahedronGeometry(0.12 + Math.random() * 0.1, 0),
          new T.MeshPhongMaterial({ color: 0x8a7a60 })
        );
        rk.position.set(Math.cos(angle) * (shoreR + 0.2), 0.3 + Math.random() * 0.1, Math.sin(angle) * (shoreR + 0.2));
        group.add(rk);
      }

      // Green land (slightly bumpy by using a cone)
      const land = new T.Mesh(
        new T.CylinderGeometry(loc.baseRadius * 0.9, loc.baseRadius * 1.02, 0.55, 10),
        new T.MeshPhongMaterial({ color: loc.id === 'underworld' ? 0x1a1028 : 0x2a6e2a, flatShading: true, shininess: 5 })
      );
      land.position.y = 0.48; land.castShadow = true;
      group.add(land);

      // Mountain peak — faceted matte rock, not smooth plastic
      const mtnH = loc.height;
      const mtn = new T.Mesh(
        new T.ConeGeometry(loc.baseRadius * 0.65, mtnH, 9),
        new T.MeshPhongMaterial({ color: loc.color, flatShading: true, shininess: 6 })
      );
      mtn.position.y = 0.68 + mtnH / 2; mtn.castShadow = true;
      group.add(mtn);

      // Secondary smaller peak for depth
      const mtn2 = new T.Mesh(
        new T.ConeGeometry(loc.baseRadius * 0.3, mtnH * 0.55, 7),
        new T.MeshPhongMaterial({ color: shadeColor(loc.color, 0.8), flatShading: true, shininess: 6 })
      );
      mtn2.position.set(loc.baseRadius * 0.28, 0.68 + mtnH * 0.275, loc.baseRadius * 0.18);
      group.add(mtn2);

      // Snow cap
      if (mtnH > 3.2) {
        const snow = new T.Mesh(
          new T.ConeGeometry(loc.baseRadius * 0.2, mtnH * 0.2, 7),
          new T.MeshPhongMaterial({ color: 0xeef0ff, emissive: 0x8899aa, emissiveIntensity: 0.1 })
        );
        snow.position.y = 0.68 + mtnH * 0.9;
        group.add(snow);
      }

      // Island-specific details
      buildIslandDetails(group, loc, T);

      const isComplete = completedSet.has(loc.id);

      // Glow ring
      const ringMat = new T.MeshPhongMaterial({
        color:    isComplete ? 0x44ff88 : 0xffd700,
        emissive: isComplete ? 0x22aa44 : 0xcc8800,
        emissiveIntensity: 0.7,
        transparent: true,
        opacity: 0.9,
      });
      const ring = new T.Mesh(new T.TorusGeometry(loc.baseRadius * 1.3, 0.11, 8, 40), ringMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.15;
      group.add(ring);

      // Counter-rotating outer halo ring — thin, additive, ethereal
      const ring2Mat = new T.MeshBasicMaterial({
        color: isComplete ? LAUREL_HEX : GOLD_HEX,
        transparent: true, opacity: 0.35,
        blending: T.AdditiveBlending, depthWrite: false,
      });
      const ring2 = new T.Mesh(new T.TorusGeometry(loc.baseRadius * 1.62, 0.035, 6, 48), ring2Mat);
      ring2.rotation.x = Math.PI / 2;
      ring2.position.y = 0.22;
      group.add(ring2);

      // Location beacon: a vertical pillar of light rising from the peak —
      // gold while the rhapsody awaits, laurel-green once completed.
      const pillarH = mtnH + 5.5;
      const pillarMat = new T.ShaderMaterial({
        transparent: true, depthWrite: false, blending: T.AdditiveBlending,
        side: T.DoubleSide,
        uniforms: {
          uColor: { value: new T.Color(isComplete ? LAUREL_HEX : GOLD_HEX) },
          uTime:  { value: 0 },
          uPhase: { value: idx * 1.7 },
          uFlare: { value: 0 },   // beckon/arrival flare, decays in animate()
        },
        vertexShader: `
          varying vec2 vUv;
          void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
          varying vec2 vUv; uniform vec3 uColor; uniform float uTime; uniform float uPhase; uniform float uFlare;
          void main(){
            float fadeTop = pow(1.0 - vUv.y, 1.7);
            float fadeBot = smoothstep(0.0, 0.12, vUv.y);
            float breathe = 0.74 + 0.26 * sin(uTime * 1.6 + uPhase);
            float a = fadeTop * fadeBot * (0.42 + 0.6 * uFlare) * breathe;
            gl_FragColor = vec4(uColor + vec3(0.25) * uFlare, a);
          }
        `
      });
      const pillar = new T.Mesh(
        new T.CylinderGeometry(0.55, 0.22, pillarH, 12, 1, true),
        pillarMat
      );
      pillar.position.y = 0.6 + pillarH / 2;
      group.add(pillar);

      // Rising ember motes inside the beacon
      const MOTES = 10;
      const mPos = new Float32Array(MOTES * 3);
      const mSeed = [];
      for (let m = 0; m < MOTES; m++) {
        const a = Math.random() * Math.PI * 2, rr = Math.random() * 0.4;
        mPos[m*3] = Math.cos(a) * rr;
        mPos[m*3+1] = Math.random() * pillarH;
        mPos[m*3+2] = Math.sin(a) * rr;
        mSeed.push({ speed: 0.5 + Math.random() * 0.7, a, rr });
      }
      const mGeom = new T.BufferGeometry();
      mGeom.setAttribute('position', new T.BufferAttribute(mPos, 3));
      const moteMat = new T.PointsMaterial({
        map: glowTexture('mote', 'rgba(255,255,255,0.95)', 'rgba(255,220,150,0.4)', 'rgba(255,200,120,0)'),
        color: isComplete ? LAUREL_HEX : GOLD_HEX,
        size: 0.36, sizeAttenuation: true,
        transparent: true, opacity: 0.85,
        blending: T.AdditiveBlending, depthWrite: false,
      });
      const motes = new T.Points(mGeom, moteMat);
      motes.position.y = 0.6;
      group.add(motes);

      // Lapping foam ring at the waterline
      const foamInner = shoreR * 1.06, foamOuter = shoreR * 1.85;
      const foamMat = new T.ShaderMaterial({
        transparent: true, depthWrite: false, blending: T.AdditiveBlending,
        side: T.DoubleSide,
        uniforms: {
          uTime:  { value: 0 },
          uPhase: { value: idx * 2.3 },
          uInner: { value: foamInner },
          uOuter: { value: foamOuter },
          uColor: { value: new T.Color(0xbfe8ff) },
        },
        vertexShader: `
          uniform float uInner; uniform float uOuter;
          varying float vR;
          void main(){
            vR = (length(position.xy) - uInner) / (uOuter - uInner);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
          }
        `,
        fragmentShader: `
          varying float vR; uniform float uTime; uniform float uPhase; uniform vec3 uColor;
          void main(){
            float wave = fract(vR * 2.2 - uTime * 0.30 + uPhase);
            float band = smoothstep(0.0, 0.14, wave) * smoothstep(0.42, 0.18, wave);
            float a = band * (1.0 - vR) * smoothstep(0.0, 0.12, vR) * 0.30;
            gl_FragColor = vec4(uColor, a);
          }
        `
      });
      const foam = new T.Mesh(new T.RingGeometry(foamInner, foamOuter, 40, 3), foamMat);
      foam.rotation.x = -Math.PI / 2;
      foam.position.y = 0.1;
      group.add(foam);
      foamMats.push(foamMat);

      // Point light per island (warm flicker)
      const pLight = new T.PointLight(isComplete ? 0x44ee88 : 0xffcc44, 0.6, 12);
      pLight.position.set(0, mtnH + 1.5, 0);
      group.add(pLight);

      group.position.set(loc.pos[0], 0, loc.pos[2]);
      // Object.assign (not replace) so detail hooks set inside
      // buildIslandDetails — e.g. the underworld flame — survive.
      Object.assign(group.userData, {
        locationId: loc.id, ring, ringMat, ring2, ring2Mat, pillarMat, moteMat,
        motes, moteSeed: mSeed, pillarH, pLight, isComplete, locH: mtnH,
        flare: 0,   // beckon/arrival flare strength (decays per frame)
      });
      scene.add(group);
      locationGroups.push(group);
      islandLights.push(pLight);
    });
  }

  function buildIslandDetails(group, loc, T) {
    switch (loc.id) {
      case 'ithaca':
      case 'ithaca-return': {
        // Palace columns
        const colMat = new T.MeshPhongMaterial({ color: 0xd4c8a2 });
        const capMat = new T.MeshPhongMaterial({ color: 0xc0b48e });
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 + 0.4;
          const col = new T.Mesh(new T.CylinderGeometry(0.09, 0.11, 1.3, 8), colMat);
          col.position.set(Math.cos(angle) * 0.95, 1.1, Math.sin(angle) * 0.95);
          group.add(col);
          const cap = new T.Mesh(new T.BoxGeometry(0.25, 0.12, 0.25), capMat);
          cap.position.set(Math.cos(angle) * 0.95, 1.8, Math.sin(angle) * 0.95);
          group.add(cap);
        }
        // Roof lintel
        const lintel = new T.Mesh(new T.BoxGeometry(1.9, 0.1, 0.15), capMat);
        lintel.position.set(0, 1.82, 0.95);
        group.add(lintel);
        break;
      }
      case 'circe':
      case 'ogygia': {
        // Palm trees
        for (let p = 0; p < 3; p++) {
          const angle = (p / 3) * Math.PI * 2 + (loc.id === 'circe' ? 0.8 : 0.2);
          const r = 0.75 + Math.random() * 0.4;
          addPalmTree(group, Math.cos(angle) * r, Math.sin(angle) * r, T);
        }
        break;
      }
      case 'cyclops': {
        // Big boulders around
        const bMat = new T.MeshPhongMaterial({ color: 0x7a6858 });
        for (let b = 0; b < 6; b++) {
          const angle = (b / 6) * Math.PI * 2;
          const boulder = new T.Mesh(new T.DodecahedronGeometry(0.22 + Math.random() * 0.18, 1), bMat);
          boulder.position.set(Math.cos(angle) * 1.3, 0.65, Math.sin(angle) * 1.3);
          boulder.rotation.set(Math.random(), Math.random(), Math.random());
          group.add(boulder);
        }
        // Sheep (tiny white spheres)
        const sheepMat = new T.MeshPhongMaterial({ color: 0xf0ece4 });
        for (let s = 0; s < 4; s++) {
          const sheep = new T.Mesh(new T.SphereGeometry(0.14, 6, 5), sheepMat);
          const a = (s / 4) * Math.PI * 2 + 0.5;
          sheep.position.set(Math.cos(a) * 0.65, 0.78, Math.sin(a) * 0.65);
          group.add(sheep);
        }
        break;
      }
      case 'sirens': {
        // Rocky spires
        const spMat = new T.MeshPhongMaterial({ color: 0x4a3a5c });
        for (let s = 0; s < 5; s++) {
          const angle = (s / 5) * Math.PI * 2;
          const h = 1.0 + Math.random() * 1.5;
          const spike = new T.Mesh(new T.ConeGeometry(0.1, h, 5), spMat);
          spike.position.set(Math.cos(angle) * 1.1, 0.9 + h / 2, Math.sin(angle) * 1.1);
          spike.rotation.z = (Math.random() - 0.5) * 0.3;
          group.add(spike);
        }
        break;
      }
      case 'underworld': {
        // Dark crystal spikes (more, taller)
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const h = 0.8 + Math.random() * 1.4;
          const spike = new T.Mesh(
            new T.ConeGeometry(0.12, h, 5),
            new T.MeshPhongMaterial({ color: 0x2a1050, emissive: 0x180840, emissiveIntensity: 0.6 })
          );
          spike.position.set(Math.cos(angle) * 1.1, 1.2 + h / 2, Math.sin(angle) * 1.1);
          group.add(spike);
        }
        // Purple flame particle (sphere)
        const flame = new T.Mesh(
          new T.SphereGeometry(0.35, 10, 8),
          new T.MeshBasicMaterial({ color: 0x8820cc, transparent: true, opacity: 0.7 })
        );
        flame.position.y = 3.5;
        group.add(flame);
        group.userData.flame = flame;
        break;
      }
      case 'phaeacia': {
        // Golden dome palace
        const domeMat = new T.MeshPhongMaterial({ color: 0xd4aa30, emissive: 0x664400, emissiveIntensity: 0.35 });
        const base = new T.Mesh(new T.CylinderGeometry(0.65, 0.7, 0.4, 10), domeMat);
        base.position.y = 1.0;
        group.add(base);
        const dome = new T.Mesh(new T.SphereGeometry(0.6, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2), domeMat);
        dome.position.y = 1.2;
        group.add(dome);
        break;
      }
    }
  }

  function addPalmTree(group, x, z, T) {
    const trunkMat = new T.MeshPhongMaterial({ color: 0x8b6914 });
    const leafMat  = new T.MeshPhongMaterial({ color: 0x1e7a20, side: T.DoubleSide });
    const nutMat   = new T.MeshPhongMaterial({ color: 0x5a3808 });
    const lean = (Math.random() - 0.5) * 0.25;
    const trunk = new T.Mesh(new T.CylinderGeometry(0.06, 0.1, 1.7, 6), trunkMat);
    trunk.position.set(x, 1.5, z);
    trunk.rotation.z = lean;
    group.add(trunk);
    const leanX = Math.sin(lean) * 1.7;
    const topX = x + leanX;
    for (let f = 0; f < 6; f++) {
      const fa = (f / 6) * Math.PI * 2;
      const frond = new T.Mesh(new T.PlaneGeometry(0.55, 1.1), leafMat);
      frond.position.set(topX + Math.cos(fa) * 0.35, 2.3, z + Math.sin(fa) * 0.35);
      frond.rotation.y = fa;
      frond.rotation.x = 0.38;
      group.add(frond);
    }
    for (let n = 0; n < 3; n++) {
      const na = n * 2.1;
      const nut = new T.Mesh(new T.SphereGeometry(0.1, 6, 5), nutMat);
      nut.position.set(topX + Math.cos(na) * 0.22, 2.1, z + Math.sin(na) * 0.22);
      group.add(nut);
    }
  }

  // ── Ship ───────────────────────────────────────────────────
  function buildShip() {
    const T = THREE;
    shipGroup = new T.Group();
    const brownMat = new T.MeshPhongMaterial({ color: 0x8B4513 });
    const darkMat  = new T.MeshPhongMaterial({ color: 0x5C3010 });
    const sailMat  = new T.MeshPhongMaterial({
      map: sailTexture(), side: T.DoubleSide,
      emissive: 0x40301a, emissiveIntensity: 0.3,
    });
    const goldMat  = new T.MeshPhongMaterial({ color: 0xFFD700, emissive: 0x664400, emissiveIntensity: 0.5 });

    // Hull
    const hull = new T.Mesh(new T.BoxGeometry(1.1, 0.42, 2.4), brownMat);
    hull.position.y = 0.28; hull.castShadow = true;
    shipGroup.add(hull);

    // Side planks
    [-0.6, 0.6].forEach(x => {
      const plank = new T.Mesh(new T.BoxGeometry(0.12, 0.36, 2.25), darkMat);
      plank.position.set(x, 0.32, 0);
      shipGroup.add(plank);
    });

    // Bow curve
    const bow = new T.Mesh(new T.ConeGeometry(0.12, 0.5, 6), goldMat);
    bow.rotation.x = Math.PI / 2;
    bow.position.set(0, 0.38, 1.35);
    shipGroup.add(bow);

    // Stern ornament
    const stern = new T.Mesh(new T.ConeGeometry(0.1, 0.38, 6), goldMat);
    stern.rotation.x = -Math.PI / 2.2;
    stern.position.set(0, 0.55, -1.2);
    shipGroup.add(stern);

    // Mast
    const mast = new T.Mesh(new T.CylinderGeometry(0.045, 0.045, 2.8, 8), darkMat);
    mast.position.y = 1.62; mast.castShadow = true;
    shipGroup.add(mast);

    // Crow's nest
    const nest = new T.Mesh(new T.CylinderGeometry(0.18, 0.15, 0.18, 8), darkMat);
    nest.position.y = 2.9;
    shipGroup.add(nest);

    // Cross beam
    const beam = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1.34, 6), darkMat);
    beam.rotation.z = Math.PI / 2;
    beam.position.y = 2.3;
    shipGroup.add(beam);

    // Rigging lines
    [[0.52, 2.3, 0, 0, 2.88, 0], [-0.52, 2.3, 0, 0, 2.88, 0]].forEach(pts => {
      const rGeom = new T.BufferGeometry().setFromPoints([
        new T.Vector3(pts[0], pts[1], pts[2]),
        new T.Vector3(pts[3], pts[4], pts[5])
      ]);
      shipGroup.add(new T.Line(rGeom, new T.LineBasicMaterial({ color: 0xc8b07a })));
    });

    // Sail — extra segments so it can billow in the wind each frame
    // (a touch wider + taller than the old cut so the linen reads from
    // the chart camera; billow pinning below tracks the new half-width)
    sailGeo = new T.PlaneGeometry(1.24, 1.62, 6, 8);
    sailBase = sailGeo.attributes.position.array.slice(0);
    const sail = new T.Mesh(sailGeo, sailMat);
    sail.position.set(0, 1.88, 0.05);
    sail.rotation.y = Math.PI / 2;
    shipGroup.add(sail);

    // Waving masthead pennant (terracotta)
    pennantGeo = new T.PlaneGeometry(0.55, 0.12, 6, 1);
    pennantGeo.translate(0.275, 0, 0); // pivot at mast
    pennantBase = pennantGeo.attributes.position.array.slice(0);
    const pennant = new T.Mesh(pennantGeo, new T.MeshBasicMaterial({ color: 0xc4622d, side: T.DoubleSide }));
    pennant.position.set(0, 3.05, 0);
    pennant.rotation.y = Math.PI / 2;
    shipGroup.add(pennant);

    // Lantern (glowing point)
    const lanternLight = new T.PointLight(0xffaa44, 0.8, 5);
    lanternLight.position.set(0, 3.1, 0.1);
    shipGroup.add(lanternLight);
    shipGroup.userData.lantern = lanternLight;

    // Lantern mesh + soft glow sprite
    const lanternMesh = new T.Mesh(new T.SphereGeometry(0.1, 8, 6),
      new T.MeshBasicMaterial({ color: 0xffcc44 }));
    lanternMesh.position.copy(lanternLight.position);
    shipGroup.add(lanternMesh);

    const lanternGlow = new T.Sprite(new T.SpriteMaterial({
      map: glowTexture('lantern', 'rgba(255,214,140,0.9)', 'rgba(255,180,90,0.25)', 'rgba(255,160,60,0)'),
      blending: T.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.7,
    }));
    lanternGlow.scale.set(2.1, 2.1, 1);
    lanternGlow.position.copy(lanternLight.position);
    shipGroup.add(lanternGlow);
    shipGroup.userData.lanternGlow = lanternGlow;

    // Warm pool the lantern throws on the swell around the hull — gives
    // the tiny ship real stage presence from the chart camera at night.
    const pool = new T.Mesh(
      new T.PlaneGeometry(6.0, 6.0),
      new T.MeshBasicMaterial({
        map: glowTexture('lanternpool', 'rgba(255,196,110,0.5)', 'rgba(255,160,70,0.14)', 'rgba(255,140,50,0)'),
        transparent: true, opacity: 0.32,
        blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide,
      })
    );
    pool.rotation.x = -Math.PI / 2;
    pool.position.y = 0.62;  // rides just over the crests beneath the keel
    shipGroup.add(pool);
    shipGroup.userData.lanternPool = pool;

    // Bow foam — two soft additive plumes hugging the cutwater; they
    // swell and pulse while under way (foam hints at the hull).
    const bowTex = glowTexture('bowfoam', 'rgba(238,250,255,0.9)', 'rgba(188,224,250,0.28)', 'rgba(168,214,246,0)');
    shipGroup.userData.bowFoam = [-1, 1].map(side => {
      const sp = new T.Sprite(new T.SpriteMaterial({
        map: bowTex, blending: T.AdditiveBlending, depthWrite: false,
        transparent: true, opacity: 0,
      }));
      sp.scale.set(0.6, 0.45, 1);
      sp.position.set(side * 0.5, 0.2, 1.05);
      sp.userData.side = side;
      shipGroup.add(sp);
      return sp;
    });

    // A touch more stage presence — pure scale, positions untouched
    shipGroup.scale.setScalar(1.28);

    const start = ODYSSEY_LOCATIONS[0];
    shipGroup.position.set(start.pos[0] - 2, 0.55, start.pos[2] + 2.5);
    shipCurrentPos = new THREE.Vector3(start.pos[0] - 2, 0.55, start.pos[2] + 2.5);
    shipTargetPos  = shipCurrentPos.clone();
    // photogenic anchorage: bow quartered toward the archipelago so the
    // sail catches the camera instead of sitting edge-on (heading logic
    // takes over unchanged the moment the player charts a course)
    const startHeading = -1.9;
    shipGroup.rotation.y = startHeading;
    lastShipDir = new THREE.Vector3(Math.sin(startHeading), 0, Math.cos(startHeading));

    scene.add(shipGroup);
  }

  // ── Wake Particles ─────────────────────────────────────────
  function buildWake() {
    const T = THREE;
    const foamTex = glowTexture('wake', 'rgba(230,246,255,0.85)', 'rgba(180,220,245,0.28)', 'rgba(160,210,240,0)');
    const wakeMat = new T.MeshBasicMaterial({
      map: foamTex, color: 0xd8f0fc,
      transparent: true, opacity: 0.3, side: T.DoubleSide,
      depthWrite: false,
    });
    wakeParticles = [];
    for (let i = 0; i < 10; i++) {
      const w = new T.Mesh(new T.PlaneGeometry(0.62, 0.4), wakeMat.clone());
      w.rotation.x = Math.PI / 2;
      w.userData.age = i / 10;
      w.userData.side = (i % 2 === 0) ? 1 : -1;
      w.visible = false;
      scene.add(w);
      wakeParticles.push(w);
    }
  }

  // ── Golden voyage trail ────────────────────────────────────
  // While under way the ship lays a living golden wake — a ribbon of
  // slowly-fading embers marking the water just sailed. (The charted
  // course lines still turn permanently gold only when both harbors of
  // a leg are conquered — this is the ephemeral, "she passed this way"
  // shimmer of the vision's travelled route.)
  function buildTrail() {
    const T = THREE;
    const N = 64;
    const pos = new Float32Array(N * 3);
    trailBirths = new Float32Array(N);
    for (let i = 0; i < N; i++) { pos[i * 3 + 1] = -60; trailBirths[i] = -1e3; } // parked out of sight
    const geom = new T.BufferGeometry();
    geom.setAttribute('position', new T.BufferAttribute(pos, 3));
    geom.setAttribute('aBirth', new T.BufferAttribute(trailBirths, 1));
    const mat = new T.ShaderMaterial({
      transparent: true, depthWrite: false, blending: T.AdditiveBlending,
      uniforms: {
        uNow:  { value: 0 },
        uLife: { value: 6.5 },
        uMap:  { value: glowTexture('trailGold', 'rgba(255,240,205,0.95)', 'rgba(255,204,120,0.34)', 'rgba(255,184,90,0)') },
      },
      vertexShader: `
        attribute float aBirth;
        uniform float uNow; uniform float uLife;
        varying float vA;
        void main(){
          float age = uNow - aBirth;
          float k = 1.0 - clamp(age / uLife, 0.0, 1.0);
          vA = k * sqrt(k);                            // eased ember decay
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = (8.0 + 16.0 * vA) * (40.0 / -mv.z);
          gl_Position = projectionMatrix * mv;
        }
      `,
      fragmentShader: `
        uniform sampler2D uMap;
        varying float vA;
        void main(){
          vec4 tex = texture2D(uMap, gl_PointCoord);
          gl_FragColor = vec4(vec3(1.0, 0.83, 0.47) * tex.rgb, tex.a * vA * 0.9);
        }
      `,
    });
    trailMesh = new T.Points(geom, mat);
    trailMesh.frustumCulled = false;
    scene.add(trailMesh);
    trailWrite = 0; trailTimer = 0;
  }

  // Drop one golden ember at the stern (ring buffer — old ones fade out)
  function depositTrail() {
    if (!trailMesh || !lastShipDir || !shipCurrentPos) return;
    const attr = trailMesh.geometry.attributes.position;
    attr.setXYZ(trailWrite,
      shipCurrentPos.x - lastShipDir.x * 1.6 + (Math.random() - 0.5) * 0.55,
      1.04,  // clear of the tallest CPU crest so embers never wink out
      shipCurrentPos.z - lastShipDir.z * 1.6 + (Math.random() - 0.5) * 0.55);
    trailBirths[trailWrite] = elapsed;
    attr.needsUpdate = true;
    trailMesh.geometry.attributes.aBirth.needsUpdate = true;
    trailWrite = (trailWrite + 1) % trailBirths.length;
  }

  // ── Journey Path Lines ─────────────────────────────────────
  // Marching-dash shader lines: the charted course flows island → island
  // like ink being drawn across a nautical map.
  function buildPaths() {
    const T = THREE;
    pathLegs = [];
    const order = ['ithaca','cyclops','sirens','circe','underworld','ogygia','phaeacia','ithaca-return'];

    for (let i = 0; i < order.length - 1; i++) {
      const a = ODYSSEY_LOCATIONS.find(l => l.id === order[i]);
      const b = ODYSSEY_LOCATIONS.find(l => l.id === order[i + 1]);
      if (!a || !b) continue;
      const pts = [];
      const steps = 22;
      for (let s = 0; s <= steps; s++) {
        const tt = s / steps;
        pts.push(new T.Vector3(
          a.pos[0] * (1 - tt) + b.pos[0] * tt,
          0.45 + Math.sin(tt * Math.PI) * 1.6,
          a.pos[2] * (1 - tt) + b.pos[2] * tt
        ));
      }
      const geom = new T.BufferGeometry().setFromPoints(pts);
      const mat = new T.ShaderMaterial({
        transparent: true, depthWrite: false,
        blending: T.AdditiveBlending,
        uniforms: {
          uTime:  { value: 0 },
          uColor: { value: new T.Color(0x92c0e6) },
          uAlpha: { value: 0.58 },
        },
        vertexShader: `
          attribute float lineDistance;
          varying float vLd;
          void main(){ vLd = lineDistance; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }
        `,
        fragmentShader: `
          varying float vLd; uniform float uTime; uniform vec3 uColor; uniform float uAlpha;
          void main(){
            float m = fract(vLd * 0.8 - uTime * 0.55);
            float a = smoothstep(0.0, 0.22, m) * smoothstep(0.62, 0.38, m);
            gl_FragColor = vec4(uColor, a * uAlpha);
          }
        `
      });
      const line = new T.Line(geom, mat);
      line.computeLineDistances();
      scene.add(line);
      pathLegs.push({ mat, aId: order[i], bId: order[i + 1] });
    }
    refreshPathStyles();
  }

  // Legs whose BOTH harbors are conquered turn into a golden wake — the
  // traveled route glows in gold across the chart; the rest stay as faint
  // silver soundings. Pure recolor, no logic touched.
  function refreshPathStyles() {
    for (let i = 0; i < pathLegs.length; i++) {
      const leg = pathLegs[i];
      const done = completedSet.has(leg.aId) && completedSet.has(leg.bId);
      leg.mat.uniforms.uColor.value.setHex(done ? 0xffc860 : 0x92c0e6);
      leg.mat.uniforms.uAlpha.value = done ? 1.0 : 0.58;
    }
  }

  // ── Celebration Bursts ─────────────────────────────────────
  // opts (all optional): n=count, sp0/spR=speed base/range, size, max=life,
  // grav=gravity — lets the same system fire big island bursts and small
  // harbor foam splashes.
  function spawnBurst(x, y, z, colorHex, opts) {
    if (!scene) return;
    opts = opts || {};
    const T = THREE;
    const N = opts.n != null ? (REDUCED ? Math.ceil(opts.n / 2.5) : opts.n) : (REDUCED ? 36 : 90);
    const sp0 = opts.sp0 != null ? opts.sp0 : 2.2;
    const spR = opts.spR != null ? opts.spR : 4.2;
    const pos = new Float32Array(N * 3);
    const vel = [];
    for (let i = 0; i < N; i++) {
      pos[i*3] = x; pos[i*3+1] = y; pos[i*3+2] = z;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const sp = sp0 + Math.random() * spR;
      vel.push(new T.Vector3(
        Math.sin(ph) * Math.cos(th) * sp,
        Math.abs(Math.cos(ph)) * sp * 1.1 + 1.2,
        Math.sin(ph) * Math.sin(th) * sp
      ));
    }
    const geom = new T.BufferGeometry();
    geom.setAttribute('position', new T.BufferAttribute(pos, 3));
    const mat = new T.PointsMaterial({
      map: glowTexture('burst', 'rgba(255,255,255,0.95)', 'rgba(255,235,180,0.4)', 'rgba(255,220,150,0)'),
      color: colorHex, size: opts.size != null ? opts.size : 0.9, sizeAttenuation: true,
      transparent: true, opacity: 1,
      blending: T.AdditiveBlending, depthWrite: false,
    });
    const points = new T.Points(geom, mat);
    scene.add(points);
    bursts.push({ points, vel, life: 0, max: opts.max != null ? opts.max : 1.7, grav: opts.grav != null ? opts.grav : 3.4 });
  }

  // ── Harbor-arrival ripples ─────────────────────────────────
  // Expanding additive rings on the waterline where the keel bites sand.
  function spawnRipple(x, z, colorHex, delay) {
    if (!scene) return;
    const T = THREE;
    const mat = new T.MeshBasicMaterial({
      color: colorHex, transparent: true, opacity: 0,
      blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide,
    });
    const mesh = new T.Mesh(new T.RingGeometry(0.86, 1.0, 40), mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(x, 1.05, z);
    mesh.scale.setScalar(0.6);
    scene.add(mesh);
    ripples.push({ mesh, life: -(delay || 0), max: 1.35 });
  }

  function spawnArrivalFX(loc) {
    const done = completedSet.has(loc.id);
    const hex = done ? LAUREL_HEX : GOLD_HEX;
    if (!REDUCED) {
      spawnRipple(shipCurrentPos.x, shipCurrentPos.z, hex, 0);
      spawnRipple(shipCurrentPos.x, shipCurrentPos.z, 0xbfe8ff, 0.28);
      // low, soft foam splash at the hull
      spawnBurst(shipCurrentPos.x, 0.6, shipCurrentPos.z, 0xcfeaff,
        { n: 22, sp0: 0.7, spR: 1.1, size: 0.3, max: 0.9, grav: 2.4 });
    } else {
      spawnRipple(shipCurrentPos.x, shipCurrentPos.z, hex, 0);
    }
    const g = locationGroups.find(x => x.userData.locationId === loc.id);
    if (g) g.userData.flare = 1.6;   // harbor beacon greets the ship
  }

  // ── Arrival banner (DOM) ───────────────────────────────────
  function showArrivalBanner(loc) {
    if (!gameWrap) return;
    const old = gameWrap.querySelector('.oj-arrival');
    if (old && old.parentNode) old.parentNode.removeChild(old);
    const gr = currentLang === 'gr';
    const b = el('div', 'oj-arrival');
    b.innerHTML = `<span class="oj-arrival-anchor">⚓</span> ${gr ? 'Άφιξη' : 'Arrival'} · <b>${gr ? loc.nameGr : loc.nameEn}</b> <i>ραψ. ${loc.rhapsody}</i>`;
    gameWrap.appendChild(b);
    setTimeout(() => { if (b.parentNode) b.parentNode.removeChild(b); }, 2600);
  }

  // ── Animation Loop ─────────────────────────────────────────
  function animate() {
    animFrame = requestAnimationFrame(animate);
    const delta = Math.min(clock.getDelta(), 0.1);
    elapsed += delta;
    const t = elapsed;

    // Ocean waves (layered)
    if (oceanPositions) {
      for (let i = 0; i < oceanPositions.count; i++) {
        const x = oceanPositions.getX(i);
        const z = oceanPositions.getZ(i);
        const y = Math.sin(x * 0.18 + t * 0.85) * 0.42
                + Math.sin(z * 0.24 + t * 0.60) * 0.32
                + Math.sin((x - z) * 0.14 + t * 1.15) * 0.16
                + Math.sin((x * 0.5 + z * 0.35) * 0.35 + t * 0.45) * 0.10;
        oceanPositions.setY(i, y);
      }
      oceanPositions.needsUpdate = true;
      // computeVertexNormals is the single heaviest per-frame cost; on LITE
      // recompute every other frame (the swell is slow enough that the lit
      // sheen stays convincing). Desktop keeps per-frame normals.
      if (!LITE || (normalsTick++ & 1) === 0) oceanMesh.geometry.computeVertexNormals();
    }

    // Sky / stars / sea-glints / paths / foam — shared clocks
    if (skyMat) skyMat.uniforms.uTime.value = t;
    if (starsMesh) {
      starsMesh.material.uniforms.uTime.value = t;
      if (!REDUCED) starsMesh.rotation.y = t * 0.00018;
    }
    if (oceanShader) oceanShader.uniforms.uTime.value = REDUCED ? 0 : t;
    for (let i = 0; i < pathLegs.length; i++) pathLegs[i].mat.uniforms.uTime.value = REDUCED ? 0 : t;
    for (let i = 0; i < foamMats.length; i++) foamMats[i].uniforms.uTime.value = t;
    if (trailMesh) trailMesh.material.uniforms.uNow.value = t;

    // Weather drifts toward the temper of the nearest island
    updateMood(delta);

    // Horizon haze drift
    if (!REDUCED) {
      for (let i = 0; i < cloudSprites.length; i++) {
        const sp = cloudSprites[i];
        sp.userData.ang += sp.userData.speed * delta;
        sp.position.set(
          Math.cos(sp.userData.ang) * sp.userData.rad,
          sp.userData.y + Math.sin(t * 0.1 + i) * 0.6,
          Math.sin(sp.userData.ang) * sp.userData.rad
        );
      }
    }

    // Shooting stars
    shootTimer -= delta;
    if (shootTimer <= 0) {
      spawnShootingStar();
      shootTimer = 6 + Math.random() * 8;
    }
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const st = shootingStars[i];
      st.life += delta;
      const f = st.life / st.max;
      if (f >= 1) {
        scene.remove(st.mesh); st.mesh.geometry.dispose(); st.mesh.material.dispose();
        shootingStars.splice(i, 1);
        continue;
      }
      st.mesh.position.addScaledVector(st.vel, delta);
      st.mesh.material.opacity = Math.sin(f * Math.PI) * 0.85;
    }

    // Celebration bursts
    for (let i = bursts.length - 1; i >= 0; i--) {
      const b = bursts[i];
      b.life += delta;
      const f = b.life / b.max;
      if (f >= 1) {
        scene.remove(b.points); b.points.geometry.dispose(); b.points.material.dispose();
        bursts.splice(i, 1);
        continue;
      }
      const attr = b.points.geometry.attributes.position;
      for (let p = 0; p < b.vel.length; p++) {
        b.vel[p].y -= (b.grav || 3.4) * delta;
        attr.setXYZ(p,
          attr.getX(p) + b.vel[p].x * delta,
          attr.getY(p) + b.vel[p].y * delta,
          attr.getZ(p) + b.vel[p].z * delta);
      }
      attr.needsUpdate = true;
      b.points.material.opacity = 1 - f * f;
    }

    // Harbor-arrival ripples: ease outward, fade like a settling wake
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.life += delta;
      if (r.life < 0) { r.mesh.material.opacity = 0; continue; }
      const f = r.life / r.max;
      if (f >= 1) {
        scene.remove(r.mesh); r.mesh.geometry.dispose(); r.mesh.material.dispose();
        ripples.splice(i, 1);
        continue;
      }
      const e = 1 - Math.pow(1 - f, 2.4);          // ease-out expansion
      r.mesh.scale.setScalar(0.6 + e * 3.1);
      r.mesh.material.opacity = 0.55 * (1 - f) * (1 - f);
    }

    animateShip(delta, t);
    animateWake(t);
    animateIslandLights(t);
    animateCamera(delta, t);

    // Ring / beacon animation
    locationGroups.forEach((g, i) => {
      // beckon/arrival flare — spikes on selection & landfall, then decays
      if (g.userData.flare > 0) {
        g.userData.flare = Math.max(0, g.userData.flare - delta * 0.75);
      }
      const flare = Math.min(g.userData.flare || 0, 1);
      const flarePulse = flare * (REDUCED ? 0.5 : (0.72 + 0.28 * Math.sin(t * 7.5)));
      const ring = g.userData.ring;
      if (ring) {
        ring.rotation.z = t * 0.5 + i * 0.8;
        const sc = 1 + Math.sin(t * 2.0 + i * 0.9) * 0.05 + flare * 0.07;
        ring.scale.set(sc, sc, 1);
      }
      if (g.userData.ring2) {
        g.userData.ring2.rotation.z = -t * 0.3 + i;
        const sc2r = 1 + flare * 0.16;
        g.userData.ring2.scale.set(sc2r, sc2r, 1);
        g.userData.ring2Mat.opacity = 0.35 + flarePulse * 0.4;
      }
      if (g.userData.pillarMat) {
        g.userData.pillarMat.uniforms.uTime.value = t;
        g.userData.pillarMat.uniforms.uFlare.value = flarePulse;
      }
      if (g.userData.pLight) g.userData.pLight.intensity += flarePulse * 0.9;
      // Rising beacon motes
      const motes = g.userData.motes;
      if (motes && !REDUCED) {
        const attr = motes.geometry.attributes.position;
        const H = g.userData.pillarH;
        for (let m = 0; m < attr.count; m++) {
          let y = attr.getY(m) + g.userData.moteSeed[m].speed * delta;
          if (y > H) y -= H;
          attr.setY(m, y);
        }
        attr.needsUpdate = true;
      }
      // Underworld flame pulse
      if (g.userData.flame) {
        const sc2 = 0.85 + Math.sin(t * 3.5) * 0.15;
        g.userData.flame.scale.setScalar(sc2);
        g.userData.flame.material.opacity = 0.6 + Math.sin(t * 2.8) * 0.15;
      }
    });

    renderer && renderer.render(scene, camera);
    updateLabels();
  }

  // Opening sweep + gentle idle drift; eases toward the ship while sailing.
  function animateCamera(delta, t) {
    if (!camera) return;
    let px = CAM_BASE.x, py = CAM_BASE.y, pz = CAM_BASE.z;

    if (!REDUCED) {
      // Opening shot: hold low over the swell — stars, moonglow and island
      // silhouettes on the horizon — while the intro card is up, then rise
      // into the chart view once the player sets sail.
      if (camIntroT < 2.6) {
        if (introDone) camIntroT += delta;
        const p = Math.min(camIntroT / 2.6, 1);
        const e = 1 - Math.pow(1 - p, 3);
        px = -14 * (1 - e) + px * e;
        py = (5.5 + Math.sin(t * 0.5) * 0.4) * (1 - e) + py * e;
        pz =  44 * (1 - e) + pz * e;
      } else {
        // idle drift — barely-there handheld sway
        px += Math.sin(t * 0.07) * 0.9;
        py += Math.sin(t * 0.11) * 0.35;
        pz += Math.cos(t * 0.05) * 0.6;
      }
    }

    camera.position.set(px, py, pz);

    // look target: rest on the archipelago centre, lean toward the ship en route
    const want = { x: 0, y: 0, z: -2 };
    if (!REDUCED && camIntroT < 2.6) {
      // during the low opening shot, lift the gaze toward the horizon
      const e2 = 1 - Math.pow(1 - Math.min(camIntroT / 2.6, 1), 3);
      want.y = 2.6 * (1 - e2);
      want.z = -2 - 6 * (1 - e2);
    }
    if (shipMoving && shipCurrentPos) {
      want.x = shipCurrentPos.x * 0.42;
      want.z = shipCurrentPos.z * 0.42 - 1;
    }
    const k = REDUCED ? 1 : Math.min(delta * 1.6, 1);
    camLook.x += (want.x - camLook.x) * k;
    camLook.y += (want.y - camLook.y) * k;
    camLook.z += (want.z - camLook.z) * k;
    camera.lookAt(camLook);
  }

  function animateIslandLights(t) {
    locationGroups.forEach((g, i) => {
      if (g.userData.pLight) {
        g.userData.pLight.intensity = 0.55 + Math.sin(t * 1.8 + i * 0.7) * 0.14;
      }
    });
    // Ship lantern flicker (light + glow sprite together)
    if (shipGroup && shipGroup.userData.lantern) {
      const f = 0.7 + Math.sin(elapsed * 4.2) * 0.15 + Math.sin(elapsed * 9.7) * 0.05;
      shipGroup.userData.lantern.intensity = f;
      if (shipGroup.userData.lanternGlow) shipGroup.userData.lanternGlow.material.opacity = 0.45 + f * 0.3;
      if (shipGroup.userData.lanternPool) shipGroup.userData.lanternPool.material.opacity = 0.24 + f * 0.15;
    }
  }

  function animateShip(delta, t) {
    if (!shipGroup || !shipCurrentPos || !shipTargetPos) return;
    const dist = shipCurrentPos.distanceTo(shipTargetPos);
    if (dist > 0.08) {
      shipMoving = true;
      const speed = Math.min(dist * 1.9, 9) * delta;
      const dir = new THREE.Vector3().subVectors(shipTargetPos, shipCurrentPos).normalize();
      lastShipDir = dir.clone();
      shipCurrentPos.addScaledVector(dir, speed);
      shipGroup.position.copy(shipCurrentPos);
      const angle = Math.atan2(dir.x, dir.z);
      shipGroup.rotation.y += (angle - shipGroup.rotation.y) * 0.1;
      shipGroup.position.y = 0.55 + Math.sin(t * 3.2) * 0.09;
      // heel into the course + a live seaway roll while under way
      shipGroup.rotation.z = -dir.x * 0.09 + Math.sin(t * 2.6) * 0.022;
      shipGroup.rotation.x =  dir.z * 0.04 + Math.sin(t * 3.4) * 0.014;
      // lay golden embers astern — the living wake of the voyage
      if (!REDUCED) {
        trailTimer -= delta;
        if (trailTimer <= 0) { depositTrail(); trailTimer = 0.11; }
      }
    } else {
      if (shipMoving) { shipMoving = false; onShipArrived(); }
      shipGroup.position.y = 0.55 + Math.sin(t * 1.4) * 0.07 + Math.sin(t * 2.2) * 0.03;
      shipGroup.rotation.z = Math.sin(t * 0.9) * 0.025;
      shipGroup.rotation.x = Math.sin(t * 1.5) * 0.018;
    }

    // Sail billow — fuller under way, breathing at anchor
    if (sailGeo && sailBase) {
      const attr = sailGeo.attributes.position;
      const full = shipMoving ? 1 : 0.55;
      for (let i = 0; i < attr.count; i++) {
        const bx = sailBase[i * 3], by = sailBase[i * 3 + 1];
        const edge = 1 - Math.min(Math.abs(bx) / 0.62, 1);          // pinned at yard ends
        const belly = Math.sin((by / 1.62 + 0.5) * Math.PI);         // pinned top & foot
        attr.setZ(i, (0.17 * full + Math.sin(t * 1.6 + by * 2.2) * 0.05) * edge * belly);
      }
      attr.needsUpdate = true;
      sailGeo.computeVertexNormals();
    }
    // Pennant wave
    if (pennantGeo && pennantBase) {
      const attr = pennantGeo.attributes.position;
      for (let i = 0; i < attr.count; i++) {
        const bx = pennantBase[i * 3];
        attr.setZ(i, Math.sin(t * 7 - bx * 9) * 0.06 * (bx / 0.55));
      }
      attr.needsUpdate = true;
    }
    // Bow foam breathes with the way of the ship — plumes bloom under
    // sail, die back to a faint lap at anchor
    const bf = shipGroup.userData.bowFoam;
    if (bf) {
      for (let i = 0; i < bf.length; i++) {
        const sp = bf[i];
        const target = shipMoving ? (REDUCED ? 0.3 : 0.5) : 0.08;
        sp.material.opacity += (target - sp.material.opacity) * Math.min(delta * 5, 1);
        const pulse = (shipMoving && !REDUCED) ? 1 + Math.sin(t * 10 + i * 2.4) * 0.22 : 1;
        sp.scale.set(0.6 * pulse, 0.45 * pulse, 1);
      }
    }
  }

  function animateWake(t) {
    if (!lastShipDir || wakeParticles.length === 0) return;
    const speed = shipMoving ? 0.5 : 0.15;
    wakeParticles.forEach((w, i) => {
      w.userData.age = (w.userData.age + 0.016 * speed) % 1.0;
      const age = w.userData.age;
      const offset = age * 4.8;
      const spread = age * 1.1;
      w.visible = shipMoving || age < 0.4;
      w.position.copy(shipCurrentPos);
      w.position.x -= lastShipDir.x * offset - lastShipDir.z * spread * w.userData.side * 0.4;
      w.position.z -= lastShipDir.z * offset + lastShipDir.x * spread * w.userData.side * 0.4;
      // ride ABOVE the tallest CPU crest (~1.0) — at the old 0.28 the
      // swell depth-clipped the foam and the wake never showed on screen
      w.position.y = 1.06 + Math.sin(t * 2.5 + i) * 0.04;
      w.material.opacity = (1 - age) * (shipMoving ? 0.7 : 0.26);
      const sc = 0.55 + age * 3.1;
      w.scale.set(sc, sc, 1);
    });
  }

  function onShipArrived() {
    if (selectedLoc) {
      // landfall: harbor ripples + hull foam + greeting beacon + banner,
      // then the location card exactly as before
      spawnArrivalFX(selectedLoc);
      showArrivalBanner(selectedLoc);
      showLocPanel(selectedLoc);
    }
  }

  // ── Label Projection ───────────────────────────────────────
  function updateLabels() {
    if (!renderer || !camera) return;
    const w = gameWrap.clientWidth, h = gameWrap.clientHeight;
    ODYSSEY_LOCATIONS.forEach(loc => {
      const el = document.getElementById('oj-label-' + loc.id);
      if (!el) return;
      const p3 = new THREE.Vector3(loc.pos[0], loc.height + 2.4, loc.pos[2]);
      p3.project(camera);
      if (p3.z < 1) {
        el.style.display = 'flex';
        el.style.left = ((p3.x * 0.5 + 0.5) * w) + 'px';
        el.style.top  = ((-p3.y * 0.5 + 0.5) * h) + 'px';
      } else {
        el.style.display = 'none';
      }
    });
  }

  // ── UI Builder ─────────────────────────────────────────────
  function buildUI() {
    const gr = currentLang === 'gr';

    // Cinematic vignette framing (pure CSS, pointer-events:none)
    gameWrap.appendChild(el('div', 'oj-vignette'));

    // HUD
    const hud = el('div', 'oj-hud');
    hud.innerHTML = `
      <div id="oj-hud-title">
        <span class="oj-hud-mark">⚓</span>
        <span class="oj-hud-text">
          <span class="oj-hud-name">${gr ? 'Οδύσσεια 3D' : 'Odyssey 3D'}</span>
          <span class="oj-hud-sub">${gr ? 'Η Περιπλάνηση' : 'The Wandering'}</span>
        </span>
      </div>
      <div id="oj-progress">
        <div class="oj-pips">${ODYSSEY_LOCATIONS.map(l =>
          `<span class="oj-pip${completedSet.has(l.id) ? ' done' : ''}" id="oj-pip-${l.id}" title="${gr ? l.nameGr : l.nameEn}"></span>`
        ).join('')}</div>
        <div id="oj-progress-text">${gr ? 'Πρόοδος' : 'Progress'} <span id="oj-done">0</span>/${ODYSSEY_LOCATIONS.length}</div>
        <div id="oj-progress-bar"><div id="oj-progress-fill"></div></div>
      </div>`;
    gameWrap.appendChild(hud);

    // Island labels
    const labelsDiv = el('div', '');
    labelsDiv.id = 'oj-labels';
    ODYSSEY_LOCATIONS.forEach(loc => {
      const isComplete = completedSet.has(loc.id);
      const lbl = el('div', 'oj-island-label' + (isComplete ? ' complete' : ''));
      lbl.id = 'oj-label-' + loc.id;
      lbl.innerHTML = `
        <div class="oj-label-icon">${loc.icon}</div>
        <div class="oj-label-bubble">
          <div class="oj-label-name">${gr ? loc.nameGr : loc.nameEn}</div>
          <div class="oj-label-rhap">ραψ. ${loc.rhapsody}</div>
          <div class="oj-label-check">✓ ${gr ? 'Ολοκλ.' : 'Done'}</div>
        </div>`;
      lbl.addEventListener('click', () => navigateTo(loc));
      labelsDiv.appendChild(lbl);
    });
    gameWrap.appendChild(labelsDiv);

    // Instructions (auto-fades via CSS)
    const instr = el('div', 'oj-instructions');
    instr.id = 'oj-instructions';
    instr.textContent = gr
      ? '🖱️ Κλίκ σε νησί ή ετικέτα για πλοήγηση'
      : '🖱️ Click an island or label to navigate';
    gameWrap.appendChild(instr);

    // Intro panel
    const intro = el('div', 'oj-panel');
    intro.id = 'oj-intro';
    intro.style.display = 'none';
    intro.innerHTML = `
      <div class="oj-panel-content oj-intro-card">
        <div class="oj-intro-kicker oj-stagger" style="--d:0ms">${gr ? 'ΟΜΗΡΟΥ ΟΔΥΣΣΕΙΑ' : "HOMER'S ODYSSEY"}</div>
        <h2 class="oj-stagger" style="--d:90ms">${gr ? 'Η Περιπλάνηση του Οδυσσέα' : "Odysseus's Journey"}</h2>
        <div class="oj-quote oj-stagger" style="--d:180ms">«Ἄνδρα μοι ἔννεπε, Μοῦσα, πολύτροπον…»</div>
        <div class="oj-divider oj-stagger" style="--d:240ms"><span></span><i>❖</i><span></span></div>
        <p class="oj-stagger" style="--d:300ms">${gr
          ? 'Ταξίδεψε στη Μεσόγειο, εξερεύνησε τα νησιά και απάντησε ερωτήσεις για κάθε ραψωδία.'
          : 'Sail the Mediterranean, explore the islands and answer questions for each rhapsody.'}</p>
        <p class="oj-subtitle oj-stagger" style="--d:380ms">${gr ? `${ODYSSEY_LOCATIONS.length} νησιά · Ακολούθησε τη διαδρομή` : `${ODYSSEY_LOCATIONS.length} islands · Follow the journey`}</p>
        <button class="oj-stagger" style="--d:460ms" onclick="ojDismissIntro()">
          ${gr ? '⚓ Σάλπαρε!' : '⚓ Set Sail!'}
        </button>
      </div>`;
    gameWrap.appendChild(intro);

    // Location panel
    const locPanel = el('div', '');
    locPanel.id = 'oj-loc-panel';
    locPanel.style.display = 'none';
    gameWrap.appendChild(locPanel);

    // Quiz panel
    const quizPanel = el('div', '');
    quizPanel.id = 'oj-quiz-panel';
    quizPanel.style.display = 'none';
    gameWrap.appendChild(quizPanel);

    // Victory panel
    const victoryPanel = el('div', 'oj-panel');
    victoryPanel.id = 'oj-victory-panel';
    victoryPanel.style.display = 'none';
    gameWrap.appendChild(victoryPanel);

    updateProgressUI();
  }

  // ── Canvas Click ───────────────────────────────────────────
  function onCanvasClick(e) {
    const rect = gameWrap.getBoundingClientRect();
    mouse.x =  ((e.clientX - rect.left) / gameWrap.clientWidth)  * 2 - 1;
    mouse.y = -((e.clientY - rect.top)  / gameWrap.clientHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);
    const meshes = [];
    locationGroups.forEach(g => g.traverse(c => { if (c.isMesh) meshes.push(c); }));
    const hits = raycaster.intersectObjects(meshes);
    if (!hits.length) return;
    let obj = hits[0].object;
    while (obj && !obj.userData.locationId) obj = obj.parent;
    if (obj && obj.userData.locationId) {
      const loc = ODYSSEY_LOCATIONS.find(l => l.id === obj.userData.locationId);
      if (loc) navigateTo(loc);
    }
  }

  // ── Navigation ─────────────────────────────────────────────
  function navigateTo(loc) {
    if (shipMoving) return;
    selectedLoc = loc;
    hideEl('oj-loc-panel');
    hideEl('oj-quiz-panel');
    // the chosen island beckons — its beacon flares up as the course is set
    const g = locationGroups.find(x => x.userData.locationId === loc.id);
    if (g) g.userData.flare = 1.4;
    const dx = shipCurrentPos.x - loc.pos[0];
    const dz = shipCurrentPos.z - loc.pos[2];
    const len = Math.sqrt(dx * dx + dz * dz) || 1;
    const nx = dx / len, nz = dz / len;
    shipTargetPos = new THREE.Vector3(
      loc.pos[0] + nx * (loc.baseRadius + 1.5), 0.55,
      loc.pos[2] + nz * (loc.baseRadius + 1.5)
    );
  }

  // ── Location Panel ─────────────────────────────────────────
  function showLocPanel(loc) {
    const panel = document.getElementById('oj-loc-panel');
    if (!panel) return;
    const gr = currentLang === 'gr';
    const isComplete = completedSet.has(loc.id);
    const name = gr ? loc.nameGr : loc.nameEn;
    const desc = gr ? loc.descGr  : loc.descEn;

    panel.innerHTML = `
      <div class="oj-panel-content oj-loc-card">
        <button class="oj-close-btn" onclick="ojCloseLocPanel()" aria-label="${gr ? 'Κλείσιμο' : 'Close'}">✕</button>
        <div class="oj-loc-left">
          <span class="oj-loc-medallion"><span class="oj-loc-icon">${loc.icon}</span></span>
          <div class="oj-loc-rhap">ραψ. ${loc.rhapsody}</div>
        </div>
        <div class="oj-loc-right">
          <h3>${name}</h3>
          <p>${desc}</p>
          <div class="oj-loc-actions">
            ${isComplete ? `<div class="oj-complete-badge">✓ ${gr ? 'Ολοκληρώθηκε' : 'Completed'}</div>` : ''}
            <button onclick="ojStartQuiz('${loc.id}')" class="oj-quiz-start-btn">
              ${isComplete
                ? (gr ? '🔄 Παίξε ξανά' : '🔄 Replay')
                : (gr ? '📜 Ξεκίνα Quiz' : '📜 Start Quiz')}
            </button>
          </div>
        </div>
      </div>`;
    panel.style.display = 'flex';
  }

  // ── Quiz ───────────────────────────────────────────────────
  function startQuiz(locationId) {
    const loc = ODYSSEY_LOCATIONS.find(l => l.id === locationId);
    if (!loc) return;
    hideEl('oj-loc-panel');
    quizState = {
      locationId, loc,
      questions: shuffle([...loc.questions]),
      current: 0, correct: 0, lives: 3, shuffledCorrect: -1
    };
    renderQuestion();
  }

  function heartsHTML(lives, breaking) {
    let out = '';
    for (let i = 0; i < 3; i++) {
      const lost = i >= lives;
      const brk = breaking === i;
      out += `<span class="oj-heart${lost ? ' lost' : ''}${brk ? ' breaking' : ''}">${lost ? '🖤' : '❤️'}</span>`;
    }
    return out;
  }

  function renderQuestion() {
    const s = quizState;
    if (!s) return;
    if (s.current >= s.questions.length) { endQuiz(true); return; }

    const q = s.questions[s.current];
    const gr = currentLang === 'gr';
    const rawAnswers = gr ? q.answersGr : q.answersEn;
    const order = [0, 1, 2, 3];
    shuffle(order);
    const displayAnswers = order.map(i => rawAnswers[i]);
    s.shuffledCorrect = order.indexOf(q.correctIndex);

    const loc     = s.loc;
    const locName = gr ? loc.nameGr : loc.nameEn;
    const letters = ['Α', 'Β', 'Γ', 'Δ'];

    quizPhase = 'question';
    const panel = document.getElementById('oj-quiz-panel');
    panel.innerHTML = `
      <div class="oj-quiz-content">
        <div class="oj-quiz-header">
          <div class="oj-quiz-loc">${loc.icon} ${locName}</div>
          <div class="oj-quiz-lives">${heartsHTML(s.lives, -1)}</div>
          <div class="oj-quiz-progress">${s.current + 1}/${s.questions.length}</div>
        </div>
        <div class="oj-quiz-question">${gr ? q.gr : q.en}</div>
        <div class="oj-quiz-answers">
          ${displayAnswers.map((ans, i) =>
            `<button class="oj-answer-btn" style="--d:${80 + i * 70}ms" onclick="ojSelectAnswer(${i})">
              <span class="oj-answer-letter">${letters[i]}</span>
              <span class="oj-answer-text">${ans}</span>
            </button>`
          ).join('')}
        </div>
      </div>`;
    panel.style.display = 'flex';
  }

  function selectAnswer(index) {
    if (!quizState) return;
    const s = quizState;
    const correct = index === s.shuffledCorrect;
    const btns = document.querySelectorAll('.oj-answer-btn');
    btns.forEach(b => b.disabled = true);
    if (btns[s.shuffledCorrect]) btns[s.shuffledCorrect].classList.add('correct');
    if (!correct && btns[index]) btns[index].classList.add('wrong');

    const card = document.querySelector('.oj-quiz-content');
    if (correct) {
      s.correct++;
      if (card) card.classList.add('oj-card-glow');
    } else {
      s.lives--;
      if (card) card.classList.add('oj-card-shake');
      // heart-break feedback: the heart being lost pops before going dark
      const livesEl = document.querySelector('.oj-quiz-lives');
      if (livesEl) livesEl.innerHTML = heartsHTML(s.lives + 1, s.lives) ;
      setTimeout(() => {
        const le = document.querySelector('.oj-quiz-lives');
        if (le) le.innerHTML = heartsHTML(s.lives, -1);
      }, 620);
      if (s.lives <= 0) { setTimeout(() => endQuiz(false), 1300); return; }
    }
    s.current++;
    setTimeout(renderQuestion, 1300);
  }

  function endQuiz(success) {
    hideEl('oj-quiz-panel');
    const s = quizState;
    const gr = currentLang === 'gr';
    const loc = s.loc;

    if(typeof awardGameRewards==='function' && s.correct > 0){ awardGameRewards('odyssey-journey', { score: s.correct, perfect: success && s.lives === 3 }); }

    if (success) {
      const wasAlreadyDone = completedSet.has(s.locationId);
      completedSet.add(s.locationId);
      try { localStorage.setItem('oj-completed', JSON.stringify([...completedSet])); } catch (e) {}

      if (!wasAlreadyDone) {
        // Recolor the whole beacon (ring, halo, pillar, motes, light) to laurel
        const group = locationGroups.find(g => g.userData.locationId === s.locationId);
        if (group) {
          group.userData.ringMat.color.setHex(0x44ff88);
          group.userData.ringMat.emissive.setHex(0x22aa44);
          if (group.userData.ring2Mat)  group.userData.ring2Mat.color.setHex(LAUREL_HEX);
          if (group.userData.pillarMat) group.userData.pillarMat.uniforms.uColor.value.setHex(LAUREL_HEX);
          if (group.userData.moteMat)   group.userData.moteMat.color.setHex(LAUREL_HEX);
          if (group.userData.pLight) group.userData.pLight.color.setHex(0x44ee88);
        }
        // Update label + queue the 3D celebration burst for when the map returns
        const lbl = document.getElementById('oj-label-' + s.locationId);
        if (lbl) lbl.classList.add('complete');
        pendingBurstLocId = s.locationId;
        updateProgressUI();
        refreshPathStyles();   // conquered legs turn to a golden wake
      }

      if (completedSet.size >= ODYSSEY_LOCATIONS.length) {
        setTimeout(showVictory, 600);
        return;
      }
    }

    // Result screen
    quizPhase = 'result';
    const panel = document.getElementById('oj-quiz-panel');
    const locName = gr ? loc.nameGr : loc.nameEn;
    const total = s.questions.length;
    const dots = Array.from({ length: total }, (_, i) =>
      `<span class="oj-score-dot${i < s.correct ? ' hit' : ''}" style="--d:${300 + i * 160}ms"></span>`
    ).join('');
    panel.innerHTML = `
      <div class="oj-quiz-content oj-result ${success ? 'oj-result-success' : 'oj-result-fail'}">
        <div class="oj-result-icon">${success ? '🏆' : '💔'}</div>
        <h2>${success ? (gr ? 'Εξαιρετικά!' : 'Excellent!') : (gr ? 'Προσπάθησε ξανά!' : 'Try again!')}</h2>
        <div class="oj-score-row">${dots}</div>
        <p>${success
          ? (gr ? `Ολοκλήρωσες ${locName} — ${s.correct}/${total} σωστές!` : `Completed ${locName} — ${s.correct}/${total} correct!`)
          : (gr ? 'Έχασες όλες τις ζωές σου.' : 'You lost all your lives.')}</p>
        <div class="oj-result-buttons">
          <button onclick="ojStartQuiz('${s.locationId}')">${gr ? '🔄 Ξανά' : '🔄 Retry'}</button>
          <button class="oj-map-btn" onclick="ojCloseQuizPanel()">${gr ? '🗺️ Χάρτης' : '🗺️ Map'}</button>
        </div>
      </div>`;
    panel.style.display = 'flex';
  }

  // ── Victory ────────────────────────────────────────────────
  function showVictory() {
    const gr = currentLang === 'gr';
    const panel = document.getElementById('oj-victory-panel');
    // gold / laurel / aegean confetti (skipped for reduced motion)
    let confetti = '';
    if (!REDUCED) {
      const cols = ['#c9a44a', '#59e89c', '#6ab4e8', '#c4622d', '#faf5ed'];
      for (let i = 0; i < 26; i++) {
        confetti += `<i class="oj-confetti" style="left:${(Math.random() * 100).toFixed(1)}%;background:${cols[i % cols.length]};animation-delay:${(Math.random() * 2.4).toFixed(2)}s;animation-duration:${(2.6 + Math.random() * 2.4).toFixed(2)}s;"></i>`;
      }
    }
    panel.innerHTML = `
      <div class="oj-confetti-layer">${confetti}</div>
      <div class="oj-panel-content oj-victory-card">
        <div class="oj-victory-halo"></div>
        <div class="oj-panel-icon oj-stagger" style="--d:0ms;font-size:64px;">🏛️</div>
        <h2 class="oj-stagger" style="--d:120ms">${gr ? 'Η Οδύσσεια Ολοκληρώθηκε!' : 'The Odyssey is Complete!'}</h2>
        <p class="oj-stagger" style="--d:220ms">${gr
          ? 'Εξερεύνησες κάθε ραψωδία και ο Οδυσσέας επέστρεψε στην Ιθάκη!'
          : 'You explored every rhapsody and Odysseus returned to Ithaca!'}</p>
        <div class="oj-stars"><span style="--d:.30s">⭐</span><span style="--d:.48s">⭐</span><span style="--d:.66s">⭐</span></div>
        <p class="oj-victory-epigram">${gr ? 'Ἄνδρα πολύτροπον…' : 'Homer would be proud.'}</p>
        <div class="oj-result-buttons oj-stagger" style="--d:520ms">
          <button onclick="ojResetJourney()">${gr ? '🔄 Νέο ταξίδι' : '🔄 New Journey'}</button>
          <button class="oj-map-btn" onclick="ojCloseVictory()">${gr ? '🗺️ Χάρτης' : '🗺️ Map'}</button>
        </div>
      </div>`;
    panel.style.display = 'flex';
  }

  function resetJourney() {
    completedSet.clear();
    try { localStorage.removeItem('oj-completed'); } catch (e) {}
    updateProgressUI();
    locationGroups.forEach(g => {
      g.userData.ringMat.color.setHex(0xffd700);
      g.userData.ringMat.emissive.setHex(0xcc8800);
      if (g.userData.ring2Mat)  g.userData.ring2Mat.color.setHex(GOLD_HEX);
      if (g.userData.pillarMat) g.userData.pillarMat.uniforms.uColor.value.setHex(GOLD_HEX);
      if (g.userData.moteMat)   g.userData.moteMat.color.setHex(GOLD_HEX);
      if (g.userData.pLight) g.userData.pLight.color.setHex(0xffcc44);
      const lbl = document.getElementById('oj-label-' + g.userData.locationId);
      if (lbl) lbl.classList.remove('complete');
    });
    refreshPathStyles();   // the chart's golden wake resets with the journey
    hideEl('oj-victory-panel');
  }

  // ── Progress UI ────────────────────────────────────────────
  function updateProgressUI() {
    const doneEl = document.getElementById('oj-done');
    const fillEl = document.getElementById('oj-progress-fill');
    if (doneEl) doneEl.textContent = completedSet.size;
    if (fillEl) fillEl.style.width = (completedSet.size / ODYSSEY_LOCATIONS.length * 100) + '%';
    ODYSSEY_LOCATIONS.forEach(loc => {
      const pip = document.getElementById('oj-pip-' + loc.id);
      if (pip) pip.classList.toggle('done', completedSet.has(loc.id));
    });
  }

  // ── Resize ─────────────────────────────────────────────────
  function onResize() {
    if (!renderer || !gameWrap || !camera) return;
    const w = gameWrap.clientWidth, h = gameWrap.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  // ── Helpers ────────────────────────────────────────────────
  function shadeColor(hex, factor) {
    const r = ((hex >> 16) & 0xff) * factor;
    const g = ((hex >> 8)  & 0xff) * factor;
    const b = ((hex)       & 0xff) * factor;
    return (Math.floor(r) << 16) | (Math.floor(g) << 8) | Math.floor(b);
  }

  function el(tag, cls) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    return e;
  }

  function showEl(id) { const e = document.getElementById(id); if (e) e.style.display = 'flex'; }
  function hideEl(id) { const e = document.getElementById(id); if (e) e.style.display = 'none'; }

  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

})();
