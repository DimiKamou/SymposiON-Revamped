/* engine.js — playable Iliada Arcade.
   Side-scrolling camera + parallax world, fixed-step loop, sword slashes,
   ranged (spears/arrows), shield BLOCK + timed PARRY, ult, HP/Rage potions,
   per-round buffs/debuffs, selectable wave count, mini-boss champions, quiz. */
(function(){
'use strict';
const W=1600, H=900, GY=window.GROUND_Y, WORLD_W=window.WORLD_W||3400;
const D=window.DRAW;

let canvas, ctx, hud, last=0, acc=0, gameT=0;
let campaignKey='iliada', rhapKey='alpha', C, R;
let state='play'; let shake=0, flash=0, camX=0;
let totalWaves=5;
let bgActive=false, lastBgKey='';

const keys={};
const player={};
let enemies=[], projectiles=[], fx=[], items=[], boss=null;
let wave=0, waveDefs=[], spawnQueue=[], spawnTimer=0, betweenWave=0, quizIdx=0;
let score=0, combo=0, comboTimer=0, kills=0;
let rain=null;
let difficulty='med'; const DMG_SCALE={easy:0.5, med:0.78, hard:1.1};
let quizQueue=[], quizCur=null, quizTimer=0, quizTimerMax=12, quizCorrect=0, quizTotal=0;
let quizCorrectAll=0, quizTotalAll=0, paused=false;
function bestKey(){ return 'ia_best_'+campaignKey+'_'+rhapKey; }
function getBest(){ try{ return +(localStorage.getItem(bestKey())||0); }catch(e){ return 0; } }
function setBest(v){ try{ localStorage.setItem(bestKey(), v); }catch(e){} }

/* ---------- wave generation ---------- */
function buildWaveDefs(n){
  const defs=[];
  const champEvery = Math.max(2, Math.floor(n/3));
  for(let i=0;i<n-1;i++){
    const per = Math.max(2, Math.round(13/n));
    const archers = i>=1 ? Math.max(0, Math.round(per*0.32)) : 0;
    const spearmen = i>=1 ? Math.max(0, Math.round(per*0.30)) : 0;
    const soldiers = Math.max(1, per - archers - spearmen);
    const champion = (i>0 && i%champEvery===0) ? 1 : 0;
    defs.push({ soldiers, archers, spearmen, champion });
  }
  defs.push({ boss:true, soldiers:Math.max(1,Math.round(6/n)), archers:1, spearmen: n>=5?1:0, champion: n>=6?1:0 });
  return defs;
}

/* ---------- setup ---------- */
function setup(){
  C=window.GAME_DATA[campaignKey]; R=C.rhaps[rhapKey];
  mountBg();
  state='play'; gameT=0; score=0; combo=0; kills=0; wave=0; shake=0; flash=0; camX=0; quizIdx=0;
  enemies=[]; projectiles=[]; fx=[]; items=[]; boss=null; spawnQueue=[]; betweenWave=0; rain=null;
  quizQueue=[]; quizCur=null; quizTimer=0; quizCorrectAll=0; quizTotalAll=0; paused=false;
  const po=document.getElementById('pauseOverlay'); if(po) po.classList.remove('show');
  Object.assign(player,{ x:300, y:GY, vx:0, vy:0, onGround:true, facing:1, walk:0,
    hp:100, maxHp:100, ult:0, swing:0, swingDir:1, swordCd:0,
    ammoBase:C.ranged.ammo, ammo:C.ranged.ammo, ammoTimer:0,
    hurt:0, inv:0, dead:false, blocking:false, blockT:0, shoot:0,
    pots:{hp:2, rage:1}, mod:null });
  waveDefs=buildWaveDefs(totalWaves);
  startWave(0);
  applyWeaponLabel(); updateHUD();
}
function ammoMax(){ return Math.max(1, player.ammoBase + ((player.mod&&player.mod.ammoBonus)||0)); }
function mountBg(){ if(!window.BG){ bgActive=false; return; } const sc=document.getElementById('bgScene'); if(!sc){ bgActive=false; return; }
  bgActive=true; const k=campaignKey+'/'+rhapKey; if(k===lastBgKey) return; lastBgKey=k; sc.classList.add('active');
  try{ if(campaignKey==='iliada') window.BG.troy(sc,rhapKey); else window.BG.palace(sc,rhapKey); }catch(e){ bgActive=false; } }

function startWave(i){
  wave=i; const def=waveDefs[i]; spawnQueue=[];
  const mk=(type,nn)=>{ for(let k=0;k<nn;k++) spawnQueue.push({type,t:0.5+k*0.7+Math.random()*0.5,side:Math.random()<0.7?1:-1}); };
  if(def.soldiers) mk('soldier',def.soldiers);
  if(def.archers) mk('archer',def.archers);
  if(def.spearmen) mk('spearman',def.spearmen);
  if(def.champion) spawnQueue.push({type:'champion',t:1.4,side:1});
  if(def.boss) spawnQueue.push({type:'boss',t:1.4,side:1});
  spawnQueue.sort((a,b)=>a.t-b.t); spawnTimer=0;
  toast(def.boss?('ΤΕΛΙΚΟ ΚΥΜΑ · '+R.boss.name):('ΚΥΜΑ '+(i+1)+'/'+totalWaves));
}

function spawnEnemy(type,side){
  const ex = side>0 ? camX+W+60 : camX-60;
  const exC = Math.max(40, Math.min(WORLD_W-40, ex));
  if(type==='boss'){
    const b=R.boss;
    boss={ boss:true, kind:b.kind, x: Math.min(WORLD_W-200, player.x+700), y:GY, facing:-1,
      hp:b.hp, maxHp:b.hp, tint:b.tint, crest:b.crest, eye:b.eye, wand:b.wand, arms:b.arms,
      weapon:b.weapon, scale:b.scale, ghost:b.ghost, walk:0, swing:0, hurt:0, stun:0,
      atkCd:1.6, rangedCd:2.6 };
    enemies.push(boss); shake=10; bossBanner(b.name, b.en); return;
  }
  if(type==='champion'){
    enemies.push({ type:'champion', x:exC, y:GY, facing:side>0?-1:1, hp:75, maxHp:75,
      tint:'#5A2E5E', crest:'#F0D89A', shieldColor:'#3A1E3E', emblem:'#F0D89A', scale:1.78, walk:0, swing:0, hurt:0, stun:0,
      atkCd:0.9+Math.random(), rangedCd:2.2+Math.random()*2, dmg:13, champion:true, shield:true });
    return;
  }
  if(type==='spearman'){
    enemies.push({ type:'spearman', x:exC, y:GY, facing:side>0?-1:1, hp:30, maxHp:30,
      tint:'#33506B', crest:'#A8C4DA', scale:1.5, walk:0, swing:0, hurt:0, stun:0,
      atkCd:1.0+Math.random(), throwCd:1.3+Math.random()*1.1, dmg:12, spearman:true, shield:false });
    return;
  }
  const isArch = type==='archer';
  enemies.push({ type, x:exC, y:GY, facing:side>0?-1:1,
    hp:isArch?20:32, maxHp:isArch?20:32,
    tint:isArch?'#3E5A30':R.enemy.tint, crest:isArch?'#B7D27A':'#C8542B',
    shieldColor:isArch?null:'#5E2C18', emblem:isArch?null:'#E2A867', shield:!isArch,
    scale:isArch?1.3:1.42,
    walk:0, swing:0, hurt:0, stun:0, atkCd:0.8+Math.random(), shootCd:1.2+Math.random()*1.5,
    dmg:8, kindRanged:isArch });
}
function lighten(hex){ const n=parseInt(hex.slice(1),16); const r=Math.min(255,((n>>16)&255)+40),g=Math.min(255,((n>>8)&255)+28),b=Math.min(255,(n&255)+18);
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1); }

/* ---------- input ---------- */
function bindInput(){
  addEventListener('keydown',e=>{ const k=e.key.toLowerCase(); window.SFX&&SFX.init();
    if(k==='escape'||k==='p'){ togglePause(); return; }
    if(['arrowleft','arrowright','arrowup',' ','j','k','l','u','a','d','w','q','e','r','f','g','1','2'].includes(k)) e.preventDefault();
    if(state==='paused') return;
    if(state!=='play'){ if((k===' '||k==='enter')&&(state==='won'||state==='lost')){ hideEnd(); setup(); } return; }
    if(!keys[k]){
      if(k===' '||k==='arrowup'||k==='w') jump();
      else if(k==='j'||k==='q') swordAttack();
      else if(k==='k'||k==='e') rangedAttack();
      else if(k==='l'||k==='r') startBlock();
      else if(k==='u'||k==='f') ultAttack();
      else if(k==='1'||k==='g') usePot('hp');
      else if(k==='2') usePot('rage');
    }
    keys[k]=true;
  });
  addEventListener('keyup',e=>{ const k=e.key.toLowerCase(); keys[k]=false; if(k==='l'||k==='r') player.blocking=false; });
}
function vbtn(el,onDown,opt){ opt=opt||{}; if(!el) return;
  el.addEventListener('pointerdown',e=>{ e.preventDefault(); window.SFX&&SFX.init(); el.classList.add('press'); if(opt.hold)keys[opt.hold]=true; if(opt.block)startBlock(); if(onDown)onDown(); });
  const up=()=>{ el.classList.remove('press'); if(opt.hold)keys[opt.hold]=false; if(opt.block)player.blocking=false; };
  el.addEventListener('pointerup',up); el.addEventListener('pointerleave',up); el.addEventListener('pointercancel',up);
}
/* analog joystick → drives keys.arrowleft/right + an analog magnitude */
let joyAxis=0;
function bindJoystick(){
  const base=hud.querySelector('#joy'); if(!base) return;
  const knob=base.querySelector('.joy-knob'); const R=46; let id=null;
  function setAxis(dx){ const c=Math.max(-R,Math.min(R,dx)); knob.style.transform='translate('+c+'px,0)';
    joyAxis = Math.abs(c)<8 ? 0 : c/R;
    keys['arrowleft'] = joyAxis<-0.15; keys['arrowright'] = joyAxis>0.15; }
  base.addEventListener('pointerdown',e=>{ e.preventDefault(); window.SFX&&SFX.init(); id=e.pointerId; base.setPointerCapture(id);
    base.classList.add('act'); const r=base.getBoundingClientRect(); setAxis(e.clientX-(r.left+r.width/2)); });
  base.addEventListener('pointermove',e=>{ if(e.pointerId!==id) return; const r=base.getBoundingClientRect(); setAxis(e.clientX-(r.left+r.width/2)); });
  const rel=e=>{ if(id!=null&&e.pointerId!==id) return; id=null; base.classList.remove('act'); joyAxis=0; knob.style.transform='translate(0,0)'; keys['arrowleft']=false; keys['arrowright']=false; };
  base.addEventListener('pointerup',rel); base.addEventListener('pointercancel',rel); base.addEventListener('pointerleave',rel);
}

/* ---------- actions ---------- */
function jump(){ if(player.onGround&&!player.blocking){ player.vy=-15.5; player.onGround=false; } }
function startBlock(){ if(state!=='play') return; player.blocking=true; player.blockT=0; }
function swordAttack(){ if(player.swordCd>0||state!=='play'||player.blocking) return;
  player.swing=1; player.swordCd=C.sword.cd*mul('swordCd');
  window.SFX&&SFX.slash();
  const fc=player.facing;
  const SW=[
    {fx:{a0:-1.25,a1:0.9,r1:32,r2:64},  arm:{a0:-0.55,a1:0.55,blade:18,lunge:3}},  // horizontal sweep
    {fx:{a0:-2.0,a1:0.35,r1:28,r2:72},  arm:{a0:-1.45,a1:0.35,blade:21,lunge:3}},  // overhead chop
    {fx:{a0:1.15,a1:-1.0,r1:30,r2:66},  arm:{a0:0.95,a1:-1.05,blade:18,lunge:3}},  // uppercut
    {fx:{a0:-0.28,a1:0.28,r1:48,r2:82}, arm:{a0:0.05,a1:0.05,blade:30,lunge:9}},   // thrust
  ];
  player.swingIdx=((player.swingIdx||0)+1)%SW.length; const T=SW[player.swingIdx]; player.swingArm=T.arm;
  spawnFX('slash', player.x+fc*46, player.y-52, Object.assign({facing:fc},T.fx));
  const r=C.sword.range*(player.swingIdx===3?1.28:1); let hit=false;
  forEachTarget(t=>{ const dx=(t.x-player.x)*fc; if(dx>-26 && dx<r && Math.abs(t.y-player.y)<74){
    damage(t, (C.sword.dmg+Math.floor(combo/4))*mul('sword')); hit=true; knock(t,fc*6); } });
  if(hit){ addCombo(); gainUlt(6); }
}
function rangedAttack(){ if(player.ammo<=0||state!=='play'||player.blocking) return; player.ammo--; player.swing=0.5; player.shoot=0.45; window.SFX&&SFX.ranged(C.ranged.type);
  projectiles.push({ x:player.x+player.facing*40, y:player.y-52, vx:player.facing*C.ranged.speed, vy:0, g:0,
    type:C.ranged.type, dmg:C.ranged.dmg*mul('ranged'), owner:'player', life:2.4, facing:player.facing }); gainUlt(4); }
function ultAttack(){ if(player.ult<100||state!=='play') return; player.ult=0; flash=1; shake=16; toast(C.ult.name+'!'); window.SFX&&SFX.ult();
  forEachTarget(t=>{ damage(t,t.boss?78:64); knock(t,(t.x>player.x?1:-1)*12); });
  spawnFX('ultwave', player.x, player.y-40, {}); score+=1500; addCombo(); addCombo(); }
function usePot(kind){ if(state!=='play'||player.pots[kind]<=0) return;
  if(kind==='hp'){ if(player.hp>=player.maxHp) return; player.hp=Math.min(player.maxHp,player.hp+42); spawnFX('heal',player.x,player.y-60,{}); toast('+42 ΖΩΗ'); }
  else { player.ult=Math.min(100,player.ult+55); spawnFX('rage',player.x,player.y-60,{}); toast('+ ΟΡΓΗ'); }
  player.pots[kind]--; }
function gainUlt(a){ player.ult=Math.min(100, player.ult + a*mul('ultGain')); }
function mul(key){ return (player.mod && player.mod[key]) || 1; }
function forEachTarget(fn){ enemies.forEach(e=>{ if(!e.dead) fn(e); }); }

function damage(t,amt){ if(t.dead) return; t.hp-=amt; t.hurt=0.18;
  spawnFX('dmg', t.x, t.y-(t.boss?(t.kind==='giant'?260:160):(t.champion?180:150)), {val:Math.round(amt),crit:amt>40});
  spawnFX('spark', t.x+(Math.random()*30-15), t.y-90, {});
  if(t.hp<=0) killEntity(t); }
function killEntity(t){ t.dead=true; t.dying=0.5; t.fall=0; t.corpseT=0; kills++;
  score += t.boss?5000:(t.champion?600:120)*Math.max(1,Math.floor(combo/4)+1);
  // drops — bosses give a guaranteed cache; others ~13% chance of something useful
  if(t.boss){ dropItem(t.x,'hp'); dropItem(t.x-54,'rage'); dropItem(t.x+54,'ult'); }
  else { const ch=t.champion?0.55:0.13; if(Math.random()<ch) dropItem(t.x, randDrop()); }
  if(t.boss){ state='won'; flash=1; shake=20; setTimeout(()=>showEnd('ΝΙΚΗ'),700); }
}
function randDrop(){ const r=Math.random();
  return r<0.30?'hp' : r<0.52?'rage' : r<0.72?'ammo' : r<0.88?'ult' : 'coin'; }
function dropItem(x,kind){ items.push({x:Math.max(60,Math.min(WORLD_W-60,x)), y:GY, kind, life:12}); }
function applyPickup(it){
  if(it.kind==='hp'||it.kind==='rage'){ if(player.pots[it.kind]>=6) return false; player.pots[it.kind]++;
    spawnFX(it.kind==='hp'?'heal':'rage',it.x,it.y-50,{}); toast(it.kind==='hp'?'+ ΦΙΑΛΗ ΖΩΗΣ':'+ ΦΙΑΛΗ ΟΡΓΗΣ'); return true; }
  if(it.kind==='ammo'){ player.ammo=ammoMax(); player.ammoTimer=0; spawnFX('heal',it.x,it.y-50,{}); toast('+ ΓΕΜΑΤΗ ΦΑΡΕΤΡΑ'); return true; }
  if(it.kind==='ult'){ gainUlt(35); spawnFX('rage',it.x,it.y-50,{}); toast('+ ΟΡΓΗ'); return true; }
  if(it.kind==='coin'){ score+=300; spawnFX('rage',it.x,it.y-50,{}); toast('+300 ΣΚΟΡ'); return true; }
  return true;
}
function knock(t,k){ if(t.boss&&t.kind==='giant') return; if(t.champion) k*=0.5; t.x=Math.max(40,Math.min(WORLD_W-40,t.x+k)); }
function addCombo(){ combo++; comboTimer=2.2; if(combo%5===0) score+=combo*20; }

function hurtPlayer(amt, attacker){ if(state!=='play'||player.dead) return;
  if(player.blocking){
    if(player.blockT<0.22){ spawnFX('parry', player.x+player.facing*30, player.y-52, {}); gainUlt(20); shake=6; toast('ΠΑΡΥ!'); window.SFX&&SFX.parry();
      if(attacker){ attacker.stun=0.9; attacker.swing=0; } return; }
    amt*=0.2; player.inv=0.3; spawnFX('block', player.x+player.facing*26, player.y-50, {}); window.SFX&&SFX.block();
  } else { if(player.inv>0) return; player.inv=0.7; combo=0; }
  amt*=mul('taken'); amt*=(DMG_SCALE[difficulty]||0.78); player.hp-=amt; player.hurt=0.2; shake=8; window.SFX&&SFX.hurt();
  spawnFX('dmg', player.x, player.y-120, {val:Math.round(amt), enemy:true});
  if(player.hp<=0){ player.hp=0; player.dead=true; state='lost'; setTimeout(()=>showEnd('ΗΤΤΑ'),500); }
}
function spawnFX(type,x,y,o){ fx.push(Object.assign({type,x,y,life:0,max:type==='dmg'?0.9:type==='ultwave'?0.5:type==='parry'?0.4:type==='heal'||type==='rage'?0.7:0.3},o)); }
function toast(txt){ const t=hud.querySelector('#toast'); t.textContent=txt; t.classList.remove('show'); void t.offsetWidth; t.classList.add('show'); }
function bossBanner(name,en){ const b=document.getElementById('bossBanner'); if(!b) return;
  b.querySelector('.bb-name').textContent=name; b.querySelector('.bb-en').textContent=en||'';
  b.classList.remove('show'); void b.offsetWidth; b.classList.add('show'); shake=18;
  clearTimeout(bossBanner._t); bossBanner._t=setTimeout(()=>b.classList.remove('show'),2200); }
function setFreeze(on){ if(on){ if(state==='play'){ paused=true; state='paused'; } } else if(state==='paused'){ paused=false; state='play'; } }
function helpOpen(){ const h=document.getElementById('helpCard'); return h&&h.classList.contains('show'); }
function togglePause(force){
  if(helpOpen()){ document.getElementById('helpCard').classList.remove('show'); setFreeze(false); try{localStorage.setItem('ia_helpSeen','1');}catch(e){} return; }
  if(state!=='play'&&state!=='paused') return;
  setFreeze(force!=null?force:(state!=='paused'));
  const po=document.getElementById('pauseOverlay'); if(po) po.classList.toggle('show',state==='paused'); }

/* ---------- update ---------- */
function update(dt){
  if(paused) return;
  gameT+=dt;
  if(state==='quiz'){ tickQuiz(dt); return; }
  if(shake>0) shake=Math.max(0,shake-dt*40);
  if(flash>0) flash=Math.max(0,flash-dt*2.4);
  if(state!=='play'){ updateFX(dt); return; }

  player.blocking = player.blocking && (keys['l']||player.blocking);
  if(player.blocking) player.blockT+=dt;
  const left=keys['arrowleft']||keys['a'], right=keys['arrowright']||keys['d'];
  let ax=(right?1:0)-(left?1:0);
  if(joyAxis!==0) ax=joyAxis;   // analog joystick overrides for variable speed
  player.vx = player.blocking?0 : ax*6.6*mul('move');
  if(ax!==0 && !player.blocking) player.facing=ax>0?1:-1;
  player.x=Math.max(60,Math.min(WORLD_W-60, player.x+player.vx));
  player.vy+=0.85; player.y+=player.vy;
  if(player.y>=GY){ player.y=GY; player.vy=0; player.onGround=true; }
  player.jumpY=GY-player.y;
  player.walk=(Math.abs(player.vx)>0.5&&player.onGround)?player.walk+dt*12:0;
  if(player.swing>0) player.swing=Math.max(0,player.swing-dt*3.2);
  if(player.swordCd>0) player.swordCd-=dt;
  if(player.shoot>0) player.shoot-=dt;
  if(player.hurt>0) player.hurt-=dt;
  if(player.inv>0) player.inv-=dt;
  if(player.mod&&player.mod.bleed){ player.hp-=player.mod.bleed*dt; if(player.hp<=0&&!player.dead){ player.hp=0; player.dead=true; state='lost'; setTimeout(()=>showEnd('ΗΤΤΑ'),400);} }
  if(player.mod){ player.mod.t-=dt; if(player.mod.t<=0){ const was=player.mod; player.mod=null; toast('ΕΛΗΞΕ · '+was.name); } }
  const am=ammoMax(); if(player.ammo<am){ player.ammoTimer+=dt; if(player.ammoTimer>=C.ranged.recharge){ player.ammo++; player.ammoTimer=0; } }
  if(comboTimer>0){ comboTimer-=dt; if(comboTimer<=0) combo=0; }

  // camera follows player
  const tcam=Math.max(0,Math.min(WORLD_W-W, player.x-W/2));
  camX += (tcam-camX)*Math.min(1,dt*6);

  if(spawnQueue.length){ spawnTimer+=dt; while(spawnQueue.length&&spawnTimer>=spawnQueue[0].t){ const s=spawnQueue.shift(); spawnEnemy(s.type,s.side); } }

  enemies.forEach(e=> e.dead?updateDying(e,dt):(e.boss?updateBoss(e,dt):updateEnemy(e,dt)));
  enemies=enemies.filter(e=>!(e.dead&&e.corpseT>8));
  if(boss&&boss.dead&&boss.corpseT>8) boss=null;

  // item pickup
  for(let i=items.length-1;i>=0;i--){ const it=items[i]; it.life-=dt;
    if(Math.abs(it.x-player.x)<58 && Math.abs(player.y-it.y)<130){ if(applyPickup(it)){ items.splice(i,1); continue; } }
    if(it.life<=0) items.splice(i,1); }

  if(!spawnQueue.length && enemies.filter(e=>!e.dead).length===0 && state==='play'){
    if(wave<waveDefs.length-1){ betweenWave+=dt; if(betweenWave>0.4){ betweenWave=0; openQuiz(); } }
  }
  // arrow-rain hazard (wrong-answer penalty)
  if(rain){ rain.t-=dt; if(rain.t<=0){ rain.t=0.1;
    const rx=player.x+(Math.random()*680-340);
    projectiles.push({x:Math.max(40,Math.min(WORLD_W-40,rx)), y:-40, vx:(Math.random()-0.5)*1.5, vy:8+Math.random()*3, g:0.16, type:'arrow', dmg:6, owner:'enemy', life:4, facing:1, rain:true});
    rain.left--; if(rain.left<=0) rain=null; } }
  updateProjectiles(dt); updateFX(dt);
}
function arrowRain(n){ rain={left:n, t:0.2}; shake=6; toast('ΒΡΟΧΗ ΒΕΛΩΝ!'); }
function updateEnemy(e,dt){ if(e.stun>0){ e.stun-=dt; return; }
  const dx=player.x-e.x, dir=dx>0?1:-1, dist=Math.abs(dx); e.facing=dir;
  if(e.hurt>0) e.hurt-=dt;
  if(e.kindRanged){ if(dist<360) e.x-=dir*1.5; else if(dist>520) e.x+=dir*1.6; e.walk+=dt*7;
    e.shootCd-=dt; if(e.shootCd<=0&&dist<760){ e.shootCd=2.2+Math.random();
      projectiles.push({x:e.x+dir*20,y:e.y-50,vx:dir*9,vy:-1.2,g:0.04,type:'arrow',dmg:e.dmg,owner:'enemy',life:2.6,facing:dir}); } }
  else if(e.spearman){ // medium range; hurls a fast LOW spear you must JUMP over
    if(dist<230) e.x-=dir*1.5; else if(dist>470) e.x+=dir*1.9; e.walk+=dt*7;
    e.throwCd-=dt;
    if(e.throwCd<=0 && dist>120 && dist<720){ e.throwCd=1.7+Math.random()*1.0; e.swing=1; e.telegraph=0.32; }
    if(e.telegraph>0){ e.telegraph-=dt; if(e.telegraph<=0){
      projectiles.push({x:e.x+dir*26,y:GY-18,vx:dir*15.5,vy:0,g:0,type:'spear',low:true,dmg:e.dmg,owner:'enemy',life:2.4,facing:dir}); } }
    if(dist<90){ e.atkCd-=dt; if(e.atkCd<=0){ e.atkCd=1.2; e.swing=1; if(Math.abs(player.y-e.y)<72) hurtPlayer(e.dmg,e); } }
  }
  else { const reach=e.champion?118:96;
    if(dist>reach){ e.x+=dir*(e.champion?2.7:2.4); e.walk+=dt*10; }
    else { e.walk=0; e.atkCd-=dt; if(e.atkCd<=0){ e.atkCd=e.champion?1.0:1.1; e.swing=1;
      if(Math.abs(player.x-e.x)<reach+18&&Math.abs(player.y-e.y)<72) hurtPlayer(e.dmg, e); } }
    if(e.champion&&e.rangedCd!=null){ e.rangedCd-=dt; if(e.rangedCd<=0&&dist>180&&dist<620){ e.rangedCd=3+Math.random()*2;
      projectiles.push({x:e.x+dir*24,y:e.y-58,vx:dir*11,vy:-2,g:0.05,type:'spear',dmg:12,owner:'enemy',life:2.6,facing:dir}); } }
  }
  if(e.swing>0) e.swing=Math.max(0,e.swing-dt*3);
  e.x=Math.max(40,Math.min(WORLD_W-40,e.x));
}
function updateBoss(b,dt){ if(b.stun>0){ b.stun-=dt; if(b.swing>0)b.swing=Math.max(0,b.swing-dt*2.6); return; }
  const dx=player.x-b.x, dir=dx>0?1:-1, dist=Math.abs(dx); b.facing=dir;
  if(b.hurt>0) b.hurt-=dt; b.atkCd-=dt; b.rangedCd-=dt;
  if(b.kind==='giant'){ if(dist>120){ b.x+=dir*1.5; b.walk+=dt*6; } else { b.walk=0;
      if(b.atkCd<=0){ b.atkCd=2.2; b.swing=1; if(Math.abs(player.x-b.x)<190) setTimeout(()=>{ if(Math.abs(player.x-b.x)<190&&player.onGround) hurtPlayer(22,b); },220); } }
    if(b.rangedCd<=0){ b.rangedCd=3.4; projectiles.push({x:b.x+dir*40,y:b.y-200,vx:dir*7,vy:-7,g:0.22,type:'boulder',dmg:18,owner:'enemy',life:3,facing:dir}); }
  } else if(b.kind==='caster'){ if(dist<420) b.x-=dir*1.6; else if(dist>660) b.x+=dir*1.2; b.walk+=dt*3;
    if(b.rangedCd<=0){ b.rangedCd=1.8; const col=b.wand||'#CFF0A8'; for(let i=-1;i<=1;i++) projectiles.push({x:b.x+dir*20,y:b.y-70,vx:dir*8,vy:i*2.4,g:0,type:'magic',dmg:13,owner:'enemy',life:2.8,facing:dir,col}); }
  } else if(b.kind==='archer'){ if(dist<300) b.x-=dir*1.6; else if(dist>560) b.x+=dir*1.3; b.walk+=dt*5;
    if(b.rangedCd<=0){ b.rangedCd=1.4; projectiles.push({x:b.x+dir*20,y:b.y-54,vx:dir*13,vy:-1.5,g:0.04,type:'arrow',dmg:14,owner:'enemy',life:2.8,facing:dir}); }
  } else { if(dist>92){ b.x+=dir*2.7; b.walk+=dt*8; } else { b.walk=0;
      if(b.atkCd<=0){ b.atkCd=1.3; b.swing=1; if(Math.abs(player.x-b.x)<140&&Math.abs(player.y-b.y)<82) setTimeout(()=>{ if(Math.abs(player.x-b.x)<150) hurtPlayer(15,b); },160); } }
    if(b.rangedCd<=0&&dist>200){ b.rangedCd=3; const tp=b.weapon==='bow'?'arrow':'spear'; projectiles.push({x:b.x+dir*30,y:b.y-60,vx:dir*12,vy:-2,g:0.05,type:tp,dmg:15,owner:'enemy',life:2.8,facing:dir}); }
  }
  if(b.swing>0) b.swing=Math.max(0,b.swing-dt*2.6);
  b.x=Math.max(120,Math.min(WORLD_W-120,b.x));
}
function updateDying(e,dt){ e.corpseT=(e.corpseT||0)+dt; e.fall=Math.min(1,(e.fall||0)+dt*4.5); e.walk=0; }
function updateProjectiles(dt){
  for(let i=projectiles.length-1;i>=0;i--){ const p=projectiles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=(p.g||0); p.life-=dt; let hit=false;
    if(p.owner==='player'){ forEachTarget(t=>{ if(hit||t.dead) return; const hy=t.boss?(t.kind==='giant'?180:120):110;
      if(Math.abs(p.x-t.x)<(t.boss?60:(t.champion?34:30))&&p.y>t.y-hy&&p.y<t.y+10){ damage(t,p.dmg); knock(t,p.facing*4); addCombo(); gainUlt(5); hit=true; } });
    } else { // blocking blocks frontal projectiles
      const near = p.rain ? (Math.abs(p.x-player.x)<34&&p.y>player.y-150&&p.y<player.y+6)
                          : (Math.abs(p.x-player.x)<30&&p.y>player.y-120&&p.y<player.y+6);
      if(near){
        if(player.blocking && (p.rain || Math.sign(p.x-player.x)===player.facing)){ if(player.blockT<0.22){ spawnFX('parry',p.x,p.y,{}); gainUlt(16); toast('ΠΑΡΥ!'); window.SFX&&SFX.parry(); } else { spawnFX('block',p.x,p.y,{}); window.SFX&&SFX.block(); } hit=true; }
        else { hurtPlayer(p.dmg); hit=true; } } }
    if(hit||p.life<=0||p.x<-80||p.x>WORLD_W+80||p.y>GY+20){ if(p.y>GY+10) spawnFX('spark',p.x,GY,{}); projectiles.splice(i,1); }
  }
}
function updateFX(dt){ for(let i=fx.length-1;i>=0;i--){ const f=fx[i]; f.life+=dt; if(f.type==='dmg') f.y-=dt*70; if(f.life>=f.max) fx.splice(i,1); } }

/* ---------- render ---------- */
function render(){
  ctx.save();
  if(shake>0) ctx.translate((Math.random()-.5)*shake,(Math.random()-.5)*shake);
  if(bgActive){ ctx.clearRect(0,0,W,H); const mc=Math.max(1,WORLD_W-W), pxx=-(camX/mc)*60;
    const sc=document.getElementById('bgScene'); if(sc) sc.style.transform='translate('+pxx.toFixed(1)+'px,-22px) scale(1.08)'; }
  else D.drawScene(ctx,R,gameT,camX);
  ctx.save(); ctx.translate(-camX,0);
  items.forEach(it=>D.drawItem(ctx,it,gameT));
  const ents=[...enemies].sort((a,b)=>a.y-b.y);
  ents.forEach(e=>{ ctx.save();
    if(e.dead){ const fade=e.corpseT>6?Math.max(0,(8-e.corpseT)/2):1; ctx.globalAlpha=0.94*fade;
      const f=Math.min(1,e.fall||1); ctx.translate(e.x,e.y); ctx.rotate(e.facing*1.46*f); ctx.translate(-e.x,-e.y); }
    if(e.boss) D.drawBoss(ctx,e); else D.drawWarrior(ctx, Object.assign({shield:e.shield,emblem:e.champion?e.crest:null},e));
    ctx.restore(); if(!e.dead&&e.champion) miniBar(e); });
  const heroSkin = campaignKey==='iliada'
    ? {scale:1.5, tint:'#2E1C12', armor:'#C8842B', armorHi:'#F0C44A'}
    : {scale:1.5, tint:'#6E4A30', ragged:true, wrap:'#A8865A', bowColor:'#5E3E1E'};
  if(!player.dead) D.drawWarrior(ctx, Object.assign({},player,R.hero,heroSkin));
  else { ctx.save(); ctx.globalAlpha=.5; D.drawWarrior(ctx,Object.assign({},player,R.hero,heroSkin)); ctx.restore(); }
  projectiles.forEach(p=>D.drawProjectile(ctx,p));
  renderFX();
  ctx.restore();
  ctx.restore();
  if(flash>0){ ctx.fillStyle='rgba(246,200,120,'+(flash*0.5)+')'; ctx.fillRect(0,0,W,H); }
}
function miniBar(e){ const w=52,x=e.x-w/2,y=e.y-200; ctx.fillStyle='rgba(10,6,3,.7)'; ctx.fillRect(x-1,y-1,w+2,6);
  ctx.fillStyle='#C8842B'; ctx.fillRect(x,y,w*Math.max(0,e.hp/e.maxHp),4); }
function renderFX(){
  fx.forEach(f=>{ const a=1-f.life/f.max;
    if(f.type==='dmg'){ ctx.globalAlpha=Math.min(1,2-2*f.life/f.max); ctx.font=(f.crit?'700 46px':'700 32px')+' Anton, sans-serif'; ctx.textAlign='center';
      ctx.fillStyle=f.enemy?'#D2452E':(f.crit?'#E8C96A':'#E2A867'); ctx.fillText(f.val,f.x,f.y); ctx.globalAlpha=1; }
    else if(f.type==='spark'){ ctx.globalAlpha=a; ctx.strokeStyle='#F6C44A'; ctx.lineWidth=2.4;
      for(let k=0;k<6;k++){ const ang=k*60*Math.PI/180,r=14*(1-a)+4; ctx.beginPath(); ctx.moveTo(f.x,f.y); ctx.lineTo(f.x+Math.cos(ang)*r,f.y+Math.sin(ang)*r); ctx.stroke(); } ctx.globalAlpha=1; }
    else if(f.type==='slash'){ ctx.save(); ctx.translate(f.x,f.y); ctx.scale(f.facing||1,1);
      const pr=Math.min(1,f.life/f.max*1.25), cur=f.a0+(f.a1-f.a0)*pr;
      ctx.beginPath(); ctx.arc(0,0,f.r2,f.a0,cur,false); ctx.arc(0,0,f.r1,cur,f.a0,true); ctx.closePath();
      ctx.fillStyle='rgba(246,224,168,'+(0.75*a)+')'; ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,'+(0.9*a)+')'; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(0,0,(f.r1+f.r2)/2,cur-0.12,cur); ctx.stroke();
      ctx.restore(); }
    else if(f.type==='ultwave'){ ctx.globalAlpha=a*0.6; ctx.strokeStyle='#E8C96A'; ctx.lineWidth=8; ctx.beginPath(); ctx.arc(f.x,f.y,(1-a)*520,0,7); ctx.stroke(); ctx.globalAlpha=1; }
    else if(f.type==='parry'){ ctx.globalAlpha=a; ctx.strokeStyle='#FFF6D8'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(f.x,f.y,10+(1-a)*30,0,7); ctx.stroke();
      ctx.strokeStyle='#E8C96A'; ctx.lineWidth=2; for(let k=0;k<8;k++){ const ang=k*45*Math.PI/180,r=18+(1-a)*22; ctx.beginPath(); ctx.moveTo(f.x+Math.cos(ang)*12,f.y+Math.sin(ang)*12); ctx.lineTo(f.x+Math.cos(ang)*r,f.y+Math.sin(ang)*r); ctx.stroke(); } ctx.globalAlpha=1; }
    else if(f.type==='block'){ ctx.globalAlpha=a; ctx.strokeStyle='#9DB4C8'; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(f.x,f.y,8+(1-a)*16,-1.2,1.2); ctx.stroke(); ctx.globalAlpha=1; }
    else if(f.type==='heal'||f.type==='rage'){ ctx.globalAlpha=a; const col=f.type==='heal'?'#7FD08A':'#E8A03A';
      for(let k=0;k<5;k++){ const yy=f.y-(1-a)*44-(k*6); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(f.x+Math.sin(k+f.life*6)*10,yy,3,0,7); ctx.fill(); } ctx.globalAlpha=1; }
  });
}

/* ---------- HUD ---------- */
function updateHUD(){
  const sym=C.ranged.type==='arrow'?'➶':'╱'; const am=ammoMax();
  let pips=''; for(let i=0;i<am;i++) pips+=`<span class="${i<player.ammo?'on':''}">${sym}</span>`;
  hud.querySelector('#hpFill').style.width=Math.max(0,player.hp)+'%';
  hud.querySelector('#hpNum').textContent=Math.max(0,Math.round(player.hp));
  hud.querySelector('#ultFill').style.width=player.ult+'%'; hud.querySelector('#ultBar').classList.toggle('full',player.ult>=100);
  hud.querySelector('#ammoPips').innerHTML=pips;
  hud.querySelector('#scoreV').textContent=score.toLocaleString('el-GR');
  hud.querySelector('#waveV').textContent=(wave+1)+'/'+totalWaves;
  const cv=hud.querySelector('#comboV'); if(combo>1){cv.textContent='×'+combo+' COMBO';cv.classList.add('show');}else cv.classList.remove('show');
  hud.querySelector('#potHpN').textContent=player.pots.hp;
  hud.querySelector('#potRageN').textContent=player.pots.rage;
  hud.querySelector('#potHp').classList.toggle('empty',player.pots.hp<=0);
  hud.querySelector('#potRage').classList.toggle('empty',player.pots.rage<=0);
  const chip=hud.querySelector('#modChip');
  if(player.mod){ chip.className='mod-chip show '+(player.mod.kind);
    const frac=Math.max(0,Math.min(1,player.mod.t/player.mod.dur));
    chip.innerHTML=`<span class="mt">${player.mod.kind==='buff'?'▲':'▼'} ${player.mod.name} <b>${Math.ceil(player.mod.t)}s</b></span><span class="md">${player.mod.desc}</span><span class="mtimer"><i style="width:${(frac*100).toFixed(1)}%"></i></span>`; }
  else chip.className='mod-chip';
  const bb=hud.querySelector('#bossBar');
  if(boss&&!boss.dead){ bb.classList.add('show'); hud.querySelector('#bossName').textContent=R.boss.name;
    hud.querySelector('#bossEn').textContent=R.boss.en; hud.querySelector('#bossFill').style.width=Math.max(0,boss.hp/boss.maxHp*100)+'%';
  } else bb.classList.remove('show');
  hud.querySelector('#btnUlt').classList.toggle('ready',player.ult>=100);
}

/* ---------- quiz (2–3 questions, each on its own countdown) ---------- */
function pick(arr){ return arr[(Math.random()*arr.length)|0]; }
function openQuiz(){ state='quiz';
  const n = 2 + ((Math.random()<0.5)?0:1);            // 2 or 3 questions
  const pool=R.quiz.slice();                            // shuffle a fresh copy
  for(let i=pool.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [pool[i],pool[j]]=[pool[j],pool[i]]; }
  quizQueue = pool.slice(0, Math.min(n, pool.length));
  quizTotal = quizQueue.length; quizCorrect=0;
  hud.querySelector('#quiz').classList.add('show');
  nextQuizQuestion();
}
function nextQuizQuestion(){
  const q=quizQueue.shift();
  if(!q){ closeQuiz(); return; }
  quizCur=q; quizTimer=quizTimerMax;
  const el=hud.querySelector('#quiz');
  el.querySelector('.quiz-q').textContent=q.q;
  const opts=el.querySelector('.quiz-opts'); opts.innerHTML='';
  q.o.forEach((o,i)=>{ const d=document.createElement('div'); d.className='quiz-opt';
    d.innerHTML=`<span class="k">${['Α','Β','Γ','Δ'][i]}</span><span class="o">${o}</span>`;
    d.addEventListener('click',()=>answerQuiz(i)); opts.appendChild(d); });
  const idx = quizTotal - quizQueue.length;
  el.querySelector('.quiz-prog').textContent='ΕΡΩΤΗΣΗ '+idx+'/'+quizTotal+' · ΚΥΜΑ '+(wave+1)+'/'+totalWaves+' ΤΕΛΕΙΩΣΕ';
  const bar=el.querySelector('#quizTimerBar'); if(bar){ bar.style.transition='none'; bar.style.width='100%'; }
}
function tickQuiz(dt){ if(!quizCur) return; quizTimer-=dt;
  const f=Math.max(0,quizTimer/quizTimerMax);
  const bar=hud.querySelector('#quizTimerBar'); if(bar){ bar.style.transition=''; bar.style.width=(f*100).toFixed(1)+'%'; bar.classList.toggle('low',quizTimer<4); }
  const num=hud.querySelector('#quizTimerNum'); if(num) num.textContent=Math.ceil(Math.max(0,quizTimer));
  if(quizTimer<=0) resolveQuestion(-1);
}
function answerQuiz(i){ if(!quizCur) return; resolveQuestion(i); }
function resolveQuestion(i){
  const q=quizCur; if(!q) return; quizCur=null; const a=q.a;
  const el=hud.querySelector('#quiz'); const opts=[...el.querySelectorAll('.quiz-opt')];
  opts.forEach(o=>o.style.pointerEvents='none');
  const correct = i===a;
  if(i>=0){ opts[i].classList.add(correct?'right':'wrong'); }
  if(!correct && opts[a]) opts[a].classList.add('right');
  if(correct){ quizCorrect++; quizCorrectAll++; toast('ΣΩΣΤΟ!'); window.SFX&&SFX.parry(); }
  else { toast(i<0?'ΤΕΛΟΣ ΧΡΟΝΟΥ':'ΛΑΘΟΣ'); window.SFX&&SFX.hurt(); }
  quizTotalAll++;
  setTimeout(()=>{ if(state==='quiz') nextQuizQuestion(); }, correct?850:1300);
}
function closeQuiz(){
  const el=hud.querySelector('#quiz'); el.classList.remove('show');
  const M=window.GAME_MODS; player.ammo=ammoMax();
  if(quizCorrect>=quizTotal){ gainUlt(34); player.mod=Object.assign({kind:'buff',dur:24,t:24},pick(M.buffs));
    player.pots.hp=Math.min(6,player.pots.hp+1); toast('ΤΕΛΕΙΑ '+quizCorrect+'/'+quizTotal+' · '+player.mod.name); }
  else if(quizCorrect===0){ player.mod=Object.assign({kind:'debuff',dur:16,t:16},pick(M.debuffs)); arrowRain(16);
    toast('0/'+quizTotal+' · '+player.mod.name); }
  else { gainUlt(14); player.mod=Object.assign({kind:'buff',dur:14,t:14},pick(M.buffs));
    toast('ΚΑΛΑ '+quizCorrect+'/'+quizTotal+' · '+player.mod.name); }
  player.ammo=Math.min(player.ammo, ammoMax());
  state='play'; startWave(wave+1);
}

/* ---------- end ---------- */
function showEnd(title){ state=title==='ΝΙΚΗ'?'won':'lost'; const el=hud.querySelector('#endcard');
  const tt=el.querySelector('.end-title'); tt.textContent=title; tt.style.color=title==='ΝΙΚΗ'?'#E8C96A':'#D2452E';
  el.querySelector('#endScore').textContent=score.toLocaleString('el-GR'); el.querySelector('#endKills').textContent=kills;
  const acc=el.querySelector('#endAcc'); if(acc) acc.textContent=quizCorrectAll+'/'+quizTotalAll;
  const prevBest=getBest(); const rec=score>prevBest && score>0; if(rec) setBest(score);
  const be=el.querySelector('#endBest'); if(be) be.textContent=Math.max(prevBest,score).toLocaleString('el-GR');
  const rb=el.querySelector('#endRecord'); if(rb) rb.classList.toggle('show',rec);
  el.querySelector('#endSub').textContent=title==='ΝΙΚΗ'?('«'+R.boss.name+' έπεσε. '+R.title+'.»'):'«Έπεσες στη μάχη. Δοκίμασε ξανά.»';
  el.classList.add('show'); }
function hideEnd(){ hud.querySelector('#endcard').classList.remove('show'); }

/* ---------- loop ---------- */
function frame(ts){ if(!last) last=ts; let dt=(ts-last)/1000; last=ts; if(dt>0.05) dt=0.05;
  try{ acc+=dt; const step=1/60; let n=0; while(acc>=step&&n++<4){ update(step); acc-=step; }
    render(); updateHUD(); }catch(err){ window.__frameErr=(err&&err.stack)||String(err); }
  window.__GAME={state,wave,total:totalWaves,score,kills,combo,hp:Math.round(player.hp),ammo:player.ammo,ult:Math.round(player.ult),
    pots:player.pots,mod:player.mod&&player.mod.name,enemies:enemies.length,boss:boss?Math.round(boss.hp):null,px:Math.round(player.x),camX:Math.round(camX)};
  requestAnimationFrame(frame);
}
function fit(){ const vp=document.querySelector('.viewport'); const s=Math.min(vp.clientWidth/W,vp.clientHeight/H); if(s>0&&isFinite(s)) document.querySelector('.stage').style.transform='scale('+s+')'; }

/* ---------- boot ---------- */
function boot(){
  var _ib=document.getElementById('ia-boot');
  try {
  canvas=document.getElementById('game'); canvas.width=W; canvas.height=H; ctx=canvas.getContext('2d');
  hud=document.getElementById('hud'); bindInput();
  bindJoystick();
  vbtn(hud.querySelector('#btnJump'),jump);
  vbtn(hud.querySelector('#btnSword'),swordAttack);
  vbtn(hud.querySelector('#btnRanged'),rangedAttack);
  vbtn(hud.querySelector('#btnBlock'),null,{block:true});
  vbtn(hud.querySelector('#btnUlt'),ultAttack);
  vbtn(hud.querySelector('#potHp'),()=>usePot('hp'));
  vbtn(hud.querySelector('#potRage'),()=>usePot('rage'));
  hud.querySelector('#endcard').addEventListener('click',()=>{ hideEnd(); setup(); });
  document.querySelectorAll('.camp-btn').forEach(b=>b.addEventListener('click',()=>{
    campaignKey=b.dataset.camp; document.querySelectorAll('.camp-btn').forEach(x=>x.classList.toggle('on',x===b));
    rhapKey=window.RHAP_ORDER[campaignKey][0]; buildRhapBar(); setup(); }));
  document.querySelectorAll('.wave-btn').forEach(b=>b.addEventListener('click',()=>{
    totalWaves=+b.dataset.n; document.querySelectorAll('.wave-btn').forEach(x=>x.classList.toggle('on',x===b)); setup(); }));
  document.querySelectorAll('.diff-btn').forEach(b=>b.addEventListener('click',()=>{
    difficulty=b.dataset.diff; document.querySelectorAll('.diff-btn').forEach(x=>x.classList.toggle('on',x===b)); setup(); }));
  // Single-campaign tile (launched from the SymposiON panel as Ιλιάδα / Οδύσσεια
  // Arcade): lock the campaign and hide the campaign toggle.
  if(window.ARCADE_PIN && window.GAME_DATA && window.GAME_DATA[window.ARCADE_PIN]){
    campaignKey = window.ARCADE_PIN;
    rhapKey = (window.RHAP_ORDER[campaignKey] && window.RHAP_ORDER[campaignKey][0]) || rhapKey;
    document.querySelectorAll('.camp-btn').forEach(x=>x.classList.toggle('on', x.dataset.camp===campaignKey));
    var campRow=document.querySelector('.camp-row'); if(campRow) campRow.style.display='none';
  }
  buildRhapBar();
  setup();
  // system buttons: pause / mute / help
  const $=id=>document.getElementById(id);
  $('btnPause')&&$('btnPause').addEventListener('click',()=>togglePause());
  $('resumeCta')&&$('resumeCta').addEventListener('click',()=>togglePause(false));
  const muteBtn=$('btnMute');
  if(muteBtn){ let muted=false; try{ muted=localStorage.getItem('ia_muted')==='1'; }catch(e){}
    const apply=()=>{ window.SFX&&SFX.setMuted(muted); muteBtn.classList.toggle('muted',muted); muteBtn.textContent=muted?'\u266a':'\u266b'; };
    muteBtn.addEventListener('click',()=>{ window.SFX&&SFX.init(); muted=!muted; try{ localStorage.setItem('ia_muted',muted?'1':'0'); }catch(e){} apply(); });
    apply(); }
  const help=$('helpCard');
  const openHelp=()=>{ if(help){ help.classList.add('show'); setFreeze(true); } };
  const closeHelp=()=>{ if(help){ help.classList.remove('show'); setFreeze(false); try{ localStorage.setItem('ia_helpSeen','1'); }catch(e){} } };
  $('btnHelp')&&$('btnHelp').addEventListener('click',openHelp);
  $('helpCta')&&$('helpCta').addEventListener('click',closeHelp);
  let seen=false; try{ seen=localStorage.getItem('ia_helpSeen')==='1'; }catch(e){}
  if(!seen) openHelp();
  addEventListener('resize',fit); addEventListener('load',fit);
  const vp=document.querySelector('.viewport'); if(window.ResizeObserver) new ResizeObserver(fit).observe(vp); fit();
  requestAnimationFrame(frame);
  // Success → dismiss the loader. Moved here (was the first line of boot) so that
  // if anything above throws, the error is SHOWN in #ia-boot instead of leaving
  // the game hung on «Φόρτωση…» forever.
  if(_ib){ _ib.classList.add('gone'); setTimeout(function(){ if(_ib&&_ib.remove) _ib.remove(); }, 380); }
  } catch(err){
    window.__bootErr=(err&&err.stack)||String(err);
    if(_ib){ _ib.classList.remove('gone');
      _ib.innerHTML='<div style="color:#E8C96A;font:600 13px system-ui,sans-serif;padding:24px;text-align:center;max-width:92vw;margin:auto">Σφάλμα φόρτωσης παιχνιδιού.'+
        '<div style="margin-top:10px;color:#e0a0a0;font:400 11px ui-monospace,monospace;white-space:pre-wrap;word-break:break-word">'+String(window.__bootErr).slice(0,400)+'</div></div>'; }
  }
}
function buildRhapBar(){ const bar=document.getElementById('rhapBar'); bar.innerHTML='';
  window.RHAP_ORDER[campaignKey].forEach(k=>{ const r=window.GAME_DATA[campaignKey].rhaps[k];
    const b=document.createElement('button'); b.className='rhap-btn'+(k===rhapKey?' on':''); b.textContent=r.roman;
    b.title='Ραψ. '+r.latin+' · '+r.title+' — '+r.boss.name;
    b.addEventListener('click',()=>{ rhapKey=k; [...bar.children].forEach(x=>x.classList.toggle('on',x===b)); setup(); });
    bar.appendChild(b); }); }
function applyWeaponLabel(){ hud.querySelector('#btnRanged .lbl').textContent=C.ranged.name;
  hud.querySelector('#btnUlt .lbl').textContent=C.ult.name; hud.querySelector('#ultName').textContent=C.ult.name;
  hud.querySelector('#portrait').textContent=C.portrait; hud.querySelector('#heroName').textContent=C.heroName; }

// Every script in index.html uses `defer`, so the DOM is fully parsed before this
// runs (readyState is already 'interactive'). The old guard therefore took the
// inline branch and called boot() exactly once with NO DOMContentLoaded fallback —
// if that single call ever failed the loader stayed up forever. bootOnce() makes
// it idempotent and correct under both synchronous and deferred loading.
function bootOnce(){ if(window.__iaBooted) return; window.__iaBooted=true; boot(); }
if(document.readyState==='loading') addEventListener('DOMContentLoaded',bootOnce);
else bootOnce();
window.__dbg={ boss(){ enemies=enemies.filter(e=>e.boss); spawnQueue=[]; wave=waveDefs.length-1; spawnEnemy('boss',1); },
  champ(){ spawnEnemy('champion',1); }, ult(){ player.ult=100; }, hero(x){ if(x!=null) player.x=x; },
  win(){ if(boss){ boss.hp=1; damage(boss,5);} },
  step(dt){ try{ update(dt||1/60); render(); updateHUD(); }catch(err){ window.__frameErr=(err&&err.stack)||String(err); } },
  press(k){ keys[k]=true; }, release(k){ keys[k]=false; },
  reset(){ setup(); }, key(k){ keys[k]=true; setTimeout(()=>keys[k]=false,30); },
  info(){ return {state, hp:Math.round(player.hp), px:Math.round(player.x), facing:player.facing,
    live:enemies.filter(e=>!e.dead).length, corpses:enemies.filter(e=>e.dead).length,
    nearest: enemies.filter(e=>!e.dead).map(e=>({t:e.type||e.kind,dx:Math.round(e.x-player.x),hp:Math.round(e.hp)})).sort((a,b)=>Math.abs(a.dx)-Math.abs(b.dx))[0],
    kills, score, wave, total:totalWaves, ammo:player.ammo, ult:Math.round(player.ult), mod:player.mod&&player.mod.name, diff:difficulty}; } };
})();
