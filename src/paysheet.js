/* Payroll worksheets (Exam 3), from the class handouts:
   - "Payroll Worksheet 1" (Tom Cruise, October): gross → before-tax → taxable → taxes → after-tax → net.
     Follows the sheet's own layout: every tax is figured on TAXABLE income (gross − before-tax), federal at a flat 12%.
     Retirement 2% is taken on total gross pay.
   - "Payroll as a Function of HR Exercise 2": term matching + Maria's overtime paycheck (taxes on gross).
   Each has the class numbers and a "New numbers" version, a check/reveal sheet and a guided walkthrough. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const m = v => Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const c2 = v => Math.round((v + 1e-9) * 100) / 100;
  const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  const pick = a => a[rand(0, a.length - 1)];
  const parse = v => Number(String(v ?? '').replace(/[$,%\s]/g, ''));
  const exam = () => Number(S().data?.exam || window.ACTIVE_EXAM || 2);

  const TOM = { title: 'Payroll Worksheet 1 · Tom Cruise, October', name: 'Tom Cruise', base: 9435, bonus: 1250, retPct: 2, pre: [['Health Insurance', 225], ['Dental Insurance', 50], ['Vision Insurance', 18]], fed: 12, post: [['Life Insurance', 35], ['Short-Term Disability Ins.', 42]] };
  const TERMS = [['Gross Pay', 'D'], ['Net Pay', 'B'], ['FLSA', 'F'], ['Withholding Tax', 'E'], ['W-4 Form', 'A'], ['HRIS', 'C']];
  const DEFS = { A: 'Federal form completed by employees to determine tax withholdings', B: 'The employee’s take-home earnings after deductions', C: 'Technology system used to manage employee information and payroll', D: 'Employee’s total earnings before deductions', E: 'Tax deducted from employee pay for income and other purposes', F: 'Federal law governing wages, overtime, and child labor' };
  const MARIA = { title: 'Payroll as a Function of HR · Exercise 2 (Maria)', name: 'Maria', hours: 45, rate: 20, fed: 10, state: 5, fica: 7.65, defs: DEFS, key: TERMS.map(t => t[1]) };
  /* Practice versions A–C from the extra worksheet packet (keys double-checked; payroll math matches the class method). */
  const D_ = { gross: 'Employee’s total earnings before deductions', net: 'The employee’s take-home earnings after deductions', flsa: 'Federal law governing wages, overtime, and child labor', wh: 'Tax deducted from employee pay for income and other purposes', w4: 'Federal form completed by employees to determine tax withholdings', hris: 'Technology system used to manage employee information and payroll' };
  const defsOf = order => Object.fromEntries(order.map((k, i) => ['ABCDEF'[i], D_[k]]));
  const keyOf = order => ['gross', 'net', 'flsa', 'wh', 'w4', 'hris'].map(k => 'ABCDEF'[order.indexOf(k)]);
  const mk = (v, name, hours, rate, fed, state, order) => ({ title: `Practice ${v} · ${name}’s overtime (worksheet packet)`, name, hours, rate, fed, state, fica: 7.65, defs: defsOf(order), key: keyOf(order) });
  const TOMS = { pA: { title: 'Practice A · Jordan Lee, September (worksheet packet)', name: 'Jordan Lee', base: 8275, bonus: 1475, retPct: 3, pre: [['Health Insurance', 240], ['Dental Insurance', 46], ['Vision Insurance', 21]], fed: 12, post: [['Life Insurance', 39], ['Short-Term Disability Ins.', 48]] },
    pB: { title: 'Practice B · Taylor Morgan, November (worksheet packet)', name: 'Taylor Morgan', base: 10680, bonus: 920, retPct: 4, pre: [['Health Insurance', 285], ['Dental Insurance', 62], ['Vision Insurance', 24]], fed: 22, post: [['Life Insurance', 44], ['Short-Term Disability Ins.', 56]] },
    pC: { title: 'Practice C · Casey Rivera, December (worksheet packet)', name: 'Casey Rivera', base: 9140, bonus: 1685, retPct: 5, pre: [['Health Insurance', 260], ['Dental Insurance', 54], ['Vision Insurance', 23]], fed: 18, post: [['Life Insurance', 41], ['Short-Term Disability Ins.', 52]] } };
  const MARIAS = { pA: mk('A', 'Alex', 47, 24, 12, 4, ['hris', 'flsa', 'net', 'wh', 'w4', 'gross']), pB: mk('B', 'Sam', 43, 28, 15, 6, ['gross', 'w4', 'wh', 'hris', 'flsa', 'net']), pC: mk('C', 'Jamie', 49, 26, 14, 5, ['wh', 'net', 'flsa', 'w4', 'gross', 'hris']) };

  /* ---------- solving ---------- */
  function solveTom(t) {
    const gross = c2(t.base + t.bonus), ret = c2(gross * t.retPct / 100), bt = c2(ret + t.pre.reduce((a, [, v]) => a + v, 0)), taxable = c2(gross - bt);
    const ss = c2(taxable * 0.062), med = c2(taxable * 0.0145), fed = c2(taxable * t.fed / 100), il = c2(taxable * 0.0495);
    const taxes = c2(ss + med + fed + il), at = c2(t.post.reduce((a, [, v]) => a + v, 0)), post = c2(taxable - taxes), net = c2(post - at);
    return { gross, ret, bt, taxable, ss, med, fed, il, taxes, at, post, net };
  }
  function solveMaria(x) {
    const reg = c2(Math.min(40, x.hours) * x.rate), otRate = c2(x.rate * 1.5), ot = c2(Math.max(0, x.hours - 40) * otRate), gross = c2(reg + ot);
    const fed = c2(gross * x.fed / 100), state = c2(gross * x.state / 100), fica = c2(gross * x.fica / 100), taxes = c2(fed + state + fica), net = c2(gross - taxes);
    return { reg, otRate, ot, gross, fed, state, fica, taxes, net };
  }
  const $c = (a, tol = 0.02) => ({ answer: a, tol });
  function cellsTom(s) { return { t_gross: $c(s.gross), t_ret: $c(s.ret), t_bt: $c(s.bt), t_taxable: $c(s.taxable), t_ss: $c(s.ss), t_med: $c(s.med), t_fed: $c(s.fed), t_il: $c(s.il), t_taxes: $c(s.taxes, 0.03), t_at: $c(s.at), t_post: $c(s.post, 0.03), t_net: $c(s.net, 0.03) }; }
  function cellsMaria(s, x) {
    const c = { m_reg: $c(s.reg), m_ot: $c(s.ot), m_gross: $c(s.gross), m_fed: $c(s.fed), m_state: $c(s.state), m_fica: $c(s.fica), m_taxes: $c(s.taxes, 0.03), m_net: $c(s.net, 0.03) };
    if (x && x.key) x.key.forEach((k, i) => { c['k' + i] = { choice: k, options: 'ABCDEF'.split('') }; });
    return c;
  }
  const grade = (cell, v) => { if (String(v ?? '').trim() === '') return null; if (cell.choice) return v === cell.choice; const x = parse(v); return Number.isFinite(x) && Math.abs(x - cell.answer) <= cell.tol + 1e-6; };
  const show = cell => cell.choice ? cell.choice : m(cell.answer);

  /* ---------- new numbers ---------- */
  const genTom = () => ({ title: 'New numbers · same steps as Payroll Worksheet 1', name: pick(['Jordan Lee', 'Avery Kim', 'Sam Patel', 'Riley Chen', 'Morgan Diaz']), base: rand(40, 120) * 100 + rand(0, 19) * 5, bonus: pick([0, 250, 500, 750, 1000, 1250, 1500]), retPct: pick([2, 3, 4, 5, 6]),
    pre: [['Health Insurance', pick([150, 180, 225, 260, 310])], ['Dental Insurance', pick([25, 40, 50, 65])], ['Vision Insurance', pick([10, 12, 18, 22])]], fed: pick([10, 12, 22]), post: [['Life Insurance', pick([20, 35, 45])], ['Short-Term Disability Ins.', pick([30, 42, 55])]] });
  const genMaria = () => ({ title: 'New numbers · same steps as Exercise 2', name: pick(['Maria', 'Devon', 'Lena', 'Marcus', 'Priya']), hours: rand(41, 55), rate: pick([15, 16.5, 18, 20, 22, 24, 25.5, 28, 30]), fed: pick([8, 10, 12, 15]), state: pick([4.95, 5]), fica: 7.65 });

  /* ---------- state ---------- */
  const st = () => { const s = S().state; if (!s.paysheet) s.paysheet = { tab: 'tom', kind: { tom: 'class', maria: 'class' }, gen: {}, vals: {}, checked: false, reveal: false, walk: null }; return s.paysheet; };
  const cur = () => { const w = st(), t = w.tab, k = w.kind[t]; if (k === 'gen' && !w.gen[t]) w.gen[t] = t === 'tom' ? genTom() : genMaria(); if (k === 'gen') return w.gen[t]; if (k !== 'class') return (t === 'tom' ? TOMS : MARIAS)[k] || (t === 'tom' ? TOM : MARIA); return t === 'tom' ? TOM : MARIA; };
  const cellsNow = () => { const w = st(), x = cur(); return w.tab === 'tom' ? cellsTom(solveTom(x)) : cellsMaria(solveMaria(x), x); };
  const vkey = id => { const w = st(); return w.tab + ':' + w.kind[w.tab] + ':' + id; };

  /* ---------- the sheet ---------- */
  function page(keep) {
    if (!keep || S().page !== 'paysheet') S().setPage('paysheet');
    if (exam() !== 3) { $('#app').innerHTML = S().heading('', 'Payroll worksheet', 'This worksheet is for Exam 3. Switch exams at the top to use it.'); return; }
    if (W) return walkRender(keep);
    const w = st(), x = cur(), C = cellsNow();
    const inp = id => {
      const cell = C[id], v = w.vals[vkey(id)] ?? '', res = w.checked ? grade(cell, v) : null;
      const cls = res === true ? 'ok' : res === false ? 'bad' : w.checked ? 'blank' : '';
      const note = (w.checked && res !== true) || w.reveal ? `<small>${res === true ? '' : '→ ' + esc(show(cell))}</small>` : '';
      if (cell.choice) return `<span class="ws-cell ${cls}"><select data-pys="${id}"><option value="">–</option>${cell.options.map(o => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('')}</select>${note}</span>`;
      return `<span class="ws-cell ${cls}"><input data-pys="${id}" inputmode="decimal" autocomplete="off" value="${esc(v)}">${note}</span>`;
    };
    const ids = Object.keys(C), ok = ids.filter(id => grade(C[id], w.vals[vkey(id)]) === true).length;
    let body = '';
    if (w.tab === 'tom') {
      const s = solveTom(x);
      body = `<p class="ws-given">Employee: <b>${esc(x.name)}</b> · one month. Taxes are figured on <b>taxable income</b> (gross − before-tax), like the worksheet’s layout. Round to the cent.</p>
      <section class="panel ws-part"><h2>Step 1 · Gross pay</h2><div class="table-wrap"><table class="ws ws-fit"><tbody><tr><td>Base salary</td><td>$${m(x.base)}</td></tr><tr><td>Bonus</td><td>$${m(x.bonus)}</td></tr><tr><td><b>Total gross pay</b></td><td>${inp('t_gross')}</td></tr></tbody></table></div></section>
      <section class="panel ws-part"><h2>Step 2 · Before-tax deductions</h2><div class="table-wrap"><table class="ws ws-fit"><tbody><tr><td>Retirement (${x.retPct}% of gross)</td><td>${inp('t_ret')}</td></tr>${x.pre.map(([n, v]) => `<tr><td>${esc(n)}</td><td>$${m(v)}</td></tr>`).join('')}<tr><td><b>Total before-tax deductions</b></td><td>${inp('t_bt')}</td></tr></tbody></table></div></section>
      <section class="panel ws-part"><h2>Step 3 · Taxable income</h2><div class="table-wrap"><table class="ws ws-fit"><tbody><tr><td>Gross − before-tax deductions</td><td>${inp('t_taxable')}</td></tr></tbody></table></div></section>
      <section class="panel ws-part"><h2>Step 4 · Taxes</h2><div class="table-wrap"><table class="ws ws-fit"><thead><tr><th>Tax</th><th>Rate</th><th>Amount</th></tr></thead><tbody><tr><td>FICA (Social Security)</td><td>6.2%</td><td>${inp('t_ss')}</td></tr><tr><td>Medicare</td><td>1.45%</td><td>${inp('t_med')}</td></tr><tr><td>Federal income tax</td><td>${x.fed}%</td><td>${inp('t_fed')}</td></tr><tr><td>Illinois state income tax</td><td>4.95%</td><td>${inp('t_il')}</td></tr><tr><td><b>Total taxes</b></td><td></td><td>${inp('t_taxes')}</td></tr></tbody></table></div></section>
      <section class="panel ws-part"><h2>Step 5 · After-tax deductions</h2><div class="table-wrap"><table class="ws ws-fit"><tbody>${x.post.map(([n, v]) => `<tr><td>${esc(n)}</td><td>$${m(v)}</td></tr>`).join('')}<tr><td><b>Total after-tax deductions</b></td><td>${inp('t_at')}</td></tr></tbody></table></div></section>
      <section class="panel ws-part"><h2>Step 6 · Net pay</h2><div class="table-wrap"><table class="ws ws-fit"><tbody><tr><td>Taxable income − total taxes = post-tax income</td><td>${inp('t_post')}</td></tr><tr><td>Post-tax income − after-tax deductions = <b>final net pay</b></td><td>${inp('t_net')}</td></tr></tbody></table></div></section>
      ${w.checked || w.reveal ? `<section class="panel ws-part"><details class="ws-steps" open><summary>Worked steps</summary><p>Gross ${m(x.base)} + ${m(x.bonus)} = <b>${m(s.gross)}</b> · retirement ${x.retPct}% × ${m(s.gross)} = ${m(s.ret)} · before-tax total ${m(s.bt)} · taxable ${m(s.gross)} − ${m(s.bt)} = <b>${m(s.taxable)}</b></p><p>SS 6.2% × ${m(s.taxable)} = ${m(s.ss)} · Medicare 1.45% = ${m(s.med)} · federal ${x.fed}% = ${m(s.fed)} · Illinois 4.95% = ${m(s.il)} → total taxes <b>${m(s.taxes)}</b></p><p>Post-tax ${m(s.taxable)} − ${m(s.taxes)} = ${m(s.post)} · after-tax ${m(s.at)} → <b>net ${m(s.net)}</b></p><p class="source">This sheet takes every tax off taxable income. The Payroll Update method takes FICA (SS + Medicare) off gross instead, so check which one a question wants. Answers accept ±2¢ for rounding.</p></details></section>` : ''}`;
    } else {
      const s = solveMaria(x), terms = !!x.key, defs = x.defs || {};
      body = (terms ? `<section class="panel ws-part"><h2>Part 1 · Terminology matching</h2><div class="table-wrap"><table class="ws ws-fit"><thead><tr><th>Term</th><th>Definition (A–F)</th></tr></thead><tbody>${TERMS.map(([t], i) => `<tr><td>${i + 1}. ${esc(t)}</td><td>${inp('k' + i)}</td></tr>`).join('')}</tbody></table></div><ul class="wt-jobs">${Object.entries(defs).map(([k, d]) => `<li><b>${k}.</b> ${esc(d)}</li>`).join('')}</ul></section>` : '') +
      `<section class="panel ws-part"><h2>${terms ? 'Part 2 · ' : ''}${esc(x.name)}’s paycheck</h2><p class="ws-given">${esc(x.name)} works <b>${x.hours} hours</b> in a week at <b>$${m(x.rate)}/hour</b>, with 1.5× her regular rate for hours over 40. Federal withholding <b>${x.fed}%</b>, state <b>${x.state}%</b>, FICA <b>${x.fica}%</b>, all off gross.</p>
      <div class="table-wrap"><table class="ws ws-fit"><tbody><tr><td>1. Regular pay (40 hrs)</td><td>${inp('m_reg')}</td></tr><tr><td>1. Overtime pay</td><td>${inp('m_ot')}</td></tr><tr><td>2. Gross pay</td><td>${inp('m_gross')}</td></tr><tr><td>3. Federal tax</td><td>${inp('m_fed')}</td></tr><tr><td>3. State tax</td><td>${inp('m_state')}</td></tr><tr><td>3. FICA</td><td>${inp('m_fica')}</td></tr><tr><td>3. Total taxes withheld</td><td>${inp('m_taxes')}</td></tr><tr><td>4. <b>Net pay</b></td><td>${inp('m_net')}</td></tr></tbody></table></div></section>
      ${w.checked || w.reveal ? `<section class="panel ws-part"><details class="ws-steps" open><summary>Worked steps</summary>${terms ? `<p>Matching: ${TERMS.map(([t], i) => `${i + 1}-${x.key[i]}`).join(' · ')}</p>` : ''}<p>Regular 40 × ${m(x.rate)} = <b>${m(s.reg)}</b> · overtime ${x.hours - 40} × (${m(x.rate)} × 1.5 = ${m(s.otRate)}) = <b>${m(s.ot)}</b> · gross <b>${m(s.gross)}</b></p><p>Federal ${x.fed}% = ${m(s.fed)} · state ${x.state}% = ${m(s.state)} · FICA ${x.fica}% = ${m(s.fica)} → total <b>${m(s.taxes)}</b> · net ${m(s.gross)} − ${m(s.taxes)} = <b>${m(s.net)}</b></p><p class="source">Answers accept ±2¢ for rounding.</p></details></section>` : ''}`;
    }
    $('#app').innerHTML = S().heading('CALCULATE / WORKSHEET', 'Payroll Worksheets', 'The class payroll handouts, cell by cell. Your entries save as you type.',
      `<div class="ws-score">${w.checked ? `<b>${ok}</b> / ${ids.length}<small>cells correct</small>` : `<small>${ids.length} cells</small>`}</div>`) +
      `<section class="panel ws-bar"><div class="ws-switch"><button class="${w.tab === 'tom' ? 'primary' : ''}" data-action="pys-tab" data-tab="tom">Worksheet 1 · Tom</button><button class="${w.tab === 'maria' ? 'primary' : ''}" data-action="pys-tab" data-tab="maria">Exercise 2 · Maria</button></div>
      <div class="ws-switch">${[['class', 'Class sheet'], ['pA', 'Practice A'], ['pB', 'Practice B'], ['pC', 'Practice C'], ['gen', 'New numbers']].map(([k, l]) => `<button class="${w.kind[w.tab] === k ? 'primary' : ''}" data-action="pys-kind" data-kind="${k}">${l}</button>`).join('')}<button data-action="pyw-open" class="wt-launch">▶ Guided walkthrough</button></div>
      <span class="source">${esc(x.title)}</span></section>${body}
      <div class="ws-actions"><button data-action="pys-clear">Clear sheet</button><button data-action="pys-reveal">${w.reveal ? 'Hide answers' : 'Reveal answers'}</button>${w.kind[w.tab] === 'gen' ? '<button data-action="pys-new">New numbers ↻</button>' : ''}<button class="primary" data-action="pys-check">Check sheet →</button></div>`;
  }
  function check() {
    const w = st(), C = cellsNow();
    document.querySelectorAll('[data-pys]').forEach(n => w.vals[vkey(n.dataset.pys)] = n.value);
    w.checked = true;
    const ids = Object.keys(C), ok = ids.filter(id => grade(C[id], w.vals[vkey(id)]) === true).length;
    S().record('generated-paysheet', 'payroll', ok === ids.length); S().sound(ok === ids.length ? 'correct' : 'incorrect'); S().save(); page(true);
    S().toast(`${ok} of ${ids.length} cells correct`);
  }
  const save = e => { const id = e.target?.dataset?.pys; if (id) { st().vals[vkey(id)] = e.target.value; S().save(); } };
  document.addEventListener('input', save); document.addEventListener('change', save);

  /* ---------- guided walkthrough ---------- */
  let W = null;
  function steps() {
    const w = st(), x = cur(), C = cellsNow(), out = [], F = (id, label) => ({ id, label, cell: C[id] });
    const add = (title, teach, fields, hint, work) => out.push({ title, teach, fields, hint, work });
    if (w.tab === 'tom') {
      const s = solveTom(x);
      add('Gross pay', `Gross pay is <b>everything earned</b> before anything comes out.<div class="wt-formula">Gross = base salary + bonus</div>`, [F('t_gross', 'Total gross pay')], `${m(x.base)} + ${m(x.bonus)}`, `${m(x.base)} + ${m(x.bonus)} = <b>$${m(s.gross)}</b>`);
      add('Before-tax deductions', `Before-tax deductions come out <b>first</b>, so they lower the income you pay tax on (retirement, health, dental, vision).<div class="wt-formula">Retirement = ${x.retPct}% × gross</div>Then add the fixed amounts: ${x.pre.map(([n, v]) => `${n} $${m(v)}`).join(', ')}.`, [F('t_ret', `Retirement (${x.retPct}%)`), F('t_bt', 'Total before-tax')], `${x.retPct / 100} × ${m(s.gross)}, then add ${x.pre.map(([, v]) => m(v)).join(' + ')}.`, `Retirement ${m(s.ret)} + ${x.pre.map(([, v]) => m(v)).join(' + ')} = <b>$${m(s.bt)}</b>`);
      add('Taxable income', `<div class="wt-formula">Taxable income = gross − before-tax deductions</div>`, [F('t_taxable', 'Taxable income')], `${m(s.gross)} − ${m(s.bt)}`, `${m(s.gross)} − ${m(s.bt)} = <b>$${m(s.taxable)}</b>`);
      add('Taxes', `On this worksheet every tax is a percent of <b>taxable income</b>:<div class="wt-formula">SS 6.2% · Medicare 1.45% · Federal ${x.fed}% · Illinois 4.95%</div>Round each to the cent, then add them.`, [F('t_ss', 'Social Security'), F('t_med', 'Medicare'), F('t_fed', 'Federal'), F('t_il', 'Illinois'), F('t_taxes', 'Total taxes')], `Multiply ${m(s.taxable)} by each rate.`, `SS ${m(s.ss)} · Medicare ${m(s.med)} · Federal ${m(s.fed)} · Illinois ${m(s.il)} → <b>$${m(s.taxes)}</b>`);
      add('After-tax deductions', `After-tax deductions come out <b>last</b> and don’t lower taxes: ${x.post.map(([n, v]) => `${n} $${m(v)}`).join(', ')}.`, [F('t_at', 'Total after-tax')], `Add them up.`, `<b>$${m(s.at)}</b>`);
      add('Net pay', `<div class="wt-formula">Post-tax income = taxable − total taxes<br>Net pay = post-tax − after-tax deductions</div>`, [F('t_post', 'Post-tax income'), F('t_net', 'Final net pay')], `${m(s.taxable)} − ${m(s.taxes)}, then − ${m(s.at)}.`, `${m(s.taxable)} − ${m(s.taxes)} = ${m(s.post)} · − ${m(s.at)} = <b>$${m(s.net)}</b>`);
    } else {
      const s = solveMaria(x);
      if (x.key) add('Match the terms', `Match each payroll term to its definition:<ul class="wt-jobs">${Object.entries(x.defs).map(([k, d]) => `<li><b>${k}.</b> ${esc(d)}</li>`).join('')}</ul>`, TERMS.map(([t], i) => F('k' + i, `${i + 1}. ${t}`)), `Gross = before deductions; net = take-home; FLSA = wages & overtime law.`, TERMS.map(([t], i) => `${t} → <b>${x.key[i]}</b>`).join(' · '));
      add('Regular and overtime pay', `The first 40 hours are paid at the regular rate. Hours over 40 get <b>1.5×</b> the rate (FLSA).<div class="wt-formula">Regular = 40 × rate<br>Overtime = (hours − 40) × rate × 1.5</div>`, [F('m_reg', 'Regular pay'), F('m_ot', 'Overtime pay')], `40 × ${m(x.rate)} and ${x.hours - 40} × ${m(s.otRate)}`, `40 × ${m(x.rate)} = <b>${m(s.reg)}</b> · ${x.hours - 40} × ${m(s.otRate)} = <b>${m(s.ot)}</b>`);
      add('Gross pay', `<div class="wt-formula">Gross = regular + overtime</div>`, [F('m_gross', 'Gross pay')], `${m(s.reg)} + ${m(s.ot)}`, `<b>$${m(s.gross)}</b>`);
      add('Taxes withheld', `Here every tax comes off <b>gross</b>: federal ${x.fed}%, state ${x.state}%, FICA ${x.fica}% (6.2% SS + 1.45% Medicare).`, [F('m_fed', 'Federal'), F('m_state', 'State'), F('m_fica', 'FICA'), F('m_taxes', 'Total taxes')], `Multiply ${m(s.gross)} by each rate.`, `${m(s.fed)} + ${m(s.state)} + ${m(s.fica)} = <b>$${m(s.taxes)}</b>`);
      add('Net pay', `<div class="wt-formula">Net = gross − total taxes</div>`, [F('m_net', 'Net pay')], `${m(s.gross)} − ${m(s.taxes)}`, `<b>$${m(s.net)}</b>`);
    }
    return out;
  }
  const wst = () => { const w = st(); if (!w.walk || w.walk.key !== w.tab + w.kind[w.tab]) w.walk = { key: w.tab + w.kind[w.tab], i: 0, vals: {}, status: {} }; return w.walk; };
  function walkRender(keep) {
    if (!keep || S().page !== 'paysheet') S().setPage('paysheet');
    const wk = wst(), list = W;
    if (wk.i >= list.length) { const right = Object.values(wk.status).filter(s => s.firstTry).length; $('#app').innerHTML = S().heading('WALKTHROUGH / COMPLETE', 'You worked the whole sheet', cur().title) + `<section class="panel"><div class="result-score">${right}<small> / ${list.length} steps right on the first try</small></div><p>Now do the full sheet without the lessons, then try new numbers.</p><div class="actions"><button data-action="pyw-restart">Walk through again</button><button class="primary" data-action="pyw-exit">Do the full sheet →</button></div></section>`; S().sound('complete'); return; }
    const step = list[wk.i], stt = wk.status[wk.i] || {};
    const res = id => stt.checked ? grade(step.fields.find(f => f.id === id).cell, wk.vals[id]) : null;
    const allOk = stt.checked && step.fields.every(f => res(f.id) === true);
    const field = f => { const r0 = res(f.id), cls = r0 === true ? 'ok' : r0 === false ? 'bad' : stt.checked ? 'blank' : '', v = wk.vals[f.id] ?? '';
      const ctl = f.cell.choice ? `<select data-pyw="${f.id}"><option value="">–</option>${f.cell.options.map(o => `<option ${o === v ? 'selected' : ''}>${o}</option>`).join('')}</select>` : `<input data-pyw="${f.id}" inputmode="decimal" autocomplete="off" value="${esc(v)}">`;
      return `<label class="wt-field ${cls}"><span>${esc(f.label)}</span>${ctl}${stt.checked && r0 !== true && stt.shown ? `<small>→ ${esc(show(f.cell))}</small>` : ''}</label>`; };
    $('#app').innerHTML = S().heading(`WALKTHROUGH / STEP ${wk.i + 1} OF ${list.length}`, step.title, cur().title, '<button data-action="pyw-exit">Exit walkthrough</button>') +
      `<div class="wt-progress"><i style="width:${Math.round(wk.i / list.length * 100)}%"></i></div>
      <section class="panel wt-lesson"><div class="eyebrow">LESSON</div><div class="wt-teach">${step.teach}</div>${stt.hint ? `<div class="wt-hint"><b>HINT</b> ${step.hint}</div>` : ''}</section>
      <section class="panel wt-answer"><div class="eyebrow">${step.fields.length > 1 ? 'YOUR ANSWERS' : 'YOUR ANSWER'}</div><div class="wt-fields">${step.fields.map(field).join('')}</div>
      ${stt.checked ? `<div class="feedback ${allOk ? '' : 'wrong'}"><h3>${allOk ? 'Correct' : stt.shown ? 'Here’s how it works' : 'Not quite. Check the red fields.'}</h3>${allOk || stt.shown ? `<p class="wt-work">${step.work}</p>` : ''}</div>` : ''}
      <div class="wt-actions"><button data-action="pyw-prev" ${wk.i ? '' : 'disabled'}>← Back</button><span class="wt-spacer"></span>
      ${!stt.hint && !allOk ? '<button data-action="pyw-hint">Hint</button>' : ''}${stt.checked && !allOk && !stt.shown ? '<button data-action="pyw-show">Show me</button>' : ''}
      ${allOk || stt.shown ? `<button class="primary" data-action="pyw-next">${wk.i === list.length - 1 ? 'Finish →' : 'Next step →'}</button>` : '<button class="primary" data-action="pyw-check">Check →</button>'}</div></section>`;
  }
  function walkHandle(a) {
    const w = st();
    if (a === 'pyw-open' || a === 'pyw-restart') { if (a === 'pyw-restart') w.walk = null; W = steps(); wst(); S().save(); S().sound('start'); walkRender(); window.scrollTo(0, 0); return; }
    if (a === 'pyw-exit') { W = null; return page(); }
    if (!W) W = steps();
    const wk = wst(), stt = wk.status[wk.i] = wk.status[wk.i] || {}, step = W[wk.i];
    const grab = () => document.querySelectorAll('[data-pyw]').forEach(n => wk.vals[n.dataset.pyw] = n.value);
    if (a === 'pyw-check') { grab(); const ok = step.fields.every(f => grade(f.cell, wk.vals[f.id]) === true); if (!stt.checked && ok && !stt.hint) stt.firstTry = true; stt.checked = true; S().record('generated-paywalk', 'payroll', ok); S().sound(ok ? 'correct' : 'incorrect'); S().save(); walkRender(true); }
    else if (a === 'pyw-hint') { grab(); stt.hint = true; S().sound('hint'); walkRender(true); }
    else if (a === 'pyw-show') { grab(); stt.shown = true; S().save(); walkRender(true); }
    else if (a === 'pyw-next') { wk.i++; S().save(); S().sound('navigation'); walkRender(); window.scrollTo(0, 0); }
    else if (a === 'pyw-prev') { wk.i = Math.max(0, wk.i - 1); walkRender(); }
  }
  document.addEventListener('input', e => { const id = e.target?.dataset?.pyw; if (id && W) wst().vals[id] = e.target.value; });
  document.addEventListener('change', e => { const id = e.target?.dataset?.pyw; if (id && W) wst().vals[id] = e.target.value; });

  window.PaySheet = {
    mode(p) { if (p === 'paysheet') { W = null; page(); return true; } return false; },
    handle(a, b) {
      if (!a.startsWith('pys-') && !a.startsWith('pyw-')) return false;
      if (a.startsWith('pyw-')) { walkHandle(a); return true; }
      const w = st();
      if (a === 'pys-check') check();
      else if (a === 'pys-reveal') { w.reveal = !w.reveal; S().save(); page(true); }
      else if (a === 'pys-clear') { Object.keys(w.vals).filter(k => k.startsWith(w.tab + ':' + w.kind[w.tab] + ':')).forEach(k => delete w.vals[k]); w.checked = false; w.reveal = false; S().save(); page(true); }
      else if (a === 'pys-new') { w.gen[w.tab] = w.tab === 'tom' ? genTom() : genMaria(); Object.keys(w.vals).filter(k => k.startsWith(w.tab + ':gen:')).forEach(k => delete w.vals[k]); w.walk = null; w.checked = false; w.reveal = false; S().sound('start'); S().save(); page(true); }
      else if (a === 'pys-tab') { w.tab = b.dataset.tab; w.checked = false; w.reveal = false; S().save(); page(true); }
      else if (a === 'pys-kind') { w.kind[w.tab] = b.dataset.kind; w.checked = false; w.reveal = false; S().save(); page(true); }
      return true;
    },
    _solveTom: solveTom, _solveMaria: solveMaria, _TOM: TOM, _MARIA: MARIA, _cellsTom: cellsTom, _cellsMaria: cellsMaria, _TOMS: TOMS, _MARIAS: MARIAS, _genTom: genTom, _genMaria: genMaria
  };
})();
