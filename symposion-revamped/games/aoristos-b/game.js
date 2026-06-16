// ============================================================
//  ΑΟΡΙΣΤΟΣ Β΄ — Game Controller
//  Depends on: aoristos-b/data.js, shared-engine.js
// ============================================================

const AOB_PREFIX = 'aob';
let _aobFilter = null;

function openAoristosB(levelId, mode) {
  document.getElementById('aob-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('aob-screen-levels')) _aobBuild();
  // Auto-navigate to a specific level+mode when QR-scanned
  if (levelId) {
    setTimeout(() => {
      const card = document.querySelector(`#aob-level-grid .lvl-card[data-lvl-id="${levelId}"]`);
      if (card) card.click();
      if (mode) setTimeout(() => gramSetMode('aob', mode), 60);
    }, 60);
  }
}
function closeAoristosB() {
  (_gramCleanup['aob']||function(){})();
  document.getElementById('aob-overlay').classList.remove('active');
  document.body.style.overflow = '';
  const wrap=document.getElementById('aob-wrap');
  if(wrap){wrap.querySelectorAll('.lyo-screen').forEach(s=>s.classList.remove('active'));document.getElementById('aob-screen-levels')?.classList.add('active');}
}

function _aobBuild() {
  const wrap = document.getElementById('aob-wrap');
  wrap.innerHTML = gramBuildScreens(AOB_PREFIX, 'Αόριστος Β΄', '20 ρήματα με ανώμαλο αόριστο β΄ — Πλήρης κλίση');
  wrap.querySelectorAll('select').forEach(s => {
    s.style.cssText = 'width:100%;padding:9px 12px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:0.93rem;cursor:pointer;font-family:inherit;';
  });

  gramBuildLevelGrid(AOB_PREFIX, AOB_LEVELS, lvl => {
    _aobFilter = lvl.filter;
    document.getElementById('aob-sett-title').textContent = `Επίπεδο ${lvl.id} — ${lvl.desc}`;
    document.getElementById('aob-sett-back').onclick = () => {
      document.querySelectorAll('#aob-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
      document.getElementById('aob-screen-levels').classList.add('active');
    };
    document.querySelectorAll('#aob-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('aob-screen-settings').classList.add('active');
  });

  document.getElementById('aob-launch-btn').onclick = _aobLaunch;
  // end-btn is wired by gramRunGame so the timer is always stopped cleanly

  gramBuildKeyboard(AOB_PREFIX);
  gramSetMode(AOB_PREFIX, 'mc');
}

function _aobLaunch() {
  if (!_aobFilter) return;
  // Add default forms if not specified in filter
  const filter = Object.assign({
    forms: [...AOBP, ...AOBIP, "απαρέμφατο", "μετοχή"]
  }, _aobFilter);

  const time  = parseInt(document.getElementById('aob-sel-time').value);
  const lives = parseInt(document.getElementById('aob-sel-lives').value);
  gramRunGame({
    prefix: AOB_PREFIX,
    G:      AOB_G,
    keysFn: aobKeys,
    stemFn: aobGetStem,
    qtFn:   aobBuildQText,
    filter,
    mode:   gramGetMode(AOB_PREFIX),
    lives,
    timer:  time,
    wrapId: 'aob-wrap',
  });
}
