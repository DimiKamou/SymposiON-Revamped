const WINS=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
const LETTERS=['A','B','C','D'];
let lang='gr',selectedMode='solo',selectedRhapsodies=[],allRhapSelected=false;
let questionPool=[],usedQs=[],playerNames={X:'Team Achilles',O:'Team Hector'};
let sScore=0,sStreak=0,sLives=3,sLLLeft=3,sQNum=0,sAnswered=false,sGameOver=false,sCurrentQ=null,sTimer=null,sTimerLeft=20;
let board=Array(9).fill(null),currentTurn='X',placingMode=false,tAnswered=false,tGameOver=false;
let tscores={X:0,O:0},tTimer=null,tTimerLeft=20,tCurrentQ=null,lifelines={X:true,O:true};
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function setLang(l){lang=l;document.getElementById('game-root').querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));const b=document.querySelector(`#game-root .lang-btn[onclick="setLang('${l}')"]`);if(b)b.classList.add('active');document.getElementById('ol-gr').classList.toggle('active',l==='gr');document.getElementById('ol-en').classList.toggle('active',l==='en');applyLang();}
function applyLang(){document.getElementById('game-root').querySelectorAll('[data-en]').forEach(el=>{el.textContent=lang==='en'?el.dataset.en:el.dataset.gr;});}
function buildRhapGrid(){const grid=document.getElementById('rhap-grid');grid.innerHTML='';const _R=(window.RHAPSODIES||RHAPSODIES),_Q=(window.QUESTIONS||QUESTIONS);_R.forEach(r=>{const btn=document.createElement('button');btn.className='rhap-btn';const hasQ=(_Q.en&&_Q.en[r]&&_Q.en[r].length>0)||(_Q.gr&&_Q.gr[r]&&_Q.gr[r].length>0);if(!hasQ)btn.classList.add('locked');btn.innerHTML=r+(hasQ?'':'<span class="coming">soon</span>');if(!hasQ)btn.disabled=true;else btn.addEventListener('click',()=>toggleRhap(r,btn));grid.appendChild(btn);});}
function toggleRhap(r,btn){allRhapSelected=false;document.getElementById('rhap-all-btn').classList.remove('selected');if(selectedRhapsodies.includes(r)){selectedRhapsodies=selectedRhapsodies.filter(x=>x!==r);btn.classList.remove('selected');}else{selectedRhapsodies.push(r);btn.classList.add('selected');}updateStartBtn();}
function toggleAllRhap(){allRhapSelected=!allRhapSelected;selectedRhapsodies=[];document.getElementById('rhap-all-btn').classList.toggle('selected',allRhapSelected);document.querySelectorAll('#rhap-grid .rhap-btn').forEach(b=>b.classList.remove('selected'));updateStartBtn();}
function updateStartBtn(){document.getElementById('start-btn').disabled=!(allRhapSelected||selectedRhapsodies.length>0);}
function selectMode(m){selectedMode=m;document.getElementById('game-root').querySelectorAll('.mode-card').forEach(c=>c.classList.remove('selected'));document.querySelector(`#game-root .mode-card[data-mode="${m}"]`).classList.add('selected');document.getElementById('field-p2').style.display=(m==='solo')?'none':'';}
function buildQuestionPool(){const _Q=(window.QUESTIONS||QUESTIONS);const qs=_Q[lang]||_Q.gr||{};let pool=[];if(allRhapSelected){Object.values(qs).forEach(arr=>pool.push(...arr));}else{selectedRhapsodies.forEach(r=>{if(qs[r])pool.push(...qs[r]);});if(pool.length===0&&qs['all'])pool=[...qs['all']];}if(pool.length===0&&qs['all'])pool=[...qs['all']];questionPool=shuffle([...pool]);usedQs=[];}
function getQ(){if(usedQs.length>=questionPool.length){questionPool=shuffle([...questionPool]);usedQs=[];}let idx=0;while(usedQs.includes(idx)&&idx<questionPool.length)idx++;usedQs.push(idx);return{...questionPool[idx]};}
function showGameScreen(id){document.getElementById('game-root').querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));document.getElementById(id).classList.add('active');}
function startGame(){const nx=document.getElementById('setup-name-x').value.trim()||'Team Achilles';const no=document.getElementById('setup-name-o').value.trim()||'Team Hector';playerNames={X:nx,O:no};document.getElementById('disp-name-x').textContent=nx;document.getElementById('disp-name-o').textContent=no;document.getElementById('ws-nm-x').textContent=nx;document.getElementById('ws-nm-o').textContent=no;buildQuestionPool();if(selectedMode==='tow'){if(typeof closeGame==='function')closeGame();if(typeof towLaunchFromTrivia==='function'){towLaunchFromTrivia(nx,no,questionPool,lang);}else if(typeof openTow==='function'){openTow();}return;}if(selectedMode==='solo')startSolo();else startTTT();}
function startSolo(){sScore=0;sStreak=0;sLives=3;sLLLeft=3;sQNum=0;sGameOver=false;showGameScreen('screen-solo');document.getElementById('solo-mode-title').textContent=lang==='en'?'Solo Quest':'Σόλο Αποστολή';updateSoloHUD();soloNextQuestion();}
function updateSoloHUD(){document.getElementById('s-score').textContent=sScore;document.getElementById('s-streak').textContent=sStreak;const hs=parseInt(localStorage.getItem('iliad_hs')||'0');document.getElementById('s-hs').textContent=Math.max(hs,sScore);document.getElementById('s-lives').textContent=sLives>0?'❤'.repeat(sLives):'✗';document.getElementById('s-ll-btn').disabled=sLLLeft<=0;document.getElementById('s-ll-remaining').textContent=`(${sLLLeft})`;}
function soloNextQuestion(){if(sGameOver)return;sAnswered=false;sCurrentQ=getQ();sQNum++;document.getElementById('s-q-num').textContent=lang==='en'?`Question ${sQNum}`:`Ερώτηση ${sQNum}`;document.getElementById('s-q-text').textContent=sCurrentQ.q;document.getElementById('s-feedback').className='solo-feedback';const ans=document.getElementById('s-answers');ans.innerHTML='';sCurrentQ.opts.forEach((opt,i)=>{const btn=document.createElement('button');btn.className='solo-ans-btn';btn.innerHTML=`<span class="solo-ans-letter">${LETTERS[i]}.</span>${opt}`;btn.addEventListener('click',()=>soloHandleAnswer(i,btn));ans.appendChild(btn);});soloStartTimer();}
function soloStartTimer(){soloStopTimer();sTimerLeft=20;soloUpdateTimer();sTimer=setInterval(()=>{sTimerLeft--;soloUpdateTimer();if(sTimerLeft<=0){soloStopTimer();soloTimerExpired();}},1000);}
function soloStopTimer(){if(sTimer){clearInterval(sTimer);sTimer=null;}}
function soloUpdateTimer(){const pct=(sTimerLeft/20)*100;const bar=document.getElementById('solo-timer-bar');bar.style.width=pct+'%';bar.style.background=sTimerLeft>10?'var(--gold)':sTimerLeft>5?'#E8A030':'#C96B6B';document.getElementById('solo-timer-num').textContent=sTimerLeft;}
function soloTimerExpired(){if(sAnswered)return;sAnswered=true;document.querySelectorAll('#s-answers .solo-ans-btn').forEach((b,i)=>{b.disabled=true;if(i===sCurrentQ.ans)b.classList.add('correct');});sStreak=0;sLives--;const fb=document.getElementById('s-feedback');fb.textContent=lang==='en'?`Time's up! ${sCurrentQ.opts[sCurrentQ.ans]}`:`Έληξε! ${sCurrentQ.opts[sCurrentQ.ans]}`;fb.className='solo-feedback bad show';updateSoloHUD();if(sLives<=0){setTimeout(soloGameOver,2000);return;}setTimeout(soloNextQuestion,2400);}
function soloHandleAnswer(chosen,btn){if(sAnswered||sGameOver)return;sAnswered=true;soloStopTimer();document.querySelectorAll('#s-answers .solo-ans-btn').forEach((b,i)=>{b.disabled=true;if(i===sCurrentQ.ans)b.classList.add('correct');});const fb=document.getElementById('s-feedback');if(chosen===sCurrentQ.ans){sStreak++;const bonus=sStreak>1?(sStreak-1)*5:0;sScore+=10+bonus;fb.textContent=lang==='en'?`Correct! +${10+bonus}`:` Σωστό! +${10+bonus}`;fb.className='solo-feedback ok show';updateSoloHUD();setTimeout(soloNextQuestion,1600);}else{btn.classList.add('wrong');sStreak=0;sLives--;fb.textContent=lang==='en'?`Wrong! ${sCurrentQ.opts[sCurrentQ.ans]}`:`Λάθος! ${sCurrentQ.opts[sCurrentQ.ans]}`;fb.className='solo-feedback bad show';if(typeof logStudentMistake==='function')logStudentMistake(typeof _triviaGameId!=='undefined'?_triviaGameId:'iliada-trivia','mythos','trivia',{q:sCurrentQ.q,a:sCurrentQ.opts[sCurrentQ.ans]},sCurrentQ.opts[chosen]);updateSoloHUD();if(sLives<=0){setTimeout(soloGameOver,2000);return;}setTimeout(soloNextQuestion,2400);}}
function soloUseFiftyFifty(){if(sLLLeft<=0||sAnswered||!sCurrentQ)return;sLLLeft--;updateSoloHUD();const wrong=sCurrentQ.opts.map((_,i)=>i).filter(i=>i!==sCurrentQ.ans);const remove=shuffle(wrong).slice(0,2);document.querySelectorAll('#s-answers .solo-ans-btn').forEach((btn,i)=>{if(remove.includes(i)){btn.classList.add('eliminated');btn.disabled=true;}});}
function soloGameOver(){sGameOver=true;soloStopTimer();if(typeof awardGameRewards==='function'&&sScore>0){awardGameRewards(typeof _triviaGameId!=='undefined'?_triviaGameId:'iliada-trivia',{score:sScore,perfect:sLives===3});}const hs=parseInt(localStorage.getItem('iliad_hs')||'0');const newHs=Math.max(hs,sScore);const isNewHs=sScore>hs;localStorage.setItem('iliad_hs',newHs);document.getElementById('winner-crown').textContent=sScore===0?'💀':isNewHs?'🏆':'⚔';document.getElementById('winner-title').textContent=isNewHs?(lang==='en'?'New High Score!':'Νέο Ρεκόρ!'):(lang==='en'?'Game Over':'Τέλος');document.getElementById('winner-title').style.color=isNewHs?'var(--gold-l)':'var(--txt)';const quotes=lang==='en'?QUOTES_EN:QUOTES_GR;document.getElementById('winner-quote').textContent=quotes[Math.floor(Math.random()*quotes.length)];document.getElementById('sf-score').textContent=sScore;document.getElementById('sf-qs').textContent=sQNum;document.getElementById('sf-hs').textContent=newHs;document.getElementById('sf-hs').className='solo-fs-val'+(isNewHs?' new-hs':'');document.getElementById('winner-scores-wrap').style.display='none';document.getElementById('solo-final-wrap').style.display='flex';document.getElementById('winner-overlay').className='winner-overlay show';
  // ── Score Tracker: Firestore leaderboard, comparison, share ──
  if(typeof ScoreTracker!=='undefined'){
    setTimeout(()=>{
      const modal=document.querySelector('#winner-overlay .winner-modal');
      if(!modal)return;
      modal.classList.add('sct-active');
      ScoreTracker.submit({
        gameId:      'iliada-trivia',
        gameTitle:   lang==='en'?'Iliad Trivia — Solo':'Trivia Ιλιάδας — Σόλο',
        score:       sScore,
        timerSecs:   20,
        lives:       3,
        containerEl: modal,
        insertBefore:modal.querySelector('.modal-btns'),
        lang:        lang,
      });
    },150);
  }
}
function startTTT(){board=Array(9).fill(null);tscores={X:0,O:0};currentTurn='X';placingMode=false;tAnswered=false;tGameOver=false;lifelines={X:true,O:true};showGameScreen('screen-game');document.getElementById('game-title').textContent=selectedMode==='speed'?(lang==='en'?'Speed TTT':'Ταχύτητα TTT'):(lang==='en'?'Classic TTT':'Κλασικό TTT');document.getElementById('score-x').textContent='0';document.getElementById('score-o').textContent='0';document.getElementById('main-game-wrap').style.display='';document.getElementById('speed-setup-view').style.display='none';if(selectedMode==='speed'){document.getElementById('main-game-wrap').style.display='none';document.getElementById('speed-setup-view').style.display='flex';document.getElementById('speed-role-pick').style.display='flex';document.getElementById('speed-host-view').style.display='none';document.getElementById('speed-join-view').style.display='none';return;}document.getElementById('lifelines-row').style.display='flex';document.getElementById('ll-btn-x').disabled=false;document.getElementById('ll-btn-o').disabled=false;document.getElementById('timer-wrap').style.display='flex';renderBoard();tShowQuestion();}
function tShowQuestion(){if(tGameOver)return;placingMode=false;tAnswered=false;tCurrentQ=getQ();document.getElementById('placing-prompt').className='placing-prompt';document.getElementById('feedback').className='feedback-bar';document.getElementById('q-text').textContent=tCurrentQ.q;const ans=document.getElementById('answers');ans.innerHTML='';tCurrentQ.opts.forEach((opt,i)=>{const btn=document.createElement('button');btn.className='ans-btn';btn.innerHTML=`<span class="ans-letter">${LETTERS[i]}.</span>${opt}`;btn.addEventListener('click',()=>tHandleAnswer(i,btn));ans.appendChild(btn);});tUpdateCards();document.getElementById('turn-indicator').textContent=`${playerNames[currentTurn]} — ${lang==='en'?'answer':'απάντησε'}`;tStartTimer();}
function tStartTimer(){tStopTimer();tTimerLeft=20;tUpdateTimer();tTimer=setInterval(()=>{tTimerLeft--;tUpdateTimer();if(tTimerLeft<=0){tStopTimer();tTimerExpired();}},1000);}
function tStopTimer(){if(tTimer){clearInterval(tTimer);tTimer=null;}}
function tUpdateTimer(){const pct=(tTimerLeft/20)*100;const bar=document.getElementById('timer-bar');bar.style.width=pct+'%';bar.style.background=tTimerLeft>10?'var(--gold)':tTimerLeft>5?'#E8A030':'#C96B6B';document.getElementById('timer-num').textContent=tTimerLeft;}
function tTimerExpired(){if(tAnswered)return;tAnswered=true;document.querySelectorAll('#answers .ans-btn').forEach((b,i)=>{b.disabled=true;if(i===tCurrentQ.ans)b.classList.add('correct');});document.getElementById('feedback').textContent=lang==='en'?'Time\'s up!':'Έληξε!';document.getElementById('feedback').className='feedback-bar bad show';currentTurn=currentTurn==='X'?'O':'X';tUpdateCards();setTimeout(tShowQuestion,2200);}
function tHandleAnswer(chosen,btn){if(tAnswered||tGameOver)return;tAnswered=true;tStopTimer();document.querySelectorAll('#answers .ans-btn').forEach((b,i)=>{b.disabled=true;if(i===tCurrentQ.ans)b.classList.add('correct');});const fb=document.getElementById('feedback');if(chosen===tCurrentQ.ans){btn.classList.add('correct');fb.textContent=lang==='en'?'Correct! Choose a square.':'Σωστό! Επίλεξε τετράγωνο.';fb.className='feedback-bar ok show';placingMode=true;document.getElementById('placing-prompt').className='placing-prompt show';renderBoard();document.getElementById('turn-indicator').textContent=`${playerNames[currentTurn]} — ${lang==='en'?'pick square':'επίλεξε'}`;}else{btn.classList.add('wrong');fb.textContent=(lang==='en'?'Wrong! ':'Λάθος! ')+tCurrentQ.opts[tCurrentQ.ans];fb.className='feedback-bar bad show';currentTurn=currentTurn==='X'?'O':'X';tUpdateCards();setTimeout(tShowQuestion,2200);}}
function tUpdateCards(){document.getElementById('card-x').className='player-card'+(currentTurn==='X'?' active-x':'');document.getElementById('card-o').className='player-card'+(currentTurn==='O'?' active-o':'');}
function placeSymbol(i){if(!placingMode||board[i]||tGameOver)return;board[i]=currentTurn;placingMode=false;document.getElementById('placing-prompt').className='placing-prompt';const result=checkWinner(board);if(result){renderBoard(result.line);if(result.winner!=='draw'){tscores[result.winner]++;document.getElementById('score-x').textContent=tscores.X;document.getElementById('score-o').textContent=tscores.O;}setTimeout(()=>tShowWinner(result),600);return;}currentTurn=currentTurn==='X'?'O':'X';renderBoard();setTimeout(tShowQuestion,600);}
function checkWinner(b){for(let[a,c,d]of WINS){if(b[a]&&b[a]===b[c]&&b[a]===b[d])return{winner:b[a],line:[a,c,d]};}if(b.every(x=>x))return{winner:'draw',line:[]};return null;}
function renderBoard(winLine=[]){const el=document.getElementById('board');el.innerHTML='';for(let i=0;i<9;i++){const c=document.createElement('div');c.className='cell'+(board[i]==='X'?' cx':board[i]==='O'?' co':'')+(winLine.includes(i)?' win':'');c.textContent=board[i]==='X'?'✕':board[i]==='O'?'○':'';if(placingMode&&!board[i]){c.classList.add('placeable');c.addEventListener('click',()=>placeSymbol(i));}el.appendChild(c);}}
function useFiftyFifty(sym){if(!lifelines[sym]||tAnswered||!tCurrentQ)return;lifelines[sym]=false;document.getElementById(`ll-btn-${sym.toLowerCase()}`).disabled=true;const wrong=tCurrentQ.opts.map((_,i)=>i).filter(i=>i!==tCurrentQ.ans);const remove=shuffle(wrong).slice(0,2);document.querySelectorAll('#answers .ans-btn').forEach((btn,i)=>{if(remove.includes(i)){btn.classList.add('eliminated');btn.disabled=true;}});}
function tShowWinner(result){tGameOver=true;tStopTimer();document.getElementById('ws-nm-x').textContent=playerNames.X;document.getElementById('ws-nm-o').textContent=playerNames.O;document.getElementById('ws-sc-x').textContent=tscores.X;document.getElementById('ws-sc-o').textContent=tscores.O;const quotes=lang==='en'?QUOTES_EN:QUOTES_GR;if(result.winner==='draw'){document.getElementById('winner-crown').textContent='⚖';document.getElementById('winner-title').textContent=lang==='en'?'Stalemate!':'Ισοπαλία!';document.getElementById('winner-title').style.color='var(--gold)';document.getElementById('winner-quote').textContent=lang==='en'?'"Equal."':'"Ίσοι."';}else{document.getElementById('winner-crown').textContent='🏆';document.getElementById('winner-title').textContent=lang==='en'?`${playerNames[result.winner]} Wins!`:`${playerNames[result.winner]} Νικάει!`;document.getElementById('winner-title').style.color=result.winner==='X'?'var(--xc)':'var(--oc)';document.getElementById('winner-quote').textContent=quotes[Math.floor(Math.random()*quotes.length)];}document.getElementById('winner-scores-wrap').style.display='flex';document.getElementById('solo-final-wrap').style.display='none';document.getElementById('winner-overlay').className='winner-overlay show';}
function goHome(){soloStopTimer();tStopTimer();const m=document.querySelector('#winner-overlay .winner-modal');if(m)m.classList.remove('sct-active');showGameScreen('screen-setup');}
function playAgain(){document.getElementById('winner-overlay').className='winner-overlay';const m=document.querySelector('#winner-overlay .winner-modal');if(m)m.classList.remove('sct-active');if(selectedMode==='solo'){startSolo();}else{board=Array(9).fill(null);tGameOver=false;placingMode=false;tAnswered=false;currentTurn='X';tscores={X:0,O:0};lifelines={X:true,O:true};document.getElementById('ll-btn-x').disabled=false;document.getElementById('ll-btn-o').disabled=false;document.getElementById('score-x').textContent='0';document.getElementById('score-o').textContent='0';buildQuestionPool();renderBoard();tShowQuestion();}}
function hostSpeedGame(){const code=Math.random().toString(36).substring(2,8).toUpperCase();document.getElementById('room-code-display').textContent=code;document.getElementById('speed-role-pick').style.display='none';document.getElementById('speed-host-view').style.display='flex';}
function showJoinForm(){document.getElementById('speed-role-pick').style.display='none';document.getElementById('speed-join-view').style.display='flex';}
function simulateOpponentJoin(){document.getElementById('speed-setup-view').style.display='none';document.getElementById('main-game-wrap').style.display='';document.getElementById('timer-wrap').style.display='flex';renderBoard();tShowQuestion();}
function joinRoom(){document.getElementById('speed-setup-view').style.display='none';document.getElementById('main-game-wrap').style.display='';renderBoard();tShowQuestion();}
function injectGameHTML(){document.getElementById('game-root').innerHTML=`
<div id="screen-setup" class="screen active">
<div class="setup-header">
  <div class="setup-ornament" data-en="⚔ Homer's Epic ⚔" data-gr="⚔ Ομηρικό Έπος ⚔">⚔ Ομηρικό Έπος ⚔</div>
  <div class="setup-title" data-en="Iliad Trivia" data-gr="Trivia Ιλιάδας">Trivia Ιλιάδας</div>
  <div class="setup-sub" data-en="A game of epic knowledge" data-gr="Ένα παιχνίδι επικής γνώσης">Ένα παιχνίδι επικής γνώσης</div>
  <div class="setup-divider"><div class="setup-divider-line"></div><div class="setup-diamond"></div><div class="setup-divider-line"></div></div>
  <button class="game-share-btn" onclick="showQR('Ιλιάδα Trivia',{nav:'game',id:'iliada-trivia'})">📱 <span data-en="Share with class" data-gr="Μοιράσου στην τάξη">Μοιράσου στην τάξη</span></button>
  <div class="lang-toggle-g">
    <button class="lang-btn" onclick="setLang('en')">English</button>
    <button class="lang-btn active" onclick="setLang('gr')">Ελληνικά</button>
  </div>
</div>
<div class="setup-body">
  <div class="setup-section">
    <div class="setup-section-title" data-en="Player Name" data-gr="Όνομα Παίκτη">Όνομα Παίκτη</div>
    <div class="player-inputs">
      <div class="player-field"><label data-en="Player 1" data-gr="Παίκτης 1">Παίκτης 1</label><input id="setup-name-x" maxlength="20" placeholder="Team Achilles"/></div>
      <div class="player-field" id="field-p2"><label data-en="Player 2" data-gr="Παίκτης 2">Παίκτης 2</label><input id="setup-name-o" maxlength="20" placeholder="Team Hector"/></div>
    </div>
  </div>
  <div class="setup-section">
    <div class="setup-section-title" data-en="Select Rhapsodies" data-gr="Επιλογή Ραψωδιών">Επιλογή Ραψωδιών</div>
    <div class="rhap-note" data-en="Choose rhapsodies or the full Iliad." data-gr="Επίλεξε ραψωδίες ή ολόκληρη την Ιλιάδα.">Επίλεξε ραψωδίες ή ολόκληρη την Ιλιάδα.</div>
    <div class="rhap-grid" id="rhap-grid"></div>
    <button class="rhap-all-btn" id="rhap-all-btn" onclick="toggleAllRhap()"><span data-en="Whole Iliad" data-gr="Ολόκληρη η Ιλιάδα">Ολόκληρη η Ιλιάδα</span></button>
  </div>
  <div class="setup-section">
    <div class="setup-section-title" data-en="Game Mode" data-gr="Τρόπος Παιχνιδιού">Τρόπος Παιχνιδιού</div>
    <div class="mode-grid">
      <div class="mode-card selected" data-mode="solo" onclick="selectMode('solo')"><div class="mode-icon">🏺</div><div class="mode-name" data-en="Solo Quest" data-gr="Σόλο">Σόλο</div><div class="mode-desc" data-en="Answer one by one. 3 lifelines." data-gr="3 βοήθειες. Σπάσε το ρεκόρ σου.">3 βοήθειες. Σπάσε το ρεκόρ σου.</div></div>
      <div class="mode-card" data-mode="classic" onclick="selectMode('classic')"><div class="mode-icon">⚔️</div><div class="mode-name" data-en="Classic TTT" data-gr="Κλασικό TTT">Κλασικό TTT</div><div class="mode-desc" data-en="2 players, take turns." data-gr="2 παίκτες, εναλλαγή.">2 παίκτες, εναλλαγή.</div></div>
      <div class="mode-card" data-mode="speed" onclick="selectMode('speed')"><div class="mode-icon">⚡</div><div class="mode-name" data-en="Speed TTT" data-gr="Ταχύτητα TTT">Ταχύτητα TTT</div><div class="mode-desc" data-en="Fastest answer wins." data-gr="Ο πιο γρήγορος κερδίζει.">Ο πιο γρήγορος κερδίζει.</div></div>
      <div class="mode-card" data-mode="tow" onclick="selectMode('tow')"><div class="mode-icon">⚖️</div><div class="mode-name" data-en="Tug of War" data-gr="Tug of War">Tug of War</div><div class="mode-desc" data-en="2 teams — rope moves with every correct answer." data-gr="2 ομάδες — το σχοινί κινείται με κάθε σωστή απάντηση.">2 ομάδες — το σχοινί κινείται με κάθε σωστή απάντηση.</div></div>
    </div>
  </div>
  <button class="start-btn" id="start-btn" onclick="startGame()" disabled data-en="Begin — Enter the Battle" data-gr="Έναρξη — Μπες στη Μάχη">Έναρξη — Μπες στη Μάχη</button>
</div>
</div>
<div id="screen-solo" class="screen">
  <div class="solo-header"><button class="back-btn" onclick="goHome()" data-en="← Home" data-gr="← Αρχική">← Αρχική</button><div class="solo-title" id="solo-mode-title">Σόλο</div><div style="width:60px"></div></div>
  <div class="solo-score-strip"><div class="solo-stat"><div class="solo-stat-label" data-en="Score" data-gr="Σκορ">Σκορ</div><div class="solo-stat-val" id="s-score">0</div></div><div class="solo-stat"><div class="solo-stat-label" data-en="Streak" data-gr="Σειρά">Σειρά</div><div class="solo-stat-val" id="s-streak">0</div></div><div class="solo-stat"><div class="solo-stat-label" data-en="High Score" data-gr="Ρεκόρ">Ρεκόρ</div><div class="solo-stat-val" id="s-hs">0</div></div><div class="solo-stat"><div class="solo-stat-label" data-en="Lives" data-gr="Ζωές">Ζωές</div><div class="solo-stat-val" id="s-lives">❤❤❤</div></div></div>
  <div class="solo-timer-wrap"><span class="solo-timer-label" data-en="TIME" data-gr="ΧΡΟΝΟΣ">ΧΡΟΝΟΣ</span><div class="timer-bar-bg"><div class="timer-bar" id="solo-timer-bar" style="width:100%"></div></div><span class="timer-num" id="solo-timer-num">20</span></div>
  <div class="solo-q-wrap"><div class="solo-q-card"><div class="solo-q-num" id="s-q-num">Ερώτηση 1</div><div class="solo-q-text" id="s-q-text">...</div></div></div>
  <div class="solo-answers" id="s-answers"></div>
  <div class="solo-feedback" id="s-feedback"></div>
  <div class="solo-lifeline-bar"><span class="ll-label-solo">50/50:</span><button class="ll-btn-solo" id="s-ll-btn" onclick="soloUseFiftyFifty()" data-en="Use lifeline" data-gr="Χρήση">Χρήση</button><span id="s-ll-remaining" style="font-family:'Cinzel',serif;font-size:.7rem;color:var(--txt-m)"></span></div>
</div>
<div id="screen-game" class="screen">
  <div class="game-header"><button class="back-btn" onclick="goHome()" data-en="← Home" data-gr="← Αρχική">← Αρχική</button><div class="game-title" id="game-title">TTT</div><div style="width:60px"></div></div>
  <div id="speed-setup-view" class="speed-setup" style="display:none">
    <div id="speed-role-pick" style="display:flex;flex-direction:column;gap:1rem;align-items:center">
      <div style="font-family:'Cinzel',serif;font-size:1.1rem;color:var(--gold)">Αγώνας Ταχύτητας</div>
      <div style="display:flex;gap:1rem"><button class="gold-btn" onclick="hostSpeedGame()">Δημιουργία</button><button class="gold-btn" style="background:var(--surf2);color:var(--gold);border:1px solid var(--brd)" onclick="showJoinForm()">Σύνδεση</button></div>
    </div>
    <div id="speed-host-view" style="display:none;flex-direction:column;align-items:center;gap:1rem"><div style="font-family:'Cinzel',serif;font-size:.9rem;color:var(--txt-m)">ΚΩΔΙΚΟΣ</div><div class="speed-code-box"><div class="speed-code" id="room-code-display">------</div></div><div class="speed-waiting">Αναμονή...</div><button class="gold-btn" onclick="simulateOpponentJoin()">Demo σύνδεση</button></div>
    <div id="speed-join-view" style="display:none;flex-direction:column;align-items:center;gap:1rem"><input class="join-input" id="join-code-input" maxlength="6" placeholder="ABC123" oninput="this.value=this.value.toUpperCase()"/><button class="gold-btn" onclick="joinRoom()">Σύνδεση</button></div>
  </div>
  <div class="game-wrap" id="main-game-wrap">
    <div class="score-panel">
      <div class="player-card" id="card-x"><div class="player-symbol x-sym">✕</div><div class="player-info"><div class="player-label-sm">Παίκτης 1</div><div class="player-name" id="disp-name-x">Team Achilles</div></div><div class="player-score score-x" id="score-x">0</div></div>
      <div class="player-card" id="card-o"><div class="player-symbol o-sym">○</div><div class="player-info"><div class="player-label-sm">Παίκτης 2</div><div class="player-name" id="disp-name-o">Team Hector</div></div><div class="player-score score-o" id="score-o">0</div></div>
      <div class="lifelines-row" id="lifelines-row" style="display:none"><span class="ll-label">50/50:</span><button class="ll-btn" id="ll-btn-x" onclick="useFiftyFifty('X')">Χρήση (X)</button><button class="ll-btn" id="ll-btn-o" onclick="useFiftyFifty('O')">Χρήση (O)</button></div>
      <div class="timer-wrap" id="timer-wrap" style="display:none"><span class="timer-label" data-en="TIME" data-gr="ΧΡΟΝΟΣ">ΧΡΟΝΟΣ</span><div class="timer-bar-bg"><div class="timer-bar" id="timer-bar" style="width:100%"></div></div><span class="timer-num" id="timer-num">20</span></div>
      <div class="turn-indicator" id="turn-indicator">...</div>
    </div>
    <div class="board-section"><div class="board" id="board"></div><div class="placing-prompt" id="placing-prompt">— Επίλεξε τετράγωνο —</div></div>
    <div class="question-area"><div class="question-card"><div class="q-label">Απάντησε για να κερδίσεις κίνηση</div><div class="q-text" id="q-text">...</div><div class="answers" id="answers"></div><div class="feedback-bar" id="feedback"></div></div></div>
  </div>
</div>
<div class="winner-overlay" id="winner-overlay">
  <div class="winner-modal">
    <div class="winner-crown" id="winner-crown">🏆</div>
    <div class="winner-title" id="winner-title"></div>
    <div class="winner-quote" id="winner-quote"></div>
    <div class="winner-scores" id="winner-scores-wrap" style="display:none"><div class="ws-card"><div class="ws-nm" id="ws-nm-x"></div><div class="ws-val ws-x" id="ws-sc-x">0</div></div><div class="ws-card"><div class="ws-nm" id="ws-nm-o"></div><div class="ws-val ws-o" id="ws-sc-o">0</div></div></div>
    <div class="solo-final-scores" id="solo-final-wrap" style="display:none"><div class="solo-fs-card"><div class="solo-fs-label" data-en="Score" data-gr="Σκορ">Σκορ</div><div class="solo-fs-val" id="sf-score">0</div></div><div class="solo-fs-card"><div class="solo-fs-label" data-en="Questions" data-gr="Ερωτήσεις">Ερωτήσεις</div><div class="solo-fs-val" id="sf-qs">0</div></div><div class="solo-fs-card"><div class="solo-fs-label" data-en="High Score" data-gr="Ρεκόρ">Ρεκόρ</div><div class="solo-fs-val" id="sf-hs">0</div></div></div>
    <div class="modal-btns"><button class="play-again-btn" onclick="playAgain()" data-en="Play Again" data-gr="Παίξε Ξανά">Παίξε Ξανά</button><button class="home-btn" onclick="goHome()">← Μενού</button></div>
  </div>
</div>`;}
function initGame(l){injectGameHTML();lang=l;soloStopTimer();tStopTimer();board=Array(9).fill(null);sScore=0;sStreak=0;sLives=3;sLLLeft=3;sQNum=0;sGameOver=false;tGameOver=false;document.getElementById('winner-overlay').className='winner-overlay';showGameScreen('screen-setup');applyLang();buildRhapGrid();updateStartBtn();selectMode('solo');document.getElementById('game-root').querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));const ab=document.querySelector(`#game-root .lang-btn[onclick="setLang('${l}')"]`);if(ab)ab.classList.add('active');}
