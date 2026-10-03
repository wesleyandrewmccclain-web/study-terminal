/* Fun modes: daily challenge (shareable), survival, lightning, spot-the-trap, achievements,
   unlockable looks (themes + POD colors), and campaign story text. */
(() => {
  'use strict';
  const S = () => window.Study, F = () => window.FUN_DATA || { traps: {}, bosses: {}, story: {} };
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const exam = () => Number(S().data?.exam || window.ACTIVE_EXAM || 2);
  const ek = () => String(exam());
  const shuffle = (a, r = Math.random) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const fun = () => { const st = S().state; st.fun = st.fun || {}; return st.fun; };
  const per = k => { const f = fun(); f[k] = f[k] || {}; f[k][ek()] = f[k][ek()] || {}; return f[k][ek()]; };
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dayBefore = s => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const fmtT = s => `${Math.floor(s / 60)}:${String(Math.max(0, Math.round(s % 60))).padStart(2, '0')}`;
  const mcPool = () => S().data.questions;
  const optsHTML = (q, order, answered, pick, act) => order.map((oi, k) => { let c = ''; if (answered) { if (oi === q.answer) c = 'correct'; else if (oi === pick) c = 'incorrect'; } return `<button class="option ${c}" data-action="${act}" data-opt="${oi}" ${answered ? 'disabled' : ''}><span class="letter">${'ABCD'[k]}</span><span>${esc(q.options[oi])}</span></button>`; }).join('');
  const topicName = id => S().data.topics.find(t => t.id === id)?.name || id;

  /* ================= Daily challenge ================= */
  function seed(str) { let h = 2166136261; for (const c of str) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function rng(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const dayNumber = d => Math.floor((new Date(d + 'T12:00:00') - new Date('2026-09-01T12:00:00')) / 864e5) + 1;
  function dailySet(d) { const r = rng(seed('mgt354-daily-' + ek() + '-' + d)); const pool = [...mcPool()].sort((a, b) => a.id < b.id ? -1 : 1); return shuffle(pool, r).slice(0, 5).map(q => ({ q, order: shuffle(q.options.map((_, i) => i), r) })); }
  let dy = null, dyTimer = 0;
  function dailyPage(msg) {
    S().setPage('daily'); clearInterval(dyTimer);
    const D = per('daily'), d = today(), done = D.results?.[d];
    $('#app').innerHTML = S().heading('PLAY / DAILY CHALLENGE', `Daily #${dayNumber(d)}`, 'Five questions, the same for everyone today. Your first try counts. Share your result with a friend.') +
      `<section class="panel daily-card">${done ? shareBlock(d, done) : `<p>New questions every day at midnight. Streak: <strong>${D.streak || 0}</strong> day${D.streak === 1 ? '' : 's'}.</p><button class="primary" data-action="dy-start">Play today’s challenge →</button>`}
      ${msg ? `<p class="source">${msg}</p>` : ''}</section>
      <section class="panel"><h2>Compare with a friend</h2><p>Paste the result they texted you.</p><div class="dy-compare"><input id="dy-friend" type="text" placeholder="Study Terminal Daily #30 …" autocomplete="off"><button data-action="dy-compare">Compare</button></div><div id="dy-cmp"></div></section>
      ${histHTML(D)}`;
  }
  const grid = bits => bits.map(b => b ? '🟩' : '🟥').join('');
  function shareText(d, r) { return `Study Terminal Daily #${dayNumber(d)} (Exam ${exam()}) ${r.score}/5 ${grid(r.bits)} ${fmtT(r.secs)}${r.streak > 1 ? ' 🔥' + r.streak : ''}`; }
  function shareBlock(d, r) { return `<div class="dy-result"><div class="dy-grid">${grid(r.bits)}</div><strong>${r.score}/5</strong><span>${fmtT(r.secs)} · streak ${r.streak} 🔥</span></div><code id="dy-share">${esc(shareText(d, r))}</code><div class="actions"><button class="primary" data-action="dy-copy">Copy result</button><button data-action="dy-practice">Replay for practice</button></div><p class="source">Next challenge at midnight.</p>`; }
  function histHTML(D) { const days = Object.keys(D.results || {}).sort().reverse().slice(0, 7); return days.length ? `<div class="section-line"><h2>THIS WEEK</h2></div><section class="panel dy-hist">${days.map(x => `<div><span>${x.slice(5)}</span><span>${grid(D.results[x].bits)}</span><strong>${D.results[x].score}/5</strong><span class="source">${fmtT(D.results[x].secs)}</span></div>`).join('')}</section>` : ''; }
  function dailyStart(practice) { dy = { set: dailySet(today()), i: 0, bits: [], t0: Date.now(), practice, answered: null }; dailyQ(); dyTimer = setInterval(() => { const c = $('#dy-clock'); if (c && dy) c.textContent = fmtT((Date.now() - dy.t0) / 1000); }, 500); }
  function dailyQ() {
    S().setPage('daily', false); const { q, order } = dy.set[dy.i];
    $('#app').innerHTML = S().heading(`DAILY #${dayNumber(today())}${dy.practice ? ' · PRACTICE' : ''} / ${dy.i + 1} OF 5`, 'Daily challenge', '', `<div class="timer" id="dy-clock">${fmtT((Date.now() - dy.t0) / 1000)}</div>`) +
      `<div class="dy-dots">${[0, 1, 2, 3, 4].map(i => `<i class="${i < dy.bits.length ? (dy.bits[i] ? 'ok' : 'bad') : i === dy.i ? 'now' : ''}"></i>`).join('')}</div><section class="question-card"><div class="source">${esc(topicName(q.topic))}</div><h2>${esc(q.prompt)}</h2><div class="options">${optsHTML(q, order, dy.answered, dy.answered?.pick, 'dy-ans')}</div>
      ${dy.answered ? `<div class="feedback ${dy.answered.ok ? 'good' : 'bad'}"><h3>${dy.answered.ok ? 'Correct' : 'Not quite'}</h3><p>${esc(q.explanation || '')}</p><button class="primary" data-action="dy-next">${dy.i < 4 ? 'Next →' : 'See result'}</button></div>` : ''}</section>`;
  }
  function dailyAnswer(pick) {
    if (!dy || dy.answered) return; const { q } = dy.set[dy.i], ok = pick === q.answer;
    dy.answered = { pick, ok }; dy.bits.push(ok); S().record(q.id, q.topic, ok); S().sound(ok ? 'correct' : 'incorrect'); dailyQ();
  }
  function dailyDone() {
    clearInterval(dyTimer); const secs = Math.round((Date.now() - dy.t0) / 1000), score = dy.bits.filter(Boolean).length, d = today(), D = per('daily');
    if (!dy.practice && !D.results?.[d]) {
      D.streak = D.last === dayBefore(d) ? (D.streak || 0) + 1 : 1; D.last = d; D.best = Math.max(D.best || 0, D.streak);
      D.results = D.results || {}; D.results[d] = { score, bits: dy.bits.map(Boolean), secs, streak: D.streak };
      const keys = Object.keys(D.results).sort(); while (keys.length > 30) delete D.results[keys.shift()];
      S().save(); S().sound(score >= 4 ? 'complete' : 'timer'); dy = null; checkBadges(); dailyPage();
    } else { dy = null; dailyPage(`Practice run: ${score}/5 in ${fmtT(secs)}. Only your first try each day counts.`); }
  }
  function parseShare(t) { const m = String(t || '').match(/Daily #(\d+)(?: \(Exam (\d)\))? (\d)\/5 ([🟩🟥]+) (\d+):(\d{2})/u); if (!m) return null; return { n: +m[1], exam: +(m[2] || 0), score: +m[3], grid: m[4], secs: +m[5] * 60 + +m[6] }; }

  /* ================= Survival & lightning ================= */
  let sv = null, svTimer = 0;
  function arcadePage() {
    S().setPage('arcade'); clearInterval(svTimer);
    const H = per('arcade');
    $('#app').innerHTML = S().heading('PLAY / ARCADE', 'Survival & Lightning', 'Quick games for short breaks. Every answer still counts toward your stats and review schedule.') +
      `<div class="arcade-grid"><section class="panel arcade-card"><span class="eyebrow">SURVIVAL</span><h2>Three lives</h2><p>Endless questions. The clock gets shorter as you go: 20 seconds at first, 8 seconds by question 25. Three misses and you’re out.</p><p class="arcade-best">Best: <strong>${H.survival || 0}</strong></p><button class="primary" data-action="sv-start" data-kind="survival">Start survival →</button></section>
      <section class="panel arcade-card"><span class="eyebrow">LIGHTNING</span><h2>60 seconds</h2><p>Answer as many as you can in one minute. A miss costs 3 seconds.</p><p class="arcade-best">Best: <strong>${H.lightning || 0}</strong></p><button class="primary" data-action="sv-start" data-kind="lightning">Start lightning →</button></section>
      <section class="panel arcade-card"><span class="eyebrow">SPOT THE TRAP</span><h2>Trap cards</h2><p>Two answers that look alike, one is the professor’s trap. Pick fast; a wrong pick ends the streak.</p><p class="arcade-best">Best streak: <strong>${H.traps || 0}</strong></p><button class="primary" data-action="tr-start">Start →</button></section></div>`;
  }
  function svStart(kind) {
    sv = { kind, pool: shuffle(mcPool()), i: 0, score: 0, lives: 3, t0: Date.now(), end: kind === 'lightning' ? Date.now() + 60000 : 0, answered: null };
    svQ(); clearInterval(svTimer); svTimer = setInterval(svTick, 100);
  }
  const svLimit = () => Math.max(8, 20 - Math.floor(sv.score / 2));
  function svQ() {
    const q = sv.pool[sv.i % sv.pool.length]; sv.order = shuffle(q.options.map((_, i) => i)); sv.answered = null; if (sv.kind === 'survival') sv.deadline = Date.now() + svLimit() * 1000;
    S().setPage('arcade', false);
    $('#app').innerHTML = S().heading(sv.kind === 'survival' ? 'SURVIVAL' : 'LIGHTNING', `Score ${sv.score}`, '', `<div class="timer" id="sv-clock"></div>`) +
      `<div class="sv-hud">${sv.kind === 'survival' ? `<span class="sv-lives">${'♥'.repeat(sv.lives)}<i>${'♥'.repeat(3 - sv.lives)}</i></span>` : ''}<span class="sv-bar"><i id="sv-bar"></i></span></div>
      <section class="question-card"><div class="source">${esc(topicName(q.topic))}</div><h2>${esc(q.prompt)}</h2><div class="options">${optsHTML(q, sv.order, false, null, 'sv-ans')}</div></section>`;
  }
  function svTick() {
    if (!sv || S().page !== 'arcade') { clearInterval(svTimer); return; }
    const c = $('#sv-clock'), bar = $('#sv-bar');
    if (sv.kind === 'lightning') { const left = (sv.end - Date.now()) / 1000; if (c) c.textContent = Math.max(0, left).toFixed(1) + 's'; if (bar) bar.style.width = Math.max(0, left / 60 * 100) + '%'; if (left <= 0) svOver(); }
    else if (!sv.answered) { const left = (sv.deadline - Date.now()) / 1000; if (c) c.textContent = Math.max(0, left).toFixed(1) + 's'; if (bar) bar.style.width = Math.max(0, left / svLimit() * 100) + '%'; if (left <= 0) svAnswer(-1); }
  }
  function svAnswer(pick) {
    if (!sv || sv.answered) return; const q = sv.pool[sv.i % sv.pool.length], ok = pick === q.answer; sv.answered = true;
    if (pick >= 0) S().record(q.id, q.topic, ok);
    document.querySelectorAll('[data-action="sv-ans"]').forEach(b => { b.disabled = true; const oi = +b.dataset.opt; if (oi === q.answer) b.classList.add('correct'); else if (oi === pick) b.classList.add('incorrect'); });
    if (ok) { sv.score++; S().sound('correct'); } else { S().sound('incorrect'); if (sv.kind === 'survival') sv.lives--; else sv.end -= 3000; }
    setTimeout(() => { if (!sv) return; if (sv.kind === 'survival' && sv.lives <= 0) return svOver(); sv.i++; svQ(); }, ok ? 350 : 1100);
  }
  function svOver() {
    clearInterval(svTimer); const H = per('arcade'), best = H[sv.kind] || 0, rec = sv.score > best; if (rec) H[sv.kind] = sv.score; S().save();
    S().sound(rec ? 'victory' : 'complete'); const kind = sv.kind, score = sv.score; sv = null; checkBadges(); S().setPage('arcade');
    $('#app').innerHTML = S().heading(kind === 'survival' ? 'SURVIVAL / GAME OVER' : 'LIGHTNING / TIME', `${score} correct`, rec ? 'New personal best.' : `Best: ${best}.`) + `<section class="panel"><div class="actions"><button class="primary" data-action="sv-start" data-kind="${kind}">Play again →</button><button data-action="mode" data-mode="arcade">Arcade</button></div></section>`;
  }

  /* ================= Spot the trap ================= */
  let tr = null;
  function trapStart() {
    const list = F().traps[exam()] || []; if (!list.length) { S().toast('No trap cards for this exam yet.'); return; }
    tr = { list: shuffle(list), i: 0, streak: 0, answered: null }; trapQ();
  }
  function trapQ() {
    const t = tr.list[tr.i % tr.list.length]; tr.sides = Math.random() < 0.5 ? ['a', 'b'] : ['b', 'a']; tr.answered = null; S().setPage('arcade', false);
    $('#app').innerHTML = S().heading('SPOT THE TRAP', `Streak ${tr.streak}`, 'One of these is the answer. The other is the trap.') +
      `<section class="question-card trap-card"><h2>${esc(t.q)}</h2><div class="trap-pick">${tr.sides.map(s => `<button data-action="tr-pick" data-side="${s}">${esc(t[s])}</button>`).join('')}</div><div id="tr-fb"></div></section>`;
  }
  function trapPick(side) {
    if (!tr || tr.answered) return; const t = tr.list[tr.i % tr.list.length], ok = side === 'a'; tr.answered = true; per('arcade').trapAt = Date.now();
    document.querySelectorAll('[data-action="tr-pick"]').forEach(b => { b.disabled = true; b.classList.add(b.dataset.side === 'a' ? 'correct' : 'incorrect'); });
    S().sound(ok ? 'correct' : 'incorrect');
    if (ok) { tr.streak++; tr.i++; const H = per('arcade'); if (tr.streak > (H.traps || 0)) { H.traps = tr.streak; S().save(); } setTimeout(() => tr && trapQ(), 700); }
    else { $('#tr-fb').innerHTML = `<div class="feedback bad"><h3>Trap sprung · streak ${tr.streak}</h3><p><strong>${esc(t.a)}.</strong> ${esc(t.why)}</p><div class="actions"><button class="primary" data-action="tr-start">Try again →</button><button data-action="mode" data-mode="arcade">Arcade</button></div></div>`; checkBadges(); }
  }

  /* ================= Achievements ================= */
  const learnItems = () => S().state.learning?.exams?.[ek()]?.items || {};
  const totalAnswers = () => Object.values(S().state.stats || {}).reduce((n, v) => n + (v.total || 0), 0);
  const BADGES = [
    ['first10', 'First steps', 'Answer 10 questions', () => totalAnswers() >= 10],
    ['century', 'Century', 'Answer 100 questions', () => totalAnswers() >= 100],
    ['fivehundred', 'Archive diver', 'Answer 500 questions', () => totalAnswers() >= 500],
    ['streak10', 'On a roll', '10 correct in a row', () => (S().state.best || 0) >= 10],
    ['streak25', 'Unbreakable', '25 correct in a row', () => (S().state.best || 0) >= 25],
    ['secure25', 'Long-term memory', '25 items secure (right on 3 separate days)', () => Object.values(learnItems()).filter(r => window.LearningModel?.status(r) === 'secure').length >= 25],
    ['boss1', 'First kill', 'Clear any boss', () => Object.keys(S().state.ops?.cleared || {}).length >= 1],
    ['allboss', 'Archive cleared', 'Clear every boss for this exam', () => { const pre = exam() === 3 ? 'e3:' : ''; return S().data.topics.every(t => S().state.ops?.cleared?.[pre + t.id]) && !!S().state.ops?.cleared?.[pre + 'all']; }],
    ['mockB', 'Solid B', 'Score 80%+ on a mock exam', () => (S().state.mocks?.[ek()] || []).some(m => m.pct >= 80)],
    ['mockA', 'Ready for the real one', 'Score 90%+ on a mock exam', () => (S().state.mocks?.[ek()] || []).some(m => m.pct >= 90)],
    ['written', 'Full credit', 'Hit every key point on a written answer', () => Object.entries(S().state.written?.[ek()] || {}).some(([id, r]) => { const w = window.BOOST_DATA?.written.find(x => x.id === id); return w && r.best >= w.points.length; })],
    ['lookup', 'Quick draw', 'Formula lookup: 8/10 under 6s average', () => { const l = S().state.lookup?.[ek()]; return !!l && l.bestScore >= 8 && l.bestAvg < 6000; }],
    ['daily3', 'Habit', '3-day daily challenge streak', () => (per('daily').best || 0) >= 3],
    ['daily7', 'Every single day', '7-day daily challenge streak', () => (per('daily').best || 0) >= 7],
    ['perfectday', 'Perfect day', '5/5 on a daily challenge', () => Object.values(per('daily').results || {}).some(r => r.score === 5)],
    ['survival20', 'Survivor', '20 in survival', () => (per('arcade').survival || 0) >= 20],
    ['lightning12', 'Lightning hands', '12 in a lightning round', () => (per('arcade').lightning || 0) >= 12],
    ['traps15', 'Trap-proof', '15-streak on spot the trap', () => (per('arcade').traps || 0) >= 15]
  ];
  function checkBadges(quiet) {
    if (!S()?.state) return; const got = fun().badges = fun().badges || {}; const fresh = [];
    for (const [id, name, , test] of BADGES) { const key = ek() + ':' + id; if (!got[key]) { let ok = false; try { ok = test(); } catch (e) { } if (ok) { got[key] = Date.now(); fresh.push(name); } } }
    if (fresh.length) { S().save(); if (!quiet) { S().toast('Achievement unlocked: ' + fresh.join(', ')); S().sound('rankup'); } }
    return fresh;
  }

  /* ================= Looks: themes + POD colors ================= */
  const THEMES = [['field', 'Field', 'The standard green terminal.', 0], ['paper', 'Resistance paper', 'Warm parchment and ink, like the original theme.', 120], ['dusk', 'Night ops', 'A dark interface for late-night studying.', 300], ['signal', 'Signal amber', 'Dark with amber readouts.', 550], ['archive', 'Archive white', 'High-contrast black on white.', 900]];
  const PODS = [['olive', 'Olive', 0, 0], ['rust', 'Rust', 60, 150], ['slate', 'Slate', 120, 180], ['violet', 'Violet', 250, 300], ['gold', 'Gold', 500, 40]];
  const xp = () => S().state.ops?.xp || 0;
  function applyLook() {
    const f = fun(), th = THEMES.find(t => t[0] === f.theme && xp() >= t[3]) ? f.theme : 'field', pod = PODS.find(p => p[0] === f.pod && xp() >= p[2]) || PODS[0];
    document.body.dataset.skin = th; document.body.style.setProperty('--pod-hue', pod[3] + 'deg');
  }
  function badgesPage() {
    S().setPage('badges'); checkBadges(true); const got = fun().badges || {}, f = fun();
    const earned = BADGES.filter(b => got[ek() + ':' + b[0]]).length;
    $('#app').innerHTML = S().heading('PLAY / ACHIEVEMENTS', 'Achievements & looks', `${earned} of ${BADGES.length} achievements for Exam ${exam()}. XP unlocks new themes and POD colors. You have ${xp()} XP.`) +
      `<section class="panel"><div class="badge-grid">${BADGES.map(([id, name, desc]) => { const at = got[ek() + ':' + id]; return `<div class="badge ${at ? 'on' : ''}"><span class="badge-icon" aria-hidden="true">${at ? '★' : '☆'}</span><strong>${esc(name)}</strong><small>${esc(desc)}</small>${at ? `<em>${new Date(at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</em>` : ''}</div>`; }).join('')}</div></section>
      <div class="section-line"><h2>THEMES</h2></div><section class="panel"><div class="look-grid">${THEMES.map(([id, name, desc, need]) => `<button class="look ${(f.theme || 'field') === id ? 'on' : ''}" data-action="fx-theme" data-id="${id}" ${xp() < need ? 'disabled' : ''}><span class="swatch sw-${id}"></span><strong>${esc(name)}</strong><small>${xp() < need ? `Unlocks at ${need} XP` : esc(desc)}</small></button>`).join('')}</div></section>
      <div class="section-line"><h2>POD COLOR</h2></div><section class="panel"><div class="look-grid pods">${PODS.map(([id, name, need, hue]) => `<button class="look ${(f.pod || 'olive') === id ? 'on' : ''}" data-action="fx-pod" data-id="${id}" ${xp() < need ? 'disabled' : ''}><img src="assets/bot-helper.png" alt="" style="filter:hue-rotate(${hue}deg)"><strong>${esc(name)}</strong><small>${xp() < need ? `Unlocks at ${need} XP` : 'Unlocked'}</small></button>`).join('')}</div></section>`;
  }

  /* ================= Story (campaign) ================= */
  function storyFor(topicId, cleared) { const s = F().story[exam()]?.[topicId]; return s ? `<div class="story"><span class="story-ch">${esc(s.ch)}</span><p>${esc(cleared ? s.after : s.log)}</p></div>` : ''; }
  function storyFinal(cleared) { return storyFor('final', cleared); }

  /* ================= wiring ================= */
  window.Fun = {
    modes: [['daily', 'Daily challenge', 'Five questions a day, shareable result.', 'duel'], ['arcade', 'Arcade', 'Survival, lightning, and spot the trap.', 'assault'], ['badges', 'Achievements & looks', 'Badges, themes, and POD colors.', 'chips']],
    library: [['daily', 'Daily challenge', 'Five questions, the same for everyone today. Share your score.', 'duel', 'play', 'NEW EVERY DAY'], ['arcade', 'Arcade', 'Survival, 60-second lightning, and spot the trap.', 'assault', 'play', 'QUICK GAMES'], ['badges', 'Achievements & looks', 'Earn badges and unlock themes and POD colors with XP.', 'chips', 'play', 'UNLOCKS']],
    bossLines: id => F().bosses[id], storyFor, storyFinal, checkBadges, applyLook,
    homeHTML() {
      const D = per('daily'), r = D.results?.[today()];
      return `<button class="daily-strip" data-action="mode" data-mode="daily"><span class="daily-strip-icon" aria-hidden="true">◈</span><span><strong>Daily #${dayNumber(today())}</strong><small>${r ? `${grid(r.bits)} ${r.score}/5 · come back tomorrow` : 'Five questions, the same for everyone today'}</small></span><span class="daily-strip-streak">${D.streak && (D.last === today() || D.last === dayBefore(today())) ? '🔥 ' + D.streak : r ? 'Done' : 'Play →'}</span></button>`;
    },
    mode(p) {
      if (p === 'daily') { dailyPage(); return true; }
      if (p === 'arcade') { arcadePage(); return true; }
      if (p === 'badges') { badgesPage(); return true; }
      return false;
    },
    handle(a, b) {
      if (!/^(dy|sv|tr|fx)-/.test(a)) { if (a === 'mode' || a === 'home') { clearInterval(dyTimer); clearInterval(svTimer); sv = null; tr = null; } return false; }
      if (a === 'dy-start') dailyStart(false);
      else if (a === 'dy-practice') dailyStart(true);
      else if (a === 'dy-ans') dailyAnswer(+b.dataset.opt);
      else if (a === 'dy-next') { dy.answered = null; if (++dy.i < 5) dailyQ(); else dailyDone(); }
      else if (a === 'dy-copy') { const t = $('#dy-share')?.textContent || ''; navigator.clipboard?.writeText(t).then(() => S().toast('Copied. Text it to your friend.')).catch(() => { const r = document.createRange(); r.selectNodeContents($('#dy-share')); getSelection().removeAllRanges(); getSelection().addRange(r); S().toast('Select and copy the result.'); }); }
      else if (a === 'dy-compare') {
        const them = parseShare($('#dy-friend').value), mine = per('daily').results?.[today()], box = $('#dy-cmp');
        if (!them) { box.innerHTML = '<p class="pf-error">That doesn’t look like a daily result. It starts with “Study Terminal Daily #”.</p>'; return true; }
        if (them.n !== dayNumber(today())) { box.innerHTML = `<p class="source">That’s Daily #${them.n}. Today is #${dayNumber(today())}.</p>`; return true; }
        if (!mine) { box.innerHTML = `<p>They got ${them.score}/5 in ${fmtT(them.secs)}. Play today’s challenge to compare.</p>`; return true; }
        const win = mine.score !== them.score ? mine.score > them.score : mine.secs < them.secs;
        box.innerHTML = `<div class="dy-vs"><div><span class="eyebrow">YOU</span><div>${grid(mine.bits)}</div><strong>${mine.score}/5</strong><small>${fmtT(mine.secs)}</small></div><div><span class="eyebrow">FRIEND</span><div>${them.grid}</div><strong>${them.score}/5</strong><small>${fmtT(them.secs)}</small></div></div><p class="dy-verdict">${mine.score === them.score && mine.secs === them.secs ? 'Dead even.' : win ? 'You win today.' : 'They win today. Rematch tomorrow.'}</p>`;
      }
      else if (a === 'sv-start') svStart(b.dataset.kind);
      else if (a === 'sv-ans') svAnswer(+b.dataset.opt);
      else if (a === 'tr-start') trapStart();
      else if (a === 'tr-pick') trapPick(b.dataset.side);
      else if (a === 'fx-theme') { fun().theme = b.dataset.id; S().save(); applyLook(); badgesPage(); }
      else if (a === 'fx-pod') { fun().pod = b.dataset.id; S().save(); applyLook(); badgesPage(); }
      return true;
    },
    init() { applyLook(); checkBadges(true); setInterval(() => { if (document.visibilityState === 'visible') checkBadges(); }, 20000); }
  };
})();
