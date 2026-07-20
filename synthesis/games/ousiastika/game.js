// ============================================================
//  ΟΥΣΙΑΣΤΙΚΑ — Game Controller (31-level multi-select)
//  Depends on: ousiastika/data.js, shared-engine.js
// ============================================================

function openOusiastika() {
  document.getElementById('ous-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
  if (!document.getElementById('ous-screen-levels')) _ousBuild();
}
function closeOusiastika() {
  _ousToLevels(); // stop timer + reset to levels
  document.getElementById('ous-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Levels carry both `sub` (selection codes — used by _ousFilterNouns) and
// the additive `section` (display subsection inside the broad `group` umbrella,
// read by the configurator picker). `color` is retained for the legacy in-game
// level grid; the new picker ignores it.
const OUS_LEVELS=[
  {id:1, group:"Α΄ Κλίση", section:null, color:"lgreen",  desc:"Αρσενικά: νεανίας, πολίτης (-ας, -ης)", sub:["1_αρσ"]},
  {id:2, group:"Α΄ Κλίση", section:null, color:"lyellow", desc:"Θηλυκά: χώρα, τιμή (-α, -η)", sub:["1_θηλ"]},
  {id:3, group:"Α΄ Κλίση", section:null, color:"lred",    desc:"Α΄ Κλίση — Όλα", sub:["1"]},
  {id:4, group:"Β΄ Κλίση", section:null, color:"lgreen",  desc:"Αρσ./Θηλ.: λόγος, νόσος (-ος)", sub:["2_αρσθηλ"]},
  {id:5, group:"Β΄ Κλίση", section:null, color:"lyellow", desc:"Ουδέτερα: δῶρον (-ον)", sub:["2_ουδ"]},
  {id:6, group:"Β΄ Κλίση", section:null, color:"lred",    desc:"Β΄ Κλίση — Όλα", sub:["2"]},
  {id:7, group:"Γ΄ Κλίση", section:"Φωνηεντόληκτα", color:"lgreen",  desc:"Μονόθεμα -ως: ὁ ἥρως", sub:["φων_ως"]},
  {id:8, group:"Γ΄ Κλίση", section:"Φωνηεντόληκτα", color:"lgreen",  desc:"Μονόθεμα -υς: ἰχθύς, βότρυς", sub:["φων_υς_μ"]},
  {id:9, group:"Γ΄ Κλίση", section:"Φωνηεντόληκτα", color:"lyellow", desc:"Διπλόθεμα -ις/-υς/-υ: πόλις, πέλεκυς, ἄστυ", sub:["φων_διπλ"]},
  {id:10,group:"Γ΄ Κλίση", section:"Φωνηεντόληκτα", color:"lyellow", desc:"Σε -ευς: βασιλεύς", sub:["φων_ευς"]},
  {id:11,group:"Γ΄ Κλίση", section:"Φωνηεντόληκτα", color:"lyellow", desc:"Διπλόθεμα -ω: ἠχώ, πειθώ", sub:["φων_ω"]},
  {id:12,group:"Γ΄ Κλίση", section:"Φωνηεντόληκτα", color:"lred",    desc:"Διφθογγόληκτα: ναῦς, βοῦς, γραῦς", sub:["φων_αυ"]},
  {id:13,group:"Γ΄ Κλίση", section:"Αφωνόληκτα",  color:"lgreen",  desc:"Ουρανικόληκτα: ὁ κόραξ (κ/γ/χ)", sub:["αφων_ουραν"]},
  {id:14,group:"Γ΄ Κλίση", section:"Αφωνόληκτα",  color:"lgreen",  desc:"Χειλικόληκτα: ὁ γύψ (π/β/φ)", sub:["αφων_χειλ"]},
  {id:15,group:"Γ΄ Κλίση", section:"Αφωνόληκτα",  color:"lyellow", desc:"Οδοντικόληκτα βασικά: ὁ τάπης, ἡ πατρίς (τ/δ/θ)", sub:["αφων_οδ"]},
  {id:16,group:"Γ΄ Κλίση", section:"Αφωνόληκτα",  color:"lgreen",  desc:"Σε -ντ (ΟΝ.-ας): ὁ ἱμάς, γίγας, ἐλέφας", sub:["αφων_ιμας"]},
  {id:17,group:"Γ΄ Κλίση", section:"Αφωνόληκτα",  color:"lyellow", desc:"Σε -ντ (ΟΝ.-ων): ὁ λέων, ἄρχων, ὀδούς", sub:["αφων_λεων"]},
  {id:18,group:"Γ΄ Κλίση", section:"Αφωνόληκτα",  color:"lred",    desc:"Ουδέτερα -α: τὸ σῶμα, πρᾶγμα, ὄνομα", sub:["αφων_σωμα"]},
  {id:19,group:"Γ΄ Κλίση", section:"Ενρινόληκτα", color:"lgreen",  desc:"Μονόθεμα: ὁ ἀγών, Ἕλλην, μήν", sub:["ενριν_μ"]},
  {id:20,group:"Γ΄ Κλίση", section:"Ενρινόληκτα", color:"lyellow", desc:"Διπλόθεμα: ὁ ἡγεμών, ποιμήν", sub:["ενριν_δ"]},
  {id:21,group:"Γ΄ Κλίση", section:"Υγρόληκτα",   color:"lgreen",  desc:"Μονόθεμα: ὁ σωτήρ, ῥήτωρ, κλητήρ", sub:["υγρ_ρητ"]},
  {id:22,group:"Γ΄ Κλίση", section:"Υγρόληκτα",   color:"lyellow", desc:"Συγκοπτόμενα: ὁ πατήρ, ἡ μήτηρ, ὁ ἀνήρ", sub:["υγρ_πατ"]},
  {id:23,group:"Γ΄ Κλίση", section:"Σιγμόληκτα",  color:"lgreen",  desc:"Αρσ. σε -ης / -κλῆς: Σωκράτης, Ἡρακλῆς", sub:["σιγμ_σωκρ","σιγμ_κλης"]},
  {id:24,group:"Γ΄ Κλίση", section:"Σιγμόληκτα",  color:"lyellow", desc:"Θηλ. σε -ώς: ἡ αἰδώς, ἠώς", sub:["σιγμ_αιδ"]},
  {id:25,group:"Γ΄ Κλίση", section:"Σιγμόληκτα",  color:"lyellow", desc:"Ουδ. σε -ος: τὸ βέλος, ἔθνος, κράτος", sub:["σιγμ_βελ"]},
  {id:26,group:"Γ΄ Κλίση", section:"Σιγμόληκτα",  color:"lred",    desc:"Ουδ. σε -ας/-αρ: τὸ κρέας, τέρας, γῆρας", sub:["σιγμ_κρε"]},
  {id:30,group:"Γ΄ Κλίση", section:null, color:"lred",  desc:"Γ΄ Κλίση — Όλες οι υποκατηγορίες", sub:["γ"]},
  {id:27,group:"Ανώμαλα", section:null, color:"lpurple", desc:"Ανώμαλα κατά γένος: ὁ λύχνος → τὰ λύχνα", sub:["ανωμ_γεν"]},
  {id:28,group:"Ανώμαλα", section:null, color:"lpurple", desc:"Ετερόκλιτα: ὁ ἀμνός/ἀρνός, τὸ πῦρ/πυρά", sub:["ετεροκλ"]},
  {id:29,group:"Ανώμαλα", section:null, color:"lpurple", desc:"Μεταπλαστά: τὸ γόνυ/γόνατος, τὸ δόρυ/δόρατος, ὁ Ζεύς/Διός", sub:["μεταπλ"]},
  {id:31,group:"Συνδυαστικό", section:null, color:"lred", desc:"Α΄ + Β΄ + Γ΄ Κλίση — Όλα μαζί", sub:["all"]},
];

let _ousOpenG=null;   // open umbrella in the two-pane level picker
function _ousFilterNouns(subs){
  if(subs.includes('all')) return OUS_DB;
  const result=[];
  const seen=new Set();
  OUS_DB.forEach(n=>{
    for(const s of subs){
      let match=false;
      if(s==='1')           match=n.d===1;
      else if(s==='1_αρσ')  match=n.d===1&&n.t==='αρσενικό';
      else if(s==='1_θηλ')  match=n.d===1&&n.t==='θηλυκό';
      else if(s==='2')           match=n.d===2;
      else if(s==='2_αρσθηλ')    match=n.d===2&&(n.t==='αρσενικό'||n.t==='θηλυκό');
      else if(s==='2_ουδ')       match=n.d===2&&n.t==='ουδέτερο';
      else if(s==='γ')           match=n.d===3;
      else if(s==='ανωμ_γεν')    match=n.sub==='ανωμ_γεν';
      else if(s==='ετεροκλ')     match=n.sub==='ετεροκλ';
      else if(s==='μεταπλ')      match=n.sub==='μεταπλ';
      else                       match=n.sub===s;
      if(match&&!seen.has(n.l)){seen.add(n.l);result.push(n);break;}
    }
  });
  return result;
}

let _ousMode='mc';
// MIX: random single-question style per question (this game offers mc + fi).
const OUS_MIX_POOL=['mc','fi'];
const OUS_MIX_LABELS={mc:'Πολλαπλή Επιλογή',fi:'Συμπλήρωση Κενού'};
let _ousCurMode='mc';
let _ousState=null;
let _ousLastSelIds=[];

function _ousBuild(){
  document.getElementById('ous-wrap').innerHTML=`
<div id="ous-screen-levels" class="lyo-screen active">
  <div class="lcard lscreen-levels" style="max-height:88vh;overflow-y:auto;">
    <h1>Κλίση Ουσιαστικών</h1>
    <p class="lsubtitle">Αρχαία Ελληνικά — Α΄, Β΄, Γ΄ Κλίση + Ανώμαλα</p>
    <button class="game-share-btn" onclick="showQR('Κλίση Ουσιαστικών',{nav:'game',id:'ous'})">📱 Μοιράσου στην τάξη</button>
    <hr class="ldivider">
    <div id="ous-level-grid"></div>
    <div style="position:sticky;bottom:0;background:#1a1610;padding:12px 0 4px;border-top:1px solid #3d3020;margin-top:16px;">
      <div style="display:none;">
        <select id="ous-sel-time" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="60">60 δευτ.</option><option value="90" selected>90 δευτ.</option>
          <option value="120">2 λεπτά</option><option value="0">∞ χρόνος</option>
        </select>
        <select id="ous-sel-lives" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="1">1 ζωή</option><option value="3" selected>3 ζωές</option>
          <option value="5">5 ζωές</option><option value="0">∞ ζωές</option>
        </select>
        <select id="ous-sel-mode" style="padding:8px 6px;background:#241e16;border:1px solid #3d3020;border-radius:8px;color:#e8dcc8;font-size:.8rem;cursor:pointer;font-family:inherit;">
          <option value="" disabled selected>— τρόπος —</option>
          <option value="mc">Πολλ. Επιλογή</option>
          <option value="fi">Συμπλήρωση</option>
          <option value="match">🔗 Αντιστοίχιση</option>
          <option value="mix">🎲 MIX</option>
        </select>
      </div>
      <button id="ous-start-btn" class="lbtn lbtn-primary" style="opacity:.5;pointer-events:none;" onclick="ousOpenSettings()">✓ Διάλεξε επίπεδο →</button>
    </div>
  </div>
</div>
<div id="ous-screen-game" class="lyo-screen">
  <div class="lcard">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Βαθμός</div><div class="lstat-val" id="ous-sv">0</div></div>
      <div class="lstat"><div class="lstat-lbl">Χρόνος</div><div class="lstat-val" id="ous-tv">—</div></div>
      <div class="lstat"><div class="lstat-lbl">Ζωές</div><div class="llives-row" id="ous-lv"></div></div>
      <button class="lbtn lbtn-secondary" onclick="_ousEndGame()" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div class="lqbox" id="ous-q"><div class="lq-main">Φόρτωση...</div></div>
    <div class="lfeedback" id="ous-fb"></div>
    <div id="ous-mc-area" class="lopts-grid" style="display:none;"></div>
    <div id="ous-fi-area" style="display:none;">
      <div style="text-align:center;margin-bottom:14px;">
        <input type="text" id="ous-fi-input" autocomplete="off" autocorrect="off" spellcheck="false" placeholder="πληκτρολογήστε..."
          style="font-family:'Noto Serif',serif;font-size:1.8rem;padding:9px 14px;background:#241e16;border:2px solid #7a6030;border-radius:8px;color:#e8c87a;width:100%;max-width:300px;outline:none;text-align:center;caret-color:#c9a44a;">
      </div>
      <button class="lfi-submit" id="ous-fi-submit" onclick="ousSubmitFI()">Υποβολή ↵</button>
      <div class="lpoly-kb" style="margin-top:10px;">
        <button class="lpoly-toggle" id="ous-poly-toggle" onclick="gramToggleKB('ous')">
          <span>Πολυτονικό Πληκτρολόγιο</span><span class="lpoly-arrow">▼</span>
        </button>
        <div class="lpoly-body" id="ous-poly-body">
          <div class="lpoly-diac-row" id="ous-diac-row"></div>
          <div id="ous-vowel-rows"></div>
        </div>
      </div>
    </div>
  </div>
</div>
<div id="ous-screen-end" class="lyo-screen">
  <div class="lcard lend-screen" style="max-height:88vh;overflow-y:auto;">
    <h2>Τέλος Κουίζ!</h2>
    <div class="lbig-score" id="ous-es">0</div>
    <div style="color:#8a7a60;font-size:1rem;margin-bottom:16px;">Τελική βαθμολογία</div>
    <hr class="ldivider">
    <div id="ous-mistakes-log"></div>
    <hr class="ldivider">
    <div class="lend-btns">
      <button class="lbtn lbtn-primary" onclick="_ousRetry()">Δοκιμάστε Ξανά</button>
      <button class="lbtn lbtn-secondary" onclick="_ousToLevels()">Επίπεδα</button>
    </div>
  </div>
</div>
<div id="ous-screen-match" class="lyo-screen">
  <div class="lcard" style="max-width:820px;">
    <div class="lgame-hdr">
      <div class="lstat"><div class="lstat-lbl">Ζεύγη</div><div class="lstat-val" id="ous-match-score">0/0</div></div>
      <div style="font-size:.82rem;color:#c9a44a;font-family:'Cinzel',serif;text-align:center;" id="ous-match-lbl"></div>
      <button class="lbtn lbtn-secondary" onclick="gramMatchExit('ous')" style="padding:7px 13px;font-size:.77rem;">Τέλος</button>
    </div>
    <div id="ous-match-body"></div>
    <div class="lfeedback" id="ous-match-fb"></div>
  </div>
</div>`;

  const grid=document.getElementById('ous-level-grid');
  grid.classList.add('gpx-pick');
  // Two-pane multi-select picker (matches the configurator). Rows keep the
  // `.lvl-card.ous-sel` + dataset contract so _ousUpdateStartBtn / ousLaunch
  // work unchanged; every umbrella renders (hidden when not open) so the
  // multi-selection persists while switching umbrellas.
  const _oGroups=[],_oMap={},_oSeq={};
  OUS_LEVELS.forEach((l,i)=>{ if(!_oMap[l.group]){_oMap[l.group]=[];_oGroups.push(l.group);} _oMap[l.group].push(l); _oSeq[l.id]=i+1; });
  if(!_ousOpenG||!_oMap[_ousOpenG]) _ousOpenG=_oGroups[0];
  const _oChip=l=>{ const pr=_gramProg('ous',l.id);
    return pr.state==='done'?'<span class="gpx-score done">✓ '+pr.best+'<i>πτ</i></span>'
      :pr.state==='active'?'<span class="gpx-score act">'+pr.best+'<i>πτ</i></span>'
      :'<span class="gpx-score new">Ξεκίνα →</span>'; };
  let _oRail='<div class="gpx-rail"><div class="gpx-rail-lbl">Κλίσεις</div>';
  _oGroups.forEach(g=>{ const st=_gramGStats('ous',_oMap[g]);
    _oRail+='<button type="button" class="gpx-railitem'+(g===_ousOpenG?' on':'')+'" data-g="'+encodeURIComponent(g)+'"><span class="gpx-railbody"><span class="nm">'+_gramEsc(g)+'</span><span class="bl">'+st.done+'/'+st.total+' ολοκλ.</span></span>'+_gramRing(st.pct,st.done)+'</button>'; });
  _oRail+='</div>';
  let _oDetail='<div class="gpx-detail">';
  _oGroups.forEach(g=>{
    _oDetail+='<div class="ous-gsec" data-g="'+encodeURIComponent(g)+'"'+(g===_ousOpenG?'':' style="display:none"')+'><div class="gpx-detail-hd"><h3>'+_gramEsc(g)+'</h3><span class="meta">'+_oMap[g].length+' επίπεδα</span></div>';
    const _sects=[],_sMap={}; _oMap[g].forEach(l=>{const s=l.section||'';if(!(s in _sMap)){_sMap[s]=[];_sects.push(s);}_sMap[s].push(l);});
    _sects.forEach(s=>{ if(s)_oDetail+='<div class="gpx-subdiv">'+_gramEsc(s)+'<span class="ct">'+_sMap[s].length+'</span></div>';
      _oDetail+='<div class="gpx-rows">'+_sMap[s].map(l=>'<button type="button" class="gpx-row lvl-card" data-lvl-id="'+l.id+'" data-subs=\''+JSON.stringify(l.sub)+'\'><span class="gpx-box"></span><span class="gpx-num">'+String(_oSeq[l.id]).padStart(2,'0')+'</span><span class="gpx-rowbody"><span class="gpx-desc">'+_gramEsc(l.desc)+'</span></span>'+_oChip(l)+'</button>').join('')+'</div>'; });
    _oDetail+='</div>';
  });
  _oDetail+='</div>';
  grid.innerHTML='<div class="gpx-body">'+_oRail+_oDetail+'</div>';
  grid.querySelectorAll('.gpx-railitem').forEach(el=>el.onclick=()=>{ _ousOpenG=decodeURIComponent(el.dataset.g);
    grid.querySelectorAll('.gpx-railitem').forEach(b=>b.classList.toggle('on',b===el));
    grid.querySelectorAll('.ous-gsec').forEach(sx=>{sx.style.display=(decodeURIComponent(sx.dataset.g)===_ousOpenG)?'':'none';}); });
  grid.querySelectorAll('.gpx-row.lvl-card').forEach(d=>d.onclick=()=>{ d.classList.toggle('ous-sel'); d.classList.toggle('on'); _ousUpdateStartBtn(); });
  document.getElementById('ous-fi-input').onkeydown=e=>{if(e.key==='Enter')ousSubmitFI();};
  document.getElementById('ous-sel-mode').addEventListener('change',_ousUpdateStartBtn);
  gramBuildKeyboard('ous');
}

function _ousUpdateStartBtn(){
  const sel=document.querySelectorAll('#ous-level-grid .lvl-card.ous-sel');
  const btn=document.getElementById('ous-start-btn');
  if(!btn)return;
  if(sel.length>0){btn.style.opacity='1';btn.style.pointerEvents='auto';btn.textContent=siteLang==='en'?`Next (${sel.length} lvl) →`:`Επόμενο (${sel.length} επ.) →`;}
  else{btn.style.opacity='.5';btn.style.pointerEvents='none';btn.textContent=siteLang==='en'?'✓ Select a level →':'✓ Διάλεξε επίπεδο →';}
}

// Open the shared mode/time/lives settings screen, then launch (or hand off to arcade).
function ousOpenSettings(){
  if(!document.querySelectorAll('#ous-level-grid .lvl-card.ous-sel').length) return;
  gramOpenQuizSettings('ous', {
    title:'Κλίση Ουσιαστικών',
    datasetId:'ousiastika',
    modes:[
      {id:'mc',    label:'Πολλαπλή Επιλογή', hint:'Επίλεξε από 4 επιλογές'},
      {id:'fi',    label:'Συμπλήρωση Κενού', hint:'Γράψε την κατάληξη'},
      {id:'match', label:'Αντιστοίχιση',     hint:'Αντιστοίχισε τύπο με μορφή'},
      {id:'mix',   label:'MIX — Ανάμεικτο',  hint:'Τυχαίο στυλ σε κάθε ερώτηση'},
    ],
    onLaunch: ousLaunch,
    onClose: closeOusiastika,
  });
}

function ousSetMode(m){_ousMode=m;}
function _ousShowScreen(id){document.querySelectorAll('#ous-wrap .lyo-screen').forEach(s=>s.classList.remove('active'));document.getElementById(id)?.classList.add('active');}
function _ousToLevels(){
  if(_ousState){clearInterval(_ousState.timerInterval);if(_ousState.pendingTimeout)clearTimeout(_ousState.pendingTimeout);_ousState.timerInterval=null;_ousState.pendingTimeout=null;}
  _ousShowScreen('ous-screen-levels');
}
function _ousRetry(){
  if(_ousState){
    _ousState.score=0;_ousState.lives=_ousState.lives===Infinity?Infinity:parseInt(document.getElementById('ous-sel-lives')?.value||3);
    _ousState.timerRemaining=_ousState.timer;_ousState.mistakes=[];_ousState.answering=false;
    if(_ousState.pendingTimeout)clearTimeout(_ousState.pendingTimeout);
    clearInterval(_ousState.timerInterval);
    _ousShowScreen('ous-screen-game');_ousHUD();
    if(_ousState.timer>0)_ousStartTimer();
    ousNext();
  }else{_ousToLevels();}
}

function ousLaunch(){
  const selCards=document.querySelectorAll('#ous-level-grid .lvl-card.ous-sel');
  const modeVal=document.getElementById('ous-sel-mode')?.value;
  if(!selCards.length||!modeVal)return;
  _ousLastSelIds=[...selCards].map(c=>+c.dataset.lvlId).filter(Boolean);
  const allSubs=[];
  selCards.forEach(c=>{
    const subs=JSON.parse(c.dataset.subs||'[]');
    subs.forEach(s=>{if(!allSubs.includes(s))allSubs.push(s);});
  });
  const m=document.getElementById('ous-sel-mode').value;
  _ousMode=m;

  // Match mode: build G-compatible dictionary and delegate to shared match engine
  if(m==='match'){
    if(_ousState){clearInterval(_ousState.timerInterval);if(_ousState.pendingTimeout)clearTimeout(_ousState.pendingTimeout);}
    const active=_ousFilterNouns(allSubs);
    if(!active.length){alert('Δεν βρέθηκαν ουσιαστικά.');return;}
    const isEn=siteLang==='en';
    const matchG={};
    active.forEach(n=>{
      const dl=n.d===1?(isEn?'1st Decl.':'Α΄ Κλίση'):n.d===2?(isEn?'2nd Decl.':'Β΄ Κλίση'):(OUS_SUBS[n.sub]||'Γ΄ Κλίση');
      [true,false].forEach(isSg=>{
        for(let ci=0;ci<5;ci++){
          const ans=isSg?n.s[ci]:n.p[ci];
          if(!ans||ans==='-')continue;
          const key=`${n.l}|${isSg?'sg':'pl'}|${ci}`;
          const cL=(isEn?OUS_CASES_EN:OUS_CASES)[ci];
          const nL=isEn?(isSg?'Singular':'Plural'):(isSg?'Ενικός':'Πληθυντικός');
          matchG[key]={
            endings:[ans],fi_endings:[ans],
            _qt:`<div class="lq-main">${n.l} — ${cL} ${nL}</div>`
          };
        }
      });
    });
    if(!Object.keys(matchG).length){alert('Δεν βρέθηκαν ουσιαστικά.');return;}
    _gramMatchDoneHook['ous']=(st)=>{_ousLastSelIds.forEach(id=>{try{const pkey=`ous_prog_${id}`;const prev=JSON.parse(localStorage.getItem(pkey)||'{}');const data={best:Math.max(st.total,prev.best||0),completed:true,ts:Date.now()};localStorage.setItem(pkey,JSON.stringify(data));const card=document.querySelector(`#ous-level-grid .lvl-card[data-lvl-id="${id}"]`);if(card){let b=card.querySelector('.lvl-badge');if(!b){b=document.createElement('div');card.appendChild(b);}b.className='lvl-badge lvl-badge-done';b.textContent='✓ '+data.best+'πτ';}}catch(e){}});};
    gramStartMatch('ous',matchG,()=>Object.keys(matchG),()=>'',g=>g._qt,null,'ous-wrap');
    return;
  }

  const t=parseInt(document.getElementById('ous-sel-time').value);
  const l=parseInt(document.getElementById('ous-sel-lives').value);
  const active=_ousFilterNouns(allSubs);
  _ousState={score:0,lives:l===0?Infinity:l,timer:t,timerRemaining:t,timerInterval:null,answering:false,pendingTimeout:null,active,curr:null,mistakes:[]};
  if(!_ousState.active.length){alert('Δεν βρέθηκαν ουσιαστικά.');return;}
  document.getElementById('ous-mc-area').style.display=_ousMode==='mc'?'grid':'none';
  document.getElementById('ous-fi-area').style.display=_ousMode==='fi'?'block':'none';
  _ousShowScreen('ous-screen-game');_ousHUD();
  if(t>0)_ousStartTimer();
  ousNext();
}

function _ousStartTimer(){
  _ousState.timerInterval=setInterval(()=>{
    _ousState.timerRemaining--;
    const tv=document.getElementById('ous-tv');
    if(tv){tv.textContent=_gramFmtSec(_ousState.timerRemaining);tv.classList.toggle('ltimer-warn',_ousState.timerRemaining<=10);tv.classList.toggle('ltimer-caut',_ousState.timerRemaining<=20&&_ousState.timerRemaining>10);}
    if(_ousState.timerRemaining<=0)_ousEndGame();
  },1000);
}

function _ousHUD(){
  const sv=document.getElementById('ous-sv');if(sv)sv.textContent=_ousState.score;
  const lv=document.getElementById('ous-lv');
  if(lv){if(_ousState.lives===Infinity){lv.textContent='∞';lv.style.fontSize='1.4rem';}else lv.innerHTML=Array(_ousState.lives).fill('❤️').join('')||'💀';}
  const tv=document.getElementById('ous-tv');
  if(tv){if(_ousState.timer===0){tv.textContent='∞';tv.classList.remove('ltimer-warn','ltimer-caut');}
  else{tv.textContent=_gramFmtSec(_ousState.timerRemaining);}}
}

function ousNext(){
  _ousState.answering=false;
  const fb=document.getElementById('ous-fb');if(fb){fb.textContent='';fb.className='lfeedback';}
  let n,isSg,cIdx,ans,tries=0;
  do{n=_ousState.active[Math.floor(Math.random()*_ousState.active.length)];isSg=Math.random()>.5;cIdx=Math.floor(Math.random()*5);ans=isSg?n.s[cIdx]:n.p[cIdx];tries++;}while((!ans||ans==='-')&&tries<60);
  if(!ans||ans==='-'){ousNext();return;}
  _ousState.curr={n,isSg,cIdx,ans};
  const isEn=siteLang==='en';
  const dl=n.d===1?(isEn?'1st Decl.':'Α΄ Κλίση'):n.d===2?(isEn?'2nd Decl.':'Β΄ Κλίση'):(OUS_SUBS[n.sub]||'Γ΄ Κλίση');
  const caseLabel=(isEn?OUS_CASES_EN:OUS_CASES)[cIdx];
  const numLabel=isEn?(isSg?'Singular':'Plural'):(isSg?'Ενικός':'Πληθυντικός');
  const genderLabel=isEn?{αρσενικό:'Masc.',θηλυκό:'Fem.',ουδέτερο:'Neut.'}[n.t]||n.t:n.t;
  // MIX: pick this question's style, flip the mc/fi areas to match.
  _ousCurMode = (_ousMode==='mix') ? OUS_MIX_POOL[Math.floor(Math.random()*OUS_MIX_POOL.length)] : _ousMode;
  document.getElementById('ous-mc-area').style.display=_ousCurMode==='mc'?'grid':'none';
  document.getElementById('ous-fi-area').style.display=_ousCurMode==='fi'?'block':'none';
  const _mixChip = (_ousMode==='mix') ? `<div class="gram-mixchip">🎲 ${OUS_MIX_LABELS[_ousCurMode]||''}</div>` : '';
  const qt=_mixChip+`<div class="lq-main" style="font-size:1.2rem;text-align:center;margin-bottom:8px;"><em>${n.l}</em></div><div class="lq-tags"><span class="lq-tag voice">${caseLabel}</span><span class="lq-tag tense">${numLabel}</span><span class="lq-tag mood">${dl}</span><span class="lq-tag gender">${genderLabel}</span></div>`;
  document.getElementById('ous-q').innerHTML=qt;
  if(_ousCurMode==='mc'){
    const grid=document.getElementById('ous-mc-area');grid.innerHTML='';
    _ousGenOptions(n,isSg,cIdx,ans).forEach(opt=>{
      const b=document.createElement('button');b.className='lopt-btn';b.textContent=opt;b.onclick=()=>ousAnswer(opt);grid.appendChild(b);
    });
  }else{
    const inp=document.getElementById('ous-fi-input');if(inp){inp.value='';inp.disabled=false;inp.style.borderColor='#7a6030';inp.focus();}
    document.getElementById('ous-fi-submit').disabled=false;
    gramClearDiacritics('ous');document.querySelectorAll('#ous-diac-row .lpoly-dkey').forEach(b=>b.classList.remove('ldkey-active'));gramRenderVowels('ous');
  }
}

function _ousGenOptions(n,isSg,cIdx,correct){
  const norm=s=>s.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,'').toLowerCase();
  const used=new Set([norm(correct)]);
  const opts=[correct];
  const CASE_NAMES=['nominative','genitive','dative','accusative','vocative'];
  const _wMetaMap=Object.create(null);
  const push=(f,meta)=>{if(f&&f!=='-'&&!used.has(norm(f))&&opts.length<4){opts.push(f);used.add(norm(f));if(meta)_wMetaMap[f]=meta;}};

  // 1. Different case, same number \u2014 same noun (case confusion) \u2014 highest priority
  for(const ci of _ousShuffle([0,1,2,3,4].filter(i=>i!==cIdx)))
    {if(opts.length>=4)break;push(isSg?n.s[ci]:n.p[ci],{category:'noun_morphology',mutation_type:'incorrect_case',details:{expected:CASE_NAMES[cIdx],selected:CASE_NAMES[ci]}});}

  // 2. Same case, opposite number \u2014 same noun (number confusion)
  if(opts.length<4) push(isSg?n.p[cIdx]:n.s[cIdx],{category:'noun_morphology',mutation_type:'incorrect_number',details:{expected:isSg?'singular':'plural',selected:isSg?'plural':'singular'}});

  // 3. Same case + same number + same declension \u2014 different noun (cross-lemma last resort)
  if(opts.length<4){
    for(const o of _ousShuffle(OUS_DB.filter(o=>o!==n&&o.d===n.d)))
      {if(opts.length>=4)break;push(isSg?o.s[cIdx]:o.p[cIdx],{category:'noun_morphology',mutation_type:'cross_lemma_case',details:{expected:CASE_NAMES[cIdx],distractor_lemma:o.l}});}
  }

  // 4. Same case + same number \u2014 any active noun
  if(opts.length<4){
    for(const o of _ousShuffle(_ousState.active.filter(o=>o!==n)))
      {if(opts.length>=4)break;push(isSg?o.s[cIdx]:o.p[cIdx],{category:'noun_morphology',mutation_type:'cross_lemma_case',details:{expected:CASE_NAMES[cIdx],distractor_lemma:o.l}});}
  }

  // 5. Anything from active pool
  if(opts.length<4){
    const any=[];
    _ousState.active.forEach(o=>[...o.s,...o.p].forEach(f=>{if(f&&f!=='-'&&!used.has(norm(f)))any.push({f,l:o.l});}));
    for(const {f,l} of _ousShuffle(any)){if(opts.length>=4)break;push(f,{category:'noun_morphology',mutation_type:'cross_lemma_fallback',details:{distractor_lemma:l}});}
  }

  if(_ousState.curr) _ousState.curr._wrongMetaMap=_wMetaMap;
  return _ousShuffle(opts);
}
function _ousShuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const _ousNorm=s=>s.trim().normalize("NFD").replace(/[\u0300-\u036f]/g,'').toLowerCase();

function ousAnswer(chosen){
  if(_ousState.answering)return;_ousState.answering=true;
  const ok=_ousNorm(chosen)===_ousNorm(_ousState.curr.ans);
  document.querySelectorAll('#ous-mc-area .lopt-btn').forEach(b=>{b.disabled=true;if(_ousNorm(b.textContent)===_ousNorm(_ousState.curr.ans))b.classList.add('lcorrect');else if(b.textContent===chosen&&!ok)b.classList.add('lwrong');});
  const fb=document.getElementById('ous-fb');
  if(ok){_ousState.score++;if(fb){fb.textContent=siteLang==='en'?'✓ Correct!':'✓ Σωστό!';fb.className='lfeedback lok';}}
  else{_ousState.mistakes.push({noun:_ousState.curr.n.l,caseLabel:OUS_CASES[_ousState.curr.cIdx],num:_ousState.curr.isSg?'Ενικός':'Πληθυντικός',typed:chosen,correct:_ousState.curr.ans});if(typeof logStudentMistake==='function')logStudentMistake('ous','ousiastika','mc',{q:`${_ousState.curr.n.l} — ${OUS_CASES[_ousState.curr.cIdx]} ${_ousState.curr.isSg?'Ενικός':'Πληθυντικός'}`,a:_ousState.curr.ans},chosen);if(fb){fb.innerHTML=(siteLang==='en'?`✗ Wrong — correct: <strong>${_ousState.curr.ans}</strong>`:`✗ Λάθος — σωστό: <strong>${_ousState.curr.ans}</strong>`);fb.className='lfeedback lerr';}
    if(_ousState.lives!==Infinity){_ousState.lives--;_ousHUD();if(_ousState.lives<=0){_ousState.pendingTimeout=setTimeout(()=>_ousEndGame(),1200);return;}}}
  _ousHUD();_ousState.pendingTimeout=setTimeout(()=>ousNext(),1500);
}

function ousSubmitFI(){
  if(_ousState.answering)return;
  const inp=document.getElementById('ous-fi-input');const typed=inp?inp.value.trim():'';if(!typed){inp?.focus();return;}
  _ousState.answering=true;if(inp)inp.disabled=true;document.getElementById('ous-fi-submit').disabled=true;
  const ok=_ousNorm(typed)===_ousNorm(_ousState.curr.ans);
  if(inp)inp.style.borderColor=ok?'#27ae60':'#c0392b';
  const fb=document.getElementById('ous-fb');
  if(ok){_ousState.score++;if(fb){fb.textContent=siteLang==='en'?'✓ Correct!':'✓ Σωστό!';fb.className='lfeedback lok';}}
  else{_ousState.mistakes.push({noun:_ousState.curr.n.l,caseLabel:OUS_CASES[_ousState.curr.cIdx],num:_ousState.curr.isSg?'Ενικός':'Πληθυντικός',typed,correct:_ousState.curr.ans});if(typeof logStudentMistake==='function')logStudentMistake('ous','ousiastika','fi',{q:`${_ousState.curr.n.l} — ${OUS_CASES[_ousState.curr.cIdx]} ${_ousState.curr.isSg?'Ενικός':'Πληθυντικός'}`,a:_ousState.curr.ans},typed);if(fb){fb.innerHTML=(siteLang==='en'?`✗ Wrong — correct: <strong>${_ousState.curr.ans}</strong>`:`✗ Λάθος — σωστό: <strong>${_ousState.curr.ans}</strong>`);fb.className='lfeedback lerr';}
    if(_ousState.lives!==Infinity){_ousState.lives--;_ousHUD();if(_ousState.lives<=0){_ousState.pendingTimeout=setTimeout(()=>_ousEndGame(),1400);return;}}}
  _ousHUD();_ousState.pendingTimeout=setTimeout(()=>ousNext(),1600);
}

function _ousEndGame(){
  clearInterval(_ousState.timerInterval);if(_ousState.pendingTimeout)clearTimeout(_ousState.pendingTimeout);
  if(_ousLastSelIds.length){try{const done=_ousState.mistakes.length===0&&_ousState.score>0;_ousLastSelIds.forEach(id=>{const k=`ous_prog_${id}`;const pv=JSON.parse(localStorage.getItem(k)||'{}');localStorage.setItem(k,JSON.stringify({best:Math.max(_ousState.score,pv.best||0),completed:pv.completed||done,ts:Date.now()}));});document.querySelectorAll('#ous-level-grid .lvl-card[data-lvl-id]').forEach(card=>{const p=JSON.parse(localStorage.getItem(`ous_prog_${card.dataset.lvlId}`)||'null');const ob=card.querySelector('.lvl-badge');if(ob)ob.remove();if(p){const b=document.createElement('div');b.className='lvl-badge'+(p.completed?' lvl-badge-done':'');b.textContent=(p.completed?'✓':'↗')+' '+p.best+'πτ';card.appendChild(b);}});}catch(e){}}
  document.getElementById('ous-es').textContent=_ousState.score;
  const log=document.getElementById('ous-mistakes-log');
  if(!_ousState.mistakes.length){log.innerHTML=`<p style="color:#27ae60;text-align:center;font-style:italic;">${siteLang==='en'?'Perfect! No mistakes! 🎉':'Τέλειο! Κανένα λάθος! 🎉'}</p>`;}
  else{let h=`<div class="lmistakes-hdr">${siteLang==='en'?'Mistakes':'Λάθη'}: ${_ousState.mistakes.length}</div><div class="lmistakes-list">`;_ousState.mistakes.forEach(m=>{h+=`<div class="lmistake-row"><div class="lm-q">${m.noun} — ${m.caseLabel} ${m.num}</div><div class="lm-ans"><span class="lm-wrong">${m.typed}</span><span style="color:#8a7a60;">→</span><span class="lm-correct">${m.correct}</span></div></div>`;});h+='</div>';log.innerHTML=h;}
  _ousShowScreen('ous-screen-end');
}
window.OUS_LEVELS = OUS_LEVELS;
