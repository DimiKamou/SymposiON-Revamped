/* ════════════════════════════════════════════════════════════════════
   DIRECTION B — "AGORA"  ·  Playful / bold / game-forward
   Montserrat heavy display + Alegreya reading. Rounded, warm, colour-
   blocked. Class identity = big colour-coded chips. For students first.
   ════════════════════════════════════════════════════════════════════ */
(function () {

  function agTile(gm, accent){
    return el('a', { class:'ag-tile has-accent', href:'javascript:void 0', style:`--ca:${accent}` }, [
      el('span', { class:'ag-tile__ban' }, [
        el('span', { class:'ag-tile__illu', 'data-illu':gm.illu }),
      ]),
      el('span', { class:'ag-tile__body' }, [
        el('span', { class:'ag-tile__nm' }, L(gm)),
        el('span', { class:'ag-tile__mt' }, gm.meta),
      ]),
      el('span', { class:'ag-tile__play', html:'&#9654;' }),
    ]);
  }

  function agSubjectBlock(s, accent){
    const block = el('section', { class:'ag-subj has-accent', style:`--ca:${accent}`, 'data-animate':'' });
    block.appendChild(el('div', { class:'ag-subj__hd' }, [
      el('span', { class:'ag-subj__badge' }, [ el('span', { class:'ag-subj__illu', 'data-illu':s.illu }) ]),
      el('div', { class:'ag-subj__tx' }, [
        el('h3', { class:'ag-subj__ttl' }, L(s)),
        el('p', { class:'ag-subj__sum' }, L(s.summary)),
      ]),
      el('a', { class:'ag-subj__all', href:'javascript:void 0' }, [
        el('span', {}, L(window.SYM.STR.allGames)),
        el('span', { class:'ag-subj__cnt' }, s.games.length),
      ]),
    ]));
    const grid = el('div', { class:'ag-subj__grid' }, s.games.map(gm => agTile(gm, accent)));
    block.appendChild(grid);
    return block;
  }

  window.SYM_DIR.agora = function (home, ctx) {
    const STR = ctx.STR;

    /* ── NAV ── */
    const nav = el('nav', { class:'ag-nav' });
    const inner = el('div', { class:'ag-nav__in' });
    const brand = el('a', { class:'ag-brand', href:'javascript:void 0' });
    brand.appendChild(brandMark('ag-brand__mark'));
    brand.appendChild(el('span', { class:'ag-brand__wm', html:'Symposi<span>ON</span>' }));
    inner.appendChild(brand);
    inner.appendChild(el('div', { class:'ag-nav__links' }, [
      el('a', { class:'ag-nav__lnk active', href:'javascript:void 0' }, L({gr:'Παιχνίδια',en:'Games'})),
      el('a', { class:'ag-nav__lnk', href:'javascript:void 0' }, L({gr:'Μαθήματα',en:'Subjects'})),
      el('a', { class:'ag-nav__lnk', href:'javascript:void 0' }, L({gr:'Συνδρομές',en:'Plans'})),
    ]));
    inner.appendChild(el('div', { class:'ag-nav__act' }, [
      el('button', { class:'ag-live' }, [ el('span',{class:'ag-live__bolt',html:'&#9889;'}), L(STR.live) ]),
      el('button', { class:'ag-btn ag-btn--ghost' }, L(STR.signin)),
      el('button', { class:'ag-btn ag-btn--solid' }, L(STR.startFree)),
    ]));
    // mobile: burger toggles the hidden .ag-nav__links into a drawer (mirrors dir-synthesis.js)
    const burger = el('button', { class:'ag-burger', 'aria-label':L({gr:'Μενού',en:'Menu'}), 'aria-expanded':'false',
      onclick:(e)=>{ e.stopPropagation(); const open = nav.classList.toggle('is-open'); burger.setAttribute('aria-expanded', open?'true':'false'); } },
      [ el('span',{class:'ag-burger__b'}), el('span',{class:'ag-burger__b'}), el('span',{class:'ag-burger__b'}) ]);
    inner.appendChild(burger);
    nav.appendChild(inner);
    home.appendChild(nav);

    /* ── HERO ── */
    const hero = el('header', { class:'ag-hero' });
    const stick = [
      ['helmet','st1'],['trireme','st2'],['owl','st3'],['amphora','st4'],['lyre','st5'],['masks','st6']
    ];
    const deco = el('div', { class:'ag-hero__deco', 'aria-hidden':'true' },
      stick.map(([n,c]) => el('span', { class:'ag-sticker '+c, 'data-illu':n })));
    hero.appendChild(deco);
    hero.appendChild(el('div', { class:'ag-hero__in', 'data-animate':'' }, [
      el('span', { class:'ag-pill' }, [ el('span',{html:'&#10024;'}), L(STR.eyebrow) ]),
      el('h1', { class:'ag-hero__h1', html: window.SYM_LANG==='en'
        ? 'Play. <em class="c1">Learn.</em> <em class="c2">Win.</em>'
        : 'Παίξε. <em class="c1">Μάθε.</em> <em class="c2">Νίκησε.</em>' }),
      el('p', { class:'ag-hero__lede' }, L(STR.lede)),
      el('div', { class:'ag-hero__cta' }, [
        el('button', { class:'ag-cta ag-cta--solid' }, [ L(STR.startFree), el('span',{html:' &rarr;'}) ]),
        el('button', { class:'ag-cta ag-cta--ghost' }, [ el('span',{class:'ag-cta__play',html:'&#9654;'}), L(STR.browse) ]),
      ]),
    ]));
    home.appendChild(hero);

    /* ── CLASS CHIPS ── */
    const chips = el('div', { class:'ag-classes' });
    chips.appendChild(el('div', { class:'ag-classes__lbl' }, L(STR.pickClass)));
    const row = el('div', { class:'ag-classes__row' });
    ctx.classes.forEach(c => {
      row.appendChild(el('button', {
        class:'ag-chip has-accent'+(c.id===ctx.classId?' active':''), style:`--ca:${c.accent}`,
        onclick:()=>ctx.setClass(c.id)
      }, [
        el('span', { class:'ag-chip__rom' }, c.roman),
        el('span', { class:'ag-chip__nm' }, L(c)),
      ]));
    });
    chips.appendChild(row);
    home.appendChild(chips);

    /* ── SUBJECT BLOCKS ── */
    const ac = ctx.activeClass;
    const wrap = el('div', { class:'ag-subjects' });
    (ctx.subjects[ac.id] || []).forEach(s => wrap.appendChild(agSubjectBlock(s, ac.accent)));
    home.appendChild(wrap);

    /* ── ENGINES ── */
    const eng = el('section', { class:'ag-engines' });
    eng.appendChild(el('div', { class:'ag-engines__hd' }, [
      el('h2', { class:'ag-engines__ttl' }, L(STR.engines)),
      el('p', { class:'ag-engines__sub' }, L(STR.enginesSub)),
    ]));
    const scroller = el('div', { class:'ag-engines__scroll' });
    ctx.engines.forEach((e,i) => scroller.appendChild(el('a', {
      class:'ag-eng has-accent', href:'javascript:void 0',
      style:`--ca:${ctx.classes[i % ctx.classes.length].accent}`
    }, [
      el('span', { class:'ag-eng__ban' }, [ el('span', { class:'ag-eng__illu', 'data-illu':e.illu }) ]),
      el('span', { class:'ag-eng__nm' }, L(e)),
      el('span', { class:'ag-eng__mt' }, L(e.meta)),
    ])));
    eng.appendChild(scroller);
    home.appendChild(eng);

    /* ── JOIN ── */
    home.appendChild(el('section', { class:'ag-join' }, [
      el('div', { class:'ag-join__card' }, [
        el('span', { class:'ag-join__bolt', html:'&#9889;' }),
        el('div', { class:'ag-join__tx' }, [
          el('div', { class:'ag-join__ttl' }, L(STR.joinTitle)),
          el('p', { class:'ag-join__sub' }, L(STR.joinSub)),
        ]),
        el('div', { class:'ag-join__form' }, [
          el('input', { class:'ag-join__pin', type:'text', maxlength:'6', placeholder:'A7K92M' }),
          el('button', { class:'ag-cta ag-cta--solid' }, L(STR.joinBtn)),
        ]),
      ]),
    ]));

    /* ── FOOTER ── */
    home.appendChild(agFooter(STR));
  };

  function agFooter(STR){
    const f = el('footer', { class:'ag-foot' });
    const top = el('div', { class:'ag-foot__top' });
    const fb = el('div', { class:'ag-foot__brand' });
    fb.appendChild(brandMark('ag-foot__mark'));
    fb.appendChild(el('div', {}, [ el('div',{class:'ag-foot__wm', html:'Symposi<span>ON</span>'}),
      el('p',{class:'ag-foot__tag'}, L(STR.tagline)) ]));
    top.appendChild(fb);
    const cols = [
      { h:{gr:'Πλατφόρμα',en:'Platform'}, links:[{gr:'Παιχνίδια',en:'Games'},{gr:'Συνδρομές',en:'Plans'},{gr:'Tartarus Review',en:'Tartarus Review'}] },
      { h:{gr:'Πληροφορίες',en:'Information'}, links:[{gr:'Σχετικά',en:'About'},{gr:'Επικοινωνία',en:'Contact'},{gr:'Σχόλια',en:'Feedback'}] },
    ];
    cols.forEach(c => {
      const col = el('div', { class:'ag-foot__col' });
      col.appendChild(el('h4', {}, L(c.h)));
      c.links.forEach(lk => col.appendChild(el('a', { href:'javascript:void 0' }, L(lk))));
      top.appendChild(col);
    });
    f.appendChild(top);
    f.appendChild(el('div', { class:'ag-foot__bot' }, [
      el('span', {}, '© 2026 SymposiON'),
      el('button', { class:'ag-foot__pro' }, window.SYM_LANG==='en'?'↑ Upgrade to Pro · €4.99':'↑ Αναβάθμιση σε Pro · €4.99'),
    ]));
    return f;
  }
})();
