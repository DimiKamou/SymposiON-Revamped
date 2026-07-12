/* draw.js — canvas rendering for the playable game.
   BACKDROP: parallax drawScene (unchanged art direction).
   ACTORS:  procedurally-animated STICK FIGHTERS — two-bone IK limbs, real
   gait cycles, anticipation → strike → follow-through attack arcs, landing
   squash, hurt recoil, ragdoll deaths. Black-figure pottery palette; heroes
   and bosses read through accessories (crests, capes, hoplite shields,
   weapon silhouettes) driven by each rhapsody's data.js palette.
   Pure draw, no game state. Exposes window.DRAW, GROUND_Y (760), WORLD_W (3400). */
(function(){
'use strict';
const W=1600, H=900, GROUND_Y=760, WORLD_W=3400;

/* ============================ BACKDROP ============================ */
function drawScene(ctx, R, t, camX){
  const p=R.pal;
  // --- sky (screen-fixed) ---
  const g=ctx.createLinearGradient(0,0,0,900);
  p.sky.forEach((c,i)=>g.addColorStop(i/(p.sky.length-1),c));
  ctx.fillStyle=g; ctx.fillRect(0,0,W,H);
  if(p.radial){ const rg=ctx.createRadialGradient(W/2,300,80,W/2,520,1100);
    rg.addColorStop(0,'rgba(232,140,68,.12)'); rg.addColorStop(1,'rgba(0,0,0,0)'); ctx.fillStyle=rg; ctx.fillRect(0,0,W,H); }
  if(p.stars){ ctx.fillStyle='#ECE8FF'; for(let i=0;i<80;i++){ const x=(i*173-camX*0.1)%W; const sx=(x+W)%W, y=(i*97)%420;
    ctx.globalAlpha=.3+.5*(.5+.5*Math.sin(t*1.5+i)); ctx.fillRect(sx,y,2,2);} ctx.globalAlpha=1; }
  if(p.sun){ const sx=p.sun[0]*W-camX*0.12, sy=p.sun[1]*900; sun(ctx,sx,sy); }
  if(p.fire){ const fx=p.fire[0]*W-camX*0.2, fy=p.fire[1]*900;
    glow(ctx,fx,fy,300,'rgba(246,180,74,'+(0.5+0.1*Math.sin(t*6))+')'); }

  drawMotif(ctx,R,t,camX);

  // --- ground (full width) ---
  const gg=ctx.createLinearGradient(0,GROUND_Y,0,900); gg.addColorStop(0,p.ground); gg.addColorStop(1,'#0A0604');
  ctx.fillStyle=gg; ctx.fillRect(0,GROUND_Y,W,H-GROUND_Y);
  ctx.fillStyle='rgba(255,220,160,.06)'; ctx.fillRect(0,GROUND_Y,W,3);
  // scrolling ground pebbles → motion cue (1:1 with camera)
  ctx.fillStyle='rgba(0,0,0,.22)';
  for(let i=0;i<40;i++){ const wx=i*120+ (i*53%40); const sx=wx-camX; const m=((sx%(WORLD_W))+ (W*3))% (40*120);
    const px=(wx-camX)% (4800); const xx=((px)%4800+4800)%4800; if(xx<W+40){ ctx.fillRect(xx-20, GROUND_Y+30+(i*37%90), 22+(i%4)*6, 4);} }
}

function px(wx,camX,f){ return wx - camX*f; } // parallax screen-x

function drawMotif(ctx,R,t,camX){
  const p=R.pal, far=p.far;
  if(R.motif==='walls'){
    // far sea + horizon (slow)
    ctx.fillStyle='rgba(40,30,40,.5)';
    for(let i=0;i<6;i++){ const x=px(i*620,camX,.22); hill(ctx,x,470,360,120); }
    // beached ships (mid)
    for(let i=0;i<4;i++){ const x=px(300+i*760,camX,.78); ship(ctx,x,726,1.05-i*0.04,far); }
    // citadel of Troy (near the far end of the world)
    citadel(ctx, px(2680,camX,.7), far, p.ember==='city');
    // braziers (1:1)
    brazier(ctx, px(1200,camX,1), GROUND_Y, t, '#F6C44A');
    brazier(ctx, px(2200,camX,1), GROUND_Y, t, '#F6C44A');
  } else if(R.motif==='plain'){
    ctx.fillStyle=far; for(let i=0;i<5;i++){ const x=px(i*760,camX,.3); skyline(ctx,x,610); }
    brazier(ctx, px(900,camX,1), GROUND_Y, t, '#F6C44A');
    brazier(ctx, px(2400,camX,1), GROUND_Y, t, '#F6C44A');
  } else if(R.motif==='tent'){
    ctx.fillStyle=far; for(let i=0;i<6;i++){ const x=px(i*640,camX,.3); skyline(ctx,x,640); }
    tent(ctx, px(2400,camX,.7));
    brazier(ctx, px(700,camX,1), GROUND_Y, t, '#F6C44A');
    brazier(ctx, px(2050,camX,1), GROUND_Y, t, '#F6C44A');
  } else if(R.motif==='columns'){
    const back = p.accent==='#9DE0A8'?'#26341C':(p.accent==='#2FB6C0'?'#16323A':'#33240F');
    const front= p.accent==='#9DE0A8'?'#3A4A28':(p.accent==='#2FB6C0'?'#22424A':'#4A341E');
    for(let i=0;i<10;i++){ const x=px(120+i*300,camX,.45); column(ctx,x,260,back,.85); }   // back row
    for(let i=0;i<8;i++){ const x=px(40+i*420,camX,.85); column(ctx,x,200,front,1); }        // front row
    const fcol = p.accent==='#9DE0A8'?'#9DE0A8':'#F6C44A';
    brazier(ctx, px(560,camX,1), GROUND_Y, t, fcol);
    brazier(ctx, px(1600,camX,1), GROUND_Y, t, fcol);
    brazier(ctx, px(2600,camX,1), GROUND_Y, t, fcol);
  } else if(R.motif==='cave'){
    // stalactites (slow)
    ctx.fillStyle='#0A0608'; ctx.beginPath(); ctx.moveTo(0,0); let s=7,x=0;
    const rnd=()=>{ s=(s*9301+49297)%233280; return s/233280; };
    while(x<W+200){ const w=40+rnd()*90, h=30+rnd()*120; const sx=px(x,camX,.4); ctx.lineTo(sx+w/2,h); ctx.lineTo(sx+w,0); x+=w; }
    ctx.lineTo(W,0); ctx.fill();
    // cave wall arcs
    ctx.fillStyle=far; for(let i=0;i<4;i++){ const cx=px(500+i*900,camX,.55); ctx.beginPath(); ctx.moveTo(cx-340,GROUND_Y); ctx.quadraticCurveTo(cx,300,cx+340,GROUND_Y); ctx.fill(); }
    // central fire
    const fx=px(p.fire?p.fire[0]*W+200:1700,camX,.8); fire(ctx,fx,GROUND_Y,2.0,t,'#F6C44A');
    brazier(ctx, px(900,camX,1), GROUND_Y, t,'#F6C44A');
    brazier(ctx, px(2500,camX,1), GROUND_Y, t,'#F6C44A');
  } else if(R.motif==='sea'){
    // wave bands (scroll)
    for(let i=0;i<5;i++){ ctx.globalAlpha=.4+.3*Math.sin(t*2+i); ctx.fillStyle='rgba(220,200,150,.10)';
      const off=(camX*0.5+i*40)% 120; ctx.fillRect(0,590+i*34,W,2);} ctx.globalAlpha=1;
    // siren rocks across world
    ctx.fillStyle=far; for(let i=0;i<4;i++){ const rx=px(200+i*900,camX,.6); rock(ctx,rx,GROUND_Y); }
    // a drifting ship
    ship(ctx, px(1500,camX,.85), 640, 1.2, far);
  }
}

/* ---- backdrop primitives ---- */
function sun(ctx,x,y){ glow(ctx,x,y,210,'rgba(232,140,68,.34)');
  const cg=ctx.createRadialGradient(x,y,4,x,y,72); cg.addColorStop(0,'#FBE0A0'); cg.addColorStop(.5,'#F0B43A'); cg.addColorStop(1,'rgba(232,116,42,0)');
  ctx.fillStyle=cg; ctx.beginPath(); ctx.arc(x,y,72,0,7); ctx.fill(); }
function glow(ctx,x,y,r,col){ const g=ctx.createRadialGradient(x,y,4,x,y,r); g.addColorStop(0,col); g.addColorStop(1,'rgba(232,116,42,0)'); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill(); }
function hill(ctx,x,y,w,h){ ctx.beginPath(); ctx.moveTo(x-w/2,760); ctx.quadraticCurveTo(x,y,x+w/2,760); ctx.fill(); }
function skyline(ctx,x,base){ ctx.beginPath(); ctx.moveTo(x,760);
  const hs=[40,70,46,84,52,90,60]; for(let i=0;i<7;i++){ ctx.lineTo(x+i*110, base-hs[i]); ctx.lineTo(x+i*110+60, base-hs[i]); ctx.lineTo(x+i*110+60, 760);} ctx.lineTo(x+770,760); ctx.fill(); }
function citadel(ctx,x,col,burning){
  ctx.fillStyle=col;
  ctx.beginPath(); ctx.moveTo(x-360,760); ctx.lineTo(x-360,300); ctx.quadraticCurveTo(x,220,x+360,300); ctx.lineTo(x+360,760); ctx.fill();
  ctx.fillRect(x-300,260,90,500); ctx.fillRect(x+180,200,110,560);
  for(let i=0;i<10;i++) ctx.fillRect(x-280+i*56,250-i*2,30,26);
  ctx.fillStyle='#06040a'; ctx.beginPath(); ctx.moveTo(x-60,760); ctx.lineTo(x-60,560); ctx.quadraticCurveTo(x,510,x+60,560); ctx.lineTo(x+60,760); ctx.fill();
  if(burning){ glow(ctx,x+235,250,180,'rgba(232,116,42,.4)'); }
}
function ship(ctx,x,y,sc,col){ ctx.save(); ctx.translate(x,y); ctx.scale(sc,sc); ctx.fillStyle=col;
  ctx.strokeStyle=col; ctx.lineWidth=2.4; for(let i=0;i<6;i++){ ctx.beginPath(); ctx.moveTo(48+i*26,6); ctx.lineTo(40+i*26,34); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(18,0); ctx.quadraticCurveTo(120,24,222,0); ctx.quadraticCurveTo(210,16,196,18); ctx.lineTo(44,18); ctx.quadraticCurveTo(30,16,18,0); ctx.fill();
  ctx.beginPath(); ctx.moveTo(18,0); ctx.quadraticCurveTo(8,-12,20,-22); ctx.quadraticCurveTo(26,-12,30,-2); ctx.fill();
  ctx.fillStyle='#C8542B'; ctx.beginPath(); ctx.arc(30,-6,3.5,0,7); ctx.fill();
  ctx.strokeStyle=col; ctx.lineWidth=3.5; ctx.beginPath(); ctx.moveTo(120,6); ctx.lineTo(120,-64); ctx.stroke();
  ctx.lineWidth=2.5; ctx.beginPath(); ctx.moveTo(74,-52); ctx.lineTo(166,-52); ctx.stroke();
  ctx.fillStyle='#1A120C'; ctx.beginPath(); ctx.moveTo(80,-50); ctx.quadraticCurveTo(120,-42,160,-50); ctx.lineTo(158,-8); ctx.quadraticCurveTo(120,2,82,-8); ctx.fill();
  ctx.restore(); }
function column(ctx,x,top,tint,bright){ ctx.fillStyle=tint; ctx.globalAlpha=bright; ctx.fillRect(x-26,top,52,GROUND_Y-top);
  ctx.fillStyle='rgba(0,0,0,.32)'; ctx.fillRect(x+6,top,20,GROUND_Y-top);
  ctx.fillStyle=tint; ctx.fillRect(x-32,top-16,64,18); ctx.globalAlpha=1; }
function tent(ctx,x){ ctx.save(); ctx.translate(x,GROUND_Y); ctx.fillStyle='#241A12';
  ctx.beginPath(); ctx.moveTo(-150,0); ctx.quadraticCurveTo(0,-220,150,0); ctx.fill();
  ctx.fillStyle='#15100A'; ctx.fillRect(-6,-150,12,150);
  ctx.fillStyle='#06040a'; ctx.beginPath(); ctx.moveTo(-30,0); ctx.lineTo(-20,-110); ctx.quadraticCurveTo(0,-120,20,-110); ctx.lineTo(30,0); ctx.fill();
  ctx.restore(); }
function rock(ctx,x,y){ ctx.beginPath(); ctx.moveTo(x-140,y); ctx.lineTo(x-110,y-130); ctx.lineTo(x-40,y-160); ctx.lineTo(x+30,y-120); ctx.lineTo(x+90,y-150); ctx.lineTo(x+150,y); ctx.fill(); }
function brazier(ctx,x,y,t,col){ if(x<-80||x>W+80) return;
  ctx.strokeStyle='#1C140D'; ctx.lineWidth=6; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x-12,y-40); ctx.lineTo(x-20,y+24); ctx.moveTo(x+12,y-40); ctx.lineTo(x+20,y+24); ctx.moveTo(x,y-40); ctx.lineTo(x,y+24); ctx.stroke();
  ctx.fillStyle='#2A1C10'; ctx.beginPath(); ctx.ellipse(x,y-44,26,7,0,0,7); ctx.fill();
  glow(ctx,x,y-60,120, col==='#9DE0A8'?'rgba(157,224,168,.4)':'rgba(246,180,74,.4)');
  fire(ctx,x,y-44,1,t,col); }
function fire(ctx,x,y,sc,t,col){ if(x<-120||x>W+120) return; const f=1+0.12*Math.sin(t*14+x);
  ctx.save(); ctx.translate(x,y); ctx.scale(sc,sc*f);
  ctx.fillStyle=col==='#9DE0A8'?'#3FA85A':'#E8742A';
  ctx.beginPath(); ctx.moveTo(0,0); ctx.quadraticCurveTo(-16,-30,-6,-54); ctx.quadraticCurveTo(-2,-36,4,-46); ctx.quadraticCurveTo(2,-66,16,-80); ctx.quadraticCurveTo(10,-44,22,-34); ctx.quadraticCurveTo(20,-12,0,0); ctx.fill();
  ctx.fillStyle=col==='#9DE0A8'?'#9DE0A8':'#F6C44A';
  ctx.beginPath(); ctx.moveTo(0,-4); ctx.quadraticCurveTo(-10,-30,-2,-50); ctx.quadraticCurveTo(2,-34,8,-44); ctx.quadraticCurveTo(6,-60,16,-72); ctx.quadraticCurveTo(10,-40,18,-30); ctx.quadraticCurveTo(14,-14,0,-4); ctx.fill();
  ctx.restore(); }

/* ============================ STICK RIG ============================ */
/* Local rig space: origin at the feet, +x = "forward" (facing handled via
   ctx scale flip), up = negative y. Figure ≈ 86 units tall before o.scale. */
const TAU=Math.PI*2;
const NOW=()=> (typeof performance!=='undefined'?performance.now():Date.now())/1000;
const clamp=(v,a,b)=> v<a?a:v>b?b:v;
const lerp=(a,b,t)=> a+(b-a)*t;
const ease=t=> t<=0?0:t>=1?1:t*t*(3-2*t);

/* two-bone IK: shoulder/hip (ax,ay) → target (bx,by); bend = ±1 elbow/knee side */
function ik(ax,ay,bx,by,l1,l2,bend){
  let dx=bx-ax, dy=by-ay, d=Math.hypot(dx,dy)||1e-4; const m=l1+l2-0.4;
  if(d>m){ const f=m/d; dx*=f; dy*=f; d=m; bx=ax+dx; by=ay+dy; }
  const q=clamp((l1*l1+d*d-l2*l2)/(2*l1*d),-1,1);
  const th=Math.atan2(dy,dx)+Math.acos(q)*bend;
  return {mx:ax+Math.cos(th)*l1, my:ay+Math.sin(th)*l1, ex:bx, ey:by};
}
function limb(ctx,ax,ay,j,w,col){ ctx.strokeStyle=col; ctx.lineWidth=w; ctx.lineCap='round'; ctx.lineJoin='round';
  ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(j.mx,j.my); ctx.lineTo(j.ex,j.ey); ctx.stroke(); }
function seg(ctx,x1,y1,x2,y2,w,col){ ctx.strokeStyle=col; ctx.lineWidth=w; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke(); }

/* ---- weapon silhouettes (drawn at hand, along angle) ---- */
function drawSword(ctx,x,y,ang,len,base,flat){
  const c=Math.cos(ang), s=Math.sin(ang);
  // grip + pommel
  seg(ctx, x-c*3.5, y-s*3.5, x+c*3, y+s*3, 3.2, flat||'#3A2414');
  ctx.fillStyle=flat||'#E8C96A'; ctx.beginPath(); ctx.arc(x-c*4.5,y-s*4.5,2.2,0,7); ctx.fill();
  // cross-guard
  seg(ctx, x+c*3-s*4.5, y+s*3+c*4.5, x+c*3+s*4.5, y+s*3-c*4.5, 2.6, flat||'#8E6A2A');
  // blade (bright edge over dark core)
  seg(ctx, x+c*4, y+s*4, x+c*len, y+s*len, 3.6, flat||'#8A7A5E');
  seg(ctx, x+c*4, y+s*4, x+c*(len-1), y+s*(len-1), 1.8, flat||'#EEE2C4');
}
function drawSpearWpn(ctx,x,y,ang,len,flat){
  const c=Math.cos(ang), s=Math.sin(ang), b=len*0.42;
  seg(ctx, x-c*b, y-s*b, x+c*len, y+s*len, 2.8, flat||'#2A1A0E');
  ctx.fillStyle=flat||'#D8C8A8'; ctx.beginPath();
  ctx.moveTo(x+c*len - s*3, y+s*len + c*3); ctx.lineTo(x+c*(len+9), y+s*(len+9)); ctx.lineTo(x+c*len + s*3, y+s*len - c*3); ctx.fill();
}
function drawClub(ctx,x,y,ang,len,flat){
  const c=Math.cos(ang), s=Math.sin(ang);
  ctx.strokeStyle=flat||'#241509'; ctx.lineCap='round';
  ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+c*len*0.4,y+s*len*0.4); ctx.stroke();
  ctx.lineWidth=13; ctx.beginPath(); ctx.moveTo(x+c*len*0.4,y+s*len*0.4); ctx.lineTo(x+c*len,y+s*len); ctx.stroke();
}
function drawBow(ctx,x,y,pull,crest,flat,bowC){
  ctx.strokeStyle=flat||bowC||'#6E4A22'; ctx.lineWidth=3; ctx.lineCap='round';
  ctx.beginPath(); ctx.arc(x,y,15,-1.2,1.2); ctx.stroke();
  const ax=x+15*Math.cos(-1.2), ay=y+15*Math.sin(-1.2), bx=x+15*Math.cos(1.2), by=y+15*Math.sin(1.2);
  ctx.strokeStyle=flat||'rgba(235,224,196,.85)'; ctx.lineWidth=1.3;
  ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(x-pull,y); ctx.lineTo(bx,by); ctx.stroke();
  if(pull>2){ seg(ctx, x-pull, y, x+15, y, 1.8, flat||'#2A1A0E');
    ctx.fillStyle=flat||crest||'#C8542B'; ctx.beginPath(); ctx.moveTo(x+15,y-2.5); ctx.lineTo(x+20,y); ctx.lineTo(x+15,y+2.5); ctx.fill(); }
}
function drawShield(ctx,x,y,r,col,emblem,flat){
  ctx.fillStyle=flat||col; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.fill();
  if(flat) return;
  ctx.strokeStyle='rgba(20,10,4,.55)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(x,y,r,0,7); ctx.stroke();
  ctx.strokeStyle='rgba(255,240,200,.22)'; ctx.lineWidth=1.4; ctx.beginPath(); ctx.arc(x,y,r-2.4,-2.4,-0.8); ctx.stroke();
  if(emblem){ ctx.strokeStyle=emblem; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(x,y,r*0.45,0,7); ctx.stroke();
    ctx.fillStyle=emblem; ctx.beginPath(); ctx.arc(x,y,r*0.14,0,7); ctx.fill(); }
}

/* ---- attack phase scalars from o.swing (1→0) ----
   windK: anticipation pull-back · strikeK: the hit itself · followK: settle */
function attackPhase(o){
  if(!(o.swing>0)) return {windK:0,strikeK:0,followK:0,active:false};
  const p=1-o.swing;
  let windK=0, strikeK=0, followK=0;
  if(p<0.26){ windK=ease(p/0.26); }
  else if(p<0.52){ const q=(p-0.26)/0.26; windK=1-ease(q); strikeK=ease(q); }
  else { strikeK=1; followK=ease((p-0.52)/0.48); }
  return {windK,strikeK,followK,active:true};
}

const SWING_CHOP  ={a0:-1.85,a1:0.62,blade:19,lunge:4};   // default enemy overhead
const SWING_THRUST={a0:-0.45,a1:0.10,blade:26,lunge:8};   // spearman poke

/* =========================== STICK WARRIOR =========================== */
/* o: engine entity (player / soldier / archer / spearman / champion).
   Extra visual fields it understands: landT, vx, vy, onGround, ultTrail,
   flat (single-colour afterimage), dead+deadRot+ragSeed (ragdoll). */
function drawWarrior(ctx,o){
  const sc=(o.scale||1), fc=(o.facing||1), t=NOW();
  const flash = o.hurt>0 && ((o.hurt*30|0)%2===0);
  const base = o.flat || (flash ? '#FFF3D8' : (o.tint||'#22120C'));
  ctx.save(); ctx.translate(o.x,o.y);
  // ground shadow (skip for afterimages)
  if(!o.flat && !o.ghost){ const jY=o.jumpY||0; const sh=clamp(1-jY/220,0.35,1);
    ctx.fillStyle='rgba(0,0,0,'+(0.30*sh)+')'; ctx.beginPath(); ctx.ellipse(0,2,26*sc*sh+6,6.5*sc*sh+1.5,0,0,7); ctx.fill(); }
  if(o.dead){ ctx.rotate(o.deadRot!=null?o.deadRot:(fc*1.46*Math.min(1,o.fall||1))); }
  ctx.scale(fc*sc,sc);
  ctx.translate(0,-(o.jumpY||0));
  // landing squash / air stretch (pivot = feet = origin)
  let sqx=1, sqy=1;
  if(o.landT>0){ const s=Math.sin(clamp(o.landT/0.16,0,1)*Math.PI); sqy-=0.15*s; sqx+=0.19*s; }
  else if(o.onGround===false && o.vy!==undefined){ const st=clamp(-o.vy/22,-0.5,0.6); sqy+=st*0.07; sqx-=st*0.05; }
  ctx.scale(sqx,sqy);
  if(o.ghost){ ctx.globalAlpha*=0.82; }

  if(o.dead){ renderCorpse(ctx,o,base); ctx.restore(); return; }

  /* ---------- pose ---------- */
  const A=attackPhase(o);
  const ph=o.walk||0, moving=ph!==0;
  const air=(o.onGround===false)||(o.jumpY||0)>4;
  const blocking=!!o.blocking;
  const hurtK=o.hurt>0?clamp(o.hurt/0.18,0,1):0;
  const heavy=!!o.heavy, U=heavy?1.16:1;              // boss body magnifier
  const thigh=19*U, shin=19*U, uarm=12.5*U, farm=12.5*U;
  const legW=(heavy?7.4:5.2), armW=(heavy?6.2:4.3), torsoW=(heavy?9:6.6);

  // feet
  let fFx=6,fFy=0, fBx=-6,fBy=0, hipY=-36*U, hipX=0;
  if(air){ fFx=10; fFy=-15; fBx=-7; fBy=-5; hipY-=2; }
  else if(blocking){ fFx=11.5; fFy=0; fBx=-10; fBy=0; hipY+=6; }
  else if(moving){ const st=(heavy?8:9.5), lift=7.2;
    fFx=Math.cos(ph)*st;          fFy=-Math.max(0,Math.sin(ph))*lift;
    fBx=Math.cos(ph+Math.PI)*st;  fBy=-Math.max(0,Math.sin(ph+Math.PI))*lift;
    hipY+= -1.1+Math.abs(Math.cos(ph))*-1.8;
  } else { hipY+=Math.sin(t*2.2+(o.x||0)*0.13)*0.9;
    if(A.active||o.stun>0){ fFx=10; fBx=-9; } }
  if(A.active){ const L=(o.swingArm&&o.swingArm.lunge)||4;
    hipX += -1.6*A.windK + L*0.75*A.strikeK*(1-A.followK*0.6); }
  if(blocking) hipX-=1.5;
  if(o.landT>0){ hipY+=5.5*Math.sin(clamp(o.landT/0.16,0,1)*Math.PI); }

  // torso lean
  const fwdV = (o.vx!==undefined? o.vx*fc : (o.leanV||0)*fc*7);
  let lean = clamp(fwdV*0.034,-0.30,0.30);
  if(moving && o.vx===undefined) lean+=0.08;
  lean += -0.15*A.windK + 0.27*A.strikeK*(1-A.followK*0.5);
  lean += -0.38*hurtK + (blocking?0.12:0);
  if(air && o.vy!==undefined) lean += clamp(-o.vy*0.010,-0.10,0.14);
  if(o.stun>0) lean += Math.sin(t*13)*0.06 - 0.1;
  const TL=26*U;
  const nkX=hipX+Math.sin(lean)*TL, nkY=hipY-Math.cos(lean)*TL;

  // head
  const hR=7*U;
  let hdX=nkX+Math.sin(lean)*7 + (hurtK? -2.5:0), hdY=nkY-7.6*U + (hurtK? 1.5:0);
  if(moving) hdY+=Math.abs(Math.cos(ph))*-0.7;

  // legs (IK, knees bend forward)
  const jF=ik(hipX,hipY,fFx,fFy,thigh,shin,-1);
  const jB=ik(hipX,hipY,fBx,fBy,thigh,shin,-1);
  const shX=nkX, shY=nkY+3*U;                         // shoulder joint

  /* ---------- layers, back → front ---------- */
  // cape (behind everything)
  if(o.cape && !o.flat){
    const sw=Math.sin(t*3.1+(o.x||0)*0.11)*2.2 + Math.sin(ph)*1.6;
    const drag=clamp(-fwdV*1.15,-4,14);
    ctx.fillStyle=o.cape;
    ctx.beginPath(); ctx.moveTo(nkX-1.5,nkY+2);
    ctx.quadraticCurveTo(nkX-14-drag*0.7, hipY-6+sw*0.4, nkX-13-drag+sw, -4+Math.abs(sw));
    ctx.quadraticCurveTo(nkX-7-drag*0.5, hipY+2, hipX-3, hipY+1);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.25)';
    ctx.beginPath(); ctx.moveTo(nkX-1.5,nkY+2);
    ctx.quadraticCurveTo(nkX-9-drag*0.4, hipY-2, hipX-3, hipY+1); ctx.closePath(); ctx.fill();
  }

  // back arm (shield / bow-idle / counter-swing)
  const hasShield=!!o.shield, isBow=!!(o.bow||o.kindRanged);
  let shieldPos=null;
  if(hasShield){
    const sr=(o.champion?11:9.5)*(heavy?1.5:1);
    shieldPos = blocking? {x:14,y:nkY+8*U-6, r:sr+3} : {x:11,y:nkY+11*U, r:sr};
    const jA=ik(shX-1.5,shY+1, shieldPos.x-3, shieldPos.y+2, uarm,farm, 1);
    limb(ctx,shX-1.5,shY+1,jA,armW,base);
  } else if(isBow && !(o.shoot>0)){
    // bow carried low in the back hand
    const hx=hipX-6, hy=hipY-2+Math.sin(ph)*1.5;
    const jA=ik(shX-1.5,shY+1,hx,hy,uarm,farm,1); limb(ctx,shX-1.5,shY+1,jA,armW,base);
    if(o.kindRanged){ ctx.save(); ctx.translate(hx,hy); ctx.rotate(-1.25); drawBow(ctx,0,0,0,o.crest,o.flat,o.bowColor); ctx.restore(); }
  } else {
    const aA=-Math.sin(ph)*0.55 + (A.active? -0.5-0.4*A.strikeK : 0) + hurtK*-0.8;
    const hx=shX+Math.sin(aA)*uarm*1.5, hy=shY+Math.cos(aA)*uarm*1.5+6;
    const jA=ik(shX-1.5,shY+1,hx,hy,uarm,farm,1); limb(ctx,shX-1.5,shY+1,jA,armW,base);
  }

  // back leg then front leg
  limb(ctx,hipX,hipY,jB,legW,base);
  limb(ctx,hipX,hipY,jF,legW,base);

  // torso spine + chest/pelvis wedges for silhouette weight
  seg(ctx,hipX,hipY,nkX,nkY,torsoW,base);
  ctx.fillStyle=base;
  ctx.beginPath(); // chest wedge
  ctx.moveTo(nkX-5.5*U,nkY-0.5); ctx.lineTo(nkX+6*U,nkY-0.5);
  ctx.lineTo(hipX+4.5*U,hipY-8*U); ctx.lineTo(hipX-4*U,hipY-8*U); ctx.closePath(); ctx.fill();
  ctx.beginPath(); // pelvis
  ctx.ellipse(hipX,hipY-1,4.6*U,3.4*U,0,0,7); ctx.fill();

  // ragged tunic (castaway Odysseus)
  if(o.ragged && !o.flat){ const wr=o.wrap||'#9C7A4E';
    ctx.fillStyle=base; ctx.beginPath(); ctx.moveTo(hipX-7,hipY-2);
    for(let s2=0;s2<=5;s2++){ const xx=hipX-7+s2*3; ctx.lineTo(xx, hipY+7+((s2%2)?3:0)); }
    ctx.lineTo(hipX+8,hipY-2); ctx.closePath(); ctx.fill();
    seg(ctx, nkX-4,nkY+3, hipX+5,hipY-4, 2.6, wr);       // baldric
  }

  // hero cuirass / soldier chest band
  if(o.armor && !o.flat){ const arm=flash?'#FFF3D8':o.armor, hi=o.armorHi||'#F0C44A';
    ctx.save(); ctx.translate(nkX,nkY); ctx.rotate(lean*0.8);
    ctx.fillStyle=arm; ctx.beginPath(); ctx.moveTo(-5.5,-1); ctx.lineTo(6,-1);
    ctx.lineTo(4.6,15); ctx.lineTo(-4.2,15); ctx.closePath(); ctx.fill();
    ctx.strokeStyle='rgba(40,20,8,.5)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(-4.6,7); ctx.lineTo(5,7); ctx.stroke();
    const gl=((t*0.9+(o.x||0)*0.01)%1); if(gl<0.5){ ctx.globalAlpha=0.4*Math.sin(gl/0.5*Math.PI);
      ctx.fillStyle='#FFF0C8'; ctx.beginPath(); ctx.moveTo(-5+gl*16,-1); ctx.lineTo(-2+gl*16,-1); ctx.lineTo(-4+gl*16,14); ctx.lineTo(-7+gl*16,14); ctx.fill(); ctx.globalAlpha=1; }
    ctx.fillStyle=hi; ctx.beginPath(); ctx.arc(-5.5,1.5,3.4,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(6,1.5,3.4,0,7); ctx.fill();
    ctx.restore();
    // greaves: bright shin fronts
    seg(ctx,jF.mx,jF.my,jF.ex,jF.ey,legW*0.5,arm);
    seg(ctx,jB.mx,jB.my,jB.ex,jB.ey,legW*0.5,arm);
  }

  // head + helmet + crest
  ctx.fillStyle=base; ctx.beginPath(); ctx.arc(hdX,hdY,hR,0,7); ctx.fill();
  if(o.ragged && !o.flat){ const wr=o.wrap||'#9C7A4E';   // head-wrap + tail
    ctx.strokeStyle=wr; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(hdX,hdY-1,hR-0.5,-Math.PI*0.95,-0.12); ctx.stroke();
    const fl=Math.sin(t*5+(o.x||0))*2;
    seg(ctx,hdX-hR+1,hdY-2,hdX-hR-5,hdY+3+fl,2.2,wr);
  } else {
    // corinthian helmet: dome + cheek guard
    ctx.fillStyle=base; ctx.beginPath();
    ctx.moveTo(hdX-hR-0.5,hdY+1); ctx.quadraticCurveTo(hdX,hdY-hR-5.5,hdX+hR+0.5,hdY+1);
    ctx.lineTo(hdX+hR-1,hdY+4.5); ctx.lineTo(hdX+3,hdY+4.5); ctx.lineTo(hdX+2,hdY+1.5); ctx.closePath(); ctx.fill();
    if(o.crest && !o.flat){ // swept horsehair crest: arcs up-and-back, trails with speed
      const cl=o.heroCrest?12:8, sway=Math.sin(t*4.2+(o.x||0)*0.2)*1.2 - clamp(fwdV*0.55,-3.5,3.5);
      ctx.fillStyle=flash?'#FFF3D8':o.crest; ctx.beginPath();
      ctx.moveTo(hdX+4.5,hdY-hR+1.5);
      ctx.quadraticCurveTo(hdX+1, hdY-hR-5.5, hdX-4, hdY-hR-4.5);
      ctx.quadraticCurveTo(hdX-5-cl*0.8+sway, hdY-hR-2.5+sway*0.3, hdX-6-cl+sway, hdY-hR+2.5+sway*0.5);
      ctx.quadraticCurveTo(hdX-4-cl*0.5+sway*0.6, hdY-hR-0.5, hdX-4.5,hdY-hR+1);
      ctx.closePath(); ctx.fill();
    }
  }

  /* ---------- weapon arm ---------- */
  const wSh={x:shX+1.5,y:shY};
  if((o.bow||o.kindRanged) && o.shoot>0){
    // BOW: draw + loose
    const p=clamp(1-o.shoot/0.45,0,1), drawK=Math.sin(p*Math.PI), pull=drawK*9;
    const bowX=wSh.x+15, bowY=wSh.y-2;
    const jA=ik(wSh.x,wSh.y,bowX-2,bowY,uarm,farm,-1); limb(ctx,wSh.x,wSh.y,jA,armW,base);   // bow arm
    const jS=ik(shX-1.5,shY+1, bowX-4-pull, bowY, uarm,farm, 1); limb(ctx,shX-1.5,shY+1,jS,armW,base); // string arm
    drawBow(ctx,bowX,bowY,pull,o.crest,o.flat,o.bowColor);
  } else if(o.shoot>0 && !o.bow && !o.kindRanged){
    // SPEAR THROW (Achilles): big overhead sling
    const p=clamp(1-o.shoot/0.45,0,1);
    const ang=lerp(-2.35,0.12,ease(Math.min(1,p*1.6)));
    const reach=uarm+farm-2;
    const hx=wSh.x+Math.cos(ang)*reach, hy=wSh.y+Math.sin(ang)*reach;
    const jA=ik(wSh.x,wSh.y,hx,hy,uarm,farm,-1); limb(ctx,wSh.x,wSh.y,jA,armW,base);
    if(p<0.45) drawSpearWpn(ctx,hx,hy,ang+0.1,20,o.flat);
  } else if(o.spearman){
    // SPEARMAN: long pike, two-handed; telegraph = coiled back + glint
    let ang=-0.42, hx,hy;
    if(o.telegraph>0){ ang=-0.85+Math.sin(t*30)*0.03;
      hx=wSh.x+3; hy=wSh.y+5;
    } else if(A.active){ ang=lerp(SWING_THRUST.a0,SWING_THRUST.a1, -0.25*A.windK + A.strikeK);
      hx=wSh.x+Math.cos(ang)*(uarm+farm-3)*(0.5+0.5*A.strikeK); hy=wSh.y+Math.sin(ang)*(uarm+farm-3)*(0.5+0.5*A.strikeK);
    } else { hx=wSh.x+7; hy=wSh.y+7+Math.sin(ph)*1.2; }
    const jA=ik(wSh.x,wSh.y,hx,hy,uarm,farm,-1); limb(ctx,wSh.x,wSh.y,jA,armW,base);
    drawSpearWpn(ctx,hx,hy,ang, o.telegraph>0?30:(A.active?34:28), o.flat);
    if(o.telegraph>0 && !o.flat){ const gx=hx+Math.cos(ang)*32, gy=hy+Math.sin(ang)*32;
      ctx.fillStyle='rgba(255,240,190,'+(0.5+0.5*Math.sin(t*26))+')'; ctx.beginPath(); ctx.arc(gx,gy,3.4,0,7); ctx.fill(); }
  } else {
    // SWORD (player combos via swingArm; enemies default chop)
    const SA=(A.active&&o.swingArm)?o.swingArm:(A.active?SWING_CHOP:null);
    let ang, reach;
    if(SA){ const prog=-0.22*A.windK + A.strikeK*(1+0.05*Math.sin(A.followK*Math.PI));
      ang=SA.a0+(SA.a1-SA.a0)*prog;
      reach=(uarm+farm-3)*(0.55+0.45*A.strikeK)+(SA.lunge||0)*0.4*A.strikeK;
    } else { ang=0.62+Math.sin(t*2.2+(o.x||0)*0.13)*0.05; reach=(uarm+farm)*0.62; }
    const hx=wSh.x+Math.cos(ang)*reach, hy=wSh.y+Math.sin(ang)*reach;
    const jA=ik(wSh.x,wSh.y,hx,hy,uarm,farm,-1); limb(ctx,wSh.x,wSh.y,jA,armW,base);
    const bl=(SA&&SA.blade)||17;
    drawSword(ctx,hx,hy,ang,bl,base,o.flat);
  }

  // shield on top of everything (front-facing hoplite guard)
  if(shieldPos){
    const scol = o.shieldColor || (typeof o.shield==='string'? o.shield : base);
    drawShield(ctx,shieldPos.x,shieldPos.y,shieldPos.r, flash?'#FFF3D8':scol, o.emblem, o.flat);
    if(blocking && !o.flat){ ctx.strokeStyle='rgba(157,180,200,'+(0.35+0.3*Math.sin(t*10))+')';
      ctx.lineWidth=2; ctx.beginPath(); ctx.arc(shieldPos.x,shieldPos.y,shieldPos.r+3.5,-1.4,1.4); ctx.stroke(); }
  }

  // parry-stun dizzy stars
  if(o.stun>0 && !o.flat){ ctx.fillStyle='#F0D89A';
    for(let k=0;k<3;k++){ const a2=t*4+k*2.1; ctx.globalAlpha=0.75;
      ctx.beginPath(); ctx.arc(hdX+Math.cos(a2)*11, hdY-hR-5+Math.sin(a2)*3.2, 1.7,0,7); ctx.fill(); }
    ctx.globalAlpha=1; }

  ctx.restore();
}

/* ---- ragdoll corpse: sprawled stick, seeded splay, weapon already flung ---- */
function renderCorpse(ctx,o,base){
  const s=(o.ragSeed!=null?o.ragSeed:((o.x||0)*0.377)%1)*10;
  const r1=Math.sin(s*3.7)*0.5, r2=Math.cos(s*2.3)*0.5, r3=Math.sin(s*5.1)*0.5;
  const U=o.heavy?1.16:1;
  const thigh=19*U, shin=19*U, uarm=12.5*U, farm=12.5*U;
  const legW=(o.heavy?7.4:5.2), armW=(o.heavy?6.2:4.3);
  const hipY=-34*U, nkX=3+r1*3, nkY=hipY-25*U;
  // limbs flung
  const jB=ik(0,hipY, -9+r2*5, -1, thigh,shin,-1);
  const jF=ik(0,hipY, 12+r1*5, -2+r3*2, thigh,shin,1);
  const jaB=ik(nkX-1,nkY+3, nkX-13+r3*5, nkY-6+r2*7, uarm,farm,1);
  const jaF=ik(nkX+1,nkY+3, nkX+13+r1*6, nkY-9+r3*6, uarm,farm,-1);
  limb(ctx,0,hipY,jB,legW,base); limb(ctx,0,hipY,jF,legW,base);
  seg(ctx,0,hipY,nkX,nkY,(o.heavy?9:6.6),base);
  ctx.fillStyle=base;
  ctx.beginPath(); ctx.moveTo(nkX-5*U,nkY); ctx.lineTo(nkX+5.5*U,nkY); ctx.lineTo(4*U,hipY-7*U); ctx.lineTo(-4*U,hipY-7*U); ctx.closePath(); ctx.fill();
  limb(ctx,nkX-1,nkY+3,jaB,armW,base); limb(ctx,nkX+1,nkY+3,jaF,armW,base);
  const hR=7*U, hdX=nkX+2+r2*2, hdY=nkY-7*U;
  ctx.beginPath(); ctx.arc(hdX,hdY,hR,0,7); ctx.fill();
  if(o.crest && !o.flat){ ctx.fillStyle=o.crest; ctx.beginPath();
    ctx.moveTo(hdX+3,hdY-hR+1); ctx.quadraticCurveTo(hdX-3,hdY-hR-8,hdX-9,hdY-hR-6);
    ctx.quadraticCurveTo(hdX-8,hdY-hR-1,hdX-5,hdY-hR+1); ctx.closePath(); ctx.fill(); }
}

/* ============================ BOSSES ============================ */
function drawBoss(ctx,o){ const k=o.kind;
  if(k==='giant') return drawGiant(ctx,o);
  if(k==='caster') return drawCaster(ctx,o);
  return drawBossMelee(ctx,o);
}
/* melee / archer bosses: the same stick rig, heavier + adorned */
function drawBossMelee(ctx,o){
  const o2=Object.assign({},o,{ heavy:true, shield:true,
    shieldColor:o.shieldColor||o.tint, emblem:o.emblem||o.crest,
    cape:o.cape!==false?(o.ghost?'rgba(120,140,190,.30)':'rgba(14,8,6,.55)'):null,
    heroCrest:true, bow:o.weapon==='bow', kindRanged:o.weapon==='bow',
    spearman:o.weapon==='spear' });
  if(o.ghost){ ctx.save(); ctx.globalAlpha*=0.8;
    if(!o.flat){ const t=NOW(); glow(ctx,o.x,o.y-70*(o.scale||1),90,'rgba(157,168,200,'+(0.16+0.08*Math.sin(t*3))+')'); }
    drawWarrior(ctx,o2); ctx.restore(); return; }
  drawWarrior(ctx,o2);
}
/* Polyphemus: hulking one-eyed brute, club smash */
function drawGiant(ctx,o){
  const sc=o.scale||2.4, fc=o.facing||1, t=NOW();
  const flash=o.hurt>0&&((o.hurt*30|0)%2===0);
  const base=o.flat||(flash?'#E8B478':o.tint);
  ctx.save(); ctx.translate(o.x,o.y);
  if(!o.flat){ ctx.fillStyle='rgba(0,0,0,.34)'; ctx.beginPath(); ctx.ellipse(0,2,40,9,0,0,7); ctx.fill(); }
  if(o.dead){ ctx.rotate(o.deadRot!=null?o.deadRot:(fc*1.4*Math.min(1,o.fall||1))); }
  ctx.scale(fc*sc,sc);
  const A=attackPhase(o), ph=o.walk||0, moving=ph!==0;
  const thigh=26, shin=26, uarm=19, farm=18;
  let hipY=-50, hipX=0;
  let fFx=10,fBx=-10,fFy=0,fBy=0;
  if(moving){ const st=9; fFx=Math.cos(ph)*st; fFy=-Math.max(0,Math.sin(ph))*6;
    fBx=Math.cos(ph+Math.PI)*st; fBy=-Math.max(0,Math.sin(ph+Math.PI))*6; hipY+=Math.abs(Math.cos(ph))*-2; }
  else hipY+=Math.sin(t*1.8)*1.2;
  if(A.active){ hipX+=-3*A.windK+5*A.strikeK; }
  // hunched spine
  let lean=0.34 - 0.22*A.windK + 0.3*A.strikeK - (o.hurt>0?0.3:0);
  const nkX=hipX+Math.sin(lean)*34, nkY=hipY-Math.cos(lean)*34;
  const jF=ik(hipX,hipY,fFx,fFy,thigh,shin,-1), jB=ik(hipX,hipY,fBx,fBy,thigh,shin,-1);
  if(o.dead){ // simple giant collapse: reuse sprawl at bigger scale
    renderCorpse(ctx,Object.assign({},o,{heavy:true,scale:1}),base); ctx.restore(); return; }
  limb(ctx,hipX,hipY,jB,13,base); limb(ctx,hipX,hipY,jF,13,base);
  // massive torso slab
  ctx.fillStyle=base; ctx.beginPath();
  ctx.moveTo(nkX-14,nkY-2); ctx.lineTo(nkX+15,nkY-2); ctx.lineTo(hipX+13,hipY+2); ctx.lineTo(hipX-13,hipY+2); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.ellipse((nkX+hipX)/2+2,(nkY+hipY)/2+4,15,13,lean*0.5,0,7); ctx.fill(); // belly
  // off arm swings
  const oa=-Math.sin(ph)*0.4-0.3-(A.active?0.5*A.strikeK:0);
  const ohx=nkX-4+Math.sin(oa)*uarm*1.6, ohy=nkY+4+Math.cos(oa)*uarm*1.6;
  const jO=ik(nkX-4,nkY+4,ohx,ohy,uarm,farm,1); limb(ctx,nkX-4,nkY+4,jO,10,base);
  // club arm: huge overhead smash
  let ang; if(A.active){ ang=lerp(-2.5,0.85,-0.2*A.windK+A.strikeK); } else ang=-0.55+Math.sin(t*1.8)*0.06;
  const reach=(uarm+farm-4)*(A.active?(0.6+0.4*A.strikeK):0.7);
  const hx=nkX+6+Math.cos(ang)*reach, hy=nkY+2+Math.sin(ang)*reach;
  const jW=ik(nkX+6,nkY+2,hx,hy,uarm,farm,-1); limb(ctx,nkX+6,nkY+2,jW,10,base);
  drawClub(ctx,hx,hy,ang,34,o.flat);
  // head: single glowing eye
  const hdX=nkX+Math.sin(lean)*10, hdY=nkY-13;
  ctx.fillStyle=base; ctx.beginPath(); ctx.arc(hdX,hdY,14,0,7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(hdX-13,hdY-6); ctx.quadraticCurveTo(hdX,hdY-24,hdX+13,hdY-6); ctx.fill();
  if(!o.flat){ const ec=o.eye||'#F6C44A', pulse=0.75+0.25*Math.sin(t*5);
    glow(ctx,hdX+3,hdY-2,26,'rgba(246,196,74,'+(0.3*pulse)+')');
    ctx.fillStyle=ec; ctx.beginPath(); ctx.arc(hdX+3,hdY-2,5.5*pulse+1,0,7); ctx.fill();
    ctx.fillStyle='#1A0E06'; ctx.beginPath(); ctx.arc(hdX+3+(A.active?2:0),hdY-2,2.4,0,7); ctx.fill(); }
  ctx.restore();
}
/* Circe / Scylla: robed caster, floating bob, staff orb, tentacle arms */
function drawCaster(ctx,o){
  const sc=o.scale||1.5, fc=o.facing||1, t=NOW();
  const flash=o.hurt>0&&((o.hurt*30|0)%2===0);
  const base=o.flat||(flash?'#E0F0C8':o.tint);
  ctx.save(); ctx.translate(o.x,o.y);
  if(!o.flat){ ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(0,2,26,7,0,0,7); ctx.fill(); }
  if(o.dead){ ctx.rotate(o.deadRot!=null?o.deadRot:(fc*1.46*Math.min(1,o.fall||1))); }
  ctx.scale(fc*sc,sc);
  if(o.dead){ // crumpled robe
    ctx.fillStyle=base; ctx.beginPath(); ctx.moveTo(-20,0); ctx.quadraticCurveTo(-6,-16,10,-10);
    ctx.quadraticCurveTo(22,-4,20,0); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(15,-12,7,0,7); ctx.fill(); ctx.restore(); return; }
  const bob=Math.sin(t*2.1+(o.x||0)*0.1)*3;
  ctx.translate(0,bob*0.6);
  const A=attackPhase(o), cast=(o.cast>0)?clamp(o.cast/0.4,0,1):0;
  const sway=Math.sin((o.walk||0))*2;
  // robe with flared, waving hem
  ctx.fillStyle=base; ctx.beginPath(); ctx.moveTo(-11,-66);
  ctx.lineTo(11,-66); ctx.quadraticCurveTo(19,-30,20+Math.sin(t*3)*2,0);
  for(let k=4;k>=-4;k--){ ctx.lineTo(k*4.6, (k%2? -5:0)+Math.sin(t*4+k)*1.4); }
  ctx.quadraticCurveTo(-19,-30,-11,-66); ctx.closePath(); ctx.fill();
  ctx.fillStyle='rgba(0,0,0,.22)'; ctx.beginPath(); ctx.moveTo(2,-64); ctx.quadraticCurveTo(10,-30,12,-2); ctx.lineTo(4,-2); ctx.closePath(); ctx.fill();
  // scylla tentacle arms
  if(o.arms && !o.flat){ ctx.strokeStyle=base; ctx.lineCap='round';
    for(let i=0;i<3;i++){ const a2=-0.7+i*0.55, wig=Math.sin(t*3.4+i*1.9)*5;
      ctx.lineWidth=4.5-i*0.6; ctx.beginPath(); ctx.moveTo(-2,-44);
      ctx.quadraticCurveTo(Math.cos(a2)*18, -44+Math.sin(a2)*16+wig*0.5, Math.cos(a2)*30, -40+Math.sin(a2)*24+wig);
      ctx.stroke();
      ctx.fillStyle=o.wand||'#7EE0E8'; ctx.globalAlpha=0.7;
      ctx.beginPath(); ctx.arc(Math.cos(a2)*30,-40+Math.sin(a2)*24+wig,1.8,0,7); ctx.fill(); ctx.globalAlpha=1; ctx.fillStyle=base; }
  }
  // free hand weaves while casting
  const fa=-0.5+cast*-0.9+Math.sin(t*6)*0.12*cast;
  const fhx=-4+Math.cos(fa)*13, fhy=-52+Math.sin(fa)*13;
  seg(ctx,-3,-56,fhx,fhy,3.8,base);
  if(cast>0 && !o.flat){ ctx.fillStyle=o.wand||'#CFF0A8'; ctx.globalAlpha=0.5*cast;
    ctx.beginPath(); ctx.arc(fhx,fhy,4+3*cast,0,7); ctx.fill(); ctx.globalAlpha=1; }
  // head + hood
  ctx.fillStyle=base; ctx.beginPath(); ctx.arc(0,-74,7.5,0,7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-9.5,-70); ctx.quadraticCurveTo(0,-92,9.5,-70); ctx.quadraticCurveTo(0,-79,-9.5,-70); ctx.fill();
  if(o.crest && !o.flat){ ctx.strokeStyle=o.crest; ctx.lineWidth=1.6;
    ctx.beginPath(); ctx.arc(0,-73,9.5,-2.6,-0.5); ctx.stroke(); }
  // staff: raised while casting
  const sAng=cast>0? -1.35-0.15*cast : -1.05+sway*0.02;
  const shx=8, shy=-58;
  const stx=shx+Math.cos(sAng)*16, sty=shy+Math.sin(sAng)*16;
  seg(ctx,shx,shy,stx,sty,4.2,base);                       // staff arm
  const wd=o.flat||o.wand||'#CFF0A8';
  seg(ctx,stx-Math.cos(sAng)*6,sty-Math.sin(sAng)*6, stx+Math.cos(sAng)*22, sty+Math.sin(sAng)*22, 2.6, o.flat||'#3A2E1A');
  const ox=stx+Math.cos(sAng)*24, oy=sty+Math.sin(sAng)*24;
  if(!o.flat){ const pulse=0.55+0.45*Math.sin(t*5.2)+cast*0.6;
    glow(ctx,ox,oy,20+10*cast,'rgba(180,240,190,'+(0.20+0.25*cast)+')');
    ctx.fillStyle=wd; ctx.globalAlpha=clamp(pulse,0,1); ctx.beginPath(); ctx.arc(ox,oy,4.5+2.5*cast,0,7); ctx.fill(); ctx.globalAlpha=1; }
  else { ctx.fillStyle=wd; ctx.beginPath(); ctx.arc(ox,oy,4.5,0,7); ctx.fill(); }
  ctx.restore();
}

/* ============================ PROJECTILES ============================ */
function drawProjectile(ctx,pr){ ctx.save(); ctx.translate(pr.x,pr.y); ctx.rotate(Math.atan2(pr.vy,pr.vx));
  const spd=Math.hypot(pr.vx,pr.vy), trail=clamp(spd*3.4,16,60);
  if(pr.type==='spear'){ const lo=pr.low;
    // speed streak
    const g=ctx.createLinearGradient(-trail-26,0,-10,0); g.addColorStop(0,'rgba(232,201,106,0)'); g.addColorStop(1,lo?'rgba(232,140,68,.5)':'rgba(232,201,106,.4)');
    ctx.strokeStyle=g; ctx.lineWidth=lo?4:3; ctx.beginPath(); ctx.moveTo(-trail-26,0); ctx.lineTo(-14,0); ctx.stroke();
    ctx.strokeStyle=lo?'#1A1009':'#2A1A0E'; ctx.lineWidth=lo?4.2:3.4; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(lo?-34:-26,0); ctx.lineTo(lo?20:16,0); ctx.stroke();
    ctx.fillStyle=lo?'#C8542B':'#D8C8A8'; ctx.beginPath(); ctx.moveTo(lo?20:16,-5); ctx.lineTo(lo?32:26,0); ctx.lineTo(lo?20:16,5); ctx.fill(); }
  else if(pr.type==='arrow'){
    const g=ctx.createLinearGradient(-trail-18,0,-12,0); g.addColorStop(0,'rgba(232,201,106,0)'); g.addColorStop(1,'rgba(236,218,180,.38)');
    ctx.strokeStyle=g; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-trail-18,0); ctx.lineTo(-12,0); ctx.stroke();
    ctx.strokeStyle='#2A1A0E'; ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(-18,0); ctx.lineTo(12,0); ctx.stroke();
    ctx.fillStyle='#E8C96A'; ctx.beginPath(); ctx.moveTo(12,-3); ctx.lineTo(20,0); ctx.lineTo(12,3); ctx.fill();
    ctx.strokeStyle='#C8542B'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(-18,0); ctx.lineTo(-22,-3); ctx.moveTo(-18,0); ctx.lineTo(-22,3); ctx.stroke(); }
  else if(pr.type==='magic'){ const c=pr.col||'#CFF0A8', tt=NOW();
    const g=ctx.createLinearGradient(-trail-14,0,0,0); g.addColorStop(0,'rgba(180,240,190,0)'); g.addColorStop(1,c);
    ctx.globalAlpha=.4; ctx.strokeStyle=g; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(-trail-14,0); ctx.lineTo(-4,0); ctx.stroke();
    ctx.globalAlpha=.85; ctx.fillStyle=c; ctx.beginPath(); ctx.arc(0,0,6+Math.sin(tt*18)*1.4,0,7); ctx.fill();
    ctx.globalAlpha=.3; ctx.beginPath(); ctx.arc(0,0,13,0,7); ctx.fill(); ctx.globalAlpha=1; }
  else if(pr.type==='boulder'){ const tt=NOW();
    ctx.rotate(tt*4%TAU);
    ctx.fillStyle='#3A2A1A'; ctx.beginPath(); ctx.moveTo(-16,-8); ctx.lineTo(-4,-16); ctx.lineTo(12,-11); ctx.lineTo(16,4); ctx.lineTo(4,15); ctx.lineTo(-12,10); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.arc(4,4,8,0,7); ctx.fill(); }
  ctx.restore(); }

/* potion pickup */
function drawItem(ctx,it,t){ const bob=Math.sin(t*4+it.x)*4; ctx.save(); ctx.translate(it.x,it.y-30+bob);
  const PAL={ hp:['#D2452E','rgba(210,69,46,.5)','+'], rage:['#C8842B','rgba(232,180,74,.5)','Ϟ'],
    ammo:['#9DB4C8','rgba(157,180,200,.5)','➶'], ult:['#E8C96A','rgba(232,201,106,.6)','★'], coin:['#F0C44A','rgba(240,196,74,.55)','◆'] };
  const [col,gl,glyph]=PAL[it.kind]||PAL.hp; glow(ctx,0,0,28,gl);
  if(it.kind==='ult'||it.kind==='coin'){ // round orb / coin
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(0,0,12,0,7); ctx.fill();
    ctx.strokeStyle='rgba(26,14,6,.6)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(0,0,12,0,7); ctx.stroke();
    ctx.fillStyle='rgba(255,255,255,.4)'; ctx.beginPath(); ctx.arc(-4,-4,3,0,7); ctx.fill();
    ctx.fillStyle='#1A0E06'; ctx.font='700 12px Anton, sans-serif'; ctx.textAlign='center'; ctx.fillText(glyph,0,5);
  } else if(it.kind==='ammo'){ // quiver
    ctx.fillStyle='#2A1A12'; ctx.beginPath(); ctx.moveTo(-9,12); ctx.lineTo(9,12); ctx.lineTo(6,-14); ctx.lineTo(-6,-14); ctx.fill();
    ctx.strokeStyle=col; ctx.lineWidth=2; for(let k=-1;k<=1;k++){ ctx.beginPath(); ctx.moveTo(k*4,-14); ctx.lineTo(k*4,-22); ctx.stroke(); ctx.beginPath(); ctx.moveTo(k*4,-22); ctx.lineTo(k*4-2,-19); ctx.moveTo(k*4,-22); ctx.lineTo(k*4+2,-19); ctx.stroke(); }
  } else { // phial (hp / rage)
    ctx.fillStyle='#2A1A12'; ctx.beginPath(); ctx.moveTo(-6,-10); ctx.lineTo(6,-10); ctx.lineTo(6,-16); ctx.lineTo(-6,-16); ctx.fill();
    ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(-8,-10); ctx.quadraticCurveTo(-12,12,0,16); ctx.quadraticCurveTo(12,12,8,-10); ctx.fill();
    ctx.fillStyle='rgba(255,255,255,.35)'; ctx.beginPath(); ctx.ellipse(-3,2,2.4,5,0,0,7); ctx.fill();
    ctx.fillStyle='#1A0E06'; ctx.font='700 11px Anton, sans-serif'; ctx.textAlign='center'; ctx.fillText(glyph,0,6);
  }
  ctx.restore(); }

if(typeof window!=='undefined') Object.assign(window,{ DRAW:{drawScene,drawWarrior,drawBoss,drawProjectile,drawItem}, GROUND_Y, WORLD_W });
})();
