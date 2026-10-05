/* Friends: code-based duels (same 10 questions for both players) and a leaderboard
   built from this device's players plus score cards pasted from friends. No server needed. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const FRIENDS = 'mgt354-friends';
  const ALPH = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const get = k => { try { return localStorage.getItem(k); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, v); } catch (e) { } };
  const RANKS = [[0, 'RECRUIT UNIT'], [120, 'FIELD UNIT'], [300, 'SCOUT UNIT'], [550, 'COMBAT UNIT'], [900, 'ELITE UNIT'], [1400, 'COMMAND UNIT'], [2100, 'ARCHIVE KEEPER']];
  const rankName = xp => RANKS.reduce((r, [t, n]) => (xp >= t ? n : r), RANKS[0][1]);

  /* deterministic PRNG so both players get the same duel */
  function seedFrom(code) { let h = 2166136261; for (const c of code) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(seed) { let a = seed; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  function sshuffle(arr, r) { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
  const TOPIC_KEYS = { A: 'all', C: 'competitiveness', S: 'structures', M: 'merit', L: 'sam', E: 'all' };
  const setFor = code => code[0] === 'E' ? window.EXAM3_DATA : (window.EXAM2_DATA || window.STUDY_DATA);
  function duelSet(code) {
    const topic = TOPIC_KEYS[code[0]] || 'all';
    const r = rng(seedFrom(code));
    const pool = setFor(code).questions.filter(q => topic === 'all' || q.topic === topic).slice().sort((a, b) => a.id < b.id ? -1 : 1);
    return sshuffle(pool, r).slice(0, 10).map(q => ({ q, order: sshuffle(q.options.map((_, i) => i), r) }));
  }
  const newCode = topicKey => topicKey + Array.from({ length: 5 }, () => ALPH[Math.floor(Math.random() * ALPH.length)]).join('');
  const validCode = c => /^[ACSMLE][A-Z2-9]{5}$/.test(c);

  /* result codes: DUEL-<code>-<name>-<bits>-<seconds> */
  const cleanName = n => String(n || 'Player').replace(/[^A-Za-z0-9 ]/g, '').trim().slice(0, 16) || 'Player';
  function resultCode(code, name, bits, secs) { return `DUEL-${code}-${cleanName(name).replace(/ /g, '_')}-${bits.map(b => b ? 1 : 0).join('')}-${secs}`; }
  function parseResult(t) {
    const m = String(t || '').trim().match(/^DUEL-([ACSMLE][A-Z2-9]{5})-([A-Za-z0-9_]{1,16})-([01]{10})-(\d{1,5})$/);
    return m ? { code: m[1], name: m[2].replace(/_/g, ' '), bits: m[3].split('').map(Number), secs: +m[4], score: m[3].split('').filter(x => x === '1').length } : null;
  }

  /* ---------- duel ---------- */
  let duel = null, timerId = 0;
  const myName = () => window.Profiles?.current().name || 'Player';
  const duels = () => { const s = S().state; s.duels = s.duels || {}; return s.duels; };


  /* ---------- live duel: on a Claude link where both players can join a room ---------- */
  let live = null;
  async function liveJoin(code) {
    if (live && live.code === code) return live;
    liveLeave();
    try {
      const room = window.claude?.use ? await window.claude.use('room') : null;
      if (!room) {
        if (!window.Account?.available) return null;
        // No Claude room here: share progress through the cloud and check for the other player every 2 seconds.
        live = { code, cloud: true, others: [] };
        const poll = async () => { if (!live || live.code !== code) return; try { const rows = await window.Account.duelGet(code); live.others = rows.map(r => ({ presence: { ...r.state, name: r.name } })); livePaint(); } catch (e) { } };
        live.timer = setInterval(() => { if (S().page !== 'duel') return; poll(); }, 2000); poll();
        livePub(); return live;
      }
      const g = await room.join('duel-' + code.toLowerCase());
      live = { code, g, others: [] };
      live.off = g.onPeers(ch => { if (!live) return; live.others = ch.peers.filter(p => !p.isMe && p.presence && p.presence.duel === code); livePaint(); });
      livePub(); return live;
    } catch (e) { live = null; return null; }
  }
  function liveLeave() { if (!live) return; try { clearInterval(live.timer); live.off?.(); live.g?.leave(); } catch (e) { } live = null; }
  function livePub() {
    if (!live) return; const d = duels()[live.code] || {}, mine = d.mine;
    const pres = { duel: live.code, name: cleanName(myName()), at: duel && duel.code === live.code ? duel.i : (mine ? 10 : 0), done: !!mine, bits: mine ? mine.bits.map(b => b ? 1 : 0).join('') : null, secs: mine ? mine.secs : null };
    if (live.cloud) window.Account?.duelSet(live.code, pres).catch(() => { }); else live.g.presence(pres).catch(() => { });
  }
  function livePaint() {
    if (!live) return; const o = live.others[0], d = duels()[live.code];
    if (o && o.presence.done && /^[01]{10}$/.test(o.presence.bits || '') && d && (!d.them || d.them.live)) {
      const bits = o.presence.bits.split('').map(Number), fresh = !d.them;
      d.them = { name: cleanName(o.presence.name || 'Friend'), bits, secs: Math.max(0, +o.presence.secs || 0), score: bits.filter(Boolean).length, live: true }; S().save();
      if (fresh && d.mine && S().page === 'duel' && !duel) { duelLobby(live.code); return; }
    }
    const el = $('#duel-live'); if (!el) return;
    el.innerHTML = o ? `<span class="live-dot"></span> ${esc(o.presence.name || 'Friend')} is in this duel · ${o.presence.done ? 'finished' : 'on question ' + Math.min(10, (+o.presence.at || 0) + 1) + ' of 10'}` : '<span class="live-dot off"></span> Live: waiting for your friend to open this duel' + (live.cloud ? ' (logged in on their device).' : ' on the same Claude link.') + ' Codes still work too.';
  }

  function duelHome(msg) {
    stop(); liveLeave(); S().setPage('duel');
    const past = Object.entries(duels()).sort((a, b) => b[1].when - a[1].when).slice(0, 6);
    $('#app').innerHTML = S().heading('FRIENDS / DUEL', 'Head-to-head duel', 'Both players answer the same 10 questions in the same order. Fewest misses wins; time breaks a tie.') +
      `<div class="duel-grid"><section class="panel"><h2>Start a duel</h2><p>Pick a topic, then text the code to your friend.</p>
        <div class="config"><label class="field">Topic<select id="d-topic">${window.ACTIVE_EXAM === 3 ? '<option value="E">All Exam 3 topics</option>' : '<option value="A">All Exam 2 topics</option><option value="C">Competitiveness</option><option value="S">Pay Structures &amp; Math</option><option value="M">Merit &amp; Incentives</option><option value="L">Sam Lewis</option><option value="E">Exam 3: all topics</option>'}</select></label></div>
        <button class="primary" data-action="d-new">Create duel →</button></section>
      <section class="panel"><h2>Join a duel</h2><p>Got a code from a friend? Type it here.</p>
        <label class="field">Duel code<input id="d-code" maxlength="6" autocomplete="off" autocapitalize="characters" placeholder="e.g. AK7Q2X"></label>
        <button class="primary" data-action="d-join">Join →</button></section></div>
      ${msg ? `<p class="pf-error" role="alert">${esc(msg)}</p>` : ''}
      ${past.length ? `<div class="section-line"><h2>YOUR RECENT DUELS</h2></div><section class="panel">${past.map(([c, d]) => `<div class="duel-past"><span class="duel-code">${c}</span><span>${d.mine ? `You: ${d.mine.score}/10 in ${fmtT(d.mine.secs)}` : 'Not played yet'}${d.them ? ` · ${esc(d.them.name)}: ${d.them.score}/10 in ${fmtT(d.them.secs)}` : ''}</span><button data-action="d-open" data-code="${c}">Open</button></div>`).join('')}</section>` : ''}`;
  }
  const fmtT = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  function duelLobby(code) {
    stop(); S().setPage('duel');
    const d = duels()[code] = duels()[code] || { when: Date.now() };
    S().save();
    const topicName = { A: 'All Exam 2 topics', C: 'Competitiveness', S: 'Pay Structures & Math', M: 'Merit & Incentives', L: 'Sam Lewis', E: 'All Exam 3 topics' }[code[0]];
    $('#app').innerHTML = S().heading('FRIENDS / DUEL ' + code, 'Duel ' + code, topicName + ' · 10 questions · same order for both players') +
      `<section class="panel duel-code-box"><div><div class="eyebrow">SEND THIS CODE TO YOUR FRIEND</div><div class="duel-big" id="d-share">${code}</div></div>
        <button data-action="d-copy" data-text="${code}">Copy code</button></section><div id="duel-live" class="duel-live"></div>
      ${d.mine ? resultPanel(code) : `<section class="panel"><p>When you’re ready, start the clock. You can’t pause, and answers are only revealed at the end.</p><button class="primary" data-action="d-start" data-code="${code}">Start duel →</button></section>`}`;
    liveJoin(code).then(() => { livePub(); livePaint(); });
  }

  function startDuel(code) {
    const set = duelSet(code);
    duel = { code, set, i: 0, answers: [], start: Date.now() };
    S().sound('start'); renderDuelQ();
    timerId = setInterval(() => { const t = $('#d-clock'); if (t && duel) t.textContent = fmtT(Math.floor((Date.now() - duel.start) / 1000)); }, 500);
  }
  function stop() { clearInterval(timerId); timerId = 0; }
  function renderDuelQ() {
    S().setPage('duel', false);
    const { q, order } = duel.set[duel.i];
    $('#app').innerHTML = S().heading('DUEL ' + duel.code + ' / IN PROGRESS', 'Question ' + (duel.i + 1) + ' of 10', '', `<div class="timer" id="d-clock">${fmtT(Math.floor((Date.now() - duel.start) / 1000))}</div>`) +
      `<div id="duel-live" class="duel-live"></div><div class="progressbar"><span style="width:${duel.i * 10}%"></span></div>
      <section class="question-card"><div class="source">${esc((setFor(duel.code).topics.find(t => t.id === q.topic) || {}).name || '')}</div><h2>${esc(q.prompt)}</h2>
      <div class="options">${order.map((oi, k) => `<button class="option" data-action="d-ans" data-opt="${oi}"><span class="letter">${'ABCD'[k]}</span><span>${esc(q.options[oi])}</span></button>`).join('')}</div></section>`;
    livePub(); livePaint();
  }
  function answerDuel(opt) {
    if (!duel) return;
    const { q } = duel.set[duel.i], ok = opt === q.answer;
    duel.answers.push({ opt, ok }); S().record(q.id, q.topic, ok); S().sound('select');
    if (++duel.i < 10) { renderDuelQ(); return; }
    stop();
    const secs = Math.round((Date.now() - duel.start) / 1000), bits = duel.answers.map(a => a.ok);
    const d = duels()[duel.code] = duels()[duel.code] || { when: Date.now() };
    d.mine = { score: bits.filter(Boolean).length, secs, bits, picks: duel.answers.map(a => a.opt) }; d.when = Date.now();
    S().save(); S().sound('complete');
    const code = duel.code; duel = null; livePub(); duelLobby(code);
  }
  function resultPanel(code) {
    const d = duels()[code], me = d.mine, them = d.them, set = duelSet(code);
    const rc = resultCode(code, myName(), me.bits, me.secs);
    let verdict = '';
    if (them) {
      const win = me.score !== them.score ? me.score > them.score : me.secs !== them.secs ? me.secs < them.secs : null;
      verdict = `<div class="duel-verdict ${win === true ? 'win' : win === false ? 'lose' : ''}">${win === true ? 'YOU WIN' : win === false ? esc(them.name).toUpperCase() + ' WINS' : 'DEAD EVEN'}</div>`;
    }
    return `<section class="panel"><h2>Results</h2>${verdict}
      <div class="duel-scores"><div><span class="eyebrow">${esc(myName()).toUpperCase()}</span><strong>${me.score}/10</strong><small>${fmtT(me.secs)}</small></div>
      ${them ? `<div><span class="eyebrow">${esc(them.name).toUpperCase()}</span><strong>${them.score}/10</strong><small>${fmtT(them.secs)}</small></div>` : '<div class="duel-wait"><span class="eyebrow">OPPONENT</span><small>Paste their result code below to compare.</small></div>'}</div>
      <div class="duel-share"><div class="eyebrow">YOUR RESULT CODE · SEND IT TO YOUR FRIEND</div><code id="d-rc">${esc(rc)}</code><button data-action="d-copy" data-text="${esc(rc)}">Copy result</button></div>
      <form id="d-their" class="pf-add"><label class="field">Friend’s result code<input id="d-their-code" autocomplete="off" placeholder="DUEL-${code}-Name-…"></label><button type="submit">Compare</button></form><p class="pf-error" id="d-err" role="alert"></p>
      <div class="section-line"><h2>QUESTION BY QUESTION</h2></div>
      ${set.map(({ q }, i) => `<div class="duel-row"><span class="duel-n">${i + 1}</span><span class="duel-mark ${me.bits[i] ? 'ok' : 'bad'}">${me.bits[i] ? '✓' : '✗'}</span>${them ? `<span class="duel-mark ${them.bits[i] ? 'ok' : 'bad'}">${them.bits[i] ? '✓' : '✗'}</span>` : ''}<div><p>${esc(q.prompt)}</p><p class="source">Answer: ${esc(q.answerKeyText || q.options[q.answer])}${!me.bits[i] && me.picks ? ` · you picked: ${esc(q.options[me.picks[i]])}` : ''}</p></div></div>`).join('')}
      <div class="actions"><button data-action="mode" data-mode="duel">All duels</button><button class="primary" data-action="d-new-same" data-topic="${code[0]}">Rematch (new code) →</button></div></section>`;
  }

  /* ---------- leaderboard ---------- */
  function statsFor(saved) {
    const s = saved || {}, tries = Object.values(s.stats || {}).reduce((n, t) => n + (t.total || 0), 0), ok = Object.values(s.stats || {}).reduce((n, t) => n + (t.correct || 0), 0);
    return { xp: s.ops?.xp || 0, acc: tries ? Math.round(ok / tries * 100) : 0, answered: tries, cleared: Object.keys(s.ops?.cleared || {}).length, best: s.best || 0 };
  }
  function localPlayers() {
    let meta = null; try { meta = JSON.parse(get('mgt354-profiles') || 'null'); } catch (e) { }
    const list = meta?.list?.length ? meta.list : [{ id: 'p1', name: myName() }];
    return list.map(p => { let saved = null; try { saved = JSON.parse(get(p.id === 'p1' ? 'mgt354-exam2-v1' : 'mgt354-exam2-v1::' + p.id) || 'null'); } catch (e) { } return { name: p.name || 'Player', ...statsFor(saved), here: true, me: p.id === meta?.current }; });
  }
  const friends = () => { try { return JSON.parse(get(FRIENDS) || '[]'); } catch (e) { return []; } };
  function myCard() {
    const s = statsFor(S().state);
    const payload = [cleanName(myName()), s.xp, s.acc, s.answered, s.cleared, s.best, Math.floor(Date.now() / 60000)].join('|');
    return 'CARD-' + btoa(unescape(encodeURIComponent(payload))).replace(/=+$/, '');
  }
  function parseCard(t) {
    const m = String(t || '').trim().match(/^CARD-([A-Za-z0-9+/]+)$/); if (!m) return null;
    try {
      const p = decodeURIComponent(escape(atob(m[1]))).split('|'); if (p.length !== 7) return null;
      const [name, xp, acc, answered, cleared, best, mins] = p; const n = [xp, acc, answered, cleared, best, mins].map(Number);
      if (n.some(x => !Number.isFinite(x) || x < 0) || n[1] > 100 || n[3] > 10) return null;
      return { name: cleanName(name), xp: n[0], acc: n[1], answered: n[2], cleared: n[3], best: n[4], at: n[5] * 60000 };
    } catch (e) { return null; }
  }
  let sortKey = 'xp';
  function boardPage(msg) {
    stop(); S().setPage('board');
    const locals = localPlayers(), fr = friends().filter(f => !locals.some(l => l.name.toLowerCase() === f.name.toLowerCase()));
    const rows = [...locals, ...fr.map(f => ({ ...f, friend: true }))].sort((a, b) => (b[sortKey] - a[sortKey]) || (b.xp - a.xp));
    const card = myCard();
    $('#app').innerHTML = S().heading('FRIENDS / LEADERBOARD', 'Leaderboard', 'Everyone who plays on this device shows up automatically. Add friends on other devices by pasting their score card.') +
      `<section class="panel"><div class="board-sort"><span class="eyebrow">RANK BY</span>${[['xp', 'XP'], ['acc', 'Accuracy'], ['answered', 'Answers'], ['cleared', 'Bosses']].map(([k, l]) => `<button class="${sortKey === k ? 'primary' : ''}" data-action="b-sort" data-key="${k}">${l}</button>`).join('')}</div>
      <div class="table-wrap"><table class="ws board"><thead><tr><th>#</th><th>Player</th><th>Rank</th><th>XP</th><th>Accuracy</th><th>Answers</th><th>Bosses</th><th></th></tr></thead><tbody>
      ${rows.map((r, i) => `<tr class="${r.me ? 'board-me' : ''}"><td class="board-pos">${i + 1}</td><td><b>${esc(r.name)}</b>${r.me ? ' <em>you</em>' : ''}${r.friend ? `<br><small class="source">card from ${new Date(r.at).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</small>` : ''}</td><td class="board-rank">${rankName(r.xp)}</td><td>${r.xp}</td><td>${r.answered ? r.acc + '%' : '—'}</td><td>${r.answered}</td><td>${r.cleared}</td><td>${r.friend ? `<button class="text-button danger" data-action="b-remove" data-name="${esc(r.name)}">Remove</button>` : ''}</td></tr>`).join('')}
      </tbody></table></div></section>
      <div class="duel-grid"><section class="panel"><h2>Your score card</h2><p>Copy it and text it to a friend so they can add you to their board. Send a new one after you study.</p><code class="card-code" id="b-card">${esc(card)}</code><button data-action="d-copy" data-text="${esc(card)}">Copy score card</button></section>
      <section class="panel"><h2>Add a friend’s card</h2><form id="b-add"><label class="field">Paste their score card<input id="b-card-in" autocomplete="off" placeholder="CARD-…"></label><button type="submit" class="primary">Add to board</button></form><p class="pf-error" id="b-err" role="alert">${esc(msg || '')}</p></section></div>`;
    $('#b-add').addEventListener('submit', e => {
      e.preventDefault(); const c = parseCard($('#b-card-in').value);
      if (!c) { $('#b-err').textContent = 'That doesn’t look like a score card. It should start with CARD-.'; return; }
      const list = friends().filter(f => f.name.toLowerCase() !== c.name.toLowerCase()); list.push(c); set(FRIENDS, JSON.stringify(list));
      S().sound('match'); S().toast(`${c.name} added to your leaderboard.`); boardPage();
    });
    window.Account?.onlineBoard?.();
  }

  async function copy(text, btn) {
    try { await navigator.clipboard.writeText(text); btn.textContent = 'Copied ✓'; S().sound('select'); }
    catch (e) {
      const el = document.createElement('textarea'); el.value = text; document.body.appendChild(el); el.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (_) { } el.remove();
      btn.textContent = ok ? 'Copied ✓' : 'Select & copy the code above';
    }
    setTimeout(() => { if (btn.isConnected) btn.textContent = btn.dataset.label || 'Copy'; }, 2200);
  }

  document.addEventListener('submit', e => {
    if (e.target.id !== 'd-their') return; e.preventDefault();
    const r = parseResult($('#d-their-code').value), code = (S().page === 'duel' && document.querySelector('.duel-big')?.textContent) || '';
    if (!r) { $('#d-err').textContent = 'That isn’t a result code. It should look like DUEL-' + code + '-Name-0110101101-95.'; return; }
    if (r.code !== code) { $('#d-err').textContent = `That result is for duel ${r.code}, not ${code}.`; return; }
    const me = duels()[code].mine; duels()[code].them = r; S().save();
    if (me) { const win = me.score !== r.score ? me.score > r.score : me.secs !== r.secs ? me.secs < r.secs : null; S().sound(win === true ? 'duelwin' : win === false ? 'duellose' : 'complete'); }
    duelLobby(code);
  });

  window.Social = {
    modes: [['duel', 'Duel', 'Same 10 questions as a friend.', 'duel'], ['board', 'Leaderboard', 'Rank players and friends.', 'board']],
    mode(p) { if (p === 'duel') duelHome(); else if (p === 'board') boardPage(); else { stop(); return false; } return true; },
    handle(a, b) {
      if (!a.startsWith('d-') && !a.startsWith('b-')) return false;
      if (a === 'd-new') duelLobby(newCode($('#d-topic').value));
      else if (a === 'd-new-same') duelLobby(newCode(b.dataset.topic));
      else if (a === 'd-join') { const c = ($('#d-code').value || '').trim().toUpperCase(); if (!validCode(c)) duelHome('Codes are 6 characters, like AK7Q2X. Check it and try again.'); else duelLobby(c); }
      else if (a === 'd-open') duelLobby(b.dataset.code);
      else if (a === 'd-start') startDuel(b.dataset.code);
      else if (a === 'd-ans') answerDuel(+b.dataset.opt);
      else if (a === 'd-copy') { b.dataset.label = b.dataset.label || b.textContent; copy(b.dataset.text, b); }
      else if (a === 'b-sort') { sortKey = b.dataset.key; boardPage(); }
      else if (a === 'b-remove') { set(FRIENDS, JSON.stringify(friends().filter(f => f.name !== b.dataset.name))); boardPage(); }
      return true;
    },
    _duelSet: duelSet, _parseCard: parseCard, _parseResult: parseResult
  };
})();
