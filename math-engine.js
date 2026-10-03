/* Source formulas: 01 – Exam 2 Content, Formula Sheet §§1–11.
   Generated practice uses new numeric examples, with explicit user authorization. */
(function (global) {
  'use strict';
  const normal = (value, digits = 0) => Math.round((Number(value) + Number.EPSILON) * 10 ** digits) / 10 ** digits;
  const up = (value, digits = 0) => Math.ceil(Number(value) * 10 ** digits - 1e-8) / 10 ** digits;
  const down = (value, digits = 0) => Math.floor(Number(value) * 10 ** digits + 1e-8) / 10 ** digits;
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = values => values[rand(0, values.length - 1)];
  const sum = values => values.reduce((a, b) => a + b, 0);
  const sorted = values => [...values].sort((a, b) => a - b);
  const median = values => {
    const a = sorted(values), n = a.length;
    return n % 2 ? a[Math.floor(n / 2)] : (a[n / 2 - 1] + a[n / 2]) / 2;
  };
  const shuffle = values => {
    const a = [...values];
    for (let i = a.length - 1; i > 0; i--) { const j = rand(0, i); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  };
  const fmt = value => Number(value).toLocaleString('en-US', { maximumFractionDigits: 6 });
  const f = (id, label, answer, unit = '$') => ({ id, label, answer, unit });
  const table = (headers, rows) => ({ headers, rows });
  let sequence = 0;
  const make = (type, section, title, prompt, fields, steps, dataTable, note) => {
    const problem = {
      id: 'generated-' + type + '-' + Date.now() + '-' + (++sequence),
      type, topic: ({ compa: 'compa', groupcompa: 'compa', netpay: 'payroll', overtime: 'payroll', exec: 'exec', workcomp: 'benefits', lease: 'flex' })[type] || 'structures', origin: 'generated',
      source: 'Generated practice · Formula Sheet §' + section,
      title, prompt, fields, steps
    };
    if (dataTable) problem.table = dataTable;
    if (note) problem.note = note;
    return problem;
  };
  const parseInput = input => {
    if (typeof input === 'number') return Number.isFinite(input) ? input : NaN;
    const clean = String(input ?? '').trim().replace(/[$,\s]/g, '');
    return /^[-+]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(clean) ? Number(clean) : NaN;
  };
  const checkField = (field, input) => {
    const actual = parseInput(input);
    if (!Number.isFinite(actual)) return false;
    const tolerance = field.tolerance == null ? 0.000001 : Number(field.tolerance);
    return [field.answer, ...(field.accepted || [])].some(expected => Math.abs(actual - expected) <= tolerance + 1e-8);
  };
  const generators = {};
  generators.annualize = () => {
    const [frequency, multiplier] = pick([['monthly', 12], ['quarterly', 4], ['weekly', 52], ['bi-weekly', 26], ['semi-monthly', 24]]);
    const base = rand(40, 85) * 1000, bonus = rand(4, 20) * 100, annual = bonus * multiplier;
    return make('annualize', '1', 'Annualize a bonus', `Base pay is $${fmt(base)} and the bonus is $${fmt(bonus)} ${frequency}. Find annual bonus and total compensation.`,
      [f('annual', 'Annual bonus', annual), f('total', 'Total compensation', base + annual)],
      [`${frequency} bonus × ${multiplier}: ${fmt(bonus)} × ${multiplier} = ${fmt(annual)}.`, `Total comp = base + annual bonus = ${fmt(base)} + ${fmt(annual)} = $${fmt(base + annual)}.`]);
  };
  generators.mean = () => {
    const values = Array.from({ length: 7 }, () => rand(450, 850) * 100), total = sum(values), answer = up(total / values.length);
    return make('mean', '2', 'Mean pay', 'Calculate mean base pay across the seven jobs. Round the final mean UP to whole dollars, following the Practice Set and 9/21 lecture convention.',
      [Object.assign(f('mean', 'Mean base pay', answer), { accepted: [normal(total / values.length)] })], [`Sum = ${fmt(total)}.`, `Divide by ${values.length} jobs: ${fmt(total)} ÷ ${values.length} = ${fmt(total / values.length)}.`, `Round UP → $${fmt(answer)}.`],
      table(['Job', 'Base pay'], values.map((v, i) => [i + 1, v])), 'Round UP is the class convention for pay figures; the Exercise 2 key uses normal rounding for means, so either whole-dollar answer is accepted here. Show your work on the exam.');
  };
  generators.weighted = () => {
    const rows = Array.from({ length: 5 }, (_, i) => ['Job ' + (i + 1), rand(450, 850) * 100, rand(2, 7)]);
    const count = sum(rows.map(r => r[2])), numerator = sum(rows.map(r => r[1] * r[2])), answer = up(numerator / count);
    return make('weighted', '3', 'Weighted mean pay', 'Find the employee-weighted mean. Round final pay UP to whole dollars, as in the Practice Set and 9/21 lecture.',
      [f('count', 'Total employees', count, ''), Object.assign(f('weighted', 'Weighted mean pay', answer), { accepted: [normal(numerator / count)] })],
      rows.map(r => `${r[0]}: ${fmt(r[1])} × ${r[2]} = ${fmt(r[1] * r[2])}.`).concat([`Σ(pay × employees) = ${fmt(numerator)}; total employees = ${count}.`, `${fmt(numerator)} ÷ ${count} = ${fmt(numerator / count)} → $${fmt(answer)}. Divide by EMPLOYEES, not jobs.`]), table(['Job', 'Pay', 'Employees'], rows));
  };
  generators.median = () => {
    const n = pick([6, 7]), base = rand(42, 65) * 1000;
    const values = Array.from({ length: n }, (_, i) => base + i * rand(3, 6) * 100);
    // Ensure exactly one mode, occurring three times; all remaining values are distinct.
    values[0] = base; values[1] = base; values[2] = base;
    for (let i = 3; i < n; i++) values[i] = base + i * 500;
    const a = sorted(values), mid = median(a);
    return make('median', '4', 'Median and mode', 'Find the median and mode of these pay values. Sort first.',
      [f('median', 'Median', mid), f('mode', 'Mode', base)],
      [`Sorted values: ${a.map(fmt).join(' · ')}.`, n % 2 ? `The middle value (${(n + 1) / 2}th) is $${fmt(mid)}.` : `Even count: average values ${n / 2} and ${n / 2 + 1}: (${fmt(a[n / 2 - 1])} + ${fmt(a[n / 2])}) ÷ 2 = $${fmt(mid)}.`, `The most frequent value is $${fmt(base)} (three times).`], table(['Pay value'], shuffle(values).map(v => [v])));
  };
  generators.incumbent = () => {
    const base = rand(42, 65) * 1000, rows = Array.from({ length: 5 }, (_, i) => ['Company ' + (i + 1), base + i * 1200, rand(1, 6)]);
    const all = rows.flatMap(r => Array(r[2]).fill(r[1])), n = all.length, result = median(all);
    let cumulative = 0;
    const steps = rows.map(r => { const start = cumulative + 1; cumulative += r[2]; return `${r[0]}: positions ${start}–${cumulative}, pay $${fmt(r[1])}.`; });
    steps.push(n % 2 ? `${n} employees → position ${(n + 1) / 2}: $${fmt(result)}.` : `${n} employees → average positions ${n / 2} and ${n / 2 + 1}: (${fmt(all[n / 2 - 1])} + ${fmt(all[n / 2])}) ÷ 2 = $${fmt(result)}.`);
    return make('incumbent', '4', 'Incumbent-level median', 'Find the median across all employees, counting each company’s incumbents individually.',
      [f('employees', 'Total employees', n, ''), f('median', 'Incumbent median', result)], steps, table(['Company', 'Pay', 'Incumbents'], shuffle(rows)));
  };
  generators.iqr = () => {
    const base = rand(42, 60) * 1000, step = rand(5, 15) * 100;
    const values = [0, 1, 2, 3, 4, 5, 20].map(x => base + x * step), q1 = values[1], q3 = values[5], spread = q3 - q1, lower = q1 - 1.5 * spread, upper = q3 + 1.5 * spread;
    const outliers = values.filter(x => x < lower || x > upper);
    return make('iqr', '5', 'Outliers by IQR', 'Use the IQR method. Exclude the overall median when splitting the lower and upper halves. Find quartiles, IQR, fences, and the outlier.',
      [f('q1', 'Q1', q1), f('q3', 'Q3', q3), f('iqr', 'IQR', spread), f('lower', 'Lower fence', lower), f('upper', 'Upper fence', upper), f('outlier', 'Outlier', outliers[0])],
      [`Sorted: ${values.map(fmt).join(' · ')}.`, `Q1 = ${fmt(q1)}; Q3 = ${fmt(q3)}; IQR = ${fmt(q3)} − ${fmt(q1)} = ${fmt(spread)}.`, `Lower fence = ${fmt(q1)} − 1.5 × ${fmt(spread)} = ${fmt(lower)}.`, `Upper fence = ${fmt(q3)} + 1.5 × ${fmt(spread)} = ${fmt(upper)}.`, `$${fmt(outliers[0])} is outside the fences.`], table(['Pay'], shuffle(values).map(v => [v])));
  };
  const buildGrades = () => {
    const width = pick([200, 250]), n = 1000 / width, start = rand(36, 55) * 1000;
    let midpoint = start;
    const rows = [];
    const ranges = sorted(Array.from({ length: n }, () => pick([10, 12, 15, 20, 25, 30])));
    for (let i = 0; i < n; i++) {
      const differential = i === 0 ? 0 : pick([10, 12, 15]), range = ranges[i];
      if (i > 0) midpoint = normal(midpoint * (1 + differential / 100));
      rows.push({ grade: i + 1, bottom: i * width, top: (i + 1) * width, width, differential, range, minimum: normal(midpoint * (1 - range / 100)), midpoint, maximum: normal(midpoint * (1 + range / 100)) });
    }
    return rows;
  };
  generators.grades = () => {
    const rows = buildGrades(), fields = [];
    rows.forEach(r => {
      fields.push(f('min' + r.grade, 'Grade ' + r.grade + ' minimum', r.minimum));
      if (r.grade > 1) fields.push(f('mid' + r.grade, 'Grade ' + r.grade + ' midpoint', r.midpoint));
      fields.push(f('max' + r.grade, 'Grade ' + r.grade + ' maximum', r.maximum));
    });
    return make('grades', '8–9', 'Build the pay grade table', `Grade 1 midpoint is $${fmt(rows[0].midpoint)}. Midpoint diff is shown on the grade you move INTO. Complete the entire chart using normal whole-dollar rounding at each step.`, fields,
      rows.flatMap((r, i) => [(i ? `G${r.grade} mid: ${fmt(rows[i - 1].midpoint)} × ${fmt(1 + r.differential / 100)} → ${fmt(r.midpoint)}.` : `G1 midpoint is ${fmt(r.midpoint)}.`), `G${r.grade} min: ${fmt(r.midpoint)} × ${fmt(1 - r.range / 100)} → ${fmt(r.minimum)}; max: ${fmt(r.midpoint)} × ${fmt(1 + r.range / 100)} → ${fmt(r.maximum)}.`]),
      table(['Grade', 'Points', 'Mid diff INTO grade', 'Range diff'], rows.map(r => [r.grade, (r.bottom ? r.bottom + 1 : 0) + '–' + r.top, r.grade === 1 ? '—' : r.differential + '%', r.range + '%'])));
  };
  generators.points = () => {
    const rows = buildGrades(), grade = pick(rows), a = rand(1, grade.width - 1), points = grade.bottom + a, b = grade.width / 2, gap = grade.midpoint - grade.minimum, increment = gap * a / b, pay = up(increment) + grade.minimum;
    return make('points', '10', 'Pay for a point total', `Find job pay for ${points} points. Use the rounded pay table below. Round the pay increment UP before adding the minimum.`,
      [f('grade', 'Grade', grade.grade, ''), f('a', 'a: points above grade bottom', a, 'points'), f('b', 'b: half the grade width', b, 'points'), f('pay', 'Job pay', pay)],
      [`${points} points falls in Grade ${grade.grade}. Treat boundary ${grade.bottom + 1} as ${grade.bottom} when subtracting.`, `a = ${points} − ${grade.bottom} = ${a}; b = ${grade.width} ÷ 2 = ${b}.`, `(mid − min) × a/b = (${fmt(grade.midpoint)} − ${fmt(grade.minimum)}) × (${a}/${b}) = ${fmt(increment)}.`, `Round UP to ${fmt(up(increment))}; add ${fmt(grade.minimum)} = $${fmt(pay)}.`],
      table(['Grade', 'Points', 'Min', 'Mid', 'Max'], rows.map(r => [r.grade, (r.bottom ? r.bottom + 1 : 0) + '–' + r.top, r.minimum, r.midpoint, r.maximum])));
  };
  generators.piecework = () => {
    const base = rand(14, 22), bonus = pick([1.5, 2, 3]), block = pick([22, 25, 30]), units = rand(75, 220), hours = rand(5, 8), sets = down(units / block), rate = base + sets * bonus, pay = rate * hours;
    return make('piecework', '11', 'Hourly piece-rate bonus', `Base pay is $${fmt(base)}/hr, plus $${fmt(bonus)} PER HOUR for each full block of ${block} units. The worker makes ${units} units in ${hours} hours. Find sets, hourly rate, and total pay.`,
      [f('sets', 'Full sets', sets, ''), f('rate', 'Hourly rate', rate, '$/hr'), f('pay', 'Total pay', pay)],
      [`${units} ÷ ${block} = ${fmt(units / block)} → ${sets} sets (round DOWN).`, `Hourly rate = ${base} + ${sets} × ${fmt(bonus)} = $${fmt(rate)}.`, `Total pay = ${fmt(rate)} × ${hours} = $${fmt(pay)}.`]);
  };
  generators['per-unit'] = () => {
    const base = pick([1.25, 1.5, 1.75, 2]), bonus = pick([2, 3, 4]), block = pick([25, 30]), units = rand(90, 210), hours = rand(5, 8), sets = down(units / block), basePay = units * base, bonusPay = sets * bonus, total = basePay + bonusPay, hourly = up(total / hours, 2);
    return make('per-unit', '11 · BloNo worked example pp.25–26', 'Per-unit pay and flat batch bonus', `Pay is $${fmt(base)} per UNIT, plus a FLAT $${fmt(bonus)} for each full block of ${block}. The worker produces ${units} units in ${hours} hours. Find base earnings, blocks, bonus, total gross, and hourly rate. Round hourly rate UP to the cent.`,
      [f('base', 'Base earnings', basePay), f('blocks', 'Full blocks', sets, ''), f('bonus', 'Flat batch bonus', bonusPay), f('total', 'Total gross', total), f('hourly', 'Effective hourly rate', hourly, '$/hr')],
      [`Base = ${units} × ${fmt(base)} = $${fmt(basePay)}.`, `Full blocks = floor(${units}/${block}) = ${sets}; flat bonus = ${sets} × ${bonus} = $${fmt(bonusPay)}.`, `Total gross = ${fmt(basePay)} + ${fmt(bonusPay)} = $${fmt(total)}.`, `Hourly = ${fmt(total)} ÷ ${hours} = ${fmt(total / hours)} → $${hourly.toFixed(2)} (round UP to the cent).`], undefined, 'This bonus is flat per completed batch. Hours are used only to calculate the effective hourly rate.');
  };
  generators.factors = () => {
    const factors = [['Education', 20], ['Experience', 15], ['Technical Skills', 15], ['Decision Making', 15], ['Supervision of Others', 10], ['Physical Effort', 5], ['Mental Effort', 10], ['Working Conditions', 10]];
    const rows = factors.map(([name, weight]) => [name, rand(1, 10), weight]), points = rows.map(r => r[1] * r[2]), total = sum(points);
    return make('factors', '6', 'Compensable factor points', 'Calculate each factor’s points, the total, and the maximum possible points. Degrees range from 1 to 10; weights total 100%.',
      rows.map((r, i) => f('factor' + i, r[0] + ' points', points[i], 'points')).concat([f('total', 'Total points', total, 'points'), f('maximum', 'Maximum possible', 1000, 'points')]),
      rows.map((r, i) => `${r[0]}: degree ${r[1]} × weight ${r[2]} = ${points[i]} points.`).concat([`Total = ${points.join(' + ')} = ${total} / 1000.`]), table(['Factor', 'Degree', 'Weight'], rows.map(r => [r[0], r[1], r[2] + '%'])));
  };
  generators.labor = () => {
    const count = rand(20, 80), base = count * rand(40, 80) * 1000, bonus = count * rand(2, 8) * 1000, benefits = count * rand(10, 20) * 1000, stock = count * rand(1, 5) * 1000, total = base + bonus + benefits + stock, level = total / count;
    return make('labor', '7', 'Pay level and labor costs', `A firm has ${count} employees. Annual totals: base $${fmt(base)}, bonus $${fmt(bonus)}, benefits $${fmt(benefits)}, stock $${fmt(stock)}. Find pay level and labor costs.`,
      [f('level', 'Pay level', level), f('labor', 'Labor costs', total)],
      [`Total = ${fmt(base)} + ${fmt(bonus)} + ${fmt(benefits)} + ${fmt(stock)} = $${fmt(total)}.`, `Pay level = ${fmt(total)} ÷ ${count} = $${fmt(level)}.`, `Labor costs = pay level × ${count} = $${fmt(total)}.`]);
  };
  const types = [
    ['annualize', 'Annual bonus → total comp'], ['mean', 'Mean'], ['weighted', 'Weighted mean'], ['median', 'Median & mode'], ['incumbent', 'Incumbent median'], ['iqr', 'Outliers (IQR)'], ['grades', 'Full pay grade table'], ['points', 'Pay for points'], ['piecework', 'Hourly piecework'], ['per-unit', 'Per-unit + batch bonus'], ['factors', 'Compensable factor points'], ['labor', 'Pay level & labor costs'], ['compa', 'Compa-ratios (Exam 3)'], ['groupcompa', 'Group compa-ratio & raise (Exam 3)'], ['netpay', 'Net pay & FICA (Exam 3)'], ['overtime', 'Overtime → net pay (Exam 3)'], ['exec', 'Executive pay package (Exam 3)'], ['workcomp', 'Workers’ comp benefit (Exam 3)'], ['lease', 'Leased labor & FUTA (Exam 3)']
  ].map(([id, label]) => ({ id, label, exam: /Exam 3/.test(label) ? 3 : 2 }));
  const forExam = exam => types.filter(t => (exam === 3) === (t.exam === 3));
  generators.compa = () => {
    const mid = rand(42, 78) * 1000, names = shuffle(['Avery', 'Blake', 'Casey', 'Drew', 'Emery', 'Harper', 'Jules', 'Kai', 'Logan', 'Morgan']).slice(0, 4);
    const crs = shuffle([pick([0.66, 0.68, 0.70, 0.72]), pick([0.80, 0.85, 0.90, 0.95]), pick([1.00, 1.05, 1.10, 1.15, 1.20]), pick([1.28, 1.30, 1.32, 1.35])]);
    const rows = names.map((n, i) => [n, normal(mid * crs[i])]);
    const read = v => v < 0.75 ? 'below, OUTSIDE ideal → raise pay' : v > 1.25 ? 'above, OUTSIDE ideal → freeze increases' : v < 1 ? 'below average, inside range' : v > 1 ? 'above average, inside range' : 'at average';
    return make('compa', 'Exam 3', 'Compa-ratios', `All four employees are in a grade with a $${fmt(mid)} midpoint. Find each compa-ratio (2 decimals). Ideal range: 0.75–1.25.`,
      rows.map(([n, pay], i) => Object.assign(f('c' + i, n + ' compa-ratio', normal(pay / mid, 2), ''), { tolerance: 0.005 })),
      ['Compa-ratio = pay ÷ midpoint.'].concat(rows.map(([n, pay]) => `${n}: ${fmt(pay)} ÷ ${fmt(mid)} = ${normal(pay / mid, 2).toFixed(2)} → ${read(normal(pay / mid, 2))}.`)),
      table(['Employee', 'Pay'], rows));
  };
  generators.netpay = () => {
    const gross = rand(18, 60) * 100, tax = rand(8, 16) * 25 + (gross > 4000 ? 200 : 0), ret = pick([0, 50, 75, 100, 150, 200]);
    const ss = normal(gross * 0.062, 2), med = normal(gross * 0.0145, 2), net = normal(gross - ss - med - tax - ret, 2), fed = normal(ss + med + tax, 2);
    return make('netpay', 'Exam 3', 'Net pay & FICA', `An employee earns $${fmt(gross)} a month gross. Federal income tax withheld is $${fmt(tax)}${ret ? ` and $${fmt(ret)} goes to retirement` : ''}. Find Social Security, Medicare, net pay, and the amount sent to the federal government.`,
      [Object.assign(f('ss', 'Social Security', ss), { tolerance: 0.01 }), Object.assign(f('med', 'Medicare', med), { tolerance: 0.01 }), Object.assign(f('net', 'Net pay', net), { tolerance: 0.01 }), Object.assign(f('fed', 'Sent to federal government', fed), { tolerance: 0.01 })],
      [`SS = ${fmt(gross)} × 6.2% = ${ss.toFixed(2)}.`, `Medicare = ${fmt(gross)} × 1.45% = ${med.toFixed(2)}.`, `Net = ${fmt(gross)} − ${ss.toFixed(2)} − ${med.toFixed(2)} − ${fmt(tax)}${ret ? ' − ' + fmt(ret) : ''} = ${net.toFixed(2)}.`, `Federal = SS + Medicare + income tax = ${fed.toFixed(2)}${ret ? ' (retirement goes to the retirement fund)' : ''}.`]);
  };

  const money = v => '$' + Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const f2 = (id, label, answer, unit = '$') => Object.assign(f(id, label, normal(answer, 2), unit), { tolerance: 0.01 });
  generators.groupcompa = () => {
    const mid = rand(48, 80) * 1000, n = 5;
    const pays = shuffle([0.72, 0.84, 0.97, 1.08, 1.19, 1.31].slice(0, 6)).slice(0, n).map(r => normal(mid * (r + rand(-2, 2) / 100) / 100) * 100);
    const total = sum(pays), avg = total / n, group = normal(avg / mid, 2), low = Math.min(...pays), raise = mid - low;
    return make('groupcompa', 'Exam 3', 'Group compa-ratio & raise to 1.00', `A grade has a $${fmt(mid)} midpoint. Find the group compa-ratio (average pay ÷ midpoint, 2 decimals) and the raise that brings the LOWEST-paid employee to a compa-ratio of 1.00.`,
      [f('total', 'Sum of pay', total), f2('avg', 'Average pay', avg), Object.assign(f('group', 'Group compa-ratio', group, ''), { tolerance: 0.005 }), f('raise', 'Raise for lowest-paid to reach 1.00', raise)],
      [`Sum = ${pays.map(fmt).join(' + ')} = ${fmt(total)}.`, `Average = ${fmt(total)} ÷ ${n} = ${fmt(normal(avg, 2))}.`, `Group CR = ${fmt(normal(avg, 2))} ÷ ${fmt(mid)} = ${group.toFixed(2)}. Average FIRST, then divide once.`, `Lowest pay ${fmt(low)} → raise = ${fmt(mid)} − ${fmt(low)} = $${fmt(raise)}.`],
      table(['Employee', 'Pay'], pays.map((p, i) => ['E' + (i + 1), p])));
  };
  generators.overtime = () => {
    const rate = rand(32, 56) / 2, hours = rand(42, 52), tax = rand(6, 18) * 12, other = pick([0, 25, 40, 60, 75]);
    const reg = 40 * rate, ot = (hours - 40) * rate * 1.5, gross = normal(reg + ot, 2), ss = normal(gross * 0.062, 2), med = normal(gross * 0.0145, 2), net = normal(gross - ss - med - tax - other, 2);
    return make('overtime', 'Exam 3', 'Overtime → net pay', `A non-exempt employee earns ${money(rate)}/hour and worked ${hours} hours this week (overtime is 1.5× over 40). Income tax withheld is $${fmt(tax)}${other ? ` and other deductions are $${fmt(other)}` : ''}. Find gross pay, Social Security, Medicare, and net pay.`,
      [f2('gross', 'Gross pay', gross), f2('ss', 'Social Security', ss), f2('med', 'Medicare', med), f2('net', 'Net pay', net)],
      [`Regular = 40 × ${money(rate)} = ${money(reg)}.`, `Overtime = ${hours - 40} × ${money(rate)} × 1.5 = ${money(ot)} (only hours OVER 40).`, `Gross = ${money(gross)}.`, `SS = ${money(gross)} × 6.2% = ${money(ss)}; Medicare = ${money(gross)} × 1.45% = ${money(med)}.`, `Net = ${money(gross)} − ${money(ss)} − ${money(med)} − $${fmt(tax)}${other ? ' − $' + fmt(other) : ''} = ${money(net)}.`]);
  };
  generators.exec = () => {
    const base = rand(40, 95) * 10000, [freq, mult] = pick([['per quarter', 4], ['per month', 12]]), bonusEach = rand(3, 12) * (mult === 4 ? 10000 : 5000);
    const lti = rand(30, 80) * 100000, ben = rand(20, 60) * 10000, perks = rand(10, 50) * 10000, bonus = bonusEach * mult, total = base + bonus + lti + ben + perks;
    const basePct = normal(base / total * 100, 2), incPct = normal((bonus + lti) / total * 100, 2), implied = normal(base / 0.087);
    return make('exec', 'Exam 3', 'Executive pay package', `An executive’s package: base $${fmt(base)}; bonus $${fmt(bonusEach)} ${freq}; long-term incentives $${fmt(lti)}; benefits $${fmt(ben)}; perquisites $${fmt(perks)}. Find total compensation, base salary as a % of total, and incentives (short + long) as a % of total. Then: if base were the typical 8.7%, what would the total package be?`,
      [f('total', 'Total compensation', total), Object.assign(f('base', 'Base salary %', basePct, '%'), { tolerance: 0.01 }), Object.assign(f('inc', 'Incentives %', incPct, '%'), { tolerance: 0.01 }), Object.assign(f('implied', 'Package if base = 8.7%', implied), { tolerance: 1 })],
      [`Annualize the bonus: ${fmt(bonusEach)} × ${mult} = ${fmt(bonus)}.`, `Total = ${fmt(base)} + ${fmt(bonus)} + ${fmt(lti)} + ${fmt(ben)} + ${fmt(perks)} = $${fmt(total)}.`, `Base % = ${fmt(base)} ÷ ${fmt(total)} = ${basePct.toFixed(2)}%.`, `Incentives % = (${fmt(bonus)} + ${fmt(lti)}) ÷ ${fmt(total)} = ${incPct.toFixed(2)}%.`, `8.7% check: ${fmt(base)} ÷ 0.087 = $${fmt(implied)}.`]);
  };
  generators.workcomp = () => {
    const wage = rand(30, 160) * 10, pctA = 100, pctB = pick([20, 25, 30, 40, 50, 60, 75]), cap = 966.78;
    const full = normal(2 / 3 * wage, 2), part = normal(2 / 3 * wage * pctB / 100, 2), fullCapped = Math.min(full, cap);
    return make('workcomp', 'Exam 3 · Benefits', 'Workers’ compensation weekly benefit', `A New York claimant earned $${fmt(wage)} per week before the injury. Weekly benefit = 2/3 × weekly wage × % disability, capped at $${fmt(cap)}. Find the weekly benefit at 100% disability and at ${pctB}% disability.`,
      [f2('full', 'Weekly benefit at 100% (after cap)', fullCapped), f2('part', `Weekly benefit at ${pctB}%`, Math.min(part, cap))],
      [`100%: 2/3 × ${fmt(wage)} = ${money(full)}${full > cap ? ` → over the cap, so ${money(cap)}` : ' (under the cap)'}.`, `${pctB}%: 2/3 × ${fmt(wage)} × ${pctB / 100} = ${money(part)}.`, 'The cap is why high earners don’t get the full two-thirds.']);
  };
  generators.lease = () => {
    const rate = rand(30, 60) / 2, hours = rand(30, 45), fee = pick([20, 25, 30]), workers = rand(3, 25);
    const basePay = normal(rate * hours, 2), total = normal(basePay * (1 + fee / 100), 2), futa = normal(0.006 * 7000 * workers, 2);
    return make('lease', 'Exam 3', 'Leased labor & FUTA', `(a) A client leases a worker through a staffing agency at ${money(rate)}/hour for ${hours} hours with a ${fee}% agency fee. What does the client pay the agency? (b) FUTA is 0.6% of the first $7,000 each worker earns. What is FUTA for ${workers} employees who each earn over $7,000?`,
      [f2('base', '(a) Wages before fee', basePay), f2('total', '(a) Paid to the agency', total), f2('futa', `(b) FUTA for ${workers} employees`, futa)],
      [`Wages = ${money(rate)} × ${hours} = ${money(basePay)}.`, `With fee = ${money(basePay)} × ${1 + fee / 100} = ${money(total)}. The agency is the legal employer and issues the W-2.`, `FUTA = 0.006 × 7,000 = $42 per worker × ${workers} = ${money(futa)}.`]);
  };
  const generate = type => {
    const exam = Number(global.STUDY_DATA?.exam || global.ACTIVE_EXAM || 2);
    const available = forExam(exam);
    const selected = !type || type === 'random' ? pick(available).id : type;
    if (!generators[selected]) throw new Error('Unknown math type: ' + selected);
    return generators[selected]();
  };
  const selectExam = (problems, count = 4) => {
    const pool = shuffle(problems), chosen = [], groups = new Set();
    for (const problem of pool) {
      const group = problem.examGroup || problem.type;
      if (!groups.has(group)) { groups.add(group); chosen.push(problem); }
      if (chosen.length === count) return chosen;
    }
    for (const problem of pool) {
      if (!chosen.includes(problem)) chosen.push(problem);
      if (chosen.length === count) break;
    }
    return chosen;
  };
  global.MathEngine = { normal, up, down, parseInput, checkField, types, forExam, generate, selectExam };
})(typeof window !== 'undefined' ? window : globalThis);
