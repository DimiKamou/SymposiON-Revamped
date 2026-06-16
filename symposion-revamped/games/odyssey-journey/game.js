// ============================================================
//  Odyssey Journey 3D — Three.js Game  (Enhanced)
//  Depends on: ODYSSEY_LOCATIONS (data.js), THREE (CDN)
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

  // Game logic state
  let currentLang = 'gr';
  let completedSet = new Set();
  let selectedLoc = null;
  let shipCurrentPos, shipTargetPos;
  let shipMoving = false;
  let quizState = null;
  let lastShipDir = null;

  // ── Public API ─────────────────────────────────────────────
  window.initOdysseyJourney = function (lang) {
    currentLang = lang || 'gr';
    try { completedSet = new Set(JSON.parse(localStorage.getItem('oj-completed') || '[]')); } catch (e) { completedSet = new Set(); }
    gameWrap = document.getElementById('odyssey-journey-wrap');
    if (!gameWrap) return;
    gameWrap.innerHTML = '';
    elapsed = 0;
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
    window.removeEventListener('resize', onResize);
  };

  window.ojNavigateTo  = navigateTo;
  window.ojStartQuiz   = startQuiz;
  window.ojSelectAnswer = selectAnswer;
  window.ojResetJourney = resetJourney;
  window.ojCloseLocPanel  = function () { hideEl('oj-loc-panel'); };
  window.ojCloseQuizPanel = function () { hideEl('oj-quiz-panel'); };

  // ── Three.js Loader ────────────────────────────────────────
  function loadThreeJS(cb) {
    if (window.THREE) { cb(); return; }
    if (gameWrap) {
      gameWrap.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#6ab4e8;font-family:'Cinzel',serif;gap:16px;">
        <div style="font-size:2.5rem;animation:spin 2s linear infinite;display:inline-block">🌊</div>
        <div style="font-size:.95rem;letter-spacing:.08em;">Φόρτωση 3D κόσμου…</div>
        <div style="font-size:.75rem;color:#4a6080;letter-spacing:.05em;">Loading Three.js…</div>
        <style>@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}</style>
      </div>`;
    }
    const existing = document.getElementById('three-cdn');
    if (existing) {
      const poll = setInterval(() => {
        if (window.THREE) { clearInterval(poll); if (gameWrap) gameWrap.innerHTML = ''; cb(); }
      }, 40);
      return;
    }
    function tryLoad(urls, idx) {
      if (idx >= urls.length) {
        if (gameWrap) gameWrap.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#e88080;font-family:'Cinzel',serif;gap:12px;padding:32px;text-align:center;">
          <div style="font-size:2rem;">⚠️</div><div style="font-size:.9rem;">Αποτυχία φόρτωσης Three.js</div>
          <div style="font-size:.75rem;color:#6a4040;max-width:320px;line-height:1.6;">Απαιτείται σύνδεση στο internet.<br>Δοκίμασε αργότερα ή χρησιμοποίησε τα άλλα παιχνίδια.</div>
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

  // ── Build Scene ────────────────────────────────────────────
  function buildGame() {
    const T = THREE;
    clock = new T.Clock();

    const canvas = document.createElement('canvas');
    canvas.id = 'odyssey-canvas';
    gameWrap.appendChild(canvas);

    renderer = new T.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(gameWrap.clientWidth, gameWrap.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.setClearColor(0x040c1a);
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    scene = new T.Scene();
    scene.fog = new T.FogExp2(0x040c1a, 0.013);

    camera = new T.PerspectiveCamera(52, gameWrap.clientWidth / gameWrap.clientHeight, 0.1, 220);
    camera.position.set(0, 32, 26);
    camera.lookAt(0, 0, -2);

    raycaster = new T.Raycaster();
    mouse = new T.Vector2();

    buildSky();
    buildStars();
    buildMoon();
    buildOcean();
    buildLighting();
    buildIslands();
    buildShip();
    buildWake();
    buildPaths();
    buildUI();

    canvas.addEventListener('click', onCanvasClick);
    window.addEventListener('resize', onResize);

    animate();
    setTimeout(() => { showEl('oj-intro'); }, 350);
  }

  // ── Sky ────────────────────────────────────────────────────
  function buildSky() {
    const T = THREE;
    const geom = new T.SphereGeometry(100, 12, 8);
    const mat = new T.ShaderMaterial({
      side: T.BackSide,
      uniforms: {
        uTop:    { value: new T.Color(0x010510) },
        uMiddle: { value: new T.Color(0x031022) },
        uBottom: { value: new T.Color(0x081e38) },
      },
      vertexShader: `
        varying vec3 vWorldPos;
        void main() {
          vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uTop; uniform vec3 uMiddle; uniform vec3 uBottom;
        varying vec3 vWorldPos;
        void main() {
          float h = normalize(vWorldPos).y;
          vec3 col = h > 0.0 ? mix(uMiddle, uTop, pow(h, 0.6)) : mix(uMiddle, uBottom, pow(-h, 0.5));
          gl_FragColor = vec4(col, 1.0);
        }
      `
    });
    scene.add(new T.Mesh(geom, mat));
  }

  // ── Moon ───────────────────────────────────────────────────
  function buildMoon() {
    const T = THREE;
    // Moon sphere
    const moonGeo = new T.SphereGeometry(3.5, 20, 16);
    const moonMat = new T.MeshStandardMaterial({ color: 0xdde8f0, roughness: 0.85, metalness: 0.05,
      emissive: 0x8899aa, emissiveIntensity: 0.18 });
    const moonMesh = new T.Mesh(moonGeo, moonMat);
    moonMesh.position.set(38, 52, -65);
    scene.add(moonMesh);

    // Glow rings around moon
    for (let i = 0; i < 2; i++) {
      const glowGeo = new T.SphereGeometry(3.5 + (i + 1) * 1.8, 16, 12);
      const glowMat = new T.MeshBasicMaterial({ color: 0xaabbcc, transparent: true, opacity: 0.06 - i * 0.025, side: T.BackSide });
      const glow = new T.Mesh(glowGeo, glowMat);
      glow.position.copy(moonMesh.position);
      scene.add(glow);
    }

    // Moon directional light (cool blue-white)
    const moonLight = new T.DirectionalLight(0xc8ddf8, 1.1);
    moonLight.position.copy(moonMesh.position).normalize().multiplyScalar(80);
    moonLight.castShadow = true;
    moonLight.shadow.mapSize.set(1024, 1024);
    Object.assign(moonLight.shadow.camera, { near: 0.1, far: 150, left: -40, right: 40, top: 40, bottom: -40 });
    scene.add(moonLight);
  }

  // ── Stars ──────────────────────────────────────────────────
  function buildStars() {
    const T = THREE;
    const count = 1600;
    const pos = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
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
    }
    const geom = new T.BufferGeometry();
    geom.setAttribute('position', new T.BufferAttribute(pos, 3));
    geom.setAttribute('color', new T.BufferAttribute(colors, 3));
    const mat = new T.PointsMaterial({ vertexColors: true, size: 0.26, sizeAttenuation: true, transparent: true, opacity: 0.9 });
    starsMesh = new T.Points(geom, mat);
    scene.add(starsMesh);
  }

  // ── Ocean ──────────────────────────────────────────────────
  function buildOcean() {
    const T = THREE;
    const geom = new T.PlaneGeometry(110, 110, 48, 48);
    geom.rotateX(-Math.PI / 2);
    oceanPositions = geom.attributes.position;
    const mat = new T.MeshPhongMaterial({
      color:     0x0c3558,
      emissive:  new T.Color(0x051420),
      emissiveIntensity: 0.25,
      shininess: 160,
      specular:  new T.Color(0x88ccff),
    });
    oceanMesh = new T.Mesh(geom, mat);
    oceanMesh.receiveShadow = true;
    scene.add(oceanMesh);
  }

  // ── Lighting ───────────────────────────────────────────────
  function buildLighting() {
    const T = THREE;
    scene.add(new T.AmbientLight(0x1a2d52, 0.9));
    // Warm rim from below (subtle golden)
    const rim = new T.DirectionalLight(0x332211, 0.25);
    rim.position.set(-10, -5, 15);
    scene.add(rim);
  }

  // ── Islands ────────────────────────────────────────────────
  function buildIslands() {
    const T = THREE;
    locationGroups = [];
    islandLights = [];

    ODYSSEY_LOCATIONS.forEach((loc, idx) => {
      const group = new T.Group();

      // Sandy shore with slight variation
      const shoreR = loc.baseRadius * 1.18;
      const shore = new T.Mesh(
        new T.CylinderGeometry(shoreR, shoreR * 1.1, 0.5, 10),
        new T.MeshPhongMaterial({ color: 0xc8a048 })
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
        new T.MeshPhongMaterial({ color: loc.id === 'underworld' ? 0x1a1028 : 0x2a6e2a })
      );
      land.position.y = 0.48; land.castShadow = true;
      group.add(land);

      // Mountain peak
      const mtnH = loc.height;
      const mtn = new T.Mesh(
        new T.ConeGeometry(loc.baseRadius * 0.65, mtnH, 9),
        new T.MeshPhongMaterial({ color: loc.color })
      );
      mtn.position.y = 0.68 + mtnH / 2; mtn.castShadow = true;
      group.add(mtn);

      // Secondary smaller peak for depth
      const mtn2 = new T.Mesh(
        new T.ConeGeometry(loc.baseRadius * 0.3, mtnH * 0.55, 7),
        new T.MeshPhongMaterial({ color: shadeColor(loc.color, 0.8) })
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

      // Glow ring
      const isComplete = completedSet.has(loc.id);
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

      // Point light per island (warm flicker)
      const pLight = new T.PointLight(isComplete ? 0x44ee88 : 0xffcc44, 0.5, 10);
      pLight.position.set(0, mtnH + 1.5, 0);
      group.add(pLight);

      group.position.set(loc.pos[0], 0, loc.pos[2]);
      group.userData = { locationId: loc.id, ring, ringMat, pLight, isComplete };
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
    const sailMat  = new T.MeshPhongMaterial({ color: 0xF0E0B8, side: T.DoubleSide, emissive: 0x221100, emissiveIntensity: 0.15 });
    const goldMat  = new T.MeshPhongMaterial({ color: 0xFFD700, emissive: 0x664400, emissiveIntensity: 0.5 });
    const ropeMat  = new T.MeshPhongMaterial({ color: 0xc8b07a });

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
    const beam = new T.Mesh(new T.CylinderGeometry(0.03, 0.03, 1.1, 6), darkMat);
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

    // Sail (with slight billow)
    const sail = new T.Mesh(new T.PlaneGeometry(1.02, 1.55, 3, 5), sailMat);
    sail.position.set(0, 1.88, 0.05);
    sail.rotation.y = Math.PI / 2;
    shipGroup.add(sail);

    // Sail pattern stripe
    const stripe = new T.Mesh(new T.PlaneGeometry(1.02, 0.12), new T.MeshPhongMaterial({ color: 0x8b2010, side: T.DoubleSide }));
    stripe.position.set(0, 1.95, 0.06);
    stripe.rotation.y = Math.PI / 2;
    shipGroup.add(stripe);

    // Lantern (glowing point)
    const lanternLight = new T.PointLight(0xffaa44, 0.8, 5);
    lanternLight.position.set(0, 3.1, 0.1);
    shipGroup.add(lanternLight);
    shipGroup.userData.lantern = lanternLight;

    // Lantern mesh
    const lanternMesh = new T.Mesh(new T.SphereGeometry(0.1, 8, 6),
      new T.MeshBasicMaterial({ color: 0xffcc44 }));
    lanternMesh.position.copy(lanternLight.position);
    shipGroup.add(lanternMesh);

    const start = ODYSSEY_LOCATIONS[0];
    shipGroup.position.set(start.pos[0] - 2, 0.55, start.pos[2] + 2.5);
    shipCurrentPos = new THREE.Vector3(start.pos[0] - 2, 0.55, start.pos[2] + 2.5);
    shipTargetPos  = shipCurrentPos.clone();
    lastShipDir = new THREE.Vector3(0, 0, -1);

    scene.add(shipGroup);
  }

  // ── Wake Particles ─────────────────────────────────────────
  function buildWake() {
    const T = THREE;
    const wakeMat = new T.MeshBasicMaterial({ color: 0xc8e8f8, transparent: true, opacity: 0.3, side: T.DoubleSide });
    for (let i = 0; i < 7; i++) {
      const w = new T.Mesh(new T.PlaneGeometry(0.35, 0.2), wakeMat.clone());
      w.rotation.x = Math.PI / 2;
      w.userData.age = i / 7;
      w.visible = false;
      scene.add(w);
      wakeParticles.push(w);
    }
  }

  // ── Journey Path Lines ─────────────────────────────────────
  function buildPaths() {
    const T = THREE;
    const order = ['ithaca','cyclops','sirens','circe','underworld','ogygia','phaeacia','ithaca-return'];
    const lineMat = new T.LineBasicMaterial({ color: 0x4a88b8, transparent: true, opacity: 0.5 });

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
      scene.add(new T.Line(new T.BufferGeometry().setFromPoints(pts), lineMat));
    }
  }

  // ── Animation Loop ─────────────────────────────────────────
  function animate() {
    animFrame = requestAnimationFrame(animate);
    const delta = clock.getDelta();
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
      oceanMesh.geometry.computeVertexNormals();
    }

    // Stars twinkle
    if (starsMesh) {
      starsMesh.material.opacity = 0.8 + Math.sin(t * 0.6) * 0.1;
      starsMesh.rotation.y = t * 0.00015;
    }

    animateShip(delta, t);
    animateWake(t);
    animateIslandLights(t);

    // Ring animation
    locationGroups.forEach((g, i) => {
      const ring = g.userData.ring;
      if (ring) {
        ring.rotation.z = t * 0.5 + i * 0.8;
        const sc = 1 + Math.sin(t * 2.0 + i * 0.9) * 0.05;
        ring.scale.set(sc, sc, 1);
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

  function animateIslandLights(t) {
    locationGroups.forEach((g, i) => {
      if (g.userData.pLight) {
        g.userData.pLight.intensity = 0.45 + Math.sin(t * 1.8 + i * 0.7) * 0.12;
      }
    });
    // Ship lantern flicker
    if (shipGroup && shipGroup.userData.lantern) {
      shipGroup.userData.lantern.intensity = 0.7 + Math.sin(elapsed * 4.2) * 0.15;
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
      shipGroup.rotation.z = -dir.x * 0.09;
      shipGroup.rotation.x =  dir.z * 0.04;
    } else {
      if (shipMoving) { shipMoving = false; onShipArrived(); }
      shipGroup.position.y = 0.55 + Math.sin(t * 1.4) * 0.07 + Math.sin(t * 2.2) * 0.03;
      shipGroup.rotation.z = Math.sin(t * 0.9) * 0.025;
      shipGroup.rotation.x = Math.sin(t * 1.5) * 0.018;
    }
  }

  function animateWake(t) {
    if (!lastShipDir || wakeParticles.length === 0) return;
    const speed = shipMoving ? 0.45 : 0.15;
    wakeParticles.forEach((w, i) => {
      w.userData.age = (w.userData.age + 0.016 * speed) % 1.0;
      const age = w.userData.age;
      const offset = age * 4.5;
      const spread = age * 0.8;
      w.visible = shipMoving || age < 0.4;
      w.position.copy(shipCurrentPos);
      w.position.x -= lastShipDir.x * offset + (i % 2 === 0 ? spread : -spread) * 0.3;
      w.position.z -= lastShipDir.z * offset;
      w.position.y = 0.28 + Math.sin(t * 2.5 + i) * 0.04;
      w.material.opacity = (1 - age) * 0.28;
      const sc = 0.5 + age * 2.0;
      w.scale.set(sc, sc, 1);
    });
  }

  function onShipArrived() {
    if (selectedLoc) showLocPanel(selectedLoc);
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

    // HUD
    const hud = el('div', 'oj-hud');
    hud.innerHTML = `
      <div id="oj-hud-title">⚓ ${gr ? 'Οδύσσεια 3D' : 'Odyssey 3D'}</div>
      <div id="oj-progress">
        <div id="oj-progress-text">${gr ? 'Πρόοδος' : 'Progress'} <span id="oj-done">0</span>/${ODYSSEY_LOCATIONS.length}</div>
        <div id="oj-progress-bar"><div id="oj-progress-fill"></div></div>
      </div>`;
    gameWrap.appendChild(hud);

    // Island labels
    const labelsDiv = el('div', 'oj-labels');
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

    // Instructions
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
      <div class="oj-panel-content">
        <div class="oj-panel-icon">🌊</div>
        <h2>${gr ? 'Η Περιπλάνηση του Οδυσσέα' : "Odysseus's Journey"}</h2>
        <p>${gr
          ? 'Ταξίδεψε στη Μεσόγειο, εξερεύνησε τα νησιά και απάντησε ερωτήσεις για κάθε ραψωδία.'
          : 'Sail the Mediterranean, explore the islands and answer questions for each rhapsody.'}</p>
        <p class="oj-subtitle">${gr ? `${ODYSSEY_LOCATIONS.length} νησιά · Ακολούθησε τη διαδρομή` : `${ODYSSEY_LOCATIONS.length} islands · Follow the journey`}</p>
        <button onclick="document.getElementById('oj-intro').style.display='none'">
          ${gr ? '⚓ Αρπάρε!' : '⚓ Set Sail!'}
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
        <button class="oj-close-btn" onclick="ojCloseLocPanel()">✕</button>
        <div class="oj-loc-left">
          <span class="oj-loc-icon">${loc.icon}</span>
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
    const hearts  = '❤️'.repeat(s.lives) + '🖤'.repeat(3 - s.lives);

    const panel = document.getElementById('oj-quiz-panel');
    panel.innerHTML = `
      <div class="oj-quiz-content">
        <div class="oj-quiz-header">
          <div class="oj-quiz-loc">${loc.icon} ${locName}</div>
          <div class="oj-quiz-lives">${hearts}</div>
          <div class="oj-quiz-progress">${s.current + 1}/${s.questions.length}</div>
        </div>
        <div class="oj-quiz-question">${gr ? q.gr : q.en}</div>
        <div class="oj-quiz-answers">
          ${displayAnswers.map((ans, i) =>
            `<button class="oj-answer-btn" onclick="ojSelectAnswer(${i})">${ans}</button>`
          ).join('')}
        </div>
      </div>`;
    panel.style.display = 'flex';
    panel.style.position = 'absolute';
    panel.style.inset = '0';
    panel.style.alignItems = 'center';
    panel.style.justifyContent = 'center';
    panel.style.zIndex = '40';
    panel.style.background = 'rgba(4,12,26,0.88)';
    panel.style.backdropFilter = 'blur(8px)';
  }

  function selectAnswer(index) {
    if (!quizState) return;
    const s = quizState;
    const correct = index === s.shuffledCorrect;
    const btns = document.querySelectorAll('.oj-answer-btn');
    btns.forEach(b => b.disabled = true);
    if (btns[s.shuffledCorrect]) btns[s.shuffledCorrect].classList.add('correct');
    if (!correct && btns[index]) btns[index].classList.add('wrong');
    if (correct) { s.correct++; }
    else {
      s.lives--;
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
        // Update ring to green
        const group = locationGroups.find(g => g.userData.locationId === s.locationId);
        if (group) {
          group.userData.ringMat.color.setHex(0x44ff88);
          group.userData.ringMat.emissive.setHex(0x22aa44);
          if (group.userData.pLight) group.userData.pLight.color.setHex(0x44ee88);
        }
        // Update label
        const lbl = document.getElementById('oj-label-' + s.locationId);
        if (lbl) lbl.classList.add('complete');
        updateProgressUI();
      }

      if (completedSet.size >= ODYSSEY_LOCATIONS.length) {
        setTimeout(showVictory, 600);
        return;
      }
    }

    // Result screen
    const panel = document.getElementById('oj-quiz-panel');
    const locName = gr ? loc.nameGr : loc.nameEn;
    const scoreText = success
      ? (gr ? `${s.correct}/${s.questions.length} σωστές` : `${s.correct}/${s.questions.length} correct`)
      : '';
    panel.innerHTML = `
      <div class="oj-quiz-content">
        <div class="oj-result-icon">${success ? '🏆' : '💔'}</div>
        <h2>${success ? (gr ? 'Εξαιρετικά!' : 'Excellent!') : (gr ? 'Προσπάθησε ξανά!' : 'Try again!')}</h2>
        <p>${success
          ? (gr ? `Ολοκλήρωσες ${locName} — ${scoreText}!` : `Completed ${locName} — ${scoreText}!`)
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
    panel.innerHTML = `
      <div class="oj-panel-content oj-victory-card">
        <div class="oj-panel-icon" style="font-size:64px;">🏛️</div>
        <h2>${gr ? 'Η Οδύσσεια Ολοκληρώθηκε!' : 'The Odyssey is Complete!'}</h2>
        <p>${gr
          ? 'Εξερεύνησες κάθε ραψωδία και ο Οδυσσέας επέστρεψε στην Ιθάκη!'
          : 'You explored every rhapsody and Odysseus returned to Ithaca!'}</p>
        <div class="oj-stars">⭐⭐⭐</div>
        <p style="font-size:13px;color:rgba(250,245,237,0.45);">${gr ? 'Ὅδε ἀνὴρ πολύτροπος…' : 'Homer would be proud.'}</p>
        <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:8px;">
          <button onclick="ojResetJourney()">${gr ? '🔄 Νέο ταξίδι' : '🔄 New Journey'}</button>
          <button class="oj-map-btn" onclick="document.getElementById('oj-victory-panel').style.display='none'">${gr ? '🗺️ Χάρτης' : '🗺️ Map'}</button>
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
      if (g.userData.pLight) g.userData.pLight.color.setHex(0xffcc44);
      const lbl = document.getElementById('oj-label-' + g.userData.locationId);
      if (lbl) lbl.classList.remove('complete');
    });
    hideEl('oj-victory-panel');
  }

  // ── Progress UI ────────────────────────────────────────────
  function updateProgressUI() {
    const doneEl = document.getElementById('oj-done');
    const fillEl = document.getElementById('oj-progress-fill');
    if (doneEl) doneEl.textContent = completedSet.size;
    if (fillEl) fillEl.style.width = (completedSet.size / ODYSSEY_LOCATIONS.length * 100) + '%';
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
