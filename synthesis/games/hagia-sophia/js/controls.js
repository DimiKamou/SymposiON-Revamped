/* ============================================================
   Hagia Sophia 537 — controls.js
   First-person navigation: pointer-lock mouse-look + WASD/arrows
   (Shift = hurry), touch dual-zone controls on mobile, cylinder/
   box collision with wall sliding, walkable-floor height changes
   (steps, solea, the ambo stairs, galleries via teleport).
   ============================================================ */
HS.Controls = function (camera, dom) {
  const self = this;
  const D = HS.DIM;
  this.yaw = -Math.PI / 2;          // facing +X (east, toward the church)
  this.pitch = 0;
  this.pos = new THREE.Vector3(-85, HS.groundY(-85, 0, 0) + D.eye, 0);
  this.vel = new THREE.Vector3();
  this.enabled = false;             // true while pointer-locked / touching
  this.spectate = false;            // screenshot mode: free camera
  const keys = {};

  /* ---------- pointer lock ---------- */
  this.lock = function () { dom.requestPointerLock && dom.requestPointerLock(); };
  document.addEventListener('pointerlockchange', () => {
    self.enabled = document.pointerLockElement === dom;
    document.body.classList.toggle('locked', self.enabled);
    if (HS.onLockChange) HS.onLockChange(self.enabled);
  });
  document.addEventListener('mousemove', e => {
    if (!self.enabled) return;
    self.yaw -= e.movementX * 0.0021;
    self.pitch -= e.movementY * 0.0021;
    self.pitch = Math.max(-1.45, Math.min(1.45, self.pitch));
  });

  document.addEventListener('keydown', e => {
    if (e.code === 'Escape') return;
    keys[e.code] = true;
    if (HS.onKey && (self.enabled || HS.touchMode)) HS.onKey(e.code);
  });
  document.addEventListener('keyup', e => { keys[e.code] = false; });

  /* ---------- touch (left = move stick, right = look) ---------- */
  const touch = { moveId: null, mx: 0, my: 0, m0: null, lookId: null, l0: null };
  HS.touchMode = false;
  dom.addEventListener('touchstart', e => {
    HS.touchMode = true; self.enabled = true;
    document.body.classList.add('locked');
    for (const t of e.changedTouches) {
      if (t.clientX < innerWidth / 2 && touch.moveId === null) {
        touch.moveId = t.identifier; touch.m0 = [t.clientX, t.clientY];
      } else if (touch.lookId === null) {
        touch.lookId = t.identifier; touch.l0 = [t.clientX, t.clientY];
      }
    }
    if (HS.onLockChange) HS.onLockChange(true);
    e.preventDefault();
  }, { passive: false });
  dom.addEventListener('touchmove', e => {
    for (const t of e.changedTouches) {
      if (t.identifier === touch.moveId) {
        touch.mx = Math.max(-1, Math.min(1, (t.clientX - touch.m0[0]) / 55));
        touch.my = Math.max(-1, Math.min(1, (t.clientY - touch.m0[1]) / 55));
      } else if (t.identifier === touch.lookId) {
        self.yaw -= (t.clientX - touch.l0[0]) * 0.006;
        self.pitch = Math.max(-1.45, Math.min(1.45, self.pitch - (t.clientY - touch.l0[1]) * 0.006));
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

  /* ---------- collision ---------- */
  const PR = 0.42;                   // player radius
  function collide(p, y0, y1) {
    for (let iter = 0; iter < 3; iter++) {
      let pushed = false;
      for (const c of HS.colliders) {
        if (y1 < c.y0 + 0.05 || y0 > c.y1 - 0.05) continue;
        if (c.kind === 'box') {
          const nx = Math.max(c.x0, Math.min(p.x, c.x1));
          const nz = Math.max(c.z0, Math.min(p.z, c.z1));
          const dx = p.x - nx, dz = p.z - nz;
          const d2 = dx * dx + dz * dz;
          if (d2 < PR * PR) {
            if (d2 > 1e-8) {
              const d = Math.sqrt(d2);
              p.x = nx + dx / d * PR; p.z = nz + dz / d * PR;
            } else {
              // inside the box: push out the nearest face
              const L = [p.x - c.x0, c.x1 - p.x, p.z - c.z0, c.z1 - p.z];
              const m = Math.min(...L);
              if (m === L[0]) p.x = c.x0 - PR; else if (m === L[1]) p.x = c.x1 + PR;
              else if (m === L[2]) p.z = c.z0 - PR; else p.z = c.z1 + PR;
            }
            pushed = true;
          }
        } else {
          const dx = p.x - c.x, dz = p.z - c.z;
          const rr = c.r + PR;
          const d2 = dx * dx + dz * dz;
          if (d2 < rr * rr && d2 > 1e-8) {
            const d = Math.sqrt(d2);
            p.x = c.x + dx / d * rr; p.z = c.z + dz / d * rr;
            pushed = true;
          }
        }
      }
      if (!pushed) break;
    }
  }

  /* ---------- per-frame update ---------- */
  this.update = function (dt) {
    dt = Math.min(dt, 0.05);
    let f = 0, r = 0;
    if (self.enabled || self.spectate) {
      f = (keys.KeyW || keys.ArrowUp ? 1 : 0) - (keys.KeyS || keys.ArrowDown ? 1 : 0);
      r = (keys.KeyD || keys.ArrowRight ? 1 : 0) - (keys.KeyA || keys.ArrowLeft ? 1 : 0);
      if (HS.touchMode) { f += -touch.my; r += touch.mx; }
    }
    const run = keys.ShiftLeft || keys.ShiftRight;
    const speed = (run ? 6.4 : 3.1) * (self.spectate ? 2.2 : 1);
    const sy = Math.sin(self.yaw), cy = Math.cos(self.yaw);
    // camera forward on the ground plane = (−sinYaw, −cosYaw); right = fwd × up
    const dirX = -sy, dirZ = -cy;
    const rX = cy, rZ = -sy;
    let mx = dirX * f + rX * r, mz = dirZ * f + rZ * r;
    const ml = Math.hypot(mx, mz);
    if (ml > 1e-4) { mx /= ml; mz /= ml; }
    const target = { x: mx * speed, z: mz * speed };
    self.vel.x += (target.x - self.vel.x) * Math.min(1, dt * 9);
    self.vel.z += (target.z - self.vel.z) * Math.min(1, dt * 9);

    const p = { x: self.pos.x + self.vel.x * dt, z: self.pos.z + self.vel.z * dt };
    if (!self.spectate) {
      const gNow = self.pos.y - D.eye;
      collide(p, gNow + 0.25, gNow + 1.8);
      // world bounds
      p.x = Math.max(-89, Math.min(35.5, p.x));
      p.z = Math.max(-31.5, Math.min(31.5, p.z));
      const g = HS.groundY(p.x, p.z, gNow);
      self.pos.x = p.x; self.pos.z = p.z;
      const targetY = g + D.eye;
      self.pos.y += (targetY - self.pos.y) * Math.min(1, dt * (targetY < self.pos.y ? 7 : 10));
    } else {
      self.pos.x = p.x; self.pos.z = p.z;
      if (keys.KeyQ) self.pos.y -= speed * dt;
      if (keys.KeyE) self.pos.y += speed * dt;
    }

    camera.position.copy(self.pos);
    camera.rotation.set(self.pitch, self.yaw, 0, 'YXZ');
    self.moving = ml > 0.05;
    self.running = !!run && self.moving;
  };

  this.teleport = function (x, z, yaw, y) {
    self.pos.set(x, (y !== undefined ? y : HS.groundY(x, z, y === undefined ? 99 : y)) + D.eye, z);
    if (y !== undefined) self.pos.y = y + D.eye;
    else self.pos.y = HS.groundY(x, z, 99) + D.eye;
    if (yaw !== undefined) self.yaw = yaw;
    self.vel.set(0, 0, 0);
  };
};
