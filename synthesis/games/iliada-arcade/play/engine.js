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
/* --- combat-feel state (visual only, no balance impact) --- */
const RM=(typeof matchMedia!=='undefined') && matchMedia('(prefers-reduced-motion: reduce)').matches;
/* weak-device heuristic — presentation/perf only (fewer particles, lower canvas
   backing resolution, no backdrop blurs via html.lite) */
const LITE=((typeof matchMedia!=='undefined') && matchMedia('(pointer:coarse)').matches)
  || window.innerWidth<720 || (navigator.deviceMemory||8)<=4;
let RES=1;   // canvas backing-store scale (1 on desktop; DPR-capped on LITE)
let hitstop=0;                 // frame-freeze on connect (seconds, real-time)
let zoom=1;                    // camera punch-in factor (lerps back to 1)
let ghosts=[];                 // afterimage snapshots of the hero
let ghostTimer=0, ultTrail=0;  // trail spawn clock · post-ult trail window
function kick(z,hs){ if(RM) z=1+(z-1)*0.35; zoom=Math.max(zoom,z); if(hs) hitstop=Math.max(hitstop,RM?hs*0.6:hs); }

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
  hitstop=0; zoom=1; ghosts=[]; ghostTimer=0; ultTrail=0;
  const po=document.getElementById('pauseOverlay'); if(po) po.classList.remove('show');
  Object.assign(player,{ x:300, y:GY, vx:0, vy:0, onGround:true, facing:1, walk:0,
    hp:100, maxHp:100, ult:0, swing:0, swingDir:1, swordCd:0,
    ammoBase:C.ranged.ammo, ammo:C.ranged.ammo, ammoTimer:0,
    hurt:0, inv:0, dead:false, blocking:false, blockT:0, shoot:0,
    landT:0, stepPh:0,
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
  const r=C.sword.range*(player.swingIdx===3?1.28:1); let hit=false, hitN=0;
  forEachTarget(t=>{ const dx=(t.x-player.x)*fc; if(dx>-26 && dx<r && Math.abs(t.y-player.y)<74){
    damage(t, (C.sword.dmg+Math.floor(combo/4))*mul('sword')); hit=true; hitN++;
    spawnBurst(t.x-fc*8, t.y-92, fc, 6, '#F6C44A');
    knock(t,fc*6); } });
  if(hit){ addCombo(); gainUlt(6);
    hitstop=Math.max(hitstop, 0.04+Math.min(hitN,3)*0.008);   // meaty connect freeze
    shake=Math.max(shake, 4.5+hitN*1.5);
    window.SFX&&SFX.impact&&SFX.impact(false); }
}
function rangedAttack(){ if(player.ammo<=0||state!=='play'||player.blocking) return; player.ammo--; player.swing=0.5; player.shoot=0.45; window.SFX&&SFX.ranged(C.ranged.type);
  projectiles.push({ x:player.x+player.facing*40, y:player.y-52, vx:player.facing*C.ranged.speed, vy:0, g:0,
    type:C.ranged.type, dmg:C.ranged.dmg*mul('ranged'), owner:'player', life:2.4, facing:player.facing }); gainUlt(4); }
function ultAttack(){ if(player.ult<100||state!=='play') return; player.ult=0; flash=1; shake=16; toast(C.ult.name+'!'); window.SFX&&SFX.ult();
  kick(1.12, 0.13); ultTrail=0.65;
  forEachTarget(t=>{ damage(t,t.boss?78:64); knock(t,(t.x>player.x?1:-1)*12);
    spawnBurst(t.x, t.y-90, t.x>player.x?1:-1, 8, '#E8C96A'); });
  spawnFX('ultwave', player.x, player.y-40, {});
  spawnFX('ring', player.x, player.y-40, {col:'#F6E0A8'});
  score+=1500; addCombo(); addCombo(); }
function usePot(kind){ if(state!=='play'||player.pots[kind]<=0) return;
  if(kind==='hp'){ if(player.hp>=player.maxHp) return; player.hp=Math.min(player.maxHp,player.hp+42); spawnFX('heal',player.x,player.y-60,{}); toast('+42 ΖΩΗ'); }
  else { player.ult=Math.min(100,player.ult+55); spawnFX('rage',player.x,player.y-60,{}); toast('+ ΟΡΓΗ'); }
  player.pots[kind]--; }
function gainUlt(a){ player.ult=Math.min(100, player.ult + a*mul('ultGain')); }
function mul(key){ return (player.mod && player.mod[key]) || 1; }
function forEachTarget(fn){ enemies.forEach(e=>{ if(!e.dead) fn(e); }); }

function damage(t,amt){ if(t.dead) return; t.hp-=amt; t.hurt=0.18;
  const crit=amt>40;
  spawnFX('dmg', t.x+(Math.random()*44-22), t.y-(t.boss?(t.kind==='giant'?260:160):(t.champion?180:150)), {val:Math.round(amt),crit,vx:(Math.random()-0.5)*70,rot:(Math.random()-0.5)*0.34});
  spawnFX('spark', t.x+(Math.random()*30-15), t.y-90, {});
  if(crit){ shake=Math.max(shake,9); spawnBurst(t.x,t.y-100,(t.x>player.x?1:-1),9,'#E8C96A'); }
  if(t.hp<=0) killEntity(t); }
/* directional impact particles (cone opposite the hit) */
function spawnBurst(x,y,dir,n,col){ if(RM||LITE) n=Math.ceil(n/2);
  for(let i=0;i<n;i++){ const a=(Math.random()-0.5)*1.4, sp=3+Math.random()*6;
    spawnFX('p', x, y, { vx:Math.cos(a)*sp*dir, vy:Math.sin(a)*sp-2.4, g:0.32,
      col:Math.random()<0.7?col:'#FFF3D8', r:1.4+Math.random()*2, max:0.34+Math.random()*0.22 }); } }
function dust(x,y,n){ if(RM||LITE) n=Math.ceil(n/2);
  for(let i=0;i<n;i++){ const a=Math.PI+(Math.random()-0.5)*2.4;
    spawnFX('p', x+(Math.random()-0.5)*16, y-2, { vx:Math.cos(a)*(0.6+Math.random()*1.6), vy:-(0.5+Math.random()*1.4), g:0.05,
      col:'rgba(190,160,120,.5)', r:2.5+Math.random()*3, max:0.4+Math.random()*0.25 }); } }
function killEntity(t){ t.dead=true; t.dying=0.5; t.fall=0; t.corpseT=0; kills++;
  score += t.boss?5000:(t.champion?600:120)*Math.max(1,Math.floor(combo/4)+1);
  // ragdoll launch — corpse flies away from the hero, spins, bounces once
  const away=(t.x>=player.x?1:-1);
  t.deadVx=away*(2.4+Math.random()*2.6)*(t.boss?0.5:1);
  t.deadVy=-(4.2+Math.random()*3.4)*(t.boss?0.7:1);
  t.deadRot=0; t.deadSpin=away*(4+Math.random()*5)*(t.boss?0.5:1); t.ragSeed=Math.random();
  t.deadSettled=false; t.bounced=false;
  // weapon flung loose + burst + camera punch
  spawnFX('wdrop', t.x, t.y-70, { vx:away*(2+Math.random()*3), vy:-(5+Math.random()*3), rot:Math.random()*6, spin:away*(8+Math.random()*6) });
  spawnBurst(t.x, t.y-90, away, t.boss?16:10, '#F6C44A');
  if(t.boss||t.champion) spawnFX('ring', t.x, t.y-90, {col:t.boss?'#F6E0A8':'#E8C96A'});   // pay-off flash on big kills
  window.SFX&&SFX.kill&&SFX.kill(!!t.boss);
  kick(t.boss?1.11:(t.champion?1.06:1.035), t.boss?0.16:(t.champion?0.09:0.06));
  shake=Math.max(shake, t.boss?16:(t.champion?10:7));
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
const COMBO_WORDS={5:'ΟΡΜΗ!',10:'ΑΡΙΣΤΕΙΑ!',15:'ΘΕΪΚΟ!',20:'ΟΜΗΡΙΚΟ!',30:'ΑΘΑΝΑΤΟ!'};
function addCombo(){ combo++; comboTimer=2.2; if(combo%5===0) score+=combo*20;
  const cv=hud&&hud.querySelector('#comboV');
  if(cv){ cv.classList.remove('pop'); void cv.offsetWidth; cv.classList.add('pop'); }
  const w=COMBO_WORDS[combo];
  if(w){ spawnFX('word', player.x, player.y-170, {txt:w, col:combo>=15?'#E8703A':'#E8C96A'}); } }

function hurtPlayer(amt, attacker){ if(state!=='play'||player.dead) return;
  if(player.blocking){
    if(player.blockT<0.22){ spawnFX('parry', player.x+player.facing*30, player.y-52, {}); gainUlt(20); shake=6; toast('ΠΑΡΥ!'); window.SFX&&SFX.parry();
      hitstop=Math.max(hitstop,0.07); spawnBurst(player.x+player.facing*30, player.y-52, player.facing, 7, '#FFF6D8');
      if(attacker){ attacker.stun=0.9; attacker.swing=0; } return; }
    amt*=0.2; player.inv=0.3; spawnFX('block', player.x+player.facing*26, player.y-50, {}); window.SFX&&SFX.block();
  } else { if(player.inv>0) return; player.inv=0.7; combo=0; }
  amt*=mul('taken'); amt*=(DMG_SCALE[difficulty]||0.78); player.hp-=amt; player.hurt=0.2; shake=8; window.SFX&&SFX.hurt();
  hitstop=Math.max(hitstop,0.03);
  spawnBurst(player.x, player.y-90, attacker? (player.x>=attacker.x?1:-1):1, 5, '#D2452E');
  spawnFX('dmg', player.x+(Math.random()*30-15), player.y-120, {val:Math.round(amt), enemy:true, vx:(Math.random()-0.5)*50, rot:(Math.random()-0.5)*0.3});
  if(player.hp<=0){ player.hp=0; player.dead=true; player.deadAt=gameT; shake=Math.max(shake,12); state='lost'; setTimeout(()=>showEnd('ΗΤΤΑ'),500); }
}
function spawnFX(type,x,y,o){ fx.push(Object.assign({type,x,y,life:0,
  max:type==='dmg'?0.9:type==='ultwave'?0.5:type==='parry'?0.4:type==='heal'||type==='rage'?0.7:
      type==='word'?1.0:type==='wdrop'?2.0:type==='ring'?0.55:0.3},o)); }
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
  if(player.y>=GY){
    if(!player.onGround && player.vy>5){ // landing → squash + dust puff
      player.landT=0.16; dust(player.x, GY, player.vy>11?7:4);
      if(player.vy>11) shake=Math.max(shake,3.5);
      window.SFX&&SFX.land&&SFX.land(); }
    player.y=GY; player.vy=0; player.onGround=true; }
  player.jumpY=GY-player.y;
  if(player.landT>0) player.landT-=dt;
  const wasWalking=player.walk;
  player.walk=(Math.abs(player.vx)>0.5&&player.onGround)?player.walk+dt*12:0;
  // footfall dust: each half gait cycle kicks a puff at the trailing foot
  if(player.walk>0){ const a=Math.floor(wasWalking/Math.PI), b=Math.floor(player.walk/Math.PI);
    if(b>a) dust(player.x-player.facing*10, GY, 2); }
  // afterimages: full-tilt sprint (speed buff), thrust lunge, and post-ult window
  if(ultTrail>0) ultTrail-=dt;
  const trailing = !RM && ( Math.abs(player.vx)>7.4 || ultTrail>0 ||
    (player.swing>0.45 && player.swingIdx===3) );
  if(trailing){ ghostTimer+=dt;
    if(ghostTimer>=0.038){ ghostTimer=0;
      ghosts.push({ x:player.x, y:player.y, facing:player.facing, walk:player.walk,
        swing:player.swing, swingIdx:player.swingIdx, swingArm:player.swingArm,
        jumpY:player.jumpY, shoot:player.shoot, onGround:player.onGround, vy:player.vy,
        life:0, max:(ultTrail>0?0.30:0.22) });
      if(ghosts.length>(LITE?6:10)) ghosts.shift(); } }
  else ghostTimer=0.05;
  for(let i=ghosts.length-1;i>=0;i--){ ghosts[i].life+=dt; if(ghosts[i].life>=ghosts[i].max) ghosts.splice(i,1); }
  if(player.swing>0) player.swing=Math.max(0,player.swing-dt*3.2);
  if(player.swordCd>0) player.swordCd-=dt;
  if(player.shoot>0) player.shoot-=dt;
  if(player.hurt>0) player.hurt-=dt;
  if(player.inv>0) player.inv-=dt;
  if(player.mod&&player.mod.bleed){ player.hp-=player.mod.bleed*dt; if(player.hp<=0&&!player.dead){ player.hp=0; player.dead=true; player.deadAt=gameT; state='lost'; setTimeout(()=>showEnd('ΗΤΤΑ'),400);} }
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
  const x0=e.x;
  const dx=player.x-e.x, dir=dx>0?1:-1, dist=Math.abs(dx); e.facing=dir;
  if(e.hurt>0) e.hurt-=dt;
  if(e.shoot>0) e.shoot-=dt;
  if(e.kindRanged){ if(dist<360) e.x-=dir*1.5; else if(dist>520) e.x+=dir*1.6;
    e.walk = e.x!==x0 ? e.walk+dt*7 : 0;
    e.shootCd-=dt; if(e.shootCd<=0&&dist<760){ e.shootCd=2.2+Math.random(); e.shoot=0.45;
      projectiles.push({x:e.x+dir*20,y:e.y-50,vx:dir*9,vy:-1.2,g:0.04,type:'arrow',dmg:e.dmg,owner:'enemy',life:2.6,facing:dir}); } }
  else if(e.spearman){ // medium range; hurls a fast LOW spear you must JUMP over
    if(dist<230) e.x-=dir*1.5; else if(dist>470) e.x+=dir*1.9;
    e.walk = e.x!==x0 ? e.walk+dt*7 : 0;
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
  e.leanV=(e.x-x0);   // px moved this step → torso lean in draw
}
function updateBoss(b,dt){ if(b.stun>0){ b.stun-=dt; if(b.swing>0)b.swing=Math.max(0,b.swing-dt*2.6); return; }
  const x0=b.x;
  const dx=player.x-b.x, dir=dx>0?1:-1, dist=Math.abs(dx); b.facing=dir;
  if(b.hurt>0) b.hurt-=dt; b.atkCd-=dt; b.rangedCd-=dt;
  if(b.shoot>0) b.shoot-=dt; if(b.cast>0) b.cast-=dt;
  if(b.kind==='giant'){ if(dist>120){ b.x+=dir*1.5; b.walk+=dt*6; } else { b.walk=0;
      if(b.atkCd<=0){ b.atkCd=2.2; b.swing=1; if(Math.abs(player.x-b.x)<190) setTimeout(()=>{ if(Math.abs(player.x-b.x)<190&&player.onGround){ hurtPlayer(22,b); } dust(b.x+b.facing*90,GY,6); shake=Math.max(shake,7); },220); } }
    if(b.rangedCd<=0){ b.rangedCd=3.4; b.swing=1; projectiles.push({x:b.x+dir*40,y:b.y-200,vx:dir*7,vy:-7,g:0.22,type:'boulder',dmg:18,owner:'enemy',life:3,facing:dir}); }
  } else if(b.kind==='caster'){ if(dist<420) b.x-=dir*1.6; else if(dist>660) b.x+=dir*1.2;
    b.walk = b.x!==x0 ? b.walk+dt*3 : 0;
    if(b.rangedCd<=0){ b.rangedCd=1.8; b.cast=0.4; const col=b.wand||'#CFF0A8'; for(let i=-1;i<=1;i++) projectiles.push({x:b.x+dir*20,y:b.y-70,vx:dir*8,vy:i*2.4,g:0,type:'magic',dmg:13,owner:'enemy',life:2.8,facing:dir,col}); }
  } else if(b.kind==='archer'){ if(dist<300) b.x-=dir*1.6; else if(dist>560) b.x+=dir*1.3;
    b.walk = b.x!==x0 ? b.walk+dt*5 : 0;
    if(b.rangedCd<=0){ b.rangedCd=1.4; b.shoot=0.45; projectiles.push({x:b.x+dir*20,y:b.y-54,vx:dir*13,vy:-1.5,g:0.04,type:'arrow',dmg:14,owner:'enemy',life:2.8,facing:dir}); }
  } else { if(dist>92){ b.x+=dir*2.7; b.walk+=dt*8; } else { b.walk=0;
      if(b.atkCd<=0){ b.atkCd=1.3; b.swing=1; if(Math.abs(player.x-b.x)<140&&Math.abs(player.y-b.y)<82) setTimeout(()=>{ if(Math.abs(player.x-b.x)<150) hurtPlayer(15,b); },160); } }
    if(b.rangedCd<=0&&dist>200){ b.rangedCd=3; const tp=b.weapon==='bow'?'arrow':'spear'; if(tp==='arrow') b.shoot=0.45; projectiles.push({x:b.x+dir*30,y:b.y-60,vx:dir*12,vy:-2,g:0.05,type:tp,dmg:15,owner:'enemy',life:2.8,facing:dir}); }
  }
  if(b.swing>0) b.swing=Math.max(0,b.swing-dt*2.6);
  b.x=Math.max(120,Math.min(WORLD_W-120,b.x));
  b.leanV=(b.x-x0);
}
function updateDying(e,dt){ e.corpseT=(e.corpseT||0)+dt; e.fall=Math.min(1,(e.fall||0)+dt*4.5); e.walk=0;
  if(e.deadSettled){ settleCorpse(e,dt); return; }
  if(e.deadVx===undefined) return;
  // ragdoll flight: launch, spin, bounce once, then ease into a lying angle
  e.x+=e.deadVx; e.y+=e.deadVy; e.deadVy+=0.55;
  e.x=Math.max(40,Math.min(WORLD_W-40,e.x));
  e.deadRot+=e.deadSpin*dt;
  if(e.y>=GY){
    if(!e.bounced && e.deadVy>2.5){ e.bounced=true; e.y=GY; e.deadVy*=-0.34; e.deadVx*=0.55; e.deadSpin*=0.6;
      dust(e.x,GY,e.boss?7:4); if(e.boss) shake=Math.max(shake,8); }
    else {
      e.y=GY; e.deadSettled=true;
      // nearest "lying flat" angle to the current spin
      const L=1.47; let best=e.deadRot, bd=1e9;
      for(let k=-2;k<=2;k++){ for(const s of [L,-L]){ const c=k*Math.PI+s, d=Math.abs(c-e.deadRot); if(d<bd){ bd=d; best=c; } } }
      e.lieRot=best; e.settleFrom=e.deadRot; e.settleT=0;
    }
  }
}
function settleCorpse(e,dt){ if(e.settleT===undefined) return;
  if(e.settleT<1){ e.settleT=Math.min(1,e.settleT+dt*6); const q=e.settleT, ee=q*q*(3-2*q);
    e.deadRot=e.settleFrom+(e.lieRot-e.settleFrom)*ee; } }
function updateProjectiles(dt){
  for(let i=projectiles.length-1;i>=0;i--){ const p=projectiles[i]; p.x+=p.vx; p.y+=p.vy; p.vy+=(p.g||0); p.life-=dt; let hit=false;
    if(p.owner==='player'){ forEachTarget(t=>{ if(hit||t.dead) return; const hy=t.boss?(t.kind==='giant'?180:120):110;
      if(Math.abs(p.x-t.x)<(t.boss?60:(t.champion?34:30))&&p.y>t.y-hy&&p.y<t.y+10){ damage(t,p.dmg); knock(t,p.facing*4); addCombo(); gainUlt(5); hit=true;
        spawnBurst(p.x, p.y, p.facing, 5, '#E2A867'); hitstop=Math.max(hitstop,0.03); } });
    } else { // blocking blocks frontal projectiles
      const near = p.rain ? (Math.abs(p.x-player.x)<34&&p.y>player.y-150&&p.y<player.y+6)
                          : (Math.abs(p.x-player.x)<30&&p.y>player.y-120&&p.y<player.y+6);
      if(near){
        if(player.blocking && (p.rain || Math.sign(p.x-player.x)===player.facing)){ if(player.blockT<0.22){ spawnFX('parry',p.x,p.y,{}); gainUlt(16); toast('ΠΑΡΥ!'); window.SFX&&SFX.parry(); } else { spawnFX('block',p.x,p.y,{}); window.SFX&&SFX.block(); } hit=true; }
        else { hurtPlayer(p.dmg); hit=true; } } }
    if(hit||p.life<=0||p.x<-80||p.x>WORLD_W+80||p.y>GY+20){ if(p.y>GY+10) spawnFX('spark',p.x,GY,{}); projectiles.splice(i,1); }
  }
}
function updateFX(dt){ for(let i=fx.length-1;i>=0;i--){ const f=fx[i]; f.life+=dt;
  if(f.type==='dmg'){ f.y-=dt*70; if(f.vx){ f.x+=f.vx*dt; f.vx*=0.9; } }
  else if(f.type==='p'){ f.x+=f.vx; f.y+=f.vy; f.vy+=(f.g||0); f.vx*=0.96; if(f.y>GY+4){ f.y=GY+4; f.vy*=-0.3; } }
  else if(f.type==='wdrop'){ f.x+=f.vx; f.y+=f.vy; f.vy+=0.5; f.rot+=f.spin*dt;
    if(f.y>=GY-4){ f.y=GY-4; if(Math.abs(f.vy)>2){ f.vy*=-0.3; f.vx*=0.5; f.spin*=0.4; } else { f.vy=0; f.vx=0; f.spin=0; } } }
  if(f.life>=f.max) fx.splice(i,1); } }

/* ---------- render ---------- */
function render(){
  ctx.setTransform(RES,0,0,RES,0,0);   // base backing-store scale (LITE devices render smaller)
  ctx.save();
  const shx=(Math.random()-.5)*shake, shy=(Math.random()-.5)*shake*0.7;
  if(bgActive){ ctx.clearRect(0,0,W,H); const mc=Math.max(1,WORLD_W-W), pxx=-(camX/mc)*60;
    const sc=document.getElementById('bgScene'); if(sc) sc.style.transform='translate('+(pxx+shx*0.5).toFixed(1)+'px,'+(-22+shy*0.5).toFixed(1)+'px) scale('+(1.08*zoom).toFixed(4)+')'; }
  // camera punch-in: zoom about the action line, shake rides on top
  ctx.translate(W/2+shx, H*0.62+shy); ctx.scale(zoom,zoom); ctx.translate(-W/2,-H*0.62);
  if(!bgActive) D.drawScene(ctx,R,gameT,camX);
  ctx.save(); ctx.translate(-camX,0);
  items.forEach(it=>D.drawItem(ctx,it,gameT));
  const ents=[...enemies].sort((a,b)=>a.y-b.y);
  ents.forEach(e=>{ ctx.save();
    if(e.dead){ const fade=e.corpseT>6?Math.max(0,(8-e.corpseT)/2):1; ctx.globalAlpha=0.94*fade; }
    if(e.boss) D.drawBoss(ctx,e); else D.drawWarrior(ctx, Object.assign({shield:e.shield,emblem:e.champion?e.crest:null},e));
    ctx.restore(); if(!e.dead&&e.champion) miniBar(e); });
  const heroSkin = campaignKey==='iliada'
    ? {scale:1.5, tint:'#2E1C12', armor:'#C8842B', armorHi:'#F0C44A'}
    : {scale:1.5, tint:'#6E4A30', ragged:true, wrap:'#A8865A', bowColor:'#5E3E1E'};
  // hero afterimages (dash / thrust / post-ult)
  ghosts.forEach(g=>{ const a=(g.max>0.25?0.24:0.13)*(1-g.life/g.max);
    ctx.save(); ctx.globalAlpha=a;
    D.drawWarrior(ctx, Object.assign({},g,R.hero,heroSkin,{flat:'#E8C96A',ghost:true,blocking:false,hurt:0}));
    ctx.restore(); });
  if(!player.dead) D.drawWarrior(ctx, Object.assign({},player,R.hero,heroSkin,{heroCrest:true}));
  else { ctx.save(); ctx.globalAlpha=.55;
    D.drawWarrior(ctx, Object.assign({},player,R.hero,heroSkin,{dead:true, deadRot:player.facing*Math.min(1.47,(gameT-(player.deadAt||gameT))*5), ragSeed:0.44}));
    ctx.restore(); }
  projectiles.forEach(p=>D.drawProjectile(ctx,p));
  renderFX();
  ctx.restore();
  ctx.restore();
  if(flash>0){ ctx.fillStyle='rgba(246,200,120,'+(flash*0.5)+')'; ctx.fillRect(0,0,W,H); }
  let vgA=0; // red edge vignette: spikes on hurt, breathes when near death
  if(player.hurt>0 && !player.dead) vgA=Math.min(0.28, player.hurt/0.2*0.28);
  if(player.hp<25 && !player.dead && state==='play')
    vgA=Math.max(vgA, RM?0.12 : 0.10+0.07*Math.sin(gameT*5.2));
  if(vgA>0.005){
    const vg=ctx.createRadialGradient(W/2,H/2,H*0.42,W/2,H/2,H*0.85);
    vg.addColorStop(0,'rgba(180,30,20,0)'); vg.addColorStop(1,'rgba(180,30,20,'+vgA+')');
    ctx.fillStyle=vg; ctx.fillRect(0,0,W,H); }
}
function miniBar(e){ const w=52,x=e.x-w/2,y=e.y-200; ctx.fillStyle='rgba(10,6,3,.7)'; ctx.fillRect(x-1,y-1,w+2,6);
  ctx.fillStyle='#C8842B'; ctx.fillRect(x,y,w*Math.max(0,e.hp/e.maxHp),4); }
function renderFX(){
  fx.forEach(f=>{ const a=1-f.life/f.max;
    if(f.type==='dmg'){ const pin=Math.min(1,f.life/0.09), pop=1+0.65*(1-pin); // pop-in scale
      ctx.save(); ctx.globalAlpha=Math.min(1,2-2*f.life/f.max);
      ctx.translate(f.x,f.y); ctx.rotate(f.rot||0); ctx.scale(pop,pop);
      ctx.font=(f.crit?'700 46px':'700 32px')+' Anton, sans-serif'; ctx.textAlign='center';
      ctx.lineWidth=f.crit?5:4; ctx.strokeStyle='rgba(16,8,4,.85)'; ctx.strokeText(f.val,0,0);
      ctx.fillStyle=f.enemy?'#D2452E':(f.crit?'#E8C96A':'#E2A867'); ctx.fillText(f.val,0,0);
      ctx.restore(); }
    else if(f.type==='p'){ ctx.globalAlpha=Math.max(0,1-f.life/f.max); ctx.fillStyle=f.col;
      ctx.beginPath(); ctx.arc(f.x,f.y,f.r*(1-0.4*f.life/f.max),0,7); ctx.fill(); ctx.globalAlpha=1; }
    else if(f.type==='word'){ const pin=Math.min(1,f.life/0.12), a2=Math.min(1,2.4-2.4*f.life/f.max);
      ctx.save(); ctx.globalAlpha=Math.max(0,a2);
      ctx.translate(f.x,f.y-18*(f.life/f.max)); ctx.scale(0.5+0.5*pin+0.16*Math.sin(f.life*18),0.5+0.5*pin);
      ctx.rotate(-0.05+0.03*Math.sin(f.life*22));
      ctx.font='700 52px Anton, sans-serif'; ctx.textAlign='center';
      ctx.lineWidth=7; ctx.strokeStyle='rgba(16,8,4,.9)'; ctx.strokeText(f.txt,0,0);
      ctx.fillStyle=f.col||'#E8C96A'; ctx.fillText(f.txt,0,0); ctx.restore(); }
    else if(f.type==='wdrop'){ ctx.save(); ctx.globalAlpha=Math.min(1,2-2*f.life/f.max)*0.9;
      ctx.translate(f.x,f.y); ctx.rotate(f.rot);
      ctx.strokeStyle='#8A7A5E'; ctx.lineWidth=3; ctx.lineCap='round';
      ctx.beginPath(); ctx.moveTo(-9,0); ctx.lineTo(11,0); ctx.stroke();
      ctx.strokeStyle='#EEE2C4'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.moveTo(-6,0); ctx.lineTo(10,0); ctx.stroke();
      ctx.strokeStyle='#3A2414'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(-9,-3.6); ctx.lineTo(-9,3.6); ctx.stroke();
      ctx.restore(); }
    else if(f.type==='ring'){ ctx.globalAlpha=a*0.8; ctx.strokeStyle=f.col||'#F6E0A8'; ctx.lineWidth=3+6*a;
      ctx.beginPath(); ctx.arc(f.x,f.y,14+(1-a)*160,0,7); ctx.stroke(); ctx.globalAlpha=1; }
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
  const cv=hud.querySelector('#comboV');
  if(combo>1){ cv.textContent='×'+combo+' COMBO'; cv.classList.add('show');
    cv.style.fontSize=Math.min(17+combo*1.35,46)+'px';                     // grows with the streak
    cv.style.color= combo>=15?'#E8703A' : combo>=8?'#F0B43A' : '#E8C96A';
    cv.style.textShadow= combo>=8? '0 0 '+Math.min(6+combo,26)+'px rgba(232,140,58,.55)' : 'none';
  } else { cv.classList.remove('show'); cv.style.fontSize=''; cv.style.color=''; cv.style.textShadow=''; }
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
  try{
    zoom+=(1-zoom)*Math.min(1,dt*4);                     // punch-in relaxes in real time
    if(hitstop>0){ hitstop-=dt; acc=0; render(); updateHUD(); } // frame-freeze on connect
    else { acc+=dt; const step=1/60; let n=0; while(acc>=step&&n++<4){ update(step); acc-=step; }
      render(); updateHUD(); } }catch(err){ window.__frameErr=(err&&err.stack)||String(err); }
  window.__GAME={state,wave,total:totalWaves,score,kills,combo,hp:Math.round(player.hp),ammo:player.ammo,ult:Math.round(player.ult),
    pots:player.pots,mod:player.mod&&player.mod.name,enemies:enemies.length,boss:boss?Math.round(boss.hp):null,px:Math.round(player.x),camX:Math.round(camX)};
  requestAnimationFrame(frame);
}
function fit(){ const vp=document.querySelector('.viewport'); const s=Math.min(vp.clientWidth/W,vp.clientHeight/H);
  if(!(s>0&&isFinite(s))) return;
  document.querySelector('.stage').style.transform='scale('+s+')';
  // --ovb: counter-scale for quiz/end cards on short (landscape-phone) screens,
  // consumed only inside the max-height:560px media query — desktop unaffected.
  let b=1;
  if(window.innerHeight<560){ const eff=Math.min(1, window.innerWidth/760, window.innerHeight/430); b=Math.max(1, eff/s); }
  document.documentElement.style.setProperty('--ovb', b.toFixed(3));
  applyRes();
}
/* LITE: render the 1600×900 canvas into a smaller backing store (caps the
   effective DPR at ~2) — same layout size, far fewer pixels per frame. */
function applyRes(){
  let r=1;
  if(LITE){ const s=Math.min(window.innerWidth/W, window.innerHeight/H);
    const dpr=Math.min(window.devicePixelRatio||1, 2);
    r=Math.max(0.5, Math.min(1, s*dpr)); r=Math.round(r*20)/20; }
  if(r!==RES && canvas){ RES=r; canvas.width=Math.round(W*r); canvas.height=Math.round(H*r); }
}

/* ---------- boot ---------- */
function boot(){
  var _ib=document.getElementById('ia-boot');
  try {
  canvas=document.getElementById('game'); canvas.width=W; canvas.height=H; ctx=canvas.getContext('2d');
  if(LITE) document.documentElement.classList.add('lite');   // CSS drops backdrop blurs etc.
  hud=document.getElementById('hud'); bindInput();
  // portrait phones see the ΓΥΡΙΣΕ ΤΗ ΣΥΣΚΕΥΗ overlay — freeze combat underneath
  // so the hero is not slaughtered while the player rotates the device.
  try{
    const pmq=matchMedia('(max-width:900px) and (orientation:portrait)');
    const onOrient=()=>{ if(pmq.matches){ if(state==='play') setFreeze(true); }
      else{ const po=document.getElementById('pauseOverlay');
        if(state==='paused' && !helpOpen() && !(po&&po.classList.contains('show'))) setFreeze(false); } };
    (pmq.addEventListener?pmq.addEventListener.bind(pmq):pmq.addListener.bind(pmq))('change',onOrient);
    setTimeout(onOrient,0);   // after setup() below has started the run
  }catch(e){}
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
  god(on){ player.inv = on===false?0:1e9; },           // testing: ignore damage
  freeze(s){ hitstop = s||1; },                        // testing: hold the frame
  setCombo(n){ combo=n; comboTimer=99; },
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
