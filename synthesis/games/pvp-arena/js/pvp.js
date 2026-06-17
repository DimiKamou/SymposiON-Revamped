/* ════════════════════════════════════════════════════════════════════
   SymposiON — PvP Arena · engine  (js/pvp.js)
   A front-end prototype of the online PvP loop with SIMULATED players:
     hub → (host: mode) → pick your theory → waiting room
        → launch → simulated timed match → results (ELO) → rematch
   Drop-in ready: swap the sim hooks (scheduleJoin / tickOpponents / vote
   timers) for a realtime transport and the UI is unchanged.
   ════════════════════════════════════════════════════════════════════ */
window.PvP = (function () {
  const D = window.PVP;
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const cssv = (v) => `var(${v})`;

  let root, S = {};

  /* ── timers ─────────────────────────────────────────────── */
  function clearTimers() { (S.timers || []).forEach(t => { clearTimeout(t); clearInterval(t); }); S.timers = []; }
  function later(fn, ms) { const t = setTimeout(fn, ms); S.timers.push(t); return t; }
  function every(fn, ms) { const t = setInterval(fn, ms); S.timers.push(t); return t; }

  /* ── screen routing ─────────────────────────────────────── */
  function show(name) {
    $$('.pvp-screen', root).forEach(s => s.classList.toggle('on', s.dataset.screen === name));
    const back = $('#pvp-back');
    back.hidden = (name === 'hub');
    root.querySelector('.pvp-stage').scrollTop = 0;
    window.scrollTo(0, 0);
  }

  /* ════════════════════ HUB ════════════════════ */
  function renderHub() {
    clearTimers();
    if (!S.format) S.format = 'lobby';
    const p = S.profile;
    const tier = D.tierFor(p.rating);
    const duel = S.format === 'duel';
    const sc = $('[data-screen="hub"]', root);
    sc.innerHTML = `
      <div class="pvp-wrap">
        <div class="pvp-kicker"><b>02 /</b> ΖΩΝΤΑΝΟΣ ΑΓΩΝ · ONLINE PVP</div>
        <h1 class="pvp-h1">Ο ΑΓΩΝ<span class="en">Pick a mode, bring your own theory, face ${duel ? 'one rival' : 'the field'}.</span></h1>
        <p class="pvp-lead">${duel
          ? 'Μονομαχία ένας εναντίον ενός. Διάλεξε ύλη, βρες αντίπαλο — η άδεια θέση γεμίζει με bot στα 5:00.'
          : 'Μπες σε λόμπι έως 10 παικτών, διάλεξε τη δική σου ύλη και αγωνίσου σε πραγματικό χρόνο. Οι άδειες θέσεις γεμίζουν με bots στα 2:00.'}</p>

        <div class="pvp-format" id="pvp-format">
          <button data-fmt="lobby" class="${duel ? '' : 'on'}"><b>ΟΜΑΔΙΚΟΣ ΑΓΩΝ</b><span>Έως 10 · 2:00</span></button>
          <button data-fmt="duel" class="${duel ? 'on' : ''}"><b>ΜΟΝΟΜΑΧΙΑ · 1V1</b><span>Ένας vs ένας · 5:00</span></button>
        </div>

        <div class="pvp-entry">
          ${entryCard('quick','ΤΑΧΥΣ ΑΓΩΝ','Quick Match','⚔','--sym-terra', duel ? 'Μπες σε μονομαχία τυχαίου παιχνιδιού.' : 'Μπες σε λόμπι τυχαίου παιχνιδιού· ξεκινά μόλις γεμίσει.')}
          ${entryCard('vote','ΨΗΦΟΦΟΡΙΑ','Vote Lobby','▦','--sym-gold', duel ? 'Κατάταξε 1–4 τα παιχνίδια· ο μέσος όρος αποφασίζει.' : 'Το λόμπι ψηφίζει το παιχνίδι ανάμεσα σε 4 τυχαίες επιλογές.')}
          ${entryCard('host','ΦΙΛΟΞΕΝΙΑ','Host Room','⌂','--sym-aegean','Στήσε ιδιωτικό δωμάτιο, διάλεξε παιχνίδι και μοιράσου τον κωδικό.')}
          ${entryCard('join','ΕΙΣΟΔΟΣ ΜΕ ΚΩΔΙΚΟ','Join by Code','⎆','--sym-sage','Έχεις κωδικό; Μπες απευθείας στο δωμάτιο ενός φίλου.')}
        </div>

        <div class="pvp-stats">
          <div class="pvp-stat"><b>${p.rating}</b><span>Rating · ${tier.gr} / ${tier.en}</span></div>
          <div class="pvp-stat"><b>${p.wins}</b><span>Νίκες / Wins</span></div>
          <div class="pvp-stat"><b>${p.played}</b><span>Αγώνες / Played</span></div>
        </div>
      </div>`;
    $$('#pvp-format button', sc).forEach(b => b.addEventListener('click', () => { S.format = b.dataset.fmt; renderHub(); }));
    $$('.pvp-card', sc).forEach(c => c.addEventListener('click', () => chooseEntry(c.dataset.entry)));
    refreshChip();
    show('hub');
  }
  function entryCard(id, gr, en, ico, accent, desc) {
    return `<button class="pvp-card" data-entry="${id}" style="--accent:${cssv(accent)}">
      <span class="ico">${ico}</span>
      <span class="tag">${en}</span>
      <h3>${gr}</h3>
      <p>${desc}</p>
      <span class="go">ΕΠΙΛΟΓΗ <span class="arr">→</span></span>
    </button>`;
  }

  function modePool() { return S.format === 'duel' ? D.DUEL_MODES : D.MODES; }
  function chooseEntry(entry) {
    S.entry = entry;
    S.isHost = (entry === 'host');
    if (entry === 'join') return openJoin();
    if (entry === 'host') return renderModeSelect();
    if (entry === 'quick') { S.mode = D.weightedMode(null, modePool()); return renderContent(); }
    if (entry === 'vote') { S.mode = null; return renderContent(); }
  }

  /* ════════════════════ HOST: mode select ════════════════════ */
  function renderModeSelect() {
    const sc = $('[data-screen="content"]', root); // reuse content screen container
    sc.innerHTML = `
      <div class="pvp-wrap">
        <div class="pvp-kicker"><b>ΦΙΛΟΞΕΝΙΑ /</b> HOST · ΔΙΑΛΕΞΕ ΠΑΙΧΝΙΔΙ</div>
        <h1 class="pvp-h1">ΤΟ ΠΑΙΧΝΙΔΙ<span class="en">As host, you choose the game everyone plays.</span></h1>
        <div class="pvp-gcard-grid">
          ${modePool().map(modeCardHTML).join('')}
        </div>
      </div>`;
    $$('.pvp-gcard', sc).forEach(b => b.addEventListener('click', () => {
      S.mode = modePool().find(m => m.id === b.dataset.mode);
      renderContent();
    }));
    show('content');
  }
  function modeCardHTML(m) {
    const art = (D.GAME_ART && D.GAME_ART[m.id])
      ? D.GAME_ART[m.id]
      : `<div class="pvp-gcard-glyph"><span>${m.glyph}</span></div>`;
    return `<button class="pvp-gcard" data-mode="${m.id}" style="--accent:${cssv(m.accent)}">
      <div class="pvp-gcard-art">${art}</div>
      <div class="pvp-gcard-body">
        <div class="pvp-gcard-tag">${m.en}</div>
        <h3 class="pvp-gcard-title">${m.gr}<small>${m.blurb.gr}</small></h3>
        <span class="pvp-gcard-play">ΕΠΙΛΟΓΗ <span class="arr">→</span></span>
      </div>
    </button>`;
  }

  /* ════════════════════ CONTENT (your theory) ════════════════════ */
  function renderContent() {
    const sc = $('[data-screen="content"]', root);
    const modeLine = S.mode
      ? `Παιχνίδι / Mode: <b style="color:var(--sym-cream)">${S.mode.gr}</b>`
      : `Το παιχνίδι θα ψηφιστεί στο λόμπι. / Mode decided by vote.`;
    sc.innerHTML = `
      <div class="pvp-wrap">
        <div class="pvp-kicker"><b>Η ΥΛΗ ΣΟΥ /</b> YOUR THEORY</div>
        <h1 class="pvp-h1">ΔΙΑΛΕΞΕ ΤΗΝ ΥΛΗ ΣΟΥ<span class="en">Everyone drills their own subject — you all compete on points.</span></h1>
        <p class="pvp-lead" style="font-style:normal;font-family:var(--sym-mono);font-size:13px;letter-spacing:.5px;">${modeLine}</p>
        <div class="pvp-subj-grid">
          ${D.SUBJECTS.map(s => `
            <button class="pvp-subj" data-subj="${s.id}" style="--accent:${cssv(s.accent)}">
              <span class="sg">${s.glyph}</span>
              <span class="st"><b>${s.gr}</b><span>${s.en}</span></span>
            </button>`).join('')}
        </div>
        <div style="margin-top:30px"><button class="pvp-btn" id="pvp-subj-go" disabled>ΣΥΝΕΧΕΙΑ · CONTINUE →</button></div>
      </div>`;
    let chosen = null;
    $$('.pvp-subj', sc).forEach(b => b.addEventListener('click', () => {
      $$('.pvp-subj', sc).forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      chosen = D.SUBJECTS.find(s => s.id === b.dataset.subj);
      $('#pvp-subj-go', sc).disabled = false;
    }));
    $('#pvp-subj-go', sc).addEventListener('click', () => {
      if (!chosen) return;
      S.subject = chosen;
      enterRoom();
    });
    show('content');
  }

  /* ════════════════════ WAITING ROOM ════════════════════ */
  function enterRoom() {
    clearTimers();
    const p = S.profile;
    const duel = S.format === 'duel';
    S.roomCode = (S.entry === 'join') ? (S.joinCode || randCode()) : randCode();
    S.me = mkPlayer({ name: p.name, seal: p.seal, rating: p.rating, isMe: true, isHost: S.isHost, subject: S.subject });
    S.players = [S.me];
    S.capacity = duel ? 2 : 10;
    S.countdownMax = duel ? 300 : 120;     // 5:00 duel · 2:00 lobby
    S.countdown = S.countdownMax;
    S.started = false;
    S.voteRanked = duel;
    S.voteOpen = (S.entry === 'vote');
    S.voteOptions = S.voteOpen ? D.weightedModes(4, modePool()) : null;
    S.voteResolved = !S.voteOpen;
    S.me.ranks = [];
    // a few players are "already here" when you join a quick lobby / room
    const preset = duel ? (Math.random() < 0.4 ? 1 : 0) : (S.entry === 'host' ? 0 : D.randi(1, 4));
    for (let i = 0; i < preset && S.players.length < S.capacity; i++) S.players.push(mkSimPlayer());

    renderRoom();
    show('room');
    scheduleJoins();
    every(tickRoom, 1000);
    every(simReadyTick, 2500);
    every(simEmoteTick, 4200);
    if (S.voteOpen) { S.voteTimer = duel ? 26 : 22; scheduleSimVotes(); }
  }

  function mkPlayer(o) {
    return Object.assign({
      id: 'p' + Math.random().toString(36).slice(2, 8),
      name: 'ΕΣΥ', seal: 'Σ', isMe: false, isBot: false, isHost: false,
      rating: 1200, ready: false, score: 0, vote: null, ranks: null, subject: D.pick(D.SUBJECTS),
    }, o);
  }
  function mkSimPlayer(asBot) {
    const used = S.players.map(p => p.name);
    const name = D.pick(D.NAMES.filter(n => !used.includes(n))) || ('ΑΓΩΝΙΣΤΗΣ' + S.players.length);
    return mkPlayer({
      name, seal: D.pick(D.SEALS).glyph, rating: D.randi(980, 1850),
      isBot: !!asBot, subject: D.pick(D.SUBJECTS),
    });
  }
  function randCode() { const a = 'ΑΒΓΔΕΖΗΘ23456789'; let s = ''; for (let i = 0; i < 5; i++) s += a[D.randi(0, a.length - 1)]; return s; }

  function scheduleJoins() {
    const target = S.format === 'duel' ? 2 : Math.min(S.capacity, D.randi(4, 8)); // humans before bots fill
    function joinOne() {
      if (S.started) return;
      if (S.players.length >= target || S.players.length >= S.capacity) return;
      S.players.push(mkSimPlayer());
      renderRoom();
      later(joinOne, D.randi(4000, 11000));
    }
    later(joinOne, D.randi(3000, 7000));
  }

  function tickRoom() {
    if (S.started) return;
    S.countdown--;
    if (S.voteOpen && !S.voteResolved) { S.voteTimer--; if (S.voteTimer <= 0) resolveVote(); }
    if (S.countdown <= 0) { fillBotsAndStart(); return; }
    updateCountdownUI();
  }

  function simReadyTick() {
    if (S.started) return;
    if (!S.voteResolved) return;                  // can't ready before mode locked
    const others = S.players.filter(p => !p.isMe && !p.ready);
    if (others.length && Math.random() < 0.6) {
      D.pick(others).ready = true;
      renderRoom();
      checkAllReady();
    }
  }
  function simEmoteTick() {
    if (S.started) return;
    const others = S.players.filter(p => !p.isMe);
    if (others.length && Math.random() < 0.7) popEmote(D.pick(others).id, D.pick(D.EMOTES));
  }

  function checkAllReady() {
    if (S.started || !S.voteResolved) return;
    const humans = S.players;
    if (humans.length >= 2 && humans.every(p => p.ready)) {
      flashStart('ΟΛΟΙ ΕΤΟΙΜΟΙ · ALL READY');
      later(fillBotsAndStart, 700);
    }
  }

  function fillBotsAndStart() {
    if (S.started) return;
    S.started = true;
    clearTimers();
    while (S.players.length < S.capacity) S.players.push(mkSimPlayer(true));
    if (!S.voteResolved) resolveVote(true);
    later(launchMatch, 350);
  }

  /* ── vote ─────────────────────────────────────────────── */
  function scheduleSimVotes() {
    function voteOne() {
      if (S.started || S.voteResolved) return;
      const undecided = S.players.filter(p => !p.isMe && p.vote == null);
      if (undecided.length) { D.pick(undecided).vote = D.pick(S.voteOptions).id; renderRoom(); checkVoteDone(); }
      if (!S.voteResolved) later(voteOne, D.randi(1600, 4200));
    }
    later(voteOne, D.randi(1500, 3500));
  }
  function castVote(modeId) {
    if (S.voteResolved) return;
    S.me.vote = modeId;
    renderRoom();
    checkVoteDone();
  }
  function castRank(modeId) {
    if (S.voteResolved) return;
    S.me.ranks = S.me.ranks || [];
    const i = S.me.ranks.indexOf(modeId);
    if (i >= 0) S.me.ranks.splice(i, 1);
    else if (S.me.ranks.length < S.voteOptions.length) S.me.ranks.push(modeId);
    renderRoom();
    checkVoteDone();
  }
  function checkVoteDone() {
    if (S.players.length < 2) return;
    const done = S.voteRanked
      ? S.players.every(p => p.ranks && p.ranks.length === S.voteOptions.length)
      : S.players.every(p => p.vote != null);
    if (done) resolveVote();
  }
  function resolveVote(silent) {
    if (S.voteResolved) return;
    const n = S.voteOptions.length;
    let best = S.voteOptions[0], bestN = -Infinity;
    if (S.voteRanked) {
      const pts = {}; S.voteOptions.forEach(m => pts[m.id] = 0);
      S.players.forEach(p => (p.ranks || []).forEach((id, idx) => { if (pts[id] != null) pts[id] += (n - idx); }));
      D.shuffle(S.voteOptions).forEach(m => { const v = pts[m.id] + m.weight * 0.01; if (v > bestN) { bestN = v; best = m; } });
    } else {
      const tally = {}; S.voteOptions.forEach(m => tally[m.id] = 0);
      S.players.forEach(p => { if (p.vote && tally[p.vote] != null) tally[p.vote]++; });
      D.shuffle(S.voteOptions).forEach(m => { const v = tally[m.id] + m.weight * 0.01; if (v > bestN) { bestN = v; best = m; } });
    }
    S.mode = best;
    S.voteResolved = true;
    S.voteOpen = false;
    if (!silent) flashStart(`ΕΠΙΛΕΧΘΗΚΕ · ${best.gr}`);
    renderRoom();
  }

  function flashStart(txt) {
    const cd = $('#pvp-cd', root);
    if (cd) { const b = cd.querySelector('.cdtxt b'); if (b) { b.textContent = txt; cd.classList.add('fill'); } }
  }

  /* ── room render ───────────────────────────────────────── */
  function renderRoom() {
    const sc = $('[data-screen="room"]', root);
    const m = S.mode;
    const acc = m ? m.accent : '--sym-terra';
    const duel = S.format === 'duel';
    const voteEl = S.voteResolved ? modeBar(m, acc) : (S.voteRanked ? voteBoardRanked() : voteBoard());
    const seatsEl = duel
      ? `<div class="pvp-duel" id="pvp-seats">${duelSeatsHTML()}</div>`
      : `<div class="pvp-seats" id="pvp-seats">${S.players.map(seatHTML).join('') + emptySeats()}</div>`;
    sc.innerHTML = `
      <div class="pvp-wrap">
        <div class="pvp-kicker"><b>${duel ? 'ΜΟΝΟΜΑΧΙΑ' : 'ΛΟΜΠΙ'} /</b> ${entryLabel()} · ΚΩΔΙΚΟΣ <b style="color:var(--sym-gold-lt)">${S.roomCode}</b></div>
        <div class="pvp-room ${duel ? 'duel' : ''}">
          <div class="pvp-room-main">
            ${voteEl}
            ${cdStrip()}
            ${seatsEl}
            ${actionsBar()}
          </div>
          <aside class="pvp-side">
            <div class="pvp-panel">
              <div class="sh">ΚΑΤΑΤΑΞΗ · RATING PREVIEW</div>
              <div class="pvp-lead-list">${leaderPreview()}</div>
            </div>
          </aside>
        </div>
      </div>`;
    wireRoom(sc);
    updateCountdownUI();
  }
  function entryLabel() {
    return { quick: 'ΤΑΧΥΣ ΑΓΩΝ', vote: 'ΨΗΦΟΦΟΡΙΑ', host: 'ΦΙΛΟΞΕΝΙΑ', join: 'ΕΙΣΟΔΟΣ' }[S.entry] || 'ΛΟΜΠΙ';
  }
  function modeBar(m, acc) {
    const fmt = m.engine === 'erinyes'
      ? 'ΚΑΤΑΔΙΩΞΗ<br><b>ΤΡΕΞΕ Ή ΑΡΠΑΞΕ</b>'
      : m.engine === 'petteia'
      ? 'ΕΚ ΠΕΡΙΤΡΟΠΗΣ<br><b>ΑΠΑΝΤΑΣ & ΚΙΝΕΙΣΑΙ</b>'
      : m.engine === 'tug'
      ? 'ΣΧΟΙΝΙ<br><b>ΣΩΣΤΗ = ΤΡΑΒΗΓΜΑ</b>'
      : 'ΣΤΑΘΕΡΟΣ ΧΡΟΝΟΣ<br><b>75″</b> · ΠΕΡΙΣΣΟΤΕΡΟΙ ΠΟΝΤΟΙ';
    return `<div class="pvp-modebar" style="--accent:${cssv(acc)}">
      <div class="mg">${m.glyph}</div>
      <div class="mt"><div class="mk">${m.blurb.en}</div>
        <h2>${m.gr}<small>${m.blurb.gr}</small></h2></div>
      <div class="fmt">${fmt}</div>
    </div>`;
  }
  function voteBoard() {
    const tally = {};
    S.voteOptions.forEach(m => tally[m.id] = 0);
    S.players.forEach(p => { if (p.vote && tally[p.vote] != null) tally[p.vote]++; });
    const total = Math.max(1, S.players.length);
    return `<div class="pvp-panel pvp-vote">
      <h3>ΨΗΦΙΣΕ ΤΟ ΠΑΙΧΝΙΔΙ <span style="font-family:var(--sym-mono);font-size:12px;color:var(--sym-stone)"> ${Math.max(0,S.voteTimer)}″</span></h3>
      <p class="vsub">Pick the game — highest vote locks in. Vote from 4 random modes.</p>
      <div class="pvp-vote-grid">
        ${S.voteOptions.map(m => `
          <button class="pvp-vopt ${S.me.vote===m.id?'mine':''}" data-vote="${m.id}" style="--accent:${cssv(m.accent)}">
            <span class="vg">${m.glyph}</span>
            <span class="vt"><b>${m.gr}</b><span>${m.blurb.gr}</span></span>
            <span class="vcount">${tally[m.id]}</span>
            <span class="pvp-vbar" style="width:${(tally[m.id]/total*100)}%"></span>
          </button>`).join('')}
      </div>
    </div>`;
  }
  function voteBoardRanked() {
    const ranks = S.me.ranks || [];
    const full = ranks.length === S.voteOptions.length;
    return `<div class="pvp-panel pvp-vote">
      <h3>ΚΑΤΑΤΑΞΕ ΤΑ ΠΑΙΧΝΙΔΙΑ <span style="font-family:var(--sym-mono);font-size:12px;color:var(--sym-stone)"> ${Math.max(0,S.voteTimer)}″</span></h3>
      <p class="vsub">Πάτησε με σειρά προτίμησης (1 = κορυφαία). Ο μέσος όρος των κατατάξεων αποφασίζει. / Rank 1–4; the average decides.</p>
      <div class="pvp-vote-grid">
        ${S.voteOptions.map(m => {
          const r = ranks.indexOf(m.id);
          return `<button class="pvp-vopt ${r>=0?'mine':''}" data-rank="${m.id}" style="--accent:${cssv(m.accent)}">
            <span class="vrank">${r>=0 ? (r+1) : ''}</span>
            <span class="vg">${m.glyph}</span>
            <span class="vt"><b>${m.gr}</b><span>${m.blurb.gr}</span></span>
          </button>`;
        }).join('')}
      </div>
      ${full ? '<div style="margin-top:12px;font-family:var(--sym-mono);font-size:11px;color:var(--sym-sage)">✓ Η κατάταξή σου καταχωρήθηκε · ranking locked</div>' : '<div style="margin-top:12px;font-family:var(--sym-mono);font-size:11px;color:var(--sym-stone)">Κατάταξε και τα 4 για να κλειδώσει.</div>'}
    </div>`;
  }
  function cdStrip() {
    const fill = S.countdown <= 30;
    const duel = S.format === 'duel';
    const mm = Math.floor(Math.max(0,S.countdown)/60), ss = Math.max(0,S.countdown)%60;
    const lbl = S.voteResolved
      ? (duel ? 'ΜΕΧΡΙ ΝΑ ΕΜΦΑΝΙΣΤΕΙ ΑΝΤΙΠΑΛΟΣ' : 'ΜΕΧΡΙ ΤΟ ΛΟΜΠΙ ΝΑ ΓΕΜΙΣΕΙ ΜΕ BOTS')
      : 'ΨΗΦΟΦΟΡΙΑ ΣΕ ΕΞΕΛΙΞΗ';
    const sub = S.voteResolved
      ? (duel ? 'The empty seat becomes a bot at 0:00, then the duel begins.' : 'Empty seats become bots at 0:00, then the match begins.')
      : 'Vote first — then the lobby fills.';
    return `<div class="pvp-cd ${fill?'fill':''}" id="pvp-cd">
      <div class="ring"><svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="none" stroke="rgba(240,235,224,.1)" stroke-width="4"/>
        <circle id="pvp-cd-arc" cx="28" cy="28" r="24" fill="none" stroke="var(--sym-terra)" stroke-width="4" stroke-linecap="round" stroke-dasharray="150.8" stroke-dashoffset="0"/></svg>
        <div class="tnum" id="pvp-cd-num">${mm}:${ss<10?'0':''}${ss}</div></div>
      <div class="cdtxt"><b>${lbl}</b>
        <span>${sub}</span></div>
    </div>`;
  }
  function actionsBar() {
    const meReady = S.me.ready;
    return `<div class="pvp-actions">
      <button class="pvp-btn ${meReady?'ready':''}" id="pvp-ready" ${S.voteResolved?'':'disabled'}>${meReady?'✓ ΕΤΟΙΜΟΣ · READY':'ΕΤΟΙΜΟΣ; · READY UP'}</button>
      ${S.isHost ? `<button class="pvp-btn ghost" id="pvp-startnow">ΕΝΑΡΞΗ ΤΩΡΑ · START NOW</button>` : ''}
      <div class="spacer"></div>
      <div class="pvp-emotes" id="pvp-emotes">${D.EMOTES.map(e => `<button data-emote="${e}">${e}</button>`).join('')}</div>
    </div>`;
  }
  function leaderPreview() {
    const sorted = S.players.slice().sort((a, b) => b.rating - a.rating);
    return sorted.map((p, i) => {
      const t = D.tierFor(p.rating);
      return `<div class="pvp-lrow ${p.isMe?'me':''}">
        <span class="lp">${i+1}</span>
        <span class="ls">${p.seal}</span>
        <span class="ln">${p.name}${p.isBot?' ·bot':''}</span>
        <span class="ltier" title="${t.en}">${t.glyph}</span>
        <span class="lr">${p.rating}</span>
      </div>`;
    }).join('');
  }
  function seatHTML(p) {
    const t = D.tierFor(p.rating);
    return `<div class="pvp-seat filled ${p.isMe?'me':''}" data-seat="${p.id}" style="--accent:${cssv(p.subject.accent)}">
      ${p.isHost ? '<span class="crown">👑</span>' : ''}
      <span class="rdy ${p.ready?'on':''}">✓</span>
      <span class="sl">${p.seal}</span>
      <span class="snm">${p.isMe ? 'ΕΣΥ · YOU' : p.name}</span>
      <span class="ssub">${p.isBot ? '<span class="botpill">BOT</span>' : t.glyph + ' ' + p.rating}</span>
      <span class="subjtag">${p.subject.glyph} ${p.subject.gr}</span>
    </div>`;
  }
  function emptySeats() {
    const n = S.capacity - S.players.length;
    let h = '';
    for (let i = 0; i < n; i++) h += `<div class="pvp-seat empty"><span class="waitdot">· · ·</span><span class="ssub">ΑΝΑΜΟΝΗ</span></div>`;
    return h;
  }
  function duelSeatsHTML() {
    const opp = S.players.find(p => !p.isMe) || null;
    return `${bigSeat(S.me)}<div class="pvp-vs">VS</div>${opp ? bigSeat(opp) : waitingSeat()}`;
  }
  function bigSeat(p) {
    const t = D.tierFor(p.rating);
    return `<div class="pvp-seat duelseat ${p.isMe?'me':''}" data-seat="${p.id}" style="--accent:${cssv(p.subject.accent)}">
      ${p.isHost ? '<span class="crown">👑</span>' : ''}
      <span class="rdy ${p.ready?'on':''}">✓</span>
      <span class="sl">${p.seal}</span>
      <span class="snm">${p.isMe ? 'ΕΣΥ · YOU' : p.name}</span>
      <span class="ssub">${p.isBot ? '<span class="botpill">BOT</span>' : t.glyph + ' ' + t.gr + ' · ' + p.rating}</span>
      <span class="subjtag">${p.subject.glyph} ${p.subject.gr}</span>
    </div>`;
  }
  function waitingSeat() {
    return `<div class="pvp-seat duelseat empty"><span class="waitdot">· · ·</span><span class="ssub">ΑΝΑΜΟΝΗ ΑΝΤΙΠΑΛΟΥ<br>WAITING FOR RIVAL</span></div>`;
  }
  function wireRoom(sc) {
    const rb = $('#pvp-ready', sc);
    if (rb) rb.addEventListener('click', () => { S.me.ready = !S.me.ready; renderRoom(); checkAllReady(); });
    const sn = $('#pvp-startnow', sc);
    if (sn) sn.addEventListener('click', fillBotsAndStart);
    $$('#pvp-emotes button', sc).forEach(b => b.addEventListener('click', () => popEmote(S.me.id, b.dataset.emote)));
    $$('.pvp-vopt[data-vote]', sc).forEach(b => b.addEventListener('click', () => castVote(b.dataset.vote)));
    $$('.pvp-vopt[data-rank]', sc).forEach(b => b.addEventListener('click', () => castRank(b.dataset.rank)));
  }
  function popEmote(playerId, emote) {
    const seat = $(`.pvp-seat[data-seat="${playerId}"]`, root);
    if (!seat) return;
    const e = document.createElement('span');
    e.className = 'emote-pop'; e.textContent = emote;
    seat.appendChild(e);
    setTimeout(() => e.remove(), 1400);
  }
  function updateCountdownUI() {
    const num = $('#pvp-cd-num', root), arc = $('#pvp-cd-arc', root), cd = $('#pvp-cd', root);
    if (!num) return;
    const mm = Math.floor(Math.max(0, S.countdown) / 60), ss = Math.max(0, S.countdown) % 60;
    num.textContent = `${mm}:${ss < 10 ? '0' : ''}${ss}`;
    const frac = Math.max(0, S.countdown) / (S.countdownMax || 120);
    arc.style.strokeDashoffset = (150.8 * (1 - frac)).toFixed(1);
    arc.style.stroke = S.countdown <= 30 ? 'var(--sym-terra-lt)' : 'var(--sym-terra)';
    if (cd) cd.classList.toggle('fill', S.countdown <= 30);
  }

  /* ════════════════════ LAUNCH ════════════════════ */
  function launchMatch() {
    const ov = $('#pvp-launch', root);
    ov.classList.add('on');
    const lc = $('#pvp-launch-c', root);
    let n = 3;
    lc.textContent = n;
    const step = () => {
      n--;
      if (n > 0) { lc.textContent = n; lc.style.animation = 'none'; void lc.offsetWidth; lc.style.animation = ''; later(step, 850); }
      else { lc.textContent = 'ΑΓΩΝ'; lc.style.fontSize = 'clamp(54px,11vw,120px)'; later(() => { ov.classList.remove('on'); routeMatch(); }, 800); }
    };
    later(step, 850);
  }

  /* ════════════════════ MATCH router ════════════════════ */
  function routeMatch() {
    S.qpool = (window.SYM_QUESTIONS ? D.shuffle(window.SYM_QUESTIONS) : []);
    S.qi = 0;
    if (S.mode && S.mode.engine === 'chess' && window.PvPSkaki) return PvPSkaki.start(matchCtx());
    if (S.mode && S.mode.engine === 'petteia' && window.PvPChess) return PvPChess.start(matchCtx());
    if (S.mode && S.mode.engine === 'erinyes' && window.PvPErinyes) return PvPErinyes.start(matchCtx());
    if (S.mode && S.mode.engine === 'tug') return startTug();
    return startMatch();
  }
  function drawQuestion() {
    if (!S.qpool || !S.qpool.length) return { q: { gr: '—', en: '—' }, a: ['—', '—', '—', '—'], c: 0 };
    const q = S.qpool[S.qi % S.qpool.length]; S.qi++; return q;
  }
  function matchCtx() {
    const opp = S.players.find(p => !p.isMe);
    return {
      screenEl: $('[data-screen="match"]', root),
      me: S.me, opp, mode: S.mode, subject: S.subject,
      nextQuestion: drawQuestion,
      show: () => show('match'),
      onDone: (r) => { S.me.score = r.meScore; S.players.filter(p => !p.isMe).forEach(p => p.score = r.oppScore); showResults(); },
    };
  }

  /* ════════════════════ TUG OF WAR (Διελκυστίνδα) ════════════════════ */
  function startTug() {
    clearTimers();
    const opp = S.players.find(p => !p.isMe);
    S.tug = { pos: 0, max: 6, opp, oppSkill: Math.max(0.4, Math.min(0.9, (opp.rating - 900) / 1100)) };
    renderTug();
    show('match');
    later(tugNext, 400);
  }
  function renderTug() {
    const m = S.mode, acc = m.accent, opp = S.tug.opp;
    const sc = $('[data-screen="match"]', root);
    sc.innerHTML = `
      <div class="pvp-wrap" style="max-width:920px">
        <div class="pvp-kicker"><b>${m.gr} /</b> ${S.subject.gr}</div>
        <h1 class="pvp-h1" style="font-size:clamp(26px,4vw,40px);margin-bottom:18px">ΔΙΕΛΚΥΣΤΙΝΔΑ<span class="en">Answer correctly to pull the rope to your side.</span></h1>
        <div class="pvp-tug" style="--accent:${cssv(acc)}">
          <div class="tug-side opp"><span class="tug-seal">${opp.seal}</span><span>${opp.name}${opp.isBot?' ·bot':''}</span></div>
          <div class="tug-track"><div class="tug-center"></div><div class="tug-knot" id="tug-knot">⚱</div></div>
          <div class="tug-side me"><span class="tug-seal">${S.me.seal}</span><span>ΕΣΥ</span></div>
        </div>
        <div class="pvp-panel pvp-q" style="--accent:${cssv(acc)};max-width:680px;margin:20px auto 0">
          <div class="qsubj">Η ΥΛΗ ΣΟΥ · ${S.subject.gr} / ${S.subject.en}</div>
          <p class="qtext" id="tug-qtext">…</p>
          <div class="pvp-ans" id="tug-ans"></div>
          <div class="pvp-fb" id="tug-fb"></div>
        </div>
      </div>`;
    updateTug();
  }
  function updateTug() {
    const knot = $('#tug-knot', root); if (!knot) return;
    const frac = S.tug.pos / S.tug.max;
    knot.style.left = (50 + frac * 42) + '%';
  }
  function tugNext() {
    if (!$('#tug-ans', root)) return;
    const q = drawQuestion(); S.tug.q = q;
    $('#tug-qtext', root).textContent = q.q.gr;
    const ans = $('#tug-ans', root);
    ans.innerHTML = q.a.map((a, i) => `<button data-i="${i}">${a}</button>`).join('');
    const fb = $('#tug-fb', root); fb.textContent = ''; fb.className = 'pvp-fb';
    $$('#tug-ans button', root).forEach(b => b.addEventListener('click', () => tugAnswer(+b.dataset.i, b)));
  }
  function tugAnswer(i, btn) {
    $$('#tug-ans button', root).forEach(b => b.disabled = true);
    const fb = $('#tug-fb', root);
    if (i === S.tug.q.c) { btn.classList.add('correct'); S.tug.pos = Math.min(S.tug.max, S.tug.pos + 1); fb.textContent = 'ΣΩΣΤΟ! Τραβάς το σχοινί →'; fb.className = 'pvp-fb good'; }
    else { btn.classList.add('wrong'); $$('#tug-ans button', root)[S.tug.q.c].classList.add('correct'); fb.textContent = 'ΛΑΘΟΣ — δεν τράβηξες'; fb.className = 'pvp-fb bad'; }
    updateTug();
    later(() => {
      if (Math.random() < S.tug.oppSkill) { S.tug.pos = Math.max(-S.tug.max, S.tug.pos - 1); fb.textContent += '  ·  ο αντίπαλος τράβηξε ←'; updateTug(); }
      if (S.tug.pos >= S.tug.max) return tugEnd(true);
      if (S.tug.pos <= -S.tug.max) return tugEnd(false);
      later(tugNext, 650);
    }, 750);
  }
  function tugEnd(meWon) {
    S.me.score = meWon ? 1000 + (S.tug.max + S.tug.pos) * 10 : (S.tug.max + S.tug.pos) * 10;
    S.players.filter(p => !p.isMe).forEach(p => p.score = meWon ? (S.tug.max - S.tug.pos) * 10 : 1000 + (S.tug.max - S.tug.pos) * 10);
    later(showResults, 700);
  }

  /* ════════════════════ MATCH (simulated, fixed time) ════════════════════ */
  function startMatch() {
    clearTimers();
    S.players.forEach(p => { p.score = 0; });
    S.matchTime = 75;
    S.streak = 0;
    S.qpool = (window.SYM_QUESTIONS ? D.shuffle(window.SYM_QUESTIONS) : []);
    S.qi = 0;
    renderMatch();
    show('match');
    nextQuestion();
    every(() => {
      S.matchTime--;
      tickOpponents();
      updateClock();
      renderTower();
      if (S.matchTime <= 0) { clearTimers(); later(showResults, 500); }
    }, 1000);
  }

  function renderMatch() {
    const m = S.mode, acc = m.accent;
    const sc = $('[data-screen="match"]', root);
    sc.innerHTML = `
      <div class="pvp-wrap" style="max-width:1080px">
        <div class="pvp-mhud">
          <div><div class="mlab">${m.gr} · ${S.subject.gr}</div><div class="pvp-clock" id="pvp-clock">1:15</div></div>
          <div class="mspacer"></div>
          <div class="pvp-streak" id="pvp-streak"></div>
          <div class="myscore"><b id="pvp-myscore">0</b><span class="mlab">ΟΙ ΠΟΝΤΟΙ ΣΟΥ</span></div>
        </div>
        <div class="pvp-match">
          <div class="pvp-panel pvp-q" style="--accent:${cssv(acc)}">
            <div class="qsubj">Η ΥΛΗ ΣΟΥ · ${S.subject.gr} / ${S.subject.en}</div>
            <p class="qtext" id="pvp-qtext">…</p>
            <div class="pvp-ans" id="pvp-ans"></div>
            <div class="pvp-fb" id="pvp-fb"></div>
          </div>
          <aside class="pvp-panel pvp-tower">
            <div class="th"><span class="flag">⚑</span> ΖΩΝΤΑΝΗ ΚΑΤΑΤΑΞΗ · LIVE
              <span style="margin-left:auto"><button class="pvp-back" id="pvp-endnow" style="padding:4px 10px">⏭ ΛΗΞΗ</button></span></div>
            <div id="pvp-tower-rows"></div>
          </aside>
        </div>
      </div>`;
    $('#pvp-endnow', sc).addEventListener('click', () => { clearTimers(); showResults(); });
    renderTower();
    updateClock();
  }

  function nextQuestion() {
    if (!S.qpool.length) { $('#pvp-qtext', root).textContent = '—'; return; }
    const q = S.qpool[S.qi % S.qpool.length]; S.qi++;
    S.curQ = q;
    $('#pvp-qtext', root).textContent = q.q.gr;
    const ans = $('#pvp-ans', root);
    ans.innerHTML = q.a.map((a, i) => `<button data-i="${i}">${a}</button>`).join('');
    $('#pvp-fb', root).textContent = '';
    $('#pvp-fb', root).className = 'pvp-fb';
    $$('#pvp-ans button', root).forEach(b => b.addEventListener('click', () => answer(+b.dataset.i, b)));
  }
  function answer(i, btn) {
    if (S.matchTime <= 0) return;
    $$('#pvp-ans button', root).forEach(b => b.disabled = true);
    const correct = S.curQ.c;
    const fb = $('#pvp-fb', root);
    if (i === correct) {
      btn.classList.add('correct');
      S.streak++;
      const gain = 100 * Math.min(S.streak, 5);
      S.me.score += gain;
      fb.textContent = `ΣΩΣΤΟ! +${gain}${S.streak > 1 ? '  ×' + Math.min(S.streak,5) + ' σερί' : ''}`;
      fb.className = 'pvp-fb good';
    } else {
      btn.classList.add('wrong');
      $$('#pvp-ans button', root)[correct].classList.add('correct');
      S.streak = 0;
      fb.textContent = 'ΛΑΘΟΣ — οι αντίπαλοι κερδίζουν έδαφος';
      fb.className = 'pvp-fb bad';
    }
    updateMyScore();
    renderTower();
    later(() => { if (S.matchTime > 0) nextQuestion(); }, 850);
  }
  function tickOpponents() {
    S.players.forEach(p => {
      if (p.isMe) return;
      const skill = Math.max(0, Math.min(1.2, (p.rating - 1000) / 1000));
      if (Math.random() < 0.55) {
        const base = 18 + skill * 42;
        p.score += D.randi(Math.round(base * 0.55), Math.round(base * 1.5));
      }
      if (Math.random() < 0.03) popMatchEmote(p.id);
    });
  }
  function popMatchEmote(pid) {
    const row = $(`.pvp-trow[data-row="${pid}"]`, root);
    if (!row) return;
    const e = document.createElement('span'); e.className = 'tem'; e.textContent = D.pick(D.EMOTES);
    row.appendChild(e); setTimeout(() => e.remove(), 1300);
  }
  function renderTower() {
    const wrap = $('#pvp-tower-rows', root);
    if (!wrap) return;
    const sorted = S.players.slice().sort((a, b) => b.score - a.score);
    wrap.innerHTML = sorted.map((p, i) => `
      <div class="pvp-trow ${p.isMe?'me':''}" data-row="${p.id}">
        <span class="tp">${i+1}</span>
        <span class="ts">${p.seal}</span>
        <span class="tn">${p.isMe ? 'ΕΣΥ' : p.name}${p.isBot?' ·b':''}</span>
        <span class="tsc">${p.score}</span>
      </div>`).join('');
  }
  function updateClock() {
    const c = $('#pvp-clock', root); if (!c) return;
    const mm = Math.floor(Math.max(0, S.matchTime) / 60), ss = Math.max(0, S.matchTime) % 60;
    c.textContent = `${mm}:${ss < 10 ? '0' : ''}${ss}`;
    c.classList.toggle('low', S.matchTime <= 15);
  }
  function updateMyScore() {
    const e = $('#pvp-myscore', root); if (e) e.textContent = S.me.score;
    const st = $('#pvp-streak', root); if (st) st.textContent = S.streak > 1 ? '🔥 ' + S.streak + ' σερί / streak' : '';
  }

  /* ════════════════════ RESULTS + ELO ════════════════════ */
  function showResults() {
    clearTimers();
    const sorted = S.players.slice().sort((a, b) => b.score - a.score);
    const N = sorted.length;
    const avg = S.players.reduce((s, p) => s + p.rating, 0) / N;
    // ELO-style delta per player vs field average; actual from placement
    sorted.forEach((p, i) => {
      const expected = 1 / (1 + Math.pow(10, (avg - p.rating) / 400));
      const actual = (N - 1 - i) / (N - 1);          // 1 for 1st … 0 for last
      p.delta = Math.round(32 * (actual - expected));
    });
    const me = S.me, mePlace = sorted.indexOf(me) + 1;
    const oldRating = S.profile.rating;
    S.profile.rating = Math.max(100, oldRating + me.delta);
    S.profile.played += 1;
    if (mePlace === 1) S.profile.wins += 1;
    D.saveProfile(S.profile);
    const newTier = D.tierFor(S.profile.rating);

    const top3 = sorted.slice(0, 3);
    const podOrder = [top3[1], top3[0], top3[2]].filter(Boolean); // 2 - 1 - 3
    const sc = $('[data-screen="results"]', root);
    sc.innerHTML = `
      <div class="pvp-wrap pvp-center">
        <div class="pvp-kicker"><b>ΤΕΛΟΣ ΑΓΩΝΑ /</b> RESULTS · ${S.mode.gr}</div>
        <h1 class="pvp-h1" style="margin-bottom:6px">${mePlace===1?'ΝΙΚΗ!':'ΘΕΣΗ '+mePlace+'<sup style="font-size:.4em">η</sup>'}<span class="en">${mePlace===1?'You won the agon.':'You placed '+mePlace+' of '+N+'.'}</span></h1>

        <div class="pvp-rating-move">
          <div class="rm-big">${S.profile.rating}</div>
          <div class="rm-d ${me.delta>=0?'up':'down'}">${me.delta>=0?'▲ +':'▼ '}${me.delta} rating <span style="color:var(--sym-stone)">(${oldRating} → ${S.profile.rating})</span></div>
          <div class="rm-tier">${newTier.glyph} ${newTier.gr} · ${newTier.en}</div>
        </div>

        <div class="pvp-podium">
          ${podOrder.map(p => podHTML(p, sorted.indexOf(p) + 1)).join('')}
        </div>

        <div class="pvp-result-list pvp-panel" style="padding:6px 6px">
          ${sorted.map((p, i) => resRow(p, i + 1)).join('')}
        </div>

        <div class="pvp-result-cta">
          <button class="pvp-btn" id="pvp-rematch">ΡΕΒΑΝΣ · REMATCH</button>
          <button class="pvp-btn ghost" id="pvp-newlobby">ΝΕΟ ΛΟΜΠΙ · NEW LOBBY</button>
          <div class="pvp-emotes" id="pvp-res-emotes" style="align-self:center">${D.EMOTES.slice(0,4).map(e=>`<button data-emote="${e}">${e}</button>`).join('')}</div>
        </div>
      </div>`;
    $('#pvp-rematch', sc).addEventListener('click', rematch);
    $('#pvp-newlobby', sc).addEventListener('click', renderHub);
    $$('#pvp-res-emotes button', sc).forEach(b => b.addEventListener('click', () => {
      const e = document.createElement('span'); e.className = 'lc'; e.style.position = 'fixed'; e.style.left = '50%'; e.style.top = '40%'; e.style.transform = 'translate(-50%,-50%)'; e.style.zIndex = 90; e.style.fontSize = '90px'; e.style.pointerEvents = 'none'; e.textContent = b.dataset.emote;
      e.style.animation = 'emoteFloat 1.2s ease-out forwards'; root.appendChild(e); setTimeout(() => e.remove(), 1200);
    }));
    refreshChip();
    show('results');
  }
  function podHTML(p, place) {
    return `<div class="pvp-pod p${place}">
      <div class="medal">${place===1?'①':place===2?'②':'③'}</div>
      <div class="ps">${p.seal}</div>
      <div class="pn">${p.isMe?'ΕΣΥ':p.name}</div>
      <div class="psc">${p.score}</div>
    </div>`;
  }
  function resRow(p, place) {
    const cls = p.delta > 0 ? 'up' : p.delta < 0 ? 'down' : '';
    return `<div class="pvp-rrow ${p.isMe?'me':''}">
      <span class="rp">${place}</span>
      <span class="rs">${p.seal}</span>
      <span class="rn"><b>${p.isMe?'ΕΣΥ · YOU':p.name}${p.isBot?' ·bot':''}</b><span>${p.subject.gr} · ${p.rating} rtg</span></span>
      <span class="rsc">${p.score}</span>
      <span class="rdelta ${cls}">${p.delta>=0?'+':''}${p.delta}</span>
    </div>`;
  }

  function rematch() {
    // keep same roster (humans + bots), reset for a new round, refresh ratings from results
    clearTimers();
    S.players.forEach(p => { if (p.isMe) { p.rating = S.profile.rating; } else { p.rating = Math.max(800, p.rating + (p.delta || 0)); } p.score = 0; p.ready = false; p.vote = null; });
    S.players.forEach(p => { p.ranks = []; });
    S.started = false; S.countdownMax = (S.format === 'duel' ? 300 : 120); S.countdown = S.countdownMax; S.voteResolved = true; S.voteOpen = false; S.streak = 0;
    renderRoom(); show('room');
    every(tickRoom, 1000);
    every(simReadyTick, 2500);
    every(simEmoteTick, 4200);
  }

  /* ════════════════════ identity + join modals ════════════════════ */
  function refreshChip() {
    const p = S.profile, t = D.tierFor(p.rating);
    const chip = $('#pvp-chip', root);
    chip.querySelector('.seal').textContent = p.seal;
    chip.querySelector('.nm').textContent = p.name;
    chip.querySelector('.rk').innerHTML = `${t.glyph} ${t.gr} · <b>${p.rating}</b>`;
  }
  function openIdentity() {
    const p = S.profile;
    const bg = $('#pvp-modal-bg', root);
    bg.innerHTML = `
      <div class="pvp-panel pvp-modal">
        <h2>Η ΤΑΥΤΟΤΗΤΑ ΣΟΥ</h2>
        <p class="sub">Your name & seal — Choose your identity for the agon.</p>
        <div class="pvp-field">
          <label class="pvp-label">ΟΝΟΜΑ · NAME</label>
          <input class="pvp-input" id="pvp-name-in" maxlength="16" value="${p.name === 'ΕΣΥ' ? '' : p.name}" placeholder="ΤΟ ΟΝΟΜΑ ΣΟΥ">
        </div>
        <div class="pvp-field">
          <label class="pvp-label">ΣΦΡΑΓΙΔΑ · SEAL</label>
          <div class="pvp-seal-grid" id="pvp-seal-grid">
            ${D.SEALS.map(s => `<button class="pvp-seal-opt ${s.glyph===p.seal?'sel':''}" data-seal="${s.glyph}" title="${s.name} / ${s.en}">${s.glyph}</button>`).join('')}
          </div>
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end;margin-top:8px">
          <button class="pvp-btn ghost" id="pvp-id-cancel">ΑΚΥΡΟ</button>
          <button class="pvp-btn" id="pvp-id-save">ΑΠΟΘΗΚΕΥΣΗ · SAVE</button>
        </div>
      </div>`;
    bg.classList.add('on');
    let seal = p.seal;
    $$('#pvp-seal-grid .pvp-seal-opt', bg).forEach(b => b.addEventListener('click', () => {
      $$('#pvp-seal-grid .pvp-seal-opt', bg).forEach(x => x.classList.remove('sel'));
      b.classList.add('sel'); seal = b.dataset.seal;
    }));
    $('#pvp-id-cancel', bg).addEventListener('click', () => bg.classList.remove('on'));
    $('#pvp-id-save', bg).addEventListener('click', () => {
      const nm = ($('#pvp-name-in', bg).value || '').trim().toUpperCase() || 'ΑΓΩΝΙΣΤΗΣ';
      S.profile.name = nm; S.profile.seal = seal; D.saveProfile(S.profile);
      bg.classList.remove('on'); refreshChip();
    });
  }
  function openJoin() {
    const bg = $('#pvp-modal-bg', root);
    bg.innerHTML = `
      <div class="pvp-panel pvp-modal">
        <h2>ΕΙΣΟΔΟΣ ΜΕ ΚΩΔΙΚΟ</h2>
        <p class="sub">Enter a friend's room code to join their lobby.</p>
        <div class="pvp-field">
          <label class="pvp-label">ΚΩΔΙΚΟΣ ΛΟΜΠΙ · ROOM CODE</label>
          <input class="pvp-input pvp-code-in" id="pvp-code-in" maxlength="5" placeholder="ΑΒΓΔΕ">
        </div>
        <div style="display:flex;gap:10px;justify-content:flex-end">
          <button class="pvp-btn ghost" id="pvp-join-cancel">ΑΚΥΡΟ</button>
          <button class="pvp-btn" id="pvp-join-go">ΕΙΣΟΔΟΣ · JOIN</button>
        </div>
      </div>`;
    bg.classList.add('on');
    const inp = $('#pvp-code-in', bg);
    inp.focus();
    $('#pvp-join-cancel', bg).addEventListener('click', () => { bg.classList.remove('on'); });
    $('#pvp-join-go', bg).addEventListener('click', () => {
      S.joinCode = (inp.value || '').trim().toUpperCase() || randCode();
      S.mode = D.weightedMode();   // simulate the host's chosen mode
      bg.classList.remove('on');
      renderContent();
    });
  }

  /* ════════════════════ boot ════════════════════ */
  function init() {
    root = $('#pvp-root');
    S.timers = [];
    S.profile = D.loadProfile();
    $('#pvp-chip', root).addEventListener('click', openIdentity);
    $('#pvp-back', root).addEventListener('click', () => { clearTimers(); if (window.PvPChess) PvPChess.stop(); if (window.PvPSkaki) PvPSkaki.stop(); if (window.PvPErinyes) PvPErinyes.stop(); renderHub(); });
    $('#pvp-modal-bg', root).addEventListener('click', (e) => { if (e.target.id === 'pvp-modal-bg') e.currentTarget.classList.remove('on'); });
    renderHub();
  }

  return { init };
})();
