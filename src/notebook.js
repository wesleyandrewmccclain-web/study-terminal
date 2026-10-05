/* Mistakes notebook + printable cheat sheet.
   Cheat sheet content: "MGT 354 – Formula Sheet (Exam 3)" (9/29) + the 10/3 Payroll Update. Nothing new is introduced. */
(() => {
  'use strict';
  const S = () => window.Study;
  const $ = s => document.querySelector(s);
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const exam = () => Number(S().data?.exam || window.ACTIVE_EXAM || 2);

  /* ================= Mistakes notebook ================= */
  function mistakes(msg) {
    S().setPage('mistakes');
    const st = S().state, d = S().data, topicName = id => d.topics.find(t => t.id === id)?.name || id;
    const items = (st.missed || []).map(id => d.questions.find(q => q.id === id) ? { kind: 'q', it: d.questions.find(q => q.id === id) } : d.math.find(m => m.id === id) ? { kind: 'm', it: d.math.find(m => m.id === id) } : null).filter(Boolean);
    const again = d.flashcards.filter(c => st.cards?.[c.id] === 'again');
    const byTopic = {}; for (const x of items) (byTopic[x.it.topic] = byTopic[x.it.topic] || []).push(x);
    const order = d.topics.map(t => t.id).filter(id => byTopic[id]);
    const qHTML = ({ kind, it }) => kind === 'q'
      ? `<article class="nb-item"><p class="nb-q">${esc(it.prompt)}</p><p class="nb-a"><span>Answer</span>${esc(it.options[it.answer])}</p>${it.explanation ? `<p class="nb-why">${esc(it.explanation)}</p>` : ''}<div class="nb-foot"><span class="source">${esc(it.source || '')}</span><button class="text-button" data-action="nb-gotit" data-id="${esc(it.id)}">I’ve got it now ✓</button></div></article>`
      : `<article class="nb-item"><p class="nb-q">${esc(it.title)}</p><p class="nb-why">${esc(it.prompt)}</p><p class="nb-a"><span>Answer</span>${it.fields.map(f => `${esc(f.label)}: ${f.unit === '$' ? '$' : ''}${Number(f.answer).toLocaleString('en-US', { maximumFractionDigits: 2 })}${f.unit && f.unit !== '$' ? f.unit : ''}`).join(' · ')}</p>${it.steps ? `<ol class="nb-steps">${it.steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}<div class="nb-foot"><span class="source">${esc(it.source || '')}</span><button class="text-button" data-action="nb-gotit" data-id="${esc(it.id)}">I’ve got it now ✓</button></div></article>`;
    $('#app').innerHTML = S().heading('', 'Mistakes notebook', 'Everything you’ve missed, with the right answer and why. Read it the night before.') +
      (msg ? `<p class="nb-msg" role="status">${esc(msg)}</p>` : '') +
      (items.length ? `<div class="nb-bar"><strong>${items.length} to review</strong><button class="primary" data-action="nb-quiz">Quiz me on these →</button></div>` +
        order.map(t => `<section class="nb-sec"><h2>${esc(topicName(t))} <span>${byTopic[t].length}</span></h2>${byTopic[t].map(qHTML).join('')}</section>`).join('')
        : `<section class="panel nb-empty"><h2>No mistakes yet</h2><p>Questions you miss land here automatically. Answer them right later and they leave on their own.</p><button class="primary" data-action="mode" data-mode="quiz">Take a quick quiz →</button></section>`) +
      (again.length ? `<section class="nb-sec"><h2>Flashcards you marked “again” <span>${again.length}</span></h2><div class="nb-cards">${again.map(c => `<div class="nb-card"><b>${esc(c.front)}</b><span>${esc(c.back)}</span></div>`).join('')}</div><button class="text-button" data-action="nb-cards">Review these cards →</button></section>` : '');
  }

  /* ================= Cheat sheet (Exam 3) ================= */
  const SHEET = [
    ['Compa-ratio', [
      '<b>CR = pay ÷ range midpoint</b> (internal) · pay ÷ market rate (external)',
      '&lt;1 below · =1 at · &gt;1 above average · <b>ideal 0.75–1.25</b>',
      'Low → raise to policy · High → <b>freeze</b> (internal) / consider decreasing (external) · tenure caveat',
      '<b>Group CR</b> = (Σ pay ÷ # employees) ÷ midpoint · Pay = CR × mid · Raise to 1.0 = mid − pay',
      '⚠ Never divide by min/max. Only min + spread given? Mid = Min ÷ (1 − RD)']],
    ['Payroll basics', [
      '<b>SS 6.2% (to $184,500) + Medicare 1.45% (all wages) = FICA 7.65%</b>, off <b>gross</b> · employer on $60k = $4,590',
      'Net = gross − SS − Medicare − income tax − other deductions',
      'Employer pays matching 7.65% + <b>FUTA (0.6% of first $7,000 = $42)</b> + SUTA (experience rating)',
      'Angela $2,000: 2,000 − 124 − 29 − 237 − 50 = <b>$1,560</b> · $1,000 → $76.50 FICA',
      '6 steps: time collection → approval & entry → calculations → <b>review & audit</b> → disbursement → reporting',
      'W-4 at hire · W-2 year end · 1099 contractor · keep records 3–4 yrs']],
    ['Computing taxes (10/3 update)', [
      'Flow: gross → <b>before-tax</b> (health, 401k, HSA/FSA, commuter) → taxes → <b>after-tax</b> (Roth, dues, garnish, charity) → net',
      'Given a withholding number? <b>Just subtract it.</b> Compute only if none is given.',
      'Annualize: mo ×12 · semi ×24 · bi-wk ×26 · wk ×52 → taxable = annual − before-tax',
      '<b>Fed tax = base + rate × (taxable − floor)</b> ÷ pay periods',
      '<table class="cs-t"><tr><th>Rate</th><th>Over</th><th>Base</th></tr><tr><td>10%</td><td>0</td><td>0</td></tr><tr><td>12%</td><td>11,925</td><td>1,193</td></tr><tr><td>22%</td><td>48,475</td><td>5,579</td></tr><tr><td>24%</td><td>103,350</td><td>17,651</td></tr><tr><td>32%</td><td>197,300</td><td>40,199</td></tr><tr><td>35%</td><td>250,525</td><td>57,231</td></tr><tr><td>37%</td><td>626,350</td><td>188,770</td></tr></table>',
      '49,000 → 5,579 + .22 × 525 = <b>5,694.50</b> (not 22% × 49,000) · Marginal = bracket · Effective = tax ÷ taxable',
      '<b>Illinois = flat 4.95%</b> of taxable pay',
      'W-4: Step 2 two jobs · Step 3 dependents ($2,000/child &lt;17) · <b>4(c) extra withholding</b> · 5 sign · goes to employer',
      'IL-W-4 uses allowances (more = less withheld); federal W-4 doesn’t']],
    ['Executive pay', [
      '5 parts: base · short-term bonus · long-term incentives (stock) · benefits · perquisites',
      '<b>Base ≈ 8.7%</b> of total → total = base ÷ 0.087 · bonuses shrinking share',
      'Bonus measures: profit, revenue, cash flow (+ strategic, individual, discretionary) · balanced scorecard',
      'Annualize bonuses before adding (quarterly ×4) · ⚠ perks ≠ benefits']],
    ['Flexible workforce', [
      'Contingent = no contract for ongoing employment · ⚠ leaving for school/retiring is <b>not</b> contingent',
      '4 types: part-time · temp/on-call · leased · contractor/freelancer/consultant',
      '<b>Leased cost = (rate × hours) × 1.25</b> (25% fee) · agency issues the W-2',
      'Rising: recessions · international competition · manufacturing → service',
      'Part-timers: retirement 38% vs 81%; ERISA entry after age/service; <b>not</b> protected by PPACA; COBRA after resigning',
      'Schedules: flextime · compressed (4×10) · telecommuting · worked a holiday → paid alternative day off']],
    ['Employee vs contractor', [
      'Both tests: integration · right to control · skill · continuing relationship',
      '<b>Economic realities only:</b> investment in facilities · risk of profit/loss',
      '<b>Common law only:</b> intent · tools · supervision · method of payment · type of business · &gt;1 firm']],
    ['Benefits', [
      '≈ <b>30% of total comp</b> · adds <b>42¢ per $1 of wages</b> (different denominators)',
      'Required (3): workers’ comp · Social Security/Medicare · unemployment insurance',
      'Noncontributory = employer pays all · contributory = shared · cafeteria risk = adverse selection',
      '<table class="cs-t"><tr><th>Law</th><th>Year</th><th>Key rule</th></tr><tr><td>FMLA</td><td>1993</td><td>50+ within 75 mi · 12 wks <b>unpaid</b></td></tr><tr><td>COBRA</td><td>1985</td><td>20+ · up to <b>102%</b> · 18 mo (36) · ex-employee pays</td></tr><tr><td>HIPAA</td><td>1996</td><td>preexisting conditions · privacy</td></tr><tr><td>PPACA</td><td>2010</td><td>employer mandate stays · part-timers not protected</td></tr><tr><td>ERISA</td><td>1974</td><td>no plan required · age 21 · vesting · created PBGC</td></tr></table>',
      '<b>Vesting</b>: full at 3 yrs or 20%/yr from yr 2 → 6 · own money vests now · ⚠ portability NOT required',
      'Workers’ comp: state, no-fault, can’t sue · <b>2/3 × weekly wage × % disability</b> (NY cap $966.78)',
      'Social Security 1935, pay-as-you-go · Medicare 1965 · unemployment employer-paid, experience rated']],
    ['Retirement & health plans', [
      '<b>DB</b>: benefit promised, <b>employer</b> risk, retention · <b>DC (401k)</b>: contribution promised, <b>employee</b> risk, mobility',
      'Indemnity any provider · <b>HMO</b> network only, cheapest · PPO out of network for more · <b>POS</b> hybrid',
      'Copay = flat $ · <b>coinsurance = %</b> · deductible = before plan pays · HSA rolls over · FSA use it or lose it']],
    ['Guest speakers', [
      '<b>Kathleen</b>: benefits shape total comp · risk · compliance · talent · fully insured = fixed premium, predictable · <b>self-funded</b> = pays claims, more risk + control, stop-loss (≠ no risk) · workers’ comp employer-paid, 1099s outside · ACA 50+ FTEs, kids to 26, affordable ≤ 9.96% · birthday rule · QLE vs open enrollment · IL UI $14,250, new 3.35% · IL posting: pay range + benefits',
      '<b>Derek</b>: Moore’s Law · AI timeline 1689 Lloyd’s → Markov → 2012 AlexNet → 2016 Tay → 2018 BERT → 2020 GPT · FERPA / HIPAA / COPPA / GDPR · CRAFTY prompts · AI hiring: compliance + accuracy, employer liable (CA CO IL NY MD)']],
    ['Before you answer', [
      'Read the bold/underlined words · % off gross · CR uses the midpoint · annualize first · high CR → freeze · personal reasons ≠ contingent · FMLA unpaid / COBRA employee-paid · DB employer risk / DC employee risk · vesting ≠ portability · perks ≠ benefits · Roth = after-tax · brackets tax only the dollars above the floor']]
  ];
  function cheat() {
    S().setPage('cheat');
    if (exam() !== 3) { $('#app').innerHTML = S().heading('', 'Cheat sheet', 'This printable sheet is for Exam 3. Switch exams at the top to see it.'); return; }
    $('#app').innerHTML = S().heading('', 'Cheat sheet', 'Exam 3 on one page: formulas, tax brackets, the paycheck order, laws, and the traps. From your formula sheet and the 10/3 payroll update.', '<button class="primary cs-print" data-action="nb-print">Print ⎙</button>') +
      `<div class="cs" id="cheatsheet"><header class="cs-head"><strong>MGT 354 · Exam 3 cheat sheet</strong><span>${esc(S().data.examDay || '')}</span></header>${SHEET.map(([h, lines]) => `<section class="cs-sec"><h3>${esc(h)}</h3><ul>${lines.map(l => l.startsWith('<table') ? `<li class="cs-tbl">${l}</li>` : `<li>${l}</li>`).join('')}</ul></section>`).join('')}</div>`;
  }

  window.Notebook = {
    mode(p) { if (p === 'mistakes') { mistakes(); return true; } if (p === 'cheat') { cheat(); return true; } return false; },
    handle(a, b) {
      if (!a.startsWith('nb-')) return false;
      const st = S().state;
      if (a === 'nb-gotit') { st.missed = (st.missed || []).filter(x => x !== b.dataset.id); S().save(); S().sound('correct'); mistakes('Removed. If you miss it again, it comes back.'); }
      else if (a === 'nb-quiz') { if (st.missed?.length) S().startMixedReview([...st.missed]); }
      else if (a === 'nb-cards') S().startFlashList(S().shuffle(S().data.flashcards.filter(c => st.cards?.[c.id] === 'again')));
      else if (a === 'nb-print') window.print();
      return true;
    }
  };
})();
