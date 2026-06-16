/* ════════════════════════════════════════════════════════════════════
   DIRECTION C — "AKRÓPOLIS"  ·  Modern monumental / architectural
   Oswald condensed caps + Montserrat body. Meander rails, corner ticks,
   numbered indices. Crisp, structured, near-product. Class identity =
   a precise numbered tab rail.
   ════════════════════════════════════════════════════════════════════ */
(function () {

  function akTile(gm){
    return el('a', { class:'ak-tile', href:'javascript:void 0' }, [
      el('span', { class:'ak-tile__gl', 'data-illu':gm.illu }),
      el('span', { class:'ak-tile__tx' }, [
        el('span', { class:'ak-tile__nm' }, L(gm)),
        el('span', { class:'ak-tile__mt' }, gm.meta),
      ]),
      el('span', { class:'ak-tile__go', html:'&rarr;' }),
    ]);
  }

  function akModule(s, accent, n){
    const mod = el('section', { class:'ak-mod has-accent', style:`--ca:${accent}`, 'data-animate':'' });
    mod.appendChild(el('div', { class:'ak-mod__bar' }, [
      el('span', { class:'ak-mod__no' }, String(n).padStart(2,'0')),
      el('span', { class:'ak-mod__gl', 'data-illu':s.illu }),
      el('h3', { class:'ak-mod__ttl' }, L(s)),
      el('span', { class:'ak-mod__sub' }, s.sub),
      el('span', { class:'ak-mod__ct' }, s.games.length + ' ' + L(window.SYM.STR.games)),
      el('a', { class:'ak-mod__all', href:'javascript:void 0' }, [ L(window.SYM.STR.allGames), el('span',{html:' &rarr;'}) ]),
    ]));
    mod.appendChild(el('div', { class:'ak-mod__grid' }, s.games.map(akTile)));
    return mod;
  }

  window.SYM_DIR.akropolis = function (home, ctx) {
    const STR = ctx.STR;

    /* ── NAV ── */
    const nav = el('nav', { class:'ak-nav' });
    const brand = el('a', { class:'ak-brand', href:'javascript:void 0' });
    brand.appendChild(brandMark('ak-brand__mark'));
    brand.appendChild(el('span', { class:'ak-brand__wm', html:'SYMPOSI<span>ON</span>' }));
    nav.appendChild(brand);
    nav.appendChild(el('div', { class:'ak-nav__mid' }, [
      el('a', { class:'ak-nav__lnk', href:'javascript:void 0' }, L({gr:'ΠΑΙΧΝΙΔΙΑ',en:'GAMES'})),
      el('a', { class:'ak-nav__lnk', href:'javascript:void 0' }, L({gr:'ΜΑΘΗΜΑΤΑ',en:'SUBJECTS'})),
      el('a', { class:'ak-nav__lnk', href:'javascript:void 0' }, L({gr:'ΣΥΝΔΡΟΜΕΣ',en:'PLANS'})),
      el('a', { class:'ak-nav__lnk', href:'javascript:void 0' }, L({gr:'ΣΧΕΤΙΚΑ',en:'ABOUT'})),
    ]));
    nav.appendChild(el('div', { class:'ak-nav__act' }, [
      el('button', { class:'ak-live' }, [ el('span',{class:'ak-live__dot'}), L(STR.live) ]),
      el('button', { class:'ak-btn ak-btn--ghost' }, L(STR.signin)),
      el('button', { class:'ak-btn ak-btn--solid' }, L(STR.signup)),
    ]));
    home.appendChild(nav);

    /* ── HERO ── */
    const hero = el('header', { class:'ak-hero' });
    const left = el('div', { class:'ak-hero__l', 'data-animate':'' }, [
      el('div', { class:'ak-hero__ix' }, [ el('span',{class:'ak-hero__no'},'01'), el('span',{class:'ak-hero__sl'},'/'), el('span',{},L(STR.eyebrow)) ]),
      el('h1', { class:'ak-hero__h1', html: window.SYM_LANG==='en'
        ? 'Learn<br>antiquity<br><span>by playing.</span>'
        : 'Μάθε την<br>αρχαιότητα<br><span>παίζοντας.</span>' }),
      el('p', { class:'ak-hero__lede' }, L(STR.lede)),
      el('div', { class:'ak-hero__cta' }, [
        el('button', { class:'ak-cta ak-cta--solid' }, [ L(STR.startFree), el('span',{html:'&rarr;'}) ]),
        el('button', { class:'ak-cta ak-cta--ghost' }, [ L(STR.browse), el('span',{html:'&rarr;'}) ]),
      ]),
      el('div', { class:'ak-hero__strip' }, ['Αρχαία','Έπη','Ιστορία','Γραμματική','Λατινικά'].map((t,i)=>
        el('span', { class:'ak-hero__chip' }, window.SYM_LANG==='en' ? ['Ancient Greek','Epics','History','Grammar','Latin'][i] : t))),
    ]);
    const right = el('div', { class:'ak-hero__r', 'data-animate':'' }, [
      el('div', { class:'ak-spec' }, [
        el('span', { class:'ak-spec__t ak-spec__t--tl' }), el('span', { class:'ak-spec__t ak-spec__t--tr' }),
        el('span', { class:'ak-spec__t ak-spec__t--bl' }), el('span', { class:'ak-spec__t ak-spec__t--br' }),
        el('span', { class:'ak-spec__illu', 'data-illu':'column' }),
        el('div', { class:'ak-spec__rows' }, [
          specRow('ΣΤΗΛΗ','DORIC', 'Ἀκρόπολις'),
          specRow('ΜΑΘΗΜΑΤΑ','SUBJECTS','5'),
          specRow('ΠΑΙΧΝΙΔΙΑ','GAMES','40+'),
        ]),
      ]),
      el('span', { class:'ak-rail' }),
    ]);
    hero.appendChild(left); hero.appendChild(right);
    home.appendChild(hero);

    function specRow(gr,en,val){
      return el('div', { class:'ak-spec__row' }, [
        el('span', { class:'ak-spec__k' }, window.SYM_LANG==='en'?en:gr),
        el('span', { class:'ak-spec__dot' }),
        el('span', { class:'ak-spec__v' }, val),
      ]);
    }

    /* ── CLASS TAB RAIL ── */
    const rail = el('div', { class:'ak-rail-wrap' });
    rail.appendChild(el('div', { class:'ak-rail-lbl' }, [ el('span',{class:'ak-rail-line'}), L(STR.pickClass) ]));
    const tabs = el('div', { class:'ak-tabs' });
    ctx.classes.forEach(c => {
      tabs.appendChild(el('button', {
        class:'ak-tab has-accent'+(c.id===ctx.classId?' active':''), style:`--ca:${c.accent}`,
        onclick:()=>ctx.setClass(c.id)
      }, [
        el('span', { class:'ak-tab__no' }, c.roman),
        el('span', { class:'ak-tab__nm' }, L(c)),
      ]));
    });
    rail.appendChild(tabs);
    home.appendChild(rail);

    /* ── SUBJECT MODULES ── */
    const ac = ctx.activeClass;
    const wrap = el('div', { class:'ak-mods' });
    (ctx.subjects[ac.id] || []).forEach((s,i)=> wrap.appendChild(akModule(s, ac.accent, i+1)));
    home.appendChild(wrap);

    /* ── ENGINES ── */
    const eng = el('section', { class:'ak-engines' });
    eng.appendChild(el('div', { class:'ak-engines__bar' }, [
      el('span', { class:'ak-engines__no' }, '//'),
      el('h2', { class:'ak-engines__ttl' }, L(STR.engines)),
      el('span', { class:'ak-engines__sub' }, L(STR.enginesSub)),
    ]));
    const grid = el('div', { class:'ak-engines__grid' });
    ctx.engines.forEach(e => grid.appendChild(el('a', { class:'ak-eng', href:'javascript:void 0' }, [
      el('span', { class:'ak-eng__gl', 'data-illu':e.illu }),
      el('span', { class:'ak-eng__tx' }, [ el('span',{class:'ak-eng__nm'}, L(e)), el('span',{class:'ak-eng__mt'}, L(e.meta)) ]),
    ])));
    eng.appendChild(grid);
    home.appendChild(eng);

    /* ── JOIN ── */
    home.appendChild(el('section', { class:'ak-join' }, [
      el('span', { class:'ak-join__rail' }),
      el('div', { class:'ak-join__in' }, [
        el('div', { class:'ak-join__no' }, '06 / ' + L({gr:'ΕΙΣΟΔΟΣ',en:'JOIN'})),
        el('div', { class:'ak-join__ttl' }, L(STR.joinTitle)),
        el('p', { class:'ak-join__sub' }, L(STR.joinSub)),
        el('div', { class:'ak-join__form' }, [
          el('input', { class:'ak-join__pin', type:'text', maxlength:'6', placeholder:'A7K92M' }),
          el('button', { class:'ak-cta ak-cta--solid' }, [ L(STR.joinBtn), el('span',{html:'&rarr;'}) ]),
        ]),
      ]),
    ]));

    /* ── FOOTER ── */
    home.appendChild(akFooter(STR));
  };

  function akFooter(STR){
    const f = el('footer', { class:'ak-foot' });
    f.appendChild(el('span', { class:'ak-foot__rule' }));
    const top = el('div', { class:'ak-foot__top' });
    const fb = el('div', { class:'ak-foot__brand' });
    fb.appendChild(brandMark('ak-foot__mark'));
    fb.appendChild(el('div', {}, [ el('div',{class:'ak-foot__wm', html:'SYMPOSI<span>ON</span>'}),
      el('p',{class:'ak-foot__tag'}, L(STR.tagline)) ]));
    top.appendChild(fb);
    const cols = [
      { h:{gr:'ΠΛΑΤΦΟΡΜΑ',en:'PLATFORM'}, links:[{gr:'Παιχνίδια',en:'Games'},{gr:'Συνδρομές',en:'Plans'},{gr:'Tartarus Review',en:'Tartarus Review'}] },
      { h:{gr:'ΠΛΗΡΟΦΟΡΙΕΣ',en:'INFO'}, links:[{gr:'Σχετικά',en:'About'},{gr:'Επικοινωνία',en:'Contact'},{gr:'Σχόλια',en:'Feedback'}] },
    ];
    cols.forEach(c => {
      const col = el('div', { class:'ak-foot__col' });
      col.appendChild(el('h4', {}, L(c.h)));
      c.links.forEach(lk => col.appendChild(el('a', { href:'javascript:void 0' }, L(lk))));
      top.appendChild(col);
    });
    f.appendChild(top);
    f.appendChild(el('div', { class:'ak-foot__bot' }, [
      el('span', {}, '© 2026 SYMPOSION'),
      el('div', { class:'ak-foot__plans' }, [
        el('span', {}, window.SYM_LANG==='en'?'FREE · €0':'ΔΩΡΕΑΝ · €0'),
        el('span', { class:'ak-foot__pro' }, 'PRO · €4.99'),
      ]),
    ]));
    return f;
  }
})();
