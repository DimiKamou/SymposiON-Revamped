/* sym-loaders.js — SymposiON loading marks (vanilla, no deps)
   Every mark carries the full monogram: the sigma (Σ = "S") and the
   power button (the "ON"), powering on through a different motif.

   Variants:
     'ignite'    — power bow charges inside the Σ's mouth + orbit sweep   (splash)
     'meander'   — monogram inside a rotating Greek-key ring              (pages)
     'kylix'     — wine fills the cup, monogram glazed on the bowl        (games)
     'laurel'    — gilded laurel leaves orbit the monogram                (results)
     'inscribe'  — the Σ writes itself stroke-by-stroke, then ON ignites  (progress)

   Usage:
     <div id="box"></div>
     <script src="sym-loaders.js"></script>
     <script>
       SymLoaders.mount('#box', { variant:'ignite', size:120 });
     </script>

   Full-screen overlay:
     SymLoaders.show({ variant:'meander' });   // ...later...   SymLoaders.hide();
*/
(function (global) {

  /* ── Σ + power monogram in a local 100×100 frame, placed via scale/translate ── */
  function mark(sc, cx, cy, mode){
    const tx=(cx-50*sc).toFixed(2), ty=(cy-50*sc).toFixed(2);
    const ringCls = mode==='charge' ? 'syml-ring--charge' : '';
    return `<g transform="translate(${tx} ${ty}) scale(${sc})">
      <g fill="none" stroke="#D8BC60" stroke-width="5" stroke-linecap="square" stroke-linejoin="miter">
        <line x1="22" y1="20" x2="78" y2="20"/>
        <line x1="22" y1="20" x2="48" y2="50"/>
        <line x1="48" y1="50" x2="22" y2="80"/>
        <line x1="22" y1="80" x2="78" y2="80"/>
      </g>
      <g style="filter:drop-shadow(0 0 5px rgba(224,132,86,.6))">
        <circle class="${ringCls}" cx="64" cy="50" r="12" fill="none" stroke="#E08456" stroke-width="3.6"
                stroke-linecap="round" stroke-dasharray="75.4" stroke-dashoffset="9" transform="rotate(-90 64 50)"/>
        <line x1="64" y1="39" x2="64" y2="49" stroke="#E08456" stroke-width="3.6" stroke-linecap="round"/>
        <circle class="syml-dot" cx="64" cy="50" r="2.4" fill="#E08456"/>
      </g>
    </g>`;
  }

  const GOLD_DEFS = `
    <defs>
      <linearGradient id="symGoldG" gradientUnits="userSpaceOnUse" x1="22" y1="20" x2="100" y2="104">
        <stop offset="0" stop-color="#E8CF7E"/>
        <stop offset="0.5" stop-color="#D4B254"/>
        <stop offset="1" stop-color="#A8893A"/>
      </linearGradient>
    </defs>`;

  /* each builder returns the inner svg markup for a 0 0 W H viewBox */
  const VARIANTS = {
    ignite: { w:120, h:120, build(){
      return GOLD_DEFS + `
        <circle class="syml-orbit" cx="60" cy="60" r="51" fill="none" stroke="url(#symGoldG)"
                stroke-width="1.8" stroke-linecap="round" stroke-dasharray="46 274" opacity=".85"/>
        <circle cx="60" cy="60" r="51" fill="none" stroke="#D4B254" stroke-width="1" opacity=".1"/>
        ${mark(1.0, 58, 60, 'charge')}`;
    }},

    meander: { w:120, h:120, build(){
      const cx=60, cy=60, ringR=46, seg=12; let tiles='';
      for(let i=0;i<seg;i++){
        const a=(i/seg)*360-90, rad=a*Math.PI/180;
        const x=cx+ringR*Math.cos(rad), y=cy+ringR*Math.sin(rad);
        tiles+=`<g class="syml-tile" style="animation-delay:${(i*0.2).toFixed(2)}s" transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(a+90).toFixed(2)})">
          <path d="M -9 -4.5 L 9 -4.5 L 9 4.5 L 2.5 4.5 L 2.5 -1 L -3.5 -1 L -3.5 4.5 L -9 4.5 Z"
                fill="none" stroke="url(#symGoldG)" stroke-width="1.6"/></g>`;
      }
      return GOLD_DEFS + `
        <circle cx="60" cy="60" r="59" fill="none" stroke="#D4B254" stroke-width=".8" opacity=".2"/>
        <circle class="syml-inring" cx="60" cy="60" r="33" fill="none" stroke="#D4B254" stroke-width=".8" stroke-dasharray="3 7" opacity=".4"/>
        <g class="syml-mring">${tiles}</g>
        ${mark(0.56, 60, 60, 'on')}`;
    }},

    kylix: { w:150, h:124, build(){
      const sc=0.4, cx=75, cy=63, tx=(cx-50*sc).toFixed(2), ty=(cy-50*sc).toFixed(2);
      const mono = `<g transform="translate(${tx} ${ty}) scale(${sc})">
          <g fill="none" stroke="#F4EAD2" stroke-width="6" stroke-linecap="square" stroke-linejoin="miter">
            <line x1="22" y1="20" x2="78" y2="20"/><line x1="22" y1="20" x2="48" y2="50"/>
            <line x1="48" y1="50" x2="22" y2="80"/><line x1="22" y1="80" x2="78" y2="80"/>
          </g>
          <g style="filter:drop-shadow(0 0 3px #E08456)">
            <circle cx="64" cy="50" r="12" fill="none" stroke="#E08456" stroke-width="4.4"
                    stroke-linecap="round" stroke-dasharray="75.4" stroke-dashoffset="9" transform="rotate(-90 64 50)"/>
            <line x1="64" y1="39" x2="64" y2="49" stroke="#E08456" stroke-width="4.4" stroke-linecap="round"/>
          </g></g>`;
      return GOLD_DEFS + `
        <defs><clipPath id="symBowlClip"><path d="M 30 50 Q 30 86 75 86 Q 120 86 120 50 Z"/></clipPath></defs>
        <path d="M 30 50 Q 30 86 75 86 Q 120 86 120 50 Z" fill="#b08a4a"/>
        <g clip-path="url(#symBowlClip)"><g class="syml-wine">
          <rect x="28" y="62" width="94" height="42" fill="#8f3527"/>
          <ellipse class="syml-surf" cx="75" cy="62" rx="52" ry="5" fill="#b04a36"/>
        </g></g>
        ${mono}
        <g fill="none" stroke="url(#symGoldG)" stroke-width="2.4" stroke-linejoin="round">
          <path d="M 30 50 Q 30 86 75 86 Q 120 86 120 50 Z"/>
          <path d="M 30 53 Q 18 53 18 64 Q 18 75 29 76" stroke-linecap="round"/>
          <path d="M 120 53 Q 132 53 132 64 Q 132 75 121 76" stroke-linecap="round"/>
          <line x1="71" y1="86" x2="71" y2="104"/><line x1="79" y1="86" x2="79" y2="104"/>
          <line x1="58" y1="108" x2="92" y2="108" stroke-width="3"/>
        </g>`;
    }},

    laurel: { w:120, h:120, build(){
      const cx=60, cy=60, R=47, n=10; let leaves='';
      for(let i=0;i<n;i++){
        const a=(i/n)*360, rad=a*Math.PI/180;
        const x=cx+R*Math.cos(rad), y=cy+R*Math.sin(rad);
        leaves+=`<g transform="translate(${x.toFixed(2)} ${y.toFixed(2)}) rotate(${(a+90).toFixed(2)})">
          <path d="M 0 -7 Q 4.5 0 0 7 Q -4.5 0 0 -7 Z" fill="#D8BC60" opacity="${(0.4+0.6*(i/n)).toFixed(2)}"/></g>`;
      }
      return `
        <circle cx="60" cy="60" r="47" fill="none" stroke="#D4B254" stroke-width=".8" opacity=".16"/>
        <g class="syml-leaves">${leaves}</g>
        ${mark(0.56, 60, 60, 'on')}`;
    }},

    inscribe: { w:120, h:120, build(){
      return `
        <g class="syml-insc" transform="translate(10 10)">
          <g fill="none" stroke="#D8BC60" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">
            <line class="syml-d1" x1="22" y1="20" x2="78" y2="20"/>
            <line class="syml-d2" x1="22" y1="20" x2="48" y2="50"/>
            <line class="syml-d3" x1="48" y1="50" x2="22" y2="80"/>
            <line class="syml-d4" x1="22" y1="80" x2="78" y2="80"/>
          </g>
          <g style="filter:drop-shadow(0 0 5px rgba(224,132,86,.6))">
            <circle class="syml-igring" cx="64" cy="50" r="12" fill="none" stroke="#E08456" stroke-width="3.6"
                    stroke-linecap="round" stroke-dasharray="75.4" stroke-dashoffset="75.4" transform="rotate(-90 64 50)"/>
            <line x1="64" y1="39" x2="64" y2="49" stroke="#E08456" stroke-width="3.6" stroke-linecap="round"/>
          </g>
        </g>`;
    }}
  };

  function ensureStyles(){
    if (document.getElementById('sym-loaders-style')) return;
    const css = `
.sym-loaders{display:flex;flex-direction:column;align-items:center;gap:18px;
  font-family:'Cormorant Garamond',Georgia,serif;}
.sym-loaders__svg{display:block;filter:drop-shadow(0 0 12px rgba(212,178,84,.18));}
.sym-loaders__word{font-size:22px;font-weight:600;letter-spacing:.5px;color:#EFE9DC;}
.sym-loaders__word b{color:#E08456;font-weight:700;text-shadow:0 0 14px rgba(224,132,86,.55);}

.syml-ring--charge{animation:symlCharge 2s cubic-bezier(.6,0,.4,1) infinite;}
.syml-dot{transform-box:fill-box;transform-origin:center;animation:symlPulse 2s ease-in-out infinite;}
@keyframes symlCharge{0%{stroke-dashoffset:75.4}55%{stroke-dashoffset:9}100%{stroke-dashoffset:9}}
@keyframes symlPulse{0%,40%{opacity:.3;transform:scale(.8)}60%{opacity:1;transform:scale(1.2)}100%{opacity:.85;transform:scale(1)}}
@keyframes symlSpin{to{transform:rotate(360deg)}}

.syml-orbit{transform-origin:60px 60px;animation:symlSpin 1.5s linear infinite;}

.syml-mring{transform-origin:60px 60px;animation:symlSpin 7s linear infinite;}
.syml-inring{transform-origin:60px 60px;animation:symlSpin 10s linear infinite reverse;}
.syml-tile{animation:symlFade 2.6s ease-in-out infinite;}
@keyframes symlFade{0%,100%{opacity:.35}50%{opacity:1}}

.syml-wine{animation:symlFill 2.8s ease-in-out infinite;}
@keyframes symlFill{0%{transform:translateY(24px)}50%{transform:translateY(2px)}100%{transform:translateY(24px)}}
.syml-surf{transform-box:fill-box;transform-origin:center;animation:symlWave 1.2s ease-in-out infinite alternate;}
@keyframes symlWave{from{transform:translateX(-2px) scaleY(.85)}to{transform:translateX(2px) scaleY(1.15)}}

.syml-leaves{transform-origin:60px 60px;animation:symlSpin 3.6s linear infinite;}

.syml-insc{animation:symlInscFade 3.6s ease-in-out infinite;}
@keyframes symlInscFade{0%,3%{opacity:0}9%,90%{opacity:1}100%{opacity:0}}
.syml-d1{stroke-dasharray:56;animation:symlD1 3.6s linear infinite;}
.syml-d2{stroke-dasharray:39.7;animation:symlD2 3.6s linear infinite;}
.syml-d3{stroke-dasharray:39.7;animation:symlD3 3.6s linear infinite;}
.syml-d4{stroke-dasharray:56;animation:symlD4 3.6s linear infinite;}
@keyframes symlD1{0%{stroke-dashoffset:56}14%,100%{stroke-dashoffset:0}}
@keyframes symlD2{0%,14%{stroke-dashoffset:39.7}28%,100%{stroke-dashoffset:0}}
@keyframes symlD3{0%,28%{stroke-dashoffset:39.7}42%,100%{stroke-dashoffset:0}}
@keyframes symlD4{0%,42%{stroke-dashoffset:56}56%,100%{stroke-dashoffset:0}}
.syml-igring{animation:symlIgnite 3.6s ease-in-out infinite;}
@keyframes symlIgnite{0%,56%{stroke-dashoffset:75.4;opacity:.12}74%,100%{stroke-dashoffset:9;opacity:1}}

.sym-loaders-overlay{position:fixed;inset:0;z-index:9999;display:flex;align-items:center;justify-content:center;
  background:radial-gradient(ellipse 70% 60% at 50% 40%,#0E0C09,#050505 75%);animation:symlOverlay .3s ease;}
@keyframes symlOverlay{from{opacity:0}to{opacity:1}}

@media (prefers-reduced-motion:reduce){
  .syml-ring--charge,.syml-dot,.syml-orbit,.syml-mring,.syml-inring,.syml-tile,.syml-wine,.syml-surf,
  .syml-leaves,.syml-insc,.syml-d1,.syml-d2,.syml-d3,.syml-d4,.syml-igring{animation:none;}
  .syml-ring--charge,.syml-igring{stroke-dashoffset:9;}
  .syml-d1,.syml-d2,.syml-d3,.syml-d4{stroke-dashoffset:0;}
}`;
    const s = document.createElement('style');
    s.id = 'sym-loaders-style';
    s.textContent = css;
    document.head.appendChild(s);
  }

  function buildNode(opts){
    const v = VARIANTS[opts.variant] || VARIANTS.ignite;
    const size = opts.size || 120;
    const h = Math.round(size * v.h / v.w);
    const wrap = document.createElement('div');
    wrap.className = 'sym-loaders';
    let html = `<svg class="sym-loaders__svg" width="${size}" height="${h}" viewBox="0 0 ${v.w} ${v.h}"
      role="img" aria-label="SymposiON loading">${v.build()}</svg>`;
    if (opts.label) html += `<div class="sym-loaders__word">Symposi<b>ON</b></div>`;
    wrap.innerHTML = html;
    return wrap;
  }

  const SymLoaders = {
    variants: Object.keys(VARIANTS),
    mount(target, opts = {}){
      ensureStyles();
      const el = typeof target === 'string' ? document.querySelector(target) : target;
      if (!el) return null;
      const node = buildNode(opts);
      el.appendChild(node);
      return node;
    },
    show(opts = {}){
      ensureStyles();
      let ov = document.getElementById('sym-loaders-overlay');
      if (!ov){
        ov = document.createElement('div');
        ov.id = 'sym-loaders-overlay';
        ov.className = 'sym-loaders-overlay';
        document.body.appendChild(ov);
      }
      ov.innerHTML = '';
      ov.appendChild(buildNode(Object.assign({ size:140, label:true }, opts)));
      ov.style.display = 'flex';
      return ov;
    },
    hide(){
      const ov = document.getElementById('sym-loaders-overlay');
      if (ov){ ov.style.opacity = '0'; setTimeout(() => ov.remove(), 300); }
    }
  };

  global.SymLoaders = SymLoaders;
})(window);
