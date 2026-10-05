/* Study boosters: weak-spot drill, math-only timed exam, cram sheet, search,
   daily goal + day streak, and "why your pick is wrong" notes from source flashcards. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const dayBefore = s => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() - 1); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const norm = t => String(t || '').toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();

  const FORMULAS = {
    annualize: ['Annualize a bonus', 'Monthly ×12 · Quarterly ×4 · Weekly ×52 · Bi-weekly ×26 · Semi-monthly ×24 · Total comp = Base + annual bonus'],
    mean: ['Mean', 'Σ values ÷ number of jobs'],
    weighted: ['Weighted mean', 'Σ(pay × employees) ÷ total EMPLOYEES (not jobs)'],
    median: ['Median / mode', 'Sort first · median = middle value (even count → average the middle two) · mode = most frequent'],
    incumbent: ['Incumbent-level median', 'Line up every employee in sorted order, count to the middle position'],
    iqr: ['IQR outliers', 'IQR = Q3 − Q1 · fences = Q1 − 1.5·IQR and Q3 + 1.5·IQR · leave the median out when splitting halves'],
    grades: ['Pay grade table', 'Min = Mid × (1 − range diff) · Max = Mid × (1 + range diff) · Next mid = Mid × (1 + mid diff) · normal rounding'],
    points: ['Pay for points', 'Pay = Min + (Mid − Min) × a ÷ b · a = points − grade bottom · b = half the grade width · round UP'],
    piecework: ['Piecework', 'Sets = units ÷ block, round DOWN · rate = base $/hr + sets × bonus · pay = rate × hours'],
    'per-unit': ['Per-unit pay', 'Base = units × rate · blocks = floor(units ÷ block) · total = base + blocks × flat bonus'],
    factors: ['Compensable factor points', 'Points = degree × weight · total = Σ points'],
    labor: ['Pay level & labor cost', 'Pay level = total comp ÷ employees · labor costs = pay level × employees'],
    compa: ['Compa-ratio', 'Pay ÷ range midpoint · ideal 0.75–1.25 · < 1 below, > 1 above · low → raise, high → freeze'],
    netpay: ['Net pay', 'SS 6.2% + Medicare 1.45% = FICA 7.65% · Net = Gross − SS − Medicare − income tax − other deductions']
  };
  const MATH_EXAM_TYPES = window.ACTIVE_EXAM === 3 ? ['compa', 'netpay', 'compa', 'netpay'] : ['annualize', 'weighted', 'iqr', 'grades', 'points', 'piecework', 'median', 'incumbent'];

  /* ---------- state helpers ---------- */
  const st = () => S().state;
  const ex = () => { const s = st(); s.extras = s.extras || { mathMiss: {}, daily: { day: today(), n: 0 }, goal: 30, streak: { count: 0, last: null } }; if (s.extras.daily.day !== today()) s.extras.daily = { day: today(), n: 0 }; return s.extras; };

  function onRecord(id, topic, correct) {
    const e = ex();
    e.daily.n++;
    if (!correct && /^generated-/.test(id)) { const type = id.split('-')[1]; if (FORMULAS[type]) e.mathMiss[type] = (e.mathMiss[type] || 0) + 1; }
    const p = (window.STUDY_DATA.math || []).find(m => m.id === id);
    if (!correct && p && FORMULAS[p.type]) e.mathMiss[p.type] = (e.mathMiss[p.type] || 0) + 1;
    if (e.daily.n === e.goal && e.streak.last !== today()) {
      e.streak.count = e.streak.last === dayBefore(today()) ? e.streak.count + 1 : 1;
      e.streak.last = today();
      S().sound('goal');
      S().toast(`Daily goal hit: ${e.goal} answers. Day streak: ${e.streak.count}.`);
    }
    S().save();
    renderDaily();
  }

  function streakLive() { const e = ex(); return (e.streak.last === today() || e.streak.last === dayBefore(today())) ? e.streak.count : 0; }
  function renderDaily() {
    const box = $('.side-bottom'); if (!box || !S()) return;
    let d = $('#daily-box');
    if (!d) { d = document.createElement('div'); d.id = 'daily-box'; box.prepend(d); }
    const e = ex(), pct = Math.min(100, Math.round(e.daily.n / e.goal * 100)), s = streakLive();
    d.innerHTML = `<span class="daily-label">TODAY’S GOAL</span><div class="daily-row"><strong>${Math.min(e.daily.n, 999)}<small> / ${e.goal}</small></strong><button class="text-button" data-action="x-goal" title="Change daily goal">change</button></div>
      <div class="daily-bar"><i style="width:${pct}%"></i></div><span class="daily-streak">${s ? `DAY STREAK ${s}${e.streak.last === today() ? ' · done today ✓' : ' · keep it alive today'}` : 'Hit the goal to start a day streak'}</span>`;
  }

  /* ---------- why your pick is wrong ---------- */
  let termIndex = null;
  function buildIndex() {
    termIndex = new Map();
    for (const c of window.STUDY_DATA.flashcards) { if (/^if the question says/i.test(c.front)) continue; const k = norm(c.front); if (!termIndex.has(k)) termIndex.set(k, c); }
  }
  function findTerm(opt) {
    if (!termIndex) buildIndex();
    const n = norm(opt); if (!n) return null;
    if (termIndex.has(n)) return termIndex.get(n);
    if (n.split(' ').length > 5) return null;
    for (const [k, c] of termIndex) if (k.length >= 5 && (n.startsWith(k + ' ') || (k.startsWith(n + ' ') && n.length >= 8))) return c;
    return null;
  }
  function whyWrong(q, pick) {
    if (pick == null || pick === q.answer) return '';
    const opt = q.options[pick], c = findTerm(opt); if (!c) return '';
    return `<div class="why-wrong"><span class="eyebrow">WHY NOT “${esc(opt.toUpperCase())}”?</span><p>In your notes, <b>${esc(c.front)}</b> means: ${esc(c.back)}</p><span class="source">${esc(c.source)}</span></div>`;
  }

  /* ---------- weak-spot drill ---------- */
  function topicStats() {
    const s = st().stats || {};
    return window.STUDY_DATA.topics.map(t => { const x = s[t.id] || { correct: 0, total: 0 }; return { ...t, total: x.total, pct: x.total ? Math.round(x.correct / x.total * 100) : null }; });
  }
  function weakest() {
    const ts = topicStats(), tried = ts.filter(t => t.total >= 3);
    if (tried.length) return tried.sort((a, b) => a.pct - b.pct)[0];
    return ts.sort((a, b) => a.total - b.total)[0];
  }
  function drillPage() {
    S().setPage('drill');
    const Q = window.STUDY_DATA.questions, missed = st().missed.filter(id => Q.some(q => q.id === id));
    const again = window.STUDY_DATA.flashcards.filter(c => st().cards[c.id] === 'again');
    const w = weakest(), ts = topicStats();
    $('#app').innerHTML = S().heading('FOCUS / DRILL', 'Weak-spot drill', 'One tap builds a session from what you miss most. No filters to pick.') +
      `<section class="panel drill-plan"><h2>Your plan right now</h2>
      <div class="drill-grid">${ts.map(t => `<div class="drill-topic ${t.id === w.id ? 'weak' : ''}"><span>${esc(t.name)}</span><strong>${t.pct == null ? '—' : t.pct + '%'}</strong><small>${t.total ? t.total + ' answered' : 'not started'}${t.id === w.id ? ' · WEAKEST' : ''}</small></div>`).join('')}</div>
      <ol class="drill-steps"><li><b>${Math.min(missed.length, 10)}</b> missed ${missed.length === 1 ? 'question' : 'questions'} you haven’t fixed yet</li><li>Topped up to 15 with <b>${esc(w.name)}</b> questions${w.pct == null ? ' (least practiced)' : ` (your lowest at ${w.pct}%)`}</li><li>Then <b>${again.length}</b> flashcard${again.length === 1 ? '' : 's'} you marked “again”</li></ol>
      <div class="actions"><button class="primary" data-action="x-drill">Start drill →</button><button data-action="x-again" ${again.length ? '' : 'disabled'}>Review “again” cards (${again.length})</button></div></section>`;
  }
  function startDrill() {
    const Q = window.STUDY_DATA.questions, w = weakest();
    let ids = S().shuffle(st().missed.filter(id => Q.some(q => q.id === id))).slice(0, 10);
    const fill = S().shuffle(Q.filter(q => q.topic === w.id && !ids.includes(q.id))).map(q => q.id);
    ids = ids.concat(fill).slice(0, 15);
    S().startQuizIds(ids, 'quiz');
  }

  /* ---------- math-only timed exam ---------- */
  function mathExamPage() {
    S().setPage('mathexam');
    $('#app').innerHTML = S().heading('FOCUS / MATH EXAM', 'Math-only exam', 'Four word problems with fresh numbers, timed like the real thing. Scored per field so you see partial credit.') +
      `<section class="panel"><div class="stats"><div class="stat"><strong>4</strong><span>WORD PROBLEMS</span></div><div class="stat"><strong>${'<span id="x-min">20</span>'}:00</strong><span>TIME LIMIT</span></div><div class="stat"><strong>NEW</strong><span>NUMBERS EVERY RUN</span></div></div>
      <div class="config"><label class="field">Time limit<select id="x-time"><option value="20">20 minutes (about 5 per problem)</option><option value="30">30 minutes</option><option value="12">12 minutes (speed round)</option></select></label></div>
      <p class="source">${window.ACTIVE_EXAM === 3 ? 'Exam 3 math: two compa-ratio sets and two net-pay problems.' : 'Problems are drawn from different types: annualizing, weighted mean, IQR outliers, pay grade tables, pay for points, piecework, medians. Rounding follows the class rules.'}</p>
      <button class="primary" data-action="x-mathexam">Begin math exam →</button></section>`;
    $('#x-time').addEventListener('change', e => { $('#x-min').textContent = e.target.value; });
  }
  function startMathExam() {
    const mins = +($('#x-time')?.value || 20);
    const types = window.ACTIVE_EXAM === 3 ? MATH_EXAM_TYPES : S().shuffle(MATH_EXAM_TYPES).slice(0, 4);
    const probs = types.map(t => { const p = window.MathEngine.generate(t); p.origin = 'generated'; return p; });
    S().startTimedMath(probs, mins, 'Math-only exam');
  }

  /* ---------- cram sheet ---------- */
  function cramPage() {
    S().setPage('cram');
    const D = window.STUDY_DATA, s = st(), e = ex();
    const ts = topicStats().sort((a, b) => (a.pct ?? 101) - (b.pct ?? 101));
    const missedQ = s.missed.map(id => D.questions.find(q => q.id === id)).filter(Boolean).slice(0, 15);
    const missedCue = s.missed.map(id => D.cues.find(c => c.id === id)).filter(Boolean).slice(0, 10);
    const again = D.flashcards.filter(c => s.cards[c.id] === 'again').slice(0, 15);
    const mm = Object.entries(e.mathMiss).sort((a, b) => b[1] - a[1]);
    const mathList = (mm.length ? mm.map(([t]) => t) : window.ACTIVE_EXAM === 3 ? ['compa', 'netpay'] : ['points', 'grades', 'iqr', 'weighted']).filter(t => FORMULAS[t]);
    const name = window.Profiles?.current().name;
    $('#app').innerHTML = S().heading('FOCUS / CRAM SHEET', `${name ? name + '’s' : 'Your'} night-before sheet`, 'Built from your own misses. It updates every time you study, so read it last thing before bed.',
      (window.print && !document.documentElement.classList.contains('hosted')) ? '<button data-action="x-print">Print</button>' : '') +
      `<div class="cram">
      <section class="panel"><h2>Topics, weakest first</h2>${ts.map(t => `<div class="cram-topic"><span>${esc(t.name)}</span><span class="cram-pct">${t.pct == null ? 'not started' : t.pct + '%'}</span><div class="meter"><span style="width:${t.pct || 0}%"></span></div></div>`).join('')}</section>
      <section class="panel"><h2>Formulas ${mm.length ? 'you’ve missed' : 'to know cold'}</h2>${mathList.map(t => `<div class="cram-f"><b>${esc(FORMULAS[t][0])}</b>${mm.length ? `<small>missed ${e.mathMiss[t]}×</small>` : ''}<p>${esc(FORMULAS[t][1])}</p></div>`).join('')}
        <div class="cram-f"><b>Rounding rules</b><p>Pay table → normal · pay rate for a job → round UP · piecework sets → round DOWN</p></div></section>
      <section class="panel cram-wide"><h2>Questions you missed ${missedQ.length ? `(${s.missed.filter(id => D.questions.some(q => q.id === id)).length})` : ''}</h2>${missedQ.length ? missedQ.map(q => `<div class="cram-q"><p>${esc(q.prompt)}</p><p class="cram-a">→ ${esc(q.answerKeyText || q.options[q.answer])}</p></div>`).join('') : '<p class="source">No missed questions yet. Run a quiz or the exam simulation first.</p>'}</section>
      ${missedCue.length ? `<section class="panel"><h2>Cues you mixed up</h2>${missedCue.map(c => `<p class="cram-cue">${esc(c.clue)} <b>→ ${esc(c.answer)}</b></p>`).join('')}</section>` : ''}
      ${again.length ? `<section class="panel"><h2>Cards you marked “again”</h2>${again.map(c => `<p class="cram-cue"><b>${esc(c.front)}</b>: ${esc(c.back)}</p>`).join('')}</section>` : ''}
      </div>`;
  }

  /* ---------- search ---------- */
  function searchPage(qs = '') {
    S().setPage('search');
    $('#app').innerHTML = S().heading('TOOLS / SEARCH', 'Search your notes', 'Every question, flashcard and cue in one place. Try “broadbanding”, “Scanlon” or “weighted”.') +
      `<section class="panel"><label class="field">Search<input id="x-q" type="search" autocomplete="off" placeholder="Type a term…" value="${esc(qs)}"></label></section><div id="x-results"></div>`;
    const inp = $('#x-q'); inp.addEventListener('input', () => runSearch(inp.value)); inp.focus(); runSearch(qs);
  }
  function hl(t, words) { let h = esc(t); for (const w of words) if (w.length > 1) h = h.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig'), '<mark>$1</mark>'); return h; }
  function runSearch(q) {
    const out = $('#x-results'); if (!out) return;
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length || q.trim().length < 2) { out.innerHTML = ''; return; }
    const D = window.STUDY_DATA, has = t => { const l = String(t || '').toLowerCase(); return words.every(w => l.includes(w)); };
    const cards = D.flashcards.filter(c => has(c.front + ' ' + c.back)).slice(0, 25);
    const qs = D.questions.filter(x => has(x.prompt + ' ' + x.options.join(' ') + ' ' + (x.explanation || ''))).slice(0, 25);
    const cues = D.cues.filter(c => has(c.clue + ' ' + c.answer)).slice(0, 15);
    const n = cards.length + qs.length + cues.length;
    out.innerHTML = !n ? `<p class="source" style="margin-top:14px">Nothing matches “${esc(q)}”. Try a shorter word.</p>` :
      `${cards.length ? `<div class="section-line"><h2>FLASHCARDS</h2><span>${cards.length}</span></div><section class="panel">${cards.map(c => `<div class="sr"><b>${hl(c.front, words)}</b><p>${hl(c.back, words)}</p><span class="source">${esc(c.source)}</span></div>`).join('')}</section>` : ''}
      ${qs.length ? `<div class="section-line"><h2>QUESTIONS</h2><span>${qs.length}</span></div><section class="panel">${qs.map(x => `<details class="sr"><summary>${hl(x.prompt, words)}</summary><p><b>Answer:</b> ${hl(x.answerKeyText || x.options[x.answer], words)}</p>${x.explanation ? `<p>${hl(x.explanation, words)}</p>` : ''}<span class="source">${esc(x.source)}</span></details>`).join('')}</section>` : ''}
      ${cues.length ? `<div class="section-line"><h2>CUES</h2><span>${cues.length}</span></div><section class="panel">${cues.map(c => `<div class="sr"><p>${hl(c.clue, words)} → <b>${hl(c.answer, words)}</b></p></div>`).join('')}</section>` : ''}`;
  }

  /* ---------- wiring ---------- */
  window.Extras = {
    modes: [
      ['drill', 'Weak-spot drill', 'One tap: your misses + weakest topic.', 'drill'],
      ['mathexam', 'Math-only exam', '4 timed word problems, new numbers.', 'mathexam'],
      ['cram', 'Cram sheet', 'Your personal night-before review.', 'cram'],
      ['search', 'Search', 'Find any term in your notes.', 'search']
    ],
    mode(p) {
      if (p === 'drill') drillPage(); else if (p === 'mathexam') mathExamPage(); else if (p === 'cram') cramPage(); else if (p === 'search') searchPage(); else return false;
      return true;
    },
    handle(a, b) {
      if (!a.startsWith('x-')) return false;
      if (a === 'x-drill') startDrill();
      else if (a === 'x-again') S().startFlashList(S().shuffle(window.STUDY_DATA.flashcards.filter(c => st().cards[c.id] === 'again')));
      else if (a === 'x-mathexam') startMathExam();
      else if (a === 'x-print') window.print();
      else if (a === 'x-goal') { const e = ex(), opts = [15, 30, 50, 75]; e.goal = opts[(opts.indexOf(e.goal) + 1) % opts.length]; S().save(); renderDaily(); if(S().page==='home')window.Dashboard?.render(); S().toast(`Daily goal set to ${e.goal} answers.`); }
      return true;
    },
    onRecord, whyWrong, renderDaily,
    init() { ex(); renderDaily(); }
  };
})();
