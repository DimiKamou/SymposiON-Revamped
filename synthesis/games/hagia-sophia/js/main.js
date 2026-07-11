/* ============================================================
   Hagia Sophia 537 — main.js
   Boot, render loop, HUD wiring, day/dusk + lamps + sound
   toggles, exhibit panel, teleports, language, screenshot mode.
   URL params:
     ?shot=x,y,z,yawDeg,pitchDeg   spectate camera + auto-ready
     &mode=dusk                     start at dusk
     &hud=0                         hide HUD (for screenshots)
     &lang=gr|en                    interface language
     &start=nave                    spawn at the Imperial Door
   ============================================================ */
(function () {
  const Q = {};
  location.search.replace(/[?&]([^=&]+)=?([^&]*)/g, (_, k, v) => { Q[k] = decodeURIComponent(v); });

  const LANG = (Q.lang === 'gr' || Q.lang === 'el') ? 'gr' : 'en';
  HS.lang = LANG;
  const $ = id => document.getElementById(id);

  /* ---------- renderer / scene ---------- */
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  document.body.appendChild(renderer.domElement);
  HS.renderer = renderer;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x39332a, 0.0022);
  HS.scene = scene;
  const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.08, 900);

  HS.applyEnv(scene, renderer);
  HS.hideSet = new Set((Q.hide || '').split(',').filter(Boolean));   // debug bisection
  const world = new THREE.Group();
  scene.add(world);

  /* ---------- build ---------- */
  HS.buildNave(world);
  HS.buildAisles(world);
  HS.buildEast(world);
  HS.buildWest(world);
  HS.flushColumns(world);
  HS.buildIcons(world);
  HS.buildLighting(scene, world);
  HS.buildExhibits(world);
  let iconsOn = Q.icons !== '0';          // the later icon-layer, on by default
  HS.setIcons(iconsOn);

  /* ---------- controls ---------- */
  const controls = new HS.Controls(camera, renderer.domElement);
  HS.controls = controls;
  if (Q.start === 'nave') controls.teleport(-27.5, 0, -Math.PI / 2);
  const ambience = new HS.Ambience();

  /* ---------- day/dusk + lamps ---------- */
  HS.shaftsOn = true;
  HS.setDusk(Q.mode === 'dusk');

  /* ---------- screenshot / spectate mode ---------- */
  const SHOT = !!Q.shot;
  if (SHOT) {
    const p = Q.shot.split(',').map(Number);
    controls.spectate = true;
    controls.pos.set(p[0] || 0, p[1] || 2, p[2] || 0);
    controls.yaw = HS.rad(p[3] || 0);
    controls.pitch = HS.rad(p[4] || 0);
    document.body.classList.add('shot');
  }
  const HUD_ON = SHOT ? Q.hud === '1' : Q.hud !== '0';
  if (!HUD_ON) $('hud').style.display = 'none';
  if (SHOT) $('intro').style.display = 'none';

  /* ---------- intro / HUD wiring ---------- */
  const TXT = {
    enter: { en: 'Enter the Great Church', gr: 'Είσοδος στη Μεγάλη Εκκλησία' },
    nave: { en: 'Skip to the nave', gr: 'Κατευθείαν στον κυρίως ναό' },
    day: { en: 'Day', gr: 'Ημέρα' }, dusk: { en: 'Dusk', gr: 'Νύχτα' },
    resume: { en: 'Click to continue', gr: 'Κλικ για συνέχεια' },
    interact: { en: 'read the exhibit', gr: 'διαβάστε το έκθεμα' },
  };
  function applyLang() {
    document.querySelectorAll('[data-en]').forEach(el => {
      el.innerHTML = el.dataset[HS.lang] || el.dataset.en;
    });
    $('btn-lang').textContent = HS.lang === 'en' ? 'ΕΛ' : 'EN';
  }
  applyLang();

  $('btn-enter').addEventListener('click', () => { hideIntro(); controls.lock(); });
  $('btn-nave').addEventListener('click', () => {
    controls.teleport(-27.5, 0, -Math.PI / 2);
    hideIntro(); controls.lock();
  });
  function hideIntro() { $('intro').classList.add('gone'); }
  HS.onLockChange = function (locked) {
    if (!locked && !HS.touchMode && $('intro').classList.contains('gone'))
      $('pause').classList.add('show');
    else $('pause').classList.remove('show');
  };
  $('pause').addEventListener('click', () => { $('pause').classList.remove('show'); controls.lock(); });

  $('btn-lang').addEventListener('click', e => {
    e.stopPropagation();
    HS.lang = HS.lang === 'en' ? 'gr' : 'en';
    applyLang();
    if (openEx) showPanel(openEx);
    renderList();
  });
  $('btn-mode').addEventListener('click', e => { e.stopPropagation(); HS.setDusk(!HS.isDusk); syncButtons(); });
  $('btn-icons').addEventListener('click', e => { e.stopPropagation(); iconsOn = !iconsOn; HS.setIcons(iconsOn); syncButtons(); });
  $('btn-lamps').addEventListener('click', e => { e.stopPropagation(); lampsOn = !lampsOn; HS.setLampsVisible(lampsOn); syncButtons(); });
  $('btn-sound').addEventListener('click', e => { e.stopPropagation(); ambience.setOn(!ambience.isOn()); syncButtons(); });
  $('btn-list').addEventListener('click', e => { e.stopPropagation(); $('list').classList.toggle('show'); });
  $('btn-help').addEventListener('click', e => { e.stopPropagation(); $('intro').classList.remove('gone'); });
  let lampsOn = true;
  function syncButtons() {
    $('btn-mode').innerHTML = HS.isDusk ? '☀ ' + TXT.day[HS.lang] : '🌙 ' + TXT.dusk[HS.lang];
    $('btn-icons').style.opacity = iconsOn ? 1 : 0.45;
    $('btn-lamps').style.opacity = lampsOn ? 1 : 0.45;
    $('btn-sound').style.opacity = ambience.isOn() ? 1 : 0.45;
  }
  syncButtons();

  /* exhibit index (drawer) */
  function renderList() {
    const ul = $('list-items'); ul.innerHTML = '';
    HS.EXHIBITS.forEach(ex => {
      const li = document.createElement('button');
      li.className = 'list-item';
      li.innerHTML = '<span class="ln">' + ex.n + '</span>' + ex.title[HS.lang];
      li.addEventListener('click', () => {
        const v = ex.view;                       // [x, z, yaw, pitch?]
        controls.teleport(v[0], v[1], v[2], ex.viewY);
        controls.pitch = v[3] || 0;
        $('list').classList.remove('show');
        showPanel(ex);
        if (!HS.touchMode) controls.lock();
      });
      ul.appendChild(li);
    });
  }
  renderList();

  /* info panel */
  let openEx = null, nearEx = null;
  function showPanel(ex) {
    openEx = ex;
    $('panel-n').textContent = ex.n + ' / ' + HS.EXHIBITS.length;
    $('panel-title').textContent = ex.title[HS.lang];
    $('panel-sub').textContent = ex.sub[HS.lang];
    $('panel-body').textContent = ex.body[HS.lang];
    $('panel').classList.add('show');
  }
  function hidePanel() { openEx = null; $('panel').classList.remove('show'); }
  $('panel-close').addEventListener('click', e => { e.stopPropagation(); hidePanel(); });

  HS.onKey = function (code) {
    if (code === 'KeyE' && !controls.spectate) {
      if (openEx) hidePanel();
      else if (nearEx) showPanel(nearEx);
    }
    if (code === 'KeyN') { HS.setDusk(!HS.isDusk); syncButtons(); }
    if (code === 'KeyI') { iconsOn = !iconsOn; HS.setIcons(iconsOn); syncButtons(); }
    if (code === 'KeyL') { lampsOn = !lampsOn; HS.setLampsVisible(lampsOn); syncButtons(); }
    if (code === 'KeyM') $('map-wrap').classList.toggle('hidden');
    if (code === 'Tab') $('list').classList.toggle('show');
  };

  /* ---------- resize ---------- */
  addEventListener('resize', () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
  });

  /* ---------- loop ---------- */
  if (Q.panel) {                       // e.g. &panel=dome (screenshot testing)
    const ex = HS.EXHIBITS.find(e => e.id === Q.panel);
    if (ex) { showPanel(ex); document.body.classList.remove('shot'); }
  }

  const mapCanvas = $('map');
  const clock = new THREE.Clock();
  let frames = 0, mapTick = 0;
  function loop() {
    requestAnimationFrame(loop);
    const dt = clock.getDelta();
    const t = clock.elapsedTime;
    controls.update(dt);
    HS.tickFlames(t);
    ambience.tickSteps(dt, controls.moving, controls.running);

    if (HUD_ON) {
      nearEx = HS.tickExhibits(t, controls.pos);
      const hint = $('hint');
      if (nearEx && !openEx) {
        hint.classList.add('show');
        hint.innerHTML = (HS.touchMode ? '👆 ' : '<b>E</b> — ') +
          '<i>' + nearEx.title[HS.lang] + '</i>';
      } else hint.classList.remove('show');
      if (HS.touchMode && nearEx && !openEx && !hint.dataset.bound) {
        hint.dataset.bound = 1;
        hint.addEventListener('touchstart', ev => { ev.stopPropagation(); if (nearEx) showPanel(nearEx); });
      }
      if ((mapTick++ & 3) === 0)
        HS.drawMinimap(mapCanvas, controls.pos, controls.yaw, nearEx && nearEx.id);
    }
    renderer.render(scene, camera);
    frames++;
    if (SHOT && frames === 8) { document.title = 'HS-READY'; window.__HS_READY = true; }
  }
  loop();
})();
