/* ============================================================
   Hagia Sophia 537 — icons.js
   The Orthodox image-layer of later centuries, painted
   procedurally in the Byzantine manner: the apse Theotokos
   (867), the dome Pantokrator, four pendentive seraphim,
   church fathers in the tympana niches, Leo VI before Christ
   over the Imperial Door, and the Deesis of the south gallery.
   All meshes live in HS.iconGroup — toggleable (key I) so the
   aniconic interior of 537 remains available.
   ============================================================ */
(function () {

  /* ---------- small painting kit (Byzantine schema) ---------- */
  function goldGround(x, w, h, seed) {
    const rnd = HS.rng(seed || 5);
    x.fillStyle = '#8a6a20'; x.fillRect(0, 0, w, h);
    const cell = Math.max(5, Math.round(w / 90));
    for (let i = 0; i < w / cell + 1; i++) for (let j = 0; j < h / cell + 1; j++) {
      const l = 36 + rnd() * 26;
      x.fillStyle = `hsl(${43 + rnd() * 9},${55 + rnd() * 25}%,${l}%)`;
      x.fillRect(i * cell + 0.5, j * cell + 0.5, cell - 1, cell - 1);
    }
    const g = x.createRadialGradient(w * .5, h * .35, 8, w * .5, h * .5, w * .75);
    g.addColorStop(0, 'rgba(255,240,190,0.14)'); g.addColorStop(1, 'rgba(60,40,0,0.16)');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
  }

  function halo(x, cx, cy, r, cross) {
    x.fillStyle = '#f6e6a6';
    x.beginPath(); x.arc(cx, cy, r, 0, 7); x.fill();
    x.lineWidth = Math.max(2, r * 0.09);               // dark red rim: reads on gold
    x.strokeStyle = '#7e1d12';
    x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke();
    x.lineWidth = Math.max(1.5, r * 0.05);
    x.strokeStyle = '#fffbe6';
    x.beginPath(); x.arc(cx, cy, r * 0.86, 0, 7); x.stroke();
    if (cross) {                       // cruciform halo of Christ
      x.fillStyle = '#b8483a';
      const a = r * 0.34;
      x.fillRect(cx - a / 2, cy - r, a, r * 0.62);
      x.fillRect(cx - r, cy - a / 2 - r * 0.12, r * 0.62, a);
      x.fillRect(cx + r * 0.38, cy - a / 2 - r * 0.12, r * 0.62, a);
    }
  }

  /* frontal face, s = face height */
  function face(x, cx, cy, s, o) {
    o = o || {};
    const w = s * 0.72;
    x.fillStyle = '#c79a63';                                  // proplasmos
    x.beginPath(); x.ellipse(cx, cy, w / 2, s / 2, 0, 0, 7); x.fill();
    x.fillStyle = 'rgba(122,84,40,0.55)';                     // shadow sides
    x.beginPath(); x.ellipse(cx - w * 0.3, cy + s * 0.05, w * 0.16, s * 0.34, 0.15, 0, 7); x.fill();
    x.beginPath(); x.ellipse(cx + w * 0.3, cy + s * 0.05, w * 0.16, s * 0.34, -0.15, 0, 7); x.fill();
    x.fillStyle = 'rgba(240,206,150,0.9)';                    // light of the brow/nose
    x.beginPath(); x.ellipse(cx, cy - s * 0.18, w * 0.26, s * 0.2, 0, 0, 7); x.fill();
    const ey = cy - s * 0.08, eo = w * 0.19;
    x.fillStyle = '#f4e9d8';
    x.beginPath(); x.ellipse(cx - eo, ey, w * 0.11, s * 0.055, 0, 0, 7); x.fill();
    x.beginPath(); x.ellipse(cx + eo, ey, w * 0.11, s * 0.055, 0, 0, 7); x.fill();
    x.fillStyle = '#2d1d10';
    x.beginPath(); x.arc(cx - eo, ey, s * 0.042, 0, 7); x.fill();
    x.beginPath(); x.arc(cx + eo, ey, s * 0.042, 0, 7); x.fill();
    x.strokeStyle = '#4a2f16'; x.lineWidth = Math.max(1, s * 0.035);
    x.beginPath(); x.moveTo(cx - eo - w * 0.13, ey - s * 0.09);  // brows
    x.quadraticCurveTo(cx - eo, ey - s * 0.16, cx - eo + w * 0.12, ey - s * 0.1); x.stroke();
    x.beginPath(); x.moveTo(cx + eo - w * 0.12, ey - s * 0.1);
    x.quadraticCurveTo(cx + eo, ey - s * 0.16, cx + eo + w * 0.13, ey - s * 0.09); x.stroke();
    x.beginPath(); x.moveTo(cx - s * 0.02, ey - s * 0.02);        // long nose
    x.lineTo(cx - s * 0.035, cy + s * 0.16); x.lineTo(cx + s * 0.045, cy + s * 0.18); x.stroke();
    x.strokeStyle = '#6e2c1c'; x.lineWidth = Math.max(1, s * 0.045);
    x.beginPath(); x.moveTo(cx - w * 0.12, cy + s * 0.3);         // small mouth
    x.quadraticCurveTo(cx, cy + s * 0.34, cx + w * 0.12, cy + s * 0.3); x.stroke();
    if (o.beard) {
      x.fillStyle = o.beardCol || '#7a6a58';
      x.beginPath();
      x.moveTo(cx - w * 0.42, cy + s * 0.08);
      x.quadraticCurveTo(cx, cy + s * (0.62 + o.beard * 0.4), cx + w * 0.42, cy + s * 0.08);
      x.quadraticCurveTo(cx, cy + s * 0.42, cx - w * 0.42, cy + s * 0.08);
      x.fill();
      x.strokeStyle = 'rgba(46,36,26,0.5)'; x.lineWidth = 1;
      for (let i = -2; i <= 2; i++) {
        x.beginPath(); x.moveTo(cx + i * w * 0.09, cy + s * 0.3);
        x.lineTo(cx + i * w * 0.13, cy + s * (0.52 + o.beard * 0.33)); x.stroke();
      }
    }
    if (o.hair !== false) {
      x.fillStyle = o.hairCol || '#5c4632';
      x.beginPath();
      x.ellipse(cx, cy - s * 0.3, w * 0.58, s * 0.32, 0, Math.PI * 0.95, Math.PI * 2.05);
      x.quadraticCurveTo(cx + w * 0.5, cy - s * 0.05, cx + w * 0.42, cy + s * 0.05);
      x.lineTo(cx + w * 0.34, cy - s * 0.22);
      x.lineTo(cx - w * 0.34, cy - s * 0.22);
      x.lineTo(cx - w * 0.42, cy + s * 0.05);
      x.quadraticCurveTo(cx - w * 0.5, cy - s * 0.05, cx - w * 0.58, cy - s * 0.3);
      x.fill();
    }
  }

  function inscription(x, str, cx, cy, size, col) {
    x.fillStyle = col || '#efe6c8';
    x.font = 'bold ' + size + 'px Georgia, serif';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    x.fillText(str, cx, cy);
  }
  function vertInscription(x, str, cx, cy0, size, col) {
    x.fillStyle = col || '#efe6c8';
    x.font = 'bold ' + size + 'px Georgia, serif';
    x.textAlign = 'center'; x.textBaseline = 'middle';
    for (let i = 0; i < str.length; i++) x.fillText(str[i], cx, cy0 + i * size * 1.12);
  }

  /* draped body block with fold strokes */
  function robe(x, cx, top, w, h, col, foldCol, taper) {
    x.fillStyle = col;
    x.beginPath();
    x.moveTo(cx - w * 0.5 * (taper || 0.75), top);
    x.lineTo(cx + w * 0.5 * (taper || 0.75), top);
    x.quadraticCurveTo(cx + w * 0.62, top + h * 0.55, cx + w * 0.5, top + h);
    x.lineTo(cx - w * 0.5, top + h);
    x.quadraticCurveTo(cx - w * 0.62, top + h * 0.55, cx - w * 0.5 * (taper || 0.75), top);
    x.fill();
    x.strokeStyle = foldCol; x.lineWidth = Math.max(1, w * 0.02);
    for (let i = -2; i <= 2; i++) {
      x.beginPath();
      x.moveTo(cx + i * w * 0.14, top + h * 0.12);
      x.quadraticCurveTo(cx + i * w * 0.2, top + h * 0.55, cx + i * w * 0.12, top + h * 0.96);
      x.stroke();
    }
  }

  function gospelBook(x, cx, cy, w) {
    x.fillStyle = '#8a1f1f'; x.fillRect(cx - w / 2, cy - w * 0.62, w, w * 1.24);
    x.strokeStyle = '#e9c96a'; x.lineWidth = Math.max(1.5, w * 0.07);
    x.strokeRect(cx - w * 0.38, cy - w * 0.5, w * 0.76, w * 1.0);
    x.fillStyle = '#e9c96a';
    [[0, 0], [-0.22, -0.3], [0.22, -0.3], [-0.22, 0.3], [0.22, 0.3]].forEach(p => {
      x.beginPath(); x.arc(cx + p[0] * w, cy + p[1] * w, w * 0.06, 0, 7); x.fill();
    });
  }

  /* ---------- the individual images ---------- */

  /* Apse: Theotokos enthroned with the Child (as unveiled in 867) */
  function theotokosCanvas() {
    const W = 1024, H = 512, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    goldGround(x, W, H, 11);
    const cx = W / 2;
    // jewelled throne
    x.fillStyle = '#caa64a';
    x.fillRect(cx - 150, 208, 300, 190);
    x.fillStyle = '#8a6a20';
    x.fillRect(cx - 150, 208, 300, 14);
    x.fillStyle = '#5e6e8e';                       // cushion
    x.beginPath(); x.ellipse(cx, 250, 150, 26, 0, 0, 7); x.fill();
    x.fillStyle = '#caa64a'; x.fillRect(cx - 190, 380, 380, 26);   // footstool
    x.fillStyle = '#e9dcb4';
    for (let i = 0; i < 9; i++) { x.beginPath(); x.arc(cx - 140 + i * 35, 398, 5, 0, 7); x.fill(); }
    // the Virgin: deep maphorion over blue
    halo(x, cx, 122, 74);
    robe(x, cx, 226, 216, 174, '#274067', '#182a48', 0.6);        // tunic/legs
    x.fillStyle = '#5b2036';                                       // maphorion
    x.beginPath();
    x.moveTo(cx - 96, 400); x.lineTo(cx - 88, 208);
    x.quadraticCurveTo(cx - 80, 122, cx, 98);
    x.quadraticCurveTo(cx + 80, 122, cx + 88, 208);
    x.lineTo(cx + 96, 400);
    x.quadraticCurveTo(cx, 350, cx - 96, 400);
    x.fill();
    x.strokeStyle = '#38101f'; x.lineWidth = 3;
    for (const k of [-1, 0.02, 1]) {
      x.beginPath(); x.moveTo(cx + 62 * k, 180);
      x.quadraticCurveTo(cx + 78 * k, 280, cx + 58 * k, 392); x.stroke();
    }
    face(x, cx, 148, 64, { hair: false });
    x.fillStyle = '#5b2036';                                       // hood over brow
    x.beginPath(); x.ellipse(cx, 122, 50, 32, 0, Math.PI, Math.PI * 2); x.fill();
    x.fillStyle = '#e9c96a';                                       // the three stars
    [[0, 100], [-44, 148], [44, 148]].forEach(p => {
      x.save(); x.translate(cx + p[0], p[1]);
      for (let i = 0; i < 4; i++) { x.rotate(Math.PI / 4); x.fillRect(-1.6, -7, 3.2, 14); }
      x.restore();
    });
    // the Child on her lap
    halo(x, cx, 258, 38, true);
    x.fillStyle = '#d9c07c';
    x.beginPath(); x.ellipse(cx, 300, 42, 52, 0, 0, 7); x.fill();
    x.strokeStyle = '#9a7c2c'; x.lineWidth = 2.5;
    x.beginPath(); x.moveTo(cx - 24, 276); x.quadraticCurveTo(cx, 300, cx - 18, 340); x.stroke();
    x.beginPath(); x.moveTo(cx + 22, 280); x.quadraticCurveTo(cx + 8, 306, cx + 16, 338); x.stroke();
    face(x, cx, 262, 30, { hairCol: '#6e522e' });
    // inscriptions
    inscription(x, 'ΜΡ', cx - 190, 120, 46, '#dfe6ee');
    inscription(x, 'ΘΥ', cx + 190, 120, 46, '#dfe6ee');
    return c;
  }

  /* Dome crown: Pantokrator in a medallion */
  function pantokratorCanvas() {
    const S = 512, c = document.createElement('canvas');
    c.width = c.height = S;
    const x = c.getContext('2d');
    goldGround(x, S, S, 23);
    // medallion rings (rainbow of the Daphni type)
    const cx = S / 2;
    [['#25314e', 240], ['#3d5b8c', 226], ['#caa64a', 208]].forEach(([col, r]) => {
      x.fillStyle = col; x.beginPath(); x.arc(cx, cx, r, 0, 7); x.fill();
    });
    x.fillStyle = '#b08c34'; x.beginPath(); x.arc(cx, cx, 196, 0, 7); x.fill();
    const g = x.createRadialGradient(cx, cx, 30, cx, cx, 196);
    g.addColorStop(0, '#e2c477'); g.addColorStop(1, '#a9852f');
    x.fillStyle = g; x.beginPath(); x.arc(cx, cx, 196, 0, 7); x.fill();
    halo(x, cx, 190, 92, true);
    // himation: deep blue over gold-striated chiton
    robe(x, cx, 268, 300, 220, '#2c3f63', '#1a2947', 0.82);
    x.strokeStyle = '#c9a44e'; x.lineWidth = 4;
    for (let i = 0; i < 5; i++) {
      x.beginPath(); x.moveTo(cx - 90 + i * 22, 300);
      x.quadraticCurveTo(cx - 70 + i * 22, 380, cx - 96 + i * 26, 460); x.stroke();
    }
    // blessing hand + gospel
    x.fillStyle = '#c79a63';
    x.beginPath(); x.ellipse(cx + 108, 356, 26, 40, -0.5, 0, 7); x.fill();
    x.strokeStyle = '#7a5428'; x.lineWidth = 3;
    x.beginPath(); x.moveTo(cx + 96, 330); x.lineTo(cx + 104, 372); x.stroke();
    x.beginPath(); x.moveTo(cx + 112, 326); x.lineTo(cx + 116, 370); x.stroke();
    gospelBook(x, cx - 108, 372, 66);
    face(x, cx, 208, 72, { beard: 0.55, beardCol: '#4e3a24', hairCol: '#40301e' });
    inscription(x, 'ΙC', cx - 148, 96, 40, '#e8ddc2');
    inscription(x, 'ΧC', cx + 148, 96, 40, '#e8ddc2');
    return c;
  }

  /* Pendentives: six-winged seraph on transparent ground */
  function seraphCanvas() {
    const S = 512, c = document.createElement('canvas');
    c.width = c.height = S;
    const x = c.getContext('2d');
    const cx = S / 2, cy = S / 2;
    function wing(rot, len, spread, col) {
      x.save(); x.translate(cx, cy); x.rotate(rot);
      x.fillStyle = col;
      x.beginPath();
      x.moveTo(0, 0);
      x.quadraticCurveTo(spread, -len * 0.45, spread * 0.42, -len);
      x.quadraticCurveTo(0, -len * 0.7, -spread * 0.42, -len);
      x.quadraticCurveTo(-spread, -len * 0.45, 0, 0);
      x.fill();
      x.strokeStyle = 'rgba(58,26,14,0.55)'; x.lineWidth = 3;
      for (let i = -2; i <= 2; i++) {
        x.beginPath(); x.moveTo(0, -14);
        x.quadraticCurveTo(i * spread * 0.3, -len * 0.55, i * spread * 0.36, -len * 0.94);
        x.stroke();
      }
      x.restore();
    }
    wing(0, 216, 96, '#8c3524');            // upper pair (crossed above the face)
    wing(0.42, 208, 90, '#a44a2c');
    wing(-0.42, 208, 90, '#a44a2c');
    wing(Math.PI, 216, 96, '#7c2e20');      // lower pair
    wing(Math.PI - 0.42, 206, 88, '#94402a');
    wing(Math.PI + 0.42, 206, 88, '#94402a');
    wing(Math.PI / 2, 190, 84, '#b0603c');  // side pair
    wing(-Math.PI / 2, 190, 84, '#b0603c');
    halo(x, cx, cy - 6, 46);
    face(x, cx, cy - 2, 40, { hairCol: '#57402a' });
    return c;
  }

  /* standing church father (bishop with omophorion + gospel) */
  function fatherCanvas(name, beardCol, beardLen, seed) {
    const W = 160, H = 512, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    goldGround(x, W, H, seed);
    const cx = W / 2;
    halo(x, cx, 88, 44);
    robe(x, cx, 132, 118, 330, '#d8d2c4', '#a89e8a', 0.62);      // pale phelonion
    x.fillStyle = '#3c3830';                                      // feet line
    x.fillRect(cx - 34, 458, 68, 10);
    // omophorion: white stole with dark crosses
    x.fillStyle = '#efece2';
    x.fillRect(cx - 14, 132, 28, 300);
    x.fillStyle = '#3a2f4e';
    for (let j = 0; j < 3; j++) {
      const cy = 190 + j * 92;
      x.fillRect(cx - 4, cy - 16, 8, 32);
      x.fillRect(cx - 16, cy - 4, 32, 8);
    }
    gospelBook(x, cx - 30, 300, 40);
    face(x, cx, 96, 42, { beard: beardLen, beardCol: beardCol, hairCol: '#8d8272' });
    vertInscription(x, 'Ο', cx - 52, 150, 20, '#efe6c8');
    vertInscription(x, 'ΑΓΙΟC', cx - 52, 178, 20, '#efe6c8');
    vertInscription(x, name, cx + 52, 150, 20, '#efe6c8');
    return c;
  }

  /* Leo VI kneeling before Christ enthroned (over the Imperial Door) */
  function leoCanvas() {
    const W = 1024, H = 640, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    goldGround(x, W, H, 31);
    const cx = W / 2;
    // Christ enthroned (centre)
    x.fillStyle = '#caa64a'; x.fillRect(cx - 170, 250, 340, 240);   // throne
    x.fillStyle = '#5e6e8e'; x.beginPath(); x.ellipse(cx, 296, 168, 26, 0, 0, 7); x.fill();
    halo(x, cx, 150, 66, true);
    robe(x, cx, 236, 240, 260, '#2c3f63', '#1a2947', 0.66);
    x.fillStyle = '#c79a63';                                        // blessing hand
    x.beginPath(); x.ellipse(cx + 96, 356, 22, 34, -0.5, 0, 7); x.fill();
    gospelBook(x, cx - 92, 380, 58);
    face(x, cx, 172, 60, { beard: 0.5, beardCol: '#4e3a24', hairCol: '#40301e' });
    // Leo prostrate at right
    x.fillStyle = '#7a3a4e';                                        // imperial chlamys
    x.beginPath();
    x.moveTo(cx + 170, 520);
    x.quadraticCurveTo(cx + 260, 420, cx + 350, 470);
    x.lineTo(cx + 360, 520); x.closePath(); x.fill();
    halo(x, cx + 330, 452, 30);
    face(x, cx + 330, 460, 26, { beard: 0.4, beardCol: '#5c4632' });
    x.fillStyle = '#e9c96a';                                        // crown
    x.fillRect(cx + 312, 432, 36, 10);
    // Virgin medallion at left (as in the real lunette)
    x.strokeStyle = '#dfe6ee'; x.lineWidth = 5;
    x.beginPath(); x.arc(cx - 300, 240, 74, 0, 7); x.stroke();
    halo(x, cx - 300, 226, 38);
    x.fillStyle = '#5b2036';
    x.beginPath(); x.ellipse(cx - 300, 262, 46, 44, 0, 0, 7); x.fill();
    face(x, cx - 300, 236, 32, { hair: false });
    inscription(x, 'ΙC ΧC', cx, 66, 42, '#e8ddc2');
    return c;
  }

  /* The Deesis (south gallery): Christ between the Virgin and the Forerunner */
  function deesisCanvas() {
    const W = 1024, H = 640, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const x = c.getContext('2d');
    goldGround(x, W, H, 47);
    const cx = W / 2;
    // Christ (bust, centre)
    halo(x, cx, 190, 96, true);
    robe(x, cx, 254, 330, 386, '#2c3f63', '#1a2947', 0.62);
    x.strokeStyle = '#c9a44e'; x.lineWidth = 4;
    x.beginPath(); x.moveTo(cx - 60, 330); x.quadraticCurveTo(cx - 30, 430, cx - 66, 560); x.stroke();
    gospelBook(x, cx - 96, 470, 70);
    x.fillStyle = '#c79a63';
    x.beginPath(); x.ellipse(cx + 100, 458, 26, 40, -0.5, 0, 7); x.fill();
    face(x, cx, 216, 80, { beard: 0.5, beardCol: '#57402a', hairCol: '#493623' });
    // Virgin (left, inclined toward Christ)
    halo(x, cx - 350, 240, 66);
    x.fillStyle = '#5b2036';
    x.beginPath();
    x.moveTo(cx - 456, 640); x.lineTo(cx - 444, 330);
    x.quadraticCurveTo(cx - 430, 218, cx - 342, 210);
    x.quadraticCurveTo(cx - 262, 226, cx - 252, 350);
    x.lineTo(cx - 244, 640); x.closePath(); x.fill();
    face(x, cx - 344, 262, 52, { hair: false });
    x.fillStyle = '#e9c96a';
    x.save(); x.translate(cx - 344, 218);
    for (let i = 0; i < 4; i++) { x.rotate(Math.PI / 4); x.fillRect(-1.4, -6, 2.8, 12); }
    x.restore();
    // the Forerunner (right, unkempt, mourning)
    halo(x, cx + 350, 240, 66);
    x.fillStyle = '#5a5238';
    x.beginPath();
    x.moveTo(cx + 244, 640); x.lineTo(cx + 252, 350);
    x.quadraticCurveTo(cx + 262, 224, cx + 348, 212);
    x.quadraticCurveTo(cx + 434, 224, cx + 446, 340);
    x.lineTo(cx + 456, 640); x.closePath(); x.fill();
    face(x, cx + 346, 264, 52, { beard: 0.85, beardCol: '#4e3e2a', hairCol: '#3e3220' });
    x.strokeStyle = '#3e3220'; x.lineWidth = 4;                    // wild locks
    for (let i = -2; i <= 2; i++) {
      x.beginPath(); x.moveTo(cx + 346 + i * 16, 222);
      x.quadraticCurveTo(cx + 346 + i * 26, 250, cx + 346 + i * 22, 288); x.stroke();
    }
    inscription(x, 'ΜΡ ΘΥ', cx - 350, 128, 36, '#dfe6ee');
    inscription(x, 'ΙC ΧC', cx, 74, 40, '#e8ddc2');
    inscription(x, 'Ο ΠΡΟΔΡΟΜΟC', cx + 350, 128, 30, '#dfe6ee');
    return c;
  }

  /* ---------- build the meshes ---------- */
  HS.buildIcons = function (world) {
    const D = HS.DIM;
    const grp = HS.iconGroup = new THREE.Group();
    grp.name = 'icons';
    world.add(grp);

    function tex(c) {
      const t = new THREE.CanvasTexture(c);
      t.colorSpace = THREE.SRGBColorSpace;
      t.anisotropy = 8;
      return t;
    }
    function mosaicMat(c, transparent) {
      return new THREE.MeshStandardMaterial({
        map: tex(c), metalness: 0.55, roughness: 0.42,
        transparent: !!transparent, side: THREE.DoubleSide,
        emissive: 0x171006, polygonOffset: true, polygonOffsetFactor: -1
      });
    }

    // 1 · apse conch: the Theotokos (curved overlay 5 cm inside the conch)
    {
      const g = new THREE.SphereGeometry(D.apseR - 0.06, 48, 20, 0, Math.PI, 0, Math.PI / 2);
      g.rotateY(Math.PI / 2);
      const m = new THREE.Mesh(g, mosaicMat(theotokosCanvas()));
      m.position.set(D.apseCX, 15.0, 0);
      grp.add(m);
    }

    // 2 · dome crown: Pantokrator medallion (covers the 537 cross when visible)
    {
      const m = new THREE.Mesh(new THREE.CircleGeometry(4.15, 48), mosaicMat(pantokratorCanvas()));
      m.rotation.x = Math.PI / 2;
      m.position.y = D.archCrownY + D.domeRise - 0.38;
      grp.add(m);
    }

    // 3 · four seraphim on the pendentives
    {
      const c = seraphCanvas();
      const Rp = D.R * Math.SQRT2;
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
        const dir = new THREE.Vector3(sx * 0.65, 0.4, sz * 0.65).normalize();
        const p = dir.clone().multiplyScalar(Rp - 0.14);
        p.y += D.springY;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 8.2), mosaicMat(c, true));
        m.position.copy(p);
        m.lookAt(0, D.springY + 1.5, 0);
        grp.add(m);
      }
    }

    // 4 · church fathers in the tympana niches (between the lower lights)
    {
      const names = ['ΙΩΑΝΝΗC', 'ΒΑCΙΛΕΙΟC', 'ΓΡΗΓΟΡΙΟC', 'ΝΙΚΟΛΑΟC', 'ΙΓΝΑΤΙΟC', 'ΑΘΑΝΑCΙΟC'];
      const beards = [[0.75, '#8d8272'], [0.95, '#5c4632'], [0.8, '#9a9082'], [0.65, '#b0a89a'], [0.55, '#6e5c44'], [0.85, '#7a6a52']];
      let k = 0;
      for (const s of [-1, 1]) for (const px of [-9.25, -5.55, -1.85, 1.85, 5.55, 9.25]) {
        const i = k % 6;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(1.32, 4.25),
          mosaicMat(fatherCanvas(names[i], beards[i][1], beards[i][0], 61 + k)));
        m.position.set(px, 26.7, s * 15.36);
        m.rotation.y = s > 0 ? Math.PI : 0;
        grp.add(m);
        k++;
      }
    }

    // 5 · Leo VI before Christ, over the Imperial Door (narthex side)
    {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(4.4, 2.75), mosaicMat(leoCanvas()));
      m.position.set(D.narthexW - 0.06, 9.35, 0);
      m.rotation.y = -Math.PI / 2;
      grp.add(m);
    }

    // 6 · the Deesis, south gallery (walk there from the loge)
    {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 4.25), mosaicMat(deesisCanvas()));
      m.position.set(9.5, 16.4, D.aisleZ1 - 0.08);
      m.rotation.y = Math.PI;
      grp.add(m);
      // simple marble frame
      const fr = new THREE.Mesh(new THREE.BoxGeometry(7.3, 4.7, 0.1), HS.mats.proc);
      fr.position.set(9.5, 16.4, D.aisleZ1 - 0.02);
      grp.add(fr);
    }

    HS.setIcons = function (on) { grp.visible = on; };
  };
})();
