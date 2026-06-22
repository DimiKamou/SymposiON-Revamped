/* bg.js — builds the Troy & Palace scenes (SVG silhouettes) and runs the
   particle FX canvases. Vanilla JS, no deps. */
(function () {
'use strict';

/* ───────── SVG silhouette builders (simple geometry only) ───────── */
function warrior({ fill='#0E0A08', dir=1, crest=false, crestColor='#C8542B', bow=false, shield=true }) {
  const flip = dir < 0 ? 'scale(-1,1) translate(-60,0)' : '';
  return `<svg viewBox="0 0 60 104" width="100%" height="100%" style="overflow:visible">
    <g transform="${flip}" fill="${fill}">
      ${bow ? '' : '<rect x="5" y="18" width="54" height="3" transform="rotate(34 5 18)"/>'}
      ${bow ? `<path d="M 44 18 Q 60 50 44 82" fill="none" stroke="${fill}" stroke-width="3"/>
               <line x1="44" y1="18" x2="44" y2="82" stroke="${fill}" stroke-width="1.5"/>
               <line x1="30" y1="50" x2="58" y2="50" stroke="${fill}" stroke-width="2.5"/>` : ''}
      <path d="M24 76 L19 100 L23 100 L28 78 Z"/>
      <path d="M34 76 L41 100 L37 100 L32 78 Z"/>
      <path d="M21 64 L39 64 L43 80 L17 80 Z"/>
      <path d="M23 41 L37 41 L39 66 L21 66 Z"/>
      <circle cx="30" cy="32" r="7"/>
      <path d="M22 31 Q30 18 38 31 Z"/>
      ${crest ? `<path d="M28 22 Q23 4 33 9 Q39 12 35 24 Z" fill="${crestColor}"/>` : ''}
      ${shield && !bow ? '<circle cx="43" cy="58" r="13"/>' : ''}
    </g></svg>`;
}

function ship({ hull='#0C0A09', sail='#16100C', sailLit='#3A2418' }) {
  return `<svg viewBox="0 0 240 120" width="100%" height="100%" style="overflow:visible">
    <!-- oars -->
    <g stroke="${hull}" stroke-width="2.4">
      ${[0,1,2,3,4,5].map(i=>`<line x1="${48+i*26}" y1="78" x2="${40+i*26}" y2="104"/>`).join('')}
    </g>
    <!-- hull -->
    <path d="M18 72 Q120 96 222 72 Q210 86 196 88 L44 88 Q30 86 18 72 Z" fill="${hull}"/>
    <path d="M18 72 Q8 60 20 50 Q26 60 30 70 Z" fill="${hull}"/>
    <path d="M222 72 Q236 56 224 44 Q214 58 212 70 Z" fill="${hull}"/>
    <!-- prow eye -->
    <circle cx="30" cy="66" r="3.5" fill="#C8542B"/>
    <!-- mast + yard -->
    <line x1="120" y1="78" x2="120" y2="8" stroke="${hull}" stroke-width="3.5"/>
    <line x1="74" y1="20" x2="166" y2="20" stroke="${hull}" stroke-width="2.5"/>
    <!-- sail (billowing) -->
    <path class="sail" d="M80 22 Q120 30 160 22 L158 64 Q120 74 82 64 Z" fill="${sail}"/>
    <path d="M80 22 Q120 30 160 22 L159 40 Q120 48 81 40 Z" fill="${sailLit}" opacity=".5"/>
    <!-- shields on rail -->
    <g fill="#1A120C">${[0,1,2,3].map(i=>`<circle cx="${66+i*30}" cy="80" r="6"/>`).join('')}</g>
  </svg>`;
}

function column({ marble='#C7B187', shade='#5E4A32', lit='#E2CDA0' }) {
  return `<svg viewBox="0 0 70 320" width="100%" height="100%" preserveAspectRatio="none" style="overflow:visible">
    <rect x="6" y="300" width="58" height="20" fill="${shade}"/>
    <path d="M12 40 L58 40 L62 300 L8 300 Z" fill="${marble}"/>
    <path d="M35 40 L58 40 L62 300 L38 300 Z" fill="${shade}" opacity=".5"/>
    <g stroke="${shade}" stroke-width="1" opacity=".5">
      ${[0,1,2,3,4].map(i=>`<line x1="${18+i*8}" y1="46" x2="${16+i*9}" y2="298"/>`).join('')}
    </g>
    <path d="M6 40 L64 40 L60 22 L10 22 Z" fill="${marble}"/>
    <rect x="4" y="8" width="62" height="15" fill="${lit}"/>
    <rect x="4" y="8" width="62" height="15" fill="${shade}" opacity=".25"/>
  </svg>`;
}

function brazierStand({ metal='#1C140D' }) {
  return `<svg viewBox="0 0 80 120" width="100%" height="100%" style="overflow:visible">
    <line x1="24" y1="46" x2="14" y2="116" stroke="${metal}" stroke-width="5"/>
    <line x1="56" y1="46" x2="66" y2="116" stroke="${metal}" stroke-width="5"/>
    <line x1="40" y1="46" x2="40" y2="116" stroke="${metal}" stroke-width="5"/>
    <path d="M10 40 Q40 56 70 40 L64 50 Q40 62 16 50 Z" fill="${metal}"/>
    <ellipse cx="40" cy="40" rx="30" ry="8" fill="#2A1C10"/>
  </svg>`;
}
function flameSVG() {
  return `<svg viewBox="0 0 60 90" width="100%" height="100%" style="overflow:visible">
    <path d="M30 90 Q8 60 22 30 Q24 48 32 40 Q30 18 44 6 Q40 34 50 44 Q56 64 30 90 Z" fill="#E8742A"/>
    <path d="M30 88 Q16 62 26 38 Q28 52 34 46 Q33 28 42 18 Q40 42 46 50 Q48 66 30 88 Z" fill="#F6C44A"/>
    <path d="M30 84 Q24 64 30 50 Q31 60 35 56 Q34 46 38 40 Q38 58 30 84 Z" fill="#FBE6A0"/>
  </svg>`;
}

function kline({ wood='#4A3522', cushion='#A8472A', body='#160E08' }) {
  return `<svg viewBox="0 0 180 100" width="100%" height="100%" style="overflow:visible">
    <rect x="10" y="58" width="160" height="16" fill="${wood}"/>
    <rect x="10" y="52" width="160" height="8" rx="3" fill="${cushion}"/>
    <rect x="150" y="30" width="20" height="30" rx="4" fill="${cushion}"/>
    <rect x="16" y="74" width="9" height="22" fill="${wood}"/>
    <rect x="155" y="74" width="9" height="22" fill="${wood}"/>
    <!-- reclining figure -->
    <path d="M44 52 Q70 40 96 46 L150 44 L150 54 L60 56 Z" fill="${body}"/>
    <circle cx="150" cy="40" r="9" fill="${body}"/>
    <line x1="84" y1="50" x2="70" y2="34" stroke="${body}" stroke-width="4"/>
    <circle cx="66" cy="32" r="4" fill="${body}"/> <!-- kylix hand -->
  </svg>`;
}

function krater({ clay='#1A1009', fig='#C8542B' }) {
  return `<svg viewBox="0 0 60 80" width="100%" height="100%" style="overflow:visible">
    <path d="M14 20 Q30 34 46 20 L40 58 Q30 66 20 58 Z" fill="${clay}"/>
    <path d="M14 20 Q4 16 8 30 Q12 26 16 28 Z" fill="${clay}"/>
    <path d="M46 20 Q56 16 52 30 Q48 26 44 28 Z" fill="${clay}"/>
    <rect x="24" y="64" width="12" height="10" fill="${clay}"/>
    <ellipse cx="30" cy="76" rx="12" ry="3" fill="${clay}"/>
    <circle cx="30" cy="36" r="6" fill="${fig}" opacity=".8"/>
  </svg>`;
}

/* grounded walled city — the hill fills the FULL bottom edge so it can never float */
function cityscape({ wall='#0F0A0C', hill='#120B10', litTop=false }={}) {
  return `<svg viewBox="0 0 800 380" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" style="overflow:visible">
    <path d="M0 380 L0 232 Q240 168 520 188 Q680 200 800 238 L800 380 Z" fill="${hill}"/>
    <rect x="150" y="150" width="350" height="230" fill="${wall}"/>
    <path d="M150 150 L500 122 L500 150 Z" fill="${wall}"/>
    <g fill="${wall}">${Array.from({length:12},(_,i)=>`<rect x="${162+i*28}" y="${146-i*2}" width="18" height="18"/>`).join('')}</g>
    <rect x="120" y="96" width="80" height="284" fill="${wall}"/>
    <rect x="430" y="68" width="96" height="312" fill="${wall}"/>
    <g fill="${wall}"><rect x="120" y="84" width="22" height="16"/><rect x="152" y="82" width="22" height="16"/><rect x="184" y="84" width="16" height="16"/></g>
    <g fill="${wall}"><rect x="430" y="56" width="24" height="16"/><rect x="466" y="54" width="24" height="16"/><rect x="500" y="56" width="22" height="16"/></g>
    <path d="M280 380 L280 252 Q330 208 380 252 L380 380 Z" fill="#06040a"/>
    ${litTop?`<rect x="430" y="68" width="96" height="46" fill="#3a1c10"/>`:''}
  </svg>`;
}

/* low distant skyline across the plain horizon */
function skylineFar({ fill='#0E0A0C' }={}) {
  return `<svg viewBox="0 0 1600 130" width="100%" height="100%" preserveAspectRatio="xMidYMax slice" style="overflow:visible">
    <path d="M0 130 L0 84 L70 84 L70 60 L140 60 L140 86 L320 86 L320 46 L380 46 L380 32 L440 32 L440 46 L500 46 L500 86 L900 86 L900 64 L1000 64 L1000 40 L1090 40 L1090 64 L1240 64 L1240 82 L1600 82 L1600 130 Z" fill="${fill}"/>
  </svg>`;
}

/* robed civilian (e.g. Andromache / Priam), optionally cradling a child */
function robedFigure({ fill='#0E0A08', baby=false }={}) {
  return `<svg viewBox="0 0 50 120" width="100%" height="100%" style="overflow:visible">
    <g fill="${fill}">
      <path d="M16 46 L34 46 L40 116 L10 116 Z"/>
      <circle cx="25" cy="32" r="7"/>
      <path d="M17 30 Q25 17 33 30 L33 38 Q25 33 17 38 Z"/>
      <path d="M18 52 L7 66" stroke="${fill}" stroke-width="5" stroke-linecap="round"/>
      ${baby?`<ellipse cx="7" cy="66" rx="6" ry="9" fill="${fill}"/><circle cx="7" cy="60" r="4.5" fill="${fill}"/>`:''}
    </g></svg>`;
}

/* Achilles' tent — draped lean-to */
function tentSVG({ canvas='#241A12', pole='#15100A', lit='#5E3F28' }={}) {
  return `<svg viewBox="0 0 340 230" width="100%" height="100%" preserveAspectRatio="xMidYMax meet" style="overflow:visible">
    <line x1="60" y1="46" x2="60" y2="220" stroke="${pole}" stroke-width="6"/>
    <line x1="280" y1="46" x2="280" y2="220" stroke="${pole}" stroke-width="6"/>
    <path d="M30 56 Q170 8 310 56 L320 220 L20 220 Z" fill="${canvas}"/>
    <path d="M30 56 Q170 8 310 56 L170 72 Z" fill="${lit}" opacity=".4"/>
    <path d="M148 220 L158 96 Q170 88 182 96 L192 220 Z" fill="#06040a"/>
    <line x1="30" y1="56" x2="4" y2="220" stroke="${pole}" stroke-width="2"/>
    <line x1="310" y1="56" x2="336" y2="220" stroke="${pole}" stroke-width="2"/>
  </svg>`;
}

/* ───────── DOM assembly ───────── */
function el(cls, html, style) {
  const d = document.createElement('div');
  if (cls) d.className = cls;
  if (html != null) d.innerHTML = html;
  if (style) d.setAttribute('style', style);
  return d;
}

/* ───────── Iliad rhapsodies — five distinct battlefields ───────── */
const TROY_RHAPSODIES = {
  alpha: { roman:'Α', latin:'I',    label:'Η Μήνις',            sub:'αυγή · οι Αχαιοί στην ακτή',
    sky:'linear-gradient(180deg,#191230 0%,#3A2348 24%,#6E3650 45%,#B0532F 65%,#E08A44 83%,#F2B85E 96%)',
    sun:{x:'44%',y:'58%'}, mood:'camp', fx:{ sea:true, embers:'city', arrows:'volley', birds:3 } },
  zeta:  { roman:'Ζ', latin:'VI',   label:'Έκτωρ & Ανδρομάχη',  sub:'μέρα · οι Σκαιές Πύλες',
    sky:'linear-gradient(180deg,#2C5E86 0%,#5688AC 32%,#94B6C6 58%,#CDC2A0 82%,#DBCAA0 96%)',
    sun:null, ground:'linear-gradient(180deg,#B89A60,#8E7240 50%,#5E4A28)', mood:'gate', fx:{ dust:'light', birds:2 } },
  pi:    { roman:'Π', latin:'XVI',  label:'Θάνατος Πατρόκλου',  sub:'μεσημέρι · η σκονισμένη πεδιάδα',
    sky:'linear-gradient(180deg,#7E6236 0%,#B08C46 28%,#CFAA5E 52%,#BE9850 78%,#8E6E34 96%)',
    sun:{x:'52%',y:'22%',small:true}, ground:'linear-gradient(180deg,#BC9C5E,#8C6E3A 50%,#5A4624)', mood:'plain', fx:{ dust:'heavy', arrows:'volley' } },
  chi:   { roman:'Χ', latin:'XXII', label:'Θάνατος Έκτορα',     sub:'δειλινό · κάτω από τα τείχη',
    sky:'linear-gradient(180deg,#1C1430 0%,#46233E 28%,#84303A 52%,#C24A2E 74%,#E47C38 92%)',
    sun:{x:'26%',y:'56%'}, ground:'linear-gradient(180deg,#6E4830,#48301E 50%,#281A10)', mood:'walls', fx:{ dust:'med', arrows:'volley', embers:'city' } },
  omega: { roman:'Ω', latin:'XXIV', label:'Πρίαμος & Αχιλλέας', sub:'νύχτα · τα λύτρα στη σκηνή',
    sky:'linear-gradient(180deg,#06091A 0%,#0C1230 38%,#171B40 64%,#281E38 86%,#3A2830 98%)',
    sun:null, stars:true, ground:'linear-gradient(180deg,#1E1A2A,#14121C 50%,#0A0810)', mood:'tent', fx:{ embers:'braziers' } },
};

function buildTroy(scene, key) {
  key = TROY_RHAPSODIES[key] ? key : 'alpha';
  const cfg = TROY_RHAPSODIES[key];
  scene.innerHTML = '';
  scene.dataset.rhap = key;

  const sky = el('layer troy-sky'); sky.style.background = cfg.sky; scene.appendChild(sky);
  if (cfg.stars) { const st=el('stars'); for(let i=0;i<70;i++){ const s=document.createElement('span'); s.className='star';
      s.style.cssText=`left:${(Math.random()*100).toFixed(1)}%;top:${(Math.random()*54).toFixed(1)}%;animation-delay:${(Math.random()*3).toFixed(2)}s;opacity:${(.3+Math.random()*.6).toFixed(2)}`; st.appendChild(s);} sky.appendChild(st); }
  if (cfg.sun) { const halo=el('sun-halo'), sun=el('sun');
    halo.style.left=sun.style.left=cfg.sun.x; halo.style.top=sun.style.top=cfg.sun.y;
    if(cfg.sun.small){ sun.style.width=sun.style.height='98px'; }
    sky.appendChild(halo); sky.appendChild(sun); }
  if (!cfg.stars) ['c1','c2','c3'].forEach(c=>sky.appendChild(el('cloud '+c)));

  ({ camp:troyCamp, gate:troyGate, plain:troyPlain, walls:troyWalls, tent:troyTent }[cfg.mood])(scene, cfg);

  scene.appendChild(el('vignette')); scene.appendChild(el('grain'));
  const cap=el('caption'); cap.innerHTML=`<b>ΙΛΙΑΔΑ · ${cfg.roman}</b> — ${cfg.label} · ${cfg.sub}`; scene.appendChild(cap);
  const fx=document.createElement('canvas'); fx.className='fx'; fx.width=1600; fx.height=900; scene.appendChild(fx);
  return { canvas:fx, cfg };
}

/* ── shared troy pieces ── */
function troyGroundLayer(scene, grad) { const g=el('layer plain'); if(grad) g.style.background=grad; scene.appendChild(g); return g; }
function troyStuckSpears(parent, n) { for(let i=0;i<n;i++){ const sp=el(null,
  `<svg viewBox="0 0 10 80" width="6" height="46" style="overflow:visible"><line x1="5" y1="0" x2="5" y2="80" stroke="#0E0A08" stroke-width="3"/></svg>`);
  sp.style.cssText=`position:absolute;left:${(8+Math.random()*84).toFixed(1)}%;top:${(85+Math.random()*7).toFixed(1)}%;transform:rotate(${(-20+Math.random()*40).toFixed(0)}deg)`; parent.appendChild(sp);} }
function troyFallen(parent, x, w, rot) { const f=el('fallen', warrior({fill:'#0C0907',dir:1}));
  f.style.cssText=`left:${x};top:88%;width:${w}px;height:${(w*0.56).toFixed(0)}px;transform:rotate(${rot}deg)`; parent.appendChild(f); }
function wallWatchers(scene, xs, topPct) { const w=el('layer'); scene.appendChild(w);
  xs.forEach((x,i)=>{ const f=el(null, warrior({fill:'#0C0908',dir:i%2?1:-1,crest:false,shield:false}));
    f.style.cssText=`position:absolute;left:${x};top:${topPct};width:30px;height:54px;opacity:.85`; w.appendChild(f);} ); }

/* Α — dawn, the Greek camp on the beach */
function troyCamp(scene) {
  const city=el('layer troy-city', cityscape({})); scene.appendChild(city); scene.appendChild(el('troy-fire-glow'));
  const sea=el('layer sea','<div class="sea-reflect"></div>'); scene.appendChild(sea);
  for(let i=0;i<4;i++){ const b=el('sea-band'); b.style.top=(20+i*18)+'%'; b.style.animationDelay=(i*0.7)+'s'; sea.appendChild(b);}
  scene.appendChild(el('layer beach'));
  const ships=el('layer'); scene.appendChild(ships);
  [{x:'4%',y:'48%',w:240,d:'far'},{x:'20%',y:'51%',w:300,d:'mid'},{x:'40%',y:'54%',w:340,d:''},{x:'2%',y:'58%',w:420,d:''}]
    .forEach((s,i)=>{ const sh=el('ship '+s.d, ship({})); sh.style.cssText+=`left:${s.x};top:${s.y};width:${s.w}px;animation-delay:${i*0.8}s`; ships.appendChild(sh);});
  const combat=el('layer'); scene.appendChild(combat);
  troyStuckSpears(combat,7); troyFallen(combat,'24%',60,82);
  addDuel(combat,{x:'14%',y:'80%',s:1.5,heroCrest:'#C8542B'});
  addDuel(combat,{x:'48%',y:'78%',s:1.25,heroCrest:'#E8C96A',delay:.5});
  addDuel(combat,{x:'70%',y:'82%',s:1.8,heroCrest:'#C8542B',delay:.9});
  addDuel(combat,{x:'88%',y:'76%',s:1.0,heroCrest:'#E8C96A',delay:.3,faded:true});
}

/* Ζ — day, the Scaean Gates: Hector & Andromache */
function troyGate(scene, cfg) {
  troyGroundLayer(scene, cfg.ground);
  const wall=el('layer troy-wall-big', cityscape({})); scene.appendChild(wall);
  wallWatchers(scene, ['60%','67%','74%','81%'], '37%');
  const fg=el('layer'); scene.appendChild(fg);
  const sentry=el(null, warrior({fill:'#0E0A08',dir:-1,crest:false})); sentry.style.cssText='position:absolute;left:50%;top:72%;width:64px;height:104px;opacity:.92'; fg.appendChild(sentry);
  const hector=el(null, warrior({fill:'#0E0A08',dir:1,crest:true,crestColor:'#C8542B'})); hector.style.cssText='position:absolute;left:28%;top:66%;width:84px;height:138px'; fg.appendChild(hector);
  const andro=el(null, robedFigure({baby:true})); andro.style.cssText='position:absolute;left:36%;top:69%;width:62px;height:128px'; fg.appendChild(andro);
  troyStuckSpears(fg,3);
}

/* Π — midday, the dusty plain, the death of Patroclus */
function troyPlain(scene, cfg) {
  troyGroundLayer(scene, cfg.ground);
  const far=el('layer troy-skyline', skylineFar()); scene.appendChild(far);
  const combat=el('layer'); scene.appendChild(combat);
  troyStuckSpears(combat,10);
  troyFallen(combat,'18%',64,80); troyFallen(combat,'58%',58,-78); troyFallen(combat,'80%',54,84);
  addDuel(combat,{x:'8%',y:'80%',s:1.2,heroCrest:'#C8542B',delay:.1});
  addDuel(combat,{x:'26%',y:'82%',s:1.5,heroCrest:'#E8C96A',delay:.5});
  addDuel(combat,{x:'46%',y:'79%',s:1.3,heroCrest:'#C8542B',delay:.9});
  addDuel(combat,{x:'66%',y:'83%',s:1.7,heroCrest:'#E8C96A',delay:.3});
  addDuel(combat,{x:'88%',y:'80%',s:1.1,heroCrest:'#C8542B',delay:.7,faded:true});
}

/* Χ — dusk, beneath the great walls, the death of Hector */
function troyWalls(scene, cfg) {
  troyGroundLayer(scene, cfg.ground);
  const wall=el('layer troy-wall-loom', cityscape({})); scene.appendChild(wall);
  wallWatchers(scene, ['58%','64%','70%','76%','82%','88%'], '32%');
  const combat=el('layer'); scene.appendChild(combat);
  troyStuckSpears(combat,6); troyFallen(combat,'14%',58,82);
  addDuel(combat,{x:'34%',y:'66%',s:2.4,heroCrest:'#E8C96A',delay:.2});
  addDuel(combat,{x:'76%',y:'80%',s:1.0,heroCrest:'#C8542B',delay:.6,faded:true});
}

/* Ω — night, the ransom at Achilles' tent */
function troyTent(scene, cfg) {
  troyGroundLayer(scene, cfg.ground);
  const far=el('layer troy-skyline night', skylineFar({fill:'#0A0710'})); scene.appendChild(far);
  scene.appendChild(el('troy-fire-glow night'));
  const tent=el('layer'); scene.appendChild(tent);
  const t=el(null, tentSVG({})); t.style.cssText='position:absolute;left:8%;top:40%;width:32%;height:46%'; tent.appendChild(t);
  [['28%','62%',1.0],['72%','60%',1.1]].forEach(([x,y,s],i)=>{
    const stand=el('brazier', brazierStand({})); stand.style.cssText=`left:${x};top:${y};width:${80*s}px;height:${120*s}px`;
    const glow=el('brazier-glow',''); glow.style.cssText=`width:${240*s}px;height:${240*s}px;left:${40*s-120*s}px;top:${-110*s}px;animation-delay:${i*0.3}s`;
    const fl=el('flame '+['','b'][i%2], flameSVG()); fl.style.cssText=`position:absolute;left:${28*s}px;top:${-34*s}px;width:${36*s}px;height:${54*s}px;animation-delay:${i*0.13}s`;
    stand.appendChild(glow); stand.appendChild(fl); tent.appendChild(stand);
  });
  const ach=el(null, warrior({fill:'#0E0A08',dir:1,crest:true,crestColor:'#E8C96A'})); ach.style.cssText='position:absolute;left:40%;top:70%;width:74px;height:120px'; tent.appendChild(ach);
  const priam=el(null, robedFigure({})); priam.style.cssText='position:absolute;left:52%;top:78%;width:58px;height:96px;transform:rotate(8deg)'; tent.appendChild(priam);
}

function addDuel(parent, { x, y, s=1, heroCrest='#C8542B', delay=0, faded=false }) {
  const wrap = el('duel');
  wrap.style.cssText = `left:${x};top:${y};width:${70*s}px;height:${104*s}px;${faded?'filter:brightness(.55);opacity:.85':''}`;
  const hero = el('fighter atk', warrior({fill:'#0E0A08', dir:1, crest:true, crestColor:heroCrest}));
  hero.style.cssText = 'position:absolute;left:0;bottom:0;width:50%;height:100%;animation-delay:'+delay+'s';
  const foe = el('fighter def', warrior({fill:'#120C0A', dir:-1, crest:false}));
  foe.style.cssText = 'position:absolute;right:0;bottom:0;width:50%;height:100%;animation-delay:'+delay+'s';
  const spark = el('clash-spark', `<svg viewBox="0 0 34 34" width="100%" height="100%">${
    [0,45,90,135,180,225,270,315].map(a=>`<line x1="17" y1="17" x2="${17+Math.cos(a*Math.PI/180)*16}" y2="${17+Math.sin(a*Math.PI/180)*16}" stroke="#F6C44A" stroke-width="2.4" stroke-linecap="round"/>`).join('')
  }</svg>`);
  spark.style.cssText = 'left:42%;top:34%;animation-delay:'+delay+'s';
  wrap.appendChild(hero); wrap.appendChild(foe); wrap.appendChild(spark);
  parent.appendChild(wrap);
}

/* ───────── Odyssey actors ───────── */
function cyclops({ fill='#0E0A08', eye='#F6C44A' }={}) {
  return `<svg viewBox="0 0 160 300" width="100%" height="100%" style="overflow:visible">
    <g fill="${fill}">
      <path d="M60 200 L46 296 L72 296 L78 204 Z"/>
      <path d="M100 200 L114 296 L88 296 L82 204 Z"/>
      <path d="M42 96 Q80 78 118 96 L124 210 L36 210 Z"/>
      <path d="M48 110 L14 184 L28 192 L62 124 Z"/>
      <path d="M112 110 L150 168 L136 178 L98 124 Z"/>
      <circle cx="80" cy="58" r="36"/>
      <path d="M44 42 Q80 4 116 42 Q106 24 80 22 Q54 24 44 42 Z"/>
      <path d="M40 56 Q30 70 38 84 M120 56 Q130 70 122 84" stroke="${fill}" stroke-width="6" fill="none"/>
    </g>
    <circle cx="80" cy="54" r="10" fill="${eye}"/>
    <circle cx="80" cy="54" r="4.5" fill="#1A0E06"/>
  </svg>`;
}
function siren({ fill='#0E0A08', wing='#17100C' }={}) {
  return `<svg viewBox="0 0 96 134" width="100%" height="100%" style="overflow:visible">
    <g fill="${fill}">
      <path d="M32 74 Q48 60 64 74 L70 116 Q48 128 26 116 Z"/>
      <path d="M30 116 L24 132 M48 122 L48 134 M66 116 L72 132" stroke="${fill}" stroke-width="3"/>
    </g>
    <path d="M32 70 Q4 52 6 92 Q20 78 36 84 Z" fill="${wing}"/>
    <path d="M64 70 Q92 52 90 92 Q76 78 60 84 Z" fill="${wing}"/>
    <g fill="${fill}">
      <path d="M40 40 L56 40 L60 76 L36 76 Z"/>
      <circle cx="48" cy="30" r="7.5"/>
      <path d="M40 28 Q34 48 42 62 L47 60 Q41 46 45 30 Z"/>
    </g>
  </svg>`;
}
function swine({ fill='#0E0A08' }={}) {
  return `<svg viewBox="0 0 96 58" width="100%" height="100%" style="overflow:visible">
    <g fill="${fill}">
      <ellipse cx="44" cy="30" rx="32" ry="16"/>
      <path d="M70 20 Q90 22 88 38 Q82 48 68 42 Z"/>
      <ellipse cx="85" cy="35" rx="4" ry="3" fill="#1A0E06"/>
      <path d="M66 16 L72 4 L78 18 Z"/>
      <rect x="26" y="40" width="6" height="16"/><rect x="40" y="42" width="6" height="16"/>
      <rect x="52" y="42" width="6" height="16"/><rect x="62" y="40" width="6" height="16"/>
      <path d="M14 24 Q2 20 9 32" fill="none" stroke="${fill}" stroke-width="3"/>
    </g></svg>`;
}
function sorceress({ fill='#0E0A08', wand='#9DE0A8' }={}) {
  return `<svg viewBox="0 0 64 134" width="100%" height="100%" style="overflow:visible">
    <g fill="${fill}">
      <path d="M16 48 L42 48 L50 128 L8 128 Z"/>
      <circle cx="29" cy="32" r="7.5"/>
      <path d="M19 30 Q29 14 39 30 L40 42 Q29 36 18 42 Z"/>
      <path d="M40 54 L58 26" stroke="${fill}" stroke-width="5" stroke-linecap="round"/>
    </g>
    <line x1="58" y1="26" x2="62" y2="6" stroke="${wand}" stroke-width="2.5"/>
    <circle cx="62" cy="6" r="4" fill="${wand}"/>
  </svg>`;
}
function lyrePlayer({ fill='#0E0A08' }={}) {
  return `<svg viewBox="0 0 76 116" width="100%" height="100%" style="overflow:visible">
    <g fill="${fill}">
      <path d="M22 62 L48 62 L52 110 L16 110 Z"/>
      <circle cx="34" cy="48" r="7.5"/>
      <path d="M26 30 L20 18 M44 30 L52 18" stroke="${fill}" stroke-width="0"/>
    </g>
    <path d="M48 56 Q70 46 64 84 Q56 66 46 72 Z" fill="none" stroke="${fill}" stroke-width="3.4"/>
    <g stroke="${fill}" stroke-width="1.2">${[0,1,2,3].map(i=>`<line x1="${52+i*3}" y1="58" x2="${50+i*3}" y2="78"/>`).join('')}</g>
  </svg>`;
}
function stalactites({ fill='#0B0A10' }={}) {
  let p='M0 0 ', x=0, seed=7;
  const rnd=()=>{ seed=(seed*9301+49297)%233280; return seed/233280; };
  while(x<800){ const w=22+rnd()*44, h=18+rnd()*72; p+=`L${(x+w/2).toFixed(0)} ${h.toFixed(0)} L${(x+w).toFixed(0)} 0 `; x+=w; }
  return `<svg viewBox="0 0 800 100" width="100%" height="100%" preserveAspectRatio="none" style="overflow:visible"><path d="${p}Z" fill="${fill}"/></svg>`;
}
function caveMouth({ fill='#0A0608' }={}) {
  return `<svg viewBox="0 0 600 600" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style="overflow:visible">
    <path d="M0 0 L600 0 L600 600 L0 600 Z M300 120 Q150 200 140 600 L460 600 Q450 200 300 120 Z" fill="${fill}" fill-rule="evenodd"/>
  </svg>`;
}
function sirenRock({ fill='#0C0B12' }={}) {
  return `<svg viewBox="0 0 220 180" width="100%" height="100%" preserveAspectRatio="none" style="overflow:visible">
    <path d="M0 180 L18 70 L54 36 L104 58 L150 30 L188 64 L220 110 L220 180 Z" fill="${fill}"/></svg>`;
}
function bigFire({ scale=1 }={}) {
  return `<svg viewBox="0 0 120 140" width="100%" height="100%" style="overflow:visible">
    <ellipse cx="60" cy="128" rx="52" ry="12" fill="#3A1C0E"/>
    <g stroke="#1C120A" stroke-width="6" stroke-linecap="round">
      <line x1="22" y1="132" x2="60" y2="118"/><line x1="98" y1="132" x2="60" y2="118"/><line x1="60" y1="134" x2="60" y2="116"/>
    </g>
    <path d="M60 120 Q24 78 44 34 Q46 64 60 50 Q56 18 84 2 Q76 44 96 58 Q108 86 60 120 Z" fill="#E8742A"/>
    <path d="M60 116 Q36 80 50 44 Q52 66 62 56 Q60 30 76 18 Q70 52 84 62 Q90 88 60 116 Z" fill="#F6C44A"/>
    <path d="M60 110 Q48 82 56 60 Q57 74 64 68 Q62 50 70 42 Q66 74 60 110 Z" fill="#FBE6A0"/>
  </svg>`;
}

/* shared hall pieces */
function friezeSVG(color='#C8a23c') {
  return `<svg width="100%" height="34" preserveAspectRatio="xMidYMid"><defs><pattern id="pmk${color.replace('#','')}" width="34" height="34" patternUnits="userSpaceOnUse">
    <path d="M3 30 L3 6 L28 6 L28 22 L15 22 L15 14 L21 14" fill="none" stroke="${color}" stroke-width="2.4"/></pattern></defs>
    <rect width="100%" height="34" fill="url(#pmk${color.replace('#','')})"/></svg>`;
}
function hangingLamp() {
  const lamp = el('lamp', `<svg viewBox="0 0 40 150" width="40" height="200" style="overflow:visible">
    <line x1="20" y1="0" x2="20" y2="120" stroke="#1C140D" stroke-width="2"/>
    <path d="M6 120 Q20 150 34 120 Z" fill="#1C140D"/><ellipse cx="20" cy="120" rx="14" ry="5" fill="#2A1C10"/></svg>`);
  lamp.style.cssText='left:50%;margin-left:-20px;top:9%;'; lamp.appendChild(el('lamp-glow','','top:130px'));
  return lamp;
}
function makeBrazier(x,y,s,i) {
  const stand = el('brazier', brazierStand({}));
  stand.style.cssText=`left:${x};top:${y};width:${80*s}px;height:${120*s}px`;
  const glow = el('brazier-glow',''); glow.style.cssText=`width:${260*s}px;height:${260*s}px;left:${40*s-130*s}px;top:${-120*s}px;animation-delay:${i*0.3}s`;
  const fl = el('flame '+['','b','c'][i%3], flameSVG());
  fl.style.cssText=`position:absolute;left:${28*s}px;top:${-34*s}px;width:${36*s}px;height:${54*s}px;animation-delay:${i*0.13}s`;
  stand.appendChild(glow); stand.appendChild(fl); return stand;
}
function colonnade(scene, which, marble, lit) {
  const lay = el('layer colonnade '+which); scene.appendChild(lay);
  const n = which==='front'?0:6;
  if (which==='front') {
    lay.style.justifyContent='space-between';
    [0,1].forEach(()=>{ const c=el('col', column({marble:marble||'#B49E76', lit:lit||'#D8C198'})); c.style.cssText='width:80px;height:100%'; lay.appendChild(c); });
  } else {
    for (let i=0;i<n;i++){ const c=el('col', column({marble:marble||'#C7B187', lit:lit})); c.style.cssText='width:54px;height:100%'; lay.appendChild(c); }
  }
}

/* ───────── Odyssey rhapsodies ───────── */
const ODYSSEY_RHAPSODIES = {
  alpha: { roman:'Α', latin:'I',    label:'Στην Ιθάκη',           sub:'οι μνηστήρες ρημάζουν το παλάτι',
    bg:'radial-gradient(120% 92% at 50% 10%, #5E4226 0%, #3C2814 42%, #20140A 74%, #150C06 100%)',
    mood:'feast', frieze:'#E0B24A', fx:{ motes:46, moteColor:'#E8C98A', embers:[[800,560]] } },
  iota:  { roman:'Ι', latin:'IX',   label:'Ο Πολύφημος',          sub:'ο πυρωμένος πάσσαλος στο μάτι',
    bg:'radial-gradient(72% 64% at 50% 66%, #4A2410 0%, #24120A 42%, #0C0604 78%)',
    mood:'cyclops', fx:{ embers:[[800,560]], emberCount:64, motes:14, moteColor:'#C98A52' } },
  kappa: { roman:'Κ', latin:'X',    label:'Η Κίρκη',              sub:'οι σύντροφοι γίνονται χοίροι',
    bg:'radial-gradient(120% 92% at 50% 14%, #2E3C22 0%, #243016 38%, #161E0E 72%, #0E1408 100%)',
    mood:'circe', frieze:'#7FB46A', fx:{ motes:40, moteColor:'#A8D88A', embers:[[256,560],[1248,560]], emberCount:24, emberColor:'green' } },
  mu:    { roman:'Μ', latin:'XII',  label:'Οι Σειρῆνες',          sub:'δεμένος στο κατάρτι, ανοιχτά',
    bg:null, mood:'sea', fx:{ sea:true, spray:true, birds:2 } },
  chi:   { roman:'Χ', latin:'XXII', label:'Μνηστηροφονία',        sub:'το τόξο, οι μνηστήρες πέφτουν',
    bg:'radial-gradient(120% 90% at 50% 12%, #4A331F 0%, #311F12 38%, #1E1209 72%, #150C06 100%)',
    mood:'slaughter', frieze:'#C8a23c', fx:{ motes:40, moteColor:'#E8C98A', embers:[[256,520],[1248,500],[752,560]], emberCount:54, arrows:true } },
};

function buildPalace(scene, key) {
  key = ODYSSEY_RHAPSODIES[key] ? key : 'alpha';
  const cfg = ODYSSEY_RHAPSODIES[key];
  scene.innerHTML = '';
  scene.dataset.rhap = key;

  ({ feast:odyFeast, cyclops:odyCyclops, circe:odyCirce, sea:odySea, slaughter:odySlaughter }[cfg.mood])(scene, cfg);

  scene.appendChild(el('vignette')); scene.appendChild(el('grain'));
  const cap = el('caption'); cap.innerHTML = `<b>ΟΔΥΣΣΕΙΑ · ${cfg.roman}</b> — ${cfg.label} · ${cfg.sub}`; scene.appendChild(cap);
  const fx = document.createElement('canvas'); fx.className='fx'; fx.width=1600; fx.height=900; scene.appendChild(fx);
  return { canvas:fx, cfg };
}

function hallBase(scene, cfg) {
  const wall = el('layer hall-wall'); if (cfg.bg) wall.style.background = cfg.bg; scene.appendChild(wall);
  wall.appendChild(el('frieze', friezeSVG(cfg.frieze)));
  scene.appendChild(hangingLamp());
}

/* Α — the suitors' feast (the house consumed) */
function odyFeast(scene, cfg) {
  hallBase(scene, cfg);
  colonnade(scene, 'back');
  // lively symposium, foregrounded
  const symp = el('layer symposium'); symp.style.cssText += ';opacity:.9;filter:none;top:44%;height:34%'; scene.appendChild(symp);
  [ {x:'1%',w:210}, {x:'27%',w:230}, {x:'58%',w:220}, {x:'82%',w:200} ].forEach(k=>{
    const c=el('kline', kline({cushion:'#B8552E'})); c.style.cssText=`left:${k.x};bottom:0;width:${k.w}px;height:${k.w*0.55}px`; symp.appendChild(c); });
  // braziers light the feast
  scene.appendChild((()=>{ const b=el('layer'); [['14%','58%',1.0],['82%','56%',1.05]].forEach(([x,y,s],i)=>b.appendChild(makeBrazier(x,y,s,i))); return b; })());
  colonnade(scene, 'front');
  scene.appendChild(el('layer hall-floor'));
  // foreground actors
  const fg = el('layer'); scene.appendChild(fg);
  // bard Phemius with lyre, left
  const bard=el(null, lyrePlayer({})); bard.style.cssText='position:absolute;left:6%;top:68%;width:70px;height:108px;opacity:.95'; fg.appendChild(bard);
  // carousing suitors
  const s1=el('fighter atk'); s1.style.cssText='position:absolute;left:30%;top:66%;width:80px;height:128px;animation-duration:2.4s'; s1.innerHTML=warrior({fill:'#0E0A08',dir:1,crest:false,shield:false}); fg.appendChild(s1);
  const s2=el(null, warrior({fill:'#0E0A08',dir:-1,crest:false,shield:false})); s2.style.cssText='position:absolute;left:44%;top:67%;width:78px;height:124px'; fg.appendChild(s2);
  const s3=el('fighter def'); s3.style.cssText='position:absolute;left:62%;top:66%;width:82px;height:130px;animation-duration:2.8s'; s3.innerHTML=warrior({fill:'#100B08',dir:1,crest:false,shield:false}); fg.appendChild(s3);
  // Telemachus & Athena watching from the right edge
  const tel=el(null, warrior({fill:'#0E0A08',dir:-1,crest:true,crestColor:'#C8542B'})); tel.style.cssText='position:absolute;left:88%;top:64%;width:64px;height:128px'; fg.appendChild(tel);
  const ath=el(null, robedFigure({})); ath.style.cssText='position:absolute;left:80%;top:66%;width:54px;height:120px;opacity:.9'; fg.appendChild(ath);
  // strewn cups
  const kr=el(null, krater({})); kr.style.cssText='position:absolute;left:50%;top:86%;width:42px;height:56px'; fg.appendChild(kr);
}

/* Ι — the cave of Polyphemus */
function odyCyclops(scene, cfg) {
  const wall = el('layer cave-wall'); wall.style.background = cfg.bg; scene.appendChild(wall);
  const stal = el('layer stalactites', stalactites({})); scene.appendChild(stal);
  // cave mouth glow (moonlight) far back
  scene.appendChild(el('cave-moon'));
  scene.appendChild(el('layer cave-floor'));
  // sheep dotted at back
  const flock=el('layer'); scene.appendChild(flock);
  [['66%','60%',.5],['74%','62%',.45],['82%','61%',.5]].forEach(([x,y,s])=>{ const sh=el(null, swine({fill:'#1A120C'})); sh.style.cssText=`position:absolute;left:${x};top:${y};width:${90*s}px;height:${58*s}px;opacity:.7;filter:brightness(.6)`; flock.appendChild(sh); });
  // great central fire
  const fireWrap=el('layer'); scene.appendChild(fireWrap);
  scene.appendChild(el('cave-fire-glow'));
  const fire=el(null, bigFire({})); fire.style.cssText='position:absolute;left:46%;top:62%;width:120px;height:150px'; fireWrap.appendChild(fire);
  // Cyclops looming, right
  const cy=el(null, cyclops({})); cy.style.cssText='position:absolute;left:60%;top:30%;width:240px;height:430px'; fireWrap.appendChild(cy);
  // Odysseus + men driving the stake (a long pole angled up-right toward the eye)
  const men=el('layer'); scene.appendChild(men);
  const pole=el(null, `<svg viewBox="0 0 400 30" width="100%" height="100%" style="overflow:visible"><line x1="0" y1="24" x2="386" y2="4" stroke="#1C120A" stroke-width="7" stroke-linecap="round"/><path d="M386 4 L368 2 L372 12 Z" fill="#E8742A"/></svg>`);
  pole.style.cssText='position:absolute;left:14%;top:50%;width:360px;height:60px'; men.appendChild(pole);
  [['12%',1.0,0],['20%',.94,.3],['28%',.88,.6]].forEach(([x,s,d],i)=>{ const m=el('fighter atk'); m.style.cssText=`position:absolute;left:${x};top:${66- i*0}%;top:66%;width:${70*s}px;height:${110*s}px;animation-delay:${d}s`; m.innerHTML=warrior({fill:'#0E0A08',dir:1,crest:i===0,crestColor:'#E8C96A',shield:false}); men.appendChild(m); });
}

/* Κ — the hall of Circe */
function odyCirce(scene, cfg) {
  hallBase(scene, cfg);
  colonnade(scene, 'back', '#6E7A52', '#9DB46A');
  // braziers (greenish glow via CSS class)
  scene.appendChild((()=>{ const b=el('layer circe-light'); [['16%','58%',1.0],['80%','57%',1.05]].forEach(([x,y,s],i)=>b.appendChild(makeBrazier(x,y,s,i))); return b; })());
  colonnade(scene, 'front', '#5E6A44', '#8DA45E');
  scene.appendChild(el('layer hall-floor'));
  const fg=el('layer'); scene.appendChild(fg);
  // Circe centre with wand + cauldron
  const cir=el(null, sorceress({})); cir.style.cssText='position:absolute;left:46%;top:54%;width:72px;height:150px'; fg.appendChild(cir);
  const caul=el(null, krater({clay:'#14180C',fig:'#9DE0A8'})); caul.style.cssText='position:absolute;left:40%;top:72%;width:54px;height:72px'; fg.appendChild(caul);
  // swine — transformed companions
  [['10%','80%',1.1],['22%','84%',1.25],['33%','82%',1.0],['64%','83%',1.2],['78%','80%',1.05],['88%','84%',1.15]]
    .forEach(([x,y,s],i)=>{ const p=el(null, swine({})); p.style.cssText=`position:absolute;left:${x};top:${y};width:${90*s}px;height:${58*s}px;${i%2?'transform:scaleX(-1)':''}`; fg.appendChild(p); });
  // one man mid-transformation (kneeling), left of Circe
  const man=el(null, warrior({fill:'#0E0A08',dir:1,crest:false,shield:false})); man.style.cssText='position:absolute;left:56%;top:70%;width:60px;height:96px;transform:rotate(14deg);opacity:.9'; fg.appendChild(man);
}

/* Μ — the Sirens, bound to the mast */
function odySea(scene, cfg) {
  const sky=el('layer ody-sky'); scene.appendChild(sky);
  ['c1','c2'].forEach(c=>sky.appendChild(el('cloud '+c)));
  const sea=el('layer ody-sea','<div class="sea-reflect"></div>'); scene.appendChild(sea);
  for(let i=0;i<4;i++){ const b=el('sea-band'); b.style.top=(24+i*16)+'%'; b.style.animationDelay=(i*0.6)+'s'; sea.appendChild(b); }
  // siren rocks left & right
  const rocks=el('layer'); scene.appendChild(rocks);
  const rkL=el(null, sirenRock({})); rkL.style.cssText='position:absolute;left:-2%;top:54%;width:26%;height:30%'; rocks.appendChild(rkL);
  const rkR=el(null, sirenRock({})); rkR.style.cssText='position:absolute;right:-2%;left:auto;top:52%;width:28%;height:32%;transform:scaleX(-1)'; rocks.appendChild(rkR);
  // sirens perched
  [['4%','48%',1.0,0],['15%','52%',.85,.4],['84%','47%',1.05,.2],['92%','51%',.8,.6]].forEach(([x,y,s,d])=>{
    const sr=el('siren-perch', siren({})); sr.style.cssText=`left:${x};top:${y};width:${72*s}px;height:${100*s}px;animation-delay:${d}s`; rocks.appendChild(sr); });
  // the ship, centre, with bound Odysseus on the mast
  const shipWrap=el('layer'); scene.appendChild(shipWrap);
  const sh=el('ship', ship({})); sh.style.cssText+='left:34%;top:56%;width:460px'; shipWrap.appendChild(sh);
  // Odysseus bound to mast
  const ody=el(null, warrior({fill:'#0E0A08',dir:1,crest:true,crestColor:'#C8542B',shield:false,spear:false}));
  ody.style.cssText='position:absolute;left:47%;top:52%;width:48px;height:96px'; shipWrap.appendChild(ody);
  const rope=el(null,`<svg viewBox="0 0 40 70" width="100%" height="100%" style="overflow:visible"><path d="M4 14 Q36 24 4 34 Q36 44 4 54" fill="none" stroke="#5E4A2E" stroke-width="2.4"/></svg>`);
  rope.style.cssText='position:absolute;left:47.5%;top:53%;width:40px;height:70px'; shipWrap.appendChild(rope);
  // rowers (heads bent, wax in ears)
  [['40%',0],['43%',.2],['56%',.4],['59%',.6]].forEach(([x,d])=>{ const r=el('fighter def'); r.style.cssText=`position:absolute;left:${x};top:62%;width:34px;height:60px;animation-delay:${d}s;animation-duration:2.2s`; r.innerHTML=warrior({fill:'#0E0A08',dir:1,crest:false,shield:false,spear:false}); shipWrap.appendChild(r); });
}

/* Χ — the slaughter of the suitors (original) */
function odySlaughter(scene, cfg) {
  hallBase(scene, cfg);
  // dim symposium behind
  const symp = el('layer symposium'); scene.appendChild(symp);
  [ {x:'2%',w:200}, {x:'30%',w:220}, {x:'62%',w:200}, {x:'84%',w:180} ].forEach(k=>{ const c=el('kline', kline({})); c.style.cssText=`left:${k.x};bottom:0;width:${k.w}px;height:${k.w*0.55}px`; symp.appendChild(c); });
  const kr=el(null, krater({})); kr.style.cssText='position:absolute;left:48%;bottom:2%;width:46px;height:62px'; symp.appendChild(kr);
  colonnade(scene, 'back');
  scene.appendChild((()=>{ const b=el('layer'); [['16%','58%',1.1],['78%','56%',1.2],['47%','62%',.9]].forEach(([x,y,s],i)=>b.appendChild(makeBrazier(x,y,s,i))); return b; })());
  colonnade(scene, 'front');
  scene.appendChild(el('layer hall-floor'));
  const combat = el('layer'); scene.appendChild(combat);
  const ody = el('duel'); ody.style.cssText='left:9%;top:64%;width:120px;height:180px';
  const odyFig = el(null, warrior({fill:'#0E0A08', dir:1, crest:true, crestColor:'#E8C96A', bow:true})); odyFig.style.cssText='position:absolute;inset:0';
  ody.appendChild(odyFig); combat.appendChild(ody);
  const tel = el('fighter atk'); tel.style.cssText='position:absolute;left:20%;top:66%;width:96px;height:150px;animation-delay:.4s';
  tel.innerHTML = warrior({fill:'#0E0A08', dir:1, crest:true, crestColor:'#C8542B'}); combat.appendChild(tel);
  addDuel(combat, {x:'52%', y:'66%', s:1.5, heroCrest:'#C8542B', delay:.2});
  const flee = el('fighter def'); flee.style.cssText='position:absolute;left:74%;top:68%;width:90px;height:150px;animation-delay:.6s;transform:scaleX(-1)';
  flee.innerHTML = warrior({fill:'#140D0A', dir:1, crest:false, shield:false}); combat.appendChild(flee);
  const fallen = el('fallen', warrior({fill:'#0C0907', dir:1, shield:false}));
  fallen.style.cssText='left:40%;top:84%;width:120px;height:64px;transform:rotate(84deg)'; combat.appendChild(fallen);
  const okr = el(null, krater({clay:'#160E08'})); okr.style.cssText='position:absolute;left:64%;top:88%;width:40px;height:54px;transform:rotate(70deg);opacity:.8'; combat.appendChild(okr);
}

/* ───────── particle FX ───────── */
let troyToken = 0;
function troyFX(canvas, cfg, token) {
  const ctx = canvas.getContext('2d');
  const F = (cfg && cfg.fx) || {};
  const embers=[], arrows=[], birds=[], glints=[], dust=[];
  const emberSrc = F.embers==='braziers' ? [[300,560],[1180,580]] : [[1420,430]];
  function newEmber(){ const s=emberSrc[(Math.random()*emberSrc.length)|0];
    return {x:s[0]+Math.random()*70-35,y:s[1]+Math.random()*40,vx:-.2-Math.random()*.5,vy:-.4-Math.random()*.8,life:0,max:110+Math.random()*120,r:1+Math.random()*2}; }
  if(F.embers) for(let i=0;i<46;i++) embers.push(newEmber());
  if(F.birds) for(let i=0;i<F.birds;i++) birds.push({x:Math.random()*1600,y:120+Math.random()*120,sp:.3+Math.random()*.3,ph:Math.random()*6});
  if(F.sea) for(let i=0;i<40;i++) glints.push({x:644+Math.random()*120,y:620+Math.random()*200,a:Math.random()});
  const dustN = F.dust==='heavy'?120 : F.dust==='med'?70 : F.dust==='light'?34 : 0;
  for(let i=0;i<dustN;i++) dust.push({x:Math.random()*1600,y:500+Math.random()*380,r:.8+Math.random()*2.2,sp:.2+Math.random()*.8,a:Math.random()*6,o:.08+Math.random()*.22});
  let arrowT=0;
  function loop(){
    if(token!==troyToken) return;
    ctx.clearRect(0,0,1600,900);
    dust.forEach(d=>{ d.x-=d.sp; d.a+=0.02; d.y+=Math.sin(d.a)*0.3; if(d.x<-10){d.x=1610;d.y=500+Math.random()*380;}
      ctx.globalAlpha=d.o; ctx.fillStyle='#C9A86A'; ctx.beginPath(); ctx.arc(d.x,d.y,d.r,0,7); ctx.fill(); });
    glints.forEach(g=>{ g.a+=0.04; ctx.globalAlpha=(0.3+0.3*Math.sin(g.a))*0.6; ctx.fillStyle='#F0D49A'; ctx.fillRect(g.x,g.y,2,1); });
    embers.forEach(e=>{ e.x+=e.vx; e.y+=e.vy; e.vy+=0.002; e.life++; if(e.life>e.max){ Object.assign(e,newEmber()); }
      const k=1-e.life/e.max; ctx.globalAlpha=k*0.9; ctx.fillStyle=k>.5?'#F6C44A':'#E8742A';
      ctx.beginPath(); ctx.arc(e.x,e.y,e.r*k,0,7); ctx.fill(); });
    if(birds.length){ ctx.globalAlpha=.5; ctx.strokeStyle='#1a1016'; ctx.lineWidth=2;
      birds.forEach(b=>{ b.x-=b.sp; if(b.x<-20)b.x=1620; b.ph+=0.06; const f=Math.sin(b.ph)*4;
        ctx.beginPath(); ctx.moveTo(b.x-7,b.y+f); ctx.lineTo(b.x,b.y); ctx.lineTo(b.x+7,b.y+f); ctx.stroke(); }); }
    if(F.arrows){ arrowT++; if(arrowT>240){ arrowT=0; const n=F.arrows==='volley'?6:2;
      for(let i=0;i<n;i++) arrows.push({x:1000+Math.random()*300,y:280,vx:-6-Math.random()*2,vy:-3-Math.random()*1.5,g:0.16,life:0}); }
      ctx.strokeStyle='#0E0A08'; ctx.lineWidth=2.4; ctx.globalAlpha=.85;
      for(let i=arrows.length-1;i>=0;i--){ const a=arrows[i]; a.x+=a.vx; a.y+=a.vy; a.vy+=a.g; a.life++;
        const ang=Math.atan2(a.vy,a.vx); ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(a.x-Math.cos(ang)*16,a.y-Math.sin(ang)*16); ctx.stroke();
        if(a.y>840||a.life>200) arrows.splice(i,1); } }
    ctx.globalAlpha=1;
    requestAnimationFrame(loop);
  }
  loop();
}

let palaceToken = 0;
function palaceFX(canvas, cfg, token) {
  const ctx = canvas.getContext('2d');
  const F = (cfg && cfg.fx) || {};
  const embers=[], motes=[], arrows=[], glints=[], spray=[], birds=[];
  const emberSrc = F.embers || [];
  const emberCol = F.emberColor==='green' ? ['#CFF0A8','#7FB46A'] : ['#FBE6A0','#E8742A'];
  function newEmber(){ const s=emberSrc[(Math.random()*emberSrc.length)|0]||[800,560];
    return {x:s[0]+Math.random()*50-25,y:s[1]+Math.random()*20,vx:(Math.random()-.5)*.5,vy:-.5-Math.random()*.95,life:0,max:90+Math.random()*120,r:1+Math.random()*1.9}; }
  if(emberSrc.length) for(let i=0;i<(F.emberCount||50);i++) embers.push(newEmber());
  for(let i=0;i<(F.motes||0);i++) motes.push({x:Math.random()*1600,y:Math.random()*900,a:Math.random()*6,r:.6+Math.random()*1.4,sp:.1+Math.random()*.2});
  if(F.sea) for(let i=0;i<40;i++) glints.push({x:560+Math.random()*480,y:600+Math.random()*220,a:Math.random()});
  if(F.spray) for(let i=0;i<26;i++) spray.push({x:Math.random()*1600,y:560+Math.random()*120,vx:-.4-Math.random()*.6,vy:-.3-Math.random(),life:Math.random()*60,max:50+Math.random()*40});
  if(F.birds) for(let i=0;i<F.birds;i++) birds.push({x:Math.random()*1600,y:120+Math.random()*100,sp:.3+Math.random()*.3,ph:Math.random()*6});
  const moteCol = F.moteColor || '#E8C98A';
  let arrowT=120;
  function loop(){
    if(token!==palaceToken) return;
    ctx.clearRect(0,0,1600,900);
    glints.forEach(g=>{ g.a+=0.04; ctx.globalAlpha=(0.3+0.3*Math.sin(g.a))*0.55; ctx.fillStyle='#CFE4F0'; ctx.fillRect(g.x,g.y,2,1); });
    motes.forEach(m=>{ m.a+=0.02; m.x+=Math.sin(m.a)*0.2; m.y-=m.sp; if(m.y<0){m.y=900;m.x=Math.random()*1600;}
      ctx.globalAlpha=(0.2+0.25*Math.sin(m.a))*0.7; ctx.fillStyle=moteCol; ctx.beginPath(); ctx.arc(m.x,m.y,m.r,0,7); ctx.fill(); });
    embers.forEach(e=>{ e.x+=e.vx; e.y+=e.vy; e.vy+=0.004; e.life++; if(e.life>e.max) Object.assign(e,newEmber());
      const k=1-e.life/e.max; ctx.globalAlpha=k*0.92; ctx.fillStyle=k>.5?emberCol[0]:emberCol[1];
      ctx.beginPath(); ctx.arc(e.x,e.y,e.r*k,0,7); ctx.fill(); });
    spray.forEach(s=>{ s.x+=s.vx; s.y+=s.vy; s.vy+=0.03; s.life++; if(s.life>s.max){ s.x=Math.random()*1600; s.y=560+Math.random()*120; s.vy=-.3-Math.random(); s.life=0; }
      ctx.globalAlpha=(1-s.life/s.max)*0.5; ctx.fillStyle='#DCEAF2'; ctx.fillRect(s.x,s.y,1.6,1.6); });
    if(birds.length){ ctx.globalAlpha=.45; ctx.strokeStyle='#10131a'; ctx.lineWidth=2;
      birds.forEach(b=>{ b.x-=b.sp; if(b.x<-20)b.x=1620; b.ph+=0.06; const f=Math.sin(b.ph)*4;
        ctx.beginPath(); ctx.moveTo(b.x-7,b.y+f); ctx.lineTo(b.x,b.y); ctx.lineTo(b.x+7,b.y+f); ctx.stroke(); }); }
    if(F.arrows){ arrowT++; if(arrowT>200){ arrowT=0; arrows.push({x:200,y:560,vx:11,vy:-1.4,g:0.05,life:0}); }
      ctx.strokeStyle='#0E0A08'; ctx.lineWidth=2.4; ctx.globalAlpha=.9;
      for(let i=arrows.length-1;i>=0;i--){ const a=arrows[i]; a.x+=a.vx; a.y+=a.vy; a.vy+=a.g; a.life++;
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(a.x-18,a.y-a.vy*2); ctx.stroke();
        if(a.x>1640||a.life>200) arrows.splice(i,1); } }
    ctx.globalAlpha=1;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ───────── boot ───────── */
function boot() {
  const troyScene = document.getElementById('scene-troy');
  const palaceScene = document.getElementById('scene-palace');

  function makeRhapBar(table, keys, cls, storeKey, fallback, onPick) {
    const bar = document.createElement('div'); bar.className = 'rhap-bar '+cls;
    keys.forEach(k=>{ const b=document.createElement('button'); b.className='rhap-btn'; b.dataset.rhap=k;
      b.textContent=table[k].roman; b.title='Ραψωδία '+table[k].latin+' · '+table[k].label; bar.appendChild(b); });
    document.body.appendChild(bar);
    let cur=fallback; try{ cur=localStorage.getItem(storeKey)||fallback; }catch(e){}
    if(!keys.includes(cur)) cur=fallback;
    function pick(k){ onPick(k); bar.querySelectorAll('.rhap-btn').forEach(b=>b.classList.toggle('on', b.dataset.rhap===k));
      try{ localStorage.setItem(storeKey,k); }catch(e){} }
    bar.querySelectorAll('.rhap-btn').forEach(b=>b.addEventListener('click',()=>pick(b.dataset.rhap)));
    pick(cur);
    return bar;
  }

  const troyBar = makeRhapBar(TROY_RHAPSODIES, ['alpha','zeta','pi','chi','omega'], 'iliad', 'ia_troy_rhap', 'alpha', k=>{
    troyToken++; const { canvas, cfg } = buildTroy(troyScene, k); troyFX(canvas, cfg, troyToken);
  });
  const odyBar = makeRhapBar(ODYSSEY_RHAPSODIES, ['alpha','iota','kappa','mu','chi'], 'odyssey', 'ia_ody_rhap', 'alpha', k=>{
    palaceToken++; const { canvas, cfg } = buildPalace(palaceScene, k); palaceFX(canvas, cfg, palaceToken);
  });

  const stage = document.querySelector('.stage');
  const viewport = document.querySelector('.viewport');
  function fit(){
    const vw = (viewport && viewport.clientWidth)  || window.innerWidth;
    const vh = (viewport && viewport.clientHeight) || window.innerHeight;
    const s = Math.min(vw/1600, vh/900);
    if (s > 0 && isFinite(s)) stage.style.transform = 'scale('+s+')';
  }
  addEventListener('resize', fit);
  addEventListener('load', fit);
  requestAnimationFrame(fit);
  if (window.ResizeObserver && viewport) new ResizeObserver(fit).observe(viewport);
  fit();

  const btns = document.querySelectorAll('.sw-btn');
  function show(which){
    troyScene.classList.toggle('active', which==='troy');
    palaceScene.classList.toggle('active', which==='palace');
    btns.forEach(b=>b.classList.toggle('on', b.dataset.scene===which));
    troyBar.classList.toggle('hidden', which!=='troy');
    odyBar.classList.toggle('hidden', which!=='palace');
    try{ localStorage.setItem('ia_bg_scene', which); }catch(e){}
  }
  btns.forEach(b=>b.addEventListener('click', ()=>show(b.dataset.scene)));
  let init='troy'; try{ init=localStorage.getItem('ia_bg_scene')||'troy'; }catch(e){}
  show(init);
}
// expose builders so the playable game can mount a rhapsody scene behind it
window.BG = {
  troy(scene,key){ troyToken++; const {canvas,cfg}=buildTroy(scene,key); troyFX(canvas,cfg,troyToken); },
  palace(scene,key){ palaceToken++; const {canvas,cfg}=buildPalace(scene,key); palaceFX(canvas,cfg,palaceToken); },
};
// only auto-boot the standalone backgrounds page (it has #scene-troy)
if (document.getElementById('scene-troy')){
  if (document.readyState!=='loading') boot(); else addEventListener('DOMContentLoaded', boot);
}
})();
