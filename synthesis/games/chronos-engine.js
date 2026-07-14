/* ============================================================
   Chronos engine — shared runtime for the SymposiON walkable
   history experiences (Constantinople 330–1453, Knossos, the
   Acropolis…). Distilled from the Hagia Sophia 537 museum.

   An app defines window.XP_APP = {
     id, theme:{gold,halo,btn1,btn2,sub}, title, subtitle,
     intro:[{en,gr},…], credit:{en,gr}, favicolor?,
     sky:{top,mid,horizon,sun:{x,y,z}}, fog:{color,density},
     sun:{color,intensity,pos}, hemi:{sky,ground,intensity},
     fills:[{x,y,z,color,intensity,range}],
     spawn:{x,z,yaw,y?}, eye, walkSpeed, runSpeed,
     fly?:{speed, minY, maxY},          // enables F fly-mode
     bounds:{x0,x1,z0,z1},
     interactR, markerScale,
     map:{x0,x1,z0,z1,w,h,draw(ctx,m)},
     exhibits:[{id,n,at:[x,z],atY?,view:[x,z,yaw,pitch?],viewY?,
                title:{},sub:{},body:{}}],
     eras?:[{year,title:{en,gr},blurb:{en,gr}}], setEra?(i),
     ambience?:{freqs:[[f,g],…]},
     buildWorld(world, XP),             // geometry; use XP helpers
     listTitle:{en,gr}
   }
   and loads: three.min.js → data/world scripts → this file.
   ============================================================ */
(function () {
  const A = window.XP_APP;
  if (!A) { console.error('XP_APP missing'); return; }
  const XP = window.XP = { app: A };

  /* ---------------- tiny utils ---------------- */
  const Q = {};
  location.search.replace(/[?&]([^=&]+)=?([^&]*)/g, (_, k, v) => { Q[k] = decodeURIComponent(v); });
  XP.lang = (Q.lang === 'gr' || Q.lang === 'el') ? 'gr' : 'en';
  const L = o => (o && (o[XP.lang] || o.en)) || '';
  XP.rad = d => d * Math.PI / 180;
  XP.rng = function (seed) {
    let s = seed >>> 0;
    return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  };
  XP.canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  XP.tex = function (c, rx, ry) {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (rx) t.repeat.set(rx, ry || rx);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  };

  /* ---------------- geometry helpers ---------------- */
  XP.mergeGeoms = function (geoms) {
    let vc = 0;
    const list = geoms.map(g => g.index ? g.toNonIndexed() : g);
    list.forEach(g => { vc += g.attributes.position.count; });
    const pos = new Float32Array(vc * 3), nor = new Float32Array(vc * 3), uv = new Float32Array(vc * 2);
    let o = 0;
    list.forEach(g => {
      const n = g.attributes.position.count;
      pos.set(g.attributes.position.array, o * 3);
      if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
      if (g.attributes.uv) uv.set(g.attributes.uv.array, o * 2);
      o += n;
    });
    const out = new THREE.BufferGeometry();
    out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
    out.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
    return out;
  };
  XP.builder = function (material, name) {
    const geoms = [];
    return {
      add(geo, x, y, z, rotY, rotX, rotZ, sc) {
        const m = new THREE.Matrix4();
        const e = new THREE.Euler(rotX || 0, rotY || 0, rotZ || 0, 'YXZ');
        m.compose(new THREE.Vector3(x || 0, y || 0, z || 0),
          new THREE.Quaternion().setFromEuler(e),
          new THREE.Vector3(sc || 1, sc || 1, sc || 1));
        const g = geo.clone(); g.applyMatrix4(m); geoms.push(g);
        return this;
      },
      raw(geo) { geoms.push(geo); return this; },
      flush(parent) {
        if (!geoms.length) return null;
        const mesh = new THREE.Mesh(XP.mergeGeoms(geoms), material);
        mesh.name = name || 'merged';
        mesh.matrixAutoUpdate = false;
        parent.add(mesh);
        geoms.length = 0;
        return mesh;
      }
    };
  };
  XP.scaleUV = function (geo, kx, ky) {
    const uv = geo.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * kx, uv.getY(i) * (ky || kx));
    return geo;
  };

  /* colliders + walkable floors (same scheme as Hagia Sophia) */
  XP.colliders = []; XP.floors = [];
  XP.addBox = (x0, x1, z0, z1, y0, y1) => XP.colliders.push({ kind: 'box',
    x0: Math.min(x0, x1), x1: Math.max(x0, x1), z0: Math.min(z0, z1), z1: Math.max(z0, z1),
    y0: y0 === undefined ? 0 : y0, y1: y1 === undefined ? 60 : y1 });
  XP.addCyl = (x, z, r, y0, y1) => XP.colliders.push({ kind: 'cyl', x, z, r,
    y0: y0 === undefined ? 0 : y0, y1: y1 === undefined ? 30 : y1 });
  XP.addFloor = s => XP.floors.push(s);
  XP.groundY = function (x, z, refY) {
    let best = -1e9;
    for (const f of XP.floors) {
      let inside, y = f.y;
      if (f.circle) {
        const dx = x - f.circle.x, dz = z - f.circle.z;
        inside = dx * dx + dz * dz <= f.circle.r * f.circle.r;
      } else inside = x >= f.x0 && x <= f.x1 && z >= f.z0 && z <= f.z1;
      if (!inside) continue;
      if (f.ramp) {
        const t = f.ramp.axis === 'x' ? (x - f.ramp.from) / (f.ramp.to - f.ramp.from)
                                      : (z - f.ramp.from) / (f.ramp.to - f.ramp.from);
        y = f.ramp.y0 + Math.min(1, Math.max(0, t)) * (f.ramp.y1 - f.ramp.y0);
      }
      if (y > best && y <= refY + (A.climb || 0.9)) best = y;
    }
    return best === -1e9 ? 0 : best;
  };

  /* ---------------- column factory (profiles) ---------------- */
  const colTypes = {};
  XP.columnType = (key, spec) => { colTypes[key] = Object.assign({ placements: [] }, spec); };
  XP.column = (key, x, z, y, rotY) => {
    colTypes[key].placements.push({ x, z, y: y || 0, rotY: rotY || 0 });
    if (colTypes[key].collide !== false) XP.addCyl(x, z, colTypes[key].r + 0.16, y || 0, (y || 0) + 3);
  };
  function shaftGeo(t) {
    const pts = [], taper = t.taper === undefined ? 0.82 : t.taper;
    for (let i = 0; i <= 8; i++) {
      const k = i / 8;
      let rr = t.r * (1 + (taper - 1) * k);
      if (t.profile !== 'minoan') rr += t.r * 0.03 * Math.sin(k * Math.PI);
      pts.push(new THREE.Vector2(rr, k * t.hS));
    }
    return new THREE.LatheGeometry(pts, t.seg || 18);
  }
  XP.flushColumns = function (parent) {
    Object.keys(colTypes).forEach(key => {
      const t = colTypes[key];
      if (!t.placements.length) return;
      const hB = t.baseH !== undefined ? t.baseH : (t.profile === 'doric' || t.profile === 'minoan' ? 0 : t.h * 0.06);
      const hC = t.capH !== undefined ? t.capH : t.h * 0.12;
      t.hS = t.h - hB - hC;
      const parts = [];
      if (hB > 0) {
        const plinth = new THREE.CylinderGeometry(t.r * 1.42, t.r * 1.5, hB * 0.55, 4);
        plinth.rotateY(Math.PI / 4); plinth.translate(0, hB * 0.275, 0);
        const torus = new THREE.CylinderGeometry(t.r * 1.22, t.r * 1.32, hB * 0.45, 16);
        torus.translate(0, hB * 0.775, 0);
        parts.push({ g: XP.mergeGeoms([plinth, torus]), m: t.baseMat || t.capMat || t.mat, y0: 0 });
      }
      parts.push({ g: shaftGeo(t), m: t.mat, y0: hB });
      let cap;
      if (t.profile === 'doric') {
        const rTop = t.r * (t.taper === undefined ? 0.78 : t.taper);
        const ech = new THREE.CylinderGeometry(rTop * 1.5, rTop * 1.02, hC * 0.5, 18);
        ech.translate(0, hC * 0.25, 0);
        const ab = new THREE.BoxGeometry(rTop * 3.1, hC * 0.5, rTop * 3.1);
        ab.translate(0, hC * 0.75, 0);
        cap = XP.mergeGeoms([ech, ab]);
      } else if (t.profile === 'minoan') {
        const rTop = t.r * (t.taper || 1.35);
        const cushion = new THREE.CylinderGeometry(rTop * 1.35, rTop * 0.95, hC * 0.55, 18);
        cushion.translate(0, hC * 0.275, 0);
        const ab = new THREE.BoxGeometry(rTop * 2.7, hC * 0.45, rTop * 2.7);
        ab.translate(0, hC * 0.72, 0);
        cap = XP.mergeGeoms([cushion, ab]);
      } else if (t.profile === 'ionic') {
        const rTop = t.r * 0.85;
        const bar = new THREE.BoxGeometry(rTop * 3.4, hC * 0.42, rTop * 1.6);
        bar.translate(0, hC * 0.35, 0);
        const s1 = new THREE.CylinderGeometry(rTop * 0.62, rTop * 0.62, rTop * 1.7, 12);
        s1.rotateX(Math.PI / 2);
        const s2 = s1.clone();
        s1.translate(-rTop * 1.55, hC * 0.35, 0); s2.translate(rTop * 1.55, hC * 0.35, 0);
        const ab = new THREE.BoxGeometry(rTop * 2.5, hC * 0.3, rTop * 1.4);
        ab.translate(0, hC * 0.75, 0);
        cap = XP.mergeGeoms([bar, s1, s2, ab]);
      } else {  // byzantine basket
        const pts = [];
        for (let i = 0; i <= 6; i++) { const k = i / 6; pts.push(new THREE.Vector2(t.r * (0.96 + 0.62 * k * k), k * hC * 0.62)); }
        const basket = new THREE.LatheGeometry(pts, 16);
        const impost = new THREE.CylinderGeometry(t.r * 1.95, t.r * 1.52, hC * 0.38, 4);
        impost.rotateY(Math.PI / 4); impost.translate(0, hC * 0.81, 0);
        cap = XP.mergeGeoms([basket, impost]);
      }
      parts.push({ g: cap, m: t.capMat || t.mat, y0: hB + t.hS });
      parts.forEach(p => {
        const im = new THREE.InstancedMesh(p.g, p.m, t.placements.length);
        const M4 = new THREE.Matrix4();
        t.placements.forEach((pl, i) => {
          M4.makeRotationY(pl.rotY); M4.setPosition(pl.x, pl.y + p.y0, pl.z);
          im.setMatrixAt(i, M4);
        });
        im.instanceMatrix.needsUpdate = true;
        parent.add(im);
      });
    });
  };

  /* floating text label (for city monuments etc.) */
  XP.labelGroup = null;
  XP.label = function (text, x, y, z, scale) {
    const c = XP.canvas(512, 128), g = c.getContext('2d');
    g.font = 'bold 44px Georgia, serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.lineWidth = 8; g.strokeStyle = 'rgba(12,9,4,0.9)';
    g.strokeText(text, 256, 64);
    g.fillStyle = '#f0dfae'; g.fillText(text, 256, 64);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true, depthTest: false }));
    s.scale.set((scale || 1) * 26, (scale || 1) * 6.5, 1);
    s.position.set(x, y, z);
    s.renderOrder = 20;
    XP.labelGroup.add(s);
    return s;
  };

  /* ---------------- DOM ---------------- */
  const th = A.theme || {};
  document.body.style.setProperty('--xp-gold', th.gold || '#d9b45c');
  if (th.halo) document.body.style.setProperty('--xp-halo', th.halo);
  if (th.btn1) document.body.style.setProperty('--xp-btn1', th.btn1);
  if (th.btn2) document.body.style.setProperty('--xp-btn2', th.btn2);
  if (th.sub) document.body.style.setProperty('--xp-sub', th.sub);
  function el(tag, attrs, html) {
    const e = document.createElement(tag);
    for (const k in (attrs || {})) e.setAttribute(k, attrs[k]);
    if (html !== undefined) e.innerHTML = html;
    return e;
  }
  const keysRow = (A.fly ? [['W A S D', { en: 'move', gr: 'κίνηση' }], ['F', { en: 'walk / fly', gr: 'βάδισμα / πτήση' }], ['Q / E', { en: 'down / up (fly)', gr: 'κάτω / πάνω' }]]
                        : [['W A S D', { en: 'walk', gr: 'κίνηση' }]])
    .concat([['Mouse', { en: 'look', gr: 'ματιά' }], ['Shift', { en: 'hurry', gr: 'τρέξιμο' }],
             ['E', { en: 'exhibit', gr: 'έκθεμα' }], ['Tab', { en: 'index', gr: 'ευρετήριο' }]])
    .concat(A.eras ? [['← →', { en: 'era', gr: 'εποχή' }]] : [])
    .concat([['M', { en: 'map', gr: 'χάρτης' }], ['Esc', { en: 'release mouse', gr: 'ποντίκι' }]]);
  document.body.appendChild(el('div', { id: 'intro' }, `
    <div class="intro-card">
      <h1>${A.title}</h1>
      <h2>${L(A.subtitle)}</h2>
      ${A.intro.map(p => `<p>${L(p)}</p>`).join('')}
      <div class="keys">${keysRow.map(k => `<span><b>${k[0]}</b> ${L(k[1])}</span>`).join('')}</div>
      <div class="intro-btns"><button class="btn-main" id="btn-enter">${L(A.enter || { en: 'Enter', gr: 'Είσοδος' })}</button></div>
      <div class="credit">${L(A.credit)}</div>
    </div>`));
  document.body.appendChild(el('div', { id: 'hud' }, `
    <div id="title-chip">${A.title}</div>
    <div id="crosshair"></div><div id="hint"></div>
    <div id="map-wrap"><canvas id="map" width="${A.map.w}" height="${A.map.h}"></canvas></div>
    ${A.eras ? '<div id="timeline"></div><div id="era-card"><div class="ey"></div><div class="et"></div></div>' : ''}
    <div id="buttons">
      <button id="btn-list">① ${L(A.listBtn || { en: 'Exhibits', gr: 'Εκθέματα' })}</button>
      ${A.labels ? `<button id="btn-labels">🏷 ${L({ en: 'Labels', gr: 'Ετικέτες' })}</button>` : ''}
      <button id="btn-sound">♪</button>
      <button id="btn-lang">${XP.lang === 'en' ? 'ΕΛ' : 'EN'}</button>
      <button id="btn-help">?</button>
    </div>`));
  document.body.appendChild(el('div', { id: 'panel' }, `
    <button id="panel-close">✕</button><div id="panel-n"></div>
    <h2 id="panel-title"></h2><div id="panel-sub"></div><div id="panel-body"></div>`));
  document.body.appendChild(el('div', { id: 'list' }, `<h3>${L(A.listTitle)}</h3><div id="list-items"></div>`));
  document.body.appendChild(el('div', { id: 'pause' }, `<div>${L({ en: 'Paused — click to continue', gr: 'Παύση — κλικ για συνέχεια' })}</div>`));
  const $ = id => document.getElementById(id);

  /* ---------------- three boot ---------------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = A.exposure || 1.0;
  document.body.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(A.fog.color, A.fog.density);
  const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 3000);
  XP.scene = scene; XP.renderer = renderer; XP.camera = camera;

  // sky + env
  (function () {
    const c = XP.canvas(1024, 512), g = c.getContext('2d');
    const gr = g.createLinearGradient(0, 0, 0, 512);
    gr.addColorStop(0, A.sky.top); gr.addColorStop(0.6, A.sky.mid); gr.addColorStop(1, A.sky.horizon);
    g.fillStyle = gr; g.fillRect(0, 0, 1024, 512);
    if (A.sky.sun) {
      const s = g.createRadialGradient(A.sky.sun.u * 1024, A.sky.sun.v * 512, 5, A.sky.sun.u * 1024, A.sky.sun.v * 512, 90);
      s.addColorStop(0, 'rgba(255,252,240,1)'); s.addColorStop(1, 'rgba(255,244,200,0)');
      g.fillStyle = s; g.fillRect(0, 0, 1024, 512);
    }
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(1400, 32, 16),
      new THREE.MeshBasicMaterial({ map: t, side: THREE.BackSide, fog: false })));
    const e = t.clone(); e.mapping = THREE.EquirectangularReflectionMapping; e.needsUpdate = true;
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromEquirectangular(e).texture;
    scene.environmentIntensity = 0.45;
  })();
  scene.add(new THREE.HemisphereLight(A.hemi.sky, A.hemi.ground, A.hemi.intensity));
  const sun = new THREE.DirectionalLight(A.sun.color, A.sun.intensity);
  sun.position.set(A.sun.pos[0], A.sun.pos[1], A.sun.pos[2]);
  scene.add(sun);
  (A.fills || []).forEach(f => {
    const p = new THREE.PointLight(f.color, f.intensity, f.range, 1.8);
    p.position.set(f.x, f.y, f.z); scene.add(p);
  });

  const world = new THREE.Group();
  scene.add(world);
  XP.labelGroup = new THREE.Group();
  world.add(XP.labelGroup);

  A.buildWorld(world, XP);
  XP.flushColumns(world);

  /* ---------------- exhibits ---------------- */
  const markerMat = new THREE.MeshBasicMaterial({ color: th.gold || 0xd9b45c, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false });
  const markers = [];
  const mScale = A.markerScale || 1;
  A.exhibits.forEach(ex => {
    const g = new THREE.Group();
    g.position.set(ex.at[0], ex.atY || XP.groundY(ex.at[0], ex.at[1], 99), ex.at[1]);
    const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.07 * mScale, 0.13 * mScale, 2.6 * mScale, 10, 1, true), markerMat);
    beam.position.y = 1.4 * mScale; g.add(beam);
    const c = XP.canvas(128, 128), x = c.getContext('2d');
    x.fillStyle = '#14100a'; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill();
    x.strokeStyle = th.gold || '#d9b45c'; x.lineWidth = 6; x.beginPath(); x.arc(64, 64, 54, 0, 7); x.stroke();
    x.fillStyle = '#ecd9a0'; x.font = 'bold 58px Georgia,serif';
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(String(ex.n), 64, 68);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const spr = new THREE.Sprite(new THREE.SpriteMaterial({ map: t, transparent: true }));
    spr.scale.set(0.62 * mScale, 0.62 * mScale, 1);
    spr.position.y = 2.05 * mScale; g.add(spr);
    g.userData.ex = ex;
    world.add(g); markers.push(g);
  });

  /* ---------------- controls (walk + fly + touch + drag) -------- */
  const C = XP.controls = {
    yaw: A.spawn.yaw, pitch: A.spawn.pitch || 0,
    pos: new THREE.Vector3(A.spawn.x, (A.spawn.y !== undefined ? A.spawn.y : XP.groundY(A.spawn.x, A.spawn.z, 99)) + (A.eye || 1.7), A.spawn.z),
    vel: new THREE.Vector3(), enabled: false, fly: !!(A.fly && A.fly.start), spectate: false
  };
  const keys = {};
  let dragMode = false, dragging = false, dx0 = 0, dy0 = 0;
  const dom = renderer.domElement;
  function enableDrag() { if (dragMode) return; dragMode = true; C.enabled = true; onLock(true); }
  function lock() {
    if (dragMode) return;
    if (dom.requestPointerLock) {
      try { dom.requestPointerLock(); } catch (e) { enableDrag(); return; }
      setTimeout(() => { if (document.pointerLockElement !== dom && !XP.touch) enableDrag(); }, 650);
    } else enableDrag();
  }
  document.addEventListener('pointerlockerror', () => { if (!XP.touch) enableDrag(); });
  document.addEventListener('pointerlockchange', () => {
    const locked = document.pointerLockElement === dom;
    if (!dragMode) C.enabled = locked;
    document.body.classList.toggle('locked', locked);
    onLock(dragMode || locked);
  });
  document.addEventListener('mousemove', e => {
    if (document.pointerLockElement === dom) {
      C.yaw -= e.movementX * 0.0021;
      C.pitch = Math.max(-1.5, Math.min(1.5, C.pitch - e.movementY * 0.0021));
    } else if (dragMode && dragging) {
      C.yaw -= (e.clientX - dx0) * 0.005;
      C.pitch = Math.max(-1.5, Math.min(1.5, C.pitch - (e.clientY - dy0) * 0.005));
      dx0 = e.clientX; dy0 = e.clientY;
    }
  });
  dom.addEventListener('mousedown', e => { if (dragMode) { dragging = true; dx0 = e.clientX; dy0 = e.clientY; } });
  document.addEventListener('mouseup', () => { dragging = false; });
  const touch = { moveId: null, mx: 0, my: 0, m0: null, lookId: null, l0: null };
  XP.touch = false;
  dom.addEventListener('touchstart', e => {
    XP.touch = true; C.enabled = true; onLock(true);
    for (const t of e.changedTouches) {
      if (t.clientX < innerWidth / 2 && touch.moveId === null) { touch.moveId = t.identifier; touch.m0 = [t.clientX, t.clientY]; }
      else if (touch.lookId === null) { touch.lookId = t.identifier; touch.l0 = [t.clientX, t.clientY]; }
    }
    e.preventDefault();
  }, { passive: false });
  dom.addEventListener('touchmove', e => {
    for (const t of e.changedTouches) {
      if (t.identifier === touch.moveId) {
        touch.mx = Math.max(-1, Math.min(1, (t.clientX - touch.m0[0]) / 55));
        touch.my = Math.max(-1, Math.min(1, (t.clientY - touch.m0[1]) / 55));
      } else if (t.identifier === touch.lookId) {
        C.yaw -= (t.clientX - touch.l0[0]) * 0.006;
        C.pitch = Math.max(-1.5, Math.min(1.5, C.pitch - (t.clientY - touch.l0[1]) * 0.006));
        touch.l0 = [t.clientX, t.clientY];
      }
    }
    e.preventDefault();
  }, { passive: false });
  dom.addEventListener('touchend', e => {
    for (const t of e.changedTouches) {
      if (t.identifier === touch.moveId) { touch.moveId = null; touch.mx = touch.my = 0; }
      if (t.identifier === touch.lookId) touch.lookId = null;
    }
  });
  const PR = 0.42;
  function collide(p, y0, y1) {
    for (let it = 0; it < 3; it++) {
      let pushed = false;
      for (const c of XP.colliders) {
        if (y1 < c.y0 + 0.05 || y0 > c.y1 - 0.05) continue;
        if (c.kind === 'box') {
          const nx = Math.max(c.x0, Math.min(p.x, c.x1)), nz = Math.max(c.z0, Math.min(p.z, c.z1));
          const dx = p.x - nx, dz = p.z - nz, d2 = dx * dx + dz * dz;
          if (d2 < PR * PR) {
            if (d2 > 1e-8) { const d = Math.sqrt(d2); p.x = nx + dx / d * PR; p.z = nz + dz / d * PR; }
            else {
              const Ls = [p.x - c.x0, c.x1 - p.x, p.z - c.z0, c.z1 - p.z], m = Math.min(...Ls);
              if (m === Ls[0]) p.x = c.x0 - PR; else if (m === Ls[1]) p.x = c.x1 + PR;
              else if (m === Ls[2]) p.z = c.z0 - PR; else p.z = c.z1 + PR;
            }
            pushed = true;
          }
        } else {
          const dx = p.x - c.x, dz = p.z - c.z, rr = c.r + PR, d2 = dx * dx + dz * dz;
          if (d2 < rr * rr && d2 > 1e-8) { const d = Math.sqrt(d2); p.x = c.x + dx / d * rr; p.z = c.z + dz / d * rr; pushed = true; }
        }
      }
      if (!pushed) break;
    }
  }
  C.update = function (dt) {
    dt = Math.min(dt, 0.05);
    let f = 0, r = 0;
    if (C.enabled || C.spectate) {
      f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
      r = (keys.KeyD ? 1 : 0) - (keys.KeyA ? 1 : 0);
      if (XP.touch) { f += -touch.my; r += touch.mx; }
    }
    const run = keys.ShiftLeft || keys.ShiftRight;
    const flying = C.fly && !C.spectate;
    const speed = C.spectate ? (A.walkSpeed || 3.1) * 2.2
      : flying ? (A.fly.speed * (run ? 2 : 1))
      : ((run ? (A.runSpeed || 6.4) : (A.walkSpeed || 3.1)));
    const sy = Math.sin(C.yaw), cy = Math.cos(C.yaw);
    const dirX = -sy, dirZ = -cy, rX = cy, rZ = -sy;
    let mx = dirX * f + rX * r, mz = dirZ * f + rZ * r;
    const ml = Math.hypot(mx, mz);
    if (ml > 1e-4) { mx /= ml; mz /= ml; }
    C.vel.x += (mx * speed - C.vel.x) * Math.min(1, dt * 9);
    C.vel.z += (mz * speed - C.vel.z) * Math.min(1, dt * 9);
    const p = { x: C.pos.x + C.vel.x * dt, z: C.pos.z + C.vel.z * dt };
    p.x = Math.max(A.bounds.x0, Math.min(A.bounds.x1, p.x));
    p.z = Math.max(A.bounds.z0, Math.min(A.bounds.z1, p.z));
    if (flying || C.spectate) {
      C.pos.x = p.x; C.pos.z = p.z;
      const vs = flying ? A.fly.speed * 0.7 : speed;
      if (keys.KeyQ) C.pos.y -= vs * dt;
      if (keys.KeyE && !nearEx) C.pos.y += vs * dt;
      if (keys.Space) C.pos.y += vs * dt;
      if (flying) C.pos.y = Math.max(A.fly.minY, Math.min(A.fly.maxY, C.pos.y));
    } else {
      const gNow = C.pos.y - (A.eye || 1.7);
      collide(p, gNow + 0.25, gNow + 1.8);
      const g = XP.groundY(p.x, p.z, gNow);
      C.pos.x = p.x; C.pos.z = p.z;
      const ty = g + (A.eye || 1.7);
      C.pos.y += (ty - C.pos.y) * Math.min(1, dt * (ty < C.pos.y ? 7 : 10));
    }
    camera.position.copy(C.pos);
    camera.rotation.set(C.pitch, C.yaw, 0, 'YXZ');
    C.moving = ml > 0.05; C.running = !!run && C.moving;
  };
  C.teleport = function (x, z, yaw, y) {
    C.pos.set(x, (y !== undefined ? y : XP.groundY(x, z, 99)) + (A.eye || 1.7), z);
    if (yaw !== undefined) C.yaw = yaw;
    C.vel.set(0, 0, 0);
  };

  /* ---------------- eras ---------------- */
  let eraIdx = 0, eraTimer = null;
  function setEra(i, silent) {
    eraIdx = Math.max(0, Math.min((A.eras || []).length - 1, i));
    A.setEra(eraIdx);
    document.querySelectorAll('#timeline button').forEach((b, k) => b.classList.toggle('on', k === eraIdx));
    if (!silent) {
      const card = $('era-card');
      card.querySelector('.ey').textContent = A.eras[eraIdx].year + ' · ' + L(A.eras[eraIdx].title);
      card.querySelector('.et').textContent = L(A.eras[eraIdx].blurb);
      card.classList.add('show');
      clearTimeout(eraTimer);
      eraTimer = setTimeout(() => card.classList.remove('show'), 5200);
    }
  }
  if (A.eras) {
    const tl = $('timeline');
    A.eras.forEach((e, i) => {
      const b = document.createElement('button');
      b.textContent = e.year;
      b.addEventListener('click', ev => { ev.stopPropagation(); setEra(i); });
      tl.appendChild(b);
    });
  }
  XP.setEraIndex = i => setEra(i);

  /* ---------------- ambience (generative, off till toggled) ------ */
  let actx = null, again = null, soundOn = false, stepT = 0, stepGain = null, stepBuf = null;
  function impulse(sec, dec) {
    const rate = actx.sampleRate, len = rate * sec, buf = actx.createBuffer(2, len, rate);
    for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, dec); }
    return buf;
  }
  function startAudio() {
    actx = new (window.AudioContext || window.webkitAudioContext)();
    again = actx.createGain(); again.gain.value = 0;
    const verb = actx.createConvolver(); verb.buffer = impulse(A.ambience && A.ambience.verb || 2.8, 2.8);
    const vg = actx.createGain(); vg.gain.value = 0.7;
    again.connect(verb); verb.connect(vg); vg.connect(actx.destination);
    const dry = actx.createGain(); dry.gain.value = 0.4; again.connect(dry); dry.connect(actx.destination);
    ((A.ambience && A.ambience.freqs) || [[110, 0.04], [110.6, 0.03], [165, 0.02]]).forEach(([f, g], i) => {
      const o = actx.createOscillator(); o.type = i < 2 ? 'sawtooth' : 'sine'; o.frequency.value = f;
      const og = actx.createGain(); og.gain.value = g;
      const filt = actx.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 520;
      o.connect(filt); filt.connect(og); og.connect(again);
      const lfo = actx.createOscillator(); lfo.frequency.value = 0.04 + i * 0.02;
      const lg = actx.createGain(); lg.gain.value = g * 0.45; lfo.connect(lg); lg.connect(og.gain);
      o.start(); lfo.start();
    });
    const noise = actx.createBufferSource(); noise.buffer = impulse(6, 0.0001); noise.loop = true;
    const nf = actx.createBiquadFilter(); nf.type = 'bandpass'; nf.frequency.value = A.ambience && A.ambience.air || 900; nf.Q.value = 0.4;
    const ng = actx.createGain(); ng.gain.value = 0.014;
    noise.connect(nf); nf.connect(ng); ng.connect(again); noise.start();
    stepGain = actx.createGain(); stepGain.gain.value = 0;
    const sf = actx.createBiquadFilter(); sf.type = 'lowpass'; sf.frequency.value = 300;
    stepGain.connect(sf); sf.connect(actx.destination);
    stepBuf = impulse(0.09, 6);
  }
  function setSound(v) {
    soundOn = v;
    if (v && !actx) startAudio();
    if (actx) { actx.resume && actx.resume();
      again.gain.linearRampToValueAtTime(v ? 0.85 : 0, actx.currentTime + 1);
      stepGain.gain.linearRampToValueAtTime(v ? 1 : 0, actx.currentTime + 0.5); }
    $('btn-sound').style.opacity = v ? 1 : 0.45;
  }

  /* ---------------- HUD wiring ---------------- */
  let openEx = null, nearEx = null;
  function showPanel(ex) {
    openEx = ex;
    $('panel-n').textContent = ex.n + ' / ' + A.exhibits.length;
    $('panel-title').textContent = L(ex.title);
    $('panel-sub').textContent = L(ex.sub);
    $('panel-body').textContent = L(ex.body);
    $('panel').classList.add('show');
  }
  function hidePanel() { openEx = null; $('panel').classList.remove('show'); }
  $('panel-close').addEventListener('click', e => { e.stopPropagation(); hidePanel(); });
  function renderList() {
    const ul = $('list-items'); ul.innerHTML = '';
    A.exhibits.forEach(ex => {
      const li = document.createElement('button');
      li.className = 'list-item';
      li.innerHTML = '<span class="ln">' + ex.n + '</span>' + L(ex.title);
      li.addEventListener('click', () => {
        const v = ex.view;
        C.fly = false;
        C.teleport(v[0], v[1], v[2], ex.viewY);
        C.pitch = v[3] || 0;
        if (ex.era !== undefined && A.eras) setEra(ex.era, true);
        $('list').classList.remove('show');
        showPanel(ex);
        if (!XP.touch) lock();
      });
      ul.appendChild(li);
    });
  }
  renderList();
  function onLock(locked) {
    if (!locked && !XP.touch && $('intro').classList.contains('gone')) $('pause').classList.add('show');
    else $('pause').classList.remove('show');
  }
  $('pause').addEventListener('click', () => { $('pause').classList.remove('show'); lock(); });
  $('btn-enter').addEventListener('click', () => { $('intro').classList.add('gone'); lock(); });
  $('btn-help').addEventListener('click', e => { e.stopPropagation(); $('intro').classList.remove('gone'); });
  $('btn-list').addEventListener('click', e => { e.stopPropagation(); $('list').classList.toggle('show'); });
  $('btn-sound').addEventListener('click', e => { e.stopPropagation(); setSound(!soundOn); });
  $('btn-sound').style.opacity = 0.45;
  $('btn-lang').addEventListener('click', e => {
    e.stopPropagation();
    XP.lang = XP.lang === 'en' ? 'gr' : 'en';
    $('btn-lang').textContent = XP.lang === 'en' ? 'ΕΛ' : 'EN';
    renderList(); if (openEx) showPanel(openEx);
  });
  if (A.labels) $('btn-labels').addEventListener('click', e => {
    e.stopPropagation(); XP.labelGroup.visible = !XP.labelGroup.visible;
    $('btn-labels').style.opacity = XP.labelGroup.visible ? 1 : 0.45;
  });
  document.addEventListener('keydown', e => {
    if (e.code === 'Tab') { e.preventDefault(); $('list').classList.toggle('show'); return; }
    keys[e.code] = true;
    if (!(C.enabled || C.spectate)) return;
    if (e.code === 'KeyE') { if (openEx) hidePanel(); else if (nearEx) showPanel(nearEx); }
    if (e.code === 'KeyM') $('map-wrap').classList.toggle('hidden');
    if (e.code === 'KeyF' && A.fly) C.fly = !C.fly;
    if (e.code === 'KeyL' && A.labels) { XP.labelGroup.visible = !XP.labelGroup.visible; }
    if (A.eras && e.code === 'ArrowRight') setEra(eraIdx + 1);
    if (A.eras && e.code === 'ArrowLeft') setEra(eraIdx - 1);
  });
  document.addEventListener('keyup', e => { keys[e.code] = false; });
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  /* ---------------- minimap ---------------- */
  const mapC = $('map');
  function drawMap() {
    const x = mapC.getContext('2d'), W = A.map.w, H = A.map.h;
    x.clearRect(0, 0, W, H);
    x.fillStyle = 'rgba(16,13,8,0.72)'; x.fillRect(0, 0, W, H);
    const m = {
      x: wx => (wx - A.map.x0) / (A.map.x1 - A.map.x0) * W,
      z: wz => (wz - A.map.z0) / (A.map.z1 - A.map.z0) * H,
      ctx: x
    };
    A.map.draw(x, m);
    A.exhibits.forEach(ex => {
      x.fillStyle = (nearEx && nearEx.id === ex.id) ? '#ffe9a8' : '#c9a24a';
      x.beginPath(); x.arc(m.x(ex.at[0]), m.z(ex.at[1]), (nearEx && nearEx.id === ex.id) ? 3.4 : 2.4, 0, 7); x.fill();
    });
    const px = m.x(C.pos.x), pz = m.z(C.pos.z);
    const fx = -Math.sin(C.yaw), fz = -Math.cos(C.yaw);
    x.fillStyle = '#fff3d0';
    x.beginPath();
    x.moveTo(px + fx * 7, pz + fz * 7);
    x.lineTo(px - fz * 3.2 - fx * 3, pz + fx * 3.2 - fz * 3);
    x.lineTo(px + fz * 3.2 - fx * 3, pz - fx * 3.2 - fz * 3);
    x.closePath(); x.fill();
  }

  /* ---------------- shot mode + loop ---------------- */
  const SHOT = !!Q.shot;
  if (SHOT) {
    const p = Q.shot.split(',').map(Number);
    C.spectate = true;
    C.pos.set(p[0] || 0, p[1] || 2, p[2] || 0);
    C.yaw = XP.rad(p[3] || 0); C.pitch = XP.rad(p[4] || 0);
    document.body.classList.add('shot');
    $('intro').style.display = 'none';
  }
  const HUD_ON = SHOT ? Q.hud === '1' : Q.hud !== '0';
  if (!HUD_ON) $('hud').style.display = 'none';
  if (A.eras) setEra(Q.era !== undefined ? +Q.era : (A.startEra || 0), true);
  const clock = new THREE.Clock();
  let frames = 0, mapTick = 0;
  (function loop() {
    requestAnimationFrame(loop);
    const dt = clock.getDelta(), t = clock.elapsedTime;
    C.update(dt);
    if (A.tick) A.tick(t, dt);
    if (soundOn && actx && !C.fly) {
      stepT -= dt;
      if (C.moving && stepT <= 0) {
        stepT = C.running ? 0.34 : 0.52;
        const s = actx.createBufferSource(); s.buffer = stepBuf;
        const g = actx.createGain(); g.gain.value = 0.15;
        s.connect(g); g.connect(stepGain); s.start();
      }
    }
    if (HUD_ON) {
      nearEx = null;
      let bestD = (A.interactR || 3.6) ** 2;
      for (const g of markers) {
        const s = 1 + 0.08 * Math.sin(t * 2.4 + g.position.x);
        g.children[0].scale.set(s, 1, s);
        const dx = g.position.x - C.pos.x, dz = g.position.z - C.pos.z;
        const dy = (g.position.y + 1.2 * mScale) - C.pos.y;
        const d2 = dx * dx + dz * dz + (Math.abs(dy) > (A.fly ? 90 : 2.6) ? 1e9 : 0);
        if (d2 < bestD) { bestD = d2; nearEx = g.userData.ex; }
      }
      const hint = $('hint');
      if (nearEx && !openEx) {
        hint.classList.add('show');
        hint.innerHTML = (XP.touch ? '👆 ' : '<b>E</b> — ') + '<i>' + L(nearEx.title) + '</i>';
        if (XP.touch && !hint.dataset.b) { hint.dataset.b = 1;
          hint.addEventListener('touchstart', ev => { ev.stopPropagation(); if (nearEx) showPanel(nearEx); }); }
      } else hint.classList.remove('show');
      if ((mapTick++ & 3) === 0) drawMap();
    }
    renderer.render(scene, camera);
    frames++;
    if (SHOT && frames === 8) { document.title = 'XP-READY'; window.__XP_READY = true; }
  })();
})();
