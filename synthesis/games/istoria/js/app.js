/* ════════════════════════════════════════════════════════════════════
   app.js — bootstrap for the Ιστορία panel
   Resolves the course from the URL, applies the persisted direction
   (ΑΤΛΑΣ ⇄ ΑΓΩΝ — a single body class), wires the toggle, paints the
   static ΑΓΩΝ HUD + section ornaments, and inits the hub.
   ════════════════════════════════════════════════════════════════════ */
(function(){
  const $  = (s)=>document.querySelector(s);
  const $$ = (s)=>[...document.querySelectorAll(s)];

  // ── direction (persisted under istoria-dir) ──
  function setDir(d){
    document.body.classList.remove('dir-atlas','dir-agon');
    document.body.classList.add(d);
    $$('.dir-toggle button').forEach(b=>b.classList.toggle('on', b.dataset.d===d));
    const wm = $('#mast h1'); if(wm) wm.textContent = (d==='dir-agon') ? 'ΑΓΩΝ' : 'ΑΤΛΑΣ';
    ISTORIA.setDir(d);
  }
  window.setIstoriaDir = setDir;

  function boot(){
    const course = ISTORIA.resolveCourse();
    // Optional ?unit= scopes the hub to one exam theme (opened from a split tile).
    let unit = null;
    try { unit = new URLSearchParams(location.search).get('unit') || null; } catch(_){}

    // direction toggle icons
    $$('.dir-toggle [data-ic-atlas]').forEach(e=>e.innerHTML=SYM.icon('amphora'));
    $$('.dir-toggle [data-ic-agon]').forEach(e=>e.innerHTML=SYM.icon('flame'));
    setDir(ISTORIA.getDir('dir-atlas'));

    // section-label ornaments
    if($('#lab1')) $('#lab1').innerHTML = SYM.icon('column');
    if($('#lab2')) $('#lab2').innerHTML = SYM.icon('lyre');

    // meander dividers
    $$('.meander').forEach(m=>{ m.style.backgroundImage = SYM.meanderBG('#74601C'); });

    if(window.MT) MT.init(course);   // AI methods must know the course before the hub renders its §Γ
    if(window.TT) TT.init(course);   // timed exams (§Δ)
    HUB.init(course, unit);
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
