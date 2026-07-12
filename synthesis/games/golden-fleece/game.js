/* ══════════════════ ΧΡΥΣΟΜΑΛΛΟΝ ΔΕΡΑΣ — engine ══════════════════
   Gold Quest reimagined as the voyage of the Argo.
   API:  GoldenFleece.open()   GoldenFleece.close()
   Reads window.SYM_QUESTIONS and window.siteLang ('gr'|'en').

   Presentation layer (GFX): ambient night-sea canvas, canvas particle
   set-pieces (coin cascades, Pandora plume, Hermes wings, swap orbit),
   lid-creak jar choreography and a whisper of WebAudio. All of it is
   visual/audio flourish only — rules, scoring and pacing of the quiz
   loop are untouched, and every rAF/timer the FX layer owns is torn
   down in close().
═══════════════════════════════════════════════════════════════════ */
const GoldenFleece = (() => {

  const L = () => (window.siteLang === 'en' ? 'en' : 'gr');

  // Pick the language string from a question's `q`, tolerating {gr,en},
  // bare strings, {q:{gr,en}} wrappers and object-valued langs — so the
  // card never renders the literal "[object Object]" (host/picker banks may
  // deliver q as a bilingual object rather than a plain string).
  const QT = (q) => {
    if (q == null) return '';
    if (typeof q === 'string') return q;
    if (typeof q === 'object') {
      const v = q[L()] != null ? q[L()] : (q.gr != null ? q.gr : q.en);
      if (typeof v === 'string') return v;
      if (v && typeof v === 'object') return QT(v);
      if (q.q !== undefined) return QT(q.q);
    }
    return String(q);
  };

  const T = (gr, en) => (L() === 'en' ? en : gr);

  // Question source. The Games-Panel bridge fills window.GF_Q with MC items
  // {q:{gr,en}, a:[4], c} at launch; standalone falls back to SYM_QUESTIONS.
  const _gpPool = () => {
    const g = window.GF_Q;
    return (Array.isArray(g) && g.length) ? g : (window.SYM_QUESTIONS || []);
  };

  const TOTAL = 10;            // questions per voyage
  const RIVAL_NAMES = ['ΗΡΑΚΛΗΣ','ΟΡΦΕΥΣ','ΑΤΑΛΑΝΤΗ','ΚΑΣΤΩΡ','ΘΗΣΕΥΣ','ΠΟΛΥΔΕΥΚΗΣ'];

  let st = {};
  let _cfg = {};

  /* ═════════ GFX — presentation-only effects engine ═════════ */
  const RM = () => { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_) { return false; } };

  const GFX = (() => {
    const DPR = () => Math.min(2, window.devicePixelRatio || 1);

    /* — ambient: Colchis ridges on the horizon, layered waves, gold motes — */
    let amb = null, ambc = null, ambRaf = 0, motes = null;
    function _seedMotes() {
      motes = [];
      for (let i = 0; i < 46; i++) motes.push({
        fx: Math.random(), fy: Math.random(),
        s: 0.05 + Math.random() * 0.16, r: 0.6 + Math.random() * 1.5,
        tw: 0.6 + Math.random() * 1.8, ph: Math.random() * Math.PI * 2,
        wob: 6 + Math.random() * 16,
      });
    }
    function _ridge(c, w, y0, dx, amp, freq, seed) {
      c.beginPath(); c.moveTo(-4, y0 + 140);
      for (let x = -4; x <= w + 4; x += 18) {
        const y = y0 - (Math.sin((x + dx) * freq) * 0.6 + Math.sin((x + dx) * freq * 2.63 + seed) * 0.4) * amp;
        c.lineTo(x, y);
      }
      c.lineTo(w + 4, y0 + 140); c.closePath(); c.fill();
    }
    function _drawAmb(ts) {
      const wrap = document.getElementById('gf-wrap'); if (!wrap || !amb) return;
      const w = wrap.clientWidth || 1, h = wrap.clientHeight || 1, d = DPR();
      if (amb.width !== (w * d | 0) || amb.height !== (h * d | 0)) {
        amb.width = w * d | 0; amb.height = h * d | 0;
        amb.style.width = w + 'px'; amb.style.height = h + 'px';
      }
      const c = ambc, t = ts * 0.001;
      c.setTransform(d, 0, 0, d, 0, 0); c.clearRect(0, 0, w, h);
      const hor = h - 96;
      // a low moon over the Aegean — halo, disc, maria (the scene's light source)
      const mnx = w * 0.82, mny = Math.max(58, h * 0.19), mnr = 23;
      let mg = c.createRadialGradient(mnx, mny, mnr * 0.5, mnx, mny, mnr * 5.2);
      mg.addColorStop(0, 'rgba(214,235,238,0.15)'); mg.addColorStop(0.45, 'rgba(176,214,222,0.05)'); mg.addColorStop(1, 'rgba(176,214,222,0)');
      c.fillStyle = mg; c.beginPath(); c.arc(mnx, mny, mnr * 5.2, 0, 6.2832); c.fill();
      mg = c.createRadialGradient(mnx - mnr * 0.35, mny - mnr * 0.4, mnr * 0.2, mnx, mny, mnr);
      mg.addColorStop(0, '#EAF4F2'); mg.addColorStop(0.72, '#C7DDDE'); mg.addColorStop(1, '#93B2BA');
      c.globalAlpha = 0.88; c.fillStyle = mg;
      c.beginPath(); c.arc(mnx, mny, mnr, 0, 6.2832); c.fill();
      c.globalAlpha = 0.12; c.fillStyle = '#7E9AA4';
      c.beginPath(); c.arc(mnx - 7, mny - 2, 5, 0, 6.2832); c.fill();
      c.beginPath(); c.arc(mnx + 5, mny + 7, 3.5, 0, 6.2832); c.fill();
      c.beginPath(); c.arc(mnx + 8, mny - 9, 2.4, 0, 6.2832); c.fill();
      c.globalAlpha = 1;
      // Aries — the Ram whose fleece they chase — faint in the northern sky
      const ax = w * 0.13, ay = Math.max(44, h * 0.14);
      const ast = [[0, 11], [13, 4], [29, 0], [38, 8]];
      c.strokeStyle = 'rgba(233,207,126,0.10)'; c.lineWidth = 1;
      c.beginPath();
      for (let i = 0; i < ast.length; i++) { if (i) c.lineTo(ax + ast[i][0], ay + ast[i][1]); else c.moveTo(ax + ast[i][0], ay + ast[i][1]); }
      c.stroke();
      for (let i = 0; i < ast.length; i++) {
        const tw = 0.5 + 0.5 * Math.sin(t * (0.7 + i * 0.23) + i * 2.1);
        c.globalAlpha = 0.2 + 0.32 * tw; c.fillStyle = '#F3DFA0';
        c.shadowColor = 'rgba(243,223,160,0.8)'; c.shadowBlur = 4;
        c.beginPath(); c.arc(ax + ast[i][0], ay + ast[i][1], i === 2 ? 1.5 : 1.05, 0, 6.2832); c.fill();
        c.shadowBlur = 0;
      }
      c.globalAlpha = 1;
      // far Colchis ridges above the waterline
      c.fillStyle = 'rgba(20,32,40,0.5)';  _ridge(c, w, hor,      t * 3.2, 30, 0.006, 1.7);
      c.fillStyle = 'rgba(12,20,26,0.72)'; _ridge(c, w, hor + 16, t * 6.5, 20, 0.0092, 4.2);
      // a sister ship far out on the water — silhouette, moonlit yard, trailing wake
      const sx = w + 80 - ((t * 5.4) % (w + 220)), sy = hor + 2 + Math.sin(t * 0.55) * 1.4;
      c.save(); c.translate(sx, sy); c.rotate(Math.sin(t * 0.42) * 0.035);
      c.globalAlpha = 0.85; c.fillStyle = '#0B151C';
      c.beginPath(); c.moveTo(-17, -1); c.quadraticCurveTo(-15, 4, -9, 5); c.lineTo(9, 5);
      c.quadraticCurveTo(15, 4, 18, -3); c.quadraticCurveTo(19.4, -6.5, 17, -9);
      c.quadraticCurveTo(17.8, -4.6, 14.6, -2.6); c.lineTo(-14, -2.6); c.closePath(); c.fill();
      c.fillRect(-0.8, -16, 1.6, 14);
      c.fillStyle = '#13222B';
      c.beginPath(); c.moveTo(-8, -14.8); c.lineTo(8, -14.8); c.lineTo(6.2, -5); c.lineTo(-6.2, -5); c.closePath(); c.fill();
      c.strokeStyle = 'rgba(206,232,238,0.17)'; c.lineWidth = 0.8;
      c.beginPath(); c.moveTo(-8.4, -14.8); c.lineTo(8.4, -14.8); c.stroke();
      c.strokeStyle = 'rgba(206,232,238,0.11)';
      c.beginPath(); c.moveTo(-17, -1); c.quadraticCurveTo(-15, 4, -9, 5); c.stroke();
      c.restore();
      c.globalAlpha = 0.1; c.fillStyle = '#BFE8F2';
      for (let i = 1; i <= 3; i++) c.fillRect(sx + 15 + i * 9, sy + 4.4 + i * 0.5, 7.5 - i * 1.7, 1);
      c.globalAlpha = 1;
      // faint moon-glint wash on the water
      const g = c.createLinearGradient(0, hor, 0, h);
      g.addColorStop(0, 'rgba(143,195,207,0.05)'); g.addColorStop(1, 'rgba(78,126,140,0.02)');
      c.fillStyle = g; c.fillRect(0, hor + 8, w, h - hor);
      // three parallax wave bands
      for (let k = 0; k < 3; k++) {
        const yb = h - 58 + k * 20, ampl = 4 + k * 2.4, sp = 0.5 + k * 0.32, al = 0.05 + k * 0.033;
        c.beginPath(); c.moveTo(-4, h + 4);
        for (let x = -4; x <= w + 4; x += 14) {
          c.lineTo(x, yb + Math.sin(x * 0.014 + t * sp + k * 2.1) * ampl + Math.sin(x * 0.031 - t * sp * 0.7) * ampl * 0.4);
        }
        c.lineTo(w + 4, h + 4); c.closePath();
        c.fillStyle = 'rgba(' + (k === 2 ? '127,176,188' : '78,126,140') + ',' + al + ')'; c.fill();
        // crest glints
        c.fillStyle = 'rgba(200,235,240,' + (0.06 + k * 0.05) + ')';
        for (let x = ((t * sp * 30) % 90); x < w; x += 90) {
          const y = yb + Math.sin(x * 0.014 + t * sp + k * 2.1) * ampl;
          c.fillRect(x, y - 0.6, 14, 1.2);
        }
      }
      // moonlight lane rippling down the water toward the viewer
      for (let i = 0; i < 11; i++) {
        const yy = hor + 8 + i * ((h - hor - 10) / 11);
        const sw = 12 + i * 3.6, wob = Math.sin(t * (0.6 + i * 0.11) + i * 1.7) * (2.5 + i * 1.2);
        c.globalAlpha = 0.03 + 0.045 * Math.abs(Math.sin(t * (0.8 + i * 0.07) + i * 0.9));
        c.fillStyle = '#D6EBEE';
        c.fillRect(mnx - sw / 2 + wob, yy, sw, 1.3);
      }
      c.globalAlpha = 1;
      // drifting gold motes
      for (let i = 0; i < motes.length; i++) {
        const m = motes[i];
        const mx = m.fx * w + Math.sin(t * 0.35 + m.ph) * m.wob;
        let my = (m.fy - t * m.s * 0.045) % 1; if (my < 0) my += 1;
        const y = my * h, a = 0.1 + 0.3 * (0.5 + 0.5 * Math.sin(t * m.tw + m.ph));
        c.globalAlpha = a; c.fillStyle = '#E9CF7E';
        c.shadowColor = 'rgba(233,207,126,0.9)'; c.shadowBlur = 7;
        c.beginPath(); c.arc(mx, y, m.r, 0, 6.2832); c.fill();
        c.shadowBlur = 0;
      }
      c.globalAlpha = 1;
    }
    function ambientStart() {
      const wrap = document.getElementById('gf-wrap'); if (!wrap) return;
      if (!amb || amb.parentNode !== wrap) {
        amb = document.createElement('canvas'); amb.id = 'gf-ambient';
        wrap.prepend(amb); ambc = amb.getContext('2d');
      }
      if (!motes) _seedMotes();
      cancelAnimationFrame(ambRaf); ambRaf = 0;
      if (RM()) { _drawAmb(0); return; }        // a single still frame
      const loop = (ts) => { _drawAmb(ts); ambRaf = requestAnimationFrame(loop); };
      ambRaf = requestAnimationFrame(loop);
    }
    function ambientStop() { cancelAnimationFrame(ambRaf); ambRaf = 0; }

    /* — event particles on a self-terminating canvas loop — */
    let pc = null, pctx = null, parts = [], pRaf = 0, lastTs = 0;
    function _ensureP() {
      const ov = document.getElementById('gf-overlay'); if (!ov) return null;
      if (!pc || pc.parentNode !== ov) {
        pc = document.createElement('canvas'); pc.id = 'gf-fx-canvas';
        ov.appendChild(pc); pctx = pc.getContext('2d');
      }
      const d = DPR(), w = window.innerWidth, h = window.innerHeight;
      if (pc.width !== (w * d | 0) || pc.height !== (h * d | 0)) {
        pc.width = w * d | 0; pc.height = h * d | 0;
        pc.style.width = w + 'px'; pc.style.height = h + 'px';
      }
      return pctx;
    }
    function _kick() { if (!pRaf) { lastTs = 0; pRaf = requestAnimationFrame(_ploop); } }
    function _ploop(ts) {
      if (!lastTs) lastTs = ts;
      const dt = Math.min(2.4, (ts - lastTs) / 16.667); lastTs = ts;
      const d = DPR();
      pctx.setTransform(d, 0, 0, d, 0, 0);
      pctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const keep = [];
      for (let i = 0; i < parts.length; i++) { if (_stepP(parts[i], dt)) keep.push(parts[i]); }
      parts = keep;
      if (parts.length) { pRaf = requestAnimationFrame(_ploop); }
      else { pRaf = 0; pctx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
    }
    function _stepP(p, dt) {
      p.t += dt * 16.667;
      const c = pctx, k = p.t / p.life;
      if (k >= 1) return false;
      if (p.kind === 'coin') {
        p.vy += 0.34 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.spin += p.vr * dt;
        if (p.floor && p.y > p.floor && p.vy > 0 && !p.bounced) { p.vy *= -0.42; p.vx *= 0.7; p.bounced = 1; }
        const al = k > 0.72 ? 1 - (k - 0.72) / 0.28 : 1;
        c.save(); c.globalAlpha = Math.max(0, al); c.translate(p.x, p.y);
        const sq = Math.abs(Math.cos(p.spin));
        c.scale(Math.max(0.14, sq), 1); c.rotate(p.spin * 0.22);
        const g = c.createRadialGradient(-p.r * 0.32, -p.r * 0.4, p.r * 0.12, 0, 0, p.r);
        g.addColorStop(0, '#F7E5AC'); g.addColorStop(0.55, '#D9B45E'); g.addColorStop(1, '#8E7322');
        c.fillStyle = g; c.beginPath(); c.arc(0, 0, p.r, 0, 6.2832); c.fill();
        c.strokeStyle = 'rgba(92,72,15,0.85)'; c.lineWidth = 1; c.stroke();
        c.strokeStyle = 'rgba(255,240,200,0.6)'; c.lineWidth = 0.8;
        c.beginPath(); c.arc(0, 0, p.r * 0.62, 0, 6.2832); c.stroke();
        c.restore();
        return true;
      }
      if (p.kind === 'spark') {
        const f = Math.pow(0.94, dt);
        p.vx *= f; p.vy *= f; p.x += p.vx * dt; p.y += p.vy * dt;
        const s = p.r * (1 - k * 0.6);
        c.save(); c.globalAlpha = 1 - k; c.translate(p.x, p.y); c.rotate(p.rot || 0);
        c.fillStyle = p.col; c.shadowColor = p.col; c.shadowBlur = 8;
        c.fillRect(-s, -0.7, s * 2, 1.4); c.fillRect(-0.7, -s, 1.4, s * 2);
        c.restore();
        return true;
      }
      if (p.kind === 'smoke') {
        p.y -= p.sp * dt; p.x += Math.sin(p.t * 0.004 + p.ph) * 0.5 * dt; p.r += p.gr * dt;
        c.save(); c.globalAlpha = Math.max(0, (1 - k) * p.al);
        const g = c.createRadialGradient(p.x, p.y, p.r * 0.1, p.x, p.y, p.r);
        g.addColorStop(0, p.col); g.addColorStop(1, 'rgba(20,8,30,0)');
        c.fillStyle = g; c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.2832); c.fill();
        c.restore();
        return true;
      }
      if (p.kind === 'streak') {
        p.ang += p.va * dt; p.rad += p.vrad * dt;
        const nx = p.ox + Math.cos(p.ang) * p.rad, ny = p.oy + Math.sin(p.ang) * p.rad * 0.55;
        c.save(); c.globalAlpha = (1 - k) * 0.9; c.strokeStyle = p.col; c.lineCap = 'round';
        c.shadowColor = p.col; c.shadowBlur = 10; c.lineWidth = p.w * (1 - k * 0.5);
        c.beginPath(); c.moveTo(p.px == null ? nx : p.px, p.py == null ? ny : p.py); c.lineTo(nx, ny); c.stroke();
        c.restore();
        p.px = nx; p.py = ny;
        return true;
      }
      if (p.kind === 'dust') { // slow-rising gold shimmer
        p.y -= p.sp * dt; p.x += Math.sin(p.t * 0.005 + p.ph) * 0.4 * dt;
        const a = Math.sin(Math.min(1, Math.max(0, k)) * Math.PI);
        c.save(); c.globalAlpha = Math.max(0, a * 0.8);
        c.fillStyle = '#F3DFA0'; c.shadowColor = 'rgba(243,223,160,0.9)'; c.shadowBlur = 6;
        c.beginPath(); c.arc(p.x, p.y, p.r, 0, 6.2832); c.fill();
        c.restore();
        return true;
      }
      if (p.kind === 'comet') { // a swoosh with a glowing tail
        if (p.t < 0) return true;
        p.vx += (p.ax || 0) * dt; p.vy += (p.ay || 0) * dt;
        const ox = p.x, oy = p.y;
        p.x += p.vx * dt; p.y += p.vy * dt;
        c.save(); c.globalAlpha = Math.min(1, (1 - k) * 0.95);
        c.strokeStyle = p.col; c.lineCap = 'round'; c.lineWidth = p.w * (1 - k * 0.4);
        c.shadowColor = p.col; c.shadowBlur = 12;
        c.beginPath(); c.moveTo(ox - p.vx * 3.4, oy - p.vy * 3.4); c.lineTo(p.x, p.y); c.stroke();
        c.globalAlpha = Math.min(1, 1 - k); c.fillStyle = '#FFFFFF';
        c.beginPath(); c.arc(p.x, p.y, p.w * 0.55, 0, 6.2832); c.fill();
        c.restore();
        return true;
      }
      if (p.kind === 'evil') { // Pandora's fleeing evils — small flapping flecks
        const f = Math.pow(0.985, dt);
        p.vx *= f; p.vy = p.vy * f - 0.02 * dt;
        p.x += p.vx * dt + Math.sin(p.t * 0.012 + p.ph) * 0.8 * dt;
        p.y += p.vy * dt;
        const fl = Math.sin(p.t * 0.045 + p.ph);
        const al = k < 0.12 ? k / 0.12 : 1 - (k - 0.12) / 0.88;
        c.save(); c.translate(p.x, p.y); c.globalAlpha = Math.max(0, al * 0.9);
        c.strokeStyle = p.col; c.lineWidth = 1.3; c.lineCap = 'round';
        c.shadowColor = 'rgba(150,100,210,0.8)'; c.shadowBlur = 5;
        const s = p.r, wy = fl * s * 0.9;
        c.beginPath();
        c.moveTo(-s, -wy); c.quadraticCurveTo(-s * 0.4, -s * 0.5, 0, 0);
        c.quadraticCurveTo(s * 0.4, -s * 0.5, s, -wy);
        c.stroke();
        c.fillStyle = p.col; c.beginPath(); c.arc(0, 0, 1.5, 0, 6.2832); c.fill();
        c.restore();
        return true;
      }
      return false;
    }
    function sparks(x, y, theme, n) {
      if (RM() || !_ensureP()) return;
      const cols = theme === 'gold' ? ['#F7E5AC', '#E9CF7E', '#FFFFFF'] : ['#BFE8F2', '#8FC3CF', '#FFFFFF'];
      const cnt = n || 12;
      for (let i = 0; i < cnt; i++) {
        const a = Math.random() * 6.2832, sp = 1.5 + Math.random() * 3.4;
        parts.push({ kind: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 0.8, r: 3 + Math.random() * 4, col: cols[i % cols.length], rot: Math.random() * 3, t: 0, life: 520 + Math.random() * 380 });
      }
      _kick();
    }
    function coinCascade(x, y, floor, n) {
      if (RM() || !_ensureP()) return;
      const cnt = n || 24;
      for (let w = 0; w < 3; w++) {
        setTimeout(() => {
          if (!pctx) return;
          for (let i = 0; i < cnt / 3; i++) {
            parts.push({ kind: 'coin', x: x + (Math.random() * 26 - 13), y: y + 4, vx: Math.random() * 5.6 - 2.8, vy: -(5.4 + Math.random() * 4.6), vr: 0.12 + Math.random() * 0.3, spin: Math.random() * 6, r: 4 + Math.random() * 3.4, floor: floor + Math.random() * 10, t: 0, life: 1500 + Math.random() * 500 });
          }
          _kick();
        }, w * 130);
      }
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * 6.2832, sp = 1 + Math.random() * 2.6;
        parts.push({ kind: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.4, r: 2.6 + Math.random() * 3, col: '#F7E5AC', t: 0, life: 700 });
      }
      _kick();
    }
    function plume(x, y) {
      if (RM() || !_ensureP()) return;
      for (let i = 0; i < 15; i++) parts.push({ kind: 'smoke', x: x + (Math.random() * 22 - 11), y: y + 6, sp: 0.9 + Math.random() * 1.6, gr: 0.28 + Math.random() * 0.3, r: 6 + Math.random() * 8, al: 0.5, ph: Math.random() * 6, col: 'rgba(96,64,140,0.55)', t: 0, life: 1300 + Math.random() * 600 });
      for (let i = 0; i < 8; i++) parts.push({ kind: 'smoke', x: x + (Math.random() * 16 - 8), y, sp: 1.4 + Math.random() * 1.4, gr: 0.16, r: 3 + Math.random() * 4, al: 0.75, ph: Math.random() * 6, col: 'rgba(30,14,44,0.85)', t: 0, life: 1000 + Math.random() * 400 });
      for (let i = 0; i < 9; i++) {
        const a = Math.random() * 6.2832, sp = 1.2 + Math.random() * 3;
        parts.push({ kind: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, r: 2.4 + Math.random() * 2.6, col: i % 2 ? '#B08CE0' : '#E08577', t: 0, life: 620 });
      }
      _kick();
    }
    function wings(x, y) {
      if (RM() || !_ensureP()) return;
      for (let i = 0; i < 12; i++) {
        const dir = i % 2 ? 1 : -1;
        parts.push({ kind: 'streak', ox: x, oy: y, ang: (i / 12) * 6.2832, va: dir * (0.09 + Math.random() * 0.07), rad: 6 + Math.random() * 10, vrad: 1.5 + Math.random() * 1.4, w: 2.4 + Math.random() * 1.6, col: i % 3 === 0 ? '#FFFFFF' : '#BFE8F2', t: 0, life: 760 + Math.random() * 280 });
      }
      _kick();
    }
    function swapOrbit(x, y) {
      if (RM() || !_ensureP()) return;
      for (let i = 0; i < 14; i++) {
        const half = i < 7;
        parts.push({ kind: 'streak', ox: x, oy: y, ang: (half ? 0 : Math.PI) + i * 0.12, va: 0.14 + Math.random() * 0.05, rad: 26 + Math.random() * 14, vrad: 0.7, w: 2.2 + Math.random() * 1.4, col: half ? '#93D9CE' : '#E9CF7E', t: 0, life: 820 + Math.random() * 240 });
      }
      _kick();
    }
    function dust(x, y, n) {
      if (RM() || !_ensureP()) return;
      const cnt = n || 16;
      for (let i = 0; i < cnt; i++) parts.push({ kind: 'dust', x: x + (Math.random() * 54 - 27), y: y + Math.random() * 14, sp: 0.5 + Math.random() * 1.2, ph: Math.random() * 6.2832, r: 0.8 + Math.random() * 1.5, t: 0, life: 1200 + Math.random() * 800 });
      _kick();
    }
    function comets(x, y, list) {
      if (RM() || !_ensureP()) return;
      list.forEach(s => parts.push({ kind: 'comet', x, y, vx: Math.cos(s.a) * s.sp, vy: Math.sin(s.a) * s.sp, ax: s.ax || 0, ay: s.ay == null ? -0.02 : s.ay, w: s.w || 3, col: s.col, t: -(s.at || 0), life: s.life || 700 }));
      _kick();
    }
    function evils(x, y, n) {
      if (RM() || !_ensureP()) return;
      const cnt = n || 13;
      for (let i = 0; i < cnt; i++) {
        const a = -Math.PI / 2 + (Math.random() * 2.4 - 1.2), sp = 1.2 + Math.random() * 2.6;
        parts.push({ kind: 'evil', x: x + (Math.random() * 18 - 9), y: y + Math.random() * 6, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, ph: Math.random() * 6.2832, r: 3.2 + Math.random() * 2.8, col: i % 3 === 0 ? 'rgba(176,140,224,0.95)' : 'rgba(52,30,78,0.95)', t: 0, life: 1100 + Math.random() * 700 });
      }
      _kick();
    }
    function fountain(x, y, n) {
      if (RM() || !_ensureP()) return;
      const cnt = n || 26;
      for (let i = 0; i < cnt; i++) {
        parts.push({ kind: 'coin', x: x + (Math.random() * 36 - 18), y, vx: Math.random() * 8 - 4, vy: -(6 + Math.random() * 6.5), vr: 0.1 + Math.random() * 0.34, spin: Math.random() * 6, r: 4.4 + Math.random() * 3.6, floor: window.innerHeight + 40, t: 0, life: 1700 + Math.random() * 500 });
      }
      for (let i = 0; i < 12; i++) {
        const a = Math.random() * 6.2832, sp = 1.4 + Math.random() * 3.2;
        parts.push({ kind: 'spark', x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1.6, r: 2.8 + Math.random() * 3.2, col: '#F7E5AC', t: 0, life: 800 });
      }
      _kick();
    }

    /* — full-screen flash + wrap shake — */
    function flash(color) {
      const ov = document.getElementById('gf-overlay'); if (!ov) return;
      const el = document.createElement('div'); el.className = 'gf-flash';
      el.style.background = 'radial-gradient(circle at 50% 42%, ' + color + ', transparent 72%)';
      el.addEventListener('animationend', () => el.remove());
      ov.appendChild(el);
      setTimeout(() => { if (el.parentNode) el.remove(); }, 900);
    }
    function shake(big) {
      if (RM()) return;
      const w = document.getElementById('gf-wrap'); if (!w) return;
      w.classList.remove('gf-shake-s', 'gf-shake-l'); void w.offsetWidth;
      w.classList.add(big ? 'gf-shake-l' : 'gf-shake-s');
      w.addEventListener('animationend', function h() {
        w.classList.remove('gf-shake-s', 'gf-shake-l');
        w.removeEventListener('animationend', h);
      });
    }

    /* — a whisper of WebAudio (procedural, low volume, gesture-gated) — */
    let ac = null, nzBuf = null;
    function _actx() {
      if (ac) return ac;
      try { const C = window.AudioContext || window.webkitAudioContext; ac = C ? new C() : null; } catch (_) { ac = null; }
      return ac;
    }
    function _tone(f, dur, type, g, f2, at) {
      const a = _actx(); if (!a) return;
      try {
        if (a.state === 'suspended') a.resume();
        const t0 = a.currentTime + (at || 0);
        const o = a.createOscillator(), v = a.createGain();
        o.type = type || 'sine'; o.frequency.setValueAtTime(f, t0);
        if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(24, f2), t0 + dur);
        v.gain.setValueAtTime(0.0001, t0);
        v.gain.exponentialRampToValueAtTime(g, t0 + 0.016);
        v.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        o.connect(v); v.connect(a.destination);
        o.start(t0); o.stop(t0 + dur + 0.06);
      } catch (_) {}
    }
    function _noise(dur, fc, g, at, q, f2) {
      const a = _actx(); if (!a) return;
      try {
        if (a.state === 'suspended') a.resume();
        if (!nzBuf) {
          const n = a.sampleRate * 0.6 | 0;
          nzBuf = a.createBuffer(1, n, a.sampleRate);
          const dd = nzBuf.getChannelData(0);
          for (let i = 0; i < n; i++) dd[i] = Math.random() * 2 - 1;
        }
        const t0 = a.currentTime + (at || 0);
        const s = a.createBufferSource(); s.buffer = nzBuf; s.loop = true;
        const f = a.createBiquadFilter(); f.type = 'bandpass';
        f.frequency.setValueAtTime(fc, t0); f.Q.value = q || 1;
        if (f2) f.frequency.exponentialRampToValueAtTime(Math.max(30, f2), t0 + dur);
        const v = a.createGain(); v.gain.setValueAtTime(0.0001, t0);
        v.gain.exponentialRampToValueAtTime(g, t0 + 0.03);
        v.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
        s.connect(f); f.connect(v); v.connect(a.destination);
        s.start(t0); s.stop(t0 + dur + 0.08);
      } catch (_) {}
    }
    const snd = {
      correct() { _tone(659, 0.12, 'sine', 0.05); _tone(988, 0.17, 'sine', 0.045, null, 0.08); },
      wrong()   { _tone(146, 0.22, 'square', 0.028, 88); _noise(0.18, 240, 0.02, 0, 1.4, 120); },
      creak()   { _noise(0.55, 300, 0.028, 0, 2.6, 140); _tone(88, 0.55, 'sawtooth', 0.012, 56); },
      coins()   { for (let i = 0; i < 7; i++) _tone(820 + Math.random() * 820, 0.09, 'triangle', 0.026, null, i * 0.055); },
      whoosh()  { _noise(0.4, 1400, 0.03, 0, 0.8, 500); },
      swap()    { _noise(0.32, 800, 0.026, 0, 1, 1600); _tone(392, 0.2, 'sine', 0.028, 586, 0.1); },
      pandora() { _noise(0.85, 180, 0.04, 0, 1.1, 60); _tone(196, 0.9, 'sine', 0.045, 49); },
      win()     { [523, 659, 784, 1046].forEach((f, i) => _tone(f, 0.22, 'triangle', 0.04, null, i * 0.09)); },
    };

    function teardown() {
      ambientStop();
      parts.length = 0;
      if (pRaf) { cancelAnimationFrame(pRaf); pRaf = 0; }
      if (pctx) {
        const d = DPR(); pctx.setTransform(d, 0, 0, d, 0, 0);
        pctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
      document.querySelectorAll('#gf-overlay .gf-flash').forEach(e => e.remove());
      if (ac && ac.state === 'running') { try { ac.suspend(); } catch (_) {} }
    }

    return { ambientStart, ambientStop, sparks, coinCascade, plume, wings, swapOrbit, dust, comets, evils, fountain, flash, shake, snd, teardown };
  })();

  /* ───────── public ───────── */
  function open(gp) {
    _cfg = gp || {};
    if (gp && gp.lang) window.siteLang = gp.lang;
    _ensureOverlay(gp);
    if (gp && gp.title) { const _t=document.querySelector('#gf-overlay .overlay-title'); if(_t) _t.textContent=gp.title; }
    document.getElementById('gf-overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
    if (!document.getElementById('gf-screen-intro')) build();
    syncLang();
    show('gf-screen-intro');
    _showMode();
    GFX.ambientStart();
  }
  function close() {
    const ov = document.getElementById('gf-overlay');
    if (ov) ov.classList.remove('active');
    document.body.style.overflow = '';
    if (_goldTween) { cancelAnimationFrame(_goldTween); _goldTween = 0; }
    GFX.teardown();
  }

  // Build the overlay shell on demand (drop-in: works with or without host markup).
  function _ensureOverlay(gp) {
    if (document.getElementById('gf-overlay')) return;
    const ov = document.createElement('div');
    ov.id = 'gf-overlay';
    ov.className = 'game-overlay';
    ov.innerHTML =
      '<div class="overlay-topbar">' +
        '<button class="overlay-back" onclick="GoldenFleece._tryClose()">‹ <span>' + T('ΠΙΣΩ','BACK') + '</span></button>' +
        '<div class="overlay-title">' + ((gp && gp.title) || 'ΧΡΥΣΟΜΑΛΛΟΝ ΔΕΡΑΣ') + '</div>' +
        '<div class="overlay-lang ov-lang">' +
          '<button data-lang="gr" class="' + (L()==='en'?'':'on') + '">ΕΛ</button>' +
          '<button data-lang="en" class="' + (L()==='en'?'on':'') + '">EN</button>' +
        '</div>' +
      '</div>' +
      '<div class="overlay-stage"><div id="gf-wrap"></div></div>';
    document.body.appendChild(ov);
    ov.querySelectorAll('.ov-lang button').forEach(b=>{
      b.addEventListener('click', ()=>{
        window.siteLang = b.dataset.lang;
        ov.querySelectorAll('.ov-lang button').forEach(x=>x.classList.toggle('on', x===b));
        syncLang();
      });
    });
  }

  /* ───────── build ───────── */
  function build() {
    document.getElementById('gf-wrap').innerHTML = `
<!-- INTRO -->
<div id="gf-screen-intro" class="gf-screen">
  ${fleeceSVG('gf-fleece')}
  <div class="gf-logo">ΧΡΥΣΟΜΑΛΛΟΝ ΔΕΡΑΣ</div>
  <div class="gf-logo-en" data-i18n="subtitle"></div>
  <div class="gf-intro-txt" data-i18n="intro"></div>
  <div id="gf-mode-area"></div>
</div>

<!-- GAME -->
<div id="gf-screen-game" class="gf-screen">
  <div class="gf-top">
    <div class="gf-purse">
      ${coinSVG('gf-purse-coin')}
      <div class="gf-purse-txt">
        <span class="gf-purse-lbl" data-i18n="yourgold"></span>
        <span class="gf-purse-val" id="gf-gold">0</span>
      </div>
    </div>
    <div class="gf-voyage">
      <div class="gf-voyage-lbls"><span data-i18n="iolcus"></span><span data-i18n="colchis"></span></div>
      <div class="gf-voyage-track"><div class="gf-voyage-fill" id="gf-fill"></div><div class="gf-argo" id="gf-argo">${argoSVG('gf-argo-svg')}</div></div>
    </div>
    <div class="gf-rank" id="gf-rank">—</div>
  </div>
  <div class="gf-board" id="gf-board"></div>
  <div class="gf-qbody">
    <div class="gf-q-meta"><span class="gf-q-num" id="gf-qnum"></span><span class="gf-q-line"></span></div>
    <div class="gf-q-card"><span class="gf-q-corner tl"></span><span class="gf-q-corner tr"></span><span class="gf-q-corner bl"></span><span class="gf-q-corner br"></span><div class="gf-q-text" id="gf-qtext"></div></div>
    <div class="gf-answers" id="gf-answers"></div>
    <div class="gf-feedback" id="gf-feedback"></div>
  </div>
</div>

<!-- PICK -->
<div id="gf-screen-pick" class="gf-screen">
  <div class="gf-rig gf-rig-l"></div><div class="gf-rig gf-rig-r"></div>
  <div class="gf-deck-sway">
    <div class="gf-pick-sky">
      ${yardSVG('gf-yard')}
      <div class="gf-lantern-swing">
        <div class="gf-lantern-rope"></div>
        ${lanternSVG('gf-lantern')}
        <div class="gf-lantern-halo"></div>
      </div>
    </div>
    <div class="gf-pick-head" data-i18n="pickhead"></div>
    <div class="gf-pick-sub" data-i18n="picksub"></div>
    <div class="gf-stage">
      <div class="gf-lantern-pool"></div>
      <div class="gf-deck"><div class="gf-deck-planks"></div>${shieldsSVG('gf-deck-shields')}<div class="gf-deck-rail"></div></div>
      <div class="gf-pots" id="gf-pots"></div>
    </div>
    <div class="gf-outcome" id="gf-outcome"></div>
  </div>
</div>

<!-- END -->
<div id="gf-screen-end" class="gf-screen">
  <div id="gf-end-art"></div>
  <div class="gf-end-title" id="gf-end-title"></div>
  <div class="gf-end-sub" id="gf-end-sub"></div>
  <div class="gf-final-board" id="gf-final-board"></div>
  <div class="gf-end-btns">
    <button class="sym-btn" onclick="GoldenFleece._showMode()" data-i18n="again"></button>
    <button class="sym-btn ghost" onclick="GoldenFleece.close()" data-i18n="exit"></button>
  </div>
</div>`;
  }

  const I18N = {
    subtitle:{ gr:'Το ταξίδι της Αργούς', en:'The Voyage of the Argo' },
    intro:   { gr:'Σαλπάρεις με τους Αργοναύτες προς την <b>Κολχίδα</b>. Σε κάθε σωστή απάντηση, διάλεξε έναν πίθο — χρυσός, αρπαγή, ανταλλαγή… ή ο <b>πίθος της Πανδώρας</b>. Πρώτος σε χρυσό στην Κολχίδα κερδίζει το Δέρας.', en:'You sail with the Argonauts toward <b>Colchis</b>. On each correct answer, choose a jar — gold, theft, a swap… or <b>Pandora’s Jar</b>. Whoever holds the most gold at Colchis claims the Fleece.' },
    setsail: { gr:'ΑΠΟΠΛΟΥΣ', en:'SET SAIL' },
    yourgold:{ gr:'Ο ΧΡΥΣΟΣ ΣΟΥ', en:'YOUR GOLD' },
    iolcus:  { gr:'ΙΩΛΚΟΣ', en:'IOLCUS' },
    colchis: { gr:'ΚΟΛΧΙΣ', en:'COLCHIS' },
    pickhead:{ gr:'ΔΙΑΛΕΞΕ ΕΝΑΝ ΠΙΘΟ', en:'CHOOSE A JAR' },
    picksub: { gr:'Η τύχη των θεών κρύβεται μέσα.', en:'The fortune of the gods hides within.' },
    again:   { gr:'ΝΕΟ ΤΑΞΙΔΙ', en:'NEW VOYAGE' },
    exit:    { gr:'ΕΞΟΔΟΣ', en:'EXIT' },
  };

  function syncLang() {
    document.querySelectorAll('#gf-wrap [data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n'); if(I18N[k]) el.innerHTML=I18N[k][L()];
    });
    // live-translate the current question + standings if a voyage is in progress
    if (st && st.cur && document.getElementById('gf-screen-game').classList.contains('active')) {
      document.getElementById('gf-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum+' / '+TOTAL;
      document.getElementById('gf-qtext').textContent = QT(st.cur.q);
      renderBoard();
    }
  }
  function show(id){ document.querySelectorAll('#gf-wrap .gf-screen').forEach(s=>s.classList.remove('active')); document.getElementById(id).classList.add('active'); }

  /* ───────── leave confirmation ───────── */
  function _tryClose() {
    const gameActive = document.getElementById('gf-screen-game')?.classList.contains('active');
    const pickActive = document.getElementById('gf-screen-pick')?.classList.contains('active');
    if ((gameActive || pickActive) && st && st.qNum > 0) {
      _showLeaveConfirm();
    } else {
      close();
      if (typeof openGamesPanel === 'function') openGamesPanel();
    }
  }
  function _showLeaveConfirm() {
    document.getElementById('gf-leave-modal')?.remove();
    const L2 = L();
    const el = document.createElement('div');
    el.id = 'gf-leave-modal';
    el.className = 'gf-leave-modal';
    el.innerHTML =
      '<div class="gf-leave-box">' +
        '<div class="gf-leave-msg">' + (L2==='en'?'Leave the game? Your progress will be lost.':'Έξοδος από το παιχνίδι; Η πρόοδός σου θα χαθεί.') + '</div>' +
        '<div class="gf-leave-btns">' +
          '<button class="gf-leave-yes" onclick="GoldenFleece._doLeave()">' + (L2==='en'?'LEAVE':'ΕΞΟΔΟΣ') + '</button>' +
          '<button class="gf-leave-no" onclick="document.getElementById(\'gf-leave-modal\').remove()">' + (L2==='en'?'STAY':'ΜΕΙΝΕ') + '</button>' +
        '</div>' +
      '</div>';
    const ov = document.getElementById('gf-overlay');
    if (ov) ov.appendChild(el);
  }
  function _doLeave() {
    document.getElementById('gf-leave-modal')?.remove();
    close();
    if (typeof openGamesPanel === 'function') openGamesPanel();
  }

  /* ───────── mode screen ───────── */
  function _showMode() {
    const area = document.getElementById('gf-mode-area');
    if (!area) return;
    const L2 = L();
    area.innerHTML =
      '<div class="gf-mode-btns">' +
        '<button class="gf-mode-btn" onclick="GoldenFleece._pickSolo()">' +
          '<span class="gf-mode-icon">⚔️</span>' +
          '<span class="gf-mode-lbl">' + (L2==='en'?'SOLO':'ΜΟΝΟΣ') + '</span>' +
          '<span class="gf-mode-sub">' + (L2==='en'?'Play with AI rivals':'Παιχνίδι με AI αντιπάλους') + '</span>' +
        '</button>' +
        '<button class="gf-mode-btn gf-mode-btn-vs" onclick="GoldenFleece._pickVs()">' +
          '<span class="gf-mode-icon">🌐</span>' +
          '<span class="gf-mode-lbl">' + (L2==='en'?'LIVE VS':'ΖΩΝΤΑΝΟ VS') + '</span>' +
          '<span class="gf-mode-sub">' + (L2==='en'?'Live Arena · multiple players':'Live Arena · πολλοί παίκτες') + '</span>' +
        '</button>' +
      '</div>';
  }

  function _pickSolo() {
    const area = document.getElementById('gf-mode-area');
    if (!area) return;
    const L2 = L(), maxR = RIVAL_NAMES.length;
    const rv = L2==='en' ? 'RIVALS' : 'ΑΝΤΙΠΑΛΟΙ';
    area.innerHTML =
      '<div class="gf-bot-cfg">' +
        '<div class="gf-bot-q">' + (L2==='en'?'How many AI rivals?':'Πόσους AI αντιπάλους θέλεις;') + '</div>' +
        '<div class="gf-bot-opts">' +
          '<button class="gf-bot-btn" onclick="GoldenFleece._start(0)">' + (L2==='en'?'SAIL ALONE':'ΜΟΝΟΣ ΣΑΛΠΑΡΩ') + '</button>' +
          '<button class="gf-bot-btn" onclick="GoldenFleece._start(2)">2 ' + rv + '</button>' +
          '<button class="gf-bot-btn" onclick="GoldenFleece._start(4)">4 ' + rv + '</button>' +
          '<button class="gf-bot-btn gf-bot-btn-max" onclick="GoldenFleece._start(' + maxR + ')">' + maxR + ' ' + rv + ' ★</button>' +
        '</div>' +
        '<button class="gf-bot-back" onclick="GoldenFleece._showMode()">‹ ' + (L2==='en'?'BACK':'ΠΙΣΩ') + '</button>' +
      '</div>';
  }

  function _pickVs() {
    const questions = _gpPool().map(item => ({
      q:    (item.q && typeof item.q === 'object') ? (item.q[L()] || item.q.gr || '') : String(item.q || ''),
      opts: item.a || [],
      ans:  typeof item.c === 'number' ? item.c : 0,
    })).filter(q => q.q && q.opts.length === 4);
    close();
    if (typeof LiveArena !== 'undefined') {
      if (questions.length) {
        LiveArena.launchHost({ questions, gameName: (_cfg && _cfg.title) || T('Χρυσόμαλλον Δέρας — Live','Golden Fleece — Live') });
      } else {
        LiveArena.launchPicker();
      }
    }
  }

  /* ───────── start ───────── */
  function _start(rivalCount) {
    const rc = (rivalCount == null) ? RIVAL_NAMES.length : Math.max(0, Math.min(+rivalCount, RIVAL_NAMES.length));
    st = {
      gold:0, qNum:0, answered:false,
      pool: shuffle([..._gpPool()]), idx:0,
      rivals: RIVAL_NAMES.slice(0, rc).map(n=>({ name:n, gold: 200 + ((Math.random()*250)|0) })),
    };
    _goldShown = null;            // fresh purse display for the new voyage
    show('gf-screen-game');
    nextQ();
  }

  function shuffle(a){ for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;[a[i],a[j]]=[a[j],a[i]];} return a; }
  function getQ(){ if(st.idx>=st.pool.length){ st.pool=shuffle([..._gpPool()]); st.idx=0; } return st.pool[st.idx++]; }

  /* leaderboard */
  function standings() {
    const all=[{name:T('ΕΣΥ','YOU'), gold:st.gold, me:true}, ...st.rivals.map(r=>({...r,me:false}))];
    all.sort((a,b)=>b.gold-a.gold);
    return all;
  }
  function myRank(){ return standings().findIndex(x=>x.me)+1; }

  /* purse display: eased count-up toward the true value (display only) */
  let _goldShown = null, _goldTween = 0;
  function _showGold(target) {
    const el = document.getElementById('gf-gold'); if (!el) return;
    if (_goldTween) { cancelAnimationFrame(_goldTween); _goldTween = 0; }
    const from = (_goldShown == null) ? target : _goldShown;
    if (from === target || RM()) { _goldShown = target; el.textContent = target; return; }
    if (target > from) {
      const pr = document.querySelector('#gf-screen-game .gf-purse');
      if (pr) { const r = pr.getBoundingClientRect(); GFX.sparks(r.left + 24, r.top + r.height / 2, 'gold', 7); }
    }
    // gains bump upward in gold; losses sag with a bruised tick (display only)
    const dirCls = target > from ? 'bump' : 'drop';
    el.classList.remove('bump', 'drop'); void el.offsetWidth; el.classList.add(dirCls);
    const t0 = performance.now(), dur = 650;
    const tick = (ts) => {
      const p = Math.min(1, (ts - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (target - from) * e);
      el.textContent = v; _goldShown = v;
      if (p < 1) _goldTween = requestAnimationFrame(tick); else _goldTween = 0;
    };
    _goldTween = requestAnimationFrame(tick);
  }

  function renderBoard() {
    const board=standings();
    const top = board.slice(0,4);
    // overtake flash: chips whose occupant changed since the last render get a
    // brief glow-pop (presentation only — ordering rules untouched)
    const prev = st._ordPrev;
    const chipKey = (x) => x.me ? '@me' : x.name;
    const moved = (i,x) => (!RM() && prev && prev[i] && prev[i] !== chipKey(x)) ? ' gf-chip-shift' : '';
    document.getElementById('gf-board').innerHTML = top.map((x,i)=>
      `<div class="gf-board-chip${x.me?' me':''} r${i+1}${moved(i,x)}"><span class="gf-board-rank">${i+1}</span><span class="gf-board-name">${x.name}</span><span class="gf-board-gold">${x.gold}</span></div>`
    ).join('');
    st._ordPrev = top.map(chipKey);
    const r=myRank(), n=board.length;
    document.getElementById('gf-rank').textContent = T(`ΘΕΣΗ ${r}/${n}`,`RANK ${r}/${n}`);
    _showGold(st.gold);
    const pct = Math.min(100, (st.qNum/TOTAL)*100);
    document.getElementById('gf-fill').style.width = pct+'%';
    document.getElementById('gf-argo').style.left = pct+'%';
  }

  /* rivals drift upward each round */
  function advanceRivals(){ st.rivals.forEach(r=> r.gold += 40 + ((Math.random()*160)|0)); }

  /* ───────── loop ───────── */
  function nextQ() {
    if (st.qNum >= TOTAL) return end();
    st.answered=false; st.cur=getQ(); st.qNum++;
    document.getElementById('gf-qnum').textContent = T('ΕΡΩΤΗΣΗ ','QUESTION ')+st.qNum+' / '+TOTAL;
    document.getElementById('gf-qtext').textContent = QT(st.cur.q);
    const card=document.querySelector('#gf-screen-game .gf-q-card');
    if (card) { card.classList.remove('gf-qin'); void card.offsetWidth; card.classList.add('gf-qin'); }
    const fb=document.getElementById('gf-feedback'); fb.textContent=''; fb.className='gf-feedback';
    const wrap=document.getElementById('gf-answers'); wrap.innerHTML='';
    const keys=['Α','Β','Γ','Δ'];
    st.cur.a.forEach((opt,i)=>{
      const b=document.createElement('button'); b.className='gf-ans';
      b.style.setProperty('--i', i);
      b.innerHTML=`<span class="gf-ans-key">${keys[i]}</span><span>${opt}</span>`;
      b.onclick=()=>answer(i,b); wrap.appendChild(b);
    });
    renderBoard();
  }

  function answer(chosen, btn) {
    if (st.answered) return; st.answered=true;
    document.querySelectorAll('#gf-answers .gf-ans').forEach((b,i)=>{ b.disabled=true; if(i===st.cur.c) b.classList.add('correct'); });
    const fb=document.getElementById('gf-feedback');
    advanceRivals();
    if (chosen===st.cur.c) {
      const r = btn.getBoundingClientRect();
      GFX.sparks(r.right - 22, r.top + r.height / 2, 'gold');
      GFX.flash('rgba(235,209,136,0.14)');
      GFX.snd.correct();
      fb.textContent=T('ΣΩΣΤΟ — διάλεξε πίθο','CORRECT — choose a jar'); fb.className='gf-feedback gf-fb-ok';
      setTimeout(showPick, 1000);
    } else {
      btn.classList.add('wrong');
      GFX.shake(false);
      GFX.flash('rgba(176,64,44,0.22)');
      GFX.snd.wrong();
      if (window.symLogMistake) { try { window.symLogMistake({ q: QT(st.cur.q), wrong: (st.cur.a && st.cur.a[chosen]) || '', right: (st.cur.a && st.cur.a[st.cur.c]) || '', cat: 'Χρυσόμαλλον Δέρας', gameId: 'golden-fleece' }); } catch (_) {} }
      fb.textContent=T('ΛΑΘΟΣ — οι αντίπαλοι κερδίζουν έδαφος','WRONG — rivals gain ground'); fb.className='gf-feedback gf-fb-bad';
      renderBoard();
      setTimeout(()=>{ if(st.qNum>=TOTAL) end(); else nextQ(); }, 1700);
    }
  }

  /* ───────── pithos pick ───────── */
  function makeOutcomes() {
    const base = 120 + st.qNum*25;
    const g = (m)=> Math.round((base*m + Math.random()*60)/5)*5;
    // weighted pool, then cap specials
    const pool = [];
    const r = Math.random();
    // always at least a couple gold jars
    pool.push({ type:'gold', amt:g(0.6+Math.random()*0.6) });
    pool.push({ type:'gold', amt:g(1.2+Math.random()*1.1) });
    // Pandora only bites once the player has gold worth losing
    const canPandora = st.gold >= 80;
    if (r < 0.30 && canPandora) pool.push({ type:'pandora' });
    else if (r < 0.55) pool.push({ type:'steal' });
    else if (r < 0.75) pool.push({ type:'swap' });
    else pool.push({ type:'gold', amt:g(1.8+Math.random()*1.4) });
    return shuffle(pool);
  }

  function showPick() {
    show('gf-screen-pick');
    document.getElementById('gf-outcome').innerHTML='';
    const outs = makeOutcomes();
    st.outs = outs;
    const wrap=document.getElementById('gf-pots'); wrap.innerHTML='';
    wrap.classList.remove('gf-picking');   // reset the suspense spotlight from the previous round
    document.getElementById('gf-screen-pick').classList.remove('gf-focus');   // headline back to full light
    outs.forEach((o,i)=>{
      const el=document.createElement('div'); el.className='gf-pot'; el.dataset.i=i; el.dataset.v=i;
      el.style.setProperty('--i', i);
      if (o.type==='pandora') el.classList.add('gf-pot-cursed');   // the faint wrong-colored seep
      el.innerHTML = `<div class="gf-pot-shadow"></div>${pithosSVG('gf-pot-jar', i)}
        <div class="gf-pot-base">${T('ΠΙΘΟΣ','JAR')} ${['Α','Β','Γ'][i]}</div>
        <div class="gf-pot-reveal" id="gf-rev-${i}"></div>`;
      el.onclick=()=>pickPot(i);
      wrap.appendChild(el);
    });
  }

  function outcomeView(o) {
    if (o.type==='gold')    return { icon:revIconSVG('coin'),   amt:'+'+o.amt, cls:'gain',  tag:T('ΧΡΥΣΟΣ','GOLD') };
    if (o.type==='pandora') return { icon:revIconSVG('pithos'), amt:'−'+o.lost, cls:'loss', tag:T('ΠΑΝΔΩΡΑ','PANDORA') };
    if (o.type==='steal')   return { icon:revIconSVG('wing'),   amt:'+'+o.amt, cls:'steal', tag:T('ΑΡΠΑΓΗ','THEFT') };
    if (o.type==='swap')    return { icon:revIconSVG('swap'),   amt:'⇄', cls:'steal', tag:T('ΑΝΤΑΛΛΑΓΗ','SWAP') };
  }

  function pickPot(i) {
    document.querySelectorAll('.gf-pot').forEach(p=>p.style.pointerEvents='none');
    const chosen = st.outs[i];

    // resolve dynamic amounts now (relative to current standings)
    const board = standings();
    const leader = board.find(x=>!x.me) || board[0];
    if (chosen.type==='steal')   chosen.amt = Math.round((leader.gold*0.25)/5)*5;
    if (chosen.type==='pandora') chosen.lost = Math.min(st.gold, Math.round((st.gold*0.5)/5)*5);

    const pot = document.querySelector(`.gf-pot[data-i="${i}"]`);
    if (RM() || !pot) {
      // reduced motion: the original immediate reveal pacing
      _revealPots(i, leader);
      setTimeout(()=>applyOutcome(chosen, leader), 700);
      return;
    }

    // suspense: the lid creaks, the fate inside leaks its light through the seam…
    const potsWrap = document.getElementById('gf-pots');
    if (potsWrap) potsWrap.classList.add('gf-picking');   // spotlight the chosen jar
    const scrPick = document.getElementById('gf-screen-pick');
    if (scrPick) scrPick.classList.add('gf-focus');       // dim the headline while fate is decided
    pot.classList.add('opening', 'gf-open-' + chosen.type);
    GFX.snd.creak();
    setTimeout(()=>{
      pot.classList.remove('opening');
      pot.classList.add('opened');
      _revealPots(i, leader);
      _potFX(chosen.type, pot);
      setTimeout(()=>applyOutcome(chosen, leader), 700);
    }, 980);
  }

  // reveal all three (unchanged resolution rules — amounts frozen at pick time)
  function _revealPots(i, leader) {
    st.outs.forEach((o,k)=>{
      if (o.type==='steal' && o.amt==null) o.amt = Math.round((leader.gold*0.25)/5)*5;
      if (o.type==='pandora' && o.lost==null) o.lost = Math.min(st.gold, Math.round((st.gold*0.5)/5)*5);
      const v=outcomeView(o);
      const pot=document.querySelector(`.gf-pot[data-i="${k}"]`);
      const rev=document.getElementById('gf-rev-'+k);
      rev.innerHTML =
        `<div class="gf-reveal-icon">${v.icon}</div><div class="gf-reveal-amt ${v.cls}">${v.amt}</div><div class="gf-reveal-tag">${v.tag}</div>`;
      rev.classList.remove('gf-rev-gain','gf-rev-loss','gf-rev-steal');
      rev.classList.add('gf-rev-'+v.cls);   // plate the fate-tablet in its own metal
      pot.classList.add('revealed');
      if (k===i) pot.classList.add('picked'); else pot.classList.add('dim');
    });
  }

  // set-piece per outcome, anchored on the opened jar (visual only)
  function _potFX(type, pot) {
    const r = pot.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const my = r.top + r.height * 0.16;
    if (type === 'gold') {
      GFX.coinCascade(cx, my, r.bottom - 30);
      GFX.dust(cx, my - 4, 18);
      GFX.flash('rgba(235,209,136,0.22)');
      GFX.snd.coins();
    } else if (type === 'steal') {
      GFX.wings(cx, my);
      GFX.coinCascade(cx, my, r.bottom - 30, 9);
      GFX.comets(cx, my, [
        { a: -2.35, sp: 7.4, col: '#BFE8F2', w: 3.2, life: 760 },
        { a: -0.75, sp: 8.0, col: '#EAF6F8', w: 2.6, life: 700, at: 110 },
        { a: -1.85, sp: 6.4, col: '#8FC3CF', w: 2.2, life: 820, at: 210 },
      ]);
      GFX.flash('rgba(143,195,207,0.2)');
      GFX.snd.whoosh();
    } else if (type === 'swap') {
      GFX.swapOrbit(cx, r.top + r.height * 0.45);
      GFX.comets(cx, my, [
        { a: -2.5, sp: 7, col: '#93D9CE', w: 3 },
        { a: -0.6, sp: 7, col: '#E9CF7E', w: 3, at: 140 },
      ]);
      GFX.flash('rgba(120,205,190,0.18)');
      GFX.snd.swap();
    } else { // pandora
      pot.classList.add('cracked');
      GFX.plume(cx, my);
      GFX.evils(cx, my, 13);
      GFX.flash('rgba(150,80,60,0.3)');
      GFX.flash('rgba(60,20,90,0.28)');
      GFX.shake(true);
      GFX.snd.pandora();
      // a bruised color-grade washes over the whole deck for a beat (visual only)
      const scr = document.getElementById('gf-screen-pick');
      if (scr && !RM()) {
        scr.classList.remove('gf-pandora-hit'); void scr.offsetWidth;
        scr.classList.add('gf-pandora-hit');
        setTimeout(() => scr.classList.remove('gf-pandora-hit'), 1800);
      }
    }
  }

  function applyOutcome(o, leader) {
    const ob = document.getElementById('gf-outcome');
    let big='', desc='', cls='gain';
    if (o.type==='gold') {
      st.gold += o.amt; cls='gain'; coinBurst();
      big=T(`+${o.amt} ΧΡΥΣΟΣ`,`+${o.amt} GOLD`);
      desc=T('Ο πίθος ξεχείλιζε από χρυσές δραχμές.','The jar brimmed with golden drachmas.');
    } else if (o.type==='steal') {
      const rival = st.rivals.find(r=>r.name===leader.name);
      const amt = Math.min(o.amt, rival? rival.gold : o.amt);
      if (rival) rival.gold -= amt;
      st.gold += amt; cls='steal'; coinBurst();
      big=T(`ΑΡΠΑΓΗ +${amt}`,`THEFT +${amt}`);
      desc=T(`Ο Ερμής έκλεψε χρυσό από τον/την ${leader.name}.`,`Hermes stole gold from ${leader.name}.`);
    } else if (o.type==='swap') {
      const idx=(Math.random()*st.rivals.length)|0; const rv=st.rivals[idx];
      const tmp=st.gold; st.gold=rv.gold; rv.gold=tmp; cls='steal';
      big=T('ΑΝΤΑΛΛΑΓΗ','SWAP');
      desc=T(`Αντάλλαξες θησαυρό με τον/την ${rv.name}.`,`You swapped fortunes with ${rv.name}.`);
    } else { // pandora
      st.gold = Math.max(0, st.gold - o.lost); cls='loss';
      big=T(`ΠΙΘΟΣ ΠΑΝΔΩΡΑΣ −${o.lost}`,`PANDORA’S JAR −${o.lost}`);
      desc=T('Άνοιξες το μοιραίο πιθάρι· τα δεινά σκόρπισαν τον χρυσό σου.','You opened the fateful jar; its evils scattered your gold.');
    }
    ob.innerHTML = `<div class="gf-outcome-big ${cls}">${big}</div><div class="gf-outcome-desc">${desc}</div>
      <button class="sym-btn gf-outcome-cont" onclick="GoldenFleece._cont()">${T('ΣΥΝΕΧΕΙΑ','CONTINUE')}</button>`;
  }

  function _cont() {
    show('gf-screen-game');
    if (st.qNum>=TOTAL) end(); else nextQ();
  }

  /* ───────── end ───────── */
  function end() {
    show('gf-screen-end');
    const board = standings();
    const won = board[0].me;
    document.getElementById('gf-end-art').innerHTML = fleeceSVG('gf-end-fleece');
    const title=document.getElementById('gf-end-title');
    const sub=document.getElementById('gf-end-sub');
    if (won) {
      title.textContent=T('ΤΟ ΔΕΡΑΣ ΕΙΝΑΙ ΔΙΚΟ ΣΟΥ','THE FLEECE IS YOURS'); title.className='gf-end-title win';
      sub.textContent=T('Έφτασες πρώτος στην Κολχίδα και άρπαξες το Χρυσόμαλλο Δέρας από το ιερό άλσος του Άρη.','You reached Colchis first and seized the Golden Fleece from the sacred grove of Ares.');
    } else {
      title.textContent=T('ΤΟ ΤΑΞΙΔΙ ΤΕΛΕΙΩΣΕ','THE VOYAGE ENDS'); title.className='gf-end-title lose';
      sub.textContent=T(`Έφτασες στην Κολχίδα στη ${myRank()}η θέση. Το Δέρας πήγε στον/στην ${board[0].name}.`,`You reached Colchis in position ${myRank()}. The Fleece went to ${board[0].name}.`);
    }
    document.getElementById('gf-final-board').innerHTML = board.map((x,i)=>
      `<div class="gf-final-row${x.me?' me':''}"><span class="gf-final-pos">${i+1}</span><span class="gf-final-name">${x.name}${i===0?' 🏆':''}</span><span class="gf-final-gold">${x.gold}</span></div>`
    ).join('');
    if (won) { coinBurst(1.5); GFX.flash('rgba(235,209,136,0.25)'); GFX.snd.win(); }
  }

  /* ───────── coins ───────── */
  function coinBurst(mult) {
    GFX.fountain(window.innerWidth/2, window.innerHeight*0.4, Math.round(24*(mult||1)));
  }

  /* ───────── art ───────── */
  function fleeceSVG(cls){ return `<svg class="${cls}" viewBox="0 0 120 120" fill="none">
    <defs><radialGradient id="gf-g1" cx="42%" cy="36%"><stop offset="0" stop-color="#E3C766"/><stop offset="0.6" stop-color="#C4A448"/><stop offset="1" stop-color="#8E7322"/></radialGradient></defs>
    <path d="M60 18c14 0 22 8 24 18 8 2 12 9 10 17-2 7-9 10-9 10s2 9-6 14c-6 4-13 2-13 2s-4 8-16 8-15-8-15-8-8 2-14-3c-7-6-4-14-4-14s-7-4-8-12 5-14 11-15c2-10 11-18 26-17z" fill="url(#gf-g1)" stroke="#6E5A1E" stroke-width="2"/>
    <g stroke="#9A7E2A" stroke-width="1.6" opacity="0.65"><path d="M44 44c4 4 4 9 1 13M60 40c3 5 3 10 0 15M76 44c-4 4-4 9-1 13M52 60c3 4 3 9 0 13M68 60c-3 4-3 9 0 13"/></g>
    <circle cx="48" cy="40" r="3" fill="#5A4711"/><circle cx="72" cy="40" r="3" fill="#5A4711"/>
  </svg>`; }

  /* Three pithoi with individual character: a stout veteran with a meander
     band, a grand two-staple survivor with a wave band, and a slender jar
     bearing a black-figure ram. Each carries a separate lid group (creak /
     pop animations), a mouth-glow ellipse and a hidden Pandora seep. */
  function pithosSVG(cls, v){
    v = v|0;
    const uid = ['A','B','C'][v] || 'A';
    const defs = `<defs>
      <radialGradient id="gfjb${uid}" cx="36%" cy="30%" r="88%">
        <stop offset="0" stop-color="#C07A48"/><stop offset="0.52" stop-color="#96522E"/><stop offset="1" stop-color="#54290F"/>
      </radialGradient>
      <linearGradient id="gfjl${uid}" x1="0" y1="0" x2="1" y2="0.35">
        <stop offset="0" stop-color="#B57440"/><stop offset="0.55" stop-color="#8A4A26"/><stop offset="1" stop-color="#5E2F16"/>
      </linearGradient>
      <filter id="gfbl${uid}" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="4.2"/></filter>
    </defs>`;

    if (v === 1) { /* grand pithos — wave band, staple repair, chipped foot */
      return `<svg class="${cls}" viewBox="0 0 126 164" fill="none" xmlns="http://www.w3.org/2000/svg">${defs}
        <path d="M42 26 H84 C104 36 116 56 116 80 C116 112 96 142 80 148 L46 148 C30 142 10 112 10 80 C10 56 22 36 42 26 Z" fill="url(#gfjb${uid})" stroke="#33190A" stroke-width="2.5"/>
        <path d="M40 36 H86" stroke="#33190A" stroke-width="2.2" opacity="0.85"/>
        <path d="M36 42 C26 52 20 66 20 80 C20 104 30 128 42 140" stroke="rgba(238,190,130,0.32)" stroke-width="3" fill="none"/>
        <path d="M22 68 H104 M22 86 H104" stroke="#33190A" stroke-width="1.6" opacity="0.5"/>
        <path d="M27 80 q6.5 -8 13 0 q6.5 -8 13 0 q6.5 -8 13 0 q6.5 -8 13 0 q6.5 -8 13 0 q6.5 -8 13 0" stroke="#D9B98C" stroke-width="2" fill="none" opacity="0.5"/>
        <path d="M31 48 L39 66" stroke="#2E1707" stroke-width="1.3" opacity="0.55"/>
        <g fill="#9A9AA4" opacity="0.85"><rect x="26" y="52" width="13" height="3.2" rx="1.6" transform="rotate(16 32 53)"/><rect x="29" y="61" width="13" height="3.2" rx="1.6" transform="rotate(16 35 62)"/></g>
        <path d="M70 146 l8 0 -3.4 -6 Z" fill="#2E1707" opacity="0.8"/>
        <ellipse cx="63" cy="142" rx="26" ry="7" fill="rgba(20,8,2,0.3)"/>
        <g class="gf-jar-cracks" stroke="#241005" stroke-width="1.7" fill="none" opacity="0"><path d="M63 32 L55 68 L62 102 M55 68 L42 86 M62 102 L76 124 M62 102 L52 126"/></g>
        <ellipse class="gf-jar-glow" cx="63" cy="29" rx="27" ry="8" fill="#FFE9A6" filter="url(#gfbl${uid})"/>
        <g class="gf-jar-seep" filter="url(#gfbl${uid})"><path d="M52 24 q-4 -8 1 -15" stroke="#9E7BC8" stroke-width="3" fill="none" opacity="0.8"/><path d="M72 23 q4 -7 1 -13" stroke="#7E5BAA" stroke-width="2.2" fill="none" opacity="0.6"/></g>
        <g class="gf-jar-lid">
          <ellipse cx="63" cy="26" rx="31" ry="8" fill="url(#gfjl${uid})" stroke="#33190A" stroke-width="2"/>
          <ellipse cx="63" cy="24" rx="31" ry="7.4" fill="url(#gfjb${uid})" stroke="#4A2814" stroke-width="1.2"/>
          <ellipse cx="63" cy="15.5" rx="9" ry="3.6" fill="url(#gfjl${uid})" stroke="#33190A" stroke-width="1.5"/>
          <rect x="60.7" y="17" width="4.6" height="5" fill="#4A2814"/>
        </g>
      </svg>`;
    }

    if (v === 2) { /* slender pithos — black-figure ram panel, old scratches */
      return `<svg class="${cls}" viewBox="0 0 112 142" fill="none" xmlns="http://www.w3.org/2000/svg">${defs}
        <path d="M40 24 H72 C88 32 94 50 94 72 C94 100 82 124 70 130 L44 130 C32 124 18 100 18 72 C18 50 24 32 40 24 Z" fill="url(#gfjb${uid})" stroke="#33190A" stroke-width="2.5"/>
        <path d="M38 33 H74" stroke="#33190A" stroke-width="2" opacity="0.85"/>
        <path d="M34 40 C26 50 24 60 24 72 C24 92 32 112 40 122" stroke="rgba(238,190,130,0.3)" stroke-width="2.6" fill="none"/>
        <rect x="36" y="56" width="40" height="30" rx="3" fill="rgba(14,5,1,0.26)" stroke="#2E1707" stroke-width="1.3"/>
        <g fill="#241106" opacity="0.92">
          <ellipse cx="54" cy="73" rx="9.5" ry="5.5"/>
          <circle cx="65" cy="69" r="3.6"/>
          <path d="M65 65 a4.2 4.2 0 1 0 4.4 5.2" stroke="#241106" stroke-width="1.6" fill="none"/>
          <path d="M48 77 v6 M54 78 v6 M60 77 v6" stroke="#241106" stroke-width="1.7"/>
          <path d="M44.5 72 q-3.4 -2 -2.4 -5.4" stroke="#241106" stroke-width="1.6" fill="none"/>
        </g>
        <path d="M30 44 l8 9 M74 40 l6 9 M28 96 l7 8" stroke="#2E1707" stroke-width="1" opacity="0.4"/>
        <ellipse cx="57" cy="125" rx="21" ry="6" fill="rgba(20,8,2,0.3)"/>
        <g class="gf-jar-cracks" stroke="#241005" stroke-width="1.5" fill="none" opacity="0"><path d="M56 30 L50 58 L56 92 M50 58 L40 72 M56 92 L66 112"/></g>
        <ellipse class="gf-jar-glow" cx="56" cy="27" rx="22" ry="7" fill="#FFE9A6" filter="url(#gfbl${uid})"/>
        <g class="gf-jar-seep" filter="url(#gfbl${uid})"><path d="M48 22 q-3 -8 2 -14" stroke="#9E7BC8" stroke-width="2.8" fill="none" opacity="0.8"/><path d="M62 21 q4 -7 1 -12" stroke="#7E5BAA" stroke-width="2" fill="none" opacity="0.6"/></g>
        <g class="gf-jar-lid">
          <ellipse cx="56" cy="24" rx="22" ry="6.6" fill="url(#gfjl${uid})" stroke="#33190A" stroke-width="2"/>
          <ellipse cx="56" cy="22.4" rx="22" ry="6" fill="url(#gfjb${uid})" stroke="#4A2814" stroke-width="1.1"/>
          <circle cx="56" cy="14.6" r="4.6" fill="url(#gfjl${uid})" stroke="#33190A" stroke-width="1.4"/>
          <rect x="54.4" y="17" width="3.2" height="4" fill="#4A2814"/>
        </g>
      </svg>`;
    }

    /* v0 — stout veteran: meander band, lug handles, a long old crack */
    return `<svg class="${cls}" viewBox="0 0 118 150" fill="none" xmlns="http://www.w3.org/2000/svg">${defs}
      <path d="M18 52 q-9 7 -4 17" stroke="#54290F" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M100 52 q9 7 4 17" stroke="#54290F" stroke-width="5" fill="none" stroke-linecap="round"/>
      <path d="M40 26 H78 C96 34 104 52 104 72 C104 102 88 128 74 134 L44 134 C30 128 14 102 14 72 C14 52 22 34 40 26 Z" fill="url(#gfjb${uid})" stroke="#33190A" stroke-width="2.5"/>
      <path d="M38 35 H80" stroke="#33190A" stroke-width="2.2" opacity="0.85"/>
      <path d="M34 42 C25 52 20 62 20 72 C20 94 28 114 38 126" stroke="rgba(238,190,130,0.32)" stroke-width="3" fill="none"/>
      <path d="M26 64 H92 M26 82 H92" stroke="#33190A" stroke-width="1.6" opacity="0.5"/>
      <path d="M32 78 v-9 h9 v6 h-5 M52 78 v-9 h9 v6 h-5 M72 78 v-9 h9 v6 h-5" stroke="#2E1707" stroke-width="2" fill="none" opacity="0.75"/>
      <path d="M82 33 L76 56 L80 70" stroke="#2E1707" stroke-width="1.4" fill="none" opacity="0.5"/>
      <ellipse cx="59" cy="128" rx="24" ry="6.5" fill="rgba(20,8,2,0.3)"/>
      <g class="gf-jar-cracks" stroke="#241005" stroke-width="1.6" fill="none" opacity="0"><path d="M59 30 L52 62 L58 96 M52 62 L40 78 M58 96 L70 116"/></g>
      <ellipse class="gf-jar-glow" cx="59" cy="27" rx="24" ry="7.5" fill="#FFE9A6" filter="url(#gfbl${uid})"/>
      <g class="gf-jar-seep" filter="url(#gfbl${uid})"><path d="M50 23 q-3 -8 2 -14" stroke="#9E7BC8" stroke-width="3" fill="none" opacity="0.8"/><path d="M66 22 q4 -7 1 -12" stroke="#7E5BAA" stroke-width="2.2" fill="none" opacity="0.6"/></g>
      <g class="gf-jar-lid">
        <ellipse cx="59" cy="25" rx="27" ry="7.5" fill="url(#gfjl${uid})" stroke="#33190A" stroke-width="2"/>
        <ellipse cx="59" cy="23.2" rx="27" ry="7" fill="url(#gfjb${uid})" stroke="#4A2814" stroke-width="1.2"/>
        <circle cx="59" cy="15" r="5" fill="url(#gfjl${uid})" stroke="#33190A" stroke-width="1.6"/>
        <rect x="57.2" y="18" width="3.6" height="4.4" fill="#4A2814"/>
      </g>
    </svg>`;
  }

  function coinSVG(cls){ return `<svg class="${cls}" viewBox="0 0 64 64" fill="none">
    <defs><radialGradient id="gf-coin-g" cx="36%" cy="30%" r="82%"><stop offset="0" stop-color="#F7E5AC"/><stop offset="0.55" stop-color="#D9B45E"/><stop offset="1" stop-color="#8E7322"/></radialGradient></defs>
    <circle cx="32" cy="32" r="26" fill="url(#gf-coin-g)" stroke="#6E5A1E" stroke-width="2"/>
    <circle cx="32" cy="32" r="20" fill="none" stroke="#F1DC9C" stroke-width="1.5" opacity="0.8"/>
    <path d="M17 21 a20 20 0 0 1 9 -7" stroke="#FFF4D0" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>
    <text x="32" y="43" font-family="Alegreya,Georgia,serif" font-size="28" fill="#5A4711" text-anchor="middle" font-weight="700">Α</text>
  </svg>`; }

  /* the Argo — hull, striped sail, shield row, oars; bobs along the voyage track */
  function argoSVG(cls){ return `<svg class="${cls}" viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gf-argo-h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8A5A2E"/><stop offset="1" stop-color="#42250F"/></linearGradient>
      <linearGradient id="gf-argo-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4EAD2"/><stop offset="1" stop-color="#D9C49A"/></linearGradient>
    </defs>
    <path d="M14 34 l-4 7 M24 37 l-3 6 M40 37 l3 6 M50 34 l4 7" stroke="#2E1707" stroke-width="1.3" opacity="0.8"/>
    <path d="M2 26 L10 24 C24 28 42 28 56 23 L62 21 C60 29 52 37 38 38 L20 38 C10 36 4 31 2 26 Z" fill="url(#gf-argo-h)" stroke="#2E1707" stroke-width="1.4"/>
    <path d="M6 27 C22 31 44 30 59 23" stroke="#C9A44A" stroke-width="1" opacity="0.7"/>
    <circle cx="18" cy="30" r="1.7" fill="#C9A44A"/><circle cx="26" cy="31" r="1.7" fill="#8FC3CF"/><circle cx="34" cy="31" r="1.7" fill="#C9A44A"/><circle cx="42" cy="30" r="1.7" fill="#8FC3CF"/>
    <rect x="30" y="4" width="2" height="21" fill="#3A2012"/>
    <path d="M20 6 H42" stroke="#3A2012" stroke-width="1.6"/>
    <path d="M21 7 H41 C42.5 13 42 18 41.5 21 H20.5 C20 18 19.5 13 21 7 Z" fill="url(#gf-argo-s)" stroke="#8A6A3A" stroke-width="0.8"/>
    <path d="M24 7 C23.6 12 23.6 16 24 21 M31 7 C30.8 12 30.8 16 31 21 M38 7 C38.4 12 38.4 16 38 21" stroke="#C9A44A" stroke-width="0.7" opacity="0.55"/>
    <path d="M32 2.6 l7 2 -7 2 Z" fill="#C9A44A"/>
  </svg>`; }

  /* the Argo's yard with a furled sail — frames the top of the pick scene */
  function yardSVG(cls){ return `<svg class="${cls}" viewBox="0 0 920 96" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMin meet">
    <defs>
      <linearGradient id="gfyd-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7A5228"/><stop offset="0.5" stop-color="#5A3A1A"/><stop offset="1" stop-color="#38220D"/></linearGradient>
      <linearGradient id="gfyd-s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6D8B4"/><stop offset="0.62" stop-color="#BFA87C"/><stop offset="1" stop-color="#84714E"/></linearGradient>
    </defs>
    <path d="M28 25 H892 V30 Q863 74 834 30 Q805 80 776 30 Q747 72 718 30 Q689 82 660 30 Q631 74 602 30 Q573 80 544 30 Q515 72 486 30 Q457 82 428 30 Q399 74 370 30 Q341 80 312 30 Q283 72 254 30 Q225 82 196 30 Q167 74 138 30 Q109 80 80 30 Q51 68 28 30 Z" fill="url(#gfyd-s)" stroke="#5E4A2A" stroke-width="1.2"/>
    <path d="M834 30 Q805 74 776 30 M660 30 Q631 70 602 30 M486 30 Q457 76 428 30 M312 30 Q283 68 254 30 M138 30 Q109 74 80 30" stroke="rgba(60,44,20,0.4)" stroke-width="1.4" fill="none"/>
    <path d="M10 22 C230 12 690 12 910 22 L910 32 C690 22 230 22 10 32 Z" fill="url(#gfyd-w)" stroke="#241205" stroke-width="1.6"/>
    <path d="M14 24 C230 15 690 15 906 24" stroke="rgba(238,196,120,0.3)" stroke-width="1.4" fill="none"/>
    <g fill="#33200C" stroke="#1B0F04" stroke-width="0.8">
      <rect x="134" y="12" width="8" height="24" rx="2.5"/><rect x="308" y="10" width="8" height="24" rx="2.5"/>
      <rect x="482" y="10" width="8" height="24" rx="2.5"/><rect x="656" y="10" width="8" height="24" rx="2.5"/>
      <rect x="772" y="12" width="8" height="24" rx="2.5"/>
    </g>
    <path d="M120 32 q-5 22 2 42 M800 32 q6 24 -2 48" stroke="#4A3117" stroke-width="1.6" fill="none" opacity="0.8"/>
    <circle cx="14" cy="27" r="5" fill="#8E7322" stroke="#4A3809" stroke-width="1.2"/>
    <circle cx="906" cy="27" r="5" fill="#8E7322" stroke="#4A3809" stroke-width="1.2"/>
  </svg>`; }

  /* a bronze deck lantern (its flame flickers via CSS) */
  function lanternSVG(cls){ return `<svg class="${cls}" viewBox="0 0 40 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="gfln-b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B99648"/><stop offset="0.5" stop-color="#8E7322"/><stop offset="1" stop-color="#5C480F"/></linearGradient>
      <radialGradient id="gfln-g" cx="50%" cy="62%" r="70%"><stop offset="0" stop-color="rgba(255,214,130,0.95)"/><stop offset="0.55" stop-color="rgba(233,160,70,0.7)"/><stop offset="1" stop-color="rgba(110,62,18,0.55)"/></radialGradient>
      <radialGradient id="gfln-f" cx="50%" cy="72%" r="70%"><stop offset="0" stop-color="#FFF6D8"/><stop offset="0.5" stop-color="#FFD980"/><stop offset="1" stop-color="#E8912E"/></radialGradient>
    </defs>
    <circle cx="20" cy="5" r="3.4" stroke="#8E7322" stroke-width="2" fill="none"/>
    <path d="M12 13 L28 13 L24.6 6.5 L15.4 6.5 Z" fill="url(#gfln-b)" stroke="#241205" stroke-width="1"/>
    <rect x="11.6" y="13.5" width="16.8" height="26" rx="3.4" fill="url(#gfln-g)" stroke="#3A2A10" stroke-width="1.4"/>
    <g class="gf-flame"><path d="M20 21.5 C23.6 26.5 24.6 30.5 20 35 C15.4 30.5 16.4 26.5 20 21.5 Z" fill="url(#gfln-f)"/><circle cx="20" cy="31" r="2.1" fill="#FFF6D8"/></g>
    <path d="M15.6 13.5 V39.5 M24.4 13.5 V39.5" stroke="#3A2A10" stroke-width="1.1" opacity="0.75"/>
    <rect x="10.5" y="39.5" width="19" height="5.6" rx="2" fill="url(#gfln-b)" stroke="#241205" stroke-width="1"/>
    <circle cx="20" cy="48.4" r="2.3" fill="#8E7322"/>
  </svg>`; }

  /* the Argonauts' shields hung along the bow rail */
  function shieldsSVG(cls){
    const defs = `<defs>
      <radialGradient id="gfsh-b" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#A3823C"/><stop offset="0.55" stop-color="#6E5A1E"/><stop offset="1" stop-color="#3E3009"/></radialGradient>
      <radialGradient id="gfsh-a" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#5E8B96"/><stop offset="0.6" stop-color="#33545E"/><stop offset="1" stop-color="#16262C"/></radialGradient>
      <radialGradient id="gfsh-d" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#8A5A30"/><stop offset="0.6" stop-color="#5C3A1C"/><stop offset="1" stop-color="#2C1A0A"/></radialGradient>
    </defs>`;
    const xs = [64, 168, 272, 376, 480, 584, 688];
    const rs = [20, 22, 19, 22, 20, 21, 19], rots = [-3, 2, -2, 0, 3, -2, 2];
    let s = '';
    for (let i = 0; i < xs.length; i++) {
      const r = rs[i], kind = i % 3;
      const fill = kind === 0 ? 'url(#gfsh-b)' : (kind === 1 ? 'url(#gfsh-a)' : 'url(#gfsh-d)');
      s += `<g transform="translate(${xs[i]} 28) rotate(${rots[i]})">`;
      s += `<circle r="${r}" fill="${fill}" stroke="#1B0F04" stroke-width="1.6"/>`;
      s += `<circle r="${r - 3.5}" fill="none" stroke="rgba(240,228,190,0.22)" stroke-width="1.1"/>`;
      if (kind === 0) {
        s += `<circle r="4.6" fill="#C9A44A" stroke="#3E3009" stroke-width="1"/>`;
        for (let k = 0; k < 6; k++) {
          const a = k * Math.PI / 3;
          s += `<circle cx="${(Math.cos(a) * (r - 8)).toFixed(1)}" cy="${(Math.sin(a) * (r - 8)).toFixed(1)}" r="1.6" fill="#C9A44A" opacity="0.8"/>`;
        }
      } else if (kind === 1) {
        s += `<path d="M-12 2 q4 -7 8 0 q4 -7 8 0 q4 -7 8 0" stroke="#BFE8F2" stroke-width="1.6" fill="none" opacity="0.6"/><circle r="3.2" fill="none" stroke="#BFE8F2" stroke-width="1.3" opacity="0.65"/>`;
      } else {
        s += `<path d="M-8 6 L0 -6 L8 6 M-8 13 L0 1 L8 13" stroke="#D9B45E" stroke-width="1.8" fill="none" opacity="0.75"/>`;
      }
      s += `<path d="M${(-r * 0.62).toFixed(1)} ${(-r * 0.62).toFixed(1)} A ${(r * 0.88).toFixed(1)} ${(r * 0.88).toFixed(1)} 0 0 1 ${(r * 0.5).toFixed(1)} ${(-r * 0.74).toFixed(1)}" stroke="rgba(228,240,244,0.2)" stroke-width="2" fill="none"/>`;
      s += `</g>`;
    }
    return `<svg class="${cls}" viewBox="0 0 760 56" fill="none" xmlns="http://www.w3.org/2000/svg">${defs}${s}</svg>`;
  }

  /* small reveal icons (procedural SVG — emoji glyphs render inconsistently) */
  function revIconSVG(kind){
    if (kind === 'coin') return `<svg viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="12.5" fill="#D9B45E" stroke="#8E7322" stroke-width="1.6"/>
      <circle cx="16" cy="16" r="8.6" fill="none" stroke="#F7E5AC" stroke-width="1.2" opacity="0.9"/>
      <path d="M9 10 a10 10 0 0 1 4.6 -3.4" stroke="#FFF4D0" stroke-width="1.8" stroke-linecap="round" opacity="0.85"/>
      <text x="16" y="21" font-family="Alegreya,Georgia,serif" font-size="12" fill="#5A4711" text-anchor="middle" font-weight="700">Α</text>
    </svg>`;
    if (kind === 'pithos') return `<svg viewBox="0 0 32 32" fill="none">
      <path d="M12 8 h8 l-1 2.4 c2.8 1.4 4.6 4.4 4.6 8 c0 6.4 -3.8 12 -7.6 12 s-7.6 -5.6 -7.6 -12 c0 -3.6 1.8 -6.6 4.6 -8 Z" fill="#6B3820" stroke="#2E1707" stroke-width="1.4"/>
      <path d="M11 12 h10" stroke="#2E1707" stroke-width="1.2"/>
      <path d="M13 6.5 q-2 -3 0 -5 M19 6.5 q2 -3 0 -5" stroke="#B08CE0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M14 18 l-2 6 M18 16 l3 8" stroke="#241005" stroke-width="1.1" opacity="0.8"/>
    </svg>`;
    if (kind === 'wing') return `<svg viewBox="0 0 32 32" fill="none">
      <path d="M4 22 C8 10 20 4 29 5 C26 9 25 12 21 14 C24 14 26 14 28 13 C25 18 21 20 16 20 C18 21 20 21.4 22 21 C17 25 10 25.6 4 22 Z" fill="#BFE8F2" stroke="#5E8B96" stroke-width="1.2"/>
      <path d="M8 20 C13 13 20 9 26 8" stroke="#5E8B96" stroke-width="1" opacity="0.7"/>
    </svg>`;
    return `<svg viewBox="0 0 32 32" fill="none">
      <path d="M6 12 C9 7 21 7 25 11" stroke="#93D9CE" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M25 6.5 l1 5.5 -5.6 -0.6 Z" fill="#93D9CE"/>
      <path d="M26 20 C23 25 11 25 7 21" stroke="#E9CF7E" stroke-width="2.2" fill="none" stroke-linecap="round"/>
      <path d="M7 25.5 l-1 -5.5 5.6 0.6 Z" fill="#E9CF7E"/>
    </svg>`;
  }

  return { open, close, _start, _tryClose, _doLeave, _showMode, _pickSolo, _pickVs, _cont, syncLang };
})();
window.GoldenFleece = GoldenFleece;

/* ── Games-Panel entry points ── */
window.openGoldenFleece  = function(gp){ GoldenFleece.open(gp || {}); };
window.closeGoldenFleece = function(){ GoldenFleece.close(); };
