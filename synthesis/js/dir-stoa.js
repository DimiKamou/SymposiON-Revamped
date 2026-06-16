/* ════════════════════════════════════════════════════════════════════
   DIRECTION A — "STOA"  ·  Editorial / museum-modern
   Quiet, confident, light. Alegreya serif + Montserrat micro-caps.
   Class identity = a roman-numeral "table of contents" index.
   ════════════════════════════════════════════════════════════════════ */
(function () {
  function navLink(o){ return el('a', { class:'st-nav__lnk', href:'javascript:void 0' }, L(o)); }

  function illuPlate(name, size){
    return el('span', { class:'st-illu', 'data-illu':name, style:`width:${size}px;height:${size}px` });
  }

  function gameRow(g, accent){
    return el('a', { class:'st-game', href:'javascript:void 0' }, [
      el('span', { class:'st-game__gl', 'data-illu':g.illu }),
      el('span', { class:'st-game__tx' }, [
        el('span', { class:'st-game__nm' }, L(g)),
        el('span', { class:'st-game__mt' }, g.meta),
      ]),
      el('span', { class:'st-game__go', html:'&rarr;' }),
    ]);
  }

  function subjectSpread(s, accent, idx){
    const wrap = el('section', { class:'st-spread has-accent', style:`--ca:${accent}`, 'data-animate':'' });
    // left header
    const head = el('aside', { class:'st-spread__head' }, [
      el('div', { class:'st-spread__wm', 'data-illu':s.illu }),
      el('div', { class:'st-spread__rom' }, s.roman),
      el('h3', { class:'st-spread__ttl' }, L(s)),
      el('div', { class:'st-spread__sub' }, s.sub),
      el('p', { class:'st-spread__sum' }, L(s.summary)),
      el('a', { class:'st-spread__all', href:'javascript:void 0' }, [ L(window.SYM.STR.allGames), el('span',{html:' &rarr;'}) ]),
    ]);
    const list = el('div', { class:'st-spread__list' },
      s.games.map(g => gameRow(g, accent)));
    wrap.appendChild(head); wrap.appendChild(list);
    return wrap;
  }

  window.SYM_DIR.stoa = function (home, ctx) {
    const STR = ctx.STR;

    /* ── NAV ── */
    const nav = el('nav', { class:'st-nav' });
    const brand = el('a', { class:'st-brand', href:'javascript:void 0' });
    brand.appendChild(brandMark('st-brand__mark'));
    brand.appendChild(el('span', { class:'st-brand__wm', html:'Symposi<span>ON</span>' }));
    nav.appendChild(brand);
    const navMid = el('div', { class:'st-nav__mid' }, [
      navLink({gr:'Παιχνίδια',en:'Games'}), navLink({gr:'Μαθήματα',en:'Subjects'}),
      navLink({gr:'Συνδρομές',en:'Plans'}), navLink({gr:'Σχετικά',en:'About'}),
    ]);
    nav.appendChild(navMid);
    nav.appendChild(el('div', { class:'st-nav__act' }, [
      el('button', { class:'st-live' }, [ el('span',{class:'st-live__dot'}), L(STR.live) ]),
      el('button', { class:'st-btn st-btn--ghost' }, L(STR.signin)),
      el('button', { class:'st-btn st-btn--solid' }, L(STR.signup)),
    ]));
    home.appendChild(nav);

    /* ── HERO ── */
    const hero = el('header', { class:'st-hero' });
    const left = el('div', { class:'st-hero__l', 'data-animate':'' }, [
      el('div', { class:'st-eyebrow' }, [ el('span',{class:'st-eyebrow__ln'}), L(STR.eyebrow) ]),
      el('h1', { class:'st-hero__h1', html: window.SYM_LANG==='en'
        ? 'The ancient world,<em>as play.</em>'
        : 'Ο αρχαίος κόσμος,<em>σαν παιχνίδι.</em>' }),
      el('p', { class:'st-hero__lede' }, L(STR.lede)),
      el('div', { class:'st-hero__cta' }, [
        el('button', { class:'st-cta st-cta--primary' }, [ L(STR.startFree), el('span',{class:'st-cta__ar',html:'&rarr;'}) ]),
        el('button', { class:'st-cta st-cta--text' }, [ L(STR.browse), el('span',{html:' &rarr;'}) ]),
      ]),
      el('div', { class:'st-hero__meta' }, [
        'Αρχαία Ελληνικά','Ομηρικά Έπη','Ιστορία','Γραμματική','Λατινικά'
      ].map((t,i)=> el('span', { class:'st-hero__metait' }, (window.SYM_LANG==='en'
        ? ['Ancient Greek','Homeric Epics','History','Grammar','Latin'][i] : t)))),
    ]);
    const plate = el('div', { class:'st-hero__r', 'data-animate':'' }, [
      el('div', { class:'st-plate' }, [
        el('span', { class:'st-plate__cnr st-plate__cnr--tl' }), el('span', { class:'st-plate__cnr st-plate__cnr--tr' }),
        el('span', { class:'st-plate__cnr st-plate__cnr--bl' }), el('span', { class:'st-plate__cnr st-plate__cnr--br' }),
        illuPlate('acropolis', 240),
        el('div', { class:'st-plate__cap' }, [
          el('span', { class:'st-plate__rom' }, 'I'),
          el('span', { class:'st-plate__cl' }, window.SYM_LANG==='en' ? 'The Akropolis · plate I' : 'Ἀκρόπολις · πίναξ I'),
        ]),
      ]),
      el('span', { class:'st-meander', 'data-sym':'meander-band' }),
    ]);
    hero.appendChild(left); hero.appendChild(plate);
    home.appendChild(hero);

    /* ── CLASS INDEX (table of contents) ── */
    const idxWrap = el('div', { class:'st-index' });
    idxWrap.appendChild(el('div', { class:'st-index__lbl' }, [ el('span',{class:'st-rule'}), L(STR.pickClass) ]));
    const idxRow = el('div', { class:'st-index__row' });
    ctx.classes.forEach(c => {
      idxRow.appendChild(el('button', {
        class:'st-toc has-accent'+(c.id===ctx.classId?' active':''), style:`--ca:${c.accent}`,
        onclick:()=>ctx.setClass(c.id)
      }, [
        el('span', { class:'st-toc__rom' }, c.roman),
        el('span', { class:'st-toc__tx' }, [
          el('span', { class:'st-toc__nm' }, L(c)),
          el('span', { class:'st-toc__bl' }, L(c.blurb)),
        ]),
      ]));
    });
    idxWrap.appendChild(idxRow);
    home.appendChild(idxWrap);

    /* ── SUBJECT SPREADS ── */
    const spreads = el('div', { class:'st-spreads' });
    const ac = ctx.activeClass;
    spreads.appendChild(el('div', { class:'st-spreads__cls has-accent', style:`--ca:${ac.accent}` }, [
      el('span', { class:'st-spreads__rom' }, ac.roman),
      el('h2', { class:'st-spreads__ttl' }, L(ac)),
      el('span', { class:'st-spreads__ct' }, (ctx.subjects[ac.id]||[]).length + ' ' + (window.SYM_LANG==='en'?'subjects':'μαθήματα')),
    ]));
    (ctx.subjects[ac.id] || []).forEach((s,i)=> spreads.appendChild(subjectSpread(s, ac.accent, i)));
    home.appendChild(spreads);

    /* ── ENGINES ── */
    const eng = el('section', { class:'st-engines' });
    eng.appendChild(el('div', { class:'st-engines__hd' }, [
      el('div', {}, [ el('h2', { class:'st-engines__ttl' }, L(STR.engines)),
                      el('p', { class:'st-engines__sub' }, L(STR.enginesSub)) ]),
      el('a', { class:'st-spread__all', href:'javascript:void 0' }, [ L(STR.allGames), el('span',{html:' &rarr;'}) ]),
    ]));
    const grid = el('div', { class:'st-engines__grid' });
    ctx.engines.forEach(e => grid.appendChild(el('a', { class:'st-eng', href:'javascript:void 0' }, [
      el('span', { class:'st-eng__gl', 'data-illu':e.illu }),
      el('span', { class:'st-eng__nm' }, L(e)),
      el('span', { class:'st-eng__mt' }, L(e.meta)),
    ])));
    eng.appendChild(grid);
    home.appendChild(eng);

    /* ── JOIN ── */
    home.appendChild(joinBlock(STR));

    /* ── FOOTER ── */
    home.appendChild(footerBlock(STR));
  };

  function joinBlock(STR){
    return el('section', { class:'st-join' }, [
      el('span', { class:'st-join__wm', 'data-illu':'owl' }),
      el('div', { class:'st-join__in' }, [
        el('div', { class:'st-join__lbl' }, L(STR.joinTitle)),
        el('p', { class:'st-join__sub' }, L(STR.joinSub)),
        el('div', { class:'st-join__form' }, [
          el('input', { class:'st-join__pin', type:'text', maxlength:'6', placeholder:'A7K92M' }),
          el('button', { class:'st-cta st-cta--primary' }, L(STR.joinBtn)),
        ]),
      ]),
    ]);
  }

  function footerBlock(STR){
    const cols = [
      { h:{gr:'Πλατφόρμα',en:'Platform'}, links:[{gr:'Παιχνίδια',en:'Games'},{gr:'Συνδρομές',en:'Plans'},{gr:'Tartarus Review',en:'Tartarus Review'}] },
      { h:{gr:'Πληροφορίες',en:'Information'}, links:[{gr:'Σχετικά με εμάς',en:'About us'},{gr:'Επικοινωνία',en:'Contact'},{gr:'Σχόλια',en:'Feedback'}] },
    ];
    const f = el('footer', { class:'st-foot' });
    const top = el('div', { class:'st-foot__top' });
    const fb = el('div', { class:'st-foot__brand' });
    fb.appendChild(brandMark('st-foot__mark'));
    fb.appendChild(el('div', {}, [ el('div',{class:'st-foot__wm', html:'Symposi<span>ON</span>'}), el('p',{class:'st-foot__tag'}, L(STR.tagline)) ]));
    top.appendChild(fb);
    cols.forEach(c => {
      const col = el('div', { class:'st-foot__col' });
      col.appendChild(el('h4', {}, L(c.h)));
      c.links.forEach(lk => col.appendChild(el('a', { href:'javascript:void 0' }, L(lk))));
      top.appendChild(col);
    });
    f.appendChild(top);
    f.appendChild(el('div', { class:'st-foot__bot' }, [
      el('span', { class:'st-foot__cc' }, '© 2026 SymposiON'),
      el('div', { class:'st-foot__plans' }, [
        el('span', { class:'st-foot__plan' }, window.SYM_LANG==='en'?'Free · €0 / mo':'Δωρεάν · €0 / μήνα'),
        el('span', { class:'st-foot__plan st-foot__plan--pro' }, 'Pro · €4.99 / ' + (window.SYM_LANG==='en'?'mo':'μήνα')),
      ]),
    ]));
    return f;
  }
  window.SYM_joinBlock = joinBlock;
  window.SYM_footerBlock = footerBlock;
})();
