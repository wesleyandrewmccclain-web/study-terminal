/* Game modes: different ways to answer than A/B/C/D.
   Sort it · Find the mistake · Build the paycheck · Put it in order · Swipe true/false · Odd one out · Memory match.
   Curated content lives in games-data.js; Find the mistake and Build the paycheck make their own numbers here.
   Answers go through Study.record with "generated-game-" ids, so they count for XP, streaks and topic stats
   without adding anything to the missed list or the spaced-review queue. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const exam = () => Number(S().data?.exam || window.ACTIVE_EXAM || 2);
  const ek = () => String(exam());
  const D = () => (window.GAMES_DATA || {})[exam()] || null;
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = a => a[rand(0, a.length - 1)];
  const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const r2 = v => Math.round((v + Number.EPSILON) * 100) / 100;
  const money = v => '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const num = v => Number(v).toLocaleString('en-US', { maximumFractionDigits: 2 });
  const rec = (tag, topic, ok) => S().record('generated-game-' + tag, topic || 'payroll', !!ok);
  const store = id => { const st = S().state; st.games = st.games || {}; st.games[ek()] = st.games[ek()] || {}; return (st.games[ek()][id] = st.games[ek()][id] || { plays: 0, best: 0 }); };
  const saveScore = (id, pct) => { const g = store(id); g.plays++; g.best = Math.max(g.best, pct); g.last = Date.now(); S().save(); window.Fun?.checkBadges?.(); return g; };

  const GAMES = [
    ['sort', 'Sort it', 'Tap the right bucket for each card: before-tax or after-tax, required or optional.', '⇶', true],
    ['mistake', 'Find the mistake', 'A worked solution has one wrong step. Tap it.', '✗', true],
    ['pay', 'Build the paycheck', 'Fill in a pay stub line by line, gross to net.', '$', true],
    ['order', 'Put it in order', 'Tap the steps in the right order.', '⇅', true],
    ['swipe', 'Swipe true or false', 'Swipe right for true, left for false. Fast.', '⇆', false],
    ['odd', 'Odd one out', 'Four items. One doesn’t belong.', '◌', true],
    ['memory', 'Memory match', 'Flip tiles to pair each number or term with its meaning.', '▦', false]
  ];
  const curatedOK = () => !!D();
  let cur = null, timer = 0;
  const stop = () => { clearTimeout(timer); timer = 0; document.removeEventListener('keydown', onKey); cur = null; };

  /* ================= hub ================= */
  function hub() {
    stop(); S().setPage('games');
    $('#app').innerHTML = S().heading('PLAY / GAME MODES', 'Game modes', 'Different ways to answer than A, B, C, D. Every right answer earns XP like a quiz.') +
      `<div class="gm-grid">${GAMES.map(([id, name, desc, icon, curated]) => {
        const g = store(id), off = curated && !curatedOK();
        return `<button class="gm-card" data-action="mode" data-mode="g-${id}" ${off ? 'disabled' : ''}><span class="gm-icon" aria-hidden="true">${icon}</span><strong>${esc(name)}</strong><span>${off ? 'Made for Exam 3. Switch exams in the sidebar.' : esc(desc)}</span><small>${g.plays ? `Best ${g.best}% · played ${g.plays}×` : 'New'}</small></button>`;
      }).join('')}</div>`;
  }
  const onGamePage = () => /^g-/.test(S().page || '');
  function frame(id, inner, right = '') {
    if (!onGamePage()) { stop(); return; } // a timer fired after you left the game: don't redraw over the new page
    const g = GAMES.find(x => x[0] === id);
    $('#app').innerHTML = S().heading('GAME MODES / ' + g[1].toUpperCase(), g[1], '', right + '<button class="quiet-link" data-action="mode" data-mode="games">All games ↗</button>') + `<section class="gm-stage">${inner}</section>`;
  }
  function results(id, score, total, misses, extra = '', pctOverride = null) {
    const pct = pctOverride ?? (total ? Math.round(score / total * 100) : 0), g = saveScore(id, pct);
    S().sound(pct >= 80 ? 'complete' : 'timer');
    frame(id, `<div class="panel gm-result"><div class="gm-big">${score}/${total}</div><p>${pctOverride != null ? 'Rating ' : ''}${pct}%${pct >= g.best && g.plays > 1 ? ' · new best' : ` · best ${g.best}%`}${extra}</p>
      ${misses.length ? `<div class="section-line"><h2>REVIEW THESE</h2></div><ul class="gm-miss">${misses.map(m => `<li><strong>${esc(m[0])}</strong><span>${esc(m[1])}</span></li>`).join('')}</ul>` : '<p class="source">Clean round. Nothing to review.</p>'}
      <div class="actions"><button class="primary" data-action="gm-again" data-game="${id}">Play again →</button><button data-action="mode" data-mode="games">All games</button></div></div>`);
  }

  /* ================= Sort it ================= */
  function sortPick() {
    S().setPage('g-sort'); const sets = D().sort;
    frame('sort', `<div class="panel"><h2>Pick a set</h2><div class="gm-sets"><button class="primary" data-action="gm-sort-go" data-set="*">Random set →</button>${sets.map(s => `<button data-action="gm-sort-go" data-set="${s.id}">${esc(s.title)}<small>${s.items.length} cards</small></button>`).join('')}</div></div>`);
  }
  function sortStart(id) {
    const sets = D().sort, set = id === '*' ? pick(sets) : sets.find(s => s.id === id);
    cur = { g: 'sort', set, queue: shuffle(set.items), i: 0, right: 0, misses: [], wait: false }; sortQ(); keys();
  }
  function sortQ(fb) {
    const c = cur, it = c.queue[c.i];
    frame('sort', `<div class="gm-progress"><span style="width:${c.i / c.queue.length * 100}%"></span></div><p class="eyebrow">${esc(c.set.title.toUpperCase())} · ${c.i + 1} OF ${c.queue.length}</p>
      <div class="gm-card-big ${fb ? (fb.ok ? 'ok' : 'bad') : ''}">${esc(it[0])}</div>
      <div class="gm-buckets b${c.set.buckets.length}">${c.set.buckets.map((b, k) => `<button class="gm-bucket ${fb && k === it[1] ? 'right' : ''} ${fb && !fb.ok && k === fb.pick ? 'wrong' : ''}" data-action="gm-sort" data-k="${k}" ${fb ? 'disabled' : ''}><kbd>${k + 1}</kbd>${esc(b)}</button>`).join('')}</div>
      ${fb && !fb.ok ? `<p class="gm-why">It’s <strong>${esc(c.set.buckets[it[1]])}</strong>.</p><div class="actions"><button class="primary" data-action="gm-sort-next">Next →</button></div>` : ''}`);
  }
  function sortAns(k) {
    const c = cur; if (!c || c.wait) return; const it = c.queue[c.i], ok = k === it[1];
    rec('sort-' + c.set.id, c.set.topic, ok); S().sound(ok ? 'correct' : 'incorrect');
    if (ok) c.right++; else c.misses.push([it[0], '→ ' + c.set.buckets[it[1]]]);
    c.wait = true; sortQ({ ok, pick: k });
    if (ok) timer = setTimeout(sortNext, 450);
  }
  function sortNext() { const c = cur; if (!c) return; c.wait = false; if (++c.i >= c.queue.length) { const x = c; stop(); results('sort', x.right, x.queue.length, x.misses); } else sortQ(); }

  /* ================= Put it in order ================= */
  function orderStart(id) {
    const sets = D().order, set = id ? sets.find(s => s.id === id) : pick(sets.filter(s => s.id !== cur?.set?.id));
    cur = { g: 'order', set, pool: shuffle(set.steps.map((s, i) => i)), picked: [], done: false, rounds: (cur?.rounds || 0), score: cur?.score || 0, total: cur?.total || 0, misses: cur?.misses || [] };
    if (cur.pool.every((v, i) => v === i)) cur.pool.reverse(); orderView();
  }
  function orderView() {
    const c = cur, st = c.set.steps, left = c.pool.filter(i => !c.picked.includes(i));
    frame('order', `<p class="eyebrow">ROUND ${c.rounds + 1} OF 3</p><h2 class="gm-h">${esc(c.set.title)}</h2><p class="source">Tap the steps in the order they happen.</p>
      <div class="gm-order"><div><span class="eyebrow">STEPS</span>${left.map(i => `<button class="gm-step" data-action="gm-ord" data-i="${i}" ${c.done ? 'disabled' : ''}>${esc(st[i])}</button>`).join('') || '<p class="source">All placed.</p>'}</div>
      <div><span class="eyebrow">YOUR ORDER</span><ol class="gm-seq">${c.picked.map((i, pos) => `<li class="${c.done ? (i === pos ? 'ok' : 'bad') : ''}">${esc(st[i])}${c.done && i !== pos ? `<small>Should be: ${esc(st[pos])}</small>` : ''}</li>`).join('')}</ol>
      ${!c.done && c.picked.length ? '<button class="text-button" data-action="gm-ord-undo">Undo last</button>' : ''}</div></div>
      ${c.done ? `<div class="actions"><button class="primary" data-action="gm-ord-next">${c.rounds + 1 >= 3 ? 'See results →' : 'Next set →'}</button></div>` : ''}`);
  }
  function orderTap(i) {
    const c = cur; if (c.done || c.picked.includes(i)) return; c.picked.push(i); S().sound('select');
    if (c.picked.length === c.set.steps.length) {
      c.done = true; const right = c.picked.filter((v, p) => v === p).length, ok = right === c.picked.length;
      c.score += right; c.total += c.picked.length; rec('order-' + c.set.id, c.set.topic, ok); S().sound(ok ? 'correct' : 'incorrect');
      if (!ok) c.misses.push([c.set.title, c.set.steps.join(' → ')]);
    }
    orderView();
  }
  function orderNext() { const c = cur; c.rounds++; if (c.rounds >= 3) { const x = c; stop(); results('order', x.score, x.total, x.misses, ' of steps in the right spot'); } else orderStart(); }

  /* ================= Odd one out ================= */
  function oddStart() { cur = { g: 'odd', queue: shuffle(D().odd).slice(0, 8), i: 0, right: 0, misses: [] }; oddQ(); keys(); }
  function oddQ(fb) {
    const c = cur, q = c.queue[c.i]; if (!c.order || !fb) c.order = shuffle([0, 1, 2, 3]);
    frame('odd', `<div class="gm-progress"><span style="width:${c.i / c.queue.length * 100}%"></span></div><p class="eyebrow">${c.i + 1} OF ${c.queue.length} · WHICH ONE DOESN’T BELONG?</p>
      <div class="gm-odd">${c.order.map((k, n) => `<button class="gm-tile ${fb ? (k === q.odd ? 'right' : k === fb.pick ? 'wrong' : 'dim') : ''}" data-action="gm-odd" data-k="${k}" ${fb ? 'disabled' : ''}><kbd>${n + 1}</kbd>${esc(q.items[k])}</button>`).join('')}</div>
      ${fb ? `<p class="gm-why"><strong>${fb.ok ? 'Right.' : 'Not that one.'}</strong> ${esc(q.why)}</p><div class="actions"><button class="primary" data-action="gm-odd-next">${c.i + 1 >= c.queue.length ? 'See results →' : 'Next →'}</button></div>` : ''}`);
  }
  function oddAns(k) { const c = cur, q = c.queue[c.i]; if (c.fb) return; const ok = k === q.odd; c.fb = true; rec('odd', q.topic, ok); S().sound(ok ? 'correct' : 'incorrect'); if (ok) c.right++; else c.misses.push([q.items.join(' · '), q.why]); oddQ({ ok, pick: k }); }
  function oddNext() { const c = cur; c.fb = false; if (++c.i >= c.queue.length) { const x = c; stop(); results('odd', x.right, x.queue.length, x.misses); } else oddQ(); }

  /* ================= Swipe true / false ================= */
  function swipeDeck() {
    const cur3 = (D()?.swipe || []).map(([t, v, why]) => ({ text: t, truth: v, why, topic: 'payroll', tag: 'tf' }));
    const mc = shuffle(S().data.questions.filter(q => q.prompt.length < 150)).slice(0, 30).map(q => {
      const truth = Math.random() < 0.5, oi = truth ? q.answer : pick(q.options.map((_, i) => i).filter(i => i !== q.answer));
      return { q: q.prompt, a: q.options[oi], truth, why: truth ? '' : 'Answer: ' + q.options[q.answer], topic: q.topic, tag: 'mc' };
    });
    return shuffle([...shuffle(cur3).slice(0, 9), ...mc]).slice(0, 15);
  }
  function swipeStart() { cur = { g: 'swipe', deck: swipeDeck(), i: 0, right: 0, misses: [], t0: Date.now() }; swipeQ(); keys(); }
  function swipeQ(fb) {
    const c = cur, it = c.deck[c.i];
    frame('swipe', `<div class="gm-progress"><span style="width:${c.i / c.deck.length * 100}%"></span></div><p class="eyebrow">${c.i + 1} OF ${c.deck.length} · ${c.right} RIGHT</p>
      <div class="gm-swipe-wrap"><div class="gm-swipe ${fb ? (fb.ok ? 'ok' : 'bad') : ''}" id="gm-swipe">${it.text ? `<p>${esc(it.text)}</p>` : `<p class="gm-sq">${esc(it.q)}</p><p class="gm-sa">${esc(it.a)}</p>`}
        ${fb ? `<div class="gm-verdict">${it.truth ? 'TRUE' : 'FALSE'}${it.why ? `<small>${esc(it.why)}</small>` : ''}</div>` : '<span class="gm-hint-l">FALSE</span><span class="gm-hint-r">TRUE</span>'}</div></div>
      <div class="gm-tf"><button class="gm-false" data-action="gm-tf" data-v="0" ${fb ? 'disabled' : ''}>← False</button><button class="gm-true" data-action="gm-tf" data-v="1" ${fb ? 'disabled' : ''}>True →</button></div>
      ${fb && !fb.ok ? '<div class="actions"><button class="primary" data-action="gm-tf-next">Next →</button></div>' : ''}`);
    if (!fb) drag();
  }
  function drag() {
    const el = $('#gm-swipe'); if (!el) return; let x0 = null, dx = 0;
    el.addEventListener('pointerdown', e => { x0 = e.clientX; dx = 0; el.setPointerCapture(e.pointerId); el.style.transition = 'none'; });
    el.addEventListener('pointermove', e => { if (x0 == null) return; dx = e.clientX - x0; el.style.transform = `translateX(${dx}px) rotate(${dx / 20}deg)`; el.dataset.lean = dx > 40 ? 'r' : dx < -40 ? 'l' : ''; });
    const end = () => { if (x0 == null) return; x0 = null; el.style.transition = ''; if (Math.abs(dx) > 90) swipeAns(dx > 0); else { el.style.transform = ''; el.dataset.lean = ''; } };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  }
  function swipeAns(v) {
    const c = cur; if (!c || c.wait) return; const it = c.deck[c.i], ok = v === it.truth; c.wait = true;
    rec('tf-' + it.tag, it.topic, ok); S().sound(ok ? 'correct' : 'incorrect');
    if (ok) c.right++; else c.misses.push([it.text || (it.q + ' → ' + it.a), (it.truth ? 'True. ' : 'False. ') + (it.why || '')]);
    swipeQ({ ok }); if (ok) timer = setTimeout(swipeNext, 650);
  }
  function swipeNext() { const c = cur; if (!c) return; c.wait = false; if (++c.i >= c.deck.length) { const x = c, s = Math.round((Date.now() - x.t0) / 1000); stop(); results('swipe', x.right, x.deck.length, x.misses, ` · ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`); } else swipeQ(); }

  /* ================= Memory match ================= */
  function memoryPairs() {
    if (D()?.pairs) return D().pairs;
    return S().data.flashcards.filter(c => c.front.length <= 32 && c.back.length <= 44).map(c => [c.front, c.back]);
  }
  function memStart() {
    const pairs = shuffle(memoryPairs()).slice(0, 6), tiles = shuffle(pairs.flatMap((p, i) => [{ p: i, t: p[0], k: 'a' }, { p: i, t: p[1], k: 'b' }]));
    cur = { g: 'memory', pairs, tiles, open: [], matched: new Set(), moves: 0, t0: Date.now() }; memView();
  }
  function memView() {
    const c = cur;
    frame('memory', `<p class="eyebrow">${c.matched.size} OF ${c.pairs.length} PAIRS · ${c.moves} MOVES</p>
      <div class="gm-mem">${c.tiles.map((t, i) => { const up = c.open.includes(i) || c.matched.has(t.p); return `<button class="gm-mt ${up ? 'up' : ''} ${c.matched.has(t.p) ? 'got' : ''} ${t.k}" data-action="gm-mem" data-i="${i}" ${up ? 'disabled' : ''} aria-label="${up ? esc(t.t) : 'Hidden tile'}"><span>${up ? esc(t.t) : '?'}</span></button>`; }).join('')}</div>`);
  }
  function memTap(i) {
    const c = cur; if (c.open.length >= 2 || c.open.includes(i)) return; c.open.push(i); S().sound('select'); memView();
    if (c.open.length === 2) {
      c.moves++; const [a, b] = c.open.map(k => c.tiles[k]);
      if (a.p === b.p) { c.matched.add(a.p); c.open = []; S().sound('correct'); timer = setTimeout(() => { memView(); if (c.matched.size === c.pairs.length) memDone(); }, 350); }
      else timer = setTimeout(() => { c.open = []; memView(); }, 900);
    }
  }
  function memDone() {
    // Every round ends with all pairs found, so the score is how few moves it took: 6 is perfect, ~12 is typical.
    const c = cur, s = Math.round((Date.now() - c.t0) / 1000), par = c.pairs.length, ok = c.moves <= par * 2;
    rec('memory', 'payroll', ok); stop();
    const stars = c.moves <= par + 3 ? 3 : c.moves <= par * 2 + 1 ? 2 : 1, pct = Math.max(10, Math.min(100, Math.round(100 - (c.moves - par) * 6)));
    results('memory', par, par, [], ` · ${'★'.repeat(stars)}${'☆'.repeat(3 - stars)} · ${c.moves} moves (perfect is ${par}) · ${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`, pct);
  }

  /* ================= Find the mistake ================= */
  const BR = [[0, 0.10, 0], [11925, 0.12, 1193], [48475, 0.22, 5579], [103350, 0.24, 17651], [197300, 0.32, 40199], [250525, 0.35, 57231], [626350, 0.37, 188770]];
  const fed = x => { let b = BR[0]; for (const r of BR) if (x > r[0]) b = r; return { tax: r2(b[2] + b[1] * (x - b[0])), b }; };
  const M = [
    () => { const x = rand(55, 98) * 1000 + rand(1, 9) * 100, { tax, b } = fed(x), wrong = r2(x * b[1]);
      return { topic: 'payroll', title: 'Federal tax from brackets', prompt: `Taxable income is $${num(x)} (single, 2025). Find the federal income tax.`,
        steps: [`$${num(x)} is between $48,476 and $103,350 → the 22% bracket.`, `Tax = 22% × $${num(x)} = ${money(wrong)}.`, `Federal income tax = ${money(wrong)}.`], bad: 1,
        fix: `Tax = 5,579 + 0.22 × (${num(x)} − 48,475) = ${money(tax)}.`, why: 'Only the dollars above the bracket floor get 22%. Use base + rate × (taxable − floor).' }; },
    () => { const g = rand(18, 52) * 100, ss = r2(g * 0.062), medW = r2((g - ss) * 0.0145), med = r2(g * 0.0145);
      return { topic: 'payroll', title: 'Social Security & Medicare', prompt: `Gross pay is $${num(g)}. Find Social Security and Medicare.`,
        steps: [`Social Security = 6.2% × $${num(g)} = ${money(ss)}.`, `Medicare = 1.45% × ($${num(g)} − ${money(ss)}) = 1.45% × ${money(g - ss)} = ${money(medW)}.`, `Total FICA = ${money(ss)} + ${money(medW)} = ${money(ss + medW)}.`], bad: 1,
        fix: `Medicare = 1.45% × $${num(g)} (gross) = ${money(med)}. Total FICA = ${money(ss + med)}.`, why: 'Both percentages come off GROSS, never off a running balance.' }; },
    () => { const mid = rand(45, 80) * 1000, rd = pick([0.15, 0.2, 0.25]), min = Math.round(mid * (1 - rd)), pay = Math.round(mid * pick([0.82, 0.9, 1.06, 1.12]) / 100) * 100, wrong = r2(pay / min), right = r2(pay / mid);
      return { topic: 'compa', title: 'Compa-ratio', prompt: `An employee earns $${num(pay)}. The range is $${num(min)} (min) to $${num(Math.round(mid * (1 + rd)))} (max), midpoint $${num(mid)}. Find the compa-ratio.`,
        steps: [`Compa-ratio compares pay with the range.`, `Compa-ratio = $${num(pay)} ÷ $${num(min)} = ${wrong.toFixed(2)}.`, `${wrong.toFixed(2)} ${wrong > 1.25 ? 'is above 1.25 → freeze increases' : 'is inside 0.75–1.25'}.`], bad: 1,
        fix: `Compa-ratio = $${num(pay)} ÷ $${num(mid)} (midpoint) = ${right.toFixed(2)}.`, why: 'Divide by the range MIDPOINT (or the market rate), never the minimum.' }; },
    () => { const g = rand(14, 32) * 100, pre = pick([100, 150, 200]), tx = g - pre, wrongA = tx * 12, rightA = tx * 26, rt = fed(rightA).tax;
      return { topic: 'payroll', title: 'Per-paycheck federal tax', prompt: `A single employee is paid $${num(g)} bi-weekly with $${pre} of before-tax deductions. Find federal tax per paycheck.`,
        steps: [`Taxable per paycheck = $${num(g)} − $${pre} = $${num(tx)}.`, `Annual taxable = $${num(tx)} × 12 = $${num(wrongA)}.`, `Look up the bracket and compute the annual tax.`, `Divide the annual tax by the number of paychecks.`], bad: 1,
        fix: `Bi-weekly is 26 paychecks: $${num(tx)} × 26 = $${num(rightA)} → tax ${money(rt)} ÷ 26 = ${money(r2(rt / 26))}.`, why: 'Annualize with the right count: monthly ×12 · semi-monthly ×24 · bi-weekly ×26 · weekly ×52.' }; },
    () => { const g = rand(30, 70) * 100, pre = pick([150, 200, 250, 300]), il = r2((g - pre) * 0.0495), wrong = r2(g * 0.0495);
      return { topic: 'payroll', title: 'Illinois income tax', prompt: `Monthly gross is $${num(g)}. Before-tax deductions are $${pre}. Find Illinois income tax.`,
        steps: [`Illinois is a flat 4.95%.`, `Illinois tax = 4.95% × $${num(g)} = ${money(wrong)}.`, `Subtract it along with the other taxes.`], bad: 1,
        fix: `Taxable pay = $${num(g)} − $${pre} = $${num(g - pre)} → 4.95% = ${money(il)}.`, why: 'Income tax (federal and Illinois) is figured on taxable pay, after before-tax deductions.' }; },
    () => { const rate = rand(32, 52) / 2, h = rand(43, 50), reg = 40 * rate, ot = (h - 40) * rate * 1.5, wrong = r2(h * rate * 1.5);
      return { topic: 'payroll', title: 'Overtime gross pay', prompt: `A non-exempt worker earns ${money(rate)}/hour and worked ${h} hours (1.5× over 40). Find gross pay.`,
        steps: [`Overtime applies because hours are over 40.`, `Gross = ${h} × ${money(rate)} × 1.5 = ${money(wrong)}.`, `Take FICA off that gross.`], bad: 1,
        fix: `Regular 40 × ${money(rate)} = ${money(reg)} + overtime ${h - 40} × ${money(rate)} × 1.5 = ${money(ot)} → gross ${money(reg + ot)}.`, why: 'Only the hours OVER 40 get time-and-a-half.' }; },
    () => { const base = rand(40, 90) * 10000, q = rand(4, 12) * 10000, lti = rand(30, 70) * 100000, ben = rand(20, 50) * 10000, perk = rand(10, 40) * 10000, wrong = base + q + lti + ben + perk, right = wrong + 3 * q;
      return { topic: 'exec', title: 'Executive total compensation', prompt: `Base $${num(base)}; bonus $${num(q)} per quarter; LTI $${num(lti)}; benefits $${num(ben)}; perks $${num(perk)}. Find total compensation.`,
        steps: [`List the five components.`, `Total = ${num(base)} + ${num(q)} + ${num(lti)} + ${num(ben)} + ${num(perk)} = $${num(wrong)}.`, `Base % = ${num(base)} ÷ ${num(wrong)} = ${(base / wrong * 100).toFixed(2)}%.`], bad: 1,
        fix: `Annualize the bonus first: ${num(q)} × 4 = ${num(q * 4)}. Total = $${num(right)}.`, why: 'A quarterly bonus counts 4 times a year. Annualize before adding.' }; },
    () => { const w = rand(150, 190) * 10, cap = 966.78, raw = r2(2 / 3 * w);
      return { topic: 'benefits', title: 'Workers’ comp weekly benefit', prompt: `A New York claimant earned $${num(w)}/week and is 100% disabled. Benefit = 2/3 × wage × % disability, state max $966.78.`,
        steps: [`2/3 × $${num(w)} × 1.00 = ${money(raw)}.`, `Weekly benefit = ${money(raw)}.`], bad: 1,
        fix: `${money(raw)} is over the $966.78 cap → the benefit is $966.78.`, why: 'The state maximum caps the benefit for high earners.' }; },
    () => { const n = rand(4, 20), wage = rand(25, 60) * 1000, wrong = r2(0.006 * wage * n);
      return { topic: 'benefits', title: 'FUTA', prompt: `${n} employees each earn $${num(wage)}. FUTA is 0.6% of the first $7,000 per worker. Find total FUTA.`,
        steps: [`FUTA rate = 0.6%.`, `Per worker = 0.006 × $${num(wage)} = ${money(0.006 * wage)}.`, `Total = ${money(0.006 * wage)} × ${n} = ${money(wrong)}.`], bad: 1,
        fix: `Only the first $7,000 counts: 0.006 × 7,000 = $42 × ${n} = ${money(42 * n)}.`, why: 'FUTA stops at the first $7,000 each worker earns.' }; },
    () => { const mid = rand(50, 75) * 1000, pays = [0.84, 0.97, 1.08, 1.19].map(r => Math.round(mid * r / 100) * 100), sum = pays.reduce((a, b) => a + b, 0), wrong = r2(sum / mid), right = r2(sum / 4 / mid);
      return { topic: 'compa', title: 'Group compa-ratio', prompt: `Four pays in a grade: ${pays.map(p => '$' + num(p)).join(', ')}. Midpoint $${num(mid)}. Find the group compa-ratio.`,
        steps: [`Sum of pay = $${num(sum)}.`, `Group compa-ratio = $${num(sum)} ÷ $${num(mid)} = ${wrong.toFixed(2)}.`, `Compare with 0.75–1.25.`], bad: 1,
        fix: `Average first: $${num(sum)} ÷ 4 = $${num(sum / 4)} → ÷ $${num(mid)} = ${right.toFixed(2)}.`, why: 'Average all the pays, then divide by the midpoint once.' }; },
    () => { const rate = rand(36, 50) / 2, h = rand(32, 42), base = r2(rate * h), wrong = r2(base + 25), right = r2(base * 1.25);
      return { topic: 'flex', title: 'Leased worker cost', prompt: `A leased worker costs ${money(rate)}/hour for ${h} hours with a 25% agency fee. What does the client pay?`,
        steps: [`Wages = ${money(rate)} × ${h} = ${money(base)}.`, `Add the 25% fee: ${money(base)} + 25 = ${money(wrong)}.`, `The agency issues the W-2.`], bad: 1,
        fix: `25% of the wages: ${money(base)} × 1.25 = ${money(right)}.`, why: 'A 25% fee is a percentage of the wages, so multiply by 1.25.' }; }
  ];
  function misStart() { cur = { g: 'mistake', queue: shuffle(M).slice(0, 5).map(f => f()), i: 0, right: 0, misses: [] }; misQ(); keys(); }
  function misQ(fb) {
    const c = cur, p = c.queue[c.i];
    frame('mistake', `<div class="gm-progress"><span style="width:${c.i / c.queue.length * 100}%"></span></div><p class="eyebrow">${c.i + 1} OF ${c.queue.length} · ${esc(p.title.toUpperCase())}</p>
      <div class="panel"><p class="gm-prompt">${esc(p.prompt)}</p><p class="source">One step is wrong. Tap it.</p>
      <ol class="gm-steps">${p.steps.map((s, k) => `<li><button class="gm-st ${fb ? (k === p.bad ? 'wrong-step' : k === fb.pick ? 'picked' : '') : ''}" data-action="gm-mis" data-k="${k}" ${fb ? 'disabled' : ''}><kbd>${k + 1}</kbd>${esc(s)}</button></li>`).join('')}</ol>
      ${fb ? `<div class="gm-fix ${fb.ok ? 'ok' : 'bad'}"><strong>${fb.ok ? 'Found it.' : `It was step ${p.bad + 1}.`}</strong><p>${esc(p.fix)}</p><p class="source">${esc(p.why)}</p></div><div class="actions"><button class="primary" data-action="gm-mis-next">${c.i + 1 >= c.queue.length ? 'See results →' : 'Next →'}</button></div>` : ''}</div>`);
  }
  function misAns(k) { const c = cur, p = c.queue[c.i]; if (c.fb) return; c.fb = true; const ok = k === p.bad; rec('mistake', p.topic, ok); S().sound(ok ? 'correct' : 'incorrect'); if (ok) c.right++; else c.misses.push([p.title, p.why]); misQ({ ok, pick: k }); }
  function misNext() { const c = cur; c.fb = false; if (++c.i >= c.queue.length) { const x = c; stop(); results('mistake', x.right, x.queue.length, x.misses); } else misQ(); }

  /* ================= Build the paycheck ================= */
  const PER = [['monthly', 12], ['bi-weekly', 26], ['semi-monthly', 24]];
  function payMake(kind) {
    const [label, n] = pick(PER), gross = n === 12 ? rand(30, 70) * 100 : rand(14, 34) * 100;
    const before = shuffle([['401(k)', pick([50, 75, 100, 150, 200])], ['Health insurance', pick([60, 85, 110, 140])], ['HSA', pick([25, 40, 50])]]).slice(0, rand(1, 2));
    const after = shuffle([['Roth 401(k)', pick([25, 50, 100])], ['Union dues', pick([20, 30, 45])], ['Charity', pick([10, 15, 25])]]).slice(0, rand(0, 2));
    const pre = before.reduce((a, b) => a + b[1], 0), taxable = gross - pre, ss = r2(gross * 0.062), med = r2(gross * 0.0145);
    const fedTax = kind === 'compute' ? r2(fed(taxable * n).tax / n) : Math.round(fed(taxable * n).tax / n);
    const il = r2(taxable * 0.0495), post = after.reduce((a, b) => a + b[1], 0);
    const rows = [['pre', 'Before-tax deductions (total)', pre, before.map(b => b[0]).join(' + ') + (before.length > 1 ? ' come' : ' comes') + ' out before taxes.']];
    if (kind === 'compute') rows.push(['taxable', 'Taxable pay', taxable, `Gross − before-tax = ${num(gross)} − ${num(pre)}.`]);
    rows.push(['ss', 'Social Security (6.2%)', ss, `6.2% × gross ${num(gross)}.`], ['med', 'Medicare (1.45%)', med, `1.45% × gross ${num(gross)}. Off gross, not the balance.`]);
    if (kind === 'compute') rows.push(['fed', 'Federal income tax', fedTax, `${num(taxable)} × ${n} = ${num(taxable * n)}/yr → bracket tax ${money(fed(taxable * n).tax)} ÷ ${n}.`], ['il', 'Illinois income tax (4.95%)', il, `4.95% × taxable ${num(taxable)}.`]);
    if (after.length) rows.push(['post', 'After-tax deductions (total)', post, after.map(a => a[0]).join(' + ') + (after.length > 1 ? ' come' : ' comes') + ' out after taxes.']);
    const net = r2(gross - pre - ss - med - fedTax - (kind === 'compute' ? il : 0) - post);
    rows.push(['net', 'Net pay', net, kind === 'compute' ? 'Gross − before-tax − SS − Medicare − federal − Illinois − after-tax.' : 'Gross − before-tax − SS − Medicare − income tax withheld − after-tax.']);
    return { kind, label, n, gross, before, after, fedTax, rows, i: 0, ans: [] };
  }
  function payPick() {
    S().setPage('g-pay');
    frame('pay', `<div class="panel"><h2>Pick a pay stub</h2><div class="gm-sets">
      <button class="primary" data-action="gm-pay-go" data-kind="given">Tax is given <small>The professor’s practice-set style: subtract the withholding he gives you.</small></button>
      <button data-action="gm-pay-go" data-kind="compute">Compute the taxes <small>Payroll update: federal from the brackets, Illinois at 4.95%.</small></button></div></div>`);
  }
  function payStart(kind) { cur = { g: 'pay', kind, stub: payMake(kind), round: 0, score: 0, total: 0, misses: [] }; payView(); }
  function payView() {
    const c = cur, s = c.stub, done = s.i >= s.rows.length;
    const items = `<ul class="gm-given"><li><span>Gross pay (${s.label})</span><b>${money(s.gross)}</b></li>${s.before.map(b => `<li><span>Before-tax · ${esc(b[0])}</span><b>${money(b[1])}</b></li>`).join('')}${s.kind === 'given' ? `<li><span>Federal income tax withheld</span><b>${money(s.fedTax)}</b></li>` : ''}${s.after.map(a => `<li><span>After-tax · ${esc(a[0])}</span><b>${money(a[1])}</b></li>`).join('')}</ul>`;
    const table = s.kind === 'compute' ? `<details class="gm-brackets"><summary>2025 brackets (single)</summary><table class="ws"><tr><th>Rate</th><th>Over</th><th>Base</th></tr>${BR.map(r => `<tr><td>${Math.round(r[1] * 100)}%</td><td>${num(r[0])}</td><td>${num(r[2])}</td></tr>`).join('')}</table></details>` : '';
    frame('pay', `<p class="eyebrow">PAY STUB ${c.round + 1} OF 2 · ${s.kind === 'given' ? 'TAX GIVEN' : 'COMPUTE THE TAXES'}</p>
      <div class="gm-paygrid"><div class="panel"><h2>What you know</h2>${items}${table}</div>
      <div class="panel gm-stub"><h2>Pay stub</h2><div class="gm-row given"><span>Gross pay</span><b>${money(s.gross)}</b></div>
      ${s.rows.map((r, k) => { const a = s.ans[k]; if (k < s.i) return `<div class="gm-row ${a.ok ? 'ok' : 'bad'}"><span>${esc(r[1])}</span><b>${money(r[2])}</b>${a.ok ? '' : `<small>You had ${esc(a.v)}. ${esc(r[3])}</small>`}</div>`;
        if (k === s.i) return `<form class="gm-row now" id="gm-pay-form"><label for="gm-pay-in">${esc(r[1])}</label><input id="gm-pay-in" inputmode="decimal" autocomplete="off" placeholder="0.00"><button class="primary" type="submit">Check</button></form>`;
        return `<div class="gm-row later"><span>${esc(r[1])}</span><b>—</b></div>`; }).join('')}
      ${done ? `<div class="actions"><button class="primary" data-action="gm-pay-next">${c.round + 1 >= 2 ? 'See results →' : 'Next pay stub →'}</button></div>` : ''}</div></div>`);
    const f = $('#gm-pay-form'); if (f) { f.addEventListener('submit', e => { e.preventDefault(); payCheck($('#gm-pay-in').value); }); setTimeout(() => $('#gm-pay-in')?.focus(), 30); }
  }
  function payCheck(v) {
    const c = cur, s = c.stub, r = s.rows[s.i], x = Number(String(v).replace(/[$,\s]/g, ''));
    if (String(v).trim() === '' || !Number.isFinite(x)) { S().toast('Type a number, like 1234.56'); return; }
    const ok = Math.abs(x - r[2]) <= 0.02; s.ans[s.i] = { ok, v: money(x) }; s.i++; c.total++; if (ok) c.score++; else c.misses.push([r[1], `${money(r[2])}: ${r[3]}`]);
    S().sound(ok ? 'correct' : 'incorrect'); if (s.i >= s.rows.length) rec('pay-' + s.kind, 'payroll', s.ans.every(a => a.ok)); payView();
  }
  function payNext() { const c = cur; c.round++; if (c.round >= 2) { const x = c; stop(); results('pay', x.score, x.total, x.misses, ' of lines right'); } else { c.stub = payMake(c.kind); payView(); } }

  /* ================= keyboard ================= */
  function keys() { document.removeEventListener('keydown', onKey); document.addEventListener('keydown', onKey); }
  function onKey(e) {
    if (!cur || !onGamePage() || e.target.closest('input,textarea,select')) return; const n = +e.key;
    if (cur.g === 'sort' && n >= 1 && n <= cur.set.buckets.length && !cur.wait) sortAns(n - 1);
    else if (cur.g === 'odd' && n >= 1 && n <= 4 && !cur.fb) oddAns(cur.order[n - 1]);
    else if (cur.g === 'mistake' && n >= 1 && n <= cur.queue[cur.i].steps.length && !cur.fb) misAns(n - 1);
    else if (cur.g === 'swipe' && !cur.wait && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) swipeAns(e.key === 'ArrowRight');
    else return; e.preventDefault();
  }

  const starts = { sort: sortPick, mistake: misStart, pay: payPick, order: () => { cur = null; orderStart(); }, swipe: swipeStart, odd: oddStart, memory: memStart };
  window.Games = {
    modes: [['games', 'Game modes', 'Sort, order, swipe, match, find the mistake.', 'cue-match']],
    library: [['games', 'Game modes', 'Seven ways to answer besides A/B/C/D.', 'cue-match', 'play', 'NEW'], ...GAMES.map(([id, name, desc]) => ['g-' + id, name, desc, 'cue-match', 'play', 'GAME'])],
    mode(p) {
      if (p === 'games') { hub(); return true; }
      const m = /^g-(\w+)$/.exec(p); if (!m || !starts[m[1]]) { if (cur) stop(); return false; }
      const g = GAMES.find(x => x[0] === m[1]); stop();
      if (g[4] && !curatedOK()) { hub(); S().toast('That game is made for Exam 3. Switch exams in the sidebar.'); return true; }
      S().setPage('g-' + m[1]); starts[m[1]](); return true;
    },
    handle(a, b) {
      if (!a.startsWith('gm-')) return false;
      if (a === 'gm-again') { const id = b.dataset.game; S().setPage('g-' + id); starts[id](); }
      else if (a === 'gm-sort-go') sortStart(b.dataset.set);
      else if (a === 'gm-sort') sortAns(+b.dataset.k);
      else if (a === 'gm-sort-next') sortNext();
      else if (a === 'gm-ord') orderTap(+b.dataset.i);
      else if (a === 'gm-ord-undo') { cur.picked.pop(); orderView(); }
      else if (a === 'gm-ord-next') orderNext();
      else if (a === 'gm-odd') oddAns(+b.dataset.k);
      else if (a === 'gm-odd-next') oddNext();
      else if (a === 'gm-tf') swipeAns(b.dataset.v === '1');
      else if (a === 'gm-tf-next') swipeNext();
      else if (a === 'gm-mem') memTap(+b.dataset.i);
      else if (a === 'gm-mis') misAns(+b.dataset.k);
      else if (a === 'gm-mis-next') misNext();
      else if (a === 'gm-pay-go') payStart(b.dataset.kind);
      else if (a === 'gm-pay-next') payNext();
      return true;
    },
    _mistakes: M, _pay: payMake
  };
})();
