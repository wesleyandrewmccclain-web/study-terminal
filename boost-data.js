/* Exam 3 content for the newer study modes: written-answer prompts and the formula-sheet lookup drill.
   Sources: Exam 3 Practice Set Section D (keyed), Exam 3 Study Guide, and the Exam 3 Formula Sheet (sections 1–8).
   Each written prompt lists the key points a full-credit answer hits; "any" holds the words that count for a point. */
window.BOOST_DATA = {
  written: [
    { id: 'w-s1', topic: 'benefits', kind: 'short', source: 'Exam 3 Practice Set S1 · key',
      prompt: 'Distinguish between vesting and portability, and state what ERISA does and does not require for each.',
      points: [
        { label: 'Vesting = time worked before you own the employer’s contributions', any: ['vest', 'entitle', 'own'] },
        { label: 'Your own contributions vest immediately', any: ['own contribution', 'employee contribution', 'immediately', 'irrevocab'] },
        { label: 'Portability = moving the money to a new employer', any: ['portab', 'new employer', 'next job', 'transfer', 'move'] },
        { label: 'ERISA requires vesting (3-year cliff or 20%/yr graded to 6)', any: ['3 year', 'three year', '20%', '20 percent', 'graded', 'cliff', 'six year', '6 year'] },
        { label: 'ERISA does NOT require portability (voluntary, must be vested first)', any: ['not require', "doesn't require", 'does not require', 'voluntary', 'optional', 'not mandat'] }
      ],
      model: 'Vesting is how long an employee must work before becoming entitled to the employer’s contributions to the pension plan; the employee’s own contributions vest immediately and irrevocably. Portability is whether vested pension money can move with the employee to a new employer. ERISA requires vesting on one of two schedules: full vesting after 3 years, or 20% after 2 years and 20% each year after (full at 6). ERISA does not require portability; it is voluntary, and the benefit must be vested before it can transfer.' },
    { id: 'w-s2', topic: 'benefits', kind: 'short', source: 'Exam 3 Practice Set S2 · key',
      prompt: 'List the four administration questions that must be answered when setting up a benefit package, and explain the trade-off in the second one.',
      points: [
        { label: 'Who should be covered?', any: ['who should be covered', 'who is covered', 'who gets covered', 'coverage', 'eligib'] },
        { label: 'How much choice should employees have?', any: ['choice', 'choose', 'flexib', 'cafeteria', 'menu'] },
        { label: 'How should benefits be financed?', any: ['financ', 'contributory', 'who pays', 'fund'] },
        { label: 'Are the benefits legally defensible?', any: ['legal', 'defensib', 'law'] },
        { label: 'Trade-off: fits needs / more value vs. administration and adverse selection', any: ['adverse selection', 'administ', 'cost', 'complex'] }
      ],
      model: '(1) Who should be covered? (2) How much choice should employees have? (3) How should benefits be financed: noncontributory, contributory, or employee-financed? (4) Are the benefits legally defensible? The trade-off in (2): flexible (cafeteria) plans let employees pick benefits that fit their age, family, and needs, which raises perceived value for the same spend, but they cost more to administer and invite adverse selection, where people choose the coverage they already know they’ll use and drive up its cost.' },
    { id: 'w-s3', topic: 'benefits', kind: 'essay', source: 'Exam 3 Practice Set S3 · key',
      prompt: 'A manager says, “Our compa-ratios in this department are low, so we should add an on-site day care center.” Using the benefit planning logic from the course, explain what’s wrong with that reasoning.',
      points: [
        { label: 'Ask first whether a benefit is the right tool (better use of the money?)', any: ['better use', 'right tool', 'instead', 'first ask', 'is a benefit', 'wages or incentive', 'raise wages', 'raising wages'] },
        { label: 'Low compa-ratio is a PAY LEVEL problem', any: ['pay level', 'underpaid', 'below the midpoint', 'below midpoint', 'below market', 'paid less'] },
        { label: 'Fix = raise pay toward policy/market', any: ['raise', 'increase pay', 'bring pay', 'in line', 'adjust pay'] },
        { label: 'Day care doesn’t change the compa-ratio', any: ["doesn't change", 'does not change', "won't change", 'not change', "doesn't move", 'does not move', "won't move", 'not move', "doesn't affect", 'does not affect', 'no effect', 'no impact', "doesn't fix", 'does not fix', 'not fix', "won't fix"] },
        { label: 'Justify day care on its own (survey evidence / what employees value)', any: ['survey', 'value', 'casino', 'niagara', 'mcdonald', 'employees want', 'prefer'] }
      ],
      model: 'The manager jumped to a benefit without asking whether a benefit is the right tool. The planning question is whether there’s a better use of the money, such as raising wages or adding incentives. Low compa-ratios are a pay-level problem: employees are paid below the midpoint (or the market), and the prescribed fix is to bring their pay in line. Day care doesn’t move a compa-ratio at all. If day care is proposed, it has to be justified on its own, with evidence the target employees value it highly, as in the Niagara Falls casino example, and only after wages and incentives are evaluated, as McDonald’s did.' },
    { id: 'w-s4', topic: 'exec', kind: 'short', source: 'Exam 3 Practice Set S4 · key',
      prompt: 'Name the five components of an executive compensation package and explain why base salary is such a small share of the total.',
      points: [
        { label: 'Base salary', any: ['base'] },
        { label: 'Short-term / annual bonus', any: ['short-term', 'short term', 'annual', 'bonus'] },
        { label: 'Long-term incentives (stock options / grants)', any: ['long-term', 'long term', 'stock', 'option'] },
        { label: 'Benefits', any: ['benefit'] },
        { label: 'Perquisites (perks)', any: ['perquisite', 'perk'] },
        { label: 'Base is ~8.7%; pay is tied to performance / incentives are the bulk', any: ['8.7', 'performance', 'incentives are', 'bulk', 'shareholder', 'align'] }
      ],
      model: '(1) Base salary, (2) short-term/annual incentives (bonuses), (3) long-term incentives such as stock options and stock grants, (4) benefits, (5) perquisites. Base salary is only about 8.7% of total pay because executive pay is built to tie the executive’s outcome to the organization’s: short- and long-term incentives make up the bulk, so the executive is paid for performance rather than for holding the job, and long-term incentives align them with shareholder value. A balanced scorecard is preferred so the measures aren’t purely financial.' },
    { id: 'w-cr', topic: 'compa', kind: 'short', source: 'Exam 3 Study Guide 3.1–3.2',
      prompt: 'What is a compa-ratio? Explain how to read one and what HR should do when it is too low or too high.',
      points: [
        { label: 'Actual pay ÷ range midpoint (or market rate)', any: ['midpoint', 'market rate', 'divided by', '÷', 'divide'] },
        { label: 'Below 1 = below average; 1 = at; above 1 = above', any: ['below 1', 'less than 1', 'above 1', 'greater than 1', 'at average', 'below average', 'above average'] },
        { label: 'Ideal range 0.75–1.25', any: ['.75', '0.75', '1.25', '75%', '125%'] },
        { label: 'Low → raise pay / bring in line', any: ['raise', 'increase', 'in line'] },
        { label: 'High → freeze increases (tenure caveat)', any: ['freeze', 'tenure', 'experienc'] }
      ],
      model: 'A compa-ratio compares an employee’s pay to a benchmark: actual pay ÷ the range midpoint (internal, vs. pay policy) or ÷ the market rate (external). Below 1.0 means paid below average, 1.0 at average, above 1.0 above average; the ideal range is 0.75–1.25. Internally, low compa-ratios mean bringing pay up in line with policy; high ones mean freezing increases, keeping in mind that long-tenured, highly experienced employees can legitimately sit high. Externally, low means paying below market (consider raising); high means you’re likely attracting top talent but may consider decreasing.' },
    { id: 'w-payroll', topic: 'payroll', kind: 'short', source: 'Exam 3 Study Guide 4.3–4.6',
      prompt: 'List the six steps of the payroll process in order, and explain how net pay is calculated.',
      points: [
        { label: 'Time collection', any: ['time collection', 'collect time', 'timekeeping', 'hours worked'] },
        { label: 'Approval & entry', any: ['approv'] },
        { label: 'Calculations', any: ['calculat'] },
        { label: 'Review & audit', any: ['review', 'audit'] },
        { label: 'Disbursement', any: ['disburse', 'direct deposit', 'pay out', 'paycheck'] },
        { label: 'Reporting', any: ['report'] },
        { label: 'Net = gross − SS 6.2% − Medicare 1.45% − income tax − other', any: ['6.2', '1.45', '7.65', 'fica'] }
      ],
      model: 'Time collection → approval & entry → calculations → review & audit → disbursement → reporting (to the IRS and state). Net pay = gross pay − Social Security (6.2% of gross) − Medicare (1.45% of gross) − income tax withheld per the W-4 − other deductions like retirement or insurance. The percentages always come off gross, never a running balance.' },
    { id: 'w-contingent', topic: 'flex', kind: 'essay', source: 'Exam 3 Study Guide 5.1–5.4',
      prompt: 'Define a contingent (flexible) worker, name the four types, and give the three reasons their use is rising.',
      points: [
        { label: 'No contract (implicit or explicit) for ongoing employment', any: ['ongoing', 'no contract', 'implicit', 'explicit', 'long-term'] },
        { label: 'Leaving for personal reasons (school, retiring) is NOT contingent', any: ['school', 'retir', 'personal reason'] },
        { label: 'Part-time', any: ['part-time', 'part time'] },
        { label: 'Temporary / on-call', any: ['temporar', 'temp', 'on-call', 'on call', 'seasonal'] },
        { label: 'Leased (employee of a staffing agency)', any: ['leased', 'staffing', 'agency'] },
        { label: 'Independent contractors / freelancers / consultants', any: ['contractor', 'freelanc', 'consultant'] },
        { label: 'Reasons: recessions, international competition, service economy', any: ['recession', 'international', 'competition', 'offshor', 'service economy', 'manufacturing'] }
      ],
      model: 'Contingent workers are people with no implicit or explicit contract for ongoing employment, unlike core employees who expect a long-term relationship. Someone leaving for personal reasons (returning to school, retiring) is not contingent, but part-timers are. The four types: part-time employees; temporary and on-call workers; leased employees (legally employees of a staffing agency); and independent contractors, freelancers, and consultants. Use is rising because of economic recessions, international competition (contingent labor narrows the cost gap, including through offshoring), and the shift from manufacturing to a service economy.' },
    { id: 'w-tests', topic: 'flex', kind: 'short', source: 'Exam 3 Study Guide 5.6',
      prompt: 'Compare the common-law test and the economic realities test for deciding whether someone is an employee or an independent contractor.',
      points: [
        { label: 'Common law focuses on control (10 factors)', any: ['control', 'behavior', '10 factor', 'ten factor'] },
        { label: 'Economic realities focuses on economic dependence (6 factors)', any: ['dependen', 'economic', '6 factor', 'six factor'] },
        { label: 'Only economic realities: investment and risk of profit/loss', any: ['investment', 'profit', 'loss', 'risk'] },
        { label: 'Only common law: intent, tools, supervision, payment method', any: ['intent', 'tools', 'supervis', 'paid by', 'method of payment', 'by the project', 'hour'] },
        { label: 'Shared: integration, control, skill, continuing relationship', any: ['integration', 'skill', 'continuing', 'both'] }
      ],
      model: 'Both tests decide employee vs. independent contractor, and both come down to control, weighted differently. The common-law test has 10 factors focused on behavioral control: right to control, type of business, supervision, skill, tools and materials, continuing relationship, method of payment, integration, intent, and working for more than one firm. The economic realities test has 6 factors focused on economic dependence: integration, investment in facilities, right to control, risk of profit or loss, skill, and continuing relationship. Investment and risk appear only in economic realities; intent, tools, supervision, and payment method appear only in common law.' },
    { id: 'w-dbdc', topic: 'benefits', kind: 'short', source: 'Exam 3 Study Guide 2.5',
      prompt: 'Compare defined benefit and defined contribution retirement plans.',
      points: [
        { label: 'DB promises the benefit (pension); DC defines the contribution (401k)', any: ['pension', '401', 'benefit is defined', 'defined benefit', 'contribution is defined'] },
        { label: 'DB: employer bears investment risk', any: ['employer bear', 'employer carr', 'employer takes', 'employer risk', 'risk on the employer', 'employer absorbs'] },
        { label: 'DC: employee bears investment risk', any: ['employee bear', 'employee carr', 'employee takes', 'employee risk', 'risk on the employee', 'employee manages', 'employees manage'] },
        { label: 'DB encourages retention; DC facilitates mobility', any: ['retention', 'retain', 'mobility', 'portab', 'job hop'] },
        { label: 'Trend: DC now far more common (64% vs 15%)', any: ['64', '15', 'more common', 'shift', 'fewer'] }
      ],
      model: 'A defined benefit plan (a traditional pension) promises a specific retirement benefit, so the employer bears the investment risk, the cost doesn’t vary with ability to pay, and it encourages retention. A defined contribution plan (like a 401(k)) defines only the employer’s contribution, so the employee bears the investment risk and must manage it; it varies with ability to pay and facilitates mobility. About 64% of private employers now offer DC versus about 15% DB, reversed from a few decades ago.' },
    { id: 'w-required', topic: 'benefits', kind: 'essay', source: 'Exam 3 Study Guide Part 2',
      prompt: 'Which benefits are legally required, and which are discretionary? Include the key compliance laws and their numbers.',
      points: [
        { label: 'Required: workers’ compensation', any: ['workers', 'worker’s', "worker's comp", 'workers comp'] },
        { label: 'Required: Social Security / Medicare', any: ['social security', 'medicare', 'fica', 'oasdi'] },
        { label: 'Required: unemployment insurance', any: ['unemployment'] },
        { label: 'Discretionary: retirement, health, life, PTO', any: ['discretion', 'optional', 'retirement', 'health insurance', 'vacation', 'pto', 'life insurance'] },
        { label: 'FMLA: 50+ employees, 12 weeks unpaid', any: ['fmla', '12 week', 'twelve week'] },
        { label: 'COBRA: 20+ employees, up to 102%', any: ['cobra', '102'] }
      ],
      model: 'Three benefits are legally required: workers’ compensation, Social Security/Medicare, and unemployment insurance. Retirement plans, health insurance, life insurance, and paid time off are discretionary. Compliance laws: FMLA (1993) covers employers with 50+ employees within 75 miles and gives up to 12 weeks of unpaid leave; COBRA (1985) covers 20+ employees and lets a former employee keep group health coverage at up to 102% of the premium for 18 months (up to 36); HIPAA (1996) limits preexisting-condition denials and protects privacy; ERISA (1974) doesn’t require a pension but regulates one if offered.' },
    { id: 'w-grew', topic: 'benefits', kind: 'short', source: 'Exam 3 Study Guide 1.2 & 1.4',
      prompt: 'Why did employee benefits grow, and what three objectives guide benefit planning?',
      points: [
        { label: 'Wage and price controls (WWII / Korea)', any: ['wage and price', 'wage & price', 'price control', 'war', 'wwii', 'korea'] },
        { label: 'Unions', any: ['union', 'wagner', 'nlrb'] },
        { label: 'Cost / tax effectiveness', any: ['tax', 'cost effective', 'cheaper'] },
        { label: 'Government impetus / employer impetus', any: ['government', 'employer impetus', 'law', 'attract', 'retain'] },
        { label: 'Objectives: competitiveness, adequacy, cost effectiveness', any: ['competitive', 'adequa'] }
      ],
      model: 'Benefits grew because of wage and price controls during WWII and Korea (employers couldn’t raise wages, so they competed on benefits), union bargaining power after the Wagner Act and 1940s NLRB rulings, employer impetus to attract and retain workers, cost and tax effectiveness, and government impetus through required benefits. Benefit planning weighs three objectives: competitiveness (what other firms offer), adequacy (whether the benefit is enough to matter), and cost effectiveness (whether it’s worth the cost).' },
    { id: 'w-exec-bonus', topic: 'exec', kind: 'short', source: 'Exam 3 Study Guide 6.1–6.2',
      prompt: 'Explain executive bonus plans: their purpose, how they are measured, and the difference between perquisites and benefits.',
      points: [
        { label: 'Purpose: motivate short-term performance', any: ['short-term', 'short term', 'motivat'] },
        { label: 'Measures: profit, revenue, cash flow', any: ['profit', 'revenue', 'cash flow'] },
        { label: 'Balanced scorecard / non-financial measures', any: ['balanced scorecard', 'non-financial', 'nonfinancial', 'strategic'] },
        { label: 'Bonuses are a shrinking share of exec pay', any: ['smaller', 'shrink', 'declin', 'less of'] },
        { label: 'Perks = position-based, extend to family; benefits = insurance/retirement', any: ['perk', 'perquisite', 'position', 'family', 'depend', 'car'] }
      ],
      model: 'Annual bonus plans motivate better short-term performance, and nearly every private-sector executive has one. They are commonly measured on profit, revenue, and cash flow, with non-financial measures that can be strategic, individual, or discretionary; a balanced scorecard is preferred. Bonuses have become a smaller share of executive pay as long-term incentives grow. Perquisites are privileges that come with the position and often extend to the family (like a company car), while benefits are the insurance and retirement package. Both are separate items on the list of five.' }
  ],

  /* Formula-sheet lookup drill: sections match "MGT 354 – Formula Sheet (Exam 3)". */
  sheet: [
    { n: 1, name: 'Compa-Ratio' }, { n: 2, name: 'Payroll Taxes & Net Pay' }, { n: 3, name: 'Payroll Process & Forms' }, { n: 4, name: 'Executive Compensation' },
    { n: 5, name: 'Flexible / Contingent Workforce' }, { n: 6, name: 'Employee vs. Contractor' }, { n: 7, name: 'Benefits — numbers & laws' }, { n: 8, name: 'Retirement & Health Plan Types' }
  ],
  lookup: [
    { q: 'Jordan earns $46,750. The grade midpoint is $55,000. Is Jordan paid in line with policy?', f: 'Pay ÷ midpoint', s: 1 },
    { q: 'Five people in a grade earn different amounts. Find the grade’s overall compa-ratio.', f: '(Σ pay ÷ # employees) ÷ midpoint', s: 1 },
    { q: 'A compa-ratio is 1.12 and the midpoint is $64,000. What is the employee paid?', f: 'CR × midpoint', s: 1 },
    { q: 'An employee earns $3,200 gross with $412 tax withheld. What is take-home pay?', f: 'Gross − 6.2% − 1.45% − tax − other', s: 2 },
    { q: 'What does the employer really pay for an employee earning $50,000?', f: 'Gross + 7.65% FICA + FUTA/SUTA', s: 2 },
    { q: 'How much federal unemployment tax per worker earning over $7,000?', f: '0.6% × $7,000', s: 2 },
    { q: 'Which payroll step comes right before disbursement?', f: 'Collect → approve → calculate → review/audit → disburse → report', s: 3 },
    { q: 'A freelancer is paid on a 1099. What does that tell you?', f: '1099 = independent contractor', s: 3 },
    { q: 'A CEO’s base is $435,000. Estimate the whole package.', f: 'Base ÷ 0.087', s: 4 },
    { q: 'The bonus is $60,000 per quarter. How much goes into total comp?', f: 'Quarterly × 4', s: 4 },
    { q: 'What share of an exec’s package is long-term incentives?', f: 'Component ÷ total package', s: 4 },
    { q: 'A leased worker costs $21.50/hr for 38 hours with the agency fee. What does the client pay?', f: '(Rate × hours) × 1.25', s: 5 },
    { q: 'Is a worker who’s leaving in May for grad school a contingent worker?', f: 'Personal reasons → NOT contingent', s: 5 },
    { q: 'The worker invested in their own equipment and can make a profit or loss. Which test is that?', f: 'Economic realities test', s: 6 },
    { q: 'An injured worker earned $1,150/week and is 40% disabled. What is the weekly benefit?', f: '2/3 × weekly wage × % disability', s: 7 },
    { q: 'How long until the company’s pension contributions belong to the employee?', f: 'Vesting: 3 yr cliff or 20%/yr to 6', s: 7 },
    { q: 'A laid-off worker wants to keep their health plan. What can they be charged?', f: 'COBRA: up to 102% of premium', s: 7 },
    { q: 'Who carries the investment risk in a 401(k)?', f: 'DC → employee bears risk', s: 8 },
    { q: 'The plan lets you choose HMO or PPO at the time of service. What is it?', f: 'POS = HMO/PPO hybrid', s: 8 },
    { q: 'A visit costs 20% of the bill after the deductible. What is that called?', f: 'Coinsurance (a percentage)', s: 8 }
  ]
};
