/* ════════════════════════════════════════════════════════════════════
   SymposiON · profile-panel.js
   Reimagined Profile / Hero Panel — "Στήλη × Ἀγορά" hybrid.

   DROP-IN: load this <script> AFTER progression.js and hero-avatars.js.
   It OVERRIDES window.renderProfilePage() (same #profile-content target)
   and ADDS two new cosmetic systems — BANNERS and FRAMES — that the user
   unlocks in the Temple of Muses (Hero's Agora) and equips here.

   It reuses your real globals:
     _prog, HJ_TITLES, HJ_AVATARS, currentUser, siteLang,
     _hjXpFor(), getActiveTitle(), getActiveAvatar(), getAvatarMode(),
     shouldUseSymbolAvatar(), equipItem(), purchaseItem(),
     _hjConfirmPurchase(), uploadProfilePicture(), _progRef(),
     _updateAllNavbars(), showToast(), _hjEsc().

   Stats that don't exist in _prog yet (streak / accuracy / mastery /
   hours) are read from OPTIONAL fields and degrade gracefully — see
   _ppStats() and the SUBJECTS list. Nothing is faked.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  if (typeof renderProfilePage !== 'function' || typeof HJ_TITLES === 'undefined') {
    console.warn('[profile-panel] load AFTER progression.js — aborting');
    return;
  }

  /* ─────────────────────────────────────────────────────────────────
     1. NEW COSMETIC CATALOGS  (unlock in the Temple of Muses)
     levelReq>0 = free at that level · cost>0 = Drachma price · both 0 = default
  ───────────────────────────────────────────────────────────────────── */
  // FRAMES — the decorative ring drawn around the equipped seal.
  window.HJ_FRAMES = window.HJ_FRAMES || [
    { id:'plain',   gr:'Λιτό',      en:'Plain',    levelReq:0,  cost:0   },
    { id:'meander', gr:'Μαίανδρος', en:'Meander',  levelReq:3,  cost:0   },
    { id:'laurel',  gr:'Δάφνη',     en:'Laurel',   levelReq:0,  cost:80  },
    { id:'rays',    gr:'Ἀκτῖνες',   en:'Rays',     levelReq:10, cost:0   },
  ];
  // BANNERS — the background painted behind the hero card.
  // `bg` is any CSS background value; var(--pp-accent) follows the chosen accent.
  window.HJ_BANNERS = window.HJ_BANNERS || [
    { id:'plain',  gr:'Πέτρα',    en:'Stone',    levelReq:0,  cost:0,
      bg:'radial-gradient(ellipse 70% 130% at 88% 50%, color-mix(in srgb, var(--pp-accent) 13%, transparent), transparent 62%)' },
    { id:'hearth', gr:'Ἑστία',    en:'Hearth',   levelReq:4,  cost:0,
      bg:'radial-gradient(ellipse 80% 140% at 50% 0%, color-mix(in srgb, var(--pp-accent) 22%, transparent), transparent 60%)' },
    { id:'aegean', gr:'Αἰγαῖο',   en:'Aegean',   levelReq:0,  cost:120,
      bg:'linear-gradient(120deg, color-mix(in srgb, var(--pp-aegean) 26%, transparent), transparent 55%)' },
    { id:'gold',   gr:'Χρυσός',   en:'Golden',   levelReq:15, cost:0,
      bg:'radial-gradient(ellipse 60% 120% at 12% 50%, color-mix(in srgb, var(--pp-gold) 24%, transparent), transparent 60%)' },
  ];

  /* SUBJECTS for the mastery radar. ⚠ EDIT these ids/labels/colors to match
     your real curriculum. Mastery % is read from _prog.mastery[id] (0–100);
     if _prog.mastery is absent the radar shows an empty state instead. */
  var SUBJECTS = [
    { id:'greek',   gr:'Ελληνικά',   en:'Greek',       color:'#5E8B96' },
    { id:'latin',   gr:'Λατινικά',   en:'Latin',       color:'#D97B5C' },
    { id:'math',    gr:'Μαθηματικά', en:'Mathematics', color:'#C4A448' },
    { id:'history', gr:'Ιστορία',    en:'History',     color:'#6A8752' },
    { id:'myth',    gr:'Μυθολογία',  en:'Mythology',   color:'#C07A9B' },
    { id:'rhet',    gr:'Ρητορική',   en:'Rhetoric',    color:'#8A86C4' },
  ];


  /* ─────────────────────────────────────────────────────────────────
     2. HELPERS
  ───────────────────────────────────────────────────────────────────── */
  function lang() { return (typeof siteLang !== 'undefined') ? siteLang : 'gr'; }
  function t(gr, en) { return lang() === 'en' ? en : gr; }
  function esc(s) { return (typeof _hjEsc === 'function') ? _hjEsc(s) : String(s == null ? '' : s); }
  function accent() {
    return getComputedStyle(document.body).getPropertyValue('--sym-terra').trim() || '#D97B5C';
  }

  var FLAME_SVG = "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3c.6 2.5 2.2 3.3 3.3 5C16.7 10.1 17 11.5 17 13a5 5 0 0 1-10 0c0-1.6.6-3 1.7-4.2.2 1.4 1 2.2 2 2.2-.4-2.4.6-4.6 1.3-8z'/></svg>";

  // Greek-key meander tile as a repeating background-image
  function meanderTile(color, h) {
    h = h || 16; var u = 24, ins = 3, mid = h / 2;
    var d = 'M' + ins + ' ' + (h - ins) + ' V' + ins + ' H' + (u - 8) + ' V' + (mid + 3) + ' H10 V' + (mid - 2);
    var svg = "<svg xmlns='http://www.w3.org/2000/svg' width='" + u + "' height='" + h + "'><path d='" + d + "' fill='none' stroke='" + color + "' stroke-width='1.3'/></svg>";
    return "url(\"data:image/svg+xml," + encodeURIComponent(svg) + "\")";
  }

  // SVG progress ring → string. centerHTML overlaid via wrapper in caller.
  function ringSVG(pct, size, stroke, color, track) {
    var r = (size - stroke) / 2, c = 2 * Math.PI * r;
    var off = c * (1 - Math.max(0, Math.min(1, (pct || 0) / 100)));
    track = track || 'rgba(240,235,224,0.10)';
    return "<svg width='" + size + "' height='" + size + "' style='transform:rotate(-90deg);display:block'>" +
      "<circle cx='" + size/2 + "' cy='" + size/2 + "' r='" + r + "' fill='none' stroke='" + track + "' stroke-width='" + stroke + "'/>" +
      "<circle cx='" + size/2 + "' cy='" + size/2 + "' r='" + r + "' fill='none' stroke='" + color + "' stroke-width='" + stroke +
      "' stroke-linecap='round' stroke-dasharray='" + c + "' stroke-dashoffset='" + off + "' style='filter:drop-shadow(0 0 6px " + color + "88)'/></svg>";
  }

  // Donut with centered percentage
  function donutSVG(value, size, stroke, color) {
    var r = (size - stroke) / 2, c = 2 * Math.PI * r, off = c * (1 - (value || 0) / 100);
    return "<svg width='" + size + "' height='" + size + "' viewBox='0 0 " + size + " " + size + "'>" +
      "<circle cx='" + size/2 + "' cy='" + size/2 + "' r='" + r + "' fill='none' stroke='rgba(240,235,224,0.10)' stroke-width='" + stroke + "'/>" +
      "<circle cx='" + size/2 + "' cy='" + size/2 + "' r='" + r + "' fill='none' stroke='" + color + "' stroke-width='" + stroke +
      "' stroke-linecap='round' stroke-dasharray='" + c + "' stroke-dashoffset='" + off + "' transform='rotate(-90 " + size/2 + " " + size/2 + ")'/>" +
      "<text x='50%' y='49%' text-anchor='middle' dominant-baseline='middle' font-family=\"var(--sym-font-serif,serif)\" font-weight='600' font-size='" + (size*0.3) + "' fill='var(--pp-cream)'>" + (value||0) + "</text>" +
      "<text x='50%' y='68%' text-anchor='middle' font-family=\"var(--sym-font-mono,monospace)\" font-size='8.5' letter-spacing='1.4' fill='var(--pp-stone)'>%</text></svg>";
  }

  // Subject-mastery radar
  function radarSVG(subjects, size, color) {
    var cx = size/2, cy = size/2, R = size/2 - 46, n = subjects.length;
    function ang(i){ return Math.PI*2*i/n - Math.PI/2; }
    function pt(i, rad){ return [cx + Math.cos(ang(i))*rad, cy + Math.sin(ang(i))*rad]; }
    var s = "<svg width='" + size + "' height='" + size + "' style='overflow:visible'>";
    [0.25,0.5,0.75,1].forEach(function(rr){
      s += "<polygon points='" + subjects.map(function(_,i){return pt(i,R*rr).join(',');}).join(' ') + "' fill='none' stroke='color-mix(in srgb,var(--pp-gold) 14%,transparent)' stroke-width='1'/>";
    });
    subjects.forEach(function(_,i){ var p=pt(i,R); s += "<line x1='"+cx+"' y1='"+cy+"' x2='"+p[0]+"' y2='"+p[1]+"' stroke='color-mix(in srgb,var(--pp-gold) 12%,transparent)' stroke-width='1'/>"; });
    var dp = subjects.map(function(sb,i){ return pt(i, R*(sb.value||0)/100); });
    s += "<polygon points='" + dp.map(function(p){return p.join(',');}).join(' ') + "' fill='" + color + "33' stroke='" + color + "' stroke-width='1.6' style='filter:drop-shadow(0 0 8px " + color + "55)'/>";
    dp.forEach(function(p){ s += "<circle cx='"+p[0]+"' cy='"+p[1]+"' r='3' fill='" + color + "'/>"; });
    subjects.forEach(function(sb,i){
      var p = pt(i, R+22), a = ang(i);
      var anchor = Math.abs(Math.cos(a))<0.3 ? 'middle' : (Math.cos(a)>0?'start':'end');
      s += "<text x='"+p[0]+"' y='"+p[1]+"' text-anchor='"+anchor+"' dominant-baseline='middle' font-family=\"var(--sym-font-serif,serif)\" font-size='13' fill='var(--pp-cream)'>" + esc(t(sb.gr,sb.en)) +
           "<tspan font-family=\"var(--sym-font-mono,monospace)\" font-size='8' fill='var(--pp-stone)' dx='4'>" + (sb.value||0) + "</tspan></text>";
    });
    return s + "</svg>";
  }

  // Decorative frame ring (string) drawn around the seal
  function frameSVG(frameId, size, color) {
    if (!frameId || frameId === 'plain') return '';
    var c = size/2, open = "<svg width='" + size + "' height='" + size + "' style='position:absolute;inset:0;pointer-events:none'>", s = '';
    if (frameId === 'meander') {
      s += "<circle cx='"+c+"' cy='"+c+"' r='"+(size/2-2)+"' fill='none' stroke='"+color+"' stroke-width='1' opacity='.5'/>";
      s += "<circle cx='"+c+"' cy='"+c+"' r='"+(size/2-8)+"' fill='none' stroke='"+color+"' stroke-width='3' stroke-dasharray='2 6' opacity='.7'/>";
      s += "<circle cx='"+c+"' cy='"+c+"' r='"+(size/2-14)+"' fill='none' stroke='"+color+"' stroke-width='.7' opacity='.3'/>";
    } else if (frameId === 'rays') {
      for (var i=0;i<36;i++){ var a=Math.PI*2*i/36, r1=size/2-3, r2=size/2-(i%2?9:6);
        s += "<line x1='"+(c+Math.cos(a)*r2)+"' y1='"+(c+Math.sin(a)*r2)+"' x2='"+(c+Math.cos(a)*r1)+"' y2='"+(c+Math.sin(a)*r1)+"' stroke='"+color+"' stroke-width='1' opacity='"+(i%2?.4:.75)+"'/>"; }
    } else if (frameId === 'laurel') {
      for (var side=-1; side<=1; side+=2){ for (var j=0;j<7;j++){
        var aa = Math.PI*0.62*(j/6)+Math.PI*0.19;
        var x = c + side*Math.cos(aa)*(size/2-6), y = c - Math.sin(aa)*(size/2-6);
        s += "<ellipse cx='"+x.toFixed(1)+"' cy='"+y.toFixed(1)+"' rx='6' ry='3' transform='rotate("+(side*(20+j*8))+" "+x.toFixed(1)+" "+y.toFixed(1)+")' fill='"+color+"' opacity='.8'/>";
      } }
    }
    return open + s + "</svg>";
  }

  function bannerById(id){ return HJ_BANNERS.find(function(b){return b.id===id;}) || HJ_BANNERS[0]; }

  /* ─────────────────────────────────────────────────────────────────
     3. STATS RESOLVER — real data with safe fallbacks (no fake numbers)
  ───────────────────────────────────────────────────────────────────── */
  function _ppStats() {
    var p = _prog || {}, st = p.stats || {};
    var mastery = p.mastery || null;
    var subjects = SUBJECTS.map(function(s){ return Object.assign({}, s, { value: mastery ? (mastery[s.id]||0) : 0 }); });
    return {
      streak:   typeof p.streak === 'number' ? p.streak : null,
      best:     typeof p.streakBest === 'number' ? p.streakBest : null,
      week:     Array.isArray(p.streakWeek) && p.streakWeek.length === 7 ? p.streakWeek : null,
      accuracy: typeof st.accuracy === 'number' ? st.accuracy : null,
      lessons:  typeof st.lessons === 'number' ? st.lessons : null,
      games:    typeof st.games === 'number' ? st.games : null,
      hours:    typeof st.minutes === 'number' ? Math.round(st.minutes/60) : (typeof st.hours==='number'?st.hours:null),
      mastery:  !!mastery,
      subjects: subjects,
    };
  }

  /* ─────────────────────────────────────────────────────────────────
     4. EQUIP & PURCHASE  (universal — handles title/avatar/banner/frame)
  ───────────────────────────────────────────────────────────────────── */
  var FIELD = {
    title:  { active:'activeTitle',  owned:'unlockedTitles',  catalog:function(){return HJ_TITLES;} },
    avatar: { active:'activeAvatar', owned:'unlockedAvatars', catalog:function(){return HJ_AVATARS;} },
    banner: { active:'activeBanner', owned:'unlockedBanners', catalog:function(){return HJ_BANNERS;} },
    frame:  { active:'activeFrame',  owned:'unlockedFrames',  catalog:function(){return HJ_FRAMES;} },
  };

  async function ppEquip(type, id) {
    if (!_prog) return;
    // title & avatar already have battle-tested equip logic — reuse it
    if (type === 'title' || type === 'avatar') {
      if (typeof equipItem === 'function') { await equipItem(type, id); renderProfilePage(); }
      return;
    }
    var f = FIELD[type]; if (!f) return;
    var owned = _prog[f.owned] || [];
    if (!owned.includes(id)) return;
    _prog[f.active] = id;
    try {
      if (typeof currentUser !== 'undefined' && currentUser && typeof _progRef === 'function') {
        var u = {}; u[f.active] = id; await _progRef(currentUser.uid).update(u);
      }
      if (typeof _updateAllNavbars === 'function') _updateAllNavbars();
    } catch (e) { console.warn('[profile-panel] equip failed', e); }
    renderProfilePage();
  }

  async function _ppPurchase(type, id) {
    if (type === 'title' || type === 'avatar') {
      return (typeof purchaseItem === 'function') ? purchaseItem(type, id) : { ok:false };
    }
    var f = FIELD[type]; if (!f || !_prog) return { ok:false, reason:'not-ready' };
    var item = f.catalog().find(function(x){return x.id===id;});
    if (!item) return { ok:false, reason:'not-found' };
    if (!_prog[f.owned]) _prog[f.owned] = [];
    if (_prog[f.owned].includes(id)) return { ok:false, reason:'already-owned' };
    if ((_prog.drachmas||0) < item.cost) return { ok:false, reason:'insufficient-drachmas' };
    _prog.drachmas -= item.cost; _prog[f.owned].push(id);
    try {
      if (currentUser && typeof _progRef === 'function') {
        var u = { drachmas:_prog.drachmas }; u[f.owned] = _prog[f.owned];
        await _progRef(currentUser.uid).update(u);
      }
    } catch (e) { console.warn('[profile-panel] purchase failed', e); return { ok:false, reason:'firestore-error' }; }
    return { ok:true };
  }

  function _ppConfirmPurchase(type, id) {
    // title & avatar → reuse your existing modal
    if ((type === 'title' || type === 'avatar') && typeof _hjConfirmPurchase === 'function') {
      return _hjConfirmPurchase(type, id);
    }
    var item = FIELD[type].catalog().find(function(x){return x.id===id;});
    if (!item) return;
    var msg = t('Αγορά «' + item.gr + '» για ⌾ ' + item.cost + ';', 'Buy "' + item.en + '" for ⌾ ' + item.cost + '?');
    if (!window.confirm(msg)) return;
    _ppPurchase(type, id).then(function(res){
      if (res.ok) {
        if (typeof showToast === 'function') showToast('Απέκτησες: ' + item.gr + '!', 'Acquired: ' + item.en + '!');
        ppEquip(type, id);
      } else if (res.reason === 'insufficient-drachmas' && typeof showToast === 'function') {
        showToast('Δεν έχεις αρκετές δραχμές.', 'Not enough Drachmas.');
      }
    });
  }

  /* ─────────────────────────────────────────────────────────────────
     5. ITEM CARDS / GRIDS  (mirrors your _hjRenderTitles state machine)
  ───────────────────────────────────────────────────────────────────── */
  function itemState(type, item, owned, active) {
    var lvl = _prog.level || 0, lvlLbl = t('Επ.', 'Lv.');
    if (active === item.id) return { cls:'is-active', state:t('Ενεργό','Active'), onclick:'' };
    if (owned.includes(item.id))
      return { cls:'', state:t('Εξόπλισε','Equip'), onclick:"ppEquip('"+type+"','"+item.id+"')" };
    if (item.levelReq > 0 && lvl < item.levelReq)
      return { cls:'is-locked', state:lvlLbl+' '+item.levelReq, onclick:'' };
    if (item.cost > 0 && (_prog.drachmas||0) >= item.cost)
      return { cls:'is-buyable', state:'⌾ '+item.cost, onclick:"_ppConfirmPurchase('"+type+"','"+item.id+"')" };
    if (item.cost > 0)
      return { cls:'is-locked', state:'⌾ '+item.cost, onclick:'' };
    return { cls:'', state:t('Δωρεάν','Free'), onclick:"ppEquip('"+type+"','"+item.id+"')" };
  }

  function sealCard(a) {
    var owned = _prog.unlockedAvatars || [];
    var symbolMode = (typeof getAvatarMode === 'function') ? getAvatarMode() === 'symbol' : true;
    var s = itemState('avatar', a, owned, symbolMode ? _prog.activeAvatar : null);
    return "<button class='pp-item "+s.cls+"' "+(s.onclick?"onclick=\""+s.onclick+"\"":"disabled")+">" +
      "<span class='pp-item__seal'>"+a.svg+"</span>" +
      "<span class='pp-item__name pp-ser'>"+esc(t(a.gr,a.en))+"</span>" +
      "<span class='pp-item__sub pp-mono'>"+esc(t(a.en,a.gr))+"</span>" +
      "<span class='pp-item__state pp-mono'>"+s.state+"</span></button>";
  }
  function titleCard(ti) {
    var owned = _prog.unlockedTitles || [], s = itemState('title', ti, owned, _prog.activeTitle);
    return "<button class='pp-item pp-item--title "+s.cls+"' "+(s.onclick?"onclick=\""+s.onclick+"\"":"disabled")+">" +
      "<span class='pp-item__name pp-disp'>"+esc(t(ti.gr,ti.en))+"</span>" +
      "<span class='pp-item__sub pp-mono'>"+esc(t(ti.en,ti.gr))+"</span>" +
      "<span class='pp-item__state pp-mono'>"+s.state+"</span></button>";
  }
  function frameCard(fr) {
    var owned = _prog.unlockedFrames || [], s = itemState('frame', fr, owned, _prog.activeFrame);
    return "<button class='pp-item "+s.cls+"' "+(s.onclick?"onclick=\""+s.onclick+"\"":"disabled")+">" +
      "<span class='pp-item__seal' style='position:relative'>" + frameSVG(fr.id, 50, 'var(--pp-gold)') +
        "<span style='width:24px;height:24px;border-radius:50%;background:color-mix(in srgb,var(--pp-accent) 30%,transparent)'></span></span>" +
      "<span class='pp-item__name pp-ser'>"+esc(t(fr.gr,fr.en))+"</span>" +
      "<span class='pp-item__state pp-mono'>"+s.state+"</span></button>";
  }
  function bannerCard(bn) {
    var owned = _prog.unlockedBanners || [], s = itemState('banner', bn, owned, _prog.activeBanner);
    return "<button class='pp-item pp-item--banner "+s.cls+"' "+(s.onclick?"onclick=\""+s.onclick+"\"":"disabled")+">" +
      "<span class='pp-banner-prev' style='background:"+bn.bg+"'></span>" +
      "<span class='pp-banner-meta'><span class='nm pp-ser'>"+esc(t(bn.gr,bn.en))+"</span><span class='en pp-mono'>"+s.state+"</span></span></button>";
  }

  /* ─────────────────────────────────────────────────────────────────
     6. TAB SWITCH (Temple of Muses)
  ───────────────────────────────────────────────────────────────────── */
  window._ppTab = function (group) {
    document.querySelectorAll('.pp-tab[data-grp]').forEach(function(b){ b.classList.toggle('active', b.dataset.grp===group); });
    document.querySelectorAll('.pp-panel-grid[data-grp]').forEach(function(g){ g.classList.toggle('active', g.dataset.grp===group); });
  };

  /* ─────────────────────────────────────────────────────────────────
     7. DERIVED BADGES — real, computed from progression (not faked)
  ───────────────────────────────────────────────────────────────────── */
  function badges() {
    var p = _prog, st = _ppStats();
    var defs = [
      { gr:'Πρῶτα Βήματα', en:'First Steps', earned:(p.level||0)>=1,
        svg:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M7 5h11v12a2 2 0 0 1-2 2H7'/><path d='M7 5a2 2 0 0 0 0 4'/><path d='M9 9h6M9 13h5'/></svg>" },
      { gr:'Ἥρωας', en:'Hero', earned:(p.level||0)>=12,
        svg:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M12 21V8'/><path d='M12 13c-3.4 0-5.5-2.2-5.5-5.5C9.9 7.5 12 9.7 12 13z'/><path d='M12 16c3.4 0 5.5-2.2 5.5-5.5C14.1 10.5 12 12.7 12 16z'/></svg>" },
      { gr:'Συλλέκτης', en:'Collector', earned:(p.unlockedAvatars||[]).length>=6,
        svg:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M9 3h6'/><path d='M10 3c0 2-3 2-3 5 0 4 2 6 5 6s5-2 5-6c0-3-3-3-3-5'/><path d='M9 21h6l-1-3h-4z'/></svg>" },
      { gr:'Εὔπορος', en:'Wealthy', earned:(p.drachmas||0)>=500,
        svg:"<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.4'><circle cx='12' cy='12' r='8.5'/><path d='M9 8.5h3.5a2.5 2.5 0 0 1 0 5H9m0 0v3' stroke-linecap='round'/></svg>" },
      { gr:'Σερί', en:'On Fire', earned:(st.streak||0)>=7, svg:FLAME_SVG },
    ];
    return defs.map(function(b){
      return "<div class='pp-badge"+(b.earned?' earned':'')+"' title='"+esc(b.gr+' · '+b.en)+"'>"+b.svg+"</div>";
    }).join('');
  }

  /* ─────────────────────────────────────────────────────────────────
     8. MIGRATION — make sure cosmetic fields exist on _prog
  ───────────────────────────────────────────────────────────────────── */
  function ensureCosmetics() {
    if (!_prog) return;
    var patch = {};
    if (!Array.isArray(_prog.unlockedBanners)) { _prog.unlockedBanners = ['plain']; patch.unlockedBanners = _prog.unlockedBanners; }
    if (!_prog.activeBanner) { _prog.activeBanner = 'plain'; patch.activeBanner = 'plain'; }
    if (!Array.isArray(_prog.unlockedFrames)) { _prog.unlockedFrames = ['plain']; patch.unlockedFrames = _prog.unlockedFrames; }
    if (!_prog.activeFrame) { _prog.activeFrame = 'plain'; patch.activeFrame = 'plain'; }
    // auto-unlock level-gated cosmetics
    HJ_FRAMES.forEach(function(f){ if (f.levelReq>0 && (_prog.level||0)>=f.levelReq && !_prog.unlockedFrames.includes(f.id)) { _prog.unlockedFrames.push(f.id); patch.unlockedFrames=_prog.unlockedFrames; } });
    HJ_BANNERS.forEach(function(b){ if (b.levelReq>0 && (_prog.level||0)>=b.levelReq && !_prog.unlockedBanners.includes(b.id)) { _prog.unlockedBanners.push(b.id); patch.unlockedBanners=_prog.unlockedBanners; } });
    if (Object.keys(patch).length && currentUser && typeof _progRef === 'function') {
      _progRef(currentUser.uid).update(patch).catch(function(){});
    }
  }

  /* ─────────────────────────────────────────────────────────────────
     9. THE RENDERER  (overrides window.renderProfilePage)
  ───────────────────────────────────────────────────────────────────── */
  window.renderProfilePage = function () {
    var container = document.getElementById('profile-content');
    if (!container) return;
    if (typeof currentUser === 'undefined' || !currentUser || !_prog) {
      container.innerHTML = "<div class='hj-loading'><div class='hj-loading-ring'></div></div>";
      if (typeof currentUser !== 'undefined' && currentUser && !_prog && typeof initProgression === 'function')
        initProgression(currentUser.uid).then(window.renderProfilePage);
      return;
    }
    ensureCosmetics();

    var p = _prog, lvl = p.level;
    var ac = accent();
    var xpThis = _hjXpFor(lvl), xpNext = _hjXpFor(lvl+1);
    var pct = (p.xp<=0 && lvl===0) ? 0 : Math.min(100, Math.round((p.xp - xpThis) / (xpNext - xpThis) * 100));
    var name = currentUser.displayName || (currentUser.email ? currentUser.email.split('@')[0] : t('Ήρωας','Hero'));
    var titleObj = getActiveTitle(), avatarObj = getActiveAvatar();
    var frameId = p.activeFrame || 'plain', banner = bannerById(p.activeBanner);
    var st = _ppStats(), gold = 'var(--pp-gold)';

    var showPhoto = currentUser.photoURL && !shouldUseSymbolAvatar();
    var sealInner = showPhoto
      ? "<img class='pp-seal-img' src='"+esc(currentUser.photoURL)+"' alt='avatar'/>"
      : "<span class='pp-seal' id='profile-avatar-img'>"+(avatarObj?avatarObj.svg:'')+"</span>";
    var modeToggle = currentUser.photoURL
      ? "<button class='pp-mode-toggle' onclick='"+(showPhoto?"_ppUseSymbol()":"_ppUsePhoto()")+"'>" +
          (showPhoto ? t("⬡ Χρήση Συμβόλου","⬡ Use Symbol") : t("📷 Χρήση Φωτογραφίας","📷 Use Photo")) +
        "</button>"
      : "";

    /* ── HERO ── */
    var hero =
      "<div class='pp-hero'>" +
        "<div class='pp-hero__banner' style='background:"+banner.bg+"'></div>" +
        "<div class='pp-seal-wrap' onclick=\"document.getElementById('profile-pic-input').click()\">" +
          "<span class='pp-seal-ring'>"+ringSVG(pct, 150, 6, ac)+"</span>" +
          "<span class='pp-seal-frame'>"+frameSVG(frameId, 142, gold)+"</span>" +
          sealInner +
          "<span class='pp-seal-overlay'><span>📷</span><span>"+t('Αλλαγή','Change')+"</span></span>" +
          "<span class='pp-lvl-badge pp-mono'>"+t('ΕΠΙΠΕΔΟ','LEVEL')+" <b>"+lvl+"</b></span>" +
        "</div>" +
        modeToggle +
        "<input type='file' id='profile-pic-input' accept='.png,.webp,image/png,image/webp' style='display:none' onchange='uploadProfilePicture(this)'/>" +
        "<div class='pp-hero__info'>" +
          (titleObj ? "<div class='pp-title-pill pp-disp'>"+esc(t(titleObj.gr,titleObj.en))+"<span class='en pp-mono'>"+esc(t(titleObj.en,titleObj.gr))+"</span></div>" : "") +
          "<h1 class='pp-name pp-ser'>"+esc(name)+"</h1>" +
          "<div class='pp-handle pp-mono'>"+esc(currentUser.email||'')+"</div>" +
          "<div class='pp-xp-row'>" +
            "<div class='pp-xp-bar'><div class='pp-xp-fill'></div></div>" +
            "<div class='pp-xp-label pp-mono'>"+p.xp.toLocaleString('el-GR')+" / "+xpNext.toLocaleString('el-GR')+" XP</div>" +
          "</div>" +
        "</div>" +
        "<div class='pp-drachma'>" +
          "<div class='pp-drachma__icon'>⌾</div>" +
          "<div class='pp-drachma__amt pp-ser'>"+p.drachmas.toLocaleString('el-GR')+"</div>" +
          "<div class='pp-drachma__lbl pp-mono'>"+t('Δραχμές','Drachmas')+"</div>" +
        "</div>" +
      "</div>";

    /* ── INFOGRAPHIC BAND ── */
    var radarCard = st.mastery
      ? "<div class='pp-center'>"+radarSVG(st.subjects, 282, ac)+"</div>"
      : "<div class='pp-empty pp-mono'>"+t('Παῖξε ασκήσεις για να χτίσεις την κυριαρχία σου','Play to build your mastery')+"</div>";

    var donutCard = st.accuracy!=null
      ? "<div style='display:flex;align-items:center;gap:18px'>"+donutSVG(st.accuracy,108,8,ac) +
          "<div class='pp-mono' style='font-size:9px;letter-spacing:1px;color:var(--pp-stone);line-height:1.7'>" +
            ((st.lessons!=null&&st.games!=null)?("<span style='color:var(--pp-cream);font-size:14px'>"+(st.lessons+st.games)+"</span> "+t('ασκήσεις','exercises')+"<br/>"):"") +
            (st.streak!=null?("<span style='color:var(--pp-accent);font-size:14px'>"+st.streak+"</span> "+t('ημέρες σερί','day streak')):"") +
          "</div></div>"
      : "<div class='pp-empty pp-mono'>"+t('Χωρὶς δεδομένα ακρίβειας ἀκόμη','No accuracy data yet')+"</div>";

    function counter(v, suf, gr, en, col){ return v==null ? '' :
      "<div class='pp-counter'><div class='v pp-ser' style='color:"+col+"'>"+v+(suf?"<small>"+suf+"</small>":"")+"</div><div class='gr'>"+gr+"</div><div class='en pp-mono'>"+en+"</div></div>"; }
    var counters =
      counter(st.lessons,'',t('Μαθήματα','Lessons'),'Lessons','var(--pp-cream)') +
      counter(st.games,'',t('Παιχνίδια','Games'),'Games','var(--pp-cream)') +
      counter(st.hours,'ω',t('Ώρες','Hours'),'Hours','var(--pp-aegean)') +
      counter(p.drachmas,'',t('Δραχμές','Drachmas'),'Drachmas',gold);
    if (!counters.trim()) counters = "<div class='pp-empty pp-mono' style='grid-column:1/-1'>"+t('Στατιστικά σύντομα','Stats coming soon')+"</div>";

    var band =
      "<div class='pp-band'>" +
        "<div class='pp-card'><div class='pp-card__label'>"+t('Κυριαρχία','Subject Mastery')+"</div>"+radarCard+"</div>" +
        "<div class='pp-col'>" +
          "<div class='pp-card'><div class='pp-card__label'>"+t('Ἀκρίβεια','Accuracy')+"</div>"+donutCard+"</div>" +
          "<div class='pp-card'><div class='pp-card__label'>"+t('Πρόοδος','Progress')+"</div><div class='pp-counters'>"+counters+"</div></div>" +
        "</div>" +
      "</div>";

    /* ── STREAK STRIP (only when data exists) ── */
    var streak = '';
    if (st.streak != null) {
      var dl = lang()==='en' ? ['M','T','W','T','F','S','S'] : ['Δ','Τ','Τ','Π','Π','Σ','Κ'];
      var week = st.week || [false,false,false,false,false,false,true];
      var cells = week.map(function(on,i){ return "<div class='pp-streak__day'><span class='pp-streak__cell"+(on?' on':'')+(i===6?' today':'')+"'>"+(on?'●':'·')+"</span><span class='pp-streak__dl'>"+dl[i]+"</span></div>"; }).join('');
      streak = "<div class='pp-streak'>" +
        "<span class='pp-streak__flame'>"+FLAME_SVG+"</span>" +
        "<div class='pp-streak__count pp-ser'>"+st.streak+"<small>"+t('Ημέρες σερί','Day Streak')+"</small></div>" +
        "<div class='pp-streak__days'>"+cells+"</div>" +
        (st.best!=null?"<div class='pp-streak__best'><div class='v pp-ser'>"+st.best+"</div><div class='l pp-mono'>"+t('Ρεκόρ','Best')+"</div></div>":"") +
      "</div>";
    }

    /* ── TEMPLE OF MUSES (Agora) — equip what you've unlocked ── */
    function panel(grp, html, on){ return "<div class='pp-panel-grid pp-grid"+(grp==='titles'?' pp-grid--titles':grp==='banners'?' pp-grid--banners':'')+(on?' active':'')+"' data-grp='"+grp+"'>"+html+"</div>"; }
    var symbolsHtml = HJ_AVATARS.map(sealCard).join('');
    var titlesHtml  = HJ_TITLES.map(titleCard).join('');
    var bannersHtml = HJ_BANNERS.map(bannerCard).join('');
    var framesHtml  = HJ_FRAMES.map(frameCard).join('');

    var temple =
      "<div class='pp-section'>" +
        "<div class='pp-section__head'>" +
          "<div class='pp-eyebrow pp-mono'>"+t('Ναὸς τῶν Μουσῶν','Temple of the Muses')+"</div>" +
          "<div class='pp-section__sub pp-mono'>"+t('Ξεκλείδωσε & διάλεξε','Unlock & equip')+"</div>" +
        "</div>" +
        "<div class='pp-tabs'>" +
          "<button class='pp-tab active pp-disp' data-grp='symbols' onclick=\"_ppTab('symbols')\">"+t('Σύμβολα','Symbols')+"<span class='en'>ICONS</span></button>" +
          "<button class='pp-tab pp-disp' data-grp='titles' onclick=\"_ppTab('titles')\">"+t('Τίτλοι','Titles')+"</button>" +
          "<button class='pp-tab pp-disp' data-grp='banners' onclick=\"_ppTab('banners')\">"+t('Λάβαρα','Banners')+"</button>" +
          "<button class='pp-tab pp-disp' data-grp='frames' onclick=\"_ppTab('frames')\">"+t('Πλαίσια','Frames')+"</button>" +
        "</div>" +
        panel('symbols', symbolsHtml, true) +
        panel('titles',  titlesHtml,  false) +
        panel('banners', bannersHtml, false) +
        panel('frames',  framesHtml,  false) +
      "</div>";

    /* ── FOOTER: badges only ── */
    var footer =
      "<div class='pp-footer'>" +
        "<div class='pp-eyebrow pp-mono' style='margin-bottom:12px;color:var(--pp-stone)'>"+t('Παράσημα','Badges')+"</div>" +
        "<div class='pp-badges'>"+badges()+"</div>" +
      "</div>";

    container.innerHTML =
      "<div class='pp-root'>" +
        hero +
        "<div class='pp-meander' style='background-image:"+meanderTile('var(--pp-gold)',16)+"'></div>" +
        band + streak +
        "<div id='hj-billing-section' class='hj-billing-loading-wrap' style='margin-top:24px'></div>" +
        temple + footer +
      "</div>";

    // animate XP bar
    requestAnimationFrame(function(){ requestAnimationFrame(function(){
      var fill = container.querySelector('.pp-xp-fill'); if (fill) fill.style.width = pct + '%';
    }); });

    // keep your existing billing/subscription section
    if (currentUser && typeof _hjLoadBillingSection === 'function') _hjLoadBillingSection();
  };

  window._ppUsePhoto = async function () {
    if (!_prog || !currentUser || !currentUser.photoURL) return;
    _prog.avatarMode = 'photo';
    try { if (typeof _progRef === 'function') await _progRef(currentUser.uid).update({ avatarMode: 'photo' }); } catch (e) {}
    renderProfilePage();
  };

  window._ppUseSymbol = async function () {
    if (!_prog) return;
    _prog.avatarMode = 'symbol';
    try { if (typeof _progRef === 'function') await _progRef(currentUser.uid).update({ avatarMode: 'symbol' }); } catch (e) {}
    renderProfilePage();
  };

  // expose for inline onclick handlers
  window.ppEquip = ppEquip;
  window._ppConfirmPurchase = _ppConfirmPurchase;

  // re-render if the profile page is currently open
  if (document.getElementById('page-profile') && document.getElementById('page-profile').classList.contains('active')) {
    try { renderProfilePage(); } catch (e) {}
  }
  console.log('[profile-panel] reimagined Profile / Hero Panel installed');
})();
