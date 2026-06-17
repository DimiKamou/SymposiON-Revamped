// ============================================================
//  NOUN FILL-IN-ENDING GAME  (Α΄ + Β΄ Κλίση)
//  Shows the noun, asks user to type the ending for given case/number
//  Depends on: ousiastika/data.js (OUS_DB), shared-engine.js (gramBuildKeyboard etc.)
// ============================================================

let nFillState = null;

const CASE_NAMES = ["Ονομαστική","Γενική","Δοτική","Αιτιατική","Κλητική"];

const DECL_ENDINGS = {
  'α_θηλ':  {sg:['α','ας','ᾳ','αν','α'],   pl:['αι','ῶν','αις','ας','αι']},
  'η_θηλ':  {sg:['η','ης','ῃ','ην','η'],   pl:['αι','ῶν','αις','ας','αι']},
  'ας_αρσ': {sg:['ας','ου','ᾳ','αν','α'],  pl:['αι','ῶν','αις','ας','αι']},
  'ης_αρσ': {sg:['ης','ου','ῃ','ην','η'],  pl:['αι','ῶν','αις','ας','αι']},
  'ος_αρσ': {sg:['ος','ου','ῳ','ον','ε'],  pl:['οι','ων','οις','ους','οι']},
  'ος_θηλ': {sg:['ος','ου','ῳ','ον','ε'],  pl:['οι','ων','οις','ους','οι']},
  'ον_ουδ': {sg:['ον','ου','ῳ','ον','ον'], pl:['α','ων','οις','α','α']},
};

// group + desc added so the shared two-pane picker (gramBuildLevelGrid) can
// render this screen identically to the other grammar games (Συνηρημένα etc.).
// `label` kept as the legacy alias (== desc) for any older reader.
const DECL_LEVELS = [
  {id:1, group:'Α΄ Κλίση', desc:"Θηλυκά σε -α (χώρα, θάλασσα)", label:"Α΄ Κλίση — Θηλυκά σε -α (χώρα, θάλασσα)", filter:{d:1, gender:'θηλυκό', ending:'α'}, color:'lgreen'},
  {id:2, group:'Α΄ Κλίση', desc:"Θηλυκά σε -η (τιμή, νίκη)",   label:"Α΄ Κλίση — Θηλυκά σε -η (τιμή, νίκη)",   filter:{d:1, gender:'θηλυκό', ending:'η'}, color:'lgreen'},
  {id:3, group:'Α΄ Κλίση', desc:"Αρσενικά σε -ας (νεανίας)",    label:"Α΄ Κλίση — Αρσενικά σε -ας (νεανίας)",    filter:{d:1, gender:'αρσενικό', ending:'ας'}, color:'lyellow'},
  {id:4, group:'Α΄ Κλίση', desc:"Αρσενικά σε -ης (πολίτης)",    label:"Α΄ Κλίση — Αρσενικά σε -ης (πολίτης)",    filter:{d:1, gender:'αρσενικό', ending:'ης'}, color:'lyellow'},
  {id:5, group:'Α΄ Κλίση', desc:"Α΄ Κλίση — Όλα",               label:"Α΄ Κλίση — Όλα",                           filter:{d:1}, color:'lred'},
  {id:6, group:'Β΄ Κλίση', desc:"Αρσ./Θηλ. σε -ος (λόγος, νόσος)", label:"Β΄ Κλίση — Αρσ./Θηλ. σε -ος (λόγος, νόσος)", filter:{d:2, gender:'αρσενικό|θηλυκό'}, color:'lgreen'},
  {id:7, group:'Β΄ Κλίση', desc:"Ουδέτερα σε -ον (δῶρον)",      label:"Β΄ Κλίση — Ουδέτερα σε -ον (δῶρον)",      filter:{d:2, gender:'ουδέτερο'}, color:'lyellow'},
  {id:8, group:'Β΄ Κλίση', desc:"Β΄ Κλίση — Όλα",               label:"Β΄ Κλίση — Όλα",                           filter:{d:2}, color:'lred'},
  {id:9, group:'Συνδυαστικό', desc:"Α΄ + Β΄ Κλίση — Όλα μαζί",  label:"Α΄ + Β΄ Κλίση — Όλα μαζί",                 filter:{d:12}, color:'lred'},
];

function openNounFill() {
  document.getElementById('noun-fill-overlay').style.display = 'flex';
  document.body.style.overflow = 'hidden';
  // noun-fill's word bank is OUS_DB (defined in ousiastika/data.js). The lazy
  // manifest only loads this game's game.js, so OUS_DB may be absent on a fresh
  // launch → the round build threw "OUS_DB is not defined". Lazy-load it first
  // (a classic <script>, so its top-level const becomes globally visible).
  if (typeof OUS_DB === 'undefined' && typeof window.lazyLoad === 'function') {
    window.lazyLoad(['games/ousiastika/data.js']).then(_nFillBuild).catch(_nFillBuild);
    return;
  }
  _nFillBuild();
}
function closeNounFill() {
  document.getElementById('noun-fill-overlay').style.display = 'none';
  document.body.style.overflow = '';
}
function nounFillGoLevels() { _nFillBuild(); }

function _nFillBuild() {
  const wrap = document.getElementById('noun-fill-wrap');
  // Level screen now renders through the SHARED two-pane picker
  // (gramBuildLevelGrid → .gpx-pick) inside the standard .lcard.lscreen-levels
  // chrome, so it matches Συνηρημένα and the rest of the grammar games.
  wrap.innerHTML = `
  <div style="max-width:720px;margin:0 auto;padding:20px 16px;font-family:'Crimson Text',serif;color:#e8dcc8;">
    <div id="nfill-screen-levels" class="lcard lscreen-levels" style="max-height:none;">
      <h1>Συμπλήρωση Κατάληξης</h1>
      <p class="lsubtitle">Γράψε τη σωστή κατάληξη του ουσιαστικού</p>
      <hr class="ldivider">
      <div id="nfill-level-grid"></div>
    </div>
    <div id="nfill-screen-game" style="display:none;">
      <div style="background:#1a1610;border:1px solid #3d3020;border-radius:12px;padding:20px;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding-bottom:13px;border-bottom:1px solid #3d3020;">
          <div style="text-align:center;min-width:60px;">
            <div style="font-size:.63rem;color:#8a7a60;font-family:'Cinzel',serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;">Βαθμός</div>
            <div style="font-family:'Cinzel',serif;font-size:1.3rem;color:#c9a44a;font-weight:700;" id="nfill-score">0</div>
          </div>
          <div style="text-align:center;min-width:60px;">
            <div style="font-size:.63rem;color:#8a7a60;font-family:'Cinzel',serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;">Σερί</div>
            <div style="font-family:'Cinzel',serif;font-size:1.3rem;color:#c9a44a;font-weight:700;" id="nfill-streak">0🔥</div>
          </div>
          <div style="text-align:center;min-width:60px;">
            <div style="font-size:.63rem;color:#8a7a60;font-family:'Cinzel',serif;letter-spacing:.1em;text-transform:uppercase;margin-bottom:2px;">Ζωές</div>
            <div style="font-family:'Cinzel',serif;font-size:1.2rem;" id="nfill-lives">❤️❤️❤️</div>
          </div>
          <button onclick="_nFillLevels()" style="padding:7px 13px;background:#241e16;color:#8a7a60;border:1px solid #3d3020;border-radius:7px;font-family:'Cinzel',serif;font-size:.75rem;cursor:pointer;">Επίπεδα</button>
        </div>
        <div style="background:#241e16;border:1px solid #3d3020;border-radius:8px;padding:16px;margin-bottom:18px;text-align:center;">
          <div style="font-size:1.3rem;color:#c9a44a;font-family:'Crimson Text',serif;font-weight:600;margin-bottom:6px;" id="nfill-lemma">—</div>
          <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:5px;" id="nfill-tags"></div>
        </div>
        <div style="display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:14px;">
          <div id="nfill-stem" style="font-family:'Crimson Text',serif;font-size:2rem;color:#e8dcc8;padding:9px 13px;background:#1a1610;border:1px solid #3d3020;border-radius:8px 0 0 8px;border-right:none;min-width:60px;text-align:center;">—</div>
          <input id="nfill-fi-input" type="text" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="κατάληξη"
            style="font-family:'Crimson Text',serif;font-size:2rem;padding:9px 13px;background:#241e16;border:2px solid #7a6030;border-radius:0 8px 8px 0;color:#e8c87a;width:140px;outline:none;caret-color:#c9a44a;">
        </div>
        <button onclick="_nFillSubmit()" style="width:100%;padding:12px;background:linear-gradient(135deg,#c9a44a,#7a6030);color:#0e0c0a;border:none;border-radius:8px;font-family:'Cinzel',serif;font-size:.9rem;font-weight:700;cursor:pointer;margin-bottom:12px;">Υποβολή ↵</button>
        <div id="nfill-feedback" style="text-align:center;font-size:.93rem;min-height:22px;color:#8a7a60;font-style:italic;"></div>
        <div class="lpoly-kb" style="margin-top:10px;">
          <button class="lpoly-toggle" id="nfill-poly-toggle" onclick="gramToggleKB('nfill')">
            <span>Πολυτονικό Πληκτρολόγιο</span><span class="lpoly-arrow">▼</span>
          </button>
          <div class="lpoly-body" id="nfill-poly-body">
            <div class="lpoly-diac-row" id="nfill-diac-row"></div>
            <div id="nfill-vowel-rows"></div>
          </div>
        </div>
      </div>
    </div>
    <div id="nfill-screen-end" style="display:none;text-align:center;padding:40px 20px;">
      <h2 style="font-family:'Cinzel',serif;color:#c9a44a;margin-bottom:8px;">Τέλος!</h2>
      <div style="font-family:'Cinzel',serif;font-size:3rem;color:#c9a44a;font-weight:700;margin-bottom:8px;" id="nfill-final-score">0</div>
      <div style="color:#8a7a60;font-style:italic;margin-bottom:28px;">Τελική βαθμολογία</div>
      <div id="nfill-mistakes-list" style="text-align:left;margin-bottom:24px;"></div>
      <div style="display:flex;gap:10px;justify-content:center;">
        <button onclick="_nFillLevels()" style="padding:11px 22px;background:linear-gradient(135deg,#c9a44a,#7a6030);color:#0e0c0a;border:none;border-radius:8px;font-family:'Cinzel',serif;font-size:.87rem;font-weight:700;cursor:pointer;">Επίπεδα</button>
        <button onclick="nFillState&&_nFillStart(nFillState.levelId)" style="padding:11px 22px;background:#241e16;color:#8a7a60;border:1px solid #3d3020;border-radius:8px;font-family:'Cinzel',serif;font-size:.87rem;cursor:pointer;">Ξανά</button>
      </div>
    </div>
  </div>`;

  document.getElementById('nfill-fi-input').onkeydown = e => { if(e.key==='Enter') _nFillSubmit(); };
  gramBuildKeyboard('nfill');
  // Shared two-pane level picker (rail = κλίσεις, rows = levels) — same look as
  // Συνηρημένα. Selecting a level launches the round via _nFillStart.
  if (typeof gramBuildLevelGrid === 'function') {
    gramBuildLevelGrid('nfill', DECL_LEVELS, lvl => _nFillStart(lvl.id));
  }
}

function _nFillLevels(){
  document.getElementById('nfill-screen-levels').style.display='';
  document.getElementById('nfill-screen-game').style.display='none';
  document.getElementById('nfill-screen-end').style.display='none';
}

function _nFillStart(levelId) {
  const lvl = DECL_LEVELS.find(l=>l.id===levelId);
  if(!lvl) return;
  const f = lvl.filter;

  let pool = OUS_DB.filter(n => {
    if(f.d===12) return n.d===1||n.d===2;
    if(f.d && n.d!==f.d) return false;
    if(f.gender) {
      const genders = f.gender.split('|');
      if(!genders.includes(n.t)) return false;
    }
    if(f.ending) {
      const nom = n.s[0];
      if(!nom) return false;
      const stripped = nom.normalize('NFD').replace(/[\u0300-\u036f]/g,'');
      if(!stripped.endsWith(f.ending)) return false;
    }
    return true;
  });
  if(!pool.length) { alert('Δεν βρέθηκαν ουσιαστικά για αυτό το επίπεδο.'); return; }

  nFillState = { levelId, pool, score:0, streak:0, lives:3, total:0, mistakes:[], answering:false };

  document.getElementById('nfill-screen-levels').style.display='none';
  document.getElementById('nfill-screen-game').style.display='';
  document.getElementById('nfill-screen-end').style.display='none';
  _nFillHUD();
  _nFillNext();
}

function _nFillHUD(){
  const s=nFillState;
  document.getElementById('nfill-score').textContent=s.score;
  document.getElementById('nfill-streak').textContent=s.streak+'🔥';
  document.getElementById('nfill-lives').innerHTML=Array(s.lives).fill('❤️').join('')||'💀';
}

function _nFillNext(){
  nFillState.answering=false;
  const fb=document.getElementById('nfill-feedback');if(fb){fb.textContent='';fb.style.color='#8a7a60';}
  const inp=document.getElementById('nfill-fi-input');
  if(inp){inp.value='';inp.disabled=false;inp.style.borderColor='#7a6030';}
  // Reset the polytonic keyboard via the shared helper. (The old line referenced
  // a non-existent `_gramDiac` global → threw "_gramDiac is not defined" and
  // halted the round before the first noun rendered.)
  if (typeof gramClearDiacritics === 'function') gramClearDiacritics('nfill');
  document.querySelectorAll('#nfill-diac-row .lpoly-dkey').forEach(b=>b.classList.remove('ldkey-active'));
  gramRenderVowels('nfill');

  let n, isSg, cIdx, ans, tries=0;
  do{
    n=nFillState.pool[Math.floor(Math.random()*nFillState.pool.length)];
    isSg=Math.random()>.5;cIdx=Math.floor(Math.random()*5);
    ans=isSg?n.s[cIdx]:n.p[cIdx];tries++;
  }while((!ans||ans==='-')&&tries<60);
  if(!ans||ans==='-'){_nFillNext();return;}

  nFillState.curr = {n, isSg, cIdx, ans};

  const lemmaEl=document.getElementById('nfill-lemma');
  if(lemmaEl) lemmaEl.textContent=n.l;

  const tagsEl=document.getElementById('nfill-tags');
  if(tagsEl) tagsEl.innerHTML=`<span class="lq-tag voice">${CASE_NAMES[cIdx]}</span><span class="lq-tag tense">${isSg?'Ενικός':'Πληθυντικός'}</span><span class="lq-tag mood">${n.d===1?'Α΄ Κλίση':'Β΄ Κλίση'}</span><span class="lq-tag gender">${n.t}</span>`;

  const stemEl=document.getElementById('nfill-stem');
  if(stemEl){
    const bare = n.l.replace(/^[ὁἡτὸ]\s*/,'');
    stemEl.textContent = bare.replace(/[αηιυωεο][νσ]?$/, '') || bare.slice(0,-1);
  }
  inp?.focus();
}

const _nFillNorm = s => s.trim().normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();

function _nFillSubmit(){
  if(nFillState.answering)return;
  const inp=document.getElementById('nfill-fi-input');
  const typed=inp?inp.value.trim():'';if(!typed){inp?.focus();return;}
  nFillState.answering=true;
  if(inp)inp.disabled=true;
  const curr=nFillState.curr;
  const ok=_nFillNorm(typed)===_nFillNorm(curr.ans);
  if(inp)inp.style.borderColor=ok?'#27ae60':'#c0392b';
  const fb=document.getElementById('nfill-feedback');
  if(ok){
    nFillState.score++;nFillState.streak++;nFillState.total++;
    if(fb){fb.textContent='✓ Σωστό!';fb.style.color='#5dca8a';}
  }else{
    nFillState.streak=0;nFillState.lives--;nFillState.total++;
    nFillState.mistakes.push({noun:curr.n.l,case:CASE_NAMES[curr.cIdx],num:curr.isSg?'Ενικός':'Πληθυντικός',typed,correct:curr.ans});
    if(fb){fb.innerHTML=`✗ Λάθος — σωστό: <strong>${curr.ans}</strong>`;fb.style.color='#e67e6a';}
  }
  _nFillHUD();
  if(nFillState.lives<=0){setTimeout(_nFillEnd,1400);return;}
  if(nFillState.total>=20){setTimeout(_nFillEnd,1400);return;}
  setTimeout(_nFillNext,1500);
}

function _nFillEnd(){
  document.getElementById('nfill-screen-game').style.display='none';
  document.getElementById('nfill-screen-end').style.display='';
  document.getElementById('nfill-final-score').textContent=nFillState.score;
  const ml=document.getElementById('nfill-mistakes-list');
  if(ml){
    if(!nFillState.mistakes.length){ml.innerHTML='<p style="color:#27ae60;text-align:center;font-style:italic;">Τέλειο! 🎉</p>';}
    else{
      let h=`<div class="lmistakes-hdr">Λάθη: ${nFillState.mistakes.length}</div><div class="lmistakes-list">`;
      nFillState.mistakes.forEach(m=>{h+=`<div class="lmistake-row"><div class="lm-q">${m.noun} — ${m.case} ${m.num}</div><div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div></div>`;});
      h+='</div>';ml.innerHTML=h;
    }
  }
}
