/* draw.js — canvas rendering for the playable game.
   World is wider than the screen (WORLD_W); drawScene parallax-scrolls with
   the camera so scenery moves as the hero walks. Red-figure silhouettes,
   parameter-driven poses (no CSS) for smooth motion. */
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

/* ============================ ACTORS ============================ */
function drawWarrior(ctx,o){
  const x=o.x,y=o.y,sc=o.scale||1,fc=o.facing||1; const base=o.hurt>0?'#F6E0A8':o.tint;
  ctx.save(); ctx.translate(x,y); ctx.scale(fc*sc,sc);
  ctx.fillStyle='rgba(0,0,0,.32)'; ctx.beginPath(); ctx.ellipse(0,2,28,7,0,0,7); ctx.fill();
  const walk=o.walk||0, swing=o.swing||0, jump=o.jumpY||0, block=o.blocking;
  ctx.translate(0,-jump);
  if(block) ctx.translate(-fc*3,4);
  if(o.cape){ ctx.fillStyle=o.cape; ctx.beginPath(); ctx.moveTo(-2,-72); ctx.quadraticCurveTo(-26,-50,-20+Math.sin(walk)*3,-6); ctx.lineTo(-6,-10); ctx.lineTo(-2,-66); ctx.fill(); }
  ctx.strokeStyle=base; ctx.lineWidth=7; ctx.lineCap='round';
  const lp=Math.sin(walk)*7;
  ctx.beginPath(); ctx.moveTo(-3,-40); ctx.lineTo(-6+lp,0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(4,-40); ctx.lineTo(7-lp,0); ctx.stroke();
  ctx.fillStyle=base;
  ctx.beginPath(); ctx.moveTo(-9,-40); ctx.lineTo(9,-40); ctx.lineTo(13,-24); ctx.lineTo(-13,-24); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-7,-63); ctx.lineTo(7,-63); ctx.lineTo(9,-38); ctx.lineTo(-9,-38); ctx.fill();
  // (bow is drawn at the weapon arm below)
  ctx.fillStyle=base; ctx.beginPath(); ctx.arc(0,-72,7,0,7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-8,-73); ctx.quadraticCurveTo(0,-86,8,-73); ctx.fill();
  // ---- ragged castaway (Odysseus) ----
  if(o.ragged){ const wr=o.wrap||'#9C7A4E';
    ctx.fillStyle=base; ctx.beginPath(); ctx.moveTo(-13,-24); for(let s=0;s<=6;s++){ const xx=-13+s*4.33; ctx.lineTo(xx,-24-((s%2)?6:0)); } ctx.lineTo(13,-24); ctx.closePath(); ctx.fill();
    ctx.strokeStyle=wr; ctx.lineWidth=3; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(-9,-61); ctx.lineTo(9,-43); ctx.stroke();
    ctx.fillStyle=wr; ctx.beginPath(); ctx.moveTo(-10,-62); ctx.lineTo(-1,-59); ctx.lineTo(-6,-49); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-8,-74); ctx.quadraticCurveTo(0,-82,8,-74); ctx.lineTo(8,-71); ctx.quadraticCurveTo(0,-78,-8,-71); ctx.fill();
  }
  if(o.crest && !o.ragged){ ctx.fillStyle=o.crest; ctx.beginPath(); ctx.moveTo(-2,-82); ctx.quadraticCurveTo(-7,-100,3,-95); ctx.quadraticCurveTo(9,-92,5,-80); ctx.fill(); }
  // ---- bronze armour (hero) ----
  if(o.armor){ const arm=base==='#F6E0A8'?'#F6E0A8':o.armor, hi=o.armorHi||'#F0C44A';
    ctx.fillStyle=arm; ctx.beginPath(); ctx.moveTo(-8,-63); ctx.lineTo(8,-63); ctx.lineTo(10,-41); ctx.lineTo(-10,-41); ctx.fill();
    ctx.strokeStyle='rgba(40,20,8,.45)'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(-9,-53); ctx.lineTo(9,-53); ctx.moveTo(0,-63); ctx.lineTo(0,-43); ctx.stroke();
    ctx.fillStyle='rgba(255,240,200,.35)'; ctx.beginPath(); ctx.moveTo(-7,-62); ctx.lineTo(-2,-62); ctx.lineTo(-4,-45); ctx.lineTo(-8,-45); ctx.fill();
    ctx.fillStyle=arm; ctx.beginPath(); ctx.moveTo(-11,-41); ctx.lineTo(11,-41); ctx.lineTo(12,-31); ctx.lineTo(-12,-31); ctx.fill();
    ctx.strokeStyle='rgba(40,20,8,.4)'; ctx.lineWidth=1; for(let s=-2;s<=2;s++){ ctx.beginPath(); ctx.moveTo(s*4.4,-40); ctx.lineTo(s*4.4,-31); ctx.stroke(); }
    ctx.fillStyle=hi; ctx.beginPath(); ctx.arc(-8,-60,4.4,0,7); ctx.fill(); ctx.beginPath(); ctx.arc(8,-60,4.4,0,7); ctx.fill();
    ctx.strokeStyle=arm; ctx.lineWidth=3.6; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(-5+lp*.6,-16); ctx.lineTo(-6+lp,-2); ctx.moveTo(6-lp*.6,-16); ctx.lineTo(7-lp,-2); ctx.stroke();
    ctx.fillStyle=arm; ctx.beginPath(); ctx.moveTo(-8,-73); ctx.quadraticCurveTo(0,-88,8,-73); ctx.lineTo(8,-70); ctx.quadraticCurveTo(0,-84,-8,-70); ctx.fill();
    ctx.fillRect(-1.6,-74,3.2,9);
  }
  // ---- weapon arm ----
  if(o.bow && o.shoot>0){
    const p=Math.max(0,Math.min(1,1-o.shoot/0.45)), draw=Math.sin(p*Math.PI), pull=draw*9;
    const bowC=o.bowColor||'#6E4A22';
    ctx.strokeStyle=base; ctx.lineWidth=5; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(8,-54); ctx.lineTo(22,-52); ctx.stroke();
    ctx.strokeStyle=bowC; ctx.lineWidth=3.2; ctx.beginPath(); ctx.arc(24,-52,16,-1.2,1.2); ctx.stroke();
    const ax=24+16*Math.cos(-1.2), ay=-52+16*Math.sin(-1.2), bx=24+16*Math.cos(1.2), by=-52+16*Math.sin(1.2);
    ctx.strokeStyle='rgba(235,224,196,.85)'; ctx.lineWidth=1.3; ctx.beginPath(); ctx.moveTo(ax,ay); ctx.lineTo(24-pull,-52); ctx.lineTo(bx,by); ctx.stroke();
    if(draw>0.15){ ctx.strokeStyle='#2A1A0E'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(24-pull,-52); ctx.lineTo(40-pull,-52); ctx.stroke();
      ctx.fillStyle=o.crest||'#C8542B'; ctx.beginPath(); ctx.moveTo(40-pull,-54); ctx.lineTo(45-pull,-52); ctx.lineTo(40-pull,-50); ctx.fill(); }
  } else {
    const swinging = swing>0, L=16;
    const A = (swinging && o.swingArm) ? o.swingArm : null;
    const p = swinging ? (1-swing) : 0;
    const ang = A ? (A.a0+(A.a1-A.a0)*p) : 0.22;        // rest: slightly down-forward
    const lunge = A ? (A.lunge||0)*Math.sin(p*Math.PI) : 0;
    const sx=8+lunge*0.4, hx=8+lunge+L*Math.cos(ang), hy=-56+L*Math.sin(ang);
    ctx.strokeStyle=base; ctx.lineWidth=5; ctx.lineCap='round';
    ctx.beginPath(); ctx.moveTo(sx,-56); ctx.lineTo(hx,hy); ctx.stroke();
    if(!o.bow || swinging){ const B=A?(A.blade||18):18, bx=hx+B*Math.cos(ang), by=hy+B*Math.sin(ang);
      ctx.strokeStyle=base; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(hx-Math.cos(ang)*2,hy-Math.sin(ang)*2); ctx.lineTo(hx+Math.cos(ang)*4,hy+Math.sin(ang)*4); ctx.stroke(); // guard
      ctx.strokeStyle='#D8C8A8'; ctx.lineWidth=3.4; ctx.beginPath(); ctx.moveTo(hx,hy); ctx.lineTo(bx,by); ctx.stroke(); }
  }
  // shield
  if(o.shield){ const shx= block?20:13, shy= block?-58:-46; ctx.fillStyle=o.shieldColor||base; ctx.beginPath(); ctx.arc(shx,shy,block?15:13,0,7); ctx.fill();
    if(o.emblem){ ctx.strokeStyle=o.emblem; ctx.lineWidth=2.2; ctx.beginPath(); ctx.arc(shx,shy,6,0,7); ctx.stroke(); } }
  ctx.restore();
}
function drawBoss(ctx,o){ const k=o.kind;
  if(k==='giant') return drawGiant(ctx,o);
  if(k==='caster') return drawCaster(ctx,o);
  return drawBossMelee(ctx,o);
}
function drawBossMelee(ctx,o){ const x=o.x,y=o.y,sc=o.scale||1.5,fc=o.facing||1; const base=o.hurt>0?'#F6E0A8':o.tint;
  ctx.save(); ctx.translate(x,y); ctx.scale(fc*sc,sc);
  ctx.fillStyle='rgba(0,0,0,.34)'; ctx.beginPath(); ctx.ellipse(0,2,34,8,0,0,7); ctx.fill();
  const walk=o.walk||0, swing=o.swing||0, ex= swing>0?Math.sin(swing*Math.PI)*30:7;
  if(o.cape!==false){ ctx.fillStyle='rgba(0,0,0,.25)'; ctx.beginPath(); ctx.moveTo(-4,-92); ctx.quadraticCurveTo(-34,-60,-26+Math.sin(walk)*4,-6); ctx.lineTo(-8,-12); ctx.lineTo(-4,-84); ctx.fill(); }
  // legs (broad stride)
  ctx.strokeStyle=base; ctx.lineWidth=9; ctx.lineCap='round'; const lp=Math.sin(walk)*8;
  ctx.beginPath(); ctx.moveTo(-6,-52); ctx.lineTo(-12+lp,0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(6,-52); ctx.lineTo(12-lp,0); ctx.stroke();
  // wide tunic + broad torso
  ctx.fillStyle=base; ctx.beginPath(); ctx.moveTo(-15,-52); ctx.lineTo(15,-52); ctx.lineTo(20,-28); ctx.lineTo(-20,-28); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-14,-88); ctx.lineTo(14,-88); ctx.lineTo(17,-52); ctx.lineTo(-17,-52); ctx.fill();
  // weapon arm
  ctx.strokeStyle=base; ctx.lineWidth=6; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(12,-80); ctx.lineTo(28+ex,-76-ex*.2); ctx.stroke();
  if(o.weapon==='bow'){ ctx.strokeStyle=base; ctx.lineWidth=4; ctx.beginPath(); ctx.arc(28+ex,-72,22,-1,1); ctx.stroke();
    ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(28+ex+22*Math.cos(-1),-72+22*Math.sin(-1)); ctx.lineTo(28+ex+22*Math.cos(1),-72+22*Math.sin(1)); ctx.stroke(); }
  else { ctx.strokeStyle='#D8C8A8'; ctx.lineWidth=4.2; ctx.beginPath(); ctx.moveTo(28+ex,-76-ex*.2); ctx.lineTo(52+ex,-71-ex*.5); ctx.stroke(); }
  // head + helmet
  ctx.fillStyle=base; ctx.beginPath(); ctx.arc(0,-100,9,0,7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-10,-101); ctx.quadraticCurveTo(0,-118,10,-101); ctx.fill();
  // tall crest plume
  ctx.fillStyle=o.crest; ctx.beginPath(); ctx.moveTo(-3,-114); ctx.quadraticCurveTo(-11,-144,6,-134); ctx.quadraticCurveTo(14,-129,7,-110); ctx.fill();
  // big round shield with concentric emblem
  const shx=18, shy=-66; ctx.fillStyle=base; ctx.beginPath(); ctx.arc(shx,shy,22,0,7); ctx.fill();
  ctx.strokeStyle='rgba(26,14,8,.7)'; ctx.lineWidth=2; ctx.beginPath(); ctx.arc(shx,shy,22,0,7); ctx.stroke();
  ctx.strokeStyle=o.crest; ctx.lineWidth=2.6; ctx.beginPath(); ctx.arc(shx,shy,9.5,0,7); ctx.stroke();
  ctx.fillStyle=o.crest; ctx.beginPath(); ctx.arc(shx,shy,3.4,0,7); ctx.fill();
  ctx.restore();
}
function drawGiant(ctx,o){ const x=o.x,y=o.y,sc=o.scale||2.4,fc=o.facing||1; const base=o.hurt>0?'#C98A52':o.tint;
  ctx.save(); ctx.translate(x,y); ctx.scale(fc*sc,sc);
  ctx.fillStyle='rgba(0,0,0,.34)'; ctx.beginPath(); ctx.ellipse(0,2,40,9,0,0,7); ctx.fill();
  const walk=o.walk||0, swing=o.swing||0;
  ctx.strokeStyle=base; ctx.lineWidth=14; ctx.lineCap='round'; const lp=Math.sin(walk)*8;
  ctx.beginPath(); ctx.moveTo(-10,-60); ctx.lineTo(-14+lp,0); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(10,-60); ctx.lineTo(14-lp,0); ctx.stroke();
  ctx.fillStyle=base; ctx.beginPath(); ctx.moveTo(-22,-118); ctx.lineTo(22,-118); ctx.lineTo(30,-56); ctx.lineTo(-30,-56); ctx.fill();
  const ex=swing>0?Math.sin(swing*Math.PI)*30:0;
  ctx.strokeStyle=base; ctx.lineWidth=12; ctx.beginPath(); ctx.moveTo(18,-110); ctx.lineTo(40+ex,-90+ex*.3); ctx.stroke();
  ctx.lineWidth=18; ctx.strokeStyle='#241509'; ctx.beginPath(); ctx.moveTo(40+ex,-90+ex*.3); ctx.lineTo(58+ex,-72+ex*.5); ctx.stroke();
  ctx.fillStyle=base; ctx.beginPath(); ctx.arc(0,-138,20,0,7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-20,-150); ctx.quadraticCurveTo(0,-176,20,-150); ctx.fill();
  ctx.fillStyle=o.eye||'#F6C44A'; ctx.beginPath(); ctx.arc(0,-140,7,0,7); ctx.fill();
  ctx.fillStyle='#1A0E06'; ctx.beginPath(); ctx.arc(0,-140,3,0,7); ctx.fill();
  ctx.restore(); }
function drawCaster(ctx,o){ const x=o.x,y=o.y,sc=o.scale||1.5,fc=o.facing||1; const base=o.hurt>0?'#E0F0C8':o.tint;
  ctx.save(); ctx.translate(x,y); ctx.scale(fc*sc,sc);
  ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.ellipse(0,2,26,7,0,0,7); ctx.fill();
  const sway=Math.sin(o.walk||0)*2; ctx.fillStyle=base;
  ctx.beginPath(); ctx.moveTo(-12,-66); ctx.lineTo(12,-66); ctx.lineTo(20,0); ctx.lineTo(-20,0); ctx.fill();
  if(o.arms){ ctx.strokeStyle=base; ctx.lineWidth=4; ctx.lineCap='round'; for(let i=0;i<3;i++){ const a=-0.6+i*0.5; ctx.beginPath(); ctx.moveTo(0,-40); ctx.lineTo(Math.cos(a)*26,-40+Math.sin(a)*22+sway*i); ctx.stroke(); } }
  ctx.fillStyle=base; ctx.beginPath(); ctx.arc(0,-74,7.5,0,7); ctx.fill();
  ctx.beginPath(); ctx.moveTo(-9,-72); ctx.quadraticCurveTo(0,-90,9,-72); ctx.fill();
  const wd=o.wand||'#CFF0A8'; ctx.strokeStyle=base; ctx.lineWidth=5; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(10,-58); ctx.lineTo(26,-86); ctx.stroke();
  ctx.strokeStyle=wd; ctx.lineWidth=2.6; ctx.beginPath(); ctx.moveTo(26,-86); ctx.lineTo(30,-104); ctx.stroke();
  ctx.fillStyle=wd; ctx.globalAlpha=0.6+0.4*Math.sin((o.walk||0)*4); ctx.beginPath(); ctx.arc(30,-105,5,0,7); ctx.fill(); ctx.globalAlpha=1;
  ctx.restore(); }

function drawProjectile(ctx,pr){ ctx.save(); ctx.translate(pr.x,pr.y); ctx.rotate(Math.atan2(pr.vy,pr.vx));
  if(pr.type==='spear'){ const lo=pr.low; if(lo){ ctx.strokeStyle='rgba(232,201,106,.35)'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-58,0); ctx.lineTo(-26,0); ctx.stroke(); }
    ctx.strokeStyle=lo?'#1A1009':'#2A1A0E'; ctx.lineWidth=lo?4.2:3.4; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(lo?-34:-26,0); ctx.lineTo(lo?20:16,0); ctx.stroke();
    ctx.fillStyle=lo?'#C8542B':'#D8C8A8'; ctx.beginPath(); ctx.moveTo(lo?20:16,-5); ctx.lineTo(lo?32:26,0); ctx.lineTo(lo?20:16,5); ctx.fill(); }
  else if(pr.type==='arrow'){ ctx.strokeStyle='#2A1A0E'; ctx.lineWidth=2.2; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(-18,0); ctx.lineTo(12,0); ctx.stroke();
    ctx.fillStyle='#E8C96A'; ctx.beginPath(); ctx.moveTo(12,-3); ctx.lineTo(20,0); ctx.lineTo(12,3); ctx.fill();
    ctx.strokeStyle='#C8542B'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.moveTo(-18,0); ctx.lineTo(-22,-3); ctx.moveTo(-18,0); ctx.lineTo(-22,3); ctx.stroke(); }
  else if(pr.type==='magic'){ const c=pr.col||'#CFF0A8'; ctx.fillStyle=c; ctx.globalAlpha=.85; ctx.beginPath(); ctx.arc(0,0,7,0,7); ctx.fill();
    ctx.globalAlpha=.3; ctx.beginPath(); ctx.arc(0,0,13,0,7); ctx.fill(); ctx.globalAlpha=1; ctx.strokeStyle=c; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(-16,0); ctx.lineTo(-6,0); ctx.stroke(); }
  else if(pr.type==='boulder'){ ctx.fillStyle='#3A2A1A'; ctx.beginPath(); ctx.arc(0,0,16,0,7); ctx.fill(); ctx.fillStyle='rgba(0,0,0,.3)'; ctx.beginPath(); ctx.arc(4,4,9,0,7); ctx.fill(); }
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
