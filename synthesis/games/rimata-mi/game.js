// ============================================================
//  ΡΗΜΑΤΑ ΣΕ -ΜΙ — Game Controller
//  Includes verb picker on settings screen
//  Depends on: rimata-mi/data.js, shared-engine.js
// ============================================================

const RMI_PREFIX = 'rmi';
let _rmiFilter = null;

function openRimataMi(levelId, mode) {
  document.getElementById('rmi-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('rmi-screen-levels')) _rmiBuild();
  // Auto-navigate to a specific level+mode when QR-scanned
  if (levelId) {
    setTimeout(() => {
      const card = document.querySelector(`#rmi-level-grid .lvl-card[data-lvl-id="${levelId}"]`);
      if (card) card.click();
      if (mode) setTimeout(() => gramSetMode('rmi', mode), 60);
    }, 60);
  }
}
function closeRimataMi() {
  (_gramCleanup['rmi']||function(){})();
  document.getElementById('rmi-overlay').classList.remove('active');
  document.body.style.overflow = '';
  const wrap=document.getElementById('rmi-wrap');
  if(wrap){wrap.querySelectorAll('.lyo-screen').forEach(s=>s.classList.remove('active'));document.getElementById('rmi-screen-levels')?.classList.add('active');}
}

function _rmiBuild() {
  const wrap = document.getElementById('rmi-wrap');
  wrap.innerHTML = gramBuildScreens(RMI_PREFIX, 'Ρήματα σε -μι', 'δείκνυμι · δίδωμι · τίθημι · ἵστημι · ἵημι — Ενεστώτας, Παρατατικός, Αόριστος Β΄');
  wrap.querySelectorAll('select').forEach(s => {
    s.style.cssText = 'width:100%;padding:9px 12px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:0.93rem;cursor:pointer;font-family:inherit;';
  });

  // Verb selector — inject into verb-selector div
  const vsel = document.getElementById('rmi-verb-selector');
  if (vsel) {
    vsel.innerHTML = `
      <h3>Επίλεξε Ρήματα</h3>
      <div class="lcheck-grid" id="rmi-verb-pills" style="margin-bottom:18px;">
        ${RMI_VERBS.map(v => `
          <label class="lcheck-pill checked" style="cursor:pointer;">
            <input type="checkbox" value="${v.verb}" checked style="display:none;">
            <span>${v.label}</span>
          </label>`).join('')}
      </div>`;
    // Wire checkbox toggles
    vsel.querySelectorAll('.lcheck-pill').forEach(l => {
      l.querySelector('input').addEventListener('change', function() {
        l.classList.toggle('checked', this.checked);
      });
    });
  }

  gramBuildLevelGrid(RMI_PREFIX, RMI_LEVELS, lvl => {
    _rmiFilter = Object.assign({}, lvl.filter);
    document.getElementById('rmi-sett-title').textContent = `Επίπεδο ${lvl.id} — ${lvl.desc}`;
    document.getElementById('rmi-sett-back').onclick = () => {
      document.querySelectorAll('#rmi-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
      document.getElementById('rmi-screen-levels').classList.add('active');
    };
    document.querySelectorAll('#rmi-wrap .lyo-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('rmi-screen-settings').classList.add('active');
  });

  document.getElementById('rmi-launch-btn').onclick = _rmiLaunch;
  // end-btn is wired by gramRunGame so the timer is always stopped cleanly

  gramBuildKeyboard(RMI_PREFIX);
  gramSetMode(RMI_PREFIX, 'mc');
}

function _rmiLaunch() {
  if (!_rmiFilter) return;

  // Override verbs based on user's pill selection
  const selectedVerbs = Array.from(
    document.querySelectorAll('#rmi-verb-pills input:checked')
  ).map(i => i.value);

  if (!selectedVerbs.length) {
    alert('Επίλεξε τουλάχιστον ένα ρήμα!'); return;
  }

  // Intersect with level's verbs (if level restricts to specific verbs)
  const levelVerbs = _rmiFilter.verbs;
  const verbs = levelVerbs
    ? levelVerbs.filter(v => selectedVerbs.includes(v))
    : selectedVerbs;

  if (!verbs.length) {
    alert('Κανένα από τα επιλεγμένα ρήματα δεν περιλαμβάνεται σε αυτό το επίπεδο.');
    return;
  }

  const filter = Object.assign({}, _rmiFilter, { verbs });
  const time   = parseInt(document.getElementById('rmi-sel-time').value);
  const lives  = parseInt(document.getElementById('rmi-sel-lives').value);

  gramRunGame({
    prefix: RMI_PREFIX,
    G:      RMI_G,
    keysFn: rmiKeys,
    stemFn: rmiGetStem,
    qtFn:   rmiBuildQText,
    filter,
    mode:   gramGetMode(RMI_PREFIX),
    lives,
    timer:  time,
    wrapId: 'rmi-wrap',
  });
}
