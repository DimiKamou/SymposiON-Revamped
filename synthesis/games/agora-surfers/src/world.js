/* ════════════════════════════════════════════════════════════════
   AGORA SURFERS — world.js
   Endless world: side scenery, clouds, and the content stream
   (coins, obstacles, power-ups) — all pooled & recycled.
════════════════════════════════════════════════════════════════ */
import * as THREE from 'three';
import { G, ACT, rand, choice } from './config.js';
import {
  buildColumn, buildBrokenColumn, buildOlive, buildCypress, buildCypressRow,
  buildCloud, buildTemple, buildPropylaea, buildHerm, buildVergeAmphorae,
  buildVergeStatue, buildVergeStall, buildLantern, buildBirdFlock,
  buildTholos, buildRocks,
  OBSTACLES,
} from './builders-world.js';
import { buildCoin, buildPowerup, PU_TYPES } from './builders-actors.js';
import { QUALITY } from './quality.js';

/* mid-distance meadow dressing (beyond the verge props, before the temples).
   Separate pool keys from the roadside spawns so per-kind scale ranges stay
   consistent when objects are recycled. */
const FAR_KINDS = [
  { key: 'far_cyp',   make: buildCypress,    s: [1.25, 1.6] },
  { key: 'far_cyprow',make: buildCypressRow, s: [1.15, 1.4] },
  { key: 'far_olive', make: buildOlive,      s: [1.3, 1.7] },
  { key: 'far_col',   make: () => buildColumn(6 + Math.random() * 2), s: [1.05, 1.25] },
  { key: 'far_tholos',make: buildTholos,     s: [0.9, 1.15] },
  { key: 'far_rocks', make: buildRocks,      s: [1.0, 1.5] },
];

export class World {
  constructor(scene) {
    this.scene = scene;
    this.pools = {};
    this.scenery = [];
    this.coins = [];
    this.obstacles = [];
    this.powerups = [];
    this.clouds = [];
    this.sceneryFrontier = 0;
    this.contentFrontier = 0;
    this.lastPuDist = 0;
    this.rowsSinceObstacle = 0;
    this.nextGateAt = 120;
    this.time = 0;               // running clock for scenery ticks (flames, birds)

    this._initClouds();
    this._initTemples();
  }

  /* generic pool: objects stay in scene, toggled visible & repositioned */
  _get(key, factory) {
    const p = this.pools[key] || (this.pools[key] = []);
    let o = p.pop();
    if (!o) { o = factory(); this.scene.add(o); }
    o.visible = true;
    return o;
  }
  _recycle(key, o) {
    o.visible = false;
    (this.pools[key] || (this.pools[key] = [])).push(o);
  }

  _initClouds() {
    for (let i = 0; i < 7; i++) {
      const c = buildCloud();
      c.position.set(rand(-60, 60), rand(40, 70), rand(-260, -40));
      c.userData.drift = rand(0.4, 1.1);
      this.scene.add(c);
      this.clouds.push(c);
    }
  }

  _initTemples() {
    this.temples = [];
    for (let i = 0; i < 2; i++) {
      const t = buildTemple();
      t.userData.wz = 80 + i * 160;
      t.userData.side = i % 2 ? 1 : -1;
      t.position.set(t.userData.side * rand(26, 34), 0, 0);
      t.rotation.y = t.userData.side > 0 ? -0.5 : 0.5;
      this.scene.add(t);
      this.temples.push(t);
    }
  }

  reset() {
    for (const arr of [this.coins, this.obstacles, this.powerups, this.scenery]) {
      for (const o of arr) this._recycle(o.userData.poolKey, o);
      arr.length = 0;
    }
    this.sceneryFrontier = 0;
    this.contentFrontier = 28;     // small grace gap before first obstacle
    this.lastPuDist = 0;
    this.rowsSinceObstacle = 0;
    this.nextGateAt = 120;
  }

  /* ── per-frame ─────────────────────────────────────────────── */
  update(distance, speed, dt) {
    this.time += dt;
    // spawn scenery ahead
    while (this.sceneryFrontier < distance + G.DRAW_AHEAD) {
      this._spawnScenery(this.sceneryFrontier);
      this.sceneryFrontier += rand(6, 9);
    }
    // spawn content ahead
    while (this.contentFrontier < distance + G.DRAW_AHEAD) {
      this._planRow(this.contentFrontier, distance);
      this.contentFrontier += G.CHUNK;
    }

    // moving hazards close in faster than the road & their wheels spin
    for (const o of this.obstacles) {
      if (o.userData.moving) {
        o.userData.wz -= (o.userData.zSpeed || 6) * dt;
        if (o.userData.wheels) {
          const spin = (speed + (o.userData.zSpeed || 6)) * dt * 1.9;
          for (const w of o.userData.wheels) w.rotation.x += spin;
        }
      }
    }

    // reposition + recycle
    this._stream(this.scenery, distance);
    this._stream(this.coins, distance);
    this._stream(this.obstacles, distance);
    this._stream(this.powerups, distance);

    // living scenery: lantern sway, brazier flames, bird flocks
    for (const o of this.scenery) {
      if (o.userData.tick) o.userData.tick(dt, this.time);
    }

    // distant temples recycle slowly
    for (const t of this.temples) {
      t.position.z = distance - t.userData.wz;
      if (t.position.z > 40) { t.userData.wz += 320; t.userData.side *= -1; t.position.x = t.userData.side * rand(26, 34); t.rotation.y = t.userData.side > 0 ? -0.5 : 0.5; }
    }

    // clouds drift sideways + recycle in z with the run
    for (const c of this.clouds) {
      c.position.x += c.userData.drift * dt;
      c.position.z += speed * dt * 0.25;
      if (c.position.x > 70) c.position.x = -70;
      if (c.position.z > 30) { c.position.z = rand(-280, -120); c.position.x = rand(-60, 60); }
    }
  }

  _stream(arr, distance) {
    for (let i = arr.length - 1; i >= 0; i--) {
      const o = arr[i];
      o.position.z = distance - o.userData.wz;
      if (o.position.z > 14) {
        this._recycle(o.userData.poolKey, o);
        arr.splice(i, 1);
      }
    }
  }

  _spawnScenery(wz) {
    // monumental propylaea gate spanning the road every few hundred metres
    if (wz >= this.nextGateAt) {
      this.nextGateAt = wz + rand(240, 400);
      const gate = this._get('gate', buildPropylaea);
      gate.userData.poolKey = 'gate';
      gate.userData.wz = wz + 3;
      gate.position.set(0, 0, distanceless(wz));
      gate.rotation.y = 0;
      this.scenery.push(gate);
    }
    // occasional swift flock crossing the sky
    if (Math.random() < 0.10) this._spawnFlock(wz + rand(-4, 4));

    for (const side of [-1, 1]) {
      const r = Math.random();
      let key, factory, near = false, faceRoad = false, far = false;
      if      (r < 0.30) { key = 'col'; factory = () => buildColumn(rand(4.5, 6.5)); }
      else if (r < 0.42) { key = 'broken'; factory = buildBrokenColumn; }
      else if (r < 0.52) { key = 'herm'; factory = buildHerm; near = true; faceRoad = true; }
      else if (r < 0.60) { key = 'pots'; factory = buildVergeAmphorae; near = true; }
      else if (r < 0.68) { key = 'statue'; factory = buildVergeStatue; near = true; faceRoad = true; }
      else if (r < 0.75) { key = 'stall'; factory = buildVergeStall; faceRoad = true; }
      else if (r < 0.81) { key = 'lantern'; factory = buildLantern; near = true; }
      else if (r < 0.91) { key = 'olive'; factory = buildOlive; }
      else if (r < 0.96) { key = 'cypress'; factory = buildCypress; }
      else { key = 'cyprow'; factory = buildCypressRow; far = true; }
      const o = this._get(key, factory);
      o.userData.poolKey = key;
      o.userData.wz = wz;
      const dist = key === 'stall' ? rand(7.2, 8.0)
        : far ? rand(9.0, 11.5)
        : near ? rand(6.1, 7.4) : rand(6.6, 9.5);
      o.position.set(side * dist, 0, distanceless(wz));
      // road-facing props look INTO the runway; lanterns hang their lamp
      // over the verge toward the road; the rest tumble freely.
      o.rotation.y = faceRoad ? (side > 0 ? -Math.PI / 2 : Math.PI / 2) + rand(-0.25, 0.25)
        : key === 'lantern' ? (side > 0 ? Math.PI : 0)
        : key === 'cyprow' ? rand(-0.2, 0.2)
        : rand(0, Math.PI * 2);
      this.scenery.push(o);

      // mid-distance meadow band — groves, shrines and rocks that fill the
      // empty green between the verge and the horizon temples. Density is
      // trimmed on weak devices to protect the frame budget.
      if (Math.random() < (QUALITY.weak ? 0.26 : 0.5)) {
        const kind = choice(FAR_KINDS);
        const f = this._get(kind.key, kind.make);
        f.userData.poolKey = kind.key;
        f.userData.wz = wz + rand(-3, 3);
        f.scale.setScalar(rand(kind.s[0], kind.s[1]));
        f.position.set(side * rand(13.5, 25), 0, distanceless(wz));
        f.rotation.y = rand(0, Math.PI * 2);
        this.scenery.push(f);
      }
    }
  }

  /* swifts wheeling high across the road — cheap life in the sky */
  _spawnFlock(wz) {
    const o = this._get('flock', buildBirdFlock);
    o.userData.poolKey = 'flock';
    o.userData.wz = wz;
    const u = o.userData;
    u.baseY = rand(7, 11.5);
    u.driftX = (Math.random() < 0.5 ? -1 : 1) * rand(0.8, 1.8);
    o.position.set(rand(-16, 16), u.baseY, distanceless(wz));
    o.rotation.y = u.driftX > 0 ? -0.35 : 0.35;
    if (!u.tick) {
      u.tick = (dt, t) => {
        o.position.x += u.driftX * dt;
        o.position.y = u.baseY + Math.sin(t * 1.1 + u.baseY) * 0.4;
        u.wz -= dt * 2.2;                       // they glide gently toward you
        for (const b of u.birds) {
          const w = Math.sin(t * b.spd + b.ph) * 0.62;
          b.wl.rotation.z = w; b.wr.rotation.z = -w;
          b.grp.position.y += Math.cos(t * b.spd + b.ph) * dt * 0.5;   // wing-beat bounce
        }
      };
    }
    this.scenery.push(o);
  }

  _addCoin(wz, lane, y = 1.1) {
    const o = this._get('coin', buildCoin);
    o.userData.poolKey = 'coin';
    o.userData.wz = wz;
    o.userData.lane = lane;
    o.userData.collected = false;
    o.position.set(G.LANE_X[lane], y, 0);
    o.scale.setScalar(1);
    this.coins.push(o);
  }

  _addObstacle(wz, lane, factory, key) {
    const o = this._get(key, factory);
    o.userData.poolKey = key;
    o.userData.wz = wz;
    o.userData.lane = lane;
    o.userData.hit = false;
    o.userData.scored = false;
    o.userData.didCrash = false;
    o.userData.passFx = false;
    if (o.userData.action === undefined) {
      const sample = factory();
      o.userData.action = sample.userData.action;
      o.userData.clearH = sample.userData.clearH;
      o.userData.gapH = sample.userData.gapH;
    }
    o.position.set(G.LANE_X[lane], 0, 0);
    this.obstacles.push(o);
  }

  _addPowerup(wz, lane, type) {
    const o = this._get('pu_' + type, () => buildPowerup(type));
    o.userData.poolKey = 'pu_' + type;
    o.userData.wz = wz;
    o.userData.lane = lane;
    o.userData.puType = type;
    o.userData.collected = false;
    o.position.set(G.LANE_X[lane], 1.4, 0);
    this.powerups.push(o);
  }

  /* ── decide what populates a row ───────────────────────────── */
  _planRow(wz, distance) {
    const t = Math.min(1, distance / 1400);          // 0→1 difficulty ramp
    const lanes = [0, 1, 2];

    // power-up? (spaced out)
    if (distance - this.lastPuDist > rand(220, 360) && Math.random() < 0.6) {
      this.lastPuDist = distance;
      const type = choice(PU_TYPES);
      const lane = (Math.random() * 3) | 0;
      this._addPowerup(wz, lane, type);
      for (let k = 1; k <= 3; k++) this._addCoin(wz - k * 2.4, lane);
      return;
    }

    // obstacle row?
    const obChance = 0.35 + t * 0.45;
    if (this.rowsSinceObstacle >= 1 && Math.random() < obChance) {
      this.rowsSinceObstacle = 0;
      const blocked = 1 + (Math.random() < t * 0.7 ? 1 : 0);
      const shuffled = lanes.slice().sort(() => Math.random() - 0.5);
      const used = shuffled.slice(0, blocked);
      const freeLane = shuffled[shuffled.length - 1];
      for (const lane of used) {
        const need = choice([ACT.JUMP, ACT.SLIDE, ACT.DODGE]);
        const list = OBSTACLES[need];
        const factory = choice(list);
        const key = 'ob_' + factory.name;
        this._addObstacle(wz, lane, factory, key);
        if (need === ACT.JUMP) {
          for (let k = -1; k <= 1; k++) this._addCoin(wz + k * 2.2, lane, 2.0 + (1 - Math.abs(k)) * 0.9);
        }
      }
      if (Math.random() < 0.7) for (let k = -1; k <= 1; k++) this._addCoin(wz + k * 2.2, freeLane);
      return;
    }

    this.rowsSinceObstacle++;
    const lane = (Math.random() * 3) | 0;
    const n = 3 + (Math.random() * 3 | 0);
    // Subway-Surfers coin grammar: straight runs, floating arcs, lane weaves
    const pat = Math.random();
    if (pat < 0.3) {                                     // arc — jump through it
      for (let k = 0; k < n; k++) {
        const y = 1.0 + Math.sin((k / (n - 1)) * Math.PI) * 1.5;
        this._addCoin(wz + k * 2.3 - (n - 1) * 1.15, lane, y);
      }
    } else if (pat < 0.45 && n >= 4) {                   // weave into a neighbour lane
      const lane2 = lane === 1 ? (Math.random() < 0.5 ? 0 : 2) : 1;
      for (let k = 0; k < n; k++) {
        this._addCoin(wz + k * 2.3 - (n - 1) * 1.15, k < n / 2 ? lane : lane2);
      }
    } else {
      for (let k = 0; k < n; k++) this._addCoin(wz + k * 2.3 - (n - 1) * 1.15, lane);
    }
  }

  collectCoin(o) {
    o.userData.collected = true;
    const idx = this.coins.indexOf(o);
    if (idx >= 0) { this.coins.splice(idx, 1); this._recycle('coin', o); }
  }
  collectPowerup(o) {
    o.userData.collected = true;
    const idx = this.powerups.indexOf(o);
    if (idx >= 0) { this.powerups.splice(idx, 1); this._recycle(o.userData.poolKey, o); }
  }
}

/* spawn just out of view; will be repositioned next frame anyway */
function distanceless() { return -G.DRAW_AHEAD; }
