// ============================================================
//  SymposiON Command Center — Admin Panel
//  Replaces the old tabbed admin panel.
//  Entry points (kept from old API):
//    navToAdmin()            — nav entry
//    _showAdminInCurrentTab()— called by auth.js after login
//    _renderAdminPage()      — (re)renders the open panel
// ============================================================
(function () {
'use strict';

// ── helpers ──────────────────────────────────────────────────
const esc = s => String(s == null ? '' : s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const fmtDate = ts => ts?.toDate?.()?.toLocaleDateString('el-GR') || ts?.toLocaleDateString?.('el-GR') || '—';
const $ = id => document.getElementById(id);

// ── DOMAINS config ───────────────────────────────────────────
const DOMAINS = [
  { id:'system',     icon:'⚙',  label:'System',        sub:'Stats, roles, audit log.',
    cats:[
      { id:'stats',       label:'Dashboard',      view:'stats'      },
      { id:'roles',       label:'Roles & Access', view:'roles'      },
      { id:'audit',       label:'Audit Log',      view:'audit'      },
    ]},
  { id:'games',      icon:'🎮', label:'Games',          sub:'Engines, datasets, tiers and tags.',
    cats:[
      { id:'engines',     label:'Engines',        view:'engines'    },
      { id:'datasets',    label:'Datasets',       view:'datasets'   },
      { id:'sync',        label:'🔍 Registry Sync', view:'sync'     },
    ]},
  { id:'curriculum', icon:'📚', label:'Curriculum',     sub:'Per-class datasets, levels and engines.',
    cats:[
      { id:'classplan',   label:'Class Plan',     view:'classplan'  },
    ]},
  { id:'users',      icon:'👥', label:'Users',          sub:'Grants, mass import & progression.',
    cats:[
      { id:'access',      label:'Access Grants',  view:'access'     },
      { id:'progression', label:'Progression',    view:'progression' },
      { id:'import',      label:'Mass Add',        view:'import'    },
    ]},
  { id:'subs',       icon:'📐', label:'Subscriptions',  sub:'Plans, coupons, pricing & tier locks.',
    cats:[
      { id:'tiers',       label:'🔒 Lock & Unlock', view:'tiers'    },
      { id:'plans',       label:'Pricing',         view:'plans'     },
      { id:'coupons',     label:'Coupons',         view:'coupons'   },
    ]},
  { id:'content',    icon:'📖', label:'Content',        sub:'Temple, Anodos, pages & banners.',
    cats:[
      { id:'temple',      label:'Curator\'s Console', view:'temple' },
      { id:'anodos',      label:'Anodos',          view:'anodos'    },
      { id:'pages',       label:'Pages',           view:'pages'     },
      { id:'banners',     label:'Announcements',   view:'banners'   },
    ]},
  { id:'site',       icon:'🗺', label:'Site Studio',    sub:'Navigate & edit the live catalog and game content — no redeploy.',
    cats:[
      { id:'studio',      label:'Catalog & Content', view:'studio' },
    ]},
  { id:'support',    icon:'🛠', label:'Support',        sub:'Feedback inbox.',
    cats:[
      { id:'feedback',    label:'Feedback',        view:'feedback'  },
    ]},
];

// ── STATE ─────────────────────────────────────────────────────
let _dom = 'system', _cat = 'stats', _actingAs = 'super';

// ── ROLE DEFINITIONS ──────────────────────────────────────────
const ROLES = [
  { id:'super',   nm:'Super-admin',         domains:'*',                               note:'Everything + Kill Switch + billing' },
  { id:'content', nm:'Content editor',      domains:['content','site'],                note:'Temple, Anodos, pages, banners, Site Studio' },
  { id:'support', nm:'Support / Moderator', domains:['support','users'],               note:'Feedback, user lookup' },
  { id:'finance', nm:'Finance',             domains:['subs'],                          note:'Pricing & coupons' },
];
const roleCan = (roleId, domainId) => {
  const r = ROLES.find(x => x.id === roleId);
  return r && (r.domains === '*' || r.domains.includes(domainId));
};

// ── SHELL ─────────────────────────────────────────────────────
function _shell() {
  return `
    <div class="cc-emg" id="cc-emg">
      <span class="cc-emg-pulse"></span>
      <span class="cc-emg-lbl">Global&nbsp;Emergency</span>
      <span class="cc-emg-state" id="cc-emg-state">SYSTEMS NOMINAL</span>
      <span class="cc-emg-spacer"></span>
      <span class="cc-emg-ctl">Wildcard Access
        <button class="cc-tg cc-sm" id="cc-wildTg" onclick="ccToggleWild()"></button>
      </span>
      <button class="cc-emg-kill" onclick="ccOpenKill()">⏻ Kill Switch</button>
    </div>

    <div class="cc-top">
      <div class="cc-brand">
        <svg class="cc-sig" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="square">
          <line x1="22" y1="20" x2="78" y2="20"/><line x1="22" y1="20" x2="48" y2="50"/>
          <line x1="48" y1="50" x2="22" y2="80"/><line x1="22" y1="80" x2="78" y2="80"/>
          <g stroke="#C8512E" stroke-width="2.8">
            <circle cx="64" cy="50" r="12" stroke-dasharray="62 12" stroke-dashoffset="-7" transform="rotate(-90 64 50)"/>
            <line x1="64" y1="39" x2="64" y2="49"/>
          </g>
        </svg>
        <div><div class="cc-nm">Symposi<b>ON</b></div><span class="cc-sub">COMMAND CENTER</span></div>
      </div>
      <div class="cc-top-spacer"></div>
      <div class="cc-actas">
        <span class="cc-aa-l">Acting&nbsp;as</span>
        <select class="cc-role-sw" id="cc-actAs" onchange="ccActAs(this.value)">
          ${ROLES.map(r => `<option value="${r.id}"${_actingAs===r.id?' selected':''}>${esc(r.nm)}</option>`).join('')}
        </select>
      </div>
      <div class="cc-who">
        <div class="cc-wt">
          <div class="a">${esc((typeof currentUser !== 'undefined' && currentUser?.displayName) || 'Admin')}</div>
          <div class="b">super-admin · ${esc((typeof currentUser !== 'undefined' && currentUser?.email) || '')}</div>
        </div>
        <div class="cc-av">${esc(((typeof currentUser !== 'undefined' && currentUser?.displayName) || 'A')[0])}</div>
      </div>
    </div>

    <div class="cc-shell-wrap">
      <nav class="cc-drail">
        <div class="cc-drail-lbl">Domains</div>
        <div id="cc-dom-list"></div>
        <div class="cc-drail-foot">
          <div class="cc-meander"></div>
          <div class="cc-ft">command-center.js<br/>12 engines · 18 datasets</div>
        </div>
      </nav>
      <main class="cc-work" id="cc-work"></main>
    </div>

    <div class="cc-scrim" id="cc-kill-scrim">
      <div class="cc-modal">
        <h2><span class="x">⏻</span> Arm Kill Switch?</h2>
        <p>Sets the platform to <b>read-only</b> for every user immediately. Games, checkout, and progression writes are frozen.</p>
        <div class="cc-conf">Written to <span style="color:var(--cc-bronze)">adminAudit/</span></div>
        <div class="cc-mbtns">
          <button class="cc-mbtn" onclick="ccCloseKill()">Cancel</button>
          <button class="cc-mbtn danger" onclick="ccConfirmKill()">Yes — freeze platform</button>
        </div>
      </div>
    </div>

    <div class="cc-scrim" id="cc-confirm-scrim" onclick="if(event.target===this)ccConfirmNo()">
      <div class="cc-modal" id="cc-confirm-modal"></div>
    </div>

    <div class="cc-toast" id="cc-toast"><span class="cc-ti">◈</span><span id="cc-toast-txt"></span></div>
  `;
}

// ── RAIL ──────────────────────────────────────────────────────
function _renderRail() {
  const list = $('cc-dom-list'); if (!list) return;
  list.innerHTML = DOMAINS.map(d => {
    const locked = !roleCan(_actingAs, d.id);
    return `<button class="cc-dom${_dom===d.id?' on':''}${locked?' locked':''}"
      onclick="ccGoDom('${d.id}')" title="${locked?'Restricted':''}">
      <span class="cc-di">${d.icon}</span>
      <span class="cc-dx"><span class="cc-dl">${esc(d.label)}</span></span>
      <span class="cc-dc">${locked?'🔒':d.cats.length}</span>
    </button>`;
  }).join('');
}

// ── WORK AREA ────────────────────────────────────────────────
function _renderWork() {
  const work = $('cc-work'); if (!work) return;
  const domain = DOMAINS.find(d => d.id === _dom);
  if (!domain) return;
  const cat = domain.cats.find(c => c.id === _cat) || domain.cats[0];

  work.innerHTML = `
    <div class="cc-crumb">
      <span class="root">Admin</span><span class="sep">›</span>
      <span class="c">${esc(domain.label)}</span><span class="sep">›</span>
      <span class="cur">${esc(cat.label)}</span>
    </div>
    <div class="cc-whead">
      <h1>${esc(domain.label)} <em>· ${esc(cat.label)}</em></h1>
      <p>${esc(domain.sub)}</p>
    </div>
    <div class="cc-cats">
      ${domain.cats.map(c =>
        `<button class="cc-cat${c.id===cat.id?' on':''}" onclick="ccGoCat('${c.id}')">${esc(c.label)}</button>`
      ).join('')}
    </div>
    <div class="cc-panel" id="cc-panel"></div>
  `;
  _renderView(cat.view);
}

function _renderView(viewKey) {
  const panel = $('cc-panel'); if (!panel) return;
  const fn = VIEWS[viewKey];
  panel.innerHTML = fn ? fn() : _stub(viewKey);
  if (typeof fn?._init === 'function') fn._init();
  // Trigger async data loads
  const loader = VIEW_LOADERS[viewKey];
  if (loader) loader();
}

function _stub(key) {
  return `<div class="cc-stub">
    <div class="cc-stub-ic">🏗</div>
    <h3>Under construction</h3>
    <p>The <b>${esc(key)}</b> view is being built. The feature will appear here soon.</p>
  </div>`;
}

// ── VIEWS ─────────────────────────────────────────────────────
const VIEWS = {};

// ── Site · Studio (heavy UI delegated to js/admin-studio.js) ──
VIEWS.studio = () => (window.AdminStudio ? window.AdminStudio.view() : _stub('studio'));
VIEWS.studio._init = () => { if (window.AdminStudio) window.AdminStudio.init(); };

// ── System · Dashboard ──
VIEWS.stats = () => `
  <div class="cc-stat-grid" id="cc-stats-grid">
    ${['Users','Pro users','Active coupons','Active banners','Admin audit entries']
      .map((l,i) => `<div class="cc-stat-card"><div class="sv" id="cc-stat-${i}">…</div><div class="sl">${l}</div></div>`)
      .join('')}
  </div>
  <div class="cc-card" style="margin-top:16px">
    <h3 class="cc-ph">Recent activity</h3>
    <div id="cc-audit-preview"><div style="color:var(--cc-shale);font-size:13px">Loading…</div></div>
  </div>`;

// ── System · Roles & Access ──
VIEWS.roles = () => {
  const cards = ROLES.map(r => `
    <div class="cc-role-card${_actingAs===r.id?' on':''}">
      <div class="cc-role-hd">
        <span class="cc-role-nm">${esc(r.nm)}</span>
        ${_actingAs===r.id
          ? '<span class="cc-role-now">◈ acting now</span>'
          : `<button class="cc-act" style="padding:5px 10px;font-size:11px" onclick="ccActAs('${r.id}')">View as →</button>`}
      </div>
      <div class="cc-role-dom">
        ${r.domains==='*'
          ? '<span class="cc-role-all">All domains + privileged actions</span>'
          : r.domains.map(d=>`<span class="cc-role-chip">${esc(d)}</span>`).join('')}
      </div>
      <div class="cc-role-note">${esc(r.note)}</div>
    </div>`).join('');

  return `
    <div class="cc-note"><b>Least-privilege roles.</b> Each teammate gets only the domains their job needs. A <b>Super-admin</b> can arm the Kill Switch and manage roles. Use <b>Acting as</b> above to watch the panel lock down live.</div>
    <h3 class="cc-ph">Role definitions</h3>
    <div class="cc-role-grid">${cards}</div>
    <div class="cc-card">
      <h3 class="cc-ph">Assign a role <span class="cc-ph-r">calls setAdminRole Cloud Function</span></h3>
      <div class="cc-note">After assigning a role, the user must <b>log out and back in</b> (or wait up to 1 hour) for the new claim to take effect.</div>
      <label class="cc-fl">Target email</label>
      <input class="cc-inp" id="cc-role-email" placeholder="editor@example.com"/>
      <label class="cc-fl">Role</label>
      <select class="cc-sel" id="cc-role-sel">
        ${ROLES.map(r=>`<option value="${r.id}">${esc(r.nm)}</option>`).join('')}
        <option value="">— Revoke (null) —</option>
      </select>
      <div style="margin-top:14px">
        <button class="cc-act primary" onclick="ccSetRole()"><span>＋</span> Assign role</button>
      </div>
      <div class="cc-result" id="cc-role-result"></div>
    </div>`;
};

// ── System · Audit Log ──
VIEWS.audit = () => `
  <div class="cc-card">
    <h3 class="cc-ph">Audit log · every admin mutation <span class="cc-ph-r">adminAudit/ (read-only for clients)</span></h3>
    <div id="cc-audit-list"><div style="color:var(--cc-shale);font-size:13px">Loading…</div></div>
  </div>`;

// ── Users · Access Grants ──
VIEWS.access = () => `
  <div class="cc-grid2">
    <div class="cc-card">
      <h3 class="cc-ph">Grant access — single user</h3>
      <label class="cc-fl">Email</label>
      <input  class="cc-inp" id="admin-grant-email" placeholder="student@example.com"/>
      <label class="cc-fl">Role / Plan</label>
      <select class="cc-sel" id="admin-grant-role">
        <option value="student">Student</option>
        <option value="teacher">Teacher</option>
      </select>
      <label class="cc-fl">Months</label>
      <input  class="cc-inp" id="admin-grant-months" type="number" min="1" max="24" value="3"/>
      <label class="cc-fl">Class</label>
      <select class="cc-sel" id="admin-grant-class">
        <option value="all">All grades</option>
        <option value="gym-a">Α΄ Γυμνασίου</option>
        <option value="gym-b">Β΄ Γυμνασίου</option>
        <option value="gym-c">Γ΄ Γυμνασίου</option>
        <option value="lyk-a">Α΄ Λυκείου</option>
        <option value="lyk-b">Β΄ Λυκείου</option>
        <option value="lyk-c">Γ΄ Λυκείου</option>
      </select>
      <div style="margin-top:14px">
        <button class="cc-act primary" id="cc-grant-btn" onclick="adminGrantAccess()"><span>＋</span> Grant access</button>
      </div>
      <div class="cc-result admin-result" id="admin-grant-result"></div>
    </div>
    <div class="cc-card">
      <h3 class="cc-ph">Bind classroom</h3>
      <label class="cc-fl">Teacher email</label>
      <input class="cc-inp" id="subs-classroom-search-id" placeholder="teacher@school.gr"/>
      <div style="margin-top:14px">
        <button class="cc-act" onclick="adminSearchClassroom()">Search →</button>
      </div>
      <div class="cc-result" id="subs-classroom-search-result"></div>
      <div id="subs-classroom-bind" style="display:none;margin-top:14px">
        <div style="font-size:12px;color:var(--cc-text-dim);margin-bottom:10px" id="subs-bind-target-label"></div>
        <label class="cc-fl">Subscription type</label>
        <select class="cc-sel" id="subs-bind-sub-type">
          <option value="free">Free</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
        <label class="cc-fl">Expiry</label>
        <input class="cc-inp" type="date" id="subs-bind-expiry"/>
        <div id="subs-grades-unlock-grid" style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px"></div>
        <div style="margin-top:12px">
          <button class="cc-act primary" id="subs-bind-save-btn" onclick="adminBindClassroom()">Save →</button>
        </div>
        <div class="cc-result admin-result" id="subs-bind-result"></div>
      </div>
    </div>
  </div>`;

// ── Users · Mass Add ──
VIEWS.import = () => `
  <div class="cc-card">
    <h3 class="cc-ph">Mass grant access — CSV / Excel / paste</h3>
    <div style="display:flex;gap:8px;margin-bottom:14px">
      <button class="cc-act on" id="mass-btn-text" onclick="adminMassSetMethod('text',this)">Paste list</button>
      <button class="cc-act"    id="mass-btn-file" onclick="adminMassSetMethod('file',this)">Upload file</button>
    </div>
    <div id="mass-input-text">
      <label class="cc-fl">Emails (one per line, or comma-separated)</label>
      <textarea class="cc-inp" id="mass-emails-textarea" rows="6" placeholder="student1@school.gr&#10;student2@school.gr"></textarea>
    </div>
    <div id="mass-input-file" style="display:none">
      <label class="cc-fl">CSV or Excel file (first column = email)</label>
      <input type="file" class="cc-inp" id="mass-file-input" accept=".csv,.xlsx,.xls"
        onchange="adminMassHandleFile(this.files[0])"/>
      <div id="mass-drop-text" style="font-size:12px;color:var(--cc-shale);margin-top:6px"></div>
    </div>
    <div class="cc-row" style="margin-top:14px">
      <div>
        <label class="cc-fl">Role</label>
        <select class="cc-sel" id="mass-role">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>
      </div>
      <div>
        <label class="cc-fl">Months</label>
        <input class="cc-inp" type="number" id="mass-months" min="1" value="3"/>
      </div>
      <div>
        <label class="cc-fl">Class</label>
        <select class="cc-sel" id="mass-class">
          <option value="all">All grades</option>
          <option value="gym-a">Α΄ Γυμν.</option>
          <option value="gym-b">Β΄ Γυμν.</option>
          <option value="gym-c">Γ΄ Γυμν.</option>
          <option value="lyk-a">Α΄ Λυκ.</option>
          <option value="lyk-b">Β΄ Λυκ.</option>
          <option value="lyk-c">Γ΄ Λυκ.</option>
        </select>
      </div>
    </div>
    <div style="margin-top:14px">
      <button class="cc-act primary" onclick="adminMassParsePreview()">Preview →</button>
    </div>
    <div id="admin-mass-preview" style="display:none;margin-top:16px">
      <div class="cc-mass-hd" id="admin-mass-preview-header"></div>
      <div style="max-height:260px;overflow-y:auto">
        <table class="cc-tbl"><thead><tr><th>#</th><th>Email</th><th>Status</th></tr></thead>
        <tbody id="admin-mass-tbody"></tbody></table>
      </div>
      <div style="margin-top:12px;display:flex;align-items:center;gap:12px">
        <button class="cc-act primary" id="admin-mass-execute-btn" onclick="adminExecuteMassGrant()">
          <span id="admin-mass-execute-label">⚡ Grant to All</span>
        </button>
        <span style="font-family:var(--cc-mono);font-size:11px;color:var(--cc-shale)" id="admin-mass-progress"></span>
      </div>
      <div class="cc-result admin-result" id="admin-mass-result"></div>
    </div>
  </div>`;

// ── Users · Progression ──
VIEWS.progression = () => `
  <div class="cc-card" style="max-width:520px">
    <h3 class="cc-ph">Grant XP / Drachmas</h3>
    <label class="cc-fl">Email</label>
    <input class="cc-inp" id="admin-prog-email" placeholder="user@example.com"/>
    <div class="cc-row" style="margin-top:12px">
      <div>
        <label class="cc-fl">XP to add</label>
        <input class="cc-inp" id="admin-prog-xp" type="number" min="0" placeholder="0"/>
      </div>
      <div>
        <label class="cc-fl">Drachmas to add</label>
        <input class="cc-inp" id="admin-prog-dr" type="number" min="0" placeholder="0"/>
      </div>
    </div>
    <div style="margin-top:14px">
      <button class="cc-act primary" onclick="adminGrantProgression()"><span>＋</span> Grant</button>
    </div>
    <div class="cc-result admin-result" id="admin-prog-result"></div>
  </div>`;

// ── Subs · Lock & Unlock (grade access + dataset tiers) ──
VIEWS.tiers = () => `
  <div class="cc-note">
    <b>How locking works.</b> Each grade can be set to Free, Student Pro, or Teacher Pro.
    Each dataset and engine has an independent tier. Only users whose plan meets the required
    tier can open that grade or play that game.
    Wildcard override (emergency bar above) bypasses everything instantly.
  </div>

  <h3 class="cc-ph">Per-grade access</h3>
  <div class="cc-card">
    <div id="admin-access-grid" style="display:flex;flex-direction:column;gap:8px">
      <div style="color:var(--cc-shale);font-size:13px">Loading…</div>
    </div>
    <div style="margin-top:16px;display:flex;align-items:center;gap:12px">
      <button class="cc-act primary" onclick="adminSaveAccess()">Save grade access →</button>
      <div class="cc-result admin-result" id="admin-access-result"></div>
    </div>
  </div>

  <h3 class="cc-ph" style="margin-top:8px">Per-dataset tiers</h3>
  <div class="cc-card">
    <div id="tr-loading" style="color:var(--cc-shale);font-size:13px">Loading…</div>
    <div id="tr-wildcard-section" style="display:none;margin-bottom:16px;padding-bottom:16px;border-bottom:1px solid var(--cc-border-soft)">
      <label style="display:flex;align-items:center;gap:10px;cursor:pointer;font-size:13px;color:var(--cc-text-dim)">
        <input type="checkbox" id="tr-wildcard-checkbox" onchange="_trSaveWildcard(this)"
               style="width:16px;height:16px;accent-color:var(--cc-bronze)"/>
        <span><b style="color:var(--cc-text)">Wildcard Access</b> — unlock every module for all users immediately</span>
      </label>
    </div>
    <div id="tr-ds-section" style="display:none">
      <div style="font-family:var(--cc-mono);font-size:9.5px;letter-spacing:1px;text-transform:uppercase;color:var(--cc-shale);margin-bottom:10px">Datasets</div>
      <div id="tr-datasets-grid"></div>
    </div>
    <div id="tr-eng-section" style="display:none;margin-top:16px">
      <div style="font-family:var(--cc-mono);font-size:9.5px;letter-spacing:1px;text-transform:uppercase;color:var(--cc-shale);margin-bottom:10px">Engines</div>
      <div id="tr-engines-grid"></div>
    </div>
    <div id="tr-save-section" style="margin-top:16px;display:flex;align-items:center;gap:12px">
      <button class="cc-act primary" id="tr-save-btn" onclick="_trSave()">Save tiers →</button>
      <div class="cc-result admin-result" id="tr-result"></div>
    </div>
  </div>`;

// ════════════════════════════════════════════════════════════
//  GAME META STATE — tiers + tags, editable inline
//  Stored in config/game-tiers:
//    tiers      : { [datasetId]: 'free'|'student'|'teacher' }
//    engineTiers: { [engineId]:  'free'|'student'|'teacher' }
//    datasetTags: { [datasetId]: ['new','featured','popular','updated'] }
//    engineTags : { [engineId]:  ['new','featured','popular','updated'] }
// ════════════════════════════════════════════════════════════
let _gameMeta = null; // null = not loaded yet
let _metaDirty = false;

const TAG_DEFS = [
  { id:'new',      label:'🆕 New'      },
  { id:'featured', label:'⭐ Featured' },
  { id:'popular',  label:'🔥 Popular'  },
  { id:'updated',  label:'✅ Updated'  },
];

async function _loadGameMeta(force) {
  if (_gameMeta && !force) return _gameMeta;
  try {
    const doc = await firebase.firestore().collection('config').doc('game-tiers').get();
    _gameMeta = doc.exists ? {
      tiers:       doc.data().tiers       || {},
      engineTiers: doc.data().engineTiers || {},
      datasetTags: doc.data().datasetTags || {},
      engineTags:  doc.data().engineTags  || {},
    } : { tiers:{}, engineTiers:{}, datasetTags:{}, engineTags:{} };
  } catch (_) {
    _gameMeta = { tiers:{}, engineTiers:{}, datasetTags:{}, engineTags:{} };
  }
  _metaDirty = false;
  return _gameMeta;
}

// Called by tier pill clicks
window.ccSetTier = function(type, id, tier, btn) {
  if (!_gameMeta) return;
  if (type === 'engine') _gameMeta.engineTiers[id] = tier;
  else                   _gameMeta.tiers[id]        = tier;
  _metaDirty = true;
  // Update pills in this card only
  btn.closest('.cc-tier-pills')?.querySelectorAll('.cc-tier-pill').forEach(p => {
    p.classList.toggle('on', p.dataset.tier === tier);
  });
  _showSaveBar();
};

// Called by tag chip clicks
window.ccToggleTag = function(type, id, tag, chip) {
  if (!_gameMeta) return;
  const map = type === 'engine' ? _gameMeta.engineTags : _gameMeta.datasetTags;
  if (!map[id]) map[id] = [];
  const idx = map[id].indexOf(tag);
  if (idx === -1) map[id].push(tag); else map[id].splice(idx, 1);
  _metaDirty = true;
  chip.classList.toggle('on', map[id].includes(tag));
  _showSaveBar();
};

function _showSaveBar() {
  const bar = $('cc-gm-save-bar');
  if (bar) bar.classList.toggle('on', _metaDirty);
}

window.ccSaveGameMeta = async function(btn) {
  if (!_gameMeta) return;
  const res = $('cc-gm-save-result');
  if (btn) { btn.disabled = true; btn.textContent = 'Saving…'; }
  if (res)  { res.textContent = ''; res.className = 'cc-result'; }
  try {
    await firebase.firestore().collection('config').doc('game-tiers').set({
      tiers:       _gameMeta.tiers,
      engineTiers: _gameMeta.engineTiers,
      datasetTags: _gameMeta.datasetTags,
      engineTags:  _gameMeta.engineTags,
      updatedAt:   firebase.firestore.FieldValue.serverTimestamp(),
      updatedBy:   (typeof currentUser !== 'undefined' && currentUser?.email) || 'admin',
    }, { merge: true });
    // Apply tiers to live GP_DATASETS immediately
    if (typeof GP_DATASETS !== 'undefined') {
      GP_DATASETS.forEach(ds => { if (_gameMeta.tiers[ds.id]) ds.tier = _gameMeta.tiers[ds.id]; });
    }
    _metaDirty = false;
    _showSaveBar();
    if (res) { res.textContent = '✓ Saved'; res.className = 'cc-result success'; }
    ccToast('Game meta saved');
  } catch (e) {
    if (res) { res.textContent = 'Error: ' + e.message; res.className = 'cc-result error'; }
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Save changes'; }
  }
};

window.ccRefreshGameMeta = async function(btn) {
  if (btn) btn.innerHTML = '<span class="cc-spin">↻</span> Scanning…';
  await _loadGameMeta(/* force= */true);
  // Re-render whichever games view is active
  const cat = DOMAINS.find(d => d.id === 'games')?.cats.find(c => c.id === _cat);
  if (cat) {
    const panel = $('cc-panel');
    if (panel) {
      panel.innerHTML = VIEWS[cat.view] ? VIEWS[cat.view]() : '';
    }
  }
  if (btn) btn.innerHTML = '↻ Refresh';
  ccToast('Reloaded from Firestore');
};

// ── shared save bar HTML (inserted at top of engines/datasets views) ──
function _gmSaveBar() {
  return `<div class="cc-save-bar${_metaDirty?' on':''}" id="cc-gm-save-bar">
    <button class="cc-act" onclick="ccRefreshGameMeta(this)">↻ Refresh</button>
    <button class="cc-act primary" onclick="ccSaveGameMeta(this)">Save changes</button>
    <div class="cc-result admin-result" id="cc-gm-save-result"></div>
    <span style="margin-left:auto;font-family:var(--cc-mono);font-size:10px;color:var(--cc-shale)">Changes are live immediately after save</span>
  </div>`;
}

// ── tier pills HTML ──
function _tierPills(type, id, currentTier) {
  return `<div class="cc-tier-pills">
    ${['free','student','teacher'].map(t =>
      `<button class="cc-tier-pill${currentTier===t?' on':''}" data-tier="${t}"
        onclick="ccSetTier('${type}','${esc(id)}','${t}',this)">${t}</button>`
    ).join('')}
  </div>`;
}

// ── tag chips HTML ──
function _tagChips(type, id, activeTags) {
  activeTags = activeTags || [];
  return `<div class="cc-game-card-tags">
    ${TAG_DEFS.map(tag =>
      `<span class="cc-tag-chip ${tag.id}${activeTags.includes(tag.id)?' on':''}"
        onclick="ccToggleTag('${type}','${esc(id)}','${tag.id}',this)">${tag.label}</span>`
    ).join('')}
  </div>`;
}

// ── Games · Engines ──
VIEWS.engines = () => {
  const engines = (typeof GP_ENGINES !== 'undefined') ? GP_ENGINES : [];
  if (!engines.length) return `<div class="cc-stub"><div class="cc-stub-ic">🎮</div><h3>No engines</h3><p>GP_ENGINES not loaded.</p></div>`;
  if (!_gameMeta) return `<div style="color:var(--cc-shale);padding:16px">Loading…</div>`;
  const sysTags = (e) => (e.tags||[]).map(t =>
    `<span style="font-family:var(--cc-mono);font-size:8.5px;color:var(--cc-shale);background:var(--cc-surface-3);border:1px solid var(--cc-border-soft);border-radius:4px;padding:2px 6px">${esc(t)}</span>${e.multiplayer?'<span class="cc-badge" style="color:var(--cc-terra-b);border-color:rgba(224,101,63,.3);background:rgba(224,101,63,.07)">PvP</span>':''}`
  ).join('');
  return _gmSaveBar() + `
    <div class="cc-game-grid">
      ${engines.map(e => {
        const tier = _gameMeta.engineTiers[e.id] || e.tier || 'free';
        const tags = _gameMeta.engineTags[e.id] || [];
        return `<div class="cc-game-card${_metaDirty?'':''}" id="cc-eng-${esc(e.id)}">
          <div class="cc-game-card-head">
            <span class="cc-game-card-ic">${esc(e.icon||'🎮')}</span>
            <div style="flex:1;min-width:0">
              <div class="cc-game-card-nm">${esc(e.label)}</div>
              <div class="cc-game-card-sub">${esc(e.subtitle||'')}</div>
              <div class="cc-game-card-id">${esc(e.id)}</div>
            </div>
          </div>
          <div style="display:flex;flex-wrap:wrap;gap:5px;min-height:18px">${sysTags(e)}</div>
          ${_tagChips('engine', e.id, tags)}
          <div class="cc-game-card-foot">
            <span style="font-family:var(--cc-mono);font-size:9.5px;color:var(--cc-shale)">Tier</span>
            ${_tierPills('engine', e.id, tier)}
          </div>
        </div>`;
      }).join('')}
    </div>`;
};

// ── Games · Datasets ──
VIEWS.datasets = () => {
  const datasets = (typeof GP_DATASETS !== 'undefined') ? GP_DATASETS : [];
  if (!datasets.length) return `<div class="cc-stub"><div class="cc-stub-ic">📦</div><h3>No datasets</h3><p>GP_DATASETS not loaded.</p></div>`;
  if (!_gameMeta) return `<div style="color:var(--cc-shale);padding:16px">Loading…</div>`;
  const cats = {};
  datasets.forEach(d => { const c = d.category || 'Other'; if (!cats[c]) cats[c] = []; cats[c].push(d); });
  return _gmSaveBar() + Object.entries(cats).map(([cat, list]) => `
    <div class="cc-card" style="margin-bottom:14px">
      <div style="font-family:var(--cc-mono);font-size:9.5px;letter-spacing:1.5px;text-transform:uppercase;color:var(--cc-shale);margin-bottom:12px">${esc(cat)}</div>
      <div style="display:flex;flex-direction:column;gap:10px">
        ${list.map(d => {
          const tier = _gameMeta.tiers[d.id] || d.tier || 'free';
          const tags = _gameMeta.datasetTags[d.id] || [];
          return `<div style="display:flex;flex-direction:column;gap:8px;padding:12px;background:var(--cc-bg);border:1px solid var(--cc-border-soft);border-radius:9px">
            <div style="display:flex;align-items:center;gap:10px">
              <span style="font-size:18px;flex-shrink:0">${esc(d.icon||'📦')}</span>
              <div style="flex:1;min-width:0">
                <div style="font-size:13px;font-weight:600;color:var(--cc-text)">${esc(d.label)}</div>
                <div style="font-size:11px;color:var(--cc-shale);font-family:var(--cc-mono)">${esc(d.id)} · ${esc(d.meta||'')}</div>
              </div>
              ${d.leveled?'<span style="font-family:var(--cc-mono);font-size:9px;color:var(--cc-plum);background:rgba(176,126,154,.1);border:1px solid rgba(176,126,154,.3);border-radius:5px;padding:2px 7px">Leveled</span>':''}
            </div>
            ${_tagChips('dataset', d.id, tags)}
            <div style="display:flex;align-items:center;gap:8px">
              <span style="font-family:var(--cc-mono);font-size:9.5px;color:var(--cc-shale)">Tier</span>
              ${_tierPills('dataset', d.id, tier)}
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>`).join('');
};

// ── Games · Registry Sync ──
VIEWS.sync = () => `
  <div class="cc-note">
    Scan finds engines and datasets that exist in the live codebase but have <b>no Firestore
    tier entry</b> yet — they'll use their code defaults until registered here.
    Registering writes their current default tier so you can manage them from the admin panel.
  </div>
  <div style="display:flex;gap:10px;margin-bottom:20px">
    <button class="cc-act primary" id="cc-sync-btn" onclick="ccRunSync(this)">
      ↻ Scan for unregistered games
    </button>
    <div class="cc-result admin-result" id="cc-sync-result"></div>
  </div>
  <div id="cc-sync-output"><div style="color:var(--cc-shale);font-size:13px">Press Scan to check.</div></div>`;

// Re-renders the curriculum planner datasets grid so newly-loaded level
// arrays (window.OUS_LEVELS etc.) are picked up without a page reload.
window.ccRefreshCurriculum = function(btn) {
  if (btn) btn.innerHTML = '<span class="cc-spin">↻</span>';
  // Re-init the panel — _cpInitPanel is idempotent; re-select current class
  if (typeof _cpInitPanel === 'function') {
    // Reset the tabs so _cpInitPanel rebuilds them cleanly
    const tabs = document.getElementById('cp-class-tabs');
    if (tabs) tabs.innerHTML = '';
    _cpInitPanel();
  }
  setTimeout(() => { if (btn) btn.innerHTML = '↻ Refresh datasets'; }, 600);
  ccToast('Datasets refreshed — level pickers updated');
};

window.ccRunSync = async function(btn) {
  const out = $('cc-sync-output'), res = $('cc-sync-result');
  if (btn) { btn.innerHTML = '<span class="cc-spin">↻</span> Scanning…'; btn.disabled = true; }
  if (res) { res.textContent = ''; res.className = 'cc-result'; }
  try {
    await _loadGameMeta(/* force= */true);
    const engines  = (typeof GP_ENGINES  !== 'undefined') ? GP_ENGINES  : [];
    const datasets = (typeof GP_DATASETS !== 'undefined') ? GP_DATASETS : [];
    const unregEng = engines.filter(e  => !(_gameMeta.engineTiers[e.id] != null));
    const unregDs  = datasets.filter(d => !(_gameMeta.tiers[d.id]       != null));
    const regEng   = engines.length  - unregEng.length;
    const regDs    = datasets.length - unregDs.length;

    let html = `
      <div class="cc-stat-grid" style="margin-bottom:20px">
        <div class="cc-stat-card"><div class="sv">${engines.length}</div><div class="sl">Total engines</div></div>
        <div class="cc-stat-card"><div class="sv" style="color:var(--cc-olive)">${regEng}</div><div class="sl">Registered</div></div>
        <div class="cc-stat-card"><div class="sv" style="${unregEng.length?'color:var(--cc-terra-b)':''}">${unregEng.length}</div><div class="sl">Unregistered</div></div>
        <div class="cc-stat-card"><div class="sv">${datasets.length}</div><div class="sl">Total datasets</div></div>
        <div class="cc-stat-card"><div class="sv" style="color:var(--cc-olive)">${regDs}</div><div class="sl">Registered</div></div>
        <div class="cc-stat-card"><div class="sv" style="${unregDs.length?'color:var(--cc-terra-b)':''}">${unregDs.length}</div><div class="sl">Unregistered</div></div>
      </div>`;

    const mkRow = (item, type) => {
      const defaultTier = item.tier || 'free';
      return `<div class="cc-sync-row unregistered">
        <span class="cc-sync-dot new"></span>
        <span style="font-size:16px">${esc(item.icon||'📦')}</span>
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;color:var(--cc-text)">${esc(item.label||item.id)}</div>
          <div style="font-family:var(--cc-mono);font-size:10px;color:var(--cc-shale)">${esc(item.id)} · default tier: <span style="color:var(--cc-bronze)">${defaultTier}</span></div>
        </div>
        <span class="cc-badge ${defaultTier}">${defaultTier}</span>
        <button class="cc-act" style="padding:5px 10px;font-size:11px"
          onclick="ccRegisterOne('${type}','${esc(item.id)}','${defaultTier}',this)">Register</button>
      </div>`;
    };

    if (unregEng.length) {
      html += `<h3 class="cc-ph">Unregistered engines (${unregEng.length})</h3>`;
      html += unregEng.map(e => mkRow(e, 'engine')).join('');
    }
    if (unregDs.length) {
      html += `<h3 class="cc-ph" style="margin-top:16px">Unregistered datasets (${unregDs.length})</h3>`;
      html += unregDs.map(d => mkRow(d, 'dataset')).join('');
    }
    if (!unregEng.length && !unregDs.length) {
      html += `<div class="cc-note ok"><b>✓ All good.</b> Every engine and dataset has a Firestore tier entry.</div>`;
    } else {
      html += `<div style="margin-top:16px">
        <button class="cc-act primary" onclick="ccRegisterAll(this)">⚡ Register all unregistered (${unregEng.length+unregDs.length})</button>
      </div>`;
    }
    if (out) out.innerHTML = html;
    if (res) { res.textContent = `Found ${unregEng.length+unregDs.length} unregistered`; res.className='cc-result'+(unregEng.length+unregDs.length?'':' success'); }
  } catch (e) {
    if (out) out.innerHTML = `<div style="color:var(--cc-terra-b)">Error: ${esc(e.message)}</div>`;
  } finally {
    if (btn) { btn.innerHTML = '↻ Scan for unregistered games'; btn.disabled = false; }
  }
};

window.ccRegisterOne = async function(type, id, defaultTier, btn) {
  if (!_gameMeta) return;
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  if (type === 'engine') _gameMeta.engineTiers[id] = defaultTier;
  else                   _gameMeta.tiers[id]        = defaultTier;
  _metaDirty = true;
  await ccSaveGameMeta(null);
  if (btn) { btn.textContent = '✓ Registered'; btn.disabled = true; }
  const row = btn.closest('.cc-sync-row');
  if (row) { row.classList.remove('unregistered'); row.querySelector('.cc-sync-dot').classList.replace('new','ok'); }
  ccToast(`${id} registered at tier: ${defaultTier}`);
};

window.ccRegisterAll = async function(btn) {
  if (!_gameMeta) return;
  if (btn) { btn.disabled = true; btn.textContent = '…'; }
  const engines  = (typeof GP_ENGINES  !== 'undefined') ? GP_ENGINES  : [];
  const datasets = (typeof GP_DATASETS !== 'undefined') ? GP_DATASETS : [];
  engines.filter(e  => !(_gameMeta.engineTiers[e.id] != null)).forEach(e  => { _gameMeta.engineTiers[e.id] = e.tier  || 'free'; });
  datasets.filter(d => !(_gameMeta.tiers[d.id]       != null)).forEach(d => { _gameMeta.tiers[d.id]        = d.tier  || 'free'; });
  _metaDirty = true;
  await ccSaveGameMeta(null);
  if (btn) { btn.textContent = '✓ All registered'; }
  ccToast('All games registered');
  // Re-run scan to show updated state
  setTimeout(() => ccRunSync($('cc-sync-btn')), 300);
};

// ── Curriculum · Class Plan ──
VIEWS.classplan = () => `
  <div class="cc-note">
    Pick which datasets and engines each class can access, in what order, and which levels are assigned.
    <b>Practice</b> = interactive games. <b>Theory</b> = Μνημοσύνη flashcard study.
    Changes are saved to <code style="color:var(--cc-bronze)">classes/{classKey}/curriculum/main</code>.
  </div>

  <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;align-items:center">
    <button class="cc-act" onclick="ccRefreshCurriculum(this)">↻ Refresh datasets</button>
    <div style="flex:1"></div>
    <button class="cc-act primary" id="cp-save-btn" onclick="_cpSave()">Save plan →</button>
    <button class="cc-act" onclick="_cpResetDefaults()">Reset defaults</button>
    <div class="cc-result admin-result" id="cp-result"></div>
  </div>

  <div class="cc-card">
    <div id="cp-class-tabs" style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px"></div>
    <div id="cp-loading" style="color:var(--cc-shale);font-size:13px;display:none">Loading…</div>
    <div id="cp-content" style="display:none">

      <!-- Practice / Theory tab pills -->
      <div style="display:flex;gap:6px;border-bottom:1px solid var(--cc-border-soft);margin-bottom:16px">
        <button class="cc-cat on" id="cp-tab-practice" onclick="ccCpSetTab('practice')">
          🎮 Practice
        </button>
        <button class="cc-cat" id="cp-tab-theory" onclick="ccCpSetTab('theory')">
          📖 Theory (Μελέτη)
        </button>
      </div>

      <!-- Content area — datasets + engines both render here, filtered by tab -->
      <div id="cp-datasets-grid"></div>
      <div style="margin-top:12px">
        <div id="cp-engines-inner"></div>
      </div>

    </div>
  </div>`;

VIEWS.classplan._init = () => {
  if (typeof _cpInitPanel === 'function') setTimeout(_cpInitPanel, 0);
};

window.ccCpSetTab = function(tab) {
  document.querySelectorAll('#cp-tab-practice,#cp-tab-theory').forEach(b => {
    b.classList.toggle('on', b.id === `cp-tab-${tab}`);
  });
  if (typeof _cpSetTab === 'function') _cpSetTab(tab);
};

// ── Subs · Pricing ──
VIEWS.plans = () => `
  <div class="cc-card">
    <h3 class="cc-ph">Subscription pricing <span class="cc-ph-r">saved to config/pricing</span></h3>
    <table class="cc-tbl" style="margin-bottom:14px">
      <thead><tr><th>Plan</th><th>1 mo</th><th>3 mo</th><th>6 mo</th><th>12 mo</th></tr></thead>
      <tbody id="pricing-tbody">
        ${['student','teacher'].map(tp => `
          <tr data-plan="${tp}">
            <td class="tn">${tp === 'student' ? 'Student' : 'Teacher'}</td>
            ${[1,3,6,12].map(m => `<td>
              <input type="number" class="cc-price-inp" id="price-${tp}-${m}"
                data-month="${m}" min="0" step="0.01" value=""/>
            </td>`).join('')}
          </tr>`).join('')}
      </tbody>
    </table>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="cc-act primary" onclick="adminSavePricing()">Save pricing →</button>
      <button class="cc-act" onclick="adminAddPlanRow()">＋ Custom plan</button>
    </div>
    <div class="cc-result admin-result" id="admin-pricing-result"></div>
  </div>
  <div class="cc-note" style="margin-top:0">
    <b>Access control</b> — per-grade tiers and per-dataset tiers live in the Curator's Console
    (Content → Curator's Console → Game Rewards).
    <br/>Wildcard unlock: <button class="cc-act" style="display:inline-flex;padding:4px 10px;font-size:11px;margin-left:8px" onclick="ccGoDom('system');ccGoCat('stats')">System → Dashboard</button>
  </div>`;

// ── Subs · Coupons ──
VIEWS.coupons = () => `
  <div class="cc-grid2">
    <div class="cc-card">
      <h3 class="cc-ph">New coupon</h3>
      <label class="cc-fl">Code</label>
      <div style="display:flex;gap:8px">
        <input class="cc-inp" id="admin-code-name" placeholder="SUMMER25" style="text-transform:uppercase"/>
        <button class="cc-act" onclick="adminGenerateCode()" style="white-space:nowrap;flex-shrink:0">Generate</button>
      </div>
      <label class="cc-fl">Discount %</label>
      <input class="cc-inp" id="admin-code-discount" type="number" min="1" max="100" value="20"/>
      <label class="cc-fl">Expiry date</label>
      <input class="cc-inp" type="date" id="admin-code-expiry"/>
      <label class="cc-fl">Max uses (0 = unlimited)</label>
      <input class="cc-inp" id="admin-code-max-uses" type="number" min="0" value="0"/>
      <div style="margin-top:14px">
        <button class="cc-act primary" onclick="adminCreateCode()"><span>＋</span> Create</button>
      </div>
      <div class="cc-result admin-result" id="admin-code-result"></div>
    </div>
    <div class="cc-card">
      <h3 class="cc-ph">Existing codes</h3>
      <div id="admin-codes-items"><div style="color:var(--cc-shale);font-size:13px">Loading…</div></div>
    </div>
  </div>`;

// ── Content · Curator's Console ──
VIEWS.temple = () => `
  <div class="cc-note">The Curator's Console edits the live Realm (cosmetics, quests, game rewards, saga). Changes apply immediately to all players.</div>
  <div class="cc-realm-mount" id="admin-tab-realm"></div>`;
VIEWS.temple._init = () => {
  if (typeof _adminRealmInit === 'function') {
    setTimeout(_adminRealmInit, 0);
  }
};

// ── Content · Anodos ──
VIEWS.anodos = () => `
  <div class="cc-card">
    <h3 class="cc-ph">Riddles (αἰνίγματα)</h3>
    <div id="anodos-riddles-list"></div>
    <button class="cc-act" style="margin-top:10px" onclick="_anodosAddRiddle()">＋ Add riddle</button>
  </div>
  <div class="cc-card">
    <h3 class="cc-ph">Rewards (περίαπτα)</h3>
    <div id="anodos-rewards-list"></div>
    <button class="cc-act" style="margin-top:10px" onclick="_anodosAddReward()">＋ Add reward</button>
  </div>
  <div style="margin-top:4px;display:flex;align-items:center;gap:12px">
    <button class="cc-act primary" id="anodos-save-btn" onclick="adminSaveAnodos()">Save →</button>
    <div class="cc-result admin-result" id="anodos-save-result"></div>
  </div>`;
VIEWS.anodos._init = () => {
  if (typeof _anodosInitPanel === 'function') setTimeout(_anodosInitPanel, 0);
};

// ── Content · Pages ──
VIEWS.pages = () => `
  <div class="cc-card">
    <h3 class="cc-ph">Page content editor</h3>
    <div style="display:flex;gap:6px;margin-bottom:16px" id="cc-pages-tabs">
      ${['about','contact','fbpage'].map((p,i) =>
        `<button class="cc-cat${i===0?' on':''}" onclick="adminShowPageTab('${p}',this)">${p==='fbpage'?'Feedback Page':p.charAt(0).toUpperCase()+p.slice(1)}</button>`
      ).join('')}
    </div>
    <div id="admin-page-content-wrap">
      <div style="color:var(--cc-shale);font-size:13px">Loading…</div>
    </div>
    <div style="margin-top:14px;display:flex;align-items:center;gap:12px">
      <button class="cc-act primary" id="admin-page-save-btn" onclick="adminSavePageContent()">Save →</button>
      <div class="cc-result admin-result" id="admin-page-result"></div>
    </div>
  </div>`;

// ── Content · Banners ──
VIEWS.banners = () => `
  <div class="cc-grid2">
    <div class="cc-card">
      <h3 class="cc-ph">Publish banner</h3>
      <label class="cc-fl">Title (GR)</label>
      <input class="cc-inp" id="admin-banner-title-gr" placeholder="Νέα ανακοίνωση"/>
      <label class="cc-fl">Title (EN)</label>
      <input class="cc-inp" id="admin-banner-title-en" placeholder="New announcement"/>
      <label class="cc-fl">Body (GR)</label>
      <input class="cc-inp" id="admin-banner-body-gr" placeholder="Κείμενο…"/>
      <label class="cc-fl">Body (EN)</label>
      <input class="cc-inp" id="admin-banner-body-en" placeholder="Body text…"/>
      <label class="cc-fl">Type</label>
      <select class="cc-sel" id="admin-banner-type">
        <option value="info">ℹ️ Info</option>
        <option value="promo">🏷️ Promo</option>
        <option value="warning">⚠️ Warning</option>
      </select>
      <label class="cc-fl">Expiry (optional)</label>
      <input class="cc-inp" type="date" id="admin-banner-expiry"/>
      <label class="cc-fl">CTA label (GR)</label>
      <input class="cc-inp" id="admin-banner-cta-gr" placeholder="Δες περισσότερα"/>
      <label class="cc-fl">CTA label (EN)</label>
      <input class="cc-inp" id="admin-banner-cta-en" placeholder="Learn more"/>
      <label class="cc-fl">CTA action / URL</label>
      <input class="cc-inp" id="admin-banner-cta-action" placeholder="subscribe"/>
      <div style="margin-top:14px">
        <button class="cc-act primary" onclick="adminCreateBanner()"><span>＋</span> Publish</button>
      </div>
      <div class="cc-result admin-result" id="admin-banner-result"></div>
    </div>
    <div class="cc-card">
      <h3 class="cc-ph">Active banners</h3>
      <div id="admin-banners-items"><div style="color:var(--cc-shale);font-size:13px">Loading…</div></div>
    </div>
  </div>`;

// ── Support · Feedback ──
VIEWS.feedback = () => `
  <div class="cc-card">
    <h3 class="cc-ph">User feedback</h3>
    <div id="admin-feedback-items"><div style="color:var(--cc-shale);font-size:13px">Loading…</div></div>
  </div>`;

// ── VIEW LOADERS (async Firebase reads) ───────────────────────
const VIEW_LOADERS = {

  // Games views: load _gameMeta then re-render the panel with live data
  engines: async () => {
    await _loadGameMeta();
    const panel = $('cc-panel');
    if (panel && typeof VIEWS.engines === 'function') panel.innerHTML = VIEWS.engines();
  },
  datasets: async () => {
    await _loadGameMeta();
    const panel = $('cc-panel');
    if (panel && typeof VIEWS.datasets === 'function') panel.innerHTML = VIEWS.datasets();
  },

  // Tiers: load grade access grid then initialise the dataset/engine tier panel
  tiers: async () => {
    if (typeof _adminLoadAccess === 'function') _adminLoadAccess();
    if (typeof _trResetInit === 'function') _trResetInit(); // clear double-init guard
    if (typeof _trInitPanel  === 'function') _trInitPanel();
  },

  stats: async () => {
    try {
      const db = firebase.firestore();
      const [u, pro, coup, ban, aud] = await Promise.all([
        db.collection('users').get(),
        db.collection('users').where('plan','==','pro').get(),
        db.collection('coupons').where('active','==',true).get(),
        db.collection('banners').where('active','==',true).get(),
        db.collection('adminAudit').limit(1).get(),
      ]);
      [$('cc-stat-0'),$('cc-stat-1'),$('cc-stat-2'),$('cc-stat-3')]
        .forEach((el,i) => { if(el) el.textContent = [u.size,pro.size,coup.size,ban.size][i]; });
      // Recent audit
      const preview = $('cc-audit-preview'); if (!preview) return;
      const snap = await db.collection('adminAudit').orderBy('at','desc').limit(6).get();
      if (snap.empty) { preview.innerHTML = '<div style="color:var(--cc-shale);font-size:13px">No audit entries yet.</div>'; return; }
      preview.innerHTML = snap.docs.map(d => {
        const x = d.data();
        const when = x.at?.toDate?.()?.toLocaleString('el-GR') || '—';
        return `<div class="cc-aud">
          <code class="cc-aud-act" style="color:var(--cc-bronze)">${esc(x.action)}</code>
          <span class="cc-aud-who">${esc(x.actorEmail||'—')}</span>
          <span class="cc-aud-t">${esc(when)}</span>
        </div>`;
      }).join('');
    } catch(e) { console.warn('[cc] stats load:', e); }
  },

  audit: async () => {
    const list = $('cc-audit-list'); if (!list) return;
    try {
      const snap = await firebase.firestore().collection('adminAudit')
        .orderBy('at','desc').limit(50).get();
      if (snap.empty) { list.innerHTML = '<div style="color:var(--cc-shale);font-size:13px">No entries yet.</div>'; return; }
      list.innerHTML = snap.docs.map(d => {
        const x = d.data();
        const when = x.at?.toDate?.()?.toLocaleString('el-GR') || '—';
        return `<div class="cc-aud">
          <code class="cc-aud-act" style="color:var(--cc-bronze)">${esc(x.action)}</code>
          <span class="cc-aud-who">${esc(x.actorEmail||'—')} <span style="color:var(--cc-shale-dim)">[${esc(x.role||'?')}]</span></span>
          <span class="cc-aud-t">${esc(when)}</span>
        </div>`;
      }).join('');
    } catch(e) { list.innerHTML = `<div style="color:var(--cc-terra-b)">Error: ${esc(e.message)}</div>`; }
  },

  coupons: async () => {
    // Delegate to existing admin.js loader — same DOM IDs
    if (typeof _adminLoadCoupons === 'function') _adminLoadCoupons();
    if (typeof _adminLoadPricing !== 'undefined') {} // pricing loaded on plans view
  },

  plans: async () => {
    if (typeof _adminLoadPricing === 'function') _adminLoadPricing();
  },

  banners: async () => {
    if (typeof _adminLoadBanners === 'function') _adminLoadBanners();
  },

  feedback: async () => {
    if (typeof _adminLoadFeedback === 'function') _adminLoadFeedback();
  },

  pages: async () => {
    if (typeof _adminLoadPageContent === 'function') _adminLoadPageContent();
  },
};

// ── ROUTING ───────────────────────────────────────────────────
window.ccGoDom = function(id) {
  if (!roleCan(_actingAs, id)) {
    ccToast(`${(ROLES.find(r=>r.id===_actingAs)||{}).nm||'This role'} can't access ${id}`, 'warn');
    return;
  }
  _dom = id;
  const domain = DOMAINS.find(d => d.id === id);
  _cat = domain?.cats[0]?.id || _cat;
  _renderRail();
  _renderWork();
};

window.ccGoCat = function(id) {
  _cat = id;
  const domain = DOMAINS.find(d => d.id === _dom);
  const cat = domain?.cats.find(c => c.id === id);
  if (!cat) return;
  // Update cat tabs
  const work = $('cc-work');
  if (work) {
    work.querySelectorAll('.cc-cat').forEach(b => b.classList.toggle('on', b.textContent.trim() === cat.label));
    // Keep the breadcrumb + work heading in sync with the chosen category
    // (otherwise they stay stale on tab switch).
    const crumbCur = work.querySelector('.cc-crumb .cur');
    if (crumbCur) crumbCur.textContent = cat.label;
    const h1 = work.querySelector('.cc-whead h1');
    if (h1) h1.innerHTML = `${esc(domain.label)} <em>· ${esc(cat.label)}</em>`;
  }
  const panel = $('cc-panel');
  if (!panel) return _renderWork();
  const fn = VIEWS[cat.view];
  panel.innerHTML = fn ? fn() : _stub(cat.view);
  if (typeof fn?._init === 'function') fn._init();
  const loader = VIEW_LOADERS[cat.view];
  if (loader) loader();
};

window.ccActAs = function(role) {
  _actingAs = role;
  const sel = $('cc-actAs'); if (sel) sel.value = role;
  // Redirect if current domain is now locked
  if (!roleCan(role, _dom)) {
    const first = DOMAINS.find(d => roleCan(role, d.id));
    if (first) { _dom = first.id; _cat = first.cats[0].id; }
  }
  _renderRail();
  _renderWork();
  ccToast('Acting as ' + ((ROLES.find(r=>r.id===role)||{}).nm||role) + (role==='super'?'':' — restricted scope'), role==='super'?null:'warn');
};

// ── ROLE ASSIGNMENT ───────────────────────────────────────────
window.ccSetRole = async function() {
  const email = ($('cc-role-email')?.value||'').trim().toLowerCase();
  const role  = $('cc-role-sel')?.value || null;
  const res   = $('cc-role-result');
  if (!email) { if(res) { res.textContent='Enter an email.'; res.className='cc-result error'; } return; }
  if (res) { res.textContent=''; res.className='cc-result'; }
  try {
    const fn = firebase.functions().httpsCallable('setAdminRole');
    await fn({ targetEmail: email, role: role || null });
    if (res) { res.textContent = `✓ Role "${role||'revoked'}" assigned to ${email}. They must re-login.`; res.className='cc-result success'; }
    ccToast(`Role assigned — ${email} must refresh their token`);
  } catch(e) {
    if (res) { res.textContent = `Error: ${e.message}`; res.className='cc-result error'; }
  }
};

// ── EMERGENCY ─────────────────────────────────────────────────
let _wild = false, _killed = false;

window.ccToggleWild = function() {
  if (_actingAs !== 'super') { ccToast('Wildcard Access is Super-admin only', 'warn'); return; }
  _wild = !_wild;
  const tg = $('cc-wildTg'); if (tg) tg.classList.toggle('on', _wild);
  // Write to Firestore
  firebase.firestore().collection('config').doc('app')
    .set({ wildcard_access: _wild }, { merge: true })
    .catch(e => console.warn('[cc] wildcard:', e));
  _paintEmg();
  ccToast(_wild ? '⚠ Wildcard armed — all modules unlocked' : 'Wildcard cleared');
};

window.ccOpenKill  = function() {
  if (_actingAs !== 'super') { ccToast('Kill Switch is Super-admin only', 'warn'); return; }
  const s = $('cc-kill-scrim'); if (s) s.classList.add('on');
};
window.ccCloseKill = function() { const s = $('cc-kill-scrim'); if (s) s.classList.remove('on'); };
window.ccConfirmKill = function() {
  _killed = true; ccCloseKill(); _paintEmg();
  firebase.firestore().collection('config').doc('app')
    .set({ kill_switch: true }, { merge: true })
    .catch(e => console.warn('[cc] kill:', e));
  ccToast('⏻ Kill Switch armed — platform read-only', 'danger');
};

function _paintEmg() {
  const emg = $('cc-emg'), st = $('cc-emg-state'); if (!emg||!st) return;
  emg.classList.toggle('killed', _killed);
  emg.classList.toggle('wild', _wild && !_killed);
  st.textContent = _killed ? 'PLATFORM FROZEN — READ-ONLY'
    : (_wild ? 'WILDCARD ARMED — ALL UNLOCKED' : 'SYSTEMS NOMINAL');
}

// Read current wildcard state from Firestore on open
async function _syncEmergencyState() {
  try {
    const doc = await firebase.firestore().collection('config').doc('app').get();
    if (doc.exists) {
      _wild   = !!doc.data()?.wildcard_access;
      _killed = !!doc.data()?.kill_switch;
      const tg = $('cc-wildTg'); if (tg) tg.classList.toggle('on', _wild);
      _paintEmg();
    }
  } catch (_) {}
}

// ── CONFIRM MODAL ─────────────────────────────────────────────
let _ccPending = null;
window.ccConfirm = function(o) {
  _ccPending = o.onConfirm || null;
  const m = $('cc-confirm-modal'); if (!m) return;
  m.innerHTML = `<h2><span class="x">${o.danger?'⚠':'◈'}</span> ${esc(o.title)}</h2>
    ${o.intro?`<p>${o.intro}</p>`:''}
    ${o.note?`<div class="cc-conf">↪ ${esc(o.note)}</div>`:''}
    <div class="cc-mbtns">
      <button class="cc-mbtn" onclick="ccConfirmNo()">Cancel</button>
      <button class="cc-mbtn ${o.danger?'danger':''}" onclick="ccConfirmYes()">${esc(o.confirmLabel||'Confirm')}</button>
    </div>`;
  const scrim = $('cc-confirm-scrim'); if (scrim) scrim.classList.add('on');
};
window.ccConfirmNo  = () => { _ccPending=null; const s=$('cc-confirm-scrim'); if(s)s.classList.remove('on'); };
window.ccConfirmYes = () => { const f=_ccPending; _ccPending=null; const s=$('cc-confirm-scrim'); if(s)s.classList.remove('on'); if(f)f(); };

// ── TOAST ─────────────────────────────────────────────────────
let _toastTimer;
window.ccToast = function(msg, kind) {
  const el = $('cc-toast'), txt = $('cc-toast-txt'), ti = el?.querySelector('.cc-ti');
  if (!el||!txt) return;
  txt.textContent = msg;
  el.className = 'cc-toast on' + (kind==='warn'?' warn':kind==='danger'?' danger':'');
  if (ti) ti.textContent = kind==='warn'?'⚠':kind==='danger'?'⏻':'◈';
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.remove('on'), 2700);
};

// Bridge old showToast → ccToast for admin.js compatibility
const _origShowToast = window.showToast;
function _adminToast(gr, en) {
  const msg = (typeof t === 'function') ? t(gr, en) : (gr || en);
  ccToast(msg);
}

// ── ENTRY POINTS ──────────────────────────────────────────────
window.navToAdmin = function() {
  if (typeof goTo === 'function') goTo('admin');
  if (typeof _navPush === 'function') { try { _navPush({ page: 'admin' }); } catch(_){} }
  _renderAdminPage();
};

window._showAdminInCurrentTab = function() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  if (typeof buildNav === 'function') buildNav('admin-nav-wrap',[]);
  _renderAdminPage();
  if (typeof goTo === 'function') goTo('admin');
};

window._renderAdminPage = function() {
  if (typeof isAdmin === 'undefined' || !isAdmin) return;
  const host = $('page-admin'); if (!host) return;
  host.innerHTML = _shell();
  _renderRail();
  _renderWork();
  _syncEmergencyState();
  // Load pricing defaults
  if (typeof _adminLoadPricing === 'function' && _cat === 'plans') _adminLoadPricing();
};

})();
