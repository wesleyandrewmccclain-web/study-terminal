/* Navigation: four hubs (Learn · Practice & test · Play · Progress), a phone tab bar, a back button and
   "you are here" label on every page, quick search (/ or Ctrl+K), "jump back in", and phone/browser Back support.
   Every activity in the game is listed once in REG below, so the hubs, search, and breadcrumbs agree. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const exam = () => Number(S()?.data?.exam || window.ACTIVE_EXAM || 2);
  const LS = { get(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } } };

  const THEME_KEY = 'mgt354-theme';
  const applyTheme = t => { if (t === 'light' || t === 'dark') document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme; };
  try { applyTheme(localStorage.getItem(THEME_KEY)); } catch (e) { }
  const HUBS = {
    'h-learn': { name: 'Learn', long: 'Learn it', icon: '◎', blurb: 'Get it into your head: cards, cues, formulas, and audio.' },
    'h-practice': { name: 'Practice', long: 'Practice & test', icon: '✓', blurb: 'Answer questions and work problems, then test yourself under exam conditions.' },
    'h-play': { name: 'Play', long: 'Play', icon: '◆', blurb: 'Study disguised as games: quick modes, boss battles, and friends.' },
    'h-progress': { name: 'Progress', long: 'Progress', icon: '▲', blurb: 'How ready you are, by topic, plus sync and backups.' }
  };
  // [id, name, description, hub, section, search keywords]
  const REG = [
    ['flash', 'Flashcards', 'Recall it, flip it, bring back the tricky ones.', 'h-learn', 'learn', 'cards memorize terms definitions recall'],
    ['cue', 'Cue match', 'Match the wording of a question to the concept it points to.', 'h-learn', 'learn', 'clue keywords match'],
    ['listen', 'Listen mode', 'Hands-free: cards read aloud.', 'h-learn', 'learn', 'audio read aloud walk drive'],
    ['lookup', 'Formula lookup', 'Practice finding the right formula on your sheet fast.', 'h-learn', 'learn', 'formula sheet find section'],
    ['cram', 'Cram sheet', 'Formulas, cues, and your weak spots on one page.', 'h-learn', 'learn', 'summary review last minute'],
    ['cheat', 'Cheat sheet', 'Exam 3 on one printable page.', 'h-learn', 'learn', 'print formula sheet notes summary one page'],
    ['search', 'Search your notes', 'Find any term, question, card, or cue.', 'h-learn', 'learn', 'find lookup term'],
    ['missions', 'Study missions', '5, 10, or 20 minutes, mixed to what you need next.', 'h-practice', 'practice', 'session adaptive mix start'],
    ['mistakes', 'Mistakes notebook', 'Everything you’ve missed, with the answer and why.', 'h-practice', 'practice', 'missed wrong errors notebook review'],
    ['review', 'Review queue', 'Items that are due for another look.', 'h-practice', 'practice', 'due spaced repetition'],
    ['quiz', 'Quick quiz', 'Ten questions with instant feedback.', 'h-practice', 'practice', 'multiple choice questions'],
    ['math', 'Math Lab', 'Worked problems with new numbers every time.', 'h-practice', 'practice', 'calculations formulas tax compa net pay generator'],
    ['written', 'Written answers', 'Short answers and essays, checked against the key points.', 'h-practice', 'practice', 'essay short answer writing'],
    ['drill', 'Weak-spot drill', 'Your misses plus your weakest topic.', 'h-practice', 'practice', 'missed mistakes weak'],
    ['scenarios', 'Scenarios', 'Apply the ideas to cases.', 'h-practice', 'practice', 'cases application'],
    ['sheet', 'Worksheet', 'Build pay tables step by step.', 'h-practice', 'practice', 'pay grade table walkthrough'],
    ['crsheet', 'Compa-ratio worksheet', 'The 10/5 compa-ratio exercise, cell by cell.', 'h-practice', 'practice', 'compa ratio exercise worksheet midpoint market'],
    ['mock', 'Mock exam', 'The real format, with a predicted grade.', 'h-practice', 'test', 'practice test grade predicted'],
    ['exam', 'Exam simulation', 'A timed full-length run.', 'h-practice', 'test', 'timed test'],
    ['mathexam', 'Math-only exam', 'Timed word problems, new numbers.', 'h-practice', 'test', 'timed math calculations'],
    ['daily', 'Daily challenge', 'Five questions, the same for everyone today.', 'h-practice', 'test', 'daily share streak'],
    ['games', 'Game modes', 'Sort it, find the mistake, build the paycheck, and more.', 'h-play', 'play', 'sort order swipe memory paycheck mistake odd'],
    ['arcade', 'Arcade', 'Survival, 60-second lightning, and spot the trap.', 'h-play', 'play', 'survival lightning trap'],
    ['assault', 'Boss battles', 'Answer to fire. Clear every boss.', 'h-play', 'play', 'assault boss battle combat'],
    ['campaign', 'Campaign', 'Practice, checkpoints, and a boss for each topic.', 'h-play', 'play', 'story chapters map'],
    ['duel', 'Duel a friend', 'Same 10 questions, live or by code.', 'h-play', 'friends', 'friend multiplayer versus'],
    ['board', 'Leaderboard', 'You vs everyone, online and on this device.', 'h-play', 'friends', 'ranking scores friends online'],
    ['chips', 'Chips & rank', 'Spend XP on upgrades.', 'h-play', 'extras', 'xp upgrades rank'],
    ['badges', 'Achievements & looks', 'Badges and POD colors.', 'h-play', 'extras', 'themes colors unlock'],
    ['plan', 'Study plan', 'A few tasks a day until the exam.', 'h-progress', 'progress', 'schedule countdown tasks'],
    ['progress', 'Detailed stats & backups', 'Every score, export, or reset.', 'h-progress', 'progress', 'stats export backup reset history'],
    ['sync', 'Sync & account', 'Log in to sync your phone and laptop.', 'h-progress', 'progress', 'account login cloud phone laptop'],
    ['install', 'Phone & offline', 'Install the game, use it offline.', 'h-progress', 'progress', 'install app offline'],
    ['library', 'Everything A–Z', 'Every activity in one list.', 'h-progress', 'progress', 'all activities list']
  ];
  const byId = Object.fromEntries(REG.map(r => [r[0], r]));
  const available = id => (id !== 'sheet' || (!!window.Worksheet && exam() !== 3)) && (id !== 'cheat' || exam() === 3) && (id !== 'crsheet' || (exam() === 3 && !!window.CRSheet));
  const hubOf = page => { if (!page || page === 'home') return null; if (HUBS[page]) return page; if (/^g-/.test(page)) return 'h-play'; return byId[page]?.[3] || null; };
  const nameOf = page => HUBS[page]?.long || byId[page]?.[1] || (window.Games?.library || []).find(x => x[0] === page)?.[1] || null;

  /* ---------- badges shown on hub cards ---------- */
  function badge(id) {
    const st = S().state;
    try {
      if (id === 'review') { const n = window.Learning?.summary?.().due || 0; return n ? `${n} due` : ''; }
      if (id === 'mistakes') { const n = st.missed?.length || 0; return n ? `${n} to review` : ''; }
      if (id === 'daily') { const d = st.fun?.daily?.[String(exam())]?.results; const t = new Date(), k = `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`; return d?.[k] ? 'Done today' : 'New today'; }
      if (id === 'mock') { const m = st.mocks?.[String(exam())] || []; return m.length ? `Best ${Math.max(...m.map(x => x.pct))}%` : ''; }
      if (id === 'games') { const g = st.games?.[String(exam())] || {}; const n = Object.values(g).filter(x => x.plays).length; return n ? `${n}/7 played` : '7 games'; }
    } catch (e) { }
    return '';
  }
  const card = (id, extra = '') => { const r = byId[id]; if (!r || !available(id)) return ''; const b = badge(id);
    return `<div class="hub-item"><button class="hub-main" data-action="mode" data-mode="${id}"><strong>${esc(r[1])}</strong><span>${esc(r[2])}</span>${b ? `<em>${esc(b)}</em>` : ''}</button>${extra}</div>`; };
  const section = (title, note, html) => html ? `<div class="hub-sec"><div class="hub-sec-head"><h2>${esc(title)}</h2>${note ? `<span>${esc(note)}</span>` : ''}</div><div class="hub-list">${html}</div></div>` : '';
  const ids = sec => REG.filter(r => r[4] === sec).map(r => r[0]);

  /* ---------- hub pages ---------- */
  function hubPage(h) {
    S().setPage(h); const H = HUBS[h];
    let body = '';
    if (h === 'h-learn') body = section('Learn it', 'Start here if it’s new to you', ids('learn').map(id => card(id)).join(''));
    if (h === 'h-practice') body = section('Practice it', 'Feedback after every answer', ids('practice').map(id => card(id)).join('')) +
      section('Test yourself', 'Exam conditions', card('mock') + card('exam', `<button class="hub-sub" data-action="mode" data-mode="mathexam">Math-only version →</button>`) + card('daily'));
    if (h === 'h-play') {
      const g = (window.Games?.library || []).filter(x => /^g-/.test(x[0])).map(x => `<button class="hub-chip" data-action="mode" data-mode="${x[0]}">${esc(x[1])}</button>`).join('');
      body = section('Quick games', 'A few minutes each', card('games', g ? `<div class="hub-chips">${g}</div>` : '') + card('arcade') + card('daily')) +
        section('Battles', '', card('assault') + card('campaign')) +
        section('With friends', '', `<div class="hub-item"><div class="hub-main static"><strong>Duel or compare</strong><span>Race a friend on the same 10 questions, or see who’s ahead.</span></div><div class="hub-two"><button data-action="mode" data-mode="duel">Duel a friend →</button><button data-action="mode" data-mode="board">Leaderboard →</button></div></div>`) +
        section('Unlocks', '', card('chips') + card('badges'));
    }
    if (h === 'h-progress') body = progressBody();
    $('#app').innerHTML = S().heading('', H.long, H.blurb) + body;
  }
  function progressBody() {
    const s = S().state, d = S().data, dl = window.Plan?.daysLeft?.();
    const topics = `<section class="topic-section"><div class="section-heading"><h2>Your topics</h2><span class="section-note">Tap one to practice it</span></div><div class="topic-list">${d.topics.map(t => { const x = s.stats[t.id] || { correct: 0, total: 0 }, rate = x.total ? Math.round(x.correct / x.total * 100) : 0; return `<button class="topic-item" data-action="dash-topic" data-topic="${esc(t.id)}"><span class="topic-dot" aria-hidden="true"></span><span class="topic-title">${esc(t.name)}<small>${x.total ? x.total + ' ' + (x.total === 1 ? 'attempt' : 'attempts') : 'Not started yet'}</small></span><span class="topic-mini-track" aria-hidden="true"><i style="width:${rate}%"></i></span><span class="topic-rate">${x.total ? rate + '%' : '—'}</span><span aria-hidden="true">→</span></button>`; }).join('')}</div></section>`;
    return (window.Boost?.readinessHTML?.() || '') + topics +
      section('Plan & tools', dl != null && dl >= 0 ? `${dl === 0 ? 'Exam today' : dl + (dl === 1 ? ' day' : ' days') + ' to Exam ' + exam()}` : '', ['plan', 'progress', 'sync', 'install', 'library'].map(id => card(id)).join('')) +
      (window.pendingHTML?.('home') || '');
  }

  /* ---------- "you are here" + back ---------- */
  function crumbs() {
    const app = $('#app'), page = S()?.page; if (!app || !page || page === 'home') return;
    const first = app.firstElementChild; if (first?.classList.contains('crumbs')) return;
    const hub = hubOf(page), name = nameOf(page) || '', up = HUBS[page] ? 'home' : hub || 'home';
    const upName = up === 'home' ? 'Home' : HUBS[up].long;
    const el = document.createElement('nav'); el.className = 'crumbs'; el.setAttribute('aria-label', 'You are here');
    el.innerHTML = `<button class="crumb-back" data-action="hub-up" data-to="${up}">← ${esc(upName)}</button>${name && !HUBS[page] ? `<span class="crumb-here">${hub ? esc(HUBS[hub].long) + ' / ' : ''}<b>${esc(name)}</b></span>` : ''}`;
    app.prepend(el);
  }
  const go = to => { if (to === 'home') S().home(); else S().mode(to); };

  /* ---------- phone & browser Back ---------- */
  let popping = false, lastPage = null;
  function onPage(page) {
    renderTabs(page);
    if (page && byId[page] && !HUBS[page] && !['progress', 'sync', 'install', 'library', 'plan', 'search'].includes(page)) LS.set('mgt354-last-' + exam(), { id: page, at: Date.now() });
    if (/^g-/.test(page || '')) LS.set('mgt354-last-' + exam(), { id: page, at: Date.now() });
    if (page === lastPage) return; lastPage = page;
    if (popping) { popping = false; return; }
    try { if (history.state?.page !== page) history.pushState({ page }, ''); } catch (e) { }
  }
  window.addEventListener('popstate', e => {
    const p = e.state?.page; if (!p || !S()) return;
    popping = true;
    // Go back to the page itself if it's a place you can open directly; otherwise to its hub.
    if (p === 'home') S().home(); else if (HUBS[p] || byId[p] || /^g-/.test(p) || p === 'games') S().mode(p); else go(hubOf(p) || 'home');
  });

  /* ---------- phone tab bar ---------- */
  function renderTopNav(page) {
    const bar = $('.topbar'); if (!bar) return; let nav = $('#topnav');
    if (!nav) { nav = document.createElement('nav'); nav.id = 'topnav'; nav.setAttribute('aria-label', 'Main sections'); bar.insertBefore(nav, $('.top-tools')); }
    const cur = page === 'home' ? 'home' : hubOf(page);
    nav.innerHTML = [['home', 'Home'], ...Object.entries(HUBS).map(([id, h]) => [id, h.name])].map(([id, n]) =>
      `<button data-action="${id === 'home' ? 'home' : 'mode'}" data-mode="${id}" ${cur === id ? 'aria-current="page" class="on"' : ''}>${n}</button>`).join('');
  }
  function tidyTopbar() {
    // Course picker lives in the top bar now (the sidebar is gone); Settings becomes a sound icon.
    const tools = $('.top-tools'), pick = $('.exam-pick');
    if (tools && pick && !tools.contains(pick)) tools.insertBefore(pick, $('#vol-wrap') || $('#player-chip') || null);
    const vb = $('#vol-btn'); if (vb && !vb.dataset.tidy) { vb.dataset.tidy = '1'; vb.innerHTML = '<span aria-hidden="true">♪</span>'; vb.setAttribute('aria-label', 'Sound settings'); }
    const pop = $('#vol-pop'); if (pop && !$('#appearance')) {
      let cur = 'auto'; try { cur = localStorage.getItem(THEME_KEY) || 'auto'; } catch (e) { }
      const box = document.createElement('div'); box.id = 'appearance'; box.innerHTML = `<span class="ap-label">Appearance</span><div class="ap-seg" role="group" aria-label="Appearance">${[['auto', 'Auto'], ['light', 'Light'], ['dark', 'Dark']].map(([v, n]) => `<button data-action="hub-theme" data-v="${v}" aria-pressed="${v === cur}">${n}</button>`).join('')}</div>`;
      pop.prepend(box);
    }
    const calc = $('#calc-top'); if (calc && !calc.dataset.tidy) { calc.dataset.tidy = '1'; calc.innerHTML = '<span aria-hidden="true">±</span>'; calc.setAttribute('aria-label', 'Calculator'); calc.title = 'Calculator'; }
  }
  function renderTabs(page) {
    renderTopNav(page);
    let bar = $('#tabbar');
    if (!bar) { bar = document.createElement('nav'); bar.id = 'tabbar'; bar.setAttribute('aria-label', 'Main sections'); document.body.appendChild(bar); document.body.classList.add('has-tabbar'); }
    const cur = page === 'home' ? 'home' : hubOf(page);
    bar.innerHTML = [['home', 'Home', '⌂'], ...Object.entries(HUBS).map(([id, h]) => [id, h.name, h.icon])].map(([id, n, i]) =>
      `<button data-action="${id === 'home' ? 'home' : 'mode'}" data-mode="${id}" ${cur === id ? 'aria-current="page" class="on"' : ''}><span aria-hidden="true">${i}</span>${n}</button>`).join('');
  }

  /* ---------- jump back in (used on Home) ---------- */
  function jumpHTML() {
    const last = LS.get('mgt354-last-' + exam()), saved = S().hasSavedPractice?.();
    const n = last && nameOf(last.id);
    if (!n && !saved) return '';
    return `<div class="jump">${n ? `<button class="jump-card" data-action="mode" data-mode="${esc(last.id)}"><span class="eyebrow">JUMP BACK IN</span><strong>${esc(n)}</strong><small>${esc(HUBS[hubOf(last.id)]?.long || '')}</small><span aria-hidden="true">→</span></button>` : ''}${saved ? `<button class="jump-card" data-action="resume-study"><span class="eyebrow">UNFINISHED</span><strong>Resume your saved session</strong><small>Pick up on the question you left</small><span aria-hidden="true">→</span></button>` : ''}</div>`;
  }
  function hubTilesHTML() {
    return `<section class="hub-tiles" aria-label="Where to?">${Object.entries(HUBS).map(([id, h]) => `<button class="hub-tile" data-action="mode" data-mode="${id}"><span aria-hidden="true">${h.icon}</span><strong>${h.long}</strong><small>${esc(h.blurb)}</small></button>`).join('')}</section>`;
  }

  /* ---------- quick search ---------- */
  let qsSel = 0, qsHits = [];
  function openSearch() {
    if ($('#qs-modal')) return; window.NavUI?.closeDrawer?.(false);
    const m = document.createElement('div'); m.id = 'qs-modal'; m.setAttribute('role', 'dialog'); m.setAttribute('aria-modal', 'true'); m.setAttribute('aria-label', 'Search');
    m.innerHTML = `<div class="qs-box"><div class="qs-top"><span aria-hidden="true">⌕</span><input id="qs-in" type="search" autocomplete="off" placeholder="Search activities and your notes… (try “paycheck” or “COBRA”)" aria-label="Search"><button class="text-button" data-action="hub-search-close">Esc</button></div><div id="qs-out" class="qs-out"></div></div>`;
    document.body.appendChild(m); window.NavUI?.openDialog?.();
    const inp = $('#qs-in'); inp.addEventListener('input', () => runSearch(inp.value)); inp.addEventListener('keydown', qsKeys); inp.focus(); runSearch('');
    m.addEventListener('click', e => { if (e.target === m) closeSearch(); });
  }
  function closeSearch() { if (!$('#qs-modal')) return; $('#qs-modal').remove(); window.NavUI?.closeDialog?.(); }
  function runSearch(q) {
    const out = $('#qs-out'); if (!out) return; const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const has = t => words.every(w => String(t || '').toLowerCase().includes(w));
    const acts = [...REG.filter(r => available(r[0])).map(r => [r[0], r[1], r[2], r[3], r[5]]), ...(window.Games?.library || []).filter(x => /^g-/.test(x[0])).map(x => [x[0], x[1], x[2], 'h-play', 'game'])];
    // Best matches first: the activity's name, then its description, then its search keywords.
    const score = a => words.every(w => a[1].toLowerCase().includes(w)) ? 0 : words.every(w => (a[1] + ' ' + a[2]).toLowerCase().includes(w)) ? 1 : 2;
    qsHits = (words.length ? acts.filter(a => has(a[1] + ' ' + a[2] + ' ' + a[4])).sort((x, y) => score(x) - score(y)) : acts.filter(a => ['missions', 'quiz', 'flash', 'mock', 'games', 'math'].includes(a[0]))).slice(0, 7);
    qsSel = 0;
    const D = S().data, cards = words.length && q.trim().length > 1 ? D.flashcards.filter(c => has(c.front + ' ' + c.back)).slice(0, 4) : [];
    const qs = words.length && q.trim().length > 1 ? D.questions.filter(x => has(x.prompt + ' ' + x.options[x.answer])).slice(0, 3) : [];
    out.innerHTML = `${qsHits.length ? `<div class="qs-head">${words.length ? 'GO TO' : 'POPULAR'}</div>${qsHits.map((a, i) => `<button class="qs-hit ${i === 0 ? 'sel' : ''}" data-action="hub-go" data-mode="${a[0]}"><strong>${esc(a[1])}</strong><span>${esc(HUBS[a[3]]?.long || '')} · ${esc(a[2])}</span></button>`).join('')}` : ''}
      ${cards.length ? `<div class="qs-head">FLASHCARDS</div>${cards.map(c => `<div class="qs-note"><b>${esc(c.front)}</b><span>${esc(c.back)}</span></div>`).join('')}` : ''}
      ${qs.length ? `<div class="qs-head">QUESTIONS</div>${qs.map(x => `<div class="qs-note"><b>${esc(x.prompt)}</b><span>Answer: ${esc(x.options[x.answer])}</span></div>`).join('')}` : ''}
      ${words.length && q.trim().length > 1 ? `<button class="qs-all" data-action="hub-search-all" data-q="${esc(q)}">See every match in Search your notes →</button>` : ''}
      ${!qsHits.length && !cards.length && !qs.length && words.length ? `<p class="source">Nothing matches “${esc(q)}”. Try a shorter word.</p>` : ''}`;
  }
  function qsKeys(e) {
    const hits = [...document.querySelectorAll('.qs-hit')]; if (!hits.length) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); qsSel = (qsSel + (e.key === 'ArrowDown' ? 1 : -1) + hits.length) % hits.length; hits.forEach((h, i) => h.classList.toggle('sel', i === qsSel)); hits[qsSel].scrollIntoView({ block: 'nearest' }); }
    if (e.key === 'Enter') { e.preventDefault(); const m = hits[qsSel].dataset.mode; closeSearch(); S().mode(m); }
  }
  document.addEventListener('keydown', e => {
    if ($('#qs-modal')) { if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); closeSearch(); } return; }
    const typing = e.target.closest?.('input,textarea,select,[contenteditable]');
    if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing)) { e.preventDefault(); openSearch(); }
  }, true);
  function addSearchButton() {
    const tools = $('.top-tools'); if (!tools || $('#qs-btn')) return;
    const b = document.createElement('button'); b.id = 'qs-btn'; b.dataset.action = 'hub-search'; b.setAttribute('aria-label', 'Search (press /)');
    b.innerHTML = '<span aria-hidden="true">⌕</span><span class="qs-label">Search</span><kbd class="qs-kbd">/</kbd>'; tools.prepend(b);
  }

  window.Hubs = {
    HUBS, REG, hubOf, nameOf, onPage, jumpHTML, hubTilesHTML, openSearch, closeSearch,
    init() {
      addSearchButton(); tidyTopbar();
      try { history.replaceState({ page: 'home' }, ''); } catch (e) { }
      const app = $('#app'); if (app) new MutationObserver(crumbs).observe(app, { childList: true });
      crumbs();
    },
    mode(p) { if (p === 'sheet' && exam() === 3 && window.CRSheet) return window.CRSheet.mode('crsheet'); if (HUBS[p]) { hubPage(p); return true; } return !!window.Notebook?.mode(p) || !!window.CRSheet?.mode(p); },
    handle(a, b) {
      if (window.Notebook?.handle(a, b)) return true;
      if (window.CRSheet?.handle(a, b)) return true;
      if (!a.startsWith('hub-')) return false;
      if (a === 'hub-up') go(b.dataset.to);
      else if (a === 'hub-theme') { const v = b.dataset.v; try { localStorage.setItem(THEME_KEY, v); } catch (e) { } applyTheme(v); document.querySelectorAll('[data-action="hub-theme"]').forEach(x => x.setAttribute('aria-pressed', String(x === b))); }
      else if (a === 'hub-search') openSearch();
      else if (a === 'hub-search-close') closeSearch();
      else if (a === 'hub-go') { closeSearch(); S().mode(b.dataset.mode); }
      else if (a === 'hub-search-all') { const q = b.dataset.q; closeSearch(); S().mode('search'); setTimeout(() => { const i = $('#x-q'); if (i) { i.value = q; i.dispatchEvent(new Event('input')); } }, 0); }
      return true;
    }
  };
})();
