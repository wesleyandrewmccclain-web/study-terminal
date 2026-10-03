/* Countdown study plan: a short list of tasks for each day until the exam.
   Tasks tick themselves off from what you actually did today (mock taken, mission finished, etc.).
   A few tasks happen outside the game (class, notes) and have a checkbox. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ek = () => String(S().data?.exam || window.ACTIVE_EXAM || 2);
  const dayKey = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const todayKey = () => dayKey(new Date());
  const isToday = t => !!t && dayKey(new Date(t)) === todayKey();
  const store = () => { const st = S().state; st.plan = st.plan || {}; st.plan[ek()] = st.plan[ek()] || { done: {}, manual: {} }; return st.plan[ek()]; };
  const examDate = () => { const d = S().data?.examDate; return d ? new Date(...d) : null; };
  const daysLeft = () => { const e = examDate(); if (!e) return null; const a = new Date(); a.setHours(0, 0, 0, 0); const b = new Date(e); b.setHours(0, 0, 0, 0); return Math.round((b - a) / 864e5); };

  /* ---------- what happened today ---------- */
  const items = () => S().state.learning?.exams?.[ek()]?.items || {};
  const answeredToday = topic => Object.values(items()).filter(r => isToday(r.last) && (!topic || r.topic === topic)).length;
  const missionToday = () => (S().state.history || []).some(h => h.mode === 'mission' && isToday(Date.parse(h.date)));
  const mockToday = () => (S().state.mocks?.[ek()] || []).some(m => isToday(m.at));
  const writtenToday = () => Object.values(S().state.written?.[ek()] || {}).filter(r => isToday(r.at)).length;
  const lookupToday = () => isToday(S().state.lookup?.[ek()]?.lastAt);
  const listenToday = () => (S().state.listen?.[ek()]?.[new Date().toDateString()] || 0);
  const trapToday = () => isToday(S().state.fun?.arcade?.[ek()]?.trapAt);
  const dailyToday = () => !!S().state.fun?.daily?.[ek()]?.results?.[todayKey()];
  const dueNow = () => window.Learning?.summary?.().due ?? 0;
  const weakest = () => { const r = window.Boost?.readiness?.() || []; return r.slice().sort((a, b) => a.value - b.value)[0] || null; };

  /* ---------- the plan ---------- */
  function tasksFor(dte) {
    // Pick today's weak topic once and keep it, so the task doesn't move as your scores change.
    const st = store(), key = todayKey(); st.weak = st.weak || {};
    if (!st.weak[key]) { const w0 = weakest(); if (w0) { st.weak[key] = w0.id; } }
    const wId = st.weak[key] || weakest()?.id, wName = S().data.topics.find(t => t.id === wId)?.name || 'your weakest topic';
    const pending = (S().data.pending || []).filter(p => p.status !== 'Done');
    const T = (id, title, why, go, check, manual) => ({ id, title, why, go, check, manual });
    const notes = pending.length ? T('notes', 'Send Claude the missing material', pending.map(p => p.name.replace(/^Guest speaker: /, '')).join(', ') + ' still aren’t in the game.', null, null, true) : null;
    if (dte >= 4) return { title: 'Get a baseline', items: [
      T('mock', 'Take a mock exam', 'See where you stand before you study more.', 'mock', mockToday),
      T('weak', `Drill ${wName}: 10 answers`, 'Your lowest readiness right now.', wId ? 'topic:' + wId : 'drill', () => answeredToday(wId) >= 10),
      T('daily', 'Play the daily challenge', 'Two minutes, keeps the streak.', 'daily', dailyToday), notes].filter(Boolean) };
    if (dte === 3) return { title: 'Build it up', items: [
      T('mission', 'Finish a 20-minute mission', 'Mixed review, weighted to what you miss.', 'missions', missionToday),
      T('written', 'Write two short answers', 'The exam has short answer and essay too.', 'written', () => writtenToday() >= 2),
      T('lookup', 'One formula lookup round', 'Practice finding things on your sheet fast.', 'lookup', lookupToday),
      T('trap', 'Play spot the trap', 'The professor’s favorite mix-ups.', 'arcade', trapToday), notes].filter(Boolean) };
    if (dte === 2) return { title: 'Review day', items: [
      T('queue', 'Clear your review queue before class', 'Everything that’s due, so class fills gaps instead.', 'review', () => dueNow() === 0 || missionToday()),
      T('class', 'Review class at 12:35: get the compa-ratio exercise and ask about the exam format', 'Anything said here is gold.', null, null, true),
      T('send', 'Send Claude your review notes + the exercise', 'They go straight into the game and the mock exam.', null, null, true),
      T('daily', 'Play the daily challenge', 'Keep the streak.', 'daily', dailyToday)] };
    if (dte === 1) return { title: 'Final run', items: [
      T('mock', 'Take a second mock exam', 'Compare with your first one.', 'mock', mockToday),
      T('weak', `Fix ${wName}: 10 answers`, 'Your lowest readiness right now.', wId ? 'topic:' + wId : 'drill', () => answeredToday(wId) >= 10),
      T('listen', 'Listen mode: 10 cards', 'Easy review for the evening.', 'listen', () => listenToday() >= 10),
      T('lookup', 'One formula lookup round', 'Lock in where everything is.', 'lookup', lookupToday)] };
    if (dte === 0) return { title: 'Exam day', items: [
      T('lookup', 'One formula lookup round (morning)', 'Warm up your short look at notes.', 'lookup', lookupToday),
      T('mission', 'A 5-minute mission', 'Light review, nothing new.', 'missions', missionToday),
      T('sheet', 'Pack your formula sheet + a calculator. Exam at 12:35', 'Read the bold and underlined words.', null, null, true)] };
    return null;
  }
  const DAYNAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function evaluate(dte) {
    const plan = tasksFor(dte); if (!plan) return null;
    const st = store(), key = todayKey(); st.done[key] = st.done[key] || {}; st.manual[key] = st.manual[key] || {};
    let changed = false;
    for (const t of plan.items) {
      const done = t.manual ? !!st.manual[key][t.id] : (st.done[key][t.id] || (t.check && t.check()));
      if (!t.manual && done && !st.done[key][t.id]) { st.done[key][t.id] = true; changed = true; }
      t.done = !!done;
    }
    if (changed) S().save();
    return plan;
  }
  function taskHTML(t) {
    const go = t.go ? (t.go.startsWith('topic:') ? `data-action="dash-topic" data-topic="${esc(t.go.slice(6))}"` : `data-action="mode" data-mode="${esc(t.go)}"`) : '';
    return `<li class="plan-task ${t.done ? 'done' : ''}">${t.manual ? `<button class="plan-check" data-action="plan-tick" data-id="${esc(t.id)}" aria-pressed="${t.done}" aria-label="Mark done">${t.done ? '✓' : ''}</button>` : `<span class="plan-check auto" aria-hidden="true">${t.done ? '✓' : ''}</span>`}
      <div><strong>${esc(t.title)}</strong><small>${esc(t.why)}</small></div>${go && !t.done ? `<button class="quiet-link" ${go}>Go ↗</button>` : ''}</li>`;
  }

  function homeHTML() {
    const dte = daysLeft(); if (dte == null || dte < 0 || dte > 10) return '';
    const plan = evaluate(dte); if (!plan) return '';
    const n = plan.items.filter(t => t.done).length;
    return `<section class="plan-card" aria-label="Today’s plan"><div class="plan-head"><div><span class="eyebrow">${dte === 0 ? 'EXAM DAY' : dte + (dte === 1 ? ' DAY' : ' DAYS') + ' TO EXAM ' + ek()}</span><h2>Today: ${esc(plan.title)}</h2></div><span class="plan-count">${n}/${plan.items.length}</span></div>
      <ul class="plan-list">${plan.items.map(taskHTML).join('')}</ul><button class="quiet-link" data-action="mode" data-mode="plan">See the whole week ↗</button></section>`;
  }
  function page() {
    S().setPage('plan');
    const dte = daysLeft(), e = examDate();
    if (dte == null || dte < 0) { $('#app').innerHTML = S().heading('PLAN', 'Study plan', 'This exam is behind you. Switch exams in the sidebar to plan for the next one.'); return; }
    const days = [];
    for (let d = Math.min(dte, 4); d >= 0; d--) { const date = new Date(e); date.setDate(date.getDate() - d); days.push({ d, date }); }
    const st = store();
    $('#app').innerHTML = S().heading('PLAN / EXAM ' + ek(), 'Your plan to Wednesday', 'A few focused tasks a day. Game tasks tick off on their own when you do them; class and notes have a checkbox.') +
      `<div class="plan-week">${days.map(({ d, date }) => {
        const isT = d === dte, plan = isT ? evaluate(d) : tasksFor(d), key = dayKey(date), past = d > dte;
        const items = plan.items.map(t => { if (!isT) t.done = !!(st.done[key]?.[t.id] || st.manual[key]?.[t.id]); return t; });
        return `<section class="panel plan-day ${isT ? 'today' : ''} ${past ? 'past' : ''}"><div class="plan-head"><div><span class="eyebrow">${DAYNAMES[date.getDay()]} ${date.getMonth() + 1}/${date.getDate()}${isT ? ' · TODAY' : ''}</span><h2>${esc(plan.title)}</h2></div><span class="plan-count">${items.filter(t => t.done).length}/${items.length}</span></div><ul class="plan-list">${items.map(t => isT ? taskHTML(t) : `<li class="plan-task ${t.done ? 'done' : ''}"><span class="plan-check auto">${t.done ? '✓' : ''}</span><div><strong>${esc(t.title)}</strong><small>${esc(t.why)}</small></div></li>`).join('')}</ul></section>`;
      }).join('')}</div>`;
  }

  window.Plan = {
    modes: [['plan', 'Study plan', 'Your day-by-day plan to the exam.', 'drill']],
    library: [['plan', 'Study plan', 'A few tasks a day until the exam. They tick off as you do them.', 'drill', 'study', 'COUNTDOWN']],
    homeHTML, daysLeft,
    mode(p) { if (p === 'plan') { page(); return true; } return false; },
    handle(a, b) {
      if (a !== 'plan-tick') return false;
      const st = store(), key = todayKey(); st.manual[key] = st.manual[key] || {}; st.manual[key][b.dataset.id] = !st.manual[key][b.dataset.id]; S().save(); S().sound('select');
      if (S().page === 'plan') page(); else S().home();
      return true;
    }
  };
})();
