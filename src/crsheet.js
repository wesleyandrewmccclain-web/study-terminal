/* Compa-Ratio worksheet: the 10/5 Compa-Ratio Exercise, cell by cell (plus a "New numbers" version).
   Class conventions: the midpoint differential belongs to the grade you move INTO (up: × (1 + diff), down: ÷ (1 + diff));
   pay-table numbers use normal rounding; dollar cells accept ±$1, compa-ratios accept 2-decimal answers.
   Problem 1 reads "ideal pay rate" as the grade midpoint, so CR = midpoint ÷ market average (key pending, 10/7). */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (v, d = 2) => Number(v).toLocaleString('en-US', { maximumFractionDigits: d });
  const r = v => Math.round(v + 1e-9);
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = a => a[rand(0, a.length - 1)];
  const parse = v => Number(String(v ?? '').replace(/[$,%\s]/g, ''));
  const gradeOf = pts => Math.max(1, Math.ceil(pts / 200));
  const exam = () => Number(S().data?.exam || window.ACTIVE_EXAM || 2);

  const CLASS = {
    title: 'Class sheet · MGT 354 Compa-Ratio Exercise (10/5)',
    p1: { mid3: 57964, diff: [0, 10, 10, 10, 10], rd: [15, 15, 15, 20, 20],
      jobs: [['Employment Consultant', 425, [['ISU', 48752], ['UIUC', 50247], ['IWU', 45132]]],
        ['IT Specialist', 340, [['UIUC', 48356], ['IWU', 53215], ['ISU', 46587]]],
        ['Accountant II', 780, [['IWU', 59134], ['ISU', 54326], ['UIUC', 56794]]]] },
    p2: { mid3: 67860, diff: [0, 10, 15, 17, 20], rd: [12, 14, 17, 20, 20],
      jobs: [['Job A', 700, 59780], ['Job B', 900, 69840], ['Job C', 300, 51655]] }
  };

  /* Midpoints from Grade 3: up × (1 + diff of the grade above), down ÷ (1 + diff of the grade you leave). */
  function table(p) {
    const mid = []; mid[2] = p.mid3;
    mid[3] = r(mid[2] * (1 + p.diff[3] / 100)); mid[4] = r(mid[3] * (1 + p.diff[4] / 100));
    mid[1] = r(mid[2] / (1 + p.diff[2] / 100)); mid[0] = r(mid[1] / (1 + p.diff[1] / 100));
    return mid.map((m, i) => ({ g: i + 1, mid: m, rd: p.rd[i], min: r(m * (1 - p.rd[i] / 100)), max: r(m * (1 + p.rd[i] / 100)) }));
  }
  const act = cr => cr < 0.75 ? 'Raise' : cr > 1.25 ? 'Freeze' : 'OK';
  function solve(sh) {
    const t1 = table(sh.p1), t2 = table(sh.p2);
    const j1 = sh.p1.jobs.map(([name, pts, pays]) => { const g = gradeOf(pts), mkt = pays.reduce((a, [, v]) => a + v, 0) / pays.length, mid = t1[g - 1].mid; return { name, pts, pays, g, mkt, mid, cr: mid / r(mkt) }; });
    const j2 = sh.p2.jobs.map(([name, pts, pay]) => { const g = gradeOf(pts), row = t2[g - 1]; return { name, pts, pay, g, mid: row.mid, min: row.min, cr: pay / row.mid, gap: row.mid - pay }; });
    const out = j1.filter(j => j.cr < 0.75 || j.cr > 1.25);
    return { t1, t2, j1, j2, change: out.length ? 'Change Grade ' + [...new Set(out.map(j => j.g))].join(' & ') : 'No change' };
  }
  function cells(sol) {
    const c = {}, $c = (a, tol = 1) => ({ answer: a, tol }), crc = a => ({ answer: a, tol: 0.0051, cr: true });
    sol.t1.forEach((row, i) => { if (i !== 2) c['a_mid' + i] = $c(row.mid); c['a_min' + i] = $c(row.min); c['a_max' + i] = $c(row.max); });
    sol.j1.forEach((j, i) => { c['a_g' + i] = $c(j.g, 0); c['a_mkt' + i] = $c(r(j.mkt)); c['a_cr' + i] = crc(j.cr); });
    c.a_dec = { choice: sol.change, options: [...new Set(['No change', ...sol.j1.map(j => 'Change Grade ' + j.g).sort(), sol.change])] };
    sol.t2.forEach((row, i) => { if (i !== 2) c['b_mid' + i] = $c(row.mid); c['b_min' + i] = $c(row.min); c['b_max' + i] = $c(row.max); });
    sol.j2.forEach((j, i) => { c['b_g' + i] = $c(j.g, 0); c['b_cr' + i] = crc(j.cr); c['b_gap' + i] = $c(j.gap); c['b_act' + i] = { choice: act(j.cr), options: ['Raise', 'OK', 'Freeze'] }; });
    return c;
  }
  function grade(cell, v) {
    if (String(v ?? '').trim() === '') return null;
    if (cell.choice) return v === cell.choice;
    const x = parse(v); if (!Number.isFinite(x)) return false;
    return Math.abs(x - cell.answer) <= cell.tol + 1e-6;
  }
  const show = cell => cell.choice ? cell.choice : cell.cr ? cell.answer.toFixed(2) : fmt(cell.answer);

  function genSheet() {
    const p = () => ({ mid3: rand(480, 720) * 100 + rand(0, 99), diff: [0, ...Array.from({ length: 4 }, () => pick([8, 10, 12, 15, 17, 20]))], rd: [pick([10, 12, 15]), pick([12, 14, 15]), pick([15, 17]), pick([18, 20]), pick([20, 25])] });
    const p1 = p(), p2 = p();
    const t1 = table(p1), t2 = table(p2);
    const names1 = ['Payroll Specialist', 'HR Generalist', 'Benefits Analyst', 'Recruiter', 'Systems Analyst', 'Accountant I'];
    const shuffled = names1.sort(() => Math.random() - .5);
    const schools = ['ISU', 'IWU', 'UIUC'];
    p1.jobs = [0, 1, 2].map(i => { const pts = rand(1, 4) * 200 + rand(5, 190), g = gradeOf(pts), mid = t1[g - 1].mid; const target = mid / pick([0.7, 0.85, 0.95, 1.05, 1.15, 1.3]); return [shuffled[i], pts, schools.map(s => [s, r(target * (0.92 + Math.random() * 0.16))])]; });
    p2.jobs = ['Job A', 'Job B', 'Job C'].map(n => { const pts = rand(20, 990), g = gradeOf(pts); return [n, pts, r(t2[g - 1].mid * pick([0.7, 0.73, 0.8, 0.9, 1.0, 1.1, 1.3]) / 5) * 5]; });
    return { title: 'New numbers · same steps as the 10/5 exercise', p1, p2 };
  }

  const st = () => { const s = S().state; if (!s.crsheet) s.crsheet = { kind: 'class', gen: null, vals: {}, checked: false, reveal: false }; return s.crsheet; };
  const current = () => { const w = st(); if (w.kind === 'gen' && !w.gen) w.gen = genSheet(); return w.kind === 'gen' ? w.gen : CLASS; };

  function page(keep) {
    if (!keep || S().page !== 'crsheet') S().setPage('crsheet');
    if (exam() !== 3) { $('#app').innerHTML = S().heading('', 'Compa-ratio worksheet', 'This worksheet is for Exam 3. Switch exams at the top to use it.'); return; }
    const w = st(), sh = current(), sol = solve(sh), C = cells(sol);
    const inp = id => {
      const cell = C[id], v = w.vals[id] ?? '', res = w.checked ? grade(cell, v) : null;
      const cls = res === true ? 'ok' : res === false ? 'bad' : w.checked ? 'blank' : '';
      const note = (w.checked && res !== true) || w.reveal ? `<small>${res === true ? '' : '→ ' + esc(show(cell))}</small>` : '';
      if (cell.choice) return `<span class="ws-cell ${cls}"><select data-crs="${id}" aria-label="${id}"><option value="">Choose…</option>${cell.options.map(o => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>${note}</span>`;
      return `<span class="ws-cell ${cls}"><input data-crs="${id}" inputmode="decimal" autocomplete="off" value="${esc(v)}" aria-label="${id}">${note}</span>`;
    };
    const ids = Object.keys(C), ok = ids.filter(id => grade(C[id], w.vals[id]) === true).length;
    const gradeRows = (t, p, k) => t.map((row, i) => `<tr><td>${row.g} (${i ? i * 200 + 1 : 0}–${(i + 1) * 200})</td><td>${i ? p.diff[i] + '%' : '—'}</td><td>${row.rd}%</td><td>${inp(k + '_min' + i)}</td><td>${i === 2 ? '<b>' + fmt(row.mid) + '</b>' : inp(k + '_mid' + i)}</td><td>${inp(k + '_max' + i)}</td></tr>`).join('');
    const head = '<thead><tr><th>Grade</th><th>Mid diff</th><th>Range diff</th><th>Minimum</th><th>Midpoint</th><th>Maximum</th></tr></thead>';
    const p1 = `<p class="ws-given">Grade 3 midpoint <b>${fmt(sh.p1.mid3)}</b>. The midpoint differential is the % you go up INTO that grade.</p>
      <div class="table-wrap"><table class="ws">${head}<tbody>${gradeRows(sol.t1, sh.p1, 'a')}</tbody></table></div>
      <h3 class="ws-h3">Market research</h3>
      <div class="table-wrap"><table class="ws"><thead><tr><th>Position</th><th>Market pay</th><th>Grade</th><th>Market average</th><th>Midpoint ÷ market</th></tr></thead><tbody>
      ${sol.j1.map((j, i) => `<tr><td>${esc(j.name)} (${j.pts} pts)</td><td>${j.pays.map(([s, v]) => esc(s) + ' ' + fmt(v)).join('<br>')}</td><td>${inp('a_g' + i)}</td><td>${inp('a_mkt' + i)}</td><td>${inp('a_cr' + i)}</td></tr>`).join('')}</tbody></table></div>
      <p class="ws-given">Recommendation (the company pays the “ideal” rate = the midpoint): ${inp('a_dec')}</p>`;
    const p2 = `<p class="ws-given">Grade 3 midpoint <b>${fmt(sh.p2.mid3)}</b>.</p>
      <div class="table-wrap"><table class="ws">${head}<tbody>${gradeRows(sol.t2, sh.p2, 'b')}</tbody></table></div>
      <h3 class="ws-h3">Your employees</h3>
      <div class="table-wrap"><table class="ws"><thead><tr><th>Job</th><th>Pay</th><th>Grade</th><th>Compa-ratio</th><th>Below (+) / above (−) mid</th><th>Action</th></tr></thead><tbody>
      ${sol.j2.map((j, i) => `<tr><td>${esc(j.name)} (${j.pts} pts)</td><td>${fmt(j.pay)}</td><td>${inp('b_g' + i)}</td><td>${inp('b_cr' + i)}</td><td>${inp('b_gap' + i)}</td><td>${inp('b_act' + i)}</td></tr>`).join('')}</tbody></table></div>`;
    const steps = w.checked || w.reveal ? `<section class="panel ws-part"><details class="ws-steps" open><summary>Worked steps</summary>
      <p><b>Midpoints.</b> Up: mid × (1 + the next grade’s differential). Down: mid ÷ (1 + this grade’s differential), never × (1 − diff). Min = mid × (1 − range diff), max = mid × (1 + range diff). Normal rounding.</p>
      <p><b>Problem 1.</b> ${sol.j1.map(j => `${esc(j.name)}: Grade ${j.g} · market ${fmt(j.pays.reduce((a, [, v]) => a + v, 0))} ÷ 3 = ${fmt(r(j.mkt))} · ${fmt(j.mid)} ÷ ${fmt(r(j.mkt))} = ${j.cr.toFixed(2)}`).join('<br>')}<br>Inside 0.75–1.25 → no change; outside → change that grade’s range. Answer: <b>${esc(sol.change)}</b>.</p>
      <p><b>Problem 2.</b> ${sol.j2.map(j => `${esc(j.name)}: Grade ${j.g} · ${fmt(j.pay)} ÷ ${fmt(j.mid)} = ${j.cr.toFixed(2)} → ${act(j.cr)} · ${j.gap >= 0 ? fmt(j.gap) + ' below' : fmt(-j.gap) + ' above'} the midpoint${j.pay < j.min ? ` · under the grade minimum (${fmt(j.min)}): raise to at least the min` : ''}`).join('<br>')}</p>
      <p class="source">Dollar cells accept ±$1. Compa-ratios accept 2 decimals. Problem 1 uses midpoint ÷ market (the “ideal pay rate” = the midpoint); check this against the 10/7 review.</p></details></section>` : '';
    $('#app').innerHTML = S().heading('CALCULATE / WORKSHEET', 'Compa-Ratio Sheet', 'The 10/5 Compa-Ratio Exercise, cell by cell. Your entries save as you type.',
      `<div class="ws-score">${w.checked ? `<b>${ok}</b> / ${ids.length}<small>cells correct</small>` : `<small>${ids.length} cells</small>`}</div>`) +
      `<section class="panel ws-bar"><div class="ws-switch"><button class="${w.kind === 'class' ? 'primary' : ''}" data-action="crs-kind" data-kind="class">Class sheet</button><button class="${w.kind === 'gen' ? 'primary' : ''}" data-action="crs-kind" data-kind="gen">New numbers</button><button data-action="crw-open" class="wt-launch">▶ Guided walkthrough</button></div>
      <span class="source">${esc(sh.title)}</span></section>
      <section class="panel ws-part"><h2>Problem 1 · Pay grades vs the market</h2>${p1}</section>
      <section class="panel ws-part"><h2>Problem 2 · How far from the midpoint?</h2>${p2}</section>
      ${steps}
      <div class="ws-actions"><button data-action="crs-clear">Clear sheet</button><button data-action="crs-reveal">${w.reveal ? 'Hide answers' : 'Reveal answers'}</button>${w.kind === 'gen' ? '<button data-action="crs-new">New numbers ↻</button>' : ''}<button class="primary" data-action="crs-check">Check sheet →</button></div>`;
  }
  function check() {
    const w = st(), C = cells(solve(current()));
    document.querySelectorAll('[data-crs]').forEach(n => w.vals[n.dataset.crs] = n.value);
    w.checked = true;
    const ids = Object.keys(C), ok = ids.filter(id => grade(C[id], w.vals[id]) === true).length;
    S().record('generated-crsheet', 'compa', ok === ids.length); S().sound(ok === ids.length ? 'correct' : 'incorrect'); S().save(); page(true);
    S().toast(`${ok} of ${ids.length} cells correct`);
  }
  const save = e => { const id = e.target?.dataset?.crs; if (id) { st().vals[id] = e.target.value; S().save(); } };
  document.addEventListener('input', save); document.addEventListener('change', save);

  /* ---------- guided walkthrough: one calculation per step, with a lesson, a hint, and "show me" ---------- */
  let W = null; // { steps, sol } while the walkthrough is open
  const f$ = v => '$' + fmt(v);
  const wst = () => { const w = st(); if (!w.walk) w.walk = { i: 0, vals: {}, status: {} }; return w.walk; };
  function buildSteps(sh) {
    const sol = solve(sh), C = cells(sol), t1 = sol.t1, t2 = sol.t2, p1 = sh.p1, p2 = sh.p2, steps = [];
    const F = (id, label) => ({ id, label, cell: C[id] });
    const add = (part, title, teach, fields, hint, work) => steps.push({ part, title, teach, fields, hint, work });
    // Problem 1
    add(1, 'Go UP one grade', `Every grade’s midpoint comes from the one next to it. Going <b>up</b>, multiply by (1 + the midpoint differential of the grade you move <b>into</b>).<div class="wt-formula">Next mid = mid × (1 + diff)</div>Grade 3’s midpoint is given: <b>${f$(p1.mid3)}</b>. Grade 4’s differential is <b>${p1.diff[3]}%</b>.`,
      [F('a_mid3', 'Grade 4 midpoint')], `${fmt(p1.mid3)} × ${1 + p1.diff[3] / 100}, then round to the nearest dollar.`, `${f$(p1.mid3)} × ${1 + p1.diff[3] / 100} = ${fmt(p1.mid3 * (1 + p1.diff[3] / 100))} → <b>${f$(t1[3].mid)}</b>`);
    add(1, 'Keep going up', `Same move again: Grade 5 = Grade 4’s midpoint × (1 + Grade 5’s differential, <b>${p1.diff[4]}%</b>). Use your rounded Grade 4 number.`,
      [F('a_mid4', 'Grade 5 midpoint')], `${fmt(t1[3].mid)} × ${1 + p1.diff[4] / 100}`, `${f$(t1[3].mid)} × ${1 + p1.diff[4] / 100} = <b>${f$(t1[4].mid)}</b>`);
    add(1, 'Go DOWN one grade', `Going <b>down</b> undoes the step up, so you <b>divide</b> by (1 + the differential of the grade you are leaving). Grade 3’s differential is <b>${p1.diff[2]}%</b>.<div class="wt-formula">Lower mid = mid ÷ (1 + diff)</div>The trap: × (1 − diff) gives the wrong answer (${f$(r(p1.mid3 * (1 - p1.diff[2] / 100)))}).`,
      [F('a_mid1', 'Grade 2 midpoint')], `${fmt(p1.mid3)} ÷ ${1 + p1.diff[2] / 100}`, `${f$(p1.mid3)} ÷ ${1 + p1.diff[2] / 100} = ${fmt(p1.mid3 / (1 + p1.diff[2] / 100))} → <b>${f$(t1[1].mid)}</b>`);
    add(1, 'Down to Grade 1', `Divide Grade 2’s midpoint by (1 + Grade 2’s differential, <b>${p1.diff[1]}%</b>).`,
      [F('a_mid0', 'Grade 1 midpoint')], `${fmt(t1[1].mid)} ÷ ${1 + p1.diff[1] / 100}`, `${f$(t1[1].mid)} ÷ ${1 + p1.diff[1] / 100} = <b>${f$(t1[0].mid)}</b> (±$1 is fine)`);
    add(1, 'Minimum and maximum', `Each grade’s range spreads around its midpoint by the <b>range differential</b>.<div class="wt-formula">Min = mid × (1 − range diff)<br>Max = mid × (1 + range diff)</div>Start with Grade 3: midpoint ${f$(p1.mid3)}, range differential <b>${p1.rd[2]}%</b>.`,
      [F('a_min2', 'Grade 3 minimum'), F('a_max2', 'Grade 3 maximum')], `${fmt(p1.mid3)} × ${1 - p1.rd[2] / 100} and × ${1 + p1.rd[2] / 100}`, `Min ${f$(p1.mid3)} × ${1 - p1.rd[2] / 100} = <b>${f$(t1[2].min)}</b> · Max × ${1 + p1.rd[2] / 100} = <b>${f$(t1[2].max)}</b>. Check: mid − min = max − mid.`);
    add(1, 'The rest of the ranges', `Same formula for every other grade. Watch the range differential change: ${t1.map(x => `G${x.g} ${x.rd}%`).join(' · ')}.`,
      [0, 1, 3, 4].flatMap(i => [F('a_min' + i, `Grade ${i + 1} min`), F('a_max' + i, `Grade ${i + 1} max`)]), `Use each grade’s own midpoint and its own range %.`, [0, 1, 3, 4].map(i => `G${i + 1}: ${f$(t1[i].mid)} → ${f$(t1[i].min)} – ${f$(t1[i].max)}`).join('<br>'));
    add(1, 'Find each job’s grade', `Grades are 200 points wide: 0–200 = 1, 201–400 = 2, 401–600 = 3, 601–800 = 4, 801–1000 = 5.`,
      sol.j1.map((j, i) => F('a_g' + i, `${j.name} (${j.pts} pts)`)), `Which 200-point band holds the points?`, sol.j1.map(j => `${j.name}: ${j.pts} pts → <b>Grade ${j.g}</b>`).join('<br>'));
    add(1, 'Average the market', `Your research found three schools’ pay for each job. The market rate = their <b>average</b>.<div class="wt-formula">Market = (A + B + C) ÷ 3</div>`,
      sol.j1.map((j, i) => F('a_mkt' + i, `${j.name} market average`)), `Add the three numbers, divide by 3, round to the dollar.`, sol.j1.map(j => `${j.name}: ${j.pays.map(([, v]) => fmt(v)).join(' + ')} = ${fmt(j.pays.reduce((a, [, v]) => a + v, 0))} ÷ 3 = <b>${f$(r(j.mkt))}</b>`).join('<br>'));
    add(1, 'Compare the grade to the market', `The company pays the “ideal” rate, which is the grade <b>midpoint</b> (a compa-ratio of 1.0). Compare it with the market:<div class="wt-formula">Compa-ratio = midpoint ÷ market average</div>Answer to 2 decimals. The ideal range is <b>0.75 – 1.25</b>.`,
      sol.j1.map((j, i) => F('a_cr' + i, `${j.name} compa-ratio`)), `Use the midpoint of the job’s grade from your chart.`, sol.j1.map(j => `${j.name}: ${f$(j.mid)} ÷ ${f$(r(j.mkt))} = <b>${j.cr.toFixed(2)}</b>`).join('<br>'));
    add(1, 'Make the call', `If every ratio is inside 0.75–1.25, the chart is fine: recommend <b>no change</b> and say why. If one is outside, that grade’s range needs to change.`,
      [F('a_dec', 'Recommendation')], `Look at your three ratios. Are any below 0.75 or above 1.25?`, `${sol.j1.map(j => j.cr.toFixed(2)).join(' · ')} → <b>${esc(sol.change)}</b>`);
    // Problem 2
    add(2, 'New chart: go up', `Problem 2 has its own chart. Grade 3’s midpoint is <b>${f$(p2.mid3)}</b>, and the differentials change by grade: G4 <b>${p2.diff[3]}%</b>, G5 <b>${p2.diff[4]}%</b>.`,
      [F('b_mid3', 'Grade 4 midpoint'), F('b_mid4', 'Grade 5 midpoint')], `Grade 4 = ${fmt(p2.mid3)} × ${1 + p2.diff[3] / 100}. Then Grade 5 = your Grade 4 × ${1 + p2.diff[4] / 100}.`, `${f$(p2.mid3)} × ${1 + p2.diff[3] / 100} = <b>${f$(t2[3].mid)}</b> · × ${1 + p2.diff[4] / 100} = <b>${f$(t2[4].mid)}</b>`);
    add(2, 'Go down', `Divide: Grade 2 = Grade 3 ÷ (1 + <b>${p2.diff[2]}%</b>), Grade 1 = Grade 2 ÷ (1 + <b>${p2.diff[1]}%</b>).`,
      [F('b_mid1', 'Grade 2 midpoint'), F('b_mid0', 'Grade 1 midpoint')], `${fmt(p2.mid3)} ÷ ${1 + p2.diff[2] / 100}`, `${f$(p2.mid3)} ÷ ${1 + p2.diff[2] / 100} = <b>${f$(t2[1].mid)}</b> · ÷ ${1 + p2.diff[1] / 100} = <b>${f$(t2[0].mid)}</b>`);
    add(2, 'All the ranges', `Min = mid × (1 − range diff), max = mid × (1 + range diff). Range differentials: ${t2.map(x => `G${x.g} ${x.rd}%`).join(' · ')}.`,
      [0, 1, 2, 3, 4].flatMap(i => [F('b_min' + i, `Grade ${i + 1} min`), F('b_max' + i, `Grade ${i + 1} max`)]), `Each grade uses its own midpoint and range %.`, t2.map(x => `G${x.g}: ${f$(x.mid)} → ${f$(x.min)} – ${f$(x.max)}`).join('<br>'));
    add(2, 'Find each job’s grade', `Same 200-point bands as before.`,
      sol.j2.map((j, i) => F('b_g' + i, `${j.name} (${j.pts} pts)`)), `0–200 = 1 · 201–400 = 2 · 401–600 = 3 · 601–800 = 4 · 801–1000 = 5`, sol.j2.map(j => `${j.name}: ${j.pts} pts → <b>Grade ${j.g}</b>`).join('<br>'));
    add(2, 'Compa-ratio for each employee', `Now it’s the employee’s actual pay against the grade midpoint:<div class="wt-formula">Compa-ratio = pay ÷ midpoint</div>Below 1 = paid below the midpoint. Answer to 2 decimals.`,
      sol.j2.map((j, i) => F('b_cr' + i, `${j.name} compa-ratio`)), `Divide each pay by the midpoint of its grade (never the min or max).`, sol.j2.map(j => `${j.name}: ${f$(j.pay)} ÷ ${f$(j.mid)} = <b>${j.cr.toFixed(2)}</b>`).join('<br>'));
    add(2, 'How far from the midpoint?', `The question asks how much below or above the midpoint you pay. That’s also what it would cost to bring them to 1.0.<div class="wt-formula">Gap = midpoint − pay</div>Positive = below the midpoint; negative = above.`,
      sol.j2.map((j, i) => F('b_gap' + i, `${j.name} gap`)), `Midpoint minus pay.`, sol.j2.map(j => `${j.name}: ${f$(j.mid)} − ${f$(j.pay)} = <b>${f$(j.gap)}</b>`).join('<br>'));
    add(2, 'Recommend', `Below <b>0.75</b> → raise. Above <b>1.25</b> → freeze. In between → OK. Also check the grade <b>minimum</b>: anyone paid under the min should come up to at least the min.`,
      sol.j2.map((j, i) => F('b_act' + i, `${j.name} action`)), `Compare each ratio with 0.75 and 1.25.`, sol.j2.map(j => `${j.name}: ${j.cr.toFixed(2)} → <b>${act(j.cr)}</b>${j.pay < j.min ? ` (and under the Grade ${j.g} minimum of ${f$(j.min)}: raise to at least the min)` : ''}`).join('<br>'));
    return { steps, sol };
  }
  function walkOpen(restart) { const w = st(); if (restart || !w.walk) w.walk = { i: 0, vals: {}, status: {} }; W = buildSteps(current()); S().save(); S().sound('start'); walkRender(); window.scrollTo(0, 0); }
  function givenPanel(step, sh) {
    const p = step.part === 1 ? sh.p1 : sh.p2, t = step.part === 1 ? W.sol.t1 : W.sol.t2;
    const known = id => { const wk = wst(); for (let k = 0; k < wk.i; k++) if (W.steps[k].fields.some(f => f.id === id)) return true; return false; };
    const pre = step.part === 1 ? 'a' : 'b';
    const cell = (id, v) => id === null || known(id) ? fmt(v) : '?';
    const rows = t.map((row, i) => `<tr><td>${row.g}</td><td>${i ? p.diff[i] + '%' : '—'}</td><td>${row.rd}%</td><td>${cell(pre + '_min' + i, row.min)}</td><td>${i === 2 ? '<b>' + fmt(row.mid) + '</b>' : cell(pre + '_mid' + i, row.mid)}</td><td>${cell(pre + '_max' + i, row.max)}</td></tr>`).join('');
    const jobs = step.part === 1 ? W.sol.j1.map(j => `<li>${esc(j.name)} · ${j.pts} pts · ${j.pays.map(([s, v]) => esc(s) + ' ' + fmt(v)).join(', ')}</li>`) : W.sol.j2.map(j => `<li>${esc(j.name)} · ${j.pts} pts · pays ${f$(j.pay)}</li>`);
    return `<div class="table-wrap"><table class="ws"><thead><tr><th>G</th><th>Mid diff</th><th>Range</th><th>Min</th><th>Mid</th><th>Max</th></tr></thead><tbody>${rows}</tbody></table></div><ul class="wt-jobs">${jobs.join('')}</ul>`;
  }
  function walkRender(keep) {
    if (!keep || S().page !== 'crsheet') S().setPage('crsheet');
    const wk = wst(), sh = current();
    if (!W) W = buildSteps(sh);
    if (wk.i >= W.steps.length) return walkDone();
    const step = W.steps[wk.i], stt = wk.status[wk.i] || {};
    const res = id => stt.checked ? grade(step.fields.find(f => f.id === id).cell, wk.vals[id]) : null;
    const allOk = stt.checked && step.fields.every(f => res(f.id) === true);
    const pct = Math.round(wk.i / W.steps.length * 100);
    const field = f => {
      const r0 = res(f.id), cls = r0 === true ? 'ok' : r0 === false ? 'bad' : stt.checked ? 'blank' : '', v = wk.vals[f.id] ?? '';
      const ctl = f.cell.choice ? `<select data-crw="${f.id}"><option value="">Choose…</option>${f.cell.options.map(o => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>` : `<input data-crw="${f.id}" inputmode="decimal" autocomplete="off" value="${esc(v)}">`;
      return `<label class="wt-field ${cls}"><span>${esc(f.label)}</span>${ctl}${stt.checked && r0 !== true && stt.shown ? `<small>→ ${esc(show(f.cell))}</small>` : ''}</label>`;
    };
    $('#app').innerHTML = S().heading(`WALKTHROUGH / STEP ${wk.i + 1} OF ${W.steps.length}`, step.title, step.part === 1 ? 'Problem 1 · Pay grades vs the market' : 'Problem 2 · How far from the midpoint?', '<button data-action="crw-exit">Exit walkthrough</button>') +
      `<div class="wt-progress"><i style="width:${pct}%"></i></div>
      <div class="wt-grid"><section class="panel wt-lesson"><div class="eyebrow">LESSON</div><div class="wt-teach">${step.teach}</div>${stt.hint ? `<div class="wt-hint"><b>HINT</b> ${step.hint}</div>` : ''}</section>
      <section class="panel wt-data"><div class="eyebrow">GIVEN DATA</div>${givenPanel(step, sh)}</section></div>
      <section class="panel wt-answer"><div class="eyebrow">${step.fields.length > 1 ? 'YOUR ANSWERS' : 'YOUR ANSWER'}</div><div class="wt-fields">${step.fields.map(field).join('')}</div>
      ${stt.checked ? `<div class="feedback ${allOk ? '' : 'wrong'}"><h3>${allOk ? 'Correct' : stt.shown ? 'Here’s how it works' : 'Not quite. Check the red fields.'}</h3>${allOk || stt.shown ? `<p class="wt-work">${step.work}</p>` : ''}</div>` : ''}
      <div class="wt-actions"><button data-action="crw-prev" ${wk.i ? '' : 'disabled'}>← Back</button><span class="wt-spacer"></span>
      ${!stt.hint && !allOk ? '<button data-action="crw-hint">Hint</button>' : ''}${stt.checked && !allOk && !stt.shown ? '<button data-action="crw-show">Show me</button>' : ''}
      ${allOk || stt.shown ? `<button class="primary" data-action="crw-next">${wk.i === W.steps.length - 1 ? 'Finish →' : 'Next step →'}</button>` : '<button class="primary" data-action="crw-check">Check →</button>'}</div></section>`;
    const first = document.querySelector('[data-crw]'); if (!keep && !stt.checked && first) first.focus({ preventScroll: true });
  }
  function walkDone() {
    const wk = wst(), right = Object.values(wk.status).filter(s => s.firstTry).length;
    $('#app').innerHTML = S().heading('WALKTHROUGH / COMPLETE', 'You worked the whole exercise', 'Every calculation on the Compa-Ratio Exercise.') +
      `<section class="panel"><div class="result-score">${right}<small> / ${W.steps.length} steps right on the first try</small></div>
      <p>Now do the full sheet without the lessons, then try one with new numbers.</p>
      <div class="actions"><button data-action="crw-restart">Walk through again</button><button class="primary" data-action="crw-exit">Do the full sheet →</button></div></section>`;
    S().sound('complete');
  }
  function walkHandle(a) {
    const wk = wst();
    const grab = () => document.querySelectorAll('[data-crw]').forEach(n => wk.vals[n.dataset.crw] = n.value);
    if (a === 'crw-open') return walkOpen(false);
    if (a === 'crw-restart') return walkOpen(true);
    if (a === 'crw-exit') { W = null; return page(); }
    if (!W) W = buildSteps(current());
    const stt = wk.status[wk.i] = wk.status[wk.i] || {}, step = W.steps[wk.i];
    if (a === 'crw-check') { grab(); const ok = step.fields.every(f => grade(f.cell, wk.vals[f.id]) === true); if (!stt.checked && ok && !stt.hint) stt.firstTry = true; stt.checked = true; S().record('generated-crwalk', 'compa', ok); S().sound(ok ? 'correct' : 'incorrect'); S().save(); walkRender(true); }
    else if (a === 'crw-hint') { grab(); stt.hint = true; S().sound('hint'); walkRender(true); }
    else if (a === 'crw-show') { grab(); stt.shown = true; S().save(); walkRender(true); }
    else if (a === 'crw-next') { wk.i++; S().save(); S().sound('navigation'); walkRender(); window.scrollTo(0, 0); }
    else if (a === 'crw-prev') { wk.i = Math.max(0, wk.i - 1); walkRender(); }
  }
  document.addEventListener('input', e => { const id = e.target?.dataset?.crw; if (id && W) wst().vals[id] = e.target.value; });
  document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target?.dataset?.crw) { e.preventDefault(); document.querySelector('[data-action="crw-check"],[data-action="crw-next"]')?.click(); } });

  window.CRSheet = {
    mode(p) { if (p === 'crsheet') { W = null; page(); return true; } return false; },
    handle(a, b) {
      if (!a.startsWith('crs-') && !a.startsWith('crw-')) return false;
      const w = st();
      if (a.startsWith('crw-')) { walkHandle(a); return true; }
      if (a === 'crs-check') check();
      else if (a === 'crs-reveal') { w.reveal = !w.reveal; S().save(); page(true); }
      else if (a === 'crs-clear') { w.vals = {}; w.checked = false; w.reveal = false; S().save(); page(true); }
      else if (a === 'crs-new') { w.gen = genSheet(); w.walk = null; w.vals = {}; w.checked = false; w.reveal = false; S().sound('start'); S().save(); page(true); }
      else if (a === 'crs-kind') { if (w.kind !== b.dataset.kind) { w.kind = b.dataset.kind; w.walk = null; w.vals = {}; w.checked = false; w.reveal = false; S().save(); } page(true); }
      return true;
    },
    _solve: solve, _cells: cells, _CLASS: CLASS, _gen: genSheet, _steps: buildSteps
  };
})();
