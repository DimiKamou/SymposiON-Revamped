/* ============================================================
   Hagia Sophia 537 — lighting.js
   Sky, southern sun with volumetric shafts, and the polykandela
   (the hanging oil-lamp rings Paul the Silentiary describes).
   Two moods: day (liturgy morning) and dusk (the "second sun").
   ============================================================ */
HS.buildLighting = function (scene, world) {
  const D = HS.DIM, M = HS.mats;
  const L = HS.lights = {};

  /* ---------- sky dome ---------- */
  const sky = new THREE.Mesh(new THREE.SphereGeometry(420, 32, 16), M.sky);
  scene.add(sky);

  /* ---------- base lights ---------- */
  L.hemi = new THREE.HemisphereLight(0xcfd8e8, 0x4a3d2a, 0.62);
  scene.add(L.hemi);
  L.sun = new THREE.DirectionalLight(0xffeecb, 2.5);
  L.sun.position.set(60, 130, 95);            // high southern sun, slightly east
  scene.add(L.sun);
  L.bounce = new THREE.DirectionalLight(0xd9c9a8, 0.5);   // warm floor bounce
  L.bounce.position.set(-30, -60, -40);
  scene.add(L.bounce);

  /* interior fills (windows are emissive, so fake their spill) */
  L.domeFill = new THREE.PointLight(0xffe9bd, 700, 90, 1.8);
  L.domeFill.position.set(0, 34, 0);
  scene.add(L.domeFill);
  L.aisleN = new THREE.PointLight(0xf7e6c2, 240, 46, 1.8);
  L.aisleN.position.set(0, 8.5, -23);
  scene.add(L.aisleN);
  L.aisleS = new THREE.PointLight(0xf7e6c2, 240, 46, 1.8);
  L.aisleS.position.set(0, 8.5, 23);
  scene.add(L.aisleS);
  L.eastFill = new THREE.PointLight(0xffe3ad, 420, 60, 1.8);
  L.eastFill.position.set(22, 16, 0);
  scene.add(L.eastFill);
  L.westFill = new THREE.PointLight(0xf3e2c0, 320, 55, 1.8);
  L.westFill.position.set(-22, 14, 0);
  scene.add(L.westFill);
  L.narthexFill = new THREE.PointLight(0xe8dcc0, 160, 40, 1.8);
  L.narthexFill.position.set(-35.3, 8, 0);
  scene.add(L.narthexFill);
  L.exoFill = new THREE.PointLight(0xf0e6ce, 110, 34, 1.8);
  L.exoFill.position.set(-41.9, 5.5, 0);
  scene.add(L.exoFill);
  L.atriumFill = new THREE.PointLight(0xfff0d0, 240, 70, 1.9);
  L.atriumFill.position.set(-66, 14, 0);
  scene.add(L.atriumFill);

  /* ---------- god-ray shafts (day only) ---------- */
  HS.shafts = [];
  const dir = new THREE.Vector3(-0.42, -1, -0.62).normalize();  // from S-E, down to N-W
  for (let i = 0; i < 9; i++) {                 // from the dome ring, south side
    const a = HS.rad(100 + i * 18);
    const from = new THREE.Vector3(Math.cos(a) * 14.4, 41.6, Math.sin(a) * 14.4);
    if (from.z < 2) continue;
    HS.lightShaft(world, from, dir, 34, 0.7, 2.6);
  }
  [[-11.1, 26.5], [-3.7, 26.5], [3.7, 26.5], [11.1, 26.5]].forEach(([x, y]) =>
    HS.lightShaft(world, new THREE.Vector3(x, y + 1.5, 14.8), dir, 26, 0.8, 2.2));
  [[-19.6, 4.6], [-8.4, 4.6], [2.8, 4.6], [14, 4.6]].forEach(([x, y]) =>
    HS.lightShaft(world, new THREE.Vector3(x, y + 1.2, 29.9), dir, 9, 0.7, 1.5));

  /* ---------- polykandela ---------- */
  const lampGroup = new THREE.Group();
  world.add(lampGroup);
  HS.flames = [];
  const flameMat = new THREE.SpriteMaterial({ map: HS.texs.flame, color: 0xffdf9e, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });

  function polykandelon(x, y, z, r, nCups, nChains) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.055, 6, 28).rotateX(Math.PI / 2), M.bronze);
    ring.position.set(x, y, z); lampGroup.add(ring);
    for (let i = 0; i < (nChains || 3); i++) {
      const a = i / (nChains || 3) * Math.PI * 2;
      const top = 12.0 - 0 + (y > 12 ? 28 : 8);   // chain anchor guess
      const chainLen = Math.min(14, Math.max(3, (y > 12 ? 40 : 12.4) - y));
      const ch = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, chainLen, 4), M.bronze);
      ch.position.set(x + Math.cos(a) * r * 0.92, y + chainLen / 2, z + Math.sin(a) * r * 0.92);
      lampGroup.add(ch);
    }
    for (let i = 0; i < nCups; i++) {
      const a = i / nCups * Math.PI * 2;
      const fx = x + Math.cos(a) * r, fz = z + Math.sin(a) * r;
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.028, 0.09, 6), M.bronze);
      cup.position.set(fx, y + 0.02, fz); lampGroup.add(cup);
      const spr = new THREE.Sprite(flameMat);
      spr.scale.set(0.34, 0.42, 1);
      spr.position.set(fx, y + 0.17, fz);
      lampGroup.add(spr);
      HS.flames.push(spr);
    }
  }
  // great ring under the dome + two flanking, rows along the colonnades
  polykandelon(0, 5.6, 0, 3.4, 22, 5);
  polykandelon(-8, 5.4, 0, 1.9, 12, 4);
  polykandelon(16, 5.4, 0, 1.9, 12, 4);
  for (const s of [-1, 1]) {
    for (const x of [-8.24, 0, 8.24]) polykandelon(x, 5.9, s * 13.2, 1.15, 8, 3);
    for (const x of [-22, -11, 0, 11, 22]) polykandelon(x, 4.6, s * 23, 0.95, 7, 3);
  }
  for (const z of [-18, -9, 0, 9, 18]) polykandelon(-35.3, 5.2, z, 0.95, 7, 3);   // narthex
  polykandelon(26.6, 5.2, 0, 1.35, 10, 4);                                        // bema
  // lamp point lights (few, big)
  L.lamps = [];
  [[0, 5.2, 0, 320], [16, 5, 0, 150], [-8, 5, 0, 130], [-35.3, 4.6, 0, 110],
   [0, 4.4, 13.2, 90], [0, 4.4, -13.2, 90], [26.6, 4.8, 0, 120]].forEach(([x, y, z, p]) => {
    const pl = new THREE.PointLight(0xffb45e, p * 0.25, 30, 1.9);
    pl.position.set(x, y, z);
    pl.userData.dayI = p * 0.25; pl.userData.duskI = p;
    scene.add(pl); L.lamps.push(pl);
  });

  /* ---------- day / dusk ---------- */
  HS.setDusk = function (dusk) {
    HS.isDusk = dusk;
    HS.setPanesDusk(dusk);
    if (HS.domeGlowMat) {
      HS.domeGlowMat.map = dusk ? (HS._duskRing || (HS._duskRing = (() => { const t = HS.texs.paneDusk.clone(); t.repeat.set(40, 1); t.needsUpdate = true; return t; })()))
                                : (HS._dayRing || (HS._dayRing = (() => { const t = HS.texs.paneDay.clone(); t.repeat.set(40, 1); t.needsUpdate = true; return t; })()));
      HS.domeGlowMat.needsUpdate = true;
    }
    L.sun.intensity = dusk ? 0.0 : 2.5;
    L.bounce.intensity = dusk ? 0.12 : 0.5;
    L.hemi.intensity = dusk ? 0.16 : 0.62;
    L.aisleN.intensity = L.aisleS.intensity = dusk ? 90 : 240;
    L.aisleN.color.set(dusk ? 0xffb866 : 0xf7e6c2);
    L.aisleS.color.set(dusk ? 0xffb866 : 0xf7e6c2);
    L.hemi.color.set(dusk ? 0x2c3a5c : 0xcfd8e8);
    L.domeFill.intensity = dusk ? 300 : 700;
    L.domeFill.color.set(dusk ? 0xffc069 : 0xffe9bd);
    L.eastFill.intensity = dusk ? 190 : 420;
    L.eastFill.color.set(dusk ? 0xffbe66 : 0xffe3ad);
    L.westFill.intensity = dusk ? 130 : 320;
    L.westFill.color.set(dusk ? 0xffbe72 : 0xf3e2c0);
    L.narthexFill.intensity = dusk ? 90 : 160;
    L.narthexFill.color.set(dusk ? 0xffb866 : 0xe8dcc0);
    L.exoFill.intensity = dusk ? 55 : 110;
    L.exoFill.color.set(dusk ? 0xffb866 : 0xf0e6ce);
    L.atriumFill.intensity = dusk ? 40 : 240;
    L.atriumFill.color.set(dusk ? 0x8fa3cc : 0xfff0d0);
    L.lamps.forEach(pl => { pl.intensity = dusk ? pl.userData.duskI : pl.userData.dayI; });
    HS.shafts.forEach(s => { s.visible = !dusk && HS.shaftsOn !== false; });
    if (HS.scene) {
      HS.scene.fog.color.set(dusk ? 0x1a1610 : 0x39332a);
      HS.scene.fog.density = dusk ? 0.0035 : 0.0022;
    }
    if (HS.renderer) HS.renderer.toneMappingExposure = dusk ? 1.3 : 1.0;
  };

  HS.setLampsVisible = function (on) {
    lampGroup.visible = on;
    L.lamps.forEach(pl => { pl.visible = on; });
  };

  /* flame flicker, called per frame */
  HS.tickFlames = function (t) {
    for (let i = 0; i < HS.flames.length; i++) {
      const f = HS.flames[i];
      const k = 0.30 + 0.06 * Math.sin(t * 9 + i * 1.7) + 0.03 * Math.sin(t * 23 + i * 0.9);
      f.scale.set(k, k * 1.3, 1);
    }
    const lampI = HS.isDusk ? 1 : 0.25;
    for (let i = 0; i < HS.lights.lamps.length; i++) {
      const pl = HS.lights.lamps[i];
      pl.intensity = pl.userData[HS.isDusk ? 'duskI' : 'dayI'] * (1 + 0.07 * Math.sin(t * 11 + i * 2.3));
    }
  };
};
