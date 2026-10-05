/* Worksheet mode: fill in the whole Pay Grade / Statistics exercise, cell by cell.
   Class sheet = the numbers from the Pay Grade-Statistics Exercise answer key.
   New sheet = fresh numbers, answers computed with the same formulas and rounding rules. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = (v, d = 2) => Number(v).toLocaleString('en-US', { maximumFractionDigits: d });
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = a => a[rand(0, a.length - 1)];
  const nround = v => Math.round(v + 1e-9);
  const up = v => Math.ceil(v - 1e-8);
  const sum = a => a.reduce((x, y) => x + y, 0);
  const sorted = a => [...a].sort((x, y) => x - y);
  const MULT = { 'month': 12, 'monthly': 12, 'quarter': 4, 'weekly': 52, 'bi-weekly': 26, 'semi-monthly': 24 };

  const CLASS = {
    title: 'Class sheet · Pay Grade / Statistics Exercise',
    techs: [[56412, 2000, 'month'], [58465, 6300, 'quarter'], [57984, 800, 'weekly'], [74632, 2400, 'monthly'], [56825, 1300, 'bi-weekly'], [56412, 2000, 'month'], [60147, 8500, 'quarter']],
    incumbents: [6, 2, 3, 5, 2, 3, 4],
    grade1Mid: 38000, midDiff: 10, ranges: [12, 12, 15, 18, 20],
    points: [50, 575, 750, 810]
  };

  function genSheet() {
    const freqs = ['month', 'quarter', 'weekly', 'bi-weekly', 'semi-monthly'];
    const bonusFor = f => ({ month: rand(12, 30) * 100, quarter: rand(40, 90) * 100, weekly: rand(5, 9) * 100, 'bi-weekly': rand(9, 16) * 100, 'semi-monthly': rand(9, 16) * 100 }[f]);
    let techs;
    for (;;) {
      const six = Array.from({ length: 6 }, () => { const f = pick(freqs); return [rand(520, 640) * 100 + rand(0, 99) * 1 + (rand(0, 1) ? 0 : rand(1, 9) * 10), bonusFor(f), f]; });
      six[rand(1, 5)][0] = rand(700, 790) * 100 + rand(0, 99); // one high earner → a real base-pay outlier candidate
      const dup = [...six[rand(0, 5)]];
      techs = [...six]; techs.splice(rand(0, 6), 0, dup);
      const bases = techs.map(t => t[0]);
      const counts = {}; bases.forEach(b => counts[b] = (counts[b] || 0) + 1);
      if (Object.values(counts).filter(c => c > 1).length === 1) break;
    }
    const ranges = sorted(Array.from({ length: 5 }, () => pick([10, 12, 15, 18, 20, 25])));
    const pts = [1, 2, 3, 4, 5].sort(() => Math.random() - .5).slice(0, 4).sort().map(g => (g - 1) * 200 + rand(5, 195));
    return { title: 'New sheet · fresh numbers', techs, incumbents: Array.from({ length: 7 }, () => rand(1, 6)), grade1Mid: rand(32, 58) * 1000, midDiff: pick([8, 10, 12]), ranges, points: pts };
  }

  /* ---------- answers ---------- */
  function stats(values, inc) {
    const s = sorted(values), n = s.length;
    const mean = sum(values) / n, wmean = sum(values.map((v, i) => v * inc[i])) / sum(inc);
    const counts = {}; values.forEach(v => counts[v] = (counts[v] || 0) + 1);
    const top = Math.max(...Object.values(counts));
    const mode = top > 1 ? Number(Object.keys(counts).find(k => counts[k] === top)) : null;
    const q1 = s[1], q3 = s[5], median = s[3], iqr = q3 - q1, lo = q1 - 1.5 * iqr, hi = q3 + 1.5 * iqr;
    const out = s.filter(v => v < lo || v > hi);
    return { sorted: s, mean, wmean, median, mode, q1, q3, iqr, lo, hi, out };
  }

  function solve(sh) {
    const rows = sh.techs.map(([base, bonus, f]) => { const annual = bonus * MULT[f]; return { base, bonus, f, mult: MULT[f], annual, total: base + annual }; });
    const sb = stats(rows.map(r => r.base), sh.incumbents), st = stats(rows.map(r => r.total), sh.incumbents);
    const grades = []; let mid = sh.grade1Mid;
    sh.ranges.forEach((r, i) => {
      if (i) mid = nround(mid * (1 + sh.midDiff / 100));
      grades.push({ g: i + 1, lo: i * 200, hi: (i + 1) * 200, range: r, mid, min: nround(mid * (1 - r / 100)), max: nround(mid * (1 + r / 100)) });
    });
    const pts = sh.points.map(p => {
      const g = grades[Math.min(4, Math.ceil(p / 200) - 1)], a = p - g.lo, b = 100, inc = (g.mid - g.min) * a / b;
      return { p, g: g.g, a, b, spread: g.mid - g.min, min: g.min, pay: up(g.min + inc), exact: g.min + inc };
    });
    return { rows, sb, st, grades, pts };
  }

  /* cells: id → {answer, tol, accepted[], kind} */
  function cells(sol) {
    const c = {};
    const num = (id, answer, tol = 1, accepted = []) => (c[id] = { answer, tol, accepted, kind: 'num' });
    sol.rows.forEach((r, i) => { num(`ab${i}`, r.annual, 0); num(`tc${i}`, r.total, 0); });
    for (const [k, s] of [['b', sol.sb], ['t', sol.st]]) {
      num(`${k}mean`, s.mean, 1); num(`${k}wmean`, s.wmean, 1); num(`${k}median`, s.median, 0);
      c[`${k}mode`] = { answer: s.mode, kind: s.mode == null ? 'none' : 'num', tol: 0, accepted: [] };
      num(`${k}q1`, s.q1, 0); num(`${k}q3`, s.q3, 0); num(`${k}iqr`, s.iqr, 0); num(`${k}lo`, s.lo, 1); num(`${k}hi`, s.hi, 1);
      c[`${k}out`] = { answer: s.out.length ? s.out[0] : null, list: s.out, kind: s.out.length ? 'num' : 'none', tol: 0, accepted: s.out.slice(1) };
    }
    sol.grades.forEach((g, i) => { num(`gmin${i}`, g.min, 1); if (i) num(`gmid${i}`, g.mid, 1); num(`gmax${i}`, g.max, 1); });
    sol.pts.forEach((p, i) => { num(`pg${i}`, p.g, 0); num(`pa${i}`, p.a, 0); num(`pb${i}`, p.b, 0); num(`pp${i}`, p.pay, 1, [nround(p.exact)]); });
    return c;
  }

  const parse = v => { const t = String(v ?? '').trim().replace(/[$,\s]/g, ''); return /^[-+]?(\d+(\.\d*)?|\.\d+)$/.test(t) ? Number(t) : NaN; };
  const isNone = v => /^(none|no|n\/a|na|nothing|-|—|0)$/i.test(String(v ?? '').trim());
  function grade(cell, v) {
    if (String(v ?? '').trim() === '') return null;
    if (cell.kind === 'none') return isNone(v);
    const x = parse(v); if (!Number.isFinite(x)) return false;
    return [cell.answer, ...(cell.accepted || [])].some(a => Math.abs(x - a) <= cell.tol + 1e-6);
  }

  /* ---------- state ---------- */
  const ws = () => { const st = S().state; if (!st.sheet) st.sheet = { kind: 'class', gen: null, vals: {}, checked: false, reveal: false }; return st.sheet; };
  const current = () => { const w = ws(); if (w.kind === 'gen' && !w.gen) w.gen = genSheet(); return w.kind === 'gen' ? w.gen : CLASS; };

  /* ---------- rendering ---------- */
  function page(keep) {
    if (!keep || S().page !== 'sheet') S().setPage('sheet');
    const w = ws(), sh = current(), sol = solve(sh), C = cells(sol);
    const inp = (id, wide) => {
      const cell = C[id], v = w.vals[id] ?? '', res = w.checked ? grade(cell, v) : null;
      const show = w.reveal ? (cell.kind === 'none' ? 'none' : fmt(cell.answer)) : '';
      const cls = res === true ? 'ok' : res === false ? 'bad' : w.checked ? 'blank' : '';
      return `<span class="ws-cell ${cls}"><input data-ws="${id}" inputmode="decimal" autocomplete="off" value="${esc(v)}" aria-label="${id}" ${wide ? 'class="wide"' : ''}>${w.checked && res !== true || w.reveal ? `<small>${res === true ? '' : '→ ' + (show || (cell.kind === 'none' ? 'none' : fmt(cell.answer)))}</small>` : ''}</span>`;
    };
    const score = () => { const ids = Object.keys(C), ok = ids.filter(id => grade(C[id], w.vals[id]) === true).length; return [ok, ids.length]; };
    const [ok, tot] = score();
    const freqLabel = f => ({ month: 'month', monthly: 'month', quarter: 'quarter', weekly: 'week', 'bi-weekly': 'bi-weekly', 'semi-monthly': 'semi-monthly' }[f]);

    const part1 = `<div class="table-wrap"><table class="ws"><thead><tr><th>Tech</th><th>Base</th><th>Bonus</th><th>Incumbents</th><th>Annual bonus</th><th>Total comp</th></tr></thead><tbody>
      ${sol.rows.map((r, i) => `<tr><td>${i + 1}</td><td>${fmt(r.base)}</td><td>${fmt(r.bonus)} / ${freqLabel(r.f)}</td><td>${sh.incumbents[i]}</td><td>${inp('ab' + i)}</td><td>${inp('tc' + i)}</td></tr>`).join('')}</tbody></table></div>`;
    const measures = [['mean', 'Mean (÷ 7 jobs)'], ['wmean', 'Weighted mean (by incumbents)'], ['median', 'Median'], ['mode', 'Mode'], ['q1', 'Q1'], ['q3', 'Q3'], ['iqr', 'IQR'], ['lo', 'Lower fence  Q1 − 1.5·IQR'], ['hi', 'Upper fence  Q3 + 1.5·IQR'], ['out', 'Outlier (or “none”)']];
    const statsT = `<div class="table-wrap"><table class="ws"><thead><tr><th>Measure</th><th>Base pay</th><th>Total comp</th></tr></thead><tbody>
      ${measures.map(([k, l]) => `<tr><td>${esc(l)}</td><td>${inp('b' + k)}</td><td>${inp('t' + k)}</td></tr>`).join('')}</tbody></table></div>`;
    const part2 = `<p class="ws-given">Grade 1 midpoint <b>${fmt(sh.grade1Mid)}</b> · midpoint differential <b>${sh.midDiff}%</b> between every grade · 200-point grades</p>
      <div class="table-wrap"><table class="ws"><thead><tr><th>Grade</th><th>Range diff</th><th>Minimum</th><th>Midpoint</th><th>Maximum</th></tr></thead><tbody>
      ${sol.grades.map((g, i) => `<tr><td>${g.g} (${String(g.lo === 0 ? '000' : g.lo + 1)}–${g.hi})</td><td>${g.range}%</td><td>${inp('gmin' + i)}</td><td>${i ? inp('gmid' + i) : '<b>' + fmt(g.mid) + '</b>'}</td><td>${inp('gmax' + i)}</td></tr>`).join('')}</tbody></table></div>`;
    const part3 = `<div class="table-wrap"><table class="ws"><thead><tr><th>Points</th><th>Grade</th><th>a</th><th>b</th><th>Pay</th></tr></thead><tbody>
      ${sol.pts.map((p, i) => `<tr><td>${p.p}</td><td>${inp('pg' + i)}</td><td>${inp('pa' + i)}</td><td>${inp('pb' + i)}</td><td>${inp('pp' + i)}</td></tr>`).join('')}</tbody></table></div>`;

    const steps = w.checked || w.reveal ? `<details class="ws-steps"><summary>Worked steps</summary>
      <p><b>Part 1.</b> Annual bonus = bonus × (month 12 · quarter 4 · week 52 · bi-weekly 26 · semi-monthly 24). Total comp = base + annual bonus.</p>
      <p>Sorted base: ${sol.sb.sorted.map(v => fmt(v)).join(' · ')}<br>Sorted total: ${sol.st.sorted.map(v => fmt(v)).join(' · ')}</p>
      <p>Mean = sum ÷ 7 (base ${fmt(sum(sol.rows.map(r => r.base)))} ÷ 7 = ${fmt(sol.sb.mean)}). Weighted mean = Σ(pay × incumbents) ÷ ${sum(sh.incumbents)} employees. Median = 4th sorted value. Q1 = 2nd, Q3 = 6th (medians of the lower/upper 3, leaving out the middle). Fences = Q1 − 1.5·IQR and Q3 + 1.5·IQR.</p>
      <p><b>Part 2.</b> Next mid = previous mid × ${1 + sh.midDiff / 100}. Min = mid × (1 − range diff); max = mid × (1 + range diff). Normal rounding. Check: mid − min should equal max − mid (±$1).</p>
      <p><b>Part 3.</b> a = points − grade bottom (treat 201 as 200); b = half the grade width = 100. Pay = min + (mid − min) × a ÷ b, rounded UP.<br>${sol.pts.map(p => `${p.p} pts → Grade ${p.g}: ${fmt(p.min)} + ${fmt(p.spread)} × ${fmt(p.a / p.b, 3)} = ${fmt(p.exact)} → ${fmt(p.pay)}`).join('<br>')}</p>
      <p class="source">Means, weighted means and fences accept ±$1 (the key keeps cents; the class rounds). Pay-for-points accepts round-up or normal rounding (the key uses normal rounding in spots).</p></details>` : '';

    $('#app').innerHTML = S().heading('CALCULATE / WORKSHEET', 'Pay Grade & Statistics Sheet', 'Complete the whole exercise like the class handout. Your entries save as you type. Check the sheet to see which cells are right.',
      `<div class="ws-score">${w.checked ? `<b>${ok}</b> / ${tot}<small>cells correct</small>` : `<small>${tot} cells</small>`}</div>`) +
      `<section class="panel ws-bar"><div class="ws-switch"><button class="${w.kind === 'class' ? 'primary' : ''}" data-action="ws-kind" data-kind="class">Class sheet</button><button class="${w.kind === 'gen' ? 'primary' : ''}" data-action="ws-kind" data-kind="gen">New numbers</button><button data-action="wt-open" class="wt-launch">▶ Guided walkthrough</button></div>
      <span class="source">${esc(sh.title)}</span></section>
      <section class="panel ws-part"><h2>Part 1 · Total comp</h2>${part1}<h3 class="ws-h3">Statistics</h3>${statsT}</section>
      <section class="panel ws-part"><h2>Part 2 · Pay grade chart</h2>${part2}</section>
      <section class="panel ws-part"><h2>Part 3 · Pay for a point total</h2>${part3}</section>
      ${steps ? `<section class="panel ws-part">${steps}</section>` : ''}
      <div class="ws-actions"><button data-action="ws-clear">Clear sheet</button><button data-action="ws-reveal">${w.reveal ? 'Hide answers' : 'Reveal answers'}</button>${w.kind === 'gen' ? '<button data-action="ws-new">New numbers ↻</button>' : ''}<button class="primary" data-action="ws-check">Check sheet →</button></div>`;
  }

  function check() {
    const w = ws(), C = cells(solve(current()));
    w.checked = true;
    const parts = { p1: /^(ab|tc|b|t)/, p2: /^g/, p3: /^p/ };
    let allOk = true;
    for (const [k, re] of Object.entries(parts)) {
      const ids = Object.keys(C).filter(id => re.test(id) && !(k === 'p1' && /^(pg|pa|pb|pp|g)/.test(id)));
      const ok = ids.every(id => grade(C[id], w.vals[id]) === true);
      if (!ok) allOk = false;
      S().record(`generated-sheet-${k}`, 'structures', ok);
    }
    S().sound(allOk ? 'complete' : 'select'); S().save(); page(true);
    const [ok, tot] = [Object.keys(C).filter(id => grade(C[id], w.vals[id]) === true).length, Object.keys(C).length];
    S().toast(allOk ? 'Perfect sheet. Every cell verified.' : `${ok} of ${tot} cells correct. Red cells show the expected value.`);
  }

  document.addEventListener('input', e => {
    const id = e.target?.dataset?.ws; if (!id) return;
    ws().vals[id] = e.target.value; clearTimeout(document._wsT); document._wsT = setTimeout(() => S().save(), 250);
  });
  document.addEventListener('input', e => { const id = e.target?.dataset?.wt; if (id && W) wstate().vals[id] = e.target.value; });
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target?.dataset?.wt) { e.preventDefault(); const all = [...document.querySelectorAll('[data-wt]')], i = all.indexOf(e.target); if (i < all.length - 1) all[i + 1].focus(); else (document.querySelector('[data-action="wt-check"]') || document.querySelector('[data-action="wt-next"]'))?.click(); return; }
    if (e.key !== 'Enter' || !e.target?.dataset?.ws) return;
    e.preventDefault(); const all = [...document.querySelectorAll('[data-ws]')]; const i = all.indexOf(e.target); all[i + 1]?.focus();
  });


  /* ---------- guided walkthrough ---------- */
  const f$ = v => fmt(v);
  function buildSteps(sh) {
    const sol = solve(sh), C = cells(sol), R = sol.rows, sb = sol.sb, st = sol.st, G = sol.grades, P = sol.pts;
    const cell = (answer, tol = 0, extra = {}) => Object.assign({ answer, tol, accepted: [], kind: 'num' }, extra);
    const fld = (id, label, c) => ({ id, label, cell: c || C[id] });
    const multLine = 'month ×12 · quarter ×4 · week ×52 · bi-weekly ×26 · semi-monthly ×24';
    const baseSum = sum(R.map(r => r.base)), incTot = sum(sh.incumbents), wNum = sum(R.map((r, i) => r.base * sh.incumbents[i]));
    const steps = [];
    const add = o => steps.push(o);

    add({ part: 1, title: 'Annualize a bonus', data: 'techs', focus: [0],
      teach: `Bonuses are quoted per pay period, so first turn each one into a <b>yearly</b> number. Multiply by how many of those periods are in a year:<div class="wt-formula">${multLine}</div>Tech 1 gets <b>${f$(R[0].bonus)} per ${R[0].f}</b>.`,
      fields: [fld('ab0', 'Tech 1 annual bonus')], hint: `${R[0].f} → ×${R[0].mult}. So ${f$(R[0].bonus)} × ${R[0].mult}.`,
      work: `${f$(R[0].bonus)} × ${R[0].mult} = <b>${f$(R[0].annual)}</b>` });
    add({ part: 1, title: 'Total compensation', data: 'techs', focus: [0],
      teach: `Total comp is simply <div class="wt-formula">Total comp = Base + Annual bonus</div>Tech 1's base is ${f$(R[0].base)}.`,
      fields: [fld('tc0', 'Tech 1 total comp')], hint: `${f$(R[0].base)} + ${f$(R[0].annual)}`,
      work: `${f$(R[0].base)} + ${f$(R[0].annual)} = <b>${f$(R[0].total)}</b>` });
    add({ part: 1, title: 'Your turn: the rest of the techs', data: 'techs', focus: [1, 2, 3, 4, 5, 6],
      teach: `Same two moves for techs 2–7. Watch the pay period on each one; that's where people lose points.<div class="wt-formula">${multLine}</div>`,
      fields: R.slice(1).flatMap((r, k) => [fld('ab' + (k + 1), `Tech ${k + 2} annual bonus`), fld('tc' + (k + 1), `Tech ${k + 2} total comp`)]),
      hint: R.slice(1).map((r, k) => `T${k + 2}: ${f$(r.bonus)} × ${r.mult}`).join(' · '),
      work: R.slice(1).map((r, k) => `Tech ${k + 2}: ${f$(r.bonus)} × ${r.mult} = ${f$(r.annual)} → ${f$(r.base)} + ${f$(r.annual)} = <b>${f$(r.total)}</b>`).join('<br>') });

    add({ part: 1, title: 'Mean (average)', data: 'base',
      teach: `Now the statistics, starting with <b>base pay</b>. The mean is the plain average: add every value, divide by how many there are.<div class="wt-formula">Mean = Σ values ÷ 7 jobs</div>Do it in two moves: the sum first, then divide.`,
      fields: [{ id: 'w-bsum', label: 'Sum of all 7 base pays', cell: cell(baseSum) }, fld('bmean', 'Mean base pay')],
      hint: `Add all seven base pays in the table. Then ÷ 7.`,
      work: `${R.map(r => f$(r.base)).join(' + ')} = ${f$(baseSum)}<br>${f$(baseSum)} ÷ 7 = <b>${f$(sb.mean)}</b> (answers within $1 count)` });
    add({ part: 1, title: 'Weighted mean', data: 'base',
      teach: `The weighted mean counts <b>every employee</b>, not every job. Multiply each pay by its number of incumbents, add those up, then divide by the total number of <b>employees</b>.<div class="wt-formula">Weighted mean = Σ(pay × incumbents) ÷ total incumbents</div>Exam cue: if the question says “incumbents” or “employees,” it wants the weighted mean.`,
      fields: [{ id: 'w-binc', label: 'Total incumbents', cell: cell(incTot) }, { id: 'w-bnum', label: 'Σ(base × incumbents)', cell: cell(wNum) }, fld('bwmean', 'Weighted mean base pay')],
      hint: `Total incumbents = ${sh.incumbents.join(' + ')}. Then multiply each base by its incumbents and add.`,
      work: R.map((r, i) => `${f$(r.base)} × ${sh.incumbents[i]} = ${f$(r.base * sh.incumbents[i])}`).join('<br>') + `<br>Σ = ${f$(wNum)} ÷ ${incTot} = <b>${f$(sb.wmean)}</b>` });
    add({ part: 1, title: 'Sort, then the median', data: 'base', showSorted: false,
      teach: `Almost every other statistic needs the values <b>sorted low → high</b>. Always sort first. With 7 values, the <b>median</b> is the middle one, the 4th.<div class="wt-formula">7 values → median = 4th value after sorting</div>`,
      fields: [fld('bmedian', 'Median base pay')], hint: `Sorted: ${sb.sorted.map(f$).join(' · ')}. Count to the 4th.`,
      work: `Sorted: ${sb.sorted.map((v, i) => i === 3 ? `<b>${f$(v)}</b>` : f$(v)).join(' · ')}<br>Middle (4th) value = <b>${f$(sb.median)}</b>` });
    add({ part: 1, title: 'Mode', data: 'base', showSorted: true,
      teach: `The <b>mode</b> is the value that shows up most often. On a sorted list, repeats sit next to each other, so it's easy to spot.`,
      fields: [fld('bmode', 'Mode of base pay')], hint: `Look for two identical numbers side by side in the sorted list.`,
      work: `${f$(sb.mode)} appears twice → mode = <b>${f$(sb.mode)}</b>` });
    add({ part: 1, title: 'Quartiles: Q1 and Q3', data: 'base', showSorted: true,
      teach: `Split the sorted list around the median and <b>leave the median out</b>. That leaves a lower 3 and an upper 3.<div class="wt-formula">Q1 = median of the lower 3 (2nd value) · Q3 = median of the upper 3 (6th value)</div>`,
      fields: [fld('bq1', 'Q1'), fld('bq3', 'Q3')], hint: `Lower 3: ${sb.sorted.slice(0, 3).map(f$).join(', ')}. Upper 3: ${sb.sorted.slice(4).map(f$).join(', ')}. Take the middle of each.`,
      work: `Lower half ${sb.sorted.slice(0, 3).map(f$).join(' · ')} → Q1 = <b>${f$(sb.q1)}</b><br>Upper half ${sb.sorted.slice(4).map(f$).join(' · ')} → Q3 = <b>${f$(sb.q3)}</b>` });
    add({ part: 1, title: 'IQR and the fences', data: 'base', showSorted: true,
      teach: `The interquartile range is the spread of the middle half. The fences mark how far out a value can go before it counts as an outlier.<div class="wt-formula">IQR = Q3 − Q1<br>Lower fence = Q1 − 1.5 × IQR<br>Upper fence = Q3 + 1.5 × IQR</div>Q1 = ${f$(sb.q1)}, Q3 = ${f$(sb.q3)}.`,
      fields: [fld('biqr', 'IQR'), fld('blo', 'Lower fence'), fld('bhi', 'Upper fence')], hint: `IQR = ${f$(sb.q3)} − ${f$(sb.q1)}. Then 1.5 × IQR, subtract from Q1 and add to Q3.`,
      work: `IQR = ${f$(sb.q3)} − ${f$(sb.q1)} = ${f$(sb.iqr)}<br>1.5 × ${f$(sb.iqr)} = ${f$(1.5 * sb.iqr)}<br>Lower = ${f$(sb.q1)} − ${f$(1.5 * sb.iqr)} = <b>${f$(sb.lo)}</b> · Upper = ${f$(sb.q3)} + ${f$(1.5 * sb.iqr)} = <b>${f$(sb.hi)}</b>` });
    add({ part: 1, title: 'Find the outlier', data: 'base', showSorted: true,
      teach: `Any value <b>below the lower fence or above the upper fence</b> is an outlier. Run the math; don't eyeball it. The fences are ${f$(sb.lo)} and ${f$(sb.hi)}. Type the outlier, or “none” if nothing is outside.`,
      fields: [fld('bout', 'Base pay outlier')], hint: `Compare the smallest and largest sorted values to the fences.`,
      work: sb.out.length ? `${f$(sb.out[0])} is outside ${f$(sb.lo)} – ${f$(sb.hi)} → outlier = <b>${f$(sb.out[0])}</b>` : `Every value is inside ${f$(sb.lo)} – ${f$(sb.hi)} → <b>none</b>` });
    add({ part: 1, title: 'Your turn: total comp statistics', data: 'total',
      teach: `Same steps, now on the <b>total comp</b> column. Sort first. Remember: weighted mean divides by ${incTot} employees; Q1/Q3 leave the median out; fences use 1.5 × IQR.`,
      fields: [['tmean', 'Mean'], ['twmean', 'Weighted mean'], ['tmedian', 'Median'], ['tmode', 'Mode'], ['tq1', 'Q1'], ['tq3', 'Q3'], ['tiqr', 'IQR'], ['tlo', 'Lower fence'], ['thi', 'Upper fence'], ['tout', 'Outlier (or “none”)']].map(([id, l]) => fld(id, l)),
      hint: `Sorted total comp: ${st.sorted.map(f$).join(' · ')}`,
      work: `Sorted: ${st.sorted.map(f$).join(' · ')}<br>Mean ${f$(st.mean)} · Weighted ${f$(st.wmean)} · Median ${f$(st.median)} · Mode ${f$(st.mode)}<br>Q1 ${f$(st.q1)} · Q3 ${f$(st.q3)} · IQR ${f$(st.iqr)} · Fences ${f$(st.lo)} – ${f$(st.hi)} · Outlier <b>${st.out.length ? f$(st.out[0]) : 'none'}</b>` });

    const g0 = G[0], g1 = G[1];
    add({ part: 2, title: 'Grade 1 minimum and maximum', data: 'grades', focus: [0],
      teach: `Part 2 builds the pay grade chart. Each grade's range sits around its midpoint. The <b>range differential</b> says how far the min and max go below and above the mid.<div class="wt-formula">Min = Mid × (1 − range diff)<br>Max = Mid × (1 + range diff)</div>Grade 1: mid ${f$(g0.mid)}, range diff ${g0.range}%. Use normal rounding for the table.`,
      fields: [fld('gmin0', 'Grade 1 minimum'), fld('gmax0', 'Grade 1 maximum')], hint: `${g0.range}% → ×${fmt(1 - g0.range / 100, 3)} and ×${fmt(1 + g0.range / 100, 3)}`,
      work: `${f$(g0.mid)} × ${fmt(1 - g0.range / 100, 3)} = <b>${f$(g0.min)}</b><br>${f$(g0.mid)} × ${fmt(1 + g0.range / 100, 3)} = <b>${f$(g0.max)}</b>` });
    add({ part: 2, title: 'Next grade’s midpoint', data: 'grades', focus: [1],
      teach: `The <b>midpoint differential</b> (${sh.midDiff}%) is how much each midpoint rises from the grade below.<div class="wt-formula">Next mid = previous mid × (1 + mid diff)</div>Then the same min/max formulas, using <b>this grade's</b> range diff (${g1.range}%).`,
      fields: [fld('gmid1', 'Grade 2 midpoint'), fld('gmin1', 'Grade 2 minimum'), fld('gmax1', 'Grade 2 maximum')],
      hint: `${f$(g0.mid)} × ${fmt(1 + sh.midDiff / 100, 3)}, then × ${fmt(1 - g1.range / 100, 3)} and × ${fmt(1 + g1.range / 100, 3)}`,
      work: `Mid: ${f$(g0.mid)} × ${fmt(1 + sh.midDiff / 100, 3)} = <b>${f$(g1.mid)}</b><br>Min: ${f$(g1.mid)} × ${fmt(1 - g1.range / 100, 3)} = <b>${f$(g1.min)}</b> · Max: ${f$(g1.mid)} × ${fmt(1 + g1.range / 100, 3)} = <b>${f$(g1.max)}</b>` });
    add({ part: 2, title: 'Your turn: grades 3–5', data: 'grades', focus: [2, 3, 4],
      teach: `Keep chaining: each new mid comes from the one before it. Watch the range diff; it changes by grade. Quick self-check: <b>mid − min should equal max − mid</b> (within $1).`,
      fields: [2, 3, 4].flatMap(i => [fld('gmid' + i, `Grade ${i + 1} mid`), fld('gmin' + i, `Grade ${i + 1} min`), fld('gmax' + i, `Grade ${i + 1} max`)]),
      hint: `Mid multiplier ×${fmt(1 + sh.midDiff / 100, 3)} every time. Range diffs: ${G.slice(2).map(g => g.range + '%').join(', ')}.`,
      work: G.slice(2).map((g, k) => `G${g.g}: ${f$(G[k + 1].mid)} × ${fmt(1 + sh.midDiff / 100, 3)} = ${f$(g.mid)} → min ${f$(g.min)} · max ${f$(g.max)}`).join('<br>') });

    const p0 = P[0], gp = G[p0.g - 1];
    add({ part: 3, title: 'Which grade?', data: 'chart',
      teach: `Part 3 prices a job from its point total. First find the grade whose point band contains it. Grades are 200 points wide: 0–200, 201–400, 401–600, 601–800, 801–1000.`,
      fields: [fld('pg0', `Grade for ${p0.p} points`)], hint: `${p0.p} is between ${gp.lo === 0 ? 0 : gp.lo + 1} and ${gp.hi}.`,
      work: `${p0.p} falls in ${gp.lo === 0 ? '000' : gp.lo + 1}–${gp.hi} → Grade <b>${p0.g}</b>` });
    add({ part: 3, title: 'Find a and b', data: 'chart',
      teach: `<div class="wt-formula">a = points − the grade's bottom (treat 201 as 200)<br>b = half the grade width = 200 ÷ 2 = 100</div>So a is how far into the grade the job sits; b is always 100 here. a ÷ b can go above 1; that's fine.<br>Job: <b>${p0.p} points</b>, which is in Grade ${p0.g}.`,
      fields: [fld('pa0', `a for ${p0.p} points`), fld('pb0', 'b')], hint: `Grade ${p0.g} bottom = ${gp.lo}. So ${p0.p} − ${gp.lo}.`,
      work: `a = ${p0.p} − ${gp.lo} = <b>${p0.a}</b> · b = 200 ÷ 2 = <b>100</b>` });
    add({ part: 3, title: 'Pay for the point total', data: 'chart',
      teach: `Start at the grade minimum and add a share of the min-to-mid gap:<div class="wt-formula">Pay = Min + (Mid − Min) × a ÷ b</div>Rule from review: a pay rate for a job is <b>rounded UP</b>. Grade ${p0.g}: min ${f$(gp.min)}, mid ${f$(gp.mid)}.`,
      fields: [fld('pp0', `Pay for ${p0.p} points`)], hint: `(${f$(gp.mid)} − ${f$(gp.min)}) × ${p0.a} ÷ 100, then add ${f$(gp.min)}.`,
      work: `${f$(gp.mid)} − ${f$(gp.min)} = ${f$(p0.spread)}<br>${f$(p0.spread)} × ${fmt(p0.a / 100, 3)} = ${f$(p0.spread * p0.a / 100)}<br>${f$(gp.min)} + ${f$(p0.spread * p0.a / 100)} = ${f$(p0.exact)} → round UP → <b>${f$(p0.pay)}</b>` });
    add({ part: 3, title: 'Your turn: the other point totals', data: 'chart',
      teach: `Grade → a → b → pay, for each one. Round the pay UP.`,
      fields: P.slice(1).flatMap((p, k) => [fld('pg' + (k + 1), `${p.p} pts: grade`), fld('pa' + (k + 1), `${p.p} pts: a`), fld('pb' + (k + 1), `${p.p} pts: b`), fld('pp' + (k + 1), `${p.p} pts: pay`)]),
      hint: P.slice(1).map(p => `${p.p} → Grade ${p.g}`).join(' · '),
      work: P.slice(1).map(p => `${p.p} pts → G${p.g}: a ${p.a}, b 100 → ${f$(p.min)} + ${f$(p.spread)} × ${fmt(p.a / 100, 3)} = ${f$(p.exact)} → <b>${f$(p.pay)}</b>`).join('<br>') });
    return { steps, sol };
  }

  let W = null;
  const wstate = () => { const w = ws(); if (!w.walk) w.walk = { i: 0, vals: {}, status: {} }; return w.walk; };
  function walkOpen(restart) {
    const w = ws(); if (restart || !w.walk) w.walk = { i: 0, vals: {}, status: {} };
    W = buildSteps(current()); walkRender();
  }
  function dataPanel(step, sol, sh) {
    const R = sol.rows;
    if (step.data === 'techs') return `<div class="table-wrap"><table class="ws"><thead><tr><th>Tech</th><th>Base</th><th>Bonus</th></tr></thead><tbody>${R.map((r, i) => `<tr class="${(step.focus || []).includes(i) ? 'wt-focus' : ''}"><td>${i + 1}</td><td>${f$(r.base)}</td><td>${f$(r.bonus)} / ${r.f}</td></tr>`).join('')}</tbody></table></div>`;
    if (step.data === 'base' || step.data === 'total') {
      const key = step.data === 'base' ? 'base' : 'total', s = step.data === 'base' ? sol.sb : sol.st;
      return `<div class="table-wrap"><table class="ws"><thead><tr><th>Tech</th><th>${key === 'base' ? 'Base pay' : 'Total comp'}</th><th>Incumbents</th></tr></thead><tbody>${R.map((r, i) => `<tr><td>${i + 1}</td><td>${f$(r[key])}</td><td>${sh.incumbents[i]}</td></tr>`).join('')}</tbody></table></div>` +
        (step.showSorted ? `<p class="wt-sorted">SORTED: ${s.sorted.map(f$).join(' · ')}</p>` : '');
    }
    const Gt = sol.grades;
    return `<div class="table-wrap"><table class="ws"><thead><tr><th>Grade</th><th>Points</th><th>Range diff</th>${step.data === 'chart' ? '<th>Min</th><th>Mid</th>' : ''}</tr></thead><tbody>${Gt.map((g, i) => `<tr class="${(step.focus || []).includes(i) ? 'wt-focus' : ''}"><td>${g.g}</td><td>${g.lo === 0 ? '000' : g.lo + 1}–${g.hi}</td><td>${g.range}%</td>${step.data === 'chart' ? `<td>${f$(g.min)}</td><td>${f$(g.mid)}</td>` : ''}</tr>`).join('')}</tbody></table></div>` +
      (step.data === 'grades' ? `<p class="wt-sorted">GRADE 1 MID ${f$(sh.grade1Mid)} · MID DIFF ${sh.midDiff}%</p>` : '');
  }
  function walkRender(keep) {
    if (!keep || S().page !== 'sheet') S().setPage('sheet');
    const wk = wstate(), sh = current();
    if (wk.i >= W.steps.length) return walkDone();
    const step = W.steps[wk.i], stt = wk.status[wk.i] || {};
    const res = id => stt.checked ? grade(step.fields.find(f => f.id === id).cell, wk.vals[id]) : null;
    const pct = Math.round(wk.i / W.steps.length * 100);
    const allOk = stt.checked && step.fields.every(f => res(f.id) === true);
    const partNames = { 1: 'Part 1 · Total comp & statistics', 2: 'Part 2 · Pay grade chart', 3: 'Part 3 · Pay for points' };
    $('#app').innerHTML = S().heading(`WALKTHROUGH / STEP ${wk.i + 1} OF ${W.steps.length}`, step.title, partNames[step.part],
      `<button data-action="wt-exit">Exit walkthrough</button>`) +
      `<div class="wt-progress"><i style="width:${pct}%"></i></div>
      <div class="wt-grid"><section class="panel wt-lesson"><div class="eyebrow">LESSON</div><div class="wt-teach">${step.teach}</div>
      ${stt.hint ? `<div class="wt-hint"><b>HINT</b> ${step.hint}</div>` : ''}</section>
      <section class="panel wt-data"><div class="eyebrow">GIVEN DATA</div>${dataPanel(step, W.sol, sh)}</section></div>
      <section class="panel wt-answer"><div class="eyebrow">${step.fields.length > 1 ? 'YOUR ANSWERS' : 'YOUR ANSWER'}</div>
      <div class="wt-fields">${step.fields.map(f => { const r = res(f.id); return `<label class="wt-field ${r === true ? 'ok' : r === false ? 'bad' : stt.checked ? 'blank' : ''}"><span>${esc(f.label)}</span><input data-wt="${f.id}" inputmode="decimal" autocomplete="off" value="${esc(wk.vals[f.id] ?? '')}"></label>`; }).join('')}</div>
      ${stt.checked ? `<div class="feedback ${allOk ? '' : 'wrong'}"><h3>${allOk ? 'ANSWER VERIFIED' : stt.shown ? 'HERE’S HOW IT WORKS' : 'NOT QUITE: CHECK THE RED FIELDS'}</h3>${allOk || stt.shown ? `<p class="wt-work">${step.work}</p>` : '<p>Try again, use a hint, or tap “Show me.”</p>'}</div>` : ''}
      <div class="wt-actions"><button data-action="wt-prev" ${wk.i ? '' : 'disabled'}>← Back</button><span class="wt-spacer"></span>
      ${!stt.hint && !allOk ? '<button data-action="wt-hint">Hint</button>' : ''}${stt.checked && !allOk ? '<button data-action="wt-show">Show me</button>' : ''}
      ${allOk || stt.shown ? `<button class="primary" data-action="wt-next">${wk.i === W.steps.length - 1 ? 'Finish →' : 'Next step →'}</button>` : '<button class="primary" data-action="wt-check">Check →</button>'}</div></section>`;
    const first = document.querySelector('[data-wt]:not([value]), [data-wt]'); if (!keep && !stt.checked && first) first.focus({ preventScroll: true });
  }
  function walkDone() {
    const wk = wstate(); const right = Object.values(wk.status).filter(s => s.firstTry).length;
    $('#app').innerHTML = S().heading('WALKTHROUGH / COMPLETE', 'You worked the whole sheet', 'That was every calculation on the Pay Grade / Statistics exercise.') +
      `<section class="panel"><div class="result-score">${right}<small> / ${W.steps.length} steps right on the first try</small></div>
      <p>Now try it without the lessons. Do the full sheet cold, then try one with new numbers.</p>
      <div class="actions"><button data-action="wt-restart">Walk through again</button><button class="primary" data-action="wt-exit">Do the full sheet →</button></div></section>`;
    S().sound('complete');
  }
  function walkCheck() {
    const wk = wstate(), step = W.steps[wk.i], stt = wk.status[wk.i] = wk.status[wk.i] || {};
    document.querySelectorAll('[data-wt]').forEach(n => wk.vals[n.dataset.wt] = n.value);
    const ok = step.fields.every(f => grade(f.cell, wk.vals[f.id]) === true);
    if (!stt.checked && ok && !stt.hint) stt.firstTry = true;
    stt.checked = true;
    S().record('generated-walk', 'structures', ok); S().sound(ok ? 'correct' : 'incorrect'); S().save(); walkRender(true); document.querySelector('.wt-answer .feedback')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  window.Worksheet = {
    mode: ['sheet', 'Worksheet', 'Fill in the full pay grade & stats sheet.', 'worksheet'],
    open: page,
    handle(a, b) {
      if (!a.startsWith('ws-') && !a.startsWith('wt-')) return false;
      const w = ws();
      if (a === 'ws-check') check();
      else if (a === 'ws-reveal') { w.reveal = !w.reveal; S().save(); page(true); }
      else if (a === 'ws-clear') { w.vals = {}; w.checked = false; w.reveal = false; S().save(); page(); }
      else if (a === 'ws-new') { w.gen = genSheet(); w.walk = null; w.vals = {}; w.checked = false; w.reveal = false; S().sound('start'); S().save(); page(); }
      else if (a === 'wt-open') walkOpen(true);
      else if (a === 'wt-exit') { W = null; page(); }
      else if (a === 'wt-restart') walkOpen(true);
      else if (a === 'wt-check') walkCheck();
      else if (a === 'wt-hint') { const wk = wstate(); document.querySelectorAll('[data-wt]').forEach(n => wk.vals[n.dataset.wt] = n.value); (wk.status[wk.i] = wk.status[wk.i] || {}).hint = true; S().sound('hint'); walkRender(true); document.querySelector('.wt-hint')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      else if (a === 'wt-show') { const wk = wstate(), st = wk.status[wk.i]; st.shown = true; W.steps[wk.i].fields.forEach(f => { if (grade(f.cell, wk.vals[f.id]) !== true) wk.vals[f.id] = f.cell.kind === 'none' ? 'none' : String(Math.round(f.cell.answer * 100) / 100); }); S().sound('flip'); walkRender(true); document.querySelector('.wt-answer .feedback')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); }
      else if (a === 'wt-next') { wstate().i++; S().save(); S().sound('navigation'); walkRender(); window.scrollTo(0, 0); }
      else if (a === 'wt-prev') { const wk = wstate(); wk.i = Math.max(0, wk.i - 1); walkRender(); }
      else if (a === 'ws-kind') { if (w.kind !== b.dataset.kind) { w.kind = b.dataset.kind; w.walk = null; w.vals = {}; w.checked = false; w.reveal = false; S().save(); } page(); }
      return true;
    },
    _solve: solve, _steps: buildSteps, _cells: cells, _grade: grade, _CLASS: CLASS, _gen: genSheet
  };
})();
