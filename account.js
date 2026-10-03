/* Accounts (username + PIN) on top of cloud sync, plus the things a shared database makes possible:
   an online leaderboard, friends' daily-challenge results, and live duels without Claude links.
   Everything here is optional: without cloud set up, the game works exactly as before. */
(() => {
  'use strict';
  const S = () => window.Study, Y = () => window.SyncUI;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ready = () => !!(Y()?.hasProject?.());
  const acct = () => Y()?.cfg?.().account || null;
  const exam = () => Number(S().data?.exam || window.ACTIVE_EXAM || 2);
  const ek = () => String(exam());
  const todayKey = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const fmtT = s => `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, '0')}`;
  let busy = false;

  /* ---------- account card on the Sync page ---------- */
  function cardHTML() {
    if (!ready()) return '';
    const a = acct();
    if (a) setTimeout(refreshMe, 0);
    if (a) return `<section class="panel acct-card is-on"><div class="acct-row"><span class="acct-avatar" aria-hidden="true">${esc(a.name[0] || '?').toUpperCase()}</span><div><span class="eyebrow">YOUR ACCOUNT</span><h2>${esc(a.name)}</h2><p class="source">Log in with the same username and PIN on your phone or any computer and your progress follows you.</p></div></div>
      <div class="acct-privacy"><label class="acct-switch"><input type="checkbox" id="acct-hidden" ${a.hidden ? 'checked' : ''}><span><strong>Hide me from the online leaderboard</strong><small>${a.hidden ? 'Hidden. Other players can’t see your name, scores or daily results.' : 'Others can see your name, XP, accuracy and daily results.'}</small></span></label></div>
      <div class="actions"><button data-action="acct-board">Online leaderboard</button><button class="text-button" data-action="acct-logout">Log out on this device</button><button class="text-button danger" data-action="acct-del">Delete my account…</button></div>
      <div id="acct-del-box"></div><p class="pf-error" id="acct-err" role="alert"></p></section>`;
    return `<section class="panel acct-card"><span class="eyebrow">ACCOUNT</span><h2>Log in to sync everywhere</h2><p>One username and PIN for every device. Your progress stays on this device and merges into your account.</p>
      <form class="acct-form" id="acct-form" autocomplete="on"><label class="field">Username<input id="acct-user" name="username" autocomplete="username" autocapitalize="none" spellcheck="false" maxlength="20" placeholder="wesley"></label>
      <label class="field">PIN or password (6+ characters)<input id="acct-pin" name="password" type="password" autocomplete="current-password" minlength="6" maxlength="64"></label>
      <div class="actions"><button class="primary" type="submit" data-mode="login">Log in</button><button type="submit" data-mode="create">Create account</button></div><p class="pf-error" id="acct-err" role="alert"></p></form>
      <p class="source">Your friend makes their own account on their device. Progress never mixes between accounts.</p></section>`;
  }
  async function submit(mode) {
    if (busy) return; const u = $('#acct-user').value.trim(), pin = $('#acct-pin').value, err = $('#acct-err');
    if (!/^[A-Za-z0-9_.-]{3,20}$/.test(u)) { err.textContent = 'Usernames are 3–20 letters, numbers, dots, dashes or underscores.'; return; }
    if (pin.length < 6) { err.textContent = 'Use a PIN or password of at least 6 characters.'; return; }
    busy = true; err.textContent = mode === 'create' ? 'Creating your account…' : 'Logging in…';
    try {
      let key, name = u, hidden = false;
      if (mode === 'create') key = await Y().rpc('create_account', { u, pin, existing_key: Y().cfg().cloudKey || null });
      else { const r = await Y().rpc('login', { u, pin }); if (!r?.ok) throw Error(r?.error || 'Wrong username or PIN.'); key = r.key; name = r.name || u; hidden = !!r.hidden; }
      const prev = Y().cfg().cloudKey;
      Y().setCfg({ cloudKey: key, account: { name, hidden } });
      if (prev !== key) Y().forgetCloudBase();
      try { const p = window.Profiles?.current?.(); if (p && /^guest$/i.test(p.name) && window.Profiles.rename) window.Profiles.rename(p.id, name); } catch (e) { }
      await Y().syncNow('account');
      S().sound('complete');
      Y().open(mode === 'create' ? `Account <strong>${esc(name)}</strong> created. Log in with it on your phone to pick up where you left off.` : `Logged in as <strong>${esc(name)}</strong>. Your progress here was merged with your account.`);
    } catch (e) { err.textContent = e.message || 'Something went wrong. Check your connection.'; S().sound('error'); }
    busy = false; Y().paintPill?.();
  }
  document.addEventListener('submit', e => { if (e.target.id !== 'acct-form') return; e.preventDefault(); submit(e.submitter?.dataset.mode || 'login'); });
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-action^="acct-"]'); if (!b) return; e.stopPropagation();
    if (b.dataset.action === 'acct-logout') { signOut(); Y().open('Logged out on this device. Your progress here stays; your account keeps everything that synced.'); Y().paintPill?.(); }
    if (b.dataset.action === 'acct-board') S().mode('board');
    if (b.dataset.action === 'acct-del') { const box = $('#acct-del-box'); box.innerHTML = `<div class="acct-danger"><h3>Delete ${esc(acct().name)} for good?</h3><p>This removes your account, your leaderboard scores, your duels and the cloud copy of your progress. Progress saved on each device stays there. This can’t be undone.</p><label class="field">Type your PIN to confirm<input id="acct-del-pin" type="password" autocomplete="current-password" maxlength="64"></label><div class="actions"><button data-action="acct-del-no">Keep my account</button><button class="reset-go" data-action="acct-del-go">Delete forever</button></div></div>`; $('#acct-del-pin').focus(); }
    if (b.dataset.action === 'acct-del-no') { $('#acct-del-box').innerHTML = ''; }
    if (b.dataset.action === 'acct-del-go') delAccount();
  }, true);
  document.addEventListener('change', e => { if (e.target.id === 'acct-hidden') setHidden(e.target.checked); });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'acct-del-pin') { e.preventDefault(); delAccount(); } });

  function signOut() { Y().setCfg({ cloudKey: '', account: null }); Y().forgetCloudBase(); lastSent = ''; }
  async function setHidden(h) {
    const box = $('#acct-hidden'), err = $('#acct-err'); if (box) box.disabled = true;
    try { const v = await Y().rpc('set_hidden', { k: Y().cfg().cloudKey, h }); Y().setCfg({ account: { ...acct(), hidden: !!v } }); S().toast(v ? 'You’re hidden from the online leaderboard.' : 'You’re back on the online leaderboard.'); Y().open(); }
    catch (e) { if (box) { box.checked = !h; box.disabled = false; } if (err) err.textContent = 'Couldn’t change that: ' + e.message; }
  }
  async function delAccount() {
    if (busy) return; const pin = $('#acct-del-pin')?.value || '', err = $('#acct-err'), a = acct(); if (!a) return;
    if (!pin) { err.textContent = 'Type your PIN to confirm.'; return; }
    busy = true; err.textContent = 'Deleting…';
    try {
      const r = await Y().rpc('delete_account', { u: a.name, pin });
      if (!r?.ok) throw Error(r?.error || 'Couldn’t delete the account.');
      signOut(); S().sound('complete');
      Y().open(`Account <strong>${esc(a.name)}</strong> deleted. Your progress on this device is still here. Log out on your other devices too.`);
    } catch (e) { err.textContent = e.message; S().sound('error'); }
    busy = false; Y().paintPill?.();
  }
  /* Keep the hidden switch (and a deletion done on another device) in step. */
  let lastCheck = 0;
  async function refreshMe(force) {
    if (!acct() || !ready() || (!force && Date.now() - lastCheck < 10000)) return; lastCheck = Date.now();
    try {
      const me = await Y().rpc('account_me', { k: Y().cfg().cloudKey });
      if (!me) { signOut(); Y().open('That account was deleted, so this device is logged out. Your progress here is still saved.'); return; }
      if (!!me.hidden !== !!acct().hidden) { Y().setCfg({ account: { ...acct(), hidden: !!me.hidden } }); if ($('#acct-hidden')) Y().open(); }
    } catch (e) { }
  }

  /* ---------- scores → leaderboard ---------- */
  let lastPost = 0, lastSent = '', trail = null;
  function myScore() {
    const st = S().state, topics = S().data.topics.map(t => t.id), stats = topics.map(t => st.stats?.[t] || { total: 0, correct: 0 });
    const answers = stats.reduce((n, s) => n + s.total, 0), correct = stats.reduce((n, s) => n + s.correct, 0);
    const pre = exam() === 3 ? 'e3:' : '', bosses = Object.keys(st.ops?.cleared || {}).filter(k => pre ? k.startsWith(pre) : !k.includes(':')).length;
    const D = st.fun?.daily?.[ek()] || {}, d = D.results?.[todayKey()];
    return { xp: st.ops?.xp || 0, answers, accuracy: answers ? Math.round(correct / answers * 100) : 0, mock_best: Math.max(0, ...(st.mocks?.[ek()] || []).map(m => m.pct)), bosses,
      daily_streak: D.streak || 0, daily_day: d ? todayKey() : null, daily_score: d ? d.score : null, daily_secs: d ? d.secs : null, daily_grid: d ? d.bits.map(b => b ? '🟩' : '🟥').join('') : null };
  }
  // Post only when the score changed; at most every 10 s, with a trailing post so the latest score always lands.
  async function afterSync(force) {
    if (!acct() || !ready()) return;
    const s = myScore(), sig = exam() + JSON.stringify(s) + Y().cfg().cloudKey;
    if (sig === lastSent) return;
    const wait = 10000 - (Date.now() - lastPost);
    if (wait > 0 && !force) { clearTimeout(trail); trail = setTimeout(() => afterSync(), wait); return; }
    lastPost = Date.now(); lastSent = sig;
    try { await Y().rpc('post_score', { k: Y().cfg().cloudKey, ex: exam(), s }); } catch (e) { lastSent = ''; }
  }
  async function board() { return (await Y().rpc('get_leaderboard', { ex: exam() })) || []; }

  /* Online leaderboard: injected at the top of the Leaderboard page. */
  async function onlineBoard() {
    if (!ready()) return; const app = $('#app'); if (!app) return;
    const box = document.createElement('section'); box.className = 'panel online-board'; box.innerHTML = '<span class="eyebrow">ONLINE</span><h2>Everyone, Exam ' + exam() + '</h2><p class="source">Loading…</p>';
    app.querySelector('.page-heading')?.after(box);
    if (!acct()) { box.innerHTML = '<span class="eyebrow">ONLINE</span><h2>Online leaderboard</h2><p>Log in under <button class="text-button" data-action="sync-open">Sync devices</button> to see everyone who plays, across every device.</p>'; return; }
    try {
      await afterSync(true).catch(() => { }); const rows = await board(), me = acct().name.toLowerCase();
      box.innerHTML = `<span class="eyebrow">ONLINE · LIVE</span><h2>Everyone, Exam ${exam()}</h2>${acct().hidden ? '<p class="source">You’re hidden, so you’re not on this list. Change it under <button class="text-button" data-action="sync-open">Sync devices</button>.</p>' : ''}<div class="table-wrap"><table class="ws board"><thead><tr><th>#</th><th>Player</th><th>XP</th><th>Accuracy</th><th>Answers</th><th>Best mock</th><th>Bosses</th><th>Streak</th></tr></thead><tbody>${rows.map((r, i) => `<tr class="${r.name.toLowerCase() === me ? 'board-me' : ''}"><td class="board-pos">${i + 1}</td><td><b>${esc(r.name)}</b>${r.name.toLowerCase() === me ? ' <em>you</em>' : ''}</td><td>${r.xp}</td><td>${r.answers ? r.accuracy + '%' : '—'}</td><td>${r.answers}</td><td>${r.mock_best ? r.mock_best + '%' : '—'}</td><td>${r.bosses}</td><td>${r.daily_streak ? '🔥 ' + r.daily_streak : '—'}</td></tr>`).join('') || '<tr><td colspan="8">No one yet. Play a round and you’re first.</td></tr>'}</tbody></table></div>`;
    } catch (e) { box.querySelector('.source').textContent = 'Couldn’t load the online board: ' + e.message; }
  }
  /* Friends' daily results: injected on the Daily challenge page. */
  async function dailyFriends() {
    if (!ready() || !acct()) return; const app = $('#app'); if (!app) return;
    const box = document.createElement('section'); box.className = 'panel online-board'; box.innerHTML = '<h2>Today’s results</h2><p class="source">Loading…</p>';
    app.querySelector('.daily-card')?.after(box);
    try {
      await afterSync(true).catch(() => { }); const t = todayKey(), me = acct().name.toLowerCase();
      const rows = (await board()).filter(r => r.daily_day === t).sort((a, b) => b.daily_score - a.daily_score || a.daily_secs - b.daily_secs);
      box.innerHTML = `<h2>Today’s results</h2>${rows.length ? `<div class="dy-hist">${rows.map((r, i) => `<div class="${r.name.toLowerCase() === me ? 'board-me' : ''}"><span>${i + 1}. ${esc(r.name)}</span><span>${esc(r.daily_grid || '')}</span><strong>${r.daily_score}/5</strong><span class="source">${fmtT(r.daily_secs || 0)}</span></div>`).join('')}</div>` : '<p class="source">Nobody has played today’s challenge yet.</p>'}`;
    } catch (e) { box.querySelector('.source').textContent = 'Couldn’t load results: ' + e.message; }
  }

  /* ---------- live duels over the cloud (used when there’s no Claude room) ---------- */
  const duelSet = (code, state) => Y().rpc('duel_set', { k: Y().cfg().cloudKey, c: code, st: state });
  const duelGet = async code => ((await Y().rpc('duel_get', { c: code })) || []).filter(r => r.name.toLowerCase() !== (acct()?.name || '').toLowerCase());

  window.Account = {
    cardHTML, afterSync, onlineBoard, refreshMe, dailyFriends,
    get available() { return ready() && !!acct(); },
    get name() { return acct()?.name || null; },
    duelSet, duelGet
  };
})();
