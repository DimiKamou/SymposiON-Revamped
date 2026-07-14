/* ============================================================
   Hagia Sophia 537 — materials.js
   Every surface is procedural (canvas-painted): gold smalti
   mosaic, Proconnesian / verd antique / porphyry marbles,
   banded brick, lead roofing, sky. No external assets.
   ============================================================ */
(function () {
  const M = HS.mats = {};
  const T = HS.texs = {};

  function canvas(w, h) { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
  function tex(c, repX, repY, srgb) {
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    if (repX) t.repeat.set(repX, repY || repX);
    if (srgb !== false) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }

  /* ---------- gold smalti mosaic ---------- */
  function goldMosaicCanvas(size, cell, crossy) {
    const c = canvas(size, size), x = c.getContext('2d'), rnd = HS.rng(7);
    x.fillStyle = '#6b4f17'; x.fillRect(0, 0, size, size);      // setting-bed grout
    const n = size / cell;
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) {
      const h = 40 + rnd() * 12;                                 // gold hues
      const s = 52 + rnd() * 28;
      let l = 34 + rnd() * 30;
      if (rnd() < 0.045) l += 22;                                // sparkling tesserae
      x.fillStyle = `hsl(${h},${s}%,${l}%)`;
      const jx = (rnd() - 0.5) * 1.6, jy = (rnd() - 0.5) * 1.6;
      x.fillRect(i * cell + jx + 0.6, j * cell + jy + 0.6, cell - 1.2, cell - 1.2);
    }
    // large-scale sheen clouds
    const g = x.createRadialGradient(size * .3, size * .3, 10, size * .5, size * .5, size * .8);
    g.addColorStop(0, 'rgba(255,240,190,0.16)'); g.addColorStop(1, 'rgba(70,45,0,0.18)');
    x.fillStyle = g; x.fillRect(0, 0, size, size);
    if (crossy) {  // sparse silver-blue crosses, as in the Justinianic vaults
      x.strokeStyle = 'rgba(226,236,244,0.45)'; x.lineWidth = cell * 0.55;
      for (let k = 0; k < 3; k++) {
        const cx = (0.18 + rnd() * 0.64) * size, cy = (0.18 + rnd() * 0.64) * size, a = cell * 3.2;
        x.beginPath(); x.moveTo(cx - a, cy); x.lineTo(cx + a, cy);
        x.moveTo(cx, cy - a); x.lineTo(cx, cy + a); x.stroke();
      }
    }
    return c;
  }
  T.gold = tex(goldMosaicCanvas(512, 10, false), 3, 3);
  T.goldCross = tex(goldMosaicCanvas(768, 11, true), 2, 2);

  /* Dome interior: gold with 40 radial rib lines + rim ornament.
     Equirect UV on the sphere cap → vertical stripes = meridians. */
  (function () {
    const c = canvas(2048, 512), x = c.getContext('2d');
    x.drawImage(goldMosaicCanvas(512, 9, false), 0, 0, 2048, 512);
    x.fillStyle = 'rgba(94,66,16,0.5)';
    for (let i = 0; i < 40; i++) x.fillRect(i * 51.2 - 2, 0, 4, 512);
    x.fillStyle = 'rgba(255,246,214,0.10)';
    for (let i = 0; i < 40; i++) x.fillRect(i * 51.2 + 8, 0, 18, 512);
    // rim band near the windows (bottom of cap = v≈1)
    x.fillStyle = 'rgba(46,84,88,0.85)'; x.fillRect(0, 484, 2048, 12);
    x.fillStyle = 'rgba(233,220,180,0.9)'; x.fillRect(0, 478, 2048, 5);
    T.domeGold = tex(c, 1, 1);
  })();

  /* ---------- marbles ---------- */
  function veins(x, size, col, n, wMax, drift, rnd) {
    for (let v = 0; v < n; v++) {
      x.strokeStyle = col; x.lineWidth = 0.5 + rnd() * wMax;
      x.globalAlpha = 0.12 + rnd() * 0.3;
      let px = rnd() * size, py = rnd() * size;
      x.beginPath(); x.moveTo(px, py);
      for (let s = 0; s < 26; s++) {
        px += (rnd() - 0.35) * drift; py += (rnd() - 0.5) * drift * 0.9;
        x.lineTo((px + size) % size, (py + size) % size); // cheap wrap
      }
      x.stroke(); x.globalAlpha = 1;
    }
  }
  /* Proconnesian: pale blue-grey with soft dark banding */
  (function () {
    const s = 512, c = canvas(s, s), x = c.getContext('2d'), rnd = HS.rng(21);
    x.fillStyle = '#c9cdd1'; x.fillRect(0, 0, s, s);
    for (let b = 0; b < 5; b++) {
      x.fillStyle = `rgba(112,122,134,${0.03 + rnd() * 0.05})`;
      const y = rnd() * s; x.fillRect(0, y, s, 12 + rnd() * 46);
    }
    veins(x, s, '#7a838e', 22, 1.4, 34, rnd);
    veins(x, s, '#eef1f3', 14, 1.1, 40, rnd);
    T.proc = tex(c, 2, 2);
  })();
  /* Book-matched revetment: mirrored slab + fillet frame */
  (function () {
    const s = 512, c = canvas(s, s), x = c.getContext('2d'), rnd = HS.rng(33);
    const half = canvas(s / 2, s), hx = half.getContext('2d');
    hx.fillStyle = '#c6cbd2'; hx.fillRect(0, 0, s / 2, s);
    for (let v = 0; v < 22; v++) {          // diagonal feathered veining
      hx.strokeStyle = ['#78818d', '#59616c', '#9aa3ac'][v % 3];
      hx.globalAlpha = 0.16 + rnd() * 0.3; hx.lineWidth = 1 + rnd() * 5;
      hx.beginPath();
      let px = -20, py = rnd() * s * 1.3 - s * 0.2;
      hx.moveTo(px, py);
      for (let t = 0; t < 9; t++) { px += s / 14; py += 24 + (rnd() - 0.4) * 60; hx.lineTo(px, py); }
      hx.stroke();
    }
    hx.globalAlpha = 1;
    x.drawImage(half, 0, 0);
    x.save(); x.scale(-1, 1); x.drawImage(half, -s, 0); x.restore();
    x.strokeStyle = '#3f4750'; x.lineWidth = 7; x.strokeRect(3, 3, s - 6, s - 6);   // dark fillet
    x.strokeStyle = '#d8cfa8'; x.lineWidth = 3; x.strokeRect(10, 10, s - 20, s - 20); // pale fillet
    T.bookmatch = tex(c);
    T.bookmatch.repeat.set(1, 1);
  })();
  /* Verd antique — Thessalian green */
  (function () {
    const s = 512, c = canvas(s, s), x = c.getContext('2d'), rnd = HS.rng(55);
    x.fillStyle = '#2c4f3e'; x.fillRect(0, 0, s, s);
    for (let b = 0; b < 900; b++) {
      x.fillStyle = rnd() < 0.5 ? 'rgba(205,224,208,0.20)' : 'rgba(16,32,24,0.25)';
      const r = 2 + rnd() * 9;
      x.beginPath(); x.arc(rnd() * s, rnd() * s, r, 0, 7); x.fill();
    }
    veins(x, s, '#d9e8da', 20, 1.6, 30, rnd);
    T.verd = tex(c, 1.2, 1.2);
  })();
  /* Imperial porphyry — purple with white flecks */
  (function () {
    const s = 512, c = canvas(s, s), x = c.getContext('2d'), rnd = HS.rng(77);
    x.fillStyle = '#59303f'; x.fillRect(0, 0, s, s);
    for (let b = 0; b < 2600; b++) {
      x.fillStyle = rnd() < 0.82 ? 'rgba(233,214,214,0.55)' : 'rgba(40,16,24,0.5)';
      const r = 0.6 + rnd() * 1.7;
      x.beginPath(); x.arc(rnd() * s, rnd() * s, r, 0, 7); x.fill();
    }
    T.porphyry = tex(c, 1.5, 1.5);
  })();
  /* Carved capital — white marble with dark "drilled" acanthus lace */
  (function () {
    const s = 256, c = canvas(s, s), x = c.getContext('2d'), rnd = HS.rng(99);
    x.fillStyle = '#e6e3da'; x.fillRect(0, 0, s, s);
    for (let i = 0; i < 850; i++) {
      const row = Math.floor(rnd() * 4), y = 20 + row * 58 + rnd() * 36;
      x.fillStyle = `rgba(70,64,52,${0.35 + rnd() * 0.45})`;
      const r = 1.2 + rnd() * 3.4;
      x.beginPath(); x.arc(rnd() * s, y, r, 0, 7); x.fill();
    }
    x.fillStyle = 'rgba(90,82,66,0.5)';
    for (let i = 0; i < 16; i++) x.fillRect(i * 16 + 4, 6, 2.5, s - 12);
    T.capital = tex(c, 1, 1);
  })();

  /* ---------- the great floor ---------- */
  (function () {
    // World span it will be mapped to: x −33…36 (69 m), z −31…31 (62 m)
    const W = 2048, H = 1820, c = canvas(W, H), x = c.getContext('2d'), rnd = HS.rng(3);
    const mpx = 69 / W;                             // metres per pixel
    x.fillStyle = '#c3c6c9'; x.fillRect(0, 0, W, H);
    x.fillStyle = '#8f959b'; x.fillRect(0, 0, W, H);              // joints
    const slab = 2.9 / mpx;
    for (let i = 0; i < W / slab + 1; i++) for (let j = 0; j < H / slab + 1; j++) {
      const l = 56 + rnd() * 15;
      x.fillStyle = `hsl(${205 + rnd() * 14},${6 + rnd() * 7}%,${l}%)`;
      x.fillRect(i * slab + 1.5, j * slab + 1.5, slab - 3, slab - 3);
      if (rnd() < 0.7) {
        x.strokeStyle = 'rgba(84,94,106,0.5)'; x.lineWidth = 1 + rnd() * 2.5;
        x.beginPath(); x.moveTo(i * slab + rnd() * slab, j * slab);
        x.lineTo(i * slab + rnd() * slab, j * slab + slab); x.stroke();
      }
    }
    // Thessalian green "rivers" crossing the nave (Paul the Silentiary's
    // four bands), only across the nave width (z −15.5…15.5)
    const z2py = zz => (zz + 31) / 62 * H, x2px = xx => (xx + 33) / 69 * W;
    const bandXs = [-9.5, -1.5, 6.5, 14.5];
    x.fillStyle = '#2e5242';
    bandXs.forEach(bx => x.fillRect(x2px(bx), z2py(-15.5), 1.4 / mpx, z2py(15.5) - z2py(-15.5)));
    x.fillStyle = 'rgba(210,228,212,0.25)';
    bandXs.forEach(bx => { for (let k = 0; k < 60; k++) x.fillRect(x2px(bx) + rnd() * 1.4 / mpx, z2py(-15.5) + rnd() * (H * 0.5), 2, 5 + rnd() * 12); });
    T.floor = tex(c); T.floor.repeat.set(1, 1);
  })();

  /* opus sectile for bema / solea platforms */
  (function () {
    const s = 512, c = canvas(s, s), x = c.getContext('2d'), rnd = HS.rng(41);
    x.fillStyle = '#b9b3a4'; x.fillRect(0, 0, s, s);
    const cols = ['#5b2f40', '#2e5242', '#a4906a', '#c9cdd1'];
    const q = s / 8;
    for (let i = 0; i < 8; i++) for (let j = 0; j < 8; j++) {
      x.fillStyle = cols[(i + j) % 4];
      x.save(); x.translate(i * q + q / 2, j * q + q / 2); x.rotate(Math.PI / 4);
      x.fillRect(-q * 0.33, -q * 0.33, q * 0.66, q * 0.66); x.restore();
      x.strokeStyle = '#8d8674'; x.strokeRect(i * q, j * q, q, q);
    }
    T.sectile = tex(c, 3, 3);
  })();

  /* parapet slabs with carved roundels */
  (function () {
    const c = canvas(512, 128), x = c.getContext('2d');
    x.fillStyle = '#d3d5d8'; x.fillRect(0, 0, 512, 128);
    for (let i = 0; i < 4; i++) {
      const cx = 64 + i * 128;
      x.strokeStyle = '#8b929c'; x.lineWidth = 5;
      x.strokeRect(cx - 52, 14, 104, 100);
      x.beginPath(); x.arc(cx, 64, 34, 0, 7); x.stroke();
      x.beginPath(); x.moveTo(cx - 24, 64); x.lineTo(cx + 24, 64);
      x.moveTo(cx, 40); x.lineTo(cx, 88); x.stroke();
    }
    T.parapet = tex(c, 6, 1);
  })();

  /* ---------- banded Byzantine brick (exterior) ---------- */
  (function () {
    const s = 512, c = canvas(s, s), x = c.getContext('2d'), rnd = HS.rng(61);
    x.fillStyle = '#cbb89a'; x.fillRect(0, 0, s, s);          // mortar
    const course = 14;
    for (let j = 0; j < s / course; j++) {
      const stoneBand = (j % 9) < 3;                            // ashlar bands
      for (let i = 0; i < 10; i++) {
        const w = s / (stoneBand ? 5 : 10);
        x.fillStyle = stoneBand
          ? `hsl(38,${18 + rnd() * 10}%,${68 + rnd() * 8}%)`
          : `hsl(${12 + rnd() * 10},${38 + rnd() * 18}%,${38 + rnd() * 14}%)`;
        x.fillRect(i * w + ((j % 2) * w / 2) % s, j * course + 1.5, w - 3, course - 3);
      }
    }
    T.brick = tex(c, 6, 6);
  })();

  /* lead roofing */
  (function () {
    const s = 256, c = canvas(s, s), x = c.getContext('2d'), rnd = HS.rng(15);
    x.fillStyle = '#8d939b'; x.fillRect(0, 0, s, s);
    for (let i = 0; i < 8; i++) {
      x.fillStyle = `rgba(255,255,255,${0.05 + rnd() * 0.06})`;
      x.fillRect(0, i * 32, s, 15);
      x.fillStyle = 'rgba(40,44,52,0.35)'; x.fillRect(0, i * 32 + 30, s, 2.5);
    }
    T.lead = tex(c, 4, 4);
  })();

  /* bronze door leaf with relief panels */
  (function () {
    const c = canvas(256, 512), x = c.getContext('2d');
    x.fillStyle = '#4c3a1c'; x.fillRect(0, 0, 256, 512);
    for (let j = 0; j < 4; j++) for (let i = 0; i < 2; i++) {
      x.strokeStyle = '#8a6f33'; x.lineWidth = 8;
      x.strokeRect(20 + i * 118, 22 + j * 122, 98, 102);
      x.strokeStyle = '#2b2010'; x.lineWidth = 3;
      x.strokeRect(34 + i * 118, 36 + j * 122, 70, 74);
      x.beginPath(); x.arc(69 + i * 118, 73 + j * 122, 17, 0, 7); x.stroke();
    }
    T.bronzeDoor = tex(c, 1, 1);
  })();

  /* ---------- sky (day + dusk) ---------- */
  function skyCanvas(dusk) {
    const c = canvas(1024, 512), x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 512);
    if (!dusk) {
      g.addColorStop(0, '#4d82c4'); g.addColorStop(0.55, '#8fb6dd');
      g.addColorStop(0.82, '#e8d9b8'); g.addColorStop(1, '#d9c39a');
    } else {
      g.addColorStop(0, '#111a33'); g.addColorStop(0.6, '#2c3560');
      g.addColorStop(0.85, '#8a4a3a'); g.addColorStop(1, '#c07a3c');
    }
    x.fillStyle = g; x.fillRect(0, 0, 1024, 512);
    if (!dusk) {  // sun to the south-west, high
      const s = x.createRadialGradient(300, 150, 4, 300, 150, 90);
      s.addColorStop(0, 'rgba(255,252,238,1)'); s.addColorStop(0.12, 'rgba(255,244,200,0.9)');
      s.addColorStop(1, 'rgba(255,244,200,0)');
      x.fillStyle = s; x.fillRect(0, 0, 1024, 512);
    } else {
      const rnd = HS.rng(9);
      x.fillStyle = '#fff';
      for (let i = 0; i < 140; i++) x.fillRect(rnd() * 1024, rnd() * 300, 1.4, 1.4);
    }
    return c;
  }
  T.skyDay = tex(skyCanvas(false)); T.skyDusk = tex(skyCanvas(true));

  /* window pane glow (day / dusk) */
  function paneCanvas(dusk) {
    const c = canvas(128, 192), x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 192);
    if (!dusk) { g.addColorStop(0, '#f6f9ff'); g.addColorStop(0.7, '#fff5d9'); g.addColorStop(1, '#ffeebc'); }
    else { g.addColorStop(0, '#25335e'); g.addColorStop(1, '#101a38'); }
    x.fillStyle = g; x.fillRect(0, 0, 128, 192);
    // slender marble grille bars
    x.fillStyle = dusk ? 'rgba(8,10,18,0.8)' : 'rgba(150,140,116,0.5)';
    for (let i = 0; i < 4; i++) x.fillRect(20 + i * 28, 0, 2.5, 192);
    for (let j = 0; j < 6; j++) x.fillRect(0, 16 + j * 30, 128, 2.5);
    return c;
  }
  T.paneDay = tex(paneCanvas(false)); T.paneDusk = tex(paneCanvas(true));

  /* soft plain glow (for the big light bands: dome ring, apse, semidome) */
  function glowCanvas(dusk) {
    const c = canvas(64, 128), x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 128);
    if (!dusk) { g.addColorStop(0, '#fdfaef'); g.addColorStop(0.6, '#ffefc6'); g.addColorStop(1, '#ffe3a4'); }
    else { g.addColorStop(0, '#2b3a68'); g.addColorStop(1, '#121c3d'); }
    x.fillStyle = g; x.fillRect(0, 0, 64, 128);
    return c;
  }
  T.glowDay = tex(glowCanvas(false)); T.glowDusk = tex(glowCanvas(true));

  /* environment reflection (interior glow) for the metals */
  (function () {
    const c = canvas(256, 128), x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 128);
    g.addColorStop(0, '#c8a44e'); g.addColorStop(0.5, '#6b5322'); g.addColorStop(1, '#242017');
    x.fillStyle = g; x.fillRect(0, 0, 256, 128);
    x.fillStyle = 'rgba(255,246,220,0.9)';
    for (let i = 0; i < 12; i++) x.fillRect(i * 22 + 4, 26 + (i % 3) * 12, 9, 16);
    const t = new THREE.CanvasTexture(c);
    t.mapping = THREE.EquirectangularReflectionMapping;
    t.colorSpace = THREE.SRGBColorSpace;
    T.envSrc = t;
  })();

  /* flame sprite */
  (function () {
    const c = canvas(64, 64), x = c.getContext('2d');
    const g = x.createRadialGradient(32, 34, 2, 32, 34, 30);
    g.addColorStop(0, 'rgba(255,244,205,1)'); g.addColorStop(0.28, 'rgba(255,196,92,0.85)');
    g.addColorStop(0.65, 'rgba(224,112,32,0.28)'); g.addColorStop(1, 'rgba(180,60,10,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    T.flame = tex(c);
  })();

  /* ---------- materials ---------- */
  const DS = THREE.DoubleSide;
  M.gold       = new THREE.MeshStandardMaterial({ map: T.gold, color: 0xdfc07a, metalness: 0.88, roughness: 0.34, side: DS, emissive: 0x120b02 });
  M.goldCross  = new THREE.MeshStandardMaterial({ map: T.goldCross, color: 0xdfc07a, metalness: 0.88, roughness: 0.36, side: DS, emissive: 0x120b02 });
  M.domeGold   = new THREE.MeshStandardMaterial({ map: T.domeGold, color: 0xe2c684, metalness: 0.86, roughness: 0.33, side: DS, emissive: 0x161006 });
  M.proc       = new THREE.MeshStandardMaterial({ map: T.proc, color: 0xffffff, metalness: 0.04, roughness: 0.5, side: DS });
  M.bookmatch  = new THREE.MeshStandardMaterial({ map: T.bookmatch, color: 0xffffff, metalness: 0.06, roughness: 0.42, side: DS });
  M.verd       = new THREE.MeshStandardMaterial({ map: T.verd, color: 0xffffff, metalness: 0.12, roughness: 0.38 });
  M.porphyry   = new THREE.MeshStandardMaterial({ map: T.porphyry, color: 0xffffff, metalness: 0.1, roughness: 0.4 });
  M.capital    = new THREE.MeshStandardMaterial({ map: T.capital, color: 0xffffff, metalness: 0.05, roughness: 0.6 });
  M.floor      = new THREE.MeshStandardMaterial({ map: T.floor, color: 0xe2e2e2, metalness: 0.06, roughness: 0.5 });
  M.sectile    = new THREE.MeshStandardMaterial({ map: T.sectile, color: 0xffffff, metalness: 0.06, roughness: 0.4 });
  M.parapet    = new THREE.MeshStandardMaterial({ map: T.parapet, color: 0xffffff, metalness: 0.04, roughness: 0.55, side: DS });
  M.silver     = new THREE.MeshStandardMaterial({ color: 0xc9cfd6, metalness: 0.95, roughness: 0.26 });
  M.bronze     = new THREE.MeshStandardMaterial({ color: 0x74562a, metalness: 0.9, roughness: 0.42 });
  M.bronzeDoor = new THREE.MeshStandardMaterial({ map: T.bronzeDoor, color: 0xffffff, metalness: 0.85, roughness: 0.5, side: DS });
  M.brick      = new THREE.MeshStandardMaterial({ map: T.brick, color: 0xffffff, metalness: 0, roughness: 0.9, side: DS });
  M.lead       = new THREE.MeshStandardMaterial({ map: T.lead, color: 0xbfc6cf, metalness: 0.25, roughness: 0.5, side: DS });
  M.white      = new THREE.MeshStandardMaterial({ color: 0xe8e4d8, metalness: 0.02, roughness: 0.6, side: DS });
  M.pane       = new THREE.MeshBasicMaterial({ map: T.paneDay, side: DS, fog: false });
  M.glow       = new THREE.MeshBasicMaterial({ map: T.glowDay, side: DS, fog: false });
  M.sky        = new THREE.MeshBasicMaterial({ map: T.skyDay, side: THREE.BackSide, fog: false });
  M.water      = new THREE.MeshStandardMaterial({ color: 0x3d6d7d, metalness: 0.4, roughness: 0.12 });
  M.shaft      = new THREE.MeshBasicMaterial({ color: 0xffeec4, transparent: true, opacity: 0.055, blending: THREE.AdditiveBlending, depthWrite: false, side: DS, fog: false });
  M.marker     = new THREE.MeshBasicMaterial({ color: 0xd9b45c, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false, side: DS, fog: false });

  HS.applyEnv = function (scene, renderer) {
    const pm = new THREE.PMREMGenerator(renderer);
    const env = pm.fromEquirectangular(T.envSrc).texture;
    scene.environment = env;
    scene.environmentIntensity = 0.5;   // r160+: global env light scale
  };

  /* day/dusk swaps used by lighting.js */
  HS.setPanesDusk = function (dusk) {
    M.pane.map = dusk ? T.paneDusk : T.paneDay;
    M.pane.needsUpdate = true;
    M.glow.map = dusk ? T.glowDusk : T.glowDay;
    M.glow.needsUpdate = true;
    M.sky.map = dusk ? T.skyDusk : T.skyDay;
    M.sky.needsUpdate = true;
  };
})();
