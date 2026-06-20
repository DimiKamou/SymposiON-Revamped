/* ════════════════════════════════════════════════════════════════════
   study-kit.js — window.SK: the AI grading service + review renderer
   Shared by all AI-graded methods (Ανάπτυξη, Ορισμοί, Πηγή, Σ/Λ, Σύγκριση,
   Test, Διαγώνισμα). SK.grade() POSTs the structured fields to the backend
   (/api/gradeAnswer → Firebase Function, which holds the API key and builds
   the exact prompt). On any failure it degrades to an offline token-overlap
   heuristic, flagged in the UI. The semantic JSON contract is per the README:
   { score, verdict, feedback, covered[], missed[], wrong[] }.
   .sk-* component styles live in css/istoria.css. Requires sym-icons.js.
   ════════════════════════════════════════════════════════════════════ */
(function(){

  // The grader Function now requires a Firebase ID token (denial-of-wallet
  // guard). This kit runs in the same-origin istoria iframe, so it can read
  // the signed-in user's token from the parent window's Firebase. Signed-out
  // users send no token → the Function returns 401 → we fall back to local().
  async function _idToken(){
    try{
      const fb = (window.parent && window.parent.firebase) || window.firebase;
      if (fb && fb.auth && fb.auth().currentUser) return await fb.auth().currentUser.getIdToken();
    }catch(_){/* cross-frame / not signed in */}
    return null;
  }

  // ── AI grader ──────────────────────────────────────────────────────
  async function grade(p){
    // p: { question, model, points[], answer, rubric?, subject? }
    // subject sets the grader persona server-side (defaults to Ιστορία) —
    // pass it when reusing SK for other subjects (αρχαία, λογοτεχνία, …).
    try{
      const tok = await _idToken();
      const headers = {'Content-Type':'application/json'};
      if (tok) headers['Authorization'] = 'Bearer ' + tok;
      const resp = await fetch(SK.endpoint, {
        method:'POST',
        headers:headers,
        body:JSON.stringify({
          question:p.question||'', model:p.model||'',
          points:p.points||[], answer:p.answer||'', rubric:p.rubric||'',
          subject:p.subject||'',
        }),
      });
      if(resp.ok){
        const r = await resp.json();
        if(r && typeof r.score!=='undefined'){ r.demo=false; return r; }
      }
    }catch(e){/* network / offline → fall through */}
    const r = local(p); r.demo=true; return r;
  }

  // offline fallback: token-overlap heuristic so the UI still works
  function local(p){
    const norm=s=>(s||'').toLowerCase().replace(/[^\wά-ώα-ωΆ-Ώ\s]/g,' ');
    const aw=new Set(norm(p.answer).split(/\s+/).filter(w=>w.length>3));
    const cov=[],mis=[];
    (p.points||[]).forEach(pt=>{ const kws=norm(pt).split(/\s+/).filter(w=>w.length>3);
      const hit=kws.filter(k=>[...aw].some(w=>w.includes(k.slice(0,5))||k.includes(w.slice(0,5)))).length;
      (hit>=Math.max(1,Math.ceil(kws.length*0.34))?cov:mis).push(pt); });
    const score=(p.points&&p.points.length)?Math.round(cov.length/p.points.length*100):50;
    return {score,verdict:score>=75?'Πολύ καλά':score>=45?'Καλή προσπάθεια':'Χρειάζεται δουλειά',
      feedback:score>=75?'Κάλυψες τα περισσότερα βασικά σημεία.':'Ξαναδιάβασε τα σημεία που λείπουν και συμπλήρωσε.',
      covered:cov,missed:mis,wrong:[]};
  }

  // ── review renderer ────────────────────────────────────────────────
  function scoreColor(s){ return s>=75?'var(--sage)':s>=45?'var(--gold)':'var(--terra)'; }
  const esc=(x)=>String(x==null?'':x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  function li(arr,empty){ return (arr&&arr.length)?arr.map(x=>`<li>${esc(x)}</li>`).join(''):`<li class="none">${esc(empty)}</li>`; }

  function reviewHTML(r, you, model, opts){
    opts=opts||{};
    const sc=Math.max(0,Math.min(100,r.score|0));
    const wrong=(r.wrong||[]).filter(Boolean);
    return `<div class="sk-score">
        <div class="sk-ring" style="--p:${sc};--rc:${scoreColor(sc)}"><b>${sc}</b><small>/100</small></div>
        <div class="sk-verdict"><div class="vt">${esc(r.verdict)}</div><div class="fb">${esc(r.feedback)}</div></div>
      </div>
      <div class="sk-lists">
        <div class="lcard cov"><h3>${esc(opts.covLabel||'Τι κάλυψες σωστά')}</h3><ul>${li(r.covered,'—')}</ul></div>
        <div class="lcard mis"><h3>${esc(opts.misLabel||'Τι έλειπε / να προσθέσεις')}</h3><ul>${li(r.missed,'Τίποτα ουσιώδες — μπράβο!')}</ul></div>
      </div>
      ${wrong.length?`<div class="lcard wr" style="margin-top:16px;"><h3>Προσοχή — ανακρίβειες</h3><ul>${li(wrong,'')}</ul></div>`:''}
      <div class="sk-cmp">
        <div class="acol you"><div class="lab">${esc(opts.youLabel||'Η απάντησή σου')}</div><div class="abody">${esc(you)}</div></div>
        <div class="acol model"><div class="lab">${esc(opts.modelLabel||'Ενδεικτική απάντηση')}</div><div class="abody">${esc(model)}</div></div>
      </div>
      <div class="sk-note">${r.demo?'⚠ Λειτουργία επίδειξης (offline): αξιολόγηση με τοπικό αλγόριθμο. Στο ζωντανό περιβάλλον τη βαθμολόγηση κάνει ο AI βοηθός.':'Αξιολόγηση από τον AI βοηθό · σημασιολογική σύγκριση.'}</div>`;
  }

  window.SK = { grade, reviewHTML, scoreColor, icon:(n)=>SYM.icon(n), endpoint:'/api/gradeAnswer' };
})();
