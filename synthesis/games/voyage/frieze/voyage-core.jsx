/* ════════════════════════════════════════════════════════════════════
   Η Ζωφόρος — shared renderer. Reads `window.VOYAGE` (set by each work's
   inline config) and draws the black-figure voyage spine. Figures come
   from `window.BF` (each work loads its own figure library first).
   ════════════════════════════════════════════════════════════════════ */
(function () {
  const { useEffect, useRef, useState } = React;
  const V = window.VOYAGE || {};
  const GROUND = V.ground || '#B45A30';
  const UNIT = V.unit || 'Ραψωδία';
  const ST = V.stations || [];
  const ZG = window.ZG;
  const GamePanel = ZG.GamePanel;

  /* ── arrival glyphs (monoline, gold) ───────────────────────────── */
  const ARR = {
    anchor: <g><circle cx="12" cy="4.2" r="2.1" /><path d="M12 6.3 V21" /><path d="M7.4 11.4 H16.6" /><path d="M4.5 13 a7.5 7.5 0 0 0 15 0" /><path d="M4.5 13 L2.6 14.6 M4.5 13 L6.6 14.2 M19.5 13 L21.4 14.6 M19.5 13 L17.4 14.2" /></g>,
    urn: <g><path d="M9 3 H15" /><path d="M10 3 Q8 7 12 8 Q16 7 14 3" /><path d="M12 8 Q5 9 6 15 Q7 21 12 21 Q17 21 18 15 Q19 9 12 8 Z" /><path d="M6.6 12 Q3.5 13 5 15 M17.4 12 Q20.5 13 19 15" /></g>,
    stars: <g><path d="M8 5 L9 9 L13 10 L9 11 L8 15 L7 11 L3 10 L7 9 Z" /><path d="M17 9 L17.8 12 L21 12.8 L17.8 13.6 L17 17 L16.2 13.6 L13 12.8 L16.2 12 Z" /></g>,
    wreath: <g><path d="M12 4 Q4 7 5 14 Q6 20 12 21" /><path d="M12 4 Q20 7 19 14 Q18 20 12 21" /><path d="M6 9 Q9 9 9.5 11 M5.6 13 Q8.6 13 9 15 M18 9 Q15 9 14.5 11 M18.4 13 Q15.4 13 15 15" /></g>,
    flame: <g><path d="M12 21 Q5 18 6 12 Q7 7 12 3 Q12 8 15 9 Q14 6 16 5 Q20 10 18 15 Q16 21 12 21 Z" /><path d="M12 21 Q9 19 9.5 15 Q10 12 12 10" /></g>,
    mask: <g><path d="M6 5 Q12 3 18 5 Q19 13 16 18 Q14 21 12 21 Q10 21 8 18 Q5 13 6 5 Z" /><path d="M8.5 10 Q10 9 11.5 10 M12.5 10 Q14 9 15.5 10" /><path d="M9.5 16 Q12 14.5 14.5 16" /></g>,
  };
  function ArrGlyph({ kind }) {
    return (
      <svg viewBox="0 0 24 24" width="42" height="42" fill="none" stroke="currentColor"
           strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{ARR[kind] || ARR.anchor}</svg>
    );
  }

  /* ── small parts ───────────────────────────────────────────────── */
  const Progress = ({ s, dots }) =>
    s.lock
      ? <div className="fv-lock"><span className="fv-lockicon">⟡</span> κλειδωμένο</div>
      : <div className="fv-dots">{[0, 1, 2].map(d => <i key={d} className={d < (dots || 0) ? 'on' : ''} />)}</div>;

  const Glyph = ({ r, big }) =>
    <span className={`fv-g ${String(r).length > 1 ? 'rng' : ''} ${big ? 'big' : ''}`}>{r}</span>;

  const label = (s) => s.rlabel || `${UNIT} ${s.r}`;

  /* ── clickable numbered disc (opens trivia) ────────────────────── */
  function NodeDisc({ s, index, onOpen, count, big, cls }) {
    const open = () => onOpen(index);
    return (
      <div className={cls} role="button" tabIndex={0} onClick={open}
           onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } }}
           title={`${label(s)} — ερωτήσεις & διάλογος`}>
        <Glyph r={s.r} big={big} />
        {count > 0 && <span className="fv-qbadge">{count}</span>}
      </div>
    );
  }

  function Compact({ s, side, index, onOpen, count }) {
    return (
      <div className={`fv-row fv-c ${side}`} data-screen-label={label(s)}>
        <div className="fv-card fv-anim">
          <div className="fv-emblem"><BF name={s.fig} size={150} ground={GROUND} /></div>
          <div className="fv-ctext">
            <div className="fv-rh">{label(s)}</div>
            <div className="fv-tt">{s.t}</div>
            <div className="fv-meta">{s.reg} · <b>{s.ch}</b></div>
            <Progress s={s} dots={ZG.stationDots(index, s)} />
          </div>
        </div>
        <NodeDisc s={s} index={index} onOpen={onOpen} count={count} cls="fv-node fv-nodeanim fv-clic" />
      </div>
    );
  }

  function Hero({ s, sceneRight, index, onOpen, count }) {
    return (
      <div className={`fv-row fv-hero ${sceneRight ? 'sright' : ''}`} data-screen-label={`${label(s)} — εστίαση`}>
        <div className="fv-plaque fv-anim">
          <NodeDisc s={s} index={index} onOpen={onOpen} count={count} big cls="fv-medal fv-nodeanim fv-clic" />
          <div className="fv-scene"><BF name={s.fig} size={s.size || 290} ground={GROUND} /></div>
          <div className="fv-htext">
            <div className="fv-htag">{s.kick}</div>
            <div className="fv-htitle">{s.t}</div>
            <div className="fv-hmeta">{s.reg} · <b>{s.ch}</b></div>
            {s.proem && (
              <div className="fv-proem">
                {s.proem.map((l, k) => <div key={k} className="fv-pline">{l}</div>)}
                {s.gloss && <div className="fv-pgloss">{s.gloss}</div>}
              </div>
            )}
            <p className="fv-cap">{s.cap}</p>
            <div className="fv-hfoot"><Progress s={s} dots={ZG.stationDots(index, s)} /></div>
          </div>
        </div>
      </div>
    );
  }

  /* ── App ─────────────────────────────────────────────────────────── */
  function App() {
    const spine = useRef(null);
    const [open, setOpen] = useState(null);   // index of station whose trivia panel is open
    const [bump, setBump] = useState(0);      // recount badges after edits

    useEffect(() => {
      const g = window.gsap, STp = window.ScrollTrigger;
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (!g || !STp || reduce) return; // base CSS already shows everything
      let cleanup = () => {};
      // Defer to first rAF — if the ticker is throttled (offscreen iframe)
      // this never fires and nothing is ever hidden.
      const raf = requestAnimationFrame(() => {
        g.registerPlugin(STp);
        const IR = { immediateRender: false };
        g.from('.fv-head .anim', { ...IR, y: 26, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out' });
        g.from('.fv-topkey', { ...IR, opacity: 0, scaleX: 0.7, duration: 1.1, ease: 'power2.out', transformOrigin: 'center' });

        g.utils.toArray('.fv-anim').forEach((el) => {
          const row = el.closest('.fv-row');
          let fromX = 0;
          if (row.classList.contains('l')) fromX = -54;
          else if (row.classList.contains('r')) fromX = 54;
          g.from(el, { ...IR, x: fromX, y: 46, opacity: 0, duration: 0.9, ease: 'power3.out',
            scrollTrigger: { trigger: row, start: 'top 88%', once: true } });
        });
        g.utils.toArray('.fv-nodeanim').forEach((el) => {
          g.from(el, { ...IR, scale: 0.2, opacity: 0, duration: 0.7, ease: 'back.out(2)',
            scrollTrigger: { trigger: el.closest('.fv-row'), start: 'top 86%', once: true } });
        });
        // reveal only figures inside rows — never the travelling ship marker
        g.utils.toArray('.fv-rows .bf').forEach((el) => {
          g.from(el, { ...IR, y: 30, opacity: 0, duration: 1, ease: 'power2.out',
            scrollTrigger: { trigger: el.closest('.fv-row'), start: 'top 82%', once: true } });
        });

        // the marker sails down the spine, scrubbed to scroll
        g.to('.fv-ship', { ease: 'none', scrollTrigger: {
          trigger: spine.current, start: 'top 64%', end: 'bottom 82%', scrub: 0.6,
          onUpdate: (self) => { const h = spine.current.offsetHeight - 76; g.set('.fv-ship', { y: self.progress * h }); },
        } });

        STp.refresh();
        cleanup = () => STp.getAll().forEach(t => t.kill());
      });
      return () => { cancelAnimationFrame(raf); cleanup(); };
    }, []);

    let heroSeen = 0, compSeen = 0;
    return (
      <div className="fv-stage" data-bump={bump}>
        <div className="fv-vign" />
        <div className="fv-wrap">
          <header className="fv-head">
            <div className="fv-topkey anim" />
            <div className="fv-kick anim">{V.kick}</div>
            <h1 className="fv-title anim">{V.titleA}<br /><span>{V.titleB}</span></h1>
            <p className="fv-sub anim">{V.sub}</p>
          </header>

          <div className="fv-hint">◈&ensp;πάτησε έναν αριθμό για ερωτήσεις & διάλογο&ensp;◈</div>

          <div className="fv-spine" ref={spine}>
            <div className="fv-channel" />
            <div className="fv-ship"><div className="fv-ship-bob"><BF name={V.shipFig || 'ship'} size={62} ground="#1a120b" /></div></div>

            <div className="fv-rows">
              {ST.map((s, i) => {
                const count = ZG.count(i, s);
                if (s.hero) { const r = heroSeen++ % 2 === 1; return <Hero key={i} s={s} sceneRight={r} index={i} onOpen={setOpen} count={count} />; }
                const side = compSeen++ % 2 === 0 ? 'l' : 'r';
                return <Compact key={i} s={s} side={side} index={i} onOpen={setOpen} count={count} />;
              })}
            </div>

            <div className="fv-arrival">
              <div className="fv-anchor"><ArrGlyph kind={(V.arrival || {}).glyph} /></div>
              <div className="fv-arrtxt">{(V.arrival || {}).text}</div>
            </div>
          </div>
        </div>

        {open !== null && (
          <GamePanel index={open} station={ST[open]} unit={UNIT} adminPass={V.adminPass || 'odyssea'}
                     onClose={() => setOpen(null)} onChange={() => setBump(b => b + 1)} />
        )}
      </div>
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(<App />);
})();
