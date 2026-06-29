/* ════════════════════════════════════════════════════════════════════
   SymposiON — Home Revamp · INNER SCREENS (Synthesis language)
   Every navigable panel, enriched per teammate review. Uses synPage(),
   SymPreview (game mockups), SymStore (persistence), shared helpers.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const SITE = '#C18A2C';
  const go = (s, p) => window.symGo(s, p);
  const P  = window.synPage;
  const SY = window.SYM;
  const ST = () => window.STATE;
  const isAdmin = () => !!(window.STATE && window.STATE.adminEdit);
  // Resolve a game's admin-overridden display name (Game-Tags rename); falls
  // back to the game's own {gr,en} when there is no override.
  const gName = (g) => (window.SymTags && SymTags.displayName) ? SymTags.displayName(g) : g;

  /* ── shared bits ───────────────────────────────────────────────── */
  function glyph(name, cls){ return el('span', { class:(cls||'sc-gl'), 'data-illu':name }); }

  // ── PvP Arena (Ο Ἀγών) launcher ──
  // The Arena is a self-contained standalone page (games/pvp-arena/) — its own
  // topbar/body, localStorage profiles, NO Firebase/realtime. It reads the
  // shared question bank window.SYM_QUESTIONS; since it loads as a separate
  // document we hand the live library across via localStorage (the Arena's
  // prelude hydrates window.SYM_QUESTIONS from it, else falls back to its
  // bundled js/questions.js sample). Opened in a new tab so the SPA stays put.
  function launchPvPArena(){
    try {
      if (Array.isArray(window.SYM_QUESTIONS) && window.SYM_QUESTIONS.length) {
        localStorage.setItem('SYM_QUESTIONS', JSON.stringify(window.SYM_QUESTIONS));
      }
    } catch (_) {}
    var base = (window.APP_BASE || (new URL('./', location.href).href));
    window.open(base + 'games/pvp-arena/index.html', '_blank', 'noopener');
  }
  window.launchPvPArena = launchPvPArena;

  // ── PvP content chooser ──
  // Before opening the standalone Arena, let the host pick which material(s)
  // the duel questions are drawn from (instead of dumping the whole bank). The
  // picked mix is stored as SYM_QUESTIONS_SELECTION; the Arena prelude prefers
  // it over the full SYM_QUESTIONS. "All content" clears the key for full-bank.
  function _pvpMatLabel(m){ return (m && m.label && typeof m.label === 'object') ? L(m.label) : ((m && (m.label || m.id)) || ''); }
  function _pvpCombineAndGo(sel, btn, close){
    var ids = Object.keys(sel).filter(function(k){ return sel[k]; });
    if (!ids.length) return;
    if (btn) { btn.disabled = true; }
    var provs = window.GP_LEVEL_PROVIDERS || {};
    var jobs = ids.map(function(id){
      var lv = (provs[id] && provs[id].levels) || [];
      var levelIds = lv.map(function(x){ return x.id; });
      return (window.SymMix && SymMix.bank) ? SymMix.bank(id, levelIds) : Promise.resolve([]);
    });
    Promise.all(jobs).then(function(arrs){
      var combined = [];
      arrs.forEach(function(a){ if (Array.isArray(a)) combined = combined.concat(a); });
      combined = combined.filter(function(q){ return q && q.a && q.a.length >= 2; });
      try {
        if (combined.length) localStorage.setItem('SYM_QUESTIONS_SELECTION', JSON.stringify(combined));
        else localStorage.removeItem('SYM_QUESTIONS_SELECTION');
      } catch (_) {}
      if (close) close();
      launchPvPArena();
    }).catch(function(){
      try { localStorage.removeItem('SYM_QUESTIONS_SELECTION'); } catch (_) {}
      if (close) close();
      launchPvPArena();
    });
  }
  function openPvPContentChooser(){
    var mats = (window.SymMix && typeof SymMix.materials === 'function') ? SymMix.materials() : [];
    // No mixer / no materials → just open with the full bank.
    if (!mats.length) { try { localStorage.removeItem('SYM_QUESTIONS_SELECTION'); } catch (_) {} return launchPvPArena(); }
    var prev = document.getElementById('pvp-content-chooser'); if (prev) prev.remove();
    var sel = {};
    var ov = el('div',{ id:'pvp-content-chooser', class:'game-overlay active',
      style:'position:fixed;inset:0;z-index:9000;display:flex;align-items:center;justify-content:center;background:rgba(8,6,4,.72);backdrop-filter:blur(4px);' });
    if (window.symApplyThemeClass) { try { window.symApplyThemeClass(ov); } catch (_) {} }
    var card = el('div',{ class:'has-accent',
      style:'--ca:'+SITE+';width:min(520px,92vw);max-height:88vh;overflow:auto;background:var(--sym-parch,#1a1410);color:var(--sym-ink,#eadfce);border:1px solid color-mix(in srgb,var(--ca) 40%,transparent);border-radius:16px;padding:22px;box-shadow:0 24px 60px rgba(0,0,0,.5);' });
    var esc = function(e){ if (e.key === 'Escape') close(); };
    var close = function(){ try { ov.remove(); } catch (_) {} document.removeEventListener('keydown', esc); };
    document.addEventListener('keydown', esc);
    ov.addEventListener('click', function(e){ if (e.target === ov) close(); });
    card.appendChild(el('div',{ style:'font:800 18px/1.2 Inter,sans-serif;margin-bottom:4px' }, L({ gr:'Διάλεξε περιεχόμενο για τον Ἀγῶνα', en:'Choose content for the duel' })));
    card.appendChild(el('div',{ style:'opacity:.7;font-size:13px;margin-bottom:16px' }, L({ gr:'Διάλεξε ύλη για τις ερωτήσεις, ή ξεκίνα με όλο το περιεχόμενο.', en:'Pick material for the questions, or start with all content.' })));
    var listWrap = el('div',{ style:'display:flex;flex-direction:column;gap:8px;margin-bottom:18px' });
    var count = el('span', {}, '0');
    var combineBtn = el('button',{ class:'sc-cta sc-cta--solid', onclick:function(){ _pvpCombineAndGo(sel, combineBtn, close); } });
    function refresh(){
      var n = Object.keys(sel).filter(function(k){ return sel[k]; }).length;
      count.textContent = String(n);
      combineBtn.disabled = n === 0;
      combineBtn.style.opacity = n === 0 ? '.5' : '1';
    }
    mats.forEach(function(m){
      var on = false;
      var row = el('button',{ style:'display:flex;align-items:center;gap:12px;text-align:left;padding:12px 14px;border-radius:10px;border:1px solid color-mix(in srgb,var(--ca) 24%,transparent);background:rgba(255,255,255,.03);color:inherit;cursor:pointer;font:600 14px Inter,sans-serif;' });
      var chk = el('span',{ style:'width:20px;flex:none;font-weight:900;color:var(--ca)' }, '');
      row.appendChild(chk);
      row.appendChild(el('span',{ style:'flex:1' }, _pvpMatLabel(m)));
      row.addEventListener('click', function(){ on = !on; sel[m.id] = on; chk.textContent = on ? '✓' : ''; row.style.background = on ? 'color-mix(in srgb,var(--ca) 16%,transparent)' : 'rgba(255,255,255,.03)'; refresh(); });
      listWrap.appendChild(row);
    });
    card.appendChild(listWrap);
    var bar = el('div',{ style:'display:flex;gap:10px;justify-content:flex-end;align-items:center;flex-wrap:wrap' });
    bar.appendChild(el('button',{ class:'sc-cta sc-cta--ghost', onclick:function(){ try { localStorage.removeItem('SYM_QUESTIONS_SELECTION'); } catch (_) {} close(); launchPvPArena(); } }, L({ gr:'Όλο το περιεχόμενο', en:'All content' })));
    combineBtn.appendChild(el('span', {}, L({ gr:'Συνδυασμός & Είσοδος (', en:'Combine & enter (' })));
    combineBtn.appendChild(count);
    combineBtn.appendChild(el('span', {}, ')'));
    bar.appendChild(combineBtn);
    card.appendChild(bar);
    ov.appendChild(card);
    document.body.appendChild(ov);
    if (window.injectIllus) { try { injectIllus(card); } catch (_) {} }
    refresh();
  }
  window.openPvPContentChooser = openPvPContentChooser;

  // ── Real Live Arena launcher ──
  // The home "Live" screen (S.live) used to be a mockup (hardcoded PIN, fake
  // players). This lazy-loads the REAL LiveArena engine (Firestore live_arenas)
  // via synLaunch('openLiveArena') and opens the host/join picker. If a 6-digit
  // PIN is supplied (student "Join with PIN"), it pre-fills the join screen.
  // Firestore rules require auth for live_arenas — LiveArena.submitJoin already
  // prompts sign-in, but we also surface a friendly prompt up-front for hosting.
  function openRealLiveArena(pin){
    const _pin = (pin || '').toString().replace(/\D/g, '').slice(0, 6);
    // Host (no PIN) → the light synthesis universal ύλη picker (matches the game
    // panel / PvP). On "start" it builds the bank and opens the host lobby. The
    // student join (PIN) path keeps the live overlay flow below.
    if (!_pin && window.SymCurriculum && typeof SymCurriculum.openForLiveHost === 'function') {
      return SymCurriculum.openForLiveHost();
    }
    if (!(window.synLaunch && window.SYN_GAMES && window.SYN_GAMES.openLiveArena)) {
      // Manifest not loaded — should not happen, but fail loudly rather than silently.
      if (typeof window.showToast === 'function') showToast('Η Ζωντανή Αρένα δεν είναι διαθέσιμη', 'Live Arena unavailable');
      return;
    }
    // synLaunch lazy-loads la-overlay + the engine, then calls window.openLiveArena().
    // No PIN = the "Host" button → tell openLiveArena to open the host content
    // picker directly (was falling to the student PIN screen for non-teachers).
    Promise.resolve(window.synLaunch('openLiveArena', _pin ? undefined : { host: true })).then(()=>{
      if (typeof LiveArena === 'undefined') return;
      if (_pin && _pin.length === 6) {
        // Student join with a known PIN: open join screen + prefill, then submit.
        LiveArena.launchStudent();
        const inp = document.getElementById('la-pin-input');
        if (inp) { inp.value = _pin; }
        // Auto-submit so "Join" on the Live screen goes straight in.
        if (typeof LiveArena.submitJoin === 'function') LiveArena.submitJoin();
      } else if (typeof LiveArena.pickDataset === 'function') {
        // Belt-and-suspenders: ensure the host content picker is showing.
        LiveArena.pickDataset();
      }
    }).catch((e)=>{ console.warn('[screens] Live Arena launch failed', e); });
  }
  window.openRealLiveArena = openRealLiveArena;
  // "Coming soon" helpers — tiles flagged `soon:true` in data.js have no real
  // game yet. Reuse the shared badge + friendly notice defined in dir-synthesis.js;
  // fall back to inline equivalents if that module hasn't registered them.
  function soonBadge(){
    if (typeof window.synSoonBadge === 'function') return window.synSoonBadge();
    return el('span',{ class:'syn-soon-badge',
      style:'position:absolute;top:8px;left:8px;z-index:3;display:inline-flex;align-items:center;gap:4px;'
        + 'padding:3px 8px;border-radius:999px;font-size:10px;font-weight:800;letter-spacing:.09em;'
        + 'text-transform:uppercase;line-height:1;color:var(--sym-terra-dk,#9C3F1F);'
        + 'background:color-mix(in srgb, var(--sym-gold,#A2862F) 16%, transparent);'
        + 'border:1px solid color-mix(in srgb, var(--sym-terra,#C5572F) 38%, transparent);' },
      [ el('span',{html:'&#9685;'}), L({gr:'Σύντομα',en:'Soon'}) ]);
  }
  function comingSoon(g){
    if (typeof window.synComingSoon === 'function') return window.synComingSoon(g);
    SymPreview.open('mc', { title:L(g)+' · '+L({gr:'Σύντομα',en:'Coming soon'}), illu:g.illu,
      note:L({gr:'Αυτό το παιχνίδι ετοιμάζεται — θα είναι σύντομα διαθέσιμο.',en:'This game is on the way — available soon.'}) });
  }
  // ── LAUNCH DISPATCH ──────────────────────────────────────────────
  // A game only shows the Ver1-style level selector (S.level) when it is a
  // real CONTENT-BANK game: one whose openFn has a window.SYM.LEVEL_BANK entry
  // backed by live level data in window.GP_LEVEL_PROVIDERS. Everything else —
  // arcade engines, trivia, the GP_ENGINES, single-shot quizzes — launches
  // DIRECTLY. Returns the bank entry ({fn,ds,prog,levels}) or null.
  function gameNeedsLevelPicker(game){
    if (!game || game.soon) return null;
    return (window.SYM && typeof SYM.levelBankFor === 'function') ? SYM.levelBankFor(game) : null;
  }
  // Resolve+launch a tile. Content-bank games → level selector. Self-contained
  // games → launch the real opener immediately. Coming-soon → friendly notice.
  // Safe fallback: if nothing resolves, fall through to the level screen so a
  // tile is never unlaunchable.
  function launchTile(game, ctx){
    if (game && game.soon) return comingSoon(game);
    if (gameNeedsLevelPicker(game)) return go('level', ctx);
    const fn = window.synResolveLaunch && synResolveLaunch(game);
    if (fn && window.SYN_GAMES && SYN_GAMES[fn] && window.synLaunch) return synLaunch(fn, ...((game.launch && game.launch.args) || []));
    return go('level', ctx);   // fallback — keeps every tile launchable
  }
  function pill(t, accent){ return el('span',{class:'sc-pill has-accent', style:`--ca:${accent||SITE}`}, t); }
  function stat(v, label, accent){ return el('div', { class:'sc-stat has-accent', style:`--ca:${accent||SITE}` }, [
    el('div',{class:'sc-stat__v'}, v), el('div',{class:'sc-stat__l'}, label) ]); }
  function chip(t, on, onclick){ return el('button', { class:'sc-fil'+(on?' active':''),
    onclick:(e)=>{ const par=e.currentTarget.parentNode; par.querySelectorAll('.sc-fil').forEach(b=>b.classList.remove('active')); e.currentTarget.classList.add('active'); if(onclick) onclick(); } }, t); }

  // favorite heart (persists)
  function favBtn(id){
    const on = SymStore.isFav(id);
    const b = el('button', { class:'sc-fav'+(on?' on':''), title:'Favorite', onclick:(e)=>{
      e.preventDefault(); e.stopPropagation();
      const nowOn = SymStore.toggleFav(id);
      b.classList.toggle('on', nowOn);
      if(nowOn && window.gsap) gsap.fromTo(b,{scale:.6},{scale:1,duration:.45,ease:'back.out(2)'});
    }, html:'★' });
    return b;
  }
  // display toggle (grid / list)  +  optional admin edit toggle
  function viewBar(opts){
    opts = opts || {};
    const bar = el('div', { class:'sc-viewbar' });
    if(opts.left) bar.appendChild(opts.left);
    bar.appendChild(el('div',{class:'sc-viewbar__sp'}));
    if(opts.admin && isAdmin()){
      bar.appendChild(el('button', { class:'sc-editbtn'+(ST().adminEdit==='on'||window.__symEdit?' on':''), onclick:()=>{
        window.__symEdit = !window.__symEdit; symRender();
      } }, [ glyph('quill','sc-editbtn__gl'), window.__symEdit?L({gr:'Τέλος',en:'Done'}):L({gr:'Επεξεργασία',en:'Edit'}) ]));
    }
    const seg = el('div', { class:'sc-disp' });
    [['grid','▦'],['list','≣'],['compact','▤'],['gallery','◳']].forEach(([v,ic])=> seg.appendChild(el('button', {
      class:(ST().display===v?'active':''), title:v, onclick:()=>{ ST().display=v; symRender(); }
    }, ic)));
    bar.appendChild(seg);
    return bar;
  }
  // editable text (admin) — persists
  function editable(key, def, cls){
    const txt = SymStore.name(key, def);
    if(!isAdmin() || !window.__symEdit) return el('span',{class:cls}, txt);
    const s = el('span', { class:(cls||'')+' sc-edit', contenteditable:'true', spellcheck:'false' }, txt);
    s.addEventListener('blur', ()=>SymStore.setName(key, s.textContent.trim()||def));
    s.addEventListener('keydown', (e)=>{ if(e.key==='Enter'){ e.preventDefault(); s.blur(); } });
    return s;
  }
  // simple drag-reorder for admin
  function attachReorder(container, listId, getIds){
    if(!isAdmin() || !window.__symEdit) return;
    let dragEl=null;
    container.querySelectorAll('[data-rid]').forEach(node=>{
      node.setAttribute('draggable','true'); node.classList.add('sc-draggable');
      node.addEventListener('dragstart', ()=>{ dragEl=node; node.classList.add('dragging'); });
      node.addEventListener('dragend', ()=>{ node.classList.remove('dragging'); dragEl=null;
        SymStore.setOrder(listId, [...container.querySelectorAll('[data-rid]')].map(n=>n.getAttribute('data-rid'))); });
      node.addEventListener('dragover', (e)=>{ e.preventDefault();
        const after = (function(){ const els=[...container.querySelectorAll('[data-rid]:not(.dragging)')];
          return els.reduce((closest,child)=>{ const box=child.getBoundingClientRect(); const off=e.clientY-box.top-box.height/2;
            if(off<0 && off>closest.offset) return {offset:off, element:child}; return closest; },{offset:-Infinity}).element; })();
        if(!dragEl) return; if(after==null) container.appendChild(dragEl); else container.insertBefore(dragEl, after);
      });
    });
  }

  function defaults(ctx){
    const cls = (ctx.param && ctx.param.cls) || ctx.activeClass;
    const subject = (ctx.param && ctx.param.subject) || (ctx.subjects[cls.id] || ctx.subjects['gym-b'])[0];
    const game = (ctx.param && ctx.param.game) || subject.games[0];
    return { cls, subject, game, accent: cls.accent };
  }

  const S = {};

  /* ══ 1 · SUBJECT PAGE ══ (display modes · favorites · admin edit · results) */
  S.subject = function(home, ctx){
    const { cls, subject, accent } = defaults(ctx);
    const body = P(home, { back:'home', accent, roman:subject.roman, eyebrow:L(cls)+' · '+subject.sub,
      title:L(subject), sub:L(subject.summary),
      actions:[ el('button',{class:'sc-cta sc-cta--solid', onclick:()=>go('gamepanel') },
        [ glyph('grid-blocks','sc-cta__gl'), L({gr:'Δες στον Πίνακα Παιχνιδιών',en:'Browse Game Panel'}) ]) ] });

    // tabs: games / results / students
    const tabwrap = el('div',{class:'sc-subtabs sc-stagger'});
    const panes = el('div',{class:'sc-subpane'});
    // students only see Games; teachers/admins see Results & Students
    const tabs = isAdmin()
      ? [ ['games', {gr:'Παιχνίδια',en:'Games'}], ['results', {gr:'Αποτελέσματα',en:'Results'}], ['students', {gr:'Μαθητές',en:'Students'}] ]
      : [ ['games', {gr:'Παιχνίδια',en:'Games'}] ];
    if(tabs.length>1) body.appendChild(tabwrap);
    function showTab(id){
      tabwrap.querySelectorAll('.sc-subtab').forEach(b=>b.classList.toggle('active', b.dataset.t===id));
      panes.innerHTML=''; panes.appendChild(({games:gamesPane, results:resultsPane, students:studentsPane})[id]());
      if(window.injectIllus) injectIllus(panes);
    }
    tabs.forEach(([id,lab],i)=> tabwrap.appendChild(el('button',{class:'sc-subtab'+(i===0?' active':''),'data-t':id, onclick:()=>showTab(id)}, L(lab))));
    body.appendChild(panes);

    function gamesPane(){
      const wrap = el('div',{});
      // include admin-assigned template tiles for this class+subject (mirrors the
      // subject-page renderer) so they appear here too and the count is correct.
      const _assigned = (window.synAssignedTiles && window.synAssignedTiles(cls.id, subject.id)) || [];
      const _all = subject.games.concat(_assigned);
      wrap.appendChild(viewBar({ admin:true,
        left: el('span',{class:'sc-count'}, _all.length+' '+L({gr:'παιχνίδια',en:'games'})) }));
      const listId = 'subj_'+subject.id;
      let games = _all.map((g,i)=>({ g, rid:subject.id+'_'+i }));
      // favorites first
      games.sort((a,b)=> (SymStore.isFav(a.rid)?-1:0) - (SymStore.isFav(b.rid)?-1:0));
      const grid = el('div', { class:'sc-cards has-accent'+(ST().display!=='grid'?' sc-cards--'+ST().display:''), style:`--ca:${accent}` });
      games.forEach(({g,rid},i)=>{
        const soon = !!g.soon;
        const card = el('a', { class:'sc-gcard'+(soon?' sc-gcard--soon':''), href:'javascript:void 0', style:'position:relative', 'data-rid':rid,
          onclick: soon ? (e)=>{ e.preventDefault(); comingSoon(g); } : ()=>launchTile(g,{subject,game:g,cls}) }, [
          soon ? soonBadge() : null,
          el('div',{class:'sc-gcard__ban'},[ favBtn(rid), glyph(g.illu,'sc-gcard__illu'), (!soon&&i%3===0?el('span',{class:'sc-tag'},L({gr:'Δωρεάν',en:'Free'})):null),
            isAdmin()&&window.__symEdit? el('span',{class:'sc-gcard__drag',html:'⠿'}):null ]),
          el('div',{class:'sc-gcard__b'},[ el('h3',{class:'sc-gcard__t'}, L(g)), el('p',{class:'sc-gcard__m'}, g.meta),
            el('div',{class:'sc-gcard__f'},[ el('span',{class:'sc-gcard__tags'},[pill(soon?L({gr:'Σύντομα',en:'Soon'}):L({gr:'Μόνος',en:'Solo'}),accent)]),
              soon ? null : el('button',{class:'sc-gcard__eye', title:'Preview', onclick:(e)=>{ e.preventDefault(); e.stopPropagation(); SymPreview.open(SymPreview.typeFor(g),{title:L(g), illu:g.illu}); }, html:'&#128065;'}),
              el('span',{class:'sc-gcard__play',html: soon ? '&#9679;' : '&#9654;'}) ]) ]),
        ]);
        grid.appendChild(card);
      });
      wrap.appendChild(grid);
      setTimeout(()=>attachReorder(grid, listId, ()=>games.map(x=>x.rid)),0);
      return wrap;
    }

    function resultsPane(){
      const wrap = el('div',{class:'has-accent', style:`--ca:${accent}`});
      wrap.appendChild(el('div',{class:'sc-stats'},[ stat('24',L({gr:'Μαθητές',en:'Students'}),accent), stat('78%',L({gr:'Μ.Ο. ακρίβειας',en:'Avg accuracy'}),accent), stat('312',L({gr:'Παιχνίδια',en:'Plays'}),accent), stat('5',L({gr:'Προς ανασκόπηση',en:'Need review'}),accent) ]));
      wrap.appendChild(el('div',{class:'sc-sec-lbl'}, L({gr:'Ανά παιχνίδι',en:'By game'})));
      const tbl = el('div',{class:'sc-table'});
      tbl.appendChild(el('div',{class:'sc-tr sc-tr--h'},[ el('span',{},L({gr:'Παιχνίδι',en:'Game'})), el('span',{},L({gr:'Μ.Ο.',en:'Avg'})), el('span',{},L({gr:'Ολοκλήρωση',en:'Completion'})), el('span',{},L({gr:'Ενέργειες',en:'Actions'})) ]));
      subject.games.slice(0,5).forEach((g,i)=>{
        const avg = [92,84,76,71,63][i]||70;
        tbl.appendChild(el('div',{class:'sc-tr'},[
          el('span',{class:'sc-tr__task'}, L(g)),
          el('span',{}, avg+'%'),
          el('span',{}, el('span',{class:'sc-bar'},[ el('span',{class:'sc-bar__f',style:`width:${avg}%`}) ])),
          el('span',{class:'sc-tr__acts'},[
            el('button',{class:'sc-mini', onclick:()=>SymPreview.open(SymPreview.typeFor(g),{title:L(g),illu:g.illu})}, L({gr:'Προεπισκόπηση',en:'Preview'})),
            el('button',{class:'sc-mini sc-mini--accent', onclick:()=>go('tartarus')}, L({gr:'Ανασκόπηση',en:'Review'})),
          ]),
        ]));
      });
      wrap.appendChild(tbl);
      return wrap;
    }

    function studentsPane(){
      const wrap = el('div',{class:'has-accent', style:`--ca:${accent}`});
      wrap.appendChild(el('div',{class:'sc-students__bar'},[
        el('input',{class:'sc-search', placeholder:L({gr:'Αναζήτηση μαθητή…',en:'Search student…'})}),
        el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>go('anathesi')},[ '＋ ', L({gr:'Ανάθεση',en:'Assign'}) ]),
      ]));
      const names = ['Αλέξης Π.','Μαρία Κ.','Νίκος Δ.','Ελένη Σ.','Γιώργος Μ.','Σοφία Ρ.','Δημήτρης Α.','Κατερίνα Ν.'];
      const grid = el('div',{class:'sc-roster'});
      names.forEach((n,i)=>{
        const acc=[88,76,93,71,64,82,59,90][i];
        grid.appendChild(el('div',{class:'sc-rcard'},[
          el('span',{class:'sc-rcard__av'}, n[0]),
          el('div',{class:'sc-rcard__b'},[ el('span',{class:'sc-rcard__n'}, n),
            el('span',{class:'sc-rcard__m'}, L({gr:'Ακρίβεια',en:'Accuracy'})+' '+acc+'%') ]),
          el('span',{class:'sc-rcard__badge'+(acc<70?' low':'')}, acc<70?'⚠':'✓'),
          el('button',{class:'sc-mini', onclick:()=>go('tartarus')}, L({gr:'Λάθη',en:'Mistakes'})),
        ]));
      });
      wrap.appendChild(grid);
      return wrap;
    }

    showTab('games');
  };

  /* ══ 2 · MODE SELECT ══ */
  S.mode = function(home, ctx){
    const { cls, subject, game, accent } = defaults(ctx);
    const body = P(home, { back:'subject', backLabel:L(subject), accent, eyebrow:L(subject)+' · '+L(gName(game)),
      title:L({gr:'Επίλεξε Λειτουργία',en:'Choose a mode'}), sub:L({gr:'Πώς θες να παίξεις απόψε;',en:'How do you want to play tonight?'}),
      actions:[ el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>SymPreview.open(SymPreview.typeFor(game),{title:L(gName(game)),illu:game.illu})},[ el('span',{html:'&#128065;'}), L({gr:'Δες σε δράση',en:'See it in action'}) ]) ] });
    const modes = [
      // Solo / Practice → real-launch dispatch: content-bank games open the
      // level selector, self-contained games launch straight into the game.
      { gr:'Μόνος', en:'Solo', d:{gr:'Παίξε με τον ρυθμό σου',en:'Play at your own pace'}, illu:'runner', to:()=>launchTile(game,{subject,game,cls}) },
      { gr:'Διελκυστίνδα', en:'Tug of War', d:{gr:'1 vs 1 · τράβα τη γραμμή',en:'1 vs 1 · pull the line'}, illu:'rope', to:()=>launchTile(game,{subject,game,cls}) },
      { gr:'Live Arena', en:'Live Arena', d:{gr:'Όλη η τάξη ζωντανά',en:'The whole class, live'}, illu:'lightning-bolt', to:()=>go('live'), hot:1 },
      { gr:'Εξάσκηση', en:'Practice', d:{gr:'Χωρίς βαθμολογία',en:'No scoring, just drills'}, illu:'scroll', to:()=>launchTile(game,{subject,game,cls}) },
    ];
    const grid = el('div', { class:'sc-modes sc-stagger has-accent', style:`--ca:${accent}` });
    modes.forEach(m=> grid.appendChild(el('button', { class:'sc-mode'+(m.hot?' sc-mode--hot':''), onclick:m.to }, [
      el('span',{class:'sc-mode__ic'},[ glyph(m.illu,'sc-mode__gl') ]),
      el('span',{class:'sc-mode__t'}, L(m)), el('span',{class:'sc-mode__d'}, L(m.d)),
      m.hot? el('span',{class:'sc-mode__badge'}, 'LIVE'):null, el('span',{class:'sc-mode__go',html:'&rarr;'}),
    ])));
    body.appendChild(grid);
  };

  /* ══ 3 · LEVEL SELECT ══  Ver1-style content BANK selector.
     Driven by the real level data in window.GP_LEVEL_PROVIDERS (gp-levels.js):
     pick a subject/category → pick a specific LEVEL, or pick "Μείξη / Mix"
     (the Συνδυαστικό group). Each row launches the live game scoped to the
     clicked level via synLaunch(fn, levelId, group). Per-user progress is read
     honestly from each game's own localStorage keys — 0 for a new user. */
  S.level = function(home, ctx){
    const { cls, subject, game, accent } = defaults(ctx);
    const showType = SymPreview.typeFor(game);
    const bank = gameNeedsLevelPicker(game);

    // Origin-aware back target: when reached from the Game Panel, return there;
    // otherwise (subject page / mode screen launches) go back to the subject.
    const fromGamePanel = !!(ctx.param && ctx.param.from === 'gamepanel');
    const backTo    = fromGamePanel ? 'gamepanel' : 'subject';
    const backLabel = fromGamePanel ? L({gr:'Πίνακας Παιχνιδιών',en:'Game Panel'}) : L(subject);

    const body = P(home, { back:backTo, backLabel, accent, eyebrow:L(subject)+' · '+L(gName(game)),
      title:L(gName(game)) });

    // ── No real level bank. Two sub-cases:
    //    (a) an ENGINE that can take injected content (Agora Surfers, Heptapylos,
    //        …) → rich "mix any material" setup (material picker + multi-select).
    //    (b) anything else → a single honest direct-launch card (unchanged). ──
    if (!bank) {
      const fn = window.synResolveLaunch && synResolveLaunch(game);
      const inj = (fn && window.SymMix && SymMix.ENGINE_INJECTION) ? SymMix.ENGINE_INJECTION[fn] : null;
      const mats = (window.SymMix && SymMix.materials) ? SymMix.materials() : [];
      if (inj && mats.length) { engineSetup(body, game, fn, inj, mats, accent); return; }

      const card = el('div',{class:'lv-shell sc-stagger has-accent', style:`--ca:${accent}`});
      card.appendChild(el('button',{class:'lv-cat lv-cat--custom', style:'width:100%', onclick:()=>{
        if (game && game.soon) return comingSoon(game);
        if (fn && window.SYN_GAMES && SYN_GAMES[fn] && window.synLaunch) return synLaunch(fn);
        return SymPreview.open(showType,{title:L(gName(game)), illu:game.illu});
      }},[ el('div',{class:'lv-cat__b'},[
        el('span',{class:'lv-cat__t'}, L({gr:'Ξεκίνα το παιχνίδι',en:'Start the game'})),
        el('span',{class:'lv-cat__m'}, L({gr:'Χωρίς επίπεδα — άμεση έναρξη',en:'No levels — launches directly'})) ]),
        el('span',{class:'lv-cat__n'},'→') ]));
      body.appendChild(card);
      body.appendChild(shareToClass());
      return;
    }

    // ── Build categories from the real provider level list, grouped by `group`
    //    (preserving order). The "Συνδυαστικό" group IS the Mix option. ──
    const fn = bank.fn, prog = bank.prog;
    const order = [];
    const byGroup = {};
    bank.levels.forEach(lv => {
      const g = lv.group || L({gr:'Επίπεδα',en:'Levels'});
      if (!byGroup[g]) { byGroup[g] = []; order.push(g); }
      byGroup[g].push(lv);
    });
    // per-level honest progress: localStorage[prog+id] → {completed:bool}
    function lvDone(id){
      if (!prog) return false;
      try { const v = JSON.parse(localStorage.getItem(prog + id) || 'null'); return !!(v && v.completed); }
      catch(_) { return false; }
    }
    const isMix = (g)=> /συνδυ|μείξ|combined|mix/i.test(g);
    const CATS = order.map((g,i)=>{
      const levels = byGroup[g];
      const done = levels.reduce((s,lv)=> s + (lvDone(lv.id)?1:0), 0);
      return { id:'c'+i, group:g, t:{gr:g,en:g}, mix:isMix(g), levels, done, total:levels.length };
    });
    const totalAll = CATS.reduce((s,c)=>s+c.total,0) || 1;
    const doneAll  = CATS.reduce((s,c)=>s+c.done,0);

    // honest completion bar (0/Y for a fresh user)
    body.appendChild(el('div',{class:'lv-progress sc-stagger'},[
      el('div',{class:'lv-progress__bar'},[ el('span',{class:'lv-progress__fill',style:`width:${doneAll/totalAll*100}%`}) ]),
      el('span',{class:'lv-progress__t'}, doneAll+'/'+totalAll+' '+L({gr:'ολοκληρωμένα',en:'completed'})),
    ]));

    const shell = el('div',{class:'lv-shell sc-stagger has-accent', style:`--ca:${accent}`});
    const rail = el('div',{class:'lv-cats'});
    rail.appendChild(el('div',{class:'lv-cats__hd'}, L({gr:'Κατηγορίες',en:'Categories'})));
    const list = el('div',{class:'lv-list'});
    // default to the first non-mix category so Mix is an explicit choice
    let activeCat = (CATS.find(c=>!c.mix) || CATS[0]).id;

    function launchLevel(lv, group){
      if (game && game.soon) return comingSoon(game);
      if (fn && window.SYN_GAMES && SYN_GAMES[fn] && window.synLaunch) return synLaunch(fn, lv.id, group);
      return SymPreview.open(showType,{title:L(gName(game)), illu:game.illu});
    }

    function paintList(){
      const cat = CATS.find(c=>c.id===activeCat) || CATS[0];
      list.innerHTML='';
      list.appendChild(el('div',{class:'lv-list__hd'},[
        el('span',{class:'lv-list__ttl'}, cat.group),
        el('span',{class:'lv-list__ct'}, cat.total+' '+L({gr:'επίπεδα',en:'levels'})),
      ]));
      cat.levels.forEach((lv,i)=>{
        const dn = lvDone(lv.id);
        const label = lv.desc || (L({gr:'Επίπεδο',en:'Level'})+' '+(i+1));
        list.appendChild(el('button',{class:'lv-row'+(dn?' done':'')+(lv.color?' lv-row--'+lv.color:''),
          onclick:()=>launchLevel(lv, cat.group) },[
          el('span',{class:'lv-row__n'}, dn?'✓':String(i+1).padStart(2,'0')),
          el('span',{class:'lv-row__t'},[
            lv.section ? el('span',{class:'lv-row__sec'}, lv.section+' · ') : null,
            label ]),
          el('span',{class:'lv-row__go'}, (dn?L({gr:'Ξανά',en:'Replay'}):L({gr:'Ξεκίνα',en:'Start'}))+' →'),
        ]));
      });
    }
    CATS.forEach(c=>{
      rail.appendChild(el('button',{class:'lv-cat'+(c.id===activeCat?' active':'')+(c.mix?' lv-cat--mix':''),'data-c':c.id,
        onclick:()=>{ activeCat=c.id; rail.querySelectorAll('.lv-cat').forEach(b=>b.classList.toggle('active', b.dataset.c===c.id)); paintList(); }},[
        el('div',{class:'lv-cat__b'},[
          el('span',{class:'lv-cat__t'}, c.mix ? (L({gr:'Μείξη',en:'Mix'})+' · '+c.group) : c.group),
          el('span',{class:'lv-cat__m'}, c.mix
            ? L({gr:'Συνδυαστικά επίπεδα — όλα μαζί',en:'Combined levels — all together'})
            : (c.done+'/'+c.total+' '+L({gr:'ολοκλ.',en:'done'}))) ]),
        el('span',{class:'lv-cat__n'+(c.total&&c.done===c.total?' full':'')}, c.mix?'∞':c.done),
      ]));
    });
    if(isAdmin()){
      rail.appendChild(el('button',{class:'lv-cat lv-cat--admin', onclick:()=>SymPreview.open('mc',{title:L({gr:'Διαχείριση κατηγοριών',en:'Manage categories'}), note:L({gr:'Οι κατηγορίες & τα επίπεδα προέρχονται από τα δεδομένα του παιχνιδιού.',en:'Categories & levels come from the game data.'})})},[
        el('div',{class:'lv-cat__b'},[ el('span',{class:'lv-cat__t'}, '✎ '+L({gr:'Κατηγορίες',en:'Categories'})), el('span',{class:'lv-cat__m'}, L({gr:'Από τα δεδομένα του παιχνιδιού',en:'From the game data'})) ]),
      ]));
    }
    shell.appendChild(rail); shell.appendChild(list);
    body.appendChild(shell);
    body.appendChild(shareToClass());
    paintList();

    // Bottom "share to class" action: opens a themed QR/link modal scoped to
    // this game (encoding specific levels + a boot auto-launch is a later phase).
    function shareToClass(){
      return el('button',{class:'lv-sharebtn', onclick:()=>{
        const launchFn = (window.synResolveLaunch && synResolveLaunch(game)) || '';
        if (window.showQR) window.showQR(L(gName(game)), { game: launchFn });
      }},[
        glyph('grid-blocks','lv-sharebtn__gl'),
        el('span',{class:'lv-sharebtn__b'},[
          el('span',{class:'lv-sharebtn__t'}, L({gr:'Μοιράσου στην τάξη',en:'Share to class'})),
          el('span',{class:'lv-sharebtn__d'}, L({gr:'Σκάναρε το QR ή στείλε τον σύνδεσμο',en:'Scan the QR or send the link'})),
        ]),
        el('span',{class:'lv-sharebtn__qr',html:'&#9783;'}),
      ]);
    }
  };

  /* ── ENGINE SETUP (Phase 2 · multi-select content mixing) ──────────────
     For engine games that ship no questions but accept injected content
     (Agora Surfers, Heptapylos, …): pick a grammar MATERIAL, then MULTI-
     SELECT its levels, then launch the engine with the merged bank.
     The existing single-pick grammar path (S.level's bank branch) is
     untouched — this only replaces the old "no levels" fallback card. */
  function engineSetup(body, game, fn, inj, mats, accent){
    const wrap = el('div',{class:'syn-mix sc-stagger has-accent', style:`--ca:${accent}`});

    // ── universal "Διάλεξε ύλη" picker (Ver1 ecx) ──
    // Multi-select ANY admin-uploaded ύλη from the universal catalog (grammar +
    // class content + published packs), filter by subject tag, "+ MIX" to
    // combine, pick LEVELS per leveled source, then launch with the merged bank.
    const sel = new Map();        // dsId → { all:bool, levels:Set, item }
    let search = '', activeTag = null;
    let cat = (window.SymMix && SymMix.catalog) ? SymMix.catalog() : [];

    // ── teacher's own uploaded questionnaire (mixed in alongside the catalog) ──
    // Parsed MC items in the engine shape {q:{gr,en}, a:[≤4 strings], c:index};
    // treated as a selected source so the footer count + Start include them.
    var customQs = [];

    // Coerce any raw text into a {gr,en} bilingual question label.
    function _ownQText(v){
      if (v && typeof v === 'object') return { gr: (v.gr||v.en||''), en: (v.en||v.gr||'') };
      var s = (v == null ? '' : String(v)).trim();
      return { gr:s, en:s };
    }
    // Normalise one loose item ({q, opts|a|options|choices, ans|correct|c|answer})
    // into the engine MC shape, or null if it can't form ≥2 options.
    function _ownNorm(item){
      if (!item || typeof item !== 'object') return null;
      var qraw = item.q != null ? item.q : (item.question != null ? item.question : item.front);
      if (qraw == null || (typeof qraw === 'string' && !qraw.trim())) return null;
      var opts, c = 0;
      var rawOpts = item.a || item.opts || item.options || item.choices;
      if (Array.isArray(rawOpts) && rawOpts.length){
        opts = rawOpts.map(function(o){ return (o == null ? '' : String(o)).trim(); }).filter(Boolean).slice(0,4);
        // correct index from explicit ans|c|correct, or by matching the correct text
        var ci = (typeof item.ans === 'number') ? item.ans
               : (typeof item.c === 'number') ? item.c
               : (typeof item.correct === 'number') ? item.correct : null;
        if (ci != null && ci >= 0 && ci < opts.length){ c = ci; }
        else {
          var ctext = item.correct || item.answer || item.ans;
          if (ctext != null && typeof ctext !== 'number'){
            var idx = opts.indexOf(String(ctext).trim());
            if (idx >= 0) c = idx;
          }
        }
      } else {
        // {correct/answer/a, distractors|wrong}: correct first → index 0
        var correct = item.correct || item.answer || item.a || item.back || '';
        var distract = item.distractors || item.wrong || item.options || [];
        opts = [String(correct).trim()].concat((Array.isArray(distract)?distract:[]).map(function(o){return String(o).trim();}))
               .filter(Boolean).slice(0,4);
        c = 0;
      }
      if (opts.length < 2) return null;
      return { q:_ownQText(qraw), a:opts, c:c };
    }
    // JSON: array of items, or {questions:[…]} wrapper.
    function _ownParseJSON(text){
      var data = JSON.parse(text);
      var arr = Array.isArray(data) ? data : (data && Array.isArray(data.questions) ? data.questions : null);
      if (!arr) throw new Error('expected array or {questions:[…]}');
      return arr.map(_ownNorm).filter(Boolean);
    }
    // Split a CSV/TSV line honouring simple double-quoted fields.
    function _ownSplitRow(line, sep){
      var out = [], cur = '', q = false;
      for (var i=0; i<line.length; i++){
        var ch = line[i];
        if (ch === '"'){ if (q && line[i+1] === '"'){ cur += '"'; i++; } else q = !q; }
        else if (ch === sep && !q){ out.push(cur); cur = ''; }
        else cur += ch;
      }
      out.push(cur);
      return out.map(function(c){ return c.trim().replace(/^"|"$/g,''); });
    }
    // CSV/TSV: columns = question, optionA..D, correctIndex|letter|text. Header optional.
    function _ownParseDelimited(text, sep){
      var lines = text.split(/\r?\n/).filter(function(l){ return l.trim(); });
      if (!lines.length) return [];
      var first = _ownSplitRow(lines[0], sep);
      var hasHeader = /^(question|q|ερώτηση|ερωτηση)/i.test((first[0]||'').trim());
      var start = hasHeader ? 1 : 0;
      // Locate a "correct" column from the header (else assume options are cols 1..4)
      var correctCol = -1;
      if (hasHeader){
        first.forEach(function(h,i){ if (/correct|answer|ans|σωστ/i.test(h)) correctCol = i; });
      }
      var out = [];
      for (var r=start; r<lines.length; r++){
        var cols = _ownSplitRow(lines[r], sep);
        var q = cols[0];
        if (!q) continue;
        var optCols, cc;
        if (correctCol > 0){
          cc = cols[correctCol];
          optCols = cols.slice(1).filter(function(_,i){ return (i+1) !== correctCol; });
        } else {
          optCols = cols.slice(1, 5);
          cc = null;
        }
        var opts = optCols.map(function(o){ return (o||'').trim(); }).filter(Boolean).slice(0,4);
        if (opts.length < 2) continue;
        var c = 0;
        if (cc != null && String(cc).trim() !== ''){
          var s = String(cc).trim();
          if (/^\d+$/.test(s)){ var n = parseInt(s,10); if (n>=0 && n<opts.length) c = n; }
          else if (/^[A-Da-d]$/.test(s)){ var li = s.toUpperCase().charCodeAt(0)-65; if (li<opts.length) c = li; }
          else { var ti = opts.indexOf(s); if (ti>=0) c = ti; }
        }
        out.push({ q:_ownQText(q), a:opts, c:c });
      }
      return out;
    }
    // TXT: Q:/A:/W: blocks separated by blank lines (correct = A, distractors = W).
    function _ownParseTXT(text){
      return text.split(/\n{2,}/).map(function(block){
        var lines = block.split(/\n/).map(function(l){ return l.trim(); }).filter(Boolean);
        var q = '', ans = '', wrong = [];
        lines.forEach(function(l){
          if (/^Q:/i.test(l)) q = l.replace(/^Q:\s*/i,'');
          else if (/^A:/i.test(l)) ans = l.replace(/^A:\s*/i,'');
          else if (/^W:/i.test(l)) wrong.push(l.replace(/^W:\s*/i,''));
        });
        if (!q || !ans) return null;
        var opts = [ans].concat(wrong).map(function(o){ return o.trim(); }).filter(Boolean).slice(0,4);
        if (opts.length < 2) return null;
        return { q:_ownQText(q), a:opts, c:0 };
      }).filter(Boolean);
    }

    // ── upload card (teachers/admin only) ──
    // currentUserRole is a top-level `let` in auth.js (admins get role 'teacher');
    // window.currentUserRole / window.isAdmin do NOT exist, and screens.js's local
    // `isAdmin` is the edit-mode helper — so gate on the bare auth role.
    var isTeacher = (typeof currentUserRole !== 'undefined' && (currentUserRole === 'teacher' || currentUserRole === 'admin'));
    var ownFile = el('input',{ type:'file', accept:'.json,.csv,.tsv,.txt', style:'display:none' });
    var ownOk = el('div',{class:'syn-ds-upload__ok', style:'display:none'});
    var ownCard;
    function _ownClear(){
      customQs = [];
      ownOk.style.display = 'none';
      ownCard.classList.remove('on');
      ownCard.querySelector('.syn-ds-upload__cta').textContent = L({gr:'Ανέβασε αρχείο',en:'Upload file'});
      if (typeof updateBar === 'function') updateBar();
    }
    function _ownShowOk(n){
      ownOk.innerHTML = '';
      ownOk.appendChild(el('span', null, '✓ ' + L({ gr: n + (n===1?' ερώτηση':' ερωτήσεις') + ' εντοπίστηκαν', en: n + (n===1?' question':' questions') + ' detected' })));
      ownOk.appendChild(el('button',{ onclick:function(ev){ ev.stopPropagation(); _ownClear(); } }, L({gr:'Αφαίρεση',en:'Remove'})));
      ownOk.style.display = '';
      ownCard.classList.add('on');
      ownCard.querySelector('.syn-ds-upload__cta').textContent = '✓ ' + L({gr:'Στη μείξη',en:'In mix'});
    }
    function _ownShowErr(){
      ownOk.innerHTML = '';
      ownOk.appendChild(el('p',{class:'syn-ds-upload__err'}, '✗ ' + L({gr:'Αδύνατη ανάγνωση αρχείου. Έλεγξε τη μορφή.',en:'Could not parse file. Check the format.'})));
      ownOk.style.display = '';
      ownCard.classList.remove('on');
    }
    function _ownHandleFile(input){
      var file = input && input.files && input.files[0];
      if (!file) return;
      var name = (file.name||'').toLowerCase();
      var reader = new FileReader();
      reader.onload = function(ev){
        try {
          var text = ev.target.result;
          var qs;
          if (name.endsWith('.json')) qs = _ownParseJSON(text);
          else if (name.endsWith('.csv')) qs = _ownParseDelimited(text, ',');
          else if (name.endsWith('.tsv')) qs = _ownParseDelimited(text, '\t');
          else qs = _ownParseTXT(text);
          if (!qs || !qs.length) throw new Error('no questions');
          customQs = qs;
          _ownShowOk(qs.length);
        } catch(_){
          customQs = [];
          _ownShowErr();
        }
        if (typeof updateBar === 'function') updateBar();
        input.value = '';
      };
      reader.readAsText(file, 'UTF-8');
    }
    ownFile.addEventListener('change', function(){ _ownHandleFile(ownFile); });
    if (isTeacher){
      ownCard = el('div',{class:'syn-ds-upload', onclick:function(){ ownFile.click(); }},[
        el('span',{class:'syn-ds-upload__ic'}, '📤'),
        el('span',{class:'syn-ds-upload__info'},[
          el('span',{class:'syn-ds-upload__name'}, L({gr:'Δικό μου ερωτηματολόγιο',en:'My own questionnaire'})),
          el('span',{class:'syn-ds-upload__meta'}, L({gr:'Ανέβασε τις δικές σου ερωτήσεις και φιλοξένησέ τες με αυτή τη μηχανή.',en:'Upload your own questions and host them with this engine.'})),
          el('span',{class:'syn-ds-upload__pills'},[
            el('span',{class:'syn-ds-upload__pill'}, 'JSON'),
            el('span',{class:'syn-ds-upload__pill'}, 'CSV'),
            el('span',{class:'syn-ds-upload__pill'}, 'TSV'),
            el('span',{class:'syn-ds-upload__pill'}, 'TXT'),
          ]),
        ]),
        el('span',{class:'syn-ds-upload__cta'}, L({gr:'Ανέβασε αρχείο',en:'Upload file'})),
      ]);
      wrap.appendChild(ownCard);
      wrap.appendChild(ownFile);
      wrap.appendChild(ownOk);
    } else {
      ownCard = el('div',{class:'syn-ds-upload locked'},[
        el('span',{class:'syn-ds-upload__ic'}, '🔒'),
        el('span',{class:'syn-ds-upload__info'},[
          el('span',{class:'syn-ds-upload__name'}, L({gr:'Δικό μου ερωτηματολόγιο',en:'My own questionnaire'})),
          el('span',{class:'syn-ds-upload__meta'}, L({gr:'Ανέβασε τις δικές σου ερωτήσεις (μόνο για καθηγητές).',en:'Upload your own questions (teachers only).'})),
        ]),
        el('span',{class:'syn-ds-upload__flag'}, '🔒 ' + L({gr:'Απαιτείται συνδρομή καθηγητή',en:'Teacher subscription required'})),
      ]);
      wrap.appendChild(ownCard);
    }

    wrap.appendChild(el('div',{class:'syn-mix__lbl', style:'margin-top:0'}, L({gr:'Διάλεξε ύλη',en:'Choose content'})));
    wrap.appendChild(el('p',{class:'sc-cap', style:'margin:0 0 6px;opacity:.8'},
      L({gr:'Αυτόματη λίστα: γραμματική + ύλη τάξεων + δημοσιευμένα πακέτα.',en:'Auto-listed: grammar + class content + published packs.'})));

    const searchInput = el('input',{class:'syn-mix__search', type:'text',
      placeholder:L({gr:'Αναζήτηση ύλης…',en:'Search content…'}),
      oninput:(e)=>{ search=(e.target.value||'').toLowerCase(); paintList(); }});
    wrap.appendChild(searchInput);

    // ── subject-tag filter row (the categories present, as icon chiplets) ──
    const tagRow = el('div',{class:'syn-mix__tags'});
    wrap.appendChild(tagRow);
    function paintTags(){
      tagRow.innerHTML='';
      const chip = (key,label)=> el('button',{class:'syn-tagchip'+(activeTag===key?' on':''),
        onclick:()=>{ activeTag=key; paintTags(); paintList(); }},
        [ el('span',{class:'syn-tagchip__t'}, label) ]);
      tagRow.appendChild(chip(null, L({gr:'Όλα',en:'All'})));
      cat.forEach(g=>{ if((g.items||[]).length) tagRow.appendChild(chip(g.group, g.group)); });
    }

    const listWrap = el('div',{class:'syn-mix__cats'});
    wrap.appendChild(listWrap);

    function levelPanel(it, st){
      const panel = el('div',{class:'syn-ds-levels'});
      const allIds = (it.levels||[]).map(lv=>lv.id);
      const allOn  = allIds.length>0 && allIds.every(id=>st.levels.has(id));
      // mass select-all / clear (selects EVERY level pill, ticking them all)
      panel.appendChild(el('button',{class:'syn-lvpill--all'+(allOn?' on':''),
        onclick:()=>{ if(allOn) st.levels.clear(); else allIds.forEach(id=>st.levels.add(id)); paintList(); updateBar(); }},
        allOn ? ('✓ '+L({gr:'Όλα επιλεγμένα — καθάρισε',en:'All selected — clear'}))
              : L({gr:'Επιλογή όλων των επιπέδων',en:'Select all levels'})));
      const order=[], byG={};
      (it.levels||[]).forEach(lv=>{ const g=lv.group||''; if(!byG[g]){byG[g]=[];order.push(g);} byG[g].push(lv); });
      let n=0;
      order.forEach(g=>{
        const rows = byG[g];
        const gOn  = rows.length>0 && rows.every(lv=>st.levels.has(lv.id));
        panel.appendChild(el('div',{class:'syn-lvgrp-row'},[
          el('span',{class:'syn-lvgrp'}, g||L({gr:'Επίπεδα',en:'Levels'})),
          el('button',{class:'syn-lvgrp-all'+(gOn?' on':''), onclick:()=>{
            const turnOn = !gOn;
            rows.forEach(lv=>{ if(turnOn) st.levels.add(lv.id); else st.levels.delete(lv.id); });
            paintList(); updateBar();
          }}, gOn ? L({gr:'Καμία',en:'None'}) : L({gr:'Όλα',en:'All'})),
        ]));
        rows.forEach((lv)=>{
          n++;
          const lon = st.levels.has(lv.id);
          panel.appendChild(el('button',{class:'syn-lvrowpill'+(lon?' on':'')+(lv.color?' syn-lvpill--'+lv.color:''),
            onclick:()=>{
              if(st.levels.has(lv.id)) st.levels.delete(lv.id); else st.levels.add(lv.id);
              paintList(); updateBar();
            }}, [
            el('span',{class:'syn-lvpill__box'}, lon?'✓':''),
            el('span',{class:'syn-lvpill__n'}, String(n).padStart(2,'0')),
            el('span',{class:'syn-lvpill__t'},[
              lv.section ? el('span',{class:'syn-lvpill__sec'}, lv.section+' · ') : null,
              lv.desc || ('Επίπεδο '+lv.id) ]) ]));
        });
      });
      return panel;
    }

    function paintList(){
      listWrap.innerHTML='';
      let shown=0;
      cat.forEach(group=>{
        if(activeTag && group.group!==activeTag) return;
        const items = (group.items||[]).filter(i=> !search
          || (i.label||'').toLowerCase().includes(search)
          || (i.meta||'').toLowerCase().includes(search));
        if(!items.length) return;
        listWrap.appendChild(el('div',{class:'syn-ds-cat'}, group.group));
        const grid = el('div',{class:'syn-ds-grid'});
        items.forEach(it=>{
          shown++;
          const st = sel.get(it.id);
          const on = !!st;
          const card = el('div',{class:'syn-ds'+(on?' on':'')+(it.locked?' locked':'')},[
            el('span',{class:'syn-ds__ic'}, it.icon||'◆'),
            el('span',{class:'syn-ds__info'},[
              el('span',{class:'syn-ds__name'}, it.label + (it.isNew?' •':'')),
              el('span',{class:'syn-ds__meta'}, (function(){
                if(!(on && it.leveled)) return it.meta||'';
                const total = (it.levels||[]).length;
                return st.levels.size >= total
                  ? L({gr:'όλα τα επίπεδα',en:'all levels'})
                  : (st.levels.size + ' / ' + total + ' ' + L({gr:'επίπεδα',en:'levels'}));
              })()),
            ]),
            it.locked
              ? el('span',{class:'syn-ds__flag'}, '🔒 Pro')
              : el('button',{class:'syn-ds__mix'+(on?' on':''), onclick:()=>{
                  if(sel.has(it.id)) sel.delete(it.id);
                  // default: ALL levels of this source selected (works out of the box)
                  else sel.set(it.id, { levels:new Set((it.levels||[]).map(l=>l.id)), item:it });
                  paintList(); updateBar();
                }}, on ? ('✓ '+L({gr:'Στη μείξη',en:'In mix'})) : ('+ MIX')),
          ]);
          grid.appendChild(card);
          // per-source level picker (leveled sources only)
          if(on && it.leveled && it.levels && it.levels.length) grid.appendChild(levelPanel(it, st));
        });
        listWrap.appendChild(grid);
      });
      if(!shown) listWrap.appendChild(el('p',{class:'sc-hint'}, L({gr:'Καμία ύλη δεν ταιριάζει.',en:'No content matches.'})));
    }

    // ── sticky "N sources" bar + Start ──
    const bar = el('div',{class:'syn-mix__bar'});
    const count = el('span',{class:'syn-mix__count'});
    const startBtn = el('button',{class:'syn-mix__start', onclick:()=>{
      if(!sel.size && !customQs.length) return;
      const picks = Array.from(sel.entries()).map(([id,st])=>({ id:id, levelIds: Array.from(st.levels) }));
      startBtn.disabled = true;
      const old = startBtn.textContent;
      startBtn.textContent = L({gr:'Φόρτωση…',en:'Loading…'});
      // Catalog picks (may be empty) resolve through SymMix.bankMulti; the teacher's
      // uploaded customQs are then appended onto the merged bank. If only customQs
      // were provided (no dataset picks) we still launch with just those.
      const bankP = (picks.length && window.SymMix && SymMix.bankMulti)
        ? Promise.resolve(SymMix.bankMulti(picks))
        : Promise.resolve([]);
      bankP.then(qs=>{
        const merged = (qs||[]).concat(customQs);
        const onlyOwn = !picks.length && customQs.length;
        const title = onlyOwn
          ? (L(gName(game)) + ' · ' + L({gr:'Δικό μου ερωτηματολόγιο',en:'My questionnaire'}))
          : (picks.length===1 && !customQs.length)
            ? L(gName(game))
            : (L(gName(game)) + ' · ' + L({gr:'Μεικτή ύλη',en:'Mixed'}));
        return injectBankAndLaunch(fn, inj, merged, title);
      }).then(()=>{ startBtn.disabled=false; startBtn.textContent=old; })
        .catch(()=>{ startBtn.disabled=false; startBtn.textContent=old; });
    }});
    bar.appendChild(count);
    bar.appendChild(el('span',{class:'syn-mix__sp'}));
    bar.appendChild(startBtn);

    function updateBar(){
      // The uploaded questionnaire counts as one extra source in the mix.
      const n = sel.size + (customQs.length ? 1 : 0);
      count.textContent = n+' '+L({gr:'πηγές',en:'sources'});
      startBtn.disabled = n===0;
      startBtn.classList.toggle('is-off', n===0);
      startBtn.textContent = n
        ? L({gr:'Ξεκίνα με '+n+(n===1?' πηγή':' πηγές'),en:'Start with '+n})
        : L({gr:'Διάλεξε ύλη',en:'Choose content'});
    }

    wrap.appendChild(bar);
    body.appendChild(wrap);
    paintTags(); paintList(); updateBar();

    // Merge Firestore published packs (config/datasets + custom_games), then refresh.
    if (window.GP_CONTENT && typeof GP_CONTENT.loadCloud === 'function'){
      Promise.resolve(GP_CONTENT.loadCloud()).then(()=>{
        if (window.SymMix && SymMix.catalog){ cat = SymMix.catalog(); paintTags(); paintList(); }
      }).catch(()=>{});
    }
  }

  /* Build the combined bank for (ds, ids) and launch the engine with it,
     per the engine's injection mode. Returns a Promise (resolves after the
     opener is invoked). Reused by the boot deep-link handler in app.js. */
  function launchEngineWithBank(fn, inj, ds, ids, title){
    if (!(window.SymMix && typeof SymMix.bank === 'function')) return Promise.resolve();
    return SymMix.bank(ds, ids).then(function(qs){ return injectBankAndLaunch(fn, inj, qs, title); });
  }

  /* Inject a PREBUILT bank (e.g. from SymMix.bankMulti — the universal picker)
     into an engine and launch it, per the engine's injection mode. */
  function injectBankAndLaunch(fn, inj, qs, title){
    inj = inj || (window.SymMix && SymMix.ENGINE_INJECTION && SymMix.ENGINE_INJECTION[fn]) || { mode:'sym' };
    return Promise.resolve().then(function(){
      qs = qs || [];
      if (inj.mode === 'config'){
        // Engine takes a config arg (Agora Surfers reads config.questions).
        return window.synLaunch ? window.synLaunch(fn, { questions: qs, title: title }) : null;
      }
      // mode 'sym': engine reads window.SYM_QUESTIONS at open. Snapshot the
      // shared bank, swap in our selection, and RESTORE it when the engine's
      // close fn runs (mirrors the Heptapylos HEP_Q snapshot/restore pattern),
      // so the global library isn't clobbered for the next launch.
      if (qs.length){
        var prev = window.SYM_QUESTIONS;
        window.SYM_QUESTIONS = qs;
        var closeName = inj.closeFn;
        if (closeName){
          var restore = function(){
            try { window.SYM_QUESTIONS = prev; } catch(_){}
            try { if (window[closeName] && window[closeName].__symMixWrapped) window[closeName] = window[closeName].__symMixOrig; } catch(_){}
          };
          // Wrap the engine's close fn once so the restore fires on teardown.
          var attachWrap = function(){
            var orig = window[closeName];
            if (typeof orig === 'function' && !orig.__symMixWrapped){
              var wrapped = function(){ var r = orig.apply(this, arguments); restore(); return r; };
              wrapped.__symMixWrapped = true; wrapped.__symMixOrig = orig;
              window[closeName] = wrapped;
            }
          };
          return Promise.resolve(window.synLaunch ? window.synLaunch(fn, { title: title }) : null)
            .then(function(r){ attachWrap(); return r; });
        }
      }
      return window.synLaunch ? window.synLaunch(fn, { title: title }) : null;
    });
  }
  window.launchEngineWithBank = launchEngineWithBank;
  window.injectBankAndLaunch = injectBankAndLaunch;

  /* ══ 4 · GAME PANEL ══ (all engines · display modes · favorites · admin edit) */
  S.gamepanel = function(home, ctx){
    const body = P(home, { back:'home', accent:SITE, eyebrow:L({gr:'Μηχανές & Ύλη',en:'Engines & content'}),
      title:L({gr:'Πίνακας Παιχνιδιών',en:'Game Panel'}), sub:L({gr:'Διάλεξε μηχανή, ταίριαξέ τη με ύλη — ή ανέβασε δική σου.',en:'Pick an engine, pair it with any material — or upload your own.'}) });
    const cats = ['Όλα','Ιλιάδα','Οδύσσεια','Γραμματική','Ιστορία','Λατινικά'];
    // (Game-mode block removed from the panel per owner request — game modes live
    //  on the subject/Live screens, not here.)
    // Curriculum browse — admin-authored content by στάδιο → τάξη → μάθημα → παιχνίδι
    body.appendChild(el('button',{class:'lv-cat lv-cat--custom sc-stagger', style:'width:100%;margin:0 0 16px;text-align:left', onclick:()=>{ if(window.SymCurriculum) SymCurriculum.openPanel(); else go('curriculum'); }},[
      el('div',{class:'lv-cat__b'},[
        el('span',{class:'lv-cat__t'}, L({gr:'Διάλεξε από την ύλη',en:'Browse by curriculum'})),
        el('span',{class:'lv-cat__m'}, L({gr:'Στάδιο → τάξη → μάθημα → παιχνίδι · περιεχόμενο διαχείρισης',en:'Stage → grade → subject → game · admin content'})) ]),
      el('span',{class:'lv-cat__n'},'→') ]));
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger', style:'margin-top:0'}, L({gr:'Μηχανές',en:'Engines'})));
    const filwrap = el('div',{class:'sc-fils sc-stagger'}, cats.map((c,i)=>chip(c,i===0)));
    body.appendChild(filwrap);
    // ── FULL engine catalogue ──
    // The panel must surface EVERY launchable game: the curated carousel
    // (SY.ENGINES) AND every registered Game-Panel engine (window.GP_ENGINES
    // — naumachia, phalanx, the whole PvP / engines pack, …). Build a merged,
    // de-duped list keyed by the openFn each tile resolves to via
    // synResolveLaunch, so nothing shows twice and every tile can launch.
    const _ALL_ENGINES = (function buildAllEngines(){
      const out = [], seen = new Set();
      function keyOf(t){
        return (window.synResolveLaunch && synResolveLaunch(t)) ||
               ('label:' + (t.en || t.gr || ''));
      }
      // 1) curated carousel first (keeps its hand-picked illu + meta + order)
      (SY.ENGINES || []).forEach(e => { out.push(e); seen.add(keyOf(e)); });
      // 2) every GP engine not already represented by a carousel tile
      (window.GP_ENGINES || []).forEach(g => {
        // map a GP engine record → a panel tile shape {gr,en,meta,illu,launch}
        const fn = (window.SYN_LAUNCH_MAP &&
                    (SYN_LAUNCH_MAP[g.id] || SYN_LAUNCH_MAP[g.label])) || null;
        const tile = {
          gr: g.label,
          en: g.subtitle || g.label,
          meta: { gr: g.subtitle || '', en: g.subtitle || '' },
          illu: g.illu || null,
          icon: g.icon || null,
          launch: fn ? { fn } : undefined
        };
        const k = fn ? fn : ('label:' + g.label);
        if (seen.has(k)) return;            // already shown via carousel
        seen.add(k);
        out.push(tile);
      });
      return out;
    })();

    body.appendChild(viewBar({ admin:true, left: el('span',{class:'sc-count'}, _ALL_ENGINES.length+' '+L({gr:'μηχανές',en:'engines'})) }));

    const list = ST().display==='list';
    const grid = el('div',{class:'sc-eng-grid'+(ST().display!=='grid'?' sc-eng-grid--'+ST().display:'')});
    grid.appendChild(el('button',{class:'sc-upload', onclick:()=>SymPreview.open('mc',{title:L({gr:'Νέο κουίζ',en:'New quiz'}), note:L({gr:'Ανέβασε CSV/JSON και γίνεται παιχνίδι.',en:'Upload CSV/JSON and it becomes a game.'})})},[ el('span',{class:'sc-upload__ic',html:'&#8682;'}),
      el('span',{},[ el('span',{class:'sc-upload__t'}, L({gr:'Ανέβασε δικό σου κουίζ',en:'Upload your own quiz'})), el('span',{class:'sc-upload__s'}, 'CSV · JSON · TSV') ]) ]));

    // favorites first, then saved order
    let items = _ALL_ENGINES.map((e,i)=>({ e, rid:'eng_'+i, a:SY.CLASSES[i%SY.CLASSES.length].accent }));
    const ordered = SymStore.order('gamepanel', items.map(x=>x.rid));
    items.sort((a,b)=> ordered.indexOf(a.rid)-ordered.indexOf(b.rid));
    items.sort((a,b)=> (SymStore.isFav(b.rid)?1:0)-(SymStore.isFav(a.rid)?1:0));
    // Engine-card icons: consistent line-art SVG everywhere. The curated SY.ENGINES
    // carry `illu`; the GP_ENGINES entries only carry an emoji `icon`, which looked
    // inconsistent next to the SVGs — map each to a known illu key (these all exist
    // in the _injectIllus registry), falling back to a neutral default.
    const GP_ILLU = {
      naumachia:'trident', heptapylos:'walls', invaders:'invader', labyrinth:'labyrinth',
      'myth-memory':'cards', phalanx:'shield-round', 'rapid-fire':'lightning-bolt', tow:'sword',
      'epic-puzzle':'timeline', dig:'amphora', mnemosyne:'lyre', blade:'sword', 'temple-run':'runner',
      'golden-fleece':'trireme', halieia:'trident', krypteia:'torch', hegemonia:'acropolis',
      toxotes:'helmet', agora:'column', discus:'wreath-laurel'
    };
    items.forEach(({e,rid,a})=>{
      grid.appendChild(el('a',{class:'sc-engc has-accent',href:'javascript:void 0','data-rid':rid,style:`--ca:${a}`,onclick:()=>go('level',{game:e, from:'gamepanel'})},[
        favBtn(rid),
        el('span',{class:'sc-engc__ban'},[ glyph(e.illu || GP_ILLU[e.id] || 'amphora','sc-engc__illu') ]),
        el('span',{class:'sc-engc__b'},[ el('span',{class:'sc-engc__t'}, L(e)), el('span',{class:'sc-engc__m'}, L(e.meta)) ]),
        el('span',{class:'sc-engc__tools'},[
          el('button',{class:'sc-engc__eye', title:'Preview', onclick:(ev)=>{ ev.preventDefault(); ev.stopPropagation(); SymPreview.open(SymPreview.typeFor(e),{title:L(e),illu:e.illu}); }, html:'&#128065;'}),
          (isAdmin()&&window.__symEdit)? el('span',{class:'sc-engc__drag',html:'⠿'}) : el('span',{class:'sc-engc__go',html:'&#9654;'}),
        ]),
      ]));
    });
    body.appendChild(grid);
    setTimeout(()=>attachReorder(grid,'gamepanel',()=>items.map(x=>x.rid)),0);
  };

  /* ══ 5 · LIVE ARENA ══ (host/join → config → lobby) */
  S.live = function(home, ctx){
    const accent = '#C23A2E';
    const step = (ctx.param && ctx.param.step) || 'choose';
    const cfg = (ctx.param && ctx.param.cfg) || { mode:'solo', teams:3, gmode:'classic', time:5, score:['standard'], count:10 };
    if(!Array.isArray(cfg.score)) cfg.score = [cfg.score || 'standard'];
    const body = P(home, { back:'home', accent, eyebrow:L({gr:'Ζωντανή Αρένα',en:'Live Arena'}),
      title: step==='lobby'?L({gr:'Λόμπι Μάχης',en:'Battle Lobby'}):L({gr:'Ζωντανή Μάχη',en:'Live Battle'}),
      sub: step==='lobby'?L({gr:'Οι μαθητές μπαίνουν με PIN ή QR.',en:'Students join with a PIN or QR.'}):L({gr:'Φιλοξένησε ή μπες σε αγώνα.',en:'Host or join a match.'}),
      actions: null });

    if(step==='choose'){
      const ch = el('div',{class:'sc-live2 sc-stagger'});
      // ── Host: launch the REAL Live Arena engine (Firestore live_arenas room
      //    → PIN → share → student join). openLiveArena() with no cfg opens the
      //    host/join picker (teachers) or the student join screen. This replaces
      //    the old mockup config/lobby flow (hardcoded PIN, fake players). ──
      ch.appendChild(el('button',{class:'sc-host', onclick:()=>openRealLiveArena()},[
        el('span',{class:'sc-host__ic'},[ glyph('crown-laurel','sc-gl') ]),
        el('span',{class:'sc-host__t'}, L({gr:'Φιλοξένησε',en:'Host'})),
        el('span',{class:'sc-host__d'}, L({gr:'Στήσε αγώνα για την τάξη σου',en:'Set up a match for your class'})),
      ]));
      const joinPin = el('input',{class:'sc-join2__pin',maxlength:'6',inputmode:'numeric',placeholder:'000000',
        oninput:(e)=>{ e.target.value = e.target.value.replace(/\D/g,''); }});
      ch.appendChild(el('div',{class:'sc-join2'},[
        el('span',{class:'sc-host__ic'},[ glyph('lightning-bolt','sc-gl') ]),
        el('span',{class:'sc-host__t'}, L({gr:'Μπες με PIN',en:'Join with PIN'})),
        el('div',{class:'sc-join2__form'},[ joinPin,
          el('button',{class:'sc-cta sc-cta--solid sc-cta--sm', onclick:()=>openRealLiveArena(joinPin.value)}, L({gr:'Μπες',en:'Join'})) ]),
      ]));
      // ── PvP · Ο Ἀγών — the standalone duel arena, surfaced here on Live
      //    (previously only reachable from the Game Panel; user: "on live I cannot see pvp").
      ch.appendChild(el('button',{class:'sc-host sc-host--pvp', onclick:()=>{ if(window.SymCurriculum) SymCurriculum.openForPvp(); else openPvPContentChooser(); }},[
        el('span',{class:'sc-host__ic'},[ glyph('crossed-swords','sc-gl') ]),
        el('span',{class:'sc-host__t'}, L({gr:'Ο Ἀγών · PvP',en:'The Agon · PvP'})),
        el('span',{class:'sc-host__d'}, L({gr:'Μονομαχίες μαθητών — διάλεξε ύλη & άνοιγμα Αρένας',en:'Student duels — pick content & open the Arena'})),
      ]));
      body.appendChild(ch);
      return;
    }

    if(step==='config'){
      const c = Object.assign({}, cfg); c.score = (cfg.score||['standard']).slice();
      const wrap = el('div',{class:'sc-cfg sc-stagger has-accent', style:`--ca:${accent}`});

      // ── GAME (loaded from the Game Panel) ──
      if(!c.game) c.game = (window.SYM.MPGAMES[0]);
      const gG = el('div',{class:'sc-cfg__g'});
      gG.appendChild(el('div',{class:'sc-cfg__l'}, L({gr:'Παιχνίδι',en:'Game'})));
      const gGrid = el('div',{class:'sc-gpick'});
      function paintGames(){
        gGrid.innerHTML='';
        window.SYM.MPGAMES.forEach(g=> gGrid.appendChild(el('button',{class:'sc-gpick__o'+(c.game&&c.game.id===g.id?' active':''), onclick:()=>{ c.game=g; paintGames(); }},[
          el('span',{class:'sc-gpick__ic','data-illu':g.illu}), el('span',{class:'sc-gpick__t'}, L(g)) ])));
        gGrid.appendChild(el('button',{class:'sc-gpick__o sc-gpick__o--more', onclick:()=>gamePanelPopup(g=>{ c.game=g; paintGames(); })},[
          el('span',{class:'sc-gpick__ic',html:'▦'}), el('span',{class:'sc-gpick__t'}, L({gr:'Επίλεξε άλλο…',en:'Select another…'})) ]));
        if(window.injectIllus) injectIllus(gGrid);
      }
      paintGames();
      gG.appendChild(gGrid); wrap.appendChild(gG);

      // ── CONTENT: pick existing level OR upload new ──
      const ctG = el('div',{class:'sc-cfg__g'});
      ctG.appendChild(el('div',{class:'sc-cfg__l'}, L({gr:'Περιεχόμενο',en:'Content'})));
      const ctSeg = el('div',{class:'sc-cfg__opts'});
      const ctBody = el('div',{class:'sc-content'});
      [{v:'existing',gr:'Υπάρχον επίπεδο',en:'Existing level'},{v:'upload',gr:'Νέο / ανέβασμα',en:'New / upload'}].forEach(o=> ctSeg.appendChild(el('button',{class:'sc-cfg__o'+((c.content||'existing')===o.v?' active':''), onclick:(e)=>{ c.content=o.v; ctSeg.querySelectorAll('.sc-cfg__o').forEach(b=>b.classList.remove('active')); e.currentTarget.classList.add('active'); paintContent(); }}, L(o))));
      ctG.appendChild(ctSeg); ctG.appendChild(ctBody); wrap.appendChild(ctG);
      function paintContent(){
        ctBody.innerHTML='';
        if((c.content||'existing')==='existing'){
          // pick a Class→Subject→Exercise→Level via a level-selection popup
          c.nav = c.nav || { grade:'Α΄ Γυμνασίου', subject:'Οδύσσεια', exercise:'Τρίβια', level:'Level 3', expl:{gr:'Νησιά & περιπέτειες — μεσαία δυσκολία',en:'Islands & adventures — medium'} };
          const card = el('div',{class:'sc-lvlsel'});
          function paintCard(){
            card.innerHTML='';
            card.appendChild(el('div',{class:'sc-lvlsel__b'},[
              el('div',{class:'sc-lvlsel__bc'}, c.nav.grade+' › '+c.nav.subject+' › '+c.nav.exercise),
              el('div',{class:'sc-lvlsel__lv'}, c.nav.level),
              el('div',{class:'sc-lvlsel__ex'}, L(c.nav.expl||{gr:'',en:''})),
            ]));
            card.appendChild(el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>levelPopup()}, L({gr:'Άλλαξε επίπεδο',en:'Change level'})));
          }
          function levelPopup(){
            const ov=el('div',{class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
            const box=el('div',{class:'sc-lvpop'});
            box.appendChild(el('div',{class:'sc-lvpop__bar'},[ el('span',{},'≣ '+L({gr:'Επιλογή επιπέδου',en:'Select level'})), el('button',{class:'pv-modal__x', onclick:()=>ov.remove(), html:'&times;'}) ]));
            const navrow=el('div',{class:'sc-lvpop__nav'});
            [['grade',{gr:'Τάξη',en:'Class'},['Α΄ Γυμνασίου','Β΄ Γυμνασίου','Γ΄ Γυμνασίου','Α΄ Λυκείου','Β΄ Λυκείου','Γ΄ Λυκείου']],
             ['subject',{gr:'Μάθημα',en:'Subject'},['Οδύσσεια','Ιλιάδα','Αρχαία','Ιστορία','Λατινικά']],
             ['exercise',{gr:'Άσκηση',en:'Exercise'},['Τρίβια','Κλίση ρημάτων','Λεξιλόγιο','Χρονολόγιο']]].forEach(([k,lab,opts])=>{
              navrow.appendChild(el('label',{class:'sc-nav-step'},[ el('span',{class:'sc-nav-step__l'}, L(lab)), el('select',{class:'sc-field__i sc-select', onchange:(e)=>{ c.nav[k]=e.target.value; }}, opts.map(o=>el('option',{selected:c.nav[k]===o?'selected':null}, o))) ]));
            });
            box.appendChild(navrow);
            box.appendChild(el('div',{class:'sc-lvpop__hd'}, L({gr:'Επίπεδα',en:'Levels'})));
            const LV=[ {n:'Level 1',e:{gr:'Εισαγωγή — βασικά γεγονότα',en:'Intro — basic facts'}},
                       {n:'Level 2',e:{gr:'Ήρωες & χαρακτήρες',en:'Heroes & characters'}},
                       {n:'Level 3',e:{gr:'Νησιά & περιπέτειες — μεσαία δυσκολία',en:'Islands & adventures — medium'}},
                       {n:'Level 4',e:{gr:'Βαθιά ανάλυση — δύσκολο',en:'Deep analysis — hard'}},
                       {n:'Όλα',e:{gr:'Όλα τα επίπεδα μαζί',en:'All levels combined'}} ];
            const list=el('div',{class:'sc-lvpop__list'});
            LV.forEach((lv,i)=> list.appendChild(el('button',{class:'sc-lvpop__row'+(c.nav.level===lv.n?' on':''), onclick:()=>{ c.nav.level=lv.n; c.nav.expl=lv.e; ov.remove(); paintCard(); }},[
              el('span',{class:'sc-lvpop__n'}, i<2?'✓':String(i+1)),
              el('span',{class:'sc-lvpop__t'},[ el('b',{}, lv.n), el('span',{class:'sc-lvpop__e'}, L(lv.e)) ]),
              el('span',{class:'sc-lvpop__go', onclick:(ev)=>{ ev.stopPropagation(); SymPreview.open('mc',{title:lv.n+' · '+c.nav.subject}); }, html:'&#128065;'}),
            ])));
            box.appendChild(list);
            ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
            requestAnimationFrame(()=>ov.classList.add('in'));
            if(window.gsap) gsap.from(box,{y:20,scale:.97,autoAlpha:0,duration:.35,ease:'back.out(1.5)'});
          }
          paintCard();
          ctBody.appendChild(card);
        } else {
          // upload + questions count
          const qLab = el('div',{class:'sc-cfg__l', style:'margin-top:4px'},[ L({gr:'Αριθμός ερωτήσεων',en:'Number of questions'}), el('b',{class:'sc-cfg__val', id:'cfgQ'}, String(c.count)) ]);
          const qInput = el('input',{class:'sc-slider', type:'range', min:'1', max:'100', step:'1', value:String(c.count)});
          qInput.addEventListener('input', ()=>{ c.count=+qInput.value; document.getElementById('cfgQ').textContent=String(c.count); fillSlider(qInput); });
          ctBody.appendChild(qLab); ctBody.appendChild(qInput);
          ctBody.appendChild(el('div',{class:'sc-upl'},[
            el('button',{class:'sc-upl__b', onclick:()=>SymPreview.open('mc',{title:L({gr:'Το αρχείο σου',en:'Your file'}), note:L({gr:'Ανέβασε CSV/JSON και γίνεται παιχνίδι.',en:'Upload CSV/JSON and it becomes a game.'})})},[ el('span',{html:'⬆ '}), L({gr:'Ανέβασε το αρχείο σου',en:'Upload your file'}) ]),
            el('button',{class:'sc-upl__b sc-upl__b--ghost'},[ el('span',{html:'⬇ '}), L({gr:'Κατέβασε πρότυπο',en:'Download template'}) ]),
          ]));
          setTimeout(()=>fillSlider(qInput),0);
        }
      }
      paintContent();

      // ── participation: Solo / Teams (+ team count) ──
      const partG = el('div',{class:'sc-cfg__g'});
      partG.appendChild(el('div',{class:'sc-cfg__l'}, L({gr:'Παίκτες',en:'Players'})));
      const partRow = el('div',{class:'sc-cfg__opts'});
      const teamStepper = el('div',{class:'sc-stepper'+(c.mode==='team'?'':' off')});
      [{v:'solo',gr:'Μόνος',en:'Solo'},{v:'team',gr:'Ομάδες',en:'Teams'}].forEach(o=> partRow.appendChild(el('button',{class:'sc-cfg__o'+(c.mode===o.v?' active':''), onclick:(e)=>{ c.mode=o.v; partRow.querySelectorAll('.sc-cfg__o').forEach(b=>b.classList.remove('active')); e.currentTarget.classList.add('active'); teamStepper.classList.toggle('off', o.v!=='team'); }}, L(o))));
      // team count stepper
      const tval = el('b',{}, String(c.teams));
      teamStepper.appendChild(el('button',{class:'sc-stepper__b', onclick:()=>{ c.teams=Math.max(2,c.teams-1); tval.textContent=String(c.teams); }}, '−'));
      teamStepper.appendChild(el('span',{class:'sc-stepper__v'},[ tval, ' ', el('small',{}, L({gr:'ομάδες',en:'teams'})) ]));
      teamStepper.appendChild(el('button',{class:'sc-stepper__b', onclick:()=>{ c.teams=Math.min(6,c.teams+1); tval.textContent=String(c.teams); }}, '+'));
      partRow.appendChild(teamStepper);
      partG.appendChild(partRow); wrap.appendChild(partG);

      // ── time slider (1–60 min) ──
      const timeG = el('div',{class:'sc-cfg__g'});
      const timeLab = el('div',{class:'sc-cfg__l'},[ L({gr:'Χρόνος παιχνιδιού',en:'Game time'}), el('b',{class:'sc-cfg__val', id:'cfgTime'}, c.time+' '+L({gr:'λεπτά',en:'min'})) ]);
      timeG.appendChild(timeLab);
      const timeInput = el('input',{class:'sc-slider', type:'range', min:'1', max:'60', step:'1', value:String(c.time)});
      timeInput.addEventListener('input', ()=>{ c.time=+timeInput.value; document.getElementById('cfgTime').textContent=c.time+' '+L({gr:'λεπτά',en:'min'}); fillSlider(timeInput); });
      timeG.appendChild(timeInput); wrap.appendChild(timeG);

      // ── scoring (multi-select) ──
      const scoreG = el('div',{class:'sc-cfg__g'});
      scoreG.appendChild(el('div',{class:'sc-cfg__l'},[ L({gr:'Βαθμολογία',en:'Scoring'}), el('span',{class:'sc-cfg__hint'}, L({gr:'(πολλαπλή επιλογή)',en:'(multi-select)'})) ]));
      const scoreRow = el('div',{class:'sc-cfg__opts'});
      [{v:'standard',gr:'Κανονική',en:'Standard'},{v:'speed',gr:'Ταχύτητα',en:'Speed bonus'},{v:'streak',gr:'Σερί',en:'Streak'}].forEach(o=> scoreRow.appendChild(el('button',{class:'sc-cfg__o sc-cfg__o--multi'+(c.score.indexOf(o.v)>=0?' active':''), onclick:(e)=>{ const i=c.score.indexOf(o.v); if(i>=0){ if(c.score.length>1) c.score.splice(i,1); } else c.score.push(o.v); e.currentTarget.classList.toggle('active', c.score.indexOf(o.v)>=0); }}, [ el('span',{class:'sc-cfg__chk'}), L(o) ])));
      scoreG.appendChild(scoreRow); wrap.appendChild(scoreG);

      wrap.appendChild(el('div',{class:'sc-cfg__foot'},[
        el('button',{class:'sc-cta sc-cta--ghost sc-cta--sm', onclick:()=>go('live',{step:'choose'})}, L({gr:'← Πίσω',en:'← Back'})),
        el('button',{class:'sc-cta sc-cta--solid', onclick:()=>go('live',{step:'lobby',cfg:c})},[ L({gr:'Δημιουργία λόμπι',en:'Create lobby'}), el('span',{html:' &rarr;'}) ]),
      ]));
      body.appendChild(wrap);
      setTimeout(()=>{ fillSlider(timeInput); },0);
      function fillSlider(inp){ const p=(inp.value-inp.min)/(inp.max-inp.min)*100; inp.style.background=`linear-gradient(90deg, var(--ca) ${p}%, var(--sink) ${p}%)`; }

      // popup that loads the Game Panel to pick any game
      function gamePanelPopup(onpick){
        const ov=el('div',{class:'pv-overlay', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
        const box=el('div',{class:'sc-gpop'});
        box.appendChild(el('div',{class:'sc-gpop__bar'},[ el('span',{},'▦ '+L({gr:'Πίνακας Παιχνιδιών',en:'Game Panel'})), el('button',{class:'pv-modal__x', onclick:()=>ov.remove(), html:'&times;'}) ]));
        box.appendChild(el('input',{class:'sc-search', placeholder:L({gr:'Αναζήτηση παιχνιδιού…',en:'Search game…'}), oninput:(e)=>{ const q=e.target.value.toLowerCase(); box.querySelectorAll('.sc-gpop__c').forEach(n=>{ n.style.display=n.textContent.toLowerCase().includes(q)?'':'none'; }); }}));
        const grid=el('div',{class:'sc-gpop__grid'});
        window.SYM.ENGINES.concat(window.SYM.MPGAMES).forEach(g=> grid.appendChild(el('button',{class:'sc-gpop__c', onclick:()=>{ onpick(g); ov.remove(); }},[ el('span',{class:'sc-gpop__ic','data-illu':g.illu}), el('span',{}, L(g)) ])));
        box.appendChild(grid);
        ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
        if(window.injectIllus) injectIllus(ov);
        requestAnimationFrame(()=>ov.classList.add('in'));
        if(window.gsap) gsap.from(box,{y:20,scale:.97,autoAlpha:0,duration:.35,ease:'back.out(1.5)'});
      }
      return;
    }

    // ── lobby → launch the REAL Live Arena ──────────────────────────────
    // This step previously rendered a static mockup (hardcoded PIN "A7K92M",
    // fake QR, fake player list) that did nothing. Now it boots the real
    // LiveArena engine (Firestore live_arenas → real PIN + QR + live players),
    // and shows a brief opening panel with a manual fallback in case the
    // engine is still loading.
    // NOTE: the config step's cfg (game/level/teams/time/scoring) is NOT
    // forwarded here — the real LiveArena engine owns its own host picker
    // where the teacher configures the round (and prompts sign-in for
    // signed-out users). We therefore do NOT render a recap of those values,
    // which the engine would otherwise silently drop.
    const wrap = el('div',{class:'sc-live sc-stagger'});
    wrap.appendChild(el('div',{class:'sc-live__join', style:'text-align:center'},[
      el('div',{class:'sc-live__url'},[ el('span',{class:'sc-live__urll'},L({gr:'Άνοιγμα Ζωντανής Αρένας…',en:'Opening Live Arena…'})) ]),
      el('button',{class:'sc-cta sc-cta--solid', style:'margin-top:14px', onclick:()=>openRealLiveArena()},[
        glyph('lightning-bolt','sc-cta__gl'), L({gr:'Άνοιξε την Αρένα',en:'Open the Arena'}) ]),
    ]));
    body.appendChild(wrap);
    // Auto-open the real engine on entering the lobby step.
    setTimeout(()=>openRealLiveArena(), 0);
  };

  /* ══ 6 · HERO PROFILE ══ */
  S.profile = function(home, ctx){
    const accent = '#7C5AC2';
    const body = P(home, { back:'home', accent, eyebrow:L({gr:'Ο Ήρωάς μου',en:'My Hero'}), title:L({gr:'Προφίλ',en:'Profile'}) });
    // ── Live profile: bound to the signed-in user + real progression ──
    // A brand-new (or signed-out) user therefore shows their own name and
    // zeroed stats — never the old hardcoded "Ὀδυσσεύς / Lv.12 / 142 games".
    const prog = (typeof getProgression === 'function' && getProgression()) || {};
    const xp = Math.max(0, Math.round(prog.xp || 0));
    const HEROLV = Math.max(0, prog.level != null ? prog.level
      : (typeof _hjLevel === 'function' ? _hjLevel(xp) : 0));
    // level L spans xp ∈ [100·L², 100·(L+1)²) under _hjLevel = floor(√(xp/100))
    const lvBase = 100 * HEROLV * HEROLV;
    const lvNext = 100 * (HEROLV + 1) * (HEROLV + 1);
    const lvPct  = lvNext > lvBase ? Math.min(100, Math.max(0, Math.round((xp - lvBase) / (lvNext - lvBase) * 100))) : 0;
    const fmt = n => Number(n || 0).toLocaleString('el-GR');
    const u = (typeof currentUser !== 'undefined') ? currentUser : null;
    const heroName = (u && (u.displayName || (u.email ? u.email.split('@')[0] : null)))
      || L({gr:'Ήρωας',en:'Hero'});
    const st = prog.stats || {};
    const eqId = SymStore.get('avatar', 'av-athena');
    const eqAv = SY.AVATARS.find(a=>a.id===eqId) || SY.AVATARS[0];
    const eqTitleId = SymStore.get('title', 't-rhetor');
    const eqTitle = (SY.TITLES.find(t=>t.id===eqTitleId)) || SY.TITLES[2];
    const card = el('div',{class:'sc-prof sc-stagger has-accent', style:`--ca:${accent}`});
    card.appendChild(el('div',{class:'sc-prof__hero'},[
      el('button',{class:'sc-prof__ring sc-prof__ring--btn', title:L({gr:'Άλλαξε avatar',en:'Change avatar'}), onclick:()=>avatarPicker()},[ el('span',{class:'sc-prof__seal','data-illu':eqAv.illu}), el('span',{class:'sc-prof__lvl'}, String(HEROLV)), el('span',{class:'sc-prof__edit',html:'✎'}) ]),
      el('div',{class:'sc-prof__id'},[
        el('h2',{class:'sc-prof__name'}, heroName),
        el('button',{class:'sc-prof__title sc-prof__title--btn', onclick:()=>titlePicker()},[ glyph('crown-laurel','sc-gl'), el('span',{}, L(eqTitle)), el('span',{class:'sc-prof__tedit',html:'✎'}) ]),
        el('div',{class:'sc-xp'},[ el('div',{class:'sc-xp__bar'},[el('span',{class:'sc-xp__fill',style:'width:'+lvPct+'%'})]), el('span',{class:'sc-xp__t'}, fmt(xp)+' / '+fmt(lvNext)+' XP') ]),
      ]),
    ]));
    card.appendChild(el('div',{class:'sc-prof__stats'},[ stat(fmt(st.sessions||0),L({gr:'Παιχνίδια',en:'Games'}),accent), stat(Math.round(st.accuracy||0)+'%',L({gr:'Ακρίβεια',en:'Accuracy'}),accent), stat(fmt(st.bestStreak||0),L({gr:'Σερί',en:'Streak'}),accent), stat(fmt(st.wins||0),L({gr:'Νίκες Live',en:'Live wins'}),accent) ]));
    body.appendChild(card);

    function titlePicker(){
      const ov=el('div',{class:'acro-ov', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
      const box=el('div',{class:'acro-box', style:'max-width:440px'});
      box.appendChild(el('div',{class:'acro-box__bar'},[
        el('div',{class:'acro-box__ttl'},[ glyph('crown-laurel','acro-box__ic'), L({gr:'Τίτλοι Ήρωα',en:'Hero Titles'}) ]),
        el('span',{class:'av-lv'}, 'Lv. '+HEROLV),
        el('button',{class:'acro-box__x', onclick:()=>ov.remove(), html:'&times;'}),
      ]));
      const list=el('div',{class:'ttl-list'});
      SY.TITLES.forEach(t=>{
        const locked = HEROLV < t.lv, eq = SymStore.get('title','t-rhetor')===t.id;
        list.appendChild(el('button',{class:'ttl-row'+(locked?' locked':'')+(eq?' eq':''), onclick:()=>{ if(locked) return; SymStore.set('title',t.id); ov.remove(); symRender(); }},[
          el('span',{class:'ttl-row__ic'},[ glyph(locked?'column':'crown-laurel','sc-gl') ]),
          el('span',{class:'ttl-row__b'},[ el('span',{class:'ttl-row__nm'}, L(t)), el('span',{class:'ttl-row__en'}, t.en) ]),
          locked? el('span',{class:'ttl-row__lock'}, '🔒 Lv.'+t.lv) : (eq? el('span',{class:'ttl-row__on'}, '✓') : el('span',{class:'ttl-row__use'}, L({gr:'Επίλεξε',en:'Equip'}))),
        ]));
      });
      box.appendChild(list);
      ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
      if(window.injectIllus) injectIllus(ov);
      requestAnimationFrame(()=>ov.classList.add('in'));
      if(window.gsap) gsap.from(box,{y:24,scale:.97,autoAlpha:0,duration:.4,ease:'back.out(1.5)'});
    }

    function avatarPicker(){
      const ov=el('div',{class:'acro-ov', onclick:(e)=>{ if(e.target===ov) ov.remove(); }});
      const box=el('div',{class:'acro-box'});
      box.appendChild(el('div',{class:'acro-box__bar'},[
        el('div',{class:'acro-box__ttl'},[ glyph('owl','acro-box__ic'), L({gr:'Η Αγορά των Ηρώων',en:'The Hero’s Agora'}) ]),
        el('span',{class:'av-lv'}, 'Lv. '+HEROLV),
        el('button',{class:'acro-box__x', onclick:()=>ov.remove(), html:'&times;'}),
      ]));
      SY.AVATAR_CATS.forEach(cat=>{
        box.appendChild(el('div',{class:'sc-sec-lbl', style:'margin:10px 16px 6px'}, L(cat.t)));
        const grid=el('div',{class:'av-grid'});
        SY.AVATARS.filter(a=>a.cat===cat.k).forEach(a=>{
          const locked = HEROLV < a.lv, eq = SymStore.get('avatar','av-athena')===a.id;
          grid.appendChild(el('button',{class:'av-seal'+(locked?' locked':'')+(eq?' eq':''), title:L(a)+(locked?' · Lv.'+a.lv:''), onclick:()=>{ if(locked) return; SymStore.set('avatar',a.id); ov.remove(); symRender(); }},[
            el('span',{class:'av-seal__art','data-illu':a.illu}),
            locked? el('span',{class:'av-seal__lock'}, '🔒 '+a.lv) : el('span',{class:'av-seal__nm'}, L(a)),
          ]));
        });
        box.appendChild(grid);
      });
      ov.appendChild(box); document.querySelector('.stage').appendChild(ov);
      if(window.injectIllus) injectIllus(ov);
      requestAnimationFrame(()=>ov.classList.add('in'));
      if(window.gsap) gsap.from(box,{y:24,scale:.97,autoAlpha:0,duration:.4,ease:'back.out(1.5)'});
    }
    body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger'}, L({gr:'Παράσημα',en:'Badges'})));
    const badges = [['trophy','Πρωταθλητής'],['medal','Άριστα'],['wreath','Νικητής'],['owl','Σοφός'],['flame','Σερί 20'],['star-streak','Πρώτος'],['shield-round','Αμυντικός'],['lightning-bolt','Ταχύς']];
    body.appendChild(el('div',{class:'sc-badges sc-stagger'}, badges.map((b,i)=>el('div',{class:'sc-badge'+(i>5?' locked':''),style:`--ca:${accent}`},[ glyph(b[0],'sc-badge__gl'), el('span',{class:'sc-badge__t'}, b[1]) ]))));

    // ── Ζωφόρος (Λογοτεχνία) — real progress from the voyage games ──
    if(window.SymVoyage){
      const vs = SymVoyage.summary();
      body.appendChild(el('div',{class:'sc-sec-lbl sc-stagger', style:`margin-top:6px`}, L({gr:'Ζωφόρος · Λογοτεχνία',en:'Frieze · Literature'})));
      if(vs.totalAnswered>0){
        body.appendChild(el('div',{class:'sc-loadout sc-stagger', style:'margin:0 0 8px'},[
          el('b',{}, String(vs.totalAnswered)), ' '+L({gr:'σωστές απαντήσεις · ',en:'correct · '}),
          el('b',{}, String(vs.worksStarted)+'/'+vs.works.length), ' '+L({gr:'έργα ξεκινημένα',en:'works started'}) ]));
      }
      const vgrid = el('div',{class:'sc-voyworks sc-stagger has-accent', style:`--ca:${accent}`});
      vs.works.forEach(w=>{
        vgrid.appendChild(el('button',{class:'sc-voywork'+(w.started?' on':''), title:L({gr:'Άνοιξε',en:'Open'}),
          onclick:()=>{ if(window.SymVoyage) SymVoyage.open(w.slug, false); }},[
          el('span',{class:'sc-voywork__ic','data-illu':w.illu}),
          el('span',{class:'sc-voywork__b'},[
            el('span',{class:'sc-voywork__nm'}, w.gr),
            el('span',{class:'sc-voywork__m'}, w.started ? (w.answered+' ✓ · '+w.stations+' '+L({gr:'σταθμοί',en:'stations'})) : L({gr:'Δεν ξεκίνησε',en:'Not started'})) ]),
          el('span',{class:'sc-voywork__go',html: w.started?'▸':'○'}) ]));
      });
      body.appendChild(vgrid);
    }
  };

  /* ══ 7 · LEVEL UP ══ */
  S.levelup = function(home, ctx){
    const accent = '#E0B24C';
    const lv = 13;
    const entry = (window.SYM.rewardsForLevel ? window.SYM.rewardsForLevel(lv) : null) || { title:{gr:'Hero',en:'Hero of the Iliad'}, rewards:[] };
    const sec = el('section',{class:'sc-lu has-accent', style:`--ca:${accent}`});
    sec.appendChild(el('button',{class:'sc-lu__close', onclick:()=>go('profile'), html:'&times;'}));
    sec.appendChild(el('div',{class:'sc-lu__burst'}));
    sec.appendChild(el('div',{class:'sc-lu__in'},[
      el('div',{class:'sc-lu__eyebrow'}, L({gr:'ΑΝΕΒΗΚΕΣ ΕΠΙΠΕΔΟ',en:'LEVEL UP'})),
      el('div',{class:'sc-lu__ring'},[ glyph('wreath','sc-lu__wreath'), el('span',{class:'sc-lu__num'}, String(lv)) ]),
      el('h1',{class:'sc-lu__ttl'}, L(entry.title)),
      el('p',{class:'sc-lu__sub'}, L({gr:'Ξεκλείδωσες νέες ανταμοιβές.',en:'You unlocked new rewards.'})),
      el('div',{class:'sc-lu__rewards'},
        (entry.rewards||[]).map(r=>el('div',{class:'sc-lu__reward'},[ el('span',{class:'sc-lu__ric'}, r.ic||'\u2726'), L(r.t) ]))),
      el('div',{class:'sc-lu__btns'},[
        el('button',{class:'sc-cta sc-cta--ghost', onclick:()=>go('temple')}, L({gr:'Στον Ναό',en:'To Temple'})),
        el('button',{class:'sc-cta sc-cta--solid', onclick:()=>go('profile')}, L({gr:'Συνέχεια',en:'Continue'})),
      ]),
    ]));
    home.appendChild(sec);
    if (window.gsap) {
      const r = sec.querySelector('.sc-lu__burst');
      for(let i=0;i<22;i++){ const s=document.createElement('span'); s.className='sc-spark'; r.appendChild(s);
        const a=Math.random()*Math.PI*2, d=80+Math.random()*180;
        gsap.set(s,{x:0,y:0}); gsap.to(s,{x:Math.cos(a)*d,y:Math.sin(a)*d,opacity:0,scale:0.3,duration:1+Math.random()*0.6,ease:'power2.out',delay:0.1,repeat:-1,repeatDelay:0.6}); }
      gsap.from(sec.querySelector('.sc-lu__ring'),{scale:0,rotate:-40,duration:0.9,ease:'back.out(1.6)'});
      gsap.from(sec.querySelectorAll('.sc-lu__reward'),{y:18,autoAlpha:0,stagger:0.12,delay:0.5,duration:0.5});
    }
  };

  window.SYM_SCREENS = S;
  window.SYM_SCREENS_HELPERS = { glyph, pill, stat, chip, favBtn, viewBar, editable, attachReorder, defaults, SITE, isAdmin };
})();
