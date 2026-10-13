/* Compa-Ratio worksheet: the class Compa-Ratio Exercise, cell by cell (plus a "New numbers" version).
   Built from the class's worked answers (shared 10/12):
   - midpoint differential belongs to the grade you move INTO (up: × (1 + diff), down: ÷ (1 + diff)); pay tables use normal rounding;
   - the "ideal pay rate" = pay for the job's points: min + (mid − min) × a ÷ b, a = points − grade bottom, b = 100, rounded UP;
   - target band "within 90% of the midpoint" = compa-ratio 0.90 – 1.10, rounded to 2 decimals;
   - Problem 1: compa-ratio = ideal pay ÷ market average;
   - Problem 2: the class sheet divided ideal ÷ actual; the textbook way is actual ÷ ideal. Both are asked. Actions follow the class sheet.
   Dollar cells accept ±$1; compa-ratios accept ±0.01 (the class mixed rounding and truncating). */
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
  const LO = 0.9, HI = 1.1;

  const CLASS = {
    title: 'Class sheet · MGT 354 Compa-Ratio Exercise (class worked answers)',
    p1: { mid3: 56400, diff: [0, 10, 10, 10, 10], rd: [15, 15, 15, 20, 20],
      jobs: [['Senior Financial Analyst', 740, [['Caterpillar', 76850], ['Rivian', 74200], ['OSF', 72450]]],
        ['Systems Administrator', 350, [['Rivian', 51400], ['OSF', 48600], ['Rivian', 49850]]],
        ['HR Generalist', 460, [['OSF', 55900], ['Caterpillar', 57800], ['Caterpillar', 54600]]]] },
    p2: { mid3: 64128, diff: [0, 10, 15, 17, 20], rd: [12, 14, 17, 20, 20],
      jobs: [['Job A', 650, 60352], ['Job B', 320, 51708], ['Job C', 850, 102422]] }
  };
  /* Practice versions A–C from the extra worksheet packet. Same inputs, solved the CLASS way (ideal pay for points,
     rounded-dollar charts, 0.90–1.10), not the packet key's method (actual ÷ midpoint, cents, revise every grade to market). */
  const pv = (v, m3, d, ec, ac, it, m32, pays) => ({ title: `Practice ${v} · worksheet packet (solved the class way)`,
    p1: { mid3: m3, diff: [0, d, d, d, d], rd: [15, 15, 15, 20, 20], jobs: [['Employment Consultant', 425, [['ISU', ec[0]], ['UIUC', ec[1]], ['IWU', ec[2]]]], ['Accountant II', 780, [['IWU', ac[0]], ['ISU', ac[1]], ['UIUC', ac[2]]]], ['IT Specialist', 340, [['UIUC', it[0]], ['IWU', it[1]], ['ISU', it[2]]]]] },
    p2: { mid3: m32, diff: [0, 10, 15, 17, 20], rd: [12, 14, 17, 20, 20], jobs: [['Job A', 700, pays[0]], ['Job B', 900, pays[1]], ['Job C', 300, pays[2]]] } });
  const PRACTICE = {
    pA: pv('A', 62400, 12, [65000, 67500, 66000], [58000, 61000, 64500], [55000, 57000, 59000], 71200, [64850, 104500, 55720]),
    pB: pv('B', 58600, 8, [54500, 56500, 55500], [68000, 70500, 69500], [47000, 49000, 48000], 65300, [88400, 71800, 63400]),
    pC: pv('C', 64800, 11, [63500, 66000, 65000], [74000, 76500, 75250], [52000, 55000, 56500], 68400, [58950, 112400, 61300]) };
  /* Second version of the handout (Grade 3 mid 57,964 / 67,860), worked with the same class rules. */
  const CLASS_B = {
    title: 'Class sheet B · MGT 354 Compa-Ratio Exercise (57,964 version)',
    p1: { mid3: 57964, diff: [0, 10, 10, 10, 10], rd: [15, 15, 15, 20, 20],
      jobs: [['Employment Consultant', 425, [['ISU', 48752], ['UIUC', 50247], ['IWU', 45132]]],
        ['Accountant II', 780, [['IWU', 59134], ['ISU', 54326], ['UIUC', 56794]]],
        ['IT Specialist', 340, [['UIUC', 48356], ['IWU', 53215], ['ISU', 46587]]]] },
    p2: { mid3: 67860, diff: [0, 10, 15, 17, 20], rd: [12, 14, 17, 20, 20],
      jobs: [['Job A', 700, 59780], ['Job B', 900, 69840], ['Job C', 300, 51655]] }
  };

  function table(p) {
    const mid = []; mid[2] = p.mid3;
    mid[3] = r(mid[2] * (1 + p.diff[3] / 100)); mid[4] = r(mid[3] * (1 + p.diff[4] / 100));
    mid[1] = r(mid[2] / (1 + p.diff[2] / 100)); mid[0] = r(mid[1] / (1 + p.diff[1] / 100));
    return mid.map((m, i) => ({ g: i + 1, mid: m, rd: p.rd[i], min: r(m * (1 - p.rd[i] / 100)), max: r(m * (1 + p.rd[i] / 100)) }));
  }
  /* Ideal pay rate for a point total (Exam 2 pay-for-points, rounded UP). */
  function ideal(t, pts) {
    const g = gradeOf(pts), row = t[g - 1], a = pts - (g - 1) * 200, exact = (row.mid - row.min) * a / 100;
    return { g, a, row, exact: row.min + exact, pay: row.min + Math.ceil(exact - 1e-9) };
  }
  const r2 = v => Math.round(v * 100 + 1e-9) / 100; // the class rounds the ratio to 2 decimals before comparing
  const act = cr => r2(cr) > HI ? 'Freeze' : r2(cr) < LO ? 'Raise gradually' : 'OK';
  function solve(sh) {
    const t1 = table(sh.p1), t2 = table(sh.p2);
    const j1 = sh.p1.jobs.map(([name, pts, pays]) => { const id = ideal(t1, pts), mkt = r(pays.reduce((a, [, v]) => a + v, 0) / pays.length); return { name, pts, pays, ...id, mkt, cr: id.pay / mkt }; });
    const j2 = sh.p2.jobs.map(([name, pts, pay]) => { const id = ideal(t2, pts); return { name, pts, actual: pay, ...id, crA: id.pay / pay, crB: pay / id.pay }; });
    const out = j1.filter(j => r2(j.cr) < LO || r2(j.cr) > HI);
    // The class fixed the job furthest out of line: gap = actual − its grade mid; new min = old min + gap; step = new min × range diff.
    const worst = j2.reduce((w, j) => Math.abs(1 - j.crA) > Math.abs(1 - w.crA) ? j : w, j2[0]);
    const gap = worst.actual - worst.row.mid, nmin = worst.row.min + gap, step = r(nmin * worst.row.rd / 100);
    return { t1, t2, j1, j2, change: out.length ? 'Change Grade ' + [...new Set(out.map(j => j.g))].sort().join(' & ') : 'No change', fix: gap > 0 ? { job: worst, gap, nmin, step, nmid: nmin + step, nmax: nmin + 2 * step } : null };
  }
  function cells(sol) {
    const c = {}, $c = (a, tol = 1) => ({ answer: a, tol }), crc = a => ({ answer: a, tol: 0.0101, cr: true });
    sol.t1.forEach((row, i) => { if (i !== 2) c['a_mid' + i] = $c(row.mid); c['a_min' + i] = $c(row.min); c['a_max' + i] = $c(row.max); });
    sol.j1.forEach((j, i) => { c['a_g' + i] = $c(j.g, 0); c['a_ip' + i] = $c(j.pay); c['a_mkt' + i] = $c(j.mkt); c['a_cr' + i] = crc(j.cr); });
    const gs = [...new Set(sol.j1.map(j => j.g))].sort(); c.a_dec = { choice: sol.change, options: [...new Set(['No change', ...gs.map(g => 'Change Grade ' + g), ...(gs.length > 1 ? ['Change Grade ' + gs.join(' & ')] : []), sol.change])] };
    sol.t2.forEach((row, i) => { if (i !== 2) c['b_mid' + i] = $c(row.mid); c['b_min' + i] = $c(row.min); c['b_max' + i] = $c(row.max); });
    sol.j2.forEach((j, i) => { c['b_g' + i] = $c(j.g, 0); c['b_ip' + i] = $c(j.pay); c['b_crA' + i] = crc(j.crA); c['b_crB' + i] = crc(j.crB); c['b_act' + i] = { choice: act(j.crA), options: ['Raise gradually', 'OK', 'Freeze'] }; });
    const f = sol.fix; if (f) { c.f_gap = $c(f.gap); c.f_min = $c(f.nmin); c.f_mid = $c(f.nmid, 2); c.f_max = $c(f.nmax, 3); }
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
    const p1 = p(), p2 = p(), t1 = table(p1), t2 = table(p2);
    const names = ['Payroll Specialist', 'HR Generalist', 'Benefits Analyst', 'Recruiter', 'Systems Analyst', 'Accountant I'].sort(() => Math.random() - .5);
    const cos = ['Caterpillar', 'Rivian', 'OSF', 'State Farm', 'ISU'];
    p1.jobs = [0, 1, 2].map(i => { const pts = rand(1, 4) * 200 + rand(5, 190), ip = ideal(t1, pts).pay, mkt = ip / pick([0.84, 0.9, 0.95, 1.0, 1.05, 1.08, 1.16]); return [names[i], pts, [0, 1, 2].map(k => [pick(cos), r(mkt * (0.94 + Math.random() * 0.12) / 50) * 50])]; });
    p2.jobs = ['Job A', 'Job B', 'Job C'].map(n => { const pts = rand(20, 990), ip = ideal(t2, pts).pay; return [n, pts, r(ip * pick([0.78, 0.86, 0.95, 1.0, 1.04, 1.12, 1.25]))]; });
    return { title: 'New numbers · same steps as the class exercise', p1, p2 };
  }

  const st = () => { const s = S().state; if (!s.crsheet || s.crsheet.v !== 2) s.crsheet = { v: 2, kind: 'class', gen: null, vals: {}, checked: false, reveal: false }; return s.crsheet; };
  const current = () => { const w = st(); if (w.kind === 'gen' && !w.gen) w.gen = genSheet(); return w.kind === 'gen' ? w.gen : w.kind === 'classB' ? CLASS_B : PRACTICE[w.kind] || CLASS; };

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
    const f = sol.fix;
    const p1 = `<p class="ws-given">Grade 3 midpoint <b>${fmt(sh.p1.mid3)}</b>. The midpoint differential is the % you go up INTO that grade. The company pays the “ideal” rate (pay for the job’s points) and wants each position within 90% of the midpoint: a compa-ratio of <b>0.90–1.10</b>.</p>
      <div class="table-wrap"><table class="ws">${head}<tbody>${gradeRows(sol.t1, sh.p1, 'a')}</tbody></table></div>
      <h3 class="ws-h3">Market research</h3>
      <div class="table-wrap"><table class="ws"><thead><tr><th>Position</th><th>Market pay</th><th>Grade</th><th>Ideal pay (points)</th><th>Market average</th><th>Ideal ÷ market</th></tr></thead><tbody>
      ${sol.j1.map((j, i) => `<tr><td>${esc(j.name)} (${j.pts} pts)</td><td>${j.pays.map(([s, v]) => esc(s) + ' ' + fmt(v)).join('<br>')}</td><td>${inp('a_g' + i)}</td><td>${inp('a_ip' + i)}</td><td>${inp('a_mkt' + i)}</td><td>${inp('a_cr' + i)}</td></tr>`).join('')}</tbody></table></div>
      <p class="ws-given">Recommendation: ${inp('a_dec')}</p>`;
    const p2 = `<p class="ws-given">Grade 3 midpoint <b>${fmt(sh.p2.mid3)}</b>. Positions should be within 90% of the midpoint (0.90–1.10). Round to 2 decimals.</p>
      <div class="table-wrap"><table class="ws">${head}<tbody>${gradeRows(sol.t2, sh.p2, 'b')}</tbody></table></div>
      <h3 class="ws-h3">Your employees</h3>
      <div class="table-wrap"><table class="ws"><thead><tr><th>Job</th><th>Actual pay</th><th>Grade</th><th>Ideal pay (points)</th><th>Ideal ÷ actual<br><small>class sheet</small></th><th>Actual ÷ ideal<br><small>textbook</small></th><th>Action (class)</th></tr></thead><tbody>
      ${sol.j2.map((j, i) => `<tr><td>${esc(j.name)} (${j.pts} pts)</td><td>${fmt(j.actual)}</td><td>${inp('b_g' + i)}</td><td>${inp('b_ip' + i)}</td><td>${inp('b_crA' + i)}</td><td>${inp('b_crB' + i)}</td><td>${inp('b_act' + i)}</td></tr>`).join('')}</tbody></table></div>
      ${f ? `<h3 class="ws-h3">Fix the range for ${esc(f.job.name)} (Grade ${f.job.g}), the class way</h3>
      <div class="table-wrap"><table class="ws"><thead><tr><th>Gap = actual − grade mid</th><th>New min = old min + gap</th><th>New mid = min + min × ${f.job.row.rd}%</th><th>New max = mid + same step</th></tr></thead><tbody><tr><td>${inp('f_gap')}</td><td>${inp('f_min')}</td><td>${inp('f_mid')}</td><td>${inp('f_max')}</td></tr></tbody></table></div>` : `<p class="ws-given">No job is paid above its grade’s midpoint here, so there’s no range to rebuild: underpaid jobs get raised toward the ideal rate instead.</p>`}`;
    const steps = w.checked || w.reveal ? `<section class="panel ws-part"><details class="ws-steps" open><summary>Worked steps</summary>
      <p><b>Midpoints.</b> Up: mid × (1 + the next grade’s differential). Down: mid ÷ (1 + this grade’s differential), never × (1 − diff). Min = mid × (1 − range diff), max = mid × (1 + range diff). Normal rounding.</p>
      <p><b>Ideal pay.</b> min + (mid − min) × a ÷ 100, where a = points − grade bottom; round UP.</p>
      <p><b>Problem 1.</b> ${sol.j1.map(j => `${esc(j.name)}: Grade ${j.g} · (${fmt(j.row.mid)} − ${fmt(j.row.min)}) × ${j.a}/100 + ${fmt(j.row.min)} = ${fmt(j.pay)} · market ${fmt(j.pays.reduce((a, [, v]) => a + v, 0))} ÷ 3 = ${fmt(j.mkt)} · ${fmt(j.pay)} ÷ ${fmt(j.mkt)} = ${j.cr.toFixed(2)}`).join('<br>')}<br>All inside 0.90–1.10 → no change; outside → change that grade’s range. Answer: <b>${esc(sol.change)}</b>.</p>
      <p><b>Problem 2.</b> ${sol.j2.map(j => `${esc(j.name)}: Grade ${j.g} · ideal ${fmt(j.pay)} · ideal ÷ actual = ${j.crA.toFixed(2)} → ${act(j.crA)} · actual ÷ ideal = ${j.crB.toFixed(2)}`).join('<br>')}</p>
      ${f ? `<p><b>Fix (class method).</b> ${fmt(f.job.actual)} − ${fmt(f.job.row.mid)} = ${fmt(f.gap)} · new min ${fmt(f.job.row.min)} + ${fmt(f.gap)} = ${fmt(f.nmin)} · step ${fmt(f.nmin)} × ${f.job.row.rd}% = ${fmt(f.step)} → mid ${fmt(f.nmid)}, max ${fmt(f.nmax)}.</p>` : ''}
      <p class="source">The class sheet divided ideal ÷ actual in Problem 2; the textbook divides actual (pay) ÷ ideal (target). Ask which one counts. Dollar cells accept ±$1, ratios ±0.01.</p></details></section>` : '';
    $('#app').innerHTML = S().heading('CALCULATE / WORKSHEET', 'Compa-Ratio Sheet', 'The class Compa-Ratio Exercise, cell by cell. Your entries save as you type.',
      `<div class="ws-score">${w.checked ? `<b>${ok}</b> / ${ids.length}<small>cells correct</small>` : `<small>${ids.length} cells</small>`}</div>`) +
      `<section class="panel ws-bar"><div class="ws-switch">${[['class', 'Class sheet A'], ['classB', 'Class sheet B'], ['pA', 'Practice A'], ['pB', 'Practice B'], ['pC', 'Practice C'], ['gen', 'New numbers']].map(([k, l]) => `<button class="${w.kind === k ? 'primary' : ''}" data-action="crs-kind" data-kind="${k}">${l}</button>`).join('')}<button data-action="crw-open" class="wt-launch">▶ Guided walkthrough</button></div>
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
    const sol = solve(sh), C = cells(sol), t1 = sol.t1, t2 = sol.t2, p1 = sh.p1, p2 = sh.p2, steps = [], f = sol.fix;
    const F = (id, label) => ({ id, label, cell: C[id] });
    const add = (part, title, teach, fields, hint, work) => steps.push({ part, title, teach, fields, hint, work });
    const ipWork = j => `Grade ${j.g}: a = ${j.pts} − ${(j.g - 1) * 200} = ${j.a} → (${f$(j.row.mid)} − ${f$(j.row.min)}) × ${j.a}/100 = ${fmt(j.exact - j.row.min)} → round UP → + ${f$(j.row.min)} = <b>${f$(j.pay)}</b>`;
    // Problem 1
    add(1, 'Go UP one grade', `Each midpoint comes from the one next to it. Going <b>up</b>, multiply by (1 + the differential of the grade you move <b>into</b>).<div class="wt-formula">Next mid = mid × (1 + diff)</div>Grade 3’s midpoint is given: <b>${f$(p1.mid3)}</b>. Grade 4’s differential is <b>${p1.diff[3]}%</b>.`,
      [F('a_mid3', 'Grade 4 midpoint'), F('a_mid4', 'Grade 5 midpoint')], `${fmt(p1.mid3)} × ${1 + p1.diff[3] / 100}, round, then × ${1 + p1.diff[4] / 100}.`, `${f$(p1.mid3)} × ${1 + p1.diff[3] / 100} = <b>${f$(t1[3].mid)}</b> · × ${1 + p1.diff[4] / 100} = <b>${f$(t1[4].mid)}</b>`);
    add(1, 'Go DOWN', `Going <b>down</b> undoes the step up, so <b>divide</b> by (1 + the differential of the grade you leave).<div class="wt-formula">Lower mid = mid ÷ (1 + diff)</div>Trap: × (1 − diff) gives ${f$(r(p1.mid3 * (1 - p1.diff[2] / 100)))}, which is wrong.`,
      [F('a_mid1', 'Grade 2 midpoint'), F('a_mid0', 'Grade 1 midpoint')], `${fmt(p1.mid3)} ÷ ${1 + p1.diff[2] / 100}`, `${f$(p1.mid3)} ÷ ${1 + p1.diff[2] / 100} = <b>${f$(t1[1].mid)}</b> · ÷ ${1 + p1.diff[1] / 100} = <b>${f$(t1[0].mid)}</b>`);
    add(1, 'Minimums and maximums', `<div class="wt-formula">Min = mid × (1 − range diff)<br>Max = mid × (1 + range diff)</div>A 20% range diff means × 0.80 and × 1.20; 15% means × 0.85 and × 1.15. Range diffs: ${t1.map(x => `G${x.g} ${x.rd}%`).join(' · ')}.`,
      [0, 1, 2, 3, 4].flatMap(i => [F('a_min' + i, `Grade ${i + 1} min`), F('a_max' + i, `Grade ${i + 1} max`)]), `Each grade uses its own midpoint and its own range %.`, t1.map(x => `G${x.g}: ${f$(x.mid)} → ${f$(x.min)} – ${f$(x.max)}`).join('<br>'));
    add(1, 'Find each job’s grade', `Grades are 200 points wide: 0–200 = 1, 201–400 = 2, 401–600 = 3, 601–800 = 4, 801–1000 = 5.`,
      sol.j1.map((j, i) => F('a_g' + i, `${j.name} (${j.pts} pts)`)), `Which 200-point band holds the points?`, sol.j1.map(j => `${j.name}: ${j.pts} pts → <b>Grade ${j.g}</b>`).join('<br>'));
    add(1, 'The “ideal” pay rate', `The company pays the <b>ideal</b> rate: the Exam 2 pay-for-points formula.<div class="wt-formula">Ideal = min + (mid − min) × a ÷ 100<br>a = points − grade bottom</div>Round the increase <b>UP</b>.`,
      sol.j1.map((j, i) => F('a_ip' + i, `${j.name} ideal pay`)), `Example: 740 pts is Grade 4, a = 740 − 600 = 140, so × 1.4.`, sol.j1.map(j => `${j.name}: ${ipWork(j)}`).join('<br>'));
    add(1, 'Average the market', `The market rate is the <b>average</b> of the three companies’ pay for that job.<div class="wt-formula">Market = (A + B + C) ÷ 3</div>`,
      sol.j1.map((j, i) => F('a_mkt' + i, `${j.name} market average`)), `Add the three numbers and divide by 3.`, sol.j1.map(j => `${j.name}: ${j.pays.map(([, v]) => fmt(v)).join(' + ')} ÷ 3 = <b>${f$(j.mkt)}</b>`).join('<br>'));
    add(1, 'Compa-ratio vs the market', `<div class="wt-formula">Compa-ratio = ideal pay ÷ market average</div>Round to <b>2 decimals</b>. “Within 90% of the midpoint” = <b>0.90 – 1.10</b>.`,
      sol.j1.map((j, i) => F('a_cr' + i, `${j.name} compa-ratio`)), `Divide your ideal pay by your market average.`, sol.j1.map(j => `${j.name}: ${f$(j.pay)} ÷ ${f$(j.mkt)} = <b>${j.cr.toFixed(2)}</b>`).join('<br>'));
    add(1, 'Make the call', `All inside 0.90–1.10 → recommend <b>no change</b> and say why. One outside → that grade’s range needs a change.`,
      [F('a_dec', 'Recommendation')], `Any ratio below 0.90 or above 1.10?`, `${sol.j1.map(j => j.cr.toFixed(2)).join(' · ')} → <b>${esc(sol.change)}</b>`);
    // Problem 2
    add(2, 'New chart: midpoints', `Problem 2 has its own chart. Grade 3 mid = <b>${f$(p2.mid3)}</b>. Differentials change by grade: G2 ${p2.diff[1]}%, G3 ${p2.diff[2]}%, G4 ${p2.diff[3]}%, G5 ${p2.diff[4]}%.`,
      [F('b_mid3', 'Grade 4 midpoint'), F('b_mid4', 'Grade 5 midpoint'), F('b_mid1', 'Grade 2 midpoint'), F('b_mid0', 'Grade 1 midpoint')], `Up: × (1 + diff). Down: ÷ (1 + diff of the grade you leave).`, `G4 ${f$(t2[3].mid)} · G5 ${f$(t2[4].mid)} · G2 ${f$(t2[1].mid)} · G1 ${f$(t2[0].mid)}`);
    add(2, 'All the ranges', `Min = mid × (1 − range diff), max = mid × (1 + range diff). Range diffs: ${t2.map(x => `G${x.g} ${x.rd}%`).join(' · ')}.`,
      [0, 1, 2, 3, 4].flatMap(i => [F('b_min' + i, `Grade ${i + 1} min`), F('b_max' + i, `Grade ${i + 1} max`)]), `Each grade uses its own midpoint and range %.`, t2.map(x => `G${x.g}: ${f$(x.mid)} → ${f$(x.min)} – ${f$(x.max)}`).join('<br>'));
    add(2, 'Grade and ideal pay', `Put each job in its grade, then find its <b>ideal</b> pay with the points formula (round UP).`,
      sol.j2.flatMap((j, i) => [F('b_g' + i, `${j.name} grade`), F('b_ip' + i, `${j.name} ideal pay`)]), `a = points − grade bottom; b = 100.`, sol.j2.map(j => `${j.name}: ${ipWork(j)}`).join('<br>'));
    add(2, 'Compa-ratios, both ways', `The class sheet divided <b>ideal ÷ actual</b>. The textbook divides <b>actual ÷ ideal</b>. Do both, 2 decimals, so you’re ready either way.`,
      sol.j2.flatMap((j, i) => [F('b_crA' + i, `${j.name}: ideal ÷ actual`), F('b_crB' + i, `${j.name}: actual ÷ ideal`)]), `One ratio is just 1 ÷ the other.`, sol.j2.map(j => `${j.name}: ${f$(j.pay)} ÷ ${f$(j.actual)} = <b>${j.crA.toFixed(2)}</b> · ${f$(j.actual)} ÷ ${f$(j.pay)} = <b>${j.crB.toFixed(2)}</b>`).join('<br>'));
    add(2, 'What to do (class sheet)', `Using the class ratio (ideal ÷ actual): above <b>1.10</b> → freeze pay until the position is more in line; below <b>0.90</b> → gradually increase; in between → OK.`,
      sol.j2.map((j, i) => F('b_act' + i, `${j.name} action`)), `Compare each ideal ÷ actual ratio with 0.90 and 1.10.`, sol.j2.map(j => `${j.name}: ${j.crA.toFixed(2)} → <b>${act(j.crA)}</b>`).join('<br>'));
    if (f) add(2, 'Fix the range (class method)', `For the job furthest out of line (<b>${esc(f.job.name)}</b>, Grade ${f.job.g}) the class rebuilt the range:<div class="wt-formula">Gap = actual − grade mid<br>New min = old min + gap<br>Step = new min × range diff<br>New mid = min + step · New max = mid + step</div>`,
      [F('f_gap', 'Gap'), F('f_min', 'New min'), F('f_mid', 'New mid'), F('f_max', 'New max')], `${fmt(f.job.actual)} − ${fmt(f.job.row.mid)}, then add that to ${fmt(f.job.row.min)}.`, `${f$(f.job.actual)} − ${f$(f.job.row.mid)} = <b>${f$(f.gap)}</b> · ${f$(f.job.row.min)} + ${f$(f.gap)} = <b>${f$(f.nmin)}</b> · step ${f$(f.step)} → mid <b>${f$(f.nmid)}</b>, max <b>${f$(f.nmax)}</b>`);
    return { steps, sol };
  }
  function walkOpen(restart) { const w = st(); if (restart || !w.walk) w.walk = { i: 0, vals: {}, status: {} }; W = buildSteps(current()); S().save(); S().sound('start'); walkRender(); window.scrollTo(0, 0); }
  function givenPanel(step, sh) {
    const p = step.part === 1 ? sh.p1 : sh.p2, t = step.part === 1 ? W.sol.t1 : W.sol.t2, pre = step.part === 1 ? 'a' : 'b';
    const known = id => { const wk = wst(); for (let k = 0; k < wk.i; k++) if (W.steps[k].fields.some(f => f.id === id)) return true; return false; };
    const cell = (id, v) => known(id) ? fmt(v) : '?';
    const rows = t.map((row, i) => `<tr><td>${row.g}</td><td>${i ? p.diff[i] + '%' : '—'}</td><td>${row.rd}%</td><td>${cell(pre + '_min' + i, row.min)}</td><td>${i === 2 ? '<b>' + fmt(row.mid) + '</b>' : cell(pre + '_mid' + i, row.mid)}</td><td>${cell(pre + '_max' + i, row.max)}</td></tr>`).join('');
    const jobs = step.part === 1 ? W.sol.j1.map(j => `<li>${esc(j.name)} · ${j.pts} pts · ${j.pays.map(([s, v]) => esc(s) + ' ' + fmt(v)).join(', ')}</li>`) : W.sol.j2.map(j => `<li>${esc(j.name)} · ${j.pts} pts · pays ${f$(j.actual)}</li>`);
    return `<div class="table-wrap"><table class="ws"><thead><tr><th>G</th><th>Mid diff</th><th>Range</th><th>Min</th><th>Mid</th><th>Max</th></tr></thead><tbody>${rows}</tbody></table></div><ul class="wt-jobs">${jobs.join('')}</ul><p class="source">Target: 0.90 – 1.10 · round ratios to 2 decimals</p>`;
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
    _solve: solve, _cells: cells, _CLASS: CLASS, _CLASS_B: CLASS_B, _PRACTICE: PRACTICE, _gen: genSheet, _steps: buildSteps
  };
})();
