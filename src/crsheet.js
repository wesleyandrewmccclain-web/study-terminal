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
      `<section class="panel ws-bar"><div class="ws-switch"><button class="${w.kind === 'class' ? 'primary' : ''}" data-action="crs-kind" data-kind="class">Class sheet</button><button class="${w.kind === 'gen' ? 'primary' : ''}" data-action="crs-kind" data-kind="gen">New numbers</button><button data-action="mode" data-mode="sheet">Pay grade sheet</button></div>
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

  window.CRSheet = {
    mode(p) { if (p === 'crsheet') { page(); return true; } return false; },
    handle(a, b) {
      if (!a.startsWith('crs-')) return false;
      const w = st();
      if (a === 'crs-check') check();
      else if (a === 'crs-reveal') { w.reveal = !w.reveal; S().save(); page(true); }
      else if (a === 'crs-clear') { w.vals = {}; w.checked = false; w.reveal = false; S().save(); page(true); }
      else if (a === 'crs-new') { w.gen = genSheet(); w.vals = {}; w.checked = false; w.reveal = false; S().sound('start'); S().save(); page(true); }
      else if (a === 'crs-kind') { if (w.kind !== b.dataset.kind) { w.kind = b.dataset.kind; w.vals = {}; w.checked = false; w.reveal = false; S().save(); } page(true); }
      return true;
    },
    _solve: solve, _cells: cells, _CLASS: CLASS, _gen: genSheet
  };
})();
